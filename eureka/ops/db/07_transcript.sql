-- ============================================================================
-- Phase 4 Session 4.3 — Universal transcript (2026-05).
--
-- The transcript is a signed, exportable, cryptographically-verifiable
-- record of a learner's achievements across every EUREKA tier. Compatible
-- with the Open Badges 3.0 JSON-LD spec so it can be imported into
-- LinkedIn, Credly, or any standards-compliant wallet.
--
-- Three tables:
--
--   learner_achievements       Point-in-time accomplishments (course
--                              completion, skill-mastery-reached, exam-
--                              passed, badge-earned). Distinct from
--                              learner_skill_mastery (which is current
--                              state); these are immutable historical
--                              events.
--
--   transcript_issuances       Each time we generate + sign a transcript,
--                              we store the canonical JSON-LD payload,
--                              its Ed25519 signature, and the public key
--                              identifier used. Anyone can later verify.
--
--   transcript_issuer_keys     The Ed25519 keypair(s) EUREKA uses to
--                              sign transcripts. Public key embedded in
--                              every issuance; private key in the secret
--                              manager (see docs/SECRETS.md). Rotated
--                              under the same procedure as JWT_SECRET.
-- ============================================================================

CREATE TYPE achievement_kind AS ENUM (
    'course_completed',
    'module_completed',
    'assessment_passed',
    'skill_mastered',           -- mastery crossed a threshold (default 0.85)
    'tier_completed',           -- a tier_enrollment moved to status=completed
    'exam_passed',              -- USMLE, FE, bar, etc.
    'badge_earned',             -- generic achievement
    'capstone_completed'
);

CREATE TABLE IF NOT EXISTS learner_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind achievement_kind NOT NULL,

    -- What the achievement is about. Loosely typed reference; subjects:
    --   course/module/assessment → uuid of the row
    --   skill_mastered           → skills.id
    --   tier_completed           → tier_enrollments.id
    --   exam_passed              → metadata.exam = "USMLE_Step_1"
    --   badge_earned             → metadata.badge_code
    subject_id UUID,

    -- Human-readable label that goes into the transcript export verbatim.
    title VARCHAR(300) NOT NULL,
    description TEXT,

    -- Free-form payload — score, percentile, evidence URL, etc.
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- When the learner *actually* earned this (might be before we recorded it).
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- When we recorded it.
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Expiration (e.g. ACLS certification expires after 2 years). NULL = no expiry.
    expires_at TIMESTAMP,
    -- If the achievement was revoked (e.g. cheating, mis-grade).
    revoked_at TIMESTAMP,
    revocation_reason TEXT,

    -- Lineage: which service issued it. Useful for audit.
    issued_by_service VARCHAR(60) NOT NULL DEFAULT 'api-core'
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON learner_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_kind ON learner_achievements(kind);
CREATE INDEX IF NOT EXISTS idx_achievements_subject ON learner_achievements(subject_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_kind
    ON learner_achievements(user_id, kind)
    WHERE revoked_at IS NULL;

-- ----------------------------------------------------------------------------
-- transcript_issuer_keys — Ed25519 keypair registry
--
-- The key_id is what goes in the JSON-LD `verification.id` field. The
-- public key is base64url-encoded raw 32-byte Ed25519 public key. Private
-- keys NEVER live in the DB — operator stores them in the secret manager
-- and the issuer service reads from MFA_ENVELOPE_KEY-style env var.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transcript_issuer_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_id VARCHAR(120) NOT NULL UNIQUE,
    public_key_b64 TEXT NOT NULL,
    algorithm VARCHAR(40) NOT NULL DEFAULT 'Ed25519',

    -- The issuer DID — Open Badges 3.0 requires an issuer URI.
    issuer_uri VARCHAR(500) NOT NULL DEFAULT 'https://eureka.example.com/issuers/default',
    issuer_name VARCHAR(200) NOT NULL DEFAULT 'EUREKA Platform',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rotated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_issuer_keys_active
    ON transcript_issuer_keys(is_active) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- transcript_issuances — each rendered transcript stored canonically
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transcript_issuances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- The Open Badges 3.0 JSON-LD payload as it was signed. Stored as
    -- JSONB so we can reproduce the exact bytes that were signed (the
    -- signature covers a canonical serialisation).
    payload JSONB NOT NULL,

    -- The Ed25519 signature over the canonical payload (base64url).
    signature_b64 TEXT NOT NULL,
    key_id VARCHAR(120) NOT NULL REFERENCES transcript_issuer_keys(key_id),

    -- A stable URL where this issuance is hosted; the Open Badges spec
    -- expects credentials to be dereferenceable.
    issuance_uri VARCHAR(500),

    -- Snapshot counters — for human-facing summaries without re-parsing the JSON.
    achievements_count INTEGER NOT NULL DEFAULT 0,
    tiers_count INTEGER NOT NULL DEFAULT 0,
    skills_mastered_count INTEGER NOT NULL DEFAULT 0,

    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- If superseded by a later issuance (we keep history).
    superseded_at TIMESTAMP,
    superseded_by_id UUID REFERENCES transcript_issuances(id)
);

CREATE INDEX IF NOT EXISTS idx_issuances_user ON transcript_issuances(user_id);
CREATE INDEX IF NOT EXISTS idx_issuances_current
    ON transcript_issuances(user_id, issued_at DESC)
    WHERE superseded_at IS NULL;
