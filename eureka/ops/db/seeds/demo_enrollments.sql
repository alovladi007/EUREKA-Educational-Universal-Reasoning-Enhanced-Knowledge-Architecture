-- Demo enrollments seed (idempotent) ----------------------------------------
--
-- Lights up the "My enrolled courses" section on /dashboard/courses (which
-- reads GET /courses/me/enrollments) and gives teacher dashboards real
-- enrollment counts. The enrollments table ships empty, so without this the
-- section is invisible for every user.
--
-- This lives under ops/db/seeds/ (NOT ops/db/, which auto-runs at initdb) so
-- it is opt-in. Run it against a running stack with:
--   docker exec -i eureka-db psql -U eureka -d eureka < ops/db/seeds/demo_enrollments.sql
--
-- Safe to re-run: every insert is ON CONFLICT (course_id, user_id) DO NOTHING
-- against the live `unique_enrollment` constraint. Columns match the canonical
-- table (status enum active|completed|dropped|failed, progress_percentage
-- numeric(5,2)).

-- 1) The demo admin (you@local.test) enrolled in four real courses with varied
--    state, so the section shows progress bars + a completed course.
INSERT INTO enrollments (id, user_id, course_id, status, progress_percentage, enrolled_at, completed_at)
VALUES
  (gen_random_uuid(), '51eef4bd-adac-4d21-9074-ba7535129493', '550e8400-e29b-41d4-a716-446655440002', 'active',     65.00, now() - interval '20 days', NULL),
  (gen_random_uuid(), '51eef4bd-adac-4d21-9074-ba7535129493', 'c1550000-0000-0000-0000-000000000001', 'active',     30.00, now() - interval '10 days', NULL),
  (gen_random_uuid(), '51eef4bd-adac-4d21-9074-ba7535129493', '04422ee5-40a9-4b86-b130-5d6c5555d6c8', 'completed', 100.00, now() - interval '60 days', now() - interval '5 days'),
  (gen_random_uuid(), '51eef4bd-adac-4d21-9074-ba7535129493', '977138da-ac57-4dcd-8fae-80b99dfbdc12', 'active',     12.50, now() - interval '3 days',  NULL)
ON CONFLICT (course_id, user_id) DO NOTHING;

-- 2) A handful of non-admin learners into "Introduction to Computer Science",
--    so its roster + course stats (avg progress) are non-trivial.
INSERT INTO enrollments (id, user_id, course_id, status, progress_percentage, enrolled_at)
SELECT
  gen_random_uuid(),
  u.id,
  '550e8400-e29b-41d4-a716-446655440002',
  'active',
  (20 + (row_number() OVER (ORDER BY u.id)) * 9)::numeric(5,2),  -- deterministic spread 29..74
  now() - interval '15 days'
FROM users u
WHERE u.role NOT IN ('super_admin', 'org_admin')
  AND u.id <> '51eef4bd-adac-4d21-9074-ba7535129493'
ORDER BY u.id
LIMIT 6
ON CONFLICT (course_id, user_id) DO NOTHING;
