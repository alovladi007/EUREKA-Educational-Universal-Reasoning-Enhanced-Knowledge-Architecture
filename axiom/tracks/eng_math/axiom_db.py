"""AXIOM persistence layer.

SQLAlchemy 2.0 typed models matching the data-model section of the build
prompt, plus a seed loader and a database-backed mastery store that preserves
the append-only evidence trail.

Engine selection: reads DATABASE_URL (use postgresql+psycopg://... in
production). Defaults to a local SQLite file so the slice runs anywhere with
zero setup. The models use only portable column types, so switching to
PostgreSQL is a URL change plus Alembic, not a rewrite.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, Integer, String, Text, create_engine,
    select,
)
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker,
)

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///axiom.db")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Curriculum
# ---------------------------------------------------------------------------

class KnowledgeNodeRow(Base):
    __tablename__ = "knowledge_nodes"
    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(32))
    description: Mapped[str] = mapped_column(Text, default="")


class KnowledgeEdgeRow(Base):
    __tablename__ = "knowledge_edges"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    source: Mapped[str] = mapped_column(ForeignKey("knowledge_nodes.id"))
    target: Mapped[str] = mapped_column(ForeignKey("knowledge_nodes.id"))
    relation: Mapped[str] = mapped_column(String(32), default="prerequisite")


class MisconceptionRow(Base):
    __tablename__ = "misconceptions"
    code: Mapped[str] = mapped_column(String(16), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    routes_to: Mapped[str] = mapped_column(ForeignKey("knowledge_nodes.id"))


class ItemRow(Base):
    __tablename__ = "items"
    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    node_id: Mapped[str] = mapped_column(ForeignKey("knowledge_nodes.id"))
    grader: Mapped[str] = mapped_column(String(16))
    stem: Mapped[str] = mapped_column(Text)
    # answer_spec, choices, template stored as JSON text: portable across
    # SQLite and Postgres (switch to JSONB in the Postgres migration).
    answer_spec_json: Mapped[str] = mapped_column(Text, default="{}")
    choices_json: Mapped[str] = mapped_column(Text, default="[]")
    template_json: Mapped[str] = mapped_column(Text, default="null")
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    @property
    def answer_spec(self) -> dict:
        return json.loads(self.answer_spec_json)

    @property
    def choices(self) -> list:
        return json.loads(self.choices_json)


# ---------------------------------------------------------------------------
# Attempts and mastery (append-only evidence)
# ---------------------------------------------------------------------------

class AttemptRow(Base):
    __tablename__ = "attempts"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    learner_id: Mapped[str] = mapped_column(String(64), index=True)
    item_id: Mapped[str] = mapped_column(String(32), index=True)
    node_id: Mapped[str] = mapped_column(String(32), index=True)
    correct: Mapped[bool] = mapped_column(Boolean)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    grader: Mapped[str] = mapped_column(String(16))
    detail: Mapped[str] = mapped_column(Text, default="")
    misconception_code: Mapped[str | None] = mapped_column(String(16), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class MasteryEvidenceRow(Base):
    __tablename__ = "mastery_evidence"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    learner_id: Mapped[str] = mapped_column(String(64), index=True)
    node_id: Mapped[str] = mapped_column(String(32), index=True)
    item_id: Mapped[str] = mapped_column(String(32))
    correct: Mapped[bool] = mapped_column(Boolean)
    p_before: Mapped[float] = mapped_column(Float)
    p_after: Mapped[float] = mapped_column(Float)
    note: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


# ---------------------------------------------------------------------------
# Seed loader (idempotent) with the verified-everything gate at load time
# ---------------------------------------------------------------------------

def init_db() -> None:
    Base.metadata.create_all(engine)


def load_seed(path: str, verify_fn=None) -> dict:
    """Load a UnitSeed JSON into the database. Idempotent by primary key.

    verify_fn, if given, is called per item as verify_fn(item_dict) -> bool and
    its result is stored on the row. Items that fail verification are still
    stored but flagged verified=False, and the caller decides whether to serve
    them (the service refuses to serve unverified items).
    """
    with open(path) as f:
        seed = json.load(f)

    counts = {"nodes": 0, "edges": 0, "misconceptions": 0, "items": 0}
    with SessionLocal() as db:
        for n in seed.get("nodes", []):
            if not db.get(KnowledgeNodeRow, n["id"]):
                db.add(KnowledgeNodeRow(
                    id=n["id"], title=n["title"], kind=n["kind"],
                    description=n.get("description", ""),
                ))
                counts["nodes"] += 1
        existing_edges = {
            (e.source, e.target)
            for e in db.execute(select(KnowledgeEdgeRow)).scalars()
        }
        for e in seed.get("edges", []):
            if (e["source"], e["target"]) not in existing_edges:
                db.add(KnowledgeEdgeRow(
                    source=e["source"], target=e["target"],
                    relation=e.get("relation", "prerequisite"),
                ))
                counts["edges"] += 1
        for m in seed.get("misconceptions", []):
            if not db.get(MisconceptionRow, m["code"]):
                db.add(MisconceptionRow(
                    code=m["code"], name=m["name"],
                    description=m["description"], routes_to=m["routes_to"],
                ))
                counts["misconceptions"] += 1
        for it in seed.get("items", []):
            if not db.get(ItemRow, it["id"]):
                verified = bool(verify_fn(it)) if verify_fn else False
                db.add(ItemRow(
                    id=it["id"], node_id=it["node_id"], grader=it["grader"],
                    stem=it["stem"],
                    answer_spec_json=json.dumps(it.get("answer_spec", {})),
                    choices_json=json.dumps(it.get("choices", [])),
                    template_json=json.dumps(it.get("template")),
                    verified=verified,
                    verified_at=_now() if verified else None,
                ))
                counts["items"] += 1
        db.commit()
    return counts


# ---------------------------------------------------------------------------
# DB-backed BKT mastery
# ---------------------------------------------------------------------------

from axiom_mastery import BktParams  # noqa: E402  (shared parameters)


class DbMasteryStore:
    def __init__(self, params: BktParams | None = None) -> None:
        self.params = params or BktParams()

    def current(self, db: Session, learner_id: str, node_id: str) -> float:
        row = db.execute(
            select(MasteryEvidenceRow)
            .where(MasteryEvidenceRow.learner_id == learner_id,
                   MasteryEvidenceRow.node_id == node_id)
            .order_by(MasteryEvidenceRow.created_at.desc())
            .limit(1)
        ).scalar_one_or_none()
        return row.p_after if row else self.params.p_init

    def snapshot(self, db: Session, learner_id: str) -> dict[str, dict]:
        rows = db.execute(
            select(MasteryEvidenceRow)
            .where(MasteryEvidenceRow.learner_id == learner_id)
            .order_by(MasteryEvidenceRow.created_at)
        ).scalars().all()
        out: dict[str, dict] = {}
        for r in rows:
            d = out.setdefault(r.node_id, {"p": self.params.p_init, "attempts": 0})
            d["p"] = r.p_after
            d["attempts"] += 1
        return out

    def update(
        self, db: Session, learner_id: str, node_id: str, item_id: str, correct: bool
    ) -> tuple[float, float, str]:
        p = self.params
        prior = self.current(db, learner_id, node_id)
        if correct:
            num = prior * (1 - p.p_slip)
            den = num + (1 - prior) * p.p_guess
        else:
            num = prior * p.p_slip
            den = num + (1 - prior) * (1 - p.p_guess)
        posterior = num / den if den > 0 else prior
        p_new = min(max(posterior + (1 - posterior) * p.p_learn, 0.0), 1.0)
        note = (f"{'correct' if correct else 'incorrect'} on {item_id}: "
                f"{prior:.3f} -> {p_new:.3f}")
        db.add(MasteryEvidenceRow(
            learner_id=learner_id, node_id=node_id, item_id=item_id,
            correct=correct, p_before=prior, p_after=p_new, note=note,
        ))
        db.commit()
        return prior, p_new, note


class IssuedVariantRow(Base):
    """A parameterized item variant issued to a specific learner.

    Grading always runs against the exact variant that was served (looked up
    by id), never against a recomputed one, so a redeploy or a generator tweak
    can never silently change what a learner is graded on. The key is verified
    at issuance time and stored server-side only.
    """
    __tablename__ = "issued_variants"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    learner_id: Mapped[str] = mapped_column(String(64), index=True)
    item_id: Mapped[str] = mapped_column(String(32), index=True)
    seed: Mapped[int] = mapped_column(Integer)
    payload_json: Mapped[str] = mapped_column(Text)  # A, b for display
    key_json: Mapped[str] = mapped_column(Text)      # never sent to clients
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    consumed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
