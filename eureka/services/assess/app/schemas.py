"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum

# Enums

class AssessmentType(str, Enum):
    QUIZ = "quiz"
    EXAM = "exam"
    HOMEWORK = "homework"
    PRACTICE = "practice"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    ESSAY = "essay"
    CODE = "code"
    MATCHING = "matching"

class AttemptStatus(str, Enum):
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    GRADED = "graded"
    INCOMPLETE = "incomplete"

class GradingStatus(str, Enum):
    PENDING = "pending"
    AUTO_GRADED = "auto_graded"
    MANUALLY_GRADED = "manually_graded"
    AI_GRADED = "ai_graded"

# Question Schemas

class QuestionOption(BaseModel):
    id: str
    text: str

class QuestionCreate(BaseModel):
    question_type: QuestionType
    question_text: str
    points: float = 1.0
    order_index: Optional[int] = None
    options: Optional[List[QuestionOption]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    rubric: Optional[Dict[str, Any]] = None
    code_template: Optional[str] = None
    test_cases: Optional[List[Dict[str, Any]]] = None

class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    points: Optional[float] = None
    options: Optional[List[QuestionOption]] = None
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None

class QuestionResponse(BaseModel):
    id: UUID
    assessment_id: UUID
    question_type: QuestionType
    question_text: str
    points: float
    order_index: Optional[int]
    options: Optional[List[Dict[str, Any]]]
    explanation: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Assessment Schemas

class AssessmentCreate(BaseModel):
    course_id: UUID
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    assessment_type: AssessmentType
    total_points: float = 100.0
    passing_score: Optional[float] = None
    time_limit_minutes: Optional[int] = None
    attempts_allowed: int = 1
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    late_submission_allowed: bool = False
    late_penalty_percent: float = 0.0
    shuffle_questions: bool = False
    show_correct_answers: bool = True
    show_feedback: bool = True
    questions: Optional[List[QuestionCreate]] = None

class AssessmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    total_points: Optional[float] = None
    passing_score: Optional[float] = None
    time_limit_minutes: Optional[int] = None
    is_published: Optional[bool] = None
    due_date: Optional[datetime] = None

class AssessmentResponse(BaseModel):
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str]
    assessment_type: AssessmentType
    total_points: float
    passing_score: Optional[float]
    time_limit_minutes: Optional[int]
    attempts_allowed: int
    is_published: bool
    start_date: Optional[datetime]
    due_date: Optional[datetime]
    late_submission_allowed: bool
    shuffle_questions: bool
    show_correct_answers: bool
    show_feedback: bool
    created_at: datetime
    updated_at: datetime
    questions: Optional[List[QuestionResponse]] = None

    class Config:
        from_attributes = True

# Attempt Schemas

class AttemptStart(BaseModel):
    assessment_id: UUID
    user_id: UUID

class ResponseSubmit(BaseModel):
    question_id: UUID
    response_text: Optional[str] = None
    response_data: Optional[Dict[str, Any]] = None

class AttemptSubmit(BaseModel):
    responses: List[ResponseSubmit]

class QuestionResponseResult(BaseModel):
    id: UUID
    question_id: UUID
    response_text: Optional[str]
    is_correct: Optional[bool]
    points_earned: Optional[float]
    points_possible: float
    feedback: Optional[str] = None

    class Config:
        from_attributes = True

class AttemptResponse(BaseModel):
    id: UUID
    assessment_id: UUID
    user_id: UUID
    attempt_number: int
    status: AttemptStatus
    started_at: datetime
    submitted_at: Optional[datetime]
    time_spent_seconds: Optional[int]
    score: Optional[float]
    max_score: Optional[float]
    percentage: Optional[float]
    is_late: bool
    responses: Optional[List[QuestionResponseResult]] = None

    class Config:
        from_attributes = True

# Grading Schemas

class AutoGradeRequest(BaseModel):
    attempt_id: UUID

class AutoGradeResponse(BaseModel):
    attempt_id: UUID
    total_score: float
    max_score: float
    percentage: float
    graded_questions: int
    total_questions: int
    grading_status: GradingStatus

class AIGradeRequest(BaseModel):
    response_id: UUID
    question_text: str
    response_text: str
    rubric: Optional[Dict[str, Any]] = None

class AIGradeResponse(BaseModel):
    response_id: UUID
    score: float
    max_score: float
    feedback: str
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    confidence_score: float

# List Response Schemas

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int

class AssessmentListResponse(PaginatedResponse):
    items: List[AssessmentResponse]

class AttemptListResponse(PaginatedResponse):
    items: List[AttemptResponse]
