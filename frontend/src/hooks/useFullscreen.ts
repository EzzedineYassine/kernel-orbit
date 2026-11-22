import { useCallback, useEffect } from 'react'
import { usePresentation } from './usePresentation'

export interface FullscreenControls {
  isFullscreen: boolean
  isSupported: boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}

/**
 * Fullscreen API wrapper. `isFullscreen` in PresentationContext is driven only
 * by the browser `fullscreenchange` event, so exits via Esc / browser chrome
 * are always reflected in the UI. Mount once (PresentationShell).
 */
export function useFullscreen(): FullscreenControls {
  const { isFullscreen, setFullscreen } = usePresentation()
  const isSupported = typeof document !== 'undefined' && document.fullscreenEnabled

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null)
    sync()
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [setFullscreen])

  const enterFullscreen = useCallback(() => {
    if (!isSupported || document.fullscreenElement) return
    document.documentElement.requestFullscreen().catch((err: unknown) => {
      console.warn('[KERNEL] Fullscreen request rejected:', err)
    })
  }, [isSupported])

  const exitFullscreen = useCallback(() => {
    if (!document.fullscreenElement) return
    document.exitFullscreen().catch((err: unknown) => {
      console.warn('[KERNEL] Exit fullscreen failed:', err)
    })
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) exitFullscreen()
    else enterFullscreen()
  }, [enterFullscreen, exitFullscreen])

  return { isFullscreen, isSupported, enterFullscreen, exitFullscreen, toggleFullscreen }
}
