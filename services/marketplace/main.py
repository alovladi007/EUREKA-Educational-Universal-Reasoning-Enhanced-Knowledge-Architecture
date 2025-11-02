"""
EUREKA Marketplace Service
Main FastAPI application
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import sys
import asyncio
from pathlib import Path
import structlog

# Add shared directory to Python path
sys.path.insert(0, "/shared")
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings
from app.api.v1 import content, vc_simulation

# Import shared services
from shared import get_event_bus, get_service_client, Topics, get_current_user

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
    logger.info(f"🛒 Starting {settings.SERVICE_NAME}")
    logger.info(f"Compliance enabled: {settings.COMPLIANCE_ENABLED}")
    logger.info(f"VC starting capital: ${settings.VC_STARTING_CAPITAL}")

    # Initialize event bus
    event_bus = get_event_bus("marketplace")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.CONTENT_PUBLISHED, handle_content_published)
        await event_bus.subscribe(Topics.CONTENT_PURCHASED, handle_content_purchased)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.CONTENT_PUBLISHED)),
            asyncio.create_task(event_bus.consume_events(Topics.CONTENT_PURCHASED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("marketplace")
    logger.info("✅ Service client initialized")

    # In production: Initialize database connection pool
    # In production: Initialize Stripe client
    # In production: Initialize Redis cache

    yield

    logger.info(f"🛒 Shutting down {settings.SERVICE_NAME}")

    # Cancel event consumers
    if hasattr(app.state, 'event_tasks'):
        for task in app.state.event_tasks:
            task.cancel()

    # Stop event bus
    try:
        await event_bus.stop()
    except Exception as e:
        logger.error(f"Error stopping event bus: {e}")

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


# Event Handlers
async def handle_content_published(event: dict):
    """Handle content published events."""
    try:
        user_id = event.get("user_id")
        content_data = event.get("data", {})
        content_id = content_data.get("content_id")

        logger.info(f"Processing content publish: user={user_id}, content={content_id}")

        # Notify pedagogy service for personalization updates
        # TODO: Implement actual notification logic
        # service_client = get_service_client("marketplace")
        # await service_client.post("pedagogy", "/api/v1/content-catalog/update", data={...})

    except Exception as e:
        logger.error(f"Error handling content published: {e}")


async def handle_content_purchased(event: dict):
    """Handle content purchased events."""
    try:
        user_id = event.get("user_id")
        purchase_data = event.get("data", {})
        content_id = purchase_data.get("content_id")
        creator_id = purchase_data.get("creator_id")

        logger.info(f"Processing purchase: user={user_id}, content={content_id}, creator={creator_id}")

        # Process creator payment
        # Update content access rights
        # Notify analytics service
        # TODO: Implement actual purchase processing

        # Publish analytics event
        event_bus = get_event_bus("marketplace")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="purchase.completed",
            data={
                "content_id": content_id,
                "creator_id": creator_id,
                "amount": purchase_data.get("amount", 0)
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling content purchased: {e}")


# Example authenticated endpoint
@app.get("/api/v1/marketplace/profile")
async def get_creator_profile(current_user: dict = Depends(get_current_user)):
    """
    Get creator profile for current user.

    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "creator_status": "active",
        "content_count": 0,
        "total_revenue": 0
    }


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
