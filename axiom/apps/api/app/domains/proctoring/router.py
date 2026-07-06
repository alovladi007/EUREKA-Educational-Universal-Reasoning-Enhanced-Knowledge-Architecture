"""Proctoring routes.

Student side (any signed-in user, for their own session): start a secure-exam
session, report integrity events, and end it. Teacher side (teaching roles): a
review queue of flagged sessions and the full event timeline for one session.

Nothing here accuses anyone. The anomaly score exists to route a human's
attention; the decision is always the reviewer's.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.proctoring import service as svc

router = APIRouter(prefix="/proctoring", tags=["proctoring"])

reviewer_only = require_roles("teacher", "org_admin", "super_admin", "author")


class StartSession(BaseModel):
    assessment_id: str | None = None
    attempt_id: str | None = None
    policy: dict | None = None


class EventBody(BaseModel):
    kind: str
    detail: str = ""


def _maybe_uuid(value: str | None) -> uuid.UUID | None:
    if not value:
        return None
    try:
        return uuid.UUID(value)
    except ValueError:
        return None


@router.post("/sessions", summary="Start a proctoring session (student)")
async def start(
    body: StartSession,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    proctor = await svc.start_session(
        session,
        uuid.UUID(user.id),
        assessment_id=_maybe_uuid(body.assessment_id),
        attempt_id=_maybe_uuid(body.attempt_id),
        policy=body.policy,
    )
    await session.commit()
    return {"session_id": str(proctor.id), "status": proctor.status}


@router.post("/sessions/{session_id}/events", summary="Report an integrity event (student)")
async def report_event(
    session_id: str,
    body: EventBody,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    proctor_id = _maybe_uuid(session_id)
    if proctor_id is None:
        raise HTTPException(status_code=400, detail="invalid session id")
    result = await svc.record_event(
        session, proctor_id, uuid.UUID(user.id), kind=body.kind, detail=body.detail
    )
    if result is None:
        raise HTTPException(status_code=404, detail="session not found or not active")
    await session.commit()
    return result


@router.post("/sessions/{session_id}/end", summary="End a proctoring session (student)")
async def end(
    session_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    proctor_id = _maybe_uuid(session_id)
    if proctor_id is None:
        raise HTTPException(status_code=400, detail="invalid session id")
    result = await svc.end_session(session, proctor_id, uuid.UUID(user.id))
    if result is None:
        raise HTTPException(status_code=404, detail="session not found")
    await session.commit()
    return result


@router.get("/review", summary="Flagged proctoring sessions for review (teacher)")
async def review(
    session: AsyncSession = Depends(get_session),
    reviewer: UserOut = Depends(reviewer_only),
) -> dict:
    return {"sessions": await svc.review_queue(session)}


@router.get("/sessions/{session_id}", summary="A proctoring session's event timeline (teacher)")
async def detail(
    session_id: str,
    session: AsyncSession = Depends(get_session),
    reviewer: UserOut = Depends(reviewer_only),
) -> dict:
    proctor_id = _maybe_uuid(session_id)
    if proctor_id is None:
        raise HTTPException(status_code=400, detail="invalid session id")
    result = await svc.session_detail(session, proctor_id)
    if result is None:
        raise HTTPException(status_code=404, detail="session not found")
    return result
