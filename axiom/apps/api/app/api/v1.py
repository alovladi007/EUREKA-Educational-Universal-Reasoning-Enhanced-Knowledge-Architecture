"""Aggregate router for API version 1."""

from __future__ import annotations

from fastapi import APIRouter

from app.domains.accommodations.router import router as accommodations_router
from app.domains.adaptive.router import router as adaptive_router
from app.domains.analytics.router import router as analytics_router
from app.domains.assessment.router import router as assessment_router
from app.domains.authoring.router import router as authoring_router
from app.domains.compliance.router import router as compliance_router
from app.domains.content.router import router as content_router
from app.domains.copilot.router import router as copilot_router
from app.domains.curriculum.router import router as curriculum_router
from app.domains.dashboard.router import router as dashboard_router
from app.domains.gamification.router import router as gamification_router
from app.domains.grading.router import router as grading_router
from app.domains.identity.router import auth_router
from app.domains.identity.router import router as identity_router
from app.domains.integrations.router import router as integrations_router
from app.domains.notifications.router import router as notifications_router
from app.domains.practice.router import router as practice_router
from app.domains.proctoring.router import router as proctoring_router
from app.domains.tutoring.router import router as tutoring_router

api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(identity_router)
api_v1.include_router(auth_router)
api_v1.include_router(dashboard_router)
api_v1.include_router(curriculum_router)
api_v1.include_router(content_router)
api_v1.include_router(practice_router)
api_v1.include_router(adaptive_router)
api_v1.include_router(assessment_router)
api_v1.include_router(authoring_router)
api_v1.include_router(analytics_router)
api_v1.include_router(gamification_router)
api_v1.include_router(copilot_router)
api_v1.include_router(grading_router)
api_v1.include_router(notifications_router)
api_v1.include_router(proctoring_router)
api_v1.include_router(integrations_router)
api_v1.include_router(tutoring_router)
api_v1.include_router(accommodations_router)
api_v1.include_router(compliance_router)
