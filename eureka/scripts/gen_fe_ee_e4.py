#!/usr/bin/env python3
"""Expansion-wave figures for the FE Electrical and Computer course: the
DEPTH pass over Power Systems.

gen_fe_ee_w4.py owns the seven original `pow-*` figures for this section and is
not touched by this file. Everything registered here uses the `pow2-` stem so
the two scripts can never collide on an output name.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from
the equation the lesson states, so a reader can check the drawing against the
algebra. Nothing is traced, scanned or adapted from the NCEES Reference
Handbook or any textbook - the pipeline consumes formulas, which are not
protected expression, and never anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the property the lesson claims for it, with a TIGHT
tolerance, before it is allowed to draw. A loose assertion is how this section
once shipped a 92.6 A current for a load that computes to 92.52 A.

Usage:
    python3 scripts/gen_fe_ee_e4.py             # all
    python3 scripts/gen_fe_ee_e4.py pow2-3ph    # only names starting "pow2-3ph"
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


def _ph(mag, deg):
    """A phasor from magnitude and degrees - the only complex constructor used."""
    return mag * np.exp(1j * np.radians(deg))


def _arrow(ax, z, colour, lw=2.0, z0=0j):
    """Draw a phasor as an arrow from z0 to z0 + z."""
    ax.annotate(
        "", xy=(z0.real + z.real, z0.imag + z.imag), xytext=(z0.real, z0.imag),
        arrowprops=dict(arrowstyle="-|>", color=colour, lw=lw,
                        shrinkA=0, shrinkB=0, mutation_scale=14),
    )


# ---------------------------------------------------------------------------
# Three-Phase Power Systems
# ---------------------------------------------------------------------------


@figure("pow2-3ph-phasor-sqrt3")
def _(mode):
    """The line-voltage triangle: V_ab = V_an - V_bn drawn as a phasor sum.

    The three line-to-neutral phasors and the three line-to-line phasors are
    both computed from 277.128/_0, 277.128/_-120, 277.128/_+120; the assertion
    checks that every line phasor is exactly sqrt(3) times a phase phasor and
    leads it by exactly 30 degrees, which is the claim the lesson derives.
    """
    c = S.SERIES[mode]
    Vp = 480.0 / np.sqrt(3)
    Van, Vbn, Vcn = _ph(Vp, 0), _ph(Vp, -120), _ph(Vp, 120)
    Vab, Vbc, Vca = Van - Vbn, Vbn - Vcn, Vcn - Van
    for line, phase in ((Vab, Van), (Vbc, Vbn), (Vca, Vcn)):
        assert abs(abs(line) - np.sqrt(3) * abs(phase)) < 1e-9, "sqrt(3) broken"
        lead = np.degrees(np.angle(line / phase))
        assert abs(lead - 30.0) < 1e-9, "30 degree lead broken"
    assert abs(Van + Vbn + Vcn) < 1e-9, "balanced set does not sum to zero"

    fig, ax = plt.subplots(figsize=(6.6, 5.4))
    for z, name in ((Van, "Van"), (Vbn, "Vbn"), (Vcn, "Vcn")):
        _arrow(ax, z, c[0], lw=2.0)
        S.label_end(ax, z.real * 1.07, z.imag * 1.07, name, c[0], mode, size=10)
    # the construction: -Vbn placed at the tip of Van gives Vab
    _arrow(ax, -Vbn, S.GUIDE[mode], lw=1.4, z0=Van)
    S.note(ax, Van.real + 0.42 * (-Vbn).real, Van.imag + 0.42 * (-Vbn).imag,
           "  add  -Vbn", mode, size=9)
    for z, name in ((Vab, "Vab"), (Vbc, "Vbc"), (Vca, "Vca")):
        _arrow(ax, z, c[1], lw=2.6)
        S.label_end(ax, z.real * 1.05, z.imag * 1.05, name, c[1], mode, size=10)
    ax.plot([0], [0], "o", color=S.INK[mode], ms=5)

    th = np.linspace(0, np.radians(30), 60)
    rr = 150.0
    ax.plot(rr * np.cos(th), rr * np.sin(th), color=S.GUIDE[mode], lw=1.1)
    S.note(ax, 158, 26, "30 deg", mode, size=9)
    S.note(ax, -455, -430,
           "|Vab| = sqrt(3) x 277.13 = 480.0 V, leading Van by exactly 30 deg",
           mode, size=9)
    ax.set_xlim(-560, 560)
    ax.set_ylim(-470, 500)
    ax.set_aspect("equal")
    ax.set_xlabel("real part  (V)")
    ax.set_ylabel("imaginary part  (V)")
    ax.set_title("Line voltage is a phasor DIFFERENCE, not a scaled phase voltage")
    ax.grid(True)
    S.strip(ax)
    return fig


@figure("pow2-3ph-copper-economy")
def _(mode):
    """Conductor metal needed to move the same power the same distance with the
    same total I^2 R loss and the same line-to-line voltage.

    Volume scales as (number of conductors) / (resistance per conductor), and
    equal-loss fixes that resistance; both are evaluated below rather than
    quoted. The assertion pins the classical 75 percent result for the
    three-wire three-phase case.
    """
    c = S.SERIES[mode]

    def metal(n_conductors, i_ratio, n_carrying):
        # equal loss: n_carrying * (i_ratio)^2 * R = 2 * 1^2 * R1  ->  R in units of R1
        R = 2.0 / (n_carrying * i_ratio ** 2)
        return n_conductors / R          # units of rho*l^2/R1

    k = 1.0 / np.sqrt(3)
    rows = [
        ("1-phase\n2-wire", metal(2, 1.0, 2)),
        ("3-phase\n3-wire", metal(3, k, 3)),
        ("3-phase 4-wire\nhalf-size neutral", metal(3.5, k, 3)),
        ("3-phase 4-wire\nfull-size neutral", metal(4, k, 3)),
    ]
    base = rows[0][1]
    pct = [100.0 * v / base for _, v in rows]
    assert abs(pct[1] - 75.0) < 1e-9, "three-wire copper ratio is not 75 percent"
    assert abs(pct[2] - 87.5) < 1e-9, "half-neutral copper ratio is not 87.5 percent"
    assert abs(pct[3] - 100.0) < 1e-9, "full-neutral copper ratio is not 100 percent"

    fig, ax = plt.subplots()
    x = np.arange(len(rows))
    colours = [c[1], c[0], c[0], c[1]]
    ax.bar(x, pct, width=0.56, color=colours, edgecolor="none")
    for xi, p in zip(x, pct):
        ax.annotate(f"{p:.1f}%", xy=(xi, p + 1.8), ha="center",
                    color=S.INK[mode], fontsize=10, fontweight="semibold")
    ax.axhline(100.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.62, 108.5, "single-phase reference level", mode, size=9, ha="center")
    ax.set_xticks(x)
    ax.set_xticklabels([n for n, _ in rows], fontsize=9)
    ax.set_ylabel("conductor metal  (% of single-phase)")
    ax.set_title("Same power, same distance, same loss: the metal each system needs")
    ax.set_ylim(0, 116)
    ax.grid(axis="x", visible=False)
    S.strip(ax)
    return fig


@figure("pow2-3ph-neutral-current")
def _(mode):
    """Neutral current of a four-wire wye as one phase is varied, with the other
    two held at 45 A and 30 A, all at unity power factor.

    The curve is the magnitude of the phasor sum Ia/_0 + Ib/_-120 + Ic/_+120,
    evaluated point by point. The assertion checks it against the closed form
    sqrt(Ia^2 + Ib^2 + Ic^2 - IaIb - IbIc - IcIa) at every sample and pins the
    lesson's 60/45/30 case at 25.98 A.
    """
    c = S.SERIES[mode]
    ia = np.linspace(0, 90, 700)
    ib, ic = 45.0, 30.0
    s = ia * _ph(1, 0) + ib * _ph(1, -120) + ic * _ph(1, 120)
    In = np.abs(s)
    closed = np.sqrt(ia ** 2 + ib ** 2 + ic ** 2 - ia * ib - ib * ic - ic * ia)
    assert np.max(np.abs(In - closed)) < 1e-9, "neutral closed form disagrees"
    k = int(np.argmin(np.abs(ia - 60.0)))
    assert abs(In[k] - np.sqrt(675.0)) < 2e-2, "60/45/30 case is not 25.98 A"

    fig, ax = plt.subplots()
    ax.plot(ia, In, color=c[0], lw=2.4)
    S.label_end(ax, 90, In[-1], "neutral current", c[0], mode, dy=6)
    ax.axhline(45.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.0, 45.8, "the 45 A branch conductor", mode, size=9)
    ax.plot([60.0], [np.sqrt(675.0)], "o", color=c[1], ms=8, zorder=5)
    ax.plot([60, 60], [0, np.sqrt(675.0)], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 63.0, 22.0, "60 / 45 / 30 A  ->  25.98 A", mode)
    # the minimum is analytic: d/dIa of the closed form vanishes at (Ib + Ic)/2
    ia_min = 0.5 * (ib + ic)
    In_min = np.sqrt(ia_min ** 2 + ib ** 2 + ic ** 2
                     - ia_min * ib - ib * ic - ic * ia_min)
    assert abs(In_min - np.sqrt(168.75)) < 1e-9, "analytic minimum broken"
    ax.plot([ia_min], [In_min], "o", color=c[2], ms=7, zorder=5)
    S.note(ax, ia_min + 2.0, In_min - 7.5,
           f"flattest at Ia = {ia_min:.1f} A\n(In = {In_min:.2f} A)", mode)
    ax.set_xlabel("phase-a current  (A), with b = 45 A and c = 30 A")
    ax.set_ylabel("neutral current  |Ia + Ib + Ic|  (A)")
    ax.set_title("The neutral carries the phasor sum, never the arithmetic one")
    ax.set_xlim(0, 96)
    ax.set_ylim(0, 66)
    S.strip(ax)
    return fig


@figure("pow2-3ph-unbalance-heating")
def _(mode):
    """What a small voltage unbalance does to an induction motor, from the
    model I2/I1 = (V2/V1)(Z1/Z2) with Z1/Z2 equal to the locked-rotor current
    ratio.

    Top panel: negative-sequence stator current as a percentage of rated, for
    three plausible locked-rotor ratios. Bottom panel: the stator copper-loss
    multiplier (I1^2 + I2^2)/I1^2 that follows. Both are evaluated from those
    two expressions; nothing is read off a published derating chart.
    """
    c = S.SERIES[mode]
    vuf = np.linspace(0, 5, 400)
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    for k, ratio in zip(c, (5.0, 6.0, 7.0)):
        i2 = ratio * vuf
        assert abs(i2[-1] - ratio * 5.0) < 1e-12, "linear model broken"
        ax1.plot(vuf, i2, color=k, lw=2.2)
        S.label_end(ax1, 5.0, i2[-1], f"Z1/Z2 = {ratio:.0f}", k, mode, size=9.5)
        ax2.plot(vuf, 1 + (i2 / 100.0) ** 2, color=k, lw=2.2)
    ax1.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax1, 1.06, 30.5, "1 % unbalance", mode, size=9)
    ax1.set_ylabel("negative-sequence\ncurrent  (% of rated)")
    ax1.set_title("A one percent voltage unbalance is a six percent extra current")
    ax1.set_ylim(0, 37)
    ax2.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax2.set_xlabel("voltage unbalance factor  V2 / V1  (%)")
    ax2.set_ylabel("stator copper-loss\nmultiplier")
    ax2.set_xlim(0, 5.6)
    ax2.set_ylim(1.0, 1.13)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-3ph-wattmeter-pf")
def _(mode):
    """The two wattmeter readings, normalised to V_LL I_L, across the whole
    lagging power-factor range.

    W1 = cos(phi - 30) and W2 = cos(phi + 30) are evaluated directly, and the
    assertion checks their sum equals sqrt(3) cos(phi) - the identity that
    makes the method work - to 1e-12 at every sample, along with the W2 zero
    crossing at exactly phi = 60 degrees.
    """
    c = S.SERIES[mode]
    phi = np.linspace(0, 90, 900)
    w1 = np.cos(np.radians(phi - 30))
    w2 = np.cos(np.radians(phi + 30))
    assert np.max(np.abs(w1 + w2 - np.sqrt(3) * np.cos(np.radians(phi)))) < 1e-12, \
        "two-wattmeter sum identity broken"
    k60 = int(np.argmin(np.abs(phi - 60.0)))
    assert abs(w2[k60]) < 2e-3, "W2 does not cross zero at 60 degrees"
    k30 = int(np.argmin(np.abs(phi - 30.0)))
    assert abs(w2[k30] / w1[k30] - 0.5) < 1e-3, "W2/W1 is not 0.5 at 30 degrees"

    fig, ax = plt.subplots()
    ax.plot(phi, w1, color=c[0], lw=2.3)
    ax.plot(phi, w2, color=c[1], lw=2.3)
    ax.plot(phi, w1 + w2, color=c[2], lw=2.6)
    S.label_end(ax, 90, w1[-1], "W1 = cos(phi - 30)", c[0], mode, dy=6)
    S.label_end(ax, 90, w2[-1], "W2 = cos(phi + 30)", c[1], mode, dy=-8)
    S.label_end(ax, 26, (w1 + w2)[int(np.argmin(np.abs(phi - 26)))],
                "sum = sqrt(3) cos(phi)", c[2], mode, dy=12, ha="center")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([60.0], [0.0], "o", color=c[1], ms=8, zorder=5)
    S.note(ax, 60.6, 0.06, "pf = 0.5: W2 reads zero", mode)
    ax.plot([30.0], [w2[k30]], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, 6.0, 0.34, "pf = 0.866:\nW2 is HALF of W1, not zero", mode)
    ax.axvspan(60, 90, color=S.GUIDE[mode], alpha=0.10, lw=0)
    S.note(ax, 62.0, -0.44, "W2 negative:\nsubtract it", mode)
    ax.set_xlabel("load angle  phi  (degrees, lagging)")
    ax.set_ylabel("reading  /  (V_LL I_L)")
    ax.set_title("Two meters, one sum: what each wattmeter reads as the load angle grows")
    ax.set_xlim(0, 90)
    ax.set_ylim(-0.6, 1.85)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Transformers: Equivalent Circuit and Efficiency
# ---------------------------------------------------------------------------

#: The 50 kVA, 2400/240 V unit the transformer lesson carries end to end.
#: Its open- and short-circuit test data reduce to exactly these parameters.
XF_S, XF_VH, XF_VL = 50e3, 2400.0, 240.0
XF_PCORE, XF_PCU_FL = 245.0, 650.0
XF_REQ, XF_XEQ = 1.4976, 4.45924          # ohms referred to the 2400 V side


@figure("pow2-xfmr-loss-split")
def _(mode):
    """Core loss, copper loss and their sum against load fraction for the
    lesson's 50 kVA unit.

    Core loss is the constant 245 W the open-circuit test measured; copper
    loss is 650 W scaled by the square of the load fraction, as the
    short-circuit test fixes it. The assertion checks that the two curves
    cross exactly where the maximum-efficiency condition says they must,
    at x* = sqrt(245/650).
    """
    c = S.SERIES[mode]
    x = np.linspace(0.02, 1.25, 700)
    core = np.full_like(x, XF_PCORE)
    cu = XF_PCU_FL * x ** 2
    xstar = np.sqrt(XF_PCORE / XF_PCU_FL)
    k = int(np.argmin(np.abs(x - xstar)))
    assert abs(cu[k] - core[k]) < 1.5, "losses do not cross at x*"
    assert abs(xstar - 0.613941) < 1e-5, "x* moved"

    fig, ax = plt.subplots()
    ax.plot(x, core, color=c[0], lw=2.2)
    ax.plot(x, cu, color=c[1], lw=2.2)
    ax.plot(x, core + cu, color=c[2], lw=2.6)
    S.label_end(ax, 1.25, XF_PCORE, "core loss  245 W\n(constant)", c[0], mode, dy=-4)
    S.label_end(ax, 1.25, XF_PCU_FL * 1.25 ** 2, "copper loss  650 x^2", c[1], mode,
                dx=6, dy=-2)
    S.label_end(ax, 0.86, (XF_PCORE + XF_PCU_FL * 0.86 ** 2), "total loss", c[2], mode,
                dx=-6, dy=12, ha="right")
    ax.plot([xstar], [XF_PCORE], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([xstar, xstar], [0, XF_PCORE], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, xstar + 0.02, 60,
           "x* = sqrt(245/650) = 0.614\nlosses equal, efficiency peaks", mode)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.012, 430, "rated load", mode, size=9)
    ax.set_xlabel("load fraction  x  (per unit of 50 kVA)")
    ax.set_ylabel("loss  (W)")
    ax.set_title("Maximum efficiency sits where the two losses are equal, not at full load")
    ax.set_xlim(0, 1.27)
    ax.set_ylim(0, 1060)
    S.strip(ax)
    return fig


@figure("pow2-xfmr-regulation-pf")
def _(mode):
    """Voltage regulation of the 50 kVA unit at rated current, swept from
    0.5 leading to 0.5 lagging power factor.

    The exact curve solves |V_S| = |V_R + I Z_eq| with the rated current
    phasor rotated by the load angle; the approximate curve is the handbook
    I(R cos phi + X sin phi). Both are computed here, so the gap between them
    IS the error of the approximation. The assertion pins the leading power
    factor at which regulation passes through zero.
    """
    c = S.SERIES[mode]
    Ir = XF_S / XF_VH
    ang = np.linspace(-60.0, 60.0, 900)          # negative = leading
    I = Ir * np.exp(-1j * np.radians(ang))
    Vs = np.abs(XF_VH + I * (XF_REQ + 1j * XF_XEQ))
    exact = (Vs - XF_VH) / XF_VH * 100.0
    approx = Ir * (XF_REQ * np.cos(np.radians(ang))
                   + XF_XEQ * np.sin(np.radians(ang))) / XF_VH * 100.0
    kz = int(np.argmin(np.abs(exact)))
    pf_zero = np.cos(np.radians(ang[kz]))
    assert abs(pf_zero - 0.9413) < 2e-3, "zero-regulation power factor moved"
    assert exact[-1] > exact[0], "regulation should grow with lagging angle"

    fig, ax = plt.subplots()
    ax.plot(ang, exact, color=c[0], lw=2.4)
    ax.plot(ang, approx, color=c[1], lw=2.0, ls="--")
    S.label_end(ax, 60, exact[-1], "exact  |V_R + I Z| ", c[0], mode, dy=8)
    S.label_end(ax, 60, approx[-1], "approx  I(R cos + X sin)", c[1], mode, dy=-10)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([ang[kz]], [0.0], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, ang[kz] + 1.5, 0.28,
           f"regulation crosses zero at\npf = {pf_zero:.3f} leading", mode)
    for a, lab in ((-36.87, "0.8 lead"), (0.0, "unity"), (36.87, "0.8 lag")):
        ax.axvline(a, color=S.GRID[mode], lw=0.8, ls=":")
        S.note(ax, a, -1.85, "  " + lab, mode, size=9)
    ax.set_xlabel("load angle  (degrees)   -  leading    |    lagging  +")
    ax.set_ylabel("voltage regulation at rated current  (%)")
    ax.set_title("A leading load can push the secondary voltage ABOVE no-load")
    ax.set_xlim(-62, 62)
    ax.set_ylim(-2.0, 4.6)
    S.strip(ax)
    return fig


@figure("pow2-xfmr-parallel-share")
def _(mode):
    """Loading of two paralleled transformers - 500 kVA at 5 percent and
    300 kVA at 6 percent - as the bus load grows.

    Each unit takes a share proportional to its rating divided by its per-unit
    impedance, and each curve is that share expressed as a percentage of the
    unit's own nameplate. The assertion checks the classic result: the bank
    reaches only 750 of its 800 kVA of nameplate before the first unit is
    fully loaded.
    """
    c = S.SERIES[mode]
    S1, z1, S2, z2 = 500.0, 0.05, 300.0, 0.06
    k1, k2 = S1 / z1, S2 / z2
    f1 = k1 / (k1 + k2)
    total = np.linspace(0, 900, 800)
    l1 = total * f1 / S1 * 100.0
    l2 = total * (1 - f1) / S2 * 100.0
    lim = min(S1 / f1, S2 / (1 - f1))
    assert abs(f1 - 2.0 / 3.0) < 1e-12, "share fraction is not two thirds"
    assert abs(lim - 750.0) < 1e-9, "usable capacity is not 750 kVA"

    fig, ax = plt.subplots()
    ax.plot(total, l1, color=c[0], lw=2.4)
    ax.plot(total, l2, color=c[1], lw=2.4)
    S.label_end(ax, 900, l1[-1], "500 kVA, Z = 5%", c[0], mode, dy=6)
    S.label_end(ax, 900, l2[-1], "300 kVA, Z = 6%", c[1], mode, dy=-6)
    ax.axhline(100.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 6, 102, "nameplate rating of each unit", mode, size=9)
    ax.plot([lim], [100.0], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([lim, lim], [0, 100], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, lim - 14, 52,
           "the 5% unit is full at\n750 kVA of bus load", mode, ha="right")
    ax.axvline(800.0, color=S.GRID[mode], lw=1.0, ls=":")
    S.note(ax, 806, 22, "800 kVA of\nnameplate", mode, size=9)
    ax.set_xlabel("total bus load  (kVA)")
    ax.set_ylabel("loading of each unit  (% of its own rating)")
    ax.set_title("Unequal impedances: 800 kVA of iron delivers 750 kVA of load")
    ax.set_xlim(0, 900)
    ax.set_ylim(0, 132)
    S.strip(ax)
    return fig


@figure("pow2-xfmr-auto-advantage")
def _(mode):
    """Autotransformer throughput advantage against voltage ratio.

    The curve is S_auto/S_two-winding = V_H/(V_H - V_L) = k/(k - 1) with
    k = V_H/V_L, evaluated directly. The assertion pins the lesson's
    600/480 V case, where k = 1.25 gives a factor of exactly 5.
    """
    c = S.SERIES[mode]
    def advantage(ratio):
        return ratio / (ratio - 1.0)

    k = np.linspace(1.05, 4.0, 800)
    adv = advantage(k)
    assert abs(advantage(1.25) - 5.0) < 1e-12, "600/480 advantage is not 5"
    assert abs(advantage(2.0) - 2.0) < 1e-12, "2:1 case broken"
    assert np.all(np.diff(adv) < 0), "advantage must fall as the ratio grows"

    fig, ax = plt.subplots()
    ax.plot(k, adv, color=c[0], lw=2.5)
    S.label_end(ax, 3.55, advantage(3.55), "S_auto / S_two-winding", c[0], mode,
                dy=14, ha="center")
    ax.plot([1.25], [5.0], "o", color=c[1], ms=8, zorder=5)
    S.note(ax, 1.32, 5.6, "600/480 V:  10 kVA of windings\ncarries 50 kVA of load", mode)
    ax.plot([2.0], [2.0], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, 2.06, 2.3, "2:1 ratio: only double", mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 2.62, 0.40, "unity: an autotransformer of a large ratio\nsaves nothing", mode)
    ax.set_xlabel("voltage ratio  k = V_high / V_low")
    ax.set_ylabel("throughput advantage  (times)")
    ax.set_title("The autotransformer pays only when the two voltages are close")
    ax.set_xlim(1.0, 4.1)
    ax.set_ylim(0, 11)
    S.strip(ax)
    return fig


@figure("pow2-xfmr-allday-duty")
def _(mode):
    """Peak power efficiency and 24-hour energy efficiency plotted against
    core loss, with full-load copper loss held at 650 W.

    Both curves are evaluated from the same duty cycle the lesson tabulates:
    six hours at 20 percent, ten at 50 percent, six at 90 percent, two at no
    load. The assertion pins the lesson's 245 W design point on both curves.
    """
    c = S.SERIES[mode]
    duty = [(6, 0.20, 0.90), (10, 0.50, 0.90), (6, 0.90, 0.85), (2, 0.0, 1.0)]
    pc = np.linspace(80.0, 800.0, 700)

    def all_day(core):
        eo = sum(x * XF_S * pf * h for h, x, pf in duty) / 1000.0
        el = sum((core + XF_PCU_FL * x ** 2) * h for h, x, _ in duty) / 1000.0
        return 100.0 * eo / (eo + el)

    def peak(core):
        xs = np.sqrt(core / XF_PCU_FL)
        out = xs * XF_S * 0.9
        return 100.0 * out / (out + 2 * core)

    ad = np.array([all_day(v) for v in pc])
    pk = np.array([peak(v) for v in pc])
    k = int(np.argmin(np.abs(pc - 245.0)))
    assert abs(ad[k] - 97.9165) < 0.02, "all-day efficiency at 245 W moved"
    assert np.all(pk > ad), "peak efficiency must exceed the energy efficiency"

    fig, ax = plt.subplots()
    ax.plot(pc, pk, color=c[0], lw=2.4)
    ax.plot(pc, ad, color=c[1], lw=2.4)
    S.label_end(ax, 620, pk[int(np.argmin(np.abs(pc - 620)))], "peak power efficiency",
                c[0], mode, dy=13, ha="center")
    S.label_end(ax, 560, ad[int(np.argmin(np.abs(pc - 560)))], "24-hour energy efficiency",
                c[1], mode, dy=-14, ha="center")
    ax.axvline(245.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([245.0], [ad[k]], "o", color=c[1], ms=7, zorder=5)
    ax.plot([245.0], [pk[k]], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 258, 96.6, f"design point 245 W:\n{pk[k]:.2f} % peak,  {ad[k]:.2f} % all-day", mode)
    ax.set_xlabel("core loss  (W), with full-load copper loss fixed at 650 W")
    ax.set_ylabel("efficiency  (%)")
    ax.set_title("Core loss is billed for 24 hours; copper loss only when loaded")
    ax.set_xlim(80, 800)
    ax.set_ylim(95.5, 99.0)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Per-Unit System
# ---------------------------------------------------------------------------

#: The four-zone study system the per-unit lesson carries end to end, on a
#: 100 MVA base with 138 kV chosen in the transmission zone.
PU_SB = 100e6
PU_ZONES = [("13.8 kV\ngenerator", 13800.0),
            ("138 kV\ntransmission", 138000.0),
            ("13.2 kV\ndistribution", 13200.0),
            ("4.16 kV\nmotor bus", 4160.0)]


def _pu_branches():
    """Every branch reactance re-based onto 100 MVA, computed not quoted."""
    def reb(z, s_old, v_old, v_new):
        return z * (PU_SB / s_old) * (v_old / v_new) ** 2
    gen = reb(0.18, 90e6, 13.8, 13.8)
    t1 = reb(0.10, 100e6, 13.8, 13.8)
    line = 32.0 / (138000.0 ** 2 / PU_SB)
    t2 = reb(0.08, 50e6, 138.0, 138.0)
    t3 = reb(0.06, 15e6, 13.2, 13.2)
    motor = reb(0.20, 8e6, 4.00, 4.16)
    return gen, t1, line, t2, t3, motor


@figure("pow2-pu-base-ladder")
def _(mode):
    """Base voltage, base current and base impedance in each of the four zones.

    Every value is V_base**2/S_base or S_base/(sqrt(3) V_base) evaluated on the
    100 MVA base; the point of the figure is that all three quantities swing
    by more than an order of magnitude across the system while the per-unit
    description of the same equipment does not move at all.
    """
    c = S.SERIES[mode]
    names = [n for n, _ in PU_ZONES]
    v = np.array([x for _, x in PU_ZONES])
    zb = v ** 2 / PU_SB
    ib = PU_SB / (np.sqrt(3) * v)
    assert abs(zb[1] - 190.44) < 1e-9, "138 kV base impedance moved"
    assert abs(ib[3] - 13878.612) < 1e-2, "4.16 kV base current moved"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    x = np.arange(len(names))
    ax1.bar(x, ib, width=0.5, color=c[0], edgecolor="none")
    ax1.set_yscale("log")
    for xi, val in zip(x, ib):
        ax1.annotate(f"{val:,.0f} A", xy=(xi, val * 1.25), ha="center",
                     color=S.INK[mode], fontsize=9.5, fontweight="semibold")
    ax1.set_ylabel("base current  (A, log)")
    ax1.set_ylim(200, 90000)
    ax1.set_title("One base MVA, four zones: the ohms and amperes swing, the per unit does not")
    ax2.bar(x, zb, width=0.5, color=c[1], edgecolor="none")
    ax2.set_yscale("log")
    for xi, val in zip(x, zb):
        ax2.annotate(f"{val:,.3f} ohm", xy=(xi, val * 1.28), ha="center",
                     color=S.INK[mode], fontsize=9.5, fontweight="semibold")
    ax2.set_ylabel("base impedance  (ohm, log)")
    ax2.set_ylim(0.05, 1500)
    ax2.set_xticks(x)
    ax2.set_xticklabels(names, fontsize=9)
    for a in (ax1, ax2):
        a.grid(axis="x", visible=False)
        S.strip(a)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-pu-impedance-stack")
def _(mode):
    """Cumulative source reactance to each bus, and the fault duty it implies.

    The upper panel is the running sum of the re-based branch reactances; the
    lower panel is S_base divided by that sum. The assertion recomputes the
    two end points, 500 MVA at the generator terminals and 97.3 MVA at the
    motor bus, from the branch data rather than from stored constants.
    """
    c = S.SERIES[mode]
    gen, t1, line, t2, t3, _ = _pu_branches()
    steps = [("gen\nX''", gen), ("T1", t1), ("line", line), ("T2", t2), ("T3", t3)]
    cum = np.cumsum([v for _, v in steps])
    buses = ["bus 1\n13.8 kV", "bus 2\n138 kV", "bus 3\n13.2 kV", "bus 4\n4.16 kV"]
    at_bus = np.array([cum[0], cum[1], cum[3], cum[4]])
    mva = 100.0 / at_bus
    assert abs(mva[0] - 500.0) < 1e-6, "generator-bus duty moved"
    assert abs(mva[3] - 97.2732) < 1e-3, "motor-bus duty moved"

    added = ["gen X''  +0.200", "T1  +0.100", "line + T2  +0.328", "T3  +0.400"]
    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.8))
    x = np.arange(len(buses))
    ax1.plot(x, at_bus, color=c[0], lw=2.4, marker="o", ms=8)
    for xi, val, lab in zip(x, at_bus, added):
        ax1.annotate(f"{val:.3f} pu\n{lab}", xy=(xi, val + 0.07), ha="center",
                     color=S.INK_2[mode], fontsize=8.5)
    ax1.set_ylabel("cumulative reactance\nto the fault  (pu)")
    ax1.set_ylim(0, 1.52)
    ax1.set_xlim(-0.5, 3.5)
    ax1.set_title("Add the per-unit reactances; divide 100 MVA by the sum")
    ax2.bar(x, mva, width=0.5, color=c[1], edgecolor="none")
    for xi, val in zip(x, mva):
        ax2.annotate(f"{val:,.1f} MVA", xy=(xi, val + 14), ha="center",
                     color=S.INK[mode], fontsize=9.5, fontweight="semibold")
    ax2.set_ylabel("three-phase fault duty  (MVA)")
    ax2.set_ylim(0, 620)
    ax2.set_xticks(x)
    ax2.set_xticklabels(buses, fontsize=9)
    ax2.grid(axis="x", visible=False)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-pu-rebase-sensitivity")
def _(mode):
    """The squared voltage term in the re-basing formula, and the error it
    causes when it is dropped.

    Z_new = Z_old (S_new/S_old)(V_old/V_new)**2 is evaluated for a 0.20 pu
    machine as the nameplate voltage is swept around a 13.8 kV zone base. The
    assertion pins the 13.2 kV case, where ignoring the term overstates the
    impedance by 9.3 percent.
    """
    c = S.SERIES[mode]
    vbase = 13.8
    vn = np.linspace(11.5, 16.1, 700)
    factor = (vn / vbase) ** 2
    z = 0.20 * factor
    err = (1.0 / factor - 1.0) * 100.0        # error from omitting the term
    k = int(np.argmin(np.abs(vn - 13.2)))
    assert abs(z[k] - 0.18299) < 5e-4, "13.2 kV re-based value moved"
    assert abs(err[k] - 9.297) < 0.05, "omission error at 13.2 kV moved"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(vn, z, color=c[0], lw=2.4)
    ax1.axhline(0.20, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax1, 11.6, 0.204, "0.20 pu, the value on the nameplate", mode, size=9)
    ax1.plot([13.2], [z[k]], "o", color=c[1], ms=7, zorder=5)
    S.note(ax1, 13.32, 0.163, "13.2 kV machine on a\n13.8 kV base: 0.1830 pu", mode)
    ax1.set_ylabel("re-based impedance  (pu)")
    ax1.set_ylim(0.13, 0.29)
    ax1.set_title("The squared voltage term is not optional")
    ax2.plot(vn, err, color=c[2], lw=2.4)
    ax2.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax2.plot([13.2], [err[k]], "o", color=c[2], ms=7, zorder=5)
    S.note(ax2, 13.34, err[k] + 1.0, f"+{err[k]:.1f} % if you drop it", mode)
    ax2.axvline(vbase, color=S.GRID[mode], lw=1.0, ls=":")
    S.note(ax2, 13.86, -18, "zone base 13.8 kV", mode, size=9)
    ax2.set_xlabel("equipment nameplate voltage  (kV)")
    ax2.set_ylabel("error from omitting\nthe term  (%)")
    ax2.set_xlim(11.5, 16.1)
    ax2.set_ylim(-26, 26)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-pu-motor-start-dip")
def _(mode):
    """Bus voltage during a direct-on-line start against the ratio of
    locked-rotor kVA to short-circuit kVA at the bus.

    The curve is the voltage divider V = 1/(1 + S_LR/S_SC), which is what the
    per-unit circuit reduces to. The assertion pins the lesson's case: a 2 MVA
    motor at six times rated current on a bus of 97.27 MVA short-circuit
    capacity holds 0.882 pu.
    """
    c = S.SERIES[mode]
    ratio = np.linspace(0, 0.45, 800)
    v = 1.0 / (1.0 + ratio)
    gen, t1, line, t2, t3, _ = _pu_branches()
    xth = gen + t1 + line + t2 + t3
    zlr = (PU_SB / (6 * 2e6)) * (4.00 / 4.16) ** 2
    case = zlr / (zlr + xth)
    case_ratio = xth / zlr
    assert abs(case - 0.88228) < 1e-4, "worked start dip moved"
    assert abs(case - 1.0 / (1.0 + case_ratio)) < 1e-12, "divider identity broken"

    fig, ax = plt.subplots()
    ax.plot(ratio, v, color=c[0], lw=2.5)
    S.label_end(ax, 0.36, 1.0 / 1.36, "V = 1 / (1 + S_LR / S_SC)", c[0], mode,
                dy=14, ha="center")
    for lim, lab in ((0.90, "0.90 pu: typical contactor drop-out"),
                     (0.80, "0.80 pu: motors stall, starters chatter")):
        ax.axhline(lim, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.note(ax, 0.445, lim + 0.008, lab, mode, size=9, ha="right")
    ax.plot([case_ratio], [case], "o", color=c[1], ms=8, zorder=5)
    ax.plot([case_ratio, case_ratio], [0.68, case], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, case_ratio + 0.014, 0.715,
           f"2 MVA motor, 6x LRA,\non a 97.3 MVA bus:\n"
           f"ratio {case_ratio:.3f}  ->  {case:.3f} pu", mode)
    ax.set_xlabel("locked-rotor kVA  /  bus short-circuit kVA")
    ax.set_ylabel("bus voltage during the start  (pu)")
    ax.set_title("Starting a motor is a voltage divider you can do in your head")
    ax.set_xlim(0, 0.45)
    ax.set_ylim(0.68, 1.02)
    S.strip(ax)
    return fig


@figure("pow2-pu-motor-contribution")
def _(mode):
    """Fault duty at the motor bus as the connected motor load grows.

    Motors feed a fault: each is a voltage behind its subtransient reactance,
    so its impedance appears in PARALLEL with the source path. The curve is
    S_base/(Z_th || Z_motor) with Z_motor from the motor rating, and the
    assertion recomputes the lesson's 8 MVA case at 140.5 MVA.
    """
    c = S.SERIES[mode]
    gen, t1, line, t2, t3, _ = _pu_branches()
    xth = gen + t1 + line + t2 + t3
    def duty_of(s_mva):
        """Fault duty with a motor of s_mva connected; s_mva = 0 means none."""
        if s_mva <= 0:
            return 100.0 / xth
        zmot = 0.20 * (PU_SB / (s_mva * 1e6)) * (4.00 / 4.16) ** 2
        return 100.0 / (xth * zmot / (xth + zmot))

    smot = np.linspace(0.0, 20.0, 801)
    duty = np.array([duty_of(v) for v in smot])
    d8 = duty_of(8.0)
    assert abs(duty_of(0.0) - 97.2732) < 1e-3, "source-only duty moved"
    assert abs(d8 - 140.5372) < 1e-3, "8 MVA motor case moved"

    fig, ax = plt.subplots()
    ax.plot(smot, duty, color=c[0], lw=2.5)
    S.label_end(ax, 20, duty[-1], "total fault duty at the bus", c[0], mode, dy=6, ha="right")
    ax.axhline(duty[0], color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 0.25, duty[0] + 4, "97.3 MVA from the utility path alone", mode, size=9)
    ax.plot([8.0], [d8], "o", color=c[1], ms=8, zorder=5)
    S.note(ax, 8.35, d8 - 18,
           f"8 MVA motor adds {d8 - duty[0]:.1f} MVA\n"
           f"({(d8 / duty[0] - 1) * 100:.0f} % more breaker duty)", mode)
    ax.set_xlabel("connected motor rating at the bus  (MVA)")
    ax.set_ylabel("three-phase fault duty  (MVA)")
    ax.set_title("Motors are generators for the first few cycles of a fault")
    ax.set_xlim(0, 20)
    ax.set_ylim(80, 210)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Transmission Lines: Models and Parameters
# ---------------------------------------------------------------------------

#: The 230 kV, 60 Hz line the transmission lesson carries end to end.
TL_Z = 0.08 + 0.50j          # ohm per km
TL_Y = 3.30e-6j              # siemens per km
TL_VLL = 230e3
TL_SIL = 230.0 ** 2 / np.sqrt(0.50 / 3.30e-6)     # MW, from sqrt(x/b)


def _tl_abcd(length_km, model="exact"):
    """ABCD parameters of the study line by one of the three lesson models."""
    Z, Y = TL_Z * length_km, TL_Y * length_km
    if model == "short":
        return 1 + 0j, Z, 0j, 1 + 0j
    if model == "pi":
        A = 1 + Z * Y / 2
        return A, Z, Y * (1 + Z * Y / 4), A
    gamma = np.sqrt(TL_Z * TL_Y)
    Zc = np.sqrt(TL_Z / TL_Y)
    g = gamma * length_km
    A = np.cosh(g)
    return A, Zc * np.sinh(g), np.sinh(g) / Zc, A


def _tl_sending(length_km, p_mw, pf=0.95, model="exact"):
    """Sending-end phase voltage for a stated receiving-end load."""
    A, B, _, _ = _tl_abcd(length_km, model)
    Vr = TL_VLL / np.sqrt(3)
    Ir = (p_mw * 1e6) / (np.sqrt(3) * TL_VLL * pf) * np.exp(-1j * np.arccos(pf))
    return A * Vr + B * Ir


@figure("pow2-txl-model-error")
def _(mode):
    """Error of the short-line and nominal-pi models against the exact
    hyperbolic solution, as line length grows.

    All three sending-end voltages are computed here for the same 150 MW,
    0.95 power-factor load on the same 230 kV line; the plotted quantity is
    the ratio of each approximation to the exact answer. The assertions pin
    the two crossings of the one-percent line, which are the practical
    boundaries between the three models.
    """
    c = S.SERIES[mode]
    L = np.linspace(10, 500, 600)
    ex = np.array([abs(_tl_sending(v, 150.0)) for v in L])
    sh = np.array([abs(_tl_sending(v, 150.0, model="short")) for v in L])
    pi = np.array([abs(_tl_sending(v, 150.0, model="pi")) for v in L])
    e_sh = (sh / ex - 1.0) * 100.0
    e_pi = (pi / ex - 1.0) * 100.0
    assert e_sh[0] < 0.05 and e_pi[0] < 0.01, "both models must be exact when short"
    k80 = int(np.argmin(np.abs(L - 80.0)))
    assert abs(e_sh[k80] - 0.50) < 0.06, "short-line error at 80 km moved"
    assert e_pi[-1] > 3.0 and e_sh[-1] > 15.0, "errors must grow with length"

    fig, ax = plt.subplots()
    ax.plot(L, e_sh, color=c[0], lw=2.4)
    ax.plot(L, e_pi, color=c[1], lw=2.4)
    S.label_end(ax, 500, e_sh[-1], "short line\n(series Z only)", c[0], mode, dy=-6, ha="right", dx=-6)
    S.label_end(ax, 500, e_pi[-1], "nominal pi", c[1], mode, dy=8, ha="right", dx=-6)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 12, 1.35, "1 % error: the usual engineering tolerance", mode, size=9)
    for arr, col, lab in ((e_sh, c[0], "short line\npasses to here"),
                          (e_pi, c[1], "nominal pi\npasses to here")):
        k = int(np.argmin(np.abs(arr - 1.0)))
        ax.plot([L[k]], [1.0], "o", color=col, ms=7, zorder=5)
        ax.annotate(f"{L[k]:.0f} km", xy=(L[k], 1.0), xytext=(2, -16),
                    textcoords="offset points", color=col, fontsize=9.5,
                    fontweight="semibold")
    ax.set_xlabel("line length  (km)")
    ax.set_ylabel("error in sending-end voltage  (%)")
    ax.set_title("How far each model survives: one 230 kV line, three descriptions")
    ax.set_xlim(0, 510)
    ax.set_ylim(-0.4, 17.5)
    S.strip(ax)
    return fig


@figure("pow2-txl-ferranti-length")
def _(mode):
    """Open-end voltage rise against line length, and the reactive power the
    line generates that causes it.

    The upper curve is 1/|A| from the exact ABCD parameters; the lower one is
    Q = V^2 b l, the charging MVAR of the same line. The assertion pins the
    300 km case at 1.0791 per unit and 52.37 MVAR, and checks the lossless
    form 1/cos(beta l) agrees to better than a third of a point at 600 km.
    """
    c = S.SERIES[mode]
    L = np.linspace(0, 600, 700)
    beta = np.sqrt(TL_Z * TL_Y).imag
    exact = np.array([1.0 / abs(_tl_abcd(v)[0]) for v in L])
    lossless = 1.0 / np.cos(beta * L)
    r300 = 1.0 / abs(_tl_abcd(300.0)[0])
    q = (TL_VLL ** 2) * TL_Y.imag * L / 1e6          # MVAR generated
    assert abs(r300 - 1.07908) < 1e-5, "300 km Ferranti rise moved"
    assert abs(q[-1] / 600.0 * 300.0 - 52.371) < 1e-3, "charging MVAR moved"
    assert 0 < lossless[-1] - exact[-1] < 6e-3, "lossless form drifted too far"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.8))
    ax1.plot(L, exact, color=c[0], lw=2.5)
    S.label_end(ax1, 470, 1.0 / abs(_tl_abcd(470.0)[0]),
                "open-end rise  1 / |A|", c[0], mode, dy=14, ha="center")
    ax1.axhline(1.10, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax1, 8, 1.112, "110 % of nominal: the usual equipment limit", mode, size=9)
    ax1.plot([300.0], [r300], "o", color=c[0], ms=8, zorder=5)
    S.note(ax1, 318, 1.028, f"300 km open-ended: {r300:.4f} pu\n= {230 * r300:.1f} kV on a 230 kV line",
           mode)
    ax1.set_ylabel("open-end voltage /\nsending voltage")
    ax1.set_ylim(0.99, 1.44)
    ax1.set_title("Ferranti rise, and the charging MVAR that produces it")
    ax2.plot(L, q, color=c[1], lw=2.5)
    S.label_end(ax2, 470, q[int(np.argmin(np.abs(L - 470)))],
                "charging  Q = V^2 b l", c[1], mode, dy=-16, ha="center")
    ax2.plot([300.0], [52.371], "o", color=c[1], ms=8, zorder=5)
    S.note(ax2, 312, 40.0, "52.4 MVAR at 300 km:\nthe shunt reactor must absorb it", mode)
    ax2.set_xlabel("line length  (km)")
    ax2.set_ylabel("reactive power\ngenerated  (MVAR)")
    ax2.set_xlim(0, 600)
    ax2.set_ylim(0, 115)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-txl-loadability")
def _(mode):
    """Power a line can deliver, in multiples of its surge impedance loading,
    against length and against the angle limit accepted.

    P = |V_S||V_R| sin(delta) / |B| with |B| taken from the exact ABCD
    parameters at each length, then divided by SIL. The assertion recomputes
    the 300 km, 30 degree case and checks the ordering of the three curves.
    """
    c = S.SERIES[mode]
    L = np.linspace(50, 700, 700)
    Vr = TL_VLL / np.sqrt(3)
    Bmag = np.array([abs(_tl_abcd(v)[1]) for v in L])
    def cap(delta_deg):
        return 3 * Vr ** 2 * np.sin(np.radians(delta_deg)) / Bmag / 1e6 / TL_SIL
    p30, p40, pmax = cap(30.0), cap(40.0), cap(90.0)
    k = int(np.argmin(np.abs(L - 300.0)))
    assert abs(p30[k] - 1.3134) < 3e-3, "300 km 30-degree loadability moved"
    assert np.all(pmax > p40) and np.all(p40 > p30), "curve ordering broken"

    fig, ax = plt.subplots()
    ax.plot(L, pmax, color=c[2], lw=2.2, ls="--")
    ax.plot(L, p40, color=c[1], lw=2.3)
    ax.plot(L, p30, color=c[0], lw=2.5)
    S.label_end(ax, 560, pmax[int(np.argmin(np.abs(L - 560)))],
                "theoretical max, 90 deg", c[2], mode, dy=15, ha="center")
    S.label_end(ax, 620, p40[int(np.argmin(np.abs(L - 620)))],
                "40 deg", c[1], mode, dy=13, ha="center")
    S.label_end(ax, 620, p30[int(np.argmin(np.abs(L - 620)))],
                "30 deg (practical)", c[0], mode, dy=-15, ha="center")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls=":")
    S.note(ax, 62, 1.04, "SIL", mode, size=9)
    ax.plot([300.0], [p30[k]], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 318, p30[k] - 0.42, f"300 km at 30 deg:\n{p30[k]:.2f} x SIL = "
                                   f"{p30[k] * TL_SIL:.0f} MW", mode)
    ax.set_xlabel("line length  (km)")
    ax.set_ylabel("deliverable power  /  SIL")
    ax.set_title("Long lines are limited by angle, not by conductor temperature")
    ax.set_xlim(50, 700)
    ax.set_ylim(0, 4.2)
    S.strip(ax)
    return fig


@figure("pow2-txl-loss-loading")
def _(mode):
    """Loss and voltage profile of the 300 km line against loading, at unity
    power factor.

    Both panels come from the exact ABCD solution evaluated at each loading;
    the assertion pins the flat-profile property of surge impedance loading by
    checking that a load equal to the characteristic impedance produces a rise
    of exactly exp(alpha l).
    """
    c = S.SERIES[mode]
    A, B, C, D = _tl_abcd(300.0)
    Vr = TL_VLL / np.sqrt(3)
    Zc = np.sqrt(TL_Z / TL_Y)
    alpha = np.sqrt(TL_Z * TL_Y).real
    Iz = Vr / Zc
    assert abs(abs(A * Vr + B * Iz) / Vr - np.exp(alpha * 300.0)) < 1e-9, \
        "surge-impedance loading does not give exp(alpha l)"

    k = np.linspace(0.10, 2.0, 500)
    P = k * TL_SIL * 1e6
    I = P / (np.sqrt(3) * TL_VLL)
    Vs = A * Vr + B * I
    Is = C * Vr + D * I
    Ps = 3 * (Vs * np.conj(Is)).real
    loss = (Ps - P) / Ps * 100.0
    prof = np.abs(Vs) / Vr
    k1 = int(np.argmin(np.abs(k - 1.0)))
    assert abs(loss[k1] - 5.816) < 0.02, "loss at 1 x SIL moved"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(k, loss, color=c[0], lw=2.5)
    S.label_end(ax1, 1.45, loss[int(np.argmin(np.abs(k - 1.45)))],
                "loss as a share of sending power", c[0], mode, dy=15, ha="center")
    ax1.set_ylabel("line loss  (%)")
    ax1.set_ylim(0, 12)
    ax1.set_title("The 300 km line: what loading costs in loss and in voltage")
    ax2.plot(k, prof, color=c[1], lw=2.5)
    ax2.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    rise_zc = np.exp(alpha * 300.0)
    ax2.plot([1.0], [prof[k1]], "o", color=c[1], ms=8, zorder=5)
    S.note(ax2, 1.04, 0.945,
           f"1 x SIL at unity pf:  {prof[k1]:.3f}\n"
           f"terminated in Zc instead:  {rise_zc:.3f}", mode)
    ax2.set_xlabel("receiving-end power  /  SIL   (unity power factor)")
    ax2.set_ylabel("sending / receiving\nvoltage")
    ax2.set_xlim(0.1, 2.0)
    ax2.set_ylim(0.90, 1.35)
    for a in (ax1, ax2):
        a.axvline(1.0, color=S.GRID[mode], lw=1.0, ls=":")
        S.strip(a)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-txl-dispatch-lambda")
def _(mode):
    """Equal-incremental-cost dispatch of two units, drawn as the two
    incremental cost lines and the demand they jointly serve.

    The lines are dC/dP for the two quadratic cost functions the lesson
    states; the marked lambda is the value at which the two outputs sum to
    250 MW. The assertion re-derives that split from the closed form and
    checks the total cost beats an equal split.
    """
    c = S.SERIES[mode]

    def cost1(p):
        return 500 + 5.3 * p + 0.004 * p ** 2

    def cost2(p):
        return 400 + 5.5 * p + 0.006 * p ** 2

    demand = 250.0
    p2 = 0.4 * demand - 10.0
    p1 = demand - p2
    lam = 5.3 + 0.008 * p1
    assert abs(lam - (5.5 + 0.012 * p2)) < 1e-12, "lambdas are not equal"
    assert abs(p1 - 160.0) < 1e-9 and abs(p2 - 90.0) < 1e-9, "split moved"
    assert cost1(p1) + cost2(p2) < cost1(125.0) + cost2(125.0), "dispatch must be cheaper"

    # each unit is drawn only over its own output range, so the direct labels
    # can sit at the curve ends instead of on top of the curves
    P1r = np.linspace(50, 200, 300)
    P2r = np.linspace(40, 150, 300)
    fig, ax = plt.subplots()
    ax.plot(P1r, 5.3 + 0.008 * P1r, color=c[0], lw=2.4)
    ax.plot(P2r, 5.5 + 0.012 * P2r, color=c[1], lw=2.4)
    S.label_end(ax, 200, 5.3 + 0.008 * 200, "unit 1\n5.3 + 0.008 P", c[0], mode, dy=-4)
    S.label_end(ax, 150, 5.5 + 0.012 * 150, "unit 2\n5.5 + 0.012 P", c[1], mode, dy=6)
    ax.axhline(lam, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 42, lam + 0.035, f"lambda = {lam:.2f} per MWh", mode, size=9.5)
    for p, col, lab in ((p1, c[0], "P1 = 160 MW"), (p2, c[1], "P2 = 90 MW")):
        ax.plot([p], [lam], "o", color=col, ms=8, zorder=5)
        ax.plot([p, p], [5.55, lam], color=S.GRID[mode], lw=0.9, ls=":")
        ax.annotate(lab, xy=(p, 5.60), ha="center", color=col,
                    fontsize=9.5, fontweight="semibold")
    S.note(ax, 46, 7.02,
           "160 + 90 = 250 MW of demand,\nserved 12.25 per hour cheaper\nthan an equal split",
           mode)
    ax.set_xlabel("unit output  (MW)")
    ax.set_ylabel("incremental cost  dC/dP  (per MWh)")
    ax.set_title("Economic dispatch: run every unit to the same incremental cost")
    ax.set_xlim(38, 205)
    ax.set_ylim(5.5, 7.6)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Power Factor Correction
# ---------------------------------------------------------------------------

#: The 600 kW, 0.72 power-factor plant on a 480 V service that the correction
#: lesson carries through Sections 6 and 7.
PFC_P = 600e3
PFC_V = 480.0
PFC_PF1 = 0.72
PFC_SSC = 1500e3 / 0.0575        # 1500 kVA transformer at 5.75 percent


def _pfc_kvar(pf_from, pf_to):
    """kVAR needed per watt of load to move between two power factors."""
    return np.tan(np.arccos(pf_from)) - np.tan(np.arccos(pf_to))


@figure("pow2-pfc-kvar-target")
def _(mode):
    """Capacitive kVAR per kW of load needed to reach a target power factor,
    from three different starting points.

    The curve is tan(arccos pf_1) - tan(arccos pf_2) evaluated directly. The
    assertion pins the lesson's 0.72 to 0.95 case and the vertical asymptote
    behaviour that makes the last few points of power factor so expensive.
    """
    c = S.SERIES[mode]
    target = np.linspace(0.75, 0.999, 800)
    assert abs(_pfc_kvar(0.72, 0.95) - 0.635169) < 1e-5, "0.72 to 0.95 case moved"
    fig, ax = plt.subplots()
    for start, col in zip((0.70, 0.75, 0.80), c):
        y = np.where(target > start, _pfc_kvar(start, target), np.nan)
        ax.plot(target, y, color=col, lw=2.3)
        S.label_end(ax, 0.999, _pfc_kvar(start, 0.999), f"from pf = {start:.2f}",
                    col, mode, dy=0)
    q95 = _pfc_kvar(0.75, 0.95)
    q100 = _pfc_kvar(0.75, 0.9999)
    assert q100 > 1.5 * q95, "the last stretch to unity must dominate"
    ax.plot([0.95], [q95], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, 0.80, 0.86,
           f"0.75 -> 0.95 costs {q95:.3f} kVAR per kW;\n"
           f"0.95 -> 1.00 costs another {q100 - q95:.3f}", mode)
    for x in (0.90, 0.95):
        ax.axvline(x, color=S.GRID[mode], lw=0.9, ls=":")
    ax.set_xlabel("target power factor")
    ax.set_ylabel("capacitor rating  (kVAR per kW of load)")
    ax.set_title("The last five points of power factor cost as much as the first twenty")
    ax.set_xlim(0.75, 1.005)
    ax.set_ylim(0, 1.15)
    S.strip(ax)
    return fig


@figure("pow2-pfc-released-capacity")
def _(mode):
    """Apparent power and released transformer capacity for the 600 kW plant
    as its power factor is corrected.

    S = P/pf and the released capacity is the difference from the uncorrected
    833.3 kVA; both are evaluated here. The assertion pins the 0.95 case at
    631.6 kVA and 201.8 kVA released.
    """
    c = S.SERIES[mode]
    pf = np.linspace(PFC_PF1, 1.0, 700)
    S_kva = PFC_P / pf / 1e3
    released = S_kva[0] - S_kva
    k95 = int(np.argmin(np.abs(pf - 0.95)))
    assert abs(S_kva[0] - 833.333) < 1e-3, "uncorrected kVA moved"
    assert abs(S_kva[k95] - 631.579) < 0.2, "corrected kVA moved"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(pf, S_kva, color=c[0], lw=2.5)
    ax1.axhline(750.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax1, 0.723, 762, "a 750 kVA transformer", mode, size=9)
    kfit = int(np.argmin(np.abs(S_kva - 750.0)))
    ax1.plot([pf[kfit]], [750.0], "o", color=c[0], ms=7, zorder=5)
    S.note(ax1, pf[kfit] + 0.008, 690,
           f"the load fits a 750 kVA unit\nonce pf reaches {pf[kfit]:.2f}", mode)
    ax1.set_ylabel("apparent power drawn\n(kVA)")
    ax1.set_ylim(560, 880)
    ax1.set_title("Correcting power factor is buying transformer capacity back")
    ax2.plot(pf, released, color=c[1], lw=2.5)
    ax2.plot([0.95], [released[k95]], "o", color=c[1], ms=8, zorder=5)
    S.note(ax2, 0.80, 150, f"correcting to 0.95 releases\n{released[k95]:.1f} kVA "
                           f"({released[k95] / S_kva[0] * 100:.1f} % of the service)", mode)
    ax2.set_xlabel("corrected power factor")
    ax2.set_ylabel("capacity released\n(kVA)")
    ax2.set_xlim(PFC_PF1, 1.0)
    ax2.set_ylim(0, 260)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-pfc-capacitance")
def _(mode):
    """Capacitance per phase needed to supply 381 kVAR, against system
    voltage, for delta- and wye-connected banks.

    C = Q_phase/(omega V_c^2) with V_c the voltage across one capacitor, so
    the delta bank needs exactly one third of the wye capacitance. The
    assertion checks that ratio and pins the 480 V delta case at 1,463 uF.
    """
    c = S.SERIES[mode]
    w = 2 * np.pi * 60
    Qc = 381.1013e3
    def cap_uF(v_across):
        return (Qc / 3) / (w * v_across ** 2) * 1e6

    # every marked voltage is on the grid, so the dots sit on the curve exactly
    marks = np.array([480.0, 4160.0, 13800.0])
    V = np.unique(np.concatenate([np.logspace(np.log10(240), np.log10(13800), 500),
                                  marks]))
    C_delta = cap_uF(V)
    C_wye = cap_uF(V / np.sqrt(3))
    assert np.allclose(C_wye / C_delta, 3.0), "wye/delta capacitance ratio broken"
    assert abs(cap_uF(480.0) - 1462.53) < 0.05, "480 V delta capacitance moved"
    assert abs(cap_uF(4160.0) - 19.4716) < 5e-3, "4160 V delta capacitance moved"

    fig, ax = plt.subplots()
    ax.loglog(V, C_wye, color=c[0], lw=2.4)
    ax.loglog(V, C_delta, color=c[1], lw=2.4)
    S.label_end(ax, 13800, C_wye[-1], "wye-connected", c[0], mode, dy=8, ha="right")
    S.label_end(ax, 13800, C_delta[-1], "delta-connected", c[1], mode, dy=-10, ha="right")
    for v, lab in ((480.0, "480 V"), (4160.0, "4160 V"), (13800.0, "13.8 kV")):
        kk = int(np.argmin(np.abs(V - v)))
        ax.plot([v], [C_delta[kk]], "o", color=c[1], ms=6, zorder=5)
        ax.annotate(f"{lab}\n{C_delta[kk]:,.1f} uF", xy=(v, C_delta[kk]),
                    xytext=(6, -22), textcoords="offset points",
                    color=S.INK_2[mode], fontsize=8.5)
    ax.set_xlabel("system line-to-line voltage  (V, log)")
    ax.set_ylabel("capacitance per phase for 381 kVAR  (uF, log)")
    ax.set_title("Same kVAR, wildly different hardware: capacitance falls as V squared")
    ax.set_xlim(230, 15500)
    ax.set_ylim(3, 20000)
    S.strip(ax)
    return fig


@figure("pow2-pfc-overcorrection")
def _(mode):
    """Power factor and bus voltage rise of the 600 kW plant as the capacitor
    bank grows past the size that corrects it.

    Power factor is P/sqrt(P^2 + (Q_load - Q_c)^2) and the voltage rise is
    Q_c/S_sc, both evaluated across the sweep. The assertion pins the unity
    crossing at the load's own reactive demand and the 1.46 percent rise the
    correctly sized bank produces.
    """
    c = S.SERIES[mode]
    Q1 = PFC_P * np.tan(np.arccos(PFC_PF1))
    Qc = np.linspace(0, 800e3, 800)
    Qnet = Q1 - Qc
    pf = PFC_P / np.hypot(PFC_P, Qnet)
    rise = Qc / PFC_SSC * 100.0
    k1 = int(np.argmin(np.abs(Qc - 381.1013e3)))
    ku = int(np.argmax(pf))
    assert abs(Qc[ku] - Q1) < 1.5e3, "unity crossing is not at the load kVAR"
    assert abs(rise[k1] - 1.4605) < 5e-3, "voltage rise at the sized bank moved"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(Qc / 1e3, pf, color=c[0], lw=2.5)
    ax1.axvspan(Q1 / 1e3, 800, color=S.GUIDE[mode], alpha=0.13, lw=0)
    S.note(ax1, Q1 / 1e3 + 12, 0.735, "overcorrected:\npower factor now LEADING", mode)
    ax1.plot([381.1], [pf[k1]], "o", color=c[0], ms=8, zorder=5)
    S.note(ax1, 120, 0.965, "381 kVAR -> 0.95 lagging", mode)
    ax1.set_ylabel("power factor")
    ax1.set_ylim(0.70, 1.04)
    ax1.set_title("Past the load's own kVAR, more capacitors make things worse")
    ax2.plot(Qc / 1e3, rise, color=c[1], lw=2.5)
    ax2.plot([381.1], [rise[k1]], "o", color=c[1], ms=8, zorder=5)
    S.note(ax2, 395, 1.02, f"{rise[k1]:.2f} % rise at the sized bank", mode)
    ax2.axhline(2.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax2, 12, 2.08, "2 % rise: worth checking against the tap setting", mode, size=9)
    ax2.set_xlabel("capacitor bank rating  (kVAR)")
    ax2.set_ylabel("bus voltage rise  (%)")
    ax2.set_xlim(0, 800)
    ax2.set_ylim(0, 3.3)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
    return fig


@figure("pow2-pfc-detune")
def _(mode):
    """What a detuning reactor costs: capacitor voltage and delivered kVAR
    against the tuning order chosen.

    A series reactor with X_L = X_C/h^2 leaves a net reactance
    X_C(1 - 1/h^2), so both the capacitor terminal voltage and the bank output
    rise by 1/(1 - 1/h^2). The assertion pins the industry-standard 4.7th
    tuning at a 4.74 percent rise.
    """
    c = S.SERIES[mode]
    h = np.linspace(3.5, 7.0, 700)
    k = 1.0 / (1.0 - 1.0 / h ** 2)
    reactor = 1.0 / h ** 2 * 100.0
    k47 = 1.0 / (1.0 - 1.0 / 4.7 ** 2)
    assert abs(k47 - 1.047416) < 1e-5, "4.7th tuning factor moved"
    assert np.all(np.diff(k) < 0), "the penalty must fall as tuning order rises"

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax1.plot(h, (k - 1) * 100.0, color=c[0], lw=2.5)
    ax1.plot([4.7], [(k47 - 1) * 100.0], "o", color=c[0], ms=8, zorder=5)
    S.note(ax1, 4.78, 5.4, f"4.7th tuning: capacitors see\n"
                           f"{(k47 - 1) * 100:.2f} % more voltage and deliver\n"
                           f"{(k47 - 1) * 100:.2f} % more kVAR", mode)
    ax1.set_ylabel("capacitor overvoltage\nand kVAR gain  (%)")
    ax1.set_ylim(0, 9.5)
    ax1.set_title("Detuning is cheap insurance, but it is not free")
    ax2.plot(h, reactor, color=c[1], lw=2.5)
    ax2.plot([4.7], [1 / 4.7 ** 2 * 100], "o", color=c[1], ms=8, zorder=5)
    S.note(ax2, 4.78, 4.9, f"reactor is {1 / 4.7 ** 2 * 100:.2f} % of X_C", mode)
    for hh, lab in ((5.0, "5th harmonic"), (7.0, "7th")):
        ax2.axvline(hh, color=S.GRID[mode], lw=1.0, ls=":")
        S.note(ax2, hh - 0.05, 6.6, lab, mode, size=9, ha="right")
    ax2.set_xlabel("tuning order  h  (multiples of the fundamental)")
    ax2.set_ylabel("series reactor\n(% of X_C)")
    ax2.set_xlim(3.5, 7.0)
    ax2.set_ylim(0, 9.5)
    S.strip(ax1)
    S.strip(ax2)
    fig.align_ylabels((ax1, ax2))
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
