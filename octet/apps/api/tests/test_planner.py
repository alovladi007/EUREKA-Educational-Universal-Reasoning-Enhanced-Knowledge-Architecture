"""GET /planner: the target-date plan is arithmetic over the recorded route.

What the tests hold the endpoint to: the plan is the same route /path
recommends (review weakest-first, then in progress, then the authored
frontier in course order), divided evenly across the days remaining; the
numbers it refuses to invent stay absent (no minutes, no completion
probability, no predicted score); and a date that cannot anchor a plan is
refused rather than papered over.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

pytestmark = pytest.mark.asyncio

PLANNER = "/api/v1/planner"


def _future(days: int) -> str:
    return (datetime.now(timezone.utc).date() + timedelta(days=days)).isoformat()


async def test_planner_schedules_review_first_then_frontier(client, db_session, auth):
    from app.domains.practice.models import NodeMastery

    uid = "planner-learner"
    now = datetime.now(timezone.utc)
    db_session.add_all(
        [
            NodeMastery(user_id=uid, node_code="GEN1.MATTER", attempts=4,
                        correct=1, streak=0, ewma=0.2, last_attempt_at=now),
            NodeMastery(user_id=uid, node_code="GEN1.ATOMICTHEORY", attempts=2,
                        correct=2, streak=2, ewma=0.7, last_attempt_at=now),
        ]
    )
    await db_session.commit()

    res = await client.get(
        f"{PLANNER}?target_date={_future(30)}", headers=auth("student", user_id=uid)
    )
    assert res.status_code == 200, res.text
    body = res.json()

    assert body["days_remaining"] == 30
    assert body["review_count"] == 1
    assert body["continue_count"] == 1
    # The whole remaining authored course is on the route, not a preview.
    assert body["total_nodes"] > 100
    assert body["per_day"] == -(-body["total_nodes"] // 30)

    # Day one starts with the review node, then the in-progress node.
    first_nodes = [n["node"] for n in body["days"][0]["nodes"]]
    assert first_nodes[0] == "GEN1.MATTER"
    assert first_nodes[1] == "GEN1.ATOMICTHEORY"

    # Every scheduled day carries a date and at least one node, and the days
    # partition the route without duplication.
    seen: list[str] = []
    for day in body["days"]:
        assert day["date"] > datetime.now(timezone.utc).date().isoformat()
        assert day["nodes"]
        seen.extend(n["node"] for n in day["nodes"])
    assert len(seen) == len(set(seen)) == body["total_nodes"]


async def test_planner_refuses_the_past_and_garbage(client, auth):
    for bad in ("2020-01-01", "banana", ""):
        res = await client.get(
            f"{PLANNER}?target_date={bad}", headers=auth("student", user_id="p2")
        )
        assert res.status_code == 422, f"{bad!r} -> {res.status_code}"


async def test_planner_invents_no_numbers(client, auth):
    """The response must not carry the numbers this platform refuses to
    fabricate: time estimates, completion probability, predicted scores."""
    res = await client.get(
        f"{PLANNER}?target_date={_future(14)}", headers=auth("student", user_id="p3")
    )
    assert res.status_code == 200
    body = res.json()
    # No invented quantities anywhere in the payload's keys.
    def keys_of(obj):
        if isinstance(obj, dict):
            for k, v in obj.items():
                yield k
                yield from keys_of(v)
        elif isinstance(obj, list):
            for v in obj:
                yield from keys_of(v)

    all_keys = set(keys_of(body))
    for forbidden in ("minutes", "estimated_minutes", "completion_probability",
                      "predicted_score", "scaled_score", "percentile"):
        assert forbidden not in all_keys, forbidden
    # The note says exactly what this is, and what it is not.
    assert "arithmetic" in body["note"]
    assert "not minutes" in body["note"]


async def test_planner_finishes_early_when_the_route_is_short(client, db_session, auth):
    """A learner with almost everything mastered gets a short plan and the
    flag saying so, not a plan padded to fill the calendar."""
    from app.data.coverage import is_authored
    from app.data.curriculum import topological_order

    uid = "planner-finisher"
    now = datetime.now(timezone.utc)
    from app.domains.practice.models import NodeMastery

    order = [c for c in topological_order() if is_authored(c)]
    # Master all but three nodes.
    db_session.add_all(
        [
            NodeMastery(user_id=uid, node_code=code, attempts=6, correct=6,
                        streak=6, ewma=0.95, last_attempt_at=now)
            for code in order[:-3]
        ]
    )
    await db_session.commit()

    res = await client.get(
        f"{PLANNER}?target_date={_future(30)}", headers=auth("student", user_id=uid)
    )
    assert res.status_code == 200
    body = res.json()
    assert body["total_nodes"] == 3
    assert body["per_day"] == 1
    assert len(body["days"]) == 3
    assert body["finishes_early"] is True
