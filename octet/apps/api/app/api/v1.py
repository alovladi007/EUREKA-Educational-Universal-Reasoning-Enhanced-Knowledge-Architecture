"""Versioned router. Domain routers mount here, none carry their own prefix."""

from __future__ import annotations

from fastapi import APIRouter

from app.domains.grading.router import router as grading_router

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(grading_router, tags=["grading"])
