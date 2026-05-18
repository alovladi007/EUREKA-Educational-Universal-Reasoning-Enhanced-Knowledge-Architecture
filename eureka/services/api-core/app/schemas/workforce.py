"""Phase 15 — Workforce training Pydantic schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# -- 15.1 partnerships + seats ------------------------------------------------

class PartnershipCreateRequest(BaseModel):
    org_id: UUID
    name: str = Field(..., min_length=3, max_length=160)
    partnership_kind: str = "workforce"
    primary_contact_user_id: Optional[UUID] = None
    contracted_seats: int = Field(0, ge=0, le=1_000_000)
    seat_renewal_at: Optional[date] = None
    marketplace_discount_bps: Optional[int] = Field(None, ge=0, le=10_000)
    custom_branding: dict = Field(default_factory=dict)
    webhook_event_filter: list[str] = Field(default_factory=lambda: ["*"])
    notes_md: Optional[str] = None


class PartnershipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    org_id: UUID
    partnership_kind: str
    name: str
    primary_contact_user_id: Optional[UUID]
    contracted_seats: int
    seat_renewal_at: Optional[date]
    status: str
    marketplace_discount_bps: Optional[int]
    custom_branding: dict
    webhook_event_filter: list[str]
    activated_at: Optional[datetime]
    paused_at: Optional[datetime]
    notes_md: Optional[str]
    created_at: datetime
    updated_at: datetime


class PartnershipActionRequest(BaseModel):
    action: str  # "activate" | "pause" | "expire"


class SeatBulkAssignRow(BaseModel):
    email: EmailStr
    role_label: Optional[str] = None
    team_label: Optional[str] = None
    manager_email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class SeatBulkAssignRequest(BaseModel):
    rows: list[SeatBulkAssignRow] = Field(..., min_length=1, max_length=2000)


class SeatBulkAssignResponse(BaseModel):
    assigned: int
    skipped: int
    over_capacity: int
    seat_utilisation: int      # active seats after this call
    contracted_seats: int


class SeatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    partnership_id: UUID
    user_id: UUID
    assigned_at: datetime
    released_at: Optional[datetime]
    role_label: Optional[str]
    team_label: Optional[str]
    manager_user_id: Optional[UUID]


class SeatUtilisationResponse(BaseModel):
    partnership_id: UUID
    contracted_seats: int
    active_seats: int
    available_seats: int
    by_team: dict
    by_role: dict


# -- 15.2 programs ------------------------------------------------------------

class MilestoneCreate(BaseModel):
    week_index: int = Field(..., ge=0, le=104)
    skill_code: str = Field(..., max_length=120)
    target_mastery: float = Field(0.70, ge=0, le=1)
    description: Optional[str] = None


class ProgramCreateRequest(BaseModel):
    slug: str = Field(..., min_length=3, max_length=120, pattern=r"^[a-z0-9][a-z0-9_-]*$")
    name: str = Field(..., min_length=3, max_length=160)
    description_md: Optional[str] = None
    target_role: Optional[str] = Field(None, max_length=80)
    target_skill_codes: list[str] = Field(..., min_length=1)
    required_cert_codes: list[str] = Field(default_factory=list)
    duration_weeks: int = Field(8, ge=1, le=104)
    is_mandatory: bool = False
    target_mastery: float = Field(0.80, ge=0.5, le=1.0)
    cohort_id: Optional[UUID] = None
    milestones: list[MilestoneCreate] = Field(default_factory=list)


class ProgramResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    partnership_id: UUID
    slug: str
    name: str
    description_md: Optional[str]
    target_role: Optional[str]
    target_skill_codes: list[str]
    required_cert_codes: list[str]
    duration_weeks: int
    is_mandatory: bool
    target_mastery: float
    cohort_id: Optional[UUID]
    status: str
    created_at: datetime
    updated_at: datetime


class ProgramAssignRequest(BaseModel):
    user_ids: list[UUID] = Field(..., min_length=1, max_length=2000)
    due_at: Optional[datetime] = None


class ProgramAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    program_id: UUID
    user_id: UUID
    assigned_at: datetime
    due_at: Optional[datetime]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    status: str
    progress_pct: float
    study_plan_id: Optional[UUID]


class ProgramAssignBulkResponse(BaseModel):
    program_id: UUID
    new_assignments: int
    already_assigned: int
    study_plans_created: int


# -- 15.3 compliance ----------------------------------------------------------

class ComplianceRequirementCreate(BaseModel):
    code: str = Field(..., min_length=2, max_length=80, pattern=r"^[A-Z0-9][A-Z0-9_.-]*$")
    name: str = Field(..., max_length=160)
    regulation: str   # RegulationKind value
    description_md: Optional[str] = None
    program_id: Optional[UUID] = None
    recurrence_months: int = Field(12, ge=0, le=120)
    nudge_window_days: int = Field(30, ge=0, le=365)
    attestation_required: bool = True
    metadata: dict = Field(default_factory=dict)


class ComplianceRequirementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    partnership_id: UUID
    code: str
    name: str
    regulation: str
    description_md: Optional[str]
    program_id: Optional[UUID]
    recurrence_months: int
    nudge_window_days: int
    attestation_required: bool
    is_active: bool
    extra: dict
    created_at: datetime


class ComplianceDueDateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    requirement_id: UUID
    user_id: UUID
    due_at: datetime
    last_completed_at: Optional[datetime]
    status: str
    last_attestation_id: Optional[UUID]
    last_evaluated_at: datetime


class AttestRequest(BaseModel):
    statement: str = Field(..., min_length=10, max_length=4000)


class AttestationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    requirement_id: UUID
    user_id: UUID
    attested_at: datetime
    statement: str


# -- 15.4 workforce analytics -------------------------------------------------

class WorkforceFunnelRow(BaseModel):
    label: str             # team or role label
    seat_count: int
    in_progress: int
    completed: int
    overdue: int


class WorkforceAnalyticsResponse(BaseModel):
    partnership_id: UUID
    active_seats: int
    contracted_seats: int
    programs_active: int
    assignments_total: int
    assignments_overdue: int
    compliance_overdue: int
    compliance_due_soon: int
    by_team: list[WorkforceFunnelRow]
    by_role: list[WorkforceFunnelRow]


# -- 15.5 worker portal -------------------------------------------------------

class MyTrainingProgram(BaseModel):
    assignment: ProgramAssignmentResponse
    program: ProgramResponse


class MyComplianceItem(BaseModel):
    requirement: ComplianceRequirementResponse
    due_date: ComplianceDueDateResponse


class MyTrainingResponse(BaseModel):
    programs: list[MyTrainingProgram] = Field(default_factory=list)
    compliance: list[MyComplianceItem] = Field(default_factory=list)
