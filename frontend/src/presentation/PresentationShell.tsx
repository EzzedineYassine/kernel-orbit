import { useFullscreen } from '../hooks/useFullscreen'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { PresentationHUD } from './PresentationHUD'
import { SlideStage } from './SlideStage'

/**
 * Mounts the global input controllers exactly once (keyboard + fullscreen
 * sync) and composes the stage with the HUD. Must live inside
 * <PresentationProvider>.
 */
export function PresentationShell() {
  const fullscreen = useFullscreen()
  useKeyboardNavigation({ exitFullscreen: fullscreen.exitFullscreen })

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SlideStage />
      <PresentationHUD fullscreen={fullscreen} />
    </div>
  )
}
