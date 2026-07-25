"""LTI 1.3 tool-provider service.

The three moving parts of an LTI 1.3 launch:

1. OIDC login init: the platform hits our login endpoint; we mint a state and
   nonce and redirect the browser to the platform's auth endpoint.
2. Launch: the platform posts back a signed id_token; we verify it (RS256 via the
   platform's pinned key or JWKS), check the nonce/state we issued, extract the
   LTI claims, resolve the user, and hand them an OCTET session.
3. AGS grade passback: using the tool's key, we get a client-credentials token
   from the platform and POST a score to the line item.

Verification uses the platform's pinned public key when present (offline and
tests) and its JWKS URL otherwise (production). AGS needs a live platform, so it
is written to fail soft and report rather than raise.

OCTET owns no accounts. Where AXIOM provisions a user row, OCTET derives a
stable user id from the issuer and subject and mints the same HS256 token
EUREKA issues, which app.core.security already verifies. That keeps the launch
inside the existing identity layer instead of opening a second one.
"""

from __future__ import annotations

import secrets
import time
import urllib.parse
import uuid
from datetime import UTC, datetime

import httpx
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import Principal
from app.domains.integrations import keys
from app.domains.integrations.models import LtiLaunch, LtiNonce, LtiPlatform

CLAIM = "https://purl.imsglobal.org/spec/lti/claim"
AGS = "https://purl.imsglobal.org/spec/lti-ags"

# Namespace for the derived OCTET user id. It is a fixed value so the same
# learner launching twice from the same LMS resolves to the same id.
_LTI_USER_NAMESPACE = uuid.UUID("6f9c1d1e-4f2a-5b7c-9d3e-0a1b2c3d4e5f")

# LTI role URN fragments mapped to OCTET roles. Longest, most specific first.
_ROLE_MAP = [
    ("administrator", "org_admin"),
    ("instructor", "teacher"),
    ("teachingassistant", "teacher"),
    ("contentdeveloper", "author"),
    ("learner", "student"),
    ("student", "student"),
]


def map_lti_roles(lti_roles: list[str] | None) -> list[str]:
    """Map LTI role URNs to OCTET role names (deduped, student as the floor)."""
    out: list[str] = []
    for role in lti_roles or []:
        low = role.lower()
        for needle, octet_role in _ROLE_MAP:
            if needle in low and octet_role not in out:
                out.append(octet_role)
    return out or ["student"]


def derive_user_id(issuer: str, sub: str) -> str:
    """The OCTET user id for a launched subject.

    Two different platforms can hand out the same subject string, so the issuer
    is part of the input. This is a derivation and not a record: OCTET holds no
    account for the learner.
    """
    return str(uuid.uuid5(_LTI_USER_NAMESPACE, f"{issuer}|{sub}"))


async def get_platform(session: AsyncSession, issuer: str) -> LtiPlatform | None:
    return (
        await session.execute(select(LtiPlatform).where(LtiPlatform.issuer == issuer))
    ).scalar_one_or_none()


async def build_login_redirect(
    session: AsyncSession,
    platform: LtiPlatform,
    *,
    login_hint: str,
    target_link_uri: str,
    lti_message_hint: str | None,
) -> str:
    """Store a state/nonce and return the platform OIDC auth redirect URL."""
    state = secrets.token_urlsafe(24)
    nonce = secrets.token_urlsafe(24)
    session.add(LtiNonce(state=state, nonce=nonce, issuer=platform.issuer))
    await session.flush()

    params = {
        "scope": "openid",
        "response_type": "id_token",
        "response_mode": "form_post",
        "prompt": "none",
        "client_id": platform.client_id,
        "redirect_uri": target_link_uri,
        "login_hint": login_hint,
        "state": state,
        "nonce": nonce,
    }
    if lti_message_hint:
        params["lti_message_hint"] = lti_message_hint
    return f"{platform.auth_login_url}?{urllib.parse.urlencode(params)}"


async def _platform_key(platform: LtiPlatform, id_token: str) -> str:
    """The verification key: the pinned PEM if present, else fetched from JWKS.

    A platform with neither raises. There is no unverified path out of here.
    """
    if platform.public_key_pem:
        return platform.public_key_pem
    if not platform.jwks_url:
        raise ValueError("platform has neither a pinned key nor a JWKS URL")
    timeout = get_settings().lti_http_timeout_seconds
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.get(platform.jwks_url)
        resp.raise_for_status()
        jwks = resp.json()
    header = jwt.get_unverified_header(id_token)
    for key in jwks.get("keys", []):
        if key.get("kid") == header.get("kid"):
            return jwt.algorithms.RSAAlgorithm.from_jwk(key)  # type: ignore[return-value]
    raise ValueError("no matching JWKS key for the id_token kid")


async def validate_launch(session: AsyncSession, *, id_token: str, state: str) -> dict:
    """Validate an LTI launch id_token and return its claims.

    Raises ValueError on any failure (bad state, bad signature, expired token,
    nonce mismatch, unknown platform). The router turns that into a 400.
    """
    stored = (
        await session.execute(select(LtiNonce).where(LtiNonce.state == state))
    ).scalar_one_or_none()
    if stored is None:
        raise ValueError("unknown or expired launch state")

    unverified = jwt.decode(id_token, options={"verify_signature": False})
    issuer = unverified.get("iss")
    if issuer != stored.issuer:
        raise ValueError("issuer does not match the login request")
    platform = await get_platform(session, issuer)
    if platform is None:
        raise ValueError(f"unregistered platform: {issuer}")

    key = await _platform_key(platform, id_token)
    try:
        claims = jwt.decode(
            id_token,
            key=key,
            algorithms=["RS256"],
            audience=platform.client_id,
            options={"verify_aud": True, "verify_exp": True},
        )
    except jwt.PyJWTError as exc:
        raise ValueError(f"id_token verification failed: {exc}") from exc
    if claims.get("nonce") != stored.nonce:
        raise ValueError("nonce mismatch")

    # One-time use: consume the state so the id_token cannot be replayed.
    await session.delete(stored)
    await session.flush()
    return claims


def claims_to_principal(claims: dict) -> Principal:
    roles = map_lti_roles(claims.get(f"{CLAIM}/roles"))
    name = claims.get("name") or " ".join(
        part for part in (claims.get("given_name"), claims.get("family_name")) if part
    )
    issuer = str(claims.get("iss"))
    sub = str(claims.get("sub"))
    return Principal(
        user_id=derive_user_id(issuer, sub),
        email=claims.get("email") or "",
        display_name=name or "",
        roles=tuple(roles),
        org_id="",
    )


async def provision_launch(
    session: AsyncSession, platform: LtiPlatform, claims: dict
) -> tuple[Principal, LtiLaunch, str]:
    """Resolve the launched user, record the launch, and mint an OCTET session.

    The token is the same HS256 shape EUREKA issues, so the launched learner is
    signed in through app.core.security rather than through a second identity
    path OCTET would then have to own.
    """
    principal = claims_to_principal(claims)

    resource_link = claims.get(f"{CLAIM}/resource_link") or {}
    context = claims.get(f"{CLAIM}/context") or {}
    ags = claims.get(f"{AGS}/claim/endpoint") or {}
    launch = LtiLaunch(
        platform_id=platform.id,
        user_id=principal.user_id,
        sub=str(claims.get("sub")),
        resource_link_id=resource_link.get("id"),
        context_id=context.get("id"),
        roles=list(principal.roles),
        message_type=claims.get(f"{CLAIM}/message_type", ""),
        ags_lineitem_url=ags.get("lineitem"),
    )
    session.add(launch)
    await session.flush()

    settings = get_settings()
    token = jwt.encode(
        {
            "sub": principal.user_id,
            "email": principal.email,
            "display_name": principal.display_name,
            "roles": list(principal.roles),
            "iat": int(time.time()),
            "exp": int(time.time()) + 3600,
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return principal, launch, token


async def post_score(
    session: AsyncSession,
    launch: LtiLaunch,
    *,
    given: float,
    maximum: float,
) -> dict:
    """Post a score back to the platform via AGS. Fail-soft.

    Returns {ok, detail}. This requires a live platform token endpoint and AGS
    line item; without them it reports why rather than raising, so a grade sync
    never takes the request down.
    """
    if not launch.ags_lineitem_url:
        return {"ok": False, "detail": "launch has no AGS line item"}
    platform = (
        await session.execute(
            select(LtiPlatform).where(LtiPlatform.id == launch.platform_id)
        )
    ).scalar_one_or_none()
    if platform is None or not platform.auth_token_url:
        return {"ok": False, "detail": "platform has no token endpoint"}

    assertion = keys.sign_rs256(
        {
            "iss": platform.client_id,
            "sub": platform.client_id,
            "aud": platform.auth_token_url,
            "iat": int(time.time()),
            "exp": int(time.time()) + 300,
            "jti": secrets.token_urlsafe(16),
        }
    )
    score_scope = f"{AGS}/scope/score"
    timeout = get_settings().lti_http_timeout_seconds
    try:
        async with httpx.AsyncClient(timeout=timeout) as c:
            token_resp = await c.post(
                platform.auth_token_url,
                data={
                    "grant_type": "client_credentials",
                    "client_assertion_type": (
                        "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
                    ),
                    "client_assertion": assertion,
                    "scope": score_scope,
                },
            )
            token_resp.raise_for_status()
            access = token_resp.json().get("access_token")
            score_url = launch.ags_lineitem_url.rstrip("/") + "/scores"
            score_resp = await c.post(
                score_url,
                headers={
                    "Authorization": f"Bearer {access}",
                    "Content-Type": "application/vnd.ims.lis.v1.score+json",
                },
                json={
                    "userId": launch.sub,
                    "scoreGiven": given,
                    "scoreMaximum": maximum,
                    "activityProgress": "Completed",
                    "gradingProgress": "FullyGraded",
                    "timestamp": datetime.now(UTC).isoformat(),
                },
            )
            score_resp.raise_for_status()
        return {"ok": True, "detail": "score posted"}
    except Exception as exc:  # noqa: BLE001 - never fail the caller on a passback.
        return {"ok": False, "detail": f"AGS passback failed: {exc}"}
