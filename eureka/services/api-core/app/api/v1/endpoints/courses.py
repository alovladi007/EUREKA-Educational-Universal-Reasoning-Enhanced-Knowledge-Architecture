"""
Course API endpoints

Handles course and enrollment management operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse, CourseList,
    EnrollmentCreate, EnrollmentUpdate, EnrollmentResponse, EnrollmentList,
    CourseStats
)
from app.crud import course as course_crud
from app.crud import user as user_crud
from app.utils.dependencies import (
    get_current_user, get_current_active_user, require_teacher,
    get_current_org_id, verify_org_access
)
from app.models import User
from app.core.models import UserRole, TierType

router = APIRouter()


# ==================== Course Endpoints ====================

@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_data: CourseCreate,
    current_user: User = Depends(require_teacher),
    org_id: UUID = Depends(get_current_org_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new course.
    Requires: Teacher role or higher
    """
    # Verify tier matches org tier
    from app.crud import organization as org_crud
    org = await org_crud.get_organization_by_id(db, org_id)
    
    if TierType(course_data.tier) != org.tier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Course tier must match organization tier ({org.tier.value})"
        )
    
    # Create course
    course = await course_crud.create_course(db, org_id, course_data)
    
    return CourseResponse.model_validate(course)


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get course by ID.
    Requires: Authentication
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Verify org access
    await verify_org_access(course.org_id, current_user)
    
    return CourseResponse.model_validate(course)


@router.patch("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: UUID,
    update_data: CourseUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update course.
    Requires: Course instructor, org admin, or super admin
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    can_edit = (
        current_user.role == UserRole.SUPER_ADMIN or
        (current_user.role == UserRole.ORG_ADMIN and current_user.org_id == course.org_id) or
        course.instructor_id == current_user.id
    )
    
    if not can_edit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to update this course"
        )
    
    # Update course
    updated_course = await course_crud.update_course(db, course, update_data)
    
    return CourseResponse.model_validate(updated_course)


@router.get("/", response_model=CourseList)
async def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    tier: Optional[str] = None,
    is_published: Optional[bool] = None,
    is_archived: Optional[bool] = False,
    instructor_id: Optional[UUID] = None,
    subject: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    org_id: UUID = Depends(get_current_org_id),
    db: AsyncSession = Depends(get_db)
):
    """
    List courses in organization.
    Requires: Authentication
    """
    tier_enum = TierType(tier) if tier else None
    
    courses, total = await course_crud.get_courses(
        db, org_id, skip, limit, tier_enum, is_published,
        is_archived, instructor_id, subject, search
    )
    
    pages = (total + limit - 1) // limit
    
    return CourseList(
        items=[CourseResponse.model_validate(c) for c in courses],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        pages=pages
    )


@router.post("/{course_id}/publish", response_model=CourseResponse)
async def publish_course(
    course_id: UUID,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db)
):
    """
    Publish a course (make it visible to students).
    Requires: Course instructor, org admin, or super admin
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    can_publish = (
        current_user.role == UserRole.SUPER_ADMIN or
        (current_user.role == UserRole.ORG_ADMIN and current_user.org_id == course.org_id) or
        course.instructor_id == current_user.id
    )
    
    if not can_publish:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to publish this course"
        )
    
    published_course = await course_crud.publish_course(db, course)
    
    return CourseResponse.model_validate(published_course)


@router.post("/{course_id}/unpublish", response_model=CourseResponse)
async def unpublish_course(
    course_id: UUID,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db)
):
    """
    Unpublish a course.
    Requires: Course instructor, org admin, or super admin
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    can_unpublish = (
        current_user.role == UserRole.SUPER_ADMIN or
        (current_user.role == UserRole.ORG_ADMIN and current_user.org_id == course.org_id) or
        course.instructor_id == current_user.id
    )
    
    if not can_unpublish:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to unpublish this course"
        )
    
    unpublished_course = await course_crud.unpublish_course(db, course)
    
    return CourseResponse.model_validate(unpublished_course)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: UUID,
    current_user: User = Depends(require_teacher),
    db: AsyncSession = Depends(get_db)
):
    """
    Archive a course (soft delete).
    Requires: Course instructor, org admin, or super admin
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    can_delete = (
        current_user.role == UserRole.SUPER_ADMIN or
        (current_user.role == UserRole.ORG_ADMIN and current_user.org_id == course.org_id) or
        course.instructor_id == current_user.id
    )
    
    if not can_delete:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to delete this course"
        )
    
    await course_crud.delete_course(db, course)
    
    return None


@router.get("/{course_id}/stats", response_model=CourseStats)
async def get_course_stats(
    course_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get course statistics.
    Requires: Course instructor, org admin, super admin
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    can_view_stats = (
        current_user.role == UserRole.SUPER_ADMIN or
        (current_user.role == UserRole.ORG_ADMIN and current_user.org_id == course.org_id) or
        current_user.role == UserRole.TEACHER or
        course.instructor_id == current_user.id
    )
    
    if not can_view_stats:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view course statistics"
        )
    
    stats = await course_crud.get_course_stats(db, course_id)
    
    return stats


# ==================== Enrollment Endpoints ====================

@router.post("/{course_id}/enroll", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
async def enroll_in_course(
    course_id: UUID,
    user_id: Optional[UUID] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Enroll in a course.
    - Students can enroll themselves
    - Teachers/admins can enroll any user
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Verify org access
    await verify_org_access(course.org_id, current_user)
    
    # Determine who to enroll
    if user_id:
        # Enrolling another user - requires teacher or admin
        if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN, UserRole.TEACHER]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only teachers and admins can enroll other users"
            )
        
        # Verify user exists and is in same org
        user = await user_crud.get_user_by_id(db, user_id)
        if not user or user.org_id != course.org_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found or not in course organization"
            )
        
        target_user_id = user_id
    else:
        # Enrolling self
        target_user_id = current_user.id
    
    # Check if course is published
    if not course.is_published and current_user.role == UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot enroll in unpublished course"
        )
    
    # Create enrollment
    enrollment_data = EnrollmentCreate(
        user_id=target_user_id,
        course_id=course_id
    )
    
    try:
        enrollment = await course_crud.create_enrollment(db, enrollment_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    
    return EnrollmentResponse.model_validate(enrollment)


@router.get("/{course_id}/enrollments", response_model=EnrollmentList)
async def list_course_enrollments(
    course_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    List enrollments for a course.
    Requires: Course instructor, teacher, org admin, or super admin
    """
    course = await course_crud.get_course_by_id(db, course_id)
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check permissions
    can_view = (
        current_user.role == UserRole.SUPER_ADMIN or
        (current_user.role == UserRole.ORG_ADMIN and current_user.org_id == course.org_id) or
        current_user.role == UserRole.TEACHER or
        course.instructor_id == current_user.id
    )
    
    if not can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view course enrollments"
        )
    
    enrollments, total = await course_crud.get_course_enrollments(
        db, course_id, skip, limit, status
    )
    
    pages = (total + limit - 1) // limit
    
    return EnrollmentList(
        items=[EnrollmentResponse.model_validate(e) for e in enrollments],
        total=total,
        page=skip // limit + 1,
        page_size=limit,
        pages=pages
    )


@router.patch("/{course_id}/enrollments/{user_id}", response_model=EnrollmentResponse)
async def update_enrollment(
    course_id: UUID,
    user_id: UUID,
    update_data: EnrollmentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update enrollment progress/status.
    - Students can update their own enrollment
    - Teachers/admins can update any enrollment
    """
    enrollment = await course_crud.get_enrollment(db, user_id, course_id)
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    
    # Check permissions
    can_update = (
        current_user.role == UserRole.SUPER_ADMIN or
        current_user.role == UserRole.ORG_ADMIN or
        current_user.role == UserRole.TEACHER or
        enrollment.user_id == current_user.id
    )
    
    if not can_update:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to update this enrollment"
        )
    
    # Students can only update progress, not status
    if current_user.role == UserRole.STUDENT and update_data.status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students cannot change enrollment status"
        )
    
    updated_enrollment = await course_crud.update_enrollment(db, enrollment, update_data)
    
    return EnrollmentResponse.model_validate(updated_enrollment)


@router.delete("/{course_id}/enrollments/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unenroll_from_course(
    course_id: UUID,
    user_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Unenroll from a course (delete enrollment).
    - Students can unenroll themselves
    - Teachers/admins can unenroll anyone
    """
    enrollment = await course_crud.get_enrollment(db, user_id, course_id)
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    
    # Check permissions
    can_unenroll = (
        current_user.role == UserRole.SUPER_ADMIN or
        current_user.role == UserRole.ORG_ADMIN or
        current_user.role == UserRole.TEACHER or
        enrollment.user_id == current_user.id
    )
    
    if not can_unenroll:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to unenroll"
        )
    
    await course_crud.delete_enrollment(db, enrollment)
    
    return None
