"""Spaced review: derived cards, the SM-2 schedule, and per-user state.

The tests drive the HTTP boundary because the commit is part of the
contract, the same reason the practice suite does: a review that grades but
does not persist would look identical from the service layer and schedule
nothing.
"""

from __future__ import annotations

import pytest

pytestmark = pytest.mark.asyncio


async def _queue(client, headers, limit=20):
    res = await client.get(f"/api/v1/srs/queue?limit={limit}", headers=headers)
    assert res.status_code == 200, res.text
    return res.json()


async def _review(client, headers, card_id, grade):
    return await client.post(
        "/api/v1/srs/review",
        json={"card_id": card_id, "grade": grade},
        headers=headers,
    )


async def test_queue_serves_new_cards_derived_from_lessons(client, auth):
    headers = auth("student", user_id="srs-fresh")
    data = await _queue(client, headers)

    counts = data["counts"]
    assert counts["total"] > 0
    assert counts["new"] == counts["total"], "a fresh account has seen nothing"
    assert counts["due"] == 0

    assert len(data["due"]) == 20
    for card in data["due"]:
        node, kind = card["card_id"].rsplit(":", 1)
        assert kind in ("try_it", "pitfall")
        assert card["node"] == node
        assert card["node_title"] and card["unit"]
        assert card["front"] and card["back"], "both faces come from the lesson"
        if kind == "pitfall":
            assert card["front"].startswith("Pitfall: ")


async def test_review_schedules_a_card_and_removes_it_from_new(client, auth):
    headers = auth("student", user_id="srs-schedules")
    before = await _queue(client, headers)
    card_id = before["due"][0]["card_id"]

    res = await _review(client, headers, card_id, 4)
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["card_id"] == card_id
    assert body["repetitions"] == 1
    assert body["interval_days"] == 1
    assert body["due_at"], "the next due date is part of the receipt"

    after = await _queue(client, headers)
    assert after["counts"]["new"] == before["counts"]["new"] - 1
    assert after["counts"]["due"] == 0, "a card due tomorrow is not due now"
    assert all(c["card_id"] != card_id for c in after["due"])


async def test_two_good_reviews_walk_the_interval_to_six_days(client, auth):
    headers = auth("student", user_id="srs-ladder")
    data = await _queue(client, headers, limit=1)
    card_id = data["due"][0]["card_id"]

    first = (await _review(client, headers, card_id, 5)).json()
    assert first["repetitions"] == 1 and first["interval_days"] == 1

    second = (await _review(client, headers, card_id, 5)).json()
    assert second["repetitions"] == 2
    assert second["interval_days"] == 6


async def test_a_lapse_resets_the_schedule(client, auth):
    headers = auth("student", user_id="srs-lapse")
    data = await _queue(client, headers, limit=1)
    card_id = data["due"][0]["card_id"]

    await _review(client, headers, card_id, 5)
    await _review(client, headers, card_id, 5)
    lapsed = (await _review(client, headers, card_id, 0)).json()
    assert lapsed["repetitions"] == 0
    assert lapsed["interval_days"] == 1

    # And it is due again in one day, not in six-times-ease.
    stats = (
        await client.get("/api/v1/srs/stats", headers=headers)
    ).json()
    assert stats["seen"] == 1
    assert stats["due_now"] == 0


async def test_unknown_card_is_refused(client, auth):
    headers = auth("student", user_id="srs-unknown")
    res = await _review(client, headers, "NOT.A.NODE:try_it", 4)
    assert res.status_code == 409
    assert "card" in res.json()["detail"]


async def test_state_is_private_to_its_owner(client, auth):
    headers_a = auth("student", user_id="srs-owner-a")
    headers_b = auth("student", user_id="srs-owner-b")

    data = await _queue(client, headers_a, limit=1)
    card_id = data["due"][0]["card_id"]
    assert (await _review(client, headers_a, card_id, 4)).status_code == 200

    b_queue = await _queue(client, headers_b)
    assert b_queue["counts"]["new"] == b_queue["counts"]["total"]

    b_stats = (
        await client.get("/api/v1/srs/stats", headers=headers_b)
    ).json()
    assert b_stats["seen"] == 0


async def test_sm2_lapse_resets_repetitions_but_leaves_ease_unchanged():
    from app.domains.srs.service import sm2

    reps, interval, ease = sm2(0, 0.0, 2.5, 5)
    reps, interval, ease = sm2(reps, interval, ease, 5)
    assert reps == 2
    ease_before_lapse = ease

    reps, interval, ease = sm2(reps, interval, ease, 1)
    assert reps == 0
    assert interval == 1.0
    assert ease == ease_before_lapse, "published SM-2 restarts reps without touching the E-Factor"


async def test_sm2_updates_ease_only_on_a_successful_recall():
    from app.domains.srs.service import sm2

    _, _, ease_barely = sm2(0, 0.0, 2.5, 3)
    _, _, ease_perfect = sm2(0, 0.0, 2.5, 5)
    assert ease_barely < 2.5 < ease_perfect


async def test_stats_roll_up_by_course(client, auth):
    headers = auth("student", user_id="srs-stats")
    data = await _queue(client, headers, limit=2)
    for card in data["due"]:
        assert (await _review(client, headers, card["card_id"], 3)).status_code == 200

    stats = (
        await client.get("/api/v1/srs/stats", headers=headers)
    ).json()
    assert stats["seen"] == 2
    assert stats["total_cards"] == sum(
        c["total"] for c in stats["by_course"].values()
    )
    assert sum(c["seen"] for c in stats["by_course"].values()) == 2
