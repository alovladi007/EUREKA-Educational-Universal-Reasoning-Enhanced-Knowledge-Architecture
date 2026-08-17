#!/usr/bin/env python3
"""Depth-wave-27 figures for the FE Electrical and Computer course:
the chapters `fee_regression` and `fee_hypothesis`.

Same contract as gen_fe_ee_d8.py, and it imports the SAME style module rather
than growing a second look. Every point, curve, band and bar below is COMPUTED
here from a formula or a dataset that the lesson referencing it prints in full,
so a reader can rebuild any ordinate on the page from the printed table.
Nothing is traced, scanned or adapted from the NCEES Reference Handbook, from a
study guide or from any textbook.

Special functions are built from `math`/`scipy` primitives whose definitions the
lessons write out, never copied off a printed table:

    Phi(z)          -> math.erf, via Phi(z) = (1 + erf(z/sqrt(2)))/2
    t_nu(x)         -> its own density, written from Gamma
    chi2_k(x)       -> its own density, written from Gamma
    F(d1,d2)        -> its own density, written from Gamma
    critical values -> scipy inverse cdf, re-verified by quadrature of the
                       density written above it, to 1e-9 on the tail area

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the tolerance of
the last quoted digit or at 1e-9 where the quantity is exact in closed form.
Least-squares fits are asserted against a SECOND solver (QR or exact rational
arithmetic) and against the orthogonality conditions the normal equations
impose, because a formula checked against itself proves nothing.

Usage:
    python3 scripts/gen_fe_ee_d27.py             # all
    python3 scripts/gen_fe_ee_d27.py prob3-ci    # only names with that prefix
"""
from __future__ import annotations

import math
import pathlib
import sys
from fractions import Fraction

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from scipy import integrate, stats  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith("prob3-"):
        raise ValueError(f"this generator owns the prob3- prefix only: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Densities, each written from the formula the lessons print.
# ---------------------------------------------------------------------------


def phi_pdf(z):
    return np.exp(-0.5 * np.asarray(z, float) ** 2) / math.sqrt(2 * math.pi)


def phi_cdf(z):
    """Standard normal cdf, Phi(z) = (1 + erf(z/sqrt(2)))/2."""
    z = np.asarray(z, float)
    return 0.5 * (1.0 + np.vectorize(math.erf)(z / math.sqrt(2.0)))


def t_pdf(x, v):
    """Student-t density with v degrees of freedom, written from Gamma."""
    x = np.asarray(x, float)
    c = math.gamma((v + 1) / 2) / (math.sqrt(v * math.pi) * math.gamma(v / 2))
    return c * (1 + x * x / v) ** (-(v + 1) / 2)


def chi2_pdf(x, k):
    """Chi-square density with k degrees of freedom, written from Gamma."""
    x = np.asarray(x, float)
    return x ** (k / 2 - 1) * np.exp(-x / 2) / (2 ** (k / 2) * math.gamma(k / 2))


def f_pdf(x, d1, d2):
    """F density, written from Gamma."""
    x = np.asarray(x, float)
    c = (math.gamma((d1 + d2) / 2) / (math.gamma(d1 / 2) * math.gamma(d2 / 2))
         * (d1 / d2) ** (d1 / 2))
    return c * x ** (d1 / 2 - 1) * (1 + d1 * x / d2) ** (-(d1 + d2) / 2)


def crit_t(p, v):
    """Upper-tail-area critical value with the quadrature re-check attached."""
    c = float(stats.t.ppf(p, v))
    area = integrate.quad(lambda z: float(t_pdf(z, v)), -c, c)[0]
    assert abs(area - (2 * p - 1)) < 1e-9, (p, v, area)
    return c


def crit_chi2(p, k):
    c = float(stats.chi2.ppf(p, k))
    area = integrate.quad(lambda z: float(chi2_pdf(z, k)), 0, c)[0]
    assert abs(area - p) < 1e-8, (p, k, area)
    return c


def crit_f(p, d1, d2):
    c = float(stats.f.ppf(p, d1, d2))
    area = integrate.quad(lambda z: float(f_pdf(z, d1, d2)), 0, c)[0]
    assert abs(area - p) < 1e-9, (p, d1, d2, area)
    return c


def ols(x, y):
    """Simple least squares by the normal equations, verified against QR.

    Returns (intercept, slope, Sxx, Sxy, Syy, SSE). The QR route solves the same
    problem by an orthogonal factorisation instead of by forming the cross
    products, so agreement to 1e-11 is evidence about the arithmetic, not about
    the formula. Both orthogonality conditions the normal equations impose are
    asserted on the residual vector as well.
    """
    x = np.asarray(x, float)
    y = np.asarray(y, float)
    n = len(x)
    Sxx = float(((x - x.mean()) ** 2).sum())
    Sxy = float(((x - x.mean()) * (y - y.mean())).sum())
    Syy = float(((y - y.mean()) ** 2).sum())
    b = Sxy / Sxx
    a = y.mean() - b * x.mean()
    X = np.column_stack([np.ones(n), x])
    Q, R = np.linalg.qr(X)
    beta_qr = np.linalg.solve(R, Q.T @ y)
    assert abs(beta_qr[0] - a) < 1e-10 and abs(beta_qr[1] - b) < 1e-11, beta_qr
    res = y - (a + b * x)
    assert abs(float(res.sum())) < 1e-9, res.sum()
    assert abs(float((res * x).sum())) < 1e-8, (res * x).sum()
    return a, b, Sxx, Sxy, Syy, float((res ** 2).sum())


# ---------------------------------------------------------------------------
# The two datasets the regression chapter prints in full.
# ---------------------------------------------------------------------------

# Pressure-transducer calibration: applied pressure (kPa) and output (mV).
CAL_X = np.arange(10.0, 101.0, 10.0)
CAL_Y = np.array([9.3, 14.1, 20.1, 24.1, 29.8, 35.1, 39.8, 43.9, 49.1, 54.7])

# Twelve distribution feeders: lightning ground-flash density Z (flashes per
# square kilometre per year), arresters per km X, flashovers per 100 km-year Y.
FEED_Z = np.array([1., 1., 1., 2., 2., 2., 3., 3., 3., 4., 4., 4.])
FEED_X = np.array([2., 3., 4., 4., 5., 6., 6., 7., 8., 8., 9., 10.])
FEED_Y = np.array([37., 32., 30., 41., 39., 37., 48., 46., 41., 55., 49., 49.])

# Eight insulation coupons: stress (kV/mm) and time to breakdown (h).
LIFE_V = np.arange(8.0, 16.0)
LIFE_T = np.array([3880., 2740., 814., 453., 280., 196., 184., 131.])

# Ten fibre splices: insertion loss (dB) before and after a re-polish.
SPL_B = np.array([0.42, 0.55, 0.38, 0.61, 0.49, 0.71, 0.34, 0.58, 0.46, 0.66])
SPL_A = np.array([0.35, 0.47, 0.33, 0.50, 0.44, 0.59, 0.31, 0.49, 0.40, 0.55])

# Three assembly lines: solder-joint pull strength (N), five boards each.
ANOVA_G = (np.array([42., 45., 39., 44., 40.]),
           np.array([47., 50., 46., 49., 48.]),
           np.array([44., 41., 45., 43., 42.]))


# ---------------------------------------------------------------------------
# fee_regression
# ---------------------------------------------------------------------------


@figure("prob3-ls-objective")
def _(mode):
    """The sum of squared residuals as a surface, and its slope cross-section.

    S(a, b) = sum (y_i - a - b x_i)^2 on the calibration data. The left panel
    contours S over the (a, b) plane; the right panel is the profile obtained by
    holding a at its optimum, which is an exact parabola S = SSE + Sxx (b - bhat)^2.
    """
    c = S.SERIES[mode]
    x, y = CAL_X, CAL_Y
    a_hat, b_hat, Sxx, Sxy, Syy, SSE = ols(x, y)
    assert abs(a_hat - 4.5) < 1e-12 and abs(b_hat - 0.5) < 1e-13, (a_hat, b_hat)
    assert abs(Sxx - 8250.0) < 1e-9 and abs(Sxy - 4125.0) < 1e-9
    assert abs(SSE - 1.82) < 1e-9, SSE

    def Sfun(A, B):
        return sum((y[i] - A - B * x[i]) ** 2 for i in range(len(x)))

    # the profile identity, checked at three slopes away from the optimum
    for db in (-0.02, 0.013, 0.05):
        assert abs(Sfun(y.mean() - (b_hat + db) * x.mean(), b_hat + db)
                   - (SSE + Sxx * db ** 2)) < 1e-9, db

    fig, axes = plt.subplots(1, 2, figsize=(7.8, 3.9))

    A = np.linspace(1.0, 8.0, 260)
    B = np.linspace(0.44, 0.56, 260)
    AA, BB = np.meshgrid(A, B)
    ZZ = np.zeros_like(AA)
    for i in range(len(x)):
        ZZ += (y[i] - AA - BB * x[i]) ** 2
    levels = SSE + np.array([0.5, 2, 6, 15, 35, 75, 150])
    axes[0].contour(AA, BB, ZZ, levels=levels, colors=S.GRID[mode], linewidths=0.9)
    axes[0].plot([a_hat], [b_hat], "o", color=c[0], ms=8, zorder=5)
    S.note(axes[0], 4.9, 0.5045, "minimum at\na = 4.5, b = 0.5", mode)
    axes[0].set_xlabel("intercept a  (mV)")
    axes[0].set_ylabel("slope b  (mV/kPa)")
    axes[0].set_title("S(a, b) contours", fontsize=11)

    bb = np.linspace(0.44, 0.56, 400)
    prof = SSE + Sxx * (bb - b_hat) ** 2
    axes[1].plot(bb, prof, color=c[0], lw=2.2)
    axes[1].axhline(SSE, color=S.GUIDE[mode], lw=1.0, ls="--")
    axes[1].plot([b_hat], [SSE], "o", color=c[0], ms=7, zorder=5)
    S.note(axes[1], 0.503, 22, "S = 1.82 + 8250 (b - 0.5)$^2$", mode)
    S.note(axes[1], 0.4415, 3.6, "SSE = 1.82", mode)
    axes[1].set_xlabel("slope b  (mV/kPa)")
    axes[1].set_ylabel("sum of squared residuals  (mV$^2$)")
    axes[1].set_title("profile at the best intercept", fontsize=11)
    axes[1].set_ylim(0, 125)

    for ax in axes:
        S.strip(ax)
    fig.suptitle("Least squares is the bottom of a bowl", fontsize=12,
                 color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-calibration-fit")
def _(mode):
    """The calibration fit with its residual stems, and the residuals alone."""
    c = S.SERIES[mode]
    x, y = CAL_X, CAL_Y
    a, b, Sxx, Sxy, Syy, SSE = ols(x, y)
    res = y - (a + b * x)
    # the residuals are exactly the offsets used to build the table
    want = np.array([-0.2, -0.4, 0.6, -0.4, 0.3, 0.6, 0.3, -0.6, -0.4, 0.2])
    assert float(np.max(np.abs(res - want))) < 1e-12, res
    R2 = 1 - SSE / Syy
    assert abs(R2 - 0.9991183537436056) < 1e-12, R2
    # exact rational arithmetic as a third route to the same slope
    xf = [Fraction(int(v)) for v in x]
    yf = [Fraction(str(v)) for v in y]
    nF = Fraction(len(x))
    bF = ((sum(p * q for p, q in zip(xf, yf)) - sum(xf) * sum(yf) / nF)
          / (sum(v * v for v in xf) - sum(xf) ** 2 / nF))
    assert bF == Fraction(1, 2), bF

    fig, axes = plt.subplots(1, 2, figsize=(7.8, 3.9))
    xs = np.linspace(0, 108, 200)
    axes[0].plot(xs, a + b * xs, color=c[0], lw=2.0)
    for xi, yi in zip(x, y):
        axes[0].plot([xi, xi], [a + b * xi, yi], color=S.GUIDE[mode], lw=1.0)
    axes[0].plot(x, y, "o", color=c[1], ms=6, zorder=5)
    S.note(axes[0], 6, 47, "$\\hat{y}$ = 4.5 + 0.5x\nR$^2$ = 0.9991\ns = 0.477 mV", mode)
    axes[0].set_xlabel("applied pressure  (kPa)")
    axes[0].set_ylabel("transducer output  (mV)")
    axes[0].set_title("the fitted calibration", fontsize=11)
    axes[0].set_xlim(0, 108)

    axes[1].axhline(0, color=S.GUIDE[mode], lw=1.1)
    axes[1].plot(x, res, "o", color=c[1], ms=6)
    for xi, ri in zip(x, res):
        axes[1].plot([xi, xi], [0, ri], color=S.GUIDE[mode], lw=1.0)
    S.note(axes[1], 12, 0.68, "no curvature, no funnel, no drift", mode)
    axes[1].set_xlabel("applied pressure  (kPa)")
    axes[1].set_ylabel("residual  (mV)")
    axes[1].set_title("residuals against x", fontsize=11)
    axes[1].set_ylim(-0.9, 0.9)
    axes[1].set_xlim(0, 108)

    for ax in axes:
        S.strip(ax)
    fig.suptitle("Ten calibration points and what the line left behind",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-ci-vs-pi")
def _(mode):
    """Confidence band for the mean response against prediction band for one unit.

    Both use the same s and the same t(0.975, 8); the prediction band carries the
    extra 1 under the square root, which is the variance of the new observation
    itself. The bands are hyperbolas, narrowest at xbar.
    """
    c = S.SERIES[mode]
    x, y = CAL_X, CAL_Y
    n = len(x)
    a, b, Sxx, Sxy, Syy, SSE = ols(x, y)
    s = math.sqrt(SSE / (n - 2))
    tc = crit_t(0.975, n - 2)
    assert abs(s - 0.47696960070847316) < 1e-12, s
    assert abs(tc - 2.306004135204166) < 1e-12, tc

    grid = np.linspace(5, 105, 400)
    lev = 1 / n + (grid - x.mean()) ** 2 / Sxx
    yh = a + b * grid
    ci = tc * s * np.sqrt(lev)
    pi = tc * s * np.sqrt(1 + lev)

    lev75 = 1 / n + (75 - x.mean()) ** 2 / Sxx
    assert abs(lev75 - 0.1484848484848485) < 1e-12, lev75
    assert abs(tc * s * math.sqrt(lev75) - 0.4238301543408125) < 1e-12
    assert abs(tc * s * math.sqrt(1 + lev75) - 1.1787275039264653) < 1e-12
    # at xbar the two half-widths are s*t/sqrt(n) and s*t*sqrt(1 + 1/n)
    assert abs(tc * s * math.sqrt(1 / n) - 0.3478169818718113) < 1e-12
    assert abs(tc * s * math.sqrt(1 + 1 / n) - 1.1535784245826441) < 1e-12

    # Plotted against the fitted line rather than against zero: the bands are
    # about one millivolt wide on a sixty-millivolt axis, so on the raw scale
    # they would be two invisible hairlines. Subtracting yhat(x) keeps every
    # number identical and makes the two widths readable.
    fig, ax = plt.subplots()
    ax.fill_between(grid, -pi, pi, color=c[1], alpha=0.20, lw=0)
    ax.fill_between(grid, -ci, ci, color=c[0], alpha=0.32, lw=0)
    ax.axhline(0, color=c[0], lw=2.0)
    ax.plot(x, y - (a + b * x), "o", color=S.INK[mode], ms=5.5, zorder=5)
    j = int(np.argmin(abs(grid - 75)))
    ax.plot([75, 75], [-pi[j], pi[j]], color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot([75, 75], [-ci[j], ci[j]], color=S.INK[mode], lw=2.4, solid_capstyle="butt")
    S.label_end(ax, 100, ci[-1], "mean response", c[0], mode, dy=-11, ha="right")
    S.label_end(ax, 100, pi[-1], "one new unit", c[1], mode, dy=7, ha="right")
    S.note(ax, 9, 1.28, "at x = 75 kPa the fit is 42.00 mV:\n"
                        "mean  42.00 $\\pm$ 0.42 mV\n"
                        "next unit  42.00 $\\pm$ 1.18 mV", mode)
    S.note(ax, 47, -1.62, "both bands are narrowest at $\\bar{x}$ = 55 kPa", mode)
    ax.set_xlabel("applied pressure  (kPa)")
    ax.set_ylabel("departure from the fitted line  (mV)")
    ax.set_title("Two intervals, one fit, different questions")
    ax.set_xlim(5, 105)
    ax.set_ylim(-1.85, 1.85)
    S.strip(ax)
    return fig


@figure("prob3-residual-gallery")
def _(mode):
    """Four residual plots, each generated from a stated model.

    healthy   y = 4.5 + 0.5x + e with the calibration offsets
    curvature y = 2 + 0.5x + 0.04x^2 fitted by a straight line
    funnel    e_i = 0.014 x_i s_i with s alternating in sign and growing in size
    leverage  the healthy set with the point at x = 100 pulled down 3 mV
    """
    c = S.SERIES[mode]
    x = CAL_X
    off = np.array([-0.2, -0.4, 0.6, -0.4, 0.3, 0.6, 0.3, -0.6, -0.4, 0.2])
    sgn = np.array([1., -1., 1., -1., 1., -1., 1., -1., 1., -1.])

    panels = []
    y1 = 4.5 + 0.5 * x + off
    panels.append(("adequate model", y1, "patternless band"))

    y2 = 2 + 0.5 * x + 0.04 * x ** 2
    panels.append(("curvature", y2, "a line cannot bend"))

    y3 = 4.5 + 0.5 * x + 0.014 * x * sgn
    panels.append(("non-constant spread", y3, "scatter grows in proportion to x"))

    y4 = y1.copy()
    y4[-1] -= 3.0
    panels.append(("one influential point", y4, "h = 0.345 at x = 100;\nthe slope moved 0.500 to 0.484"))

    # assertions on the shapes each panel is supposed to show
    a2, b2, *_ = ols(x, y2)
    r2 = y2 - (a2 + b2 * x)
    assert r2[0] > 0 and r2[4] < 0 and r2[-1] > 0, r2      # a clean U
    assert abs(b2 - 4.9) < 1e-12, b2                        # 0.5 + 0.04*(2*xbar)
    a3, b3, *_ = ols(x, y3)
    r3 = y3 - (a3 + b3 * x)
    assert float(np.abs(r3[-3:]).mean()) > 2.9 * float(np.abs(r3[:3]).mean()), r3
    a4, b4, *_ = ols(x, y4)
    assert abs(b4 - 0.48363636363636364) < 1e-14, b4       # slope dragged down
    h_last = 1 / 10 + (100 - x.mean()) ** 2 / 8250
    assert abs(h_last - 0.34545454545454546) < 1e-12, h_last

    fig, axes = plt.subplots(2, 2, figsize=(7.8, 5.2))
    for ax, (title, yy, msg) in zip(axes.ravel(), panels):
        aa, bb, *_ = ols(x, yy)
        rr = yy - (aa + bb * x)
        ax.axhline(0, color=S.GUIDE[mode], lw=1.1)
        ax.plot(x, rr, "o-", color=c[0], lw=1.2, ms=5)
        ax.set_title(title, fontsize=10.5)
        ax.set_xlabel("x", fontsize=9.5)
        ax.set_ylabel("residual", fontsize=9.5)
        lim = max(1.0, 1.45 * float(np.abs(rr).max()))
        ax.set_ylim(-lim, lim)
        S.note(ax, 12, -0.95 * lim, msg, mode, size=8.5)
        S.strip(ax)
    fig.suptitle("The residual plot is the shape check R$^2$ cannot make",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-confounded")
def _(mode):
    """Twelve feeders: the overall slope in x is positive, every within-zone slope negative.

    The points are the printed table. The long line is the simple regression of Y
    on X; the four short lines are the least-squares fits inside each lightning
    zone, where Z is held fixed.
    """
    c = S.SERIES[mode]
    a_s, b_s, Sxx, Sxy, Syy, SSE = ols(FEED_X, FEED_Y)
    assert abs(b_s - 156 / 68) < 1e-13, b_s
    assert abs(a_s - (42 - (156 / 68) * 6)) < 1e-12, a_s
    assert abs(Sxx - 68) < 1e-12 and abs(Sxy - 156) < 1e-12 and abs(Syy - 624) < 1e-12

    # multiple regression by the 2x2 normal equations, re-solved by QR
    Szz = float(((FEED_Z - FEED_Z.mean()) ** 2).sum())
    Sxz = float(((FEED_X - FEED_X.mean()) * (FEED_Z - FEED_Z.mean())).sum())
    Szy = float(((FEED_Z - FEED_Z.mean()) * (FEED_Y - FEED_Y.mean())).sum())
    det = Sxx * Szz - Sxz ** 2
    bX = (Sxy * Szz - Szy * Sxz) / det
    bZ = (Szy * Sxx - Sxy * Sxz) / det
    b0 = FEED_Y.mean() - bX * FEED_X.mean() - bZ * FEED_Z.mean()
    M = np.column_stack([np.ones(12), FEED_X, FEED_Z])
    Q, R = np.linalg.qr(M)
    beta = np.linalg.solve(R, Q.T @ FEED_Y)
    assert float(np.max(np.abs(beta - np.array([b0, bX, bZ])))) < 1e-10, beta
    assert abs(bX + 3.0) < 1e-11 and abs(bZ - 12.0) < 1e-11 and abs(b0 - 30.0) < 1e-10
    resm = FEED_Y - M @ beta
    assert abs(float(resm.sum())) < 1e-10
    assert abs(float((resm * FEED_X).sum())) < 1e-9
    assert abs(float((resm * FEED_Z).sum())) < 1e-9
    assert abs(float((resm ** 2).sum()) - 12.0) < 1e-9

    fig, ax = plt.subplots()
    xs = np.linspace(1.4, 10.6, 100)
    ax.plot(xs, a_s + b_s * xs, color=S.GUIDE[mode], lw=2.2, ls="--")
    marks = ["o", "s", "^", "D"]
    for z, mk in zip((1, 2, 3, 4), marks):
        m = FEED_Z == z
        ax.plot(FEED_X[m], FEED_Y[m], mk, color=c[0], ms=7, zorder=5)
        az, bz, *_ = ols(FEED_X[m], FEED_Y[m])
        xz = np.linspace(FEED_X[m].min() - 0.35, FEED_X[m].max() + 0.35, 20)
        ax.plot(xz, az + bz * xz, color=c[1], lw=2.0)
        S.note(ax, FEED_X[m].min() - 1.35, az + bz * FEED_X[m].min() + 0.9,
               f"Z = {z}", mode, size=9)
    S.label_end(ax, 9.4, a_s + b_s * 9.4, "ignoring Z:  slope +2.29", S.GUIDE[mode],
                mode, dy=13, ha="right")
    S.label_end(ax, 5.3, 30.2, "holding Z fixed:  slope -3", c[1], mode, dy=0)
    ax.set_xlabel("surge arresters installed  (per km of line)")
    ax.set_ylabel("insulator flashovers  (per 100 km per year)")
    ax.set_title("The same twelve feeders, two opposite slopes")
    ax.set_xlim(0.6, 11.4)
    ax.set_ylim(26, 59)
    S.strip(ax)
    return fig


@figure("prob3-log-bias")
def _(mode):
    """The log-transform fit, its back-transform, and the raw-scale fit.

    Left: ln t against stress is a straight line by construction of the model
    t = C exp(kV); the fit is the least-squares line in those coordinates.
    Right: the same fit exponentiated, next to a direct least-squares fit on the
    raw scale. They differ because squaring errors in ln t and squaring errors in
    t are different objectives.
    """
    c = S.SERIES[mode]
    V, T = LIFE_V, LIFE_T
    L = np.log(T)
    lnC, k, Sxx, Sxy, Syy, SSE = ols(V, L)
    assert abs(k + 0.49970569782629376) < 1e-12, k
    assert abs(lnC - 11.996639708339242) < 1e-11, lnC
    sig2 = SSE / (len(V) - 2)
    assert abs(sig2 - 0.1413737283646858) < 1e-12, sig2
    smear = math.exp(sig2 / 2)
    assert abs(smear - 1.0732451017623688) < 1e-12, smear
    duan = float(np.mean(np.exp(L - (lnC + k * V))))
    assert abs(duan - 1.0537887287372465) < 1e-12, duan

    # raw-scale least squares, by Gauss-Newton written out here rather than
    # imported, so the comparison is between two solvers we can both see
    C_, k_ = 5.0e5, -0.6
    for _ in range(200):
        f = C_ * np.exp(k_ * V)
        J = np.column_stack([np.exp(k_ * V), C_ * V * np.exp(k_ * V)])
        step = np.linalg.lstsq(J, T - f, rcond=None)[0]
        C_ += step[0]
        k_ += step[1]
    assert abs(k_ + 0.615847) < 2e-5, k_
    assert abs(C_ - 557637) < 40, C_
    # the two objectives really do rank the two fits in opposite directions
    pl = np.exp(lnC + k * V)
    pn = C_ * np.exp(k_ * V)
    assert float(((T - pn) ** 2).sum()) < float(((T - pl) ** 2).sum())
    assert float((((T - pl) / T) ** 2).sum()) < float((((T - pn) / T) ** 2).sum())

    fig, axes = plt.subplots(1, 2, figsize=(7.8, 3.9))
    vs = np.linspace(7.6, 15.6, 200)
    axes[0].plot(vs, lnC + k * vs, color=c[0], lw=2.0)
    axes[0].plot(V, L, "o", color=c[1], ms=6, zorder=5)
    S.note(axes[0], 8.1, 4.85, "ln t = 11.997 - 0.4997 V\nR$^2$ = 0.9252", mode)
    axes[0].set_xlabel("stress  (kV/mm)")
    axes[0].set_ylabel("ln(time to breakdown / h)")
    axes[0].set_title("straight in log coordinates", fontsize=11)

    axes[1].plot(vs, np.exp(lnC + k * vs), color=c[0], lw=2.0)
    axes[1].plot(vs, C_ * np.exp(k_ * vs), color=c[1], lw=2.0, ls="--")
    axes[1].plot(V, T, "o", color=S.INK[mode], ms=5, zorder=5)
    S.label_end(axes[1], 12.6, math.exp(lnC + k * 12.6), "fit in ln t", c[0], mode, dy=10)
    S.label_end(axes[1], 9.6, C_ * math.exp(k_ * 9.6), "fit in t", c[1], mode, dy=12)
    axes[1].set_xlabel("stress  (kV/mm)")
    axes[1].set_ylabel("time to breakdown  (h)")
    axes[1].set_title("back on the measured scale", fontsize=11)
    axes[1].set_ylim(0, 4200)

    for ax in axes:
        S.strip(ax)
    fig.suptitle("Taking logs changes the question least squares answers",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-adjusted-r2")
def _(mode):
    """What the adjustment costs: adjusted R^2 against the number of predictors.

    Both curves are the identity 1 - (1 - R^2)(n - 1)/(n - k - 1) evaluated at
    n = 12, for a model whose unadjusted R^2 stays pinned while predictors are
    added. The unadjusted line is flat by construction; the adjusted one falls.
    """
    c = S.SERIES[mode]
    n = 12
    ks = np.arange(1, 9)

    def adj(R2, k):
        return 1 - (1 - R2) * (n - 1) / (n - k - 1)

    fig, ax = plt.subplots()
    for R2, col in ((0.98, c[0]), (0.60, c[1])):
        ax.plot(ks, [adj(R2, k) for k in ks], "o-", color=col, lw=2.0, ms=5)
        ax.axhline(R2, color=S.GUIDE[mode], lw=1.0, ls="--")
    assert abs(adj(0.98, 2) - 0.9755555555555556) < 1e-12, adj(0.98, 2)
    assert abs(adj(0.60, 2) - 0.5111111111111111) < 1e-12, adj(0.60, 2)
    assert abs(adj(0.60, 6) - 0.11999999999999988) < 1e-12, adj(0.60, 6)
    # the exact value the lesson quotes for the feeder model
    assert abs((1 - (1 - 612 / 624) * 11 / 9) - 0.9764957264957265) < 1e-13
    S.label_end(ax, 8, adj(0.98, 8), "R$^2$ = 0.98", c[0], mode, dy=-12, ha="right")
    S.label_end(ax, 8, adj(0.60, 8), "R$^2$ = 0.60", c[1], mode, dy=-12, ha="right")
    S.note(ax, 1.2, 0.20, "n = 12 observations throughout;\nthe gap is the cost of a"
                          " degree of freedom", mode)
    ax.set_xlabel("number of predictors k")
    ax.set_ylabel("adjusted R$^2$")
    ax.set_title("Adding predictors is never free")
    ax.set_ylim(0, 1.05)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# fee_hypothesis
# ---------------------------------------------------------------------------


@figure("prob3-null-and-pvalue")
def _(mode):
    """The null distribution of t with 9 df, the observed statistic, and the p-value.

    Curve is the Student-t density written from Gamma; the shaded region is the
    two-tailed area beyond the observed |t| = 2.60, integrated numerically.
    """
    c = S.SERIES[mode]
    v, tobs = 9, 2.60
    xs = np.linspace(-4.6, 4.6, 900)
    dens = t_pdf(xs, v)
    tail = 2 * integrate.quad(lambda z: float(t_pdf(z, v)), tobs, np.inf)[0]
    assert abs(tail - 2 * float(stats.t.sf(tobs, v))) < 1e-11, tail
    assert abs(tail - 0.028738227044155573) < 1e-11, tail
    tc = crit_t(0.975, v)
    assert abs(tc - 2.2621571628540993) < 1e-12, tc

    fig, ax = plt.subplots()
    ax.plot(xs, dens, color=c[0], lw=2.1)
    for lo, hi in ((tobs, 4.6), (-4.6, -tobs)):
        m = (xs >= lo) & (xs <= hi)
        ax.fill_between(xs[m], 0, dens[m], color=c[1], alpha=0.45, lw=0)
    for xv in (tc, -tc):
        ax.plot([xv, xv], [0, float(t_pdf(xv, v))], color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot([tobs], [0], "o", color=S.INK[mode], ms=7, zorder=6, clip_on=False)
    S.note(ax, 2.72, 0.055, "observed t = 2.60", mode)
    S.note(ax, -4.55, 0.345, "shaded area = p = 0.0287\n"
                             "dashed lines: $\\pm$2.262, the 5% cutoffs", mode)
    S.note(ax, -4.55, 0.20, "every probability on this axis\nis conditional on H$_0$", mode)
    ax.set_xlabel("value of the test statistic under H$_0$")
    ax.set_ylabel("probability density")
    ax.set_title("What the p-value measures, and where it lives")
    ax.set_ylim(0, 0.42)
    S.strip(ax)
    return fig


@figure("prob3-power-curve")
def _(mode):
    """Power of the one-sided z test against sample size and against the true mean.

    Both panels evaluate 1 - beta = Phi(delta sqrt(n)/sigma - z_alpha) with
    sigma = 0.08 mm and alpha = 0.05, the numbers the lesson works.
    """
    c = S.SERIES[mode]
    sigma, alpha = 0.08, 0.05
    za = float(stats.norm.ppf(1 - alpha))
    assert abs(za - 1.6448536269514722) < 1e-12, za

    def power(delta, n):
        return float(phi_cdf(delta * math.sqrt(n) / sigma - za))

    assert abs(power(0.05, 25) - 0.9305829058834144) < 1e-12, power(0.05, 25)
    assert abs(power(0.05, 22) - 0.9008925) < 1e-6, power(0.05, 22)
    assert abs(power(0.05, 21) - 0.8886268) < 1e-6, power(0.05, 21)
    assert abs(power(0.02, 25) - 0.346475457613037) < 1e-12, power(0.02, 25)
    n_req = ((za + float(stats.norm.ppf(0.90))) * sigma / 0.05) ** 2
    assert abs(n_req - 21.92344921771001) < 1e-11, n_req

    fig, axes = plt.subplots(1, 2, figsize=(7.8, 3.9))
    ns = np.arange(2, 81)
    for d, col, xl, dy, ha in ((0.05, c[0], 7, 13, "left"), (0.03, c[1], 44, -16, "center"),
                               (0.02, S.GUIDE[mode], 72, 13, "right")):
        axes[0].plot(ns, [power(d, int(n)) for n in ns], color=col, lw=2.0)
        S.label_end(axes[0], xl, power(d, xl), f"$\\delta$ = {d:g} mm", col, mode,
                    dy=dy, ha=ha, size=9)
    axes[0].axhline(0.90, color=S.GUIDE[mode], lw=1.0, ls="--")
    axes[0].plot([22], [power(0.05, 22)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(axes[0], 30, 0.10, "n = 22 buys 90% power\nfor a 0.05 mm shift", mode)
    axes[0].set_xlabel("sample size n")
    axes[0].set_ylabel("power  1 - $\\beta$")
    axes[0].set_title("power against n", fontsize=11)
    axes[0].set_ylim(0, 1.12)

    mus = np.linspace(1.99, 2.09, 300)
    for nn, col, ml in ((25, c[0], 2.030), (9, c[1], 2.062)):
        axes[1].plot(mus, [float(phi_cdf((mu - 2.0) * math.sqrt(nn) / sigma - za))
                           for mu in mus], color=col, lw=2.0)
        S.label_end(axes[1], ml, power(ml - 2.0, nn), f"n = {nn}", col, mode,
                    dy=-13, ha="center")
    axes[1].axhline(alpha, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(axes[1], 2.028, 0.10, "at $\\mu$ = 2.00 every curve\npasses through $\\alpha$ = 0.05", mode)
    axes[1].set_xlabel("true mean thickness  (mm)")
    axes[1].set_ylabel("probability of rejecting H$_0$")
    axes[1].set_title("power against the truth", fontsize=11)
    axes[1].set_ylim(0, 1.12)

    for ax in axes:
        S.strip(ax)
    fig.suptitle("Power is a function, not a number", fontsize=12,
                 color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-t-vs-z")
def _(mode):
    """Student-t against the standard normal, and the price of not knowing sigma.

    Left: the two densities at 4 and 15 degrees of freedom. Right: the two-sided
    5% critical value as a function of df, approaching 1.960 from above.
    """
    c = S.SERIES[mode]
    xs = np.linspace(-4.4, 4.4, 900)
    fig, axes = plt.subplots(1, 2, figsize=(7.8, 3.9))
    axes[0].plot(xs, phi_pdf(xs), color=S.GUIDE[mode], lw=2.2)
    axes[0].plot(xs, t_pdf(xs, 15), color=c[0], lw=2.0)
    axes[0].plot(xs, t_pdf(xs, 4), color=c[1], lw=2.0)
    S.label_end(axes[0], 0.0, float(phi_pdf(0.0)), "normal", S.GUIDE[mode], mode,
                dy=9, ha="center")
    S.label_end(axes[0], -1.85, float(t_pdf(-1.85, 15)), "t, 15 df", c[0], mode,
                dy=10, ha="right")
    S.label_end(axes[0], 2.9, float(t_pdf(2.9, 4)), "t, 4 df", c[1], mode, dy=12,
                ha="left")
    axes[0].set_xlabel("standardised value")
    axes[0].set_ylabel("probability density")
    axes[0].set_title("fatter tails pay for estimating s", fontsize=11)
    axes[0].set_ylim(0, 0.46)

    vs = np.arange(2, 61)
    cv = [crit_t(0.975, int(v)) for v in vs]
    axes[1].plot(vs, cv, "o-", color=c[0], lw=1.6, ms=3.6)
    zc = float(stats.norm.ppf(0.975))
    axes[1].axhline(zc, color=S.GUIDE[mode], lw=1.2, ls="--")
    assert abs(zc - 1.959963984540054) < 1e-12, zc
    assert abs(cv[list(vs).index(9)] - 2.2621571628540993) < 1e-12
    assert abs(cv[list(vs).index(18)] - 2.10092204024096) < 1e-12
    assert abs(cv[list(vs).index(30)] - 2.0422724563012373) < 1e-12
    S.note(axes[1], 20, 3.4, "df = 9: 2.262\ndf = 18: 2.101\ndf = 30: 2.042", mode)
    S.note(axes[1], 30, 1.72, "z = 1.960, the df $\\to\\ \\infty$ limit", mode)
    axes[1].set_xlabel("degrees of freedom")
    axes[1].set_ylabel("two-sided 5% critical value")
    axes[1].set_title("the multiplier shrinks toward z", fontsize=11)
    axes[1].set_ylim(1.6, 4.6)

    for ax in axes:
        S.strip(ax)
    fig.suptitle("Choosing between t and z is choosing what you know",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-paired-vs-unpaired")
def _(mode):
    """The ten splices, and the two standard errors the same numbers support.

    Left: each splice's before and after loss joined by a line; every line falls,
    which is what pairing sees and pooling does not. Right: the two reference
    distributions, t with 9 df scaled by the paired standard error and t with 18
    df scaled by the pooled one, against the same observed difference.
    """
    c = S.SERIES[mode]
    d = SPL_B - SPL_A
    dbar = float(d.mean())
    sd = float(d.std(ddof=1))
    se_p = sd / math.sqrt(10)
    assert abs(dbar - 0.077) < 1e-12, dbar
    assert abs(float(((d - dbar) ** 2).sum()) - 0.00821) < 1e-12
    assert abs(se_p - 0.009551032521262935) < 1e-12, se_p
    sp2 = (9 * float(SPL_B.std(ddof=1)) ** 2 + 9 * float(SPL_A.std(ddof=1)) ** 2) / 18
    se_u = math.sqrt(sp2 * (1 / 10 + 1 / 10))
    assert abs(se_u - 0.04887739763939975) < 1e-12, se_u
    assert abs(dbar / se_p - 8.061955587375415) < 1e-11
    assert abs(dbar / se_u - 1.5753702880844636) < 1e-11
    rho = float(np.corrcoef(SPL_B, SPL_A)[0, 1])
    assert abs(rho - 0.9944005011095547) < 1e-12, rho
    # the variance identity that explains the whole gap
    idn = (float(SPL_B.std(ddof=1)) ** 2 + float(SPL_A.std(ddof=1)) ** 2
           - 2 * rho * float(SPL_B.std(ddof=1)) * float(SPL_A.std(ddof=1)))
    assert abs(idn - sd ** 2) < 1e-14, (idn, sd ** 2)

    fig, axes = plt.subplots(1, 2, figsize=(7.8, 3.9))
    for i in range(10):
        axes[0].plot([0, 1], [SPL_B[i], SPL_A[i]], "-o", color=c[0], lw=1.3, ms=4,
                     alpha=0.85)
    axes[0].plot([0, 1], [SPL_B.mean(), SPL_A.mean()], "-o", color=c[1], lw=2.6, ms=7)
    S.label_end(axes[0], 1.0, SPL_A.mean(), "means", c[1], mode, dy=-13, ha="right")
    axes[0].set_xticks([0, 1])
    axes[0].set_xticklabels(["before", "after"])
    axes[0].set_xlim(-0.22, 1.22)
    axes[0].set_ylabel("insertion loss  (dB)")
    axes[0].set_title("ten splices, ten drops", fontsize=11)

    xs = np.linspace(-0.12, 0.12, 700)
    axes[1].plot(xs, t_pdf(xs / se_p, 9) / se_p, color=c[0], lw=2.0)
    axes[1].plot(xs, t_pdf(xs / se_u, 18) / se_u, color=c[1], lw=2.0)
    axes[1].axvline(dbar, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.label_end(axes[1], -0.013, float(t_pdf(-0.013 / se_p, 9) / se_p),
                "paired, SE 0.0096", c[0], mode, dy=2, dx=-2, ha="right")
    S.label_end(axes[1], -0.080, float(t_pdf(-0.080 / se_u, 18) / se_u),
                "pooled, SE 0.0489", c[1], mode, dy=11, dx=-4, ha="left")
    S.note(axes[1], 0.0815, 24, "observed\n0.077 dB", mode)
    axes[1].set_xlabel("difference in mean loss under H$_0$  (dB)")
    axes[1].set_ylabel("probability density")
    axes[1].set_title("same data, two null distributions", fontsize=11)

    for ax in axes:
        S.strip(ax)
    fig.suptitle("Pairing is a design decision worth five standard errors",
                 fontsize=12, color=S.INK[mode], fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("prob3-chisq-densities")
def _(mode):
    """Chi-square densities for 1 to 6 df with their upper 5% cutoffs.

    Each density is the formula written above; each cutoff is verified by
    integrating that density from 0 up to the value and checking the area is
    0.950000000 to nine decimals.
    """
    c = S.SERIES[mode]
    xs = np.linspace(0.02, 20, 900)
    fig, ax = plt.subplots()
    for k, col in ((1, c[1]), (2, c[0]), (4, c[0]), (6, c[0])):
        ax.plot(xs, chi2_pdf(xs, k), color=col, lw=2.0,
                alpha=1.0 if k in (1, 6) else 0.55)
        cv = crit_chi2(0.95, k)
        ax.plot([cv], [float(chi2_pdf(cv, k))], "o", color=S.INK[mode], ms=5, zorder=5)
    for k, want in ((1, 3.841458820694124), (2, 5.991464547107979),
                    (3, 7.814727903251179), (4, 9.487729036781154),
                    (5, 11.070497693516355), (6, 12.591587243743977)):
        assert abs(crit_chi2(0.95, k) - want) < 1e-9, k
    S.label_end(ax, 1.5, float(chi2_pdf(1.5, 1)), "df = 1", c[1], mode, dy=-11)
    S.label_end(ax, 2.2, float(chi2_pdf(2.2, 2)), "df = 2", c[0], mode, dy=9)
    S.label_end(ax, 6.6, float(chi2_pdf(6.6, 4)), "df = 4", c[0], mode, dy=10)
    S.label_end(ax, 11.0, float(chi2_pdf(11.0, 6)), "df = 6", c[0], mode, dy=10)
    S.note(ax, 8.6, 0.34, "dots mark the upper 5% cutoffs:\n"
                          "3.841, 5.991, 9.488, 12.592", mode)
    ax.set_xlabel("$\\chi^2$")
    ax.set_ylabel("probability density")
    ax.set_title("The chi-square family, and where 5% is left over")
    ax.set_ylim(0, 0.5)
    ax.set_xlim(0, 20)
    S.strip(ax)
    return fig


@figure("prob3-anova-decomposition")
def _(mode):
    """Three assembly lines: the identity SST = SSB + SSW, drawn.

    Points are the fifteen printed strengths. The heavy bars are the group means,
    the dashed line the grand mean. Between-group spread is the distance from
    dashed to bar; within-group spread is the distance from bar to point.
    """
    c = S.SERIES[mode]
    gs = ANOVA_G
    allv = np.concatenate(gs)
    gm = float(allv.mean())
    SSB = float(sum(len(g) * (g.mean() - gm) ** 2 for g in gs))
    SSW = float(sum(float(((g - g.mean()) ** 2).sum()) for g in gs))
    SST = float(((allv - gm) ** 2).sum())
    assert abs(SST - (SSB + SSW)) < 1e-10, (SST, SSB + SSW)
    assert abs(SSB - 310 / 3) < 1e-10, SSB
    assert abs(SSW - 46.0) < 1e-12, SSW
    F = (SSB / 2) / (SSW / 12)
    assert abs(F - 13.478260869565215) < 1e-11, F
    assert abs(float(stats.f_oneway(*gs).statistic) - F) < 1e-11
    fc = crit_f(0.95, 2, 12)
    assert abs(fc - 3.885293834652391) < 1e-11, fc

    fig, ax = plt.subplots()
    labels = ["line A", "line B", "line C"]
    for i, (g, lab) in enumerate(zip(gs, labels)):
        ax.plot(np.full(len(g), i) + np.linspace(-0.09, 0.09, len(g)), g, "o",
                color=c[0], ms=6)
        ax.plot([i - 0.26, i + 0.26], [g.mean(), g.mean()], color=c[1], lw=3.0)
        S.note(ax, i + 0.30, g.mean() - 0.4, f"mean {g.mean():.0f} N", mode, size=9)
    ax.axhline(gm, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, 2.32, gm + 0.25, "grand mean\n44.33 N", mode)
    S.note(ax, 0.42, 38.1, "SSB = 103.33 on 2 df,  SSW = 46.00 on 12 df\n"
                           "F = 51.67 / 3.83 = 13.48   >   3.885", mode)
    ax.set_xticks([0, 1, 2])
    ax.set_xticklabels(labels)
    ax.set_ylabel("solder-joint pull strength  (N)")
    ax.set_title("One F ratio, two kinds of spread")
    ax.set_xlim(-0.5, 2.95)
    ax.set_ylim(37.2, 51.5)
    S.strip(ax)
    return fig


@figure("prob3-pvalue-uniform")
def _(mode):
    """The p-value is Uniform(0,1) under the null, and crowds zero under an alternative.

    Both curves are exact, not simulated: for a one-sided z test the probability
    that p is at most q is Phi(mu sqrt(n)/sigma - z_q), which at mu = 0 collapses
    to the 45-degree line. That closed form is what makes "p < 0.05 happens 5% of
    the time when nothing is going on" a statement about arithmetic.
    """
    c = S.SERIES[mode]
    q = np.linspace(1e-4, 1, 600)
    zq = np.array([float(stats.norm.ppf(1 - t)) for t in q])

    def cdf(shift):
        return phi_cdf(shift - zq)

    assert float(np.max(np.abs(cdf(0.0) - q))) < 1e-9
    for target, shift in ((0.05, 1.6448536269514722 + 1.2815515655446004),):
        val = float(phi_cdf(shift - float(stats.norm.ppf(1 - target))))
        assert abs(val - 0.9000000000000) < 1e-9, val

    fig, ax = plt.subplots()
    ax.plot(q, cdf(0.0), color=S.GUIDE[mode], lw=2.2, ls="--")
    ax.plot(q, cdf(1.0), color=c[0], lw=2.0)
    ax.plot(q, cdf(2.9264051924960743), color=c[1], lw=2.0)
    S.label_end(ax, 0.70, float(cdf(0.0)[np.argmin(abs(q - 0.70))]),
                "H$_0$ true: exactly uniform", S.GUIDE[mode], mode, dy=-16, ha="right")
    S.label_end(ax, 0.42, float(cdf(1.0)[np.argmin(abs(q - 0.42))]),
                "shift 1.0 SE", c[0], mode, dy=-13, ha="right")
    S.label_end(ax, 0.22, float(cdf(2.9264051924960743)[np.argmin(abs(q - 0.22))]),
                "shift 2.93 SE: 90% power", c[1], mode, dy=-15, ha="left")
    ax.plot([0.05], [0.05], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 0.075, 0.03, "5% of null experiments land here", mode)
    ax.set_xlabel("threshold q")
    ax.set_ylabel("probability that p $\\leq$ q")
    ax.set_title("Where p-values fall when nothing is happening")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.02)
    S.strip(ax)
    return fig


@figure("prob3-fwer")
def _(mode):
    """Family-wise error rate against the number of independent tests.

    Uncorrected: 1 - (1 - alpha)^m. Bonferroni: 1 - (1 - alpha/m)^m, which stays
    below alpha for every m and tends to 1 - exp(-alpha) from above.
    """
    c = S.SERIES[mode]
    a = 0.05
    ms = np.arange(1, 101)
    raw = 1 - (1 - a) ** ms
    bon = 1 - (1 - a / ms) ** ms
    assert abs(float(raw[19]) - 0.6415140775914581) < 1e-12, raw[19]
    assert abs(float(bon[19]) - 0.04883012474683324) < 1e-12, bon[19]
    assert abs(float(raw[9]) - 0.4012630607616213) < 1e-12, raw[9]
    assert abs(float(raw[4]) - 0.22621906250000023) < 1e-12, raw[4]
    assert float(bon.max()) <= a + 1e-15
    assert abs(float(bon[-1]) - (1 - (1 - 0.0005) ** 100)) < 1e-15
    assert abs((1 - math.exp(-a)) - 0.04877057549928599) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(ms, raw, color=c[1], lw=2.2)
    ax.plot(ms, bon, color=c[0], lw=2.2)
    ax.axhline(a, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([20], [raw[19]], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 62, float(raw[61]), "each test at $\\alpha$ = 0.05", c[1], mode, dy=-14,
                ha="right")
    S.label_end(ax, 62, float(bon[61]), "each test at 0.05/m", c[0], mode, dy=10, ha="right")
    S.note(ax, 22, 0.60, "20 tests, no correction:\n64.2% chance of at least\none false alarm", mode)
    ax.set_xlabel("number of independent tests m")
    ax.set_ylabel("probability of at least one false rejection")
    ax.set_title("Twenty questions, asked at 5% each")
    ax.set_ylim(0, 1.02)
    ax.set_xlim(0, 100)
    S.strip(ax)
    return fig


@figure("prob3-wald-wilson")
def _(mode):
    """Exact coverage of two proportion intervals, computed by enumeration.

    For n = 40 and each true p on the grid, every one of the 41 possible counts is
    enumerated, its binomial probability computed from C(n,k) p^k (1-p)^(n-k), and
    the probabilities of the counts whose interval covers p are added. No
    simulation is involved, so the curves are exact.
    """
    c = S.SERIES[mode]
    n, z = 40, float(stats.norm.ppf(0.975))

    def binom_pmf(k, n, p):
        return math.comb(n, k) * p ** k * (1 - p) ** (n - k)

    def wald(k):
        ph = k / n
        h = z * math.sqrt(ph * (1 - ph) / n)
        return ph - h, ph + h

    def wilson(k):
        ph = k / n
        d = 1 + z * z / n
        centre = (ph + z * z / (2 * n)) / d
        h = z * math.sqrt(ph * (1 - ph) / n + z * z / (4 * n * n)) / d
        return centre - h, centre + h

    ps = np.linspace(0.02, 0.98, 481)
    cw, cwi = [], []
    for p in ps:
        pr = np.array([binom_pmf(k, n, float(p)) for k in range(n + 1)])
        assert abs(pr.sum() - 1.0) < 1e-12
        cw.append(sum(pr[k] for k in range(n + 1) if wald(k)[0] <= p <= wald(k)[1]))
        cwi.append(sum(pr[k] for k in range(n + 1) if wilson(k)[0] <= p <= wilson(k)[1]))
    cw, cwi = np.array(cw), np.array(cwi)
    for p, w, wi in ((0.10, 0.914455, 0.943318), (0.30, 0.929938, 0.944287),
                     (0.50, 0.919313, 0.961524)):
        pr = np.array([binom_pmf(k, n, p) for k in range(n + 1)])
        gw = sum(pr[k] for k in range(n + 1) if wald(k)[0] <= p <= wald(k)[1])
        gwi = sum(pr[k] for k in range(n + 1) if wilson(k)[0] <= p <= wilson(k)[1])
        assert abs(gw - w) < 1e-5, (p, gw)
        assert abs(gwi - wi) < 1e-5, (p, gwi)
    assert float(cw.mean()) < 0.95 < float(cwi.mean())

    fig, ax = plt.subplots()
    ax.plot(ps, cwi, color=c[0], lw=1.6)
    ax.plot(ps, cw, color=c[1], lw=1.6)
    ax.axhline(0.95, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, 0.5, 0.975, "Wilson", c[0], mode, dy=0, ha="center")
    S.label_end(ax, 0.5, 0.885, "Wald", c[1], mode, dy=0, ha="center")
    S.note(ax, 0.055, 0.805, "nominal 95%; n = 40.  Coverage is a sawtooth\n"
                             "because the count is discrete", mode)
    ax.set_xlabel("true proportion p")
    ax.set_ylabel("probability the interval covers p")
    ax.set_title("A 95% interval that is not 95%")
    ax.set_ylim(0.78, 1.005)
    ax.set_xlim(0, 1)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "prob3-"
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
