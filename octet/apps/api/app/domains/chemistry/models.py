"""Chemistry specific tables (build prompt Section 6).

These sit alongside the tables inherited from AXIOM (knowledge_nodes,
knowledge_edges, misconceptions, items, attempts, mastery_evidence,
issued_variants, missed_questions), which are ported in the curriculum,
assessment, attempts and adaptive domains.

Design note on the reactions table. It is deliberately one curated source of
truth that three separate product surfaces read: the Reaction Deck, the
Mechanism Canvas, and the Retrosynthesis Trainer. That is why it carries
SMARTS patterns, conditions, a mechanism link and misconception hooks in one
row rather than being split per feature.

Safety note. molecules.safety_flags is the gate that keeps a species out of
every generative surface, including the Retrosynthesis Trainer target pool and
the AI tutor's retrieval scope. It is checked at query time, not only at
authoring time.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Molecule(Base):
    """The curated molecule library.

    real_world_note is not decoration. The build prompt requires real molecule
    framing throughout (the ester in aspirin, not compound X), and this column
    is what makes that possible at every surface.
    """

    __tablename__ = "molecules"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    smiles_canonical: Mapped[str] = mapped_column(String(2000), nullable=False)
    inchikey: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    formula: Mapped[str] = mapped_column(String(200), nullable=False)
    molar_mass: Mapped[float] = mapped_column(Float, nullable=False)
    coords_2d: Mapped[dict | None] = mapped_column(JSON)
    coords_3d: Mapped[dict | None] = mapped_column(JSON)
    real_world_note: Mapped[str] = mapped_column(Text, default="")
    # Any non empty value excludes this molecule from every generative surface.
    safety_flags: Mapped[list | None] = mapped_column(JSON, default=list)
    review: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint("inchikey", name="uq_molecule_inchikey"),)


class Reaction(Base):
    """Named and general reactions. One curated source for three surfaces."""

    __tablename__ = "reactions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    reactant_pattern: Mapped[str] = mapped_column(String(2000), nullable=False)  # SMARTS
    product_pattern: Mapped[str] = mapped_column(String(2000), nullable=False)  # SMARTS
    conditions: Mapped[str] = mapped_column(Text, default="")
    mechanism_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("mechanisms.id", ondelete="SET NULL"))
    tier: Mapped[str] = mapped_column(String(20), default="O1")
    misconception_codes: Mapped[list | None] = mapped_column(JSON, default=list)
    # Every entry is round trip tested in CI: applying the SMARTS forward must
    # regenerate the recorded products.
    roundtrip_ok: Mapped[bool] = mapped_column(Boolean, default=False)
    roundtrip_checked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    safety_reviewed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Mechanism(Base):
    """Ordered arrow pushing step graphs for one reaction."""

    __tablename__ = "mechanisms"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    # steps: [{species: [...], arrows: [{from, to, kind}], formal_charges: {...}}]
    steps: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Spectrum(Base):
    """Cached simulated spectra.

    generating_parameters is the verifier's independent path: every cached
    spectrum must be regenerable from it, which is the acceptance criterion.
    """

    __tablename__ = "spectra"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    molecule_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("molecules.id", ondelete="CASCADE"))
    modality: Mapped[str] = mapped_column(String(20), nullable=False)  # 1H, 13C, IR, MS
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    generating_parameters: Mapped[dict] = mapped_column(JSON, nullable=False)
    generator_version: Mapped[str] = mapped_column(String(40), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("molecule_id", "modality", "generator_version", name="uq_spectrum_variant"),
    )


class SimState(Base):
    """Issued simulation scenario with a server held key.

    The client runs the simulation, the server verifies submitted states, which
    is what makes a simulation answer gradable rather than decorative.
    """

    __tablename__ = "sim_states"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    scenario: Mapped[str] = mapped_column(String(80), nullable=False)
    seed: Mapped[int] = mapped_column(Integer, nullable=False)
    server_key: Mapped[dict] = mapped_column(JSON, nullable=False)
    # Predict observe explain: the prediction is graded before the sim runs.
    prediction: Mapped[dict | None] = mapped_column(JSON)
    prediction_graded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ExamBlueprint(Base):
    """AP, ACS style and MCAT section weightings mapped onto nodes."""

    __tablename__ = "exam_blueprints"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(40), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    # weights: [{node_code: str, weight_pct: float}]
    weights: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    total_items: Mapped[int] = mapped_column(Integer, default=0)
    minutes: Mapped[int] = mapped_column(Integer, default=0)
    source_note: Mapped[str] = mapped_column(Text, default="")
    review: Mapped[str] = mapped_column(String(20), default="pending")


class TriangleView(Base):
    """Johnstone triangle bindings for one concept node.

    The most robust finding in chemistry education research is that students
    fail when they cannot connect the macroscopic, the particulate and the
    symbolic. This table makes that link an explicit product surface rather
    than an implicit hope.
    """

    __tablename__ = "triangle_views"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    node_code: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    macroscopic_asset: Mapped[str] = mapped_column(String(500), default="")
    particulate_animation: Mapped[str] = mapped_column(String(500), default="")
    symbolic_form: Mapped[str] = mapped_column(Text, default="")
    synchronized: Mapped[bool] = mapped_column(Boolean, default=False)
    caption: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint("node_code", name="uq_triangle_node"),)
