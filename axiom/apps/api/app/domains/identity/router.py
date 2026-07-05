"""Identity routes."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from shared_schemas.identity import UserOut

from app.core.config import Settings, get_settings
from app.core.security import get_current_user

router = APIRouter(prefix="/me", tags=["identity"])


@router.get("", response_model=UserOut, summary="The signed-in user")
async def read_me(user: UserOut = Depends(get_current_user)) -> UserOut:
    """Return the AXIOM user synced from the verified EUREKA token."""
    return user


auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/dev-login", summary="Provision a local development session")
async def dev_login(settings: Settings = Depends(get_settings)) -> dict:
    """Mint a short-lived token so a developer can open AXIOM directly, without
    the EUREKA round trip.

    Disabled in production (returns 403). The token is signed with the same
    secret AXIOM verifies against, and carries an org_admin role so every
    feature, including the teacher tools, is reachable during local use. In a
    real deployment the token still comes from EUREKA; this is a convenience for
    running the vertical on its own.
    """
    if settings.is_production:
        raise HTTPException(status_code=403, detail="dev-login is disabled in production")

    import jwt

    now = datetime.now(UTC)
    claims = {
        "sub": "axiom-dev-user",
        "email": "dev@axiom.local",
        "display_name": "AXIOM Dev",
        "role": "org_admin",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=12)).timestamp()),
    }
    token = jwt.encode(
        claims, settings.eureka_jwt_secret, algorithm=settings.eureka_jwt_algorithm
    )
    return {"access_token": token, "token_type": "bearer"}
