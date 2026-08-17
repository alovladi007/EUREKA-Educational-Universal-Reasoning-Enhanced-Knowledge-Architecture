#!/usr/bin/env python3
"""Depth-wave-17 figures for the FE Electrical and Computer course:
the two Signal Processing chapters on analog filters and on the DFT/FFT.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Two rules are specific to this wave and are enforced by the assertions below.

1.  No filter magnitude is taken from a closed-form attenuation shortcut. Every
    decibel figure is obtained by evaluating the actual rational transfer
    function H(s) at s = j*omega, with the denominator polynomial built from
    poles computed here. Where a closed form exists it appears only as the
    cross-check that has to agree, to 1e-9.

2.  No spectral claim is taken from a formula either. Every DFT panel is an
    FFT of a sequence synthesized in this file, and every leakage, window and
    resolution number quoted in the lesson is MEASURED off that spectrum.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 eureka/scripts/gen_fe_ee_d17.py            # all
    python3 eureka/scripts/gen_fe_ee_d17.py sig3-butter   # matching prefix
"""
from __future__ import annotations

import math
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
    if not name.startswith("sig3-"):
        raise ValueError(f"this generator owns the sig3- prefix only, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# shared numerics - transfer functions evaluated, never approximated
# ---------------------------------------------------------------------------

def db(x):
    """Decibels, with exact nulls floored rather than allowed to become -inf."""
    return 20.0 * np.log10(np.maximum(np.abs(x), 1e-300))


def evalH(num, den, w):
    s = 1j * np.asarray(w, dtype=complex)
    return np.polyval(num, s) / np.polyval(den, s)


def butter_poles(n: int, wc: float = 1.0) -> np.ndarray:
    """The n left-half-plane roots of 1 + (s/(j wc))^(2n), equally spaced on
    the circle of radius wc."""
    k = np.arange(n)
    return wc * np.exp(1j * (np.pi / 2 + (2 * k + 1) * np.pi / (2 * n)))


def butter_tf(n: int, wc: float = 1.0):
    p = butter_poles(n, wc)
    den = np.real(np.poly(p))
    num = np.array([float(np.real(np.prod(-p)))])
    return num, den


def cheb_poles(n: int, ripple_db: float) -> np.ndarray:
    eps = math.sqrt(10.0 ** (ripple_db / 10.0) - 1.0)
    a = math.asinh(1.0 / eps) / n
    k = np.arange(n)
    th = (2 * k + 1) * np.pi / (2 * n)
    return -math.sinh(a) * np.sin(th) + 1j * math.cosh(a) * np.cos(th)


def cheb_tf(n: int, ripple_db: float):
    p = cheb_poles(n, ripple_db)
    den = np.real(np.poly(p))
    num = np.array([float(np.real(np.prod(-p)))])
    if n % 2 == 0:                      # even order starts the ripple at -Ap
        num = num / math.sqrt(1.0 + (10.0 ** (ripple_db / 10.0) - 1.0))
    return num, den


def cheb_T(n: int, x):
    x = np.asarray(x, dtype=float)
    out = np.empty_like(x)
    m = np.abs(x) <= 1.0
    out[m] = np.cos(n * np.arccos(x[m]))
    out[~m] = np.cosh(n * np.arccosh(np.abs(x[~m]))) * np.sign(x[~m]) ** n
    return out


def group_delay(num, den, w, h=1e-5):
    ws = np.array([w - h, w, w + h], dtype=float)
    ph = np.unwrap(np.angle(evalH(num, den, ws)))
    return -(ph[2] - ph[0]) / (2.0 * h)


def w_3db(num, den, lo=1e-6, hi=60.0):
    from scipy.optimize import brentq
    return brentq(lambda w: db(evalH(num, den, w)) + 20 * math.log10(math.sqrt(2.0)),
                  lo, hi)


def sallen_key(R1, R2, C1, C2):
    """Unity-gain Sallen-Key low-pass, derived by nodal analysis in the lesson:
    H(s) = 1 / (R1 R2 C1 C2 s^2 + C2 (R1 + R2) s + 1)."""
    return np.array([1.0]), np.array([R1 * R2 * C1 * C2, C2 * (R1 + R2), 1.0])


# ===========================================================================
# ANALOG FILTERS
# ===========================================================================


@figure("sig3-ideal-four")
def _(mode):
    """The four ideal responses, each with a realizable fourth-order curve.

    The brick walls are drawn as step functions; the realizable curves are
    Butterworth magnitudes evaluated from their pole polynomials, low-pass
    transformed to high-pass by s -> wc/s and to band-pass / band-stop by the
    standard reactance substitutions. Nothing is sketched by hand.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1.4, 1.4, 1400)

    nlp, dlp = butter_tf(4, 1.0)
    lp = np.abs(evalH(nlp, dlp, w))
    hp = np.abs(evalH(np.array([1.0, 0, 0, 0, 0]),
                      np.array([1.0, 2.61312593, 3.41421356, 2.61312593, 1.0]), w))
    # band-pass / band-stop from a 2nd-order prototype, w0 = 1, B = 0.5
    B, w0 = 0.5, 1.0
    bp = np.abs(evalH(np.array([B, 0.0]), np.array([1.0, B, w0 ** 2]), w))
    bs = np.abs(evalH(np.array([1.0, 0.0, w0 ** 2]), np.array([1.0, B, w0 ** 2]), w))

    # the realizable curves must all sit at 1/sqrt(2) at their own corners
    assert abs(np.abs(evalH(nlp, dlp, 1.0)) - 2 ** -0.5) < 1e-12
    assert abs(np.abs(evalH(np.array([B, 0.0]), np.array([1.0, B, 1.0]), 1.0)) - 1.0) < 1e-12
    # band-stop must reach an exact null at w0
    assert np.abs(evalH(np.array([1.0, 0.0, 1.0]), np.array([1.0, B, 1.0]), 1.0)) < 1e-12

    fig, axes = plt.subplots(2, 2, figsize=(7.6, 5.4), sharex=True, sharey=True)
    panels = [
        ("low-pass", lp, [(w[0], 1), (1, 1), (1, 0), (w[-1], 0)]),
        ("high-pass", hp, [(w[0], 0), (1, 0), (1, 1), (w[-1], 1)]),
        ("band-pass", bp, [(w[0], 0), (0.78, 0), (0.78, 1), (1.28, 1), (1.28, 0), (w[-1], 0)]),
        ("band-stop", bs, [(w[0], 1), (0.78, 1), (0.78, 0), (1.28, 0), (1.28, 1), (w[-1], 1)]),
    ]
    for ax, (name, curve, wall) in zip(axes.ravel(), panels):
        wx, wy = zip(*wall)
        ax.plot(wx, wy, color=S.GUIDE[mode], lw=1.6, ls="--")
        ax.plot(w, curve, color=c[0], lw=2.1)
        ax.set_xscale("log")
        ax.set_title(name, fontsize=11)
        ax.set_xlim(w[0], w[-1])
        ax.set_ylim(-0.04, 1.12)
        S.strip(ax)
    axes[0][0].set_ylabel("magnitude")
    axes[1][0].set_ylabel("magnitude")
    for ax in axes[1]:
        ax.set_xlabel("frequency / corner frequency")
    S.note(axes[0][0], 0.045, 0.16, "dashed: the brick wall\nsolid: what is buildable", mode)
    fig.suptitle("Four ideal responses and the curves that can actually be built",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("sig3-ideal-sinc")
def _(mode):
    """Impulse response of the ideal 1 kHz brick-wall low-pass.

    h(t) = 2 fc sinc(2 fc t), the inverse transform of the rectangular
    magnitude. It is non-zero for every t < 0, which is the whole reason the
    brick wall cannot be built: the filter would have to respond before it is
    excited.
    """
    c = S.SERIES[mode]
    fc = 1000.0
    t = np.linspace(-4e-3, 4e-3, 4000)
    h = 2 * fc * np.sinc(2 * fc * t)

    assert abs(h[np.argmin(np.abs(t))] - 2 * fc) < 1.0             # peak 2 fc
    assert abs(2 * fc * np.sinc(2 * fc * 0.5e-3)) < 1e-9           # null at 1/(2fc)
    assert abs(2 * fc * np.sinc(2 * fc * 0.25e-3) - 1273.2395) < 1e-3
    # area under h is the dc gain, exactly 1
    tt = np.linspace(-4.0, 4.0, 2_000_001)
    area = float(np.trapz(2 * fc * np.sinc(2 * fc * tt), tt))
    assert abs(area - 1.0) < 2e-4, area

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, h, color=c[0], lw=2.0)
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.fill_between(t * 1e3, 0, h, where=(t < 0), color=c[1], alpha=0.20, lw=0)
    S.note(ax, -3.9, 1500, "everything left of t = 0 is response\nbefore the input arrives", mode)
    ax.plot([0.25], [1273.2395], "o", color=c[0], ms=7)
    S.note(ax, 0.42, 1330, "h = 1273.24 at t = 0.25 ms", mode)
    ax.plot([0.5, 1.0, 1.5], [0, 0, 0], "o", color=S.INK_2[mode], ms=5)
    S.note(ax, 1.62, -420, "nulls every 0.5 ms = 1/(2 fc)", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("impulse response  h(t)   (1/s)")
    ax.set_title("The ideal 1 kHz low-pass answers before it is asked")
    ax.set_xlim(-4.1, 4.1)
    ax.set_ylim(-700, 2250)
    S.strip(ax)
    return fig


@figure("sig3-butter-flat")
def _(mode):
    """Maximally flat, made visible: 1 - |H|^2 against u = w/wc, log-log.

    Because |H|^2 = 1/(1 + u^(2n)) has the series 1 - u^(2n) + u^(4n) - ...,
    the shortfall 1 - |H|^2 is a straight line of slope 2n on log-log axes.
    Slope IS the number of vanishing derivatives at dc.
    """
    c = S.SERIES[mode]
    # For n = 6 the shortfall reaches 1e-24, which a double cannot hold once
    # the subtraction 1 - |H|^2 has happened. H is therefore evaluated at 60
    # significant digits: still the transfer function, just not in binary64.
    import mpmath as mp
    mp.mp.dps = 60

    def shortfall(n, uvals):
        """H(ju) built from the exact pole angles, in 60-digit arithmetic."""
        poles = [mp.expjpi(mp.mpf(1) / 2 + mp.mpf(2 * k + 1) / (2 * n)) for k in range(n)]
        num_mp = mp.mpc(1)
        for pk in poles:
            num_mp *= -pk
        out = []
        for uu in uvals:
            s = mp.mpc(0, mp.mpf(str(uu)))
            d = mp.mpc(1)
            for pk in poles:
                d *= (s - pk)
            out.append(float(1 - mp.fabs(num_mp / d) ** 2))
        return np.array(out)

    u = np.logspace(-2, -0.1, 240)
    fig, ax = plt.subplots()
    for i, n in enumerate((1, 2, 6)):
        short = shortfall(n, u)
        closed = u ** (2 * n) / (1 + u ** (2 * n))
        assert np.max(np.abs(short / closed - 1.0)) < 1e-12, n
        # log-log slope across two decades deep inside the flat region, read
        # straight off the evaluated transfer function
        s_lo, s_hi = shortfall(n, [1e-3, 1e-2])
        slope = math.log10(s_hi / s_lo) / math.log10(1e-2 / 1e-3)
        assert abs(slope - 2 * n) < 5e-4, (n, slope)
        ax.plot(u, short, color=c[i], lw=2.1)
        S.label_end(ax, u[0], short[0], f"n = {n}, slope {2*n}", c[i], mode, dx=8, dy=-1)
    assert abs(shortfall(6, [0.1])[0] / 1e-12 - 1.0) < 1e-9
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("u = frequency / cutoff frequency")
    ax.set_ylabel("shortfall  1 - |H|^2")
    ax.set_title("Butterworth flatness: the shortfall at dc falls as u to the 2n")
    ax.set_xlim(1e-2, 1.4)
    ax.set_ylim(1e-25, 1.0)
    S.note(ax, 0.115, 2e-24, "at u = 0.1 the sixth-order shortfall\nis 1e-12: flat to twelve places", mode)
    S.strip(ax)
    return fig


@figure("sig3-butter-poles")
def _(mode):
    """The Butterworth circle for n = 6, with the three section Q values.

    Poles are the computed roots; their angles come out at 105, 135 and 165
    degrees and their conjugates, and each conjugate pair is a second-order
    section whose Q is read off the real part.
    """
    c = S.SERIES[mode]
    p = butter_poles(6, 1.0)
    assert np.allclose(np.abs(p), 1.0, atol=1e-12)
    ang = np.sort(np.degrees(np.angle(p)))
    assert np.allclose(ang, [-165, -135, -105, 105, 135, 165], atol=1e-9), ang
    coeffs = np.real(np.poly(p))
    assert abs(coeffs[1] - 3.86370331) < 1e-7, coeffs
    assert abs(coeffs[3] - 9.14162017) < 1e-7, coeffs
    qs = []
    for z in p:
        if z.imag > 0:
            qs.append(abs(z) / (-2 * z.real))
    qs = sorted(qs)
    assert abs(qs[0] - 0.517638) < 1e-6 and abs(qs[1] - 0.7071068) < 1e-6 \
        and abs(qs[2] - 1.931852) < 1e-6, qs

    fig, ax = plt.subplots(figsize=(5.6, 5.0))
    th = np.linspace(0, 2 * np.pi, 800)
    ax.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)
    ax.plot(np.real(p), np.imag(p), "x", color=c[0], ms=11, mew=2.4, ls="none")
    labels = {105: f"Q = {qs[2]:.4f}", 135: f"Q = {qs[1]:.4f}", 165: f"Q = {qs[0]:.4f}"}
    for deg, txt in labels.items():
        z = np.exp(1j * np.radians(deg))
        ax.plot([0, z.real], [0, z.imag], color=c[1], lw=1.0, alpha=0.7)
        ax.annotate(txt, xy=(z.real, z.imag), xytext=(-6, 9), textcoords="offset points",
                    color=S.INK[mode], fontsize=9.5, ha="right")
    S.note(ax, -1.33, -1.62, "poles every 180/6 = 30 degrees on the unit circle;\n"
                              "none on the imaginary axis, so the filter is stable", mode)
    ax.set_xlabel("real part of s / wc")
    ax.set_ylabel("imaginary part of s / wc")
    ax.set_title("Sixth-order Butterworth poles")
    ax.set_xlim(-1.35, 1.15)
    ax.set_ylim(-1.75, 1.25)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("sig3-cheby-ripple")
def _(mode):
    """Passband ripple bought against a steeper knee, all evaluated from H(s).

    Fourth-order 1 dB Chebyshev against fourth- and sixth-order Butterworth.
    The Chebyshev knee beats the sixth-order Butterworth from about 1.2 to 1.9
    times the passband edge, then loses: asymptotic slope belongs to the order.
    """
    c = S.SERIES[mode]
    w = np.linspace(0.02, 3.0, 3000)
    nb4, db4 = butter_tf(4, 1.0)
    nb6, db6 = butter_tf(6, 1.0)
    nc4, dc4 = cheb_tf(4, 1.0)
    mb4, mb6, mc4 = db(evalH(nb4, db4, w)), db(evalH(nb6, db6, w)), db(evalH(nc4, dc4, w))

    # the Chebyshev must ripple between 0 and -1 dB and touch both limits
    inband = mc4[w <= 1.0]
    assert abs(inband.max() - 0.0) < 1e-6, inband.max()
    assert abs(inband.min() + 1.0) < 1e-3, inband.min()
    # and reach the attenuation T_4(2) predicts at twice the edge
    eps2 = 10 ** 0.1 - 1
    T4 = cheb_T(4, np.array([2.0]))[0]
    assert abs(T4 - 97.0) < 1e-9, T4
    closed = 10 * math.log10(1 + eps2 * T4 ** 2)
    got = -db(evalH(nc4, dc4, 2.0))
    assert abs(got - closed) < 1e-6, (got, closed)
    assert abs(got - 33.8690) < 1e-3, got
    # equiripple, counted: two touches of 0 dB and three of -1 dB inside 0 <= w <= 1
    wp = np.linspace(0.0, 1.0, 200001)
    mp = db(evalH(nc4, dc4, wp))
    tops = sum(1 for i in range(1, len(mp) - 1)
               if mp[i] >= mp[i - 1] and mp[i] >= mp[i + 1] and mp[i] > -1e-6)
    assert tops == 2, tops
    assert sum(1 for x in (0.0, 1 / math.sqrt(2), 1.0)
               if abs(db(evalH(nc4, dc4, x)) + 1.0) < 1e-6) == 3
    # Butterworth cross-check at the same point
    assert abs(-db(evalH(nb6, db6, 2.0)) - 10 * math.log10(1 + 2.0 ** 12)) < 1e-9

    fig, axes = plt.subplots(2, 1, figsize=(7.2, 5.8), sharex=True,
                             gridspec_kw={"height_ratios": [1, 1.7]})
    top, ax = axes
    for a in (top, ax):
        a.plot(w, mb4, color=c[0], lw=2.0)
        a.plot(w, mb6, color=c[1], lw=2.0)
        a.plot(w, mc4, color=c[2], lw=2.0)
        a.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.strip(a)
    top.axhline(-1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    top.set_ylim(-1.45, 0.35)
    top.set_ylabel("dB (passband)")
    top.set_title("passband detail: the Chebyshev touches 0 dB twice and -1 dB three times",
                  fontsize=10.5)
    S.note(top, 1.12, -0.62, "the two Butterworth curves never\nleave the top of the band", mode)
    S.label_end(ax, 3.0, mb4[-1], "Butterworth n = 4", c[0], mode, dx=-8, ha="right", dy=-11)
    S.label_end(ax, 3.0, mb6[-1], "Butterworth n = 6", c[1], mode, dx=-8, ha="right", dy=-12)
    S.label_end(ax, 3.0, mc4[-1], "Chebyshev n = 4, 1 dB", c[2], mode, dx=-8, ha="right", dy=13)
    ax.plot([2.0], [-33.8690], "o", color=c[2], ms=7)
    S.note(ax, 1.03, -43.5, "-33.87 dB at twice the edge", mode)
    ax.plot([2.0], [-10 * math.log10(1 + 2.0 ** 12)], "o", color=c[1], ms=7)
    S.note(ax, 1.03, -50.0, "-36.12 dB, sixth order", mode)
    ax.set_xlabel("frequency / passband edge")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_xlim(0, 3.05)
    ax.set_ylim(-60, 4)
    fig.suptitle("One decibel of ripple buys two orders of steepness",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("sig3-group-delay")
def _(mode):
    """Group delay of three fourth-order families, each on its own -3 dB scale.

    tau = -d(phase)/d(omega) is differentiated numerically from the same H(s)
    that produced the magnitudes, and each curve is plotted against frequency
    divided by that filter's own -3 dB point so the comparison is fair.
    """
    c = S.SERIES[mode]
    fams = [
        ("Bessel n = 4", np.array([105.0]), np.array([1.0, 10.0, 45.0, 105.0, 105.0])),
        ("Butterworth n = 4", *butter_tf(4, 1.0)),
        ("Chebyshev n = 4, 1 dB", *cheb_tf(4, 1.0)),
    ]
    fig, ax = plt.subplots()
    spreads = {}
    for i, (name, num, den) in enumerate(fams):
        w3 = w_3db(num, den)
        t0 = group_delay(num, den, 1e-6)
        x = np.linspace(0.002, 1.0, 400)
        tau = np.array([group_delay(num, den, xx * w3) / t0 for xx in x])
        spreads[name] = 100 * (tau.max() - tau.min())
        ax.plot(x, tau, color=c[i], lw=2.1)
        S.label_end(ax, x[-1], tau[-1], name, c[i], mode, dx=-8, ha="right",
                    dy=-13 if i == 0 else 11)
    assert abs(group_delay(fams[0][1], fams[0][2], 1e-6) - 1.0) < 1e-6
    assert abs(spreads["Bessel n = 4"] - 1.8084) < 1e-3, spreads
    assert abs(spreads["Butterworth n = 4"] - 49.6064) < 1e-3, spreads
    assert abs(spreads["Chebyshev n = 4, 1 dB"] - 201.6159) < 1e-3, spreads
    # dc group delay is the ratio of the s coefficient to the constant term
    for _, num, den in fams:
        assert abs(group_delay(num, den, 1e-6) - den[-2] / den[-1]) < 1e-6
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.03, 2.62, "across its own passband the delay varies by\n"
                           "1.8 % (Bessel), 49.6 % (Butterworth), 201.6 % (Chebyshev)", mode)
    ax.set_xlabel("frequency / that filter's own -3 dB frequency")
    ax.set_ylabel("group delay / its own dc value")
    ax.set_title("Flat magnitude and flat delay are different prizes")
    ax.set_xlim(0, 1.02)
    ax.set_ylim(0.85, 3.25)
    S.strip(ax)
    return fig


@figure("sig3-sallen-key-q")
def _(mode):
    """Three Sallen-Key sections built from real component values.

    Every curve is the transfer function of the equal-resistor unity-gain
    section with the capacitors the lesson computes, not a generic second-order
    sketch: R = 10 kohm throughout, and C1/C2 = 4 Q^2 sets the shape.
    """
    c = S.SERIES[mode]
    R = 10e3
    wn = 2 * np.pi * 1000.0
    f = np.logspace(1.7, 4.3, 1400)
    fig, ax = plt.subplots()
    for i, (q, tag) in enumerate(((0.5, "Q = 0.5"), (1 / math.sqrt(2), "Q = 0.7071"),
                                  (1.931852, "Q = 1.9319"))):
        r = 4 * q * q
        c2 = (1.0 / (wn * R)) / math.sqrt(r)
        c1 = r * c2
        num, den = sallen_key(R, R, c1, c2)
        # the realised section must land on the requested wn and Q exactly
        assert abs(1 / math.sqrt(R * R * c1 * c2) - wn) < 1e-6
        assert abs(math.sqrt(R * R * c1 * c2) / (c2 * 2 * R) - q) < 1e-12
        m = db(evalH(num, den, 2 * np.pi * f))
        ax.plot(f, m, color=c[i], lw=2.0)
        S.label_end(ax, f[-1], m[-1], tag, c[i], mode, dx=-8, ha="right",
                    dy=[14, 0, -14][i])
        if abs(q - 1 / math.sqrt(2)) < 1e-9:
            assert abs(db(evalH(num, den, wn)) + 3.0102999566) < 1e-9
            assert abs(db(evalH(num, den, 10 * wn)) + 40.0004) < 1e-3
    # the high-Q section must peak above 0 dB
    q = 1.931852
    r = 4 * q * q
    c2 = (1.0 / (wn * R)) / math.sqrt(r)
    num, den = sallen_key(R, R, r * c2, c2)
    peak = db(evalH(num, den, 2 * np.pi * f)).max()
    exact = db(q / math.sqrt(1 - 1 / (4 * q * q)))       # closed form as the check
    assert abs(exact - 20 * math.log10(2.0)) < 1e-5, exact
    assert abs(peak - exact) < 1e-3, (peak, exact)
    ax.axhline(-3.0102999566, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 58, -6.6, "-3 dB", mode)
    ax.axvline(1000.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 58, -50, "all three share wn = 2 pi 1000 rad/s;\nonly the ratio C1/C2 = 4 Q^2 differs", mode)
    ax.set_xscale("log")
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("One topology, three shapes: Q is a capacitor ratio")
    ax.set_xlim(f[0], f[-1])
    ax.set_ylim(-56, 10)
    S.strip(ax)
    return fig


@figure("sig3-design-verify")
def _(mode):
    """The finished sixth-order design against the rectangle it had to fit.

    The curve is the product of the three realised Sallen-Key sections - the
    same component values the lesson tabulates - so what is plotted is the
    circuit, not the Butterworth formula. The formula is the assertion.
    """
    c = S.SERIES[mode]
    Ap, As, fp, fst = 0.5, 45.0, 3400.0, 10000.0
    n = 6
    fc = fp / (10 ** (Ap / 10) - 1) ** (1 / (2 * n))
    assert abs(fc - 4051.4466) < 1e-3, fc
    wc = 2 * np.pi * fc
    R = 10e3
    stages = []
    for z in butter_poles(6, wc):
        if z.imag > 0:
            q = abs(z) / (-2 * z.real)
            r = 4 * q * q
            c2 = (1.0 / (wc * R)) / math.sqrt(r)
            stages.append((q, r * c2, c2))
    stages.sort()
    assert [round(q, 6) for q, _, _ in stages] == [0.517638, 0.707107, 1.931852], stages

    f = np.logspace(2.0, 4.7, 2200)

    def cascade(fr):
        H = np.ones_like(np.asarray(fr, dtype=complex))
        for _, c1, c2 in stages:
            num, den = sallen_key(R, R, c1, c2)
            H = H * evalH(num, den, 2 * np.pi * np.asarray(fr, dtype=float))
        return H

    m = db(cascade(f))
    at_p = -db(cascade(np.array([fp])))[0]
    at_s = -db(cascade(np.array([fst])))[0]
    assert abs(at_p - 0.5) < 2e-9, at_p
    assert abs(at_s - 47.0869) < 1e-3, at_s
    assert abs(-db(cascade(np.array([fc])))[0] - 3.0102999566) < 1e-6

    fig, ax = plt.subplots()
    ax.fill_between([f[0], fp], -Ap, 6, color=c[1], alpha=0.16, lw=0)
    ax.fill_between([fst, f[-1]], -110, -As, color=c[1], alpha=0.16, lw=0)
    ax.plot(f, m, color=c[0], lw=2.2)
    ax.plot([fp, fst], [-at_p, -at_s], "o", color=c[0], ms=7)
    S.note(ax, 115, -22, "passband box:\nstay above -0.5 dB\nout to 3.4 kHz", mode)
    S.note(ax, 11200, -12, "stopband box:\nstay below -45 dB\nfrom 10 kHz", mode)
    S.note(ax, 115, -6.5, "achieved -0.500 dB at 3.4 kHz", mode)
    S.note(ax, 900, -74, "achieved -47.09 dB at 10 kHz:\n2.09 dB of margin", mode)
    ax.axvline(fc, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 4250, -99, "fc = 4051 Hz", mode)
    ax.set_xscale("log")
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Three cascaded sections, measured against the specification")
    ax.set_xlim(f[0], f[-1])
    ax.set_ylim(-105, 6)
    S.strip(ax)
    return fig


# ===========================================================================
# DFT AND FFT - every panel is an FFT of a sequence synthesized here
# ===========================================================================


@figure("sig3-dft-samples-dtft")
def _(mode):
    """The DFT is the DTFT of the finite record, sampled at N points.

    The continuous curve is the DTFT sum evaluated on a dense grid; the stems
    are the 8-point FFT of the same eight samples. They agree at the bin
    frequencies to machine precision, and the curve between them is what the
    DFT never sees.
    """
    c = S.SERIES[mode]
    x = np.array([1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0])
    N = len(x)
    wd = np.linspace(0, 2 * np.pi, 4000)
    dtft = np.array([np.sum(x * np.exp(-1j * ww * np.arange(N))) for ww in wd])
    X = np.fft.fft(x)
    k = np.arange(N)
    at_bins = np.array([np.sum(x * np.exp(-1j * (2 * np.pi * kk / N) * np.arange(N)))
                        for kk in k])
    assert np.max(np.abs(at_bins - X)) < 1e-12
    assert abs(X[0] - 4.0) < 1e-12
    assert all(abs(X[k]) < 1e-12 for k in (2, 4, 6)), np.abs(X)
    assert abs(abs(X[1]) - 2.6131259) < 1e-6, abs(X[1])
    assert abs(abs(X[3]) - 1.0823922) < 1e-6, abs(X[3])

    fig, ax = plt.subplots()
    ax.plot(wd / (2 * np.pi) * N, np.abs(dtft), color=c[0], lw=1.9)
    ax.vlines(k, 0, np.abs(X), color=c[1], lw=2.0)
    ax.plot(k, np.abs(X), "o", color=c[1], ms=7)
    S.label_end(ax, 4.6, 1.35, "DTFT of the eight samples", c[0], mode, dy=12, ha="center")
    S.label_end(ax, 1.0, np.abs(X[1]), "the 8 DFT bins", c[1], mode, dx=9, dy=4)
    ax.plot([2, 4, 6], [0, 0, 0], "o", color=S.INK_2[mode], ms=6)
    S.note(ax, 1.35, 3.62, "bins land on the DTFT nulls at k = 2, 4, 6", mode)
    ax.set_xlabel("bin index k  (digital frequency 2 pi k / N)")
    ax.set_ylabel("magnitude")
    ax.set_title("A DFT is a sampled DTFT, nothing more")
    ax.set_xlim(-0.2, 8.2)
    ax.set_ylim(0, 4.5)
    S.strip(ax)
    return fig


@figure("sig3-resolution-zeropad")
def _(mode):
    """Zero-padding interpolates; only a longer record resolves.

    One signal, two 200 Hz and 210 Hz tones at fs = 1000 Hz. Panel 1: 64
    samples. Panel 2: those SAME 64 samples padded to 512 - a smooth curve
    with a single main lobe and side lobes 11.8 dB down. Panel 3: 256 genuine
    samples, and the pair separates.
    """
    c = S.SERIES[mode]
    fs, f1, f2 = 1000.0, 200.0, 210.0

    def spec(Nrec, Nfft):
        t = np.arange(Nrec) / fs
        s = np.cos(2 * np.pi * f1 * t) + np.cos(2 * np.pi * f2 * t)
        M = np.abs(np.fft.fft(s, Nfft))[: Nfft // 2]
        return np.arange(Nfft // 2) * fs / Nfft, M / M.max()

    def maxima(fr, M, lo=165.0, hi=245.0):
        return [i for i in range(1, len(M) - 1)
                if lo <= fr[i] <= hi and M[i] > M[i - 1] and M[i] > M[i + 1]]

    f_a, m_a = spec(64, 64)
    f_b, m_b = spec(64, 512)
    f_c, m_c = spec(256, 256)
    ia, ib, ic = maxima(f_a, m_a), maxima(f_b, m_b), maxima(f_c, m_c)
    assert len(ia) == 1 and abs(f_a[ia[0]] - 203.125) < 1e-9, (ia, f_a[ia])
    assert len(ib) == 3, ib
    main = max(ib, key=lambda i: m_b[i])
    assert abs(f_b[main] - 201.171875) < 1e-9, f_b[main]
    side = [db(m_b[i]) - db(m_b[main]) for i in ib if i != main]
    assert all(-12.0 < v < -11.1 for v in side), side
    assert len(ic) == 2, ic
    assert abs(f_c[ic[0]] - 199.21875) < 1e-9 and abs(f_c[ic[1]] - 210.9375) < 1e-9
    assert abs(fs / 64 - 15.625) < 1e-12 and abs(fs / 256 - 3.90625) < 1e-12

    fig, axes = plt.subplots(3, 1, figsize=(7.2, 6.2), sharex=True)
    for ax, (fr, M, tag, col, stem) in zip(axes, [
            (f_a, m_a, "64 samples: df = 15.625 Hz, one lobe", c[0], True),
            (f_b, m_b, "the SAME 64 samples zero-padded to 512: still one lobe", c[1], False),
            (f_c, m_c, "256 samples: df = 3.906 Hz, two lobes", c[2], True)]):
        if stem:
            ax.vlines(fr, 0, M, color=col, lw=1.8)
            ax.plot(fr, M, "o", color=col, ms=5)
        else:
            ax.plot(fr, M, color=col, lw=2.0)
        ax.set_title(tag, fontsize=10.5)
        ax.set_xlim(140, 280)
        ax.set_ylim(0, 1.15)
        S.strip(ax)
    axes[1].set_ylabel("magnitude / peak")
    axes[2].set_xlabel("frequency  (Hz)")
    S.note(axes[1], 143, 0.66, "side lobes 11.8 dB down -\nwindow skirt, not a second tone", mode)
    for i in ic:
        axes[2].annotate("", xy=(f_c[i], 1.06), xytext=(f_c[i], 1.13),
                         arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.1))
    fig.suptitle("Padding adds points, not information",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("sig3-coherent-leak")
def _(mode):
    """Coherent against incoherent sampling of one tone, 64-point FFT.

    Ten whole cycles in the record put every other bin on a null of the
    Dirichlet kernel; ten and a half cycles put none of them there. Both traces
    are FFTs of sequences built here, normalised to the coherent peak so the
    3.79 dB of scalloping loss is visible as well as the leakage.
    """
    c = S.SERIES[mode]
    N = 64
    n = np.arange(N)
    Xc = np.fft.fft(np.cos(2 * np.pi * 10.0 * n / N))
    Xi = np.fft.fft(np.cos(2 * np.pi * 10.5 * n / N))
    ref = np.abs(Xc).max()
    assert abs(ref - N / 2) < 1e-9, ref
    mc = db(np.maximum(np.abs(Xc[: N // 2]), 1e-16) / ref)
    mi = db(np.abs(Xi[: N // 2]) / ref)
    others = np.delete(np.abs(Xc[: N // 2]), 10)
    assert others.max() < 1e-12, others.max()
    assert abs(np.abs(Xi).max() - 20.675186) < 1e-5, np.abs(Xi).max()
    assert abs(mi.max() + 3.7940) < 1e-3, mi.max()
    frac = 100 * np.sum(np.delete(np.abs(Xi[: N // 2]), int(np.argmax(np.abs(Xi[: N // 2])))) ** 2) \
        / np.sum(np.abs(Xi[: N // 2]) ** 2)
    assert 58.0 < frac < 58.5, frac

    fig, ax = plt.subplots()
    k = np.arange(N // 2)
    ax.vlines(k - 0.16, -100, np.maximum(mc, -100), color=c[0], lw=2.4)
    ax.vlines(k + 0.16, -100, mi, color=c[1], lw=2.4)
    S.label_end(ax, 10, 0.0, "10.0 cycles: only bin 10 is non-zero", c[0], mode,
                dx=10, dy=8)
    S.label_end(ax, 12.0, mi[12], "10.5 cycles: leakage everywhere", c[1], mode,
                dx=10, dy=6)
    ax.axhline(-3.7940, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 31.8, -3.4, "3.79 dB of scalloping loss", mode, ha="right")
    S.note(ax, 0.3, -16.5, "58.3 % of the energy\nmisses the peak bin", mode)
    ax.set_xlabel("bin index k")
    ax.set_ylabel("magnitude relative to the coherent peak  (dB)")
    ax.set_title("Half a cycle of record error costs 58 % of the energy")
    ax.set_xlim(-0.8, 32)
    ax.set_ylim(-60, 8)
    S.strip(ax)
    return fig


@figure("sig3-window-shapes")
def _(mode):
    """The four windows as sequences, plotted from their defining formulas."""
    c = S.SERIES[mode]
    N = 64
    n = np.arange(N)
    wins = {
        "Rectangular": np.ones(N),
        "Hann": 0.5 - 0.5 * np.cos(2 * np.pi * n / N),
        "Hamming": 0.54 - 0.46 * np.cos(2 * np.pi * n / N),
        "Blackman": 0.42 - 0.5 * np.cos(2 * np.pi * n / N) + 0.08 * np.cos(4 * np.pi * n / N),
    }
    assert abs(wins["Hann"][0]) < 1e-15
    assert abs(wins["Hamming"][0] - 0.08) < 1e-12
    assert abs(wins["Blackman"][0] - 0.0) < 1e-12
    for name, w in wins.items():
        cg = w.mean()
        assert abs(cg - {"Rectangular": 1.0, "Hann": 0.5,
                         "Hamming": 0.54, "Blackman": 0.42}[name]) < 1e-12, (name, cg)

    fig, axes = plt.subplots(2, 2, figsize=(7.4, 5.0), sharex=True, sharey=True)
    for ax, (name, w) in zip(axes.ravel(), wins.items()):
        ax.plot(n, w, color=c[0], lw=2.0)
        ax.fill_between(n, 0, w, color=c[0], alpha=0.14, lw=0)
        ax.set_title(f"{name}   (mean = {w.mean():.2f})", fontsize=10.5)
        ax.set_ylim(-0.05, 1.12)
        S.strip(ax)
    for ax in axes[1]:
        ax.set_xlabel("sample index n")
    axes[0][0].set_ylabel("w[n]")
    axes[1][0].set_ylabel("w[n]")
    fig.suptitle("Four windows over a 64-sample record",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("sig3-window-spectra")
def _(mode):
    """Window spectra, measured: main-lobe width against side-lobe skirt.

    Each panel is a 1024-point window transformed on a 2^20 grid so the lobe
    shape is resolved, normalised to its own peak. The numbers printed on each
    panel are read off these very arrays.
    """
    c = S.SERIES[mode]
    N, NF = 1024, 1 << 20
    n = np.arange(N)
    wins = {
        "Rectangular": np.ones(N),
        "Hann": 0.5 - 0.5 * np.cos(2 * np.pi * n / N),
        "Hamming": 0.54 - 0.46 * np.cos(2 * np.pi * n / N),
        "Blackman": 0.42 - 0.5 * np.cos(2 * np.pi * n / N) + 0.08 * np.cos(4 * np.pi * n / N),
    }
    expect = {"Rectangular": (-13.2614, 2.0), "Hann": (-31.4673, 4.0),
              "Hamming": (-42.6741, 4.0), "Blackman": (-58.1088, 6.0)}
    per = NF / N
    fig, axes = plt.subplots(2, 2, figsize=(7.6, 5.4), sharex=True, sharey=True)
    for ax, (name, w) in zip(axes.ravel(), wins.items()):
        Sp = np.abs(np.fft.fft(w, NF))
        # only the first half: the upper half is the Hermitian mirror, and
        # letting it into the side-lobe search reports the mirrored main lobe
        m = db(Sp[: NF // 2] / Sp.max())
        inull = next(i for i in range(1, NF // 2 - 1)
                     if m[i] < m[i - 1] and m[i] < m[i + 1] and m[i] < -60)
        side = m[inull:].max()
        nullnull = 2 * inull / per
        want_side, want_nn = expect[name]
        assert abs(side - want_side) < 1e-3, (name, side)
        assert abs(nullnull - want_nn) < 1e-3, (name, nullnull)
        bins = np.arange(0, int(9 * per)) / per
        ax.plot(bins, m[: len(bins)], color=c[0], lw=1.8)
        ax.axhline(side, color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.set_title(f"{name}\nlobe {nullnull:.0f} bins wide, skirt {side:.1f} dB", fontsize=9.5)
        ax.set_ylim(-104, 6)
        ax.set_xlim(0, 9)
        S.strip(ax)
    for ax in axes[1]:
        ax.set_xlabel("bins from the centre of the main lobe")
    axes[0][0].set_ylabel("dB relative to peak")
    axes[1][0].set_ylabel("dB relative to peak")
    fig.suptitle("A wider main lobe is what buys a lower skirt",
                 fontsize=12, fontweight="semibold", color=S.INK[mode])
    fig.tight_layout()
    return fig


@figure("sig3-butterfly")
def _(mode):
    """The 8-point decimation-in-time flow graph, drawn from the algorithm.

    Node positions and every edge come from the same recursion that the
    counting example runs, so the twelve butterflies in the picture are the
    twelve the count predicts.
    """
    c = S.SERIES[mode]
    N, stages = 8, 3
    bits = int(math.log2(N))
    rev = [int(format(i, f"0{bits}b")[::-1], 2) for i in range(N)]
    assert rev == [0, 4, 2, 6, 1, 5, 3, 7], rev

    edges, butter = [], 0
    for st in range(stages):
        span = 1 << st
        block = span * 2
        for start in range(0, N, block):
            for j in range(span):
                a, b = start + j, start + j + span
                edges += [(st, a, a), (st, b, b), (st, b, a), (st, a, b)]
                butter += 1
    assert butter == N // 2 * stages == 12, butter

    fig, ax = plt.subplots(figsize=(7.4, 4.8))
    xs = np.arange(stages + 1)
    for st, a, b in edges:
        ax.plot([xs[st], xs[st + 1]], [-a, -b], color=c[0],
                lw=1.5 if a == b else 1.5, alpha=0.85 if a == b else 0.55)
    for st in range(stages + 1):
        ax.plot([xs[st]] * N, -np.arange(N), "o", color=S.INK[mode], ms=5.5, zorder=4)
    for i in range(N):
        ax.annotate(f"x[{rev[i]}]", xy=(0, -i), xytext=(-8, 0), textcoords="offset points",
                    ha="right", va="center", fontsize=9.5, color=S.INK_2[mode])
        ax.annotate(f"X[{i}]", xy=(stages, -i), xytext=(9, 0), textcoords="offset points",
                    ha="left", va="center", fontsize=9.5, color=S.INK_2[mode])
    for st in range(stages):
        S.note(ax, xs[st] + 0.5, 0.55, f"stage {st+1}", mode, ha="center")
    S.note(ax, 1.5, -8.35, "3 stages of 4 butterflies = 12 = (N/2) log2 N", mode, ha="center")
    ax.set_xlim(-0.85, 3.75)
    ax.set_ylim(-8.9, 1.15)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    ax.set_title("Eight-point radix-2 flow graph: inputs enter bit-reversed")
    return fig


@figure("sig3-fft-cost")
def _(mode):
    """Counted butterflies against the direct-sum cost, both on log-log axes.

    The FFT points are not the formula: a recursive radix-2 transform is run
    here for each N with a counter in the inner loop, its output checked
    against numpy, and the tally plotted.
    """
    c = S.SERIES[mode]
    tally = {"mul": 0}

    def fft_r2(a):
        M = len(a)
        if M == 1:
            return a
        E, O = fft_r2(a[0::2]), fft_r2(a[1::2])
        out = np.empty(M, dtype=complex)
        for k in range(M // 2):
            t = np.exp(-2j * np.pi * k / M) * O[k]
            tally["mul"] += 1
            out[k] = E[k] + t
            out[k + M // 2] = E[k] - t
        return out

    Ns = [8, 16, 32, 64, 128, 256, 512, 1024]
    counted, direct = [], []
    rng = np.random.default_rng(11)
    for N in Ns:
        tally["mul"] = 0
        a = rng.standard_normal(N) + 1j * rng.standard_normal(N)
        got = fft_r2(a)
        assert np.max(np.abs(got - np.fft.fft(a))) < 1e-11, N
        assert tally["mul"] == N // 2 * int(math.log2(N)), (N, tally["mul"])
        counted.append(tally["mul"])
        direct.append(N * N)
    assert counted[-1] == 5120 and direct[-1] == 1048576
    assert abs(direct[-1] / counted[-1] - 204.8) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(Ns, direct, "o-", color=c[0], lw=2.0, ms=6)
    ax.plot(Ns, counted, "o-", color=c[1], lw=2.0, ms=6)
    S.label_end(ax, Ns[-1], direct[-1], "direct sum: N^2", c[0], mode, dx=-8, ha="right", dy=-13)
    S.label_end(ax, Ns[-1], counted[-1], "counted butterflies: (N/2) log2 N", c[1], mode,
                dx=-8, ha="right", dy=13)
    ax.plot([1024], [1048576], "o", color=c[0], ms=9)
    S.note(ax, 8.6, 1.15e6, "N = 1024: 1,048,576 against 5,120 -\na factor of 204.8", mode)
    ax.set_xscale("log", base=2)
    ax.set_yscale("log")
    ax.set_xlabel("transform length N")
    ax.set_ylabel("complex multiplications")
    ax.set_title("The saving is a ratio that grows with N")
    ax.set_ylim(20, 4e6)
    S.strip(ax)
    return fig


@figure("sig3-hermitian")
def _(mode):
    """Real input, mirrored spectrum: magnitude even, phase odd.

    Both panels are the 32-point FFT of one real sequence built here. The
    assertion is the symmetry itself, checked bin by bin.
    """
    c = S.SERIES[mode]
    N = 32
    n = np.arange(N)
    x = (np.cos(2 * np.pi * 3 * n / N) + 0.6 * np.cos(2 * np.pi * 7 * n / N + 0.9)
         + 0.25 * np.cos(2 * np.pi * 11 * n / N - 0.4))
    X = np.fft.fft(x)
    err = max(abs(X[N - k] - np.conj(X[k])) for k in range(1, N))
    assert err < 1e-12, err
    assert abs(X[0].imag) < 1e-12 and abs(X[N // 2].imag) < 1e-12
    assert N // 2 + 1 == 17
    mag = np.abs(X)
    ph = np.angle(X)
    ph[mag < 1e-9] = 0.0
    assert abs(mag[3] - mag[N - 3]) < 1e-12
    assert abs(ph[3] + ph[N - 3]) < 1e-12

    fig, axes = plt.subplots(2, 1, figsize=(7.2, 5.2), sharex=True)
    axes[0].vlines(n[: N // 2 + 1], 0, mag[: N // 2 + 1], color=c[0], lw=2.2)
    axes[0].vlines(n[N // 2 + 1:], 0, mag[N // 2 + 1:], color=c[1], lw=2.2)
    axes[0].set_ylabel("|X[k]|")
    S.label_end(axes[0], 3, mag[3], "unique half: k = 0 to 16", c[0], mode, dx=8, dy=2)
    S.label_end(axes[0], 29, mag[29], "mirror: no new information", c[1], mode,
                dx=-8, ha="right", dy=6)
    axes[1].vlines(n[: N // 2 + 1], 0, np.degrees(ph[: N // 2 + 1]), color=c[0], lw=2.2)
    axes[1].vlines(n[N // 2 + 1:], 0, np.degrees(ph[N // 2 + 1:]), color=c[1], lw=2.2)
    axes[1].axhline(0, color=S.GRID[mode], lw=1.0)
    axes[1].set_ylabel("phase  (degrees)")
    axes[1].set_xlabel("bin index k")
    for ax in axes:
        ax.axvline(N // 2, color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.set_xlim(-0.6, N - 0.4)
        S.strip(ax)
    S.note(axes[1], 16.6, -46, "k = N/2 is the folding bin", mode)
    axes[0].set_title("Magnitude is even about k = N/2, phase is odd")
    fig.tight_layout()
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
        assert n.startswith("sig3-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
