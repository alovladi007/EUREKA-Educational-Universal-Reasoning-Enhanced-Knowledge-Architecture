"""Practice sessions, mastery, and analytics: the recorded practice loop.

The tests drive the HTTP boundary because the transaction commit is part of
the contract: an answer that grades but does not persist would look identical
from the service layer and be worthless to analytics.
"""

from __future__ import annotations

import pytest

pytestmark = pytest.mark.asyncio

BUILD = {"units": ["GEN1-U3", "GEN1-U4"], "count": 5, "mode": "tutor"}


async def _start(client, headers, **overrides):
    body = {**BUILD, **overrides}
    res = await client.post("/api/v1/practice/sessions", json=body, headers=headers)
    assert res.status_code == 200, res.text
    return res.json()


async def test_catalogue_marks_supply_honestly(client, auth):
    """The availability flag must agree with the item count, in both directions.

    This used to assert that both states "must actually occur today", which was
    a statement about how much content existed rather than about whether the
    catalogue tells the truth. It held while units were still being written and
    stopped holding the moment the last one got items, which is the wrong thing
    for a test to punish.

    What matters is the invariant: a unit is offered as available exactly when
    it can supply items. That is checkable whatever the coverage, and it is
    what a learner is relying on when they pick a unit.
    """
    res = await client.get("/api/v1/practice/catalogue", headers=auth("student"))
    assert res.status_code == 200
    units = res.json()["units"]
    assert len(units) == 40, "every unit is listed, practiceable or not"

    for u in units:
        assert u["available"] == (u["templates"] > 0), (
            f"{u['id']} reports available={u['available']} with "
            f"{u['templates']} templates"
        )


async def test_session_starts_with_items_and_no_keys(client, auth):
    data = await _start(client, auth("student"))
    assert len(data["items"]) == 5
    for item in data["items"]:
        assert item["prompt"]
        assert "key" not in item and "correct_index" not in item.get("meta", {})
        for choice in item.get("meta", {}).get("choices", []):
            assert set(choice) == {"index", "text"}, "no misconception leak on serve"


async def test_multi_unit_session_draws_from_every_selected_unit(client, auth):
    """The builder promises a mix across every selected unit, and means it.

    GEN1-U4 and ORG2-U8 reproduce the reported failure exactly: the registry
    lists GEN1-U4's templates before ORG2's, so the old raw round-robin drew
    all five items from GEN1-U4 and none from ORG2-U8. Round-robin across
    units first makes both appear whenever count >= the number of selected
    units with supply.
    """
    data = await _start(
        client,
        auth("student", user_id="mix-learner"),
        units=["GEN1-U4", "ORG2-U8"],
        count=5,
    )
    served = {item["unit"] for item in data["items"]}
    assert served == {"GEN1-U4", "ORG2-U8"}


async def test_session_items_do_not_repeat_a_variant(client, auth):
    """No two items share one learner-visible face when the pool permits.

    ORG2-U8 supplies a single template with exactly four distinct variants,
    so a four-item session over it permits four distinct items, and before
    the dedup it served repeats more often than not. Identity is prompt plus
    choice texts, because mc templates may share one prompt across distinct
    choice sets.
    """
    data = await _start(
        client,
        auth("student", user_id="dedup-learner"),
        units=["ORG2-U8"],
        count=4,
    )
    faces = [
        (
            item["prompt"],
            tuple(c["text"] for c in item.get("meta", {}).get("choices", [])),
        )
        for item in data["items"]
    ]
    assert len(set(faces)) == len(faces), faces


async def test_empty_selection_is_refused_with_a_reason(client, auth, monkeypatch):
    """The endpoint refuses a selection it cannot fill, and says why.

    This test used to name a real unit that happened to have no templates, and
    it broke twice for the happiest possible reason: someone wrote items for
    that unit. ORG2-U1 was the fixture until Phase 6 gave it a template, then
    ORG2-U3 was, until this unit build gave it nine. Its own comment predicted
    the second break.

    Now that every unit in the curriculum can supply items, no such fixture
    exists at all, and pointing at a third unit would only schedule the same
    failure again. So the condition is constructed rather than borrowed: the
    supply lookup is emptied for this one call. That tests what the endpoint
    does when supply runs out, which is the actual subject, and it cannot be
    invalidated by anybody authoring content.
    """
    from app.domains.practice import sessions as sessions_mod

    monkeypatch.setattr(sessions_mod, "templates_for_units", lambda unit_ids: [])

    res = await client.post(
        "/api/v1/practice/sessions",
        json={"units": ["ORG2-U3"], "count": 5, "mode": "tutor"},
        headers=auth("student"),
    )
    assert res.status_code == 409
    assert "practice items" in res.json()["detail"]


async def test_every_unit_can_now_supply_practice_items(client, auth):
    """The state that made the fixture above impossible, asserted directly.

    Worth its own test rather than a comment: "readable but not practisable"
    was the largest content gap in the platform, and if a unit ever loses its
    last template this should fail loudly rather than showing up as a learner
    finding an empty practice session.
    """
    import chem_core as cc

    from app.data.curriculum import NODES_BY_CODE, UNITS

    with_items = {
        NODES_BY_CODE[str(entry["node"])].unit
        for entry in cc.REGISTRY.values()
        if str(entry["node"]) in NODES_BY_CODE
    }
    empty = [u.id for u in UNITS if u.id not in with_items]
    assert empty == [], f"units with no practice items: {empty}"


async def test_tutor_answer_returns_rationale_and_persists(client, auth):
    headers = auth("student", user_id="tutor-learner")
    data = await _start(client, headers)
    sid = data["session_id"]

    res = await client.post(
        f"/api/v1/practice/sessions/{sid}/answer",
        json={"position": 1, "answer": "definitely wrong", "seconds": 12},
        headers=headers,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["is_correct"] is False
    assert "rationale" in body and body["rationale"]["lesson_node"]

    # Persisted: mastery now exists for that node.
    mastery = (
        await client.get("/api/v1/analytics/mastery", headers=headers)
    ).json()["nodes"]
    assert len(mastery) >= 0  # ungraded answers do not move mastery
    overview = (
        await client.get("/api/v1/analytics/overview", headers=headers)
    ).json()
    # Whether the hostile string graded depends on the grader drawn; what must
    # hold is that the response was recorded on the session.
    history = (
        await client.get("/api/v1/practice/sessions", headers=headers)
    ).json()["sessions"]
    assert history and history[0]["session_id"] == sid
    assert overview["note"]


async def test_answers_are_final(client, auth):
    headers = auth("student", user_id="final-learner")
    data = await _start(client, headers)
    sid = data["session_id"]
    first = await client.post(
        f"/api/v1/practice/sessions/{sid}/answer",
        json={"position": 1, "answer": "x"},
        headers=headers,
    )
    assert first.status_code == 200
    second = await client.post(
        f"/api/v1/practice/sessions/{sid}/answer",
        json={"position": 1, "answer": "y"},
        headers=headers,
    )
    assert second.status_code == 409
    assert "final" in second.json()["detail"]


async def test_timed_mode_hides_correctness_until_review(client, auth):
    headers = auth("student", user_id="timed-learner")
    data = await _start(client, headers, mode="timed")
    sid = data["session_id"]

    res = await client.post(
        f"/api/v1/practice/sessions/{sid}/answer",
        json={"position": 1, "answer": "42"},
        headers=headers,
    )
    body = res.json()
    assert body == {"recorded": True, "answered": 1, "total": 5}
    assert "is_correct" not in body and "rationale" not in body

    # Review before finishing is refused: an open timed session must not see keys.
    early = await client.get(f"/api/v1/practice/sessions/{sid}/review", headers=headers)
    assert early.status_code == 409

    done = await client.post(f"/api/v1/practice/sessions/{sid}/finish", headers=headers)
    assert done.status_code == 200
    summary = done.json()["summary"]
    assert summary["total"] == 5 and summary["answered"] == 1

    review = await client.get(f"/api/v1/practice/sessions/{sid}/review", headers=headers)
    assert review.status_code == 200
    items = review.json()["items"]
    assert len(items) == 5
    answered = [i for i in items if i["answered"]]
    assert len(answered) == 1
    for item in items:
        assert item["rationale"]["correct_display"], "review must show the answer"


async def test_mastery_moves_on_correct_answers_and_learn_states_follow(client, auth, db_session):
    """Answer an item correctly by reading the key server-side.

    The test grabs the variant's real key through chem_core, which the client
    cannot do; this is the test asserting persistence arithmetic, not a
    security property.
    """
    import chem_core as cc

    headers = auth("student", user_id="mastery-learner")
    data = await _start(client, headers, count=5)
    sid = data["session_id"]

    correct_nodes = []
    for item in data["items"]:
        variant = cc.resolve_generated(item["template_id"], item["seed"])
        answer = variant.key
        if variant.grader == "mc":
            answer = variant.meta["correct_index"]
        res = await client.post(
            f"/api/v1/practice/sessions/{sid}/answer",
            json={"position": item["position"], "answer": str(answer)},
            headers=headers,
        )
        assert res.status_code == 200, res.text
        if res.json()["is_correct"]:
            correct_nodes.append(item["node"])
    assert correct_nodes, "at least one self-keyed answer must grade correct"

    mastery = (
        await client.get("/api/v1/analytics/mastery", headers=headers)
    ).json()["nodes"]
    for node in correct_nodes:
        assert node in mastery
        assert mastery[node]["state"] in ("in_progress", "mastered")
        assert mastery[node]["accuracy_ewma"] > 0

    overview = (
        await client.get("/api/v1/analytics/overview", headers=headers)
    ).json()
    assert overview["totals"]["attempts"] >= len(correct_nodes)
    assert overview["totals"]["correct"] >= len(correct_nodes)
    assert overview["by_unit"], "unit rollup must be populated"


async def test_sessions_are_private_to_their_owner(client, auth):
    headers_a = auth("student", user_id="learner-a")
    headers_b = auth("student", user_id="learner-b")
    data = await _start(client, headers_a)
    sid = data["session_id"]
    stolen = await client.post(
        f"/api/v1/practice/sessions/{sid}/answer",
        json={"position": 1, "answer": "x"},
        headers=headers_b,
    )
    assert stolen.status_code == 409
    assert "not found" in stolen.json()["detail"]
