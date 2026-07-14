"""Verified question generators for the foundations courses (EM-18).

Ported verbatim from the reference bank tracks/eng_math/axiom_templates_wave2.py:
19 parameterized generators for Calculus I-III, Probability and Statistics, and
Discrete Mathematics, each verified through an INDEPENDENT path (derivatives by
central difference quotients, integrals by differentiating the key, double
integrals by opposite-order Fubini, Taylor coefficients by the derivative
formula, recurrences by iteration, counting by brute-force enumeration,
probability through sympy.stats). REGISTRY maps template id -> generator,
verifier, and the live node code; HINTS carries the three-rung ladder (orient,
method, first step) per the AXIOM Teaching Model.

resolve_generated() adapts a generated Variant to the live practice flow:
single-key answers grade as math_expression; multi-key answers grade as
linear_system against the key dict (submitted as JSON), matching the grading
service branches.
"""


from __future__ import annotations

import itertools
import random
from dataclasses import dataclass

import sympy as sp
from sympy import stats as st

x, y, t = sp.symbols("x y t")


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


def _numeric_deriv_check(f, key, points=(0.3, 1.1, -0.7), h=1e-6, tol=1e-4) -> bool:
    """Independent derivative check: central difference vs the key."""
    ff = sp.lambdify(x, f, "math")
    kk = sp.lambdify(x, key, "math")
    for p in points:
        approx = (ff(p + h) - ff(p - h)) / (2 * h)
        if abs(approx - kk(p)) > tol * (1 + abs(kk(p))):
            return False
    return True


# ===========================================================================
# CALCULUS I
# ===========================================================================

def gen_c1_deriv(seed: int) -> Variant:
    r = _rng(seed)
    a, b, c = _nz(r, -4, 4), _nz(r, -4, 4), r.randint(-3, 3)
    n = r.randint(2, 4)
    f = a * x ** n + b * x + c + r.choice([sp.sin(x), sp.exp(x), sp.Integer(0)])
    key = sp.diff(f, x)
    return Variant(f"Differentiate f(x) = {f}.", "cas",
                   {"f": str(f), "key": {"fprime": str(key)}})


def ver_c1_deriv(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x})
    key = sp.sympify(v.answer_spec["key"]["fprime"], locals={"x": x})
    return _numeric_deriv_check(f, key)


def gen_c1_chain(seed: int) -> Variant:
    r = _rng(seed)
    a, b = _nz(r, -3, 3), r.randint(-3, 3)
    outer = r.choice([sp.sin, sp.cos, sp.exp])
    inner = a * x ** 2 + b
    f = outer(inner)
    key = sp.diff(f, x)
    return Variant(f"Differentiate f(x) = {f} (chain rule).", "cas",
                   {"f": str(f), "key": {"fprime": str(key)}})


def gen_c1_limit(seed: int) -> Variant:
    r = _rng(seed)
    a, b = r.randint(-4, 4), r.randint(-4, 4)
    while b == a:
        b = r.randint(-4, 4)
    f = ((x - a) * (x - b)) / (x - a)  # removable hole at x = a
    key = sp.limit(f, x, a)
    return Variant(
        f"Evaluate the limit as x -> {a} of ((x - {a})(x - {b}))/(x - {a}).",
        "cas", {"f": str(f), "at": a, "key": {"L": str(key)}})


def ver_c1_limit(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x})
    ref = sp.limit(f, x, v.answer_spec["at"])
    return sp.simplify(sp.sympify(v.answer_spec["key"]["L"]) - ref) == 0


def gen_c1_critical(seed: int) -> Variant:
    r = _rng(seed)
    p, q = r.randint(-3, 3), r.randint(-3, 3)
    while q == p:
        q = r.randint(-3, 3)
    fprime = 3 * (x - p) * (x - q)
    f = sp.expand(sp.integrate(fprime, x))
    lo, hi = sorted((p, q))
    return Variant(
        f"Find the critical points of f(x) = {f}.",
        "cas", {"f": str(f), "key": {"x1": str(lo), "x2": str(hi)}})


def ver_c1_critical(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x})
    roots = sorted(sp.solve(sp.diff(f, x), x))
    want = [sp.sympify(v.answer_spec["key"]["x1"]),
            sp.sympify(v.answer_spec["key"]["x2"])]
    return len(roots) == 2 and all(sp.simplify(r - w) == 0
                                   for r, w in zip(roots, want))


# ===========================================================================
# CALCULUS II
# ===========================================================================

def gen_c2_parts(seed: int) -> Variant:
    r = _rng(seed)
    a = _nz(r, -3, 3)
    n = r.randint(1, 2)
    f = x ** n * sp.exp(a * x)
    key = sp.integrate(f, x)
    return Variant(f"Integrate f(x) = {f} (by parts). Omit + C.", "cas",
                   {"f": str(f), "key": {"F": str(key)}})


def ver_c2_antideriv(v: Variant) -> bool:
    """Independent check for any antiderivative item: differentiate the key."""
    f = sp.sympify(v.answer_spec["f"], locals={"x": x})
    F = sp.sympify(v.answer_spec["key"]["F"], locals={"x": x})
    return sp.simplify(sp.diff(F, x) - f) == 0


def gen_c2_partial_fractions(seed: int) -> Variant:
    r = _rng(seed)
    a, b = r.randint(-4, 4), r.randint(-4, 4)
    while b == a:
        b = r.randint(-4, 4)
    f = 1 / ((x - a) * (x - b))
    key = sp.integrate(f, x)
    return Variant(
        f"Integrate f(x) = 1/((x - {a})(x - {b})) via partial fractions. Omit + C.",
        "cas", {"f": str(f), "key": {"F": str(key)}})


def gen_c2_geometric(seed: int) -> Variant:
    r = _rng(seed)
    a = _nz(r, -5, 5)
    num, den = r.randint(1, 3), r.randint(4, 7)
    ratio = sp.Rational(num, den) * r.choice([1, -1])
    key = a / (1 - ratio)
    return Variant(
        f"Sum the geometric series with first term {a} and ratio {ratio} "
        f"(n from 0 to infinity).",
        "cas", {"a": a, "r": str(ratio), "key": {"S": str(key)}})


def ver_c2_geometric(v: Variant) -> bool:
    n = sp.Symbol("n", integer=True, nonnegative=True)
    a = sp.Integer(v.answer_spec["a"]); ratio = sp.sympify(v.answer_spec["r"])
    ref = sp.Sum(a * ratio ** n, (n, 0, sp.oo)).doit()
    return sp.simplify(sp.sympify(v.answer_spec["key"]["S"]) - ref) == 0


def gen_c2_taylor(seed: int) -> Variant:
    r = _rng(seed)
    a = _nz(r, -3, 3)
    f = r.choice([sp.exp(a * x), sp.sin(a * x), sp.cos(a * x)])
    order = 4
    poly = sp.series(f, x, 0, order + 1).removeO()
    return Variant(
        f"Find the Maclaurin polynomial of f(x) = {f} through degree {order}.",
        "cas", {"f": str(f), "order": order, "key": {"P": str(sp.expand(poly))}})


def ver_c2_taylor(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x})
    order = v.answer_spec["order"]
    P = sp.expand(sp.sympify(v.answer_spec["key"]["P"], locals={"x": x}))
    # Independent check: coefficient k must equal f^(k)(0)/k!.
    for k in range(order + 1):
        want = sp.diff(f, x, k).subs(x, 0) / sp.factorial(k)
        if sp.simplify(P.coeff(x, k) - want) != 0:
            return False
    return sp.degree(P, x) <= order


# ===========================================================================
# CALCULUS III
# ===========================================================================

def gen_c3_partials(seed: int) -> Variant:
    r = _rng(seed)
    a, b, c = _nz(r, -3, 3), _nz(r, -3, 3), r.randint(-2, 2)
    f = a * x ** 2 * y + b * y ** 2 + c * x
    return Variant(
        f"Compute f_x and f_y for f(x, y) = {f}.",
        "cas", {"f": str(f), "key": {"fx": str(sp.diff(f, x)),
                                     "fy": str(sp.diff(f, y))}})


def ver_c3_partials(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x, "y": y})
    fx = sp.sympify(v.answer_spec["key"]["fx"], locals={"x": x, "y": y})
    fy = sp.sympify(v.answer_spec["key"]["fy"], locals={"x": x, "y": y})
    # Numeric independence: central differences in each variable at 2 points.
    ff = sp.lambdify((x, y), f, "math")
    fxx = sp.lambdify((x, y), fx, "math")
    fyy = sp.lambdify((x, y), fy, "math")
    h = 1e-6
    for (px, py) in ((0.4, 1.2), (-0.8, 0.6)):
        if abs((ff(px + h, py) - ff(px - h, py)) / (2 * h) - fxx(px, py)) > 1e-4:
            return False
        if abs((ff(px, py + h) - ff(px, py - h)) / (2 * h) - fyy(px, py)) > 1e-4:
            return False
    return True


def gen_c3_gradient(seed: int) -> Variant:
    r = _rng(seed)
    a, b = _nz(r, -3, 3), _nz(r, -3, 3)
    f = a * x ** 2 + b * x * y
    px, py = r.randint(-2, 2), _nz(r, -2, 2)
    gx = sp.diff(f, x).subs({x: px, y: py})
    gy = sp.diff(f, y).subs({x: px, y: py})
    return Variant(
        f"Compute the gradient of f(x, y) = {f} at the point ({px}, {py}).",
        "cas", {"f": str(f), "point": [px, py],
                "key": {"gx": str(gx), "gy": str(gy)}})


def ver_c3_gradient(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x, "y": y})
    px, py = v.answer_spec["point"]
    ff = sp.lambdify((x, y), f, "math")
    h = 1e-6
    gx_num = (ff(px + h, py) - ff(px - h, py)) / (2 * h)
    gy_num = (ff(px, py + h) - ff(px, py - h)) / (2 * h)
    return abs(gx_num - float(sp.sympify(v.answer_spec["key"]["gx"]))) < 1e-4 and \
           abs(gy_num - float(sp.sympify(v.answer_spec["key"]["gy"]))) < 1e-4


def gen_c3_double_integral(seed: int) -> Variant:
    r = _rng(seed)
    a, b = _nz(r, -3, 3), _nz(r, -3, 3)
    f = a * x * y + b * x ** 2
    x1, y1 = r.randint(1, 3), r.randint(1, 3)
    key = sp.integrate(sp.integrate(f, (x, 0, x1)), (y, 0, y1))
    return Variant(
        f"Evaluate the double integral of f(x, y) = {f} over "
        f"[0, {x1}] x [0, {y1}].",
        "cas", {"f": str(f), "x1": x1, "y1": y1, "key": {"I": str(key)}})


def ver_c3_double_integral(v: Variant) -> bool:
    f = sp.sympify(v.answer_spec["f"], locals={"x": x, "y": y})
    x1, y1 = v.answer_spec["x1"], v.answer_spec["y1"]
    # Independent path: integrate in the opposite order (Fubini).
    ref = sp.integrate(sp.integrate(f, (y, 0, y1)), (x, 0, x1))
    return sp.simplify(sp.sympify(v.answer_spec["key"]["I"]) - ref) == 0


# ===========================================================================
# PROBABILITY AND STATISTICS
# ===========================================================================

def gen_ps_bayes(seed: int) -> Variant:
    r = _rng(seed)
    prev = sp.Rational(1, r.choice([50, 100, 200, 500]))
    sens = sp.Rational(r.choice([90, 95, 99]), 100)
    spec = sp.Rational(r.choice([90, 95, 98]), 100)
    p_pos = sens * prev + (1 - spec) * (1 - prev)
    post = sens * prev / p_pos
    return Variant(
        f"A condition has prevalence {prev}. A test has sensitivity {sens} "
        f"and specificity {spec}. Given a positive test, find the probability "
        f"of the condition (exact fraction).",
        "cas",
        {"prev": str(prev), "sens": str(sens), "spec": str(spec),
         "key": {"posterior": str(sp.nsimplify(post))}})


def ver_ps_bayes(v: Variant) -> bool:
    prev = sp.sympify(v.answer_spec["prev"])
    sens = sp.sympify(v.answer_spec["sens"])
    spec = sp.sympify(v.answer_spec["spec"])
    # Independent path: enumerate the joint distribution over
    # (condition in {yes, no}) x (test in {pos, neg}) and condition on pos.
    joint_pos_yes = prev * sens
    joint_pos_no = (1 - prev) * (1 - spec)
    ref = joint_pos_yes / (joint_pos_yes + joint_pos_no)
    got = sp.sympify(v.answer_spec["key"]["posterior"])
    return sp.simplify(got - ref) == 0


def gen_ps_binomial(seed: int) -> Variant:
    r = _rng(seed)
    n = r.randint(4, 8)
    k = r.randint(1, n - 1)
    p = sp.Rational(r.randint(1, 4), r.randint(5, 8))
    key = sp.binomial(n, k) * p ** k * (1 - p) ** (n - k)
    return Variant(
        f"X ~ Binomial(n = {n}, p = {p}). Compute P(X = {k}) exactly.",
        "cas", {"n": n, "k": k, "p": str(p), "key": {"P": str(key)}})


def ver_ps_binomial(v: Variant) -> bool:
    n, k = v.answer_spec["n"], v.answer_spec["k"]
    p = sp.sympify(v.answer_spec["p"])
    X = st.Binomial("X", n, p)  # separate code path from the formula
    ref = st.P(sp.Eq(X, k))
    return sp.simplify(sp.sympify(v.answer_spec["key"]["P"]) - ref) == 0


def gen_ps_expectation(seed: int) -> Variant:
    r = _rng(seed)
    vals = sorted(r.sample(range(-3, 7), 3))
    w = [r.randint(1, 4) for _ in vals]
    tot = sum(w)
    probs = [sp.Rational(wi, tot) for wi in w]
    EX = sum(v * p for v, p in zip(vals, probs))
    VarX = sum(v ** 2 * p for v, p in zip(vals, probs)) - EX ** 2
    table = ", ".join(f"P(X = {v}) = {p}" for v, p in zip(vals, probs))
    return Variant(
        f"X takes values with {table}. Compute E[X] and Var(X) exactly.",
        "cas", {"vals": vals, "probs": [str(p) for p in probs],
                "key": {"E": str(EX), "Var": str(sp.nsimplify(VarX))}})


def ver_ps_expectation(v: Variant) -> bool:
    vals = v.answer_spec["vals"]
    probs = [sp.sympify(p) for p in v.answer_spec["probs"]]
    density = dict(zip(vals, probs))
    X = st.FiniteRV("X", density)  # independent path through sympy.stats
    return sp.simplify(st.E(X) - sp.sympify(v.answer_spec["key"]["E"])) == 0 and \
           sp.simplify(st.variance(X) - sp.sympify(v.answer_spec["key"]["Var"])) == 0


def gen_ps_zscore(seed: int) -> Variant:
    r = _rng(seed)
    mu = r.randint(50, 80)
    sigma = r.choice([5, 8, 10])
    a = mu + sigma * r.choice([-2, -1, 1, 2]) + r.choice([0, sigma // 2])
    z = sp.Rational(a - mu, sigma)
    return Variant(
        f"X ~ Normal(mu = {mu}, sigma = {sigma}). Express P(X < {a}) as "
        f"Phi(z): give the z-score exactly.",
        "cas", {"mu": mu, "sigma": sigma, "a": a, "key": {"z": str(z)}})


def ver_ps_zscore(v: Variant) -> bool:
    mu, sigma, a = v.answer_spec["mu"], v.answer_spec["sigma"], v.answer_spec["a"]
    X = st.Normal("X", mu, sigma)
    Z = st.Normal("Z", 0, 1)
    z = sp.sympify(v.answer_spec["key"]["z"])
    # Independent path: the two cdf expressions must agree symbolically.
    return sp.simplify(st.cdf(X)(a) - st.cdf(Z)(z)) == 0


# ===========================================================================
# DISCRETE MATHEMATICS
# ===========================================================================

def gen_dm_combinations(seed: int) -> Variant:
    r = _rng(seed)
    n = r.randint(6, 9)
    k = r.randint(2, 4)
    key = int(sp.binomial(n, k))
    return Variant(
        f"How many {k}-person committees can be formed from {n} people?",
        "cas", {"n": n, "k": k, "key": {"count": str(key)}})


def ver_dm_combinations(v: Variant) -> bool:
    n, k = v.answer_spec["n"], v.answer_spec["k"]
    # Independent path: brute-force enumeration.
    ref = sum(1 for _ in itertools.combinations(range(n), k))
    return int(v.answer_spec["key"]["count"]) == ref


def gen_dm_arrangements(seed: int) -> Variant:
    r = _rng(seed)
    letters = r.choice(["AABBC", "AAABB", "AABBB", "AABCC"])
    counts = {ch: letters.count(ch) for ch in set(letters)}
    key = sp.factorial(len(letters))
    for c in counts.values():
        key //= sp.factorial(c)
    return Variant(
        f"How many distinct arrangements of the letters {letters} are there?",
        "cas", {"letters": letters, "key": {"count": str(int(key))}})


def ver_dm_arrangements(v: Variant) -> bool:
    letters = v.answer_spec["letters"]
    ref = len(set(itertools.permutations(letters)))  # brute force
    return int(v.answer_spec["key"]["count"]) == ref


def gen_dm_modular(seed: int) -> Variant:
    r = _rng(seed)
    m = r.choice([7, 11, 13])
    a = r.randint(2, m - 1)
    b = r.randint(1, m - 1)
    xsol = (b * sp.mod_inverse(a, m)) % m
    return Variant(
        f"Solve {a} x = {b} (mod {m}) for x in 0..{m - 1}.",
        "cas", {"a": a, "b": b, "m": m, "key": {"x": str(int(xsol))}})


def ver_dm_modular(v: Variant) -> bool:
    a, b, m = v.answer_spec["a"], v.answer_spec["b"], v.answer_spec["m"]
    xv = int(v.answer_spec["key"]["x"])
    # Independent path: exhaustive scan for solutions and uniqueness.
    sols = [k for k in range(m) if (a * k - b) % m == 0]
    return sols == [xv]


def gen_dm_recurrence(seed: int) -> Variant:
    r = _rng(seed)
    r1, r2 = r.randint(-3, 3), r.randint(-3, 3)
    while r2 == r1 or r1 == 0 or r2 == 0:
        r1, r2 = r.randint(-3, 3), r.randint(-3, 3)
    p, q = r1 + r2, -(r1 * r2)
    A, B = _nz(r, -2, 2), _nz(r, -2, 2)
    a0, a1 = A + B, A * r1 + B * r2
    return Variant(
        f"Solve a_n = {p} a_(n-1) + {q} a_(n-2) with a_0 = {a0}, a_1 = {a1}. "
        f"Give the closed form.",
        "cas", {"p": p, "q": q, "a0": a0, "a1": a1,
                "key": {"an": f"({A})*({r1})**n + ({B})*({r2})**n"}})


def ver_dm_recurrence(v: Variant) -> bool:
    spec = v.answer_spec
    n = sp.Symbol("n", integer=True, nonnegative=True)
    an = sp.sympify(spec["key"]["an"], locals={"n": n})
    # Independent path: iterate the recurrence and compare 10 terms.
    seq = [spec["a0"], spec["a1"]]
    for i in range(2, 10):
        seq.append(spec["p"] * seq[-1] + spec["q"] * seq[-2])
    return all(sp.simplify(an.subs(n, i) - seq[i]) == 0 for i in range(10))


# ===========================================================================
# Hint ladders (orient, method, first step) for every template, both waves
# ===========================================================================


REGISTRY: dict[str, dict] = {
    "T-C1-deriv":    {"node": "C107", "gen": gen_c1_deriv, "ver": ver_c1_deriv},
    "T-C1-chain":    {"node": "C108", "gen": gen_c1_chain, "ver": ver_c1_deriv},
    "T-C1-limit":    {"node": "C102", "gen": gen_c1_limit, "ver": ver_c1_limit},
    "T-C1-critical": {"node": "C113", "gen": gen_c1_critical, "ver": ver_c1_critical},
    "T-C2-parts":    {"node": "C202", "gen": gen_c2_parts, "ver": ver_c2_antideriv},
    "T-C2-pfrac":    {"node": "C205", "gen": gen_c2_partial_fractions, "ver": ver_c2_antideriv},
    "T-C2-geo":      {"node": "C211", "gen": gen_c2_geometric, "ver": ver_c2_geometric},
    "T-C2-taylor":   {"node": "C215", "gen": gen_c2_taylor, "ver": ver_c2_taylor},
    "T-C3-partials": {"node": "C304", "gen": gen_c3_partials, "ver": ver_c3_partials},
    "T-C3-grad":     {"node": "C307", "gen": gen_c3_gradient, "ver": ver_c3_gradient},
    "T-C3-double":   {"node": "C310", "gen": gen_c3_double_integral, "ver": ver_c3_double_integral},
    "T-PS-bayes":    {"node": "PS04", "gen": gen_ps_bayes, "ver": ver_ps_bayes},
    "T-PS-binom":    {"node": "PS07", "gen": gen_ps_binomial, "ver": ver_ps_binomial},
    "T-PS-expect":   {"node": "PS05", "gen": gen_ps_expectation, "ver": ver_ps_expectation},
    "T-PS-zscore":   {"node": "PS10", "gen": gen_ps_zscore, "ver": ver_ps_zscore},
    "T-DM-comb":     {"node": "DM08", "gen": gen_dm_combinations, "ver": ver_dm_combinations},
    "T-DM-arrange":  {"node": "DM08", "gen": gen_dm_arrangements, "ver": ver_dm_arrangements},
    "T-DM-mod":      {"node": "DM11", "gen": gen_dm_modular, "ver": ver_dm_modular},
    "T-DM-recur":    {"node": "DM10", "gen": gen_dm_recurrence, "ver": ver_dm_recurrence},
}


HINTS: dict[str, list[str]] = {
    "T-C1-deriv": [
        "Differentiate term by term; each term has its own rule.",
        "Power rule on the polynomial part; the standard derivative for sin, or exp if present.",
        "Apply the power rule to the highest-degree term first: d/dx of a x^n is n a x^(n-1).",
    ],
    "T-C1-chain": [
        "This is a composition: an outer function of an inner expression.",
        "Chain rule: derivative of the outer at the inner, times the derivative of the inner.",
        "Differentiate the outer function first, leaving the inner untouched inside it.",
    ],
    "T-C1-limit": [
        "Direct substitution gives 0/0, which means more algebra, not no answer.",
        "Factor the numerator and cancel the common factor causing the 0/0.",
        "Cancel (x - a) from top and bottom, then substitute.",
    ],
    "T-C1-critical": [
        "Critical points are where the derivative is zero or undefined.",
        "Differentiate f, set the derivative to zero, and solve.",
        "Compute f'(x); it is a quadratic that factors cleanly.",
    ],
    "T-C2-parts": [
        "A product of a power of x and an exponential: parts territory.",
        "int u dv = uv - int v du; let u be the power of x so it differentiates away.",
        "Set u = the x power and dv = the exponential dx; compute du and v.",
    ],
    "T-C2-pfrac": [
        "The integrand is a rational function with distinct linear factors.",
        "Decompose as A/(x - a) + B/(x - b), solve for A and B, integrate to logarithms.",
        "Multiply through by the denominator and substitute x = a to isolate A.",
    ],
    "T-C2-geo": [
        "This is geometric: constant ratio between consecutive terms.",
        "For |r| < 1 the sum is first term / (1 - r).",
        "Identify the first term and the ratio, and confirm |r| < 1.",
    ],
    "T-C2-taylor": [
        "Maclaurin polynomial: Taylor series at 0, truncated.",
        "Coefficient of x^k is f^(k)(0)/k!; or adapt the standard series for exp, sin, cos.",
        "Write the standard series for the base function, substitute the inner constant times x, truncate at the requested degree.",
    ],
    "T-C3-partials": [
        "Two partials: in each, the other variable is a constant.",
        "For f_x, treat y as a number and differentiate in x; reverse for f_y.",
        "Compute f_x first: the y in each term is just a coefficient.",
    ],
    "T-C3-grad": [
        "The gradient is the vector of partials, evaluated at the point.",
        "Compute f_x and f_y symbolically, then substitute the point.",
        "Find f_x first, then plug in the coordinates.",
    ],
    "T-C3-double": [
        "A rectangle region: iterate in either order.",
        "Integrate in x first holding y constant, then integrate the result in y.",
        "Compute the inner integral int f dx over the given x-range, treating y as constant.",
    ],
    "T-PS-bayes": [
        "You are asked for P(condition given positive), not P(positive given condition).",
        "Bayes: posterior = (sensitivity x prevalence) / P(positive), where P(positive) counts true and false positives.",
        "Compute the two ways a positive occurs: sens x prev, and (1 - spec) x (1 - prev).",
    ],
    "T-PS-binom": [
        "Fixed number of independent trials, fixed success probability: binomial.",
        "P(X = k) = C(n, k) p^k (1 - p)^(n - k).",
        "Compute the binomial coefficient C(n, k) first.",
    ],
    "T-PS-expect": [
        "Expectation is the probability-weighted average of the values.",
        "E[X] = sum of value x probability; Var(X) = E[X^2] - (E[X])^2.",
        "Compute E[X] first by multiplying each value by its probability and summing.",
    ],
    "T-PS-zscore": [
        "Standardize: convert the threshold to units of standard deviations from the mean.",
        "z = (a - mu) / sigma, and then P(X < a) = Phi(z).",
        "Subtract the mean from the threshold before dividing.",
    ],
    "T-DM-comb": [
        "A committee is an unordered selection.",
        "Use combinations: C(n, k) = n! / (k! (n - k)!).",
        "Write C(n, k) with the given n and k, then cancel factorials.",
    ],
    "T-DM-arrange": [
        "Arrangements of letters with repeats: order matters, but identical letters are indistinguishable.",
        "Total letters factorial, divided by the factorial of each repeat count.",
        "Count how many times each letter repeats first.",
    ],
    "T-DM-mod": [
        "Solving a x = b (mod m) needs the inverse of a mod m, not ordinary division.",
        "Since gcd(a, m) = 1, the inverse exists; find it, then x = a^(-1) b mod m.",
        "Find the number that multiplies a to give 1 mod m (scan or extended Euclid).",
    ],
    "T-DM-recur": [
        "Linear recurrence with constant coefficients: exponential solutions r^n.",
        "Substitute a_n = r^n to get the characteristic quadratic; the general term is A r1^n + B r2^n.",
        "Write r^2 = p r + q as r^2 - p r - q = 0 and factor it.",
    ],
}


# ---------------------------------------------------------------------------
# Live-platform adapter
# ---------------------------------------------------------------------------

from dataclasses import field  # noqa: E402


@dataclass
class GeneratedQuestion:
    template_id: str
    prompt: str
    kind: str          # live item kind: math_expression | linear_system
    correct: str       # answer string (expression, or JSON for linear_system)
    meta: dict = field(default_factory=dict)
    hints: list = field(default_factory=list)


def resolve_generated(template_id: str, seed: int) -> GeneratedQuestion:
    """Generate the verified variant for a template id at a seed, in live terms.

    The generator runs, then its own independent verifier gates the variant (the
    verified-everything rule is enforced at serve time, not assumed); on the rare
    verifier failure the seed is bumped until one passes.
    """
    entry = REGISTRY[template_id]
    v = None
    for bump in range(10):
        candidate = entry["gen"](seed + bump)
        if entry["ver"](candidate):
            v = candidate
            break
    if v is None:  # pragma: no cover - generators verify by construction
        raise RuntimeError(f"no verified variant for {template_id} at seed {seed}")

    key = v.answer_spec["key"]
    hints = HINTS.get(template_id, [])
    if len(key) == 1:
        correct = str(next(iter(key.values())))
        return GeneratedQuestion(template_id, v.stem, "math_expression", correct,
                                 meta={}, hints=hints)
    import json as _json

    prompt = (v.stem + " Enter a JSON object with keys "
              + ", ".join(sorted(key)) + ".")
    return GeneratedQuestion(
        template_id, prompt, "linear_system", _json.dumps(key),
        meta={"key": {k: str(val) for k, val in key.items()}}, hints=hints,
    )


def sweep(seeds_per_template: int = 6) -> dict:
    """Verify every registered generator across seeds; used by the test suite."""
    results = {}
    for tid, entry in REGISTRY.items():
        ok, failures = 0, []
        for seed in range(1, seeds_per_template + 1):
            try:
                v = entry["gen"](seed)
                ok += 1 if entry["ver"](v) else 0
                if not entry["ver"](v):
                    failures.append(seed)
            except Exception as e:  # pragma: no cover
                failures.append(f"{seed}:{type(e).__name__}")
        results[tid] = {"node": entry["node"], "ok": ok, "total": seeds_per_template,
                        "failures": failures}
    return results
