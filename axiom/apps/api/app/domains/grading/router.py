"""Grading moderation routes: review and override AI grades (teacher)."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import require_roles
from app.domains.grading import moderation

router = APIRouter(prefix="/grading", tags=["grading"])

teacher_only = require_roles("teacher", "org_admin", "super_admin", "author")


class OverrideRequest(BaseModel):
    score: float
    is_correct: bool
    note: str = ""


@router.get("/free-response/review", summary="AI-graded free responses to review (teacher)")
async def review_queue(
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    items = await moderation.list_free_response_grades(session)
    return {"items": items}


@router.post("/{response_id}/override", summary="Override an AI grade (teacher)")
async def override(
    response_id: str,
    body: OverrideRequest,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    result = await moderation.override_grade(
        session,
        uuid.UUID(response_id),
        score=body.score,
        is_correct=body.is_correct,
        note=body.note,
        teacher_id=uuid.UUID(teacher.id),
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    await session.commit()
    return result
