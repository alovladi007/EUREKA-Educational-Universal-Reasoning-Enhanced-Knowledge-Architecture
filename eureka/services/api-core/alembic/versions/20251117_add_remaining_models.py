"""Add remaining models: Assignment, Submission, Grade, RefreshToken, AuditLog, FileUpload, Notification

Revision ID: 002_remaining_models
Revises: 001_initial
Create Date: 2025-11-17 06:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_remaining_models'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create assignments table
    op.create_table(
        'assignments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('instructions', sa.Text(), nullable=True),
        sa.Column('assignment_type', sa.String(length=50), nullable=False),
        sa.Column('max_points', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('weight', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('settings', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('rubric', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('available_from', sa.DateTime(), nullable=True),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('late_submission_allowed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('late_penalty_percent', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_attempts', sa.Integer(), nullable=True),
        sa.Column('time_limit_minutes', sa.Integer(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_graded', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, onupdate=sa.func.now()),
        sa.CheckConstraint("assignment_type IN ('homework', 'quiz', 'exam', 'project', 'lab', 'essay', 'discussion', 'presentation')", name='ck_assignments_type'),
        sa.CheckConstraint('max_points > 0', name='ck_assignments_max_points_positive'),
        sa.CheckConstraint('weight > 0', name='ck_assignments_weight_positive'),
        sa.CheckConstraint('late_penalty_percent >= 0 AND late_penalty_percent <= 100', name='ck_assignments_penalty_valid'),
        sa.CheckConstraint('max_attempts IS NULL OR max_attempts > 0', name='ck_assignments_attempts_positive'),
        sa.CheckConstraint('time_limit_minutes IS NULL OR time_limit_minutes > 0', name='ck_assignments_time_limit_positive'),
        sa.CheckConstraint('due_date IS NULL OR available_from IS NULL OR due_date >= available_from', name='ck_assignments_dates_valid'),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_assignments_course_id', 'assignments', ['course_id'])
    op.create_index('ix_assignments_created_at', 'assignments', ['created_at'])
    op.create_index('ix_assignments_assignment_type', 'assignments', ['assignment_type'])
    op.create_index('ix_assignments_is_published', 'assignments', ['is_published'])
    op.create_index('ix_assignments_due_date', 'assignments', ['due_date'])
    op.create_index('ix_assignments_course_published', 'assignments', ['course_id', 'is_published'])
    op.create_index('ix_assignments_course_type', 'assignments', ['course_id', 'assignment_type'])

    # Create submissions table
    op.create_table(
        'submissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assignment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('graded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('attachments', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('attempt_number', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('submitted_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='submitted'),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('max_score', sa.Float(), nullable=True),
        sa.Column('grade_percentage', sa.Float(), nullable=True),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('rubric_scores', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('graded_at', sa.DateTime(), nullable=True),
        sa.Column('is_late', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('late_penalty_applied', sa.Float(), nullable=True),
        sa.Column('ai_graded', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('ai_confidence_score', sa.Float(), nullable=True),
        sa.Column('requires_manual_review', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('plagiarism_score', sa.Float(), nullable=True),
        sa.Column('plagiarism_report', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, onupdate=sa.func.now()),
        sa.CheckConstraint("status IN ('draft', 'submitted', 'grading', 'graded', 'returned', 'resubmit_requested')", name='ck_submissions_status'),
        sa.CheckConstraint('attempt_number > 0', name='ck_submissions_attempt_positive'),
        sa.CheckConstraint('score IS NULL OR score >= 0', name='ck_submissions_score_positive'),
        sa.CheckConstraint('max_score IS NULL OR max_score > 0', name='ck_submissions_max_score_positive'),
        sa.CheckConstraint('grade_percentage IS NULL OR (grade_percentage >= 0 AND grade_percentage <= 100)', name='ck_submissions_percentage_valid'),
        sa.CheckConstraint('late_penalty_applied IS NULL OR (late_penalty_applied >= 0 AND late_penalty_applied <= 100)', name='ck_submissions_penalty_valid'),
        sa.CheckConstraint('ai_confidence_score IS NULL OR (ai_confidence_score >= 0 AND ai_confidence_score <= 1)', name='ck_submissions_ai_confidence_valid'),
        sa.CheckConstraint('plagiarism_score IS NULL OR (plagiarism_score >= 0 AND plagiarism_score <= 100)', name='ck_submissions_plagiarism_valid'),
        sa.CheckConstraint('graded_at IS NULL OR graded_at >= submitted_at', name='ck_submissions_graded_after_submitted'),
        sa.ForeignKeyConstraint(['assignment_id'], ['assignments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['graded_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_submissions_assignment_id', 'submissions', ['assignment_id'])
    op.create_index('ix_submissions_user_id', 'submissions', ['user_id'])
    op.create_index('ix_submissions_status', 'submissions', ['status'])
    op.create_index('ix_submissions_submitted_at', 'submissions', ['submitted_at'])
    op.create_index('ix_submissions_graded_at', 'submissions', ['graded_at'])
    op.create_index('ix_submissions_user_assignment', 'submissions', ['user_id', 'assignment_id'])
    op.create_index('ix_submissions_assignment_status', 'submissions', ['assignment_id', 'status'])
    op.create_index('ix_submissions_user_status', 'submissions', ['user_id', 'status'])
    op.create_index('ix_submissions_requires_review', 'submissions', ['requires_manual_review', 'status'])

    # Create grades table
    op.create_table(
        'grades',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('enrollment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('graded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('letter_grade', sa.String(length=5), nullable=True),
        sa.Column('numeric_grade', sa.Float(), nullable=True),
        sa.Column('points_earned', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('points_possible', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('percentage', sa.Float(), nullable=True),
        sa.Column('breakdown', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('assignment_grades', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='in_progress'),
        sa.Column('is_final', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('comments', sa.Text(), nullable=True),
        sa.Column('calculated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('finalized_at', sa.DateTime(), nullable=True),
        sa.Column('posted_at', sa.DateTime(), nullable=True),
        sa.CheckConstraint("status IN ('in_progress', 'complete', 'posted', 'withdrawn')", name='ck_grades_status'),
        sa.CheckConstraint('numeric_grade IS NULL OR numeric_grade >= 0', name='ck_grades_numeric_positive'),
        sa.CheckConstraint('points_earned >= 0', name='ck_grades_points_earned_positive'),
        sa.CheckConstraint('points_possible > 0', name='ck_grades_points_possible_positive'),
        sa.CheckConstraint('percentage IS NULL OR (percentage >= 0 AND percentage <= 100)', name='ck_grades_percentage_valid'),
        sa.CheckConstraint('finalized_at IS NULL OR finalized_at >= calculated_at', name='ck_grades_finalized_after_calculated'),
        sa.CheckConstraint('posted_at IS NULL OR posted_at >= calculated_at', name='ck_grades_posted_after_calculated'),
        sa.ForeignKeyConstraint(['enrollment_id'], ['enrollments.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['graded_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('enrollment_id', name='uq_grades_enrollment')
    )
    op.create_index('ix_grades_enrollment_id', 'grades', ['enrollment_id'])
    op.create_index('ix_grades_course_id', 'grades', ['course_id'])
    op.create_index('ix_grades_user_id', 'grades', ['user_id'])
    op.create_index('ix_grades_status', 'grades', ['status'])
    op.create_index('ix_grades_calculated_at', 'grades', ['calculated_at'])
    op.create_index('ix_grades_finalized_at', 'grades', ['finalized_at'])
    op.create_index('ix_grades_user_course', 'grades', ['user_id', 'course_id'])
    op.create_index('ix_grades_course_status', 'grades', ['course_id', 'status'])
    op.create_index('ix_grades_user_final', 'grades', ['user_id', 'is_final'])

    # Create refresh_tokens table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('token', sa.String(length=500), nullable=False),
        sa.Column('device_info', sa.String(length=255), nullable=True),
        sa.Column('ip_address', sa.String(length=50), nullable=True),
        sa.Column('is_revoked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_used', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('revoked_at', sa.DateTime(), nullable=True),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token', name='uq_refresh_tokens_token')
    )
    op.create_index('ix_refresh_tokens_user_id', 'refresh_tokens', ['user_id'])
    op.create_index('ix_refresh_tokens_token', 'refresh_tokens', ['token'], unique=True)
    op.create_index('ix_refresh_tokens_is_revoked', 'refresh_tokens', ['is_revoked'])
    op.create_index('ix_refresh_tokens_created_at', 'refresh_tokens', ['created_at'])
    op.create_index('ix_refresh_tokens_expires_at', 'refresh_tokens', ['expires_at'])
    op.create_index('ix_refresh_tokens_user_active', 'refresh_tokens', ['user_id', 'is_revoked', 'expires_at'])

    # Create audit_logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=False),
        sa.Column('resource_type', sa.String(length=100), nullable=False),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('changes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('ip_address', postgresql.INET(), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.Column('request_method', sa.String(length=10), nullable=True),
        sa.Column('request_path', sa.String(length=500), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='success'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_audit_logs_user_id', 'audit_logs', ['user_id'])
    op.create_index('ix_audit_logs_org_id', 'audit_logs', ['org_id'])
    op.create_index('ix_audit_logs_action', 'audit_logs', ['action'])
    op.create_index('ix_audit_logs_resource_type', 'audit_logs', ['resource_type'])
    op.create_index('ix_audit_logs_resource_id', 'audit_logs', ['resource_id'])
    op.create_index('ix_audit_logs_status', 'audit_logs', ['status'])
    op.create_index('ix_audit_logs_ip_address', 'audit_logs', ['ip_address'])
    op.create_index('ix_audit_logs_created_at', 'audit_logs', ['created_at'])
    op.create_index('ix_audit_logs_user_action', 'audit_logs', ['user_id', 'action', 'created_at'])
    op.create_index('ix_audit_logs_org_action', 'audit_logs', ['org_id', 'action', 'created_at'])
    op.create_index('ix_audit_logs_resource', 'audit_logs', ['resource_type', 'resource_id', 'created_at'])
    op.create_index('ix_audit_logs_action_status', 'audit_logs', ['action', 'status', 'created_at'])
    op.create_index('ix_audit_logs_ip_created', 'audit_logs', ['ip_address', 'created_at'])

    # Create file_uploads table
    op.create_table(
        'file_uploads',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('uploaded_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('file_path', sa.String(length=1000), nullable=False),
        sa.Column('file_size_bytes', sa.BigInteger(), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.Column('file_hash', sa.String(length=64), nullable=True),
        sa.Column('bucket_name', sa.String(length=255), nullable=False),
        sa.Column('object_key', sa.String(length=1000), nullable=False),
        sa.Column('storage_class', sa.String(length=50), nullable=False, server_default='STANDARD'),
        sa.Column('reference_type', sa.String(length=100), nullable=True),
        sa.Column('reference_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('virus_scanned', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('virus_scan_result', sa.String(length=50), nullable=True),
        sa.Column('virus_scan_details', sa.String(), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('access_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('last_accessed_at', sa.DateTime(), nullable=True),
        sa.CheckConstraint('file_size_bytes > 0', name='ck_file_uploads_size_positive'),
        sa.CheckConstraint("virus_scan_result IS NULL OR virus_scan_result IN ('clean', 'infected', 'error')", name='ck_file_uploads_scan_result'),
        sa.CheckConstraint("storage_class IN ('STANDARD', 'REDUCED_REDUNDANCY', 'GLACIER', 'DEEP_ARCHIVE')", name='ck_file_uploads_storage_class'),
        sa.CheckConstraint('access_count >= 0', name='ck_file_uploads_access_count_positive'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_file_uploads_org_id', 'file_uploads', ['org_id'])
    op.create_index('ix_file_uploads_uploaded_by', 'file_uploads', ['uploaded_by'])
    op.create_index('ix_file_uploads_mime_type', 'file_uploads', ['mime_type'])
    op.create_index('ix_file_uploads_reference_type', 'file_uploads', ['reference_type'])
    op.create_index('ix_file_uploads_reference_id', 'file_uploads', ['reference_id'])
    op.create_index('ix_file_uploads_is_public', 'file_uploads', ['is_public'])
    op.create_index('ix_file_uploads_is_deleted', 'file_uploads', ['is_deleted'])
    op.create_index('ix_file_uploads_created_at', 'file_uploads', ['created_at'])
    op.create_index('ix_file_uploads_org_type', 'file_uploads', ['org_id', 'reference_type'])
    op.create_index('ix_file_uploads_reference', 'file_uploads', ['reference_type', 'reference_id'])
    op.create_index('ix_file_uploads_uploader_created', 'file_uploads', ['uploaded_by', 'created_at'])
    op.create_index('ix_file_uploads_hash', 'file_uploads', ['file_hash'])
    op.create_index('ix_file_uploads_virus_scanned', 'file_uploads', ['virus_scanned', 'virus_scan_result'])

    # Create notifications table
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('org_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('priority', sa.String(length=20), nullable=False, server_default='normal'),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('action_text', sa.String(length=100), nullable=True),
        sa.Column('action_url', sa.String(length=500), nullable=True),
        sa.Column('reference_type', sa.String(length=100), nullable=True),
        sa.Column('reference_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_sent', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('sent_via_email', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('sent_via_push', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('sent_via_sms', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.CheckConstraint("type IN ('assignment', 'grade', 'message', 'announcement', 'reminder', 'system', 'achievement', 'deadline')", name='ck_notifications_type'),
        sa.CheckConstraint("priority IN ('low', 'normal', 'high', 'urgent')", name='ck_notifications_priority'),
        sa.CheckConstraint('read_at IS NULL OR read_at >= created_at', name='ck_notifications_read_after_created'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['org_id'], ['organizations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])
    op.create_index('ix_notifications_org_id', 'notifications', ['org_id'])
    op.create_index('ix_notifications_type', 'notifications', ['type'])
    op.create_index('ix_notifications_priority', 'notifications', ['priority'])
    op.create_index('ix_notifications_reference_type', 'notifications', ['reference_type'])
    op.create_index('ix_notifications_reference_id', 'notifications', ['reference_id'])
    op.create_index('ix_notifications_is_read', 'notifications', ['is_read'])
    op.create_index('ix_notifications_is_deleted', 'notifications', ['is_deleted'])
    op.create_index('ix_notifications_created_at', 'notifications', ['created_at'])
    op.create_index('ix_notifications_read_at', 'notifications', ['read_at'])
    op.create_index('ix_notifications_user_unread', 'notifications', ['user_id', 'is_read', 'created_at'])
    op.create_index('ix_notifications_user_type', 'notifications', ['user_id', 'type', 'created_at'])
    op.create_index('ix_notifications_user_priority', 'notifications', ['user_id', 'priority', 'created_at'])
    op.create_index('ix_notifications_reference', 'notifications', ['reference_type', 'reference_id'])
    op.create_index('ix_notifications_unsent', 'notifications', ['is_sent', 'created_at'])


def downgrade() -> None:
    # Drop tables in reverse order (respecting foreign key constraints)
    op.drop_table('notifications')
    op.drop_table('file_uploads')
    op.drop_table('audit_logs')
    op.drop_table('refresh_tokens')
    op.drop_table('grades')
    op.drop_table('submissions')
    op.drop_table('assignments')
