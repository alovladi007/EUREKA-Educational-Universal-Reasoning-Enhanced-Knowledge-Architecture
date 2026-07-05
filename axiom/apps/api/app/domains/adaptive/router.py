"""Mastery and learning-path routes."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.adaptive.service import list_evidence, list_mastery, plan_path
from app.domains.curriculum.models import KnowledgeNode

router = APIRouter(tags=["adaptive"])


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
