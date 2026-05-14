"""
Learner-spine endpoints (Phase 4 Session 4.1).

Mounted under /api/v1.

Profile endpoints
  GET    /learner-profile/me                 — current user's profile
  PATCH  /learner-profile/me                 — partial update
  GET    /learner-profile/{user_id}          — org-admin lookup of another user

Enrollment endpoints (one or many tiers per user)
  GET    /tier-enrollments/me                — list current user's enrollments
  POST   /tier-enrollments/me                — create a new enrollment for self
  GET    /tier-enrollments/me/{enrollment_id}
  PATCH  /tier-enrollments/me/{enrollment_id}— update status / progress / context
  DELETE /tier-enrollments/me/{enrollment_id}— soft delete (sets deleted_at)

Auth
  All routes require an authenticated user. Cross-user reads (the {user_id}
  variant) are gated to org_admin / super_admin within the same org. The
  tenancy middleware injects user_id + org_id; cross-org reads return 404.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.learner import (
    LearnerProfile,
    TierEnrollment,
    TierEnrollmentStatus,
)
from app.models.user import User
from app.schemas.learner import (
    LearnerProfileResponse,
    LearnerProfileUpdate,
    TierEnrollmentCreate,
    TierEnrollmentResponse,
    TierEnrollmentUpdate,
)
from app.utils.dependencies import get_current_user


router = APIRouter()


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


async def _get_or_create_profile(db: AsyncSession, user: User) -> LearnerProfile:
    """
    Every user gets a learner_profile on first access. The migration in
    eureka/ops/db/05_learner_spine.sql backfills existing users but new
    users created via /auth/register need the lazy create on first read.
    """
    result = await db.execute(
        select(LearnerProfile).where(LearnerProfile.user_id == user.id)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        profile = LearnerProfile(
            user_id=user.id,
            primary_language=user.locale or "en-US",
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile


def _ensure_same_org(actor: User, target_org_id) -> None:
    """Cross-tenant check. Raises 404 if a non-admin tries to look elsewhere."""
    if str(actor.org_id) != str(target_org_id) and actor.role not in (
        "org_admin",
        "super_admin",
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


# ---------------------------------------------------------------------------
# Learner profile
# ---------------------------------------------------------------------------


@router.get("/learner-profile/me", response_model=LearnerProfileResponse)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LearnerProfile:
    return await _get_or_create_profile(db, current_user)


@router.patch("/learner-profile/me", response_model=LearnerProfileResponse)
async def update_my_profile(
    payload: LearnerProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LearnerProfile:
    profile = await _get_or_create_profile(db, current_user)
    # exclude_unset → partial update semantics; None for an absent field
    # is taken to mean "don't touch".
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    await db.commit()
    await db.refresh(profile)
    return profile


@router.get(
    "/learner-profile/{user_id}",
    response_model=LearnerProfileResponse,
    summary="Admin: read another user's learner profile (same org only)",
)
async def get_user_profile(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LearnerProfile:
    target_user = await db.get(User, user_id)
    if target_user is None or target_user.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    _ensure_same_org(current_user, target_user.org_id)
    return await _get_or_create_profile(db, target_user)


# ---------------------------------------------------------------------------
# Tier enrollments
# ---------------------------------------------------------------------------


@router.get("/tier-enrollments/me", response_model=list[TierEnrollmentResponse])
async def list_my_enrollments(
    include_archived: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TierEnrollment]:
    """
    Return every tier_enrollment for the current user. Excludes archived
    by default (so the dashboard doesn't surface stale enrolments) — pass
    `?include_archived=true` to get historical ones for transcript views.
    """
    stmt = select(TierEnrollment).where(
        TierEnrollment.user_id == current_user.id,
        TierEnrollment.deleted_at.is_(None),
    )
    if not include_archived:
        stmt = stmt.where(
            TierEnrollment.status != TierEnrollmentStatus.ARCHIVED
        )
    stmt = stmt.order_by(TierEnrollment.created_at.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post(
    "/tier-enrollments/me",
    response_model=TierEnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_my_enrollment(
    payload: TierEnrollmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TierEnrollment:
    """
    Create a new tier enrollment for self. The unique partial index in
    SQL prevents duplicate (active) enrolments for the same (tier, exam),
    so this can 409 from the DB layer — we surface that as a clean error.
    """
    enrollment = TierEnrollment(
        user_id=current_user.id,
        tier=payload.tier,
        tier_context=payload.tier_context,
        status=payload.status,
        target_completion_at=payload.target_completion_at,
        extra_metadata=payload.extra_metadata,
        started_at=datetime.utcnow()
        if payload.status == TierEnrollmentStatus.ACTIVE
        else None,
    )
    db.add(enrollment)
    try:
        await db.commit()
    except Exception as exc:  # noqa: BLE001
        await db.rollback()
        msg = str(exc).lower()
        if "uq_tier_enrollments_active_per_target" in msg or "duplicate key" in msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    "You already have an active enrolment for this tier "
                    "and exam context. Pause or withdraw the existing one first."
                ),
            ) from exc
        raise
    await db.refresh(enrollment)
    return enrollment


@router.get(
    "/tier-enrollments/me/{enrollment_id}",
    response_model=TierEnrollmentResponse,
)
async def get_my_enrollment(
    enrollment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TierEnrollment:
    result = await db.execute(
        select(TierEnrollment).where(
            and_(
                TierEnrollment.id == enrollment_id,
                TierEnrollment.user_id == current_user.id,
                TierEnrollment.deleted_at.is_(None),
            )
        )
    )
    enrollment = result.scalar_one_or_none()
    if enrollment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return enrollment


@router.patch(
    "/tier-enrollments/me/{enrollment_id}",
    response_model=TierEnrollmentResponse,
)
async def update_my_enrollment(
    enrollment_id: UUID,
    payload: TierEnrollmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TierEnrollment:
    enrollment = await get_my_enrollment(enrollment_id, db, current_user)
    updates = payload.model_dump(exclude_unset=True, by_alias=False)
    # If the caller moves the status to ACTIVE for the first time, stamp
    # started_at. If they mark it completed, stamp completed_at.
    if "status" in updates:
        new_status = updates["status"]
        if (
            new_status == TierEnrollmentStatus.ACTIVE
            and enrollment.started_at is None
        ):
            enrollment.started_at = datetime.utcnow()
        if new_status == TierEnrollmentStatus.COMPLETED:
            enrollment.completed_at = enrollment.completed_at or datetime.utcnow()

    for key, value in updates.items():
        setattr(enrollment, key, value)
    enrollment.last_activity_at = datetime.utcnow()
    await db.commit()
    await db.refresh(enrollment)
    return enrollment


@router.delete(
    "/tier-enrollments/me/{enrollment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def soft_delete_my_enrollment(
    enrollment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from fastapi import Response

    enrollment = await get_my_enrollment(enrollment_id, db, current_user)
    enrollment.deleted_at = datetime.utcnow()
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
