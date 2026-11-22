import { useEffect } from 'react'
import { isFocusOnNonInteractive, isInsideInteractiveZone } from '../services/domGuards'
import { usePresentation } from './usePresentation'

interface KeyboardNavigationOptions {
  exitFullscreen: () => void
}

/**
 * Global keyboard controls for the presentation.
 *
 *  → / Space / Enter*  next      ← prev      Home first      End last
 *  Esc                 close overview, else exit fullscreen
 *
 * (*) Enter only when focus is on body / a non-interactive element.
 */
export function useKeyboardNavigation({ exitFullscreen }: KeyboardNavigationOptions) {
  const {
    isOverviewOpen,
    isTransitioning,
    nextSlide,
    prevSlide,
    firstSlide,
    lastSlide,
    setOverviewOpen,
  } = usePresentation()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Global guards: modifiers (leave browser/OS shortcuts alone) and key repeat.
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.repeat) return

      if (e.key === 'Escape') {
        if (isOverviewOpen) {
          e.preventDefault()
          setOverviewOpen(false)
        } else if (document.fullscreenElement) {
          exitFullscreen()
        }
        return
      }

      if (isOverviewOpen || isTransitioning) return
      if (isInsideInteractiveZone(e.target)) return

      let action: (() => void) | null = null
      if (e.key === 'ArrowRight') action = nextSlide
      else if (e.code === 'Space') action = nextSlide
      else if (e.key === 'ArrowLeft') action = prevSlide
      else if (e.key === 'Home') action = firstSlide
      else if (e.key === 'End') action = lastSlide
      else if (e.key === 'Enter') {
        // Let Enter activate focused buttons/links/inputs natively.
        if (!isFocusOnNonInteractive()) return
        action = nextSlide
      }

      if (!action) return
      // Prevent page scroll / accidental button activation (notably Space).
      e.preventDefault()
      action()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOverviewOpen, isTransitioning, nextSlide, prevSlide, firstSlide, lastSlide, setOverviewOpen, exitFullscreen])
}
