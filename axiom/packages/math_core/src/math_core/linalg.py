"""Linear-algebra graders and the verified-everything gate (Engineering Math track).

These are the live-platform math_core versions of the Engineering Mathematics
track's Linear Algebra Unit 1 graders (see axiom/tracks/eng_math for the
self-contained proof-of-model). Every grader is deterministic and SymPy-backed,
and the same verifiers gate an item's answer key before it ships, so no key is
author-asserted.

Graders:
  - grade_solution_point: a solution given as {var: value}; symbolic equivalence.
  - grade_rref: any valid reduction that reaches the unique RREF is accepted.
  - grade_solution_set: an affine solution x = particular + span(directions) of
    A x = b; any valid particular point and any null-space basis is accepted.

Verified-everything gate:
  - generate_unique_3x3 / verify_unique_solution: a parameterized 3x3 integer
    system with a unique integer solution, verified per seeded variant.
  - verify_linear_system_key: recompute a small system's solution and confirm a
    stored key matches.
"""

from __future__ import annotations

import random

import sympy as sp

from .grading import GradeResult


def _ok(detail: str, grader: str = "cas") -> GradeResult:
    return GradeResult(is_correct=True, score=1.0, grader=grader, confidence=1.0, detail=detail)


def _no(detail: str, grader: str = "cas") -> GradeResult:
    return GradeResult(is_correct=False, score=0.0, grader=grader, confidence=1.0, detail=detail)


def _parse(s: str) -> sp.Expr:
    return sp.sympify(str(s), locals={}, evaluate=True)


def _as_rational_vector(values) -> sp.Matrix:
    return sp.Matrix([sp.nsimplify(sp.sympify(v)) for v in values])


# ---------------------------------------------------------------------------
# Grader: solution given as a mapping variable -> value
# ---------------------------------------------------------------------------

def grade_solution_point(response: dict, key: dict) -> GradeResult:
    """Grade a solution mapping; accepts any symbolically equal form (4/2 == 2)."""
    if set(response.keys()) != set(key.keys()):
        return _no("variable set does not match")
    for var, key_val in key.items():
        try:
            diff = sp.simplify(_parse(response[var]) - _parse(key_val))
        except (sp.SympifyError, TypeError, ValueError):
            return _no(f"value for {var} could not be parsed")
        if diff != 0:
            return _no(f"value for {var} is not equivalent")
    return _ok("all variables symbolically equivalent")


# ---------------------------------------------------------------------------
# Grader: reduced row echelon form (unique, so any valid path is accepted)
# ---------------------------------------------------------------------------

def grade_rref(response_matrix: list, problem_matrix: list) -> GradeResult:
    A = sp.Matrix(problem_matrix)
    ref_rref, _ = A.rref()
    R = sp.Matrix(response_matrix)
    if R.shape != ref_rref.shape:
        return _no("matrix shape does not match", grader="exact")
    if sp.simplify(R - ref_rref) == sp.zeros(*ref_rref.shape):
        return _ok("matches unique RREF", grader="exact")
    return _no("not in reduced row echelon form or incorrect", grader="exact")


# ---------------------------------------------------------------------------
# Grader: affine solution-set equality for infinite solution sets
# ---------------------------------------------------------------------------

def _colspace_equal(D1: sp.Matrix, D2: sp.Matrix) -> bool:
    if D1.cols == 0 and D2.cols == 0:
        return True
    if D1.rows != D2.rows:
        return False
    r1, r2 = D1.rank(), D2.rank()
    if r1 != r2:
        return False
    return D1.row_join(D2).rank() == r1


def grade_solution_set(A: list, b: list, particular: list, directions: list) -> GradeResult:
    """Grade x = particular + span(directions) of A x = b.

    Correct iff the particular solution satisfies the system and the direction
    vectors span exactly the null space of A (any valid basis accepted).
    """
    Am = sp.Matrix(A)
    bm = _as_rational_vector(b)
    p = _as_rational_vector(particular)
    if sp.simplify(Am * p - bm) != sp.zeros(Am.rows, 1):
        return _no("particular solution does not satisfy A x = b")

    D_learner = sp.Matrix(directions).T if directions else sp.Matrix(Am.cols, 0, [])
    ns = Am.nullspace()
    if ns:
        D_ref = ns[0]
        for v in ns[1:]:
            D_ref = D_ref.row_join(v)
    else:
        D_ref = sp.Matrix(Am.cols, 0, [])

    if _colspace_equal(D_learner, D_ref):
        return _ok("solution set matches (particular plus null space)")
    return _no("direction vectors do not span the null space")


# ---------------------------------------------------------------------------
# Parameterized template + verified-everything gate
# ---------------------------------------------------------------------------

def generate_unique_3x3(seed: int, coeff_range: int = 4, sol_range: int = 6):
    """Deterministically seed a 3x3 integer system A x = b with a unique integer
    solution (pick x, pick invertible integer A, set b = A x)."""
    rng = random.Random(seed)
    x = sp.Matrix([rng.randint(-sol_range, sol_range) for _ in range(3)])
    while True:
        A = sp.Matrix(3, 3, lambda i, j: rng.randint(-coeff_range, coeff_range))
        if A.det() != 0:
            break
    return A, A * x, x


def verify_unique_solution(A: sp.Matrix, b: sp.Matrix, expected: sp.Matrix) -> bool:
    if A.det() == 0:
        return False
    return sp.simplify(A.solve(b) - expected) == sp.zeros(3, 1)


def verify_linear_system_key(coeffs: list, rhs: list, key: dict) -> bool:
    """Recompute a small linear system's solution and confirm a stored key."""
    A = sp.Matrix(coeffs)
    b = _as_rational_vector(rhs)
    syms = sp.symbols(f"v0:{A.cols}")
    sol = sp.linsolve((A, b), *syms)
    if len(sol) != 1:
        return False
    (point,) = list(sol)
    var_order = list(key.keys())
    if len(var_order) != A.cols:
        return False
    for name, val in zip(var_order, point, strict=True):
        if sp.simplify(val - _parse(key[name])) != 0:
            return False
    return True


# ---------------------------------------------------------------------------
# Grader: eigenvalues and eigenvectors (Linear Algebra Unit 7; ODE systems)
# ---------------------------------------------------------------------------

def grade_eigenvalues(response_values: list, matrix: list) -> GradeResult:
    """Grade a submitted set of eigenvalues against the matrix's true spectrum.

    Correct iff the submitted values match the eigenvalues with multiplicity (as
    a multiset). Any equivalent form is accepted (2, 4/2, sqrt(4) all match),
    because each value is matched by symbolic equality. Order does not matter.
    """
    try:
        A = sp.Matrix(matrix)
    except (TypeError, ValueError):
        return _no("problem matrix could not be parsed")
    if A.rows != A.cols:
        return _no("eigenvalues are only defined for a square matrix")
    try:
        submitted = [sp.nsimplify(sp.sympify(str(v))) for v in response_values]
    except (sp.SympifyError, TypeError, ValueError):
        return _no("could not parse the submitted eigenvalues")

    # Reference spectrum with algebraic multiplicity.
    reference: list = []
    for val, mult in A.eigenvals().items():
        reference.extend([val] * int(mult))
    if len(submitted) != len(reference):
        return _no(
            f"expected {len(reference)} eigenvalue(s) (with multiplicity), "
            f"got {len(submitted)}"
        )

    remaining = list(reference)
    for s in submitted:
        hit = next((r for r in remaining if sp.simplify(s - r) == 0), None)
        if hit is None:
            return _no("a submitted value is not an eigenvalue (or multiplicity is wrong)")
        remaining.remove(hit)
    return _ok("eigenvalues match the spectrum with multiplicity")


def grade_eigenvector(response_vector: list, matrix: list, eigenvalue) -> GradeResult:
    """Grade a submitted eigenvector for a given eigenvalue of the matrix.

    Correct iff the vector is nonzero and (A - lambda I) v = 0, so any nonzero
    scalar multiple of a true eigenvector is accepted.
    """
    try:
        A = sp.Matrix(matrix)
        v = _as_rational_vector(response_vector)
        lam = sp.nsimplify(sp.sympify(str(eigenvalue)))
    except (sp.SympifyError, TypeError, ValueError):
        return _no("could not parse the vector, matrix, or eigenvalue")
    if A.rows != A.cols or v.rows != A.cols:
        return _no("vector length must match the square matrix size")
    if all(sp.simplify(c) == 0 for c in v):
        return _no("the zero vector is never an eigenvector")
    residual = sp.simplify((A - lam * sp.eye(A.rows)) * v)
    if residual == sp.zeros(A.rows, 1):
        return _ok("(A - lambda I) v = 0: a valid eigenvector")
    return _no("(A - lambda I) v is not zero for this eigenvalue")


def verify_eigen_key(matrix: list, eigenvalues: list) -> bool:
    """Verified-everything gate: confirm an authored eigenvalue list is exactly
    the matrix spectrum (with multiplicity) before an item ships."""
    return grade_eigenvalues(eigenvalues, matrix).is_correct
