-- EUREKA Platform - Demo Seed Data
-- This script creates demo organizations, users, courses, assignments, and enrollments
-- Password for all demo accounts: Admin123! (hashed with bcrypt)

-- ====================================================================================
-- ORGANIZATIONS
-- ====================================================================================

INSERT INTO organizations (id, name, slug, tier, email, phone, website, city, state, country, settings, tier_config, ferpa_compliant, coppa_compliant, hipaa_compliant, is_active, is_verified)
VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Demo University',
    'demo-university',
    'undergraduate',
    'admin@demo.edu',
    '555-0100',
    'https://demo.university.edu',
    'Boston',
    'MA',
    'US',
    '{"theme": "blue", "features": ["ai_tutor", "analytics", "adaptive_learning"]}'::jsonb,
    '{"max_students": 10000, "max_courses": 500}'::jsonb,
    true,
    false,
    false,
    true,
    true
),
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    'Springfield High School',
    'springfield-hs',
    'high_school',
    'principal@springfield-hs.edu',
    '555-0200',
    'https://springfield.k12.edu',
    'Springfield',
    'IL',
    'US',
    '{"theme": "green", "features": ["gamification", "parental_controls"]}'::jsonb,
    '{"max_students": 2000, "max_courses": 100}'::jsonb,
    true,
    true,
    false,
    true,
    true
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    'Medical Education Institute',
    'med-edu-institute',
    'professional_medical',
    'dean@med-institute.edu',
    '555-0300',
    'https://med-institute.edu',
    'New York',
    'NY',
    'US',
    '{"theme": "red", "features": ["clinical_cases", "usmle_prep", "3d_anatomy"]}'::jsonb,
    '{"max_students": 500, "max_courses": 50, "hipaa_required": true}'::jsonb,
    true,
    false,
    true,
    true,
    true
);

-- ====================================================================================
-- USERS
-- ====================================================================================

-- Super Admin
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, display_name, role, locale, timezone, is_active, email_verified, date_of_birth)
VALUES (
    '10000000-0000-0000-0000-000000000001'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'superadmin@eureka.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Super',
    'Admin',
    'Super Admin',
    'super_admin',
    'en-US',
    'America/New_York',
    true,
    true,
    '1985-01-15'::timestamp
);

-- Demo University Users
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, display_name, role, locale, timezone, is_active, email_verified, date_of_birth)
VALUES
-- Org Admin
(
    '20000000-0000-0000-0000-000000000001'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'admin@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Alice',
    'Administrator',
    'Dr. Alice Administrator',
    'org_admin',
    'en-US',
    'America/New_York',
    true,
    true,
    '1975-03-20'::timestamp
),
-- Teachers
(
    '20000000-0000-0000-0000-000000000002'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'teacher@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Jane',
    'Smith',
    'Prof. Jane Smith',
    'teacher',
    'en-US',
    'America/New_York',
    true,
    true,
    '1980-06-15'::timestamp
),
(
    '20000000-0000-0000-0000-000000000003'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'teacher2@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Robert',
    'Johnson',
    'Dr. Robert Johnson',
    'teacher',
    'en-US',
    'America/Los_Angeles',
    true,
    true,
    '1978-09-10'::timestamp
),
-- Students
(
    '20000000-0000-0000-0000-000000000010'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'student@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'John',
    'Doe',
    'John Doe',
    'student',
    'en-US',
    'America/New_York',
    true,
    true,
    '2002-05-12'::timestamp
),
(
    '20000000-0000-0000-0000-000000000011'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'student2@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Emma',
    'Wilson',
    'Emma Wilson',
    'student',
    'en-US',
    'America/Chicago',
    true,
    true,
    '2003-08-22'::timestamp
),
(
    '20000000-0000-0000-0000-000000000012'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'student3@demo.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Michael',
    'Brown',
    'Michael Brown',
    'student',
    'en-US',
    'America/Denver',
    true,
    true,
    '2002-11-30'::timestamp
);

-- High School Users
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, display_name, role, locale, timezone, is_active, email_verified, date_of_birth, parent_email, parental_consent_given)
VALUES
(
    '30000000-0000-0000-0000-000000000001'::uuid,
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    'hsteacher@springfield-hs.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Sarah',
    'Martinez',
    'Ms. Sarah Martinez',
    'teacher',
    'en-US',
    'America/Chicago',
    true,
    true,
    '1988-04-18'::timestamp,
    null,
    false
),
(
    '30000000-0000-0000-0000-000000000010'::uuid,
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    'hsstudent@springfield-hs.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Tommy',
    'Anderson',
    'Tommy Anderson',
    'student',
    'en-US',
    'America/Chicago',
    true,
    true,
    '2008-09-05'::timestamp,
    'parent@anderson.com',
    true
);

-- Medical School Users
INSERT INTO users (id, org_id, email, hashed_password, first_name, last_name, display_name, role, locale, timezone, is_active, email_verified, date_of_birth)
VALUES
(
    '40000000-0000-0000-0000-000000000001'::uuid,
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    'medfaculty@med-institute.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'Dr. Patricia',
    'Chen',
    'Dr. Patricia Chen, MD',
    'teacher',
    'en-US',
    'America/New_York',
    true,
    true,
    '1975-02-14'::timestamp
),
(
    '40000000-0000-0000-0000-000000000010'::uuid,
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    'medstudent@med-institute.edu',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpI5UwPwNQe2',
    'David',
    'Kumar',
    'David Kumar',
    'student',
    'en-US',
    'America/New_York',
    true,
    true,
    '1998-07-20'::timestamp
);

-- ====================================================================================
-- COURSES
-- ====================================================================================

INSERT INTO courses (id, org_id, instructor_id, title, code, description, tier, subject, level, credits, syllabus, learning_objectives, standards, is_published, is_archived, start_date, end_date)
VALUES
-- Demo University Courses
(
    '50000000-0000-0000-0000-000000000001'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '20000000-0000-0000-0000-000000000002'::uuid,
    'Introduction to Computer Science',
    'CS101',
    'Learn the fundamentals of programming, algorithms, and data structures. Perfect for beginners with no prior programming experience.',
    'undergraduate',
    'Computer Science',
    'beginner',
    4,
    '{"weeks": [{"week": 1, "topic": "Introduction to Programming"}, {"week": 2, "topic": "Variables and Data Types"}]}'::jsonb,
    ARRAY['Understand basic programming concepts', 'Write simple Python programs', 'Solve problems with algorithms'],
    '{"ACM": ["CS1"], "IEEE": ["Software Engineering Fundamentals"]}'::jsonb,
    true,
    false,
    '2024-01-15'::timestamp,
    '2024-05-15'::timestamp
),
(
    '50000000-0000-0000-0000-000000000002'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '20000000-0000-0000-0000-000000000003'::uuid,
    'Calculus I',
    'MATH201',
    'Introduction to differential and integral calculus with applications.',
    'undergraduate',
    'Mathematics',
    'intermediate',
    4,
    '{"weeks": [{"week": 1, "topic": "Limits and Continuity"}, {"week": 2, "topic": "Derivatives"}]}'::jsonb,
    ARRAY['Master derivative techniques', 'Solve integration problems', 'Apply calculus to real-world scenarios'],
    '{"standard": "Calculus AB/BC"}'::jsonb,
    true,
    false,
    '2024-01-15'::timestamp,
    '2024-05-15'::timestamp
),
(
    '50000000-0000-0000-0000-000000000003'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '20000000-0000-0000-0000-000000000002'::uuid,
    'Data Structures and Algorithms',
    'CS301',
    'Advanced course covering fundamental data structures and algorithm design patterns.',
    'undergraduate',
    'Computer Science',
    'advanced',
    4,
    '{"weeks": [{"week": 1, "topic": "Arrays and Linked Lists"}, {"week": 2, "topic": "Stacks and Queues"}]}'::jsonb,
    ARRAY['Implement common data structures', 'Analyze algorithm complexity', 'Design efficient solutions'],
    '{"ACM": ["CS2", "Algorithms"]}'::jsonb,
    true,
    false,
    '2024-01-15'::timestamp,
    '2024-05-15'::timestamp
);

-- High School Course
INSERT INTO courses (id, org_id, instructor_id, title, code, description, tier, subject, level, credits, learning_objectives, standards, is_published, start_date, end_date)
VALUES (
    '60000000-0000-0000-0000-000000000001'::uuid,
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    '30000000-0000-0000-0000-000000000001'::uuid,
    'Biology: Living Systems',
    'BIO101',
    'Explore the diversity of life, from cells to ecosystems. Aligned with NGSS standards.',
    'high_school',
    'Biology',
    'beginner',
    1,
    ARRAY['Understand cell structure', 'Describe photosynthesis', 'Explain evolution'],
    '{"NGSS": ["HS-LS1", "HS-LS2"], "state": "IL"}'::jsonb,
    true,
    '2024-09-01'::timestamp,
    '2025-06-15'::timestamp
);

-- Medical School Course
INSERT INTO courses (id, org_id, instructor_id, title, code, description, tier, subject, level, learning_objectives, is_published, start_date, end_date)
VALUES (
    '70000000-0000-0000-0000-000000000001'::uuid,
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    '40000000-0000-0000-0000-000000000001'::uuid,
    'Clinical Medicine I',
    'MED501',
    'First-year clinical medicine covering patient assessment, diagnosis, and treatment planning.',
    'professional_medical',
    'Medicine',
    'advanced',
    ARRAY['Perform patient history', 'Conduct physical examination', 'Develop differential diagnosis'],
    true,
    '2024-08-01'::timestamp,
    '2024-12-15'::timestamp
);

-- ====================================================================================
-- ENROLLMENTS
-- ====================================================================================

INSERT INTO enrollments (id, user_id, course_id, status, progress_percent, mastery_level, enrolled_at)
VALUES
-- CS101 Enrollments
(
    '80000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    'active',
    45,
    62,
    '2024-01-15'::timestamp
),
(
    '80000000-0000-0000-0000-000000000002'::uuid,
    '20000000-0000-0000-0000-000000000011'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    'active',
    78,
    85,
    '2024-01-15'::timestamp
),
(
    '80000000-0000-0000-0000-000000000003'::uuid,
    '20000000-0000-0000-0000-000000000012'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    'active',
    23,
    35,
    '2024-01-18'::timestamp
),
-- Calculus Enrollments
(
    '80000000-0000-0000-0000-000000000004'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    '50000000-0000-0000-0000-000000000002'::uuid,
    'active',
    52,
    68,
    '2024-01-15'::timestamp
),
(
    '80000000-0000-0000-0000-000000000005'::uuid,
    '20000000-0000-0000-0000-000000000011'::uuid,
    '50000000-0000-0000-0000-000000000002'::uuid,
    'active',
    90,
    92,
    '2024-01-15'::timestamp
),
-- High School Biology
(
    '80000000-0000-0000-0000-000000000010'::uuid,
    '30000000-0000-0000-0000-000000000010'::uuid,
    '60000000-0000-0000-0000-000000000001'::uuid,
    'active',
    35,
    45,
    '2024-09-01'::timestamp
),
-- Medical School
(
    '80000000-0000-0000-0000-000000000020'::uuid,
    '40000000-0000-0000-0000-000000000010'::uuid,
    '70000000-0000-0000-0000-000000000001'::uuid,
    'active',
    60,
    75,
    '2024-08-01'::timestamp
);

-- ====================================================================================
-- ASSIGNMENTS
-- ====================================================================================

INSERT INTO assignments (id, course_id, created_by, title, description, instructions, assignment_type, max_points, weight, rubric, available_from, due_date, late_submission_allowed, late_penalty_percent, max_attempts, is_published, is_graded)
VALUES
-- CS101 Assignments
(
    '90000000-0000-0000-0000-000000000001'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000002'::uuid,
    'Week 1 Quiz: Programming Basics',
    'Test your knowledge of basic programming concepts',
    'Answer all questions to the best of your ability. You have 30 minutes.',
    'quiz',
    100,
    1,
    '{"criteria": [{"name": "Accuracy", "points": 100}]}'::jsonb,
    '2024-01-22'::timestamp,
    '2024-01-29'::timestamp,
    true,
    10,
    2,
    true,
    true
),
(
    '90000000-0000-0000-0000-000000000002'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000002'::uuid,
    'Programming Assignment 1: Hello World',
    'Write your first Python program',
    'Create a Python program that prints "Hello, World!" and your name. Submit a .py file.',
    'homework',
    50,
    2,
    '{"criteria": [{"name": "Code Quality", "points": 20}, {"name": "Functionality", "points": 30}]}'::jsonb,
    '2024-01-23'::timestamp,
    '2024-02-05'::timestamp,
    true,
    15,
    3,
    true,
    true
),
(
    '90000000-0000-0000-0000-000000000003'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000002'::uuid,
    'Midterm Exam',
    'Comprehensive exam covering weeks 1-8',
    'Closed book exam. 2 hours time limit. Bring a calculator.',
    'exam',
    200,
    5,
    '{"criteria": [{"name": "Multiple Choice", "points": 100}, {"name": "Short Answer", "points": 100}]}'::jsonb,
    '2024-03-10'::timestamp,
    '2024-03-15'::timestamp,
    false,
    0,
    1,
    true,
    true
),
-- Calculus Assignment
(
    '90000000-0000-0000-0000-000000000010'::uuid,
    '50000000-0000-0000-0000-000000000002'::uuid,
    '20000000-0000-0000-0000-000000000003'::uuid,
    'Problem Set 1: Limits',
    'Solve limit problems from Chapter 2',
    'Show all work. Submit handwritten or typed solutions.',
    'homework',
    75,
    2,
    '{"criteria": [{"name": "Correct Solutions", "points": 50}, {"name": "Work Shown", "points": 25}]}'::jsonb,
    '2024-01-20'::timestamp,
    '2024-01-27'::timestamp,
    true,
    20,
    null,
    true,
    true
);

-- ====================================================================================
-- SUBMISSIONS
-- ====================================================================================

INSERT INTO submissions (id, assignment_id, user_id, content, attempt_number, submitted_at, status, score, max_score, grade_percentage, feedback, is_late, ai_graded)
VALUES
-- Student 1 (John Doe) - CS101 Quiz 1
(
    'a0000000-0000-0000-0000-000000000001'::uuid,
    '90000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    '{"answers": ["A", "B", "C", "D", "A"]}',
    1,
    '2024-01-28 14:30:00'::timestamp,
    'graded',
    85.0,
    100.0,
    85.0,
    'Good work! Review concept of loops.',
    false,
    false
),
-- Student 2 (Emma Wilson) - CS101 Quiz 1
(
    'a0000000-0000-0000-0000-000000000002'::uuid,
    '90000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000011'::uuid,
    '{"answers": ["A", "B", "C", "D", "A"]}',
    1,
    '2024-01-28 15:00:00'::timestamp,
    'graded',
    95.0,
    100.0,
    95.0,
    'Excellent! Perfect understanding.',
    false,
    false
),
-- Student 3 (Michael Brown) - CS101 Quiz 1 (Late)
(
    'a0000000-0000-0000-0000-000000000003'::uuid,
    '90000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000012'::uuid,
    '{"answers": ["B", "B", "A", "D", "C"]}',
    1,
    '2024-01-30 10:00:00'::timestamp,
    'graded',
    65.0,
    100.0,
    58.5,
    'Submitted late. -10% penalty applied. Review variables.',
    true,
    false
),
-- Student 1 - Programming Assignment 1
(
    'a0000000-0000-0000-0000-000000000010'::uuid,
    '90000000-0000-0000-0000-000000000002'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    'print("Hello, World!")\nprint("My name is John Doe")',
    1,
    '2024-02-03 20:15:00'::timestamp,
    'graded',
    48.0,
    50.0,
    96.0,
    'Great job! Code is clean and works perfectly.',
    false,
    true
);

-- ====================================================================================
-- GRADES
-- ====================================================================================

INSERT INTO grades (id, enrollment_id, course_id, user_id, points_earned, points_possible, percentage, letter_grade, status, is_final, calculated_at)
VALUES
-- John Doe - CS101
(
    'b0000000-0000-0000-0000-000000000001'::uuid,
    '80000000-0000-0000-0000-000000000001'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    387.5,
    450.0,
    86.1,
    'B+',
    'in_progress',
    false,
    '2024-03-01'::timestamp
),
-- Emma Wilson - CS101
(
    'b0000000-0000-0000-0000-000000000002'::uuid,
    '80000000-0000-0000-0000-000000000002'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000011'::uuid,
    425.0,
    450.0,
    94.4,
    'A',
    'in_progress',
    false,
    '2024-03-01'::timestamp
),
-- Michael Brown - CS101
(
    'b0000000-0000-0000-0000-000000000003'::uuid,
    '80000000-0000-0000-0000-000000000003'::uuid,
    '50000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000012'::uuid,
    301.0,
    450.0,
    66.9,
    'D+',
    'in_progress',
    false,
    '2024-03-01'::timestamp
);

-- ====================================================================================
-- NOTIFICATIONS
-- ====================================================================================

INSERT INTO notifications (id, user_id, org_id, type, priority, title, message, action_text, action_url, reference_type, reference_id, is_read, is_sent, sent_via_email)
VALUES
-- Welcome notification for John Doe
(
    'c0000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'system',
    'normal',
    'Welcome to EUREKA!',
    'Welcome to the EUREKA platform! You have been enrolled in 2 courses. Start learning today!',
    'View Dashboard',
    '/dashboard',
    'user',
    '20000000-0000-0000-0000-000000000010'::uuid,
    true,
    true,
    true
),
-- New assignment notification
(
    'c0000000-0000-0000-0000-000000000002'::uuid,
    '20000000-0000-0000-0000-000000000010'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'assignment',
    'high',
    'New Assignment: Midterm Exam',
    'A new assignment has been posted in Introduction to Computer Science. Due: March 15, 2024',
    'View Assignment',
    '/assignments/90000000-0000-0000-0000-000000000003',
    'assignment',
    '90000000-0000-0000-0000-000000000003'::uuid,
    false,
    true,
    true
),
-- Grade posted notification
(
    'c0000000-0000-0000-0000-000000000003'::uuid,
    '20000000-0000-0000-0000-000000000011'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'grade',
    'normal',
    'Grade Posted: Week 1 Quiz',
    'Your grade for "Week 1 Quiz: Programming Basics" has been posted. Score: 95/100 (A)',
    'View Grade',
    '/grades',
    'submission',
    'a0000000-0000-0000-0000-000000000002'::uuid,
    false,
    true,
    true
),
-- Deadline reminder
(
    'c0000000-0000-0000-0000-000000000004'::uuid,
    '20000000-0000-0000-0000-000000000012'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'deadline',
    'urgent',
    'Assignment Due Tomorrow',
    'Reminder: "Programming Assignment 1: Hello World" is due tomorrow at 11:59 PM. Submit soon!',
    'Submit Assignment',
    '/assignments/90000000-0000-0000-0000-000000000002',
    'assignment',
    '90000000-0000-0000-0000-000000000002'::uuid,
    false,
    false,
    false
);

-- ====================================================================================
-- Summary
-- ====================================================================================

-- Organizations: 3 (University, High School, Medical School)
-- Users: 11 (1 super admin, 3 org admins, 4 teachers, 9 students)
-- Courses: 5 (3 undergrad, 1 high school, 1 medical)
-- Enrollments: 7
-- Assignments: 4
-- Submissions: 4
-- Grades: 3
-- Notifications: 4

-- Demo Accounts (Password: Admin123! for all):
-- superadmin@eureka.com - Super Admin
-- admin@demo.edu - Org Admin (Demo University)
-- teacher@demo.edu - Teacher (Demo University)
-- student@demo.edu - Student (Demo University)
-- student2@demo.edu - Student (Demo University) - High performer
-- student3@demo.edu - Student (Demo University) - Struggling student
-- hsteacher@springfield-hs.edu - High School Teacher
-- hsstudent@springfield-hs.edu - High School Student (with parental consent)
-- medfaculty@med-institute.edu - Medical School Faculty
-- medstudent@med-institute.edu - Medical School Student
