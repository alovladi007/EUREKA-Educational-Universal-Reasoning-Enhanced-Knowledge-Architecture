"""
EUREKA AI Research Core
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
from app.api.v1 import research

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
    """Application lifespan"""
    logger.info(f"🔬 Starting {settings.SERVICE_NAME}")
    logger.info(f"Multi-agent orchestration enabled: {settings.ENABLE_AGENT_MEMORY}")

    # Initialize event bus
    event_bus = get_event_bus("ai-research")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.RESEARCH_QUERY, handle_research_query)
        await event_bus.subscribe(Topics.COURSE_COMPLETED, handle_course_completion)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.RESEARCH_QUERY)),
            asyncio.create_task(event_bus.consume_events(Topics.COURSE_COMPLETED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("ai-research")
    logger.info("✅ Service client initialized")

    # In production: Initialize vector DB, load models
    yield

    logger.info(f"🔬 Shutting down {settings.SERVICE_NAME}")

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
    title=settings.SERVICE_NAME,
    description="Multi-agent AI research core with federated learning and hypothesis generation",
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        'service': settings.SERVICE_NAME,
        'version': settings.VERSION,
        'status': 'operational',
        'features': [
            'Multi-agent research workflows',
            'Paper analysis',
            'Hypothesis generation',
            'Federated learning (coming soon)'
        ]
    }


@app.get("/health")
async def health_check():
    return {
        'status': 'healthy',
        'service': settings.SERVICE_NAME
    }


app.include_router(
    research.router,
    prefix=f"{settings.API_V1_PREFIX}/research",
    tags=["Research"]
)


# Event Handlers
async def handle_research_query(event: dict):
    """Handle research query events."""
    try:
        user_id = event.get("user_id")
        query_data = event.get("data", {})
        query = query_data.get("query")

        logger.info(f"Processing research query: user={user_id}, query={query}")

        # TODO: Process query with multi-agent research system
        # TODO: Generate insights and publish results

        # Publish research result event
        event_bus = get_event_bus("ai-research")
        await event_bus.publish_event(
            topic=Topics.RESEARCH_INSIGHT_GENERATED,
            event_type="research.completed",
            data={
                "query": query,
                "insights": [],  # TODO: Real insights
                "papers_analyzed": 0
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling research query: {e}")


async def handle_course_completion(event: dict):
    """Handle course completion events to suggest research topics."""
    try:
        user_id = event.get("user_id")
        course_data = event.get("data", {})
        course_id = course_data.get("course_id")

        logger.info(f"Processing course completion for research suggestions: user={user_id}, course={course_id}")

        # TODO: Analyze course content and suggest related research topics
        # TODO: Generate personalized research recommendations

    except Exception as e:
        logger.error(f"Error handling course completion: {e}")


# Example authenticated endpoint
@app.get("/api/v1/ai-research/profile")
async def get_research_profile(current_user: dict = Depends(get_current_user)):
    """
    Get research profile for current user.
    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "active_research_projects": 0,
        "papers_analyzed": 0,
        "hypotheses_generated": 0
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
    uvicorn.run("main:app", host="0.0.0.0", port=8060, reload=True)
