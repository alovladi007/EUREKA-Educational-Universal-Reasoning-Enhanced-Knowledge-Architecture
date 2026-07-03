-- Demo content seed (idempotent) -------------------------------------------
--
-- Fills empty content tables that otherwise render FE pages blank (found in
-- the full-platform audit): course_modules (course curriculum view),
-- notifications (the bell/panel), and notebook_projects/notebook_tasks (the
-- Notebook Projects + Tasks boards). Every block guards with WHERE NOT EXISTS
-- so re-running never duplicates.
--
-- Run against a live stack:
--   docker exec -i eureka-db psql -U eureka -d eureka < ops/db/seeds/demo_content.sql

-- ── 1. course_modules — a 3-module curriculum for two flagship courses ──────
INSERT INTO course_modules
    (id, course_id, title, description, order_index, duration_minutes,
     is_published, learning_objectives, prerequisites, created_at, updated_at)
SELECT gen_random_uuid(), m.course_id, m.title, m.descr, m.ord, m.mins,
       true, m.objs::jsonb, '[]'::jsonb, now(), now()
FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Foundations & Setup',
     'Course overview, environment setup, and how to succeed.', 1, 45,
     '["Set up your environment","Understand the syllabus"]'),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Core Concepts',
     'The central ideas, worked examples, and guided practice.', 2, 90,
     '["Explain the core concepts","Apply them to problems"]'),
    ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Applied Project',
     'Build something end-to-end and get feedback.', 3, 120,
     '["Ship a small project","Incorporate review feedback"]'),
    ('c1550000-0000-0000-0000-000000000001'::uuid, 'Security & Risk Management',
     'CIA triad, governance, and risk fundamentals.', 1, 90,
     '["Explain the CIA triad","Assess basic risk"]'),
    ('c1550000-0000-0000-0000-000000000001'::uuid, 'Asset & Network Security',
     'Classification, cryptography, and secure architecture.', 2, 120,
     '["Classify assets","Reason about crypto + network defense"]'),
    ('c1550000-0000-0000-0000-000000000001'::uuid, 'Practice Exam & Review',
     'Timed practice set + weak-area review.', 3, 120,
     '["Complete a timed set","Target weak domains"]')
) AS m(course_id, title, descr, ord, mins, objs)
WHERE NOT EXISTS (SELECT 1 FROM course_modules cm WHERE cm.course_id = m.course_id);

-- ── 2. notifications — a few for the demo admin (you@local.test) ────────────
INSERT INTO notifications
    (id, user_id, notification_type, title, message, is_read, created_at)
SELECT gen_random_uuid(), '51eef4bd-adac-4d21-9074-ba7535129493'::uuid,
       n.ntype::notification_type, n.title, n.msg, n.rd,
       now() - (n.age_h || ' hours')::interval
FROM (VALUES
    ('success', 'Welcome to EUREKA', 'Your account is ready — explore your dashboard.', true, 48),
    ('info', 'New course available', '"Introduction to Computer Science" is now open for enrollment.', false, 20),
    ('grade', 'Assignment graded', 'You scored 92% on the Core Concepts module quiz.', false, 6),
    ('announcement', 'Maintenance window', 'A short maintenance is scheduled this weekend.', true, 72)
) AS n(ntype, title, msg, rd, age_h)
WHERE NOT EXISTS (
    SELECT 1 FROM notifications WHERE user_id = '51eef4bd-adac-4d21-9074-ba7535129493'::uuid
);

-- ── 3. notebook_projects + notebook_tasks — demo boards for the admin ───────
-- notebook_* were empty (the api-created demo projects were lost on a db
-- recreate). Seed 2 projects with a handful of tasks each. Serial ids, so we
-- insert projects then link tasks via the RETURNING ids.
WITH new_projects AS (
    INSERT INTO notebook_projects (owner_id, name, description, status, created_at, updated_at)
    SELECT '51eef4bd-adac-4d21-9074-ba7535129493'::uuid, p.name, p.descr, p.status, now(), now()
    FROM (VALUES
        ('EUREKA Platform Launch', 'Cross-team workstream for the v1 launch — milestones, tasks, and QA.', 'active'),
        ('Content Pipeline', 'Author + QA the question banks, lessons, and curricula.', 'active')
    ) AS p(name, descr, status)
    WHERE NOT EXISTS (
        SELECT 1 FROM notebook_projects WHERE owner_id = '51eef4bd-adac-4d21-9074-ba7535129493'::uuid
    )
    RETURNING id, name
)
INSERT INTO notebook_tasks
    (project_id, title, description, status, priority, created_by, created_at, updated_at)
SELECT np.id, t.title, t.descr, t.status, t.priority,
       '51eef4bd-adac-4d21-9074-ba7535129493'::uuid, now(), now()
FROM new_projects np
JOIN (VALUES
    ('EUREKA Platform Launch', 'Finalize onboarding flow', 'Polish the sign-up + first-run experience.', 'in_progress', 'high'),
    ('EUREKA Platform Launch', 'Load-test the API', 'Run k6 against the 6 core backends.', 'todo', 'medium'),
    ('EUREKA Platform Launch', 'Write launch checklist', 'Rollback triggers + smoke tests.', 'completed', 'low'),
    ('Content Pipeline', 'QA the CISSP question bank', 'Verify answer keys + explanations.', 'in_progress', 'high'),
    ('Content Pipeline', 'Draft Intro-to-CS module 3', 'Applied project brief + rubric.', 'todo', 'medium')
) AS t(pname, title, descr, status, priority) ON t.pname = np.name;
