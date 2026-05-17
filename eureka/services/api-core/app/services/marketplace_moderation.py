"""
Phase 10.5 — trust & safety: triage queue + action runner.

A `content_reports` row is created by any authenticated learner via /reports.
Admins/moderators see the open queue, claim, and execute an action.

Action semantics:
  unlist             → listing.status = unlisted; course remains accessible to
                       existing buyers but disappears from /marketplace.
  takedown           → listing.status = unlisted AND course.is_active = FALSE
                       AND course.is_published = FALSE.
  shadow_ban         → listing.rank_score forced to a large negative; remains
                       technically published, but never surfaces in ranked feeds.
  redact             → review.flagged = TRUE.
  notify_creator     → record-only; outbound email lives elsewhere.
  restore            → undo prior unlist/takedown/shadow_ban.
  suspend_instructor → instructor_profiles.status = suspended.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.marketplace import (
    ContentReport,
    CourseListing,
    CourseReview,
    InstructorProfile,
    InstructorStatus,
    ListingStatus,
    ModerationAction,
    ModerationActionKind,
    ReportStatus,
)


async def execute_action(
    db: AsyncSession,
    *,
    report: ContentReport,
    actor_id: UUID,
    action: str,
    rationale: Optional[str] = None,
    extra: Optional[dict] = None,
) -> ModerationAction:
    """Apply an action against the report's target and emit a moderation_actions row."""
    if action not in {k.value for k in ModerationActionKind}:
        raise ValueError(f"unknown action: {action}")

    if action == ModerationActionKind.unlist.value or action == ModerationActionKind.takedown.value:
        if report.target_type == "course":
            await _course_action(db, course_id=report.target_id, takedown=(action == ModerationActionKind.takedown.value))
    elif action == ModerationActionKind.shadow_ban.value and report.target_type == "course":
        listing = await _listing_for_course(db, report.target_id)
        if listing is not None:
            listing.rank_score = -999.0
    elif action == ModerationActionKind.redact.value and report.target_type == "review":
        await db.execute(update(CourseReview).where(CourseReview.id == report.target_id).values(flagged=True))
    elif action == ModerationActionKind.restore.value:
        if report.target_type == "course":
            listing = await _listing_for_course(db, report.target_id)
            if listing is not None and listing.status == ListingStatus.unlisted.value:
                listing.status = ListingStatus.published.value
                listing.rank_score = 0
        elif report.target_type == "review":
            await db.execute(update(CourseReview).where(CourseReview.id == report.target_id).values(flagged=False))
    elif action == ModerationActionKind.suspend_instructor.value and report.target_type == "instructor":
        await db.execute(
            update(InstructorProfile).where(InstructorProfile.id == report.target_id)
            .values(status=InstructorStatus.suspended.value)
        )
    # notify_creator is record-only.

    ma = ModerationAction(
        report_id=report.id, actor_id=actor_id,
        target_type=report.target_type, target_id=report.target_id,
        action=action, rationale=rationale, extra=extra or {},
    )
    db.add(ma)

    report.status = ReportStatus.actioned.value
    report.resolved_at = datetime.now(timezone.utc)
    if rationale:
        report.resolution_note = rationale
    report.assigned_to = actor_id

    await db.commit()
    await db.refresh(ma)
    return ma


async def _listing_for_course(db: AsyncSession, course_id: UUID) -> Optional[CourseListing]:
    q = await db.execute(select(CourseListing).where(CourseListing.course_id == course_id))
    return q.scalar_one_or_none()


async def _course_action(db: AsyncSession, *, course_id: UUID, takedown: bool) -> None:
    listing = await _listing_for_course(db, course_id)
    if listing is not None:
        listing.status = ListingStatus.unlisted.value
    if takedown:
        await db.execute(
            update(Course).where(Course.id == course_id).values(is_active=False, is_published=False)
        )
