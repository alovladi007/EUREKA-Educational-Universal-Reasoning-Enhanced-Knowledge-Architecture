"""Tests for the grading module: CAS, numeric, and equation graders."""

from __future__ import annotations

import math

import pytest

from math_core import (
    GradeResult,
    grade_equation,
    grade_expression,
    grade_numeric,
    symbolic_equal,
)


def test_result_is_pydantic_model() -> None:
    res = grade_expression("x", "x")
    assert isinstance(res, GradeResult)
    assert res.score == 1.0
    assert 0.0 <= res.confidence <= 1.0
    assert res.grader in ("cas", "exact", "numeric")


@pytest.mark.parametrize(
    "student,expected",
    [
        ("2*x + 2", "2*(x+1)"),
        ("1/2", "0.5"),
        ("sin(x)**2 + cos(x)**2", "1"),
        ("(x**2-1)/(x-1)", "x+1"),
        ("sqrt(8)", "2*sqrt(2)"),
        ("sqrt(x**2)", "Abs(x)"),
        ("(a+b)**2", "a**2 + 2*a*b + b**2"),
    ],
)
def test_equivalent_forms_grade_correct(student: str, expected: str) -> None:
    res = grade_expression(student, expected)
    assert res.is_correct is True, res.detail
    assert res.score == 1.0
    assert symbolic_equal(student, expected) is True


@pytest.mark.parametrize(
    "student,expected",
    [
        ("2*x + 3", "2*(x+1)"),
        ("1/3", "0.5"),
        ("sin(x)**2 - cos(x)**2", "1"),
        ("x - 1", "x + 1"),
        ("sqrt(9)", "2*sqrt(2)"),
    ],
)
def test_wrong_answers_grade_incorrect(student: str, expected: str) -> None:
    res = grade_expression(student, expected)
    assert res.is_correct is False, res.detail
    assert res.score == 0.0


def test_parse_error_is_not_raised() -> None:
    # A malformed expression must yield a GradeResult, not raise.
    res = grade_expression("2*x +", "2*x")
    assert isinstance(res, GradeResult)
    assert res.is_correct is False
    assert "parse" in res.detail.lower() or "not equivalent" in res.detail.lower()
    # symbolic_equal must also never raise.
    assert symbolic_equal("2*x +", "2*x") is False


def test_require_form_factored_accepts_factored() -> None:
    res = grade_expression("(x-1)*(x+1)", "x**2-1", require_form="factored")
    assert res.is_correct is True, res.detail
    assert res.score == 1.0


def test_require_form_factored_rejects_expanded() -> None:
    res = grade_expression("x**2-1", "x**2-1", require_form="factored")
    assert res.is_correct is False, res.detail
    assert "form" in res.detail.lower()


def test_require_form_expanded() -> None:
    ok = grade_expression("x**2 + 2*x + 1", "(x+1)**2", require_form="expanded")
    assert ok.is_correct is True, ok.detail

    bad = grade_expression("(x+1)**2", "(x+1)**2", require_form="expanded")
    assert bad.is_correct is False, bad.detail


def test_numeric_within_tolerance() -> None:
    res = grade_numeric("3.14159", "pi", rtol=1e-4, atol=1e-9)
    assert res.is_correct is True, res.detail

    # Tighter tolerance should reject the truncated value.
    strict = grade_numeric("3.14159", "pi", rtol=1e-9, atol=1e-12)
    assert strict.is_correct is False, strict.detail


def test_numeric_outside_tolerance() -> None:
    res = grade_numeric("3.20", "pi", rtol=1e-6, atol=1e-9)
    assert res.is_correct is False, res.detail


def test_numeric_exact_match() -> None:
    res = grade_numeric("2+2", "4")
    assert res.is_correct is True


def test_numeric_sig_figs() -> None:
    # pi to 3 sig figs is 3.14; student 3.14 should match with sig_figs=3.
    res = grade_numeric("3.14", "pi", sig_figs=3, rtol=1e-6, atol=1e-6)
    assert res.is_correct is True, res.detail


def test_numeric_parse_error_no_raise() -> None:
    res = grade_numeric("3.14 +", "pi")
    assert res.is_correct is False
    assert isinstance(res, GradeResult)


def test_equation_scalar_multiple_equal() -> None:
    res = grade_equation("y = 2*x + 4", "2*y = 4*x + 8")
    assert res.is_correct is True, res.detail
    assert res.score == 1.0


def test_equation_implicit_multiplication_equal() -> None:
    # "2x" should parse via implicit multiplication to 2*x.
    res = grade_equation("y = 2x + 4", "2y = 4x + 8")
    assert res.is_correct is True, res.detail


def test_equation_not_equal() -> None:
    res = grade_equation("y = 2*x + 4", "y = 2*x + 5")
    assert res.is_correct is False, res.detail


def test_equation_same_line_different_writing() -> None:
    res = grade_equation("x + y = 1", "2*x + 2*y = 2")
    assert res.is_correct is True, res.detail


def test_equation_parse_error_no_raise() -> None:
    res = grade_equation("y == 2*x", "y = 2*x")
    assert res.is_correct is False
    assert isinstance(res, GradeResult)


def test_sanity_math_constant() -> None:
    # Guard against import shadowing of math in the module namespace.
    assert math.isclose(math.pi, 3.141592653589793)
