-- ============================================================================
-- Phase 16.2 — Research workspaces + literature review + drafts.
--
-- Replaces the Phase 17 user_collections placeholder at /dashboard/graduate/
-- research with a proper research-grade backend.
--
-- Three tables:
--   research_workspaces   one per project; tied to a graduate_enrollment
--                         (optional — postdocs / independent researchers
--                         can have a workspace without an enrollment).
--   lit_review_entries    one row per reference (CrossRef / arXiv / manual).
--                         Includes raw + normalized BibTeX; doi/arxiv_id
--                         indexed for dedupe.
--   workspace_drafts      versioned freeform markdown drafts (writeups,
--                         talk outlines, grant sections).
--
-- Citation export (BibTeX, RIS, JSON) and CrossRef/arXiv lookups land in
-- Phase 16.2 endpoints, not in this schema.
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE workspace_kind AS ENUM (
        'thesis', 'paper', 'grant_application', 'literature_review',
        'meta_analysis', 'replication_study', 'class_project', 'misc'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE workspace_status AS ENUM (
        'active', 'paused', 'completed', 'archived'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE reference_source AS ENUM (
        'crossref', 'arxiv', 'pubmed', 'semantic_scholar', 'manual', 'doi', 'isbn'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE draft_kind AS ENUM (
        'thesis_chapter', 'paper_section', 'grant_section',
        'lit_review_summary', 'talk_outline', 'misc'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- research_workspaces
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS research_workspaces (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Optional link to the graduate_enrollment this workspace belongs to.
    -- NULL = independent / postdoc / personal research project.
    enrollment_id       UUID REFERENCES graduate_enrollments(id) ON DELETE SET NULL,
    title               VARCHAR(280) NOT NULL,
    description_md      TEXT,
    kind                workspace_kind NOT NULL DEFAULT 'paper',
    status              workspace_status NOT NULL DEFAULT 'active',
    -- Research focus / keywords for cross-workspace discovery.
    tags                TEXT[] NOT NULL DEFAULT '{}',
    -- Optional Phase 4.2 skill_code anchoring (e.g. 'GRAD.ML.THEORY').
    skill_code          VARCHAR(120),
    -- Shareability — public workspaces appear on the scholar profile (Phase 16.5).
    is_public           BOOLEAN NOT NULL DEFAULT FALSE,
    -- Cached counters so the index page doesn't fan-out queries.
    reference_count     INTEGER NOT NULL DEFAULT 0,
    draft_count         INTEGER NOT NULL DEFAULT 0,
    last_activity_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_workspaces_user
    ON research_workspaces(user_id, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_workspaces_enrollment
    ON research_workspaces(enrollment_id) WHERE enrollment_id IS NOT NULL;


-- ---------------------------------------------------------------------------
-- lit_review_entries
--
-- One row per cited reference. Phase 16.2 endpoints will populate this
-- via CrossRef / arXiv / PubMed lookup; the `raw_metadata` JSONB stores
-- the upstream response verbatim for forensics + BibTeX regeneration.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS lit_review_entries (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id        UUID NOT NULL REFERENCES research_workspaces(id) ON DELETE CASCADE,
    -- Where the metadata came from.
    source              reference_source NOT NULL DEFAULT 'manual',
    -- Stable external identifiers (one or more usually populated).
    doi                 VARCHAR(280),
    arxiv_id            VARCHAR(80),
    pubmed_id           VARCHAR(40),
    isbn                VARCHAR(20),
    -- Normalized citation fields.
    title               VARCHAR(500) NOT NULL,
    authors             TEXT[] NOT NULL DEFAULT '{}',
    venue               VARCHAR(280),
    year                INTEGER CHECK (year IS NULL OR (year BETWEEN 1500 AND 2200)),
    abstract            TEXT,
    -- User-supplied annotations.
    user_notes_md       TEXT,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    -- Has the researcher actually read this yet?
    read_status         VARCHAR(20) NOT NULL DEFAULT 'unread'
        CHECK (read_status IN ('unread','reading','read','dismissed')),
    rating              INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    -- Optional BibTeX entry (auto-rendered on export; cached here for stability).
    bibtex              TEXT,
    -- Verbatim upstream metadata (full CrossRef / arXiv / PubMed payload).
    raw_metadata        JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Dedupe: a workspace shouldn't have the same DOI / arXiv ID twice.
CREATE UNIQUE INDEX IF NOT EXISTS uq_lit_entries_workspace_doi
    ON lit_review_entries(workspace_id, doi) WHERE doi IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_lit_entries_workspace_arxiv
    ON lit_review_entries(workspace_id, arxiv_id) WHERE arxiv_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lit_entries_workspace
    ON lit_review_entries(workspace_id, created_at DESC);


-- ---------------------------------------------------------------------------
-- workspace_drafts
--
-- Markdown drafts of papers, thesis chapters, grant sections, talk outlines.
-- Versioned via a parent pointer (latest_version_id on the workspace + a chain).
-- Phase 16.2 keeps it simple: one editable "current" body + a separate
-- snapshots table. For now: just store the current body. Snapshot history
-- can ship as a follow-up if real users want it.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workspace_drafts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id        UUID NOT NULL REFERENCES research_workspaces(id) ON DELETE CASCADE,
    title               VARCHAR(280) NOT NULL,
    kind                draft_kind NOT NULL DEFAULT 'misc',
    -- Ordering within the workspace (chapter 1, 2, 3 …).
    sort_index          INTEGER NOT NULL DEFAULT 0,
    body_md             TEXT NOT NULL DEFAULT '',
    -- Word count cached so the workspace page doesn't recompute.
    word_count          INTEGER NOT NULL DEFAULT 0,
    -- Tags for organising drafts within a workspace.
    tags                TEXT[] NOT NULL DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspace_drafts_workspace
    ON workspace_drafts(workspace_id, sort_index);


-- ---------------------------------------------------------------------------
-- Touch + counter triggers (reuse Phase 10's touch_updated_at function).
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_research_workspaces_touch ON research_workspaces;
CREATE TRIGGER trg_research_workspaces_touch
    BEFORE UPDATE ON research_workspaces
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_lit_entries_touch ON lit_review_entries;
CREATE TRIGGER trg_lit_entries_touch
    BEFORE UPDATE ON lit_review_entries
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_workspace_drafts_touch ON workspace_drafts;
CREATE TRIGGER trg_workspace_drafts_touch
    BEFORE UPDATE ON workspace_drafts
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- Workspace counter triggers
CREATE OR REPLACE FUNCTION bump_workspace_reference_count()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE research_workspaces
        SET reference_count = reference_count + 1,
            last_activity_at = NOW()
        WHERE id = NEW.workspace_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE research_workspaces
        SET reference_count = GREATEST(0, reference_count - 1)
        WHERE id = OLD.workspace_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lit_count_ins ON lit_review_entries;
CREATE TRIGGER trg_lit_count_ins
    AFTER INSERT ON lit_review_entries
    FOR EACH ROW EXECUTE FUNCTION bump_workspace_reference_count();

DROP TRIGGER IF EXISTS trg_lit_count_del ON lit_review_entries;
CREATE TRIGGER trg_lit_count_del
    AFTER DELETE ON lit_review_entries
    FOR EACH ROW EXECUTE FUNCTION bump_workspace_reference_count();


CREATE OR REPLACE FUNCTION bump_workspace_draft_count()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE research_workspaces
        SET draft_count = draft_count + 1,
            last_activity_at = NOW()
        WHERE id = NEW.workspace_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE research_workspaces
        SET draft_count = GREATEST(0, draft_count - 1)
        WHERE id = OLD.workspace_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_drafts_count_ins ON workspace_drafts;
CREATE TRIGGER trg_drafts_count_ins
    AFTER INSERT ON workspace_drafts
    FOR EACH ROW EXECUTE FUNCTION bump_workspace_draft_count();

DROP TRIGGER IF EXISTS trg_drafts_count_del ON workspace_drafts;
CREATE TRIGGER trg_drafts_count_del
    AFTER DELETE ON workspace_drafts
    FOR EACH ROW EXECUTE FUNCTION bump_workspace_draft_count();
