"""Pydantic for exam analytics + mocks (Phase 7)."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.exam import MockAttemptStatus


class AttemptLogIn(BaseModel):
    item_id: UUID
    answer_index: int | None = None
    answer_value: float | None = None
    is_correct: bool | None = None
    time_taken_ms: int | None = Field(default=None, ge=0)
    hints_used: int = 0
    max_hint_level: int = 0
    source: str = "practice"
    agent_session_id: UUID | None = None


class AttemptLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    item_id: UUID
    is_correct: bool
    time_taken_ms: int | None
    source: str
    created_at: datetime


class BlueprintCreate(BaseModel):
    slug: str = Field(min_length=2, max_length=100, pattern=r"^[a-z0-9-]+$")
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None
    bank_slugs: list[str] = Field(min_length=1)
    skill_weights: list[dict[str, Any]] = Field(default_factory=list)
    item_count: int = Field(default=40, ge=1, le=400)
    time_limit_min: int = Field(default=60, ge=1)
    score_mapping: list[dict[str, Any]] = Field(default_factory=list)
    pass_threshold_scaled: float | None = None
    difficulty_b_range: list[float] | None = None


class BlueprintResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    slug: str
    name: str
    description: str | None
    bank_slugs: list[str]
    skill_weights: list[dict[str, Any]]
    item_count: int
    time_limit_min: int
    score_mapping: list[dict[str, Any]]
    pass_threshold_scaled: Decimal | None
    is_active: bool
    created_at: datetime


class MockAttemptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    blueprint_id: UUID
    status: MockAttemptStatus
    started_at: datetime
    submitted_at: datetime | None
    deadline_at: datetime
    correct_count: int | None
    answered_count: int | None
    theta: Decimal | None
    theta_se: Decimal | None
    scaled_score: Decimal | None
    predicted_pass: bool | None
    pass_probability: Decimal | None


class MockAttemptItemSummary(BaseModel):
    item_id: UUID
    position: int
    answer_index: int | None
    is_correct: bool | None
    flagged: bool
    time_taken_ms: int | None


class MockAnswerRequest(BaseModel):
    item_id: UUID
    answer_index: int | None = None
    answer_value: float | None = None
    time_taken_ms: int | None = None
    flagged: bool = False


class CalibrateResponse(BaseModel):
    items_calibrated: int
    learners_with_theta: int
    iterations: int
    log_likelihood: float


class FsrsRateRequest(BaseModel):
    skill_id: UUID
    rating: str = Field(pattern=r"^(again|hard|good|easy)$")
