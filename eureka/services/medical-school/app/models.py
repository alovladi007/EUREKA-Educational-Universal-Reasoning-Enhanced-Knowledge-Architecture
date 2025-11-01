"""
Database Models for EUREKA Medical School Service
"""

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text,
    DateTime, ForeignKey, JSON, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid
import enum

Base = declarative_base()


class DifficultyLevel(str, enum.Enum):
    """USMLE difficulty levels."""
    STEP_1 = "Step 1"
    STEP_2_CK = "Step 2 CK"
    STEP_2_CS = "Step 2 CS"
    STEP_3 = "Step 3"


class CaseComplexity(str, enum.Enum):
    """Clinical case complexity levels."""
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class DiagnosisConfidence(str, enum.Enum):
    """Diagnostic confidence levels."""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    DEFINITIVE = "definitive"


# ==========================================
# USMLE Question Bank
# ==========================================

class USMLEQuestion(Base):
    """USMLE-style multiple choice questions."""
    __tablename__ = "usmle_questions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Question content
    question_text = Column(Text, nullable=False)
    vignette = Column(Text)  # Clinical vignette/stem
    
    # Answer options
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    option_e = Column(Text)
    correct_answer = Column(String(1), nullable=False)  # A, B, C, D, or E
    
    # Metadata
    difficulty_level = Column(SQLEnum(DifficultyLevel), nullable=False)
    subject = Column(String(100), nullable=False)  # e.g., "Cardiology", "Neurology"
    topic = Column(String(200), nullable=False)
    subtopic = Column(String(200))
    
    # Educational objectives
    learning_objectives = Column(ARRAY(Text))
    key_concepts = Column(ARRAY(Text))
    
    # Explanation
    explanation = Column(Text, nullable=False)
    references = Column(JSON)  # Array of citation objects
    
    # Statistics
    times_used = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    average_time_seconds = Column(Integer)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class USMLEAttempt(Base):
    """Student attempts at USMLE questions."""
    __tablename__ = "usmle_attempts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("usmle_questions.id"), nullable=False)
    
    # Response
    selected_answer = Column(String(1), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_spent_seconds = Column(Integer)
    
    # Context
    session_id = Column(UUID(as_uuid=True))
    attempt_number = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================================
# Clinical Cases
# ==========================================

class ClinicalCase(Base):
    """Interactive clinical case simulations."""
    __tablename__ = "clinical_cases"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Case identification
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    case_number = Column(String(50), unique=True)
    
    # Patient information (synthetic/de-identified)
    patient_age = Column(Integer)
    patient_sex = Column(String(20))
    chief_complaint = Column(Text, nullable=False)
    
    # Clinical presentation
    presenting_symptoms = Column(JSON)  # Array of symptoms
    vital_signs = Column(JSON)  # BP, HR, RR, Temp, etc.
    physical_exam_findings = Column(JSON)
    
    # History
    hpi = Column(Text)  # History of Present Illness
    past_medical_history = Column(JSON)
    medications = Column(JSON)
    allergies = Column(JSON)
    social_history = Column(JSON)
    family_history = Column(JSON)
    
    # Workup
    lab_results = Column(JSON)
    imaging_studies = Column(JSON)
    diagnostic_procedures = Column(JSON)
    
    # Diagnosis
    primary_diagnosis = Column(String(255), nullable=False)
    differential_diagnoses = Column(JSON)  # Array of alternative diagnoses
    icd_10_code = Column(String(20))
    
    # Treatment
    treatment_plan = Column(JSON)
    medications_prescribed = Column(JSON)
    follow_up_plan = Column(Text)
    
    # Learning objectives
    learning_objectives = Column(ARRAY(Text))
    key_teaching_points = Column(ARRAY(Text))
    complexity = Column(SQLEnum(CaseComplexity), nullable=False)
    
    # Metadata
    specialty = Column(String(100), nullable=False)
    setting = Column(String(100))  # ER, Clinic, ICU, etc.
    estimated_duration_minutes = Column(Integer, default=20)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    created_by = Column(UUID(as_uuid=True))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CaseAttempt(Base):
    """Student attempts at clinical cases."""
    __tablename__ = "case_attempts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    case_id = Column(UUID(as_uuid=True), ForeignKey("clinical_cases.id"), nullable=False)
    
    # Session info
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at = Column(DateTime)
    time_spent_minutes = Column(Integer)
    
    # Student's work
    differential_diagnosis = Column(JSON)  # Student's differential
    primary_diagnosis = Column(String(255))
    diagnostic_reasoning = Column(Text)
    treatment_plan = Column(JSON)
    
    # Grading
    diagnosis_accuracy = Column(Float)  # 0-100
    reasoning_quality = Column(Float)
    treatment_appropriateness = Column(Float)
    overall_score = Column(Float)
    
    # Feedback
    ai_feedback = Column(Text)
    instructor_feedback = Column(Text)
    
    # Status
    is_complete = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================================
# OSCE (Objective Structured Clinical Examination)
# ==========================================

class OSCEStation(Base):
    """OSCE examination stations."""
    __tablename__ = "osce_stations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Station info
    station_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # Scenario
    patient_scenario = Column(Text, nullable=False)
    standardized_patient_instructions = Column(Text)
    
    # Tasks
    tasks = Column(JSON)  # Array of tasks to complete
    duration_minutes = Column(Integer, default=10)
    
    # Grading rubric
    rubric = Column(JSON)  # Checklist items with point values
    total_points = Column(Integer, nullable=False)
    passing_score = Column(Integer, nullable=False)
    
    # Skills assessed
    clinical_skills = Column(ARRAY(Text))
    communication_skills = Column(ARRAY(Text))
    
    # Metadata
    specialty = Column(String(100))
    difficulty = Column(SQLEnum(CaseComplexity))
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OSCEAttempt(Base):
    """Student OSCE station attempts."""
    __tablename__ = "osce_attempts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    station_id = Column(UUID(as_uuid=True), ForeignKey("osce_stations.id"), nullable=False)
    
    # Session
    exam_id = Column(UUID(as_uuid=True))  # Groups stations in same exam
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Performance
    checklist_scores = Column(JSON)  # Score for each checklist item
    total_score = Column(Integer)
    percentage = Column(Float)
    passed = Column(Boolean)
    
    # Feedback
    evaluator_notes = Column(Text)
    student_reflection = Column(Text)
    
    # Recording (HIPAA-compliant storage)
    recording_url = Column(String(500))  # Encrypted storage URL
    recording_consent_given = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================================
# Diagnostic Reasoning
# ==========================================

class DiagnosticSession(Base):
    """AI-powered diagnostic reasoning practice."""
    __tablename__ = "diagnostic_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    # Session info
    started_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Patient presentation
    chief_complaint = Column(Text, nullable=False)
    patient_demographics = Column(JSON)
    initial_findings = Column(JSON)
    
    # Student's diagnostic process
    questions_asked = Column(JSON)  # Array of questions asked to patient
    tests_ordered = Column(JSON)  # Array of tests/labs ordered
    differential_diagnoses = Column(JSON)  # Student's differential
    
    # Final diagnosis
    final_diagnosis = Column(String(255))
    confidence_level = Column(SQLEnum(DiagnosisConfidence))
    reasoning = Column(Text)
    
    # Correct answer
    correct_diagnosis = Column(String(255))
    is_correct = Column(Boolean)
    
    # Performance metrics
    efficiency_score = Column(Float)  # Based on unnecessary tests
    accuracy_score = Column(Float)
    time_to_diagnosis_minutes = Column(Integer)
    
    # AI feedback
    ai_analysis = Column(Text)
    suggestions = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================================
# Pharmacology
# ==========================================

class MedicationDatabase(Base):
    """Pharmacology reference database."""
    __tablename__ = "medication_database"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Drug identification
    generic_name = Column(String(255), nullable=False, unique=True)
    brand_names = Column(ARRAY(Text))
    drug_class = Column(String(100), nullable=False)
    
    # Pharmacology
    mechanism_of_action = Column(Text, nullable=False)
    indications = Column(JSON)
    contraindications = Column(JSON)
    side_effects = Column(JSON)
    drug_interactions = Column(JSON)
    
    # Dosing
    adult_dosing = Column(Text)
    pediatric_dosing = Column(Text)
    renal_adjustments = Column(Text)
    hepatic_adjustments = Column(Text)
    
    # Monitoring
    monitoring_parameters = Column(JSON)
    black_box_warnings = Column(ARRAY(Text))
    
    # Educational
    clinical_pearls = Column(ARRAY(Text))
    board_exam_highlights = Column(ARRAY(Text))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================================
# Medical Student Progress
# ==========================================

class MedicalStudentProfile(Base):
    """Extended profile for medical students."""
    __tablename__ = "medical_student_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False, index=True)
    
    # Academic info
    medical_school = Column(String(255))
    graduation_year = Column(Integer)
    current_year = Column(Integer)  # MS1, MS2, MS3, MS4
    
    # USMLE scores
    step1_score = Column(Integer)
    step1_date = Column(DateTime)
    step2_ck_score = Column(Integer)
    step2_ck_date = Column(DateTime)
    step2_cs_result = Column(String(20))  # Pass/Fail
    step3_score = Column(Integer)
    step3_date = Column(DateTime)
    
    # Specialty interests
    specialty_interests = Column(ARRAY(Text))
    research_interests = Column(ARRAY(Text))
    
    # Performance metrics
    usmle_questions_completed = Column(Integer, default=0)
    usmle_accuracy_rate = Column(Float, default=0.0)
    clinical_cases_completed = Column(Integer, default=0)
    osce_stations_completed = Column(Integer, default=0)
    
    # Strengths and weaknesses
    strong_subjects = Column(JSON)
    weak_subjects = Column(JSON)
    
    # Goals
    target_step1_score = Column(Integer)
    target_specialty = Column(String(100))
    study_hours_per_week = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==========================================
# HIPAA Audit Log
# ==========================================

class HIPAAAuditLog(Base):
    """HIPAA-compliant audit trail."""
    __tablename__ = "hipaa_audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Who
    user_id = Column(UUID(as_uuid=True), index=True)
    user_role = Column(String(50))
    
    # What
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(UUID(as_uuid=True))
    
    # When
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    # Where
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    
    # Details
    details = Column(JSON)
    phi_accessed = Column(Boolean, default=False)
    
    # Result
    success = Column(Boolean, nullable=False)
    error_message = Column(Text)
    
    # Retention (6 years for HIPAA)
    retention_expires_at = Column(DateTime)  # Auto-calculated as timestamp + 6 years


# Create indexes for performance
from sqlalchemy import Index

Index('idx_usmle_difficulty_subject', USMLEQuestion.difficulty_level, USMLEQuestion.subject)
Index('idx_clinical_case_specialty', ClinicalCase.specialty, ClinicalCase.complexity)
Index('idx_case_attempt_user_case', CaseAttempt.user_id, CaseAttempt.case_id)
Index('idx_audit_timestamp', HIPAAAuditLog.timestamp)
Index('idx_audit_user', HIPAAAuditLog.user_id, HIPAAAuditLog.timestamp)
