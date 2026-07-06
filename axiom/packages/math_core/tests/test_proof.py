"""Tests for the deterministic counterexample checker (Extension 4.2)."""

from __future__ import annotations

from math_core import check_counterexample


def test_valid_counterexample_satisfies_predicate():
    # False claim: "for all n, n^2 > n". A counterexample satisfies n^2 <= n.
    # Any n in (0, 1), e.g. 1/2, breaks it; n = 1 makes n^2 = n.
    assert check_counterexample("1/2", "n**2 <= n", "n") is True
    assert check_counterexample("0.5", "n^2 <= n", "n") is True
    assert check_counterexample("1", "n**2 <= n", "n") is True


def test_non_counterexample_fails_predicate():
    # n = 2 does not break the claim: 4 > 2, so n^2 <= n is false.
    assert check_counterexample("2", "n**2 <= n", "n") is False
    assert check_counterexample("3", "n**2 <= n", "n") is False


def test_custom_variable_name():
    # Claim "every prime is odd" is false at x = 2; predicate: x is even prime.
    assert check_counterexample("2", "Eq(x, 2)", "x") is True
    assert check_counterexample("3", "Eq(x, 2)", "x") is False


def test_bad_input_is_a_non_match_not_an_error():
    assert check_counterexample("", "n**2 <= n", "n") is False
    assert check_counterexample("nonsense((", "n**2 <= n", "n") is False
    assert check_counterexample("2", "not a predicate ((", "n") is False
