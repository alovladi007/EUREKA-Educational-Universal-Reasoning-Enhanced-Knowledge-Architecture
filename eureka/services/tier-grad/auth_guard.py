"""Dependency-free JWT auth guard (HS256).

The whole EUREKA stack shares one HMAC secret for SSO, so this service can
verify api-core-issued access tokens without adding a JWT dependency: HS256 is
just an HMAC-SHA256 over the header.payload, which the standard library does.
This keeps the guard self-contained (no python-jose / PyJWT install or rebuild)
while still rejecting forged or tampered tokens.

Usage:
    from app.core.auth_guard import require_user, CurrentUser
    @router.get(...)
    async def handler(user: CurrentUser = Depends(require_user)): ...

Production note: the shared prod-guard (a strong non-default JWT_SECRET) is
enforced by api-core and services/shared; here we only verify signatures.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

CurrentUser = Dict[str, Any]

_DEV_SECRET = "eureka_dev_secret_key_change_in_production"
_SECRET = os.getenv("JWT_SECRET", _DEV_SECRET)
_ALG = os.getenv("JWT_ALGORITHM", "HS256")
_bearer = HTTPBearer()


def _b64url_decode(segment: str) -> bytes:
    padding = "=" * (-len(segment) % 4)
    return base64.urlsafe_b64decode(segment + padding)


def _verify(token: str) -> Dict[str, Any]:
    if _ALG != "HS256":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unsupported token algorithm")
    try:
        header_b64, payload_b64, sig_b64 = token.split(".")
        signing_input = f"{header_b64}.{payload_b64}".encode()
        expected = hmac.new(_SECRET.encode(), signing_input, hashlib.sha256).digest()
        if not hmac.compare_digest(expected, _b64url_decode(sig_b64)):
            raise ValueError("bad signature")
        payload = json.loads(_b64url_decode(payload_b64))
    except (ValueError, KeyError, json.JSONDecodeError):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    exp = payload.get("exp")
    if exp is not None and time.time() > float(exp):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expired")
    if payload.get("type") not in (None, "access"):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token type")
    return payload


async def require_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> CurrentUser:
    """Require a valid access token; return {user_id, role, email, ...}."""
    payload = _verify(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")
    return {
        "user_id": str(user_id),
        "role": payload.get("role"),
        "email": payload.get("email"),
        "org_id": payload.get("org_id"),
    }


def is_staff(user: CurrentUser) -> bool:
    """True for roles allowed to view other learners' data."""
    return user.get("role") in {"teacher", "org_admin", "super_admin", "admin", "researcher"}
