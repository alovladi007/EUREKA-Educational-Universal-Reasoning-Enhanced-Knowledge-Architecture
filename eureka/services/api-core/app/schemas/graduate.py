"""Phase 16.1 — Graduate school Pydantic schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# -- programs -----------------------------------------------------------------

class SkillTargetSpec(BaseModel):
    skill_code: str = Field(..., min_length=2, max_length=120)
    target_mastery: float = Field(0.85, ge=0.0, le=1.0)
    is_required: bool = True
    description: Optional[str] = None


class SkillTargetResponse(SkillTargetSpec):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    program_id: UUID


class ProgramCreateRequest(BaseModel):
    slug: str = Field(..., min_length=2, max_length=120, pattern=r"^[a-z0-9][a-z0-9-]*$")
    name: str = Field(..., min_length=3, max_length=200)
    degree_kind: str
    department: Optional[str] = Field(None, max_length=160)
    description_md: Optional[str] = None
    target_years: float = Field(2.0, ge=0.5, le=12.0)
    min_credits: int = Field(30, ge=0, le=500)
    requires_thesis: bool = False
    requires_qualifying_exam: bool = False
    completion_cert_code: Optional[str] = Field(None, max_length=80)
    cohort_id: Optional[UUID] = None
    skill_targets: list[SkillTargetSpec] = Field(default_factory=list, max_length=200)


class ProgramUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=200)
    department: Optional[str] = Field(None, max_length=160)
    description_md: Optional[str] = None
    target_years: Optional[float] = Field(None, ge=0.5, le=12.0)
    min_credits: Optional[int] = Field(None, ge=0, le=500)
    requires_thesis: Optional[bool] = None
    requires_qualifying_exam: Optional[bool] = None
    completion_cert_code: Optional[str] = Field(None, max_length=80)
    status: Optional[str] = None


class ProgramResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    org_id: UUID
    slug: str
    name: str
    degree_kind: str
    department: Optional[str]
    description_md: Optional[str]
    target_years: float
    min_credits: int
    requires_thesis: bool
    requires_qualifying_exam: bool
    completion_cert_code: Optional[str]
    cohort_id: Optional[UUID]
    status: str
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime


class ProgramDetailResponse(ProgramResponse):
    skill_targets: list[SkillTargetResponse] = Field(default_factory=list)
    enrollments_count: int = 0


# -- enrollments --------------------------------------------------------------

class EnrollmentCreateRequest(BaseModel):
    user_id: UUID
    supervisor_user_id: Optional[UUID] = None
    expected_graduation_year: Optional[int] = Field(None, ge=2024, le=2050)


class EnrollmentUpdateRequest(BaseModel):
    supervisor_user_id: Optional[UUID] = None
    research_focus: Optional[str] = None
    expected_graduation: Optional[date] = None


class EnrollmentActionRequest(BaseModel):
    action: str  # apply|admit|enroll|leave|resume|withdraw|graduate|dismiss
    reason: Optional[str] = None


class EnrollmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    program_id: UUID
    user_id: UUID
    supervisor_user_id: Optional[UUID]
    status: str
    applied_at: Optional[datetime]
    admitted_at: Optional[datetime]
    enrolled_at: Optional[datetime]
    expected_graduation: Optional[date]
    graduated_at: Optional[datetime]
    withdrawn_at: Optional[datetime]
    withdrawal_reason: Optional[str]
    credits_earned: int
    milestones_done: int
    milestones_total: int
    gpa: Optional[float]
    research_focus: Optional[str]
    created_at: datetime
    updated_at: datetime


# -- milestones ---------------------------------------------------------------

class MilestoneCreateRequest(BaseModel):
    kind: str
    title: str = Field(..., min_length=3, max_length=200)
    description_md: Optional[str] = None
    sequence: int = Field(0, ge=0, le=1000)
    due_at: Optional[date] = None
    counts_for_graduation: bool = True


class MilestoneSubmitRequest(BaseModel):
    artifact_url: Optional[str] = Field(None, max_length=2000)


class MilestoneDecisionRequest(BaseModel):
    decision: str  # approved|changes_requested|failed|waived
    notes: Optional[str] = None


class MilestoneResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    enrollment_id: UUID
    kind: str
    title: str
    description_md: Optional[str]
    sequence: int
    due_at: Optional[date]
    status: str
    submitted_at: Optional[datetime]
    decided_at: Optional[datetime]
    decided_by: Optional[UUID]
    decision_notes: Optional[str]
    artifact_url: Optional[str]
    counts_for_graduation: bool
    created_at: datetime
    updated_at: datetime


# -- learner-side rollups -----------------------------------------------------

class MyEnrollmentSummary(BaseModel):
    enrollment_id: UUID
    program_id: UUID
    program_name: str
    degree_kind: str
    status: str
    milestones_done: int
    milestones_total: int
    next_milestone_title: Optional[str] = None
    next_milestone_due_at: Optional[date] = None
    expected_graduation: Optional[date] = None
    supervisor_user_id: Optional[UUID] = None


class MyGraduateResponse(BaseModel):
    enrollments: list[MyEnrollmentSummary] = Field(default_factory=list)
