"""
Transcript endpoints (Phase 4 Session 4.3).

Mounted under /api/v1.

  POST   /achievements                  record a new achievement (admin/system)
  GET    /achievements/me                list current user's achievements
  POST   /transcript/me/issue            generate + sign a fresh transcript
  GET    /transcript/me                  most-recent current issuance
  GET    /transcript/{issuance_id}       fetch any past issuance (own or admin)
  GET    /transcript/{issuance_id}/verify  verify the Ed25519 signature

The verify endpoint is intentionally unauthenticated-friendly: a future
public-facing endpoint can be added that takes a raw payload + signature
and validates without DB lookup.
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.transcript import LearnerAchievement, TranscriptIssuance
from app.models.user import User
from app.schemas.transcript import (
    AchievementCreate,
    AchievementResponse,
    TranscriptIssuanceResponse,
    TranscriptVerifyResponse,
)
from app.services.transcript import issue_transcript, verify_issuance
from app.utils.dependencies import get_current_user


router = APIRouter()


@router.post(
    "/achievements",
    response_model=AchievementResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_achievement(
    payload: AchievementCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LearnerAchievement:
    """
    Record an achievement for the current user. Tutor/assess services
    will call this for skill_mastered / assessment_passed events
    (Phase 6/7). Admins can backfill historical achievements.
    """
    ach = LearnerAchievement(
        user_id=current_user.id,
        kind=payload.kind,
        subject_id=payload.subject_id,
        title=payload.title,
        description=payload.description,
        extra_metadata=payload.extra_metadata,
        earned_at=payload.earned_at or __import__("datetime").datetime.utcnow(),
        expires_at=payload.expires_at,
    )
    db.add(ach)
    await db.commit()
    await db.refresh(ach)
    return ach


@router.get("/achievements/me", response_model=list[AchievementResponse])
async def list_my_achievements(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[LearnerAchievement]:
    r = await db.execute(
        select(LearnerAchievement)
        .where(
            LearnerAchievement.user_id == current_user.id,
            LearnerAchievement.revoked_at.is_(None),
        )
        .order_by(LearnerAchievement.earned_at.desc())
        .limit(500)
    )
    return list(r.scalars().all())


@router.post(
    "/transcript/me/issue",
    response_model=TranscriptIssuanceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def issue_my_transcript(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TranscriptIssuance:
    """Generate + sign a fresh Open Badges 3.0 JSON-LD transcript."""
    return await issue_transcript(db, current_user)


@router.get("/transcript/me", response_model=TranscriptIssuanceResponse)
async def get_my_current_transcript(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TranscriptIssuance:
    r = await db.execute(
        select(TranscriptIssuance)
        .where(
            TranscriptIssuance.user_id == current_user.id,
            TranscriptIssuance.superseded_at.is_(None),
        )
        .order_by(TranscriptIssuance.issued_at.desc())
        .limit(1)
    )
    issuance = r.scalar_one_or_none()
    if issuance is None:
        # Lazy-issue on first access so demo users always have one.
        return await issue_transcript(db, current_user)
    return issuance


@router.get("/transcript/{issuance_id}", response_model=TranscriptIssuanceResponse)
async def get_transcript_by_id(
    issuance_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TranscriptIssuance:
    issuance = await db.get(TranscriptIssuance, issuance_id)
    if issuance is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    # Own-or-admin
    if str(issuance.user_id) != str(current_user.id) and current_user.role not in (
        "org_admin", "super_admin",
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return issuance


@router.get(
    "/transcript/{issuance_id}/verify",
    response_model=TranscriptVerifyResponse,
    summary="Verify the Ed25519 signature on a stored transcript issuance.",
)
async def verify_transcript(
    issuance_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> dict:
    issuance = await db.get(TranscriptIssuance, issuance_id)
    if issuance is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return await verify_issuance(db, issuance)
