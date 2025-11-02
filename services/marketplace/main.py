"""
EUREKA Marketplace Service
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import structlog

from app.core.config import settings
from app.api.v1 import content, vc_simulation

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info(f"Starting {settings.SERVICE_NAME}")
    logger.info(f"Compliance enabled: {settings.COMPLIANCE_ENABLED}")
    logger.info(f"VC starting capital: ${settings.VC_STARTING_CAPITAL}")

    # In production: Initialize database connection pool
    # In production: Initialize Stripe client
    # In production: Initialize Redis cache

    yield

    logger.info(f"Shutting down {settings.SERVICE_NAME}")

    # In production: Close database connections
    # In production: Close Redis connections


# Create FastAPI app
app = FastAPI(
    title=settings.SERVICE_NAME,
    description="Global content marketplace with creator tools, payment processing, and VC simulation",
    version=settings.VERSION,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    """Service info"""
    return {
        'service': settings.SERVICE_NAME,
        'version': settings.VERSION,
        'status': 'operational',
        'endpoints': {
            'content': f"{settings.API_V1_PREFIX}/content",
            'vc_simulation': f"{settings.API_V1_PREFIX}/vc",
            'health': '/health',
            'docs': '/docs'
        }
    }


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    # In production: Check database, Redis, external services
    return {
        'status': 'healthy',
        'service': settings.SERVICE_NAME,
        'version': settings.VERSION,
        'compliance_enabled': settings.COMPLIANCE_ENABLED
    }


# Include routers
app.include_router(
    content.router,
    prefix=f"{settings.API_V1_PREFIX}/content",
    tags=["Content Management"]
)

app.include_router(
    vc_simulation.router,
    prefix=f"{settings.API_V1_PREFIX}/vc",
    tags=["VC Simulation"]
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle unexpected exceptions"""
    logger.error(
        f"Unhandled exception: {exc}",
        extra={
            'path': request.url.path,
            'method': request.method
        },
        exc_info=True
    )
    return {
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8050,
        reload=True,
        log_level="info"
    )
