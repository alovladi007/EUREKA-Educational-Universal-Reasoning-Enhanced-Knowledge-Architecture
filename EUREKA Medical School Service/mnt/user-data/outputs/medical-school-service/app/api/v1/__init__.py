"""
API Endpoints for EUREKA Medical School Service
Complete REST API for medical education features
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# Import schemas (will be organized in __init__.py)
from app.schemas import *
from app.database import get_db
from app import crud
from app.config import settings

# Create router
router = APIRouter()


# ==========================================
# USMLE Question Bank
# ==========================================

@router.post("/usmle/questions", response_model=USMLEQuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_usmle_question(
    question: USMLEQuestionCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new USMLE question.
    
    Requires instructor or admin role.
    """
    return await crud.create_usmle_question(db, question)


@router.get("/usmle/questions", response_model=List[USMLEQuestionResponse])
async def list_usmle_questions(
    difficulty_level: Optional[DifficultyLevel] = None,
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    List USMLE questions with optional filtering.
    
    Students receive questions without correct answers.
    """
    return await crud.list_usmle_questions(
        db, difficulty_level, subject, topic, limit, offset
    )


@router.get("/usmle/questions/{question_id}", response_model=USMLEQuestionResponse)
async def get_usmle_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific USMLE question by ID."""
    question = await crud.get_usmle_question(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.post("/usmle/attempts", response_model=USMLEAttemptResponse, status_code=status.HTTP_201_CREATED)
async def submit_usmle_attempt(
    attempt: USMLEAttemptCreate,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Submit an answer to a USMLE question.
    
    Returns immediate feedback including correctness and explanation.
    """
    return await crud.create_usmle_attempt(db, user_id, attempt)


@router.get("/usmle/attempts/me", response_model=List[USMLEAttemptResponse])
async def get_my_usmle_attempts(
    user_id: UUID,  # From auth middleware
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Get my USMLE question attempts."""
    return await crud.get_user_usmle_attempts(db, user_id, limit)


@router.get("/usmle/stats/me", response_model=USMLEStatistics)
async def get_my_usmle_stats(
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Get my USMLE performance statistics."""
    return await crud.get_usmle_statistics(db, user_id)


# ==========================================
# Clinical Cases
# ==========================================

@router.post("/clinical-cases", response_model=ClinicalCaseResponse, status_code=status.HTTP_201_CREATED)
async def create_clinical_case(
    case: ClinicalCaseCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new clinical case.
    
    Requires instructor or admin role.
    """
    return await crud.create_clinical_case(db, case)


@router.get("/clinical-cases", response_model=List[ClinicalCaseStudentView])
async def list_clinical_cases(
    specialty: Optional[str] = None,
    complexity: Optional[CaseComplexity] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    List clinical cases.
    
    Students see cases without diagnostic answers.
    """
    return await crud.list_clinical_cases(
        db, specialty, complexity, limit, offset
    )


@router.get("/clinical-cases/{case_id}", response_model=ClinicalCaseStudentView)
async def get_clinical_case(
    case_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific clinical case (student view - no answers)."""
    case = await crud.get_clinical_case_student_view(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("/clinical-cases/attempts", response_model=CaseAttemptResponse, status_code=status.HTTP_201_CREATED)
async def start_case_attempt(
    case_id: UUID,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Start a new clinical case attempt."""
    return await crud.start_case_attempt(db, user_id, case_id)


@router.put("/clinical-cases/attempts/{attempt_id}", response_model=CaseAttemptResponse)
async def submit_case_attempt(
    attempt_id: UUID,
    submission: CaseAttemptCreate,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Submit a clinical case diagnosis and receive AI feedback.
    
    Provides automated grading and personalized feedback.
    """
    return await crud.submit_case_attempt(db, user_id, attempt_id, submission)


@router.get("/clinical-cases/attempts/me", response_model=List[CaseAttemptResponse])
async def get_my_case_attempts(
    user_id: UUID,  # From auth middleware
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Get my clinical case attempts."""
    return await crud.get_user_case_attempts(db, user_id, limit)


@router.get("/clinical-cases/stats/me", response_model=ClinicalCaseStatistics)
async def get_my_case_stats(
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Get my clinical case performance statistics."""
    return await crud.get_case_statistics(db, user_id)


# ==========================================
# OSCE Stations
# ==========================================

@router.post("/osce/stations", response_model=OSCEStationResponse, status_code=status.HTTP_201_CREATED)
async def create_osce_station(
    station: OSCEStationCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new OSCE station.
    
    Requires instructor or admin role.
    """
    return await crud.create_osce_station(db, station)


@router.get("/osce/stations", response_model=List[OSCEStationStudentView])
async def list_osce_stations(
    specialty: Optional[str] = None,
    difficulty: Optional[CaseComplexity] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    List OSCE stations.
    
    Students see stations without detailed rubric.
    """
    return await crud.list_osce_stations(
        db, specialty, difficulty, limit, offset
    )


@router.get("/osce/stations/{station_id}", response_model=OSCEStationStudentView)
async def get_osce_station(
    station_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific OSCE station (student view)."""
    station = await crud.get_osce_station_student_view(db, station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return station


@router.post("/osce/attempts", response_model=OSCEAttemptResponse, status_code=status.HTTP_201_CREATED)
async def submit_osce_attempt(
    attempt: OSCEAttemptCreate,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Submit OSCE station performance.
    
    Includes checklist scoring and optional recording consent.
    HIPAA-compliant with encrypted storage.
    """
    return await crud.create_osce_attempt(db, user_id, attempt)


@router.get("/osce/attempts/me", response_model=List[OSCEAttemptResponse])
async def get_my_osce_attempts(
    user_id: UUID,  # From auth middleware
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Get my OSCE attempts."""
    return await crud.get_user_osce_attempts(db, user_id, limit)


# ==========================================
# Diagnostic Reasoning
# ==========================================

@router.post("/diagnostic/sessions", response_model=DiagnosticSessionResponse, status_code=status.HTTP_201_CREATED)
async def start_diagnostic_session(
    session: DiagnosticSessionCreate,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Start a new AI-powered diagnostic reasoning session.
    
    Interactive clinical reasoning practice with virtual patient.
    """
    return await crud.start_diagnostic_session(db, user_id, session)


@router.put("/diagnostic/sessions/{session_id}", response_model=DiagnosticSessionResponse)
async def update_diagnostic_session(
    session_id: UUID,
    update: DiagnosticSessionUpdate,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Update diagnostic session with questions asked and tests ordered."""
    return await crud.update_diagnostic_session(db, user_id, session_id, update)


@router.post("/diagnostic/sessions/{session_id}/complete", response_model=DiagnosticSessionResponse)
async def complete_diagnostic_session(
    session_id: UUID,
    completion: DiagnosticSessionComplete,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Complete diagnostic session with final diagnosis.
    
    Receives AI-powered feedback and performance analysis.
    """
    return await crud.complete_diagnostic_session(
        db, user_id, session_id, completion
    )


@router.get("/diagnostic/sessions/me", response_model=List[DiagnosticSessionResponse])
async def get_my_diagnostic_sessions(
    user_id: UUID,  # From auth middleware
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Get my diagnostic reasoning sessions."""
    return await crud.get_user_diagnostic_sessions(db, user_id, limit)


# ==========================================
# Medical Student Profile
# ==========================================

@router.post("/profile", response_model=MedicalStudentProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile: MedicalStudentProfileCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create medical student profile."""
    return await crud.create_student_profile(db, profile)


@router.get("/profile/me", response_model=MedicalStudentProfileResponse)
async def get_my_profile(
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Get my medical student profile."""
    profile = await crud.get_student_profile(db, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/profile/me", response_model=MedicalStudentProfileResponse)
async def update_my_profile(
    update: MedicalStudentProfileUpdate,
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Update my medical student profile."""
    return await crud.update_student_profile(db, user_id, update)


# ==========================================
# Dashboard & Analytics
# ==========================================

@router.get("/dashboard/me", response_model=MedicalStudentDashboard)
async def get_my_dashboard(
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Get comprehensive medical student dashboard.
    
    Includes USMLE stats, case performance, and personalized recommendations.
    """
    return await crud.get_student_dashboard(db, user_id)


@router.get("/recommendations/me", response_model=List[StudyRecommendation])
async def get_my_recommendations(
    user_id: UUID,  # From auth middleware
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Get personalized study recommendations.
    
    AI-powered suggestions based on performance and goals.
    """
    return await crud.get_study_recommendations(db, user_id, limit)


@router.get("/alerts/me", response_model=List[PerformanceAlert])
async def get_my_alerts(
    user_id: UUID,  # From auth middleware
    db: AsyncSession = Depends(get_db)
):
    """Get performance alerts and areas needing attention."""
    return await crud.get_performance_alerts(db, user_id)


# ==========================================
# Pharmacology
# ==========================================

@router.post("/medications", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
async def create_medication(
    medication: MedicationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Add medication to pharmacology database."""
    return await crud.create_medication(db, medication)


@router.get("/medications", response_model=List[MedicationResponse])
async def search_medications(
    search: Optional[str] = None,
    drug_class: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    Search pharmacology database.
    
    Search by generic name, brand name, or drug class.
    """
    return await crud.search_medications(
        db, search, drug_class, limit, offset
    )


@router.get("/medications/{medication_id}", response_model=MedicationResponse)
async def get_medication(
    medication_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed medication information."""
    medication = await crud.get_medication(db, medication_id)
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    return medication


# ==========================================
# Batch Operations
# ==========================================

@router.post("/usmle/questions/batch-import", response_model=BatchImportResult)
async def batch_import_questions(
    batch: BatchQuestionImport,
    db: AsyncSession = Depends(get_db)
):
    """
    Batch import USMLE questions.
    
    Requires admin role.
    Validates questions and imports in bulk.
    """
    return await crud.batch_import_usmle_questions(db, batch)


# ==========================================
# HIPAA Compliance
# ==========================================

@router.get("/hipaa/audit-log", response_model=List[Dict])
async def get_audit_log(
    user_id: UUID,  # From auth middleware (admin only)
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    Get HIPAA audit log.
    
    Admin only. 6-year retention for compliance.
    """
    return await crud.get_audit_log(
        db, user_id, start_date, end_date, limit
    )


@router.post("/hipaa/deidentify", response_model=Dict[str, str])
async def deidentify_text(
    text: str,
    db: AsyncSession = Depends(get_db)
):
    """
    De-identify text for HIPAA compliance.
    
    Automatically scrubs PHI (Protected Health Information).
    """
    return await crud.deidentify_text(text)
