import { PresentationProvider } from './presentation/PresentationContext'
import { PresentationShell } from './presentation/PresentationShell'

function App() {
  return (
    <PresentationProvider>
      <PresentationShell />
    </PresentationProvider>
  )
}

export default App
