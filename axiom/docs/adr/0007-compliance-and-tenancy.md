# ADR 0007: Compliance and tenancy posture

Status: accepted

## Context

AXIOM handles data about minors in an education setting, so Build prompt Section
13 requires a FERPA/COPPA posture: data minimization, per-tenant isolation,
configurable retention, parental consent, a unified audit trail, and RBAC with
least privilege. The base platform had RBAC and per-domain evidence trails, but
no unified audit log, no retention enforcement, no consent model, and tenant_id
was modeled but not enforced.

## Decision

We add a `compliance` domain and a tenancy seam:

- **Unified audit trail** (`audit_log`). Every security-relevant action writes
  one row: actor, action, resource, tenant, and detail. `record_audit` is called
  from the security-relevant endpoints (consent decisions, retention purges, and
  is available to grade overrides and role changes). This is distinct from the
  domain evidence trails (mastery events, XP ledger), which stay where they are.

- **Consent** (`consent_records`). Per-user, per-type consent (parental,
  data_processing, proctoring). `has_consent` is the gate an optional
  data-collection feature checks before capturing. Parental consent is the COPPA
  gate for a minor's account. Consent is self-service (a guardian records it on
  the learner's behalf) and audited.

- **Retention**. TTLs per stream in settings; a Celery beat task
  (`axiom.retention_purge`) deletes rows older than each TTL. Raw proctoring and
  analytics events are minimized aggressively (180 / 365 days by default); the
  audit trail is kept longer (730 days) for accountability. An admin can also run
  the purge on demand.

- **Per-tenant isolation**. `app/core/tenancy.py` provides `scope_to_tenant`
  (restrict a SELECT to the caller's tenant plus global rows) and `tenant_uuid`
  (stamp new rows). It is enforced on every table that carries a `tenant_id`:
  the definition/theorem reference library, audit log, consent, and analytics
  events. A caller never reads or writes another tenant's rows.

## Consequences and honest scope

- Full row-level tenant isolation is enforced only on tables that carry a
  `tenant_id`. Tables that predate tenancy (items, attempts, mastery) do not yet
  carry the column; adding it across the whole schema is a larger migration
  tracked separately. `scope_to_tenant` is the single seam so that migration
  only has to add columns and apply the helper, not rewrite query logic.
- Encryption at rest is a deployment-layer concern (managed Postgres/volume
  encryption); the application does not add field-level encryption.
- Retention deletes are hard deletes of raw event streams; aggregated rollups
  and mastery history (the pedagogically meaningful record) are retained.
- Consent gating is modeled and available; wiring the gate into every optional
  capture point (all proctoring, all analytics) is applied incrementally.
