"""Add resume and resume_versions tables

Revision ID: resume_001
Revises:
Create Date: 2026-04-17

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'resume_001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create resumes table
    # P1.1-followup: id/user_id are UUID in the Resume model (see
    # app/models/resume.py). The migration declared them as String, so
    # the resumes.user_id → users.id (UUID) FK failed with
    # "DatatypeMismatch: foreign key constraint cannot be implemented"
    # on a fresh Postgres. Aligned to UUID to match the model.
    op.create_table(
        'resumes',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('title', sa.String(), server_default='My Resume', nullable=False),
        sa.Column('slug', sa.String(), nullable=False),
        sa.Column('is_public', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('template_id', sa.String(), server_default='meridian', nullable=False),
        sa.Column('data', postgresql.JSON(), nullable=False, server_default='{}'),
        sa.Column('template_config', postgresql.JSON(), nullable=True),
        sa.Column('ats_score', sa.Integer(), nullable=True),
        sa.Column('view_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('last_export_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_resumes_user_id', 'resumes', ['user_id'])
    op.create_index('ix_resumes_slug', 'resumes', ['slug'], unique=True)

    # Create resume_versions table
    op.create_table(
        'resume_versions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('resume_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(), nullable=True),
        sa.Column('data', postgresql.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_resume_versions_resume_id', 'resume_versions', ['resume_id'])


def downgrade() -> None:
    op.drop_table('resume_versions')
    op.drop_table('resumes')
