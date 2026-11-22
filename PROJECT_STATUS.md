# KERNEL — Inside the Machine Learning Model

## Current Milestone
**Phase 1 — Workspace Inspection & Project Scaffold** (complete, 2026-11-22)

## Completed Features
- Monorepo scaffold: `backend/`, `frontend/`, `docs/`
- Backend skeleton: `app/api`, `app/ml`, `app/schemas`, `tests/` (Python packages), empty `requirements.txt`
- Python 3.12 virtual environment (`backend/.venv`)
- Frontend: Vite + React + TypeScript template with modular `src/` directories
  (`app`, `presentation`, `slides`, `chapters`, `components`, `laboratory`, `charts`, `animations`, `services`, `hooks`, `styles`, `types`)
- Baseline `npm install` + `npm run build` verified

## Pending Features
- Backend API (framework TBD), ML model pipeline, schemas
- Presentation engine, slides/chapters, laboratory, charts, animations
- Frontend ↔ backend service layer
- Test suites (backend + frontend)

## Known Bugs
- None (scaffold only)

## Architectural Decisions
- Monorepo layout: `backend/` (Python 3.12) + `frontend/` (Vite/React/TS) + `docs/`
- Python 3.12 venv created from the uv-managed CPython 3.12.14 interpreter (system default is 3.14)
- Frontend `src/` organized by domain (presentation/slides/chapters/laboratory) plus shared layers (components/hooks/services/types/styles)

## Test Results
- `frontend`: `npm install` — OK (28 packages, 0 vulnerabilities); `npm run build` (tsc -b && vite build, Vite 8.3.8) — PASS, 0 TS errors, exit 0
- `backend`: `.venv` creation — OK (Python 3.12.14, pip 25.0.1); no tests yet

## Next Tasks
- Phase 2 (awaiting Project Director instructions)
