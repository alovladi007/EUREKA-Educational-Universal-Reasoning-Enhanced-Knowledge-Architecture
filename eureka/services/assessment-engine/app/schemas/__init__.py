"""
Pydantic schemas for Assessment Engine
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# ============================================================================
# Assessment Schemas
# ============================================================================

class AssessmentCreate(BaseModel):
    """Create a new assessment"""
    course_id: UUID
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    assessment_type: str = Field(..., pattern="^(quiz|exam|assignment|homework)$")
    total_points: float = Field(default=100.0, gt=0)
    passing_score: float = Field(default=60.0, ge=0, le=100)
    time_limit_minutes: Optional[int] = Field(None, gt=0)
    shuffle_questions: bool = False
    show_correct_answers: bool = True
    allow_multiple_attempts: bool = True
    max_attempts: int = Field(default=3, ge=1)
    auto_grade: bool = True
    use_rubric: bool = False
    due_date: Optional[datetime] = None

class AssessmentResponse(BaseModel):
    """Assessment response"""
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str]
    assessment_type: str
    total_points: float
    passing_score: float
    time_limit_minutes: Optional[int]
    is_published: bool
    created_at: datetime
    due_date: Optional[datetime]
    
    class Config:
        from_attributes = True


# ============================================================================
# Question Schemas
# ============================================================================

class QuestionOption(BaseModel):
    """Multiple choice option"""
    id: str  # A, B, C, D
    text: str

class QuestionCreate(BaseModel):
    """Create a question"""
    assessment_id: UUID
    question_type: str = Field(..., pattern="^(multiple_choice|true_false|short_answer|essay|code|math)$")
    question_text: str = Field(..., min_length=1)
    question_number: int = Field(..., ge=1)
    points: float = Field(default=1.0, gt=0)
    options: Optional[List[QuestionOption]] = None
    correct_answer: Optional[str] = None
    answer_key: Optional[str] = None
    keywords: Optional[List[str]] = None
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    topics: Optional[List[str]] = None
    image_url: Optional[str] = None

class QuestionResponse(BaseModel):
    """Question response"""
    id: UUID
    assessment_id: UUID
    question_type: str
    question_text: str
    question_number: int
    points: float
    options: Optional[List[Dict[str, str]]]
    difficulty: str
    topics: Optional[List[str]]
    
    class Config:
        from_attributes = True


# ============================================================================
# Rubric Schemas
# ============================================================================

class RubricCriterion(BaseModel):
    """Single rubric criterion"""
    name: str
    points: float
    description: str

class RubricCreate(BaseModel):
    """Create a rubric"""
    question_id: UUID
    name: str
    criteria: List[RubricCriterion]

class RubricResponse(BaseModel):
    """Rubric response"""
    id: UUID
    question_id: UUID
    name: str
    criteria: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True


# ============================================================================
# Submission Schemas
# ============================================================================

class SubmissionCreate(BaseModel):
    """Start a new submission"""
    assessment_id: UUID
    user_id: UUID

class AnswerSubmit(BaseModel):
    """Submit an answer"""
    question_id: UUID
    answer_text: Optional[str] = None
    selected_option: Optional[str] = None

class SubmissionSubmit(BaseModel):
    """Submit assessment for grading"""
    submission_id: UUID
    answers: List[AnswerSubmit]

class AnswerResponse(BaseModel):
    """Answer response"""
    id: UUID
    question_id: UUID
    answer_text: Optional[str]
    selected_option: Optional[str]
    is_correct: Optional[bool]
    points_earned: Optional[float]
    points_possible: Optional[float]
    feedback: Optional[str]
    
    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    """Submission response"""
    id: UUID
    assessment_id: UUID
    user_id: UUID
    attempt_number: int
    status: str
    total_score: Optional[float]
    max_score: Optional[float]
    percentage: Optional[float]
    grade: Optional[str]
    started_at: datetime
    submitted_at: Optional[datetime]
    graded_at: Optional[datetime]
    overall_feedback: Optional[str]
    
    class Config:
        from_attributes = True

class SubmissionDetail(BaseModel):
    """Submission with answers"""
    submission: SubmissionResponse
    answers: List[AnswerResponse]


# ============================================================================
# Grading Schemas
# ============================================================================

class GradeRequest(BaseModel):
    """Request to grade a submission"""
    submission_id: UUID
    use_ai: bool = True
    generate_feedback: bool = True

class GradeResponse(BaseModel):
    """Grading result"""
    submission_id: UUID
    total_score: float
    max_score: float
    percentage: float
    grade: str
    overall_feedback: str
    answers_graded: int
    ai_graded: int
    auto_graded: int

class AnswerGrading(BaseModel):
    """Grading for a single answer"""
    answer_id: UUID
    is_correct: bool
    points_earned: float
    feedback: str


# ============================================================================
# Analytics Schemas
# ============================================================================

class AssessmentAnalyticsResponse(BaseModel):
    """Assessment analytics"""
    assessment_id: UUID
    total_submissions: int
    average_score: Optional[float]
    median_score: Optional[float]
    highest_score: Optional[float]
    lowest_score: Optional[float]
    score_distribution: Optional[Dict[str, int]]
    question_performance: Optional[Dict[str, float]]
    
    class Config:
        from_attributes = True

class StudentPerformance(BaseModel):
    """Student performance across assessments"""
    user_id: UUID
    total_assessments: int
    average_score: float
    highest_score: float
    lowest_score: float
    total_points_earned: float
    total_points_possible: float
    improvement_trend: float  # Percentage change from first to last
