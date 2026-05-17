-- ============================================================================
-- Phase 14 — Production scale + operability
--
-- 14.1 Redis cache layer  (no DB tables; just config)
-- 14.2 Background job queue: tasks table + worker leases
-- 14.3 Prometheus metrics (no DB tables; in-process counters + scrape endpoint)
-- 14.4 Autocomplete via pg_trgm — indexes only, no new tables
-- 14.5 Health + readiness probes (no DB tables)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('queued', 'running', 'succeeded', 'failed', 'dead');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 14.2  Background jobs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS background_jobs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- e.g. "webhook.deliver", "email.send", "study_plan.regenerate",
    --      "payout.accrue", "compliance.export.build", "rank.recompute"
    kind            VARCHAR(80) NOT NULL,
    -- arbitrary payload describing what the worker should do
    payload         JSONB NOT NULL DEFAULT '{}',
    status          job_status NOT NULL DEFAULT 'queued',
    -- when the job is allowed to start (used for retry backoff)
    scheduled_for   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    -- worker lease: while leased_by is set, no other worker should pick this row
    leased_by       VARCHAR(80),
    leased_at       TIMESTAMP WITH TIME ZONE,
    lease_expires_at TIMESTAMP WITH TIME ZONE,
    attempt_n       INTEGER NOT NULL DEFAULT 0,
    max_attempts    INTEGER NOT NULL DEFAULT 5,
    last_error      TEXT,
    result_jsonb    JSONB,
    -- optional priority: lower runs first (default 100)
    priority        INTEGER NOT NULL DEFAULT 100,
    -- optional dedupe key. UNIQUE WHERE status IN ('queued', 'running').
    dedupe_key      VARCHAR(160),
    queued_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    started_at      TIMESTAMP WITH TIME ZONE,
    finished_at     TIMESTAMP WITH TIME ZONE
);

-- One queued/running job per dedupe_key at a time.
CREATE UNIQUE INDEX IF NOT EXISTS uq_job_dedupe_active
    ON background_jobs(dedupe_key)
    WHERE status IN ('queued', 'running') AND dedupe_key IS NOT NULL;

-- Worker pull index: pull queued jobs whose schedule has arrived, ordered by priority.
CREATE INDEX IF NOT EXISTS idx_jobs_pull
    ON background_jobs(status, scheduled_for, priority)
    WHERE status IN ('queued', 'running');

CREATE INDEX IF NOT EXISTS idx_jobs_kind ON background_jobs(kind, queued_at DESC);


-- ---------------------------------------------------------------------------
-- 14.4  Autocomplete: trigram indexes on the things users search
-- ---------------------------------------------------------------------------

-- pg_trgm should already be installed from Phase 5; ensure it.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Skill name + code
CREATE INDEX IF NOT EXISTS idx_skills_name_trgm    ON skills USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_skills_code_trgm    ON skills USING GIN (code gin_trgm_ops);
-- Course catalog
CREATE INDEX IF NOT EXISTS idx_courses_title_trgm  ON courses USING GIN (title gin_trgm_ops);
-- Marketplace listings (added Phase 10)
CREATE INDEX IF NOT EXISTS idx_listings_headline_trgm ON course_listings USING GIN (headline gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_listings_slug_trgm     ON course_listings USING GIN (slug gin_trgm_ops);
-- Instructor profiles (Phase 10)
CREATE INDEX IF NOT EXISTS idx_instructors_name_trgm  ON instructor_profiles USING GIN (display_name gin_trgm_ops);
-- KB articles (Phase 11.5)
CREATE INDEX IF NOT EXISTS idx_kb_title_trgm          ON kb_articles USING GIN (title gin_trgm_ops);
