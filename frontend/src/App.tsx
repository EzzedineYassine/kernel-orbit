import { PresentationHUD } from './presentation/PresentationHUD'
import { PresentationProvider } from './presentation/PresentationContext'
import { SlideStage } from './presentation/SlideStage'

function App() {
  return (
    <PresentationProvider>
      <div className="relative h-full w-full overflow-hidden">
        <SlideStage />
        <PresentationHUD />
      </div>
    </PresentationProvider>
  )
}

export default App
