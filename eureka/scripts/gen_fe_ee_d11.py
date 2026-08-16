#!/usr/bin/env python3
"""Depth-wave-11 figures for the FE Electrical and Computer course:
the Algorithms and Complexity and Data Structures chapters.

Same contract as gen_fe_ee_w9.py, and it imports the SAME style module rather
than growing a second look. Every series here is either COMPUTED from a formula
the lesson writes out or MEASURED by running the algorithm the lesson describes
inside this file. Nothing is traced, scanned, redrawn or adapted from the
NCEES Reference Handbook or any textbook - the pipeline consumes formulas and
its own measurements, which are not protected expression, and never anyone's
drawing of them.

Every operation count the two lessons quote is produced by one of the counters
below and pinned by an assertion, and wherever a closed form exists the
measurement is checked against it by an INDEPENDENT route: exhaustive
enumeration of every permutation against an expectation formula, a brute-force
worst-case search against a recurrence, a counted execution against a
generating-function result. A formula checked against itself proves nothing,
and this course has already shipped one count that was out by a factor of
27,643 because it was reasoned about instead of run.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_d11.py            # all
    python3 scripts/gen_fe_ee_d11.py sw2-tree   # only names with that prefix
"""
from __future__ import annotations

import itertools
import math
import pathlib
import random
import sys
from fractions import Fraction

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Instrumented algorithms. The lessons quote numbers produced here, so the
# counters live at module scope and are asserted against an independent route
# before any figure is drawn.
# ---------------------------------------------------------------------------


def insertion_comparisons(arr):
    """Key comparisons performed by textbook insertion sort."""
    a = list(arr)
    c = 0
    for i in range(1, len(a)):
        k, j = a[i], i - 1
        while j >= 0:
            c += 1
            if a[j] > k:
                a[j + 1] = a[j]
                j -= 1
            else:
                break
        a[j + 1] = k
    assert a == sorted(arr)
    return c


def merge_comparisons(arr):
    """Key comparisons performed by top-down merge sort."""
    c = 0

    def ms(a):
        nonlocal c
        if len(a) <= 1:
            return a
        mid = len(a) // 2
        left, right = ms(a[:mid]), ms(a[mid:])
        out = []
        i = j = 0
        while i < len(left) and j < len(right):
            c += 1
            if left[i] <= right[j]:
                out.append(left[i])
                i += 1
            else:
                out.append(right[j])
                j += 1
        out += left[i:]
        out += right[j:]
        return out

    assert ms(list(arr)) == sorted(arr)
    return c


def merge_worst(n: int) -> int:
    """Exact worst-case merge-sort comparison count, W(n) = W(ceil) + W(floor) + n - 1."""
    return 0 if n <= 1 else merge_worst((n + 1) // 2) + merge_worst(n // 2) + n - 1


def harmonic(n: int) -> Fraction:
    return sum((Fraction(1, i) for i in range(1, n + 1)), Fraction(0))


def greedy_coins(coins, target):
    """Coins used by the take-the-largest-first heuristic."""
    used, rem = 0, target
    for c in sorted(coins, reverse=True):
        while rem >= c:
            rem -= c
            used += 1
    return used if rem == 0 else None


def optimal_coins(coins, target):
    """Fewest coins, by exhaustive dynamic programming over every amount."""
    inf = float("inf")
    best = [0] + [inf] * target
    for t in range(1, target + 1):
        for c in coins:
            if c <= t:
                best[t] = min(best[t], best[t - c] + 1)
    return best[target]


def dynamic_array_copies(n: int, growth: float = 2.0) -> int:
    """Element copies performed by n appends to a dynamic array of initial capacity 1."""
    cap, size, copies = 1, 0, 0
    for _ in range(n):
        if size == cap:
            copies += size
            cap = max(cap + 1, int(cap * growth))
        size += 1
    return copies


def dynamic_array_slack(n: int, growth: float = 2.0) -> float:
    """Worst capacity-to-elements ratio seen anywhere in n appends."""
    cap, size, worst = 1, 0, 1.0
    for _ in range(n):
        if size == cap:
            cap = max(cap + 1, int(cap * growth))
        size += 1
        worst = max(worst, cap / size)
    return worst


def bst_height(keys) -> int:
    """Height in edges of the BST produced by inserting keys in the given order."""
    root, link = None, {}
    for k in keys:
        if root is None:
            root = k
            link[k] = [None, None]
            continue
        cur = root
        while True:
            side = 0 if k < cur else 1
            if link[cur][side] is None:
                link[cur][side] = k
                break
            cur = link[cur][side]
        link[k] = [None, None]
    best, stack = 0, [(root, 0)]
    while stack:
        node, d = stack.pop()
        best = max(best, d)
        for child in link[node]:
            if child is not None:
                stack.append((child, d + 1))
    return best


class AVL:
    """Minimal AVL tree that counts the single rotations it performs."""

    def __init__(self):
        self.root = None
        self.rotations = 0

    @staticmethod
    def _h(t):
        return t[3] if t else 0

    def _upd(self, t):
        t[3] = 1 + max(self._h(t[1]), self._h(t[2]))
        return t

    def _rot_right(self, t):
        self.rotations += 1
        left = t[1]
        t[1] = left[2]
        left[2] = self._upd(t)
        return self._upd(left)

    def _rot_left(self, t):
        self.rotations += 1
        right = t[2]
        t[2] = right[1]
        right[1] = self._upd(t)
        return self._upd(right)

    def insert(self, k):
        def ins(t):
            if t is None:
                return [k, None, None, 1]
            if k < t[0]:
                t[1] = ins(t[1])
            else:
                t[2] = ins(t[2])
            self._upd(t)
            bal = self._h(t[1]) - self._h(t[2])
            if bal > 1 and k < t[1][0]:
                return self._rot_right(t)
            if bal < -1 and k > t[2][0]:
                return self._rot_left(t)
            if bal > 1:
                t[1] = self._rot_left(t[1])
                return self._rot_right(t)
            if bal < -1:
                t[2] = self._rot_right(t[2])
                return self._rot_left(t)
            return t

        self.root = ins(self.root)

    def height(self):
        def h(t):
            return 0 if t is None else 1 + max(h(t[1]), h(t[2]))

        return h(self.root) - 1


def floyd_build_swaps(a) -> int:
    """Swaps performed by Floyd's bottom-up heap construction."""
    a = list(a)
    n = len(a)
    swaps = 0

    def sift(i):
        nonlocal swaps
        while True:
            lo, hi, m = 2 * i + 1, 2 * i + 2, i
            if lo < n and a[lo] < a[m]:
                m = lo
            if hi < n and a[hi] < a[m]:
                m = hi
            if m == i:
                return
            a[i], a[m] = a[m], a[i]
            swaps += 1
            i = m

    for i in range(n // 2 - 1, -1, -1):
        sift(i)
    return swaps


def insert_build_swaps(vals) -> int:
    """Swaps performed when a heap is built by n successive sift-up insertions."""
    h, swaps = [], 0
    for v in vals:
        h.append(v)
        i = len(h) - 1
        while i > 0:
            p = (i - 1) // 2
            if h[i] < h[p]:
                h[i], h[p] = h[p], h[i]
                swaps += 1
                i = p
            else:
                break
    return swaps


def chain_lengths(m: int, n: int, seed: int):
    """Bucket occupancies after n keys land in m buckets under a uniform hash."""
    rng = random.Random(seed)
    counts = [0] * m
    for _ in range(n):
        counts[rng.randrange(m)] += 1
    return counts


def traversal_probes(v: int, e: int, seed: int):
    """Adjacency probes a full traversal makes, list against matrix."""
    rng = random.Random(seed)
    edges = set()
    while len(edges) < e:
        a, b = rng.randrange(v), rng.randrange(v)
        if a != b:
            edges.add((min(a, b), max(a, b)))
    return 2 * len(edges) + v, v * v


sys.setrecursionlimit(300000)

# ---------------------------------------------------------------------------
# Algorithms and Complexity
# ---------------------------------------------------------------------------


@figure("sw2-bigo-witness")
def _(mode):
    """The witness constants that put 3n^2 + 7n + 12 inside Theta(n^2).

    The lesson solves 3n^2 + 7n + 12 <= 4n^2 exactly: the quadratic n^2 - 7n -
    12 has its positive root at (7 + sqrt(97))/2 = 8.4244, so the smallest
    integer witness is n0 = 9. Both the failure at n = 8 and the success at
    n = 9 are checked here before the figure is drawn.
    """
    c = S.SERIES[mode]
    f = lambda n: 3 * n * n + 7 * n + 12  # noqa: E731

    root = (7 + math.sqrt(97)) / 2
    assert abs(root - 8.424428900898052) < 1e-12, root
    assert f(8) == 260 and 4 * 8 ** 2 == 256
    assert f(9) == 318 and 4 * 9 ** 2 == 324
    fails = [n for n in range(1, 400) if f(n) > 4 * n * n]
    assert fails == list(range(1, 9)), fails
    assert all(f(n) >= 3 * n * n for n in range(1, 400))

    n = np.linspace(1, 20, 800)
    fig, ax = plt.subplots()
    ax.plot(n, 4 * n ** 2, color=c[1], lw=2.0, ls="--")
    ax.plot(n, f(n), color=c[0], lw=2.4)
    ax.plot(n, 3 * n ** 2, color=c[2], lw=2.0, ls="--")
    S.label_end(ax, 20, 4 * 400, "upper witness  4n^2", c[1], mode, dy=8)
    S.label_end(ax, 20, f(20), "f(n) = 3n^2 + 7n + 12", c[0], mode, dy=-2)
    S.label_end(ax, 20, 3 * 400, "lower witness  3n^2", c[2], mode, dy=-12)
    ax.axvline(9, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([9], [f(9)], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 9.4, 120,
           "n0 = 9: from here on 3n^2 <= f(n) <= 4n^2.\n"
           "at n = 8 the upper witness still fails, 260 > 256", mode)
    ax.set_xlabel("problem size  n")
    ax.set_ylabel("operations")
    ax.set_title("Big-Theta is a sandwich with named constants")
    ax.set_xlim(1, 23)
    ax.set_ylim(0, 1750)
    S.strip(ax)
    return fig


@figure("sw2-master-cases")
def _(mode):
    """Cost per recursion-tree level for the three Master-theorem cases.

    Each panel sums a f(n/b) over the levels of T(n) = a T(n/b) + f(n) at
    n = 4096 and plots what each level contributes. Which end of the tree
    carries the total IS the case distinction, and the three sums are checked
    against the closed forms the lesson states.
    """
    n0 = 4096
    levels = int(math.log2(n0))
    cases = [
        (8, 2, 2.0, "a = 8, b = 2, f = n^2\nleaf-heavy: Theta(n^3)"),
        (2, 2, 1.0, "a = 2, b = 2, f = n\nbalanced: Theta(n log n)"),
        (2, 2, 2.0, "a = 2, b = 2, f = n^2\nroot-heavy: Theta(n^2)"),
    ]
    # level i contributes a^i * (n/b^i)^d
    tot = []
    for a, b, d, _ in cases:
        tot.append([a ** i * (n0 / b ** i) ** d for i in range(levels + 1)])
    # leaf-heavy: last level dominates and equals n^(log2 8) / n^2 scaling
    assert abs(tot[0][-1] - 8 ** levels) < 1e-6
    assert abs(tot[0][-1] - n0 ** 3) < 1e-6
    assert abs(sum(tot[0]) / tot[0][-1] - (2 - 2.0 ** -levels)) < 1e-9
    # balanced: every level costs exactly n, and there are log2(n) + 1 of them
    assert all(abs(x - n0) < 1e-9 for x in tot[1])
    assert abs(sum(tot[1]) - n0 * (levels + 1)) < 1e-6
    # root-heavy: the geometric series sums to 2 n^2
    assert abs(sum(tot[2]) / n0 ** 2 - (2 - 2.0 ** -levels)) < 1e-9

    c = S.SERIES[mode]
    fig, axes = plt.subplots(1, 3, figsize=(9.6, 3.6), sharex=True)
    for k, (ax, series, (a, b, d, label)) in enumerate(zip(axes, tot, cases)):
        ax.semilogy(range(levels + 1), series, color=c[k], lw=2.2, marker="o", ms=5)
        ax.set_title(label, fontsize=9.5, color=S.INK[mode], loc="left")
        ax.set_xlabel("recursion level")
        ax.set_ylim(1e2, 1e12)
        S.strip(ax)
    axes[0].set_ylabel("work at that level (log scale)")
    fig.suptitle("Where the work sits decides the Master-theorem case (n = 4096)",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("sw2-sort-worstcase")
def _(mode):
    """Merge sort's exact worst case against the information-theoretic floor.

    W(n) = W(ceil(n/2)) + W(floor(n/2)) + n - 1 is verified here by EXHAUSTIVE
    search over every permutation for n <= 9 - the maximum comparison count any
    input can force - and then evaluated up to n = 4096. The floor is
    ceil(log2 n!), the depth every comparison-sort decision tree must reach.
    """
    for n in range(2, 10):
        assert max(merge_comparisons(p) for p in itertools.permutations(range(n))) \
            == merge_worst(n), n
    for k in range(1, 13):
        n = 2 ** k
        assert merge_worst(n) == n * k - n + 1, n
    assert merge_worst(16) == 49 and math.ceil(math.log2(math.factorial(16))) == 45
    assert merge_worst(1024) == 9217
    assert math.ceil(math.log2(math.factorial(1024))) == 8770

    sizes = [2 ** k for k in range(2, 13)]
    worst = [merge_worst(n) for n in sizes]
    floor = [math.log2(math.factorial(n)) for n in sizes]
    quad = [n * (n - 1) / 2 for n in sizes]

    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ax.loglog(sizes, quad, color=c[2], lw=2.0, ls="--")
    ax.loglog(sizes, worst, color=c[0], lw=2.3, marker="o", ms=6)
    ax.loglog(sizes, floor, color=c[1], lw=2.1)
    S.label_end(ax, 4096, quad[-1], "selection sort\nn(n-1)/2", c[2], mode, dy=6)
    S.label_end(ax, 4096, worst[-1], "merge sort worst case\nn log2 n - n + 1", c[0], mode, dy=8)
    S.label_end(ax, 4096, floor[-1], "floor for ANY\ncomparison sort\nlog2(n!)", c[1], mode, dy=-16)
    S.note(ax, 4.4, 2.4e6,
           "at n = 1024 merge sort's worst case is 9,217 comparisons\n"
           "against a floor of 8,770 - an excess of 5.1%", mode)
    ax.set_xlabel("array length  n  (log scale)")
    ax.set_ylabel("key comparisons  (log scale)")
    ax.set_title("No comparison sort can get under log2(n!)")
    ax.set_xlim(3.4, 12000)
    ax.set_ylim(2, 1.2e7)
    S.strip(ax)
    return fig


@figure("sw2-insertion-exact")
def _(mode):
    """Insertion sort's average cost, from every permutation, against its closed form.

    The middle series is not a sample: for each n it runs insertion sort on ALL
    n! orderings and averages the comparisons. The dashed line is the
    expectation n(n-1)/4 + n - H_n derived in the lesson. The two agree as
    exact rationals at every n plotted, which is the independent check the
    derivation needs.
    """
    ns = list(range(2, 10))
    exact, closed = [], []
    for n in ns:
        total = 0
        for p in itertools.permutations(range(n)):
            total += insertion_comparisons(p)
        mean = Fraction(total, math.factorial(n))
        cf = Fraction(n * (n - 1), 4) + n - harmonic(n)
        assert mean == cf, (n, mean, cf)
        exact.append(float(mean))
        closed.append(float(cf))
    assert exact[2] == 59 / 12 and abs(exact[2] - 4.9166666666666667) < 1e-12
    assert abs(exact[-1] - 60911 / 2520) < 1e-12

    worst = [n * (n - 1) / 2 for n in ns]
    best = [n - 1 for n in ns]
    assert insertion_comparisons(list(range(100, 0, -1))) == 4950
    assert insertion_comparisons(list(range(100))) == 99

    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ax.plot(ns, worst, color=c[1], lw=2.2, marker="o", ms=6)
    ax.plot(ns, exact, color=c[0], lw=2.4, marker="o", ms=7)
    ax.plot(ns, closed, color=S.GUIDE[mode], lw=1.6, ls="--")
    ax.plot(ns, best, color=c[2], lw=2.2, marker="o", ms=6)
    S.label_end(ax, 9, worst[-1], "worst case\nn(n-1)/2", c[1], mode, dy=4)
    S.label_end(ax, 9, exact[-1], "mean over all n!\norderings (measured)", c[0], mode, dy=-6)
    S.label_end(ax, 9, best[-1], "best case  n-1", c[2], mode, dy=0)
    S.note(ax, 2.2, 30,
           "dashed: n(n-1)/4 + n - H_n.\n"
           "at n = 9 both routes give 60911/2520 = 24.171", mode)
    ax.set_xlabel("array length  n")
    ax.set_ylabel("key comparisons")
    ax.set_title("Every ordering counted, not sampled")
    ax.set_xlim(1.8, 11.6)
    ax.set_ylim(0, 42)
    S.strip(ax)
    return fig


@figure("sw2-greedy-gap")
def _(mode):
    """Where take-the-largest-coin stops being optimal, measured.

    Both series are computed: the greedy count by running the heuristic, the
    optimal count by dynamic programming over every amount. With the coin set
    {1, 3, 4} the two first disagree at 6 - greedy spends 4+1+1, the optimum is
    3+3 - and the gap recurs. With {1, 5, 10, 25} they never disagree below
    a dollar, which is why the heuristic feels safe until it is not.
    """
    targets = list(range(1, 41))
    g = [greedy_coins([1, 3, 4], t) for t in targets]
    o = [optimal_coins([1, 3, 4], t) for t in targets]
    us = [greedy_coins([1, 5, 10, 25], t) - optimal_coins([1, 5, 10, 25], t)
          for t in range(1, 100)]

    assert g[5] == 3 and o[5] == 2
    assert [t for t, a, b in zip(targets, g, o) if a != b] \
        == [6, 10, 14, 18, 22, 26, 30, 34, 38]
    assert set(us) == {0}
    assert g[9] == 4 and o[9] == 3

    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ax.plot(targets, g, color=c[1], lw=2.2)
    ax.plot(targets, o, color=c[0], lw=2.2)
    gap = [t for t, a, b in zip(targets, g, o) if a != b]
    ax.plot(gap, [g[t - 1] for t in gap], "o", color=c[1], ms=6)
    S.label_end(ax, 40, g[-1], "greedy: largest coin first", c[1], mode, dy=13)
    S.label_end(ax, 40, o[-1], "optimal (dynamic programming)", c[0], mode, dy=-13)
    ax.axvline(6, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 6.6, 9.1,
           "first failure at 6: greedy takes 4 + 1 + 1 = 3 coins,\n"
           "the optimum is 3 + 3 = 2 coins", mode)
    ax.set_xlabel("amount to make from coins {1, 3, 4}")
    ax.set_ylabel("coins used")
    ax.set_title("A greedy choice that is provably wrong")
    ax.set_xlim(1, 52)
    ax.set_ylim(0, 12)
    S.strip(ax)
    return fig


@figure("sw2-search-breakeven")
def _(mode):
    """Sorting to enable binary search only pays after enough queries.

    Both lines are comparison counts, not times: a linear scan averages
    (n+1)/2 per query, while sorting once costs the merge-sort worst case
    W(1024) = 9217 and each later query costs floor(log2 n) + 1 = 11. The lines
    cross at q = 9217 / (512.5 - 11) = 18.38, so the 19th query is the first
    that the sorted array has already paid for.
    """
    n = 1024
    setup = merge_worst(n)
    per_lin = (n + 1) / 2
    per_bin = math.floor(math.log2(n)) + 1
    assert setup == 9217 and per_lin == 512.5 and per_bin == 11
    cross = setup / (per_lin - per_bin)
    assert abs(cross - 18.378863409770688) < 1e-9, cross
    assert math.ceil(cross) == 19

    q = np.arange(0, 41)
    lin = per_lin * q
    srt = setup + per_bin * q

    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ax.plot(q, lin, color=c[0], lw=2.3)
    ax.plot(q, srt, color=c[1], lw=2.3)
    S.label_end(ax, 40, lin[-1], "scan the unsorted array\n512.5 per query", c[0], mode, dy=6)
    S.label_end(ax, 40, srt[-1], "sort once, then binary search\n9,217 + 11 per query",
                c[1], mode, dy=-6)
    ax.plot([cross], [per_lin * cross], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.axvline(cross, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.2, 16800,
           "break-even at q = 18.38, so the 19th query\n"
           "is the first one the sort has paid for  (n = 1024)", mode)
    ax.set_xlabel("number of queries  q")
    ax.set_ylabel("cumulative key comparisons")
    ax.set_title("One lookup: scan it. Twenty: sort it first.")
    ax.set_xlim(0, 53)
    ax.set_ylim(0, 21500)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Data Structures
# ---------------------------------------------------------------------------


@figure("sw2-array-amortised")
def _(mode):
    """Copies per append for a doubling dynamic array, measured append by append.

    The running average is counted, not modelled: this file appends one element
    at a time and tallies every element copy a resize performs. It touches 2.00
    the instant a resize lands and falls back toward 1.00, never crossing the
    dashed ceiling of 2, which is exactly what "amortised O(1), worst case
    O(n)" means.
    """
    n_max = 4096
    cap, size, copies = 1, 0, 0
    run, spike = [], []
    for i in range(1, n_max + 1):
        if size == cap:
            copies += size
            cap *= 2
            spike.append(i)
        size += 1
        run.append(copies / i)
    assert dynamic_array_copies(1000) == 1023
    assert dynamic_array_copies(10 ** 6) == 1048575
    assert dynamic_array_copies(10 ** 4) == 16383
    for n in (10, 100, 1000, 10 ** 4, 10 ** 6):
        assert dynamic_array_copies(n) == 2 ** math.ceil(math.log2(n)) - 1, n
    assert max(run) <= 2.0 + 1e-12
    assert abs(run[999] - 1.023) < 5e-4, run[999]

    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ax.semilogx(range(1, n_max + 1), run, color=c[0], lw=2.0)
    ax.axhline(2.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, n_max, run[-1], "measured copies\nper append", c[0], mode, dy=6)
    S.note(ax, 1.15, 2.04, "ceiling: copies(n) = 2^ceil(log2 n) - 1 < 2n", mode)
    S.note(ax, 1.15, 0.24, "a single append still copies up to n elements", mode)
    ax.plot(spike, [2.0] * len(spike), "o", color=c[0], ms=5)
    ax.set_xlabel("appends performed  n  (log scale)")
    ax.set_ylabel("cumulative copies per append")
    ax.set_title("Doubling: the average never reaches 2, the worst case is n")
    ax.set_ylim(0, 2.5)
    S.strip(ax)
    return fig


@figure("sw2-growth-factor")
def _(mode):
    """The growth-factor trade, both halves measured on the same runs.

    Left: copies per append after a million appends, counted. Right: the worst
    capacity-to-elements ratio reached at any point during those appends, which
    is the slack the array can be holding when you look at it. Choosing g is
    choosing a point on this trade, and the two panels move in opposite
    directions - the copying falls as g rises and the wasted memory climbs.
    """
    gs = [1.25, 1.5, 2.0, 3.0]
    n = 10 ** 6
    cop = [dynamic_array_copies(n, g) / n for g in gs]
    slack = [dynamic_array_slack(n, g) for g in gs]
    assert abs(cop[1] - 2.099753) < 1e-6, cop[1]
    assert abs(cop[2] - 1.048575) < 1e-6, cop[2]
    # the slack tops out just under g: right after a resize the array holds
    # s+1 elements in a capacity of g*s, so the ratio is g*s/(s+1) -> g
    for g, sl in zip(gs, slack):
        assert g - 1e-5 < sl < g, (g, sl)
    assert abs(slack[2] - 1.9999961853100103) < 1e-12, slack[2]
    assert abs(slack[3] - 2.999994354981353) < 1e-12, slack[3]
    assert cop[0] > cop[1] > cop[2] > cop[3]
    assert slack[0] < slack[1] < slack[2] < slack[3]

    c = S.SERIES[mode]
    fig, axes = plt.subplots(1, 2, figsize=(8.6, 3.7))
    x = np.arange(len(gs))
    axes[0].bar(x, cop, color=c[0], width=0.6)
    axes[0].set_ylabel("copies per append")
    axes[0].set_title("Time paid for growing", fontsize=10.5, loc="left",
                      color=S.INK[mode])
    for xi, v in zip(x, cop):
        axes[0].annotate(f"{v:.2f}", (xi, v), ha="center", va="bottom",
                         fontsize=9, color=S.INK_2[mode])
    axes[1].bar(x, slack, color=c[1], width=0.6)
    axes[1].set_ylabel("worst capacity / elements held")
    axes[1].set_title("Memory wasted while growing", fontsize=10.5, loc="left",
                      color=S.INK[mode])
    for xi, v in zip(x, slack):
        axes[1].annotate(f"{v:.2f}", (xi, v), ha="center", va="bottom",
                         fontsize=9, color=S.INK_2[mode])
    for ax in axes:
        ax.set_xticks(x)
        ax.set_xticklabels([f"x{g:g}" for g in gs])
        ax.set_xlabel("growth factor  g")
        ax.set_ylim(0, 5.2)
        S.strip(ax)
    fig.suptitle("One million appends, counted: g trades copying against slack",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("sw2-tree-heights")
def _(mode):
    """Measured tree height against key count for three arrival orders.

    Every point is built key by key in this file and its height measured.
    Sorted insertion into a plain BST gives exactly n-1; the same keys shuffled
    give a height near 3 log2 n; an AVL fed the SORTED keys stays at
    floor(log2 n), which is the perfect-tree minimum, because it rotates.
    """
    sizes = [15, 31, 63, 127, 255, 511, 1023, 2047]
    rng = random.Random(20250816)
    degenerate, shuffled, avl_h = [], [], []
    for n in sizes:
        keys = list(range(n))
        degenerate.append(bst_height(keys))
        sh = keys[:]
        rng.shuffle(sh)
        shuffled.append(bst_height(sh))
        tree = AVL()
        for k in keys:
            tree.insert(k)
        avl_h.append(tree.height())

    assert degenerate == [n - 1 for n in sizes]
    assert avl_h == [math.floor(math.log2(n)) for n in sizes], avl_h
    for n in (15, 63, 255, 1023, 10 ** 4, 10 ** 5):
        tree = AVL()
        for k in range(n):
            tree.insert(k)
        assert tree.height() == math.floor(math.log2(n))
        assert tree.rotations == n - math.floor(math.log2(n)) - 1, (n, tree.rotations)
    assert all(a <= b for a, b in zip(avl_h, shuffled))

    c = S.SERIES[mode]
    ideal = [math.floor(math.log2(n)) for n in sizes]
    fig, ax = plt.subplots()
    ax.loglog(sizes, degenerate, color=c[0], lw=2.3, marker="o", ms=6)
    ax.loglog(sizes, shuffled, color=c[1], lw=2.3, marker="o", ms=6)
    ax.loglog(sizes, avl_h, color=c[2], lw=2.3, marker="o", ms=6)
    ax.loglog(sizes, [1.4404 * math.log2(n + 2) - 0.328 for n in sizes],
              color=S.GUIDE[mode], lw=1.4, ls="--")
    assert ideal == avl_h
    S.label_end(ax, 2047, degenerate[-1], "sorted keys, plain BST\nheight = n - 1",
                c[0], mode, dy=4)
    S.label_end(ax, 2047, shuffled[-1], "shuffled keys, plain BST", c[1], mode, dy=8)
    S.label_end(ax, 2047, avl_h[-1], "sorted keys, AVL\nheight = floor(log2 n)",
                c[2], mode, dy=-14)
    S.note(ax, 14, 1.35,
           "dashed: the AVL worst-case bound 1.4404 log2(n+2) - 0.328.\n"
           "at n = 2047 a plain BST is 2046 deep and the AVL is 10", mode)
    ax.set_xlabel("keys inserted  n  (log scale)")
    ax.set_ylabel("tree height in edges  (log scale)")
    ax.set_title("Rotations are what stop sorted input from being a list")
    ax.set_xlim(13, 5200)
    ax.set_ylim(1.2, 4000)
    S.strip(ax)
    return fig


@figure("sw2-buildheap-linear")
def _(mode):
    """Floyd's build-heap is linear; building by repeated insertion is not.

    Both series are swap counts from running the two constructions on the same
    shuffled input. Floyd's settles at about 0.74 swaps per element at every
    size - a straight line of slope 1 on log-log axes - while the worst case
    for repeated insertion, a reverse-ordered feed, climbs away from it.
    """
    sizes = [2 ** k for k in range(6, 21)]
    floyd, ins_worst = [], []
    for n in sizes:
        rng = random.Random(20250816)
        a = list(range(n))
        rng.shuffle(a)
        floyd.append(floyd_build_swaps(a))
        ins_worst.append(insert_build_swaps(list(range(n, 0, -1))))

    # independent route 1: the worst case of Floyd's build is n - popcount(n),
    # checked by exhaustive search over every permutation for small n
    for n in range(2, 10):
        assert max(floyd_build_swaps(p) for p in itertools.permutations(range(n))) \
            == n - bin(n).count("1"), n
    # independent route 2: a reverse feed sends every element to the root, so
    # the swap total is the sum of the depths, sum floor(log2 i)
    for n in (15, 63, 255, 1023, 10 ** 4):
        assert insert_build_swaps(list(range(n, 0, -1))) \
            == sum(int(math.log2(i + 1)) for i in range(n)), n
    assert insert_build_swaps(list(range(1023, 0, -1))) == 8194
    assert floyd_build_swaps(list(range(1024))) == 0  # already a min-heap
    rng = random.Random(20250816)
    a = list(range(10 ** 6))
    rng.shuffle(a)
    assert floyd_build_swaps(a) == 742904
    assert abs(742904 / 10 ** 6 - 0.742904) < 1e-9

    c = S.SERIES[mode]
    ref = [n * math.log2(n) for n in sizes]
    fig, ax = plt.subplots()
    ax.loglog(sizes, ref, color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.loglog(sizes, ins_worst, color=c[1], lw=2.3, marker="o", ms=5)
    ax.loglog(sizes, floyd, color=c[0], lw=2.3, marker="o", ms=5)
    S.label_end(ax, sizes[-1], ins_worst[-1], "repeated insertion,\nworst case", c[1], mode, dy=4)
    S.label_end(ax, sizes[-1], floyd[-1], "Floyd build-heap\n(measured, ~0.74n)", c[0], mode, dy=-12)
    S.note(ax, 70, 6e6,
           "dashed: n log2 n. At n = 1,048,576 Floyd performs\n"
           "742,904 swaps - fewer than one per element, at every size", mode)
    ax.set_xlabel("elements  n  (log scale)")
    ax.set_ylabel("swaps  (log scale)")
    ax.set_title("O(n) build-heap is a real result, not a rounding")
    ax.set_xlim(50, 6e6)
    ax.set_ylim(20, 6e7)
    S.strip(ax)
    return fig


@figure("sw2-chain-distribution")
def _(mode):
    """Chain lengths at load factor 1, measured against the Poisson prediction.

    A hash table with as many keys as buckets is not "full": the bucket
    occupancies follow Poisson(1), so 36.8% of buckets stay empty and the mean
    successful search still costs about 1.5 probes. The bars are counted from
    a seeded placement of 100,000 keys into 100,000 buckets.
    """
    m = 10 ** 5
    counts = chain_lengths(m, m, 9)
    hist = [counts.count(k) / m for k in range(7)]
    poisson = [math.exp(-1) / math.factorial(k) for k in range(7)]
    assert abs(hist[0] - 0.36719) < 5e-4, hist[0]
    assert abs(poisson[0] - 0.3678794411714423) < 1e-12
    assert max(counts) == 8, max(counts)
    assert sum(counts) == m
    assert abs(sum(k * v for k, v in enumerate(hist)) - 1.0) < 0.02

    c = S.SERIES[mode]
    x = np.arange(7)
    fig, ax = plt.subplots()
    ax.bar(x - 0.19, hist, width=0.36, color=c[0])
    ax.bar(x + 0.19, poisson, width=0.36, color=c[1])
    S.label_end(ax, 3.35, 0.075, "measured", c[0], mode, dy=6)
    S.label_end(ax, 3.75, 0.045, "Poisson(1)", c[1], mode, dy=6)
    S.note(ax, 1.6, 0.30,
           "100,000 keys into 100,000 buckets: 36.7% of buckets are empty,\n"
           "the longest chain measured is 8, and the mean chain is 1", mode)
    ax.set_xlabel("keys landing in one bucket")
    ax.set_ylabel("fraction of buckets")
    ax.set_title("Load factor 1 is not a full table")
    ax.set_ylim(0, 0.44)
    S.strip(ax)
    return fig


@figure("sw2-graph-density")
def _(mode):
    """Adjacency probes for one full traversal, list against matrix, by density.

    Both counts are exact for V = 500: a matrix traversal reads all V^2 = 250,000
    cells whatever the edge count, while a list traversal touches 2E + V. The
    gap is 100x on a sparse graph and vanishes only when the graph is complete,
    which is the whole content of "choose the representation from the density".
    """
    v = 500
    es = [500, 1000, 2500, 5000, 12500, 25000, 50000, 100000, 124750]
    lst, mat = [], []
    for e in es:
        a, b = traversal_probes(v, e, 5)
        lst.append(a)
        mat.append(b)
    dens = [2 * e / (v * (v - 1)) for e in es]

    assert mat[0] == 250000 and all(x == 250000 for x in mat)
    assert lst[1] == 2500, lst[1]
    assert traversal_probes(500, 1000, 5)[0] == 2500
    assert abs(mat[1] / lst[1] - 100.0) < 1e-9
    assert es[-1] == v * (v - 1) // 2 and abs(dens[-1] - 1.0) < 1e-12
    assert lst[-1] == mat[-1]

    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    ax.loglog(dens, mat, color=c[1], lw=2.3)
    ax.loglog(dens, lst, color=c[0], lw=2.3, marker="o", ms=6)
    S.label_end(ax, dens[-1], mat[-1], "adjacency matrix\nV^2, always", c[1], mode, dy=12)
    S.label_end(ax, dens[0], lst[0], "adjacency list\n2E + V", c[0], mode, dy=-14, ha="left")
    S.note(ax, 0.0045, 4.5e5,
           "V = 500. At density 0.008 the matrix reads 100 cells\n"
           "for every one the list reads; at density 1 they tie.", mode)
    ax.set_xlabel("edge density  2E / V(V-1)  (log scale)")
    ax.set_ylabel("adjacency probes per traversal  (log scale)")
    ax.set_title("The representation, not the algorithm, sets the traversal cost")
    ax.set_ylim(1e3, 1.4e6)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Numbers the two lessons print that no figure happens to draw. They are pinned
# here so the whole chapter's arithmetic fails the build if any of it drifts,
# and every one of them is produced by RUNNING something, not by reasoning.
# ---------------------------------------------------------------------------


def selection_comparisons(arr):
    a = list(arr)
    n, c = len(a), 0
    for i in range(n - 1):
        m = i
        for j in range(i + 1, n):
            c += 1
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]
    assert a == sorted(arr)
    return c


def bubble_comparisons(arr):
    """Textbook bubble sort with the early-exit flag."""
    a = list(arr)
    n, c = len(a), 0
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            c += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    assert a == sorted(arr)
    return c


def quick_comparisons(arr):
    """Lomuto partition, last element as pivot."""
    a = list(arr)
    c = 0

    def qs(lo, hi):
        nonlocal c
        if lo >= hi:
            return
        pivot, i = a[hi], lo
        for j in range(lo, hi):
            c += 1
            if a[j] <= pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        qs(lo, i - 1)
        qs(i + 1, hi)

    qs(0, len(a) - 1)
    assert a == sorted(arr)
    return c


def binary_search_steps(a, key):
    """Loop iterations, i.e. three-way key comparisons, for one lookup."""
    lo, hi, steps = 0, len(a) - 1, 0
    while lo <= hi:
        steps += 1
        mid = lo + (hi - lo) // 2
        if a[mid] == key:
            return steps, True
        if a[mid] < key:
            lo = mid + 1
        else:
            hi = mid - 1
    return steps, False


def fib_calls(n, _memo={}):
    if n in _memo:
        return _memo[n]
    _memo[n] = 1 if n < 2 else 1 + fib_calls(n - 1) + fib_calls(n - 2)
    return _memo[n]


def fib_calls_direct(n):
    """Uninstrumented recursion, counted by actually making every call."""
    if n < 2:
        return 1
    return 1 + fib_calls_direct(n - 1) + fib_calls_direct(n - 2)


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def verify() -> None:  # noqa: C901
    # --- growth-rate comparison ------------------------------------------
    assert [n for n in range(2, 5000) if math.isclose(math.sqrt(n), math.log2(n))] == [4, 16]
    assert all(math.log2(n) > math.sqrt(n) for n in range(5, 16))
    assert all(math.sqrt(n) > math.log2(n) for n in range(17, 5000))
    assert abs(0.2 * 50 - 10.0) < 1e-12      # 0.2 n^2 log10 n meets 10 n^2 at log10 n = 50

    # --- recurrences ------------------------------------------------------
    def t_nlogn(n):
        return 0.0 if n == 1 else 2 * t_nlogn(n // 2) + n * math.log2(n)
    for k in range(1, 13):
        n = 2 ** k
        assert abs(t_nlogn(n) - n * k * (k + 1) / 2) < 1e-6, n
    assert abs(t_nlogn(1024) - 56320.0) < 1e-9
    assert abs(1 / (1 - 3 / 16) - 16 / 13) < 1e-15
    assert abs(16 / 13 - 1.2307692307692308) < 1e-15
    assert abs(math.log2(7) - 2.807354922057604) < 1e-12

    # --- binary search ----------------------------------------------------
    for n in range(1, 3001):
        a = list(range(n))
        assert max(binary_search_steps(a, k)[0] for k in range(n)) \
            == math.floor(math.log2(n)) + 1, n
    for k in range(2, 12):
        n = 2 ** k - 1
        a = list(range(n))
        mean = sum(binary_search_steps(a, key)[0] for key in range(n)) / n
        assert abs(mean - ((k - 1) * 2 ** k + 1) / n) < 1e-12, n
    assert abs(((10 - 1) * 2 ** 10 + 1) / 1023 - 9.009775171065494) < 1e-12
    assert binary_search_steps([5, 10, 15, 25, 105], 105) == (3, True)

    # --- Fibonacci: the 27,643x correction --------------------------------
    for n in range(0, 26):
        assert fib_calls(n) == fib_calls_direct(n) == 2 * fib(n + 1) - 1, n
    assert fib_calls(30) == 2692537
    assert fib_calls(40) == 331160281
    assert fib_calls(50) == 40730022147
    assert abs(2 ** 50 / fib_calls(50) - 27642.997658560147) < 1e-6
    assert abs(2 ** 30 / fib_calls(30) - 398.78442673211174) < 1e-9
    phi = (1 + 5 ** 0.5) / 2
    assert abs(fib_calls(50) / fib_calls(49) - phi) < 1e-10

    # --- sorting counts ---------------------------------------------------
    rng = random.Random(11)
    for n in (5, 7, 10, 50, 200):
        assert {selection_comparisons(rng.sample(range(1000), n)) for _ in range(50)} \
            == {n * (n - 1) // 2}, n
    for n in (5, 7, 8, 10):
        assert bubble_comparisons(list(range(n, 0, -1))) == n * (n - 1) // 2
        assert bubble_comparisons(list(range(1, n + 1))) == n - 1
    assert selection_comparisons([4, 0, 3, 1, 7]) == 10
    for n in range(2, 9):
        total = sum(quick_comparisons(p) for p in itertools.permutations(range(n)))
        mean = Fraction(total, math.factorial(n))
        assert mean == 2 * (n + 1) * harmonic(n) - 4 * n, (n, mean)
    assert quick_comparisons(list(range(1000))) == 499500
    assert insertion_comparisons([10, 15, 5, 13]) == 5

    # two sorted runs of four merged: 6 comparisons for this pair, 7 the most
    # any pair of four-element runs can force
    def merge_two(a, b):
        i = j = c = 0
        while i < len(a) and j < len(b):
            c += 1
            if a[i] <= b[j]:
                i += 1
            else:
                j += 1
        return c
    assert merge_two([14, 46, 60, 64], [31, 33, 76, 82]) == 6
    assert max(merge_two(sorted(s), sorted(set(range(8)) - set(s)))
               for s in itertools.combinations(range(8), 4)) == 7

    # --- traces the problem sets print ------------------------------------
    a = [4, 0, 3, 1, 7]
    for p in range(2):
        for j in range(len(a) - 1 - p):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    assert a == [0, 1, 3, 4, 7]

    a = [3, 9, 8, 10, 2, 11, 4]
    pivot, i = a[-1], 0
    for j in range(len(a) - 1):
        if a[j] <= pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[-1] = a[-1], a[i]
    assert a == [3, 2, 4, 10, 9, 11, 8] and i == 2

    src = [43, 6, 13, 2, 17, 29, 11, 31, 73]
    assert sorted([src[0], src[len(src) // 2], src[-1]])[1] == 43

    table = [None] * 8
    for x in (20, 10, 16, 14, 15, 17):
        h = x % 8
        while table[h] is not None:
            h = (h + 1) % 8
        table[h] = x
    assert table == [16, 17, 10, None, 20, None, 14, 15]

    # --- graph traversal ---------------------------------------------------
    adj = {"A": ["B", "C", "D"], "B": ["A", "E"], "C": ["A", "E", "F"],
           "D": ["A", "F"], "E": ["B", "C", "G"], "F": ["C", "D", "G"],
           "G": ["E", "F"]}
    assert len(adj) == 7 and sum(len(v) for v in adj.values()) // 2 == 9
    seen, queue, order, dist = {"A"}, ["A"], [], {"A": 0}
    while queue:
        u = queue.pop(0)
        order.append(u)
        for v in adj[u]:
            if v not in seen:
                seen.add(v)
                dist[v] = dist[u] + 1
                queue.append(v)
    assert order == list("ABCDEFG")
    assert dist == {"A": 0, "B": 1, "C": 1, "D": 1, "E": 2, "F": 2, "G": 3}
    stack_seen, dfs_order = set(), []

    def dfs(u):
        stack_seen.add(u)
        dfs_order.append(u)
        for v in adj[u]:
            if v not in stack_seen:
                dfs(v)
    dfs("A")
    assert dfs_order == list("ABECFDG"), dfs_order

    # --- greedy versus optimal ---------------------------------------------
    items = [("A", 6, 30), ("B", 5, 20), ("C", 5, 21)]
    cap = 10
    order_by_density = sorted(items, key=lambda t: -t[2] / t[1])
    assert [t[0] for t in order_by_density] == ["A", "C", "B"]
    w = v = 0
    for _, wi, vi in order_by_density:
        if w + wi <= cap:
            w, v = w + wi, v + vi
    assert (w, v) == (6, 30)
    best = max((sum(t[2] for t in combo), tuple(t[0] for t in combo))
               for r in range(len(items) + 1)
               for combo in itertools.combinations(items, r)
               if sum(t[1] for t in combo) <= cap)
    assert best == (41, ("B", "C"))
    dp = [[0] * (cap + 1) for _ in range(len(items) + 1)]
    for idx, (_, wi, vi) in enumerate(items, 1):
        for cc in range(cap + 1):
            dp[idx][cc] = dp[idx - 1][cc]
            if wi <= cc:
                dp[idx][cc] = max(dp[idx][cc], dp[idx - 1][cc - wi] + vi)
    assert dp[3][10] == 41 and dp[1][10] == 30 and dp[3][5] == 21
    assert abs(30 / 41 - 0.7317073170731707) < 1e-12

    acts = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10),
            (8, 11), (8, 12), (2, 14), (12, 16)]
    picked, last = [], -1
    for s, f in sorted(acts, key=lambda t: t[1]):
        if s >= last:
            picked.append((s, f))
            last = f
    assert picked == [(1, 4), (5, 7), (8, 11), (12, 16)]
    biggest = 0
    for r in range(len(acts), 0, -1):
        if any(all(c[i][1] <= c[i + 1][0] for i in range(r - 1))
               for c in itertools.combinations(sorted(acts), r)):
            biggest = r
            break
    assert biggest == 4

    inf = float("inf")
    coin_row = [0] + [inf] * 6
    for t in range(1, 7):
        for cn in (1, 3, 4):
            if cn <= t:
                coin_row[t] = min(coin_row[t], coin_row[t - cn] + 1)
    assert coin_row == [0, 1, 2, 1, 1, 2, 2]
    assert greedy_coins([1, 3, 4], 6) == 3 and optimal_coins([1, 3, 4], 6) == 2

    # --- data structures ---------------------------------------------------
    assert sum(1 for i in range(1, 11) for _ in range(i, 11)) == 55
    for n in (2 ** k - 1 for k in range(2, 12)):
        k = int(math.log2(n + 1))
        assert abs(((k - 1) * 2 ** k + 1) / n - _perfect_bst_mean(n)) < 1e-12, n
    assert abs(_perfect_bst_mean(1023) - 9.009775171065494) < 1e-12
    assert abs(_perfect_bst_mean(15) - 3.2666666666666666) < 1e-12
    assert abs(12.436 / _perfect_bst_mean(1023) - 1.3802125) < 1e-4

    # two-stack queue: every element is pushed twice and popped twice
    for n in (10, 100, 1000, 10 ** 5):
        front, back, ops = [], [], 0
        for i in range(n):
            front.append(i)
            ops += 1
        out = []
        for _ in range(n):
            if not back:
                while front:
                    back.append(front.pop())
                    ops += 2
            out.append(back.pop())
            ops += 1
        assert out == list(range(n)) and ops == 4 * n, n

    cap8 = 8
    assert (2 - 6 + cap8) % cap8 == 4
    assert 2000 + (2 * 6 + 3) * 4 == 2060
    assert 16 / 4 == 4 and 24 / 4 == 6
    assert 8 * 1024 * 1024 // 64 == 131072

    # postfix evaluation
    stack = []
    for tok in "5 3 + 8 2 - *".split():
        if tok.isdigit():
            stack.append(int(tok))
        else:
            b, a2 = stack.pop(), stack.pop()
            stack.append({"+": a2 + b, "-": a2 - b, "*": a2 * b}[tok])
    assert stack == [48]

    # graph storage break-even under the byte model the lesson states
    for v_, expect in ((100, 0.1212121), (1000, 0.1246246), (10000, 0.1249625)):
        e_ = (v_ * v_ - 4 * v_) / 16
        assert abs(2 * e_ / (v_ * (v_ - 1)) - expect) < 1e-6, v_
    assert (1000 ** 2 - 4 * 1000) / 16 == 62250

    print("verify(): every non-figure count in the two lessons reproduced")


def _perfect_bst_mean(n: int) -> float:
    """Mean comparisons to find a key in a perfect BST, by building one."""
    keys = list(range(n))

    def build(lo, hi, depth, acc):
        if lo > hi:
            return acc
        mid = (lo + hi) // 2
        acc[0] += depth
        build(lo, mid - 1, depth + 1, acc)
        build(mid + 1, hi, depth + 1, acc)
        return acc

    total = build(0, len(keys) - 1, 1, [0])[0]
    return total / n


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    verify()
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith("sw2-"), f"figure {n} is outside this file's namespace"
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
