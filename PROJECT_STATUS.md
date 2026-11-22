# KERNEL — Inside the Machine Learning Model

## Current Milestone
**Phase 2 — Presentation Engine & Design System** (complete, 2026-11-22)
Next: Phase 3 — Navigation input, transitions & fullscreen.

## Completed Features
### Phase 1 — Workspace & Scaffold
- Monorepo: `backend/` (Python 3.12 venv, `app/{api,ml,schemas}`, `tests/`), `frontend/` (Vite + React + TS), `docs/`
- Git repository initialised (`main`), baseline commit `chore: phase 1 workspace scaffold`

### Phase 2 — Presentation Engine & Design System
- Dependencies: `tailwindcss` + `@tailwindcss/vite` (v4, wired in `vite.config.ts`), `lucide-react`, `gsap`, `framer-motion` (installed, not yet wired)
- Design system: `src/styles/tokens.css` (Tailwind `@theme` palette + font tokens), `src/styles/globals.css` (viewport lock, 16:9 canvas, `.scientific-grid`, `.glass-surface`, `.kernel-accent-line`)
- Fonts: Space Grotesk 400–700, Inter 400–600, JetBrains Mono 400–500 (Google Fonts); document title set
- Types: `src/types/presentation.ts` (`ChapterId`, `ChapterMeta`, `SlideMeta`, `NavigationDirection`)
- Registry: `src/chapters/registry.ts` — 7 chapters, 30 slides, all bound to `EnginePlaceholderSlide`
- Engine: `PresentationContext` (state + bounded actions), `SlideStage` (16:9 canvas), `SlideLayout` (HUD-safe padding, eyebrow, 12-col grid), `PresentationHUD` (brand, chapter, progress + chapter markers, counter, prev/next, overview, fullscreen stub, key hint), `SlideOverview` (modal grid grouped by chapter)

## Pending Features
- Phase 3: keyboard shortcuts, GSAP/Framer transition choreography, Fullscreen API wiring
- Phase 4: ML backend (KNN pipeline, API, schemas)
- Phases 5–6: real slide content replacing placeholders; KERNEL Laboratory views
- Test suites (frontend + backend)

## Known Bugs
- None known. Fullscreen button is an intentional disabled stub until Phase 3.
- Cosmetic: chapter markers 05 and 06 sit close together on the progress line (Ch 05 has a single slide) — by design of proportional placement.

## Architectural Decisions
- **Monorepo:** `backend/` (Python 3.12) + `frontend/` (Vite/React/TS) + `docs/`. Python 3.12 venv built from uv-managed CPython 3.12.14 (system default is 3.14).
- **Tailwind v4 CSS-first config:** tokens declared in `@theme` → available as both CSS vars and utilities (`bg-kernel-bg`, `text-kernel-muted`, `font-display`, …). No `tailwind.config.js`.
- **Viewport lock:** `html, body, #root` fixed at 100% with `overflow: hidden`; no page scroll anywhere.
- **16:9 canvas:** pure-CSS fit (`width: min(100vw, 100vh·16/9)`, `height: min(100vh, 100vw·9/16)`) with `container-type: size`, so slide content scales via `cqw`/`cqh` units — no JS resize listeners.
- **HUD outside the canvas:** HUD overlays the full viewport; `SlideLayout` reserves clearance via `--kernel-hud-top` (72px) / `--kernel-hud-bottom` (104px).
- **Registry-driven deck:** slide order/index derived from a single spec array; `chapterStartIndex` derived, not hand-maintained. Slides are prop-less `ComponentType`s; Phase 2 placeholders come from a factory that closes over slide/chapter metadata.
- **Context split:** context object + types in `presentation/context.ts`; provider in `PresentationContext.tsx`; consumer hook `hooks/usePresentation.ts` (keeps Fast Refresh boundaries clean).
- **Navigation guard:** all moves clamp to `[0, totalSlides − 1]`; no-op when target equals current index; `direction` set to `next` / `prev` / `jump`.

## Test Results
- Phase 1: `npm install` OK; `npm run build` PASS; `.venv` (Python 3.12.14) OK
- Phase 2: `npm run build` (`tsc -b && vite build`) — **PASS, 0 TS errors, 0 build errors**
  - JS 237.41 kB (74.29 kB gzip) · CSS 18.95 kB (4.74 kB gzip) · HTML 0.89 kB
- Phase 2: `oxlint` — 0 warnings, 0 errors
- Phase 2: browser visual QA (mouse-only, 970×694 and 1280×1024) — all 7 checks PASS, no console errors; overview heading truncation fixed after QA
- No automated test suites yet.

## Next Tasks
- Phase 3: keyboard navigation (← → Space, Home/End, Esc for overview), Fullscreen API, slide transition choreography using `direction` / `isTransitioning`
