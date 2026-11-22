import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { isInsideDataInteractiveZone } from '../services/domGuards'
import { usePresentation } from './usePresentation'

export const WHEEL_THRESHOLD = 40
export const WHEEL_COOLDOWN_MS = 600
/** Max gap between wheel events still treated as the same trackpad momentum stream. */
const GESTURE_IDLE_GAP_MS = 220

const LINE_HEIGHT_PX = 16

/** Normalise deltaY to pixels (Firefox may report lines or pages). */
function deltaYInPixels(e: WheelEvent): number {
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * LINE_HEIGHT_PX
  if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) return e.deltaY * window.innerHeight
  return e.deltaY
}

/**
 * Controlled wheel navigation on the stage container: one slide per gesture,
 * |deltaY| >= 40px, 600ms cooldown + continuous momentum stream lock, blocked
 * while transitioning, while overview is open, or inside `[data-interactive-zone="true"]`.
 */
export function useWheelNavigation(containerRef: RefObject<HTMLElement | null>) {
  const { isOverviewOpen, isTransitioning, isFirst, isLast, nextSlide, prevSlide } = usePresentation()
  const lastTriggerRef = useRef(-Infinity)
  const lastEventRef = useRef(-Infinity)
  const gestureLockedRef = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (isOverviewOpen) return
      if (isInsideDataInteractiveZone(e.target)) return
      if (e.ctrlKey) return // pinch-zoom gesture on trackpads

      const now = performance.now()
      const gap = now - lastEventRef.current
      lastEventRef.current = now

      // Enforce the 600ms cooldown first (and keep the gesture locked during it).
      if (now - lastTriggerRef.current < WHEEL_COOLDOWN_MS) return

      // Even after 600ms, stay locked while continuous trackpad momentum keeps
      // arriving without a pause >= GESTURE_IDLE_GAP_MS.
      if (gestureLockedRef.current) {
        if (gap < GESTURE_IDLE_GAP_MS) return
        gestureLockedRef.current = false
      }

      if (isTransitioning) return

      const dy = deltaYInPixels(e)
      if (Math.abs(dy) < WHEEL_THRESHOLD) return

      const goingNext = dy > 0
      if ((goingNext && isLast) || (!goingNext && isFirst)) return

      lastTriggerRef.current = now
      gestureLockedRef.current = true
      if (goingNext) nextSlide()
      else prevSlide()
    }

    el.addEventListener('wheel', onWheel, { passive: true })
    return () => el.removeEventListener('wheel', onWheel)
  }, [containerRef, isOverviewOpen, isTransitioning, isFirst, isLast, nextSlide, prevSlide])
}
