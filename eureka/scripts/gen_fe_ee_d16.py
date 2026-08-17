#!/usr/bin/env python3
"""Depth-wave-16 figures for the FE Electrical and Computer course:
the Differential Equations and Linear Algebra chapters of the Mathematics
section.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve, arrow and polygon here is COMPUTED, in
this file, from an equation the lesson that references it writes out. Nothing is
traced, scanned, redrawn or adapted from the NCEES Reference Handbook or any
textbook: the pipeline consumes formulas, which are not protected expression,
and never anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

VERIFICATION POLICY. Every closed-form solution drawn here is confirmed against
an INDEPENDENT numerical route before it is plotted: ordinary differential
equations by adaptive Runge-Kutta (RK45) at several times, eigenpairs by the
residual A v - lambda v, inverses by A A^-1 = I, determinants by cofactor
expansion and by the product of LU pivots, and the least-squares fit against the
normal equations solved a second way. Tolerances are 1e-9 where the quantity is
exact in closed form and at the last quoted digit otherwise. A tolerance of 0.1
on a number quoted to two decimals is decoration, not a check.

Usage:
    python3 eureka/scripts/gen_fe_ee_d16.py              # all
    python3 eureka/scripts/gen_fe_ee_d16.py math4-de     # only that prefix
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy.integrate import solve_ivp

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith("math4-"):
        raise ValueError(f"figure {name!r} is outside this file's namespace")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def confirm_ode(rhs, y0, exact, times, tol=1e-9, label=""):
    """Integrate the ODE numerically and compare with the closed form.

    This is the independent route: the closed form is never re-read from the
    algebra that produced it, it is tested against a solver that knows only the
    right-hand side.
    """
    sol = solve_ivp(rhs, (0.0, max(times)), y0, rtol=1e-12, atol=1e-14,
                    dense_output=True, method="RK45")
    for t in times:
        got = np.atleast_1d(sol.sol(t))
        want = np.atleast_1d(exact(t))
        assert np.all(np.abs(got[: len(want)] - want) <= tol), (
            f"{label}: RK45 gives {got[: len(want)]} at t={t}, closed form gives {want}")


def confirm_eigenpair(A, lam, v, tol=1e-12, label=""):
    """A v - lambda v must be the zero vector."""
    A = np.asarray(A, dtype=float)
    v = np.asarray(v, dtype=float)
    residual = A @ v - lam * v
    assert np.max(np.abs(residual)) <= tol, f"{label}: residual {residual}"


def cofactor_det(M):
    """Determinant by first-row cofactor expansion, independent of LU."""
    M = np.asarray(M, dtype=float)
    n = M.shape[0]
    if n == 1:
        return float(M[0, 0])
    total = 0.0
    for j in range(n):
        minor = np.delete(np.delete(M, 0, axis=0), j, axis=1)
        total += ((-1.0) ** j) * M[0, j] * cofactor_det(minor)
    return total


def polygon(ax, pts, colour, lw=2.0, fill=0.0, ls="-"):
    """Close and draw a polygon given its vertices."""
    p = np.vstack([np.asarray(pts, dtype=float), np.asarray(pts, dtype=float)[0]])
    ax.plot(p[:, 0], p[:, 1], color=colour, lw=lw, ls=ls)
    if fill:
        ax.fill(p[:, 0], p[:, 1], color=colour, alpha=fill, lw=0)


# ---------------------------------------------------------------------------
# Differential Equations
# ---------------------------------------------------------------------------


@figure("math4-de-direction-field")
def _(mode):
    """Direction field of y' = 6 - 2y with three solution curves.

    Every closed-form curve is y = 3 + (y0 - 3) e^(-2t), which the code confirms
    against RK45 before drawing. The point of the picture is that the field
    already contains the answer: slopes are zero on the line y = 3, positive
    below it and negative above, so every trajectory is funnelled to 3 whatever
    it starts at.
    """
    c = S.SERIES[mode]
    slope = lambda t, y: 6.0 - 2.0 * y
    for y0 in (0.0, 1.0, 5.0):
        confirm_ode(lambda t, y: [slope(t, y[0])], [y0],
                    lambda t, y0=y0: [3.0 + (y0 - 3.0) * np.exp(-2.0 * t)],
                    [0.1, 0.5, 1.0, 2.0], label=f"y'=6-2y from {y0}")
    # the equilibrium is where the slope vanishes
    assert abs(slope(0.0, 3.0)) < 1e-15
    # 63.2 per cent of the gap is closed in one time constant tau = 1/2
    gap = (0.0 - 3.0) * np.exp(-2.0 * 0.5)
    assert abs(gap / -3.0 - np.exp(-1.0)) < 1e-15
    assert abs(3.0 + gap - 1.8963616764856621) < 1e-12, 3.0 + gap

    tg, yg = np.meshgrid(np.linspace(0.0, 2.4, 17), np.linspace(-0.4, 5.6, 15))
    m = slope(tg, yg)
    # unit-length segments so the field shows direction, not magnitude
    dt = 1.0 / np.sqrt(1.0 + m ** 2)
    dy = m / np.sqrt(1.0 + m ** 2)
    L = 0.085

    fig, ax = plt.subplots()
    ax.quiver(tg, yg, dt, dy, angles="xy", scale_units="xy", scale=1.0 / L,
              width=0.0022, headwidth=0, headlength=0, color=S.GRID[mode])
    t = np.linspace(0.0, 2.4, 500)
    for k, y0 in enumerate((0.0, 1.0, 5.0)):
        y = 3.0 + (y0 - 3.0) * np.exp(-2.0 * t)
        ax.plot(t, y, color=c[k], lw=2.2)
        # labelled at the start, where the three curves are far apart; at the
        # right-hand edge they agree to three decimals and cannot be told apart
        S.label_end(ax, 0.0, y0, f"y(0) = {y0:.0f}", c[k], mode, dx=-8, ha="right")
    ax.axhline(3.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 1.15, 3.62, "equilibrium y = 3: the only place the slope is zero", mode)
    ax.plot([0.5], [3.0 - 3.0 * np.exp(-1.0)], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 0.62, 0.55, "one time constant (t = 0.5) closes 63.2% of the gap", mode)
    ax.set_xlabel("t")
    ax.set_ylabel("y")
    ax.set_title("The direction field of y' = 6 - 2y already shows the answer")
    ax.set_xlim(-0.62, 2.55)
    ax.set_ylim(-0.5, 5.8)
    S.strip(ax)
    return fig


@figure("math4-de-damping-family")
def _(mode):
    """Source-free series RLC current for three resistances, one L and C.

    L = 1 mH and C = 250 uF give omega_0 = 1/sqrt(LC) = 2000 rad/s. The capacitor
    starts at 10 V with zero current, so i(0) = 0 and i'(0) = V0/L = 10 000 A/s.
    R = 2, 4 and 5 ohm put alpha = R/2L at 1000, 2000 and 2500, which is exactly
    one case of each kind. All three closed forms are checked against RK45.
    """
    c = S.SERIES[mode]
    L, C, V0 = 1e-3, 250e-6, 10.0
    w0 = 1.0 / np.sqrt(L * C)
    assert abs(w0 - 2000.0) < 1e-9, w0

    wd = np.sqrt(w0 ** 2 - 1000.0 ** 2)
    assert abs(wd - 1732.0508075688772) < 1e-9, wd
    Bu = V0 / (L * wd)
    assert abs(Bu - 5.773502691896258) < 1e-12, Bu

    i_under = lambda t: Bu * np.exp(-1000.0 * t) * np.sin(wd * t)
    i_crit = lambda t: (V0 / L) * t * np.exp(-2000.0 * t)
    i_over = lambda t: (10.0 / 3.0) * (np.exp(-1000.0 * t) - np.exp(-4000.0 * t))

    for R, closed, name in ((2.0, i_under, "underdamped"),
                            (4.0, i_crit, "critically damped"),
                            (5.0, i_over, "overdamped")):
        confirm_ode(lambda t, y, R=R: [y[1], -(R / L) * y[1] - y[0] / (L * C)],
                    [0.0, V0 / L], lambda t, f=closed: [f(t)],
                    [1e-4, 5e-4, 1e-3, 3e-3], tol=1e-9, label=name)

    # peaks, each from setting the derivative of its own closed form to zero
    t_under = np.arctan(wd / 1000.0) / wd
    t_crit = 1.0 / 2000.0
    t_over = np.log(4.0) / 3000.0
    assert abs(t_under - 6.045997880780727e-4) < 1e-15, t_under
    assert abs(i_under(t_under) - 2.7314650793680073) < 1e-9
    assert abs(i_crit(t_crit) - 1.8393972058572117) < 1e-9
    assert abs(t_over - 4.6209812037329687e-4) < 1e-15, t_over
    assert abs(i_over(t_over) - 1.5749013123685915) < 1e-9
    # the overdamped roots multiply to 1/(LC) and add to -R/L
    assert abs((-1000.0) * (-4000.0) - 1.0 / (L * C)) < 1e-6
    assert abs((-1000.0) + (-4000.0) + 5.0 / L) < 1e-9

    t = np.linspace(0.0, 4e-3, 1400)
    fig, ax = plt.subplots()
    ax.plot(t * 1e3, i_under(t), color=c[0], lw=2.2)
    ax.plot(t * 1e3, i_crit(t), color=c[1], lw=2.2)
    ax.plot(t * 1e3, i_over(t), color=c[2], lw=2.2)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for tp, ip, col in ((t_under, i_under(t_under), c[0]),
                        (t_crit, i_crit(t_crit), c[1]),
                        (t_over, i_over(t_over), c[2])):
        ax.plot([tp * 1e3], [ip], "o", color=col, ms=7, zorder=5)
    # the marked peaks are colour-matched to their curves, so the three
    # readings are stacked in the empty quadrant rather than crowding the marks
    S.label_end(ax, 1.62, 2.95, "R = 2 ohm, underdamped: 2.731 A at 0.605 ms",
                c[0], mode, size=9.5)
    S.label_end(ax, 1.62, 2.60, "R = 4 ohm, critical: 1.839 A at 0.500 ms",
                c[1], mode, size=9.5)
    S.label_end(ax, 1.62, 2.25, "R = 5 ohm, overdamped: 1.575 A at 0.462 ms",
                c[2], mode, size=9.5)
    S.note(ax, 1.45, -0.80, "only the underdamped case ever reverses direction", mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("discharge current  i  (A)")
    ax.set_title("Same L and C, same stored energy, three resistances")
    ax.set_xlim(0, 4.05)
    ax.set_ylim(-0.95, 3.1)
    S.strip(ax)
    return fig


@figure("math4-de-forced-split")
def _(mode):
    """i' + 20i = 40 sin 20t split into its transient and steady parts.

    The particular solution is sin 20t - cos 20t, an amplitude of sqrt(2) lagging
    the drive by 45 degrees; the homogeneous part that makes i(0) = 0 is
    e^(-20t). Their sum is the complete solution, and RK45 confirms it.
    """
    c = S.SERIES[mode]
    total = lambda t: np.sin(20 * t) - np.cos(20 * t) + np.exp(-20 * t)
    confirm_ode(lambda t, y: [40.0 * np.sin(20 * t) - 20.0 * y[0]], [0.0],
                lambda t: [total(t)], [0.02, 0.05, 0.15, 0.4], label="forced RL")
    assert abs(total(0.0)) < 1e-15
    assert abs(np.hypot(1.0, 1.0) - 1.4142135623730951) < 1e-15
    assert abs(total(0.05) - 0.6690481201111991) < 1e-12, total(0.05)
    # the steady part alone lags the drive by exactly 45 degrees
    assert abs(np.degrees(np.arctan2(-1.0, 1.0)) + 45.0) < 1e-12

    t = np.linspace(0.0, 0.6, 1600)
    fig, ax = plt.subplots()
    ax.plot(t, np.sin(20 * t) - np.cos(20 * t), color=c[1], lw=1.8)
    ax.plot(t, np.exp(-20 * t), color=c[2], lw=1.8)
    ax.plot(t, total(t), color=c[0], lw=2.4)
    S.label_end(ax, 0.6, total(0.6), "complete solution", c[0], mode, dy=10)
    S.label_end(ax, 0.012, -1.0, "forced part alone", c[1], mode, dy=-13)
    S.label_end(ax, 0.13, np.exp(-2.6), "natural part: e^(-20t)", c[2], mode, dy=10)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([0.05], [total(0.05)], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 0.085, 0.62, "i = 0.6690 A at t = 0.05 s", mode)
    S.note(ax, 0.30, 1.62, "past about 5/20 = 0.25 s the two curves coincide", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("current  i  (A)")
    ax.set_title("Natural plus forced: the transient dies, the drive does not")
    ax.set_xlim(0, 0.71)
    ax.set_ylim(-1.85, 1.85)
    S.strip(ax)
    return fig


@figure("math4-de-resonance")
def _(mode):
    """Resonant and detuned response of y'' + 400y = 100 cos(w t), y(0)=y'(0)=0.

    At w = 20 = omega_0 the trial cos/sin fails because it already solves the
    homogeneous equation; multiplying by t gives y = 2.5 t sin 20t, whose
    envelope is the straight line 2.5t. Detune to w = 22 and the response is
    bounded beats, 2.380952 sin(t) sin(21t). Both are checked against RK45.
    """
    c = S.SERIES[mode]
    res = lambda t: 2.5 * t * np.sin(20 * t)
    amp = 100.0 / (400.0 - 22.0 ** 2)
    assert abs(amp + 1.1904761904761905) < 1e-12, amp
    beat = lambda t: amp * (np.cos(22 * t) - np.cos(20 * t))
    confirm_ode(lambda t, y: [y[1], 100.0 * np.cos(20 * t) - 400.0 * y[0]], [0.0, 0.0],
                lambda t: [res(t)], [0.5, 1.0, 2.0, 4.0], tol=1e-6, label="resonant")
    confirm_ode(lambda t, y: [y[1], 100.0 * np.cos(22 * t) - 400.0 * y[0]], [0.0, 0.0],
                lambda t: [beat(t)], [0.5, 1.0, 2.0, 4.0], tol=1e-6, label="detuned")
    # the beat form is the product identity, so its ceiling is 2 |amp|
    tt = np.linspace(0, 4, 4001)
    assert np.max(np.abs(beat(tt) + 2 * amp * np.sin(21 * tt) * np.sin(tt))) < 1e-9
    assert abs(2 * abs(amp) - 2.380952380952381) < 1e-12
    assert np.max(np.abs(beat(tt))) <= 2 * abs(amp) + 1e-12
    assert abs(res(4.0)) <= 10.0 and abs(2.5 * 4.0 - 10.0) < 1e-12

    t = np.linspace(0.0, 4.0, 6000)
    fig, ax = plt.subplots()
    ax.plot(t, res(t), color=c[0], lw=1.5)
    ax.plot(t, beat(t), color=c[1], lw=1.5)
    ax.plot(t, 2.5 * t, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.plot(t, -2.5 * t, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.label_end(ax, 2.05, 2.5 * 2.05, "envelope 2.5t", S.GUIDE[mode], mode, dy=10, ha="center")
    S.label_end(ax, 3.95, 10.9, "drive at 20 rad/s: resonance", c[0], mode, dx=-4, ha="right")
    S.label_end(ax, 0.55, -3.6, "drive at 22 rad/s: beats, ceiling 2.381", c[1], mode)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("y")
    ax.set_title("Undamped resonance grows without bound; detuning does not")
    ax.set_xlim(0, 4.05)
    ax.set_ylim(-11.5, 11.5)
    S.strip(ax)
    return fig


@figure("math4-de-laplace-rlc")
def _(mode):
    """Series RLC with non-zero initial conditions, solved by Laplace.

    L = 1 H, R = 5 ohm, C = 1/6 F, a 10 V step, i(0) = 2 A and v_C(0) = 3 V.
    Transforming with the initial conditions carried gives
    I(s) = (2s + 7)/((s+2)(s+3)) and V(s) = 3(s+4)(s+5)/(s(s+2)(s+3)), so
    i = 3e^(-2t) - e^(-3t) and v_C = 10 - 9e^(-2t) + 2e^(-3t). RK45 confirms
    both, and the two are checked against each other through i = C dv_C/dt.
    """
    c = S.SERIES[mode]
    i_t = lambda t: 3.0 * np.exp(-2 * t) - np.exp(-3 * t)
    v_t = lambda t: 10.0 - 9.0 * np.exp(-2 * t) + 2.0 * np.exp(-3 * t)
    confirm_ode(lambda t, y: [y[1], -5.0 * y[1] - 6.0 * y[0]], [2.0, -3.0],
                lambda t: [i_t(t)], [0.25, 0.5, 1.0, 2.0], label="Laplace i")
    confirm_ode(lambda t, y: [y[1], 60.0 - 5.0 * y[1] - 6.0 * y[0]], [3.0, 12.0],
                lambda t: [v_t(t)], [0.25, 0.5, 1.0, 2.0], label="Laplace v_C")
    tt = np.linspace(0.0, 3.0, 3001)
    assert np.max(np.abs((1.0 / 6.0) * (18 * np.exp(-2 * tt) - 6 * np.exp(-3 * tt))
                         - i_t(tt))) < 1e-12
    assert abs(i_t(0.0) - 2.0) < 1e-15 and abs(v_t(0.0) - 3.0) < 1e-15
    # KVL at t = 0+ fixes the initial slope: L i'(0) = 10 - R i(0) - v_C(0)
    assert abs((10.0 - 5.0 * 2.0 - 3.0) - (-3.0)) < 1e-15
    assert abs(v_t(60.0) - 10.0) < 1e-9
    assert abs(i_t(0.5) - 0.8805081633658972) < 1e-12
    assert abs(v_t(0.5) - 7.135345349753878) < 1e-12
    # i' = -6e^-2t + 3e^-3t is zero only at t = -ln 2, so on t >= 0 the current
    # never turns: it falls monotonically from its initial 2 A
    di = -6.0 * np.exp(-2 * tt) + 3.0 * np.exp(-3 * tt)
    assert np.all(di < 0.0) and abs(di[0] + 3.0) < 1e-12

    t = np.linspace(0.0, 3.0, 900)
    fig, ax = plt.subplots()
    ax.plot(t, v_t(t) / 10.0, color=c[0], lw=2.3)
    ax.plot(t, i_t(t) / 2.0, color=c[1], lw=2.3)
    check = solve_ivp(lambda tt, y: [y[1], 60.0 - 5.0 * y[1] - 6.0 * y[0]],
                      (0.0, 3.0), [3.0, 12.0], t_eval=np.linspace(0.1, 2.9, 10),
                      rtol=1e-12, atol=1e-14)
    ax.plot(check.t, check.y[0] / 10.0, "o", color=S.INK[mode], ms=5, zorder=5,
            fillstyle="none")
    S.label_end(ax, 2.2, v_t(2.2) / 10.0, "v_C / 10 V", c[0], mode, dy=-13)
    S.label_end(ax, 1.35, i_t(1.35) / 2.0, "i / 2 A", c[1], mode, dy=10)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.65, 1.03, "final value theorem: v_C -> 10 V", mode)
    ax.plot([0.0, 0.0], [0.3, 1.0], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(ax, 0.34, 0.13, "initial value theorem: v_C(0+) = 3 V, i(0+) = 2 A", mode)
    S.note(ax, 1.15, 0.62, "open circles: RK45 on the original ODE", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("fraction of the quoted scale")
    ax.set_title("Laplace carries the initial conditions into the algebra")
    ax.set_xlim(0, 3.05)
    ax.set_ylim(0, 1.22)
    S.strip(ax)
    return fig


@figure("math4-de-numerical-order")
def _(mode):
    """Global error of Euler and RK4 against step size on y' = y - t^2 + 1.

    The exact solution is y = (t+1)^2 - 0.5 e^t with y(0) = 0.5, verified by
    substitution and by RK45. Both methods are marched to t = 2 and the error
    there is plotted against h on log axes: Euler lies on a slope-1 line, RK4 on
    a slope-4 line, which is the whole content of "first order" and
    "fourth order".
    """
    c = S.SERIES[mode]
    f = lambda t, y: y - t * t + 1.0
    exact = lambda t: (t + 1.0) ** 2 - 0.5 * np.exp(t)
    assert abs(exact(0.0) - 0.5) < 1e-15
    confirm_ode(lambda t, y: [f(t, y[0])], [0.5], lambda t: [exact(t)],
                [0.5, 1.0, 2.0], label="test equation")
    yT = exact(2.0)
    assert abs(yT - 5.305471950534675) < 1e-12, yT

    def march(h, rk4):
        n = int(round(2.0 / h))
        t, y = 0.0, 0.5
        for _ in range(n):
            if rk4:
                k1 = f(t, y)
                k2 = f(t + h / 2, y + h * k1 / 2)
                k3 = f(t + h / 2, y + h * k2 / 2)
                k4 = f(t + h, y + h * k3)
                y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6
            else:
                y += h * f(t, y)
            t += h
        return y

    hs = np.array([0.2 / 2 ** k for k in range(8)])
    # RK4 is stopped one decade above the double-precision floor: below
    # h = 0.00625 its error is roundoff, not truncation, and fitting it there
    # would report a slope the method does not have.
    hr = hs[:6]
    e_eul = np.array([abs(march(h, False) - yT) for h in hs])
    e_rk4 = np.array([abs(march(h, True) - yT) for h in hr])
    assert abs(march(0.2, False) - 4.865784504) < 1e-8, march(0.2, False)
    assert abs(e_eul[0] - 0.4396874462) < 1e-9, e_eul[0]
    assert abs(e_rk4[0] - 1.08949842e-4) < 1e-11, e_rk4[0]
    # fitted slopes on the clean part of each sweep: 1 and 4 to two decimals
    s_e = np.polyfit(np.log(hs[3:]), np.log(e_eul[3:]), 1)[0]
    s_r = np.polyfit(np.log(hr[1:]), np.log(e_rk4[1:]), 1)[0]
    assert abs(s_e - 1.0) < 0.02, s_e
    assert abs(s_r - 4.0) < 0.02, s_r
    # halving h halves the Euler error and divides the RK4 error by about 16
    assert 1.9 < e_eul[-2] / e_eul[-1] < 2.1, e_eul[-2] / e_eul[-1]
    assert 15.5 < e_rk4[-2] / e_rk4[-1] < 16.5, e_rk4[-2] / e_rk4[-1]

    fig, ax = plt.subplots()
    ax.loglog(hs, e_eul, "o-", color=c[0], lw=2.0, ms=6)
    ax.loglog(hr, e_rk4, "o-", color=c[1], lw=2.0, ms=6)
    ax.loglog(hs, e_eul[0] * (hs / hs[0]) ** 1, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.loglog(hr, e_rk4[0] * (hr / hr[0]) ** 4, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(ax, hs[-1], e_eul[-1], "Euler: slope 1", c[0], mode, dy=-12)
    S.label_end(ax, hr[-1], e_rk4[-1], "RK4: slope 4", c[1], mode, dy=-12)
    S.note(ax, 0.028, 2e-4, "dashed: reference slopes 1 and 4", mode)
    ax.set_xlabel("step size  h")
    ax.set_ylabel("global error at t = 2")
    ax.set_title("Halving h halves Euler's error and cuts RK4's by sixteen")
    ax.grid(True, which="both", alpha=0.35)
    S.strip(ax)
    return fig


@figure("math4-de-bvp-modes")
def _(mode):
    """The first three modes of y'' + lambda y = 0 with y(0) = y(2) = 0.

    A boundary value problem is not an initial value problem with the data moved:
    it has a non-trivial solution only for lambda_n = (n pi / L)^2, and then it
    has infinitely many, because any multiple of sin(n pi x / L) also fits. Each
    mode is checked by substitution into the differential equation.
    """
    c = S.SERIES[mode]
    L = 2.0
    lam = [(n * np.pi / L) ** 2 for n in (1, 2, 3)]
    assert abs(lam[0] - 2.4674011002723395) < 1e-12
    assert abs(lam[1] - 9.869604401089358) < 1e-12
    assert abs(lam[2] - 22.206609902451056) < 1e-12
    x = np.linspace(0.0, L, 900)
    for n, lm in zip((1, 2, 3), lam):
        y = np.sin(n * np.pi * x / L)
        d2 = -((n * np.pi / L) ** 2) * y
        assert np.max(np.abs(d2 + lm * y)) < 1e-12
        assert abs(y[0]) < 1e-15 and abs(y[-1]) < 1e-12

    fig, ax = plt.subplots()
    for k, n in enumerate((1, 2, 3)):
        ax.plot(x, np.sin(n * np.pi * x / L), color=c[k], lw=2.2)
    S.label_end(ax, 1.0, 1.06, "n = 1, lambda = 2.4674", c[0], mode, dy=26, ha="center")
    S.label_end(ax, 0.5, 1.06, "n = 2, lambda = 9.8696", c[1], mode, dy=10, ha="center")
    S.label_end(ax, 1.667, 1.06, "n = 3, lambda = 22.207", c[2], mode, dy=10, ha="center")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for xv in (0.0, 2.0):
        ax.plot([xv], [0.0], "o", color=S.INK[mode], ms=8, zorder=5)
    S.note(ax, 0.06, -1.30, "both ends pinned: y(0) = y(2) = 0", mode)
    S.note(ax, 1.06, -1.62, "any other lambda forces the trivial solution y = 0", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("A boundary value problem answers only at its eigenvalues")
    ax.set_xlim(-0.05, 2.05)
    ax.set_ylim(-1.85, 1.72)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Linear Algebra
# ---------------------------------------------------------------------------


@figure("math4-la-noncommute")
def _(mode):
    """AB and BA send the unit square to different parallelograms.

    A = [[1,2],[0,1]] shears, B = [[0,1],[1,0]] swaps the axes. AB = [[2,1],[1,0]]
    and BA = [[0,1],[1,2]] are computed here and asserted entry by entry; both
    have determinant -1, so the two images have the same area and are still not
    the same set. Order is not a bookkeeping detail.
    """
    c = S.SERIES[mode]
    A = np.array([[1.0, 2.0], [0.0, 1.0]])
    B = np.array([[0.0, 1.0], [1.0, 0.0]])
    AB, BA = A @ B, B @ A
    assert np.array_equal(AB, [[2, 1], [1, 0]]), AB
    assert np.array_equal(BA, [[0, 1], [1, 2]]), BA
    assert not np.array_equal(AB, BA)
    assert abs(cofactor_det(AB) + 1.0) < 1e-12
    assert abs(cofactor_det(BA) + 1.0) < 1e-12
    assert np.array_equal(AB.T, B.T @ A.T)

    unit = np.array([[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]])
    im1 = unit @ AB.T
    im2 = unit @ BA.T
    assert np.array_equal(im1, [[0, 0], [2, 1], [3, 1], [1, 0]]), im1
    assert np.array_equal(im2, [[0, 0], [0, 1], [1, 3], [1, 2]]), im2

    fig, ax = plt.subplots()
    polygon(ax, unit, S.GUIDE[mode], lw=1.6, ls="--")
    polygon(ax, im1, c[0], lw=2.2, fill=0.14)
    polygon(ax, im2, c[1], lw=2.2, fill=0.14)
    S.note(ax, -0.42, 0.45, "unit square", mode, ha="right")
    S.label_end(ax, 2.55, 1.05, "AB: shear, then swap", c[0], mode, dy=10, ha="center")
    S.label_end(ax, 0.62, 2.55, "BA: swap, then shear", c[1], mode, dy=6)
    ax.plot([0.0], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 1.55, -0.42, "both images have area 1: equal size, different shape", mode, ha="center")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("AB and BA are different transformations")
    ax.set_xlim(-2.0, 3.5)
    ax.set_ylim(-0.6, 3.3)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math4-la-det-area")
def _(mode):
    """The determinant is the area scaling factor of the transformation.

    A = [[2,1],[1,3]] has determinant 5 by cofactor and by LU, and it sends the
    unit square to a parallelogram of area 5, computed here by the cross product
    of the image edges. The shear [[1,2],[0,1]] has determinant 1 and preserves
    area while changing every shape.
    """
    c = S.SERIES[mode]
    A = np.array([[2.0, 1.0], [1.0, 3.0]])
    Sh = np.array([[1.0, 2.0], [0.0, 1.0]])
    assert abs(cofactor_det(A) - 5.0) < 1e-12
    assert abs(np.linalg.det(A) - 5.0) < 1e-9
    assert abs(cofactor_det(Sh) - 1.0) < 1e-12
    unit = np.array([[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]])
    im = unit @ A.T
    sh = unit @ Sh.T
    assert np.array_equal(im, [[0, 0], [2, 1], [3, 4], [1, 3]]), im
    # area from the cross product of the two image edge vectors
    area = abs(im[1, 0] * im[3, 1] - im[3, 0] * im[1, 1])
    assert abs(area - 5.0) < 1e-12, area
    assert abs(abs(sh[1, 0] * sh[3, 1] - sh[3, 0] * sh[1, 1]) - 1.0) < 1e-12

    fig, ax = plt.subplots()
    polygon(ax, unit, S.GUIDE[mode], lw=1.8, ls="--", fill=0.10)
    polygon(ax, im, c[0], lw=2.2, fill=0.14)
    polygon(ax, sh, c[1], lw=2.0, fill=0.10)
    S.note(ax, -0.28, 0.45, "dashed:\nunit square,\narea 1", mode, ha="right")
    S.label_end(ax, 1.75, 2.45, "image under A: area 5 = det A", c[0], mode, ha="center", dy=6)
    S.label_end(ax, 1.9, -0.30, "image under the shear: area 1", c[1], mode, ha="center", dy=-2)
    ax.annotate("", xy=(2, 1), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", color=c[0], lw=1.6))
    ax.annotate("", xy=(1, 3), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", color=c[0], lw=1.6))
    S.note(ax, 2.16, 1.16, "first column (2, 1)", mode)
    S.note(ax, 1.12, 3.16, "second column (1, 3)", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Where the columns land is what the determinant measures")
    ax.set_xlim(-1.85, 3.9)
    ax.set_ylim(-0.85, 4.5)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math4-la-pivot-error")
def _(mode):
    """Why partial pivoting exists, in three-significant-digit arithmetic.

    The system [[eps, 1], [1, 1]] x = [1, 2] has the exact solution
    x1 = 1/(1-eps), x2 = 1 - eps/(1-eps). Eliminating without a row swap uses the
    multiplier 1/eps, which for small eps swamps the second row and destroys x1.
    Swapping so the larger entry is the pivot keeps the multiplier below one and
    the answer stays right. Every arithmetic operation below is rounded to three
    significant digits, so the loss is genuine and not simulated.
    """
    c = S.SERIES[mode]

    def sig3(x):
        x = float(x)
        if x == 0.0:
            return 0.0
        e = np.floor(np.log10(abs(x)))
        return float(np.round(x / 10.0 ** (e - 2)) * 10.0 ** (e - 2))

    def solve(eps, pivot):
        M = [[sig3(eps), 1.0], [1.0, 1.0]]
        r = [1.0, 2.0]
        if pivot and abs(M[1][0]) > abs(M[0][0]):
            M = M[::-1]
            r = r[::-1]
        m = sig3(M[1][0] / M[0][0])
        M[1] = [sig3(M[1][0] - sig3(m * M[0][0])), sig3(M[1][1] - sig3(m * M[0][1]))]
        r[1] = sig3(r[1] - sig3(m * r[0]))
        x1 = sig3(r[1] / M[1][1])
        x0 = sig3(sig3(r[0] - sig3(M[0][1] * x1)) / M[0][0])
        return x0, x1

    eps = np.logspace(-1, -8, 29)
    naive, piv = [], []
    for e in eps:
        exact0 = 1.0 / (1.0 - e)
        n0, _ = solve(e, False)
        p0, _ = solve(e, True)
        naive.append(max(abs(n0 - exact0) / abs(exact0), 1e-16))
        piv.append(max(abs(p0 - exact0) / abs(exact0), 1e-16))
    naive, piv = np.array(naive), np.array(piv)
    # the checked case from the lesson: eps = 1e-5 loses x1 completely
    assert solve(1e-5, False) == (0.0, 1.0), solve(1e-5, False)
    assert solve(1e-5, True) == (1.0, 1.0), solve(1e-5, True)
    assert abs(1.0 / (1.0 - 1e-5) - 1.0000100001000012) < 1e-12
    assert naive[eps <= 1e-5].min() >= 0.99, "naive route should be totally wrong"
    # the pivoted route never does worse than the rounding unit of three-digit
    # arithmetic, which is half a unit in the third digit, i.e. about 5e-3
    assert piv.max() <= 6e-3, piv.max()
    assert naive.max() >= 0.99 and naive[eps <= 1e-5].min() > 160 * piv.max()

    fig, ax = plt.subplots()
    ax.loglog(eps, naive, "o-", color=c[1], lw=2.0, ms=5)
    ax.loglog(eps, piv, "o-", color=c[0], lw=2.0, ms=5)
    S.label_end(ax, 3e-6, 1.0, "no pivoting", c[1], mode, dy=-16, ha="center")
    S.label_end(ax, 3e-6, piv[eps <= 3e-6][0], "partial pivoting", c[0], mode, dy=-16,
                ha="center")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 8e-2, 6.0, "a relative error of 1 means the answer carries no information", mode)
    ax.set_xlabel("small pivot  eps")
    ax.set_ylabel("relative error in x1")
    ax.set_ylim(3e-9, 40.0)
    ax.set_title("Three-digit arithmetic: the row swap is the whole difference")
    ax.invert_xaxis()
    ax.grid(True, which="both", alpha=0.35)
    S.strip(ax)
    return fig


@figure("math4-la-eigen-directions")
def _(mode):
    """Invariant directions of A = [[4,-2],[1,1]], whose eigenvalues are 2 and 3.

    The unit circle becomes an ellipse, and every direction on it turns except
    two. Along (1,1) the matrix scales by 2 and along (2,1) by 3, each confirmed
    by the residual A v - lambda v. The vector (1,0) is drawn as a control: it
    goes to (4,1), a different direction entirely.
    """
    c = S.SERIES[mode]
    A = np.array([[4.0, -2.0], [1.0, 1.0]])
    assert abs(np.trace(A) - 5.0) < 1e-12 and abs(cofactor_det(A) - 6.0) < 1e-12
    confirm_eigenpair(A, 2.0, [1.0, 1.0], label="lambda 2")
    confirm_eigenpair(A, 3.0, [2.0, 1.0], label="lambda 3")
    # a control vector drawn from a different quadrant, so the picture cannot be
    # read as though every arrow were an eigenvector
    assert np.array_equal(A @ np.array([0.0, 1.0]), [-2.0, 1.0])

    th = np.linspace(0, 2 * np.pi, 800)
    circ = np.vstack([np.cos(th), np.sin(th)])
    ell = A @ circ
    v1 = np.array([1.0, 1.0]) / np.sqrt(2.0)
    v2 = np.array([2.0, 1.0]) / np.sqrt(5.0)
    assert abs(np.linalg.norm(A @ v1) - 2.0) < 1e-12
    assert abs(np.linalg.norm(A @ v2) - 3.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(circ[0], circ[1], color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.plot(ell[0], ell[1], color=c[0], lw=2.2)
    for v, lam, col in ((v1, 2.0, c[1]), (v2, 3.0, c[2])):
        far = 4.0 * v
        ax.plot([-far[0], far[0]], [-far[1], far[1]], color=col, lw=1.0, ls=":")
        ax.annotate("", xy=tuple(lam * v), xytext=(0, 0),
                    arrowprops=dict(arrowstyle="->", color=col, lw=2.2))
        ax.plot([v[0]], [v[1]], "o", color=col, ms=7, zorder=5)
    S.label_end(ax, 2 * v1[0], 2 * v1[1], "(1,1) scales by 2", c[1], mode, dy=12, ha="center")
    S.label_end(ax, 3.55, 1.78, "(2,1) scales by 3", c[2], mode, dy=0, ha="left")
    ax.annotate("", xy=(-2, 1), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", color=S.INK[mode], lw=1.6))
    ax.plot([0.0], [1.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, -1.15, -2.6, "(0,1) is not an eigenvector: it lands on (-2, 1)", mode)
    S.label_end(ax, -5.2, 2.5, "image of the unit circle", c[0], mode)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Two directions survive the transformation unturned")
    ax.set_xlim(-5.4, 5.4)
    ax.set_ylim(-3.15, 3.15)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math4-la-power-iteration")
def _(mode):
    """Repeated multiplication drives any start vector to the dominant direction.

    With A = [[4,-2],[1,1]] and v = (1,0) = -(1,1) + (2,1), the k-th power gives
    -2^k (1,1) + 3^k (2,1). The unwanted term shrinks relative to the wanted one
    like (2/3)^k, so the angle to the dominant eigenvector falls on a straight
    line on a log scale with exactly that ratio. The decomposition is asserted,
    not assumed.
    """
    c = S.SERIES[mode]
    A = np.array([[4.0, -2.0], [1.0, 1.0]])
    e1 = np.array([1.0, 1.0])
    e2 = np.array([2.0, 1.0])
    confirm_eigenpair(A, 2.0, e1, label="lambda 2")
    confirm_eigenpair(A, 3.0, e2, label="lambda 3")
    v0 = np.array([1.0, 0.0])
    assert np.array_equal(-e1 + e2, v0)
    ks = np.arange(0, 15)
    ang = []
    u = e2 / np.linalg.norm(e2)
    for k in ks:
        w = -(2.0 ** k) * e1 + (3.0 ** k) * e2
        assert np.max(np.abs(np.linalg.matrix_power(A, int(k)) @ v0 - w)) < 1e-6
        w = w / np.linalg.norm(w)
        ang.append(np.degrees(np.arccos(min(1.0, abs(float(np.dot(w, u)))))))
    ang = np.array(ang)
    assert abs(ang[0] - 26.565051177077994) < 1e-9, ang[0]
    assert abs(ang[8] - 0.45782675) < 1e-6, ang[8]
    # the tail decays by the factor 2/3 per step
    ratios = ang[9:] / ang[8:-1]
    assert np.all(np.abs(ratios - 2.0 / 3.0) < 0.01), ratios

    fig, ax = plt.subplots()
    ax.semilogy(ks, ang, "o-", color=c[0], lw=2.0, ms=6)
    ax.semilogy(ks, ang[0] * (2.0 / 3.0) ** ks, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, ks[-1], ang[-1], "angle to (2,1)", c[0], mode, dy=-11, ha="right", dx=-4)
    S.note(ax, 6.6, 6.5, "dashed: reference decay (2/3)^k, the eigenvalue ratio", mode)
    ax.plot([0], [ang[0]], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 0.45, 15.0, "start at (1,0): 26.57 degrees away", mode)
    ax.set_xlabel("number of multiplications  k")
    ax.set_ylabel("angle to the dominant eigenvector  (degrees)")
    ax.set_title("A^k v forgets everything except the largest eigenvalue")
    ax.grid(True, which="both", alpha=0.35)
    S.strip(ax)
    return fig


@figure("math4-la-rank-collapse")
def _(mode):
    """A singular matrix flattens the plane; the null space is what it flattens.

    N = [[2,1],[1,3]] has determinant 5 and sends the unit circle to an ellipse.
    S = [[1,2],[2,4]] has determinant 0, rank 1, and sends the same circle to a
    segment along (1,2); every multiple of (2,-1) lands on the origin, which is
    the null space. Both facts are asserted from the computed images.
    """
    c = S.SERIES[mode]
    N = np.array([[2.0, 1.0], [1.0, 3.0]])
    Sg = np.array([[1.0, 2.0], [2.0, 4.0]])
    assert abs(cofactor_det(N) - 5.0) < 1e-12
    assert abs(cofactor_det(Sg)) < 1e-12
    assert np.linalg.matrix_rank(Sg) == 1
    null = np.array([2.0, -1.0])
    assert np.max(np.abs(Sg @ null)) < 1e-12

    th = np.linspace(0, 2 * np.pi, 900)
    circ = np.vstack([np.cos(th), np.sin(th)])
    ell = N @ circ
    seg = Sg @ circ
    # the flattened image is exactly the segment of half-length sqrt(5)*sqrt(5)
    reach = np.max(np.linalg.norm(seg, axis=0))
    assert abs(reach - 5.0) < 1e-6, reach
    direction = np.array([1.0, 2.0]) / np.sqrt(5.0)
    assert np.max(np.abs(seg - direction[:, None] * (direction @ seg))) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(circ[0], circ[1], color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.plot(ell[0], ell[1], color=c[0], lw=2.2)
    ax.plot(seg[0], seg[1], color=c[1], lw=3.4)
    far = 3.0 * null / np.linalg.norm(null)
    ax.plot([-far[0], far[0]], [-far[1], far[1]], color=c[2], lw=1.6, ls=":")
    S.note(ax, 0.55, -1.85, "unit circle", mode)
    S.label_end(ax, -5.8, 3.3, "det 5: an ellipse, nothing lost", c[0], mode)
    S.label_end(ax, 1.35, 4.55, "det 0: a segment, rank 1", c[1], mode, dy=6)
    S.label_end(ax, far[0], far[1], "null direction (2,-1)", c[2], mode, dy=-13, ha="left")
    ax.plot([0.0], [0.0], "o", color=S.INK[mode], ms=7, zorder=6)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Zero determinant means a whole direction is thrown away")
    ax.set_xlim(-6.0, 6.0)
    ax.set_ylim(-5.4, 5.4)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("math4-la-least-squares")
def _(mode):
    """The least-squares line through five points, and what makes it least.

    The normal equations for y = a + bx are solved here by Cramer's rule and
    independently by numpy's least-squares routine and by QR; all three agree on
    a = 0.05 and b = 1.99. The residuals sum to zero and are orthogonal to x,
    which are exactly the two normal equations restated, and both are asserted.
    """
    c = S.SERIES[mode]
    x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
    y = np.array([2.1, 3.9, 6.2, 7.8, 10.1])
    X = np.column_stack([np.ones_like(x), x])
    M = X.T @ X
    r = X.T @ y
    assert np.array_equal(M, [[5.0, 15.0], [15.0, 55.0]]), M
    assert abs(cofactor_det(M) - 50.0) < 1e-9
    a = cofactor_det(np.column_stack([r, M[:, 1]])) / cofactor_det(M)
    b = cofactor_det(np.column_stack([M[:, 0], r])) / cofactor_det(M)
    assert abs(a - 0.05) < 1e-12 and abs(b - 1.99) < 1e-12, (a, b)
    lstsq = np.linalg.lstsq(X, y, rcond=None)[0]
    Q, R = np.linalg.qr(X)
    qr = np.linalg.solve(R, Q.T @ y)
    assert np.max(np.abs(lstsq - [a, b])) < 1e-9
    assert np.max(np.abs(qr - [a, b])) < 1e-9
    res = y - (a + b * x)
    assert np.max(np.abs(res - [0.06, -0.13, 0.18, -0.21, 0.10])) < 1e-9, res
    assert abs(res.sum()) < 1e-12
    assert abs(float(x @ res)) < 1e-12
    assert abs(float(res @ res) - 0.107) < 1e-12, res @ res

    # The residuals are two orders of magnitude smaller than the data, so they
    # get their own panel on their own scale rather than being exaggerated on
    # the main one. Stacked panels sharing an x-axis are the house rule for two
    # quantities of different size; a second y-scale is not.
    xs = np.linspace(0.6, 5.4, 200)
    fig, (ax, bx) = plt.subplots(
        2, 1, sharex=True, figsize=(7.2, 5.2),
        gridspec_kw={"height_ratios": [2.5, 1], "hspace": 0.12})
    ax.plot(xs, a + b * xs, color=c[0], lw=2.2)
    ax.plot(x, y, "o", color=c[1], ms=8, zorder=5)
    S.label_end(ax, 4.75, 6.1, "y = 0.05 + 1.99x", c[0], mode, ha="right")
    S.note(ax, 0.65, 9.9, "five measurements, one straight line", mode)
    ax.set_ylabel("y")
    ax.set_title("Least squares makes the residuals orthogonal, not small")
    ax.set_ylim(1.2, 11.4)
    S.strip(ax)

    bx.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    for xi, ri in zip(x, res):
        bx.plot([xi, xi], [0.0, ri], color=c[1], lw=1.8)
    bx.plot(x, res, "o", color=c[1], ms=7, zorder=5)
    S.note(bx, 0.65, 0.20, "residuals sum to 0 and their dot product with x is 0:\nthe two normal equations, restated", mode)
    bx.set_xlabel("x")
    bx.set_ylabel("residual")
    bx.set_xlim(0.4, 5.9)
    bx.set_ylim(-0.34, 0.42)
    S.strip(bx)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "math4-"
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
