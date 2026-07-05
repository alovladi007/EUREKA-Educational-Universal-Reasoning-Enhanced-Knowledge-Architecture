"""QTI 3.0 routes are mounted and gated to teachers.

The QTI conversion itself is covered by test_qti.py; here we only confirm the
routes resolve (403, not 404) and enforce the teacher role for a student caller.
"""

from __future__ import annotations

from tests.conftest import AUTH

_ANY_UUID = "00000000-0000-0000-0000-000000000000"


async def test_export_item_qti_requires_teacher(client):
    resp = await client.get(f"/api/v1/assessments/items/{_ANY_UUID}/qti", headers=AUTH)
    assert resp.status_code == 403


async def test_export_bank_qti_requires_teacher(client):
    resp = await client.get(f"/api/v1/assessments/banks/{_ANY_UUID}/qti", headers=AUTH)
    assert resp.status_code == 403


async def test_import_qti_requires_teacher(client):
    resp = await client.post(
        "/api/v1/assessments/qti/import",
        json={"bank_id": _ANY_UUID, "node_id": _ANY_UUID, "xml": "<root/>"},
        headers=AUTH,
    )
    assert resp.status_code == 403
