"""Fourier transform grading (PDE/Fourier Unit 2).

SymPy convention F(k) = integral f(x) e^{-2 pi i k x} dx. Any equivalent closed
form is accepted (symbolic equality with a numeric fallback).
"""

from __future__ import annotations

from math_core import grade_fourier_transform, verify_fourier_transform_key


def test_forward_standard_signals():
    assert grade_fourier_transform("sqrt(pi)*exp(-pi**2*k**2)", "exp(-x**2)").is_correct
    assert grade_fourier_transform("2/(1 + 4*pi**2*k**2)", "exp(-Abs(x))").is_correct
    assert grade_fourier_transform("1", "DiracDelta(x)").is_correct


def test_forward_rejects_wrong_answer():
    # Missing the sqrt(pi) normalization.
    assert not grade_fourier_transform("exp(-pi**2*k**2)", "exp(-x**2)").is_correct


def test_inverse_round_trip():
    assert grade_fourier_transform(
        "exp(-x**2)", "sqrt(pi)*exp(-pi**2*k**2)", direction="inverse"
    ).is_correct


def test_verified_everything_gate():
    assert verify_fourier_transform_key("sqrt(pi)*exp(-pi**2*k**2)", "exp(-x**2)")
    assert not verify_fourier_transform_key("exp(-pi**2*k**2)", "exp(-x**2)")


def test_malformed_answer_is_rejected_not_crash():
    assert not grade_fourier_transform("this is not math", "exp(-x**2)").is_correct
