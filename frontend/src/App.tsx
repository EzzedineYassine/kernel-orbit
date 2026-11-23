import { OrbitProvider } from './hooks/OrbitProvider'
import { PresentationProvider } from './presentation/PresentationContext'
import { PresentationShell } from './presentation/PresentationShell'

function App() {
  return (
    <OrbitProvider>
      <PresentationProvider>
        <PresentationShell />
      </PresentationProvider>
    </OrbitProvider>
  )
}

export default App
