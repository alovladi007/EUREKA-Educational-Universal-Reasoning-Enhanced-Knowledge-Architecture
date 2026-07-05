"""Analytics: item statistics, standards heatmap, growth, and export formats."""

from __future__ import annotations

from app.domains.analytics.exports import to_csv, to_pdf
from app.domains.analytics.service import (
    growth,
    item_analysis,
    item_analysis_table,
    standards_heatmap,
)
from app.domains.identity.models import User
from tests.conftest import AUTH


async def test_item_analysis_covers_seeded_items(db_session):
    rows = await item_analysis(db_session)
    assert len(rows) >= 1
    first = rows[0]
    for key in ("item_id", "node_code", "kind", "n_responses", "p_value", "avg_score"):
        assert key in first


async def test_standards_heatmap_lists_every_node(db_session):
    heatmap = await standards_heatmap(db_session)
    assert len(heatmap["nodes"]) >= 6
    assert all("avg_p_known" in node for node in heatmap["nodes"])


async def test_export_table_renders_csv_and_pdf(db_session):
    rows = await item_analysis(db_session)
    headers, table = item_analysis_table(rows)
    assert headers[0] == "Node"

    csv_text = to_csv(headers, table)
    assert "Node" in csv_text.splitlines()[0]

    pdf_bytes = to_pdf("Item Analysis", headers, table)
    assert pdf_bytes.startswith(b"%PDF")


async def test_growth_reports_events_after_practice(db_session):
    user = User(eureka_user_id="an1", email="an1@x.com", display_name="An One")
    db_session.add(user)
    await db_session.flush()
    result = await growth(db_session, user.id)
    assert result["n_events"] == 0
    assert result["events"] == []
    assert "avg_p_known_now" in result


async def test_item_analytics_requires_teacher(client):
    # The mock identity is a student, so teacher-gated analytics are forbidden.
    resp = await client.get("/api/v1/analytics/items", headers=AUTH)
    assert resp.status_code == 403


async def test_growth_me_endpoint_is_open_to_student(client):
    resp = await client.get("/api/v1/analytics/growth/me", headers=AUTH)
    assert resp.status_code == 200
    assert "events" in resp.json()
