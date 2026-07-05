"""Curriculum ORM models: standards and the skill graph.

A KnowledgeNode is a single skill or concept. KnowledgeEdge links nodes into a
directed graph (prerequisite or related). Objective ties a node to a standard
so mastery can be reported against a framework. This is the spine the adaptive
engine plans over.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import ForeignKey, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    return datetime.now(UTC)


class StandardsFramework(Base):
    __tablename__ = "standards_frameworks"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    code: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    standards: Mapped[list[Standard]] = relationship(back_populates="framework")


class Standard(Base):
    __tablename__ = "standards"
    __table_args__ = (UniqueConstraint("framework_id", "code", name="uq_standard_code"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    framework_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("standards_frameworks.id", ondelete="CASCADE"), index=True
    )
    code: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)

    framework: Mapped[StandardsFramework] = relationship(back_populates="standards")


class KnowledgeNode(Base):
    """A single skill or concept in the graph."""

    __tablename__ = "knowledge_nodes"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    code: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    grade_band: Mapped[str | None] = mapped_column(String(32), nullable=True)


class KnowledgeEdge(Base):
    """A directed link between nodes. kind is 'prerequisite' or 'related'."""

    __tablename__ = "knowledge_edges"
    __table_args__ = (UniqueConstraint("from_node_id", "to_node_id", "kind", name="uq_edge"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    from_node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    to_node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    kind: Mapped[str] = mapped_column(String(24), nullable=False, default="prerequisite")


class Objective(Base):
    """Links a knowledge node to a standard it addresses."""

    __tablename__ = "objectives"
    __table_args__ = (UniqueConstraint("node_id", "standard_id", name="uq_objective"),)

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    standard_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("standards.id", ondelete="CASCADE"), index=True
    )
