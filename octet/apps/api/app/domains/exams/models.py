"""Exam attempt persistence.

Three design decisions worth stating, because each one is the difference
between a timed exam and a page with a countdown on it.

The form is snapshotted at start. `form` holds the exact items the learner was
issued, prompts and all. It is not reassembled on each request. Reassembly
would be deterministic today, but it would also mean the item set depends on
the state of the template registry at read time, so deploying a template
change mid-exam would silently change the paper under a learner who had
already answered half of it.

Timing is server authoritative. `expires_at` is computed once from the
blueprint when the attempt opens, and every subsequent request is judged
against the server clock. A client clock is not a clock; it is a number the
client controls.

Responses are stored without a grade. Nothing is graded until submission, so
there is no field here to leak. That is what makes withholding feedback during
the exam a property of the schema rather than a discipline the UI has to keep.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

# Attempt lifecycle. Forward only.
STATUS_IN_PROGRESS = "in_progress"
STATUS_SUBMITTED = "submitted"
STATUS_EXPIRED = "expired"
STATUSES = (STATUS_IN_PROGRESS, STATUS_SUBMITTED, STATUS_EXPIRED)


class ExamAttempt(Base):
    """One learner's sitting of one blueprint."""

    __tablename__ = "exam_attempts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    # EUREKA owns identity, so this is the subject claim from the token and
    # not a foreign key into a users table OCTET does not have.
    user_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    blueprint_code: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default=STATUS_IN_PROGRESS)

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # The issued form, exactly as served. See the module docstring.
    form: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)

    # Written at submission. Null while the attempt is open, which is also the
    # reason an open attempt cannot leak a score.
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    __table_args__ = (
        Index("ix_exam_attempts_user_status", "user_id", "status"),
    )


class ExamResponse(Base):
    """One answer to one item on one attempt.

    Carries no grade and no correctness. Grading happens at submission, in the
    sandbox, against the stored key of the issued variant.
    """

    __tablename__ = "exam_responses"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    attempt_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("exam_attempts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False, default="")
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        # One answer per item. Changing an answer updates the row rather than
        # appending, so the attempt cannot accumulate two answers to one item
        # and leave scoring to pick.
        UniqueConstraint("attempt_id", "position", name="uq_exam_response_attempt_position"),
    )
