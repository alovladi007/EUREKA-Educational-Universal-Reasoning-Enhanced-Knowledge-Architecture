"""Review your mistakes: the incorrect-answer review that closes the loop."""

from __future__ import annotations

from app.domains.practice.service import _correct_display
from tests.conftest import AUTH


def test_correct_display_maps_mcq_index_to_option():
    assert _correct_display("mcq_single", "2", ["a", "b", "c", "d"]) == "c"
    # A non-index or out-of-range value falls back to the raw string.
    assert _correct_display("mcq_single", "x", ["a", "b"]) == "x"
    assert _correct_display("numeric", "10", None) == "10"


async def test_mistakes_lists_incorrect_answers_with_key(client):
    served = (await client.post("/api/v1/practice/next", json={}, headers=AUTH)).json()
    wrong = "definitely-wrong-zzz"
    await client.post(
        "/api/v1/practice/answer",
        json={"response_token": served["response_token"], "answer": wrong},
        headers=AUTH,
    )

    resp = await client.get("/api/v1/practice/mistakes", headers=AUTH)
    assert resp.status_code == 200
    items = resp.json()["items"]
    assert len(items) >= 1

    mistake = items[0]
    for key in ("prompt", "your_answer", "correct_answer", "explanation", "node_title", "kind"):
        assert key in mistake
    assert mistake["your_answer"] == wrong
    assert mistake["correct_answer"]


async def test_mistakes_empty_when_no_wrong_answers(client):
    # A fresh student who has not answered anything has no mistakes.
    resp = await client.get("/api/v1/practice/mistakes", headers=AUTH)
    assert resp.status_code == 200
    assert resp.json()["items"] == []
