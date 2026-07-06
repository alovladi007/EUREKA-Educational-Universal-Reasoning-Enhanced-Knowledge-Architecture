"""Tests for worked-solution generation and verification."""

from __future__ import annotations

from math_core import linear_equation_steps, verify_steps


def test_verify_steps_accepts_a_valid_chain():
    check = verify_steps(["2*x + 3 = 11", "2*x = 8", "x = 4"])
    assert check.ok is True
    assert all(step.verified for step in check.steps)


def test_verify_steps_flags_a_broken_step():
    check = verify_steps(["2*x + 3 = 11", "2*x = 9", "x = 4"])
    assert check.ok is False
    # The first line is given; the broken second line is not verified.
    assert check.steps[0].verified is True
    assert check.steps[1].verified is False


def test_verify_steps_works_on_plain_expressions():
    check = verify_steps(["2*(x + 1)", "2*x + 2"])
    assert check.ok is True


def test_linear_equation_steps_are_generated_and_verified():
    steps = linear_equation_steps("2*x + 3 = 11")
    assert steps is not None
    assert steps[0] == "2*x + 3 = 11"
    assert steps[-1].replace(" ", "") == "x=4"
    # The generated chain must itself verify.
    assert verify_steps(steps).ok is True


def test_non_linear_equation_returns_none():
    assert linear_equation_steps("x^2 = 4") is None
    assert linear_equation_steps("x + y = 3") is None
    assert linear_equation_steps("not an equation") is None
