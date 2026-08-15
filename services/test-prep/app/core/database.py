"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# This service's engine is SYNCHRONOUS. Environments that hand every service
# the same async-style URL (CI's matrix exports postgresql+asyncpg://) would
# make create_engine import the asyncpg driver this service neither ships nor
# needs — coerce to the sync psycopg2 dialect, exactly as api-core's alembic
# env.py does for its sync migration run. A plain postgresql:// URL is
# untouched.
_db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

# Configure engine based on database type
if _db_url.startswith("sqlite"):
    # SQLite specific configuration
    engine = create_engine(
        _db_url,
        connect_args={"check_same_thread": False},
        echo=settings.DEBUG
    )
else:
    # PostgreSQL/other databases configuration
    engine = create_engine(
        _db_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        echo=settings.DEBUG
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db():
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
