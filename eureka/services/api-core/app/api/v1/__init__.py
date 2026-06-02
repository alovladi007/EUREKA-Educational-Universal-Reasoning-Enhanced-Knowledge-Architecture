"""
API v1 Router

Aggregates all v1 API endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User, Course, Organization
from app.utils.dependencies import require_admin

from app.api.v1.endpoints import auth, mfa, learner, skill, transcript, recommend, item_bank, agent, exam, institutional, marketplace, gtm, engagement, integrations, ops, workforce, graduate, research, user_content, community, users, organizations, courses, resumes, resume_ai, resume_exports, resume_import, resume_billing, resume_notifications, user_progress, patent_bar, srs

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(mfa.router, prefix="/auth/mfa", tags=["mfa"])
api_router.include_router(learner.router, tags=["learner-spine"])
api_router.include_router(skill.router, tags=["skill-graph"])
api_router.include_router(transcript.router, tags=["transcript"])
api_router.include_router(recommend.router, tags=["recommendations"])
api_router.include_router(item_bank.router, tags=["item-bank"])
api_router.include_router(agent.router, tags=["agent"])
api_router.include_router(exam.router, tags=["exam-analytics"])
api_router.include_router(institutional.router, tags=["institutional"])
api_router.include_router(marketplace.router, tags=["marketplace"])
api_router.include_router(gtm.router, tags=["gtm"])
api_router.include_router(engagement.router, tags=["engagement"])
api_router.include_router(integrations.router, tags=["integrations"])
api_router.include_router(ops.router, tags=["ops"])
api_router.include_router(workforce.router, tags=["workforce"])
api_router.include_router(graduate.router, tags=["graduate"])
api_router.include_router(research.router, tags=["research"])
api_router.include_router(user_content.router, tags=["dashboard"])
api_router.include_router(community.router, tags=["community"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(resumes.router, tags=["resumes"])
api_router.include_router(resume_ai.router, tags=["resume-ai"])
api_router.include_router(resume_exports.router, tags=["resume-exports"])
api_router.include_router(resume_import.router, tags=["resume-import"])
api_router.include_router(resume_billing.router, tags=["billing"])
api_router.include_router(resume_notifications.router, tags=["notifications"])
api_router.include_router(user_progress.router, tags=["progress"])
api_router.include_router(patent_bar.router, tags=["patent-bar-analytics"])
api_router.include_router(srs.router, tags=["srs"])

@api_router.get("/")
async def api_root():
    """API v1 root endpoint"""
    return {
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/v1/auth",
            "users": "/api/v1/users",
            "organizations": "/api/v1/organizations",
            "courses": "/api/v1/courses",
            "resumes": "/api/v1/resumes",
            "resume_ai": "/api/v1/resumes/ai",
            "exports": "/api/v1/exports",
        },
        "docs": "/docs",
        "health": "/health"
    }


@api_router.get("/admin/statistics", tags=["admin"])
async def get_admin_statistics(
    current_user=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin statistics — REAL DB counts (P3 mock→real).

    Previously returned a hardcoded ``15234 total_users`` fixture AND was
    unauthenticated. Now it (a) requires an admin role and (b) computes
    live counts: total/active users, total courses, and a per-tier
    breakdown via organizations.tier. The admin dashboard
    (apps/web .../dashboard/admin/page.tsx) consumes this shape.

    ``system_uptime`` is the one field with no DB source (it needs an
    uptime-monitoring backend, which doesn't exist yet) — reported as a
    static SLA target and labeled as such rather than a fake metric.
    """
    # Headline counts.
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    active_users = (
        await db.execute(select(func.count(User.id)).where(User.is_active.is_(True)))
    ).scalar_one()
    total_courses = (await db.execute(select(func.count(Course.id)))).scalar_one()

    # Per-tier breakdown: users and published courses grouped by the
    # owning organization's tier.
    users_by_tier = dict(
        (await db.execute(
            select(Organization.tier, func.count(User.id))
            .join(User, User.org_id == Organization.id)
            .group_by(Organization.tier)
        )).all()
    )
    courses_by_tier = dict(
        (await db.execute(
            select(Organization.tier, func.count(Course.id))
            .join(Course, Course.org_id == Organization.id)
            .group_by(Organization.tier)
        )).all()
    )

    # Render every known tier (so the dashboard shows all rows even at 0).
    _TIER_LABELS = {
        "high_school": "High School",
        "undergraduate": "Undergraduate",
        "graduate": "Graduate",
        "professional_medical": "Medical",
        "professional_law": "Law",
        "professional_mba": "MBA",
        "professional_engineering": "Engineering",
    }
    tier_stats = [
        {
            "name": label,
            "users": int(users_by_tier.get(tier_key, 0)),
            "courses": int(courses_by_tier.get(tier_key, 0)),
            "status": "operational",
        }
        for tier_key, label in _TIER_LABELS.items()
    ]

    return {
        "statistics": {
            "total_users": int(total_users),
            "active_users": int(active_users),
            "total_courses": int(total_courses),
            # No uptime-monitoring backend yet — static SLA target, labeled.
            "system_uptime": 99.9,
            "system_uptime_note": "SLA target (no uptime-monitoring backend wired)",
        },
        "tier_stats": tier_stats,
    }
