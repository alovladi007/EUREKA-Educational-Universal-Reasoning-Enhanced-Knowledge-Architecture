"""
Pydantic schemas for authentication

Request/response models for auth endpoints.
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserRegisterRequest(BaseModel):
    """User registration request"""
    org_id: UUID = Field(..., description="Organization ID")
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=8, description="Password (min 8 characters)")
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role: str = Field(default="student", description="User role")
    
    # COPPA compliance fields
    date_of_birth: Optional[datetime] = None
    parent_email: Optional[EmailStr] = None
    
    @validator('password')
    def validate_password_strength(cls, v):
        """Validate password meets security requirements"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @validator('parent_email')
    def validate_parental_consent(cls, v, values):
        """Require parent email if under 13"""
        date_of_birth = values.get('date_of_birth')
        if date_of_birth:
            age = (datetime.now() - date_of_birth).days / 365.25
            if age < 13 and not v:
                raise ValueError('Parent email required for users under 13 (COPPA)')
        return v


class UserLoginRequest(BaseModel):
    """User login request"""
    # Plain str, not EmailStr: login matches against EXISTING accounts, so it
    # must accept whatever address is on file — including reserved-TLD demo
    # emails (e.g. you@local.test) that email-validator rejects. Format
    # strictness belongs on registration, not login (where it just locks
    # valid existing users out before the password is even checked).
    email: str
    password: str
    org_slug: Optional[str] = Field(None, description="Organization slug (optional)")
    mfa_code: Optional[str] = Field(
        None,
        description=(
            "6-digit TOTP code (or single-use recovery code) — required when "
            "the user has MFA enabled. Submit alongside email + password on "
            "the same /login call. If omitted and MFA is required, the response "
            "is 401 with detail='MFA code required'."
        ),
    )


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Token expiration in seconds")
    user: "UserResponse"


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str


class VerifyEmailRequest(BaseModel):
    """Email verification request"""
    token: str


class PasswordResetRequest(BaseModel):
    """Password reset request"""
    email: EmailStr
    org_slug: Optional[str] = None


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation"""
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password_strength(cls, v):
        """Validate password meets security requirements"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserResponse(BaseModel):
    """User response model"""
    id: UUID
    org_id: UUID
    # Plain str, not EmailStr: this is an OUTPUT model echoing data already in
    # the DB. Serialization must never 500 because email-validator dislikes a
    # stored address (e.g. reserved TLDs like you@local.test). Input models
    # (UserRegisterRequest, PasswordResetRequest) keep EmailStr to guard NEW
    # data at the door.
    email: str
    first_name: str
    last_name: str
    display_name: Optional[str]
    avatar_url: Optional[str]
    role: str
    locale: str
    timezone: str
    is_active: bool
    is_email_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """User update request"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    display_name: Optional[str] = Field(None, max_length=200)
    avatar_url: Optional[str] = Field(None, max_length=500)
    locale: Optional[str] = Field(None, max_length=10)
    timezone: Optional[str] = Field(None, max_length=50)
    # Phone is informally captured for SMS notifications. Stored on the
    # user row via the preferences JSONB blob — kept here for convenience
    # so PATCH /me can touch it.
    phone: Optional[str] = Field(None, max_length=32)

    class Config:
        # Allow partial updates
        extra = 'ignore'


class UserSettings(BaseModel):
    """Catch-all user-settings shape persisted in users.preferences JSONB.
    Mirrors the /dashboard/settings page sections. Backend treats this as
    an opaque dict — no schema enforcement past the top-level keys so the
    frontend can iterate without backend deploys."""
    notifications: Optional[dict] = None
    privacy: Optional[dict] = None
    appearance: Optional[dict] = None
    accessibility: Optional[dict] = None

    class Config:
        extra = 'allow'
