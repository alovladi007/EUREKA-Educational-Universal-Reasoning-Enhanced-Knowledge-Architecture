"""
AI tutor / agent ORM (Phase 6, 2026-05). See eureka/ops/db/09_tutor.sql.

Five tables:
  KnowledgeChunk      RAG corpus row (text + embedding + source_uri).
  AgentSession        One conversation. Mode + hint_level + skill focus.
  AgentMessage        Append-only message log (system/user/assistant/tool).
  AgentTrace          Tool-call audit row.
  FlaggedResponse     Learner-reported potential hallucinations.

Named `agent_*` to avoid collision with the older `tutor_*` tables that
were created by the v0 tutor-llm service (different shape).
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, CheckConstraint, Column, DateTime, Enum, ForeignKey, Index,
    Integer, Numeric, String, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.core.database import Base
from app.models.skill import SkillFramework


class ChunkSourceKind(str, enum.Enum):
    ITEM_STEM = "item_stem"
    ITEM_EXPLANATION = "item_explanation"
    SKILL_DESCRIPTION = "skill_description"
    IMPORTED_PASSAGE = "imported_passage"
    COURSE_MODULE = "course_module"
    WEB_EXCERPT = "web_excerpt"


class AgentSessionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class AgentMode(str, enum.Enum):
    SOCRATIC = "socratic"
    DIRECT = "direct"
    PRACTICE = "practice"


class AgentRole(str, enum.Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class FlagKind(str, enum.Enum):
    HALLUCINATION = "hallucination"
    INCORRECT_EXPLANATION = "incorrect_explanation"
    BIASED = "biased"
    OFF_TOPIC = "off_topic"
    UNSAFE = "unsafe"
    LOW_GROUNDEDNESS = "low_groundedness"
    OTHER = "other"


class FlagStatus(str, enum.Enum):
    OPEN = "open"
    TRIAGED = "triaged"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    FIXED = "fixed"


def _vals(e):
    return lambda obj: [m.value for m in obj]


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_kind = Column(
        Enum(ChunkSourceKind, name="chunk_source_kind", values_callable=_vals(ChunkSourceKind)),
        nullable=False,
    )
    source_uri = Column(Text, nullable=False, unique=True)
    source_id = Column(UUID(as_uuid=True), nullable=True)
    text = Column(Text, nullable=False)
    tier = Column(String(40), nullable=True)
    framework = Column(
        Enum(SkillFramework, name="skill_framework", values_callable=_vals(SkillFramework)),
        nullable=True,
    )
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)
    # `embedding` column is pgvector — manipulated via raw SQL.
    text_hash = Column(String(64), nullable=False)
    license = Column(String(80), nullable=False, default="EUREKA-Internal")
    attribution = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)


class AgentSession(Base):
    __tablename__ = "agent_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="SET NULL"), nullable=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="SET NULL"), nullable=True)
    mode = Column(
        Enum(AgentMode, name="agent_mode", values_callable=_vals(AgentMode)),
        nullable=False, default=AgentMode.SOCRATIC,
    )
    status = Column(
        Enum(AgentSessionStatus, name="agent_session_status", values_callable=_vals(AgentSessionStatus)),
        nullable=False, default=AgentSessionStatus.ACTIVE,
    )
    hint_level = Column(Integer, nullable=False, default=0)
    model = Column(String(80), nullable=False, default="claude-opus-4-7")
    system_prompt = Column(Text, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_activity_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint("hint_level >= 0 AND hint_level <= 3", name="hint_level_range"),
    )


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("agent_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(Enum(AgentRole, name="agent_role", values_callable=_vals(AgentRole)), nullable=False)
    content = Column(Text, nullable=False)
    citations = Column(JSONB, nullable=False, default=list)
    groundedness_score = Column(Numeric(3, 2), nullable=True)
    tokens_in = Column(Integer, nullable=True)
    tokens_out = Column(Integer, nullable=True)
    model = Column(String(80), nullable=True)
    latency_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class AgentTrace(Base):
    __tablename__ = "agent_traces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("agent_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    message_id = Column(UUID(as_uuid=True), ForeignKey("agent_messages.id", ondelete="CASCADE"), nullable=True)
    tool_name = Column(String(80), nullable=False)
    args = Column(JSONB, nullable=False, default=dict)
    result = Column(JSONB, nullable=False, default=dict)
    ok = Column(Boolean, nullable=False, default=True)
    error = Column(Text, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class FlaggedResponse(Base):
    __tablename__ = "flagged_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    message_id = Column(UUID(as_uuid=True), ForeignKey("agent_messages.id", ondelete="CASCADE"), nullable=False)
    reporter_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    kind = Column(Enum(FlagKind, name="flag_kind", values_callable=_vals(FlagKind)), nullable=False)
    learner_note = Column(Text, nullable=True)
    status = Column(Enum(FlagStatus, name="flag_status", values_callable=_vals(FlagStatus)), nullable=False, default=FlagStatus.OPEN)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    sme_resolution = Column(Text, nullable=True)
    extra_metadata = Column("metadata", JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


__all__ = [
    "KnowledgeChunk", "AgentSession", "AgentMessage", "AgentTrace", "FlaggedResponse",
    "ChunkSourceKind", "AgentSessionStatus", "AgentMode", "AgentRole",
    "FlagKind", "FlagStatus",
]
