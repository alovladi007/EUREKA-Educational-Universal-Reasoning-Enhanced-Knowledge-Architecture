-- =====================================================
-- Medical School Service Tables
-- =====================================================
-- Creates all tables for EUREKA Medical School Service
-- =====================================================

-- Drop existing tables (if recreating)
-- DROP TABLE IF EXISTS usmle_attempts CASCADE;
-- DROP TABLE IF EXISTS case_attempts CASCADE;
-- DROP TABLE IF EXISTS osce_attempts CASCADE;
-- DROP TABLE IF EXISTS usmle_questions CASCADE;
-- DROP TABLE IF EXISTS clinical_cases CASCADE;
-- DROP TABLE IF EXISTS osce_stations CASCADE;
-- DROP TABLE IF EXISTS diagnostic_sessions CASCADE;
-- DROP TABLE IF EXISTS medical_student_profiles CASCADE;
-- DROP TABLE IF EXISTS medication_database CASCADE;
-- DROP TABLE IF EXISTS hipaa_audit_logs CASCADE;

-- USMLE Questions
CREATE TABLE IF NOT EXISTS usmle_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    vignette TEXT,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    option_e TEXT,
    correct_answer VARCHAR(1) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(200) NOT NULL,
    subtopic VARCHAR(200),
    learning_objectives TEXT[],
    key_concepts TEXT[],
    explanation TEXT NOT NULL,
    "references" JSONB,  -- Quoted because it's a reserved word
    times_used INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    average_time_seconds INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usmle_org ON usmle_questions(org_id);
CREATE INDEX IF NOT EXISTS idx_usmle_difficulty_subject ON usmle_questions(difficulty_level, subject);
CREATE INDEX IF NOT EXISTS idx_usmle_active ON usmle_questions(is_active) WHERE is_active = TRUE;

-- USMLE Attempts
CREATE TABLE IF NOT EXISTS usmle_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    question_id UUID NOT NULL REFERENCES usmle_questions(id) ON DELETE CASCADE,
    selected_answer VARCHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER,
    session_id UUID,
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usmle_attempts_user ON usmle_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_usmle_attempts_question ON usmle_attempts(question_id);

-- Clinical Cases
CREATE TABLE IF NOT EXISTS clinical_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    case_number VARCHAR(50) UNIQUE,
    patient_age INTEGER,
    patient_sex VARCHAR(20),
    chief_complaint TEXT NOT NULL,
    presenting_symptoms JSONB,
    vital_signs JSONB,
    physical_exam_findings JSONB,
    hpi TEXT,
    past_medical_history JSONB,
    medications JSONB,
    allergies JSONB,
    social_history JSONB,
    family_history JSONB,
    lab_results JSONB,
    imaging_studies JSONB,
    diagnostic_procedures JSONB,
    primary_diagnosis VARCHAR(255) NOT NULL,
    differential_diagnoses JSONB,
    icd_10_code VARCHAR(20),
    treatment_plan JSONB,
    medications_prescribed JSONB,
    follow_up_plan TEXT,
    learning_objectives TEXT[],
    key_teaching_points TEXT[],
    complexity VARCHAR(20) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    setting VARCHAR(100),
    estimated_duration_minutes INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clinical_cases_org ON clinical_cases(org_id);
CREATE INDEX IF NOT EXISTS idx_clinical_case_specialty ON clinical_cases(specialty, complexity);

-- Case Attempts
CREATE TABLE IF NOT EXISTS case_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    case_id UUID NOT NULL REFERENCES clinical_cases(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_minutes INTEGER,
    differential_diagnosis JSONB,
    primary_diagnosis VARCHAR(255),
    diagnostic_reasoning TEXT,
    treatment_plan JSONB,
    diagnosis_accuracy FLOAT,
    reasoning_quality FLOAT,
    treatment_appropriateness FLOAT,
    overall_score FLOAT,
    ai_feedback TEXT,
    instructor_feedback TEXT,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_case_attempts_user ON case_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_case_attempts_case ON case_attempts(case_id);
CREATE INDEX IF NOT EXISTS idx_case_attempt_user_case ON case_attempts(user_id, case_id);

-- OSCE Stations
CREATE TABLE IF NOT EXISTS osce_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    station_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    patient_scenario TEXT NOT NULL,
    standardized_patient_instructions TEXT,
    tasks JSONB,
    duration_minutes INTEGER DEFAULT 10,
    rubric JSONB,
    total_points INTEGER NOT NULL,
    passing_score INTEGER NOT NULL,
    clinical_skills TEXT[],
    communication_skills TEXT[],
    specialty VARCHAR(100),
    difficulty VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_osce_stations_org ON osce_stations(org_id);

-- OSCE Attempts
CREATE TABLE IF NOT EXISTS osce_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    station_id UUID NOT NULL REFERENCES osce_stations(id) ON DELETE CASCADE,
    exam_id UUID,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    checklist_scores JSONB,
    total_score INTEGER,
    percentage FLOAT,
    passed BOOLEAN,
    evaluator_notes TEXT,
    student_reflection TEXT,
    recording_url VARCHAR(500),
    recording_consent_given BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_osce_attempts_user ON osce_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_osce_attempts_station ON osce_attempts(station_id);

-- Diagnostic Sessions
CREATE TABLE IF NOT EXISTS diagnostic_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    chief_complaint TEXT NOT NULL,
    patient_demographics JSONB,
    initial_findings JSONB,
    questions_asked JSONB,
    tests_ordered JSONB,
    differential_diagnoses JSONB,
    final_diagnosis VARCHAR(255),
    confidence_level VARCHAR(20),
    reasoning TEXT,
    correct_diagnosis VARCHAR(255),
    is_correct BOOLEAN,
    efficiency_score FLOAT,
    accuracy_score FLOAT,
    time_to_diagnosis_minutes INTEGER,
    ai_analysis TEXT,
    suggestions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_user ON diagnostic_sessions(user_id);

-- Medical Student Profiles
CREATE TABLE IF NOT EXISTS medical_student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    medical_school VARCHAR(255),
    graduation_year INTEGER,
    current_year INTEGER,
    step1_score INTEGER,
    step1_date TIMESTAMP,
    step2_ck_score INTEGER,
    step2_ck_date TIMESTAMP,
    step2_cs_result VARCHAR(20),
    step3_score INTEGER,
    step3_date TIMESTAMP,
    specialty_interests TEXT[],
    research_interests TEXT[],
    usmle_questions_completed INTEGER DEFAULT 0,
    usmle_accuracy_rate FLOAT DEFAULT 0.0,
    clinical_cases_completed INTEGER DEFAULT 0,
    osce_stations_completed INTEGER DEFAULT 0,
    strong_subjects JSONB,
    weak_subjects JSONB,
    target_step1_score INTEGER,
    target_specialty VARCHAR(100),
    study_hours_per_week INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medical_student_profiles_user ON medical_student_profiles(user_id);

-- Medication Database
CREATE TABLE IF NOT EXISTS medication_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generic_name VARCHAR(255) NOT NULL UNIQUE,
    brand_names TEXT[],
    drug_class VARCHAR(100) NOT NULL,
    mechanism_of_action TEXT NOT NULL,
    indications JSONB,
    contraindications JSONB,
    side_effects JSONB,
    drug_interactions JSONB,
    adult_dosing TEXT,
    pediatric_dosing TEXT,
    renal_adjustments TEXT,
    hepatic_adjustments TEXT,
    monitoring_parameters JSONB,
    black_box_warnings TEXT[],
    clinical_pearls TEXT[],
    board_exam_highlights TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medication_generic_name ON medication_database(generic_name);
CREATE INDEX IF NOT EXISTS idx_medication_drug_class ON medication_database(drug_class);

-- HIPAA Audit Logs
CREATE TABLE IF NOT EXISTS hipaa_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    details JSONB,
    phi_accessed BOOLEAN DEFAULT FALSE,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    retention_expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON hipaa_audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_user ON hipaa_audit_logs(user_id, timestamp);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Medical School tables created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created: 10';
    RAISE NOTICE '  - usmle_questions';
    RAISE NOTICE '  - usmle_attempts';
    RAISE NOTICE '  - clinical_cases';
    RAISE NOTICE '  - case_attempts';
    RAISE NOTICE '  - osce_stations';
    RAISE NOTICE '  - osce_attempts';
    RAISE NOTICE '  - diagnostic_sessions';
    RAISE NOTICE '  - medical_student_profiles';
    RAISE NOTICE '  - medication_database';
    RAISE NOTICE '  - hipaa_audit_logs';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for Medical School service!';
END $$;
