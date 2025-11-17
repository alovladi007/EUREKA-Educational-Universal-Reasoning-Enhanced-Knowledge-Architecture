-- =====================================================
-- Test Prep Platform - Subscription System
-- =====================================================
-- Adds subscription tiers for Test Prep platform with:
-- Option 1: Test Prep Videos+Notes OR QBank Only
-- Option 2: Bundle (Both Test Prep and QBank)
-- =====================================================

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SUBSCRIPTION PLANS
-- =====================================================

CREATE TYPE subscription_plan_type AS ENUM (
    'test_prep_only',        -- Videos + Notes only
    'qbank_only',            -- Question Bank only
    'complete_bundle'        -- Both Test Prep and QBank
);

CREATE TYPE billing_period AS ENUM ('monthly', 'quarterly', 'annually', 'lifetime');
CREATE TYPE exam_category AS ENUM ('MCAT', 'USMLE', 'LSAT', 'GRE', 'GMAT', 'FE', 'NCLEX', 'SAT', 'ACT');

CREATE TABLE IF NOT EXISTS test_prep_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Plan Details
    plan_name VARCHAR(255) NOT NULL,
    plan_type subscription_plan_type NOT NULL,
    exam_category exam_category NOT NULL,
    billing_period billing_period NOT NULL,

    -- Pricing
    price_usd DECIMAL(10,2) NOT NULL,
    original_price_usd DECIMAL(10,2), -- For showing discounts
    currency VARCHAR(3) DEFAULT 'USD',

    -- Features Access
    features JSONB NOT NULL DEFAULT '{
        "video_access": false,
        "notes_access": false,
        "qbank_access": false,
        "practice_exams": 0,
        "tutor_hours": 0,
        "analytics_access": false,
        "mobile_app": false,
        "downloadable_content": false,
        "live_sessions": false
    }',

    -- Limits
    question_bank_size INTEGER, -- Number of questions available
    video_hours DECIMAL(6,2),   -- Total hours of video content
    max_practice_exams INTEGER,
    concurrent_devices INTEGER DEFAULT 2,

    -- Stripe Integration
    stripe_price_id VARCHAR(255) UNIQUE,
    stripe_product_id VARCHAR(255),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,

    -- Marketing
    description TEXT,
    highlights TEXT[], -- ["Unlimited practice questions", "HD video lectures"]
    terms_conditions TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookups
CREATE INDEX idx_test_prep_plans_type ON test_prep_plans(plan_type);
CREATE INDEX idx_test_prep_plans_exam ON test_prep_plans(exam_category);
CREATE INDEX idx_test_prep_plans_active ON test_prep_plans(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_test_prep_plans_featured ON test_prep_plans(is_featured) WHERE is_featured = TRUE;

-- =====================================================
-- USER SUBSCRIPTIONS
-- =====================================================

CREATE TYPE subscription_status_type AS ENUM (
    'active',
    'cancelled',
    'expired',
    'suspended',
    'trial',
    'past_due'
);

CREATE TABLE IF NOT EXISTS test_prep_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES test_prep_plans(id) ON DELETE RESTRICT,

    -- Subscription Status
    status subscription_status_type DEFAULT 'active',

    -- Dates
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    cancelled_at TIMESTAMP,

    -- Billing
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,

    -- Usage Tracking
    usage_stats JSONB DEFAULT '{
        "videos_watched": 0,
        "questions_answered": 0,
        "practice_exams_taken": 0,
        "study_hours": 0,
        "last_activity": null
    }',

    -- Metadata
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_active_subscription UNIQUE(user_id, plan_id)
);

CREATE INDEX idx_subscriptions_user ON test_prep_subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON test_prep_subscriptions(plan_id);
CREATE INDEX idx_subscriptions_status ON test_prep_subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON test_prep_subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_active ON test_prep_subscriptions(user_id, status) WHERE status = 'active';

-- =====================================================
-- CONTENT PACKAGES (Groups of videos, notes, QBanks)
-- =====================================================

CREATE TABLE IF NOT EXISTS test_prep_content_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    package_name VARCHAR(255) NOT NULL,
    exam_category exam_category NOT NULL,
    package_type VARCHAR(50) NOT NULL CHECK (package_type IN ('videos', 'notes', 'qbank', 'practice_exam', 'bundle')),

    -- Content Organization
    subject VARCHAR(255), -- e.g., "Biology", "Organic Chemistry" for MCAT
    topic VARCHAR(255),   -- e.g., "Cell Biology", "Thermodynamics"

    -- Package Contents
    content_item_ids UUID[], -- References to content_items table
    question_bank_ids UUID[], -- References to question banks

    -- Metadata
    total_videos INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'comprehensive')),

    thumbnail_url VARCHAR(500),
    description TEXT,
    learning_objectives TEXT[],

    -- Access Control
    required_plan_types subscription_plan_type[],
    is_premium BOOLEAN DEFAULT TRUE,

    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_packages_exam ON test_prep_content_packages(exam_category);
CREATE INDEX idx_content_packages_type ON test_prep_content_packages(package_type);
CREATE INDEX idx_content_packages_active ON test_prep_content_packages(is_active) WHERE is_active = TRUE;

-- =====================================================
-- PAYMENT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS test_prep_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES test_prep_subscriptions(id) ON DELETE SET NULL,

    -- Payment Details
    amount_usd DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),

    -- Stripe
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),

    -- Invoice
    invoice_number VARCHAR(100) UNIQUE,
    invoice_url VARCHAR(500),
    receipt_url VARCHAR(500),

    -- Metadata
    payment_method VARCHAR(50), -- 'card', 'paypal', etc.
    failure_reason TEXT,
    refund_amount DECIMAL(10,2),
    refunded_at TIMESTAMP,

    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user ON test_prep_payments(user_id);
CREATE INDEX idx_payments_subscription ON test_prep_payments(subscription_id);
CREATE INDEX idx_payments_status ON test_prep_payments(payment_status);
CREATE INDEX idx_payments_stripe ON test_prep_payments(stripe_payment_intent_id);

-- =====================================================
-- STUDY PROGRESS TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS test_prep_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID REFERENCES test_prep_content_packages(id) ON DELETE CASCADE,

    -- Content Progress
    videos_completed UUID[] DEFAULT '{}',
    notes_reviewed UUID[] DEFAULT '{}',
    questions_answered UUID[] DEFAULT '{}',

    -- Statistics
    total_study_time_minutes INTEGER DEFAULT 0,
    videos_watched_count INTEGER DEFAULT 0,
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,

    -- Milestones
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_accessed_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Performance Tracking
    weak_areas TEXT[],
    strong_areas TEXT[],
    recommended_focus TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_package_progress UNIQUE(user_id, package_id)
);

CREATE INDEX idx_progress_user ON test_prep_progress(user_id);
CREATE INDEX idx_progress_package ON test_prep_progress(package_id);
CREATE INDEX idx_progress_completion ON test_prep_progress(completion_percentage);

-- =====================================================
-- VIDEO NOTES (User-generated notes while watching)
-- =====================================================

CREATE TABLE IF NOT EXISTS video_study_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL, -- References content_items

    -- Note Content
    note_text TEXT NOT NULL,
    timestamp_seconds DECIMAL(10,3), -- Video timestamp where note was taken

    -- Organization
    tags TEXT[],
    is_important BOOLEAN DEFAULT FALSE,
    color_code VARCHAR(20), -- For highlighting

    -- Sharing
    is_private BOOLEAN DEFAULT TRUE,
    shared_with_users UUID[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_video_notes_user ON video_study_notes(user_id);
CREATE INDEX idx_video_notes_content ON video_study_notes(content_item_id);
CREATE INDEX idx_video_notes_timestamp ON video_study_notes(timestamp_seconds);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_test_prep_plans_updated_at
    BEFORE UPDATE ON test_prep_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_prep_subscriptions_updated_at
    BEFORE UPDATE ON test_prep_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_packages_updated_at
    BEFORE UPDATE ON test_prep_content_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_prep_progress_updated_at
    BEFORE UPDATE ON test_prep_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_notes_updated_at
    BEFORE UPDATE ON video_study_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - Default Plans
-- =====================================================

-- MCAT Plans
INSERT INTO test_prep_plans (
    plan_name, plan_type, exam_category, billing_period,
    price_usd, original_price_usd, features, question_bank_size, video_hours, max_practice_exams,
    description, highlights, is_active, is_featured, display_order
) VALUES
-- Option 1a: Test Prep Only (Videos + Notes)
(
    'MCAT Test Prep - Video Course',
    'test_prep_only',
    'MCAT',
    'monthly',
    79.99,
    99.99,
    '{"video_access": true, "notes_access": true, "qbank_access": false, "practice_exams": 0, "tutor_hours": 0, "analytics_access": true, "mobile_app": true, "downloadable_content": true, "live_sessions": false}',
    NULL,
    120.0,
    0,
    'Comprehensive MCAT video lectures with detailed study notes covering all sections',
    ARRAY['120+ hours of HD video lectures', 'Downloadable study guides', 'Section-specific notes', 'Mobile app access', 'Performance analytics'],
    TRUE,
    TRUE,
    1
),
-- Option 1b: QBank Only
(
    'MCAT QBank Only',
    'qbank_only',
    'MCAT',
    'monthly',
    59.99,
    79.99,
    '{"video_access": false, "notes_access": false, "qbank_access": true, "practice_exams": 5, "tutor_hours": 0, "analytics_access": true, "mobile_app": true, "downloadable_content": false, "live_sessions": false}',
    3000,
    NULL,
    5,
    'Extensive question bank with 3000+ MCAT practice questions and detailed explanations',
    ARRAY['3000+ practice questions', '5 full-length practice exams', 'Detailed explanations', 'Performance tracking', 'Mobile app access'],
    TRUE,
    FALSE,
    2
),
-- Option 2: Complete Bundle
(
    'MCAT Complete Bundle',
    'complete_bundle',
    'MCAT',
    'monthly',
    119.99,
    159.99,
    '{"video_access": true, "notes_access": true, "qbank_access": true, "practice_exams": 10, "tutor_hours": 2, "analytics_access": true, "mobile_app": true, "downloadable_content": true, "live_sessions": true}',
    3000,
    120.0,
    10,
    'Complete MCAT preparation package with videos, notes, QBank, and practice exams',
    ARRAY['120+ hours of video content', '3000+ practice questions', '10 full-length exams', 'Study guides & notes', '2 hours tutor support/month', 'Live study sessions', 'Mobile app access'],
    TRUE,
    TRUE,
    3
);

-- USMLE Plans
INSERT INTO test_prep_plans (
    plan_name, plan_type, exam_category, billing_period,
    price_usd, original_price_usd, features, question_bank_size, video_hours, max_practice_exams,
    description, highlights, is_active, is_featured, display_order
) VALUES
(
    'USMLE Step 1 - Video Course',
    'test_prep_only',
    'USMLE',
    'monthly',
    89.99,
    119.99,
    '{"video_access": true, "notes_access": true, "qbank_access": false, "practice_exams": 0, "tutor_hours": 0, "analytics_access": true, "mobile_app": true, "downloadable_content": true, "live_sessions": false}',
    NULL,
    150.0,
    0,
    'Comprehensive USMLE Step 1 video preparation course',
    ARRAY['150+ hours of expert lectures', 'High-yield study notes', 'System-based learning', 'Mobile access'],
    TRUE,
    FALSE,
    4
),
(
    'USMLE Step 1 - QBank Only',
    'qbank_only',
    'USMLE',
    'monthly',
    69.99,
    89.99,
    '{"video_access": false, "notes_access": false, "qbank_access": true, "practice_exams": 4, "tutor_hours": 0, "analytics_access": true, "mobile_app": true, "downloadable_content": false, "live_sessions": false}',
    4000,
    NULL,
    4,
    'USMLE Step 1 question bank with 4000+ practice questions',
    ARRAY['4000+ USMLE-style questions', '4 full-length practice exams', 'Detailed answer explanations', 'Performance analytics'],
    TRUE,
    FALSE,
    5
),
(
    'USMLE Step 1 - Complete Bundle',
    'complete_bundle',
    'USMLE',
    'monthly',
    139.99,
    189.99,
    '{"video_access": true, "notes_access": true, "qbank_access": true, "practice_exams": 8, "tutor_hours": 3, "analytics_access": true, "mobile_app": true, "downloadable_content": true, "live_sessions": true}',
    4000,
    150.0,
    8,
    'Complete USMLE Step 1 preparation with videos, QBank, and practice exams',
    ARRAY['150+ hours of video content', '4000+ practice questions', '8 full-length exams', 'Comprehensive study guides', '3 hours tutor support/month', 'Live Q&A sessions'],
    TRUE,
    TRUE,
    6
);

-- LSAT Plans
INSERT INTO test_prep_plans (
    plan_name, plan_type, exam_category, billing_period,
    price_usd, features, question_bank_size, video_hours, max_practice_exams,
    description, highlights, is_active, display_order
) VALUES
(
    'LSAT Video Course',
    'test_prep_only',
    'LSAT',
    'monthly',
    69.99,
    '{"video_access": true, "notes_access": true, "qbank_access": false, "practice_exams": 0, "analytics_access": true, "mobile_app": true}',
    NULL,
    80.0,
    0,
    'LSAT preparation with comprehensive video lectures and study materials',
    ARRAY['80+ hours of video content', 'Logic games strategies', 'Reading comprehension techniques', 'Study guides'],
    TRUE,
    7
),
(
    'LSAT QBank Only',
    'qbank_only',
    'LSAT',
    'monthly',
    49.99,
    '{"qbank_access": true, "practice_exams": 10, "analytics_access": true, "mobile_app": true}',
    2500,
    NULL,
    10,
    'LSAT question bank with official practice tests',
    ARRAY['2500+ practice questions', '10 official LSAT practice tests', 'Detailed explanations'],
    TRUE,
    8
),
(
    'LSAT Complete Bundle',
    'complete_bundle',
    'LSAT',
    'monthly',
    99.99,
    '{"video_access": true, "notes_access": true, "qbank_access": true, "practice_exams": 15, "tutor_hours": 2, "analytics_access": true, "mobile_app": true, "live_sessions": true}',
    2500,
    80.0,
    15,
    'Complete LSAT preparation bundle with everything you need',
    ARRAY['Complete video course', '2500+ practice questions', '15 official practice tests', '2 hours of tutoring', 'Live sessions'],
    TRUE,
    9
);

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View: Active User Subscriptions with Plan Details
CREATE OR REPLACE VIEW v_active_user_subscriptions AS
SELECT
    s.id as subscription_id,
    s.user_id,
    u.email,
    u.first_name,
    u.last_name,
    p.plan_name,
    p.plan_type,
    p.exam_category,
    p.billing_period,
    p.price_usd,
    p.features,
    s.status,
    s.start_date,
    s.end_date,
    s.current_period_end,
    s.usage_stats
FROM test_prep_subscriptions s
JOIN users u ON s.user_id = u.id
JOIN test_prep_plans p ON s.plan_id = p.id
WHERE s.status = 'active';

-- View: User Access Rights
CREATE OR REPLACE VIEW v_user_content_access AS
SELECT
    s.user_id,
    p.exam_category,
    p.plan_type,
    (p.features->>'video_access')::boolean as has_video_access,
    (p.features->>'notes_access')::boolean as has_notes_access,
    (p.features->>'qbank_access')::boolean as has_qbank_access,
    (p.features->>'practice_exams')::int as practice_exams_available,
    s.status,
    s.end_date
FROM test_prep_subscriptions s
JOIN test_prep_plans p ON s.plan_id = p.id
WHERE s.status = 'active' AND (s.end_date IS NULL OR s.end_date > CURRENT_TIMESTAMP);

-- =====================================================
-- COMPLETION
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Test Prep Subscription System Created Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Plans Created:';
    RAISE NOTICE '   - Test Prep Only (Videos + Notes)';
    RAISE NOTICE '   - QBank Only (Practice Questions)';
    RAISE NOTICE '   - Complete Bundle (Everything)';
    RAISE NOTICE '';
    RAISE NOTICE '🎓 Exam Categories Supported:';
    RAISE NOTICE '   - MCAT, USMLE, LSAT, GRE, GMAT, FE';
    RAISE NOTICE '';
    RAISE NOTICE '💳 Payment Integration: Stripe Ready';
    RAISE NOTICE '📊 Progress Tracking: Enabled';
    RAISE NOTICE '';
END $$;
