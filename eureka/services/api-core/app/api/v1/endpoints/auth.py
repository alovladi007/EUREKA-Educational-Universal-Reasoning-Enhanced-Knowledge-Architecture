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
    PasswordResetRequest, PasswordResetConfirm
)
from app.crud import user as user_crud
from app.crud import organization as org_crud
from app.utils.auth import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, verify_token, create_email_verification_token,
    verify_email_token, create_password_reset_token, verify_password_reset_token
)
from app.utils.dependencies import get_current_user
from app.models import User
from app.services.email import email_service

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
    # Verify organization exists
    org = await org_crud.get_organization_by_id(db, user_data.org_id)
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Check if email already exists in this organization
    existing_user = await user_crud.get_user_by_email(db, user_data.email, user_data.org_id)
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
    user = await user_crud.create_user(db, user_data, hashed_password)
    
    # Generate tokens
    token_data = {
        "sub": str(user.id),
        "org_id": str(user.org_id),
        "role": user.role.value,
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
    
    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        # Increment failed attempts
        await user_crud.increment_failed_login_attempts(db, user)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
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
        "role": user.role.value,
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
    
    # Generate new tokens (token rotation)
    token_data = {
        "sub": str(user.id),
        "org_id": str(user.org_id),
        "role": user.role.value,
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
    current_user: User = Depends(get_current_user)
):
    """
    Logout current user.
    
    Note: With JWT tokens, logout is typically handled client-side by
    removing the tokens. This endpoint can be used for audit logging.
    """
    # TODO: Add token to blacklist if implementing token revocation
    # TODO: Log logout event in audit log
    
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's information.
    """
    return UserResponse.model_validate(current_user)
