"""Acceptance (Phase 1): a math item that accepts several equivalent correct
forms grades all of them correctly through SymPy, and rejects wrong answers."""

from __future__ import annotations

from app.domains.grading.service import grade


def test_math_expression_accepts_equivalent_forms():
    key = "2*x + 2"
    for student in ["2*x + 2", "2*(x+1)", "2 + 2*x", "2*x+2", "x*2 + 2"]:
        outcome = grade("math_expression", key, student)
        assert outcome.is_correct, f"expected {student} to be correct"
        assert outcome.grader == "cas"


def test_math_expression_rejects_wrong():
    assert not grade("math_expression", "2*x + 2", "2*x + 3").is_correct
    assert not grade("math_expression", "8*x", "7*x").is_correct


def test_math_expression_simplification_equivalence():
    # (x^2 - 1)/(x - 1) simplifies to x + 1.
    assert grade("math_expression", "x + 1", "(x**2 - 1)/(x - 1)").is_correct


def test_numeric_tolerance():
    assert grade("numeric", "10", "10").is_correct
    assert grade("numeric", "0.75", "0.75").is_correct
    assert not grade("numeric", "10", "11").is_correct


def test_mcq_single():
    options = ["-8", "-2", "2", "8"]
    assert grade("mcq_single", "2", "2", options=options).is_correct  # index 2
    assert not grade("mcq_single", "2", "0", options=options).is_correct


def test_equation_equivalent_forms():
    # y = 2x + 4 and 2y = 4x + 8 describe the same line.
    assert grade("equation", "y = 2*x + 4", "2*y = 4*x + 8").is_correct
    assert not grade("equation", "y = 2*x + 4", "y = 2*x + 5").is_correct
