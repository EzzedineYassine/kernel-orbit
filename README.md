# KERNEL / ORBIT — Inside the Recommendation Model

> **Discover what customers will want next.**
> An interactive 30-slide scientific presentation and live **Implicit Matrix Factorization (ALS)** recommendation laboratory trained on the official **UCI Online Retail** dataset.

## Overview
- **Project Identity:** KERNEL / ORBIT (*Inside the Recommendation Model*)
- **ML Task:** Personalized Product Recommendation for an online gift retailer
- **Approach:** Collaborative Filtering via Implicit Matrix Factorization (**Alternating Least Squares — ALS**, `implicit.als.AlternatingLeastSquares`)
- **Dataset:** Official [UCI Online Retail Dataset (ID: 352)](https://archive.ics.uci.edu/dataset/352/online+retail) — 541,909 historical UK gift retail transactions (Dec 2010 – Dec 2011)
- **Presentation Architecture:** Full-viewport 16:9 slide engine (React 19 + TypeScript + Vite + Tailwind v4 + GSAP + Framer Motion) with keyboard/wheel guards, overview modal, fullscreen support, and a live interactive laboratory on Slide 22 connected to FastAPI.

## Repository Structure
```text
kernel/
├── README.md
├── PROJECT_STATUS.md
├── docs/
│   ├── DATASET_PREPROCESSING.md   # UCI cleaning funnel, outlier analysis & temporal split
│   ├── MODEL_DOCUMENTATION.md     # Implicit ALS math, hyperparameters & evaluation results
│   └── PRESENTATION_SCRIPT.md     # Slide-by-slide presenter guide & live demo script
├── backend/
│   ├── requirements.txt           # Pinned Python 3.12 dependencies
│   ├── pytest.ini
│   ├── scripts/download_dataset.py
│   ├── data/                      # Local UCI Online Retail dataset (xlsx + parquet cache)
│   ├── app/
│   │   ├── main.py                # Primary FastAPI entrypoint (ORBIT ALS API)
│   │   ├── orbit_app.py           # ORBIT FastAPI app factory
│   │   ├── orbit/                 # preprocessing.py, als_service.py, evaluator.py
│   │   ├── api/orbit_routes.py    # 11 typed ORBIT REST endpoints
│   │   ├── schemas/orbit.py       # Strict Pydantic v2 schemas
│   │   └── ml/ & knn_app.py       # Preserved Phase 4 KNN reference backend
│   └── tests/
│       ├── test_orbit.py          # 18 ORBIT ALS unit & API integration tests
│       └── test_api.py            # 31 preserved KNN reference tests
└── frontend/
    └── src/
        ├── chapters/registry.ts   # 7-chapter, 30-slide deck definition
        ├── presentation/          # Engine, Stage, Layout, HUD, Overview, Shell
        ├── hooks/                 # Keyboard, Wheel, Fullscreen, OrbitProvider
        ├── animations/            # Directional GSAP slide transitions
        ├── components/            # Editorial & scientific presentation primitives
        ├── slides/ch01..ch07/     # 29 educational slides
        └── laboratory/            # Slide 22 interactive ORBIT Laboratory
```

## Local Startup Instructions

### Prerequisites
- **Python 3.12** (venv located at `backend/.venv`)
- **Node.js 20+** and **npm**

### 1. Download Dataset (if not already present in `backend/data/`)
```powershell
cd backend
.\.venv\Scripts\python.exe scripts\download_dataset.py
```

### 2. Start the FastAPI ORBIT Backend (`http://127.0.0.1:8000`)
```powershell
cd backend
.\.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000
```
At startup, the backend loads the cached UCI dataset, builds the chronological sparse CSR matrix, fits the default ALS model (`factors=32, iterations=20, regularization=0.1, alpha=15.0`), and keeps the fitted model in memory for sub-millisecond inference.

### 3. Start the Frontend Presentation (`http://localhost:5179`)
In a second terminal:
```powershell
cd frontend
npm install
npx vite --port 5179
```
Open **http://localhost:5179/** in a modern desktop browser. To point the frontend to a custom or deployed backend URL, set `VITE_API_BASE_URL` in `frontend/.env` (or Vercel Environment Variables).

## Production Deployment (Vercel + Docker/Render/Railway)
- **Backend (`backend/Dockerfile`):** Deploy `backend/` as a Docker web service on Render or Railway. Set `KERNEL_CORS_ORIGINS` to a comma-separated list of allowed frontend origins (e.g., `https://your-app.vercel.app`). The Docker build downloads the official UCI dataset and caches `data/online_retail_raw.parquet` for fast cold starts, binding to `0.0.0.0:${PORT:-8000}`.
- **Frontend (`frontend/vercel.json`):** Deploy `frontend/` on Vercel (Root Directory: `frontend`) and set `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com`).

### 4. Presentation Controls
- `→` / `Space` / `Enter` (when no control is focused) — Next slide
- `←` — Previous slide
- `Home` / `End` — First / last slide
- `Mouse Wheel` — Controlled single-slide step (guarded inside Slide 22 Laboratory)
- `Esc` — Close Slide Overview or exit fullscreen

## Verification Commands
```powershell
# Backend test suite (ORBIT ALS + preserved KNN reference)
cd backend
.\.venv\Scripts\pytest.exe -v

# Frontend TypeScript build + linter
cd frontend
npm run build
npx oxlint
```

## API Endpoints (ORBIT FastAPI)
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Service status, active ALS config, catalog size, last train time |
| `GET` | `/api/dataset/summary` | UCI cleaning stats, sparsity, chronological cutoff, sample heatmap block |
| `GET` | `/api/customers` | Paginated/searchable list of privacy-safe customers (`CUST-XXXXX`) |
| `GET` | `/api/customers/{customer_id}/history` | Purchase history, learned latent vector `u_u`, and similar customers |
| `GET` | `/api/recommendations/{customer_id}` | Live Top-N ALS recommendations excluding already-purchased products |
| `GET` | `/api/products/search` | Search gift catalog by stock code or description |
| `GET` | `/api/products/{product_id}/similar` | Item embedding `v_i` and nearest products via ALS `similar_items` |
| `GET` | `/api/model/metrics` | Chronological holdout Precision/Recall/MAP/NDCG/Coverage vs. Popularity |
| `GET` | `/api/model/latent-space` | 2D PCA projection of L2-normalized user & item latent factors |
| `POST` | `/api/model/configure` | Update ALS hyperparameters and retrain model |
| `POST` | `/api/model/retrain` | Explicitly trigger ALS retraining and return updated evaluation metrics |
