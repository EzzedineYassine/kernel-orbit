# KERNEL / ORBIT — Inside the Recommendation Model

## Current Milestone
**Phase G — End-to-End QA & Documentation Complete (`feat/orbit-matrix-factorization`)** (2026-11-23)

## Migration Log (KERNEL → ORBIT)
- **Target Architecture:** **KERNEL / ORBIT** — Personalized Product Recommendation via Collaborative Filtering / Implicit Matrix Factorization (ALS) on the official **UCI Online Retail** dataset (`ID 352`)
- **Tagline:** *Inside the Recommendation Model.* (*"Discover what customers will want next."*)
- **Base Checkpoint Commit (preserved on `main`):** `f87ce88` (`feat: phase 5 educational slides and editorial primitives (pre-orbit checkpoint)`)
- **Phase 4 KNN Backend Checkpoint (preserved in history):** `048aaac` (`feat: phase 4 fastapi and scikit-learn knn backend`)
- **Migration Branch:** `feat/orbit-matrix-factorization`
- **Preservation Policy:** Original KNN reference backend (`backend/app/ml/`, `backend/app/api/routes.py`, `backend/app/knn_app.py`, `backend/tests/test_api.py`) remains preserved and verified (31/31 passing). Active `backend/app/main.py` serves the ORBIT Implicit ALS API (`create_orbit_app()`).
- **Academic Verification Caveat:** Matrix Factorization, Alternating Least Squares (ALS), and Collaborative Filtering do not appear in the confirmed named list of already-taught class algorithms; however, the student's **"Other / Not sure"** taught-algorithms category remains unverified. Confirm with the professor before claiming formal approval.

## Completed Phases

### Phases 1–5 — Presentation Engine, Design System & Pre-ORBIT Baseline (`main`)
- `da94dac` — Phase 1: Monorepo scaffold (`backend/`, `frontend/`, `docs/`)
- `0189fdc` — Phase 2: Tailwind v4 KERNEL design system (`tokens.css`, `globals.css`), 7-chapter / 30-slide engine, `PresentationHUD`, `SlideOverview`
- `75ca2e9` — Phase 3: Global keyboard guards (`domGuards.ts`), GSAP slide transitions, momentum-safe mouse wheel navigation, fullscreen API
- `048aaac` — Phase 4: FastAPI + Scikit-learn KNN reference backend (31 passing tests)
- `f87ce88` — Phase 5: 29 educational slides + 5 editorial primitives (safe pre-ORBIT checkpoint on `main`)

### Phase A — Git Audit & Safe Migration Branch (`ae8e51f`)
- Verified clean repository history on `main`, preserved `f87ce88` and `048aaac`, created branch `feat/orbit-matrix-factorization`, and initialized the Migration Log.

### Phase B — Implicit ALS ML Backend & UCI Retail Pipeline (`eff69c9`)
- Installed and pinned `implicit==0.7.3`, `scipy==1.18.1`, `openpyxl==3.1.5`, `pyarrow==26.0.1` alongside FastAPI/Uvicorn/Scikit-learn/Pandas/NumPy/Pytest in `backend/requirements.txt` (`backend/.venv`, Python 3.12.14).
- Added reproducible dataset downloader (`backend/scripts/download_dataset.py`) fetching official UCI Online Retail (`online_retail.xlsx`, 23,715,344 bytes; SHA-256 `43465a06f2ccf7c8b5bd2892bc7defb52f97487934fe93b16ae4c3936424676d`; cached to `online_retail_raw.parquet`; large binaries git-ignored).
- Implemented leakage-free preprocessing (`backend/app/orbit/preprocessing.py`):
  - Raw rows: `541,909` → cleaned valid merchandise transactions: `396,337` (removed `9,288` cancelled `C*` invoices, `10,624` `Quantity <= 0`, `2,517` `UnitPrice <= 0`, `135,080` missing `CustomerID`, and non-merchandise codes `POST`, `DOT`, `M`, `BANK CHARGES`, `D`, `S`, `CRUK`, `AMAZONFEE`, `PADS`, `C2`, `B`).
  - Chronological 80/20 split at `2011-11-02 12:26` (`317,063` train / `79,274` test).
  - Minimum support `>= 5` applied strictly on training split → **`3,751` users × `3,049` products**, **`220,566` training interactions** (**`1.9286%` density / `98.0714%` sparsity**).
  - Interaction strength: `r_ui = log1p(distinct_purchase_invoices)` to dampen bulk wholesale spikes (max single line `80,995` units).
  - Cold-start accounting: **`1,393`** warm holdout users with unseen future buys evaluated; **`386`** cold-start test users tracked separately.
- Implemented thread-safe `ALSRecommendationService` (`backend/app/orbit/als_service.py`) wrapping `implicit.als.AlternatingLeastSquares` (`factors=32, iterations=20, regularization=0.1, alpha=15.0, random_state=42`) under `threadpoolctl.threadpool_limits(limits=1, user_api="blas")`.
- Implemented vectorized chronological holdout evaluator (`backend/app/orbit/evaluator.py`) comparing Implicit ALS against a Popularity Baseline across `Precision@K`, `Recall@K`, `MAP@K`, `NDCG@K`, `Catalog Coverage@K`, and `Avg Recommended Popularity Rank` (`K = 5, 10`).
- Exposed 11 typed FastAPI endpoints (`backend/app/api/orbit_routes.py`, `backend/app/schemas/orbit.py`, `backend/app/orbit_app.py`, `backend/app/main.py`) with 18 dedicated ORBIT Pytest tests (`backend/tests/test_orbit.py`).

### Phase C — Educational Slides Migration (`b40ce91`)
- Preserved the 30-slide / 7-chapter presentation architecture, design system, and all 5 reusable editorial primitives (`ChapterHeader`, `MathFormula`, `DiagramFrame`, `SplitLayout`, `MetricCard`).
- Updated HUD branding to `KERNEL / ORBIT · INSIDE THE RECOMMENDATION MODEL`.
- Replaced obsolete KNN slides (`Slide16MeetKNN`–`Slide21ScalingAndMetrics`, `irisPalette.ts`) with 6 dedicated Collaborative Filtering & Implicit ALS slides (`Slide16MeetCollaborativeFiltering` through `Slide21FactorsToRecommendations`).
- Migrated Chapters 01–03, 06, and 07 to personalized retail recommendation, sparse matrices, chronological holdout evaluation, cold-start/popularity bias, and real-world recommendation systems.
- Wired Chapter 06 (`Slide24Metrics`, `Slide25ConfusionMatrix`, `Slide26OverfittingUnderfitting`) directly to live FastAPI evaluation telemetry via `OrbitProvider` / `useOrbitData`.

### Phases D & E — Interactive ORBIT Laboratory & Live Backend Integration (`9f6d1f2`)
- Implemented typed frontend API client (`frontend/src/services/orbitApi.ts`, `frontend/src/types/orbit.ts`) and shared context (`frontend/src/hooks/OrbitProvider.tsx`, `useOrbitData.ts`).
- Built Slide 22 **ORBIT Laboratory** (`frontend/src/laboratory/OrbitLaboratory.tsx`) wrapped in `data-interactive-zone="true"` with 4 live interactive views:
  1. **Customer & Recs (`RecommendationsPanel.tsx`):** Customer search/selector, purchase history, 16-bar user latent embedding `u_u` sparkline, Top-5 / Top-10 personalized ALS recommendations (purchased items excluded), real `BOUGHT IN TEST` verification badges, and clickable Similar Customers in latent space.
  2. **Product Explorer (`ProductExplorerPanel.tsx`):** Live catalog search across 3,049 SKUs, learned item embedding `v_i` sparkline, and ALS cosine-similarity `similar_items` list.
  3. **Matrix & 2D PCA (`LatentSpacePanel.tsx`):** Real `12 × 16` sparse interaction matrix block + interactive 2D PCA projection of L2-normalized user/item embeddings with explained variance readout, recommendation rays, and explicit PCA non-semantic disclaimer.
  4. **Configure & Retrain (`ModelConfigPanel.tsx`):** Sliders/chips for `k` (8–128), `iterations` (5–40), `α` (5–40), and `λ` (`0.01–5.0`) with **explicit-only retraining** (`Apply & Retrain Model` + Reset), updating both Slide 22 and Chapter 06 live.

### Phases F & G — Documentation, Visual Polish & End-to-End QA
- Authored complete documentation suite:
  - `README.md` (project overview, architecture, API reference, setup & test instructions)
  - `docs/DATASET_PREPROCESSING.md` (exact UCI dataset audit, cleaning rules, chronological split, leakage prevention)
  - `docs/MODEL_DOCUMENTATION.md` (Hu–Koren–Volinsky implicit ALS formulation, hyperparameter guide, real holdout benchmarks)
  - `docs/PRESENTATION_SCRIPT.md` (10–15 minute speaker script across all 30 slides + live demo walkthrough + Q&A defense)
  - `backend/data/README.md` (reproducible dataset provenance and download guide)
- Visual QA polish: repositioned `Slide14Generalization` `"missed future order"` SVG label below the overfit curve with a dashed leader line (eliminating stroke overlap) and added restrained dark custom scrollbar styling inside `[data-interactive-zone='true']` panels in `frontend/src/styles/globals.css`.

## Verified Real Holdout Metrics (`k=32, iter=20, λ=0.1, α=15.0`)
Evaluated on **1,393 warm chronological holdout users** (`cutoff = 2011-11-02 12:26`; **386 cold-start users** excluded and reported transparently):

| Metric | Implicit ALS | Popularity Baseline | Lift |
| --- | ---: | ---: | ---: |
| `Precision@5` | `8.14%` | `3.59%` | `2.27×` |
| `Precision@10` | `7.24%` | `3.44%` | `2.10×` |
| `Recall@10` | `5.21%` | `2.00%` | `2.61×` |
| `MAP@10` | `4.04%` | `1.41%` | `2.87×` |
| `NDCG@10` | `8.70%` | `3.77%` | `2.31×` |
| `Catalog Coverage@10` | `35.19%` (`1,073` SKUs) | `2.33%` (`71` SKUs) | `15.11×` |
| `Avg Recommended Pop. Rank` | `#241.61` | `#7.66` | Long-tail discovery |

Live retrain verification on Slide 22 (`k=16, iter=20, λ=0.1, α=15.0`, fit in `0.65s`): `Precision@10 = 6.54%`, `Recall@10 = 4.41%`, `MAP@10 = 3.53%`, `NDCG@10 = 7.67%`, `Catalog Coverage@10 = 28.9% (882 SKUs)` — confirming genuine backend model retraining and exact restoration to `k=32` (`0.70s`) on Reset.

## Verification & QA Results
- **Backend Tests (`backend/.venv/Scripts/pytest.exe -v`):** **49 passed, 0 failed** (`31` preserved KNN reference tests + `18` ORBIT Implicit ALS tests), zero OpenBLAS multi-threading warnings.
- **Frontend Production Build (`npm run build` — `tsc -b && vite build`):** **PASS** (0 TS errors, 0 build errors; JS `617.64 kB` / `186.38 kB` gzip, CSS `41.21 kB` / `8.31 kB` gzip).
- **Frontend Linter (`npx oxlint`):** **PASS** (`0 warnings, 0 errors` across `63` files / `116` rules).
- **Live End-to-End Browser QA (`http://localhost:5179/` ↔ `http://127.0.0.1:8000`):**
  - **30/30 slides PASS** at `1280×720` and key slides verified at `1440×900` — zero page scrollbars, zero HUD header/footer overlaps, zero console errors, zero page errors, zero failed network requests.
  - **Slide 22 ORBIT Laboratory PASS** across all 4 tabs: live `CUST-14911` recommendations & `BOUGHT IN TEST` badges, `Top 5`/`Top 10` toggle, keyboard guard (`Filter customers` & `Search catalog products` stay on Slide 22), Similar Customer switching (`CUST-17841`), Product Explorer (`HEART` → `247 SKUs`, `85123A` item embedding & `similar_items`), horizontal `12 × 16` sparse matrix + 2D PCA (`24.2%` explained variance + explicit disclaimer), and explicit-only `k=16` retrain + Reset back to `k=32`.
  - **Slide 14 SVG label fix & dark scrollbars:** Re-verified clean via DOM bounding boxes and live screenshots.

## Known Notes
- Vite emits an informational `>500 kB` chunk-size notice (`617.64 kB` / `186.38 kB` gzip) because React, GSAP, Framer Motion, and all 30 slides bundle into one local presentation asset; optional code splitting can be added later if needed.
- `frontend/src/slides/EnginePlaceholderSlide.tsx` remains unused on disk as a benign Phase 2 reference artifact.
- `main` remains pinned at `f87ce88` (pre-ORBIT checkpoint) until the user chooses to merge `feat/orbit-matrix-factorization`.
