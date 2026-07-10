"""Compliance: audit trail, consent, retention, and tenant scoping (Section 13)."""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

import pytest

from tests.conftest import AUTH


@pytest.mark.asyncio
async def test_consent_roundtrip_and_is_audited(client, as_admin):
    # A learner records parental consent for their account.
    put = await client.put(
        "/api/v1/compliance/consent/me",
        headers=AUTH,
        json={"consent_type": "parental", "granted": True, "granted_by": "Parent Name"},
    )
    assert put.status_code == 200
    assert put.json()["granted"] is True

    got = await client.get("/api/v1/compliance/consent/me", headers=AUTH)
    assert got.status_code == 200
    consents = {c["consent_type"]: c for c in got.json()["consents"]}
    assert consents["parental"]["granted"] is True
    assert consents["parental"]["granted_by"] == "Parent Name"

    # The consent decision landed in the audit trail (admin view).
    audit = await client.get("/api/v1/compliance/audit?action=consent.set", headers=AUTH)
    assert audit.status_code == 200
    actions = [e["action"] for e in audit.json()["events"]]
    assert "consent.set" in actions


@pytest.mark.asyncio
async def test_audit_trail_is_admin_only(client):
    # The default mock principal is a student, so the audit trail is forbidden.
    resp = await client.get("/api/v1/compliance/audit", headers=AUTH)
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_retention_purge_runs_for_admin(client, as_admin):
    resp = await client.post("/api/v1/compliance/retention/purge", headers=AUTH)
    assert resp.status_code == 200
    assert "deleted" in resp.json()


@pytest.mark.asyncio
async def test_purge_deletes_only_expired_rows(db_session):
    from app.domains.analytics.models import AnalyticsEvent
    from app.domains.compliance.service import purge_expired

    now = datetime.now(UTC).replace(tzinfo=None)
    old = AnalyticsEvent(
        actor="u1", action="Viewed", object_type="Item", object_id="i1",
        event_time=now - timedelta(days=400), extensions={},
    )
    fresh = AnalyticsEvent(
        actor="u1", action="Viewed", object_type="Item", object_id="i2",
        event_time=now, extensions={},
    )
    db_session.add_all([old, fresh])
    await db_session.flush()

    deleted = await purge_expired(
        db_session, proctoring_days=0, analytics_days=365, audit_days=0
    )
    assert deleted["analytics_events"] == 1  # only the 400-day-old row
    assert deleted["proctoring_events"] == 0  # disabled by ttl 0


def test_tenant_scope_helpers():
    from types import SimpleNamespace

    from app.core.tenancy import owns_or_global, tenant_uuid

    tid = uuid.uuid4()
    user = SimpleNamespace(tenant_id=str(tid))
    assert tenant_uuid(user) == tid
    # A global (untenanted) row is visible to anyone.
    assert owns_or_global(SimpleNamespace(tenant_id=None), user) is True
    # The caller's own row is visible.
    assert owns_or_global(SimpleNamespace(tenant_id=tid), user) is True
    # Another tenant's row is not.
    assert owns_or_global(SimpleNamespace(tenant_id=uuid.uuid4()), user) is False
