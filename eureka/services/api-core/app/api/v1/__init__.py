"""
API v1 Router

Aggregates all v1 API endpoints.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, mfa, learner, skill, transcript, recommend, item_bank, agent, exam, institutional, marketplace, gtm, engagement, integrations, ops, workforce, graduate, research, user_content, community, users, organizations, courses, resumes, resume_ai, resume_exports, resume_import, resume_billing, resume_notifications, user_progress, patent_bar

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
async def get_admin_statistics():
    """Get admin statistics"""
    return {
        "statistics": {
            "total_users": 15234,
            "active_users": 8532,
            "total_courses": 456,
            "system_uptime": 99.98
        },
        "tier_stats": [
            {"name": "High School", "users": 4521, "courses": 120, "status": "operational"},
            {"name": "Undergraduate", "users": 6789, "courses": 245, "status": "operational"},
            {"name": "Graduate", "users": 2134, "courses": 89, "status": "operational"},
            {"name": "Medical", "users": 1790, "courses": 102, "status": "operational"},
        ]
    }
