"""Test-prep exam attempts — durable history for client-side practice exams.

The test-prep FE (/dashboard/test-prep/[exam]) scores full exams client-side
and used to persist history only to localStorage, so it was lost on a browser
clear and never synced across devices. These endpoints persist a per-exam
summary to the user_exam_attempts table (see ops/db/23_exam_attempts.sql).

text() queries on purpose: the table is small + owned by this feature, so we
read/write it without registering a parallel ORM model.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/exam-attempts", tags=["exam-attempts"])


class ExamAttemptIn(BaseModel):
    exam_type: str = Field(..., max_length=50)
    score_percent: float = 0
    passed: bool = False
    correct_count: int = 0
    total_questions: int = 0
    time_spent_seconds: Optional[int] = None
    by_topic: Optional[dict] = None


def _row_to_dict(r) -> dict:
    return {
        "id": str(r["id"]),
        "exam_type": r["exam_type"],
        "score_percent": float(r["score_percent"]) if r["score_percent"] is not None else 0.0,
        "passed": bool(r["passed"]),
        "correct_count": r["correct_count"] or 0,
        "total_questions": r["total_questions"] or 0,
        "time_spent_seconds": r["time_spent_seconds"],
        "by_topic": r["by_topic"],
        "created_at": r["created_at"].isoformat() if r["created_at"] else None,
    }


@router.post("", status_code=201)
async def record_exam_attempt(
    body: ExamAttemptIn,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Persist a completed exam summary for the caller."""
    import json

    row = (
        await db.execute(
            text(
                "INSERT INTO user_exam_attempts "
                "(user_id, exam_type, score_percent, passed, correct_count, "
                " total_questions, time_spent_seconds, by_topic) "
                "VALUES (:uid, :et, :sp, :passed, :cc, :tq, :ts, "
                "        CAST(:bt AS jsonb)) "
                "RETURNING id, exam_type, score_percent, passed, correct_count, "
                "          total_questions, time_spent_seconds, by_topic, created_at"
            ),
            {
                "uid": current_user.id,
                "et": body.exam_type,
                "sp": body.score_percent,
                "passed": body.passed,
                "cc": body.correct_count,
                "tq": body.total_questions,
                "ts": body.time_spent_seconds,
                "bt": json.dumps(body.by_topic) if body.by_topic is not None else None,
            },
        )
    ).mappings().first()
    await db.commit()
    return _row_to_dict(row)


@router.get("/me")
async def list_my_exam_attempts(
    exam_type: Optional[str] = Query(None, max_length=50),
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List the caller's exam attempts, newest first (optionally per exam)."""
    sql = (
        "SELECT id, exam_type, score_percent, passed, correct_count, "
        "       total_questions, time_spent_seconds, by_topic, created_at "
        "FROM user_exam_attempts WHERE user_id = :uid"
    )
    params: dict = {"uid": current_user.id, "limit": limit}
    if exam_type:
        sql += " AND exam_type = :et"
        params["et"] = exam_type
    sql += " ORDER BY created_at DESC LIMIT :limit"

    rows = (await db.execute(text(sql), params)).mappings().all()
    return [_row_to_dict(r) for r in rows]
