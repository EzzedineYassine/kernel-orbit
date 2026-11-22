"""Leakage-free Scikit-learn KNN pipeline service for KERNEL."""

from __future__ import annotations

import threading
from dataclasses import dataclass

import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from app.ml.dataset import (
    FEATURE_LABELS,
    FEATURE_NAMES,
    FEATURE_UNIT,
    RANDOM_STATE,
    SPECIES_NAMES,
    TEST_SIZE,
    IrisDataset,
    get_iris_dataset,
)
from app.schemas.models import (
    BoundaryResponse,
    ClassSummary,
    ConfigureResponse,
    DatasetResponse,
    ExperimentKResult,
    ExperimentPointResult,
    ExperimentResponse,
    FeatureBound,
    FeatureBounds,
    MetricType,
    ModelConfig,
    NeighborSample,
    NeighborsResponse,
    Observation,
    PointRequest,
    PredictResponse,
    WeightsType,
)

CV_FOLDS: int = 5
BOUNDARY_PAD_X: float = 0.5
BOUNDARY_PAD_Y: float = 0.3
MIN_RESOLUTION: int = 20
MAX_RESOLUTION: int = 120


def build_knn_pipeline(k: int, metric: MetricType, weights: WeightsType) -> Pipeline:
    """Construct an unfitted StandardScaler -> KNeighborsClassifier pipeline."""
    return Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "knn",
                KNeighborsClassifier(
                    n_neighbors=k,
                    metric=metric,
                    weights=weights,
                ),
            ),
        ]
    )


def run_train_cv(
    dataset: IrisDataset,
    k: int,
    metric: MetricType,
    weights: WeightsType,
) -> tuple[float, float]:
    """Run Stratified 5-Fold CV exclusively on X_train / y_train (pipeline refit per fold)."""
    cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    scores = cross_val_score(
        build_knn_pipeline(k=k, metric=metric, weights=weights),
        dataset.X_train,
        dataset.y_train,
        cv=cv,
        scoring="accuracy",
    )
    return float(scores.mean()), float(scores.std())


@dataclass(frozen=True)
class ModelSnapshot:
    config: ModelConfig
    pipeline: Pipeline


class KNNModelService:
    """Thread-safe service managing the live fitted KNN pipeline."""

    def __init__(self, dataset: IrisDataset | None = None) -> None:
        self._dataset = dataset or get_iris_dataset()
        self._lock = threading.RLock()
        default_config = ModelConfig(k=5, metric="euclidean", weights="uniform")
        self._snapshot = self._fit_snapshot(default_config)

    @property
    def dataset(self) -> IrisDataset:
        return self._dataset

    def get_snapshot(self) -> ModelSnapshot:
        with self._lock:
            return self._snapshot

    def get_config(self) -> ModelConfig:
        return self.get_snapshot().config

    def _fit_snapshot(self, config: ModelConfig) -> ModelSnapshot:
        # Zero leakage: fit StandardScaler and KNN strictly on training split only.
        pipeline = build_knn_pipeline(
            k=config.k,
            metric=config.metric,
            weights=config.weights,
        )
        pipeline.fit(self._dataset.X_train, self._dataset.y_train)
        return ModelSnapshot(config=config, pipeline=pipeline)

    def get_dataset_payload(self) -> DatasetResponse:
        ds = self._dataset
        return DatasetResponse(
            name="Iris (Petal Features)",
            features=list(FEATURE_NAMES),
            classes=list(SPECIES_NAMES),
            total_samples=ds.total_samples,
            train_samples=ds.train_samples,
            test_samples=ds.test_samples,
            test_size=TEST_SIZE,
            random_state=RANDOM_STATE,
            feature_bounds=FeatureBounds(
                petal_length=FeatureBound(
                    min=ds.petal_length_min,
                    max=ds.petal_length_max,
                    unit=FEATURE_UNIT,
                    label=FEATURE_LABELS[0],
                ),
                petal_width=FeatureBound(
                    min=ds.petal_width_min,
                    max=ds.petal_width_max,
                    unit=FEATURE_UNIT,
                    label=FEATURE_LABELS[1],
                ),
            ),
            class_summary=[ClassSummary(**row) for row in ds.class_summary],
            observations=[
                Observation(
                    id=obs.id,
                    petal_length=obs.petal_length,
                    petal_width=obs.petal_width,
                    species=obs.species,
                    species_id=obs.species_id,
                    split=obs.split,
                )
                for obs in ds.observations
            ],
        )

    def configure(
        self,
        k: int | None = None,
        metric: MetricType | None = None,
        weights: WeightsType | None = None,
    ) -> ConfigureResponse:
        with self._lock:
            current = self._snapshot.config
            next_config = ModelConfig(
                k=current.k if k is None else k,
                metric=current.metric if metric is None else metric,
                weights=current.weights if weights is None else weights,
            )
            snapshot = self._fit_snapshot(next_config)
            self._snapshot = snapshot

        train_acc = float(
            snapshot.pipeline.score(self._dataset.X_train, self._dataset.y_train)
        )
        test_acc = float(
            snapshot.pipeline.score(self._dataset.X_test, self._dataset.y_test)
        )
        return ConfigureResponse(
            config=snapshot.config,
            train_accuracy=train_acc,
            test_accuracy=test_acc,
        )

    def _query_neighbors(
        self,
        pipeline: Pipeline,
        point_array: np.ndarray,
    ) -> list[NeighborSample]:
        scaled_point = pipeline.named_steps["scaler"].transform(point_array)
        distances, indices = pipeline.named_steps["knn"].kneighbors(scaled_point)

        ds = self._dataset
        results: list[NeighborSample] = []
        for dist, train_idx_raw in zip(distances[0], indices[0], strict=True):
            train_idx = int(train_idx_raw)
            class_id = int(ds.y_train[train_idx])
            results.append(
                NeighborSample(
                    id=int(ds.train_ids[train_idx]),
                    train_index=train_idx,
                    petal_length=float(ds.X_train[train_idx, 0]),
                    petal_width=float(ds.X_train[train_idx, 1]),
                    species=SPECIES_NAMES[class_id],
                    species_id=class_id,
                    distance=float(dist),
                )
            )
        return results

    def _predict_with_pipeline(
        self,
        pipeline: Pipeline,
        point: PointRequest,
    ) -> tuple[str, int, dict[str, float], list[NeighborSample]]:
        point_array = np.array(
            [[point.petal_length, point.petal_width]], dtype=np.float64
        )
        pred_id = int(pipeline.predict(point_array)[0])
        probs_raw = pipeline.predict_proba(point_array)[0]
        probabilities = {
            SPECIES_NAMES[class_id]: float(probs_raw[class_id])
            for class_id in range(len(SPECIES_NAMES))
        }
        neighbors = self._query_neighbors(pipeline, point_array)
        return SPECIES_NAMES[pred_id], pred_id, probabilities, neighbors

    def predict(self, point: PointRequest) -> PredictResponse:
        snapshot = self.get_snapshot()
        pred_class, pred_id, probabilities, neighbors = self._predict_with_pipeline(
            snapshot.pipeline, point
        )
        return PredictResponse(
            input=point,
            predicted_class=pred_class,
            predicted_class_id=pred_id,
            probabilities=probabilities,
            neighbors=neighbors,
            config=snapshot.config,
        )

    def neighbors(self, point: PointRequest) -> NeighborsResponse:
        snapshot = self.get_snapshot()
        point_array = np.array(
            [[point.petal_length, point.petal_width]], dtype=np.float64
        )
        neighbor_list = self._query_neighbors(snapshot.pipeline, point_array)
        return NeighborsResponse(
            input=point,
            config=snapshot.config,
            neighbors=neighbor_list,
        )

    def boundary(self, resolution: int = 60) -> BoundaryResponse:
        res = max(MIN_RESOLUTION, min(MAX_RESOLUTION, int(resolution)))
        snapshot = self.get_snapshot()
        ds = self._dataset

        x_min = max(0.0, ds.petal_length_min - BOUNDARY_PAD_X)
        x_max = ds.petal_length_max + BOUNDARY_PAD_X
        y_min = max(0.0, ds.petal_width_min - BOUNDARY_PAD_Y)
        y_max = ds.petal_width_max + BOUNDARY_PAD_Y

        x_values = np.linspace(x_min, x_max, res)
        y_values = np.linspace(y_min, y_max, res)
        xx, yy = np.meshgrid(x_values, y_values, indexing="xy")
        grid = np.column_stack([xx.ravel(), yy.ravel()])

        preds = snapshot.pipeline.predict(grid).reshape(res, res)
        confs = snapshot.pipeline.predict_proba(grid).max(axis=1).reshape(res, res)

        return BoundaryResponse(
            config=snapshot.config,
            resolution=res,
            classes=list(SPECIES_NAMES),
            x_values=[round(float(x), 4) for x in x_values],
            y_values=[round(float(y), 4) for y in y_values],
            predictions=[[int(cell) for cell in row] for row in preds],
            confidences=[[round(float(cell), 4) for cell in row] for row in confs],
        )

    def experiment(
        self,
        k_values: list[int],
        metric: MetricType | None = None,
        weights: WeightsType | None = None,
        point: PointRequest | None = None,
    ) -> ExperimentResponse:
        active_cfg = self.get_config()
        resolved_metric = active_cfg.metric if metric is None else metric
        resolved_weights = active_cfg.weights if weights is None else weights

        results: list[ExperimentKResult] = []
        for k in k_values:
            # Evaluate via Stratified 5-Fold CV on X_train / y_train ONLY.
            cv_mean, cv_std = run_train_cv(
                self._dataset, k=k, metric=resolved_metric, weights=resolved_weights
            )
            # Fit on X_train / y_train only for train accuracy and optional point probe.
            pipeline = build_knn_pipeline(
                k=k, metric=resolved_metric, weights=resolved_weights
            )
            pipeline.fit(self._dataset.X_train, self._dataset.y_train)
            train_acc = float(
                pipeline.score(self._dataset.X_train, self._dataset.y_train)
            )

            point_result: ExperimentPointResult | None = None
            if point is not None:
                pred_class, pred_id, probabilities, neighbors = (
                    self._predict_with_pipeline(pipeline, point)
                )
                point_result = ExperimentPointResult(
                    predicted_class=pred_class,
                    predicted_class_id=pred_id,
                    probabilities=probabilities,
                    neighbors=neighbors,
                )

            results.append(
                ExperimentKResult(
                    k=k,
                    train_accuracy=train_acc,
                    cv_mean_accuracy=cv_mean,
                    cv_std_accuracy=cv_std,
                    point_prediction=point_result,
                )
            )

        return ExperimentResponse(
            metric=resolved_metric,
            weights=resolved_weights,
            cv_folds=CV_FOLDS,
            point=point,
            results=results,
        )


model_service = KNNModelService()
