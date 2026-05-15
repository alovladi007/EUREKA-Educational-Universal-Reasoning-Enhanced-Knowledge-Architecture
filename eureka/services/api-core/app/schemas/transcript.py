"""Pydantic schemas for the transcript service (Session 4.3)."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.transcript import AchievementKind


class AchievementCreate(BaseModel):
    kind: AchievementKind
    title: str = Field(min_length=1, max_length=300)
    description: str | None = None
    subject_id: UUID | None = None
    extra_metadata: dict[str, Any] = Field(default_factory=dict)
    earned_at: datetime | None = None
    expires_at: datetime | None = None


class AchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    kind: AchievementKind
    title: str
    description: str | None = None
    subject_id: UUID | None = None
    extra_metadata: dict[str, Any]
    earned_at: datetime
    expires_at: datetime | None = None
    revoked_at: datetime | None = None
    issued_by_service: str


class TranscriptIssuanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    payload: dict[str, Any]
    signature_b64: str
    key_id: str
    achievements_count: int
    tiers_count: int
    skills_mastered_count: int
    issued_at: datetime


class TranscriptVerifyResponse(BaseModel):
    verified: bool
    key_id: str | None = None
    issuer: str | None = None
    algorithm: str | None = None
    issued_at: str | None = None
    reason: str | None = None
