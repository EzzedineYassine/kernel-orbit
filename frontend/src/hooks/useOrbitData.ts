import { useContext } from 'react'
import { OrbitContext } from './orbitContext'
import type { OrbitContextValue } from './orbitContext'

export function useOrbitData(): OrbitContextValue {
  const ctx = useContext(OrbitContext)
  if (!ctx) throw new Error('useOrbitData must be used inside <OrbitProvider>')
  return ctx
}
