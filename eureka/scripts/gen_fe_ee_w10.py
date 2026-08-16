#!/usr/bin/env python3
"""Wave-10 figures for the FE Electrical and Computer course:
Engineering Sciences, Engineering Economics, Ethics & Professional Practice,
and Exam Strategy.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look. Every curve, bar and arrow length here is COMPUTED
from the equation or the cash-flow series the lesson states, in code the reader
can check, and every identity a figure claims is asserted numerically before the
figure is drawn. Nothing is traced, scanned or adapted from the NCEES Reference
Handbook, from any code of ethics, or from any textbook - the pipeline consumes
formulas and stated numbers, which are not protected expression, and never
anyone's drawing of them.

Two of these figures are DECLARED SCHEMATICS rather than plots: eth-duty-
hierarchy and eth-ip-map lay out a decision structure, not data, and their
captions in the lesson say so in those words. strat-handbook-map is likewise a
declared schematic of an organisation, not a measurement. Everything else is a
computed plot.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w10.py            # all
    python3 scripts/gen_fe_ee_w10.py econ       # only names starting "econ"
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

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


# --- the six standard factors, from their closed forms (never a table) -------

def f_FP(i, n): return (1 + i) ** n
def f_PF(i, n): return 1 / (1 + i) ** n
def f_FA(i, n): return ((1 + i) ** n - 1) / i
def f_PA(i, n): return ((1 + i) ** n - 1) / (i * (1 + i) ** n)
def f_AP(i, n): return i * (1 + i) ** n / ((1 + i) ** n - 1)
def f_AF(i, n): return i / ((1 + i) ** n - 1)


def _box(ax, x, y, w, h, text, mode, face=None, edge=None, size=9.5, weight="normal"):
    """A rounded box with centred text - the only primitive the schematics use."""
    edge = edge or S.GRID[mode]
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h, boxstyle="round,pad=0.012,rounding_size=0.02",
        linewidth=1.3, edgecolor=edge,
        facecolor="none" if face is None else face, zorder=2))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            color=S.INK[mode], fontsize=size, fontweight=weight, zorder=3)


def _arrow(ax, xy_from, xy_to, mode, colour=None, style="-|>", lw=1.4):
    ax.annotate("", xy=xy_to, xytext=xy_from,
                arrowprops=dict(arrowstyle=style, lw=lw,
                                color=colour or S.GUIDE[mode],
                                shrinkA=2, shrinkB=2))


def _blank(ax):
    """Schematic canvas: no ticks, no grid, no spines."""
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)


# ---------------------------------------------------------------------------
# Engineering Sciences
# ---------------------------------------------------------------------------


@figure("sci-efficiency-cascade")
def _(mode):
    """Power surviving a three-stage conversion chain, stage by stage.

    The chain is the one the lesson works: a rectifier at 0.93, an inverter at
    0.88 and a motor at 0.96, delivering 5.000 kW of shaft power. Each bar is
    the power crossing that interface, computed by dividing backwards from the
    output; the loss labels are the differences between neighbouring bars. The
    assertions check that the product of the three stage efficiencies is the
    overall efficiency and that the losses close the energy balance exactly.
    """
    c = S.SERIES[mode]
    eta = [0.93, 0.88, 0.96]
    p_out = 5000.0
    # power at each interface, walking backwards from the load
    p = [p_out]
    for e in reversed(eta):
        p.append(p[-1] / e)
    p = list(reversed(p))                       # [in, after1, after2, out]
    overall = float(np.prod(eta))
    assert abs(p[0] * overall - p_out) < 1e-9, "cascade product broken"
    losses = [p[k] - p[k + 1] for k in range(3)]
    assert abs(sum(losses) - (p[0] - p_out)) < 1e-9, "energy balance broken"

    labels = ["input\nfrom mains", "after rectifier\n0.93", "after inverter\n0.88",
              "shaft output\n0.96"]
    x = np.arange(4)
    fig, ax = plt.subplots()
    ax.bar(x, p, width=0.56, color=[c[0], c[0], c[0], c[1]], zorder=3)
    for k, v in enumerate(p):
        ax.text(k, v + 130, f"{v:,.0f} W", ha="center", va="bottom",
                color=S.INK[mode], fontsize=10, fontweight="semibold")
    for k, L in enumerate(losses):
        xm = k + 0.5
        ax.annotate("", xy=(xm + 0.20, p[k + 1]), xytext=(xm - 0.20, p[k]),
                    arrowprops=dict(arrowstyle="-|>", lw=1.2, color=S.GUIDE[mode]))
        ax.text(xm, p[k] + 430, f"-{L:,.0f} W", ha="center", va="bottom",
                color=S.INK_2[mode], fontsize=9)
    ax.axhline(p_out, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, 3.32, p_out, "delivered\npower", S.GUIDE[mode], mode, dx=8)
    S.note(ax, -0.45, 7250,
           f"overall efficiency = 0.93 x 0.88 x 0.96 = {overall:.4f}  "
           f"({100*overall:.2f}%);  total loss {p[0]-p_out:,.0f} W", mode)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylabel("power crossing the interface  (W)")
    ax.set_title("Efficiencies multiply: three good stages make one mediocre chain")
    ax.set_xlim(-0.55, 3.62)
    ax.set_ylim(0, 7900)
    S.strip(ax)
    return fig


@figure("sci-thermal-resistance")
def _(mode):
    """Junction temperature against heatsink thermal resistance, three powers.

    Each line is Tj = Ta + P(theta_jc + theta_cs + theta_sa) with Ta = 40 C,
    theta_jc = 1.5 K/W and theta_cs = 0.5 K/W - the series-resistance form the
    lesson derives, which is Ohm's law with degrees for volts and watts for
    amps. The dashed limit is a 125 C maximum junction temperature. The
    assertions fix the lesson's two worked answers: 97.6 C at 12 W on a
    2.8 K/W sink, and the largest sink resistance that keeps 12 W legal.
    """
    c = S.SERIES[mode]
    Ta, jc, cs, Tjmax = 40.0, 1.5, 0.5, 125.0
    sa = np.linspace(0, 9, 700)
    assert abs((Ta + 12.0 * (jc + cs + 2.8)) - 97.6) < 1e-9, "worked Tj broken"
    sa_max = (Tjmax - Ta) / 12.0 - (jc + cs)
    assert abs(sa_max - 5.083333333333333) < 1e-9, "limit resistance broken"

    fig, ax = plt.subplots()
    for k, P in enumerate((8.0, 12.0, 17.7083)):
        ax.plot(sa, Ta + P * (jc + cs + sa), color=c[k], lw=2.1)
        S.label_end(ax, 9.0, Ta + P * (jc + cs + 9.0),
                    f"P = {P:g} W".replace("17.7083", "17.7"), c[k], mode, dx=7)
    ax.axhline(Tjmax, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.text(0.08, Tjmax + 5, "125 C limit", color=S.INK_2[mode], fontsize=9)
    ax.plot([2.8], [97.6], "o", color=c[1], ms=7, zorder=5)
    ax.plot([2.8, 2.8], [Ta, 97.6], color=S.GRID[mode], lw=0.9, ls=":")
    ax.plot([sa_max], [Tjmax], "o", color=c[1], ms=7, zorder=5)
    ax.plot([sa_max, sa_max], [Ta, Tjmax], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 5.05, 72, "12 W on a 2.8 K/W sink reaches 97.6 C;\n"
                         f"the same 12 W runs out of margin\nat {sa_max:.3f} K/W", mode)
    ax.set_xlabel("heatsink-to-ambient resistance  theta_sa  (K/W)")
    ax.set_ylabel("junction temperature  Tj  (C)")
    ax.set_title("The heatsink is the only resistance you get to choose")
    ax.set_xlim(0, 9.0)
    ax.set_ylim(40, 240)
    S.strip(ax)
    return fig


@figure("sci-field-null")
def _(mode):
    """Net axial electric field of a +4 nC and a -1 nC charge 0.30 m apart.

    The curve is the signed sum E(x) = k q1/x^2 + k q2/(x - 0.30)^2 evaluated
    point by point with k = 8.99e9, plotted on a symmetric log scale so five
    decades of magnitude and the sign change both fit. The assertion checks the
    lesson's algebra - the field cancels at x = 0.60 m, beyond the SMALLER
    charge, not between the two.
    """
    c = S.SERIES[mode]
    k, q1, q2, d = 8.99e9, 4e-9, -1e-9, 0.30
    e1 = k * q1 / 0.60 ** 2
    e2 = k * abs(q2) / (0.60 - d) ** 2
    assert abs(e1 - e2) < 1e-9, "null point identity broken"

    def E(x):
        return k * q1 / x ** 2 + k * q2 / np.abs(x - d) ** 2 * np.sign(x - d)

    xl = np.linspace(-0.42, -0.012, 900)
    xm = np.linspace(0.012, d - 0.012, 900)
    xr = np.linspace(d + 0.012, 1.05, 1400)
    fig, ax = plt.subplots()
    for seg in (xl, xm, xr):
        ax.plot(seg, E(seg), color=c[0], lw=2.1)
    ax.set_yscale("symlog", linthresh=30)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([0.60], [0.0], "o", color=c[1], ms=8, zorder=5)
    S.note(ax, 0.63, 60, "field cancels here:\nx = 0.60 m", mode)
    for xc, lab, col in ((0.0, "+4 nC", c[1]), (d, "-1 nC", c[2])):
        ax.axvline(xc, color=S.GRID[mode], lw=1.0, ls=":")
        ax.text(xc + 0.028, 2.2e5, lab, ha="left", va="bottom", color=col,
                fontsize=10, fontweight="semibold")
    S.note(ax, -0.43, -8.4e5, "between the charges the fields\n"
                              "add - no null can exist there", mode)
    ax.set_xlabel("position on the axis  x  (m)")
    ax.set_ylabel("net field  E(x)  (V/m, symmetric log)")
    ax.set_title("A null exists only outside the pair, on the weaker side")
    ax.set_xlim(-0.45, 1.08)
    ax.set_ylim(-1e6, 1e6)
    S.strip(ax)
    return fig


@figure("sci-motor-torque-speed")
def _(mode):
    """Torque, mechanical power and efficiency of a PM DC motor, per unit.

    All three curves come from the two lesson equations for a 24 V machine with
    Ra = 0.6 ohm and k = 0.08 V.s/rad: Ia = (V - k w)/Ra and tau = k Ia. Torque
    is normalised to its stall value, power to its maximum, efficiency is the
    ratio tau w / (V Ia) - so one axis carries all three. The assertions pin the
    lesson's claims: power peaks at exactly half the no-load speed, its value
    there is V^2/(4 Ra), and the efficiency at 250 rad/s is 83.33%.
    """
    c = S.SERIES[mode]
    V, Ra, kt = 24.0, 0.6, 0.08
    w_nl = V / kt
    w = np.linspace(1e-6, w_nl, 300001)
    Ia = (V - kt * w) / Ra
    tau = kt * Ia
    Pm = tau * w
    eff = Pm / (V * Ia)
    assert abs(w[Pm.argmax()] - w_nl / 2) < 1e-3, "peak-power speed broken"
    assert abs(Pm.max() - V ** 2 / (4 * Ra)) < 1e-6, "peak-power value broken"
    e250 = (kt * (V - kt * 250) / Ra * 250) / (V * (V - kt * 250) / Ra)
    assert abs(e250 - 0.8333333333333334) < 1e-12, "efficiency at 250 rad/s broken"

    wn = w / w_nl
    fig, ax = plt.subplots()
    ax.plot(wn, tau / tau[0], color=c[0], lw=2.2)
    ax.plot(wn, Pm / Pm.max(), color=c[1], lw=2.2)
    ax.plot(wn, eff, color=c[2], lw=2.2)
    S.label_end(ax, 0.06, tau[int(0.06 * len(w))] / tau[0], "torque / stall torque",
                c[0], mode, dy=9)
    S.label_end(ax, 0.50, 1.0, "power / max power", c[1], mode, dy=8, ha="center")
    S.label_end(ax, 0.62, 0.62, "efficiency", c[2], mode, dy=-15, ha="center")
    ax.axvline(0.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.5, 0.15, "peak power at half the no-load speed:\n"
                          "240 W, 20 A, efficiency only 50%", mode, ha="center")
    ax.plot([250 / w_nl], [e250], "o", color=c[2], ms=7, zorder=5)
    S.note(ax, 0.5, 0.055, "the dot: 250 rad/s, 133 W out, 83.3% efficient",
           mode, ha="center")
    ax.set_xlabel("speed  w / w_no-load")
    ax.set_ylabel("per unit of each quantity's own maximum")
    ax.set_title("Maximum power and good efficiency are not the same operating point")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("sci-meter-loading")
def _(mode):
    """Reading error of a voltmeter across the lower leg of a 100k/100k divider.

    The curve is the exact divider result with the meter in parallel,
    Vm = Vs (R2||Rm)/(R1 + R2||Rm), expressed as a percentage of the unloaded
    5.000 V, swept over meter resistances from 10 k to 100 M. The two marked
    points are the lesson's worked cases; the assertions fix them at -4.7619%
    for a 1 M meter and -0.4975% for a 10 M meter.
    """
    c = S.SERIES[mode]
    Vs, R1, R2 = 10.0, 100e3, 100e3

    def err(Rm):
        Rp = R2 * Rm / (R2 + Rm)
        return 100 * (Vs * Rp / (R1 + Rp) - 5.0) / 5.0

    assert abs(err(1e6) + 4.761904761904762) < 1e-9, "1 M loading error broken"
    assert abs(err(10e6) + 0.4975124378109453) < 1e-9, "10 M loading error broken"
    Rm = np.logspace(4, 8, 900)

    fig, ax = plt.subplots()
    ax.semilogx(Rm, err(Rm), color=c[0], lw=2.3)
    ax.axhline(-1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.25e6, -24.2, "dashed: the 1% error line. A meter must be about\n"
                              "100 times the resistance it sits across to get there.", mode)
    for R, lab, dy in ((1e6, "1 M meter: -4.76%", -3.4), (10e6, "10 M meter: -0.50%", -4.2)):
        ax.plot([R], [err(R)], "o", color=c[1], ms=7, zorder=5)
        S.note(ax, R * 1.22, err(R) + dy, lab, mode)
    ax.set_xlabel("voltmeter input resistance  Rm  (ohm)")
    ax.set_ylabel("reading error  (% of the unloaded 5.000 V)")
    ax.set_title("A perfect meter still reports the wrong number if it draws current")
    ax.set_ylim(-26, 2)
    ax.set_xlim(1e4, 1e8)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Engineering Economics
# ---------------------------------------------------------------------------


@figure("econ-cashflow-anatomy")
def _(mode):
    """Cash-flow diagram of the lesson's loan, with every arrow to scale.

    The series is the worked example: 25,000 received at time zero against five
    end-of-year payments of A = 25,000 (A/P, 6%, 5). The payment is computed
    from the closed form, not read from a table, and arrow lengths are
    proportional to the amounts. The split bars show how each payment divides
    into interest on the outstanding balance and principal - the amortisation
    the lesson tabulates. The assertions check that the payments discount back
    to exactly the 25,000 borrowed and that the final balance is zero.
    """
    c = S.SERIES[mode]
    P0, i, n = 25000.0, 0.06, 5
    A = P0 * f_AP(i, n)
    assert abs(A - 5934.910010779737) < 1e-9, "loan payment broken"
    assert abs(A * f_PA(i, n) - P0) < 1e-8, "payments do not discount to the principal"
    bal, interest, principal = P0, [], []
    for _ in range(n):
        it = bal * i
        pr = A - it
        interest.append(it)
        principal.append(pr)
        bal -= pr
    assert abs(bal) < 1e-6, "amortisation does not close"

    fig, ax = plt.subplots()
    ax.axhline(0, color=S.INK_2[mode], lw=1.6)
    ax.annotate("", xy=(0, P0), xytext=(0, 0),
                arrowprops=dict(arrowstyle="-|>", lw=2.6, color=c[0]))
    ax.text(0, P0 + 900, f"P = {P0:,.0f} received now", ha="center", va="bottom",
            color=c[0], fontsize=10, fontweight="semibold")
    for k in range(1, n + 1):
        ax.annotate("", xy=(k, -A), xytext=(k, 0),
                    arrowprops=dict(arrowstyle="-|>", lw=2.6, color=c[1]))
        ax.bar(k, -interest[k - 1], width=0.30, bottom=0.0,
               color=c[2], alpha=0.85, zorder=3)
        ax.text(k, -A - 1400, f"{A:,.0f}", ha="center", va="top",
                color=S.INK_2[mode], fontsize=9)
    S.label_end(ax, n, -A / 2, "five equal payments\nA = 5,934.91", c[1], mode, dx=12)
    for k in range(n + 1):
        ax.text(k, 900, str(k), ha="center", va="bottom", color=S.INK_2[mode], fontsize=10)
    S.note(ax, 5.45, 900, "end of year", mode)
    S.note(ax, 1.05, 21500,
           "(A/P, 6%, 5) = 0.237396, computed from  i(1+i)^n / [(1+i)^n - 1]", mode)
    S.note(ax, 1.05, 16200, "the five payments discount back to exactly 25,000:\n"
                            "5,934.91 x (P/A, 6%, 5) = 5,934.91 x 4.212364 = 25,000", mode)
    S.note(ax, 1.05, 10800, "shaded head of each arrow = interest on the balance\n"
                            "that year; the rest of the arrow repays principal", mode)
    ax.set_xlim(-0.5, 6.4)
    ax.set_ylim(-10500, 28500)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    ax.set_title("Draw the diagram first: the arrows decide which factor you need")
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("econ-effective-rate")
def _(mode):
    """Effective annual rate against compounding frequency for two nominal rates.

    Each point is EAR = (1 + r/m)^m - 1 evaluated at the stated m, and each
    dashed line is the continuous-compounding limit e^r - 1 for the same nominal
    rate. The assertions fix the lesson's worked numbers: 12% nominal compounded
    monthly is 12.6825% effective, and its continuous limit is 12.7497%.
    """
    c = S.SERIES[mode]
    ms = np.array([1, 2, 4, 12, 52, 365])
    labels = ["annual", "semi", "quarterly", "monthly", "weekly", "daily"]
    r = 0.12
    ear = (1 + r / ms) ** ms - 1
    assert abs(ear[3] - 0.12682503013196977) < 1e-12, "monthly EAR broken"
    assert abs((np.exp(r) - 1) - 0.1274968515793757) < 1e-12, "continuous limit broken"
    assert abs(ear[0] - r) < 1e-15, "annual compounding must return the nominal rate"

    fig, ax = plt.subplots()
    ax.semilogx(ms, 100 * ear, "o-", color=c[0], lw=2.2, ms=7.5)
    ax.axhline(100 * (np.exp(r) - 1), color=c[1], lw=1.4, ls="--")
    ax.axhline(100 * r, color=S.GUIDE[mode], lw=1.2, ls=":")
    S.label_end(ax, 365, 100 * ear[-1], "EAR = (1 + r/m)^m - 1", c[0], mode, dy=-13)
    ax.text(1.02, 100 * (np.exp(r) - 1) + 0.035,
            f"continuous limit  e^r - 1 = {100*(np.exp(r)-1):.4f}%",
            color=c[1], fontsize=9.5, fontweight="semibold")
    ax.text(1.02, 100 * r + 0.035,
            "the nominal 12% - right only when m = 1", color=S.INK_2[mode], fontsize=9.5)
    ax.plot([12], [100 * ear[3]], "o", color=S.INK[mode], ms=10,
            zorder=6, mfc="none", mew=1.8)
    S.note(ax, 14, 12.53, "12% compounded monthly\n= 12.6825% effective", mode)
    ax.set_xticks(ms)
    ax.set_xticklabels(labels, fontsize=9)
    ax.minorticks_off()
    ax.set_xlabel("compounding periods per year  m")
    ax.set_ylabel("effective annual rate  (%)")
    ax.set_title("Nominal rates only agree with reality when m = 1")
    ax.set_ylim(11.86, 12.90)
    S.strip(ax)
    return fig


@figure("econ-pw-profile")
def _(mode):
    """Present-worth profiles of two mutually exclusive alternatives.

    Both curves are NPV(i) = -C0 + A (P/A, i, 8) with the lesson's numbers:
    alternative A costs 50,000 and returns 15,000 a year, alternative B costs
    80,000 and returns 21,500 a year. Each curve crosses zero at its own IRR and
    the two cross each other at the incremental rate of return. The assertions
    fix all three rates found by bisection in this file - 24.951%, 21.043% and
    14.151% - and confirm the crossing is where the incremental NPV vanishes.
    """
    c = S.SERIES[mode]
    n = 8
    alts = {"A": (-50000.0, 15000.0), "B": (-80000.0, 21500.0)}

    def npv(C0, A, i):
        return C0 + A * f_PA(i, n)

    def root(C0, A):
        lo, hi = 1e-4, 3.0
        for _ in range(300):
            mid = 0.5 * (lo + hi)
            if npv(C0, A, mid) > 0:
                lo = mid
            else:
                hi = mid
        return 0.5 * (lo + hi)

    irr_a, irr_b = root(*alts["A"]), root(*alts["B"])
    irr_inc = root(alts["B"][0] - alts["A"][0], alts["B"][1] - alts["A"][1])
    assert abs(irr_a - 0.2495103445312879) < 1e-12, "IRR of A broken"
    assert abs(irr_b - 0.2104270442848289) < 1e-12, "IRR of B broken"
    assert abs(irr_inc - 0.1415148157633297) < 1e-12, "incremental IRR broken"
    assert abs(npv(*alts["A"], irr_inc) - npv(*alts["B"], irr_inc)) < 1e-3, \
        "profiles do not cross at the incremental IRR"

    i = np.linspace(0.005, 0.30, 900)
    fig, ax = plt.subplots()
    ax.plot(100 * i, [npv(*alts["A"], x) for x in i], color=c[0], lw=2.2)
    ax.plot(100 * i, [npv(*alts["B"], x) for x in i], color=c[1], lw=2.2)
    ax.axhline(0, color=S.INK_2[mode], lw=1.2)
    S.label_end(ax, 30.0, npv(*alts["A"], 0.30), "A: -50,000\n     +15,000/yr",
                c[0], mode, dx=7, dy=8)
    S.label_end(ax, 30.0, npv(*alts["B"], 0.30), "B: -80,000\n     +21,500/yr",
                c[1], mode, dx=7, dy=-8)
    for r, col in ((irr_a, c[0]), (irr_b, c[1])):
        ax.plot([100 * r], [0], "o", color=col, ms=7, zorder=5)
    S.note(ax, 100 * irr_b - 0.5, 3400, f"IRR(B) = {100*irr_b:.2f}%", mode, ha="right")
    S.note(ax, 100 * irr_a + 0.5, 3400, f"IRR(A) = {100*irr_a:.2f}%", mode)
    ax.plot([100 * irr_inc], [npv(*alts["A"], irr_inc)], "o",
            color=S.INK[mode], ms=8, zorder=6, mfc="none", mew=1.8)
    ax.axvline(100 * irr_inc, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 16.5, 46000,
           f"the profiles cross at {100*irr_inc:.2f}%,\nwhich IS the incremental IRR", mode)
    S.note(ax, 1.0, -21500, "left of the crossing B wins on NPV; right of it A wins -\n"
                            "which is why the bigger IRR alone does not choose", mode)
    ax.set_xlabel("discount rate  i  (%)")
    ax.set_ylabel("net present value  (dollars)")
    ax.set_title("Two profiles, three rates of return, one decision")
    ax.set_xlim(0, 31)
    ax.set_ylim(-25000, 72000)
    S.strip(ax)
    return fig


@figure("econ-breakeven")
def _(mode):
    """Total annual cost of two processes against volume, with the crossover.

    Both lines are TC = F + V Q for the lesson's numbers: process 1 has 50,000
    of fixed cost and 8.00 per unit, process 2 has 90,000 and 5.20 per unit. The
    third line is revenue at 26.00 per unit against a single-process cost of
    120,000 + 14.00 Q. The assertions fix the two break-even volumes the lesson
    computes: 14,285.71 units where the processes tie, and 10,000 units where
    revenue covers total cost.
    """
    c = S.SERIES[mode]
    F1, V1, F2, V2 = 50000.0, 8.00, 90000.0, 5.20
    q_star = (F2 - F1) / (V1 - V2)
    assert abs(q_star - 14285.714285714286) < 1e-9, "process crossover broken"
    assert abs((F1 + V1 * q_star) - (F2 + V2 * q_star)) < 1e-6, "costs do not tie"
    q_be = 120000.0 / (26.00 - 14.00)
    assert abs(q_be - 10000.0) < 1e-9, "revenue break-even broken"

    q = np.linspace(0, 26000, 900)
    fig, ax = plt.subplots()
    ax.plot(q / 1000, (F1 + V1 * q) / 1000, color=c[0], lw=2.2)
    ax.plot(q / 1000, (F2 + V2 * q) / 1000, color=c[1], lw=2.2)
    S.label_end(ax, 26.0, (F1 + V1 * 26000) / 1000,
                "process 1\n50,000 + 8.00 Q", c[0], mode, dy=6)
    S.label_end(ax, 26.0, (F2 + V2 * 26000) / 1000,
                "process 2\n90,000 + 5.20 Q", c[1], mode, dy=-8)
    ax.plot([q_star / 1000], [(F1 + V1 * q_star) / 1000], "o",
            color=S.INK[mode], ms=8, zorder=6, mfc="none", mew=1.8)
    ax.axvline(q_star / 1000, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, q_star / 1000 - 0.5, 60,
           f"processes tie at\n{q_star:,.0f} units", mode, ha="right")
    S.note(ax, q_star / 1000 + 0.7, 95, "above this volume the\nhigh-fixed-cost process\n"
                                        "is cheaper", mode)
    S.note(ax, 0.4, 268, "cost lines only: the cheaper process at a given volume is\n"
                         "the one whose line is lower there, nothing else", mode)
    ax.set_xlabel("annual volume  Q  (thousands of units)")
    ax.set_ylabel("total annual cost  (thousands of dollars)")
    ax.set_title("Fixed cost buys a flatter slope; volume decides whether that pays")
    ax.set_xlim(0, 29.5)
    ax.set_ylim(0, 300)
    S.strip(ax)
    return fig


@figure("econ-depreciation-book-value")
def _(mode):
    """Book value of one asset under four depreciation schedules.

    The asset is the lesson's: 90,000 first cost, 10,000 salvage, five-year
    life, five-year MACRS property. Straight line, double declining balance
    floored at salvage, and sum-of-years-digits are each generated from their
    own recursion; the MACRS percentages are DERIVED here from 200% declining
    balance with the half-year convention and the switch to straight line, then
    asserted against the published five-year column before use. All four
    schedules are computed and asserted; three are drawn, because the house
    palette carries three categorical hues and a fourth line on crossing curves
    is an all-pairs contrast problem. Double declining balance is the one left
    to the lesson's table, where its year-by-year numbers are printed in full.
    """
    c = S.SERIES[mode]
    C, Sv, N = 90000.0, 10000.0, 5

    def macrs_pct(nyr, mult=2.0):
        basis, rem, out = 1.0, float(nyr), []
        for k in range(nyr + 1):
            half = 0.5 if k in (0, nyr) else 1.0
            d = max(basis * mult / nyr * half, basis / rem * half)
            out.append(d)
            basis -= d
            rem -= half
        return out

    pct = macrs_pct(5)
    published = [0.2000, 0.3200, 0.1920, 0.1152, 0.1152, 0.0576]
    assert max(abs(a - b) for a, b in zip(pct, published)) < 1e-12, \
        "derived MACRS 5-year column does not match the published one"
    assert abs(sum(pct) - 1.0) < 1e-12, "MACRS percentages do not sum to one"

    sl = [C - (C - Sv) / N * k for k in range(N + 1)]
    ddb, bv = [C], C
    for _ in range(N):
        bv -= min(bv * 2 / N, max(0.0, bv - Sv))
        ddb.append(bv)
    syd, bv, tot = [C], C, N * (N + 1) / 2
    for k in range(1, N + 1):
        bv -= (N - k + 1) / tot * (C - Sv)
        syd.append(bv)
    mac, bv = [C], C
    for p in published:
        bv -= C * p
        mac.append(bv)
    assert abs(sl[-1] - Sv) < 1e-9 and abs(ddb[-1] - Sv) < 1e-9 and abs(syd[-1] - Sv) < 1e-9, \
        "book value should land on salvage for SL, DDB and SYD"
    assert abs(mac[-1]) < 1e-9, "MACRS must depreciate to zero"

    fig, ax = plt.subplots()
    yr = np.arange(N + 1)
    ax.plot(yr, np.array(sl) / 1000, "o-", color=c[0], lw=2.1, ms=6)
    ax.plot(yr, np.array(syd) / 1000, "o-", color=c[1], lw=2.1, ms=6)
    ax.plot(np.arange(len(mac)), np.array(mac) / 1000, "o-", color=c[2], lw=2.1, ms=6)
    S.label_end(ax, 3.0, sl[3] / 1000, "straight line", c[0], mode, dy=13, ha="center")
    S.label_end(ax, 1.0, syd[1] / 1000, "sum-of-years-digits", c[1], mode,
                dx=-8, dy=-15, ha="right")
    S.label_end(ax, 6.0, 0.0, "MACRS 5-year", c[2], mode, dx=7)
    ax.axhline(Sv / 1000, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.05, 2.0, "dotted: the 10,000 salvage value - a floor for the book\n"
                          "methods, and ignored entirely by MACRS", mode)
    ax.set_xlabel("end of year")
    ax.set_ylabel("book value  (thousands of dollars)")
    ax.set_title("Same asset, same total write-off, different years to take it in")
    ax.set_xticks(range(0, 7))
    ax.set_xlim(-0.75, 6.4)
    ax.set_ylim(-4, 96)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Ethics and Professional Practice
# ---------------------------------------------------------------------------


@figure("eth-duty-hierarchy")
def _(mode):
    """DECLARED SCHEMATIC - not data. The order in which competing duties are
    resolved, drawn as the decision path the lesson reasons through. Nothing on
    this canvas is measured or computed; the boxes are the lesson's own summary
    of the priority order, and the caption in the lesson says so."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    _blank(ax)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    _box(ax, 0.03, 0.865, 0.94, 0.105,
         "One decision, several interests. Ask these in order.",
         mode, edge=S.GUIDE[mode], size=10.5, weight="semibold")
    rows = [
        (0.700, "1.  Public safety, health or welfare at risk?", c[0],
         "If yes, that settles it. Nothing below\noutranks this line."),
        (0.548, "2.  Any law or regulation broken?", c[1],
         "Legal duty comes next, and no contract\ncan waive it."),
        (0.396, "3.  A code of ethics breached?", c[1],
         "A code binds the licensee even where\nthe law is silent."),
        (0.244, "4.  Employer's or client's interest harmed?", c[2],
         "Faithful-agent duty operates only inside\nthe three tests above."),
        (0.092, "5.  Only my own interest affected?", S.GUIDE[mode],
         "Last, and never a reason to move any\ntest above it."),
    ]
    for y, q, col, why in rows:
        _box(ax, 0.02, y, 0.50, 0.098, q, mode, edge=col, size=9.2)
        ax.text(0.555, y + 0.049, why, ha="left", va="center",
                color=S.INK_2[mode], fontsize=8.4)
        if y > 0.10:
            _arrow(ax, (0.27, y), (0.27, y - 0.049), mode)
    ax.text(0.27, 0.038, "answer at the FIRST test that applies", ha="center",
            va="center", color=S.INK[mode], fontsize=9.5, fontweight="semibold")
    ax.set_title("Declared schematic: the duty ladder, resolved top down")
    return fig


@figure("eth-ip-map")
def _(mode):
    """DECLARED SCHEMATIC - not data. Which intellectual-property right attaches
    to which kind of engineering output, drawn as a sorting question. The term
    lengths shown are the statutory ones cited in the lesson; the layout itself
    is a teaching device, and the caption in the lesson declares it as such."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    _blank(ax)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    _box(ax, 0.28, 0.87, 0.44, 0.10, "What exactly are you protecting?", mode,
         edge=S.GUIDE[mode], size=10.5, weight="semibold")
    cols = [
        (0.015, "how it\nWORKS", "utility patent", "20 years from\nthe filing date", c[0]),
        (0.212, "how it\nLOOKS", "design patent", "15 years from\nthe grant date", c[0]),
        (0.409, "what it\nSAYS", "copyright", "life + 70 years\n(95 or 120 if\nmade for hire)", c[1]),
        (0.606, "who MADE\nit", "trademark", "10-year terms,\nrenewable\nindefinitely", c[2]),
        (0.803, "what you\nKNOW", "trade secret", "as long as it\nstays secret", c[2]),
    ]
    for x, question, right, term, col in cols:
        _box(ax, x + 0.008, 0.615, 0.166, 0.135, question, mode, edge=S.GRID[mode], size=9.2)
        _arrow(ax, (x + 0.091, 0.615), (x + 0.091, 0.545), mode)
        _box(ax, x + 0.008, 0.395, 0.166, 0.135, right, mode, edge=col, size=9.4,
             weight="semibold")
        ax.text(x + 0.091, 0.335, term, ha="center", va="top",
                color=S.INK_2[mode], fontsize=8.4)
        _arrow(ax, (0.5, 0.87), (x + 0.091, 0.755), mode)
    ax.text(0.5, 0.115, "One product usually needs several at once: the circuit is patented,\n"
                        "the firmware is copyrighted, the logo is a trademark, the yield "
                        "recipe stays a trade secret.",
            ha="center", va="center", color=S.INK[mode], fontsize=9)
    ax.set_title("Declared schematic: sorting an engineering output into its right")
    return fig


@figure("eth-shock-current")
def _(mode):
    """Current through a body path against body resistance, computed from I = V/R.

    Both curves are Ohm's law at the two voltages the lesson uses, 120 V and
    480 V, swept over the whole plausible range of hand-to-hand resistance. The
    horizontal bands are the published physiological thresholds quoted in the
    lesson. The assertions fix the worked crossings: 120 V through 1,500 ohm is
    80 mA, and the 5 mA a GFCI responds to needs 24,000 ohm at 120 V.
    """
    c = S.SERIES[mode]
    assert abs(120 / 1500 * 1000 - 80.0) < 1e-9, "worked body current broken"
    assert abs(120 / 24000 * 1000 - 5.0) < 1e-9, "GFCI-threshold resistance broken"
    R = np.logspace(2.7, 5.3, 900)

    fig, ax = plt.subplots()
    for k, V in enumerate((120.0, 480.0)):
        ax.loglog(R, 1000 * V / R, color=c[k], lw=2.3)
    ax.text(6.2e2, 260, "120 V", color=c[0], fontsize=10, fontweight="semibold")
    ax.text(6.2e2, 1050, "480 V", color=c[1], fontsize=10, fontweight="semibold")
    # thresholds live in the RIGHT MARGIN, where no curve can ever reach them
    for hi in (5, 30, 150):
        ax.axhline(hi, color=S.GRID[mode], lw=0.9, ls=":")
    ax.axhline(5.0, color=S.GUIDE[mode], lw=1.4, ls="--")
    for y, lab in ((1.5, "perception, mild shock"),
                   (2.9, "  GFCI acts at about 5 mA"),
                   (12.5, "let-go range: the hand\nno longer obeys"),
                   (68, "severe pain,\nrespiratory arrest"),
                   (700, "fibrillation range")):
        ax.text(2.75e5, y, lab, color=S.INK_2[mode], fontsize=8.6,
                va="center", ha="left", clip_on=False)
    ax.plot([1500], [80], "o", color=c[0], ms=7.5, zorder=6)
    ax.plot([24000], [5], "o", color=c[0], ms=7.5, zorder=6)
    S.note(ax, 5.9e2, 0.52, "the two marked points on the 120 V curve:\n"
                            "1,500 ohm (damp hands) draws 80 mA;\n"
                            "only above 24,000 ohm does 120 V stay under 5 mA", mode)
    ax.set_xlabel("body-path resistance  (ohm)")
    ax.set_ylabel("current through the body  (mA)")
    ax.set_title("Voltage is the label on the panel; current is what hurts you")
    ax.set_xlim(5e2, 2.4e5)
    ax.set_ylim(0.4, 3000)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Exam Strategy
# ---------------------------------------------------------------------------


@figure("strat-pace-checkpoints")
def _(mode):
    """Questions completed against elapsed time, at the only pace that finishes.

    The straight line is 110 questions spread over the 320 minutes NCEES
    publishes as FE testing time, i.e. 174.5 seconds each; the marked points are
    the checkpoints the lesson tabulates. The shaded wedge is the recovery cost
    of falling behind: a candidate who is ten questions down at the halfway mark
    must run the second half at the steeper dashed rate. The assertions fix the
    per-question budget and the halfway checkpoint.
    """
    c = S.SERIES[mode]
    total_min, nq = 320.0, 110
    per_q = total_min * 60 / nq
    assert abs(per_q - 174.54545454545453) < 1e-9, "per-question budget broken"
    assert abs(160.0 / (total_min / nq) - 55.0) < 1e-9, "halfway checkpoint broken"

    t = np.linspace(0, total_min, 400)
    fig, ax = plt.subplots()
    ax.plot(t, t / (total_min / nq), color=c[0], lw=2.4)
    behind = np.linspace(160, total_min, 200)
    ax.plot(behind, 45 + (behind - 160) * (nq - 45) / (total_min - 160),
            color=c[1], lw=2.0, ls="--")
    ax.fill_between(behind, 45 + (behind - 160) * (nq - 45) / (total_min - 160),
                    behind / (total_min / nq), color=c[1], alpha=0.12, zorder=0)
    S.label_end(ax, 28, 78, "on pace: 174.5 s per question", c[0], mode, dx=0)
    S.label_end(ax, 238, 63, "ten behind at halftime means\n147 s per question to recover",
                c[1], mode, dx=0)
    for tm in (60, 120, 160, 240):
        q = tm / (total_min / nq)
        ax.plot([tm], [q], "o", color=c[0], ms=6.5, zorder=5)
        ax.text(tm, q + 3.0, f"{tm} min\nQ{round(q)}", ha="center", va="bottom",
                color=S.INK_2[mode], fontsize=8.6)
    ax.plot([320], [110], "o", color=c[0], ms=6.5, zorder=5)
    ax.axvline(160, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 6, 108, "the 6-hour appointment is not 6 hours of exam: 2 min agreement,\n"
                       "8 min tutorial, 320 min testing, 25 min scheduled break", mode)
    ax.set_xlabel("elapsed testing time  (minutes)")
    ax.set_ylabel("questions completed")
    ax.set_title("The pace line is fixed the moment the clock starts")
    ax.set_xlim(0, 345)
    ax.set_ylim(0, 128)
    S.strip(ax)
    return fig


@figure("strat-handbook-map")
def _(mode):
    """DECLARED SCHEMATIC - not data, and not a reproduction. It shows the KIND
    of index a candidate should build for themselves: a question type on the
    left, the handbook division it lives in on the right. No page numbers, no
    handbook wording, and no part of the handbook's own layout is reproduced -
    the lesson's caption declares it a schematic."""
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    _blank(ax)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)

    _box(ax, 0.02, 0.895, 0.96, 0.085,
         "what the question sounds like    ->    where you look",
         mode, edge=S.GUIDE[mode], size=10, weight="semibold")
    pairs = [
        ("\"...find the steady-state error...\"", "control systems division", c[0]),
        ("\"...the line current in a delta load...\"", "three-phase power division", c[0]),
        ("\"...effective annual interest...\"", "engineering economics division", c[1]),
        ("\"...probability that at least one...\"", "probability and statistics division", c[1]),
        ("\"...an engineer discovers that...\"", "ethics division", c[2]),
        ("\"...the transform of a ramp...\"", "mathematics division", c[2]),
    ]
    y = 0.815
    for left, right, col in pairs:
        _box(ax, 0.02, y - 0.082, 0.44, 0.082, left, mode, edge=S.GRID[mode], size=9)
        _arrow(ax, (0.475, y - 0.041), (0.535, y - 0.041), mode, colour=col)
        _box(ax, 0.545, y - 0.082, 0.435, 0.082, right, mode, edge=col, size=9)
        y -= 0.118
    ax.text(0.5, 0.048, "Build this table yourself from the current handbook, then practise "
                        "until the right column\narrives before you finish reading the left one.",
            ha="center", va="center", color=S.INK[mode], fontsize=9)
    ax.set_title("Declared schematic: a personal index is a lookup, not a search")
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
