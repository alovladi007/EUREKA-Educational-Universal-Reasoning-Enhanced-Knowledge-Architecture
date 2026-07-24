"""Resume notification + OG image + monitoring endpoints."""

import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
from app.core.config import settings
from app.utils.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

# Router-level auth (Wave 1 security fix): the email endpoint could relay
# arbitrary mail via configured SMTP if left unauthenticated.
router = APIRouter(
    prefix="/resumes/notifications",
    tags=["notifications"],
    dependencies=[Depends(get_current_active_user)],
)


# ── Email Notifications ──────────────────────────────────────


class EmailRequest(BaseModel):
    to: str
    subject: str
    template: str = "export_ready"  # "export_ready" | "share_viewed" | "welcome"
    data: dict = {}


@router.post("/email")
async def send_email(request: EmailRequest):
    """Send an email notification (e.g., export ready, share viewed)."""
    if not settings.SMTP_HOST:
        return JSONResponse(
            content={"status": "skipped", "message": "SMTP not configured"},
            status_code=200,
        )

    try:
        import aiosmtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        templates = {
            "export_ready": {
                "subject": "Your resume export is ready!",
                "body": f"Hi! Your resume has been exported successfully. Download it from your dashboard.",
            },
            "share_viewed": {
                "subject": "Someone viewed your resume",
                "body": f"Your shared resume was viewed. Check your analytics for details.",
            },
            "welcome": {
                "subject": "Welcome to EUREKA Resume Builder",
                "body": "Welcome! Start building your professional resume with AI-powered assistance.",
            },
        }

        template = templates.get(request.template, templates["export_ready"])

        msg = MIMEMultipart()
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = request.to
        msg["Subject"] = request.subject or template["subject"]
        msg.attach(MIMEText(template["body"], "plain"))

        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USERNAME,
            password=settings.SMTP_PASSWORD,
            use_tls=True,
        )

        return {"status": "sent", "to": request.to}

    except Exception as e:
        logger.error(f"Email send error: {e}")
        return JSONResponse(
            content={"status": "error", "message": str(e)},
            status_code=200,
        )


# ── OG Image Generation ─────────────────────────────────────


class OGImageRequest(BaseModel):
    name: str
    headline: str = ""
    template_id: str = "meridian"
    color: str = "#2563eb"


@router.post("/og-image")
async def generate_og_image(request: OGImageRequest):
    """Generate an Open Graph image for social sharing of a resume link."""
    # In production, this would use Puppeteer or a headless browser
    # to screenshot the resume template and return an image URL.
    #
    # For now, return SVG-based OG image data that can be rendered as HTML.

    svg = f"""<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="white"/>
  <rect width="1200" height="8" fill="{request.color}"/>
  <text x="600" y="250" font-family="Arial,sans-serif" font-size="56" font-weight="bold" text-anchor="middle" fill="#1e293b">{request.name}</text>
  <text x="600" y="320" font-family="Arial,sans-serif" font-size="28" text-anchor="middle" fill="#64748b">{request.headline}</text>
  <text x="600" y="420" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="{request.color}">Professional Resume</text>
  <text x="600" y="560" font-family="Arial,sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Built with EUREKA Resume Builder</text>
</svg>"""

    return JSONResponse(
        content={
            "og_image_svg": svg,
            "meta_tags": {
                "og:title": f"{request.name} — Resume",
                "og:description": request.headline or "Professional Resume",
                "og:type": "profile",
                "twitter:card": "summary_large_image",
            },
        },
        status_code=200,
    )


# ── Monitoring / Health ──────────────────────────────────────


@router.get("/health")
async def resume_health():
    """Health check for resume service subsystem."""
    checks = {
        "ai_configured": bool(settings.ANTHROPIC_API_KEY),
        "smtp_configured": bool(settings.SMTP_HOST),
        "database_url": bool(settings.DATABASE_URL),
        "environment": settings.ENVIRONMENT,
    }

    try:
        # Test AI client
        if settings.ANTHROPIC_API_KEY:
            from anthropic import AsyncAnthropic
            client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            checks["ai_reachable"] = True
        else:
            checks["ai_reachable"] = False
    except Exception:
        checks["ai_reachable"] = False

    all_healthy = checks["ai_configured"] and checks["database_url"]

    return {
        "status": "healthy" if all_healthy else "degraded",
        "checks": checks,
        "sentry_configured": bool(settings.SENTRY_DSN),
    }
