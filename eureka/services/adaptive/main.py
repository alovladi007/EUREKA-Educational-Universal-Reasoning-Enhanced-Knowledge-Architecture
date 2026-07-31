"""
Adaptive Learning Service - Main Application

Port: 8004
Purpose: Personalized learning paths, mastery tracking, recommendations
"""
import os
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router
from app.core.auth_guard import require_user
from app.core.config import get_settings

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="EUREKA Adaptive Learning Service",
    description="AI-powered personalized learning paths and mastery tracking",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Explicit allowlist, never "*" with credentials: browsers reject the
    # combination outright, so the wildcard never actually worked for the
    # credentialed requests this app makes, and it advertises intent to
    # trust any origin. Override per environment with CORS_ORIGINS
    # (comma-separated); the default covers the local web and admin apps.
    allow_origins=[o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:4040,http://localhost:4041").split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes. Every data route requires a valid access token (was
# fully unauthenticated); /health is defined on app directly and stays public.
app.include_router(
    api_router, prefix="/api/v1/adaptive", tags=["adaptive"],
    dependencies=[Depends(require_user)],
)


@app.get("/")
async def root():
    """Service information"""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "running",
        "features": [
            "Knowledge graph management",
            "Personalized learning paths",
            "Mastery tracking",
            "Learning recommendations",
            "Skill gap analysis",
            "Adaptive difficulty"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.SERVICE_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )
