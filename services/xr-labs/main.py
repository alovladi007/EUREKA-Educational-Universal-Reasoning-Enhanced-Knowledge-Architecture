"""
EUREKA XR Labs - Immersive & Experiential Learning
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
    logger.info(f"🥽 Starting EUREKA XR Labs")

    # Initialize event bus
    event_bus = get_event_bus("xr-labs")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.XR_SESSION_STARTED, handle_xr_session_started)
        await event_bus.subscribe(Topics.LESSON_COMPLETED, handle_lesson_completed)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.XR_SESSION_STARTED)),
            asyncio.create_task(event_bus.consume_events(Topics.LESSON_COMPLETED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("xr-labs")
    logger.info("✅ Service client initialized")

    # In production: Load 3D assets, initialize physics engine
    yield

    logger.info(f"🥽 Shutting down EUREKA XR Labs")

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
    title="EUREKA XR Labs",
    description="Immersive XR/VR learning experiences with WebXR and physics simulations",
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
        'service': 'EUREKA XR Labs',
        'version': '0.1.0',
        'status': 'operational',
        'features': ['WebXR simulations', 'Physics sandbox', '3D scenarios', 'VR/AR learning']
    }


@app.get("/health")
async def health():
    return {
        'status': 'healthy',
        'service': 'EUREKA XR Labs',
        'version': '0.1.0'
    }


# Event Handlers
async def handle_xr_session_started(event: dict):
    """Handle XR session started events."""
    try:
        user_id = event.get("user_id")
        session_data = event.get("data", {})
        simulation_id = session_data.get("simulation_id")

        logger.info(f"Processing XR session start: user={user_id}, simulation={simulation_id}")

        # TODO: Initialize simulation environment
        # TODO: Load 3D assets and physics

    except Exception as e:
        logger.error(f"Error handling XR session start: {e}")


async def handle_lesson_completed(event: dict):
    """Handle lesson completion to suggest XR experiences."""
    try:
        user_id = event.get("user_id")
        lesson_data = event.get("data", {})
        lesson_id = lesson_data.get("lesson_id")

        logger.info(f"Processing lesson completion for XR suggestions: user={user_id}, lesson={lesson_id}")

        # TODO: Analyze lesson and suggest relevant XR simulations
        # Publish XR recommendation event
        event_bus = get_event_bus("xr-labs")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="xr.recommendation.generated",
            data={
                "lesson_id": lesson_id,
                "recommended_simulations": []  # TODO: Real recommendations
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling lesson completion: {e}")


# Example authenticated endpoint
@app.get("/api/v1/xr/profile")
async def get_xr_profile(current_user: dict = Depends(get_current_user)):
    """
    Get XR profile for current user.
    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "active_simulations": 0,
        "completed_experiences": 0,
        "total_xr_time_minutes": 0
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


# Simulation endpoints would go here
# /api/v1/simulations/create
# /api/v1/simulations/run
# /api/v1/webxr/scenes


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8070, reload=True)
