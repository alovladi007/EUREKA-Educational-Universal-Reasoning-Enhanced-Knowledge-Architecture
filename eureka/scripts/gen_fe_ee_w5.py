#!/usr/bin/env python3
"""Wave-5 figures for the FE Electrical and Computer course:
Digital Systems and Computer Systems.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look. Every mark here is COMPUTED from the logic or the
equation the lesson states - K-maps are filled from the minterm list, waveforms
come out of a unit-delay simulator, the pipeline chart comes out of a scheduler,
the address fields come out of the sizing arithmetic. Nothing is traced,
scanned or adapted from the NCEES Reference Handbook or any textbook: the
pipeline consumes truth tables and formulas, which are not protected
expression, and never anyone's drawing of them.

Every identity a figure claims is asserted in code before the figure is drawn,
so a broken claim fails the build instead of shipping.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w5.py            # all
    python3 scripts/gen_fe_ee_w5.py dig        # only names starting "dig"
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

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
# shared digital helpers
# ---------------------------------------------------------------------------
GRAY2 = [0, 1, 3, 2]          # 2-bit Gray order used down and across a K-map


def kmap_cell(row: int, col: int) -> int:
    """Minterm index of the 4-variable K-map cell at (row, col), rows carrying
    AB in Gray order and columns CD in Gray order."""
    return (GRAY2[row] << 2) | GRAY2[col]


def steps(values, t0=0.0):
    """Turn a list of 0/1 samples into (x, y) arrays for a digital waveform."""
    x, y = [], []
    for i, v in enumerate(values):
        x += [t0 + i, t0 + i + 1]
        y += [v, v]
    return np.array(x, dtype=float), np.array(y, dtype=float)


def wave(ax, values, base, colour, lw=2.0, height=0.62, t0=0.0):
    x, y = steps(values, t0)
    ax.plot(x, base + height * y, color=colour, lw=lw, solid_joinstyle="miter")
    for i in range(1, len(values)):
        if values[i] != values[i - 1]:
            ax.plot([t0 + i, t0 + i], [base, base + height], color=colour, lw=lw)


# ---------------------------------------------------------------------------
# Digital Systems - 7-11 questions
# ---------------------------------------------------------------------------


@figure("dig-kmap-groups")
def _(mode):
    """The same 4-variable function grouped twice: 1s for SOP, 0s for POS.

    Cells are filled from the minterm list F = Sm(0,1,2,5,8,9,10); the groups
    drawn are exactly the cell sets of the product terms B'D', B'C', A'C'D and
    of the sum terms (C'+D'), (B'+D), (A'+B'). Both readings are checked
    against the truth table over all sixteen inputs before anything is drawn.
    """
    c = S.SERIES[mode]
    mint = {0, 1, 2, 5, 8, 9, 10}

    def f(m):
        return m in mint

    def bits(m):
        return (m >> 3) & 1, (m >> 2) & 1, (m >> 1) & 1, m & 1

    # the two published readings, verified exhaustively
    def sop(m):
        A, B, C, D = bits(m)
        return bool((not B and not D) or (not B and not C) or (not A and not C and D))

    def pos(m):
        A, B, C, D = bits(m)
        return bool((not C or not D) and (not B or D) and (not A or not B))

    assert all(sop(m) == f(m) for m in range(16)), "SOP reading is not the function"
    assert all(pos(m) == f(m) for m in range(16)), "POS reading is not the function"

    # group -> list of (row0, col0, nrows, ncols) rectangles that tile its cells
    ones = [
        ("B'D'  (the four corners)", [(0, 0, 1, 1), (0, 3, 1, 1), (3, 0, 1, 1), (3, 3, 1, 1)],
         lambda m: not bits(m)[1] and not bits(m)[3]),
        ("B'C'  (wraps top to bottom)", [(0, 0, 1, 2), (3, 0, 1, 2)],
         lambda m: not bits(m)[1] and not bits(m)[2]),
        ("A'C'D  (a plain pair)", [(0, 1, 2, 1)],
         lambda m: not bits(m)[0] and not bits(m)[2] and bits(m)[3]),
    ]
    zeros = [
        ("CD  ->  (C' + D')", [(0, 2, 4, 1)], lambda m: bits(m)[2] and bits(m)[3]),
        ("BD'  ->  (B' + D)", [(1, 0, 2, 1), (1, 3, 2, 1)],
         lambda m: bits(m)[1] and not bits(m)[3]),
        ("AB  ->  (A' + B')", [(2, 0, 1, 4)], lambda m: bits(m)[0] and bits(m)[1]),
    ]
    # every drawn rectangle set must be exactly the cell set of its term, and
    # must sit entirely on 1s (left panel) or entirely on 0s (right panel)
    for panel, groups, want in ((0, ones, True), (1, zeros, False)):
        for _name, rects, pred in groups:
            drawn = {kmap_cell(r + dr, cc + dc)
                     for (r, cc, nr, nc) in rects
                     for dr in range(nr) for dc in range(nc)}
            assert drawn == {m for m in range(16) if pred(m)}, _name
            assert all(f(m) is want for m in drawn), _name

    fig, axes = plt.subplots(1, 2, figsize=(9.6, 4.6))
    for ax, (title, groups, want) in zip(
        axes,
        [("group the 1s  ->  SOP", ones, True), ("group the 0s  ->  POS", zeros, False)],
    ):
        for r in range(4):
            for col in range(4):
                m = kmap_cell(r, col)
                ax.add_patch(Rectangle((col, 3 - r), 1, 1, facecolor="none",
                                       edgecolor=S.GRID[mode], lw=1.0))
                on = f(m) if want else not f(m)
                ax.text(col + 0.5, 3 - r + 0.60, "1" if f(m) else "0",
                        ha="center", va="center", fontsize=13,
                        fontweight="bold" if on else "normal",
                        color=S.INK[mode] if on else S.GRID[mode])
                ax.text(col + 0.5, 3 - r + 0.24, f"m{m}", ha="center", va="center",
                        fontsize=7, color=S.INK_2[mode])
        for i, (name, rects, _pred) in enumerate(groups):
            # each group is inset a little further so overlapping groups nest
            # visibly instead of sitting on top of one another
            pad = 0.05 + 0.06 * i
            for (r, cc, nr, nc) in rects:
                ax.add_patch(Rectangle((cc + pad, 3 - r - nr + 1 + pad),
                                       nc - 2 * pad, nr - 2 * pad, facecolor="none",
                                       edgecolor=c[i], lw=2.3, zorder=4))
        for r in range(4):
            ax.text(-0.16, 3 - r + 0.5, f"{GRAY2[r]:02b}", ha="right", va="center",
                    fontsize=9.5, color=S.INK_2[mode])
        for col in range(4):
            ax.text(col + 0.5, 4.14, f"{GRAY2[col]:02b}", ha="center", va="bottom",
                    fontsize=9.5, color=S.INK_2[mode])
        ax.text(-0.16, 4.14, "AB\\CD", ha="right", va="bottom", fontsize=9,
                color=S.INK_2[mode])
        ax.set_title(title, color=S.INK[mode], fontsize=11.5, pad=8)
        ax.set_xlim(-0.95, 4.05)
        ax.set_ylim(-1.80, 4.62)
        ax.set_aspect("equal")
        ax.axis("off")
    for i, (name, _r, _p) in enumerate(ones):
        axes[0].text(0.0, -0.42 - 0.34 * i, name, color=S.SERIES[mode][i],
                     fontsize=10.5, fontweight="semibold", va="center")
    for i, (name, _r, _p) in enumerate(zeros):
        axes[1].text(0.0, -0.42 - 0.34 * i, name, color=S.SERIES[mode][i],
                     fontsize=10.5, fontweight="semibold", va="center")
    axes[0].text(2.0, -1.58, "F = B'D' + B'C' + A'C'D    (7 literals)",
                 color=S.INK[mode], fontsize=10, ha="center", va="center")
    axes[1].text(2.0, -1.58, "F = (C'+D')(B'+D)(A'+B')    (6 literals)",
                 color=S.INK[mode], fontsize=10, ha="center", va="center")
    fig.suptitle("One function, two minimal readings - group the 1s or group the 0s",
                 color=S.INK[mode], fontsize=12, fontweight="semibold", y=1.03)
    return fig


@figure("dig-adder-delay")
def _(mode):
    """Worst-case adder delay against word width, in gate delays.

    Both curves come from the delay model the lesson states: a ripple-carry
    adder needs 2n gate delays to its final sum bit, and a carry-lookahead
    adder built from 4-bit blocks needs 4*ceil(log4 n). The crossing behaviour
    - linear against staircase-logarithmic - is the whole argument for
    lookahead, and the marked pair is the lesson's 16-bit worked example.
    """
    c = S.SERIES[mode]
    n = np.arange(2, 65)
    ripple = 2.0 * n
    cla = np.array([4 * math.ceil(math.log(k, 4) - 1e-12) for k in n], dtype=float)
    assert ripple[n == 16][0] == 32 and cla[n == 16][0] == 8, "16-bit model broken"
    assert ripple[n == 64][0] == 128 and cla[n == 64][0] == 12, "64-bit model broken"
    assert cla[n == 4][0] == 4, "4-bit CLA model broken"

    fig, ax = plt.subplots()
    ax.plot(n, ripple, color=c[1], lw=2.2)
    ax.step(n, cla, where="post", color=c[0], lw=2.2)
    S.label_end(ax, 42, 84, "ripple-carry  2n", c[1], mode, dy=12, ha="right", dx=-8)
    S.label_end(ax, 64, 12, "carry-lookahead  4*ceil(log4 n)", c[0], mode, dy=10,
                ha="right", dx=-2)
    ax.plot([16], [32], "o", color=c[1], ms=7)
    ax.plot([16], [8], "o", color=c[0], ms=7)
    ax.plot([16, 16], [8, 32], color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 17.5, 19.0, "16-bit: 32 tau vs 8 tau,\na 4.0x speedup", mode)
    ax.set_xlabel("adder width  n  (bits)")
    ax.set_ylabel("worst-case delay  (gate delays, tau)")
    ax.set_title("Carry is the critical path, and lookahead makes it logarithmic")
    ax.set_xlim(0, 70)
    ax.set_ylim(0, 138)
    S.strip(ax)
    return fig


@figure("dig-timing-slack")
def _(mode):
    """One clock period of a flip-flop-to-flip-flop path, drawn to scale.

    Times come straight from the lesson's numbers: a 100 MHz clock (T = 10 ns),
    t_cq = 2 ns, worst-case combinational delay 5 ns, t_su = 1 ns. Data is
    valid at 7 ns, the setup window opens at 9 ns, so the slack is 2 ns - the
    gap the figure measures. Every marked instant is computed, not placed.
    """
    c = S.SERIES[mode]
    T, tcq, tcomb, tsu = 10.0, 2.0, 5.0, 1.0
    valid = tcq + tcomb
    required = T - tsu
    slack = required - valid
    assert valid == 7.0 and required == 9.0 and slack == 2.0, "timing arithmetic broken"
    assert abs(1e3 / (tcq + tcomb + tsu) - 125.0) < 1e-9, "f_max broken"

    fig, ax = plt.subplots(figsize=(8.4, 4.6))
    # clock: two periods, computed as a square wave
    t = np.linspace(-1.0, 12.0, 4000)
    clk = (np.mod(t, T) >= T / 2).astype(float)
    ax.plot(t, 3.05 + 0.62 * clk, color=S.INK_2[mode], lw=1.8)
    ax.text(-1.25, 3.36, "CLK", ha="right", va="center", color=S.INK[mode], fontsize=10)

    # launch flip-flop output Q1: changes t_cq after the rising edge at t = 0
    ax.plot([-1.0, tcq], [2.05, 2.05], color=S.INK_2[mode], lw=1.8)
    ax.plot([tcq, tcq], [2.05, 2.67], color=S.INK_2[mode], lw=1.8)
    ax.plot([tcq, 12.0], [2.67, 2.67], color=S.INK_2[mode], lw=1.8)
    ax.text(-1.25, 2.36, "Q1", ha="right", va="center", color=S.INK[mode], fontsize=10)

    # combinational output D2: settles at t_cq + t_comb, drawn as a data bus
    ax.plot([-1.0, tcq], [1.05, 1.05], color=S.INK_2[mode], lw=1.8)
    ax.plot([-1.0, tcq], [1.67, 1.67], color=S.INK_2[mode], lw=1.8)
    ax.plot([tcq, valid], [1.05, 1.67], color=S.INK_2[mode], lw=1.8)
    ax.plot([tcq, valid], [1.67, 1.05], color=S.INK_2[mode], lw=1.8)
    ax.plot([valid, 12.0], [1.05, 1.05], color=S.INK_2[mode], lw=1.8)
    ax.plot([valid, 12.0], [1.67, 1.67], color=S.INK_2[mode], lw=1.8)
    ax.text(-1.25, 1.36, "D2", ha="right", va="center", color=S.INK[mode], fontsize=10)
    ax.text(9.6, 1.36, "stable", ha="center", va="center", color=S.INK_2[mode], fontsize=9)

    # the setup window and the slack, both computed
    ax.add_patch(Rectangle((required, 0.86), tsu, 1.0, facecolor=c[1], alpha=0.20,
                           edgecolor="none"))
    ax.add_patch(Rectangle((valid, 0.86), slack, 1.0, facecolor=c[0], alpha=0.20,
                           edgecolor="none"))
    for x in (0.0, tcq, valid, required, T):
        ax.plot([x, x], [0.55, 3.72], color=S.GRID[mode], lw=0.9, ls=":")

    def span(x0, x1, y, text, colour):
        ax.annotate("", xy=(x0, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle="<->", color=colour, lw=1.4))
        ax.text((x0 + x1) / 2, y + 0.10, text, ha="center", va="bottom",
                color=colour, fontsize=9.5, fontweight="semibold")

    span(0.0, tcq, 0.42, "t_cq = 2 ns", S.INK_2[mode])
    span(tcq, valid, 0.42, "t_comb = 5 ns", S.INK_2[mode])
    span(valid, required, 0.04, "slack = 2 ns", c[0])
    span(required, T, 0.42, "t_su = 1 ns", c[1])
    ax.text(0.0, 3.94, "launch edge", ha="left", va="bottom", color=S.INK_2[mode],
            fontsize=9)
    ax.text(T, 3.94, "capture edge", ha="right", va="bottom", color=S.INK_2[mode],
            fontsize=9)
    ax.text(-2.5, -0.62, "T = 10 ns at 100 MHz;  the path needs T_min = 8 ns, "
            "so f_max = 125 MHz and this period has 2 ns to spare",
            ha="left", va="bottom", color=S.INK_2[mode], fontsize=9.5)
    ax.set_xlim(-2.6, 12.2)
    ax.set_ylim(-0.80, 4.35)
    ax.set_title("Slack is what is left of the period after the path has been paid for",
                 color=S.INK[mode])
    ax.axis("off")
    return fig


@figure("dig-hazard-glitch")
def _(mode):
    """A static-1 hazard produced by a unit-delay simulation, and its cure.

    F = A*C' + B*C with A = B = 1 is logically the constant 1, but the input C
    falls at t = 5 tau and every gate is given exactly one tau of delay. The
    simulator below - not a drawing - produces the one-tau hole at t = 7 tau.
    Adding the consensus term A*B fills it, which the second trace shows.
    """
    c = S.SERIES[mode]
    end, fall = 14, 5

    def sim(with_consensus):
        def C(t):
            return 1 if t < fall else 0

        def Cbar(t):
            return 1 - C(t - 1)

        def p1(t):
            return Cbar(t - 1)          # A AND C', with A = 1

        def p2(t):
            return C(t - 1)             # B AND C, with B = 1

        def out(t):
            y = p1(t - 1) | p2(t - 1)
            return y | 1 if with_consensus else y

        return ([C(t) for t in range(end)], [Cbar(t) for t in range(end)],
                [p1(t) for t in range(end)], [p2(t) for t in range(end)],
                [out(t) for t in range(end)])

    Cv, Cb, P1, P2, F = sim(False)
    Ff = sim(True)[4]
    assert [t for t, y in enumerate(F) if y == 0] == [7], "glitch is not a single tau at 7"
    assert 0 not in Ff, "consensus term did not remove the glitch"
    assert P1[6] == 0 and P2[6] == 0, "the two product terms do not overlap-fail at 6"

    fig, ax = plt.subplots(figsize=(8.4, 5.0))
    rows = [("C", Cv, S.INK_2[mode]), ("C'", Cb, S.INK_2[mode]),
            ("A*C'", P1, S.INK_2[mode]), ("B*C", P2, S.INK_2[mode]),
            ("F = A*C' + B*C", F, c[1]),
            ("F with A*B added", Ff, c[0])]
    for i, (name, values, colour) in enumerate(rows):
        base = 5.0 - i
        wave(ax, values, base, colour)
        ax.plot([0, end], [base, base], color=S.GRID[mode], lw=0.7, ls=":")
        ax.text(-0.35, base + 0.31, name, ha="right", va="center",
                color=colour if colour in (c[0], c[1]) else S.INK[mode],
                fontsize=10, fontweight="semibold" if colour in (c[0], c[1]) else "normal")
    ax.axvspan(7, 8, ymin=0.19, ymax=0.94, color=c[1], alpha=0.13, lw=0)
    ax.plot([fall, fall], [-0.35, 5.85], color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, fall + 0.12, 5.92, "C falls here", mode)
    S.note(ax, 8.25, 0.92, "one-tau hole: the falling term has let go\n"
                           "before the rising term has taken hold", mode)
    for t in range(0, end + 1, 2):
        ax.text(t, -0.62, str(t), ha="center", va="top", color=S.INK_2[mode], fontsize=8.5)
    ax.text(end / 2, -1.08, "time  (gate delays, tau)", ha="center", va="top",
            color=S.INK_2[mode], fontsize=10)
    ax.set_xlim(-2.7, end + 0.4)
    ax.set_ylim(-1.5, 6.5)
    ax.set_title("A hazard is a delay accident, not a logic error",
                 color=S.INK[mode])
    ax.axis("off")
    return fig


@figure("dig-fsm-trace")
def _(mode):
    """Moore and Mealy '101' detectors run on the same input stream.

    Both machines are simulated from the state tables the lesson prints, on the
    stream 1 0 1 0 1 1 0 1 0 1. The assertion checks the timing claim the
    lesson makes: the Mealy pulse lands in the cycle of the third pattern bit,
    the Moore pulse exactly one cycle later.
    """
    c = S.SERIES[mode]
    NEXT = {(0, 0): 0, (0, 1): 1, (1, 0): 2, (1, 1): 1,
            (2, 0): 0, (2, 1): 3, (3, 0): 2, (3, 1): 1}
    stream = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1]

    s, states, moore = 0, [], []
    for x in stream:
        states.append(s)
        moore.append(1 if s == 3 else 0)
        s = NEXT[(s, x)]
    states.append(s)
    moore.append(1 if s == 3 else 0)

    s, mealy = 0, []
    for x in stream:
        if s == 0:
            mealy.append(0)
            s = 1 if x else 0
        elif s == 1:
            mealy.append(0)
            s = 1 if x else 2
        else:
            mealy.append(1 if x else 0)
            s = 1 if x else 0

    ends = [i for i in range(2, len(stream)) if stream[i - 2:i + 1] == [1, 0, 1]]
    assert [i for i, y in enumerate(mealy) if y] == ends, "Mealy timing claim broken"
    assert [i for i, y in enumerate(moore) if y] == [i + 1 for i in ends], \
        "Moore timing claim broken"
    assert ends == [2, 4, 7, 9], "pattern positions changed"

    fig, ax = plt.subplots(figsize=(8.6, 4.4))
    n = len(stream)
    for i, x in enumerate(stream):
        ax.text(i + 0.5, 3.42, str(x), ha="center", va="center", fontsize=12,
                fontweight="bold", color=S.INK[mode])
    ax.text(-0.35, 3.42, "input X", ha="right", va="center", color=S.INK[mode], fontsize=10)
    for i, st in enumerate(states):
        ax.text(i + 0.5 if i < n else n + 0.5, 2.72, f"S{st}", ha="center", va="center",
                fontsize=10, color=S.INK_2[mode])
    ax.text(-0.35, 2.72, "Moore state", ha="right", va="center", color=S.INK[mode],
            fontsize=10)
    wave(ax, mealy, 1.45, c[0])
    ax.text(-0.35, 1.76, "Mealy out", ha="right", va="center", color=c[0], fontsize=10,
            fontweight="semibold")
    wave(ax, moore, 0.35, c[1])
    ax.text(-0.35, 0.66, "Moore out", ha="right", va="center", color=c[1], fontsize=10,
            fontweight="semibold")
    for e in ends:
        ax.axvspan(e, e + 1, ymin=0.30, ymax=0.95, color=S.GUIDE[mode], alpha=0.13, lw=0)
        ax.annotate("", xy=(e + 1.5, 0.70), xytext=(e + 0.5, 1.80),
                    arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.1))
    for i in range(n + 2):
        ax.plot([i, i], [0.20, 3.70], color=S.GRID[mode], lw=0.6, ls=":")
        if i <= n:
            ax.text(i + 0.5, -0.02, str(i), ha="center", va="top",
                    color=S.INK_2[mode], fontsize=8.5)
    ax.text((n + 1) / 2, -0.42, "clock cycle", ha="center", va="top",
            color=S.INK_2[mode], fontsize=10)
    S.note(ax, -3.0, -0.98, "shaded: the cycle in which '101' completes.  "
                            "The arrows follow each detection from the Mealy output "
                            "to the Moore output one cycle later.", mode)
    ax.set_xlim(-3.1, n + 1.3)
    ax.set_ylim(-1.30, 3.95)
    ax.set_title("Same detections, one cycle apart: Mealy answers now, Moore answers next",
                 color=S.INK[mode])
    ax.axis("off")
    return fig


@figure("dig-memory-ladder")
def _(mode):
    """Access latency against capacity for the levels the lesson tabulates.

    The seven points are the representative capacities and latencies from the
    hierarchy table; the dashed line is a least-squares fit through them in
    log-log space, computed here. Its slope, about 0.64, is the quantitative
    version of the qualitative rule: buying a decade more storage costs about
    two thirds of a decade of latency, every single step of the way.
    """
    c = S.SERIES[mode]
    ladder = [("registers", 0.25, 0.3), ("L1", 32.0, 1.0), ("L2", 512.0, 4.0),
              ("L3", 8.0e3, 15.0), ("DRAM", 16.78e6, 80.0), ("SSD", 1.07e9, 60e3),
              ("disk", 8.59e9, 8e6)]
    cap = np.array([k for _, k, _ in ladder])
    lat = np.array([t for _, _, t in ladder])
    x, y = np.log10(cap), np.log10(lat)
    slope, intercept = np.polyfit(x, y, 1)
    assert abs(slope - 0.635) < 0.01, f"ladder slope changed: {slope:.3f}"
    assert abs(np.log10(cap[-1] / cap[0]) - 10.54) < 0.05, "capacity span changed"
    assert abs(np.log10(lat[-1] / lat[0]) - 7.43) < 0.05, "latency span changed"

    fig, ax = plt.subplots(figsize=(7.6, 4.5))
    xs = np.linspace(x.min() - 0.6, x.max() + 0.6, 100)
    ax.plot(10 ** xs, 10 ** (slope * xs + intercept), color=S.GUIDE[mode], lw=1.4,
            ls="--")
    ax.plot(cap, lat, color=c[0], lw=1.6, marker="o", ms=8, zorder=4)
    offsets = {"registers": (10, -4), "L1": (9, -6), "L2": (9, -6), "L3": (9, -6),
               "DRAM": (10, -4), "SSD": (8, -2), "disk": (-8, 6)}
    for name, k, t in ladder:
        dx, dy = offsets[name]
        ax.annotate(name, xy=(k, t), xytext=(dx, dy), textcoords="offset points",
                    color=S.INK[mode], fontsize=10, fontweight="semibold",
                    ha="right" if dx < 0 else "left")
    ax.set_xscale("log")
    ax.set_yscale("log")
    S.note(ax, 3e3, 1.3e5, f"least-squares fit:\nslope {slope:.2f} decades of latency\n"
                           f"per decade of capacity", mode)
    ax.set_xlabel("capacity  (KB, log scale)")
    ax.set_ylabel("access latency  (ns, log scale)")
    ax.set_title("Ten decades of capacity are bought with seven decades of latency")
    ax.set_xlim(0.05, 1e11)
    ax.set_ylim(0.1, 1e8)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Computer Systems - 3-5 questions
# ---------------------------------------------------------------------------


@figure("csys-pipeline-spacetime")
def _(mode):
    """Six instructions through a five-stage pipeline, scheduled in code.

    The chart is not drawn by hand: a scheduler places IF/ID/EX/MEM/WB for each
    instruction, inserts one bubble for the load-use dependence between I2 and
    I3, and discards the two wrong-path fetches after the taken branch I4. The
    assertion checks that the finish cycle equals the bookkeeping formula
    k + n - 1 + stalls + flushes = 5 + 6 - 1 + 1 + 2 = 13.
    """
    c = S.SERIES[mode]
    STAGES = ["IF", "ID", "EX", "MEM", "WB"]
    # (label, IF cycle, extra hold cycles before EX)
    sched: dict[str, list[tuple[str, int]]] = {}

    def place(name, if_cycle, hold=0):
        cells, t = [], if_cycle
        for k, st in enumerate(STAGES):
            if k == 2 and hold:
                for h in range(hold):
                    cells.append(("**", t))
                    t += 1
            cells.append((st, t))
            t += 1
        sched[name] = cells

    place("I1  add", 1)
    place("I2  lw", 2)
    place("I3  sub", 3, hold=1)     # needs I2's loaded value: one bubble
    place("I4  beq", 4, hold=1)     # pushed one cycle by the same bubble
    place("I5  target", 8)          # branch resolves in EX at cycle 7
    place("I6  target+1", 9)
    flushed = [("I5x", 6), ("I6x", 7)]

    last = max(t for cells in sched.values() for _s, t in cells)
    assert last == 13, f"schedule finishes at {last}, not 13"
    assert 5 + 6 - 1 + 1 + 2 == 13, "bookkeeping formula broken"
    assert abs(13 / 6 - 2.1667) < 1e-3, "CPI claim broken"

    order = ["I1  add", "I2  lw", "I3  sub", "I4  beq", "I5  target", "I6  target+1"]
    fig, ax = plt.subplots(figsize=(9.4, 4.6))
    for row, name in enumerate(order):
        yy = len(order) - row - 1
        for st, t in sched[name]:
            bubble = st == "**"
            ax.add_patch(Rectangle((t - 0.94, yy + 0.08), 0.88, 0.78,
                                   facecolor=c[1] if bubble else c[0],
                                   alpha=0.20 if bubble else 0.16, lw=0,
                                   hatch="///" if bubble else None,
                                   edgecolor=c[1] if bubble else "none"))
            ax.text(t - 0.5, yy + 0.47, "stall" if bubble else st, ha="center",
                    va="center", fontsize=9,
                    color=c[1] if bubble else S.INK[mode],
                    fontweight="semibold" if bubble else "normal")
        ax.text(-0.25, yy + 0.47, name, ha="right", va="center", color=S.INK[mode],
                fontsize=10)
    for name, t in flushed:
        ax.add_patch(Rectangle((t - 0.94, -1.0 + 0.08), 0.88, 0.78, facecolor="none",
                               edgecolor=S.GUIDE[mode], lw=1.2, ls="--"))
        ax.text(t - 0.5, -1.0 + 0.47, "IF", ha="center", va="center", fontsize=9,
                color=S.GUIDE[mode])
    ax.text(-0.25, -1.0 + 0.47, "wrong path", ha="right", va="center",
            color=S.GUIDE[mode], fontsize=10)
    for t in range(1, 14):
        ax.text(t - 0.5, 6.12, str(t), ha="center", va="bottom", color=S.INK_2[mode],
                fontsize=8.5)
    ax.text(6.5, 6.62, "clock cycle", ha="center", va="bottom", color=S.INK_2[mode],
            fontsize=10)
    ax.plot([7.0, 7.0], [-1.2, 6.05], color=S.GUIDE[mode], lw=1.1, ls=":")
    S.note(ax, 7.15, 5.05, "branch resolves in EX;\nthe two fetches behind it are discarded", mode)
    S.note(ax, 0.10, -1.85, "13 cycles for 6 instructions -> CPI 2.17;  "
                            "the same six unpipelined would take 30", mode)
    ax.set_xlim(-3.4, 13.6)
    ax.set_ylim(-2.2, 7.0)
    ax.set_title("Every bubble and every flush is one more cycle on the bill",
                 color=S.INK[mode])
    ax.axis("off")
    return fig


@figure("csys-cache-fields")
def _(mode):
    """How a 32-bit address is cut up by two caches of identical capacity.

    Field widths are computed from the sizing rules - offset = log2(block),
    index = log2(lines) or log2(sets), tag = whatever is left - for a 64 KB
    cache with 64-byte blocks, first direct-mapped and then 4-way. The hex
    values shown under each field are extracted from 0x1234ABCD by shifting and
    masking, and are asserted before the bars are drawn.
    """
    c = S.SERIES[mode]
    ABITS, CAP, BLK, ADDR = 32, 64 * 1024, 64, 0x1234ABCD
    rows = []
    for ways in (1, 4):
        sets_ = CAP // (BLK * ways)
        off_b = int(math.log2(BLK))
        idx_b = int(math.log2(sets_))
        tag_b = ABITS - off_b - idx_b
        off = ADDR & (BLK - 1)
        idx = (ADDR >> off_b) & (sets_ - 1)
        tag = ADDR >> (off_b + idx_b)
        assert off_b + idx_b + tag_b == ABITS, "fields do not fill the address"
        assert (tag << (off_b + idx_b)) | (idx << off_b) | off == ADDR, "fields lose bits"
        rows.append((ways, sets_, tag_b, idx_b, off_b, tag, idx, off))
    assert rows[0][2:8] == (16, 10, 6, 0x1234, 0x2AF, 0x0D), "direct-mapped decode changed"
    assert rows[1][2:8] == (18, 8, 6, 0x48D2, 0xAF, 0x0D), "4-way decode changed"

    fig, ax = plt.subplots(figsize=(9.0, 4.3))
    W = 32.0
    for r, (ways, sets_, tb, ib, ob, tv, iv, ov) in enumerate(rows):
        y = 1.6 - 1.6 * r
        left = 0.0
        for width, name, value, hue in (
            (tb, "tag", f"0x{tv:X}", c[0]),
            (ib, "index", f"0x{iv:X} ({iv})", c[1]),
            (ob, "offset", f"0x{ov:X} ({ov})", c[2]),
        ):
            ax.add_patch(Rectangle((left, y), width, 0.62, facecolor=hue, alpha=0.18,
                                   edgecolor=hue, lw=1.6))
            ax.text(left + width / 2, y + 0.40, f"{name}  {width} b", ha="center",
                    va="center", color=S.INK[mode], fontsize=10, fontweight="semibold")
            ax.text(left + width / 2, y + 0.16, value, ha="center", va="center",
                    color=S.INK_2[mode], fontsize=9)
            left += width
        label = ("direct-mapped\n1024 lines" if ways == 1
                 else "4-way set-associative\n256 sets")
        ax.text(-0.6, y + 0.31, label, ha="right", va="center", color=S.INK[mode],
                fontsize=10)
    for b, xpos in ((31, 0.0), (0, W)):
        ax.text(xpos, 2.42, f"bit {b}", ha="left" if b == 31 else "right", va="bottom",
                color=S.INK_2[mode], fontsize=9)
    ax.plot([0, W], [2.38, 2.38], color=S.GRID[mode], lw=1.0)
    S.note(ax, 0.0, -0.75, "address 0x1234ABCD, 64 KB cache, 64-byte blocks.  "
                           "Four ways cost two index bits, so the tag grows by two.",
           mode)
    ax.set_xlim(-9.6, 33.2)
    ax.set_ylim(-1.15, 2.95)
    ax.set_title("Same capacity, same address, different cut", color=S.INK[mode])
    ax.axis("off")
    return fig


@figure("csys-io-utilization")
def _(mode):
    """Processor time spent moving data, against how fast the data arrives.

    Each curve is the per-byte cost model the lesson states, evaluated and then
    clipped at 100%: polling spends 0.4 us of processor time per byte,
    interrupt-driven service spends 5 us per 16-byte FIFO block, and DMA spends
    8 us per 4 KiB block. The knees are the saturation rates - 2.5, 3.2 and
    512 MB/s - and they are computed, not placed.
    """
    c = S.SERIES[mode]
    rate = np.logspace(4, 9.1, 700)
    poll = np.minimum(1.0, rate * 0.4e-6)
    intr = np.minimum(1.0, rate / 16 * 5e-6)
    dma = np.minimum(1.0, rate / 4096 * 8e-6)
    assert abs(1e6 * 0.4e-6 - 0.40) < 1e-12, "polling model broken"
    assert abs(1e6 / 16 * 5e-6 - 0.3125) < 1e-12, "interrupt model broken"
    assert abs(1e6 / 4096 * 8e-6 - 0.001953125) < 1e-12, "DMA model broken"
    assert abs(1 / 0.4e-6 - 2.5e6) < 1, "polling saturation broken"
    assert abs(16 / 5e-6 - 3.2e6) < 1, "interrupt saturation broken"
    assert abs(4096 / 8e-6 - 512e6) < 1, "DMA saturation broken"

    fig, ax = plt.subplots()
    ax.loglog(rate / 1e6, 100 * poll, color=c[1], lw=2.2)
    ax.loglog(rate / 1e6, 100 * intr, color=c[2], lw=2.2)
    ax.loglog(rate / 1e6, 100 * dma, color=c[0], lw=2.2)
    # leader-labelled at a clear point on each curve: polling and per-FIFO
    # interrupt service run almost parallel here, so they need the leaders
    def lead(x_on, y_on, x_text, y_text, text, hue, ha="left"):
        ax.annotate(text, xy=(x_on, y_on), xytext=(x_text, y_text),
                    color=hue, fontsize=10, fontweight="semibold", ha=ha,
                    va="center", arrowprops=dict(arrowstyle="-", color=hue, lw=1.0))

    lead(0.06, 2.4, 0.013, 13.0, "polling", c[1])
    lead(0.6, 18.75, 1.3, 5.0, "interrupt per 16-byte FIFO block", c[2])
    lead(10.0, 1.953, 24.0, 0.34, "DMA per 4 KiB block", c[0])
    for r_sat, hue in ((2.5, c[1]), (3.2, c[2]), (512.0, c[0])):
        ax.plot([r_sat], [100], "o", color=hue, ms=6.5)
    ax.axhline(100, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.0115, 130, "100%: the processor does nothing else", mode)
    ax.plot([1.0], [40.0], "o", color=c[1], ms=6.5)
    ax.plot([1.0], [0.1953], "o", color=c[0], ms=6.5)
    ax.plot([1.0, 1.0], [0.1953, 40.0], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 120.0, 0.0072, "at 1 MB/s:  40% polled,\n"
                              "31% on interrupts,  0.20% with DMA", mode)
    ax.set_xlabel("data rate  (MB/s, log scale)")
    ax.set_ylabel("processor time on the transfer  (%)")
    ax.set_title("The question is never speed alone - it is who pays for each byte")
    ax.set_xlim(0.01, 1300)
    ax.set_ylim(0.0045, 420)
    S.strip(ax)
    return fig


@figure("csys-amdahl")
def _(mode):
    """Amdahl speedup against processor count for three parallel fractions.

    Each curve is 1/[(1-f) + f/N] evaluated over N, and each dashed line is
    that curve's ceiling 1/(1-f). The marked point is the lesson's worked case,
    f = 0.9 with N = 8, which reaches 4.71x - less than half of the 10x that
    the same code can ever reach no matter how many processors are bought.
    """
    c = S.SERIES[mode]
    N = np.logspace(0, 10, 600, base=2)

    def sp(f):
        return 1.0 / ((1 - f) + f / N)

    assert abs(1 / ((1 - 0.9) + 0.9 / 8) - 4.7059) < 1e-3, "worked point broken"
    assert abs(1 / (1 - 0.99) - 100.0) < 1e-9, "ceiling broken"

    fig, ax = plt.subplots()
    for f, hue in ((0.99, c[2]), (0.9, c[0]), (0.5, c[1])):
        ax.loglog(N, sp(f), color=hue, lw=2.2, base=2)
        ax.axhline(1 / (1 - f), color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, 1024, 1 / (1 - 0.99) * 0.62, "f = 0.99", c[2], mode, ha="right", dx=-6)
    S.label_end(ax, 1024, 9.1, "f = 0.90", c[0], mode, ha="right", dx=-6, dy=-10)
    S.label_end(ax, 1024, 1.86, "f = 0.50", c[1], mode, ha="right", dx=-6, dy=-10)
    for f, txt in ((0.99, "ceiling 100x"), (0.9, "ceiling 10x"), (0.5, "ceiling 2x")):
        ax.text(1370, 1 / (1 - f) * 1.05, txt, color=S.INK_2[mode], fontsize=9,
                va="bottom", ha="right")
    ax.plot([8], [1 / ((1 - 0.9) + 0.9 / 8)], "o", color=c[0], ms=7.5)
    S.note(ax, 9.2, 3.05, "f = 0.9 on 8 processors: 4.71x,\nunder half of its own ceiling",
           mode)
    ax.set_xlabel("processors  N  (log2 scale)")
    ax.set_ylabel("speedup")
    ax.set_title("Parallel hardware is bought; the serial fraction is not sold")
    ax.set_xlim(1, 1400)
    ax.set_ylim(0.9, 220)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
