"""Gamification routes: the learner's own profile and the leaderboard.

Both endpoints are read-only, so they do not commit. Writes to the game profile
happen inside the practice flow, which owns that transaction.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.gamification.service import get_profile, leaderboard

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/me", summary="My XP, level, streak, and badges")
async def my_profile(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return await get_profile(session, uuid.UUID(user.id))


@router.get("/leaderboard", summary="Top learners by total XP")
async def top_learners(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return {"leaderboard": await leaderboard(session)}
