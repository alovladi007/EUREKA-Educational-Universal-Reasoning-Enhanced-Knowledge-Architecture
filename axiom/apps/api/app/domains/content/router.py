"""Content routes: the lesson for a knowledge node."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.content.models import Lesson
from app.domains.curriculum.models import KnowledgeNode

router = APIRouter(prefix="/content", tags=["content"])


async def _resolve_node_id(session: AsyncSession, node_ref: str) -> uuid.UUID | None:
    node = (
        await session.execute(select(KnowledgeNode).where(KnowledgeNode.code == node_ref))
    ).scalar_one_or_none()
    if node is not None:
        return node.id
    try:
        return uuid.UUID(node_ref)
    except ValueError:
        return None


@router.get("/nodes/{node_ref}/lesson", summary="Lesson for a node")
async def lesson_for_node(
    node_ref: str,
    session: AsyncSession = Depends(get_session),
    _: UserOut = Depends(get_current_user),
) -> dict:
    node_id = await _resolve_node_id(session, node_ref)
    if node_id is None:
        raise HTTPException(status_code=404, detail="node not found")
    lesson = (
        await session.execute(
            select(Lesson).where(Lesson.node_id == node_id).options(selectinload(Lesson.steps))
        )
    ).scalar_one_or_none()
    if lesson is None:
        raise HTTPException(status_code=404, detail="no lesson for this node yet")
    return {
        "node_id": str(node_id),
        "title": lesson.title,
        "summary": lesson.summary,
        "steps": [
            {"position": s.position, "kind": s.kind, "title": s.title, "body": s.body}
            for s in lesson.steps
        ],
    }
