"""Run-once SQLite-compatibility shims for the api-core integration suite.

The production models declare a stack of Postgres-native column types
(UUID, JSONB, ARRAY, ENUM, TSVECTOR, INET), table-level CHECK
constraints that use the Postgres `~` regex operator, and rely on
Postgres preserving tzinfo on `DateTime(timezone=True)` columns.

The integration tests run against an in-memory aiosqlite engine because
spinning up Postgres for unit-scope tests is expensive and slow. SQLite
has none of those native types, parses `~` as a unary bitwise-NOT, and
silently drops tzinfo on read. Each gap needed a workaround; this
module collects them in one place so future test files just need:

    from tests.integration._sqlite_compat import install_all
    install_all()

before they touch `Base.metadata.create_all()`.

What `install_all()` does (idempotent — safe to call from every test
file's module-level import):

  1. **Column-type compile rules** — `@compiles(PGUUID, "sqlite")`-style
     decorators for each Postgres-native type the models declare.
     Postgres path is untouched; the decorators only fire when the
     active dialect is sqlite.

       UUID      → CHAR(36)
       JSONB     → TEXT
       ARRAY     → TEXT
       ENUM      → VARCHAR
       TSVECTOR  → TEXT
       INET      → VARCHAR

  2. **CHECK-constraint stripping** — walks `Base.metadata.tables` and
     drops any `CheckConstraint` whose `sqltext` contains `~`. SQLite
     parses that as a bitwise-NOT operator and the CREATE TABLE fails
     with a syntax error. The constraints are still emitted to Postgres
     via Alembic-generated DDL — only the in-memory test engine sees
     the metadata mutation.

  3. **DATETIME tzinfo reattachment** — monkey-patches SA 2.0's
     dialect-specific `sqlalchemy.dialects.sqlite.base.DATETIME`
     result_processor to reattach UTC tzinfo when the dialect is
     sqlite. SA 2.0 binds the dialect-specific subclass first, so
     patching the generic `DateTime` class does NOT work (that was
     fix 8; fix 9 narrowed to this subclass and went green).

History — the climb from CI failure to green took 9 commits; this
helper is the consolidated end state. Earlier P3-10 commits documented
each layer separately:

  c30bb8e7  PG UUID compile rule
  374a104e  PG JSONB/ARRAY/ENUM/TSVECTOR/INET compile rules
  f053b528  strip ~ CHECK constraints
  b63671f4  initial DateTime patch (wrong level — generic class)
  e5f24a61  dialect-specific DATETIME patch — green
"""

from __future__ import annotations

from datetime import datetime, timezone

_installed = False


def install_all(base) -> None:
    """Apply every SQLite shim needed for the api-core integration tests.

    Idempotent — safe to call from every test module's import. The
    `base` argument is the declarative `Base` whose `metadata` we walk
    to strip Postgres-only CHECK constraints (callers pass
    `app.core.database.Base`).
    """
    global _installed
    if _installed:
        return

    _install_type_compile_rules()
    _strip_pg_regex_check_constraints(base)
    _patch_sqlite_datetime_result_processor()

    _installed = True


def _install_type_compile_rules() -> None:
    """Register dialect-specific compile rules so SQLite gets a
    renderable type for every Postgres-native column type."""
    from sqlalchemy.dialects.postgresql import (
        ARRAY as PGARRAY,
        ENUM as PGENUM,
        INET as PGINET,
        JSONB as PGJSONB,
        TSVECTOR as PGTSVECTOR,
        UUID as PGUUID,
    )
    from sqlalchemy.ext.compiler import compiles

    @compiles(PGUUID, "sqlite")
    def _compile_uuid_sqlite(element, compiler, **kw):  # noqa: D401
        return "CHAR(36)"

    @compiles(PGJSONB, "sqlite")
    def _compile_jsonb_sqlite(element, compiler, **kw):  # noqa: D401
        return "TEXT"

    @compiles(PGARRAY, "sqlite")
    def _compile_array_sqlite(element, compiler, **kw):  # noqa: D401
        return "TEXT"

    @compiles(PGENUM, "sqlite")
    def _compile_enum_sqlite(element, compiler, **kw):  # noqa: D401
        return "VARCHAR"

    @compiles(PGTSVECTOR, "sqlite")
    def _compile_tsvector_sqlite(element, compiler, **kw):  # noqa: D401
        return "TEXT"

    @compiles(PGINET, "sqlite")
    def _compile_inet_sqlite(element, compiler, **kw):  # noqa: D401
        return "VARCHAR"


def _strip_pg_regex_check_constraints(base) -> None:
    """Walk Base.metadata.tables and remove any CheckConstraint whose
    sqltext uses `~` — SQLite parses that as bitwise-NOT and errors."""
    from sqlalchemy.schema import CheckConstraint

    for table in base.metadata.tables.values():
        bad = [
            c
            for c in list(table.constraints)
            if isinstance(c, CheckConstraint) and "~" in str(c.sqltext)
        ]
        for c in bad:
            table.constraints.discard(c)


def _patch_sqlite_datetime_result_processor() -> None:
    """Reattach UTC tzinfo to datetimes read from SQLite.

    SA 2.0 binds `sqlalchemy.dialects.sqlite.base.DATETIME` as the
    dialect-specific subclass when materialising the engine's type
    cache. Patching the generic `sqlalchemy.DateTime.result_processor`
    does NOT fire on real queries — verified empirically. Patch the
    sqlite-specific class instead.
    """
    from sqlalchemy.dialects.sqlite.base import DATETIME as SQLiteDATETIME

    if getattr(SQLiteDATETIME, "_eureka_tz_patched", False):
        return

    original = SQLiteDATETIME.result_processor

    def _patched(self, dialect, coltype):
        base = original(self, dialect, coltype)

        def _wrap(value):
            v = base(value) if base else value
            if isinstance(v, datetime) and v.tzinfo is None:
                return v.replace(tzinfo=timezone.utc)
            return v

        return _wrap

    SQLiteDATETIME.result_processor = _patched
    SQLiteDATETIME._eureka_tz_patched = True  # type: ignore[attr-defined]
