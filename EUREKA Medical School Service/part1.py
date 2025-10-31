"""
Pydantic Schemas for EUREKA Medical School Service
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from enum import Enum


# ==========================================
# Enums
# ==========================================

class DifficultyLevel(str, Enum):
    """USMLE difficulty levels."""
    STEP_1 = "Step 1"
    STEP_2_CK = "Step 2 CK"
    STEP_2_CS = "Step 2 CS"
    STEP_3 = "Step 3"


class CaseComplexity(str, Enum):
    """Clinical case complexity."""
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class DiagnosisConfidence(str, Enum):
    """Diagnosis confidence levels."""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    DEFINITIVE = "definitive"


# ==========================================
# USMLE Questions
# ==========================================

class USMLEQuestionBase(BaseModel):
    """Base USMLE question schema."""
    question_text: str = Field(..., min_length=10, max_length=5000)
    vignette: Optional[str] = Field(None, max_length=3000)
    option_a: str = Field(..., min_length=1, max_length=500)
    option_b: str = Field(..., min_length=1, max_length=500)
    option_c: str = Field(..., min_length=1, max_length=500)
    option_d: str = Field(..., min_length=1, max_length=500)
    option_e: Optional[str] = Field(None, max_length=500)
    correct_answer: str = Field(..., pattern="^[A-E]$")
    difficulty_level: DifficultyLevel
    subject: str = Field(..., min_length=2, max_length=100)
    topic: str = Field(..., min_length=2, max_length=200)
    subtopic: Optional[str] = Field(None, max_length=200)
    explanation: str = Field(..., min_length=10, max_length=5000)
    learning_objectives: Optional[List[str]] = None
    key_concepts: Optional[List[str]] = None
    references: Optional[Dict[str, Any]] = None


class USMLEQuestionCreate(USMLEQuestionBase):
    """Schema for creating USMLE questions."""
    org_id: UUID


class USMLEQuestionUpdate(BaseModel):
    """Schema for updating USMLE questions."""
    question_text: Optional[str] = Field(None, min_length=10, max_length=5000)
    vignette: Optional[str] = Field(None, max_length=3000)
    option_a: Optional[str] = Field(None, min_length=1, max_length=500)
    option_b: Optional[str] = Field(None, min_length=1, max_length=500)
    option_c: Optional[str] = Field(None, min_length=1, max_length=500)
    option_d: Optional[str] = Field(None, min_length=1, max_length=500)
    option_e: Optional[str] = Field(None, max_length=500)
    explanation: Optional[str] = Field(None, min_length=10, max_length=5000)
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


class USMLEQuestionResponse(USMLEQuestionBase):
    """Schema for USMLE question responses."""
    id: UUID
    org_id: UUID
    times_used: int = 0
    times_correct: int = 0
    average_time_seconds: Optional[int] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    # Computed fields
    accuracy_rate: Optional[float] = None
    
    class Config:
        from_attributes = True


class USMLEAttemptCreate(BaseModel):
    """Schema for creating USMLE attempts."""
    question_id: UUID
    selected_answer: str = Field(..., pattern="^[A-E]$")
    time_spent_seconds: Optional[int] = Field(None, ge=0)
    session_id: Optional[UUID] = None


class USMLEAttemptResponse(BaseModel):
    """Schema for USMLE attempt responses."""
    id: UUID
    user_id: UUID
    question_id: UUID
    selected_answer: str
    is_correct: bool
    time_spent_seconds: Optional[int]
    attempt_number: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class USMLEQuestionQuery(BaseModel):
    """Query parameters for USMLE questions."""
    difficulty_level: Optional[DifficultyLevel] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)
    include_used: bool = True


# ==========================================
# Clinical Cases
# ==========================================

class PatientDemographics(BaseModel):
    """Patient demographic information."""
    age: int = Field(..., ge=0, le=120)
    sex: str = Field(..., pattern="^(Male|Female|Other)$")
    ethnicity: Optional[str] = None
    occupation: Optional[str] = None


class VitalSigns(BaseModel):
    """Patient vital signs."""
    blood_pressure: Optional[str] = None  # e.g., "120/80"
    heart_rate: Optional[int] = Field(None, ge=20, le=300)
    respiratory_rate: Optional[int] = Field(None, ge=0, le=60)
    temperature: Optional[float] = Field(None, ge=95.0, le=110.0)  # Fahrenheit
    oxygen_saturation: Optional[int] = Field(None, ge=0, le=100)
    weight: Optional[float] = None  # kg
    height: Optional[float] = None  # cm
    bmi: Optional[float] = None


class ClinicalCaseBase(BaseModel):
    """Base clinical case schema."""
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10, max_length=2000)
    patient_age: int = Field(..., ge=0, le=120)
    patient_sex: str = Field(..., pattern="^(Male|Female|Other)$")
    chief_complaint: str = Field(..., min_length=5, max_length=500)
    presenting_symptoms: List[str]
    vital_signs: VitalSigns
    physical_exam_findings: Dict[str, Any]
    hpi: str = Field(..., min_length=10, max_length=2000)  # History of Present Illness
    past_medical_history: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    social_history: Optional[Dict[str, Any]] = None
    family_history: Optional[Dict[str, Any]] = None
    primary_diagnosis: str = Field(..., min_length=3, max_length=255)
    differential_diagnoses: List[str]
    icd_10_code: Optional[str] = Field(None, max_length=20)
    learning_objectives: List[str]
    key_teaching_points: List[str]
    complexity: CaseComplexity
    specialty: str = Field(..., min_length=2, max_length=100)
    setting: Optional[str] = Field(None, max_length=100)
    estimated_duration_minutes: int = Field(20, ge=5, le=180)


class ClinicalCaseCreate(ClinicalCaseBase):
    """Schema for creating clinical cases."""
    org_id: UUID
    case_number: Optional[str] = None
    lab_results: Optional[Dict[str, Any]] = None
    imaging_studies: Optional[Dict[str, Any]] = None
    diagnostic_procedures: Optional[Dict[str, Any]] = None
    treatment_plan: Optional[Dict[str, Any]] = None
    medications_prescribed: Optional[List[Dict[str, Any]]] = None
    follow_up_plan: Optional[str] = None


class ClinicalCaseResponse(ClinicalCaseBase):
    """Schema for clinical case responses."""
    id: UUID
    org_id: UUID
    case_number: str
    lab_results: Optional[Dict[str, Any]] = None
    imaging_studies: Optional[Dict[str, Any]] = None
    diagnostic_procedures: Optional[Dict[str, Any]] = None
    treatment_plan: Optional[Dict[str, Any]] = None
    medications_prescribed: Optional[List[Dict[str, Any]]] = None
    follow_up_plan: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ClinicalCaseStudentView(BaseModel):
    """Clinical case view for students (no answers)."""
    id: UUID
    title: str
    description: str
    patient_age: int
    patient_sex: str
    chief_complaint: str
    presenting_symptoms: List[str]
    vital_signs: VitalSigns
    hpi: str
    complexity: CaseComplexity
    specialty: str
    estimated_duration_minutes: int


class CaseAttemptCreate(BaseModel):
    """Schema for creating case attempts."""
    case_id: UUID
    differential_diagnosis: List[Dict[str, Any]]
    primary_diagnosis: str = Field(..., min_length=3, max_length=255)
    diagnostic_reasoning: str = Field(..., min_length=50, max_length=5000)
    treatment_plan: Optional[Dict[str, Any]] = None


class CaseAttemptResponse(BaseModel):
    """Schema for case attempt responses."""
    id: UUID
    user_id: UUID
    case_id: UUID
    started_at: datetime
    completed_at: Optional[datetime]
    time_spent_minutes: Optional[int]
    differential_diagnosis: List[Dict[str, Any]]
    primary_diagnosis: str
    diagnostic_reasoning: str
    treatment_plan: Optional[Dict[str, Any]]
    diagnosis_accuracy: Optional[float]
    reasoning_quality: Optional[float]
    treatment_appropriateness: Optional[float]
    overall_score: Optional[float]
    ai_feedback: Optional[str]
    instructor_feedback: Optional[str]
    is_complete: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CaseQuery(BaseModel):
    """Query parameters for clinical cases."""
    specialty: Optional[str] = None
    complexity: Optional[CaseComplexity] = None
    setting: Optional[str] = None
    min_duration: Optional[int] = Field(None, ge=5)
    max_duration: Optional[int] = Field(None, le=180)
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)


# ==========================================
# Statistics and Analytics
# ==========================================

class USMLEStatistics(BaseModel):
    """USMLE performance statistics."""
    total_questions_attempted: int
    correct_answers: int
    incorrect_answers: int
    accuracy_rate: float
    average_time_per_question: float
    questions_by_difficulty: Dict[str, int]
    questions_by_subject: Dict[str, int]
    strong_subjects: List[Dict[str, Any]]
    weak_subjects: List[Dict[str, Any]]


class ClinicalCaseStatistics(BaseModel):
    """Clinical case performance statistics."""
    total_cases_attempted: int
    completed_cases: int
    average_diagnosis_accuracy: float
    average_reasoning_quality: float
    average_overall_score: float
    cases_by_specialty: Dict[str, int]
    cases_by_complexity: Dict[str, int]
    average_completion_time: float


class MedicalStudentDashboard(BaseModel):
    """Comprehensive dashboard for medical students."""
    user_id: UUID
    usmle_stats: USMLEStatistics
    clinical_case_stats: ClinicalCaseStatistics
    recent_activity: List[Dict[str, Any]]
    upcoming_goals: List[Dict[str, Any]]
    recommendations: List[str]
