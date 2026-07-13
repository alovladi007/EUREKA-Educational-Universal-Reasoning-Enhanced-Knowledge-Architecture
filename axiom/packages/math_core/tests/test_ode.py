"""ODE solution grading: verify a proposed solution satisfies the equation.

Any equivalent form and any name for the arbitrary constant is accepted, because
grading substitutes the solution into the ODE residual and checks it is zero.
"""

from __future__ import annotations

from math_core import grade_ode, verify_ode_key


def test_separable_general_solution_and_constant_naming():
    # dy/dx = 2xy  ->  residual yp - 2*x*y ; general solution y = C exp(x^2).
    assert grade_ode("C*exp(x**2)", "yp - 2*x*y").is_correct
    # The arbitrary constant may be named anything.
    assert grade_ode("k*exp(x**2)", "yp - 2*x*y").is_correct
    # A wrong exponent does not satisfy the equation.
    assert not grade_ode("C*exp(x)", "yp - 2*x*y").is_correct


def test_first_order_linear_general_solution():
    # dy/dx + y = x  ->  residual yp + y - x ; solution y = x - 1 + C exp(-x).
    assert grade_ode("x - 1 + C*exp(-x)", "yp + y - x").is_correct
    # Losing the -1 (a common error) fails the check.
    assert not grade_ode("x + C*exp(-x)", "yp + y - x").is_correct


def test_second_order_general_and_particular_members():
    # y'' - y = 0  ->  residual ypp - y.
    assert grade_ode("C1*exp(x) + C2*exp(-x)", "ypp - y").is_correct
    # cosh(x) is a particular member of the family and also satisfies the ODE.
    assert grade_ode("cosh(x)", "ypp - y").is_correct
    assert not grade_ode("sin(x)", "ypp - y").is_correct


def test_leading_y_equals_is_stripped():
    assert grade_ode("y = C*exp(x**2)", "yp - 2*x*y").is_correct


def test_verified_everything_gate():
    assert verify_ode_key("x - 1 + C*exp(-x)", "yp + y - x")
    assert not verify_ode_key("x + C*exp(-x)", "yp + y - x")


def test_malformed_solution_is_rejected_not_crash():
    assert not grade_ode("this is not math", "yp - y").is_correct


def test_general_solution_requires_the_right_constants():
    # order=1: the general solution needs exactly one arbitrary constant.
    assert grade_ode("C*exp(x**2)", "yp - 2*x*y", order=1).is_correct
    # Dropping the constant leaves a particular member, not the general solution.
    assert not grade_ode("exp(x**2)", "yp - 2*x*y", order=1).is_correct


def test_repeated_root_needs_both_basis_terms():
    # y'' - 4y' + 4y = 0 has a repeated root 2; the general solution is
    # (C1 + C2 x) e^{2x}. e^{2x} alone satisfies the ODE but is NOT general.
    assert grade_ode("(C1 + C2*x)*exp(2*x)", "ypp - 4*yp + 4*y", order=2).is_correct
    assert not grade_ode("C1*exp(2*x)", "ypp - 4*yp + 4*y", order=2).is_correct


def test_second_order_general_forms_accepted():
    assert grade_ode("C1*exp(x) + C2*exp(-x)", "ypp - y", order=2).is_correct
    assert grade_ode("C1*cos(x) + C2*sin(x)", "ypp + y", order=2).is_correct
    # Two independent constants are required for a second-order general solution.
    assert not grade_ode("C1*cos(x)", "ypp + y", order=2).is_correct


def test_initial_value_problem():
    # y'' + y = 0, y(0) = 3, y'(0) = 0  ->  y = 3 cos(x).
    ic = {"y(0)": "3", "y'(0)": "0"}
    assert grade_ode("3*cos(x)", "ypp + y", initial_conditions=ic).is_correct
    # A response still carrying an arbitrary constant is not a particular solution.
    assert not grade_ode("C1*cos(x) + C2*sin(x)", "ypp + y", initial_conditions=ic).is_correct
    # Satisfies the ODE but not the initial conditions.
    assert not grade_ode("3*sin(x)", "ypp + y", initial_conditions=ic).is_correct
    # First-order IVP: y' = y, y(0) = 2  ->  y = 2 e^x.
    assert grade_ode("2*exp(x)", "yp - y", initial_conditions={"y(0)": "2"}).is_correct
    assert not grade_ode("exp(x)", "yp - y", initial_conditions={"y(0)": "2"}).is_correct
