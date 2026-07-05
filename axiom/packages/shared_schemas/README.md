# axiom-shared-schemas

Shared Pydantic v2 schemas for AXIOM services. These are the single source of
truth for API wire shapes. The FastAPI gateway, the Celery workers, and the
frontend TypeScript types all mirror these models.

## Contents

- `identity.py` - Principal, UserRef, UserOut, RoleName, ModuleInfo,
  DashboardSummary, HealthOut.

## Install (editable, for local development)

    pip install -e packages/shared_schemas

## Conventions

- Pydantic v2 only. `ConfigDict(from_attributes=True)` on models that map from
  ORM rows.
- ASCII punctuation only in all copy and docstrings.
