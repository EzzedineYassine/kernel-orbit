"""Comprehensive unit and API integration tests for the KERNEL / ORBIT ALS backend."""

from __future__ import annotations

import math

import pytest
from fastapi.testclient import TestClient

from app.orbit.als_service import (
    ALSRecommendationService,
    ModelNotTrainedError,
    get_orbit_service,
)
from app.orbit.preprocessing import get_orbit_dataset
from app.orbit_app import orbit_app
from app.schemas.orbit import ALSConfig

client = TestClient(orbit_app)


@pytest.fixture(scope="module", autouse=True)
def ensure_default_orbit_model():
    """Ensure the ORBIT ALS service is initialized with default parameters."""
    svc = get_orbit_service()
    svc.retrain(ALSConfig())
    yield
    svc.retrain(ALSConfig())


# ── 1. Health & CORS ─────────────────────────────────────────────────────────


def test_orbit_health() -> None:
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert data["project"] == "KERNEL / ORBIT"
    assert data["model_trained"] is True
    assert data["num_users"] > 3000
    assert data["num_items"] > 2500
    assert data["active_config"]["factors"] == 32
    assert data["last_train_seconds"] > 0


def test_orbit_cors_headers() -> None:
    resp = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:5179",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == "http://localhost:5179"


# ── 2. Official UCI Dataset Preprocessing & Chronological Split ──────────────


def test_dataset_summary_real_uci_counts() -> None:
    resp = client.get("/api/dataset/summary")
    assert resp.status_code == 200
    data = resp.json()

    assert data["raw_rows"] == 541909
    assert data["cancelled_invoices_removed"] == 9288
    assert data["non_positive_qty_removed"] == 10624
    assert data["missing_customer_id_removed"] == 135080
    assert data["quantity_max"] == 80995
    assert data["clean_transaction_rows"] == 396337
    assert data["train_transaction_rows"] + data["test_transaction_rows"] == data["clean_transaction_rows"]
    assert 0.0 < data["matrix_density"] < 0.05
    assert data["matrix_sparsity"] > 0.95
    assert data["test_cold_start_users"] > 0
    assert data["test_warm_eval_users"] > 1000
    assert len(data["sample_matrix"]["users"]) == 12
    assert len(data["sample_matrix"]["items"]) == 16
    assert len(data["sample_matrix"]["values"]) == 12


def test_chronological_ground_truth_excludes_training_history() -> None:
    ds = get_orbit_dataset()
    for uidx, gt_items in list(ds.test_ground_truth.items())[:100]:
        train_items = {it for it, _, _, _ in ds.user_history[uidx]}
        assert gt_items.isdisjoint(train_items)


# ── 3. Customer Explorer, History & Personalized Recommendations ─────────────


def test_customers_list_and_search() -> None:
    resp = client.get("/api/customers", params={"limit": 15})
    assert resp.status_code == 200
    data = resp.json()
    assert data["returned"] == 15
    assert data["total_customers"] == get_orbit_dataset().stats.num_users
    first = data["customers"][0]
    assert first["customer_id"].startswith("CUST-")
    assert first["unique_products"] >= 5

    # Search by exact customer id returns that customer.
    search_resp = client.get("/api/customers", params={"search": first["customer_id"]})
    assert search_resp.status_code == 200
    assert any(c["customer_id"] == first["customer_id"] for c in search_resp.json()["customers"])


def test_customer_history_and_als_recommendations_exclude_purchased() -> None:
    customers = client.get("/api/customers", params={"limit": 5}).json()["customers"]
    cid = customers[0]["customer_id"]

    hist_resp = client.get(f"/api/customers/{cid}/history", params={"limit": 100})
    assert hist_resp.status_code == 200
    hist_data = hist_resp.json()
    assert hist_data["customer"]["customer_id"] == cid
    assert len(hist_data["history"]) >= 5
    assert len(hist_data["latent_factors"]) == 32
    assert hist_data["latent_norm"] > 0
    assert len(hist_data["similar_customers"]) == 5
    assert all(sc["customer_id"] != cid for sc in hist_data["similar_customers"])

    # Fetch full training purchased set directly from dataset to guarantee zero overlap.
    ds = get_orbit_dataset()
    uidx = ds.user_id_to_index[cid]
    all_purchased_codes = {ds.items[i].stock_code for i, _, _, _ in ds.user_history[uidx]}

    rec_resp = client.get(f"/api/recommendations/{cid}", params={"n": 10})
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    assert rec_data["customer_id"] == cid
    assert rec_data["excluded_purchased_count"] == len(all_purchased_codes)
    assert len(rec_data["recommendations"]) == 10

    rec_codes = [r["stock_code"] for r in rec_data["recommendations"]]
    assert len(set(rec_codes)) == 10
    assert all(code not in all_purchased_codes for code in rec_codes)
    scores = [r["score"] for r in rec_data["recommendations"]]
    assert all(math.isfinite(s) for s in scores)
    assert scores == sorted(scores, reverse=True)


# ── 4. Product Search & Similar Products ─────────────────────────────────────


def test_product_search_and_similar_products() -> None:
    search_resp = client.get("/api/products/search", params={"q": "HEART", "limit": 10})
    assert search_resp.status_code == 200
    search_data = search_resp.json()
    assert search_data["total_matches"] > 0
    assert len(search_data["products"]) > 0
    target_code = search_data["products"][0]["stock_code"]
    assert "HEART" in search_data["products"][0]["description"].upper()

    sim_resp = client.get(f"/api/products/{target_code}/similar", params={"n": 6})
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert sim_data["product"]["stock_code"] == target_code
    assert len(sim_data["item_factors"]) == 32
    assert len(sim_data["similar_products"]) == 6
    assert all(sp["stock_code"] != target_code for sp in sim_data["similar_products"])
    assert all(math.isfinite(sp["similarity_score"]) for sp in sim_data["similar_products"])


# ── 5. Chronological Evaluation Metrics vs. Popularity Baseline ──────────────


def test_model_metrics_als_beats_popularity_baseline() -> None:
    resp = client.get("/api/model/metrics")
    assert resp.status_code == 200
    data = resp.json()

    assert data["evaluated_warm_users"] > 1000
    assert data["excluded_cold_start_users"] > 0

    for bundle in (data["als"], data["popularity_baseline"]):
        for key in ("at_5", "at_10"):
            m = bundle[key]
            assert 0.0 <= m["precision"] <= 1.0
            assert 0.0 <= m["recall"] <= 1.0
            assert 0.0 <= m["map"] <= 1.0
            assert 0.0 <= m["ndcg"] <= 1.0
            assert 0.0 <= m["catalog_coverage"] <= 1.0

    # Genuine collaborative filtering lift over popularity baseline.
    assert data["als"]["at_10"]["precision"] > data["popularity_baseline"]["at_10"]["precision"]
    assert data["als"]["at_10"]["recall"] > data["popularity_baseline"]["at_10"]["recall"]
    assert data["als"]["at_10"]["map"] > data["popularity_baseline"]["at_10"]["map"]
    assert data["als"]["at_10"]["ndcg"] > data["popularity_baseline"]["at_10"]["ndcg"]
    assert data["als"]["at_10"]["catalog_coverage"] > data["popularity_baseline"]["at_10"]["catalog_coverage"]
    assert data["lift_vs_popularity_at_10"]["ndcg"] > 1.5


# ── 6. 2D PCA Latent Space Projection ────────────────────────────────────────


def test_latent_space_pca_projection() -> None:
    cid = client.get("/api/customers", params={"limit": 1}).json()["customers"][0]["customer_id"]
    resp = client.get(
        "/api/model/latent-space",
        params={"customer_id": cid, "max_items": 80, "max_users": 40},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "PCA" in data["projection_method"]
    assert "PCA projection" in data["x_label"]
    assert "PCA projection" in data["y_label"]
    assert len(data["explained_variance_ratio"]) == 2
    assert 0.0 < data["total_explained_variance"] <= 1.0

    points = data["points"]
    assert any(p["kind"] == "customer" and p["id"] == cid and p["is_highlighted"] for p in points)
    assert any(p["kind"] == "product" and p["is_highlighted"] for p in points)


# ── 7. Genuine Retraining & Configuration ────────────────────────────────────


def test_retrain_changes_factors_and_metrics() -> None:
    cid = client.get("/api/customers", params={"limit": 1}).json()["customers"][0]["customer_id"]
    before_metrics = client.get("/api/model/metrics").json()

    retrain_resp = client.post(
        "/api/model/retrain",
        json={"factors": 16, "iterations": 12, "regularization": 0.5, "alpha": 10.0},
    )
    assert retrain_resp.status_code == 200
    retrain_data = retrain_resp.json()
    assert retrain_data["status"] == "retrained"
    assert retrain_data["config"]["factors"] == 16
    assert retrain_data["config"]["iterations"] == 12
    assert retrain_data["config"]["regularization"] == pytest.approx(0.5)
    assert retrain_data["config"]["alpha"] == pytest.approx(10.0)
    assert retrain_data["train_seconds"] > 0

    # Verify customer latent vector actually resized to 16 dimensions.
    hist = client.get(f"/api/customers/{cid}/history").json()
    assert len(hist["latent_factors"]) == 16
    assert retrain_data["metrics"]["als"]["at_10"]["ndcg"] != before_metrics["als"]["at_10"]["ndcg"]

    # Restore default configuration via /api/model/configure.
    restore_resp = client.post(
        "/api/model/configure",
        json={"factors": 32, "iterations": 20, "regularization": 0.1, "alpha": 15.0},
    )
    assert restore_resp.status_code == 200
    assert restore_resp.json()["config"]["factors"] == 32


# ── 8. Graceful Errors & Strict Validation ───────────────────────────────────


def test_unknown_entities_return_404() -> None:
    assert client.get("/api/customers/CUST-99999999/history").status_code == 404
    assert client.get("/api/recommendations/CUST-99999999").status_code == 404
    assert client.get("/api/products/NONEXISTENT999/similar").status_code == 404
    assert client.get("/api/model/latent-space", params={"customer_id": "CUST-99999999"}).status_code == 404


@pytest.mark.parametrize(
    "endpoint,payload",
    [
        ("/api/model/configure", {"factors": 2}),
        ("/api/model/configure", {"factors": 256}),
        ("/api/model/configure", {"iterations": 1}),
        ("/api/model/configure", {"regularization": 0.0}),
        ("/api/model/retrain", {"alpha": 0.1}),
        ("/api/model/retrain", {"unknown_param": 123}),
    ],
)
def test_invalid_als_config_returns_422(endpoint: str, payload: dict[str, object]) -> None:
    resp = client.post(endpoint, json=payload)
    assert resp.status_code == 422


def test_untrained_service_raises_clean_error() -> None:
    untrained = ALSRecommendationService(dataset=get_orbit_dataset(), auto_train=False)
    assert untrained.health().model_trained is False
    with pytest.raises(ModelNotTrainedError):
        untrained.metrics()
