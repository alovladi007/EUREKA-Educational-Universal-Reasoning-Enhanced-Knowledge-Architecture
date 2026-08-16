#!/usr/bin/env python3
"""Electronics-wave figures (elec2-*) for the FE Electrical and Computer course.

Same contract as gen_fe_ee_w3.py, and the same shared style module: every curve
is COMPUTED here from the equation the lesson states, in code the reader can
check. Nothing is traced, scanned or adapted from the NCEES Reference Handbook
or any textbook — the pipeline consumes formulas, which are not protected
expression, and never anyone's drawing of them.

Every identity a figure asserts in its caption is checked numerically BEFORE the
figure is drawn, and the tolerances are tight on purpose: an earlier figure in
this course shipped a "92.6" label against a true 92.52 because its assertion
used a 0.1 slack. Assertions here compare to 1e-9 relative wherever the quantity
is exact, and to the last printed digit wherever it is rounded.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_e1.py                 # all
    python3 scripts/gen_fe_ee_e1.py elec2-mos       # only names with that prefix
    python3 scripts/gen_fe_ee_e1.py '' /tmp/insp    # also dump opaque PNGs there
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

VT = 0.026          # thermal voltage at room temperature, V (tabulated standard)


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def close(a, b, tol=1e-9, what=""):
    """Relative comparison with a tight default. Used for every caption claim."""
    a, b = float(a), float(b)
    scale = max(abs(a), abs(b), 1e-30)
    assert abs(a - b) / scale <= tol, f"{what}: {a!r} vs {b!r} (rel {abs(a-b)/scale:.2e})"


# ===========================================================================
# DIODE CIRCUITS
# ===========================================================================


@figure("elec2-rect-waveforms")
def _(mode):
    """Half-wave and full-wave rectified sine with their computed averages.

    Both traces come from the same 17.0 V peak sinusoid: the half-wave trace is
    max(v, 0) and the full-wave trace is |v|. The two horizontal lines are the
    lesson's formulas Vm/pi and 2Vm/pi, and the assertion checks them against
    the numerical mean of the plotted samples.
    """
    c = S.SERIES[mode]
    Vm = 17.0
    t = np.linspace(0, 2.0, 4001)            # in periods, for drawing
    v = Vm * np.sin(2 * np.pi * t)
    half, full = np.maximum(v, 0.0), np.abs(v)

    # Averages are taken on a grid that covers whole periods without repeating
    # the endpoint, so the sample mean IS the cycle average, not an approximation
    # biased by a doubled sample.
    tm = np.arange(200000) / 200000.0
    vm_ = Vm * np.sin(2 * np.pi * tm)
    close(np.maximum(vm_, 0.0).mean(), Vm / np.pi, 1e-6, "half-wave average")
    close(np.abs(vm_).mean(), 2 * Vm / np.pi, 1e-6, "full-wave average")
    close(Vm / np.pi, 5.4113, 1e-4, "Vm/pi printed value")
    close(2 * Vm / np.pi, 10.8225, 1e-4, "2Vm/pi printed value")

    fig, ax = plt.subplots()
    ax.plot(t, full, color=c[1], lw=2.0)
    ax.plot(t, half, color=c[0], lw=2.4)
    ax.axhline(2 * Vm / np.pi, color=c[1], lw=1.2, ls="--")
    ax.axhline(Vm / np.pi, color=c[0], lw=1.2, ls="--")
    S.label_end(ax, 2.0, full[-1] + 1.0, "full wave  |v|", c[1], mode, dx=-4, ha="right")
    S.label_end(ax, 1.25, Vm * 0.98, "half wave  max(v, 0)", c[0], mode, ha="center", dy=8)
    S.note(ax, 0.02, 2 * Vm / np.pi + 0.35, "2Vm/pi = 10.82 V average", mode)
    S.note(ax, 0.02, Vm / np.pi + 0.35, "Vm/pi = 5.41 V average", mode)
    S.note(ax, 1.62, 0.5, "the missing half cycle\nis the whole difference", mode)
    ax.set_xlabel("time  (periods of the 60 Hz input)")
    ax.set_ylabel("output voltage  (V)")
    ax.set_title("Same 17 V peak: flipping the negative half doubles the average")
    ax.set_xlim(0, 2.0)
    ax.set_ylim(0, 19.5)
    S.strip(ax)
    return fig


@figure("elec2-ripple-vs-c")
def _(mode):
    """Peak-to-peak ripple against filter capacitance, both rectifier types.

    Straight from the lesson's discharge model dV = Idc/(k f C), with k = 1 for
    half wave and k = 2 for full wave, at Idc = 150 mA and f = 60 Hz. The three
    marked points are the values quoted in the text.
    """
    c = S.SERIES[mode]
    Idc, f = 0.150, 60.0
    C = np.linspace(200e-6, 6000e-6, 900)
    half = Idc / (f * C)
    full = Idc / (2 * f * C)

    close(Idc / (2 * f * 2500e-6), 0.5, 1e-12, "2500 uF full-wave ripple")
    close(Idc / (2 * f * 1000e-6), 1.25, 1e-12, "1000 uF full-wave ripple")
    close(Idc / (2 * f * 3300e-6), 0.378787878787879, 1e-9, "3300 uF full-wave ripple")
    close(Idc / (f * 2500e-6), 1.0, 1e-12, "2500 uF half-wave ripple")

    fig, ax = plt.subplots()
    ax.plot(C * 1e6, half, color=c[1], lw=2.2)
    ax.plot(C * 1e6, full, color=c[0], lw=2.2)
    S.label_end(ax, 3400, Idc / (f * 3400e-6), "half wave\ndV = Idc/(fC)", c[1], mode, dy=10)
    S.label_end(ax, 4400, Idc / (2 * f * 4400e-6), "full wave\ndV = Idc/(2fC)", c[0], mode, dy=12)
    for cv, lab in ((1000e-6, "1000 uF\n1.25 V"), (2500e-6, "2500 uF\n0.50 V"),
                    (3300e-6, "3300 uF\n0.38 V")):
        y = Idc / (2 * f * cv)
        ax.plot([cv * 1e6], [y], "o", color=c[0], ms=6.5, zorder=5)
        S.note(ax, cv * 1e6 + 90, y + 0.10, lab, mode, size=8.5)
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 5950, 0.60, "0.5 V design limit", mode, ha="right")
    ax.set_xlabel("filter capacitance  C  (uF)")
    ax.set_ylabel("peak-to-peak ripple  (V)")
    ax.set_title("Ripple falls as 1/C, and the bridge starts at half the height")
    ax.set_xlim(200, 6000)
    ax.set_ylim(0, 3.2)
    S.strip(ax)
    return fig


@figure("elec2-diode-loadline")
def _(mode):
    """Graphical solution of a 5 V source, 1 kohm resistor and one real diode.

    The curved trace is i = Is(exp(v/VT) - 1) with Is = 1 pA and VT = 26 mV; the
    straight trace is the load line i = (5 - v)/1000. The marked intersection is
    found by bisection and then checked against BOTH defining equations, which
    is what makes it the operating point rather than a guess.
    """
    c = S.SERIES[mode]
    Is, Vs, R = 1e-12, 5.0, 1000.0

    def f(v):
        return (Vs - v) / R - Is * (np.exp(v / VT) - 1)

    lo, hi = 0.2, 0.9
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    vq = 0.5 * (lo + hi)
    iq = (Vs - vq) / R
    close(iq, Is * (np.exp(vq / VT) - 1), 1e-9, "Q on the diode curve")
    close(iq, (Vs - vq) / R, 1e-12, "Q on the load line")
    close(vq, 0.577459, 1e-5, "Q voltage printed value")
    close(iq * 1e3, 4.4225, 1e-4, "Q current printed value")
    i_cd = (Vs - 0.7) / R
    close(i_cd * 1e3, 4.3, 1e-12, "constant-drop current")

    v = np.linspace(0, 0.75, 1400)
    fig, ax = plt.subplots()
    ax.plot(v, Is * (np.exp(v / VT) - 1) * 1e3, color=c[0], lw=2.2)
    ax.plot([0, Vs], [Vs / R * 1e3, 0], color=c[1], lw=2.2)
    ax.plot([vq], [iq * 1e3], "o", color=S.INK[mode], ms=8, zorder=6)
    ax.plot([0.7], [i_cd * 1e3], "s", color=S.GUIDE[mode], ms=7, zorder=6)
    S.label_end(ax, 0.62, 4.8, "diode law\ni = Is(e^(v/VT) - 1)", c[0], mode, ha="right")
    S.label_end(ax, 0.30, (Vs - 0.30) / R * 1e3, "load line  i = (5 - v)/1 kohm", c[1], mode, dy=8)
    S.note(ax, vq - 0.015, iq * 1e3 - 0.75, "Q: 0.577 V, 4.42 mA", mode, ha="right")
    S.note(ax, 0.712, i_cd * 1e3 - 0.95, "square: the 0.7 V model's\nanswer, 4.30 mA (2.8% low)", mode)
    ax.set_xlabel("diode voltage  v  (V)")
    ax.set_ylabel("current  i  (mA)")
    ax.set_title("Two equations, one crossing: the operating point")
    ax.set_xlim(0, 0.86)
    ax.set_ylim(0, 5.6)
    S.strip(ax)
    return fig


@figure("elec2-zener-line-regulation")
def _(mode):
    """Regulator output against input voltage, with and without the Zener.

    Below breakdown the Zener is an open circuit and the output is the plain
    divider Vin*RL/(Rs+RL). Above it, KCL at the output node with the piecewise
    linear Zener model Vz = Vz0 + rz*Iz gives the flat branch. Vz0 = 4.90 V is
    the intercept that makes the model read 5.10 V at its 20 mA test current
    with rz = 10 ohm, so the two descriptions agree where the datasheet does.
    """
    c = S.SERIES[mode]
    Rs, RL, rz = 150.0, 510.0, 10.0
    Vz0 = 5.1 - rz * 0.020

    close(Vz0, 4.9, 1e-12, "Zener intercept")
    vin_drop = Vz0 * (Rs + RL) / RL
    close(vin_drop, 6.341176470588235, 1e-9, "dropout input voltage")

    def vo_on(vin):
        return (vin / Rs + Vz0 / rz) / (1 / Rs + 1 / rz + 1 / RL)

    close(vo_on(12.0), 5.247292418772562, 1e-9, "output at 12 V in")
    close((vo_on(15.0) - vo_on(9.0)) / 6.0, 1 / (1 + Rs / rz + Rs / RL), 1e-9,
          "line regulation slope")
    close(1 / (1 + Rs / rz + Rs / RL), 0.06137184115523466, 1e-12, "attenuation factor")
    # ideal-Zener current at the lesson's 12 V operating point
    close((12.0 - 5.1) / Rs - 5.1 / RL, 0.036, 1e-9, "ideal Iz at 12 V")

    vin = np.linspace(2.0, 18.0, 1200)
    vout = np.where(vin < vin_drop, vin * RL / (Rs + RL), vo_on(vin))
    fig, ax = plt.subplots()
    ax.plot(vin, vin * RL / (Rs + RL), color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.plot(vin, vout, color=c[0], lw=2.4)
    ax.plot([vin_drop], [Vz0], "o", color=S.INK[mode], ms=7.5, zorder=6)
    S.label_end(ax, 18.0, vo_on(18.0), "regulated:\n61 mV out per volt in", c[0], mode,
                dx=-6, dy=14, ha="right")
    S.label_end(ax, 5.2, 5.2 * RL / (Rs + RL), "no Zener: plain divider,\n773 mV out per volt in",
                S.GUIDE[mode], mode, dy=-16)
    S.note(ax, vin_drop + 0.25, Vz0 - 0.95, "dropout at Vin = 6.34 V:\nbelow this the Zener\nis simply not conducting", mode)
    ax.axhline(5.1, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 17.9, 5.14, "nominal 5.1 V", mode, ha="right")
    ax.set_xlabel("input voltage  Vin  (V)")
    ax.set_ylabel("output voltage  Vo  (V)")
    ax.set_title("Regulation is an attenuator: 16 V of input swing becomes 1 V")
    ax.set_xlim(2, 18)
    ax.set_ylim(0, 6.6)
    S.strip(ax)
    return fig


@figure("elec2-clipper-transfer")
def _(mode):
    """Transfer characteristic of a double-ended biased parallel clipper.

    Two branches shunt the output: a diode in series with +3.0 V clips above
    3.7 V, and a reversed diode in series with -2.0 V clips below -2.7 V. Each
    conducting branch is given the diode's dynamic resistance rd = VT/I in
    series with the 1 kohm source resistor, so the clipped segments have the
    small real slope rd/(R + rd) rather than being drawn flat by hand.
    """
    c = S.SERIES[mode]
    R, rd = 1000.0, 6.0
    hi, lo = 3.0 + 0.7, -(2.0 + 0.7)

    close(hi, 3.7, 1e-12, "upper clip level")
    close(lo, -2.7, 1e-12, "lower clip level")
    slope = rd / (R + rd)
    close(slope, 0.005964214711729622, 1e-12, "clipped-segment slope")

    vi = np.linspace(-8, 8, 1600)
    vo = np.where(vi > hi, hi + (vi - hi) * slope,
                  np.where(vi < lo, lo + (vi - lo) * slope, vi))
    close(np.interp(6.0, vi, vo), hi + (6.0 - hi) * slope, 2e-3, "output at +6 V in")
    close(hi + (6.0 - hi) * slope, 3.7137, 1e-4, "printed output at +6 V in")

    fig, ax = plt.subplots()
    ax.plot(vi, vi, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot(vi, vo, color=c[0], lw=2.6)
    for lvl, txt, dy in ((hi, "+3.0 V bias + 0.7 V = 3.7 V", 10), (lo, "-2.0 V bias - 0.7 V = -2.7 V", -18)):
        ax.axhline(lvl, color=S.GUIDE[mode], lw=0.9, ls=":")
        S.note(ax, -7.8, lvl + (0.30 if dy > 0 else -0.85), txt, mode, size=9)
    S.label_end(ax, 7.0, vo[np.searchsorted(vi, 7.0)], "clipped output", c[0], mode, dy=10)
    S.label_end(ax, -6.6, -6.6, "vo = vi (both diodes off)", S.GUIDE[mode], mode, dy=-12)
    ax.plot([hi], [hi], "o", color=S.INK[mode], ms=6)
    ax.plot([lo], [lo], "o", color=S.INK[mode], ms=6)
    ax.set_xlabel("input voltage  vi  (V)")
    ax.set_ylabel("output voltage  vo  (V)")
    ax.set_title("Unity slope between the breakpoints, near-zero slope outside")
    ax.set_xlim(-8, 8)
    ax.set_ylim(-8, 8)
    S.strip(ax)
    return fig


# ===========================================================================
# BJT
# ===========================================================================


@figure("elec2-bjt-loadline-qpoint")
def _(mode):
    """Output characteristics with the DC load line and the design's Q-point.

    The family is IC = beta*IB*(1 + VCE/VA) for beta = 100 and VA = 100 V, cut
    off below the saturation knee. The load line is the KVL statement
    VCE = VCC - IC(RC + RE) for the Section 3 design (VCC = 12 V, RC = 270 ohm,
    RE = 2.7 kohm), and the Q-point is the divider bias answer IE = 1.963 mA.
    The assertion checks that the Q-point lies on the load line exactly.
    """
    c = S.SERIES[mode]
    VCC, RC, RE, VA, beta = 12.0, 270.0, 2700.0, 100.0, 100.0
    IE = (6.0 - 0.7) / RE
    VCEq = VCC - IE * (RC + RE)

    close(IE * 1e3, 1.9629629629629632, 1e-9, "quiescent current")
    close(VCEq, VCC - IE * (RC + RE), 1e-12, "Q on the load line")
    close(VCEq, 6.17, 1e-12, "quiescent VCE")
    close(VCC / (RC + RE) * 1e3, 4.040404040404041, 1e-9, "load-line current intercept")

    vce = np.linspace(0, 12, 800)
    fig, ax = plt.subplots()
    for i, ib_uA in enumerate((10.0, 20.0, 30.0)):
        ic = beta * ib_uA * 1e-6 * (1 + vce / VA)
        knee = 0.2
        ic = np.where(vce < knee, ic * vce / knee, ic)
        ax.plot(vce, ic * 1e3, color=c[i], lw=1.9)
        S.label_end(ax, 12.0, ic[-1] * 1e3, f"IB = {ib_uA:.0f} uA", c[i], mode)
    ax.plot([0, VCC], [VCC / (RC + RE) * 1e3, 0], color=S.GUIDE[mode], lw=2.0)
    ax.plot([VCEq], [IE * 1e3], "o", color=S.INK[mode], ms=8.5, zorder=6)
    S.note(ax, VCEq - 0.35, IE * 1e3 + 0.24, "Q: 6.17 V, 1.96 mA", mode, ha="right")
    S.note(ax, 6.4, 3.30, "load line: VCE = 12 - IC(RC + RE),\nslope -1/2.97 kohm", mode)
    S.note(ax, 0.35, 0.16, "saturation\nedge", mode)
    ax.set_xlabel("collector-emitter voltage  VCE  (V)")
    ax.set_ylabel("collector current  IC  (mA)")
    ax.set_title("The circuit draws the line; the transistor picks the curve")
    ax.set_xlim(0, 13.6)
    ax.set_ylim(0, 4.4)
    S.strip(ax)
    return fig


@figure("elec2-bjt-gain-vs-re")
def _(mode):
    """Common-emitter gain against unbypassed emitter resistance.

    |Av| = gm*RC/(1 + gm*RE) with gm = 75.5 mS and RC = 270 ohm from the
    Section 3 design, plotted against the swamped approximation RC/RE. The two
    curves converge once gm*RE exceeds one, which is the entire content of the
    "gain becomes RC/RE" rule.
    """
    c = S.SERIES[mode]
    IE = (6.0 - 0.7) / 2700.0
    gm, RC = IE / VT, 270.0

    close(gm * 1e3, 75.49857549857549, 1e-9, "gm in mS")
    close(gm * RC, 20.384615384615383, 1e-9, "gain with RE fully bypassed")
    for re_, want in ((10.0, 11.6150), (27.0, 6.7086), (100.0, 2.3840)):
        close(gm * RC / (1 + gm * re_), want, 1e-4, f"gain at RE = {re_}")

    RE = np.linspace(0.5, 300, 900)
    exact = gm * RC / (1 + gm * RE)
    approx = RC / RE
    fig, ax = plt.subplots()
    ax.plot(RE, approx, color=c[1], lw=1.8, ls="--")
    ax.plot(RE, exact, color=c[0], lw=2.4)
    S.label_end(ax, 210, gm * RC / (1 + gm * 210), "exact  gm*RC/(1 + gm*RE)", c[0], mode, dy=-13)
    S.label_end(ax, 150, RC / 150, "swamped approximation  RC/RE", c[1], mode, dy=12)
    for re_ in (10.0, 27.0, 100.0):
        ax.plot([re_], [gm * RC / (1 + gm * re_)], "o", color=c[0], ms=6.5, zorder=5)
    S.note(ax, 12, 12.6, "RE = 10 ohm: |Av| = 11.6\n(1/gm is only 13.2 ohm,\nso a 10 ohm resistor\nalready halves the gain)", mode)
    ax.axhline(gm * RC, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 297, 20.9, "fully bypassed: 20.4", mode, ha="right")
    ax.set_xlabel("unbypassed emitter resistance  RE  (ohm)")
    ax.set_ylabel("voltage gain magnitude  |Av|")
    ax.set_title("Emitter degeneration trades gain away at 1/gm per ohm")
    ax.set_xlim(0, 300)
    ax.set_ylim(0, 24)
    S.strip(ax)
    return fig


@figure("elec2-bjt-swing")
def _(mode):
    """Maximum symmetric output swing against the quiescent VCE.

    A common-emitter stage with 3 kohm in the DC collector path off a 12 V
    supply can swing up by VCC - VCEQ before the transistor runs out of current
    and down by VCEQ - 0.2 V before it saturates. The smaller of the two is
    plotted; its peak is the midpoint bias (VCC + VCEsat)/2, which the assertion
    locates numerically rather than assuming.
    """
    c = S.SERIES[mode]
    VCC, Vsat = 12.0, 0.2
    vceq = np.linspace(0.25, 11.9, 1400)
    up, down = VCC - vceq, vceq - Vsat
    sym = np.minimum(up, down)
    k = int(np.argmax(sym))

    close(vceq[k], (VCC + Vsat) / 2, 5e-3, "peak-swing bias point")
    close(sym[k], (VCC - Vsat) / 2, 5e-3, "peak symmetric swing")
    close((VCC + Vsat) / 2, 6.1, 1e-12, "printed optimum VCEQ")
    close((VCC - Vsat) / 2, 5.9, 1e-12, "printed peak swing")

    fig, ax = plt.subplots()
    ax.plot(vceq, up, color=c[1], lw=1.7, ls="--")
    ax.plot(vceq, down, color=c[2], lw=1.7, ls="--")
    ax.plot(vceq, sym, color=c[0], lw=2.8)
    S.label_end(ax, 2.2, VCC - 2.2, "headroom up:  VCC - VCEQ", c[1], mode, dy=8)
    S.label_end(ax, 9.6, 9.6 - Vsat, "headroom down:  VCEQ - 0.2 V", c[2], mode, dy=10, ha="right")
    S.label_end(ax, 8.6, np.minimum(VCC - 8.6, 8.6 - Vsat), "usable symmetric swing", c[0], mode,
                dy=-14, ha="right")
    ax.plot([(VCC + Vsat) / 2], [(VCC - Vsat) / 2], "o", color=S.INK[mode], ms=8, zorder=6)
    S.note(ax, 6.25, 5.98, "6.1 V bias, 5.9 V peak", mode)
    S.note(ax, 0.4, 8.2, "bias too low:\nclips on the\nsaturation side", mode)
    S.note(ax, 11.6, 8.2, "bias too high:\nclips on the\ncutoff side", mode, ha="right")
    ax.set_xlabel("quiescent collector-emitter voltage  VCEQ  (V)")
    ax.set_ylabel("peak output swing before clipping  (V)")
    ax.set_title("Whichever headroom is smaller is the one that clips")
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 12.4)
    S.strip(ax)
    return fig


@figure("elec2-bjt-vbe-decade")
def _(mode):
    """Collector current against base-emitter voltage on a logarithmic axis.

    IC = Is*exp(VBE/VT) with VT = 26 mV and Is = 2e-15 A, the saturation current
    that puts 1 mA at exactly 0.700 V so the device agrees with the constant-drop
    model at its usual design current. On a log current axis the exponential is a
    straight line, and the marked ladder shows the decade spacing VT*ln(10),
    which the assertion pins to 59.87 mV rather than to the 60 mV the prose
    rounds it to.
    """
    c = S.SERIES[mode]
    Is = 2e-15
    dec = VT * np.log(10)

    close(dec * 1e3, 59.867212417845195, 1e-9, "millivolts per decade")
    v_1mA = VT * np.log(1e-3 / Is)
    close(v_1mA, 0.7003847223195837, 1e-9, "VBE at 1 mA")
    close(VT * np.log(1e-2 / Is) - v_1mA, dec, 1e-12, "one decade of current")
    close(1e-3 / VT * 1e3, 38.46153846153846, 1e-9, "gm at 1 mA in mS")
    close(VT * np.log(1e-5 / Is), 0.5806502974838932, 1e-9, "VBE at 10 uA")

    vbe = np.linspace(0.55, 0.80, 900)
    ic = Is * np.exp(vbe / VT)
    fig, ax = plt.subplots()
    ax.semilogy(vbe, ic * 1e3, color=c[0], lw=2.4)
    for dec_i, lab in ((1e-5, "10 uA"), (1e-4, "100 uA"), (1e-3, "1 mA"), (1e-2, "10 mA")):
        vv = VT * np.log(dec_i / Is)
        ax.plot([vv], [dec_i * 1e3], "o", color=c[0], ms=6, zorder=5)
        S.note(ax, vv - 0.005, dec_i * 1e3 * 1.5, lab, mode, ha="right", size=9)
    v0 = VT * np.log(1e-4 / Is)
    ax.annotate("", xy=(v0 + dec, 6e-3), xytext=(v0, 6e-3),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, v0 + dec / 2, 7.2e-3, "59.9 mV per decade", mode, ha="center")
    ax.axvline(0.7, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.705, 3.5e-3, "the '0.7 V' the constant-drop\nmodel uses for everything —\nhere it is exactly right at 1 mA\nand 40 mV wrong at 10 uA", mode)
    ax.set_xlabel("base-emitter voltage  VBE  (V)")
    ax.set_ylabel("collector current  IC  (mA)")
    ax.set_title("On a log axis the exponential is a ruler: 60 mV a decade")
    ax.set_xlim(0.55, 0.80)
    ax.set_ylim(2e-3, 3e2)
    S.strip(ax)
    return fig


@figure("elec2-bjt-bode")
def _(mode):
    """Midband gain and both roll-offs of the Section 3 common-emitter stage.

    The magnitude is |Av| = Amid * (f/fL)/sqrt(1 + (f/fL)^2) / sqrt(1 +
    (f/fH)^2), a one-pole high pass from the coupling capacitor multiplied by a
    one-pole low pass from the Miller input capacitance. Amid = 20, fL is set by
    a 1 uF coupling capacitor into 1.22 kohm, and fH = 1/(2*pi*10 kohm*100 pF)
    is the Miller number the lesson computes in Section 4.4.
    """
    c = S.SERIES[mode]
    Amid = 20.0
    Cin = 16e-12 + 4e-12 * (1 + Amid)
    fH = 1 / (2 * np.pi * 10e3 * Cin)
    fL = 1 / (2 * np.pi * 1.22e3 * 1e-6)

    close(Cin * 1e12, 100.0, 1e-12, "Miller input capacitance in pF")
    close(fH, 159154.94309189534, 1e-9, "upper corner")
    close(fL, 130.45487138679945, 1e-9, "lower corner")
    close(20 * np.log10(Amid), 26.020599913279625, 1e-9, "midband gain in dB")

    f = np.logspace(0, 7, 1400)
    mag = Amid * (f / fL) / np.sqrt(1 + (f / fL) ** 2) / np.sqrt(1 + (f / fH) ** 2)
    db = 20 * np.log10(mag)
    close(np.interp(np.log10(fH), np.log10(f), db), 20 * np.log10(Amid) - 3.0, 2e-3,
          "-3 dB at the upper corner")

    fig, ax = plt.subplots()
    ax.semilogx(f, db, color=c[0], lw=2.4)
    ax.axhline(20 * np.log10(Amid), color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axhline(20 * np.log10(Amid) - 3, color=S.GUIDE[mode], lw=1.0, ls="--")
    for fc_, lab, ha in ((fL, "fL = 130 Hz\ncoupling capacitor", "left"),
                         (fH, "fH = 159 kHz\nMiller capacitance", "right")):
        ax.axvline(fc_, color=S.GRID[mode], lw=1.0, ls=":")
        ax.plot([fc_], [20 * np.log10(Amid) - 3], "o", color=S.INK[mode], ms=7, zorder=6)
        S.note(ax, fc_ * (1.6 if ha == "left" else 0.62), 8.0, lab, mode,
               ha="left" if ha == "left" else "right", size=9)
    S.note(ax, 1.2, 26.7, "midband 26.0 dB (gain 20)", mode)
    S.note(ax, 3.5e5, 19.0, "bandwidth 159 kHz;\nhalving the gain\nroughly doubles it", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("voltage gain magnitude  (dB)")
    ax.set_title("Capacitors set both ends: coupling below, Miller above")
    ax.set_xlim(1, 1e7)
    ax.set_ylim(-6, 32)
    S.strip(ax)
    return fig


# ===========================================================================
# MOSFET
# ===========================================================================


@figure("elec2-mos-transfer-square")
def _(mode):
    """The square-law transfer curve with transconductance as its tangent.

    ID = K(VGS - Vt)^2 for K = 0.5 mA/V^2 and Vt = 1 V. The straight line is the
    tangent at VGS = 3 V, whose slope is the analytic derivative
    gm = 2K(VGS - Vt) = 2 mS; the assertion compares that analytic slope with a
    central difference on the plotted curve.
    """
    c = S.SERIES[mode]
    K, Vt = 0.5e-3, 1.0

    def ID(v):
        return np.where(v > Vt, K * (v - Vt) ** 2, 0.0)

    v0 = 3.0
    gm = 2 * K * (v0 - Vt)
    h = 1e-6
    close(gm, (float(ID(v0 + h)) - float(ID(v0 - h))) / (2 * h), 1e-8, "gm equals the tangent slope")
    close(gm * 1e3, 2.0, 1e-12, "gm printed value")
    close(float(ID(v0)) * 1e3, 2.0, 1e-12, "ID at VGS = 3 V")
    close(2 * float(ID(v0)) / (v0 - Vt), gm, 1e-12, "gm = 2 ID / overdrive")

    v = np.linspace(0, 5, 800)
    fig, ax = plt.subplots()
    ax.plot(v, ID(v) * 1e3, color=c[0], lw=2.4)
    vt_line = np.linspace(2.0, 4.2, 50)
    ax.plot(vt_line, (ID(v0) + gm * (vt_line - v0)) * 1e3, color=c[1], lw=1.9, ls="--")
    ax.plot([v0], [ID(v0) * 1e3], "o", color=S.INK[mode], ms=8, zorder=6)
    S.label_end(ax, 4.6, ID(4.6) * 1e3, "ID = K(VGS - Vt)^2", c[0], mode, dy=6, ha="right", dx=-4)
    S.label_end(ax, 4.25, (ID(v0) + gm * (4.25 - v0)) * 1e3, "tangent: slope gm = 2 mS", c[1], mode, dy=-6)
    S.note(ax, 3.06, 1.55, "Q: VGS = 3 V, ID = 2 mA,\noverdrive 2 V", mode)
    ax.axvline(Vt, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.06, 6.9, "threshold Vt = 1 V", mode)
    S.note(ax, 0.08, 5.4, "doubling the overdrive\nquadruples the current;\ngm only doubles", mode)
    ax.set_xlabel("gate-source voltage  VGS  (V)")
    ax.set_ylabel("drain current  ID  (mA)")
    ax.set_title("The square law and its slope are different statements")
    ax.set_xlim(0, 5)
    ax.set_ylim(0, 8.4)
    S.strip(ax)
    return fig


@figure("elec2-mos-bias-graphical")
def _(mode):
    """Graphical solution of the divider-plus-source-resistor bias quadratic.

    The parabola is the device law ID = K(VGS - Vt)^2; the straight line is the
    circuit law ID = (VG - VGS)/RS for VG = 4 V and RS = 1 kohm. They cross
    twice, and only one crossing has VGS above threshold with the current the
    resistor can supply. Both algebraic roots are marked, and the assertion
    checks each against the quadratic it came from.
    """
    c = S.SERIES[mode]
    K, Vt, VG, RS = 0.5e-3, 1.0, 4.0, 1000.0
    roots = np.sort(np.roots([1.0, -8.0, 9.0]))       # in mA, from ID = 0.5(3 - ID)^2
    id_lo, id_hi = roots

    close(id_lo, 1.3542486889354093, 1e-9, "physical root in mA")
    close(id_hi, 6.645751311064591, 1e-9, "extraneous root in mA")
    for r in roots:
        close(r, 0.5 * (3.0 - r) ** 2, 1e-9, "root satisfies the quadratic")
    vgs_lo = VG - id_lo * 1e-3 * RS
    close(vgs_lo, 2.6457513110645907, 1e-9, "gate-source voltage at the physical root")
    close(VG - id_hi * 1e-3 * RS, -2.645751311064591, 1e-9, "extraneous root drives VGS negative")
    close(2 * id_lo / (vgs_lo - Vt), 1.6457513110645907, 1e-9, "gm in mS")

    v = np.linspace(0, 5, 900)
    fig, ax = plt.subplots()
    ax.plot(v, np.where(v > Vt, K * (v - Vt) ** 2, 0.0) * 1e3, color=c[0], lw=2.4)
    ax.plot(v, (VG - v) / RS * 1e3, color=c[1], lw=2.2)
    ax.plot([vgs_lo], [id_lo], "o", color=S.INK[mode], ms=8.5, zorder=6)
    S.label_end(ax, 4.35, K * (4.35 - Vt) ** 2 * 1e3, "device: ID = K(VGS - Vt)^2", c[0], mode,
                ha="right", dy=6, dx=-4)
    S.label_end(ax, 1.05, (VG - 1.05) / RS * 1e3, "circuit: ID = (VG - VGS)/RS", c[1], mode, dy=8)
    S.note(ax, 2.70, 1.05, "Q: VGS = 2.65 V, ID = 1.35 mA", mode)
    S.note(ax, 0.08, 5.05, "the algebra also returns\nID = 6.65 mA, which needs\nVGS = -2.65 V — below\nthreshold, so no current\nat all. Reject it.", mode)
    ax.axvline(Vt, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("gate-source voltage  VGS  (V)")
    ax.set_ylabel("drain current  ID  (mA)")
    ax.set_title("One crossing is the bias point; the other is algebra's leftover")
    ax.set_xlim(0, 5)
    ax.set_ylim(0, 8.0)
    S.strip(ax)
    return fig


@figure("elec2-mos-gm-vs-id")
def _(mode):
    """Transconductance against bias current for a MOSFET and a BJT.

    MOSFET: gm = sqrt(2*k'*ID) with k' = mu*Cox*(W/L) = 1 mA/V^2, the square-law
    result rewritten in terms of current. BJT: gm = IC/VT with VT = 26 mV. On
    log axes the first is a half-slope line and the second a unit-slope line, so
    they cross exactly once; the crossing is at ID = 2*k'*VT^2, which the
    assertion checks against the numerical intersection.
    """
    c = S.SERIES[mode]
    kp = 1e-3
    i = np.logspace(-7, -1.5, 1200)
    gm_m, gm_b = np.sqrt(2 * kp * i), i / VT
    i_cross = 2 * kp * VT ** 2

    close(i_cross, 1.352e-06, 1e-9, "crossing current")
    close(np.sqrt(2 * kp * i_cross), i_cross / VT, 1e-12, "the two gm agree at the crossing")
    close(np.sqrt(2 * kp * 1e-3) * 1e3, 1.4142135623730951, 1e-9, "MOSFET gm at 1 mA in mS")
    close(1e-3 / VT * 1e3, 38.46153846153846, 1e-9, "BJT gm at 1 mA in mS")
    close((1e-3 / VT) / np.sqrt(2 * kp * 1e-3), 27.196414661021056, 1e-9, "ratio at 1 mA")

    fig, ax = plt.subplots()
    ax.loglog(i * 1e3, gm_b * 1e3, color=c[1], lw=2.2)
    ax.loglog(i * 1e3, gm_m * 1e3, color=c[0], lw=2.2)
    S.label_end(ax, 3e-2, 3e-2 / 26, "BJT:  gm = IC/VT\nslope 1", c[1], mode, dy=-14)
    S.label_end(ax, 6e-3, np.sqrt(2 * kp * 6e-6) * 1e3, "MOSFET:  gm = sqrt(2 k' ID)\nslope 1/2", c[0], mode, dy=12)
    ax.plot([i_cross * 1e3], [i_cross / VT * 1e3], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, i_cross * 1e3 * 1.4, i_cross / VT * 1e3 * 0.45, "they tie at 1.35 uA;\nabove it the BJT wins", mode)
    ax.plot([1.0], [1e-3 / VT * 1e3], "s", color=c[1], ms=6.5, zorder=6)
    ax.plot([1.0], [np.sqrt(2 * kp * 1e-3) * 1e3], "s", color=c[0], ms=6.5, zorder=6)
    S.note(ax, 1.25, 2.6, "at 1 mA: 38.5 mS vs 1.41 mS,\na factor of 27", mode, ha="right")
    ax.set_xlabel("bias current  (mA)")
    ax.set_ylabel("transconductance  (mS)")
    ax.set_title("Square root against straight line: why FETs give away gain")
    ax.set_xlim(1e-4, 3e1)
    ax.set_ylim(1e-3, 1e3)
    S.strip(ax)
    return fig


@figure("elec2-mos-ron")
def _(mode):
    """Triode-region on-resistance against gate drive.

    Near VDS = 0 the triode equation ID = K(2(VGS - Vt)VDS - VDS^2) linearises
    to ID = 2K(VGS - Vt)VDS, so the channel is a resistor of value
    rDS = 1/(2K(VGS - Vt)). The dashed trace is that formula; the solid trace is
    the secant resistance VDS/ID computed from the full triode equation at
    VDS = 0.2 V, which is what a real switch carrying real current sees.
    """
    c = S.SERIES[mode]
    K, Vt, vds = 0.5e-3, 1.0, 0.2
    vgs = np.linspace(1.6, 6.0, 900)
    r_small = 1 / (2 * K * (vgs - Vt))
    r_secant = vds / (K * (2 * (vgs - Vt) * vds - vds ** 2))

    close(1 / (2 * K * (5.0 - Vt)), 250.0, 1e-12, "on-resistance at VGS = 5 V")
    close(1 / (2 * K * (3.0 - Vt)), 500.0, 1e-12, "on-resistance at VGS = 3 V")
    close(1 / (2 * K * (2.0 - Vt)), 1000.0, 1e-12, "on-resistance at VGS = 2 V")
    close(vds / (K * (2 * (5.0 - Vt) * vds - vds ** 2)), 256.4102564102564, 1e-9,
          "secant resistance at VGS = 5 V")

    fig, ax = plt.subplots()
    ax.plot(vgs, r_secant, color=c[0], lw=2.4)
    ax.plot(vgs, r_small, color=c[1], lw=1.8, ls="--")
    S.label_end(ax, 3.6, vds / (K * (2 * (3.6 - Vt) * vds - vds ** 2)), "secant VDS/ID at VDS = 0.2 V", c[0], mode, dy=12)
    S.label_end(ax, 4.6, 1 / (2 * K * (4.6 - Vt)), "small-signal 1/(2K(VGS - Vt))", c[1], mode, dy=-12)
    for g in (2.0, 3.0, 5.0):
        ax.plot([g], [1 / (2 * K * (g - Vt))], "o", color=c[1], ms=6, zorder=5)
        S.note(ax, g + 0.06, 1 / (2 * K * (g - Vt)) + 45, f"{1/(2*K*(g-Vt)):.0f} ohm", mode, size=9)
    ax.set_xlabel("gate-source voltage  VGS  (V)")
    ax.set_ylabel("channel on-resistance  (ohm)")
    ax.set_title("Gate drive buys on-resistance as 1/(VGS - Vt)")
    ax.set_xlim(1.6, 6.0)
    ax.set_ylim(0, 1800)
    S.strip(ax)
    return fig


@figure("elec2-cmos-vtc")
def _(mode):
    """CMOS inverter voltage transfer characteristic, solved by current balance.

    For each input voltage the output is the voltage at which the NMOS drain
    current equals the PMOS source current, each device described by the same
    triode and saturation equations used elsewhere in this chapter with
    channel-length modulation lambda = 0.05/V. With matched devices
    (K equal, Vtn = |Vtp| = 1 V, VDD = 5 V) the assertion confirms the switching
    threshold lands at exactly VDD/2 and the two noise margins are equal.
    """
    c = S.SERIES[mode]
    VDD, Vtn, Vtp, K, lam = 5.0, 1.0, 1.0, 0.5e-3, 0.05

    def idn(vin, vo):
        vov = vin - Vtn
        if vov <= 0:
            return 0.0
        return K * (2 * vov * vo - vo ** 2) if vo < vov else K * vov ** 2 * (1 + lam * (vo - vov))

    def idp(vin, vo):
        vov, vsd = VDD - vin - Vtp, VDD - vo
        if vov <= 0:
            return 0.0
        return K * (2 * vov * vsd - vsd ** 2) if vsd < vov else K * vov ** 2 * (1 + lam * (vsd - vov))

    def vtc(vin):
        if vin <= Vtn:
            return VDD
        if vin >= VDD - Vtp:
            return 0.0
        lo, hi = 1e-12, VDD - 1e-12
        for _ in range(200):
            mid = 0.5 * (lo + hi)
            if (idn(vin, lo) - idp(vin, lo)) * (idn(vin, mid) - idp(vin, mid)) <= 0:
                hi = mid
            else:
                lo = mid
        return 0.5 * (lo + hi)

    close(vtc(VDD / 2), VDD / 2, 1e-9, "switching threshold of a matched inverter")
    h = 1e-4
    close((vtc(2.5 + h) - vtc(2.5 - h)) / (2 * h), -27.0, 2e-3, "gain at the threshold")

    def slope(v):
        return (vtc(v + 1e-5) - vtc(v - 1e-5)) / 2e-5

    def unity(a, b):
        for _ in range(120):
            m = 0.5 * (a + b)
            if (slope(a) + 1) * (slope(m) + 1) <= 0:
                b = m
            else:
                a = m
        return 0.5 * (a + b)

    vil, vih = unity(1.05, 2.49), unity(2.51, 3.90)
    close(VDD - vih, vil, 1e-6, "symmetric noise margins")
    close(vil, 2.0578, 1e-4, "printed VIL")

    vin = np.linspace(0, VDD, 601)
    vout = np.array([vtc(v) for v in vin])
    fig, ax = plt.subplots()
    ax.plot(vin, vout, color=c[0], lw=2.6)
    ax.plot([VDD / 2], [VDD / 2], "o", color=S.INK[mode], ms=8, zorder=6)
    for x, lab in ((vil, "VIL = 2.06 V"), (vih, "VIH = 2.94 V")):
        ax.plot([x], [vtc(x)], "o", color=c[1], ms=6.5, zorder=6)
        S.note(ax, x + (0.10 if x < 2.5 else -0.10), vtc(x) + 0.12, lab, mode,
               ha="left" if x < 2.5 else "right", size=9)
    S.label_end(ax, 0.15, 4.98, "PMOS on, NMOS off:\noutput held at VDD", c[0], mode, dy=-22)
    S.label_end(ax, 4.85, 0.02, "NMOS on, PMOS off:\noutput held at 0", c[0], mode, dy=22, ha="right")
    S.note(ax, 2.60, 2.75, "VM = VDD/2 = 2.50 V\nslope here is -27", mode)
    S.note(ax, 0.12, 1.25, "noise margins 2.06 V\neach way — the reason\nCMOS logic is hard\nto upset", mode)
    ax.set_xlabel("input voltage  (V)")
    ax.set_ylabel("output voltage  (V)")
    ax.set_title("Matched devices put the trip point exactly at mid-supply")
    ax.set_xlim(0, 5)
    ax.set_ylim(0, 5.4)
    S.strip(ax)
    return fig


# ===========================================================================
# OP-AMPS
# ===========================================================================


@figure("elec2-opamp-gbw")
def _(mode):
    """Closed-loop response at three gains under a 1 MHz gain-bandwidth product.

    The open-loop curve is a single pole: A(f) = A0/(1 + j f/f0) with
    A0 = 100 000 and f0 = 10 Hz, so A0*f0 = 1 MHz. Each closed-loop curve is the
    exact feedback expression A/(1 + A*beta) evaluated at the beta that sets the
    stated low-frequency gain, not a hand-drawn plateau; the assertion confirms
    each curve is 3 dB down at GBW divided by its own gain.
    """
    c = S.SERIES[mode]
    A0, f0 = 1e5, 10.0
    GBW = A0 * f0
    close(GBW, 1e6, 1e-12, "gain-bandwidth product")

    f = np.logspace(0, 7, 1600)
    A = A0 / (1 + 1j * f / f0)
    fig, ax = plt.subplots()
    ax.loglog(f, np.abs(A), color=S.GUIDE[mode], lw=1.6, ls="--")
    for k, gain in enumerate((10.0, 100.0, 1000.0)):
        beta = 1 / gain - 1 / A0        # exact beta for the stated DC gain
        Acl = A / (1 + A * beta)
        ax.loglog(f, np.abs(Acl), color=c[k], lw=2.2)
        f3 = GBW / gain
        close(np.interp(np.log10(f3), np.log10(f), 20 * np.log10(np.abs(Acl))),
              20 * np.log10(gain) - 3.0, 3e-3, f"-3 dB point at gain {gain}")
        ax.plot([f3], [gain / np.sqrt(2)], "o", color=c[k], ms=6.5, zorder=6)
        S.label_end(ax, 2.0, gain, f"gain {gain:.0f}, BW {f3/1e3:.0f} kHz"
                    if f3 >= 1e3 else f"gain {gain:.0f}, BW {f3:.0f} Hz", c[k], mode, dy=7)
    S.note(ax, 1.4e2, 2.4e4, "open loop: 100 dB at DC,\nfalling 20 dB per decade\nfrom 10 Hz", mode)
    S.note(ax, 9e5, 1.6, "every curve leaves\nat the same 1 MHz", mode, ha="right")
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("closed-loop gain magnitude")
    ax.set_title("Gain times bandwidth is the same 1 MHz on every curve")
    ax.set_xlim(1, 1e7)
    ax.set_ylim(0.5, 3e5)
    S.strip(ax)
    return fig


@figure("elec2-opamp-integrator")
def _(mode):
    """A square wave into an ideal integrator, and what a real one does.

    The input is +/-1 V at 250 Hz into R = 10 kohm with C = 0.1 uF, so
    RC = 1 ms and the output ramps at -/+1000 V/s: a 2 V peak-to-peak triangle,
    computed by cumulative trapezoidal integration of the plotted input rather
    than drawn as straight segments. The second trace adds a 1 mV input offset
    with no DC feedback path, which walks the output off at 1 V/s until it
    reaches the rail.
    """
    c = S.SERIES[mode]
    R, C, Vp, f0 = 10e3, 0.1e-6, 1.0, 250.0
    RC = R * C
    close(RC, 1e-3, 1e-12, "time constant")
    close(Vp / RC, 1000.0, 1e-12, "ramp rate in V/s")
    close(Vp / RC * (1 / (2 * f0)), 2.0, 1e-12, "peak-to-peak triangle")

    t = np.linspace(0, 0.020, 20001)
    sq = Vp * np.sign(np.sin(2 * np.pi * f0 * t))
    sq[sq == 0] = Vp
    dt = t[1] - t[0]
    ideal = -np.cumsum(sq) * dt / RC
    ideal = ideal - ideal[:int(1 / f0 / dt)].mean()          # centre on the first period
    drift = -np.cumsum(sq + 1e-3) * dt / RC
    drift = drift - drift[:int(1 / f0 / dt)].mean()
    close(ideal.max() - ideal.min(), 2.0, 2e-3, "computed triangle amplitude")
    close(1e-3 / RC, 1.0, 1e-12, "offset-driven drift rate in V/s")

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, sq, color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.plot(t * 1e3, drift, color=c[1], lw=1.8)
    ax.plot(t * 1e3, ideal, color=c[0], lw=2.4)
    S.label_end(ax, 20.0, ideal[-1], "ideal: 2 V triangle", c[0], mode, dx=-6, dy=-14, ha="right")
    S.label_end(ax, 20.0, drift[-1], "with 1 mV input offset\nand no DC feedback", c[1], mode,
                dx=-6, dy=12, ha="right")
    S.label_end(ax, 0.4, 1.0, "square-wave input, +/-1 V", S.GUIDE[mode], mode, dy=10)
    S.note(ax, 5.4, -1.85, "each ramp is 1000 V/s for 2 ms = 2 V of travel", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("voltage  (V)")
    ax.set_title("Integrating a square wave gives a triangle — and a slow escape")
    ax.set_xlim(0, 23)
    ax.set_ylim(-2.2, 2.2)
    S.strip(ax)
    return fig


@figure("elec2-opamp-slew")
def _(mode):
    """The two ceilings on op-amp output amplitude: the rails and the slew rate.

    A sinusoid A*sin(2*pi*f*t) has maximum slope 2*pi*f*A, so an amplifier with
    slew rate SR can only deliver A = SR/(2*pi*f) at frequency f. That hyperbola
    is plotted against a flat 13.5 V output-swing limit for SR = 0.5 V/us; the
    corner where they meet is the full-power bandwidth, located numerically.
    """
    c = S.SERIES[mode]
    SR, Vsat = 0.5e6, 13.5
    f = np.logspace(2, 6, 1200)
    a_slew = SR / (2 * np.pi * f)
    f_fp = SR / (2 * np.pi * Vsat)

    close(f_fp, 5894.62752192205, 1e-9, "full-power bandwidth")
    close(SR / (2 * np.pi * f_fp), Vsat, 1e-12, "the two limits meet there")
    close(SR / (2 * np.pi * 20e3), 3.9788735772973835, 1e-9, "amplitude ceiling at 20 kHz")
    close(2 * np.pi * 10e3 * 5.0 / 1e6, 0.3141592653589793, 1e-9, "slope demanded by 5 V at 10 kHz")

    fig, ax = plt.subplots()
    ax.loglog(f, np.minimum(a_slew, Vsat), color=c[0], lw=2.8)
    ax.loglog(f, a_slew, color=c[1], lw=1.5, ls="--")
    ax.axhline(Vsat, color=S.GUIDE[mode], lw=1.2, ls=":")
    ax.plot([f_fp], [Vsat], "o", color=S.INK[mode], ms=8, zorder=6)
    S.label_end(ax, 1.2e5, SR / (2 * np.pi * 1.2e5), "slew ceiling  A = SR/(2 pi f)", c[1], mode, dy=12)
    S.label_end(ax, 1.5e2, Vsat, "output-swing ceiling, 13.5 V", S.GUIDE[mode], mode, dy=10)
    S.note(ax, f_fp * 1.25, Vsat * 0.42, "full-power bandwidth\n5.89 kHz", mode)
    ax.plot([20e3], [SR / (2 * np.pi * 20e3)], "s", color=c[0], ms=6.5, zorder=6)
    S.note(ax, 2.3e4, 4.6, "at 20 kHz the biggest\nundistorted sine is 3.98 V peak", mode)
    S.note(ax, 1.2e2, 0.16, "usable region: below both ceilings", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("largest undistorted output amplitude  (V peak)")
    ax.set_title("Slew rate, not bandwidth, is what limits big signals")
    ax.set_xlim(1e2, 1e6)
    ax.set_ylim(0.1, 40)
    S.strip(ax)
    return fig


@figure("elec2-opamp-clipping")
def _(mode):
    """Transfer characteristic of a gain of -10 stage running out of rail.

    vo = -10*vi clamped to +/-13.5 V, the usable swing of a standard op-amp on
    +/-15 V supplies. The break points at vi = +/-1.35 V are computed from the
    clamp, and the inset trace is a 2 V peak sinusoid pushed through the same
    non-linearity, which is what clipping looks like in the time domain.
    """
    c = S.SERIES[mode]
    G, Vsat = -10.0, 13.5
    v_break = Vsat / abs(G)
    close(v_break, 1.35, 1e-12, "input at which the output clips")
    close(abs(G) * 0.5, 5.0, 1e-12, "linear output at 0.5 V in")

    vi = np.linspace(-2.5, 2.5, 1600)
    vo = np.clip(G * vi, -Vsat, Vsat)
    close(float(np.interp(0.5, vi, vo)), -5.0, 2e-3, "output at 0.5 V in")
    close(float(np.interp(2.0, vi, vo)), -Vsat, 1e-9, "output at 2.0 V in")

    t = np.linspace(0, 2.0, 1400)
    sig = 2.0 * np.sin(2 * np.pi * t)
    out = np.clip(G * sig, -Vsat, Vsat)
    frac = float(np.mean(np.abs(out) >= Vsat - 1e-9))
    # analytic: |10 * 2 sin| >= 13.5 whenever |sin| >= 0.675
    close(frac, 1 - 2 / np.pi * np.arcsin(0.675), 5e-3, "fraction of the cycle spent clipped")
    close(1 - 2 / np.pi * np.arcsin(0.675), 0.5282872199511006, 1e-9, "printed clipped fraction")

    fig, (ax, ax2) = plt.subplots(1, 2, figsize=(8.6, 4.0),
                                  gridspec_kw={"width_ratios": [1.05, 1.0]})
    ax.plot(vi, G * vi, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.plot(vi, vo, color=c[0], lw=2.6)
    for s in (1, -1):
        ax.plot([s * v_break], [-s * Vsat], "o", color=S.INK[mode], ms=6.5, zorder=6)
    S.note(ax, -2.35, 10.0, "ideal -10 slope\nwould reach -25 V", mode, size=9)
    S.note(ax, 0.15, -16.5, "clips at vi = 1.35 V", mode, size=9)
    ax.set_xlabel("input  vi  (V)")
    ax.set_ylabel("output  vo  (V)")
    ax.set_title("Transfer characteristic", fontsize=11)
    ax.set_xlim(-2.5, 2.5)
    ax.set_ylim(-26, 26)
    S.strip(ax)

    ax2.plot(t, G * sig, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax2.plot(t, out, color=c[0], lw=2.4)
    ax2.axhline(Vsat, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax2.axhline(-Vsat, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax2, 0.05, 14.6, "+13.5 V rail", mode, size=9)
    S.note(ax2, 0.05, -17.4, "-13.5 V rail", mode, size=9)
    S.note(ax2, 1.02, 3.0, "53% of every cycle\nis flat", mode, size=9)
    ax2.set_xlabel("time  (periods)")
    ax2.set_ylabel("output  (V)")
    ax2.set_title("2 V peak input, same stage", fontsize=11)
    ax2.set_xlim(0, 2)
    ax2.set_ylim(-26, 26)
    S.strip(ax2)
    fig.suptitle("Above 1.35 V in, the answer is the rail — not the formula",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("elec2-opamp-active-lpf")
def _(mode):
    """First-order inverting active low-pass, magnitude and phase.

    H(s) = -(Rf/Rin)/(1 + s*Rf*Cf) with Rin = 10 kohm, Rf = 100 kohm and
    Cf = 1.5915 nF, so the DC gain is -10 and the corner is 1/(2*pi*Rf*Cf).
    Both traces are that expression evaluated on the imaginary axis; the
    assertion checks the corner is where the magnitude is 3.01 dB down and the
    phase has moved 45 degrees from its DC value of 180 degrees.
    """
    c = S.SERIES[mode]
    Rin, Rf, Cf = 10e3, 100e3, 1.5915e-9
    fc = 1 / (2 * np.pi * Rf * Cf)

    close(fc, 1000.0310593270208, 1e-9, "corner frequency")
    close(Rf / Rin, 10.0, 1e-12, "DC gain magnitude")
    close(20 * np.log10(10 / np.sqrt(2)), 16.989700043360187, 1e-9, "gain at the corner in dB")

    f = np.logspace(0, 6, 1400)
    H = -(Rf / Rin) / (1 + 1j * f / fc)
    db = 20 * np.log10(np.abs(H))
    close(float(np.interp(np.log10(fc), np.log10(f), db)), 20 * np.log10(Rf / Rin) - 3.0103, 3e-3,
          "-3.01 dB at the corner")
    ph = np.unwrap(np.angle(H)) * 180 / np.pi
    close(float(np.interp(np.log10(fc), np.log10(f), ph)), 135.0, 2e-2, "phase at the corner")

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0),
                                 gridspec_kw={"height_ratios": [1.35, 1.0]})
    a1.semilogx(f, db, color=c[0], lw=2.4)
    a1.axhline(20 * np.log10(Rf / Rin), color=S.GUIDE[mode], lw=1.0, ls=":")
    a1.axvline(fc, color=S.GRID[mode], lw=1.0, ls=":")
    a1.plot([fc], [20 * np.log10(Rf / Rin) - 3.0103], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(a1, 1.15, 20.9, "20 dB (gain 10) below the corner", mode)
    S.note(a1, 1.25e3, 12.0, "-3 dB at 1.00 kHz,\nthen -20 dB per decade", mode)
    a1.set_ylabel("magnitude  (dB)")
    a1.set_ylim(-25, 26)
    S.strip(a1)

    a2.semilogx(f, ph, color=c[1], lw=2.4)
    a2.axvline(fc, color=S.GRID[mode], lw=1.0, ls=":")
    a2.plot([fc], [135.0], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(a2, 1.15, 172, "180 deg: the inversion", mode)
    S.note(a2, 1.25e3, 108, "135 deg at the corner,\n90 deg far above", mode)
    a2.set_xlabel("frequency  (Hz)")
    a2.set_ylabel("phase  (deg)")
    a2.set_ylim(80, 195)
    a2.set_xlim(1, 1e6)
    S.strip(a2)
    a1.set_title("An inverting amplifier and a low-pass filter in one three-part circuit")
    fig.tight_layout()
    return fig


# ===========================================================================
# POWER ELECTRONICS
# ===========================================================================


@figure("elec2-buck-waveforms")
def _(mode):
    """Switch-node voltage and inductor current for a 24 V to 12 V buck.

    With D = 0.5, fs = 100 kHz and L = 100 uH the inductor sees +12 V for 5 us
    and -12 V for 5 us, so its current is a triangle of slope +/-120 kA/s. The
    current trace is built by integrating that voltage, not by drawing lines,
    and the assertion checks the resulting peak-to-peak against the lesson's
    formula dIL = Vin*D(1-D)/(L*fs) = 0.6 A.
    """
    c = S.SERIES[mode]
    Vin, Vo, fs, L, Io = 24.0, 12.0, 100e3, 100e-6, 2.0
    D = Vo / Vin
    dIL = Vin * D * (1 - D) / (L * fs)
    close(D, 0.5, 1e-12, "duty cycle")
    close(dIL, 0.6, 1e-12, "inductor ripple")
    close(Vo * (1 - D) / (L * fs), dIL, 1e-12, "ripple by the off-time route")
    close(dIL / (8 * 100e-6 * fs), 0.0075, 1e-12, "output ripple in V")

    T = 1 / fs
    t = np.linspace(0, 2 * T, 40001)
    ph = np.mod(t, T)
    vsw = np.where(ph < D * T, Vin, 0.0)
    vL = vsw - Vo
    iL = Io + np.cumsum(vL) * (t[1] - t[0]) / L
    iL -= iL[: int(T / (t[1] - t[0]))].mean() - Io
    close(iL.max() - iL.min(), dIL, 3e-3, "computed triangle equals the formula")
    close(iL.max(), Io + dIL / 2, 3e-3, "peak inductor current")

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0),
                                 gridspec_kw={"height_ratios": [1.0, 1.25]})
    a1.plot(t * 1e6, vsw, color=c[1], lw=2.2)
    a1.axhline(Vo, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(a1, 0.4, 25.4, "switch node: 24 V for 5 us, 0 V for 5 us", mode, size=9)
    S.note(a1, 12.6, 13.2, "its average is 12 V = D x Vin", mode, size=9)
    a1.set_ylabel("switch node  (V)")
    a1.set_ylim(-3, 31)
    S.strip(a1)

    a2.plot(t * 1e6, iL, color=c[0], lw=2.4)
    a2.axhline(Io, color=S.GUIDE[mode], lw=1.2, ls="--")
    a2.axhline(Io + dIL / 2, color=S.GRID[mode], lw=0.9, ls=":")
    a2.axhline(Io - dIL / 2, color=S.GRID[mode], lw=0.9, ls=":")
    S.note(a2, 0.4, Io + dIL / 2 + 0.05, "2.30 A peak", mode, size=9)
    S.note(a2, 0.4, Io - dIL / 2 - 0.16, "1.70 A valley", mode, size=9)
    S.note(a2, 11.0, Io + 0.04, "average 2.00 A = the load current", mode, size=9)
    S.note(a2, 2.1, 1.52, "rising at +120 kA/s\n(12 V across 100 uH)", mode, size=9)
    a2.set_xlabel("time  (us)")
    a2.set_ylabel("inductor current  (A)")
    a2.set_ylim(1.35, 2.62)
    a2.set_xlim(0, 20)
    S.strip(a2)
    a1.set_title("The inductor sees a square wave and answers with a triangle")
    fig.tight_layout()
    return fig


@figure("elec2-scr-cosine")
def _(mode):
    """Average output of a phase-controlled bridge against firing angle.

    Vdc = (2*Vm/pi)*cos(alpha) for Vm = 169.7 V, the 120 V rms peak. The marked
    points are the angles the lesson works: 0, 60, 90 and 120 degrees. The
    assertion checks the 60 degree value against the exact formula, and checks
    that the curve crosses zero at 90 degrees and inverts beyond it.
    """
    c = S.SERIES[mode]
    Vm = np.sqrt(2) * 120.0
    V0 = 2 * Vm / np.pi
    close(Vm, 169.70562748477142, 1e-9, "peak line voltage")
    close(V0, 108.03795793885274, 1e-9, "uncontrolled bridge average")
    close(V0 * np.cos(np.radians(60.0)), 54.018978969426385, 1e-9, "average at 60 degrees")
    assert abs(V0 * np.cos(np.radians(90.0))) < 1e-12, "average at 90 degrees is not zero"
    close(V0 * np.cos(np.radians(120.0)), -54.018978969426385, 1e-9, "average at 120 degrees")

    a = np.linspace(0, 180, 1200)
    v = V0 * np.cos(np.radians(a))
    fig, ax = plt.subplots()
    ax.plot(a, v, color=c[0], lw=2.6)
    ax.fill_between(a, v, 0, where=v >= 0, color=c[0], alpha=0.10)
    ax.fill_between(a, v, 0, where=v < 0, color=c[1], alpha=0.12)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.1)
    for ang, lab in ((0, "108.0 V"), (60, "54.0 V"), (90, "0 V"), (120, "-54.0 V")):
        y = V0 * np.cos(np.radians(ang))
        ax.plot([ang], [y], "o", color=S.INK[mode], ms=7, zorder=6)
        S.note(ax, ang + 3, y + 5, f"{ang} deg\n{lab}", mode, size=9)
    S.note(ax, 12, -55, "RECTIFYING\npower flows to the load", mode)
    S.note(ax, 175, 62, "INVERTING\npower returns to the line", mode, ha="right")
    ax.set_xlabel("firing angle  alpha  (degrees)")
    ax.set_ylabel("average DC output  (V)")
    ax.set_title("One cosine spans rectifier, off, and inverter")
    ax.set_xlim(0, 180)
    ax.set_ylim(-125, 125)
    S.strip(ax)
    return fig


@figure("elec2-rectifier-ripple")
def _(mode):
    """Single-phase and three-phase rectified waveforms on one normalised axis.

    Both traces are built from unit-amplitude phase voltages: the single-phase
    full-wave output is |sin| and the six-pulse output is max(va,vb,vc) minus
    min(va,vb,vc). Their means are computed from the samples and checked against
    2/pi and 3*sqrt(3)/pi, and the ripple factors quoted in the caption are the
    sample RMS deviations divided by those means.
    """
    c = S.SERIES[mode]
    th = np.arange(200000) / 200000.0 * 2 * np.pi   # whole cycle, endpoint excluded
    va, vb, vc = np.sin(th), np.sin(th - 2 * np.pi / 3), np.sin(th + 2 * np.pi / 3)
    six = np.max([va, vb, vc], axis=0) - np.min([va, vb, vc], axis=0)
    one = np.abs(np.sin(th))

    close(six.mean(), 3 * np.sqrt(3) / np.pi, 1e-6, "six-pulse average")
    close(one.mean(), 2 / np.pi, 1e-6, "single-phase average")
    close(six.max(), np.sqrt(3), 1e-9, "six-pulse peak")
    close(six.min(), 1.5, 1e-9, "six-pulse valley")

    def rf(x):
        m = x.mean()
        return np.sqrt((x ** 2).mean() - m ** 2) / m

    close(rf(six), 0.04197, 3e-4, "six-pulse ripple factor")
    close(rf(one), 0.48343, 3e-4, "single-phase ripple factor")
    close((six.max() - six.min()) / six.mean(), 0.1403, 1e-3, "six-pulse peak-to-peak ripple")

    fig, ax = plt.subplots()
    ax.plot(np.degrees(th), six, color=c[0], lw=2.2)
    ax.plot(np.degrees(th), one, color=c[1], lw=2.0)
    ax.axhline(six.mean(), color=c[0], lw=1.1, ls="--")
    ax.axhline(one.mean(), color=c[1], lw=1.1, ls="--")
    S.label_end(ax, 300, 1.60, "six-pulse three-phase", c[0], mode, dy=12, ha="center")
    S.label_end(ax, 300, 0.72, "single-phase full wave", c[1], mode, dy=12, ha="center")
    S.note(ax, 3, six.mean() + 0.035, "mean 1.654 (= 3 sqrt3 / pi), ripple factor 4.2%", mode, size=9)
    S.note(ax, 3, one.mean() + 0.035, "mean 0.637 (= 2/pi), ripple factor 48.3%", mode, size=9)
    S.note(ax, 357, 1.30, "six-pulse output never\ndrops below 1.500;\nthat 0.232 band is\nall the ripple there is", mode,
           ha="right", size=9)
    ax.set_xlabel("phase angle  (degrees)")
    ax.set_ylabel("rectified output  (per unit peak phase voltage)")
    ax.set_title("Six pulses per cycle instead of two, and the ripple all but vanishes")
    ax.set_xlim(0, 360)
    ax.set_ylim(0, 2.05)
    S.strip(ax)
    return fig


@figure("elec2-buck-ccm-boundary")
def _(mode):
    """Critical inductance against duty cycle for a buck converter.

    Lcrit = (1 - D)*R/(2*fs), the inductance at which the ripple triangle just
    touches zero. Three load resistances are drawn at fs = 100 kHz; the marked
    point is the 6 ohm case at D = 0.5 that the worked example uses. Above a
    curve the converter is continuous, below it discontinuous.
    """
    c = S.SERIES[mode]
    fs = 100e3
    D = np.linspace(0.02, 0.95, 800)
    close((1 - 0.5) * 6.0 / (2 * fs) * 1e6, 15.0, 1e-12, "critical inductance at D = 0.5, 6 ohm")
    close((1 - 0.5) * 24.0 / (2 * fs) * 1e6, 60.0, 1e-12, "critical inductance at 24 ohm")
    close((1 - 0.25) * 6.0 / (2 * fs) * 1e6, 22.5, 1e-12, "critical inductance at D = 0.25")

    fig, ax = plt.subplots()
    for k, R in enumerate((24.0, 12.0, 6.0)):
        ax.plot(D, (1 - D) * R / (2 * fs) * 1e6, color=c[k], lw=2.2)
        S.label_end(ax, 0.95, (1 - 0.95) * R / (2 * fs) * 1e6,
                    f"R = {R:.0f} ohm  ({12.0/R:.1f} A load)", c[k], mode, dy=0)
    ax.plot([0.5], [15.0], "o", color=S.INK[mode], ms=8, zorder=6)
    S.note(ax, 0.52, 17.5, "worked example:\n6 ohm at D = 0.5\nneeds 15 uH", mode)
    ax.axhline(100.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 0.02, 102, "the chosen 100 uH sits above every curve: continuous at all loads shown", mode, size=9)
    S.note(ax, 0.06, 8, "below a curve: discontinuous conduction,\nand Vo = D x Vin stops being true", mode, size=9)
    ax.set_xlabel("duty cycle  D")
    ax.set_ylabel("critical inductance  (uH)")
    ax.set_title("Light loads and low duty cycles are what push a buck into DCM")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 135)
    S.strip(ax)
    return fig


@figure("elec2-converter-efficiency")
def _(mode):
    """Converter efficiency against load current, with the loss terms behind it.

    For the 24 V to 12 V buck of the worked examples: a fixed 0.25 W of gate,
    controller and switching loss; a diode conduction loss (1 - D)*Vf*Io with
    Vf = 0.5 V; and a switch conduction loss D*Rds*Io^2 with Rds = 50 mohm.
    Efficiency is Po/(Po + losses), and the peak is where the fixed loss equals
    the square-law loss, at Io = sqrt(Pfix/(D*Rds)) — located here by search and
    checked against that closed form.
    """
    c = S.SERIES[mode]
    Vo, D, Pfix, Vf, Rds = 12.0, 0.5, 0.25, 0.5, 0.05
    Io = np.linspace(0.05, 12.0, 3000)
    Po = Vo * Io
    Ploss = Pfix + (1 - D) * Vf * Io + D * Rds * Io ** 2
    eff = Po / (Po + Ploss)
    k = int(np.argmax(eff))
    io_star = np.sqrt(Pfix / (D * Rds))

    close(io_star, 3.1622776601683795, 1e-9, "peak-efficiency current")
    close(Io[k], io_star, 3e-3, "numerical peak matches the closed form")
    close(Pfix, D * Rds * io_star ** 2, 1e-12, "fixed loss equals square-law loss at the peak")
    eff_star = Vo * io_star / (Vo * io_star + Pfix + (1 - D) * Vf * io_star
                              + D * Rds * io_star ** 2)
    close(eff[k], eff_star, 1e-5, "grid peak matches the closed-form peak")
    close(eff_star * 100, 96.71091120813063, 1e-9, "peak efficiency in percent")
    e1 = Vo * 1.0 / (Vo * 1.0 + Pfix + (1 - D) * Vf * 1.0 + D * Rds * 1.0)
    close(e1 * 100, 95.80838323353294, 1e-9, "efficiency at 1 A")

    fig, ax = plt.subplots()
    ax.plot(Io, eff * 100, color=c[0], lw=2.6)
    ax.plot([io_star], [eff[k] * 100], "o", color=S.INK[mode], ms=8, zorder=6)
    S.note(ax, io_star + 0.25, eff[k] * 100 - 0.9, "peak 96.7% at 3.16 A,\nwhere fixed loss = I^2 loss", mode)
    ax.plot([1.0], [e1 * 100], "s", color=c[0], ms=6.5, zorder=6)
    S.note(ax, 1.15, e1 * 100 - 1.5, "95.8% at 1 A:\nthe fixed 0.25 W\nis 2% of a 12 W load", mode)
    S.note(ax, 11.8, 93.0, "at 12 A the switch's\nI^2 R loss dominates", mode, ha="right")
    ax.axhline(100.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 0.1, 100.3, "the ideal converter the formulas describe", mode, size=9)
    ax.set_xlabel("load current  Io  (A)")
    ax.set_ylabel("efficiency  (%)")
    ax.set_title("Fixed losses spoil light loads; resistive losses spoil heavy ones")
    ax.set_xlim(0, 12)
    ax.set_ylim(88, 101.5)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------

PNG_BG = {"light": "#ffffff", "dark": "#15161a"}


def render(name: str, fn, png_dir: pathlib.Path | None = None) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        if png_dir is not None:
            png_dir.mkdir(parents=True, exist_ok=True)
            fig.savefig(png_dir / f"{name}{suffix.replace('.svg', '')}.png", format="png",
                        dpi=110, facecolor=PNG_BG[mode], bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    png_dir = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] else None
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n], png_dir)
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
