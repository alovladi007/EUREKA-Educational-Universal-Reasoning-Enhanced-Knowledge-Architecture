"""
EUREKA Futures Lab - Experimental & Emerging Technologies
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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info(f"🚀 Starting EUREKA Futures Lab")

    # Initialize event bus
    event_bus = get_event_bus("futures")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.USER_CREATED, handle_user_for_i18n)
        await event_bus.subscribe(Topics.ANALYTICS_EVENT, handle_analytics_event)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.USER_CREATED)),
            asyncio.create_task(event_bus.consume_events(Topics.ANALYTICS_EVENT)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("futures")
    logger.info("✅ Service client initialized")

    # In production: Load i18n engines, initialize quantum stubs, start AI agents
    yield

    logger.info(f"🚀 Shutting down EUREKA Futures Lab")

    # Cancel event consumers
    if hasattr(app.state, 'event_tasks'):
        for task in app.state.event_tasks:
            task.cancel()

    # Stop event bus
    try:
        await event_bus.stop()
    except Exception as e:
        logger.error(f"Error stopping event bus: {e}")


app = FastAPI(
    title="EUREKA Futures Lab",
    description="i18n localization, edge/offline sync, quantum computing stubs, and advanced AI agents",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        'service': 'EUREKA Futures Lab',
        'version': '0.1.0',
        'status': 'operational',
        'features': ['i18n localization', 'Edge/offline sync', 'Quantum computing stubs', 'Advanced AI agents']
    }


@app.get("/health")
async def health():
    return {
        'status': 'healthy',
        'service': 'EUREKA Futures Lab',
        'version': '0.1.0'
    }


# Event Handlers
async def handle_user_for_i18n(event: dict):
    """Handle user creation events to set up localization preferences."""
    try:
        user_id = event.get("user_id")
        user_data = event.get("data", {})
        locale = user_data.get("locale", "en-US")
        timezone = user_data.get("timezone", "UTC")

        logger.info(f"Processing user for i18n setup: user={user_id}, locale={locale}")

        # TODO: Initialize user i18n preferences
        # TODO: Load appropriate language pack
        # TODO: Set up edge sync profile for offline access

        # Publish i18n initialization event
        event_bus = get_event_bus("futures")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="futures.i18n.initialized",
            data={
                "locale": locale,
                "timezone": timezone,
                "language_pack_loaded": True,
                "edge_sync_enabled": True
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling user for i18n: {e}")


async def handle_analytics_event(event: dict):
    """Handle analytics events to experiment with advanced AI agents."""
    try:
        user_id = event.get("user_id")
        event_type = event.get("event_type")
        analytics_data = event.get("data", {})

        logger.info(f"Processing analytics event for AI experimentation: type={event_type}, user={user_id}")

        # TODO: Feed data to experimental AI agents
        # TODO: Run quantum algorithm simulations
        # TODO: Test new ML models for pattern detection
        # TODO: Sync insights to edge devices

        # Publish experimental insights event
        event_bus = get_event_bus("futures")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="futures.experiment.completed",
            data={
                "event_type": event_type,
                "ai_agent_run": True,
                "quantum_sim_executed": False,  # TODO: Enable when ready
                "insights_generated": []
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling analytics event: {e}")


# Example authenticated endpoint
@app.get("/api/v1/futures/experiments")
async def get_experiments(current_user: dict = Depends(get_current_user)):
    """
    Get experimental features status for current user.
    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "i18n_locales_available": 0,
        "edge_devices_synced": 0,
        "quantum_experiments_run": 0,
        "ai_agents_active": 0
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


# Futures endpoints would go here
# /api/v1/i18n/translate
# /api/v1/edge/sync
# /api/v1/quantum/simulate


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8110, reload=True)
