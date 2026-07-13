"""Determinant grading (Linear Algebra Unit 6): compare against SymPy det(A).

Any equivalent form is accepted, because the check is symbolic.
"""

from __future__ import annotations

from math_core import grade_determinant, verify_determinant_key


def test_two_by_two():
    assert grade_determinant("-2", [[1, 2], [3, 4]]).is_correct
    assert grade_determinant("6/(-3)", [[1, 2], [3, 4]]).is_correct  # equivalent form
    assert not grade_determinant("2", [[1, 2], [3, 4]]).is_correct


def test_three_by_three_and_triangular():
    # Upper triangular: determinant is the product of the diagonal.
    assert grade_determinant("24", [[2, 5, 1], [0, 3, 7], [0, 0, 4]]).is_correct
    # Singular matrix has determinant 0.
    assert grade_determinant("0", [[1, 2], [2, 4]]).is_correct


def test_verified_everything_gate():
    assert verify_determinant_key([[1, 2], [3, 4]], "-2")
    assert not verify_determinant_key([[1, 2], [3, 4]], "2")


def test_non_square_is_rejected_not_crash():
    assert not grade_determinant("0", [[1, 2, 3], [4, 5, 6]]).is_correct


def test_malformed_answer_is_rejected_not_crash():
    assert not grade_determinant("not a number", [[1, 2], [3, 4]]).is_correct
