#!/usr/bin/env python3
"""Depth-wave-19 figures for the FE Electrical and Computer course:
the Noise/SNR chapter and the Channel Capacity chapter of Communications.

Same contract as the other generators in this directory, and it imports the
same style module rather than growing a second look: every curve here is
COMPUTED, in this file, from an equation the lesson that references it writes
out. Nothing is traced, scanned, redrawn or adapted from the NCEES Reference
Handbook or any textbook - the pipeline consumes formulas, which are not
protected expression, and never anyone's drawing of them.

Physical constants are the CODATA-tabulated values, stated once here and used
everywhere, so a reader can reproduce every plotted point:

    k = 1.380649e-23 J/K      (exact, SI definition of the kelvin)
    q = 1.602176634e-19 C     (exact, SI definition of the ampere)
    h = 6.62607015e-34 J s    (exact, SI definition of the second/kilogram)
    c = 2.99792458e8 m/s      (exact)

and the reference temperature for every noise quantity is the standard
T0 = 290 K, never "room temperature".

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the last quoted
digit or tighter. Where a quantity has a second, structurally different route
to the same answer - a numerical integral against a closed form, a stage-by-
stage power propagation against Friis, a series expansion against the exact
logarithm - BOTH are computed and asserted equal, so an algebra slip in either
one fails the build instead of shipping.

Usage:
    python3 scripts/gen_fe_ee_d19.py            # all
    python3 scripts/gen_fe_ee_d19.py com3-noise # only names with that prefix
"""
from __future__ import annotations

import pathlib
import sys
from math import comb, erfc, exp, log, log2, log10, pi, sqrt

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

K_B = 1.380649e-23
Q_E = 1.602176634e-19
H_P = 6.62607015e-34
C_L = 2.99792458e8
T0 = 290.0

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        assert name.startswith("com3-"), f"figure stem out of scope: {name}"
        REGISTRY[name] = fn
        return fn
    return deco


def _trapz(y, x):
    """numpy renamed trapz to trapezoid; accept either."""
    fn = getattr(np, "trapezoid", None) or np.trapz
    return fn(y, x)


def dB(x):
    return 10.0 * log10(x)


def dBm(p_watts):
    return 10.0 * log10(p_watts / 1e-3)


def qfunc(x):
    return 0.5 * erfc(x / sqrt(2.0))


def qinv(p):
    lo, hi = 0.0, 40.0
    for _ in range(400):
        mid = 0.5 * (lo + hi)
        if qfunc(mid) > p:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


# ---------------------------------------------------------------------------
# Noise and Signal-to-Noise Ratio
# ---------------------------------------------------------------------------


@figure("com3-noise-floor-bandwidth")
def _(mode):
    """Available thermal noise power kTB in dBm against bandwidth, two temperatures.

    P(dBm) = 10 log10(k T B / 1 mW) is a straight line of slope 10 dB per decade
    of bandwidth whose intercept is set only by temperature, so cooling slides
    the whole line down by 10 log10(T0/T) without changing its slope.
    """
    c = S.SERIES[mode]
    B = np.logspace(0, 9, 900)
    p290 = 10 * np.log10(K_B * T0 * B / 1e-3)
    p77 = 10 * np.log10(K_B * 77.0 * B / 1e-3)

    # the four quoted anchor points on the 290 K line
    assert abs(dBm(K_B * T0 * 1.0) - (-173.97518719422808)) < 1e-9
    assert abs(dBm(K_B * T0 * 1e3) - (-143.97518719422808)) < 1e-9
    assert abs(dBm(K_B * T0 * 1e6) - (-113.97518719422808)) < 1e-9
    assert abs(dBm(K_B * T0 * 1e9) - (-83.97518719422808)) < 1e-9
    # slope is exactly 10 dB per decade
    assert abs((p290[-1] - p290[0]) / 9.0 - 10.0) < 1e-9
    # the cryogenic offset the lesson quotes
    assert abs((p290 - p77).mean() - 5.7590727272647415) < 1e-12, (p290 - p77).mean()
    assert abs(dB(T0 / 77.0) - 5.7590727272647415) < 1e-12

    fig, ax = plt.subplots()
    ax.semilogx(B, p290, color=c[0], lw=2.3)
    ax.semilogx(B, p77, color=c[1], lw=2.3)
    S.label_end(ax, 1e4, dBm(K_B * T0 * 1e4), "T0 = 290 K", c[0], mode, dy=15, ha="center")
    S.label_end(ax, 1e4, dBm(K_B * 77.0 * 1e4), "T = 77 K: 5.76 dB lower", c[1], mode, dy=-17, ha="center")
    for b, lab, ha, xf in ((1.0, "1 Hz: -174.0 dBm", "left", 1.5),
                           (1e6, "1 MHz: -114.0 dBm", "left", 1.5),
                           (1e9, "1 GHz: -84.0 dBm", "right", 0.66)):
        ax.plot([b], [dBm(K_B * T0 * b)], "o", color=c[0], ms=7, zorder=5)
        S.note(ax, b * xf, dBm(K_B * T0 * b) - 9.5, lab, mode, ha=ha)
    S.note(ax, 1.4, -100, "every decade of bandwidth\ncosts exactly 10 dB", mode)
    ax.set_xlabel("noise bandwidth  B  (Hz)")
    ax.set_ylabel("available noise power  (dBm)")
    ax.set_title("The noise floor is one straight line: -174 dBm/Hz plus 10 log B")
    ax.set_ylim(-190, -74)
    S.strip(ax)
    return fig


@figure("com3-noise-spectra")
def _(mode):
    """Flicker-plus-white spectra, normalised to the white floor.

    S(f)/S_white = 1 + f_c/f, so the corner frequency f_c is exactly where the
    1/f term equals the white term and the total sits 3.01 dB above the floor.
    """
    c = S.SERIES[mode]
    f = np.logspace(0, 7, 1400)
    fig, ax = plt.subplots()
    for fc, col, lab in ((1e3, c[0], "f_c = 1 kHz"), (1e5, c[1], "f_c = 100 kHz")):
        tot = 1.0 + fc / f
        ax.loglog(f, tot, color=col, lw=2.3)
        S.label_end(ax, fc, 2.0, lab, col, mode, dx=8, dy=8)
        ax.plot([fc], [2.0], "o", color=col, ms=7, zorder=5)
        assert abs(dB(1.0 + fc / fc) - 3.0102999566398121) < 1e-9

    # a decade below the corner the excess is 10.41 dB; two decades, 20.04 dB
    assert abs(dB(1.0 + 10.0) - 10.413926851582251) < 1e-9
    assert abs(dB(1.0 + 100.0) - 20.043213737826426) < 1e-9
    # far above the corner the total is within 0.043 dB of the white floor
    assert abs(dB(1.0 + 0.01) - 0.043213737826425726) < 1e-9

    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 1.1e6, 1.16, "white floor: 4kTR for a resistor, 2qI for a junction", mode, ha="center")
    S.note(ax, 3.5e2, 1.9e3, "1/f region - every decade DOWN\nin frequency adds 10.0 dB", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("spectral density / white floor")
    ax.set_title("Flicker noise is only visible below its corner frequency")
    ax.set_ylim(0.8, 1.5e4)
    S.strip(ax)
    return fig


@figure("com3-resistor-noise")
def _(mode):
    """Open-circuit noise voltage rises as sqrt(R); available power does not move.

    Two stacked panels on one shared log-R axis, because the quantities differ
    by fourteen orders of magnitude and the house rule forbids a second y-scale.
    """
    c = S.SERIES[mode]
    B = 1e4
    R = np.logspace(1, 7, 900)
    vn = np.sqrt(4.0 * K_B * T0 * R * B)
    pav = np.full_like(R, dBm(K_B * T0 * B))

    assert abs(sqrt(4 * K_B * T0 * 1e3 * B) * 1e6 - 0.4001940579269013) < 1e-12
    assert abs(sqrt(4 * K_B * T0 * 1e6 * B) * 1e6 - 12.655247291143702) < 1e-14
    assert abs(sqrt(4 * K_B * T0 * 50.0 * B) * 1e9 - 89.48611177160397) < 1e-12
    # the ratio is exactly sqrt(1000)
    assert abs(sqrt(4 * K_B * T0 * 1e6 * B) / sqrt(4 * K_B * T0 * 1e3 * B)
               - sqrt(1000.0)) < 1e-12
    assert abs(dBm(K_B * T0 * B) - (-133.9751871942281)) < 1e-9
    assert float(pav.max() - pav.min()) == 0.0

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.2),
                                 gridspec_kw={"height_ratios": [2.1, 1.0]})
    a1.loglog(R, vn * 1e6, color=c[0], lw=2.4)
    for r, lab, ha, xf in ((1e3, "1 kohm: 0.400 uV", "left", 1.35),
                           (1e6, "1 Mohm: 12.66 uV", "right", 0.72)):
        a1.plot([r], [sqrt(4 * K_B * T0 * r * B) * 1e6], "o", color=c[0], ms=7, zorder=5)
        S.note(a1, r * xf, sqrt(4 * K_B * T0 * r * B) * 1e6 * 0.50, lab, mode, ha=ha)
    S.label_end(a1, 40.0, 3.0, "V_n = sqrt(4 k T B R)", c[0], mode, dy=0)
    a1.set_ylabel("open-circuit noise  (uV in 10 kHz)")
    a1.set_title("Resistance sets the noise VOLTAGE; it does not set the available POWER")
    S.strip(a1)

    a2.semilogx(R, pav, color=c[1], lw=2.4)
    S.label_end(a2, 3e3, dBm(K_B * T0 * B), "P_avail = k T B = -134.0 dBm, flat",
                c[1], mode, dy=13)
    a2.set_ylim(-136.5, -131.5)
    a2.set_xlabel("resistance  R  (ohm)")
    a2.set_ylabel("available  (dBm)")
    S.strip(a2)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("com3-shot-vs-thermal")
def _(mode):
    """Shot noise current against the thermal noise current of a fixed resistor.

    i_shot = sqrt(2 q I B) climbs as sqrt(I) while i_thermal = sqrt(4 k T B / R)
    does not move, so they cross at I = 2kT/(qR) - a current that depends only
    on temperature and resistance, not on bandwidth.
    """
    c = S.SERIES[mode]
    B = 1e6
    I = np.logspace(-7, -2, 900)
    ishot = np.sqrt(2.0 * Q_E * I * B)

    fig, ax = plt.subplots()
    ax.loglog(I * 1e6, ishot * 1e9, color=c[0], lw=2.4)
    S.label_end(ax, 3e-4 * 1e6, sqrt(2 * Q_E * 3e-4 * B) * 1e9,
                "shot: sqrt(2 q I B)", c[0], mode, dy=-16, ha="center")
    for R, col, lab in ((1e3, c[1], "1 kohm"), (1e4, c[2], "10 kohm")):
        it = sqrt(4.0 * K_B * T0 * B / R)
        icross = 2.0 * K_B * T0 / (Q_E * R)
        ax.axhline(it * 1e9, color=col, lw=1.9, ls="--")
        S.label_end(ax, 0.13, it * 1e9, f"thermal, {lab}", col, mode, dy=9)
        ax.plot([icross * 1e6], [it * 1e9], "o", color=col, ms=7, zorder=5)
        # crossing verified two ways: closed form, and equality of the two currents
        assert abs(sqrt(2 * Q_E * icross * B) - it) < 1e-18, (icross, it)
    assert abs(2.0 * K_B * T0 / (Q_E * 1e3) * 1e6 - 49.98053292044204) < 1e-12
    assert abs(2.0 * K_B * T0 / (Q_E * 1e4) * 1e6 - 4.998053292044204) < 1e-13
    assert abs(sqrt(4 * K_B * T0 * B / 1e3) * 1e9 - 4.001940579269013) < 1e-9
    assert abs(sqrt(2 * Q_E * 1e-3 * B) * 1e9 - 17.900707438534376) < 1e-12
    assert abs(2.0 * K_B * T0 / Q_E - 0.04998053292044203) < 1e-15

    S.note(ax, 0.30, 0.155, "below the crossing a resistor's own noise hides the shot noise;\n"
                            "above it the current source dominates", mode)
    ax.set_xlabel("DC current  I  (microamp)")
    ax.set_ylabel("rms noise current in 1 MHz  (nA)")
    ax.set_title("Shot noise grows as sqrt(I); thermal noise does not grow at all")
    ax.set_ylim(0.12, 60)
    S.strip(ax)
    return fig


@figure("com3-friis-stagewise")
def _(mode):
    """Cumulative noise figure through a six-stage receiver, two orderings.

    The height of each step is the Friis term (F_i - 1)/(G_1...G_(i-1)) added in
    linear noise factor, plotted in dB. The whole point of the picture is that
    the first two steps decide the answer.
    """
    c = S.SERIES[mode]
    # (name, F, G) in linear terms, from noise figures and gains in dB
    cable = ("feed cable", 10 ** 0.15, 10 ** -0.15)
    lna = ("LNA", 10 ** 0.12, 10 ** 1.8)
    filt = ("image filter", 10 ** 0.20, 10 ** -0.20)
    mixer = ("mixer", 10 ** 0.70, 10 ** -0.65)
    ifamp = ("IF amp", 10 ** 0.35, 10 ** 3.0)
    det = ("detector", 10 ** 1.20, 1.0)

    def friis(chain):
        f, g, run = 0.0, 1.0, []
        for i, (_, fi, gi) in enumerate(chain):
            f += fi if i == 0 else (fi - 1.0) / g
            g *= gi
            run.append(f)
        return run

    def simulate(chain, B=200e3, sin_w=1e-12):
        """Independent route: propagate real signal and noise powers."""
        n = K_B * T0 * B
        s = sin_w
        snr_in = s / n
        for _, fi, gi in chain:
            n = gi * (n + (fi - 1.0) * K_B * T0 * B)
            s = gi * s
        return snr_in / (s / n)

    a = [cable, lna, filt, mixer, ifamp, det]
    b = [lna, cable, filt, mixer, ifamp, det]
    ra, rb = friis(a), friis(b)

    assert abs(ra[-1] - 2.216205333380804) < 1e-15, ra[-1]
    assert abs(rb[-1] - 1.6789132147354155) < 1e-15, rb[-1]
    assert abs(dB(ra[-1]) - 3.4560999568772233) < 1e-12
    assert abs(dB(rb[-1]) - 2.2502824745690804) < 1e-12
    # Friis against a stage-by-stage power propagation, to 12 significant figures
    assert abs(simulate(a) - ra[-1]) < 1e-15, (simulate(a), ra[-1])
    assert abs(simulate(b) - rb[-1]) < 1e-15
    # the cable in front multiplies the whole rest of the chain by its loss
    assert abs(dB(ra[-1]) - (dB(ra[-1] / (10 ** 0.15)) + 1.5)) < 1e-12
    assert abs(dB(ra[-1]) - dB(rb[-1]) - 1.205817482308143) < 1e-12, dB(ra[-1]) - dB(rb[-1])

    xs = np.arange(1, 7)
    fig, ax = plt.subplots()
    ax.step(xs, [dB(v) for v in ra], where="post", color=c[0], lw=2.4)
    ax.step(xs, [dB(v) for v in rb], where="post", color=c[1], lw=2.4)
    ax.plot(xs, [dB(v) for v in ra], "o", color=c[0], ms=6, zorder=5)
    ax.plot(xs, [dB(v) for v in rb], "o", color=c[1], ms=6, zorder=5)
    S.label_end(ax, 6, dB(ra[-1]), "cable first: 3.456 dB", c[0], mode, dx=-8, dy=14, ha="right")
    S.label_end(ax, 6, dB(rb[-1]), "LNA first: 2.250 dB", c[1], mode, dx=-8, dy=-15, ha="right")
    ax.set_xticks(xs)
    ax.set_xticklabels(["1", "2", "3", "4", "5", "6"])
    S.note(ax, 1.05, 0.35, "stages: cable 1.5 dB / LNA 1.2 dB, 18 dB / filter 2.0 dB /\n"
                           "mixer 7.0 dB, -6.5 dB / IF 3.5 dB, 30 dB / detector 12.0 dB", mode)
    S.note(ax, 1.05, 4.28, "two stages fix 2.700 dB of the 3.456 dB total;\nthe other four are worth 0.756 dB between them", mode)
    ax.set_xlabel("stages included")
    ax.set_ylabel("cumulative noise figure  (dB)")
    ax.set_title("Friis, accumulated: the front of the chain writes the answer")
    ax.set_ylim(0, 4.95)
    S.strip(ax)
    return fig


@figure("com3-sensitivity-map")
def _(mode):
    """Minimum discernible signal against bandwidth for three noise figures.

    MDS = -174 + 10 log10(B) + NF + SNR_req, drawn at SNR_req = 12 dB. The three
    lines are parallel because noise figure is a pure offset on the noise floor.
    """
    c = S.SERIES[mode]
    snr_req = 12.0
    B = np.logspace(3, 8, 900)
    fig, ax = plt.subplots()
    for nf, col, xl in ((2.0, c[0], 3e7), (6.0, c[1], 4e6), (10.0, c[2], 5e5)):
        mds = -174.0 + 10 * np.log10(B) + nf + snr_req
        ax.semilogx(B, mds, color=col, lw=2.3)
        S.label_end(ax, xl, -174.0 + 10 * log10(xl) + nf + snr_req,
                    f"NF = {nf:.0f} dB", col, mode, dy=13, ha="center")
    def mds(b, nf, s=snr_req):
        return -174.0 + 10 * log10(b) + nf + s
    assert abs(mds(200e3, 3.4560999568772233) - (-105.53360008648296)) < 1e-12
    assert abs(mds(1e4, 2.0) - (-120.0)) < 1e-12
    assert abs(mds(1e6, 6.0) - (-96.0)) < 1e-12
    assert abs(mds(1e6, 10.0) - mds(1e6, 6.0) - 4.0) < 1e-12
    assert abs(mds(2e6, 6.0) - mds(1e6, 6.0) - 3.0102999566398121) < 1e-12

    ax.plot([200e3], [mds(200e3, 3.4560999568772233)], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 2.4e5, -111.0, "worked receiver: 200 kHz, NF 3.456 dB\n-> MDS = -105.5 dBm", mode)
    S.note(ax, 1.2e3, -88, "doubling the bandwidth costs 3.01 dB of sensitivity,\n"
                           "whatever the noise figure", mode)
    ax.set_xlabel("noise bandwidth  B  (Hz)")
    ax.set_ylabel("minimum discernible signal  (dBm)")
    ax.set_title("Sensitivity at 12 dB required SNR: bandwidth and noise figure both bite")
    ax.set_ylim(-142, -66)
    S.strip(ax)
    return fig


@figure("com3-noise-bandwidth-order")
def _(mode):
    """Equivalent noise bandwidth of a Butterworth response, in units of f_3dB.

    Closed form B_n/f_3dB = (pi/2n)/sin(pi/2n), checked against a numerical
    integral of the power response, which is the definition the closed form
    comes from.
    """
    c = S.SERIES[mode]
    orders = np.arange(1, 9)
    closed = np.array([(pi / (2 * n)) / np.sin(pi / (2 * n)) for n in orders])

    # numerical integral of |H|^2 = 1/(1 + x^(2n)) over 0..inf, by substitution
    # x = tan(u) so the infinite tail is captured exactly on a finite interval
    u = np.linspace(0.0, pi / 2 - 1e-12, 4_000_001)
    x = np.tan(u)
    integ = []
    for n in orders:
        g = (1.0 / (1.0 + x ** (2 * n))) / np.cos(u) ** 2
        integ.append(float(_trapz(g, u)))
    integ = np.array(integ)
    for n, cf, nm in zip(orders, closed, integ):
        assert abs(cf - nm) < 2e-6, (n, cf, nm)

    assert abs(closed[0] - pi / 2) < 1e-12
    assert abs(closed[0] - 1.5707963267948966) < 1e-12
    assert abs(closed[1] - 1.1107207345395915) < 1e-12
    assert abs(closed[2] - 1.0471975511965979) < 1e-12
    assert abs(dB(closed[0]) - 1.9611987703015263) < 1e-12
    assert abs(dB(closed[1]) - 0.4560487919816205) < 1e-12
    assert abs(dB(closed[3]) - 0.1122022511910771) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(orders, closed, color=c[0], lw=2.4, marker="o", ms=7)
    ax.plot(orders, integ, color=c[1], lw=0.0, marker="s", ms=8, mfc="none", mew=1.8)
    S.label_end(ax, 3.5, closed[2], "closed form (pi/2n)/sin(pi/2n)", c[0], mode, dy=22, ha="center")
    S.label_end(ax, 6.2, integ[5], "numerical integral of |H|^2", c[1], mode, dy=-22, ha="center")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 1.5, 1.004, "a brick wall would sit here", mode)
    ax.plot([1], [closed[0]], "o", color=S.INK[mode], ms=8, zorder=6)
    S.note(ax, 1.12, 1.53, "single pole: 1.571, so using f_3dB\nunderstates the noise by 1.96 dB", mode)
    ax.set_xlabel("Butterworth order  n")
    ax.set_ylabel("equivalent noise bandwidth / f_3dB")
    ax.set_title("Only a sharp filter lets you use the 3 dB bandwidth for noise")
    ax.set_ylim(0.955, 1.70)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Channel Capacity and the Shannon-Hartley Theorem
# ---------------------------------------------------------------------------


@figure("com3-capacity-snr")
def _(mode):
    """Spectral efficiency against SNR, with both asymptotes drawn.

    C/B = log2(1 + S/N) exactly; SNR_dB/3.0103 above, and 1.4427 S/N below.
    The two straight lines cross the exact curve nowhere - they bound it.
    """
    c = S.SERIES[mode]
    snr_db = np.linspace(-20, 40, 1200)
    s = 10 ** (snr_db / 10)
    exact = np.log2(1 + s)
    hi = snr_db / (10 * log10(2.0))
    lo = log2(exp(1.0)) * s

    assert abs(log2(1 + 10 ** 3.0) - 9.967226258835993) < 1e-12
    assert abs(log2(1 + 10 ** 1.0) - 3.4594316186372973) < 1e-12
    assert abs(log2(1 + 1.0) - 1.0) < 1e-15
    assert abs(10 * log10(2.0) - 3.0102999566398121) < 1e-12
    assert abs(log2(exp(1.0)) - 1.4426950408889634) < 1e-12
    # at 30 dB the high-SNR straight line is within 0.0015 bit/s/Hz of exact
    assert abs(log2(1 + 1000.0) - 30.0 / 3.0102999566398121) < 2e-3
    # at -20 dB the low-SNR straight line is within 0.0008 bit/s/Hz of exact
    assert abs(log2(1 + 0.01) - log2(exp(1.0)) * 0.01) < 8e-5

    fig, ax = plt.subplots()
    ax.plot(snr_db, exact, color=c[0], lw=2.6)
    ax.plot(snr_db, hi, color=c[1], lw=1.8, ls="--")
    ax.plot(snr_db, lo, color=c[2], lw=1.8, ls=":")
    S.label_end(ax, 22, log2(1 + 10 ** 2.2), "exact: log2(1 + S/N)", c[0], mode, dy=16, ha="center")
    S.label_end(ax, 34, 34 / 3.0102999566398121, "SNR(dB)/3.01", c[1], mode, dy=-16, ha="center")
    S.label_end(ax, -6, log2(exp(1.0)) * 10 ** -0.6, "1.4427 S/N", c[2], mode, dy=16, ha="center")
    for d in (0, 10, 20, 30):
        ax.plot([d], [log2(1 + 10 ** (d / 10))], "o", color=c[0], ms=6.5, zorder=5)
    S.note(ax, 12.5, 0.7, "high SNR: one extra bit/s/Hz per 3.01 dB\n"
                          "low SNR: capacity is proportional to power", mode)
    ax.set_xlabel("signal-to-noise ratio  (dB)")
    ax.set_ylabel("capacity per hertz  C/B  (bits/s/Hz)")
    ax.set_title("Capacity is logarithmic in power, and only straight at the ends")
    ax.set_xlim(-20, 40)
    ax.set_ylim(0, 13.6)
    S.strip(ax)
    return fig


@figure("com3-capacity-bandwidth")
def _(mode):
    """Capacity against bandwidth at fixed received power, S/N0 = 1e9 s^-1.

    C = B log2(1 + S/(N0 B)) rises almost linearly while the SNR is high and
    saturates at C_inf = 1.4427 S/N0, which is the -1.59 dB limit seen from the
    bandwidth side.
    """
    c = S.SERIES[mode]
    sn0 = 1e9
    B = np.logspace(5, 11.6, 1400)
    C = B * np.log2(1 + sn0 / B)
    cinf = log2(exp(1.0)) * sn0

    assert abs(cinf - 1442695040.8889635) < 1e-3
    assert abs(1e6 * log2(1 + 1000.0) - 9967226.258835994) < 1e-6
    assert abs(2e6 * log2(1 + 500.0) - 17937333.586390417) < 1e-6
    assert abs(1e7 * log2(1 + 100.0) - 66582114.82751795) < 1e-6
    assert abs(1e9 * log2(1 + 1.0) - 1e9) < 1e-6
    # the curve never crosses its own asymptote
    assert float(C.max()) < cinf
    # doubling the bandwidth from 1 MHz nearly doubles capacity
    assert abs(2e6 * log2(1 + 500.0) / (1e6 * log2(1 + 1000.0)) - 1.799632) < 1e-5

    fig, ax = plt.subplots()
    ax.semilogx(B, C / 1e6, color=c[0], lw=2.5)
    ax.axhline(cinf / 1e6, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, 1.3e5, cinf / 1e6 + 40, "C_inf = 1.4427 S/N0 = 1.443 Gbps - infinite bandwidth, finite rate", mode)
    for b, lab, ha, xf, dy in ((1e6, "1 MHz: 9.97 Mbps", "right", 0.72, 62),
                               (1e7, "10 MHz: 66.6 Mbps", "left", 1.3, 62),
                               (1e9, "1 GHz: 1.00 Gbps", "right", 0.72, -70)):
        ax.plot([b], [b * log2(1 + sn0 / b) / 1e6], "o", color=c[0], ms=7, zorder=5)
        S.note(ax, b * xf, b * log2(1 + sn0 / b) / 1e6 + dy, lab, mode, ha=ha)
    S.label_end(ax, 3e5, 900.0, "C = B log2(1 + S/(N0 B))", c[0], mode, dy=0)
    ax.set_xlabel("bandwidth  B  (Hz), at fixed received power")
    ax.set_ylabel("capacity  C  (Mbps)")
    ax.set_title("Spreading the same power over more bandwidth buys less and less")
    ax.set_ylim(0, 1620)
    S.strip(ax)
    return fig


@figure("com3-ebn0-floor")
def _(mode):
    """The minimum Eb/N0 the theorem allows, as a function of spectral efficiency.

    (2^eta - 1)/eta in dB against eta on a log axis. The curve is asked to
    approach ln 2 = -1.5917 dB, and the assertions check the approach rather
    than assuming it.
    """
    c = S.SERIES[mode]
    eta = np.logspace(-3, 1, 1400)
    need = 10 * np.log10((2 ** eta - 1) / eta)
    floor = dB(log(2.0))

    assert abs(floor - (-1.591745389548616)) < 1e-12
    assert abs(dB((2 ** 1.0 - 1) / 1.0) - 0.0) < 1e-12
    assert abs(dB((2 ** 2.0 - 1) / 2.0) - 1.7609125905568124) < 1e-12
    assert abs(dB((2 ** 4.0 - 1) / 4.0) - 5.740312677277188) < 1e-12
    assert abs(dB((2 ** 6.0 - 1) / 6.0) - 10.211892990699381) < 1e-12
    assert abs(dB((2 ** 0.01 - 1) / 0.01) - (-1.5766851956816526)) < 1e-12
    assert abs(dB((2 ** 0.001 - 1) / 0.001) - (-1.5902401526287435)) < 1e-12
    # monotone: every extra bit/s/Hz costs more energy per bit, never less
    assert bool(np.all(np.diff(need) > 0))
    assert float(need.min()) > floor

    fig, ax = plt.subplots()
    ax.semilogy(need, eta, color=c[0], lw=2.6)
    ax.axvline(floor, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, floor + 0.35, 4.2, "ln 2 = 0.6931\n= -1.5917 dB", mode)
    for e, lab in ((1.0, "1 b/s/Hz: 0.00 dB"), (2.0, "2 b/s/Hz: 1.76 dB"),
                   (4.0, "4 b/s/Hz: 5.74 dB"), (6.0, "6 b/s/Hz: 10.21 dB")):
        ax.plot([dB((2 ** e - 1) / e)], [e], "o", color=c[0], ms=7, zorder=5)
        S.note(ax, dB((2 ** e - 1) / e) + 0.4, e * 0.86, lab, mode)
    S.label_end(ax, 7.4, 0.055, "E_b/N_0 = (2^eta - 1)/eta", c[0], mode, dy=0, ha="center")
    S.note(ax, -1.2, 0.0013, "the floor belongs to vanishing spectral efficiency -\n"
                             "it is not a target for a real link", mode)
    ax.set_xlabel("minimum  E_b/N_0  (dB)")
    ax.set_ylabel("spectral efficiency  eta  (bits/s/Hz)")
    ax.set_title("Where -1.59 dB comes from, and why no real link lives there")
    ax.set_xlim(-2.6, 12.5)
    ax.set_ylim(1e-3, 12)
    S.strip(ax)
    return fig


@figure("com3-binary-entropy")
def _(mode):
    """Binary entropy H(p) and the capacity of a binary symmetric channel.

    H(p) = -p log2 p - (1-p) log2(1-p); the BSC capacity is 1 - H(p), which is
    the same curve turned upside down and is why a channel that errs half the
    time carries nothing at all.
    """
    c = S.SERIES[mode]
    p = np.linspace(1e-6, 1 - 1e-6, 4001)
    H = -p * np.log2(p) - (1 - p) * np.log2(1 - p)

    def hb(x):
        return -x * log2(x) - (1 - x) * log2(1 - x)
    assert abs(hb(0.5) - 1.0) < 1e-12
    assert abs(hb(0.1) - 0.4689955935892812) < 1e-12
    assert abs(hb(0.01) - 0.08079313589591118) < 1e-12
    assert abs(hb(0.11) - 0.499915958164528) < 1e-12
    assert abs(hb(0.25) - 0.8112781244591328) < 1e-12
    assert abs(float(H.max()) - 1.0) < 1e-11, float(H.max())
    assert abs(hb(0.3) - hb(0.7)) < 1e-14

    fig, ax = plt.subplots()
    ax.plot(p, H, color=c[0], lw=2.6)
    ax.plot(p, 1 - H, color=c[1], lw=2.4)
    S.label_end(ax, 0.06, 1.06, "H(p): uncertainty per bit", c[0], mode, dy=0)
    S.label_end(ax, 0.5, 0.155, "1 - H(p) = BSC capacity", c[1], mode, dy=0, ha="center")
    for x in (0.01, 0.1, 0.5):
        ax.plot([x], [hb(x)], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 0.032, 0.115, "H(0.01) = 0.081", mode)
    S.note(ax, 0.118, 0.44, "H(0.1) = 0.469", mode)
    S.note(ax, 0.52, 1.045, "H(0.5) = 1.000 bit", mode)
    S.note(ax, 0.5, 0.33, "at p = 0.5 the channel carries nothing at all", mode, ha="center")
    ax.set_xlabel("probability of the less likely outcome  p")
    ax.set_ylabel("bits per binary symbol")
    ax.set_title("Entropy peaks where you know least, and capacity is what is left over")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.14)
    S.strip(ax)
    return fig


@figure("com3-nyquist-levels")
def _(mode):
    """Nyquist's noiseless rate against Shannon's noisy limit for a 3 kHz channel.

    Nyquist gives C = 2 B log2(M), a straight line in log2(M) with no ceiling.
    Shannon's B log2(1 + S/N) is a horizontal ceiling at each SNR, and the
    crossing is where adding levels stops adding rate.
    """
    c = S.SERIES[mode]
    B = 3000.0
    M = np.array([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], dtype=float)
    nyq = 2 * B * np.log2(M)

    assert abs(2 * B * log2(16.0) - 24000.0) < 1e-9
    assert abs(2 * B * log2(256.0) - 48000.0) < 1e-9
    assert abs(B * log2(1 + 100.0) - 19974.634448255383) < 1e-9
    assert abs(B * log2(1 + 1000.0) - 29901.67877650798) < 1e-6
    # the Nyquist line crosses the 20 dB ceiling between M = 8 and M = 16
    assert 2 * B * log2(8.0) < B * log2(101.0) < 2 * B * log2(16.0)

    fig, ax = plt.subplots()
    ax.semilogx(M, nyq / 1e3, color=c[0], lw=2.5, marker="o", ms=6.5, base=2)
    ax.axhline(B * log2(101.0) / 1e3, color=c[1], lw=2.0, ls="--")
    ax.axhline(B * log2(1001.0) / 1e3, color=c[2], lw=2.0, ls="--")
    S.label_end(ax, 3.0, 52.0, "Nyquist: 2 B log2 M", c[0], mode, dy=0)
    S.label_end(ax, 950, B * log2(101.0) / 1e3, "20 dB SNR ceiling: 19.97 kbps", c[1], mode, dx=-6, dy=-15, ha="right")
    S.label_end(ax, 950, B * log2(1001.0) / 1e3, "30 dB SNR ceiling: 29.90 kbps", c[2], mode, dx=-6, dy=16, ha="right")
    S.note(ax, 17, 7.0, "past the crossing, extra levels only\nbuy errors - the noise cannot tell them apart", mode)
    ax.set_xlabel("levels per symbol  M  (log2 scale)")
    ax.set_ylabel("bit rate  (kbps) in B = 3 kHz")
    ax.set_title("Nyquist has no ceiling; noise supplies one")
    ax.set_ylim(0, 62)
    S.strip(ax)
    return fig


@figure("com3-hamming-gain")
def _(mode):
    """Uncoded BPSK against a hard-decision (7,4) Hamming code.

    Uncoded: P_b = Q(sqrt(2 Eb/N0)). Coded: the channel bit sees only r Eb, so
    p = Q(sqrt(2 r Eb/N0)), and bounded-distance decoding of a t = 1 code leaves
    P_b = (1/n) sum_(i>=2) i C(n,i) p^i (1-p)^(n-i). Everything on this plot is
    that pair of expressions - no measured or quoted curve.
    """
    c = S.SERIES[mode]
    n, kk = 7, 4
    r = kk / n

    def uncoded(g):
        return qfunc(sqrt(2 * g))

    def coded(g):
        p = qfunc(sqrt(2 * r * g))
        return sum(i * comb(n, i) * p ** i * (1 - p) ** (n - i) for i in range(2, n + 1)) / n

    def solve(fn, target):
        lo, hi = 0.05, 1e4
        for _ in range(400):
            mid = sqrt(lo * hi)
            if fn(mid) > target:
                lo = mid
            else:
                hi = mid
        return sqrt(lo * hi)

    g_un = solve(uncoded, 1e-5)
    g_co = solve(coded, 1e-5)
    assert abs(dB(g_un) - 9.5878583) < 1e-4, dB(g_un)
    assert abs(dB(g_co) - 9.0002742) < 1e-4, dB(g_co)
    assert abs((dB(g_un) - dB(g_co)) - 0.5875841) < 1e-4
    assert abs(coded(1.0) - 0.0858721033789694) < 1e-12
    assert abs(uncoded(1.0) - 0.07864960352514258) < 1e-12
    # the code LOSES below about 2.3 dB: crossover bracketed here
    assert coded(10 ** 0.20) > uncoded(10 ** 0.20)
    assert coded(10 ** 0.30) < uncoded(10 ** 0.30)

    gdb = np.linspace(0, 12, 700)
    g = 10 ** (gdb / 10)
    fig, ax = plt.subplots()
    ax.semilogy(gdb, [uncoded(v) for v in g], color=c[0], lw=2.5)
    ax.semilogy(gdb, [coded(v) for v in g], color=c[1], lw=2.5)
    S.label_end(ax, 6.4, uncoded(10 ** 0.64), "uncoded BPSK", c[0], mode, dy=15, ha="center")
    S.label_end(ax, 7.2, 6.0e-5, "(7,4) Hamming, hard decision", c[1], mode, dy=0, ha="right")
    ax.axhline(1e-5, color=S.GUIDE[mode], lw=1.1, ls=":")
    ax.annotate("", xy=(dB(g_un), 1e-5), xytext=(dB(g_co), 1e-5),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 6.2, 3.0e-6, "coding gain 0.59 dB at BER 1e-5", mode)
    S.note(ax, 0.25, 3e-7, "below about 2.3 dB the code is WORSE than no code:\n"
                           "it spends energy on parity the decoder cannot use", mode)
    ax.set_xlabel("E_b/N_0 per information bit  (dB)")
    ax.set_ylabel("bit error probability")
    ax.set_title("A small code buys little, and only above its crossover")
    ax.set_ylim(1e-7, 0.2)
    S.strip(ax)
    return fig


@figure("com3-block-correction")
def _(mode):
    """Block failure probability against raw bit error rate for n = 15 codes.

    P(fail) = 1 - sum_(i<=t) C(n,i) p^i (1-p)^(n-i), the exact bounded-distance
    expression, drawn for t = 1, 2, 3. The t = 0 line is the same expression
    with no correction at all, and it is the reason parity alone is a detector.
    """
    c = S.SERIES[mode]
    n = 15
    p = np.logspace(-4, -1, 700)

    def fail(t, x):
        return 1.0 - sum(comb(n, i) * x ** i * (1 - x) ** (n - i) for i in range(t + 1))

    assert abs(fail(0, 1e-2) - 0.13994164535871156) < 1e-12
    assert abs(fail(1, 1e-2) - 0.009629773443364797) < 1e-15
    assert abs(fail(2, 1e-2) - 0.00041580270187568935) < 1e-15
    assert abs(fail(3, 1e-2) - 1.2497585244797271e-05) < 1e-15
    assert abs(fail(1, 1e-3) - 0.0001040940830130399) < 1e-15
    # each extra correctable error buys roughly two more decades at p = 1e-3
    assert 1.5 < log10(fail(1, 1e-3) / fail(2, 1e-3)) < 2.5
    assert 2.0 < log10(fail(2, 1e-3) / fail(3, 1e-3)) < 3.0
    # sanity: correcting more can never be worse
    assert fail(3, 1e-2) < fail(2, 1e-2) < fail(1, 1e-2) < fail(0, 1e-2)

    fig, ax = plt.subplots()
    ax.loglog(p, [fail(0, x) for x in p], color=S.GUIDE[mode], lw=1.8, ls="--")
    for t, col in ((1, c[0]), (2, c[1]), (3, c[2])):
        ax.loglog(p, [fail(t, x) for x in p], color=col, lw=2.4)
        S.label_end(ax, 1e-3, fail(t, 1e-3), f"t = {t}  (d_min = {2 * t + 1})", col, mode,
                    dy=14, ha="center")
    S.label_end(ax, 1e-3, fail(0, 1e-3), "t = 0: detect only", S.GUIDE[mode], mode, dy=14, ha="center")
    ax.plot([1e-2], [fail(1, 1e-2)], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 1.15e-4, 3.0e-1, "p = 1e-2 into a t = 1 code still fails 9.63e-3 of blocks", mode)
    ax.set_xlabel("raw channel bit error probability  p")
    ax.set_ylabel("probability a 15-bit block is not decoded correctly")
    ax.set_title("Minimum distance buys decades: t = floor((d_min - 1)/2)")
    ax.set_ylim(1e-13, 2.0)
    ax.set_xlim(1e-4, 1.5e-1)
    S.strip(ax)
    return fig


@figure("com3-link-reconcile")
def _(mode):
    """Required SNR for a 20 MHz link at each payload rate, against the bound.

    The lower curve is Shannon: S/N = 2^(R/B) - 1. The upper curve is the same
    axis with a stated 9.6 dB implementation gap for a coded square-QAM family,
    and the markers are the (M, code rate) pairs that land on 100 Mbps.
    """
    c = S.SERIES[mode]
    B = 20e6
    R = np.linspace(5e6, 160e6, 900)
    eta = R / B
    need = 10 * np.log10(2 ** eta - 1)
    gap = 9.6

    assert abs(dB(2 ** 5.0 - 1) - 14.913616938342726) < 1e-9
    assert abs(dB(2 ** 4.0 - 1) - 11.760912590556813) < 1e-9
    assert abs(dB(2 ** 6.0 - 1) - 17.99340549453582) < 1e-9
    # the 100 Mbps design point
    rs = B / 1.2
    assert abs(rs - 16666666.666666668) < 1e-6
    assert abs(rs * log2(256.0) * 0.75 - 1e8) < 1e-6
    assert abs(rs * log2(1024.0) * 0.6 - 1e8) < 1e-6
    assert abs(rs * log2(64.0) * (5.0 / 6.0) - 83333333.33333333) < 1e-6
    assert abs(-174.0 + 10 * log10(B) + 5.0 - (-95.98970004336019)) < 1e-9
    assert abs(-95.98970004336019 + 14.913616938342726 - (-81.07608310501746)) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(R / 1e6, need, color=c[0], lw=2.6)
    ax.plot(R / 1e6, need + gap, color=c[1], lw=2.2, ls="--")
    S.label_end(ax, 142, dB(2 ** 7.1 - 1), "Shannon: S/N = 2^(R/B) - 1", c[0], mode, dy=-22, ha="right")
    S.label_end(ax, 120, dB(2 ** 6.0 - 1) + gap, "same curve plus a 9.6 dB\nimplementation gap", c[1], mode, dy=16, ha="center")
    ax.plot([100.0], [dB(2 ** 5.0 - 1)], "o", color=c[0], ms=8, zorder=6)
    ax.plot([100.0], [dB(2 ** 5.0 - 1) + gap], "o", color=c[1], ms=8, zorder=6)
    S.note(ax, 103, 3.2, "100 Mbps in 20 MHz is eta = 5 b/s/Hz:\n"
                         "14.91 dB is the floor, 24.5 dB is the ask", mode)
    S.note(ax, 6, 26.5, "256-QAM at rate 3/4 and 1024-QAM at rate 3/5\nboth deliver exactly 100 Mbps here", mode)
    ax.set_xlabel("payload rate  R  (Mbps) in B = 20 MHz")
    ax.set_ylabel("required signal-to-noise ratio  (dB)")
    ax.set_title("Reconciling a rate, a modulation and an SNR in one picture")
    ax.set_xlim(5, 160)
    ax.set_ylim(0, 32)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "com3-"
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
