"""
Institutional / B2B endpoints — Phase 9 Sessions 9.1 + 9.2 + 9.3 + 9.4.

Mounted under /api/v1.

Cohorts (9.1)
  POST   /cohorts                                  create (org admin)
  GET    /cohorts                                  list mine + org's
  GET    /cohorts/{id}                             read
  POST   /cohorts/{id}/members                     add member
  DELETE /cohorts/{id}/members/{user_id}           remove member (sets left_at)
  GET    /cohorts/{id}/members                     list members
  POST   /cohorts/{id}/blueprints                  link blueprint
  GET    /cohorts/{id}/blueprints                  list linked blueprints

Cohort analytics (9.3)
  GET    /cohorts/{id}/analytics                   aggregate dashboard
  GET    /cohorts/{id}/at-risk                     ranked at-risk roster
                                                    with explanations

SSO (9.4)
  POST   /sso/configs                              create (org admin)
  GET    /sso/configs                              list mine
  GET    /sso/{config_id}/authorize                redirect to IdP
  POST   /sso/{config_id}/callback                 handle IdP callback

LTI 1.3 (9.2)
  GET    /lti/.well-known/jwks.json                publish our JWKS
  POST   /lti/platforms                            register a platform
  GET    /lti/platforms                            list
  POST   /lti/launch/initiate                      OIDC init (from LMS)
  POST   /lti/launch                               launch (signed JWT from LMS)
  POST   /lti/grade                                grade passback to LMS
"""

from __future__ import annotations

import secrets
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.exam import ExamBlueprint
from app.models.institutional import (
    Cohort, CohortBlueprint, CohortMembership, CohortRole, CohortStatus,
    LtiPlatform, SsoIdpConfig, SsoProtocol,
)
from app.models.user import User
from app.schemas.institutional import (
    CohortBlueprintLink, CohortCreate, CohortMembershipCreate,
    CohortMembershipResponse, CohortResponse,
    LtiGradeRequest, LtiPlatformCreate, LtiPlatformResponse,
    SsoConfigCreate, SsoConfigResponse,
)
from app.services.cohort_analytics import aggregate as cohort_aggregate, at_risk
from app.services.lti import (
    build_oidc_redirect, find_platform, jwks as lti_jwks, post_grade,
    verify_launch_jwt,
)
from app.services.sso import (
    build_authorize_url, encrypt_client_secret, exchange_code,
    issue_session_tokens, upsert_user_from_claims, validate_id_token,
)
from app.utils.dependencies import get_current_user


router = APIRouter()


def _require_admin(user: User) -> None:
    role = user.role.value if hasattr(user.role, "value") else user.role
    if role not in ("org_admin", "super_admin", "teacher"):
        raise HTTPException(status_code=403, detail="institutional admin role required")


# ---------------------------------------------------------------------------
# Cohorts (9.1)
# ---------------------------------------------------------------------------


@router.post("/cohorts", response_model=CohortResponse, status_code=201)
async def create_cohort(
    payload: CohortCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Cohort:
    _require_admin(current_user)
    c = Cohort(
        org_id=current_user.org_id,
        slug=payload.slug,
        name=payload.name,
        description=payload.description,
        target_skill_codes=payload.target_skill_codes,
        target_mastery=payload.target_mastery,
        min_weekly_attempts=payload.min_weekly_attempts,
        starts_at=payload.starts_at,
        ends_at=payload.ends_at,
        status=CohortStatus.PLANNING,
    )
    db.add(c)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if "cohort_slug_per_org" in str(exc):
            raise HTTPException(status_code=409, detail="slug already in use for this org") from exc
        raise
    await db.refresh(c)
    return c


@router.get("/cohorts", response_model=list[CohortResponse])
async def list_cohorts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Cohort]:
    """
    Admins / instructors see all cohorts in their org. Learners see only
    cohorts they're a member of.
    """
    role = current_user.role.value if hasattr(current_user.role, "value") else current_user.role
    if role in ("org_admin", "super_admin", "teacher"):
        r = await db.execute(
            select(Cohort)
            .where(Cohort.org_id == current_user.org_id)
            .order_by(Cohort.created_at.desc())
        )
    else:
        r = await db.execute(
            select(Cohort)
            .join(CohortMembership, CohortMembership.cohort_id == Cohort.id)
            .where(
                CohortMembership.user_id == current_user.id,
                CohortMembership.left_at.is_(None),
            )
        )
    return list(r.scalars().all())


@router.get("/cohorts/{cohort_id}", response_model=CohortResponse)
async def get_cohort(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Cohort:
    c = await db.get(Cohort, cohort_id)
    if c is None or c.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    return c


@router.post(
    "/cohorts/{cohort_id}/members",
    response_model=CohortMembershipResponse,
    status_code=201,
)
async def add_member(
    cohort_id: UUID,
    payload: CohortMembershipCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CohortMembership:
    _require_admin(current_user)
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    target = await db.get(User, payload.user_id)
    if target is None or target.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="user not found in this org")

    # Revive a soft-deleted membership (same cohort/user/role) instead of inserting a duplicate.
    existing_q = await db.execute(
        select(CohortMembership).where(
            CohortMembership.cohort_id == cohort_id,
            CohortMembership.user_id == payload.user_id,
            CohortMembership.role == payload.role,
        )
    )
    existing = existing_q.scalar_one_or_none()
    if existing is not None:
        if existing.left_at is None:
            raise HTTPException(status_code=409, detail="already a member with that role")
        existing.left_at = None
        existing.joined_at = datetime.utcnow()
        await db.commit()
        await db.refresh(existing)
        return existing

    m = CohortMembership(cohort_id=cohort_id, user_id=payload.user_id, role=payload.role)
    db.add(m)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if "uq_cohort_user_role" in str(exc):
            raise HTTPException(status_code=409, detail="already a member with that role") from exc
        raise
    await db.refresh(m)
    return m


@router.get("/cohorts/{cohort_id}/members", response_model=list[CohortMembershipResponse])
async def list_members(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[CohortMembership]:
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    r = await db.execute(
        select(CohortMembership)
        .where(CohortMembership.cohort_id == cohort_id, CohortMembership.left_at.is_(None))
        .order_by(CohortMembership.joined_at)
    )
    return list(r.scalars().all())


@router.delete("/cohorts/{cohort_id}/members/{user_id}")
async def remove_member(
    cohort_id: UUID,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    _require_admin(current_user)
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    r = await db.execute(
        select(CohortMembership).where(
            CohortMembership.cohort_id == cohort_id,
            CohortMembership.user_id == user_id,
            CohortMembership.left_at.is_(None),
        )
    )
    for m in r.scalars().all():
        m.left_at = datetime.utcnow()
    await db.commit()
    return Response(status_code=204)


@router.post("/cohorts/{cohort_id}/blueprints", status_code=201, response_model=dict)
async def link_blueprint(
    cohort_id: UUID,
    payload: CohortBlueprintLink,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    _require_admin(current_user)
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    bp = await db.get(ExamBlueprint, payload.blueprint_id)
    if bp is None:
        raise HTTPException(status_code=404, detail="blueprint not found")
    link = CohortBlueprint(
        cohort_id=cohort_id, blueprint_id=payload.blueprint_id,
        is_required=payload.is_required, target_date=payload.target_date,
    )
    db.add(link)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if "uq_cohort_blueprint" in str(exc):
            raise HTTPException(status_code=409, detail="already linked") from exc
        raise
    await db.refresh(link)
    return {"id": str(link.id), "blueprint_id": str(link.blueprint_id), "is_required": link.is_required}


@router.get("/cohorts/{cohort_id}/blueprints", response_model=list[dict])
async def list_cohort_blueprints(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    r = await db.execute(
        select(CohortBlueprint).where(CohortBlueprint.cohort_id == cohort_id)
    )
    return [
        {
            "id": str(cb.id),
            "blueprint_id": str(cb.blueprint_id),
            "is_required": cb.is_required,
            "target_date": cb.target_date.isoformat() + "Z" if cb.target_date else None,
        }
        for cb in r.scalars().all()
    ]


# ---------------------------------------------------------------------------
# Cohort analytics (9.3)
# ---------------------------------------------------------------------------


@router.get("/cohorts/{cohort_id}/analytics")
async def cohort_analytics(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Aggregate dashboard for the cohort."""
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    out = await cohort_aggregate(db, cohort_id)
    return {
        "cohort_id": str(out.cohort_id),
        "name": out.name,
        "org_id": str(out.org_id),
        "n_learners": out.n_learners,
        "n_active_learners_7d": out.n_active_learners_7d,
        "target_skill_codes": out.target_skill_codes,
        "target_mastery_threshold": out.target_mastery_threshold,
        "per_skill": out.per_skill,
        "mocks_summary": out.mocks_summary,
        "attempts_total": out.attempts_total,
        "attempts_last_7d": out.attempts_last_7d,
    }


@router.get("/cohorts/{cohort_id}/at-risk", response_model=list[dict])
async def cohort_at_risk(
    cohort_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    """Ranked at-risk roster with per-signal scores and notes."""
    _require_admin(current_user)
    cohort = await db.get(Cohort, cohort_id)
    if cohort is None or cohort.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="cohort not found")
    rows = await at_risk(db, cohort_id)
    return [r.to_dict() for r in rows]


# ---------------------------------------------------------------------------
# SSO (9.4)
# ---------------------------------------------------------------------------


@router.post("/sso/configs", response_model=SsoConfigResponse, status_code=201)
async def create_sso_config(
    payload: SsoConfigCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SsoIdpConfig:
    _require_admin(current_user)
    cfg = SsoIdpConfig(
        org_id=current_user.org_id,
        name=payload.name,
        protocol=payload.protocol,
        issuer=payload.issuer,
        discovery_url=payload.discovery_url,
        client_id=payload.client_id,
        client_secret_encrypted=encrypt_client_secret(payload.client_secret) if payload.client_secret else None,
        attribute_mapping=payload.attribute_mapping,
        default_role=payload.default_role,
        just_in_time_provisioning=payload.just_in_time_provisioning,
        auto_enroll_cohort_id=payload.auto_enroll_cohort_id,
    )
    db.add(cfg)
    await db.commit()
    await db.refresh(cfg)
    return cfg


@router.get("/sso/configs", response_model=list[SsoConfigResponse])
async def list_sso_configs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[SsoIdpConfig]:
    _require_admin(current_user)
    r = await db.execute(
        select(SsoIdpConfig).where(SsoIdpConfig.org_id == current_user.org_id)
    )
    return list(r.scalars().all())


@router.get("/sso/{config_id}/authorize")
async def sso_authorize(
    config_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> RedirectResponse:
    """
    Public endpoint — no auth required (the user isn't logged in yet).
    Looks up the IdP config and 302s to its authorization URL.
    """
    cfg = await db.get(SsoIdpConfig, config_id)
    if cfg is None or not cfg.is_active:
        raise HTTPException(status_code=404, detail="SSO config not found")
    if cfg.protocol != SsoProtocol.OIDC:
        raise HTTPException(status_code=400, detail="only OIDC supported in 9.4 v1")

    state = secrets.token_urlsafe(24)
    nonce = secrets.token_urlsafe(24)
    redirect_uri = str(request.url_for("sso_callback", config_id=config_id))
    url = await build_authorize_url(
        cfg=cfg, redirect_uri=redirect_uri, state=state, nonce=nonce
    )

    response = RedirectResponse(url, status_code=302)
    response.set_cookie("sso_state", state, max_age=600, httponly=True, samesite="lax")
    response.set_cookie("sso_nonce", nonce, max_age=600, httponly=True, samesite="lax")
    return response


@router.get("/sso/{config_id}/callback", name="sso_callback")
async def sso_callback(
    config_id: UUID,
    request: Request,
    code: str = Query(...),
    state: str = Query(...),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Public endpoint — receives the IdP's response and issues our JWT."""
    cookie_state = request.cookies.get("sso_state")
    cookie_nonce = request.cookies.get("sso_nonce") or ""
    if cookie_state != state:
        raise HTTPException(status_code=400, detail="state mismatch")

    cfg = await db.get(SsoIdpConfig, config_id)
    if cfg is None or not cfg.is_active:
        raise HTTPException(status_code=404, detail="SSO config not found")

    redirect_uri = str(request.url_for("sso_callback", config_id=config_id))
    tokens = await exchange_code(cfg=cfg, code=code, redirect_uri=redirect_uri)
    id_token = tokens.get("id_token")
    if not id_token:
        raise HTTPException(status_code=400, detail="IdP did not return id_token")
    claims = await validate_id_token(cfg=cfg, id_token=id_token, nonce=cookie_nonce)
    user = await upsert_user_from_claims(db, cfg=cfg, claims=claims)
    return await issue_session_tokens(user)


# ---------------------------------------------------------------------------
# LTI 1.3 (9.2)
# ---------------------------------------------------------------------------


@router.get("/lti/.well-known/jwks.json")
async def lti_publish_jwks(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Public endpoint — the LMS's GET to discover our public keys.
    Lazily generates a fresh RSA keypair on first access if none exists."""
    from app.services.lti import ensure_active_signing_key
    await ensure_active_signing_key(db)
    return await lti_jwks(db)


@router.post("/lti/platforms", response_model=LtiPlatformResponse, status_code=201)
async def register_lti_platform(
    payload: LtiPlatformCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LtiPlatform:
    _require_admin(current_user)
    p = LtiPlatform(
        org_id=current_user.org_id,
        issuer=payload.issuer,
        client_id=payload.client_id,
        deployment_id=payload.deployment_id,
        auth_login_url=payload.auth_login_url,
        auth_token_url=payload.auth_token_url,
        auth_token_aud=payload.auth_token_aud,
        jwks_url=payload.jwks_url,
        target_cohort_id=payload.target_cohort_id,
    )
    db.add(p)
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if "uq_lti_platform" in str(exc):
            raise HTTPException(status_code=409, detail="platform already registered") from exc
        raise
    await db.refresh(p)
    return p


@router.get("/lti/platforms", response_model=list[LtiPlatformResponse])
async def list_lti_platforms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[LtiPlatform]:
    _require_admin(current_user)
    r = await db.execute(
        select(LtiPlatform).where(LtiPlatform.org_id == current_user.org_id)
    )
    return list(r.scalars().all())


@router.post("/lti/launch/initiate")
async def lti_oidc_initiate(
    request: Request,
    iss: str = Form(...),
    client_id: str | None = Form(default=None),
    login_hint: str = Form(...),
    lti_message_hint: str | None = Form(default=None),
    target_link_uri: str = Form(...),
    db: AsyncSession = Depends(get_db),
) -> RedirectResponse:
    """The LMS hits this first. We redirect to the LMS's auth endpoint."""
    platform = await find_platform(db, issuer=iss, client_id=client_id or "")
    if platform is None:
        raise HTTPException(status_code=400, detail="LTI platform not registered")
    redirect_uri = str(request.url_for("lti_launch"))
    url, _, _ = build_oidc_redirect(
        platform=platform, login_hint=login_hint,
        lti_message_hint=lti_message_hint, target_link_uri=target_link_uri,
        redirect_uri=redirect_uri,
    )
    return RedirectResponse(url, status_code=302)


@router.post("/lti/launch", name="lti_launch")
async def lti_launch(
    id_token: str = Form(...),
    state: str = Form(...),
    db: AsyncSession = Depends(get_db),
) -> JSONResponse:
    """The LMS POSTs here after the OIDC handshake. We verify + provision."""
    try:
        platform, claims = await verify_launch_jwt(
            db, id_token=id_token, state=state,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"launch verification failed: {exc}") from exc

    # Minimum-viable user mapping: claims["email"] → org user, JIT if not present.
    email = claims.get("email") or claims.get("preferred_username")
    if not email:
        raise HTTPException(status_code=400, detail="LTI claim missing email")

    # Cheap user upsert under the platform's org
    user_r = await db.execute(
        select(User).where(User.org_id == platform.org_id, User.email == email)
    )
    user = user_r.scalar_one_or_none()
    if user is None:
        from app.utils.auth import hash_password as _hp
        user = User(
            org_id=platform.org_id,
            email=email,
            hashed_password=_hp(secrets.token_urlsafe(32)),
            first_name=claims.get("given_name") or "LTI",
            last_name=claims.get("family_name") or "User",
            role="student",
            is_active=True,
            is_email_verified=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    tokens = await issue_session_tokens(user)
    return JSONResponse({
        **tokens,
        "lti_claims": {
            "iss": claims.get("iss"),
            "sub": claims.get("sub"),
            "resource_link_id": (claims.get("https://purl.imsglobal.org/spec/lti/claim/resource_link") or {}).get("id"),
            "target_link_uri": (claims.get("https://purl.imsglobal.org/spec/lti/claim/target_link_uri")),
            "ags_lineitem": (claims.get("https://purl.imsglobal.org/spec/lti-ags/claim/endpoint") or {}).get("lineitem"),
        },
    })


@router.post("/lti/grade")
async def lti_grade_passback(
    platform_id: UUID,
    payload: LtiGradeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Post a grade back to the LMS via AGS."""
    _require_admin(current_user)
    platform = await db.get(LtiPlatform, platform_id)
    if platform is None or platform.org_id != current_user.org_id:
        raise HTTPException(status_code=404, detail="platform not found")
    return await post_grade(
        db,
        platform=platform,
        lineitem_url=payload.lineitem_url,
        user_sub=payload.user_sub,
        score_given=payload.score_given,
        score_maximum=payload.score_maximum,
        activity_progress=payload.activity_progress,
        grading_progress=payload.grading_progress,
        comment=payload.comment,
    )
