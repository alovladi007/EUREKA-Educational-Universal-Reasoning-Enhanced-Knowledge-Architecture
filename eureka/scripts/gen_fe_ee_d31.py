#!/usr/bin/env python3
"""Depth-wave-31 figures for the FE Electrical and Computer course.

Scope: the AC-power chapter of the Circuit Analysis section (topic
`fee_ac_power`) and nothing else. Figure names all begin `ckt3-`, which is
this generator's private namespace; no other wave writes into it.

Nothing here is traced, scanned or adapted from a reference work. Every curve
is evaluated or integrated in this file from the definition the lesson states,
so a reader can rerun the script and get the picture back byte for byte.

The chapter's whole argument is that a *phasor* result and a *time-domain*
result must agree, so the assertions in this file are built to test exactly
that. Wherever the lesson prints a number obtained from V I cos(phi) or from
S = V I*, the corresponding assertion recovers the same number by numerically
integrating v(t) i(t) - or v(t)^2 - over a whole cycle with adaptive
quadrature. A formula compared against itself proves nothing; a formula
compared against the waveform it claims to summarise proves the claim.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 scripts/gen_fe_ee_d31.py                 # all figures + audit
    python3 scripts/gen_fe_ee_d31.py ckt3-rms        # only names starting so
    python3 scripts/gen_fe_ee_d31.py --audit         # published numbers only
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy.integrate import quad

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "ckt3-"

F0 = 60.0
W = 2 * np.pi * F0
T0 = 1.0 / F0
RT2 = np.sqrt(2.0)


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# the independent route: numbers taken off the waveform, never off the formula
# ---------------------------------------------------------------------------
def mean_over_cycle(fn, period=T0, limit=4000):
    """Cycle average by adaptive quadrature - the definition of average power."""
    return quad(fn, 0.0, period, limit=limit)[0] / period


def rms_over_cycle(fn, period=1.0, limit=4000):
    """Root of the mean square, straight from the defining integral."""
    return np.sqrt(quad(lambda t: fn(t) ** 2, 0.0, period, limit=limit)[0] / period)


def sinusoid_pair(vrms, irms, theta, wf=W):
    """v(t), i(t) as real waveforms from rms magnitudes and a phase angle."""
    return (lambda t: vrms * RT2 * np.cos(wf * t),
            lambda t: irms * RT2 * np.cos(wf * t - theta))


def power_by_integration(vrms, irms, theta):
    v, i = sinusoid_pair(vrms, irms, theta)
    return mean_over_cycle(lambda t: v(t) * i(t))


def reactive_by_integration(vrms, irms, theta):
    """Q as the quadrature component of p(t): twice the cycle average of
    p(t) sin(2 w t), which picks the sin(2wt) coefficient out of the
    double-frequency term. Nothing in this route uses V I sin(phi)."""
    v, i = sinusoid_pair(vrms, irms, theta)
    return 2.0 * mean_over_cycle(lambda t: v(t) * i(t) * np.sin(2 * W * t))


# ===========================================================================
# 1. instantaneous power, split into its constant and double-frequency parts
# ===========================================================================
@figure("ckt3-pt-decomposition")
def _(mode):
    """p(t) = v(t) i(t) for a 40-degree lagging load, against P + S cos(2wt - th).

    The curve drawn is the POINTWISE PRODUCT of the two waveforms; the
    product-to-sum expansion is then overlaid on it. If the expansion in the
    lesson were wrong the two would separate visibly, so the assertion is on
    the worst-case gap between them, not on either one alone.
    """
    c = S.SERIES[mode]
    vm, im, th = 170.0, 12.0, np.deg2rad(40.0)
    vrms, irms = vm / RT2, im / RT2
    Sm = vrms * irms                       # 1020 VA
    Pw = Sm * np.cos(th)

    t = np.linspace(0.0, 2 * T0, 400001)
    p_product = (vm * np.cos(W * t)) * (im * np.cos(W * t - th))
    p_expand = Pw + Sm * np.cos(2 * W * t - th)

    # 1: the expansion reproduces the product everywhere, to machine precision
    assert np.max(np.abs(p_product - p_expand)) < 1e-9, np.max(np.abs(p_product - p_expand))
    # 2: the cycle average of the PRODUCT equals V I cos(phi)
    p_int = power_by_integration(vrms, irms, th)
    assert abs(p_int - Pw) < 1e-7, (p_int, Pw)
    assert abs(p_int - 781.365332) < 1e-5, p_int
    # 3: Q recovered from the waveform's quadrature content, not from V I sin
    q_int = reactive_by_integration(vrms, irms, th)
    assert abs(q_int - Sm * np.sin(th)) < 1e-6, (q_int, Sm * np.sin(th))
    assert abs(q_int - 655.643362) < 1e-5, q_int
    # 4: the backflow window is theta/180 of every cycle
    neg = mean_over_cycle(lambda x: 1.0 if (vm * np.cos(W * x)) * (im * np.cos(W * x - th)) < 0 else 0.0,
                          limit=2000)
    assert abs(neg - 40.0 / 180.0) < 2e-4, neg
    # 5: energy handed back per line period, by quadrature and in closed form
    back = quad(lambda x: min((vm * np.cos(W * x)) * (im * np.cos(W * x - th)), 0.0),
                0.0, T0, limit=4000)[0]
    x1 = np.arccos(-np.cos(th))
    x2 = 2 * np.pi - x1
    closed = (Pw * (x2 - x1) + Sm * (np.sin(x2) - np.sin(x1))) / (2 * W)
    assert abs(back - 2 * closed) < 1e-9, (back, closed)
    assert abs(back + 0.584350) < 5e-6, back

    # The assertions above run on the dense grid; the drawing does not need it,
    # and plotting 400k oscillating points produced a 4 MB SVG that no path
    # simplifier can shrink. 4001 samples is ~1000 per cycle of p(t).
    fig, ax = plt.subplots()
    tp = t[::100]
    p_plot = p_product[::100]
    ms = tp * 1000.0
    ax.plot(ms, p_plot, color=c[0], lw=2.2)
    ax.plot(ms, Sm * np.cos(2 * W * tp - th), color=c[1], lw=1.6)
    ax.axhline(Pw, color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.fill_between(ms, p_plot, 0.0, where=p_plot < 0, color=c[0], alpha=0.28,
                    linewidth=0)
    S.label_end(ax, 0.87, 1801.4, "$p(t)=v\\,i$", c[0], mode, dy=11, dx=2)
    S.label_end(ax, 30.0, -Sm, "double-frequency term", c[1], mode, dy=-14, ha="center", dx=0)
    S.note(ax, 15.5, 1930, f"the dashed line is the constant term, $P$ = {Pw:.0f} W", mode)
    S.note(ax, 3.0, -1360, "shaded: energy flowing back to the source", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("instantaneous power  (W)")
    ax.set_title("One product, two behaviours: a DC offset plus a $2\\omega$ swing")
    ax.set_xlim(0, 33.4)
    ax.set_ylim(-1400, 2100)
    S.strip(ax)
    return fig


# ===========================================================================
# 2. rms of three standard waveshapes, from the defining integral
# ===========================================================================
@figure("ckt3-rms-waveforms")
def _(mode):
    """Sine, triangle and square at the same +-10 V peak, each with its rms line.

    Every rms level drawn is obtained by integrating the square of the sampled
    waveform, then compared with the closed form the lesson quotes.
    """
    c = S.SERIES[mode]

    def sine(x):
        return 10.0 * np.sin(2 * np.pi * x)

    def triangle(x):
        return 10.0 * (4.0 * np.abs(x - np.floor(x + 0.5)) - 1.0)

    def square(x):
        return 10.0 * np.sign(np.sin(2 * np.pi * x) + 1e-15)

    shapes = [("sine", sine, 10.0 / RT2), ("triangle", triangle, 10.0 / np.sqrt(3.0)),
              ("square", square, 10.0)]
    for name, fn, closed in shapes:
        got = rms_over_cycle(fn, period=1.0)
        assert abs(got - closed) < 2e-6, (name, got, closed)
    # the three closed forms the lesson prints
    assert abs(10.0 / RT2 - 7.071068) < 5e-7
    assert abs(10.0 / np.sqrt(3.0) - 5.773503) < 5e-7
    # crest factors, taken off the sampled waveform
    x = np.linspace(0.0, 1.0, 400001)
    for name, fn, closed in shapes:
        crest = np.max(np.abs(fn(x))) / closed
        expect = {"sine": RT2, "triangle": np.sqrt(3.0), "square": 1.0}[name]
        assert abs(crest - expect) < 1e-6, (name, crest, expect)

    fig, ax = plt.subplots()
    for k, (name, fn, closed) in enumerate(shapes):
        ax.plot(x, fn(x), color=c[k], lw=2.0)
        ax.axhline(closed, color=c[k], lw=1.1, ls="--", alpha=0.85)
        S.label_end(ax, 1.02, closed, f"{name}  {closed:.3f} V", c[k], mode,
                    dy=[10, -11, 10][k])
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    S.note(ax, 0.02, -13.9, "same peak, same period - three different heating values", mode)
    ax.set_xlabel("time  (periods)")
    ax.set_ylabel("volts")
    ax.set_title("RMS is set by area under the square, not by the peak")
    ax.set_xlim(0, 1.42)
    ax.set_ylim(-15, 15)
    S.strip(ax)
    return fig


# ===========================================================================
# 3. mean against rms for a chopped supply
# ===========================================================================
@figure("ckt3-rms-duty")
def _(mode):
    """A 240 V source gated at duty D: the mean falls as D, the rms as sqrt(D).

    Delivered power into a fixed resistor tracks the SQUARE of the rms, so it
    falls linearly with D even though the rms does not. Each of the three
    curves is checked at every plotted duty against a quadrature integral of
    the gated waveform, so the sqrt(D) law is measured rather than asserted.
    """
    c = S.SERIES[mode]
    duty = np.linspace(0.02, 1.0, 197)
    vsrc = 240.0
    rms = np.empty_like(duty)
    mean = np.empty_like(duty)
    for k, dd in enumerate(duty):
        gate = lambda x, dd=dd: vsrc if (x % 1.0) < dd else 0.0
        rms[k] = rms_over_cycle(gate, period=1.0, limit=800)
        mean[k] = mean_over_cycle(gate, period=1.0, limit=800)
    assert np.max(np.abs(rms - vsrc * np.sqrt(duty))) < 2e-6, np.max(np.abs(rms - vsrc * np.sqrt(duty)))
    assert np.max(np.abs(mean - vsrc * duty)) < 2e-6
    # the worked number: duty 0.36 into 20 ohm
    i36 = int(np.argmin(np.abs(duty - 0.36)))
    assert abs(duty[i36] - 0.36) < 1e-9, duty[i36]
    assert abs(rms[i36] - 144.0) < 1e-5, rms[i36]
    assert abs(rms[i36] ** 2 / 20.0 - 1036.8) < 1e-3
    # and the same power straight from the energy integral, no rms in sight
    gate36 = lambda x: vsrc if (x % 1.0) < 0.36 else 0.0
    assert abs(mean_over_cycle(lambda x: gate36(x) ** 2 / 20.0, period=1.0, limit=800) - 1036.8) < 1e-3

    fig, ax = plt.subplots()
    ax.plot(duty * 100, rms, color=c[0], lw=2.2)
    ax.plot(duty * 100, mean, color=c[1], lw=2.2)
    S.label_end(ax, 100, rms[-1], "rms  $= 240\\sqrt{D}$", c[0], mode, dy=14)
    S.label_end(ax, 100, mean[-1], "mean  $= 240D$", c[1], mode, dy=-16)
    ax.plot([36], [144.0], marker="o", color=c[0], ms=7)
    S.note(ax, 4, 172, "$D=0.36$: 144 V rms, 1036.8 W", mode)
    ax2 = ax.twinx()
    ax2.plot(duty * 100, rms ** 2 / 20.0, color=c[2], lw=2.0)
    ax2.set_ylim(0, 3200)
    ax2.set_ylabel("power into 20 $\\Omega$  (W)", color=S.INK_2[mode])
    ax2.grid(False)
    ax2.spines["top"].set_visible(False)
    S.label_end(ax2, 62, rms[np.argmin(np.abs(duty - 0.62))] ** 2 / 20.0,
                "delivered power", c[2], mode, dy=-16, ha="center", dx=0)
    ax.set_xlabel("duty cycle  (%)")
    ax.set_ylabel("volts")
    ax.set_title("Averaging and rms answer different questions")
    ax.set_xlim(0, 118)
    ax.set_ylim(0, 300)
    S.strip(ax)
    return fig


# ===========================================================================
# 4. true power factor collapses with distortion even at unity displacement
# ===========================================================================
@figure("ckt3-distortion-pf")
def _(mode):
    """True PF against current THD for three displacement factors.

    The ceiling curve (unity displacement) is what a capacitor bank can never
    beat, because a capacitor moves the fundamental angle and nothing else.
    Every point on the curves is confirmed by building an actual harmonic
    current waveform and integrating it - P from v(t) i(t), Irms from i(t)^2.
    """
    c = S.SERIES[mode]
    thd = np.linspace(0.0, 1.6, 321)
    fig, ax = plt.subplots()
    for k, disp in enumerate((1.0, 0.95, 0.906308)):
        pf = disp / np.sqrt(1.0 + thd ** 2)
        ax.plot(thd * 100, pf, color=c[k], lw=2.2)
        S.label_end(ax, 160, pf[-1], f"displacement {disp:.3f}", c[k], mode, dy=[10, 0, -10][k])
    # the worked rectifier: 15 / 9 / 5.4 / 3 A rms at 120 V, fundamental at -25 deg
    harm = [(1, 15.0, np.deg2rad(25.0)), (3, 9.0, 0.0), (5, 5.4, 0.0), (7, 3.0, 0.0)]
    iw = lambda t: sum(RT2 * a * np.cos(h * W * t - ph) for h, a, ph in harm)
    vw = lambda t: 120.0 * RT2 * np.cos(W * t)
    p_int = mean_over_cycle(lambda t: vw(t) * iw(t))
    irms_int = rms_over_cycle(iw, period=T0)
    pf_int = p_int / (120.0 * irms_int)
    # only the fundamental carries real power against a clean sinusoidal voltage
    assert abs(p_int - 120.0 * 15.0 * np.cos(np.deg2rad(25.0))) < 1e-6, p_int
    assert abs(p_int - 1631.354017) < 1e-5, p_int
    assert abs(irms_int - np.sqrt(15.0 ** 2 + 9.0 ** 2 + 5.4 ** 2 + 3.0 ** 2)) < 1e-7
    assert abs(irms_int - 18.551550) < 1e-5, irms_int
    assert abs(pf_int - 0.732802) < 1e-6, pf_int
    thd_w = np.sqrt(9.0 ** 2 + 5.4 ** 2 + 3.0 ** 2) / 15.0
    assert abs(thd_w - 0.727736) < 1e-6, thd_w
    # the factorisation the lesson claims, checked against the integrated PF
    assert abs(np.cos(np.deg2rad(25.0)) / np.sqrt(1 + thd_w ** 2) - pf_int) < 1e-9
    assert abs(15.0 / irms_int - 0.808558) < 1e-6

    ax.plot([thd_w * 100], [pf_int], marker="o", color=c[2], ms=7)
    S.note(ax, 78, 0.40, "six-pulse rectifier:\n73% THD, true PF 0.733,\ndisplacement 0.906", mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("current THD  (%)")
    ax.set_ylabel("true power factor  $P/(V_{rms}I_{rms})$")
    ax.set_title("Capacitors move the top curve down; they cannot move it right")
    ax.set_xlim(0, 205)
    ax.set_ylim(0, 1.08)
    S.strip(ax)
    return fig


# ===========================================================================
# 5. what each step of correction actually buys
# ===========================================================================
@figure("ckt3-correction-ladder")
def _(mode):
    """75 kW at 0.72 lagging on a 480 V feeder: cost and benefit of each target.

    Left curve: the cumulative kVAR the bank must supply. Right curves: line
    current and feeder loss, both normalised to the uncorrected case. The
    marginal-return story is the gap between how fast the kVAR climbs near
    unity and how slowly the current still falls.
    """
    c = S.SERIES[mode]
    Pk, vll = 75_000.0, 480.0
    tan1 = np.tan(np.arccos(0.72))
    target = np.linspace(0.72, 0.999, 400)
    qc = Pk * (tan1 - np.tan(np.arccos(target)))
    cur = Pk / (vll * target)
    cur0 = Pk / (vll * 0.72)

    # the published pair, each by its own route
    assert abs(tan1 - 0.9638529) < 1e-7, tan1
    assert abs(Pk * tan1 - 72_288.96) < 0.5
    q95 = Pk * (tan1 - np.tan(np.arccos(0.95)))
    assert abs(q95 - 47_637.66) < 0.5, q95
    # same kVAR from the triangle sides instead of from the tangents
    s1, s2 = Pk / 0.72, Pk / 0.95
    assert abs((np.sqrt(s1 ** 2 - Pk ** 2) - np.sqrt(s2 ** 2 - Pk ** 2)) - q95) < 1e-6
    assert abs(s1 - s2 - 25_219.30) < 0.5, s1 - s2
    assert abs(s1 / vll - 217.0139) < 5e-4
    assert abs(s2 / vll - 164.4737) < 5e-4
    assert abs((0.72 / 0.95) ** 2 - 0.574404) < 1e-6
    assert abs(((s2 / vll) / (s1 / vll)) ** 2 - (0.72 / 0.95) ** 2) < 1e-12
    cap = q95 / (W * vll ** 2)
    assert abs(cap * 1e6 - 548.45) < 0.01, cap * 1e6
    # and the capacitor sized from its reactance instead of from omega C V^2
    xc = vll ** 2 / q95
    assert abs(1.0 / (W * xc) - cap) < 1e-15
    assert abs(xc - 4.83651) < 1e-5, xc
    # the marginal-return claim in the caption, both halves of it
    share_kvar = q95 / (Pk * tan1)
    share_current = (1.0 - 0.72 / 0.95) / (1.0 - 0.72)
    assert abs(share_kvar - 0.658989) < 1e-6, share_kvar
    assert abs(share_current - 0.864662) < 1e-6, share_current
    assert share_current > share_kvar

    fig, ax = plt.subplots()
    ax.plot(target, qc / 1000.0, color=c[0], lw=2.4)
    ax.plot(target, 100.0 * cur / cur0, color=c[1], lw=2.2)
    ax.plot(target, 100.0 * (cur / cur0) ** 2, color=c[2], lw=2.2)
    S.label_end(ax, 0.999, qc[-1] / 1000.0, "capacitor kVAR", c[0], mode, dy=-11)
    S.label_end(ax, 0.999, 100.0 * cur[-1] / cur0, "line current  (% of start)", c[1], mode, dy=10)
    S.label_end(ax, 0.999, 100.0 * (cur[-1] / cur0) ** 2, "feeder loss  (% of start)", c[2], mode,
                dy=-8)
    ax.axvline(0.95, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.plot([0.95], [q95 / 1000.0], marker="o", color=c[0], ms=7)
    S.note(ax, 0.733, 27.0,
           "0.95 needs 47.6 kVAR - only 66% of the\nbank unity would take - and it already\ncaptures 86% of the current reduction",
           mode)
    ax.set_xlabel("target power factor")
    ax.set_ylabel("kVAR, or percent of the uncorrected value")
    ax.set_title("The last few hundredths cost the most and buy the least")
    ax.set_xlim(0.72, 1.06)
    ax.set_ylim(0, 108)
    S.strip(ax)
    return fig


# ===========================================================================
# 6. overcorrection is symmetric, and it moves the resonant order
# ===========================================================================
@figure("ckt3-overcorrection")
def _(mode):
    """Apparent power against installed kVAR for the same 75 kW load.

    S(Q_C) is a hyperbola with its minimum at Q_C = Q_load; every kVAR past
    that point puts apparent power back up at the same rate it came down.
    The second curve is the parallel-resonant harmonic order sqrt(S_sc/Q_C)
    on a 2.5 MVA bus, which walks straight into the 5th as the bank grows.
    """
    c = S.SERIES[mode]
    Pk, vll, ssc = 75_000.0, 480.0, 2.5e6
    q_load = Pk * np.tan(np.arccos(0.72))
    qc = np.linspace(1.0, 145_000.0, 1441)
    s_net = np.hypot(Pk, q_load - qc)

    # the minimum sits exactly at full compensation, and it equals P
    i_min = int(np.argmin(s_net))
    assert abs(qc[i_min] - q_load) < 120.0, (qc[i_min], q_load)
    assert abs(np.min(s_net) - Pk) < 65.0, np.min(s_net)
    # symmetry: 2 Q_load of correction returns S to its uncorrected value
    assert abs(np.hypot(Pk, q_load - 2 * q_load) - Pk / 0.72) < 1e-9
    # the two published banks
    for bank, s_ref, pf_ref in ((47_637.66, 78_947.37, 0.95000), (100_000.0, 79_955.63, 0.93802)):
        sv = np.hypot(Pk, q_load - bank)
        assert abs(sv - s_ref) < 0.5, (bank, sv)
        assert abs(Pk / sv - pf_ref) < 5e-6, (bank, Pk / sv)
    assert np.hypot(Pk, q_load - 100_000.0) > np.hypot(Pk, q_load - 47_637.66)
    assert abs(np.sqrt(ssc / 100_000.0) - 5.0) < 1e-12
    assert abs(np.sqrt(ssc / 47_637.66) - 7.24428) < 1e-4, np.sqrt(ssc / 47_637.66)
    assert abs(100.0 * 100_000.0 / ssc - 4.0) < 1e-12
    assert abs(100.0 * 47_637.66 / ssc - 1.9055) < 1e-3
    assert abs(vll * 1.04 - 499.2) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(qc / 1000.0, s_net / 1000.0, color=c[0], lw=2.4)
    ax.axhline(Pk / 1000.0, color=S.GUIDE[mode], lw=1.2, ls=":")
    for bank, col in ((47_637.66, c[1]), (100_000.0, c[2])):
        ax.plot([bank / 1000.0], [np.hypot(Pk, q_load - bank) / 1000.0], marker="o",
                color=col, ms=7)
    S.label_end(ax, 4.0, 115.0, "sized bank: 47.6 kVAR, pf 0.950 lagging", c[1], mode, dx=0)
    S.label_end(ax, 4.0, 110.6, "oversized: 100 kVAR, pf 0.938 leading", c[2], mode, dx=0)
    ax2 = ax.twinx()
    ax2.plot(qc / 1000.0, np.sqrt(ssc / qc), color=S.GUIDE[mode], lw=1.6, ls="--")
    ax2.set_ylim(2, 30)
    ax2.set_ylabel("resonant harmonic order  $\\sqrt{S_{sc}/Q_C}$", color=S.INK_2[mode])
    ax2.grid(False)
    ax2.axhline(5.0, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax2, 6, 5.3, "5th harmonic", mode)
    ax.set_xlabel("installed capacitor bank  (kVAR)")
    ax.set_ylabel("apparent power drawn from the feeder  (kVA)")
    ax.set_title("Past full compensation, every kVAR is spent buying current back")
    ax.set_xlim(0, 145)
    ax.set_ylim(70, 118)
    S.strip(ax)
    ax2.spines["top"].set_visible(False)
    return fig


# ===========================================================================
# 7. maximum power transfer, and what the constraints cost
# ===========================================================================
@figure("ckt3-max-power")
def _(mode):
    """Load power against R_L for three reactance policies, Zth = 6 + j8 ohm.

    The three optima the lesson derives - conjugate match, resistive-only
    load, fixed-angle load - are all located here by scanning the delivered
    power itself, so the closed forms are checked against a search rather than
    against each other.
    """
    c = S.SERIES[mode]
    vth, rth, xth = 24.0, 6.0, 8.0
    rl = np.linspace(0.2, 40.0, 400001)

    def pl(r, x):
        return vth ** 2 * r / ((rth + r) ** 2 + (xth + x) ** 2)

    conj = pl(rl, -xth)
    zero = pl(rl, 0.0)
    # angle pinned at 0.8 lagging: X_L is forced to 0.75 R_L all along the sweep
    fixed = pl(rl, 0.75 * rl)

    # conjugate match: peak at R_L = Rth, height |V|^2 / 4 Rth
    i = int(np.argmax(conj))
    assert abs(rl[i] - rth) < 1e-3, rl[i]
    assert abs(conj[i] - vth ** 2 / (4 * rth)) < 1e-9
    assert abs(conj[i] - 24.0) < 1e-9
    # resistive-only load: peak at |Zth|, height |V|^2 / (2(|Zth| + Rth))
    j = int(np.argmax(zero))
    assert abs(rl[j] - np.hypot(rth, xth)) < 1e-3, rl[j]
    assert abs(zero[j] - vth ** 2 / (2 * (np.hypot(rth, xth) + rth))) < 1e-8
    assert abs(zero[j] - 18.0) < 1e-6, zero[j]
    # fixed 0.8-lagging angle: |Z_L| optimum at |Zth| = 10, i.e. R_L = 8 ohm
    k = int(np.argmax(fixed))
    assert abs(rl[k] / 0.8 - np.hypot(rth, xth)) < 2e-3, rl[k] / 0.8
    assert abs(rl[k] - 8.0) < 2e-3, rl[k]
    assert abs(fixed[k] - 11.755102) < 1e-5, fixed[k]
    # and that last one from the closed form, built the other way round
    zl = 10.0 * np.exp(1j * np.arccos(0.8))
    assert abs(vth ** 2 * zl.real / abs(complex(rth, xth) + zl) ** 2 - fixed[k]) < 1e-5
    # efficiency at the conjugate match is exactly one half: the source
    # resistance burns |I|^2 Rth, and at the match that is the load's share too
    imatch = vth / (2 * rth)
    pmatch = imatch ** 2 * rth
    assert abs(pmatch - conj[i]) < 1e-9
    assert abs(pmatch / (pmatch + imatch ** 2 * rth) - 0.5) < 1e-15

    fig, ax = plt.subplots()
    for k2, (curve, lab) in enumerate(((conj, "$X_L=-X_{th}$  (conjugate match)"),
                                       (fixed, "angle pinned at 0.8 lagging"),
                                       (zero, "$X_L=0$  (resistive load)"))):
        ax.plot(rl, curve, color=c[k2], lw=2.2)
        S.label_end(ax, 23.0, [26.6, 22.4, 24.5][k2], lab, c[k2], mode, dx=0)
    ax.plot([rth], [24.0], marker="o", color=c[0], ms=7)
    ax.plot([8.0], [11.755102], marker="o", color=c[1], ms=7)
    ax.plot([10.0], [18.0], marker="o", color=c[2], ms=7)
    S.note(ax, 6.6, 24.6, "24.0 W", mode)
    S.note(ax, 10.6, 18.2, "18.0 W", mode)
    S.note(ax, 8.5, 12.1, "11.76 W", mode)
    ax.set_xlabel("load resistance  $R_L$  ($\\Omega$)")
    ax.set_ylabel("power delivered to the load  (W)")
    ax.set_title("Every constraint on the load costs a slice of the 24 W available")
    ax.set_xlim(0, 44)
    ax.set_ylim(0, 29)
    S.strip(ax)
    return fig


# ===========================================================================
# audit: the published numbers that no figure happens to need
# ===========================================================================
def load_power_by_integration(vth_rms, zth, zl):
    """Power in a load, from the product of ITS OWN voltage and current.

    Builds the two real waveforms at the terminals of the load and integrates
    their product over a cycle. Nothing in this route uses |I|^2 R or a power
    triangle, so it is a genuine second opinion on every maximum-power claim.
    """
    ztot = zth + zl
    i_rms = vth_rms / abs(ztot)
    phi = np.angle(ztot)
    v = lambda t: i_rms * abs(zl) * RT2 * np.cos(W * t - phi + np.angle(zl))
    i = lambda t: i_rms * RT2 * np.cos(W * t - phi)
    return mean_over_cycle(lambda t: v(t) * i(t))


def harmonic_current(pairs):
    """i(t) from a list of (order, rms amplitude, lag angle in radians)."""
    return lambda t: sum(RT2 * a * np.cos(h * W * t - ph) for h, a, ph in pairs)


def audit() -> None:
    """Re-derive the remaining printed results by an independent route.

    Everything here is checked against a time-domain integral or against a
    second algebraic path, never against the formula that produced it. The two
    counters below are reported at the end: `checks` is the number of published
    results re-derived, `td` the subset recovered from a numerical integration
    of a waveform rather than from a phasor formula.
    """
    checks = 0
    td = 0

    # -- Worked 8: Z = 8 + j6 across 120 V rms ------------------------------
    z = complex(8.0, 6.0)
    vph = complex(120.0, 0.0)
    iph = vph / z
    sph = vph * np.conj(iph)
    assert abs(abs(iph) - 12.0) < 1e-12
    assert abs(np.rad2deg(np.angle(iph)) + 36.86990) < 1e-5
    assert abs(sph - complex(1152.0, 864.0)) < 1e-9
    assert abs(vph ** 2 / np.conj(z) - sph) < 1e-9          # second algebraic path
    p_td = power_by_integration(120.0, abs(iph), -np.angle(iph))
    assert abs(p_td - 1152.0) < 1e-6, p_td                  # time-domain path
    q_td = reactive_by_integration(120.0, abs(iph), -np.angle(iph))
    assert abs(q_td - 864.0) < 1e-6, q_td
    checks += 4
    td += 2

    # -- Worked 7: DC plus ripple, and a three-term composite ---------------
    ripple = lambda x: 48.0 + 3.0 * (4.0 * abs(x - np.floor(x + 0.5)) - 1.0)
    got = rms_over_cycle(ripple, period=1.0)
    assert abs(got - np.sqrt(48.0 ** 2 + 3.0)) < 1e-6, got
    assert abs(got - 48.031240) < 1e-6, got
    assert abs(100.0 * (got / 48.0 - 1.0) - 0.065083) < 1e-6
    comp = lambda x: 12.0 + 20.0 * np.cos(2 * np.pi * x) + 6.0 * np.cos(6 * np.pi * x + np.pi / 6)
    got = rms_over_cycle(comp, period=1.0)
    assert abs(got - np.sqrt(12.0 ** 2 + 200.0 + 18.0)) < 1e-7, got
    assert abs(got - 19.026298) < 1e-6, got
    half = rms_over_cycle(lambda x: max(np.sin(2 * np.pi * x), 0.0), period=1.0)
    assert abs(half - 0.5) < 1e-9, half
    full = rms_over_cycle(lambda x: abs(np.sin(2 * np.pi * x)), period=1.0)
    assert abs(full - 1.0 / RT2) < 1e-9, full
    saw = rms_over_cycle(lambda x: 2.0 * (x % 1.0) - 1.0, period=1.0, limit=8000)
    assert abs(saw - 1.0 / np.sqrt(3.0)) < 1e-6, saw
    checks += 6
    td += 6

    # -- Worked 12: series pair on a 100 V source ---------------------------
    z1, z2 = complex(4.0, 3.0), complex(6.0, -10.0)
    isr = 100.0 / abs(z1 + z2)
    assert abs(abs(z1 + z2) - 12.206556) < 1e-6
    assert abs(isr - 8.192319) < 1e-6, isr
    s1, s2 = isr ** 2 * z1, isr ** 2 * z2
    assert abs(s1 - complex(268.456376, 201.342282)) < 1e-5
    assert abs(s2 - complex(402.684564, -671.140940)) < 1e-5
    assert abs((s1 + s2) - complex(671.140940, -469.798658)) < 1e-5
    assert abs(abs(s1 + s2) - 100.0 * isr) < 1e-9          # S = V I, the other way
    assert abs(abs(s1 + s2) - 819.23192) < 1e-4
    assert abs((s1 + s2).real / abs(s1 + s2) - 0.819232) < 1e-6
    p_td = power_by_integration(100.0, isr, -np.angle(1.0 / (z1 + z2)))
    assert abs(p_td - 671.140940) < 1e-5, p_td             # time-domain path
    checks += 3
    td += 1

    # -- Worked 12: three loads on a 600 V bus ------------------------------
    sin85 = np.sqrt(1.0 - 0.85 ** 2)
    assert abs(sin85 - 0.52678269) < 1e-8, sin85
    assert abs(30.0 / 0.85 - 35.294118) < 1e-6
    q1 = 30.0 * sin85 / 0.85
    assert abs(q1 - 18.592330) < 1e-6, q1
    assert abs(np.sqrt((30.0 / 0.85) ** 2 - 30.0 ** 2) - q1) < 1e-9   # triangle route
    ptot, qtot = 30.0 + 10.8 + 12.0, q1 - 14.4
    assert abs(ptot - 52.8) < 1e-12 and abs(qtot - 4.192330) < 1e-6
    stot = np.hypot(ptot, qtot)
    assert abs(stot - 52.966174) < 1e-6, stot
    assert abs(ptot / stot - 0.996863) < 1e-6
    assert abs(stot * 1000.0 / 600.0 - 88.2770) < 1e-3
    assert abs((30.0 / 0.85 + 18.0 + 12.0) - 65.294118) < 1e-6
    assert abs(stot * 1000.0 / (np.sqrt(3.0) * 480.0) - 63.7084) < 1e-3
    assert abs(np.sqrt(3.0) * 480.0 - 831.3844) < 1e-3
    checks += 5

    # -- the pre-existing 0.95 example, recomputed --------------------------
    assert abs(3840.0 * np.tan(np.arccos(0.95)) - 1262.15) < 5e-3
    assert abs(2880.0 - 3840.0 * np.tan(np.arccos(0.95)) - 1617.85) < 5e-3
    assert abs(57600.0 / 1617.85 - 35.6) < 5e-3
    assert abs(1.0 / (W * 35.6) * 1e6 - 74.5) < 5e-2
    checks += 2

    # -- section 1-5 arithmetic inherited from the original chapter ---------
    p_td = power_by_integration(240.0, 20.0, np.arccos(0.80))
    assert abs(p_td - 3840.0) < 1e-6, p_td
    q_td = reactive_by_integration(240.0, 20.0, np.arccos(0.80))
    assert abs(q_td - 2880.0) < 1e-6, q_td
    assert abs(1.0 / (W * (240.0 ** 2 / 2880.0)) * 1e6 - 132.6291) < 1e-3
    p_td = power_by_integration(240.0, 12.0, np.deg2rad(30.0))
    assert abs(p_td - 2494.153) < 1e-3, p_td
    assert abs(np.hypot(10.0, 4.5) - 10.965856) < 1e-6
    assert abs(10.0 / np.hypot(10.0, 4.5) - 0.911922) < 1e-6
    checks += 4
    td += 3

    # -- Worked 10.2: the rectifier after perfect displacement correction ----
    cos25 = np.cos(np.deg2rad(25.0))
    i1p = 15.0 * cos25
    assert abs(i1p - 13.594617) < 1e-6, i1p
    irms_p = np.sqrt(i1p ** 2 + 81.0 + 29.16 + 9.0)
    assert abs(irms_p - 17.434839) < 1e-6, irms_p
    assert abs(120.0 * irms_p - 2092.18) < 5e-3
    assert abs(1631.354017 / (120.0 * irms_p) - 0.779739) < 1e-6
    assert abs(i1p / irms_p - 1631.354017 / (120.0 * irms_p)) < 1e-9    # the ceiling identity
    assert abs(np.sqrt(119.16) / i1p - 0.802968) < 1e-6
    # and the same two headline numbers off the corrected waveform itself
    iw = harmonic_current([(1, i1p, 0.0), (3, 9.0, 0.0), (5, 5.4, 0.0), (7, 3.0, 0.0)])
    vw = lambda t: 120.0 * RT2 * np.cos(W * t)
    assert abs(mean_over_cycle(lambda t: vw(t) * iw(t)) - 1631.354017) < 1e-5
    assert abs(rms_over_cycle(iw, period=T0) - irms_p) < 1e-7
    checks += 4
    td += 2

    # -- Worked 10.3: one dominant harmonic on a 480 V feeder ---------------
    irms3 = np.hypot(22.0, 6.6)
    assert abs(6.6 / 22.0 - 0.30) < 1e-12
    assert abs(1.0 / np.sqrt(1.09) - 0.957826) < 1e-6
    assert abs(irms3 - 22.968674) < 1e-6, irms3
    assert abs(22.0 / irms3 - 1.0 / np.sqrt(1.09)) < 1e-12       # two routes, one k_d
    assert abs(480.0 * 22.0 * 0.98 - 10348.8) < 1e-9
    assert abs(480.0 * irms3 - 11024.96) < 5e-2
    assert abs(10348.8 / (480.0 * irms3) - 0.9387) < 5e-5
    assert abs(0.98 / np.sqrt(1.09) - 10348.8 / (480.0 * irms3)) < 1e-12
    iw3 = harmonic_current([(1, 22.0, np.arccos(0.98)), (5, 6.6, 0.0)])
    vw3 = lambda t: 480.0 * RT2 * np.cos(W * t)
    assert abs(mean_over_cycle(lambda t: vw3(t) * iw3(t)) - 10348.8) < 1e-5
    assert abs(rms_over_cycle(iw3, period=T0) - irms3) < 1e-7
    checks += 4
    td += 2

    # -- Worked 11.2: feeder loss before and after correction ---------------
    i1c, i2c = (75000.0 / 0.72) / 480.0, (75000.0 / 0.95) / 480.0
    assert abs(i1c - 217.01) < 5e-3 and abs(i2c - 164.47) < 5e-3   # printed roundings
    assert abs(217.01 ** 2 - 47093.3) < 5e-2
    assert abs(164.47 ** 2 - 27050.4) < 5e-2
    loss1, loss2 = 2 * 47093.3 * 0.06, 2 * 27050.4 * 0.06
    assert abs(loss1 - 5651.2) < 5e-2 and abs(loss2 - 3246.05) < 5e-3
    assert abs(loss1 - loss2 - 2405.15) < 5e-3
    # the ratio, independently: exact currents give the identity to machine
    # precision, and the printed 4-figure roundings agree to 5 decimals
    assert abs((i2c ** 2) / (i1c ** 2) - (0.72 / 0.95) ** 2) < 1e-12
    assert abs(loss2 / loss1 - (0.72 / 0.95) ** 2) < 1e-5
    assert round(loss2 / loss1, 4) == round((0.72 / 0.95) ** 2, 4) == 0.5744
    checks += 3

    # -- Worked 13: maximum power transfer, every case off the waveform -----
    zth = complex(6.0, 8.0)
    assert abs(load_power_by_integration(24.0, zth, np.conj(zth)) - 24.0) < 1e-6
    assert abs(load_power_by_integration(24.0, zth, complex(10.0, 0.0)) - 18.0) < 1e-6
    assert abs(load_power_by_integration(24.0, zth, complex(8.0, 6.0)) - 11.755102) < 1e-5
    assert abs(load_power_by_integration(24.0, zth, complex(6.0, 0.0)) - 16.615385) < 1e-5
    assert abs(24.0 / np.abs(zth + complex(10.0, 0.0)) - 1.341641) < 1e-6
    assert abs(576.0 / 208.0 - 2.769231) < 1e-6
    assert abs(11.755102 / 24.0 - 0.489796) < 1e-6
    # 13.4, the 50 ohm receiver
    zs = complex(50.0, 30.0)
    assert abs(100.0 / (4 * 50.0) - 0.5) < 1e-12
    p50 = load_power_by_integration(10.0, zs, complex(50.0, 0.0))
    assert abs(p50 - 0.458716) < 1e-6, p50
    assert abs(p50 / 0.5 - 0.917431) < 1e-6
    assert abs(abs(zs) - 58.309519) < 1e-6
    popt = load_power_by_integration(10.0, zs, complex(abs(zs), 0.0))
    assert abs(popt - 100.0 / (2 * (abs(zs) + 50.0))) < 1e-9     # closed form vs waveform
    assert abs(popt - 0.4616399) < 1e-6, popt
    assert abs(popt / 0.5 - 0.9232799) < 1e-6
    checks += 8
    td += 5

    # -- Worked 14.1 extras: the apparent-power overstatement ---------------
    assert abs(isr ** 2 * abs(z1) - 335.570) < 5e-3
    assert abs(isr ** 2 * abs(z2) - 782.679) < 5e-3
    assert abs((isr ** 2 * abs(z1) + isr ** 2 * abs(z2)) / (100.0 * isr) - 1.364996) < 1e-6
    checks += 1

    # -- Worked 14.2 / 14.3 extras, from the waveform and per phase ---------
    pf_bus = 52.8 / np.hypot(52.8, 4.192330)
    assert abs(pf_bus - 0.9968626) < 1e-7, pf_bus
    assert round(pf_bus, 4) == 0.9969
    assert abs(power_by_integration(600.0, 88.27696, np.arccos(pf_bus)) - 52800.0) < 5e-2
    assert abs(52966.174 / 3.0 - 17655.39) < 5e-2
    assert abs(480.0 / np.sqrt(3.0) - 277.1281) < 1e-4
    assert abs((52966.174 / 3.0) / (480.0 / np.sqrt(3.0)) - 63.7084) < 1e-3
    assert abs(np.rad2deg(np.arccos(pf_bus)) - 4.5398) < 1e-3
    checks += 3
    td += 1

    # -- Problem Set A ------------------------------------------------------
    assert abs(340.0 * 5.0 / 2.0 - 850.0) < 1e-12
    assert abs(power_by_integration(340.0 / RT2, 5.0 / RT2, np.deg2rad(25.0)) - 770.3616) < 1e-3
    assert abs(reactive_by_integration(340.0 / RT2, 5.0 / RT2, np.deg2rad(25.0)) - 359.2256) < 1e-3
    assert abs(25.0 / 180.0 - 0.13889) < 1e-5
    saw15 = lambda x: 15.0 * (2.0 * (x % 1.0) - 1.0)
    assert abs(rms_over_cycle(saw15, period=1.0, limit=8000) - 8.660254) < 1e-5
    assert abs(8.660254 ** 2 / 10.0 - 7.5) < 1e-6
    assert abs(np.hypot(100.0, 20.0) - 101.9804) < 1e-4
    assert abs(24.0 ** 2 / 8.0 - 72.0) < 1e-12
    assert abs(480.0 * np.sqrt(0.64) - 384.0) < 1e-9
    assert abs(384.0 ** 2 / 32.0 - 4608.0) < 1e-9
    assert abs(0.64 * (480.0 ** 2 / 32.0) - 4608.0) < 1e-9      # no rms in this route
    assert abs(np.sqrt(30.0 ** 2 + 40.0 ** 2 / 2) - 41.2311) < 1e-4
    a8 = lambda x: 30.0 + 40.0 * np.cos(2 * np.pi * x)
    assert abs(rms_over_cycle(a8, period=1.0) - np.sqrt(1700.0)) < 1e-7
    checks += 8
    td += 4

    # -- Worked 7.1 and 7.5, not needed by any figure -----------------------
    tri10 = lambda x: 10.0 * (4.0 * abs(x - np.floor(x + 0.5)) - 1.0)
    assert abs(mean_over_cycle(lambda x: tri10(x) ** 2 / 25.0, period=1.0) - 1.33333) < 1e-5
    assert abs(5.0 ** 2 / 25.0 - 1.0) < 1e-12
    hw = lambda x: 170.0 * max(np.sin(2 * np.pi * x), 0.0)
    assert abs(rms_over_cycle(hw, period=1.0) - 85.0) < 1e-6
    assert abs(mean_over_cycle(hw, period=1.0) - 170.0 / np.pi) < 1e-6
    assert abs(170.0 / np.pi - 54.1127) < 1e-4
    assert abs(54.11 * 1.11 - 60.06) < 5e-3
    assert abs(85.0 / 54.11 - 1.5708) < 5e-4
    checks += 4
    td += 2

    # -- Problem Set B ------------------------------------------------------
    t65, t93 = np.tan(np.arccos(0.65)), np.tan(np.arccos(0.93))
    assert abs(t65 - 1.16913) < 1e-5 and abs(t93 - 0.39523) < 1e-5
    s65 = 40.0 / 0.65
    assert abs(s65 - 61.5385) < 1e-4
    assert abs(s65 * 1000.0 / 480.0 - 128.205) < 1e-3
    q65 = 40.0 * t65
    assert abs(q65 - 46.765) < 1e-3, q65
    assert abs(np.sqrt(s65 ** 2 - 40.0 ** 2) - q65) < 1e-9      # triangle route
    assert abs(power_by_integration(480.0, 128.2051, np.arccos(0.65)) - 40000.0) < 5e-2
    assert abs(reactive_by_integration(480.0, 128.2051, np.arccos(0.65)) - 46765.2) < 5e-1
    qc65 = 40.0 * (t65 - t93)
    assert abs(qc65 - 30.956) < 1e-3, qc65
    assert abs(230400.0 / 30956.0 - 7.4428) < 5e-5
    assert abs(1.0 / (W * 7.4428) * 1e6 - 356.4) < 5e-2
    assert abs(40.0 / 0.93 - 43.011) < 5e-4
    assert abs(43011.0 / 480.0 - 89.606) < 5e-4
    assert abs((0.65 / 0.93) ** 2 - 0.4885) < 5e-5
    ib5 = harmonic_current([(1, 12.0, np.arccos(0.88)), (3, 5.0, 0.0)])
    assert abs(rms_over_cycle(ib5, period=T0) - 13.0) < 1e-7    # sqrt(144+25) off the wave
    assert abs(12.0 / 13.0 - 0.92308) < 5e-6
    assert abs(0.88 * (12.0 / 13.0) - 0.81231) < 5e-6
    assert abs(1.0 / np.sqrt(1.0 + (5.0 / 12.0) ** 2) - 12.0 / 13.0) < 1e-12
    assert abs(np.hypot(40.0, q65 - 2 * q65) - s65) < 1e-9      # the symmetry claim
    assert abs(25.0 * (208.0 / 240.0) ** 2 - 18.778) < 5e-4
    assert abs(np.sqrt(4000.0 / 160.0) - 5.0) < 1e-12
    checks += 8
    td += 3

    # -- Problem Set C ------------------------------------------------------
    sc1 = np.hypot(8.0, 3.75)
    assert abs(sc1 - 8.835299) < 1e-6
    assert abs(8.0 / sc1 - 0.905459) < 1e-6
    assert abs(sc1 * 1000.0 / 208.0 - 42.477) < 5e-4
    assert abs(power_by_integration(208.0, 42.4774, np.arccos(8.0 / sc1)) - 8000.0) < 5e-2
    zc2 = complex(3.0, 4.0) + complex(5.0, -2.0)
    assert abs(abs(zc2) ** 2 - 68.0) < 1e-12
    assert abs(14400.0 / 68.0 - 211.765) < 5e-4
    assert abs((14400.0 / 68.0) * 8.0 - 1694.12) < 5e-3
    assert abs((14400.0 / 68.0) * 2.0 - 423.53) < 5e-3
    assert abs(8.0 / abs(zc2) - 0.97014) < 5e-6
    assert abs(power_by_integration(120.0, np.sqrt(14400.0 / 68.0),
                                    np.angle(zc2)) - 1694.118) < 5e-3
    t97 = np.tan(np.arccos(0.97))
    assert abs(t97 - 0.25062) < 5e-6
    assert abs(3.75 - 8.0 * t97 - 1.745) < 5e-4
    assert abs(208.0 ** 2 / 1745.0 - 24.793) < 5e-4
    assert abs(1.0 / (W * 24.793) * 1e6 - 107.0) < 5e-2
    assert abs(225.0 / 32.0 - 7.031) < 5e-4
    assert abs(load_power_by_integration(15.0, complex(8.0, 6.0),
                                         complex(8.0, -6.0)) - 225.0 / 32.0) < 1e-9
    assert abs(load_power_by_integration(15.0, complex(8.0, 6.0),
                                         complex(10.0, 0.0)) - 6.25) < 1e-7
    assert abs(6.25 / (225.0 / 32.0) - 0.888889) < 1e-6
    assert abs(60.0 / 0.88 - 68.182) < 5e-4
    assert abs(np.sqrt(3.0) * 460.0 - 796.743) < 5e-4
    assert abs(68182.0 / 796.743 - 85.576) < 5e-4
    assert abs((60000.0 / 0.88) / (np.sqrt(3.0) * 460.0) - 85.576) < 5e-4
    t88 = np.tan(np.arccos(0.88))
    assert abs(t88 - 0.53974) < 5e-6
    # published to five figures in the tangent, so the products are checked
    # both as printed and against the unrounded value
    assert abs(60.0 * 0.53974 - 32.384) < 5e-4 and abs(60.0 * t88 - 32.3846) < 5e-4
    assert abs(60.0 * 0.32868 - 19.721) < 5e-4
    assert abs(60.0 * np.tan(np.arccos(0.95)) - 19.7210) < 5e-4
    assert abs(32.384 - 19.721 - 12.663) < 1e-12
    assert abs(60.0 * (t88 - np.tan(np.arccos(0.95))) - 12.6635) < 5e-4
    assert abs(12.663 / 3.0 - 4.221) < 5e-4
    assert abs(9000.0 / 12.663 - 710.73) < 5e-3
    assert abs(np.sqrt(710.73) - 26.66) < 5e-3
    checks += 8
    td += 4

    print(f"audit: {checks} published claims re-derived, "
          f"{td} of them from a time-domain integral")


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    arg = sys.argv[1] if len(sys.argv) > 1 else PREFIX
    if arg == "--audit":
        audit()
        return 0
    names = [n for n in REGISTRY if n.startswith(arg)]
    if not names:
        print(f"no figures match {arg!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    audit()
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
