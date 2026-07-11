"""Tests for the Engineering Math track linear-algebra graders in math_core.

Mirrors the Unit 1 proof-of-model demo (axiom/tracks/eng_math) against the live
math_core package: verified-everything gate, parameterized 3x3 variants, and the
point / RREF / solution-set graders accepting equivalent forms and rejecting
wrong ones.
"""

from __future__ import annotations

from math_core import (
    generate_unique_3x3,
    grade_rref,
    grade_solution_point,
    grade_solution_set,
    verify_linear_system_key,
    verify_unique_solution,
)


def test_verify_linear_system_key_gate():
    # 2x + y = 5, x - y = 1 -> x=2, y=1 (recomputed by SymPy, not asserted).
    assert verify_linear_system_key([[2, 1], [1, -1]], [5, 1], {"x": "2", "y": "1"})
    assert not verify_linear_system_key([[2, 1], [1, -1]], [5, 1], {"x": "2", "y": "0"})


def test_parameterized_3x3_variants_all_unique():
    for seed in (101, 202, 303):
        A, b, x = generate_unique_3x3(seed, coeff_range=4, sol_range=6)
        assert verify_unique_solution(A, b, x)


def test_solution_point_accepts_equivalent_forms():
    key = {"x": "2", "y": "1"}
    assert grade_solution_point({"x": "4/2", "y": "1+0"}, key).is_correct
    assert not grade_solution_point({"x": "2", "y": "0"}, key).is_correct
    assert not grade_solution_point({"x": "2"}, key).is_correct  # variable set mismatch


def test_rref_any_valid_path_accepted():
    pm = [[1, 2, 1], [2, 4, 0], [1, 1, 3]]
    identity = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    assert grade_rref(identity, pm).is_correct
    assert not grade_rref([[1, 2, 0], [0, 0, 1], [0, 0, 0]], pm).is_correct


def test_solution_set_any_valid_basis_accepted():
    A, b = [[1, 1, 0], [0, 0, 1]], [2, 5]
    assert grade_solution_set(A, b, [2, 0, 5], [[-1, 1, 0]]).is_correct
    # Different particular point + oppositely signed direction = same affine set.
    assert grade_solution_set(A, b, [0, 2, 5], [[1, -1, 0]]).is_correct
    # A direction not in the null space is rejected.
    assert not grade_solution_set(A, b, [2, 0, 5], [[1, 1, 0]]).is_correct
    # A particular point that does not satisfy the system is rejected.
    assert not grade_solution_set(A, b, [0, 0, 0], [[-1, 1, 0]]).is_correct
