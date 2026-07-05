"""Aggregate router for API version 1."""

from __future__ import annotations

from fastapi import APIRouter

from app.domains.dashboard.router import router as dashboard_router
from app.domains.identity.router import router as identity_router

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(identity_router)
api_v1.include_router(dashboard_router)
