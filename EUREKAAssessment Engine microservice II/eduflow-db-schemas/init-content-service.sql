-- =====================================================
-- EduFlow Platform - Content Service Database Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTENT LIBRARY
-- =====================================================

CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('video', 'article', 'document', 'interactive', 'simulation', 'podcast', 'infographic', 'ebook')),
    format VARCHAR(50), -- mp4, pdf, html, scorm, etc.
    tier VARCHAR(50),
    subject VARCHAR(100),
    topics TEXT[],
    difficulty_level VARCHAR(50),
    
    -- File Information
    file_url TEXT,
    file_size_bytes BIGINT,
    duration_seconds INTEGER, -- For videos/audio
    page_count INTEGER, -- For documents
    
    -- Metadata
    author VARCHAR(255),
    publisher VARCHAR(255),
    publication_date DATE,
    isbn VARCHAR(20),
    doi VARCHAR(100),
    license VARCHAR(100),
    copyright_info TEXT,
    
    -- Learning Objectives
    learning_objectives TEXT[],
    prerequisites TEXT[],
    bloom_taxonomy_levels TEXT[],
    
    -- Quality Metrics
    quality_rating DECIMAL(3,2),
    review_status VARCHAR(50) CHECK (review_status IN ('draft', 'pending_review', 'approved', 'rejected', 'archived')),
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    ratings_count INTEGER DEFAULT 0,
    
    -- Access Control
    is_public BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    access_tiers TEXT[],
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MULTIMEDIA ASSETS
-- =====================================================

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    asset_type VARCHAR(50) CHECK (asset_type IN ('thumbnail', 'preview', 'transcript', 'subtitle', 'chapter', 'attachment')),
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    language VARCHAR(10),
    
    -- For video chapters/timestamps
    start_time_seconds INTEGER,
    end_time_seconds INTEGER,
    chapter_title VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE video_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_asset_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
    
    start_time DECIMAL(10,3) NOT NULL,
    end_time DECIMAL(10,3) NOT NULL,
    segment_type VARCHAR(50) CHECK (segment_type IN ('intro', 'content', 'example', 'exercise', 'summary', 'outro')),
    title VARCHAR(255),
    description TEXT,
    keywords TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTENT COLLECTIONS
-- =====================================================

CREATE TABLE content_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    collection_type VARCHAR(50) CHECK (collection_type IN ('playlist', 'bundle', 'series', 'curriculum', 'reading_list')),
    tier VARCHAR(50),
    subject VARCHAR(100),
    
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    is_curated BOOLEAN DEFAULT false,
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES content_collections(id) ON DELETE CASCADE,
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    notes TEXT,
    UNIQUE(collection_id, content_item_id)
);

-- =====================================================
-- USER INTERACTIONS
-- =====================================================

CREATE TABLE content_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    position_timestamp DECIMAL(10,3), -- For videos
    page_number INTEGER, -- For documents
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_item_id)
);

CREATE TABLE content_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    helpful_count INTEGER DEFAULT 0,
    reported BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_item_id)
);

CREATE TABLE content_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    session_id VARCHAR(100),
    
    view_duration_seconds INTEGER,
    completion_percentage DECIMAL(5,2),
    last_position DECIMAL(10,3), -- Last watched/read position
    
    device_type VARCHAR(50),
    referrer TEXT,
    
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTENT RECOMMENDATIONS
-- =====================================================

CREATE TABLE content_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    recommendation_source VARCHAR(50) CHECK (recommendation_source IN ('ai', 'instructor', 'peer', 'trending', 'related')),
    relevance_score DECIMAL(5,2),
    reasoning TEXT,
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'saved', 'dismissed')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);

-- =====================================================
-- EXTERNAL INTEGRATIONS
-- =====================================================

CREATE TABLE external_content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) CHECK (source_type IN ('youtube', 'vimeo', 'coursera', 'khan_academy', 'mit_ocw', 'library', 'publisher')),
    api_endpoint TEXT,
    api_key_encrypted TEXT,
    sync_frequency VARCHAR(50),
    last_sync TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE external_content_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    source_id UUID REFERENCES external_content_sources(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL,
    external_url TEXT,
    sync_status VARCHAR(50) CHECK (sync_status IN ('synced', 'pending', 'failed', 'outdated')),
    last_synced TIMESTAMP,
    UNIQUE(source_id, external_id)
);

-- =====================================================
-- CONTENT GENERATION (AI)
-- =====================================================

CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    generation_type VARCHAR(50) CHECK (generation_type IN ('summary', 'transcript', 'quiz', 'flashcards', 'study_guide', 'notes')),
    source_content TEXT,
    generated_content TEXT,
    
    -- AI Model Info
    model_used VARCHAR(100),
    prompt_used TEXT,
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    generation_time_ms INTEGER,
    
    -- Quality
    quality_score DECIMAL(5,2),
    human_reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID,
    approved BOOLEAN,
    
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_generator_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    question_count INTEGER DEFAULT 5,
    difficulty_distribution JSONB, -- {easy: 2, medium: 2, hard: 1}
    question_types TEXT[], -- ['multiple_choice', 'true_false', 'short_answer']
    focus_areas TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACCESSIBILITY
-- =====================================================

CREATE TABLE accessibility_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    feature_type VARCHAR(50) CHECK (feature_type IN ('captions', 'audio_description', 'transcript', 'sign_language', 'alt_text', 'screen_reader')),
    language VARCHAR(10),
    file_url TEXT,
    quality VARCHAR(50) CHECK (quality IN ('auto_generated', 'human_reviewed', 'professional')),
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTENT VERSIONING
-- =====================================================

CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    version_number VARCHAR(20) NOT NULL,
    change_summary TEXT,
    file_url TEXT,
    is_current BOOLEAN DEFAULT false,
    
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_item_id, version_number)
);

-- =====================================================
-- CONTENT ANALYTICS
-- =====================================================

CREATE TABLE content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    average_watch_time_seconds INTEGER,
    completion_rate DECIMAL(5,2),
    
    -- Retention
    retention_at_25_percent DECIMAL(5,2),
    retention_at_50_percent DECIMAL(5,2),
    retention_at_75_percent DECIMAL(5,2),
    retention_at_100_percent DECIMAL(5,2),
    
    -- Interaction
    bookmarks_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    
    -- Quality
    average_rating DECIMAL(3,2),
    new_ratings_count INTEGER DEFAULT 0,
    
    UNIQUE(content_item_id, metric_date)
);

CREATE TABLE drop_off_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    timestamp_seconds INTEGER NOT NULL,
    viewers_remaining INTEGER,
    drop_off_rate DECIMAL(5,2),
    
    analysis_date DATE NOT NULL,
    UNIQUE(content_item_id, timestamp_seconds, analysis_date)
);

-- =====================================================
-- LICENSING & RIGHTS
-- =====================================================

CREATE TABLE content_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    
    license_type VARCHAR(50) CHECK (license_type IN ('public_domain', 'creative_commons', 'fair_use', 'purchased', 'subscription', 'custom')),
    license_details TEXT,
    rights_holder VARCHAR(255),
    
    usage_restrictions TEXT[],
    attribution_required BOOLEAN DEFAULT false,
    commercial_use_allowed BOOLEAN DEFAULT false,
    derivative_works_allowed BOOLEAN DEFAULT false,
    
    acquired_date DATE,
    expiry_date DATE,
    cost_usd DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TAGS & TAXONOMY
-- =====================================================

CREATE TABLE content_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_name VARCHAR(100) UNIQUE NOT NULL,
    tag_category VARCHAR(50) CHECK (tag_category IN ('subject', 'topic', 'skill', 'format', 'difficulty', 'audience')),
    parent_tag_id UUID REFERENCES content_tags(id),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_tag_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES content_tags(id) ON DELETE CASCADE,
    relevance_score DECIMAL(5,2) DEFAULT 100.00,
    UNIQUE(content_item_id, tag_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_content_items_tier ON content_items(tier);
CREATE INDEX idx_content_items_subject ON content_items(subject);
CREATE INDEX idx_content_items_type ON content_items(content_type);
CREATE INDEX idx_content_items_public ON content_items(is_public);
CREATE INDEX idx_media_assets_content_id ON media_assets(content_item_id);
CREATE INDEX idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX idx_content_bookmarks_user_id ON content_bookmarks(user_id);
CREATE INDEX idx_content_ratings_content_id ON content_ratings(content_item_id);
CREATE INDEX idx_content_views_user_id ON content_views(user_id);
CREATE INDEX idx_content_views_content_id ON content_views(content_item_id);
CREATE INDEX idx_content_recommendations_user_id ON content_recommendations(user_id);
CREATE INDEX idx_external_mappings_content_id ON external_content_mappings(content_item_id);
CREATE INDEX idx_content_performance_content_id ON content_performance(content_item_id);
CREATE INDEX idx_content_tags_category ON content_tags(tag_category);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_collections_updated_at BEFORE UPDATE ON content_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
