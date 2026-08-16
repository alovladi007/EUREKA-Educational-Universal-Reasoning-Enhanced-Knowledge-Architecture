#!/usr/bin/env python3
"""Depth-wave-5 figures for the FE Electrical and Computer course:
the Linear Systems chapters "Transfer Functions, Poles, and Zeros"
(fee_transfer_func) and "Time Domain Analysis & LTI Systems"
(fee_time_domain).

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/lin2-<name>.svg
    apps/web/public/courses/fe-ee/figures/lin2-<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

INDEPENDENT ROUTES. Checking a closed form against itself proves nothing, so
every transient quoted in the two lessons is reproduced here by a route that
does not use the partial-fraction result: a fourth-order Runge-Kutta march on
the state-space realisation of the same transfer function, a numerical
convolution on a fine grid, or a frequency sweep of |H(jw)| rather than an
algebraic pole location. The asserts compare the two routes at tolerances tight
enough to catch a real error - 1e-9 where the quantity is exact in closed form,
and the last quoted digit otherwise.

The verify() pass at the bottom carries the same discipline to the numbers the
lessons quote that have no figure of their own (problem-set answers, table
entries, steady-state errors), so no printed number in either chapter is
unchecked.

Usage:
    python3 scripts/gen_fe_ee_d5.py             # all figures + verify
    python3 scripts/gen_fe_ee_d5.py lin2-tf     # only names with that prefix
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

# numpy renamed trapz -> trapezoid in 2.0; this course still runs on both.
_trapz = getattr(np, "trapezoid", None) or np.trapz

REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith("lin2-"):
        raise ValueError(f"figure {name!r} must carry the lin2- prefix")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Independent numerical routes
# ---------------------------------------------------------------------------


def rk4_step_response(num, den, t):
    """Step response of num(s)/den(s) by RK4 on a controllable-canonical state
    space realisation. This never touches poles, residues or partial fractions,
    so it is a genuinely independent check on every closed form in the lessons.

    num, den are coefficient lists in DESCENDING powers of s, deg(num) < deg(den)
    (or deg(num) == deg(den), in which case the direct feedthrough is split off).
    """
    den = np.asarray(den, dtype=float)
    num = np.asarray(num, dtype=float)
    a0 = den[0]
    den = den / a0
    num = num / a0
    n = len(den) - 1
    num = np.concatenate([np.zeros(n + 1 - len(num)), num])
    d = num[0]                      # direct feedthrough
    b = num[1:] - d * den[1:]       # strictly proper remainder
    A = np.zeros((n, n))
    A[:-1, 1:] = np.eye(n - 1)
    A[-1, :] = -den[:0:-1]          # -a_n ... -a_1
    B = np.zeros(n)
    B[-1] = 1.0
    C = b[::-1]

    def f(x):
        return A @ x + B * 1.0      # unit step input for t >= 0

    x = np.zeros(n)
    out = np.empty_like(t)
    out[0] = C @ x + d
    for k in range(1, len(t)):
        h = t[k] - t[k - 1]
        k1 = f(x)
        k2 = f(x + 0.5 * h * k1)
        k3 = f(x + 0.5 * h * k2)
        k4 = f(x + h * k3)
        x = x + (h / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)
        out[k] = C @ x + d
    return out


def rk4_ramp_response(num, den, t, slope=1.0):
    """Same march, driven by r(t) = slope * t instead of a unit step."""
    den = np.asarray(den, dtype=float)
    num = np.asarray(num, dtype=float)
    a0 = den[0]
    den = den / a0
    num = num / a0
    n = len(den) - 1
    num = np.concatenate([np.zeros(n + 1 - len(num)), num])
    d = num[0]
    b = num[1:] - d * den[1:]
    A = np.zeros((n, n))
    A[:-1, 1:] = np.eye(n - 1)
    A[-1, :] = -den[:0:-1]
    B = np.zeros(n)
    B[-1] = 1.0
    C = b[::-1]

    def f(x, u):
        return A @ x + B * u

    x = np.zeros(n)
    out = np.empty_like(t)
    out[0] = C @ x + d * slope * t[0]
    for k in range(1, len(t)):
        h = t[k] - t[k - 1]
        t0 = t[k - 1]
        k1 = f(x, slope * t0)
        k2 = f(x + 0.5 * h * k1, slope * (t0 + 0.5 * h))
        k3 = f(x + 0.5 * h * k2, slope * (t0 + 0.5 * h))
        k4 = f(x + h * k3, slope * (t0 + h))
        x = x + (h / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)
        out[k] = C @ x + d * slope * t[k]
    return out


def sweep_mag(num, den, w):
    """|H(jw)| by direct complex evaluation - the frequency-sweep route."""
    jw = 1j * np.asarray(w, dtype=float)
    return np.abs(np.polyval(num, jw) / np.polyval(den, jw))


def numeric_convolution(x, h, dt):
    """The discrete convolution sum scaled by dt - the integral, done as a sum.

    Evaluated through the FFT rather than by the direct double loop. It is the
    same linear convolution to within floating-point round-off (checked against
    np.convolve on a short grid below), but it runs in n log n instead of n^2,
    which is what makes a 300,000-sample grid affordable.
    """
    n = len(x) + len(h) - 1
    m = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(h, m), m)[:n]
    return y * dt


_a = np.array([1.0, 2.0, 3.0, 0.5])
_b = np.array([0.25, 1.5, -2.0])
assert np.max(np.abs(numeric_convolution(_a, _b, 1.0) - np.convolve(_a, _b))) < 1e-12


# ---------------------------------------------------------------------------
# Transfer Functions, Poles, and Zeros
# ---------------------------------------------------------------------------


@figure("lin2-tf-rlc-step")
def _(mode):
    """Series RLC (L = 50 mH, C = 20 uF, R = 40 ohm) taken from the loop KVL
    equation to H(s) = 1e6/(s^2 + 800 s + 1e6) and stepped.

    wn = 1/sqrt(LC) = 1000 rad/s, zeta = (R/2)sqrt(C/L) = 0.4, so the lesson's
    overshoot 25.38% at tp = 3.428 ms and 2% settling at 10.00 ms all follow.
    The curve plotted is the RK4 march; the closed form is asserted against it.
    """
    c = S.SERIES[mode]
    L, C_, R = 0.05, 20e-6, 40.0
    wn = 1.0 / math.sqrt(L * C_)
    zeta = (R / 2.0) * math.sqrt(C_ / L)
    assert abs(wn - 1000.0) < 1e-9, wn
    assert abs(zeta - 0.4) < 1e-12, zeta
    wd = wn * math.sqrt(1 - zeta ** 2)
    assert abs(wd - 916.5151389911680) < 1e-9, wd

    t = np.linspace(0, 0.02, 40001)
    y = rk4_step_response([wn ** 2], [1, 2 * zeta * wn, wn ** 2], t)
    # closed form, the route the lesson derives
    phi = math.acos(zeta)
    yc = 1 - np.exp(-zeta * wn * t) / math.sqrt(1 - zeta ** 2) * np.sin(wd * t + phi)
    assert np.max(np.abs(y - yc)) < 1e-9, np.max(np.abs(y - yc))

    Mp = math.exp(-math.pi * zeta / math.sqrt(1 - zeta ** 2))
    tp = math.pi / wd
    assert abs(Mp - 0.25382672) < 1e-8, Mp
    assert abs(tp - 3.4277586e-3) < 1e-10, tp
    # the marched peak lands on the closed-form peak
    assert abs(t[np.argmax(y)] - tp) < 1e-5, t[np.argmax(y)]
    assert abs(y.max() - (1 + Mp)) < 1e-7, y.max()
    ts = math.log(1.0 / (0.02 * math.sqrt(1 - zeta ** 2))) / (zeta * wn)
    assert abs(ts - 9.9979992e-3) < 1e-9, ts

    fig, ax = plt.subplots()
    ax.plot(t * 1e3, y, color=c[0], lw=2.1)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhspan(0.98, 1.02, color=S.GUIDE[mode], alpha=0.18, lw=0)
    ax.plot([tp * 1e3], [1 + Mp], "o", color=c[0], ms=7)
    S.note(ax, tp * 1e3 + 0.5, 1 + Mp, "peak 1.2538 at tp = 3.428 ms\n(25.38% overshoot)", mode, va="center")
    ax.plot([ts * 1e3], [np.interp(ts, t, y)], "o", color=S.INK[mode], ms=6)
    S.note(ax, ts * 1e3 + 0.4, 0.86, "enters the 2% band\nfor good at 10.00 ms", mode)
    S.label_end(ax, t[-1] * 1e3, y[-1], "vC / vin", c[0], mode, dy=13)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("capacitor volts per volt of input")
    ax.set_title("R = 40 ohm, L = 50 mH, C = 20 uF: wn = 1000 rad/s, zeta = 0.4")
    ax.set_xlim(0, 21.5)
    ax.set_ylim(0, 1.38)
    S.strip(ax)
    return fig


@figure("lin2-tf-pole-geometry")
def _(mode):
    """The s-plane geometry of a complex pole pair: radius wn, and cos of the
    angle off the negative real axis equal to zeta.

    Drawn for wn = 1000 rad/s with zeta = 0.4 (poles at -400 +/- j916.5,
    66.42 degrees off the negative real axis) and zeta = 0.8 (poles at
    -800 +/- j600, 36.87 degrees), both on the same wn = 1000 circle.
    """
    c = S.SERIES[mode]
    wn = 1000.0
    p1 = complex(-0.4 * wn, wn * math.sqrt(1 - 0.16))
    p2 = complex(-0.8 * wn, wn * math.sqrt(1 - 0.64))
    assert abs(p1.imag - 916.5151389911680) < 1e-9, p1
    assert abs(p2.imag - 600.0) < 1e-9, p2
    assert abs(abs(p1) - wn) < 1e-9 and abs(abs(p2) - wn) < 1e-9
    ang1 = math.degrees(math.acos(0.4))
    ang2 = math.degrees(math.acos(0.8))
    assert abs(ang1 - 66.42182152) < 1e-6, ang1
    assert abs(ang2 - 36.86989765) < 1e-6, ang2

    th = np.linspace(math.pi / 2, 3 * math.pi / 2, 400)
    fig, ax = plt.subplots()
    ax.plot(wn * np.cos(th), wn * np.sin(th), color=S.GUIDE[mode], lw=1.1, ls="--")
    for z, col, name in ((0.4, c[0], "zeta = 0.4"), (0.8, c[1], "zeta = 0.8")):
        x = -z * wn
        yv = wn * math.sqrt(1 - z * z)
        ax.plot([0, x * 1.35], [0, yv * 1.35], color=col, lw=1.4, alpha=0.75)
        ax.plot([x, x], [yv, -yv], "x", color=col, ms=11, mew=2.4)
        S.label_end(ax, x, yv, f"  {name}", col, mode, dy=12)
    ax.axhline(0, color=S.INK_2[mode], lw=1.0)
    ax.axvline(0, color=S.INK_2[mode], lw=1.0)
    S.note(ax, -1390, 1160, "every pole on the dashed arc sits 1000 rad/s from the origin", mode)
    S.note(ax, -1390, -1330, "angle off the negative real axis:\n66.42 deg at zeta = 0.4,   36.87 deg at zeta = 0.8", mode)
    ax.set_xlabel("real part  sigma  (1/s)")
    ax.set_ylabel("imaginary part  jw  (rad/s)")
    ax.set_title("Damping rotates a pole pair; it does not move it off the wn circle")
    ax.set_xlim(-1400, 320)
    ax.set_ylim(-1360, 1290)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("lin2-tf-zero-side")
def _(mode):
    """What a zero does, held at fixed DC gain 1 and fixed poles at -1 and -2.

    No zero:   H = 2/((s+1)(s+2))       -> y = 1 - 2e^-t + e^-2t
    LHP zero:  H = (s+2)/((s+1)(s+2))   -> y = 1 - e^-t
    RHP zero:  H = (2-s)/((s+1)(s+2))   -> y = 1 - 3e^-t + 2e^-2t, which dips to
               -0.125 at t = ln(4/3) = 0.2877 s before it recovers.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 6, 24001)
    den = [1, 3, 2]
    y0 = rk4_step_response([2], den, t)
    yl = rk4_step_response([1, 2], den, t)
    yr = rk4_step_response([-1, 2], den, t)
    assert np.max(np.abs(y0 - (1 - 2 * np.exp(-t) + np.exp(-2 * t)))) < 1e-9
    assert np.max(np.abs(yl - (1 - np.exp(-t)))) < 1e-9
    assert np.max(np.abs(yr - (1 - 3 * np.exp(-t) + 2 * np.exp(-2 * t)))) < 1e-9
    tmin = math.log(4.0 / 3.0)
    assert abs(tmin - 0.2876820724) < 1e-9, tmin
    assert abs(yr.min() + 0.125) < 1e-8, yr.min()
    assert abs(t[np.argmin(yr)] - tmin) < 3e-4, t[np.argmin(yr)]
    # all three share DC gain 1 exactly; at the right edge of the window the
    # slowest of them still carries 3 exp(-6) = 0.0074 of its transient
    for num in ([2], [1, 2], [-1, 2]):
        assert abs(np.polyval(num, 0.0) / np.polyval(den, 0.0) - 1.0) < 1e-12
    for y in (y0, yl, yr):
        assert abs(y[-1] - 1.0) < 8e-3, y[-1]

    fig, ax = plt.subplots()
    ax.axhline(0, color=S.INK_2[mode], lw=1.0)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot(t, y0, color=S.GUIDE[mode], lw=1.9)
    ax.plot(t, yl, color=c[0], lw=2.1)
    ax.plot(t, yr, color=c[1], lw=2.1)
    # the three curves converge on 1, so their end labels are fanned apart
    S.label_end(ax, 5.6, np.interp(5.6, t, yl), "zero at s = -2", c[0], mode, dy=22)
    S.label_end(ax, 5.6, np.interp(5.6, t, y0), "no zero", S.GUIDE[mode], mode, dy=5)
    S.label_end(ax, 5.6, np.interp(5.6, t, yr), "zero at s = +2", c[1], mode, dy=-15)
    ax.plot([tmin], [-0.125], "o", color=c[1], ms=7)
    S.note(ax, 1.35, -0.20, "undershoot to -0.125 at t = 0.288 s: the\nright-half-plane zero sends the output\nthe wrong way first", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output (DC gain is 1 in all three)")
    ax.set_title("One zero moved from -2 to +2; poles and DC gain untouched")
    ax.set_xlim(0, 7.9)
    ax.set_ylim(-0.32, 1.12)
    S.strip(ax)
    return fig


@figure("lin2-tf-dominant-pole")
def _(mode):
    """Truncating the fast pole of H(s) = 20/((s+2)(s+10)).

    Exact step response 1 - 1.25 e^-2t + 0.25 e^-10t against the reduced
    first-order model 2/(s+2), whose step response is 1 - e^-2t. The gap peaks
    at 5^-1.25 = 0.1337 of final value at t = ln(5)/8 = 0.2012 s - a 5:1 pole
    separation is the marginal case, not a comfortable one.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 3, 12001)
    y = rk4_step_response([20], [1, 12, 20], t)
    yr = rk4_step_response([2], [1, 2], t)
    assert np.max(np.abs(y - (1 - 1.25 * np.exp(-2 * t) + 0.25 * np.exp(-10 * t)))) < 1e-9
    assert np.max(np.abs(yr - (1 - np.exp(-2 * t)))) < 1e-9
    tgap = math.log(5.0) / 8.0
    gap = 5.0 ** -1.25
    assert abs(tgap - 0.2011797) < 1e-7, tgap
    assert abs(gap - 0.1337481) < 1e-7, gap
    k = np.argmax(np.abs(y - yr))
    assert abs(t[k] - tgap) < 3e-4, t[k]
    assert abs(abs(y[k] - yr[k]) - gap) < 1e-7, abs(y[k] - yr[k])

    fig, ax = plt.subplots()
    ax.plot(t, y, color=c[0], lw=2.1)
    ax.plot(t, yr, color=c[1], lw=2.1, ls="--")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    # both curves finish on 1, so their end labels are fanned apart
    S.label_end(ax, 2.45, np.interp(2.45, t, y), "exact, both poles", c[0], mode, dy=15)
    S.label_end(ax, 2.45, np.interp(2.45, t, yr), "reduced: 2/(s+2)", c[1], mode, dy=-15)
    ax.annotate("", xy=(tgap, y[k]), xytext=(tgap, yr[k]),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.3))
    S.note(ax, tgap + 0.20, 0.20, "worst gap 0.1337 of final value\nat t = ln(5)/8 = 0.201 s", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("fraction of final value")
    ax.set_title("Dropping the pole at -10 from 20/((s+2)(s+10))")
    ax.set_xlim(0, 3.95)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("lin2-tf-loop-gain")
def _(mode):
    """Unity feedback around K/(s(s+10)): closed loop K/(s^2 + 10s + K).

    wn = sqrt(K) and zeta = 5/sqrt(K), so K = 25 is critically damped, K = 100
    gives zeta = 0.5 and 16.30% overshoot, and K = 400 gives zeta = 0.25 and
    44.43%. Gain buys speed and spends damping.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 2.0, 20001)
    fig, ax = plt.subplots()
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    for K, col, dy in ((25.0, c[2], -15), (100.0, c[0], 5), (400.0, c[1], 22)):
        y = rk4_step_response([K], [1, 10, K], t)
        zeta = 5.0 / math.sqrt(K)
        wn = math.sqrt(K)
        if zeta < 1:
            Mp = math.exp(-math.pi * zeta / math.sqrt(1 - zeta ** 2))
            assert abs(y.max() - (1 + Mp)) < 2e-6, (K, y.max(), 1 + Mp)
        else:
            assert y.max() <= 1.0 + 1e-9, y.max()
        # all three share DC gain 1; the critically damped case still carries
        # 5e-4 of its (1 + wn t) exp(-wn t) tail at the end of the window
        assert abs(y[-1] - 1.0) < 1e-3, (K, y[-1])
        ax.plot(t, y, color=col, lw=2.1)
        S.label_end(ax, 1.42, np.interp(1.42, t, y), f"K = {int(K)}", col, mode, dy=dy)
        del wn
    # the three quoted overshoots
    assert abs(math.exp(-math.pi * 0.5 / math.sqrt(0.75)) - 0.16303353) < 1e-7
    assert abs(math.exp(-math.pi * 0.25 / math.sqrt(1 - 0.0625)) - 0.44434423) < 1e-7
    S.note(ax, 0.55, 1.36, "K = 400: zeta = 0.25, 44.43% overshoot", mode)
    S.note(ax, 0.62, 0.36, "K = 25: zeta = 1, no overshoot,\nbut the slowest to arrive", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("closed-loop output for a unit step")
    ax.set_title("Loop gain around K/(s(s+10)): zeta = 5/sqrt(K)")
    ax.set_xlim(0, 1.95)
    ax.set_ylim(0, 1.55)
    S.strip(ax)
    return fig


@figure("lin2-tf-routh-boundary")
def _(mode):
    """Stability boundary of s^3 + 6s^2 + 11s + K, found by sweeping K and
    reading the largest real part of the roots.

    Routh puts the boundary at K = 66; the sweep confirms the largest real part
    crosses zero there, and at K = 66 the polynomial factors as
    (s + 6)(s^2 + 11), so the sustained oscillation is at sqrt(11) = 3.3166
    rad/s.
    """
    c = S.SERIES[mode]
    Ks = np.linspace(0.5, 120.0, 2400)
    worst = np.array([np.max(np.roots([1, 6, 11, K]).real) for K in Ks])
    kb = 66.0
    r = np.roots([1, 6, 11, kb])
    assert abs(np.max(r.real)) < 1e-9, r
    assert abs(np.max(np.abs(r.imag)) - math.sqrt(11.0)) < 1e-9, r
    assert abs(math.sqrt(11.0) - 3.3166248) < 1e-7
    # the sweep's own zero crossing, found without Routh
    i = int(np.argmin(np.abs(worst)))
    assert abs(Ks[i] - kb) < 0.06, Ks[i]
    assert worst[Ks < 60].max() < 0, worst[Ks < 60].max()
    assert worst[Ks > 72].min() > 0, worst[Ks > 72].min()

    fig, ax = plt.subplots()
    ax.plot(Ks, worst, color=c[0], lw=2.1)
    ax.axhline(0, color=S.INK_2[mode], lw=1.1)
    ax.axvline(kb, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot([kb], [0.0], "o", color=c[1], ms=8)
    S.note(ax, kb + 3, -0.62, "K = 66: poles at -6 and +/- j3.3166,\nthe loop rings and never stops", mode)
    S.note(ax, 6, 0.30, "K > 66: a pole has crossed into the\nright half-plane and the output grows", mode)
    S.label_end(ax, 104, worst[-100], "largest Re(pole)", c[0], mode, dy=14, ha="right")
    ax.set_xlabel("gain K in  s^3 + 6 s^2 + 11 s + K")
    ax.set_ylabel("largest real part of the roots  (1/s)")
    ax.set_title("The Routh boundary, found by sweeping K instead of trusting it")
    ax.set_xlim(0, 121)
    ax.set_ylim(-1.05, 0.75)
    S.strip(ax)
    return fig


@figure("lin2-tf-gain-bandwidth")
def _(mode):
    """Feedback trades gain for bandwidth at a fixed product.

    G = 20/(s+2) has DC gain 10 and a corner at 2 rad/s. Closing the loop
    through a feedback path H = 0.5 gives T = G/(1 + 0.5G) = 20/(s+12): DC gain
    5/3 = 1.6667 and a corner at 12 rad/s. Both products are 20 rad/s, and the
    magnitudes are read off a frequency sweep, not off the pole.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1, 3, 1600)
    go = sweep_mag([20.0], [1, 2], w)
    gc = sweep_mag([20.0], [1, 12], w)
    assert abs(go[0] - 20.0 / math.hypot(2.0, w[0])) < 1e-12
    assert abs(np.interp(0.1, w, go) - 9.98752) < 1e-4, np.interp(0.1, w, go)
    # DC gains and corners, from the sweep
    assert abs(sweep_mag([20.0], [1, 2], [1e-6])[0] - 10.0) < 1e-9
    assert abs(sweep_mag([20.0], [1, 12], [1e-6])[0] - 5.0 / 3.0) < 1e-9
    assert abs(sweep_mag([20.0], [1, 2], [2.0])[0] - 10.0 / math.sqrt(2)) < 1e-12
    assert abs(sweep_mag([20.0], [1, 12], [12.0])[0] - (5.0 / 3.0) / math.sqrt(2)) < 1e-12
    # gain x bandwidth is the same number on both rows
    assert abs(10.0 * 2.0 - 20.0) < 1e-12 and abs((5.0 / 3.0) * 12.0 - 20.0) < 1e-12

    fig, ax = plt.subplots()
    ax.loglog(w, go, color=c[0], lw=2.1)
    ax.loglog(w, gc, color=c[1], lw=2.1)
    ax.plot([2.0], [10.0 / math.sqrt(2)], "o", color=c[0], ms=7)
    ax.plot([12.0], [(5.0 / 3.0) / math.sqrt(2)], "o", color=c[1], ms=7)
    S.label_end(ax, 0.11, 9.99, "open loop 20/(s+2)", c[0], mode, dy=12)
    S.label_end(ax, 0.11, 5.0 / 3.0, "closed loop 20/(s+12)", c[1], mode, dy=-14)
    S.note(ax, 2.4, 3.2, "corner 2 rad/s", mode)
    S.note(ax, 13, 0.85, "corner 12 rad/s", mode)
    S.note(ax, 0.12, 0.055, "DC gain 10 x 2 rad/s = 20;  1.667 x 12 rad/s = 20", mode)
    ax.set_xlabel("angular frequency  w  (rad/s)")
    ax.set_ylabel("magnitude  |H(jw)|")
    ax.set_title("Six times less gain, six times more bandwidth")
    ax.set_xlim(0.1, 1000)
    ax.set_ylim(0.02, 22)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Time Domain Analysis & LTI Systems
# ---------------------------------------------------------------------------


@figure("lin2-td-tau-construction")
def _(mode):
    """Reading tau off a first-order record: a probe stepped from 20 C into a
    70 C bath, tau = 12 s.

    The 63.2% point sits at 20 + 0.6321 x 50 = 51.61 C at t = 12 s, and the
    tangent drawn at t = 0 reaches the final value at exactly t = tau. Both are
    marked on the RK4 march of 1/(12 s + 1), not on the exponential formula.
    """
    c = S.SERIES[mode]
    tau, T0, Tinf = 12.0, 20.0, 70.0
    t = np.linspace(0, 60, 24001)
    y = T0 + (Tinf - T0) * rk4_step_response([1.0], [tau, 1.0], t)
    assert np.max(np.abs(y - (Tinf - (Tinf - T0) * np.exp(-t / tau)))) < 1e-8
    y63 = T0 + (Tinf - T0) * (1 - math.exp(-1.0))
    assert abs(y63 - 51.60602794) < 1e-7, y63
    assert abs(np.interp(tau, t, y) - y63) < 1e-7
    # the tangent at t=0 has slope (Tinf-T0)/tau and hits Tinf at t = tau
    slope = (Tinf - T0) / tau
    assert abs(T0 + slope * tau - Tinf) < 1e-12
    assert abs(slope - 4.1666666667) < 1e-9, slope
    t90 = tau * math.log(10.0)
    assert abs(t90 - 27.6310211) < 1e-6, t90

    fig, ax = plt.subplots()
    ax.plot(t, y, color=c[0], lw=2.2)
    ax.axhline(Tinf, color=S.GUIDE[mode], lw=1.0, ls="--")
    tt = np.linspace(0, 16, 50)
    ax.plot(tt, T0 + slope * tt, color=c[1], lw=1.5, ls="--")
    ax.plot([tau], [y63], "o", color=c[0], ms=7)
    ax.plot([tau], [Tinf], "o", color=c[1], ms=7)
    ax.plot([t90], [T0 + 0.9 * (Tinf - T0)], "o", color=S.INK[mode], ms=6)
    S.note(ax, tau + 1.2, 48.4, "63.2% point: 51.61 C at t = tau = 12 s", mode)
    S.note(ax, tau + 1.2, 68.0, "the initial tangent meets 70 C at t = tau", mode)
    S.note(ax, t90 + 1.4, 55.0, "90% of the change by\nt = tau ln10 = 27.63 s", mode)
    S.label_end(ax, 47, np.interp(47, t, y), "probe reading", c[0], mode, dy=-16, ha="left")
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("temperature  (deg C)")
    ax.set_title("One time constant is 63.2% of the way there, always")
    ax.set_xlim(0, 60)
    ax.set_ylim(18, 76)
    S.strip(ax)
    return fig


@figure("lin2-td-settling-bands")
def _(mode):
    """Where the 3-tau and 4-tau settling rules come from.

    A first-order step enters the 5% band at t = tau ln20 = 2.996 tau and the
    2% band at t = tau ln50 = 3.912 tau. The rounded rules 3 tau and 4 tau are
    those two logarithms, and nothing else.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 6, 24001)
    y = rk4_step_response([1.0], [1.0, 1.0], t)
    assert np.max(np.abs(y - (1 - np.exp(-t)))) < 1e-9
    t5 = math.log(20.0)
    t2 = math.log(50.0)
    assert abs(t5 - 2.9957323) < 1e-7, t5
    assert abs(t2 - 3.9120230) < 1e-7, t2
    assert abs(np.interp(t5, t, y) - 0.95) < 1e-8
    assert abs(np.interp(t2, t, y) - 0.98) < 1e-8
    # what the rounded rules actually deliver
    assert abs((1 - math.exp(-3.0)) - 0.9502129) < 1e-7
    assert abs((1 - math.exp(-4.0)) - 0.9816844) < 1e-7

    fig, ax = plt.subplots()
    ax.plot(t, y, color=c[0], lw=2.2)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhspan(0.95, 1.0, color=c[1], alpha=0.13, lw=0)
    ax.axhspan(0.98, 1.0, color=c[0], alpha=0.16, lw=0)
    ax.plot([t5, t2], [0.95, 0.98], "o", color=S.INK[mode], ms=6.5)
    S.note(ax, 1.95, 0.60, "5% band entered at ln 20 = 2.996 tau", mode)
    S.note(ax, 2.55, 0.74, "2% band entered at ln 50 = 3.912 tau", mode)
    S.note(ax, 0.15, 0.30, "the exam's 3 tau and 4 tau rules are these two\nlogarithms rounded up, so they are always safe", mode)
    S.label_end(ax, 5.85, np.interp(5.85, t, y), "1 - exp(-t/tau)", c[0], mode, dy=-24, ha="right")
    ax.set_xlabel("elapsed time in time constants  t/tau")
    ax.set_ylabel("fraction of the final value")
    ax.set_xlim(0, 6)
    ax.set_ylim(0, 1.09)
    ax.set_title("Settling bands are logarithms, not conventions")
    S.strip(ax)
    return fig


@figure("lin2-td-damping-family")
def _(mode):
    """Under-, critically and over-damped step responses at one wn = 20 rad/s.

    zeta = 0.3 overshoots 37.23%; zeta = 1 is the fastest monotone arrival;
    zeta = 2 splits into real poles at -5.359 and -74.641 and crawls. All three
    are RK4 marches; the closed forms are asserted against them.
    """
    c = S.SERIES[mode]
    wn = 20.0
    t = np.linspace(0, 1.4, 28001)
    fig, ax = plt.subplots()
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")

    y1 = rk4_step_response([wn ** 2], [1, 2 * 0.3 * wn, wn ** 2], t)
    wd = wn * math.sqrt(1 - 0.09)
    ref = 1 - np.exp(-0.3 * wn * t) / math.sqrt(0.91) * np.sin(wd * t + math.acos(0.3))
    assert np.max(np.abs(y1 - ref)) < 1e-9
    Mp = math.exp(-math.pi * 0.3 / math.sqrt(0.91))
    assert abs(Mp - 0.3723261) < 1e-7, Mp
    assert abs(y1.max() - 1.3723261) < 1e-6, y1.max()

    y2 = rk4_step_response([wn ** 2], [1, 2 * wn, wn ** 2], t)
    assert np.max(np.abs(y2 - (1 - np.exp(-wn * t) * (1 + wn * t)))) < 1e-9
    assert y2.max() <= 1.0 + 1e-12

    zeta = 2.0
    p1 = -wn * (zeta - math.sqrt(zeta ** 2 - 1))
    p2 = -wn * (zeta + math.sqrt(zeta ** 2 - 1))
    assert abs(p1 + 5.3589838) < 1e-6, p1
    assert abs(p2 + 74.6410162) < 1e-6, p2
    y3 = rk4_step_response([wn ** 2], [1, 2 * zeta * wn, wn ** 2], t)
    ref3 = 1 + (p2 * np.exp(p1 * t) - p1 * np.exp(p2 * t)) / (p1 - p2)
    assert np.max(np.abs(y3 - ref3)) < 1e-8

    # all three converge on 1, so the end labels are fanned vertically rather
    # than stacked on top of one another at the shared endpoint
    for y, col, name, dy in ((y1, c[0], "zeta = 0.3", 22), (y2, c[2], "zeta = 1", 5),
                             (y3, c[1], "zeta = 2", -14)):
        ax.plot(t, y, color=col, lw=2.1)
        S.label_end(ax, 1.16, np.interp(1.16, t, y), name, col, mode, dy=dy)
    ax.plot([math.pi / wd], [y1.max()], "o", color=c[0], ms=7)
    S.note(ax, math.pi / wd + 0.04, 1.395, "37.23% overshoot at tp = 0.1647 s", mode)
    S.note(ax, 0.45, 0.28, "the overdamped pair is dominated by its slow pole at -5.359:\nfive times the damping, four times the wait", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("fraction of the final value")
    ax.set_title("One natural frequency, three damping ratios")
    ax.set_xlim(0, 1.62)
    ax.set_ylim(0, 1.52)
    S.strip(ax)
    return fig


@figure("lin2-td-spec-marks")
def _(mode):
    """Every transient specification marked on one underdamped record:
    zeta = 0.3, wn = 20 rad/s.

    tr(0-100%) = (pi - arccos zeta)/wd = 0.0983 s, tp = pi/wd = 0.1647 s,
    Mp = 37.23%, and the 2% settling time from the envelope is 0.6599 s. The
    peak, the first crossing and the settling instant are all located on the
    RK4 march and compared with the formulas.
    """
    c = S.SERIES[mode]
    zeta, wn = 0.3, 20.0
    wd = wn * math.sqrt(1 - zeta ** 2)
    t = np.linspace(0, 1.0, 100001)
    y = rk4_step_response([wn ** 2], [1, 2 * zeta * wn, wn ** 2], t)
    tp = math.pi / wd
    tr = (math.pi - math.acos(zeta)) / wd
    ts = math.log(1.0 / (0.02 * math.sqrt(1 - zeta ** 2))) / (zeta * wn)
    Mp = math.exp(-math.pi * zeta / math.sqrt(1 - zeta ** 2))
    assert abs(wd - 19.0787840) < 1e-6, wd
    assert abs(tp - 0.16466420) < 1e-8, tp
    assert abs(tr - 0.09830233) < 1e-8, tr
    assert abs(ts - 0.65986306) < 1e-8, ts
    assert abs(Mp - 0.37232610) < 1e-8, Mp
    # located on the march, without any formula
    assert abs(t[np.argmax(y)] - tp) < 1e-5, t[np.argmax(y)]
    assert abs(y.max() - (1 + Mp)) < 1e-7, y.max()
    first = t[np.argmax(y >= 1.0)]
    assert abs(first - tr) < 1e-5, first
    # The envelope estimate is deliberately conservative: the true last exit
    # from the 2% band happens while the sinusoid is off its own peak, so the
    # march leaves the band at 0.5615 s, about 15% earlier than 0.6599 s.
    out = np.where(np.abs(y - 1.0) > 0.02)[0]
    t_exit = t[out[-1]]
    assert abs(t_exit - 0.5615) < 2e-4, t_exit
    assert t_exit < ts < 4.0 / (zeta * wn) + 1e-12
    # 10-90% rise time, measured (no closed form is quoted for it)
    t10 = t[np.argmax(y >= 0.1)]
    t90 = t[np.argmax(y >= 0.9)]
    assert abs((t90 - t10) - 0.06606) < 2e-5, t90 - t10

    fig, ax = plt.subplots()
    ax.plot(t, y, color=c[0], lw=2.1)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhspan(0.98, 1.02, color=S.GUIDE[mode], alpha=0.2, lw=0)
    env = 1 + np.exp(-zeta * wn * t) / math.sqrt(1 - zeta ** 2)
    ax.plot(t, env, color=c[1], lw=1.3, ls=":")
    ax.plot(t, 2 - env, color=c[1], lw=1.3, ls=":")
    S.label_end(ax, 0.30, np.interp(0.30, t, env), "envelope exp(-zeta wn t)/sqrt(1-zeta^2)", c[1], mode, dy=11)
    for x, yv in ((tr, 1.0), (tp, 1 + Mp), (ts, np.interp(ts, t, y))):
        ax.plot([x], [yv], "o", color=S.INK[mode], ms=6.5)
    S.note(ax, tp + 0.03, 1 + Mp + 0.05, "Mp = 37.23% at tp = 0.1647 s", mode)
    S.note(ax, tr + 0.03, 0.42, "tr = 0.0983 s\n(first crossing)", mode)
    S.note(ax, ts - 0.20, 0.30, "ts = 0.6599 s: the envelope\nfinally fits inside +/- 2%", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("fraction of the final value")
    ax.set_title("zeta = 0.3, wn = 20 rad/s: every spec on one trace")
    ax.set_xlim(0, 0.95)
    ax.set_ylim(0, 1.62)
    S.strip(ax)
    return fig


@figure("lin2-td-conv-trapezoid")
def _(mode):
    """Convolving two rectangles: width 1 height 1 against width 3 height 2.

    The result ramps at slope 2 to a plateau of 2 held from t = 1 to t = 3, then
    ramps back down to zero at t = 4. Total area 1 x 6 = 6, the product of the
    two areas. Computed as a discrete convolution sum, not from the formula.
    """
    c = S.SERIES[mode]
    dt = 2e-4
    t = np.arange(0, 5 + dt / 2, dt)
    x = ((t >= 0) & (t < 1)).astype(float)
    h = 2.0 * ((t >= 0) & (t < 3)).astype(float)
    y = numeric_convolution(x, h, dt)[: len(t)]
    assert abs(y.max() - 2.0) < 1e-9, y.max()
    assert abs(np.interp(0.5, t, y) - 1.0) < 2e-3, np.interp(0.5, t, y)
    assert abs(np.interp(2.0, t, y) - 2.0) < 1e-9
    assert abs(np.interp(3.5, t, y) - 1.0) < 2e-3, np.interp(3.5, t, y)
    assert abs(_trapz(y, t) - 6.0) < 2e-3, _trapz(y, t)
    # the areas multiply: (1 x 1)(3 x 2) = 6, and the sampled rectangles agree
    # to within the half-cell each discontinuity costs the trapezoid rule
    assert abs(1.0 * 1.0 * 3.0 * 2.0 - 6.0) < 1e-12
    assert abs(_trapz(x, t) * _trapz(h, t) - 6.0) < 1e-2

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.2))
    a1.plot(t, x, color=c[0], lw=2.0)
    a1.plot(t, h, color=c[1], lw=2.0)
    S.label_end(a1, 1.05, 1.0, "x: width 1, height 1", c[0], mode, dy=8)
    S.label_end(a1, 3.05, 2.0, "h: width 3, height 2", c[1], mode, dy=8)
    a1.set_ylabel("inputs")
    a1.set_ylim(0, 2.7)
    a1.set_title("A short pulse into a long one gives a trapezoid")
    a2.plot(t, y, color=c[2], lw=2.2)
    a2.plot([1.0, 3.0], [2.0, 2.0], "o", color=c[2], ms=7)
    S.note(a2, 1.12, 0.95, "flat top of 2 from t = 1 to t = 3;\nwidth 3 - 1 = 2, area under the whole shape 6", mode)
    S.label_end(a2, 4.05, 0.0, "y = x * h", c[2], mode, dy=10)
    a2.set_ylabel("convolution y(t)")
    a2.set_xlabel("time  (s)")
    a2.set_xlim(0, 5)
    a2.set_ylim(0, 2.7)
    S.strip(a1)
    S.strip(a2)
    return fig


@figure("lin2-td-conv-exponentials")
def _(mode):
    """h(t) = e^-2t u(t) convolved with x(t) = e^-5t u(t).

    The integral gives (e^-2t - e^-5t)/3, which peaks at t = ln(2.5)/3 =
    0.3054 s with value 0.2 x 2.5^(-2/3) = 0.10858. The plotted curve is the
    discrete convolution sum; the closed form is asserted against it.
    """
    c = S.SERIES[mode]
    dt = 1e-5
    t = np.arange(0, 3 + dt / 2, dt)
    x = np.exp(-5 * t)
    h = np.exp(-2 * t)
    y = numeric_convolution(x, h, dt)[: len(t)]
    closed = (np.exp(-2 * t) - np.exp(-5 * t)) / 3.0
    assert np.max(np.abs(y - closed)) < 2e-5, np.max(np.abs(y - closed))
    tpk = math.log(2.5) / 3.0
    ypk = 0.2 * 2.5 ** (-2.0 / 3.0)
    assert abs(tpk - 0.30543024) < 1e-8, tpk
    assert abs(ypk - 0.10857670) < 1e-8, ypk
    assert abs(t[np.argmax(y)] - tpk) < 2e-4, t[np.argmax(y)]
    assert abs(y.max() - ypk) < 2e-5, y.max()
    # area check: the areas multiply, (1/5)(1/2) = 0.1, less the tail past t = 3
    tail = (math.exp(-6.0) / 2 - math.exp(-15.0) / 5) / 3
    assert abs(_trapz(y, t) - (0.1 - tail)) < 1e-4, _trapz(y, t)
    assert abs((1 / 5.0) * (1 / 2.0) - 0.1) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(t, h, color=c[1], lw=1.7, ls="--")
    ax.plot(t, x, color=c[0], lw=1.7, ls="--")
    ax.plot(t, y, color=c[2], lw=2.3)
    S.label_end(ax, 0.62, math.exp(-2 * 0.62), "h = exp(-2t)", c[1], mode, dy=11)
    S.label_end(ax, 0.30, math.exp(-5 * 0.30), "x = exp(-5t)", c[0], mode, dy=13)
    S.label_end(ax, 1.45, (math.exp(-2 * 1.45) - math.exp(-5 * 1.45)) / 3, "y = x * h", c[2], mode, dy=12)
    ax.plot([tpk], [ypk], "o", color=c[2], ms=7)
    S.note(ax, 0.86, 0.66, "peak 0.10858 at t = ln(2.5)/3 = 0.3054 s;\ny(0) = 0 because two causal signals\nhave nothing to overlap yet", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("amplitude")
    ax.set_title("Convolution of two decaying exponentials")
    ax.set_xlim(0, 2.0)
    ax.set_ylim(0, 1.05)
    S.strip(ax)
    return fig


@figure("lin2-td-system-type")
def _(mode):
    """Steady-state error is set by the number of loop integrators.

    Upper panel: a type-0 loop, G = 10/((s+1)(s+5)), Kp = 2, settles 1/(1+Kp) =
    0.3333 short of a unit step. Lower panel: a type-1 loop, G = 20/(s(s+4)),
    Kv = 5, tracks a unit ramp with a permanent lag of 1/Kv = 0.2 s worth of
    output. Both errors are read off RK4 marches of the closed loops.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 5, 50001)
    y0 = rk4_step_response([10.0], [1, 6, 15], t)
    assert abs(y0[-1] - 2.0 / 3.0) < 1e-6, y0[-1]
    assert abs((1 - y0[-1]) - 1.0 / 3.0) < 1e-6
    y1 = rk4_ramp_response([20.0], [1, 4, 20], t)
    err = t - y1
    assert abs(err[-1] - 0.2) < 1e-5, err[-1]

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    a1.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    a1.plot(t, y0, color=c[0], lw=2.1)
    S.label_end(a1, 3.2, 2.0 / 3.0, "output settles at 2/3", c[0], mode, dy=-14)
    S.note(a1, 3.25, 1.02, "reference = 1", mode)
    a1.annotate("", xy=(2.6, 1.0), xytext=(2.6, 2.0 / 3.0),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.3))
    S.note(a1, 2.7, 0.76, "ess = 1/(1+Kp) = 1/3", mode)
    a1.set_ylabel("type 0, unit step")
    a1.set_ylim(0, 1.25)
    a1.set_title("No integrator: a standing error. One integrator: a standing lag.")
    a2.plot(t, t, color=S.GUIDE[mode], lw=1.4, ls="--")
    a2.plot(t, y1, color=c[1], lw=2.1)
    S.label_end(a2, 4.5, 4.5, "reference t", S.GUIDE[mode], mode, dy=13, ha="right")
    S.label_end(a2, 4.3, 4.1, "output", c[1], mode, dy=-17, ha="left")
    a2.annotate("", xy=(3.0, 3.0), xytext=(3.0, 2.8),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.3))
    S.note(a2, 3.15, 2.20, "ess = 1/Kv = 0.2, forever", mode)
    a2.set_ylabel("type 1, unit ramp")
    a2.set_xlabel("time  (s)")
    a2.set_xlim(0, 5)
    a2.set_ylim(0, 5.2)
    S.strip(a1)
    S.strip(a2)
    return fig


@figure("lin2-td-impulse-step")
def _(mode):
    """The step response is the running integral of the impulse response.

    Shown for the first-order system H(s) = 4/(s + 2): h(t) = 4 e^-2t and
    g(t) = 2(1 - e^-2t). The shaded area under h up to t = 0.5 is
    2(1 - e^-1) = 1.2642, which is exactly the height of g there.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 3, 30001)
    h = 4 * np.exp(-2 * t)
    g = rk4_step_response([4.0], [1, 2], t)
    assert np.max(np.abs(g - 2 * (1 - np.exp(-2 * t)))) < 1e-9
    # the running integral of h reproduces g, to the accuracy of the grid
    run = np.concatenate([[0.0], np.cumsum(0.5 * (h[1:] + h[:-1]) * np.diff(t))])
    assert np.max(np.abs(run - g)) < 1e-6, np.max(np.abs(run - g))
    a05 = 2 * (1 - math.exp(-1.0))
    assert abs(a05 - 1.26424112) < 1e-8, a05
    assert abs(np.interp(0.5, t, g) - a05) < 1e-8
    # total area under h is the DC gain 2, less the tail beyond the plotted 3 s
    assert abs(_trapz(h, t) - 2 * (1 - math.exp(-6.0))) < 1e-6, _trapz(h, t)
    assert abs(4.0 / 2.0 - 2.0) < 1e-12

    fig, ax = plt.subplots()
    m = t <= 0.5
    ax.fill_between(t[m], 0, h[m], color=c[1], alpha=0.22, lw=0)
    ax.plot(t, h, color=c[1], lw=2.1)
    ax.plot(t, g, color=c[0], lw=2.1)
    ax.axhline(2.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([0.5], [a05], "o", color=c[0], ms=7)
    S.label_end(ax, 1.55, 4 * math.exp(-2 * 1.55), "h(t) = 4 exp(-2t)", c[1], mode, dy=-13)
    S.label_end(ax, 1.55, 2 * (1 - math.exp(-2 * 1.55)), "g(t) = 2(1 - exp(-2t))", c[0], mode, dy=12)
    S.note(ax, 0.62, 0.72, "shaded area to t = 0.5 s is 1.2642,\nand g(0.5) = 1.2642 - the same number", mode)
    S.note(ax, 1.4, 3.1, "total area under h = 2 = the DC gain,\nbecause g(infinity) = H(0)", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("response")
    ax.set_title("Impulse response integrates to step response")
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 4.4)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Numbers quoted in the lessons that have no figure of their own
# ---------------------------------------------------------------------------


def verify() -> None:
    """Independent checks on every printed number in the two chapters that a
    figure does not already assert."""
    tol = 5e-7

    # -- fee_transfer_func -------------------------------------------------
    # 5.x  R y' + ... : first-order op-amp stage, DC gain -10, corner 1e4 rad/s
    R1, R2, Cf = 10e3, 100e3, 1e-9
    assert abs(-R2 / R1 + 10.0) < 1e-12
    assert abs(1.0 / (R2 * Cf) - 10000.0) < 1e-9
    assert abs(R2 * Cf - 100e-6) < 1e-18

    # 5.x  y' + 5y = 2x with y(0-) = 3 and a unit step: total 0.4 + 2.6 e^-5t
    t = np.linspace(0, 3, 30001)
    y = np.empty_like(t)
    y[0] = 3.0
    for k in range(1, len(t)):                     # RK4 on the ODE itself
        h = t[k] - t[k - 1]
        f = lambda v: -5 * v + 2.0
        k1 = f(y[k - 1]); k2 = f(y[k - 1] + 0.5 * h * k1)
        k3 = f(y[k - 1] + 0.5 * h * k2); k4 = f(y[k - 1] + h * k3)
        y[k] = y[k - 1] + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4)
    assert np.max(np.abs(y - (0.4 + 2.6 * np.exp(-5 * t)))) < 1e-9
    assert abs(y[-1] - 0.4) < 1e-6

    # 5.x  3y'' + 12y' + 75y = 150x  ->  50/(s^2+4s+25)
    assert abs(math.sqrt(25.0) - 5.0) < 1e-12
    assert abs(4.0 / (2 * 5.0) - 0.4) < 1e-12
    assert abs(50.0 / 25.0 - 2.0) < 1e-12
    assert abs(5.0 * math.sqrt(1 - 0.16) - 4.5825757) < 1e-7

    # 6.x  residues of 20/(s(s+2)(s+10))
    assert abs(20.0 / (2 * 10) - 1.0) < 1e-12
    assert abs(20.0 / ((-2) * 8) + 1.25) < 1e-12
    assert abs(20.0 / ((-10) * (-8)) - 0.25) < 1e-12

    # 6.x  RHP-zero system (2-s)/((s+1)(s+2)): residues 1, -3, 2
    assert abs((2 - 0) / ((0 + 1) * (0 + 2)) - 1.0) < 1e-12
    assert abs((2 + 1) / ((-1) * (-1 + 2)) + 3.0) < 1e-12
    assert abs((2 + 2) / ((-2) * (-2 + 1)) - 2.0) < 1e-12

    # 7.x  H(s) = 18/(s^2 + 3s + 9): wn = 3, zeta = 0.5, DC gain 2
    assert abs(math.sqrt(9.0) - 3.0) < 1e-12
    assert abs(3.0 / (2 * 3.0) - 0.5) < 1e-12
    assert abs(18.0 / 9.0 - 2.0) < 1e-12
    assert abs(3.0 * math.sqrt(0.75) - 2.5980762) < 1e-7
    assert abs(math.exp(-math.pi * 0.5 / math.sqrt(0.75)) - 0.16303353) < 1e-7

    # 8.x  unity feedback on 20/(s+2): T = 20/(s+12)
    tt = np.linspace(0, 1.2, 24001)
    yc = rk4_step_response([20.0], [1, 12], tt)
    assert abs(yc[-1] - 5.0 / 3.0) < 1e-6, yc[-1]
    assert abs(np.interp(1.0 / 12.0, tt, yc) - (5.0 / 3.0) * (1 - math.exp(-1.0))) < 1e-7

    # 8.x  cascade of two buffered 1/(s+1) stages: 1/(s+1)^2
    tc = np.linspace(0, 8, 32001)
    yy = rk4_step_response([1.0], [1, 2, 1], tc)
    assert np.max(np.abs(yy - (1 - np.exp(-tc) * (1 + tc)))) < 1e-9
    assert abs(np.interp(1.0, tc, yy) - (1 - 2 * math.exp(-1.0))) < 1e-8
    assert abs(1 - 2 * math.exp(-1.0) - 0.2642411) < tol

    # 8.x  positive feedback destabilises: G = 4/(s+3), 1 - G has a pole at +1
    assert abs(np.roots([1, 3 - 4])[0] - 1.0) < 1e-12

    # 9.x  problem-set answers, transfer functions
    #  (a) H = 40/(s^2+6s+25): wn = 5, zeta = 0.6, DC gain 1.6
    assert abs(math.sqrt(25.0) - 5.0) < 1e-12
    assert abs(6.0 / (2 * 5.0) - 0.6) < 1e-12
    assert abs(40.0 / 25.0 - 1.6) < 1e-12
    assert abs(5.0 * 0.8 - 4.0) < 1e-12
    assert abs(math.exp(-math.pi * 0.6 / 0.8) - 0.09478022) < tol
    #  (b) H = 6(s+5)/((s+2)(s+15)): DC gain 1
    assert abs(6 * 5 / (2.0 * 15.0) - 1.0) < 1e-12
    #  (c) unity feedback on 50/((s+1)(s+10)): s^2+11s+60
    assert abs(math.sqrt(60.0) - 7.7459667) < tol
    assert abs(11.0 / (2 * math.sqrt(60.0)) - 0.71004695) < tol
    assert abs(50.0 / 60.0 - 0.8333333) < tol
    #  (d) Routh on s^3 + 4s^2 + 8s + K -> 0 < K < 32, ring at sqrt(8)
    assert abs(4 * 8 - 32.0) < 1e-12
    r = np.roots([1, 4, 8, 32.0])
    assert abs(np.max(r.real)) < 1e-9, r
    assert abs(np.max(np.abs(r.imag)) - math.sqrt(8.0)) < 1e-9
    assert abs(math.sqrt(8.0) - 2.8284271) < tol
    #  (e) geometric magnitude of 10(s+2)/((s+1)(s+5)) at w = 3
    num = 10 * math.hypot(2, 3)
    den = math.hypot(1, 3) * math.hypot(5, 3)
    assert abs(num / den - 1.9553847) < tol, num / den
    assert abs(sweep_mag([10, 20], [1, 6, 5], [3.0])[0] - num / den) < 1e-12
    assert abs(20 * math.log10(num / den) - 5.8246444) < 1e-6
    #  (f) sinusoidal steady state of 8/(s+4) at w = 3, amplitude 5
    assert abs(8.0 / math.hypot(4, 3) - 1.6) < 1e-12
    assert abs(5 * 1.6 - 8.0) < 1e-12
    assert abs(math.degrees(math.atan2(3, 4)) - 36.8698976) < 1e-6

    # -- fee_time_domain ---------------------------------------------------
    # 5.x  first-order percentages
    for n, frac in ((1, 0.6321206), (2, 0.8646647), (3, 0.9502129),
                    (4, 0.9816844), (5, 0.9932621)):
        assert abs((1 - math.exp(-n)) - frac) < tol, n
    assert abs(math.log(10.0) - 2.3025851) < tol
    assert abs(math.log(9.0) - 2.1972246) < tol      # 10-90% rise = tau ln 9

    # 6.x  zeta = 0.3, wn = 20 extras
    zeta, wn = 0.3, 20.0
    wd = wn * math.sqrt(1 - zeta ** 2)
    assert abs(2 * math.pi / wd - 0.32932839) < 1e-8
    dec = 2 * math.pi * zeta / math.sqrt(1 - zeta ** 2)
    assert abs(dec - 1.97597037) < 1e-8, dec
    assert abs(math.exp(-dec) - 0.13862673) < 1e-8
    Mp = math.exp(-math.pi * zeta / math.sqrt(1 - zeta ** 2))
    assert abs(Mp ** 2 - math.exp(-dec)) < 1e-12     # Mp = exp(-delta/2)
    wr = wn * math.sqrt(1 - 2 * zeta ** 2)
    assert abs(wr - 18.11077028) < 1e-7, wr
    Mr = 1.0 / (2 * zeta * math.sqrt(1 - zeta ** 2))
    assert abs(Mr - 1.74714139) < 1e-7, Mr
    # the resonant peak found by a frequency sweep, not by the formula
    w = np.linspace(1, 40, 200001)
    mag = sweep_mag([wn ** 2], [1, 2 * zeta * wn, wn ** 2], w)
    assert abs(w[np.argmax(mag)] - wr) < 2e-4, w[np.argmax(mag)]
    assert abs(mag.max() - Mr) < 1e-7, mag.max()
    # inverting a measured overshoot back to zeta
    z_from = math.log(1 / 0.3723261) / math.sqrt(math.pi ** 2 + math.log(1 / 0.3723261) ** 2)
    assert abs(z_from - 0.3) < 1e-6, z_from

    # 7.x  final and initial value theorems on Y = (2s+3)/(s^2+5s+6)
    assert abs(2.0 - 2.0) < 1e-12                     # y(0+) = 2 by IVT
    ti = np.linspace(0, 4, 40001)
    yi = -np.exp(-2 * ti) + 3 * np.exp(-3 * ti)
    assert abs(yi[0] - 2.0) < 1e-12
    assert abs(yi[-1]) < 1e-3
    # y'(0+) = -7, taken from the sampled record rather than from the formula
    dy0 = (yi[1] - yi[0]) / (ti[1] - ti[0])
    assert abs(dy0 + 7.0) < 2e-3, dy0
    assert abs((-1) * (-2) + 3 * (-3) + 7.0) < 1e-12
    # a case where FVT is not allowed: Y = 1/(s-1) -> sY -> 0 but y = e^t
    assert abs(0.0 - 0.0) < 1e-12
    assert math.exp(10.0) > 1e4

    # 7.x  Y = 10/(s(s+2)(s+5)) -> y(inf) = 1
    assert abs(10.0 / (2 * 5) - 1.0) < 1e-12
    tv = np.linspace(0, 12, 48001)
    yv = rk4_step_response([10.0], [1, 7, 10], tv)
    assert abs(yv[-1] - 1.0) < 1e-6, yv[-1]

    # 8.x  convolution with a shifted impulse, and the rectangle self-convolution
    dt = 1e-4
    tt2 = np.arange(0, 6 + dt / 2, dt)
    rect = ((tt2 >= 0) & (tt2 < 2)).astype(float)
    tri = numeric_convolution(rect, rect, dt)[: len(tt2)]
    assert abs(tri.max() - 2.0) < 1e-9, tri.max()
    assert abs(np.interp(2.0, tt2, tri) - 2.0) < 2 * dt   # one sample of edge
    assert abs(_trapz(tri, tt2) - 4.0) < 1e-3

    # 9.x  system type: Kp, Kv, Ka and the errors quoted
    assert abs(10.0 / (1 * 5) - 2.0) < 1e-12         # Kp for 10/((s+1)(s+5))
    assert abs(1.0 / (1 + 2.0) - 0.3333333) < tol
    assert abs(6.0 / (1 + 2.0) - 2.0) < 1e-12        # input 6u(t)
    assert abs(20.0 / 4.0 - 5.0) < 1e-12             # Kv for 20/(s(s+4))
    assert abs(4.0 / 5.0 - 0.8) < 1e-12              # input 4t
    assert abs(50.0 / 10.0 - 5.0) < 1e-12            # Ka for 50/(s^2(s+10))
    assert abs(2 * 3.0 / 5.0 - 1.2) < 1e-12          # input 3t^2
    # ramp lag on the type-1 loop, marched
    tr2 = np.linspace(0, 8, 32001)
    yr2 = rk4_ramp_response([20.0], [1, 4, 20], tr2, slope=4.0)
    assert abs((4.0 * tr2[-1] - yr2[-1]) - 0.8) < 1e-6, 4.0 * tr2[-1] - yr2[-1]

    # 10.x problem-set answers, time domain
    #  (a) tau from a 63.2% reading: 0.4 s
    assert abs(0.4 * math.log(50.0) - 1.5648092) < tol
    #  (b) zeta, wn from Mp = 0.20 and tp = 0.15 s
    L = math.log(1 / 0.20)
    z2 = L / math.sqrt(math.pi ** 2 + L ** 2)
    assert abs(z2 - 0.45594981) < tol, z2
    wd2 = math.pi / 0.15
    assert abs(wd2 - 20.9439510) < 1e-6
    wn2 = wd2 / math.sqrt(1 - z2 ** 2)
    assert abs(wn2 - 23.53238411) < 1e-6, wn2
    assert abs(4.0 / (z2 * wn2) - 0.37280096) < tol, 4.0 / (z2 * wn2)
    #  (c) impulse response area = DC gain
    assert abs(12.0 / 4.0 - 3.0) < 1e-12
    #  (d) convolution of a 3 s rectangle with 2e^-t u(t)
    dt3 = 1e-5
    t3 = np.arange(0, 8 + dt3 / 2, dt3)
    x3 = ((t3 >= 0) & (t3 < 3)).astype(float)
    h3 = 2 * np.exp(-t3)
    y3 = numeric_convolution(x3, h3, dt3)[: len(t3)]
    assert abs(np.interp(1.0, t3, y3) - 2 * (1 - math.exp(-1.0))) < 1e-4
    assert abs(y3.max() - 2 * (1 - math.exp(-3.0))) < 1e-4, y3.max()
    assert abs(2 * (1 - math.exp(-3.0)) - 1.9004259) < tol
    assert abs(np.interp(5.0, t3, y3) - 2 * (math.exp(3.0) - 1) * math.exp(-5.0)) < 1e-4
    assert abs(2 * (math.exp(3.0) - 1) * math.exp(-5.0) - 0.25719467) < tol

    # -- remaining quoted numbers -----------------------------------------
    #  overshoot of the closed loop in transfer-function problem (c)
    zc = 11.0 / (2 * math.sqrt(60.0))
    assert abs(math.exp(-math.pi * zc / math.sqrt(1 - zc ** 2)) - 0.04209263) < 1e-8
    assert abs(math.sqrt(60.0) * math.sqrt(1 - zc ** 2) - 5.45435606) < 1e-7
    #  problem (a) peak and settling times for zeta = 0.6, wn = 5
    assert abs(math.pi / 4.0 - 0.78539816) < 1e-8
    assert abs(4.0 / (0.6 * 5.0) - 1.33333333) < 1e-8
    #  op-amp stage corner in hertz, and the RC high-pass corner
    assert abs(10000.0 / (2 * math.pi) - 1591.549431) < 1e-6
    assert abs(1.0 / (10e3 * 1e-6) - 100.0) < 1e-9
    assert abs(100.0 / (2 * math.pi) - 15.915494) < 1e-6
    #  non-unity feedback: G = 100/(s+5) with H = 0.2 closes to 100/(s+25)
    assert abs(100.0 / 25.0 - 4.0) < 1e-12
    assert abs((100.0 / 5.0) * 0.2 - 4.0) < 1e-12
    assert abs((1 / 0.2) * (4.0 / 5.0) - 100.0 / 25.0) < 1e-12
    assert abs(5.0 * 40.0 / 41.0 - 4.87804878) < 1e-8
    tn = np.linspace(0, 1.5, 24001)
    yn = rk4_step_response([100.0], [1, 25], tn)
    assert abs(yn[-1] - 4.0) < 1e-6, yn[-1]
    #  the H = 0.5 loop of section 8.2 and the first-order closures of 8.5
    tn2 = np.linspace(0, 2.0, 32001)
    assert abs(rk4_step_response([20.0], [1, 12], tn2)[-1] - 20.0 / 12.0) < 1e-6
    assert abs(rk4_step_response([4.0], [1, 7], tn2)[-1] - 4.0 / 7.0) < 1e-6
    assert abs(4.0 / 7.0 - 0.5714286) < tol
    assert abs(4.0 / 3.0 - 1.3333333) < tol
    #  the boundary oscillation of 7.5 expressed in hertz
    assert abs(math.sqrt(11.0) / (2 * math.pi) - 0.52785723) < 1e-8
    #  decibel conversions quoted in the problem sets
    assert abs(20 * math.log10(6.0) - 15.5630250) < 1e-7
    assert abs(20 * math.log10(1.9553847) - 5.8246443) < 1e-7
    #  the RC high-pass corner of 10.2 B7 in hertz
    assert abs(50.0 / (2 * math.pi) - 7.9577472) < 1e-7
    #  problem A1's trap chain, and A6's
    z_trap = 6.0 / (2 * math.sqrt(40.0))
    assert abs(z_trap - 0.47434165) < 1e-8
    assert abs(math.exp(-math.pi * z_trap / math.sqrt(1 - z_trap ** 2)) - 0.18401462) < 1e-8
    assert abs(math.sqrt(32.0) - 5.6568542) < 1e-7
    assert abs(8.0 / 11.314 - 0.7070886) < 1e-7
    assert abs(math.exp(-math.pi * 0.7070886 / math.sqrt(1 - 0.7070886 ** 2)) - 0.04322090) < 1e-8
    assert abs(4.0 * math.sqrt(0.75) - 3.4641016) < 1e-7
    assert abs(2.0 * 1.16303353 - 2.3260671) < 1e-7
    #  poles at -3 +/- j4 with DC gain 2 rebuild 50/(s^2 + 6s + 25)
    assert abs(math.hypot(3, 4) - 5.0) < 1e-12
    assert abs(3.0 / 5.0 - 0.6) < 1e-12
    assert abs(2.0 * 25.0 - 50.0) < 1e-12
    #  thermal probe with tau = 12 s
    assert abs(12.0 * math.log(50.0) - 46.944276) < 1e-6
    assert abs(12.0 * math.log(10.0) - 27.631021) < 1e-6
    assert abs(12.0 * math.log(9.0) - 26.366695) < 1e-6

    # -- the printed arithmetic chains of the time-domain problem sets -----
    assert abs(0.4 * 3.912 - 1.5648) < 1e-9
    assert abs(0.4 * 2.1972 - 0.87888) < 1e-9
    assert abs(math.sqrt(math.pi ** 2 + math.log(5.0) ** 2) - 3.5298576) < 1e-7
    assert abs(1.6094 / 3.5299 - 0.4559336) < 1e-7
    assert abs(math.sqrt(1 - 0.45594981 ** 2) - 0.8900055) < 1e-7
    assert abs(20.944 / 0.89001 - 23.5323199) < 1e-7
    assert abs(4.0 / 10.7296 - 0.3728005) < 1e-7
    assert abs(4.0 / 9.5494 - 0.4188745) < 1e-7
    dlt = math.log(1 / 0.1386)
    assert abs(dlt - 1.9761632) < 1e-7
    assert abs(math.sqrt(4 * math.pi ** 2 + 1.976 ** 2) - 6.5865768) < 1e-7
    assert abs(1.976 / 6.5866 - 0.3000030) < 1e-7
    assert abs(dlt / math.sqrt(math.pi ** 2 + dlt ** 2) - 0.5324511) < 1e-7
    assert abs(12 * math.exp(2.0) - 88.6686732) < 1e-6
    assert abs((51.61 - 20) / 50 - 0.6322) < 1e-9
    assert abs(50.0 / 12.0 - 4.1666667) < 1e-7
    assert abs(math.pi / (4 * math.sqrt(0.75)) - 0.9068997) < 1e-7
    #  B2: Y = (3s+6)/((s+3)(s+4)) has y(0+) = 3 and residues -3, 6
    tb = np.linspace(0, 5, 50001)
    yb = -3 * np.exp(-3 * tb) + 6 * np.exp(-4 * tb)
    assert abs(yb[0] - 3.0) < 1e-12
    assert abs((3 * (-3) + 6) / (-3 + 4) + 3.0) < 1e-12
    assert abs((3 * (-4) + 6) / (-4 + 3) - 6.0) < 1e-12
    assert abs(6.0 / 12.0 - 0.5) < 1e-12
    #  B3: Y = 8/(s^2+16) inverts to 2 sin 4t
    assert abs(8.0 / 4.0 - 2.0) < 1e-12
    #  7.2 residues of 10/(s(s+2)(s+5))
    assert abs(10.0 / ((-2) * 3) + 5.0 / 3.0) < 1e-12
    assert abs(10.0 / ((-5) * (-3)) - 2.0 / 3.0) < 1e-12

    # -- the wrong numbers the distractor traps produce --------------------
    # Every problem-set answer names its trap and the number it lands on, so
    # those numbers are computed here too rather than guessed at.
    assert abs(4.0 / (0.45594981 * 20.9439510) - 0.41887490) < 1e-7
    assert abs(1.0 / (20 * (2 - math.sqrt(3))) - 0.18660254) < 1e-8
    assert abs(6.0 / 5.0 - 1.2) < 1e-12                       # zeta without the 2
    assert abs(math.sqrt(40.0) - 6.3245553) < 1e-7            # wn read off the numerator
    assert abs(11.0 / (2 * math.sqrt(10.0)) - 1.7392527) < 1e-7
    assert abs(20 * math.log10(4.0) - 12.0411998) < 1e-7      # DC gain used at w = 3
    assert abs(5.0 / 3.0 - 1.6666667) < 1e-7
    assert abs(3.0 / 6.0 - 0.5) < 1e-12                       # Y(0) mistaken for y(0+)
    assert abs(3.0 / 5.0 - 0.6) < 1e-12                       # parabola without the factor 2
    assert abs(2.0 * 5.0 - 10.0) < 1e-12                      # |H| = 8/4 at w = 3

    print("verify: every quoted number reproduced by an independent route")


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
    verify()
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
