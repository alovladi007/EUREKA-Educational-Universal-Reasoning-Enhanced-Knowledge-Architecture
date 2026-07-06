"""Copilot ORM models: tutoring sessions and their messages.

A CopilotSession is a threaded tutoring conversation, optionally anchored to a
skill node so retrieval stays on-topic. Each CopilotMessage records who spoke,
what was said, which provider produced an assistant turn, and the sources it was
grounded in, so every AI-assisted reply is auditable and teacher-overridable.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Float, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


class CopilotSession(Base):
    __tablename__ = "copilot_sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(default=_now)


class CopilotMessage(Base):
    __tablename__ = "copilot_messages"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("copilot_sessions.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    role: Mapped[str] = mapped_column(String(16), nullable=False)  # user | assistant
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # Empty for user turns; the reasoning backend for assistant turns.
    provider: Mapped[str] = mapped_column(String(24), nullable=False, default="")
    # Grounding citations for assistant turns: [{source, kind, text}, ...].
    sources: Mapped[list | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=_now)


class GeneratedItem(Base):
    """A copilot-generated candidate item awaiting human review.

    Item generation never writes directly into the item bank. Each candidate is
    validated by the CAS at generation time (validated=True only when its answer
    key parses and grades itself correct) and stored here as pending. A teacher
    approves it (which creates a real Item) or rejects it. This enforces the
    platform rule that no AI-generated item enters a bank without human sign-off.
    """

    __tablename__ = "generated_items"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    kind: Mapped[str] = mapped_column(String(24), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[list | None] = mapped_column(JSON, nullable=True)
    correct: Mapped[str] = mapped_column(String(500), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    difficulty: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
    meta: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # How the candidate was produced (for example "deterministic:linear").
    source: Mapped[str] = mapped_column(String(48), nullable=False, default="")
    # True only when the CAS confirmed the answer key at generation time.
    validated: Mapped[bool] = mapped_column(default=False, nullable=False)
    # pending | approved | rejected.
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(default=_now)
    reviewed_at: Mapped[datetime | None] = mapped_column(nullable=True)
    # The Item created when the candidate is approved.
    approved_item_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
