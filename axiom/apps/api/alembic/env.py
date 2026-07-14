"""Alembic environment.

Runs migrations against AXIOM_DATABASE_URL. For autogenerate and offline SQL we
use a synchronous psycopg-style URL derived from the async URL; for online runs
we use the async engine. Target metadata is the shared Base with all models
imported so autogenerate sees every table.
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

# Import model modules so their tables register on Base.metadata.
from app.domains.accommodations import models as _accommodations_models  # noqa: F401
from app.domains.adaptive import models as _adaptive_models  # noqa: F401
from app.domains.entitlements import models as _entitlements_models  # noqa: F401
from app.domains.analytics import models as _analytics_models  # noqa: F401
from app.domains.assessment import models as _assessment_models  # noqa: F401
from app.domains.attempts import models as _attempts_models  # noqa: F401
from app.domains.compliance import models as _compliance_models  # noqa: F401
from app.domains.content import models as _content_models  # noqa: F401
from app.domains.copilot import models as _copilot_models  # noqa: F401
from app.domains.curriculum import models as _curriculum_models  # noqa: F401
from app.domains.gamification import models as _gamification_models  # noqa: F401
from app.domains.identity import models as _identity_models  # noqa: F401
from app.domains.integrations import models as _integrations_models  # noqa: F401
from app.domains.notifications import models as _notifications_models  # noqa: F401
from app.domains.proctoring import models as _proctoring_models  # noqa: F401
from app.domains.tutoring import models as _tutoring_models  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Tables managed by raw SQL in migrations rather than by an ORM model (their
# column types have no SQLite equivalent, so they cannot live in Base.metadata
# without breaking the SQLite test schema). Autogenerate must ignore them, or it
# would propose dropping them and report false schema drift.
_RAW_SQL_TABLES = frozenset({"content_embeddings"})


def _include_object(obj, name, type_, reflected, compare_to):
    if type_ == "table" and name in _RAW_SQL_TABLES:
        return False
    return True


def _db_url() -> str:
    return get_settings().database_url


def run_migrations_offline() -> None:
    context.configure(
        url=_db_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        include_object=_include_object,
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        include_object=_include_object,
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
