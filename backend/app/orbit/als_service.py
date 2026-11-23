"""Thread-safe Implicit ALS Matrix Factorization recommendation service for ORBIT."""

from __future__ import annotations

import threading
import time
from dataclasses import dataclass

import numpy as np
from implicit.als import AlternatingLeastSquares
from sklearn.decomposition import PCA
from threadpoolctl import threadpool_limits

from app.orbit.evaluator import evaluate_als_vs_popularity
from app.orbit.preprocessing import (
    OrbitDataset,
    format_customer_id,
    get_orbit_dataset,
)
from app.schemas.orbit import (
    ALSConfig,
    CustomerHistoryResponse,
    CustomersListResponse,
    CustomerSummary,
    DatasetSummaryResponse,
    LatentPoint,
    LatentSpaceResponse,
    ModelMetricsResponse,
    OrbitHealthResponse,
    ProductSearchResponse,
    ProductSummary,
    PurchaseHistoryItem,
    RecommendationsResponse,
    RecommendedProduct,
    RetrainResponse,
    SampleMatrixBlock,
    SimilarCustomerItem,
    SimilarProductItem,
    SimilarProductsResponse,
)

ORBIT_API_VERSION = "1.0.0"
UCI_SOURCE_URL = "https://archive.ics.uci.edu/dataset/352/online+retail"


class EntityNotFoundError(KeyError):
    """Raised when a requested customer or product does not exist in the catalog."""


class ModelNotTrainedError(RuntimeError):
    """Raised when inference is requested before a model snapshot exists."""


@dataclass(frozen=True)
class ALSSnapshot:
    config: ALSConfig
    model: AlternatingLeastSquares
    train_seconds: float
    metrics: ModelMetricsResponse


class ALSRecommendationService:
    """In-memory, thread-safe Implicit ALS collaborative filtering service."""

    def __init__(self, dataset: OrbitDataset | None = None, auto_train: bool = True) -> None:
        self._dataset = dataset
        self._lock = threading.RLock()
        self._snapshot: ALSSnapshot | None = None
        if auto_train:
            self._ensure_dataset()
            self.retrain(ALSConfig())

    def _ensure_dataset(self) -> OrbitDataset:
        if self._dataset is None:
            self._dataset = get_orbit_dataset()
        return self._dataset

    @property
    def dataset(self) -> OrbitDataset:
        return self._ensure_dataset()

    def _require_snapshot(self) -> ALSSnapshot:
        with self._lock:
            if self._snapshot is None:
                raise ModelNotTrainedError("ALS model has not been trained yet.")
            return self._snapshot

    def _fit_snapshot(self, config: ALSConfig) -> ALSSnapshot:
        ds = self.dataset
        t0 = time.perf_counter()
        # Prevent OpenBLAS thread oversubscription during ALS init & Cholesky solves.
        with threadpool_limits(limits=1, user_api="blas"):
            model = AlternatingLeastSquares(
                factors=config.factors,
                regularization=config.regularization,
                alpha=config.alpha,
                iterations=config.iterations,
                random_state=config.random_state,
            )
            model.fit(ds.train_user_items, show_progress=False)
        train_seconds = round(time.perf_counter() - t0, 3)

        metrics = evaluate_als_vs_popularity(ds, model, config, max_k=10)
        return ALSSnapshot(
            config=config,
            model=model,
            train_seconds=train_seconds,
            metrics=metrics,
        )

    def retrain(self, config: ALSConfig) -> RetrainResponse:
        snapshot = self._fit_snapshot(config)
        with self._lock:
            self._snapshot = snapshot
        return RetrainResponse(
            status="retrained",
            config=snapshot.config,
            train_seconds=snapshot.train_seconds,
            metrics=snapshot.metrics,
        )

    def configure(
        self,
        factors: int | None = None,
        iterations: int | None = None,
        regularization: float | None = None,
        alpha: float | None = None,
        random_state: int | None = None,
    ) -> RetrainResponse:
        with self._lock:
            current = self._snapshot.config if self._snapshot is not None else ALSConfig()
        next_cfg = ALSConfig(
            factors=current.factors if factors is None else factors,
            iterations=current.iterations if iterations is None else iterations,
            regularization=current.regularization if regularization is None else regularization,
            alpha=current.alpha if alpha is None else alpha,
            random_state=current.random_state if random_state is None else random_state,
        )
        return self.retrain(next_cfg)

    def health(self) -> OrbitHealthResponse:
        ds = self.dataset
        with self._lock:
            snap = self._snapshot
        return OrbitHealthResponse(
            status="ok",
            service="orbit-als-backend",
            project="KERNEL / ORBIT",
            algorithm="Implicit Matrix Factorization (ALS)",
            version=ORBIT_API_VERSION,
            model_trained=snap is not None,
            num_users=ds.stats.num_users,
            num_items=ds.stats.num_items,
            active_config=snap.config if snap is not None else ALSConfig(),
            last_train_seconds=snap.train_seconds if snap is not None else 0.0,
        )

    def dataset_summary(self) -> DatasetSummaryResponse:
        ds = self.dataset
        st = ds.stats
        return DatasetSummaryResponse(
            dataset_name="UCI Online Retail (Gift Retailer Transactions)",
            source_url=UCI_SOURCE_URL,
            raw_rows=st.raw_rows,
            cancelled_invoices_removed=st.cancelled_invoices_removed,
            non_positive_qty_removed=st.non_positive_qty_removed,
            non_positive_price_removed=st.non_positive_price_removed,
            missing_customer_id_removed=st.missing_customer_id_removed,
            missing_description_rows=st.missing_description_rows,
            non_merchandise_codes_removed=st.non_merchandise_codes_removed,
            clean_transaction_rows=st.clean_transaction_rows,
            date_min=st.date_min,
            date_max=st.date_max,
            split_cutoff_date=st.split_cutoff_date,
            train_transaction_rows=st.train_transaction_rows,
            test_transaction_rows=st.test_transaction_rows,
            min_user_interactions=st.min_user_interactions,
            min_item_interactions=st.min_item_interactions,
            interaction_strength_formula=st.interaction_strength_formula,
            quantity_median=st.quantity_median,
            quantity_p99=st.quantity_p99,
            quantity_max=st.quantity_max,
            num_users=st.num_users,
            num_items=st.num_items,
            train_interactions=st.train_interactions,
            matrix_density=st.matrix_density,
            matrix_sparsity=st.matrix_sparsity,
            test_total_users=st.test_total_users,
            test_cold_start_users=st.test_cold_start_users,
            test_warm_eval_users=st.test_warm_eval_users,
            sample_matrix=SampleMatrixBlock(
                users=list(ds.sample_matrix_users),
                items=list(ds.sample_matrix_items),
                values=[list(row) for row in ds.sample_matrix_values],
            ),
        )

    def _resolve_user_index(self, customer_id: str) -> int:
        ds = self.dataset
        key = customer_id.strip().upper()
        if key in ds.user_id_to_index:
            return ds.user_id_to_index[key]
        alt = format_customer_id(key)
        if alt in ds.user_id_to_index:
            return ds.user_id_to_index[alt]
        raise EntityNotFoundError(f"Customer '{customer_id}' not found in trained catalog.")

    def _resolve_item_index(self, product_id: str) -> int:
        ds = self.dataset
        key = product_id.strip().upper()
        if key in ds.stock_code_to_index:
            return ds.stock_code_to_index[key]
        raise EntityNotFoundError(f"Product '{product_id}' not found in trained catalog.")

    def list_customers(
        self,
        search: str = "",
        limit: int = 40,
        prioritize_eval: bool = True,
    ) -> CustomersListResponse:
        ds = self.dataset
        q = search.strip().upper()
        matched = [
            u
            for u in ds.users
            if not q or q in u.customer_id or q in u.country.upper()
        ]
        # Order interesting active customers first (warm test users with rich histories).
        matched.sort(
            key=lambda u: (
                0 if (prioritize_eval and u.user_index in ds.test_ground_truth) else 1,
                -u.unique_products,
                u.customer_id,
            )
        )
        sliced = matched[: max(1, min(200, limit))]
        return CustomersListResponse(
            total_customers=len(matched),
            returned=len(sliced),
            customers=[
                CustomerSummary(
                    customer_id=u.customer_id,
                    country=u.country,
                    unique_products=u.unique_products,
                    total_invoices=u.total_invoices,
                    total_quantity=u.total_quantity,
                    total_spend=u.total_spend,
                    has_test_purchases=u.user_index in ds.test_ground_truth,
                )
                for u in sliced
            ],
        )

    def customer_history(self, customer_id: str, limit: int = 25) -> CustomerHistoryResponse:
        snap = self._require_snapshot()
        ds = self.dataset
        uidx = self._resolve_user_index(customer_id)
        user = ds.users[uidx]

        raw_hist = ds.user_history.get(uidx, ())[: max(1, min(100, limit))]
        history_items: list[PurchaseHistoryItem] = []
        for item_idx, purchase_cnt, total_qty, last_date in raw_hist:
            prod = ds.items[item_idx]
            strength = float(ds.train_user_items[uidx, item_idx])
            history_items.append(
                PurchaseHistoryItem(
                    stock_code=prod.stock_code,
                    description=prod.description,
                    purchase_count=purchase_cnt,
                    total_quantity=total_qty,
                    interaction_strength=round(strength, 4),
                    last_purchase_date=last_date,
                    avg_unit_price=prod.avg_unit_price,
                )
            )

        user_vec = np.asarray(snap.model.user_factors[uidx], dtype=np.float64)
        latent_norm = float(np.linalg.norm(user_vec))

        sim_ids, sim_scores = snap.model.similar_users(uidx, N=6)
        similar_customers: list[SimilarCustomerItem] = []
        for sid, sscore in zip(sim_ids.tolist(), sim_scores.tolist(), strict=True):
            if int(sid) == uidx or int(sid) < 0:
                continue
            su = ds.users[int(sid)]
            similar_customers.append(
                SimilarCustomerItem(
                    customer_id=su.customer_id,
                    country=su.country,
                    unique_products=su.unique_products,
                    similarity_score=round(float(sscore), 4),
                )
            )
            if len(similar_customers) == 5:
                break

        return CustomerHistoryResponse(
            customer=CustomerSummary(
                customer_id=user.customer_id,
                country=user.country,
                unique_products=user.unique_products,
                total_invoices=user.total_invoices,
                total_quantity=user.total_quantity,
                total_spend=user.total_spend,
                has_test_purchases=uidx in ds.test_ground_truth,
            ),
            history=history_items,
            latent_factors=[round(float(v), 4) for v in user_vec],
            latent_norm=round(latent_norm, 4),
            similar_customers=similar_customers,
        )

    def recommend(self, customer_id: str, n: int = 10) -> RecommendationsResponse:
        snap = self._require_snapshot()
        ds = self.dataset
        uidx = self._resolve_user_index(customer_id)
        user = ds.users[uidx]
        top_n = max(1, min(20, n))

        item_ids, scores = snap.model.recommend(
            uidx,
            ds.train_user_items[uidx],
            N=top_n,
            filter_already_liked_items=True,
        )
        gt_test_set = ds.test_ground_truth.get(uidx, frozenset())
        user_vec = np.asarray(snap.model.user_factors[uidx], dtype=np.float64)

        recs: list[RecommendedProduct] = []
        for rank, (item_idx_raw, score_raw) in enumerate(
            zip(item_ids.tolist(), scores.tolist(), strict=True), start=1
        ):
            item_idx = int(item_idx_raw)
            if item_idx < 0:
                continue
            prod = ds.items[item_idx]
            item_vec = np.asarray(snap.model.item_factors[item_idx], dtype=np.float64)
            recs.append(
                RecommendedProduct(
                    rank=rank,
                    stock_code=prod.stock_code,
                    description=prod.description,
                    score=round(float(score_raw), 5),
                    train_customers=prod.train_customers,
                    avg_unit_price=prod.avg_unit_price,
                    item_factors_preview=[round(float(v), 4) for v in item_vec[:8]],
                    in_chronological_test=item_idx in gt_test_set,
                )
            )

        return RecommendationsResponse(
            customer_id=user.customer_id,
            config=snap.config,
            excluded_purchased_count=len(ds.user_history.get(uidx, ())),
            user_factors_preview=[round(float(v), 4) for v in user_vec[:8]],
            recommendations=recs,
        )

    def search_products(self, query: str = "", limit: int = 20) -> ProductSearchResponse:
        ds = self.dataset
        q = query.strip().upper()
        if not q:
            matched_indices = list(ds.popularity_ranking)
        else:
            matched_indices = [
                i
                for i in ds.popularity_ranking
                if q in ds.items[i].stock_code or q in ds.items[i].description.upper()
            ]
        sliced = matched_indices[: max(1, min(100, limit))]
        return ProductSearchResponse(
            query=query,
            total_matches=len(matched_indices),
            products=[
                ProductSummary(
                    stock_code=ds.items[i].stock_code,
                    description=ds.items[i].description,
                    train_customers=ds.items[i].train_customers,
                    train_purchases=ds.items[i].train_purchases,
                    train_total_quantity=ds.items[i].train_total_quantity,
                    avg_unit_price=ds.items[i].avg_unit_price,
                )
                for i in sliced
            ],
        )

    def similar_products(self, product_id: str, n: int = 8) -> SimilarProductsResponse:
        snap = self._require_snapshot()
        ds = self.dataset
        item_idx = self._resolve_item_index(product_id)
        prod = ds.items[item_idx]
        top_n = max(1, min(20, n))

        sim_ids, sim_scores = snap.model.similar_items(item_idx, N=top_n + 1)
        sim_list: list[SimilarProductItem] = []
        for sid_raw, sscore_raw in zip(sim_ids.tolist(), sim_scores.tolist(), strict=True):
            sid = int(sid_raw)
            if sid == item_idx or sid < 0:
                continue
            sp = ds.items[sid]
            sim_list.append(
                SimilarProductItem(
                    stock_code=sp.stock_code,
                    description=sp.description,
                    similarity_score=round(float(sscore_raw), 4),
                    train_customers=sp.train_customers,
                    avg_unit_price=sp.avg_unit_price,
                )
            )
            if len(sim_list) == top_n:
                break

        item_vec = np.asarray(snap.model.item_factors[item_idx], dtype=np.float64)
        return SimilarProductsResponse(
            product=ProductSummary(
                stock_code=prod.stock_code,
                description=prod.description,
                train_customers=prod.train_customers,
                train_purchases=prod.train_purchases,
                train_total_quantity=prod.train_total_quantity,
                avg_unit_price=prod.avg_unit_price,
            ),
            item_factors=[round(float(v), 4) for v in item_vec],
            similar_products=sim_list,
        )

    def metrics(self) -> ModelMetricsResponse:
        return self._require_snapshot().metrics

    def latent_space(
        self,
        customer_id: str | None = None,
        max_items: int = 140,
        max_users: int = 70,
    ) -> LatentSpaceResponse:
        """Project learned user and item latent factors into 2D using PCA for visual exploration."""
        snap = self._require_snapshot()
        ds = self.dataset

        highlighted_uidx: int | None = None
        highlighted_item_indices: set[int] = set()
        if customer_id:
            highlighted_uidx = self._resolve_user_index(customer_id)
            rec_ids, _ = snap.model.recommend(
                highlighted_uidx,
                ds.train_user_items[highlighted_uidx],
                N=5,
                filter_already_liked_items=True,
            )
            highlighted_item_indices = {int(i) for i in rec_ids.tolist() if int(i) >= 0}

        # Select top popular items + any highlighted recommended items.
        n_items = max(20, min(300, max_items))
        selected_items = list(ds.popularity_ranking[:n_items])
        selected_item_set = set(selected_items)
        for hi in sorted(highlighted_item_indices):
            if hi not in selected_item_set:
                selected_items.append(hi)
                selected_item_set.add(hi)

        # Select active customers + highlighted customer.
        n_users = max(10, min(150, max_users))
        active_user_order = sorted(
            range(len(ds.users)),
            key=lambda u: (-ds.users[u].unique_products, ds.users[u].customer_id),
        )
        selected_users = active_user_order[:n_users]
        if highlighted_uidx is not None and highlighted_uidx not in set(selected_users):
            selected_users.append(highlighted_uidx)

        item_vecs = np.asarray(snap.model.item_factors[selected_items], dtype=np.float64)
        user_vecs = np.asarray(snap.model.user_factors[selected_users], dtype=np.float64)

        # L2-normalize vectors before PCA so cosine proximity dominates visual neighborhoods.
        def row_normalize(mat: np.ndarray) -> np.ndarray:
            norms = np.linalg.norm(mat, axis=1, keepdims=True)
            norms = np.where(norms > 1e-12, norms, 1.0)
            return mat / norms

        combined = np.vstack([row_normalize(item_vecs), row_normalize(user_vecs)])
        pca = PCA(n_components=2, random_state=snap.config.random_state)
        coords = pca.fit_transform(combined)
        evr = [round(float(v), 4) for v in pca.explained_variance_ratio_]

        points: list[LatentPoint] = []
        for idx, item_idx in enumerate(selected_items):
            prod = ds.items[item_idx]
            points.append(
                LatentPoint(
                    id=prod.stock_code,
                    label=prod.description,
                    kind="product",
                    x=round(float(coords[idx, 0]), 4),
                    y=round(float(coords[idx, 1]), 4),
                    interactions=prod.train_customers,
                    is_highlighted=item_idx in highlighted_item_indices,
                )
            )

        offset = len(selected_items)
        for j, uidx in enumerate(selected_users):
            user = ds.users[uidx]
            points.append(
                LatentPoint(
                    id=user.customer_id,
                    label=f"{user.customer_id} ({user.country})",
                    kind="customer",
                    x=round(float(coords[offset + j, 0]), 4),
                    y=round(float(coords[offset + j, 1]), 4),
                    interactions=user.unique_products,
                    is_highlighted=uidx == highlighted_uidx,
                )
            )

        return LatentSpaceResponse(
            projection_method="2D PCA Projection (L2-normalized ALS latent vectors)",
            projection_note=(
                "This 2D scatter is a Principal Component Analysis (PCA) projection of "
                f"{snap.config.factors}-dimensional learned ALS factors. Axes represent principal "
                "variance directions only and have no inherent human semantic labels."
            ),
            x_label=f"PC1 ({evr[0] * 100:.1f}% variance · PCA projection)",
            y_label=f"PC2 ({evr[1] * 100:.1f}% variance · PCA projection)",
            explained_variance_ratio=evr,
            total_explained_variance=round(sum(evr), 4),
            config=snap.config,
            points=points,
        )


_orbit_service_lock = threading.Lock()
_orbit_service_instance: ALSRecommendationService | None = None


def get_orbit_service() -> ALSRecommendationService:
    """Lazy singleton accessor so importing routes does not block unrelated modules."""
    global _orbit_service_instance
    if _orbit_service_instance is None:
        with _orbit_service_lock:
            if _orbit_service_instance is None:
                _orbit_service_instance = ALSRecommendationService(auto_train=True)
    return _orbit_service_instance
