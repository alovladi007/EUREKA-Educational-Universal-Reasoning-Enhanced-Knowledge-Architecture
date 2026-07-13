"""Fourier series coefficient grading: compare against SymPy exact integration.

Any equivalent closed form is accepted; the function may be a Piecewise.
"""

from __future__ import annotations

from math_core import grade_fourier_coefficient, verify_fourier_key

SQUARE = "Piecewise((-1, x < 0), (1, True))"  # odd square wave on (-pi, pi)


def test_square_wave_sine_coefficients():
    assert grade_fourier_coefficient("4/pi", SQUARE, "pi", "b", 1).is_correct
    assert grade_fourier_coefficient("0", SQUARE, "pi", "b", 2).is_correct     # even harmonics vanish
    assert grade_fourier_coefficient("4/(3*pi)", SQUARE, "pi", "b", 3).is_correct
    # An odd function has zero cosine terms and zero mean.
    assert grade_fourier_coefficient("0", SQUARE, "pi", "a0", 0).is_correct
    assert grade_fourier_coefficient("0", SQUARE, "pi", "a", 1).is_correct


def test_square_wave_wrong_answer():
    assert not grade_fourier_coefficient("2/pi", SQUARE, "pi", "b", 1).is_correct


def test_sawtooth_sine_coefficients():
    # f(x) = x on (-pi, pi): b_n = 2 (-1)^{n+1} / n.
    assert grade_fourier_coefficient("2", "x", "pi", "b", 1).is_correct
    assert grade_fourier_coefficient("-1", "x", "pi", "b", 2).is_correct
    assert grade_fourier_coefficient("2/3", "x", "pi", "b", 3).is_correct


def test_even_function_cosine_coefficients():
    # f(x) = x^2 on (-pi, pi): a0 = 2 pi^2 / 3, a_n = 4 (-1)^n / n^2.
    assert grade_fourier_coefficient("2*pi**2/3", "x**2", "pi", "a0", 0).is_correct
    assert grade_fourier_coefficient("-4", "x**2", "pi", "a", 1).is_correct
    assert grade_fourier_coefficient("1", "x**2", "pi", "a", 2).is_correct


def test_accepts_equivalent_forms():
    # 4/pi and 8/(2 pi) are the same value.
    assert grade_fourier_coefficient("8/(2*pi)", SQUARE, "pi", "b", 1).is_correct


def test_verified_everything_gate():
    assert verify_fourier_key("4/pi", SQUARE, "pi", "b", 1)
    assert not verify_fourier_key("2/pi", SQUARE, "pi", "b", 1)


def test_malformed_answer_is_rejected_not_crash():
    assert not grade_fourier_coefficient("this is not math", SQUARE, "pi", "b", 1).is_correct


def test_general_formula_symbolic_n():
    # Sawtooth f = x: the general sine coefficient is b_n = 2(-1)^{n+1}/n.
    assert grade_fourier_coefficient("2*(-1)**(n+1)/n", "x", "pi", "b", "n").is_correct
    # An equivalent form of the same general formula.
    assert grade_fourier_coefficient("-2*(-1)**n/n", "x", "pi", "b", "n").is_correct
    # A wrong general formula (missing the alternating sign) fails.
    assert not grade_fourier_coefficient("2/n", "x", "pi", "b", "n").is_correct
    # x^2 (even): general cosine coefficient a_n = 4(-1)^n/n^2.
    assert grade_fourier_coefficient("4*(-1)**n/n**2", "x**2", "pi", "a", "n").is_correct
