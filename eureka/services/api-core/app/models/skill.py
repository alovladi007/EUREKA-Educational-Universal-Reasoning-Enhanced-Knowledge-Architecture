"""
Skill-graph ORM (Phase 4 Session 4.2, 2026-05).

Four tables — see eureka/ops/db/06_skill_graph.sql for the canonical
shape.

    Skill                  Nodes. (framework, code) is the natural key.
    SkillPrerequisite      Directed DAG edge between two skills.
    ContentSkill           Many-to-many tag from any content artifact
                           to a skill, with coverage strength + Bloom.
    LearnerSkillMastery    Per-(learner, skill) state. The authoritative
                           copy lives in learner_profiles.knowledge_state
                           JSONB; this table is the analytic projection.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class SkillFramework(str, enum.Enum):
    CCSS = "ccss"
    NGSS = "ngss"
    AP = "ap"
    ABET = "abet"
    ACM_IEEE = "acm_ieee"
    USMLE = "usmle"
    MCAT = "mcat"
    MBE = "mbe"
    CPA = "cpa"
    GRE = "gre"
    LSAT = "lsat"
    FE_PE = "fe_pe"
    MBA_CORE = "mba_core"
    EUREKA_CUSTOM = "eureka_custom"


class BloomLevel(str, enum.Enum):
    REMEMBER = "remember"
    UNDERSTAND = "understand"
    APPLY = "apply"
    ANALYZE = "analyze"
    EVALUATE = "evaluate"
    CREATE = "create"


class ContentKind(str, enum.Enum):
    COURSE = "course"
    COURSE_MODULE = "course_module"
    ASSESSMENT = "assessment"
    QUESTION = "question"
    CONTENT_ITEM = "content_item"
    EXTERNAL_URL = "external_url"


def _values(e):
    """Helper: make SQLAlchemy use the enum value strings, not the names."""
    return lambda obj: [m.value for m in obj]


class Skill(Base):
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    framework = Column(
        Enum(SkillFramework, name="skill_framework", values_callable=_values(SkillFramework)),
        nullable=False,
        index=True,
    )
    code = Column(String(120), nullable=False)
    name = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    tier = Column(String(40), nullable=False, index=True)
    bloom_level = Column(
        Enum(BloomLevel, name="bloom_level", values_callable=_values(BloomLevel)),
        nullable=True,
    )
    parent_id = Column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    depth = Column(Integer, nullable=False, default=0)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    is_active = Column(Boolean, nullable=False, default=True)
    deprecated_at = Column(DateTime, nullable=True)
    superseded_by_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    parent = relationship("Skill", remote_side=[id], foreign_keys=[parent_id], backref="children")

    __table_args__ = (
        UniqueConstraint("framework", "code", name="uq_skills_framework_code"),
    )


class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    successor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    prerequisite_id = Column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    strength = Column(Numeric(3, 2), nullable=False, default=1.0)
    rationale = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    successor = relationship("Skill", foreign_keys=[successor_id])
    prerequisite = relationship("Skill", foreign_keys=[prerequisite_id])

    __table_args__ = (
        CheckConstraint("strength >= 0 AND strength <= 1", name="strength_in_range"),
        CheckConstraint("successor_id <> prerequisite_id", name="no_self_prereq"),
        UniqueConstraint("successor_id", "prerequisite_id", name="uq_skill_prereq"),
    )


class ContentSkill(Base):
    __tablename__ = "content_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_id = Column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    content_kind = Column(
        Enum(ContentKind, name="content_kind", values_callable=_values(ContentKind)),
        nullable=False,
    )
    content_id = Column(UUID(as_uuid=True), nullable=False)
    coverage = Column(Numeric(3, 2), nullable=False, default=1.0)
    bloom_level = Column(
        Enum(BloomLevel, name="bloom_level", values_callable=_values(BloomLevel)),
        nullable=True,
    )
    tagged_by = Column(String(40), nullable=False, default="system")
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint("coverage >= 0 AND coverage <= 1", name="coverage_in_range"),
        UniqueConstraint(
            "content_kind", "content_id", "skill_id", name="uq_content_skill"
        ),
        Index("idx_content_skills_content", "content_kind", "content_id"),
    )


class LearnerSkillMastery(Base):
    __tablename__ = "learner_skill_mastery"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    skill_id = Column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    mastery = Column(Numeric(4, 3), nullable=False, default=0)
    attempts = Column(Integer, nullable=False, default=0)
    last_practiced_at = Column(DateTime, nullable=True)
    next_review_at = Column(DateTime, nullable=True)
    measured_at_bloom = Column(
        Enum(BloomLevel, name="bloom_level", values_callable=_values(BloomLevel)),
        nullable=True,
    )
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    skill = relationship("Skill")

    __table_args__ = (
        CheckConstraint("mastery >= 0 AND mastery <= 1", name="mastery_in_range"),
        UniqueConstraint("user_id", "skill_id", name="uq_learner_skill"),
    )


__all__ = [
    "Skill",
    "SkillPrerequisite",
    "ContentSkill",
    "LearnerSkillMastery",
    "SkillFramework",
    "BloomLevel",
    "ContentKind",
]
