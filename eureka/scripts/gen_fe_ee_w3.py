#!/usr/bin/env python3
"""Wave-3 figures for the FE Electrical and Computer course:
Signal Processing and Electronics.

Same contract as gen_fe_ee_figures.py, and it imports the SAME style module
rather than growing a second look: every curve here is COMPUTED from the
equation the lesson states, in code the reader can check. Nothing is traced,
scanned or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w3.py            # all
    python3 scripts/gen_fe_ee_w3.py sig        # only names starting "sig"
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
# Signal Processing - 5-8 questions
# ---------------------------------------------------------------------------


@figure("sig-alias-folding")
def _(mode):
    """Apparent frequency against true input frequency for a fixed sample rate.

    The curve is f_app = |f - n*fs| with n chosen to land in [0, fs/2],
    evaluated point by point - which produces the triangle-wave "folding"
    shape. Every aliasing calculation on the exam is one read off this zigzag.
    """
    c = S.SERIES[mode]
    fs = 1.0
    f = np.linspace(0, 3.0 * fs, 1200)
    # fold each frequency into [0, fs/2] exactly as the lesson formula says
    r = np.mod(f, fs)
    f_app = np.minimum(r, fs - r)

    fig, ax = plt.subplots()
    ax.plot(f, f_app, color=c[0], lw=2.2)
    ax.plot([0, 0.5 * fs], [0, 0.5 * fs], color=c[1], lw=2.6)
    S.label_end(ax, 0.30, 0.36, "no aliasing:\napparent = true", c[1], mode, ha="right")
    S.label_end(ax, 3.0, 0.02, "folded (aliased)", c[0], mode, dx=-2, dy=8, ha="right")
    for k in (0.5, 1.0, 1.5, 2.0, 2.5, 3.0):
        ax.axvline(k, color=S.GRID[mode], lw=0.8, ls=":")
    # one worked point from the lesson: 0.7 fs lands at 0.3 fs
    ax.plot([0.7], [0.3], "o", color=c[0], ms=7)
    ax.plot([0.7, 0.7], [0, 0.3], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 0.74, 0.31, "0.7 fs reads as 0.3 fs", mode)
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 2.35, 0.515, "Nyquist frequency fs/2", mode)
    ax.set_xlabel("true input frequency  f / fs")
    ax.set_ylabel("apparent frequency  / fs")
    ax.set_title("Fold the axis at fs/2: everything above it comes back down")
    ax.set_xlim(0, 3.35)
    ax.set_ylim(0, 0.62)
    S.strip(ax)
    return fig


@figure("sig-undersampled-cosine")
def _(mode):
    """A 700 Hz cosine sampled at 1 kHz, with the 300 Hz alias drawn through
    the same samples.

    Both curves and the samples are computed: x(t) = cos(2 pi 700 t) at
    t = n/1000 equals cos(1.4 pi n) = cos(0.6 pi n), which is exactly the
    300 Hz cosine at those instants. The assertion below checks that identity
    numerically before anything is drawn.
    """
    c = S.SERIES[mode]
    f_in, f_alias, fs = 700.0, 300.0, 1000.0
    t = np.linspace(0, 0.010, 2000)
    n = np.arange(0, 11)
    ts = n / fs
    assert np.allclose(np.cos(2 * np.pi * f_in * ts),
                       np.cos(2 * np.pi * f_alias * ts)), "alias identity broken"

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, np.cos(2 * np.pi * f_in * t), color=c[0], lw=1.6, alpha=0.85)
    ax.plot(t * 1e3, np.cos(2 * np.pi * f_alias * t), color=c[1], lw=2.4)
    ax.plot(ts * 1e3, np.cos(2 * np.pi * f_in * ts), "o", color=S.INK[mode], ms=6, zorder=5)
    for x in ts:
        ax.plot([x * 1e3, x * 1e3], [-1.15, np.cos(2 * np.pi * f_in * x)],
                color=S.GRID[mode], lw=0.8, ls=":")
    S.label_end(ax, 10.0, np.cos(2 * np.pi * f_in * 0.010), "700 Hz input", c[0], mode, dy=-10)
    S.label_end(ax, 10.0, np.cos(2 * np.pi * f_alias * 0.010), "300 Hz alias", c[1], mode, dy=8)
    S.note(ax, 0.15, -1.42, "dots: the samples at fs = 1 kHz - both curves pass through every one",
           mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("amplitude")
    ax.set_title("Sampled below Nyquist, 700 Hz and 300 Hz are the same data")
    ax.set_xlim(0, 11.6)
    ax.set_ylim(-1.5, 1.3)
    S.strip(ax)
    return fig


@figure("sig-filter-approximations")
def _(mode):
    """Butterworth and Chebyshev magnitude responses on the same axes.

    Butterworth: |H| = 1/sqrt(1 + (w/wc)^(2n)) for n = 2 and n = 6.
    Chebyshev I: |H| = 1/sqrt(1 + eps^2 Tn(w/wc)^2) for n = 4 with 1 dB
    ripple (eps = sqrt(10^0.1 - 1)), Tn evaluated from its cos/cosh
    definition. The two lesson claims are visible at once: order sets the
    asymptotic slope, and the Chebyshev buys a sharper knee by rippling in
    the passband.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1, 1, 900)

    def butter_db(n):
        return -10 * np.log10(1 + w ** (2 * n))

    def cheby_db(n, ripple_db):
        eps = np.sqrt(10 ** (ripple_db / 10) - 1)
        x = w
        Tn = np.where(x <= 1, np.cos(n * np.arccos(np.clip(x, -1, 1))),
                      np.cosh(n * np.arccosh(np.maximum(x, 1))))
        return -10 * np.log10(1 + (eps * Tn) ** 2)

    fig, ax = plt.subplots()
    ax.semilogx(w, butter_db(2), color=c[0], lw=2.0)
    ax.semilogx(w, butter_db(6), color=c[1], lw=2.0)
    ax.semilogx(w, cheby_db(4, 1.0), color=c[2], lw=2.0)
    S.label_end(ax, 2.6, butter_db(2)[np.searchsorted(w, 2.6)], "Butterworth n = 2", c[0], mode, dy=6)
    S.label_end(ax, 2.1, -46, "Butterworth n = 6", c[1], mode, ha="right", dx=-4)
    S.label_end(ax, 4.2, -62, "Chebyshev n = 4\n(1 dB ripple)", c[2], mode, dy=8)
    ax.axhline(-3, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.105, -9.6, "-3 dB cutoff line", mode)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.set_xlabel("frequency  w / wc")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Order buys slope; ripple buys a sharper knee at the same order")
    ax.set_ylim(-80, 6)
    ax.set_xlim(0.1, 10)
    S.strip(ax)
    return fig


@figure("sig-square-partial-sums")
def _(mode):
    """Partial sums of the square-wave Fourier series, with the Gibbs level.

    Each curve is sum of (4/pi) sin(n w0 t)/n over odd n up to the stated
    harmonic - the exact coefficients the lesson derives. The overshoot next
    to the jump approaches about 9% of the step and does not shrink as terms
    are added; the marked line sits at 1.09.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 1.0, 4000)

    def partial(n_max):
        y = np.zeros_like(t)
        for n_h in range(1, n_max + 1, 2):
            y += (4 / np.pi) * np.sin(2 * np.pi * n_h * t) / n_h
        return y

    fig, ax = plt.subplots()
    sq = np.sign(np.sin(2 * np.pi * t))
    ax.plot(t, sq, color=S.GUIDE[mode], lw=1.2, ls="--")
    for i, (n_h, lab) in enumerate([(1, "n = 1"), (7, "up to n = 7"), (49, "up to n = 49")]):
        ax.plot(t, partial(n_h), color=c[i], lw=1.8)
    S.label_end(ax, 0.25, 4 / np.pi, "n = 1", c[0], mode, dy=8, ha="center")
    S.label_end(ax, 0.45, 1.21, "up to n = 7", c[1], mode)
    S.label_end(ax, 0.72, 1.34, "up to n = 49", c[2], mode)
    ax.axhline(1.09, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.985, -1.52, "dotted line: the 9% Gibbs overshoot - it narrows, it never shrinks",
           mode, ha="right")
    ax.set_xlabel("time  t / T0")
    ax.set_ylabel("amplitude")
    ax.set_title("Adding harmonics sharpens the edge but keeps the overshoot")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(-1.6, 1.6)
    S.strip(ax)
    return fig


@figure("sig-leakage-window")
def _(mode):
    """DFT magnitude of a tone that does not land on a bin, with and without
    a Hann window.

    x[n] = cos(2 pi 10.5 n / 64) for N = 64 - deliberately 10.5 cycles so the
    tone falls exactly between bins 10 and 11. Both spectra are np.fft.fft of
    the stated signal, normalised to their own peak. The rectangular window's
    sinc skirts leak across the whole axis; the Hann window trades a wider
    main lobe for skirts that drop off the bottom of the plot.
    """
    c = S.SERIES[mode]
    N = 64
    n = np.arange(N)
    x = np.cos(2 * np.pi * 10.5 * n / N)
    hann = 0.5 - 0.5 * np.cos(2 * np.pi * n / (N - 1))

    def spec_db(sig):
        X = np.abs(np.fft.fft(sig))[: N // 2]
        return 20 * np.log10(np.maximum(X / X.max(), 1e-6))

    rect_db, hann_db = spec_db(x), spec_db(x * hann)
    k = np.arange(N // 2)

    fig, ax = plt.subplots()
    ax.plot(k, rect_db, color=c[0], lw=1.7, marker="o", ms=3.5)
    ax.plot(k, hann_db, color=c[1], lw=1.7, marker="o", ms=3.5)
    S.label_end(ax, 31, rect_db[-1], "rectangular\n(no window)", c[0], mode, dy=6)
    S.label_end(ax, 31, -68, "Hann window", c[1], mode, dy=-4)
    ax.axvline(10.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 11.0, -12, "true tone at bin 10.5 -\nbetween two bins", mode)
    ax.set_xlabel("DFT bin  k")
    ax.set_ylabel("magnitude  (dB, each trace to its own peak)")
    ax.set_title("A tone between bins smears; the window decides how far")
    ax.set_xlim(0, 36)
    ax.set_ylim(-80, 6)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Electronics - 7-11 questions
# ---------------------------------------------------------------------------


@figure("elec-diode-models")
def _(mode):
    """The exponential diode law against the two analysis models.

    The curve is i = Is (exp(v/VT) - 1) with Is = 1 pA and VT = 26 mV - the
    equation the lesson states - plotted on a mA scale. The constant-drop
    model is the vertical line at 0.7 V; the ideal model is the vertical at
    0 V. The point of drawing all three: on a linear current axis the
    exponential IS effectively a vertical line, which is why the 0.7 V
    shortcut works.
    """
    c = S.SERIES[mode]
    v = np.linspace(0, 0.75, 800)
    Is, VT = 1e-12, 0.026
    i_mA = Is * (np.exp(v / VT) - 1) * 1e3

    fig, ax = plt.subplots()
    ax.plot(v, i_mA, color=c[0], lw=2.2)
    ax.plot([0.7, 0.7], [0, 100], color=c[1], lw=2.0, ls="--")
    ax.plot([0.0, 0.0], [0, 100], color=S.GUIDE[mode], lw=1.8, ls=":")
    S.label_end(ax, 0.665, 80, "exponential law\ni = Is(e^(v/VT) - 1)", c[0], mode, ha="right")
    S.label_end(ax, 0.7, 52, "constant-drop\nmodel: 0.7 V", c[1], mode, dx=8)
    S.label_end(ax, 0.0, 92, "ideal model: 0 V", S.GUIDE[mode], mode, dx=8)
    for i_pt, txt in [(10.0, "10 mA at 0.599 V"), (100.0, "100 mA at 0.659 V")]:
        v_pt = VT * np.log(i_pt * 1e-3 / Is)
        ax.plot([v_pt], [i_pt], "o", color=c[0], ms=6)
        S.note(ax, v_pt - 0.012, i_pt + 1.5, txt, mode, ha="right")
    ax.set_xlabel("forward voltage  v  (V)")
    ax.set_ylabel("forward current  i  (mA)")
    ax.set_title("Two decades of current move the knee by only 60 mV")
    ax.set_xlim(0, 0.88)
    ax.set_ylim(0, 108)
    S.strip(ax)
    return fig


@figure("elec-bjt-bias-stability")
def _(mode):
    """Collector bias current against beta for fixed-base and divider bias.

    Fixed bias: IC = beta (VCC - 0.7)/RB, with VCC = 12 V and RB = 565 k
    chosen so IB = 20 uA - IC is proportional to beta. Divider bias with
    VB = 6.0 V, RE = 2.7 k and Thevenin base resistance 15 k:
    IC ~ IE = (VB - 0.7)/(RE + RB_th/(beta + 1)), nearly flat. Both curves
    are those formulas evaluated across beta = 50..300.
    """
    c = S.SERIES[mode]
    beta = np.linspace(50, 300, 400)
    ic_fixed = beta * (12 - 0.7) / 565e3 * 1e3          # mA
    ic_div = (6.0 - 0.7) / (2700 + 15e3 / (beta + 1)) * 1e3

    fig, ax = plt.subplots()
    ax.plot(beta, ic_fixed, color=c[1], lw=2.2)
    ax.plot(beta, ic_div, color=c[0], lw=2.2)
    S.label_end(ax, 300, ic_fixed[-1], "fixed base bias", c[1], mode, dy=2)
    S.label_end(ax, 300, ic_div[-1], "voltage-divider bias", c[0], mode, dy=2)
    for b in (100, 300):
        i1 = b * (12 - 0.7) / 565e3 * 1e3
        i2 = (6.0 - 0.7) / (2700 + 15e3 / (b + 1)) * 1e3
        ax.plot([b, b], [i2, i1], color=S.GRID[mode], lw=0.9, ls=":")
        ax.plot([b], [i1], "o", color=c[1], ms=6)
        ax.plot([b], [i2], "o", color=c[0], ms=6)
    S.note(ax, 103, 2.25, "same transistor swap:\nfixed bias 2 mA to 6 mA,\ndivider bias 1.86 mA to 1.93 mA", mode)
    ax.set_xlabel("current gain  beta")
    ax.set_ylabel("collector bias current  (mA)")
    ax.set_title("The Q-point should not depend on the one parameter that varies")
    ax.set_xlim(50, 365)
    ax.set_ylim(0, 6.6)
    S.strip(ax)
    return fig


@figure("elec-mosfet-regions")
def _(mode):
    """NMOS output characteristics from the two region equations.

    For each VGS: triode ID = K(2(VGS - Vt)VDS - VDS^2) while
    VDS < VGS - Vt, then saturation ID = K(VGS - Vt)^2 (1 + lambda (VDS -
    (VGS - Vt))) with K = 0.5 mA/V^2, Vt = 1 V, lambda = 0.02 /V - the
    channel-length-modulation term referenced to the pinch-off point so the
    two pieces meet exactly at the boundary. The dashed parabola
    ID = K VDS^2 is the locus VDS = VGS - Vt where the channel pinches off -
    the boundary the exam asks you to check before using the square law.
    """
    c = S.SERIES[mode]
    K, Vt, lam = 0.5, 1.0, 0.02
    vds = np.linspace(0, 8, 600)

    fig, ax = plt.subplots()
    for i, vgs in enumerate([2.0, 3.0, 4.0]):
        vov = vgs - Vt
        triode = K * (2 * vov * vds - vds ** 2)
        sat = K * vov ** 2 * (1 + lam * (vds - vov))
        idp = np.where(vds < vov, triode, sat)
        ax.plot(vds, idp, color=c[i], lw=2.0)
        S.label_end(ax, 8, idp[-1], f"VGS = {vgs:.0f} V", c[i], mode)
    vb = np.linspace(0, 3.35, 200)
    ax.plot(vb, K * vb ** 2, color=S.GUIDE[mode], lw=1.4, ls="--")
    S.note(ax, 3.55, 3.05, "pinch-off locus\nVDS = VGS - Vt", mode)
    S.note(ax, 0.28, 5.6, "triode:\ncircuit-controlled\nresistor", mode)
    S.note(ax, 5.3, 5.75, "saturation: current set by VGS,\nnearly flat in VDS", mode)
    ax.set_xlabel("drain-source voltage  VDS  (V)")
    ax.set_ylabel("drain current  ID  (mA)")
    ax.set_title("Check which side of the parabola you are on before using the square law")
    ax.set_xlim(0, 9.4)
    ax.set_ylim(0, 6.4)
    S.strip(ax)
    return fig


@figure("elec-converter-ratios")
def _(mode):
    """DC-DC converter voltage ratio against duty cycle, all three topologies.

    Buck Vo/Vin = D, boost = 1/(1 - D), buck-boost magnitude = D/(1 - D),
    evaluated straight from the ideal CCM formulas the lesson derives. The
    vertical run-away of the boost family near D = 1 is the practical limit
    the lesson discusses: losses cap real boost ratios around 4-5x.
    """
    c = S.SERIES[mode]
    D = np.linspace(0.01, 0.86, 500)

    fig, ax = plt.subplots()
    ax.plot(D, D, color=c[0], lw=2.2)
    ax.plot(D, 1 / (1 - D), color=c[1], lw=2.2)
    ax.plot(D, D / (1 - D), color=c[2], lw=2.2)
    S.label_end(ax, 0.86, 0.86, "buck  D", c[0], mode)
    S.label_end(ax, 0.86, 1 / (1 - 0.86), "boost  1/(1-D)", c[1], mode, dy=-12)
    S.label_end(ax, 0.86, 0.86 / (1 - 0.86), "buck-boost  D/(1-D)\n(output inverted)", c[2], mode, dy=-14)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.02, 1.06, "unity: output equals input", mode)
    ax.plot([0.5], [1.0], "o", color=c[2], ms=6)
    S.note(ax, 0.53, 0.26, "buck-boost crosses\nunity at D = 0.5", mode)
    ax.set_xlabel("duty cycle  D")
    ax.set_ylabel("voltage ratio  |Vo / Vin|")
    ax.set_title("One knob, three topologies: what duty cycle does to voltage")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 7.2)
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
