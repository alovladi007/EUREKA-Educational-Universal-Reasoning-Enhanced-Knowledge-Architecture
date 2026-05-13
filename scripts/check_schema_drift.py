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

Doesn't fail the build by default (the CI workflow sets
continue-on-error). Once the known drift is cleaned up we'll flip that
flag and make this gate the build.

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


def load_metadata(service_path: Path, module_name: str):
    """Add the service dir to sys.path and import its models module."""
    sys.path.insert(0, str(service_path))
    try:
        # Try `app.utils.database.Base` (assess) or `app.core.database.Base`
        # (analytics/api-core). We just import the models module — its
        # `Base` registers the tables.
        importlib.import_module(module_name)
        # Find every loaded Base by introspecting SQLAlchemy's class registry.
        from sqlalchemy.orm import DeclarativeBase  # noqa: F401
        # Easier: walk every module we've imported and harvest its tables.
        return _harvest_tables()
    finally:
        sys.path.pop(0)


def _harvest_tables() -> list[tuple[str, set[str]]]:
    """Find every Table currently registered in any imported MetaData."""
    seen: dict[str, set[str]] = {}
    for mod_name, mod in list(sys.modules.items()):
        if mod is None:
            continue
        for attr_name in dir(mod):
            try:
                attr = getattr(mod, attr_name)
            except Exception:
                continue
            md = getattr(attr, "metadata", None)
            if md is None:
                continue
            for table in getattr(md, "tables", {}).values():
                if table.name in seen:
                    continue
                seen[table.name] = {c.name for c in table.columns}
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
        db_cols = columns_in_db(table_name)
        if not db_cols:
            # Table not in DB at all — skip silently. Many ORM-declared
            # tables don't have a seed yet (Phase 5 will add them).
            continue
        missing_in_db = orm_cols - db_cols
        extra_in_db = db_cols - orm_cols
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
