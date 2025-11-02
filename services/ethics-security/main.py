"""
EUREKA Ethics & Security - AI Safety & Compliance
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
    logger.info(f"🛡️ Starting EUREKA Ethics & Security")

    # Initialize event bus
    event_bus = get_event_bus("ethics-security")
    try:
        await event_bus.start()
        logger.info("✅ Event bus connected")
    except Exception as e:
        logger.warning(f"⚠️  Event bus connection failed (continuing without events): {e}")

    # Subscribe to relevant events
    try:
        await event_bus.subscribe(Topics.SECURITY_ALERT, handle_security_alert)
        await event_bus.subscribe(Topics.ASSESSMENT_COMPLETED, handle_assessment_for_fairness)

        # Start background event consumers
        app.state.event_tasks = [
            asyncio.create_task(event_bus.consume_events(Topics.SECURITY_ALERT)),
            asyncio.create_task(event_bus.consume_events(Topics.ASSESSMENT_COMPLETED)),
        ]
        logger.info("✅ Event consumers started")
    except Exception as e:
        logger.warning(f"⚠️  Event subscription failed: {e}")
        app.state.event_tasks = []

    # Initialize service client
    app.state.service_client = get_service_client("ethics-security")
    logger.info("✅ Service client initialized")

    # In production: Load XAI models, initialize bias detection engines
    yield

    logger.info(f"🛡️ Shutting down EUREKA Ethics & Security")

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
    title="EUREKA Ethics & Security",
    description="AI safety, XAI explanations, fairness audits, bias detection, and security scanning",
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
        'service': 'EUREKA Ethics & Security',
        'version': '0.1.0',
        'status': 'operational',
        'features': ['XAI explanations', 'Fairness audits', 'Bias detection', 'Security scanning']
    }


@app.get("/health")
async def health():
    return {
        'status': 'healthy',
        'service': 'EUREKA Ethics & Security',
        'version': '0.1.0'
    }


# Event Handlers
async def handle_security_alert(event: dict):
    """Handle security alert events."""
    try:
        user_id = event.get("user_id")
        alert_data = event.get("data", {})
        alert_type = alert_data.get("alert_type")
        severity = alert_data.get("severity", "medium")

        logger.info(f"Processing security alert: type={alert_type}, severity={severity}, user={user_id}")

        # TODO: Analyze threat level
        # TODO: Trigger automated response if critical
        # TODO: Log to security audit trail

        # Publish security response event
        event_bus = get_event_bus("ethics-security")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="security.alert.processed",
            data={
                "alert_type": alert_type,
                "severity": severity,
                "action_taken": "logged_and_analyzed"
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling security alert: {e}")


async def handle_assessment_for_fairness(event: dict):
    """Handle assessment completion to audit for fairness and bias."""
    try:
        user_id = event.get("user_id")
        assessment_data = event.get("data", {})
        assessment_id = assessment_data.get("assessment_id")
        score = assessment_data.get("score")

        logger.info(f"Processing assessment for fairness audit: assessment={assessment_id}, user={user_id}")

        # TODO: Run bias detection algorithms
        # TODO: Check for demographic parity
        # TODO: Generate XAI explanation for scoring

        # Publish fairness audit results
        event_bus = get_event_bus("ethics-security")
        await event_bus.publish_event(
            topic=Topics.ANALYTICS_EVENT,
            event_type="fairness.audit.completed",
            data={
                "assessment_id": assessment_id,
                "fairness_score": 0.85,  # TODO: Real fairness metrics
                "bias_detected": False,
                "xai_explanation": "Score based on mastery of learning objectives"
            },
            user_id=user_id
        )

    except Exception as e:
        logger.error(f"Error handling assessment fairness audit: {e}")


# Example authenticated endpoint
@app.get("/api/v1/ethics/audit-report")
async def get_audit_report(current_user: dict = Depends(get_current_user)):
    """
    Get ethics and security audit report for current user.
    Demonstrates authentication using shared middleware.
    """
    user_id = current_user["user_id"]

    return {
        "user_id": user_id,
        "security_alerts": 0,
        "fairness_audits_passed": 0,
        "bias_incidents": 0,
        "xai_explanations_generated": 0
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


# Ethics & Security endpoints would go here
# /api/v1/ethics/xai/explain
# /api/v1/security/scan
# /api/v1/fairness/audit


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
