#!/usr/bin/env python3
"""Depth-wave-23 figures for the FE Electrical and Computer course:
the two Computer Networks chapters on network topologies (fee_topologies)
and on network security (fee_net_security).

Same contract as the other gen_fe_ee_*.py generators, and it imports the SAME
style module rather than growing a second look. Every curve here is COMPUTED,
in this file, from a closed form the lesson that references it writes out.
Nothing is traced, scanned, redrawn or adapted from a handbook, a standards
document or a textbook: the pipeline consumes formulas, which are not
protected expression, and never anyone's drawing of them.

The topology figures go further than evaluating a formula. Link counts come
from BUILDING the graph and COUNTING its adjacency lists; diameters come from
BREADTH-FIRST SEARCH over that graph; bisection widths come from brute-forcing
every balanced cut. The closed form the lesson prints is then asserted against
that construction, so a wrong formula cannot survive into a figure. Reliability
and birthday-collision curves are asserted against MONTE CARLO as well as
against their algebra.

Nothing in the security figures names a product, a vendor or a vulnerability.
Every security curve is a statement about mechanism and arithmetic: key-space
size, digest width, base rate, protocol overhead, cycles per byte.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_d23.py             # all
    python3 scripts/gen_fe_ee_d23.py net3-birth  # only names with that prefix
"""
from __future__ import annotations

import itertools
import math
import pathlib
import random
import sys
from collections import deque

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

PREFIX = "net3-"
REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only the {PREFIX!r} prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ------------------------------------------------------------- graph toolkit
# Deliberately independent of the formulas the lessons state: these routines
# build a graph and measure it, so a figure asserts construction against
# algebra rather than algebra against itself.

def build(kind: str, n: int) -> dict[int, set[int]]:
    adj: dict[int, set[int]] = {v: set() for v in range(n)}

    def add(u, v):
        adj[u].add(v)
        adj[v].add(u)

    if kind == "star":                      # node 0 is the hub
        for v in range(1, n):
            add(0, v)
    elif kind == "ring":
        for v in range(n):
            add(v, (v + 1) % n)
    elif kind == "line":                    # a bus segment drawn as a graph
        for v in range(n - 1):
            add(v, v + 1)
    elif kind == "mesh":                    # complete graph
        for u, v in itertools.combinations(range(n), 2):
            add(u, v)
    elif kind == "bintree":                 # complete binary tree, heap order
        for v in range(1, n):
            add(v, (v - 1) // 2)
    elif kind == "hypercube":
        k = int(round(math.log2(n)))
        assert 2 ** k == n, n
        for v in range(n):
            for b in range(k):
                add(v, v ^ (1 << b))
    elif kind == "torus":                   # square wrap-around grid
        s = math.isqrt(n)
        assert s * s == n, n
        for r in range(s):
            for c in range(s):
                add(r * s + c, r * s + (c + 1) % s)
                add(r * s + c, ((r + 1) % s) * s + c)
    else:
        raise ValueError(kind)
    return adj


def edge_count(adj) -> int:
    """Count edges by walking adjacency lists. No formula is consulted."""
    return sum(len(a) for a in adj.values()) // 2


def bfs(adj, src, banned=frozenset()):
    dist = {src: 0}
    queue = deque([src])
    while queue:
        u = queue.popleft()
        for w in adj[u]:
            if w in banned or w in dist:
                continue
            dist[w] = dist[u] + 1
            queue.append(w)
    return dist


def diameter(adj) -> int:
    """Largest shortest-path length, measured by BFS from every node."""
    worst = 0
    for src in adj:
        d = bfs(adj, src)
        assert len(d) == len(adj), "graph is disconnected"
        worst = max(worst, max(d.values()))
    return worst


def connected(adj, banned=frozenset()) -> bool:
    live = [v for v in adj if v not in banned]
    return not live or len(bfs(adj, live[0], banned)) == len(live)


def bisection_width(adj) -> int:
    """Fewest edges cut over every balanced halving of the node set."""
    nodes = list(adj)
    half = len(nodes) // 2
    best = None
    for combo in itertools.combinations(nodes[1:], half - 1):
        left = {nodes[0], *combo}
        cut = sum(1 for u in left for v in adj[u] if v not in left)
        best = cut if best is None else min(best, cut)
    return best


def node_connectivity(adj) -> int:
    """Fewest nodes whose REMOVAL disconnects the survivors."""
    n = len(adj)
    for k in range(n - 1):
        for gone in itertools.combinations(range(n), k):
            if not connected(adj, frozenset(gone)):
                return k
    return n - 1


# ---------------------------------------------------------------------------
# fee_topologies
# ---------------------------------------------------------------------------


@figure("net3-topology-diameter")
def _(mode):
    """Diameter against node count for ring, hypercube and full mesh.

    Every plotted point is produced by BFS on a graph this file builds, and the
    closed forms the lesson prints -- floor(n/2), log2 n, 1 -- are asserted
    against those measurements rather than substituted for them.
    """
    c = S.SERIES[mode]
    sizes = [4, 8, 16, 32, 64]

    ring_d, cube_d, mesh_d = [], [], []
    for n in sizes:
        r = diameter(build("ring", n))
        h = diameter(build("hypercube", n))
        m = diameter(build("mesh", n))
        assert r == n // 2, (n, r)
        assert h == int(math.log2(n)), (n, h)
        assert m == 1, (n, m)
        ring_d.append(r)
        cube_d.append(h)
        mesh_d.append(m)

    assert ring_d == [2, 4, 8, 16, 32], ring_d
    assert cube_d == [2, 3, 4, 5, 6], cube_d
    assert mesh_d == [1] * 5, mesh_d
    # the star is a constant 2 at every size, measured the same way
    assert [diameter(build("star", n)) for n in sizes] == [2] * 5

    fig, ax = plt.subplots()
    ax.plot(sizes, ring_d, color=c[0], lw=2.2, marker="o")
    ax.plot(sizes, cube_d, color=c[1], lw=2.2, marker="o")
    ax.plot(sizes, mesh_d, color=c[2], lw=2.2, marker="o")
    S.label_end(ax, 64, 32, "ring:  floor(n/2)", c[0], mode, dx=-8, dy=6, ha="right")
    S.label_end(ax, 64, 6, "hypercube:  log2 n", c[1], mode, dx=-8, dy=10, ha="right")
    S.label_end(ax, 64, 1, "full mesh:  1", c[2], mode, dx=-8, dy=10, ha="right")
    ax.set_xscale("log", base=2)
    ax.set_yscale("log", base=2)
    ax.set_xticks(sizes)
    ax.set_xticklabels([str(s) for s in sizes])
    ax.set_yticks([1, 2, 4, 8, 16, 32])
    ax.set_yticklabels(["1", "2", "4", "8", "16", "32"])
    S.note(ax, 4.4, 12.0, "measured by breadth-first search on the\n"
                          "graph itself, not read off a formula", mode)
    ax.set_xlabel("nodes  n")
    ax.set_ylabel("diameter  (hops)")
    ax.set_title("Worst-case hop count: what a topology costs in latency")
    ax.set_ylim(0.7, 48)
    S.strip(ax)
    return fig


@figure("net3-bisection-width")
def _(mode):
    """Bisection width against node count, brute-forced at small n.

    Bisection width is the throughput a topology can sustain across its own
    middle. Ring is 2 at every size; the hypercube is n/2; the full mesh is
    n^2/4. Small cases are confirmed by enumerating every balanced cut.
    """
    c = S.SERIES[mode]

    # brute force where it is affordable, then extend by the confirmed formula
    assert bisection_width(build("ring", 8)) == 2
    assert bisection_width(build("ring", 10)) == 2
    assert bisection_width(build("hypercube", 8)) == 4
    assert bisection_width(build("hypercube", 16)) == 8
    assert bisection_width(build("mesh", 8)) == 16
    assert bisection_width(build("mesh", 10)) == 25
    assert bisection_width(build("line", 8)) == 1

    n = np.array([4, 8, 16, 32, 64], dtype=float)
    ring = np.full_like(n, 2.0)
    cube = n / 2.0
    mesh = n * n / 4.0
    assert cube[1] == 4.0 and cube[2] == 8.0
    assert mesh[1] == 16.0 and mesh[4] == 1024.0

    fig, ax = plt.subplots()
    ax.plot(n, ring, color=c[0], lw=2.2, marker="o")
    ax.plot(n, cube, color=c[1], lw=2.2, marker="o")
    ax.plot(n, mesh, color=c[2], lw=2.2, marker="o")
    S.label_end(ax, 64, 2, "ring:  2", c[0], mode, dx=-8, dy=10, ha="right")
    S.label_end(ax, 64, 32, "hypercube:  n/2", c[1], mode, dx=-8, dy=-14, ha="right")
    S.label_end(ax, 64, 1024, "full mesh:  n^2/4", c[2], mode, dx=-8, dy=-14, ha="right")
    ax.set_xscale("log", base=2)
    ax.set_yscale("log", base=2)
    ax.set_xticks([4, 8, 16, 32, 64])
    ax.set_xticklabels(["4", "8", "16", "32", "64"])
    S.note(ax, 4.3, 90.0, "a ring's middle never widens, so\nadding nodes adds no cross-"
                          "sectional\nbandwidth at all", mode)
    ax.set_xlabel("nodes  n")
    ax.set_ylabel("bisection width  (links cut)")
    ax.set_title("Bandwidth across the middle: bisection width against size")
    ax.set_ylim(1, 3000)
    S.strip(ax)
    return fig


@figure("net3-reliability-paths")
def _(mode):
    """Nines delivered by k links in series and by k paths in parallel.

    Plotted as -log10(1 - A) so a "nine" is one unit on the y-axis. Both
    curves are confirmed by Monte-Carlo trials over independent link failures.
    """
    c = S.SERIES[mode]
    a = 0.99
    k = np.arange(1, 9)
    series = a ** k
    parallel = 1.0 - (1.0 - a) ** k

    assert abs(series[2] - 0.970299) < 1e-9
    assert abs(series[4] - 0.9509900499) < 1e-10
    assert abs(parallel[1] - 0.9999) < 1e-12
    assert abs(parallel[2] - 0.999999) < 1e-12

    rng = random.Random(20260817)

    def mc_series(kk, trials=200_000):
        return sum(all(rng.random() < a for _ in range(kk))
                   for _ in range(trials)) / trials

    def mc_parallel(kk, trials=200_000):
        return sum(any(rng.random() < a for _ in range(kk))
                   for _ in range(trials)) / trials

    for kk in (2, 3, 5):
        assert abs(mc_series(kk) - a ** kk) < 4e-3, kk
    for kk in (2, 3):
        assert abs(mc_parallel(kk) - (1 - (1 - a) ** kk)) < 4e-3, kk

    nines_s = -np.log10(1.0 - series)
    nines_p = -np.log10(1.0 - parallel)
    assert abs(nines_p[1] - 4.0) < 1e-12          # two paths give exactly four nines
    assert abs(nines_s[0] - 2.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(k, nines_p, color=c[0], lw=2.2, marker="o")
    ax.plot(k, nines_s, color=c[1], lw=2.2, marker="o")
    S.label_end(ax, 6.0, nines_p[5], "k parallel paths:  1 - (1-a)^k", c[0], mode,
                dx=-6, dy=12, ha="right")
    S.label_end(ax, 6.0, nines_s[5], "k links in series:  a^k", c[1], mode,
                dx=-6, dy=-14, ha="right")
    ax.axhline(2.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.05, 2.15, "one link: two nines", mode)
    S.note(ax, 4.15, 3.4, "each extra parallel path adds exactly two more\n"
                          "nines at a = 0.99; each extra series link\n"
                          "takes some away", mode)
    ax.set_xlabel("number of links  k")
    ax.set_ylabel("nines of availability,  -log10(1 - A)")
    ax.set_title("Redundancy multiplies unavailability; series multiplies it back")
    ax.set_xlim(0.8, 8.4)
    ax.set_ylim(0, 17)
    S.strip(ax)
    return fig


@figure("net3-storm-growth")
def _(mode):
    """Broadcast frames in flight per hop generation, simulated on a switch mesh.

    The flood is SIMULATED -- a frame arriving on one trunk leaves by every
    other trunk -- so the geometric law the lesson states is confirmed by
    replication rather than assumed. Four fully-meshed switches replicate by
    two per generation and saturate their own trunks within three of them; a
    triangle merely circulates for ever at constant volume.
    """
    c = S.SERIES[mode]

    def flood(kind, n, gens):
        adj = build(kind, n)
        inflight = [(None, 0)]
        counts = []
        for _ in range(gens):
            nxt = [(at, nb) for came, at in inflight
                   for nb in adj[at] if nb != came]
            inflight = nxt
            counts.append(len(inflight))
        return counts

    quad = flood("mesh", 4, 8)
    tri = flood("mesh", 3, 8)
    assert quad[:4] == [3, 6, 12, 24], quad
    assert tri[:4] == [2, 2, 2, 2], tri
    # the simulated counts match the closed form F(g) = 3 * 2^(g-1)
    assert all(v == 3 * 2 ** g for g, v in enumerate(quad)), quad

    capacity = 2 * edge_count(build("mesh", 4))
    assert capacity == 12, capacity
    gstar = 1 + math.ceil(math.log2(capacity / quad[0]))
    assert gstar == 3, gstar
    assert 3 * 2 ** (gstar - 1) == 12

    g = np.arange(1, 9)
    fig, ax = plt.subplots()
    ax.plot(g, quad, color=c[0], lw=2.2, marker="o")
    ax.plot(g, tri, color=c[1], lw=2.2, marker="o")
    ax.axhline(capacity, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, 6.0, quad[5], "four meshed switches:  3 x 2^(g-1)", c[0], mode,
                dx=-6, dy=12, ha="right")
    S.label_end(ax, 6.0, tri[5], "triangle:  constant 2, for ever", c[1], mode,
                dx=-6, dy=12, ha="right")
    ax.plot([gstar], [12], "o", color=S.INK[mode], ms=9, zorder=5,
            markerfacecolor="none", markeredgewidth=1.8)
    S.note(ax, 1.1, 16.0, "12 directed trunk links, one 64-byte frame each per\n"
                          "0.512 us slot: the fabric is full after 3 generations,\n"
                          "which is 1.536 us", mode)
    ax.set_yscale("log", base=2)
    ax.set_yticks([1, 2, 4, 8, 16, 32, 64, 128, 256, 512])
    ax.set_yticklabels(["1", "2", "4", "8", "16", "32", "64", "128", "256", "512"])
    ax.set_xlabel("hop generation  g")
    ax.set_ylabel("broadcast frames in flight")
    ax.set_title("Why a layer-2 loop is fatal: no hop limit, so nothing decays")
    ax.set_xlim(0.7, 8.4)
    ax.set_ylim(1, 900)
    S.strip(ax)
    return fig


@figure("net3-cable-loss")
def _(mode):
    """Insertion loss against channel length at three frequencies.

    Twisted-pair loss per metre grows as the square root of frequency, so the
    same 21.7 dB channel budget buys shorter and shorter cable as the signalling
    rate climbs. The design coefficient at 100 MHz is the stated input; every
    other number on the figure follows from alpha(f) = alpha_100 sqrt(f/100).
    """
    c = S.SERIES[mode]
    a100 = 0.20                       # dB per metre at 100 MHz, stated design input
    budget = 21.7                     # dB, the channel loss the lesson budgets

    def alpha(f_mhz):
        return a100 * math.sqrt(f_mhz / 100.0)

    a250, a500 = alpha(250), alpha(500)
    assert abs(a250 - 0.31622777) < 5e-9, a250
    assert abs(a500 - 0.44721360) < 5e-9, a500
    reach = [budget / a100, budget / a250, budget / a500]
    assert abs(reach[0] - 108.5) < 5e-10, reach
    assert abs(reach[1] - 68.62143) < 5e-6, reach
    assert abs(reach[2] - 48.522675) < 5e-6, reach
    assert abs(90 * a100 - 18.0) < 1e-12
    assert abs(90 * a100 + 10 * a100 * 1.2 - 20.4) < 1e-12
    assert abs(90 * a250 - 28.460499) < 5e-7

    L = np.linspace(0, 130, 601)
    fig, ax = plt.subplots()
    for k, (f, al, top) in enumerate(((100, a100, 26.0), (250, a250, 34.0),
                                      (500, a500, 34.0))):
        ax.plot(L, al * L, color=c[k], lw=2.2)
        S.label_end(ax, top / al, top, f"{f} MHz", c[k], mode, dx=-7, dy=-9,
                    ha="right")
    ax.axhline(budget, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.axvline(100.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    for r in reach:
        ax.plot([r], [budget], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 2.0, 22.3, "21.7 dB channel budget", mode)
    S.note(ax, 130.0, 1.5, "48.5 m, 68.6 m and 108.5 m: the reach one fixed\n"
                           "loss budget buys once the cable has to carry a\n"
                           "higher signalling frequency", mode, ha="right")
    S.note(ax, 98.0, 12.0, "100 m", mode, ha="right")
    ax.set_xlabel("channel length  (m)")
    ax.set_ylabel("insertion loss  (dB)")
    ax.set_title("Where the hundred-metre rule comes from")
    ax.set_xlim(0, 132)
    ax.set_ylim(0, 34)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# fee_net_security
# ---------------------------------------------------------------------------


@figure("net3-birthday-curve")
def _(mode):
    """Collision probability against sample size for a 24-bit digest.

    The exact product and the exponential approximation are drawn together and
    both are confirmed by Monte Carlo. A 24-bit digest is used because it can
    actually be simulated; the lesson then scales the same law to 64, 128 and
    256 bits.
    """
    c = S.SERIES[mode]
    M = 2 ** 24

    q = np.arange(1, 20001, 50)
    approx = 1.0 - np.exp(-q * (q - 1) / (2.0 * M))

    def exact(qq):
        p = 1.0
        for i in range(qq):
            p *= 1.0 - i / M
        return 1.0 - p

    exact_vals = np.array([exact(int(x)) for x in q])
    assert abs(exact(5000) - 0.5252577) < 5e-8, exact(5000)
    assert abs((1.0 - math.exp(-5000 * 4999 / (2.0 * M))) - 0.5252225) < 5e-8
    # the two agree to better than a thousandth everywhere on the plotted range
    assert float(np.max(np.abs(exact_vals - approx))) < 1e-3

    q50 = math.sqrt(2 * math.log(2) * M)
    assert abs(q50 - 4822.671) < 5e-3, q50
    assert abs(math.sqrt(2 * math.log(2)) - 1.17741) < 5e-6

    rng = random.Random(9142026)

    def mc(qq, trials=6000):
        hits = 0
        for _ in range(trials):
            seen = set()
            for _ in range(qq):
                x = rng.randrange(M)
                if x in seen:
                    hits += 1
                    break
                seen.add(x)
        return hits / trials

    mc_q = [2000, 5000, 9000]
    mc_p = [mc(x) for x in mc_q]
    for x, p in zip(mc_q, mc_p):
        assert abs(p - exact(x)) < 2.5e-2, (x, p, exact(x))

    fig, ax = plt.subplots()
    ax.plot(q, exact_vals, color=c[0], lw=2.4)
    ax.plot(q, approx, color=c[1], lw=1.8, ls=(0, (5, 3)))
    ax.plot(mc_q, mc_p, "o", color=c[2], ms=8, zorder=5)
    S.label_end(ax, 11200, 0.88, "exact product", c[0], mode, dx=0, dy=0)
    S.label_end(ax, 11200, 0.76, "exponential approximation,\nlying on top of it",
                c[1], mode, dx=0, dy=0)
    S.label_end(ax, 8600, mc_p[2], "Monte Carlo", c[2], mode, dx=-8, dy=14, ha="right")
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axvline(q50, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, q50 + 250, 0.06, "q50 = sqrt(2 ln2 . M) = 4823\nfor a 24-bit digest", mode)
    ax.set_xlabel("distinct items hashed,  q")
    ax.set_ylabel("probability of at least one collision")
    ax.set_title("The birthday bound: collisions arrive at the square root")
    ax.set_xlim(0, 20500)
    ax.set_ylim(0, 1.02)
    S.strip(ax)
    return fig


@figure("net3-password-entropy")
def _(mode):
    """Secret entropy against length for three alphabets.

    H = L log2 A exactly. The guide lines are the work factors an attacker at a
    stated guessing rate needs a day and a century for, both computed here.
    """
    c = S.SERIES[mode]
    L = np.arange(1, 21)
    alphabets = ((10, "digits only  (A = 10)"),
                 (26, "lower case  (A = 26)"),
                 (95, "printable ASCII  (A = 95)"))

    assert abs(math.log2(95) - 6.5698556) < 5e-8
    assert abs(8 * math.log2(95) - 52.558845) < 5e-7
    assert abs(12 * math.log2(95) - 78.838267) < 5e-7
    assert abs(4 * math.log2(10) - 13.287712) < 5e-7

    rate = 1e10                       # offline guesses per second, stated input
    day = math.log2(rate * 86400 * 2)         # bits needed to survive a day
    century = math.log2(rate * 86400 * 36525 * 2)
    assert abs(day - 50.61802) < 5e-5, day
    assert abs(century - 65.77462) < 5e-5, century

    fig, ax = plt.subplots()
    for k, (A, name) in enumerate(alphabets):
        H = L * math.log2(A)
        ax.plot(L, H, color=c[k], lw=2.2)
        S.label_end(ax, 20, H[-1], name, c[k], mode, dx=-6, dy=9, ha="right")
    for y in (day, century):
        ax.axhline(y, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 20.0, 7.0, "dashed guides: 50.6 bits survives\n"
                          "one day and 65.8 bits one century,\n"
                          "at 10^10 offline guesses per second", mode, ha="right")
    for x, A, dx, dy, ha, tag in ((8, 95, -0.4, 5.0, "right", "8 printable: 52.6 bits"),
                                  (12, 95, -0.4, 5.0, "right", "12 printable: 78.8 bits"),
                                  (4, 10, 0.4, -7.0, "left", "4-digit PIN: 13.3 bits")):
        ax.plot([x], [x * math.log2(A)], "o", color=S.INK[mode], ms=7, zorder=5)
        S.note(ax, x + dx, x * math.log2(A) + dy, tag, mode, ha=ha)
    ax.set_xlabel("secret length  L  (characters)")
    ax.set_ylabel("entropy  H = L log2 A   (bits)")
    ax.set_title("Length beats cleverness: entropy is linear in length")
    ax.set_xlim(0.5, 20.5)
    ax.set_ylim(0, 140)
    ax.set_xticks([2, 4, 6, 8, 10, 12, 14, 16, 18, 20])
    S.strip(ax)
    return fig


@figure("net3-detection-precision")
def _(mode):
    """Precision against base rate for a detector at three false-positive rates.

    Precision = TPR.pi / (TPR.pi + FPR.(1-pi)), which is Bayes' theorem with the
    labels a security team uses. Detection rate is held at 0.99 throughout, so
    every difference on the figure is the base rate and the false-positive rate
    talking, not sensor quality.
    """
    c = S.SERIES[mode]
    tpr = 0.99
    pi = np.logspace(-6, -1, 400)

    def precision(fpr):
        return tpr * pi / (tpr * pi + fpr * (1.0 - pi))

    curves = [(1e-3, "FPR = 10^-3"), (1e-4, "FPR = 10^-4"), (1e-5, "FPR = 10^-5")]

    def prec_at(fpr, p):
        return tpr * p / (tpr * p + fpr * (1 - p))

    assert abs(prec_at(1e-3, 1e-4) - 0.0900901) < 5e-8
    assert abs(prec_at(1e-5, 1e-4) - 0.9082652) < 5e-8
    assert abs(prec_at(1e-3, 1e-2) - 0.9090909) < 5e-8
    # the alert ledger the lesson tabulates, recomputed from counts
    assert abs(0.99 * 100 + 0.001 * 999900 - 1098.9) < 5e-10
    assert abs(99 / 1098.9 - 0.0900901) < 5e-8

    fig, ax = plt.subplots()
    for k, (fpr, name) in enumerate(curves):
        ax.plot(pi, precision(fpr), color=c[k], lw=2.2)
        # label each curve at a DIFFERENT precision so the three never collide
        target = (0.25, 0.5, 0.75)[k]
        w = target / (1 - target)
        cross = w * fpr / (tpr + w * fpr)
        S.label_end(ax, cross, target, name, c[k], mode, dx=7, dy=0)
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([1e-4], [prec_at(1e-3, 1e-4)], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 1.2e-4, 0.015, "100 bad sessions in a million:\n"
                              "9 of every 10 alerts are wrong", mode)
    S.note(ax, 1.2e-6, 0.53, "half the alerts real", mode)
    ax.set_xscale("log")
    ax.set_xlabel("base rate  pi   (fraction of sessions that are truly malicious)")
    ax.set_ylabel("precision  (fraction of alerts that are real)")
    ax.set_title("Alert fatigue is arithmetic: precision at a 0.99 detection rate")
    ax.set_ylim(0, 1.02)
    S.strip(ax)
    return fig


@figure("net3-esp-goodput")
def _(mode):
    """Tunnel-mode goodput fraction against inner packet size.

    The staircase is real: the ciphertext must be padded to a whole number of
    16-byte blocks, so goodput drops in steps as the payload crosses each block
    boundary. Every point is computed by the byte ledger the lesson tabulates.
    """
    c = S.SERIES[mode]

    def wire(inner, iv=16, esph=8, icv=12, newip=20, block=16):
        padded = -(-(inner + 2) // block) * block
        return newip + esph + iv + padded + icv

    assert wire(1400) == 1464, wire(1400)
    assert wire(64) == 136, wire(64)
    assert wire(576) == 648, wire(576)
    assert wire(1438) == 1496 and wire(1439) == 1512
    assert abs(1400 / wire(1400) - 0.9562842) < 5e-8
    assert abs(64 / wire(64) - 0.4705882) < 5e-8
    assert abs(1438 / wire(1438) - 0.9612299) < 5e-8
    best = max(i for i in range(1, 1600) if wire(i) <= 1500)
    assert best == 1438, best

    sizes = np.arange(40, 1460)
    frac = np.array([s / wire(int(s)) for s in sizes])
    # 20-byte and 12-byte fixed costs alone would give this smooth bound
    smooth = sizes / (sizes + 56)

    fig, ax = plt.subplots()
    ax.plot(sizes, frac * 100, color=c[0], lw=2.0)
    ax.plot(sizes, smooth * 100, color=c[1], lw=1.6, ls=(0, (5, 3)))
    S.label_end(ax, 700, 68.0, "with 16-byte block padding", c[0], mode, dx=0, dy=0)
    S.label_end(ax, 700, smooth[700 - 40] * 100, "fixed overhead only",
                c[1], mode, dx=-4, dy=13, ha="right")
    for s, dx, dy, ha, tag in ((64, 30, -9, "left", "64 B: 47.1 %"),
                               (576, 10, 4, "left", "576 B: 88.9 %"),
                               (1438, -12, -13, "right", "1438 B: 96.1 %")):
        ax.plot([s], [s / wire(s) * 100], "o", color=S.INK[mode], ms=7, zorder=5)
        S.note(ax, s + dx, s / wire(s) * 100 + dy, tag, mode, ha=ha)
    ax.axvline(1438, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 250, 20.0, "1438 bytes is the largest inner packet whose 1496-byte\n"
                          "encapsulation still fits a 1500-byte path MTU; one byte\n"
                          "more costs a whole 16-byte block and forces fragmentation",
           mode)
    ax.set_xlabel("inner packet size  (bytes)")
    ax.set_ylabel("goodput fraction  (%)")
    ax.set_title("What a tunnel costs: small packets pay most of the bill")
    ax.set_xlim(0, 1520)
    ax.set_ylim(0, 105)
    S.strip(ax)
    return fig


@figure("net3-crypto-ceiling")
def _(mode):
    """Encryption throughput against cycles per byte at three clock rates.

    T = 8 f / c bits per second. The two line-rate guides show why hardware
    assistance is the difference between filling a 10 Gbps link on one core and
    needing seven of them.
    """
    c = S.SERIES[mode]
    cpb = np.logspace(math.log10(0.3), math.log10(40), 400)

    def thr(f_ghz):
        return 8.0 * f_ghz * 1e9 / cpb / 1e9      # Gbps

    assert abs(8 * 3e9 / 0.65 / 1e9 - 36.923077) < 5e-7
    assert abs(8 * 3e9 / 15.0 / 1e9 - 1.6) < 1e-12
    assert abs(8 * 3e9 / 10e9 - 2.4) < 1e-12       # cycles/byte ceiling for 10 Gbps
    assert math.ceil(10 / 1.6) == 7

    fig, ax = plt.subplots()
    for k, f in enumerate((2.0, 3.0, 4.0)):
        ax.plot(cpb, thr(f), color=c[k], lw=2.2)
        S.label_end(ax, 0.32, 8.0 * f * 1e9 / 0.32 / 1e9, f"{f:g} GHz core",
                    c[k], mode, dx=6, dy=6)
    for y, tag in ((10.0, "10 Gbps"), (1.0, "1 Gbps")):
        ax.axhline(y, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.note(ax, 0.31, y * 1.06, tag, mode)
    for x, y in ((0.65, 36.923077), (15.0, 1.6)):
        ax.plot([x], [y], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 0.33, 0.35, "the two marked points, both on the 3 GHz core:\n"
                           "0.65 cycles/byte gives 36.9 Gbps, and 15 gives\n"
                           "1.6 Gbps, so 7 such cores fill a 10 Gbps link", mode)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("cost of the cipher  (CPU cycles per byte)")
    ax.set_ylabel("encryption throughput  (Gbps)")
    ax.set_title("A tunnel is only as fast as the core that encrypts it")
    ax.set_xlim(0.3, 45)
    ax.set_ylim(0.3, 200)
    S.strip(ax)
    return fig


@figure("net3-keylength-margin")
def _(mode):
    """Symmetric strength against public-key modulus size.

    The general number field sieve costs about
    L = exp(1.923 (ln n)^(1/3) (ln ln n)^(2/3)) operations, which is plotted here
    as log2 L against modulus width, next to the flat symmetric levels it has to
    reach. The curve is why doubling an RSA modulus buys far less than doubling
    a symmetric key.
    """
    c = S.SERIES[mode]

    def nfs_bits(bits):
        ln_n = bits * math.log(2.0)
        return 1.923 * ln_n ** (1 / 3) * math.log(ln_n) ** (2 / 3) / math.log(2.0)

    assert abs(nfs_bits(1024) - 86.766) < 5e-3, nfs_bits(1024)
    assert abs(nfs_bits(2048) - 116.884) < 5e-3, nfs_bits(2048)
    assert abs(nfs_bits(3072) - 138.736) < 5e-3, nfs_bits(3072)
    assert abs(nfs_bits(4096) - 156.497) < 5e-3, nfs_bits(4096)
    assert abs(nfs_bits(6706) - 191.997) < 5e-3, nfs_bits(6706)
    # elliptic-curve strength from Pollard rho: sqrt(pi/4) 2^(m/2)
    assert abs(128 + math.log2(math.sqrt(math.pi / 4)) - 127.8257) < 5e-5

    n = np.linspace(512, 8192, 400)
    y = np.array([nfs_bits(float(b)) for b in n])

    fig, ax = plt.subplots()
    ax.plot(n, y, color=c[0], lw=2.4)
    S.label_end(ax, 7000, nfs_bits(7000), "factoring work,  log2 L(n)", c[0], mode,
                dx=-6, dy=14, ha="right")
    for lvl, tag in ((112, "112-bit"), (128, "128-bit"), (192, "192-bit")):
        ax.axhline(lvl, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.note(ax, 560, lvl + 2.5, tag, mode)
    for b in (1024, 2048, 3072, 6706):
        ax.plot([b], [nfs_bits(b)], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 2150, 60.0, "2048 bits reaches about 117 bits of work;\n"
                           "reaching 192 needs about 6706, a modulus\n"
                           "3.27 times as wide for 75 more bits", mode)
    ax.set_xlabel("public-key modulus width  (bits)")
    ax.set_ylabel("equivalent symmetric strength  (bits)")
    ax.set_title("Why public keys must be so much longer than symmetric ones")
    ax.set_xlim(500, 8300)
    ax.set_ylim(40, 215)
    S.strip(ax)
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
