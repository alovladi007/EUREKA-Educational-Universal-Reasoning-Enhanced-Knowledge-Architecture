-- ============================================================================
-- P0.2 — Create the secondary logical databases.
--
-- docker-compose wires four services at non-default databases on the same
-- Postgres container, but nothing ever created them, so on a fresh stack
-- test-prep / pedagogy / marketplace / institutions crashed or degraded on
-- connect ("database ... does not exist"). This script runs FIRST in the
-- /docker-entrypoint-initdb.d ordering ("00_create_databases" sorts before
-- "00_init_complete" — 'c' < 'i') so the databases exist before any of the
-- table-creating scripts run against the primary `eureka` database.
--
-- Notes:
--   * initdb only runs these on an EMPTY data volume (first boot). To apply
--     to an already-initialized volume, run manually:
--       docker compose exec -T db psql -U eureka -d eureka -f \
--         /docker-entrypoint-initdb.d/00_create_databases.sql
--   * CREATE DATABASE cannot run inside a transaction or a DO block, so we
--     use the psql `\gexec` idempotency pattern: build the CREATE statement
--     only when the database is absent, then execute it. This makes the
--     script safe to re-run.
--   * Owner is `eureka` (the POSTGRES_USER / superuser in the pgvector image),
--     matching the primary database so every service connects with one role.
-- ============================================================================

SELECT 'CREATE DATABASE eureka_test_prep OWNER eureka'
 WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eureka_test_prep')\gexec

SELECT 'CREATE DATABASE eureka_pedagogy OWNER eureka'
 WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eureka_pedagogy')\gexec

SELECT 'CREATE DATABASE eureka_marketplace OWNER eureka'
 WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eureka_marketplace')\gexec

SELECT 'CREATE DATABASE eureka_institutions OWNER eureka'
 WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eureka_institutions')\gexec
