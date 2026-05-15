"""
Transcript ORM (Phase 4 Session 4.3, 2026-05). See
eureka/ops/db/07_transcript.sql for the canonical schema.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.core.database import Base


class AchievementKind(str, enum.Enum):
    COURSE_COMPLETED = "course_completed"
    MODULE_COMPLETED = "module_completed"
    ASSESSMENT_PASSED = "assessment_passed"
    SKILL_MASTERED = "skill_mastered"
    TIER_COMPLETED = "tier_completed"
    EXAM_PASSED = "exam_passed"
    BADGE_EARNED = "badge_earned"
    CAPSTONE_COMPLETED = "capstone_completed"


def _values(e):
    return lambda obj: [m.value for m in obj]


class LearnerAchievement(Base):
    __tablename__ = "learner_achievements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    kind = Column(
        Enum(AchievementKind, name="achievement_kind", values_callable=_values(AchievementKind)),
        nullable=False, index=True,
    )
    subject_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    earned_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    recorded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)
    revocation_reason = Column(Text, nullable=True)
    issued_by_service = Column(String(60), nullable=False, default="api-core")


class TranscriptIssuerKey(Base):
    __tablename__ = "transcript_issuer_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key_id = Column(String(120), nullable=False, unique=True)
    public_key_b64 = Column(Text, nullable=False)
    algorithm = Column(String(40), nullable=False, default="Ed25519")
    issuer_uri = Column(String(500), nullable=False,
        default="https://eureka.example.com/issuers/default")
    issuer_name = Column(String(200), nullable=False, default="EUREKA Platform")
    is_active = Column(Boolean, nullable=False, default=True)
    rotated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class TranscriptIssuance(Base):
    __tablename__ = "transcript_issuances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    payload = Column(JSONB, nullable=False)
    signature_b64 = Column(Text, nullable=False)
    key_id = Column(String(120), ForeignKey("transcript_issuer_keys.key_id"), nullable=False)
    issuance_uri = Column(String(500), nullable=True)
    achievements_count = Column(Integer, nullable=False, default=0)
    tiers_count = Column(Integer, nullable=False, default=0)
    skills_mastered_count = Column(Integer, nullable=False, default=0)
    issued_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    superseded_at = Column(DateTime, nullable=True)
    superseded_by_id = Column(UUID(as_uuid=True), ForeignKey("transcript_issuances.id"), nullable=True)


__all__ = ["LearnerAchievement", "TranscriptIssuerKey", "TranscriptIssuance", "AchievementKind"]
