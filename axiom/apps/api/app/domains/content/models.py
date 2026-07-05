"""Content ORM models: lessons and steps.

A Lesson belongs to a KnowledgeNode. It is a sequence of ContentSteps
(reading, interactive, or checkpoint). Phase 1 renders reading and checkpoint
steps; richer interactive activities arrive later.
"""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(String(1000), nullable=False, default="")

    steps: Mapped[list[ContentStep]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan", order_by="ContentStep.position"
    )


class ContentStep(Base):
    __tablename__ = "content_steps"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    lesson_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("lessons.id", ondelete="CASCADE"), index=True
    )
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    kind: Mapped[str] = mapped_column(String(24), nullable=False, default="reading")
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False, default="")

    lesson: Mapped[Lesson] = relationship(back_populates="steps")
