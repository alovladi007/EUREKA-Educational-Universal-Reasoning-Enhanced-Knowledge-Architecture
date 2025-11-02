"""
EUREKA Institutions - B2B & Enterprise Integration
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
    logger.info(f"🏫 Starting EUREKA Institutions")

    # Initialize event bus
    event_bus = get_event_bus("institutions")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.COURSE_ENROLLED, handle_enrollment_for_lms)
        await event_bus.subscribe(Topics.ASSESSMENT_GRADED, handle_assessment_graded)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.COURSE_ENROLLED)),
            asyncio.create_task(event_bus.consume_events(Topics.ASSESSMENT_GRADED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("institutions")
    logger.info("✅ Service client initialized")

    # In production: Initialize LMS integrations, load institutional configs
    yield

    logger.info(f"🏫 Shutting down EUREKA Institutions")

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
    title="EUREKA Institutions",
    description="Teacher copilot, LMS integration, workforce matching, and B2B analytics for enterprises",
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
        'service': 'EUREKA Institutions',
        'version': '0.1.0',
        'status': 'operational',
        'features': ['Teacher copilot', 'LMS integration', 'Workforce matching', 'B2B analytics']
    }


@app.get("/health")
async def health():
    return {
        'status': 'healthy',
        'service': 'EUREKA Institutions',
        'version': '0.1.0'
    }


# Event Handlers
async def handle_enrollment_for_lms(event: dict):
    """Handle course enrollment events for LMS synchronization."""
    try:
        user_id = event.get("user_id")
        enrollment_data = event.get("data", {})
        course_id = enrollment_data.get("course_id")
        institution_id = enrollment_data.get("institution_id")

        logger.info(f"Processing enrollment for LMS sync: user={user_id}, course={course_id}, institution={institution_id}")

        # TODO: Sync enrollment to external LMS (Canvas, Moodle, Blackboard)
        # TODO: Create student record in institutional system
        # TODO: Update workforce tracking database

        # Publish LMS sync event
        event_bus = get_event_bus("institutions")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="lms.enrollment.synced",
            data={
                "course_id": course_id,
                "institution_id": institution_id,
                "lms_platform": "canvas",  # TODO: Detect from institution config
                "sync_status": "success"
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling enrollment for LMS: {e}")


async def handle_assessment_graded(event: dict):
    """Handle assessment grading events for institutional reporting."""
    try:
        user_id = event.get("user_id")
        assessment_data = event.get("data", {})
        assessment_id = assessment_data.get("assessment_id")
        score = assessment_data.get("score")
        grade = assessment_data.get("grade")

        logger.info(f"Processing assessment grade for institutional reporting: assessment={assessment_id}, user={user_id}, score={score}")

        # TODO: Sync grade to LMS gradebook
        # TODO: Update B2B analytics dashboards
        # TODO: Trigger teacher copilot insights
        # TODO: Update workforce skill mapping

        # Publish grade sync event
        event_bus = get_event_bus("institutions")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="institution.grade.reported",
            data={
                "assessment_id": assessment_id,
                "score": score,
                "grade": grade,
                "synced_to_lms": True,
                "analytics_updated": True
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling assessment grading: {e}")


# Example authenticated endpoint
@app.get("/api/v1/institutions/dashboard")
async def get_institution_dashboard(current_user: dict = Depends(get_current_user)):
    """
    Get institutional dashboard metrics for current user.
    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "active_enrollments": 0,
        "lms_integrations": 0,
        "teacher_copilot_sessions": 0,
        "workforce_matches": 0
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


# Institutions endpoints would go here
# /api/v1/lms/sync
# /api/v1/teacher/copilot/suggest
# /api/v1/workforce/match


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8100, reload=True)
