"""
CRUD operations for badges
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.models import Badge, UserBadge
from app.schemas import BadgeCreate, BadgeUpdate, UserBadgeCreate


class BadgeCRUD:
    """CRUD operations for badges"""

    @staticmethod
    async def create(db: AsyncSession, badge_data: BadgeCreate) -> Badge:
        """Create a new badge"""
        badge = Badge(**badge_data.model_dump())
        db.add(badge)
        await db.commit()
        await db.refresh(badge)
        return badge

    @staticmethod
    async def get_by_id(db: AsyncSession, badge_id: UUID) -> Optional[Badge]:
        """Get badge by ID"""
        result = await db.execute(
            select(Badge).where(Badge.id == badge_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all(
        db: AsyncSession,
        category: Optional[str] = None,
        tier: Optional[str] = None,
        is_active: bool = True,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[List[Badge], int]:
        """Get all badges with filters"""
        conditions = [Badge.is_active == is_active]
        
        if category:
            conditions.append(Badge.category == category)
        if tier:
            conditions.append(Badge.tier == tier)

        # Get total count
        count_query = select(Badge).where(and_(*conditions))
        count_result = await db.execute(count_query)
        total = len(count_result.scalars().all())

        # Get paginated results
        query = (
            select(Badge)
            .where(and_(*conditions))
            .offset(skip)
            .limit(limit)
            .order_by(Badge.created_at.desc())
        )
        result = await db.execute(query)
        badges = result.scalars().all()
        
        return list(badges), total

    @staticmethod
    async def update(
        db: AsyncSession,
        badge_id: UUID,
        badge_data: BadgeUpdate,
    ) -> Optional[Badge]:
        """Update a badge"""
        badge = await BadgeCRUD.get_by_id(db, badge_id)
        if not badge:
            return None

        for field, value in badge_data.model_dump(exclude_unset=True).items():
            setattr(badge, field, value)

        await db.commit()
        await db.refresh(badge)
        return badge

    @staticmethod
    async def delete(db: AsyncSession, badge_id: UUID) -> bool:
        """Delete a badge (soft delete by setting is_active=False)"""
        badge = await BadgeCRUD.get_by_id(db, badge_id)
        if not badge:
            return False

        badge.is_active = False
        await db.commit()
        return True


class UserBadgeCRUD:
    """CRUD operations for user badges"""

    @staticmethod
    async def award_badge(
        db: AsyncSession,
        user_id: UUID,
        badge_id: UUID,
        progress: Optional[dict] = None,
    ) -> Optional[UserBadge]:
        """Award a badge to a user"""
        # Check if badge exists
        badge = await BadgeCRUD.get_by_id(db, badge_id)
        if not badge or not badge.is_active:
            return None

        # Check if user already has this badge
        existing = await UserBadgeCRUD.get_user_badge(db, user_id, badge_id)
        if existing:
            return existing

        user_badge = UserBadge(
            user_id=user_id,
            badge_id=badge_id,
            progress=progress or {},
        )
        db.add(user_badge)
        await db.commit()
        await db.refresh(user_badge)
        
        # Load badge relationship
        await db.refresh(user_badge, ['badge'])
        
        return user_badge

    @staticmethod
    async def get_user_badge(
        db: AsyncSession,
        user_id: UUID,
        badge_id: UUID,
    ) -> Optional[UserBadge]:
        """Get a specific user badge"""
        result = await db.execute(
            select(UserBadge)
            .where(
                and_(
                    UserBadge.user_id == user_id,
                    UserBadge.badge_id == badge_id,
                )
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_badges(
        db: AsyncSession,
        user_id: UUID,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[List[UserBadge], int]:
        """Get all badges for a user"""
        query = (
            select(UserBadge)
            .where(UserBadge.user_id == user_id)
            .order_by(UserBadge.earned_at.desc())
        )

        # Apply category filter if provided
        if category:
            query = query.join(Badge).where(Badge.category == category)

        # Get total count
        count_result = await db.execute(query)
        total = len(count_result.scalars().all())

        # Get paginated results
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        user_badges = result.scalars().all()

        # Load badge relationships
        for ub in user_badges:
            await db.refresh(ub, ['badge'])

        return list(user_badges), total

    @staticmethod
    async def update_progress(
        db: AsyncSession,
        user_id: UUID,
        badge_id: UUID,
        progress: dict,
    ) -> Optional[UserBadge]:
        """Update badge progress for a user"""
        user_badge = await UserBadgeCRUD.get_user_badge(db, user_id, badge_id)
        if not user_badge:
            return None

        user_badge.progress = progress
        await db.commit()
        await db.refresh(user_badge)
        await db.refresh(user_badge, ['badge'])
        
        return user_badge

    @staticmethod
    async def revoke_badge(
        db: AsyncSession,
        user_id: UUID,
        badge_id: UUID,
    ) -> bool:
        """Revoke a badge from a user"""
        user_badge = await UserBadgeCRUD.get_user_badge(db, user_id, badge_id)
        if not user_badge:
            return False

        await db.delete(user_badge)
        await db.commit()
        return True
