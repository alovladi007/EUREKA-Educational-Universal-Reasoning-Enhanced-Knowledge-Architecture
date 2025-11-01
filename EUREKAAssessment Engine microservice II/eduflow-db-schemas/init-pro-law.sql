-- =====================================================
-- EduFlow Platform - Law School Professional Tier
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CASE LAW DATABASE
-- =====================================================

CREATE TABLE legal_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_name VARCHAR(255) NOT NULL,
    citation VARCHAR(255) NOT NULL,
    court VARCHAR(255),
    jurisdiction VARCHAR(100),
    decision_date DATE,
    
    -- Case Details
    case_summary TEXT,
    facts TEXT,
    procedural_history TEXT,
    issue TEXT,
    holding TEXT,
    reasoning TEXT,
    rule_of_law TEXT,
    concurring_opinion TEXT,
    dissenting_opinion TEXT,
    
    -- Classification
    practice_area VARCHAR(100) CHECK (practice_area IN ('constitutional', 'criminal', 'civil', 'contracts', 'torts', 'property', 'corporate', 'tax', 'family', 'immigration', 'intellectual_property', 'environmental')),
    case_type VARCHAR(50) CHECK (case_type IN ('supreme_court', 'appellate', 'trial', 'landmark')),
    importance_level VARCHAR(50) CHECK (importance_level IN ('landmark', 'important', 'notable', 'standard')),
    
    -- Educational
    learning_objectives TEXT[],
    key_concepts TEXT[],
    related_statutes TEXT[],
    shepards_citations TEXT[],
    
    -- Media
    audio_url TEXT,
    transcript_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE case_briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES legal_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    
    facts_brief TEXT,
    issue_brief TEXT,
    holding_brief TEXT,
    reasoning_brief TEXT,
    disposition TEXT,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(case_id, user_id)
);

-- =====================================================
-- STATUTES & REGULATIONS
-- =====================================================

CREATE TABLE statutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    citation VARCHAR(255) UNIQUE NOT NULL,
    jurisdiction VARCHAR(100),
    
    full_text TEXT NOT NULL,
    summary TEXT,
    effective_date DATE,
    repeal_date DATE,
    
    practice_area VARCHAR(100),
    related_cases UUID[],
    related_statutes UUID[],
    
    annotations TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LEGAL RESEARCH TOOLS
-- =====================================================

CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    practice_area VARCHAR(100),
    
    research_question TEXT,
    jurisdiction VARCHAR(100),
    
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE research_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
    
    source_type VARCHAR(50) CHECK (source_type IN ('case', 'statute', 'regulation', 'article', 'treatise', 'website')),
    source_id UUID,
    citation VARCHAR(500),
    
    relevance_rating INTEGER CHECK (relevance_rating BETWEEN 1 AND 5),
    notes TEXT,
    quotes TEXT[],
    
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LEGAL WRITING
-- =====================================================

CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    document_type VARCHAR(100) CHECK (document_type IN ('memorandum', 'brief', 'motion', 'contract', 'complaint', 'answer', 'discovery', 'opinion_letter')),
    title VARCHAR(255) NOT NULL,
    
    content TEXT,
    citations JSONB,
    
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'final', 'submitted')),
    
    feedback TEXT,
    grade DECIMAL(5,2),
    graded_by UUID,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE legal_writing_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
    
    feedback_type VARCHAR(50) CHECK (feedback_type IN ('grammar', 'citation', 'analysis', 'organization', 'persuasiveness', 'clarity')),
    line_number INTEGER,
    comment TEXT NOT NULL,
    severity VARCHAR(50) CHECK (severity IN ('critical', 'major', 'minor', 'suggestion')),
    
    provided_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MOOT COURT & ORAL ARGUMENTS
-- =====================================================

CREATE TABLE moot_court_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_name VARCHAR(255) NOT NULL,
    court_level VARCHAR(100),
    practice_area VARCHAR(100),
    
    case_background TEXT,
    lower_court_decision TEXT,
    issues_presented TEXT[],
    record_materials TEXT[],
    
    briefing_deadline DATE,
    argument_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oral_argument_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    moot_court_case_id UUID REFERENCES moot_court_cases(id) ON DELETE CASCADE,
    
    video_url TEXT,
    transcript TEXT,
    
    -- Evaluation Criteria
    legal_knowledge_score DECIMAL(5,2),
    argument_organization_score DECIMAL(5,2),
    responsiveness_score DECIMAL(5,2),
    persuasiveness_score DECIMAL(5,2),
    demeanor_score DECIMAL(5,2),
    
    overall_score DECIMAL(5,2),
    feedback TEXT,
    evaluated_by UUID,
    
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BAR EXAM PREPARATION
-- =====================================================

CREATE TABLE bar_exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_type VARCHAR(50) CHECK (question_type IN ('mbe', 'mee', 'mpt')),
    subject VARCHAR(100),
    
    question_text TEXT NOT NULL,
    fact_pattern TEXT,
    call_of_question TEXT,
    
    -- For MBE (Multiple Choice)
    answer_options JSONB,
    correct_answer CHAR(1),
    
    -- For MEE/MPT (Essays)
    model_answer TEXT,
    grading_rubric JSONB,
    
    explanation TEXT,
    difficulty VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_bar_exam_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    question_id UUID REFERENCES bar_exam_questions(id) ON DELETE CASCADE,
    
    user_answer TEXT,
    is_correct BOOLEAN,
    score DECIMAL(5,2),
    time_taken_seconds INTEGER,
    
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROFESSIONAL DEVELOPMENT
-- =====================================================

CREATE TABLE externships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    organization VARCHAR(255) NOT NULL,
    position_title VARCHAR(255),
    practice_area VARCHAR(100),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    supervisor_name VARCHAR(255),
    supervisor_email VARCHAR(255),
    
    responsibilities TEXT,
    skills_developed TEXT[],
    
    hours_completed INTEGER DEFAULT 0,
    credit_hours DECIMAL(4,1),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pro_bono_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    organization VARCHAR(255),
    case_description TEXT,
    practice_area VARCHAR(100),
    
    date DATE NOT NULL,
    hours DECIMAL(4,2) NOT NULL,
    
    supervisor_name VARCHAR(255),
    verified BOOLEAN DEFAULT false,
    
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_legal_cases_practice_area ON legal_cases(practice_area);
CREATE INDEX idx_legal_cases_court ON legal_cases(court);
CREATE INDEX idx_legal_cases_date ON legal_cases(decision_date);
CREATE INDEX idx_case_briefs_user_id ON case_briefs(user_id);
CREATE INDEX idx_statutes_jurisdiction ON statutes(jurisdiction);
CREATE INDEX idx_research_projects_user_id ON research_projects(user_id);
CREATE INDEX idx_legal_documents_user_id ON legal_documents(user_id);
CREATE INDEX idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX idx_bar_exam_questions_subject ON bar_exam_questions(subject);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_legal_cases_updated_at BEFORE UPDATE ON legal_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON research_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
