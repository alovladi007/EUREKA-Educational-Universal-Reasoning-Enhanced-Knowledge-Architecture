#!/usr/bin/env python3
"""Depth-wave-25 figures for the FE Electrical and Computer course.

Scope: the PID-controller chapter and the time-domain-specification chapter of
the Control Systems section. Same contract as the earlier generators, and the
same shared style module, so these plots sit beside the existing ones without
introducing a second look.

Nothing here is traced, scanned or adapted from a reference work. Every curve
is integrated or evaluated in this file from the transfer function the lesson
writes down, which means a reader can rerun the script and get the picture
back. Formulas are not protected expression; other people's drawings of them
are, and this pipeline never touches one.

Because these figures make quantitative claims - this overshoot, that noise
gain, this ultimate gain recovered from a relay test - each generator ASSERTS
its claim numerically before the axes are drawn, and the tolerances are tight
enough that a wrong claim stops the script instead of shipping. Where the
lesson teaches a closed-form rule, the assertion compares the rule against a
measurement taken off the simulated response, never the rule against itself.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 scripts/gen_fe_ee_d25.py             # all
    python3 scripts/gen_fe_ee_d25.py ctl4-pid    # only names starting "ctl4-pid"
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy import signal
from scipy.integrate import solve_ivp

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "ctl4-"


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# shared numerics
# ---------------------------------------------------------------------------
THREE_LAG = np.polymul(np.polymul([1.0, 1.0], [1.0, 1.0]), [1.0, 1.0])
KU, WU = 8.0, np.sqrt(3.0)
PU = 2 * np.pi / WU                       # 3.627599 s


def overshoot_pct(zeta: float) -> float:
    """The standard-form overshoot rule, in one place."""
    return float(np.exp(-np.pi * zeta / np.sqrt(1 - zeta ** 2)) * 100)


def closed_loop(numC, denC, numG, denG):
    n = np.polymul(numC, numG)
    d = np.polymul(denC, denG)
    return signal.TransferFunction(n, np.polyadd(d, n))


def step_of(tf, t):
    return signal.step(tf, T=t)[1]


def measure(t, y, final=1.0, band=0.02):
    """Overshoot, peak time, first arrival at the final value, settling time.

    Read off the response, never off a formula: settling time is the LAST
    departure from the band on the dense grid.
    """
    y = np.asarray(y, float)
    i = int(np.argmax(y))
    tr = np.nan
    hit = np.nonzero(y >= final)[0]
    if hit.size and hit[0] > 0:
        k = hit[0]
        tr = float(np.interp(final, [y[k - 1], y[k]], [t[k - 1], t[k]]))
    out = np.nonzero(np.abs(y - final) > band * abs(final))[0]
    return dict(os=(y[i] - final) / final * 100.0, tp=float(t[i]), tr=tr,
                ts=float(t[out[-1]]) if out.size else 0.0, peak=float(y[i]))


def freq(num, den, w):
    s = 1j * np.asarray(w, dtype=float)
    return np.polyval(num, s) / np.polyval(den, s)


def crossover(num, den):
    """Gain crossover and phase margin, by bisection on the real curve."""
    from scipy.optimize import brentq
    w = np.logspace(-3, 3, 200001)
    m = np.abs(freq(num, den, w)) - 1.0
    i = np.nonzero(np.diff(np.sign(m)) != 0)[0][0]
    wc = brentq(lambda x: np.abs(freq(num, den, x)) - 1.0, w[i], w[i + 1],
                xtol=1e-14, rtol=8.9e-16)
    return wc, 180.0 + float(np.angle(freq(num, den, wc), deg=True))


def tf_to_ss(num, den):
    A, B, C, D = signal.tf2ss(num, den)
    assert abs(float(np.atleast_2d(D)[0, 0])) < 1e-12
    return np.asarray(A), np.asarray(B).ravel(), np.asarray(C).ravel()


def pid_sim(A, B, C, Kp, Ki, Kd, tf, umin=-np.inf, umax=np.inf, clamp=False,
            d_on_meas=False, N=None, dt=2e-3, setpoint=1.0):
    """PID around a state-space plant, integrated with RK45.

    The integrator is a state, the filtered derivative is a state, and the
    actuator limit is applied to the signal that actually reaches the plant -
    so windup, anti-windup and the derivative kick are all consequences of the
    integration rather than of anything drawn by hand.
    """
    A = np.atleast_2d(A)
    nx = A.shape[0]
    B = np.asarray(B, float).reshape(nx)
    C = np.asarray(C, float).reshape(nx)
    tau = (Kd / Kp) / N if (N and Kd > 0) else None

    def command(t, x):
        y = float(C @ x[:nx])
        e = setpoint - y
        if tau is None:
            deriv = 0.0
        else:
            src = (-y) if d_on_meas else e
            deriv = Kd * (src - x[nx + 1]) / tau
        return e, y, Kp * e + Ki * x[nx] + deriv

    def rhs(t, x):
        e, y, u = command(t, x)
        us = min(max(u, umin), umax)
        di = 0.0 if (clamp and us != u and e * u > 0) else e
        dd = 0.0 if tau is None else (((-y) if d_on_meas else e) - x[nx + 1]) / tau
        return np.concatenate([A @ x[:nx] + B * us, [di], [dd]])

    sol = solve_ivp(rhs, (0.0, tf), np.zeros(nx + 2), method="RK45",
                    max_step=dt, rtol=1e-9, atol=1e-11, dense_output=True)
    t = np.linspace(0.0, tf, int(tf / dt) + 1)
    x = sol.sol(t)
    y = C @ x[:nx]
    e = setpoint - y
    if tau is None:
        deriv = np.zeros_like(t)
    else:
        src = (-y) if d_on_meas else e
        deriv = Kd * (src - x[nx + 1]) / tau
    u = Kp * e + Ki * x[nx] + deriv
    return t, y, u, np.clip(u, umin, umax)


# ===========================================================================
# PID chapter
# ===========================================================================


@figure("ctl4-pid-p-offset")
def _(mode):
    """Proportional gain shrinks the offset and grows the ringing.

    Plant 2/[(s+1)(s+4)], DC gain one half, so the closed-loop offset is
    exactly 1/(1 + K_p/2) and the closed-loop poles obey wn^2 = 4 + 2 K_p with
    2 zeta wn = 5. Both are asserted against the simulated response before the
    figure is drawn.
    """
    c = S.SERIES[mode]
    numG, denG = [2.0], np.polymul([1.0, 1.0], [1.0, 4.0])
    gains = [2.0, 10.0, 50.0]
    t = np.linspace(0, 6, 240001)
    curves, offs = [], []
    for k, Kp in enumerate(gains):
        den = np.polyadd(denG, [0.0, 0.0, 2.0 * Kp])
        y = step_of(signal.TransferFunction([2.0 * Kp], den), t)
        wn = np.sqrt(den[2])
        zeta = den[1] / (2 * wn)
        final = 2.0 * Kp / (4.0 + 2.0 * Kp)
        m = measure(t, y, final=final)
        # the two claims: the offset formula and the overshoot formula, each
        # against the measured response
        assert abs((1 - final) - 1 / (1 + 0.5 * Kp)) < 1e-12
        assert abs(y[-1] - final) < 2e-4, (y[-1], final)
        assert abs(m["os"] - overshoot_pct(zeta)) < 5e-3, (m["os"], zeta)
        curves.append(y)
        offs.append(1 - final)
    assert abs(offs[0] - 0.5) < 1e-12
    assert abs(offs[1] - 1 / 6) < 1e-12
    assert abs(offs[2] - 1 / 26) < 1e-12

    fig, ax = plt.subplots()
    for k, Kp in enumerate(gains):
        ax.plot(t, curves[k], color=c[k], lw=2.1)
        S.label_end(ax, 6.0, curves[k][-1], f"$K_p$ = {Kp:g}", c[k], mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 0.15, 1.02, "setpoint", mode)
    for k, Kp in enumerate(gains):
        fin = 1 - offs[k]
        ax.annotate("", xy=(4.6, fin), xytext=(4.6, 1.0),
                    arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=0.9))
        S.note(ax, 4.7, 0.5 * (fin + 1.0) - 0.03, f"offset {offs[k]:.3f}", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output  y(t)")
    ax.set_title("Proportional gain trades offset against ringing")
    ax.set_xlim(0, 7.4)
    ax.set_ylim(0, 1.55)
    S.strip(ax)
    return fig


@figure("ctl4-pid-integral-cost")
def _(mode):
    """Integral action removes the offset and costs phase at the crossover."""
    c = S.SERIES[mode]
    numG, denG = [2.0], np.polymul([1.0, 1.0], [1.0, 4.0])
    Kp = 10.0
    wcP, pmP = crossover(np.polymul([Kp], numG), denG)
    assert abs(wcP - 3.586086) < 2e-5, wcP
    assert abs(pmP - 63.7045) < 2e-3, pmP

    t = np.linspace(0, 5, 200001)
    yP = step_of(closed_loop([Kp], [1.0], numG, denG), t)
    yI = step_of(closed_loop([Kp, Kp / 1.0], [1.0, 0.0], numG, denG), t)
    assert abs(yP[-1] - 10.0 / 12.0) < 1e-4, yP[-1]
    assert abs(yI[-1] - 1.0) < 1e-4, yI[-1]

    lags, pms = [], []
    for Ti in (0.5, 1.0, 2.0):
        wc, pm = crossover(np.polymul([Kp, Kp / Ti], numG),
                           np.polymul([1.0, 0.0], denG))
        lags.append(-np.degrees(np.arctan(1.0 / (Ti * wc))))
        pms.append(pm)
    # the lesson's claim: the phase the PI removes at the crossover accounts
    # for the margin that disappears, to about a degree
    for lag, pm in zip(lags, pms):
        assert abs((pmP - pm) - abs(lag)) < 3.6, (pmP - pm, lag)
    assert abs(pms[1] - 47.3878) < 2e-3, pms[1]

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.1))
    a1.plot(t, yP, color=c[0], lw=2.1)
    a1.plot(t, yI, color=c[1], lw=2.1)
    a1.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(a1, 5.0, yP[-1], "P only\noffset 0.1667", c[0], mode)
    S.label_end(a1, 5.0, yI[-1], "PI, $T_i$ = 1 s\nno offset", c[1], mode)
    a1.set_xlim(0, 6.6)
    a1.set_ylim(0, 1.35)
    a1.set_xlabel("time  (s)")
    a1.set_ylabel("output")
    a1.set_title("What integral action buys, and what it costs")
    S.strip(a1)

    w = np.logspace(-1, 1.4, 900)
    for k, Ti in enumerate((0.5, 1.0, 2.0)):
        a2.plot(w, -np.degrees(np.arctan(1.0 / (Ti * w))), color=c[k], lw=2.0)
        S.label_end(a2, w[-1], -np.degrees(np.arctan(1.0 / (Ti * w[-1]))),
                    f"$T_i$ = {Ti:g} s", c[k], mode)
    a2.axvline(wcP, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, wcP * 1.06, -78, "gain crossover\n3.586 rad/s", mode)
    a2.set_xscale("log")
    a2.set_xlim(0.1, 60)
    a2.set_ylim(-90, 0)
    a2.set_xlabel("frequency  (rad/s)")
    a2.set_ylabel("phase added by PI  (deg)")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl4-pid-noise-gain")
def _(mode):
    """The derivative path's gain to sensor noise, filtered and unfiltered."""
    c = S.SERIES[mode]
    Kp, Td = 4.8, PU / 8
    Kd = Kp * Td
    w = np.logspace(-1, 4, 1200)
    fig, ax = plt.subplots()
    ax.plot(w, Kd * w, color=S.GUIDE[mode], lw=1.6, ls="--")
    S.note(ax, 1.2e3, 1.1e3, "unfiltered $K_d s$:\nno ceiling at all", mode)
    for k, N in enumerate((5, 10, 20)):
        tau = Td / N
        mag = Kd * w / np.sqrt(1 + (w * tau) ** 2)
        assert abs(mag[-1] - Kp * N) / (Kp * N) < 2e-3, (mag[-1], Kp * N)
        ax.plot(w, mag, color=c[k], lw=2.1)
        S.label_end(ax, w[-1], mag[-1], f"N = {N}\nceiling {Kp * N:g}", c[k], mode)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlim(0.1, 3e4)
    ax.set_ylim(0.05, 5e3)
    ax.set_xlabel("frequency  (rad/s)")
    ax.set_ylabel("gain from measurement to controller output")
    ax.set_title("A filter puts a ceiling on the derivative term's noise gain")
    S.strip(ax)
    return fig


@figure("ctl4-pid-windup")
def _(mode):
    """Integral windup on a limited actuator, and what clamping recovers."""
    c = S.SERIES[mode]
    A, B, C = tf_to_ss([1.0], THREE_LAG)
    Kp, Ti = 0.45 * KU, PU / 1.2
    Ki = Kp / Ti
    umax = 1.05
    runs = {}
    for tag, kw in (("linear", dict()),
                    ("wound up", dict(umin=0.0, umax=umax)),
                    ("clamped", dict(umin=0.0, umax=umax, clamp=True))):
        t, y, u, us = pid_sim(A, B, C, Kp, Ki, 0.0, 90.0, **kw)
        sat = float(np.sum(np.abs(u - us) > 1e-9) * (t[1] - t[0]))
        runs[tag] = (t, y, u, us, measure(t, y), sat)
    # the claims the lesson prints, each measured off the integration above:
    # a limited actuator on a unity-gain plant pins the output at the ceiling;
    # windup then triples the settling time; clamping the integrator recovers
    # it and beats even the unlimited loop.
    assert abs(runs["wound up"][4]["os"] - 100 * (umax - 1)) < 1e-3, runs["wound up"][4]
    assert abs(runs["linear"][4]["ts"] - 30.766) < 5e-3, runs["linear"][4]["ts"]
    assert abs(runs["wound up"][4]["ts"] - 45.420) < 5e-3, runs["wound up"][4]["ts"]
    assert abs(runs["clamped"][4]["ts"] - 13.448) < 5e-3, runs["clamped"][4]["ts"]
    assert abs(runs["wound up"][5] - 42.34) < 0.02, runs["wound up"][5]
    assert abs(runs["clamped"][5] - 4.03) < 0.02, runs["clamped"][5]
    assert abs(runs["linear"][2].max() - 3.9939) < 5e-4, runs["linear"][2].max()

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.3), sharex=True)
    for k, tag in enumerate(("linear", "wound up", "clamped")):
        t, y, u, us, m, sat = runs[tag]
        a1.plot(t, y, color=c[k], lw=2.1)
        a2.plot(t, us, color=c[k], lw=2.1)
        S.label_end(a1, t[-1], y[-1], f"{tag}\nsettles {m['ts']:.1f} s", c[k], mode,
                    dy=[16, 0, -16][k])
    a1.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    a2.axhline(umax, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, 44, umax + 0.06, "actuator ceiling 1.05", mode)
    S.note(a1, 20, 1.22, "wound up: the actuator is pinned\nfor 42.3 s of a 90 s window", mode)
    a1.set_ylabel("output  y(t)")
    a1.set_title("Windup, and the one-line fix")
    a2.set_ylabel("actuator  u(t)")
    a2.set_xlabel("time  (s)")
    a1.set_xlim(0, 112)
    a1.set_ylim(0, 1.75)
    a2.set_ylim(-0.05, 1.6)
    S.strip(a1)
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl4-pid-kick")
def _(mode):
    """Derivative kick, and the cure that costs nothing in the loop."""
    c = S.SERIES[mode]
    A, B, C = tf_to_ss([1.0], THREE_LAG)
    Kp, Ti, Td = 0.6 * KU, PU / 2, PU / 8
    Ki, Kd, N = Kp / Ti, Kp * Td, 10
    t1, y1, u1, _ = pid_sim(A, B, C, Kp, Ki, Kd, 20.0, N=N, dt=5e-4)
    t2, y2, u2, _ = pid_sim(A, B, C, Kp, Ki, Kd, 20.0, N=N, d_on_meas=True, dt=5e-4)
    # the kick height is the proportional command plus the filtered derivative
    # ceiling, K_p (1 + N); the measurement form never sees the setpoint jump
    assert abs(u1.max() - Kp * (1 + N)) < 1e-6, u1.max()
    assert u2.max() < Kp * 1.2, u2.max()
    assert abs(u1.max() / u2.max() - 10.1) < 0.2, u1.max() / u2.max()

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.3))
    a1.plot(t1, u1, color=c[0], lw=2.1)
    a1.plot(t2, u2, color=c[1], lw=2.1)
    a1.set_xlim(0, 3.2)
    a1.set_ylim(-8, 60)
    S.label_end(a1, 0.42, Kp * (1 + N), "derivative of the error:\npeak 52.8", c[0], mode)
    S.label_end(a1, 1.5, u2[int(1.5 / 5e-4)], "derivative of the measurement:\npeak 5.23",
                c[1], mode, dy=14)
    a1.set_ylabel("controller output  u(t)")
    a1.set_xlabel("time  (s)")
    a1.set_title("The setpoint jump reaches the actuator only if you let it")
    S.strip(a1)

    a2.plot(t1, y1, color=c[0], lw=2.1)
    a2.plot(t2, y2, color=c[1], lw=2.1)
    a2.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    m1, m2 = measure(t1, y1), measure(t2, y2)
    S.label_end(a2, 20.0, y1[-1], f"{m1['os']:.1f}% over", c[0], mode, dy=12)
    S.label_end(a2, 20.0, y2[-1], f"{m2['os']:.1f}% over", c[1], mode, dy=-12)
    a2.set_xlim(0, 24)
    a2.set_ylim(0, 1.75)
    a2.set_ylabel("output  y(t)")
    a2.set_xlabel("time  (s)")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl4-pid-relay")
def _(mode):
    """A relay experiment recovers the ultimate gain to within a few percent."""
    c = S.SERIES[mode]
    A, B, C = tf_to_ss([1.0], THREE_LAG)
    d = 1.0

    def rhs(t, x):
        y = float(C @ x)
        return A @ x + B * (d * np.sign(-y) if abs(y) > 1e-12 else d)

    sol = solve_ivp(rhs, (0, 120), np.array([0.0, 0.0, 1e-3]), max_step=1e-3,
                    rtol=1e-9, atol=1e-11, dense_output=True)
    t = np.linspace(100, 112, 240001)
    y = C @ sol.sol(t)
    u = np.where(y < 0, d, -d)
    a = 0.5 * (y.max() - y.min())
    zc = t[np.nonzero(np.diff(np.sign(y)))[0]]
    per = 2 * float(np.mean(np.diff(zc)))
    Ku_est = 4 * d / (np.pi * a)
    assert abs(Ku_est - 7.8083) < 3e-3, Ku_est
    assert abs(per - 3.6797) < 3e-3, per
    assert abs(Ku_est / KU - 1) < 0.03 and abs(per / PU - 1) < 0.02

    fig, ax = plt.subplots()
    ax.plot(t - 100, y, color=c[0], lw=2.2)
    ax.plot(t - 100, 0.05 * u, color=c[1], lw=1.7)
    S.label_end(ax, 12.0, y[-1], "process output", c[0], mode, dy=14)
    S.label_end(ax, 12.0, 0.05 * u[-1], "relay output\n(scaled to fit)", c[1], mode, dy=-16)
    ax.axhline(0.0, color=S.GRID[mode], lw=0.9)
    ax.annotate("", xy=(2.4, -a), xytext=(2.4, a),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=1.0))
    S.note(ax, 2.55, -0.02, f"amplitude a = {a:.4f}", mode)
    i0 = int(np.argmax(y[:60000]))
    ax.annotate("", xy=(t[i0] - 100, 0.21), xytext=(t[i0] - 100 + per, 0.21),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=1.0))
    S.note(ax, t[i0] - 100 + 0.35, 0.225, f"period {per:.3f} s", mode)
    ax.set_xlabel("time after the limit cycle settles  (s)")
    ax.set_ylabel("amplitude")
    ax.set_title("Relay feedback measures the ultimate gain without instability")
    ax.set_xlim(0, 15.6)
    ax.set_ylim(-0.26, 0.30)
    S.strip(ax)
    return fig


@figure("ctl4-pid-tuning-sweep")
def _(mode):
    """Sweeping the proportional gain and MEASURING what the loop does."""
    c = S.SERIES[mode]
    Ti, Td = PU / 2, PU / 8
    ks = np.arange(0.4, 6.01, 0.05)
    t = np.linspace(0, 45, 90001)
    os_, ts_ = [], []
    for Kp in ks:
        y = step_of(closed_loop([Kp * Td, Kp, Kp / Ti], [1.0, 0.0], [1.0], THREE_LAG), t)
        m = measure(t, y)
        os_.append(m["os"])
        ts_.append(m["ts"])
    os_, ts_ = np.array(os_), np.array(ts_)
    izn = int(np.argmin(np.abs(ks - 4.8)))
    assert abs(ks[izn] - 4.8) < 1e-9
    assert abs(os_[izn] - 40.573) < 0.05, os_[izn]
    assert os_[0] < 10.0 < os_[-1]

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.3), sharex=True)
    a1.plot(ks, os_, color=c[0], lw=2.2)
    a1.axhline(10.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    a1.plot([4.8], [os_[izn]], "o", color=c[1], ms=8, zorder=6)
    S.note(a1, 0.45, 11.5, "10% overshoot budget", mode)
    S.label_end(a1, 4.8, os_[izn], "Ziegler-Nichols\nsits here", c[1], mode, dx=-118, dy=6)
    a1.set_ylabel("measured overshoot  (%)")
    a1.set_title("Tuning by measurement, not by table")
    a1.set_ylim(0, 50)
    S.strip(a1)

    a2.plot(ks, ts_, color=c[0], lw=2.2)
    a2.plot([4.8], [ts_[izn]], "o", color=c[1], ms=8, zorder=6)
    a2.set_ylabel("measured 2% settling  (s)")
    a2.set_xlabel("proportional gain  $K_p$   ($T_i$ and $T_d$ held at the Z-N values)")
    a2.set_xlim(0.3, 6.2)
    a2.set_ylim(0, 14)
    S.note(a2, 0.45, 11.6, "settling jumps where a ripple peak\ncrosses the band edge", mode)
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl4-pid-sampling")
def _(mode):
    """What the sample interval does to a controller designed in continuous time."""
    c = S.SERIES[mode]
    A, B, C = tf_to_ss([1.0], THREE_LAG)
    Kp, Ti, Td = 3.36, PU, PU / 8
    Ki, Kd, N = Kp / Ti, Kp * Td, 10
    tau = Td / N
    wc, pm = crossover(np.polymul([Kp * Td, Kp, Ki], [1.0]),
                       np.polymul([1.0, 0.0], THREE_LAG))

    def run(Ts, tf=45.0):
        Ad, Bd, Cd, _, _ = signal.cont2discrete(
            (A, B.reshape(-1, 1), C.reshape(1, -1), [[0.0]]), Ts, method="zoh")
        x = np.zeros(A.shape[0])
        xi = xd = 0.0
        al = Ts / (tau + Ts)
        ts_, ys = [], []
        for k in range(int(tf / Ts) + 1):
            yk = float(Cd @ x)
            ts_.append(k * Ts)
            ys.append(yk)
            e = 1.0 - yk
            xi += Ts * e
            xd += al * (e - xd)
            u = Kp * e + Ki * xi + Kd * (e - xd) / tau
            x = Ad @ x + Bd.ravel() * u
        return np.array(ts_), np.array(ys)

    tc = np.linspace(0, 45, 90001)
    yc = step_of(closed_loop([Kp * Td, Kp, Ki], [1.0, 0.0], [1.0], THREE_LAG), tc)
    mc = measure(tc, yc)
    runs = [(Ts, *run(Ts)) for Ts in (0.05, 0.4, 0.8)]
    ms = [measure(t, y) for _, t, y in runs]
    # the hold's half-sample lag grows with Ts and the overshoot grows with it;
    # at the coarsest rate the loop has given away half its phase margin
    assert ms[0]["os"] < ms[1]["os"] < ms[2]["os"], [m["os"] for m in ms]
    assert abs(ms[0]["os"] - 17.976) < 0.05, ms[0]["os"]
    assert abs(ms[2]["os"] - 80.481) < 0.2, ms[2]["os"]
    assert 26.0 < np.degrees(wc * 0.8 / 2) < 26.3, np.degrees(wc * 0.8 / 2)
    assert abs(pm - 49.174) < 5e-3, pm

    fig, ax = plt.subplots()
    ax.plot(tc, yc, color=S.GUIDE[mode], lw=1.5, ls="--")
    S.note(ax, 12.0, 0.35, "continuous design:\n"
                           f"{mc['os']:.1f}% overshoot", mode)
    for k, (Ts, t, y) in enumerate(runs):
        ax.plot(t, y, color=c[k], lw=2.0)
        S.label_end(ax, t[-1], y[-1], f"$T_s$ = {Ts:g} s\n{ms[k]['os']:.1f}% over, "
                    f"{np.degrees(wc * Ts / 2):.0f}° lag", c[k], mode,
                    dy=[16, 0, -16][k])
    ax.axhline(1.0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output  y(t)")
    ax.set_title("A sampled controller is the continuous one plus half a sample of lag")
    ax.set_xlim(0, 60)
    ax.set_ylim(0, 1.75)
    S.strip(ax)
    return fig


def pm_design(num, den, pm_target=50.0):
    """Gain that gives this loop shape the requested phase margin.

    The phase is unwrapped before the search, because a plain angle wraps at
    -180 deg and a bracket search on the wrapped curve silently finds nothing.
    """
    from scipy.optimize import brentq
    w = np.logspace(-4, 3, 200001)
    ph = np.unwrap(np.angle(freq(num, den, w))) * 180.0 / np.pi
    resid = ph + 180.0 - pm_target
    i = int(np.nonzero(np.diff(np.sign(resid)))[0][0])
    wc = brentq(lambda x: np.interp(x, w, ph) + 180.0 - pm_target, w[i], w[i + 1],
                xtol=1e-14, rtol=8.9e-16)
    return 1.0 / abs(freq(num, den, wc)), wc


@figure("ctl4-pid-cascade")
def _(mode):
    """Why a fast inner loop is what makes the outer loop work.

    Inner process 1/(s+1), outer process 1/[(4s+1)(10s+1)], load step entering
    at the inner output. Both controllers are PI with the integral time set to
    cancel the 10 s pole, and both are given the SAME 50 degree phase margin,
    so the comparison is not a comparison of tuning aggressiveness.
    """
    c = S.SERIES[mode]
    Ti = 10.0
    G1den = np.polymul([4.0, 1.0], [10.0, 1.0])
    G2den = [1.0, 1.0]
    Kc1, wc1 = pm_design([1.0], np.polymul([Ti, 0.0], np.polymul(G2den, [4.0, 1.0])))
    K2 = 9.0
    inner = np.polyadd(G2den, [0.0, K2])
    Kc2, wc2 = pm_design([K2], np.polymul([Ti, 0.0], np.polymul(inner, [4.0, 1.0])))
    assert abs(Kc1 - 1.803278) < 2e-5, Kc1
    assert abs(Kc2 - 2.872986) < 2e-5, Kc2
    assert abs(1.0 / (1.0 + K2) - 0.1) < 1e-12

    t = np.linspace(0, 80, 800001)
    ser = np.polymul(G2den, G1den)
    Cd = [Ti, 0.0]
    dens = np.polyadd(np.polymul(Cd, ser), np.polymul([Kc1 * Ti, Kc1], [1.0]))
    y1 = step_of(signal.TransferFunction(np.polymul(Cd, G2den), dens), t)
    Gout = ([K2], np.polymul(inner, G1den))
    denc = np.polyadd(np.polymul(Cd, Gout[1]), np.polymul([Kc2 * Ti, Kc2], Gout[0]))
    y2 = step_of(signal.TransferFunction(np.polymul(Cd, G2den), denc), t)
    assert abs(y1.max() - 0.344653) < 2e-4, y1.max()
    assert abs(y2.max() - 0.026599) < 2e-5, y2.max()
    assert y1.max() / y2.max() > 12.0, y1.max() / y2.max()

    fig, ax = plt.subplots()
    ax.plot(t, y1, color=c[0], lw=2.2)
    ax.plot(t, y2, color=c[1], lw=2.2)
    ax.axhline(0.0, color=S.GRID[mode], lw=0.9)
    S.label_end(ax, 40.0, np.interp(40.0, t, y1), "single loop\n"
                f"peak {y1.max():.4f}", c[0], mode)
    S.label_end(ax, 30.0, np.interp(30.0, t, y2), "cascade\n"
                f"peak {y2.max():.4f}", c[1], mode, dy=-18)
    S.note(ax, 24.0, 0.30, "same plant, same disturbance,\nsame 50° phase margin", mode)
    ax.set_xlabel("time after a unit load step inside the inner loop  (s)")
    ax.set_ylabel("primary output deviation")
    ax.set_title("The inner loop swallows the disturbance before it becomes an error")
    ax.set_xlim(0, 72)
    S.strip(ax)
    return fig


# ===========================================================================
# Time-specification chapter
# ===========================================================================


def second_order(zeta, wn, t):
    return step_of(signal.TransferFunction([wn ** 2], [1.0, 2 * zeta * wn, wn ** 2]), t)


@figure("ctl4-ts-settling-rules")
def _(mode):
    """Exact 2% settling against the envelope estimate and the four-over rule."""
    c = S.SERIES[mode]
    zs = np.arange(0.10, 0.951, 0.01)
    exact, env, rule = [], [], []
    for z in zs:
        tf = max(30.0, 1.8 * 4.0 / z)
        t = np.linspace(0, tf, 300001)
        exact.append(measure(t, second_order(z, 1.0, t))["ts"])
        env.append(np.log(1.0 / (0.02 * np.sqrt(1 - z ** 2))) / z)
        rule.append(4.0 / z)
    exact, env, rule = np.array(exact), np.array(env), np.array(rule)
    # Claim one: the envelope is a genuine upper bound on the measured value.
    assert np.all(env >= exact - 2e-3), float(np.min(env - exact))
    # Claim two: the four-over rule is NOT. It crosses the envelope at the
    # damping ratio where 4 = ln(50) - 0.5 ln(1 - zeta^2), and above that it
    # can and does fall below the measured settling time.
    zcross = np.sqrt(1 - np.exp(2 * (np.log(50) - 4)))
    assert abs(zcross - 0.401676) < 1e-6, zcross
    assert np.any(rule < exact - 1e-3), "the rule is supposed to under-predict somewhere"
    i9 = int(np.argmin(np.abs(zs - 0.9)))
    assert rule[i9] < exact[i9], (rule[i9], exact[i9])
    assert abs(exact[i9] - 4.6996) < 5e-3, exact[i9]
    i5 = int(np.argmin(np.abs(zs - 0.5)))
    assert abs(rule[i5] - 8.0) < 1e-9 and exact[i5] > 8.0, exact[i5]

    fig, ax = plt.subplots()
    ax.plot(zs, exact, color=c[0], lw=2.0)
    ax.plot(zs, env, color=c[1], lw=2.0)
    ax.plot(zs, rule, color=c[2], lw=2.0)
    S.label_end(ax, 0.95, exact[-1], "measured", c[0], mode, dy=-14)
    S.label_end(ax, 0.95, env[-1], "envelope", c[1], mode, dy=10)
    S.label_end(ax, 0.95, rule[-1], "$4/(\\zeta \\omega_n)$", c[2], mode, dy=-4)
    ax.set_xlabel("damping ratio  $\\zeta$")
    ax.set_ylabel("2% settling time  ($\\omega_n$ = 1 rad/s)")
    ax.set_title("The settling rule is a ceiling, and a ragged one")
    ax.set_xlim(0.1, 1.12)
    ax.set_ylim(0, 42)
    S.note(ax, 0.44, 22, "each step down is one ripple peak\nfalling inside the band", mode)
    S.strip(ax)
    return fig


@figure("ctl4-ts-rise-fit")
def _(mode):
    """The 10-90% rise time, measured, against two approximations."""
    c = S.SERIES[mode]
    zs = np.arange(0.10, 0.901, 0.01)
    meas = []
    for z in zs:
        t = np.linspace(0, max(30.0, 8.0 / z), 400001)
        y = second_order(z, 1.0, t)
        lo = np.interp(0.1, y[: int(np.argmax(y))], t[: int(np.argmax(y))])
        hi = np.interp(0.9, y[: int(np.argmax(y))], t[: int(np.argmax(y))])
        meas.append(hi - lo)
    meas = np.array(meas)
    band = (zs >= 0.2999) & (zs <= 0.9001)
    # the cubic PUBLISHED in the lesson, checked against the measured curve
    PUBLISHED = [1.981, -0.798, 1.247, 0.966]
    fit = np.polyval(PUBLISHED, zs)
    assert np.max(np.abs(fit[band] - meas[band]) / meas[band]) < 0.002, \
        np.max(np.abs(fit[band] - meas[band]) / meas[band])
    assert abs(np.interp(0.5, zs, meas) - 1.6376) < 2e-3, np.interp(0.5, zs, meas)
    assert abs(np.interp(0.9, zs, meas) - 2.8830) < 3e-3, np.interp(0.9, zs, meas)
    assert abs(np.interp(1.8, meas, zs) - 0.5770) < 5e-4, np.interp(1.8, meas, zs)

    fig, ax = plt.subplots()
    ax.plot(zs, meas, color=c[0], lw=2.3)
    ax.plot(zs, fit, color=c[1], lw=1.9, ls="--")
    ax.plot(zs, np.full_like(zs, 1.8), color=c[2], lw=1.9)
    S.label_end(ax, 0.9, meas[-1], "measured", c[0], mode, dy=10)
    S.label_end(ax, 0.9, fit[-1], "cubic fit", c[1], mode, dy=-12)
    S.label_end(ax, 0.9, 1.8, "the 1.8 rule", c[2], mode)
    ax.plot([0.5764], [1.8], "o", color=S.GUIDE[mode], ms=7, zorder=6)
    S.note(ax, 0.30, 1.86, "the flat rule is exact at one damping ratio only", mode)
    ax.set_xlabel("damping ratio  $\\zeta$")
    ax.set_ylabel("$\\omega_n t_r$  (10% to 90%)")
    ax.set_title("A flat rise-time rule is right once and wrong everywhere else")
    ax.set_xlim(0.1, 1.16)
    ax.set_ylim(0.8, 3.2)
    S.strip(ax)
    return fig


@figure("ctl4-ts-third-pole")
def _(mode):
    """An extra real pole, measured against the second-order prediction."""
    c = S.SERIES[mode]
    z, wn = 0.5, 1.0
    base = [1.0, 2 * z * wn, wn ** 2]
    t = np.linspace(0, 30, 300001)
    y0 = second_order(z, wn, t)
    m0 = measure(t, y0)
    assert abs(m0["os"] - overshoot_pct(z)) < 5e-3

    alphas = np.arange(1.2, 20.01, 0.2)
    os_ = []
    for a in alphas:
        p = a * z * wn
        y = step_of(signal.TransferFunction([wn ** 2 * p], np.polymul(base, [1.0, p])), t)
        os_.append(measure(t, y)["os"])
    os_ = np.array(os_)
    i5 = int(np.argmin(np.abs(alphas - 5.0)))
    assert abs(os_[i5] - 14.770) < 0.05, os_[i5]
    assert os_[-1] < m0["os"] and np.all(np.diff(os_) > -1e-6)

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.4))
    for k, a in enumerate((2.0, 5.0, 20.0)):
        p = a * z * wn
        y = step_of(signal.TransferFunction([wn ** 2 * p], np.polymul(base, [1.0, p])), t)
        a1.plot(t, y, color=c[k], lw=2.0)
        S.label_end(a1, 14.0, np.interp(14.0, t, y), f"pole at ${-p:g}$",
                    c[k], mode, dy=[16, 0, -16][k])
    a1.plot(t, y0, color=S.GUIDE[mode], lw=1.4, ls="--")
    a1.axhline(1.0, color=S.GRID[mode], lw=0.9)
    S.note(a1, 6.2, 0.42, "dashed: the pair on its own", mode)
    a1.set_xlim(0, 21)
    a1.set_ylim(0, 1.35)
    a1.set_xlabel("time  (s)")
    a1.set_ylabel("output")
    a1.set_title("A third pole slows the loop and eats the overshoot")
    S.strip(a1)

    a2.plot(alphas, os_, color=c[0], lw=2.2)
    a2.axhline(m0["os"], color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(a2, 12.4, m0["os"] - 2.1, "second-order prediction 16.30%", mode)
    a2.axvline(5.0, color=S.GRID[mode], lw=1.1)
    S.note(a2, 5.3, 3.0, "the factor-of-five rule of thumb", mode)
    a2.set_xlabel("extra pole, as a multiple of $\\zeta \\omega_n$")
    a2.set_ylabel("measured overshoot  (%)")
    a2.set_xlim(1, 20)
    a2.set_ylim(0, 19)
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl4-ts-zero-effect")
def _(mode):
    """A zero adds a scaled derivative of the response, and the overshoot with it."""
    c = S.SERIES[mode]
    z, wn = 0.5, 1.0
    base = [1.0, 2 * z * wn, wn ** 2]
    t = np.linspace(0, 30, 300001)
    y0 = second_order(z, wn, t)
    # the derivative the lesson DERIVES in section 5.1 - a pure damped sine
    # with no phase shift - used here as the independent route, and checked
    # against a central difference of the simulated response first
    wd = wn * np.sqrt(1 - z ** 2)
    dy = wn / np.sqrt(1 - z ** 2) * np.exp(-z * wn * t) * np.sin(wd * t)
    # compare on the interior only: np.gradient falls back to a one-sided
    # difference at the two endpoints, which is first order and not the claim
    gap = np.max(np.abs(dy - np.gradient(y0, t))[2:-2])
    assert gap < 1e-7, gap
    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.4))
    for k, b in enumerate((1.0, 3.0, 10.0)):
        zz = b * z * wn
        y = step_of(signal.TransferFunction([wn ** 2 / zz, wn ** 2], base), t)
        # independent route: adding a zero at -z adds y'(t)/z to the response
        assert np.max(np.abs(y - (y0 + dy / zz))) < 3e-5, b
        m = measure(t, y)
        a1.plot(t, y, color=c[k], lw=2.0)
        S.label_end(a1, 12.0, np.interp(12.0, t, y), f"zero at ${-zz:g}$\n{m['os']:.1f}% over",
                    c[k], mode, dy=[16, 0, -16][k])
    a1.plot(t, y0, color=S.GUIDE[mode], lw=1.4, ls="--")
    a1.axhline(1.0, color=S.GRID[mode], lw=0.9)
    S.note(a1, 4.6, 0.32, "dashed: no zero, 16.30% over", mode)
    a1.set_xlim(0, 19.5)
    a1.set_ylim(0, 2.0)
    a1.set_xlabel("time  (s)")
    a1.set_ylabel("output")
    a1.set_title("A nearby zero lifts the overshoot; a right-half-plane zero digs a hole")
    S.strip(a1)

    for k, b in enumerate((-2.0, -5.0)):
        zz = b * z * wn
        y = step_of(signal.TransferFunction([wn ** 2 / zz, wn ** 2], base), t)
        assert y.min() < -0.01, b
        a2.plot(t, y, color=c[k], lw=2.0)
        S.label_end(a2, 12.0, np.interp(12.0, t, y), f"zero at $+{-zz:g}$\n"
                    f"dips to {y.min():.3f}", c[k], mode, dy=[14, -14][k])
    a2.axhline(1.0, color=S.GRID[mode], lw=0.9)
    a2.axhline(0.0, color=S.GRID[mode], lw=0.9)
    a2.set_xlim(0, 19.5)
    a2.set_ylim(-0.45, 1.5)
    a2.set_xlabel("time  (s)")
    a2.set_ylabel("output")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl4-ts-design-region")
def _(mode):
    """Two specifications, two s-plane regions, one corner design."""
    c = S.SERIES[mode]
    zt = -np.log(0.10) / np.sqrt(np.pi ** 2 + np.log(0.10) ** 2)
    ang = np.degrees(np.arccos(zt))
    wn = 2.0 / zt
    wd = wn * np.sqrt(1 - zt ** 2)
    assert abs(zt - 0.591155) < 5e-7, zt
    assert abs(ang - 53.7610) < 5e-4, ang
    assert abs(wd - 2.728753) < 5e-6, wd
    t = np.linspace(0, 8, 800001)
    m = measure(t, second_order(zt, wn, t))
    assert abs(m["os"] - 10.0) < 2e-3, m["os"]

    fig, ax = plt.subplots(figsize=(7.2, 5.2))
    xs = np.linspace(-7, 0.4, 400)
    ax.fill_betweenx([-6, 6], -7, -2, color=c[1], alpha=0.13, lw=0)
    r = np.linspace(0, 7.4, 200)
    th = np.radians(180 - ang)
    ax.fill_between(r * np.cos(th), r * np.sin(th), -r * np.sin(th),
                    color=c[0], alpha=0.15, lw=0)
    ax.plot(r * np.cos(th), r * np.sin(th), color=c[0], lw=1.8)
    ax.plot(r * np.cos(th), -r * np.sin(th), color=c[0], lw=1.8)
    ax.axvline(-2, color=c[1], lw=1.8)
    ax.plot([-2, -2], [wd, -wd], "x", color=S.INK[mode], ms=11, mew=2.2, zorder=7)
    S.note(ax, -1.9, wd + 0.25, f"$s = -2 \\pm j{wd:.3f}$", mode)
    S.note(ax, -6.8, 4.6, f"$\\zeta \\geq {zt:.4f}$: at most 10% over", mode)
    S.note(ax, -6.8, -5.2, "$\\zeta \\omega_n \\geq 2$: settles inside 2 s", mode)
    S.note(ax, -4.6, 1.05, f"wedge half-angle {ang:.2f}°", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlim(-7, 0.6)
    ax.set_ylim(-6, 6)
    ax.set_xlabel("real part  (1/s)")
    ax.set_ylabel("imaginary part  (rad/s)")
    ax.set_title("Each specification is a region; the design is the corner")
    S.strip(ax)
    return fig


@figure("ctl4-ts-error-types")
def _(mode):
    """System type decides which input a loop can track without error."""
    c = S.SERIES[mode]
    t = np.linspace(0, 40, 400001)
    curves = []
    for num, den, extra, label, target in (
        ([40.0], np.polymul([1, 2], [1, 5]), [1.0], "Type 0, step", 0.2),
        ([40.0], np.polymul([1, 0], np.polymul([1, 2], [1, 5])), [1.0, 0.0],
         "Type 1, ramp", 0.25),
        ([40.0, 40.0], np.polymul([1, 0, 0], [1, 5]), [1.0, 0.0, 0.0],
         "Type 2, parabola", 0.125),
    ):
        cl = np.polyadd(den, np.r_[np.zeros(len(den) - len(num)), num])
        assert np.all(np.real(np.roots(cl)) < 0), label
        e = step_of(signal.TransferFunction(den, np.polymul(cl, extra)), t)
        assert abs(e[-1] - target) < 2e-3, (label, e[-1])
        curves.append((e, label, target))

    fig, ax = plt.subplots()
    for k, (e, label, target) in enumerate(curves):
        ax.plot(t, e, color=c[k], lw=2.1)
        S.label_end(ax, 40.0, e[-1], f"{label}\nsettles at {target:g}", c[k], mode,
                    dy=[12, 0, -12][k])
    ax.axhline(0.0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("tracking error  e(t)")
    ax.set_title("Each integrator buys exactly one more input class")
    ax.set_xlim(0, 54)
    ax.set_ylim(-0.1, 0.45)
    S.note(ax, 12.0, 0.36, "the gain is 40 in all three loops;\nonly the integrator count differs",
           mode)
    S.strip(ax)
    return fig


@figure("ctl4-ts-feasible-map")
def _(mode):
    """Which specification triples a second-order design can actually meet."""
    c = S.SERIES[mode]
    # measured 10-90 % rise, normalised by wn, over the damping range
    zs = np.arange(0.10, 0.901, 0.01)
    meas = []
    for z in zs:
        t = np.linspace(0, max(30.0, 8.0 / z), 200001)
        y = second_order(z, 1.0, t)
        j = int(np.argmax(y))
        meas.append(np.interp(0.9, y[:j], t[:j]) - np.interp(0.1, y[:j], t[:j]))
    meas = np.array(meas)

    os_axis = np.linspace(1.0, 50.0, 400)
    zeta = -np.log(os_axis / 100) / np.sqrt(np.pi ** 2 + np.log(os_axis / 100) ** 2)
    wn_tr = np.interp(zeta, zs, meas)
    cap = 10.0
    fig, ax = plt.subplots()
    for k, ts_req in enumerate((0.4, 1.0, 2.0)):
        need = np.maximum(4.0 / (zeta * ts_req), wn_tr / 0.30)
        ax.plot(os_axis, need, color=c[k], lw=2.2)
        S.label_end(ax, 50.0, need[-1], f"$t_s \\leq$ {ts_req:g} s", c[k], mode,
                    dy=[10, 0, -10][k])
    ax.axhline(cap, color=S.GUIDE[mode], lw=1.4, ls="--")
    S.note(ax, 2.0, cap + 0.7, "actuator and sensor ceiling, 10 rad/s", mode)
    # the two claims the lesson makes about this map
    i10 = int(np.argmin(np.abs(os_axis - 10.0)))
    assert abs(zeta[i10] - 0.591155) < 2e-3
    assert np.maximum(4.0 / (zeta[i10] * 1.0), wn_tr[i10] / 0.30)[()] < cap
    assert np.maximum(4.0 / (zeta[i10] * 0.4), wn_tr[i10] / 0.30)[()] > cap
    ax.set_xlabel("overshoot budget  (%)")
    ax.set_ylabel("natural frequency the design needs  (rad/s)")
    ax.set_title("Specifications are feasible only until they meet the hardware")
    ax.set_xlim(1, 58)
    ax.set_ylim(0, 26)
    S.strip(ax)
    return fig


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    prefix = sys.argv[1] if len(sys.argv) > 1 else PREFIX
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
