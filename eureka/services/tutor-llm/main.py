"""
AI Tutor (LLM) Service - Main Application

Port: 8050
Purpose: AI-powered tutoring with RAG, conversation management, and knowledge tracking
"""
import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router
from app.core.auth_guard import require_user
from app.core.config import get_settings
from app.core.observability import init_observability

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="EUREKA AI Tutor Service",
    description="AI-powered tutoring with RAG and personalized learning support",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Observability (Session 3.4): structlog + OTel. Picks up
# OTEL_EXPORTER_OTLP_ENDPOINT from env; no-op exporter if unset.
init_observability(
    app,
    service_name=getattr(settings, "SERVICE_NAME", "tutor-llm"),
    environment=os.environ.get("ENVIRONMENT", "development"),
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

# Include API routes
app.include_router(
    api_router, prefix="/api/v1/tutor", tags=["tutor"],
    dependencies=[Depends(require_user)],
)


@app.get("/")
async def root():
    """Service information"""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "running",
        "port": settings.PORT,
        "features": [
            "AI-powered tutoring (GPT-4 & Claude)",
            "RAG with vector embeddings",
            "Conversation management",
            "Socratic teaching method",
            "Knowledge state tracking",
            "Confidence scoring",
            "Follow-up suggestions",
            "Session analytics"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "service": settings.SERVICE_NAME,
        "port": settings.PORT
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )
