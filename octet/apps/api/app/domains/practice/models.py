"""Practice persistence: sessions, responses, and per-node mastery.

Until Phase 5b, practice was stateless by design: the sandbox graded a
submission and the result went to the client and nowhere else. That was the
right first shape for the grading engine and the wrong final shape for a
learning product, because everything a serious prep tool offers on top of
items — analytics, weakest topics, review your mistakes, visible progress —
is a view over attempts, and there were no attempts to view.

Three tables:

  practice_sessions   one configured sitting: which units, how many items,
                      tutor or timed. The issued items are snapshotted on the
                      session exactly as served, the same discipline the exam
                      engine uses, so grading is against what the learner saw.
  practice_responses  one graded answer to one item. Unlike exam responses
                      these carry the grade, because practice feedback is
                      immediate (tutor) or at session end (timed), not
                      deferred to a formal submission step.
  node_mastery        one row per learner per node: attempts, correct, streak,
                      and an exponentially weighted accuracy. This is
                      accuracy, and it is named accuracy. It is not an IRT
                      ability estimate and nothing downstream may present it
                      as one.

Sessions have the same two-state lifecycle as exams: in_progress and
submitted, forward only.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

STATUS_IN_PROGRESS = "in_progress"
STATUS_SUBMITTED = "submitted"

MODE_TUTOR = "tutor"
MODE_TIMED = "timed"
MODES = (MODE_TUTOR, MODE_TIMED)


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    mode: Mapped[str] = mapped_column(String(10), nullable=False, default=MODE_TUTOR)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=STATUS_IN_PROGRESS)

    # What the learner asked for, kept for the history view.
    config: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # The issued items, exactly as served: position, template_id, seed, node,
    # unit, prompt, grader, public meta. Keys are re-derived at grading time
    # from (template_id, seed), so no answer key is stored here.
    items: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    # Written at submission: correct, total, per-unit rollup.
    summary: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    __table_args__ = (Index("ix_practice_sessions_user_status", "user_id", "status"),)


class PracticeResponse(Base):
    __tablename__ = "practice_responses"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("practice_sessions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # Denormalized so analytics never joins through the session JSON.
    user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    node_code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    template_id: Mapped[str] = mapped_column(String(80), nullable=False)

    position: Mapped[int] = mapped_column(Integer, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False, default="")
    is_correct: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    graded: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    misconception: Mapped[str | None] = mapped_column(String(64), nullable=True)
    seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    flagged: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint("session_id", "position", name="uq_practice_response_position"),
        Index("ix_practice_responses_user_node", "user_id", "node_code"),
    )


class NodeMastery(Base):
    """Per learner, per node. Updated on every graded practice response.

    ewma is an exponentially weighted accuracy with alpha 0.3: recent attempts
    dominate, so recovering from early misses is visible quickly. The Learn
    page state derives from this:

      mastered     ewma >= 0.85 and attempts >= 4
      needs review ewma <  0.5  and attempts >= 2
      in progress  any attempts at all
      ready        no attempts

    Thresholds are product choices, not psychometrics, and they live in one
    place (mastery_state below) so the claim and the computation cannot
    drift apart.
    """

    __tablename__ = "node_mastery"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    node_code: Mapped[str] = mapped_column(String(64), nullable=False)

    attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    correct: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    ewma: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    last_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "node_code", name="uq_node_mastery_user_node"),
    )


EWMA_ALPHA = 0.3


def update_mastery(row: NodeMastery, is_correct: bool) -> None:
    """Fold one graded attempt into the running record."""
    row.attempts += 1
    if is_correct:
        row.correct += 1
        row.streak += 1
    else:
        row.streak = 0
    outcome = 1.0 if is_correct else 0.0
    row.ewma = outcome if row.attempts == 1 else (
        EWMA_ALPHA * outcome + (1 - EWMA_ALPHA) * row.ewma
    )


def mastery_state(attempts: int, ewma: float) -> str:
    if attempts == 0:
        return "ready"
    if ewma >= 0.85 and attempts >= 4:
        return "mastered"
    if ewma < 0.5 and attempts >= 2:
        return "needs_review"
    return "in_progress"
