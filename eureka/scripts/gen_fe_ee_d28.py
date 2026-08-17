#!/usr/bin/env python3
"""Depth-wave-28 figures for the FE Electrical and Computer course:
the two Mathematics chapters on discrete mathematics (fee_discrete_math) and
analytic geometry (fee_analytic_geom).

Same contract as gen_fe_ee_d20.py, and it imports the SAME style module rather
than growing a second look. Every curve, every point and every count here is
COMPUTED, in this file, from a definition the lesson that references it writes
out; nothing is traced, scanned, redrawn or adapted from the NCEES Reference
Handbook or from any textbook. Counting results and conic properties are not
protected expression - this pipeline consumes definitions and never anyone's
drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

VERIFICATION POLICY FOR THIS FILE

  - Every COUNT that appears in a figure is produced twice: once by exhaustive
    enumeration of the actual objects (subsets, permutations, edge sets, truth
    tables), once by the closed form the lesson prints. The assertion compares
    the two. A formula that agrees with itself proves nothing; a formula that
    agrees with a list of the things it claims to count does.
  - Every CONIC property is checked by sampling points that genuinely lie on
    the curve and evaluating the DEFINING distance relation at each one, at a
    tolerance of 1e-9 or tighter, which for these closed forms is machine
    precision rather than a generous band.

Usage:
    python3 scripts/gen_fe_ee_d28.py                 # all
    python3 scripts/gen_fe_ee_d28.py math5-ag        # only names with that prefix
"""
from __future__ import annotations

import itertools as it
import math
import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle, Polygon  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

PREFIX = "math5-"
REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only the {PREFIX} prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# --------------------------------------------------------------- primitives
def enumerate_subsets(pool, size):
    """The actual list, not a count - so a count taken from it cannot be wrong."""
    return list(it.combinations(pool, size))


def spanning_trees_by_enumeration(n, edges):
    """Try every (n-1)-subset of edges and keep the acyclic connected ones."""
    total = 0
    for sub in it.combinations(edges, n - 1):
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        ok = True
        for u, w in sub:
            ru, rw = find(u), find(w)
            if ru == rw:
                ok = False
                break
            parent[ru] = rw
        if ok and len({find(i) for i in range(n)}) == 1:
            total += 1
    return total


def spanning_trees_by_matrix(n, edges):
    """Kirchhoff's matrix-tree theorem: any cofactor of the Laplacian."""
    L = np.zeros((n, n))
    for u, w in edges:
        L[u, u] += 1.0
        L[w, w] += 1.0
        L[u, w] -= 1.0
        L[w, u] -= 1.0
    return round(float(np.linalg.det(L[1:, 1:])))


def iterate_recurrence(c1, c2, a0, a1, n):
    seq = [a0, a1]
    for _ in range(n - 1):
        seq.append(c1 * seq[-1] + c2 * seq[-2])
    return seq


# ===========================================================================
# fee_discrete_math
# ===========================================================================


@figure("math5-dm-venn-three")
def _(mode):
    """Three-set inclusion-exclusion, drawn with the SEVEN region populations.

    Universe 1..1000; A, B, C are the multiples of 2, 3, 5. Every one of the
    seven regions is counted by listing the integers in it, and the region
    totals are then checked against the inclusion-exclusion formula.
    """
    c = S.SERIES[mode]
    N = 1000
    A = {k for k in range(1, N + 1) if k % 2 == 0}
    B = {k for k in range(1, N + 1) if k % 3 == 0}
    C = {k for k in range(1, N + 1) if k % 5 == 0}

    only_a = len(A - B - C)
    only_b = len(B - A - C)
    only_c = len(C - A - B)
    ab = len((A & B) - C)
    ac = len((A & C) - B)
    bc = len((B & C) - A)
    abc = len(A & B & C)
    outside = N - len(A | B | C)

    # enumerated regions must reproduce the enumerated union
    assert (only_a, only_b, only_c) == (267, 134, 67), (only_a, only_b, only_c)
    assert (ab, ac, bc, abc) == (133, 67, 33, 33), (ab, ac, bc, abc)
    assert only_a + only_b + only_c + ab + ac + bc + abc == len(A | B | C) == 734
    assert outside == 266
    # and the closed form must reproduce it too
    ie = (len(A) + len(B) + len(C) - len(A & B) - len(A & C) - len(B & C)
          + len(A & B & C))
    assert ie == 734, ie
    assert (len(A), len(B), len(C)) == (500, 333, 200)
    assert (len(A & B), len(A & C), len(B & C)) == (166, 100, 66)
    # floor counts, computed the third way
    assert len(A & B) == N // 6 and len(A & C) == N // 10 and len(B & C) == N // 15
    assert abc == N // 30

    fig, ax = plt.subplots(figsize=(7.2, 5.0))
    R = 1.62
    ctr = {
        "A": (-0.80, 0.46),
        "B": (0.80, 0.46),
        "C": (0.0, -0.86),
    }
    for (key, hue) in zip(("A", "B", "C"), c):
        ax.add_patch(Circle(ctr[key], R, facecolor=hue, alpha=0.16, edgecolor=hue, lw=2.0))

    lab = [
        (-1.42, 0.92, f"{only_a}", "only 2"),
        (1.42, 0.92, f"{only_b}", "only 3"),
        (0.0, -1.72, f"{only_c}", "only 5"),
        (0.0, 1.06, f"{ab}", "2 and 3"),
        (-0.92, -0.44, f"{ac}", "2 and 5"),
        (0.92, -0.44, f"{bc}", "3 and 5"),
        (0.0, 0.02, f"{abc}", "all three"),
    ]
    for x, y, big, small in lab:
        ax.text(x, y, big, ha="center", va="center", fontsize=13,
                fontweight="bold", color=S.INK[mode])
        ax.text(x, y - 0.30, small, ha="center", va="center", fontsize=8.5,
                color=S.INK_2[mode])
    S.label_end(ax, -3.05, 1.98, "multiples of 2  (500)", c[0], mode, dx=0, ha="left")
    S.label_end(ax, 3.05, 1.98, "multiples of 3  (333)", c[1], mode, dx=0, ha="right")
    S.label_end(ax, 0.0, -2.58, "multiples of 5  (200)", c[2], mode, dx=0, ha="center")
    S.note(ax, 0.0, -3.16,
           f"seven regions sum to {only_a + only_b + only_c + ab + ac + bc + abc}; "
           f"{outside} of the 1000 integers lie outside all three", mode, ha="center")
    ax.set_xlim(-3.15, 3.15)
    ax.set_ylim(-3.45, 2.40)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title("Inclusion-exclusion is a seven-region bookkeeping problem")
    return fig


@figure("math5-dm-four-families")
def _(mode):
    """The four counting families for n = 8, plotted against the sample size k.

    Every plotted value is confirmed against an exhaustive enumeration of the
    objects it claims to count, for every k where the enumeration is cheap.
    """
    c = S.SERIES[mode]
    n = 8
    ks = np.arange(1, 9)
    with_rep_ord = np.array([n ** k for k in ks], dtype=float)
    no_rep_ord = np.array([math.perm(n, k) for k in ks], dtype=float)
    no_rep_un = np.array([math.comb(n, k) for k in ks], dtype=float)
    with_rep_un = np.array([math.comb(n + k - 1, k) for k in ks], dtype=float)

    pool = list(range(n))
    for k in (1, 2, 3, 4):
        assert len(list(it.product(pool, repeat=k))) == n ** k
        assert len(list(it.permutations(pool, k))) == math.perm(n, k)
        assert len(enumerate_subsets(pool, k)) == math.comb(n, k)
        assert len(list(it.combinations_with_replacement(pool, k))) == math.comb(n + k - 1, k)
    # the four counts at k = 3, quoted in the lesson
    assert (n ** 3, math.perm(n, 3), math.comb(n, 3), math.comb(10, 3)) == (512, 336, 56, 120)
    assert math.perm(n, 3) == math.comb(n, 3) * math.factorial(3)
    assert sum(math.comb(n, k) for k in range(n + 1)) == 2 ** n == 256

    fig, (top, bot) = plt.subplots(2, 1, figsize=(7.2, 5.6), sharex=True)
    top.plot(ks, with_rep_ord, color=c[0], lw=2.2, marker="o")
    top.plot(ks, no_rep_ord, color=c[1], lw=2.2, marker="o")
    S.label_end(top, 5.0, with_rep_ord[4], "$n^k$  repeats allowed", c[0], mode, dx=-10,
                dy=12, ha="right")
    S.label_end(top, 6.0, no_rep_ord[5], "$P(n,k)$  all distinct", c[1], mode, dx=4,
                dy=-16, ha="left")
    top.set_yscale("log")
    top.set_ylim(3, 1e9)
    top.set_ylabel("arrangements")
    top.set_title("Order matters (top), order does not (bottom):  n = 8")
    S.strip(top)

    bot.plot(ks, with_rep_un, color=c[0], lw=2.2, marker="o")
    bot.plot(ks, no_rep_un, color=c[1], lw=2.2, marker="o")
    S.label_end(bot, 6.0, with_rep_un[5], "$C(n+k-1,k)$  repeats allowed", c[0], mode,
                dx=-10, dy=12, ha="right")
    S.label_end(bot, 4.0, no_rep_un[3], "$C(n,k)$  all distinct", c[1], mode, dx=-10,
                dy=-16, ha="right")
    bot.set_yscale("log")
    bot.set_ylim(0.5, 3e4)
    bot.set_xlabel("sample size  k")
    bot.set_ylabel("selections")
    S.note(bot, 6.15, 1.1, "at k = 3 the four answers are\n512, 336, 120 and 56", mode)
    S.strip(bot)
    return fig


@figure("math5-dm-pigeonhole")
def _(mode):
    """The fullest bin cannot be smaller than the ceiling of m/n.

    The staircase is ceil(m/4); the markers are the true minimum of the fullest
    bin, found by enumerating EVERY way of splitting m items among four bins.
    """
    c = S.SERIES[mode]
    ms = np.arange(1, 33)
    ceil = np.array([math.ceil(m / 4) for m in ms], dtype=float)
    even = ms / 4.0

    enumerated = []
    for m in range(1, 33):
        best = min(max(t) for t in it.product(range(m + 1), repeat=4) if sum(t) == m)
        enumerated.append(best)
    enumerated = np.array(enumerated, dtype=float)
    assert np.array_equal(enumerated, ceil), (enumerated, ceil)
    assert enumerated[24] == 7.0 and ms[24] == 25   # the worked case, 25 items

    fig, ax = plt.subplots()
    ax.step(ms, ceil, where="mid", color=c[0], lw=2.2)
    ax.plot(ms, even, color=c[1], lw=2.0, ls=(0, (5, 3)))
    ax.plot(ms, enumerated, "o", color=S.INK[mode], ms=4.0, zorder=5)
    S.label_end(ax, 12.6, 4.0, "guaranteed fullest bin  $\\lceil m/4 \\rceil$", c[0],
                mode, dx=-2, dy=16, ha="left")
    S.label_end(ax, 25.8, 6.45, "perfectly even split  $m/4$", c[1], mode, dx=6,
                dy=-14, ha="left")
    ax.plot([25], [7], "o", color=S.INK[mode], ms=9, markerfacecolor="none",
            markeredgewidth=1.8, zorder=6)
    S.note(ax, 0.6, 8.55, "black dots are the true minimum of the fullest bin, found\n"
                          "by enumerating every split of m among four bins", mode)
    S.note(ax, 12.5, 1.1, "25 resistors, 4 tolerance bins:\nsome bin holds at least 7", mode)
    ax.set_xlabel("items placed,  m")
    ax.set_ylabel("items in the fullest bin")
    ax.set_title("Pigeonhole: the fullest bin has a floor you cannot get under")
    ax.set_xlim(0, 36)
    ax.set_ylim(0, 10.2)
    S.strip(ax)
    return fig


@figure("math5-dm-pascal-rows")
def _(mode):
    """Two rows of Pascal's triangle as stems, with their row sums.

    Each coefficient is checked against an exhaustive count of the subsets it
    claims to count, and each row sum against the number of subsets of the row's
    ground set.
    """
    c = S.SERIES[mode]
    for n in (6, 10):
        pool = list(range(n))
        for k in range(n + 1):
            assert len(enumerate_subsets(pool, k)) == math.comb(n, k)
        assert sum(math.comb(n, k) for k in range(n + 1)) == 2 ** n
    assert math.comb(10, 5) == 252 and math.comb(6, 3) == 20
    assert math.comb(7, 3) == math.comb(6, 2) + math.comb(6, 3) == 35
    assert sum((-1) ** k * math.comb(10, k) for k in range(11)) == 0

    row6 = [math.comb(6, k) for k in range(7)]
    row10 = [math.comb(10, k) for k in range(11)]

    fig, ax = plt.subplots()
    ax.vlines(range(7), 0, row6, color=c[0], lw=3.0, alpha=0.9)
    ax.plot(range(7), row6, "o", color=c[0], ms=7)
    ax.vlines(np.arange(11) + 0.16, 0, row10, color=c[1], lw=3.0, alpha=0.9)
    ax.plot(np.arange(11) + 0.16, row10, "o", color=c[1], ms=7)
    S.label_end(ax, 1.0, 6.0, f"row 6, sum {sum(row6)}", c[0], mode, dx=-4, dy=16,
                ha="center")
    S.label_end(ax, 5.16, 252, f"row 10, sum {sum(row10)}", c[1], mode, dx=8, dy=6)
    S.note(ax, 7.1, 170.0, "each entry is the sum of the two\nabove it: "
                           "C(7,3) = C(6,2) + C(6,3),\nthat is 35 = 15 + 20", mode)
    ax.set_xlabel("number chosen,  k")
    ax.set_ylabel("$C(n,k)$")
    ax.set_title("Binomial coefficients: two rows, and what their totals mean")
    ax.set_xlim(-0.7, 11.3)
    ax.set_ylim(0, 300)
    S.strip(ax)
    return fig


@figure("math5-dm-recurrence")
def _(mode):
    """Two things a characteristic root tells you, on one shared index axis.

    Top: complex roots 1 +- i give an oscillation inside a 2^(n/2) envelope.
    Bottom: distinct real roots 2 and 3 make the term ratio settle on the
    dominant root, 3. Both panels compare the ITERATED sequence with the closed
    form, term by term.
    """
    c = S.SERIES[mode]
    n = np.arange(0, 15)
    osc = iterate_recurrence(2, -2, 1, 1, 14)
    closed = [2 ** (k / 2) * math.cos(k * math.pi / 4) for k in range(15)]
    assert all(abs(a - b) < 1e-9 for a, b in zip(osc, closed)), list(zip(osc, closed))
    assert osc[:9] == [1, 1, 0, -2, -4, -4, 0, 8, 16], osc[:9]

    real = iterate_recurrence(5, -6, 2, 5, 20)
    closed_real = [2 ** k + 3 ** k for k in range(21)]
    assert real == closed_real, (real[:8], closed_real[:8])
    assert real[:6] == [2, 5, 13, 35, 97, 275]
    ratio = [real[k + 1] / real[k] for k in range(14)]
    assert abs(ratio[-1] - 3.0) < 0.02, ratio[-1]

    fig, (top, bot) = plt.subplots(2, 1, figsize=(7.2, 5.6), sharex=True)
    env = 2 ** (n / 2.0)
    top.plot(n, env, color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    top.plot(n, -env, color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    top.vlines(n, 0, osc, color=c[0], lw=2.4)
    top.plot(n, osc, "o", color=c[0], ms=6)
    top.axhline(0, color=S.GUIDE[mode], lw=1.0)
    S.label_end(top, 12.6, env[12], "envelope  $\\pm 2^{n/2}$", S.INK_2[mode], mode,
                dx=-6, dy=14, ha="right")
    S.label_end(top, 0.2, 92.0, "$a_n = 2a_{n-1} - 2a_{n-2}$,  roots $1 \\pm i$",
                c[0], mode, dx=0, dy=0, ha="left")
    top.set_ylim(-150, 150)
    top.set_ylabel("$a_n$")
    top.set_title("What the characteristic roots predict, checked term by term")
    S.strip(top)

    bot.plot(n[:14], ratio, color=c[1], lw=2.2, marker="o")
    bot.axhline(3.0, color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    S.label_end(bot, 13, ratio[-1], "$a_n / a_{n-1} \\to 3$, the dominant root", c[1],
                mode, dx=-8, dy=-16, ha="right")
    S.note(bot, 0.4, 3.05, "for $a_n = 5a_{n-1} - 6a_{n-2}$ the roots are 2 and 3", mode)
    bot.set_xlabel("index  n")
    bot.set_ylabel("term ratio")
    bot.set_ylim(2.35, 3.25)
    S.strip(bot)
    return fig


@figure("math5-dm-ladder")
def _(mode):
    """A resistive ladder is a second-order difference equation with two modes.

    Node voltages come from an independent linear solve; the curve is the
    two-mode closed form fitted to the source and the first node. They agree to
    1e-9, which is the point: the recurrence is not an analogy, it is the
    circuit.
    """
    c = S.SERIES[mode]
    G = np.array([[3.0, -1.0, 0.0], [-1.0, 3.0, -1.0], [0.0, -1.0, 2.0]])
    v = np.linalg.solve(G, np.array([10.0, 0.0, 0.0]))
    exact = np.array([50.0 / 13.0, 20.0 / 13.0, 10.0 / 13.0])
    assert np.max(np.abs(v - exact)) < 1e-12, v
    nodes = np.array([10.0, *v])
    # the interior nodes really satisfy V_(k-1) + V_(k+1) = 3 V_k
    assert abs(nodes[0] + nodes[2] - 3 * nodes[1]) < 1e-12
    assert abs(nodes[1] + nodes[3] - 3 * nodes[2]) < 1e-12

    rp = (3.0 + math.sqrt(5.0)) / 2.0
    rm = (3.0 - math.sqrt(5.0)) / 2.0
    assert abs(rp * rm - 1.0) < 1e-12 and abs(rp + rm - 3.0) < 1e-12
    AB = np.linalg.solve(np.array([[1.0, 1.0], [rp, rm]]),
                         np.array([nodes[0], nodes[1]]))
    kk = np.linspace(0.0, 3.0, 400)
    model = AB[0] * rp ** kk + AB[1] * rm ** kk
    pred = AB[0] * rp ** np.arange(4) + AB[1] * rm ** np.arange(4)
    assert np.max(np.abs(pred - nodes)) < 1e-9, (pred, nodes)
    pure = nodes[0] * rm ** kk

    fig, ax = plt.subplots()
    ax.plot(kk, model, color=c[0], lw=2.2)
    ax.plot(kk, pure, color=c[1], lw=2.0, ls=(0, (5, 3)))
    ax.plot(np.arange(4), nodes, "o", color=S.INK[mode], ms=8, zorder=5)
    im = int(np.argmin(np.abs(kk - 2.35)))
    S.label_end(ax, kk[im], model[im], "two-mode fit  $Ar_+^k + Br_-^k$", c[0], mode,
                dx=8, dy=14)
    S.label_end(ax, kk[im], pure[im], "decaying mode alone  $10\\,r_-^k$", c[1], mode,
                dx=6, dy=-18)
    for k, val in enumerate(nodes):
        if k == 3:
            S.note(ax, k - 0.07, val * 0.78, f"{val:.4f} V", mode, size=8.5, ha="right")
        else:
            S.note(ax, k + 0.07, val * 1.14, f"{val:.4f} V", mode, size=8.5)
    S.note(ax, 0.05, 0.60, "roots of $r^2 - 3r + 1 = 0$ are 2.618034 and 0.381966;\n"
                           "black dots are an independent linear solve of the network",
           mode)
    ax.set_yscale("log")
    ax.set_xlabel("ladder node index  k")
    ax.set_ylabel("node voltage  (V)")
    ax.set_title("A resistor ladder solved as a difference equation")
    ax.set_xlim(-0.15, 3.35)
    ax.set_ylim(0.5, 20)
    S.strip(ax)
    return fig


@figure("math5-dm-spanning-trees")
def _(mode):
    """Spanning-tree counts, enumerated and then checked against two formulas.

    Complete graphs against Cayley's n^(n-2); cycles against the obvious count
    n. The markers come from enumerating every (n-1)-subset of edges and testing
    it, so nothing here rests on the formula being remembered correctly.
    """
    c = S.SERIES[mode]
    ns = list(range(3, 8))
    complete, cycles = [], []
    for n in ns:
        e = list(it.combinations(range(n), 2))
        cnt = spanning_trees_by_enumeration(n, e)
        assert cnt == n ** (n - 2), (n, cnt)
        assert cnt == spanning_trees_by_matrix(n, e), (n, cnt)
        complete.append(cnt)
        ring = [(i, (i + 1) % n) for i in range(n)]
        cyc = spanning_trees_by_enumeration(n, ring)
        assert cyc == n == spanning_trees_by_matrix(n, ring), (n, cyc)
        cycles.append(cyc)
    assert complete[:4] == [3, 16, 125, 1296], complete
    # the diamond: K4 with one edge removed
    dia = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3)]
    assert spanning_trees_by_enumeration(4, dia) == spanning_trees_by_matrix(4, dia) == 8

    fig, ax = plt.subplots()
    smooth = np.linspace(3, 7, 300)
    ax.plot(smooth, smooth ** (smooth - 2), color=c[0], lw=2.0, ls=(0, (5, 3)))
    ax.plot(ns, complete, "o", color=c[0], ms=9)
    ax.plot(ns, cycles, "o-", color=c[1], lw=2.2, ms=8)
    S.label_end(ax, 6.0, complete[3], "complete graph $K_n$:  $n^{\\,n-2}$", c[0], mode,
                dx=-10, dy=14, ha="right")
    S.label_end(ax, 6.0, cycles[3], "cycle $C_n$:  $n$", c[1], mode, dx=-10, dy=-16,
                ha="right")
    S.note(ax, 3.05, 6500.0, "markers are exhaustive enumerations of every\n"
                             "(n-1)-edge subset; the dashed curve is Cayley's formula",
           mode)
    S.note(ax, 4.55, 1.62, "$K_4$ has 16 spanning trees;\nremove one edge and 8 remain",
           mode)
    ax.set_yscale("log")
    ax.set_xlabel("vertices  n")
    ax.set_ylabel("spanning trees")
    ax.set_title("How many spanning trees a graph has")
    ax.set_xlim(2.8, 7.6)
    ax.set_ylim(1.5, 30000)
    S.strip(ax)
    return fig


@figure("math5-dm-boolean-explosion")
def _(mode):
    """Truth-table rows against distinct Boolean functions, both enumerated.

    2^n rows, and 2^(2^n) functions on those rows. Both counts are confirmed by
    building the actual objects for the small cases.
    """
    c = S.SERIES[mode]
    ns = np.arange(1, 6)
    rows = np.array([2 ** n for n in ns], dtype=float)
    funcs = np.array([2 ** (2 ** n) for n in ns], dtype=float)

    for n in (1, 2, 3):
        table = list(it.product((0, 1), repeat=n))
        assert len(table) == 2 ** n
        assert len({tuple(f) for f in it.product((0, 1), repeat=2 ** n)} ) == 2 ** (2 ** n)
    assert list(funcs[:4]) == [4.0, 16.0, 256.0, 65536.0]
    # the two identities the lesson checks exhaustively
    rows2 = list(it.product((0, 1), repeat=2))
    rows3 = list(it.product((0, 1), repeat=3))
    assert all((not (a and b)) == ((not a) or (not b)) for a, b in rows2)
    assert all((a or ((not a) and b)) == (a or b) for a, b in rows2)
    assert all(((a and b) or ((not a) and c_) or (b and c_))
               == ((a and b) or ((not a) and c_)) for a, b, c_ in rows3)

    fig, ax = plt.subplots()
    ax.plot(ns, rows, color=c[0], lw=2.2, marker="o")
    ax.plot(ns, funcs, color=c[1], lw=2.2, marker="o")
    S.label_end(ax, 4.6, rows[3], "truth-table rows  $2^{n}$", c[0], mode, dx=-8, dy=-16,
                ha="right")
    S.label_end(ax, 4.0, funcs[3], "distinct functions  $2^{2^{n}}$", c[1], mode, dx=-10,
                dy=16, ha="right")
    for k, n in enumerate(ns[:4]):
        S.note(ax, n + 0.08, funcs[k] * 2.2, f"{int(funcs[k])}", mode, size=8.5)
    S.note(ax, 1.05, 1.2e7, "four variables already admit 65 536 functions -\n"
                            "which is why simplification is a method, not a habit", mode)
    ax.set_yscale("log")
    ax.set_xlabel("input variables  n")
    ax.set_ylabel("count")
    ax.set_title("Why Boolean simplification is not optional")
    ax.set_xlim(0.8, 5.8)
    ax.set_ylim(1, 1e10)
    S.strip(ax)
    return fig


# ===========================================================================
# fee_analytic_geom
# ===========================================================================


@figure("math5-ag-section-formula")
def _(mode):
    """The section formula as two similar right triangles.

    P divides (1,2) -> (9,14) in the ratio 2:3. The claim that P is two fifths
    of the way along is checked by measuring both distances.
    """
    c = S.SERIES[mode]
    Ax, Ay, Bx, By = 1.0, 2.0, 9.0, 14.0
    m, n = 2.0, 3.0
    Px = (n * Ax + m * Bx) / (m + n)
    Py = (n * Ay + m * By) / (m + n)
    assert abs(Px - 4.2) < 1e-12 and abs(Py - 6.8) < 1e-12, (Px, Py)
    whole = math.hypot(Bx - Ax, By - Ay)
    part = math.hypot(Px - Ax, Py - Ay)
    assert abs(part / whole - 0.4) < 1e-12, part / whole
    assert abs(whole - math.sqrt(208.0)) < 1e-12
    Mx, My = (Ax + Bx) / 2.0, (Ay + By) / 2.0
    assert (Mx, My) == (5.0, 8.0)
    # P really is on the segment
    assert abs((Py - Ay) * (Bx - Ax) - (Px - Ax) * (By - Ay)) < 1e-12

    fig, ax = plt.subplots()
    ax.plot([Ax, Bx], [Ay, By], color=c[0], lw=2.4)
    ax.plot([Ax, Px, Ax], [Ay, Ay, Ay], color=S.GUIDE[mode], lw=1.0)
    ax.plot([Ax, Px], [Ay, Ay], color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    ax.plot([Px, Px], [Ay, Py], color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    ax.plot([Px, Bx], [Py, Py], color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    ax.plot([Bx, Bx], [Py, By], color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    ax.plot([Ax, Bx, Px, Mx], [Ay, By, Py, My], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, Ax + 0.2, Ay - 0.85, "A (1, 2)", mode)
    S.note(ax, Bx - 0.15, By + 0.35, "B (9, 14)", mode, ha="right")
    S.note(ax, Px - 0.25, Py + 0.25, "P (4.2, 6.8)", mode, ha="right")
    S.note(ax, Px - 0.25, Py - 0.95, "AP : PB = 2 : 3", mode, ha="right")
    S.note(ax, Mx + 0.3, My + 0.25, "midpoint (5, 8): the case m = n", mode)
    S.note(ax, 2.1, 2.3, "$\\Delta x = 3.2$", mode, size=9)
    S.note(ax, 4.35, 4.2, "$\\Delta y = 4.8$", mode, size=9)
    S.note(ax, 6.4, 6.05, "$\\Delta x = 4.8$", mode, size=9)
    S.note(ax, 9.2, 9.9, "$\\Delta y = 7.2$", mode, size=9)
    S.label_end(ax, 2.2, 12.6, "AB = $\\sqrt{208}$ = 14.4222", c[0], mode, dx=0, dy=0)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("The section formula: similar triangles, twice over")
    ax.set_xlim(0, 12.2)
    ax.set_ylim(0.2, 15.8)
    S.strip(ax)
    return fig


@figure("math5-ag-point-line")
def _(mode):
    """Distance from a point to a line, formula against brute-force minimisation.

    Upper panel: the geometry. Lower panel: the distance from (7,3) to a point
    sliding along 4x - 3y - 5 = 0, whose minimum is the formula's 2.8.
    """
    c = S.SERIES[mode]
    A, B, C = 4.0, -3.0, -5.0
    x0, y0 = 7.0, 3.0
    d = abs(A * x0 + B * y0 + C) / math.hypot(A, B)
    assert abs(d - 2.8) < 1e-12, d
    fx = x0 - d * A / math.hypot(A, B)
    fy = y0 - d * B / math.hypot(A, B)
    assert abs(A * fx + B * fy + C) < 1e-12, (fx, fy)
    assert abs(fx - 4.76) < 1e-12 and abs(fy - 4.68) < 1e-12, (fx, fy)
    xs = np.linspace(-1.0, 11.0, 24001)
    ys = (A * xs + C) / (-B)
    dist = np.hypot(xs - x0, ys - y0)
    assert abs(float(np.min(dist)) - d) < 1e-6, float(np.min(dist))
    assert abs(xs[int(np.argmin(dist))] - fx) < 2e-3

    fig, (top, bot) = plt.subplots(2, 1, figsize=(7.2, 5.8))
    top.plot(xs, ys, color=c[0], lw=2.2)
    top.plot([x0, fx], [y0, fy], color=c[1], lw=2.2)
    top.plot([x0, fx], [y0, fy], "o", color=S.INK[mode], ms=7, zorder=5)
    S.label_end(top, 9.8, (A * 9.8 + C) / (-B), "$4x - 3y - 5 = 0$", c[0], mode, dx=-6,
                dy=10, ha="right")
    S.note(top, x0 + 0.25, y0 - 0.15, "P (7, 3)", mode)
    S.note(top, fx - 0.25, fy + 0.35, "foot (4.76, 4.68)", mode, ha="right")
    S.label_end(top, (x0 + fx) / 2, (y0 + fy) / 2, "d = 14/5 = 2.8", c[1], mode, dx=-4,
                dy=-22, ha="center")
    top.set_ylabel("y")
    top.set_xlim(-0.5, 11)
    top.set_ylim(-3.5, 8)
    top.set_title("One distance, two derivations")
    S.strip(top)

    bot.plot(xs, dist, color=c[1], lw=2.2)
    bot.axhline(2.8, color=S.GUIDE[mode], lw=1.2, ls=(0, (4, 3)))
    bot.plot([fx], [2.8], "o", color=S.INK[mode], ms=8, zorder=5)
    S.note(bot, -0.2, 9.4, "the minimum of the sliding distance is 2.8, exactly what\n"
                           "$|Ax_0 + By_0 + C| / \\sqrt{A^2+B^2}$ returns", mode)
    bot.set_xlabel("x of the point sliding along the line")
    bot.set_ylabel("distance to P")
    bot.set_xlim(-0.5, 11)
    bot.set_ylim(0, 12)
    S.strip(bot)
    return fig


@figure("math5-ag-circle-chord-tangent")
def _(mode):
    """A circle meeting a secant and two tangents from an outside point.

    Intersection points are solved algebraically and substituted back; tangent
    points are located and then checked for perpendicularity to the radius.
    """
    c = S.SERIES[mode]
    r = 5.0
    xs_int = np.roots([1.0, 1.0, -12.0])
    for xr in xs_int:
        assert abs(xr ** 2 + (xr + 1) ** 2 - 25) < 1e-9, xr
    assert abs(max(xs_int) - 3.0) < 1e-12 and abs(min(xs_int) + 4.0) < 1e-12
    chord = math.hypot(3 - (-4), 4 - (-3))
    dcen = abs(1.0) / math.sqrt(2.0)
    assert abs(chord - 2 * math.sqrt(r * r - dcen ** 2)) < 1e-12
    assert abs(chord - 7 * math.sqrt(2.0)) < 1e-12

    Ex, Ey = 8.0, 6.0
    L = math.sqrt(Ex ** 2 + Ey ** 2 - r ** 2)
    assert abs(L - math.sqrt(75.0)) < 1e-12
    tang = []
    for yt in np.roots([4.0, -12.0, -39.0]):
        xt = (25.0 - 6.0 * yt) / 8.0
        assert abs(xt ** 2 + yt ** 2 - 25) < 1e-9
        assert abs(math.hypot(Ex - xt, Ey - yt) - L) < 1e-9
        assert abs((xt - Ex) * xt + (yt - Ey) * yt) < 1e-9   # radius perpendicular
        tang.append((xt, yt))
    assert len(tang) == 2

    t = np.linspace(0, 2 * math.pi, 721)
    fig, ax = plt.subplots(figsize=(7.2, 5.2))
    ax.plot(r * np.cos(t), r * np.sin(t), color=c[0], lw=2.2)
    xl = np.linspace(-6.5, 6.5, 200)
    ax.plot(xl, xl + 1.0, color=c[1], lw=2.0)
    ax.plot([-4, 3], [-3, 4], color=c[1], lw=3.4)
    for (xt, yt) in tang:
        ax.plot([Ex, xt], [Ey, yt], color=c[2], lw=2.0)
        ax.plot([0, xt], [0, yt], color=S.GUIDE[mode], lw=1.1, ls=(0, (4, 3)))
    ax.plot([-4, 3, Ex] + [p[0] for p in tang], [-3, 4, Ey] + [p[1] for p in tang],
            "o", color=S.INK[mode], ms=7, zorder=5)
    S.label_end(ax, 1.6, -4.7, "$x^2 + y^2 = 25$", c[0], mode, dx=6, dy=-6, ha="left")
    S.label_end(ax, -6.2, -5.4, "secant  $y = x + 1$", c[1], mode, dx=0, dy=0)
    S.label_end(ax, 8.0, 6.0, "tangents from (8, 6)", c[2], mode, dx=-4, dy=16,
                ha="right")
    S.note(ax, -4.35, -4.0, "(-4, -3)", mode)
    S.note(ax, 3.25, 4.15, "(3, 4)", mode)
    S.note(ax, -6.9, 6.35, f"chord = $7\\sqrt{{2}}$ = {chord:.4f}\n"
                           f"tangent length = $5\\sqrt{{3}}$ = {L:.4f}", mode)
    ax.set_aspect("equal")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("A circle, a secant, and the two tangents from an outside point")
    ax.set_xlim(-7.0, 10.4)
    ax.set_ylim(-6.6, 7.6)
    S.strip(ax)
    return fig


@figure("math5-ag-focus-directrix")
def _(mode):
    """Focus-directrix: the ratio is the eccentricity, at every point.

    The ellipse x^2/25 + y^2/16 = 1 is sampled at 4001 points and the ratio
    (distance to the right focus)/(distance to the directrix x = 25/3) is
    checked against 0.6 at every one of them.
    """
    c = S.SERIES[mode]
    a, b = 5.0, 4.0
    cc = math.sqrt(a * a - b * b)
    e = cc / a
    dx_dir = a / e
    assert abs(cc - 3.0) < 1e-12 and abs(e - 0.6) < 1e-12
    assert abs(dx_dir - 25.0 / 3.0) < 1e-12
    t = np.linspace(0, 2 * math.pi, 4001)
    X, Y = a * np.cos(t), b * np.sin(t)
    assert float(np.max(np.abs(X ** 2 / 25 + Y ** 2 / 16 - 1))) < 1e-12
    R = np.hypot(X - cc, Y)
    Dd = dx_dir - X
    assert float(np.max(np.abs(R / Dd - e))) < 1e-12
    assert float(np.max(np.abs(np.hypot(X + cc, Y) + R - 2 * a))) < 1e-12
    lr = 2 * b * b / a
    assert abs(lr - 6.4) < 1e-12

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    ax.plot(X, Y, color=c[0], lw=2.2)
    ax.axvline(dx_dir, color=S.GUIDE[mode], lw=1.6, ls=(0, (5, 3)))
    ax.plot([-cc, cc], [0, 0], "o", color=S.INK[mode], ms=7, zorder=5)
    for ang in (0.55, 1.95, 3.6, 5.1):
        px, py = a * math.cos(ang), b * math.sin(ang)
        ax.plot([cc, px], [0, py], color=c[1], lw=1.8)
        ax.plot([px, dx_dir], [py, py], color=c[2], lw=1.8)
        ax.plot([px], [py], "o", color=S.INK[mode], ms=5.5, zorder=5)
    ax.plot([cc, cc], [-lr / 2, lr / 2], color=S.GUIDE[mode], lw=2.4)
    S.label_end(ax, a * math.cos(0.55) * 0.45 + cc * 0.55, b * math.sin(0.55) * 0.45,
                "r", c[1], mode, dx=6, dy=10)
    S.label_end(ax, (a * math.cos(0.55) + dx_dir) / 2, b * math.sin(0.55),
                "d", c[2], mode, dx=0, dy=9, ha="center")
    S.note(ax, dx_dir + 0.18, -3.6, "directrix\n$x = a/e = 25/3$", mode)
    S.note(ax, -6.0, 4.5, "$r/d = e = 0.6$ at all 4001 sampled points;\n"
                          "latus rectum $2b^2/a$ = 6.4 (grey bar at the focus)", mode)
    S.note(ax, cc + 0.2, -0.95, "focus (3, 0)", mode)
    S.note(ax, -cc - 0.2, -0.95, "focus (-3, 0)", mode, ha="right")
    ax.set_aspect("equal")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Every conic is a constant ratio of two distances")
    ax.set_xlim(-6.2, 10.2)
    ax.set_ylim(-5.0, 5.6)
    S.strip(ax)
    return fig


@figure("math5-ag-eccentricity-family")
def _(mode):
    """One polar equation, one focus, one semi-latus rectum, four curves.

    r = l/(1 + e cos th) with l = 3 fixed. Each curve is converted back to
    Cartesian coordinates and tested against its own standard form.
    """
    c = S.SERIES[mode]
    ell = 3.0

    # e = 0.6 ellipse: a = l/(1-e^2), c = a e
    e1 = 0.6
    a1 = ell / (1 - e1 ** 2)
    c1 = a1 * e1
    b1 = math.sqrt(a1 * a1 - c1 * c1)
    assert abs(a1 - 4.6875) < 1e-12 and abs(b1 ** 2 - ell * a1) < 1e-9
    th = np.linspace(0, 2 * math.pi, 3001)
    r1 = ell / (1 + e1 * np.cos(th))
    x1, y1 = r1 * np.cos(th), r1 * np.sin(th)
    assert float(np.max(np.abs((x1 + c1) ** 2 / a1 ** 2 + y1 ** 2 / b1 ** 2 - 1))) < 1e-11

    # e = 1 parabola: y^2 = -2 l (x - l/2)
    th2 = np.linspace(-2.45, 2.45, 3001)
    r2 = ell / (1 + np.cos(th2))
    x2, y2 = r2 * np.cos(th2), r2 * np.sin(th2)
    assert float(np.max(np.abs(y2 ** 2 + 2 * ell * (x2 - ell / 2)))) < 1e-9

    # e = 1.6 hyperbola: a = l/(e^2-1); the focus at the origin is the LEFT focus
    # of a hyperbola whose centre sits at (+c, 0), so the branch drawn is the near one
    e3 = 1.6
    a3 = ell / (e3 ** 2 - 1)
    c3 = a3 * e3
    b3 = math.sqrt(c3 * c3 - a3 * a3)
    th3 = np.linspace(-2.0, 2.0, 3001)
    r3 = ell / (1 + e3 * np.cos(th3))
    x3, y3 = r3 * np.cos(th3), r3 * np.sin(th3)
    assert float(np.max(np.abs((x3 - c3) ** 2 / a3 ** 2 - y3 ** 2 / b3 ** 2 - 1))) < 1e-9
    assert abs(a3 - 3.0 / 1.56) < 1e-12
    assert abs(r3[len(r3) // 2] - ell / (1 + e3)) < 1e-12   # vertex at a(e-1)

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    ax.plot(ell * np.cos(th), ell * np.sin(th), color=S.GUIDE[mode], lw=1.6,
            ls=(0, (5, 3)))
    ax.plot(x1, y1, color=c[0], lw=2.2)
    ax.plot(x2, y2, color=c[1], lw=2.2)
    ax.plot(x3, y3, color=c[2], lw=2.2)
    ax.plot([0], [0], "o", color=S.INK[mode], ms=8, zorder=6)
    i1 = int(np.argmin(np.abs(th - 3.6)))
    i2 = int(np.argmin(np.abs(th2 - 2.2)))
    i3 = int(np.argmin(np.abs(th3 - 1.85)))
    S.label_end(ax, x1[i1], y1[i1], "e = 0.6  ellipse", c[0], mode, dx=-8, dy=-10,
                ha="right")
    S.label_end(ax, x2[i2], y2[i2], "e = 1  parabola", c[1], mode, dx=-8, dy=8,
                ha="right")
    S.label_end(ax, x3[i3], y3[i3], "e = 1.6  hyperbola", c[2], mode, dx=8, dy=6)
    S.label_end(ax, 2.12, -2.12, "e = 0  circle", S.INK_2[mode], mode, dx=6, dy=-6)
    S.note(ax, 0.3, -1.0, "shared focus", mode)
    S.note(ax, -10.6, -7.9, "all four are $r = 3/(1 + e\\cos\\theta)$;  "
                            "only the eccentricity changes", mode)
    ax.set_aspect("equal")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("The conic family, generated by eccentricity alone")
    ax.set_xlim(-11.0, 6.0)
    ax.set_ylim(-8.4, 8.4)
    S.strip(ax)
    return fig


@figure("math5-ag-rotation")
def _(mode):
    """Rotating away an xy term, and the discriminant that predicts the result.

    5x^2 + 4xy + 5y^2 = 9 rotated by 45 degrees becomes 7x'^2 + 3y'^2 = 9. The
    rotated curve is sampled and mapped BACK into the original coordinates,
    where it must satisfy the original equation.
    """
    c = S.SERIES[mode]
    A0, B0, C0 = 5.0, 4.0, 5.0
    th = math.pi / 4
    Ar = A0 * math.cos(th) ** 2 + B0 * math.sin(th) * math.cos(th) + C0 * math.sin(th) ** 2
    Br = B0 * math.cos(2 * th) + (C0 - A0) * math.sin(2 * th)
    Cr = A0 * math.sin(th) ** 2 - B0 * math.sin(th) * math.cos(th) + C0 * math.cos(th) ** 2
    assert abs(Ar - 7.0) < 1e-12 and abs(Br) < 1e-12 and abs(Cr - 3.0) < 1e-12
    assert abs((B0 ** 2 - 4 * A0 * C0) - (Br ** 2 - 4 * Ar * Cr)) < 1e-9
    assert abs(B0 ** 2 - 4 * A0 * C0 + 84.0) < 1e-12

    ap = math.sqrt(9.0 / 7.0)
    bp = math.sqrt(3.0)
    t = np.linspace(0, 2 * math.pi, 3001)
    xr, yr = ap * np.cos(t), bp * np.sin(t)
    xo = xr * math.cos(th) - yr * math.sin(th)
    yo = xr * math.sin(th) + yr * math.cos(th)
    assert float(np.max(np.abs(5 * xo ** 2 + 4 * xo * yo + 5 * yo ** 2 - 9))) < 1e-11
    assert abs(ap - 1.1338934190276817) < 1e-12
    assert abs(bp - 1.7320508075688772) < 1e-12
    ecc = math.sqrt(1 - (ap * ap) / (bp * bp))
    assert abs(ecc - math.sqrt(4.0 / 7.0)) < 1e-12

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    ax.plot(xo, yo, color=c[0], lw=2.4)
    ax.plot(xr, yr, color=c[1], lw=2.0, ls=(0, (5, 3)))
    L = 2.1
    ax.plot([-L * math.cos(th), L * math.cos(th)], [-L * math.sin(th), L * math.sin(th)],
            color=S.GUIDE[mode], lw=1.2)
    ax.plot([L * math.sin(th), -L * math.sin(th)], [-L * math.cos(th), L * math.cos(th)],
            color=S.GUIDE[mode], lw=1.2)
    ax.plot([0], [0], "o", color=S.INK[mode], ms=6, zorder=6)
    for sgn in (1, -1):
        ax.plot([sgn * bp * -math.sin(th)], [sgn * bp * math.cos(th)], "o",
                color=S.INK[mode], ms=6, zorder=6)
        ax.plot([sgn * ap * math.cos(th)], [sgn * ap * math.sin(th)], "o",
                color=S.INK[mode], ms=6, zorder=6)
    S.label_end(ax, 1.05, 1.05, "$x'$ axis", S.INK_2[mode], mode, dx=4, dy=2)
    S.label_end(ax, -1.05, 1.05, "$y'$ axis", S.INK_2[mode], mode, dx=-4, dy=2,
                ha="right")
    S.label_end(ax, xo[600], yo[600], "$5x^2 + 4xy + 5y^2 = 9$", c[0], mode, dx=6, dy=8)
    S.label_end(ax, ap, 0.0, "$7x'^2 + 3y'^2 = 9$", c[1], mode, dx=8, dy=-14)
    S.note(ax, 0.0, -3.05, "$B^2 - 4AC = 16 - 100 = -84 < 0$, so an ellipse before any "
                           "algebra;\nsemi-axes $\\sqrt{9/7}$ = 1.1339 and "
                           "$\\sqrt{3}$ = 1.7321", mode, ha="center")
    ax.set_aspect("equal")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Rotating the cross term away")
    ax.set_xlim(-2.9, 2.9)
    ax.set_ylim(-3.4, 2.2)
    S.strip(ax)
    return fig


@figure("math5-ag-parabolic-reflector")
def _(mode):
    """A parabolic dish, with every reflected ray computed, not drawn by eye.

    The rim is 2.4 m across and the dish 0.30 m deep, so f = D^2/(16d) = 1.2 m.
    Each incoming ray is mirrored in the tangent at its strike point and the
    result is asserted to pass through the focus.
    """
    c = S.SERIES[mode]
    D, depth = 2.4, 0.30
    f = D * D / (16 * depth)
    assert abs(f - 1.2) < 1e-12
    assert abs((D / 2) ** 2 / (4 * f) - depth) < 1e-12

    x = np.linspace(-D / 2, D / 2, 601)
    y = x ** 2 / (4 * f)
    worst = 0.0
    rays = []
    for x0 in np.linspace(-1.1, 1.1, 9):
        if abs(x0) < 1e-9:
            rays.append((x0, 0.0))
            continue
        y0 = x0 ** 2 / (4 * f)
        tv = np.array([1.0, x0 / (2 * f)])
        tv /= np.linalg.norm(tv)
        inc = np.array([0.0, -1.0])
        ref = 2.0 * float(np.dot(inc, tv)) * tv - inc
        ref /= np.linalg.norm(ref)
        aim = np.array([-x0, f - y0])
        aim /= np.linalg.norm(aim)
        worst = max(worst, float(np.linalg.norm(ref - aim)))
        rays.append((x0, y0))
    assert worst < 1e-12, worst

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.plot(x, y, color=c[0], lw=2.6)
    for x0, y0 in rays:
        ax.plot([x0, x0], [1.85, y0], color=c[1], lw=1.5)
        ax.plot([x0, 0.0], [y0, f], color=c[2], lw=1.5)
    ax.plot([0.0], [f], "o", color=S.INK[mode], ms=9, zorder=6)
    ax.plot([-D / 2, D / 2], [depth, depth], "o", color=S.INK[mode], ms=6, zorder=6)
    S.label_end(ax, -1.2, 0.30, "rim, 2.4 m across", c[0], mode, dx=-4, dy=10,
                ha="right")
    S.label_end(ax, 1.18, 1.72, "incoming axial rays", c[1], mode, dx=4, dy=0,
                ha="right")
    S.label_end(ax, 0.62, 0.72, "reflected rays", c[2], mode, dx=6, dy=-2)
    S.note(ax, 0.10, f + 0.10, "focus at $f = D^2/(16d)$ = 1.20 m", mode)
    S.note(ax, -1.32, -0.22, "depth d = 0.30 m; every reflected ray was computed by "
                             "mirroring\nthe incoming ray in the tangent, then checked "
                             "against the focus", mode)
    ax.set_xlabel("distance from the axis  (m)")
    ax.set_ylabel("height  (m)")
    ax.set_title("Why a dish has to be a parabola")
    ax.set_xlim(-1.45, 1.62)
    ax.set_ylim(-0.35, 1.95)
    S.strip(ax)
    return fig


@figure("math5-ag-space-plane")
def _(mode):
    """A point, a plane, and the perpendicular between them, in three dimensions.

    Distance from (3,4,5) to x + 2y + 2z = 6 is 5 by formula; the foot is
    computed and asserted to satisfy the plane equation, and the distance is
    re-derived by scanning a grid of points ON the plane.
    """
    c = S.SERIES[mode]
    P = np.array([3.0, 4.0, 5.0])
    nvec = np.array([1.0, 2.0, 2.0])
    d0 = 6.0
    dist = abs(float(np.dot(nvec, P)) - d0) / float(np.linalg.norm(nvec))
    assert abs(dist - 5.0) < 1e-12, dist
    foot = P - dist * nvec / float(np.linalg.norm(nvec))
    assert abs(float(np.dot(nvec, foot)) - d0) < 1e-9, foot
    assert np.max(np.abs(foot - np.array([4 / 3, 2 / 3, 5 / 3]))) < 1e-12, foot
    # brute-force confirmation over a grid lying in the plane
    gs = np.linspace(-4.0, 8.0, 1201)
    GS, GT = np.meshgrid(gs, gs)
    PX = d0 - 2 * GS - 2 * GT
    best = float(np.min(np.sqrt((PX - P[0]) ** 2 + (GS - P[1]) ** 2 + (GT - P[2]) ** 2)))
    assert abs(best - 5.0) < 5e-3, best
    # direction cosines of the normal
    lmn = nvec / float(np.linalg.norm(nvec))
    assert abs(float(np.sum(lmn ** 2)) - 1.0) < 1e-12

    fig = plt.figure(figsize=(7.2, 5.0))
    ax = fig.add_subplot(111, projection="3d")
    uu = np.linspace(-2.0, 5.0, 20)
    U, V = np.meshgrid(uu, uu)
    W = d0 - 2 * U - 2 * V
    ax.plot_surface(W, U, V, color=c[0], alpha=0.24, linewidth=0, antialiased=True)
    ax.plot([P[0], foot[0]], [P[1], foot[1]], [P[2], foot[2]], color=c[1], lw=2.6)
    ax.scatter([P[0]], [P[1]], [P[2]], color=S.INK[mode], s=42, depthshade=False)
    ax.scatter([foot[0]], [foot[1]], [foot[2]], color=S.INK[mode], s=42,
               depthshade=False)
    ax.text(P[0], P[1], P[2] + 0.5, "P (3, 4, 5)", color=S.INK[mode], fontsize=9.5)
    ax.text(foot[0], foot[1], foot[2] - 1.4, "foot (4/3, 2/3, 5/3)",
            color=S.INK[mode], fontsize=9.5)
    ax.text(2.6, 3.4, 3.9, "d = 5", color=c[1], fontsize=10.5, fontweight="semibold")
    ax.text(-3.0, 0.6, -1.9, "plane  x + 2y + 2z = 6", color=c[0], fontsize=10.5,
            fontweight="semibold")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_zlabel("z")
    ax.set_xlim(-4, 7)
    ax.set_ylim(-2, 5)
    ax.set_zlim(-2, 6)
    ax.set_title("Point to plane: one normal, one division")
    for pane in (ax.xaxis, ax.yaxis, ax.zaxis):
        pane.set_pane_color((0, 0, 0, 0))
        pane._axinfo["grid"]["color"] = S.GRID[mode]
    ax.tick_params(colors=S.INK_2[mode])
    ax.xaxis.label.set_color(S.INK_2[mode])
    ax.yaxis.label.set_color(S.INK_2[mode])
    ax.zaxis.label.set_color(S.INK_2[mode])
    ax.view_init(elev=20, azim=-58)
    return fig


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    prefix = sys.argv[1] if len(sys.argv) > 1 else PREFIX
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith(PREFIX), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
