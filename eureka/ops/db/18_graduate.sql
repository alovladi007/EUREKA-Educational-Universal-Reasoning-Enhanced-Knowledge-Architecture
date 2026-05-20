-- ============================================================================
-- Phase 16 — Graduate school tier
--
-- 16.1 graduate_programs, graduate_enrollments, degree_milestones,
--      program_skill_targets
--
-- Note (per user requirement, 2026-05): no advisors / no committees /
-- no committee_meetings. Every enrollment has a single optional
-- `supervisor_user_id` field (a faculty user who can decide milestones).
-- The Research Tools suite (16.6 + 16.7) is what makes graduate users
-- choose EUREKA over a thin "graduate dashboard" elsewhere.
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE degree_kind AS ENUM (
        'masters_thesis', 'masters_coursework', 'masters_professional',
        'phd', 'doctoral_professional', 'postdoc', 'certificate'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE grad_program_status AS ENUM ('draft', 'active', 'paused', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE grad_enrollment_status AS ENUM (
        'applied', 'admitted', 'enrolled', 'on_leave',
        'withdrawn', 'graduated', 'dismissed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE milestone_kind AS ENUM (
        'coursework',          -- pass N units / set of courses
        'qualifying_exam',     -- pass qualifying / candidacy exam
        'proposal',            -- defend research proposal
        'irb',                 -- IRB / ethics approval (handled in 16.3)
        'data_collection',     -- generic research milestone
        'manuscript',          -- write up / paper submission
        'thesis_draft',        -- draft submitted to supervisor
        'thesis_defense',      -- final defense (handled in 16.3)
        'teaching',            -- TA / RA service (handled in 16.5)
        'publication',         -- first-author publication (handled in 16.5)
        'custom'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status AS ENUM (
        'not_started', 'in_progress', 'submitted',
        'approved', 'changes_requested', 'failed', 'waived'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 16.1.1 — Graduate programs (catalog rows owned by an org / partnership)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS graduate_programs (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id                   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    slug                     VARCHAR(120) NOT NULL,
    name                     VARCHAR(200) NOT NULL,
    degree_kind              degree_kind NOT NULL,
    department               VARCHAR(160),
    description_md           TEXT,
    -- Catalog targets - the program "promises" these.
    target_years             NUMERIC(3,1) NOT NULL DEFAULT 2.0
        CHECK (target_years BETWEEN 0.5 AND 12.0),
    min_credits              INTEGER NOT NULL DEFAULT 30
        CHECK (min_credits BETWEEN 0 AND 500),
    requires_thesis          BOOLEAN NOT NULL DEFAULT FALSE,
    requires_qualifying_exam BOOLEAN NOT NULL DEFAULT FALSE,
    -- Phase 4.3 cert code minted on graduation (e.g. "phd-cs-2026").
    completion_cert_code     VARCHAR(80),
    -- Optional capacity / cohort scaffolding.
    cohort_id                UUID REFERENCES cohorts(id) ON DELETE SET NULL,
    status                   grad_program_status NOT NULL DEFAULT 'draft',
    created_by               UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_grad_program_slug UNIQUE (org_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_grad_programs_org ON graduate_programs(org_id, status);
CREATE INDEX IF NOT EXISTS idx_grad_programs_dept ON graduate_programs(department);


-- ---------------------------------------------------------------------------
-- 16.1.2 — Program skill targets (which Phase 4.2 skills the program builds)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS program_skill_targets (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id          UUID NOT NULL REFERENCES graduate_programs(id) ON DELETE CASCADE,
    skill_code          VARCHAR(120) NOT NULL,
    target_mastery      NUMERIC(4,3) NOT NULL DEFAULT 0.85
        CHECK (target_mastery BETWEEN 0 AND 1),
    is_required         BOOLEAN NOT NULL DEFAULT TRUE,
    description         TEXT,
    CONSTRAINT uq_program_skill UNIQUE (program_id, skill_code)
);

CREATE INDEX IF NOT EXISTS idx_program_skill_program ON program_skill_targets(program_id);


-- ---------------------------------------------------------------------------
-- 16.1.3 — Graduate enrollments (per learner, per program)
--
-- Crucially: ONE supervisor_user_id field, nothing else. No committees,
-- no advisor links table, no committee_meetings. Manageable for the
-- small grad cohorts EUREKA targets without modelling a whole HR system.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS graduate_enrollments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id          UUID NOT NULL REFERENCES graduate_programs(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Optional single supervisor — a faculty user who can decide milestones.
    -- Renamed from "advisor" intentionally so it cannot grow into a model
    -- of academic relationships.
    supervisor_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    status              grad_enrollment_status NOT NULL DEFAULT 'enrolled',
    -- Date-stamps capture the lifecycle without needing a separate log table.
    applied_at          TIMESTAMP WITH TIME ZONE,
    admitted_at         TIMESTAMP WITH TIME ZONE,
    enrolled_at         TIMESTAMP WITH TIME ZONE,
    expected_graduation DATE,
    graduated_at        TIMESTAMP WITH TIME ZONE,
    withdrawn_at        TIMESTAMP WITH TIME ZONE,
    withdrawal_reason   TEXT,
    -- Cached progress so the dashboard doesn't recompute on every page load.
    credits_earned      INTEGER NOT NULL DEFAULT 0,
    milestones_done     INTEGER NOT NULL DEFAULT 0,
    milestones_total    INTEGER NOT NULL DEFAULT 0,
    gpa                 NUMERIC(4,3),
    -- Free-form research focus a learner declares.
    research_focus      TEXT,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_grad_enrollment UNIQUE (program_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_grad_enrol_user ON graduate_enrollments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_grad_enrol_program ON graduate_enrollments(program_id, status);
CREATE INDEX IF NOT EXISTS idx_grad_enrol_supervisor
    ON graduate_enrollments(supervisor_user_id)
    WHERE supervisor_user_id IS NOT NULL;


-- ---------------------------------------------------------------------------
-- 16.1.4 — Degree milestones (per enrollment, the workflow rows)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS degree_milestones (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id       UUID NOT NULL REFERENCES graduate_enrollments(id) ON DELETE CASCADE,
    kind                milestone_kind NOT NULL,
    title               VARCHAR(200) NOT NULL,
    description_md      TEXT,
    sequence            INTEGER NOT NULL DEFAULT 0,
    due_at              DATE,
    -- Workflow state — submitted by the learner, decided by the supervisor.
    status              milestone_status NOT NULL DEFAULT 'not_started',
    submitted_at        TIMESTAMP WITH TIME ZONE,
    decided_at          TIMESTAMP WITH TIME ZONE,
    -- Whoever flipped status to approved / changes_requested / failed / waived.
    decided_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    -- Supervisor's written decision (markdown).
    decision_notes      TEXT,
    -- Optional pointer to a Phase 13.4 file_uploads row (thesis PDF, exam, etc.)
    artifact_url        TEXT,
    -- Whether this milestone counts toward "milestones_done" for graduation.
    counts_for_graduation BOOLEAN NOT NULL DEFAULT TRUE,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_enrol
    ON degree_milestones(enrollment_id, sequence);
CREATE INDEX IF NOT EXISTS idx_milestones_due
    ON degree_milestones(due_at)
    WHERE status IN ('not_started', 'in_progress', 'changes_requested');


-- ---------------------------------------------------------------------------
-- Touch triggers (reuse Phase 10's touch_updated_at function).
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_grad_programs_touch ON graduate_programs;
CREATE TRIGGER trg_grad_programs_touch
    BEFORE UPDATE ON graduate_programs
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_grad_enrol_touch ON graduate_enrollments;
CREATE TRIGGER trg_grad_enrol_touch
    BEFORE UPDATE ON graduate_enrollments
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_milestones_touch ON degree_milestones;
CREATE TRIGGER trg_milestones_touch
    BEFORE UPDATE ON degree_milestones
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
