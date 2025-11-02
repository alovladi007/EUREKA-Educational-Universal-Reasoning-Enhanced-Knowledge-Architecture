"""
EUREKA Pedagogical Intelligence Layer - Main FastAPI Application

Provides cognitive modeling, metacognition coaching, and adaptive tone services.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.v1 import cognitive

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("🧠 EUREKA Pedagogical Intelligence Layer starting...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Port: {settings.PORT}")
    logger.info(f"DKT Hidden Dim: {settings.DKT_HIDDEN_DIM}")
    logger.info(f"IRT Model: {settings.IRT_MODEL_TYPE}")

    # Initialize ML models here if needed
    # model_manager.initialize()

    yield

    # Cleanup
    logger.info("🧠 EUREKA Pedagogical Intelligence Layer shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.SERVICE_NAME,
    description="Learner cognitive models (DKT/IRT), metacognition coach, and adaptive persona",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


# Root
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "cognitive": f"{settings.API_V1_PREFIX}/cog",
            "coach": f"{settings.API_V1_PREFIX}/coach",
            "persona": f"{settings.API_V1_PREFIX}/persona",
        }
    }


# Include API routers
app.include_router(
    cognitive.router,
    prefix=f"{settings.API_V1_PREFIX}/cog",
    tags=["Cognitive Modeling"]
)

# Note: Additional routers for coach and persona will be added
# app.include_router(coach.router, prefix=f"{settings.API_V1_PREFIX}/coach", tags=["Metacognition Coach"])
# app.include_router(persona.router, prefix=f"{settings.API_V1_PREFIX}/persona", tags=["Adaptive Persona"])


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.ENVIRONMENT == "development" else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
