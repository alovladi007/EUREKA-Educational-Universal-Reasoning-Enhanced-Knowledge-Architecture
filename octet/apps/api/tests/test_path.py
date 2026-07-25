"""GET /path against recorded mastery: the planner reads what practice wrote.

The tests drive the HTTP boundary with rows seeded straight into node_mastery,
because the contract under test is the join between the two: the recommendation
must be a view over the recorded accuracy, not a cold-start plan wearing a
recommendation's clothes.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

pytestmark = pytest.mark.asyncio

PATH = "/api/v1/path"


async def test_path_groups_reflect_recorded_mastery(client, db_session, auth):
    from app.domains.practice.models import NodeMastery

    uid = "path-learner"
    now = datetime.now(timezone.utc)
    db_session.add_all(
        [
            # Two failing nodes; MATTER is weaker and must be listed first.
            NodeMastery(user_id=uid, node_code="GEN1.MATTER", attempts=4,
                        correct=1, streak=0, ewma=0.2, last_attempt_at=now),
            NodeMastery(user_id=uid, node_code="GEN1.SAFETY", attempts=3,
                        correct=1, streak=0, ewma=0.4, last_attempt_at=now),
            # Under way: attempted, neither mastered nor failing.
            NodeMastery(user_id=uid, node_code="GEN1.ATOMICTHEORY", attempts=2,
                        correct=2, streak=2, ewma=0.7,
                        last_attempt_at=now - timedelta(hours=1)),
            # Mastered: must not be recommended anywhere.
            NodeMastery(user_id=uid, node_code="GEN1.LEWIS", attempts=6,
                        correct=6, streak=6, ewma=0.95, last_attempt_at=now),
        ]
    )
    await db_session.commit()

    res = await client.get(PATH, headers=auth("student", user_id=uid))
    assert res.status_code == 200, res.text
    body = res.json()

    # Review: both failing nodes, weakest ewma first.
    review = [e["node"] for e in body["review"]]
    assert review == ["GEN1.MATTER", "GEN1.SAFETY"]

    # Continue: the in-progress node, with its recorded numbers on it.
    cont = body["continue"]
    assert [e["node"] for e in cont] == ["GEN1.ATOMICTHEORY"]
    assert cont[0]["attempts"] == 2
    assert cont[0]["accuracy"] == 0.7

    # A mastered node is done, not a recommendation.
    everywhere = review + [e["node"] for e in cont] + [e["node"] for e in body["next"]]
    assert "GEN1.LEWIS" not in everywhere

    # Next: authored, unattempted, and never something already attempted.
    from app.data.coverage import is_authored

    assert body["next"], "an active learner still gets frontier nodes"
    assert len(body["next"]) <= 5
    attempted = {"GEN1.MATTER", "GEN1.SAFETY", "GEN1.ATOMICTHEORY", "GEN1.LEWIS"}
    for e in body["next"]:
        assert is_authored(e["node"])
        assert e["node"] not in attempted
        assert e["reason"].strip()

    # The note states what the numbers are and what they are not.
    assert body["recorded_nodes"] == 4
    assert "not an IRT" in body["note"]


async def test_path_empty_account_starts_from_the_beginning(client, auth):
    from app.data.coverage import is_authored
    from app.data.curriculum import topological_order

    res = await client.get(PATH, headers=auth("student", user_id="fresh-learner"))
    assert res.status_code == 200, res.text
    body = res.json()

    assert body["review"] == []
    assert body["continue"] == []
    assert body["recorded_nodes"] == 0

    # Next is the first authored nodes in course order, and the note says so.
    expected = [c for c in topological_order() if is_authored(c)][:5]
    assert [e["node"] for e in body["next"]] == expected
    assert "beginning" in body["note"]
    assert "not an IRT" in body["note"]
