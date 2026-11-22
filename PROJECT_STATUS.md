# KERNEL — Inside the Machine Learning Model

## Current Milestone
**Phase 3 — Keyboard Navigation, GSAP Transitions, Wheel Control & Fullscreen** (complete, 2026-11-22)
Next: Phase 4 — Python/FastAPI ML backend.

## Completed Features
### Phase 1 — Workspace & Scaffold
- Monorepo: `backend/` (Python 3.12 venv, `app/{api,ml,schemas}`, `tests/`), `frontend/` (Vite + React + TS), `docs/`
- Git repository initialised (`main`), baseline commit `da94dac chore: phase 1 workspace scaffold`

### Phase 2 — Presentation Engine & Design System
- Committed as `0189fdc feat: phase 2 presentation engine and design system`
- Dependencies: `tailwindcss` + `@tailwindcss/vite` (v4, wired in `vite.config.ts`), `lucide-react`, `gsap`, `framer-motion`
- Design system: `src/styles/tokens.css`, `src/styles/globals.css`, Google Fonts (Space Grotesk, Inter, JetBrains Mono)
- Types & 7-chapter / 30-slide registry (`src/types/presentation.ts`, `src/chapters/registry.ts`)
- Engine: `PresentationContext`, `SlideStage`, `SlideLayout`, `PresentationHUD`, `SlideOverview`

### Phase 3 — Keyboard Navigation, GSAP Transitions, Wheel Control & Fullscreen
- DOM guards (`src/services/domGuards.ts`): interactive-zone selector, activatable focus guard for `Enter`, reduced-motion detection
- Global keyboard navigation (`src/hooks/useKeyboardNavigation.ts`): `ArrowRight`, `Space` (with `preventDefault`), `ArrowLeft`, `Enter` (body/non-interactive focus only), `Home`, `End`, `Escape` (closes Overview, else exits fullscreen); strict guards for `e.repeat`, modifier keys, `isOverviewOpen`, `isTransitioning`, and interactive controls/zones
- Controlled wheel navigation (`src/hooks/useWheelNavigation.ts`): passive listener on stage container, `|deltaY| >= 40px` (normalised for line/page deltaMode), `600ms` cooldown + continuous momentum-stream lock (`220ms` idle gap), guarded by `isOverviewOpen`, `isTransitioning`, `ctrlKey` pinch-zoom, and `[data-interactive-zone="true"]`
- Fullscreen API (`src/hooks/useFullscreen.ts`): `enterFullscreen`, `exitFullscreen`, `toggleFullscreen`, state synced exclusively via `fullscreenchange`; enabled HUD button with dynamic `Maximize2` / `Minimize2` icons and tooltips
- Directional GSAP transitions (`src/animations/slideTransitions.ts` & `SlideStage.tsx`): `next` (`x: 36→0, scale: 0.99→1, 0.42s, power3.out`), `prev` (`x: -36→0, scale: 0.99→1, 0.42s, power3.out`), `jump` (`y: 16→0, 0.38s, power2.out`), `isTransitioning` lock + `gsap.context()` cleanup, `prefers-reduced-motion` opacity-only fallback, `gsap.ticker.lagSmoothing(0)`
- Shell composition (`src/presentation/PresentationShell.tsx`): mounts global input controllers once inside `<PresentationProvider>`
- Slide 22 placeholder includes a `data-interactive-zone="true"` guard-test fixture (to be replaced by the real Laboratory in Phase 6)

## Pending Features
- Phase 4: ML backend (FastAPI, KNN pipeline, schemas, tests)
- Phases 5–6: real slide content replacing placeholders; KERNEL Laboratory views
- Automated unit/integration test suites (frontend + backend)

## Known Bugs
- None known.
- Cosmetic: chapter markers 05 and 06 sit close together on the progress line (Ch 05 has a single slide) — by design of proportional placement.
- QA note: Fullscreen transitions cannot be toggled inside the headless/webview QA browser (environment ignores `requestFullscreen()` silently with 0 console errors); button wiring, tooltips, icons, and `fullscreenchange` sync verified by code and clean execution.

## Architectural Decisions
- **Monorepo:** `backend/` (Python 3.12) + `frontend/` (Vite/React/TS) + `docs/`. Python 3.12 venv built from uv-managed CPython 3.12.14 (system default is 3.14).
- **Tailwind v4 CSS-first config:** tokens declared in `@theme` → available as both CSS vars and utilities. No `tailwind.config.js`.
- **Viewport lock & 16:9 canvas:** `html, body, #root` fixed at 100% with `overflow: hidden`; pure-CSS 16:9 fit with `container-type: size`.
- **HUD outside the canvas:** HUD overlays the full viewport; `SlideLayout` reserves clearance via `--kernel-hud-top` (72px) / `--kernel-hud-bottom` (104px).
- **Registry-driven deck:** slide order/index and `chapterStartIndex` derived from a single spec array.
- **Context split:** context object + types in `presentation/context.ts`; provider in `PresentationContext.tsx`; consumer hook `hooks/usePresentation.ts`.
- **PresentationShell controller boundary:** global `useFullscreen` and `useKeyboardNavigation` mount once inside `PresentationShell` (child of `PresentationProvider`); `useWheelNavigation` binds directly to `SlideStage`'s `<main>` ref.
- **GSAP wall-clock timing:** `gsap.ticker.lagSmoothing(0)` prevents slow mount frames (or headless capture pauses) from stretching `0.42s` transitions and leaving `isTransitioning` locked past completion.
- **Wheel momentum lock:** 600ms cooldown combined with a continuous-stream lock (`220ms` idle gap) ensures long trackpad inertia bursts (>600ms) never double-advance slides.

## Test Results
- Phase 1: `npm install` OK; `npm run build` PASS; `.venv` (Python 3.12.14) OK
- Phase 2: `npm run build` PASS (JS 237.41 kB / 74.29 kB gzip); `oxlint` 0 warnings/0 errors; browser layout QA 7/7 PASS
- Phase 3: `npm run build` (`tsc -b && vite build`) — **PASS, 0 TS errors, 0 build errors**
  - JS 313.03 kB (103.33 kB gzip) · CSS 19.91 kB (4.89 kB gzip) · HTML 0.89 kB
- Phase 3: `oxlint` — **0 warnings, 0 errors** (19 files, 116 rules)
- Phase 3: Browser QA (`http://localhost:5179/`, 0 console errors):
  1. Keyboard (`ArrowRight`, `ArrowLeft`, `Space`, `End`, `Home`, rapid 5x presses, held `ArrowRight` repeat, `Ctrl+ArrowRight`, `Enter` on focused button vs empty slide) — **PASS**
  2. Slide Overview + `Escape` (blocks `ArrowRight` while open, closes on `Escape`) — **PASS**
  3. Mouse wheel (`deltaY=100`, `deltaY=-100`, 10x concurrent `deltaY=60` burst -> +1 slide only, `deltaY=20` below threshold) — **PASS**
  4. Fullscreen button click — 0 console errors, **environment-blocked** in embedded webview (fullscreen API silently denied by automation container; standard `fullscreenchange` sync + dynamic `Maximize2`/`Minimize2` verified)
  5. Slide 22 interactive zone (`data-interactive-zone="true"` + slider): wheel, `ArrowRight`, `Space` blocked inside; clicking outside resumes `ArrowRight` (`22 -> 23`) — **PASS**

## Next Tasks
- Phase 4: Python/FastAPI ML backend (awaiting Project Director instructions)
