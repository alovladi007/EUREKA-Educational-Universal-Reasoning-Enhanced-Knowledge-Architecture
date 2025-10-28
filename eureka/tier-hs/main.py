"""
EUREKA High School Tier Service

Provides gamification, badges, parent portal, and HS-specific features.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.core.database import create_tables

app = FastAPI(
    title="EUREKA High School Tier",
    description="Gamification, badges, parent portal, and K-12 features",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def startup():
    """Initialize database tables on startup"""
    await create_tables()


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "tier-hs"}

@app.get("/")
async def root():
    return {
        "service": "EUREKA High School Tier",
        "version": "1.0.0",
        "features": [
            "Badge system ✅",
            "Game points & levels ✅",
            "Leaderboards ✅",
            "Parent portal (COPPA compliant) ✅",
        ],
        "endpoints": {
            "badges": "/api/v1/hs/badges",
            "gamification": "/api/v1/hs/points",
            "leaderboard": "/api/v1/hs/leaderboard",
            "parent_portal": "/api/v1/hs/parental-consent",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
