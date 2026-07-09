"""Assessment ORM models.

Two kinds of source content produce a question a student sees:
  Item         - a static question (used for selection types like mcq_single).
  ItemTemplate - a parameterized source with variables, constraints, and an
                 answer expression. resolve seeds a deterministic ItemVariant
                 per student, so no two students get identical numbers while
                 analytics still aggregate at the template level.

An Assessment has one or more AssessmentForms; a form lists AssessmentItems,
each pointing at an Item or an ItemTemplate. AssignmentTarget assigns an
assessment to a user.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime

from sqlalchemy import Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.core.db import Base

# Supported question kinds. Phase 1: mcq_single, numeric, math_expression,
# equation. Phase 2 adds selection and constructed-response variety. The
# Curriculum & Proof Extension adds the structured proof kinds (4.2), the formal
# proof kind (4.1), and the free-form proof kind (4.3). kind is a plain String
# column (no DB enum), so adding a kind here needs no migration.
ITEM_KINDS = (
    "mcq_single",
    "numeric",
    "math_expression",
    "equation",
    "mcq_multi",
    "true_false",
    "short_text",
    "plot_points",
    "plot_function",
    "draw_line",
    "ordering",
    "matching",
    "show_work",
    "free_response",
    # Structured / scaffolded proof (Extension Section 4.2).
    "proof_assembly",
    "justification_matching",
    "proof_gap_fill",
    "find_the_error",
    "counterexample",
    "state_definition",
    "state_theorem",
    # Formal verification (4.1) and free-form proof (4.3).
    "formal_proof",
    "free_form_proof",
    # Multi-part mixed compute-then-prove (Section 5).
    "mixed",
    # Extended technology-enhanced kinds (Build Section 7 long tail).
    "inequality",
    "number_line",
    "mixed_number",
    "units_numeric",
    "cloze_math",
    "categorize_sort",
    "drag_tokens",
    "table_completion",
    # Graphical / image kinds (Build Section 7): click a region, place labels on
    # an image, construct a shape, transform a figure.
    "hotspot",
    "image_labeling",
    "construct_shape",
    "transform_figure",
)


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


def _now() -> datetime:
    # Naive UTC to match the TIMESTAMP (without time zone) columns.
    return datetime.now(UTC).replace(tzinfo=None)


class ItemBank(Base):
    __tablename__ = "item_banks"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False, default="")


class Item(Base):
    """A static, non-parameterized question."""

    __tablename__ = "items"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    bank_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("item_banks.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    kind: Mapped[str] = mapped_column(String(24), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    # options: list[str] for mcq_single; null otherwise.
    options: Mapped[list | None] = mapped_column(JSON, nullable=True)
    # correct: int index for mcq_single; string expression or number for the rest.
    correct: Mapped[str] = mapped_column(String(500), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    difficulty: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
    tolerance: Mapped[float | None] = mapped_column(Float, nullable=True)
    # Kind-specific extras: step-credit milestones for show_work, expected point
    # set for plot_points, etc. Keeps new item kinds from needing new columns.
    meta: Mapped[dict | None] = mapped_column(JSON, nullable=True)


class ItemTemplate(Base):
    """A parameterized question source (numeric or math expression)."""

    __tablename__ = "item_templates"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    bank_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("item_banks.id", ondelete="CASCADE"), index=True
    )
    node_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("knowledge_nodes.id", ondelete="CASCADE"), index=True
    )
    kind: Mapped[str] = mapped_column(String(24), nullable=False)
    stem: Mapped[str] = mapped_column(Text, nullable=False)
    # variables: list of VarSpec dicts (see math_core.templates.VarSpec).
    variables: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    constraints: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    answer_expr: Mapped[str] = mapped_column(String(500), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    difficulty: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
    tolerance: Mapped[float | None] = mapped_column(Float, nullable=True)

    variants: Mapped[list[ItemVariant]] = relationship(back_populates="template")


class ItemVariant(Base):
    """A resolved instance of an ItemTemplate for a specific seed."""

    __tablename__ = "item_variants"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    template_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("item_templates.id", ondelete="CASCADE"), index=True
    )
    seed: Mapped[int] = mapped_column(Integer, nullable=False)
    values: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=_now)

    template: Mapped[ItemTemplate] = relationship(back_populates="variants")


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    kind: Mapped[str] = mapped_column(String(24), nullable=False, default="quiz")
    created_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(default=_now)
    # Optional availability window. A student may only start the assessment
    # between open_at and close_at; null on either side means unbounded.
    open_at: Mapped[datetime | None] = mapped_column(nullable=True)
    close_at: Mapped[datetime | None] = mapped_column(nullable=True)
    # Optional base time limit in minutes (null = untimed). A learner's
    # extra-time accommodation multiplies this into an effective limit at start.
    time_limit_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    forms: Mapped[list[AssessmentForm]] = relationship(
        back_populates="assessment", cascade="all, delete-orphan"
    )


class AssessmentForm(Base):
    __tablename__ = "assessment_forms"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("assessments.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False, default="Form A")
    config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    assessment: Mapped[Assessment] = relationship(back_populates="forms")
    items: Mapped[list[AssessmentItem]] = relationship(
        back_populates="form", cascade="all, delete-orphan", order_by="AssessmentItem.position"
    )


class AssessmentItem(Base):
    """A slot on a form pointing at either an Item or an ItemTemplate."""

    __tablename__ = "assessment_items"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    form_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("assessment_forms.id", ondelete="CASCADE"), index=True
    )
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    item_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("items.id", ondelete="CASCADE"), nullable=True
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("item_templates.id", ondelete="CASCADE"), nullable=True
    )

    form: Mapped[AssessmentForm] = relationship(back_populates="items")


class AssignmentTarget(Base):
    __tablename__ = "assignment_targets"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=_uuid)
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("assessments.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(default=_now)
    # Optional due date and the time a due-soon reminder was sent, so the beat
    # scheduler reminds each assignment exactly once.
    due_at: Mapped[datetime | None] = mapped_column(nullable=True)
    reminded_at: Mapped[datetime | None] = mapped_column(nullable=True)
