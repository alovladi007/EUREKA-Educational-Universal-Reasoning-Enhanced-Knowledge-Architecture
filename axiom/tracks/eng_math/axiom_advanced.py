"""AXIOM advanced-math graders.

Covers the grading needs of the ODE and PDE/Fourier courses in the Engineering
Mathematics track. Design principle throughout: grade by verification, not by
comparison to one canonical form. A student's ODE solution is graded by
substituting it into the ODE, an antiderivative by differentiating it, an
eigenvector by applying the matrix. Verification is cheaper, more robust, and
accepts every correct form automatically.
"""

from __future__ import annotations

from dataclasses import dataclass

import sympy as sp


@dataclass
class GradeResult:
    correct: bool
    detail: str
    grader: str
    confidence: float = 1.0


def _sym(s: str) -> sp.Expr:
    return sp.sympify(s, locals={})


# ---------------------------------------------------------------------------
# ODE grading: verify by substitution
# ---------------------------------------------------------------------------

def grade_ode_solution(
    ode: str,
    func: str,
    var: str,
    response: str,
    order: int | None = None,
    initial_conditions: dict[str, str] | None = None,
) -> GradeResult:
    """Grade a proposed solution of an ODE.

    ode      : the ODE with y written as y(x), e.g. "Derivative(y(x), x) - y(x)"
               (interpreted as expression = 0) or "Eq(Derivative(y(x),x), y(x))"
    func     : "y", var: "x"
    response : the student's y(x) as an expression in x, using C1, C2, ... for
               arbitrary constants, e.g. "C1*exp(x)".
    order    : if given for a general-solution item, the response must contain
               exactly this many arbitrary constants (a general solution of an
               nth order linear ODE needs n of them; a response missing a
               constant is a particular solution and is marked wrong for a
               general-solution item).
    initial_conditions : for an IVP, e.g. {"y(0)": "3"}; the response must be a
               particular solution satisfying them (and must contain no
               remaining arbitrary constants).

    Grading is by substitution: the response is plugged into the ODE and the
    residual must simplify to zero identically in the variable and constants.
    Any correct form passes; no canonical form is required.
    """
    x = sp.Symbol(var)
    y = sp.Function(func)

    ode_expr = sp.sympify(ode, locals={func: y, var: x})
    if isinstance(ode_expr, sp.Eq):
        ode_expr = ode_expr.lhs - ode_expr.rhs

    resp = sp.sympify(response, locals={var: x})

    # Substitute y(x) -> response; doit() evaluates the resulting derivatives.
    residual = ode_expr.subs(y(x), resp).doit()
    residual = sp.simplify(residual)

    if residual != 0:
        return GradeResult(
            False,
            "response does not satisfy the ODE (nonzero residual after substitution)",
            "ode",
        )

    consts = sorted(
        (s for s in resp.free_symbols if str(s).startswith("C")), key=str
    )

    if initial_conditions:
        if consts:
            return GradeResult(
                False,
                "an IVP solution must have no remaining arbitrary constants",
                "ode",
            )
        for cond, val in initial_conditions.items():
            cond_expr = sp.sympify(
                cond, locals={func: sp.Lambda(x, resp), var: x}
            )
            if sp.simplify(cond_expr - _sym(val)) != 0:
                return GradeResult(
                    False, f"initial condition {cond} = {val} not satisfied", "ode"
                )
        return GradeResult(True, "satisfies the ODE and all initial conditions", "ode")

    if order is not None:
        if len(consts) != order:
            return GradeResult(
                False,
                f"a general solution of an order-{order} ODE needs {order} "
                f"arbitrary constants; found {len(consts)} "
                f"(a particular solution is not a general solution)",
                "ode",
            )
    return GradeResult(True, "satisfies the ODE with the required generality", "ode")


# ---------------------------------------------------------------------------
# Eigenpair grading: verify A v = lambda v
# ---------------------------------------------------------------------------

def grade_eigenpair(matrix: list[list], eigenvalue: str, eigenvector: list[str]) -> GradeResult:
    """Any nonzero scalar multiple of a true eigenvector passes automatically,
    because the check is A v = lambda v, not comparison to a stored vector.
    """
    A = sp.Matrix(matrix)
    lam = _sym(eigenvalue)
    v = sp.Matrix([_sym(c) for c in eigenvector])
    if v == sp.zeros(v.rows, 1):
        return GradeResult(False, "the zero vector is never an eigenvector", "eigen")
    if v.rows != A.cols:
        return GradeResult(False, "eigenvector dimension does not match the matrix", "eigen")
    resid = sp.simplify(A * v - lam * v)
    if resid == sp.zeros(v.rows, 1):
        return GradeResult(True, "A v = lambda v verified", "eigen")
    # Distinguish the two failure modes for better feedback.
    if sp.simplify(sp.det(A - lam * sp.eye(A.rows))) == 0:
        return GradeResult(
            False,
            "the eigenvalue is correct but the vector is not in its eigenspace",
            "eigen",
        )
    return GradeResult(False, "not an eigenvalue of the matrix", "eigen")


# ---------------------------------------------------------------------------
# Antiderivative grading: verify by differentiation
# ---------------------------------------------------------------------------

def grade_antiderivative(integrand: str, var: str, response: str) -> GradeResult:
    """Accepts any antiderivative: F is correct iff F' equals the integrand.
    Different valid antiderivatives (differing by a constant, or written in a
    different but equivalent form) all pass.
    """
    x = sp.Symbol(var)
    f = sp.sympify(integrand, locals={var: x})
    F = sp.sympify(response, locals={var: x})
    diff = sp.simplify(sp.diff(F, x) - f)
    if diff == 0:
        return GradeResult(True, "derivative of the response equals the integrand", "antideriv")
    return GradeResult(False, "derivative of the response does not equal the integrand", "antideriv")


# ---------------------------------------------------------------------------
# Fourier series coefficient grading
# ---------------------------------------------------------------------------

def grade_fourier_coefficients(
    f: str,
    var: str,
    period_half: str,
    a0: str | None = None,
    an: str | None = None,
    bn: str | None = None,
) -> GradeResult:
    """Grade Fourier coefficients of f on [-L, L].

    Convention: f ~ a0/2 + sum an cos(n pi x / L) + bn sin(n pi x / L), with
    a0 = (1/L) integral f dx, an = (1/L) integral f cos(...) dx, bn likewise.
    an and bn are expressions in n (n a positive integer). The student's
    expression is compared symbolically to the reference integral, so any
    equivalent closed form passes.
    """
    x = sp.Symbol(var, real=True)
    L = sp.sympify(period_half, locals={})
    n = sp.Symbol("n", integer=True, positive=True)
    fx = sp.sympify(f, locals={var: x})

    checks: list[str] = []

    if a0 is not None:
        ref = sp.integrate(fx, (x, -L, L)) / L
        got = sp.sympify(a0, locals={})
        if sp.simplify(got - ref) != 0:
            return GradeResult(False, "a0 is incorrect", "fourier")
        checks.append("a0")

    if an is not None:
        ref = sp.integrate(fx * sp.cos(n * sp.pi * x / L), (x, -L, L)) / L
        got = sp.sympify(an, locals={"n": n})
        if sp.simplify(got - ref) != 0:
            return GradeResult(False, "an is incorrect", "fourier")
        checks.append("an")

    if bn is not None:
        ref = sp.integrate(fx * sp.sin(n * sp.pi * x / L), (x, -L, L)) / L
        got = sp.sympify(bn, locals={"n": n})
        if sp.simplify(got - ref) != 0:
            return GradeResult(False, "bn is incorrect", "fourier")
        checks.append("bn")

    if not checks:
        return GradeResult(False, "no coefficients submitted", "fourier")
    return GradeResult(True, f"verified: {', '.join(checks)}", "fourier")


# ---------------------------------------------------------------------------
# Laplace transform grading
# ---------------------------------------------------------------------------

def grade_laplace(f: str, var: str, s_var: str, response: str) -> GradeResult:
    """Grade a Laplace transform F(s) of f(t) by symbolic comparison with the
    reference transform.
    """
    t = sp.Symbol(var, positive=True)
    s = sp.Symbol(s_var, positive=True)
    ft = sp.sympify(f, locals={var: t})
    ref = sp.laplace_transform(ft, t, s, noconds=True)
    got = sp.sympify(response, locals={s_var: s})
    if sp.simplify(got - ref) == 0:
        return GradeResult(True, "matches the Laplace transform", "laplace")
    return GradeResult(False, "does not match the Laplace transform", "laplace")
