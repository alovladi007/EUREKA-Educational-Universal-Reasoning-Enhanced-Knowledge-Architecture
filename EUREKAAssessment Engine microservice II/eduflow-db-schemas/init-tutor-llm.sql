-- =====================================================
-- EduFlow Platform - AI Tutor LLM Database Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONVERSATION MANAGEMENT
-- =====================================================

CREATE TABLE tutor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_type VARCHAR(50) CHECK (session_type IN ('homework_help', 'concept_explanation', 'practice', 'exam_prep', 'general')),
    subject VARCHAR(100),
    tier VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    message_count INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    feedback TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE tutor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'code', 'math', 'image', 'file')),
    
    -- AI Model Info
    model_used VARCHAR(100),
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    cost_usd DECIMAL(10,6),
    
    -- Message Metadata
    parent_message_id UUID REFERENCES tutor_messages(id),
    attachments TEXT[],
    code_snippets JSONB,
    latex_expressions TEXT[],
    
    -- Quality Metrics
    confidence_score DECIMAL(5,2),
    was_helpful BOOLEAN,
    flagged BOOLEAN DEFAULT false,
    flag_reason TEXT,
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTEXT & MEMORY
-- =====================================================

CREATE TABLE conversation_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    context_type VARCHAR(50) CHECK (context_type IN ('course', 'assignment', 'concept', 'prior_conversation', 'user_profile')),
    context_data JSONB NOT NULL,
    relevance_score DECIMAL(5,2),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE user_learning_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    concept_id UUID,
    interaction_type VARCHAR(50) CHECK (interaction_type IN ('question', 'explanation', 'practice', 'assessment', 'review')),
    content_summary TEXT,
    understanding_level VARCHAR(50) CHECK (understanding_level IN ('confused', 'partial', 'good', 'mastered')),
    topics TEXT[],
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE short_term_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id UUID REFERENCES tutor_sessions(id),
    memory_key VARCHAR(255) NOT NULL,
    memory_value JSONB NOT NULL,
    importance_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    UNIQUE(user_id, memory_key)
);

CREATE TABLE long_term_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    memory_type VARCHAR(50) CHECK (memory_type IN ('fact', 'preference', 'weakness', 'strength', 'goal')),
    memory_key VARCHAR(255) NOT NULL,
    memory_value JSONB NOT NULL,
    confidence DECIMAL(5,2) DEFAULT 50.00,
    last_reinforced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reinforcement_count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, memory_type, memory_key)
);

-- =====================================================
-- TUTORING STRATEGIES
-- =====================================================

CREATE TABLE tutoring_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy_type VARCHAR(50) CHECK (strategy_type IN ('socratic', 'direct', 'scaffolding', 'worked_example', 'questioning', 'analogies')),
    tier VARCHAR(50),
    subject VARCHAR(100),
    effectiveness_score DECIMAL(5,2),
    prompt_template TEXT,
    config JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE strategy_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES tutor_messages(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES tutoring_strategies(id),
    user_understanding_before VARCHAR(50),
    user_understanding_after VARCHAR(50),
    effectiveness_rating DECIMAL(5,2),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- QUESTION CLASSIFICATION
-- =====================================================

CREATE TABLE question_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_type VARCHAR(50) CHECK (pattern_type IN ('what', 'why', 'how', 'explain', 'compare', 'solve', 'debug', 'verify')),
    pattern_regex TEXT,
    recommended_strategy_id UUID REFERENCES tutoring_strategies(id),
    example_questions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classified_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES tutor_messages(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    primary_pattern VARCHAR(50),
    secondary_patterns TEXT[],
    subject VARCHAR(100),
    topics TEXT[],
    difficulty_estimate VARCHAR(50),
    requires_computation BOOLEAN DEFAULT false,
    requires_visualization BOOLEAN DEFAULT false,
    confidence DECIMAL(5,2),
    classified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANSWER GENERATION & QUALITY
-- =====================================================

CREATE TABLE answer_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) CHECK (template_type IN ('explanation', 'example', 'hint', 'solution', 'clarification')),
    tier VARCHAR(50),
    subject VARCHAR(100),
    template_text TEXT NOT NULL,
    variables JSONB, -- Variables that can be filled in
    usage_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generated_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES tutor_messages(id) ON DELETE CASCADE,
    question_id UUID REFERENCES classified_questions(id),
    template_id UUID REFERENCES answer_templates(id),
    
    -- Generation Details
    model_used VARCHAR(100),
    generation_strategy VARCHAR(100),
    prompt_used TEXT,
    raw_output TEXT,
    processed_output TEXT,
    
    -- Quality Metrics
    coherence_score DECIMAL(5,2),
    relevance_score DECIMAL(5,2),
    accuracy_verified BOOLEAN,
    contains_errors BOOLEAN DEFAULT false,
    error_notes TEXT,
    
    -- Performance
    generation_time_ms INTEGER,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FEEDBACK & IMPROVEMENT
-- =====================================================

CREATE TABLE tutor_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES tutor_messages(id) ON DELETE CASCADE,
    session_id UUID REFERENCES tutor_sessions(id),
    user_id UUID NOT NULL,
    
    feedback_type VARCHAR(50) CHECK (feedback_type IN ('helpful', 'not_helpful', 'incorrect', 'unclear', 'too_simple', 'too_complex', 'perfect')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    suggested_improvement TEXT,
    
    -- What worked
    positive_aspects TEXT[],
    negative_aspects TEXT[],
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE answer_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES tutor_messages(id) ON DELETE CASCADE,
    original_answer TEXT NOT NULL,
    corrected_answer TEXT NOT NULL,
    correction_reason TEXT,
    corrected_by UUID,
    correction_type VARCHAR(50) CHECK (correction_type IN ('factual', 'pedagogical', 'clarity', 'completeness')),
    corrected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USAGE & ANALYTICS
-- =====================================================

CREATE TABLE tutor_usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    
    -- Usage Metrics
    sessions_count INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    
    -- Subject Breakdown
    subjects_covered TEXT[],
    topics_discussed TEXT[],
    
    -- Quality Metrics
    average_satisfaction DECIMAL(3,2),
    helpful_responses_count INTEGER DEFAULT 0,
    unhelpful_responses_count INTEGER DEFAULT 0,
    
    -- Cost
    total_tokens_used INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10,4),
    
    UNIQUE(user_id, date)
);

CREATE TABLE model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    
    -- Usage
    requests_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    average_response_time_ms INTEGER,
    
    -- Quality
    average_user_rating DECIMAL(3,2),
    accuracy_rate DECIMAL(5,2),
    error_rate DECIMAL(5,2),
    
    -- Cost
    total_cost_usd DECIMAL(10,4),
    cost_per_1k_tokens DECIMAL(10,6),
    
    UNIQUE(model_name, date)
);

-- =====================================================
-- CONTENT SAFETY & MODERATION
-- =====================================================

CREATE TABLE content_moderation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES tutor_messages(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    
    -- Moderation Results
    is_safe BOOLEAN,
    flagged_categories TEXT[], -- ['hate', 'violence', 'sexual', 'self-harm', etc.]
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence_scores JSONB,
    
    -- Actions
    action_taken VARCHAR(50) CHECK (action_taken IN ('none', 'warning', 'filtered', 'blocked', 'reviewed')),
    reviewed_by UUID,
    review_notes TEXT,
    
    moderated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SPECIALIZED TUTORING FEATURES
-- =====================================================

CREATE TABLE code_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES tutor_messages(id),
    
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    input_data TEXT,
    output TEXT,
    errors TEXT,
    execution_time_ms INTEGER,
    memory_used_kb INTEGER,
    
    status VARCHAR(50) CHECK (status IN ('success', 'error', 'timeout', 'memory_limit')),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE math_problem_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES tutor_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES tutor_messages(id),
    
    problem_text TEXT NOT NULL,
    problem_type VARCHAR(50), -- algebra, calculus, geometry, etc.
    solution_steps JSONB NOT NULL, -- Array of step-by-step solutions
    final_answer TEXT,
    alternative_methods JSONB,
    visual_aids TEXT[], -- URLs to generated diagrams
    
    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concept_explanations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concept_id UUID,
    explanation_level VARCHAR(50) CHECK (explanation_level IN ('eli5', 'beginner', 'intermediate', 'advanced', 'expert')),
    explanation_text TEXT NOT NULL,
    analogies TEXT[],
    examples JSONB,
    visual_aids TEXT[],
    related_concepts UUID[],
    
    -- Quality
    clarity_score DECIMAL(5,2),
    completeness_score DECIMAL(5,2),
    usage_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_tutor_sessions_user_id ON tutor_sessions(user_id);
CREATE INDEX idx_tutor_sessions_status ON tutor_sessions(status);
CREATE INDEX idx_tutor_messages_session_id ON tutor_messages(session_id);
CREATE INDEX idx_tutor_messages_timestamp ON tutor_messages(timestamp);
CREATE INDEX idx_conversation_context_session_id ON conversation_context(session_id);
CREATE INDEX idx_user_learning_history_user_id ON user_learning_history(user_id);
CREATE INDEX idx_short_term_memory_user_id ON short_term_memory(user_id);
CREATE INDEX idx_short_term_memory_expires ON short_term_memory(expires_at);
CREATE INDEX idx_long_term_memory_user_id ON long_term_memory(user_id);
CREATE INDEX idx_classified_questions_message_id ON classified_questions(message_id);
CREATE INDEX idx_generated_answers_message_id ON generated_answers(message_id);
CREATE INDEX idx_tutor_feedback_message_id ON tutor_feedback(message_id);
CREATE INDEX idx_content_moderation_flagged ON content_moderation(is_safe);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_tutoring_strategies_updated_at BEFORE UPDATE ON tutoring_strategies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
