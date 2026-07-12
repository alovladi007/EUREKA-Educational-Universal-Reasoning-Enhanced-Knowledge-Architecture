"""Engineering Math track (Linear Algebra Unit 1) grading-service item kinds.

matrix_rref, solution_set, and linear_system route through grade() to the
SymPy-backed math_core linear-algebra graders. Any valid form or reduction path
is accepted; wrong answers are rejected. Problem data comes from Item.meta.
"""

from __future__ import annotations

import json

from app.domains.grading.service import grade

_PROBLEM = [[1, 2, 1], [2, 4, 0], [1, 1, 3]]  # RREF is the 3x3 identity


def test_matrix_rref_accepts_correct_rejects_wrong():
    good = grade(
        "matrix_rref", "", json.dumps([[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
        meta={"problem_matrix": _PROBLEM},
    )
    assert good.is_correct
    bad = grade(
        "matrix_rref", "", json.dumps([[1, 2, 0], [0, 0, 1], [0, 0, 0]]),
        meta={"problem_matrix": _PROBLEM},
    )
    assert not bad.is_correct


def test_linear_system_symbolic_equivalence():
    key = {"key": {"x": "2", "y": "1"}}
    # 4/2 and 1+0 are 2 and 1 in disguise -> accepted (not string match).
    assert grade("linear_system", "", json.dumps({"x": "4/2", "y": "1+0"}), meta=key).is_correct
    assert not grade("linear_system", "", json.dumps({"x": "2", "y": "0"}), meta=key).is_correct


def test_solution_set_any_valid_basis():
    cfg = {"A": [[1, 1, 0], [0, 0, 1]], "b": [2, 5]}
    # A different particular point and an oppositely-signed direction: same set.
    assert grade(
        "solution_set", "", json.dumps({"particular": [0, 2, 5], "directions": [[1, -1, 0]]}),
        meta=cfg,
    ).is_correct
    # A direction not in the null space is rejected.
    assert not grade(
        "solution_set", "", json.dumps({"particular": [2, 0, 5], "directions": [[1, 1, 0]]}),
        meta=cfg,
    ).is_correct


def test_malformed_answers_are_rejected_not_crash():
    assert not grade("matrix_rref", "", "not json", meta={"problem_matrix": _PROBLEM}).is_correct
    assert not grade("linear_system", "", "[]", meta={"key": {"x": "1"}}).is_correct
    assert not grade("solution_set", "", "null", meta={"A": [[1]], "b": [0]}).is_correct
