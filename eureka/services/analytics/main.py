"""
Analytics Dashboard Service - Main Application

Port: 8005
Purpose: Comprehensive analytics, metrics, and insights for students and courses
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_router
from app.core.config import get_settings

settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="EUREKA Analytics Dashboard Service",
    description="Comprehensive analytics and insights for learning outcomes",
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
app.include_router(api_router, prefix="/api/v1/analytics", tags=["analytics"])


@app.get("/")
async def root():
    """Service information"""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "running",
        "features": [
            "Student analytics",
            "Course analytics",
            "At-risk student identification",
            "Engagement tracking",
            "Performance metrics",
            "Learning outcome tracking",
            "Cohort analysis",
            "Dashboard summaries"
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
