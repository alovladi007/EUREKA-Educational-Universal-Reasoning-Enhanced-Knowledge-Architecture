"""
Pydantic schemas for courses and enrollments

Request/response models for course and enrollment endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID


class CourseCreate(BaseModel):
    """Course creation request"""
    title: str = Field(..., min_length=1, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    tier: str = Field(..., description="Educational tier")
    
    # Instructor
    instructor_id: Optional[UUID] = None
    
    # Curriculum
    syllabus: Optional[Dict[str, Any]] = None
    learning_objectives: Optional[List[str]] = Field(default_factory=list)
    standards: Optional[Dict[str, Any]] = None
    
    # Metadata
    subject: Optional[str] = Field(None, max_length=100)
    level: Optional[str] = Field(None, max_length=50)
    credits: Optional[int] = Field(None, ge=0)
    
    # Settings
    settings: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    # Schedule
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    
    @validator('tier')
    def validate_tier(cls, v):
        """Validate tier is supported"""
        valid_tiers = [
            'high_school', 'undergraduate', 'graduate',
            'professional_medical', 'professional_law',
            'professional_mba', 'professional_engineering'
        ]
        if v not in valid_tiers:
            raise ValueError(f'Tier must be one of: {", ".join(valid_tiers)}')
        return v
    
    @validator('end_date')
    def validate_dates(cls, v, values):
        """Validate end date is after start date"""
        start_date = values.get('start_date')
        if start_date and v and v <= start_date:
            raise ValueError('End date must be after start date')
        return v
    
    @validator('level')
    def validate_level(cls, v):
        """Validate level if provided"""
        if v:
            valid_levels = ['beginner', 'intermediate', 'advanced', 'expert']
            if v.lower() not in valid_levels:
                raise ValueError(f'Level must be one of: {", ".join(valid_levels)}')
        return v.lower() if v else v


class CourseUpdate(BaseModel):
    """Course update request"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    instructor_id: Optional[UUID] = None
    syllabus: Optional[Dict[str, Any]] = None
    learning_objectives: Optional[List[str]] = None
    standards: Optional[Dict[str, Any]] = None
    subject: Optional[str] = Field(None, max_length=100)
    level: Optional[str] = Field(None, max_length=50)
    credits: Optional[int] = Field(None, ge=0)
    settings: Optional[Dict[str, Any]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_published: Optional[bool] = None
    is_archived: Optional[bool] = None
    
    class Config:
        extra = 'ignore'


class CourseResponse(BaseModel):
    """Course response model"""
    id: UUID
    org_id: UUID
    title: str
    code: Optional[str]
    description: Optional[str]
    tier: str
    instructor_id: Optional[UUID]
    syllabus: Optional[Dict[str, Any]]
    learning_objectives: Optional[List[str]]
    standards: Optional[Dict[str, Any]]
    subject: Optional[str]
    level: Optional[str]
    credits: Optional[int]
    settings: Dict[str, Any]
    is_published: bool
    is_archived: bool
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    # Computed fields
    enrollment_count: Optional[int] = Field(None, description="Number of enrolled students")
    
    class Config:
        from_attributes = True


class CourseList(BaseModel):
    """Paginated list of courses"""
    items: List[CourseResponse]
    total: int
    page: int
    page_size: int
    pages: int


class EnrollmentCreate(BaseModel):
    """Enrollment creation request"""
    user_id: UUID = Field(..., description="User ID to enroll")
    course_id: UUID = Field(..., description="Course ID")


class EnrollmentUpdate(BaseModel):
    """Enrollment update request"""
    status: Optional[str] = Field(None, description="Enrollment status")
    progress_percent: Optional[int] = Field(None, ge=0, le=100)
    mastery_level: Optional[int] = Field(None, ge=0, le=100)
    
    @validator('status')
    def validate_status(cls, v):
        """Validate status is valid"""
        if v:
            valid_statuses = ['active', 'completed', 'withdrawn', 'dropped']
            if v not in valid_statuses:
                raise ValueError(f'Status must be one of: {", ".join(valid_statuses)}')
        return v


class EnrollmentResponse(BaseModel):
    """Enrollment response model"""
    id: UUID
    user_id: UUID
    course_id: UUID
    status: str
    progress_percent: int
    mastery_level: int
    enrolled_at: datetime
    completed_at: Optional[datetime]
    withdrawn_at: Optional[datetime]
    
    # Include related user info
    user: Optional["UserResponse"] = None
    course: Optional[CourseResponse] = None
    
    class Config:
        from_attributes = True


class EnrollmentList(BaseModel):
    """Paginated list of enrollments"""
    items: List[EnrollmentResponse]
    total: int
    page: int
    page_size: int
    pages: int


class CourseStats(BaseModel):
    """Course statistics"""
    course_id: UUID
    total_enrollments: int
    active_enrollments: int
    completed_enrollments: int
    average_progress: float
    average_mastery: float


# Forward references
from app.schemas.auth import UserResponse
EnrollmentResponse.model_rebuild()
