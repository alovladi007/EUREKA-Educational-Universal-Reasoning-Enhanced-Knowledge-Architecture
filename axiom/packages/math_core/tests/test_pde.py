"""PDE solution grading: verify by substitution into the residual.

Heat, wave, and Laplace equations; any equivalent form passes.
"""

from __future__ import annotations

from math_core import grade_pde, verify_pde_key


def test_heat_equation_separated_solution():
    # u_t = u_xx: the separated mode e^{-pi^2 t} sin(pi x).
    assert grade_pde("exp(-pi**2*t)*sin(pi*x)", "ut - uxx").is_correct
    # Wrong decay rate does not satisfy the equation.
    assert not grade_pde("exp(-t)*sin(pi*x)", "ut - uxx").is_correct
    # A scaled mode (any constant) still solves the linear PDE.
    assert grade_pde("5*exp(-pi**2*t)*sin(pi*x)", "ut - uxx").is_correct


def test_heat_equation_with_diffusivity():
    # u_t = 2 u_xx: the decay rate must match k = 2.
    assert grade_pde("exp(-2*pi**2*t)*sin(pi*x)", "ut - 2*uxx").is_correct
    assert not grade_pde("exp(-pi**2*t)*sin(pi*x)", "ut - 2*uxx").is_correct


def test_wave_equation_dalembert():
    # u_tt = u_xx: any traveling wave f(x - t) or g(x + t), or a sum.
    assert grade_pde("sin(x - t)", "utt - uxx").is_correct
    assert grade_pde("sin(x - t) + cos(x + t)", "utt - uxx").is_correct
    assert grade_pde("(x - t)**3", "utt - uxx").is_correct
    assert not grade_pde("sin(x - 2*t)", "utt - uxx").is_correct  # wrong speed
    # u_tt = 4 u_xx (c = 2): speed-2 waves work.
    assert grade_pde("sin(x - 2*t)", "utt - 4*uxx").is_correct


def test_laplace_equation_harmonic():
    # u_xx + u_yy = 0: harmonic functions pass, non-harmonic fail.
    assert grade_pde("x**2 - y**2", "uxx + uyy").is_correct
    assert grade_pde("exp(x)*cos(y)", "uxx + uyy").is_correct
    assert not grade_pde("x**2 + y**2", "uxx + uyy").is_correct


def test_leading_u_equals_is_stripped():
    assert grade_pde("u = sin(x - t)", "utt - uxx").is_correct
    assert grade_pde("u(x,t) = sin(x - t)", "utt - uxx").is_correct


def test_verified_everything_gate():
    assert verify_pde_key("exp(-pi**2*t)*sin(pi*x)", "ut - uxx")
    assert not verify_pde_key("exp(-t)*sin(pi*x)", "ut - uxx")


def test_malformed_answer_is_rejected_not_crash():
    assert not grade_pde("this is not math", "ut - uxx").is_correct
