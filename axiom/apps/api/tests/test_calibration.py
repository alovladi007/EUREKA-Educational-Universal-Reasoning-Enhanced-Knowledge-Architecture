"""IRT calibration: classical statistics mapped into IRT parameters."""

from __future__ import annotations

from sqlalchemy import select

from app.domains.adaptive.calibration import calibrate_all, calibrate_item
from app.domains.adaptive.irt import calibrate_from_stats
from app.domains.adaptive.models import IRTParameters
from app.domains.assessment.models import Item
from app.domains.attempts.models import Attempt, Response, Score
from app.domains.identity.models import User
from tests.conftest import AUTH


def test_calibrate_from_stats_orders_difficulty_by_p_value():
    easy = calibrate_from_stats(0.9, 0.5, 100)
    hard = calibrate_from_stats(0.2, 0.5, 100)
    assert easy.b < hard.b
    assert 0.4 <= easy.a <= 2.5
    assert 0.0 <= easy.c < 1.0


async def test_calibrate_item_skips_items_without_enough_data(db_session):
    item = (await db_session.execute(select(Item))).scalars().first()
    # Fresh seed has no scored responses, so calibration is honestly skipped.
    assert await calibrate_item(db_session, item.id) is None


async def test_calibrate_item_writes_parameters_with_enough_data(db_session):
    item = (await db_session.execute(select(Item))).scalars().first()
    for i in range(6):
        user = User(eureka_user_id=f"cal{i}", email=f"cal{i}@x.com", display_name=f"C{i}")
        db_session.add(user)
        await db_session.flush()
        attempt = Attempt(user_id=user.id, kind="practice", status="in_progress")
        db_session.add(attempt)
        await db_session.flush()
        resp = Response(
            attempt_id=attempt.id,
            user_id=user.id,
            node_id=item.node_id,
            item_id=item.id,
            answer={},
        )
        db_session.add(resp)
        await db_session.flush()
        db_session.add(
            Score(response_id=resp.id, is_correct=(i % 2 == 0), score=1.0 if i % 2 == 0 else 0.0)
        )
    await db_session.flush()

    result = await calibrate_item(db_session, item.id)
    assert result is not None
    assert result["n"] == 6
    assert 0.0 <= result["p_value"] <= 1.0

    irt = (
        await db_session.execute(select(IRTParameters).where(IRTParameters.item_id == item.id))
    ).scalar_one()
    assert 0.4 <= irt.a <= 2.5


async def test_calibrate_all_reports_count(db_session):
    result = await calibrate_all(db_session)
    # No item has enough data on a fresh seed, so nothing is calibrated.
    assert result["calibrated"] == 0
    assert result["items"] == []


async def test_calibration_run_requires_teacher(client):
    resp = await client.post("/api/v1/calibration/run", headers=AUTH)
    assert resp.status_code == 403
