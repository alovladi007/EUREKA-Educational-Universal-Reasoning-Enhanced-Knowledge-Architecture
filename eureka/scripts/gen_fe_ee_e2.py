#!/usr/bin/env python3
"""Expansion-wave-2 figures for the FE Electrical and Computer course:
the seven Circuit Analysis chapters.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, to a tolerance
tight enough to catch a real error. A tolerance of 0.1 on a quantity quoted to
two decimals is not a check, it is decoration: an earlier figure in this course
was labelled 92.6 against a true 92.52 and the assertion passed. The assertions
below are written at 1e-9 wherever the quantity is exact in closed form, and at
the last quoted digit otherwise.

Usage:
    python3 scripts/gen_fe_ee_e2.py             # all
    python3 scripts/gen_fe_ee_e2.py ckt2-rc     # only names with that prefix
"""
from __future__ import annotations

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
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# DC Circuit Fundamentals
# ---------------------------------------------------------------------------


@figure("ckt2-terminal-droop")
def _(mode):
    """Terminal voltage and delivered power for a 12 V source with r = 0.5 ohm.

    v_t = E - I r is a straight line from the open-circuit EMF to the
    short-circuit current E/r = 24 A; delivered power p = v_t I = E I - I^2 r
    is the parabola through both intercepts, peaking at I = E/(2r) = 12 A.
    Power is drawn as a fraction of its own peak so both quantities share one
    axis, per the house rule against a second y-scale.
    """
    c = S.SERIES[mode]
    E, r = 12.0, 0.5
    I = np.linspace(0, E / r, 600)
    vt = E - I * r
    p = vt * I
    p_peak = E * E / (4 * r)
    assert abs(p_peak - 72.0) < 1e-9, p_peak
    assert abs(vt[0] - 12.0) < 1e-9
    assert abs(I[-1] - 24.0) < 1e-9
    # the lesson's 2 A operating point: 11 V terminal, 22 W to the load
    assert abs((E - 2.0 * r) - 11.0) < 1e-9
    assert abs((E - 2.0 * r) * 2.0 - 22.0) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(I, vt / E, color=c[0], lw=2.2)
    ax.plot(I, p / p_peak, color=c[1], lw=2.2)
    S.label_end(ax, 6.0, (E - 6 * r) / E, "terminal volts\n(fraction of EMF)", c[0], mode, dy=14, ha="center")
    S.label_end(ax, 12.0, 1.0, "delivered power\n(fraction of peak)", c[1], mode, dy=13, ha="center")
    ax.plot([2.0], [11.0 / 12.0], "o", color=c[0], ms=7)
    S.note(ax, 2.5, 0.93, "2 A load: 11 V at the terminals", mode)
    ax.axvline(12.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 12.4, 0.30, "peak power at I = E/2r = 12 A,\nwhere the terminals sit at half the EMF", mode)
    ax.plot([24.0], [0.0], "o", color=c[0], ms=7)
    S.note(ax, 23.6, 0.05, "short circuit: E/r = 24 A", mode, ha="right")
    ax.set_xlabel("load current  I  (A)")
    ax.set_ylabel("fraction of open-circuit value")
    ax.set_title("A real source droops: 12 V EMF behind 0.5 ohm")
    ax.set_xlim(0, 25.5)
    ax.set_ylim(0, 1.16)
    S.strip(ax)
    return fig


@figure("ckt2-parallel-shrink")
def _(mode):
    """Parallel equivalent of a fixed 100 ohm against a swept partner.

    R_eq = R1 R2 / (R1 + R2) with R1 = 100 ohm. The curve rises toward the
    100 ohm asymptote it can never reach, which is the whole content of "the
    parallel combination is always smaller than the smallest resistor".
    """
    c = S.SERIES[mode]
    R1 = 100.0
    R2 = np.linspace(1.0, 1000.0, 1500)
    Req = R1 * R2 / (R1 + R2)
    assert abs(R1 * 100.0 / (R1 + 100.0) - 50.0) < 1e-9
    assert abs(R1 * 1000.0 / (R1 + 1000.0) - 90.9090909090909) < 1e-9
    assert Req.max() < R1

    fig, ax = plt.subplots()
    ax.plot(R2, Req, color=c[0], lw=2.4)
    ax.axhline(R1, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 20, 101.5, "asymptote at R1 = 100 ohm - never reached", mode)
    ax.plot([100.0], [50.0], "o", color=c[0], ms=7)
    S.note(ax, 118, 44, "equal resistors halve: 100 || 100 = 50 ohm", mode)
    ax.plot([1000.0], [1000.0 * R1 / 1100.0], "o", color=c[1], ms=7)
    S.label_end(ax, 1000.0, 1000.0 * R1 / 1100.0, "90.9 ohm", c[1], mode, dx=-70, dy=-14)
    S.label_end(ax, 620, R1 * 620 / (R1 + 620), "R_eq = R1 R2 / (R1 + R2)", c[0], mode, dy=-16, ha="center")
    ax.set_xlabel("partner resistance  R2  (ohm)")
    ax.set_ylabel("parallel equivalent  R_eq  (ohm)")
    ax.set_title("Adding a parallel path can only lower resistance")
    ax.set_xlim(0, 1060)
    ax.set_ylim(0, 116)
    S.strip(ax)
    return fig


@figure("ckt2-ladder-sweep")
def _(mode):
    """The chapter's 12 V ladder with R3 swept, showing where the current goes.

    R1 = 4 ohm feeds the parallel pair R2 = 6 ohm and R3. The source current is
    12 / (R1 + R2 R3/(R2 + R3)) and the branch currents follow the divider. At
    R3 = 12 ohm the figure reproduces the lesson's 1.5 A / 1.0 A / 0.5 A split
    exactly, which is what the assertion pins.
    """
    c = S.SERIES[mode]
    V, R1, R2 = 12.0, 4.0, 6.0
    R3 = np.linspace(2.0, 40.0, 1200)
    Rp = R2 * R3 / (R2 + R3)
    Is = V / (R1 + Rp)
    Vp = Is * Rp
    I2, I3 = Vp / R2, Vp / R3

    def split(r3):
        rp = R2 * r3 / (R2 + r3)
        i = V / (R1 + rp)
        vp = i * rp
        return i, vp / R2, vp / r3

    i, i2, i3 = split(12.0)
    assert abs(i - 1.5) < 1e-9 and abs(i2 - 1.0) < 1e-9 and abs(i3 - 0.5) < 1e-9
    assert np.allclose(I2 + I3, Is, atol=1e-12), "KCL broken in the swept data"

    fig, ax = plt.subplots()
    ax.plot(R3, Is, color=c[0], lw=2.2)
    ax.plot(R3, I2, color=c[1], lw=2.2)
    ax.plot(R3, I3, color=c[2], lw=2.2)
    S.label_end(ax, 40.0, split(40.0)[0], "source I", c[0], mode)
    S.label_end(ax, 40.0, split(40.0)[1], "through R2 = 6 ohm", c[1], mode, dy=-9)
    S.label_end(ax, 40.0, split(40.0)[2], "through R3", c[2], mode, dy=-6)
    ax.plot([12.0, 12.0, 12.0], [1.5, 1.0, 0.5], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axvline(12.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 13.0, 1.75, "the worked case: R3 = 12 ohm gives 1.5 = 1.0 + 0.5 A", mode)
    ax.set_xlabel("R3  (ohm)")
    ax.set_ylabel("current  (A)")
    ax.set_title("Open the third branch and the source current falls to its series limit")
    ax.set_xlim(0, 47)
    ax.set_ylim(0, 2.45)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Network Theorems
# ---------------------------------------------------------------------------


@figure("ckt2-thevenin-loadline")
def _(mode):
    """Source characteristic and two load lines for the chapter's equivalent.

    The Thevenin source V_th = 8 V behind R_th = 4 ohm has the terminal
    characteristic v = 8 - 4 i, a straight line from (0, 8 V) to the Norton
    current 8/4 = 2 A. A resistive load R_L is the line v = R_L i; the
    intersection is the operating point i = 8/(4 + R_L).
    """
    c = S.SERIES[mode]
    Vth, Rth = 8.0, 4.0
    i = np.linspace(0, Vth / Rth, 400)
    v = Vth - Rth * i
    assert abs(Vth / Rth - 2.0) < 1e-9

    def op(RL):
        cur = Vth / (Rth + RL)
        return cur, cur * RL

    i4, v4 = op(4.0)
    i12, v12 = op(12.0)
    assert abs(i4 - 1.0) < 1e-9 and abs(v4 - 4.0) < 1e-9
    assert abs(i12 - 0.5) < 1e-9 and abs(v12 - 6.0) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(i, v, color=c[0], lw=2.4)
    ax.plot(i, 4.0 * i, color=c[1], lw=2.0)
    ax.plot(i, 12.0 * i, color=c[2], lw=2.0)
    S.label_end(ax, 1.75, Vth - Rth * 1.75, "source: v = 8 - 4i", c[0], mode, dy=-14, ha="right")
    S.label_end(ax, 1.6, 4.0 * 1.6, "load 4 ohm", c[1], mode, dy=2)
    S.label_end(ax, 0.62, 12.0 * 0.62, "load 12 ohm", c[2], mode, dy=2)
    ax.plot([i4], [v4], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([i12], [v12], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 1.06, 3.35, "1.00 A, 4.00 V, 4.0 W", mode)
    S.note(ax, 0.44, 6.45, "0.50 A, 6.00 V, 3.0 W", mode, ha="right")
    ax.plot([0], [Vth], "o", color=c[0], ms=7)
    S.note(ax, 0.04, 8.25, "open circuit: V_th = 8 V", mode)
    ax.plot([2.0], [0], "o", color=c[0], ms=7)
    S.note(ax, 2.02, 0.25, "short circuit:\nI_N = 2 A", mode)
    ax.set_xlabel("terminal current  i  (A)")
    ax.set_ylabel("terminal voltage  v  (V)")
    ax.set_title("Thevenin line and load line meet at the operating point")
    ax.set_xlim(0, 2.45)
    ax.set_ylim(0, 9.2)
    S.strip(ax)
    return fig


@figure("ckt2-maxpower")
def _(mode):
    """Load power and efficiency against load ratio for a Thevenin source.

    p / p_max = 4 x / (1 + x)^2 and eta = x / (1 + x) with x = R_L / R_th, both
    from P = (V R_L)/(R_th + R_L) squared over R_L. The point of the figure is
    that the two peak in different places: power at x = 1, efficiency
    monotonically at large x.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.02, 10.0, 1600)
    p = 4 * x / (1 + x) ** 2
    eta = x / (1 + x)
    assert abs(p.max() - 1.0) < 1e-6
    assert abs(4 * 1.0 / 4.0 - 1.0) < 1e-12
    assert abs(1.0 / 2.0 - 0.5) < 1e-12          # 50% efficiency at the match
    assert abs(4 * 3.0 / 16.0 - 0.75) < 1e-12    # x = 3 keeps 75% of peak power
    assert abs(3.0 / 4.0 - 0.75) < 1e-12         # and lifts efficiency to 75%

    fig, ax = plt.subplots()
    ax.plot(x, p, color=c[0], lw=2.4)
    ax.plot(x, eta, color=c[1], lw=2.4)
    S.label_end(ax, 10.0, 4 * 10 / 121, "load power / peak", c[0], mode, dy=-8, ha="right", dx=-4)
    S.label_end(ax, 10.0, 10 / 11, "efficiency", c[1], mode, dx=-4, dy=8, ha="right")
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot([1.0, 1.0], [1.0, 0.5], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 1.15, 0.97, "matched: maximum power, and exactly half of it wasted inside", mode)
    ax.plot([3.0, 3.0], [0.75, 0.75], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 3.30, 0.66, "x = 3: still 75% of peak power, but 75% efficient", mode)
    ax.set_xlabel("load ratio  x = R_L / R_th")
    ax.set_ylabel("fraction")
    ax.set_title("Maximum power and maximum efficiency are different designs")
    ax.set_xlim(0, 10.4)
    ax.set_ylim(0, 1.14)
    S.strip(ax)
    return fig


@figure("ckt2-superposition-stack")
def _(mode):
    """Superposition on the chapter's two-source node, swept over one source.

    Node V with a 10 V source through 2 ohm, a variable source Vb through
    4 ohm, and 4 ohm to ground. Solving, V = (2 Vb + 10 x ... ) - the code
    computes the exact contributions instead: with Vb dead, V_a = 10 x G1/Gsum;
    with the 10 V dead, V_b = Vb x G2/Gsum. Their sum is the full solution, and
    the assertion checks that against a direct solve at Vb = 4 V, where the
    lesson's answer is 6 V.
    """
    c = S.SERIES[mode]
    G1, G2, G3 = 1 / 2.0, 1 / 4.0, 1 / 4.0
    Gs = G1 + G2 + G3
    Vb = np.linspace(-8.0, 16.0, 600)
    Va_part = np.full_like(Vb, 10.0 * G1 / Gs)
    Vb_part = Vb * G2 / Gs
    total = Va_part + Vb_part
    direct = (10.0 * G1 + 4.0 * G2) / Gs
    assert abs(direct - 6.0) < 1e-12, direct
    assert abs(10.0 * G1 / Gs - 5.0) < 1e-12
    assert abs(4.0 * G2 / Gs - 1.0) < 1e-12
    assert np.allclose(Va_part + Vb_part, (10.0 * G1 + Vb * G2) / Gs, atol=1e-12)

    fig, ax = plt.subplots()
    ax.plot(Vb, Va_part, color=c[0], lw=2.2)
    ax.plot(Vb, Vb_part, color=c[1], lw=2.2)
    ax.plot(Vb, total, color=c[2], lw=2.6)
    S.label_end(ax, 16.0, 5.0, "from the 10 V source alone", c[0], mode, dx=-6, dy=-12, ha="right")
    S.label_end(ax, 16.0, 16.0 * G2 / Gs, "from Vb alone", c[1], mode, dx=-6, dy=-13, ha="right")
    S.label_end(ax, 16.0, 5.0 + 16.0 * G2 / Gs, "sum = full solution", c[2], mode, dx=-6, dy=11, ha="right")
    ax.plot([4.0], [6.0], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 4.5, 5.1, "Vb = 4 V: 5 V + 1 V = 6 V,\nthe node answer", mode)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.set_xlabel("second source  Vb  (V)")
    ax.set_ylabel("node voltage contribution  (V)")
    ax.set_title("Superposition: each source's share adds, and only linear circuits allow it")
    ax.set_xlim(-8.6, 16.4)
    ax.set_ylim(-2.6, 10.6)
    S.strip(ax)
    return fig


@figure("ckt2-bridge-balance")
def _(mode):
    """Wheatstone bridge output against one arm, showing the balance null.

    With arms R1, R2 on the left and R3, Rx on the right across a 10 V supply,
    the open-circuit bridge output is
        v = 10 [ R2/(R1 + R2) - Rx/(R3 + Rx) ]
    which crosses zero at Rx = R3 R2 / R1. For R1 = R2 = R3 = 1000 ohm the null
    is at 1000 ohm, and the slope there is what a strain gauge reads.
    """
    c = S.SERIES[mode]
    R1 = R2 = R3 = 1000.0
    Rx = np.linspace(800.0, 1250.0, 1400)
    V = 10.0
    vo = V * (R2 / (R1 + R2) - Rx / (R3 + Rx))
    null = R3 * R2 / R1
    assert abs(null - 1000.0) < 1e-9
    assert abs(V * (0.5 - 1000.0 / 2000.0)) < 1e-12
    # 1% arm change gives 10 * (0.5 - 1010/2010) = -24.87... mV
    v1pct = V * (0.5 - 1010.0 / 2010.0)
    assert abs(v1pct * 1e3 - (-24.875621890547265)) < 1e-9, v1pct

    fig, ax = plt.subplots()
    ax.plot(Rx, vo * 1e3, color=c[0], lw=2.4)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot([null], [0.0], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 1012, 105, "balance: Rx = R3 R2 / R1 = 1000 ohm,\nand the null is independent of the supply", mode)
    ax.plot([1010.0], [v1pct * 1e3], "o", color=c[1], ms=7, zorder=5)
    S.label_end(ax, 1010.0, v1pct * 1e3, "+1% arm -> -24.9 mV", c[1], mode, dx=16, dy=-16)
    S.label_end(ax, 862, V * (0.5 - 862 / 1862) * 1e3, "nearly linear over a\nfew percent either side", c[0], mode, dy=8)
    ax.set_xlabel("unknown arm  Rx  (ohm)")
    ax.set_ylabel("open-circuit bridge output  (mV)")
    ax.set_title("A bridge measures by nulling, not by reading a scale")
    ax.set_xlim(790, 1270)
    ax.set_ylim(-640, 700)
    S.strip(ax)
    return fig


@figure("ckt2-source-transform")
def _(mode):
    """Terminal characteristics of a voltage model and its current model.

    A 12 V source behind 6 ohm and a 2 A source across 6 ohm produce the same
    v = 12 - 6 i line, which is the statement that a source transformation
    changes nothing a load can detect. A mismatched pair (2.5 A across 6 ohm)
    is drawn to show what an incorrect transformation looks like.
    """
    c = S.SERIES[mode]
    i = np.linspace(0, 2.6, 400)
    v_th = 12.0 - 6.0 * i
    v_no = 6.0 * (2.0 - i)
    v_bad = 6.0 * (2.5 - i)
    assert np.allclose(v_th, v_no, atol=1e-12), "transformation is not equivalent"
    assert abs(12.0 / 6.0 - 2.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(i, v_th, color=c[0], lw=3.4, alpha=0.55)
    ax.plot(i, v_no, color=c[1], lw=1.9, ls="--")
    ax.plot(i, v_bad, color=c[2], lw=1.9)
    S.label_end(ax, 0.86, 12.0 - 6.0 * 0.86, "12 V behind 6 ohm", c[0], mode, dy=12)
    S.label_end(ax, 1.86, 6.0 * (2.0 - 1.86), "2 A across 6 ohm\n(same line, exactly)", c[1], mode, dy=-17, ha="right")
    S.label_end(ax, 0.34, 6.0 * (2.5 - 0.34), "2.5 A across 6 ohm:\na wrong transformation", c[2], mode, dy=14)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.set_xlabel("terminal current  i  (A)")
    ax.set_ylabel("terminal voltage  v  (V)")
    ax.set_title("Source transformation: identical outside, different inside")
    ax.set_xlim(0, 2.75)
    ax.set_ylim(-1.2, 16.2)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# AC Steady-State Analysis: Phasors and Impedance
# ---------------------------------------------------------------------------

# The series RLC the AC chapters share, so the reader meets ONE circuit in the
# phasor chapter, the power chapter and the resonance chapter and can compare.
R_AC, L_AC, C_AC = 30.0, 0.10, 20e-6   # ohm, H, F
F0_AC = 1.0 / (2 * np.pi * np.sqrt(L_AC * C_AC))


@figure("ckt2-reactance-vs-f")
def _(mode):
    """Inductive and capacitive reactance, and |Z|, for the shared series RLC.

    X_L = 2 pi f L rises linearly, X_C = 1/(2 pi f C) falls as 1/f, and they
    cross at f0 = 1/(2 pi sqrt(LC)) = 112.54 Hz for L = 100 mH, C = 20 uF. The
    magnitude |Z| = sqrt(R^2 + (X_L - X_C)^2) bottoms out at R there.
    """
    c = S.SERIES[mode]
    f = np.logspace(np.log10(10.0), np.log10(1200.0), 1400)
    XL = 2 * np.pi * f * L_AC
    XC = 1.0 / (2 * np.pi * f * C_AC)
    Z = np.hypot(R_AC, XL - XC)
    assert abs(F0_AC - 112.53953951963825) < 1e-9, F0_AC
    assert abs(2 * np.pi * F0_AC * L_AC - 1.0 / (2 * np.pi * F0_AC * C_AC)) < 1e-9
    assert abs(Z.min() - R_AC) < 0.05, Z.min()
    assert abs(2 * np.pi * 60.0 * L_AC - 37.69911184307752) < 1e-9
    assert abs(1.0 / (2 * np.pi * 60.0 * C_AC) - 132.62911924324612) < 1e-9

    fig, ax = plt.subplots()
    ax.loglog(f, XL, color=c[0], lw=2.0)
    ax.loglog(f, XC, color=c[1], lw=2.0)
    ax.loglog(f, Z, color=c[2], lw=2.6)
    S.label_end(ax, 1200, 2 * np.pi * 1200 * L_AC, "X_L = 2 pi f L", c[0], mode, dx=-6, dy=10, ha="right")
    S.label_end(ax, 12.0, 1.0 / (2 * np.pi * 12.0 * C_AC), "X_C = 1 / (2 pi f C)", c[1], mode, dy=12)
    S.label_end(ax, 165, np.hypot(R_AC, 2 * np.pi * 165 * L_AC - 1 / (2 * np.pi * 165 * C_AC)),
                "|Z| of the series pair, R = 30 ohm", c[2], mode, dx=10, dy=-14)
    ax.axvline(F0_AC, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([F0_AC], [R_AC], "o", color=c[2], ms=7, zorder=5)
    S.note(ax, 124, 8.4, "f0 = 112.5 Hz: the reactances cancel and |Z| = R = 30 ohm", mode)
    ax.plot([60.0], [np.hypot(R_AC, 2 * np.pi * 60 * L_AC - 1 / (2 * np.pi * 60 * C_AC))],
            "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 10.4, 8.4, "at 60 Hz, |Z| = 99.6 ohm and the circuit is capacitive", mode)
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("ohms")
    ax.set_title("Two reactances, opposite slopes, one crossing")
    ax.set_ylim(8, 4000)
    S.strip(ax)
    return fig


@figure("ckt2-impedance-angle")
def _(mode):
    """Impedance angle of the shared series RLC against frequency.

    theta = arctan((X_L - X_C)/R), swept on a log frequency axis. It runs from
    -90 degrees (capacitive, current leads) through zero at resonance to
    +90 degrees (inductive, current lags). The 45-degree crossings sit where
    the net reactance equals R, which is the half-power bandwidth edge.
    """
    c = S.SERIES[mode]
    f = np.logspace(np.log10(10.0), np.log10(1400.0), 1600)
    X = 2 * np.pi * f * L_AC - 1.0 / (2 * np.pi * f * C_AC)
    th = np.degrees(np.arctan2(X, R_AC))
    th60 = np.degrees(np.arctan2(2 * np.pi * 60 * L_AC - 1 / (2 * np.pi * 60 * C_AC), R_AC))
    assert abs(th60 - (-72.46230174512758)) < 1e-9, th60
    # half-power edges: X = +/- R, i.e. f where 2 pi f L - 1/(2 pi f C) = +/- R
    w0 = 2 * np.pi * F0_AC
    a = R_AC / (2 * L_AC)
    f_hi = (a + np.sqrt(a * a + w0 * w0)) / (2 * np.pi)
    f_lo = (-a + np.sqrt(a * a + w0 * w0)) / (2 * np.pi)
    assert abs(f_hi - f_lo - R_AC / (2 * np.pi * L_AC)) < 1e-9
    assert abs(f_hi - 138.91705752219036) < 1e-8, f_hi
    assert abs(f_lo - 91.17057459462177) < 1e-8, f_lo

    fig, ax = plt.subplots()
    ax.semilogx(f, th, color=c[0], lw=2.6)
    for y in (-90, 0, 90):
        ax.axhline(y, color=S.GRID[mode], lw=0.9, ls=":")
    ax.axhline(45, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(-45, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([F0_AC], [0.0], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 178, -14, "resonance at 112.5 Hz:\npurely resistive", mode)
    ax.plot([f_lo, f_hi], [-45, 45], "o", color=c[1], ms=7, zorder=5)
    S.label_end(ax, f_hi, 45, "138.9 Hz, +45 deg", c[1], mode, dx=10, dy=-4)
    S.label_end(ax, f_lo, -45, "91.2 Hz, -45 deg", c[1], mode, dx=-10, dy=2, ha="right")
    ax.plot([60.0], [th60], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 10.6, -99, "60 Hz: -72.5 deg, strongly capacitive - the current leads", mode)
    S.note(ax, 700, 68, "inductive: current lags", mode, ha="center")
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("impedance angle  (degrees)")
    ax.set_title("The sign of the angle is the sign of the net reactance")
    ax.set_ylim(-100, 100)
    S.strip(ax)
    return fig


@figure("ckt2-vi-lag")
def _(mode):
    """Voltage and current for a lagging load, drawn from the phasor answer.

    v(t) = 170 cos(wt) into an impedance of angle +36.87 degrees gives
    i(t) = I_m cos(wt - 36.87 deg). The phase difference is read off as the
    horizontal shift between the zero crossings, which at 60 Hz is
    36.87/360 x 16.667 ms = 1.706 ms.
    """
    c = S.SERIES[mode]
    f = 60.0
    Vm = 170.0
    th = np.degrees(np.arctan2(3.0, 4.0))          # a 3-4-5 impedance triangle
    Im = Vm / 5.0
    assert abs(th - 36.86989764584402) < 1e-9, th
    assert abs(Im - 34.0) < 1e-12
    dt_ms = th / 360.0 * (1000.0 / f)
    assert abs(dt_ms - 1.7069397058261122) < 1e-9, dt_ms

    t = np.linspace(0, 2.0 / f, 2000)
    v = Vm * np.cos(2 * np.pi * f * t)
    i = Im * np.cos(2 * np.pi * f * t - np.radians(th))

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, v / Vm, color=c[0], lw=2.2)
    ax.plot(t * 1e3, i / Im, color=c[1], lw=2.2)
    S.label_end(ax, 33.3, 1.0, "v(t), peak 170 V", c[0], mode, dx=-6, dy=10, ha="right")
    S.label_end(ax, 33.3, np.cos(2 * np.pi * f * (2.0 / f) - np.radians(th)),
                "i(t), peak 34 A", c[1], mode, dx=-6, dy=-14, ha="right")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    # mark the lag between the two positive-going zero crossings
    z_v, z_i = 0.25 / f * 1e3, (0.25 / f + dt_ms / 1e3 / 1) * 1e3
    z_i = 0.25 / f * 1e3 + dt_ms
    ax.plot([z_v, z_i], [0, 0], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.annotate("", xy=(z_i, -0.42), xytext=(z_v, -0.42),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, (z_v + z_i) / 2, -0.62, "1.71 ms lag = 36.87 deg", mode, ha="center")
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("fraction of own peak")
    ax.set_title("Current lags voltage by the impedance angle, and nothing else")
    ax.set_xlim(0, 36)
    ax.set_ylim(-1.25, 1.3)
    S.strip(ax)
    return fig


@figure("ckt2-phasor-add")
def _(mode):
    """Phasor addition of two currents, drawn as vectors from the origin.

    I1 = 10 at 0 deg and I2 = 8 at 90 deg sum to 12.806 at 38.66 deg, computed
    with complex arithmetic. The figure exists to make one point: phasors add
    head to tail like vectors, and the magnitudes do NOT add - 10 + 8 is 18,
    the answer is 12.81.
    """
    c = S.SERIES[mode]
    I1 = 10 + 0j
    I2 = 0 + 8j
    Is = I1 + I2
    assert abs(abs(Is) - 12.806248474865697) < 1e-9, abs(Is)
    assert abs(np.degrees(np.angle(Is)) - 38.65980825409009) < 1e-9

    fig, ax = plt.subplots()
    for z, col, lab, dy in ((I1, c[0], "I1 = 10 at 0 deg", -16),
                            (I2, c[1], "I2 = 8 at 90 deg", 8),
                            (Is, c[2], "sum = 12.81 at 38.66 deg", 10)):
        ax.annotate("", xy=(z.real, z.imag), xytext=(0, 0),
                    arrowprops=dict(arrowstyle="-|>", color=col, lw=2.4,
                                    shrinkA=0, shrinkB=0))
        S.label_end(ax, z.real, z.imag, lab, col, mode, dy=dy)
    # head-to-tail construction
    ax.plot([I1.real, Is.real], [I1.imag, Is.imag], color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 10.3, 4.0, "I2 shifted to I1's head:\nhead-to-tail addition", mode)
    S.note(ax, 0.6, 9.2, "magnitudes do not add:\n10 + 8 = 18, but |I1 + I2| = 12.81", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("real part  (A)")
    ax.set_ylabel("imaginary part  (A)")
    ax.set_title("Phasors add as vectors: the right angle costs you 5.19 A")
    ax.set_xlim(-1.2, 15.5)
    ax.set_ylim(-1.2, 11.2)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# AC Power
# ---------------------------------------------------------------------------


@figure("ckt2-power-triangle")
def _(mode):
    """The power triangle for the chapter's 8 kW, 0.8 lagging load.

    S = P / pf = 10 kVA, Q = sqrt(S^2 - P^2) = 6 kvar, theta = 36.87 degrees.
    The corrected case at pf = 0.95 is drawn on the same axes: same P, shorter
    Q of 2.629 kvar, and an apparent power of 8.421 kVA.
    """
    c = S.SERIES[mode]
    P, pf = 8.0, 0.8
    Sm = P / pf
    Q = np.sqrt(Sm ** 2 - P ** 2)
    assert abs(Sm - 10.0) < 1e-12 and abs(Q - 6.0) < 1e-12
    pf2 = 0.95
    S2 = P / pf2
    Q2 = np.sqrt(S2 ** 2 - P ** 2)
    assert abs(S2 - 8.421052631578947) < 1e-12, S2
    assert abs(Q2 - 2.629472841430903) < 1e-9, Q2
    assert abs(Q - Q2 - 3.370527158569097) < 1e-9

    fig, ax = plt.subplots()
    ax.plot([0, P, P, 0], [0, 0, Q, 0], color=c[0], lw=2.4)
    ax.plot([P, P, 0], [0, Q2, 0], color=c[1], lw=2.2, ls="--")
    S.label_end(ax, P / 2, 0, "P = 8 kW (real, does the work)", c[0], mode, dy=-14, ha="center")
    S.label_end(ax, P, Q / 2, "Q = 6 kvar", c[0], mode, dx=8)
    S.label_end(ax, P / 2, Q / 2, "S = 10 kVA", c[0], mode, dy=12, ha="center")
    S.label_end(ax, P, Q2 / 2, "Q = 2.63 kvar\nafter correction", c[1], mode, dx=8, dy=-14)
    S.label_end(ax, P / 2 - 0.3, Q2 / 2, "S = 8.42 kVA", c[1], mode, dy=10, ha="center")
    ax.annotate("", xy=(P, Q2), xytext=(P, Q),
                arrowprops=dict(arrowstyle="-|>", color=S.INK_2[mode], lw=1.6))
    S.note(ax, 8.15, 4.4, "the capacitor supplies\n3.37 kvar", mode)
    S.note(ax, 0.35, 0.35, "36.87 deg", mode)
    S.note(ax, 0.35, 0.1, "18.19 deg", mode)
    ax.set_xlabel("real power  P  (kW)")
    ax.set_ylabel("reactive power  Q  (kvar)")
    ax.set_title("Correcting power factor shortens Q and leaves P untouched")
    ax.set_xlim(-0.4, 11.6)
    ax.set_ylim(-0.9, 7.2)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("ckt2-pf-line-current")
def _(mode):
    """Line current and line loss against power factor for a fixed 8 kW load.

    At 240 V the line current is I = P/(V pf), so it is a 1/pf hyperbola, and
    the resistive line loss goes as I^2, i.e. 1/pf^2. Both are normalised to
    their unity-power-factor values, which is what makes the penalty legible:
    at pf = 0.7 the loss is 1/0.49 = 2.04 times the minimum.
    """
    c = S.SERIES[mode]
    pf = np.linspace(0.5, 1.0, 800)
    i_rel = 1.0 / pf
    loss_rel = 1.0 / pf ** 2
    assert abs(1.0 / 0.8 - 1.25) < 1e-12
    assert abs(1.0 / 0.8 ** 2 - 1.5625) < 1e-12
    assert abs(1.0 / 0.7 ** 2 - 2.0408163265306123) < 1e-12
    # the absolute currents the lesson quotes, at 240 V
    assert abs(8000.0 / (240.0 * 0.8) - 41.666666666666664) < 1e-9
    assert abs(8000.0 / (240.0 * 0.95) - 35.08771929824562) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(pf, i_rel, color=c[0], lw=2.4)
    ax.plot(pf, loss_rel, color=c[1], lw=2.4)
    S.label_end(ax, 0.53, 1 / 0.53, "line current", c[0], mode, dy=-16)
    S.label_end(ax, 0.58, 1 / 0.58 ** 2, "I^2 R line loss", c[1], mode, dy=8)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    for x, txt in ((0.8, "pf 0.80:\n1.25x current,\n1.56x loss"),
                   (0.95, "pf 0.95:\n1.05x current,\n1.11x loss")):
        ax.plot([x, x], [1 / x, 1 / x ** 2], "o", color=S.INK[mode], ms=6, zorder=5)
        ax.axvline(x, color=S.GRID[mode], lw=0.9, ls=":")
        S.note(ax, x + 0.006, 2.45, txt, mode)
    S.note(ax, 0.985, 1.06, "unity pf: the floor", mode, ha="right")
    ax.set_xlabel("power factor")
    ax.set_ylabel("multiple of the unity-pf value")
    ax.set_title("The utility bills for current, and current goes as 1/pf")
    ax.set_xlim(0.5, 1.02)
    ax.set_ylim(0.85, 4.3)
    S.strip(ax)
    return fig


@figure("ckt2-pf-capacitor")
def _(mode):
    """Capacitor rating needed to correct an 8 kW, 0.8 pf load to a target.

    Qc = P [tan(acos(pf1)) - tan(acos(pf2))] evaluated across the target axis.
    The curve turns sharply upward near unity: going from 0.95 to 1.00 costs
    2.63 kvar, more than the 3.37 kvar that bought 0.80 to 0.95 for far less
    benefit.
    """
    c = S.SERIES[mode]
    P, pf1 = 8.0, 0.8
    t2 = np.linspace(0.80, 1.0, 800)
    Qc = P * (np.tan(np.arccos(pf1)) - np.tan(np.arccos(t2)))
    q95 = P * (np.tan(np.arccos(0.8)) - np.tan(np.arccos(0.95)))
    q100 = P * np.tan(np.arccos(0.8))
    assert abs(q95 - 3.3705271585690926) < 1e-9, q95
    assert abs(q100 - 6.0) < 1e-9, q100
    assert abs(q100 - q95 - 2.6294728414309074) < 1e-9
    # the capacitance that supplies 3.371 kvar at 240 V, 60 Hz
    Cf = q95 * 1e3 / (2 * np.pi * 60.0 * 240.0 ** 2)
    assert abs(Cf * 1e6 - 155.21876681474296) < 1e-7, Cf * 1e6

    fig, ax = plt.subplots()
    ax.plot(t2, Qc, color=c[0], lw=2.6)
    ax.plot([0.95], [q95], "o", color=c[1], ms=8, zorder=5)
    S.label_end(ax, 0.95, q95, "0.95 target: 3.37 kvar, 155 uF at 240 V", c[1], mode, dx=-10, dy=6, ha="right")
    ax.plot([1.0], [q100], "o", color=c[1], ms=8, zorder=5)
    S.label_end(ax, 1.0, q100, "unity: 6.00 kvar", c[1], mode, dx=-8, dy=-12, ha="right")
    ax.annotate("", xy=(1.0, q100), xytext=(1.0, q95),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.3))
    S.note(ax, 0.9955, 4.5, "the last 0.05 of power factor\ncosts 2.63 kvar on its own", mode, ha="right")
    ax.set_xlabel("target power factor")
    ax.set_ylabel("capacitor rating  Qc  (kvar)")
    ax.set_title("Correcting the last five points of power factor is the expensive part")
    ax.set_xlim(0.795, 1.006)
    ax.set_ylim(0, 6.7)
    S.strip(ax)
    return fig


@figure("ckt2-instantaneous-power")
def _(mode):
    """Instantaneous power for three load angles, over one cycle.

    p(t) = V_m I_m cos(wt) cos(wt - theta), normalised by V_rms I_rms so the
    average reads directly as the power factor. At theta = 0 the curve never
    goes negative; at 60 degrees a visible area sits below zero - energy
    handed back to the source - and at 90 degrees the areas cancel exactly.
    """
    c = S.SERIES[mode]
    wt = np.linspace(0, 2 * np.pi, 1600)
    fig, ax = plt.subplots()
    for k, (th, col) in enumerate(((0.0, c[0]), (60.0, c[1]), (90.0, c[2]))):
        p = 2 * np.cos(wt) * np.cos(wt - np.radians(th))
        avg = p.mean()
        assert abs(avg - np.cos(np.radians(th))) < 2e-3, (th, avg)
        ax.plot(np.degrees(wt), p, color=col, lw=2.1)
        ax.axhline(np.cos(np.radians(th)), color=col, lw=1.0, ls=":")
    S.label_end(ax, 360, 2 * np.cos(2 * np.pi) ** 2, "theta = 0: average 1.00", c[0], mode, dx=-6, dy=10, ha="right")
    S.label_end(ax, 250, 2 * np.cos(np.radians(250)) * np.cos(np.radians(250 - 60)),
                "theta = 60 deg: average 0.50", c[1], mode, dy=-14, ha="center")
    S.label_end(ax, 150, 2 * np.cos(np.radians(150)) * np.cos(np.radians(150 - 90)),
                "theta = 90 deg: average 0", c[2], mode, dy=10, ha="center")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    S.note(ax, 8, -1.72, "below the axis, the load is returning energy to the source", mode)
    ax.set_xlabel("phase  wt  (degrees)")
    ax.set_ylabel("p(t) / (V_rms I_rms)")
    ax.set_title("Real power is the average height; reactive power is the swing")
    ax.set_xlim(0, 415)
    ax.set_ylim(-2.0, 2.25)
    ax.set_xticks([0, 90, 180, 270, 360])
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Resonance and Frequency Response
# ---------------------------------------------------------------------------


@figure("ckt2-resonance-q")
def _(mode):
    """Series-RLC current magnitude for three values of Q, same resonance.

    |I| = V / sqrt(R^2 + (wL - 1/wC)^2) with L and C fixed and R chosen to give
    Q = w0 L / R of 2, 5 and 15. Each curve is normalised to its own peak so
    the comparison is about SHAPE: the same resonant frequency, three
    bandwidths.
    """
    c = S.SERIES[mode]
    L, C = L_AC, C_AC
    w0 = 1.0 / np.sqrt(L * C)
    f0 = w0 / (2 * np.pi)
    assert abs(f0 - F0_AC) < 1e-12
    f = np.linspace(20.0, 320.0, 2400)
    w = 2 * np.pi * f

    fig, ax = plt.subplots()
    for Q, col in ((2.0, c[0]), (5.0, c[1]), (15.0, c[2])):
        R = w0 * L / Q
        mag = 1.0 / np.hypot(R, w * L - 1.0 / (w * C))
        mag = mag / mag.max()
        bw = f0 / Q
        assert abs(f[np.argmax(mag)] - f0) < 0.2, (Q, f[np.argmax(mag)])
        half = f[mag >= 1 / np.sqrt(2)]
        assert abs((half[-1] - half[0]) - bw) < 0.25, (Q, half[-1] - half[0], bw)
        ax.plot(f, mag, color=col, lw=2.2)
    S.label_end(ax, 250, 1.0 / np.hypot(w0 * L / 2, 2 * np.pi * 250 * L - 1 / (2 * np.pi * 250 * C))
                / (1 / (w0 * L / 2)), "Q = 2  (BW 56.3 Hz)", c[0], mode, dy=8)
    S.label_end(ax, 175, 0.30, "Q = 5  (BW 22.5 Hz)", c[1], mode, dy=6)
    S.label_end(ax, 128, 0.86, "Q = 15  (BW 7.5 Hz)", c[2], mode, dy=6)
    ax.axhline(1 / np.sqrt(2), color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 24, 0.72, "half power: 0.707 of peak current", mode)
    ax.axvline(f0, color=S.GRID[mode], lw=1.0, ls=":")
    S.note(ax, 115, 0.02, "f0 = 112.5 Hz for every Q", mode)
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("current, fraction of own peak")
    ax.set_title("Q sets the width of the peak, not where it sits")
    ax.set_xlim(20, 330)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("ckt2-halfpower-band")
def _(mode):
    """One resonance curve with the half-power band marked in both units.

    Q = 5 on the shared L and C, so R = w0 L / Q = 14.14 ohm, BW = f0/Q =
    22.51 Hz, and the edges are the geometric-mean-symmetric pair 102.0 and
    124.5 Hz. The figure checks the property the exam leans on: f0 is the
    GEOMETRIC mean of the edges, not the arithmetic one.
    """
    c = S.SERIES[mode]
    L, C = L_AC, C_AC
    w0 = 1.0 / np.sqrt(L * C)
    Q = 5.0
    R = w0 * L / Q
    assert abs(R - 14.142135623730947) < 1e-9, R
    BW = F0_AC / Q
    assert abs(BW - 22.50790790392765) < 1e-9, BW
    a = R / (2 * L)
    f_hi = (a + np.sqrt(a * a + w0 * w0)) / (2 * np.pi)
    f_lo = (-a + np.sqrt(a * a + w0 * w0)) / (2 * np.pi)
    assert abs(f_hi - f_lo - BW) < 1e-9
    assert abs(np.sqrt(f_lo * f_hi) - F0_AC) < 1e-9, "f0 is not the geometric mean"
    assert abs(f_lo - 101.84688351109452) < 1e-8, f_lo
    assert abs(f_hi - 124.35479141502218) < 1e-8, f_hi

    f = np.linspace(60.0, 200.0, 2000)
    w = 2 * np.pi * f
    mag = R / np.hypot(R, w * L - 1.0 / (w * C))

    fig, ax = plt.subplots()
    ax.plot(f, mag, color=c[0], lw=2.6)
    ax.fill_between(f, 0, mag, where=(f >= f_lo) & (f <= f_hi),
                    color=c[0], alpha=0.16, lw=0)
    ax.axhline(1 / np.sqrt(2), color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 62, 0.725, "0.707 of peak = half the power, = -3.01 dB", mode)
    for x, lab, ha, dx in ((f_lo, "f1 = 101.8 Hz", "right", -8), (f_hi, "f2 = 124.4 Hz", "left", 8)):
        ax.plot([x], [1 / np.sqrt(2)], "o", color=c[1], ms=7, zorder=5)
        S.label_end(ax, x, 1 / np.sqrt(2), lab, c[1], mode, dx=dx, dy=14, ha=ha)
    ax.plot([F0_AC], [1.0], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 128, 0.97, "f0 = 112.5 Hz is the GEOMETRIC mean\nof the edges: sqrt(101.8 x 124.4) = 112.5", mode)
    S.note(ax, 106, 0.13, "BW = 22.5 Hz", mode)
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("response, fraction of peak")
    ax.set_title("Half-power bandwidth of a Q = 5 series circuit")
    ax.set_xlim(60, 200)
    ax.set_ylim(0, 1.14)
    S.strip(ax)
    return fig


@figure("ckt2-parallel-resonance")
def _(mode):
    """Impedance magnitude of a parallel RLC, which peaks where series dips.

    |Z| = 1 / sqrt((1/R)^2 + (wC - 1/(wL))^2) for the same L and C with
    R = 2 kohm. At resonance the susceptances cancel, Z = R, and the circuit
    looks like a pure 2 kohm - the exact mirror of the series case, where Z
    fell to R.
    """
    c = S.SERIES[mode]
    L, C, R = L_AC, C_AC, 2000.0
    f = np.linspace(20.0, 320.0, 2400)
    w = 2 * np.pi * f
    Z = 1.0 / np.hypot(1.0 / R, w * C - 1.0 / (w * L))
    assert abs(Z.max() - R) < 0.6, Z.max()
    assert abs(f[np.argmax(Z)] - F0_AC) < 0.2
    Qp = R * np.sqrt(C / L)
    assert abs(Qp - 28.284271247461902) < 1e-9, Qp
    assert abs(F0_AC / Qp - 3.9788735772973833) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(f, Z, color=c[0], lw=2.6)
    ax.axhline(R, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([F0_AC], [R], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 122, 1830, "at f0 the susceptances cancel and Z = R = 2 kohm", mode)
    S.label_end(ax, 250, 1.0 / np.hypot(1 / R, 2 * np.pi * 250 * C - 1 / (2 * np.pi * 250 * L)),
                "inductor shorts it out below f0,\ncapacitor above", c[0], mode, dy=14)
    S.note(ax, 24, 250, "Q = R sqrt(C/L) = 28.3, so BW = 3.98 Hz - much sharper\nthan the series circuit built from the same L and C", mode)
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("|Z|  (ohm)")
    ax.set_title("Parallel resonance: a peak in impedance, not a dip")
    ax.set_xlim(20, 330)
    ax.set_ylim(0, 2300)
    S.strip(ax)
    return fig


@figure("ckt2-bode-rc")
def _(mode):
    """Magnitude response of a first-order RC low-pass, in decibels.

    |H| = 1/sqrt(1 + (f/fc)^2) for fc = 1/(2 pi R C) with R = 1.6 kohm and
    C = 100 nF, giving fc = 994.7 Hz. The asymptotes - 0 dB and -20 dB/decade -
    are drawn so the reader can see they intersect AT the corner, where the
    true curve is 3.01 dB down.
    """
    c = S.SERIES[mode]
    R, C = 1600.0, 100e-9
    fc = 1.0 / (2 * np.pi * R * C)
    assert abs(fc - 994.7183943243459) < 1e-9, fc
    f = np.logspace(1, 6, 1600)
    H = 1.0 / np.sqrt(1 + (f / fc) ** 2)
    dB = 20 * np.log10(H)
    assert abs(20 * np.log10(1 / np.sqrt(2)) - (-3.010299956639812)) < 1e-9
    assert abs(20 * np.log10(1 / np.sqrt(1 + 100.0)) - (-20.043213737826427)) < 1e-9

    fig, ax = plt.subplots()
    ax.semilogx(f, dB, color=c[0], lw=2.6)
    ax.semilogx(f[f <= fc], np.zeros_like(f[f <= fc]), color=c[1], lw=1.8, ls="--")
    hi = f[f >= fc]
    ax.semilogx(hi, -20 * np.log10(hi / fc), color=c[1], lw=1.8, ls="--")
    S.label_end(ax, 60, 0, "asymptote: 0 dB", c[1], mode, dy=10)
    S.label_end(ax, 2e5, -20 * np.log10(2e5 / fc), "asymptote: -20 dB/decade", c[1], mode, dx=-6, dy=12, ha="right")
    ax.plot([fc], [-3.0102999566398120], "o", color=c[0], ms=8, zorder=5)
    S.label_end(ax, fc, -3.0102999566398120, "corner 995 Hz, -3.01 dB", c[0], mode, dx=10, dy=8)
    ax.plot([10 * fc], [-20 * np.log10(np.sqrt(101))], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 1.15e4, -18, "one decade past the corner: -20.04 dB,\nwhich is why the asymptote is safe to use", mode)
    ax.set_xlabel("frequency  f  (Hz)")
    ax.set_ylabel("|H|  (dB)")
    ax.set_title("The corner is where the asymptotes cross, 3 dB above the true curve")
    ax.set_ylim(-62, 10)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Three-Phase Circuits
# ---------------------------------------------------------------------------


@figure("ckt2-3ph-waveforms")
def _(mode):
    """Three phase voltages and the line-to-line voltage built from two of them.

    v_an, v_bn, v_cn are 120 degrees apart at 169.7 V peak (120 V rms); the
    line voltage v_ab = v_an - v_bn is computed point by point and matches
    sqrt(3) V_p cos(wt + 30 deg) to machine precision - so it is sqrt(3) times
    larger and peaks 30 degrees EARLIER, which is what a +30 degree phasor
    angle means on a time axis.
    """
    c = S.SERIES[mode]
    Vp = 120.0 * np.sqrt(2)
    wt = np.linspace(-np.pi / 2, 3 * np.pi / 2, 2400)
    van = Vp * np.cos(wt)
    vbn = Vp * np.cos(wt - 2 * np.pi / 3)
    vcn = Vp * np.cos(wt + 2 * np.pi / 3)
    vab = van - vbn
    assert np.allclose(vab, np.sqrt(3) * Vp * np.cos(wt + np.pi / 6), atol=1e-10)
    assert abs(vab.max() - Vp * np.sqrt(3)) < 0.02, vab.max()
    assert abs(np.degrees(wt[np.argmax(vab)]) - (-30.0)) < 0.1
    assert abs(van + vbn + vcn).max() < 1e-9, "the three do not sum to zero"
    assert abs(120.0 * np.sqrt(3) - 207.84609690826525) < 1e-9
    assert abs(Vp * np.sqrt(3) - 293.9387691339815) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(np.degrees(wt), van, color=c[0], lw=1.9)
    ax.plot(np.degrees(wt), vbn, color=c[1], lw=1.9)
    ax.plot(np.degrees(wt), vcn, color=c[2], lw=1.9)
    ax.plot(np.degrees(wt), vab, color=S.INK[mode], lw=2.4, alpha=0.9)
    S.label_end(ax, 0, Vp, "v_an", c[0], mode, dx=5, dy=-11)
    S.label_end(ax, 120, Vp, "v_bn", c[1], mode, dx=5, dy=-11)
    S.label_end(ax, 240, Vp, "v_cn", c[2], mode, dx=5, dy=-11)
    S.note(ax, -22, Vp * np.sqrt(3) + 10, "v_ab = v_an - v_bn: peak 293.9 V, reached 30 deg early", mode)
    ax.plot([-30.0], [Vp * np.sqrt(3)], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    S.note(ax, -86, -300, "at every instant the three phase voltages sum to zero", mode)
    ax.set_xlabel("phase angle  wt  (degrees)")
    ax.set_ylabel("volts")
    ax.set_title("Line voltage is sqrt(3) x phase voltage, and 30 degrees ahead")
    ax.set_xlim(-90, 320)
    ax.set_ylim(-330, 375)
    ax.set_xticks([-90, 0, 90, 180, 270])
    S.strip(ax)
    return fig


@figure("ckt2-3ph-power-constant")
def _(mode):
    """Total instantaneous power in a balanced three-phase load is constant.

    Each phase contributes v i = V_m I_m cos(wt - k) cos(wt - k - theta), which
    pulses at twice line frequency; the three summed are flat at 3 V_rms I_rms
    cos theta. The assertion checks the ripple of the sum is numerically zero,
    not merely small.
    """
    c = S.SERIES[mode]
    th = np.radians(36.86989764584402)
    wt = np.linspace(0, 2 * np.pi, 2400)
    tot = np.zeros_like(wt)
    fig, ax = plt.subplots()
    for k, col in ((0.0, c[0]), (2 * np.pi / 3, c[1]), (4 * np.pi / 3, c[2])):
        p = 2 * np.cos(wt - k) * np.cos(wt - k - th)
        tot += p
        ax.plot(np.degrees(wt), p, color=col, lw=1.6, alpha=0.85)
    assert abs(tot.max() - tot.min()) < 1e-12, "three-phase power is not flat"
    assert abs(tot.mean() - 3 * np.cos(th)) < 1e-12, tot.mean()
    assert abs(3 * np.cos(th) - 2.4) < 1e-9

    ax.plot(np.degrees(wt), tot, color=S.INK[mode], lw=2.8)
    S.note(ax, 200, 2.52, "sum = 3 V I cos(theta) = 2.40, dead flat", mode)
    S.label_end(ax, 40, 2 * np.cos(np.radians(40)) * np.cos(np.radians(40) - th),
                "phase a", c[0], mode, dy=10)
    S.label_end(ax, 160, 2 * np.cos(np.radians(160) - 2 * np.pi / 3) * np.cos(np.radians(160) - 2 * np.pi / 3 - th),
                "phase b", c[1], mode, dy=10)
    S.label_end(ax, 280, 2 * np.cos(np.radians(280) - 4 * np.pi / 3) * np.cos(np.radians(280) - 4 * np.pi / 3 - th),
                "phase c", c[2], mode, dy=10)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    S.note(ax, 6, -0.75, "each phase pulses at twice line frequency and even goes negative;\nthe three together never do", mode)
    ax.set_xlabel("phase angle  (degrees)")
    ax.set_ylabel("p(t) / (V_rms I_rms per phase)")
    ax.set_title("Constant shaft torque is a consequence of this flat line")
    ax.set_xlim(0, 400)
    ax.set_ylim(-1.1, 3.1)
    ax.set_xticks([0, 90, 180, 270, 360])
    S.strip(ax)
    return fig


@figure("ckt2-3ph-neutral")
def _(mode):
    """Neutral current in a four-wire wye as one phase load is varied.

    Phase currents are 10 A at 0, -120, +120 degrees except phase a, whose
    magnitude is swept; the neutral carries their complex sum. At perfect
    balance the sum is zero, and the growth is linear in the imbalance - the
    neutral of a 10 A system carries 2 A when one phase is 20% off.
    """
    c = S.SERIES[mode]
    Ib = 10 * np.exp(1j * np.radians(-120))
    Ic = 10 * np.exp(1j * np.radians(120))
    Ia_mag = np.linspace(0.0, 20.0, 1200)
    In = np.abs(Ia_mag + Ib + Ic)
    assert abs(np.abs(10 + Ib + Ic)) < 1e-12, "balanced neutral is not zero"
    assert abs(np.abs(12 + Ib + Ic) - 2.0) < 1e-12
    assert abs(np.abs(0 + Ib + Ic) - 10.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(Ia_mag, In, color=c[0], lw=2.6)
    ax.plot([10.0], [0.0], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 10.4, 0.35, "balanced: the neutral carries nothing", mode)
    ax.plot([12.0], [2.0], "o", color=c[1], ms=7, zorder=5)
    S.label_end(ax, 12.0, 2.0, "phase a 20% high -> 2 A in the neutral", c[1], mode, dx=10, dy=-2)
    ax.plot([0.0], [10.0], "o", color=c[1], ms=7, zorder=5)
    S.label_end(ax, 0.0, 10.0, "phase a open: neutral carries a full 10 A", c[1], mode, dx=10, dy=6)
    ax.set_xlabel("phase-a current magnitude  (A), with b and c held at 10 A")
    ax.set_ylabel("neutral current  |I_n|  (A)")
    ax.set_title("The neutral is a measure of imbalance, and only of imbalance")
    ax.set_xlim(0, 21.5)
    ax.set_ylim(0, 11.6)
    S.strip(ax)
    return fig


@figure("ckt2-3ph-phasors")
def _(mode):
    """Wye phasor diagram: three phase voltages and one line voltage.

    V_an = 120 at 0, V_bn = 120 at -120, V_cn = 120 at +120 degrees, and
    V_ab = V_an - V_bn drawn head to tail. Its computed magnitude is 207.85 V
    at +30 degrees, which is the sqrt(3) and the 30-degree lead that every
    three-phase question depends on.
    """
    c = S.SERIES[mode]
    Van = 120 * np.exp(0j)
    Vbn = 120 * np.exp(1j * np.radians(-120))
    Vcn = 120 * np.exp(1j * np.radians(120))
    Vab = Van - Vbn
    assert abs(abs(Vab) - 207.84609690826525) < 1e-9, abs(Vab)
    assert abs(np.degrees(np.angle(Vab)) - 30.0) < 1e-9

    fig, ax = plt.subplots()
    for z, col, lab, dy, ha in ((Van, c[0], "V_an = 120 at 0 deg", -14, "left"),
                                (Vbn, c[1], "V_bn = 120 at -120 deg", -12, "center"),
                                (Vcn, c[2], "V_cn = 120 at +120 deg", 10, "center")):
        ax.annotate("", xy=(z.real, z.imag), xytext=(0, 0),
                    arrowprops=dict(arrowstyle="-|>", color=col, lw=2.2, shrinkA=0, shrinkB=0))
        S.label_end(ax, z.real, z.imag, lab, col, mode, dy=dy, ha=ha)
    ax.annotate("", xy=(Vab.real, Vab.imag), xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", color=S.INK[mode], lw=2.6, shrinkA=0, shrinkB=0))
    S.note(ax, Vab.real - 6, Vab.imag + 8, "V_ab = V_an - V_bn = 207.85 V at +30 deg", mode, ha="right")
    ax.plot([Van.real, Vab.real], [Van.imag, Vab.imag], color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 182, 40, "this dashed leg is -V_bn,\nplaced head to tail on V_an", mode, ha="right")
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("real part  (V)")
    ax.set_ylabel("imaginary part  (V)")
    ax.set_title("Subtracting two phase voltages lengthens them by sqrt(3)")
    ax.set_xlim(-135, 250)
    ax.set_ylim(-150, 175)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Transient Analysis
# ---------------------------------------------------------------------------


@figure("ckt2-rc-charge")
def _(mode):
    """RC charging and discharging on one time-constant axis.

    v = V(1 - e^-t/tau) and v = V e^-t/tau, drawn against t/tau so the numbers
    the exam wants - 63.2%, 86.5%, 95.0%, 98.2%, 99.3% - are read off at the
    integer marks and are the same for every RC pair.
    """
    c = S.SERIES[mode]
    x = np.linspace(0, 5.4, 1200)
    rise = 1 - np.exp(-x)
    fall = np.exp(-x)
    marks = [(1, 0.6321205588285577), (2, 0.8646647167633873),
             (3, 0.950212931632136), (4, 0.9816843611112658),
             (5, 0.9932620530009145)]
    for n, val in marks:
        assert abs((1 - np.exp(-n)) - val) < 1e-12, (n, val)

    fig, ax = plt.subplots()
    ax.plot(x, rise, color=c[0], lw=2.6)
    ax.plot(x, fall, color=c[1], lw=2.6)
    S.label_end(ax, 4.2, 1 - np.exp(-4.2), "charging  1 - e^(-t/tau)", c[0], mode, dy=-14, ha="center")
    S.label_end(ax, 3.1, np.exp(-3.1), "discharging  e^(-t/tau)", c[1], mode, dy=12, ha="center")
    # the tangent at the origin, which meets the final value at exactly t = tau
    ax.plot([0, 1], [0, 1], color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 0.06, 0.86, "the initial tangent reaches the final value at exactly one tau", mode)
    for n, val in marks:
        ax.plot([n], [val], "o", color=c[0], ms=6, zorder=5)
        ax.plot([n], [1 - val], "o", color=c[1], ms=6, zorder=5)
    S.note(ax, 1.06, 0.55, "63.2%", mode)
    S.note(ax, 2.06, 0.80, "86.5%", mode)
    S.note(ax, 3.06, 0.90, "95.0%", mode)
    S.note(ax, 4.06, 0.955, "98.2%", mode)
    S.note(ax, 5.02, 0.30, "after 5 tau the transient is 0.7% of the way from done", mode, ha="right")
    ax.axhline(1.0, color=S.GRID[mode], lw=0.9, ls=":")
    ax.set_xlabel("elapsed time in time constants  t / tau")
    ax.set_ylabel("fraction of the final change")
    ax.set_title("One curve serves every RC and RL first-order problem")
    ax.set_xlim(0, 5.6)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("ckt2-rl-current")
def _(mode):
    """Inductor current and inductor voltage during an RL turn-on.

    For L = 250 mH, R = 50 ohm across 24 V: tau = L/R = 5 ms, the final current
    is 24/50 = 0.48 A, i(t) = 0.48(1 - e^-t/tau), and the inductor voltage is
    24 e^-t/tau. Both are normalised so the mirror symmetry is the point: the
    element that resists a current change gives up its voltage as the current
    settles.
    """
    c = S.SERIES[mode]
    L, R, V = 0.25, 50.0, 24.0
    tau = L / R
    Iinf = V / R
    assert abs(tau - 0.005) < 1e-15 and abs(Iinf - 0.48) < 1e-15
    t = np.linspace(0, 5 * tau, 1200)
    i = Iinf * (1 - np.exp(-t / tau))
    vL = V * np.exp(-t / tau)
    assert abs(Iinf * (1 - np.exp(-1)) - 0.30341786823770767) < 1e-12
    assert abs(V * np.exp(-1) - 8.829106588114616) < 1e-12
    # energy finally stored
    assert abs(0.5 * L * Iinf ** 2 - 0.0288) < 1e-15

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, i / Iinf, color=c[0], lw=2.6)
    ax.plot(t * 1e3, vL / V, color=c[1], lw=2.6)
    S.label_end(ax, 18, 1 - np.exp(-18 / (tau * 1e3)), "inductor current -> 0.48 A", c[0], mode, dy=-14, ha="center")
    S.label_end(ax, 12, np.exp(-12 / (tau * 1e3)), "inductor voltage -> 0", c[1], mode, dy=12, ha="center")
    ax.axvline(tau * 1e3, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([tau * 1e3, tau * 1e3], [1 - np.exp(-1), np.exp(-1)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 5.4, 0.60, "one tau = L/R = 5 ms:\n0.303 A flowing, 8.83 V left across the coil", mode)
    S.note(ax, 24.6, 0.06, "settled: all 24 V across R, 28.8 mJ stored in the field", mode, ha="right")
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("fraction of final value")
    ax.set_title("An inductor trades its voltage away as its current builds")
    ax.set_xlim(0, 25.4)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("ckt2-rlc-damping")
def _(mode):
    """Series RLC step response in all three damping regimes.

    Same L = 100 mH and C = 20 uF, so w0 = 707.1 rad/s throughout; R is chosen
    to give zeta = 0.25, 1.0 and 2.5. Each response is the exact closed-form
    solution the lesson derives, not a numerical integration, and the
    assertions check the overshoot against exp(-pi zeta / sqrt(1 - zeta^2)).
    """
    c = S.SERIES[mode]
    L, C = 0.10, 20e-6
    w0 = 1.0 / np.sqrt(L * C)
    assert abs(w0 - 707.1067811865474) < 1e-9, w0
    t = np.linspace(0, 0.030, 3000)

    fig, ax = plt.subplots()
    # underdamped
    z = 0.25
    wd = w0 * np.sqrt(1 - z * z)
    under = 1 - np.exp(-z * w0 * t) * (np.cos(wd * t) + z / np.sqrt(1 - z * z) * np.sin(wd * t))
    os = np.exp(-np.pi * z / np.sqrt(1 - z * z))
    assert abs(under.max() - (1 + os)) < 2e-4, (under.max(), 1 + os)
    assert abs(os - 0.4443442250884888) < 1e-9, os
    # critically damped
    crit = 1 - np.exp(-w0 * t) * (1 + w0 * t)
    assert crit.max() <= 1.0 + 1e-12, "critical response overshot"
    # overdamped
    z2 = 2.5
    s1 = -z2 * w0 + w0 * np.sqrt(z2 * z2 - 1)
    s2 = -z2 * w0 - w0 * np.sqrt(z2 * z2 - 1)
    over = 1 - (s1 * np.exp(s2 * t) - s2 * np.exp(s1 * t)) / (s1 - s2)
    assert over.max() <= 1.0 + 1e-12, "overdamped response overshot"

    ax.plot(t * 1e3, under, color=c[0], lw=2.2)
    ax.plot(t * 1e3, crit, color=c[1], lw=2.2)
    ax.plot(t * 1e3, over, color=c[2], lw=2.2)
    S.label_end(ax, 30, under[-1], "underdamped, zeta = 0.25", c[0], mode, dx=-6, dy=13, ha="right")
    S.label_end(ax, 30, crit[-1], "critically damped, zeta = 1", c[1], mode, dx=-6, dy=-2, ha="right")
    S.label_end(ax, 30, over[-1], "overdamped, zeta = 2.5", c[2], mode, dx=-6, dy=-15, ha="right")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([t[np.argmax(under)] * 1e3], [under.max()], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 6.6, 1.455, "first peak 44.4% over target,\nexactly exp(-pi zeta / sqrt(1 - zeta^2))", mode)
    S.note(ax, 12.5, 0.32, "critical damping is the fastest approach\nthat never crosses the target", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("capacitor voltage, fraction of final")
    ax.set_title("Same L and C, three resistors, three completely different answers")
    ax.set_xlim(0, 30.5)
    ax.set_ylim(0, 1.62)
    S.strip(ax)
    return fig


@figure("ckt2-ringing-envelope")
def _(mode):
    """Underdamped ringing with its exponential envelope and the ringing period.

    zeta = 0.1 on w0 = 707.1 rad/s gives w_d = 703.6 rad/s, a ringing period of
    8.930 ms and an envelope e^(-zeta w0 t) whose time constant is 14.14 ms.
    Successive overshoot peaks fall by exp(-2 pi zeta / sqrt(1 - zeta^2)) =
    0.5318, which the assertion checks against the sampled curve.
    """
    c = S.SERIES[mode]
    w0 = 707.1067811865474
    z = 0.1
    wd = w0 * np.sqrt(1 - z * z)
    Td = 2 * np.pi / wd
    assert abs(wd - 703.5623639735144) < 1e-9, wd
    assert abs(Td * 1e3 - 8.930530723238228) < 1e-9, Td * 1e3
    assert abs(1.0 / (z * w0) * 1e3 - 14.142135623730953) < 1e-9
    t = np.linspace(0, 0.050, 6000)
    y = 1 - np.exp(-z * w0 * t) * (np.cos(wd * t) + z / np.sqrt(1 - z * z) * np.sin(wd * t))
    env_hi = 1 + np.exp(-z * w0 * t) / np.sqrt(1 - z * z)
    env_lo = 1 - np.exp(-z * w0 * t) / np.sqrt(1 - z * z)
    decay = np.exp(-2 * np.pi * z / np.sqrt(1 - z * z))
    assert abs(decay - 0.5318020829442597) < 1e-9, decay
    p1 = y.max() - 1
    i2 = np.argmax(y[t > Td]) + np.searchsorted(t, Td)
    p2 = y[i2] - 1
    assert abs(p2 / p1 - decay) < 2e-3, (p2 / p1, decay)

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, y, color=c[0], lw=2.2)
    ax.plot(t * 1e3, env_hi, color=c[1], lw=1.5, ls="--")
    ax.plot(t * 1e3, env_lo, color=c[1], lw=1.5, ls="--")
    S.label_end(ax, 34, 1 + np.exp(-z * w0 * 0.034) / np.sqrt(1 - z * z),
                "envelope e^(-zeta w0 t), tau = 14.1 ms", c[1], mode, dy=10, ha="center")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    t1 = t[np.argmax(y)] * 1e3
    ax.plot([t1, t[i2] * 1e3], [y.max(), y[i2]], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.annotate("", xy=(t[i2] * 1e3, 1.86), xytext=(t1, 1.86),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, (t1 + t[i2] * 1e3) / 2, 1.89, "one ring: Td = 8.93 ms", mode, ha="center")
    S.note(ax, 20.5, 0.28, "each peak is 53.2% of the one before -\nmeasuring that ratio is how zeta is found from a scope trace", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("fraction of final value")
    ax.set_title("Lightly damped: zeta = 0.1 rings for five cycles")
    ax.set_xlim(0, 50.5)
    ax.set_ylim(0, 2.15)
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
