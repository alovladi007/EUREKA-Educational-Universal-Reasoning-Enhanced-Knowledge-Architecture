"""
Authentication API endpoints

Handles user registration, login, token refresh, and email verification.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.config import settings
from app.schemas.auth import (
    UserRegisterRequest, UserLoginRequest, TokenResponse,
    RefreshTokenRequest, VerifyEmailRequest, UserResponse,
    PasswordResetRequest, PasswordResetConfirm,
    ChangePasswordRequest, DeleteAccountRequest,
)
from app.crud import user as user_crud
from app.crud import organization as org_crud
from app.utils.auth import (
    hash_password, verify_password, verify_and_upgrade_hash, create_access_token,
    create_refresh_token, verify_token, create_email_verification_token,
    verify_email_token, create_password_reset_token, verify_password_reset_token,
    decode_token,
)
from app.utils.dependencies import get_current_user, security
from app.utils.token_blacklist import revoke_jti, revoke_user_tokens
from app.models import User
from app.services.email import email_service
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user.
    
    - Validates organization exists
    - Checks for duplicate email within org
    - Enforces COPPA compliance for users under 13
    - Creates user account
    - Returns access and refresh tokens
    """
    # Resolve the organization. Public self-service signup omits org_id and
    # lands in a shared default organization, created on first use; an explicit
    # org_id must reference an existing organization.
    if user_data.org_id is None:
        org = await org_crud.get_organization_by_slug(db, "public")
        if not org:
            from app.schemas.organization import OrganizationCreate
            # tier must be one of the real education tiers (schema validator +
            # DB CHECK constraint); "free" was rejected, so the default org was
            # never created and every public signup dead-ended. "undergraduate"
            # is the neutral general-education default for the shared org.
            org = await org_crud.create_organization(
                db,
                OrganizationCreate(
                    name="EUREKA Public",
                    slug="public",
                    tier="undergraduate",
                ),
            )
    else:
        org = await org_crud.get_organization_by_id(db, user_data.org_id)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )

    # Check if email already exists in this organization
    existing_user = await user_crud.get_user_by_email(db, user_data.email, org.id)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered in this organization"
        )
    
    # COPPA compliance check
    if user_data.date_of_birth:
        age = (datetime.now() - user_data.date_of_birth).days / 365.25
        if age < settings.MINIMUM_AGE and not user_data.parent_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Parent email required for users under {settings.MINIMUM_AGE} (COPPA compliance)"
            )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    # Persist the resolved organization (public signup started with org_id=None).
    user_data.org_id = org.id
    user = await user_crud.create_user(db, user_data, hashed_password)
    
    # Generate tokens
    token_data = {
        "sub": str(user.id),
        "org_id": str(user.org_id),
        "role": (user.role.value if hasattr(user.role, "value") else user.role),
        "email": user.email
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    # Send verification email
    verification_token = create_email_verification_token(str(user.id), user.email)
    await email_service.send_verification_email(
        to_email=user.email,
        user_name=f"{user.first_name} {user.last_name}",
        verification_token=verification_token
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_EXPIRATION_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Login with email and password.
    
    - Validates credentials
    - Checks account status (active, banned, locked)
    - Updates last login timestamp
    - Returns access and refresh tokens
    """
    # Get organization if slug provided
    org_id = None
    if login_data.org_slug:
        org = await org_crud.get_organization_by_slug(db, login_data.org_slug)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        org_id = org.id
    
    # Get user by email
    user = await user_crud.get_user_by_email(db, login_data.email, org_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check account lock
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is locked due to too many failed login attempts. Try again later."
        )
    
    # Verify password and transparently upgrade the stored hash if it's
    # using a legacy scheme (e.g. bcrypt under the argon2id-preferred config).
    ok, upgraded_hash = verify_and_upgrade_hash(login_data.password, user.hashed_password)
    if not ok:
        await user_crud.increment_failed_login_attempts(db, user)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if upgraded_hash is not None:
        user.hashed_password = upgraded_hash
        # Will be committed by update_last_login below, which already
        # touches `user` and flushes.

    # MFA second factor.
    if user.mfa_enabled:
        from app.utils.mfa import consume_recovery_code, decrypt, verify_totp

        submitted = (login_data.mfa_code or "").strip()
        if not submitted:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="MFA code required",
                headers={"X-MFA-Required": "true"},
            )

        mfa_ok = False
        if submitted.replace(" ", "").isdigit():
            mfa_ok = verify_totp(decrypt(user.mfa_secret), submitted)
        else:
            used, remaining = consume_recovery_code(
                user.mfa_recovery_codes or [], submitted
            )
            if used:
                user.mfa_recovery_codes = remaining
                mfa_ok = True

        if not mfa_ok:
            await user_crud.increment_failed_login_attempts(db, user)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid MFA code",
            )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Check if user is banned
    if user.is_banned:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is banned: {user.ban_reason or 'No reason provided'}"
        )
    
    # Update last login
    await user_crud.update_last_login(db, user)
    
    # Generate tokens
    token_data = {
        "sub": str(user.id),
        "org_id": str(user.org_id),
        "role": (user.role.value if hasattr(user.role, "value") else user.role),
        "email": user.email
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_EXPIRATION_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    token_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token.
    
    - Validates refresh token
    - Generates new access and refresh tokens
    - Implements refresh token rotation
    """
    try:
        # Verify refresh token
        payload = verify_token(token_data.refresh_token, token_type="refresh")
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Get user
    from uuid import UUID
    user = await user_crud.get_user_by_id(db, UUID(user_id))

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    # P1.3c: revoke the OLD refresh token's jti now that we've validated
    # it and are about to issue a replacement. Previously rotation minted
    # a new refresh token but left the old one valid until its natural
    # expiry, so a leaked/stolen refresh token stayed usable even after
    # the legitimate client rotated. Blacklisting the consumed jti closes
    # that window (TTL = the old token's remaining life). Fails open if
    # Redis is down — same posture as the rest of the blacklist.
    old_jti = payload.get("jti")
    old_exp = payload.get("exp")
    if old_jti:
        await revoke_jti(old_jti, old_exp)

    # Generate new tokens (token rotation)
    token_data = {
        "sub": str(user.id),
        "org_id": str(user.org_id),
        "role": (user.role.value if hasattr(user.role, "value") else user.role),
        "email": user.email
    }
    
    access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.JWT_EXPIRATION_MINUTES * 60,
        user=UserResponse.model_validate(user)
    )


@router.post("/verify-email", response_model=dict)
async def verify_email(
    verify_data: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Verify user's email address.
    
    - Validates verification token
    - Marks email as verified
    """
    try:
        # Verify token
        payload = verify_email_token(verify_data.token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Get user
    from uuid import UUID
    user = await user_crud.get_user_by_id(db, UUID(user_id))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify email
    await user_crud.verify_user_email(db, user)

    return {"message": "Email verified successfully"}


@router.post("/resend-verification", response_model=dict)
async def resend_verification(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    """
    Re-send the email verification link for the logged-in user (WS4 GTM).

    Needed because the original link expires in 24h; without a resend path
    an expired token would strand the account unverified forever.
    """
    payload = verify_token(credentials.credentials, token_type="access")
    from uuid import UUID
    user = await user_crud.get_user_by_id(db, UUID(payload["sub"]))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.is_email_verified:
        return {"message": "Email is already verified"}
    token = create_email_verification_token(str(user.id), user.email)
    await email_service.send_verification_email(
        to_email=user.email,
        user_name=f"{user.first_name} {user.last_name}",
        verification_token=token,
    )
    return {"message": "If sending is configured, a new verification link is on its way"}


@router.post("/password-reset", response_model=dict)
async def request_password_reset(
    reset_data: PasswordResetRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Request password reset.
    
    - Sends password reset email
    - Returns success even if email doesn't exist (security best practice)
    """
    # Get organization if slug provided
    org_id = None
    if reset_data.org_slug:
        org = await org_crud.get_organization_by_slug(db, reset_data.org_slug)
        if org:
            org_id = org.id
    
    # Get user
    user = await user_crud.get_user_by_email(db, reset_data.email, org_id)
    
    if user and user.is_active:
        # Generate reset token
        reset_token = create_password_reset_token(str(user.id), user.email)

        # Send password reset email
        await email_service.send_password_reset_email(
            to_email=user.email,
            user_name=f"{user.first_name} {user.last_name}",
            reset_token=reset_token
        )
    
    # Always return success (don't reveal if email exists)
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/password-reset/confirm", response_model=dict)
async def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
):
    """
    Confirm password reset with token.
    
    - Validates reset token
    - Updates user's password
    """
    try:
        # Verify token
        payload = verify_password_reset_token(reset_data.token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Get user
    from uuid import UUID
    user = await user_crud.get_user_by_id(db, UUID(user_id))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    await user_crud.update_user_password(db, user, reset_data.new_password)
    
    return {"message": "Password reset successfully"}


@router.post("/logout", response_model=dict)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user),
):
    """
    Log the current user out by revoking the access token (P0-8).

    Implementation: extract the jti + exp claims from the supplied
    Bearer token and add them to the Redis blacklist with TTL equal to
    the token's remaining life. Subsequent requests with the same
    token will fail get_current_user()'s blacklist check and return
    401.

    Note: a sibling refresh token (if any) is NOT revoked here — the
    client must drop it from local storage. Use /auth/logout-all-devices
    if you need to invalidate every token issued for this user.
    """
    try:
        payload = decode_token(credentials.credentials)
        jti = payload.get("jti")
        exp = payload.get("exp")
        await revoke_jti(jti, exp)
    except Exception:
        # Never fail logout — if blacklist write fails the worst case
        # is that the token remains valid until exp anyway. Still
        # return 200 so the client clears local state.
        pass

    return {"message": "Logged out successfully"}


@router.post("/logout-all-devices", response_model=dict)
async def logout_all_devices(
    current_user: User = Depends(get_current_user),
):
    """
    Revoke every access and refresh token currently issued for this
    user (P0-8).

    Implementation: write the current Unix timestamp into the
    "jwt:revoked-user:<user_id>" Redis key. get_current_user() compares
    that against each incoming token's iat claim and rejects anything
    issued before this call.

    The TTL on the blacklist key equals the longest possible refresh
    token life so the entry survives until the very last legitimate
    token would have expired anyway.

    Use cases: password change, suspected account compromise, manual
    sign-out from every device after a security event.
    """
    await revoke_user_tokens(str(current_user.id))
    return {"message": "All sessions revoked"}


@router.post("/change-password", response_model=dict)
async def change_password(
    payload: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Change the signed-in user's password (authenticated, in-app).

    Distinct from /password-reset, which is the forgot-password email flow.
    Here the user proves knowledge of the CURRENT password, then supplies a
    new one meeting the registration strength policy.

    On success every existing session is revoked (revoke_user_tokens) so a
    previously-leaked token can't outlive the rotation — the client must
    re-authenticate with the new password.
    """
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if verify_password(payload.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current one",
        )

    await user_crud.update_user_password(db, current_user, payload.new_password)
    # Force re-login everywhere after a credential change.
    await revoke_user_tokens(str(current_user.id))
    return {"message": "Password changed successfully. Please sign in again."}


@router.post("/deactivate", response_model=dict)
async def deactivate_account(
    payload: DeleteAccountRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Self-service account deletion (SOFT delete).

    This does NOT hard-delete rows — user_crud.delete_user flips is_active to
    False, stamps deleted_at, and anonymizes the email. That preserves
    referential integrity (enrollments, attempts, audit trail) and keeps the
    action reversible by an administrator, while removing the account from
    normal use. The current password is required as a confirmation gate, and
    all sessions are revoked so the account can no longer authenticate.
    """
    if not verify_password(payload.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is incorrect",
        )

    await user_crud.delete_user(db, current_user)
    await revoke_user_tokens(str(current_user.id))
    return {"message": "Your account has been deactivated."}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's information.
    """
    return UserResponse.model_validate(current_user)
