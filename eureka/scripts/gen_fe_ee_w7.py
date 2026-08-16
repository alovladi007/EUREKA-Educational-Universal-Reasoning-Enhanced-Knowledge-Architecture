#!/usr/bin/env python3
"""Wave-7 figures for the FE Electrical and Computer course: Communications.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED from the equation the
lesson states, in code the reader can check, and every quantity a caption or a
label claims is re-derived and asserted before the figure is drawn. Nothing is
traced, scanned or adapted from the NCEES Reference Handbook or any textbook -
the pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

The assertions are deliberately TIGHT. A wave-2 figure shipped a label that was
0.076 off its true value because its assertion allowed 0.1; tolerances here are
sized to the number of digits the label actually prints.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w7.py             # all
    python3 scripts/gen_fe_ee_w7.py comm-am     # only names starting "comm-am"
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy.optimize import brentq
from scipy.special import erfc, jv

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}

C_LIGHT = 2.99792458e8      # m/s, defined value
K_B = 1.380649e-23          # J/K, defined value (SI 2019)
T0_REF = 290.0              # K, the standard reference temperature for noise figure


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def q_func(x):
    """Gaussian tail probability Q(x) = 0.5 erfc(x / sqrt(2))."""
    return 0.5 * erfc(x / np.sqrt(2))


def ber_qam(m_order, ebn0_lin):
    """Gray-coded square M-QAM bit error rate, the standard union-bound form."""
    k = np.log2(m_order)
    return (4 / k) * (1 - 1 / np.sqrt(m_order)) * q_func(
        np.sqrt(3 * k * ebn0_lin / (m_order - 1)))


def required_ebn0_db(m_order, target):
    """Eb/N0 in dB at which square M-QAM (or BPSK, M = 2) hits `target` BER."""
    def curve(d):
        g = 10 ** (d / 10)
        p = q_func(np.sqrt(2 * g)) if m_order == 2 else ber_qam(m_order, g)
        return np.log10(max(float(p), 1e-300)) - np.log10(target)
    return brentq(curve, -1.0, 60.0, xtol=1e-12)


def fspl_db(d_m, f_hz):
    """Free-space path loss, 20 log10(4 pi d f / c)."""
    return 20 * np.log10(4 * np.pi * d_m * f_hz / C_LIGHT)


# ---------------------------------------------------------------------------
# Analog modulation - AM and FM
# ---------------------------------------------------------------------------


@figure("comm-am-envelope")
def _(mode):
    """Two AM waveforms drawn from s(t) = Ac[1 + m cos(2 pi fm t)] cos(2 pi fc t).

    Top panel m = 0.6, bottom panel m = 1.4, same carrier and message. The
    envelope Ac|1 + m cos| is drawn over each. At m = 0.6 the envelope minimum
    is Ac(1 - m) = 0.4 Ac and the detector output is a scaled copy of the
    message; at m = 1.4 the bracket goes negative 135.6 degrees either side of
    the message peak, the envelope folds about zero, and the detector reads
    +0.4 Ac at the instant the message is at its MINIMUM - a peak that is not
    in the message at all. The minima, the fold angle and the folded value are
    all asserted analytically before drawing.
    """
    c = S.SERIES[mode]
    Ac, fm, fc = 1.0, 1.0, 18.0
    t = np.linspace(0, 2.0, 6000)

    def env(m):
        return Ac * (1 + m * np.cos(2 * np.pi * fm * t))

    # analytic checks
    assert abs((1 - 0.6) - 0.4) < 1e-12
    theta_fold = np.arccos(-1 / 1.4)                       # where 1 + m cos = 0
    assert abs(np.cos(theta_fold) * 1.4 + 1) < 1e-12
    assert abs(np.degrees(theta_fold) - 135.5847) < 1e-4, np.degrees(theta_fold)
    assert abs(env(0.6).min() - 0.4) < 1e-6
    assert abs(np.abs(env(1.4)).max() - 2.4) < 1e-6
    assert abs(abs(1 + 1.4 * np.cos(np.pi)) - 0.4) < 1e-12      # folded value at the trough

    fig, axes = plt.subplots(2, 1, figsize=(7.2, 5.8), sharex=True)
    for ax, m, tag in ((axes[0], 0.6, "m = 0.6"), (axes[1], 1.4, "m = 1.4")):
        s = env(m) * np.cos(2 * np.pi * fc * t)
        ax.plot(t, s, color=c[0], lw=0.9, alpha=0.75)
        ax.plot(t, np.abs(env(m)), color=c[1], lw=2.2)
        ax.plot(t, -np.abs(env(m)), color=c[1], lw=2.2)
        ax.axhline(0, color=S.GRID[mode], lw=0.8)
        ax.set_ylim(-2.8, 4.9)
        ax.set_yticks([-2, -1, 0, 1, 2])
        ax.set_ylabel("amplitude / Ac")
        S.label_end(ax, 0.02, 3.5, tag, c[1], mode, dx=0, ha="left")
        S.strip(ax)
    axes[0].plot([1.0], [0.4], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(axes[0], 1.98, 3.2, "envelope minimum is Ac(1 - m) = 0.4 Ac,\nand the detector output is the message",
           mode, ha="right")
    axes[0].set_title("Under 100% modulation the envelope is the message")
    axes[1].plot([0.5, 1.5], [0.4, 0.4], "o", color=S.INK[mode], ms=6, zorder=6)
    for tt in (0.5 - (np.pi - theta_fold) / (2 * np.pi), 0.5 + (np.pi - theta_fold) / (2 * np.pi)):
        axes[1].plot([tt], [0.0], "o", color=S.GUIDE[mode], ms=6, zorder=6)
    S.note(axes[1], 1.98, 3.2, "the bracket goes negative 135.6 deg either side of the message peak;\nat the message TROUGH the detector reads +0.4 Ac - an invented peak",
           mode, ha="right", size=8.5)
    axes[1].set_title("Overmodulation: the envelope stops being the message")
    axes[1].set_xlabel("time  t / T_message")
    axes[1].set_xlim(0, 2.0)
    fig.subplots_adjust(hspace=0.34)
    return fig


@figure("comm-fm-bessel")
def _(mode):
    """FM line spectrum from the Bessel coefficients, with the Carson band.

    Sideband n of a tone-modulated FM signal has amplitude |J_n(beta)| and sits
    n f_m from the carrier. This is broadcast FM: f_m = 15 kHz, deviation
    75 kHz, so beta = 5. Carson's rule puts the band edge at
    (beta + 1) f_m = 90 kHz either side, i.e. the n = 6 pair. The power inside
    that band is J_0^2 + 2 sum_{n=1..6} J_n^2, computed below as 99.356% - the
    numerical content of the "Carson keeps about 98%" claim.
    """
    c = S.SERIES[mode]
    beta, f_m = 5.0, 15.0
    n = np.arange(-9, 10)
    amp = np.abs(jv(np.abs(n), beta))
    inside = np.abs(n) <= int(beta + 1)

    frac = jv(0, beta) ** 2 + 2 * sum(jv(k, beta) ** 2 for k in range(1, 7))
    assert abs(frac - 0.993559) < 2e-5, frac
    assert abs(2 * (75.0 + f_m) - 180.0) < 1e-12
    assert abs(2 * (beta + 1) * f_m - 180.0) < 1e-12          # same number, two routes
    total = jv(0, beta) ** 2 + 2 * sum(jv(k, beta) ** 2 for k in range(1, 40))
    assert abs(total - 1.0) < 1e-9, total
    assert abs(abs(jv(4, beta)) - 0.391232) < 1e-5, jv(4, beta)

    fig, ax = plt.subplots()
    x = n * f_m
    ax.vlines(x[inside], 0, amp[inside], color=c[0], lw=3.0)
    ax.vlines(x[~inside], 0, amp[~inside], color=S.GUIDE[mode], lw=3.0)
    ax.plot(x[inside], amp[inside], "o", color=c[0], ms=5)
    ax.plot(x[~inside], amp[~inside], "o", color=S.GUIDE[mode], ms=5)
    for edge in (-90.0, 90.0):
        ax.axvline(edge, color=c[1], lw=1.6, ls="--")
    S.label_end(ax, 90, 0.435, "Carson edge\n(beta + 1) f_m = 90 kHz", c[1], mode, dx=7)
    S.label_end(ax, -90, 0.435, "Carson edge\n-90 kHz", c[1], mode, dx=-7, ha="right")
    S.note(ax, -148, 0.215, "outside Carson:\n0.64% of power", mode)
    S.note(ax, 100, 0.235, "the carrier line |J0(5)| = 0.178\nis not even the tallest one", mode)
    S.note(ax, 0, 0.472, "inside Carson: 99.36% of the power", mode, ha="center")
    ax.set_xlabel("offset from carrier  (kHz),  f_m = 15 kHz")
    ax.set_ylabel("sideband amplitude  |J_n(5)|")
    ax.set_title("Where an FM signal's power actually sits at beta = 5")
    ax.set_xlim(-150, 150)
    ax.set_ylim(0, 0.50)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Digital modulation
# ---------------------------------------------------------------------------


@figure("comm-ber-curves")
def _(mode):
    """Bit error rate against Eb/N0 for QPSK, 16-QAM and 64-QAM.

    BPSK and QPSK share the curve Q(sqrt(2 Eb/N0)); the QAM curves are the
    Gray-coded square-constellation expression the lesson states. The markers
    are the Eb/N0 values at which each curve crosses BER = 1e-5, found by root
    finding and asserted to 0.005 dB against the numbers printed in the lesson
    table.
    """
    c = S.SERIES[mode]
    d = np.linspace(0, 24, 900)
    g = 10 ** (d / 10)

    # The marker abscissa is the ROOT, not a remembered number: labels print
    # the computed value so a rounding can never drift from the curve.
    curves = [
        ("BPSK / QPSK", q_func(np.sqrt(2 * g)), 2, required_ebn0_db(2, 1e-5)),
        ("16-QAM", ber_qam(16, g), 16, required_ebn0_db(16, 1e-5)),
        ("64-QAM", ber_qam(64, g), 64, required_ebn0_db(64, 1e-5)),
    ]
    for _lab, _y, m_order, claimed in curves:
        got = required_ebn0_db(m_order, 1e-5)
        assert abs(got - claimed) < 1e-9, (m_order, got, claimed)
    assert abs(curves[0][3] - 9.5880) < 5e-4, curves[0][3]
    assert abs(curves[1][3] - 13.4345) < 5e-4, curves[1][3]
    assert abs(curves[2][3] - 17.7869) < 5e-4, curves[2][3]
    assert abs(required_ebn0_db(16, 1e-5) - required_ebn0_db(4, 1e-5) - 3.847) < 5e-3
    assert abs(required_ebn0_db(4, 1e-5) - required_ebn0_db(2, 1e-5)) < 1e-9  # identical
    assert abs(required_ebn0_db(64, 1e-5) - required_ebn0_db(4, 1e-5) - 8.199) < 5e-3

    fig, ax = plt.subplots()
    for i, (lab, y, _m, xat) in enumerate(curves):
        ax.semilogy(d, np.maximum(y, 1e-9), color=c[i], lw=2.1)
        ax.plot([xat], [1e-5], "o", color=c[i], ms=7, zorder=6)
        ax.plot([xat, xat], [1e-9, 1e-5], color=S.GRID[mode], lw=0.9, ls=":")
        S.note(ax, xat + 0.22, 1.55e-9, f"{xat:.2f} dB", mode, size=8.5)
    S.label_end(ax, 11.0, 2.0e-8, "BPSK / QPSK", c[0], mode, ha="right", dx=-4)
    S.label_end(ax, 15.6, 2.0e-8, "16-QAM", c[1], mode, ha="right", dx=-2)
    S.label_end(ax, 20.4, 3.0e-8, "64-QAM", c[2], mode, dx=2)
    ax.axhline(1e-5, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 0.25, 1.35e-5, "BER = 10^-5 reference line", mode)
    ax.set_xlabel("Eb/N0  (dB)")
    ax.set_ylabel("bit error rate")
    ax.set_title("Four more bits per symbol costs 8.2 dB of energy per bit")
    ax.set_xlim(0, 24)
    ax.set_ylim(1e-9, 0.5)
    S.strip(ax)
    return fig


@figure("comm-pcm-sqnr")
def _(mode):
    """Measured quantizer SQNR against the 6.02n + 1.76 dB rule.

    The points are MEASURED: a full-scale sine is quantized onto 2^n uniform
    levels and the ratio of signal power to error power is evaluated for each
    word length. The line is the textbook rule. From eight bits up they agree
    to within 0.15 dB, which is the whole content of the "6 dB per bit"
    shortcut; below that the measurement sits a few tenths of a dB LOW, because
    the rule assumes the error is spread evenly over a step and independent of
    the signal, and at four bits it is neither. The second series repeats the
    measurement for a sine backed off 6 dB from full scale: the SQNR follows
    the signal level, not the converter's rating.
    """
    c = S.SERIES[mode]
    bits = np.arange(4, 17)

    def measured(n_bits, backoff_db=0.0):
        a = 10 ** (-backoff_db / 20)
        t = np.arange(200000) / 200000.0
        x = a * np.sin(2 * np.pi * 97 * t)          # 97 whole cycles over the record
        step = 2.0 / 2 ** n_bits                    # mid-rise quantizer, 2^n levels
        xq = np.clip((np.floor(x / step) + 0.5) * step, -1 + step / 2, 1 - step / 2)
        return 10 * np.log10(np.mean(x ** 2) / np.mean((xq - x) ** 2))

    full = np.array([measured(n) for n in bits])
    back = np.array([measured(n, 6.0) for n in bits])
    rule = 6.02 * bits + 1.76

    hi = bits >= 8
    assert np.max(np.abs(full[hi] - rule[hi])) < 0.15, np.max(np.abs(full[hi] - rule[hi]))
    assert np.max(np.abs(back[hi] - (rule[hi] - 6.0))) < 0.21, np.max(np.abs(back[hi] - rule[hi] + 6))
    assert -0.60 < full[0] - rule[0] < -0.45, full[0] - rule[0]   # the 4-bit shortfall
    assert abs(rule[bits == 8][0] - 49.92) < 1e-12
    assert abs(rule[bits == 16][0] - 98.08) < 1e-12
    assert abs(rule[bits == 12][0] - 74.00) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(bits, rule, color=S.GUIDE[mode], lw=1.6, ls="--")
    ax.plot(bits, full, "o", color=c[0], ms=6)
    ax.plot(bits, back, "o", color=c[1], ms=6)
    S.label_end(ax, 16, full[-1], "measured,\nfull-scale sine", c[0], mode, dx=8, dy=6)
    S.label_end(ax, 16, back[-1], "measured,\n6 dB backed off", c[1], mode, dx=8, dy=-10)
    S.note(ax, 3.2, 92, "dashed line: SQNR = 6.02n + 1.76 dB", mode)
    for n_show, y in ((8, 49.92), (16, 98.08)):
        ax.plot([n_show], [y], "o", color=S.INK[mode], ms=4, zorder=6)
    S.note(ax, 11.4, 30.5, "telephone PCM, n = 8: 49.9 dB\nCD audio, n = 16: 98.1 dB", mode)
    S.note(ax, 3.4, 9.2, f"at n = 4 the measurement is {rule[0] - full[0]:.2f} dB low:\nthe error is not yet independent of the signal", mode)
    ax.set_xlabel("word length  n  (bits per sample)")
    ax.set_ylabel("signal-to-quantization-noise ratio  (dB)")
    ax.set_title("Every extra bit buys 6.02 dB - and nothing else does")
    ax.set_xlim(2.6, 19.4)
    ax.set_ylim(8, 108)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Noise and SNR
# ---------------------------------------------------------------------------


@figure("comm-friis-cascade")
def _(mode):
    """System noise figure against first-amplifier gain, for two orderings.

    Both curves are the Friis cascade formula evaluated directly. The chain is
    an LNA of noise figure 1 dB followed by a 6 dB stage; the second curve puts
    3 dB of feed cable AHEAD of that LNA. The cable costs its own loss and
    nothing more or less - the gap is exactly 3.000 dB at every gain, which the
    assertion checks, and the reason a receiver's first component is chosen
    before anything else.
    """
    c = S.SERIES[mode]
    g1_db = np.linspace(0, 30, 400)
    g1 = 10 ** (g1_db / 10)
    f_lna, f_next, loss = 10 ** 0.1, 10 ** 0.6, 10 ** 0.3

    direct = f_lna + (f_next - 1) / g1
    cabled = loss + (f_lna - 1) * loss + (f_next - 1) * loss / g1

    nf_d, nf_c = 10 * np.log10(direct), 10 * np.log10(cabled)
    assert np.max(np.abs(nf_c - nf_d - 3.0)) < 1e-9, np.max(np.abs(nf_c - nf_d - 3.0))
    at20 = 10 * np.log10(f_lna + (f_next - 1) / 100)
    assert abs(at20 - 1.1016) < 5e-4, at20
    assert abs(at20 + 3.0 - 4.1016) < 5e-4

    fig, ax = plt.subplots()
    ax.plot(g1_db, nf_d, color=c[0], lw=2.2)
    ax.plot(g1_db, nf_c, color=c[1], lw=2.2)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(ax, 30, nf_d[-1], "LNA first", c[0], mode, dy=-2)
    S.label_end(ax, 30, nf_c[-1], "3 dB of cable\nbefore the LNA", c[1], mode, dy=2)
    S.note(ax, 0.4, 1.12, "floor: the LNA's own 1.00 dB", mode)
    for y, txt in ((at20, "1.10 dB"), (at20 + 3.0, "4.10 dB")):
        ax.plot([20], [y], "o", color=S.INK[mode], ms=6, zorder=6)
        S.note(ax, 20.7, y + 0.14, txt, mode)
    ax.plot([20, 20], [at20, at20 + 3.0], color=S.GRID[mode], lw=0.9, ls=":")
    ax.set_xlabel("gain of the first amplifier  G1  (dB)")
    ax.set_ylabel("system noise figure  (dB)")
    ax.set_title("Loss ahead of the LNA is added to the system, one dB for one dB")
    ax.set_xlim(0, 34)
    ax.set_ylim(0.6, 7.2)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Channel capacity
# ---------------------------------------------------------------------------


@figure("comm-shannon-bound")
def _(mode):
    """The capacity bound in the (Eb/N0, spectral efficiency) plane.

    The curve is the Shannon frontier written the way link designers use it:
    for a spectral efficiency eta = C/B, capacity demands
    Eb/N0 = (2^eta - 1)/eta. As eta goes to zero this tends to ln 2 = -1.59 dB,
    the vertical asymptote drawn here. The four markers are the Eb/N0 that
    uncoded BPSK, QPSK, 16-QAM and 64-QAM actually need for BER = 1e-5, so the
    horizontal distance from curve to marker IS the coding gain still on the
    table. Every plotted number is computed, not copied.
    """
    c = S.SERIES[mode]
    eta = np.linspace(0.02, 10.0, 900)
    ebn0_db = 10 * np.log10((2 ** eta - 1) / eta)

    assert abs(10 * np.log10(np.log(2)) + 1.591745) < 1e-5
    assert abs((2 ** 1e-9 - 1) / 1e-9 - np.log(2)) < 1e-6
    pts = [(required_ebn0_db(2, 1e-5), 1.0, "BPSK"),
           (required_ebn0_db(4, 1e-5), 2.0, "QPSK"),
           (required_ebn0_db(16, 1e-5), 4.0, "16-QAM"),
           (required_ebn0_db(64, 1e-5), 6.0, "64-QAM")]
    for x, e, lab in pts:
        need = 10 * np.log10((2 ** e - 1) / e)
        assert x - need > 7.0, (lab, x, need)
    assert abs(pts[0][0] - 9.588) < 5e-3 and abs(pts[3][0] - 17.787) < 5e-3

    fig, ax = plt.subplots()
    ax.plot(ebn0_db, eta, color=c[0], lw=2.4)
    ax.axvline(-1.5917, color=S.GUIDE[mode], lw=1.3, ls="--")
    for x, e, lab in pts:
        ax.plot([x], [e], "o", color=c[1], ms=7, zorder=6)
        need = 10 * np.log10((2 ** e - 1) / e)
        ax.plot([need, x], [e, e], color=S.GRID[mode], lw=1.0, ls=":")
        S.note(ax, x + 0.5, e - 0.12, f"{lab}  ({x - need:.1f} dB from the bound)", mode)
    S.label_end(ax, 19.2, 8.9, "capacity bound\nEb/N0 = (2^eta - 1)/eta", c[0], mode, dx=6)
    S.note(ax, -1.2, 8.8, "Shannon limit -1.59 dB:\nno rate is reliable to the left", mode)
    S.note(ax, 29.5, 0.30, "markers: uncoded schemes at BER = 10^-5", mode, ha="right")
    ax.set_xlabel("Eb/N0  (dB)")
    ax.set_ylabel("spectral efficiency  eta = C/B  (bits/s/Hz)")
    ax.set_title("The bound, and how far uncoded modulation sits from it")
    ax.set_xlim(-4, 30)
    ax.set_ylim(0, 9.6)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Multiplexing
# ---------------------------------------------------------------------------


@figure("comm-mux-efficiency")
def _(mode):
    """Payload efficiency against channel count for TDM framing and FDM guards.

    TDM: one framing bit per 8N payload bits, so efficiency is 8N/(8N + 1) and
    it IMPROVES with channel count. FDM: N - 1 guard bands of 1 kHz between N
    channels of 4 kHz, so efficiency is 4N/(5N - 1) and it DEGRADES towards
    80%. Both expressions are the ones the lesson derives; the marked points
    are the worked examples.
    """
    c = S.SERIES[mode]
    n = np.arange(2, 65)
    tdm = 100 * 8 * n / (8 * n + 1)
    fdm = 100 * 4 * n / (5 * n - 1)

    assert abs(tdm[n == 12][0] - 98.9691) < 5e-4, tdm[n == 12][0]
    assert abs(tdm[n == 24][0] - 99.4819) < 5e-4, tdm[n == 24][0]
    assert abs(fdm[n == 12][0] - 81.3559) < 5e-4, fdm[n == 12][0]
    assert abs(fdm[n == 24][0] - 80.6723) < 5e-4, fdm[n == 24][0]
    assert abs((24 * 8 + 1) * 8000 - 1_544_000) < 1e-9          # T1
    assert abs(32 * 8 * 8000 - 2_048_000) < 1e-9                # E1

    fig, ax = plt.subplots()
    ax.plot(n, tdm, color=c[0], lw=2.2)
    ax.plot(n, fdm, color=c[1], lw=2.2)
    ax.axhline(80.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(ax, 64, tdm[-1], "TDM: 8N/(8N + 1)\none framing bit", c[0], mode, dy=-6)
    S.label_end(ax, 64, 84.0, "FDM: 4N/(5N - 1)\n1 kHz guard per gap", c[1], mode, dy=0)
    S.note(ax, 30, 73.4, "dashed line: the 80% FDM floor - the guard band never goes away", mode, ha="center")
    ax.plot([24], [tdm[n == 24][0]], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(ax, 25.4, 97.4, "T1: 24 channels, 99.48%", mode)
    ax.plot([12], [fdm[n == 12][0]], "o", color=S.INK[mode], ms=6, zorder=6)
    ax.plot([12, 12], [77.6, fdm[n == 12][0] - 0.5], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 13.0, 76.4, "12-channel group: 81.36%", mode)
    ax.set_xlabel("channels multiplexed  N")
    ax.set_ylabel("payload efficiency  (%)")
    ax.set_title("Framing overhead shrinks with scale; guard bands do not")
    ax.set_xlim(2, 78)
    ax.set_ylim(72, 102)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Link budgets
# ---------------------------------------------------------------------------


@figure("comm-link-budget")
def _(mode):
    """The 2.4 GHz link budget as a running total in dBm.

    Each step is one term of the budget; the trace is the cumulative sum, which
    is what "adding decibels" means physically. The path-loss step is computed
    from 20 log10(4 pi d f / c) at d = 100 m, f = 2.4 GHz, not looked up. The
    receiver's thermal noise floor and a -75 dBm sensitivity are drawn as
    horizontal lines so the two margins the exam asks for are distances on the
    same axis.
    """
    c = S.SERIES[mode]
    path = fspl_db(100.0, 2.4e9)
    steps = [("TX\n+20 dBm", 20.0), ("TX cable\n-2 dB", -2.0), ("TX antenna\n+10 dBi", 10.0),
             ("path loss\n-80.05 dB", -path), ("RX antenna\n+10 dBi", 10.0),
             ("RX cable\n-2 dB", -2.0)]
    level = np.cumsum([s[1] for s in steps])
    floor = -174 + 10 * np.log10(20e6) + 6.0

    assert abs(path - 80.0520) < 5e-4, path
    assert abs(level[-1] + 44.0520) < 5e-4, level[-1]
    assert abs(floor + 94.9897) < 5e-4, floor
    assert abs((level[-1] - floor) - 50.9377) < 1e-3
    assert abs((level[-1] - (-75.0)) - 30.9480) < 1e-3

    x = np.arange(len(steps) + 1)
    y = np.concatenate([level, [level[-1]]])

    fig, ax = plt.subplots(figsize=(7.6, 4.5))
    ax.step(x, y, where="post", color=c[0], lw=2.4)
    ax.plot(x[:-1] + 0.5, level, "o", color=c[0], ms=6, zorder=6)
    ax.plot([0, 6], [floor, floor], color=c[1], lw=1.6, ls="--")
    ax.plot([0, 6], [-75.0, -75.0], color=S.GUIDE[mode], lw=1.4, ls=":")
    S.label_end(ax, 6.05, floor, "noise floor -94.99 dBm\n(-174 + 73.0 + NF 6)", c[1], mode, dy=-6)
    S.label_end(ax, 6.05, -75.0, "sensitivity -75 dBm", S.GUIDE[mode], mode, dy=8)
    S.note(ax, 5.42, -40.5, "received -44.05 dBm", mode, ha="right")
    ax.annotate("", xy=(5.62, -44.05), xytext=(5.62, -75.0),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.1))
    S.note(ax, 5.5, -62.0, "30.9 dB\nfade margin", mode, ha="right")
    ax.set_xticks(x[:-1] + 0.5)
    ax.set_xticklabels([s[0] for s in steps], fontsize=8.5)
    ax.set_ylabel("running level  (dBm)")
    ax.set_title("A link budget is one running sum, and two distances at the end")
    ax.set_xlim(0, 7.6)
    ax.set_ylim(-100, 34)
    S.strip(ax)
    return fig


@figure("comm-fspl-distance")
def _(mode):
    """Free-space path loss against distance at three service frequencies.

    Every point is 20 log10(4 pi d f / c). On log-distance axes the curves are
    straight and parallel: 6.02 dB per doubling of distance, and the same
    6.02 dB per doubling of frequency, which is why the 5.8 GHz trace sits
    7.66 dB above the 2.4 GHz trace (the two bands differ by a factor 2.417).
    Markers are at the 100 m worked example.
    """
    c = S.SERIES[mode]
    d = np.logspace(0, 4, 600)
    bands = [(900e6, "900 MHz"), (2.4e9, "2.4 GHz"), (5.8e9, "5.8 GHz")]

    assert abs(fspl_db(100, 2.4e9) - 80.0520) < 5e-4
    assert abs(fspl_db(100, 900e6) - 71.5326) < 5e-4
    assert abs(fspl_db(100, 5.8e9) - 87.7163) < 5e-4
    assert abs(fspl_db(200, 2.4e9) - fspl_db(100, 2.4e9) - 6.0206) < 1e-4
    assert abs(fspl_db(100, 4.8e9) - fspl_db(100, 2.4e9) - 6.0206) < 1e-4
    assert abs(20 * np.log10(4 * np.pi * 1e3 * 1e9 / C_LIGHT) - 92.4478) < 5e-4

    fig, ax = plt.subplots()
    for i, (f_hz, lab) in enumerate(bands):
        ax.semilogx(d, fspl_db(d, f_hz), color=c[i], lw=2.1)
        ax.plot([100], [fspl_db(100, f_hz)], "o", color=c[i], ms=6, zorder=6)
        S.label_end(ax, 1e4, fspl_db(1e4, f_hz), lab, c[i], mode, dy=0)
    S.note(ax, 1.15, 116, "at 100 m the loss is 71.5 / 80.1 / 87.7 dB\nfor 900 MHz / 2.4 GHz / 5.8 GHz", mode)
    ax.plot([100, 100], [66, 92], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 700, 47, "slope: 6.02 dB per doubling of distance\n(20 dB per decade)", mode)
    ax.set_xlabel("path length  d  (m)")
    ax.set_ylabel("free-space path loss  (dB)")
    ax.set_title("Loss climbs 20 dB per decade of range, at every frequency")
    ax.set_xlim(1, 1e4)
    ax.set_ylim(30, 130)
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
