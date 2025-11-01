"""
CRUD operations for users

Database operations for user management.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from app.models import User
from app.schemas.auth import UserRegisterRequest, UserUpdate


async def create_user(
    db: AsyncSession,
    user_data: UserRegisterRequest,
    hashed_password: str
) -> User:
    """
    Create a new user.
    
    Args:
        db: Database session
        user_data: User registration data
        hashed_password: Hashed password
        
    Returns:
        Created user object
    """
    user = User(
        org_id=user_data.org_id,
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        display_name=f"{user_data.first_name} {user_data.last_name}",
        role=user_data.role,
        date_of_birth=user_data.date_of_birth,
        parent_email=user_data.parent_email,
        email_verified=False
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user


async def get_user_by_id(
    db: AsyncSession,
    user_id: UUID
) -> Optional[User]:
    """
    Get a user by ID.
    
    Args:
        db: Database session
        user_id: User ID
        
    Returns:
        User object or None if not found
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_by_email(
    db: AsyncSession,
    email: str,
    org_id: Optional[UUID] = None
) -> Optional[User]:
    """
    Get a user by email address.
    
    Args:
        db: Database session
        email: Email address
        org_id: Optional organization ID to scope the search
        
    Returns:
        User object or None if not found
    """
    query = select(User).where(User.email == email)
    
    if org_id:
        query = query.where(User.org_id == org_id)
    
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_users(
    db: AsyncSession,
    org_id: UUID,
    skip: int = 0,
    limit: int = 50,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None
) -> tuple[List[User], int]:
    """
    Get a paginated list of users for an organization.
    
    Args:
        db: Database session
        org_id: Organization ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        role: Optional role filter
        is_active: Optional active status filter
        search: Optional search query (searches name and email)
        
    Returns:
        Tuple of (list of users, total count)
    """
    # Base query
    query = select(User).where(User.org_id == org_id)
    
    # Apply filters
    if role:
        query = query.where(User.role == role)
    
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                User.email.ilike(search_pattern),
                User.first_name.ilike(search_pattern),
                User.last_name.ilike(search_pattern),
                User.display_name.ilike(search_pattern)
            )
        )
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get paginated results
    query = query.offset(skip).limit(limit).order_by(User.created_at.desc())
    result = await db.execute(query)
    users = result.scalars().all()
    
    return list(users), total


async def update_user(
    db: AsyncSession,
    user: User,
    update_data: UserUpdate
) -> User:
    """
    Update a user.
    
    Args:
        db: Database session
        user: User object to update
        update_data: Update data
        
    Returns:
        Updated user object
    """
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def update_user_password(
    db: AsyncSession,
    user: User,
    new_password: str
) -> User:
    """
    Update a user's password.
    
    Args:
        db: Database session
        user: User object
        new_password: New plain text password
        
    Returns:
        Updated user object
    """
    # Hash password using passlib or similar
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    user.hashed_password = pwd_context.hash(new_password)
    user.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def verify_user_email(
    db: AsyncSession,
    user: User
) -> User:
    """
    Mark a user's email as verified.
    
    Args:
        db: Database session
        user: User object
        
    Returns:
        Updated user object
    """
    user.email_verified = True
    user.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def update_last_login(
    db: AsyncSession,
    user: User
) -> User:
    """
    Update user's last login timestamp.
    
    Args:
        db: Database session
        user: User object
        
    Returns:
        Updated user object
    """
    user.last_login_at = datetime.utcnow()
    user.failed_login_attempts = 0  # Reset failed attempts on successful login
    user.locked_until = None  # Clear any account lock
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def increment_failed_login_attempts(
    db: AsyncSession,
    user: User
) -> User:
    """
    Increment failed login attempts for a user.
    
    Args:
        db: Database session
        user: User object
        
    Returns:
        Updated user object
    """
    user.failed_login_attempts += 1
    
    # Lock account after 5 failed attempts (15 minute lock)
    if user.failed_login_attempts >= 5:
        from datetime import timedelta
        user.locked_until = datetime.utcnow() + timedelta(minutes=15)
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def delete_user(
    db: AsyncSession,
    user: User
) -> None:
    """
    Soft delete a user.
    
    Args:
        db: Database session
        user: User object to delete
    """
    user.is_active = False
    user.deleted_at = datetime.utcnow()
    user.email = f"deleted_{user.id}@deleted.local"  # Anonymize email
    
    await db.commit()


async def ban_user(
    db: AsyncSession,
    user: User,
    reason: str
) -> User:
    """
    Ban a user.
    
    Args:
        db: Database session
        user: User object to ban
        reason: Reason for banning
        
    Returns:
        Updated user object
    """
    user.is_banned = True
    user.ban_reason = reason
    user.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def unban_user(
    db: AsyncSession,
    user: User
) -> User:
    """
    Unban a user.
    
    Args:
        db: Database session
        user: User object to unban
        
    Returns:
        Updated user object
    """
    user.is_banned = False
    user.ban_reason = None
    user.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(user)
    
    return user
