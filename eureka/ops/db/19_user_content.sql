-- ============================================================================
-- Phase 17 — "No-mocks dashboard" backing tables
--
-- Three tiny tables that back the lightweight sidebar surfaces that
-- previously rendered hardcoded data:
--
--   activity_events    — feeds /dashboard home, /community, /me activity
--   user_collections   — backs /notebook + /resources + reading lists +
--                        community saved-posts collections
--   collection_items   — heterogeneous items in a collection (skill,
--                        item, course, listing, kb_article, url, note)
--
-- Deliberately schema-light so multiple sidebar surfaces share the same
-- backend rather than each needing its own table.
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE activity_kind AS ENUM (
        'attempt_completed',   -- finished a practice question
        'mock_completed',      -- finished a mock exam
        'skill_mastered',      -- crossed mastery threshold for a skill
        'course_enrolled',     -- registered for a course
        'course_completed',    -- finished a course
        'note_created',        -- added a notebook entry
        'collection_created',  -- created a new reading list / notebook
        'collection_item_added',
        'community_posted',    -- new community post / question
        'community_replied',   -- replied to a community thread
        'achievement_earned',  -- Phase 12 achievement
        'streak_milestone',    -- streak hit N days
        'tutor_session',       -- AI tutor session
        'resource_bookmarked', -- saved a learning resource
        'profile_updated',
        'system'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE collection_kind AS ENUM (
        'notebook',         -- /notebook research workbook (live now; expanded later)
        'reading_list',     -- /resources curated reading
        'bookmark_set',     -- generic bookmarks
        'community_saved',  -- saved community posts
        'study_set',        -- a set of flashcards / items to drill
        'custom'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE collection_item_kind AS ENUM (
        'note',          -- free-form markdown body
        'skill',         -- ref_table=skills
        'item',          -- ref_table=items
        'course',        -- ref_table=courses
        'listing',       -- ref_table=course_listings
        'kb_article',    -- ref_table=kb_articles
        'thread',        -- community thread (ref_table=community_threads)
        'url',           -- external URL with title + description
        'achievement',   -- ref_table=achievements
        'attempt',       -- ref_table=attempt_logs
        'custom'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- activity_events
--
-- Append-only log. /me/activity sorts desc by created_at. /community/feed
-- joins user → org → activity_events for an org-wide trending tab later.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS activity_events (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    kind                activity_kind NOT NULL,
    -- Free-text one-liner ("Mastered AP.CALC.BC.U6")
    summary             VARCHAR(280) NOT NULL,
    -- Optional pointer to the source row.
    ref_table           VARCHAR(80),
    ref_id              UUID,
    -- Anything else worth surfacing in the UI (XP delta, skill code, etc.)
    payload             JSONB NOT NULL DEFAULT '{}',
    -- True only when visible to org members on the community feed.
    is_public           BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user_created
    ON activity_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_org_public_created
    ON activity_events(org_id, created_at DESC)
    WHERE is_public IS TRUE;


-- ---------------------------------------------------------------------------
-- user_collections
--
-- Notebook / reading list / bookmark set / community-saved / study-set.
-- One row per collection per user; items live in collection_items.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_collections (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind                collection_kind NOT NULL DEFAULT 'notebook',
    title               VARCHAR(200) NOT NULL,
    description_md      TEXT,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    -- Optional skill the collection is "about" — surfaces in
    -- /learning-path → "Saved for this skill".
    skill_code          VARCHAR(120),
    is_pinned           BOOLEAN NOT NULL DEFAULT FALSE,
    -- Visibility flag — shareable collections show up at /u/{slug}
    -- (Phase 17.2 will use this once we add the public route).
    is_public           BOOLEAN NOT NULL DEFAULT FALSE,
    -- Cached counter so the list view doesn't recompute per row.
    item_count          INTEGER NOT NULL DEFAULT 0,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_user
    ON user_collections(user_id, kind, updated_at DESC);


CREATE TABLE IF NOT EXISTS collection_items (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id       UUID NOT NULL REFERENCES user_collections(id) ON DELETE CASCADE,
    kind                collection_item_kind NOT NULL,
    -- Heterogeneous: ref_table tells you what ref_id means.
    ref_table           VARCHAR(80),
    ref_id              UUID,
    -- Free-text fields that apply to every kind.
    title               VARCHAR(280),
    body_md             TEXT,
    url                 TEXT,
    -- Sort order within the collection (0 = first).
    sort_index          INTEGER NOT NULL DEFAULT 0,
    payload             JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_collection
    ON collection_items(collection_id, sort_index);


-- Touch triggers reuse Phase 10's touch_updated_at function.
DROP TRIGGER IF EXISTS trg_user_collections_touch ON user_collections;
CREATE TRIGGER trg_user_collections_touch
    BEFORE UPDATE ON user_collections
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_collection_items_touch ON collection_items;
CREATE TRIGGER trg_collection_items_touch
    BEFORE UPDATE ON collection_items
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- Cache-counter triggers: bump user_collections.item_count on insert/delete.
CREATE OR REPLACE FUNCTION bump_collection_item_count()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE user_collections
        SET item_count = item_count + 1
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE user_collections
        SET item_count = GREATEST(0, item_count - 1)
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_items_count_ins ON collection_items;
CREATE TRIGGER trg_items_count_ins
    AFTER INSERT ON collection_items
    FOR EACH ROW EXECUTE FUNCTION bump_collection_item_count();

DROP TRIGGER IF EXISTS trg_items_count_del ON collection_items;
CREATE TRIGGER trg_items_count_del
    AFTER DELETE ON collection_items
    FOR EACH ROW EXECUTE FUNCTION bump_collection_item_count();
