"""
Recommendation endpoint (Phase 4 Session 4.4).

  GET /recommendations/me?limit=N

Returns up to N skills the learner should work on next, with per-signal
score breakdown so the UI can show "why this".
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.services.recommender import recommend
from app.utils.dependencies import get_current_user

router = APIRouter()


@router.get("/recommendations/me", response_model=list[dict])
async def my_recommendations(
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    recs = await recommend(db, current_user, limit=limit)
    return [r.to_dict() for r in recs]
