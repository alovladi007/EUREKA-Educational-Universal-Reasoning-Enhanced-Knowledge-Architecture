"""Pydantic for the AI tutor agent (Phase 6)."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.agent import (
    AgentMode, AgentRole, AgentSessionStatus, FlagKind, FlagStatus,
)


class SessionCreate(BaseModel):
    skill_id: UUID | None = None
    item_id: UUID | None = None
    mode: AgentMode = AgentMode.SOCRATIC


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    user_id: UUID
    skill_id: UUID | None
    item_id: UUID | None
    mode: AgentMode
    status: AgentSessionStatus
    hint_level: int
    model: str
    started_at: datetime
    last_activity_at: datetime
    ended_at: datetime | None


class TurnRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    session_id: UUID
    role: AgentRole
    content: str
    citations: list[dict[str, Any]]
    groundedness_score: Decimal | None
    tokens_in: int | None
    tokens_out: int | None
    model: str | None
    latency_ms: int | None
    created_at: datetime


class TraceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    session_id: UUID
    message_id: UUID | None
    tool_name: str
    args: dict[str, Any]
    result: dict[str, Any]
    ok: bool
    error: str | None
    latency_ms: int | None
    created_at: datetime


class TurnResponse(BaseModel):
    session_id: UUID
    message: MessageResponse
    hint_level: int
    groundedness_score: float
    traces: list[TraceResponse] = []


class FlagCreate(BaseModel):
    message_id: UUID
    kind: FlagKind
    learner_note: str | None = Field(default=None, max_length=2000)


class FlagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    message_id: UUID
    reporter_user_id: UUID
    kind: FlagKind
    learner_note: str | None
    status: FlagStatus
    created_at: datetime
