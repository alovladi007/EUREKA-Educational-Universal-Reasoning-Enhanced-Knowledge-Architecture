"""Antiderivative grading: verify by differentiation.

Any valid antiderivative passes -- constants of integration and equivalent
forms are all accepted, because F is correct iff F' equals the integrand.
"""

from __future__ import annotations

from math_core import grade_antiderivative, verify_antiderivative_key


def test_basic_and_constant_of_integration():
    assert grade_antiderivative("x*sin(x) + cos(x)", "x*cos(x)").is_correct
    # A different constant of integration is still correct.
    assert grade_antiderivative("x*sin(x) + cos(x) + 7", "x*cos(x)").is_correct
    # Missing a term is wrong.
    assert not grade_antiderivative("x*sin(x)", "x*cos(x)").is_correct


def test_power_and_equivalent_forms():
    assert grade_antiderivative("x**3/3", "x**2").is_correct
    assert grade_antiderivative("(1/3)*x**3 + 5", "x**2").is_correct
    assert not grade_antiderivative("x**3", "x**2").is_correct


def test_trig_equivalent_form():
    # -cos(2x)/4 and sin(x)^2 / 2 are both antiderivatives of sin(x)cos(x).
    assert grade_antiderivative("sin(x)**2/2", "sin(x)*cos(x)").is_correct
    assert grade_antiderivative("-cos(2*x)/4", "sin(x)*cos(x)").is_correct


def test_verified_everything_gate():
    assert verify_antiderivative_key("x**3/3", "x**2")
    assert not verify_antiderivative_key("x**3", "x**2")


def test_malformed_answer_is_rejected_not_crash():
    assert not grade_antiderivative("this is not math", "x**2").is_correct
