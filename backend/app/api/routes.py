"""FastAPI router exposing all 8 KERNEL ML endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Body

from app.ml.evaluator import evaluate_model
from app.ml.model_service import model_service
from app.schemas.models import (
    BoundaryRequest,
    BoundaryResponse,
    ConfigureRequest,
    ConfigureResponse,
    DatasetResponse,
    EvaluateResponse,
    ExperimentRequest,
    ExperimentResponse,
    HealthResponse,
    NeighborsResponse,
    PointRequest,
    PredictResponse,
)

API_VERSION = "0.1.0"

router = APIRouter(prefix="/api", tags=["kernel-ml"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="kernel-ml-backend",
        version=API_VERSION,
        dataset="iris-petal-2d",
        active_config=model_service.get_config(),
    )


@router.get("/dataset", response_model=DatasetResponse)
def get_dataset() -> DatasetResponse:
    return model_service.get_dataset_payload()


@router.post("/model/configure", response_model=ConfigureResponse)
def configure_model(payload: ConfigureRequest) -> ConfigureResponse:
    return model_service.configure(
        k=payload.k,
        metric=payload.metric,
        weights=payload.weights,
    )


@router.post("/model/predict", response_model=PredictResponse)
def predict_point(payload: PointRequest) -> PredictResponse:
    return model_service.predict(payload)


@router.post("/model/neighbors", response_model=NeighborsResponse)
def nearest_neighbors(payload: PointRequest) -> NeighborsResponse:
    return model_service.neighbors(payload)


@router.post("/model/boundary", response_model=BoundaryResponse)
def decision_boundary(
    payload: BoundaryRequest = Body(default_factory=BoundaryRequest),
) -> BoundaryResponse:
    return model_service.boundary(resolution=payload.resolution)


@router.get("/model/evaluate", response_model=EvaluateResponse)
def evaluate_active_model() -> EvaluateResponse:
    return evaluate_model(model_service)


@router.post("/model/experiment", response_model=ExperimentResponse)
def run_experiment(
    payload: ExperimentRequest = Body(default_factory=ExperimentRequest),
) -> ExperimentResponse:
    return model_service.experiment(
        k_values=payload.k_values,
        metric=payload.metric,
        weights=payload.weights,
        point=payload.point,
    )
