"""RW-2: adaptive completeness.

Covers the mastery-model interface (BKT default + DKT seam), the decision
rationale on the path planner and the CAT selection, and predictive growth.
"""

from __future__ import annotations

from app.domains.adaptive.bkt import bkt_update
from app.domains.adaptive.cat_service import _selection_reason, start_cat
from app.domains.adaptive.mastery_model import (
    BktMasteryModel,
    DktMasteryModel,
    get_mastery_model,
)
from app.domains.adaptive.service import plan_path
from app.domains.analytics.service import _project_growth, growth
from app.domains.identity.models import User


def test_mastery_model_interface_defaults_to_bkt():
    model = get_mastery_model()
    assert model.name == "bkt"
    # The model interface produces exactly the BKT posterior.
    assert model.update(0.3, True) == bkt_update(0.3, True)
    assert model.update(0.6, False) == bkt_update(0.6, False)


def test_dkt_seam_falls_back_to_bkt():
    dkt = DktMasteryModel()
    assert dkt.name == "dkt"
    assert dkt.trained is False
    bkt = BktMasteryModel()
    # Until a trained checkpoint is wired in, DKT mirrors BKT exactly.
    for p in (0.1, 0.4, 0.75):
        assert dkt.update(p, True) == bkt.update(p, True)
        assert dkt.update(p, False) == bkt.update(p, False)


async def test_path_plan_carries_a_reason_per_node(db_session):
    user = User(eureka_user_id="rw2a", email="rw2a@x.com", display_name="RW Two A")
    db_session.add(user)
    await db_session.flush()

    result = await plan_path(db_session, user.id)
    plan = result["plan"]
    assert plan, "expected a seeded curriculum graph"
    assert all(node.get("reason") for node in plan)

    # A fresh learner has locked nodes; their reason names the unmet prerequisite.
    locked = [n for n in plan if n["status"] == "locked"]
    assert locked, "a fresh learner should have locked downstream nodes"
    assert any("->" in n["reason"] for n in locked)

    # The recommended node's reason is marked as such.
    if result["recommended_node_id"]:
        rec = next(n for n in plan if n["node_id"] == result["recommended_node_id"])
        assert "recommended next" in rec["reason"]


def test_growth_projection_trend_cases():
    rising = _project_growth([0.2, 0.35, 0.5, 0.65, 0.8], current_avg=0.8)
    assert rising["method"] == "linear-extrapolation"
    assert rising["on_track"] is True
    assert rising["slope_per_event"] > 0
    assert rising["projected_events_to_mastery"] is not None

    flat = _project_growth([0.5, 0.5, 0.5, 0.5], current_avg=0.5)
    assert flat["on_track"] is False
    assert flat["projected_events_to_mastery"] is None

    thin = _project_growth([0.5], current_avg=0.5)
    assert thin["method"] == "insufficient_data"


async def test_growth_payload_includes_projection(db_session):
    user = User(eureka_user_id="rw2b", email="rw2b@x.com", display_name="RW Two B")
    db_session.add(user)
    await db_session.flush()
    payload = await growth(db_session, user.id)
    assert "projection" in payload


def test_cat_selection_reason_shape():
    reason = _selection_reason(0.4213, 0.5)
    assert reason["rule"] == "maximum-information"
    assert reason["information"] == 0.4213
    assert "Fisher information" in reason["reason"]


async def test_cat_start_carries_selection_rationale(db_session):
    user = User(eureka_user_id="rw2c", email="rw2c@x.com", display_name="RW Two C")
    db_session.add(user)
    await db_session.flush()
    result = await start_cat(db_session, user.id)
    # The seeded bank has items, so a CAT starts with a selection rationale.
    if not result.get("done"):
        assert "selection" in result
        assert result["selection"]["rule"] == "maximum-information"
