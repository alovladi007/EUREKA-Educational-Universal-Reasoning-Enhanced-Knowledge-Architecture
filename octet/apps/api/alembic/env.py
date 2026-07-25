"""Alembic environment.

Runs migrations against OCTET_DATABASE_URL. Online runs use the async engine
that app.core.db already configures the URL for; offline SQL generation uses the
same URL literally. Target metadata is the shared Base with every model module
imported, so autogenerate sees the whole schema and reports real drift rather
than the absence of an import.
"""

from __future__ import annotations

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
from app.core.config import get_settings
from app.core.db import Base

# Import model modules so their tables register on Base.metadata. A domain
# without a models module is deliberately absent rather than imported blindly.
from app.domains.chemistry import models as _chemistry_models  # noqa: F401
from app.domains.exams import models as _exams_models  # noqa: F401
from app.domains.integrations import models as _integrations_models  # noqa: F401
from app.domains.practice import models as _practice_models  # noqa: F401
from app.domains.srs import models as _srs_models  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _db_url() -> str:
    return get_settings().database_url


def run_migrations_offline() -> None:
    context.configure(
        url=_db_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = _db_url()
    connectable = async_engine_from_config(
        configuration, prefix="sqlalchemy.", poolclass=pool.NullPool
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
