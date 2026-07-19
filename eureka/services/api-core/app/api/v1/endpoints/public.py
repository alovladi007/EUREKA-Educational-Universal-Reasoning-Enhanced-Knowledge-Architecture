"""
Public (no-auth) endpoints for the marketing site.

These power the logged-out landing page and the /explore catalogue, so a
visitor can see real numbers and browse real courses *before* signing in.
Everything here is read-only, unauthenticated, and returns only already-public
information (published courses + aggregate counts).
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.course import Course
from app.models.organization import Organization
from app.models.user import User

router = APIRouter()


@router.get("/public/stats")
async def public_stats(db: AsyncSession = Depends(get_db)) -> dict:
    """Live aggregate counts for the landing page. Real, not hardcoded."""
    learners = (
        await db.execute(select(func.count()).select_from(User).where(User.role == "student"))
    ).scalar() or 0
    courses = (
        await db.execute(select(func.count()).select_from(Course).where(Course.is_published.is_(True)))
    ).scalar() or 0
    institutions = (
        await db.execute(select(func.count()).select_from(Organization).where(Organization.is_active.is_(True)))
    ).scalar() or 0
    subjects = (
        await db.execute(
            select(func.count(distinct(Course.subject))).where(
                Course.is_published.is_(True), Course.subject.isnot(None)
            )
        )
    ).scalar() or 0
    return {
        "learners": int(learners),
        "courses": int(courses),
        "institutions": int(institutions),
        "subjects": int(subjects),
    }


def _course_card(c: Course) -> dict:
    return {
        "id": str(c.id),
        "title": c.title,
        "code": c.code,
        "subject": c.subject,
        "category": c.category,
        "level": c.level,
        "tier": c.tier,
        "description": (c.description or "")[:200],
        "thumbnail_url": c.thumbnail_url,
    }


@router.get("/public/courses")
async def public_courses(
    q: Optional[str] = Query(None, description="title/description search"),
    subject: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    limit: int = Query(24, ge=1, le=60),
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    """Browsable catalogue of PUBLISHED courses (safe to show logged out)."""
    stmt = (
        select(Course)
        .where(Course.is_published.is_(True))
        .order_by(Course.created_at.desc())
        .limit(limit)
    )
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(Course.title.ilike(like) | Course.description.ilike(like))
    if subject:
        stmt = stmt.where(Course.subject == subject)
    if level:
        stmt = stmt.where(Course.level == level)
    rows = list((await db.execute(stmt)).scalars().all())
    return [_course_card(c) for c in rows]


@router.get("/public/subjects")
async def public_subjects(db: AsyncSession = Depends(get_db)) -> list[dict]:
    """Distinct subjects across published courses, with a course count each."""
    rows = (
        await db.execute(
            select(Course.subject, func.count())
            .where(Course.is_published.is_(True), Course.subject.isnot(None))
            .group_by(Course.subject)
            .order_by(func.count().desc())
        )
    ).all()
    return [{"subject": s, "count": int(n)} for s, n in rows]
