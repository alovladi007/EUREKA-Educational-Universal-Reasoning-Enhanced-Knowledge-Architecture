#!/usr/bin/env python3
"""Depth-wave figures for the FE Electrical and Computer course: the two
Digital Systems chapters on sequential logic and finite state machines.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every waveform, curve and state graph here is
COMPUTED in this file from the specification the lesson that references it
writes out: latch settling comes from iterating the gate loop, flip-flop traces
come from the characteristic equations, counter timing comes from a per-stage
event simulation, and every state graph is drawn from the same transition
dictionary the lesson tabulates. Nothing is traced, scanned, redrawn or adapted
from the NCEES Reference Handbook or any textbook.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the last quoted
digit or tighter. Boolean claims are asserted by exhaustive enumeration over
every state and input, never by re-reading the algebra that produced them.

Usage:
    python3 scripts/gen_fe_ee_d15.py             # all
    python3 scripts/gen_fe_ee_d15.py dig3-latch  # only names with that prefix
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
from matplotlib.patches import Circle, FancyArrowPatch, Rectangle  # noqa: E402

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
# shared drawing helpers
# ---------------------------------------------------------------------------
def digital(ax, edges, y0, height, colour, lw=2.1, tmax=None):
    """Draw a two-level waveform from a list of (time, level) change points."""
    ts = [e[0] for e in edges]
    vs = [e[1] for e in edges]
    if tmax is not None:
        ts = ts + [tmax]
        vs = vs + [vs[-1]]
    ax.step(ts, y0 + np.array(vs, dtype=float) * height, where="post",
            color=colour, lw=lw, solid_joinstyle="miter", clip_on=False)


def rowlabel(ax, x, y, text, mode, size=10):
    ax.annotate(text, xy=(x, y), color=S.INK[mode], fontsize=size,
                ha="right", va="center", fontweight="semibold", clip_on=False)


def clean(ax):
    """A diagram, not a plot: no grid, no spines, no ticks."""
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    ax.set_xticks([])
    ax.set_yticks([])


def node(ax, xy, label, mode, r=0.30, colour=None, lw=1.6, sub=None, fs=11):
    c = colour if colour else S.INK_2[mode]
    ax.add_patch(Circle(xy, r, fill=False, ec=c, lw=lw, zorder=3))
    ax.annotate(label, xy=xy, color=S.INK[mode], fontsize=fs, ha="center",
                va="center" if sub is None else "bottom", fontweight="semibold",
                zorder=4)
    if sub is not None:
        ax.annotate(sub, xy=(xy[0], xy[1] - 0.02), color=S.INK_2[mode], fontsize=8.5,
                    ha="center", va="top", zorder=4)


def _rim(p, q, r):
    """Point on the circle of radius r round p, aimed at q."""
    dx, dy = q[0] - p[0], q[1] - p[1]
    d = math.hypot(dx, dy) or 1.0
    return (p[0] + r * dx / d, p[1] + r * dy / d)


def edge(ax, p, q, label, mode, r=0.30, rad=0.22, colour=None, fs=9.0,
         loff=(0.0, 0.0)):
    c = colour if colour else S.INK_2[mode]
    a = _rim(p, q, r)
    b = _rim(q, p, r)
    ax.add_patch(FancyArrowPatch(a, b, connectionstyle=f"arc3,rad={rad}",
                                 arrowstyle="-|>", mutation_scale=11,
                                 color=c, lw=1.3, zorder=2))
    if not label:
        return
    # matplotlib's arc3 places its control point at rad*(dy, -dx) from the
    # midpoint, so the curve bulges along the RIGHT normal and its own midpoint
    # sits half that far out. Put the label just beyond that, on the same side.
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    dx, dy = b[0] - a[0], b[1] - a[1]
    d = math.hypot(dx, dy) or 1.0
    nx, ny = dy / d, -dx / d
    off = (rad * d / 2 + 0.15 * math.copysign(1, rad)) if rad else -0.24
    ax.annotate(label, xy=(mx + off * nx + loff[0], my + off * ny + loff[1]),
                color=S.INK[mode], fontsize=fs, ha="center", va="center", zorder=5)


def selfloop(ax, p, label, mode, r=0.30, ang=90.0, colour=None, fs=9.0, size=0.30):
    """A loop tangent to the node, with the label pushed clear of the arc."""
    c = colour if colour else S.INK_2[mode]
    th = math.radians(ang)
    cx = p[0] + (r + size * 0.62) * math.cos(th)
    cy = p[1] + (r + size * 0.62) * math.sin(th)
    t = np.linspace(th + 2.55, th - 2.55 + 2 * math.pi, 80)
    xs, ys = cx + size * np.cos(t), cy + size * np.sin(t)
    ax.plot(xs, ys, color=c, lw=1.3, zorder=2)
    ax.add_patch(FancyArrowPatch((xs[-3], ys[-3]), (xs[-1], ys[-1]),
                                 arrowstyle="-|>", mutation_scale=11,
                                 color=c, lw=1.3, zorder=2))
    ax.annotate(label, xy=(cx + size * 1.45 * math.cos(th),
                           cy + size * 1.45 * math.sin(th)),
                color=S.INK[mode], fontsize=fs, ha="center", va="center", zorder=5)


# ===========================================================================
# fee_seq_logic
# ===========================================================================


@figure("dig3-latch-bistable")
def _(mode):
    """Why a cross-coupled pair stores a bit: three loop fixed points.

    Each inverter is modelled by v_out = (VDD/2)(1 - tanh(a(v_in - VDD/2))) with
    VDD = 1.8 V and a = 3.0, so the midpoint gain is -a VDD/2 = -2.7 and the
    loop gain is 7.29. Plotting one inverter's characteristic together with the
    other's, reflected about the 45-degree line, puts the loop's fixed points at
    the crossings. The outer two are stable; the middle one at VDD/2 has loop
    gain above unity and is the metastable point.
    """
    c = S.SERIES[mode]
    VDD, A = 1.8, 3.0
    inv = lambda v: 0.5 * VDD * (1.0 - np.tanh(A * (v - 0.5 * VDD)))
    dinv = lambda v: -0.5 * VDD * A / np.cosh(A * (v - 0.5 * VDD)) ** 2
    assert abs(dinv(0.9) + 2.7) < 1e-12, dinv(0.9)
    assert abs(dinv(0.9) ** 2 - 7.29) < 1e-12

    # fixed points of the loop, found by bisection on inv(inv(v)) - v
    g = lambda v: float(inv(inv(v))) - v
    grid = np.linspace(0, VDD, 4001)
    fps = []
    for a0, b0 in zip(grid[:-1], grid[1:]):
        if g(a0) == 0.0:
            fps.append(a0)
        elif g(a0) * g(b0) < 0:
            lo, hi, flo = a0, b0, g(a0)
            for _ in range(200):
                mid = 0.5 * (lo + hi)
                if (g(mid) > 0) == (flo > 0):
                    lo, flo = mid, g(mid)
                else:
                    hi = mid
            fps.append(0.5 * (lo + hi))
    fps = sorted(set(round(v, 9) for v in fps))
    assert len(fps) == 3, fps
    assert abs(fps[0] - 0.00852) < 5e-5, fps[0]
    assert abs(fps[1] - 0.9) < 1e-6, fps[1]
    assert abs(fps[2] - 1.79148) < 5e-5, fps[2]
    assert abs(dinv(fps[0]) * dinv(inv(fps[0]))) < 1.0
    assert abs(dinv(fps[1]) * dinv(inv(fps[1]))) > 1.0

    # Plot the LOOP function, v -> inv(inv(v)). Its crossings with the identity
    # line are the loop's fixed points, and its slope there decides which of
    # them a real circuit can sit on.
    loop = lambda x: inv(inv(x))
    dloop = lambda x: dinv(inv(x)) * dinv(x)
    assert abs(dloop(0.9) - 7.29) < 1e-9, dloop(0.9)
    assert abs(dloop(fps[0])) < 0.01 and abs(dloop(fps[2])) < 0.01

    # Cobweb: start a whisker away from the metastable point and iterate.
    walk_x, walk_y = [0.95], [0.95]
    v0 = 0.95
    for _ in range(5):
        v1 = float(loop(v0))
        walk_x += [v0, v1]
        walk_y += [v1, v1]
        v0 = v1
    assert abs(v0 - fps[2]) < 1e-3, v0

    v = np.linspace(0, VDD, 800)
    fig, ax = plt.subplots()
    ax.plot(v, loop(v), color=c[0], lw=2.4)
    ax.plot([0, VDD], [0, VDD], color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot(walk_x, walk_y, color=c[1], lw=1.5, alpha=0.95)
    for x in (fps[0], fps[2]):
        ax.plot([x], [x], "o", color=S.INK[mode], ms=8, zorder=6)
    ax.plot([fps[1]], [fps[1]], "o", color=S.GUIDE[mode], ms=10, zorder=6,
            markerfacecolor="none", markeredgewidth=2.2)
    S.label_end(ax, 1.80, float(loop(1.80)), "the loop:\ntwo inversions of Q",
                c[0], mode, dx=9, dy=0, ha="left")
    S.label_end(ax, 1.05, 1.05, "the line where nothing changes", S.GUIDE[mode], mode,
                dx=9, dy=-13, ha="left")
    S.note(ax, 0.05, 0.32, "stable crossing: a stored 0", mode)
    S.note(ax, 2.46, 1.60, "stable crossing: a stored 1", mode, ha="right")
    ax.annotate("", xy=(0.885, 0.885), xytext=(0.62, 1.24),
                arrowprops=dict(arrowstyle="-|>", color=S.INK_2[mode], lw=1.1))
    S.note(ax, 0.05, 1.26, "slope 7.29 at this crossing: any disturbance is"
           "\namplified, so no real circuit rests here", mode)
    S.note(ax, 1.02, 0.55, "start 50 mV above the middle crossing\nand five loop"
           " passes land on the stored 1", mode, size=9)
    ax.set_xlabel("voltage entering the loop  (V)")
    ax.set_ylabel("voltage leaving it, two inversions later  (V)")
    ax.set_title("Two inverters in a loop have three fixed points and keep only two")
    ax.set_xlim(-0.02, 2.52)
    ax.set_ylim(-0.02, 1.90)
    S.strip(ax)
    return fig


@figure("dig3-latch-transparency")
def _(mode):
    """A transparent latch against an edge-triggered flip-flop on one stimulus.

    The data line changes at 1.4, 2.6 and 4.4 time units; the clock is high on
    [1, 3] and [5, 7]. The latch follows D whenever the clock is high, so it
    passes the 1.4 and 2.6 changes straight through and ends the first high
    phase holding the LAST value it saw. The flip-flop samples only at the
    rising edges t = 1 and t = 5, so it never sees either change.
    """
    c = S.SERIES[mode]
    tmax = 8.0
    clk = [(0, 0), (1, 1), (3, 0), (5, 1), (7, 0)]
    d = [(0, 0), (1.4, 1), (2.6, 0), (4.4, 1)]

    def level_at(edges, t):
        v = edges[0][1]
        for tt, vv in edges:
            if tt <= t:
                v = vv
        return v

    # latch: transparent while the clock is high
    ts = sorted({0.0} | {e[0] for e in clk} | {e[0] for e in d})
    q_latch, cur = [], 0
    for t in ts:
        if level_at(clk, t):
            cur = level_at(d, t)
        q_latch.append((t, cur))
    # flip-flop: sample D at each rising clock edge
    q_ff, cur = [(0.0, 0)], 0
    for tt, vv in clk:
        if vv == 1:
            cur = level_at(d, tt)
            q_ff.append((tt, cur))
    assert level_at(q_latch, 2.0) == 1, "latch must follow D up at 1.4"
    assert level_at(q_latch, 2.9) == 0, "latch must follow D down at 2.6"
    assert level_at(q_ff, 2.0) == 0 and level_at(q_ff, 4.9) == 0, "FF sampled 0 at t=1"
    assert level_at(q_ff, 6.0) == 1, "FF sampled 1 at t=5"
    assert level_at(q_latch, 4.0) == 0, "latch holds the last value seen"

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    h, gap = 0.60, 1.05
    rows = [("clock", clk, S.GUIDE[mode]), ("D", d, S.INK_2[mode]),
            ("latch Q", q_latch, c[1]), ("flip-flop Q", q_ff, c[0])]
    for i, (nm, ed, col) in enumerate(rows):
        y = (len(rows) - 1 - i) * gap
        digital(ax, ed, y, h, col, tmax=tmax)
        rowlabel(ax, -0.12, y + h / 2, nm, mode)
    for t in (1, 5):
        ax.axvline(t, color=S.GUIDE[mode], lw=0.9, ls=":", zorder=0)
    ax.axvspan(1, 3, color=S.GUIDE[mode], alpha=0.10, lw=0, zorder=0)
    ax.axvspan(5, 7, color=S.GUIDE[mode], alpha=0.10, lw=0, zorder=0)
    for t in (1.4, 2.6):
        ax.annotate("", xy=(t, 1.05 + h + 0.06), xytext=(t, 2.10 - 0.05),
                    arrowprops=dict(arrowstyle="-|>", color=S.INK_2[mode], lw=1.0))
    S.note(ax, -2.15, 4.10, "Both of the marked changes reach the latch output;"
           " neither is ever seen by the flip-flop.", mode, size=9)
    S.note(ax, -2.15, -0.55, "The flip-flop looks only at the two rising edges, so its"
           " output changes at most once per cycle.", mode, size=9, va="top")
    ax.set_xlim(-2.30, tmax + 0.4)
    ax.set_ylim(-1.35, 4.75)
    ax.set_xlabel("time (arbitrary units); shading marks the clock-high windows")
    ax.set_title("Transparency: the latch is a window, the flip-flop is a shutter")
    clean(ax)
    return fig


@figure("dig3-ff-waveforms")
def _(mode):
    """One clock and one stimulus through all four flip-flops.

    Each trace is produced by applying the characteristic equation of its device
    at every rising edge - Q+ = D, Q+ = T xor Q, Q+ = JQ' + K'Q, Q+ = S + R'Q -
    to the same eight-cycle input pattern, so the four rows differ only by the
    equation used.
    """
    c = S.SERIES[mode]
    n = 8
    D = [1, 0, 0, 1, 1, 0, 1, 0]
    T = [0, 1, 1, 0, 1, 1, 1, 0]
    J = [1, 0, 1, 1, 0, 0, 1, 0]
    K = [0, 0, 1, 1, 0, 1, 0, 1]
    Sx = [1, 0, 0, 1, 0, 0, 1, 0]
    Rx = [0, 0, 1, 0, 0, 1, 0, 1]
    assert all(not (a and b) for a, b in zip(Sx, Rx)), "SR stimulus must avoid S=R=1"

    qd, qt, qj, qs = [], [], [], []
    a = b = e = f = 0
    for i in range(n):
        a = D[i]
        b = T[i] ^ b
        e = (J[i] & (1 - e)) | ((1 - K[i]) & e)
        f = Sx[i] | ((1 - Rx[i]) & f)
        qd.append(a)
        qt.append(b)
        qj.append(e)
        qs.append(f)
    assert qd == D, "a D flip-flop reproduces its input one cycle late"
    assert qt == [0, 1, 0, 0, 1, 0, 1, 1], qt
    assert qj == [1, 1, 0, 1, 1, 0, 1, 0], qj
    assert qs == [1, 1, 0, 1, 1, 0, 1, 0], qs
    # the JK and SR stimuli were chosen to give the same output; verify it
    assert qj == qs, "JK and SR stimuli must agree so the rows are comparable"

    def steps(vals):
        out = [(0.0, 0)]
        for i, v in enumerate(vals):
            out.append((i + 1.0, v))
        return out

    clk = []
    for i in range(n + 1):
        clk += [(i + 0.0, 1), (i + 0.5, 0)]

    fig, ax = plt.subplots(figsize=(7.4, 4.8))
    h, gap = 0.52, 1.02
    rows = [
        ("clock", clk, S.GUIDE[mode], None),
        ("D", steps(qd), c[0], [str(v) for v in D]),
        ("T", steps(qt), c[1], [str(v) for v in T]),
        ("JK", steps(qj), c[2], [f"{a}{b}" for a, b in zip(J, K)]),
        ("SR", steps(qs), c[0], [f"{a}{b}" for a, b in zip(Sx, Rx)]),
    ]
    for i, (nm, ed, col, stim) in enumerate(rows):
        y = (len(rows) - 1 - i) * gap
        digital(ax, ed, y, h, col, tmax=n + 0.4)
        rowlabel(ax, -0.15, y + h / 2, nm + ("" if stim is None else "  Q"), mode)
        if stim is not None:
            for k, s in enumerate(stim):
                ax.annotate(s, xy=(k + 0.5, y - 0.20), color=S.INK_2[mode],
                            fontsize=8.5, ha="center", va="center")
            rowlabel(ax, -0.15, y - 0.20, f"{nm} in", mode, size=8.5)
    for i in range(n + 1):
        ax.axvline(i, color=S.GRID[mode], lw=0.7, ls=":", zorder=0)
    S.note(ax, -2.55, 4.72, "Each output row is its own characteristic equation applied at"
           " every rising edge.\nThe JK and SR stimuli were chosen to drive the same"
           " sequence, so the last two rows coincide.", mode, size=8.5)
    ax.set_xlim(-2.6, n + 0.5)
    ax.set_ylim(-0.55, 5.55)
    ax.set_xlabel("clock cycle")
    ax.set_title("Four characteristic equations, four stimuli, one clock")
    clean(ax)
    return fig


@figure("dig3-slack-vs-freq")
def _(mode):
    """Setup slack falls with frequency; hold margin does not move.

    Path: t_cq = 0.35 ns, worst-case logic 4.20 ns, fastest logic 0.40 ns,
    setup 0.15 ns, hold 0.10 ns, skew 0.12 ns. Setup slack is T - 4.82 ns and
    crosses zero at 207.47 MHz; hold margin is 0.35 + 0.40 - 0.10 - 0.12 =
    0.53 ns and contains no T at all.
    """
    c = S.SERIES[mode]
    t_cq, t_max, t_min, t_su, t_h, t_skew = 0.35, 4.20, 0.40, 0.15, 0.10, 0.12
    need = t_cq + t_max + t_su + t_skew
    hold = t_cq + t_min - t_h - t_skew
    assert abs(need - 4.82) < 1e-12
    assert abs(hold - 0.53) < 1e-12
    f0 = 1e3 / need
    assert abs(f0 - 207.46887966804978) < 1e-9, f0

    f = np.linspace(60, 340, 900)
    slack = 1e3 / f - need
    fig, ax = plt.subplots()
    ax.plot(f, slack, color=c[0], lw=2.2)
    ax.plot(f, np.full_like(f, hold), color=c[1], lw=2.2)
    S.label_end(ax, 285, float(1e3 / 285 - need), "setup slack", c[0], mode, dy=-15,
                ha="center")
    S.label_end(ax, 98, hold, "hold margin: 0.53 ns at every frequency", c[1], mode,
                dy=12, ha="left")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([f0], [0.0], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.annotate("", xy=(f0 + 2, 0.10), xytext=(f0 + 32, 3.05),
                arrowprops=dict(arrowstyle="-|>", color=S.INK_2[mode], lw=1.1))
    S.note(ax, f0 + 28, 3.15, "setup slack reaches zero at 207.47 MHz", mode)
    S.note(ax, 62, -2.15, "Below the dashed line the path does not close. Slowing the"
           " clock\nwalks the setup curve back up and moves the hold line not at all,"
           "\nwhich is why a hold failure is never a frequency problem.", mode, size=9)
    ax.set_xlabel("clock frequency  (MHz)")
    ax.set_ylabel("margin  (ns)")
    ax.set_title("Only one of the two constraints knows the clock period")
    ax.set_xlim(60, 348)
    ax.set_ylim(-3.6, 12.0)
    S.strip(ax)
    return fig


@figure("dig3-mtbf-stages")
def _(mode):
    """Synchroniser MTBF against clock frequency for one, two and three stages.

    MTBF = exp(t_r/tau) / (T_0 f_c f_d) with tau = 0.30 ns, T_0 = 20 ps and a
    10 MHz asynchronous event rate. The resolution time allowed by an n-stage
    chain is t_r = nT - t_su. At 200 MHz the three curves read 262 s, 4.54e9 s
    and 7.86e16 s.
    """
    c = S.SERIES[mode]
    tau, T0, f_d, t_su = 0.30e-9, 20e-12, 10e6, 0.15e-9
    f = np.linspace(50e6, 400e6, 800)

    def mtbf(stages):
        t_r = stages / f - t_su
        return np.exp(t_r / tau) / (T0 * f * f_d)

    at200 = [float(np.exp((k / 200e6 - t_su) / tau) / (T0 * 200e6 * f_d))
             for k in (1, 2, 3)]
    assert abs(at200[0] - 262.4) / 262.4 < 1e-3, at200[0]
    assert abs(at200[1] - 4.542e9) / 4.542e9 < 1e-3, at200[1]
    assert abs(at200[2] - 7.862e16) / 7.862e16 < 1e-3, at200[2]
    yr = 3.15576e7
    assert abs(at200[1] / yr - 143.9) / 143.9 < 1e-3

    fig, ax = plt.subplots()
    anchors = {1: 300.0, 2: 320.0, 3: 335.0}
    for k, col, nm in ((1, c[0], "one stage"), (2, c[1], "two stages"),
                       (3, c[2], "three stages")):
        ax.semilogy(f / 1e6, mtbf(k), color=col, lw=2.2)
        fa = anchors[k]
        S.label_end(ax, fa, float(np.exp((k / (fa * 1e6) - t_su) / tau)
                                  / (T0 * fa * 1e6 * f_d)), nm, col, mode,
                    dx=0, dy=-14, ha="center")
    ax.axhline(yr, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 52, yr * 2.2, "one year", mode)
    ax.axhline(100 * yr, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 52, 100 * yr * 2.2, "one century", mode)
    ax.plot([200, 200, 200], at200, "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 152, 3e18, "at 200 MHz the three chains read\n262 s, 144 years and"
           " 2.5 billion years", mode, size=9)
    ax.set_xlabel("clock frequency  (MHz)")
    ax.set_ylabel("mean time between failures  (s)")
    ax.set_title("Each synchroniser stage multiplies the MTBF by exp(T/tau)")
    ax.set_xlim(50, 360)
    ax.set_ylim(1e-4, 1e26)
    S.strip(ax)
    return fig


@figure("dig3-ripple-codes")
def _(mode):
    """The 0111 to 1000 transition on a ripple counter, stage by stage.

    Negative-edge stages, 8 ns each. Q0 falls at 8 ns, which clocks Q1 down at
    16 ns, which clocks Q2 down at 24 ns, which finally clocks Q3 up at 32 ns.
    The bus therefore reads 6, then 4, then 0 before it reads 8.
    """
    c = S.SERIES[mode]
    tpd, n = 8.0, 4
    bits = [0, 1, 1, 1]                    # Q3 Q2 Q1 Q0
    events, t, idx = [], 0.0, n - 1
    codes = [(0.0, int("".join(str(b) for b in bits), 2))]
    traces = {k: [(0.0, bits[k])] for k in range(n)}
    while idx >= 0:
        t += tpd
        prev = bits[idx]
        bits[idx] ^= 1
        traces[idx].append((t, bits[idx]))
        codes.append((t, int("".join(str(b) for b in bits), 2)))
        events.append((t, "".join(str(b) for b in bits)))
        if not (prev == 1 and bits[idx] == 0):
            break
        idx -= 1
    assert [cd for _, cd in codes] == [7, 6, 4, 0, 8], codes
    assert events[-1][0] == 32.0
    assert abs(1e3 / 32.0 - 31.25) < 1e-12

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    h, gap, tmax = 0.58, 0.92, 44.0
    for k in range(n):
        y = (n - 1 - k) * gap + 1.15
        digital(ax, traces[k], y, h, c[k % 3], tmax=tmax)
        rowlabel(ax, -1.0, y + h / 2, f"Q{n-1-k}", mode)
    for tt, _ in codes[1:]:
        ax.axvline(tt, color=S.GRID[mode], lw=0.8, ls=":", zorder=0)
    for tt, cd in codes:
        ax.annotate(f"{cd}", xy=(tt + 1.0, 0.45), color=S.INK[mode], fontsize=11,
                    ha="left", va="center", fontweight="semibold")
    rowlabel(ax, -1.0, 0.45, "bus reads", mode)
    ax.annotate("", xy=(32.0, 0.05), xytext=(0.0, 0.05),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 16.0, -0.35, "32 ns before the bus is trustworthy: four stages at 8 ns each",
           mode, ha="center", va="top")
    S.note(ax, -6.0, 5.15, "6, 4 and 0 are decoded by anything watching the bus,"
           " and none of\nthem is a state this counter is supposed to visit", mode, size=9)
    ax.set_xlim(-6.5, tmax + 1.0)
    ax.set_ylim(-1.3, 5.9)
    ax.set_xlabel("time (ns) after the clock edge that should produce 1000")
    ax.set_title("A ripple counter passes through three wrong codes on one count")
    clean(ax)
    return fig


@figure("dig3-counter-rate")
def _(mode):
    """Maximum count rate against counter width for three architectures.

    Stage delay 8 ns, AND-gate delay 3 ns, setup 2 ns. Ripple needs n stage
    delays; a synchronous counter with parallel enable gates needs
    8 + 3 + 2 = 13 ns whatever n is; a synchronous counter whose enable term is
    built as a chain of two-input gates needs 8 + 3(n-2) + 2.
    """
    c = S.SERIES[mode]
    tpd, tand, tsu = 8.0, 3.0, 2.0
    n = np.arange(2, 17)
    ripple = 1e3 / (n * tpd)
    par = np.full_like(n, 1e3 / (tpd + tand + tsu), dtype=float)
    chain = 1e3 / (tpd + np.maximum(n - 2, 0) * tand + tsu)
    assert abs(float(ripple[n == 4][0]) - 31.25) < 1e-9
    assert abs(float(par[0]) - 1e3 / 13.0) < 1e-9
    assert abs(float(par[0]) - 76.92307692307692) < 1e-9
    assert abs(float(chain[n == 4][0]) - 62.5) < 1e-9
    assert abs(float(chain[n == 16][0]) - 1e3 / 52.0) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(n, par, color=c[0], lw=2.2, marker="o", ms=5)
    ax.plot(n, chain, color=c[1], lw=2.2, marker="o", ms=5)
    ax.plot(n, ripple, color=c[2], lw=2.2, marker="o", ms=5)
    S.label_end(ax, 16, float(par[-1]), "synchronous,\nparallel enable gates", c[0], mode,
                dy=8)
    S.label_end(ax, 16, float(chain[-1]), "synchronous,\nchained enable", c[1], mode, dy=-2)
    S.label_end(ax, 16, float(ripple[-1]), "ripple", c[2], mode, dy=-14)
    ax.plot([4], [31.25], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.annotate("", xy=(4.15, 30.5), xytext=(6.4, 12.0),
                arrowprops=dict(arrowstyle="-|>", color=S.INK_2[mode], lw=1.1))
    S.note(ax, 6.2, 8.0, "the four-bit case worked in the text:\n31.25 MHz against"
           " 76.9 MHz", mode)
    ax.set_xlabel("counter width  (bits)")
    ax.set_ylabel("maximum count rate  (MHz)")
    ax.set_title("Ripple delay grows with width; a synchronous period need not")
    ax.set_xlim(1.6, 20.5)
    ax.set_ylim(0, 90)
    ax.set_xticks([2, 4, 6, 8, 10, 12, 14, 16])
    S.strip(ax)
    return fig


# ===========================================================================
# fee_state_machines
# ===========================================================================

PAT = "1101"
MOORE = {(0, 0): 0, (0, 1): 1, (1, 0): 0, (1, 1): 2,
         (2, 0): 3, (2, 1): 2, (3, 0): 0, (3, 1): 4,
         (4, 0): 0, (4, 1): 2}
MEALY = {k: (v if v < 4 else 1) for k, v in MOORE.items() if k[0] < 4}
MEALY_OUT = {k: (1 if v == 4 else 0) for k, v in MOORE.items() if k[0] < 4}


def _longest_prefix_suffix(hist, pat):
    for L in range(min(len(hist), len(pat) - 1), -1, -1):
        if hist[len(hist) - L:] == pat[:L]:
            return L
    return 0


def _rebuild_moore():
    """Independent reconstruction of MOORE from the longest-prefix rule."""
    out = {}
    for L in range(len(PAT) + 1):
        hist = PAT[:L]
        for x in "01":
            h = hist + x
            out[(L, int(x))] = (len(PAT) if h[-len(PAT):] == PAT
                                else _longest_prefix_suffix(h, PAT))
    return out


assert _rebuild_moore() == MOORE, "state table must follow from the prefix rule"


@figure("dig3-fsm-graphs")
def _(mode):
    """The same specification as a five-state Moore machine and a four-state
    Mealy machine, drawn from the transition tables the lesson prints.

    Both graphs are laid out from the same dictionaries used to synthesise the
    equations, so a discrepancy between picture and table is impossible.
    """
    c = S.SERIES[mode]
    fig, axes = plt.subplots(2, 1, figsize=(7.4, 6.6))

    # Both machines are chains: each state is one more matched character, so the
    # forward arcs run left to right and every backward arc sits underneath.
    R = 0.34
    posM = {s: (1.55 * s, 0.0) for s in range(5)}
    ax = axes[0]
    for s, p in posM.items():
        node(ax, p, f"S{s}", mode, r=R, sub=("out 1" if s == 4 else None),
             colour=c[0] if s == 4 else None, lw=2.4 if s == 4 else 1.6)
    curves = {(0, 0): ("loop", 90), (0, 1): ("arc", 0.0),
              (1, 0): ("arc", -0.30), (1, 1): ("arc", 0.0),
              (2, 0): ("arc", 0.0), (2, 1): ("loop", 90),
              (3, 0): ("arc", -0.42), (3, 1): ("arc", 0.0),
              (4, 0): ("arc", -0.55), (4, 1): ("arc", -0.34)}
    for (s, x), d in sorted(MOORE.items()):
        kind, val = curves[(s, x)]
        if kind == "loop":
            selfloop(ax, posM[s], str(x), mode, r=R, ang=val)
            continue
        edge(ax, posM[s], posM[d], str(x), mode, r=R, rad=val,
             colour=c[0] if d == 4 else None)
    ax.set_title("Moore: five states, the output belongs to S4", fontsize=11)
    ax.set_xlim(-0.75, 6.95)
    ax.set_ylim(-2.45, 1.20)
    ax.set_aspect("equal")
    clean(ax)

    posE = {s: (1.55 * s, 0.0) for s in range(4)}
    ax = axes[1]
    for s, p in posE.items():
        node(ax, p, f"S{s}", mode, r=R)
    curvesE = {(0, 0): ("loop", 90), (0, 1): ("arc", 0.0),
               (1, 0): ("arc", -0.30), (1, 1): ("arc", 0.0),
               (2, 0): ("arc", 0.0), (2, 1): ("loop", 90),
               (3, 0): ("arc", -0.52), (3, 1): ("arc", -0.32)}
    for (s, x), d in sorted(MEALY.items()):
        lab = f"{x}/{MEALY_OUT[(s, x)]}"
        kind, val = curvesE[(s, x)]
        if kind == "loop":
            selfloop(ax, posE[s], lab, mode, r=R, ang=val)
            continue
        col = c[0] if MEALY_OUT[(s, x)] else None
        edge(ax, posE[s], posE[d], lab, mode, r=R, rad=val, colour=col)
    ax.set_title("Mealy: four states, the output belongs to one arrow", fontsize=11)
    ax.set_xlim(-0.75, 6.95)
    ax.set_ylim(-2.45, 1.20)
    ax.set_aspect("equal")
    clean(ax)
    fig.suptitle("One specification for detecting 1101, drawn two ways",
                 fontsize=12.5, color=S.INK[mode], fontweight="semibold", y=0.99)
    fig.subplots_adjust(hspace=0.28)
    return fig


@figure("dig3-mm-waveform")
def _(mode):
    """Both detectors on the stream 110110101101, simulated from their tables.

    The Mealy output pulses in cycles 3, 6 and 11; the Moore state reaches S4
    one edge later, so its output pulses in cycles 4, 7 and 12.
    """
    c = S.SERIES[mode]
    stream = "110110101101"
    n = len(stream)
    st, mealy = 0, []
    for ch in stream:
        b = int(ch)
        mealy.append(MEALY_OUT[(st, b)])
        st = MEALY[(st, b)]
    s2, moore, mstates = 0, [], [0]
    for ch in stream:
        s2 = MOORE[(s2, int(ch))]
        mstates.append(s2)
        moore.append(1 if s2 == 4 else 0)
    hits = [i for i, v in enumerate(mealy) if v]
    assert hits == [3, 6, 11], hits
    assert [i for i, v in enumerate(moore) if v] == hits
    ref = [1 if stream[max(0, i - 3):i + 1] == PAT else 0 for i in range(n)]
    assert mealy == ref, "Mealy output must equal a plain substring scan"

    def steps(vals, shift=0.0):
        out = [(0.0, 0)]
        for i, v in enumerate(vals):
            out.append((i + shift, v))
        out.append((len(vals) + shift, 0))    # the pulse ends with its cycle
        return out

    fig, ax = plt.subplots(figsize=(7.4, 4.4))
    h, gap = 0.55, 0.95
    digital(ax, steps([int(ch) for ch in stream]), 3 * gap, h, S.INK_2[mode], tmax=n + 1)
    rowlabel(ax, -0.2, 3 * gap + h / 2, "input", mode)
    digital(ax, steps(mealy), 2 * gap, h, c[1], tmax=n + 1)
    rowlabel(ax, -0.2, 2 * gap + h / 2, "Mealy out", mode)
    digital(ax, steps(moore, shift=1.0), 1 * gap, h, c[0], tmax=n + 1)
    rowlabel(ax, -0.2, 1 * gap + h / 2, "Moore out", mode)
    rowlabel(ax, -0.2, 0.20, "Moore state", mode)
    for i, s in enumerate(mstates):
        ax.annotate(f"S{s}", xy=(i + 0.5, 0.20), color=S.INK[mode], fontsize=8.5,
                    ha="center", va="center")
    for i in range(n + 1):
        ax.axvline(i, color=S.GRID[mode], lw=0.7, ls=":", zorder=0)
    for i in hits:
        ax.axvspan(i, i + 1, color=S.GUIDE[mode], alpha=0.13, lw=0, zorder=0)
    for i in hits:
        ax.annotate("", xy=(i + 1.5, 1 * gap + h / 2), xytext=(i + 0.5, 2 * gap + h / 2),
                    arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], lw=1.1,
                                    connectionstyle="arc3,rad=-0.25"))
    S.note(ax, -3.05, 4.15, "Shaded cycles are the ones in which the pattern completes;"
           " each arrow is one cycle of latency.", mode, size=8.5)
    ax.set_xlim(-3.1, n + 1.2)
    ax.set_ylim(-0.25, 4.65)
    ax.set_xlabel("clock cycle")
    ax.set_title("Same detections, one cycle apart")
    clean(ax)
    return fig


@figure("dig3-assign-cost")
def _(mode):
    """Literal cost of all 24 two-bit state assignments for the Mealy detector.

    Each bar is an exact minimum sum-of-products cost, computed here by
    Quine-McCluskey with Petrick resolution over the three output functions
    D1, D0 and Y. The spread is 7 to 18 literals; straight binary lands at 17.
    """
    c = S.SERIES[mode]

    def _combine(a, b):
        diff, out = 0, []
        for x, y in zip(a, b):
            if x != y:
                diff += 1
                out.append("-")
            else:
                out.append(x)
        return "".join(out) if diff == 1 else None

    def primes(nb, ones, dcs):
        cur = {format(m, f"0{nb}b") for m in list(ones) + list(dcs)}
        pr = set()
        while cur:
            used, nxt = set(), set()
            for a, b in itertools.combinations(sorted(cur), 2):
                cc = _combine(a, b)
                if cc:
                    nxt.add(cc)
                    used.add(a)
                    used.add(b)
            pr |= (cur - used)
            cur = nxt
        return sorted(pr)

    def cov(pi, m, nb):
        return all(p == "-" or p == ch for p, ch in zip(pi, format(m, f"0{nb}b")))

    def cost(nb, ones):
        ones = sorted(set(ones))
        if not ones:
            return 0
        pis = primes(nb, ones, ())
        if all(p == "-" * nb for p in pis):
            return 0
        ess = {[p for p in pis if cov(p, m, nb)][0]
               for m in ones if len([p for p in pis if cov(p, m, nb)]) == 1}
        rest = [m for m in ones if not any(cov(p, m, nb) for p in ess)]
        if not rest:
            return sum(sum(1 for ch in p if ch != "-") for p in ess)
        cand = [p for p in pis if p not in ess]
        best = None
        for k in range(1, len(cand) + 1):
            for combo in itertools.combinations(cand, k):
                if all(any(cov(p, m, nb) for p in combo) for m in rest):
                    tot = sum(sum(1 for ch in p if ch != "-") for p in (ess | set(combo)))
                    best = tot if best is None else min(best, tot)
            if best is not None:
                break
        return best

    costs = []
    for perm in itertools.permutations(range(4)):
        dec = {v: k for k, v in enumerate(perm)}
        dec = {perm[s]: s for s in range(4)}
        o1, o0, oy = [], [], []
        for q1, q0, x in itertools.product((0, 1), repeat=3):
            st = dec[(q1 << 1) | q0]
            nx = perm[MEALY[(st, x)]]
            m = (q1 << 2) | (q0 << 1) | x
            if (nx >> 1) & 1:
                o1.append(m)
            if nx & 1:
                o0.append(m)
            if MEALY_OUT[(st, x)]:
                oy.append(m)
        costs.append((cost(3, o1) + cost(3, o0) + cost(3, oy), perm))
    costs.sort()
    vals = [v for v, _ in costs]
    assert min(vals) == 7 and max(vals) == 18, (min(vals), max(vals))
    straight = [v for v, p in costs if p == (0, 1, 2, 3)][0]
    grayc = [v for v, p in costs if p == (0, 1, 3, 2)][0]
    assert straight == 17, straight
    assert grayc == 8, grayc

    fig, ax = plt.subplots()
    xs = np.arange(len(vals))
    cols = []
    for v, p in costs:
        if p == (0, 1, 2, 3):
            cols.append(c[1])
        elif p == (0, 1, 3, 2):
            cols.append(c[2])
        elif v == 7:
            cols.append(c[0])
        else:
            cols.append(S.GUIDE[mode])
    ax.bar(xs, vals, color=cols, width=0.72)
    ax.axhline(16, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 23.6, 22.4, "dashed: one-hot spends 16 literals of next-state logic,"
           "\nbut on four flip-flops instead of two", mode, size=9, ha="right")
    i_bin = [i for i, (v, p) in enumerate(costs) if p == (0, 1, 2, 3)][0]
    i_gray = [i for i, (v, p) in enumerate(costs) if p == (0, 1, 3, 2)][0]
    S.label_end(ax, i_bin, straight, "straight binary\n00 01 10 11", c[1], mode,
                dy=12, ha="center")
    S.label_end(ax, i_gray, grayc, "Gray\n00 01 11 10", c[2], mode, dy=26, ha="center")
    S.label_end(ax, 1.5, 7, "the cheapest four", c[0], mode, dy=10, ha="center")
    ax.set_xlabel("the 24 ways of assigning two-bit codes to four states, cheapest first")
    ax.set_ylabel("literals in the minimum sum of products")
    ax.set_title("State assignment changes the logic by a factor of two and a half")
    ax.set_xticks([])
    ax.set_xlim(-1.0, 24.0)
    ax.set_ylim(0, 26)
    S.strip(ax)
    return fig


@figure("dig3-implication-chart")
def _(mode):
    """The implication chart for the seven-state machine in the lesson.

    Cell (r, c) is crossed at round 0 when the two states differ in output, and
    at round 1 when a successor pair has already been crossed. What survives is
    the set of equivalent pairs, computed here rather than read off a drawing.
    """
    c = S.SERIES[mode]
    M = {"A": (("B", "C"), 0), "B": (("D", "E"), 0), "C": (("D", "F"), 0),
         "D": (("G", "A"), 1), "E": (("G", "A"), 1), "F": (("D", "E"), 0),
         "G": (("B", "C"), 0)}
    states = sorted(M)
    pairs = list(itertools.combinations(states, 2))
    dist = {p: 0 for p in pairs if M[p[0]][1] != M[p[1]][1]}
    rnd = 0
    while True:
        rnd += 1
        added = False
        for a, b in pairs:
            if (a, b) in dist:
                continue
            for i in (0, 1):
                na, nb = M[a][0][i], M[b][0][i]
                if na != nb and tuple(sorted((na, nb))) in dist:
                    dist[(a, b)] = rnd
                    added = True
                    break
        if not added:
            break
    equiv = [p for p in pairs if p not in dist]
    assert sorted(equiv) == [("A", "G"), ("B", "F"), ("D", "E")], equiv
    assert max(dist.values()) == 1

    fig, ax = plt.subplots(figsize=(5.8, 6.4))
    rows = states[1:]
    cols = states[:-1]
    for i, r in enumerate(rows):
        for j, cc in enumerate(cols):
            if cc >= r:
                continue
            key = tuple(sorted((r, cc)))
            y = len(rows) - 1 - i
            face = "none"
            ax.add_patch(Rectangle((j, y), 1, 1, fill=False,
                                   ec=S.GRID[mode], lw=1.0))
            if key in dist:
                col = S.GUIDE[mode] if dist[key] else S.INK_2[mode]
                ax.plot([j + 0.2, j + 0.8], [y + 0.2, y + 0.8], color=col, lw=1.6)
                ax.plot([j + 0.2, j + 0.8], [y + 0.8, y + 0.2], color=col, lw=1.6)
                ax.annotate(str(dist[key]), xy=(j + 0.5, y + 0.5), fontsize=8,
                            color=S.INK_2[mode], ha="center", va="center",
                            bbox=dict(boxstyle="round,pad=0.12", fc="none", ec="none"))
            else:
                ax.add_patch(Rectangle((j, y), 1, 1, fc=c[0], alpha=0.22, lw=0))
                ax.annotate("=", xy=(j + 0.5, y + 0.5), fontsize=15, color=c[0],
                            ha="center", va="center", fontweight="bold")
    for j, cc in enumerate(cols):
        ax.annotate(cc, xy=(j + 0.5, -0.35), fontsize=11, color=S.INK[mode],
                    ha="center", va="center", fontweight="semibold")
    for i, r in enumerate(rows):
        ax.annotate(r, xy=(-0.35, len(rows) - 1 - i + 0.5), fontsize=11,
                    color=S.INK[mode], ha="center", va="center", fontweight="semibold")
    S.note(ax, -0.7, -1.30, "Shaded cells survive every round: A is equivalent to G,"
           " B to F, D to E.", mode)
    S.note(ax, -0.7, -1.95, "0  crossed because the two outputs differ", mode, size=9)
    S.note(ax, -0.7, -2.50, "1  crossed because a successor pair had already been"
           " crossed", mode, size=9)
    ax.set_xlim(-0.85, 6.35)
    ax.set_ylim(-3.05, 6.4)
    ax.set_aspect("equal")
    ax.set_title("Implication chart: three pairs are never crossed out")
    clean(ax)
    return fig


@figure("dig3-johnson-lockup")
def _(mode):
    """The four-bit Johnson counter's two disjoint cycles, and the repair.

    With the textbook feedback D3 = Q0' the sixteen codes split into two
    eight-state rings that never meet, so a power-up into the wrong ring is
    permanent. Replacing the feedback with D3 = Q0' + Q2Q1' - the cheapest of
    the 132 self-correcting completions, found by enumerating all 256 - leaves
    the intended ring untouched and drains the other one in at most five clocks.
    """
    c = S.SERIES[mode]

    def step(code, sc=False):
        q3, q2, q1, q0 = [(code >> (3 - i)) & 1 for i in range(4)]
        fb = ((1 - q0) | (q2 & (1 - q1))) if sc else (1 - q0)
        return (fb << 3) | (q3 << 2) | (q2 << 1) | q1

    def orbit(start, sc):
        seen, cur = [], start
        while cur not in seen:
            seen.append(cur)
            cur = step(cur, sc)
        return seen

    main = orbit(0, False)
    para = orbit(0b0010, False)
    assert len(main) == 8 and len(para) == 8
    assert not set(main) & set(para)
    for code in main:
        assert step(code, True) == step(code, False), code
    worst = 0
    for code in range(16):
        cur, k = code, 0
        while cur not in main:
            cur = step(cur, True)
            k += 1
            assert k <= 8
        worst = max(worst, k)
    assert worst == 5, worst

    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    R1, R2 = 1.28, 1.28
    cx1, cx2 = -1.85, 1.85
    pos = {}
    for i, code in enumerate(main):
        th = math.pi / 2 - 2 * math.pi * i / 8
        pos[code] = (cx1 + R1 * math.cos(th), R1 * math.sin(th))
    for i, code in enumerate(para):
        th = math.pi / 2 - 2 * math.pi * i / 8
        pos[code] = (cx2 + R2 * math.cos(th), R2 * math.sin(th))
    for code in main:
        node(ax, pos[code], format(code, "04b"), mode, r=0.33, colour=c[0], fs=8.5)
    for code in para:
        node(ax, pos[code], format(code, "04b"), mode, r=0.33, colour=c[1], fs=8.5)
    for code in main:
        edge(ax, pos[code], pos[step(code)], "", mode, r=0.33, rad=0.16, colour=c[0])
    for code in para:
        edge(ax, pos[code], pos[step(code)], "", mode, r=0.33, rad=0.16, colour=c[1])
    # The repair changes only the arcs whose destination moves. Draw exactly
    # those, so the picture cannot overstate how much the fix touches.
    moved = [(code, step(code, True)) for code in para
             if step(code, True) != step(code, False)]
    escaped = [(a, b) for a, b in moved if b in main]
    assert len(moved) == 2 and len(escaped) == 1, (moved, escaped)
    for a, b in moved:
        ax.add_patch(FancyArrowPatch(_rim(pos[a], pos[b], 0.33),
                                     _rim(pos[b], pos[a], 0.33),
                                     connectionstyle="arc3,rad=0.12",
                                     arrowstyle="-|>", mutation_scale=13,
                                     color=c[2], lw=2.0, ls="--", zorder=6))
    S.label_end(ax, cx1, -2.10, "the eight intended states", c[0], mode,
                ha="center", dy=-12)
    S.label_end(ax, cx2, -2.10, "the eight nobody designed", c[1], mode,
                ha="center", dy=-12)
    S.note(ax, 0.0, 2.32, "dashed: the only two arcs the repaired feedback moves,"
           "\nand one of them leaves the ring", mode, ha="center")
    ax.set_xlim(-3.7, 3.7)
    ax.set_ylim(-3.05, 3.15)
    ax.set_aspect("equal")
    ax.set_title("Sixteen codes, two rings, and no path between them")
    clean(ax)
    return fig


@figure("dig3-vending-graph")
def _(mode):
    """The coin controller drawn from the same table that produced its gates.

    Four states hold 0, 5, 10 and 15 cents; N is a nickel and D a dime, and the
    two never arrive together. Arcs are labelled coin/output, where the outputs
    are VEND and CHANGE.
    """
    c = S.SERIES[mode]
    trans = {}
    for held in (0, 5, 10, 15):
        for coin, lab in ((0, "-"), (5, "N"), (10, "D")):
            tot = held + coin
            if coin == 0:
                trans[(held, lab)] = (held, 0, 0)
            elif tot >= 20:
                trans[(held, lab)] = (0, 1, 1 if tot > 20 else 0)
            else:
                trans[(held, lab)] = (tot, 0, 0)
    assert trans[(15, "D")] == (0, 1, 1), trans[(15, "D")]
    assert trans[(15, "N")] == (0, 1, 0)
    assert trans[(10, "D")] == (0, 1, 0)
    assert trans[(5, "D")] == (15, 0, 0)

    R = 0.40
    pos = {0: (0.0, 0.0), 5: (1.85, 0.0), 10: (3.70, 0.0), 15: (5.55, 0.0)}
    # rad per (held, coin); positive arcs ride above the chain, negative below
    arcs = {(0, "N"): 0.0, (0, "D"): -0.30,
            (5, "N"): 0.0, (5, "D"): -0.46,
            (10, "N"): 0.0, (10, "D"): -0.40,
            (15, "N"): -0.56, (15, "D"): -0.74}
    fig, ax = plt.subplots(figsize=(7.4, 4.0))
    for held, p in pos.items():
        node(ax, p, f"{held}c", mode, r=R, colour=c[0] if held == 15 else None)
    for (held, lab), (nxt, vend, chg) in sorted(trans.items()):
        if lab == "-":
            continue
        text = lab if not vend else (f"{lab} / VEND" + (", CHG" if chg else ""))
        edge(ax, pos[held], pos[nxt], text, mode, r=R, rad=arcs[(held, lab)],
             colour=c[1] if vend else None, fs=8.5)
    S.note(ax, -0.55, 1.62, "Price is 20c. Every state also holds on 'no coin',"
           " which is drawn as no arc at all.\nA dime on top of 15c overpays by 5c,"
           " and that is the only arc asserting CHANGE.", mode, size=8.5)
    ax.set_xlim(-0.6, 6.2)
    ax.set_ylim(-2.55, 2.45)
    ax.set_aspect("equal")
    ax.set_title("Coin controller: four states, two coin inputs, two outputs")
    clean(ax)
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
        assert n.startswith("dig3-"), f"figure {n} is outside this file's namespace"
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
