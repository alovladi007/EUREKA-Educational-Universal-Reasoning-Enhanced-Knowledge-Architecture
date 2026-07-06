"""Teacher moderation of AI grades.

AI grading of free-response work is always human-overridable. override_grade
records a teacher's decision as the grade of record (updating the Score) while
leaving the original AI grade in the GradingRecord and ReasoningTrace for the
audit trail. list_free_response_grades gives a teacher the queue of AI-graded
free responses, showing the AI grade, its confidence, and any override.
"""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domains.assessment.models import Item
from app.domains.attempts.models import (
    GradeOverride,
    GradingRecord,
    ReasoningTrace,
    Response,
    Score,
)
from app.domains.identity.models import User
from app.domains.notifications.service import notify

_PROMPT_PREVIEW = 140

# Item kinds whose grades go to the teacher review queue: AI-graded free
# responses, and the proof kinds that are either AI-assisted (free_form_proof)
# or could not be machine-verified (formal_proof pending). Deterministic graders
# never need review.
REVIEW_KINDS = ("free_response", "free_form_proof", "formal_proof")


async def override_grade(
    session: AsyncSession,
    response_id: uuid.UUID,
    *,
    score: float,
    is_correct: bool,
    note: str,
    teacher_id: uuid.UUID,
) -> dict:
    """Record a teacher's override as the grade of record for one response."""
    score_row = (
        await session.execute(select(Score).where(Score.response_id == response_id))
    ).scalar_one_or_none()
    if score_row is None:
        return {"error": "no grade to override for this response"}

    ai_score = score_row.score
    ai_is_correct = score_row.is_correct

    override = (
        await session.execute(
            select(GradeOverride).where(GradeOverride.response_id == response_id)
        )
    ).scalar_one_or_none()
    if override is None:
        override = GradeOverride(response_id=response_id)
        session.add(override)
    override.score = score
    override.is_correct = is_correct
    override.note = note
    override.overridden_by = teacher_id

    # The override becomes the grade of record.
    score_row.score = score
    score_row.is_correct = is_correct

    session.add(
        ReasoningTrace(
            subject_type="grading",
            subject_id=response_id,
            kind="human_override",
            content={
                "ai_score": ai_score,
                "ai_is_correct": ai_is_correct,
                "override_score": score,
                "override_is_correct": is_correct,
                "note": note,
            },
        )
    )

    # Let the student know their response was reviewed by a teacher.
    response = (
        await session.execute(select(Response).where(Response.id == response_id))
    ).scalar_one_or_none()
    if response is not None:
        await notify(
            session,
            response.user_id,
            "grade",
            "Your response was reviewed",
            f"A teacher set your score to {score}.",
            link="/practice",
        )

    await session.flush()
    return {
        "response_id": str(response_id),
        "score": score,
        "is_correct": is_correct,
        "note": note,
        "overrode_ai_score": ai_score,
    }


async def list_free_response_grades(session: AsyncSession, limit: int = 100) -> list[dict]:
    """The queue of AI-graded free responses with any teacher override."""
    rows = (
        await session.execute(
            select(Response, Score, Item, User, GradingRecord, GradeOverride)
            .join(Score, Score.response_id == Response.id)
            .join(Item, Item.id == Response.item_id)
            .join(User, User.id == Response.user_id)
            .outerjoin(GradingRecord, GradingRecord.response_id == Response.id)
            .outerjoin(GradeOverride, GradeOverride.response_id == Response.id)
            .where(Item.kind.in_(REVIEW_KINDS))
            .order_by(Response.submitted_at.desc())
            .limit(limit)
        )
    ).all()

    out: list[dict] = []
    for response, score, item, user, grading, override in rows:
        answer_text = ""
        if isinstance(response.answer, dict):
            answer_text = str(response.answer.get("raw", ""))
        out.append(
            {
                "response_id": str(response.id),
                "student": user.display_name or "Learner",
                "prompt": (item.prompt or "")[:_PROMPT_PREVIEW],
                "answer": answer_text,
                "ai_score": round(score.score, 4),
                "ai_is_correct": score.is_correct,
                "confidence": round(grading.confidence, 3) if grading is not None else None,
                "overridden": override is not None,
                "override_score": override.score if override is not None else None,
                "override_note": override.note if override is not None else "",
            }
        )
    return out
