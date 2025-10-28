"""
CRUD operations for courses and enrollments

Database operations for course and enrollment management.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from app.core.models import Course, Enrollment, User, TierType
from app.schemas.course import (
    CourseCreate, CourseUpdate, EnrollmentCreate,
    EnrollmentUpdate, CourseStats
)


# ==================== Course CRUD ====================

async def create_course(
    db: AsyncSession,
    org_id: UUID,
    course_data: CourseCreate
) -> Course:
    """
    Create a new course.
    
    Args:
        db: Database session
        org_id: Organization ID
        course_data: Course creation data
        
    Returns:
        Created course object
    """
    course = Course(
        org_id=org_id,
        title=course_data.title,
        code=course_data.code,
        description=course_data.description,
        tier=TierType(course_data.tier),
        instructor_id=course_data.instructor_id,
        syllabus=course_data.syllabus,
        learning_objectives=course_data.learning_objectives,
        standards=course_data.standards,
        subject=course_data.subject,
        level=course_data.level,
        credits=course_data.credits,
        settings=course_data.settings,
        start_date=course_data.start_date,
        end_date=course_data.end_date,
        is_published=False,
        is_archived=False
    )
    
    db.add(course)
    await db.commit()
    await db.refresh(course)
    
    return course


async def get_course_by_id(
    db: AsyncSession,
    course_id: UUID,
    org_id: Optional[UUID] = None
) -> Optional[Course]:
    """
    Get a course by ID.
    
    Args:
        db: Database session
        course_id: Course ID
        org_id: Optional organization ID to scope the query
        
    Returns:
        Course object or None if not found
    """
    query = select(Course).where(Course.id == course_id)
    
    if org_id:
        query = query.where(Course.org_id == org_id)
    
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_courses(
    db: AsyncSession,
    org_id: UUID,
    skip: int = 0,
    limit: int = 50,
    tier: Optional[TierType] = None,
    is_published: Optional[bool] = None,
    is_archived: Optional[bool] = None,
    instructor_id: Optional[UUID] = None,
    subject: Optional[str] = None,
    search: Optional[str] = None
) -> tuple[List[Course], int]:
    """
    Get a paginated list of courses.
    
    Args:
        db: Database session
        org_id: Organization ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        tier: Optional tier filter
        is_published: Optional published status filter
        is_archived: Optional archived status filter
        instructor_id: Optional instructor filter
        subject: Optional subject filter
        search: Optional search query
        
    Returns:
        Tuple of (list of courses, total count)
    """
    # Base query
    query = select(Course).where(Course.org_id == org_id)
    
    # Apply filters
    if tier:
        query = query.where(Course.tier == tier)
    
    if is_published is not None:
        query = query.where(Course.is_published == is_published)
    
    if is_archived is not None:
        query = query.where(Course.is_archived == is_archived)
    
    if instructor_id:
        query = query.where(Course.instructor_id == instructor_id)
    
    if subject:
        query = query.where(Course.subject.ilike(f"%{subject}%"))
    
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Course.title.ilike(search_pattern),
                Course.code.ilike(search_pattern),
                Course.description.ilike(search_pattern)
            )
        )
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get paginated results
    query = query.offset(skip).limit(limit).order_by(Course.created_at.desc())
    result = await db.execute(query)
    courses = result.scalars().all()
    
    return list(courses), total


async def update_course(
    db: AsyncSession,
    course: Course,
    update_data: CourseUpdate
) -> Course:
    """
    Update a course.
    
    Args:
        db: Database session
        course: Course object to update
        update_data: Update data
        
    Returns:
        Updated course object
    """
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(course, field, value)
    
    course.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(course)
    
    return course


async def delete_course(
    db: AsyncSession,
    course: Course
) -> None:
    """
    Archive a course (soft delete).
    
    Args:
        db: Database session
        course: Course object to delete
    """
    course.is_archived = True
    course.updated_at = datetime.utcnow()
    
    await db.commit()


async def publish_course(
    db: AsyncSession,
    course: Course
) -> Course:
    """
    Publish a course.
    
    Args:
        db: Database session
        course: Course object to publish
        
    Returns:
        Updated course object
    """
    course.is_published = True
    course.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(course)
    
    return course


async def unpublish_course(
    db: AsyncSession,
    course: Course
) -> Course:
    """
    Unpublish a course.
    
    Args:
        db: Database session
        course: Course object to unpublish
        
    Returns:
        Updated course object
    """
    course.is_published = False
    course.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(course)
    
    return course


async def get_course_stats(
    db: AsyncSession,
    course_id: UUID
) -> CourseStats:
    """
    Get statistics for a course.
    
    Args:
        db: Database session
        course_id: Course ID
        
    Returns:
        Course statistics
    """
    # Count total enrollments
    total_result = await db.execute(
        select(func.count(Enrollment.id)).where(Enrollment.course_id == course_id)
    )
    total_enrollments = total_result.scalar() or 0
    
    # Count active enrollments
    active_result = await db.execute(
        select(func.count(Enrollment.id)).where(
            and_(
                Enrollment.course_id == course_id,
                Enrollment.status == 'active'
            )
        )
    )
    active_enrollments = active_result.scalar() or 0
    
    # Count completed enrollments
    completed_result = await db.execute(
        select(func.count(Enrollment.id)).where(
            and_(
                Enrollment.course_id == course_id,
                Enrollment.status == 'completed'
            )
        )
    )
    completed_enrollments = completed_result.scalar() or 0
    
    # Calculate average progress
    avg_progress_result = await db.execute(
        select(func.avg(Enrollment.progress_percent)).where(
            and_(
                Enrollment.course_id == course_id,
                Enrollment.status == 'active'
            )
        )
    )
    average_progress = avg_progress_result.scalar() or 0.0
    
    # Calculate average mastery
    avg_mastery_result = await db.execute(
        select(func.avg(Enrollment.mastery_level)).where(
            and_(
                Enrollment.course_id == course_id,
                Enrollment.status == 'active'
            )
        )
    )
    average_mastery = avg_mastery_result.scalar() or 0.0
    
    return CourseStats(
        course_id=course_id,
        total_enrollments=total_enrollments,
        active_enrollments=active_enrollments,
        completed_enrollments=completed_enrollments,
        average_progress=float(average_progress),
        average_mastery=float(average_mastery)
    )


# ==================== Enrollment CRUD ====================

async def create_enrollment(
    db: AsyncSession,
    enrollment_data: EnrollmentCreate
) -> Enrollment:
    """
    Create a new enrollment.
    
    Args:
        db: Database session
        enrollment_data: Enrollment creation data
        
    Returns:
        Created enrollment object
        
    Raises:
        ValueError: If user is already enrolled in the course
    """
    # Check if enrollment already exists
    existing = await db.execute(
        select(Enrollment).where(
            and_(
                Enrollment.user_id == enrollment_data.user_id,
                Enrollment.course_id == enrollment_data.course_id
            )
        )
    )
    
    if existing.scalar_one_or_none():
        raise ValueError("User is already enrolled in this course")
    
    enrollment = Enrollment(
        user_id=enrollment_data.user_id,
        course_id=enrollment_data.course_id,
        status='active',
        progress_percent=0,
        mastery_level=0
    )
    
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    
    return enrollment


async def get_enrollment_by_id(
    db: AsyncSession,
    enrollment_id: UUID
) -> Optional[Enrollment]:
    """
    Get an enrollment by ID.
    
    Args:
        db: Database session
        enrollment_id: Enrollment ID
        
    Returns:
        Enrollment object or None if not found
    """
    result = await db.execute(
        select(Enrollment)
        .options(selectinload(Enrollment.user), selectinload(Enrollment.course))
        .where(Enrollment.id == enrollment_id)
    )
    return result.scalar_one_or_none()


async def get_enrollment(
    db: AsyncSession,
    user_id: UUID,
    course_id: UUID
) -> Optional[Enrollment]:
    """
    Get an enrollment by user and course.
    
    Args:
        db: Database session
        user_id: User ID
        course_id: Course ID
        
    Returns:
        Enrollment object or None if not found
    """
    result = await db.execute(
        select(Enrollment).where(
            and_(
                Enrollment.user_id == user_id,
                Enrollment.course_id == course_id
            )
        )
    )
    return result.scalar_one_or_none()


async def get_user_enrollments(
    db: AsyncSession,
    user_id: UUID,
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None
) -> tuple[List[Enrollment], int]:
    """
    Get a user's enrollments.
    
    Args:
        db: Database session
        user_id: User ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter
        
    Returns:
        Tuple of (list of enrollments, total count)
    """
    query = select(Enrollment).where(Enrollment.user_id == user_id)
    
    if status:
        query = query.where(Enrollment.status == status)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get paginated results with relationships
    query = (
        query
        .options(selectinload(Enrollment.course))
        .offset(skip)
        .limit(limit)
        .order_by(Enrollment.enrolled_at.desc())
    )
    result = await db.execute(query)
    enrollments = result.scalars().all()
    
    return list(enrollments), total


async def get_course_enrollments(
    db: AsyncSession,
    course_id: UUID,
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None
) -> tuple[List[Enrollment], int]:
    """
    Get enrollments for a course.
    
    Args:
        db: Database session
        course_id: Course ID
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Optional status filter
        
    Returns:
        Tuple of (list of enrollments, total count)
    """
    query = select(Enrollment).where(Enrollment.course_id == course_id)
    
    if status:
        query = query.where(Enrollment.status == status)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    # Get paginated results with relationships
    query = (
        query
        .options(selectinload(Enrollment.user))
        .offset(skip)
        .limit(limit)
        .order_by(Enrollment.enrolled_at.desc())
    )
    result = await db.execute(query)
    enrollments = result.scalars().all()
    
    return list(enrollments), total


async def update_enrollment(
    db: AsyncSession,
    enrollment: Enrollment,
    update_data: EnrollmentUpdate
) -> Enrollment:
    """
    Update an enrollment.
    
    Args:
        db: Database session
        enrollment: Enrollment object to update
        update_data: Update data
        
    Returns:
        Updated enrollment object
    """
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for field, value in update_dict.items():
        setattr(enrollment, field, value)
    
    # Set completed_at if status changed to completed
    if update_data.status == 'completed' and not enrollment.completed_at:
        enrollment.completed_at = datetime.utcnow()
    
    # Set withdrawn_at if status changed to withdrawn
    if update_data.status == 'withdrawn' and not enrollment.withdrawn_at:
        enrollment.withdrawn_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(enrollment)
    
    return enrollment


async def delete_enrollment(
    db: AsyncSession,
    enrollment: Enrollment
) -> None:
    """
    Delete an enrollment.
    
    Args:
        db: Database session
        enrollment: Enrollment object to delete
    """
    await db.delete(enrollment)
    await db.commit()
