-- ============================================================================
-- Phase 10 — Marketplace + creator economy
--
-- 10.1 instructor signup + KYC + payout ledger
-- 10.2 course authoring v2 (listings + pricing)
-- 10.3 marketplace ranking signals
-- 10.4 coupons / promo engine
-- 10.5 trust & safety (reports + moderation actions)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE instructor_status AS ENUM ('draft', 'pending_review', 'approved', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('none', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('accruing', 'ready', 'paid', 'failed', 'reversed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('draft', 'pending_review', 'published', 'rejected', 'unlisted');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE purchase_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE coupon_scope AS ENUM ('global', 'org', 'course', 'cohort', 'category');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE coupon_kind AS ENUM ('percent', 'amount_off');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('open', 'triaged', 'actioned', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM (
        'copyright', 'plagiarism', 'harassment', 'hate', 'sexual',
        'violence', 'self_harm', 'spam', 'misinformation',
        'medical_misinformation', 'safety_critical', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE moderation_action_kind AS ENUM (
        'unlist', 'redact', 'takedown', 'shadow_ban',
        'notify_creator', 'restore', 'suspend_instructor'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 10.1  Instructor profile + KYC + payouts
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS instructor_profiles (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                  UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    public_slug              VARCHAR(80) NOT NULL UNIQUE,
    display_name             VARCHAR(160) NOT NULL,
    headline                 VARCHAR(280),
    bio_md                   TEXT,
    avatar_url               VARCHAR(500),
    expertise_tags           TEXT[] DEFAULT '{}',
    website_url              VARCHAR(500),
    -- KYC / payout linkage. Real KYC happens through Stripe Connect Express;
    -- we just track the account id + onboarding state.
    stripe_connect_account_id VARCHAR(80),
    kyc_status               kyc_status NOT NULL DEFAULT 'none',
    kyc_last_event_at        TIMESTAMP WITH TIME ZONE,
    payout_currency          VARCHAR(3) NOT NULL DEFAULT 'USD',
    -- Revenue share (instructor's cut). Anything not given to instructor is
    -- platform take. Default 0.70 (70/30 like Udemy).
    revenue_share            NUMERIC(4,3) NOT NULL DEFAULT 0.700
                              CHECK (revenue_share >= 0 AND revenue_share <= 1),
    status                   instructor_status NOT NULL DEFAULT 'draft',
    -- aggregate metrics (denormalised, refreshed by ranking job)
    total_sales_cents        BIGINT NOT NULL DEFAULT 0,
    total_courses_published  INTEGER NOT NULL DEFAULT 0,
    avg_rating               NUMERIC(3,2),
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instructor_profiles_status ON instructor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_kyc ON instructor_profiles(kyc_status);


CREATE TABLE IF NOT EXISTS instructor_kyc_events (
    id              BIGSERIAL PRIMARY KEY,
    instructor_id   UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
    -- Source: "stripe.connect.account.updated" / "manual.admin" / "kyc.requested"
    source          VARCHAR(80) NOT NULL,
    previous_status kyc_status,
    new_status      kyc_status NOT NULL,
    requirements    JSONB DEFAULT '{}',
    note            TEXT,
    occurred_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_events_instructor ON instructor_kyc_events(instructor_id, occurred_at DESC);


CREATE TABLE IF NOT EXISTS instructor_payouts (
    id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id      UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
    period_start       DATE NOT NULL,
    period_end         DATE NOT NULL,
    currency           VARCHAR(3) NOT NULL DEFAULT 'USD',
    gross_cents        BIGINT NOT NULL DEFAULT 0,    -- sum of paid purchases attributed to this instructor
    platform_fee_cents BIGINT NOT NULL DEFAULT 0,    -- our cut
    payment_fee_cents  BIGINT NOT NULL DEFAULT 0,    -- Stripe processor fees passed through
    refunds_cents      BIGINT NOT NULL DEFAULT 0,
    net_cents          BIGINT NOT NULL DEFAULT 0,    -- what we actually pay out
    status             payout_status NOT NULL DEFAULT 'accruing',
    stripe_payout_id   VARCHAR(80),
    paid_at            TIMESTAMP WITH TIME ZONE,
    note               TEXT,
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_instructor_payout_period UNIQUE (instructor_id, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_payouts_instructor ON instructor_payouts(instructor_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON instructor_payouts(status);


-- ---------------------------------------------------------------------------
-- 10.2  Course listings + pricing
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS course_listings (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id         UUID NOT NULL UNIQUE REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id     UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
    slug              VARCHAR(160) NOT NULL UNIQUE,
    headline          VARCHAR(280) NOT NULL,
    summary_md        TEXT,
    hero_image_url    VARCHAR(500),
    promo_video_url   VARCHAR(500),
    tags              TEXT[] DEFAULT '{}',
    target_skill_codes TEXT[] DEFAULT '{}',
    level             VARCHAR(40),
    language          VARCHAR(8) NOT NULL DEFAULT 'en',
    estimated_hours   NUMERIC(5,2),
    status            listing_status NOT NULL DEFAULT 'draft',
    -- denormalised marketplace signals
    enrolled_count    INTEGER NOT NULL DEFAULT 0,
    review_count      INTEGER NOT NULL DEFAULT 0,
    avg_rating        NUMERIC(3,2),
    rank_score        NUMERIC(10,4) NOT NULL DEFAULT 0,
    published_at      TIMESTAMP WITH TIME ZONE,
    rejected_reason   TEXT,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON course_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_instructor ON course_listings(instructor_id);
CREATE INDEX IF NOT EXISTS idx_listings_rank ON course_listings(rank_score DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_listings_tags ON course_listings USING GIN(tags);


CREATE TABLE IF NOT EXISTS course_pricing (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id         UUID NOT NULL UNIQUE REFERENCES courses(id) ON DELETE CASCADE,
    currency          VARCHAR(3) NOT NULL DEFAULT 'USD',
    list_price_cents  INTEGER NOT NULL CHECK (list_price_cents >= 0),
    sale_price_cents  INTEGER CHECK (sale_price_cents IS NULL OR sale_price_cents >= 0),
    sale_starts_at    TIMESTAMP WITH TIME ZONE,
    sale_ends_at      TIMESTAMP WITH TIME ZONE,
    is_free           BOOLEAN NOT NULL DEFAULT FALSE,
    -- Optional team / cohort tier pricing (e.g. {"seats:10": 79900})
    bulk_tiers        JSONB NOT NULL DEFAULT '{}',
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT sale_window_consistent
        CHECK (sale_starts_at IS NULL OR sale_ends_at IS NULL OR sale_ends_at >= sale_starts_at)
);


-- ---------------------------------------------------------------------------
-- 10.3  Marketplace purchases + reviews
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS marketplace_purchases (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id                UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    instructor_id            UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE RESTRICT,
    currency                 VARCHAR(3) NOT NULL DEFAULT 'USD',
    list_price_cents         INTEGER NOT NULL,
    discount_cents           INTEGER NOT NULL DEFAULT 0,
    final_price_cents        INTEGER NOT NULL CHECK (final_price_cents >= 0),
    platform_fee_cents       INTEGER NOT NULL DEFAULT 0,
    payment_fee_cents        INTEGER NOT NULL DEFAULT 0,
    instructor_net_cents     INTEGER NOT NULL DEFAULT 0,
    stripe_session_id        VARCHAR(120),
    stripe_payment_intent_id VARCHAR(120),
    coupon_id                UUID,
    status                   purchase_status NOT NULL DEFAULT 'pending',
    refunded_at              TIMESTAMP WITH TIME ZONE,
    refund_reason            TEXT,
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    paid_at                  TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_purchase_per_paid_user_course
    ON marketplace_purchases(user_id, course_id) WHERE status = 'paid';
CREATE INDEX IF NOT EXISTS idx_purchases_instructor ON marketplace_purchases(instructor_id, paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_course ON marketplace_purchases(course_id, status);


CREATE TABLE IF NOT EXISTS course_reviews (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title         VARCHAR(160),
    body          TEXT,
    verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    flagged       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_review_per_user_course UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id, created_at DESC);


-- ---------------------------------------------------------------------------
-- 10.4  Coupons / promo engine
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS coupons (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code            VARCHAR(60) NOT NULL UNIQUE,
    description     TEXT,
    kind            coupon_kind NOT NULL,
    -- percent: stored as basis points / 10000 (e.g. 2500 = 25%)
    -- amount_off: integer cents
    value           INTEGER NOT NULL CHECK (value > 0),
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    scope           coupon_scope NOT NULL DEFAULT 'global',
    scope_id        UUID, -- org_id / course_id / cohort_id / category-id (loose link)
    max_redemptions INTEGER,
    used_count      INTEGER NOT NULL DEFAULT 0,
    per_user_limit  INTEGER NOT NULL DEFAULT 1,
    valid_from      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    valid_to        TIMESTAMP WITH TIME ZONE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active, valid_to);


CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id            BIGSERIAL PRIMARY KEY,
    coupon_id     UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purchase_id   UUID REFERENCES marketplace_purchases(id) ON DELETE SET NULL,
    course_id     UUID REFERENCES courses(id) ON DELETE SET NULL,
    discount_cents INTEGER NOT NULL,
    redeemed_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon ON coupon_redemptions(coupon_id, redeemed_at);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user ON coupon_redemptions(coupon_id, user_id);


-- ---------------------------------------------------------------------------
-- 10.5  Trust & safety: content reports + moderation actions
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS content_reports (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id   UUID REFERENCES users(id) ON DELETE SET NULL,
    target_type   VARCHAR(40) NOT NULL,  -- "course" | "review" | "item" | "comment"
    target_id     UUID NOT NULL,
    reason        report_reason NOT NULL,
    details       TEXT,
    evidence_url  VARCHAR(500),
    status        report_status NOT NULL DEFAULT 'open',
    severity      SMALLINT NOT NULL DEFAULT 3 CHECK (severity BETWEEN 1 AND 5),
    -- 1 = critical (safety-critical medical, CSAM, imminent harm)
    -- 3 = standard
    -- 5 = nuisance
    assigned_to   UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at   TIMESTAMP WITH TIME ZONE,
    resolution_note TEXT,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status_severity ON content_reports(status, severity);
CREATE INDEX IF NOT EXISTS idx_reports_target ON content_reports(target_type, target_id);


CREATE TABLE IF NOT EXISTS moderation_actions (
    id            BIGSERIAL PRIMARY KEY,
    report_id     UUID REFERENCES content_reports(id) ON DELETE SET NULL,
    actor_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    target_type   VARCHAR(40) NOT NULL,
    target_id     UUID NOT NULL,
    action        moderation_action_kind NOT NULL,
    rationale     TEXT,
    metadata      JSONB DEFAULT '{}',
    occurred_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modactions_target ON moderation_actions(target_type, target_id, occurred_at DESC);


-- ---------------------------------------------------------------------------
-- Touch-trigger for instructor_profiles.updated_at, course_listings.updated_at
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_instructor_profiles_touch ON instructor_profiles;
CREATE TRIGGER trg_instructor_profiles_touch
    BEFORE UPDATE ON instructor_profiles
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_course_listings_touch ON course_listings;
CREATE TRIGGER trg_course_listings_touch
    BEFORE UPDATE ON course_listings
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_course_pricing_touch ON course_pricing;
CREATE TRIGGER trg_course_pricing_touch
    BEFORE UPDATE ON course_pricing
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_course_reviews_touch ON course_reviews;
CREATE TRIGGER trg_course_reviews_touch
    BEFORE UPDATE ON course_reviews
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
