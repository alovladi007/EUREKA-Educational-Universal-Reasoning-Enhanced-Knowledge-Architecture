"""
Item-bank ORM (Phase 5 Session 5.1, 2026-05). See
eureka/ops/db/08_item_bank.sql for the canonical schema.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, CheckConstraint, Column, DateTime, Enum, ForeignKey, Index,
    Integer, Numeric, String, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID

from app.core.database import Base
from app.models.skill import BloomLevel, SkillFramework


class ItemKind(str, enum.Enum):
    MCQ_SINGLE = "mcq_single"
    MCQ_MULTI = "mcq_multi"
    SHORT_ANSWER = "short_answer"
    NUMERIC = "numeric"
    ESSAY = "essay"
    MATCHING = "matching"
    ORDERING = "ordering"
    CLOZE = "cloze"
    CASE = "case"


class ItemReviewStatus(str, enum.Enum):
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    FLAGGED = "flagged"
    RETIRED = "retired"


class ItemSourceKind(str, enum.Enum):
    IMPORTED = "imported"
    COMMISSIONED = "commissioned"
    AI_GENERATED = "ai_generated"
    COMMUNITY = "community"
    LICENSED = "licensed"


def _vals(e):
    return lambda obj: [m.value for m in obj]


class ItemBank(Base):
    __tablename__ = "item_banks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String(100), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    framework = Column(
        Enum(SkillFramework, name="skill_framework", values_callable=_vals(SkillFramework)),
        nullable=True,
    )
    tier = Column(String(40), nullable=True)
    default_license = Column(String(80), nullable=False, default="CC-BY-4.0")
    default_attribution = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bank_id = Column(UUID(as_uuid=True), ForeignKey("item_banks.id", ondelete="CASCADE"), nullable=False, index=True)
    family_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    kind = Column(Enum(ItemKind, name="item_kind", values_callable=_vals(ItemKind)), nullable=False)
    content = Column(JSONB, nullable=False)
    explanation = Column(Text, nullable=True)

    difficulty_nominal = Column(String(20), nullable=False, default="medium")
    irt_difficulty = Column(Numeric(5, 3), nullable=True)
    irt_discrimination = Column(Numeric(5, 3), nullable=True)
    irt_guessing = Column(Numeric(5, 3), nullable=True)
    irt_calibrated_at = Column(DateTime, nullable=True)
    attempts_count = Column(Integer, nullable=False, default=0)

    bloom_level = Column(
        Enum(BloomLevel, name="bloom_level", values_callable=_vals(BloomLevel)),
        nullable=True,
    )
    estimated_time_sec = Column(Integer, nullable=True)
    tags = Column(ARRAY(String), nullable=False, default=list)

    review_status = Column(
        Enum(ItemReviewStatus, name="item_review_status", values_callable=_vals(ItemReviewStatus)),
        nullable=False, default=ItemReviewStatus.DRAFT,
    )
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    review_notes = Column(Text, nullable=True)

    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)


class ItemVariant(Base):
    __tablename__ = "item_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    family_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    base_item_id = Column(UUID(as_uuid=True), ForeignKey("items.id"), nullable=False, index=True)
    generation_method = Column(String(40), nullable=False)
    generation_metadata = Column(JSONB, nullable=False, default=dict)
    crossgrader_agrees = Column(Boolean, nullable=True)
    crossgrader_score = Column(Numeric(3, 2), nullable=True)
    crossgrader_notes = Column(Text, nullable=True)
    crossgrader_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("item_id", name="uq_variant_per_item"),)


class ItemSource(Base):
    __tablename__ = "item_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False, unique=True)
    source_kind = Column(
        Enum(ItemSourceKind, name="item_source_kind", values_callable=_vals(ItemSourceKind)),
        nullable=False,
    )
    source_uri = Column(Text, nullable=True)
    source_name = Column(String(200), nullable=True)
    license = Column(String(80), nullable=False)
    attribution = Column(Text, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class ItemEmbedding(Base):
    """pgvector embedding per (item, model)."""

    __tablename__ = "item_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False, index=True)
    model = Column(String(80), nullable=False)
    # The pgvector column itself is managed in raw SQL — the embedding
    # is written via INSERT/UPDATE rather than ORM attribute access to
    # avoid depending on a Python pgvector binding for the ORM layer.
    text_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("item_id", "model", name="uq_item_model_embedding"),)


__all__ = [
    "ItemBank", "Item", "ItemVariant", "ItemSource", "ItemEmbedding",
    "ItemKind", "ItemReviewStatus", "ItemSourceKind",
]
