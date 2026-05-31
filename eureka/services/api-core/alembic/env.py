from logging.config import fileConfig
from sqlalchemy import pool, create_engine
from sqlalchemy.engine import Connection

from alembic import context

# Import the base and all models
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.config import settings
from app.core.database import Base

# P1.1: import the models PACKAGE (not a hand-picked subset). Importing
# app.models runs its __init__, which imports every model module and
# therefore registers all ~118 tables on Base.metadata — so
# `--autogenerate` and `upgrade head` see the COMPLETE schema, not just
# the original 11 tables this file used to import.
import app.models  # noqa: F401


def _sync_db_url() -> str:
    """P1.1: Alembic runs migrations synchronously, so coerce the app's
    DATABASE_URL to a SYNC driver (psycopg2). The previous env.py fed the
    URL straight into create_async_engine, which crashed every alembic
    command with 'The asyncio extension requires an async driver' — the
    reason migrations were never actually runnable. We strip the
    `+asyncpg` (or bare `postgresql://`, which psycopg2 handles) here.
    """
    url = str(settings.DATABASE_URL)
    if url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url


# this is the Alembic Config object
config = context.config

# Override sqlalchemy.url with the sync-coerced URL
config.set_main_option('sqlalchemy.url', _sync_db_url())

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata for 'autogenerate' support
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode with a SYNC engine (P1.1).

    Migrations are inherently synchronous; using a plain sync engine
    (psycopg2 via the coerced URL) is the conventional, robust setup and
    avoids the asyncio-driver crash the old async env produced.
    """
    connectable = create_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        do_run_migrations(connection)

    connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
