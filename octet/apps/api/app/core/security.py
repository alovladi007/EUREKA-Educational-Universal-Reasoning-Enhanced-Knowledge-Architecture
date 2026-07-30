"""EUREKA SSO bridge.

OCTET verifies tokens EUREKA issued. It does not own accounts, passwords or
sessions. The verifier sits behind a Protocol so the HMAC shared secret path
used in development can be replaced by JWKS in production without touching
call sites.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from typing import Protocol

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import Settings, get_settings


class InvalidTokenError(Exception):
    pass


@dataclass(frozen=True)
class Principal:
    user_id: str
    email: str = ""
    display_name: str = ""
    roles: tuple[str, ...] = ()
    org_id: str = ""


class EurekaIdentity(Protocol):
    def verify(self, token: str) -> Principal: ...


class HmacJwtEurekaIdentity:
    """Verify a EUREKA HS256 token with the shared secret."""

    def __init__(self, secret: str, algorithm: str = "HS256") -> None:
        self._secret = secret
        self._algorithm = algorithm

    def verify(self, token: str) -> Principal:
        try:
            claims = jwt.decode(token, self._secret, algorithms=[self._algorithm])
        except jwt.PyJWTError as exc:
            raise InvalidTokenError(str(exc)) from exc
        subject = claims.get("sub")
        if not subject:
            raise InvalidTokenError("token has no subject")
        # EUREKA signs access and refresh tokens with the same secret and
        # marks them apart with a type claim. A refresh token is a credential
        # for minting access tokens, not for using APIs, so accepting one here
        # would widen what a stolen refresh token is worth. Tokens without a
        # type claim still pass, because LTI-derived and older EUREKA tokens
        # do not carry one; only an explicit non-access type is refused.
        token_type = claims.get("type")
        if token_type is not None and token_type != "access":
            raise InvalidTokenError(f"a {token_type} token cannot be used as an access token")
        roles = claims.get("roles") or ([claims["role"]] if claims.get("role") else [])
        return Principal(
            user_id=str(subject),
            email=claims.get("email", ""),
            display_name=claims.get("display_name") or claims.get("name", ""),
            roles=tuple(roles),
            org_id=str(claims.get("org_id") or claims.get("tenant_id") or ""),
        )


class MockEurekaIdentity:
    """Development only. Refuses to run in production."""

    def __init__(self, settings: Settings) -> None:
        if settings.is_production:
            raise RuntimeError("the mock identity provider must never run in production")

    def verify(self, token: str) -> Principal:
        return Principal(user_id=token or "dev-user", email="dev@example.com", roles=("student",))


class JwksEurekaIdentity:
    """Production path. Not implemented until the Phase 0 contract is signed.

    It raises rather than falling back to a weaker check, so a misconfigured
    deployment fails loudly instead of accepting unverified tokens.
    """

    def verify(self, token: str) -> Principal:
        raise NotImplementedError(
            "JWKS verification is pending the EUREKA integration contract (Section 17)"
        )


@lru_cache
def get_identity() -> EurekaIdentity:
    settings = get_settings()
    if settings.identity_provider == "mock":
        return MockEurekaIdentity(settings)
    if settings.identity_provider == "jwks":
        return JwksEurekaIdentity()
    return HmacJwtEurekaIdentity(settings.jwt_secret, settings.jwt_algorithm)


_bearer = HTTPBearer(auto_error=True)


async def get_current_principal(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> Principal:
    try:
        return get_identity().verify(credentials.credentials)
    except InvalidTokenError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"invalid token: {exc}") from exc
    except NotImplementedError as exc:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, str(exc)) from exc


def require_roles(*allowed: str):
    """Return a dependency that admits a principal holding any allowed role.

    The roles are the ones EUREKA puts in the token, so OCTET authorises
    against them without ever owning the account they describe.
    """

    async def _guard(principal: Principal = Depends(get_current_principal)) -> Principal:
        if allowed and not (set(principal.roles) & set(allowed)):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "You do not have permission to access this resource.",
            )
        return principal

    return _guard
