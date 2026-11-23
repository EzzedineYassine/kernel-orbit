"""UCI Online Retail preprocessing, chronological split, and sparse matrix construction.

Dataset: UCI Online Retail (ID: 352)
Source:  https://archive.ics.uci.edu/dataset/352/online+retail
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
RAW_XLSX_PATH = DATA_DIR / "online_retail.xlsx"
RAW_PARQUET_PATH = DATA_DIR / "online_retail_raw.parquet"

TRAIN_TIME_QUANTILE = 0.80
MIN_USER_INTERACTIONS = 5
MIN_ITEM_INTERACTIONS = 5
MERCHANDISE_CODE_REGEX = r"^\d{5}[A-Z]*$"


@dataclass(frozen=True)
class ProductRecord:
    stock_code: str
    item_index: int
    description: str
    train_customers: int
    train_purchases: int
    train_total_quantity: int
    avg_unit_price: float


@dataclass(frozen=True)
class CustomerRecord:
    customer_id: str  # Privacy-safe pseudonymized label, e.g. "CUST-12347"
    raw_customer_id: str
    user_index: int
    country: str
    unique_products: int
    total_invoices: int
    total_quantity: int
    total_spend: float


@dataclass(frozen=True)
class PreprocessingStats:
    raw_rows: int
    cancelled_invoices_removed: int
    non_positive_qty_removed: int
    non_positive_price_removed: int
    missing_customer_id_removed: int
    missing_description_rows: int
    non_merchandise_codes_removed: int
    clean_transaction_rows: int
    date_min: str
    date_max: str
    split_cutoff_date: str
    train_transaction_rows: int
    test_transaction_rows: int
    min_user_interactions: int
    min_item_interactions: int
    interaction_strength_formula: str
    quantity_median: float
    quantity_p99: float
    quantity_max: int
    num_users: int
    num_items: int
    train_interactions: int
    matrix_density: float
    matrix_sparsity: float
    test_total_users: int
    test_cold_start_users: int
    test_warm_eval_users: int


@dataclass(frozen=True)
class OrbitDataset:
    """Immutable processed UCI Online Retail dataset with chronological split."""

    train_user_items: csr_matrix  # shape (num_users, num_items), float32 log1p(purchase_count)
    users: tuple[CustomerRecord, ...]
    items: tuple[ProductRecord, ...]
    user_id_to_index: dict[str, int]  # maps BOTH "CUST-12347" and "12347" -> user_index
    stock_code_to_index: dict[str, int]
    # Per user_index: tuple of (item_index, purchase_count, total_qty, last_date_iso)
    user_history: dict[int, tuple[tuple[int, int, int, str], ...]]
    # Per warm eval user_index: frozenset of unseen test item_indices (in catalog, not in train)
    test_ground_truth: dict[int, frozenset[int]]
    # Popularity ordering (item_indices sorted by distinct train customers desc)
    popularity_ranking: tuple[int, ...]
    # Sampled sparse matrix block for visual heatmap explanation (top users x top items)
    sample_matrix_users: tuple[str, ...]
    sample_matrix_items: tuple[str, ...]
    sample_matrix_values: tuple[tuple[float, ...], ...]
    stats: PreprocessingStats


def format_customer_id(raw_id: str) -> str:
    cleaned = str(raw_id).strip().upper()
    if cleaned.startswith("CUST-"):
        return cleaned
    return f"CUST-{cleaned}"


def _load_raw_dataframe(
    xlsx_path: Path = RAW_XLSX_PATH,
    parquet_path: Path = RAW_PARQUET_PATH,
) -> pd.DataFrame:
    if parquet_path.exists():
        return pd.read_parquet(parquet_path)
    if not xlsx_path.exists():
        raise FileNotFoundError(
            f"UCI Online Retail dataset not found at {xlsx_path}. "
            "Run `python scripts/download_dataset.py` inside backend/."
        )
    df = pd.read_excel(
        xlsx_path,
        dtype={
            "InvoiceNo": str,
            "StockCode": str,
            "Description": str,
            "Country": str,
        },
    )
    try:
        df.to_parquet(parquet_path, index=False)
    except Exception:
        # Caching is an optimization; never fail loading if parquet cannot be written.
        pass
    return df


def preprocess_online_retail(
    raw_df: pd.DataFrame | None = None,
    min_user_interactions: int = MIN_USER_INTERACTIONS,
    min_item_interactions: int = MIN_ITEM_INTERACTIONS,
    train_quantile: float = TRAIN_TIME_QUANTILE,
) -> OrbitDataset:
    """Clean UCI Online Retail transactions and build chronological train/test splits."""
    df = _load_raw_dataframe() if raw_df is None else raw_df.copy()
    raw_rows = int(len(df))

    inv_series = df["InvoiceNo"].astype(str).str.strip()
    sc_series = df["StockCode"].astype(str).str.strip().str.upper()

    is_cancelled = inv_series.str.startswith("C")
    is_non_pos_qty = df["Quantity"] <= 0
    is_non_pos_price = df["UnitPrice"] <= 0
    is_missing_cust = df["CustomerID"].isna()
    is_missing_desc = df["Description"].isna() | (
        df["Description"].astype(str).str.strip() == ""
    )
    is_merchandise = sc_series.str.match(MERCHANDISE_CODE_REGEX)

    cancelled_count = int(is_cancelled.sum())
    non_pos_qty_count = int(is_non_pos_qty.sum())
    non_pos_price_count = int(is_non_pos_price.sum())
    missing_cust_count = int(is_missing_cust.sum())
    missing_desc_count = int(is_missing_desc.sum())

    # Apply transaction validity filters first, then count operational non-merchandise codes removed.
    valid_mask = (~is_cancelled) & (~is_non_pos_qty) & (~is_non_pos_price) & (~is_missing_cust)
    non_merch_removed = int((valid_mask & (~is_merchandise)).sum())

    clean = df[valid_mask & is_merchandise].copy()
    clean["InvoiceNo"] = inv_series[clean.index]
    clean["StockCode"] = sc_series[clean.index]
    clean["CustomerID"] = clean["CustomerID"].astype(np.int64).astype(str)
    clean["InvoiceDate"] = pd.to_datetime(clean["InvoiceDate"])
    clean["Description"] = (
        clean["Description"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
    )
    clean["Country"] = clean["Country"].fillna("Unknown").astype(str).str.strip()

    clean_rows = int(len(clean))
    date_min = clean["InvoiceDate"].min().strftime("%Y-%m-%d")
    date_max = clean["InvoiceDate"].max().strftime("%Y-%m-%d")
    qty_median = float(clean["Quantity"].median())
    qty_p99 = float(clean["Quantity"].quantile(0.99))
    qty_max = int(clean["Quantity"].max())

    # Chronological train/test split (no random shuffling; zero future leakage).
    cutoff_ts = clean["InvoiceDate"].quantile(train_quantile)
    split_cutoff_str = cutoff_ts.strftime("%Y-%m-%d %H:%M")

    train_raw = clean[clean["InvoiceDate"] < cutoff_ts].copy()
    test_raw = clean[clean["InvoiceDate"] >= cutoff_ts].copy()

    # Apply minimum interaction thresholds strictly on the training split (zero leakage).
    train_pairs = train_raw[["CustomerID", "StockCode"]].drop_duplicates()
    user_pair_counts = train_pairs.groupby("CustomerID").size()
    item_pair_counts = train_pairs.groupby("StockCode").size()

    valid_users = set(user_pair_counts[user_pair_counts >= min_user_interactions].index)
    valid_items = set(item_pair_counts[item_pair_counts >= min_item_interactions].index)

    train_df = train_raw[
        train_raw["CustomerID"].isin(valid_users)
        & train_raw["StockCode"].isin(valid_items)
    ].copy()

    # Re-confirm non-empty users and items after joint filtering.
    final_users = sorted(train_df["CustomerID"].unique().tolist())
    final_items = sorted(train_df["StockCode"].unique().tolist())
    raw_u2i = {u: idx for idx, u in enumerate(final_users)}
    p2i = {p: idx for idx, p in enumerate(final_items)}

    # Canonical product descriptions derived strictly from training observations
    # (picking most frequent non-empty description per StockCode).
    desc_non_empty = train_df[train_df["Description"] != ""]
    canonical_desc: dict[str, str] = {}
    if not desc_non_empty.empty:
        desc_counts = (
            desc_non_empty.groupby(["StockCode", "Description"])
            .size()
            .reset_index(name="cnt")
            .sort_values(["StockCode", "cnt", "Description"], ascending=[True, False, True])
        )
        canonical_desc = (
            desc_counts.drop_duplicates("StockCode")
            .set_index("StockCode")["Description"]
            .to_dict()
        )

    # Aggregate customer-product interactions on TRAIN split only.
    # Interaction strength uses log1p(distinct_purchase_invoices) to dampen
    # wholesale quantity outliers (max single order = 80,995 units) while
    # rewarding genuine repeat purchases across separate orders.
    agg = (
        train_df.groupby(["CustomerID", "StockCode"])
        .agg(
            purchase_count=("InvoiceNo", "nunique"),
            total_qty=("Quantity", "sum"),
            last_date=("InvoiceDate", "max"),
        )
        .reset_index()
    )
    agg["user_idx"] = agg["CustomerID"].map(raw_u2i).astype(np.int32)
    agg["item_idx"] = agg["StockCode"].map(p2i).astype(np.int32)
    agg["strength"] = np.log1p(agg["purchase_count"].astype(np.float64)).astype(np.float32)

    num_users = len(final_users)
    num_items = len(final_items)
    train_csr = csr_matrix(
        (agg["strength"].values, (agg["user_idx"].values, agg["item_idx"].values)),
        shape=(num_users, num_items),
        dtype=np.float32,
    )
    train_csr.eliminate_zeros()

    # Build customer metadata records (from training split only).
    train_df["LineSpend"] = train_df["Quantity"] * train_df["UnitPrice"]
    cust_meta = (
        train_df.groupby("CustomerID")
        .agg(
            country=("Country", lambda s: s.mode().iloc[0] if not s.mode().empty else "Unknown"),
            unique_products=("StockCode", "nunique"),
            total_invoices=("InvoiceNo", "nunique"),
            total_quantity=("Quantity", "sum"),
            total_spend=("LineSpend", "sum"),
        )
        .to_dict(orient="index")
    )

    user_records: list[CustomerRecord] = []
    user_id_to_index: dict[str, int] = {}
    for idx, raw_uid in enumerate(final_users):
        m = cust_meta[raw_uid]
        pub_id = format_customer_id(raw_uid)
        user_records.append(
            CustomerRecord(
                customer_id=pub_id,
                raw_customer_id=raw_uid,
                user_index=idx,
                country=str(m["country"]),
                unique_products=int(m["unique_products"]),
                total_invoices=int(m["total_invoices"]),
                total_quantity=int(m["total_quantity"]),
                total_spend=round(float(m["total_spend"]), 2),
            )
        )
        user_id_to_index[pub_id] = idx
        user_id_to_index[raw_uid] = idx

    # Build product metadata records (from training split only).
    prod_meta = (
        train_df.groupby("StockCode")
        .agg(
            train_customers=("CustomerID", "nunique"),
            train_purchases=("InvoiceNo", "nunique"),
            train_total_quantity=("Quantity", "sum"),
            avg_unit_price=("UnitPrice", "mean"),
        )
        .to_dict(orient="index")
    )

    item_records: list[ProductRecord] = []
    for idx, code in enumerate(final_items):
        pm = prod_meta[code]
        desc = canonical_desc.get(code) or f"Gift Item {code}"
        item_records.append(
            ProductRecord(
                stock_code=code,
                item_index=idx,
                description=desc,
                train_customers=int(pm["train_customers"]),
                train_purchases=int(pm["train_purchases"]),
                train_total_quantity=int(pm["train_total_quantity"]),
                avg_unit_price=round(float(pm["avg_unit_price"]), 2),
            )
        )

    # Per-user sorted history lookup (most frequently purchased / recent first).
    agg_sorted = agg.sort_values(
        ["user_idx", "purchase_count", "total_qty", "last_date"],
        ascending=[True, False, False, False],
    )
    user_history: dict[int, tuple[tuple[int, int, int, str], ...]] = {}
    train_seen_items: dict[int, set[int]] = {}
    for uidx, grp in agg_sorted.groupby("user_idx", sort=False):
        uidx_int = int(uidx)
        rows_tuple = tuple(
            (
                int(r.item_idx),
                int(r.purchase_count),
                int(r.total_qty),
                r.last_date.strftime("%Y-%m-%d"),
            )
            for r in grp.itertuples(index=False)
        )
        user_history[uidx_int] = rows_tuple
        train_seen_items[uidx_int] = {item_i for item_i, _, _, _ in rows_tuple}

    # Chronological holdout ground truth:
    # Cold-start test users have zero training history and are counted explicitly;
    # warm test users are evaluated on items purchased in the test window that
    # are in the known catalog AND were NOT already purchased during training.
    test_all_users = set(test_raw["CustomerID"].unique().tolist())
    warm_user_set = set(final_users)
    cold_start_users = test_all_users - warm_user_set

    test_in_catalog = test_raw[
        test_raw["CustomerID"].isin(warm_user_set)
        & test_raw["StockCode"].isin(p2i)
    ]
    test_ground_truth: dict[int, frozenset[int]] = {}
    for raw_uid, grp in test_in_catalog.groupby("CustomerID"):
        uidx = raw_u2i[str(raw_uid)]
        seen = train_seen_items.get(uidx, set())
        unseen_test_items = frozenset(
            p2i[code] for code in grp["StockCode"].unique() if p2i[code] not in seen
        )
        if unseen_test_items:
            test_ground_truth[uidx] = unseen_test_items

    # Popularity baseline ranking: items ordered by distinct training customers desc.
    popularity_ranking = tuple(
        sorted(
            range(num_items),
            key=lambda i: (
                -item_records[i].train_customers,
                -item_records[i].train_purchases,
                item_records[i].stock_code,
            ),
        )
    )

    # Sampled 12x16 real interaction submatrix for the Laboratory Matrix Explanation heatmap.
    top_user_indices = sorted(
        range(num_users),
        key=lambda u: (-user_records[u].unique_products, user_records[u].customer_id),
    )[:12]
    top_item_indices = list(popularity_ranking[:16])
    sub = train_csr[top_user_indices, :][:, top_item_indices].toarray()
    sample_users = tuple(user_records[u].customer_id for u in top_user_indices)
    sample_items = tuple(item_records[i].stock_code for i in top_item_indices)
    sample_vals = tuple(tuple(round(float(v), 3) for v in row) for row in sub)

    nnz = int(train_csr.nnz)
    density = float(nnz / (num_users * num_items)) if (num_users and num_items) else 0.0

    stats = PreprocessingStats(
        raw_rows=raw_rows,
        cancelled_invoices_removed=cancelled_count,
        non_positive_qty_removed=non_pos_qty_count,
        non_positive_price_removed=non_pos_price_count,
        missing_customer_id_removed=missing_cust_count,
        missing_description_rows=missing_desc_count,
        non_merchandise_codes_removed=non_merch_removed,
        clean_transaction_rows=clean_rows,
        date_min=date_min,
        date_max=date_max,
        split_cutoff_date=split_cutoff_str,
        train_transaction_rows=int(len(train_raw)),
        test_transaction_rows=int(len(test_raw)),
        min_user_interactions=min_user_interactions,
        min_item_interactions=min_item_interactions,
        interaction_strength_formula="r_ui = log(1 + distinct_invoice_count)",
        quantity_median=qty_median,
        quantity_p99=qty_p99,
        quantity_max=qty_max,
        num_users=num_users,
        num_items=num_items,
        train_interactions=nnz,
        matrix_density=round(density, 6),
        matrix_sparsity=round(1.0 - density, 6),
        test_total_users=len(test_all_users),
        test_cold_start_users=len(cold_start_users),
        test_warm_eval_users=len(test_ground_truth),
    )

    return OrbitDataset(
        train_user_items=train_csr,
        users=tuple(user_records),
        items=tuple(item_records),
        user_id_to_index=user_id_to_index,
        stock_code_to_index=p2i,
        user_history=user_history,
        test_ground_truth=test_ground_truth,
        popularity_ranking=popularity_ranking,
        sample_matrix_users=sample_users,
        sample_matrix_items=sample_items,
        sample_matrix_values=sample_vals,
        stats=stats,
    )


@lru_cache(maxsize=1)
def get_orbit_dataset() -> OrbitDataset:
    """Load and cache the preprocessed UCI Online Retail dataset."""
    return preprocess_online_retail()
