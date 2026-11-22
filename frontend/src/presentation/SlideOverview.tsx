import { X } from 'lucide-react'
import { chapterStartIndex } from '../chapters/registry'
import { usePresentation } from '../hooks/usePresentation'

const pad = (n: number) => String(n).padStart(2, '0')

/** Modal grid of all slides grouped by chapter; clicking a slide jumps to it. */
export function SlideOverview() {
  const { chapters, slides, currentIndex, goToSlide, setOverviewOpen } = usePresentation()

  const jump = (index: number) => {
    goToSlide(index)
    setOverviewOpen(false)
  }

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-[#08090D]/80 p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Slide overview"
      onClick={() => setOverviewOpen(false)}
    >
      <div
        className="glass-surface flex max-h-full w-full max-w-[1400px] flex-col rounded-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-lg font-semibold tracking-[0.12em] text-kernel-text">OVERVIEW</h2>
            <span className="font-mono text-xs text-kernel-muted">
              {pad(slides.length)} SLIDES · {pad(chapters.length)} CHAPTERS
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOverviewOpen(false)}
            className="rounded-sm border border-kernel-border p-1.5 text-kernel-muted transition-colors hover:border-kernel-primary/60 hover:text-kernel-text"
            aria-label="Close overview"
          >
            <X size={16} />
          </button>
        </header>

        <div className="grid min-h-0 grid-cols-7 gap-3">
          {chapters.map((chapter) => {
            const chapterSlides = slides.filter((s) => s.chapterId === chapter.id)
            const isActiveChapter = slides[currentIndex].chapterId === chapter.id
            return (
              <section key={chapter.id} className="flex min-w-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => jump(chapterStartIndex[chapter.id])}
                  className="mb-1 border-b border-kernel-border pb-2 text-left"
                >
                  <div
                    className={`font-mono text-[10px] tracking-[0.2em] ${isActiveChapter ? 'text-kernel-primary' : 'text-kernel-muted'}`}
                  >
                    CH {pad(chapter.number)}
                  </div>
                  <div className="line-clamp-2 min-h-[2.5em] font-display text-sm leading-tight font-medium text-kernel-text">
                    {chapter.title}
                  </div>
                </button>
                {chapterSlides.map((slide) => {
                  const active = slide.index === currentIndex
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => jump(slide.index)}
                      aria-current={active ? 'true' : undefined}
                      className={`group flex aspect-video flex-col justify-between rounded-sm border p-2 text-left transition-colors ${
                        active
                          ? 'border-kernel-primary bg-kernel-primary/10'
                          : 'border-kernel-border bg-kernel-surface hover:border-kernel-secondary/60'
                      }`}
                    >
                      <span className="flex items-center justify-between font-mono text-[10px] text-kernel-muted">
                        {pad(slide.index + 1)}
                        {slide.isInteractive && <span className="text-kernel-secondary">LAB</span>}
                      </span>
                      <span className="line-clamp-2 text-[11px] leading-tight text-kernel-text">{slide.title}</span>
                    </button>
                  )
                })}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
