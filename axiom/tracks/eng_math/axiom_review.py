"""AXIOM review layer: save and review the questions a learner got wrong.

Teaching-model rationale (axiom_teaching_model.md): a wrong answer is the
most valuable signal a learner produces. This module keeps every missed
question in a per-learner queue with the exact stem the learner saw, what
they answered, and the diagnosed misconception, then clears entries only
when the learner re-answers the same question correctly. Review is therefore
redoing your own errors, not rereading them.

Design:
- One row per (learner, item). Repeat misses increment wrong_count and
  refresh the snapshot; a correct attempt on the item clears the row (the
  history stays, status flips to cleared). A later miss reopens it.
- For parameterized template items the variant_id of the exact missed
  variant is stored, so retry serves the same numbers the learner missed,
  and grading runs against the stored key (the /v3/attempt path).
- The queue never contains answer keys. Retry returns the question only.

Wired into axiom_service via record_attempt() calls at both attempt-write
sites and app.include_router(router).
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import Boolean, DateTime, Integer, String, Text, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from axiom_db import (
    Base, ItemRow, IssuedVariantRow, KnowledgeNodeRow, MisconceptionRow,
    SessionLocal,
)


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _uuid() -> str:
    import uuid
    return str(uuid.uuid4())


class MissedQuestionRow(Base):
    __tablename__ = "missed_questions"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    learner_id: Mapped[str] = mapped_column(String(64), index=True)
    item_id: Mapped[str] = mapped_column(String(32), index=True)
    node_id: Mapped[str] = mapped_column(String(32), index=True)
    variant_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    stem_snapshot: Mapped[str] = mapped_column(Text, default="")
    learner_response: Mapped[str] = mapped_column(Text, default="")
    misconception_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    wrong_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(8), default="open", index=True)
    first_wrong_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    last_wrong_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    cleared_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


# ---------------------------------------------------------------------------
# Hooks called from the attempt routes
# ---------------------------------------------------------------------------

def record_attempt(
    db: Session,
    learner_id: str,
    item: ItemRow,
    correct: bool,
    response_summary: str = "",
    misconception_code: Optional[str] = None,
    variant_id: Optional[str] = None,
    stem: Optional[str] = None,
) -> None:
    """Upsert the missed queue from one graded attempt.

    Wrong: create or reopen the row, bump wrong_count, refresh the snapshot.
    Correct: clear any open row for the item (the learner has redone it).
    """
    row = db.execute(
        select(MissedQuestionRow).where(
            MissedQuestionRow.learner_id == learner_id,
            MissedQuestionRow.item_id == item.id,
        )
    ).scalar_one_or_none()

    if correct:
        if row is not None and row.status == "open":
            row.status = "cleared"
            row.cleared_at = _now()
        return

    if row is None:
        row = MissedQuestionRow(
            learner_id=learner_id, item_id=item.id, node_id=item.node_id,
            wrong_count=0, status="open",
            first_wrong_at=_now(), last_wrong_at=_now(),
        )
        db.add(row)
    row.status = "open"
    row.cleared_at = None
    row.wrong_count += 1
    row.last_wrong_at = _now()
    row.variant_id = variant_id or row.variant_id
    row.stem_snapshot = stem or item.stem or row.stem_snapshot
    row.learner_response = response_summary or row.learner_response
    row.misconception_code = misconception_code or row.misconception_code


# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------

router = APIRouter(prefix="/v1/review", tags=["review"])


class MissedEntry(BaseModel):
    missed_id: str
    item_id: str
    node_id: str
    node_title: str
    stem: str
    your_answer: str
    wrong_count: int
    status: str
    misconception_code: Optional[str] = None
    diagnosis: Optional[str] = None
    last_wrong_at: str
    variant_id: Optional[str] = None


class ReviewSummary(BaseModel):
    learner_id: str
    open_count: int
    cleared_count: int
    by_node: list[dict]


class RetryResponse(BaseModel):
    missed_id: str
    item_id: str
    node_id: str
    node_title: str
    stem: str
    grader: str
    choices: list[dict]
    variant_id: Optional[str] = None
    submit_via: str
    note: str


def _diagnosis_text(db: Session, code: Optional[str]) -> Optional[str]:
    if not code:
        return None
    m = db.get(MisconceptionRow, code)
    if m is None:
        return None
    return f"{m.name}: {m.description}"


@router.get("/{learner_id}/missed", response_model=list[MissedEntry])
def list_missed(
    learner_id: str,
    status: str = "open",
    node_id: Optional[str] = None,
    limit: int = 100,
) -> list[MissedEntry]:
    """The learner's missed-question queue, most recent misses first.

    status: open (default), cleared, or all.
    """
    with SessionLocal() as db:
        q = select(MissedQuestionRow).where(
            MissedQuestionRow.learner_id == learner_id
        )
        if status in ("open", "cleared"):
            q = q.where(MissedQuestionRow.status == status)
        if node_id:
            q = q.where(MissedQuestionRow.node_id == node_id)
        q = q.order_by(MissedQuestionRow.last_wrong_at.desc()).limit(
            max(1, min(limit, 500))
        )
        out = []
        for row in db.execute(q).scalars():
            node = db.get(KnowledgeNodeRow, row.node_id)
            out.append(MissedEntry(
                missed_id=row.id, item_id=row.item_id, node_id=row.node_id,
                node_title=node.title if node else row.node_id,
                stem=row.stem_snapshot, your_answer=row.learner_response,
                wrong_count=row.wrong_count, status=row.status,
                misconception_code=row.misconception_code,
                diagnosis=_diagnosis_text(db, row.misconception_code),
                last_wrong_at=row.last_wrong_at.isoformat(),
                variant_id=row.variant_id,
            ))
        return out


@router.get("/{learner_id}/summary", response_model=ReviewSummary)
def review_summary(learner_id: str) -> ReviewSummary:
    """Counts of open and cleared misses, grouped by node for the dashboard."""
    with SessionLocal() as db:
        rows = db.execute(
            select(MissedQuestionRow).where(
                MissedQuestionRow.learner_id == learner_id
            )
        ).scalars().all()
        open_count = sum(1 for r in rows if r.status == "open")
        by_node: dict[str, dict] = {}
        for r in rows:
            d = by_node.setdefault(r.node_id, {"node_id": r.node_id, "open": 0, "cleared": 0})
            d["open" if r.status == "open" else "cleared"] += 1
        for nid, d in by_node.items():
            node = db.get(KnowledgeNodeRow, nid)
            d["node_title"] = node.title if node else nid
        return ReviewSummary(
            learner_id=learner_id, open_count=open_count,
            cleared_count=len(rows) - open_count,
            by_node=sorted(by_node.values(), key=lambda d: -d["open"]),
        )


@router.post("/{learner_id}/retry/{missed_id}", response_model=RetryResponse)
def retry_missed(learner_id: str, missed_id: str) -> RetryResponse:
    """Serve the missed question again, exactly as the learner saw it.

    Per the teaching model, no answer or key is included; MC choices are
    served without correctness or misconception fields. Template items carry
    their original variant_id so /v3/attempt grades against the stored key
    of the very variant that was missed.
    """
    with SessionLocal() as db:
        row = db.get(MissedQuestionRow, missed_id)
        if row is None or row.learner_id != learner_id:
            return RetryResponse(
                missed_id=missed_id, item_id="", node_id="", node_title="",
                stem="", grader="none", choices=[], variant_id=None,
                submit_via="", note="unknown missed-question id for this learner",
            )
        item = db.get(ItemRow, row.item_id)
        node = db.get(KnowledgeNodeRow, row.node_id)
        choices = []
        grader = item.grader if item else "none"
        if item and item.grader == "mc":
            choices = [{"key": c["key"], "text": c["text"]} for c in item.choices]
        variant_ok = None
        if row.variant_id:
            var = db.get(IssuedVariantRow, row.variant_id)
            if var is not None and var.verified and var.learner_id == learner_id:
                variant_ok = row.variant_id
        return RetryResponse(
            missed_id=row.id, item_id=row.item_id, node_id=row.node_id,
            node_title=node.title if node else row.node_id,
            stem=row.stem_snapshot or (item.stem if item else ""),
            grader=grader, choices=choices, variant_id=variant_ok,
            submit_via="/v3/attempt",
            note="answer this again; a correct attempt clears it from your review queue",
        )
