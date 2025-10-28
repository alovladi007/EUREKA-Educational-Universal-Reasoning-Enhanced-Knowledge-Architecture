"""
Database configuration for High School Tier
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

# Database URL - should match api-core database
DATABASE_URL = "postgresql+asyncpg://eureka:eurekapass@localhost:5432/eureka"

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL logging
    future=True,
    pool_pre_ping=True,
)

# Create async session maker
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_tables():
    """
    Create database tables
    
    Note: In production, use Alembic migrations instead
    """
    from app.core.models import Base
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
