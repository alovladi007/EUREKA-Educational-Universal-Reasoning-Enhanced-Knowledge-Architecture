-- =====================================================
-- EduFlow Platform - Analytics Dashboard Database Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- EVENT TRACKING
-- =====================================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID,
    session_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100) CHECK (event_category IN ('navigation', 'interaction', 'learning', 'assessment', 'social', 'system')),
    event_name VARCHAR(255) NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    device_type VARCHAR(50) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'other')),
    browser VARCHAR(50),
    os VARCHAR(50),
    screen_resolution VARCHAR(20),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    server_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partitioning by month for better performance
CREATE TABLE analytics_events_y2025m01 PARTITION OF analytics_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE analytics_events_y2025m02 PARTITION OF analytics_events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Add more partitions as needed

-- =====================================================
-- USER ENGAGEMENT METRICS
-- =====================================================

CREATE TABLE engagement_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    metric_date DATE NOT NULL,
    session_count INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    active_time_seconds INTEGER DEFAULT 0, -- Time actually interacting
    idle_time_seconds INTEGER DEFAULT 0,
    pages_viewed INTEGER DEFAULT 0,
    lessons_started INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    assignments_submitted INTEGER DEFAULT 0,
    assessments_taken INTEGER DEFAULT 0,
    forum_posts INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    search_queries INTEGER DEFAULT 0,
    resources_accessed INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2), -- Composite score 0-100
    retention_risk VARCHAR(50) CHECK (retention_risk IN ('low', 'medium', 'high', 'critical')),
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, metric_date)
);

CREATE TABLE session_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    entry_page TEXT,
    exit_page TEXT,
    pages_visited INTEGER DEFAULT 0,
    actions_count INTEGER DEFAULT 0,
    bounce BOOLEAN DEFAULT false, -- True if only one page viewed
    session_quality DECIMAL(5,2), -- Based on engagement depth
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PERFORMANCE METRICS
-- =====================================================

CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    course_id UUID,
    metric_period VARCHAR(50) CHECK (metric_period IN ('daily', 'weekly', 'monthly', 'all_time')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Academic Performance
    average_score DECIMAL(5,2),
    median_score DECIMAL(5,2),
    grade_distribution JSONB, -- {A: 5, B: 10, C: 3, etc.}
    assignments_completed INTEGER DEFAULT 0,
    assignments_on_time INTEGER DEFAULT 0,
    assignments_late INTEGER DEFAULT 0,
    
    -- Learning Metrics
    concepts_mastered INTEGER DEFAULT 0,
    skills_acquired INTEGER DEFAULT 0,
    learning_velocity DECIMAL(5,2), -- Rate of concept mastery
    retention_rate DECIMAL(5,2),
    
    -- Time Metrics
    total_study_time_hours DECIMAL(8,2),
    average_session_duration_minutes DECIMAL(6,2),
    
    -- Engagement
    participation_rate DECIMAL(5,2),
    resource_utilization_rate DECIMAL(5,2),
    
    -- Comparative Metrics
    percentile_rank DECIMAL(5,2), -- Compared to peers
    improvement_rate DECIMAL(5,2), -- % improvement over time
    
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, metric_period, period_start)
);

CREATE TABLE quiz_performance_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    assessment_id UUID NOT NULL,
    attempt_number INTEGER,
    
    -- Score Metrics
    score DECIMAL(5,2),
    percentile DECIMAL(5,2),
    time_taken_seconds INTEGER,
    completion_rate DECIMAL(5,2),
    
    -- Question-Level Analysis
    questions_correct INTEGER,
    questions_incorrect INTEGER,
    questions_skipped INTEGER,
    average_time_per_question DECIMAL(6,2),
    
    -- Difficulty Analysis
    easy_questions_correct INTEGER,
    medium_questions_correct INTEGER,
    hard_questions_correct INTEGER,
    
    -- Concept Performance
    concept_scores JSONB, -- {concept_id: score}
    weak_concepts UUID[], -- Array of concept IDs
    strong_concepts UUID[],
    
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COHORT & COMPARATIVE ANALYTICS
-- =====================================================

CREATE TABLE cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cohort_type VARCHAR(50) CHECK (cohort_type IN ('course', 'semester', 'program', 'custom')),
    tier VARCHAR(50),
    start_date DATE,
    end_date DATE,
    member_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cohort_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cohort_id, user_id)
);

CREATE TABLE cohort_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    
    -- Aggregate Performance
    average_performance DECIMAL(5,2),
    median_performance DECIMAL(5,2),
    std_deviation DECIMAL(5,2),
    
    -- Engagement
    active_users_count INTEGER,
    average_engagement_score DECIMAL(5,2),
    
    -- Progress
    average_completion_rate DECIMAL(5,2),
    on_track_count INTEGER,
    at_risk_count INTEGER,
    
    -- Retention
    retention_rate DECIMAL(5,2),
    dropout_count INTEGER,
    
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cohort_id, metric_date)
);

-- =====================================================
-- INSTRUCTOR ANALYTICS
-- =====================================================

CREATE TABLE instructor_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL,
    course_id UUID,
    metric_period VARCHAR(50) CHECK (metric_period IN ('daily', 'weekly', 'monthly', 'all_time')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Teaching Metrics
    students_taught INTEGER DEFAULT 0,
    courses_taught INTEGER DEFAULT 0,
    average_student_rating DECIMAL(3,2),
    response_time_hours DECIMAL(6,2), -- Average time to respond to questions
    
    -- Content Quality
    content_engagement_rate DECIMAL(5,2),
    lesson_completion_rate DECIMAL(5,2),
    resource_usage_rate DECIMAL(5,2),
    
    -- Student Performance
    average_student_score DECIMAL(5,2),
    pass_rate DECIMAL(5,2),
    improvement_rate DECIMAL(5,2),
    
    -- Activity
    feedback_given_count INTEGER DEFAULT 0,
    discussions_participated INTEGER DEFAULT 0,
    assignments_graded INTEGER DEFAULT 0,
    average_grading_time_hours DECIMAL(6,2),
    
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(instructor_id, course_id, metric_period, period_start)
);

-- =====================================================
-- COURSE ANALYTICS
-- =====================================================

CREATE TABLE course_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Enrollment Metrics
    total_enrollments INTEGER DEFAULT 0,
    active_students INTEGER DEFAULT 0,
    completed_students INTEGER DEFAULT 0,
    dropout_students INTEGER DEFAULT 0,
    
    -- Engagement Metrics
    average_engagement_score DECIMAL(5,2),
    average_time_spent_hours DECIMAL(8,2),
    forum_activity_count INTEGER DEFAULT 0,
    
    -- Performance Metrics
    average_score DECIMAL(5,2),
    pass_rate DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    
    -- Content Metrics
    lessons_viewed INTEGER DEFAULT 0,
    resources_downloaded INTEGER DEFAULT 0,
    average_lesson_completion_rate DECIMAL(5,2),
    
    -- Satisfaction
    average_rating DECIMAL(3,2),
    nps_score DECIMAL(5,2), -- Net Promoter Score
    
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, metric_date)
);

CREATE TABLE lesson_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    completions_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),
    
    -- Time Metrics
    average_time_spent_seconds INTEGER,
    median_time_spent_seconds INTEGER,
    
    -- Interaction
    interactions_count INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    notes_taken INTEGER DEFAULT 0,
    
    -- Quality Indicators
    engagement_score DECIMAL(5,2),
    difficulty_rating DECIMAL(3,2), -- Student-reported
    helpfulness_rating DECIMAL(3,2),
    
    -- Drop-off Analysis
    drop_off_rate DECIMAL(5,2),
    drop_off_points JSONB, -- Timestamps where students drop off
    
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, metric_date)
);

-- =====================================================
-- PREDICTIVE ANALYTICS
-- =====================================================

CREATE TABLE risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    course_id UUID,
    prediction_type VARCHAR(50) CHECK (prediction_type IN ('dropout', 'failure', 'disengagement', 'success')),
    risk_score DECIMAL(5,2) NOT NULL, -- 0-100, higher = higher risk
    confidence DECIMAL(5,2),
    contributing_factors JSONB, -- Factors affecting the prediction
    recommended_interventions TEXT[],
    model_version VARCHAR(50),
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE intervention_effectiveness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_type VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    risk_prediction_id UUID REFERENCES risk_predictions(id),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    outcome VARCHAR(50) CHECK (outcome IN ('successful', 'failed', 'pending', 'no_change')),
    pre_intervention_metrics JSONB,
    post_intervention_metrics JSONB,
    effectiveness_score DECIMAL(5,2),
    measured_at TIMESTAMP
);

-- =====================================================
-- LEARNING PATHWAYS ANALYTICS
-- =====================================================

CREATE TABLE pathway_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pathway_id UUID NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Completion Metrics
    active_learners INTEGER DEFAULT 0,
    completed_learners INTEGER DEFAULT 0,
    average_completion_time_days DECIMAL(8,2),
    
    -- Performance
    average_pathway_score DECIMAL(5,2),
    milestone_completion_rates JSONB, -- {milestone_id: completion_rate}
    
    -- Engagement
    average_engagement_score DECIMAL(5,2),
    dropout_rate DECIMAL(5,2),
    drop_off_points JSONB, -- Common points where students leave
    
    last_calculated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pathway_id, metric_date)
);

-- =====================================================
-- REAL-TIME DASHBOARDS
-- =====================================================

CREATE TABLE dashboard_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_type VARCHAR(50) CHECK (dashboard_type IN ('student', 'instructor', 'admin', 'course', 'system')),
    entity_id UUID, -- user_id, course_id, etc.
    snapshot_data JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE report_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(100) NOT NULL,
    parameters JSONB,
    result_data JSONB NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    hit_count INTEGER DEFAULT 0
);

-- =====================================================
-- CUSTOM REPORTS
-- =====================================================

CREATE TABLE custom_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50),
    created_by UUID NOT NULL,
    query_definition JSONB NOT NULL,
    visualization_config JSONB,
    schedule VARCHAR(50), -- For automated reports
    recipients TEXT[],
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE report_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES custom_reports(id) ON DELETE CASCADE,
    executed_by UUID,
    execution_time_ms INTEGER,
    row_count INTEGER,
    status VARCHAR(50) CHECK (status IN ('success', 'failed', 'timeout')),
    error_message TEXT,
    result_url TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SYSTEM ANALYTICS
-- =====================================================

CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- User Metrics
    total_users INTEGER,
    active_users_today INTEGER,
    new_users_today INTEGER,
    
    -- Content Metrics
    total_courses INTEGER,
    active_courses INTEGER,
    total_lessons INTEGER,
    
    -- Engagement
    total_sessions_today INTEGER,
    average_session_duration_minutes DECIMAL(6,2),
    
    -- Performance
    api_response_time_ms INTEGER,
    error_rate DECIMAL(5,2),
    uptime_percentage DECIMAL(5,2),
    
    -- Resource Usage
    storage_used_gb DECIMAL(10,2),
    bandwidth_used_gb DECIMAL(10,2),
    cpu_usage_percentage DECIMAL(5,2),
    memory_usage_percentage DECIMAL(5,2)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_engagement_metrics_user_date ON engagement_metrics(user_id, metric_date);
CREATE INDEX idx_session_analytics_user_id ON session_analytics(user_id);
CREATE INDEX idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_course_id ON performance_metrics(course_id);
CREATE INDEX idx_risk_predictions_user_id ON risk_predictions(user_id);
CREATE INDEX idx_risk_predictions_score ON risk_predictions(risk_score);
CREATE INDEX idx_course_analytics_course_id ON course_analytics(course_id);

-- =====================================================
-- MATERIALIZED VIEWS FOR FAST QUERIES
-- =====================================================

CREATE MATERIALIZED VIEW mv_daily_user_activity AS
SELECT 
    user_id,
    DATE(timestamp) as activity_date,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as session_count,
    COUNT(DISTINCT event_type) as unique_event_types
FROM analytics_events
GROUP BY user_id, DATE(timestamp);

CREATE INDEX idx_mv_daily_user_activity ON mv_daily_user_activity(user_id, activity_date);

-- Refresh the materialized view daily
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_user_activity;
