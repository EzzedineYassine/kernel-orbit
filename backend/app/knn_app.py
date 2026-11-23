"""Preserved Phase 4 KNN FastAPI application (Iris classifier reference)."""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import API_VERSION, router

DEFAULT_CORS_ORIGINS: list[str] = [
    "http://localhost:5173",
    "http://localhost:5179",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5179",
]


def _resolve_cors_origins() -> list[str]:
    env_value = os.getenv("KERNEL_CORS_ORIGINS", "").strip()
    if not env_value:
        return DEFAULT_CORS_ORIGINS
    origins = [origin.strip() for origin in env_value.split(",") if origin.strip()]
    return origins or DEFAULT_CORS_ORIGINS


def create_knn_app() -> FastAPI:
    application = FastAPI(
        title="KERNEL — Preserved KNN Reference API",
        version=API_VERSION,
        description="Preserved Phase 4 Scikit-learn KNN backend.",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=_resolve_cors_origins(),
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )
    application.include_router(router)
    return application


knn_app = create_knn_app()
