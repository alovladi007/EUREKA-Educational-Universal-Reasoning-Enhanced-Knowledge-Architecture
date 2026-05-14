-- ============================================================================
-- Phase 4 Session 4.2 — Skill graph + competency model (2026-05).
--
-- Three tables:
--
--   skills                 The nodes. Each carries its framework (CCSS/NGSS/
--                          ABET/USMLE/MBE/FE-PE/...), its native code, a
--                          Bloom level, the EUREKA tier that owns it, and
--                          (optionally) a hierarchical parent. The hierarchy
--                          is a FOREST (one tree per framework root). The
--                          dependency information is separate (see below).
--
--   skill_prerequisites    Directed edges: predecessor → successor. This is
--                          the DAG used for "what should the learner master
--                          before attempting X". Independent of hierarchy:
--                          two siblings in CCSS can be prerequisites of a
--                          third sibling, and a graduate-tier skill can have
--                          a prerequisite that lives in the undergraduate
--                          tier (the cross-tier moat at work).
--
--   content_skills         Many-to-many between learning artifacts (courses,
--                          assessments, individual questions, content_items,
--                          even external URLs) and skills. Tagging is what
--                          lets the recommender and the tutor reason about
--                          "this question tests skill X at Bloom level
--                          'apply' under framework USMLE".
--
--   learner_skill_mastery  Denormalized per-(learner, skill) mastery state.
--                          The authoritative store is learner_profiles.
--                          knowledge_state JSONB (Phase 4.1); this table
--                          mirrors it for analytic queries — joins to
--                          skills + tier_enrollments — without paying the
--                          cost of unrolling JSONB on every query. Kept in
--                          sync by triggers (Phase 4.2b: populate; today we
--                          just write through both sides from the app).
--
-- ============================================================================

CREATE TYPE skill_framework AS ENUM (
    'ccss',         -- Common Core State Standards (K-12 math + ELA)
    'ngss',         -- Next Generation Science Standards (K-12 sci)
    'ap',           -- College Board AP
    'abet',         -- ABET undergraduate engineering accreditation
    'acm_ieee',     -- ACM/IEEE Computing Curricula
    'usmle',        -- United States Medical Licensing Examination (Step 1/2/3)
    'mcat',         -- MCAT content outline (AAMC)
    'mbe',          -- Multistate Bar Examination outline
    'cpa',          -- AICPA CPA Blueprints
    'gre',          -- GRE General + Subject
    'lsat',         -- LSAT outline
    'fe_pe',        -- NCEES FE / PE engineering exam outlines (per discipline)
    'mba_core',     -- MBA core curriculum (finance / strategy / ops / etc.)
    'eureka_custom' -- Internal augmentations: tagged-but-uncodified skills
);

CREATE TYPE bloom_level AS ENUM (
    'remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'
);

-- ----------------------------------------------------------------------------
-- skills
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Framework + native code. (framework, code) is the natural key.
    -- Example: ('ccss', 'CCSS.MATH.CONTENT.HSA.REI.B.4.A') or
    --          ('usmle', 'STEP1.IM.CARD.HF.SYS.DIASTOLIC').
    framework skill_framework NOT NULL,
    code VARCHAR(120) NOT NULL,

    -- Human-readable fields
    name VARCHAR(300) NOT NULL,
    description TEXT,

    -- The EUREKA tier this skill primarily lives in. Maps loosely to
    -- tier_kind from the learner spine (Phase 4.1). NOT a foreign key —
    -- a skill can legitimately span tiers (eg HS calc → UG calc carries
    -- the same standard). Use this for filtering, not for hard scoping.
    tier VARCHAR(40) NOT NULL,

    bloom_level bloom_level,

    -- Hierarchy (forest). NULL parent_id means a framework root.
    parent_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    -- Materialized depth (0 = root) for efficient ancestor/descendant
    -- queries without recursive CTEs at read time. Maintained by app code.
    depth INTEGER NOT NULL DEFAULT 0,

    -- Metadata: alternative codes, deprecation flags, source URLs, etc.
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Lifecycle
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deprecated_at TIMESTAMP,
    superseded_by_id UUID REFERENCES skills(id),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    -- A framework code is unique within that framework. (Composite key,
    -- not a single column, because two frameworks can have overlapping
    -- code spaces.)
    CONSTRAINT uq_skills_framework_code UNIQUE (framework, code)
);

CREATE INDEX IF NOT EXISTS idx_skills_framework ON skills(framework);
CREATE INDEX IF NOT EXISTS idx_skills_tier ON skills(tier);
CREATE INDEX IF NOT EXISTS idx_skills_parent ON skills(parent_id);
CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_skills_name_trgm ON skills USING gin (name gin_trgm_ops);

-- pg_trgm for fuzzy-name search. Skip silently if extension is unavailable.
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_trgm extension not available; trigram index skipped';
END $$;

-- ----------------------------------------------------------------------------
-- skill_prerequisites — directed DAG, separate from hierarchy
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- The skill that depends on the prerequisite (the "successor").
    successor_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    -- The skill that must be mastered first (the "predecessor").
    prerequisite_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    -- Strength: 1.0 means "absolutely required", 0.5 means "helpful but
    -- not required". The recommender uses this to weight unlock paths.
    strength NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    -- Free-form note explaining the dependency (eg "covers chain rule used
    -- in the related-rates problems below").
    rationale TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT strength_in_range CHECK (strength >= 0 AND strength <= 1),
    CONSTRAINT no_self_prereq CHECK (successor_id <> prerequisite_id),
    CONSTRAINT uq_skill_prereq UNIQUE (successor_id, prerequisite_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_prereq_succ ON skill_prerequisites(successor_id);
CREATE INDEX IF NOT EXISTS idx_skill_prereq_pre ON skill_prerequisites(prerequisite_id);

-- ----------------------------------------------------------------------------
-- content_skills — many-to-many tag table
--
-- content_type discriminates what the content_id points at; we don't FK
-- across because each content kind lives in its own table (courses,
-- assessments, questions, content_items, ...) and we want a single tag
-- table that doesn't bloat with per-type columns.
-- ----------------------------------------------------------------------------
CREATE TYPE content_kind AS ENUM (
    'course', 'course_module', 'assessment', 'question',
    'content_item', 'external_url'
);

CREATE TABLE IF NOT EXISTS content_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    content_kind content_kind NOT NULL,
    content_id UUID NOT NULL,
    -- Coverage strength: how strongly does this content cover this skill?
    -- 1.0 = primary focus; 0.3 = touches on it.
    coverage NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    -- Per-tag Bloom — a question can target "apply" of a skill whose
    -- nominal bloom_level is "understand", for example.
    bloom_level bloom_level,
    -- Who tagged it: 'system' (auto from LLM), 'sme' (human SME), 'imported'
    tagged_by VARCHAR(40) NOT NULL DEFAULT 'system',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT coverage_in_range CHECK (coverage >= 0 AND coverage <= 1),
    CONSTRAINT uq_content_skill UNIQUE (content_kind, content_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_content_skills_skill ON content_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_content_skills_content ON content_skills(content_kind, content_id);

-- ----------------------------------------------------------------------------
-- learner_skill_mastery — denormalized per-(learner, skill) state
--
-- Authoritative copy lives in learner_profiles.knowledge_state JSONB
-- (Phase 4.1). This table is the analytic projection: it joins easily
-- to skills + tier_enrollments and supports the dashboard queries the
-- JSONB form is awkward for. The app keeps both in sync on write.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learner_skill_mastery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    -- Mastery score in [0, 1]. The model that computes this (Phase 6)
    -- is one of: simple EWMA on accuracy, BKT (Bayesian Knowledge Tracing),
    -- or DKT (Deep Knowledge Tracing). The column doesn't care which.
    mastery NUMERIC(4, 3) NOT NULL DEFAULT 0,
    -- How many distinct attempts have informed the score.
    attempts INTEGER NOT NULL DEFAULT 0,
    -- Last time the learner exercised this skill (for spaced-repetition decay).
    last_practiced_at TIMESTAMP,
    -- When the spaced-repetition scheduler thinks the score should decay.
    next_review_at TIMESTAMP,
    -- Bloom level this mastery was measured at (a learner can be at
    -- "understand" for a skill while not yet at "apply").
    measured_at_bloom bloom_level,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT mastery_in_range CHECK (mastery >= 0 AND mastery <= 1),
    CONSTRAINT uq_learner_skill UNIQUE (user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_lsm_user ON learner_skill_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_lsm_skill ON learner_skill_mastery(skill_id);
CREATE INDEX IF NOT EXISTS idx_lsm_user_mastery ON learner_skill_mastery(user_id, mastery);
