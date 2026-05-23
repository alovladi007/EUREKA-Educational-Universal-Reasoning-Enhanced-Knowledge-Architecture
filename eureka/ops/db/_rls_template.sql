-- ===========================================================================
-- Phase 21.6 — Row-level security template for EUREKA multi-tenant tables.
--
-- This file is NOT run automatically (note the underscore prefix). It's a
-- template for the migration team to copy + adapt per table when rolling
-- out RLS.
--
-- See docs/SECURITY_HARDENING.md for the rationale + rollout plan.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Helper: a SECURITY DEFINER function the app calls to set the per-request
-- session var. App code does this in the SQLAlchemy connection-checkout
-- callback, every request:
--
--     SELECT set_eureka_session_context(
--       p_user_id := '<uuid>',
--       p_org_id  := '<uuid>',
--       p_role    := 'student'
--     );
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_eureka_session_context(
    p_user_id UUID,
    p_org_id  UUID,
    p_role    TEXT
) RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_user_id', p_user_id::text, false);
    PERFORM set_config('app.current_org_id',  p_org_id::text, false);
    PERFORM set_config('app.current_role',    p_role,          false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION set_eureka_session_context TO PUBLIC;


-- ---------------------------------------------------------------------------
-- Per-table policy template. Copy this block for every org-scoped table.
-- ---------------------------------------------------------------------------

-- Example: cohorts table (Phase 9.1).
-- 1. Make sure the org_id column is NOT NULL.
ALTER TABLE cohorts ALTER COLUMN org_id SET NOT NULL;

-- 2. Enable RLS.
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;

-- 3. Default-deny: only rows whose org_id matches the session var are visible.
DROP POLICY IF EXISTS rls_cohorts_isolate ON cohorts;
CREATE POLICY rls_cohorts_isolate ON cohorts
    USING (org_id::text = current_setting('app.current_org_id', true));

-- 4. Optional: super_admin bypass. They see everything.
DROP POLICY IF EXISTS rls_cohorts_super_admin ON cohorts;
CREATE POLICY rls_cohorts_super_admin ON cohorts
    USING (current_setting('app.current_role', true) = 'super_admin');


-- ---------------------------------------------------------------------------
-- Force RLS on TABLE OWNER too (otherwise the table owner bypasses RLS).
-- ---------------------------------------------------------------------------

ALTER TABLE cohorts FORCE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- Shadow-mode rollout (recommended for production)
-- ---------------------------------------------------------------------------
--
-- Step 1. Add the policy in "shadow" mode — log what WOULD have been refused
--         without actually refusing. Implement by logging from the app rather
--         than enabling RLS yet. Run for 2 weeks.
--
-- Step 2. Once the log is clean (zero unexpected refusals), enable RLS on
--         the table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
--
-- Step 3. Verify by running the cross-tenant isolation tests (Phase 3.3 + 21.5).
--         Every test that previously relied on the app-layer 403 should now
--         also pass with RLS active.
--
-- Step 4. After 30 days of clean prod operation, force RLS
--         (`ALTER TABLE ... FORCE ROW LEVEL SECURITY`) so even the table
--         owner can't bypass.


-- ---------------------------------------------------------------------------
-- Tables to apply this to (one migration per phase)
-- ---------------------------------------------------------------------------
--
-- Phase 1: organizations, users (special — bootstrap), courses
-- Phase 4: learner_profiles, tier_enrollments, skill_*, transcript_*
-- Phase 5: item_banks, items, item_variants
-- Phase 6: knowledge_chunks, agent_sessions, agent_messages
-- Phase 7: attempt_logs, mock_attempts
-- Phase 9: cohorts, cohort_memberships, sso_idp_configs, lti_platforms
-- Phase 10: instructor_profiles, course_listings, marketplace_purchases, coupons
-- Phase 11: subscriptions, invoices, support_tickets, kb_articles, email_*
-- Phase 12: study_plans, live_sessions, notification_devices, push_notifications
-- Phase 13: api_keys, webhook_endpoints, oauth_apps, audit_events
-- Phase 15: institution_partnerships, workforce_programs, program_assignments,
--           compliance_requirements, training_attestations
-- Phase 16.1: graduate_programs, graduate_enrollments, degree_milestones
-- Phase 17: activity_events, user_collections, collection_items
-- Phase 18: community_threads, community_posts, community_reactions,
--           learning_resources, learning_resource_votes
--
-- Excluded (intentionally org-agnostic):
-- - skills (the catalog is global)
-- - achievements (the catalog is global)
-- - subscription_plans (catalog)
-- - tax_rates (catalog)
