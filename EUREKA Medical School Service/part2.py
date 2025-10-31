"""
Pydantic Schemas for EUREKA Medical School Service - Part 2
OSCE, Diagnostic Reasoning, and Student Profiles
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

# Import enums from Part 1
from .schemas_part1 import CaseComplexity, DiagnosisConfidence


# ==========================================
# OSCE (Objective Structured Clinical Examination)
# ==========================================

class RubricItem(BaseModel):
    """Individual rubric checklist item."""
    id: str
    description: str
    points: int
    category: str  # e.g., "History Taking", "Physical Exam", "Communication"


class OSCEStationBase(BaseModel):
    """Base OSCE station schema."""
    station_number: int = Field(..., ge=1, le=20)
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10, max_length=2000)
    patient_scenario: str = Field(..., min_length=50, max_length=3000)
    standardized_patient_instructions: Optional[str] = Field(None, max_length=2000)
    tasks: List[Dict[str, Any]]
    duration_minutes: int = Field(10, ge=5, le=30)
    rubric: List[RubricItem]
    total_points: int = Field(..., ge=0)
    passing_score: int = Field(..., ge=0)
    clinical_skills: List[str]
    communication_skills: List[str]
    specialty: Optional[str] = Field(None, max_length=100)
    difficulty: Optional[CaseComplexity] = None


class OSCEStationCreate(OSCEStationBase):
    """Schema for creating OSCE stations."""
    org_id: UUID


class OSCEStationResponse(OSCEStationBase):
    """Schema for OSCE station responses."""
    id: UUID
    org_id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OSCEStationStudentView(BaseModel):
    """OSCE station view for students (no rubric details)."""
    id: UUID
    station_number: int
    title: str
    description: str
    patient_scenario: str
    tasks: List[Dict[str, Any]]
    duration_minutes: int
    total_points: int
    specialty: Optional[str]
    difficulty: Optional[CaseComplexity]


class OSCEAttemptCreate(BaseModel):
    """Schema for creating OSCE attempts."""
    station_id: UUID
    exam_id: Optional[UUID] = None
    checklist_scores: Dict[str, int]  # Rubric item ID -> score
    student_reflection: Optional[str] = Field(None, max_length=2000)
    recording_consent_given: bool = False


class OSCEAttemptResponse(BaseModel):
    """Schema for OSCE attempt responses."""
    id: UUID
    user_id: UUID
    station_id: UUID
    exam_id: Optional[UUID]
    started_at: datetime
    completed_at: Optional[datetime]
    checklist_scores: Dict[str, int]
    total_score: Optional[int]
    percentage: Optional[float]
    passed: Optional[bool]
    evaluator_notes: Optional[str]
    student_reflection: Optional[str]
    recording_url: Optional[str]
    recording_consent_given: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class OSCEExamSession(BaseModel):
    """Complete OSCE exam session with multiple stations."""
    exam_id: UUID
    user_id: UUID
    stations: List[OSCEStationStudentView]
    started_at: datetime
    total_duration_minutes: int
    total_stations: int


# ==========================================
# Diagnostic Reasoning
# ==========================================

class DiagnosticQuestion(BaseModel):
    """Question asked during diagnostic session."""
    question: str
    answer: str
    points_awarded: Optional[int] = None


class DiagnosticTest(BaseModel):
    """Test ordered during diagnostic session."""
    test_name: str
    result: str
    cost: Optional[float] = None
    appropriate: Optional[bool] = None


class DiagnosticSessionCreate(BaseModel):
    """Schema for creating diagnostic sessions."""
    chief_complaint: str = Field(..., min_length=10, max_length=500)
    patient_demographics: Dict[str, Any]
    initial_findings: Dict[str, Any]


class DiagnosticSessionUpdate(BaseModel):
    """Schema for updating diagnostic sessions."""
    questions_asked: Optional[List[DiagnosticQuestion]] = None
    tests_ordered: Optional[List[DiagnosticTest]] = None
    differential_diagnoses: Optional[List[Dict[str, Any]]] = None


class DiagnosticSessionComplete(BaseModel):
    """Schema for completing diagnostic session."""
    final_diagnosis: str = Field(..., min_length=3, max_length=255)
    confidence_level: DiagnosisConfidence
    reasoning: str = Field(..., min_length=50, max_length=3000)


class DiagnosticSessionResponse(BaseModel):
    """Schema for diagnostic session responses."""
    id: UUID
    user_id: UUID
    started_at: datetime
    completed_at: Optional[datetime]
    chief_complaint: str
    patient_demographics: Dict[str, Any]
    initial_findings: Dict[str, Any]
    questions_asked: Optional[List[DiagnosticQuestion]]
    tests_ordered: Optional[List[DiagnosticTest]]
    differential_diagnoses: Optional[List[Dict[str, Any]]]
    final_diagnosis: Optional[str]
    confidence_level: Optional[DiagnosisConfidence]
    reasoning: Optional[str]
    correct_diagnosis: Optional[str]
    is_correct: Optional[bool]
    efficiency_score: Optional[float]
    accuracy_score: Optional[float]
    time_to_diagnosis_minutes: Optional[int]
    ai_analysis: Optional[str]
    suggestions: Optional[List[str]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DiagnosticFeedback(BaseModel):
    """AI feedback for diagnostic session."""
    is_correct: bool
    accuracy_score: float
    efficiency_score: float
    analysis: str
    strengths: List[str]
    areas_for_improvement: List[str]
    suggestions: List[str]
    correct_diagnosis: str
    key_findings_missed: List[str]
    unnecessary_tests: List[str]


# ==========================================
# Medical Student Profile
# ==========================================

class MedicalStudentProfileCreate(BaseModel):
    """Schema for creating medical student profile."""
    user_id: UUID
    medical_school: str = Field(..., min_length=2, max_length=255)
    graduation_year: int = Field(..., ge=2020, le=2040)
    current_year: int = Field(..., ge=1, le=4)  # MS1-MS4
    specialty_interests: Optional[List[str]] = None
    research_interests: Optional[List[str]] = None
    target_step1_score: Optional[int] = Field(None, ge=0, le=300)
    target_specialty: Optional[str] = Field(None, max_length=100)
    study_hours_per_week: Optional[int] = Field(None, ge=0, le=168)


class MedicalStudentProfileUpdate(BaseModel):
    """Schema for updating medical student profile."""
    medical_school: Optional[str] = Field(None, min_length=2, max_length=255)
    current_year: Optional[int] = Field(None, ge=1, le=4)
    step1_score: Optional[int] = Field(None, ge=0, le=300)
    step2_ck_score: Optional[int] = Field(None, ge=0, le=300)
    step2_cs_result: Optional[str] = Field(None, pattern="^(Pass|Fail)$")
    step3_score: Optional[int] = Field(None, ge=0, le=300)
    specialty_interests: Optional[List[str]] = None
    research_interests: Optional[List[str]] = None
    target_step1_score: Optional[int] = Field(None, ge=0, le=300)
    target_specialty: Optional[str] = Field(None, max_length=100)
    study_hours_per_week: Optional[int] = Field(None, ge=0, le=168)


class MedicalStudentProfileResponse(BaseModel):
    """Schema for medical student profile responses."""
    id: UUID
    user_id: UUID
    medical_school: str
    graduation_year: int
    current_year: int
    step1_score: Optional[int]
    step1_date: Optional[datetime]
    step2_ck_score: Optional[int]
    step2_ck_date: Optional[datetime]
    step2_cs_result: Optional[str]
    step3_score: Optional[int]
    step3_date: Optional[datetime]
    specialty_interests: Optional[List[str]]
    research_interests: Optional[List[str]]
    usmle_questions_completed: int
    usmle_accuracy_rate: float
    clinical_cases_completed: int
    osce_stations_completed: int
    strong_subjects: Optional[Dict[str, Any]]
    weak_subjects: Optional[Dict[str, Any]]
    target_step1_score: Optional[int]
    target_specialty: Optional[str]
    study_hours_per_week: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ==========================================
# Medication/Pharmacology
# ==========================================

class MedicationBase(BaseModel):
    """Base medication schema."""
    generic_name: str = Field(..., min_length=2, max_length=255)
    brand_names: Optional[List[str]] = None
    drug_class: str = Field(..., min_length=2, max_length=100)
    mechanism_of_action: str = Field(..., min_length=10, max_length=2000)
    indications: List[str]
    contraindications: List[str]
    side_effects: List[str]
    drug_interactions: Optional[List[Dict[str, str]]] = None
    adult_dosing: Optional[str] = Field(None, max_length=1000)
    pediatric_dosing: Optional[str] = Field(None, max_length=1000)
    renal_adjustments: Optional[str] = Field(None, max_length=500)
    hepatic_adjustments: Optional[str] = Field(None, max_length=500)
    monitoring_parameters: Optional[List[str]] = None
    black_box_warnings: Optional[List[str]] = None
    clinical_pearls: Optional[List[str]] = None
    board_exam_highlights: Optional[List[str]] = None


class MedicationCreate(MedicationBase):
    """Schema for creating medications."""
    pass


class MedicationResponse(MedicationBase):
    """Schema for medication responses."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class MedicationQuery(BaseModel):
    """Query parameters for medications."""
    drug_class: Optional[str] = None
    search: Optional[str] = None  # Search generic/brand names
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)


# ==========================================
# Recommendations
# ==========================================

class StudyRecommendation(BaseModel):
    """Personalized study recommendation."""
    type: str  # "question_set", "clinical_case", "osce_station", "topic_review"
    title: str
    description: str
    reason: str
    priority: int = Field(..., ge=1, le=5)  # 1=highest, 5=lowest
    estimated_time_minutes: int
    resource_id: Optional[UUID] = None
    resource_type: Optional[str] = None


class PerformanceAlert(BaseModel):
    """Alert for performance issues."""
    type: str  # "weak_subject", "low_accuracy", "time_management", etc.
    severity: str  # "low", "medium", "high"
    message: str
    recommendations: List[str]
    created_at: datetime


# ==========================================
# Batch Operations
# ==========================================

class BatchQuestionImport(BaseModel):
    """Schema for batch importing USMLE questions."""
    questions: List[USMLEQuestionCreate]
    validate_only: bool = False


class BatchImportResult(BaseModel):
    """Result of batch import operation."""
    total_submitted: int
    successful: int
    failed: int
    errors: List[Dict[str, Any]]
    created_ids: List[UUID]
