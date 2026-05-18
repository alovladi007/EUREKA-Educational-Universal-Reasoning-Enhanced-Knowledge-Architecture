-- ============================================================================
-- Phase 15 — Workforce training affiliate platform
--
-- 15.1 institution_partnerships, seat_assignments
-- 15.2 workforce_programs, program_assignments, program_milestones
-- 15.3 compliance_requirements, training_attestations, compliance_due_dates
-- 15.4 (analytics — aggregates only, no new tables)
-- 15.5 (worker portal — front-end only)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE partnership_kind AS ENUM ('workforce', 'academic', 'both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE partnership_status AS ENUM ('draft', 'active', 'paused', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE program_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE assignment_status AS ENUM (
        'assigned', 'in_progress', 'completed', 'overdue', 'waived'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE compliance_status AS ENUM (
        'compliant', 'due_soon', 'overdue', 'expired', 'not_applicable'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE regulation_kind AS ENUM (
        'hipaa', 'osha', 'soc2', 'gdpr', 'pci_dss', 'iso_27001',
        'sox', 'ferpa', 'sector_specific', 'internal'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- 15.1 — Institution partnerships + seat licensing
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS institution_partnerships (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id                   UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    partnership_kind         partnership_kind NOT NULL DEFAULT 'workforce',
    name                     VARCHAR(160) NOT NULL,
    primary_contact_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    contracted_seats         INTEGER NOT NULL DEFAULT 0 CHECK (contracted_seats >= 0),
    seat_renewal_at          DATE,
    billing_anchor_subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    status                   partnership_status NOT NULL DEFAULT 'draft',
    -- Optional override of platform revenue share for marketplace courses
    -- assigned through this partnership. NULL = use platform default.
    marketplace_discount_bps INTEGER CHECK (marketplace_discount_bps IS NULL OR marketplace_discount_bps BETWEEN 0 AND 10000),
    custom_branding          JSONB NOT NULL DEFAULT '{}',
    -- Optional list of webhook events the partnership receives on its
    -- existing webhook endpoints (Phase 13.2).
    webhook_event_filter     TEXT[] DEFAULT '{*}',
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    activated_at             TIMESTAMP WITH TIME ZONE,
    paused_at                TIMESTAMP WITH TIME ZONE,
    notes_md                 TEXT
);

CREATE INDEX IF NOT EXISTS idx_partnerships_status ON institution_partnerships(status);


CREATE TABLE IF NOT EXISTS seat_assignments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partnership_id      UUID NOT NULL REFERENCES institution_partnerships(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    released_at         TIMESTAMP WITH TIME ZONE,
    release_reason      TEXT,
    -- Free-text job role / team — used by analytics filters.
    role_label          VARCHAR(120),
    team_label          VARCHAR(120),
    manager_user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata            JSONB NOT NULL DEFAULT '{}'
);

-- A user may have at most one active seat per partnership at a time.
CREATE UNIQUE INDEX IF NOT EXISTS uq_seat_active
    ON seat_assignments(partnership_id, user_id) WHERE released_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_seats_partnership ON seat_assignments(partnership_id) WHERE released_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_seats_manager ON seat_assignments(manager_user_id) WHERE released_at IS NULL;


-- ---------------------------------------------------------------------------
-- 15.2 — Workforce programs (role-based curricula)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workforce_programs (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partnership_id           UUID NOT NULL REFERENCES institution_partnerships(id) ON DELETE CASCADE,
    slug                     VARCHAR(120) NOT NULL,
    name                     VARCHAR(160) NOT NULL,
    description_md           TEXT,
    -- Job role the program is designed for ("rn", "swe-l1", "warehouse-lead").
    target_role              VARCHAR(80),
    -- Phase 4.2 skill codes the program builds.
    target_skill_codes       TEXT[] NOT NULL DEFAULT '{}',
    -- Phase 4.3 cert/achievement codes a worker earns on completion.
    required_cert_codes      TEXT[] DEFAULT '{}',
    duration_weeks           INTEGER NOT NULL DEFAULT 8 CHECK (duration_weeks BETWEEN 1 AND 104),
    is_mandatory             BOOLEAN NOT NULL DEFAULT FALSE,
    target_mastery           NUMERIC(4,3) NOT NULL DEFAULT 0.80,
    -- Optional linked study-plan + cohort scaffolding.
    cohort_id                UUID REFERENCES cohorts(id) ON DELETE SET NULL,
    status                   program_status NOT NULL DEFAULT 'draft',
    created_by               UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_program_slug_per_partnership UNIQUE (partnership_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_programs_partnership ON workforce_programs(partnership_id, status);


CREATE TABLE IF NOT EXISTS program_assignments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id          UUID NOT NULL REFERENCES workforce_programs(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    due_at              TIMESTAMP WITH TIME ZONE,
    started_at          TIMESTAMP WITH TIME ZONE,
    completed_at        TIMESTAMP WITH TIME ZONE,
    waived_at           TIMESTAMP WITH TIME ZONE,
    waiver_reason       TEXT,
    status              assignment_status NOT NULL DEFAULT 'assigned',
    progress_pct        NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    -- Linked Phase 12.3 plan if one was auto-generated.
    study_plan_id       UUID REFERENCES study_plans(id) ON DELETE SET NULL,
    CONSTRAINT uq_program_assignment UNIQUE (program_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_user ON program_assignments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_due ON program_assignments(due_at) WHERE completed_at IS NULL;


CREATE TABLE IF NOT EXISTS program_milestones (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id          UUID NOT NULL REFERENCES workforce_programs(id) ON DELETE CASCADE,
    week_index          INTEGER NOT NULL CHECK (week_index >= 0),
    skill_code          VARCHAR(120) NOT NULL,
    target_mastery      NUMERIC(4,3) NOT NULL DEFAULT 0.70,
    description         TEXT,
    CONSTRAINT uq_milestone_per_week_skill UNIQUE (program_id, week_index, skill_code)
);

CREATE INDEX IF NOT EXISTS idx_milestones_program ON program_milestones(program_id, week_index);


-- ---------------------------------------------------------------------------
-- 15.3 — Compliance + required training
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS compliance_requirements (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partnership_id           UUID NOT NULL REFERENCES institution_partnerships(id) ON DELETE CASCADE,
    code                     VARCHAR(80) NOT NULL,
    name                     VARCHAR(160) NOT NULL,
    regulation               regulation_kind NOT NULL,
    description_md           TEXT,
    -- The training program that satisfies the requirement. NULL = manual attestation.
    program_id               UUID REFERENCES workforce_programs(id) ON DELETE SET NULL,
    -- Recurrence (e.g. "12" = annual). 0 = one-time.
    recurrence_months        INTEGER NOT NULL DEFAULT 12 CHECK (recurrence_months >= 0),
    -- How many days before the due_at the system starts nudging.
    nudge_window_days        INTEGER NOT NULL DEFAULT 30,
    attestation_required     BOOLEAN NOT NULL DEFAULT TRUE,
    is_active                BOOLEAN NOT NULL DEFAULT TRUE,
    metadata                 JSONB NOT NULL DEFAULT '{}',
    created_at               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_compliance_code_per_partnership UNIQUE (partnership_id, code)
);

CREATE INDEX IF NOT EXISTS idx_compliance_partnership ON compliance_requirements(partnership_id, is_active);


CREATE TABLE IF NOT EXISTS compliance_due_dates (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id           UUID NOT NULL REFERENCES compliance_requirements(id) ON DELETE CASCADE,
    user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Computed on assignment from program completion + recurrence_months.
    due_at                   TIMESTAMP WITH TIME ZONE NOT NULL,
    last_completed_at        TIMESTAMP WITH TIME ZONE,
    status                   compliance_status NOT NULL DEFAULT 'due_soon',
    last_attestation_id      UUID,
    last_evaluated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_due_date_per_user UNIQUE (requirement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_compliance_due_status ON compliance_due_dates(status, due_at);


CREATE TABLE IF NOT EXISTS training_attestations (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id           UUID NOT NULL REFERENCES compliance_requirements(id) ON DELETE CASCADE,
    user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attested_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    attested_from_ip         VARCHAR(45),
    user_agent               VARCHAR(500),
    -- Immutable acknowledgement text the user agreed to.
    statement                TEXT NOT NULL,
    -- Optional sha256 of supporting evidence (signed cert payload, etc.)
    evidence_hash            VARCHAR(80),
    -- Once written, never updated.
    metadata                 JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_attestations_user ON training_attestations(user_id, attested_at DESC);


-- Touch triggers reuse Phase 10's touch_updated_at function.
DROP TRIGGER IF EXISTS trg_partnerships_touch ON institution_partnerships;
CREATE TRIGGER trg_partnerships_touch
    BEFORE UPDATE ON institution_partnerships
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_programs_touch ON workforce_programs;
CREATE TRIGGER trg_programs_touch
    BEFORE UPDATE ON workforce_programs
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
