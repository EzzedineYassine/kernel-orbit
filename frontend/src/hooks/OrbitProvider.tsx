import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { orbitApi } from '../services/orbitApi'
import type {
  ALSConfig,
  DatasetSummaryResponse,
  ModelMetricsResponse,
  OrbitHealthResponse,
} from '../types/orbit'
import { OrbitContext } from './orbitContext'
import type { OrbitContextValue } from './orbitContext'

/**
 * Provides live ORBIT FastAPI backend state (health, dataset summary, evaluation
 * metrics, and explicit retraining) across both the Slide 22 Laboratory and the
 * Chapter 06 Evaluation slides. Never injects fake fallback numbers.
 */
export function OrbitProvider({ children }: { children: ReactNode }) {
  const [health, setHealth] = useState<OrbitHealthResponse | null>(null)
  const [summary, setSummary] = useState<DatasetSummaryResponse | null>(null)
  const [metrics, setMetrics] = useState<ModelMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [retraining, setRetraining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelVersion, setModelVersion] = useState(0)

  const refreshAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [h, s, m] = await Promise.all([
        orbitApi.health(),
        orbitApi.datasetSummary(),
        orbitApi.metrics(),
      ])
      setHealth(h)
      setSummary(s)
      setMetrics(m)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach ORBIT backend.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([orbitApi.health(), orbitApi.datasetSummary(), orbitApi.metrics()])
      .then(([h, s, m]) => {
        if (!active) return
        setHealth(h)
        setSummary(s)
        setMetrics(m)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Unable to reach ORBIT backend.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const retrainModel = useCallback(async (config: Partial<ALSConfig>) => {
    setRetraining(true)
    setError(null)
    try {
      const res = await orbitApi.retrain(config)
      setMetrics(res.metrics)
      setHealth((prev) =>
        prev
          ? { ...prev, active_config: res.config, last_train_seconds: res.train_seconds }
          : prev,
      )
      setModelVersion((v) => v + 1)
      return res
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Retraining request failed.'
      setError(msg)
      throw err
    } finally {
      setRetraining(false)
    }
  }, [])

  const value = useMemo<OrbitContextValue>(
    () => ({
      health,
      summary,
      metrics,
      loading,
      retraining,
      error,
      modelVersion,
      refreshAll,
      retrainModel,
    }),
    [health, summary, metrics, loading, retraining, error, modelVersion, refreshAll, retrainModel],
  )

  return <OrbitContext.Provider value={value}>{children}</OrbitContext.Provider>
}
