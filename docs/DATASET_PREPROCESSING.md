# Dataset & Preprocessing Documentation — KERNEL / ORBIT

## 1. Dataset Source & Provenance
- **Dataset:** UCI Online Retail (UCI Machine Learning Repository ID: `352`)
- **Official URL:** https://archive.ics.uci.edu/dataset/352/online+retail
- **Local Copy:** `backend/data/online_retail.xlsx` (23,715,344 bytes; cached to `backend/data/online_retail_raw.parquet` for fast startup)
- **SHA-256 (`online_retail.xlsx`):** `43465a06f2ccf7c8b5bd2892bc7defb52f97487934fe93b16ae4c3936424676d`
- **Reproducible Download:** `python backend/scripts/download_dataset.py`
- **Domain:** UK-based online retail store selling unique all-occasion gifts and homeware (`2010-12-01` through `2011-12-09`).

## 2. Raw Data Audit & Cleaning Funnel
Every filtering decision is implemented deterministically in `backend/app/orbit/preprocessing.py`:

| Stage / Filter | Count | Rationale |
|---|---:|---|
| Raw Excel transaction rows | **541,909** | Full official UCI Online Retail dataset |
| Cancelled invoices (`InvoiceNo` starting with `C`) | 9,288 | Credit notes / cancellations are not positive purchase preferences |
| Non-positive quantities (`Quantity <= 0`) | 10,624 | Returns, stock adjustments, or damaged inventory write-offs |
| Non-positive unit prices (`UnitPrice <= 0`) | 2,517 | Free adjustments or administrative zero-price records |
| Missing `CustomerID` | 135,080 | Anonymous guest checkouts cannot be attributed to a customer profile |
| Missing `Description` | 1,454 | Handled via canonical per-`StockCode` description lookup (most frequent non-null label) |
| Non-merchandise operational codes (`POST`, `DOT`, `M`, `BANK CHARGES`, `AMAZONFEE`, `C2`, `D`, `S`, `CRUK`, `PADS`, `B`, gift vouchers) | 1,547 | Postage, fees, and manual adjustments are not gift products to recommend; valid SKUs match `^\d{5}[A-Z]*$` |
| **Clean valid merchandise transactions** | **396,337** | Verified positive customer-product purchase lines |

**Implementation Detail:** The Excel `Description` column contains occasional integer values mixed with strings; `preprocessing.py` reads `InvoiceNo`, `StockCode`, `Description`, and `Country` explicitly as `str`, normalizes `StockCode` (`strip().upper()`), and formats customer identifiers in privacy-safe form (`CUST-XXXXX`).

## 3. Wholesale Outlier Analysis & Implicit Interaction Strength
Inspecting clean transaction `Quantity` reveals severe wholesale skew:
- **Median quantity:** `6` units
- **90th percentile:** `24` units
- **99th percentile:** `120` units
- **Maximum single order:** **`80,995` units**

Using raw unit quantity directly in $C_{ui} = 1 + \alpha r_{ui}$ allows one bulk carton order to overpower thousands of regular consumer transactions. Empirically benchmarking three implicit weighting strategies on the chronological holdout confirmed that **log-dampened repeat purchase invoice count** outperforms quantity-based weighting:

$$r_{ui} = \ln(1 + \text{distinct\_purchase\_invoices}_{ui})$$

- Rewards recurring genuine customer affinity across distinct shopping occasions.
- Immune to single-order wholesale quantity spikes.
- Preserves true implicit semantics (never pretending purchases are 1–5 star ratings).

## 4. Chronological Split & Zero-Leakage Protocol
To prevent future interactions from leaking into model training:
1. **Temporal Cutoff (80th percentile of clean transactions):** `2011-11-02 12:26`
   - **Training window (`< cutoff`):** `317,063` transactions (`2010-12-01` → `2011-11-02`)
   - **Held-out future test window (`>= cutoff`):** `79,274` transactions (`2011-11-02` → `2011-12-09`)
2. **Minimum Support Thresholds (applied strictly on training split):**
   - Customers with `< 5` distinct training products excluded.
   - Products with `< 5` distinct training customers excluded.
   - Resulting training interaction matrix $R_{\text{train}}$: **`3,751` customers × `3,049` products**, **`220,566`** non-zero interactions (**`1.9286%` density / `98.0714%` sparsity**).
3. **Cold-Start User Accounting:**
   - Total distinct customers active in the future test window: `1,864`
   - **Cold-start test users** (zero qualifying training history): `386` (explicitly excluded from collaborative warm-user metrics and reported transparently)
   - **Warm evaluated users** (present in training catalog AND purchased ≥ 1 *unseen* catalog product in the future window): **`1,393`**
4. **Exclusion of Already-Purchased Products:**
   - Every customer's training purchase history is masked (`filter_already_liked_items=True`) during both live serving and offline evaluation.
