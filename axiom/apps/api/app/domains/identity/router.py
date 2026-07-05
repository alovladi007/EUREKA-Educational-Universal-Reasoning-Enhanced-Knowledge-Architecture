"""Identity routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from shared_schemas.identity import UserOut

from app.core.security import get_current_user

router = APIRouter(prefix="/me", tags=["identity"])


@router.get("", response_model=UserOut, summary="The signed-in user")
async def read_me(user: UserOut = Depends(get_current_user)) -> UserOut:
    """Return the AXIOM user synced from the verified EUREKA token."""
    return user
