-- =====================================================
-- AI TUTOR DATABASE SCHEMA - COMPREHENSIVE STEM EXPERT
-- =====================================================
-- Supports: Mathematics, Science, Engineering, Technology
-- Features: RAG, Code Execution, Equation Solving, Adaptive Learning
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- SUBJECT DOMAINS & EXPERTISE
-- =====================================================

CREATE TYPE subject_domain AS ENUM (
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'computer_science',
    'electrical_engineering',
    'mechanical_engineering',
    'civil_engineering',
    'data_science',
    'artificial_intelligence'
);

CREATE TYPE difficulty_level AS ENUM (
    'elementary',
    'middle_school',
    'high_school',
    'undergraduate',
    'graduate',
    'expert'
);

CREATE TYPE problem_type AS ENUM (
    'conceptual',
    'calculation',
    'proof',
    'coding',
    'design',
    'analysis',
    'debugging',
    'optimization'
);

-- =====================================================
-- STEM KNOWLEDGE BASE
-- =====================================================

CREATE TABLE stem_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Classification
    subject_domain subject_domain NOT NULL,
    topic VARCHAR(255) NOT NULL,
    subtopic VARCHAR(255),
    difficulty_level difficulty_level NOT NULL,

    -- Content
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) CHECK (content_type IN ('concept', 'formula', 'theorem', 'algorithm', 'example', 'solution', 'reference')),

    -- Mathematical/Scientific Content
    equations TEXT[], -- LaTeX format
    formulas JSONB DEFAULT '[]', -- Structured formulas
    code_examples JSONB DEFAULT '[]', -- Programming examples
    diagrams_urls TEXT[],

    -- Metadata
    prerequisites UUID[], -- References to other knowledge items
    related_concepts UUID[],
    keywords TEXT[],
    tags TEXT[],

    -- Vector Embeddings for RAG
    embedding vector(1536), -- OpenAI ada-002 or similar

    -- Quality & Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    quality_score DECIMAL(3,2) DEFAULT 0.00,

    -- Usage Statistics
    times_referenced INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,

    -- Sources
    source_type VARCHAR(100), -- 'textbook', 'research_paper', 'expert_created', etc.
    source_reference TEXT,
    citation TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    CONSTRAINT valid_quality_score CHECK (quality_score BETWEEN 0 AND 1)
);

CREATE INDEX idx_knowledge_subject ON stem_knowledge_base(subject_domain);
CREATE INDEX idx_knowledge_topic ON stem_knowledge_base(topic);
CREATE INDEX idx_knowledge_difficulty ON stem_knowledge_base(difficulty_level);
CREATE INDEX idx_knowledge_embedding ON stem_knowledge_base USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_knowledge_keywords ON stem_knowledge_base USING gin(keywords);
CREATE INDEX idx_knowledge_verified ON stem_knowledge_base(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_knowledge_search ON stem_knowledge_base USING gin(to_tsvector('english', title || ' ' || content));

-- =====================================================
-- AI TUTOR SESSIONS
-- =====================================================

CREATE TABLE ai_tutor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Session Context
    subject_domain subject_domain NOT NULL,
    topic VARCHAR(255),
    difficulty_level difficulty_level,

    -- Session Type
    session_type VARCHAR(50) CHECK (session_type IN (
        'homework_help',
        'concept_learning',
        'problem_solving',
        'exam_prep',
        'project_assistance',
        'research_help'
    )),

    -- Session State
    is_active BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,

    -- Conversation Stats
    total_messages INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10,6) DEFAULT 0.00,

    -- Learning Context
    student_knowledge_state JSONB DEFAULT '{}', -- What student knows
    learning_objectives TEXT[],
    problems_solved INTEGER DEFAULT 0,
    concepts_learned TEXT[],

    -- Performance Tracking
    student_understanding_score DECIMAL(3,2), -- AI's assessment
    engagement_score DECIMAL(3,2),

    -- Feedback
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    feedback_text TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON ai_tutor_sessions(user_id);
CREATE INDEX idx_sessions_subject ON ai_tutor_sessions(subject_domain);
CREATE INDEX idx_sessions_active ON ai_tutor_sessions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sessions_started ON ai_tutor_sessions(started_at);

-- =====================================================
-- AI TUTOR MESSAGES
-- =====================================================

CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system', 'function');

CREATE TABLE ai_tutor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_tutor_sessions(id) ON DELETE CASCADE,

    -- Message Details
    role message_role NOT NULL,
    content TEXT NOT NULL,

    -- AI Model Info
    model_used VARCHAR(100), -- 'claude-3-opus', 'gpt-4', etc.
    temperature DECIMAL(3,2),
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),

    -- Context Used (RAG)
    knowledge_references UUID[], -- References to stem_knowledge_base
    context_retrieved JSONB, -- Retrieved context for RAG

    -- Message Metadata
    message_type VARCHAR(50) CHECK (message_type IN (
        'question',
        'explanation',
        'hint',
        'solution',
        'code',
        'equation',
        'diagram',
        'feedback',
        'encouragement'
    )),

    -- Content Analysis
    contains_math BOOLEAN DEFAULT FALSE,
    contains_code BOOLEAN DEFAULT FALSE,
    programming_language VARCHAR(50),

    -- Code Execution (if applicable)
    code_executed TEXT,
    execution_result JSONB,
    execution_error TEXT,

    -- Mathematical Processing
    equations_latex TEXT[],
    equations_solved JSONB,

    -- Quality Metrics
    confidence_score DECIMAL(3,2),
    response_quality DECIMAL(3,2),
    was_helpful BOOLEAN,

    -- Timing
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_session ON ai_tutor_messages(session_id);
CREATE INDEX idx_messages_role ON ai_tutor_messages(role);
CREATE INDEX idx_messages_created ON ai_tutor_messages(created_at);
CREATE INDEX idx_messages_math ON ai_tutor_messages(contains_math) WHERE contains_math = TRUE;
CREATE INDEX idx_messages_code ON ai_tutor_messages(contains_code) WHERE contains_code = TRUE;

-- =====================================================
-- PROBLEM SOLVING HISTORY
-- =====================================================

CREATE TABLE solved_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES ai_tutor_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Problem Details
    subject_domain subject_domain NOT NULL,
    problem_type problem_type NOT NULL,
    difficulty_level difficulty_level NOT NULL,

    -- Problem Content
    problem_statement TEXT NOT NULL,
    problem_context JSONB, -- Additional structured data

    -- Solution
    solution_steps JSONB NOT NULL, -- Array of solution steps
    final_answer TEXT,
    alternate_solutions JSONB,

    -- Methodology
    solving_approach VARCHAR(100), -- 'analytical', 'numerical', 'computational', etc.
    algorithms_used TEXT[],
    formulas_applied TEXT[],

    -- Code (if programming problem)
    code_solution TEXT,
    code_language VARCHAR(50),
    test_cases JSONB,
    execution_successful BOOLEAN,

    -- Learning Insights
    key_concepts TEXT[],
    common_mistakes TEXT[],
    learning_points TEXT[],

    -- Time & Effort
    time_to_solve_seconds INTEGER,
    hints_given INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,

    -- Success Metrics
    solved_correctly BOOLEAN DEFAULT FALSE,
    student_confidence INTEGER CHECK (student_confidence BETWEEN 1 AND 5),

    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_solved_problems_user ON solved_problems(user_id);
CREATE INDEX idx_solved_problems_subject ON solved_problems(subject_domain);
CREATE INDEX idx_solved_problems_type ON solved_problems(problem_type);
CREATE INDEX idx_solved_problems_solved ON solved_problems(solved_at);

-- =====================================================
-- STUDENT KNOWLEDGE MODEL
-- =====================================================

CREATE TABLE student_knowledge_model (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_domain subject_domain NOT NULL,

    -- Knowledge State
    topic VARCHAR(255) NOT NULL,
    subtopic VARCHAR(255),

    -- Mastery Level
    mastery_score DECIMAL(5,2) DEFAULT 0.00 CHECK (mastery_score BETWEEN 0 AND 100),
    confidence_level DECIMAL(3,2) DEFAULT 0.50 CHECK (confidence_level BETWEEN 0 AND 1),

    -- Learning History
    first_encountered TIMESTAMP,
    last_practiced TIMESTAMP,
    practice_count INTEGER DEFAULT 0,

    -- Performance Metrics
    problems_attempted INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    average_time_seconds INTEGER,

    -- Difficulty Progression
    current_difficulty difficulty_level DEFAULT 'elementary',
    max_difficulty_achieved difficulty_level,

    -- Learning Curve
    learning_velocity DECIMAL(5,2), -- Rate of improvement
    retention_score DECIMAL(3,2), -- How well retained over time

    -- Prerequisites & Dependencies
    prerequisite_gaps TEXT[], -- Missing prerequisites
    strength_areas TEXT[],
    weakness_areas TEXT[],

    -- Recommendations
    next_topics_recommended TEXT[],
    recommended_difficulty difficulty_level,

    -- Last Updated
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_topic UNIQUE(user_id, subject_domain, topic, subtopic)
);

CREATE INDEX idx_knowledge_model_user ON student_knowledge_model(user_id);
CREATE INDEX idx_knowledge_model_subject ON student_knowledge_model(subject_domain);
CREATE INDEX idx_knowledge_model_mastery ON student_knowledge_model(mastery_score);
CREATE INDEX idx_knowledge_model_updated ON student_knowledge_model(updated_at);

-- =====================================================
-- CODE EXECUTION LOGS
-- =====================================================

CREATE TABLE code_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES ai_tutor_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES ai_tutor_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Code Details
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    code_hash VARCHAR(64), -- SHA-256 hash for deduplication

    -- Execution Environment
    runtime_version VARCHAR(50),
    environment JSONB, -- Environment variables, dependencies

    -- Input/Output
    stdin TEXT,
    stdout TEXT,
    stderr TEXT,
    return_code INTEGER,

    -- Results
    execution_successful BOOLEAN,
    execution_time_ms INTEGER,
    memory_used_mb DECIMAL(10,2),

    -- Error Handling
    error_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,

    -- Security
    sandbox_violations JSONB,
    resource_limits_exceeded BOOLEAN DEFAULT FALSE,

    -- Metadata
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_code_exec_user ON code_execution_logs(user_id);
CREATE INDEX idx_code_exec_language ON code_execution_logs(language);
CREATE INDEX idx_code_exec_session ON code_execution_logs(session_id);
CREATE INDEX idx_code_exec_success ON code_execution_logs(execution_successful);

-- =====================================================
-- MATHEMATICAL EQUATIONS SOLVED
-- =====================================================

CREATE TABLE equations_solved (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES ai_tutor_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Equation Details
    equation_latex TEXT NOT NULL,
    equation_type VARCHAR(100), -- 'linear', 'quadratic', 'differential', 'integral', etc.
    variables TEXT[],

    -- Solution
    solution_steps JSONB NOT NULL,
    final_solution TEXT,
    solution_latex TEXT,

    -- Method Used
    solving_method VARCHAR(100), -- 'symbolic', 'numeric', 'graphical'
    solver_used VARCHAR(50), -- 'sympy', 'wolfram', 'custom'

    -- Verification
    solution_verified BOOLEAN,
    verification_method VARCHAR(50),

    -- Computational Details
    computation_time_ms INTEGER,
    complexity_score DECIMAL(5,2),

    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equations_user ON equations_solved(user_id);
CREATE INDEX idx_equations_type ON equations_solved(equation_type);
CREATE INDEX idx_equations_session ON equations_solved(session_id);

-- =====================================================
-- AI TUTOR PROMPTS & TEMPLATES
-- =====================================================

CREATE TABLE tutor_prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Template Info
    template_name VARCHAR(255) NOT NULL UNIQUE,
    subject_domain subject_domain,
    template_type VARCHAR(50) CHECK (template_type IN (
        'system_prompt',
        'problem_solving',
        'explanation',
        'hint_generation',
        'code_review',
        'concept_teaching'
    )),

    -- Prompt Content
    prompt_text TEXT NOT NULL,
    variables TEXT[], -- Variables to be replaced: {topic}, {difficulty}, etc.

    -- Model Configuration
    recommended_model VARCHAR(100),
    recommended_temperature DECIMAL(3,2),
    max_tokens INTEGER,

    -- Effectiveness
    usage_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    success_rate DECIMAL(5,2),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prompts_domain ON tutor_prompt_templates(subject_domain);
CREATE INDEX idx_prompts_type ON tutor_prompt_templates(template_type);
CREATE INDEX idx_prompts_active ON tutor_prompt_templates(is_active) WHERE is_active = TRUE;

-- =====================================================
-- LEARNING RESOURCES LIBRARY
-- =====================================================

CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Resource Details
    subject_domain subject_domain NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty_level difficulty_level NOT NULL,

    resource_type VARCHAR(50) CHECK (resource_type IN (
        'video',
        'textbook',
        'article',
        'tutorial',
        'practice_problems',
        'interactive_demo',
        'simulation',
        'research_paper'
    )),

    -- Content
    title VARCHAR(500) NOT NULL,
    description TEXT,
    url TEXT,
    file_path TEXT,

    -- Metadata
    author VARCHAR(255),
    publisher VARCHAR(255),
    publication_year INTEGER,
    duration_minutes INTEGER,

    -- Quality
    quality_rating DECIMAL(3,2),
    difficulty_rating DECIMAL(3,2),
    user_ratings_count INTEGER DEFAULT 0,
    average_user_rating DECIMAL(3,2),

    -- Usage
    times_recommended INTEGER DEFAULT 0,
    times_accessed INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),

    -- Embedding for recommendation
    embedding vector(1536),

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_subject ON learning_resources(subject_domain);
CREATE INDEX idx_resources_topic ON learning_resources(topic);
CREATE INDEX idx_resources_difficulty ON learning_resources(difficulty_level);
CREATE INDEX idx_resources_type ON learning_resources(resource_type);
CREATE INDEX idx_resources_embedding ON learning_resources USING ivfflat (embedding vector_cosine_ops);

-- =====================================================
-- PEER LEARNING & COLLABORATION
-- =====================================================

CREATE TABLE study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Group Details
    name VARCHAR(255) NOT NULL,
    subject_domain subject_domain NOT NULL,
    topic VARCHAR(255),
    difficulty_level difficulty_level,

    -- Group Settings
    max_members INTEGER DEFAULT 10,
    is_private BOOLEAN DEFAULT FALSE,
    join_code VARCHAR(20) UNIQUE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_group_member UNIQUE(group_id, user_id)
);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update session stats when message is added
CREATE OR REPLACE FUNCTION update_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_tutor_sessions
    SET total_messages = total_messages + 1,
        total_tokens_used = total_tokens_used + COALESCE(NEW.tokens_used, 0),
        total_cost_usd = total_cost_usd + COALESCE(NEW.cost_usd, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_session_stats
    AFTER INSERT ON ai_tutor_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_session_stats();

-- Update knowledge model when problem is solved
CREATE OR REPLACE FUNCTION update_knowledge_on_problem_solve()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO student_knowledge_model (
        user_id, subject_domain, topic,
        problems_attempted, problems_solved,
        success_rate, last_practiced
    )
    VALUES (
        NEW.user_id,
        NEW.subject_domain,
        (NEW.key_concepts[1]), -- Use first concept as topic
        1,
        CASE WHEN NEW.solved_correctly THEN 1 ELSE 0 END,
        CASE WHEN NEW.solved_correctly THEN 100.00 ELSE 0.00 END,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (user_id, subject_domain, topic, subtopic)
    DO UPDATE SET
        problems_attempted = student_knowledge_model.problems_attempted + 1,
        problems_solved = student_knowledge_model.problems_solved + CASE WHEN NEW.solved_correctly THEN 1 ELSE 0 END,
        success_rate = (student_knowledge_model.problems_solved::DECIMAL / NULLIF(student_knowledge_model.problems_attempted, 0)) * 100,
        last_practiced = CURRENT_TIMESTAMP,
        practice_count = student_knowledge_model.practice_count + 1;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_model_trigger
    AFTER INSERT ON solved_problems
    FOR EACH ROW
    EXECUTE FUNCTION update_knowledge_on_problem_solve();

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Student Performance Dashboard
CREATE OR REPLACE VIEW v_student_stem_performance AS
SELECT
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    skm.subject_domain,
    COUNT(DISTINCT skm.topic) as topics_studied,
    AVG(skm.mastery_score) as avg_mastery,
    SUM(skm.problems_attempted) as total_problems_attempted,
    SUM(skm.problems_solved) as total_problems_solved,
    AVG(skm.success_rate) as avg_success_rate,
    COUNT(DISTINCT ats.id) as total_sessions,
    SUM(ats.duration_seconds) as total_study_time_seconds
FROM users u
LEFT JOIN student_knowledge_model skm ON u.id = skm.user_id
LEFT JOIN ai_tutor_sessions ats ON u.id = ats.user_id AND ats.subject_domain = skm.subject_domain
GROUP BY u.id, u.email, u.first_name, u.last_name, skm.subject_domain;

-- Knowledge Gaps Analysis
CREATE OR REPLACE VIEW v_student_knowledge_gaps AS
SELECT
    user_id,
    subject_domain,
    topic,
    mastery_score,
    prerequisite_gaps,
    weakness_areas,
    recommended_difficulty
FROM student_knowledge_model
WHERE mastery_score < 70.00
ORDER BY mastery_score ASC;

-- =====================================================
-- SEED DATA - STEM KNOWLEDGE BASE
-- =====================================================

-- Mathematics Knowledge
INSERT INTO stem_knowledge_base (subject_domain, topic, subtopic, difficulty_level, title, content, content_type, equations, keywords) VALUES
('mathematics', 'Algebra', 'Quadratic Equations', 'high_school', 'Quadratic Formula',
 'The quadratic formula is used to solve equations of the form ax² + bx + c = 0. The solutions are given by x = (-b ± √(b² - 4ac)) / 2a',
 'formula',
 ARRAY['x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}'],
 ARRAY['quadratic', 'formula', 'roots', 'discriminant']),

('mathematics', 'Calculus', 'Derivatives', 'undergraduate', 'Power Rule',
 'The power rule states that the derivative of x^n is nx^(n-1). This is one of the fundamental rules for differentiation.',
 'theorem',
 ARRAY['\frac{d}{dx}(x^n) = nx^{n-1}'],
 ARRAY['derivative', 'power rule', 'calculus', 'differentiation']),

('mathematics', 'Linear Algebra', 'Matrices', 'undergraduate', 'Matrix Multiplication',
 'Matrix multiplication is defined as (AB)ij = Σk Aik * Bkj. The number of columns in A must equal the number of rows in B.',
 'concept',
 ARRAY['(AB)_{ij} = \sum_{k} A_{ik}B_{kj}'],
 ARRAY['matrix', 'multiplication', 'linear algebra']);

-- Physics Knowledge
INSERT INTO stem_knowledge_base (subject_domain, topic, subtopic, difficulty_level, title, content, content_type, equations, keywords) VALUES
('physics', 'Mechanics', 'Kinematics', 'high_school', 'Equations of Motion',
 'The kinematic equations describe motion with constant acceleration. Key equations: v = u + at, s = ut + ½at², v² = u² + 2as',
 'formula',
 ARRAY['v = u + at', 's = ut + \frac{1}{2}at^2', 'v^2 = u^2 + 2as'],
 ARRAY['kinematics', 'motion', 'acceleration', 'velocity']),

('physics', 'Electromagnetism', 'Circuits', 'undergraduate', 'Ohm''s Law',
 'Ohm''s law states that the current through a conductor is directly proportional to the voltage across it: V = IR',
 'theorem',
 ARRAY['V = IR'],
 ARRAY['ohm', 'voltage', 'current', 'resistance']);

-- Computer Science Knowledge
INSERT INTO stem_knowledge_base (subject_domain, topic, subtopic, difficulty_level, title, content, content_type, code_examples, keywords) VALUES
('computer_science', 'Algorithms', 'Sorting', 'undergraduate', 'Quick Sort Algorithm',
 'Quick Sort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around it. Average time complexity: O(n log n)',
 'algorithm',
 '[{"language": "python", "code": "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr)//2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)"}]'::jsonb,
 ARRAY['sorting', 'quicksort', 'algorithm', 'divide-conquer']);

-- Engineering Knowledge
INSERT INTO stem_knowledge_base (subject_domain, topic, subtopic, difficulty_level, title, content, content_type, equations, keywords) VALUES
('mechanical_engineering', 'Thermodynamics', 'First Law', 'undergraduate', 'First Law of Thermodynamics',
 'The first law of thermodynamics states that energy cannot be created or destroyed, only transformed. ΔU = Q - W',
 'theorem',
 ARRAY['\Delta U = Q - W'],
 ARRAY['thermodynamics', 'energy', 'first law', 'conservation']);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ AI Tutor Database Schema Created Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📚 Knowledge Base: Initialized with STEM fundamentals';
    RAISE NOTICE '🤖 AI Sessions: Ready for conversational learning';
    RAISE NOTICE '💻 Code Execution: Logging system ready';
    RAISE NOTICE '📊 Student Modeling: Adaptive learning enabled';
    RAISE NOTICE '🧮 Equation Solver: Mathematical problem solving ready';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Subjects Supported:';
    RAISE NOTICE '   - Mathematics (Algebra → Graduate Level)';
    RAISE NOTICE '   - Physics (Mechanics → Quantum)';
    RAISE NOTICE '   - Chemistry (General → Organic)';
    RAISE NOTICE '   - Biology (Cell → Systems)';
    RAISE NOTICE '   - Computer Science (Algorithms → AI)';
    RAISE NOTICE '   - All Engineering Disciplines';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for AI Tutor Service Integration!';
END $$;
