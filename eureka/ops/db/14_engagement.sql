-- ============================================================================
-- Phase 12 — Engagement + adaptive learning
--
-- 12.1 Streaks + XP + achievements
-- 12.2 Push notification device registry + log
-- 12.3 Adaptive study plans (week-by-week)
-- 12.4 Offline sync API (bundles + ETags)
-- 12.5 Live tutoring marketplace (sessions, bookings)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE device_platform AS ENUM ('ios', 'android', 'web');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_kind AS ENUM (
        'streak_reminder', 'streak_broken', 'study_plan_today',
        'mastery_milestone', 'mock_exam_due', 'spaced_rep_due',
        'live_session_starting', 'live_session_booked',
        'price_drop', 'instructor_announcement', 'support_reply', 'generic'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM ('queued', 'sent', 'delivered', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE achievement_rarity AS ENUM ('common', 'uncommon', 'rare', 'legendary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE study_plan_status AS ENUM ('draft', 'active', 'completed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE live_session_status AS ENUM (
        'scheduled', 'live', 'completed', 'canceled', 'no_show'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'canceled', 'attended', 'missed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 12.1 Streaks + XP + achievements
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS engagement_states (
    user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak_days  INTEGER NOT NULL DEFAULT 0,
    longest_streak_days  INTEGER NOT NULL DEFAULT 0,
    last_active_on       DATE,
    -- Total lifetime XP. Level is derived in code: floor(sqrt(xp/100)).
    xp                   INTEGER NOT NULL DEFAULT 0,
    level                INTEGER NOT NULL DEFAULT 1,
    -- Optional opt-out from leaderboards
    show_on_leaderboard  BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS xp_events (
    id            BIGSERIAL PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- e.g. "question_correct", "question_attempted", "streak_day", "mock_completed",
    -- "review_due_completed", "first_question_of_day", "skill_mastered"
    source        VARCHAR(60) NOT NULL,
    xp_delta      INTEGER NOT NULL,
    -- Loose reference to the originating record.
    ref_kind      VARCHAR(40),
    ref_id        UUID,
    occurred_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_user_recent ON xp_events(user_id, occurred_at DESC);


CREATE TABLE IF NOT EXISTS achievements (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug          VARCHAR(80) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    description   TEXT,
    rarity        achievement_rarity NOT NULL DEFAULT 'common',
    icon_url      VARCHAR(500),
    xp_reward     INTEGER NOT NULL DEFAULT 0,
    -- Trigger predicate: {"event":"streak_day","min":7}, etc.
    trigger_jsonb JSONB NOT NULL DEFAULT '{}',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS user_achievements (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id  UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- Snapshot of relevant counters for replay/debug
    progress_jsonb  JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT uq_user_achievement UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, earned_at DESC);


-- ---------------------------------------------------------------------------
-- 12.2 Push notification registry + log
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notification_devices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform        device_platform NOT NULL,
    -- APNs / FCM device token
    push_token      VARCHAR(500) NOT NULL,
    app_version     VARCHAR(40),
    locale          VARCHAR(8) NOT NULL DEFAULT 'en',
    timezone        VARCHAR(60),
    -- topic-level opt-in: {"streak_reminder": true, "marketing": false}
    preferences     JSONB NOT NULL DEFAULT '{}',
    last_seen_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    revoked_at      TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_device_token UNIQUE (push_token)
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON notification_devices(user_id) WHERE revoked_at IS NULL;


CREATE TABLE IF NOT EXISTS push_notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_id       UUID REFERENCES notification_devices(id) ON DELETE SET NULL,
    kind            notification_kind NOT NULL,
    title           VARCHAR(200) NOT NULL,
    body            TEXT NOT NULL,
    deep_link       VARCHAR(500),
    data            JSONB NOT NULL DEFAULT '{}',
    status          notification_status NOT NULL DEFAULT 'queued',
    provider        VARCHAR(40),         -- 'apns', 'fcm', 'webpush', 'stub'
    provider_message_id VARCHAR(120),
    error_message   TEXT,
    queued_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    sent_at         TIMESTAMP WITH TIME ZONE,
    delivered_at    TIMESTAMP WITH TIME ZONE,
    opened_at       TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_push_notifications_user_status ON push_notifications(user_id, status, queued_at DESC);


-- ---------------------------------------------------------------------------
-- 12.3 Adaptive study plans (week-by-week)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS study_plans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier            VARCHAR(40) NOT NULL,
    framework       VARCHAR(40) NOT NULL,
    exam            VARCHAR(80),
    target_date     DATE NOT NULL,
    daily_target_minutes INTEGER NOT NULL DEFAULT 60 CHECK (daily_target_minutes BETWEEN 5 AND 600),
    target_mastery  NUMERIC(4,3) NOT NULL DEFAULT 0.80,
    status          study_plan_status NOT NULL DEFAULT 'active',
    -- Snapshot of the generated schedule: [{"week": 1, "starts_on": "...", ...}]
    generated_jsonb JSONB NOT NULL DEFAULT '[]',
    generator_version VARCHAR(20) NOT NULL DEFAULT 'v1',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user ON study_plans(user_id, status);


CREATE TABLE IF NOT EXISTS study_plan_weeks (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id           UUID NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    week_index        INTEGER NOT NULL CHECK (week_index >= 0),
    starts_on         DATE NOT NULL,
    ends_on           DATE NOT NULL,
    -- Skill codes the week targets (≤ Phase 4.2 framework rules).
    target_skill_codes TEXT[] NOT NULL DEFAULT '{}',
    target_item_count INTEGER NOT NULL DEFAULT 0,
    target_minutes    INTEGER NOT NULL DEFAULT 0,
    is_diagnostic_week BOOLEAN NOT NULL DEFAULT FALSE,
    is_mock_week      BOOLEAN NOT NULL DEFAULT FALSE,
    is_review_week    BOOLEAN NOT NULL DEFAULT FALSE,
    -- snapshot of recommended_item_ids[] when the week was last regenerated
    recommended_item_ids UUID[] DEFAULT '{}',
    completed_item_ids UUID[] DEFAULT '{}',
    minutes_studied   INTEGER NOT NULL DEFAULT 0,
    completed_at      TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_plan_week UNIQUE (plan_id, week_index)
);

CREATE INDEX IF NOT EXISTS idx_plan_weeks_plan ON study_plan_weeks(plan_id, week_index);


-- ---------------------------------------------------------------------------
-- 12.4 Offline sync API (bundles + receipts)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS offline_bundles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind            VARCHAR(40) NOT NULL,        -- 'item_pack' | 'skill_pack' | 'mock_pack'
    -- ETag is content-hash of the bundle payload.
    etag            VARCHAR(80) NOT NULL,
    payload_jsonb   JSONB NOT NULL,
    size_bytes      INTEGER NOT NULL DEFAULT 0,
    item_count      INTEGER NOT NULL DEFAULT 0,
    skill_codes     TEXT[] DEFAULT '{}',
    generated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_offline_bundles_user_kind ON offline_bundles(user_id, kind, generated_at DESC);


CREATE TABLE IF NOT EXISTS offline_sync_receipts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bundle_id       UUID REFERENCES offline_bundles(id) ON DELETE SET NULL,
    device_id       UUID REFERENCES notification_devices(id) ON DELETE SET NULL,
    -- Attempts the device replayed back when it came online again.
    attempts_replayed_jsonb JSONB NOT NULL DEFAULT '[]',
    received_attempts INTEGER NOT NULL DEFAULT 0,
    received_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- ---------------------------------------------------------------------------
-- 12.5 Live tutoring marketplace
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS live_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Loose FK so we can build either against Phase 10's instructor_profiles
    -- or directly against users.id (for non-marketplace instructors).
    instructor_id   UUID NOT NULL,
    instructor_kind VARCHAR(20) NOT NULL DEFAULT 'marketplace',  -- 'marketplace'|'staff'
    title           VARCHAR(240) NOT NULL,
    description_md  TEXT,
    starts_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 5 AND 480),
    capacity        INTEGER NOT NULL DEFAULT 1 CHECK (capacity >= 1),
    booked_count    INTEGER NOT NULL DEFAULT 0,
    price_cents     INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    target_skill_codes TEXT[] DEFAULT '{}',
    meeting_url     VARCHAR(500),
    status          live_session_status NOT NULL DEFAULT 'scheduled',
    canceled_at     TIMESTAMP WITH TIME ZONE,
    cancel_reason   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_starts ON live_sessions(starts_at, status);
CREATE INDEX IF NOT EXISTS idx_live_instructor ON live_sessions(instructor_id, starts_at DESC);


CREATE TABLE IF NOT EXISTS live_session_bookings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          booking_status NOT NULL DEFAULT 'pending',
    purchase_id     UUID,    -- loose ref to marketplace_purchases
    seat_number     INTEGER,
    joined_at       TIMESTAMP WITH TIME ZONE,
    canceled_at     TIMESTAMP WITH TIME ZONE,
    cancel_reason   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_session_user UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON live_session_bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON live_session_bookings(session_id, status);


-- ---------------------------------------------------------------------------
-- Touch triggers
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_engagement_touch ON engagement_states;
CREATE TRIGGER trg_engagement_touch
    BEFORE UPDATE ON engagement_states
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_study_plans_touch ON study_plans;
CREATE TRIGGER trg_study_plans_touch
    BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_live_sessions_touch ON live_sessions;
CREATE TRIGGER trg_live_sessions_touch
    BEFORE UPDATE ON live_sessions
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
