"""Proctoring ORM models.

A ProctoringSession spans one secure exam attempt. During it, the client reports
IntegrityEvent rows (focus loss, paste attempts, fullscreen exit, and so on). The
session carries a running anomaly_score computed from those events. The platform
rule (build prompt Section 10) is that this produces a score for a human to
review, never an automatic accusation, so nothing here decides anything on its
own; it only surfaces sessions worth a teacher's attention.

Webcam and screen capture are deliberately not modeled: AXIOM does the
non-invasive, browser-observable integrity signals only, and treats minors as the
default user (Section 13).
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
    return datetime.now(UTC).replace(tzinfo=None)


class ProctoringSession(Base):
    __tablename__ = "proctoring_sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    assessment_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    attempt_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    # The lockdown policy in force (block_copy, block_paste, detect_focus_loss,
    # require_fullscreen, ...). Webcam/screen capture are never enabled here.
    policy: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    # active | ended.
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="active")
    anomaly_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    started_at: Mapped[datetime] = mapped_column(default=_now)
    ended_at: Mapped[datetime | None] = mapped_column(nullable=True)


class IntegrityEvent(Base):
    __tablename__ = "integrity_events"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("proctoring_sessions.id", ondelete="CASCADE"), index=True
    )
    # focus_loss | visibility_hidden | window_blur | paste | copy | context_menu
    # | fullscreen_exit | ...
    kind: Mapped[str] = mapped_column(String(32), nullable=False)
    detail: Mapped[str] = mapped_column(Text, nullable=False, default="")
    occurred_at: Mapped[datetime] = mapped_column(default=_now)
