-- =====================================================
-- EduFlow Platform - Assessment Engine Database Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ASSESSMENT TEMPLATES & RUBRICS
-- =====================================================

CREATE TABLE assessment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50) CHECK (assessment_type IN ('quiz', 'exam', 'essay', 'coding', 'project', 'peer_review', 'practical')),
    tier VARCHAR(50) NOT NULL,
    subject VARCHAR(100),
    difficulty_level VARCHAR(50),
    estimated_duration_minutes INTEGER,
    passing_percentage DECIMAL(5,2) DEFAULT 70.00,
    template_config JSONB,
    created_by UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grading_rubrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rubric_type VARCHAR(50) CHECK (rubric_type IN ('holistic', 'analytic', 'single_point', 'checklist')),
    criteria JSONB NOT NULL, -- Array of criteria with weights and descriptors
    max_score DECIMAL(5,2) NOT NULL,
    tier VARCHAR(50),
    subject VARCHAR(100),
    created_by UUID,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ASSESSMENTS
-- =====================================================

CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    assessment_type VARCHAR(50) NOT NULL,
    course_id UUID,
    assignment_id UUID,
    template_id UUID REFERENCES assessment_templates(id),
    rubric_id UUID REFERENCES grading_rubrics(id),
    total_points DECIMAL(5,2) NOT NULL,
    passing_score DECIMAL(5,2),
    time_limit_minutes INTEGER,
    max_attempts INTEGER DEFAULT 1,
    randomize_questions BOOLEAN DEFAULT false,
    show_correct_answers BOOLEAN DEFAULT true,
    show_answers_after VARCHAR(50) DEFAULT 'submission' CHECK (show_answers_after IN ('immediate', 'submission', 'grading', 'never')),
    allow_backtrack BOOLEAN DEFAULT true,
    require_webcam BOOLEAN DEFAULT false,
    require_lockdown_browser BOOLEAN DEFAULT false,
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    late_submission_allowed BOOLEAN DEFAULT false,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- QUESTIONS & QUESTION BANKS
-- =====================================================

CREATE TABLE question_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tier VARCHAR(50),
    subject VARCHAR(100),
    tags TEXT[],
    created_by UUID,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_id UUID REFERENCES question_banks(id),
    assessment_id UUID REFERENCES assessments(id),
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'multiple_answer', 'true_false', 'short_answer', 'essay', 'code', 'file_upload', 'matching', 'ordering')),
    question_text TEXT NOT NULL,
    question_html TEXT,
    points DECIMAL(5,2) NOT NULL,
    difficulty VARCHAR(50) CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    order_index INTEGER,
    correct_answer TEXT, -- For auto-gradable questions
    answer_options JSONB, -- For MCQ, matching, etc.
    code_template TEXT, -- For coding questions
    test_cases JSONB, -- For coding questions
    explanation TEXT,
    hints TEXT[],
    media_urls TEXT[],
    tags TEXT[],
    bloom_taxonomy_level VARCHAR(50),
    estimated_time_minutes INTEGER,
    metadata JSONB DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SUBMISSIONS & ATTEMPTS
-- =====================================================

CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'grading', 'graded', 'abandoned')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    remaining_time_seconds INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    proctoring_data JSONB, -- Webcam, screen recording metadata
    metadata JSONB DEFAULT '{}',
    UNIQUE(assessment_id, user_id, attempt_number)
);

CREATE TABLE question_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    response_text TEXT,
    response_data JSONB, -- For complex responses (multiple selections, code, etc.)
    file_urls TEXT[],
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2),
    time_spent_seconds INTEGER,
    confidence_level VARCHAR(50),
    flagged_for_review BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(attempt_id, question_id)
);

-- =====================================================
-- GRADING & RESULTS
-- =====================================================

CREATE TABLE grading_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    total_points_possible DECIMAL(5,2) NOT NULL,
    points_earned DECIMAL(5,2) NOT NULL,
    percentage_score DECIMAL(5,2) NOT NULL,
    letter_grade VARCHAR(5),
    pass_fail_status VARCHAR(10) CHECK (pass_fail_status IN ('pass', 'fail', 'pending')),
    rubric_scores JSONB, -- Scores for each rubric criterion
    auto_graded_score DECIMAL(5,2),
    manual_graded_score DECIMAL(5,2),
    graded_by UUID,
    graded_at TIMESTAMP,
    overall_feedback TEXT,
    feedback_by_question JSONB,
    time_to_grade_seconds INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(attempt_id)
);

CREATE TABLE rubric_criterion_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grading_result_id UUID REFERENCES grading_results(id) ON DELETE CASCADE,
    criterion_name VARCHAR(255) NOT NULL,
    criterion_description TEXT,
    max_points DECIMAL(5,2) NOT NULL,
    points_earned DECIMAL(5,2) NOT NULL,
    level_achieved VARCHAR(100),
    feedback TEXT,
    graded_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI-POWERED GRADING
-- =====================================================

CREATE TABLE ai_grading_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) CHECK (model_type IN ('essay', 'code', 'short_answer', 'math')),
    model_provider VARCHAR(50) CHECK (model_provider IN ('openai', 'anthropic', 'custom')),
    model_version VARCHAR(50),
    prompt_template TEXT,
    config JSONB,
    accuracy_metrics JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_grading_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID REFERENCES question_responses(id) ON DELETE CASCADE,
    model_id UUID REFERENCES ai_grading_models(id),
    question_text TEXT NOT NULL,
    student_response TEXT NOT NULL,
    rubric_data JSONB,
    ai_score DECIMAL(5,2),
    ai_feedback TEXT,
    confidence_score DECIMAL(5,2),
    processing_time_ms INTEGER,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,4),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reviewed')),
    error_message TEXT,
    human_review_required BOOLEAN DEFAULT false,
    human_override_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- =====================================================
-- PLAGIARISM DETECTION
-- =====================================================

CREATE TABLE plagiarism_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID REFERENCES question_responses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    similarity_score DECIMAL(5,2),
    sources_found JSONB, -- Array of matched sources with similarity percentages
    flagged BOOLEAN DEFAULT false,
    check_provider VARCHAR(50),
    check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- PEER REVIEW
-- =====================================================

CREATE TABLE peer_review_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL,
    reviewee_id UUID NOT NULL,
    attempt_id UUID REFERENCES assessment_attempts(id),
    status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'skipped')),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(assessment_id, reviewer_id, reviewee_id)
);

CREATE TABLE peer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES peer_review_assignments(id) ON DELETE CASCADE,
    rubric_scores JSONB,
    overall_score DECIMAL(5,2),
    feedback TEXT,
    strengths TEXT,
    improvements TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

CREATE TABLE question_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    average_time_seconds INTEGER,
    difficulty_rating DECIMAL(3,2),
    discrimination_index DECIMAL(3,2),
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(question_id)
);

CREATE TABLE assessment_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    total_attempts INTEGER DEFAULT 0,
    completed_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2),
    median_score DECIMAL(5,2),
    standard_deviation DECIMAL(5,2),
    pass_rate DECIMAL(5,2),
    average_time_minutes INTEGER,
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_assessments_course_id ON assessments(course_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX idx_questions_bank_id ON questions(bank_id);
CREATE INDEX idx_attempts_assessment_user ON assessment_attempts(assessment_id, user_id);
CREATE INDEX idx_attempts_status ON assessment_attempts(status);
CREATE INDEX idx_responses_attempt_id ON question_responses(attempt_id);
CREATE INDEX idx_grading_results_attempt_id ON grading_results(attempt_id);
CREATE INDEX idx_ai_grading_status ON ai_grading_requests(status);
CREATE INDEX idx_plagiarism_flagged ON plagiarism_checks(flagged);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
