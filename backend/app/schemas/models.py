"""Pydantic v2 request and response schemas for the KERNEL ML API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

MetricType = Literal["euclidean", "manhattan"]
WeightsType = Literal["uniform", "distance"]
SplitType = Literal["train", "test"]


class StrictRequest(BaseModel):
    """Base model rejecting unknown fields on API inputs."""

    model_config = ConfigDict(extra="forbid")


class ModelConfig(BaseModel):
    k: int = Field(5, ge=1, le=15, description="Number of nearest neighbors (1..15).")
    metric: MetricType = Field("euclidean", description="Distance metric.")
    weights: WeightsType = Field("uniform", description="Neighbor vote weighting.")


class HealthResponse(BaseModel):
    status: Literal["ok"]
    service: str
    version: str
    dataset: str
    active_config: ModelConfig


class Observation(BaseModel):
    id: int
    petal_length: float
    petal_width: float
    species: str
    species_id: int
    split: SplitType


class FeatureBound(BaseModel):
    min: float
    max: float
    unit: str
    label: str


class FeatureBounds(BaseModel):
    petal_length: FeatureBound
    petal_width: FeatureBound


class ClassSummary(BaseModel):
    species: str
    species_id: int
    total: int
    train: int
    test: int


class DatasetResponse(BaseModel):
    name: str
    features: list[str]
    classes: list[str]
    total_samples: int
    train_samples: int
    test_samples: int
    test_size: float
    random_state: int
    feature_bounds: FeatureBounds
    class_summary: list[ClassSummary]
    observations: list[Observation]


class ConfigureRequest(StrictRequest):
    k: int | None = Field(default=None, ge=1, le=15)
    metric: MetricType | None = None
    weights: WeightsType | None = None


class ConfigureResponse(BaseModel):
    config: ModelConfig
    train_accuracy: float
    test_accuracy: float


class PointRequest(StrictRequest):
    petal_length: float = Field(..., ge=0.0, le=10.0, allow_inf_nan=False)
    petal_width: float = Field(..., ge=0.0, le=5.0, allow_inf_nan=False)


class NeighborSample(BaseModel):
    id: int
    train_index: int
    petal_length: float
    petal_width: float
    species: str
    species_id: int
    distance: float


class PredictResponse(BaseModel):
    input: PointRequest
    predicted_class: str
    predicted_class_id: int
    probabilities: dict[str, float]
    neighbors: list[NeighborSample]
    config: ModelConfig


class NeighborsResponse(BaseModel):
    input: PointRequest
    config: ModelConfig
    neighbors: list[NeighborSample]


class BoundaryRequest(StrictRequest):
    resolution: int = Field(
        default=60,
        ge=20,
        le=120,
        description="Grid resolution per axis (20..120).",
    )


class BoundaryResponse(BaseModel):
    """Decision boundary grid. Matrices are indexed as [y_index][x_index]."""

    config: ModelConfig
    resolution: int
    classes: list[str]
    x_values: list[float]
    y_values: list[float]
    predictions: list[list[int]]
    confidences: list[list[float]]


class PerClassMetric(BaseModel):
    species: str
    species_id: int
    precision: float
    recall: float
    f1: float
    support: int


class ConfusionMatrixData(BaseModel):
    labels: list[str]
    matrix: list[list[int]]


class EvaluateResponse(BaseModel):
    config: ModelConfig
    train_samples: int
    test_samples: int
    accuracy: float
    macro_precision: float
    macro_recall: float
    macro_f1: float
    per_class: list[PerClassMetric]
    confusion_matrix: ConfusionMatrixData
    train_accuracy: float
    test_accuracy: float
    cv_folds: int
    cv_mean_accuracy: float
    cv_std_accuracy: float


class ExperimentRequest(StrictRequest):
    k_values: list[int] = Field(
        default_factory=lambda: [1, 3, 5, 7, 9, 11, 13, 15],
        min_length=1,
        max_length=15,
    )
    metric: MetricType | None = None
    weights: WeightsType | None = None
    point: PointRequest | None = None

    @field_validator("k_values")
    @classmethod
    def validate_k_values(cls, values: list[int]) -> list[int]:
        seen: set[int] = set()
        deduped: list[int] = []
        for k in values:
            if k < 1 or k > 15:
                raise ValueError(f"Each k value must be between 1 and 15 (got {k}).")
            if k not in seen:
                seen.add(k)
                deduped.append(k)
        return deduped


class ExperimentPointResult(BaseModel):
    predicted_class: str
    predicted_class_id: int
    probabilities: dict[str, float]
    neighbors: list[NeighborSample]


class ExperimentKResult(BaseModel):
    k: int
    train_accuracy: float
    cv_mean_accuracy: float
    cv_std_accuracy: float
    point_prediction: ExperimentPointResult | None = None


class ExperimentResponse(BaseModel):
    metric: MetricType
    weights: WeightsType
    cv_folds: int
    point: PointRequest | None
    results: list[ExperimentKResult]
