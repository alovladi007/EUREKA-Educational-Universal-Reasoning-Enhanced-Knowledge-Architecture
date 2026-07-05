"""Mastery and learning-path routes."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.adaptive.calibration import calibrate_all
from app.domains.adaptive.cat_service import answer_cat, get_cat, start_cat
from app.domains.adaptive.service import list_evidence, list_mastery, plan_path
from app.domains.curriculum.models import KnowledgeNode

router = APIRouter(tags=["adaptive"])


class CatAnswer(BaseModel):
    answer: str


@router.get("/mastery/me", summary="My mastery across the skill graph")
async def my_mastery(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    states = await list_mastery(session, uuid.UUID(user.id))
    return {"states": states}


@router.get("/mastery/me/evidence/{node_ref}", summary="The evidence behind a mastery value")
async def my_evidence(
    node_ref: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == node_ref))
    ).scalar_one_or_none()
    node_id = node.id if node else None
    if node_id is None:
        try:
            node_id = uuid.UUID(node_ref)
        except ValueError as exc:
            raise HTTPException(status_code=404, detail="node not found") from exc
    events = await list_evidence(session, uuid.UUID(user.id), node_id)
    return {"node_id": str(node_id), "events": events}


@router.get("/learning-path/me", summary="My prerequisite-aware path")
async def my_path(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await plan_path(session, uuid.UUID(user.id))
    await session.commit()
    return result


@router.post("/cat/start", summary="Start a computerized adaptive test")
async def cat_start(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    r = await start_cat(session, uuid.UUID(user.id))
    await session.commit()
    return r


@router.post("/cat/{session_id}/answer", summary="Answer the pending CAT item")
async def cat_answer(
    session_id: str,
    body: CatAnswer,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    r = await answer_cat(session, uuid.UUID(session_id), body.answer)
    await session.commit()
    return r


@router.get("/cat/{session_id}", summary="Current CAT session state")
async def cat_state(
    session_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await get_cat(session, uuid.UUID(session_id))


@router.post("/calibration/run", summary="Calibrate item banks from response data")
async def calibration_run(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(require_roles("teacher", "org_admin", "super_admin", "author")),
) -> dict:
    r = await calibrate_all(session)
    await session.commit()
    return r
