-- ===========================================================================
-- 25_research_collab.sql — Phase 16.2 R-1: research collaboration layer
--
-- Extends the EXISTING solo research workspace (21_research_workspaces.sql)
-- rather than duplicating it:
--   * research_workspace_members — share a workspace with org members.
--     v1: members get READ access to the workspace + its lit review/drafts;
--     collaborator write access lands in R-2.
--   * research_groups (+ members) — labs / reading groups, org-visible,
--     open-join (same v1 semantics as study groups).
-- ===========================================================================

CREATE TABLE IF NOT EXISTS research_workspace_members (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id        UUID NOT NULL REFERENCES research_workspaces(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role                VARCHAR(20) NOT NULL DEFAULT 'viewer',  -- viewer | collaborator
    added_by            UUID REFERENCES users(id) ON DELETE SET NULL,
    joined_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_research_ws_member UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_research_ws_members_user
    ON research_workspace_members(user_id);

CREATE TABLE IF NOT EXISTS research_groups (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(160) NOT NULL,
    description_md      TEXT,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    member_count        INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_groups_org
    ON research_groups(org_id, created_at DESC);

CREATE TABLE IF NOT EXISTS research_group_members (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id            UUID NOT NULL REFERENCES research_groups(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role                VARCHAR(20) NOT NULL DEFAULT 'member',  -- pi | member
    joined_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_research_group_member UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_research_group_members_user
    ON research_group_members(user_id);

CREATE OR REPLACE FUNCTION bump_research_group_member_count()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE research_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE research_groups SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rg_member_ins ON research_group_members;
CREATE TRIGGER trg_rg_member_ins
    AFTER INSERT ON research_group_members
    FOR EACH ROW EXECUTE FUNCTION bump_research_group_member_count();

DROP TRIGGER IF EXISTS trg_rg_member_del ON research_group_members;
CREATE TRIGGER trg_rg_member_del
    AFTER DELETE ON research_group_members
    FOR EACH ROW EXECUTE FUNCTION bump_research_group_member_count();

DROP TRIGGER IF EXISTS trg_research_groups_touch ON research_groups;
CREATE TRIGGER trg_research_groups_touch
    BEFORE UPDATE ON research_groups
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
