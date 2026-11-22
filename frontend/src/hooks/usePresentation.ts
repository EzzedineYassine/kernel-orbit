import { useContext } from 'react'
import { PresentationContext } from '../presentation/context'
import type { PresentationContextValue } from '../presentation/context'

export function usePresentation(): PresentationContextValue {
  const ctx = useContext(PresentationContext)
  if (!ctx) throw new Error('usePresentation must be used inside <PresentationProvider>')
  return ctx
}
