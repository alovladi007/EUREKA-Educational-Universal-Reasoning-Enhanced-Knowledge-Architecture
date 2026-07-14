"""
Main API router aggregating all endpoints
"""
import os

from fastapi import APIRouter, Depends
from app.api.v1.endpoints import auth, users, questions, adaptive, exams, analytics, dev, study_planner, ai_content, pricing, lessons, notes, qbank, flashcards, patent_bar, patent_community, cissp_qbank

from app.api.v1.endpoints.auth import get_current_user

# P2-10 (Gap Register): qbank/flashcards/notes/patent-bar carried 50+ fully
# public routes over learner data and answer keys. Gate every route at the
# mount site; write-role checks inside the routers still apply on top.
_authed = [Depends(get_current_user)]

api_router = APIRouter()

# Development-only routes. The dev router exposes unauthenticated helpers that
# leak answer keys (e.g. /dev/adaptive/submit-answer returns correct_answer and
# explanation), so it MUST NOT be mounted in production. Gated on ENVIRONMENT so
# a prod deployment never exposes it; it still loads first in dev to override
# authenticated endpoints as intended.
if os.getenv("ENVIRONMENT", "development").lower() != "production":
    api_router.include_router(dev.router, tags=["development"])
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(adaptive.router, prefix="/adaptive", tags=["adaptive-learning"])
api_router.include_router(exams.router, prefix="/exams", tags=["exams"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(study_planner.router, prefix="/study-planner", tags=["study-planning"])
api_router.include_router(ai_content.router, prefix="/ai", tags=["ai-content"])
api_router.include_router(pricing.router, prefix="/test-prep", tags=["pricing"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["video-lessons"])
api_router.include_router(notes.router, dependencies=_authed, prefix="/notes", tags=["notes"])
api_router.include_router(qbank.router, dependencies=_authed, prefix="/qbank", tags=["qbank"])
api_router.include_router(cissp_qbank.router, dependencies=_authed, prefix="/qbank", tags=["cissp-qbank"])
api_router.include_router(flashcards.router, dependencies=_authed, prefix="/flashcards", tags=["flashcards"])
api_router.include_router(patent_bar.router, dependencies=_authed, prefix="/patent-bar", tags=["patent-bar"])
api_router.include_router(patent_community.router, prefix="/patent-bar/community", tags=["patent-community"])

@api_router.get("/")
async def api_root():
    """
    API v1 root endpoint
    """
    return {
        "message": "EUREKA Test Prep API v1",
        "endpoints": {
            "auth": "/api/v1/auth",
            "users": "/api/v1/users",
            "questions": "/api/v1/questions",
            "adaptive": "/api/v1/adaptive",
            "exams": "/api/v1/exams",
            "analytics": "/api/v1/analytics",
            "study_planner": "/api/v1/study-planner",
            "ai_content": "/api/v1/ai",
            "pricing": "/api/v1/test-prep",
            "lessons": "/api/v1/lessons",
            "notes": "/api/v1/notes",
            "qbank": "/api/v1/qbank",
            "flashcards": "/api/v1/flashcards",
            "patent_bar": "/api/v1/patent-bar",
            "patent_bar_live_office_hours": "/api/v1/patent-bar/live/office-hours",
            "patent_bar_live_cohorts": "/api/v1/patent-bar/live/cohorts",
            "patent_bar_community": "/api/v1/patent-bar/community",
        }
    }
