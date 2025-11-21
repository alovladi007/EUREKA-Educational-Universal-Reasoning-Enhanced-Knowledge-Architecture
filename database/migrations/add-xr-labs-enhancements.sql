-- =====================================================
-- XR Labs Enhancement Migration
-- Adds: Categories, Ratings, Analytics, Scene Builder, Templates
-- =====================================================

-- Add simulation_category enum
CREATE TYPE simulation_category AS ENUM (
    'medical',
    'science',
    'history',
    'engineering',
    'mathematics',
    'arts',
    'business',
    'languages',
    'environmental',
    'social_studies'
);

-- =====================================================
-- RATINGS & REVIEWS SYSTEM
-- =====================================================

CREATE TABLE xr_simulation_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES xr_experiences(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    is_verified_user BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(experience_id, user_id)
);

CREATE INDEX idx_ratings_experience ON xr_simulation_ratings(experience_id);
CREATE INDEX idx_ratings_user ON xr_simulation_ratings(user_id);
CREATE INDEX idx_ratings_rating ON xr_simulation_ratings(rating);

-- =====================================================
-- DASHBOARD ANALYTICS
-- =====================================================

CREATE TABLE xr_dashboard_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    active_simulations INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    new_users_today INTEGER DEFAULT 0,
    avg_engagement_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_vr_sessions INTEGER DEFAULT 0,
    total_ar_sessions INTEGER DEFAULT 0,
    total_mr_sessions INTEGER DEFAULT 0,
    active_sessions_now INTEGER DEFAULT 0,
    avg_session_duration_minutes DECIMAL(10,2) DEFAULT 0.00,
    completion_rate_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_content_created INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date)
);

CREATE INDEX idx_analytics_date ON xr_dashboard_analytics(date);

-- =====================================================
-- SCENE BUILDER & CONTENT CREATION
-- =====================================================

CREATE TABLE xr_scene_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    category simulation_category,
    scene_data JSONB NOT NULL DEFAULT '{"objects": [], "lights": [], "cameras": [], "interactions": [], "environment": {}}',
    thumbnail_url VARCHAR(500),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT FALSE,
    published_experience_id UUID REFERENCES xr_experiences(id),
    is_template BOOLEAN DEFAULT FALSE,
    template_category VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    last_edited_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scene_projects_user ON xr_scene_projects(created_by);
CREATE INDEX idx_scene_projects_category ON xr_scene_projects(category);
CREATE INDEX idx_scene_projects_published ON xr_scene_projects(is_published);

-- =====================================================
-- ASSET LIBRARY CATEGORIES
-- =====================================================

CREATE TABLE xr_asset_library_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES xr_asset_library_categories(id),
    description TEXT,
    icon_url VARCHAR(500),
    icon_emoji VARCHAR(10),
    asset_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_asset_categories_parent ON xr_asset_library_categories(parent_category_id);

-- =====================================================
-- SCENE TEMPLATES
-- =====================================================

CREATE TABLE xr_scene_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50), -- 'lab', 'classroom', 'outdoor', 'space', 'museum', etc.
    category simulation_category,
    scene_data JSONB NOT NULL DEFAULT '{"objects": [], "lights": [], "cameras": []}',
    thumbnail_url VARCHAR(500),
    preview_images TEXT[],
    is_premium BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_type ON xr_scene_templates(template_type);
CREATE INDEX idx_templates_category ON xr_scene_templates(category);
CREATE INDEX idx_templates_usage ON xr_scene_templates(usage_count DESC);

-- =====================================================
-- POPULAR ASSETS TRACKING
-- =====================================================

CREATE TABLE xr_popular_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES xr_3d_assets(id) ON DELETE CASCADE,
    usage_count INTEGER DEFAULT 0,
    category_id UUID REFERENCES xr_asset_library_categories(id),
    last_used_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(asset_id)
);

CREATE INDEX idx_popular_assets_usage ON xr_popular_assets(usage_count DESC);

-- =====================================================
-- ALTER EXISTING TABLES
-- =====================================================

-- Add category to xr_experiences
ALTER TABLE xr_experiences
ADD COLUMN IF NOT EXISTS category simulation_category,
ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT FALSE;

-- Add enhanced fields to xr_3d_assets
ALTER TABLE xr_3d_assets
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES xr_asset_library_categories(id),
ADD COLUMN IF NOT EXISTS license_type VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- =====================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- =====================================================

-- Dashboard statistics view
CREATE MATERIALIZED VIEW v_dashboard_stats AS
SELECT
    COUNT(DISTINCT e.id) FILTER (WHERE e.is_published = true) as active_simulations,
    COUNT(DISTINCT s.user_id) as total_users,
    COALESCE(AVG(s.completion_percentage) FILTER (WHERE s.ended_at IS NOT NULL), 0) as avg_engagement,
    COUNT(*) FILTER (WHERE s.ended_at IS NOT NULL) as total_sessions,
    COUNT(*) FILTER (WHERE s.ended_at IS NULL) as active_sessions_now,
    COALESCE(AVG(s.session_duration) FILTER (WHERE s.ended_at IS NOT NULL), 0) as avg_session_duration,
    COALESCE(
        (COUNT(*) FILTER (WHERE s.completion_percentage >= 80)::DECIMAL /
         NULLIF(COUNT(*) FILTER (WHERE s.ended_at IS NOT NULL), 0) * 100),
        0
    ) as completion_rate
FROM xr_experiences e
LEFT JOIN xr_user_sessions s ON e.id = s.experience_id
WHERE s.started_at > NOW() - INTERVAL '30 days' OR s.started_at IS NULL;

CREATE UNIQUE INDEX ON v_dashboard_stats ((true));

-- Simulation cards view with ratings
CREATE MATERIALIZED VIEW v_simulation_cards AS
SELECT
    e.id,
    e.title,
    e.description,
    e.category,
    e.experience_type,
    e.difficulty_level,
    e.thumbnail_url,
    e.duration_minutes,
    e.featured,
    e.trending,
    COUNT(DISTINCT s.user_id) as user_count,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as rating_count,
    e.tags,
    e.created_at,
    e.supported_devices
FROM xr_experiences e
LEFT JOIN xr_user_sessions s ON e.id = s.experience_id
LEFT JOIN xr_simulation_ratings r ON e.id = r.experience_id
WHERE e.is_published = true
GROUP BY e.id;

CREATE UNIQUE INDEX ON v_simulation_cards (id);
CREATE INDEX idx_sim_cards_category ON v_simulation_cards(category);
CREATE INDEX idx_sim_cards_type ON v_simulation_cards(experience_type);
CREATE INDEX idx_sim_cards_rating ON v_simulation_cards(avg_rating DESC);
CREATE INDEX idx_sim_cards_users ON v_simulation_cards(user_count DESC);

-- =====================================================
-- FUNCTIONS & PROCEDURES
-- =====================================================

-- Function to get real-time dashboard stats
CREATE OR REPLACE FUNCTION get_realtime_dashboard_stats()
RETURNS TABLE (
    active_simulations BIGINT,
    total_users BIGINT,
    avg_engagement NUMERIC,
    vr_sessions BIGINT,
    active_sessions_now BIGINT,
    avg_session_time NUMERIC,
    completion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM v_dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to update experience rating
CREATE OR REPLACE FUNCTION update_experience_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE xr_experiences
    SET avg_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM xr_simulation_ratings
        WHERE experience_id = NEW.experience_id
    )
    WHERE id = NEW.experience_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update ratings
CREATE TRIGGER trigger_update_experience_rating
AFTER INSERT OR UPDATE OR DELETE ON xr_simulation_ratings
FOR EACH ROW
EXECUTE FUNCTION update_experience_rating();

-- Function to get active sessions with details
CREATE OR REPLACE FUNCTION get_active_sessions()
RETURNS TABLE (
    session_id UUID,
    user_id UUID,
    display_name VARCHAR,
    experience_title VARCHAR,
    device_type xr_device_type,
    started_at TIMESTAMP,
    current_duration_minutes NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id as session_id,
        s.user_id,
        u.display_name,
        e.title as experience_title,
        s.device_type,
        s.started_at,
        EXTRACT(EPOCH FROM (NOW() - s.started_at)) / 60 as current_duration_minutes
    FROM xr_user_sessions s
    JOIN users u ON s.user_id = u.id
    JOIN xr_experiences e ON s.experience_id = e.id
    WHERE s.ended_at IS NULL
    ORDER BY s.started_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to increment asset usage
CREATE OR REPLACE FUNCTION increment_asset_usage(asset_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO xr_popular_assets (asset_id, usage_count, last_used_at)
    VALUES (asset_uuid, 1, NOW())
    ON CONFLICT (asset_id)
    DO UPDATE SET
        usage_count = xr_popular_assets.usage_count + 1,
        last_used_at = NOW();

    UPDATE xr_3d_assets
    SET download_count = download_count + 1
    WHERE id = asset_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to publish scene as experience
CREATE OR REPLACE FUNCTION publish_scene_project(project_uuid UUID, publish_settings JSONB)
RETURNS UUID AS $$
DECLARE
    new_experience_id UUID;
    project_record RECORD;
BEGIN
    -- Get project details
    SELECT * INTO project_record
    FROM xr_scene_projects
    WHERE id = project_uuid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project not found';
    END IF;

    -- Create experience
    INSERT INTO xr_experiences (
        title,
        description,
        experience_type,
        category,
        difficulty_level,
        duration_minutes,
        supported_devices,
        scene_file_url,
        thumbnail_url,
        tags,
        created_by
    ) VALUES (
        project_record.project_name,
        project_record.description,
        COALESCE((publish_settings->>'experience_type')::xr_experience_type, 'vr_lab'),
        project_record.category,
        COALESCE((publish_settings->>'difficulty_level')::VARCHAR, 'beginner'),
        COALESCE((publish_settings->>'duration_minutes')::INTEGER, 30),
        COALESCE((publish_settings->>'supported_devices')::xr_device_type[], ARRAY['web_browser', 'meta_quest']),
        COALESCE(publish_settings->>'scene_file_url', ''),
        project_record.thumbnail_url,
        COALESCE((publish_settings->>'tags')::TEXT[], ARRAY[]::TEXT[]),
        project_record.created_by
    ) RETURNING id INTO new_experience_id;

    -- Update project
    UPDATE xr_scene_projects
    SET
        is_published = true,
        published_experience_id = new_experience_id,
        updated_at = NOW()
    WHERE id = project_uuid;

    RETURN new_experience_id;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_xr_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY v_dashboard_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY v_simulation_cards;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Seed asset library categories
INSERT INTO xr_asset_library_categories (category_name, description, icon_emoji, sort_order) VALUES
('Molecules', 'Chemical structures and molecular models', '⚛️', 1),
('Organs', 'Human anatomy and organ systems', '🫀', 2),
('Equipment', 'Laboratory and medical equipment', '🔬', 3),
('Buildings', 'Architectural structures', '🏛️', 4),
('Astronomical', 'Planets, stars, and space objects', '🪐', 5),
('Geological', 'Rocks, minerals, and earth formations', '🏔️', 6),
('Biological', 'Plants, animals, and organisms', '🦠', 7),
('Mechanical', 'Engines, machines, and mechanisms', '⚙️', 8),
('Electronics', 'Circuits and electronic components', '🔌', 9),
('Furniture', 'Chairs, tables, and room furnishings', '🪑', 10),
('Vehicles', 'Cars, planes, and transportation', '🚗', 11),
('Characters', 'Avatars and character models', '👤', 12)
ON CONFLICT (category_name) DO NOTHING;

-- Seed scene templates
INSERT INTO xr_scene_templates (template_name, description, template_type, category, scene_data, tags, is_premium) VALUES
(
    'Basic Chemistry Lab',
    'Empty chemistry laboratory with standard equipment',
    'lab',
    'science',
    '{"objects": [{"type": "workbench", "position": [0, 0, 0]}, {"type": "cabinet", "position": [3, 0, 0]}], "lights": [{"type": "ambient", "intensity": 0.5}, {"type": "directional", "position": [5, 5, 5]}], "cameras": [{"type": "perspective", "position": [0, 1.6, 5]}], "environment": {"skybox": "indoor", "ground": "tile"}}',
    ARRAY['chemistry', 'lab', 'science'],
    false
),
(
    'Medical Operating Room',
    'Fully equipped surgical suite',
    'medical',
    'medical',
    '{"objects": [{"type": "operating_table", "position": [0, 0, 0]}, {"type": "surgical_lights", "position": [0, 3, 0]}, {"type": "monitor", "position": [2, 1.5, 0]}], "lights": [{"type": "ambient", "intensity": 0.8}, {"type": "spot", "position": [0, 3, 0], "intensity": 1.0}], "cameras": [{"type": "perspective", "position": [0, 1.6, 4]}], "environment": {"skybox": "hospital", "ground": "medical_floor"}}',
    ARRAY['medical', 'surgery', 'hospital'],
    true
),
(
    'Physics Classroom',
    'Interactive physics demonstration space',
    'classroom',
    'science',
    '{"objects": [{"type": "whiteboard", "position": [0, 1.5, -3]}, {"type": "desks", "position": [0, 0, 0]}, {"type": "physics_equipment", "position": [2, 1, -2]}], "lights": [{"type": "ambient", "intensity": 0.6}, {"type": "directional", "position": [0, 5, 0]}], "cameras": [{"type": "perspective", "position": [0, 1.6, 5]}], "environment": {"skybox": "classroom", "ground": "wood_floor"}}',
    ARRAY['physics', 'education', 'classroom'],
    false
),
(
    'Historical Museum Hall',
    'Museum gallery for historical artifacts',
    'museum',
    'history',
    '{"objects": [{"type": "display_cases", "position": [0, 0, 0]}, {"type": "paintings", "position": [-3, 2, 0]}, {"type": "sculptures", "position": [3, 0, 0]}], "lights": [{"type": "ambient", "intensity": 0.4}, {"type": "spot", "position": [0, 4, 0], "intensity": 0.8}], "cameras": [{"type": "perspective", "position": [0, 1.6, 8]}], "environment": {"skybox": "museum", "ground": "marble"}}',
    ARRAY['history', 'museum', 'artifacts'],
    false
),
(
    'Engineering Workshop',
    'CAD design and prototyping space',
    'workshop',
    'engineering',
    '{"objects": [{"type": "workstation", "position": [0, 0, 0]}, {"type": "tools", "position": [2, 1, 0]}, {"type": "3d_printer", "position": [-2, 0.5, 0]}], "lights": [{"type": "ambient", "intensity": 0.7}, {"type": "directional", "position": [5, 5, 5]}], "cameras": [{"type": "perspective", "position": [0, 1.6, 5]}], "environment": {"skybox": "workshop", "ground": "concrete"}}',
    ARRAY['engineering', 'design', 'manufacturing'],
    true
),
(
    'Outdoor Nature Scene',
    'Natural environment for environmental science',
    'outdoor',
    'environmental',
    '{"objects": [{"type": "trees", "position": [5, 0, 5]}, {"type": "rocks", "position": [-3, 0, 2]}, {"type": "water", "position": [0, 0, -5]}], "lights": [{"type": "ambient", "intensity": 0.8}, {"type": "directional", "position": [10, 10, 10], "intensity": 1.0}], "cameras": [{"type": "perspective", "position": [0, 1.6, 10]}], "environment": {"skybox": "nature", "ground": "grass"}}',
    ARRAY['nature', 'environment', 'ecology'],
    false
),
(
    'Space Station Interior',
    'Zero-gravity space environment',
    'space',
    'science',
    '{"objects": [{"type": "modules", "position": [0, 0, 0]}, {"type": "controls", "position": [0, 1.5, -2]}, {"type": "windows", "position": [3, 1, 0]}], "lights": [{"type": "ambient", "intensity": 0.3}, {"type": "point", "position": [0, 2, 0], "intensity": 0.9}], "cameras": [{"type": "perspective", "position": [0, 1.6, 5]}], "environment": {"skybox": "space", "ground": "metal"}}',
    ARRAY['space', 'astronomy', 'physics'],
    true
)
ON CONFLICT DO NOTHING;

-- Update existing experiences with categories (sample data)
UPDATE xr_experiences SET category = 'science' WHERE lab_subject = 'chemistry';
UPDATE xr_experiences SET category = 'science' WHERE lab_subject = 'physics';
UPDATE xr_experiences SET category = 'medical' WHERE lab_subject = 'anatomy';
UPDATE xr_experiences SET category = 'science' WHERE lab_subject = 'biology';
UPDATE xr_experiences SET category = 'engineering' WHERE lab_subject = 'engineering';

-- =====================================================
-- SCHEDULED JOBS (using pg_cron if available)
-- =====================================================

-- Create a function to be called by cron
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS VOID AS $$
BEGIN
    INSERT INTO xr_dashboard_analytics (
        date,
        active_simulations,
        total_users,
        avg_engagement_percentage,
        total_vr_sessions,
        avg_session_duration_minutes,
        completion_rate_percentage
    )
    SELECT
        CURRENT_DATE,
        active_simulations,
        total_users,
        avg_engagement,
        total_sessions,
        avg_session_duration,
        completion_rate
    FROM v_dashboard_stats
    ON CONFLICT (date) DO UPDATE SET
        active_simulations = EXCLUDED.active_simulations,
        total_users = EXCLUDED.total_users,
        avg_engagement_percentage = EXCLUDED.avg_engagement_percentage,
        total_vr_sessions = EXCLUDED.total_vr_sessions,
        avg_session_duration_minutes = EXCLUDED.avg_session_duration_minutes,
        completion_rate_percentage = EXCLUDED.completion_rate_percentage,
        updated_at = NOW();

    -- Refresh materialized views
    PERFORM refresh_xr_analytics();
END;
$$ LANGUAGE plpgsql;

-- If pg_cron is available:
-- SELECT cron.schedule('refresh-xr-analytics', '*/5 * * * *', 'SELECT refresh_xr_analytics()');
-- SELECT cron.schedule('update-daily-analytics', '0 0 * * *', 'SELECT update_daily_analytics()');

-- =====================================================
-- GRANTS & PERMISSIONS
-- =====================================================

-- Grant permissions (adjust role names as needed)
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;

-- =====================================================
-- COMPLETION
-- =====================================================

-- Initial refresh of materialized views
REFRESH MATERIALIZED VIEW v_dashboard_stats;
REFRESH MATERIALIZED VIEW v_simulation_cards;

-- Display summary
DO $$
BEGIN
    RAISE NOTICE '✅ XR Labs Enhancement Migration Complete!';
    RAISE NOTICE '📊 Added tables: 8';
    RAISE NOTICE '📈 Added views: 2';
    RAISE NOTICE '⚙️ Added functions: 7';
    RAISE NOTICE '🎨 Seeded categories: 12';
    RAISE NOTICE '📐 Seeded templates: 7';
END $$;
