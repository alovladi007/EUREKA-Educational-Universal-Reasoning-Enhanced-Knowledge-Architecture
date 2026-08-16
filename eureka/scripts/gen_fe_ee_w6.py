#!/usr/bin/env python3
"""Wave-6 figures for the FE Electrical and Computer course: Control Systems.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED from the transfer
function the lesson actually works, in code the reader can check. Nothing is
traced, scanned or adapted from the NCEES Reference Handbook or any textbook -
the pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Because control figures make quantitative CLAIMS (this overshoot, that margin,
this breakaway point), each generator asserts the claim numerically before it
draws: the plotted overshoot is checked against the damping-ratio formula, the
marked breakaway against the root of dK/ds, the marked margins against the
Routh limit on the same loop. If the algebra in the lesson and the picture ever
disagree, this file stops instead of shipping a pretty lie.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w6.py            # all
    python3 scripts/gen_fe_ee_w6.py ctrl-b     # only names starting "ctrl-b"
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy import signal
from scipy.optimize import brentq

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


def overshoot_pct(zeta: float) -> float:
    """The lesson's overshoot formula, in one place so every assertion uses it."""
    return float(np.exp(-np.pi * zeta / np.sqrt(1 - zeta ** 2)) * 100)


# ---------------------------------------------------------------------------
# Block diagrams and the value of the loop
# ---------------------------------------------------------------------------


@figure("ctrl-feedback-sensitivity")
def _(mode):
    """What closing the loop buys, measured on the lesson's own two-loop plant.

    Forward path L(s) = 20/(s+1)^2 (the reduction worked in the lesson), closed
    with unity feedback to T = 20/(s^2+2s+21). Both panels show the SAME plant
    gain errors, -10% and -30%, each response normalised by the nominal final
    value so the two panels share one dimensionless axis. Open loop, a 30% gain
    error is a 30% output error. Closed loop it is 2.0%, because the loop
    divides gain errors by 1 + L(0) = 21. The assertions check both numbers
    against the sensitivity formula S(0) = 1/(1 + L(0)) before drawing.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 6, 3000)
    drops = [0.0, 0.10, 0.30]

    ol, cl = [], []
    for d in drops:
        g = 20.0 * (1 - d)
        ol.append(signal.step(signal.TransferFunction([g], [1.0, 2.0, 1.0]), T=t)[1])
        cl.append(signal.step(signal.TransferFunction([g], [1.0, 2.0, 1.0 + g]), T=t)[1])
    ol = [y / (20.0) for y in ol]                  # normalise by nominal DC gain
    cl = [y / (20.0 / 21.0) for y in cl]

    # the claim the figure exists to make, checked before it is drawn: the
    # open-loop final values track the gain error one for one, the closed-loop
    # ones are pulled back towards 1 by the factor 1 + L(0) = 21.
    ol_final = [(1 - d) for d in drops]
    cl_final = [(20 * (1 - d) / (1 + 20 * (1 - d))) / (20 / 21) for d in drops]
    assert abs(ol_final[2] - 0.70) < 1e-12
    assert abs((1 - cl_final[1]) * 100 - 0.5263) < 5e-3
    assert abs((1 - cl_final[2]) * 100 - 2.0) < 5e-3
    assert abs(1 / (1 + 20.0) - 1 / 21) < 1e-12
    for sim, fin in zip(ol + cl, ol_final + cl_final):
        assert abs(sim[-1] - fin) < 0.02, (sim[-1], fin)

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 5.9), sharex=True)
    for i, d in enumerate(drops):
        a1.plot(t, ol[i], color=c[i], lw=2.0)
        a2.plot(t, cl[i], color=c[i], lw=2.0)
    for i, lab in enumerate(["nominal gain", "gain low by 10%", "gain low by 30%"]):
        S.label_end(a1, 6.0, ol[i][-1], lab, c[i], mode, dy=0)
    S.label_end(a2, 6.0, cl[2][-1], "all three\nland together", c[2], mode, dy=0)
    for ax in (a1, a2):
        ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.set_xlim(0, 8.6)
        S.strip(ax)
    a1.set_ylim(0.0, 1.25)
    a2.set_ylim(0.0, 1.6)
    S.note(a1, 0.2, 1.12, "no feedback: a 30% plant error is a 30% output error", mode)
    S.note(a2, 2.9, 0.12, "loop closed: the same 30% error moves the output 2.0%,\n"
                          "because 1 + L(0) = 21 divides it", mode)
    a1.set_ylabel("output / nominal")
    a2.set_ylabel("output / nominal")
    a2.set_xlabel("time  (s)")
    a1.set_title("Feedback does not remove plant error - it divides it by 1 + L")
    return fig


# ---------------------------------------------------------------------------
# Stability: what the Routh array is really computing
# ---------------------------------------------------------------------------


@figure("ctrl-k-stability-window")
def _(mode):
    """The rightmost closed-loop pole, swept against gain, for two loops.

    Curve 1: D(s) = s^4 + 6s^3 + 11s^2 + 6s + K, whose Routh array gives the
    window 0 < K < 10. Curve 2: the conditionally stable loop
    K(s+1)/[s(s-1)(s+6)], whose array gives K > 7.5 - it is UNSTABLE at low
    gain, which is the case the "turn the gain down" instinct gets wrong. Both
    curves are max(Re) of np.roots evaluated at each K; the assertions check
    that each crosses zero exactly at the K the Routh array predicts, so the
    picture and the algebra cannot drift apart.
    """
    c = S.SERIES[mode]
    K = np.linspace(0.05, 22.0, 1400)
    quartic = np.array([max(z.real for z in np.roots([1, 6, 11, 6, k])) for k in K])
    cubic = np.array([max(z.real for z in np.roots([1, 5, k - 6, k])) for k in K])

    def crossing(curve):
        i = np.argmax(np.sign(curve[1:]) != np.sign(curve[:-1]))
        return brentq(lambda k: (max(z.real for z in np.roots([1, 6, 11, 6, k]))
                                 if curve is quartic else
                                 max(z.real for z in np.roots([1, 5, k - 6, k]))),
                      K[i], K[i + 1])

    assert abs(crossing(quartic) - 10.0) < 1e-6, crossing(quartic)
    assert abs(crossing(cubic) - 7.5) < 1e-6, crossing(cubic)
    # and the marginal frequencies quoted in the lesson
    assert abs(max(abs(z.imag) for z in np.roots([1, 6, 11, 6, 10.0])
                   if abs(z.real) < 1e-9) - 1.0) < 1e-6
    assert abs(max(abs(z.imag) for z in np.roots([1, 5, 1.5, 7.5])
                   if abs(z.real) < 1e-8) - np.sqrt(1.5)) < 1e-6

    fig, ax = plt.subplots()
    ax.plot(K, quartic, color=c[0], lw=2.2)
    ax.plot(K, cubic, color=c[1], lw=2.2)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, 22.0, quartic[-1], "s^4 + 6s^3 + 11s^2 + 6s + K\nstable only below K = 10",
                c[0], mode, dy=-6)
    S.label_end(ax, 15.0, cubic[np.searchsorted(K, 15.0)],
                "K(s+1)/[s(s-1)(s+6)]\nstable only above K = 7.5", c[1], mode, dy=10)
    for k_c, col in ((10.0, c[0]), (7.5, c[1])):
        ax.plot([k_c], [0.0], "o", color=col, ms=7, zorder=5)
        ax.plot([k_c, k_c], [-1.2, 0.0], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 10.25, -1.15, "K = 10", mode)
    S.note(ax, 7.3, -1.15, "K = 7.5", mode, ha="right")
    S.note(ax, 11.0, 0.52, "above this line at least one closed-loop pole\nsits in the right half plane", mode)
    ax.set_xlabel("loop gain  K")
    ax.set_ylabel("largest real part among the closed-loop poles  (1/s)")
    ax.set_title("A Routh gain window is a sign change in this one curve")
    ax.set_xlim(0, 25.5)
    ax.set_ylim(-1.25, 0.85)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Root locus
# ---------------------------------------------------------------------------


@figure("ctrl-root-locus-cubic")
def _(mode):
    """The locus of K/[s(s+2)(s+4)] with every rule-derived landmark marked.

    Branches are the roots of s^3 + 6s^2 + 8s + K swept over K, so the drawing
    IS the characteristic equation. The marked points are the ones the lesson
    computes by hand: breakaway at the root of 3s^2 + 12s + 8, the jw crossing
    the Routh array puts at K = 48, and the gain K = 224/27 that lands the
    dominant pair on the zeta = 0.5 ray. Each is asserted against its closed
    form before it is drawn.
    """
    c = S.SERIES[mode]
    Ks = np.concatenate([np.linspace(0, 4, 900), np.linspace(4, 120, 2200)])
    roots = np.array([np.roots([1, 6, 8, k]) for k in Ks])

    s_b = -2 + 2 / np.sqrt(3)
    K_b = -(s_b ** 3 + 6 * s_b ** 2 + 8 * s_b)
    assert abs(s_b + 0.845299) < 1e-5, s_b
    assert abs(K_b - 3.0792) < 1e-3, K_b
    assert abs(np.polyval([3, 12, 8], s_b)) < 1e-9          # dK/ds = 0 there
    w_x = np.sqrt(8.0)
    assert abs(max(abs(z.imag) for z in np.roots([1, 6, 8, 48.0])
                   if abs(z.real) < 1e-9) - w_x) < 1e-9
    K_z = 224 / 27
    dom = [z for z in np.roots([1, 6, 8, K_z]) if z.imag > 1e-9][0]
    assert abs(-dom.real / abs(dom) - 0.5) < 1e-9, dom
    assert abs(dom - (-2 / 3 + 1j * 2 / np.sqrt(3))) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(roots.real.ravel(), roots.imag.ravel(), ".", color=c[0], ms=1.6)
    ax.plot([0, -2, -4], [0, 0, 0], "x", color=S.INK[mode], ms=11, mew=2.0)
    # asymptotes: three branches leave at +/-60 and 180 degrees from sigma = -2
    for ang in (60, 180, -60):
        r = np.linspace(0, 5.2, 2)
        ax.plot(-2 + r * np.cos(np.radians(ang)), r * np.sin(np.radians(ang)),
                color=S.GUIDE[mode], lw=1.0, ls="--")
    # the zeta = 0.5 ray
    r = np.linspace(0, 5.0, 2)
    ax.plot(-r * 0.5, r * np.sqrt(1 - 0.25), color=c[2], lw=1.4, ls="-.")
    S.label_end(ax, -7.0, 3.35, "zeta = 0.5 ray\n(60 deg from the real axis)", c[2],
                mode, ha="left")
    ax.plot([s_b], [0], "o", color=c[1], ms=7, zorder=6)
    S.note(ax, -1.15, -1.55, f"breakaway s = -0.845\n(K = {K_b:.2f})", mode, ha="right")
    for sgn in (1, -1):
        ax.plot([0], [sgn * w_x], "o", color=c[1], ms=7, zorder=6)
    S.note(ax, -0.35, w_x + 0.32, "crosses the axis at\nw = 2.83, K = 48", mode, ha="right")
    ax.plot([dom.real, dom.real], [dom.imag, -dom.imag], "s", color=c[2], ms=6.5, zorder=6)
    S.note(ax, dom.real - 0.30, dom.imag - 0.12, "K = 8.30 puts the\ndominant pair here",
           mode, ha="right")
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    S.note(ax, -7.0, -4.55, "x  open-loop poles at 0, -2, -4\n"
                             "dashed: asymptotes at +/-60 and 180 deg from sigma = -2", mode)
    ax.set_xlabel("real axis  sigma  (1/s)")
    ax.set_ylabel("imaginary axis  jw  (rad/s)")
    ax.set_title("Every rule you apply by hand is one landmark on this curve")
    ax.set_xlim(-7.2, 1.6)
    ax.set_ylim(-4.8, 4.8)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Frequency response
# ---------------------------------------------------------------------------


def _loop40(w, K=40.0):
    return K / ((1j * w) * (1j * w + 1) * (1j * w + 10))


@figure("ctrl-bode-margins")
def _(mode):
    """Bode magnitude and phase of G = 40/[s(s+1)(s+10)], margins marked.

    Both traces are the exact complex evaluation of G(jw) - no straight-line
    approximation - so the marked margins are the real ones. The two crossover
    frequencies are found by root-finding on the same expressions the lesson
    solves by hand, and the gain margin is cross-checked against the Routh
    limit K < 110 on s^3 + 11s^2 + 10s + K: 40 x 2.75 = 110, so the picture and
    the array agree to the last digit.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1.2, 2.2, 2400)
    G = _loop40(w)
    mag_db = 20 * np.log10(np.abs(G))
    ph = np.degrees(np.unwrap(np.angle(G)))       # unwrapped: it must pass -180

    w_pc = np.sqrt(10.0)
    w_gc = brentq(lambda x: np.abs(_loop40(x)) - 1.0, 0.1, 10.0)
    GM = -20 * np.log10(np.abs(_loop40(w_pc)))
    PM = 180 + np.degrees(np.angle(_loop40(w_gc)))
    assert abs(abs(np.degrees(np.angle(_loop40(w_pc)))) - 180) < 1e-6
    assert abs(GM - 8.7866) < 1e-3, GM
    assert abs(PM - 17.705) < 1e-3, PM
    assert abs(40.0 / np.abs(_loop40(w_pc)) - 110.0) < 1e-6       # Routh limit
    assert abs(max(abs(z.imag) for z in np.roots([1, 11, 10, 110.0])
                   if abs(z.real) < 1e-7) - w_pc) < 1e-6

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 5.9), sharex=True)
    a1.semilogx(w, mag_db, color=c[0], lw=2.2)
    a2.semilogx(w, ph, color=c[1], lw=2.2)
    a1.axhline(0, color=S.GUIDE[mode], lw=1.0, ls="--")
    a2.axhline(-180, color=S.GUIDE[mode], lw=1.0, ls="--")
    for ax in (a1, a2):
        ax.axvline(w_gc, color=S.GRID[mode], lw=1.0, ls=":")
        ax.axvline(w_pc, color=S.GRID[mode], lw=1.0, ls=":")
        S.strip(ax)
    a1.plot([w_pc, w_pc], [-GM, 0], color=c[2], lw=3.0, solid_capstyle="butt")
    S.note(a1, w_pc * 1.22, -GM - 31.0, f"gain margin\n{GM:.1f} dB", mode)
    a2.plot([w_gc, w_gc], [-180, -180 + PM], color=c[2], lw=3.0, solid_capstyle="butt")
    S.note(a2, w_gc * 0.88, -168, f"phase margin\n{PM:.1f} deg", mode, ha="right")
    S.note(a1, w_gc * 0.88, -52, "gain crossover\n1.86 rad/s", mode, ha="right")
    S.note(a1, w_pc * 1.22, 22, "phase crossover\n3.16 rad/s", mode)
    a1.set_ylabel("magnitude  (dB)")
    a2.set_ylabel("phase  (deg)")
    a2.set_xlabel("frequency  w  (rad/s)")
    a1.set_ylim(-60, 42)
    a2.set_ylim(-272, -84)
    a1.set_title("Two crossover frequencies, two margins, one loop")
    return fig


@figure("ctrl-nyquist-margins")
def _(mode):
    """The same loop as a Nyquist plot, with both margins as geometry.

    G(jw) = 40/[jw(jw+1)(jw+10)] evaluated on a positive-frequency sweep with
    its conjugate mirror. The plot crosses the negative real axis at exactly
    -0.3636 = -1/2.75, which is the same 8.79 dB gain margin the Bode figure
    marks - asserted here - and the unit circle intersection sits 17.7 degrees
    off the negative real axis, which is the phase margin.
    """
    c = S.SERIES[mode]
    w = np.logspace(-0.55, 2.6, 4000)
    G = _loop40(w)

    w_pc = np.sqrt(10.0)
    Gx = _loop40(w_pc)
    w_gc = brentq(lambda x: np.abs(_loop40(x)) - 1.0, 0.1, 10.0)
    Gg = _loop40(w_gc)
    assert abs(Gx.imag) < 1e-9 and abs(Gx.real + 0.363636) < 1e-6, Gx
    assert abs(abs(Gg) - 1.0) < 1e-9
    assert abs(180 + np.degrees(np.angle(Gg)) - 17.705) < 1e-3
    assert abs(-1 / Gx.real - 2.75) < 1e-6                     # gain margin factor

    th = np.linspace(0, 2 * np.pi, 400)
    fig, ax = plt.subplots()
    ax.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot(G.real, G.imag, color=c[0], lw=2.2)
    ax.plot(G.real, -G.imag, color=c[0], lw=2.2, alpha=0.55)
    ax.plot([-1], [0], "o", color=S.INK[mode], ms=8, zorder=6)
    S.note(ax, -1.06, 0.14, "(-1, 0)", mode, ha="right")
    ax.plot([Gx.real], [0], "o", color=c[1], ms=7, zorder=6)
    ax.plot([-1, Gx.real], [0, 0], color=c[1], lw=3.0, solid_capstyle="butt")
    S.note(ax, Gx.real + 0.06, 0.12, "-0.364", mode)
    ax.plot([Gg.real], [Gg.imag], "o", color=c[2], ms=7, zorder=6)
    ax.plot([0, Gg.real], [0, Gg.imag], color=c[2], lw=1.6)
    S.note(ax, Gg.real + 0.10, Gg.imag - 0.36, "|G| = 1 here", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    S.note(ax, 0.42, 1.62,
           "gain margin: the axis crossing sits at -0.364,\n"
           "so the gain may rise by 1/0.364 = 2.75 (8.79 dB)\n\n"
           "phase margin: the unit-circle crossing is\n"
           "17.7 deg above the negative real axis\n\n"
           "no open-loop RHP pole and no encirclement\n"
           "of (-1, 0), so the closed loop is stable", mode, va="top")
    ax.set_xlabel("real part of G(jw)")
    ax.set_ylabel("imaginary part of G(jw)")
    ax.set_title("Both margins are distances from one point")
    ax.set_xlim(-2.4, 2.9)
    ax.set_ylim(-2.0, 2.0)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# PID
# ---------------------------------------------------------------------------


@figure("ctrl-pid-actions")
def _(mode):
    """P, PI and PID on G = 1/(s+1)^3, all tuned by the Ziegler-Nichols table.

    The ultimate gain and period come from the Routh array on
    (s+1)^3 + K = 0: K_u = 8 and w_u = sqrt(3), so P_u = 2 pi/sqrt(3) = 3.628 s.
    The three controllers are the table rows evaluated at those values, and the
    curves are closed-loop step responses of the resulting loops. The
    assertions pin the two facts the lesson claims from this picture: only the
    integral rows reach 1.0 exactly, and the P row settles 0.2 short, which is
    1/(1 + K_p) with K_p = 4.
    """
    c = S.SERIES[mode]
    Ku, wu = 8.0, np.sqrt(3.0)
    Pu = 2 * np.pi / wu
    assert abs(max(abs(z.imag) for z in np.roots([1, 3, 3, 1 + Ku])
                   if abs(z.real) < 1e-9) - wu) < 1e-9
    assert abs(Pu - 3.6276) < 1e-3

    t = np.linspace(0, 48, 48001)
    plant = [1.0, 3.0, 3.0, 1.0]

    def loop(num_c, den_c):
        n = np.asarray(num_c, dtype=float)
        d = np.polymul(den_c, plant)
        return signal.step(signal.TransferFunction(n, np.polyadd(d, n)), T=t)[1]

    y_p = loop([0.5 * Ku], [1.0])
    KpI, TiI = 0.45 * Ku, Pu / 1.2
    y_pi = loop([KpI, KpI / TiI], [1.0, 0.0])
    Kp, Ti, Td = 0.6 * Ku, Pu / 2, Pu / 8
    y_pid = loop([Kp * Td, Kp, Kp / Ti], [1.0, 0.0])

    # the curves are still ringing gently at t = 30 s, so these compare the
    # simulated tail with the exact final values rather than demanding equality
    assert abs(y_p[-1] - 0.8) < 5e-3, y_p[-1]
    assert abs((1 - y_p[-1]) - 1 / (1 + 0.5 * Ku)) < 5e-3
    assert abs(y_pi[-1] - 1.0) < 5e-3 and abs(y_pid[-1] - 1.0) < 5e-3
    assert abs((y_pid.max() - 1) * 100 - 40.57) < 5e-2

    fig, ax = plt.subplots()
    ax.plot(t, y_p, color=c[0], lw=2.0)
    ax.plot(t, y_pi, color=c[1], lw=2.0)
    ax.plot(t, y_pid, color=c[2], lw=2.0)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, 48.0, y_p[-1], "P only\nK_p = 4", c[0], mode, dy=-12)
    S.label_end(ax, 48.0, 1.0, "PI\nK_p = 3.6, T_i = 3.02", c[1], mode, dy=20)
    S.label_end(ax, 48.0, 1.0, "PID\nK_p = 4.8, T_i = 1.81, T_d = 0.45", c[2], mode, dy=-15)
    ax.plot([44.0, 44.0], [y_p[-1], 1.0], color=c[0], lw=3.0, solid_capstyle="butt")
    S.note(ax, 43.2, 0.845, "0.2 of\nlasting error", mode, ha="right")
    S.note(ax, 8.0, 1.60, "Ziegler-Nichols is deliberately aggressive: it buys speed\n"
                          "with roughly 40-56% overshoot on this plant", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output  y(t)")
    ax.set_title("Integral action removes the offset and pays for it in overshoot")
    ax.set_xlim(0, 50)
    ax.set_ylim(0, 1.78)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Time-domain specifications
# ---------------------------------------------------------------------------


@figure("ctrl-step-spec-anatomy")
def _(mode):
    """One second-order step response with every specification measured on it.

    T(s) = 25/(s^2 + 6s + 25): wn = 5 rad/s, zeta = 0.6, so wd = 4 rad/s. Rise
    time, peak time, overshoot and the 2% band are MEASURED from the simulated
    curve and then asserted against the closed-form values the lesson quotes -
    9.48% overshoot, t_p = 0.785 s, t_r = 0.554 s - so no annotation on this
    figure can drift away from the formula that produced it.
    """
    c = S.SERIES[mode]
    wn, zeta = 5.0, 0.6
    wd = wn * np.sqrt(1 - zeta ** 2)
    t = np.linspace(0, 2.6, 260001)
    _, y = signal.step(signal.TransferFunction([wn ** 2], [1, 2 * zeta * wn, wn ** 2]), T=t)

    tp_m, os_m = t[np.argmax(y)], (y.max() - 1) * 100
    tr_m = t[np.argmax(y >= 1.0)]
    assert abs(os_m - overshoot_pct(zeta)) < 1e-3, (os_m, overshoot_pct(zeta))
    assert abs(tp_m - np.pi / wd) < 1e-3
    assert abs(tr_m - (np.pi - np.arccos(zeta)) / wd) < 2e-3
    assert abs(os_m - 9.478) < 1e-2

    fig, ax = plt.subplots()
    ax.fill_between([0, 2.6], 0.98, 1.02, color=S.GUIDE[mode], alpha=0.16, lw=0)
    ax.plot(t, y, color=c[0], lw=2.3)
    ax.plot(t, 1 + np.exp(-zeta * wn * t) / np.sqrt(1 - zeta ** 2),
            color=c[1], lw=1.2, ls="--")
    ax.plot(t, 1 - np.exp(-zeta * wn * t) / np.sqrt(1 - zeta ** 2),
            color=c[1], lw=1.2, ls="--")
    S.label_end(ax, 0.98, 0.30,
                "dashed: the decay envelope  1 +/- e^(-zeta wn t)/sqrt(1 - zeta^2)",
                c[1], mode, dx=0, size=9.5)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([tp_m], [y.max()], "o", color=c[2], ms=7, zorder=6)
    ax.plot([tp_m, tp_m], [1.0, y.max()], color=c[2], lw=2.6, solid_capstyle="butt")
    S.note(ax, tp_m + 0.06, 1.155, f"overshoot {os_m:.2f}%\nat t_p = {tp_m:.3f} s", mode)
    ax.plot([tr_m], [1.0], "o", color=S.INK[mode], ms=6, zorder=6)
    ax.plot([tr_m, tr_m], [0, 1.0], color=S.GRID[mode], lw=1.0, ls=":")
    S.note(ax, tr_m + 0.06, 0.06, "t_r = 0.554 s\n(first reaches 100%)", mode)
    ax.plot([4 / (zeta * wn)], [1.0], "o", color=S.INK[mode], ms=6, zorder=6)
    S.note(ax, 4 / (zeta * wn) + 0.07, 0.68, "4/(zeta wn) = 1.333 s:\nthe 2% settling estimate", mode)
    S.note(ax, 2.55, 1.045, "+/-2% band", mode, ha="right")
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output  y(t)")
    ax.set_title("wn = 5 rad/s, zeta = 0.6: every spec is a distance on this plot")
    ax.set_xlim(0, 2.85)
    ax.set_ylim(0, 1.42)
    S.strip(ax)
    return fig


@figure("ctrl-damping-family")
def _(mode):
    """Three damping ratios at one natural frequency, with the overshoot table.

    Each curve is wn^2/(s^2 + 2 zeta wn s + wn^2) with wn = 5 rad/s and zeta =
    0.2, 0.5, 0.8. The measured peak of each simulated curve is asserted equal
    to exp(-pi zeta/sqrt(1 - zeta^2)) - 52.66%, 16.30% and 1.52% - which is the
    row of the lesson's table this figure is drawn to make believable.
    """
    c = S.SERIES[mode]
    wn = 5.0
    t = np.linspace(0, 4, 400001)
    fig, ax = plt.subplots()
    for i, zeta in enumerate([0.2, 0.5, 0.8]):
        _, y = signal.step(signal.TransferFunction([wn ** 2],
                                                   [1, 2 * zeta * wn, wn ** 2]), T=t)
        assert abs((y.max() - 1) * 100 - overshoot_pct(zeta)) < 2e-3, zeta
        ax.plot(t, y, color=c[i], lw=2.0)
        if zeta < 0.7:
            S.label_end(ax, t[np.argmax(y)], y.max(),
                        f"zeta = {zeta}\n{overshoot_pct(zeta):.1f}% overshoot", c[i],
                        mode, dy=11, ha="center")
        else:
            S.label_end(ax, 2.5, 1.0,
                        f"zeta = {zeta}\n{overshoot_pct(zeta):.1f}% overshoot", c[i],
                        mode, dy=-24, ha="center")
    assert abs(overshoot_pct(0.2) - 52.66) < 1e-2
    assert abs(overshoot_pct(0.5) - 16.30) < 1e-2
    assert abs(overshoot_pct(0.8) - 1.516) < 1e-2
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 3.95, 0.10, "the final value is the same for all three:\n"
                           "zeta moves the path, not the destination", mode, ha="right")
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output  y(t)")
    ax.set_title("Same wn, three damping ratios: overshoot is a function of zeta alone")
    ax.set_xlim(0, 4)
    ax.set_ylim(0, 1.78)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Pole-zero maps
# ---------------------------------------------------------------------------


@figure("ctrl-splane-to-time")
def _(mode):
    """Three pole pairs at one damped frequency, and the responses they produce.

    All three pairs sit at -sigma +/- j6 with sigma = 1, 0 and -0.5, so they
    share an oscillation frequency and differ only in which half-plane they
    occupy. The lower panel plots e^(-sigma t) cos(6t) for each, and the code
    asserts the envelope identity |e^(-sigma t) cos(6t)| <= e^(-sigma t) - the
    claim the drawing makes about decay being set by the real part alone.
    """
    c = S.SERIES[mode]
    sigmas = [1.0, 0.0, -0.5]
    t = np.linspace(0, 6, 4000)
    for sig in sigmas:
        assert np.all(np.abs(np.exp(-sig * t) * np.cos(6 * t)) <= np.exp(-sig * t) + 1e-12)
    assert abs(np.exp(-3.0) - 0.0498) < 1e-3          # 5% of the envelope at 3 tau

    top = 3.4
    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.6))
    for i, sig in enumerate(sigmas):
        a1.plot([-sig, -sig], [6, -6], "x", color=c[i], ms=11, mew=2.2)
        env = np.exp(-sig * t)
        # stop each trace where its own envelope leaves the frame, so the
        # growing mode ends at a clean edge instead of spiking off the top
        wave = env * np.cos(6 * t)
        a2.plot(t, np.where(np.abs(wave) <= top, wave, np.nan), color=c[i], lw=1.9)
        a2.plot(t, np.where(env <= top, env, np.nan), color=c[i], lw=0.9, ls=":")
    a1.axvline(0, color=S.GUIDE[mode], lw=1.4, ls="--")
    a1.axhline(0, color=S.GRID[mode], lw=0.9)
    S.label_end(a1, -1.0, 6.0, "-1 +/- j6\ndecays", c[0], mode, dx=-14, ha="right")
    S.label_end(a1, 0.0, -6.0, "0 +/- j6\nsustains", c[1], mode, dy=-30, ha="center")
    S.label_end(a1, 0.5, 6.0, "+0.5 +/- j6\ngrows", c[2], mode, dx=14, ha="left")
    a1.set_xlabel("real part  sigma  (1/s)")
    a1.set_ylabel("imaginary part  (rad/s)")
    a1.set_title("Same oscillation frequency, three fates")
    a1.set_xlim(-3.4, 2.8)
    a1.set_ylim(-11.5, 9.5)
    S.note(a1, -3.3, 8.0, "stable half", mode)
    S.note(a1, 0.14, 8.0, "unstable half", mode)
    a2.axhline(0, color=S.GRID[mode], lw=0.9)
    a2.set_xlabel("time  (s)")
    a2.set_ylabel("mode  e^(-sigma t) cos(6t)")
    a2.set_xlim(0, 6.6)
    a2.set_ylim(-top, top)
    S.note(a2, 3.15, -3.25, "dotted: the envelope e^(-sigma t). The real part sets it;\n"
                            "the imaginary part only sets how often\n"
                            "the curve reaches up and touches it", mode)
    for ax in (a1, a2):
        S.strip(ax)
    return fig


@figure("ctrl-nonminimum-phase")
def _(mode):
    """A right-half-plane zero, and the wrong-way start it forces.

    G(s) = (2 - s)/[(s+1)(s+2)] has unit DC gain and a zero at s = +2. Its step
    response has the closed form 1 - 3e^(-t) + 2e^(-2t), which the code checks
    against the simulation to 1e-6, and which dips to exactly -1/8 at
    t = ln(4/3). The mirror system (2 + s)/[(s+1)(s+2)] has the same poles and
    the same final value and never leaves the first quadrant - so the dip is
    the zero's doing, not the poles'.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 6, 60001)
    _, y_n = signal.step(signal.TransferFunction([-1.0, 2.0], [1, 3, 2]), T=t)
    _, y_m = signal.step(signal.TransferFunction([1.0, 2.0], [1, 3, 2]), T=t)
    closed = 1 - 3 * np.exp(-t) + 2 * np.exp(-2 * t)
    assert np.max(np.abs(y_n - closed)) < 1e-6
    assert abs(y_n.min() + 0.125) < 1e-4, y_n.min()
    assert abs(t[np.argmin(y_n)] - np.log(4 / 3)) < 1e-3
    assert y_m.min() > -1e-9

    fig, ax = plt.subplots()
    ax.plot(t, y_n, color=c[0], lw=2.3)
    ax.plot(t, y_m, color=c[1], lw=2.3)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(0.0, color=S.GRID[mode], lw=0.9)
    S.label_end(ax, 6.0, y_n[-1], "zero at +2\n(non-minimum phase)", c[0], mode, dy=20)
    S.label_end(ax, 6.0, y_m[-1], "zero at -2\n(same poles, same final value)", c[1],
                mode, dy=-22)
    ax.plot([np.log(4 / 3)], [-0.125], "o", color=c[0], ms=7, zorder=6)
    S.note(ax, np.log(4 / 3) + 0.12, -0.30,
           "undershoot exactly -1/8 of the final value,\nat t = ln(4/3) = 0.288 s", mode)
    S.note(ax, 2.2, 0.06, "the tangent at t = 0 has slope -1:\n"
                          "the output leaves in the wrong direction", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output  y(t)")
    ax.set_title("A right-half-plane zero makes the output go backwards first")
    ax.set_xlim(0, 8.6)
    ax.set_ylim(-0.55, 1.3)
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
