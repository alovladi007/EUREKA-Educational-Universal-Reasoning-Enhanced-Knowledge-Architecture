"""
Phase 15 — Workforce training affiliate platform ORM.

Tables in eureka/ops/db/17_workforce.sql.
"""

from __future__ import annotations

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index, Integer,
    Numeric, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, ENUM, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


# -- enums --------------------------------------------------------------------

class PartnershipKind(str, enum.Enum):
    workforce = "workforce"
    academic = "academic"
    both = "both"


class PartnershipStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    paused = "paused"
    expired = "expired"


class ProgramStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class AssignmentStatus(str, enum.Enum):
    assigned = "assigned"
    in_progress = "in_progress"
    completed = "completed"
    overdue = "overdue"
    waived = "waived"


class ComplianceStatusEnum(str, enum.Enum):
    compliant = "compliant"
    due_soon = "due_soon"
    overdue = "overdue"
    expired = "expired"
    not_applicable = "not_applicable"


class RegulationKind(str, enum.Enum):
    hipaa = "hipaa"
    osha = "osha"
    soc2 = "soc2"
    gdpr = "gdpr"
    pci_dss = "pci_dss"
    iso_27001 = "iso_27001"
    sox = "sox"
    ferpa = "ferpa"
    sector_specific = "sector_specific"
    internal = "internal"


# -- PG enum bridges ----------------------------------------------------------

_PG_PARTNERSHIP_KIND = ENUM(
    "workforce", "academic", "both", name="partnership_kind", create_type=False,
)
_PG_PARTNERSHIP_STATUS = ENUM(
    "draft", "active", "paused", "expired", name="partnership_status", create_type=False,
)
_PG_PROGRAM_STATUS = ENUM(
    "draft", "active", "archived", name="program_status", create_type=False,
)
_PG_ASSIGNMENT_STATUS = ENUM(
    "assigned", "in_progress", "completed", "overdue", "waived",
    name="assignment_status", create_type=False,
)
_PG_COMPLIANCE_STATUS = ENUM(
    "compliant", "due_soon", "overdue", "expired", "not_applicable",
    name="compliance_status", create_type=False,
)
_PG_REGULATION_KIND = ENUM(
    "hipaa", "osha", "soc2", "gdpr", "pci_dss", "iso_27001",
    "sox", "ferpa", "sector_specific", "internal",
    name="regulation_kind", create_type=False,
)


# -- 15.1 partnerships + seats ------------------------------------------------

class InstitutionPartnership(Base):
    __tablename__ = "institution_partnerships"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), unique=True, nullable=False)
    partnership_kind: Mapped[str] = mapped_column(_PG_PARTNERSHIP_KIND, default=PartnershipKind.workforce.value, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    primary_contact_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    contracted_seats: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    seat_renewal_at: Mapped[date | None] = mapped_column(Date)
    billing_anchor_subscription_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("subscriptions.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(_PG_PARTNERSHIP_STATUS, default=PartnershipStatus.draft.value, nullable=False)
    marketplace_discount_bps: Mapped[int | None] = mapped_column(Integer)
    custom_branding: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    webhook_event_filter: Mapped[list[str]] = mapped_column(ARRAY(String), default=lambda: ["*"])
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    paused_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes_md: Mapped[str | None] = mapped_column(Text)


class SeatAssignment(Base):
    __tablename__ = "seat_assignments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partnership_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("institution_partnerships.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assigned_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    assigned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    release_reason: Mapped[str | None] = mapped_column(Text)
    role_label: Mapped[str | None] = mapped_column(String(120))
    team_label: Mapped[str | None] = mapped_column(String(120))
    manager_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)


# -- 15.2 programs ------------------------------------------------------------

class WorkforceProgram(Base):
    __tablename__ = "workforce_programs"
    __table_args__ = (
        UniqueConstraint("partnership_id", "slug", name="uq_program_slug_per_partnership"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partnership_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("institution_partnerships.id", ondelete="CASCADE"), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text)
    target_role: Mapped[str | None] = mapped_column(String(80))
    target_skill_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    required_cert_codes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    duration_weeks: Mapped[int] = mapped_column(Integer, default=8, nullable=False)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    target_mastery: Mapped[float] = mapped_column(Numeric(4, 3), default=0.80, nullable=False)
    cohort_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("cohorts.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(_PG_PROGRAM_STATUS, default=ProgramStatus.draft.value, nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ProgramAssignment(Base):
    __tablename__ = "program_assignments"
    __table_args__ = (
        UniqueConstraint("program_id", "user_id", name="uq_program_assignment"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workforce_programs.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assigned_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    assigned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    waived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    waiver_reason: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(_PG_ASSIGNMENT_STATUS, default=AssignmentStatus.assigned.value, nullable=False)
    progress_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=0, nullable=False)
    study_plan_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("study_plans.id", ondelete="SET NULL"))


class ProgramMilestone(Base):
    __tablename__ = "program_milestones"
    __table_args__ = (
        UniqueConstraint("program_id", "week_index", "skill_code", name="uq_milestone_per_week_skill"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workforce_programs.id", ondelete="CASCADE"), nullable=False)
    week_index: Mapped[int] = mapped_column(Integer, nullable=False)
    skill_code: Mapped[str] = mapped_column(String(120), nullable=False)
    target_mastery: Mapped[float] = mapped_column(Numeric(4, 3), default=0.70, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)


# -- 15.3 compliance ----------------------------------------------------------

class ComplianceRequirement(Base):
    __tablename__ = "compliance_requirements"
    __table_args__ = (
        UniqueConstraint("partnership_id", "code", name="uq_compliance_code_per_partnership"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partnership_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("institution_partnerships.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(String(80), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    regulation: Mapped[str] = mapped_column(_PG_REGULATION_KIND, nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text)
    program_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("workforce_programs.id", ondelete="SET NULL"))
    recurrence_months: Mapped[int] = mapped_column(Integer, default=12, nullable=False)
    nudge_window_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    attestation_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ComplianceDueDate(Base):
    __tablename__ = "compliance_due_dates"
    __table_args__ = (
        UniqueConstraint("requirement_id", "user_id", name="uq_due_date_per_user"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requirement_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("compliance_requirements.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(_PG_COMPLIANCE_STATUS, default=ComplianceStatusEnum.due_soon.value, nullable=False)
    last_attestation_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    last_evaluated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class TrainingAttestation(Base):
    __tablename__ = "training_attestations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requirement_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("compliance_requirements.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    attested_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    attested_from_ip: Mapped[str | None] = mapped_column(String(45))
    user_agent: Mapped[str | None] = mapped_column(String(500))
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_hash: Mapped[str | None] = mapped_column(String(80))
    extra: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
