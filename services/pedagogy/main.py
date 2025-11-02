"""
EUREKA Pedagogical Intelligence Layer - Main FastAPI Application

Provides cognitive modeling, metacognition coaching, and adaptive tone services.
"""
import logging
import sys
import asyncio
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add shared directory to Python path
sys.path.insert(0, "/shared")
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings
from app.api.v1 import cognitive

# Import shared services
from shared import get_event_bus, get_service_client, Topics, get_current_user

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

    # Initialize event bus
    event_bus = get_event_bus("pedagogy")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.COURSE_ENROLLED, handle_course_enrollment)
        await event_bus.subscribe(Topics.LESSON_COMPLETED, handle_lesson_completion)
        await event_bus.subscribe(Topics.QUESTION_ANSWERED, handle_question_answered)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.COURSE_ENROLLED)),
            asyncio.create_task(event_bus.consume_events(Topics.LESSON_COMPLETED)),
            asyncio.create_task(event_bus.consume_events(Topics.QUESTION_ANSWERED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("pedagogy")
    logger.info("✅ Service client initialized")

    # Initialize ML models here if needed
    # model_manager.initialize()

    yield

    # Cleanup
    logger.info("🧠 EUREKA Pedagogical Intelligence Layer shutting down...")

    # Cancel event consumers
    if hasattr(app.state, 'event_tasks'):
        for task in app.state.event_tasks:
            task.cancel()

    # Stop event bus
    try:
        await event_bus.stop()
    except Exception as e:
        logger.error(f"Error stopping event bus: {e}")


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


# Event Handlers
async def handle_course_enrollment(event: dict):
    """Handle course enrollment events."""
    try:
        user_id = event.get("user_id")
        course_data = event.get("data", {})
        course_id = course_data.get("course_id")

        logger.info(f"Processing course enrollment: user={user_id}, course={course_id}")

        # Initialize knowledge state for new course
        # TODO: Implement actual knowledge state initialization
        # await initialize_learner_model(user_id, course_id)

        # Publish knowledge state updated event
        event_bus = get_event_bus("pedagogy")
        await event_bus.publish_event(
            topic=Topics.KNOWLEDGE_STATE_UPDATED,
            event_type="knowledge.state.initialized",
            data={
                "user_id": user_id,
                "course_id": course_id,
                "initial_state": "created"
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling course enrollment: {e}")


async def handle_lesson_completion(event: dict):
    """Handle lesson completion events."""
    try:
        user_id = event.get("user_id")
        lesson_data = event.get("data", {})
        lesson_id = lesson_data.get("lesson_id")

        logger.info(f"Processing lesson completion: user={user_id}, lesson={lesson_id}")

        # Update knowledge state based on lesson completion
        # TODO: Implement DKT/IRT model update
        # await update_knowledge_state(user_id, lesson_id)

    except Exception as e:
        logger.error(f"Error handling lesson completion: {e}")


async def handle_question_answered(event: dict):
    """Handle question answered events."""
    try:
        user_id = event.get("user_id")
        question_data = event.get("data", {})
        question_id = question_data.get("question_id")
        correct = question_data.get("correct", False)

        logger.info(f"Processing question answer: user={user_id}, question={question_id}, correct={correct}")

        # Update knowledge state based on answer
        # TODO: Implement IRT model update
        # await update_item_response(user_id, question_id, correct)

    except Exception as e:
        logger.error(f"Error handling question answered: {e}")


# Example authenticated endpoint
@app.get("/api/v1/pedagogy/profile")
async def get_pedagogy_profile(current_user: dict = Depends(get_current_user)):
    """
    Get personalized pedagogical profile for current user.

    This demonstrates:
    - Authentication using shared middleware
    - Service-to-service communication
    - Event publishing
    """
    user_id = current_user["user_id"]

    # Example: Call another service
    # service_client = get_service_client("pedagogy")
    # user_data = await service_client.get("api-core", f"/api/v1/users/{user_id}")

    return {
        "user_id": user_id,
        "cognitive_model": "DKT",
        "learning_style": "adaptive",
        "knowledge_state": "initialized"
    }


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
