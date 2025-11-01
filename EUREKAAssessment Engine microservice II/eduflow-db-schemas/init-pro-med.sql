-- =====================================================
-- EduFlow Platform - Medical School Professional Tier
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLINICAL CASE LIBRARY
-- =====================================================

CREATE TABLE clinical_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_title VARCHAR(255) NOT NULL,
    case_description TEXT,
    
    -- Patient Information (anonymized)
    patient_age INTEGER,
    patient_gender VARCHAR(20),
    patient_history TEXT,
    chief_complaint TEXT,
    
    -- Clinical Details
    presenting_symptoms JSONB,
    physical_exam_findings JSONB,
    lab_results JSONB,
    imaging_results JSONB,
    
    -- Diagnosis
    diagnosis TEXT,
    differential_diagnoses TEXT[],
    icd_codes TEXT[],
    
    -- Treatment
    treatment_plan TEXT,
    medications JSONB,
    procedures TEXT[],
    outcome TEXT,
    
    -- Educational Metadata
    specialty VARCHAR(100),
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('medical_student', 'resident', 'fellow', 'attending')),
    learning_objectives TEXT[],
    key_concepts TEXT[],
    
    -- Attribution
    created_by UUID,
    reviewed_by UUID,
    review_status VARCHAR(50) CHECK (review_status IN ('draft', 'peer_review', 'approved', 'archived')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE case_presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES clinical_cases(id) ON DELETE CASCADE,
    presentation_format VARCHAR(50) CHECK (presentation_format IN ('progressive', 'complete', 'osce', 'simulation')),
    presentation_data JSONB NOT NULL,
    time_limit_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_case_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    case_id UUID REFERENCES clinical_cases(id) ON DELETE CASCADE,
    
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    current_step INTEGER DEFAULT 1,
    decisions_made JSONB,
    diagnostic_accuracy DECIMAL(5,2),
    treatment_appropriateness DECIMAL(5,2),
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER,
    
    UNIQUE(user_id, case_id)
);

-- =====================================================
-- USMLE QUESTION BANK
-- =====================================================

CREATE TABLE usmle_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('single_best_answer', 'multiple_answer', 'ordered_list', 'extended_matching')),
    
    -- Exam Details
    exam_step VARCHAR(10) CHECK (exam_step IN ('step1', 'step2ck', 'step2cs', 'step3')),
    organ_system VARCHAR(100),
    discipline VARCHAR(100),
    task_area VARCHAR(100),
    
    -- Question Content
    stem TEXT NOT NULL,
    vignette TEXT,
    answer_options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    
    -- Educational Features
    key_concepts TEXT[],
    common_mistakes TEXT[],
    pearl TEXT,
    
    -- Difficulty & Usage
    difficulty_rating DECIMAL(3,2),
    discrimination_index DECIMAL(3,2),
    times_attempted INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    average_time_seconds INTEGER,
    
    -- Media
    images TEXT[],
    audio_urls TEXT[],
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usmle_question_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES usmle_questions(id) ON DELETE CASCADE,
    tag_type VARCHAR(50) CHECK (tag_type IN ('topic', 'firstaid', 'goljan', 'pathoma', 'sketchy')),
    tag_value VARCHAR(255) NOT NULL
);

CREATE TABLE user_usmle_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    question_id UUID REFERENCES usmle_questions(id) ON DELETE CASCADE,
    
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    confidence_level VARCHAR(50),
    flagged BOOLEAN DEFAULT false,
    notes TEXT,
    
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id, attempted_at)
);

-- =====================================================
-- ANATOMY 3D MODELS
-- =====================================================

CREATE TABLE anatomy_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) CHECK (model_type IN ('organ', 'system', 'region', 'cellular', 'pathology')),
    
    anatomical_system VARCHAR(100) CHECK (anatomical_system IN ('skeletal', 'muscular', 'cardiovascular', 'respiratory', 'digestive', 'urinary', 'reproductive', 'nervous', 'endocrine', 'lymphatic', 'integumentary')),
    body_region VARCHAR(100),
    
    -- Model Files
    model_url TEXT NOT NULL, -- 3D model file (obj, fbx, gltf)
    texture_urls TEXT[],
    thumbnail_url TEXT,
    
    -- Annotations
    labels JSONB, -- Anatomical labels
    landmarks JSONB, -- Key anatomical landmarks
    
    -- Educational Content
    description TEXT,
    clinical_relevance TEXT,
    related_pathologies TEXT[],
    
    -- Viewing Options
    default_view VARCHAR(50) CHECK (default_view IN ('anterior', 'posterior', 'lateral', 'superior', 'inferior', 'sagittal', 'coronal')),
    interactive_features JSONB,
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_anatomy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    model_id UUID REFERENCES anatomy_models(id) ON DELETE CASCADE,
    
    session_duration_seconds INTEGER,
    interactions_count INTEGER DEFAULT 0,
    views_from_angles JSONB,
    labels_identified INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2),
    
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PATHOLOGY SLIDES
-- =====================================================

CREATE TABLE pathology_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slide_name VARCHAR(255) NOT NULL,
    
    -- Slide Information
    stain_type VARCHAR(100) CHECK (stain_type IN ('h&e', 'pas', 'trichrome', 'congo_red', 'gram', 'giemsa', 'immunohistochemistry')),
    magnification VARCHAR(50),
    tissue_type VARCHAR(100),
    organ_system VARCHAR(100),
    
    -- Pathology Details
    diagnosis TEXT NOT NULL,
    gross_findings TEXT,
    microscopic_findings TEXT,
    key_features TEXT[],
    
    -- Image Files
    whole_slide_image_url TEXT NOT NULL, -- High-resolution WSI
    thumbnail_url TEXT,
    annotated_regions JSONB,
    
    -- Educational Content
    differential_diagnosis TEXT[],
    clinical_correlation TEXT,
    teaching_points TEXT[],
    
    difficulty_level VARCHAR(50),
    specialty VARCHAR(100),
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MEDICAL IMAGING
-- =====================================================

CREATE TABLE medical_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES clinical_cases(id),
    
    modality VARCHAR(50) CHECK (modality IN ('xray', 'ct', 'mri', 'ultrasound', 'pet', 'nuclear_medicine', 'fluoroscopy')),
    body_region VARCHAR(100),
    view VARCHAR(50),
    
    -- Image Files
    dicom_url TEXT,
    image_url TEXT NOT NULL,
    series_urls TEXT[], -- For multi-slice studies
    
    -- Clinical Information
    indication TEXT,
    technique TEXT,
    findings TEXT,
    impression TEXT,
    recommendations TEXT,
    
    -- Annotations
    abnormalities JSONB,
    measurements JSONB,
    comparison_notes TEXT,
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CLINICAL SKILLS & PROCEDURES
-- =====================================================

CREATE TABLE clinical_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_name VARCHAR(255) NOT NULL,
    procedure_type VARCHAR(100),
    specialty VARCHAR(100),
    
    -- Procedure Details
    indications TEXT[],
    contraindications TEXT[],
    complications TEXT[],
    equipment_needed TEXT[],
    
    -- Steps
    preparation_steps JSONB,
    procedure_steps JSONB,
    post_procedure_care JSONB,
    
    -- Educational Content
    video_url TEXT,
    images TEXT[],
    tips_and_tricks TEXT[],
    common_errors TEXT[],
    
    difficulty_level VARCHAR(50),
    required_supervision_level VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_procedure_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    procedure_id UUID REFERENCES clinical_procedures(id) ON DELETE CASCADE,
    
    performed_date TIMESTAMP NOT NULL,
    setting VARCHAR(100), -- simulation, clinical, observed
    supervision_level VARCHAR(50),
    competency_rating INTEGER CHECK (competency_rating BETWEEN 1 AND 5),
    
    notes TEXT,
    complications_observed TEXT,
    feedback TEXT,
    supervisor_id UUID,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PHARMACOLOGY
-- =====================================================

CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generic_name VARCHAR(255) NOT NULL,
    brand_names TEXT[],
    drug_class VARCHAR(100),
    
    -- Mechanism
    mechanism_of_action TEXT,
    pharmacokinetics JSONB,
    pharmacodynamics JSONB,
    
    -- Clinical Use
    indications TEXT[],
    contraindications TEXT[],
    dosing TEXT,
    monitoring_parameters TEXT[],
    
    -- Safety
    adverse_effects JSONB,
    drug_interactions TEXT[],
    pregnancy_category VARCHAR(10),
    black_box_warnings TEXT[],
    
    -- Educational
    clinical_pearls TEXT[],
    memory_aids TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CLINICAL ROTATIONS & COMPETENCIES
-- =====================================================

CREATE TABLE clinical_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    rotation_name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100),
    site VARCHAR(255),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    attending_physician UUID,
    resident_supervisor UUID,
    
    learning_objectives TEXT[],
    status VARCHAR(50) CHECK (status IN ('upcoming', 'in_progress', 'completed')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE competency_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rotation_id UUID REFERENCES clinical_rotations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    
    assessment_type VARCHAR(50) CHECK (assessment_type IN ('mid_rotation', 'final', 'procedure', 'mini_cex', 'osce')),
    assessor_id UUID NOT NULL,
    
    -- ACGME Core Competencies
    patient_care_rating INTEGER CHECK (patient_care_rating BETWEEN 1 AND 5),
    medical_knowledge_rating INTEGER CHECK (medical_knowledge_rating BETWEEN 1 AND 5),
    practice_based_learning_rating INTEGER CHECK (practice_based_learning_rating BETWEEN 1 AND 5),
    interpersonal_skills_rating INTEGER CHECK (interpersonal_skills_rating BETWEEN 1 AND 5),
    professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
    systems_based_practice_rating INTEGER CHECK (systems_based_practice_rating BETWEEN 1 AND 5),
    
    strengths TEXT,
    areas_for_improvement TEXT,
    comments TEXT,
    
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_clinical_cases_specialty ON clinical_cases(specialty);
CREATE INDEX idx_clinical_cases_difficulty ON clinical_cases(difficulty_level);
CREATE INDEX idx_usmle_questions_step ON usmle_questions(exam_step);
CREATE INDEX idx_usmle_questions_system ON usmle_questions(organ_system);
CREATE INDEX idx_user_case_progress_user_id ON user_case_progress(user_id);
CREATE INDEX idx_user_usmle_performance_user_id ON user_usmle_performance(user_id);
CREATE INDEX idx_anatomy_models_system ON anatomy_models(anatomical_system);
CREATE INDEX idx_pathology_slides_organ ON pathology_slides(organ_system);
CREATE INDEX idx_medications_class ON medications(drug_class);
CREATE INDEX idx_clinical_rotations_user_id ON clinical_rotations(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_clinical_cases_updated_at BEFORE UPDATE ON clinical_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usmle_questions_updated_at BEFORE UPDATE ON usmle_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
