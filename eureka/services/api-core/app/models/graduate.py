"""
Phase 16.1 — Graduate school tier ORM.

Tables in eureka/ops/db/18_graduate.sql.

Design notes
------------
Per the 2026-05 plan revision, this tier deliberately does NOT model
advisors / committees / committee_meetings. Each `GraduateEnrollment`
has a single optional `supervisor_user_id` — a faculty user who can
decide milestones — and that's the entire faculty interaction surface.

What makes the tier compelling is the Research Tools suite that lands
in Sessions 16.6 + 16.7 (symbolic math, stats, plotting, units,
chemistry, biology, citation-aware Q&A), not yet-another committee
HR model.
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean, Date, DateTime, ForeignKey, Index, Integer,
    Numeric, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import ENUM, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# -- enums --------------------------------------------------------------------

class DegreeKind(str, enum.Enum):
    masters_thesis = "masters_thesis"
    masters_coursework = "masters_coursework"
    masters_professional = "masters_professional"
    phd = "phd"
    doctoral_professional = "doctoral_professional"
    postdoc = "postdoc"
    certificate = "certificate"


class GradProgramStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    archived = "archived"


class GradEnrollmentStatus(str, enum.Enum):
    applied = "applied"
    admitted = "admitted"
    enrolled = "enrolled"
    on_leave = "on_leave"
    withdrawn = "withdrawn"
    graduated = "graduated"
    dismissed = "dismissed"


class MilestoneKind(str, enum.Enum):
    coursework = "coursework"
    qualifying_exam = "qualifying_exam"
    proposal = "proposal"
    irb = "irb"
    data_collection = "data_collection"
    manuscript = "manuscript"
    thesis_draft = "thesis_draft"
    thesis_defense = "thesis_defense"
    teaching = "teaching"
    publication = "publication"
    custom = "custom"


class MilestoneStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    submitted = "submitted"
    approved = "approved"
    changes_requested = "changes_requested"
    failed = "failed"
    waived = "waived"


# -- PG enum bridges (create_type=False — schema owns them) -------------------

_PG_DEGREE_KIND = ENUM(
    "masters_thesis", "masters_coursework", "masters_professional",
    "phd", "doctoral_professional", "postdoc", "certificate",
    name="degree_kind", create_type=False,
)
_PG_GRAD_PROGRAM_STATUS = ENUM(
    "draft", "active", "paused", "archived",
    name="grad_program_status", create_type=False,
)
_PG_GRAD_ENROLLMENT_STATUS = ENUM(
    "applied", "admitted", "enrolled", "on_leave",
    "withdrawn", "graduated", "dismissed",
    name="grad_enrollment_status", create_type=False,
)
_PG_MILESTONE_KIND = ENUM(
    "coursework", "qualifying_exam", "proposal", "irb",
    "data_collection", "manuscript", "thesis_draft", "thesis_defense",
    "teaching", "publication", "custom",
    name="milestone_kind", create_type=False,
)
_PG_MILESTONE_STATUS = ENUM(
    "not_started", "in_progress", "submitted", "approved",
    "changes_requested", "failed", "waived",
    name="milestone_status", create_type=False,
)


# -- 16.1.1 graduate_programs -------------------------------------------------

class GraduateProgram(Base):
    __tablename__ = "graduate_programs"
    __table_args__ = (
        UniqueConstraint("org_id", "slug", name="uq_grad_program_slug"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    degree_kind: Mapped[str] = mapped_column(_PG_DEGREE_KIND, nullable=False)
    department: Mapped[str | None] = mapped_column(String(160))
    description_md: Mapped[str | None] = mapped_column(Text)
    target_years: Mapped[float] = mapped_column(Numeric(3, 1), default=2.0, nullable=False)
    min_credits: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    requires_thesis: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    requires_qualifying_exam: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    completion_cert_code: Mapped[str | None] = mapped_column(String(80))
    cohort_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("cohorts.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(_PG_GRAD_PROGRAM_STATUS, default=GradProgramStatus.draft.value, nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- 16.1.2 program_skill_targets ---------------------------------------------

class ProgramSkillTarget(Base):
    __tablename__ = "program_skill_targets"
    __table_args__ = (
        UniqueConstraint("program_id", "skill_code", name="uq_program_skill"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("graduate_programs.id", ondelete="CASCADE"), nullable=False)
    skill_code: Mapped[str] = mapped_column(String(120), nullable=False)
    target_mastery: Mapped[float] = mapped_column(Numeric(4, 3), default=0.85, nullable=False)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)


# -- 16.1.3 graduate_enrollments ----------------------------------------------

class GraduateEnrollment(Base):
    __tablename__ = "graduate_enrollments"
    __table_args__ = (
        UniqueConstraint("program_id", "user_id", name="uq_grad_enrollment"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("graduate_programs.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Single optional supervisor. No committee table — by design (2026-05).
    supervisor_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(_PG_GRAD_ENROLLMENT_STATUS, default=GradEnrollmentStatus.enrolled.value, nullable=False)
    applied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    admitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    enrolled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expected_graduation: Mapped[date | None] = mapped_column(Date)
    graduated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    withdrawn_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    withdrawal_reason: Mapped[str | None] = mapped_column(Text)
    credits_earned: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    milestones_done: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    milestones_total: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    gpa: Mapped[float | None] = mapped_column(Numeric(4, 3))
    research_focus: Mapped[str | None] = mapped_column(Text)
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# -- 16.1.4 degree_milestones -------------------------------------------------

class DegreeMilestone(Base):
    __tablename__ = "degree_milestones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    enrollment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("graduate_enrollments.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[str] = mapped_column(_PG_MILESTONE_KIND, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text)
    sequence: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    due_at: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(_PG_MILESTONE_STATUS, default=MilestoneStatus.not_started.value, nullable=False)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    decided_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    decision_notes: Mapped[str | None] = mapped_column(Text)
    artifact_url: Mapped[str | None] = mapped_column(Text)
    counts_for_graduation: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
