-- XR Labs Database Schema
-- Extended Reality Labs Backend Service - VR/AR/MR platform for immersive STEM education

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for embeddings (if available)
CREATE EXTENSION IF NOT EXISTS vector;

-- Table: xr_experiences
CREATE TABLE IF NOT EXISTS xr_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    duration_minutes INTEGER,
    thumbnail_url TEXT,
    scene_url TEXT,
    interaction_type VARCHAR(100),
    learning_objectives TEXT[],
    prerequisites TEXT[],
    tags TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    avg_rating DECIMAL(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: xr_simulation_ratings
CREATE TABLE IF NOT EXISTS xr_simulation_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES xr_experiences(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    helpful_count INTEGER DEFAULT 0,
    verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(experience_id, user_id)
);

-- Table: xr_scene_projects
CREATE TABLE IF NOT EXISTS xr_scene_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    scene_data JSONB NOT NULL,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    fork_count INTEGER DEFAULT 0,
    star_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: xr_scene_templates
CREATE TABLE IF NOT EXISTS xr_scene_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    scene_data JSONB NOT NULL,
    thumbnail_url TEXT,
    preview_images TEXT[],
    difficulty VARCHAR(50),
    estimated_time_minutes INTEGER,
    usage_count INTEGER DEFAULT 0,
    tags TEXT[],
    is_premium BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: xr_asset_library_categories
CREATE TABLE IF NOT EXISTS xr_asset_library_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    parent_category_id UUID REFERENCES xr_asset_library_categories(id),
    asset_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: xr_3d_assets
CREATE TABLE IF NOT EXISTS xr_3d_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES xr_asset_library_categories(id),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_format VARCHAR(50),
    file_size_kb INTEGER,
    polygon_count INTEGER,
    texture_resolution VARCHAR(50),
    is_animated BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    license_type VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: xr_popular_assets
CREATE TABLE IF NOT EXISTS xr_popular_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES xr_3d_assets(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    usage_count INTEGER DEFAULT 0,
    period VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, period)
);

-- Table: xr_user_sessions
CREATE TABLE IF NOT EXISTS xr_user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    experience_id UUID REFERENCES xr_experiences(id) ON DELETE CASCADE,
    session_type VARCHAR(50),
    device_type VARCHAR(100),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    interaction_count INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5, 2) DEFAULT 0.00,
    performance_metrics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: xr_dashboard_analytics
CREATE TABLE IF NOT EXISTS xr_dashboard_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15, 2),
    metric_type VARCHAR(100),
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_xr_experiences_category ON xr_experiences(category);
CREATE INDEX IF NOT EXISTS idx_xr_experiences_published ON xr_experiences(is_published);
CREATE INDEX IF NOT EXISTS idx_xr_simulation_ratings_experience ON xr_simulation_ratings(experience_id);
CREATE INDEX IF NOT EXISTS idx_xr_simulation_ratings_user ON xr_simulation_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_xr_scene_projects_creator ON xr_scene_projects(created_by);
CREATE INDEX IF NOT EXISTS idx_xr_scene_projects_category ON xr_scene_projects(category);
CREATE INDEX IF NOT EXISTS idx_xr_3d_assets_category ON xr_3d_assets(category_id);
CREATE INDEX IF NOT EXISTS idx_xr_user_sessions_user ON xr_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_xr_user_sessions_experience ON xr_user_sessions(experience_id);

-- View: v_simulation_cards
CREATE OR REPLACE VIEW v_simulation_cards AS
SELECT
    e.id,
    e.title,
    e.description,
    e.category,
    e.difficulty,
    e.duration_minutes,
    e.thumbnail_url,
    e.scene_url,
    e.interaction_type,
    e.learning_objectives,
    e.prerequisites,
    e.tags,
    e.is_published,
    e.avg_rating,
    e.rating_count,
    e.usage_count,
    e.created_at,
    e.updated_at
FROM xr_experiences e
WHERE e.is_published = TRUE;

-- Function: get_realtime_dashboard_stats
CREATE OR REPLACE FUNCTION get_realtime_dashboard_stats()
RETURNS TABLE (
    active_simulations BIGINT,
    total_users BIGINT,
    avg_engagement_rate DECIMAL,
    total_sessions_today BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT e.id)::BIGINT AS active_simulations,
        COUNT(DISTINCT s.user_id)::BIGINT AS total_users,
        COALESCE(AVG(s.completion_percentage), 0)::DECIMAL AS avg_engagement_rate,
        COUNT(CASE WHEN s.started_at >= CURRENT_DATE THEN 1 END)::BIGINT AS total_sessions_today
    FROM xr_experiences e
    LEFT JOIN xr_user_sessions s ON e.id = s.experience_id
    WHERE e.is_published = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: get_active_sessions
CREATE OR REPLACE FUNCTION get_active_sessions()
RETURNS TABLE (
    session_count BIGINT,
    unique_users BIGINT,
    avg_duration DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS session_count,
        COUNT(DISTINCT user_id)::BIGINT AS unique_users,
        COALESCE(AVG(duration_seconds), 0)::DECIMAL AS avg_duration
    FROM xr_user_sessions
    WHERE started_at >= NOW() - INTERVAL '1 hour'
    AND ended_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Insert sample categories
INSERT INTO xr_asset_library_categories (category_name, description, display_order) VALUES
    ('Physics', 'Physics-related 3D assets and simulations', 1),
    ('Chemistry', 'Chemistry lab equipment and molecular models', 2),
    ('Biology', 'Anatomical models and biological systems', 3),
    ('Mathematics', 'Geometric shapes and mathematical visualizations', 4),
    ('Astronomy', 'Celestial objects and space exploration', 5),
    ('Engineering', 'Engineering tools and mechanical systems', 6)
ON CONFLICT (category_name) DO NOTHING;

-- Insert sample experience
INSERT INTO xr_experiences (title, description, category, difficulty, duration_minutes, is_published) VALUES
    ('Solar System Explorer', 'Interactive tour of our solar system with realistic planetary models', 'Astronomy', 'Beginner', 15, TRUE),
    ('Human Anatomy VR', 'Explore the human body systems in virtual reality', 'Biology', 'Intermediate', 30, TRUE),
    ('Chemistry Lab Simulation', 'Safe virtual chemistry experiments', 'Chemistry', 'Intermediate', 25, TRUE)
ON CONFLICT DO NOTHING;
