"""Comprehensive Pytest suite for the KERNEL FastAPI + Scikit-learn backend."""

from __future__ import annotations

import math

import numpy as np
import pytest
from fastapi.testclient import TestClient

from app.knn_app import knn_app as app
from app.ml.dataset import SPECIES_NAMES, get_iris_dataset
from app.ml.model_service import model_service

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_model_config() -> None:
    """Restore default KNN config before and after every test."""
    model_service.configure(k=5, metric="euclidean", weights="uniform")
    yield
    model_service.configure(k=5, metric="euclidean", weights="uniform")


# ── 1. Health & CORS ─────────────────────────────────────────────────────────


def test_health_endpoint() -> None:
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["service"] == "kernel-ml-backend"
    assert data["dataset"] == "iris-petal-2d"
    assert data["active_config"] == {
        "k": 5,
        "metric": "euclidean",
        "weights": "uniform",
    }


@pytest.mark.parametrize(
    "origin",
    [
        "http://localhost:5173",
        "http://localhost:5179",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5179",
    ],
)
def test_cors_allows_local_vite_origins(origin: str) -> None:
    resp = client.options(
        "/api/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == origin


# ── 2. Dataset & Stratified Split ────────────────────────────────────────────


def test_dataset_endpoint_and_stratified_split() -> None:
    resp = client.get("/api/dataset")
    assert resp.status_code == 200
    data = resp.json()

    assert data["total_samples"] == 150
    assert data["train_samples"] == 120
    assert data["test_samples"] == 30
    assert data["features"] == ["petal_length", "petal_width"]
    assert data["classes"] == list(SPECIES_NAMES)
    assert len(data["observations"]) == 150

    # Exact 40 train / 10 test per species (stratified 80/20).
    assert len(data["class_summary"]) == 3
    for summary in data["class_summary"]:
        assert summary["total"] == 50
        assert summary["train"] == 40
        assert summary["test"] == 10

    train_obs = [o for o in data["observations"] if o["split"] == "train"]
    test_obs = [o for o in data["observations"] if o["split"] == "test"]
    assert len(train_obs) == 120
    assert len(test_obs) == 30

    # IDs 0..149 appear exactly once and train/test are strictly disjoint.
    train_ids = {o["id"] for o in train_obs}
    test_ids = {o["id"] for o in test_obs}
    assert train_ids.isdisjoint(test_ids)
    assert train_ids | test_ids == set(range(150))

    # Bounds match actual observations.
    pl_vals = [o["petal_length"] for o in data["observations"]]
    pw_vals = [o["petal_width"] for o in data["observations"]]
    assert data["feature_bounds"]["petal_length"]["min"] == pytest.approx(min(pl_vals))
    assert data["feature_bounds"]["petal_length"]["max"] == pytest.approx(max(pl_vals))
    assert data["feature_bounds"]["petal_width"]["min"] == pytest.approx(min(pw_vals))
    assert data["feature_bounds"]["petal_width"]["max"] == pytest.approx(max(pw_vals))


# ── 3. Zero-Leakage Verification ─────────────────────────────────────────────


def test_zero_leakage_scaler_fitted_on_train_only() -> None:
    ds = get_iris_dataset()
    for cfg in [
        {"k": 5, "metric": "euclidean", "weights": "uniform"},
        {"k": 9, "metric": "manhattan", "weights": "distance"},
    ]:
        resp = client.post("/api/model/configure", json=cfg)
        assert resp.status_code == 200

        scaler = model_service.get_snapshot().pipeline.named_steps["scaler"]
        train_mean = ds.X_train.mean(axis=0)
        train_scale = ds.X_train.std(axis=0)
        full_mean = ds.X_all.mean(axis=0)
        full_scale = ds.X_all.std(axis=0)

        np.testing.assert_allclose(scaler.mean_, train_mean, rtol=0, atol=1e-12)
        np.testing.assert_allclose(scaler.scale_, train_scale, rtol=0, atol=1e-12)

        # Confirm train stats genuinely differ from full 150-row stats (non-vacuous check).
        assert not np.allclose(train_mean, full_mean, rtol=0, atol=1e-6)
        assert not np.allclose(train_scale, full_scale, rtol=0, atol=1e-6)
        assert not np.allclose(scaler.mean_, full_mean, rtol=0, atol=1e-6)


# ── 4. Prediction, Neighbors & Real Inference ────────────────────────────────


def test_predict_setosa_and_neighbor_math() -> None:
    point = {"petal_length": 1.4, "petal_width": 0.2}
    resp = client.post("/api/model/predict", json=point)
    assert resp.status_code == 200
    data = resp.json()

    assert data["input"] == point
    assert data["predicted_class"] == "Iris setosa"
    assert data["predicted_class_id"] == 0
    assert set(data["probabilities"].keys()) == set(SPECIES_NAMES)
    assert sum(data["probabilities"].values()) == pytest.approx(1.0, abs=1e-9)
    assert data["probabilities"]["Iris setosa"] == pytest.approx(1.0)
    assert data["config"] == {"k": 5, "metric": "euclidean", "weights": "uniform"}

    neighbors = data["neighbors"]
    assert len(neighbors) == 5

    # Verify every neighbor comes from X_train, has unscaled coords, and exact scaled distance.
    ds = get_iris_dataset()
    train_id_set = set(int(i) for i in ds.train_ids)
    scaler = model_service.get_snapshot().pipeline.named_steps["scaler"]
    scaled_query = scaler.transform(np.array([[1.4, 0.2]]))[0]

    prev_dist = -1.0
    for nb in neighbors:
        assert nb["id"] in train_id_set
        assert nb["species"] == "Iris setosa"
        idx = nb["train_index"]
        assert nb["petal_length"] == pytest.approx(float(ds.X_train[idx, 0]))
        assert nb["petal_width"] == pytest.approx(float(ds.X_train[idx, 1]))

        scaled_nb = scaler.transform(ds.X_train[idx : idx + 1])[0]
        expected_dist = float(np.linalg.norm(scaled_query - scaled_nb))
        assert nb["distance"] == pytest.approx(expected_dist, abs=1e-9)
        assert nb["distance"] >= prev_dist - 1e-12
        prev_dist = nb["distance"]


def test_neighbors_endpoint_matches_predict_and_updates_with_metric() -> None:
    # Diagonal point (neither coordinate aligns with a 0.1-grid Iris sample) so L1 > L2.
    point = {"petal_length": 4.85, "petal_width": 1.75}

    euc_resp = client.post("/api/model/neighbors", json=point)
    assert euc_resp.status_code == 200
    euc_data = euc_resp.json()
    assert len(euc_data["neighbors"]) == 5

    # Switch to k=9, manhattan metric and verify distances follow L1 norm.
    cfg_resp = client.post(
        "/api/model/configure",
        json={"k": 9, "metric": "manhattan", "weights": "distance"},
    )
    assert cfg_resp.status_code == 200
    assert cfg_resp.json()["config"] == {
        "k": 9,
        "metric": "manhattan",
        "weights": "distance",
    }

    man_resp = client.post("/api/model/neighbors", json=point)
    assert man_resp.status_code == 200
    man_data = man_resp.json()
    assert len(man_data["neighbors"]) == 9

    ds = get_iris_dataset()
    scaler = model_service.get_snapshot().pipeline.named_steps["scaler"]
    scaled_query = scaler.transform(np.array([[4.85, 1.75]]))[0]
    for nb in man_data["neighbors"]:
        scaled_nb = scaler.transform(
            ds.X_train[nb["train_index"] : nb["train_index"] + 1]
        )[0]
        expected_l1 = float(np.sum(np.abs(scaled_query - scaled_nb)))
        assert nb["distance"] == pytest.approx(expected_l1, abs=1e-9)

    assert man_data["neighbors"][0]["distance"] > euc_data["neighbors"][0]["distance"]


def test_weights_reconfiguration_changes_boundary_probabilities() -> None:
    point = {"petal_length": 4.9, "petal_width": 1.65}

    client.post(
        "/api/model/configure",
        json={"k": 7, "metric": "euclidean", "weights": "uniform"},
    )
    uniform_probs = client.post("/api/model/predict", json=point).json()[
        "probabilities"
    ]

    client.post(
        "/api/model/configure",
        json={"k": 7, "metric": "euclidean", "weights": "distance"},
    )
    distance_probs = client.post("/api/model/predict", json=point).json()[
        "probabilities"
    ]

    assert sum(uniform_probs.values()) == pytest.approx(1.0)
    assert sum(distance_probs.values()) == pytest.approx(1.0)
    assert uniform_probs != distance_probs


def test_distance_weights_exact_training_point_zero_distance() -> None:
    ds = get_iris_dataset()
    exact_point = {
        "petal_length": float(ds.X_train[0, 0]),
        "petal_width": float(ds.X_train[0, 1]),
    }
    client.post("/api/model/configure", json={"k": 5, "weights": "distance"})
    resp = client.post("/api/model/predict", json=exact_point)
    assert resp.status_code == 200
    data = resp.json()

    probs = list(data["probabilities"].values())
    assert all(math.isfinite(p) for p in probs)
    assert sum(probs) == pytest.approx(1.0)
    assert data["neighbors"][0]["distance"] == pytest.approx(0.0, abs=1e-12)


# ── 5. Decision Boundary ─────────────────────────────────────────────────────


def test_boundary_default_and_custom_resolution_and_reconfiguration() -> None:
    default_resp = client.post("/api/model/boundary")
    assert default_resp.status_code == 200
    default_data = default_resp.json()
    assert default_data["resolution"] == 60
    assert len(default_data["x_values"]) == 60
    assert len(default_data["y_values"]) == 60
    assert len(default_data["predictions"]) == 60
    assert len(default_data["predictions"][0]) == 60
    assert len(default_data["confidences"]) == 60
    assert len(default_data["confidences"][0]) == 60

    # Custom resolution 25 under k=1 vs k=15 should produce distinct boundary grids.
    client.post("/api/model/configure", json={"k": 1, "metric": "euclidean"})
    grid_k1 = client.post("/api/model/boundary", json={"resolution": 25}).json()
    assert grid_k1["resolution"] == 25
    assert len(grid_k1["predictions"]) == 25
    assert len(grid_k1["predictions"][0]) == 25

    client.post("/api/model/configure", json={"k": 15, "metric": "manhattan"})
    grid_k15 = client.post("/api/model/boundary", json={"resolution": 25}).json()

    assert grid_k1["predictions"] != grid_k15["predictions"]
    flat_preds = [c for row in grid_k15["predictions"] for c in row]
    flat_confs = [c for row in grid_k15["confidences"] for c in row]
    assert set(flat_preds).issubset({0, 1, 2})
    assert all(0.0 < c <= 1.0 for c in flat_confs)

    # Direct service-level clamping check (20..120).
    assert model_service.boundary(resolution=5).resolution == 20
    assert model_service.boundary(resolution=500).resolution == 120


# ── 6. Evaluation & Metrics ──────────────────────────────────────────────────


def test_evaluate_endpoint_metrics_and_consistency() -> None:
    resp = client.get("/api/model/evaluate")
    assert resp.status_code == 200
    data = resp.json()

    assert data["train_samples"] == 120
    assert data["test_samples"] == 30
    assert data["accuracy"] == pytest.approx(data["test_accuracy"])
    assert 0.0 <= data["train_accuracy"] <= 1.0
    assert 0.0 <= data["test_accuracy"] <= 1.0
    assert data["cv_folds"] == 5
    assert 0.0 <= data["cv_mean_accuracy"] <= 1.0
    assert data["cv_std_accuracy"] >= 0.0

    cm = data["confusion_matrix"]
    assert cm["labels"] == list(SPECIES_NAMES)
    assert len(cm["matrix"]) == 3
    assert all(len(row) == 3 for row in cm["matrix"])
    assert sum(sum(row) for row in cm["matrix"]) == 30
    assert [sum(row) for row in cm["matrix"]] == [10, 10, 10]

    diag_sum = sum(cm["matrix"][i][i] for i in range(3))
    assert data["accuracy"] == pytest.approx(diag_sum / 30.0)

    assert len(data["per_class"]) == 3
    assert data["macro_precision"] == pytest.approx(
        sum(c["precision"] for c in data["per_class"]) / 3.0
    )
    assert data["macro_recall"] == pytest.approx(
        sum(c["recall"] for c in data["per_class"]) / 3.0
    )
    assert data["macro_f1"] == pytest.approx(
        sum(c["f1"] for c in data["per_class"]) / 3.0
    )

    # Reconfiguring to k=1 updates evaluation config and train accuracy.
    client.post("/api/model/configure", json={"k": 1})
    eval_k1 = client.get("/api/model/evaluate").json()
    assert eval_k1["config"]["k"] == 1
    assert eval_k1["train_accuracy"] >= data["train_accuracy"]


# ── 7. Experiment Mode ───────────────────────────────────────────────────────


def test_experiment_endpoint_default_and_with_point() -> None:
    # Default sweep (no body) evaluates [1, 3, 5, 7, 9, 11, 13, 15] via 5-fold CV.
    default_resp = client.post("/api/model/experiment")
    assert default_resp.status_code == 200
    default_data = default_resp.json()
    assert default_data["cv_folds"] == 5
    assert default_data["point"] is None
    assert [r["k"] for r in default_data["results"]] == [1, 3, 5, 7, 9, 11, 13, 15]
    for row in default_data["results"]:
        assert 0.0 <= row["train_accuracy"] <= 1.0
        assert 0.0 <= row["cv_mean_accuracy"] <= 1.0
        assert row["cv_std_accuracy"] >= 0.0
        assert row["point_prediction"] is None

    # Custom k sweep + test point should not mutate active config.
    probe = {"petal_length": 4.9, "petal_width": 1.65}
    resp = client.post(
        "/api/model/experiment",
        json={
            "k_values": [1, 5, 11],
            "metric": "manhattan",
            "weights": "distance",
            "point": probe,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["metric"] == "manhattan"
    assert data["weights"] == "distance"
    assert data["point"] == probe
    assert len(data["results"]) == 3

    for expected_k, row in zip([1, 5, 11], data["results"], strict=True):
        assert row["k"] == expected_k
        pp = row["point_prediction"]
        assert pp is not None
        assert pp["predicted_class"] in SPECIES_NAMES
        assert sum(pp["probabilities"].values()) == pytest.approx(1.0)
        assert len(pp["neighbors"]) == expected_k

    # Active config must remain untouched (k=5, euclidean, uniform).
    assert client.get("/api/health").json()["active_config"] == {
        "k": 5,
        "metric": "euclidean",
        "weights": "uniform",
    }


# ── 8. Input Validation (422 Unprocessable Entity) ───────────────────────────


@pytest.mark.parametrize(
    "endpoint,payload",
    [
        ("/api/model/configure", {"k": 0}),
        ("/api/model/configure", {"k": 16}),
        ("/api/model/configure", {"k": -3}),
        ("/api/model/configure", {"metric": "cosine"}),
        ("/api/model/configure", {"weights": "inverse"}),
        ("/api/model/configure", {"unknown_field": 1}),
        ("/api/model/predict", {"petal_length": -0.1, "petal_width": 0.2}),
        ("/api/model/predict", {"petal_length": 10.5, "petal_width": 0.2}),
        ("/api/model/predict", {"petal_length": 1.4, "petal_width": -0.1}),
        ("/api/model/predict", {"petal_length": 1.4, "petal_width": 5.5}),
        ("/api/model/neighbors", {"petal_length": 12.0, "petal_width": 1.0}),
        ("/api/model/boundary", {"resolution": 10}),
        ("/api/model/boundary", {"resolution": 121}),
        ("/api/model/experiment", {"k_values": []}),
        ("/api/model/experiment", {"k_values": [0, 3]}),
        ("/api/model/experiment", {"k_values": [1, 16]}),
        (
            "/api/model/experiment",
            {"point": {"petal_length": 99.0, "petal_width": 1.0}},
        ),
    ],
)
def test_validation_rejects_invalid_inputs_with_422(
    endpoint: str, payload: dict[str, object]
) -> None:
    resp = client.post(endpoint, json=payload)
    assert resp.status_code == 422
