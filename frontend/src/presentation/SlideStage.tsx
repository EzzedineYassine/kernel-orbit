import { usePresentation } from '../hooks/usePresentation'

/**
 * Full-viewport stage. Renders the active slide inside a 16:9 canvas
 * (`.kernel-canvas`) that letterboxes to fit any screen without scrolling.
 */
export function SlideStage() {
  const { currentSlide, currentIndex, totalSlides } = usePresentation()
  const ActiveSlide = currentSlide.component

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#08090D]">
      <div className="scientific-grid pointer-events-none absolute inset-0" aria-hidden />
      <section
        className="kernel-canvas relative overflow-hidden"
        aria-roledescription="slide"
        aria-label={`Slide ${currentIndex + 1} of ${totalSlides}: ${currentSlide.title}`}
      >
        <ActiveSlide key={currentSlide.id} />
      </section>
    </main>
  )
}
