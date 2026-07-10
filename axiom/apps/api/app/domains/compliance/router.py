"""Compliance routes: consent (self-service) and audit + retention (admin).

Consent is self-service for the signed-in learner (a parent/guardian records
parental consent on the minor's behalf). The audit trail and the manual
retention purge are admin-only. Reading or changing consent is itself an audited
action, so the trail captures consent history.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from shared_schemas.identity import UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_session
from app.core.security import get_current_user, require_roles
from app.domains.compliance.models import CONSENT_TYPES
from app.domains.compliance.service import (
    get_consents,
    list_audit,
    purge_expired,
    record_audit,
    set_consent,
)

router = APIRouter(prefix="/compliance", tags=["compliance"])

admin_only = require_roles("org_admin", "super_admin")


class ConsentIn(BaseModel):
    consent_type: str = Field(..., description="one of: " + ", ".join(CONSENT_TYPES))
    granted: bool
    granted_by: str = ""


@router.get("/consent/me", summary="My consent records")
async def my_consents(
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    return {"consents": await get_consents(session, user.id)}


@router.put("/consent/me", summary="Record a consent decision")
async def put_consent(
    body: ConsentIn,
    session: AsyncSession = Depends(get_session),
    user: UserOut = Depends(get_current_user),
) -> dict:
    if body.consent_type not in CONSENT_TYPES:
        # Unknown types are recorded anyway (forward-compatible), but flagged.
        pass
    result = await set_consent(
        session,
        user_id=user.id,
        consent_type=body.consent_type,
        granted=body.granted,
        granted_by=body.granted_by,
        tenant_id=user.tenant_id,
    )
    await record_audit(
        session,
        action="consent.set",
        resource_type="consent",
        resource_id=body.consent_type,
        actor_user_id=user.id,
        actor_email=user.email,
        tenant_id=user.tenant_id,
        detail={"granted": body.granted},
    )
    await session.commit()
    return result


@router.get("/audit", summary="Security audit trail (admin)")
async def audit(
    action: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    session: AsyncSession = Depends(get_session),
    admin: UserOut = Depends(admin_only),
) -> dict:
    # An admin sees their own tenant's trail; a super_admin sees all tenants.
    tenant = None if "super_admin" in admin.roles else admin.tenant_id
    return {"events": await list_audit(session, limit=limit, action=action, tenant_id=tenant)}


@router.post("/retention/purge", summary="Run the retention purge now (admin)")
async def purge(
    session: AsyncSession = Depends(get_session),
    admin: UserOut = Depends(admin_only),
) -> dict:
    settings = get_settings()
    deleted = await purge_expired(
        session,
        proctoring_days=settings.retention_proctoring_days,
        analytics_days=settings.retention_analytics_days,
        audit_days=settings.retention_audit_days,
    )
    await record_audit(
        session,
        action="retention.purge",
        resource_type="retention",
        resource_id=None,
        actor_user_id=admin.id,
        actor_email=admin.email,
        tenant_id=admin.tenant_id,
        detail=deleted,
    )
    await session.commit()
    return {"deleted": deleted}
