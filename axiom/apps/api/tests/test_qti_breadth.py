"""RW-4: QTI 3.0 breadth.

Every AXIOM item kind must export to QTI and re-import without loss -- the
Phase-2 acceptance criterion, now for the whole kind set rather than four kinds.
The common kinds map to native QTI interactions; the long tail round-trips via a
carrier. In all cases kind, prompt, options, correct, and explanation survive.
"""

from __future__ import annotations

import json

import pytest

from app.domains.assessment.qti import bank_to_qti, item_to_qti, qti_to_bank, qti_to_item

CASES = [
    {"identifier": "i-mcq1", "kind": "mcq_single", "prompt": "Pick 2",
     "options": ["1", "2", "3"], "correct": "1", "explanation": "two"},
    {"identifier": "i-mcqm", "kind": "mcq_multi", "prompt": "Pick even",
     "options": ["1", "2", "3", "4"], "correct": json.dumps([1, 3]), "explanation": ""},
    {"identifier": "i-tf", "kind": "true_false", "prompt": "2 is prime",
     "options": None, "correct": "true", "explanation": "yes"},
    {"identifier": "i-ord", "kind": "ordering", "prompt": "Order steps",
     "options": None, "correct": json.dumps(["a", "b", "c"]), "explanation": ""},
    {"identifier": "i-num", "kind": "numeric", "prompt": "2+2",
     "options": None, "correct": "4", "explanation": ""},
    {"identifier": "i-ineq", "kind": "inequality", "prompt": "solve",
     "options": None, "correct": "x > 2", "explanation": ""},
    {"identifier": "i-txt", "kind": "short_text", "prompt": "capital",
     "options": None, "correct": "sum|total", "explanation": ""},
    {"identifier": "i-match", "kind": "matching", "prompt": "match",
     "options": ["A", "B"], "correct": json.dumps([["A", "1"], ["B", "2"]]), "explanation": ""},
    {"identifier": "i-plot", "kind": "plot_points", "prompt": "plot",
     "options": None, "correct": json.dumps([[1, 2], [3, 4]]), "explanation": ""},
    {"identifier": "i-work", "kind": "show_work", "prompt": "show work",
     "options": None, "correct": "x=4", "explanation": "steps"},
]


@pytest.mark.parametrize("item", CASES, ids=[c["kind"] for c in CASES])
def test_item_round_trips_without_loss(item):
    restored = qti_to_item(item_to_qti(item))
    assert restored["kind"] == item["kind"]
    assert restored["correct"] == item["correct"]
    assert restored["options"] == item["options"]
    assert restored["explanation"] == item["explanation"]
    assert restored["prompt"] == item["prompt"]


def test_bank_round_trips_every_kind():
    xml = bank_to_qti(CASES)
    restored = qti_to_bank(xml)
    assert len(restored) == len(CASES)
    by_id = {r["identifier"]: r for r in restored}
    for original in CASES:
        r = by_id[original["identifier"]]
        assert r["kind"] == original["kind"]
        assert r["correct"] == original["correct"]
        assert r["options"] == original["options"]


def test_export_emits_native_interactions_for_common_kinds():
    assert "choiceInteraction" in item_to_qti(CASES[0])  # mcq_single
    assert "orderInteraction" in item_to_qti(CASES[3])  # ordering
    assert "textEntryInteraction" in item_to_qti(CASES[4])  # numeric
