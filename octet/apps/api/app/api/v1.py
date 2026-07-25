"""Versioned router. Domain routers mount here, none carry their own prefix."""

from __future__ import annotations

from fastapi import APIRouter

from app.domains.chemistry.router import router as chemistry_router
from app.domains.grading.router import router as grading_router
from app.domains.exams.router import router as exams_router
from app.domains.practice.router import router as practice_router
from app.domains.integrations.router import router as integrations_router

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(grading_router, tags=["grading"])
api_v1.include_router(chemistry_router, tags=["chemistry"])
api_v1.include_router(integrations_router, prefix="/integrations", tags=["integrations"])
api_v1.include_router(exams_router, tags=["exams"])
api_v1.include_router(practice_router, tags=["practice"])
