"""Notification routes: the in-app inbox and unread badge."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.notifications import service as svc

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", summary="My notifications")
async def my_notifications(
    unread_only: bool = False,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    uid = uuid.UUID(user.id)
    items = await svc.list_notifications(session, uid, unread_only=unread_only)
    count = await svc.unread_count(session, uid)
    return {"items": items, "unread_count": count}


@router.get("/unread-count", summary="My unread notification count")
async def unread(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return {"count": await svc.unread_count(session, uuid.UUID(user.id))}


@router.post("/{notification_id}/read", summary="Mark one notification read")
async def read_one(
    notification_id: str,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    ok = await svc.mark_read(session, uuid.UUID(user.id), uuid.UUID(notification_id))
    if not ok:
        raise HTTPException(status_code=404, detail="notification not found")
    await session.commit()
    return {"ok": True}


@router.post("/read-all", summary="Mark all my notifications read")
async def read_all(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    marked = await svc.mark_all_read(session, uuid.UUID(user.id))
    await session.commit()
    return {"marked": marked}
