# Database migrations

The Alembic migration environment lives with the API service at
`apps/api/alembic` (env.py, versions/). This directory is a pointer so the
repository layout in the build spec is honored.

Run migrations from `apps/api`:

    export AXIOM_DATABASE_URL=postgresql+asyncpg://axiom:axiom@localhost:5440/axiom
    alembic upgrade head
    alembic downgrade base
