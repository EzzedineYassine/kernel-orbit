"""Held-out test set and cross-validation evaluation for the active KNN pipeline."""

from __future__ import annotations

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    precision_recall_fscore_support,
)

from app.ml.dataset import SPECIES_NAMES
from app.ml.model_service import CV_FOLDS, KNNModelService, run_train_cv
from app.schemas.models import (
    ConfusionMatrixData,
    EvaluateResponse,
    PerClassMetric,
)


def evaluate_model(service: KNNModelService) -> EvaluateResponse:
    """Evaluate the active fitted pipeline on the held-out 20% test split."""
    snapshot = service.get_snapshot()
    ds = service.dataset
    pipeline = snapshot.pipeline
    cfg = snapshot.config

    y_train_pred = pipeline.predict(ds.X_train)
    y_test_pred = pipeline.predict(ds.X_test)

    train_accuracy = float(accuracy_score(ds.y_train, y_train_pred))
    test_accuracy = float(accuracy_score(ds.y_test, y_test_pred))

    labels = list(range(len(SPECIES_NAMES)))
    macro_precision, macro_recall, macro_f1, _ = precision_recall_fscore_support(
        ds.y_test,
        y_test_pred,
        labels=labels,
        average="macro",
        zero_division=0,
    )
    prec_arr, rec_arr, f1_arr, sup_arr = precision_recall_fscore_support(
        ds.y_test,
        y_test_pred,
        labels=labels,
        average=None,
        zero_division=0,
    )

    per_class = [
        PerClassMetric(
            species=SPECIES_NAMES[class_id],
            species_id=class_id,
            precision=float(prec_arr[class_id]),
            recall=float(rec_arr[class_id]),
            f1=float(f1_arr[class_id]),
            support=int(sup_arr[class_id]),
        )
        for class_id in labels
    ]

    cm = confusion_matrix(ds.y_test, y_test_pred, labels=labels)
    cm_data = ConfusionMatrixData(
        labels=list(SPECIES_NAMES),
        matrix=[[int(cell) for cell in row] for row in cm],
    )

    cv_mean, cv_std = run_train_cv(
        ds, k=cfg.k, metric=cfg.metric, weights=cfg.weights
    )

    return EvaluateResponse(
        config=cfg,
        train_samples=ds.train_samples,
        test_samples=ds.test_samples,
        accuracy=test_accuracy,
        macro_precision=float(macro_precision),
        macro_recall=float(macro_recall),
        macro_f1=float(macro_f1),
        per_class=per_class,
        confusion_matrix=cm_data,
        train_accuracy=train_accuracy,
        test_accuracy=test_accuracy,
        cv_folds=CV_FOLDS,
        cv_mean_accuracy=cv_mean,
        cv_std_accuracy=cv_std,
    )
