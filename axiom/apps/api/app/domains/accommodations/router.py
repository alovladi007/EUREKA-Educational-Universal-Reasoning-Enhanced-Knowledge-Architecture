"""Accommodations routes.

A learner reads and sets their own accommodations; a teacher/admin can set a
specific student's (extra time is an official accommodation a teacher grants).
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.accommodations.service import get_accommodations, set_accommodations

router = APIRouter(prefix="/accommodations", tags=["accommodations"])

teacher_only = require_roles("teacher", "org_admin", "super_admin")


class AccommodationBody(BaseModel):
    extra_time_multiplier: float | None = None
    text_to_speech: bool | None = None
    high_contrast: bool | None = None
    reduced_motion: bool | None = None


@router.get("/me", summary="My accommodations")
async def my_accommodations(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await get_accommodations(session, uuid.UUID(user.id))


@router.put("/me", summary="Set my accommodations")
async def update_my_accommodations(
    body: AccommodationBody,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await set_accommodations(
        session,
        uuid.UUID(user.id),
        extra_time_multiplier=body.extra_time_multiplier,
        text_to_speech=body.text_to_speech,
        high_contrast=body.high_contrast,
        reduced_motion=body.reduced_motion,
    )
    await session.commit()
    return result


@router.put("/users/{user_id}", summary="Set a student's accommodations (teacher)")
async def set_student_accommodations(
    user_id: uuid.UUID,
    body: AccommodationBody,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    result = await set_accommodations(
        session,
        user_id,
        extra_time_multiplier=body.extra_time_multiplier,
        text_to_speech=body.text_to_speech,
        high_contrast=body.high_contrast,
        reduced_motion=body.reduced_motion,
    )
    await session.commit()
    return result
