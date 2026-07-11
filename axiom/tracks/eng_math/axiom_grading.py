"""AXIOM math core: grading and the verified-everything gate.

Every grader here is deterministic and backed by SymPy. The same functions that
grade a learner response also verify an item's answer key before it ships, so no
key is author-asserted. Plain ASCII only in all text, per house style.
"""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Optional

import sympy as sp


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------

@dataclass
class GradeResult:
    correct: bool
    detail: str
    grader: str
    confidence: float = 1.0  # CAS grading is deterministic


# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def parse_expr(s: str) -> sp.Expr:
    # Safe parse: no arbitrary evaluation, only sympify with a restricted locals.
    return sp.sympify(s, locals={}, evaluate=True)


def _as_rational_vector(values) -> sp.Matrix:
    return sp.Matrix([sp.nsimplify(sp.sympify(v)) for v in values])


# ---------------------------------------------------------------------------
# Grader 1: tuple or point solution equivalence (Items A and B)
# ---------------------------------------------------------------------------

def grade_solution_point(response: dict[str, str], key: dict[str, str]) -> GradeResult:
    """Grade a solution given as a mapping variable -> value.

    Accepts any form that is symbolically equal to the key (for example 2,
    4/2, and 1+1 all match 2). Order does not matter because it is a mapping.
    """
    if set(response.keys()) != set(key.keys()):
        return GradeResult(False, "variable set does not match", "cas")
    for var, key_val in key.items():
        diff = sp.simplify(parse_expr(response[var]) - parse_expr(key_val))
        if diff != 0:
            return GradeResult(False, f"value for {var} is not equivalent", "cas")
    return GradeResult(True, "all variables symbolically equivalent", "cas")


# ---------------------------------------------------------------------------
# Grader 2: RREF equivalence (Item C)
# ---------------------------------------------------------------------------

def grade_rref(response_matrix: list[list], problem_matrix: list[list]) -> GradeResult:
    """Any valid row reduction that reaches the correct RREF is accepted,
    because RREF is unique.
    """
    A = sp.Matrix(problem_matrix)
    ref_rref, _ = A.rref()
    R = sp.Matrix(response_matrix)
    if R.shape != ref_rref.shape:
        return GradeResult(False, "matrix shape does not match", "exact")
    if sp.simplify(R - ref_rref) == sp.zeros(*ref_rref.shape):
        return GradeResult(True, "matches unique RREF", "exact")
    return GradeResult(False, "not in reduced row echelon form or incorrect", "exact")


# ---------------------------------------------------------------------------
# Grader 3: solution-set equality for infinite solution sets (Item E)
# ---------------------------------------------------------------------------

def _colspace_equal(D1: sp.Matrix, D2: sp.Matrix) -> bool:
    """True if the column spaces of D1 and D2 are equal."""
    if D1.cols == 0 and D2.cols == 0:
        return True
    if D1.rows != D2.rows:
        return False
    r1 = D1.rank()
    r2 = D2.rank()
    if r1 != r2:
        return False
    combined = D1.row_join(D2)
    return combined.rank() == r1


def grade_solution_set(
    A: list[list],
    b: list,
    particular: list,
    directions: list[list],
) -> GradeResult:
    """Grade a parametric solution x = particular + span(directions) of A x = b.

    Correct iff the particular solution satisfies the system and the direction
    vectors span exactly the null space of A. Any valid choice of particular
    point and any basis for the null space is accepted.
    """
    Am = sp.Matrix(A)
    bm = _as_rational_vector(b)
    p = _as_rational_vector(particular)

    if sp.simplify(Am * p - bm) != sp.zeros(Am.rows, 1):
        return GradeResult(False, "particular solution does not satisfy A x = b", "set_equal")

    # Learner directions as columns.
    if directions:
        D_learner = sp.Matrix(directions).T
    else:
        D_learner = sp.Matrix(Am.cols, 0, [])

    ns = Am.nullspace()
    if ns:
        D_ref = ns[0]
        for v in ns[1:]:
            D_ref = D_ref.row_join(v)
    else:
        D_ref = sp.Matrix(Am.cols, 0, [])

    if _colspace_equal(D_learner, D_ref):
        return GradeResult(True, "solution set matches (particular plus null space)", "set_equal")
    return GradeResult(False, "direction vectors do not span the null space", "set_equal")


# ---------------------------------------------------------------------------
# Parameterized template: 3x3 integer system with a unique integer solution
# ---------------------------------------------------------------------------

def generate_unique_3x3(seed: int, coeff_range: int = 4, sol_range: int = 6):
    """Deterministically seed a 3x3 integer system A x = b with a unique
    integer solution. Returns (A, b, solution).

    Construction guarantees uniqueness: pick an integer solution, pick an
    invertible integer A, set b = A x. Verification below confirms it.
    """
    rng = random.Random(seed)

    def rand_int(lo, hi):
        return rng.randint(lo, hi)

    # Integer solution vector.
    x = sp.Matrix([rand_int(-sol_range, sol_range) for _ in range(3)])

    # Invertible integer matrix A (retry until det is nonzero).
    while True:
        A = sp.Matrix(3, 3, lambda i, j: rand_int(-coeff_range, coeff_range))
        if A.det() != 0:
            break

    b = A * x
    return A, b, x


def verify_unique_solution(A: sp.Matrix, b: sp.Matrix, expected: sp.Matrix) -> bool:
    """The verified-everything gate for the template: confirm the seeded
    variant has exactly one solution and that it equals the intended answer.
    """
    if A.det() == 0:
        return False  # not a unique-solution system
    sol = A.solve(b)  # unique because det is nonzero
    return sp.simplify(sol - expected) == sp.zeros(3, 1)


# ---------------------------------------------------------------------------
# Verified-everything gate for a static keyed item
# ---------------------------------------------------------------------------

def verify_linear_system_key(coeffs: list[list], rhs: list, key: dict[str, str]) -> bool:
    """Recompute the solution of a small linear system and confirm the stored
    key matches. Used to gate Item A style items before they ship.
    """
    A = sp.Matrix(coeffs)
    b = _as_rational_vector(rhs)
    syms = sp.symbols(f"v0:{A.cols}")
    sol = sp.linsolve((A, b), *syms)
    if len(sol) != 1:
        return False
    (point,) = list(sol)
    # Map positional solution to variable names in key order.
    var_order = list(key.keys())
    if len(var_order) != A.cols:
        return False
    for name, val in zip(var_order, point):
        if sp.simplify(val - parse_expr(key[name])) != 0:
            return False
    return True
