"""AXIOM verified template bank.

Parameterized item generators covering all three courses. Every generator
returns (stem, answer_spec) for a seeded variant, and every variant is
verified by an independent SymPy check before it may ship. The registry at the
bottom maps each template to its knowledge node, so the content loader can
attach the bank to the curriculum in axiom_full_curriculum.json.

Design rule repeated from the grading core: verification is independent of
generation wherever possible (generate by construction, verify by solving or
substituting), so a construction bug cannot certify itself.
"""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Callable

import sympy as sp

x, t, s_ = sp.symbols("x t s")
n_ = sp.Symbol("n", integer=True, positive=True)


def _rng(seed: int) -> random.Random:
    return random.Random(seed)


def _nz(rng, lo, hi):
    v = 0
    while v == 0:
        v = rng.randint(lo, hi)
    return v


@dataclass
class Variant:
    stem: str
    grader: str
    answer_spec: dict


# ===========================================================================
# LINEAR ALGEBRA
# ===========================================================================

def gen_solve_2x2(seed: int) -> Variant:
    r = _rng(seed)
    xv, yv = r.randint(-6, 6), r.randint(-6, 6)
    while True:
        a, b, c, d = (r.randint(-5, 5) for _ in range(4))
        if a * d - b * c != 0:
            break
    e, f = a * xv + b * yv, c * xv + d * yv
    def term(coef, var):
        if coef == 0: return ""
        sign = "-" if coef < 0 else "+"
        mag = "" if abs(coef) == 1 else str(abs(coef))
        return f" {sign} {mag}{var}"
    def eqn(p, q, rhs):
        sfull = (term(p, "x") + term(q, "y")).strip()
        if sfull.startswith("+"): sfull = sfull[1:].strip()
        return f"{sfull} = {rhs}"
    stem = f"Solve: {eqn(a,b,e)} and {eqn(c,d,f)}."
    return Variant(stem, "cas", {
        "coeffs": [[a, b], [c, d]], "rhs": [e, f],
        "key": {"x": str(xv), "y": str(yv)},
    })


def ver_solve_2x2(v: Variant) -> bool:
    A = sp.Matrix(v.answer_spec["coeffs"]); b = sp.Matrix(v.answer_spec["rhs"])
    if A.det() == 0: return False
    sol = A.solve(b)
    k = v.answer_spec["key"]
    return sp.simplify(sol[0] - sp.Integer(k["x"])) == 0 and \
           sp.simplify(sol[1] - sp.Integer(k["y"])) == 0


def gen_matmul_2x2(seed: int) -> Variant:
    r = _rng(seed)
    A = [[r.randint(-4, 4) for _ in range(2)] for _ in range(2)]
    B = [[r.randint(-4, 4) for _ in range(2)] for _ in range(2)]
    C = (sp.Matrix(A) * sp.Matrix(B)).tolist()
    return Variant(
        f"Compute A B for A = {A} and B = {B}. Give the entries.",
        "exact_matrix",
        {"A": A, "B": B, "key_matrix": [[int(v) for v in row] for row in C]},
    )


def ver_matmul_2x2(v: Variant) -> bool:
    A, B = sp.Matrix(v.answer_spec["A"]), sp.Matrix(v.answer_spec["B"])
    return (A * B - sp.Matrix(v.answer_spec["key_matrix"])) == sp.zeros(2, 2)


def gen_inverse_2x2(seed: int) -> Variant:
    r = _rng(seed)
    # Unimodular integer matrix: integer inverse, so answers stay clean.
    p, q = _nz(r, -3, 3), _nz(r, -3, 3)
    A = sp.Matrix([[1, p], [q, 1 + p * q]])
    if r.random() < 0.5:
        A = A.T
    inv = A.inv()
    return Variant(
        f"Find the inverse of A = {A.tolist()}.",
        "exact_matrix",
        {"A": [[int(v) for v in row] for row in A.tolist()],
         "key_matrix": [[int(v) for v in row] for row in inv.tolist()]},
    )


def ver_inverse_2x2(v: Variant) -> bool:
    A = sp.Matrix(v.answer_spec["A"]); K = sp.Matrix(v.answer_spec["key_matrix"])
    return sp.simplify(A * K - sp.eye(2)) == sp.zeros(2, 2)


def gen_det_3x3(seed: int) -> Variant:
    r = _rng(seed)
    A = [[r.randint(-4, 4) for _ in range(3)] for _ in range(3)]
    d = int(sp.Matrix(A).det())
    return Variant(f"Compute det(A) for A = {A}.", "cas",
                   {"A": A, "key": {"det": str(d)}})


def ver_det_3x3(v: Variant) -> bool:
    return int(sp.Matrix(v.answer_spec["A"]).det()) == int(v.answer_spec["key"]["det"])


def gen_eigen_2x2(seed: int) -> Variant:
    r = _rng(seed)
    l1, l2 = r.randint(-4, 4), r.randint(-4, 4)
    while l2 == l1:
        l2 = r.randint(-4, 4)
    p, q = _nz(r, -2, 2), _nz(r, -2, 2)
    P = sp.Matrix([[1, p], [q, 1 + p * q]])       # unimodular
    A = P * sp.diag(l1, l2) * P.inv()             # integer entries
    lams = sorted([l1, l2])
    return Variant(
        f"Find the eigenvalues of A = {A.tolist()} (list both).",
        "cas",
        {"A": [[int(v) for v in row] for row in A.tolist()],
         "key": {"lambda1": str(lams[0]), "lambda2": str(lams[1])}},
    )


def ver_eigen_2x2(v: Variant) -> bool:
    A = sp.Matrix(v.answer_spec["A"])
    got = sorted(int(k) for k, m in A.eigenvals().items())
    want = sorted(int(v.answer_spec["key"][k]) for k in ("lambda1", "lambda2"))
    return got == want


def gen_projection(seed: int) -> Variant:
    r = _rng(seed)
    a = sp.Matrix([_nz(r, -3, 3), _nz(r, -3, 3)])
    b = sp.Matrix([r.randint(-5, 5), r.randint(-5, 5)])
    proj = (a.dot(b) / a.dot(a)) * a
    return Variant(
        f"Project b = {list(b)} onto the line through a = {list(a)}. "
        f"Give the two components (fractions allowed).",
        "cas",
        {"a": [int(v) for v in a], "b": [int(v) for v in b],
         "key": {"p1": str(proj[0]), "p2": str(proj[1])}},
    )


def ver_projection(v: Variant) -> bool:
    a = sp.Matrix(v.answer_spec["a"]); b = sp.Matrix(v.answer_spec["b"])
    p = sp.Matrix([sp.sympify(v.answer_spec["key"]["p1"]),
                   sp.sympify(v.answer_spec["key"]["p2"])])
    # Verify independently: p is parallel to a and b - p is orthogonal to a.
    parallel = sp.simplify(p[0] * a[1] - p[1] * a[0]) == 0
    orthogonal = sp.simplify(a.dot(b - p)) == 0
    return parallel and orthogonal


def gen_least_squares_line(seed: int) -> Variant:
    r = _rng(seed)
    xs = sorted(r.sample(range(0, 7), 4))
    ys = [r.randint(-4, 8) for _ in xs]
    X = sp.Matrix([[xi, 1] for xi in xs]); yv = sp.Matrix(ys)
    beta = (X.T * X).solve(X.T * yv)
    return Variant(
        f"Fit y = m x + c by least squares to the points "
        f"{list(zip(xs, ys))}. Give m and c (fractions allowed).",
        "cas",
        {"xs": xs, "ys": ys,
         "key": {"m": str(beta[0]), "c": str(beta[1])}},
    )


def ver_least_squares_line(v: Variant) -> bool:
    xs, ys = v.answer_spec["xs"], v.answer_spec["ys"]
    X = sp.Matrix([[xi, 1] for xi in xs]); yv = sp.Matrix(ys)
    m = sp.sympify(v.answer_spec["key"]["m"]); c = sp.sympify(v.answer_spec["key"]["c"])
    beta = sp.Matrix([m, c])
    # Normal equations must hold exactly.
    return sp.simplify(X.T * X * beta - X.T * yv) == sp.zeros(2, 1)


# ===========================================================================
# ODEs
# ===========================================================================

def gen_separable(seed: int) -> Variant:
    r = _rng(seed)
    k = _nz(r, -4, 4)
    return Variant(
        f"Find the general solution of y' = {k} x y. Use C1.",
        "ode",
        {"ode": f"Derivative(y(x), x) - ({k})*x*y(x)", "order": 1,
         "key": {"y": f"C1*exp({k}*x**2/2)"}},
    )


def gen_linear_first_order(seed: int) -> Variant:
    r = _rng(seed)
    a, b = _nz(r, -4, 4), _nz(r, -6, 6)
    return Variant(
        f"Solve y' + {a} y = {b} (general solution, use C1).",
        "ode",
        {"ode": f"Derivative(y(x), x) + ({a})*y(x) - ({b})", "order": 1,
         "key": {"y": f"{b}/{a} + C1*exp(-({a})*x)"}},
    )


def gen_second_order_distinct(seed: int) -> Variant:
    r = _rng(seed)
    r1, r2 = r.randint(-4, 4), r.randint(-4, 4)
    while r2 == r1:
        r2 = r.randint(-4, 4)
    p, q = -(r1 + r2), r1 * r2
    return Variant(
        f"Find the general solution of y'' + ({p}) y' + ({q}) y = 0. Use C1, C2.",
        "ode",
        {"ode": f"Derivative(y(x), x, 2) + ({p})*Derivative(y(x), x) + ({q})*y(x)",
         "order": 2,
         "key": {"y": f"C1*exp({r1}*x) + C2*exp({r2}*x)"}},
    )


def gen_second_order_ivp(seed: int) -> Variant:
    r = _rng(seed)
    w = r.randint(1, 4)
    A, B = r.randint(-3, 3), r.randint(-3, 3)
    y0, yp0 = A, B * w
    return Variant(
        f"Solve y'' + {w*w} y = 0 with y(0) = {y0} and y'(0) = {yp0}.",
        "ode",
        {"ode": f"Derivative(y(x), x, 2) + ({w*w})*y(x)",
         "initial_conditions": {"y(0)": str(y0)},
         "key": {"y": f"({A})*cos({w}*x) + ({B})*sin({w}*x)"}},
    )


def _verify_ode_variant(v: Variant) -> bool:
    """Independent check: substitute the key into the ODE, confirm zero
    residual, and confirm the constant count (or the initial conditions)."""
    spec = v.answer_spec
    y = sp.Function("y")
    ode = sp.sympify(spec["ode"], locals={"y": y, "x": x})
    resp = sp.sympify(spec["key"]["y"], locals={"x": x})
    residual = sp.simplify(ode.subs(y(x), resp).doit())
    if residual != 0:
        return False
    consts = [s for s in resp.free_symbols if str(s).startswith("C")]
    if "order" in spec:
        return len(consts) == spec["order"]
    if "initial_conditions" in spec:
        if consts:
            return False
        for cond, val in spec["initial_conditions"].items():
            got = sp.sympify(cond, locals={"y": sp.Lambda(x, resp)})
            if sp.simplify(got - sp.sympify(val)) != 0:
                return False
    return True


def gen_laplace_item(seed: int) -> Variant:
    r = _rng(seed)
    n = r.randint(1, 3); a = _nz(r, -3, 3)
    f = t ** n * sp.exp(a * t)
    F = sp.laplace_transform(f, t, s_, noconds=True)
    return Variant(
        f"Compute the Laplace transform of f(t) = t^{n} e^({a} t).",
        "cas",
        {"f": str(f), "key": {"F": str(F)}},
    )


def ver_laplace_item(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"t": t})
    ref = sp.laplace_transform(f, t, s_, noconds=True)
    got = sp.sympify(v.answer_spec["key"]["F"], locals={"s": s_})
    return sp.simplify(got - ref) == 0


def gen_system_2x2(seed: int) -> Variant:
    r = _rng(seed)
    l1, l2 = r.randint(-3, 3), r.randint(-3, 3)
    while l2 == l1:
        l2 = r.randint(-3, 3)
    p, q = _nz(r, -2, 2), _nz(r, -2, 2)
    P = sp.Matrix([[1, p], [q, 1 + p * q]])
    A = P * sp.diag(l1, l2) * P.inv()
    v1, v2 = P.col(0), P.col(1)
    return Variant(
        f"For x' = A x with A = {A.tolist()}, give the eigenvalues and one "
        f"eigenvector for each (any scalar multiples accepted).",
        "eigen_system",
        {"A": [[int(u) for u in row] for row in A.tolist()],
         "key": {"lambda1": str(min(l1, l2)), "lambda2": str(max(l1, l2)),
                 "v1": [int(u) for u in (v1 if l1 <= l2 else v2)],
                 "v2": [int(u) for u in (v2 if l1 <= l2 else v1)]}},
    )


def ver_system_2x2(v: Variant) -> bool:
    A = sp.Matrix(v.answer_spec["A"]); k = v.answer_spec["key"]
    ok = True
    for lam_key, vec_key in (("lambda1", "v1"), ("lambda2", "v2")):
        lam = sp.Integer(k[lam_key]); vec = sp.Matrix(k[vec_key])
        ok = ok and vec != sp.zeros(2, 1) and \
             sp.simplify(A * vec - lam * vec) == sp.zeros(2, 1)
    return ok


# ===========================================================================
# PDEs and FOURIER
# ===========================================================================

def gen_fourier_poly(seed: int) -> Variant:
    r = _rng(seed)
    c = _nz(r, -3, 3)
    kind = r.choice(["odd_linear", "even_square"])
    if kind == "odd_linear":
        f = c * x
        bn = sp.integrate(f * sp.sin(n_ * x), (x, -sp.pi, sp.pi)) / sp.pi
        spec = {"f": str(f), "L": "pi", "key": {"a0": "0", "an": "0",
                "bn": str(sp.simplify(bn))}}
        stem = (f"Compute the Fourier coefficients of f(x) = {c} x on "
                f"[-pi, pi] (a0, an, bn as expressions in n).")
    else:
        f = c * x ** 2
        a0 = sp.integrate(f, (x, -sp.pi, sp.pi)) / sp.pi
        an = sp.integrate(f * sp.cos(n_ * x), (x, -sp.pi, sp.pi)) / sp.pi
        spec = {"f": str(f), "L": "pi", "key": {"a0": str(sp.simplify(a0)),
                "an": str(sp.simplify(an)), "bn": "0"}}
        stem = (f"Compute the Fourier coefficients of f(x) = {c} x^2 on "
                f"[-pi, pi] (a0, an, bn as expressions in n).")
    return Variant(stem, "fourier", spec)


def ver_fourier_poly(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x})
    L = sp.pi
    ref_a0 = sp.simplify(sp.integrate(f, (x, -L, L)) / L)
    ref_an = sp.simplify(sp.integrate(f * sp.cos(n_ * sp.pi * x / L), (x, -L, L)) / L)
    ref_bn = sp.simplify(sp.integrate(f * sp.sin(n_ * sp.pi * x / L), (x, -L, L)) / L)
    k = v.answer_spec["key"]
    return all(sp.simplify(sp.sympify(k[name], locals={"n": n_}) - ref) == 0
               for name, ref in (("a0", ref_a0), ("an", ref_an), ("bn", ref_bn)))


def gen_heat_mode(seed: int) -> Variant:
    r = _rng(seed)
    alpha = r.randint(1, 4); L = r.randint(1, 3); n = r.randint(1, 4)
    u = f"exp(-{alpha}*({n}*pi/{L})**2*t)*sin({n}*pi*x/{L})"
    return Variant(
        f"Verify-style item: give the separated solution mode of "
        f"u_t = {alpha} u_xx on [0, {L}] with u(0,t) = u({L},t) = 0 "
        f"for mode n = {n} (up to a constant factor).",
        "pde_mode",
        {"pde": "heat", "alpha": alpha, "L": L, "n": n, "key": {"u": u}},
    )


def ver_heat_mode(v: Variant) -> bool:
    spec = v.answer_spec
    u = sp.sympify(spec["key"]["u"], locals={"x": x, "t": t})
    alpha = spec["alpha"]; L = spec["L"]
    residual = sp.simplify(sp.diff(u, t) - alpha * sp.diff(u, x, 2))
    bc = sp.simplify(u.subs(x, 0)) == 0 and sp.simplify(u.subs(x, L)) == 0
    return residual == 0 and bc and sp.simplify(u) != 0


def gen_wave_dalembert(seed: int) -> Variant:
    r = _rng(seed)
    c = r.randint(1, 3)
    a, b = _nz(r, -2, 2), _nz(r, -2, 2)
    u = f"({a})*sin(x - {c}*t) + ({b})*cos(x + {c}*t)"
    return Variant(
        f"Confirm a d'Alembert solution of u_tt = {c*c} u_xx built from a "
        f"right-mover and a left-mover (coefficients {a} and {b}).",
        "pde_mode",
        {"pde": "wave", "c": c, "key": {"u": u}},
    )


def ver_wave_dalembert(v: Variant) -> bool:
    spec = v.answer_spec
    u = sp.sympify(spec["key"]["u"], locals={"x": x, "t": t})
    c = spec["c"]
    return sp.simplify(sp.diff(u, t, 2) - c * c * sp.diff(u, x, 2)) == 0


def gen_harmonic_check(seed: int) -> Variant:
    r = _rng(seed)
    yv = sp.Symbol("y")
    harmonics = [x**2 - yv**2, x * yv, sp.exp(x) * sp.sin(yv),
                 sp.exp(x) * sp.cos(yv), x**3 - 3 * x * yv**2]
    u = r.choice(harmonics) * _nz(r, -2, 2)
    return Variant(
        f"Verify that u(x, y) = {u} is harmonic (satisfies Laplace's equation).",
        "pde_mode",
        {"pde": "laplace", "key": {"u": str(u)}},
    )


def ver_harmonic_check(v: Variant) -> bool:
    yv = sp.Symbol("y")
    u = sp.sympify(v.answer_spec["key"]["u"], locals={"x": x, "y": yv})
    return sp.simplify(sp.diff(u, x, 2) + sp.diff(u, yv, 2)) == 0


def gen_transport(seed: int) -> Variant:
    r = _rng(seed)
    c = _nz(r, -3, 3)
    u = f"sin(x - ({c})*t)"
    return Variant(
        f"Solve u_t + ({c}) u_x = 0 with u(x, 0) = sin(x) by characteristics.",
        "pde_mode",
        {"pde": "transport", "c": c, "key": {"u": u}},
    )


def ver_transport(v: Variant) -> bool:
    spec = v.answer_spec
    u = sp.sympify(spec["key"]["u"], locals={"x": x, "t": t})
    c = spec["c"]
    residual = sp.simplify(sp.diff(u, t) + c * sp.diff(u, x))
    ic = sp.simplify(u.subs(t, 0) - sp.sin(x)) == 0
    return residual == 0 and ic


# ===========================================================================
# Registry: template id -> (node, generator, verifier)
# ===========================================================================

REGISTRY: dict[str, dict] = {
    # Linear Algebra
    "T-LA-2x2":      {"node": "LA03", "gen": gen_solve_2x2, "ver": ver_solve_2x2},
    "T-LA-matmul":   {"node": "LA05", "gen": gen_matmul_2x2, "ver": ver_matmul_2x2},
    "T-LA-inverse":  {"node": "LA06", "gen": gen_inverse_2x2, "ver": ver_inverse_2x2},
    "T-LA-det":      {"node": "LA15", "gen": gen_det_3x3, "ver": ver_det_3x3},
    "T-LA-eigen":    {"node": "LA17", "gen": gen_eigen_2x2, "ver": ver_eigen_2x2},
    "T-LA-proj":     {"node": "LA22", "gen": gen_projection, "ver": ver_projection},
    "T-LA-lsq":      {"node": "LA24", "gen": gen_least_squares_line, "ver": ver_least_squares_line},
    # ODEs
    "T-OD-sep":      {"node": "OD01", "gen": gen_separable, "ver": _verify_ode_variant},
    "T-OD-lin1":     {"node": "OD02", "gen": gen_linear_first_order, "ver": _verify_ode_variant},
    "T-OD-so-dist":  {"node": "OD07", "gen": gen_second_order_distinct, "ver": _verify_ode_variant},
    "T-OD-so-ivp":   {"node": "OD09", "gen": gen_second_order_ivp, "ver": _verify_ode_variant},
    "T-OD-laplace":  {"node": "OD13", "gen": gen_laplace_item, "ver": ver_laplace_item},
    "T-OD-system":   {"node": "OD16", "gen": gen_system_2x2, "ver": ver_system_2x2},
    # PDEs and Fourier
    "T-PF-fourier":  {"node": "PF01", "gen": gen_fourier_poly, "ver": ver_fourier_poly},
    "T-PF-heat":     {"node": "PF09", "gen": gen_heat_mode, "ver": ver_heat_mode},
    "T-PF-wave":     {"node": "PF13", "gen": gen_wave_dalembert, "ver": ver_wave_dalembert},
    "T-PF-harmonic": {"node": "PF16", "gen": gen_harmonic_check, "ver": ver_harmonic_check},
    "T-PF-transport":{"node": "PF21", "gen": gen_transport, "ver": ver_transport},
}


def sweep(seeds_per_template: int = 15) -> dict:
    """The verified-everything gate at bank scale: every template must verify
    on every seed, or it is reported and must not ship."""
    results = {}
    for tid, entry in REGISTRY.items():
        ok = 0
        failures = []
        for seed in range(1, seeds_per_template + 1):
            try:
                v = entry["gen"](seed)
                if entry["ver"](v):
                    ok += 1
                else:
                    failures.append(seed)
            except Exception as e:  # a crash is a failure, not an excuse
                failures.append(f"{seed}:{type(e).__name__}")
        results[tid] = {"node": entry["node"], "ok": ok,
                        "total": seeds_per_template, "failures": failures}
    return results


if __name__ == "__main__":
    res = sweep()
    total_ok = sum(r["ok"] for r in res.values())
    total = sum(r["total"] for r in res.values())
    print(f"templates: {len(res)}   variants verified: {total_ok}/{total}")
    for tid, r in res.items():
        mark = "PASS" if not r["failures"] else "FAIL"
        print(f"  {mark}  {tid:16s} node {r['node']}  {r['ok']}/{r['total']}"
              + (f"  failures: {r['failures']}" if r["failures"] else ""))
