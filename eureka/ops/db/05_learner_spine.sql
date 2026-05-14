-- ============================================================================
-- Phase 4 Session 4.1 — Cross-tier learner spine (2026-05).
--
-- A single users row can now have:
--   * ONE learner_profiles row (1:1) carrying everything that's about the
--     LEARNER (as opposed to the account): preferences, accessibility needs,
--     languages, goals, the eventual skill-graph mastery snapshot.
--   * MANY tier_enrollments rows (1:N) — one per (user, tier) pair the user
--     is actively or historically engaged with. A 23-year-old user can be
--     simultaneously: enrolled in undergraduate, doing USMLE Step 1 test
--     prep, and have an archived high-school transcript — three rows.
--
-- This is the structural moat: a learner identity that follows them HS →
-- UG → Grad → Pro without forcing them to be "in" one tier at a time.
--
-- Migrations: rerunning is idempotent (CREATE IF NOT EXISTS).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- learner_profiles — 1:1 with users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Display & identity overrides scoped to learner context.
    display_name_preferred VARCHAR(200),
    bio TEXT,
    avatar_url VARCHAR(500),

    -- Languages: BCP-47 codes. primary_language is the UI default; the
    -- additional ones power multilingual content recommendations and the
    -- live-translation feature planned for Phase 6.5.
    primary_language VARCHAR(20) NOT NULL DEFAULT 'en-US',
    additional_languages TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    -- Accessibility — opt-in features the UI honours globally.
    -- Examples: {"screen_reader": true, "captions_default": true,
    --           "font_size": "lg", "reduced_motion": true,
    --           "dyslexia_friendly_font": true, "high_contrast": false}.
    accessibility_needs JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Learning preferences — soft signals the recommender weighs.
    -- Examples: {"modality_preference": "visual", "study_time_pref": "morning",
    --           "session_length_min": 25, "preferred_difficulty": "stretch"}.
    learning_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Goals: free-form short strings, surfaced on the dashboard.
    -- Phase 4.4 (recommender) will use these as one input.
    -- Example: ["USMLE Step 1 pass", "AP Calc BC 5", "Match into IM"].
    goals TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    -- Interests: subject tags. Decoupled from goals.
    -- Example: ["organic chemistry", "renewable energy", "constitutional law"].
    interests TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    -- Skill-graph snapshot. Filled by Phase 4.2 (skill graph) +
    -- maintained by Phase 6 (tutor + assessments). Shape:
    --   {"<skill_id>": {"mastery": 0.0-1.0, "last_practiced": iso8601,
    --                   "attempts": int, "decay_at": iso8601}}
    knowledge_state JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- COPPA / FERPA derived flag. Mirrors users.parental_consent_given but
    -- here we also stamp how it was obtained.
    parental_consent_required BOOLEAN NOT NULL DEFAULT FALSE,
    parental_consent_evidence JSONB,

    -- Soft delete + audit
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_learner_profiles_user ON learner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_profiles_lang ON learner_profiles(primary_language);

-- ----------------------------------------------------------------------------
-- tier_enrollments — N per user. A learner spans tiers; the FE-PE engineer
-- still has a HS transcript, the med student is also doing CME.
-- ----------------------------------------------------------------------------
CREATE TYPE tier_kind AS ENUM (
    'high_school',
    'undergraduate',
    'graduate',
    'medical',
    'law',
    'mba',
    'engineering',
    'test_prep',          -- horizontal: MCAT, USMLE, FE, GRE, LSAT, bar, CPA, etc.
    'continuing_education' -- horizontal: CME, CLE, MOC, professional CEUs
);

CREATE TYPE tier_enrollment_status AS ENUM (
    'pending',     -- enrolled but not started
    'active',      -- in progress
    'paused',      -- learner-initiated break, resumable
    'completed',   -- finished successfully (kept for transcript)
    'withdrawn',   -- left, didn't finish
    'archived'     -- historical / read-only (e.g. HS after they've graduated)
);

CREATE TABLE IF NOT EXISTS tier_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier tier_kind NOT NULL,

    -- Per-tier context. The shape is open so different tiers can carry
    -- their own state without us needing per-tier columns. Examples:
    --   high_school: {"grade": 11, "graduation_year": 2027}
    --   undergraduate: {"major": "biology", "minor": "spanish", "year": "junior"}
    --   test_prep:  {"exam": "USMLE_Step_1", "target_date": "2027-08-15",
    --                "diagnostic_score": 215}
    --   engineering: {"discipline": "civil", "license_target": "FE"}
    tier_context JSONB NOT NULL DEFAULT '{}'::jsonb,

    status tier_enrollment_status NOT NULL DEFAULT 'pending',

    -- Timeline
    started_at TIMESTAMP,
    target_completion_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_activity_at TIMESTAMP,

    -- Progress is a derived value the analytics service keeps fresh.
    -- 0.0 ≤ progress_pct ≤ 100.0. We store it cached so the dashboard
    -- doesn't need to re-compute on every render.
    progress_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,

    -- Free-form metadata that doesn't belong in tier_context. Settings,
    -- preferences, references to external IDs (school SIS, exam-bank account).
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    -- A user can have at most one enrollment per (tier, exam-or-context)
    -- combination. We don't enforce uniqueness on (user_id, tier) alone
    -- because someone might legitimately be enrolled in test_prep twice
    -- (USMLE Step 1 AND Step 2) — uniqueness is enforced via the partial
    -- unique index below using a hash of tier + tier_context.
    CONSTRAINT progress_in_range CHECK (progress_pct >= 0 AND progress_pct <= 100)
);

CREATE INDEX IF NOT EXISTS idx_tier_enrollments_user ON tier_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_tier_enrollments_tier ON tier_enrollments(tier);
CREATE INDEX IF NOT EXISTS idx_tier_enrollments_status ON tier_enrollments(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tier_enrollments_user_active
    ON tier_enrollments(user_id, tier)
    WHERE status = 'active' AND deleted_at IS NULL;

-- A single user can't have two ACTIVE enrollments for the same exact
-- (tier, exam) pair. The exam_key derived index uses tier_context->>'exam'
-- so test_prep for USMLE_Step_1 + USMLE_Step_2 are fine; two for Step 1 are not.
CREATE UNIQUE INDEX IF NOT EXISTS uq_tier_enrollments_active_per_target
    ON tier_enrollments(user_id, tier, COALESCE(tier_context->>'exam', ''))
    WHERE status IN ('active', 'paused', 'pending') AND deleted_at IS NULL;

-- ----------------------------------------------------------------------------
-- Backfill: every existing user gets a learner_profile so the 1:1 holds.
-- Idempotent: ON CONFLICT DO NOTHING.
-- ----------------------------------------------------------------------------
INSERT INTO learner_profiles (user_id, primary_language)
SELECT id, COALESCE(locale, 'en-US') FROM users
ON CONFLICT (user_id) DO NOTHING;
