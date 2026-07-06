"""Notification ORM model.

A Notification is a small in-app message to one user: a new assignment, an
earned badge, a reviewed grade, or a system note. read_at is null until the user
opens it, which is how the unread count is computed. Other domains create
notifications through the service; nothing here depends on them, so the module
stays a leaf and cannot cause an import cycle.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    # assignment | badge | grade | system
    kind: Mapped[str] = mapped_column(String(32), nullable=False, default="system")
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    # An optional in-app path the client can link to (for example /achievements).
    link: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    read_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_now)
