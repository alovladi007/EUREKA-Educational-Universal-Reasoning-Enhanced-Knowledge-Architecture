"""Exam endpoints.

What is absent from this router is the design. There is no hint route, and no
response carries a grade, a correct answer or a misconception until the
attempt is submitted. Those are not omissions to fill in later; an exam that
hands back feedback per item is a practice session with a timer on it.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import Principal, get_current_principal
from app.domains.exams import blueprints as bp
from app.domains.exams import service
from app.domains.exams.assembly import check_feasible
from app.domains.exams.models import ExamAttempt

router = APIRouter()


class StartIn(BaseModel):
    blueprint_code: str = Field(max_length=80)


class AnswerIn(BaseModel):
    position: int = Field(ge=1)
    answer: str = Field(default="", max_length=4000)


def _attempt_view(attempt: ExamAttempt) -> dict:
    """The learner's view of an open attempt.

    Carries the form and the clock. It cannot carry a score because an open
    attempt has none: result is null until submission.
    """
    return {
        "attempt_id": str(attempt.id),
        "blueprint_code": attempt.blueprint_code,
        "status": attempt.status,
        "seconds_remaining": service.remaining_seconds(attempt),
        "items": [
            {
                "position": i["position"],
                "section_id": i["section_id"],
                "prompt": i["prompt"],
                "grader": i["grader"],
                "meta": i["meta"],
            }
            for i in attempt.form["items"]
        ],
        "notes": attempt.form.get("notes", []),
        "hints_available": False,
        "feedback_policy": (
            "Nothing is graded until you submit. No answer is marked right or "
            "wrong while the exam is open, and hints are not available during "
            "an exam."
        ),
    }


@router.get("/exams")
async def list_exams(_p: Principal = Depends(get_current_principal)) -> dict:
    """The catalogue.

    Only exams the item bank can actually build appear, and each reports
    whether it is currently assemblable so a broken one would be visible
    rather than failing at start time.
    """
    return {
        "exams": [
            {
                "code": b.code,
                "title": b.title,
                "description": b.description,
                "scope": b.scope,
                "items": b.total_items,
                "minutes": b.total_minutes,
                "sections": [
                    {"id": s.id, "title": s.title, "items": s.items, "minutes": s.minutes}
                    for s in b.sections
                ],
                "basis": b.basis,
                "review": b.review,
                "available": not check_feasible(b),
            }
            for b in bp.BLUEPRINTS.values()
        ],
        "note": (
            "These blueprints are derived from this platform's own curriculum. "
            "None claims alignment with an external examination."
        ),
    }


@router.post("/exams/attempts")
async def start(
    payload: StartIn,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        attempt = await service.start_attempt(session, principal.user_id, payload.blueprint_code)
    except service.ExamError as exc:
        raise HTTPException(409, str(exc)) from exc
    await session.commit()
    return _attempt_view(attempt)


@router.get("/exams/attempts/{attempt_id}")
async def read(
    attempt_id: uuid.UUID,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    attempt = await session.get(ExamAttempt, attempt_id)
    if attempt is None or attempt.user_id != principal.user_id:
        raise HTTPException(404, "That attempt was not found.")
    view = _attempt_view(attempt)
    if attempt.status == "submitted":
        view["result"] = attempt.result
    return view


@router.post("/exams/attempts/{attempt_id}/answer")
async def answer(
    attempt_id: uuid.UUID,
    payload: AnswerIn,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        result = await service.save_answer(
            session, principal.user_id, attempt_id, payload.position, payload.answer
        )
    except service.ExamError as exc:
        raise HTTPException(409, str(exc)) from exc
    await session.commit()
    return result


@router.post("/exams/attempts/{attempt_id}/submit")
async def submit(
    attempt_id: uuid.UUID,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        result = await service.submit_attempt(session, principal.user_id, attempt_id)
    except service.ExamError as exc:
        raise HTTPException(409, str(exc)) from exc
    await session.commit()
    return result
