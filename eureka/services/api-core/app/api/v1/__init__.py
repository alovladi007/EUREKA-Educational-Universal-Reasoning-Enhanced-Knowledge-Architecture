"""
API v1 Router

Aggregates all v1 API endpoints.
"""

from fastapi import APIRouter

# Import endpoint routers (to be created)
# from app.api.v1.endpoints import auth, users, organizations, courses

api_router = APIRouter()

# Include routers (will be implemented in subsequent builds)
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
# api_router.include_router(courses.router, prefix="/courses", tags=["courses"])

# Placeholder endpoint
@api_router.get("/")
async def api_root():
    """API v1 root endpoint"""
    return {
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/v1/auth",
            "users": "/api/v1/users",
            "organizations": "/api/v1/organizations",
            "courses": "/api/v1/courses",
        }
    }
