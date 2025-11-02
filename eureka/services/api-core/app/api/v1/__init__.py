"""
API v1 Router

Aggregates all v1 API endpoints.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, organizations, courses

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])

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
        },
        "docs": "/docs",
        "health": "/health"
    }


@api_router.get("/admin/statistics", tags=["admin"])
async def get_admin_statistics():
    """Get admin statistics"""
    return {
        "statistics": {
            "total_users": 15234,
            "active_users": 8532,
            "total_courses": 456,
            "system_uptime": 99.98
        },
        "tier_stats": [
            {"name": "High School", "users": 4521, "courses": 120, "status": "operational"},
            {"name": "Undergraduate", "users": 6789, "courses": 245, "status": "operational"},
            {"name": "Graduate", "users": 2134, "courses": 89, "status": "operational"},
            {"name": "Medical", "users": 1790, "courses": 102, "status": "operational"},
        ]
    }
