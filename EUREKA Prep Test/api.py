"""
Main API router aggregating all endpoints
"""
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, questions, adaptive, exams, analytics

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])
api_router.include_router(adaptive.router, prefix="/adaptive", tags=["adaptive-learning"])
api_router.include_router(exams.router, prefix="/exams", tags=["exams"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

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
            "analytics": "/api/v1/analytics"
        }
    }
