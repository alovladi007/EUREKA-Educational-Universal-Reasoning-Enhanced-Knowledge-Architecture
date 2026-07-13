"""Step-credit grading with error localization: solution-set preservation.

Any legal algebraic move is accepted; the first line that changes the solution
set is reported as where the error entered.
"""

from __future__ import annotations

from math_core import grade_steps


def test_clean_derivation_all_valid():
    lines = [
        "2*x + y = 5; x - y = 1",
        "3*x = 6; x - y = 1",
        "x = 2; x - y = 1",
        "x = 2; y = 1",
    ]
    r = grade_steps(lines, ["x", "y"], final_key={"x": "2", "y": "1"})
    assert r.is_correct and r.score == 1.0
    assert "all steps valid" in r.detail


def test_error_is_localized_to_first_bad_line():
    # Line 3 introduces a wrong final answer (y = 3, not 1).
    lines = [
        "2*x + y = 5; x - y = 1",
        "3*x = 6; x - y = 1",
        "x = 2; x - y = 1",
        "x = 2; y = 3",
    ]
    r = grade_steps(lines, ["x", "y"], final_key={"x": "2", "y": "1"})
    assert not r.is_correct
    assert "first error at line 3" in r.detail
    assert 0.0 < r.score < 1.0  # partial credit for the valid prefix


def test_illegal_move_changes_solution_set():
    # Multiplying the first equation by 0 destroys information at line 1.
    lines = ["x + y = 4", "0 = 0", "x = 2; y = 2"]
    r = grade_steps(lines, ["x", "y"], final_key={"x": "2", "y": "2"})
    assert not r.is_correct
    assert "first error at line 1" in r.detail


def test_unparseable_line_is_first_error():
    r = grade_steps(["x + y = 4", "this is not an equation"], ["x", "y"])
    assert not r.is_correct and "first error at line 1" in r.detail
