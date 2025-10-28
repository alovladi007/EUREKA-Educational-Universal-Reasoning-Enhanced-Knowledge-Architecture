"""
CRUD operations for leaderboard and parental consent
"""

from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.models import LeaderboardEntry, ParentalConsent, ParentActivity


class LeaderboardCRUD:
    """CRUD operations for leaderboard"""

    @staticmethod
    async def get_leaderboard(
        db: AsyncSession,
        org_id: UUID,
        course_id: Optional[UUID] = None,
        period: str = "all_time",
        limit: int = 10,
    ) -> tuple[List[LeaderboardEntry], int]:
        """Get leaderboard for an organization or course"""
        conditions = [LeaderboardEntry.org_id == org_id]
        
        if course_id:
            conditions.append(LeaderboardEntry.course_id == course_id)
        
        conditions.append(LeaderboardEntry.period == period)

        # Get total count
        count_query = select(func.count()).select_from(LeaderboardEntry).where(and_(*conditions))
        count_result = await db.execute(count_query)
        total = count_result.scalar_one()

        # Get leaderboard entries
        query = (
            select(LeaderboardEntry)
            .where(and_(*conditions))
            .order_by(LeaderboardEntry.rank.asc())
            .limit(limit)
        )
        result = await db.execute(query)
        entries = result.scalars().all()

        return list(entries), total

    @staticmethod
    async def update_or_create_entry(
        db: AsyncSession,
        org_id: UUID,
        user_id: UUID,
        score: int,
        period: str = "all_time",
        course_id: Optional[UUID] = None,
    ) -> LeaderboardEntry:
        """Update or create a leaderboard entry"""
        # Find existing entry
        conditions = [
            LeaderboardEntry.org_id == org_id,
            LeaderboardEntry.user_id == user_id,
            LeaderboardEntry.period == period,
        ]
        
        if course_id:
            conditions.append(LeaderboardEntry.course_id == course_id)
        else:
            conditions.append(LeaderboardEntry.course_id.is_(None))

        result = await db.execute(
            select(LeaderboardEntry).where(and_(*conditions))
        )
        entry = result.scalar_one_or_none()

        if entry:
            # Update existing entry
            entry.score = score
            entry.updated_at = datetime.utcnow()
        else:
            # Create new entry
            entry = LeaderboardEntry(
                org_id=org_id,
                course_id=course_id,
                user_id=user_id,
                score=score,
                period=period,
            )
            db.add(entry)

        await db.commit()
        
        # Recalculate ranks for this leaderboard
        await LeaderboardCRUD._recalculate_ranks(db, org_id, course_id, period)
        
        await db.refresh(entry)
        return entry

    @staticmethod
    async def _recalculate_ranks(
        db: AsyncSession,
        org_id: UUID,
        course_id: Optional[UUID],
        period: str,
    ) -> None:
        """Recalculate ranks for a leaderboard"""
        conditions = [
            LeaderboardEntry.org_id == org_id,
            LeaderboardEntry.period == period,
        ]
        
        if course_id:
            conditions.append(LeaderboardEntry.course_id == course_id)
        else:
            conditions.append(LeaderboardEntry.course_id.is_(None))

        # Get all entries sorted by score
        result = await db.execute(
            select(LeaderboardEntry)
            .where(and_(*conditions))
            .order_by(LeaderboardEntry.score.desc())
        )
        entries = result.scalars().all()

        # Update ranks
        for rank, entry in enumerate(entries, start=1):
            entry.rank = rank

        await db.commit()

    @staticmethod
    async def get_user_rank(
        db: AsyncSession,
        org_id: UUID,
        user_id: UUID,
        course_id: Optional[UUID] = None,
        period: str = "all_time",
    ) -> Optional[LeaderboardEntry]:
        """Get a user's rank on the leaderboard"""
        conditions = [
            LeaderboardEntry.org_id == org_id,
            LeaderboardEntry.user_id == user_id,
            LeaderboardEntry.period == period,
        ]
        
        if course_id:
            conditions.append(LeaderboardEntry.course_id == course_id)
        else:
            conditions.append(LeaderboardEntry.course_id.is_(None))

        result = await db.execute(
            select(LeaderboardEntry).where(and_(*conditions))
        )
        return result.scalar_one_or_none()


class ParentalConsentCRUD:
    """CRUD operations for parental consent"""

    @staticmethod
    async def create(
        db: AsyncSession,
        student_id: UUID,
        parent_email: str,
        parent_name: Optional[str] = None,
    ) -> ParentalConsent:
        """Create a parental consent record"""
        import secrets
        
        consent = ParentalConsent(
            student_id=student_id,
            parent_email=parent_email,
            parent_name=parent_name,
            consent_given=False,
            verification_token=secrets.token_urlsafe(32),
            verification_sent_at=datetime.utcnow(),
        )
        db.add(consent)
        await db.commit()
        await db.refresh(consent)
        return consent

    @staticmethod
    async def get_by_student(
        db: AsyncSession,
        student_id: UUID,
    ) -> Optional[ParentalConsent]:
        """Get parental consent for a student"""
        result = await db.execute(
            select(ParentalConsent)
            .where(ParentalConsent.student_id == student_id)
            .order_by(ParentalConsent.created_at.desc())
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def verify_consent(
        db: AsyncSession,
        verification_token: str,
        ip_address: Optional[str] = None,
    ) -> Optional[ParentalConsent]:
        """Verify parental consent"""
        result = await db.execute(
            select(ParentalConsent)
            .where(ParentalConsent.verification_token == verification_token)
        )
        consent = result.scalar_one_or_none()

        if not consent:
            return None

        consent.consent_given = True
        consent.consent_date = datetime.utcnow()
        consent.consent_ip = ip_address
        consent.verified_at = datetime.utcnow()

        await db.commit()
        await db.refresh(consent)
        return consent

    @staticmethod
    async def update(
        db: AsyncSession,
        consent_id: UUID,
        parent_name: Optional[str] = None,
    ) -> Optional[ParentalConsent]:
        """Update parental consent"""
        result = await db.execute(
            select(ParentalConsent).where(ParentalConsent.id == consent_id)
        )
        consent = result.scalar_one_or_none()

        if not consent:
            return None

        if parent_name:
            consent.parent_name = parent_name

        await db.commit()
        await db.refresh(consent)
        return consent


class ParentActivityCRUD:
    """CRUD operations for parent activity"""

    @staticmethod
    async def create(
        db: AsyncSession,
        parent_email: str,
        student_id: UUID,
        activity_type: str,
        activity_data: Optional[dict] = None,
        ip_address: Optional[str] = None,
    ) -> ParentActivity:
        """Log parent activity"""
        activity = ParentActivity(
            parent_email=parent_email,
            student_id=student_id,
            activity_type=activity_type,
            activity_data=activity_data or {},
            ip_address=ip_address,
        )
        db.add(activity)
        await db.commit()
        await db.refresh(activity)
        return activity

    @staticmethod
    async def get_by_student(
        db: AsyncSession,
        student_id: UUID,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[ParentActivity], int]:
        """Get parent activities for a student"""
        # Get total count
        count_query = select(func.count()).select_from(ParentActivity).where(
            ParentActivity.student_id == student_id
        )
        count_result = await db.execute(count_query)
        total = count_result.scalar_one()

        # Get activities
        query = (
            select(ParentActivity)
            .where(ParentActivity.student_id == student_id)
            .order_by(ParentActivity.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        activities = result.scalars().all()

        return list(activities), total

    @staticmethod
    async def get_by_parent(
        db: AsyncSession,
        parent_email: str,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[List[ParentActivity], int]:
        """Get activities by a parent"""
        # Get total count
        count_query = select(func.count()).select_from(ParentActivity).where(
            ParentActivity.parent_email == parent_email
        )
        count_result = await db.execute(count_query)
        total = count_result.scalar_one()

        # Get activities
        query = (
            select(ParentActivity)
            .where(ParentActivity.parent_email == parent_email)
            .order_by(ParentActivity.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        activities = result.scalars().all()

        return list(activities), total
