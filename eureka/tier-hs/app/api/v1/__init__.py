"""
High School Tier API Router
"""

from fastapi import APIRouter
from app.api.v1.endpoints import badges, gamification, parent_portal

api_router = APIRouter()

# Badge endpoints
api_router.include_router(
    badges.router,
    prefix="/hs",
    tags=["badges"],
)

# Gamification endpoints (points & leaderboard)
api_router.include_router(
    gamification.router,
    prefix="/hs",
    tags=["gamification"],
)

# Parent portal endpoints
api_router.include_router(
    parent_portal.router,
    prefix="/hs",
    tags=["parent-portal"],
)
