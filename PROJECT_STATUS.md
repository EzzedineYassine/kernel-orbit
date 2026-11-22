# KERNEL — Inside the Machine Learning Model

## Current Milestone
**Phase 4 — FastAPI + Scikit-learn ML Backend** (complete, 2026-11-22)
Next: Phase 5 — Real slide content & visualizations.

## Completed Features
### Phase 1 — Workspace & Scaffold
- Monorepo: `backend/` (Python 3.12 venv, `app/{api,ml,schemas}`, `tests/`), `frontend/` (Vite + React + TS), `docs/`
- Git repository initialised (`main`), baseline commit `da94dac chore: phase 1 workspace scaffold`

### Phase 2 — Presentation Engine & Design System
- Committed as `0189fdc feat: phase 2 presentation engine and design system`
- Tailwind v4 design system (`tokens.css`, `globals.css`), Google Fonts, 7-chapter / 30-slide registry, `PresentationContext`, `SlideStage`, `SlideLayout`, `PresentationHUD`, `SlideOverview`

### Phase 3 — Keyboard Navigation, GSAP Transitions, Wheel Control & Fullscreen
- Committed as `75ca2e9 feat: phase 3 keyboard guards, GSAP transitions, wheel and fullscreen`
- `domGuards.ts`, `useKeyboardNavigation.ts`, `useWheelNavigation.ts`, `useFullscreen.ts`, `slideTransitions.ts`, `PresentationShell.tsx`, enabled HUD fullscreen toggle, Slide 22 interactive-zone QA fixture

### Phase 4 — FastAPI + Scikit-learn ML Backend
- Dependencies pinned in `backend/requirements.txt` inside `backend/.venv` (Python 3.12.14): `fastapi==0.165.0`, `uvicorn[standard]==0.54.0`, `scikit-learn==1.9.1`, `numpy==2.5.5`, `pandas==3.1.1`, `joblib==1.6.0`, `pydantic==2.14.4`, `pytest==9.2.0`, `httpx==0.28.1`
- Dataset (`backend/app/ml/dataset.py`): Iris petal features (`petal_length`, `petal_width`), deterministic stratified 80/20 split (`random_state=42`, 120 train / 30 test, exact 40/10 per species), read-only cached arrays, bounds, class summary
- ML Service (`backend/app/ml/model_service.py`): thread-safe `KNNModelService` using `Pipeline([("scaler", StandardScaler()), ("knn", KNeighborsClassifier(...))])` fit exclusively on `X_train, y_train` (zero leakage); live reconfiguration (`k` 1–15, `euclidean|manhattan`, `uniform|distance`); `predict`, `neighbors`, `boundary` (meshgrid 20..120, default 60), `experiment` (Stratified 5-Fold CV on training split only + optional probe point)
- Evaluator (`backend/app/ml/evaluator.py`): held-out 20% test set accuracy, macro + per-class precision/recall/F1/support, 3×3 confusion matrix, train vs test accuracy, 5-fold stratified train CV mean/std
- Schemas & API (`backend/app/schemas/models.py`, `backend/app/api/routes.py`, `backend/app/main.py`): strict Pydantic v2 validation (`extra="forbid"`), CORS for local Vite origins + `KERNEL_CORS_ORIGINS` env override, all 8 endpoints (`/api/health`, `/api/dataset`, `/api/model/configure`, `/api/model/predict`, `/api/model/neighbors`, `/api/model/boundary`, `/api/model/evaluate`, `/api/model/experiment`)
- Automated test suite (`backend/tests/test_api.py` + `backend/pytest.ini`): 31 Pytest cases covering endpoints, CORS, stratified split, zero-leakage scaler check, real inference/metric/weight/boundary dynamics, experiment mode, and 422 validation

## Pending Features
- Phases 5–6: real slide content replacing placeholders; KERNEL Laboratory frontend views wired to the FastAPI backend
- Frontend unit/E2E test suite

## Known Bugs
- None known.
- Cosmetic: chapter markers 05 and 06 sit close together on the progress line (Ch 05 has a single slide) — by design of proportional placement.
- Note: `starlette==1.10.0` emits a deprecation warning when using `httpx` with `TestClient` (suggesting `httpx2`); `httpx` was explicitly requested for Phase 4 and all 31 tests pass cleanly.

## Architectural Decisions
- **Monorepo:** `backend/` (Python 3.12) + `frontend/` (Vite/React/TS) + `docs/`. Python 3.12 venv built from uv-managed CPython 3.12.14.
- **Zero-leakage ML pipeline:** `StandardScaler` lives inside the Scikit-learn `Pipeline` and is fitted exclusively on `X_train, y_train` (and refitted per fold during 5-fold Stratified CV in `evaluate` and `experiment`). Test set is never touched during scaling or CV.
- **Atomic thread-safe reconfiguration:** `KNNModelService` builds and fits a new immutable `ModelSnapshot(config, pipeline)` and swaps it under an `RLock`, so concurrent requests never observe partial state.
- **Partial & full `/model/configure` updates:** optional fields (`k`, `metric`, `weights`) inherit active config values when omitted while strictly validating ranges/literals and rejecting unknown fields (`extra="forbid"`).
- **Boundary matrix convention:** `predictions[y_index][x_index]` and `confidences[y_index][x_index]` (row = `petal_width`, col = `petal_length`, `meshgrid(..., indexing="xy")`) for direct HTML Canvas / D3 raster rendering; resolution validated `20..120` in Pydantic and clamped in the service layer.
- **Frontend engine decisions (Phases 2–3):** Tailwind v4 `@theme`, viewport lock + pure-CSS 16:9 canvas, context split for Fast Refresh, `PresentationShell` global input mount, `gsap.ticker.lagSmoothing(0)`, wheel 600ms cooldown + 220ms momentum-stream lock.

## Test Results
- Phase 1: `npm install` OK; `npm run build` PASS; `.venv` (Python 3.12.14) OK
- Phase 2: `npm run build` PASS; `oxlint` 0 warnings/0 errors; browser layout QA 7/7 PASS
- Phase 3: `npm run build` PASS (JS 313.03 kB / 103.33 kB gzip); `oxlint` 0 warnings/0 errors; browser input QA PASS (fullscreen environment-blocked in headless webview, 0 console errors)
- Phase 4: `backend/.venv/Scripts/pytest.exe -v` — **31 passed, 0 failed** (1 Starlette/httpx deprecation warning) in 8.54s
  - Default `k=5, euclidean, uniform`: `train_accuracy = 0.975`, `test_accuracy = 0.9667` (29/30), `cv_mean_accuracy = 0.9667 ± 0.0167`

## Next Tasks
- Phase 5: Real slide content & visual architecture (awaiting Project Director instructions)
