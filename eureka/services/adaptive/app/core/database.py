"""
Adaptive Learning Service - Database Configuration
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import get_settings

settings = get_settings()


def _async_dsn(url: str) -> str:
    """Coerce a Postgres DSN to the asyncpg driver.

    This service is async throughout, but docker-compose hands every Python
    service the SAME `DATABASE_URL`, and that value is the SYNC psycopg2 form
    (`postgresql://...`). Passing it to create_async_engine raises at import
    time:

        sqlalchemy.exc.InvalidRequestError: The asyncio extension requires an
        async driver to be used. The loaded 'psycopg2' is not async.

    which killed the container before uvicorn ever bound a port — the service
    reported "running" while serving nothing. The settings default was already
    the correct `postgresql+asyncpg://` form; only the compose override was
    wrong. Normalising here fixes the service for EITHER form rather than
    depending on every caller to pass the right one. asyncpg is already a
    declared dependency (requirements.txt).
    """
    if url.startswith("postgresql+"):  # already carries an explicit driver
        return url
    if url.startswith("postgresql://"):
        return "postgresql+asyncpg://" + url[len("postgresql://"):]
    if url.startswith("postgres://"):  # legacy scheme some providers emit
        return "postgresql+asyncpg://" + url[len("postgres://"):]
    return url


# Create async engine
engine = create_async_engine(
    _async_dsn(settings.DATABASE_URL),
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
