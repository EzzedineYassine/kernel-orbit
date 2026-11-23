"""Chronological holdout ranking evaluation for ORBIT ALS vs. Popularity Baseline."""

from __future__ import annotations

import math
from typing import Callable

import numpy as np
from implicit.als import AlternatingLeastSquares

from app.orbit.preprocessing import OrbitDataset
from app.schemas.orbit import (
    ALSConfig,
    ModelEvaluationBundle,
    ModelMetricsResponse,
    RankingMetricsAtK,
)


def _compute_ranking_metrics(
    ranked_lists: dict[int, list[int]],
    ground_truth: dict[int, frozenset[int]],
    k: int,
    catalog_size: int,
    item_pop_rank: dict[int, int],
) -> RankingMetricsAtK:
    """Compute Precision@K, Recall@K, MAP@K, NDCG@K, Catalog Coverage@K, and avg popularity rank."""
    precisions: list[float] = []
    recalls: list[float] = []
    aps: list[float] = []
    ndcgs: list[float] = []
    pop_ranks: list[float] = []
    unique_recommended: set[int] = set()

    for uid, gt in ground_truth.items():
        if not gt:
            continue
        recs = ranked_lists.get(uid, [])[:k]
        unique_recommended.update(recs)
        if recs:
            pop_ranks.extend(float(item_pop_rank.get(it, catalog_size)) for it in recs)

        hits = [1 if item_idx in gt else 0 for item_idx in recs]
        n_hits = sum(hits)

        precisions.append(n_hits / k)
        recalls.append(n_hits / len(gt))

        # Average Precision @ K
        ap_sum = 0.0
        running_hits = 0
        for rank_pos, h in enumerate(hits, start=1):
            if h:
                running_hits += 1
                ap_sum += running_hits / rank_pos
        denom = min(len(gt), k)
        aps.append(ap_sum / denom if denom > 0 else 0.0)

        # Normalized Discounted Cumulative Gain @ K
        dcg = sum(h / math.log2(rank_pos + 1) for rank_pos, h in enumerate(hits, start=1))
        idcg = sum(1.0 / math.log2(r + 1) for r in range(1, min(len(gt), k) + 1))
        ndcgs.append(dcg / idcg if idcg > 0 else 0.0)

    coverage = len(unique_recommended) / catalog_size if catalog_size > 0 else 0.0
    avg_pop = float(np.mean(pop_ranks)) if pop_ranks else 0.0

    return RankingMetricsAtK(
        k=k,
        precision=round(float(np.mean(precisions)) if precisions else 0.0, 5),
        recall=round(float(np.mean(recalls)) if recalls else 0.0, 5),
        map=round(float(np.mean(aps)) if aps else 0.0, 5),
        ndcg=round(float(np.mean(ndcgs)) if ndcgs else 0.0, 5),
        catalog_coverage=round(float(coverage), 5),
        recommended_unique_items=len(unique_recommended),
        avg_recommended_popularity_rank=round(avg_pop, 2),
    )


def evaluate_als_vs_popularity(
    dataset: OrbitDataset,
    model: AlternatingLeastSquares,
    config: ALSConfig,
    max_k: int = 10,
) -> ModelMetricsResponse:
    """Evaluate trained ALS model against a non-personalized popularity baseline on held-out future purchases."""
    eval_users = sorted(dataset.test_ground_truth.keys())
    catalog_size = dataset.stats.num_items
    item_pop_rank = {item_idx: rank for rank, item_idx in enumerate(dataset.popularity_ranking, start=1)}

    # Vectorized batch ALS recommendations across all warm test users (excluding training history).
    als_ranked: dict[int, list[int]] = {}
    if eval_users:
        user_arr = np.asarray(eval_users, dtype=np.int32)
        rec_ids_mat, _ = model.recommend(
            user_arr,
            dataset.train_user_items[user_arr],
            N=max_k,
            filter_already_liked_items=True,
        )
        for row_idx, uid in enumerate(eval_users):
            als_ranked[uid] = [int(x) for x in rec_ids_mat[row_idx] if int(x) >= 0]

    # Popularity baseline: top-K most popular training items excluding each user's training history.
    pop_order = dataset.popularity_ranking
    pop_ranked: dict[int, list[int]] = {}
    for uid in eval_users:
        seen = {item_idx for item_idx, _, _, _ in dataset.user_history.get(uid, ())}
        top_items: list[int] = []
        for item_idx in pop_order:
            if item_idx not in seen:
                top_items.append(item_idx)
                if len(top_items) == max_k:
                    break
        pop_ranked[uid] = top_items

    als_at_5 = _compute_ranking_metrics(
        als_ranked, dataset.test_ground_truth, 5, catalog_size, item_pop_rank
    )
    als_at_10 = _compute_ranking_metrics(
        als_ranked, dataset.test_ground_truth, 10, catalog_size, item_pop_rank
    )
    pop_at_5 = _compute_ranking_metrics(
        pop_ranked, dataset.test_ground_truth, 5, catalog_size, item_pop_rank
    )
    pop_at_10 = _compute_ranking_metrics(
        pop_ranked, dataset.test_ground_truth, 10, catalog_size, item_pop_rank
    )

    def safe_ratio(num: float, den: float) -> float:
        return round(num / den, 3) if den > 0 else 0.0

    lift_at_10 = {
        "precision": safe_ratio(als_at_10.precision, pop_at_10.precision),
        "recall": safe_ratio(als_at_10.recall, pop_at_10.recall),
        "map": safe_ratio(als_at_10.map, pop_at_10.map),
        "ndcg": safe_ratio(als_at_10.ndcg, pop_at_10.ndcg),
        "catalog_coverage": safe_ratio(als_at_10.catalog_coverage, pop_at_10.catalog_coverage),
    }

    return ModelMetricsResponse(
        config=config,
        evaluation_protocol=(
            "Chronological 80/20 holdout split. Models train strictly on earlier transactions "
            "and are scored on unseen future products purchased by warm customers in the final 20% window."
        ),
        split_cutoff_date=dataset.stats.split_cutoff_date,
        evaluated_warm_users=len(eval_users),
        excluded_cold_start_users=dataset.stats.test_cold_start_users,
        catalog_size=catalog_size,
        als=ModelEvaluationBundle(
            model_name="Implicit ALS Matrix Factorization",
            at_5=als_at_5,
            at_10=als_at_10,
        ),
        popularity_baseline=ModelEvaluationBundle(
            model_name="Popularity Baseline (Training Frequency)",
            at_5=pop_at_5,
            at_10=pop_at_10,
        ),
        lift_vs_popularity_at_10=lift_at_10,
        evaluation_note=(
            "Offline metrics measure accuracy against held-out historical purchases, not guaranteed "
            "real-world future clicks or conversions. Cold-start test users with zero training "
            "history cannot be scored by pure collaborative filtering and are counted separately."
        ),
    )
