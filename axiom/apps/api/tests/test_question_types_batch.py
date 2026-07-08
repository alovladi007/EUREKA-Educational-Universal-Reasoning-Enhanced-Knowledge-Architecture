"""Extended technology-enhanced question types (Build Prompt Section 7 long tail).

Each new kind is graded deterministically by the grading service. These tests
pin the accept/reject behavior and the partial-credit fractions so a regression
in any one grader is caught. CAS-backed kinds (inequality, drag_tokens, cloze)
accept algebraically equivalent forms, not just exact strings.
"""

from __future__ import annotations

import json

from app.domains.grading.service import grade


def test_inequality_accepts_equivalent_and_rejects_boundary_change():
    # 2*x > 4 defines the same solution set as x > 2.
    assert grade("inequality", "2*x > 4", "x > 2").is_correct
    assert grade("inequality", "x > 2", "2 < x").is_correct
    # Strict vs non-strict is a different set: x >= 2 is not x > 2.
    assert not grade("inequality", "x >= 2", "x > 2").is_correct
    # Wrong direction.
    assert not grade("inequality", "x < 2", "x > 2").is_correct


def test_number_line_uses_tolerance():
    assert grade("number_line", "3", "3").is_correct
    assert grade("number_line", "2.51", "2.5", tolerance=0.05).is_correct
    assert not grade("number_line", "2.9", "2.5", tolerance=0.05).is_correct


def test_mixed_number_parses_whole_and_fraction():
    # 2 1/3 == 7/3 == 2.3333...
    assert grade("mixed_number", "2 1/3", "7/3").is_correct
    assert grade("mixed_number", "7/3", "2 1/3").is_correct
    assert grade("mixed_number", "2.3333333", "7/3", tolerance=1e-3).is_correct
    assert not grade("mixed_number", "2 2/3", "7/3").is_correct


def test_units_numeric_converts_before_comparing():
    # 3000 m == 3 km.
    assert grade("units_numeric", "3000 m", "3 km").is_correct
    assert grade("units_numeric", "1500 g", "1.5 kg").is_correct
    # Dimension mismatch is never correct.
    assert not grade("units_numeric", "3 kg", "3 m").is_correct
    # Wrong magnitude.
    assert not grade("units_numeric", "2 km", "3 km").is_correct


def test_cloze_math_partial_and_full_credit():
    key = json.dumps(["2*x", "5"])
    full = grade("cloze_math", key, json.dumps(["x + x", "5"]))
    assert full.is_correct and full.score == 1.0
    half = grade("cloze_math", key, json.dumps(["2*x", "6"]))
    assert not half.is_correct and half.score == 0.5


def test_categorize_sort_scores_each_placement():
    key = json.dumps({"7": "prime", "9": "composite", "2": "prime"})
    perfect = grade("categorize_sort", key, json.dumps({"7": "prime", "9": "composite", "2": "prime"}))
    assert perfect.is_correct and perfect.score == 1.0
    partial = grade("categorize_sort", key, json.dumps({"7": "prime", "9": "prime", "2": "prime"}))
    assert not partial.is_correct
    # Score is rounded to 4 decimal places (2 of 3 correct).
    assert abs(partial.score - 2 / 3) < 1e-3


def test_drag_tokens_accepts_equivalent_assembly():
    # Tokens assemble to 2*x + 1, equivalent to the key regardless of order.
    ok = grade("drag_tokens", "2*x + 1", json.dumps(["1", "+", "2*x"]))
    assert ok.is_correct
    bad = grade("drag_tokens", "2*x + 1", json.dumps(["2*x", "+", "2"]))
    assert not bad.is_correct


def test_table_completion_grades_each_cell():
    key = json.dumps([["1", "2"], ["3", "4"]])
    full = grade("table_completion", key, json.dumps([["1", "2"], ["3", "4"]]))
    assert full.is_correct and full.score == 1.0
    partial = grade("table_completion", key, json.dumps([["1", "2"], ["3", "5"]]))
    assert not partial.is_correct and partial.score == 0.75


def test_numeric_sig_figs_via_meta():
    # 3.14159 rounded to 3 sig figs is 3.14; the answer key 3.14 matches.
    hit = grade("numeric", "3.14", "3.14159", meta={"sig_figs": 3})
    assert hit.is_correct
    miss = grade("numeric", "3.15", "3.14159", meta={"sig_figs": 3})
    assert not miss.is_correct
