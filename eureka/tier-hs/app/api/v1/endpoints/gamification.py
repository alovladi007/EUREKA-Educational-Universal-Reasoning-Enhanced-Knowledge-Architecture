"""
Game Points and Leaderboard API Endpoints for High School Tier
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import (
    GamePointsResponse,
    PointsAwardRequest,
    LeaderboardQuery,
    LeaderboardResponse,
    LeaderboardEntryResponse,
)
from app.crud.game_points import GamePointsCRUD
from app.crud import LeaderboardCRUD
from app.core.database import get_db

router = APIRouter()


# ========================================
# Game Points Endpoints
# ========================================

@router.get("/points/me", response_model=GamePointsResponse)
async def get_my_points(
    db: AsyncSession = Depends(get_db),
    # TODO: Add current_user dependency
):
    """
    Get current user's game points
    
    Returns points, level, streak, and achievements count.
    """
    # TODO: Get user_id from current_user
    user_id = UUID("550e8400-e29b-41d4-a716-446655440000")  # Placeholder
    
    game_points = await GamePointsCRUD.get_or_create(db, user_id)
    return game_points


@router.get("/points/user/{user_id}", response_model=GamePointsResponse)
async def get_user_points(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get game points for a specific user (teacher/admin)
    
    Returns points, level, streak, and achievements count.
    """
    game_points = await GamePointsCRUD.get_or_create(db, user_id)
    return game_points


@router.post("/points/award", response_model=GamePointsResponse)
async def award_points(
    award_request: PointsAwardRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Award points to a user (admin/teacher)
    
    - **user_id**: User to award points to
    - **points**: Number of points to award
    - **reason**: Reason for awarding points
    """
    game_points = await GamePointsCRUD.award_points(
        db,
        user_id=award_request.user_id,
        points=award_request.points,
        reason=award_request.reason,
    )
    return game_points


@router.post("/points/update-streak", response_model=GamePointsResponse)
async def update_streak(
    db: AsyncSession = Depends(get_db),
    # TODO: Add current_user dependency
):
    """
    Update streak for current user
    
    Call this when user completes an activity.
    """
    # TODO: Get user_id from current_user
    user_id = UUID("550e8400-e29b-41d4-a716-446655440000")  # Placeholder
    
    game_points = await GamePointsCRUD.update_streak(db, user_id)
    return game_points


@router.post("/points/{user_id}/reset", response_model=GamePointsResponse)
async def reset_points(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Reset user points (admin only)
    
    Sets all points, level, and streak back to initial values.
    """
    game_points = await GamePointsCRUD.reset_points(db, user_id)
    return game_points


# ========================================
# Leaderboard Endpoints
# ========================================

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    org_id: UUID = Query(..., description="Organization ID"),
    course_id: Optional[UUID] = Query(None, description="Course ID for course-specific leaderboard"),
    period: str = Query("all_time", description="Time period: weekly, monthly, all_time"),
    limit: int = Query(10, ge=1, le=100, description="Number of entries to return"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get leaderboard for an organization
    
    - **org_id**: Organization ID (required)
    - **course_id**: Optional course ID for course-specific leaderboard
    - **period**: Time period (weekly, monthly, all_time)
    - **limit**: Number of top users to return (1-100)
    """
    entries, total = await LeaderboardCRUD.get_leaderboard(
        db,
        org_id=org_id,
        course_id=course_id,
        period=period,
        limit=limit,
    )
    
    return LeaderboardResponse(
        data=entries,
        total=total,
        period=period,
    )


@router.get("/leaderboard/my-rank", response_model=LeaderboardEntryResponse)
async def get_my_rank(
    org_id: UUID = Query(..., description="Organization ID"),
    course_id: Optional[UUID] = Query(None, description="Course ID"),
    period: str = Query("all_time", description="Time period"),
    db: AsyncSession = Depends(get_db),
    # TODO: Add current_user dependency
):
    """
    Get current user's rank on the leaderboard
    
    - **org_id**: Organization ID (required)
    - **course_id**: Optional course ID
    - **period**: Time period (weekly, monthly, all_time)
    """
    # TODO: Get user_id from current_user
    user_id = UUID("550e8400-e29b-41d4-a716-446655440000")  # Placeholder
    
    entry = await LeaderboardCRUD.get_user_rank(
        db,
        org_id=org_id,
        user_id=user_id,
        course_id=course_id,
        period=period,
    )
    
    if not entry:
        raise HTTPException(
            status_code=404,
            detail="No leaderboard entry found for this user"
        )
    
    return entry


@router.post("/leaderboard/update", response_model=LeaderboardEntryResponse)
async def update_leaderboard(
    org_id: UUID,
    user_id: UUID,
    score: int,
    course_id: Optional[UUID] = None,
    period: str = "all_time",
    db: AsyncSession = Depends(get_db),
):
    """
    Update leaderboard score for a user (system/admin)
    
    - **org_id**: Organization ID
    - **user_id**: User ID
    - **score**: New score
    - **course_id**: Optional course ID
    - **period**: Time period
    """
    entry = await LeaderboardCRUD.update_or_create_entry(
        db,
        org_id=org_id,
        user_id=user_id,
        score=score,
        period=period,
        course_id=course_id,
    )
    return entry
