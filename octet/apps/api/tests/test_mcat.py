"""MCAT-mode serving: stateless items, server-side grading, nothing leaked.

What these tests hold the endpoints to:

  - An item is (template_id, seed) and everything regenerates from it: the
    same request serves byte-identical items, and the submit path rebuilds
    the exact option order the serve path used, so grading can never drift
    from what the learner saw.
  - The offset is the only source of variation, and it works: a session at
    offset 0 and a session at a later offset serve different variants.
  - The serve payload carries no answer material: no correct index, no
    misconception codes, options are position + text and nothing else.
  - Option counts are honest: 3 or 4, always equal to len(options), never
    padded with un-keyed distractors.
  - Nodes that cannot serve the MCAT form are reported, not narrowed away,
    and eligible-nodes only advertises what genuinely serves.
"""

from __future__ import annotations

import pytest

pytestmark = pytest.mark.asyncio

ITEMS = "/api/v1/mcat/items"
SUBMIT = "/api/v1/mcat/submit"
ELIGIBLE = "/api/v1/mcat/eligible-nodes"

# A node whose mc templates carry >= 2 keyed distractors (servable), and one
# whose practice is numeric only (never servable in MCAT form).
SERVABLE_NODE = "GEN1.IMF"
NUMERIC_NODE = "GEN1.MOLE"


def _walk_keys(payload):
    """Every dict key anywhere in a JSON payload."""
    if isinstance(payload, dict):
        for k, v in payload.items():
            yield k
            yield from _walk_keys(v)
    elif isinstance(payload, list):
        for v in payload:
            yield from _walk_keys(v)


async def test_same_request_serves_identical_items(client, auth):
    body = {"nodes": [SERVABLE_NODE], "count": 3}
    first = await client.post(ITEMS, json=body, headers=auth("student", user_id="mcat-a"))
    second = await client.post(ITEMS, json=body, headers=auth("student", user_id="mcat-a"))
    assert first.status_code == 200, first.text
    assert first.json() == second.json()


async def test_offset_serves_fresh_variants(client, auth):
    hdrs = auth("student", user_id="mcat-b")
    at_zero = await client.post(
        ITEMS, json={"nodes": [SERVABLE_NODE], "count": 3, "offset": 0}, headers=hdrs
    )
    at_seven = await client.post(
        ITEMS, json={"nodes": [SERVABLE_NODE], "count": 3, "offset": 7}, headers=hdrs
    )
    assert at_zero.status_code == 200 and at_seven.status_code == 200
    zero_seeds = [(i["template_id"], i["seed"]) for i in at_zero.json()["items"]]
    seven_seeds = [(i["template_id"], i["seed"]) for i in at_seven.json()["items"]]
    assert zero_seeds != seven_seeds


async def test_serve_payload_leaks_no_answer_material(client, auth):
    res = await client.post(
        ITEMS,
        json={"nodes": [SERVABLE_NODE], "count": 4},
        headers=auth("student", user_id="mcat-c"),
    )
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["items"], "expected servable items for the smoke node"

    forbidden = {
        "correct", "correct_index", "correct_position", "correct_text",
        "misconception", "key", "key_path", "answer", "explanation",
    }
    leaked = forbidden & set(_walk_keys(body))
    assert not leaked, f"serve payload leaked: {leaked}"

    for item in body["items"]:
        for option in item["options"]:
            assert set(option) == {"position", "text"}


async def test_option_counts_are_honest(client, auth):
    res = await client.post(
        ITEMS,
        json={"nodes": [SERVABLE_NODE], "count": 4},
        headers=auth("student", user_id="mcat-d"),
    )
    assert res.status_code == 200
    for item in res.json()["items"]:
        assert item["option_count"] == len(item["options"])
        assert 3 <= item["option_count"] <= 4


async def test_unservable_nodes_reported_not_narrowed(client, auth):
    res = await client.post(
        ITEMS,
        json={"nodes": [NUMERIC_NODE], "count": 3},
        headers=auth("student", user_id="mcat-e"),
    )
    assert res.status_code == 200
    body = res.json()
    assert body["items"] == []
    assert NUMERIC_NODE in body["unservable_nodes"]
    assert "invented" in body.get("note", "")


async def test_submit_grades_the_exact_served_item(client, auth):
    import chem_core as cc
    from app.domains.mcat.router import build_mcat_choices

    hdrs = auth("student", user_id="mcat-f")
    served = await client.post(
        ITEMS, json={"nodes": [SERVABLE_NODE], "count": 1}, headers=hdrs
    )
    item = served.json()["items"][0]

    # Rebuild the item the way the submit path will. The rebuilt option
    # order must match what was served - that equality IS the guarantee
    # that grading grades the item the learner actually saw.
    variant = cc.resolve_generated(item["template_id"], item["seed"])
    options, correct_position = build_mcat_choices(variant)
    assert [str(o.get("text", "")) for o in options] == [
        o["text"] for o in item["options"]
    ]

    right = await client.post(
        SUBMIT,
        json={
            "template_id": item["template_id"],
            "seed": item["seed"],
            "choice_index": correct_position,
        },
        headers=hdrs,
    )
    assert right.status_code == 200, right.text
    assert right.json()["is_correct"] is True
    assert right.json()["correct_position"] == correct_position

    wrong_position = next(
        i for i in range(len(options)) if i != correct_position
    )
    wrong = await client.post(
        SUBMIT,
        json={
            "template_id": item["template_id"],
            "seed": item["seed"],
            "choice_index": wrong_position,
        },
        headers=hdrs,
    )
    assert wrong.status_code == 200
    wbody = wrong.json()
    assert wbody["is_correct"] is False
    # Every distractor is misconception-keyed, so a wrong answer explains
    # itself and routes somewhere to review.
    assert wbody["misconception"]
    assert wbody["rationale"]["review_node"]


async def test_out_of_range_choice_is_refused(client, auth):
    import chem_core as cc
    from app.domains.mcat.router import build_mcat_choices

    # Find a template that serves exactly 3 options, so index 3 passes the
    # schema bound (le=3) and must be caught by the runtime range check.
    three_tid = None
    for tid, entry in cc.REGISTRY.items():
        if entry["grader"] != "mc":
            continue
        try:
            options, _ = build_mcat_choices(cc.resolve_generated(tid, 1))
        except (RuntimeError, ValueError):
            continue
        if len(options) == 3:
            three_tid = tid
            break
    assert three_tid, "expected at least one 3-option template in the bank"

    res = await client.post(
        SUBMIT,
        json={"template_id": three_tid, "seed": 1, "choice_index": 3},
        headers=auth("student", user_id="mcat-g"),
    )
    assert res.status_code == 422
    assert "3 options" in res.json()["detail"]


async def test_eligible_nodes_advertises_only_what_serves(client, auth):
    res = await client.get(ELIGIBLE, headers=auth("student", user_id="mcat-h"))
    assert res.status_code == 200
    nodes = res.json()["nodes"]
    assert SERVABLE_NODE in nodes
    assert NUMERIC_NODE not in nodes
    # A 2-distractor-short template must not be advertised: ORG1.RS's mc
    # templates carry a single keyed distractor (a coin flip, excluded).
    assert "ORG1.RS" not in nodes
    assert all(count >= 1 for count in nodes.values())
