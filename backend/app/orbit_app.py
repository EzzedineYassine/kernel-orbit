"""Standalone KERNEL / ORBIT FastAPI application (Implicit ALS backend).

Preserves the original Phase 4 KNN application in `app/main.py` intact until
Phase E cutover after independent verification.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.orbit_routes import orbit_router
from app.orbit.als_service import ORBIT_API_VERSION, get_orbit_service

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


@asynccontextmanager
async def _lifespan(_app: FastAPI):
    # Pre-load dataset and fit default ALS model once at startup.
    get_orbit_service()
    yield


def create_orbit_app() -> FastAPI:
    application = FastAPI(
        title="KERNEL / ORBIT — Implicit Matrix Factorization (ALS) API",
        version=ORBIT_API_VERSION,
        description=(
            "Personalized product recommendation backend powered by Implicit ALS "
            "on the official UCI Online Retail dataset."
        ),
        lifespan=_lifespan,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=_resolve_cors_origins(),
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )
    application.include_router(orbit_router)
    return application


orbit_app = create_orbit_app()
