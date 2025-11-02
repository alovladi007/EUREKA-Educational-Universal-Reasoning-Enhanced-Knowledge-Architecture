"""
EUREKA - Complete Database Migration
Adds ALL missing tables for Phase 2

Run with: alembic revision --autogenerate -m "complete_all_service_tables"
Then: alembic upgrade head
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from datetime import datetime

# Revision identifiers
revision = 'complete_phase2_tables'
down_revision = None  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade():
    """Add all missing tables for Phase 2"""
    
    # ========================================
    # ASSESSMENT ENGINE TABLES
    # ========================================
    
    # Grading Rubrics
    op.create_table(
        'grading_rubrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('criteria', postgresql.JSONB, nullable=False),
        sa.Column('max_score', sa.Numeric(5, 2)),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE')),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_grading_rubrics_course', 'grading_rubrics', ['course_id'])
    op.create_index('idx_grading_rubrics_created_by', 'grading_rubrics', ['created_by'])
    
    # Assessments
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('assessment_type', sa.Enum('quiz', 'exam', 'assignment', 'project', 'discussion', name='assessment_type'), nullable=False),
        sa.Column('content', postgresql.JSONB, nullable=False),  # Questions, prompts, etc.
        sa.Column('rubric_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('grading_rubrics.id', ondelete='SET NULL')),
        sa.Column('max_score', sa.Numeric(5, 2)),
        sa.Column('passing_score', sa.Numeric(5, 2)),
        sa.Column('time_limit_minutes', sa.Integer),
        sa.Column('attempts_allowed', sa.Integer, default=1),
        sa.Column('randomize_questions', sa.Boolean, default=False),
        sa.Column('show_correct_answers', sa.Boolean, default=True),
        sa.Column('available_from', sa.DateTime(timezone=True)),
        sa.Column('available_until', sa.DateTime(timezone=True)),
        sa.Column('proctoring_enabled', sa.Boolean, default=False),
        sa.Column('ai_grading_enabled', sa.Boolean, default=True),
        sa.Column('is_published', sa.Boolean, default=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_assessments_course', 'assessments', ['course_id'])
    op.create_index('idx_assessments_type', 'assessments', ['assessment_type'])
    
    # Submissions
    op.create_table(
        'submissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('attempt_number', sa.Integer, default=1),
        sa.Column('answers', postgresql.JSONB, nullable=False),
        sa.Column('files', postgresql.JSONB),  # Array of file URLs
        sa.Column('status', sa.Enum('in_progress', 'submitted', 'graded', 'returned', name='submission_status'), default='in_progress'),
        sa.Column('score', sa.Numeric(5, 2)),
        sa.Column('max_score', sa.Numeric(5, 2)),
        sa.Column('feedback', sa.Text),
        sa.Column('ai_feedback', postgresql.JSONB),
        sa.Column('time_spent_minutes', sa.Integer),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('submitted_at', sa.DateTime(timezone=True)),
        sa.Column('graded_at', sa.DateTime(timezone=True)),
        sa.Column('graded_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_submissions_assessment', 'submissions', ['assessment_id'])
    op.create_index('idx_submissions_user', 'submissions', ['user_id'])
    op.create_index('idx_submissions_status', 'submissions', ['status'])
    
    # Grading Results
    op.create_table(
        'grading_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('submission_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('submissions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rubric_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('grading_rubrics.id', ondelete='SET NULL')),
        sa.Column('scores', postgresql.JSONB, nullable=False),  # Per-criterion scores
        sa.Column('total_score', sa.Numeric(5, 2)),
        sa.Column('feedback', sa.Text),
        sa.Column('graded_by', sa.String(50)),  # 'ai' or user_id
        sa.Column('grading_strategy', sa.String(50)),  # 'rubric', 'ml', 'hybrid', etc.
        sa.Column('confidence_score', sa.Numeric(3, 2)),
        sa.Column('graded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    op.create_index('idx_grading_results_submission', 'grading_results', ['submission_id'])
    
    # ========================================
    # ADAPTIVE LEARNING TABLES
    # ========================================
    
    # Learning Paths
    op.create_table(
        'learning_paths',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('path_data', postgresql.JSONB, nullable=False),  # Sequence of modules/skills
        sa.Column('current_step', sa.Integer, default=0),
        sa.Column('total_steps', sa.Integer),
        sa.Column('difficulty_level', sa.Numeric(3, 2)),  # 0.0 to 1.0
        sa.Column('completed', sa.Boolean, default=False),
        sa.Column('completion_percentage', sa.Numeric(5, 2), default=0),
        sa.Column('last_accessed', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_learning_paths_user', 'learning_paths', ['user_id'])
    op.create_index('idx_learning_paths_course', 'learning_paths', ['course_id'])
    op.create_index('idx_learning_paths_completed', 'learning_paths', ['completed'])
    
    # User Progress
    op.create_table(
        'user_progress',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('module_id', sa.String(100)),
        sa.Column('skill_id', sa.String(100)),
        sa.Column('mastery_level', sa.Numeric(3, 2), default=0),  # 0.0 to 1.0
        sa.Column('attempts', sa.Integer, default=0),
        sa.Column('correct_attempts', sa.Integer, default=0),
        sa.Column('last_practiced', sa.DateTime(timezone=True)),
        sa.Column('practice_count', sa.Integer, default=0),
        sa.Column('time_spent_minutes', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()')),
        sa.CheckConstraint('mastery_level >= 0 AND mastery_level <= 1', name='check_mastery_range')
    )
    op.create_index('idx_user_progress_user_course', 'user_progress', ['user_id', 'course_id'])
    op.create_index('idx_user_progress_skill', 'user_progress', ['skill_id'])
    
    # Recommendations
    op.create_table(
        'recommendations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content_id', postgresql.UUID(as_uuid=True)),
        sa.Column('content_type', sa.String(50)),  # 'course', 'module', 'assessment', etc.
        sa.Column('recommendation_type', sa.String(50)),  # 'next_step', 'review', 'challenge', etc.
        sa.Column('reason', sa.Text),
        sa.Column('score', sa.Numeric(3, 2)),  # Recommendation confidence
        sa.Column('algorithm', sa.String(50)),  # Which algorithm generated this
        sa.Column('shown', sa.Boolean, default=False),
        sa.Column('clicked', sa.Boolean, default=False),
        sa.Column('completed', sa.Boolean, default=False),
        sa.Column('shown_at', sa.DateTime(timezone=True)),
        sa.Column('clicked_at', sa.DateTime(timezone=True)),
        sa.Column('expires_at', sa.DateTime(timezone=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    op.create_index('idx_recommendations_user', 'recommendations', ['user_id'])
    op.create_index('idx_recommendations_shown', 'recommendations', ['shown'])
    
    # Mastery Tracking
    op.create_table(
        'mastery_tracking',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('skill_id', sa.String(100), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('correct', sa.Boolean, nullable=False),
        sa.Column('time_taken_seconds', sa.Integer),
        sa.Column('difficulty', sa.Numeric(3, 2)),
        sa.Column('previous_mastery', sa.Numeric(3, 2)),
        sa.Column('updated_mastery', sa.Numeric(3, 2)),
        sa.Column('context', postgresql.JSONB)  # Additional context about the interaction
    )
    op.create_index('idx_mastery_tracking_user', 'mastery_tracking', ['user_id'])
    op.create_index('idx_mastery_tracking_skill', 'mastery_tracking', ['skill_id'])
    op.create_index('idx_mastery_tracking_timestamp', 'mastery_tracking', ['timestamp'])
    
    # ========================================
    # ANALYTICS DASHBOARD TABLES
    # ========================================
    
    # Analytics Events
    op.create_table(
        'analytics_events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE')),
        sa.Column('session_id', postgresql.UUID(as_uuid=True)),
        sa.Column('event_type', sa.String(100), nullable=False),  # 'page_view', 'video_watch', 'quiz_start', etc.
        sa.Column('event_data', postgresql.JSONB),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='SET NULL')),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('ip_address', sa.String(45)),  # IPv6 compatible
        sa.Column('user_agent', sa.Text),
        sa.Column('referrer', sa.Text),
        sa.Column('page_url', sa.Text)
    )
    op.create_index('idx_analytics_events_user', 'analytics_events', ['user_id'])
    op.create_index('idx_analytics_events_type', 'analytics_events', ['event_type'])
    op.create_index('idx_analytics_events_timestamp', 'analytics_events', ['timestamp'])
    op.create_index('idx_analytics_events_session', 'analytics_events', ['session_id'])
    
    # Performance Metrics
    op.create_table(
        'performance_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE')),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE')),
        sa.Column('metric_name', sa.String(100), nullable=False),
        sa.Column('metric_value', sa.Numeric(10, 2)),
        sa.Column('metric_unit', sa.String(50)),
        sa.Column('period_type', sa.String(20)),  # 'daily', 'weekly', 'monthly'
        sa.Column('period_start', sa.Date),
        sa.Column('period_end', sa.Date),
        sa.Column('metadata', postgresql.JSONB),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    op.create_index('idx_performance_metrics_user', 'performance_metrics', ['user_id'])
    op.create_index('idx_performance_metrics_course', 'performance_metrics', ['course_id'])
    op.create_index('idx_performance_metrics_period', 'performance_metrics', ['period_start', 'period_end'])
    
    # Engagement Data
    op.create_table(
        'engagement_data',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('date', sa.Date, nullable=False),
        sa.Column('sessions', sa.Integer, default=0),
        sa.Column('total_time_minutes', sa.Integer, default=0),
        sa.Column('actions_taken', sa.Integer, default=0),
        sa.Column('content_accessed', postgresql.JSONB),  # Array of content IDs
        sa.Column('assessments_completed', sa.Integer, default=0),
        sa.Column('videos_watched', sa.Integer, default=0),
        sa.Column('discussions_posted', sa.Integer, default=0),
        sa.Column('questions_asked', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    op.create_index('idx_engagement_data_user_date', 'engagement_data', ['user_id', 'date'])
    op.create_unique_constraint('uq_engagement_user_date', 'engagement_data', ['user_id', 'date'])
    
    # ========================================
    # FILE STORAGE TABLES
    # ========================================
    
    # Files
    op.create_table(
        'files',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('original_filename', sa.String(255), nullable=False),
        sa.Column('file_path', sa.String(500), nullable=False),
        sa.Column('file_size', sa.BigInteger, nullable=False),
        sa.Column('mime_type', sa.String(100)),
        sa.Column('file_extension', sa.String(10)),
        sa.Column('storage_backend', sa.String(50), default='s3'),
        sa.Column('bucket_name', sa.String(100)),
        sa.Column('object_key', sa.String(500)),
        sa.Column('is_public', sa.Boolean, default=False),
        sa.Column('metadata', postgresql.JSONB),
        sa.Column('virus_scanned', sa.Boolean, default=False),
        sa.Column('scan_result', sa.String(50)),
        sa.Column('related_entity_type', sa.String(50)),  # 'submission', 'profile', etc.
        sa.Column('related_entity_id', postgresql.UUID(as_uuid=True)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_files_user', 'files', ['user_id'])
    op.create_index('idx_files_related_entity', 'files', ['related_entity_type', 'related_entity_id'])
    
    # ========================================
    # TUTOR-LLM TABLES
    # ========================================
    
    # Conversations
    op.create_table(
        'tutor_conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE')),
        sa.Column('title', sa.String(255)),
        sa.Column('context', postgresql.JSONB),  # Course context, user profile, etc.
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_tutor_conversations_user', 'tutor_conversations', ['user_id'])
    
    # Messages
    op.create_table(
        'tutor_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('conversation_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('tutor_conversations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),  # 'user' or 'assistant'
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('sources', postgresql.JSONB),  # RAG sources
        sa.Column('tokens_used', sa.Integer),
        sa.Column('model_used', sa.String(50)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    op.create_index('idx_tutor_messages_conversation', 'tutor_messages', ['conversation_id'])
    
    # ========================================
    # ADDITIONAL CORE TABLES
    # ========================================
    
    # Course Modules
    op.create_table(
        'course_modules',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('order', sa.Integer),
        sa.Column('content', postgresql.JSONB),
        sa.Column('duration_minutes', sa.Integer),
        sa.Column('is_published', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()'))
    )
    op.create_index('idx_course_modules_course', 'course_modules', ['course_id'])
    
    # Notifications
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.String(50), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('message', sa.Text),
        sa.Column('data', postgresql.JSONB),
        sa.Column('read', sa.Boolean, default=False),
        sa.Column('read_at', sa.DateTime(timezone=True)),
        sa.Column('action_url', sa.String(500)),
        sa.Column('priority', sa.String(20), default='normal'),  # 'low', 'normal', 'high', 'urgent'
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    op.create_index('idx_notifications_user', 'notifications', ['user_id'])
    op.create_index('idx_notifications_read', 'notifications', ['read'])
    
    print("✅ All Phase 2 database tables created successfully!")


def downgrade():
    """Remove all Phase 2 tables"""
    
    # Drop in reverse order to handle foreign keys
    op.drop_table('notifications')
    op.drop_table('course_modules')
    op.drop_table('tutor_messages')
    op.drop_table('tutor_conversations')
    op.drop_table('files')
    op.drop_table('engagement_data')
    op.drop_table('performance_metrics')
    op.drop_table('analytics_events')
    op.drop_table('mastery_tracking')
    op.drop_table('recommendations')
    op.drop_table('user_progress')
    op.drop_table('learning_paths')
    op.drop_table('grading_results')
    op.drop_table('submissions')
    op.drop_table('assessments')
    op.drop_table('grading_rubrics')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS assessment_type')
    op.execute('DROP TYPE IF EXISTS submission_status')
    
    print("✅ All Phase 2 database tables dropped")
