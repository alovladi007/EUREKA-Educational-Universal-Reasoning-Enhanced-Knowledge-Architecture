-- =====================================================
-- EUREKA XR Labs - Extended Reality Database Schema
-- =====================================================
-- Supports VR, AR, MR experiences for education
-- Features: Virtual Labs, 3D Models, Simulations, Collaborative VR
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For spatial data
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For search

-- =====================================================
-- XR CONTENT TYPES
-- =====================================================

CREATE TYPE xr_experience_type AS ENUM (
    'vr_lab',           -- Virtual Reality laboratory
    'ar_overlay',       -- Augmented Reality overlay
    'mixed_reality',    -- Mixed Reality experience
    '3d_model',         -- 3D model viewer
    'simulation',       -- Interactive simulation
    'virtual_tour',     -- Virtual campus/facility tour
    '360_video',        -- 360-degree video
    'hologram'          -- Holographic display
);

CREATE TYPE lab_subject AS ENUM (
    'chemistry',
    'physics',
    'biology',
    'anatomy',
    'engineering',
    'astronomy',
    'geology',
    'environmental_science',
    'mathematics',
    'computer_science'
);

CREATE TYPE xr_device_type AS ENUM (
    'meta_quest',
    'htc_vive',
    'valve_index',
    'pico',
    'web_browser',
    'mobile_ar',
    'hololens',
    'magic_leap'
);

CREATE TYPE interaction_mode AS ENUM (
    'view_only',
    'interactive',
    'hands_on',
    'collaborative',
    'guided',
    'free_explore'
);

-- =====================================================
-- XR EXPERIENCES
-- =====================================================

CREATE TABLE xr_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    experience_type xr_experience_type NOT NULL,
    lab_subject lab_subject,

    -- Difficulty & Prerequisites
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    prerequisites TEXT[],
    learning_objectives TEXT[],

    -- Content Details
    duration_minutes INTEGER,
    interaction_mode interaction_mode NOT NULL,
    max_concurrent_users INTEGER DEFAULT 1,

    -- Technical Requirements
    supported_devices xr_device_type[] NOT NULL,
    min_space_sqm DECIMAL(5,2), -- Minimum physical space required
    requires_controllers BOOLEAN DEFAULT FALSE,
    requires_hand_tracking BOOLEAN DEFAULT FALSE,

    -- Assets
    thumbnail_url VARCHAR(500),
    preview_video_url VARCHAR(500),
    scene_file_url VARCHAR(500) NOT NULL, -- Main scene file (GLB, GLTF, etc.)
    scene_file_size_mb DECIMAL(10,2),

    -- Metadata
    tags TEXT[],
    keywords TEXT[],

    -- Safety & Comfort
    motion_intensity VARCHAR(50) CHECK (motion_intensity IN ('comfortable', 'moderate', 'intense')),
    comfort_rating DECIMAL(3,2), -- 0-5 stars
    safety_warnings TEXT[],

    -- Educational Value
    educational_value_score DECIMAL(3,2),
    engagement_score DECIMAL(3,2),

    -- Usage Statistics
    total_launches INTEGER DEFAULT 0,
    total_completion_count INTEGER DEFAULT 0,
    average_completion_time INTEGER, -- minutes
    average_rating DECIMAL(3,2),
    ratings_count INTEGER DEFAULT 0,

    -- Publishing
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Versioning
    version VARCHAR(20) DEFAULT '1.0.0',

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_xr_experiences_type ON xr_experiences(experience_type);
CREATE INDEX idx_xr_experiences_subject ON xr_experiences(lab_subject);
CREATE INDEX idx_xr_experiences_difficulty ON xr_experiences(difficulty_level);
CREATE INDEX idx_xr_experiences_published ON xr_experiences(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_xr_experiences_featured ON xr_experiences(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_xr_experiences_search ON xr_experiences USING gin(to_tsvector('english', title || ' ' || description));

-- =====================================================
-- 3D ASSET LIBRARY
-- =====================================================

CREATE TABLE xr_3d_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Asset Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'molecule', 'organ', 'equipment', 'building', etc.
    subject lab_subject,

    -- File Details
    file_format VARCHAR(20) NOT NULL, -- 'glb', 'gltf', 'fbx', 'obj', 'usdz'
    file_url VARCHAR(500) NOT NULL,
    file_size_mb DECIMAL(10,2),

    -- 3D Properties
    polygon_count INTEGER,
    texture_resolution VARCHAR(50), -- '1024x1024', '2048x2048', '4096x4096'
    has_animations BOOLEAN DEFAULT FALSE,
    animation_count INTEGER DEFAULT 0,
    has_physics BOOLEAN DEFAULT FALSE,

    -- Optimization
    is_optimized_mobile BOOLEAN DEFAULT FALSE,
    lod_levels INTEGER DEFAULT 1, -- Level of Detail count

    -- Textures & Materials
    texture_urls JSONB DEFAULT '[]', -- Array of texture URLs
    material_count INTEGER DEFAULT 1,
    uses_pbr BOOLEAN DEFAULT TRUE, -- Physically Based Rendering

    -- Metadata
    tags TEXT[],
    scientific_accuracy_score DECIMAL(3,2),

    -- Licensing
    license_type VARCHAR(100),
    attribution_required BOOLEAN DEFAULT FALSE,
    creator_name VARCHAR(255),
    source_url VARCHAR(500),

    -- Usage
    times_used INTEGER DEFAULT 0,

    -- Thumbnails
    thumbnail_url VARCHAR(500),
    preview_images TEXT[],

    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_3d_assets_category ON xr_3d_assets(category);
CREATE INDEX idx_3d_assets_subject ON xr_3d_assets(subject);
CREATE INDEX idx_3d_assets_format ON xr_3d_assets(file_format);
CREATE INDEX idx_3d_assets_public ON xr_3d_assets(is_public) WHERE is_public = TRUE;

-- =====================================================
-- VIRTUAL LAB ENVIRONMENTS
-- =====================================================

CREATE TABLE virtual_labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID REFERENCES xr_experiences(id) ON DELETE CASCADE,

    -- Lab Details
    lab_name VARCHAR(255) NOT NULL,
    lab_type VARCHAR(100) NOT NULL, -- 'chemistry_lab', 'physics_lab', 'biology_lab', etc.
    lab_subject lab_subject NOT NULL,

    -- Environment
    environment_description TEXT,
    room_dimensions JSONB, -- {width, height, depth} in meters
    lighting_setup VARCHAR(100), -- 'daylight', 'lab_lighting', 'dark', etc.

    -- Equipment & Tools
    available_equipment JSONB NOT NULL, -- Array of equipment with positions
    interactive_objects JSONB, -- Objects that can be manipulated

    -- Experiments
    supported_experiments TEXT[],
    safety_equipment JSONB, -- Gloves, goggles, etc.
    hazardous_materials TEXT[],

    -- Interactions
    allows_mixing BOOLEAN DEFAULT FALSE,
    allows_heating BOOLEAN DEFAULT FALSE,
    allows_measurement BOOLEAN DEFAULT FALSE,
    physics_simulation BOOLEAN DEFAULT FALSE,

    -- Collaboration
    supports_multiplayer BOOLEAN DEFAULT FALSE,
    max_users_concurrent INTEGER DEFAULT 1,

    -- Performance
    target_fps INTEGER DEFAULT 90,
    recommended_gpu VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_virtual_labs_type ON virtual_labs(lab_type);
CREATE INDEX idx_virtual_labs_subject ON virtual_labs(lab_subject);
CREATE INDEX idx_virtual_labs_experience ON virtual_labs(experience_id);

-- =====================================================
-- XR SIMULATIONS
-- =====================================================

CREATE TABLE xr_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID REFERENCES xr_experiences(id) ON DELETE CASCADE,

    -- Simulation Info
    simulation_name VARCHAR(255) NOT NULL,
    simulation_type VARCHAR(100), -- 'molecular', 'physics', 'anatomical', 'astronomical'

    -- Physics/Chemistry Engine
    uses_physics_engine BOOLEAN DEFAULT FALSE,
    physics_engine VARCHAR(50), -- 'rapier', 'ammo.js', 'cannon.js'
    simulation_accuracy VARCHAR(50) CHECK (simulation_accuracy IN ('educational', 'research_grade', 'high_fidelity')),

    -- Parameters
    configurable_parameters JSONB, -- User-adjustable parameters
    default_values JSONB,
    parameter_ranges JSONB, -- Min/max values for each parameter

    -- Real-time Calculations
    performs_calculations BOOLEAN DEFAULT FALSE,
    calculation_frequency INTEGER, -- Times per second

    -- Visualizations
    visualization_types TEXT[], -- 'graph', 'heatmap', 'vector_field', '3d_plot'
    data_export_formats TEXT[], -- 'csv', 'json', 'excel'

    -- Scenarios
    predefined_scenarios JSONB, -- Array of scenarios
    supports_custom_scenarios BOOLEAN DEFAULT FALSE,

    -- Educational Features
    shows_formulas BOOLEAN DEFAULT TRUE,
    step_by_step_mode BOOLEAN DEFAULT FALSE,
    hints_available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_simulations_type ON xr_simulations(simulation_type);
CREATE INDEX idx_simulations_experience ON xr_simulations(experience_id);

-- =====================================================
-- AR MARKERS & TARGETS
-- =====================================================

CREATE TABLE ar_markers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID REFERENCES xr_experiences(id) ON DELETE CASCADE,

    -- Marker Info
    marker_name VARCHAR(255) NOT NULL,
    marker_type VARCHAR(50) CHECK (marker_type IN ('image', 'qr_code', 'nft', 'face', 'body', 'surface')),

    -- Image Marker
    marker_image_url VARCHAR(500),
    marker_pattern_file VARCHAR(500), -- For AR.js or similar

    -- Detection
    detection_confidence_threshold DECIMAL(3,2) DEFAULT 0.80,
    tracking_quality VARCHAR(50) CHECK (tracking_quality IN ('low', 'medium', 'high')),

    -- Content Triggered
    triggered_content JSONB, -- 3D models, videos, info cards
    content_scale DECIMAL(5,2) DEFAULT 1.0,
    content_rotation JSONB, -- {x, y, z} rotation in degrees
    content_offset JSONB, -- {x, y, z} offset in meters

    -- Behavior
    auto_activate BOOLEAN DEFAULT TRUE,
    persistent BOOLEAN DEFAULT FALSE, -- Stays after marker is lost

    -- Educational Content
    display_info_card BOOLEAN DEFAULT FALSE,
    info_card_content TEXT,
    related_lessons TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ar_markers_experience ON ar_markers(experience_id);
CREATE INDEX idx_ar_markers_type ON ar_markers(marker_type);

-- =====================================================
-- USER XR SESSIONS
-- =====================================================

CREATE TABLE xr_user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_id UUID NOT NULL REFERENCES xr_experiences(id) ON DELETE CASCADE,

    -- Session Details
    device_type xr_device_type NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    duration_seconds INTEGER,

    -- Completion
    completed BOOLEAN DEFAULT FALSE,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,

    -- Performance Metrics
    average_fps DECIMAL(5,2),
    frame_drops_count INTEGER DEFAULT 0,
    latency_ms INTEGER,

    -- User Activity
    interactions_count INTEGER DEFAULT 0,
    objects_manipulated INTEGER DEFAULT 0,
    experiments_completed INTEGER DEFAULT 0,

    -- Learning Outcomes
    objectives_achieved TEXT[],
    quiz_score DECIMAL(5,2),
    mistakes_made INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,

    -- Comfort & Safety
    comfort_breaks_taken INTEGER DEFAULT 0,
    motion_sickness_reported BOOLEAN DEFAULT FALSE,

    -- Data Collected
    session_data JSONB, -- Detailed interaction data
    screenshots_urls TEXT[],

    -- Ratings
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    feedback TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_xr_sessions_user ON xr_user_sessions(user_id);
CREATE INDEX idx_xr_sessions_experience ON xr_user_sessions(experience_id);
CREATE INDEX idx_xr_sessions_completed ON xr_user_sessions(completed);
CREATE INDEX idx_xr_sessions_start ON xr_user_sessions(session_start);

-- =====================================================
-- XR ACHIEVEMENTS & BADGES
-- =====================================================

CREATE TABLE xr_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Achievement Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),

    -- Criteria
    achievement_type VARCHAR(100), -- 'complete_lab', 'perfect_score', 'speed_run', etc.
    criteria JSONB NOT NULL, -- Specific requirements

    -- Rewards
    points_awarded INTEGER DEFAULT 0,
    unlocks_content UUID[], -- Experience IDs unlocked

    -- Rarity
    rarity VARCHAR(50) CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),

    -- Statistics
    times_earned INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE xr_user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES xr_achievements(id) ON DELETE CASCADE,

    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id UUID REFERENCES xr_user_sessions(id),

    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON xr_user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON xr_user_achievements(achievement_id);

-- =====================================================
-- COLLABORATIVE VR ROOMS
-- =====================================================

CREATE TABLE vr_collaborative_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES xr_experiences(id) ON DELETE CASCADE,

    -- Room Details
    room_name VARCHAR(255) NOT NULL,
    room_code VARCHAR(20) UNIQUE NOT NULL, -- Join code

    -- Host
    host_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Capacity
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,

    -- Settings
    is_private BOOLEAN DEFAULT FALSE,
    password_protected BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),

    -- Voice/Communication
    voice_chat_enabled BOOLEAN DEFAULT TRUE,
    text_chat_enabled BOOLEAN DEFAULT TRUE,

    -- Session State
    is_active BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,

    -- Shared State
    shared_state JSONB, -- Current state of the lab/simulation

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vr_room_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES vr_collaborative_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Participant Info
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'participant' CHECK (role IN ('host', 'participant', 'observer')),

    -- Status
    is_connected BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,

    -- Position in VR
    last_position JSONB, -- {x, y, z}
    last_rotation JSONB, -- {x, y, z}

    CONSTRAINT unique_room_participant UNIQUE(room_id, user_id)
);

CREATE INDEX idx_vr_rooms_experience ON vr_collaborative_rooms(experience_id);
CREATE INDEX idx_vr_rooms_active ON vr_collaborative_rooms(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_vr_rooms_code ON vr_collaborative_rooms(room_code);
CREATE INDEX idx_room_participants_room ON vr_room_participants(room_id);
CREATE INDEX idx_room_participants_user ON vr_room_participants(user_id);

-- =====================================================
-- XR CONTENT PLAYLISTS
-- =====================================================

CREATE TABLE xr_playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Playlist Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),

    -- Content
    lab_subject lab_subject,
    difficulty_progression VARCHAR(50) CHECK (difficulty_progression IN ('beginner_to_advanced', 'same_level', 'mixed')),

    -- Metadata
    estimated_duration_minutes INTEGER,

    -- Publishing
    is_public BOOLEAN DEFAULT FALSE,
    is_curated BOOLEAN DEFAULT FALSE, -- Curated by instructors

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE xr_playlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES xr_playlists(id) ON DELETE CASCADE,
    experience_id UUID NOT NULL REFERENCES xr_experiences(id) ON DELETE CASCADE,

    order_index INTEGER NOT NULL,
    notes TEXT,

    CONSTRAINT unique_playlist_item UNIQUE(playlist_id, experience_id)
);

CREATE INDEX idx_playlist_items_playlist ON xr_playlist_items(playlist_id);
CREATE INDEX idx_playlists_subject ON xr_playlists(lab_subject);
CREATE INDEX idx_playlists_public ON xr_playlists(is_public) WHERE is_public = TRUE;

-- =====================================================
-- XR ANALYTICS
-- =====================================================

CREATE TABLE xr_analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    experience_id UUID REFERENCES xr_experiences(id) ON DELETE CASCADE,

    -- Usage Metrics
    total_sessions INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    average_session_duration INTEGER,

    -- Completion
    completion_rate DECIMAL(5,2),
    average_completion_time INTEGER,

    -- Performance
    average_fps DECIMAL(5,2),
    average_latency_ms INTEGER,
    crash_count INTEGER DEFAULT 0,

    -- Device Distribution
    device_breakdown JSONB, -- {meta_quest: 50, web_browser: 30, etc.}

    -- Engagement
    average_interactions INTEGER,
    average_rating DECIMAL(3,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_daily_analytics UNIQUE(date, experience_id)
);

CREATE INDEX idx_analytics_date ON xr_analytics_daily(date);
CREATE INDEX idx_analytics_experience ON xr_analytics_daily(experience_id);

-- =====================================================
-- XR EQUIPMENT TRACKING (Physical Devices)
-- =====================================================

CREATE TABLE xr_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Device Info
    device_type xr_device_type NOT NULL,
    device_model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,

    -- Status
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
    condition VARCHAR(50) CHECK (condition IN ('excellent', 'good', 'fair', 'needs_repair')),

    -- Location
    location VARCHAR(255), -- 'Lab 101', 'Storage Room A'

    -- Checkout System
    checked_out_by UUID REFERENCES users(id),
    checked_out_at TIMESTAMP,
    due_back_at TIMESTAMP,

    -- Maintenance
    last_maintenance TIMESTAMP,
    next_maintenance_due TIMESTAMP,
    maintenance_notes TEXT,

    -- Accessories
    has_controllers BOOLEAN DEFAULT TRUE,
    controller_count INTEGER DEFAULT 2,
    has_charging_cable BOOLEAN DEFAULT TRUE,
    has_carrying_case BOOLEAN DEFAULT FALSE,

    -- Usage
    total_hours_used DECIMAL(10,2) DEFAULT 0.00,
    times_checked_out INTEGER DEFAULT 0,

    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    warranty_expires DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipment_status ON xr_equipment(status);
CREATE INDEX idx_equipment_type ON xr_equipment(device_type);
CREATE INDEX idx_equipment_checked_out ON xr_equipment(checked_out_by);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_xr_experiences_updated_at
    BEFORE UPDATE ON xr_experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_3d_assets_updated_at
    BEFORE UPDATE ON xr_3d_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_virtual_labs_updated_at
    BEFORE UPDATE ON virtual_labs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_xr_playlists_updated_at
    BEFORE UPDATE ON xr_playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_xr_equipment_updated_at
    BEFORE UPDATE ON xr_equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update session duration on end
CREATE OR REPLACE FUNCTION calculate_xr_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.session_end IS NOT NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.session_end - NEW.session_start));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_session_duration_trigger
    BEFORE UPDATE ON xr_user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_xr_session_duration();

-- Update experience launch count
CREATE OR REPLACE FUNCTION increment_experience_launches()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE xr_experiences
    SET total_launches = total_launches + 1
    WHERE id = NEW.experience_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_launches_trigger
    AFTER INSERT ON xr_user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION increment_experience_launches();

-- =====================================================
-- VIEWS
-- =====================================================

-- Popular XR Experiences
CREATE OR REPLACE VIEW v_popular_xr_experiences AS
SELECT
    e.id,
    e.title,
    e.experience_type,
    e.lab_subject,
    e.difficulty_level,
    e.total_launches,
    e.average_rating,
    e.ratings_count,
    COUNT(DISTINCT s.user_id) as unique_users,
    AVG(s.duration_seconds) as avg_duration_seconds,
    AVG(s.completion_percentage) as avg_completion_rate
FROM xr_experiences e
LEFT JOIN xr_user_sessions s ON e.id = s.experience_id
WHERE e.is_published = TRUE
GROUP BY e.id
ORDER BY e.total_launches DESC;

-- User XR Progress
CREATE OR REPLACE VIEW v_user_xr_progress AS
SELECT
    u.id as user_id,
    u.email,
    COUNT(DISTINCT s.experience_id) as experiences_tried,
    SUM(s.duration_seconds) as total_time_seconds,
    AVG(s.completion_percentage) as avg_completion_rate,
    COUNT(DISTINCT ua.achievement_id) as achievements_earned,
    COUNT(DISTINCT CASE WHEN s.completed THEN s.experience_id END) as experiences_completed
FROM users u
LEFT JOIN xr_user_sessions s ON u.id = s.user_id
LEFT JOIN xr_user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.email;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Chemistry Lab Experience
INSERT INTO xr_experiences (
    title, description, experience_type, lab_subject,
    difficulty_level, interaction_mode, supported_devices,
    duration_minutes, scene_file_url, motion_intensity, is_published
) VALUES (
    'Virtual Chemistry Lab - Basic Reactions',
    'Explore chemical reactions safely in VR. Mix compounds, observe reactions, and learn chemistry fundamentals.',
    'vr_lab',
    'chemistry',
    'beginner',
    'hands_on',
    ARRAY['meta_quest', 'htc_vive', 'web_browser']::xr_device_type[],
    30,
    '/assets/xr/labs/chemistry_basic.glb',
    'comfortable',
    TRUE
),
(
    'Human Anatomy Explorer AR',
    'Point your device at the AR marker to see a 3D human body. Explore organs, systems, and learn anatomy.',
    'ar_overlay',
    'anatomy',
    'intermediate',
    'interactive',
    ARRAY['mobile_ar', 'web_browser']::xr_device_type[],
    20,
    '/assets/xr/models/human_anatomy.glb',
    'comfortable',
    TRUE
),
(
    'Physics Simulation - Projectile Motion',
    'Interactive physics simulation. Adjust launch angle, velocity, and see real-time trajectory calculations.',
    'simulation',
    'physics',
    'intermediate',
    'interactive',
    ARRAY['web_browser', 'meta_quest']::xr_device_type[],
    15,
    '/assets/xr/simulations/projectile.glb',
    'comfortable',
    TRUE
);

-- 3D Assets
INSERT INTO xr_3d_assets (
    name, description, category, subject,
    file_format, file_url, polygon_count, has_animations
) VALUES (
    'Water Molecule H2O',
    'Accurate 3D model of water molecule showing atomic structure',
    'molecule',
    'chemistry',
    'glb',
    '/assets/3d/molecules/h2o.glb',
    5000,
    TRUE
),
(
    'Human Heart',
    'Detailed anatomical model of human heart with beating animation',
    'organ',
    'anatomy',
    'glb',
    '/assets/3d/anatomy/heart.glb',
    50000,
    TRUE
),
(
    'Solar System',
    'Scale model of solar system with planetary orbits',
    'astronomical',
    'astronomy',
    'glb',
    '/assets/3d/astronomy/solar_system.glb',
    15000,
    TRUE
);

-- XR Achievements
INSERT INTO xr_achievements (
    name, description, achievement_type, criteria, points_awarded, rarity
) VALUES (
    'First Steps in VR',
    'Complete your first VR lab experience',
    'complete_lab',
    '{"experiences_completed": 1}',
    100,
    'common'
),
(
    'Chemistry Master',
    'Complete all chemistry labs with perfect scores',
    'perfect_score',
    '{"subject": "chemistry", "min_score": 100, "labs_count": 5}',
    500,
    'epic'
),
(
    'Speed Learner',
    'Complete a lab in under 10 minutes',
    'speed_run',
    '{"max_duration_minutes": 10}',
    250,
    'rare'
);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ XR Labs Database Schema Created Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '🥽 VR/AR Features: Ready for immersive learning';
    RAISE NOTICE '🧪 Virtual Labs: Chemistry, Physics, Biology, Anatomy';
    RAISE NOTICE '📱 AR Support: Mobile AR and web-based AR';
    RAISE NOTICE '🎮 Interactive Simulations: Physics, Chemistry, Astronomy';
    RAISE NOTICE '👥 Collaborative VR: Multi-user virtual rooms';
    RAISE NOTICE '🏆 Achievements: Gamified learning experience';
    RAISE NOTICE '📊 Analytics: Comprehensive usage tracking';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 XR Labs Platform Ready for Deployment!';
END $$;
