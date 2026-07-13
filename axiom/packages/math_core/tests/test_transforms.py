"""Laplace transform grading: compare against the SymPy-computed reference.

Any equivalent closed form is accepted, because grading simplifies the
difference to zero (with a numeric fallback) rather than matching one string.
"""

from __future__ import annotations

from math_core import grade_laplace, verify_laplace_key


def test_forward_basic_pairs():
    assert grade_laplace("1/(s-3)", "exp(3*t)").is_correct
    assert grade_laplace("2/s**3", "t**2").is_correct
    assert grade_laplace("2/(s**2+4)", "sin(2*t)").is_correct
    assert grade_laplace("s/(s**2+1)", "cos(t)").is_correct


def test_forward_accepts_equivalent_forms():
    # (s-3)**-1 is the same as 1/(s-3).
    assert grade_laplace("(s-3)**(-1)", "exp(3*t)").is_correct
    # A wrong sign is rejected.
    assert not grade_laplace("1/(s+3)", "exp(3*t)").is_correct


def test_inverse_basic_pairs():
    assert grade_laplace("exp(3*t)", "1/(s-3)", direction="inverse").is_correct
    assert grade_laplace("sin(2*t)", "2/(s**2+4)", direction="inverse").is_correct
    assert grade_laplace("t*exp(-t)", "1/(s+1)**2", direction="inverse").is_correct
    assert grade_laplace("cos(t)", "s/(s**2+1)", direction="inverse").is_correct


def test_inverse_rejects_wrong_answer():
    assert not grade_laplace("cos(2*t)", "2/(s**2+4)", direction="inverse").is_correct


def test_verified_everything_gate():
    assert verify_laplace_key("1/(s-3)", "exp(3*t)")
    assert verify_laplace_key("exp(3*t)", "1/(s-3)", direction="inverse")
    assert not verify_laplace_key("1/(s+3)", "exp(3*t)")


def test_malformed_answer_is_rejected_not_crash():
    assert not grade_laplace("this is not math", "exp(3*t)").is_correct
