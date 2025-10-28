"""
User API endpoints

Handles user management operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.schemas.auth import UserResponse, UserUpdate
from app.schemas.course import EnrollmentResponse, EnrollmentList
from app.crud import user as user_crud
from app.crud import course as course_crud
from app.utils.dependencies import (
    get_current_user, get_current_active_user,
    require_admin, get_current_org_id, verify_org_access
)
from app.core.models import User, UserRole

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's profile"""
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    updated_user = await user_crud.update_user(db, current_user, update_data)
    return UserResponse.model_validate(updated_user)


@router.get("/me/enrollments", response_model=EnrollmentList)
async def get_my_enrollments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's course enrollments"""
    enrollments, total = await course_crud.get_user_enrollments(
        db, current_user.id, skip, limit, status
    )
    
    pages = (total + limit - 1) // limit
    
    return EnrollmentList(
        items=[EnrollmentResponse.model_validate(e) for e in enrollments],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        pages=pages
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user by ID.
    Requires: Admin role OR same user
    """
    user = await user_crud.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check permissions
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]:
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this user"
            )
    
    # Verify org access
    if current_user.role != UserRole.SUPER_ADMIN:
        if current_user.org_id != user.org_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User not in your organization"
            )
    
    return UserResponse.model_validate(user)


@router.get("/", response_model=dict)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_admin),
    org_id: UUID = Depends(get_current_org_id),
    db: AsyncSession = Depends(get_db)
):
    """
    List users in organization.
    Requires: Admin role
    """
    role_enum = UserRole(role) if role else None
    users, total = await user_crud.get_users(
        db, org_id, skip, limit, role_enum, is_active, search
    )
    
    pages = (total + limit - 1) // limit
    
    return {
        "items": [UserResponse.model_validate(u) for u in users],
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "pages": pages
    }


@router.patch("/{user_id}/ban", response_model=UserResponse)
async def ban_user(
    user_id: UUID,
    reason: str = Query(..., min_length=10),
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Ban a user.
    Requires: Admin role
    """
    user = await user_crud.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify org access
    await verify_org_access(user.org_id, current_user)
    
    # Don't allow banning super admins
    if user.role == UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot ban super admin"
        )
    
    banned_user = await user_crud.ban_user(db, user, reason)
    return UserResponse.model_validate(banned_user)


@router.patch("/{user_id}/unban", response_model=UserResponse)
async def unban_user(
    user_id: UUID,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Unban a user.
    Requires: Admin role
    """
    user = await user_crud.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify org access
    await verify_org_access(user.org_id, current_user)
    
    unbanned_user = await user_crud.unban_user(db, user)
    return UserResponse.model_validate(unbanned_user)
