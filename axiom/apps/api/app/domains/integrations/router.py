"""Integrations routes: LTI 1.3 handshake, platform registration, AGS, OneRoster.

The LTI handshake endpoints (jwks, login, launch) are public because they are
called by the LMS and the browser, not an AXIOM session. Registration, AGS score
posting, and OneRoster sync are gated to admin/teaching roles.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from shared_schemas.identity import UserOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_session
from app.core.security import require_roles
from app.domains.integrations import keys, lti, oneroster
from app.domains.integrations.models import LtiLaunch, LtiPlatform

router = APIRouter(prefix="/integrations", tags=["integrations"])

admin_only = require_roles("org_admin", "super_admin")
teacher_only = require_roles("teacher", "org_admin", "super_admin", "author")


class PlatformBody(BaseModel):
    issuer: str
    client_id: str
    auth_login_url: str
    auth_token_url: str = ""
    deployment_id: str | None = None
    name: str = ""
    jwks_url: str | None = None
    public_key_pem: str | None = None


class ScoreBody(BaseModel):
    given: float
    maximum: float = 1.0


# --- LTI handshake (public) ---------------------------------------------


@router.get("/lti/jwks", summary="The tool's public JWKS (LTI 1.3)")
async def jwks() -> dict:
    return keys.public_jwks()


@router.api_route("/lti/login", methods=["GET", "POST"], summary="LTI 1.3 OIDC login init")
async def login(
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    params = dict(request.query_params)
    if request.method == "POST":
        form = await request.form()
        params.update({k: str(v) for k, v in form.items()})
    issuer = params.get("iss")
    login_hint = params.get("login_hint")
    target_link_uri = params.get("target_link_uri")
    if not issuer or not login_hint or not target_link_uri:
        raise HTTPException(status_code=400, detail="missing iss/login_hint/target_link_uri")
    platform = await lti.get_platform(session, issuer)
    if platform is None:
        raise HTTPException(status_code=400, detail=f"unregistered platform: {issuer}")
    redirect = await lti.build_login_redirect(
        session,
        platform,
        login_hint=login_hint,
        target_link_uri=target_link_uri,
        lti_message_hint=params.get("lti_message_hint"),
    )
    await session.commit()
    return RedirectResponse(url=redirect, status_code=302)


@router.post("/lti/launch", summary="LTI 1.3 resource-link launch")
async def launch(
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    form = await request.form()
    id_token = form.get("id_token")
    state = form.get("state")
    if not id_token or not state:
        raise HTTPException(status_code=400, detail="missing id_token/state")
    try:
        claims = await lti.validate_launch(session, id_token=str(id_token), state=str(state))
        platform = await lti.get_platform(session, claims["iss"])
        if platform is None:
            raise ValueError("platform vanished")
        _user, _launch, token = await lti.provision_launch(session, platform, claims)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"LTI launch rejected: {exc}") from exc
    await session.commit()
    web = get_settings().web_base_url.rstrip("/")
    return RedirectResponse(url=f"{web}/dashboard#access_token={token}", status_code=302)


# --- registration + AGS + OneRoster (gated) -----------------------------


@router.post("/lti/platforms", summary="Register or update an LTI platform (admin)")
async def register_platform(
    body: PlatformBody,
    session: AsyncSession = Depends(get_session),
    admin: UserOut = Depends(admin_only),
) -> dict:
    existing = (
        await session.execute(select(LtiPlatform).where(LtiPlatform.issuer == body.issuer))
    ).scalar_one_or_none()
    if existing is None:
        existing = LtiPlatform(issuer=body.issuer, client_id=body.client_id,
                               auth_login_url=body.auth_login_url)
        session.add(existing)
    existing.client_id = body.client_id
    existing.auth_login_url = body.auth_login_url
    existing.auth_token_url = body.auth_token_url
    existing.deployment_id = body.deployment_id
    existing.name = body.name
    existing.jwks_url = body.jwks_url
    existing.public_key_pem = body.public_key_pem
    await session.flush()
    await session.commit()
    return {"id": str(existing.id), "issuer": existing.issuer}


@router.post("/lti/launches/{launch_id}/score", summary="Post a grade back via AGS (teacher)")
async def post_score(
    launch_id: str,
    body: ScoreBody,
    session: AsyncSession = Depends(get_session),
    teacher: UserOut = Depends(teacher_only),
) -> dict:
    try:
        parsed = uuid.UUID(launch_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="invalid launch id") from exc
    launch = (
        await session.execute(select(LtiLaunch).where(LtiLaunch.id == parsed))
    ).scalar_one_or_none()
    if launch is None:
        raise HTTPException(status_code=404, detail="launch not found")
    return await lti.post_score(session, launch, given=body.given, maximum=body.maximum)


@router.post("/oneroster/sync", summary="Sync a OneRoster roster payload (admin)")
async def oneroster_sync(
    payload: dict,
    session: AsyncSession = Depends(get_session),
    admin: UserOut = Depends(admin_only),
) -> dict:
    result = await oneroster.sync_roster(session, payload)
    await session.commit()
    return result
