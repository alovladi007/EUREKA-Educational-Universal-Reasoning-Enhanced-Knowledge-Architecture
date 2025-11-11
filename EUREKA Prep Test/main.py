"""
EUREKA Test Prep Platform - Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import engine, Base
from app.core.redis_client import redis_client
from app.ml.adaptive_engine import AdaptiveEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize ML models on startup
adaptive_engine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle - startup and shutdown
    """
    # Startup
    logger.info("Starting EUREKA Test Prep Platform...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize adaptive engine
    global adaptive_engine
    adaptive_engine = AdaptiveEngine()
    await adaptive_engine.initialize()
    
    # Test Redis connection
    await redis_client.ping()
    logger.info("Redis connected successfully")
    
    logger.info("Application started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await redis_client.close()
    logger.info("Application shutdown complete")

# Create FastAPI application
app = FastAPI(
    title="EUREKA Test Prep API",
    description="Adaptive AI-powered test preparation platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint - API health check
    """
    return {
        "message": "EUREKA Test Prep Platform API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    try:
        # Check Redis
        await redis_client.ping()
        redis_status = "healthy"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "redis": redis_status,
        "adaptive_engine": "loaded" if adaptive_engine else "not loaded"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
