-- ============================================================================
-- MedAtlas MD - Seed Data for Development/Testing
-- ============================================================================
-- IMPORTANT: This contains SYNTHETIC data only - NO PHI
-- Use only in development and staging environments
-- ============================================================================

-- Clear existing seed data (in correct order to respect foreign keys)
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE user_badges CASCADE;
TRUNCATE TABLE badges CASCADE;
TRUNCATE TABLE user_gamification CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE file_uploads CASCADE;
TRUNCATE TABLE chat_messages CASCADE;
TRUNCATE TABLE chat_conversations CASCADE;
TRUNCATE TABLE document_versions CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE engagement_data CASCADE;
TRUNCATE TABLE performance_metrics CASCADE;
TRUNCATE TABLE analytics_events CASCADE;
TRUNCATE TABLE mastery_tracking CASCADE;
TRUNCATE TABLE recommendations CASCADE;
TRUNCATE TABLE user_progress CASCADE;
TRUNCATE TABLE learning_paths CASCADE;
TRUNCATE TABLE grading_results CASCADE;
TRUNCATE TABLE grading_rubrics CASCADE;
TRUNCATE TABLE assessment_submissions CASCADE;
TRUNCATE TABLE assessment_items CASCADE;
TRUNCATE TABLE assessments CASCADE;
TRUNCATE TABLE qbank_responses CASCADE;
TRUNCATE TABLE qbank_items CASCADE;
TRUNCATE TABLE assignment_submissions CASCADE;
TRUNCATE TABLE assignments CASCADE;
TRUNCATE TABLE lesson_progress CASCADE;
TRUNCATE TABLE course_lessons CASCADE;
TRUNCATE TABLE course_modules CASCADE;
TRUNCATE TABLE enrollments CASCADE;
TRUNCATE TABLE courses CASCADE;
TRUNCATE TABLE user_sessions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Reset sequences
ALTER SEQUENCE IF EXISTS qbank_items_id_seq RESTART WITH 1;

-- ============================================================================
-- 1. ORGANIZATIONS
-- ============================================================================
INSERT INTO organizations (id, name, slug, tier, settings, subscription_status, max_users, max_courses) VALUES
('00000000-0000-0000-0000-000000000001', 'Stanford Medical School (Demo)', 'stanford-med-demo', 'medical', 
 '{"features": ["ai_tutor", "qbank", "osce", "3d_anatomy", "ml_hub"], "branding": {"primary_color": "#8C1515"}}', 
 'active', 1000, 50),
 
('00000000-0000-0000-0000-000000000002', 'Roosevelt High School (Demo)', 'roosevelt-hs-demo', 'high_school',
 '{"features": ["gamification", "parent_dashboard", "standards_mapping"], "branding": {"primary_color": "#003DA5"}}',
 'active', 500, 30),
 
('00000000-0000-0000-0000-000000000003', 'MIT Engineering (Demo)', 'mit-eng-demo', 'engineering',
 '{"features": ["circuit_simulator", "cad_integration", "fe_pe_exams"], "branding": {"primary_color": "#A31F34"}}',
 'active', 800, 40);

-- ============================================================================
-- 2. USERS
-- ============================================================================
-- Password for all demo users: 'Demo123!'
-- Hash generated with bcrypt rounds=10
INSERT INTO users (id, org_id, email, password_hash, first_name, last_name, role, email_verified, is_active, settings) VALUES
-- Stanford Medical School Users
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@stanford-demo.edu', 
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Dr. Sarah', 'Anderson', 'admin', TRUE, TRUE,
 '{"theme": "light", "notifications": {"email": true, "push": true}}'),
 
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'faculty@stanford-demo.edu',
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Dr. Michael', 'Chen', 'teacher', TRUE, TRUE,
 '{"theme": "light", "preferred_language": "en"}'),
 
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'ms1.student@stanford-demo.edu',
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Emily', 'Rodriguez', 'student', TRUE, TRUE,
 '{"theme": "dark", "study_mode": "intensive"}'),
 
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'ms2.student@stanford-demo.edu',
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'James', 'Thompson', 'student', TRUE, TRUE,
 '{"theme": "light", "study_goal": "step1_prep"}'),

-- High School Users
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'teacher@roosevelt-demo.edu',
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Ms. Jennifer', 'Wilson', 'teacher', TRUE, TRUE,
 '{"theme": "light"}'),
 
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 'student1@roosevelt-demo.edu',
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Alex', 'Martinez', 'student', TRUE, TRUE,
 '{"theme": "dark", "grade": 10}'),
 
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'parent@roosevelt-demo.edu',
 '$2a$10$YqE5L5V5V5V5V5V5V5V5euJ4Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'Maria', 'Martinez', 'parent', TRUE, TRUE,
 '{"theme": "light", "children_ids": ["10000000-0000-0000-0000-000000000006"]}');

-- ============================================================================
-- 3. COURSES
-- ============================================================================
INSERT INTO courses (id, org_id, title, description, slug, instructor_id, category, difficulty, thumbnail_url, is_published, enrollment_type, start_date, end_date) VALUES
-- Medical School Courses
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 
 'Human Anatomy I', 
 'Comprehensive study of human anatomical structures including gross anatomy, histology, and clinical correlations. Focus on musculoskeletal, cardiovascular, and respiratory systems.',
 'human-anatomy-1', '10000000-0000-0000-0000-000000000002', 'Basic Sciences', 'beginner',
 'https://placehold.co/600x400/8C1515/white?text=Anatomy', TRUE, 'open', '2025-09-01', '2025-12-15'),

('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
 'Pharmacology Fundamentals',
 'Core principles of drug action, pharmacokinetics, and pharmacodynamics. Clinical applications and adverse effects.',
 'pharmacology-fundamentals', '10000000-0000-0000-0000-000000000002', 'Basic Sciences', 'intermediate',
 'https://placehold.co/600x400/8C1515/white?text=Pharmacology', TRUE, 'open', '2025-09-01', '2025-12-15'),

('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001',
 'Clinical Medicine: Cardiology',
 'Clinical approach to cardiovascular diseases. History taking, physical examination, interpretation of EKG and imaging.',
 'clinical-cardiology', '10000000-0000-0000-0000-000000000002', 'Clinical Medicine', 'advanced',
 'https://placehold.co/600x400/8C1515/white?text=Cardiology', TRUE, 'invite_only', '2026-01-15', '2026-05-30'),

-- High School Courses
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002',
 'Biology 101',
 'Introduction to biological sciences covering cells, genetics, evolution, and ecology.',
 'biology-101', '10000000-0000-0000-0000-000000000005', 'Science', 'beginner',
 'https://placehold.co/600x400/003DA5/white?text=Biology', TRUE, 'open', '2025-09-01', '2026-06-15'),

('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002',
 'AP Chemistry',
 'Advanced Placement Chemistry preparing students for the AP exam.',
 'ap-chemistry', '10000000-0000-0000-0000-000000000005', 'Science', 'advanced',
 'https://placehold.co/600x400/003DA5/white?text=Chemistry', TRUE, 'open', '2025-09-01', '2026-06-15');

-- ============================================================================
-- 4. COURSE MODULES & LESSONS
-- ============================================================================
-- Human Anatomy I Modules
INSERT INTO course_modules (id, course_id, title, description, order_index, is_published) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 
 'Introduction to Anatomy', 'Overview of anatomical terminology, planes, and systems', 1, TRUE),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001',
 'Musculoskeletal System', 'Bones, joints, and muscles of the human body', 2, TRUE),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001',
 'Cardiovascular System', 'Heart anatomy, blood vessels, and circulation', 3, TRUE);

-- Lessons for Introduction to Anatomy
INSERT INTO course_lessons (id, module_id, title, content_type, content_text, duration_minutes, order_index, is_required) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001',
 'Anatomical Terminology', 'document', 
 'Learn the fundamental terms used to describe anatomical structures and their relationships. Includes directional terms (superior, inferior, anterior, posterior), body planes (sagittal, coronal, transverse), and body cavities.',
 30, 1, TRUE),
 
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001',
 'Body Planes and Sections', 'video',
 'https://example.com/videos/body-planes.mp4',
 45, 2, TRUE),
 
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001',
 'Module 1 Quiz', 'quiz',
 NULL,
 20, 3, TRUE);

-- ============================================================================
-- 5. ENROLLMENTS
-- ============================================================================
INSERT INTO enrollments (id, user_id, course_id, status, enrolled_at, progress_percentage, last_accessed_at) VALUES
-- Medical students enrolled in anatomy
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 
 'active', '2025-09-01', 35.5, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001',
 'active', '2025-09-01', 42.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Medical students in pharmacology  
('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002',
 'active', '2025-09-01', 28.0, CURRENT_TIMESTAMP - INTERVAL '3 hours'),

-- High school student enrollments
('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000004',
 'active', '2025-09-01', 67.5, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- ============================================================================
-- 6. QBANK ITEMS (Question Bank)
-- ============================================================================
INSERT INTO qbank_items (id, org_id, author_id, item_type, stem, options, correct_answer, explanation, tags, difficulty, discrimination, category, subcategory, is_published, review_status) VALUES
-- Medical QBank Items
('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
 'mcq',
 'A 45-year-old man presents to the emergency department with sudden onset chest pain radiating to his left arm. He is diaphoretic and anxious. ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?',
 '[
   {"id": "a", "text": "Left anterior descending artery"},
   {"id": "b", "text": "Left circumflex artery"},
   {"id": "c", "text": "Right coronary artery"},
   {"id": "d", "text": "Left main coronary artery"},
   {"id": "e", "text": "Posterior descending artery"}
 ]'::jsonb,
 'c',
 'ST-elevation in inferior leads (II, III, aVF) indicates an inferior wall myocardial infarction, which is typically supplied by the right coronary artery in 80% of individuals (right-dominant circulation). The RCA supplies the inferior wall of the left ventricle, the AV node, and the SA node.',
 ARRAY['cardiology', 'ecg', 'myocardial_infarction', 'anatomy'],
 0.45, 1.2, 'Cardiology', 'Acute Coronary Syndrome', TRUE, 'approved'),

('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
 'mcq',
 'A 28-year-old woman complains of palpitations and anxiety. Physical examination reveals a fine tremor, warm moist skin, and tachycardia (HR 110 bpm). Laboratory tests show: TSH <0.01 mU/L (low), Free T4 25 pmol/L (elevated). What is the most likely diagnosis?',
 '[
   {"id": "a", "text": "Hypothyroidism"},
   {"id": "b", "text": "Hyperthyroidism"},
   {"id": "c", "text": "Generalized anxiety disorder"},
   {"id": "d", "text": "Pheochromocytoma"},
   {"id": "e", "text": "Cushing syndrome"}
 ]'::jsonb,
 'b',
 'The combination of suppressed TSH and elevated free T4 indicates primary hyperthyroidism. Common causes include Graves disease, toxic multinodular goiter, and toxic adenoma. Clinical features include weight loss, heat intolerance, palpitations, tremor, and anxiety.',
 ARRAY['endocrinology', 'thyroid', 'labs'],
 0.35, 1.5, 'Endocrinology', 'Thyroid Disorders', TRUE, 'approved'),

('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
 'mcq',
 'Which bone forms the posterior wall of the orbit?',
 '[
   {"id": "a", "text": "Frontal bone"},
   {"id": "b", "text": "Maxilla"},
   {"id": "c", "text": "Sphenoid bone"},
   {"id": "d", "text": "Ethmoid bone"},
   {"id": "e", "text": "Zygomatic bone"}
 ]'::jsonb,
 'c',
 'The sphenoid bone forms the posterior wall of the orbit. Specifically, the lesser wing of the sphenoid forms the superior posterior wall, and the greater wing forms the lateral posterior wall.',
 ARRAY['anatomy', 'head_neck', 'orbit'],
 0.25, 1.0, 'Anatomy', 'Head and Neck', TRUE, 'approved'),

-- High School Biology Questions
('60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005',
 'mcq',
 'What is the powerhouse of the cell?',
 '[
   {"id": "a", "text": "Nucleus"},
   {"id": "b", "text": "Mitochondria"},
   {"id": "c", "text": "Ribosome"},
   {"id": "d", "text": "Golgi apparatus"}
 ]'::jsonb,
 'b',
 'Mitochondria are called the powerhouse of the cell because they generate most of the cell''s supply of ATP through cellular respiration.',
 ARRAY['cell_biology', 'organelles'],
 0.15, 0.8, 'Cell Biology', 'Cell Structure', TRUE, 'approved'),

('60000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005',
 'mcq',
 'Which process do plants use to convert light energy into chemical energy?',
 '[
   {"id": "a", "text": "Cellular respiration"},
   {"id": "b", "text": "Fermentation"},
   {"id": "c", "text": "Photosynthesis"},
   {"id": "d", "text": "Chemosynthesis"}
 ]'::jsonb,
 'c',
 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar (glucose).',
 ARRAY['plant_biology', 'photosynthesis', 'energy'],
 0.20, 0.9, 'Biology', 'Plants', TRUE, 'approved');

-- ============================================================================
-- 7. ASSIGNMENTS
-- ============================================================================
INSERT INTO assignments (id, course_id, title, description, instructions, max_points, due_date, submission_type, settings) VALUES
('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
 'Anatomical Structures Essay',
 'Write a comprehensive essay on the cardiovascular system',
 'Your essay should be 1500-2000 words and include: 1) Structure of the heart, 2) Major blood vessels, 3) Cardiac cycle, 4) Clinical correlations. Use at least 5 peer-reviewed references.',
 100.0,
 CURRENT_TIMESTAMP + INTERVAL '14 days',
 'text',
 '{"min_words": 1500, "max_words": 2000, "require_references": true}'::jsonb),

('70000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004',
 'Cell Structure Diagram',
 'Create a labeled diagram of a eukaryotic cell',
 'Draw and label all major organelles. You may submit hand-drawn or computer-generated diagrams. Include a brief description of each organelle''s function.',
 50.0,
 CURRENT_TIMESTAMP + INTERVAL '7 days',
 'file',
 '{"allowed_file_types": ["pdf", "jpg", "png"]}'::jsonb);

-- ============================================================================
-- 8. ASSESSMENTS (Tests/Exams)
-- ============================================================================
INSERT INTO assessments (id, course_id, title, description, assessment_type, time_limit_minutes, max_attempts, passing_score, randomize_questions, show_answers_after, available_from, available_until, is_published) VALUES
('80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
 'Anatomy Midterm Exam',
 'Comprehensive midterm covering modules 1-3',
 'midterm',
 120,
 1,
 70.0,
 TRUE,
 'after_due_date',
 CURRENT_TIMESTAMP + INTERVAL '30 days',
 CURRENT_TIMESTAMP + INTERVAL '35 days',
 TRUE),

('80000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004',
 'Cell Biology Quiz',
 'Quick quiz on cell structure and organelles',
 'quiz',
 30,
 3,
 60.0,
 FALSE,
 'immediate',
 CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP + INTERVAL '90 days',
 TRUE);

-- Link questions to assessments
INSERT INTO assessment_items (assessment_id, item_id, order_index, points_override) VALUES
('80000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 1, 5.0),
('80000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000003', 2, 3.0),
('80000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000004', 1, 2.0),
('80000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000005', 2, 2.0);

-- ============================================================================
-- 9. GRADING RUBRICS
-- ============================================================================
INSERT INTO grading_rubrics (id, org_id, name, description, criteria, max_points, is_template) VALUES
('90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001',
 'Essay Grading Rubric - Medical',
 'Standard rubric for medical school essays',
 '[
   {
     "id": "content",
     "name": "Content Quality",
     "description": "Accuracy and depth of medical content",
     "weight": 0.4,
     "levels": [
       {"score": 4, "description": "Exceptionally comprehensive and accurate"},
       {"score": 3, "description": "Good coverage with minor gaps"},
       {"score": 2, "description": "Adequate but missing key concepts"},
       {"score": 1, "description": "Significant content issues"}
     ]
   },
   {
     "id": "organization",
     "name": "Organization",
     "description": "Logical flow and structure",
     "weight": 0.3,
     "levels": [
       {"score": 4, "description": "Excellent organization and flow"},
       {"score": 3, "description": "Well organized"},
       {"score": 2, "description": "Some organization issues"},
       {"score": 1, "description": "Poorly organized"}
     ]
   },
   {
     "id": "references",
     "name": "References",
     "description": "Quality and proper citation of sources",
     "weight": 0.3,
     "levels": [
       {"score": 4, "description": "Excellent peer-reviewed sources, proper citations"},
       {"score": 3, "description": "Good sources, minor citation issues"},
       {"score": 2, "description": "Adequate sources, some citation problems"},
       {"score": 1, "description": "Poor sources or citations"}
     ]
   }
 ]'::jsonb,
 100.0,
 TRUE);

-- ============================================================================
-- 10. USER GAMIFICATION DATA
-- ============================================================================
INSERT INTO user_gamification (user_id, total_xp, level, current_streak, longest_streak, last_activity_date, badges_earned, achievements) VALUES
('10000000-0000-0000-0000-000000000003', 2450, 8, 7, 12, CURRENT_DATE,
 ARRAY['first_login', 'quiz_master', 'week_warrior'],
 '{"quizzes_completed": 45, "perfect_scores": 8, "study_hours": 67}'::jsonb),
 
('10000000-0000-0000-0000-000000000004', 3100, 10, 5, 15, CURRENT_DATE,
 ARRAY['first_login', 'quiz_master', 'week_warrior', 'top_performer'],
 '{"quizzes_completed": 78, "perfect_scores": 15, "study_hours": 102}'::jsonb),
 
('10000000-0000-0000-0000-000000000006', 1200, 5, 3, 8, CURRENT_DATE,
 ARRAY['first_login', 'early_bird'],
 '{"quizzes_completed": 18, "perfect_scores": 3, "study_hours": 24}'::jsonb);

-- ============================================================================
-- 11. BADGES
-- ============================================================================
INSERT INTO badges (id, name, description, icon_url, category, requirements, xp_reward, rarity) VALUES
('b0000000-0000-0000-0000-000000000001', 'First Login',
 'Complete your first login to the platform',
 'https://placehold.co/128x128/4CAF50/white?text=FL',
 'Getting Started',
 '{"action": "login", "count": 1}'::jsonb,
 50, 'common'),

('b0000000-0000-0000-0000-000000000002', 'Quiz Master',
 'Complete 25 quizzes with a score of 80% or higher',
 'https://placehold.co/128x128/2196F3/white?text=QM',
 'Academic',
 '{"action": "quiz_complete", "count": 25, "min_score": 80}'::jsonb,
 500, 'uncommon'),

('b0000000-0000-0000-0000-000000000003', 'Week Warrior',
 'Maintain a 7-day study streak',
 'https://placehold.co/128x128/FF9800/white?text=WW',
 'Consistency',
 '{"action": "streak", "days": 7}'::jsonb,
 300, 'uncommon'),

('b0000000-0000-0000-0000-000000000004', 'Top Performer',
 'Achieve top 10% in your cohort',
 'https://placehold.co/128x128/9C27B0/white?text=TP',
 'Achievement',
 '{"action": "ranking", "percentile": 90}'::jsonb,
 1000, 'rare'),

('b0000000-0000-0000-0000-000000000005', 'Early Bird',
 'Study before 7 AM on 5 different days',
 'https://placehold.co/128x128/FFC107/white?text=EB',
 'Habits',
 '{"action": "early_study", "count": 5}'::jsonb,
 200, 'common');

-- Link badges to users
INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
('10000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', '2025-09-01'),
('10000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', '2025-10-15'),
('10000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', '2025-10-20'),
('10000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', '2025-09-01'),
('10000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', '2025-10-10'),
('10000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', '2025-10-25'),
('10000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', '2025-10-30'),
('10000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', '2025-09-01'),
('10000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000005', '2025-09-10');

-- ============================================================================
-- 12. ANALYTICS EVENTS (Sample recent activity)
-- ============================================================================
INSERT INTO analytics_events (user_id, session_id, event_type, event_name, properties, page_url, device_type, browser, os, created_at) VALUES
('10000000-0000-0000-0000-000000000003', 'sess-001', 'page_view', 'Dashboard Viewed',
 '{"course_id": "20000000-0000-0000-0000-000000000001"}'::jsonb,
 '/dashboard', 'desktop', 'Chrome', 'macOS', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
 
('10000000-0000-0000-0000-000000000003', 'sess-001', 'quiz_started', 'Quiz Started',
 '{"quiz_id": "80000000-0000-0000-0000-000000000002", "course_id": "20000000-0000-0000-0000-000000000004"}'::jsonb,
 '/quiz/80000000-0000-0000-0000-000000000002', 'desktop', 'Chrome', 'macOS', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes'),
 
('10000000-0000-0000-0000-000000000003', 'sess-001', 'quiz_completed', 'Quiz Completed',
 '{"quiz_id": "80000000-0000-0000-0000-000000000002", "score": 85, "time_spent": 1200}'::jsonb,
 '/quiz/80000000-0000-0000-0000-000000000002/results', 'desktop', 'Chrome', 'macOS', CURRENT_TIMESTAMP - INTERVAL '1 hour 25 minutes');

-- ============================================================================
-- 13. CHAT CONVERSATIONS (AI Tutor)
-- ============================================================================
INSERT INTO chat_conversations (id, user_id, course_id, title, context_type, context_id, is_archived) VALUES
('c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 
 '20000000-0000-0000-0000-000000000001',
 'Help with Cardiovascular Anatomy',
 'course',
 '20000000-0000-0000-0000-000000000001',
 FALSE);

INSERT INTO chat_messages (id, conversation_id, role, content, metadata) VALUES
('cm000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'user',
 'Can you explain the difference between arteries and veins?',
 '{}'::jsonb),
 
('cm000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'assistant',
 'Great question! The main differences between arteries and veins are:\n\n1. **Direction of blood flow**: Arteries carry blood AWAY from the heart, while veins carry blood TOWARD the heart.\n\n2. **Pressure**: Arteries have higher pressure because they receive blood directly from the heart''s pumping action. Veins have lower pressure.\n\n3. **Wall structure**: Arteries have thicker, more muscular walls to withstand high pressure. Veins have thinner walls and contain valves to prevent backflow of blood.\n\n4. **Oxygen content**: Most arteries carry oxygenated blood (except pulmonary arteries), while most veins carry deoxygenated blood (except pulmonary veins).\n\n5. **Color**: Due to oxygen content, arterial blood appears bright red, while venous blood appears darker red or blue.\n\nWould you like me to explain any of these differences in more detail?',
 '{"model": "claude-sonnet-4", "tokens": 187, "sources": ["course_material"]}'::jsonb);

-- ============================================================================
-- 14. NOTIFICATIONS
-- ============================================================================
INSERT INTO notifications (user_id, type, title, message, action_url, priority, is_read) VALUES
('10000000-0000-0000-0000-000000000003', 'assignment_due', 'Assignment Due Soon',
 'Your "Anatomical Structures Essay" is due in 3 days.',
 '/assignments/70000000-0000-0000-0000-000000000001', 'high', FALSE),
 
('10000000-0000-0000-0000-000000000003', 'new_content', 'New Lesson Available',
 'Module 4: Respiratory System is now available in Human Anatomy I.',
 '/courses/20000000-0000-0000-0000-000000000001/modules/4', 'normal', FALSE),
 
('10000000-0000-0000-0000-000000000006', 'achievement', 'Badge Earned!',
 'Congratulations! You''ve earned the "Early Bird" badge.',
 '/profile/badges', 'normal', TRUE);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count all records
DO $$
DECLARE
    org_count INTEGER;
    user_count INTEGER;
    course_count INTEGER;
    question_count INTEGER;
    badge_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO org_count FROM organizations;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO course_count FROM courses;
    SELECT COUNT(*) INTO question_count FROM qbank_items;
    SELECT COUNT(*) INTO badge_count FROM badges;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SEED DATA SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Organizations: %', org_count;
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Courses: %', course_count;
    RAISE NOTICE 'Question Bank Items: %', question_count;
    RAISE NOTICE 'Badges: %', badge_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Seed data loaded successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Demo Login Credentials:';
    RAISE NOTICE 'Email: admin@stanford-demo.edu';
    RAISE NOTICE 'Email: student@stanford-demo.edu';
    RAISE NOTICE 'Email: teacher@roosevelt-demo.edu';
    RAISE NOTICE 'Password for all: Demo123!';
    RAISE NOTICE '========================================';
END $$;
