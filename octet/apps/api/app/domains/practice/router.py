"""Practice session and analytics endpoints.

The analytics here are views over recorded attempts and nothing more. Every
number is a count or a ratio of this learner's own responses; there are no
percentiles against other users (the honest reason: with no user base yet, a
percentile would be a comparison against nobody, presented as a cohort) and
no predicted scores.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import Principal, get_current_principal
from app.data.curriculum import COURSES, NODES_BY_CODE, UNITS
from app.domains.exams.models import ExamAttempt
from app.domains.practice import sessions as svc
from app.domains.practice.models import (
    NodeMastery,
    PracticeResponse,
    PracticeSession,
    mastery_state,
)

router = APIRouter()


class StartIn(BaseModel):
    units: list[str] = Field(min_length=1, max_length=40)
    count: int = Field(ge=1, le=40, default=10)
    mode: str = Field(default="tutor", pattern="^(tutor|timed)$")


class AnswerIn(BaseModel):
    position: int = Field(ge=1)
    answer: str = Field(default="", max_length=4000)
    seconds: int = Field(ge=0, le=36000, default=0)
    flagged: bool = False


def _refuse(exc: svc.PracticeError) -> HTTPException:
    return HTTPException(409, str(exc))


@router.get("/practice/catalogue")
async def practice_catalogue(_p: Principal = Depends(get_current_principal)) -> dict:
    return {"units": svc.catalogue()}


@router.post("/practice/sessions")
async def start(
    payload: StartIn,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        row = await svc.start_session(
            session,
            principal.user_id,
            unit_ids=payload.units,
            count=payload.count,
            mode=payload.mode,
        )
    except svc.PracticeError as exc:
        raise _refuse(exc) from exc
    await session.commit()
    return {
        "session_id": str(row.id),
        "mode": row.mode,
        "items": row.items["items"],
    }


@router.post("/practice/sessions/{session_id}/answer")
async def answer(
    session_id: uuid.UUID,
    payload: AnswerIn,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        result = await svc.answer(
            session,
            principal.user_id,
            session_id,
            position=payload.position,
            submitted=payload.answer,
            seconds=payload.seconds,
            flagged=payload.flagged,
        )
    except svc.PracticeError as exc:
        raise _refuse(exc) from exc
    await session.commit()
    return result


@router.post("/practice/sessions/{session_id}/finish")
async def finish(
    session_id: uuid.UUID,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        summary = await svc.finish(session, principal.user_id, session_id)
    except svc.PracticeError as exc:
        raise _refuse(exc) from exc
    await session.commit()
    return {"session_id": str(session_id), "summary": summary}


@router.get("/practice/sessions/{session_id}/review")
async def review(
    session_id: uuid.UUID,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        return await svc.review(session, principal.user_id, session_id)
    except svc.PracticeError as exc:
        raise _refuse(exc) from exc


@router.get("/practice/sessions")
async def history(
    limit: int = Query(10, ge=1, le=50),
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    rows = (
        await session.scalars(
            select(PracticeSession)
            .where(PracticeSession.user_id == principal.user_id)
            .order_by(desc(PracticeSession.started_at))
            .limit(limit)
        )
    ).all()
    return {
        "sessions": [
            {
                "session_id": str(r.id),
                "mode": r.mode,
                "status": r.status,
                "started_at": r.started_at.isoformat() if r.started_at else None,
                "config": r.config,
                "summary": r.summary,
                "item_count": len(r.items.get("items", [])),
            }
            for r in rows
        ]
    }


@router.get("/analytics/overview")
async def analytics_overview(
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """This learner's own record: totals, per course and unit, weakest nodes.

    Sourced entirely from persisted responses and mastery rows. A fresh
    account gets zeros, not placeholders.
    """
    user = principal.user_id

    totals = (
        await session.execute(
            select(
                func.count(PracticeResponse.id),
                func.coalesce(func.sum(PracticeResponse.is_correct), 0),
            ).where(PracticeResponse.user_id == user, PracticeResponse.graded == 1)
        )
    ).one()
    attempts, correct = int(totals[0]), int(totals[1])

    per_node = (
        await session.execute(
            select(
                PracticeResponse.node_code,
                func.count(PracticeResponse.id),
                func.coalesce(func.sum(PracticeResponse.is_correct), 0),
            )
            .where(PracticeResponse.user_id == user, PracticeResponse.graded == 1)
            .group_by(PracticeResponse.node_code)
        )
    ).all()

    by_unit: dict[str, dict] = {}
    by_course: dict[str, dict] = {}
    weakest: list[dict] = []
    for code, n, c in per_node:
        node = NODES_BY_CODE.get(code)
        if node is None:
            continue
        for scope, key in ((by_unit, node.unit), (by_course, node.course)):
            slot = scope.setdefault(key, {"attempts": 0, "correct": 0})
            slot["attempts"] += int(n)
            slot["correct"] += int(c)
        if int(n) >= 2:
            weakest.append(
                {
                    "node": code,
                    "title": node.title,
                    "unit": node.unit,
                    "attempts": int(n),
                    "correct": int(c),
                    "accuracy": round(int(c) / int(n), 3),
                }
            )
    weakest.sort(key=lambda w: (w["accuracy"], -w["attempts"]))

    mastery_rows = (
        await session.scalars(
            select(NodeMastery).where(NodeMastery.user_id == user)
        )
    ).all()
    states: dict[str, int] = {}
    for m in mastery_rows:
        states[mastery_state(m.attempts, m.ewma)] = (
            states.get(mastery_state(m.attempts, m.ewma), 0) + 1
        )

    exams = (
        await session.scalars(
            select(ExamAttempt)
            .where(ExamAttempt.user_id == user, ExamAttempt.status == "submitted")
            .order_by(desc(ExamAttempt.submitted_at))
            .limit(5)
        )
    ).all()

    unit_titles = {u.id: u.title for u in UNITS}
    course_titles = {c.id: c.title for c in COURSES}

    def rollup(scope: dict[str, dict], titles: dict[str, str]) -> list[dict]:
        return sorted(
            (
                {
                    "id": key,
                    "title": titles.get(key, key),
                    "attempts": v["attempts"],
                    "correct": v["correct"],
                    "accuracy": round(v["correct"] / v["attempts"], 3) if v["attempts"] else 0.0,
                }
                for key, v in scope.items()
            ),
            key=lambda r: r["id"],
        )

    return {
        "totals": {
            "attempts": attempts,
            "correct": correct,
            "accuracy": round(correct / attempts, 3) if attempts else 0.0,
        },
        "by_course": rollup(by_course, course_titles),
        "by_unit": rollup(by_unit, unit_titles),
        "weakest_nodes": weakest[:8],
        "mastery_states": states,
        "recent_exams": [
            {
                "attempt_id": str(e.id),
                "blueprint_code": e.blueprint_code,
                "submitted_at": e.submitted_at.isoformat() if e.submitted_at else None,
                "result": {
                    k: e.result.get(k)
                    for k in ("correct", "total", "fraction")
                    if isinstance(e.result, dict) and k in e.result
                }
                if e.result
                else None,
            }
            for e in exams
        ],
        "note": (
            "Every figure is this account's own recorded attempts. There are "
            "no cohort percentiles because there is no cohort to compare "
            "against, and none will be shown until there is."
        ),
    }


@router.get("/analytics/mastery")
async def analytics_mastery(
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    """Per-node mastery for the Learn page state chips."""
    rows = (
        await session.scalars(
            select(NodeMastery).where(NodeMastery.user_id == principal.user_id)
        )
    ).all()
    return {
        "nodes": {
            m.node_code: {
                "attempts": m.attempts,
                "correct": m.correct,
                "streak": m.streak,
                "accuracy_ewma": round(m.ewma, 3),
                "state": mastery_state(m.attempts, m.ewma),
            }
            for m in rows
        }
    }
