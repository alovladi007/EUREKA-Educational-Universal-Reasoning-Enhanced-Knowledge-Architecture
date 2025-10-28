"""
Badge API Endpoints for High School Tier
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import (
    BadgeCreate,
    BadgeUpdate,
    BadgeResponse,
    BadgeListResponse,
    UserBadgeResponse,
    UserBadgeListResponse,
)
from app.crud.badge import BadgeCRUD, UserBadgeCRUD
from app.core.database import get_db

router = APIRouter()


# ========================================
# Badge Management (Admin only)
# ========================================

@router.post("/badges", response_model=BadgeResponse, status_code=201)
async def create_badge(
    badge_data: BadgeCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new badge (admin only)
    
    - **name**: Badge name
    - **description**: Badge description
    - **category**: Badge category (academic, participation, achievement, social)
    - **points**: Points awarded for this badge
    - **requirements**: Criteria to earn the badge
    """
    badge = await BadgeCRUD.create(db, badge_data)
    return badge


@router.get("/badges", response_model=BadgeListResponse)
async def list_badges(
    category: Optional[str] = Query(None, description="Filter by category"),
    tier: str = Query("high_school", description="Filter by tier"),
    is_active: bool = Query(True, description="Filter by active status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    List all badges
    
    Can filter by category, tier, and active status.
    """
    skip = (page - 1) * page_size
    badges, total = await BadgeCRUD.get_all(
        db,
        category=category,
        tier=tier,
        is_active=is_active,
        skip=skip,
        limit=page_size,
    )
    
    return BadgeListResponse(
        data=badges,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/badges/{badge_id}", response_model=BadgeResponse)
async def get_badge(
    badge_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific badge by ID"""
    badge = await BadgeCRUD.get_by_id(db, badge_id)
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    return badge


@router.patch("/badges/{badge_id}", response_model=BadgeResponse)
async def update_badge(
    badge_id: UUID,
    badge_data: BadgeUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a badge (admin only)"""
    badge = await BadgeCRUD.update(db, badge_id, badge_data)
    if not badge:
        raise HTTPException(status_code=404, detail="Badge not found")
    return badge


@router.delete("/badges/{badge_id}", status_code=204)
async def delete_badge(
    badge_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Delete a badge (admin only) - soft delete"""
    success = await BadgeCRUD.delete(db, badge_id)
    if not success:
        raise HTTPException(status_code=404, detail="Badge not found")
    return None


# ========================================
# User Badge Operations
# ========================================

@router.post("/badges/{badge_id}/award", response_model=UserBadgeResponse)
async def award_badge(
    badge_id: UUID,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Award a badge to a user (admin/teacher)
    
    - **badge_id**: ID of the badge to award
    - **user_id**: ID of the user receiving the badge
    """
    user_badge = await UserBadgeCRUD.award_badge(db, user_id, badge_id)
    if not user_badge:
        raise HTTPException(
            status_code=400,
            detail="Badge not found or user already has this badge"
        )
    return user_badge


@router.get("/badges/my-badges", response_model=UserBadgeListResponse)
async def get_my_badges(
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    # TODO: Add current_user dependency
):
    """
    Get badges earned by the current user
    
    Can filter by category.
    """
    # TODO: Get user_id from current_user
    user_id = UUID("550e8400-e29b-41d4-a716-446655440000")  # Placeholder
    
    skip = (page - 1) * page_size
    user_badges, total = await UserBadgeCRUD.get_user_badges(
        db,
        user_id=user_id,
        category=category,
        skip=skip,
        limit=page_size,
    )
    
    return UserBadgeListResponse(
        data=user_badges,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/users/{user_id}/badges", response_model=UserBadgeListResponse)
async def get_user_badges(
    user_id: UUID,
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    Get badges earned by a specific user (teacher/admin)
    
    Can filter by category.
    """
    skip = (page - 1) * page_size
    user_badges, total = await UserBadgeCRUD.get_user_badges(
        db,
        user_id=user_id,
        category=category,
        skip=skip,
        limit=page_size,
    )
    
    return UserBadgeListResponse(
        data=user_badges,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.delete("/badges/{badge_id}/revoke/{user_id}", status_code=204)
async def revoke_badge(
    badge_id: UUID,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Revoke a badge from a user (admin only)"""
    success = await UserBadgeCRUD.revoke_badge(db, user_id, badge_id)
    if not success:
        raise HTTPException(status_code=404, detail="User badge not found")
    return None
