#!/usr/bin/env python3
"""
Schema drift check.

For each Python service that uses SQLAlchemy, walk the ORM tables and
compare them to the actual columns in a Postgres instance that has been
seeded by `eureka/ops/db/*.sql`. Reports missing columns / extra columns
per table.

Why: in 2026-05 the `users` table in init SQL was missing 6 columns the
ORM declared (ban_reason, date_of_birth, parent_email,
parental_consent_*, deleted_at). This kind of drift only shows up when
someone tries to log in. CI should catch it.

GATES the build (exit 1 on drift) since 2026-07, when the known drift was
converged: api-core's dormant models (assignments, submissions, grades,
refresh_tokens, audit_logs, file_uploads) were rewritten to mirror the init
SQL, DB-only columns were added to the live models, and the two sanctioned
exceptions below (ALLOWED_DRIFT, SELF_CONVERGING_TABLES) were documented.

Usage:
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eureka_test \\
    python scripts/check_schema_drift.py
"""

from __future__ import annotations

import os
import sys
import importlib.util
from pathlib import Path
from typing import Iterable

import psycopg2
from psycopg2.extras import RealDictCursor


REPO_ROOT = Path(__file__).resolve().parent.parent

# Services that have a `app/models.py` or similar declarative table layer.
# Path is relative to REPO_ROOT; module is the dotted path to the ORM Base.
SERVICES = [
    ("api-core",  "eureka/services/api-core",  "app.models"),
    ("assess",    "eureka/services/assess",    "app.models"),
    ("analytics", "eureka/services/analytics", "app.core.models"),
    # Add more as services grow real ORM layers.
]

# (table, column) pairs where ORM and SQL differ ON PURPOSE. Keep this list
# tiny and documented — it is the only sanctioned escape hatch.
ALLOWED_DRIFT: set[tuple[str, str]] = {
    # pgvector columns are managed in raw SQL; the ORM deliberately omits
    # them so the model layer doesn't depend on a Python pgvector binding
    # (see app/models/item_bank.py and app/models/agent.py in api-core).
    ("item_embeddings", "embedding"),
    ("knowledge_chunks", "embedding"),
}

# Tables whose owning service converges the live schema itself at startup
# (analytics: _converge_schema() in services/analytics/main.py runs
# create_all + ADD COLUMN IF NOT EXISTS + relaxes legacy NOT NULLs before
# serving). The init SQL keeps the legacy shape; the service upgrades it to
# the ORM's superset on boot, so an ORM-vs-init-SQL diff here is expected
# and harmless. The missing-column class of bug this check exists to catch
# cannot occur for these tables.
SELF_CONVERGING_TABLES: set[str] = {
    "student_analytics",
    "course_analytics",
    "learning_outcomes",
    "student_outcome_achievements",
    "at_risk_alerts",
    "engagement_events",
    "performance_trends",
    "cohort_analytics",
}


def db_url() -> str:
    url = os.environ.get("DATABASE_URL")
    if not url:
        sys.exit("DATABASE_URL not set")
    # Normalise async URLs to sync for psycopg2.
    return url.replace("+asyncpg", "").replace("postgresql+psycopg2", "postgresql")


def columns_in_db(table: str) -> set[str]:
    conn = psycopg2.connect(db_url())
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = %s
                """,
                (table,),
            )
            return {row["column_name"] for row in cur.fetchall()}
    finally:
        conn.close()


def _purge_service_modules() -> None:
    """Drop any previously imported service package from sys.modules.

    Every service names its package `app`, so without this purge the second
    and third services silently re-import the FIRST service's cached
    modules: assess and analytics were never actually checked, and
    api-core's tables were re-reported under their names.
    """
    for mod_name in list(sys.modules):
        if mod_name == "app" or mod_name.startswith("app."):
            del sys.modules[mod_name]


def load_metadata(service_path: Path, module_name: str):
    """Add the service dir to sys.path and import its models module."""
    _purge_service_modules()
    sys.path.insert(0, str(service_path))
    try:
        # We just import the models module — its `Base` registers the tables.
        importlib.import_module(module_name)
        # Walk every imported module and harvest its tables. The purge above
        # guarantees only THIS service's `app.*` modules are loaded, so the
        # harvest can't pick up a previous service's tables.
        return _harvest_tables()
    finally:
        sys.path.pop(0)


def _harvest_tables() -> list[tuple[str, set[str]]]:
    """Find every Table currently registered in any imported MetaData."""
    seen: dict[str, set[str]] = {}
    for mod_name, mod in list(sys.modules.items()):
        if mod is None:
            continue
        # Every getattr can fail with non-standard exceptions when Pydantic v2
        # ModelMetaclass / Annotated descriptors are introspected — wrap each
        # access. Previously only the first getattr was guarded; the second +
        # third weren't, and a Pydantic-managed `metadata` field on some
        # imported class raised "Operator 'getitem' is not supported on this
        # expression" which short-circuited the whole drift check.
        for attr_name in dir(mod):
            try:
                attr = getattr(mod, attr_name)
            except Exception:
                continue
            try:
                md = getattr(attr, "metadata", None)
            except Exception:
                continue
            if md is None:
                continue
            try:
                tables_dict = getattr(md, "tables", {})
                table_iter = list(tables_dict.values()) if hasattr(tables_dict, "values") else []
            except Exception:
                continue
            for table in table_iter:
                try:
                    tname = table.name
                except Exception:
                    continue
                if tname in seen:
                    continue
                try:
                    seen[tname] = {c.name for c in table.columns}
                except Exception:
                    continue
    return list(seen.items())


def check_service(name: str, path_str: str, module: str) -> Iterable[str]:
    path = REPO_ROOT / path_str
    if not path.exists():
        yield f"  ✗ {name}: path {path_str} does not exist"
        return

    try:
        tables = load_metadata(path, module)
    except Exception as exc:
        yield f"  ✗ {name}: failed to import {module}: {exc}"
        return

    if not tables:
        yield f"  · {name}: no tables found"
        return

    drift = False
    for table_name, orm_cols in tables:
        if table_name in SELF_CONVERGING_TABLES:
            continue
        db_cols = columns_in_db(table_name)
        if not db_cols:
            # Table not in DB at all — skip silently. Many ORM-declared
            # tables don't have a seed yet (Phase 5 will add them).
            continue
        missing_in_db = {c for c in orm_cols - db_cols if (table_name, c) not in ALLOWED_DRIFT}
        extra_in_db = {c for c in db_cols - orm_cols if (table_name, c) not in ALLOWED_DRIFT}
        if missing_in_db or extra_in_db:
            drift = True
            yield f"  ✗ {name}/{table_name}:"
            if missing_in_db:
                yield f"      missing in DB:   {sorted(missing_in_db)}"
            if extra_in_db:
                yield f"      extra in DB:    {sorted(extra_in_db)}"

    if not drift:
        yield f"  ✓ {name}: no drift"


def main() -> int:
    print("Schema drift check\n" + "-" * 40)
    any_drift = False
    for name, path, module in SERVICES:
        print(f"\n{name}:")
        for line in check_service(name, path, module):
            print(line)
            if line.startswith("  ✗"):
                any_drift = True
    print("\n" + ("DRIFT DETECTED" if any_drift else "OK — no drift"))
    return 1 if any_drift else 0


if __name__ == "__main__":
    sys.exit(main())
