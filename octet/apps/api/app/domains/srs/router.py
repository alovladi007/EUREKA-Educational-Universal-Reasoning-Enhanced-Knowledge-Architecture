"""Spaced review endpoints.

Three routes, mirroring the practice router's shape: the queue to work
through, the review call that records one graded recall, and a stats rollup.
Every controlled refusal from the service surfaces as a 409 with the
learner-readable reason, the same contract PracticeError carries.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import Principal, get_current_principal
from app.domains.srs import service as svc

router = APIRouter()


class ReviewIn(BaseModel):
    card_id: str = Field(min_length=1, max_length=128)
    grade: int = Field(ge=0, le=5)


def _refuse(exc: svc.SrsError) -> HTTPException:
    return HTTPException(409, str(exc))


@router.get("/srs/queue")
async def srs_queue(
    limit: int = Query(20, ge=1, le=100),
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    return await svc.queue(session, principal.user_id, limit=limit)


@router.post("/srs/review")
async def srs_review(
    payload: ReviewIn,
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    try:
        result = await svc.review(
            session,
            principal.user_id,
            card_id=payload.card_id,
            grade=payload.grade,
        )
    except svc.SrsError as exc:
        raise _refuse(exc) from exc
    await session.commit()
    return result


@router.get("/srs/stats")
async def srs_stats(
    principal: Principal = Depends(get_current_principal),
    session: AsyncSession = Depends(get_session),
) -> dict:
    return await svc.stats(session, principal.user_id)
