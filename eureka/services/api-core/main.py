"""
EUREKA API Core Service

Main FastAPI application for the core API service handling:
- User authentication and authorization
- Organization management
- Course catalog
- Content management
- Enrollment and grades
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time

from app.core.config import settings
from app.core.database import engine, Base
from app import models  # noqa: F401  - Import for side effects (model registration)
from app.api.v1 import api_router
from app.middleware.tenancy import TenancyMiddleware
from app.middleware.audit import AuditMiddleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting EUREKA API Core Service")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # Create database tables (in production, use Alembic migrations)
    if settings.ENVIRONMENT == "development":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables created")
    
    yield
    
    # Shutdown
    logger.info("Shutting down EUREKA API Core Service")
    await engine.dispose()


# Create FastAPI application
app = FastAPI(
    title="EUREKA API Core",
    description="Core API for EUREKA Educational Platform",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom middleware
app.add_middleware(TenancyMiddleware)
app.add_middleware(AuditMiddleware)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all uncaught exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error" if not settings.DEBUG else str(exc)
        }
    )


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "api-core",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }


# Readiness check endpoint
@app.get("/ready", tags=["health"])
async def readiness_check():
    """Readiness check endpoint (checks database connectivity)"""
    try:
        # Check database connection
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")
        
        return {
            "status": "ready",
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "not ready",
                "database": "disconnected",
                "error": str(e) if settings.DEBUG else "Database connection failed"
            }
        )


# Include API routers
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information"""
    return {
        "service": "EUREKA API Core",
        "version": "1.0.0",
        "docs": "/docs" if settings.DEBUG else "disabled",
        "health": "/health",
        "api": "/api/v1"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
