"""
Analytics Dashboard Service - Database Configuration
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import get_settings

settings = get_settings()


def _async_db_url(url: str) -> str:
    """P2: coerce the DB URL to an async driver.

    The config default is postgresql+asyncpg://, but docker-compose
    overrides DATABASE_URL with the sync postgresql:// form (shared
    across all services). Feeding that to create_async_engine crashes
    with 'The asyncio extension requires an async driver to be used'.
    Rewriting bare postgresql:// → postgresql+asyncpg:// here makes the
    service robust to either form (mirrors api-core's database.py).
    """
    if url.startswith("postgresql+asyncpg://"):
        return url
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url


# Create async engine (URL coerced to an async driver)
engine = create_async_engine(
    _async_db_url(str(settings.DATABASE_URL)),
    echo=True,
    future=True,
    pool_pre_ping=True,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db():
    """Dependency for getting database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
