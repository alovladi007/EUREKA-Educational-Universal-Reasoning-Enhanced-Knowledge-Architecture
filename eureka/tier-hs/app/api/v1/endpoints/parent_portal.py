"""
Parent Portal API Endpoints for High School Tier (COPPA Compliance)
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import (
    ParentalConsentCreate,
    ParentalConsentResponse,
    ConsentVerificationRequest,
    ParentActivityCreate,
    ParentActivityResponse,
    ParentActivityListResponse,
)
from app.crud import ParentalConsentCRUD, ParentActivityCRUD
from app.core.database import get_db

router = APIRouter()


# ========================================
# Parental Consent Endpoints (COPPA)
# ========================================

@router.post("/parental-consent", response_model=ParentalConsentResponse, status_code=201)
async def create_parental_consent(
    consent_data: ParentalConsentCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create parental consent record for a student
    
    Required for COPPA compliance for students under 13.
    
    - **student_id**: ID of the student
    - **parent_email**: Parent's email address
    - **parent_name**: Parent's name
    
    Sends verification email to parent.
    """
    # Check if consent already exists
    existing = await ParentalConsentCRUD.get_by_student(db, consent_data.student_id)
    if existing and existing.consent_given:
        raise HTTPException(
            status_code=400,
            detail="Parental consent already exists for this student"
        )
    
    consent = await ParentalConsentCRUD.create(
        db,
        student_id=consent_data.student_id,
        parent_email=consent_data.parent_email,
        parent_name=consent_data.parent_name,
    )
    
    # TODO: Send verification email to parent with consent.verification_token
    # Email should contain link: /api/hs/parental-consent/verify?token={token}
    
    return consent


@router.get("/parental-consent/student/{student_id}", response_model=ParentalConsentResponse)
async def get_student_consent(
    student_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get parental consent for a student (teacher/admin)
    
    - **student_id**: ID of the student
    """
    consent = await ParentalConsentCRUD.get_by_student(db, student_id)
    if not consent:
        raise HTTPException(status_code=404, detail="Parental consent not found")
    return consent


@router.post("/parental-consent/verify", response_model=ParentalConsentResponse)
async def verify_parental_consent(
    verification: ConsentVerificationRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Verify parental consent (public endpoint - accessed from email link)
    
    - **verification_token**: Token sent to parent's email
    
    This endpoint is called when parent clicks verification link in email.
    """
    # Get IP address
    ip_address = request.client.host if request.client else None
    
    consent = await ParentalConsentCRUD.verify_consent(
        db,
        verification_token=verification.verification_token,
        ip_address=ip_address,
    )
    
    if not consent:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token"
        )
    
    return consent


# ========================================
# Parent Portal Activity Endpoints
# ========================================

@router.post("/parent-activity", response_model=ParentActivityResponse, status_code=201)
async def log_parent_activity(
    activity_data: ParentActivityCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Log parent portal activity (for auditing)
    
    - **parent_email**: Parent's email
    - **student_id**: Student ID
    - **activity_type**: Type of activity (viewed_grades, viewed_attendance, sent_message)
    - **activity_data**: Additional data about the activity
    """
    # Get IP address
    ip_address = request.client.host if request.client else None
    
    # Verify parent has consent for this student
    consent = await ParentalConsentCRUD.get_by_student(db, activity_data.student_id)
    if not consent or consent.parent_email != activity_data.parent_email:
        raise HTTPException(
            status_code=403,
            detail="Parent not authorized for this student"
        )
    
    if not consent.consent_given:
        raise HTTPException(
            status_code=403,
            detail="Parental consent not yet verified"
        )
    
    activity = await ParentActivityCRUD.create(
        db,
        parent_email=activity_data.parent_email,
        student_id=activity_data.student_id,
        activity_type=activity_data.activity_type,
        activity_data=activity_data.activity_data,
        ip_address=ip_address,
    )
    
    return activity


@router.get("/parent-activity/student/{student_id}", response_model=ParentActivityListResponse)
async def get_student_activity_log(
    student_id: UUID,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    Get parent activity log for a student (admin/teacher)
    
    - **student_id**: Student ID
    """
    skip = (page - 1) * page_size
    activities, total = await ParentActivityCRUD.get_by_student(
        db,
        student_id=student_id,
        skip=skip,
        limit=page_size,
    )
    
    return ParentActivityListResponse(
        data=activities,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/parent-activity/parent", response_model=ParentActivityListResponse)
async def get_my_activity_log(
    parent_email: str = Query(..., description="Parent's email"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    Get parent's own activity log
    
    - **parent_email**: Parent's email
    """
    # TODO: Verify that current user is the parent
    
    skip = (page - 1) * page_size
    activities, total = await ParentActivityCRUD.get_by_parent(
        db,
        parent_email=parent_email,
        skip=skip,
        limit=page_size,
    )
    
    return ParentActivityListResponse(
        data=activities,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/parent-portal/student/{student_id}/overview")
async def get_student_overview_for_parent(
    student_id: UUID,
    parent_email: str = Query(..., description="Parent's email"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get student overview for parent portal
    
    Returns:
    - Student info (name, grade, etc.)
    - Current enrollments
    - Recent grades
    - Attendance summary
    - Badges earned
    - Points and level
    
    - **student_id**: Student ID
    - **parent_email**: Parent's email
    """
    # Verify parent has consent
    consent = await ParentalConsentCRUD.get_by_student(db, student_id)
    if not consent or consent.parent_email != parent_email or not consent.consent_given:
        raise HTTPException(
            status_code=403,
            detail="Parent not authorized or consent not verified"
        )
    
    # TODO: Fetch student data from api-core service
    # TODO: Fetch enrollments, grades, attendance, badges, points
    
    # For now, return placeholder
    return {
        "student_id": student_id,
        "parent_email": parent_email,
        "message": "Student overview endpoint - to be implemented with api-core integration",
        "data": {
            "enrollments": [],
            "recent_grades": [],
            "attendance": {},
            "badges": [],
            "game_points": {},
        }
    }
