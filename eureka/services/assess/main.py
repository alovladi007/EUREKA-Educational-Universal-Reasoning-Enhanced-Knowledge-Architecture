"""
Assessment Engine Service
FastAPI application for managing assessments, questions, and grading
"""

import os
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.auth_guard import require_user
from app.utils.database import init_db, close_db
from app.routes import assessments, questions, attempts, grading

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    print("✅ Assessment Engine database initialized")
    yield
    # Shutdown
    await close_db()
    print("👋 Assessment Engine shutting down")

# Create FastAPI app
app = FastAPI(
    title="Assessment Engine API",
    description="Manage assessments, questions, attempts, and grading",
    version="1.0.0",
    lifespan=lifespan
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

# Include routers. Every data route now requires a valid access token (was
# fully unauthenticated); "/" and "/health" are defined on app and stay public.
_auth = [Depends(require_user)]
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["Assessments"], dependencies=_auth)
app.include_router(questions.router, prefix="/api/v1/questions", tags=["Questions"], dependencies=_auth)
app.include_router(attempts.router, prefix="/api/v1/attempts", tags=["Attempts"], dependencies=_auth)
app.include_router(grading.router, prefix="/api/v1/grading", tags=["Grading"], dependencies=_auth)

@app.get("/")
async def root():
    return {
        "service": "Assessment Engine",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "assessments": "/api/v1/assessments",
            "questions": "/api/v1/questions",
            "attempts": "/api/v1/attempts",
            "grading": "/api/v1/grading"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "assessment-engine"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", "8002"))
    uvicorn.run(app, host="0.0.0.0", port=port)
