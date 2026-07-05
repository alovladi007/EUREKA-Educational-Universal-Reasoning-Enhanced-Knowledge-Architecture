"""EUREKA SSO bridge and RBAC.

AXIOM does not run its own password system. It verifies EUREKA-issued bearer
tokens and syncs a minimal user record. Verification sits behind the
EurekaIdentity interface so the backend is swappable:

  MockEurekaIdentity  - accepts any token, returns a fixed dev principal. Local
                        development only. Selecting it in production raises.
  HmacJwtEurekaIdentity - verifies EUREKA HS256 JWTs with the shared secret and
                        reads the sub, email, display name, roles, and tenant
                        claims. This is the real dev and staging bridge.
  jwks (planned)      - verify against EUREKA JWKS in production. Not built in
                        Phase 0; selecting it raises so we fail loud rather than
                        silently accepting tokens.

Everything is kept behind the interface so Phase 0 through Phase 2 can run
against the mock while the production JWKS contract is confirmed (Section 17 of
the build spec).
"""

from __future__ import annotations

from functools import lru_cache
from typing import Protocol

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from shared_schemas.identity import Principal, UserOut
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.db import get_session

_bearer = HTTPBearer(auto_error=False)


class InvalidTokenError(Exception):
    """Raised when a token cannot be verified."""


class EurekaIdentity(Protocol):
    """Verifies an EUREKA-issued token and returns the principal."""

    def verify(self, token: str) -> Principal: ...


class MockEurekaIdentity:
    """Development-only identity provider. Accepts any token.

    Returns a stable fixed principal so a developer can exercise the full
    authenticated flow without a running EUREKA. Never enable in production.
    """

    _FIXED = Principal(
        sub="00000000-0000-0000-0000-000000000001",
        email="dev.student@axiom.local",
        display_name="Dev Student",
        roles=["student"],
        tenant_id=None,
    )

    def verify(self, token: str) -> Principal:  # noqa: ARG002 - token ignored by design
        return self._FIXED


class HmacJwtEurekaIdentity:
    """Verifies EUREKA HS256 JWTs with the shared secret.

    EUREKA (api-core) mints access tokens as HS256 with a shared secret and at
    minimum a sub claim (the user id). Optional email, display_name, roles, and
    tenant claims are read when present; otherwise a minimal profile is derived
    from the sub. Full profile enrichment (a pull sync against EUREKA
    /api/v1/auth/me) is handled by the identity service, not here.
    """

    def __init__(self, secret: str, algorithm: str = "HS256", audience: str | None = None):
        self._secret = secret
        self._algorithm = algorithm
        self._audience = audience

    def verify(self, token: str) -> Principal:
        import jwt  # PyJWT

        options = {"verify_aud": self._audience is not None}
        try:
            claims = jwt.decode(
                token,
                self._secret,
                algorithms=[self._algorithm],
                audience=self._audience,
                options=options,
            )
        except Exception as exc:  # jwt.PyJWTError and friends
            raise InvalidTokenError(str(exc)) from exc

        sub = claims.get("sub")
        if not sub:
            raise InvalidTokenError("token missing sub claim")

        roles = claims.get("roles")
        if isinstance(roles, str):
            roles = [roles]
        single_role = claims.get("role")
        if not roles and single_role:
            roles = [single_role]

        return Principal(
            sub=str(sub),
            email=claims.get("email"),
            display_name=claims.get("display_name") or claims.get("name"),
            roles=roles or [],
            tenant_id=claims.get("tenant_id") or claims.get("org_id"),
        )


@lru_cache
def get_identity(settings: Settings | None = None) -> EurekaIdentity:
    settings = settings or get_settings()
    if settings.identity_provider == "mock":
        if settings.is_production:
            raise RuntimeError("MockEurekaIdentity must not be used in production")
        return MockEurekaIdentity()
    if settings.identity_provider == "hmac":
        return HmacJwtEurekaIdentity(
            secret=settings.eureka_jwt_secret,
            algorithm=settings.eureka_jwt_algorithm,
            audience=settings.eureka_jwt_audience,
        )
    # jwks is reserved for production and not implemented in Phase 0.
    raise NotImplementedError(
        "identity_provider 'jwks' is not implemented in Phase 0. "
        "Use 'hmac' with the shared secret, or 'mock' for local development."
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    session: AsyncSession = Depends(get_session),
) -> UserOut:
    """FastAPI dependency: verify the bearer token and sync the user.

    The token is verified through the configured identity provider, then the
    identity service upserts the user (sync-on-first-touch) and returns the
    persisted record shaped as UserOut.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token. Sign in through EUREKA.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # get_identity is cached and reads settings internally; do not pass the
    # unhashable Settings instance into the lru_cache.
    identity = get_identity()
    try:
        principal = identity.verify(credentials.credentials)
    except (InvalidTokenError, NotImplementedError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    # Imported here to avoid a circular import at module load time.
    from app.domains.identity.service import sync_user_from_principal

    return await sync_user_from_principal(session, principal)


def require_roles(*allowed: str):
    """Return a dependency that enforces the user has at least one allowed role."""

    async def _guard(user: UserOut = Depends(get_current_user)) -> UserOut:
        if allowed and not (set(user.roles) & set(allowed)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )
        return user

    return _guard
