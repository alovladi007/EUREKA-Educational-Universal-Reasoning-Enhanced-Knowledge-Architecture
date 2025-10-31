"""
EUREKA Medical School Tier Service
==================================
Professional medical education platform with:
- USMLE question bank
- Clinical case simulations
- OSCE (Objective Structured Clinical Examination) platform
- Diagnostic reasoning engine
- Patient case studies
- HIPAA-compliant infrastructure
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time

from app.config import settings
from app.database import engine, Base
from app.api.v1 import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown events."""
    # Startup
    logger.info("🏥 Starting EUREKA Medical School Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"HIPAA Mode: {settings.HIPAA_MODE}")
    logger.info(f"Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'configured'}")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("✅ Medical School Service started successfully")
    
    yield
    
    # Shutdown
    logger.info("🔴 Shutting down Medical School Service...")
    await engine.dispose()


# Create FastAPI app
app = FastAPI(
    title="EUREKA Medical School API",
    description="Professional medical education platform with USMLE prep, clinical cases, and HIPAA compliance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing and HIPAA audit trail."""
    start_time = time.time()
    
    # Log request
    logger.info(f"📨 {request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Log response (HIPAA audit)
    logger.info(
        f"✅ {request.method} {request.url.path} "
        f"[{response.status_code}] {duration:.3f}s"
    )
    
    return response


# Health check endpoint
@app.get("/health", tags=["System"])
async def health_check():
    """
    Health check endpoint for monitoring.
    Returns service status and configuration.
    """
    return {
        "status": "healthy",
        "service": "medical-school",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "hipaa_mode": settings.HIPAA_MODE,
        "features": {
            "usmle_questions": True,
            "clinical_cases": True,
            "osce_simulation": True,
            "diagnostic_reasoning": True,
            "patient_cases": True,
            "phi_protection": settings.HIPAA_MODE,
        }
    }


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    """Root endpoint with service information."""
    return {
        "service": "EUREKA Medical School",
        "version": "1.0.0",
        "description": "Professional medical education platform",
        "docs": "/docs",
        "health": "/health",
        "api": "/api/v1",
    }


# Include API routes
app.include_router(api_router, prefix="/api/v1", tags=["Medical School"])


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions with HIPAA-compliant logging."""
    logger.error(f"❌ Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please contact support.",
            "request_id": str(time.time()),
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
        log_level="info",
    )
