"""
MFA (TOTP) endpoints — setup, verify, disable.

Mounted under /api/v1/auth/mfa. Adds:
  POST  /setup    — start enrolment: generate a TOTP secret, encrypt+store it,
                    return the otpauth:// URI for the user's authenticator app
                    plus one-time recovery codes. Authenticated only.
  POST  /verify   — finish enrolment OR step-up MFA: verify a 6-digit code
                    against the stored encrypted secret. On success during
                    enrolment, flip mfa_enabled=True. Authenticated only.
  POST  /disable  — turn MFA off. Requires the user's current password to
                    avoid a stolen-cookie attacker disabling it. Authenticated only.

Login flow integration (see endpoints/auth.py:login):
  - If user.mfa_enabled, the login payload must include `mfa_code`.
  - The mfa_code is verified against the stored secret; on failure the login
    is rejected with 401 and the failed_login_attempts counter is bumped.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.user import User
from app.utils.auth import verify_password
from app.utils.dependencies import get_current_user
from app.utils.mfa import (
    consume_recovery_code,
    decrypt,
    encrypt,
    encrypt_recovery_codes,
    generate_recovery_codes,
    generate_totp_secret,
    provisioning_uri,
    verify_totp,
)

router = APIRouter()


# --- request / response schemas ----------------------------------------------


class MFASetupResponse(BaseModel):
    """One-shot enrolment payload — the client must persist these *now*."""

    otpauth_uri: str = Field(
        description="Paste into authenticator app or render as a QR code."
    )
    secret: str = Field(
        description="Base32 secret for manual entry. Stored encrypted server-side."
    )
    recovery_codes: list[str] = Field(
        description=(
            "Single-use codes for account recovery if the device is lost. "
            "Shown ONCE — re-running /setup invalidates the previous set."
        )
    )


class MFAVerifyRequest(BaseModel):
    code: str = Field(min_length=4, max_length=20, description="6-digit TOTP or recovery code.")


class MFAVerifyResponse(BaseModel):
    verified: bool
    mfa_enabled: bool
    used_recovery_code: bool = False


class MFADisableRequest(BaseModel):
    password: str = Field(description="Current account password — required to disable MFA.")


class MFAStatusResponse(BaseModel):
    mfa_enabled: bool
    has_pending_setup: bool


# --- endpoints ----------------------------------------------------------------


@router.get("/status", response_model=MFAStatusResponse)
async def mfa_status(current_user: User = Depends(get_current_user)) -> MFAStatusResponse:
    """Where is this user in their MFA enrolment?"""
    return MFAStatusResponse(
        mfa_enabled=bool(current_user.mfa_enabled),
        has_pending_setup=bool(current_user.mfa_secret) and not current_user.mfa_enabled,
    )


@router.post("/setup", response_model=MFASetupResponse, status_code=status.HTTP_201_CREATED)
async def mfa_setup(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MFASetupResponse:
    """
    Generate a fresh TOTP secret + recovery codes for the current user.

    Idempotency: re-running /setup before /verify replaces the previous
    pending secret. Re-running /setup AFTER mfa_enabled requires a /disable
    first — we don't allow silent re-enrolment because the old secret
    might still be live on a user's device.
    """
    if current_user.mfa_enabled:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="MFA is already enabled. Disable it first before re-enrolling.",
        )

    secret = generate_totp_secret()
    recovery_codes = generate_recovery_codes()

    current_user.mfa_secret = encrypt(secret)
    current_user.mfa_recovery_codes = encrypt_recovery_codes(recovery_codes)
    current_user.mfa_enabled = False  # not yet — /verify enables it
    await db.commit()

    return MFASetupResponse(
        otpauth_uri=provisioning_uri(secret, current_user.email),
        secret=secret,
        recovery_codes=recovery_codes,
    )


@router.post("/verify", response_model=MFAVerifyResponse)
async def mfa_verify(
    payload: MFAVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MFAVerifyResponse:
    """
    Verify a TOTP code (or single-use recovery code).

    Used in two contexts:
      1. Enrolment finalisation — first /verify after /setup flips mfa_enabled
         to True.
      2. Day-to-day step-up — calling /verify on an already-enabled account
         just confirms the user holds the second factor right now.
    """
    if not current_user.mfa_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No MFA secret on file. Call /setup first.",
        )

    code = payload.code.strip()
    used_recovery = False

    # Numeric → TOTP. Anything else → recovery-code path.
    secret_plain = decrypt(current_user.mfa_secret)
    if code.replace(" ", "").isdigit():
        verified = verify_totp(secret_plain, code)
    else:
        verified, remaining = consume_recovery_code(
            current_user.mfa_recovery_codes or [], code
        )
        if verified:
            current_user.mfa_recovery_codes = remaining
            used_recovery = True

    if not verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid MFA code.",
        )

    if not current_user.mfa_enabled:
        current_user.mfa_enabled = True
    await db.commit()

    return MFAVerifyResponse(
        verified=True,
        mfa_enabled=current_user.mfa_enabled,
        used_recovery_code=used_recovery,
    )


@router.post("/disable")
async def mfa_disable(
    payload: MFADisableRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Response:
    """
    Disable MFA. Requires the current password to avoid a stolen-token
    attacker silently turning MFA off.

    Returns 204 No Content on success.
    """
    if not verify_password(payload.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password.",
        )

    current_user.mfa_enabled = False
    current_user.mfa_secret = None
    current_user.mfa_recovery_codes = None
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
