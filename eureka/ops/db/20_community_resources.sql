-- ============================================================================
-- Phase 18 — Real community + resources catalog
--
-- community_threads + community_posts + community_reactions
--   real discussion forum (no more hardcoded forum mock)
--
-- learning_resources
--   curated catalog of links/videos/papers/etc., tagged into the Phase 4.2
--   skill graph + tiers. Replaces the hardcoded "Resources" mock list.
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE community_target_kind AS ENUM ('thread', 'post');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE community_reaction_kind AS ENUM ('upvote', 'helpful', 'insightful');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE resource_kind AS ENUM (
        'video', 'article', 'book', 'paper', 'tutorial',
        'documentation', 'course', 'tool', 'dataset', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ---------------------------------------------------------------------------
-- community_threads
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS community_threads (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(280) NOT NULL,
    body_md             TEXT NOT NULL,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    -- Optional skill the thread is "about" — surfaces under
    -- /learning-path → "Discussions on this skill".
    skill_code          VARCHAR(120),
    -- Optional tier filter for /community?tier=undergraduate.
    tier                VARCHAR(40),
    pinned              BOOLEAN NOT NULL DEFAULT FALSE,
    locked              BOOLEAN NOT NULL DEFAULT FALSE,
    reply_count         INTEGER NOT NULL DEFAULT 0,
    upvote_count        INTEGER NOT NULL DEFAULT 0,
    last_activity_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_threads_org_last
    ON community_threads(org_id, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_threads_skill
    ON community_threads(skill_code) WHERE skill_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comm_threads_tier
    ON community_threads(tier, last_activity_at DESC) WHERE tier IS NOT NULL;


-- ---------------------------------------------------------------------------
-- community_posts (replies + nested replies)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS community_posts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id           UUID NOT NULL REFERENCES community_threads(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_post_id      UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    body_md             TEXT NOT NULL,
    upvote_count        INTEGER NOT NULL DEFAULT 0,
    -- Author of the thread can mark one post as the accepted answer.
    is_accepted_answer  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_posts_thread_created
    ON community_posts(thread_id, created_at);


-- ---------------------------------------------------------------------------
-- community_reactions (upvotes / "helpful" / "insightful" — one per user/target)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS community_reactions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_kind         community_target_kind NOT NULL,
    target_id           UUID NOT NULL,
    kind                community_reaction_kind NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_reaction_per_user UNIQUE (user_id, target_kind, target_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_comm_reactions_target
    ON community_reactions(target_kind, target_id);


-- Triggers: maintain reply_count + upvote_count on threads & posts.
CREATE OR REPLACE FUNCTION bump_thread_reply_count()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE community_threads
        SET reply_count = reply_count + 1,
            last_activity_at = NOW()
        WHERE id = NEW.thread_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE community_threads
        SET reply_count = GREATEST(0, reply_count - 1)
        WHERE id = OLD.thread_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_count_ins ON community_posts;
CREATE TRIGGER trg_post_count_ins
    AFTER INSERT ON community_posts
    FOR EACH ROW EXECUTE FUNCTION bump_thread_reply_count();

DROP TRIGGER IF EXISTS trg_post_count_del ON community_posts;
CREATE TRIGGER trg_post_count_del
    AFTER DELETE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION bump_thread_reply_count();


CREATE OR REPLACE FUNCTION bump_upvote_count()
RETURNS trigger AS $$
DECLARE
    delta INTEGER;
    r RECORD;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        delta := 1;
        r := NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        delta := -1;
        r := OLD;
    ELSE
        RETURN NULL;
    END IF;

    IF r.kind = 'upvote' THEN
        IF r.target_kind = 'thread' THEN
            UPDATE community_threads
            SET upvote_count = GREATEST(0, upvote_count + delta)
            WHERE id = r.target_id;
        ELSIF r.target_kind = 'post' THEN
            UPDATE community_posts
            SET upvote_count = GREATEST(0, upvote_count + delta)
            WHERE id = r.target_id;
        END IF;
    END IF;

    IF TG_OP = 'INSERT' THEN RETURN NEW; ELSE RETURN OLD; END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reaction_ins ON community_reactions;
CREATE TRIGGER trg_reaction_ins
    AFTER INSERT ON community_reactions
    FOR EACH ROW EXECUTE FUNCTION bump_upvote_count();

DROP TRIGGER IF EXISTS trg_reaction_del ON community_reactions;
CREATE TRIGGER trg_reaction_del
    AFTER DELETE ON community_reactions
    FOR EACH ROW EXECUTE FUNCTION bump_upvote_count();


-- Touch triggers
DROP TRIGGER IF EXISTS trg_comm_threads_touch ON community_threads;
CREATE TRIGGER trg_comm_threads_touch
    BEFORE UPDATE ON community_threads
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_comm_posts_touch ON community_posts;
CREATE TRIGGER trg_comm_posts_touch
    BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- ---------------------------------------------------------------------------
-- learning_resources (curated catalog)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS learning_resources (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id              UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    title               VARCHAR(280) NOT NULL,
    kind                resource_kind NOT NULL,
    url                 TEXT,
    description_md      TEXT,
    -- Optional Phase 4.2 skill code anchoring this resource.
    skill_code          VARCHAR(120),
    -- Optional tier filter (high_school / undergraduate / medical / test_prep / graduate).
    tier                VARCHAR(40),
    tags                TEXT[] NOT NULL DEFAULT '{}',
    is_public           BOOLEAN NOT NULL DEFAULT TRUE,
    upvote_count        INTEGER NOT NULL DEFAULT 0,
    -- Optional Phase 5 author rank — for future curated SME contributions.
    sme_endorsed        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_resources_org
    ON learning_resources(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_resources_skill
    ON learning_resources(skill_code) WHERE skill_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_learning_resources_tier
    ON learning_resources(tier, created_at DESC) WHERE tier IS NOT NULL;


-- learning_resource_votes (per-user, prevents double-vote)
CREATE TABLE IF NOT EXISTS learning_resource_votes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id         UUID NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_resource_vote UNIQUE (resource_id, user_id)
);

CREATE OR REPLACE FUNCTION bump_resource_upvote()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE learning_resources SET upvote_count = upvote_count + 1
        WHERE id = NEW.resource_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE learning_resources SET upvote_count = GREATEST(0, upvote_count - 1)
        WHERE id = OLD.resource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resource_vote_ins ON learning_resource_votes;
CREATE TRIGGER trg_resource_vote_ins
    AFTER INSERT ON learning_resource_votes
    FOR EACH ROW EXECUTE FUNCTION bump_resource_upvote();

DROP TRIGGER IF EXISTS trg_resource_vote_del ON learning_resource_votes;
CREATE TRIGGER trg_resource_vote_del
    AFTER DELETE ON learning_resource_votes
    FOR EACH ROW EXECUTE FUNCTION bump_resource_upvote();

DROP TRIGGER IF EXISTS trg_learning_resources_touch ON learning_resources;
CREATE TRIGGER trg_learning_resources_touch
    BEFORE UPDATE ON learning_resources
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
