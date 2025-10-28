"""
FastAPI dependencies

Authentication and authorization dependencies for endpoints.
"""

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from jose import JWTError
from uuid import UUID

from app.core.database import get_db
from app.core.models import User, UserRole
from app.utils.auth import verify_token
from app.schemas.auth import UserResponse

# Security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from JWT token.
    
    Args:
        credentials: HTTP Bearer token credentials
        db: Database session
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify token
        token = credentials.credentials
        payload = verify_token(token, token_type="access")
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    result = await db.execute(
        select(User).where(User.id == UUID(user_id))
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
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
            detail=f"User account is banned: {user.ban_reason or 'No reason provided'}"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current active user.
    
    Args:
        current_user: Current user from get_current_user
        
    Returns:
        Current active user
        
    Raises:
        HTTPException: If user is not active
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    return current_user


def require_role(allowed_roles: list[UserRole]):
    """
    Dependency factory to require specific roles.
    
    Args:
        allowed_roles: List of allowed user roles
        
    Returns:
        Dependency function that checks user role
    """
    async def role_checker(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    
    return role_checker


# Specific role dependencies
require_admin = require_role([UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN])
require_teacher = require_role([UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.TEACHER])
require_super_admin = require_role([UserRole.SUPER_ADMIN])


async def get_current_org_id(
    current_user: User = Depends(get_current_user)
) -> UUID:
    """
    Get the current user's organization ID.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Organization ID
    """
    return current_user.org_id


async def verify_org_access(
    org_id: UUID,
    current_user: User = Depends(get_current_user)
) -> None:
    """
    Verify user has access to the specified organization.
    
    Args:
        org_id: Organization ID to check
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If user doesn't have access to the organization
    """
    # Super admins can access any organization
    if current_user.role == UserRole.SUPER_ADMIN:
        return
    
    # Other users can only access their own organization
    if current_user.org_id != org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this organization"
        )


async def get_optional_current_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Get the current user if authenticated, None otherwise.
    Useful for endpoints that work both authenticated and unauthenticated.
    
    Args:
        authorization: Optional Authorization header
        db: Database session
        
    Returns:
        Current user if authenticated, None otherwise
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    try:
        token = authorization.split(" ")[1]
        payload = verify_token(token, token_type="access")
        user_id: str = payload.get("sub")
        
        if user_id is None:
            return None
        
        result = await db.execute(
            select(User).where(User.id == UUID(user_id))
        )
        user = result.scalar_one_or_none()
        
        if user and user.is_active and not user.is_banned:
            return user
            
    except (JWTError, Exception):
        pass
    
    return None


async def require_email_verified(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Require that the current user has verified their email.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user if email is verified
        
    Raises:
        HTTPException: If email is not verified
    """
    if not current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification required. Please verify your email address."
        )
    return current_user


async def check_coppa_compliance(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Check COPPA compliance for users under 13.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user if COPPA compliant
        
    Raises:
        HTTPException: If COPPA compliance is required but not met
    """
    if current_user.date_of_birth:
        from datetime import datetime
        age = (datetime.now() - current_user.date_of_birth).days / 365.25
        
        if age < 13 and not current_user.parental_consent_given:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Parental consent required for users under 13 (COPPA compliance)"
            )
    
    return current_user
