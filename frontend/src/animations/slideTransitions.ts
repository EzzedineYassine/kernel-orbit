import gsap from 'gsap'
import type { NavigationDirection } from '../types/presentation'

// Keep slide transitions locked to real wall-clock time so slow mount frames
// (e.g. heavy interactive slides) never stretch a 0.42s transition or prolong
// the `isTransitioning` input lock.
gsap.ticker.lagSmoothing(0)

interface TransitionSpec {
  from: gsap.TweenVars
  duration: number
  ease: string
}

/** Directional enter transitions for the incoming slide. */
export const SLIDE_TRANSITIONS: Readonly<Record<NavigationDirection, TransitionSpec>> = {
  next: { from: { x: 36, opacity: 0, scale: 0.99 }, duration: 0.42, ease: 'power3.out' },
  prev: { from: { x: -36, opacity: 0, scale: 0.99 }, duration: 0.42, ease: 'power3.out' },
  jump: { from: { y: 16, opacity: 0 }, duration: 0.38, ease: 'power2.out' },
}

/** Reduced-motion fallback: opacity-only, near-instant swap. */
export const REDUCED_MOTION_TRANSITION: TransitionSpec = {
  from: { opacity: 0 },
  duration: 0.12,
  ease: 'none',
}

interface PlayOptions {
  reducedMotion: boolean
  onComplete: () => void
}

/**
 * Animate `el` into place for the given direction. Call inside a
 * `gsap.context()` so the tween is killed/reverted on cleanup.
 */
export function playSlideEnter(
  el: HTMLElement,
  direction: NavigationDirection,
  { reducedMotion, onComplete }: PlayOptions,
): gsap.core.Tween {
  if (reducedMotion) {
    return gsap.fromTo(el, REDUCED_MOTION_TRANSITION.from, {
      opacity: 1,
      duration: REDUCED_MOTION_TRANSITION.duration,
      ease: REDUCED_MOTION_TRANSITION.ease,
      overwrite: 'auto',
      clearProps: 'opacity',
      onComplete,
    })
  }

  const spec = SLIDE_TRANSITIONS[direction]
  return gsap.fromTo(el, spec.from, {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: spec.duration,
    ease: spec.ease,
    overwrite: 'auto',
    clearProps: 'transform,opacity',
    onComplete,
  })
}
