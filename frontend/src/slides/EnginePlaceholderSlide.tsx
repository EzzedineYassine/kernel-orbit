import type { ComponentType } from 'react'
import { SlideLayout } from '../presentation/SlideLayout'
import type { ChapterMeta, SlideMeta } from '../types/presentation'

type PlaceholderInput = Omit<SlideMeta, 'component'>

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * PHASE 2 ONLY — temporary slide used to verify engine framing.
 * Shows chapter badge, slide number, title, and the 16:9 / HUD safe areas.
 * Replaced with real slide content in Phases 5–6.
 */
export function createPlaceholderSlide(
  slide: PlaceholderInput,
  chapter: ChapterMeta,
  totalSlides: number,
): ComponentType {
  function EnginePlaceholderSlide() {
    return (
      <>
        {/* Canvas (16:9) boundary + corner crop marks */}
        <div className="pointer-events-none absolute inset-0 border border-kernel-border/60" aria-hidden />
        {(['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'bottom-3 right-3 border-b border-r'] as const).map(
          (pos) => (
            <span key={pos} className={`pointer-events-none absolute h-4 w-4 border-kernel-secondary/70 ${pos}`} aria-hidden />
          ),
        )}

        <SlideLayout eyebrow={`CH ${pad(chapter.number)} · ${chapter.title}`}>
          {/* HUD safe-area indicator */}
          <div className="pointer-events-none absolute inset-0 border border-dashed border-kernel-border" aria-hidden>
            <span className="absolute -top-px right-0 -translate-y-full pb-1 font-mono text-[10px] tracking-[0.2em] text-kernel-muted/70">
              SAFE AREA · 16:9
            </span>
          </div>

          <div className="col-span-12 flex flex-col items-center justify-center text-center">
            <div className="mb-[2.5cqh] flex items-center gap-2">
              <span className="rounded-sm border border-kernel-primary/40 bg-kernel-primary/10 px-2 py-1 font-mono text-[11px] tracking-[0.18em] text-kernel-primary">
                CHAPTER {pad(chapter.number)}
              </span>
              {slide.isInteractive && (
                <span className="rounded-sm border border-kernel-secondary/40 bg-kernel-secondary/10 px-2 py-1 font-mono text-[11px] tracking-[0.18em] text-kernel-secondary">
                  INTERACTIVE
                </span>
              )}
            </div>

            <div className="font-mono text-[7cqw] leading-none font-medium text-kernel-border">
              {pad(slide.index + 1)}
              <span className="text-[2cqw] text-kernel-muted/60"> / {pad(totalSlides)}</span>
            </div>

            <h1 className="mt-[2cqh] font-display text-[4cqw] leading-tight font-semibold tracking-tight text-kernel-text">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-[1.5cqh] max-w-[60cqw] font-sans text-[1.4cqw] text-kernel-muted">{slide.subtitle}</p>
            )}

            <p className="mt-[4cqh] font-mono text-[10px] tracking-[0.2em] text-kernel-muted/60 uppercase">
              Engine placeholder · {slide.id}
            </p>

            {slide.isInteractive && (
              /* PHASE 3 QA fixture — verifies keyboard/wheel guards inside an
                 interactive zone. Replaced by the real Laboratory in Phase 6. */
              <div
                data-interactive-zone="true"
                data-testid="interactive-zone-fixture"
                className="glass-surface mt-[3cqh] flex w-[38cqw] flex-col gap-2 rounded-sm px-4 py-3 text-left"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-kernel-secondary">
                  INTERACTIVE ZONE · GUARD TEST
                </span>
                <span className="text-[11px] text-kernel-muted">
                  Wheel, arrows and Space inside this box must not change slides.
                </span>
                <input
                  type="range"
                  min={1}
                  max={25}
                  defaultValue={5}
                  aria-label="Test slider (k)"
                  className="w-full accent-[#22D3EE]"
                />
              </div>
            )}
          </div>
        </SlideLayout>
      </>
    )
  }
  EnginePlaceholderSlide.displayName = `EnginePlaceholderSlide(${slide.id})`
  return EnginePlaceholderSlide
}
