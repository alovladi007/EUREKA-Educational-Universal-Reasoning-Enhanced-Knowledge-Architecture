"""
Phase 13 — Platform integrations service.

Covers:
  - API key minting + verification (key_id + secret half, secret hashed)
  - OAuth app secret minting + verification
  - Embed token minting (signed) + verification
  - Webhook payload signing (HMAC-SHA256) + retry schedule
  - Compliance export builder (collects per-user records into one JSON tree)
  - Audit event helper
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

import jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.integrations import (
    AuditEvent,
    AuditSeverity,
    ApiKey,
    ApiKeyStatus,
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


_PWD = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def _utc() -> datetime:
    return datetime.now(timezone.utc)


def _jwt_secret() -> str:
    return getattr(settings, "JWT_SECRET", None) or os.environ.get("JWT_SECRET", "dev-only-please-set-JWT_SECRET")


# ---------------------------------------------------------------------------
# 13.1 API keys
# ---------------------------------------------------------------------------


def _mint_key_pair() -> tuple[str, str]:
    """Returns (key_id, secret).

    key_id is the public identifier shown in the URL bar / docs ("eur_pk_xxx");
    secret is the private half the client must keep. Only `key_id + hashed_secret`
    is persisted.
    """
    key_id = "eur_pk_" + secrets.token_urlsafe(20).rstrip("=")
    secret = "eur_sk_" + secrets.token_urlsafe(32).rstrip("=")
    return key_id, secret


async def create_api_key(
    db: AsyncSession,
    *,
    name: str,
    description: Optional[str],
    scopes: list[str],
    rate_limit_per_min: int,
    user_id: Optional[UUID] = None,
    org_id: Optional[UUID] = None,
    expires_at: Optional[datetime] = None,
    created_by: Optional[UUID] = None,
) -> tuple[ApiKey, str]:
    """Return (row, secret). The secret is only returned at create-time."""
    if (user_id is None) == (org_id is None):
        raise ValueError("exactly one of user_id/org_id must be set")
    key_id, secret = _mint_key_pair()
    row = ApiKey(
        key_id=key_id, hashed_secret=_PWD.hash(secret),
        user_id=user_id, org_id=org_id,
        name=name, description=description,
        scopes=scopes, rate_limit_per_min=rate_limit_per_min,
        expires_at=expires_at, created_by=created_by,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row, secret


async def verify_api_key(
    db: AsyncSession, *, presented: str
) -> Optional[ApiKey]:
    """Parse `<key_id>.<secret>` and verify against the stored hash."""
    if "." not in presented:
        return None
    key_id, secret = presented.split(".", 1)
    q = await db.execute(
        select(ApiKey).where(
            ApiKey.key_id == key_id,
            ApiKey.status == ApiKeyStatus.active.value,
        )
    )
    key = q.scalar_one_or_none()
    if key is None:
        return None
    if key.expires_at is not None and key.expires_at < _utc():
        key.status = ApiKeyStatus.expired.value
        await db.commit()
        return None
    if not _PWD.verify(secret, key.hashed_secret):
        return None
    key.last_used_at = _utc()
    await db.commit()
    return key


# ---------------------------------------------------------------------------
# 13.2 Webhooks
# ---------------------------------------------------------------------------

# Exponential retry — same shape as the dunning ladder for invoices.
WEBHOOK_RETRY_MINUTES = [1, 5, 30, 120, 720]   # 1m, 5m, 30m, 2h, 12h then abandon


def sign_payload(secret: str, payload_bytes: bytes) -> str:
    return hmac.new(
        secret.encode("utf-8"), payload_bytes, hashlib.sha256,
    ).hexdigest()


async def enqueue_webhook(
    db: AsyncSession,
    *,
    event: str,
    payload: dict,
    user_id: Optional[UUID] = None,
    org_id: Optional[UUID] = None,
) -> list[WebhookDelivery]:
    """Find subscribed endpoints and queue one delivery row per match."""
    stmt = select(WebhookEndpoint).where(WebhookEndpoint.is_active.is_(True))
    if user_id is not None and org_id is not None:
        stmt = stmt.where(
            (WebhookEndpoint.user_id == user_id) | (WebhookEndpoint.org_id == org_id)
        )
    elif user_id is not None:
        stmt = stmt.where(WebhookEndpoint.user_id == user_id)
    elif org_id is not None:
        stmt = stmt.where(WebhookEndpoint.org_id == org_id)
    endpoints = list((await db.execute(stmt)).scalars().all())

    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str).encode("utf-8")
    deliveries: list[WebhookDelivery] = []
    for ep in endpoints:
        subscribed = ep.subscribed_events or ["*"]
        if "*" not in subscribed and event not in subscribed:
            continue
        sig = sign_payload(ep.signing_secret, canonical)
        delivery = WebhookDelivery(
            endpoint_id=ep.id, event=event, payload=payload,
            signature=sig, status=WebhookDeliveryStatus.queued.value,
        )
        db.add(delivery)
        deliveries.append(delivery)
    await db.commit()
    for d in deliveries:
        await db.refresh(d)
    return deliveries


async def mark_delivery_outcome(
    db: AsyncSession,
    *,
    delivery: WebhookDelivery,
    success: bool,
    status_code: Optional[int] = None,
    body_excerpt: Optional[str] = None,
) -> WebhookDelivery:
    """Record the outcome of a webhook POST, schedule retry, update endpoint counters."""
    now = _utc()
    delivery.attempt_n += 1
    delivery.last_status_code = status_code
    delivery.last_response_excerpt = (body_excerpt or "")[:1000]
    ep = await db.get(WebhookEndpoint, delivery.endpoint_id)
    if success:
        delivery.status = WebhookDeliveryStatus.delivered.value
        delivery.delivered_at = now
        delivery.next_retry_at = None
        if ep is not None:
            ep.last_success_at = now
            ep.consecutive_failures = 0
    else:
        if delivery.attempt_n >= len(WEBHOOK_RETRY_MINUTES):
            delivery.status = WebhookDeliveryStatus.abandoned.value
            delivery.next_retry_at = None
        else:
            delivery.status = WebhookDeliveryStatus.failed.value
            delivery.next_retry_at = now + timedelta(
                minutes=WEBHOOK_RETRY_MINUTES[delivery.attempt_n]
            )
        if ep is not None:
            ep.last_failure_at = now
            ep.consecutive_failures = (ep.consecutive_failures or 0) + 1
    await db.commit()
    await db.refresh(delivery)
    return delivery


# ---------------------------------------------------------------------------
# 13.3 Embed tokens
# ---------------------------------------------------------------------------


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()[:64]


def mint_embed_token(
    *,
    user_id: Optional[UUID],
    org_id: Optional[UUID],
    widget_kind: str,
    params: dict,
    allowed_origins: list[str],
    ttl_minutes: int = 60,
) -> tuple[str, datetime]:
    """Build a signed JWT for an iframe embed; returns (token, expires_at)."""
    expires_at = _utc() + timedelta(minutes=ttl_minutes)
    payload = {
        "kind": "embed",
        "widget": widget_kind,
        "params": params,
        "origins": allowed_origins,
        "exp": int(expires_at.timestamp()),
        "iat": int(_utc().timestamp()),
        "sub": str(user_id) if user_id else None,
        "org": str(org_id) if org_id else None,
    }
    token = jwt.encode(payload, _jwt_secret(), algorithm="HS256")
    return token, expires_at


def verify_embed_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, _jwt_secret(), algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


async def create_embed_token(
    db: AsyncSession,
    *,
    user_id: Optional[UUID],
    org_id: Optional[UUID],
    widget_kind: str,
    params: dict,
    allowed_origins: list[str],
    ttl_minutes: int = 60,
) -> tuple[EmbedToken, str]:
    token, expires_at = mint_embed_token(
        user_id=user_id, org_id=org_id,
        widget_kind=widget_kind, params=params,
        allowed_origins=allowed_origins, ttl_minutes=ttl_minutes,
    )
    row = EmbedToken(
        user_id=user_id, org_id=org_id, widget_kind=widget_kind,
        params=params, allowed_origins=allowed_origins,
        token_hash=_token_hash(token), expires_at=expires_at,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row, token


# ---------------------------------------------------------------------------
# 13.4 OAuth apps
# ---------------------------------------------------------------------------


def _mint_oauth_client_pair() -> tuple[str, str]:
    client_id = "eur_app_" + secrets.token_urlsafe(20).rstrip("=")
    secret = secrets.token_urlsafe(40).rstrip("=")
    return client_id, secret


async def create_oauth_app(
    db: AsyncSession,
    *,
    name: str,
    description: Optional[str],
    homepage_url: Optional[str],
    logo_url: Optional[str],
    redirect_uris: list[str],
    allowed_scopes: list[str],
    owner_user_id: Optional[UUID] = None,
    owner_org_id: Optional[UUID] = None,
) -> tuple[OauthApp, str]:
    client_id, secret = _mint_oauth_client_pair()
    app = OauthApp(
        owner_user_id=owner_user_id, owner_org_id=owner_org_id,
        name=name, description=description,
        homepage_url=homepage_url, logo_url=logo_url,
        client_id=client_id, hashed_client_secret=_PWD.hash(secret),
        redirect_uris=redirect_uris, allowed_scopes=allowed_scopes,
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)
    return app, secret


async def verify_oauth_app(
    db: AsyncSession, *, client_id: str, secret: str
) -> Optional[OauthApp]:
    q = await db.execute(
        select(OauthApp).where(
            OauthApp.client_id == client_id,
            OauthApp.status == OauthAppStatus.approved.value,
        )
    )
    app = q.scalar_one_or_none()
    if app is None or not _PWD.verify(secret, app.hashed_client_secret):
        return None
    return app


# ---------------------------------------------------------------------------
# 13.5 Compliance — audit + GDPR export + deletion
# ---------------------------------------------------------------------------


async def log_audit(
    db: AsyncSession,
    *,
    event_name: str,
    severity: str = AuditSeverity.info.value,
    actor_user_id: Optional[UUID] = None,
    subject_user_id: Optional[UUID] = None,
    org_id: Optional[UUID] = None,
    request_ip: Optional[str] = None,
    user_agent: Optional[str] = None,
    metadata: Optional[dict] = None,
) -> AuditEvent:
    event = AuditEvent(
        event_name=event_name, severity=severity,
        actor_user_id=actor_user_id, subject_user_id=subject_user_id,
        org_id=org_id, request_ip=request_ip, user_agent=user_agent,
        extra=metadata or {},
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


# Sections that build_export() knows how to dump.
_EXPORT_BUILDERS: dict[str, str] = {
    "profile": "SELECT row_to_json(u) AS payload FROM users u WHERE u.id = :uid",
    "engagement": "SELECT row_to_json(e) FROM engagement_states e WHERE e.user_id = :uid",
    "achievements": (
        "SELECT json_agg(ua) FROM user_achievements ua WHERE ua.user_id = :uid"
    ),
    "study_plans": "SELECT json_agg(p) FROM study_plans p WHERE p.user_id = :uid",
    "attempts": "SELECT json_agg(a) FROM attempt_logs a WHERE a.user_id = :uid",
    "mock_attempts": "SELECT json_agg(m) FROM mock_attempts m WHERE m.user_id = :uid",
    "tickets": "SELECT json_agg(t) FROM support_tickets t WHERE t.user_id = :uid",
    "invoices": "SELECT json_agg(i) FROM invoices i WHERE i.user_id = :uid",
    "purchases": (
        "SELECT json_agg(p) FROM marketplace_purchases p WHERE p.user_id = :uid"
    ),
    "reviews": "SELECT json_agg(r) FROM course_reviews r WHERE r.user_id = :uid",
    "notifications": (
        "SELECT json_agg(n) FROM push_notifications n WHERE n.user_id = :uid"
    ),
}


async def build_export(
    db: AsyncSession,
    *,
    export: ComplianceExport,
) -> ComplianceExport:
    """Populate `payload_jsonb` by running each requested section's SQL."""
    from sqlalchemy import text
    export.status = ComplianceExportStatus.processing.value
    await db.commit()
    payload: dict = {"user_id": str(export.user_id), "generated_at": _utc().isoformat(), "sections": {}}
    sections = export.sections or list(_EXPORT_BUILDERS.keys())
    for sect in sections:
        sql = _EXPORT_BUILDERS.get(sect)
        if sql is None:
            payload["sections"][sect] = {"error": "unknown section"}
            continue
        try:
            r = await db.execute(text(sql), {"uid": str(export.user_id)})
            row = r.scalar()
            payload["sections"][sect] = row if row is not None else []
        except Exception as exc:
            payload["sections"][sect] = {"error": str(exc)}
    export.payload_jsonb = payload
    export.status = ComplianceExportStatus.ready.value
    export.completed_at = _utc()
    export.expires_at = _utc() + timedelta(days=30)
    await db.commit()
    await db.refresh(export)
    return export
