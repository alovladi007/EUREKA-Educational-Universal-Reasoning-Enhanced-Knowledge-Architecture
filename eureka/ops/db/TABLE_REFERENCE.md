# 📊 EUREKA Database - Complete Table Reference

## Overview

This document provides a complete reference for all 44 tables in the EUREKA database schema.

---

## 🏢 Core API Tables (8 tables)

### 1. `organizations`
Multi-tenant organization management

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `name` (VARCHAR) - Organization name
- `slug` (VARCHAR, UNIQUE) - URL-friendly identifier
- `tier` (VARCHAR) - Academic tier (high_school, undergraduate, graduate, medical, law, mba, engineering)
- `tier_config` (JSONB) - Tier-specific configuration
- `subscription_status` (VARCHAR) - Subscription state
- `subscription_expires_at` (TIMESTAMP) - Expiration date
- `settings` (JSONB) - Organization settings
- `ferpa_compliant` (BOOLEAN) - FERPA compliance flag
- `coppa_compliant` (BOOLEAN) - COPPA compliance flag
- `hipaa_compliant` (BOOLEAN) - HIPAA compliance flag
- `is_active` (BOOLEAN) - Active status
- `is_verified` (BOOLEAN) - Verification status
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP) - Auto-updated by trigger

**Indexes:**
- `idx_orgs_tier` - On tier
- `idx_orgs_active` - On is_active (partial)

**Relationships:**
- Parent of: users, courses, content_items

---

### 2. `users`
User accounts with role-based access control

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `org_id` (UUID, FK → organizations) - Organization
- `email` (VARCHAR) - Email address
- `hashed_password` (VARCHAR) - Bcrypt hashed password
- `first_name` (VARCHAR) - First name
- `last_name` (VARCHAR) - Last name
- `display_name` (VARCHAR) - Display name
- `avatar_url` (VARCHAR) - Profile picture URL
- `role` (user_role ENUM) - Role (super_admin, org_admin, teacher, student, parent)
- `locale` (VARCHAR) - Language preference
- `timezone` (VARCHAR) - Timezone
- `preferences` (JSONB) - User preferences
- `is_active` (BOOLEAN) - Active status
- `is_banned` (BOOLEAN) - Ban status
- `is_email_verified` (BOOLEAN) - Email verification
- `email_verification_token` (VARCHAR) - Verification token
- `password_reset_token` (VARCHAR) - Reset token
- `password_reset_expires` (TIMESTAMP) - Token expiration
- `failed_login_attempts` (INTEGER) - Failed login count
- `last_failed_login` (TIMESTAMP) - Last failed attempt
- `locked_until` (TIMESTAMP) - Account lock expiration
- `last_login_at` (TIMESTAMP) - Last successful login
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP) - Auto-updated by trigger

**Constraints:**
- UNIQUE (org_id, email) - Email unique per organization

**Indexes:**
- `idx_users_org` - On org_id
- `idx_users_email` - On email
- `idx_users_role` - On role
- `idx_users_active` - On is_active (partial)

**Relationships:**
- Child of: organizations
- Parent of: courses (instructor), enrollments, assignments (teacher), tutor_conversations, student_knowledge, student_mastery, learning_paths, student_analytics

---

### 3. `courses`
Course catalog

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `org_id` (UUID, FK → organizations) - Organization
- `code` (VARCHAR) - Course code
- `title` (VARCHAR) - Course title
- `description` (TEXT) - Course description
- `instructor_id` (UUID, FK → users) - Instructor
- `category` (VARCHAR) - Category
- `level` (VARCHAR) - Difficulty level
- `credits` (DECIMAL) - Credit hours
- `syllabus_url` (VARCHAR) - Syllabus link
- `thumbnail_url` (VARCHAR) - Course thumbnail
- `status` (VARCHAR) - Status (draft, published, archived)
- `max_students` (INTEGER) - Enrollment limit
- `start_date` (DATE) - Start date
- `end_date` (DATE) - End date
- `metadata` (JSONB) - Additional metadata
- `is_active` (BOOLEAN) - Active status
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP) - Auto-updated by trigger

**Constraints:**
- UNIQUE (org_id, code) - Course code unique per organization

**Indexes:**
- `idx_courses_org` - On org_id
- `idx_courses_instructor` - On instructor_id
- `idx_courses_status` - On status

**Relationships:**
- Child of: organizations, users (instructor)
- Parent of: enrollments, course_modules, assessments, tutor_conversations, student_analytics, course_analytics, learning_outcomes

---

### 4. `enrollments`
Student course enrollments

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `status` (VARCHAR) - Status (enrolled, completed, dropped, withdrawn)
- `progress_percentage` (DECIMAL) - Completion progress
- `enrolled_at` (TIMESTAMP) - Enrollment date
- `completed_at` (TIMESTAMP) - Completion date
- `dropped_at` (TIMESTAMP) - Drop date
- `final_grade` (VARCHAR) - Final letter grade
- `final_score` (DECIMAL) - Final numeric score
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Constraints:**
- UNIQUE (user_id, course_id) - One enrollment per student per course

**Indexes:**
- `idx_enrollments_user` - On user_id
- `idx_enrollments_course` - On course_id
- `idx_enrollments_status` - On status

**Relationships:**
- Child of: users, courses

---

### 5. `course_modules`
Course content structure

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `title` (VARCHAR) - Module title
- `description` (TEXT) - Module description
- `order_index` (INTEGER) - Display order
- `module_type` (VARCHAR) - Type (lesson, quiz, assignment, lab)
- `content_url` (VARCHAR) - Content link
- `estimated_duration` (INTEGER) - Duration in minutes
- `is_required` (BOOLEAN) - Required for completion
- `prerequisites` (JSONB) - Prerequisite module IDs
- `metadata` (JSONB) - Additional metadata
- `is_published` (BOOLEAN) - Published status
- `published_at` (TIMESTAMP) - Publish date
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_modules_course` - On course_id
- `idx_modules_order` - On order_index
- `idx_modules_published` - On is_published

**Relationships:**
- Child of: courses
- Parent of: assignments

---

### 6. `assignments`
Course assignments

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `module_id` (UUID, FK → course_modules) - Module
- `teacher_id` (UUID, FK → users) - Creator
- `title` (VARCHAR) - Assignment title
- `description` (TEXT) - Instructions
- `assignment_type` (VARCHAR) - Type (homework, project, essay, etc.)
- `max_points` (INTEGER) - Maximum points
- `due_date` (TIMESTAMP) - Due date
- `late_submission_allowed` (BOOLEAN) - Allow late submissions
- `late_penalty_percentage` (INTEGER) - Late penalty
- `attachments` (JSONB) - Attached files
- `rubric` (JSONB) - Grading rubric
- `is_published` (BOOLEAN) - Published status
- `published_at` (TIMESTAMP) - Publish date
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_assignments_course` - On course_id
- `idx_assignments_module` - On module_id
- `idx_assignments_teacher` - On teacher_id
- `idx_assignments_due` - On due_date

**Relationships:**
- Child of: courses, course_modules, users (teacher)
- Parent of: submissions

---

### 7. `grades`
Student grades

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `assignment_id` (UUID, FK → assignments) - Assignment
- `submission_id` (UUID, FK → submissions) - Submission
- `points_earned` (DECIMAL) - Points earned
- `points_possible` (DECIMAL) - Points possible
- `percentage` (DECIMAL) - Percentage score
- `letter_grade` (VARCHAR) - Letter grade
- `graded_by_id` (UUID, FK → users) - Grader
- `feedback` (TEXT) - Grader feedback
- `graded_at` (TIMESTAMP) - Grading date
- `is_late` (BOOLEAN) - Late submission flag
- `late_penalty_applied` (DECIMAL) - Late penalty
- `extra_credit` (DECIMAL) - Extra credit points
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_grades_user` - On user_id
- `idx_grades_course` - On course_id
- `idx_grades_assignment` - On assignment_id
- `idx_grades_submission` - On submission_id

**Relationships:**
- Child of: users, courses, assignments, submissions, users (grader)

---

### 8. `refresh_tokens`
Long-lived authentication tokens

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `token` (VARCHAR, UNIQUE) - Refresh token
- `expires_at` (TIMESTAMP) - Expiration date
- `is_revoked` (BOOLEAN) - Revoked status
- `created_at` (TIMESTAMP)
- `revoked_at` (TIMESTAMP) - Revocation date

**Indexes:**
- `idx_refresh_tokens_user` - On user_id
- `idx_refresh_tokens_token` - On token
- `idx_refresh_tokens_expires` - On expires_at

**Relationships:**
- Child of: users

---

## 🤖 AI Tutor Tables (5 tables)

### 9. `tutor_conversations`
AI tutor conversations

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `title` (VARCHAR) - Conversation title
- `topic` (VARCHAR) - Main topic
- `started_at` (TIMESTAMP) - Start time
- `ended_at` (TIMESTAMP) - End time
- `is_active` (BOOLEAN) - Active status
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_conversations_user` - On user_id
- `idx_conversations_course` - On course_id
- `idx_conversations_active` - On is_active

**Relationships:**
- Child of: users, courses
- Parent of: tutor_messages

---

### 10. `tutor_messages`
Individual tutor messages

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `conversation_id` (UUID, FK → tutor_conversations) - Conversation
- `role` (VARCHAR) - Role (user, assistant, system)
- `content` (TEXT) - Message content
- `attachments` (JSONB) - Attached files
- `model_used` (VARCHAR) - AI model
- `tokens_used` (INTEGER) - Token count
- `confidence_score` (DECIMAL) - AI confidence
- `rag_sources` (JSONB) - RAG source documents
- `teaching_method` (VARCHAR) - Method used
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_messages_conversation` - On conversation_id
- `idx_messages_role` - On role
- `idx_messages_created` - On created_at

**Relationships:**
- Child of: tutor_conversations

---

### 11. `course_content`
RAG content with vector embeddings

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `content_type` (VARCHAR) - Type (lecture, reading, video, etc.)
- `title` (VARCHAR) - Content title
- `description` (TEXT) - Content description
- `text_content` (TEXT) - Full text
- `embedding` (VECTOR) - Vector embedding for RAG
- `metadata` (JSONB) - Additional metadata
- `source_url` (VARCHAR) - Source URL
- `is_indexed` (BOOLEAN) - Indexing status
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_course_content_course` - On course_id
- `idx_course_content_type` - On content_type
- `idx_course_content_embedding` - Vector index (ivfflat)

**Relationships:**
- Child of: courses

---

### 12. `student_knowledge`
Knowledge state tracking

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `topic` (VARCHAR) - Topic/concept
- `understanding_level` (INTEGER) - Understanding (1-10)
- `confidence_score` (DECIMAL) - Confidence level
- `last_assessed` (TIMESTAMP) - Last assessment
- `needs_review` (BOOLEAN) - Review needed flag
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_student_knowledge_user` - On user_id
- `idx_student_knowledge_course` - On course_id
- `idx_student_knowledge_topic` - On topic

**Relationships:**
- Child of: users, courses

---

### 13. `tutor_sessions`
Tutoring sessions

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `started_at` (TIMESTAMP) - Start time
- `ended_at` (TIMESTAMP) - End time
- `duration_seconds` (INTEGER) - Duration
- `topics_covered` (JSONB) - Topics discussed
- `outcomes` (JSONB) - Session outcomes
- `satisfaction_rating` (INTEGER) - Student rating
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_tutor_sessions_user` - On user_id
- `idx_tutor_sessions_course` - On course_id
- `idx_tutor_sessions_started` - On started_at

**Relationships:**
- Child of: users, courses

---

## 📝 Assessment Engine Tables (7 tables)

### 14. `assessments`
Assessment definitions

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `title` (VARCHAR) - Assessment title
- `description` (TEXT) - Instructions
- `assessment_type` (VARCHAR) - Type (quiz, exam, test, etc.)
- `time_limit_minutes` (INTEGER) - Time limit
- `max_attempts` (INTEGER) - Attempt limit
- `passing_score` (DECIMAL) - Passing percentage
- `shuffle_questions` (BOOLEAN) - Randomize questions
- `show_correct_answers` (BOOLEAN) - Show answers after
- `available_from` (TIMESTAMP) - Availability start
- `available_until` (TIMESTAMP) - Availability end
- `is_published` (BOOLEAN) - Published status
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_assessments_course` - On course_id
- `idx_assessments_type` - On assessment_type
- `idx_assessments_published` - On is_published

**Relationships:**
- Child of: courses
- Parent of: questions, submissions

---

### 15. `questions`
Question bank

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `assessment_id` (UUID, FK → assessments) - Assessment
- `question_type` (VARCHAR) - Type (multiple_choice, true_false, short_answer, essay, code)
- `question_text` (TEXT) - Question content
- `points` (INTEGER) - Point value
- `order_index` (INTEGER) - Display order
- `options` (JSONB) - Answer options (for MC/TF)
- `correct_answer` (TEXT) - Correct answer
- `rubric` (JSONB) - Grading rubric
- `explanation` (TEXT) - Explanation text
- `difficulty` (VARCHAR) - Difficulty level
- `tags` (JSONB) - Question tags
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_questions_assessment` - On assessment_id
- `idx_questions_type` - On question_type
- `idx_questions_order` - On order_index

**Relationships:**
- Child of: assessments
- Parent of: answers

---

### 16. `grading_rubrics`
Scoring rubrics

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `name` (VARCHAR) - Rubric name
- `description` (TEXT) - Description
- `criteria` (JSONB) - Rubric criteria
- `max_score` (INTEGER) - Maximum score
- `is_reusable` (BOOLEAN) - Reusable flag
- `created_by_id` (UUID, FK → users) - Creator
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_rubrics_reusable` - On is_reusable
- `idx_rubrics_created_by` - On created_by_id

**Relationships:**
- Child of: users (creator)
- Parent of: rubric_scores

---

### 17. `submissions`
Student submissions

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `assignment_id` (UUID, FK → assignments) - Assignment
- `assessment_id` (UUID, FK → assessments) - Assessment
- `submission_type` (VARCHAR) - Type
- `content` (TEXT) - Submission content
- `attachments` (JSONB) - Attached files
- `submitted_at` (TIMESTAMP) - Submission time
- `is_late` (BOOLEAN) - Late submission flag
- `attempt_number` (INTEGER) - Attempt number
- `time_spent_seconds` (INTEGER) - Time spent
- `status` (VARCHAR) - Status (submitted, graded, returned)
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_submissions_user` - On user_id
- `idx_submissions_assignment` - On assignment_id
- `idx_submissions_assessment` - On assessment_id
- `idx_submissions_status` - On status

**Relationships:**
- Child of: users, assignments, assessments
- Parent of: answers, grading_results, grades

---

### 18. `answers`
Student answers to questions

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `submission_id` (UUID, FK → submissions) - Submission
- `question_id` (UUID, FK → questions) - Question
- `answer_text` (TEXT) - Student answer
- `selected_options` (JSONB) - Selected options (MC/TF)
- `is_correct` (BOOLEAN) - Correctness
- `points_earned` (DECIMAL) - Points earned
- `points_possible` (DECIMAL) - Points possible
- `auto_graded` (BOOLEAN) - Auto-graded flag
- `needs_manual_review` (BOOLEAN) - Manual review flag
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_answers_submission` - On submission_id
- `idx_answers_question` - On question_id
- `idx_answers_review` - On needs_manual_review

**Relationships:**
- Child of: submissions, questions
- Parent of: rubric_scores

---

### 19. `rubric_scores`
Rubric-based scoring

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `answer_id` (UUID, FK → answers) - Answer
- `rubric_id` (UUID, FK → grading_rubrics) - Rubric
- `criterion_id` (VARCHAR) - Criterion identifier
- `score` (DECIMAL) - Score for criterion
- `max_score` (DECIMAL) - Maximum score
- `feedback` (TEXT) - Criterion feedback
- `graded_by_id` (UUID, FK → users) - Grader
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_rubric_scores_answer` - On answer_id
- `idx_rubric_scores_rubric` - On rubric_id
- `idx_rubric_scores_grader` - On graded_by_id

**Relationships:**
- Child of: answers, grading_rubrics, users (grader)

---

### 20. `grading_results`
Final grading results

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `submission_id` (UUID, FK → submissions) - Submission
- `total_score` (DECIMAL) - Total score
- `percentage` (DECIMAL) - Percentage
- `letter_grade` (VARCHAR) - Letter grade
- `grading_method` (VARCHAR) - Grading method
- `ai_feedback` (TEXT) - AI-generated feedback
- `human_feedback` (TEXT) - Human feedback
- `confidence_score` (DECIMAL) - AI confidence
- `needs_manual_review` (BOOLEAN) - Manual review flag
- `graded_by_id` (UUID, FK → users) - Grader
- `graded_at` (TIMESTAMP) - Grading time
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_grading_results_submission` - On submission_id
- `idx_grading_results_review` - On needs_manual_review
- `idx_grading_results_grader` - On graded_by_id

**Relationships:**
- Child of: submissions, users (grader)

---

## 🎯 Adaptive Learning Tables (6 tables)

### 21. `concepts`
Knowledge graph concepts

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `name` (VARCHAR) - Concept name
- `description` (TEXT) - Description
- `difficulty` (VARCHAR) - Difficulty level
- `prerequisites` (JSONB) - Prerequisite concept IDs
- `related_concepts` (JSONB) - Related concept IDs
- `learning_resources` (JSONB) - Learning materials
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_concepts_course` - On course_id
- `idx_concepts_difficulty` - On difficulty

**Relationships:**
- Child of: courses
- Parent of: student_mastery, skill_gaps

---

### 22. `student_mastery`
Mastery tracking

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `concept_id` (UUID, FK → concepts) - Concept
- `mastery_level` (DECIMAL) - Mastery (0-100)
- `confidence_level` (DECIMAL) - Confidence
- `last_practiced` (TIMESTAMP) - Last practice
- `practice_count` (INTEGER) - Practice count
- `success_rate` (DECIMAL) - Success rate
- `time_to_mastery_minutes` (INTEGER) - Time to master
- `needs_review` (BOOLEAN) - Review needed
- `next_review_date` (DATE) - Next review
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_student_mastery_user` - On user_id
- `idx_student_mastery_concept` - On concept_id
- `idx_student_mastery_review` - On needs_review
- `idx_student_mastery_next_review` - On next_review_date

**Relationships:**
- Child of: users, concepts

---

### 23. `learning_paths`
Personalized learning sequences

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `name` (VARCHAR) - Path name
- `description` (TEXT) - Description
- `concept_sequence` (JSONB) - Ordered concepts
- `estimated_duration_hours` (INTEGER) - Duration
- `difficulty` (VARCHAR) - Difficulty
- `is_active` (BOOLEAN) - Active status
- `progress_percentage` (DECIMAL) - Progress
- `started_at` (TIMESTAMP) - Start time
- `completed_at` (TIMESTAMP) - Completion time
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_learning_paths_user` - On user_id
- `idx_learning_paths_course` - On course_id
- `idx_learning_paths_active` - On is_active

**Relationships:**
- Child of: users, courses

---

### 24. `recommendations`
Next-step recommendations

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `recommendation_type` (VARCHAR) - Type
- `title` (VARCHAR) - Recommendation title
- `description` (TEXT) - Description
- `priority` (INTEGER) - Priority
- `reasoning` (TEXT) - Recommendation reason
- `resource_url` (VARCHAR) - Resource link
- `is_completed` (BOOLEAN) - Completion status
- `completed_at` (TIMESTAMP) - Completion time
- `expires_at` (TIMESTAMP) - Expiration
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_recommendations_user` - On user_id
- `idx_recommendations_course` - On course_id
- `idx_recommendations_completed` - On is_completed

**Relationships:**
- Child of: users, courses

---

### 25. `skill_gaps`
Identified knowledge gaps

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `concept_id` (UUID, FK → concepts) - Concept
- `gap_severity` (VARCHAR) - Severity (low, medium, high)
- `identified_at` (TIMESTAMP) - Identification time
- `evidence` (JSONB) - Supporting evidence
- `recommended_actions` (JSONB) - Recommended actions
- `is_resolved` (BOOLEAN) - Resolution status
- `resolved_at` (TIMESTAMP) - Resolution time
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_skill_gaps_user` - On user_id
- `idx_skill_gaps_concept` - On concept_id
- `idx_skill_gaps_resolved` - On is_resolved

**Relationships:**
- Child of: users, concepts

---

### 26. `practice_sessions`
Practice activities

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `concept_id` (UUID, FK → concepts) - Concept
- `started_at` (TIMESTAMP) - Start time
- `ended_at` (TIMESTAMP) - End time
- `duration_seconds` (INTEGER) - Duration
- `questions_attempted` (INTEGER) - Questions count
- `questions_correct` (INTEGER) - Correct count
- `accuracy` (DECIMAL) - Accuracy rate
- `difficulty_level` (VARCHAR) - Difficulty
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_practice_sessions_user` - On user_id
- `idx_practice_sessions_concept` - On concept_id
- `idx_practice_sessions_started` - On started_at

**Relationships:**
- Child of: users, concepts

---

## 📊 Analytics Dashboard Tables (8 tables)

### 27. `student_analytics`
Per-student metrics

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `time_spent_seconds` (INTEGER) - Time spent
- `assignments_completed` (INTEGER) - Completed assignments
- `assignments_total` (INTEGER) - Total assignments
- `average_grade` (DECIMAL) - Average grade
- `engagement_score` (DECIMAL) - Engagement score
- `at_risk_score` (DECIMAL) - At-risk score
- `last_active` (TIMESTAMP) - Last activity
- `streak_days` (INTEGER) - Activity streak
- `metadata` (JSONB) - Additional data
- `calculated_at` (TIMESTAMP) - Calculation time
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_student_analytics_user` - On user_id
- `idx_student_analytics_course` - On course_id
- `idx_student_analytics_risk` - On at_risk_score

**Relationships:**
- Child of: users, courses

---

### 28. `course_analytics`
Per-course metrics

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `total_enrollments` (INTEGER) - Total enrolled
- `active_students` (INTEGER) - Active students
- `completion_rate` (DECIMAL) - Completion rate
- `average_grade` (DECIMAL) - Average grade
- `average_time_spent` (INTEGER) - Average time
- `engagement_score` (DECIMAL) - Engagement score
- `at_risk_students` (INTEGER) - At-risk count
- `metadata` (JSONB) - Additional data
- `calculated_at` (TIMESTAMP) - Calculation time
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_course_analytics_course` - On course_id
- `idx_course_analytics_calculated` - On calculated_at

**Relationships:**
- Child of: courses

---

### 29. `learning_outcomes`
Learning objectives

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `course_id` (UUID, FK → courses) - Course
- `outcome_code` (VARCHAR) - Outcome code
- `description` (TEXT) - Outcome description
- `category` (VARCHAR) - Category
- `level` (VARCHAR) - Bloom's taxonomy level
- `assessment_method` (VARCHAR) - Assessment method
- `target_score` (DECIMAL) - Target score
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_learning_outcomes_course` - On course_id
- `idx_learning_outcomes_code` - On outcome_code

**Relationships:**
- Child of: courses
- Parent of: student_outcome_achievements

---

### 30. `student_outcome_achievements`
Outcome tracking

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `outcome_id` (UUID, FK → learning_outcomes) - Outcome
- `achieved` (BOOLEAN) - Achievement status
- `score` (DECIMAL) - Achievement score
- `evidence` (JSONB) - Evidence data
- `achieved_at` (TIMESTAMP) - Achievement time
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_outcome_achievements_user` - On user_id
- `idx_outcome_achievements_outcome` - On outcome_id
- `idx_outcome_achievements_achieved` - On achieved

**Relationships:**
- Child of: users, learning_outcomes

---

### 31. `at_risk_alerts`
Early warning system

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `alert_type` (VARCHAR) - Alert type
- `severity` (VARCHAR) - Severity (low, medium, high)
- `reason` (TEXT) - Alert reason
- `recommended_actions` (JSONB) - Actions
- `is_resolved` (BOOLEAN) - Resolution status
- `resolved_at` (TIMESTAMP) - Resolution time
- `resolved_by_id` (UUID, FK → users) - Resolver
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_at_risk_alerts_user` - On user_id
- `idx_at_risk_alerts_course` - On course_id
- `idx_at_risk_alerts_resolved` - On is_resolved
- `idx_at_risk_alerts_severity` - On severity

**Relationships:**
- Child of: users, courses, users (resolver)

---

### 32. `engagement_events`
Activity tracking

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `event_type` (VARCHAR) - Event type
- `event_category` (VARCHAR) - Category
- `resource_type` (VARCHAR) - Resource type
- `resource_id` (UUID) - Resource ID
- `event_data` (JSONB) - Event data
- `session_id` (VARCHAR) - Session ID
- `ip_address` (VARCHAR) - IP address
- `user_agent` (VARCHAR) - User agent
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_engagement_events_user` - On user_id
- `idx_engagement_events_type` - On event_type
- `idx_engagement_events_created` - On created_at
- `idx_engagement_events_session` - On session_id

**Relationships:**
- Child of: users

---

### 33. `performance_trends`
Trend analysis

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Student
- `course_id` (UUID, FK → courses) - Course
- `metric_name` (VARCHAR) - Metric name
- `metric_value` (DECIMAL) - Metric value
- `trend_direction` (VARCHAR) - Direction (up, down, stable)
- `period_start` (DATE) - Period start
- `period_end` (DATE) - Period end
- `comparison_value` (DECIMAL) - Comparison
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_performance_trends_user` - On user_id
- `idx_performance_trends_course` - On course_id
- `idx_performance_trends_metric` - On metric_name
- `idx_performance_trends_period` - On period_start, period_end

**Relationships:**
- Child of: users, courses

---

## 📁 Content Management Tables (2 tables)

### 34. `content_items`
Content metadata

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `org_id` (UUID, FK → organizations) - Organization
- `title` (VARCHAR) - Title
- `description` (TEXT) - Description
- `content_type` (VARCHAR) - Type
- `file_url` (VARCHAR) - File URL
- `file_size` (INTEGER) - File size
- `mime_type` (VARCHAR) - MIME type
- `thumbnail_url` (VARCHAR) - Thumbnail
- `tags` (JSONB) - Tags
- `is_public` (BOOLEAN) - Public flag
- `created_by_id` (UUID, FK → users) - Creator
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_content_items_org` - On org_id
- `idx_content_items_type` - On content_type
- `idx_content_items_public` - On is_public
- `idx_content_items_created_by` - On created_by_id

**Relationships:**
- Child of: organizations, users (creator)
- Parent of: content_access_logs

---

### 35. `content_access_logs`
Access tracking

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `content_id` (UUID, FK → content_items) - Content
- `user_id` (UUID, FK → users) - User
- `access_type` (VARCHAR) - Access type
- `duration_seconds` (INTEGER) - Duration
- `completed` (BOOLEAN) - Completion status
- `ip_address` (VARCHAR) - IP address
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_content_access_content` - On content_id
- `idx_content_access_user` - On user_id
- `idx_content_access_created` - On created_at

**Relationships:**
- Child of: content_items, users

---

## 🎮 Gamification Tables (5 tables)

### 36. `badges`
Achievement badges

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `name` (VARCHAR) - Badge name
- `description` (TEXT) - Description
- `icon_url` (VARCHAR) - Icon URL
- `category` (VARCHAR) - Category
- `criteria` (JSONB) - Earning criteria
- `points_value` (INTEGER) - Points value
- `is_active` (BOOLEAN) - Active status
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_badges_category` - On category
- `idx_badges_active` - On is_active

**Relationships:**
- Parent of: user_badges

---

### 37. `user_badges`
Awarded badges

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `badge_id` (UUID, FK → badges) - Badge
- `earned_at` (TIMESTAMP) - Earned time
- `evidence` (JSONB) - Evidence data
- `created_at` (TIMESTAMP)

**Constraints:**
- UNIQUE (user_id, badge_id) - One badge per user

**Indexes:**
- `idx_user_badges_user` - On user_id
- `idx_user_badges_badge` - On badge_id
- `idx_user_badges_earned` - On earned_at

**Relationships:**
- Child of: users, badges

---

### 38. `points_transactions`
Point system

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `points` (INTEGER) - Points (+ or -)
- `transaction_type` (VARCHAR) - Type
- `reason` (TEXT) - Reason
- `reference_type` (VARCHAR) - Reference type
- `reference_id` (UUID) - Reference ID
- `balance_after` (INTEGER) - Balance after
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_points_transactions_user` - On user_id
- `idx_points_transactions_type` - On transaction_type
- `idx_points_transactions_created` - On created_at

**Relationships:**
- Child of: users

---

### 39. `leaderboard_entries`
Rankings

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `leaderboard_type` (VARCHAR) - Type
- `scope` (VARCHAR) - Scope
- `period` (VARCHAR) - Period
- `score` (DECIMAL) - Score
- `rank` (INTEGER) - Rank
- `metadata` (JSONB) - Additional data
- `calculated_at` (TIMESTAMP) - Calculation time
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_leaderboard_user` - On user_id
- `idx_leaderboard_type` - On leaderboard_type
- `idx_leaderboard_rank` - On rank
- `idx_leaderboard_calculated` - On calculated_at

**Relationships:**
- Child of: users

---

### 40. `user_streaks`
Activity streaks

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `streak_type` (VARCHAR) - Type
- `current_streak` (INTEGER) - Current streak
- `longest_streak` (INTEGER) - Longest streak
- `last_activity_date` (DATE) - Last activity
- `streak_start_date` (DATE) - Streak start
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_user_streaks_user` - On user_id
- `idx_user_streaks_type` - On streak_type
- `idx_user_streaks_last_activity` - On last_activity_date

**Relationships:**
- Child of: users

---

## 🛠️ Support Systems Tables (3 tables)

### 41. `file_uploads`
File management

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Uploader
- `org_id` (UUID, FK → organizations) - Organization
- `filename` (VARCHAR) - Original filename
- `storage_key` (VARCHAR) - Storage path
- `file_size` (INTEGER) - File size
- `mime_type` (VARCHAR) - MIME type
- `upload_type` (VARCHAR) - Upload type
- `reference_type` (VARCHAR) - Reference type
- `reference_id` (UUID) - Reference ID
- `is_public` (BOOLEAN) - Public flag
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_file_uploads_user` - On user_id
- `idx_file_uploads_org` - On org_id
- `idx_file_uploads_type` - On upload_type
- `idx_file_uploads_reference` - On reference_type, reference_id

**Relationships:**
- Child of: users, organizations

---

### 42. `notifications`
Multi-channel notifications

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - Recipient
- `notification_type` (VARCHAR) - Type
- `channel` (VARCHAR) - Channel (in_app, email, sms, push)
- `title` (VARCHAR) - Title
- `message` (TEXT) - Message
- `data` (JSONB) - Additional data
- `priority` (VARCHAR) - Priority
- `is_read` (BOOLEAN) - Read status
- `read_at` (TIMESTAMP) - Read time
- `sent_at` (TIMESTAMP) - Send time
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_notifications_user` - On user_id
- `idx_notifications_type` - On notification_type
- `idx_notifications_read` - On is_read
- `idx_notifications_created` - On created_at

**Relationships:**
- Child of: users

---

### 43. `audit_logs`
Immutable audit trail

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK → users) - User
- `action` (VARCHAR) - Action
- `resource_type` (VARCHAR) - Resource type
- `resource_id` (UUID) - Resource ID
- `changes` (JSONB) - Changed data
- `ip_address` (VARCHAR) - IP address
- `user_agent` (VARCHAR) - User agent
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)

**Indexes:**
- `idx_audit_logs_user` - On user_id
- `idx_audit_logs_action` - On action
- `idx_audit_logs_resource` - On resource_type, resource_id
- `idx_audit_logs_created` - On created_at

**Relationships:**
- Child of: users

---

## 👨‍👧 Compliance Tables (1 table)

### 44. `parent_student_relationships`
COPPA compliance

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `parent_user_id` (UUID, FK → users) - Parent
- `student_user_id` (UUID, FK → users) - Student
- `relationship_type` (VARCHAR) - Relationship
- `consent_given` (BOOLEAN) - Consent status
- `consent_date` (TIMESTAMP) - Consent date
- `consent_method` (VARCHAR) - Consent method
- `is_active` (BOOLEAN) - Active status
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `idx_parent_student_parent` - On parent_user_id
- `idx_parent_student_student` - On student_user_id
- `idx_parent_student_active` - On is_active

**Relationships:**
- Child of: users (parent), users (student)

---

## 📊 Summary Statistics

### Tables by Service
- **Core API**: 8 tables
- **AI Tutor**: 5 tables
- **Assessment**: 7 tables
- **Adaptive Learning**: 6 tables
- **Analytics**: 8 tables
- **Content Management**: 2 tables
- **Gamification**: 5 tables
- **Support Systems**: 3 tables
- **Compliance**: 1 table

**Total: 44 tables**

### Additional Database Objects
- **Indexes**: 130+
- **Views**: 3
- **Functions**: 1
- **Triggers**: 3
- **Enum Types**: 1
- **Foreign Keys**: 40+

**Total Objects: 175+**

---

## 🔍 Common Queries

### Find all courses for a student
```sql
SELECT c.* 
FROM courses c
JOIN enrollments e ON c.id = e.course_id
WHERE e.user_id = 'student-uuid' AND e.status = 'enrolled';
```

### Get student's grade for a course
```sql
SELECT 
    u.first_name,
    u.last_name,
    c.title,
    e.final_grade,
    e.final_score
FROM enrollments e
JOIN users u ON e.user_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE u.id = 'student-uuid' AND c.id = 'course-uuid';
```

### Find at-risk students
```sql
SELECT 
    u.first_name,
    u.last_name,
    c.title,
    sa.at_risk_score,
    sa.engagement_score
FROM student_analytics sa
JOIN users u ON sa.user_id = u.id
JOIN courses c ON sa.course_id = c.id
WHERE sa.at_risk_score > 0.7
ORDER BY sa.at_risk_score DESC;
```

### Get AI tutor conversation history
```sql
SELECT 
    tc.title,
    tm.role,
    tm.content,
    tm.created_at
FROM tutor_messages tm
JOIN tutor_conversations tc ON tm.conversation_id = tc.id
WHERE tc.user_id = 'student-uuid' AND tc.course_id = 'course-uuid'
ORDER BY tm.created_at;
```

### Calculate student mastery by concept
```sql
SELECT 
    c.name as concept,
    sm.mastery_level,
    sm.confidence_level,
    sm.last_practiced
FROM student_mastery sm
JOIN concepts c ON sm.concept_id = c.id
WHERE sm.user_id = 'student-uuid'
ORDER BY sm.mastery_level ASC;
```

---

**✅ All 44 tables documented with complete column details and relationships!**
