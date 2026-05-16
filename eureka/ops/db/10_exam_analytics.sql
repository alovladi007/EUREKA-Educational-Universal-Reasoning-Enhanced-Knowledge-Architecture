-- ============================================================================
-- Phase 7 — Exam realism + analytics (2026-05). Sessions 7.2–7.5.
--
-- Four tables:
--
--   attempt_logs           One row per (user, item, attempt). The raw
--                          data IRT calibration and per-skill analytics
--                          fit over. Captures time_taken_ms, hint_level,
--                          mock_attempt_id (if part of a mock), and the
--                          final correct/incorrect verdict.
--
--   exam_blueprints        Reusable mock-exam templates. Carries the
--                          per-skill weighting, item count, time limit,
--                          and which item bank(s) to draw from.
--                          USMLE Step 1 mock, FE Civil, etc.
--
--   mock_attempts          One row per learner's run of a blueprint.
--                          Carries the ability estimate (theta), the
--                          scaled score, and the predicted pass/fail.
--
--   mock_attempt_items     Which items appeared in the mock, in what
--                          order, the learner's answers, time_taken_ms,
--                          and the IRT info contribution.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- attempt_logs — raw practice attempts (the fuel for IRT + analytics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempt_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,

    -- The learner's answer. For mcq_single, answer_index; for numeric,
    -- answer_value. We keep both columns and let the grader decide.
    answer_index INTEGER,
    answer_value NUMERIC,
    answer_text TEXT,
    is_correct BOOLEAN NOT NULL,

    -- Timing. Used for time-per-question analytics + speed percentiles.
    time_taken_ms INTEGER,
    -- 0 = no hint; matches agent_sessions.hint_level if the learner
    -- worked the item via the tutor.
    hints_used INTEGER NOT NULL DEFAULT 0,
    -- 0..3, mirroring the tutor's hint ladder.
    max_hint_level INTEGER NOT NULL DEFAULT 0,

    -- Origin. Distinguishes practice vs mock vs real exam (future).
    -- agent_session_id and mock_attempt_id link back to the source.
    source VARCHAR(40) NOT NULL DEFAULT 'practice',
    agent_session_id UUID REFERENCES agent_sessions(id) ON DELETE SET NULL,
    mock_attempt_id UUID,  -- FK added after mock_attempts exists

    -- Ability snapshot AT the moment of attempt — useful for retroactive
    -- analytics (did this user know this skill when they took the attempt?).
    theta_at_attempt NUMERIC(6, 3),

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempt_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_item ON attempt_logs(item_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_item ON attempt_logs(user_id, item_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_created ON attempt_logs(user_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- exam_blueprints — reusable mock-exam templates
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,

    -- Source banks (one blueprint can draw from N banks; the JSON list
    -- is a soft FK because we want plain SELECTs to work).
    bank_slugs TEXT[] NOT NULL,

    -- Skill weighting. Shape: [{"skill_code": "STEP1.CARD.HF", "weight": 0.12}, ...]
    -- The generator picks items so the weighted skill distribution matches.
    -- Weights need not sum to 1.0 — the generator normalises.
    skill_weights JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Length + timing
    item_count INTEGER NOT NULL DEFAULT 40 CHECK (item_count >= 1 AND item_count <= 400),
    time_limit_min INTEGER NOT NULL DEFAULT 60 CHECK (time_limit_min >= 1),

    -- Scaled-score mapping. For each blueprint, we define a piecewise
    -- linear map from IRT theta → exam-published-score (e.g. 200..300
    -- for USMLE Step 1, 1..36 for ACT). Shape: [{theta:..,score:..}, ...]
    score_mapping JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Pass threshold on the SCALED score (not theta). e.g. 196 for USMLE Step 1.
    pass_threshold_scaled NUMERIC(6, 2),
    -- IRT difficulty range to draw from (b parameter window).
    difficulty_b_range NUMERIC(5, 3)[] DEFAULT ARRAY[-3.0, 3.0],

    -- Visibility / lifecycle
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT valid_blueprint_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_blueprints_active ON exam_blueprints(is_active)
    WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- mock_attempts — one learner's run of a blueprint
-- ----------------------------------------------------------------------------
CREATE TYPE mock_attempt_status AS ENUM (
    'in_progress', 'submitted', 'expired', 'abandoned'
);

CREATE TABLE IF NOT EXISTS mock_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blueprint_id UUID NOT NULL REFERENCES exam_blueprints(id) ON DELETE CASCADE,

    status mock_attempt_status NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    -- Wall-clock deadline computed at start: started_at + time_limit_min.
    deadline_at TIMESTAMP NOT NULL,

    -- Final scoring (NULL until submitted).
    correct_count INTEGER,
    answered_count INTEGER,
    -- IRT ability estimate (theta). Standard error from the test
    -- information function at submission.
    theta NUMERIC(6, 3),
    theta_se NUMERIC(6, 3),
    -- Scaled score per the blueprint's score_mapping. NULL if mapping absent.
    scaled_score NUMERIC(6, 2),
    -- Predicted pass/fail at the published threshold + confidence.
    predicted_pass BOOLEAN,
    pass_probability NUMERIC(4, 3),

    -- A copy of the score_mapping that was active at submission time.
    -- Lets us reproduce the score later even if the blueprint is edited.
    scoring_snapshot JSONB,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mock_attempts_user ON mock_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_attempts_active
    ON mock_attempts(user_id, status) WHERE status = 'in_progress';

-- Now wire attempt_logs.mock_attempt_id → mock_attempts.id
DO $$ BEGIN
  ALTER TABLE attempt_logs
    ADD CONSTRAINT fk_attempts_mock
    FOREIGN KEY (mock_attempt_id) REFERENCES mock_attempts(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- mock_attempt_items — items presented in a single mock attempt
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mock_attempt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mock_attempt_id UUID NOT NULL REFERENCES mock_attempts(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    -- Display order in the mock (0 = first).
    position INTEGER NOT NULL,

    -- The learner's answer (NULL until they answer).
    answer_index INTEGER,
    answer_value NUMERIC,
    is_correct BOOLEAN,
    time_taken_ms INTEGER,
    -- Marked-for-review flag (UWorld / Prometric "flag" button).
    flagged BOOLEAN NOT NULL DEFAULT FALSE,

    -- IRT info contribution this item provided at the learner's theta
    -- estimate. Used to surface "this question moved your score most".
    irt_info_contribution NUMERIC(6, 3),

    answered_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_attempt_item UNIQUE (mock_attempt_id, item_id),
    CONSTRAINT uq_attempt_position UNIQUE (mock_attempt_id, position)
);

CREATE INDEX IF NOT EXISTS idx_mock_items_attempt ON mock_attempt_items(mock_attempt_id);
