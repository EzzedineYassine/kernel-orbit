"""FastAPI router exposing all ORBIT ALS Recommendation endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Body, HTTPException, Query

from app.orbit.als_service import (
    EntityNotFoundError,
    ModelNotTrainedError,
    get_orbit_service,
)
from app.schemas.orbit import (
    ConfigureALSRequest,
    CustomerHistoryResponse,
    CustomersListResponse,
    DatasetSummaryResponse,
    LatentSpaceResponse,
    ModelMetricsResponse,
    OrbitHealthResponse,
    ProductSearchResponse,
    RecommendationsResponse,
    RetrainALSRequest,
    RetrainResponse,
    SimilarProductsResponse,
)

orbit_router = APIRouter(prefix="/api", tags=["orbit-als"])


def _handle_service_error(exc: Exception) -> HTTPException:
    if isinstance(exc, EntityNotFoundError):
        return HTTPException(status_code=404, detail=str(exc))
    if isinstance(exc, ModelNotTrainedError):
        return HTTPException(status_code=503, detail=str(exc))
    return HTTPException(status_code=500, detail=str(exc))


@orbit_router.get("/health", response_model=OrbitHealthResponse)
def orbit_health() -> OrbitHealthResponse:
    return get_orbit_service().health()


@orbit_router.get("/dataset/summary", response_model=DatasetSummaryResponse)
def orbit_dataset_summary() -> DatasetSummaryResponse:
    return get_orbit_service().dataset_summary()


@orbit_router.get("/customers", response_model=CustomersListResponse)
def orbit_list_customers(
    search: str = Query(default="", max_length=64),
    limit: int = Query(default=40, ge=1, le=200),
) -> CustomersListResponse:
    return get_orbit_service().list_customers(search=search, limit=limit)


@orbit_router.get("/customers/{customer_id}/history", response_model=CustomerHistoryResponse)
def orbit_customer_history(
    customer_id: str,
    limit: int = Query(default=25, ge=1, le=100),
) -> CustomerHistoryResponse:
    try:
        return get_orbit_service().customer_history(customer_id=customer_id, limit=limit)
    except (EntityNotFoundError, ModelNotTrainedError) as exc:
        raise _handle_service_error(exc) from exc


@orbit_router.get("/recommendations/{customer_id}", response_model=RecommendationsResponse)
def orbit_recommendations(
    customer_id: str,
    n: int = Query(default=10, ge=1, le=20),
) -> RecommendationsResponse:
    try:
        return get_orbit_service().recommend(customer_id=customer_id, n=n)
    except (EntityNotFoundError, ModelNotTrainedError) as exc:
        raise _handle_service_error(exc) from exc


@orbit_router.get("/products/search", response_model=ProductSearchResponse)
def orbit_search_products(
    q: str = Query(default="", max_length=80),
    limit: int = Query(default=20, ge=1, le=100),
) -> ProductSearchResponse:
    return get_orbit_service().search_products(query=q, limit=limit)


@orbit_router.get("/products/{product_id}/similar", response_model=SimilarProductsResponse)
def orbit_similar_products(
    product_id: str,
    n: int = Query(default=8, ge=1, le=20),
) -> SimilarProductsResponse:
    try:
        return get_orbit_service().similar_products(product_id=product_id, n=n)
    except (EntityNotFoundError, ModelNotTrainedError) as exc:
        raise _handle_service_error(exc) from exc


@orbit_router.get("/model/metrics", response_model=ModelMetricsResponse)
def orbit_model_metrics() -> ModelMetricsResponse:
    try:
        return get_orbit_service().metrics()
    except ModelNotTrainedError as exc:
        raise _handle_service_error(exc) from exc


@orbit_router.get("/model/latent-space", response_model=LatentSpaceResponse)
def orbit_latent_space(
    customer_id: str | None = Query(default=None),
    max_items: int = Query(default=140, ge=20, le=300),
    max_users: int = Query(default=70, ge=10, le=150),
) -> LatentSpaceResponse:
    try:
        return get_orbit_service().latent_space(
            customer_id=customer_id,
            max_items=max_items,
            max_users=max_users,
        )
    except (EntityNotFoundError, ModelNotTrainedError) as exc:
        raise _handle_service_error(exc) from exc


@orbit_router.post("/model/configure", response_model=RetrainResponse)
def orbit_configure_model(
    payload: ConfigureALSRequest = Body(default_factory=ConfigureALSRequest),
) -> RetrainResponse:
    return get_orbit_service().configure(
        factors=payload.factors,
        iterations=payload.iterations,
        regularization=payload.regularization,
        alpha=payload.alpha,
        random_state=payload.random_state,
    )


@orbit_router.post("/model/retrain", response_model=RetrainResponse)
def orbit_retrain_model(
    payload: RetrainALSRequest = Body(default_factory=RetrainALSRequest),
) -> RetrainResponse:
    return get_orbit_service().configure(
        factors=payload.factors,
        iterations=payload.iterations,
        regularization=payload.regularization,
        alpha=payload.alpha,
        random_state=payload.random_state,
    )
