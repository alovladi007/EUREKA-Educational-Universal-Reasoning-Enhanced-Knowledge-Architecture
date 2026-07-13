"""Eigenvalue / eigenvector grading (Linear Algebra Unit 7; ODE systems).

Eigenvalues are matched as a multiset (order-independent, any equivalent form);
eigenvectors are graded by (A - lambda I) v = 0, so any nonzero scalar multiple
of a true eigenvector is accepted.
"""

from __future__ import annotations

from math_core import grade_eigenvalues, grade_eigenvector, verify_eigen_key


def test_eigenvalues_diagonal_and_order_free():
    A = [[2, 0], [0, 3]]
    assert grade_eigenvalues([2, 3], A).is_correct
    assert grade_eigenvalues([3, 2], A).is_correct   # order does not matter
    assert grade_eigenvalues(["4/2", 3], A).is_correct  # equivalent form
    assert not grade_eigenvalues([2, 2], A).is_correct  # wrong multiset
    assert not grade_eigenvalues([2], A).is_correct     # wrong count


def test_eigenvalues_repeated_root_multiplicity():
    A = [[2, 1], [0, 2]]  # defective: eigenvalue 2 with algebraic multiplicity 2
    assert grade_eigenvalues([2, 2], A).is_correct
    assert not grade_eigenvalues([2], A).is_correct  # multiplicity matters


def test_eigenvalues_companion_matrix():
    A = [[0, 1], [-2, -3]]  # eigenvalues -1, -2
    assert grade_eigenvalues([-1, -2], A).is_correct
    assert not grade_eigenvalues([1, 2], A).is_correct


def test_eigenvector_accepts_any_scaling():
    A = [[0, 1], [-2, -3]]
    # For lambda = -1, an eigenvector is (1, -1); any nonzero multiple works.
    assert grade_eigenvector([1, -1], A, -1).is_correct
    assert grade_eigenvector([2, -2], A, -1).is_correct
    assert grade_eigenvector([-3, 3], A, -1).is_correct
    # Wrong vector for this eigenvalue.
    assert not grade_eigenvector([1, 1], A, -1).is_correct
    # The zero vector is never an eigenvector.
    assert not grade_eigenvector([0, 0], A, -1).is_correct


def test_eigenvector_failure_modes_are_distinguished():
    A = [[0, 1], [-2, -3]]  # eigenvalues -1, -2
    # Right eigenvalue (-1 is real), but the vector is not in its eigenspace.
    r1 = grade_eigenvector([1, 1], A, -1)
    assert not r1.is_correct and "not in its eigenspace" in r1.detail
    # 5 is not an eigenvalue at all -- a different misconception.
    r2 = grade_eigenvector([1, 1], A, 5)
    assert not r2.is_correct and "not an eigenvalue" in r2.detail


def test_verified_everything_gate():
    A = [[2, 0], [0, 3]]
    assert verify_eigen_key(A, [2, 3])
    assert not verify_eigen_key(A, [2, 2])


def test_non_square_is_rejected_not_crash():
    assert not grade_eigenvalues([1], [[1, 2, 3], [4, 5, 6]]).is_correct
