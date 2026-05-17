"""Pydantic schemas for Phase 9 (institutional / B2B)."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.institutional import CohortRole, CohortStatus, SsoProtocol


class CohortCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=100, pattern=r"^[a-z0-9][a-z0-9-]*$")
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None
    target_skill_codes: list[str] = Field(default_factory=list)
    target_mastery: float = Field(default=0.85, ge=0, le=1)
    min_weekly_attempts: int = Field(default=0, ge=0)
    starts_at: datetime | None = None
    ends_at: datetime | None = None


class CohortResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    org_id: UUID
    slug: str
    name: str
    description: str | None
    status: CohortStatus
    target_skill_codes: list[str]
    target_mastery: Decimal
    min_weekly_attempts: int
    starts_at: datetime | None
    ends_at: datetime | None
    created_at: datetime


class CohortMembershipCreate(BaseModel):
    user_id: UUID
    role: CohortRole = CohortRole.LEARNER


class CohortMembershipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    cohort_id: UUID
    user_id: UUID
    role: CohortRole
    joined_at: datetime
    left_at: datetime | None


class CohortBlueprintLink(BaseModel):
    blueprint_id: UUID
    is_required: bool = True
    target_date: datetime | None = None


class CohortAggregateResponse(BaseModel):
    cohort_id: UUID
    name: str
    org_id: UUID
    n_learners: int
    n_active_learners_7d: int
    target_skill_codes: list[str]
    target_mastery_threshold: float
    per_skill: list[dict[str, Any]]
    mocks_summary: dict[str, Any]
    attempts_total: int
    attempts_last_7d: int


class SsoConfigCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    protocol: SsoProtocol = SsoProtocol.OIDC
    issuer: str | None = None
    discovery_url: str | None = None
    client_id: str | None = None
    client_secret: str | None = None
    attribute_mapping: dict[str, str] = Field(default_factory=dict)
    default_role: str = "student"
    just_in_time_provisioning: bool = True
    auto_enroll_cohort_id: UUID | None = None


class SsoConfigResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    org_id: UUID
    name: str
    protocol: SsoProtocol
    issuer: str | None
    discovery_url: str | None
    client_id: str | None
    attribute_mapping: dict[str, Any]
    default_role: str
    just_in_time_provisioning: bool
    is_active: bool
    created_at: datetime


class LtiPlatformCreate(BaseModel):
    issuer: str
    client_id: str
    deployment_id: str
    auth_login_url: str
    auth_token_url: str
    auth_token_aud: str | None = None
    jwks_url: str
    target_cohort_id: UUID | None = None


class LtiPlatformResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    org_id: UUID
    issuer: str
    client_id: str
    deployment_id: str
    auth_login_url: str
    auth_token_url: str
    jwks_url: str
    is_active: bool


class LtiGradeRequest(BaseModel):
    lineitem_url: str
    user_sub: str
    score_given: float = Field(ge=0)
    score_maximum: float = Field(gt=0)
    activity_progress: str = "Completed"
    grading_progress: str = "FullyGraded"
    comment: str | None = None
