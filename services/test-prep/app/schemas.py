"""
Pydantic schemas for request/response validation
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    target_exams: Optional[List[str]] = []


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    target_exams: Optional[List[str]] = None
    daily_goal_minutes: Optional[int] = Field(None, ge=10, le=480)
    bio: Optional[str] = Field(None, max_length=1000)


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    is_premium: bool
    created_at: datetime
    total_questions_answered: int
    overall_accuracy: float
    current_streak_days: int
    
    class Config:
        orm_mode = True


# Question Schemas
class QuestionBase(BaseModel):
    question_text: str = Field(..., min_length=10, max_length=5000)
    question_type: str = Field(..., regex="^(multiple_choice|true_false|fill_blank|essay)$")
    correct_answer: Any
    explanation: Optional[str] = None
    hint: Optional[str] = None
    exam_type: str
    subject: str
    topic: str
    subtopic: Optional[str] = None


class QuestionCreate(QuestionBase):
    options: Optional[Dict[str, Any]] = None
    difficulty_label: str = Field("Medium", regex="^(Easy|Medium|Hard|Expert)$")
    estimated_time_seconds: int = Field(60, ge=10, le=600)
    tags: Optional[List[str]] = []


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    explanation: Optional[str] = None
    hint: Optional[str] = None
    difficulty_label: Optional[str] = None
    tags: Optional[List[str]] = None


class QuestionResponse(QuestionBase):
    id: str
    options: Optional[Dict[str, Any]]
    difficulty: float
    difficulty_label: str
    success_rate: float
    avg_time_seconds: Optional[int]
    exposure_count: int
    created_at: datetime
    
    class Config:
        orm_mode = True


# Question Attempt Schemas
class QuestionAttemptCreate(BaseModel):
    question_id: str
    user_answer: Any
    time_spent_seconds: int = Field(..., ge=0, le=3600)
    confidence_level: Optional[int] = Field(None, ge=1, le=5)
    hint_used: bool = False


class QuestionAttemptResponse(BaseModel):
    id: str
    question_id: str
    user_answer: Any
    is_correct: bool
    time_spent_seconds: int
    timestamp: datetime
    confidence_level: Optional[int]
    hint_used: bool
    
    class Config:
        orm_mode = True


# Study Session Schemas
class StudySessionCreate(BaseModel):
    session_type: str = Field(..., regex="^(practice|exam|review)$")
    exam_type: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None


class StudySessionResponse(BaseModel):
    id: str
    session_type: str
    start_time: datetime
    end_time: Optional[datetime]
    duration_seconds: Optional[int]
    total_questions: int
    correct_answers: int
    accuracy: float
    completed: bool
    
    class Config:
        orm_mode = True


# Exam Schemas
class ExamConfigCreate(BaseModel):
    exam_type: str
    duration_minutes: int = Field(..., ge=10, le=480)
    question_count: int = Field(..., ge=1, le=200)
    sections: Optional[List[Dict[str, Any]]] = []


class ExamSubmit(BaseModel):
    exam_id: str
    answers: Dict[str, Any]
    time_taken_seconds: int


class ExamResultResponse(BaseModel):
    id: str
    exam_type: str
    total_questions: int
    correct_answers: int
    score: float
    scaled_score: Optional[float]
    percentile: Optional[float]
    section_scores: Optional[Dict[str, float]]
    completed: bool
    created_at: datetime
    
    class Config:
        orm_mode = True


# Analytics Schemas
class PerformanceTrend(BaseModel):
    date: str
    questions: int
    accuracy: float
    study_time_minutes: int


class AbilityReport(BaseModel):
    overall_ability: float
    confidence_interval: float
    topic_abilities: Dict[str, Dict[str, float]]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[Dict[str, Any]]
    total_attempts: int
    overall_accuracy: float


class StudyPlanCreate(BaseModel):
    exam_type: str
    target_date: datetime
    target_score: Optional[float] = None
    study_hours_per_day: int = Field(2, ge=1, le=12)
    study_days_per_week: int = Field(5, ge=1, le=7)


class StudyPlanResponse(BaseModel):
    id: str
    exam_type: str
    target_date: datetime
    target_score: Optional[float]
    study_days_per_week: int
    minutes_per_day: int
    start_date: datetime
    completion_percentage: float
    is_active: bool
    
    class Config:
        orm_mode = True


# Authentication Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# Pagination Schema
class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int


# Error Response
class ErrorResponse(BaseModel):
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Success Response
class SuccessResponse(BaseModel):
    message: str
    data: Optional[Any] = None
