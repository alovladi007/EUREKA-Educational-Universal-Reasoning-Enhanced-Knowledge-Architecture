"""Pydantic for item bank (Session 5.1)."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.item_bank import ItemKind, ItemReviewStatus, ItemSourceKind
from app.models.skill import BloomLevel, SkillFramework


class BankCreate(BaseModel):
    slug: str = Field(min_length=2, max_length=100, pattern=r"^[a-z0-9-]+$")
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None
    framework: SkillFramework | None = None
    tier: str | None = None
    default_license: str = "CC-BY-4.0"
    default_attribution: str | None = None


class BankResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    slug: str
    name: str
    description: str | None
    framework: SkillFramework | None
    tier: str | None
    default_license: str
    default_attribution: str | None
    is_active: bool
    extra_metadata: dict[str, Any]
    created_at: datetime


class SourceInfo(BaseModel):
    source_kind: ItemSourceKind = ItemSourceKind.IMPORTED
    source_uri: str | None = None
    source_name: str | None = None
    license: str = "CC-BY-4.0"
    attribution: str | None = None


class ItemCreate(BaseModel):
    bank_id: UUID
    kind: ItemKind = ItemKind.MCQ_SINGLE
    content: dict[str, Any]
    explanation: str | None = None
    difficulty_nominal: str = Field(default="medium", pattern=r"^(easy|medium|hard|expert)$")
    bloom_level: BloomLevel | None = None
    estimated_time_sec: int | None = Field(default=None, ge=1, le=3600)
    tags: list[str] = Field(default_factory=list)
    skill_ids: list[UUID] = Field(default_factory=list, description="Skills to tag this item with")
    source: SourceInfo | None = None
    review_status: ItemReviewStatus = ItemReviewStatus.DRAFT


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    bank_id: UUID
    family_id: UUID
    kind: ItemKind
    content: dict[str, Any]
    explanation: str | None
    difficulty_nominal: str
    irt_difficulty: Decimal | None
    irt_discrimination: Decimal | None
    bloom_level: BloomLevel | None
    estimated_time_sec: int | None
    tags: list[str]
    review_status: ItemReviewStatus
    attempts_count: int
    created_at: datetime


class VariantGenerateRequest(BaseModel):
    base_item_id: UUID
    count: int = Field(default=3, ge=1, le=10)
    target_difficulty: str | None = Field(default=None, pattern=r"^(easy|medium|hard|expert)$")
    # Whether to also run the cross-grader pass. Costs an extra LLM call
    # per variant; off by default for cheap iteration.
    run_crossgrader: bool = False
    # If set, variants are marked DRAFT and go to the SME queue; if false,
    # they're auto-approved (only safe when the underlying model is trusted
    # AND the cross-grader passed).
    sme_review_required: bool = True


class VariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    family_id: UUID
    item_id: UUID
    base_item_id: UUID
    generation_method: str
    generation_metadata: dict[str, Any]
    crossgrader_agrees: bool | None
    crossgrader_score: Decimal | None
    crossgrader_notes: str | None
    crossgrader_at: datetime | None


class SearchHit(BaseModel):
    item: ItemResponse
    score: float
    # Per-channel debug: contribution from keyword search vs semantic vs
    # skill-tag boost. Helps tune the fusion weights.
    keyword_rank: int | None = None
    semantic_rank: int | None = None
    skill_boost: float = 0.0
