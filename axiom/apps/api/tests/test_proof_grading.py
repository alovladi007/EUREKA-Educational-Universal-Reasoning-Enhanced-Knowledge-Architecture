"""Curriculum & Proof Extension, Wave B: structured / scaffolded proof graders.

Every grader here is deterministic and auto-gradable (Section 4.2). The headline
checks map onto the Section 10 acceptance criteria: proof assembly grades a
correct ordering as full credit and a wrong ordering as partial or zero, and a
counterexample is accepted only when it actually breaks the property.
"""

from __future__ import annotations

import json

from app.domains.grading.service import grade


def test_proof_assembly_full_and_partial_credit():
    steps = ["Assume n is even", "Then n = 2k", "So n^2 = 4k^2", "Hence n^2 is even"]
    key = json.dumps(steps)

    correct = grade("proof_assembly", key, json.dumps(steps))
    assert correct.is_correct and correct.score == 1.0
    assert correct.grader == "structured"

    # Swap the middle two: two of four stay in place -> partial, not correct.
    shuffled = [steps[0], steps[2], steps[1], steps[3]]
    partial = grade("proof_assembly", key, json.dumps(shuffled))
    assert not partial.is_correct
    assert 0.0 < partial.score < 1.0

    reversed_order = grade("proof_assembly", key, json.dumps(list(reversed(steps))))
    assert not reversed_order.is_correct


def test_justification_matching_partial_credit():
    key = json.dumps([
        ["n = 2k", "definition of even"],
        ["n^2 = 4k^2", "substitution"],
        ["n^2 is even", "definition of even"],
    ])
    perfect = grade("justification_matching", key, key)
    assert perfect.is_correct and perfect.score == 1.0

    wrong_one = grade("justification_matching", key, json.dumps([
        ["n = 2k", "definition of even"],
        ["n^2 = 4k^2", "definition of odd"],   # wrong justification
        ["n^2 is even", "definition of even"],
    ]))
    assert not wrong_one.is_correct
    assert wrong_one.score == round(2 / 3, 4)  # two of three justified


def test_proof_gap_fill_cas_and_text_gaps():
    # Gap 1 is algebraic (CAS-checked; equivalent forms pass); gap 2 is a named
    # justification (text-checked). Text gaps list accepted phrasings, as an
    # author would, so an equivalent phrasing still counts.
    meta = {
        "gaps": [
            ["2*k^2", "2*(k**2)"],
            ["definition of even", "the definition of even"],
        ]
    }
    good = grade(
        "proof_gap_fill", "", json.dumps(["2*k*k", "the definition of even"]), meta=meta
    )
    assert good.is_correct and good.score == 1.0

    half = grade("proof_gap_fill", "", json.dumps(["2*k*k", "wrong reason"]), meta=meta)
    assert not half.is_correct and abs(half.score - 0.5) < 1e-6


def test_find_the_error_matches_the_invalid_step_index():
    right = grade("find_the_error", "2", "2")
    assert right.is_correct and right.score == 1.0

    as_json = grade("find_the_error", "2", json.dumps({"index": 2, "explanation": "div by 0"}))
    assert as_json.is_correct

    wrong = grade("find_the_error", "2", "1")
    assert not wrong.is_correct and wrong.score == 0.0


def test_counterexample_predicate_and_accepted_modes():
    # Predicate mode: valid counterexample breaks "for all n, n^2 > n".
    meta = {"predicate": "n**2 <= n", "var": "n"}
    assert grade("counterexample", "", "1/2", meta=meta).is_correct
    assert not grade("counterexample", "", "2", meta=meta).is_correct

    # Accepted-set mode: match a known counterexample by CAS/text.
    meta2 = {"accepted": ["1/2", "0.5"]}
    assert grade("counterexample", "", "0.50", meta=meta2).is_correct
    assert not grade("counterexample", "", "9", meta=meta2).is_correct


def test_state_definition_accepted_and_keyword_coverage():
    accepted = "A prime is an integer greater than 1 whose only divisors are 1 and itself"
    exact = grade("state_definition", accepted, accepted)
    assert exact.is_correct and exact.score == 1.0

    meta = {"keywords": ["integer", "greater than 1", "divisors", "itself"]}
    near = grade(
        "state_definition",
        accepted,
        "an integer greater than 1 whose divisors are only 1 and itself",
        meta=meta,
    )
    # High keyword coverage passes deterministically; low coverage needs review.
    assert near.is_correct
    low = grade("state_definition", accepted, "a special number", meta=meta)
    assert not low.is_correct and low.confidence < 0.9
