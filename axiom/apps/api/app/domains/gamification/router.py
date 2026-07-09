"""Gamification routes: the learner's own profile and the leaderboard.

Both endpoints are read-only, so they do not commit. Writes to the game profile
happen inside the practice flow, which owns that transaction.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.gamification.service import (
    get_profile,
    leaderboard,
    list_quests,
    set_preferences,
)

router = APIRouter(prefix="/gamification", tags=["gamification"])


class PreferencesBody(BaseModel):
    leaderboard_opt_in: bool | None = None
    display_alias: str | None = None
    avatar: str | None = None


@router.get("/me", summary="My XP, level, streak, and badges")
async def my_profile(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await get_profile(session, uuid.UUID(user.id))


@router.get("/leaderboard", summary="Top opted-in learners by total XP")
async def top_learners(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return {"leaderboard": await leaderboard(session)}


@router.get("/quests", summary="My quests and their completion status")
async def my_quests(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return {"quests": await list_quests(session, uuid.UUID(user.id))}


@router.put("/preferences", summary="Set leaderboard opt-in, alias, and avatar")
async def update_preferences(
    body: PreferencesBody,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    result = await set_preferences(
        session,
        uuid.UUID(user.id),
        leaderboard_opt_in=body.leaderboard_opt_in,
        display_alias=body.display_alias,
        avatar=body.avatar,
    )
    await session.commit()
    return result
