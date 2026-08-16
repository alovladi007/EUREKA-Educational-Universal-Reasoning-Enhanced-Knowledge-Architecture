#!/usr/bin/env python3
"""Depth-wave figures for the two FE Electrical and Computer calculus chapters:
Differential Calculus (fee_diff_calc) and Integral Calculus (fee_int_calc).

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve is COMPUTED, here, from an equation the
lesson that references it writes out. Nothing is traced, scanned, redrawn or
adapted from the NCEES Reference Handbook or any study guide: the pipeline
consumes formulas, which are not protected expression, and never anyone's
drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every number the lesson quotes from a figure is asserted here, at the last
quoted digit or tighter, and closed-form quantities are asserted at 1e-9. The
calculus chapters get one extra layer: wherever a figure draws a DERIVATIVE it
is cross-checked against a central difference of the plotted function, and
wherever it draws an INTEGRAL it is cross-checked against adaptive quadrature.
A figure that agrees with the author's algebra but not with the numerics is the
failure mode this file exists to make impossible.

Usage:
    python3 scripts/gen_fe_ee_d6.py             # all
    python3 scripts/gen_fe_ee_d6.py math3-dc    # only names with that prefix
"""
from __future__ import annotations

import math
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


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def cdiff(f, x, h=1e-5):
    """Richardson-extrapolated central difference, order h^4.

    Used to confirm that an analytic slope drawn on a figure really is the
    slope of the curve drawn beside it.
    """
    d1 = (f(x + h) - f(x - h)) / (2 * h)
    d2 = (f(x + h / 2) - f(x - h / 2)) / h
    return (4 * d2 - d1) / 3


# ---------------------------------------------------------------------------
# Differential Calculus
# ---------------------------------------------------------------------------


@figure("math3-dc-secant-tangent")
def _(mode):
    """Secant slopes collapsing onto the tangent of f(x) = x^3 at x = 1.

    The difference quotient expands exactly: ((1+h)^3 - 1)/h = 3 + 3h + h^2,
    so the secant slope is the tangent slope 3 plus an error linear in h. The
    figure draws the tangent and the h = 1, 0.5 and 0.25 secants, whose slopes
    are 7, 4.75 and 3.8125 - the numbers the lesson tabulates.
    """
    c = S.SERIES[mode]
    f = lambda x: x ** 3
    x = np.linspace(0.2, 2.25, 800)

    slopes = {h: ((1 + h) ** 3 - 1) / h for h in (1.0, 0.5, 0.25)}
    assert abs(slopes[1.0] - 7.0) < 1e-12, slopes
    assert abs(slopes[0.5] - 4.75) < 1e-12, slopes
    assert abs(slopes[0.25] - 3.8125) < 1e-12, slopes
    for h, s in slopes.items():
        assert abs(s - (3 + 3 * h + h * h)) < 1e-12
    assert abs(cdiff(f, 1.0) - 3.0) < 1e-8, cdiff(f, 1.0)

    fig, ax = plt.subplots()
    ax.plot(x, f(x), color=c[0], lw=2.4)
    S.label_end(ax, 1.70, f(1.70), "f(x) = x^3", c[0], mode, dx=-10, dy=-14, ha="right")

    xt = np.linspace(0.35, 2.2, 2)
    ax.plot(xt, 1 + 3 * (xt - 1), color=S.GUIDE[mode], lw=1.6, ls="--")
    S.note(ax, 2.22, 1 + 3 * (2.2 - 1), "tangent, slope 3", mode, ha="right", va="top")

    for h, colour, lab in ((1.0, c[1], "h = 1: slope 7"),
                           (0.25, c[2], "h = 0.25: slope 3.8125")):
        s = slopes[h]
        xs = np.linspace(0.6, 1 + h + 0.15, 2)
        ax.plot(xs, 1 + s * (xs - 1), color=colour, lw=1.7)
        ax.plot([1, 1 + h], [1, f(1 + h)], "o", color=colour, ms=6, zorder=5)
        S.label_end(ax, xs[-1], 1 + s * (xs[-1] - 1), lab, colour, mode, dy=4)

    ax.plot([1.0], [1.0], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 1.04, 0.35, "the secant through (1, 1) and (1+h, (1+h)^3)\n"
                           "has slope 3 + 3h + h^2, which is 3 in the limit", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("f(x)")
    ax.set_title("The derivative is what the secant slope settles on")
    ax.set_xlim(0.2, 2.9)
    ax.set_ylim(-1.2, 9.5)
    S.strip(ax)
    return fig


@figure("math3-dc-concavity")
def _(mode):
    """f, f' and f'' stacked for f = 3x^4 - 16x^3 + 18x^2.

    Zeros of f' at x = 0, 1, 3 are the turning points; zeros of f'' at
    (8 -/+ sqrt 28)/6 = 0.45142 and 2.21525 are the inflections. Both sets are
    asserted against a central difference of the panel above, so the three
    panels cannot drift apart.
    """
    c = S.SERIES[mode]
    f = lambda x: 3 * x ** 4 - 16 * x ** 3 + 18 * x ** 2
    fp = lambda x: 12 * x ** 3 - 48 * x ** 2 + 36 * x
    fpp = lambda x: 36 * x ** 2 - 96 * x + 36

    for x0 in (0.0, 1.0, 3.0):
        assert abs(fp(x0)) < 1e-12
        assert abs(cdiff(f, x0)) < 1e-7, (x0, cdiff(f, x0))
    i1, i2 = (8 - math.sqrt(28)) / 6, (8 + math.sqrt(28)) / 6
    assert abs(i1 - 0.4514162296) < 1e-9, i1
    assert abs(i2 - 2.2152504371) < 1e-9, i2
    for x0 in (i1, i2):
        assert abs(fpp(x0)) < 1e-9
        assert abs(cdiff(fp, x0)) < 1e-6, (x0, cdiff(fp, x0))
    assert abs(f(1.0) - 5.0) < 1e-12
    assert abs(f(3.0) + 27.0) < 1e-12
    assert abs(f(i1) - 2.3207446254) < 1e-9, f(i1)
    assert abs(f(i2) + 13.3577816624) < 1e-9, f(i2)
    assert abs(fpp(0.0) - 36.0) < 1e-12
    assert abs(fpp(1.0) + 24.0) < 1e-12
    assert abs(fpp(3.0) - 72.0) < 1e-12

    x = np.linspace(-0.55, 3.55, 900)
    fig, axes = plt.subplots(3, 1, sharex=True, figsize=(7.2, 7.6))
    for ax, ydata, colour, name in (
        (axes[0], f(x), c[0], "f"),
        (axes[1], fp(x), c[1], "f'"),
        (axes[2], fpp(x), c[2], "f''"),
    ):
        ax.plot(x, ydata, color=colour, lw=2.2)
        ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
        for xc in (0.0, 1.0, 3.0):
            ax.axvline(xc, color=S.GUIDE[mode], lw=0.8, ls=":")
        for xi in (i1, i2):
            ax.axvline(xi, color=S.GUIDE[mode], lw=0.8, ls="--")
        ax.set_ylabel(name)
        S.strip(ax)

    axes[0].plot([0, 1, 3], [f(0.0), f(1.0), f(3.0)], "o", color=c[0], ms=7, zorder=5)
    S.note(axes[0], 1.05, 8, "local max f(1) = 5", mode)
    S.note(axes[0], 2.28, -38, "local min f(3) = -27", mode)
    S.note(axes[0], -0.5, 12, "local min f(0) = 0", mode)
    axes[0].set_ylim(-42, 46)
    axes[0].set_title("Turning points sit under zeros of f', inflections under zeros of f''")

    axes[1].plot([0, 1, 3], [0, 0, 0], "o", color=c[1], ms=7, zorder=5)
    S.note(axes[1], 1.15, 12, "f' = 12x(x-1)(x-3)", mode)
    axes[1].set_ylim(-42, 46)

    axes[2].plot([i1, i2], [0, 0], "o", color=c[2], ms=7, zorder=5)
    S.note(axes[2], 0.55, 44, "f'' = 0 at x = 0.4514 and x = 2.2153\n"
                              "(sign change, so both are inflections)", mode)
    axes[2].set_ylim(-32, 108)
    axes[2].set_xlabel("x")
    axes[2].set_xlim(-0.6, 3.9)
    fig.align_ylabels(axes)
    return fig


@figure("math3-dc-power-transfer")
def _(mode):
    """Load power and efficiency against load ratio for V = 24 V, R_s = 8 ohm.

    P = V^2 R_L/(R_s + R_L)^2 peaks at R_L = R_s where P = V^2/(4 R_s) = 18 W.
    The peak is broad and symmetric in the RATIO: R_L = 4 and R_L = 16 both
    give 16 W, which is 88.9% of the peak. Efficiency R_L/(R_s + R_L) passes
    through exactly 50% at the matched point, which is the trade-off the lesson
    makes explicit. Both quantities are drawn as fractions of their own scale so
    one axis serves, per the house rule against a second y-scale.
    """
    c = S.SERIES[mode]
    V, Rs = 24.0, 8.0
    P = lambda RL: V * V * RL / (Rs + RL) ** 2
    ratio = np.linspace(0.05, 6.0, 1200)
    RL = ratio * Rs

    assert abs(P(Rs) - 18.0) < 1e-12
    assert abs(P(Rs) - V * V / (4 * Rs)) < 1e-12
    assert abs(P(4.0) - 16.0) < 1e-12
    assert abs(P(16.0) - 16.0) < 1e-12
    assert abs(P(2.0) - 11.52) < 1e-12
    assert abs(P(32.0) - 11.52) < 1e-12
    assert abs(cdiff(P, Rs)) < 1e-7, cdiff(P, Rs)
    assert abs(100 * 16 / 18 - 88.888888889) < 1e-6

    fig, ax = plt.subplots()
    ax.plot(ratio, P(RL) / 18.0, color=c[0], lw=2.4)
    ax.plot(ratio, RL / (Rs + RL), color=c[1], lw=2.2)
    S.label_end(ax, 6.02, P(6 * Rs) / 18.0, "load power\n(fraction of 18 W peak)",
                c[0], mode, dy=-12)
    S.label_end(ax, 6.02, 6 * Rs / (Rs + 6 * Rs), "efficiency\nP_load / P_source",
                c[1], mode, dy=8)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([1.0, 1.0], [1.0, 0.5], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 1.12, 0.97, "matched: R_L = R_s = 8 ohm, P = 18 W", mode)
    S.note(ax, 1.12, 0.44, "and efficiency is only 50% there", mode)
    for r in (0.5, 2.0):
        ax.plot([r], [P(r * Rs) / 18.0], "o", color=c[2], ms=7, zorder=6)
    S.note(ax, 2.45, 0.68, "halving OR doubling the load\ngives 16 W - 88.9% of the peak", mode)
    ax.set_xlabel("load ratio  R_L / R_s")
    ax.set_ylabel("fraction")
    ax.set_title("The maximum-power peak is broad; the efficiency cost is not")
    ax.set_xlim(0, 7.6)
    ax.set_ylim(0, 1.1)
    S.strip(ax)
    return fig


@figure("math3-dc-kelvin-law")
def _(mode):
    """Economic conductor sizing: capital cost rises with area, loss cost falls.

    With A in square millimetres, annualised capital cost is alpha A with
    alpha = 3.75 USD/(mm^2 yr) and loss cost is beta/A with
    beta = I^2 (rho L) h c_e = 61 920 USD mm^2/yr for I = 200 A, rho L = 4.3
    ohm mm^2, 3000 equivalent full-load hours and 0.12 USD/kWh. The total is
    minimised where the two lines cross, A* = sqrt(beta/alpha) = 128.5 mm^2,
    and that crossing IS the optimum - the content of Kelvin's law.
    """
    c = S.SERIES[mode]
    alpha, beta = 3.75, 61920.0
    A = np.linspace(45.0, 320.0, 1400)
    cap, loss = alpha * A, beta / A
    total = cap + loss
    C = lambda a: alpha * a + beta / a

    Astar = math.sqrt(beta / alpha)
    assert abs(beta - 200.0 ** 2 * 4.3 * 3000.0 / 1000.0 * 0.12) < 1e-6, beta
    assert abs(Astar - 128.4990272) < 1e-6, Astar
    assert abs(cdiff(C, Astar)) < 1e-6, cdiff(C, Astar)
    assert abs(alpha * Astar - beta / Astar) < 1e-9
    assert abs(alpha * Astar - 481.8713519) < 1e-6, alpha * Astar
    assert abs(C(Astar) - 2 * math.sqrt(alpha * beta)) < 1e-9
    assert abs(C(Astar) - 963.7427043) < 1e-6, C(Astar)
    assert abs(C(100.0) - 994.2) < 1e-9, C(100.0)
    assert abs(C(160.0) - 987.0) < 1e-9, C(160.0)
    assert total.min() > C(Astar) - 1e-6

    fig, ax = plt.subplots()
    ax.plot(A, cap, color=c[0], lw=2.0)
    ax.plot(A, loss, color=c[1], lw=2.0)
    ax.plot(A, total, color=c[2], lw=2.6)
    S.label_end(ax, 320, alpha * 320, "capital, alpha A", c[0], mode, dy=6)
    S.label_end(ax, 320, beta / 320, "losses, beta / A", c[1], mode, dy=-8)
    S.label_end(ax, 320, C(320.0), "total", c[2], mode, dy=6)
    ax.axvline(Astar, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([Astar, Astar], [C(Astar), alpha * Astar], "o",
            color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 134, 1150, "A* = 128.5 mm^2", mode)
    S.note(ax, 134, 505, "the two costs are equal here:\n481.87 USD/yr each", mode)
    S.note(ax, 60, 1290, "total is flat near the optimum -\n100 mm^2 costs only 994.2 against 963.7", mode)
    ax.set_xlabel("conductor cross-section  A  (mm^2)")
    ax.set_ylabel("annual cost  (USD/yr)")
    ax.set_title("Kelvin's law: the cheapest conductor spends equally on copper and losses")
    ax.set_xlim(40, 400)
    ax.set_ylim(0, 1500)
    S.strip(ax)
    return fig


@figure("math3-dc-taylor-sine")
def _(mode):
    """sin x against its 1-, 2- and 3-term Maclaurin polynomials.

    At x = 0.5 rad the three partial sums are 0.5, 0.479166667 and 0.479427083
    against sin 0.5 = 0.479425539, the numbers the lesson tabulates. The exact
    curve is drawn in the neutral guide ink so the three hues stay available for
    the three approximations.
    """
    c = S.SERIES[mode]
    x = np.linspace(-0.2, 4.2, 1200)
    p1 = x
    p2 = x - x ** 3 / 6
    p3 = x - x ** 3 / 6 + x ** 5 / 120

    at = 0.5
    vals = (at, at - at ** 3 / 6, at - at ** 3 / 6 + at ** 5 / 120)
    assert abs(vals[1] - 0.4791666666666667) < 1e-12, vals
    assert abs(vals[2] - 0.4794270833333333) < 1e-12, vals
    assert abs(math.sin(0.5) - 0.4794255386042030) < 1e-15, math.sin(0.5)
    assert abs(abs(vals[2] - math.sin(0.5)) - 1.5447291303e-6) < 1e-15, \
        abs(vals[2] - math.sin(0.5))

    fig, ax = plt.subplots()
    ax.plot(x, np.sin(x), color=S.GUIDE[mode], lw=3.0)
    S.note(ax, 3.35, 0.06, "sin x", mode)
    ax.plot(x, p1, color=c[0], lw=1.9)
    ax.plot(x, p2, color=c[1], lw=1.9)
    ax.plot(x, p3, color=c[2], lw=1.9)
    S.label_end(ax, 1.28, 1.28, "x", c[0], mode, dy=2)
    S.label_end(ax, 2.45, 2.45 - 2.45 ** 3 / 6, "x - x^3/3!", c[1], mode, dy=-10)
    S.label_end(ax, 3.55, 3.55 - 3.55 ** 3 / 6 + 3.55 ** 5 / 120,
                "x - x^3/3! + x^5/5!", c[2], mode, dy=8)
    ax.axvline(0.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([0.5], [math.sin(0.5)], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, -0.18, -1.48, "at x = 0.5 rad the three-term sum is 0.4794271\n"
                             "against sin 0.5 = 0.4794255", mode)
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    ax.set_xlabel("x  (radians)")
    ax.set_ylabel("value")
    ax.set_title("Each Maclaurin term buys more range, not just more accuracy")
    ax.set_xlim(-0.25, 4.9)
    ax.set_ylim(-1.6, 2.6)
    S.strip(ax)
    return fig


@figure("math3-dc-taylor-error")
def _(mode):
    """Truncation error of the sine Maclaurin sums, with the Lagrange bound.

    The error of the polynomial ending in x^5 is bounded by |x|^7/7!, and at
    x = 0.5 the bound is 1.5501e-6 against a true error of 1.5447e-6 - within
    0.4%, which is what makes the bound worth quoting rather than guessing.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.05, 2.0, 900)
    e1 = np.abs(x - np.sin(x))
    e2 = np.abs(x - x ** 3 / 6 - np.sin(x))
    e3 = np.abs(x - x ** 3 / 6 + x ** 5 / 120 - np.sin(x))
    bound = x ** 7 / math.factorial(7)

    at = 0.5
    err3 = abs(at - at ** 3 / 6 + at ** 5 / 120 - math.sin(at))
    b3 = at ** 7 / math.factorial(7)
    assert abs(err3 - 1.5447291303e-6) < 1e-15, err3
    assert abs(b3 - 1.5500992063e-6) < 1e-15, b3
    assert b3 >= err3
    assert abs(b3 / err3 - 1.0034764) < 1e-6, b3 / err3
    assert np.all(bound >= e3 - 1e-18)

    fig, ax = plt.subplots()
    ax.semilogy(x, e1, color=c[0], lw=2.0)
    ax.semilogy(x, e2, color=c[1], lw=2.0)
    ax.semilogy(x, e3, color=c[2], lw=2.0)
    ax.semilogy(x, bound, color=S.GUIDE[mode], lw=1.6, ls="--")
    S.label_end(ax, 2.0, e1[-1], "one term", c[0], mode, dy=2)
    S.label_end(ax, 2.0, e2[-1], "two terms", c[1], mode, dy=2)
    S.label_end(ax, 2.0, e3[-1], "three terms", c[2], mode, dy=2)
    S.note(ax, 0.70, 8e-9, "dashed: the Lagrange bound x^7/7!, which on these axes\n"
                           "is indistinguishable from the three-term error itself", mode)
    ax.axvline(0.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([0.5, 0.5], [err3, b3], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(ax, 0.70, 1.6e-9, "at x = 0.5 the bound is 1.5501e-6, only 0.35%\n"
                             "above the true error of 1.5447e-6", mode)
    ax.set_xlabel("x  (radians)")
    ax.set_ylabel("absolute truncation error")
    ax.set_title("The remainder bound is a promise, and a close one")
    ax.set_xlim(0, 2.55)
    ax.set_ylim(1e-9, 3.0)
    S.strip(ax)
    return fig


@figure("math3-dc-gradient")
def _(mode):
    """Level curves of f = x^2 + 3y^2 with the gradient at (2, 1).

    grad f = (2x, 6y) = (4, 6) there, of magnitude sqrt 52 = 7.2111. The
    directional derivative along the unit vector (0.6, 0.8) is
    4(0.6) + 6(0.8) = 7.2, slightly less than the gradient's own magnitude -
    the geometric statement that no direction beats the gradient.
    """
    c = S.SERIES[mode]
    f = lambda x, y: x ** 2 + 3 * y ** 2
    gx, gy = np.meshgrid(np.linspace(-0.4, 4.2, 400), np.linspace(-0.6, 2.6, 400))
    Z = f(gx, gy)

    g = (4.0, 6.0)
    assert abs(cdiff(lambda t: f(t, 1.0), 2.0) - g[0]) < 1e-7
    assert abs(cdiff(lambda t: f(2.0, t), 1.0) - g[1]) < 1e-7
    mag = math.hypot(*g)
    assert abs(mag - 7.2111025509) < 1e-9, mag
    dirderiv = g[0] * 0.6 + g[1] * 0.8
    assert abs(dirderiv - 7.2) < 1e-12
    assert dirderiv < mag
    along_x = g[0] * 1.0 + g[1] * 0.0
    assert abs(along_x - 4.0) < 1e-12
    assert along_x < mag
    u = (g[0] / mag, g[1] / mag)
    assert abs(cdiff(lambda s: f(2 + s * u[0], 1 + s * u[1]), 0.0) - mag) < 1e-6

    fig, ax = plt.subplots()
    levels = [1, 3, 7, 13, 21, 31, 43]
    cs = ax.contour(gx, gy, Z, levels=levels, colors=S.GRID[mode], linewidths=1.0)
    ax.clabel(cs, inline=True, fontsize=8, fmt="%d", colors=S.INK_2[mode])
    ax.contour(gx, gy, Z, levels=[7.0], colors=[c[0]], linewidths=2.4)
    S.note(ax, 0.05, 1.62, "level curve f = 7 through (2, 1)", mode)

    ax.annotate("", xy=(2 + g[0] * 0.09, 1 + g[1] * 0.09), xytext=(2, 1),
                arrowprops=dict(arrowstyle="-|>", color=c[1], lw=2.4))
    S.label_end(ax, 2 + g[0] * 0.09, 1 + g[1] * 0.09,
                "grad f = (4, 6),  |grad f| = 7.2111", c[1], mode, dx=2, dy=11)
    ax.annotate("", xy=(2.9, 1.0), xytext=(2, 1),
                arrowprops=dict(arrowstyle="-|>", color=c[2], lw=2.0))
    S.label_end(ax, 2.9, 1.0, "u = (1, 0): slope only 4", c[2], mode, dx=6, dy=0)
    ax.plot([2.0], [1.0], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, -0.35, -0.45, "the gradient crosses every level curve at right angles,\n"
                             "and no direction is steeper than 7.2111", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("The gradient points uphill, perpendicular to the contours")
    ax.set_xlim(-0.4, 4.4)
    ax.set_ylim(-0.6, 2.7)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Integral Calculus
# ---------------------------------------------------------------------------


@figure("math3-ic-riemann")
def _(mode):
    """Left and right Riemann rectangles for the integral of x^2 over [0, 2].

    With n = 4 the left sum is 1.75 and the right sum 3.75, bracketing the true
    8/3 = 2.6667 because x^2 is increasing here. The exact partial-sum formulas
    8/3 -/+ 4/n + 4/(3n^2) are asserted against the summed rectangles, and the
    limit against adaptive quadrature.
    """
    c = S.SERIES[mode]
    f = lambda t: t * t
    n = 4
    h = 2.0 / n
    left = h * sum(f(i * h) for i in range(n))
    right = h * sum(f((i + 1) * h) for i in range(n))
    exact, _ = quad(f, 0, 2)

    assert abs(left - 1.75) < 1e-12, left
    assert abs(right - 3.75) < 1e-12, right
    assert abs(exact - 8 / 3) < 1e-12, exact
    assert abs(left - (8 / 3 - 4 / n + 4 / (3 * n * n))) < 1e-12
    assert abs(right - (8 / 3 + 4 / n + 4 / (3 * n * n))) < 1e-12
    assert left < exact < right

    x = np.linspace(0, 2, 600)
    fig, axes = plt.subplots(1, 2, sharey=True, figsize=(7.6, 3.9))
    for ax, kind, colour, tot in ((axes[0], "left", c[0], left),
                                  (axes[1], "right", c[1], right)):
        for i in range(n):
            xl = i * h
            hgt = f(xl) if kind == "left" else f(xl + h)
            ax.add_patch(plt.Rectangle((xl, 0), h, hgt, facecolor=colour,
                                       alpha=0.22, edgecolor=colour, lw=1.2))
        ax.plot(x, f(x), color=S.INK[mode], lw=2.2)
        ax.set_title(f"{kind}-hand sum = {tot:.2f}")
        ax.set_xlabel("x")
        ax.set_xlim(0, 2.05)
        S.strip(ax)
    axes[0].set_ylabel("f(x) = x^2")
    axes[0].set_ylim(0, 4.4)
    S.note(axes[0], 0.06, 3.7, "every rectangle undershoots", mode)
    S.note(axes[1], 0.06, 3.7, "every rectangle overshoots", mode)
    fig.suptitle("Four rectangles bracket the true area 8/3 = 2.6667",
                 color=S.INK[mode], fontsize=12, fontweight="semibold", y=1.04)
    fig.tight_layout()
    return fig


@figure("math3-ic-riemann-convergence")
def _(mode):
    """Riemann-sum error against the number of rectangles, log-log.

    For x^2 on [0, 2] the endpoint sums are in error by 4/n + 4/(3n^2) and the
    midpoint sum by 2/(3n^2), so the endpoint rules fall on a slope of -1 and
    the midpoint rule on a slope of -2. That factor is why the midpoint rule is
    worth the extra thought, and it is the same argument that ranks trapezoid
    against Simpson later in the chapter.
    """
    c = S.SERIES[mode]
    exact = 8 / 3
    ns = np.array([2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])

    def summ(n, kind):
        h = 2.0 / n
        if kind == "left":
            pts = [i * h for i in range(n)]
        elif kind == "right":
            pts = [(i + 1) * h for i in range(n)]
        else:
            pts = [(i + 0.5) * h for i in range(n)]
        return h * sum(p * p for p in pts)

    eL = np.array([abs(summ(int(n), "left") - exact) for n in ns])
    eR = np.array([abs(summ(int(n), "right") - exact) for n in ns])
    eM = np.array([abs(summ(int(n), "mid") - exact) for n in ns])

    for n in ns:
        n = int(n)
        assert abs(summ(n, "right") - (exact + 4 / n + 4 / (3 * n * n))) < 1e-9
        assert abs(summ(n, "left") - (exact - 4 / n + 4 / (3 * n * n))) < 1e-9
        assert abs(summ(n, "mid") - (exact - 2 / (3 * n * n))) < 1e-9
    slopeR = math.log(eR[-1] / eR[-4]) / math.log(ns[-1] / ns[-4])
    slopeM = math.log(eM[-1] / eM[-4]) / math.log(ns[-1] / ns[-4])
    assert abs(slopeR + 1.0) < 5e-3, slopeR
    assert abs(slopeM + 2.0) < 1e-6, slopeM

    fig, ax = plt.subplots()
    ax.loglog(ns, eR, "o-", color=c[0], lw=1.9, ms=5)
    ax.loglog(ns, eL, "s-", color=c[1], lw=1.9, ms=5)
    ax.loglog(ns, eM, "^-", color=c[2], lw=1.9, ms=5)
    S.label_end(ax, ns[-1], eR[-1], "right sum", c[0], mode, dy=7)
    S.label_end(ax, ns[-1], eL[-1], "left sum", c[1], mode, dy=-8)
    S.label_end(ax, ns[-1], eM[-1], "midpoint sum", c[2], mode, dy=2)
    ax.loglog(ns, 4.0 / ns, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.loglog(ns, (2 / 3) / ns ** 2, color=S.GUIDE[mode], lw=1.2, ls=":")
    S.note(ax, 3.4, 3.0, "slope -1:  error ~ 4/n", mode)
    S.note(ax, 3.4, 2.6e-2, "slope -2:  error ~ 2/(3 n^2)", mode)
    ax.set_xlabel("number of subintervals  n")
    ax.set_ylabel("absolute error")
    ax.set_title("Doubling n halves an endpoint error but quarters a midpoint error")
    ax.set_xlim(1.6, 4200)
    ax.set_ylim(3e-7, 12)
    S.strip(ax)
    return fig


@figure("math3-ic-ptest")
def _(mode):
    """Accumulated area under x^-p from 1 out to X, for p = 0.5, 1 and 2.

    The tail integral converges only when p > 1. The p = 2 curve settles on 1,
    the p = 1 curve is ln X and creeps away without limit, and p = 0.5 diverges
    outright as 2(sqrt X - 1). Each curve is checked against quadrature at
    X = 1000.
    """
    c = S.SERIES[mode]
    X = np.logspace(0, 4, 700)
    a2 = 1 - 1 / X
    a1 = np.log(X)
    a05 = 2 * (np.sqrt(X) - 1)

    for p, closed in ((2.0, 1 - 1 / 1000.0), (1.0, math.log(1000.0)),
                      (0.5, 2 * (math.sqrt(1000.0) - 1))):
        v, _ = quad(lambda t, p=p: t ** (-p), 1, 1000)
        assert abs(v - closed) < 1e-7, (p, v, closed)
    assert abs(math.log(1000.0) - 6.9077552790) < 1e-9
    assert abs(2 * (math.sqrt(1000.0) - 1) - 61.2455532034) < 1e-9
    tail, _ = quad(lambda t: t ** -2, 1, np.inf)
    assert abs(tail - 1.0) < 1e-12, tail

    fig, ax = plt.subplots()
    ax.semilogx(X, a05, color=c[0], lw=2.2)
    ax.semilogx(X, a1, color=c[1], lw=2.2)
    ax.semilogx(X, a2, color=c[2], lw=2.4)
    S.label_end(ax, 60.0, 2 * (math.sqrt(60.0) - 1), "p = 0.5:  2(sqrt X - 1), diverges",
                c[0], mode, dx=8, dy=2)
    S.label_end(ax, 1e4, math.log(1e4), "p = 1:  ln X, diverges slowly",
                c[1], mode, dy=10, ha="right", dx=-8)
    S.label_end(ax, 1e4, 1.0, "p = 2:  settles on 1", c[2], mode, dy=10,
                ha="right", dx=-8)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 9000, 15.0, "the only convergent tail here is the one\n"
                           "whose integrand falls faster than 1/x", mode, ha="right")
    ax.set_xlabel("upper limit  X")
    ax.set_ylabel("accumulated area from 1 to X")
    ax.set_title("Improper integrals: 1/x is the dividing line, and it loses")
    ax.set_xlim(1, 1.2e4)
    ax.set_ylim(0, 24)
    S.strip(ax)
    return fig


@figure("math3-ic-revolution")
def _(mode):
    """The region under y = sqrt(x) on [0, 4] and the solid it sweeps.

    Rotated about the x-axis the discs have radius sqrt(x) and area pi x, so
    V = pi int_0^4 x dx = 8 pi = 25.133. The lower panel draws the mirrored
    profile with one representative disc, and the volume is confirmed by
    quadrature of the disc-area function.
    """
    c = S.SERIES[mode]
    x = np.linspace(0, 4, 500)
    y = np.sqrt(x)
    V, _ = quad(lambda t: math.pi * t, 0, 4)
    assert abs(V - 8 * math.pi) < 1e-9, V
    assert abs(V - 25.1327412287) < 1e-9, V
    A, _ = quad(math.sqrt, 0, 4)
    assert abs(A - 16 / 3) < 1e-9, A

    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax = axes[0]
    ax.fill_between(x, 0, y, color=c[0], alpha=0.22)
    ax.plot(x, y, color=c[0], lw=2.4)
    S.label_end(ax, 4.0, 2.0, "y = sqrt(x)", c[0], mode, dy=4)
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    S.note(ax, 0.12, 2.18, "plane region, area = int_0^4 sqrt(x) dx = 16/3", mode)
    ax.set_ylabel("y")
    ax.set_ylim(0, 2.62)
    ax.set_title("Rotate the region; each slice is a disc of area pi y^2")
    S.strip(ax)

    ax = axes[1]
    ax.fill_between(x, -y, y, color=c[1], alpha=0.18)
    ax.plot(x, y, color=c[1], lw=2.0)
    ax.plot(x, -y, color=c[1], lw=2.0)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    xd = 2.25
    ax.plot([xd, xd], [-math.sqrt(xd), math.sqrt(xd)], color=S.INK[mode], lw=2.4)
    ax.plot([xd], [0.0], "o", color=S.INK[mode], ms=5)
    S.note(ax, 2.4, 0.35, "disc at x = 2.25: radius 1.5, area 2.25 pi", mode)
    S.note(ax, 0.15, -2.15, "V = pi int_0^4 x dx = 8 pi = 25.133 cubic units", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("radius")
    ax.set_xlim(0, 5.6)
    ax.set_ylim(-2.6, 2.6)
    S.strip(ax)
    fig.align_ylabels(axes)
    return fig


@figure("math3-ic-rms-waveforms")
def _(mode):
    """Four unit-peak waveforms with their own RMS levels drawn in.

    Sine 0.70711, square 1.00000, triangle 0.57735, sawtooth 0.57735 - each
    obtained here by numerically integrating the square of the plotted samples
    over one period, not by quoting the factor. Small multiples rather than one
    crowded axis, because four series exceed the validated three-hue cap.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 1, 20001)

    sine = np.sin(2 * np.pi * t)
    square = np.sign(np.sin(2 * np.pi * t))
    square[square == 0] = 1.0
    tri = 1 - 4 * np.abs(((t + 0.25) % 1.0) - 0.5)
    saw = 2 * (t % 1.0) - 1

    def rms(v):
        return math.sqrt(np.trapz(v ** 2, t) / (t[-1] - t[0]))

    r = [rms(sine), rms(square), rms(tri), rms(saw)]
    assert abs(r[0] - 1 / math.sqrt(2)) < 1e-6, r[0]
    assert abs(r[1] - 1.0) < 1e-9, r[1]
    assert abs(r[2] - 1 / math.sqrt(3)) < 1e-5, r[2]
    assert abs(r[3] - 1 / math.sqrt(3)) < 1e-4, r[3]
    assert abs(1 / math.sqrt(2) - 0.7071067812) < 1e-9
    assert abs(1 / math.sqrt(3) - 0.5773502692) < 1e-9
    assert abs(np.max(np.abs(tri)) - 1.0) < 1e-3
    assert abs(np.trapz(np.abs(sine), t) - 2 / math.pi) < 1e-5

    fig, axes = plt.subplots(2, 2, sharex=True, figsize=(7.6, 5.2))
    panels = (
        (axes[0][0], sine, "sine", c[0], "0.7071 V_m"),
        (axes[0][1], square, "square", c[1], "1.0000 V_m"),
        (axes[1][0], tri, "triangle", c[2], "0.5774 V_m"),
        (axes[1][1], saw, "sawtooth", c[0], "0.5774 V_m"),
    )
    for k, (ax, v, name, colour, lab) in enumerate(panels):
        ax.plot(t, v, color=colour, lw=2.0)
        ax.axhline(r[k], color=S.GUIDE[mode], lw=1.4, ls="--")
        ax.axhline(-r[k], color=S.GUIDE[mode], lw=1.4, ls="--")
        ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
        ax.set_title(f"{name}: RMS = {lab}", fontsize=10.5)
        ax.set_ylim(-1.35, 1.35)
        S.strip(ax)
    axes[1][0].set_xlabel("t / T")
    axes[1][1].set_xlabel("t / T")
    axes[0][0].set_ylabel("v / V_m")
    axes[1][0].set_ylabel("v / V_m")
    fig.suptitle("The RMS factor is a property of the shape, not of AC",
                 color=S.INK[mode], fontsize=12, fontweight="semibold")
    return fig


@figure("math3-ic-centroid")
def _(mode):
    """A unit semicircular area with its centroid at 4r/(3 pi) = 0.42441 r.

    The first moment int_0^r y (2 sqrt(r^2 - y^2)) dy = 2r^3/3 is evaluated by
    quadrature here, and divided by the area pi r^2/2 to place the marker; the
    closed form 4r/(3 pi) is only asserted against it. The dashed line at r/2
    shows how far the eye's guess is from the truth.
    """
    c = S.SERIES[mode]
    r = 1.0
    area, _ = quad(lambda y: 2 * math.sqrt(max(r * r - y * y, 0.0)), 0, r)
    first, _ = quad(lambda y: y * 2 * math.sqrt(max(r * r - y * y, 0.0)), 0, r)
    ybar = first / area

    assert abs(area - math.pi * r * r / 2) < 1e-8, area
    assert abs(first - 2 * r ** 3 / 3) < 1e-8, first
    assert abs(ybar - 4 * r / (3 * math.pi)) < 1e-8, ybar
    assert abs(ybar - 0.4244131816) < 1e-9, ybar

    th = np.linspace(0, math.pi, 600)
    fig, ax = plt.subplots()
    ax.fill_between(np.cos(th), 0, np.sin(th), color=c[0], alpha=0.20)
    ax.plot(np.cos(th), np.sin(th), color=c[0], lw=2.4)
    ax.plot([-1, 1], [0, 0], color=c[0], lw=2.4)

    ax.axhline(ybar, color=c[1], lw=1.8)
    S.label_end(ax, 1.02, ybar, "centroid  ybar = 4r/(3 pi) = 0.4244 r", c[1], mode, dy=-12)
    ax.plot([0.0], [ybar], "o", color=c[1], ms=8, zorder=6)
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, 1.06, 0.53, "the intuitive but wrong r/2", mode)

    yslab = 0.72
    half = math.sqrt(1 - yslab ** 2)
    ax.plot([-half, half], [yslab, yslab], color=S.INK[mode], lw=2.2)
    S.note(ax, 1.06, 0.86, "strip dA = 2 sqrt(r^2 - y^2) dy", mode, va="center")
    S.note(ax, -1.3, -0.30, "ybar = (first moment) / (area) = (2r^3/3) / (pi r^2/2)", mode)
    ax.set_xlabel("x / r")
    ax.set_ylabel("y / r")
    ax.set_title("Where a semicircular area balances")
    ax.set_xlim(-1.35, 2.55)
    ax.set_ylim(-0.42, 1.22)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math3-ic-quadrature-error")
def _(mode):
    """Trapezoid and Simpson error against panel count for int_0^1 e^x dx.

    The exact value is e - 1 = 1.7182818. Trapezoid error falls as h^2 (slope
    -2 on these axes, a factor of four per doubling) and Simpson as h^4 (slope
    -4, a factor of sixteen). The measured ratios 3.99 and 15.9 are the lesson's
    demonstration that the stated error orders are real.
    """
    c = S.SERIES[mode]
    exact = math.e - 1

    def trap(n):
        h = 1.0 / n
        return h * (0.5 * (math.exp(0) + math.exp(1))
                    + sum(math.exp(i * h) for i in range(1, n)))

    def simp(n):
        h = 1.0 / n
        s = math.exp(0) + math.exp(1)
        for i in range(1, n):
            s += (4 if i % 2 else 2) * math.exp(i * h)
        return h * s / 3

    ns = np.array([2, 4, 8, 16, 32, 64, 128])
    eT = np.array([abs(trap(int(n)) - exact) for n in ns])
    eS = np.array([abs(simp(int(n)) - exact) for n in ns])

    q, _ = quad(math.exp, 0, 1)
    assert abs(q - exact) < 1e-12, q
    assert abs(trap(2) - 1.7539310925) < 1e-9, trap(2)
    assert abs(trap(4) - 1.7272219046) < 1e-9, trap(4)
    assert abs(simp(2) - 1.7188611519) < 1e-9, simp(2)
    assert abs(simp(4) - 1.7183188420) < 1e-9, simp(4)
    assert abs(eT[0] / eT[1] - 3.9875794808) < 1e-6, eT[0] / eT[1]
    assert abs(eS[0] / eS[1] - 15.6516946906) < 1e-6, eS[0] / eS[1]
    assert abs(eS[1] / eS[2] - 15.9112770645) < 1e-6, eS[1] / eS[2]
    slopeT = math.log(eT[-1] / eT[-3]) / math.log(ns[-1] / ns[-3])
    slopeS = math.log(eS[-1] / eS[-3]) / math.log(ns[-1] / ns[-3])
    assert abs(slopeT + 2.0) < 1e-3, slopeT
    assert abs(slopeS + 4.0) < 5e-3, slopeS

    fig, ax = plt.subplots()
    ax.loglog(ns, eT, "o-", color=c[0], lw=2.0, ms=6)
    ax.loglog(ns, eS, "s-", color=c[1], lw=2.0, ms=6)
    S.label_end(ax, ns[-1], eT[-1], "trapezoid, h^2", c[0], mode, dy=4)
    S.label_end(ax, ns[-1], eS[-1], "Simpson, h^4", c[1], mode, dy=4)
    ax.loglog(ns, 0.22 * eT[0] * (ns[0] / ns) ** 2.0, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.loglog(ns, 0.22 * eS[0] * (ns[0] / ns) ** 4.0, color=S.GUIDE[mode], lw=1.3, ls=":")
    S.note(ax, 2.05, 1.6e-3, "slope -2 guide", mode)
    S.note(ax, 2.05, 2.4e-6, "slope -4 guide", mode)
    S.note(ax, 2.05, 1.1e-12, "each doubling of n cuts the trapezoid error\n"
                              "by about 4 and the Simpson error by about 16", mode)
    ax.set_xlabel("number of panels  n")
    ax.set_ylabel("absolute error in  int_0^1 e^x dx")
    ax.set_title("Two extra orders for the same samples: why Simpson is the default")
    ax.set_xlim(1.7, 420)
    ax.set_ylim(1e-13, 1.0)
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
        assert n.startswith("math3-"), f"figure {n} is outside this file's namespace"
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
