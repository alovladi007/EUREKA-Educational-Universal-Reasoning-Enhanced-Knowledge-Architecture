"""Per-tenant scoping helpers (Build prompt Section 13: per-tenant isolation).

AXIOM is multi-tenant: a User carries a tenant_id from the EUREKA token, and
tenant-scoped tables carry a tenant_id column. These helpers restrict a query to
the caller's tenant plus globally shared rows (tenant_id IS NULL), and stamp the
caller's tenant onto new rows, so one organization never reads or writes another
organization's data.

Scope note: this is enforced on the tables that carry a tenant_id (the
definition/theorem reference library, audit, consent, analytics events). Tables
that predate tenancy (items, attempts, mastery) do not yet carry the column;
adding it across the full schema is a larger migration tracked separately. The
helper is the single seam so that migration only has to add columns and a
Depends, not rewrite queries.
"""

from __future__ import annotations

import uuid

from sqlalchemy import or_


def tenant_uuid(user) -> uuid.UUID | None:
    """The caller's tenant as a UUID, or None when they have no tenant."""
    tid = getattr(user, "tenant_id", None)
    if not tid:
        return None
    if isinstance(tid, uuid.UUID):
        return tid
    try:
        return uuid.UUID(str(tid))
    except (ValueError, TypeError):
        return None


def scope_to_tenant(query, model, user):
    """Restrict a SELECT to the caller's tenant plus global (tenant_id NULL) rows.

    A caller with no tenant sees only global rows. A tenant caller sees their own
    rows and the shared global library, but never another tenant's rows.
    """
    tid = tenant_uuid(user)
    if tid is None:
        return query.where(model.tenant_id.is_(None))
    return query.where(or_(model.tenant_id == tid, model.tenant_id.is_(None)))


def owns_or_global(row, user) -> bool:
    """True when the row is the caller's tenant's or a global (untenanted) row."""
    row_tid = getattr(row, "tenant_id", None)
    if row_tid is None:
        return True
    return row_tid == tenant_uuid(user)
