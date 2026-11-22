import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import { playSlideEnter } from '../animations/slideTransitions'
import { usePresentation } from '../hooks/usePresentation'
import { useWheelNavigation } from '../hooks/useWheelNavigation'
import { prefersReducedMotion } from '../services/domGuards'

/**
 * Full-viewport stage. Renders the active slide inside a 16:9 canvas
 * (`.kernel-canvas`) that letterboxes to fit any screen without scrolling,
 * and plays a directional GSAP enter transition on every slide change.
 */
export function SlideStage() {
  const { currentSlide, currentIndex, totalSlides, direction, setTransitioning } = usePresentation()
  const ActiveSlide = currentSlide.component

  const stageRef = useRef<HTMLElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const renderedIdRef = useRef(currentSlide.id)

  useWheelNavigation(stageRef)

  useLayoutEffect(() => {
    // Only animate on an actual slide change (not first paint, and not the
    // StrictMode mount → unmount → remount replay).
    if (renderedIdRef.current === currentSlide.id) return
    renderedIdRef.current = currentSlide.id
    const el = slideRef.current
    if (!el) return

    setTransitioning(true)
    const ctx = gsap.context(() => {
      playSlideEnter(el, direction, {
        reducedMotion: prefersReducedMotion(),
        onComplete: () => setTransitioning(false),
      })
    })

    return () => {
      // Interrupted (rapid click / unmount / StrictMode): kill tween, reset
      // inline styles and release the lock so navigation can never deadlock.
      ctx.revert()
      setTransitioning(false)
    }
  }, [currentSlide.id, direction, setTransitioning])

  return (
    <main
      ref={stageRef}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#08090D]"
    >
      <div className="scientific-grid pointer-events-none absolute inset-0" aria-hidden />
      <section
        className="kernel-canvas relative overflow-hidden"
        aria-roledescription="slide"
        aria-label={`Slide ${currentIndex + 1} of ${totalSlides}: ${currentSlide.title}`}
      >
        <div ref={slideRef} className="absolute inset-0">
          <ActiveSlide key={currentSlide.id} />
        </div>
      </section>
    </main>
  )
}
