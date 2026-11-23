"""Pydantic v2 schemas for the KERNEL / ORBIT ALS Recommendation API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class StrictOrbitRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ALSConfig(BaseModel):
    factors: int = Field(32, ge=8, le=128, description="Number of latent factors (k).")
    iterations: int = Field(20, ge=5, le=50, description="ALS alternating optimization steps.")
    regularization: float = Field(0.1, ge=0.001, le=10.0, description="L2 regularization (lambda).")
    alpha: float = Field(15.0, ge=1.0, le=100.0, description="Confidence scaling alpha in C_ui = 1 + alpha * r_ui.")
    random_state: int = Field(42, ge=0, le=99999, description="Deterministic RNG seed.")


class ConfigureALSRequest(StrictOrbitRequest):
    factors: int | None = Field(default=None, ge=8, le=128)
    iterations: int | None = Field(default=None, ge=5, le=50)
    regularization: float | None = Field(default=None, ge=0.001, le=10.0)
    alpha: float | None = Field(default=None, ge=1.0, le=100.0)
    random_state: int | None = Field(default=None, ge=0, le=99999)


class RetrainALSRequest(StrictOrbitRequest):
    factors: int | None = Field(default=None, ge=8, le=128)
    iterations: int | None = Field(default=None, ge=5, le=50)
    regularization: float | None = Field(default=None, ge=0.001, le=10.0)
    alpha: float | None = Field(default=None, ge=1.0, le=100.0)
    random_state: int | None = Field(default=None, ge=0, le=99999)


class OrbitHealthResponse(BaseModel):
    status: Literal["ok"]
    service: str
    project: str
    algorithm: str
    version: str
    model_trained: bool
    num_users: int
    num_items: int
    active_config: ALSConfig
    last_train_seconds: float


class SampleMatrixBlock(BaseModel):
    users: list[str]
    items: list[str]
    values: list[list[float]]


class DatasetSummaryResponse(BaseModel):
    dataset_name: str
    source_url: str
    raw_rows: int
    cancelled_invoices_removed: int
    non_positive_qty_removed: int
    non_positive_price_removed: int
    missing_customer_id_removed: int
    missing_description_rows: int
    non_merchandise_codes_removed: int
    clean_transaction_rows: int
    date_min: str
    date_max: str
    split_cutoff_date: str
    train_transaction_rows: int
    test_transaction_rows: int
    min_user_interactions: int
    min_item_interactions: int
    interaction_strength_formula: str
    quantity_median: float
    quantity_p99: float
    quantity_max: int
    num_users: int
    num_items: int
    train_interactions: int
    matrix_density: float
    matrix_sparsity: float
    test_total_users: int
    test_cold_start_users: int
    test_warm_eval_users: int
    sample_matrix: SampleMatrixBlock


class CustomerSummary(BaseModel):
    customer_id: str
    country: str
    unique_products: int
    total_invoices: int
    total_quantity: int
    total_spend: float
    has_test_purchases: bool


class CustomersListResponse(BaseModel):
    total_customers: int
    returned: int
    customers: list[CustomerSummary]


class PurchaseHistoryItem(BaseModel):
    stock_code: str
    description: str
    purchase_count: int
    total_quantity: int
    interaction_strength: float
    last_purchase_date: str
    avg_unit_price: float


class SimilarCustomerItem(BaseModel):
    customer_id: str
    country: str
    unique_products: int
    similarity_score: float


class CustomerHistoryResponse(BaseModel):
    customer: CustomerSummary
    history: list[PurchaseHistoryItem]
    latent_factors: list[float]
    latent_norm: float
    similar_customers: list[SimilarCustomerItem]


class RecommendedProduct(BaseModel):
    rank: int
    stock_code: str
    description: str
    score: float
    train_customers: int
    avg_unit_price: float
    item_factors_preview: list[float]
    in_chronological_test: bool


class RecommendationsResponse(BaseModel):
    customer_id: str
    config: ALSConfig
    excluded_purchased_count: int
    user_factors_preview: list[float]
    recommendations: list[RecommendedProduct]


class ProductSummary(BaseModel):
    stock_code: str
    description: str
    train_customers: int
    train_purchases: int
    train_total_quantity: int
    avg_unit_price: float


class ProductSearchResponse(BaseModel):
    query: str
    total_matches: int
    products: list[ProductSummary]


class SimilarProductItem(BaseModel):
    stock_code: str
    description: str
    similarity_score: float
    train_customers: int
    avg_unit_price: float


class SimilarProductsResponse(BaseModel):
    product: ProductSummary
    item_factors: list[float]
    similar_products: list[SimilarProductItem]


class RankingMetricsAtK(BaseModel):
    k: int
    precision: float
    recall: float
    map: float
    ndcg: float
    catalog_coverage: float
    recommended_unique_items: int
    avg_recommended_popularity_rank: float


class ModelEvaluationBundle(BaseModel):
    model_name: str
    at_5: RankingMetricsAtK
    at_10: RankingMetricsAtK


class ModelMetricsResponse(BaseModel):
    config: ALSConfig
    evaluation_protocol: str
    split_cutoff_date: str
    evaluated_warm_users: int
    excluded_cold_start_users: int
    catalog_size: int
    als: ModelEvaluationBundle
    popularity_baseline: ModelEvaluationBundle
    lift_vs_popularity_at_10: dict[str, float]
    evaluation_note: str


class LatentPoint(BaseModel):
    id: str
    label: str
    kind: Literal["customer", "product"]
    x: float
    y: float
    interactions: int
    is_highlighted: bool = False


class LatentSpaceResponse(BaseModel):
    projection_method: str
    projection_note: str
    x_label: str
    y_label: str
    explained_variance_ratio: list[float]
    total_explained_variance: float
    config: ALSConfig
    points: list[LatentPoint]


class RetrainResponse(BaseModel):
    status: Literal["retrained"]
    config: ALSConfig
    train_seconds: float
    metrics: ModelMetricsResponse
