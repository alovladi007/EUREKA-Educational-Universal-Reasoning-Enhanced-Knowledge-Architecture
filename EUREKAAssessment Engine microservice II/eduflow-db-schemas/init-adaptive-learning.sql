-- =====================================================
-- EduFlow Platform - Adaptive Learning Database Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- KNOWLEDGE GRAPH & CONCEPTS
-- =====================================================

CREATE TABLE knowledge_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tier VARCHAR(50),
    subject VARCHAR(100),
    parent_domain_id UUID REFERENCES knowledge_domains(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_concepts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_id UUID REFERENCES knowledge_domains(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    concept_type VARCHAR(50) CHECK (concept_type IN ('foundational', 'core', 'advanced', 'specialized')),
    difficulty_level DECIMAL(3,2), -- 1.00 = beginner, 5.00 = expert
    estimated_mastery_hours INTEGER,
    bloom_taxonomy_level VARCHAR(50),
    keywords TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concept_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_concept_id UUID REFERENCES learning_concepts(id) ON DELETE CASCADE,
    target_concept_id UUID REFERENCES learning_concepts(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) CHECK (relationship_type IN ('prerequisite', 'related', 'builds_on', 'applies_to', 'contradicts')),
    strength DECIMAL(3,2) DEFAULT 1.00, -- How strong the relationship is
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_concept_id, target_concept_id, relationship_type)
);

-- =====================================================
-- LEARNING PATHS
-- =====================================================

CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    goal_description TEXT,
    tier VARCHAR(50),
    subject VARCHAR(100),
    target_completion_date DATE,
    path_type VARCHAR(50) CHECK (path_type IN ('auto_generated', 'instructor_created', 'custom', 'guided')),
    difficulty_level VARCHAR(50),
    estimated_duration_hours INTEGER,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_path_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES learning_concepts(id),
    course_id UUID,
    lesson_id UUID,
    assignment_id UUID,
    node_type VARCHAR(50) CHECK (node_type IN ('concept', 'lesson', 'practice', 'assessment', 'review', 'milestone')),
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    unlock_criteria JSONB,
    estimated_duration_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed', 'skipped')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(path_id, order_index)
);

-- =====================================================
-- USER MASTERY & PROGRESS
-- =====================================================

CREATE TABLE user_concept_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    concept_id UUID REFERENCES learning_concepts(id) ON DELETE CASCADE,
    mastery_level DECIMAL(5,2) DEFAULT 0.00, -- 0-100 scale
    confidence_score DECIMAL(5,2) DEFAULT 50.00,
    attempts_count INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_practiced TIMESTAMP,
    retention_strength DECIMAL(5,2) DEFAULT 50.00, -- Spaced repetition metric
    next_review_date TIMESTAMP,
    mastery_trajectory VARCHAR(50) CHECK (mastery_trajectory IN ('improving', 'stable', 'declining', 'unknown')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concept_id)
);

CREATE TABLE mastery_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mastery_id UUID REFERENCES user_concept_mastery(id) ON DELETE CASCADE,
    mastery_level DECIMAL(5,2) NOT NULL,
    confidence_score DECIMAL(5,2),
    activity_type VARCHAR(50) CHECK (activity_type IN ('lesson', 'practice', 'assessment', 'review')),
    activity_id UUID,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    milestone_type VARCHAR(50) CHECK (milestone_type IN ('concept_mastered', 'skill_acquired', 'level_up', 'streak_achieved', 'goal_reached')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    concept_id UUID REFERENCES learning_concepts(id),
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- ADAPTIVE RECOMMENDATIONS
-- =====================================================

CREATE TABLE recommendation_engine_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    algorithm_type VARCHAR(50) CHECK (algorithm_type IN ('collaborative', 'content_based', 'knowledge_tracing', 'hybrid')),
    personalization_factors JSONB, -- Learning style, pace, preferences
    difficulty_preference VARCHAR(50) DEFAULT 'adaptive',
    goals TEXT[],
    constraints JSONB, -- Time available, deadlines, etc.
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE content_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    recommendation_type VARCHAR(50) CHECK (recommendation_type IN ('next_lesson', 'review', 'practice', 'enrichment', 'remedial')),
    content_type VARCHAR(50) CHECK (content_type IN ('lesson', 'assignment', 'concept', 'course', 'resource')),
    content_id UUID NOT NULL,
    concept_id UUID REFERENCES learning_concepts(id),
    priority_score DECIMAL(5,2) NOT NULL, -- Higher = more recommended
    reasoning TEXT,
    algorithm_used VARCHAR(100),
    confidence_score DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'shown', 'accepted', 'rejected', 'completed')),
    shown_at TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- =====================================================
-- SPACED REPETITION SYSTEM
-- =====================================================

CREATE TABLE srs_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    concept_id UUID REFERENCES learning_concepts(id) ON DELETE CASCADE,
    question_id UUID,
    card_type VARCHAR(50) CHECK (card_type IN ('flashcard', 'problem', 'concept_check')),
    content TEXT NOT NULL,
    answer TEXT,
    difficulty DECIMAL(3,2) DEFAULT 2.50, -- SM-2 algorithm difficulty
    interval_days INTEGER DEFAULT 1,
    ease_factor DECIMAL(3,2) DEFAULT 2.50,
    repetitions INTEGER DEFAULT 0,
    next_review_date TIMESTAMP NOT NULL,
    last_reviewed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concept_id, question_id)
);

CREATE TABLE srs_review_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    card_id UUID REFERENCES srs_cards(id) ON DELETE CASCADE,
    quality_rating INTEGER CHECK (quality_rating BETWEEN 0 AND 5), -- 0=total blackout, 5=perfect recall
    time_taken_seconds INTEGER,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SKILL TREES & PROGRESSION
-- =====================================================

CREATE TABLE skill_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tier VARCHAR(50),
    subject VARCHAR(100),
    created_by UUID,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skill_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES skill_trees(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES learning_concepts(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    node_type VARCHAR(50) CHECK (node_type IN ('skill', 'ability', 'achievement', 'milestone')),
    required_mastery_level DECIMAL(5,2) DEFAULT 80.00,
    xp_reward INTEGER DEFAULT 0,
    position_x INTEGER, -- For visualization
    position_y INTEGER,
    parent_nodes UUID[], -- Array of prerequisite node IDs
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_skill_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    skill_node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    unlocked_at TIMESTAMP,
    completed_at TIMESTAMP,
    xp_earned INTEGER DEFAULT 0,
    UNIQUE(user_id, skill_node_id)
);

-- =====================================================
-- LEARNING ANALYTICS
-- =====================================================

CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    path_id UUID REFERENCES learning_paths(id),
    session_type VARCHAR(50) CHECK (session_type IN ('study', 'practice', 'review', 'assessment', 'exploration')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    activities_completed INTEGER DEFAULT 0,
    concepts_engaged TEXT[], -- Array of concept IDs
    performance_score DECIMAL(5,2),
    focus_score DECIMAL(5,2), -- Based on interaction patterns
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE learning_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    pattern_type VARCHAR(50) CHECK (pattern_type IN ('learning_style', 'time_preference', 'difficulty_preference', 'pace', 'retention')),
    pattern_data JSONB NOT NULL,
    confidence DECIMAL(5,2),
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, pattern_type)
);

CREATE TABLE difficulty_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    concept_id UUID REFERENCES learning_concepts(id),
    content_id UUID,
    original_difficulty DECIMAL(3,2),
    adjusted_difficulty DECIMAL(3,2),
    adjustment_reason TEXT,
    performance_before DECIMAL(5,2),
    performance_after DECIMAL(5,2),
    adjusted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- GAMIFICATION ELEMENTS
-- =====================================================

CREATE TABLE user_xp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    xp_amount INTEGER NOT NULL,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('earned', 'bonus', 'penalty', 'adjustment')),
    source_type VARCHAR(50) CHECK (source_type IN ('lesson_completion', 'assessment', 'streak', 'achievement', 'milestone', 'daily_goal')),
    source_id UUID,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    tier VARCHAR(50),
    achievement_type VARCHAR(50) CHECK (achievement_type IN ('mastery', 'streak', 'speed', 'consistency', 'exploration', 'social')),
    criteria JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    rarity VARCHAR(50) CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_data JSONB,
    UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_status ON learning_paths(status);
CREATE INDEX idx_path_nodes_path_id ON learning_path_nodes(path_id);
CREATE INDEX idx_user_mastery_user_id ON user_concept_mastery(user_id);
CREATE INDEX idx_user_mastery_concept_id ON user_concept_mastery(concept_id);
CREATE INDEX idx_user_mastery_next_review ON user_concept_mastery(next_review_date);
CREATE INDEX idx_recommendations_user_id ON content_recommendations(user_id);
CREATE INDEX idx_recommendations_status ON content_recommendations(status);
CREATE INDEX idx_srs_cards_user_id ON srs_cards(user_id);
CREATE INDEX idx_srs_cards_next_review ON srs_cards(next_review_date);
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_user_xp_user_id ON user_xp(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mastery_updated_at BEFORE UPDATE ON user_concept_mastery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
