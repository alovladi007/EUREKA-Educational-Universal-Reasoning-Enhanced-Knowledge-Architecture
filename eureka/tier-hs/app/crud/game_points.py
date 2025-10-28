"""
CRUD operations for game points
"""

from typing import Optional
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.models import GamePoints


class GamePointsCRUD:
    """CRUD operations for game points"""

    @staticmethod
    async def get_or_create(db: AsyncSession, user_id: UUID) -> GamePoints:
        """Get or create game points for a user"""
        result = await db.execute(
            select(GamePoints).where(GamePoints.user_id == user_id)
        )
        game_points = result.scalar_one_or_none()

        if not game_points:
            game_points = GamePoints(
                user_id=user_id,
                total_points=0,
                level=1,
                streak_days=0,
                achievements_count=0,
            )
            db.add(game_points)
            await db.commit()
            await db.refresh(game_points)

        return game_points

    @staticmethod
    async def get_by_user(db: AsyncSession, user_id: UUID) -> Optional[GamePoints]:
        """Get game points for a user"""
        result = await db.execute(
            select(GamePoints).where(GamePoints.user_id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def award_points(
        db: AsyncSession,
        user_id: UUID,
        points: int,
        reason: str,
    ) -> GamePoints:
        """Award points to a user"""
        game_points = await GamePointsCRUD.get_or_create(db, user_id)

        # Add points
        game_points.total_points += points

        # Calculate level (every 100 points = 1 level)
        new_level = (game_points.total_points // 100) + 1
        if new_level > game_points.level:
            game_points.level = new_level

        # Update streak
        await GamePointsCRUD._update_streak(game_points)

        # Update last activity
        game_points.last_activity_date = datetime.utcnow()

        await db.commit()
        await db.refresh(game_points)
        
        return game_points

    @staticmethod
    async def increment_achievements(
        db: AsyncSession,
        user_id: UUID,
    ) -> GamePoints:
        """Increment achievements count"""
        game_points = await GamePointsCRUD.get_or_create(db, user_id)
        game_points.achievements_count += 1
        
        await db.commit()
        await db.refresh(game_points)
        
        return game_points

    @staticmethod
    async def update_streak(db: AsyncSession, user_id: UUID) -> GamePoints:
        """Update streak days"""
        game_points = await GamePointsCRUD.get_or_create(db, user_id)
        await GamePointsCRUD._update_streak(game_points)
        
        await db.commit()
        await db.refresh(game_points)
        
        return game_points

    @staticmethod
    def _update_streak(game_points: GamePoints) -> None:
        """Internal method to update streak logic"""
        now = datetime.utcnow()
        last_activity = game_points.last_activity_date

        if not last_activity:
            # First activity
            game_points.streak_days = 1
        else:
            days_since = (now - last_activity).days

            if days_since == 0:
                # Same day - no change
                pass
            elif days_since == 1:
                # Consecutive day - increment streak
                game_points.streak_days += 1
            else:
                # Missed days - reset streak
                game_points.streak_days = 1

    @staticmethod
    async def reset_points(db: AsyncSession, user_id: UUID) -> GamePoints:
        """Reset user points (admin action)"""
        game_points = await GamePointsCRUD.get_or_create(db, user_id)
        
        game_points.total_points = 0
        game_points.level = 1
        game_points.streak_days = 0
        game_points.achievements_count = 0
        game_points.last_activity_date = None
        
        await db.commit()
        await db.refresh(game_points)
        
        return game_points

    @staticmethod
    async def get_top_users(
        db: AsyncSession,
        limit: int = 10,
    ) -> list[GamePoints]:
        """Get top users by points"""
        result = await db.execute(
            select(GamePoints)
            .order_by(GamePoints.total_points.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
