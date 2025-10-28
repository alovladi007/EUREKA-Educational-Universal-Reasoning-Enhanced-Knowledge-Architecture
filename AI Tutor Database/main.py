"""
AI Tutor (LLM) Service - Main Application

Port: 8050
Purpose: AI-powered tutoring with RAG, conversation management, and knowledge tracking
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router
from app.core.config import get_settings

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="EUREKA AI Tutor Service",
    description="AI-powered tutoring with RAG and personalized learning support",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1/tutor", tags=["tutor"])


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
