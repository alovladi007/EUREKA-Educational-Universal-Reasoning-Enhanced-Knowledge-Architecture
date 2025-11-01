"""
Adaptive Learning Service - Main Application

Port: 8004
Purpose: Personalized learning paths, mastery tracking, recommendations
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router
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
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1/adaptive", tags=["adaptive"])


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
