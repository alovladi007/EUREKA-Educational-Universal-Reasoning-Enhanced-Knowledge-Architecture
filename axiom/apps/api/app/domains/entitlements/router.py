"""Entitlement routes (Integration Work Plan, Section 3).

GET  /entitlements/me       -- the caller's entitlements + the free-tier rules.
POST /entitlements/webhook  -- EUREKA purchase/refund/expiry events. Guarded by
                               a shared secret header, not user auth: the caller
                               is the EUREKA backend, not a browser. Grants and
                               revocations land here so AXIOM access flips
                               without polling.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_session
from app.core.security import get_current_user
from app.domains.entitlements.models import Entitlement
from app.domains.entitlements.service import PRODUCTS, grant, revoke
from app.domains.identity.models import User

router = APIRouter(tags=["entitlements"])


class EntitlementOut(BaseModel):
    product_code: str
    active: bool
    expires_at: datetime | None
    source: str


class MyEntitlementsOut(BaseModel):
    enforced: bool
    free_units: list[str]
    products: dict[str, str]
    entitlements: list[EntitlementOut]


@router.get("/entitlements/me", summary="My entitlements and the free-tier rules")
async def my_entitlements(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> MyEntitlementsOut:
    settings = get_settings()
    rows = (
        await session.execute(
            select(Entitlement).where(Entitlement.user_id == uuid.UUID(str(user.id)))
        )
    ).scalars().all()
    return MyEntitlementsOut(
        enforced=settings.entitlements_enforced,
        free_units=[str(u) for u in settings.free_units],
        products=dict(PRODUCTS),
        entitlements=[
            EntitlementOut(
                product_code=r.product_code, active=r.active,
                expires_at=r.expires_at, source=r.source,
            )
            for r in rows
        ],
    )


class WebhookEvent(BaseModel):
    # entitlement.granted | entitlement.revoked (refund and expiry both revoke).
    event: str
    eureka_user_id: str
    product_code: str
    expires_at: datetime | None = None


class WebhookOut(BaseModel):
    ok: bool
    detail: str


@router.post("/entitlements/webhook", summary="EUREKA purchase/refund/expiry webhook")
async def entitlement_webhook(
    body: WebhookEvent,
    session: AsyncSession = Depends(get_session),
    x_webhook_secret: str | None = Header(default=None),
) -> WebhookOut:
    settings = get_settings()
    if not settings.entitlement_webhook_secret or (
        x_webhook_secret != settings.entitlement_webhook_secret
    ):
        raise HTTPException(status_code=401, detail="bad webhook secret")
    if body.product_code not in set(PRODUCTS.values()):
        raise HTTPException(status_code=422, detail=f"unknown product {body.product_code}")
    user = (
        await session.execute(
            select(User).where(User.eureka_user_id == body.eureka_user_id)
        )
    ).scalar_one_or_none()
    if user is None:
        # The user has not touched AXIOM yet; the nightly reconciliation pull
        # (plan Section 2) will backfill. Acknowledge so EUREKA does not retry
        # forever, but say what happened.
        return WebhookOut(ok=True, detail="user not seen by AXIOM yet; will reconcile")
    if body.event == "entitlement.granted":
        expires = body.expires_at.replace(tzinfo=None) if body.expires_at else None
        await grant(session, user.id, body.product_code, expires_at=expires)
        await session.commit()
        return WebhookOut(ok=True, detail="granted")
    if body.event == "entitlement.revoked":
        existed = await revoke(session, user.id, body.product_code)
        await session.commit()
        return WebhookOut(ok=True, detail="revoked" if existed else "nothing to revoke")
    raise HTTPException(status_code=422, detail=f"unknown event {body.event}")
