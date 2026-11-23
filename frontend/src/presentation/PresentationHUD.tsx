import { ChevronLeft, ChevronRight, LayoutGrid, Maximize2, Minimize2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { chapterStartIndex } from '../chapters/registry'
import type { FullscreenControls } from '../hooks/useFullscreen'
import { usePresentation } from '../hooks/usePresentation'
import { SlideOverview } from './SlideOverview'

const pad = (n: number) => String(n).padStart(2, '0')

function HudButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-sm border transition-colors disabled:opacity-30 ${
        active
          ? 'border-kernel-primary/70 text-kernel-primary'
          : 'border-kernel-border text-kernel-muted enabled:hover:border-kernel-primary/60 enabled:hover:text-kernel-text'
      }`}
    >
      {children}
    </button>
  )
}

/** Persistent presentation chrome: brand, chapter, progress, controls, overview. */
export function PresentationHUD({ fullscreen }: { fullscreen: FullscreenControls }) {
  const {
    chapters,
    currentIndex,
    totalSlides,
    currentChapter,
    currentSlide,
    isFirst,
    isLast,
    isOverviewOpen,
    nextSlide,
    prevSlide,
    goToSlide,
    setOverviewOpen,
  } = usePresentation()

  const progress = totalSlides > 0 ? ((currentIndex + 1) / totalSlides) * 100 : 0

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {/* ── Top bar ── */}
      <header className="pointer-events-auto absolute inset-x-0 top-0 flex h-14 items-center justify-between px-8">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-semibold tracking-[0.32em] text-kernel-text">KERNEL</span>
          <span className="font-mono text-[11px] font-medium tracking-[0.22em] text-kernel-secondary">/ ORBIT</span>
          <span className="hidden font-mono text-[10.5px] tracking-[0.12em] text-kernel-muted sm:inline">
            · INSIDE THE RECOMMENDATION MODEL
          </span>
        </div>
        <div className="font-mono text-[11px] tracking-[0.18em] text-kernel-muted uppercase">
          <span className="text-kernel-primary">Chapter {pad(currentChapter.number)}</span>
          <span className="mx-2 text-kernel-border">—</span>
          <span className="text-kernel-text">{currentChapter.title}</span>
        </div>
      </header>

      {/* ── Bottom bar ── */}
      <footer className="pointer-events-auto absolute inset-x-0 bottom-0 px-8 pb-5">
        {/* Progress line + chapter markers */}
        <div className="relative mb-4 h-6">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-kernel-border" />
          <div
            className="kernel-accent-line absolute top-1/2 left-0 h-px -translate-y-1/2 transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalSlides}
            aria-valuenow={currentIndex + 1}
            aria-label="Presentation progress"
          />
          {chapters.map((chapter) => {
            const start = chapterStartIndex[chapter.id]
            const left = (start / totalSlides) * 100
            const reached = currentIndex >= start
            const isCurrent = chapter.id === currentChapter.id
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => goToSlide(start)}
                className="group absolute top-0 flex h-6 -translate-x-1/2 flex-col items-center justify-center"
                style={{ left: `${left}%` }}
                aria-label={`Go to chapter ${chapter.number}: ${chapter.title}`}
                title={`${pad(chapter.number)} — ${chapter.title}`}
              >
                <span
                  className={`h-2 w-2 rotate-45 border transition-colors ${
                    isCurrent
                      ? 'border-kernel-secondary bg-kernel-secondary'
                      : reached
                        ? 'border-kernel-primary bg-kernel-bg'
                        : 'border-kernel-border bg-kernel-bg group-hover:border-kernel-muted'
                  }`}
                />
                <span
                  className={`absolute top-full mt-0.5 font-mono text-[9px] tracking-widest ${
                    isCurrent ? 'text-kernel-secondary' : 'text-kernel-muted/70 group-hover:text-kernel-text'
                  }`}
                >
                  {pad(chapter.number)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-baseline gap-4">
            <span className="font-mono text-sm text-kernel-text tabular-nums">
              {pad(currentIndex + 1)}
              <span className="text-kernel-muted"> / {pad(totalSlides)}</span>
            </span>
            <span className="truncate text-xs text-kernel-muted">{currentSlide.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-3 hidden font-mono text-[10px] tracking-[0.2em] text-kernel-muted/70 md:inline">
              ← → SPACE
            </span>
            <HudButton label="Previous slide" onClick={prevSlide} disabled={isFirst}>
              <ChevronLeft size={16} />
            </HudButton>
            <HudButton label="Next slide" onClick={nextSlide} disabled={isLast}>
              <ChevronRight size={16} />
            </HudButton>
            <HudButton
              label={isOverviewOpen ? 'Close slide overview' : 'Open slide overview'}
              onClick={() => setOverviewOpen(!isOverviewOpen)}
              active={isOverviewOpen}
            >
              <LayoutGrid size={15} />
            </HudButton>
            <HudButton
              label={
                !fullscreen.isSupported
                  ? 'Fullscreen not supported in this browser'
                  : fullscreen.isFullscreen
                    ? 'Exit fullscreen (Esc)'
                    : 'Enter fullscreen'
              }
              onClick={fullscreen.toggleFullscreen}
              disabled={!fullscreen.isSupported}
              active={fullscreen.isFullscreen}
            >
              {fullscreen.isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </HudButton>
          </div>
        </div>
      </footer>

      {isOverviewOpen && <SlideOverview />}
    </div>
  )
}
