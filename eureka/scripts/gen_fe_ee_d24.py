#!/usr/bin/env python3
"""Depth-wave-24 figures for the FE Electrical and Computer course:
the two Software Development chapters on object-oriented programming
(fee_oop) and on the software development lifecycle (fee_sdlc).

Same contract as gen_fe_ee_d20.py, and it imports the SAME style module rather
than growing a second look. Every curve here is COMPUTED, in this file, from a
model the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from a handbook, a textbook or a vendor's slide.

Software-engineering figures carry a particular hazard: the field is full of
numbers that circulate as folklore. The rule applied here is that a plotted
quantity is either (a) derived from a stated model whose parameters are named
in the lesson, or (b) MEASURED by running something in this file - a padding
simulator, a graph closure, an enumeration of paths, a greedy set cover. Where
a published industry constant is used (Boehm's COCOMO coefficients, the
Lientz-Swanson maintenance split, the 100x field-defect multiplier) it enters
as a labelled model parameter, never as a measured fact.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it. Where a quantity
has an independent route - a closed form against an enumeration, a formula
against a ledger - both are computed and cross-checked before anything is
drawn.

Usage:
    python3 scripts/gen_fe_ee_d24.py             # all
    python3 scripts/gen_fe_ee_d24.py sw3-lsp     # only names with that prefix
"""
from __future__ import annotations

import itertools
import math
import pathlib
import sys

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
    if not name.startswith("sw3-"):
        raise ValueError(f"this generator owns only the sw3- prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# --------------------------------------------------------------- primitives
def layout(fields, header=8, cap=8):
    """Place fields under natural alignment; return offsets, size, padding.

    fields = [(name, size_bytes, alignment)]. `header` is the object header -
    on a 64-bit target with single inheritance that is one vtable pointer.
    """
    off, placed = header, []
    for name, size, al in fields:
        al = min(al, cap)
        off = -(-off // al) * al
        placed.append((name, off, size))
        off += size
    big = max(min(al, cap) for _, _, al in fields)
    total = -(-off // big) * big
    payload = sum(s for _, s, _ in fields)
    return placed, total, total - header - payload, payload


def bytemap(fields, header=8, cap=8):
    """Independent route to the same two numbers: mark every byte used."""
    used, cur = set(range(header)), header
    for _, size, al in fields:
        al = min(al, cap)
        while cur % al:
            cur += 1
        used |= set(range(cur, cur + size))
        cur += size
    big = max(min(al, cap) for _, _, al in fields)
    while cur % big:
        cur += 1
    return cur, cur - len(used)


def closure_cells(dep):
    """Ordered pairs (a, b) with a depending on b directly or indirectly,
    obtained by walking the graph from every node - not by a formula."""
    cells = 0
    for m in dep:
        seen, stack = set(), [m]
        while stack:
            for nxt in dep[stack.pop()]:
                if nxt not in seen:
                    seen.add(nxt)
                    stack.append(nxt)
        cells += len(seen)
    return cells


def chain(n):
    return {i: ([i + 1] if i + 1 < n else []) for i in range(n)}


def tangle(n):
    return {i: [j for j in range(n) if j != i] for i in range(n)}


def greedy_pairwise(k, v):
    """Build a pairwise-covering test set by deterministic greedy set cover.

    Every candidate row is scored by how many still-uncovered value pairs it
    supplies; ties break on lexicographic order, so the result is reproducible.
    A redundancy sweep then drops any row whose pairs are all supplied by the
    others. The SIZE of the returned set is a MEASURED quantity - what this
    procedure achieved - and not a bound: greedy set cover is a heuristic, and
    at k = 3 it returns ten rows where nine are achievable.
    """
    def pairs_of(row):
        return {(i, j, row[i], row[j])
                for i, j in itertools.combinations(range(k), 2)}

    need = {(i, j, a, b)
            for i, j in itertools.combinations(range(k), 2)
            for a in range(v) for b in range(v)}
    rows = []
    cands = list(itertools.product(range(v), repeat=k))
    while need:
        best, best_gain = None, -1
        for row in cands:
            gain = len(pairs_of(row) & need)
            if gain > best_gain:
                best, best_gain = row, gain
        rows.append(best)
        need -= pairs_of(best)
    changed = True
    while changed:
        changed = False
        for idx in range(len(rows)):
            others = set()
            for jdx, other in enumerate(rows):
                if jdx != idx:
                    others |= pairs_of(other)
            if pairs_of(rows[idx]) <= others:
                del rows[idx]
                changed = True
                break
    return rows


def phi(z):
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


# ---------------------------------------------------------------------------
# fee_oop
# ---------------------------------------------------------------------------
SENSOR = [("id", 8, 8), ("active", 1, 1), ("reading", 8, 8),
          ("scale", 1, 1), ("count", 4, 4)]


@figure("sw3-object-layout")
def _(mode):
    """Where the bytes of one instance actually go, in two field orders.

    Declared order leaves 10 bytes of padding and a 40-byte object; sorting
    the fields widest-first leaves 2 bytes and a 32-byte object. Both numbers
    are produced twice: by the placement walk and by a byte map.
    """
    c = S.SERIES[mode]
    order_a = SENSOR
    order_b = sorted(SENSOR, key=lambda f: -f[1])
    pa, sa, pada, payload = layout(order_a)
    pb, sb, padb, _ = layout(order_b)
    assert bytemap(order_a) == (sa, pada) == (40, 10)
    assert bytemap(order_b) == (sb, padb) == (32, 2)
    assert payload == 22
    assert 64 // sa == 1 and 64 // sb == 2
    assert -(-1_000_000 * sa // 64) == 625_000
    assert -(-1_000_000 * sb // 64) == 500_000

    fig, ax = plt.subplots(figsize=(7.2, 3.2))
    for row, (placed, size) in enumerate(((pb, sb), (pa, sa))):
        y = row
        ax.barh(y, 8, left=0, height=0.52, color=c[2], edgecolor="none")
        ax.text(4, y, "hdr", ha="center", va="center", fontsize=8,
                color=S.INK[mode])
        cover = [False] * size
        for b in range(8):
            cover[b] = True
        for name, off, sz in placed:
            ax.barh(y, sz, left=off, height=0.52, color=c[0], edgecolor="none")
            # a hairline at every field boundary, so adjacent fields with no
            # padding between them are still visibly two fields
            ax.plot([off, off], [y - 0.26, y + 0.26], color="#ffffff", lw=1.2,
                    zorder=4)
            if sz >= 4:
                ax.text(off + sz / 2, y, name, ha="center", va="center",
                        fontsize=8, color="#ffffff", zorder=5)
            for b in range(off, off + sz):
                cover[b] = True
        run = None
        for b in range(size + 1):
            filled = cover[b] if b < size else True
            if not filled and run is None:
                run = b
            if filled and run is not None:
                ax.barh(y, b - run, left=run, height=0.52, color=c[1],
                        edgecolor="none")
                run = None
        ax.plot([size, size], [y - 0.36, y + 0.36], color=S.INK[mode], lw=1.4)

    S.label_end(ax, sb, 0, f"  {sb} B", c[0], mode, dx=8, size=10)
    S.label_end(ax, sa, 1, f"  {sa} B", c[0], mode, dx=8, size=10)
    S.note(ax, 0, 1.42, "declared order: id, active, reading, scale, count "
                        "- 10 bytes of padding", mode)
    S.note(ax, 0, 0.42, "widest first: id, reading, count, active, scale "
                        "- 2 bytes of padding", mode)
    S.note(ax, 0, -0.85, "22 bytes of payload either way; the orange runs are "
                         "alignment padding the compiler\ncannot remove, and "
                         "the 8-byte saving is 8 MB across a million instances",
           mode)
    ax.set_yticks([0, 1])
    ax.set_yticklabels(["sorted", "declared"])
    ax.set_xlabel("byte offset within the instance")
    ax.set_title("One object, two field orders")
    ax.set_xlim(0, 46)
    ax.set_ylim(-1.15, 1.85)
    ax.grid(axis="y", visible=False)
    S.strip(ax)
    return fig


@figure("sw3-dispatch-overhead")
def _(mode):
    """Virtual-call overhead as a share of the call, against body length.

    Model parameters, in cycles: call 1, cached load 4 (two of them - the
    vtable pointer, then the slot), indirect jump 2, mispredicted indirect
    15. The overhead is a constant 10 cycles; only its SHARE moves.
    """
    c = S.SERIES[mode]
    t_call, t_load, t_ind, c_miss = 1.0, 4.0, 2.0, 15.0
    b = np.arange(1, 301, dtype=float)
    static = t_call + b
    mono = t_call + 2 * t_load + t_ind + b
    mega = mono + 0.75 * c_miss
    ov_mono = 100 * (mono - static) / static
    ov_mega = 100 * (mega - static) / static

    assert abs((mono - static)[0] - 10.0) < 1e-12
    for want, at in ((200.0, 4), (76.923077, 12), (24.390244, 40), (9.90099, 100)):
        assert abs(ov_mono[at - 1] - want) < 1e-5, (at, ov_mono[at - 1])
    first10 = int(b[np.argmax(ov_mono < 10.0)])
    assert first10 == 100, first10
    assert abs(ov_mega[11] - 163.461538) < 1e-5, ov_mega[11]

    fig, ax = plt.subplots()
    ax.loglog(b, ov_mega, color=c[1], lw=2.1)
    ax.loglog(b, ov_mono, color=c[0], lw=2.1)
    ax.axhline(10, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot([100], [ov_mono[99]], "o", color=S.INK[mode], ms=7, zorder=5)
    S.label_end(ax, 300, ov_mega[-1], "megamorphic\n(3 in 4 mispredicted)",
                c[1], mode, dx=6, va="center")
    S.label_end(ax, 300, ov_mono[-1], "monomorphic\nvirtual call", c[0], mode,
                dx=6, va="center")
    S.note(ax, 8, 12, "10 % of the direct call", mode)
    S.note(ax, 30, 3.4, "10 % is reached at a 100-cycle body", mode)
    S.note(ax, 1.15, 700, "the overhead is a fixed 10 cycles;\n"
                          "what changes is what it is 10 cycles OF", mode)
    ax.set_xlabel("cycles executed inside the method body")
    ax.set_ylabel("dispatch overhead  (% of the direct call)")
    ax.set_title("What a virtual call costs, as a share of the work it starts")
    ax.set_xlim(1, 300)
    ax.set_ylim(2, 2500)
    ax.set_xticks([1, 3, 10, 30, 100, 300])
    ax.set_xticklabels(["1", "3", "10", "30", "100", "300"])
    ax.set_yticks([3, 10, 30, 100, 300, 1000])
    ax.set_yticklabels(["3", "10", "30", "100", "300", "1000"])
    S.strip(ax)
    return fig


@figure("sw3-class-explosion")
def _(mode):
    """Subclasses under inheritance (a product) against parts under
    composition (a sum), as independent axes of variation are added.

    Both counts are enumerated, not assumed: the product is the length of the
    Cartesian product and the sum is the length of the concatenated axes.
    """
    c = S.SERIES[mode]
    ks = np.arange(1, 8)
    v = 3
    sub = np.array([len(list(itertools.product(*[range(v)] * int(k)))) for k in ks],
                   dtype=float)
    parts = np.array([v * int(k) for k in ks], dtype=float)
    assert list(sub[:6]) == [3.0, 9.0, 27.0, 81.0, 243.0, 729.0]
    assert list(parts[:6]) == [3.0, 6.0, 9.0, 12.0, 15.0, 18.0]
    # the worked case in the lesson: 4 x 3 x 5
    axes = (4, 3, 5)
    assert len(list(itertools.product(*[range(a) for a in axes]))) == 60
    assert sum(axes) == 12

    fig, ax = plt.subplots()
    ax.semilogy(ks, sub, color=c[0], lw=2.2, marker="o")
    ax.semilogy(ks, parts, color=c[2], lw=2.2, marker="o")
    ax.plot([3], [60], "o", color=S.INK[mode], ms=9, zorder=5,
            markerfacecolor="none", markeredgewidth=1.8)
    ax.plot([3], [12], "o", color=S.INK[mode], ms=9, zorder=5,
            markerfacecolor="none", markeredgewidth=1.8)
    S.label_end(ax, 7, sub[-1], "subclasses\n(a product)", c[0], mode, dx=6,
                va="center")
    S.label_end(ax, 7, parts[-1], "components\n(a sum)", c[2], mode, dx=6,
                va="center")
    S.note(ax, 1.05, 900, "the worked vehicle case: 4 x 3 x 5 = 60 subclasses,\n"
                          "or 4 + 3 + 5 = 12 components", mode)
    ax.set_xlabel("independent axes of variation (three options on each)")
    ax.set_ylabel("classes or components to write")
    ax.set_title("Why a hierarchy explodes and a composition does not")
    ax.set_xlim(0.8, 7.6)
    ax.set_ylim(2, 6000)
    S.strip(ax)
    return fig


@figure("sw3-propagation-cost")
def _(mode):
    """Propagation cost - the share of ordered module pairs joined by a
    dependency path - for a layered chain and for a fully tangled system.

    Every point is a graph closure walked in this file. The two measured
    designs from the lesson are marked on top of the envelopes they sit in.
    """
    c = S.SERIES[mode]
    ns = np.arange(2, 25)
    pc_chain = np.array([closure_cells(chain(int(n))) / n ** 2 for n in ns])
    pc_tang = np.array([closure_cells(tangle(int(n))) / n ** 2 for n in ns])
    # closed forms, checked against the walks. A strict chain of n modules
    # reaches n(n-1)/2 of the n^2 ordered pairs; a complete tangle reaches
    # every pair INCLUDING each module through itself, because every module
    # sits on a cycle - which is exactly why nothing in it can be changed
    # in isolation.
    assert np.allclose(pc_chain, (ns - 1) / (2.0 * ns))
    assert np.allclose(pc_tang, 1.0)

    design_t = {"ui": ["order", "price", "tax", "store", "report"],
                "order": ["price", "tax", "store", "report"],
                "price": ["tax", "store"], "tax": ["store"],
                "store": ["report"],
                "report": ["order", "price", "tax", "store"]}
    design_l = {"ui": ["order"], "order": ["price", "store"],
                "price": ["tax"], "tax": [], "store": [], "report": ["store"]}
    pt = closure_cells(design_t) / 36.0
    pl = closure_cells(design_l) / 36.0
    assert closure_cells(design_t) == 30 and closure_cells(design_l) == 9
    assert abs(pt - 0.833333) < 1e-6 and abs(pl - 0.25) < 1e-9
    assert abs(pt / pl - 10.0 / 3.0) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(ns, 100 * pc_tang, color=c[1], lw=2.1)
    ax.plot(ns, 100 * pc_chain, color=c[0], lw=2.1)
    ax.plot([6], [100 * pt], "o", color=S.INK[mode], ms=8, zorder=5)
    ax.plot([6], [100 * pl], "o", color=S.INK[mode], ms=8, zorder=5)
    S.label_end(ax, 24, 100 * pc_tang[-1], "everything depends\non everything",
                c[1], mode, dx=6, va="center")
    S.label_end(ax, 24, 100 * pc_chain[-1], "a strict layer chain", c[0], mode,
                dx=6, va="center")
    S.note(ax, 6.6, 80, "the measured tangled design, 83.3 %", mode)
    S.note(ax, 6.6, 22, "the same system re-layered, 25.0 %", mode)
    S.note(ax, 2.2, 4, "a change in the tangled design can reach 5 of the 6 modules;\n"
                       "in the layered one it reaches 1.5. The re-layered point sits\n"
                       "BELOW the chain because two of its modules depend on nothing.",
           mode)
    ax.set_xlabel("modules in the system")
    ax.set_ylabel("propagation cost  (% of ordered module pairs)")
    ax.set_title("How far a change can travel")
    ax.set_xlim(2, 24)
    ax.set_ylim(0, 105)
    S.strip(ax)
    return fig


@figure("sw3-lsp-square")
def _(mode):
    """The base class promises area = w' x h after setWidth(w'). A Square
    subtype cannot keep that promise, and the gap is quadratic.

    Both curves are produced by CALLING the two classes, not by plotting the
    algebra: the probe sets the width and reads the area back.
    """
    c = S.SERIES[mode]

    class Rect:
        def __init__(self, w, h):
            self.w, self.h = w, h

        def set_width(self, w):
            self.w = w

        def area(self):
            return self.w * self.h

    class Square(Rect):
        def set_width(self, w):
            self.w = self.h = w

    def probe(obj, wnew):
        h0 = obj.h
        obj.set_width(wnew)
        return h0 * wnew, obj.area()

    ws = np.arange(1, 21)
    promised = np.array([probe(Rect(5, 4), int(w))[0] for w in ws], dtype=float)
    rect_got = np.array([probe(Rect(5, 4), int(w))[1] for w in ws], dtype=float)
    sq_got = np.array([probe(Square(5, 4), int(w))[1] for w in ws], dtype=float)
    assert np.allclose(promised, rect_got)
    assert np.allclose(promised, 4.0 * ws)
    assert np.allclose(sq_got, ws.astype(float) ** 2)
    assert (promised[9], sq_got[9]) == (40.0, 100.0)
    assert (promised[19], sq_got[19]) == (80.0, 400.0)

    fig, ax = plt.subplots()
    ax.plot(ws, sq_got, color=c[1], lw=2.2)
    ax.plot(ws, promised, color=c[0], lw=2.2)
    ax.plot([10, 10], [40, 100], color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot([10], [40], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([10], [100], "o", color=S.INK[mode], ms=7, zorder=5)
    S.label_end(ax, 20, sq_got[-1], "what a Square\nactually does", c[1], mode,
                dx=6, va="center")
    S.label_end(ax, 20, promised[-1], "what Rectangle\npromises", c[0], mode,
                dx=6, va="center")
    S.note(ax, 10.4, 62, "setWidth(10) on a 5 x 4:\npromised 40, delivered 100", mode)
    S.note(ax, 1.2, 355, "the two agree only where w' equals the original height,\n"
                         "so a test that happens to use a square passes", mode)
    ax.set_xlabel("width requested,  w'")
    ax.set_ylabel("area afterwards")
    ax.set_title("A subtype that cannot keep its base class's promise")
    ax.set_xlim(1, 20)
    ax.set_ylim(0, 420)
    S.strip(ax)
    return fig


@figure("sw3-flyweight-memory")
def _(mode):
    """Memory against instance count, storing every glyph whole against
    sharing 96 intrinsic glyph objects and keeping 8 bytes per position.
    """
    c = S.SERIES[mode]
    glyphs, s_int, s_ext = 96, 40, 8
    n = np.linspace(0, 2_000_000, 401)
    naive = n * s_int
    fly = n * s_ext + glyphs * s_int
    assert abs(naive[-1] - 80_000_000) < 1e-6
    assert abs(fly[-1] - 16_003_840) < 1e-6
    assert abs(100 * (1 - fly[-1] / naive[-1]) - 79.99520) < 1e-4
    # break-even: below it the shared table is the more expensive choice
    ne = glyphs * s_int / (s_int - s_ext)
    assert abs(ne - 120.0) < 1e-9
    assert abs((ne * s_ext + glyphs * s_int) - ne * s_int) < 1e-6

    fig, ax = plt.subplots()
    ax.plot(n / 1e6, naive / 1e6, color=c[1], lw=2.2)
    ax.plot(n / 1e6, fly / 1e6, color=c[0], lw=2.2)
    S.label_end(ax, 2.0, naive[-1] / 1e6, "one object\nper character", c[1],
                mode, dx=6, va="center")
    S.label_end(ax, 2.0, fly[-1] / 1e6, "96 shared glyphs +\n8 bytes per position",
                c[0], mode, dx=6, va="center")
    S.note(ax, 0.05, 62, "at two million characters: 80.0 MB against 16.0 MB,\n"
                         "a saving of 80.0 %", mode)
    S.note(ax, 0.72, 6, "break-even is 120 characters - below that the shared\n"
                        "table costs more than it saves", mode)
    ax.set_xlabel("characters in the document  (millions)")
    ax.set_ylabel("memory  (MB)")
    ax.set_title("Sharing the part that does not vary")
    ax.set_xlim(0, 2.0)
    ax.set_ylim(0, 88)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# fee_sdlc
# ---------------------------------------------------------------------------
@figure("sw3-cost-of-change")
def _(mode):
    """Total cost of absorbing 30 changes against iteration length, split
    into per-iteration overhead and change cost.

    Model: a change costs k(d) = 100^(d/20) where d is the months between the
    decision that fixed it and the test that caught it, calibrated so that a
    change surviving a whole 20-month project costs the quoted 100x. An
    iteration of length L caps that delay at L - 1 months and costs a fixed
    6 units to run.
    """
    c = S.SERIES[mode]
    m_end, t_proj, nch, over = 100.0, 20.0, 30, 6.0
    k = lambda d: m_end ** (d / t_proj)
    L = np.arange(1, 21, dtype=float)
    ovh = (t_proj / L) * over
    chg = nch * k(L - 1)
    tot = ovh + chg

    assert abs(k(0) - 1.0) < 1e-12
    assert abs(k(t_proj) - 100.0) < 1e-9
    assert abs(k(16.5) - 44.668359) < 1e-6
    assert abs(k(3.0) - 1.995262) < 1e-6
    assert abs(k(16.5) / k(3.0) - 22.387211) < 1e-5
    best = int(L[np.argmin(tot)])
    assert best == 3, best
    assert abs(tot[2] - 87.546796) < 1e-5, tot[2]
    assert abs(tot[19] - 2388.984704) < 1e-5, tot[19]
    assert abs(tot[19] / tot[2] - 27.288088) < 1e-5

    fig, ax = plt.subplots()
    ax.semilogy(L, chg, color=c[1], lw=2.1, marker="o", ms=4)
    ax.semilogy(L, ovh, color=c[2], lw=2.1, marker="o", ms=4)
    ax.semilogy(L, tot, color=c[0], lw=2.4, marker="o", ms=4)
    ax.plot([3], [tot[2]], "o", color=S.INK[mode], ms=10, zorder=5,
            markerfacecolor="none", markeredgewidth=1.8)
    S.label_end(ax, 20, chg[-1], "cost of change", c[1], mode, dx=6)
    S.label_end(ax, 20, ovh[-1], "iteration overhead", c[2], mode, dx=6)
    S.label_end(ax, 1, tot[0], "total", c[0], mode, dx=-8, ha="right")
    S.note(ax, 3.4, 150, "cheapest at three months:\n87.5 units", mode)
    S.note(ax, 1.05, 620, "a single 20-month pass costs 2,389 units -\n"
                          "27.3 times the optimum, almost all of it rework", mode)
    ax.set_xlabel("iteration length  (months)")
    ax.set_ylabel("cost over the project  (units of one early fix)")
    ax.set_title("The cost-of-change curve, computed rather than asserted")
    ax.set_xlim(0.6, 20)
    ax.set_ylim(4, 4000)
    ax.set_xticks([1, 3, 5, 8, 10, 15, 20])
    ax.set_xticklabels(["1", "3", "5", "8", "10", "15", "20"])
    S.strip(ax)
    return fig


@figure("sw3-cocomo-effort")
def _(mode):
    """Basic COCOMO effort against programme size for the three modes.

    Coefficients are Boehm's published basic-COCOMO parameters, entering as
    named model parameters. What the figure shows is the SHAPE the exponent
    gives: every mode bends upward on log-log paper because b exceeds one.
    """
    c = S.SERIES[mode]
    modes = {"organic": (2.4, 1.05), "semi-detached": (3.0, 1.12),
             "embedded": (3.6, 1.20)}
    kl = np.logspace(math.log10(2), math.log10(400), 300)
    curves = {n: a * kl ** b for n, (a, b) in modes.items()}

    a, b = modes["semi-detached"]
    assert abs(a * 42.0 ** b - 197.315163) < 1e-5, a * 42.0 ** b
    assert abs(2.4 * 42.0 ** 1.05 - 121.513071) < 1e-5
    assert abs(3.6 * 42.0 ** 1.20 - 319.302008) < 1e-5
    assert abs(2.5 * (a * 42.0 ** b) ** 0.35 - 15.894474) < 1e-5
    assert abs((a * 84.0 ** b) / (a * 42.0 ** b) - 2 ** b) < 1e-12
    assert abs(2 ** b - 2.173470) < 1e-6

    fig, ax = plt.subplots()
    for slot, name in enumerate(("organic", "semi-detached", "embedded")):
        col = c[(0, 2, 1)[slot]]
        ax.loglog(kl, curves[name], color=col, lw=2.1)
        S.label_end(ax, 400, curves[name][-1], name, col, mode, dx=6)
    ax.plot([42], [a * 42.0 ** b], "o", color=S.INK[mode], ms=8, zorder=5)
    S.note(ax, 12, 12, "the worked case: 42 KLOC semi-detached,\n197.3 person-months",
           mode)
    S.note(ax, 2.2, 1400, "doubling the code multiplies semi-detached effort by\n"
                          "2^1.12 = 2.173, not by 2 - the exponent IS the message",
           mode)
    ax.set_xlabel("delivered source instructions  (KLOC)")
    ax.set_ylabel("effort  (person-months)")
    ax.set_title("Basic COCOMO: effort grows faster than size")
    ax.set_xlim(2, 400)
    ax.set_ylim(4, 5000)
    S.strip(ax)
    return fig


@figure("sw3-pairwise-cover")
def _(mode):
    """Full factorial against a MEASURED pairwise-covering set.

    The pairwise counts are not a published bound: a greedy set cover is run
    in this file for each parameter count and the size of the set it returns
    is plotted. The curve is therefore an achieved number, and the logarithmic
    growth is something the reader can reproduce.
    """
    c = S.SERIES[mode]
    v = 3
    ks = list(range(2, 9))
    greedy = [len(greedy_pairwise(k, v)) for k in ks]
    full = [v ** k for k in ks]
    assert full[:4] == [9, 27, 81, 243]
    # the textbook L9 orthogonal array covers all pairs of four 3-level
    # parameters in 9 runs; the greedy cover must not beat that lower bound
    l9 = [(0, 0, 0, 0), (0, 1, 1, 1), (0, 2, 2, 2),
          (1, 0, 1, 2), (1, 1, 2, 0), (1, 2, 0, 1),
          (2, 0, 2, 1), (2, 1, 0, 2), (2, 2, 1, 0)]
    need = {(i, j, a, b) for i, j in itertools.combinations(range(4), 2)
            for a in range(v) for b in range(v)}
    have = {(i, j, r[i], r[j]) for r in l9
            for i, j in itertools.combinations(range(4), 2)}
    assert have == need and len(need) == 54
    # 9 is a hard lower bound for any k >= 2 at three levels: the two first
    # parameters alone contribute nine pairs and one row supplies one of them.
    assert min(greedy) >= 9, greedy
    assert greedy == [9, 10, 9, 14, 15, 15, 15], greedy

    fig, ax = plt.subplots()
    ax.semilogy(ks, full, color=c[1], lw=2.2, marker="o")
    ax.semilogy(ks, greedy, color=c[0], lw=2.2, marker="o")
    ax.plot([4], [9], "o", color=S.INK[mode], ms=9, zorder=5,
            markerfacecolor="none", markeredgewidth=1.8)
    S.label_end(ax, 8, full[-1], "every combination", c[1], mode, dx=6)
    S.label_end(ax, 8, greedy[-1], "every PAIR of values", c[0], mode, dx=6)
    S.note(ax, 3.85, 4.6, "four parameters: 81 runs against 9", mode)
    S.note(ax, 2.1, 2400, "the lower curve is measured, not bounded - a greedy set\n"
                          "cover runs for each point and its size is plotted. At\n"
                          "three parameters it returns 10 where 9 is achievable,\n"
                          "which is what a heuristic looks like when it is honest.",
           mode)
    ax.set_xlabel("parameters, each with three legal values")
    ax.set_ylabel("test cases required")
    ax.set_title("Testing every pair instead of every combination")
    ax.set_xlim(2, 8)
    ax.set_ylim(3, 12000)
    S.strip(ax)
    return fig


@figure("sw3-defect-cascade")
def _(mode):
    """Defects still in the product after each removal stage, at the measured
    review efficiency and at half of it.

    The stage efficiencies are recovered from the counts the chapter already
    publishes (110, 50, 24, 10 removed from 200), so the base curve reproduces
    that table exactly and the comparison is like for like.
    """
    c = S.SERIES[mode]
    d0 = 250.0 * 0.80
    counts = [d0 * s for s in (0.55, 0.25, 0.12, 0.05)]
    eff, rem = [], d0
    for g in counts:
        eff.append(g / rem)
        rem -= g
    assert abs(rem - 6.0) < 1e-9
    assert abs(eff[0] - 0.55) < 1e-12 and abs(eff[1] - 5.0 / 9.0) < 1e-12
    assert abs(eff[2] - 0.60) < 1e-12 and abs(eff[3] - 0.625) < 1e-12

    def walk(es):
        out, r = [d0], d0
        for e in es:
            r -= r * e
            out.append(r)
        return out

    base = walk(eff)
    half = walk([eff[0] / 2] + eff[1:])
    assert abs(base[-1] - 6.0) < 1e-9
    assert abs(half[-1] - 9.666667) < 1e-6
    assert abs(half[-1] / base[-1] - 29.0 / 18.0) < 1e-9
    assert abs(half[-1] / base[-1] - 1.611111) < 1e-6
    km = [1.0, 5.0, 10.0, 20.0]
    cost_b = sum((base[i] - base[i + 1]) * km[i] for i in range(4)) + base[-1] * 100
    cost_h = sum((half[i] - half[i + 1]) * km[i] for i in range(4)) + half[-1] * 100
    assert abs(cost_b - 1400.0) < 1e-9, cost_b
    assert abs(cost_h - 2133.333333) < 1e-5, cost_h
    assert abs(cost_h / cost_b - 1.523810) < 1e-6

    stages = np.arange(5)
    fig, ax = plt.subplots()
    ax.step(stages, half, where="post", color=c[1], lw=2.2)
    ax.step(stages, base, where="post", color=c[0], lw=2.2)
    ax.plot(stages, half, "o", color=c[1], ms=6)
    ax.plot(stages, base, "o", color=c[0], ms=6)
    S.label_end(ax, 4, half[-1], f"  {half[-1]:.1f} escape", c[1], mode, dx=6,
                dy=9)
    S.label_end(ax, 4, base[-1], f"  {base[-1]:.1f} escape", c[0], mode, dx=6,
                dy=-9)
    S.note(ax, 1.15, 168, "halving the review's efficiency multiplies escapes by\n"
                          "1.61 and total defect cost by 1.52 - it does not\n"
                          "double either", mode)
    ax.set_xticks(stages)
    ax.set_xticklabels(["written", "reviewed", "unit\ntested", "integration\ntested",
                        "system\ntested"])
    ax.set_ylabel("defects still in the product")
    ax.set_title("Where 200 defects go")
    ax.set_xlim(-0.1, 4.35)
    ax.set_ylim(0, 215)
    S.strip(ax)
    return fig


@figure("sw3-reliability-growth")
def _(mode):
    """Musa's basic execution-time model: failure intensity against test
    hours, with cumulative failures on the same x-axis in a second panel.

    Parameters: initial intensity 12 failures per CPU-hour, 180 inherent
    failures. Both are named model parameters, and the point of the figure is
    the constant hours-per-decade the model implies.
    """
    c = S.SERIES[mode]
    lam0, nu0 = 12.0, 180.0
    tau = np.linspace(0, 110, 800)
    lam = lam0 * np.exp(-lam0 * tau / nu0)
    mu = nu0 * (1 - np.exp(-lam0 * tau / nu0))

    def hours(target):
        return (nu0 / lam0) * math.log(lam0 / target)

    for target, want in ((0.5, 47.670807), (0.05, 82.209584)):
        h = hours(target)
        assert abs(h - want) < 1e-5, (target, h)
        assert abs(lam0 * math.exp(-lam0 * h / nu0) - target) < 1e-12
        assert abs(nu0 * (1 - math.exp(-lam0 * h / nu0))
                   - nu0 * (1 - target / lam0)) < 1e-9
    decade = (nu0 / lam0) * math.log(10.0)
    assert abs(decade - 34.538776) < 1e-5
    assert abs(hours(0.05) - hours(0.5) - decade) < 1e-9
    assert abs(nu0 * (1 - 0.5 / lam0) - 172.5) < 1e-9
    assert abs(nu0 * (1 - 0.05 / lam0) - 179.25) < 1e-9

    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.2), sharex=True,
                                  gridspec_kw={"height_ratios": [1.25, 1]})
    ax.semilogy(tau, lam, color=c[0], lw=2.2)
    for target in (0.5, 0.05):
        h = hours(target)
        ax.plot([h, h], [1e-2, target], color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.plot([h], [target], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 110, lam[-1], "failure intensity", c[0], mode, dx=6)
    S.note(ax, 49, 0.9, "0.5/h at 47.7 h", mode)
    S.note(ax, 84, 0.09, "0.05/h at 82.2 h", mode)
    S.note(ax, 3, 0.02, "each decade of intensity costs the same 34.5 test-hours",
           mode)
    ax.set_ylabel("failures per CPU-hour")
    ax.set_title("Reliability growth is exponential in test time, so gains are logarithmic")
    ax.set_ylim(1e-2, 30)
    S.strip(ax)

    ax2.plot(tau, mu, color=c[2], lw=2.2)
    ax2.axhline(nu0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax2, 110, mu[-1], "failures found", c[2], mode, dx=6)
    S.note(ax2, 42, 120, "the 180-failure ceiling the model assumes", mode)
    ax2.set_xlabel("cumulative test execution time  (CPU-hours)")
    ax2.set_ylabel("cumulative failures")
    ax2.set_xlim(0, 110)
    ax2.set_ylim(0, 200)
    S.strip(ax2)
    fig.subplots_adjust(hspace=0.14)
    return fig


@figure("sw3-schedule-risk")
def _(mode):
    """Probability of finishing by a given week, from the PERT estimates.

    Task estimates are the lesson's; the expected duration and variance are
    summed here, and the curve is the normal approximation the method licenses
    once enough independent tasks are in the chain.
    """
    c = S.SERIES[mode]
    tasks = [("specify", 3, 5, 13), ("design", 4, 6, 14), ("build", 10, 16, 34),
             ("integrate", 4, 7, 16), ("certify", 5, 9, 19)]
    te = sum((a + 4 * m + b) / 6 for _, a, m, b in tasks)
    var = sum(((b - a) / 6) ** 2 for _, a, m, b in tasks)
    sd = math.sqrt(var)
    assert abs(te - 49.0) < 1e-12, te
    assert abs(var - 31.0) < 1e-12, var
    assert abs(sd - 5.567764) < 1e-6

    t = np.linspace(34, 66, 500)
    p = np.array([phi((x - te) / sd) for x in t])
    assert abs(phi((49 - te) / sd) - 0.5) < 1e-12
    assert abs(phi((55 - te) / sd) - 0.859401) < 1e-6
    assert abs(phi((52 - te) / sd) - 0.704993) < 1e-6
    d90 = te + 1.2815515655446004 * sd
    assert abs(d90 - 56.135377) < 1e-5
    ev = phi((55 - te) / sd) * 200000 - (1 - phi((55 - te) / sd)) * 300000
    assert abs(ev - 129700.4751) < 1e-3, ev

    fig, ax = plt.subplots()
    ax.plot(t, 100 * p, color=c[0], lw=2.3)
    for x, lbl in ((49.0, "49 wk: 50 %"), (55.0, "55 wk: 85.9 %"),
                   (d90, "56.1 wk: 90 %")):
        ax.plot([x, x], [0, 100 * phi((x - te) / sd)], color=S.GUIDE[mode],
                lw=1.0, ls="--")
        ax.plot([x], [100 * phi((x - te) / sd)], "o", color=S.INK[mode], ms=6,
                zorder=5)
    S.label_end(ax, 66, 100 * p[-1], "P(finish by)", c[0], mode, dx=6)
    S.note(ax, 34.4, 74, "expected duration 49.0 weeks,\nstandard deviation 5.57;\n"
                         "promising the expected date\nis promising a coin flip",
           mode)
    S.note(ax, 49.3, 20, "49 wk\n50 %", mode)
    S.note(ax, 56.4, 40, "56.1 wk\n90 %", mode)
    ax.set_xlabel("date promised  (weeks from start)")
    ax.set_ylabel("probability of finishing by then  (%)")
    ax.set_title("What a schedule commitment actually promises")
    ax.set_xlim(34, 66)
    ax.set_ylim(0, 104)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "sw3-"
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith("sw3-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
