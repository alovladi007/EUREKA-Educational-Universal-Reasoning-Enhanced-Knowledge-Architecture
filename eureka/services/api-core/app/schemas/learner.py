"""
Pydantic schemas for the learner spine (Phase 4 Session 4.1).
"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.learner import TierEnrollmentStatus, TierKind


# ---------------------------------------------------------------------------
# LearnerProfile
# ---------------------------------------------------------------------------


class LearnerProfileBase(BaseModel):
    display_name_preferred: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    primary_language: str = Field(default="en-US", max_length=20)
    additional_languages: list[str] = Field(default_factory=list)
    accessibility_needs: dict[str, Any] = Field(default_factory=dict)
    learning_preferences: dict[str, Any] = Field(default_factory=dict)
    goals: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)


class LearnerProfileUpdate(LearnerProfileBase):
    """All fields optional on update."""

    primary_language: str | None = Field(default=None, max_length=20)
    additional_languages: list[str] | None = None
    accessibility_needs: dict[str, Any] | None = None
    learning_preferences: dict[str, Any] | None = None
    goals: list[str] | None = None
    interests: list[str] | None = None


class LearnerProfileResponse(LearnerProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    knowledge_state: dict[str, Any]
    parental_consent_required: bool
    created_at: datetime
    updated_at: datetime | None = None


# ---------------------------------------------------------------------------
# TierEnrollment
# ---------------------------------------------------------------------------


class TierEnrollmentCreate(BaseModel):
    tier: TierKind
    tier_context: dict[str, Any] = Field(default_factory=dict)
    status: TierEnrollmentStatus = TierEnrollmentStatus.PENDING
    target_completion_at: datetime | None = None
    extra_metadata: dict[str, Any] = Field(default_factory=dict)


class TierEnrollmentUpdate(BaseModel):
    """Partial update — anything left None is untouched."""

    tier_context: dict[str, Any] | None = None
    status: TierEnrollmentStatus | None = None
    target_completion_at: datetime | None = None
    completed_at: datetime | None = None
    progress_pct: Decimal | None = Field(default=None, ge=0, le=100)
    extra_metadata: dict[str, Any] | None = None


class TierEnrollmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    tier: TierKind
    tier_context: dict[str, Any]
    status: TierEnrollmentStatus
    started_at: datetime | None = None
    target_completion_at: datetime | None = None
    completed_at: datetime | None = None
    last_activity_at: datetime | None = None
    progress_pct: Decimal
    extra_metadata: dict[str, Any]
    created_at: datetime
    updated_at: datetime | None = None
