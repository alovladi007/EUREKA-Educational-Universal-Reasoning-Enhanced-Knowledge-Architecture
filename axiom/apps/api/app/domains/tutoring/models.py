"""Tutoring ORM models.

A TutoringSession is a live shared-whiteboard room a tutor opens and a student
joins by a short code. The live drawing/chat state travels over the WebSocket
channel and is not persisted (a whiteboard is ephemeral); the row records who
owns the session and whether it is still open, so joins and access can be
governed. Video and recording are out of scope (they need a media server).
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class TutoringSession(Base):
    __tablename__ = "tutoring_sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    tutor_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False, default="Tutoring session")
    # A short human-shareable code a student uses to join.
    join_code: Mapped[str] = mapped_column(String(12), nullable=False, unique=True, index=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="active")
    created_at: Mapped[datetime] = mapped_column(default=_now)
    ended_at: Mapped[datetime | None] = mapped_column(nullable=True)
