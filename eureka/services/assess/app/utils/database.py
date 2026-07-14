"""
Database connection and session management
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool

# Database URL from environment
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://eduflow_user:eduflow_password@localhost:5433/eduflow_assessment"
)


def _async_db_url(url: str) -> str:
    """Coerce the DB URL to an async driver: docker-compose supplies the sync
    postgresql:// form (shared across services), which would make
    create_async_engine load psycopg2 and crash (mirrors analytics/api-core)."""
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url


# Create async engine
engine = create_async_engine(
    _async_db_url(DATABASE_URL),
    poolclass=NullPool,
    echo=True,  # Set to False in production
)

# Create session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base class for models
Base = declarative_base()

async def init_db():
    """Initialize database connection"""
    async with engine.begin() as conn:
        # Create tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        # create_all never alters existing tables, and this service has no
        # alembic — add the P2-8 tenancy column plus the contract-repair
        # columns (route/grader/schema always expected them) idempotently.
        from sqlalchemy import text
        for ddl in (
            "ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS org_id UUID",
            "ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS attempt_number INTEGER NOT NULL DEFAULT 1",
            "ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS is_late BOOLEAN NOT NULL DEFAULT FALSE",
            "ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER",
            "ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS max_score NUMERIC(10,2)",
            "ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2)",
            "CREATE INDEX IF NOT EXISTS ix_assessment_attempts_org_id ON assessment_attempts (org_id)",
            "ALTER TABLE question_responses ADD COLUMN IF NOT EXISTS response_text TEXT",
            "ALTER TABLE question_responses ADD COLUMN IF NOT EXISTS points_earned NUMERIC(10,2)",
            "ALTER TABLE question_responses ADD COLUMN IF NOT EXISTS points_possible NUMERIC(10,2)",
        ):
            await conn.execute(text(ddl))

async def close_db():
    """Close database connection"""
    await engine.dispose()

async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
