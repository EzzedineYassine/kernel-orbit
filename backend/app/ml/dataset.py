"""Iris dataset loading and stratified 80/20 train/test split (zero leakage)."""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from typing import Literal

import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

SPECIES_NAMES: tuple[str, str, str] = (
    "Iris setosa",
    "Iris versicolor",
    "Iris virginica",
)
FEATURE_NAMES: tuple[str, str] = ("petal_length", "petal_width")
FEATURE_LABELS: tuple[str, str] = ("Petal Length", "Petal Width")
FEATURE_UNIT: str = "cm"

TEST_SIZE: float = 0.2
RANDOM_STATE: int = 42


@dataclass(frozen=True)
class ObservationRecord:
    id: int
    petal_length: float
    petal_width: float
    species: str
    species_id: int
    split: Literal["train", "test"]


@dataclass(frozen=True)
class IrisDataset:
    """Immutable container holding the 2-feature Iris dataset and stratified split."""

    X_all: np.ndarray
    y_all: np.ndarray
    X_train: np.ndarray
    y_train: np.ndarray
    train_ids: np.ndarray
    X_test: np.ndarray
    y_test: np.ndarray
    test_ids: np.ndarray
    observations: tuple[ObservationRecord, ...]
    petal_length_min: float
    petal_length_max: float
    petal_width_min: float
    petal_width_max: float
    class_summary: tuple[dict[str, int | str], ...]

    @property
    def total_samples(self) -> int:
        return int(len(self.y_all))

    @property
    def train_samples(self) -> int:
        return int(len(self.y_train))

    @property
    def test_samples(self) -> int:
        return int(len(self.y_test))


@lru_cache(maxsize=1)
def get_iris_dataset() -> IrisDataset:
    """Load Iris petal features (columns 2 and 3) with a deterministic stratified 80/20 split."""
    raw = load_iris()
    X_all = np.ascontiguousarray(raw.data[:, 2:4], dtype=np.float64)
    y_all = np.ascontiguousarray(raw.target, dtype=np.int64)
    all_ids = np.arange(len(y_all), dtype=np.int64)

    X_train, X_test, y_train, y_test, train_ids, test_ids = train_test_split(
        X_all,
        y_all,
        all_ids,
        test_size=TEST_SIZE,
        stratify=y_all,
        random_state=RANDOM_STATE,
    )

    train_id_set = set(int(i) for i in train_ids)
    observations = tuple(
        ObservationRecord(
            id=int(i),
            petal_length=float(X_all[i, 0]),
            petal_width=float(X_all[i, 1]),
            species=SPECIES_NAMES[int(y_all[i])],
            species_id=int(y_all[i]),
            split="train" if int(i) in train_id_set else "test",
        )
        for i in range(len(y_all))
    )

    class_summary = tuple(
        {
            "species": species,
            "species_id": class_id,
            "total": int(np.sum(y_all == class_id)),
            "train": int(np.sum(y_train == class_id)),
            "test": int(np.sum(y_test == class_id)),
        }
        for class_id, species in enumerate(SPECIES_NAMES)
    )

    # Mark arrays read-only so no consumer can accidentally mutate cached splits.
    for arr in (X_all, y_all, X_train, y_train, train_ids, X_test, y_test, test_ids):
        arr.setflags(write=False)

    return IrisDataset(
        X_all=X_all,
        y_all=y_all,
        X_train=X_train,
        y_train=y_train,
        train_ids=train_ids,
        X_test=X_test,
        y_test=y_test,
        test_ids=test_ids,
        observations=observations,
        petal_length_min=float(X_all[:, 0].min()),
        petal_length_max=float(X_all[:, 0].max()),
        petal_width_min=float(X_all[:, 1].min()),
        petal_width_max=float(X_all[:, 1].max()),
        class_summary=class_summary,
    )
