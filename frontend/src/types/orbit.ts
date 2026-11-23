/** TypeScript interfaces matching backend/app/schemas/orbit.py. */

export interface ALSConfig {
  factors: number
  iterations: number
  regularization: number
  alpha: number
  random_state: number
}

export interface OrbitHealthResponse {
  status: 'ok'
  service: string
  project: string
  algorithm: string
  version: string
  model_trained: boolean
  num_users: number
  num_items: number
  active_config: ALSConfig
  last_train_seconds: number
}

export interface SampleMatrixBlock {
  users: string[]
  items: string[]
  values: number[][]
}

export interface DatasetSummaryResponse {
  dataset_name: string
  source_url: string
  raw_rows: number
  cancelled_invoices_removed: number
  non_positive_qty_removed: number
  non_positive_price_removed: number
  missing_customer_id_removed: number
  missing_description_rows: number
  non_merchandise_codes_removed: number
  clean_transaction_rows: number
  date_min: string
  date_max: string
  split_cutoff_date: string
  train_transaction_rows: number
  test_transaction_rows: number
  min_user_interactions: number
  min_item_interactions: number
  interaction_strength_formula: string
  quantity_median: number
  quantity_p99: number
  quantity_max: number
  num_users: number
  num_items: number
  train_interactions: number
  matrix_density: number
  matrix_sparsity: number
  test_total_users: number
  test_cold_start_users: number
  test_warm_eval_users: number
  sample_matrix: SampleMatrixBlock
}

export interface CustomerSummary {
  customer_id: string
  country: string
  unique_products: number
  total_invoices: number
  total_quantity: number
  total_spend: number
  has_test_purchases: boolean
}

export interface CustomersListResponse {
  total_customers: number
  returned: number
  customers: CustomerSummary[]
}

export interface PurchaseHistoryItem {
  stock_code: string
  description: string
  purchase_count: number
  total_quantity: number
  interaction_strength: number
  last_purchase_date: string
  avg_unit_price: number
}

export interface SimilarCustomerItem {
  customer_id: string
  country: string
  unique_products: number
  similarity_score: number
}

export interface CustomerHistoryResponse {
  customer: CustomerSummary
  history: PurchaseHistoryItem[]
  latent_factors: number[]
  latent_norm: number
  similar_customers: SimilarCustomerItem[]
}

export interface RecommendedProduct {
  rank: number
  stock_code: string
  description: string
  score: number
  train_customers: number
  avg_unit_price: number
  item_factors_preview: number[]
  in_chronological_test: boolean
}

export interface RecommendationsResponse {
  customer_id: string
  config: ALSConfig
  excluded_purchased_count: number
  user_factors_preview: number[]
  recommendations: RecommendedProduct[]
}

export interface ProductSummary {
  stock_code: string
  description: string
  train_customers: number
  train_purchases: number
  train_total_quantity: number
  avg_unit_price: number
}

export interface ProductSearchResponse {
  query: string
  total_matches: number
  products: ProductSummary[]
}

export interface SimilarProductItem {
  stock_code: string
  description: string
  similarity_score: number
  train_customers: number
  avg_unit_price: number
}

export interface SimilarProductsResponse {
  product: ProductSummary
  item_factors: number[]
  similar_products: SimilarProductItem[]
}

export interface RankingMetricsAtK {
  k: number
  precision: number
  recall: number
  map: number
  ndcg: number
  catalog_coverage: number
  recommended_unique_items: number
  avg_recommended_popularity_rank: number
}

export interface ModelEvaluationBundle {
  model_name: string
  at_5: RankingMetricsAtK
  at_10: RankingMetricsAtK
}

export interface ModelMetricsResponse {
  config: ALSConfig
  evaluation_protocol: string
  split_cutoff_date: string
  evaluated_warm_users: number
  excluded_cold_start_users: number
  catalog_size: number
  als: ModelEvaluationBundle
  popularity_baseline: ModelEvaluationBundle
  lift_vs_popularity_at_10: Record<string, number>
  evaluation_note: string
}

export interface LatentPoint {
  id: string
  label: string
  kind: 'customer' | 'product'
  x: number
  y: number
  interactions: number
  is_highlighted: boolean
}

export interface LatentSpaceResponse {
  projection_method: string
  projection_note: string
  x_label: string
  y_label: string
  explained_variance_ratio: number[]
  total_explained_variance: number
  config: ALSConfig
  points: LatentPoint[]
}

export interface RetrainResponse {
  status: 'retrained'
  config: ALSConfig
  train_seconds: number
  metrics: ModelMetricsResponse
}
