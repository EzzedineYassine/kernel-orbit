import { createContext } from 'react'
import type {
  ALSConfig,
  DatasetSummaryResponse,
  ModelMetricsResponse,
  OrbitHealthResponse,
  RetrainResponse,
} from '../types/orbit'

export interface OrbitContextValue {
  health: OrbitHealthResponse | null
  summary: DatasetSummaryResponse | null
  metrics: ModelMetricsResponse | null
  loading: boolean
  retraining: boolean
  error: string | null
  /** Increments after every successful model retrain so lab views refresh automatically. */
  modelVersion: number
  refreshAll: () => Promise<void>
  retrainModel: (config: Partial<ALSConfig>) => Promise<RetrainResponse>
}

export const OrbitContext = createContext<OrbitContextValue | null>(null)
