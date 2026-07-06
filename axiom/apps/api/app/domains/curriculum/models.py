"""Curriculum ORM models: standards and the skill graph.

A KnowledgeNode is a single skill or concept. KnowledgeEdge links nodes into a
directed graph (prerequisite or related). Objective ties a node to a standard
so mastery can be reported against a framework. This is the spine the adaptive
engine plans over.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.core.db import Base

# Node kinds (Curriculum & Proof Extension, Section 3). A node is either a
# procedure with a checkable answer (computational_skill), a definition or
# theorem to understand and apply (concept), a reusable argument pattern tracked
# as its own transferable skill (proof_technique), or a named result the learner
# must be able to prove (theorem_with_proof).
NODE_KINDS = (
    "computational_skill",
    "concept",
    "proof_technique",
    "theorem_with_proof",
)

# Cross-cutting tracks (Extension, Section 1). "applied" tags the engineering /
# photonics spine (linear algebra, ODEs, PDEs methods, Fourier, complex,
# numerics); "pure" tags the proof sequence. None means the node is on neither
# specialised track (foundational/shared).
NODE_TRACKS = ("applied", "pure")


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


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
    # Node taxonomy (Extension Section 3). Plain String, not a DB enum, so a new
    # kind never needs a migration. Defaults to computational_skill so every
    # pre-existing node keeps its meaning.
    kind: Mapped[str] = mapped_column(
        String(24),
        nullable=False,
        default="computational_skill",
        server_default="computational_skill",
    )
    # Curriculum tier 0-6 (Extension Section 1); null for unclassified nodes.
    tier: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # Cross-cutting track tag: "applied", "pure", or null (see NODE_TRACKS).
    track: Mapped[str | None] = mapped_column(String(16), nullable=True)


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


class Definition(Base):
    """A term in the per-course definition reference library (Extension 6).

    course_code and tenant_id scope the entry so each course, and each tenant,
    keeps its own conventions. node_id optionally anchors the term to a concept
    node. Items and the copilot's proof-tutor retrieve from this library so a
    course's notation and phrasing stay consistent.
    """

    __tablename__ = "math_definitions"
    __table_args__ = (
        UniqueConstraint("tenant_id", "course_code", "term", name="uq_definition_term"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    course_code: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    node_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="SET NULL"), nullable=True, index=True
    )
    term: Mapped[str] = mapped_column(String(200), nullable=False)
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    notation: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(default=_now)


class Theorem(Base):
    """A named result in the per-course theorem reference library (Extension 6).

    techniques lists the proof-technique node codes the result's proof uses;
    depends_on lists prior theorem names it relies on. Together they let the
    knowledge graph and the copilot reason about what a proof needs, and let
    theorem-with-proof nodes link to the techniques they exercise (Section 3).
    """

    __tablename__ = "math_theorems"
    __table_args__ = (
        UniqueConstraint("tenant_id", "course_code", "name", name="uq_theorem_name"),
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    tenant_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True, index=True)
    course_code: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    node_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="SET NULL"), nullable=True, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    proof_sketch: Mapped[str] = mapped_column(Text, nullable=False, default="")
    techniques: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    depends_on: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(default=_now)
