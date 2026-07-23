"""
Server-side entitlement checks (WS5).

`has_exam_access` is the single access rule shared by every gated endpoint;
`require_exam_access(exam_code)` is the FastAPI dependency form. The client
mirrors this via GET /me/entitlements for UX, but endpoints serving or
recording paid-tier data must depend on this — never trust the client gate.
"""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import User
from app.models.billing import Entitlement
from app.utils.dependencies import get_current_active_user


async def has_exam_access(db: AsyncSession, user: User, exam_code: str) -> bool:
    """True if the user holds an active, unexpired entitlement for the exam."""
    row = (
        await db.execute(
            select(Entitlement).where(
                Entitlement.user_id == user.id,
                Entitlement.exam_code == exam_code,
                Entitlement.status == "active",
            )
        )
    ).scalar_one_or_none()
    if row is None:
        return False
    if row.expires_at is not None and row.expires_at < datetime.now(timezone.utc):
        return False
    return True


def require_exam_access(exam_code: str):
    """Dependency factory: 402 Payment Required when the entitlement is absent.

    402 (not 403) so clients can distinguish "buy this" from "forbidden";
    the payload names the exam so the paywall card can deep-link checkout.
    """

    async def checker(
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db),
    ) -> User:
        if not await has_exam_access(db, current_user, exam_code):
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "message": f"An active {exam_code} entitlement is required.",
                    "exam_code": exam_code,
                },
            )
        return current_user

    return checker
