-- =====================================================
-- EduFlow Platform - MBA Professional Tier
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- BUSINESS CASE LIBRARY
-- =====================================================

CREATE TABLE business_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    industry VARCHAR(100),
    
    -- Case Details
    executive_summary TEXT,
    company_background TEXT,
    problem_statement TEXT,
    market_analysis TEXT,
    financial_data JSONB,
    exhibits TEXT[],
    
    -- Classification
    case_type VARCHAR(50) CHECK (case_type IN ('strategy', 'marketing', 'finance', 'operations', 'entrepreneurship', 'leadership', 'ethics')),
    difficulty_level VARCHAR(50),
    teaching_objective TEXT,
    
    -- Questions
    discussion_questions TEXT[],
    assignment_questions TEXT[],
    
    teaching_note TEXT,
    solution_framework TEXT,
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_case_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    case_id UUID REFERENCES business_cases(id) ON DELETE CASCADE,
    
    analysis_text TEXT,
    recommendations TEXT,
    supporting_data JSONB,
    
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded')),
    score DECIMAL(5,2),
    feedback TEXT,
    graded_by UUID,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, case_id)
);

-- =====================================================
-- FINANCIAL MODELING
-- =====================================================

CREATE TABLE financial_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(50) CHECK (model_type IN ('dcf', 'lbo', 'merger_model', '3statement', 'budgeting', 'forecasting', 'valuation')),
    
    description TEXT,
    company_name VARCHAR(255),
    industry VARCHAR(100),
    
    -- Model Files
    excel_file_url TEXT NOT NULL,
    pdf_summary_url TEXT,
    
    -- Key Assumptions
    assumptions JSONB,
    revenue_drivers JSONB,
    cost_structure JSONB,
    
    -- Results
    key_metrics JSONB,
    valuation_output JSONB,
    sensitivity_analysis JSONB,
    
    difficulty_level VARCHAR(50),
    learning_objectives TEXT[],
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_financial_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    model_id UUID REFERENCES financial_models(id) ON DELETE CASCADE,
    
    user_model_file_url TEXT,
    assumptions_used JSONB,
    results JSONB,
    
    accuracy_score DECIMAL(5,2),
    methodology_score DECIMAL(5,2),
    presentation_score DECIMAL(5,2),
    
    feedback TEXT,
    graded_by UUID,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MARKET RESEARCH & DATA ANALYTICS
-- =====================================================

CREATE TABLE market_research_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    data_type VARCHAR(50) CHECK (data_type IN ('consumer', 'competitor', 'market_size', 'trends', 'pricing')),
    
    description TEXT,
    source VARCHAR(255),
    time_period VARCHAR(100),
    geography VARCHAR(100),
    
    data_url TEXT NOT NULL,
    format VARCHAR(50), -- csv, excel, json
    
    variables JSONB,
    sample_size INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    dataset_id UUID REFERENCES market_research_data(id),
    
    research_question TEXT,
    methodology TEXT,
    
    -- Analysis
    code_notebook_url TEXT,
    visualizations TEXT[],
    findings TEXT,
    recommendations TEXT,
    
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
    score DECIMAL(5,2),
    feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BUSINESS SIMULATIONS
-- =====================================================

CREATE TABLE business_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_name VARCHAR(255) NOT NULL,
    simulation_type VARCHAR(50) CHECK (simulation_type IN ('market_entry', 'competitive_strategy', 'pricing', 'supply_chain', 'negotiation', 'leadership')),
    
    description TEXT,
    industry VARCHAR(100),
    duration_weeks INTEGER,
    
    rules JSONB,
    initial_conditions JSONB,
    decision_points JSONB,
    
    learning_objectives TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE simulation_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES business_simulations(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    
    members UUID[],
    current_round INTEGER DEFAULT 1,
    overall_rank INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE simulation_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES simulation_teams(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    
    decisions JSONB NOT NULL,
    results JSONB,
    
    market_share DECIMAL(5,2),
    revenue DECIMAL(15,2),
    profit DECIMAL(15,2),
    stock_price DECIMAL(10,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, round_number)
);

-- =====================================================
-- ENTREPRENEURSHIP
-- =====================================================

CREATE TABLE business_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    
    executive_summary TEXT,
    company_description TEXT,
    market_analysis TEXT,
    organization_management TEXT,
    products_services TEXT,
    marketing_sales_strategy TEXT,
    financial_projections JSONB,
    funding_request TEXT,
    
    -- Documents
    pitch_deck_url TEXT,
    financial_model_url TEXT,
    
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    feedback TEXT,
    score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pitch_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_plan_id UUID REFERENCES business_plans(id) ON DELETE CASCADE,
    
    video_url TEXT,
    presentation_slides_url TEXT,
    
    -- Evaluation Scores
    problem_clarity_score DECIMAL(5,2),
    solution_innovation_score DECIMAL(5,2),
    market_opportunity_score DECIMAL(5,2),
    business_model_score DECIMAL(5,2),
    team_capability_score DECIMAL(5,2),
    financial_viability_score DECIMAL(5,2),
    presentation_quality_score DECIMAL(5,2),
    
    overall_score DECIMAL(5,2),
    funding_recommendation VARCHAR(50) CHECK (funding_recommendation IN ('yes', 'no', 'maybe')),
    comments TEXT,
    
    evaluated_by UUID,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TEAM COLLABORATION
-- =====================================================

CREATE TABLE project_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_name VARCHAR(255) NOT NULL,
    course_id UUID,
    
    project_description TEXT,
    deliverables TEXT[],
    
    members UUID[],
    team_leader UUID,
    
    start_date DATE,
    end_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES project_teams(id) ON DELETE CASCADE,
    
    meeting_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    location VARCHAR(255),
    
    agenda TEXT,
    minutes TEXT,
    action_items JSONB,
    attendees UUID[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE peer_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES project_teams(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL,
    evaluated_id UUID NOT NULL,
    
    contribution_score DECIMAL(5,2),
    collaboration_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    leadership_score DECIMAL(5,2),
    reliability_score DECIMAL(5,2),
    
    strengths TEXT,
    areas_for_improvement TEXT,
    comments TEXT,
    
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, evaluator_id, evaluated_id)
);

-- =====================================================
-- EXECUTIVE EDUCATION
-- =====================================================

CREATE TABLE leadership_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    assessment_type VARCHAR(50) CHECK (assessment_type IN ('mbti', 'disc', '360_feedback', 'emotional_intelligence', 'leadership_style')),
    
    results JSONB NOT NULL,
    interpretation TEXT,
    development_recommendations TEXT[],
    
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE executive_coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    coach_id UUID NOT NULL,
    
    session_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    
    discussion_topics TEXT[],
    goals_set TEXT[],
    action_items TEXT[],
    notes TEXT,
    
    next_session_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NETWORKING & CAREER
-- =====================================================

CREATE TABLE alumni_directory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    current_company VARCHAR(255),
    current_position VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(255),
    
    graduation_year INTEGER,
    concentration VARCHAR(100),
    
    willing_to_mentor BOOLEAN DEFAULT false,
    willing_to_hire BOOLEAN DEFAULT false,
    
    linkedin_url TEXT,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE networking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) CHECK (event_type IN ('career_fair', 'networking', 'speaker', 'conference', 'workshop')),
    
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    industry_focus VARCHAR(100),
    
    description TEXT,
    speakers TEXT[],
    
    registration_required BOOLEAN DEFAULT true,
    capacity INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_business_cases_industry ON business_cases(industry);
CREATE INDEX idx_business_cases_type ON business_cases(case_type);
CREATE INDEX idx_user_case_analyses_user_id ON user_case_analyses(user_id);
CREATE INDEX idx_financial_models_type ON financial_models(model_type);
CREATE INDEX idx_analytics_projects_user_id ON analytics_projects(user_id);
CREATE INDEX idx_simulation_teams_simulation_id ON simulation_teams(simulation_id);
CREATE INDEX idx_business_plans_user_id ON business_plans(user_id);
CREATE INDEX idx_project_teams_course_id ON project_teams(course_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_business_cases_updated_at BEFORE UPDATE ON business_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plans_updated_at BEFORE UPDATE ON business_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
