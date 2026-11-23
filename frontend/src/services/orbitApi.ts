import type {
  ALSConfig,
  CustomerHistoryResponse,
  CustomersListResponse,
  DatasetSummaryResponse,
  LatentSpaceResponse,
  ModelMetricsResponse,
  OrbitHealthResponse,
  ProductSearchResponse,
  RecommendationsResponse,
  RetrainResponse,
  SimilarProductsResponse,
} from '../types/orbit'

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') ||
  'http://127.0.0.1:8000'

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = (await res.json()) as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(detail)
  }
  return (await res.json()) as T
}

export const orbitApi = {
  baseUrl: API_BASE,

  health: () => requestJson<OrbitHealthResponse>('/api/health'),

  datasetSummary: () => requestJson<DatasetSummaryResponse>('/api/dataset/summary'),

  customers: (search = '', limit = 40) => {
    const params = new URLSearchParams({ limit: String(limit) })
    if (search.trim()) params.set('search', search.trim())
    return requestJson<CustomersListResponse>(`/api/customers?${params.toString()}`)
  },

  customerHistory: (customerId: string, limit = 25) =>
    requestJson<CustomerHistoryResponse>(
      `/api/customers/${encodeURIComponent(customerId)}/history?limit=${limit}`,
    ),

  recommendations: (customerId: string, n = 10) =>
    requestJson<RecommendationsResponse>(
      `/api/recommendations/${encodeURIComponent(customerId)}?n=${n}`,
    ),

  searchProducts: (query = '', limit = 20) => {
    const params = new URLSearchParams({ limit: String(limit) })
    if (query.trim()) params.set('q', query.trim())
    return requestJson<ProductSearchResponse>(`/api/products/search?${params.toString()}`)
  },

  similarProducts: (productId: string, n = 8) =>
    requestJson<SimilarProductsResponse>(
      `/api/products/${encodeURIComponent(productId)}/similar?n=${n}`,
    ),

  metrics: () => requestJson<ModelMetricsResponse>('/api/model/metrics'),

  latentSpace: (customerId?: string, maxItems = 140, maxUsers = 70) => {
    const params = new URLSearchParams({
      max_items: String(maxItems),
      max_users: String(maxUsers),
    })
    if (customerId) params.set('customer_id', customerId)
    return requestJson<LatentSpaceResponse>(`/api/model/latent-space?${params.toString()}`)
  },

  retrain: (config: Partial<ALSConfig>) =>
    requestJson<RetrainResponse>('/api/model/retrain', {
      method: 'POST',
      body: JSON.stringify(config),
    }),
}
