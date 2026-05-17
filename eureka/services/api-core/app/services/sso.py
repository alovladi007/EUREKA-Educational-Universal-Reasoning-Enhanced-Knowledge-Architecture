"""
SSO (Phase 9 Session 9.4, 2026-05).

OIDC-only for v1. SAML and Google Workspace use the same data model;
the implementation hooks here lift to support them in 9.4b.

The flow:

  1. Admin creates an SsoIdpConfig for their organization, supplying
     a discovery_url + client_id + client_secret (Fernet-encrypted at
     rest under MFA_ENVELOPE_KEY).
  2. Login UI calls GET /sso/{org_slug}/authorize. We resolve the org's
     config, fetch the IdP's OIDC discovery doc, redirect the browser
     to the authorization_endpoint with our state + nonce.
  3. The IdP redirects back to /sso/callback?code=...&state=...
  4. We exchange the code for an id_token + userinfo, validate, map
     attributes to a User row (JIT-provision if needed), issue our
     own JWT (the same one used by /auth/login).

Symmetric to /auth/login from the caller's perspective: returns the
same TokenResponse shape so the frontend doesn't need new wiring.
"""

from __future__ import annotations

import asyncio
import secrets
from datetime import datetime
from typing import Any
from uuid import UUID

import httpx
from jose import jwt as jose_jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.observability import get_logger
from app.models.institutional import CohortMembership, CohortRole, SsoIdpConfig
from app.models.organization import Organization
from app.models.user import User
from app.utils.auth import create_access_token, create_refresh_token, hash_password
from app.utils.mfa import decrypt, encrypt

log = get_logger(__name__)


# ---------------------------------------------------------------------------
# Discovery + token exchange
# ---------------------------------------------------------------------------


_DISCOVERY_CACHE: dict[str, tuple[float, dict]] = {}
_DISCOVERY_TTL_SEC = 600


async def fetch_discovery(discovery_url: str) -> dict:
    """Pull and lightly-cache the OIDC discovery doc."""
    import time
    cached = _DISCOVERY_CACHE.get(discovery_url)
    if cached and (time.time() - cached[0]) < _DISCOVERY_TTL_SEC:
        return cached[1]
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(discovery_url)
        r.raise_for_status()
        doc = r.json()
    _DISCOVERY_CACHE[discovery_url] = (time.time(), doc)
    return doc


def encrypt_client_secret(plain: str) -> str:
    return encrypt(plain)


def decrypt_client_secret(ciphertext: str) -> str:
    return decrypt(ciphertext)


# ---------------------------------------------------------------------------
# Authorize + callback
# ---------------------------------------------------------------------------


async def build_authorize_url(
    *,
    cfg: SsoIdpConfig,
    redirect_uri: str,
    state: str,
    nonce: str,
) -> str:
    """Return the URL to send the user to at the IdP."""
    if not cfg.discovery_url:
        raise ValueError("SsoIdpConfig has no discovery_url; only OIDC is supported in 9.4")
    disc = await fetch_discovery(cfg.discovery_url)
    auth = disc["authorization_endpoint"]
    from urllib.parse import urlencode
    params = {
        "response_type": "code",
        "client_id": cfg.client_id,
        "redirect_uri": redirect_uri,
        "scope": "openid email profile",
        "state": state,
        "nonce": nonce,
    }
    return f"{auth}?{urlencode(params)}"


async def exchange_code(
    *,
    cfg: SsoIdpConfig,
    code: str,
    redirect_uri: str,
) -> dict:
    """POST to the IdP's token endpoint; return the parsed token response."""
    disc = await fetch_discovery(cfg.discovery_url)
    token_url = disc["token_endpoint"]
    secret = decrypt_client_secret(cfg.client_secret_encrypted) if cfg.client_secret_encrypted else ""
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.post(
            token_url,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": cfg.client_id,
                "client_secret": secret,
            },
            headers={"Accept": "application/json"},
        )
        r.raise_for_status()
        return r.json()


async def validate_id_token(
    *, cfg: SsoIdpConfig, id_token: str, nonce: str
) -> dict:
    """
    Validate an OIDC id_token: signature against the IdP's JWKS, issuer,
    audience, nonce. Returns the decoded claims.
    """
    disc = await fetch_discovery(cfg.discovery_url)
    async with httpx.AsyncClient(timeout=10) as c:
        jwks_r = await c.get(disc["jwks_uri"])
        jwks_r.raise_for_status()
        jwks = jwks_r.json()
    claims = jose_jwt.decode(
        id_token,
        jwks,
        algorithms=disc.get("id_token_signing_alg_values_supported") or ["RS256"],
        audience=cfg.client_id,
        issuer=cfg.issuer or disc.get("issuer"),
        options={"verify_at_hash": False},
    )
    if claims.get("nonce") != nonce:
        raise ValueError("id_token nonce mismatch")
    return claims


# ---------------------------------------------------------------------------
# JIT user provisioning + token issuance
# ---------------------------------------------------------------------------


async def upsert_user_from_claims(
    db: AsyncSession,
    *,
    cfg: SsoIdpConfig,
    claims: dict,
) -> User:
    """
    Map OIDC claims to a User row in the IdP's org. Creates the user if
    just_in_time_provisioning is on and they don't exist. Auto-enrols
    them into the configured cohort.
    """
    mapping = cfg.attribute_mapping or {}
    email = (
        claims.get(mapping.get("email", "email"))
        or claims.get("email")
        or claims.get("preferred_username")
    )
    if not email:
        raise ValueError("OIDC claims have no email; cannot provision")
    first_name = claims.get(mapping.get("first_name", "given_name")) or "SSO"
    last_name = claims.get(mapping.get("last_name", "family_name")) or "User"

    # Look up existing user (org-scoped)
    r = await db.execute(
        select(User).where(User.org_id == cfg.org_id, User.email == email)
    )
    user = r.scalar_one_or_none()
    if user is not None:
        return user

    if not cfg.just_in_time_provisioning:
        raise ValueError(
            "User not provisioned and JIT is off. Ask the org admin to add them."
        )

    user = User(
        org_id=cfg.org_id,
        email=email,
        # SSO-provisioned users have a random password they can't use.
        # If they ever want password login they go through reset.
        hashed_password=hash_password(secrets.token_urlsafe(32)),
        first_name=first_name,
        last_name=last_name,
        role=cfg.default_role,
        is_active=True,
        is_email_verified=True,  # IdP vouches for the email
    )
    db.add(user)
    await db.flush()

    if cfg.auto_enroll_cohort_id:
        db.add(
            CohortMembership(
                cohort_id=cfg.auto_enroll_cohort_id,
                user_id=user.id,
                role=CohortRole.LEARNER,
            )
        )

    await db.commit()
    await db.refresh(user)
    return user


async def issue_session_tokens(user: User) -> dict:
    """Returns the same TokenResponse shape /auth/login does."""
    role_value = user.role.value if hasattr(user.role, "value") else user.role
    token_data = {
        "sub": str(user.id),
        "org_id": str(user.org_id),
        "role": role_value,
        "email": user.email,
    }
    return {
        "access_token": create_access_token(token_data),
        "refresh_token": create_refresh_token(token_data),
        "token_type": "bearer",
        "user_id": str(user.id),
        "email": user.email,
        "role": role_value,
    }
