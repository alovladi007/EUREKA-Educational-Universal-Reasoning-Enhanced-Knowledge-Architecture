-- ===========================================================================
-- 24_study_groups.sql — Study groups bound to exams/tiers (cohort accountability)
--
-- A study group is an org-visible, open-join cohort around a specific exam
-- (exam_code, e.g. 'PATENT_BAR') or tier. Group discussions reuse the
-- community_threads machinery via a nullable community_threads.group_id.
-- v1 semantics (documented, honest): all groups are visible to the whole
-- org and open to join; membership is required to post in group threads.
-- ===========================================================================

CREATE TABLE IF NOT EXISTS study_groups (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(160) NOT NULL,
    description_md      TEXT,
    exam_code           VARCHAR(40),
    tier                VARCHAR(40),
    member_count        INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_groups_org
    ON study_groups(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_groups_exam
    ON study_groups(exam_code) WHERE exam_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS study_group_members (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id            UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role                VARCHAR(20) NOT NULL DEFAULT 'member',  -- owner | member
    joined_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_study_group_member UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_study_group_members_user
    ON study_group_members(user_id);

-- Group-scoped community threads.
ALTER TABLE community_threads
    ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_comm_threads_group
    ON community_threads(group_id, last_activity_at DESC) WHERE group_id IS NOT NULL;

-- member_count maintained by trigger (same pattern as community upvotes).
CREATE OR REPLACE FUNCTION bump_study_group_member_count()
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE study_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE study_groups SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sg_member_ins ON study_group_members;
CREATE TRIGGER trg_sg_member_ins
    AFTER INSERT ON study_group_members
    FOR EACH ROW EXECUTE FUNCTION bump_study_group_member_count();

DROP TRIGGER IF EXISTS trg_sg_member_del ON study_group_members;
CREATE TRIGGER trg_sg_member_del
    AFTER DELETE ON study_group_members
    FOR EACH ROW EXECUTE FUNCTION bump_study_group_member_count();

DROP TRIGGER IF EXISTS trg_study_groups_touch ON study_groups;
CREATE TRIGGER trg_study_groups_touch
    BEFORE UPDATE ON study_groups
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
