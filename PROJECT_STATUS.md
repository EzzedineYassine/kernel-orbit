# KERNEL — Inside the Machine Learning Model

## Current Milestone
**Phase 5 — Educational Slides (Chapters 01–04, 06–07)** (complete, 2026-11-22)
Next: Phase 6 — Interactive KERNEL Laboratory (Slide 22).

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
- Committed as `048aaac feat: phase 4 fastapi and scikit-learn knn backend`
- Leakage-free Scikit-learn `Pipeline(StandardScaler, KNeighborsClassifier)` on Iris petal features (stratified 80/20 split), 8 FastAPI endpoints, strict Pydantic v2 schemas, CORS, 31 passing Pytest tests

### Phase 5 — Educational Slides (29 Slides + Editorial Primitives)
- Reusable editorial & scientific primitives (`frontend/src/components/`):
  - `ChapterHeader.tsx`, `MathFormula.tsx`, `DiagramFrame.tsx`, `SplitLayout.tsx`, `MetricCard.tsx`, `irisPalette.ts`
- All 29 educational slides implemented with custom SVG diagrams and restrained Framer Motion choreography (only Slide 22 remains `EnginePlaceholderSlide` for Phase 6):
  - **Ch 01 — The Awakening (Slides 1–5):** `Slide01Awakening`, `Slide02CentralQuestion`, `Slide03ArtificialIntelligence`, `Slide04MachineLearning`, `Slide05TraditionalVsML`
  - **Ch 02 — Understanding the Model (Slides 6–10):** `Slide06WhatIsModel`, `Slide07AlgorithmVsModel`, `Slide08DatasetAnatomy`, `Slide09LearningParadigms`, `Slide10SupervisedClassification`
  - **Ch 03 — How Learning Happens (Slides 11–15):** `Slide11MLLifecycle`, `Slide12PreprocessingScaling`, `Slide13TrainTestSplit`, `Slide14Generalization`, `Slide15LazyLearning`
  - **Ch 04 — Meet KNN (Slides 16–21):** `Slide16MeetKNN`, `Slide17NeighborIntuition`, `Slide18EuclideanDistance`, `Slide19KNNSteps`, `Slide20WhyKMatter`, `Slide21ScalingAndMetrics`
  - **Ch 06 — The Reality Check (Slides 23–27):** `Slide23WhatMakesModelGood`, `Slide24Metrics`, `Slide25ConfusionMatrix`, `Slide26OverfittingUnderfitting`, `Slide27ModelLimitations` — zero hardcoded fake numbers; clean Phase 7 live-metric slots (`— —` / `—` / `"Live metrics connect in Phase 7"`)
  - **Ch 07 — Beyond the Algorithm (Slides 28–30):** `Slide28RealWorldApplications`, `Slide29WhatWeLearned`, `Slide30Conclusion`
- Updated `frontend/src/chapters/registry.ts` with final slide titles and components across all 7 chapters / 30 slides.

## Pending Features
- Phase 6: Interactive KERNEL Laboratory (Slide 22 — D3/Canvas scatter plot, decision boundary, K/metric/weights controls, neighbor inspection)
- Phase 7: Live frontend ↔ FastAPI integration (wiring Lab + Chapter 06 live evaluation/experiment slots)
- Frontend unit/E2E test suite

## Known Bugs
- None known.
- Cosmetic: chapter markers 05 and 06 sit close together on the progress line (Ch 05 has a single slide) — by design of proportional placement.
- Note: Vite build emits an informational >500 kB chunk-size notice (`578.73 kB` / `176.75 kB` gzip) with React + GSAP + Framer Motion + 29 slides in a single bundle; candidate for manual vendor chunk splitting in Phase 6/7.

## Architectural Decisions
- **Monorepo:** `backend/` (Python 3.12) + `frontend/` (Vite/React/TS) + `docs/`.
- **Zero-leakage ML pipeline:** `StandardScaler` inside Scikit-learn `Pipeline`, fit strictly on `X_train, y_train` (and per fold in 5-fold Stratified CV).
- **Container-scaled slide typography:** all 29 educational slides use `cqw`/`cqh` container units with `clamp()` bounds and `min-h-0 flex-1` / `grid-rows-*` containment inside `.kernel-canvas` so slides scale cleanly across `970×694`, `1280×720`, and `1440×900` with zero scrollbars.
- **Restrained scientific palette:** `#08090D`, `#11131A`, `#A78BFA`, `#22D3EE`, `#F5F5F7`, `#858A98`, `#252834` plus `#34D399` strictly as the 3rd Iris species phosphor tone (`irisPalette.ts`).
- **Live-data slot props in Chapter 06:** `Slide24Metrics`, `Slide25ConfusionMatrix`, and `Slide26OverfittingUnderfitting` accept optional `live` slot props defaulting to `null` (rendering explicit Phase 7 empty slots), avoiding fake hardcoded metrics while keeping Phase 7 wiring frictionless.

## Test Results
- Phase 1–3: `npm run build` PASS; `oxlint` 0 warnings/0 errors; browser layout & input QA PASS
- Phase 4: `backend/.venv/Scripts/pytest.exe -v` — **31 passed, 0 failed**
- Phase 5:
  - `npm run build` (`tsc -b && vite build`) — **PASS, 0 TS errors, 0 build errors**
    - JS `578.73 kB` (`176.75 kB` gzip) · CSS `33.90 kB` (`7.31 kB` gzip) · HTML `0.89 kB`
  - `npx oxlint` — **PASS, 0 warnings, 0 errors** (54 files, 116 rules)
  - Browser QA sweep across all 30 slides at `1280×720` and `1440×900` — **30/30 PASS**, zero scrollbars, zero HUD overlaps, zero console errors; keyboard (`Home`/`End`/`ArrowLeft`/`ArrowRight`) and mouse wheel navigation verified; 6 visual defects caught on first sweep (Slide 02 SVG box fit, Slide 13 bar animation width, Slide 19 card/tip overlap, Slide 29 row 05 footer overlap, `DiagramFrame` figure tag wrapping/truncation, `MetricCard` orphan `"7"` wrap) all fixed and re-verified clean.

## Next Tasks
- Phase 6: Interactive KERNEL Laboratory on Slide 22 (awaiting Project Director instructions)
