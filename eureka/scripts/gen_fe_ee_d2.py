#!/usr/bin/env python3
"""Depth-wave figures for the two modulation chapters of the FE Electrical
and Computer course: `fee_am_fm` and `fee_digital_mod`.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve, line and marker here is COMPUTED, in
this file, from an equation the lesson that references it writes out. Nothing
is traced, scanned, redrawn or adapted from the NCEES Reference Handbook or any
textbook - the pipeline consumes formulas, which are not protected expression,
and never anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/com2-<name>.svg
    apps/web/public/courses/fe-ee/figures/com2-<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION, stating what is drawn and the numbers a reader should be able to read
off it.

EVERY number the prose quotes from a figure is asserted here, and wherever it
is cheap the assertion is made against a SECOND, INDEPENDENT route to the same
quantity - a numerical integral instead of a Bessel identity, an FFT of a
synthesized waveform instead of a spectral table, Monte-Carlo bit counting
instead of the Q-function. A check that reuses the derivation it is checking
proves nothing; only a disagreement between two routes can catch a wrong
premise. Tolerances are set at the last digit the lesson quotes.

Usage:
    python3 scripts/gen_fe_ee_d2.py            # all
    python3 scripts/gen_fe_ee_d2.py com2-fm    # only names with that prefix
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy.integrate import quad
from scipy.special import erfc, jv

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith("com2-"):
        raise ValueError(f"figure {name!r} is outside this file's namespace")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def Q(x):
    """Gaussian tail probability. Written through erfc so it stays accurate
    out to the 1e-9 tails the BER curves reach."""
    return 0.5 * erfc(np.asarray(x, dtype=float) / np.sqrt(2.0))


def db(x):
    return 10.0 * np.log10(x)


def jn_integral(n: int, b: float) -> float:
    """J_n(b) by numerical quadrature of its integral representation.

    This is the INDEPENDENT route used to check every Bessel amplitude the FM
    sections quote: scipy's jv() uses series and asymptotic expansions, the
    quadrature below uses none of them, so agreement between the two is
    evidence rather than a tautology.
    """
    return quad(lambda t: np.cos(n * t - b * np.sin(t)), 0.0, np.pi, limit=400)[0] / np.pi


# ===========================================================================
# fee_am_fm
# ===========================================================================


@figure("com2-am-spectrum")
def _(mode):
    """AM line spectrum from the product-to-sum expansion, checked by FFT.

    s(t) = Ac[1 + m cos(2 pi fm t)] cos(2 pi fc t)
         = Ac cos(2 pi fc t)
           + (m Ac/2) cos(2 pi (fc - fm) t) + (m Ac/2) cos(2 pi (fc + fm) t)

    with Ac = 10 V, m = 0.6, fc = 100 kHz, fm = 5 kHz. The three line heights
    are 3.00, 10.00, 3.00 V. The check is an FFT of the synthesized waveform,
    which never sees the expansion above.
    """
    c = S.SERIES[mode]
    Ac, m, fc, fm, R = 10.0, 0.6, 100e3, 5e3, 50.0
    side = m * Ac / 2.0
    assert abs(side - 3.00) < 1e-12, side

    # independent route: synthesize and transform. One full period of the
    # 5 kHz envelope at a sample rate that puts every line on an FFT bin.
    fs, N = 1e6, 200
    t = np.arange(N) / fs
    x = Ac * (1 + m * np.cos(2 * np.pi * fm * t)) * np.cos(2 * np.pi * fc * t)
    X = np.fft.rfft(x) * 2.0 / N
    binw = fs / N
    got = {int(round(f / binw)): abs(X[int(round(f / binw))])
           for f in (fc - fm, fc, fc + fm)}
    peaks = sorted(got.items())
    assert abs(peaks[0][1] - 3.00) < 1e-9, peaks
    assert abs(peaks[1][1] - 10.00) < 1e-9, peaks
    assert abs(peaks[2][1] - 3.00) < 1e-9, peaks
    # nothing else in the transform is above a part in 10^9 of the carrier
    mask = np.ones_like(X, dtype=bool)
    for k in got:
        mask[k] = False
    assert abs(X[mask]).max() < 1e-9 * Ac, abs(X[mask]).max()

    Pc = Ac ** 2 / (2 * R)
    Psb = side ** 2 / (2 * R)
    Ptot = Pc + 2 * Psb
    eff = 2 * Psb / Ptot
    assert abs(Pc - 1.00) < 1e-12, Pc
    assert abs(Psb - 0.09) < 1e-12, Psb
    assert abs(Ptot - 1.18) < 1e-12, Ptot
    assert abs(100 * eff - 15.2542) < 5e-4, 100 * eff
    # and the closed form m^2/(2+m^2) must land on the same efficiency
    assert abs(eff - m ** 2 / (2 + m ** 2)) < 1e-12

    fig, ax = plt.subplots()
    freqs = np.array([fc - fm, fc, fc + fm]) / 1e3
    amps = np.array([side, Ac, side])
    ax.vlines(freqs, 0, amps, color=c[0], lw=3.0)
    ax.plot(freqs, amps, "o", color=c[0], ms=7)
    S.label_end(ax, 100.0, Ac, "carrier 10.00 V\n1.000 W of 1.180 W", c[0], mode,
                dx=0, dy=9, ha="center")
    S.label_end(ax, 95.0, side, "LSB 3.00 V\n0.090 W", c[1], mode, dx=0, dy=16, ha="center")
    S.label_end(ax, 105.0, side, "USB 3.00 V\n0.090 W", c[1], mode, dx=0, dy=16, ha="center")
    ax.annotate("", xy=(105.0, 1.4), xytext=(95.0, 1.4),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 100.0, 1.7, "occupied bandwidth 2 fm = 10 kHz", mode, ha="center")
    S.note(ax, 92.0, 8.4, "efficiency = 0.180 / 1.180 = 15.25%\n(carrier carries no message)", mode)
    ax.set_xlabel("frequency  (kHz)")
    ax.set_ylabel("line amplitude  (V)")
    ax.set_title("AM at m = 0.6: three lines, and 84.75% of the power in the useless one")
    ax.set_xlim(92, 108)
    ax.set_ylim(0, 12.4)
    S.strip(ax)
    return fig


@figure("com2-am-power-split")
def _(mode):
    """Power shares and efficiency against modulation index.

    Carrier share 1/(1 + m^2/2), sideband share (m^2/2)/(1 + m^2/2); the
    sideband share IS the efficiency m^2/(2 + m^2). Peaks at 33.33% at m = 1.
    """
    c = S.SERIES[mode]
    m = np.linspace(0, 1, 601)
    tot = 1 + m ** 2 / 2
    carrier = 1 / tot
    side = (m ** 2 / 2) / tot
    assert abs(side[-1] - 1 / 3) < 1e-12, side[-1]
    assert abs(carrier[-1] - 2 / 3) < 1e-12
    for mm, ee in ((0.25, 3.0303), (0.5, 11.1111), (0.6, 15.2542), (0.8, 24.2424)):
        assert abs(100 * mm ** 2 / (2 + mm ** 2) - ee) < 5e-4, (mm, ee)
    # independent route: average the squared waveform over a message period
    # instead of using the power formula at all.
    for mm in (0.25, 0.5, 0.6, 0.8, 1.0):
        t = np.linspace(0, 1, 2_000_001)[:-1]
        env = 1 + mm * np.cos(2 * np.pi * t)
        # mean of env^2 cos^2(carrier) -> mean(env^2)/2 ; carrier-only share is 1/2
        tot_num = np.mean(env ** 2) / 2
        eff_num = (tot_num - 0.5) / tot_num
        assert abs(eff_num - mm ** 2 / (2 + mm ** 2)) < 1e-9, (mm, eff_num)

    fig, ax = plt.subplots()
    ax.plot(m, 100 * carrier, color=c[0], lw=2.3)
    ax.plot(m, 100 * side, color=c[1], lw=2.3)
    S.label_end(ax, 0.62, 100 * (1 / (1 + 0.62 ** 2 / 2)), "carrier share", c[0], mode,
                dx=0, dy=11, ha="center")
    S.label_end(ax, 0.25, 100 * ((0.25 ** 2 / 2) / (1 + 0.25 ** 2 / 2)),
                "both sidebands = efficiency", c[1], mode, dx=2, dy=13)
    ax.axhline(100 / 3, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.03, 34.6, "ceiling 33.33% at m = 1 - and m > 1 is a fault, not a gain", mode)
    for mm in (0.5, 0.8, 1.0):
        e = 100 * mm ** 2 / (2 + mm ** 2)
        ax.plot([mm], [e], "o", color=c[1], ms=7)
        S.note(ax, mm - 0.015, e - 4.2, f"{e:.2f}%", mode, ha="right")
    ax.set_xlabel("modulation index  m")
    ax.set_ylabel("share of transmitted power  (%)")
    ax.set_title("Where the transmitter's power actually goes")
    ax.set_xlim(0, 1.02)
    ax.set_ylim(0, 104)
    S.strip(ax)
    return fig


@figure("com2-ssb-ledger")
def _(mode):
    """Transmitted power for the three AM variants at m = 1, normalized to the
    carrier. Full AM needs 1.5 units, DSB-SC 0.5, SSB 0.25 - savings of
    10 log10(3) = 4.77 dB and 10 log10(6) = 7.78 dB.
    """
    c = S.SERIES[mode]
    carrier = np.array([1.0, 0.0, 0.0])
    lsb = np.array([0.25, 0.25, 0.0])
    usb = np.array([0.25, 0.25, 0.25])
    tot = carrier + lsb + usb
    assert np.allclose(tot, [1.5, 0.5, 0.25])
    save = db(tot[0] / tot[1:])
    assert abs(save[0] - 4.7712) < 5e-5, save
    assert abs(save[1] - 7.7815) < 5e-5, save
    # independent route: integrate the actual DSB-SC and SSB waveform powers.
    t = np.linspace(0, 1, 2_000_001)[:-1]
    fc = 40.0
    dsb = np.cos(2 * np.pi * t) * np.cos(2 * np.pi * fc * t)
    ssb = 0.5 * np.cos(2 * np.pi * (fc + 1) * t)
    am = (1 + np.cos(2 * np.pi * t)) * np.cos(2 * np.pi * fc * t)
    p_am, p_dsb, p_ssb = np.mean(am ** 2), np.mean(dsb ** 2), np.mean(ssb ** 2)
    assert abs(db(p_am / p_dsb) - 4.7712) < 1e-3, db(p_am / p_dsb)
    assert abs(db(p_am / p_ssb) - 7.7815) < 1e-3, db(p_am / p_ssb)

    labels = ["full AM\n(m = 1)", "DSB-SC", "SSB"]
    x = np.arange(3)
    fig, ax = plt.subplots()
    ax.bar(x, carrier, 0.52, color=c[0], label="carrier")
    ax.bar(x, lsb, 0.52, bottom=carrier, color=c[1])
    ax.bar(x, usb, 0.52, bottom=carrier + lsb, color=c[2])
    for k in range(3):
        ax.annotate(f"{tot[k]:.2f}", xy=(x[k], tot[k] + 0.035), ha="center",
                    color=S.INK[mode], fontsize=11, fontweight="semibold")
    S.note(ax, 0.0, 0.44, "carrier 1.00", mode, ha="center")
    S.note(ax, 0.0, 1.13, "sidebands 0.25 each", mode, ha="center")
    S.note(ax, 1.42, 0.86, "drop the carrier: -4.77 dB\nsame two sidebands, same 10 kHz", mode)
    S.note(ax, 1.42, 0.62, "drop one sideband too: -7.78 dB\nand the channel halves to 5 kHz", mode)
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("transmitted power  (carrier = 1)")
    ax.set_title("The AM power ledger at m = 1")
    ax.set_ylim(0, 1.72)
    ax.grid(axis="x", visible=False)
    S.strip(ax)
    return fig


@figure("com2-fm-instfreq")
def _(mode):
    """Instantaneous frequency IS the derivative of phase - shown by taking
    that derivative numerically.

    FM by a 4 kHz tone with kf Am = 15 kHz deviation gives beta = 3.75. PM with
    the same peak phase deviation of 3.75 rad gives the same 15 kHz deviation,
    shifted a quarter cycle, because it follows the derivative of the message.
    """
    c = S.SERIES[mode]
    fm, dev = 4e3, 15e3
    beta = dev / fm
    assert abs(beta - 3.75) < 1e-12, beta
    fs = 4e7
    t = np.arange(0, 1.0 / fm, 1 / fs)
    # FM: phase is the integral of the message tone
    ph_fm = beta * np.sin(2 * np.pi * fm * t)
    # PM: phase IS the message tone, same peak deviation in radians
    ph_pm = beta * np.cos(2 * np.pi * fm * t)
    # numerical derivative -> instantaneous frequency deviation, in kHz
    fi_fm = np.gradient(ph_fm, t) / (2 * np.pi) / 1e3
    fi_pm = np.gradient(ph_pm, t) / (2 * np.pi) / 1e3
    assert abs(fi_fm.max() - 15.0) < 1e-3, fi_fm.max()
    assert abs(fi_pm.max() - 15.0) < 1e-3, fi_pm.max()
    # FM deviation tracks the message; PM deviation leads it by a quarter cycle
    msg = np.cos(2 * np.pi * fm * t)
    assert abs(fi_fm[np.argmax(msg)] - 15.0) < 1e-3
    assert abs(fi_pm[np.argmax(msg)]) < 1e-2, fi_pm[np.argmax(msg)]

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 5.3), sharex=True)
    ts = t * 1e6
    a1.plot(ts, ph_fm, color=c[0], lw=2.1)
    a1.plot(ts, ph_pm, color=c[1], lw=2.1)
    i_fm = int(0.75 * len(ts))
    S.label_end(a1, ts[i_fm], ph_fm[i_fm], "FM phase = 3.75 sin", c[0], mode,
                dy=-17, ha="center")
    S.label_end(a1, ts[8], ph_pm[8], "PM phase = 3.75 cos", c[1], mode, dx=4, dy=11)
    a1.set_ylabel("phase deviation  (rad)")
    a1.set_title("Instantaneous frequency is the slope of the phase")
    a1.set_ylim(-5.6, 6.4)
    S.strip(a1)
    a2.plot(ts, fi_fm, color=c[0], lw=2.1)
    a2.plot(ts, fi_pm, color=c[1], lw=2.1)
    a2.axhline(15.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    a2.axhline(-15.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(a2, 3, -21.2, "peak deviation 15.00 kHz, so beta = 15/4 = 3.75", mode)
    i0 = int(0.12 * len(ts))
    S.label_end(a2, ts[i0], fi_fm[i0], "FM: follows the message", c[0], mode, dx=2, dy=12)
    S.label_end(a2, ts[int(0.75 * len(ts))], 15.0, "PM: follows its derivative", c[1], mode,
                dy=10, ha="center")
    a2.set_xlabel("time  (microseconds)")
    a2.set_ylabel("frequency deviation  (kHz)")
    a2.set_ylim(-22, 23)
    S.strip(a2)
    fig.subplots_adjust(hspace=0.14)
    return fig


@figure("com2-fm-bessel")
def _(mode):
    """The first three Bessel coefficients against modulation index.

    Amplitudes are computed with jv() and every marked value is re-derived by
    quadrature of the integral representation before it is drawn.
    """
    c = S.SERIES[mode]
    b = np.linspace(0, 10, 1400)
    fig, ax = plt.subplots()
    for n, col in zip((0, 1, 2), c):
        ax.plot(b, jv(n, b), color=col, lw=2.1)
    for n, col in ((0, c[0]), (1, c[1]), (2, c[2])):
        S.label_end(ax, 10.0, jv(n, 10.0), f"J{n}", col, mode)
    z1, z2 = 2.404825557695773, 5.520078110286311
    for z in (z1, z2):
        assert abs(jv(0, z)) < 1e-12
        assert abs(jn_integral(0, z)) < 1e-9, jn_integral(0, z)
        ax.plot([z], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, z1 + 0.12, 0.055, "J0 = 0 at beta = 2.4048", mode)
    S.note(ax, z2 + 0.12, 0.055, "and again at 5.5201", mode)
    for n, bb, val in ((0, 5.0, -0.177597), (1, 5.0, -0.327579), (2, 5.0, 0.046565)):
        assert abs(jv(n, bb) - val) < 5e-6, (n, jv(n, bb))
        assert abs(jn_integral(n, bb) - val) < 5e-6, (n, jn_integral(n, bb))
    ax.axvline(5.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 3.15, 0.80, "beta = 5: J0 = -0.1776, J1 = -0.3276, J2 = +0.0466", mode)
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    ax.set_xlabel("modulation index  beta")
    ax.set_ylabel("sideband amplitude  Jn(beta)")
    ax.set_title("Sideband amplitudes: the carrier line is not privileged")
    ax.set_xlim(0, 10.4)
    ax.set_ylim(-0.55, 1.08)
    S.strip(ax)
    return fig


@figure("com2-carson-error")
def _(mode):
    """Carson's rule against the bandwidth that truly holds 99% of the power.

    Both are expressed as the half-count N in BW = 2 N fm. Carson is the
    straight line N = beta + 1; the true 99% requirement is the smallest
    integer N whose enclosed power reaches 0.99. Carson is generous for small
    beta and just barely short for large beta.
    """
    c = S.SERIES[mode]

    def enclosed(beta, N):
        return jv(0, beta) ** 2 + 2 * sum(jv(n, beta) ** 2 for n in range(1, N + 1))

    def true_n(beta):
        for N in range(0, 200):
            if enclosed(beta, N) >= 0.99:
                return N
        raise RuntimeError

    betas = np.linspace(0.2, 15.0, 400)
    tn = np.array([true_n(x) for x in betas], dtype=float)
    carson = betas + 1

    # quoted checkpoints, each also re-derived by quadrature
    for beta, N, pct in ((1.0, 2, 99.9222), (5.0, 6, 99.3559), (10.0, 11, 98.9958)):
        assert abs(100 * enclosed(beta, N) - pct) < 5e-4, (beta, 100 * enclosed(beta, N))
        alt = jn_integral(0, beta) ** 2 + 2 * sum(jn_integral(n, beta) ** 2
                                                  for n in range(1, N + 1))
        assert abs(100 * alt - pct) < 5e-4, (beta, 100 * alt)
    assert true_n(1.0) == 2 and true_n(5.0) == 6, (true_n(1.0), true_n(5.0))
    assert true_n(10.0) == 12, true_n(10.0)
    assert enclosed(10.0, 11) < 0.99 <= enclosed(10.0, 12)
    assert abs(100 * enclosed(10.0, 12) - 99.7989) < 5e-4, 100 * enclosed(10.0, 12)
    # broadcast FM: beta = 5 exactly, Carson 180 kHz in a 200 kHz channel
    assert abs(2 * (75.0 + 15.0) - 180.0) < 1e-12

    fig, ax = plt.subplots()
    ax.step(betas, tn, where="post", color=c[1], lw=2.2)
    ax.plot(betas, carson, color=c[0], lw=2.2)
    S.label_end(ax, 9.0, 10.0, "Carson: N = beta + 1", c[0], mode, dx=5, dy=-13)
    S.label_end(ax, 2.4, 1.1, "true 99%-power N", c[1], mode, dx=0, dy=0)
    for beta in (1.0, 5.0, 10.0):
        ax.plot([beta], [beta + 1], "o", color=c[0], ms=7)
        ax.plot([beta], [true_n(beta)], "o", color=c[1], ms=7)
    S.note(ax, 8.4, 5.0, "beta = 1: Carson 2, true 2 - the band holds 99.92%", mode)
    S.note(ax, 8.4, 3.4, "beta = 5: Carson 6, true 6 - the band holds 99.36%", mode)
    S.note(ax, 8.4, 1.3, "beta = 10: Carson 11 holds only 98.996%,\nso the honest 99% band is N = 12", mode)
    ax.set_xlabel("modulation index  beta")
    ax.set_ylabel("N in bandwidth = 2 N fm")
    ax.set_title("Carson's rule versus the true 99%-power bandwidth")
    ax.set_xlim(0, 16.6)
    ax.set_ylim(0, 17.4)
    S.strip(ax)
    return fig


@figure("com2-preemphasis")
def _(mode):
    """Pre-emphasis, de-emphasis, and the noise triangle they defeat.

    The pre-emphasis network is 1 + j f/f1 with f1 = 1/(2 pi tau); at
    tau = 75 us that corner is 2122.07 Hz and the boost at the 15 kHz band edge
    is 17.07 dB. The de-emphasis SNR gain follows from integrating the
    parabolic discriminator noise with and without the network.
    """
    c = S.SERIES[mode]
    tau, W = 75e-6, 15e3
    f1 = 1 / (2 * np.pi * tau)
    assert abs(f1 - 2122.0659) < 5e-4, f1
    assert abs(1 / (2 * np.pi * 50e-6) - 3183.0989) < 5e-4
    boost = db(1 + (W / f1) ** 2)
    assert abs(boost - 17.0727) < 5e-4, boost

    f = np.logspace(np.log10(30), np.log10(2e4), 700)
    pre = db(1 + (f / f1) ** 2)
    dee = -pre
    # noise power at the detector output rises as f^2; de-emphasis divides it
    # by 1 + (f/f1)^2. Closed form for the gain:
    gain_cf = (W ** 3 / 3) / (f1 ** 2 * (W - f1 * np.arctan(W / f1)))
    # INDEPENDENT route: integrate both spectra numerically, no closed form.
    num = quad(lambda x: x ** 2, 0, W)[0]
    den = quad(lambda x: x ** 2 / (1 + (x / f1) ** 2), 0, W)[0]
    gain_num = num / den
    assert abs(gain_cf - gain_num) < 1e-6 * gain_cf, (gain_cf, gain_num)
    assert abs(db(gain_num) - 13.1975) < 5e-4, db(gain_num)

    fig, ax = plt.subplots()
    ax.semilogx(f, pre, color=c[0], lw=2.2)
    ax.semilogx(f, dee, color=c[1], lw=2.2)
    noise = db((f / W) ** 2) + 17.0727  # parabolic noise, drawn to the same scale
    ax.semilogx(f, noise, color=c[2], lw=1.9, ls="--")
    S.label_end(ax, 1.35e4, db(1 + (1.35e4 / f1) ** 2), "pre-emphasis", c[0], mode, dy=8, ha="right")
    S.label_end(ax, 1.35e4, -db(1 + (1.35e4 / f1) ** 2), "de-emphasis", c[1], mode, dy=-10, ha="right")
    S.label_end(ax, 8.0e2, db((8.0e2 / W) ** 2) + 17.0727, "discriminator noise, rising as f squared",
                c[2], mode, dy=11)
    ax.axvline(f1, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 33, -13.6, "corner f = 1/(2 pi tau) = 2122 Hz", mode)
    ax.plot([W], [boost], "o", color=c[0], ms=7)
    S.note(ax, 1.45e4, boost + 1.2, "+17.07 dB at 15 kHz", mode, ha="right")
    S.note(ax, 40, 13.4, "net SNR gain from the pair: 13.20 dB", mode)
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    ax.set_xlabel("audio frequency  (Hz)")
    ax.set_ylabel("relative response  (dB)")
    ax.set_title("Pre-emphasis buys back the top of the audio band")
    ax.set_ylim(-22, 22)
    S.strip(ax)
    return fig


@figure("com2-fm-capture")
def _(mode):
    """The capture effect, computed rather than asserted.

    Two co-channel carriers of amplitudes A1 at f1 and A2 at f2 sum to a
    phasor whose unwrapped phase winds at f1 when a = A2/A1 < 1 and at f2 when
    a > 1. Averaging the numerically differentiated phase over whole beat
    periods reproduces that switch exactly, with no model of a limiter.
    """
    c = S.SERIES[mode]
    f1, f2 = 0.0, 1.0  # normalized: the beat rate is 1

    def mean_out(a, cycles=400, per=4096):
        t = np.arange(cycles * per) / per
        z = np.exp(2j * np.pi * f1 * t) + a * np.exp(2j * np.pi * f2 * t)
        ph = np.unwrap(np.angle(z))
        return (ph[-1] - ph[0]) / (2 * np.pi * (t[-1] - t[0]))

    ratios_db = np.linspace(-12, 12, 121)
    ratios_db = ratios_db[np.abs(ratios_db) > 1e-9]
    a = 10 ** (ratios_db / 20)
    out = np.array([mean_out(x) for x in a])
    assert abs(mean_out(0.5)) < 1e-3, mean_out(0.5)
    assert abs(mean_out(0.9)) < 1e-3, mean_out(0.9)
    assert abs(mean_out(1.1) - 1.0) < 1e-3, mean_out(1.1)
    assert abs(mean_out(2.0) - 1.0) < 1e-3, mean_out(2.0)

    # the instantaneous-frequency trace for a = 0.5: spikes but zero mean
    t = np.linspace(0, 3, 60000)
    z = np.exp(2j * np.pi * f1 * t) + 0.5 * np.exp(2j * np.pi * f2 * t)
    fi = np.gradient(np.unwrap(np.angle(z)), t) / (2 * np.pi)
    assert abs(fi.mean()) < 2e-3, fi.mean()
    # d(theta)/d(phi) = (a cos phi + a^2)/(1 + 2 a cos phi + a^2): at phi = 0
    # that is 0.75/2.25 = 1/3, at phi = pi it is -0.25/0.25 = -1.
    assert abs(fi.max() - 1.0 / 3.0) < 2e-3, fi.max()
    assert abs(fi.min() + 1.0) < 2e-3, fi.min()

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 3.9))
    a1.plot(ratios_db, out, color=c[0], lw=2.3)
    a1.plot([-6], [mean_out(10 ** (-6 / 20))], "o", color=c[0], ms=7)
    a1.plot([6], [mean_out(10 ** (6 / 20))], "o", color=c[0], ms=7)
    a1.axvline(0.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a1, -11.5, 0.55, "weaker signal\nfully suppressed", mode)
    S.note(a1, 0.6, 0.12, "hard switch at equal\namplitude", mode)
    a1.set_xlabel("interferer / wanted  (dB)")
    a1.set_ylabel("mean discriminator output")
    a1.set_title("Whoever is louder wins outright")
    a1.set_ylim(-0.12, 1.12)
    S.strip(a1)
    a2.plot(t, fi, color=c[1], lw=1.9)
    a2.axhline(0.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, 0.06, 0.52, "rides at +0.333, dives to -1.000,\nand still averages 0.000", mode)
    a2.set_xlabel("time  (beat periods)")
    a2.set_ylabel("instantaneous frequency")
    a2.set_title("a = 0.5: spikes, zero mean")
    a2.set_ylim(-1.42, 0.95)
    S.strip(a2)
    fig.subplots_adjust(wspace=0.34)
    return fig


# ===========================================================================
# fee_digital_mod
# ===========================================================================


@figure("com2-qam16-regions")
def _(mode):
    """16-QAM constellation, decision regions, and the geometry that fixes
    average energy.

    Points sit at (+/-1, +/-3) d/2 on each axis, so the mean square radius is
    2 x mean(x^2) = 2 x (0.25 + 2.25)/2 d^2 = 2.5 d^2 = (M - 1) d^2/6.
    """
    c = S.SERIES[mode]
    lev = np.array([-1.5, -0.5, 0.5, 1.5])  # in units of d
    pts = np.array([(x, y) for x in lev for y in lev])
    Es = np.mean(pts[:, 0] ** 2 + pts[:, 1] ** 2)
    assert abs(Es - 2.5) < 1e-12, Es
    assert abs(Es - (16 - 1) / 6.0) < 1e-12
    dmin_over_rootEs = 1.0 / np.sqrt(Es)
    assert abs(dmin_over_rootEs - 0.632456) < 5e-6, dmin_over_rootEs
    # QPSK on the same average energy for comparison: points at +/-r, +/-r with
    # 2 r^2 = Es -> r = sqrt(Es/2), spacing 2r
    qpsk_d = 2 * np.sqrt(2.5 / 2)
    assert abs(qpsk_d / 1.0 - 2.2360680) < 5e-6, qpsk_d
    assert abs(db(qpsk_d ** 2) - 6.9897) < 5e-4, db(qpsk_d ** 2)

    fig, ax = plt.subplots(figsize=(5.6, 5.2))
    for g in (-1.0, 0.0, 1.0):
        ax.axvline(g, color=S.GUIDE[mode], lw=1.1, ls="--")
        ax.axhline(g, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot(pts[:, 0], pts[:, 1], "o", color=c[0], ms=9)
    gray = ["00", "01", "11", "10"]
    for i, x in enumerate(lev):
        for j, y in enumerate(lev):
            ax.annotate(gray[i] + gray[j], xy=(x, y), xytext=(0, 11),
                        textcoords="offset points", ha="center",
                        color=S.INK_2[mode], fontsize=8)
    ax.annotate("", xy=(1.5, -1.5), xytext=(0.5, -1.5),
                arrowprops=dict(arrowstyle="<->", color=c[1], lw=1.8))
    S.label_end(ax, 1.0, -1.5, "d", c[1], mode, dx=0, dy=-13, ha="center")
    ax.plot([0, 1.5], [0, 1.5], color=c[2], lw=1.6)
    S.note(ax, -2.05, -2.44, "corner radius 2.121 d: a peak-to-average power ratio of 1.80", mode)
    S.note(ax, -2.05, 1.93, "Es = (M-1)d^2/6 = 2.500 d^2, so d/sqrt(Es) = 0.6325", mode)
    S.note(ax, -2.05, -2.10, "16 square regions; a symbol is decided by which one the sample lands in", mode)
    ax.set_xlabel("in-phase  (units of d)")
    ax.set_ylabel("quadrature  (units of d)")
    ax.set_title("16-QAM: Gray labels and decision regions")
    ax.set_xlim(-2.15, 2.15)
    ax.set_ylim(-2.62, 2.3)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("com2-psk-mindist")
def _(mode):
    """BPSK, QPSK and 8-PSK at equal average energy, with the chord that
    decides them: d = 2 sqrt(Es) sin(pi/M).
    """
    c = S.SERIES[mode]
    fig, axes = plt.subplots(1, 3, figsize=(7.8, 3.1))
    for ax, M, name, col in zip(axes, (2, 4, 8), ("BPSK", "QPSK", "8-PSK"), c):
        th = 2 * np.pi * np.arange(M) / M
        d = 2 * np.sin(np.pi / M)
        ax.plot(np.cos(np.linspace(0, 2 * np.pi, 400)),
                np.sin(np.linspace(0, 2 * np.pi, 400)),
                color=S.GRID[mode], lw=1.0)
        ax.plot(np.cos(th), np.sin(th), "o", color=col, ms=8)
        ax.plot([np.cos(th[0]), np.cos(th[1])], [np.sin(th[0]), np.sin(th[1])],
                color=S.INK_2[mode], lw=1.6, ls="--")
        ax.set_title(f"{name}\nd = {d:.3f} sqrt(Es)", fontsize=10.5)
        ax.set_xlim(-1.45, 1.45)
        ax.set_ylim(-1.45, 1.45)
        ax.set_aspect("equal")
        ax.set_xticks([])
        ax.set_yticks([])
        ax.grid(False)
        for side in ("top", "right", "left", "bottom"):
            ax.spines[side].set_visible(False)
    for M, val in ((2, 2.0), (4, 1.414214), (8, 0.765367), (16, 0.390181)):
        assert abs(2 * np.sin(np.pi / M) - val) < 5e-6, (M, 2 * np.sin(np.pi / M))
    # loss relative to BPSK, in dB of energy
    d2, d4, d8 = (2 * np.sin(np.pi / M) for M in (2, 4, 8))
    assert abs(db((d2 / d4) ** 2) - 3.0103) < 5e-5, db((d2 / d4) ** 2)
    assert abs(db((d4 / d8) ** 2) - 5.3329) < 5e-5, db((d4 / d8) ** 2)
    fig.subplots_adjust(wspace=0.22)
    return fig


@figure("com2-ber-mc")
def _(mode):
    """BER against Eb/N0: closed form drawn as lines, Monte-Carlo bit counting
    drawn as markers. The two routes share no algebra beyond the constellation
    itself.
    """
    c = S.SERIES[mode]
    rng = np.random.default_rng(20260816)

    def theory(M, gdb):
        g = 10 ** (np.asarray(gdb, dtype=float) / 10)
        k = np.log2(M)
        if M == 4:
            return Q(np.sqrt(2 * g))
        return (4.0 / k) * (1 - 1 / np.sqrt(M)) * Q(np.sqrt(3 * k / (M - 1) * g))

    def mc_qam(M, gdb, nsym=400_000):
        """Count bit errors on a Gray-coded square constellation."""
        k = int(np.log2(M))
        L = int(np.sqrt(M))
        lev = np.arange(L) * 2 - (L - 1)          # ..., -3, -1, 1, 3
        Es = np.mean(lev ** 2) * 2
        g = 10 ** (gdb / 10)                       # Eb/N0
        n0 = Es / (k * g)                          # N0 with Es normalized as above
        idx = rng.integers(0, L, size=(nsym, 2))
        tx = lev[idx]
        rx = tx + rng.normal(0, np.sqrt(n0 / 2), size=tx.shape)
        hard = np.clip(np.rint((rx + (L - 1)) / 2), 0, L - 1).astype(int)
        gray = np.arange(L) ^ (np.arange(L) >> 1)  # Gray code of the level index
        errs = np.bitwise_xor(gray[idx], gray[hard])
        nbits = 0
        for b in range(int(np.log2(L))):
            nbits += np.sum((errs >> b) & 1)
        return nbits / (nsym * k)

    fig, ax = plt.subplots()
    grid = np.linspace(0, 20, 400)
    for M, col in zip((4, 16, 64), c):
        ax.semilogy(grid, theory(M, grid), color=col, lw=2.2)
    marks = {4: np.arange(0, 11, 2.0), 16: np.arange(4, 15, 2.0), 64: np.arange(8, 19, 2.0)}
    NSYM = 600_000
    for M, col in zip((4, 16, 64), c):
        pts = np.array([mc_qam(M, x, NSYM) for x in marks[M]])
        ax.semilogy(marks[M], pts, "o", color=col, ms=6.5, mfc="none", mew=1.6)
        th = theory(M, marks[M])
        # The tolerance is the counting statistics of the run itself, not a
        # round number chosen to make the test pass: a point whose expected
        # error count is n may stray by about 1/sqrt(n) in relative terms, so
        # anything beyond four of those sigmas is a real disagreement.
        n_exp = th * NSYM * np.log2(M)
        tol = 4.0 / np.sqrt(n_exp) + 0.015
        rel = np.abs(pts - th) / th
        assert np.all(rel < tol), (M, rel, tol)
    # the three quoted requirement points at BER 1e-5
    from scipy.optimize import brentq
    req = {M: brentq(lambda x: theory(M, x) - 1e-5, 0, 40, xtol=1e-12) for M in (4, 16, 64, 256)}
    assert abs(req[4] - 9.5879) < 5e-4, req[4]
    assert abs(req[16] - 13.4345) < 5e-4, req[16]
    assert abs(req[64] - 17.7869) < 5e-4, req[64]
    assert abs(req[256] - 22.5032) < 5e-4, req[256]
    for M, col in zip((4, 16, 64), c):
        ax.plot([req[M]], [1e-5], "o", color=S.INK[mode], ms=6, zorder=6)
    ax.axhline(1e-5, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.3, 1.35e-5, "BER = 1e-5 crossings: 9.59, 13.43, 17.79 dB", mode)
    S.label_end(ax, 10.0, theory(4, 10.0), "QPSK\n(= BPSK)", c[0], mode, dx=-4, dy=-20, ha="center")
    S.label_end(ax, 14.0, theory(16, 14.0), "16-QAM", c[1], mode, dx=2, dy=6)
    S.label_end(ax, 18.4, theory(64, 18.4), "64-QAM", c[2], mode, dx=2, dy=6)
    S.note(ax, 0.3, 1.5e-8, "open circles: Monte-Carlo bit counts, 600 000 symbols per point", mode)
    ax.set_xlabel("Eb/N0  (dB)")
    ax.set_ylabel("bit error rate")
    ax.set_title("Two independent routes to the same curves")
    ax.set_xlim(0, 21)
    ax.set_ylim(1e-9, 0.6)
    S.strip(ax)
    return fig


@figure("com2-gray-penalty")
def _(mode):
    """Gray labelling against natural-binary labelling, both measured.

    At high SNR every symbol error is to a nearest neighbour. Counting bit
    flips over the six adjacent pairs of a 4-level axis gives 6 for Gray
    labelling and 8 for natural binary, so natural binary produces 8/6 = 4/3
    as many bit errors. The ratio is MEASURED here, not assumed.
    """
    c = S.SERIES[mode]
    rng = np.random.default_rng(88117)
    L, k = 4, 4                                   # 16-QAM: 4 levels per axis
    lev = np.array([-3.0, -1.0, 1.0, 3.0])
    Es = np.mean(lev ** 2) * 2
    gray = np.array([0, 1, 3, 2])
    nat = np.array([0, 1, 2, 3])

    NSYM = 2_000_000

    def mc(labels, gdb, nsym=NSYM):
        g = 10 ** (gdb / 10)
        n0 = Es / (k * g)
        idx = rng.integers(0, L, size=(nsym, 2))
        rx = lev[idx] + rng.normal(0, np.sqrt(n0 / 2), size=(nsym, 2))
        hard = np.clip(np.rint((rx + 3) / 2), 0, L - 1).astype(int)
        e = np.bitwise_xor(labels[idx], labels[hard])
        return (np.sum(e & 1) + np.sum((e >> 1) & 1)) / (nsym * k)

    gdb = np.arange(4, 12, 1.0)
    bg = np.array([mc(gray, x) for x in gdb])
    bn = np.array([mc(nat, x) for x in gdb])
    ratio = bn / bg
    # Tolerance from the counting statistics of the run: the thinnest point
    # still carries thousands of errors, so a 4/3 plateau is a real result
    # rather than a hopeful reading of noise.
    n_err = bg[-3:] * NSYM * k
    assert n_err.min() > 1500, n_err
    tol = 6.0 / np.sqrt(n_err.min())
    assert abs(ratio[-3:].mean() - 4.0 / 3.0) < tol, (ratio[-3:].mean(), tol)
    assert np.all(bn > bg)

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.8, 3.9))
    a1.semilogy(gdb, bg, "o-", color=c[0], ms=5.5, lw=2.0)
    a1.semilogy(gdb, bn, "s-", color=c[1], ms=5.5, lw=2.0)
    S.label_end(a1, 8.0, bg[4], "Gray", c[0], mode, dx=-4, dy=-15)
    S.label_end(a1, 8.0, bn[4], "natural binary", c[1], mode, dx=-4, dy=11)
    a1.set_xlabel("Eb/N0  (dB)")
    a1.set_ylabel("measured bit error rate")
    a1.set_title("16-QAM, 2 million symbols per point")
    S.strip(a1)
    a2.plot(gdb, ratio, "o-", color=c[2], ms=5.5, lw=2.0)
    a2.axhline(4.0 / 3.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, 4.3, 4.0 / 3.0 + 0.028, "4/3 = 1.333, the nearest-neighbour limit", mode)
    a2.set_xlabel("Eb/N0  (dB)")
    a2.set_ylabel("BER ratio, natural / Gray")
    a2.set_title("The penalty settles at 4/3")
    a2.set_ylim(1.0, 1.55)
    S.strip(a2)
    fig.subplots_adjust(wspace=0.32)
    return fig


@figure("com2-eff-vs-ebn0")
def _(mode):
    """Bandwidth efficiency against the Eb/N0 each scheme needs at BER 1e-5,
    with the Shannon bound Eb/N0 = (2^eta - 1)/eta for comparison.
    """
    from scipy.optimize import brentq
    c = S.SERIES[mode]

    def theory(M, gdb):
        g = 10 ** (np.asarray(gdb, dtype=float) / 10)
        k = np.log2(M)
        if M == 4:
            return Q(np.sqrt(2 * g))
        return (4.0 / k) * (1 - 1 / np.sqrt(M)) * Q(np.sqrt(3 * k / (M - 1) * g))

    Ms = (4, 16, 64, 256)
    req = np.array([brentq(lambda x: theory(M, x) - 1e-5, 0, 40, xtol=1e-12) for M in Ms])
    eta = np.array([np.log2(M) for M in Ms])
    assert abs(req[0] - 9.5879) < 5e-4
    assert abs(req[3] - 22.5032) < 5e-4

    e = np.linspace(0.35, 9.0, 500)
    shannon = db((2 ** e - 1) / e)
    assert abs(db((2 ** 2 - 1) / 2) - 1.7609) < 5e-4, db((2 ** 2 - 1) / 2)
    assert abs(db((2 ** 4 - 1) / 4) - 5.7403) < 5e-4, db((2 ** 4 - 1) / 4)
    assert abs(db((2 ** 6 - 1) / 6) - 10.2119) < 5e-4, db((2 ** 6 - 1) / 6)
    # -1.59 dB limit as efficiency goes to zero
    assert abs(db((2 ** 1e-6 - 1) / 1e-6) + 1.5917) < 5e-4

    fig, ax = plt.subplots()
    ax.plot(shannon, e, color=c[0], lw=2.2)
    ax.plot(req, eta, "o-", color=c[1], ms=7.5, lw=2.0)
    S.label_end(ax, shannon[380], e[380], "Shannon bound", c[0], mode, dy=10, ha="center")
    S.label_end(ax, req[3], eta[3], "square QAM\nat BER 1e-5", c[1], mode, dx=-8, dy=17, ha="right")
    for M, x, y in zip(Ms, req, eta):
        S.note(ax, x - 0.45, y - 0.55, f"{M}-QAM: {x:.2f} dB", mode, ha="right")
    ax.axvline(-1.5917, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, -1.2, 7.6, "-1.59 dB: no code beats this,\nat any efficiency", mode)
    gapd = req[1] - db((2 ** 4 - 1) / 4)
    assert abs(gapd - 7.6942) < 1e-3, gapd
    ax.annotate("", xy=(req[1], 4.0), xytext=(db((2 ** 4 - 1) / 4), 4.0),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 5.9, 4.46, "7.69 dB of coding gain still on the table at 4 bit/s/Hz", mode)
    ax.set_xlabel("Eb/N0  (dB)")
    ax.set_ylabel("bandwidth efficiency  (bit/s/Hz)")
    ax.set_title("What each extra bit per symbol costs")
    ax.set_xlim(-3.5, 26)
    ax.set_ylim(0, 9.2)
    S.strip(ax)
    return fig


@figure("com2-scatter-snr")
def _(mode):
    """Received 16-QAM clouds at two values of Es/N0, on the same decision
    grid, with the measured symbol error rate printed on each panel.
    """
    c = S.SERIES[mode]
    rng = np.random.default_rng(4242)
    lev = np.array([-3.0, -1.0, 1.0, 3.0])
    Es = np.mean(lev ** 2) * 2
    assert abs(Es - 10.0) < 1e-12, Es

    def cloud(esn0_db, n):
        n0 = Es / 10 ** (esn0_db / 10)
        idx = rng.integers(0, 4, size=(n, 2))
        rx = lev[idx] + rng.normal(0, np.sqrt(n0 / 2), size=(n, 2))
        hard = np.clip(np.rint((rx + 3) / 2), 0, 3).astype(int)
        ser = np.mean(np.any(hard != idx, axis=1))
        return rx, ser

    def ser_theory(esn0_db):
        g = 10 ** (esn0_db / 10)
        p = 3.0 / 2.0 * Q(np.sqrt(g / 5.0))   # per-axis 4-PAM error, Es=10, d=2
        return 1 - (1 - p) ** 2

    NPT = 600_000
    fig, axes = plt.subplots(1, 2, figsize=(7.6, 3.9))
    for ax, snr, col in zip(axes, (14.0, 18.0), (c[1], c[0])):
        rx, ser = cloud(snr, NPT)
        th = ser_theory(snr)
        # Tolerance from the counting statistics of this very run, so the
        # comparison stays a real test at the thin end instead of passing on a
        # floor: five sigmas of a Poisson count of the expected errors.
        n_exp = th * NPT
        assert n_exp > 200, n_exp
        assert abs(ser - th) < 5 * th / np.sqrt(n_exp), (snr, ser, th)
        ax.plot(rx[::30, 0], rx[::30, 1], ".", color=col, ms=1.9, alpha=0.55)
        for g in (-2.0, 0.0, 2.0):
            ax.axvline(g, color=S.GUIDE[mode], lw=1.0, ls="--")
            ax.axhline(g, color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.set_title(f"Es/N0 = {snr:.0f} dB\nmeasured SER = {ser:.5f}", fontsize=10.5)
        ax.set_xlim(-5.2, 5.2)
        ax.set_ylim(-5.2, 5.2)
        ax.set_aspect("equal")
        ax.set_xlabel("in-phase")
        ax.grid(False)
        S.strip(ax)
    axes[0].set_ylabel("quadrature")
    assert abs(ser_theory(14.0) - 0.037151) < 5e-6, ser_theory(14.0)
    assert abs(ser_theory(18.0) - 5.7263e-4) < 5e-8, ser_theory(18.0)
    fig.subplots_adjust(wspace=0.18)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "com2-"
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
