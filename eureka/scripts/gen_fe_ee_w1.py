#!/usr/bin/env python3
"""Wave-1 figures for the FE EE course: Probability & Statistics and
Properties of Electrical Materials.

Same contract as gen_fe_ee_figures.py and it imports the SAME style module:
every figure here is COMPUTED from the equation the lesson states, in code a
reader can check against the formula. Nothing is traced, scanned or adapted
from the NCEES Reference Handbook or any study guide - the pipeline consumes
formulas and tabulated constants, which are not protected expression, never
anyone's drawing of them. The one model-based figure (mat-bh-loops) computes
its curves from a stated tanh magnetisation model and its lesson caption says
so.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose alt text is the
caption.

Usage:
    python3 scripts/gen_fe_ee_w1.py            # all
    python3 scripts/gen_fe_ee_w1.py prob       # only names starting "prob"
"""
from __future__ import annotations

import pathlib
import sys
from math import comb, erf, exp, factorial, sqrt

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
# Probability & Statistics - 4-6 questions
# ---------------------------------------------------------------------------


@figure("prob-normal-bands")
def _(mode):
    """The standard normal density with its one-, two- and three-sigma bands.

    The curve is the pdf exactly, and every printed percentage is computed
    from erf rather than typed in, so the shading and the numbers cannot
    disagree: P(|Z| < k) = erf(k / sqrt 2).
    """
    c = S.SERIES[mode]
    z = np.linspace(-4, 4, 800)
    pdf = np.exp(-z ** 2 / 2) / np.sqrt(2 * np.pi)

    fig, ax = plt.subplots()
    ax.plot(z, pdf, color=c[0], lw=2.2)
    # nested bands, widest first so the narrow ones sit on top
    for k, alpha in ((3, 0.10), (2, 0.18), (1, 0.30)):
        m = np.abs(z) <= k
        ax.fill_between(z[m], 0, pdf[m], color=c[0], alpha=alpha, lw=0)
    # The percentages live in the empty upper-left corner rather than on the
    # curve: text over the shaded bands fights the marks it describes.
    for k in (1, 2, 3):
        p = erf(k / sqrt(2)) * 100
        ax.plot([k, k], [0, np.exp(-k ** 2 / 2) / np.sqrt(2 * np.pi)],
                color=S.GUIDE[mode], lw=0.9, ls=":")
        ax.plot([-k, -k], [0, np.exp(-k ** 2 / 2) / np.sqrt(2 * np.pi)],
                color=S.GUIDE[mode], lw=0.9, ls=":")
        S.note(ax, -4.1, 0.455 - 0.045 * k, f"|Z| < {k}:  {p:.1f}%", mode)
    ax.set_xlabel("standard score  z = (x - mu) / sigma")
    ax.set_ylabel("probability density")
    ax.set_title("Standardising moves every normal problem onto this one curve")
    ax.set_xlim(-4.2, 4.2)
    ax.set_ylim(0, 0.46)
    S.strip(ax)
    return fig


@figure("prob-binomial-poisson")
def _(mode):
    """Binomial(20, 0.1) beside Poisson(2): the approximation the exam uses.

    Both pmfs are computed from their own formulas with lambda = np = 2, the
    matching condition the lesson states. The bars nearly coincide, which is
    the whole claim: for large n and small p the Poisson is the cheap and
    accurate substitute.
    """
    c = S.SERIES[mode]
    n, p = 20, 0.1
    lam = n * p
    k = np.arange(0, 9)
    binom = np.array([comb(n, int(i)) * p ** i * (1 - p) ** (n - i) for i in k])
    poiss = np.array([lam ** i * exp(-lam) / factorial(int(i)) for i in k])

    fig, ax = plt.subplots()
    w = 0.38
    ax.bar(k - w / 2, binom, width=w, color=c[0], alpha=0.85)
    ax.bar(k + w / 2, poiss, width=w, color=c[1], alpha=0.85)
    S.label_end(ax, 4.4, binom[2], "binomial  n = 20, p = 0.1", c[0], mode,
                dx=18, dy=8, ha="left")
    S.label_end(ax, 4.4, poiss[3], "Poisson  lambda = np = 2", c[1], mode,
                dx=18, dy=-8, ha="left")
    ax.set_xlabel("number of events  k")
    ax.set_ylabel("probability  P(X = k)")
    ax.set_title("Rare events: the Poisson shadows the binomial")
    ax.set_xticks(k)
    ax.set_ylim(0, 0.32)
    S.strip(ax)
    return fig


@figure("prob-same-mean-spread")
def _(mode):
    """Two distributions with the same mean and different variances.

    Binomial(10, 0.5) has mean 5 and variance 2.5; Poisson(5) has mean 5 and
    variance 5. Both pmfs are computed from their formulas. The mean alone
    cannot tell them apart - which is why the exam asks for variance too.
    """
    c = S.SERIES[mode]
    k = np.arange(0, 13)
    narrow = np.array([comb(10, int(i)) * 0.5 ** 10 if i <= 10 else 0.0
                       for i in k])
    wide = np.array([5.0 ** i * exp(-5.0) / factorial(int(i)) for i in k])

    fig, ax = plt.subplots()
    ax.plot(k, narrow, "o-", color=c[0], lw=1.8, ms=6)
    ax.plot(k, wide, "o-", color=c[1], lw=1.8, ms=6)
    ax.axvline(5, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 5, 0.263, "both means sit here", mode, ha="center")
    S.label_end(ax, 8.2, narrow[8], "variance 2.5", c[0], mode, dy=8)
    S.label_end(ax, 9.5, wide[9], "variance 5", c[1], mode, dy=-2)
    ax.set_xlabel("value of the random variable")
    ax.set_ylabel("probability")
    ax.set_title("Equal means, unequal spread: the mean is half the story")
    ax.set_xticks(k)
    ax.set_ylim(0, 0.29)
    S.strip(ax)
    return fig


@figure("prob-regression-fit")
def _(mode):
    """The worked five-point dataset from the lesson, fitted by least squares.

    The slope and intercept are recomputed here from the normal-equation
    sums - the same arithmetic the lesson does by hand - and the residuals
    are drawn as the vertical segments the method actually minimises.
    """
    c = S.SERIES[mode]
    x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
    y = np.array([2.0, 3.6, 5.5, 6.9, 9.0])
    n = len(x)
    b = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / \
        (n * np.sum(x ** 2) - np.sum(x) ** 2)
    a = np.mean(y) - b * np.mean(x)
    yhat = a + b * x

    fig, ax = plt.subplots()
    xs = np.linspace(0.5, 5.5, 50)
    ax.plot(xs, a + b * xs, color=c[0], lw=2.2)
    for xi, yi, yh in zip(x, y, yhat):
        ax.plot([xi, xi], [yh, yi], color=c[1], lw=1.6)
    ax.plot(x, y, "o", color=c[1], ms=7)
    S.label_end(ax, 5.5, a + b * 5.5,
                f"y = {a:.2f} + {b:.2f} x", c[0], mode, dy=6)
    S.note(ax, 3.9, 5.1, "residuals: the vertical gaps\nthe fit minimises",
           mode, ha="left")
    ax.set_xlabel("load current  (A)")
    ax.set_ylabel("temperature rise  (deg C)")
    ax.set_title("Least squares minimises the squared vertical distances")
    ax.set_xlim(0.4, 6.6)
    ax.set_ylim(0, 10.5)
    S.strip(ax)
    return fig


@figure("prob-alpha-beta")
def _(mode):
    """Type I and Type II error regions for one concrete test.

    Sampling distributions of the mean under H0 (mu = 100) and under a true
    mean of 102, both with a standard error of 0.7. The critical value
    100 + 1.645 x 0.7 = 101.15 splits the axis: alpha is the H0 tail beyond
    it, beta is the H1 area short of it. Every number is computed from the
    normal pdf, none typed in.
    """
    c = S.SERIES[mode]
    se = 0.7
    xc = 100 + 1.645 * se
    x = np.linspace(97, 105, 800)
    h0 = np.exp(-((x - 100) / se) ** 2 / 2) / (se * np.sqrt(2 * np.pi))
    h1 = np.exp(-((x - 102) / se) ** 2 / 2) / (se * np.sqrt(2 * np.pi))

    fig, ax = plt.subplots()
    ax.plot(x, h0, color=c[0], lw=2.2)
    ax.plot(x, h1, color=c[1], lw=2.2)
    ax.fill_between(x, 0, h0, where=(x >= xc), color=c[0], alpha=0.30, lw=0)
    ax.fill_between(x, 0, h1, where=(x <= xc), color=c[1], alpha=0.22, lw=0)
    ax.axvline(xc, color=S.GUIDE[mode], lw=1.2, ls="--")
    beta = 0.5 * (1 + erf((xc - 102) / (se * sqrt(2))))
    S.label_end(ax, 99.2, max(h0), "H0 true:  mu = 100", c[0], mode,
                dx=-8, ha="right")
    S.label_end(ax, 102.8, max(h1), "truth:  mu = 102", c[1], mode, dx=8)
    S.note(ax, xc + 0.12, 0.062, "alpha = 0.05\nfalse alarm", mode)
    S.note(ax, xc - 0.16, 0.030, f"beta = {beta:.2f}\nmissed shift", mode,
           ha="right")
    S.note(ax, xc, 0.60, "critical value 101.15", mode, ha="center")
    ax.set_xlabel("sample mean  (ohm)")
    ax.set_ylabel("probability density")
    ax.set_title("Move the critical value and one error shrinks as the other grows")
    ax.set_xlim(97.4, 104.9)
    ax.set_ylim(0, 0.66)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Properties of Electrical Materials - 3-5 questions
# ---------------------------------------------------------------------------


@figure("mat-resistivity-temp")
def _(mode):
    """Resistance against temperature: linear metals, exponential thermistor.

    Left panel: R/R20 = 1 + alpha (T - 20) with the tabulated coefficients
    for copper (0.00393 per deg C) and tungsten (0.0045 per deg C). Right
    panel: an NTC thermistor R/R25 = exp[B (1/T - 1/298.15)] with the common
    catalogue value B = 3950 K, on a log axis because the change spans nearly
    three decades. Same x-range, so the shapes can be compared honestly.
    """
    c = S.SERIES[mode]
    T = np.linspace(-25, 150, 400)
    cu = 1 + 0.00393 * (T - 20)
    w = 1 + 0.0045 * (T - 20)
    Tk = T + 273.15
    ntc = np.exp(3950.0 * (1.0 / Tk - 1.0 / 298.15))

    fig, (ax, bx) = plt.subplots(1, 2, figsize=(8.4, 4.3))
    ax.plot(T, cu, color=c[0], lw=2.2)
    ax.plot(T, w, color=c[1], lw=2.2)
    S.label_end(ax, T[-1], cu[-1], "copper\nalpha 0.00393", c[0], mode, dy=-10)
    S.label_end(ax, T[-1], w[-1], "tungsten\nalpha 0.0045", c[1], mode, dy=8)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("temperature  (deg C)")
    ax.set_ylabel("R / R at 20 deg C")
    ax.set_title("Metals: linear rise")
    ax.set_xlim(-25, 205)
    ax.set_ylim(0.75, 1.75)
    S.strip(ax)

    bx.semilogy(T, ntc, color=c[2], lw=2.2)
    S.label_end(bx, T[-1], ntc[-1], "NTC thermistor\nB = 3950 K", c[2], mode,
                dy=6)
    bx.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(bx, -20, 1.25, "50x drop from\n25 to 150 deg C", mode)
    bx.set_xlabel("temperature  (deg C)")
    bx.set_ylabel("R / R at 25 deg C")
    bx.set_title("Semiconductor: exponential fall")
    bx.set_xlim(-25, 205)
    S.strip(bx)
    fig.tight_layout()
    return fig


@figure("mat-carrier-ni")
def _(mode):
    """Intrinsic carrier concentration against temperature for Si and Ge.

    n_i(T) proportional to T^1.5 exp(-Eg / 2kT), normalised to its own 300 K
    value, with the tabulated gaps Eg = 1.12 eV (Si) and 0.66 eV (Ge) and
    k = 8.617e-5 eV/K. The log axis shows why a few tens of degrees change
    leakage by orders of magnitude, and why the wider gap wins at high
    temperature.
    """
    c = S.SERIES[mode]
    k = 8.617e-5
    T = np.linspace(250, 450, 400)

    fig, ax = plt.subplots()
    for i, (Eg, lab) in enumerate([(1.12, "silicon  Eg = 1.12 eV"),
                                   (0.66, "germanium  Eg = 0.66 eV")]):
        ni = (T / 300.0) ** 1.5 * np.exp(-Eg / (2 * k) * (1 / T - 1 / 300.0))
        ax.semilogy(T - 273.15, ni, color=c[i], lw=2.2)
        S.label_end(ax, T[-1] - 273.15, ni[-1], lab, c[i], mode,
                    dy=4 if i == 0 else -4)
    ax.axvline(27, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 29, 3e-4, "300 K reference", mode)
    ax.set_xlabel("temperature  (deg C)")
    ax.set_ylabel("n_i(T) / n_i(300 K)")
    ax.set_title("The band gap sets how fast carriers multiply with heat")
    ax.set_xlim(-25, 255)
    S.strip(ax)
    return fig


@figure("mat-diode-iv")
def _(mode):
    """The Shockley diode equation on linear and logarithmic axes.

    I = Is (exp(V/VT) - 1) with Is = 1e-12 A and VT = 25.85 mV at 300 K,
    plotted twice from the same array. The linear panel shows the apparent
    "knee"; the log panel shows there is no knee at all - just a straight
    line climbing one decade every 59.5 mV, which is VT ln 10.
    """
    c = S.SERIES[mode]
    Is, VT = 1e-12, 0.02585
    V = np.linspace(0.30, 0.75, 400)
    I = Is * (np.exp(V / VT) - 1.0)

    fig, (ax, bx) = plt.subplots(1, 2, figsize=(8.4, 4.3))
    ax.plot(V, I * 1000, color=c[0], lw=2.2)
    ax.axvline(0.7, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.33, 250, "the 0.7 V 'knee' is\nan artifact of the\nlinear scale", mode)
    ax.set_xlabel("forward voltage  (V)")
    ax.set_ylabel("current  (mA)")
    ax.set_title("Linear axes: a knee")
    ax.set_xlim(0.30, 0.78)
    ax.set_ylim(0, 420)
    S.strip(ax)

    bx.semilogy(V, I, color=c[0], lw=2.2)
    v1, v2 = 0.45, 0.55
    i1 = Is * (exp(v1 / VT) - 1)
    bx.plot([v1, v2], [i1, i1], color=S.GUIDE[mode], lw=1.1)
    bx.plot([v2, v2], [i1, Is * (exp(v2 / VT) - 1)],
            color=S.GUIDE[mode], lw=1.1)
    S.note(bx, 0.56, 3e-5, "one decade per\n59.5 mV = VT ln 10", mode)
    bx.set_xlabel("forward voltage  (V)")
    bx.set_ylabel("current  (A)")
    bx.set_title("Log axis: pure exponential")
    bx.set_xlim(0.30, 0.78)
    S.strip(bx)
    fig.tight_layout()
    return fig


@figure("mat-dielectric-energy")
def _(mode):
    """Stored energy density against field for three dielectrics.

    u = (1/2) eps_r eps_0 E^2 for each material, drawn only up to that
    material's tabulated breakdown strength and stopped there with a marker:
    air (eps_r = 1, 3 MV/m), mica (eps_r = 6, 150 MV/m) and a class-2
    ceramic (eps_r = 2000, 20 MV/m). Log-log, because the endpoints span
    seven decades of energy density - the whole reason capacitor volumes
    differ so much.
    """
    c = S.SERIES[mode]
    e0 = 8.854e-12
    mats = [("air", 1.0, 3e6, c[2]),
            ("mica", 6.0, 150e6, c[0]),
            ("class-2 ceramic", 2000.0, 20e6, c[1])]

    fig, ax = plt.subplots()
    for lab, er, ebd, col in mats:
        E = np.logspace(5.5, np.log10(ebd), 200)
        u = 0.5 * er * e0 * E ** 2
        ax.loglog(E / 1e6, u, color=col, lw=2.2)
        ax.plot([ebd / 1e6], [0.5 * er * e0 * ebd ** 2], "o", color=col, ms=7)
        S.label_end(ax, ebd / 1e6, 0.5 * er * e0 * ebd ** 2, lab, col, mode,
                    dx=7, dy=-2)
    S.note(ax, 0.5, 3e4, "each curve stops at its own\nbreakdown field", mode)
    ax.set_xlabel("electric field  (MV/m)")
    ax.set_ylabel("energy density  (J/m^3)")
    ax.set_title("Permittivity sets the slope; breakdown sets where it ends")
    ax.set_xlim(0.3, 3e3)
    S.strip(ax)
    return fig


@figure("mat-bh-loops")
def _(mode):
    """Soft and hard hysteresis loops from one stated magnetisation model.

    Schematic in the sense that no measured material data is used: both
    branches are B = tanh((H -/+ Hc)/a), a standard saturating model, with a
    small coercivity (0.15) for the soft loop and a large one (2.0) for the
    hard loop. The enclosed area - the per-cycle loss the lesson defines -
    is visibly tiny for one and huge for the other, which is the entire
    soft/hard distinction.
    """
    c = S.SERIES[mode]
    H = np.linspace(-5, 5, 500)

    fig, ax = plt.subplots(figsize=(6.6, 5.2))
    for (Hc, a, col, lab) in [(0.15, 0.55, c[0], "soft: transformer core"),
                              (2.0, 0.80, c[1], "hard: permanent magnet")]:
        up = np.tanh((H - Hc) / a)
        dn = np.tanh((H + Hc) / a)
        ax.plot(H, up, color=col, lw=2.2)
        ax.plot(H, dn, color=col, lw=2.2)
        ax.fill_between(H, up, dn, color=col, alpha=0.13, lw=0)
        S.label_end(ax, 3.6, np.tanh((3.6 - Hc) / a), lab, col, mode,
                    dy=10 if Hc < 1 else -13)
    # mark remanence and coercivity on the hard loop
    Br = np.tanh(2.0 / 0.8)
    ax.plot([0], [Br], "o", color=c[1], ms=7)
    S.note(ax, 0.15, Br + 0.06, "remanence Br", mode)
    ax.plot([2.0], [0], "o", color=c[1], ms=7)
    S.note(ax, 2.1, -0.18, "coercivity Hc", mode)
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)
    ax.set_xlabel("applied field  H  (normalised)")
    ax.set_ylabel("flux density  B / B_sat")
    ax.set_title("Loop area is energy lost per cycle: keep it small, or use it")
    ax.set_xlim(-5.2, 7.6)
    ax.set_ylim(-1.35, 1.45)
    S.strip(ax)
    return fig


@figure("mat-core-loss")
def _(mode):
    """Hysteresis and eddy-current loss against frequency, log-log.

    P_h = k_h f and P_e = k_e f^2, with the constants chosen equal at 1 kHz
    so the crossover is visible on the plot; the physics is in the slopes
    (1 and 2 on log axes), not the absolute level. Above the crossover the
    f-squared term owns the total, which is why high-frequency magnetics
    move from laminations to ferrites.
    """
    c = S.SERIES[mode]
    f = np.logspace(1, 5, 300)
    ph = f / 1000.0
    pe = (f / 1000.0) ** 2
    tot = ph + pe

    fig, ax = plt.subplots()
    ax.loglog(f, ph, color=c[0], lw=2.0)
    ax.loglog(f, pe, color=c[1], lw=2.0)
    ax.loglog(f, tot, color=c[2], lw=2.4)
    S.label_end(ax, f[-1], ph[-1], "hysteresis ~ f", c[0], mode, dy=-4)
    S.label_end(ax, f[-1], pe[-1], "eddy ~ f^2", c[1], mode, dy=-8)
    S.label_end(ax, f[-1], tot[-1], "total", c[2], mode, dy=8)
    ax.plot([1000], [1.0], "o", color=S.GUIDE[mode], ms=7)
    S.note(ax, 1000, 0.004, "crossover: equal\ncontributions", mode,
           ha="center")
    ax.set_xlabel("frequency  (Hz)")
    ax.set_ylabel("core loss  (relative)")
    ax.set_title("Slope 1 meets slope 2: eddy loss takes over with frequency")
    ax.set_xlim(10, 8e5)
    ax.set_ylim(5e-5, 4e5)
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
