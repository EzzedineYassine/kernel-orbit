"""KERNEL / ORBIT primary FastAPI application entry point (Implicit ALS)."""

from __future__ import annotations

from app.orbit_app import create_orbit_app

app = create_orbit_app()
