"""
LTI 1.3 service (Phase 9 Session 9.2, 2026-05).

EUREKA is the TOOL. The LMS (Canvas, Moodle, Blackboard, Brightspace) is
the PLATFORM. LTI 1.3 is an OpenID-Connect-based handshake plus
signed-JWT message passing. The four things every LTI 1.3 Tool needs:

  1. PUBLISH OUR JWKS    /lti/.well-known/jwks.json — the LMS uses this
                         to verify JWTs we send (for grade passback).
                         Multiple `lti_keys` rows can be present; we
                         expose all `is_active = TRUE` keys.

  2. OIDC INITIATION     POST /lti/launch/initiate — the LMS first hits
                         this with iss + client_id + login_hint +
                         lti_message_hint + target_link_uri. We respond
                         with a 302 to the LMS's authorization endpoint
                         with state + nonce we'll verify on the launch.

  3. LAUNCH              POST /lti/launch — after the LMS handshakes
                         OIDC, it POSTs the signed JWT here. We verify
                         it against the platform's JWKS, find/create
                         the EUREKA user, mint an api-core JWT, and
                         redirect the browser to the target page with
                         the token attached. Resource-link launches
                         become `lti_launches` rows (lightweight log).

  4. GRADE PASSBACK      POST /lti/grade/{attempt_id} — we sign a JWT
                         with our private key (lti_keys.private_pem),
                         then call the AGS lineitem URL we received in
                         the launch claims. Returns whatever the LMS
                         says.

This implementation is intentionally minimal: enough to launch from a
real Canvas/Moodle and pass a single grade. Full NRPS (Names and Roles
Provisioning) is Phase 9.2b.

NOTE on RSA key generation: handled by ensure_active_signing_key().
First call generates a fresh 2048-bit RSA pair, stores public PEM in
the clear and private PEM encrypted under MFA_ENVELOPE_KEY.
"""

from __future__ import annotations

import base64
import secrets
import time
from datetime import datetime, timedelta
from typing import Any
from uuid import UUID

import httpx
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey
from jose import jwk as jose_jwk
from jose import jwt as jose_jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.observability import get_logger
from app.models.institutional import LtiKey, LtiPlatform
from app.utils.mfa import decrypt, encrypt

log = get_logger(__name__)


# ---------------------------------------------------------------------------
# Key management
# ---------------------------------------------------------------------------


async def ensure_active_signing_key(db: AsyncSession) -> LtiKey:
    """Return an active RSA signing key, generating one if needed."""
    r = await db.execute(
        select(LtiKey).where(LtiKey.is_active.is_(True)).order_by(LtiKey.created_at.desc()).limit(1)
    )
    key = r.scalar_one_or_none()
    if key is not None:
        return key

    private = rsa.generate_private_key(
        public_exponent=65537, key_size=2048, backend=default_backend(),
    )
    private_pem = private.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()
    public_pem = private.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode()

    kid = f"lti-{secrets.token_hex(8)}"
    row = LtiKey(
        kid=kid,
        algorithm="RS256",
        public_pem=public_pem,
        private_pem_encrypted=encrypt(private_pem),
        is_active=True,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


async def jwks(db: AsyncSession) -> dict:
    """Return the JWKS document EUREKA publishes for LTI consumers."""
    r = await db.execute(select(LtiKey).where(LtiKey.is_active.is_(True)))
    keys = []
    for row in r.scalars().all():
        public_key = serialization.load_pem_public_key(
            row.public_pem.encode(), backend=default_backend()
        )
        numbers = public_key.public_numbers()  # type: ignore[attr-defined]

        def b64u(n: int) -> str:
            byte_len = (n.bit_length() + 7) // 8
            return base64.urlsafe_b64encode(n.to_bytes(byte_len, "big")).rstrip(b"=").decode()

        keys.append({
            "kty": "RSA",
            "use": "sig",
            "alg": row.algorithm,
            "kid": row.kid,
            "n": b64u(numbers.n),
            "e": b64u(numbers.e),
        })
    return {"keys": keys}


# ---------------------------------------------------------------------------
# Launch (initiation + verification)
# ---------------------------------------------------------------------------


# In-memory state store. Production uses Redis; this is fine for v1.
_STATE_STORE: dict[str, tuple[float, dict]] = {}
_STATE_TTL_SEC = 600


def _put_state(state: str, payload: dict) -> None:
    _STATE_STORE[state] = (time.time(), payload)


def _take_state(state: str) -> dict | None:
    val = _STATE_STORE.pop(state, None)
    if val is None:
        return None
    ts, payload = val
    if time.time() - ts > _STATE_TTL_SEC:
        return None
    return payload


async def find_platform(
    db: AsyncSession, *, issuer: str, client_id: str
) -> LtiPlatform | None:
    r = await db.execute(
        select(LtiPlatform).where(
            LtiPlatform.issuer == issuer,
            LtiPlatform.client_id == client_id,
            LtiPlatform.is_active.is_(True),
        )
    )
    return r.scalar_one_or_none()


def build_oidc_redirect(
    *,
    platform: LtiPlatform,
    login_hint: str,
    lti_message_hint: str | None,
    target_link_uri: str,
    redirect_uri: str,
) -> tuple[str, str, str]:
    """Construct the URL the Tool sends the browser to start LTI 1.3.

    Returns (url, state, nonce). We store state→{platform_id,
    target_link_uri, nonce} so we can verify the resulting launch."""
    from urllib.parse import urlencode
    state = secrets.token_urlsafe(24)
    nonce = secrets.token_urlsafe(24)
    _put_state(state, {
        "platform_id": str(platform.id),
        "target_link_uri": target_link_uri,
        "nonce": nonce,
    })
    params = {
        "scope": "openid",
        "response_type": "id_token",
        "response_mode": "form_post",
        "prompt": "none",
        "client_id": platform.client_id,
        "redirect_uri": redirect_uri,
        "login_hint": login_hint,
        "state": state,
        "nonce": nonce,
    }
    if lti_message_hint:
        params["lti_message_hint"] = lti_message_hint
    return f"{platform.auth_login_url}?{urlencode(params)}", state, nonce


async def verify_launch_jwt(
    db: AsyncSession,
    *,
    id_token: str,
    state: str,
) -> tuple[LtiPlatform, dict]:
    """Verify the LMS-signed launch JWT against the platform's JWKS.
    Returns (platform, claims)."""
    saved = _take_state(state)
    if saved is None:
        raise ValueError("invalid or expired launch state")
    platform = await db.get(LtiPlatform, UUID(saved["platform_id"]))
    if platform is None:
        raise ValueError("platform not registered")

    async with httpx.AsyncClient(timeout=10) as c:
        jr = await c.get(platform.jwks_url)
        jr.raise_for_status()
        jwks_doc = jr.json()

    claims = jose_jwt.decode(
        id_token,
        jwks_doc,
        algorithms=["RS256"],
        audience=platform.client_id,
        issuer=platform.issuer,
        options={"verify_at_hash": False},
    )
    if claims.get("nonce") != saved["nonce"]:
        raise ValueError("launch JWT nonce mismatch")
    return platform, claims


# ---------------------------------------------------------------------------
# Tool-side JWT (used for AGS grade passback)
# ---------------------------------------------------------------------------


async def sign_tool_jwt(
    db: AsyncSession,
    *,
    platform: LtiPlatform,
    claims: dict,
    ttl_sec: int = 300,
) -> str:
    """Sign a JWT with our active RSA key for sending to the platform."""
    key = await ensure_active_signing_key(db)
    private_pem = decrypt(key.private_pem_encrypted)
    now = int(time.time())
    payload = {
        "iss": claims.get("iss") or f"https://eureka/api/v1/lti",
        "aud": platform.auth_token_aud or platform.auth_token_url,
        "iat": now,
        "exp": now + ttl_sec,
        "jti": secrets.token_urlsafe(16),
        **claims,
    }
    return jose_jwt.encode(payload, private_pem, algorithm="RS256",
                          headers={"kid": key.kid})


async def request_platform_token(
    db: AsyncSession,
    *,
    platform: LtiPlatform,
    scope: str = "https://purl.imsglobal.org/spec/lti-ags/scope/score",
) -> str:
    """Get an access token from the platform's auth_token endpoint
    via the client_credentials + JWT-bearer flow."""
    jwt_assertion = await sign_tool_jwt(
        db, platform=platform,
        claims={"sub": platform.client_id},
        ttl_sec=300,
    )
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.post(
            platform.auth_token_url,
            data={
                "grant_type": "client_credentials",
                "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                "client_assertion": jwt_assertion,
                "scope": scope,
            },
            headers={"Accept": "application/json"},
        )
        r.raise_for_status()
        return r.json()["access_token"]


async def post_grade(
    db: AsyncSession,
    *,
    platform: LtiPlatform,
    lineitem_url: str,
    user_sub: str,
    score_given: float,
    score_maximum: float,
    activity_progress: str = "Completed",
    grading_progress: str = "FullyGraded",
    comment: str | None = None,
) -> dict:
    """POST a Score message to the platform's AGS lineitem endpoint."""
    access_token = await request_platform_token(db, platform=platform)
    body = {
        "userId": user_sub,
        "scoreGiven": score_given,
        "scoreMaximum": score_maximum,
        "activityProgress": activity_progress,
        "gradingProgress": grading_progress,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    if comment:
        body["comment"] = comment
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.post(
            f"{lineitem_url}/scores",
            json=body,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/vnd.ims.lis.v1.score+json",
            },
        )
        r.raise_for_status()
        try:
            return r.json()
        except Exception:
            return {"ok": True, "status": r.status_code}


# ---------------------------------------------------------------------------
# xAPI export (a small bonus — exports an attempt as an xAPI statement)
# ---------------------------------------------------------------------------


def attempt_to_xapi(*, user_email: str, item_id: UUID, is_correct: bool,
                    score: float | None = None,
                    activity_name: str = "Practice Item") -> dict:
    """Convert an attempt into an xAPI statement. Useful for LRS exports."""
    return {
        "actor": {"mbox": f"mailto:{user_email}"},
        "verb": {
            "id": (
                "http://adlnet.gov/expapi/verbs/passed"
                if is_correct
                else "http://adlnet.gov/expapi/verbs/failed"
            ),
            "display": {"en-US": "passed" if is_correct else "failed"},
        },
        "object": {
            "id": f"urn:eureka:item:{item_id}",
            "definition": {
                "name": {"en-US": activity_name},
                "type": "http://adlnet.gov/expapi/activities/assessment",
            },
        },
        "result": {
            "success": is_correct,
            "score": {"scaled": score} if score is not None else None,
        },
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
