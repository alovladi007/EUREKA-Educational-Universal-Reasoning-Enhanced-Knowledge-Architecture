"""
Phase 13 — Platform integrations REST surface.

Endpoint map
============

13.1 API keys
  POST   /me/api-keys                          mint a key (returns secret once)
  GET    /me/api-keys                          list my keys
  POST   /me/api-keys/{id}/revoke              revoke a key

13.2 Webhooks
  POST   /me/webhooks                          create a webhook (returns signing_secret once)
  GET    /me/webhooks                          list my webhooks
  PATCH  /me/webhooks/{id}                     update / toggle
  GET    /me/webhooks/{id}/deliveries          recent deliveries
  POST   /admin/webhooks/{id}/test             (admin) fire a test event
  POST   /admin/webhooks/deliveries/{id}/outcome  (admin) record delivery outcome
                                               — used by the worker to update status

13.3 Embed SDK
  POST   /me/embed-tokens                      mint an embed token (JWT, returned once)
  GET    /me/embed-tokens                      list active tokens
  POST   /me/embed-tokens/{id}/revoke          revoke a token
  POST   /embed/verify                         public verify a presented JWT (used by the iframe)

13.4 OAuth 2.0 third-party apps
  POST   /me/oauth-apps                        register an app (returns client_secret once)
  GET    /me/oauth-apps                        my apps
  POST   /admin/oauth-apps/{id}/review         (admin) approve / suspend
  GET    /oauth-apps/{client_id}/public        public read of approved app

13.5 Compliance
  POST   /me/compliance/export                 request my GDPR/FERPA data export
  GET    /me/compliance/exports                list my exports
  GET    /me/compliance/exports/{id}           get one export (with payload when ready)
  POST   /me/compliance/delete                 request account deletion
  POST   /me/compliance/delete/{id}/cancel     cancel a pending deletion
  GET    /admin/audit                          (admin) recent audit events
"""

from __future__ import annotations

import csv
import io
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.integrations import (
    ApiKey,
    ApiKeyStatus,
    AuditEvent,
    ComplianceDeleteStatus,
    ComplianceDeletion,
    ComplianceExport,
    ComplianceExportStatus,
    EmbedToken,
    OauthApp,
    OauthAppStatus,
    WebhookDelivery,
    WebhookDeliveryStatus,
    WebhookEndpoint,
)
from app.models.user import User
from app.core.models import UserRole
from app.schemas.integrations import (
    ApiKeyCreateRequest,
    ApiKeyMintedResponse,
    ApiKeyResponse,
    AuditEventResponse,
    DeletionRequest,
    DeletionResponse,
    EmbedTokenCreateRequest,
    EmbedTokenMintedResponse,
    EmbedTokenResponse,
    ExportRequest,
    ExportResponse,
    OauthAppApproveRequest,
    OauthAppCreateRequest,
    OauthAppMintedResponse,
    OauthAppResponse,
    WebhookCreateRequest,
    WebhookCreatedResponse,
    WebhookDeliveryOutcomeRequest,
    WebhookDeliveryResponse,
    WebhookResponse,
)
from app.services import integrations as ig_svc
from app.utils.dependencies import get_current_user


router = APIRouter()


# P1.5: centralized in app/utils/rbac.py (was a local duplicate).
from app.utils.rbac import is_admin as _is_admin  # noqa: E402


def _require_admin(user: User) -> None:
    if not _is_admin(user):
        raise HTTPException(status_code=403, detail="admin role required")


def _utc() -> datetime:
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# 13.1 API keys
# ---------------------------------------------------------------------------


@router.post("/me/api-keys", response_model=ApiKeyMintedResponse, status_code=201)
async def create_api_key(
    payload: ApiKeyCreateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.org_owned and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="only admins may create org-owned keys")
    user_id = None if payload.org_owned else current_user.id
    org_id = current_user.org_id if payload.org_owned else None
    row, secret = await ig_svc.create_api_key(
        db, name=payload.name, description=payload.description,
        scopes=payload.scopes, rate_limit_per_min=payload.rate_limit_per_min,
        user_id=user_id, org_id=org_id, expires_at=payload.expires_at,
        created_by=current_user.id,
    )
    await ig_svc.log_audit(
        db, event_name="api_key.create",
        actor_user_id=current_user.id, subject_user_id=current_user.id,
        org_id=current_user.org_id, metadata={"key_id": row.key_id},
        request_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    out = ApiKeyMintedResponse.model_validate(
        {**ApiKeyResponse.model_validate(row, from_attributes=True).model_dump(),
         "presented_token": f"{row.key_id}.{secret}"}
    )
    return out


@router.get("/me/api-keys", response_model=list[ApiKeyResponse])
async def list_my_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(ApiKey).where(
            (ApiKey.user_id == current_user.id) | (ApiKey.org_id == current_user.org_id),
        ).order_by(ApiKey.created_at.desc())
    )
    return list(q.scalars().all())


@router.post("/me/api-keys/{key_id}/revoke", response_model=ApiKeyResponse)
async def revoke_api_key(
    key_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    key = await db.get(ApiKey, key_id)
    if key is None:
        raise HTTPException(status_code=404, detail="key not found")
    if key.user_id != current_user.id and (key.org_id != current_user.org_id or not _is_admin(current_user)):
        raise HTTPException(status_code=403, detail="not yours to revoke")
    key.status = ApiKeyStatus.revoked.value
    key.revoked_at = _utc()
    key.revoked_by = current_user.id
    await db.commit()
    await db.refresh(key)
    await ig_svc.log_audit(
        db, event_name="api_key.revoke",
        actor_user_id=current_user.id, subject_user_id=key.user_id,
        org_id=key.org_id, metadata={"key_id": key.key_id},
        request_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return key


# ---------------------------------------------------------------------------
# 13.2 Webhooks
# ---------------------------------------------------------------------------


@router.post("/me/webhooks", response_model=WebhookCreatedResponse, status_code=201)
async def create_webhook(
    payload: WebhookCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    import secrets
    if payload.org_owned and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="only admins may create org-owned webhooks")
    secret = secrets.token_urlsafe(32).rstrip("=")
    ep = WebhookEndpoint(
        user_id=None if payload.org_owned else current_user.id,
        org_id=current_user.org_id if payload.org_owned else None,
        name=payload.name, url=payload.url,
        signing_secret=secret, subscribed_events=payload.subscribed_events,
    )
    db.add(ep)
    await db.commit()
    await db.refresh(ep)
    return WebhookCreatedResponse.model_validate(
        {**WebhookResponse.model_validate(ep, from_attributes=True).model_dump(),
         "signing_secret": secret}
    )


@router.get("/me/webhooks", response_model=list[WebhookResponse])
async def list_my_webhooks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(WebhookEndpoint).where(
            (WebhookEndpoint.user_id == current_user.id) | (WebhookEndpoint.org_id == current_user.org_id),
        ).order_by(WebhookEndpoint.created_at.desc())
    )
    return list(q.scalars().all())


@router.patch("/me/webhooks/{webhook_id}", response_model=WebhookResponse)
async def update_webhook(
    webhook_id: UUID,
    is_active: Optional[bool] = Query(None),
    name: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ep = await db.get(WebhookEndpoint, webhook_id)
    if ep is None:
        raise HTTPException(status_code=404, detail="webhook not found")
    if ep.user_id != current_user.id and ep.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="not yours")
    if is_active is not None:
        ep.is_active = is_active
    if name is not None:
        ep.name = name
    await db.commit()
    await db.refresh(ep)
    return ep


@router.get("/me/webhooks/{webhook_id}/deliveries", response_model=list[WebhookDeliveryResponse])
async def list_webhook_deliveries(
    webhook_id: UUID,
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ep = await db.get(WebhookEndpoint, webhook_id)
    if ep is None:
        raise HTTPException(status_code=404, detail="webhook not found")
    if ep.user_id != current_user.id and ep.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="not yours")
    q = await db.execute(
        select(WebhookDelivery).where(WebhookDelivery.endpoint_id == webhook_id)
        .order_by(WebhookDelivery.queued_at.desc()).limit(limit)
    )
    return list(q.scalars().all())


@router.post("/admin/webhooks/{webhook_id}/test", response_model=list[WebhookDeliveryResponse])
async def admin_test_webhook(
    webhook_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Synthesise one delivery for *this specific* endpoint regardless of its
    subscribed_events list — used by the developer-console "Send test event"
    button."""
    _require_admin(current_user)
    ep = await db.get(WebhookEndpoint, webhook_id)
    if ep is None:
        raise HTTPException(status_code=404, detail="webhook not found")
    import json
    payload = {"id": str(webhook_id), "kind": "test", "at": _utc().isoformat()}
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str).encode("utf-8")
    sig = ig_svc.sign_payload(ep.signing_secret, canonical)
    delivery = WebhookDelivery(
        endpoint_id=ep.id, event="ping", payload=payload,
        signature=sig, status=WebhookDeliveryStatus.queued.value,
    )
    db.add(delivery)
    await db.commit()
    await db.refresh(delivery)
    return [delivery]


@router.post("/admin/webhooks/deliveries/{delivery_id}/outcome", response_model=WebhookDeliveryResponse)
async def admin_record_delivery_outcome(
    delivery_id: UUID,
    payload: WebhookDeliveryOutcomeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    delivery = await db.get(WebhookDelivery, delivery_id)
    if delivery is None:
        raise HTTPException(status_code=404, detail="delivery not found")
    return await ig_svc.mark_delivery_outcome(
        db, delivery=delivery,
        success=payload.success, status_code=payload.status_code,
        body_excerpt=payload.body_excerpt,
    )


# ---------------------------------------------------------------------------
# 13.3 Embed SDK
# ---------------------------------------------------------------------------


@router.post("/me/embed-tokens", response_model=EmbedTokenMintedResponse, status_code=201)
async def mint_embed_token(
    payload: EmbedTokenCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.org_owned and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="only admins may mint org-owned embed tokens")
    user_id = None if payload.org_owned else current_user.id
    org_id = current_user.org_id if payload.org_owned else None
    row, token = await ig_svc.create_embed_token(
        db,
        user_id=user_id, org_id=org_id,
        widget_kind=payload.widget_kind,
        params=payload.params,
        allowed_origins=payload.allowed_origins,
        ttl_minutes=payload.ttl_minutes,
    )
    return EmbedTokenMintedResponse.model_validate(
        {**EmbedTokenResponse.model_validate(row, from_attributes=True).model_dump(),
         "token": token}
    )


@router.get("/me/embed-tokens", response_model=list[EmbedTokenResponse])
async def list_my_embed_tokens(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(EmbedToken).where(
            ((EmbedToken.user_id == current_user.id) | (EmbedToken.org_id == current_user.org_id)),
            EmbedToken.revoked_at.is_(None),
        ).order_by(EmbedToken.created_at.desc())
    )
    return list(q.scalars().all())


@router.post("/me/embed-tokens/{token_id}/revoke", response_model=EmbedTokenResponse)
async def revoke_embed_token(
    token_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    t = await db.get(EmbedToken, token_id)
    if t is None:
        raise HTTPException(status_code=404, detail="token not found")
    if t.user_id != current_user.id and t.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="not yours")
    t.revoked_at = _utc()
    await db.commit()
    await db.refresh(t)
    return t


@router.post("/embed/verify")
async def public_verify_embed_token(
    token: str = Query(...),
):
    claims = ig_svc.verify_embed_token(token)
    if claims is None:
        raise HTTPException(status_code=401, detail="invalid token")
    return {"valid": True, "claims": claims}


# ---------------------------------------------------------------------------
# 13.4 OAuth 2.0 third-party apps
# ---------------------------------------------------------------------------


@router.post("/me/oauth-apps", response_model=OauthAppMintedResponse, status_code=201)
async def register_oauth_app(
    payload: OauthAppCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.org_owned and not _is_admin(current_user):
        raise HTTPException(status_code=403, detail="only admins may register org-owned apps")
    owner_user_id = None if payload.org_owned else current_user.id
    owner_org_id = current_user.org_id if payload.org_owned else None
    app, secret = await ig_svc.create_oauth_app(
        db,
        name=payload.name, description=payload.description,
        homepage_url=payload.homepage_url, logo_url=payload.logo_url,
        redirect_uris=payload.redirect_uris,
        allowed_scopes=payload.allowed_scopes,
        owner_user_id=owner_user_id, owner_org_id=owner_org_id,
    )
    return OauthAppMintedResponse.model_validate(
        {**OauthAppResponse.model_validate(app, from_attributes=True).model_dump(),
         "client_secret": secret}
    )


@router.get("/me/oauth-apps", response_model=list[OauthAppResponse])
async def list_my_oauth_apps(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(OauthApp).where(
            (OauthApp.owner_user_id == current_user.id) | (OauthApp.owner_org_id == current_user.org_id),
        ).order_by(OauthApp.created_at.desc())
    )
    return list(q.scalars().all())


@router.post("/admin/oauth-apps/{app_id}/review", response_model=OauthAppResponse)
async def admin_review_oauth_app(
    app_id: UUID,
    payload: OauthAppApproveRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    app = await db.get(OauthApp, app_id)
    if app is None:
        raise HTTPException(status_code=404, detail="app not found")
    if payload.action == "approve":
        app.status = OauthAppStatus.approved.value
        app.approved_at = _utc()
        app.approved_by = current_user.id
    elif payload.action == "suspend":
        app.status = OauthAppStatus.suspended.value
    else:
        raise HTTPException(status_code=400, detail="action must be approve|suspend")
    await db.commit()
    await db.refresh(app)
    return app


@router.get("/oauth-apps/{client_id}/public", response_model=OauthAppResponse)
async def public_oauth_app(
    client_id: str,
    db: AsyncSession = Depends(get_db),
):
    q = await db.execute(
        select(OauthApp).where(
            OauthApp.client_id == client_id,
            OauthApp.status == OauthAppStatus.approved.value,
        )
    )
    app = q.scalar_one_or_none()
    if app is None:
        raise HTTPException(status_code=404, detail="app not found or not approved")
    return app


# ---------------------------------------------------------------------------
# 13.5 Compliance
# ---------------------------------------------------------------------------


@router.post("/me/compliance/export", response_model=ExportResponse, status_code=201)
async def request_my_export(
    payload: ExportRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sections = payload.sections or list(ig_svc._EXPORT_BUILDERS.keys())
    export = ComplianceExport(
        user_id=current_user.id, status=ComplianceExportStatus.queued.value,
        sections=sections,
    )
    db.add(export)
    await db.commit()
    await db.refresh(export)
    # Build inline — we can offload to a worker later but inline keeps the
    # data flow auditable.
    export = await ig_svc.build_export(db, export=export)
    await ig_svc.log_audit(
        db, event_name="compliance.export.request",
        actor_user_id=current_user.id, subject_user_id=current_user.id,
        org_id=current_user.org_id, metadata={"sections": sections},
        request_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return export


@router.get("/me/compliance/exports", response_model=list[ExportResponse])
async def list_my_exports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = await db.execute(
        select(ComplianceExport).where(ComplianceExport.user_id == current_user.id)
        .order_by(ComplianceExport.requested_at.desc())
    )
    return list(q.scalars().all())


@router.get("/me/compliance/exports/{export_id}", response_model=ExportResponse)
async def get_my_export(
    export_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    e = await db.get(ComplianceExport, export_id)
    if e is None or e.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="export not found")
    return e


@router.post("/me/compliance/delete", response_model=DeletionResponse, status_code=201)
async def request_my_deletion(
    payload: DeletionRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Refuse if already requested.
    existing_q = await db.execute(
        select(ComplianceDeletion).where(
            ComplianceDeletion.user_id == current_user.id,
            ComplianceDeletion.status.in_(("requested", "scheduled")),
        )
    )
    if existing_q.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="deletion already pending")
    scheduled = _utc() + timedelta(days=payload.days_until_execution)
    deletion = ComplianceDeletion(
        user_id=current_user.id, requested_by=current_user.id,
        status=ComplianceDeleteStatus.scheduled.value,
        reason=payload.reason, scheduled_for=scheduled,
    )
    db.add(deletion)
    await db.commit()
    await db.refresh(deletion)
    await ig_svc.log_audit(
        db, event_name="compliance.delete.request", severity="warn",
        actor_user_id=current_user.id, subject_user_id=current_user.id,
        org_id=current_user.org_id, metadata={"scheduled_for": scheduled.isoformat()},
        request_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return deletion


@router.post("/me/compliance/delete/{deletion_id}/cancel", response_model=DeletionResponse)
async def cancel_my_deletion(
    deletion_id: UUID,
    reason: Optional[str] = Query(None),
    request: Request = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    d = await db.get(ComplianceDeletion, deletion_id)
    if d is None or d.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="deletion not found")
    if d.status not in ("requested", "scheduled"):
        raise HTTPException(status_code=409, detail=f"cannot cancel from status={d.status}")
    d.status = ComplianceDeleteStatus.canceled.value
    d.canceled_at = _utc()
    d.canceled_reason = reason
    await db.commit()
    await db.refresh(d)
    await ig_svc.log_audit(
        db, event_name="compliance.delete.cancel",
        actor_user_id=current_user.id, subject_user_id=current_user.id,
        org_id=current_user.org_id,
    )
    return d


# ---------------------------------------------------------------------------
# Admin DSAR console (13.5) — org admins act on a MEMBER's data.
# The self-service /me/compliance/* endpoints only cover the caller's own
# account; these let an org_admin export or schedule deletion of a member's
# data (org-scoped) and see the org's pending requests.
# ---------------------------------------------------------------------------


async def _admin_subject(db: AsyncSession, current_user: User, subject_user_id: UUID) -> User:
    """Resolve a target member, enforcing admin role + same-org isolation."""
    _require_admin(current_user)
    subj = await db.get(User, subject_user_id)
    if subj is None:
        raise HTTPException(status_code=404, detail="user not found")
    if current_user.role != UserRole.SUPER_ADMIN.value and subj.org_id != current_user.org_id:
        raise HTTPException(status_code=403, detail="user not in your organization")
    return subj


def _org_compliance_query(model, current_user: User, limit: int):
    stmt = (
        select(model)
        .join(User, User.id == model.user_id)
        .order_by(model.requested_at.desc())
        .limit(limit)
    )
    if current_user.role != UserRole.SUPER_ADMIN.value:
        stmt = stmt.where(User.org_id == current_user.org_id)
    return stmt


@router.get("/admin/compliance/exports", response_model=list[ExportResponse])
async def admin_list_exports(
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(_org_compliance_query(ComplianceExport, current_user, limit))
    return list(q.scalars().all())


@router.get("/admin/compliance/deletions", response_model=list[DeletionResponse])
async def admin_list_deletions(
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(_org_compliance_query(ComplianceDeletion, current_user, limit))
    return list(q.scalars().all())


@router.post("/admin/compliance/export/{subject_user_id}", response_model=ExportResponse, status_code=201)
async def admin_request_export(
    subject_user_id: UUID,
    payload: ExportRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subj = await _admin_subject(db, current_user, subject_user_id)
    sections = payload.sections or list(ig_svc._EXPORT_BUILDERS.keys())
    export = ComplianceExport(
        user_id=subj.id, status=ComplianceExportStatus.queued.value, sections=sections
    )
    db.add(export)
    await db.commit()
    await db.refresh(export)
    export = await ig_svc.build_export(db, export=export)
    await ig_svc.log_audit(
        db, event_name="compliance.export.request", severity="warn",
        actor_user_id=current_user.id, subject_user_id=subj.id,
        org_id=current_user.org_id,
        metadata={"sections": sections, "by_admin": True},
        request_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return export


@router.post("/admin/compliance/delete/{subject_user_id}", response_model=DeletionResponse, status_code=201)
async def admin_request_deletion(
    subject_user_id: UUID,
    payload: DeletionRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subj = await _admin_subject(db, current_user, subject_user_id)
    if subj.id == current_user.id:
        raise HTTPException(status_code=400, detail="use the self-service flow for your own account")
    if subj.role == UserRole.SUPER_ADMIN.value and current_user.role != UserRole.SUPER_ADMIN.value:
        raise HTTPException(status_code=403, detail="cannot schedule deletion of a super admin")
    existing_q = await db.execute(
        select(ComplianceDeletion).where(
            ComplianceDeletion.user_id == subj.id,
            ComplianceDeletion.status.in_(("requested", "scheduled")),
        )
    )
    if existing_q.scalar_one_or_none() is not None:
        raise HTTPException(status_code=409, detail="deletion already pending for this user")
    scheduled = _utc() + timedelta(days=payload.days_until_execution)
    deletion = ComplianceDeletion(
        user_id=subj.id, requested_by=current_user.id,
        status=ComplianceDeleteStatus.scheduled.value,
        reason=payload.reason, scheduled_for=scheduled,
    )
    db.add(deletion)
    await db.commit()
    await db.refresh(deletion)
    await ig_svc.log_audit(
        db, event_name="compliance.delete.request", severity="warn",
        actor_user_id=current_user.id, subject_user_id=subj.id,
        org_id=current_user.org_id,
        metadata={"scheduled_for": scheduled.isoformat(), "by_admin": True},
        request_ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return deletion


@router.post("/admin/compliance/deletions/{deletion_id}/cancel", response_model=DeletionResponse)
async def admin_cancel_deletion(
    deletion_id: UUID,
    reason: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    d = await db.get(ComplianceDeletion, deletion_id)
    if d is None:
        raise HTTPException(status_code=404, detail="deletion not found")
    subj = await db.get(User, d.user_id)
    if subj is None or (
        current_user.role != UserRole.SUPER_ADMIN.value and subj.org_id != current_user.org_id
    ):
        raise HTTPException(status_code=404, detail="deletion not found")
    if d.status not in ("requested", "scheduled"):
        raise HTTPException(status_code=409, detail=f"cannot cancel from status={d.status}")
    d.status = ComplianceDeleteStatus.canceled.value
    d.canceled_at = _utc()
    d.canceled_reason = reason
    await db.commit()
    await db.refresh(d)
    await ig_svc.log_audit(
        db, event_name="compliance.delete.cancel", severity="warn",
        actor_user_id=current_user.id, subject_user_id=d.user_id,
        org_id=current_user.org_id,
    )
    return d


def _audit_query(current_user: User, event_name, severity, limit):
    """Build the audit SELECT with tenant isolation + filters.

    Tenant isolation: an org_admin only ever sees their OWN org's events;
    only a super_admin sees events across all organizations. (Previously this
    query had no org filter, leaking every org's audit trail to any admin.)
    """
    stmt = select(AuditEvent).order_by(AuditEvent.occurred_at.desc()).limit(limit)
    if current_user.role != UserRole.SUPER_ADMIN.value:
        stmt = stmt.where(AuditEvent.org_id == current_user.org_id)
    if event_name:
        stmt = stmt.where(AuditEvent.event_name == event_name)
    if severity:
        stmt = stmt.where(AuditEvent.severity == severity)
    return stmt


@router.get("/admin/audit", response_model=list[AuditEventResponse])
async def admin_recent_audit(
    event_name: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    q = await db.execute(_audit_query(current_user, event_name, severity, limit))
    return list(q.scalars().all())


@router.get("/admin/audit/export")
async def admin_export_audit(
    event_name: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(5000, ge=1, le=50000),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download the (org-scoped, filtered) audit trail as CSV."""
    _require_admin(current_user)
    q = await db.execute(_audit_query(current_user, event_name, severity, limit))
    rows = list(q.scalars().all())

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        [
            "occurred_at",
            "event_name",
            "severity",
            "actor_user_id",
            "subject_user_id",
            "org_id",
            "request_ip",
            "user_agent",
        ]
    )
    for e in rows:
        writer.writerow(
            [
                e.occurred_at.isoformat() if e.occurred_at else "",
                e.event_name,
                e.severity,
                str(e.actor_user_id or ""),
                str(e.subject_user_id or ""),
                str(e.org_id or ""),
                e.request_ip or "",
                e.user_agent or "",
            ]
        )
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=audit-log.csv"},
    )
