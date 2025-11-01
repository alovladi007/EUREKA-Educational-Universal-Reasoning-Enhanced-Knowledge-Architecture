-- =====================================================
-- EduFlow Platform - Engineering Professional Tier
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENGINEERING PROBLEMS & SOLUTIONS
-- =====================================================

CREATE TABLE engineering_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_title VARCHAR(255) NOT NULL,
    discipline VARCHAR(100) CHECK (discipline IN ('mechanical', 'electrical', 'civil', 'chemical', 'computer', 'aerospace', 'biomedical', 'industrial')),
    subdiscipline VARCHAR(100),
    
    problem_statement TEXT NOT NULL,
    given_data JSONB,
    constraints JSONB,
    requirements TEXT[],
    
    -- Solution
    solution_approach TEXT,
    calculations JSONB,
    final_answer TEXT,
    units VARCHAR(50),
    
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    estimated_time_minutes INTEGER,
    
    -- Educational Content
    concepts_required TEXT[],
    formulas TEXT[],
    references TEXT[],
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_problem_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    problem_id UUID REFERENCES engineering_problems(id) ON DELETE CASCADE,
    
    solution_text TEXT,
    work_shown TEXT,
    final_answer TEXT,
    
    is_correct BOOLEAN,
    accuracy_percentage DECIMAL(5,2),
    methodology_score DECIMAL(5,2),
    
    time_taken_seconds INTEGER,
    attempts_count INTEGER DEFAULT 1,
    
    feedback TEXT,
    hints_used INTEGER DEFAULT 0,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, problem_id, submitted_at)
);

-- =====================================================
-- CIRCUIT SIMULATION
-- =====================================================

CREATE TABLE circuit_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    circuit_type VARCHAR(50) CHECK (circuit_type IN ('analog', 'digital', 'mixed_signal', 'power', 'rf', 'embedded')),
    
    description TEXT,
    specifications JSONB,
    components_list JSONB,
    
    -- Circuit Files
    schematic_url TEXT,
    pcb_layout_url TEXT,
    netlist_url TEXT,
    spice_model_url TEXT,
    
    -- Simulation
    simulation_results JSONB,
    waveforms TEXT[],
    performance_metrics JSONB,
    
    difficulty_level VARCHAR(50),
    learning_objectives TEXT[],
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_circuit_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    project_id UUID REFERENCES circuit_projects(id) ON DELETE CASCADE,
    
    design_file_url TEXT NOT NULL,
    simulation_file_url TEXT,
    
    meets_specifications BOOLEAN,
    performance_score DECIMAL(5,2),
    cost_score DECIMAL(5,2),
    power_efficiency_score DECIMAL(5,2),
    
    feedback TEXT,
    grade DECIMAL(5,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CAD PROJECTS
-- =====================================================

CREATE TABLE cad_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) CHECK (project_type IN ('part_modeling', 'assembly', 'drawing', 'simulation', 'rendering')),
    discipline VARCHAR(100),
    
    description TEXT,
    requirements TEXT[],
    constraints JSONB,
    
    -- Model Files
    cad_file_url TEXT,
    file_format VARCHAR(50), -- step, iges, stl, solidworks, etc.
    thumbnail_url TEXT,
    renders TEXT[],
    
    -- Specifications
    dimensions JSONB,
    materials TEXT[],
    tolerances JSONB,
    
    difficulty_level VARCHAR(50),
    estimated_hours DECIMAL(4,1),
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_cad_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    project_id UUID REFERENCES cad_projects(id) ON DELETE CASCADE,
    
    model_file_url TEXT NOT NULL,
    drawing_file_url TEXT,
    
    design_accuracy_score DECIMAL(5,2),
    modeling_technique_score DECIMAL(5,2),
    documentation_score DECIMAL(5,2),
    manufacturability_score DECIMAL(5,2),
    
    feedback TEXT,
    grade DECIMAL(5,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FINITE ELEMENT ANALYSIS
-- =====================================================

CREATE TABLE fea_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    analysis_type VARCHAR(50) CHECK (analysis_type IN ('structural', 'thermal', 'fluid', 'electromagnetic', 'modal', 'fatigue')),
    
    description TEXT,
    geometry_file_url TEXT,
    
    -- Analysis Setup
    material_properties JSONB,
    boundary_conditions JSONB,
    loading_conditions JSONB,
    mesh_parameters JSONB,
    
    -- Results
    results_file_url TEXT,
    max_stress DECIMAL(15,4),
    max_displacement DECIMAL(15,8),
    safety_factor DECIMAL(8,4),
    
    visualizations TEXT[],
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_fea_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    project_id UUID REFERENCES fea_projects(id) ON DELETE CASCADE,
    
    analysis_file_url TEXT NOT NULL,
    results_report_url TEXT,
    
    setup_accuracy_score DECIMAL(5,2),
    results_accuracy_score DECIMAL(5,2),
    interpretation_score DECIMAL(5,2),
    
    feedback TEXT,
    grade DECIMAL(5,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROGRAMMING ASSIGNMENTS
-- =====================================================

CREATE TABLE coding_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    language VARCHAR(50) CHECK (language IN ('python', 'cpp', 'java', 'matlab', 'verilog', 'vhdl', 'c', 'javascript', 'rust')),
    project_type VARCHAR(50) CHECK (project_type IN ('algorithm', 'data_structure', 'simulation', 'embedded', 'ai_ml', 'web_app', 'desktop_app')),
    
    description TEXT NOT NULL,
    requirements TEXT[],
    starter_code TEXT,
    
    test_cases JSONB,
    expected_output TEXT,
    
    difficulty_level VARCHAR(50),
    estimated_hours DECIMAL(4,1),
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_code_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    project_id UUID REFERENCES coding_projects(id) ON DELETE CASCADE,
    
    code TEXT NOT NULL,
    repository_url TEXT,
    
    test_results JSONB,
    tests_passed INTEGER,
    tests_failed INTEGER,
    code_quality_score DECIMAL(5,2),
    
    execution_time_ms INTEGER,
    memory_usage_kb INTEGER,
    
    feedback TEXT,
    grade DECIMAL(5,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LAB EXPERIMENTS
-- =====================================================

CREATE TABLE lab_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_name VARCHAR(255) NOT NULL,
    discipline VARCHAR(100),
    
    objectives TEXT[],
    theory TEXT,
    equipment_needed TEXT[],
    procedure JSONB,
    safety_precautions TEXT[],
    
    expected_results TEXT,
    analysis_questions TEXT[],
    
    duration_hours DECIMAL(4,1),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_lab_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    experiment_id UUID REFERENCES lab_experiments(id) ON DELETE CASCADE,
    
    report_file_url TEXT NOT NULL,
    
    -- Lab Data
    raw_data JSONB,
    calculations JSONB,
    graphs TEXT[],
    
    -- Evaluation
    data_quality_score DECIMAL(5,2),
    analysis_score DECIMAL(5,2),
    conclusions_score DECIMAL(5,2),
    presentation_score DECIMAL(5,2),
    
    feedback TEXT,
    grade DECIMAL(5,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DESIGN COMPETITIONS
-- =====================================================

CREATE TABLE design_competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_name VARCHAR(255) NOT NULL,
    competition_type VARCHAR(50) CHECK (competition_type IN ('formula_sae', 'robotics', 'concrete_canoe', 'solar_car', 'bridge_building', 'innovation')),
    
    description TEXT,
    rules JSONB,
    evaluation_criteria JSONB,
    
    registration_deadline DATE,
    submission_deadline DATE,
    event_date DATE,
    
    prizes TEXT[],
    sponsors TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE competition_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID REFERENCES design_competitions(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    
    members UUID[],
    team_leader UUID,
    faculty_advisor UUID,
    
    design_proposal TEXT,
    final_report_url TEXT,
    presentation_url TEXT,
    
    rank INTEGER,
    score DECIMAL(6,2),
    awards TEXT[],
    
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FE/PE EXAM PREPARATION
-- =====================================================

CREATE TABLE fe_exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    discipline VARCHAR(100),
    topic VARCHAR(255),
    
    question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'numerical')),
    answer_options JSONB,
    correct_answer TEXT NOT NULL,
    
    solution_explanation TEXT,
    formulas_used TEXT[],
    references TEXT[],
    
    difficulty VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_fe_exam_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    question_id UUID REFERENCES fe_exam_questions(id) ON DELETE CASCADE,
    
    user_answer TEXT,
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROFESSIONAL CERTIFICATIONS
-- =====================================================

CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_name VARCHAR(255) NOT NULL,
    certifying_body VARCHAR(255),
    discipline VARCHAR(100),
    
    requirements TEXT[],
    preparation_materials TEXT[],
    exam_format TEXT,
    passing_score DECIMAL(5,2),
    
    cost_usd DECIMAL(10,2),
    renewal_period_years INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    
    earned_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RESEARCH PROJECTS
-- =====================================================

CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_title VARCHAR(255) NOT NULL,
    principal_investigator UUID,
    
    research_area VARCHAR(100),
    abstract TEXT,
    objectives TEXT[],
    methodology TEXT,
    
    start_date DATE,
    expected_end_date DATE,
    
    funding_source VARCHAR(255),
    budget_usd DECIMAL(15,2),
    
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('proposed', 'active', 'completed', 'published')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE research_publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES research_projects(id),
    
    title VARCHAR(500) NOT NULL,
    authors TEXT[],
    publication_venue VARCHAR(255),
    publication_date DATE,
    
    doi VARCHAR(255),
    url TEXT,
    citation_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_engineering_problems_discipline ON engineering_problems(discipline);
CREATE INDEX idx_engineering_problems_difficulty ON engineering_problems(difficulty_level);
CREATE INDEX idx_circuit_projects_type ON circuit_projects(circuit_type);
CREATE INDEX idx_cad_projects_discipline ON cad_projects(discipline);
CREATE INDEX idx_coding_projects_language ON coding_projects(language);
CREATE INDEX idx_lab_experiments_discipline ON lab_experiments(discipline);
CREATE INDEX idx_fe_exam_questions_discipline ON fe_exam_questions(discipline);
CREATE INDEX idx_research_projects_status ON research_projects(status);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_engineering_problems_updated_at BEFORE UPDATE ON engineering_problems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON research_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
