"""
Learner-spine ORM (Phase 4 Session 4.1, 2026-05).

Two tables here:

  LearnerProfile     1:1 with User. Carries everything that's about the
                     LEARNER (preferences, accessibility, languages, goals,
                     the skill-graph mastery snapshot). One row per user.

  TierEnrollment     N per User. One row per (user, tier, optional exam).
                     The structural move that lets EUREKA span HS → Pro
                     under a single identity — see docs/ROADMAP.md Phase 4.

The User model itself stays as the auth/account root; learner data lives
adjacent so we can deprecate columns from User without touching auth.
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
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class TierKind(str, enum.Enum):
    HIGH_SCHOOL = "high_school"
    UNDERGRADUATE = "undergraduate"
    GRADUATE = "graduate"
    MEDICAL = "medical"
    LAW = "law"
    MBA = "mba"
    ENGINEERING = "engineering"
    TEST_PREP = "test_prep"
    CONTINUING_EDUCATION = "continuing_education"


class TierEnrollmentStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    WITHDRAWN = "withdrawn"
    ARCHIVED = "archived"


class LearnerProfile(Base):
    """1:1 with User. The learner-shaped view of a person."""

    __tablename__ = "learner_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Display / identity overrides scoped to learner context
    display_name_preferred = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)

    # Languages (BCP-47)
    primary_language = Column(String(20), nullable=False, default="en-US")
    additional_languages = Column(ARRAY(String), nullable=False, default=list)

    # Accessibility / learning preferences / goals / interests
    accessibility_needs = Column(JSONB, nullable=False, default=dict)
    learning_preferences = Column(JSONB, nullable=False, default=dict)
    goals = Column(ARRAY(String), nullable=False, default=list)
    interests = Column(ARRAY(String), nullable=False, default=list)

    # Skill-graph snapshot — Phase 4.2 + Phase 6 maintain this.
    # Shape: {skill_id: {mastery: 0..1, last_practiced: iso8601, attempts: int, decay_at: iso8601}}
    knowledge_state = Column(JSONB, nullable=False, default=dict)

    # COPPA / FERPA
    parental_consent_required = Column(Boolean, nullable=False, default=False)
    parental_consent_evidence = Column(JSONB, nullable=True)

    # Soft delete + audit
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    user = relationship("User", backref="learner_profile", uselist=False)


class TierEnrollment(Base):
    """N per User. One row per (user, tier, optional exam)."""

    __tablename__ = "tier_enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Postgres enum types must match the SQL definitions verbatim.
    tier = Column(
        Enum(TierKind, name="tier_kind", values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        index=True,
    )
    tier_context = Column(JSONB, nullable=False, default=dict)

    status = Column(
        Enum(
            TierEnrollmentStatus,
            name="tier_enrollment_status",
            values_callable=lambda obj: [e.value for e in obj],
        ),
        nullable=False,
        default=TierEnrollmentStatus.PENDING,
        index=True,
    )

    started_at = Column(DateTime, nullable=True)
    target_completion_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_activity_at = Column(DateTime, nullable=True)

    progress_pct = Column(Numeric(5, 2), nullable=False, default=0)

    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)

    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)

    user = relationship("User", backref="tier_enrollments")

    __table_args__ = (
        CheckConstraint("progress_pct >= 0 AND progress_pct <= 100", name="progress_in_range"),
        Index("idx_tier_enrollments_user_tier", "user_id", "tier"),
    )


__all__ = [
    "LearnerProfile",
    "TierEnrollment",
    "TierKind",
    "TierEnrollmentStatus",
]
