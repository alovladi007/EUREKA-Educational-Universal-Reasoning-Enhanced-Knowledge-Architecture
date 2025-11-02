"""
EUREKA Data Fabric - Unified Data Layer
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
    logger.info(f"🗄️ Starting EUREKA Data Fabric")

    # Initialize event bus
    event_bus = get_event_bus("data-fabric")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.USER_CREATED, handle_user_created)
        await event_bus.subscribe(Topics.COURSE_CREATED, handle_course_created)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.USER_CREATED)),
            asyncio.create_task(event_bus.consume_events(Topics.COURSE_CREATED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("data-fabric")
    logger.info("✅ Service client initialized")

    # In production: Connect to data lakehouse, initialize knowledge graph
    yield

    logger.info(f"🗄️ Shutting down EUREKA Data Fabric")

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
    title="EUREKA Data Fabric",
    description="Knowledge graph, data lakehouse, ETL pipelines, and semantic search for unified data access",
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
        'service': 'EUREKA Data Fabric',
        'version': '0.1.0',
        'status': 'operational',
        'features': ['Knowledge graph', 'Data lakehouse', 'ETL pipelines', 'Semantic search']
    }


@app.get("/health")
async def health():
    return {
        'status': 'healthy',
        'service': 'EUREKA Data Fabric',
        'version': '0.1.0'
    }


# Event Handlers
async def handle_user_created(event: dict):
    """Handle user creation events to index in knowledge graph."""
    try:
        user_id = event.get("user_id")
        user_data = event.get("data", {})
        email = user_data.get("email")
        role = user_data.get("role", "student")

        logger.info(f"Processing user creation for knowledge graph: user={user_id}, role={role}")

        # TODO: Create user node in knowledge graph
        # TODO: Index user profile for semantic search
        # TODO: Initialize user data in lakehouse

        # Publish data indexing event
        event_bus = get_event_bus("data-fabric")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="data.user.indexed",
            data={
                "user_id": user_id,
                "indexed_fields": ["profile", "preferences", "metadata"],
                "graph_nodes_created": 1
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling user creation: {e}")


async def handle_course_created(event: dict):
    """Handle course creation events to build knowledge graph relationships."""
    try:
        user_id = event.get("user_id")
        course_data = event.get("data", {})
        course_id = course_data.get("course_id")
        course_title = course_data.get("title")

        logger.info(f"Processing course creation for knowledge graph: course={course_id}, creator={user_id}")

        # TODO: Create course node in knowledge graph
        # TODO: Link course to creator and topics
        # TODO: Extract and index course content for semantic search
        # TODO: Run ETL pipeline to aggregate course metadata

        # Publish knowledge graph update event
        event_bus = get_event_bus("data-fabric")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="data.course.indexed",
            data={
                "course_id": course_id,
                "graph_relationships": ["created_by", "belongs_to_topic"],
                "semantic_embeddings_generated": True
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling course creation: {e}")


# Example authenticated endpoint
@app.get("/api/v1/data/graph-stats")
async def get_graph_stats(current_user: dict = Depends(get_current_user)):
    """
    Get knowledge graph statistics for current user.
    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "total_nodes": 0,
        "total_relationships": 0,
        "indexed_entities": 0,
        "semantic_queries_run": 0
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


# Data Fabric endpoints would go here
# /api/v1/graph/query
# /api/v1/search/semantic
# /api/v1/etl/pipeline/run


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8090, reload=True)
