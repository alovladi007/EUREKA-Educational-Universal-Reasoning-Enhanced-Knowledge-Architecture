"""
Pydantic schemas for the skill graph (Phase 4 Session 4.2).
"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.skill import BloomLevel, ContentKind, SkillFramework


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    framework: SkillFramework
    code: str
    name: str
    description: str | None = None
    tier: str
    bloom_level: BloomLevel | None = None
    parent_id: UUID | None = None
    depth: int
    is_active: bool
    extra_metadata: dict[str, Any]
    created_at: datetime


class SkillWithRelations(SkillResponse):
    """A skill plus its immediate parent / children / prerequisites."""

    children: list[SkillResponse] = Field(default_factory=list)
    prerequisites: list["PrereqEdge"] = Field(default_factory=list)
    used_by: list["PrereqEdge"] = Field(default_factory=list)


class PrereqEdge(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill: SkillResponse
    strength: Decimal
    rationale: str | None = None


# Resolve forward refs
SkillWithRelations.model_rebuild()


class ContentTagRequest(BaseModel):
    skill_id: UUID
    content_kind: ContentKind
    content_id: UUID
    coverage: Decimal = Field(default=Decimal("1.0"), ge=0, le=1)
    bloom_level: BloomLevel | None = None
    tagged_by: str = Field(default="system", max_length=40)


class ContentTagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    skill_id: UUID
    content_kind: ContentKind
    content_id: UUID
    coverage: Decimal
    bloom_level: BloomLevel | None = None
    tagged_by: str
    created_at: datetime


class MasteryWriteRequest(BaseModel):
    """Used by tutor / assess services (Phase 6) to bump mastery."""

    skill_id: UUID
    mastery: Decimal = Field(ge=0, le=1)
    attempts_delta: int = Field(default=1, ge=0)
    measured_at_bloom: BloomLevel | None = None
    next_review_at: datetime | None = None


class MasteryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    skill_id: UUID
    mastery: Decimal
    attempts: int
    last_practiced_at: datetime | None = None
    next_review_at: datetime | None = None
    measured_at_bloom: BloomLevel | None = None
    updated_at: datetime | None = None
