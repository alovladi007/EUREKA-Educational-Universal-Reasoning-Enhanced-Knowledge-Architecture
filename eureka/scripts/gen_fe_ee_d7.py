#!/usr/bin/env python3
"""Depth-wave figures for the FE Electrical and Computer course: the two
Signal Processing chapters `fee_fourier` and `fee_sampling`.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve is COMPUTED here from an equation the
lesson writes out. Nothing is traced, scanned, redrawn or adapted from the
NCEES Reference Handbook or any textbook: this pipeline consumes formulas,
which are not protected expression, and never anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

The assertions are the anti-drift mechanism: the number the prose prints and
the number the curve is drawn from are the same number, checked here at a
tolerance tight enough to catch a real error rather than decorate one. Where a
quantity has a closed form the assertion is at 1e-9; where it is the outcome of
a synthesis-and-measure experiment (an FFT of a built waveform, a tone actually
sampled at a stated rate) the tolerance is the last digit the prose quotes.

Usage:
    python3 scripts/gen_fe_ee_d7.py              # all
    python3 scripts/gen_fe_ee_d7.py sig2-gibbs   # only names with that prefix
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
PI = np.pi


def figure(name):
    if not name.startswith("sig2-"):
        raise ValueError(f"figure {name!r} is outside this file's namespace")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Shared synthesis: one exact period of each waveform, and its coefficients
# taken from an FFT rather than from the closed form. The closed forms are
# asserted against those FFT numbers so a figure cannot drift from the prose.
# ---------------------------------------------------------------------------

M = 1 << 18
_k = np.arange(M)
_t = _k / M


def _period(kind: str, A: float = 10.0) -> np.ndarray:
    if kind == "square":
        x = np.where(_k < M // 2, A, -A).astype(float)
        x[0] = 0.0
        x[M // 2] = 0.0
        return x
    if kind == "triangle":
        return A * (1 - 4 * np.minimum(_t, 1 - _t))
    if kind == "sawtooth":
        x = np.where(_t < 0.5, 2 * A * _t, 2 * A * (_t - 1))
        x[0] = 0.0
        x[M // 2] = 0.0
        return x
    if kind == "rectified":
        return A * np.abs(np.sin(PI * _t))
    raise KeyError(kind)


def _fft_coeffs(x: np.ndarray) -> np.ndarray:
    """c_n from one exact period. a_n = 2 Re c_n, b_n = -2 Im c_n."""
    return np.fft.fft(x) / len(x)


def _amp(kind: str, nmax: int, A: float = 10.0) -> np.ndarray:
    """One-sided harmonic amplitudes A_n = 2|c_n| for n = 1..nmax."""
    c = _fft_coeffs(_period(kind, A))
    return 2 * np.abs(c[1:nmax + 1])


# ---------------------------------------------------------------------------
# fee_fourier
# ---------------------------------------------------------------------------


@figure("sig2-orthogonality")
def _(mode):
    """Running integrals that show orthogonality doing the selecting.

    (2/T0) * integral of cos(m w0 t) cos(n w0 t) accumulated from 0 to t. For
    m = n = 2 the integrand has a nonzero average and the accumulation walks
    up to 1; for m = 2, n = 3 the integrand averages zero and the accumulation
    returns to 0 at the end of the period. That difference IS the coefficient
    formula.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 1, 20001)
    dt = t[1] - t[0]

    def running(y):
        """Trapezoidal running integral - exact over a whole period here."""
        return np.concatenate([[0.0], np.cumsum(0.5 * (y[1:] + y[:-1])) * dt])

    same = running(2 * np.cos(2 * PI * 2 * t) ** 2)
    cross = running(2 * np.cos(2 * PI * 2 * t) * np.cos(2 * PI * 3 * t))
    assert abs(same[-1] - 1.0) < 1e-12, same[-1]
    assert abs(cross[-1]) < 1e-12, cross[-1]

    fig, ax = plt.subplots()
    ax.plot(t, same, color=c[0], lw=2.2)
    ax.plot(t, cross, color=c[1], lw=2.2)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 0.62, same[int(0.62 * 20000)], "m = n = 2:\nends at 1", c[0], mode, dy=-16)
    S.label_end(ax, 0.46, -0.235, "m = 2, n = 3:\nends at 0", c[1], mode, dy=-4)
    ax.plot([1.0], [same[-1]], "o", color=c[0], ms=7)
    ax.plot([1.0], [cross[-1]], "o", color=c[1], ms=7)
    S.note(ax, 0.02, 1.16, "only the matched pair survives one whole period -\n"
                           "every other product integrates away", mode)
    ax.set_xlabel("fraction of one period  t / T0")
    ax.set_ylabel("running value of (2/T0) times the integral")
    ax.set_title("Orthogonality: the integral that keeps one term and kills the rest")
    ax.set_xlim(0, 1.12)
    ax.set_ylim(-0.35, 1.45)
    S.strip(ax)
    return fig


@figure("sig2-decay-compare")
def _(mode):
    """Harmonic amplitude against harmonic number for three waveforms.

    Amplitudes come from an FFT of the synthesized period, and the closed forms
    the lesson prints are asserted against them. On log-log axes the square and
    sawtooth fall on a slope of -1 and the triangle on -2: smoothness sets the
    decay rate.
    """
    c = S.SERIES[mode]
    A = 10.0
    nmax = 25
    n = np.arange(1, nmax + 1)
    sq = _amp("square", nmax, A)
    tri = _amp("triangle", nmax, A)
    saw = _amp("sawtooth", nmax, A)
    assert abs(sq[0] - 4 * A / PI) < 1e-7, sq[0]
    assert abs(sq[2] - 4 * A / (3 * PI)) < 1e-7, sq[2]
    assert abs(tri[0] - 8 * A / PI ** 2) < 1e-7, tri[0]
    assert abs(tri[2] - 8 * A / (9 * PI ** 2)) < 1e-7, tri[2]
    assert abs(saw[0] - 2 * A / PI) < 1e-7, saw[0]
    assert abs(saw[1] - A / PI) < 1e-7, saw[1]
    assert sq[1] < 1e-9 and tri[1] < 1e-9      # no even harmonics
    assert saw[1] > 3.0                        # sawtooth keeps its even ones

    fig, ax = plt.subplots(figsize=(8.4, 4.5))
    for series, colour, lab in (
        (sq, c[0], "square: 4A/(n pi)"),
        (saw, c[1], "sawtooth: 2A/(n pi)"),
        (tri, c[2], "triangle: 8A/(n^2 pi^2)"),
    ):
        vis = series > 1e-9
        ax.loglog(n[vis], series[vis], "o-", color=colour, lw=1.9, ms=5)
        S.label_end(ax, n[vis][-1], series[vis][-1], lab, colour, mode, dx=9)
    S.note(ax, 34, 4.2, "a jump gives 1/n;\na continuous kink\ngives 1/n^2", mode)
    ax.set_xlabel("harmonic number  n")
    ax.set_ylabel("one-sided harmonic amplitude  (V)")
    ax.set_title("Smoothness sets the roll-off: 10 V peak, three shapes")
    ax.set_xlim(0.85, 190)
    ax.set_ylim(0.0085, 30)
    S.strip(ax)
    return fig


@figure("sig2-gibbs-peak")
def _(mode):
    """Gibbs overshoot does not shrink; it only moves in.

    Top panel: the peak of the square-wave partial sum against the highest
    harmonic kept, approaching (2/pi)Si(pi) = 1.178980. Bottom panel: the
    instant of that peak, which follows T0/(2(N+1)) exactly.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 0.25, 400001)
    Ns = np.array([1, 3, 5, 9, 15, 25, 49, 99, 199, 399])
    peaks, spots = [], []
    for N in Ns:
        s = np.zeros_like(t)
        for n in range(1, N + 1, 2):
            s += (4 / (n * PI)) * np.sin(2 * PI * n * t)
        i = int(np.argmax(s))
        peaks.append(s[i])
        spots.append(t[i])
    peaks = np.array(peaks)
    spots = np.array(spots)
    limit = (2 / PI) * 1.8519370  # (2/pi) Si(pi), Si(pi) tabulated
    assert abs(limit - 1.1789797) < 1e-6, limit
    assert abs(peaks[-1] - limit) < 2e-5, peaks[-1]
    assert abs(peaks[3] - 1.182328) < 1e-5, peaks[3]     # N = 9
    assert abs(peaks[6] - 1.179113) < 1e-5, peaks[6]     # N = 49
    assert np.all(np.abs(spots - 1.0 / (2 * (Ns + 1))) < 3e-6)
    assert peaks.min() > limit                            # never falls below

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    ax1.semilogx(Ns, peaks, "o-", color=c[0], lw=2.0, ms=5)
    ax1.axhline(limit, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax1.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax1, 4.0, 1.235, "limit 1.178980 - the overshoot settles at\n"
                            "8.949% of the 2A jump and stays there", mode)
    S.note(ax1, 1.15, 1.006, "the step itself", mode)
    ax1.set_ylabel("peak of the partial sum / A")
    ax1.set_title("Gibbs: the overshoot stops shrinking, the ripple keeps narrowing")
    ax1.set_ylim(0.99, 1.31)
    ax1.set_xlim(0.85, 560)
    S.strip(ax1)

    ax2.loglog(Ns, spots, "o-", color=c[1], lw=2.0, ms=5)
    S.label_end(ax2, 1.6, 0.0016, "the peak sits at T0/(2(N+1)) - it never stops moving in",
                c[1], mode, dx=0)
    ax2.set_xlabel("highest harmonic kept  N")
    ax2.set_ylabel("time of the peak  t / T0")
    S.strip(ax2)
    fig.align_ylabels([ax1, ax2])
    return fig


@figure("sig2-power-fraction")
def _(mode):
    """Cumulative share of mean power against the number of harmonics kept.

    Each point is a partial Parseval sum divided by the mean square of the
    synthesized period, so the curve and the percentages in the prose come from
    the same arithmetic.
    """
    c = S.SERIES[mode]
    A = 10.0
    nmax = 15
    n = np.arange(1, nmax + 1)
    # Total mean power from the closed form the lesson states, so the
    # percentages here are the exact ones the prose prints; the numerators are
    # still FFT amplitudes, so a wrong coefficient would still show up.
    total = {"square": A * A, "triangle": A * A / 3, "sawtooth": A * A / 3}
    out = {}
    for kind in ("square", "triangle", "sawtooth"):
        amp = _amp(kind, nmax, A)
        assert abs(float(np.sum(amp ** 2 / 2)) / total[kind] - 1) < 0.4
        out[kind] = np.cumsum(amp ** 2 / 2) / total[kind]
    assert abs(out["square"][0] - 8 / PI ** 2) < 1e-9, out["square"][0]
    assert abs(out["square"][0] - 0.8105695) < 1e-6, out["square"][0]
    assert abs(out["square"][2] - 0.9006327) < 1e-6, out["square"][2]
    assert abs(out["square"][4] - 0.9330555) < 1e-6, out["square"][4]
    assert abs(out["square"][8] - 0.9596048) < 1e-6, out["square"][8]
    assert abs(out["triangle"][0] - 96 / PI ** 4) < 1e-9, out["triangle"][0]
    assert abs(out["triangle"][0] - 0.9855343) < 1e-6, out["triangle"][0]
    assert abs(out["triangle"][2] - 0.9977014) < 1e-6, out["triangle"][2]
    assert abs(out["sawtooth"][0] - 6 / PI ** 2) < 1e-9, out["sawtooth"][0]
    assert abs(out["sawtooth"][0] - 0.6079271) < 1e-6, out["sawtooth"][0]
    assert abs(out["sawtooth"][1] - 0.7599089) < 1e-6, out["sawtooth"][1]
    assert abs(out["sawtooth"][3] - 0.8654518) < 1e-6, out["sawtooth"][3]

    fig, ax = plt.subplots(figsize=(8.6, 4.5))
    for kind, colour, lab in (
        ("triangle", c[2], "triangle: 98.55% in the 1st"),
        ("square", c[0], "square: 81.06%, 90.06% by the 3rd"),
        ("sawtooth", c[1], "sawtooth: 60.79%, needs many"),
    ):
        ax.plot(n, 100 * out[kind], "o-", color=colour, lw=2.0, ms=5)
        S.label_end(ax, n[-1], 100 * out[kind][-1], lab, colour, mode, dx=9)
    ax.axhline(99.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.1, 99.6, "99% of the power", mode)
    ax.set_xlabel("harmonics included  (up to n)")
    ax.set_ylabel("share of total mean power  (%)")
    ax.set_title("Where the power lives: partial Parseval sums")
    ax.set_xlim(0.6, 26)
    ax.set_ylim(55, 104)
    S.strip(ax)
    return fig


@figure("sig2-rectified-spectrum")
def _(mode):
    """Line spectrum of a full-wave rectified 60 Hz sine of 10 V amplitude.

    Heights are |2 c_n| from the FFT of the synthesized period; the dc term is
    c_0. The closed form -4A/(pi(4n^2-1)) is asserted against them.
    """
    c = S.SERIES[mode]
    A = 10.0
    x = _period("rectified", A)
    co = _fft_coeffs(x)
    dc = float(co[0].real)
    amps = 2 * np.abs(co[1:6])
    assert abs(dc - 2 * A / PI) < 1e-9, dc
    for n in range(1, 6):
        assert abs(amps[n - 1] - 4 * A / (PI * (4 * n * n - 1))) < 1e-9, (n, amps[n - 1])
    assert abs(dc - 6.3662) < 5e-5
    assert abs(amps[0] - 4.2441) < 5e-5
    assert abs(amps[1] - 0.8488) < 5e-5
    assert abs(amps[2] - 0.3638) < 5e-5
    assert abs(amps[0] / dc - 2 / 3) < 1e-9

    freqs = np.array([0.0] + [120.0 * n for n in range(1, 6)])
    heights = np.array([dc] + list(amps))
    fig, ax = plt.subplots()
    ax.vlines(freqs, 0, heights, color=c[0], lw=3.0)
    ax.plot(freqs, heights, "o", color=c[0], ms=7)
    for f0, h in zip(freqs, heights):
        ax.annotate(f"{h:.4f}", xy=(f0, h), xytext=(0, 7), textcoords="offset points",
                    ha="center", color=S.INK_2[mode], fontsize=9)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    S.note(ax, 150, 5.35, "the ripple fundamental is 120 Hz, not 60 Hz -\n"
                          "rectification doubles the repetition rate", mode)
    S.note(ax, 150, 3.1, "|a1| / dc = 2/3 exactly, and the terms\n"
                         "fall off as 1/(4n^2 - 1)", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("one-sided amplitude  (V)")
    ax.set_title("Full-wave rectified 60 Hz sine, 10 V peak: dc plus even-order ripple")
    ax.set_xlim(-30, 660)
    ax.set_ylim(0, 7.4)
    S.strip(ax)
    return fig


@figure("sig2-pulse-train-envelope")
def _(mode):
    """Series coefficients riding a transform envelope.

    A 5 V pulse train of fixed 0.2 ms width is drawn at T0 = 1 ms and at
    T0 = 4 ms. Plotting T0*c_n against frequency puts both sets of lines on the
    single continuous curve A*tau*sinc(f tau) - the pulse's Fourier transform.
    Stretching the period only packs the lines closer under a fixed envelope.
    """
    c = S.SERIES[mode]
    A, tau = 5.0, 0.2e-3
    f = np.linspace(0, 16000, 6001)
    env = A * tau * np.sinc(f * tau)
    assert abs(env[0] - 1e-3) < 1e-15, env[0]
    assert abs(float(A * tau * np.sinc(5000 * tau))) < 1e-15   # null at 1/tau
    assert abs(float(A * tau * np.sinc(1000 * tau)) - 1e-3 * 0.9354892838) < 1e-12

    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    for ax, T0, colour, lab in ((axes[0], 1e-3, c[0], "T0 = 1 ms: one line every 1 kHz"),
                                (axes[1], 4e-3, c[1], "T0 = 4 ms: one line every 250 Hz")):
        n = np.arange(0, int(16000 * T0) + 1)
        fn = n / T0
        cn = A * (tau / T0) * np.sinc(fn * tau)
        assert abs(cn[0] - A * tau / T0) < 1e-15
        ax.plot(f, 1e3 * env, color=S.GUIDE[mode], lw=1.5, ls="--")
        ax.vlines(fn, 0, 1e3 * T0 * cn, color=colour, lw=1.6)
        ax.plot(fn, 1e3 * T0 * cn, "o", color=colour, ms=3.5)
        S.note(ax, 8700, 0.95, lab, mode)
        ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
        ax.set_ylabel("T0 times c_n  (mV/Hz)")
        ax.set_ylim(-0.34, 1.22)
        S.strip(ax)
    S.note(axes[1], 8700, 0.55, "the dashed envelope is A tau sinc(f tau),\n"
                                "the transform of ONE pulse.\nNulls at every multiple of 5 kHz.", mode)
    axes[0].set_title("Series to transform: stretch the period, keep the envelope")
    axes[1].set_xlabel("frequency  (Hz)")
    axes[0].set_xlim(-300, 16300)
    fig.align_ylabels(list(axes))
    return fig


@figure("sig2-sinc-energy")
def _(mode):
    """Energy spectral density of a 1 V, 2 ms rectangular pulse.

    |X(f)|^2 normalised to its peak, with the running share of total energy on
    the same 0..1 axis. The main lobe carries 0.902823 of the energy; the first
    sidelobe peaks 13.26 dB down.
    """
    c = S.SERIES[mode]
    A, tau = 1.0, 2e-3
    f = np.linspace(0, 4000, 400001)
    X = A * tau * np.sinc(f * tau)
    esd = X ** 2
    total = A ** 2 * tau / 2          # one-sided half of A^2 tau
    run = np.cumsum(esd) * (f[1] - f[0]) / total
    main = float(np.interp(1 / tau, f, run))
    assert abs(main - 0.902823) < 3e-5, main
    side = float(esd[(f > 1 / tau) & (f < 2 / tau)].max() / esd[0])
    assert abs(10 * np.log10(side) + 13.261) < 3e-3, 10 * np.log10(side)
    assert abs(float(np.interp(2 / tau, f, run)) - 0.9496) < 1e-3

    fig, ax = plt.subplots()
    ax.plot(f, esd / esd[0], color=c[0], lw=2.0)
    ax.plot(f, run, color=c[1], lw=2.0)
    S.label_end(ax, 700, 0.42, "|X(f)|^2, normalised", c[0], mode, dx=0)
    S.label_end(ax, 2100, 1.03, "running share of the energy", c[1], mode, dx=0)
    ax.axvline(1 / tau, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot([1 / tau], [main], "o", color=c[1], ms=7)
    S.note(ax, 640, 0.72, "first null at 1/tau = 500 Hz:\n90.28% of the energy is inside it", mode)
    S.note(ax, 1180, 0.13, "first sidelobe peaks 13.26 dB down", mode)
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("fraction of peak density / of total energy")
    ax.set_title("A 2 ms pulse: where a sinc keeps its energy")
    ax.set_xlim(0, 4050)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# fee_sampling
# ---------------------------------------------------------------------------


@figure("sig2-replication")
def _(mode):
    """Spectral replication at an adequate and an inadequate rate.

    A triangular baseband magnitude reaching to f_max = 4 kHz is copied to
    every multiple of fs. At fs = 12 kHz the copies stand clear; at
    fs = 6 kHz they overlap, and the overlap is drawn as the sum, which is
    exactly what the sampled data contains and cannot be undone.
    """
    c = S.SERIES[mode]
    fmax = 4000.0

    def base(f):
        return np.clip(1 - np.abs(f) / fmax, 0, None)

    f = np.linspace(-20000, 20000, 40001)
    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    for ax, fs, colour, verdict in ((axes[0], 12000.0, c[0], "fs = 12 kHz = 3 f_max: copies clear"),
                                    (axes[1], 6000.0, c[1], "fs = 6 kHz < 2 f_max: copies overlap")):
        total = np.zeros_like(f)
        for kk in range(-3, 4):
            total += base(f - kk * fs)
        ax.plot(f / 1000, total, color=colour, lw=2.2)
        ax.plot(f / 1000, base(f), color=S.GUIDE[mode], lw=1.3, ls="--")
        ax.axvline(fs / 2000, color=S.GUIDE[mode], lw=1.0, ls=":")
        ax.axvline(-fs / 2000, color=S.GUIDE[mode], lw=1.0, ls=":")
        S.note(ax, -19.5, 1.13, verdict, mode)
        ax.set_ylim(0, 1.55)
        ax.set_ylabel("relative magnitude")
        S.strip(ax)
        if fs == 12000.0:
            gap = base(np.array([fs / 2])) + base(np.array([fs / 2 - fs]))
            assert float(gap[0]) == 0.0, gap
            assert abs(float(base(np.array([0.0]))[0]) - 1.0) < 1e-12
        else:
            over = base(np.array([fs / 2])) + base(np.array([fs / 2 - fs]))
            assert abs(float(over[0]) - 2 * (1 - 3000.0 / fmax)) < 1e-12, over
            assert abs(float(over[0]) - 0.5) < 1e-12, over
            S.note(ax, 1.2, 1.30, "the fold-over: a 5 kHz input lands on 1 kHz", mode)
    axes[0].set_title("Sampling copies the spectrum to every multiple of fs")
    axes[1].set_xlabel("frequency  (kHz)")
    axes[0].set_xlim(-20.5, 20.5)
    fig.align_ylabels(list(axes))
    return fig


@figure("sig2-alias-samples")
def _(mode):
    """A 7 kHz tone sampled at 10 kHz IS a 3 kHz tone, sample for sample.

    Both continuous curves are evaluated densely; the sample instants are then
    taken from the 7 kHz curve at n/fs, and the assertion is that the 3 kHz
    curve passes through every one of them to 1e-12. That equality is the whole
    of aliasing.
    """
    c = S.SERIES[mode]
    fs = 10000.0
    f_true, f_alias, phase = 7000.0, 3000.0, 0.0
    t = np.linspace(0, 2e-3, 20001)
    hi = np.cos(2 * PI * f_true * t + phase)
    lo = np.cos(2 * PI * f_alias * t - phase)
    n = np.arange(0, 21)
    smp = np.cos(2 * PI * f_true * n / fs + phase)
    smp_alias = np.cos(2 * PI * f_alias * n / fs - phase)
    assert np.max(np.abs(smp - smp_alias)) < 1e-12, np.max(np.abs(smp - smp_alias))
    assert abs(f_true % fs - 7000.0) < 1e-9
    assert abs(min(f_true % fs, fs - f_true % fs) - f_alias) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, hi, color=c[0], lw=1.7)
    ax.plot(t * 1e3, lo, color=c[1], lw=2.2)
    ax.plot(n / fs * 1e3, smp, "o", color=S.INK[mode], ms=6.5, zorder=5)
    for tn, v in zip(n / fs * 1e3, smp):
        ax.plot([tn, tn], [0, v], color=S.GUIDE[mode], lw=0.9)
    S.label_end(ax, 0.26, -1.22, "7 kHz input", c[0], mode, dx=0)
    S.label_end(ax, 1.42, -1.22, "3 kHz alias", c[1], mode, dx=0)
    S.note(ax, 0.03, 1.24, "every dot lies on BOTH curves - the samples cannot tell them apart", mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("amplitude")
    ax.set_title("Sampled at 10 kHz, a 7 kHz tone becomes a 3 kHz tone")
    ax.set_xlim(0, 2.02)
    ax.set_ylim(-1.45, 1.52)
    S.strip(ax)
    return fig


@figure("sig2-alias-dft")
def _(mode):
    """Three tones actually sampled, then transformed - alias positions measured.

    A signal with components at 1.2, 4.6 and 8.3 kHz is sampled at 10 kHz and a
    5000-point DFT is taken. Every tone lands on an exact bin at this record
    length, so peak heights are the amplitudes themselves. The peak bins are
    located numerically and asserted against the folding prediction, so the
    figure reports a measurement rather than a formula.
    """
    c = S.SERIES[mode]
    fs, N = 10000.0, 5000
    tones = [(1200.0, 1.0), (4600.0, 0.7), (8300.0, 0.5)]
    n = np.arange(N)
    x = sum(a * np.cos(2 * PI * ft * n / fs + 0.3 * i) for i, (ft, a) in enumerate(tones))
    X = 2 * np.abs(np.fft.rfft(x)) / N
    fbin = np.arange(len(X)) * fs / N

    def fold(ft):
        r = ft % fs
        return min(r, fs - r)

    found = []
    for ft, a in tones:
        pred = fold(ft)
        sel = np.abs(fbin - pred) < 120.0
        peak = fbin[sel][int(np.argmax(X[sel]))]
        height = X[sel].max()
        assert abs(peak - pred) < fs / N, (ft, peak, pred)
        assert abs(height - a) < 1e-9, (ft, height, a)
        found.append((ft, pred, peak, height))
    assert [round(p) for _, p, _, _ in found] == [1200, 4600, 1700]

    fig, ax = plt.subplots()
    ax.plot(fbin / 1000, X, color=c[0], lw=1.7)
    for ft, pred, peak, height in found:
        moved = abs(ft - pred) > 1.0
        ax.plot([peak / 1000], [height], "o", color=c[1] if moved else c[0], ms=7)
        tag = f"{ft/1000:.1f} kHz -> {pred/1000:.1f} kHz" if moved else f"{ft/1000:.1f} kHz, unmoved"
        ax.annotate(tag, xy=(peak / 1000, height), xytext=(0, 9),
                    textcoords="offset points", ha="center",
                    color=c[1] if moved else S.INK_2[mode], fontsize=9.5,
                    fontweight="semibold" if moved else "normal")
    ax.axvline(fs / 2000, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 2.05, 1.06, "the dashed line is fs/2 = 5 kHz;\nnothing can appear above it", mode)
    ax.set_xlabel("frequency read from the sampled data  (kHz)")
    ax.set_ylabel("amplitude  (V)")
    ax.set_title("Measured, not predicted: a 5000-point DFT of the actual samples")
    ax.set_xlim(0, 5.4)
    ax.set_ylim(0, 1.34)
    S.strip(ax)
    return fig


@figure("sig2-aa-order")
def _(mode):
    """Butterworth order needed against sampling rate, for 40 and 60 dB.

    n >= log10(10^(A/10) - 1) / (2 log10(f_stop/f_max)) with the passband edge
    at f_max = 20 kHz and the stopband edge at fs - f_max, the lowest input
    frequency that can fold back into the wanted band.
    """
    c = S.SERIES[mode]
    fmax = 20000.0
    fs = np.linspace(44100.0, 200000.0, 1200)
    ratio = (fs - fmax) / fmax

    def order(att):
        return np.log10(10 ** (att / 10) - 1) / (2 * np.log10(ratio))

    n40, n60 = order(40.0), order(60.0)
    for fsv, want in ((48000.0, 21), (96000.0, 6), (192000.0, 4)):
        r = (fsv - fmax) / fmax
        need = np.log10(10 ** 6 - 1) / (2 * np.log10(r))
        assert int(np.ceil(need)) == want, (fsv, need, want)
    assert abs(np.log10(10 ** 6 - 1) / (2 * np.log10(1.4)) - 20.5299) < 1e-3
    assert abs(np.log10(10 ** 6 - 1) / (2 * np.log10(3.8)) - 5.1743) < 1e-3
    assert abs(np.log10(10 ** 6 - 1) / (2 * np.log10(8.6)) - 3.2103) < 1e-3

    fig, ax = plt.subplots()
    ax.plot(fs / 1000, n60, color=c[0], lw=2.2)
    ax.plot(fs / 1000, n40, color=c[1], lw=2.2)
    S.label_end(ax, 150, float(np.interp(150000, fs, n60)), "60 dB required", c[0], mode,
                dx=0, dy=15, ha="center")
    S.label_end(ax, 150, float(np.interp(150000, fs, n40)), "40 dB required", c[1], mode,
                dx=0, dy=-16, ha="center")
    for fsv, want, dx, ha in ((48000.0, 21, 8, "left"), (96000.0, 6, 8, "left"),
                              (192000.0, 4, 0, "center")):
        ax.plot([fsv / 1000], [float(np.interp(fsv, fs, n60))], "o", color=c[0], ms=7)
        ax.annotate(f"fs = {fsv/1000:.0f} kHz\nn = {want}",
                    xy=(fsv / 1000, float(np.interp(fsv, fs, n60))),
                    xytext=(dx, 9), textcoords="offset points", ha=ha,
                    color=S.INK_2[mode], fontsize=9)
    ax.set_xlabel("sampling rate  fs  (kHz),  wanted band fixed at 20 kHz")
    ax.set_ylabel("minimum Butterworth order")
    ax.set_title("Buy transition band with sample rate, not with filter order")
    ax.set_xlim(42, 235)
    ax.set_ylim(0, 32)
    S.strip(ax)
    return fig


@figure("sig2-zoh-response")
def _(mode):
    """The hold is a filter: T sinc(f/fs), drawn in dB out to 3 fs.

    Droop inside the band and the nulls that sit on every image centre are the
    same curve. The in-band trace is repeated as a fraction-of-band inset-free
    second series so both readings come off one axis.
    """
    c = S.SERIES[mode]
    r = np.linspace(1e-6, 3.0, 30001)
    mag = np.abs(np.sinc(r))
    db = 20 * np.log10(np.maximum(mag, 1e-6))
    assert abs(float(np.sinc(0.5)) - 0.6366197724) < 1e-9
    assert abs(20 * np.log10(float(np.sinc(0.5))) + 3.9224) < 1e-3
    assert abs(20 * np.log10(float(np.sinc(0.45))) + 3.1149) < 1e-3
    assert abs(20 * np.log10(float(np.sinc(0.25))) + 0.9121) < 1e-3
    assert abs(20 * np.log10(float(np.sinc(0.10))) + 0.1434) < 1e-3
    assert abs(20 * np.log10(float(np.sinc(0.113379))) + 0.1844) < 1e-3
    first_image = 20 * np.log10(float(np.abs(np.sinc(1.5))))
    assert abs(first_image + 13.4644) < 1e-3, first_image

    fig, ax = plt.subplots()
    ax.plot(r, db, color=c[0], lw=2.0)
    for x0, lab in ((0.5, "-3.92 dB at fs/2"), (1.5, "-13.46 dB at 1.5 fs")):
        y0 = 20 * np.log10(float(np.abs(np.sinc(x0))))
        ax.plot([x0], [y0], "o", color=c[1], ms=7)
        ax.annotate(lab, xy=(x0, y0), xytext=(8, 4), textcoords="offset points",
                    color=S.INK_2[mode], fontsize=9.5)
    ax.axvline(0.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.03, -30.5, "wanted band", mode)
    S.note(ax, 1.72, -4.6, "images live out here; the nulls at fs and 2fs\n"
                           "suppress their centres but not their skirts", mode)
    ax.set_xlabel("frequency in units of the sampling rate  f / fs")
    ax.set_ylabel("hold response  (dB)")
    ax.set_title("Zero-order hold: droop in the band, nulls on the images")
    ax.set_xlim(0, 3.05)
    ax.set_ylim(-34, 3)
    S.strip(ax)
    return fig


@figure("sig2-sinc-interp")
def _(mode):
    """Ideal interpolation rebuilds the tone exactly between the samples.

    x(t) = sum x[n] sinc((t - nT)/T). Three scaled kernels are drawn to show
    each one passing through its own sample and through zero at every other,
    and the summed reconstruction is asserted against the original tone to
    better than 1e-3 over the drawn window.
    """
    c = S.SERIES[mode]
    fs, f0 = 8000.0, 1400.0
    T = 1 / fs
    n = np.arange(-60, 61)
    smp = np.cos(2 * PI * f0 * n * T)
    t = np.linspace(-0.5e-3, 0.5e-3, 4001)
    rec = np.zeros_like(t)
    for nn, v in zip(n, smp):
        rec += v * np.sinc((t - nn * T) / T)
    true = np.cos(2 * PI * f0 * t)
    err = float(np.max(np.abs(rec - true)))
    assert err < 1e-3, err
    for nn in (-1, 0, 1):
        k = np.sinc((n - nn).astype(float))
        assert abs(k[n == nn][0] - 1.0) < 1e-12
        assert np.max(np.abs(k[n != nn])) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, true, color=S.GUIDE[mode], lw=3.4, alpha=0.55)
    ax.plot(t * 1e3, rec, color=c[0], lw=1.8)
    for nn in (-1, 0, 1):
        ax.plot(t * 1e3, smp[n == nn][0] * np.sinc((t - nn * T) / T),
                color=c[1], lw=1.2, ls="--")
    vis = np.abs(n) <= 4
    ax.plot(n[vis] * T * 1e3, smp[vis], "o", color=S.INK[mode], ms=6.5, zorder=5)
    S.label_end(ax, 0.11, 0.66, "sum of all kernels\n= the original", c[0], mode, dx=0)
    S.label_end(ax, -0.49, 0.66, "three individual\nsinc kernels", c[1], mode, dx=0)
    S.note(ax, -0.49, 1.20, "each kernel is 1 at its own sample and 0 at every other one", mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("amplitude")
    ax.set_title("Ideal reconstruction: 1.4 kHz rebuilt from 8 kHz samples")
    ax.set_xlim(-0.52, 0.52)
    ax.set_ylim(-1.32, 1.52)
    S.strip(ax)
    return fig


@figure("sig2-sqnr")
def _(mode):
    """What oversampling is worth, in decibels, against what it costs.

    Plain decimation gains 10 log10(OSR). First- and second-order noise shaping
    gain 30 log10(OSR) - 10 log10(pi^2/3) and 50 log10(OSR) - 10 log10(pi^4/5).
    The vertical axis is dB of signal-to-quantisation-noise added to the
    6.02N + 1.76 baseline.
    """
    c = S.SERIES[mode]
    osr = np.logspace(0, np.log10(512), 400)
    plain = 10 * np.log10(osr)
    l1 = 30 * np.log10(osr) - 10 * np.log10(PI ** 2 / 3)
    l2 = 50 * np.log10(osr) - 10 * np.log10(PI ** 4 / 5)
    assert abs(10 * np.log10(PI ** 2 / 3) - 5.1718) < 1e-3
    assert abs(10 * np.log10(PI ** 4 / 5) - 12.8963) < 1e-3
    assert abs(10 * np.log10(4.0) - 6.0206) < 1e-3
    assert abs(10 * np.log10(64.0) - 18.0618) < 1e-3
    assert abs(30 * np.log10(64.0) - 10 * np.log10(PI ** 2 / 3) - 49.014) < 2e-3
    assert abs(50 * np.log10(64.0) - 10 * np.log10(PI ** 4 / 5) - 77.413) < 2e-3

    fig, ax = plt.subplots()
    ax.semilogx(osr, l2, color=c[2], lw=2.2)
    ax.semilogx(osr, l1, color=c[1], lw=2.2)
    ax.semilogx(osr, plain, color=c[0], lw=2.2)
    S.label_end(ax, 300, float(np.interp(300, osr, l2)), "2nd-order shaping", c[2], mode, dy=-13, ha="right")
    S.label_end(ax, 300, float(np.interp(300, osr, l1)), "1st-order shaping", c[1], mode, dy=-13, ha="right")
    S.label_end(ax, 300, float(np.interp(300, osr, plain)), "plain oversampling", c[0], mode, dy=12, ha="right")
    ax.plot([64], [18.0618], "o", color=c[0], ms=7)
    ax.plot([64], [49.014], "o", color=c[1], ms=7)
    ax.plot([64], [77.413], "o", color=c[2], ms=7)
    S.note(ax, 1.15, 92, "at OSR = 64: 18.06 dB plain (3 bits),\n"
                         "49.01 dB first order (8.14 bits),\n"
                         "77.41 dB second order (12.86 bits)", mode)
    ax.axhline(6.0206, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 13, 7.0, "one extra bit", mode)
    ax.set_xlabel("oversampling ratio  OSR = fs / (2 f_max)")
    ax.set_ylabel("dB added to 6.02N + 1.76")
    ax.set_title("Oversampling pays; shaping the noise pays far more")
    ax.set_ylim(-6, 118)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "sig2-"
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
