#!/usr/bin/env python3
"""Wave-2 figures for the FE Electrical and Computer course.

Companion to gen_fe_ee_figures.py, same contract, same style module, and the
same honesty property: every curve here is COMPUTED pointwise from the
equation the lesson states, in code a reader can check against the formula.
Nothing is traced, scanned or adapted from the NCEES Reference Handbook or
any other book - formulas in, curves out.

Where a figure makes a numeric claim (an rms level, an overshoot, a corner
error) the value is computed from the samples and asserted against the
analytic result, so the plotted line and the printed number cannot drift
apart.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w2.py            # all
    python3 scripts/gen_fe_ee_w2.py lsys       # matching prefix only
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
# Circuit Analysis - AC power and waveforms
# ---------------------------------------------------------------------------


@figure("circuits-instantaneous-power")
def _(mode):
    """Instantaneous power over two cycles, resistive against theta = 60 deg.

    p(t) = V I cos(theta) + V I cos(2 omega t - theta), with rms V = I = 1.
    The resistive case never goes negative; at theta = 60 deg the same rms
    current delivers half the average power and returns energy to the source
    twice per cycle - the shaded lobes are that returned energy.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 2, 800)          # time in fundamental cycles
    wt = 2 * np.pi * t
    th = np.radians(60.0)
    p_res = 1.0 + np.cos(2 * wt)            # theta = 0
    p_60 = np.cos(th) + np.cos(2 * wt - th)  # theta = 60 deg

    # the averages the lesson quotes, checked against the samples
    assert abs(p_res.mean() - 1.0) < 2e-3
    assert abs(p_60.mean() - 0.5) < 2e-3

    fig, ax = plt.subplots()
    ax.plot(t, p_res, color=c[0], lw=2.0)
    ax.plot(t, p_60, color=c[1], lw=2.0)
    ax.fill_between(t, 0, p_60, where=(p_60 < 0), color=c[1], alpha=0.28)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(0.5, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    S.label_end(ax, t[-1], p_res[-1], "theta = 0", c[0], mode, dy=6)
    S.label_end(ax, t[-1], p_60[-1], "theta = 60 deg", c[1], mode, dy=-8)
    S.note(ax, 0.02, 1.04, "average P at theta = 0", mode)
    S.note(ax, 0.02, 0.54, "average P at 60 deg", mode)
    S.note(ax, 0.62, -0.62, "energy returned\nto the source", mode, ha="center")
    ax.set_xlabel("time  (cycles of the fundamental)")
    ax.set_ylabel("p(t) / (V I),  rms values")
    ax.set_title("Reactive power is the part of p(t) that comes back")
    ax.set_xlim(0, 2.35)
    ax.set_ylim(-0.85, 2.15)
    S.strip(ax)
    return fig


@figure("circuits-waveform-rms")
def _(mode):
    """One period each of sine, triangle and square, with rms and rectified
    average drawn as levels.

    Each rms level is computed from the plotted samples and asserted against
    the analytic factor - 1/sqrt(2), 1/sqrt(3) and 1 - so the guide line is
    the number the lesson derives, not a typed-in approximation.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 1, 2000, endpoint=False)
    sine = np.sin(2 * np.pi * t)
    tri = 4 * np.abs(t - 0.5) - 1          # peak +1 at the ends, -1 mid-period
    sq = np.sign(np.sin(2 * np.pi * t + 1e-12))

    shapes = [
        ("sine", sine, 1 / np.sqrt(2), 2 / np.pi, c[0]),
        ("triangle", tri, 1 / np.sqrt(3), 0.5, c[1]),
        ("square", sq, 1.0, 1.0, c[2]),
    ]
    fig, axes = plt.subplots(3, 1, sharex=True, figsize=(7.2, 6.2))
    for ax, (name, y, rms_true, avg_true, col) in zip(axes, shapes):
        rms = float(np.sqrt(np.mean(y ** 2)))
        avg = float(np.mean(np.abs(y)))
        assert abs(rms - rms_true) < 2e-3, name
        assert abs(avg - avg_true) < 2e-3, name
        ax.plot(t, y, color=col, lw=2.0)
        ax.axhline(rms_true, color=S.GUIDE[mode], lw=1.1, ls="--")
        ax.axhline(avg_true, color=S.GUIDE[mode], lw=0.9, ls=":")
        ax.axhline(0, color=S.GRID[mode], lw=0.8)
        S.label_end(ax, 1.0, y[-1], name, col, mode)
        S.note(ax, 1.02, rms_true - 0.06, f"rms {rms_true:.3f}", mode, va="top")
        S.note(ax, 0.01, avg_true + 0.03, f"rectified average {avg_true:.3f}",
               mode, size=8)
        ax.set_ylim(-1.35, 1.5)
        S.strip(ax)
    axes[0].set_title("Same peak, three different rms values")
    axes[2].set_xlabel("time  (periods)")
    axes[1].set_ylabel("value / peak")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Linear Systems
# ---------------------------------------------------------------------------


@figure("lsys-conv-pulse-exp")
def _(mode):
    """The lesson's worked convolution, drawn: a width-2 pulse into
    h(t) = exp(-t) u(t).

    The output is computed NUMERICALLY from the convolution sum and checked
    against the closed form the lesson derives - (1 - e^-t) while the pulse
    is still arriving, (e^2 - 1) e^-t after it has passed - so the picture
    is evidence for the algebra rather than an illustration of it.
    """
    c = S.SERIES[mode]
    dt = 0.002
    t = np.arange(0, 8, dt)
    x = ((t >= 0) & (t < 2)).astype(float)
    h = np.exp(-t)
    y_num = np.convolve(x, h)[: len(t)] * dt
    y_ref = np.where(t <= 2, 1 - np.exp(-t), (np.e ** 2 - 1) * np.exp(-t))
    assert np.max(np.abs(y_num - y_ref)) < 5e-3

    fig, (ax, bx) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.6))
    ax.plot(t, x, color=c[0], lw=2.0)
    ax.plot(t, h, color=c[1], lw=2.0)
    S.label_end(ax, 2.05, 0.92, "x(t): pulse, width 2", c[0], mode)
    S.label_end(ax, 3.2, np.exp(-3.2), "h(t) = e^-t u(t)", c[1], mode, dy=8)
    ax.set_ylabel("inputs")
    ax.set_ylim(0, 1.25)
    S.strip(ax)

    bx.plot(t, y_num, color=c[2], lw=2.2)
    peak = 1 - np.exp(-2)
    bx.plot([2], [peak], "o", color=c[2], ms=6)
    bx.axvline(2, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(bx, 2.1, peak + 0.04, "peak 0.865 at t = 2,\nwhere the pulse ends", mode)
    S.label_end(bx, t[-1], y_num[-1], "y(t) = x * h", c[2], mode, dy=6)
    bx.set_xlabel("time  t")
    bx.set_ylabel("output")
    bx.set_ylim(0, 1.1)
    S.strip(bx)
    fig.tight_layout()
    return fig


@figure("lsys-second-order-step")
def _(mode):
    """Second-order unit step response for three damping ratios, omega_n = 1.

    Each curve is the exact solution of the standard form
    omega_n^2 / (s^2 + 2 zeta omega_n s + omega_n^2) driven by a unit step.
    The overshoot marker on the zeta = 0.25 curve is computed from
    exp(-pi zeta / sqrt(1 - zeta^2)) and asserted against the sampled peak.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 14, 1400)
    fig, ax = plt.subplots()

    z = 0.25
    wd = np.sqrt(1 - z ** 2)
    under = 1 - np.exp(-z * t) * (np.cos(wd * t) + (z / wd) * np.sin(wd * t))
    crit = 1 - np.exp(-t) * (1 + t)
    z2 = 2.0
    s1, s2 = -z2 + np.sqrt(z2 ** 2 - 1), -z2 - np.sqrt(z2 ** 2 - 1)
    over = 1 + (s2 * np.exp(s1 * t) - s1 * np.exp(s2 * t)) / (s1 - s2)

    mp = np.exp(-np.pi * 0.25 / wd)
    tp = np.pi / wd
    assert abs(under.max() - (1 + mp)) < 1e-3

    ax.plot(t, under, color=c[0], lw=2.0)
    ax.plot(t, crit, color=c[1], lw=2.0)
    ax.plot(t, over, color=c[2], lw=2.0)
    ax.plot([tp], [1 + mp], "o", color=c[0], ms=6)
    S.note(ax, tp + 0.25, 1 + mp + 0.03,
           f"overshoot {100 * mp:.0f}% at t = pi/omega_d", mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, t[-1], under[-1], "zeta = 0.25", c[0], mode, dy=16)
    S.label_end(ax, t[-1], crit[-1], "zeta = 1", c[1], mode, dy=2)
    S.label_end(ax, t[-1], over[-1], "zeta = 2", c[2], mode, dy=-12)
    ax.set_xlabel("time  (units of 1/omega_n)")
    ax.set_ylabel("unit step response")
    ax.set_title("zeta sets the shape; omega_n only sets the clock")
    ax.set_xlim(0, 17.5)
    ax.set_ylim(0, 1.58)
    S.strip(ax)
    return fig


@figure("lsys-fourier-square")
def _(mode):
    """Fourier partial sums of a square wave: 1, 3 and 5 nonzero terms.

    x_N(t) = (4/pi) sum over odd k of sin(k omega_0 t)/k, summed pointwise.
    The square wave itself is the guide; the approach of the partial sums,
    and the overshoot that refuses to shrink at the edges, are both computed
    rather than sketched.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 1.5, 3000)
    sq = np.sign(np.sin(2 * np.pi * t) + 1e-12)

    fig, ax = plt.subplots()
    ax.plot(t, sq, color=S.GUIDE[mode], lw=1.4)
    for i, terms in enumerate([1, 3, 5]):
        y = np.zeros_like(t)
        for m in range(terms):
            k = 2 * m + 1
            y += (4 / np.pi) * np.sin(k * 2 * np.pi * t) / k
        ax.plot(t, y, color=c[i], lw=1.9)
        S.label_end(ax, t[-1], y[-1],
                    f"{terms} term" + ("s" if terms > 1 else ""),
                    c[i], mode, dy=8 * (1 - i))
    S.note(ax, 0.02, 1.22, "harmonic k carries amplitude 4/(pi k):\n"
                           "sharp edges need high frequencies", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.8)
    ax.set_xlabel("time  (periods)")
    ax.set_ylabel("value")
    ax.set_title("A square wave assembled from its odd harmonics")
    ax.set_xlim(0, 1.78)
    ax.set_ylim(-1.55, 1.62)
    S.strip(ax)
    return fig


@figure("lsys-worked-bode")
def _(mode):
    """Exact magnitude of H(s) = 10(s+2)/((s+1)(s+5)) against its asymptotes.

    The exact curve is 20 log10 of the evaluated H(j omega); the straight
    lines are the lesson's sketch: flat at 12.0 dB to the pole at 1, then
    -20 dB/decade to the zero at 2, flat again to the pole at 5, then
    -20 dB/decade for good. The DC level is asserted against 20 log10(4).
    """
    c = S.SERIES[mode]
    w = np.logspace(-1.2, 3, 800)
    H = 10 * (1j * w + 2) / ((1j * w + 1) * (1j * w + 5))
    exact = 20 * np.log10(np.abs(H))
    assert abs(exact[0] - 20 * np.log10(4.0)) < 0.05

    dc = 20 * np.log10(4.0)                       # 12.04 dB
    mid = dc - 20 * np.log10(2.0)                 # 6.02 dB between 2 and 5
    asym = np.select(
        [w < 1, w < 2, w < 5],
        [dc, dc - 20 * np.log10(w), mid],
        default=mid - 20 * np.log10(w / 5),
    )

    fig, ax = plt.subplots()
    ax.semilogx(w, exact, color=c[0], lw=2.2)
    ax.semilogx(w, asym, color=S.GUIDE[mode], lw=1.6, ls="--")
    for corner, what in [(1, "pole"), (2, "zero"), (5, "pole")]:
        ax.axvline(corner, color=S.GRID[mode], lw=0.9, ls=":")
        S.note(ax, corner * 1.06, -26, f"{what}\nat {corner}", mode, size=8)
    S.label_end(ax, w[-1], exact[-1], "exact", c[0], mode, dy=8)
    S.label_end(ax, w[-1], asym[-1], "asymptotes", S.GUIDE[mode], mode, dy=-8)
    ax.set_xlabel("frequency  (rad/s)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("H(s) = 10(s+2)/((s+1)(s+5)): sketch against truth")
    ax.set_ylim(-42, 18)
    S.strip(ax)
    return fig


@figure("lsys-z-geometric")
def _(mode):
    """The sequence a^n for a pole inside, near and outside the unit circle.

    Three geometric sequences computed term by term: a = 0.5 dies in a few
    samples, a = 0.95 takes tens of samples, a = 1.05 grows without bound.
    Discrete stability IS this picture: pole magnitude against 1.
    """
    c = S.SERIES[mode]
    n = np.arange(0, 25)
    fig, ax = plt.subplots()
    for i, a in enumerate([0.5, 0.95, 1.05]):
        y = a ** n
        ax.vlines(n + 0.09 * (i - 1), 0, y, color=c[i], lw=1.4, alpha=0.8)
        ax.plot(n + 0.09 * (i - 1), y, "o", color=c[i], ms=4.4)
        S.label_end(ax, n[-1], y[-1], f"a = {a}", c[i], mode,
                    dy=(4 if a > 1 else -2 - 8 * i))
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.2, 1.06, "a^0 = 1 for all three", mode)
    ax.set_xlabel("sample index  n")
    ax.set_ylabel("a^n")
    ax.set_title("Inside the unit circle decays; outside grows")
    ax.set_xlim(-0.6, 28.5)
    ax.set_ylim(0, 3.6)
    S.strip(ax)
    return fig


@figure("lsys-bode-first-order")
def _(mode):
    """Exact against asymptotic response of one real pole at omega = 1.

    Magnitude: 20 log10 (1/sqrt(1 + omega^2)) against the flat-then-slope
    sketch. Phase: -arctan(omega) against the 0 / -45 per decade / -90 ramp.
    The corner error is computed and asserted at 3.01 dB - the worst the
    magnitude approximation ever gets for a single real pole.
    """
    c = S.SERIES[mode]
    w = np.logspace(-2, 2, 600)
    mag = 20 * np.log10(1 / np.sqrt(1 + w ** 2))
    ph = -np.degrees(np.arctan(w))
    mag_asym = np.where(w < 1, 0.0, -20 * np.log10(w))
    ph_asym = np.select([w < 0.1, w <= 10], [0.0, -45 * (np.log10(w) + 1)],
                        default=-90.0)
    corner_err = 0.0 - 20 * np.log10(1 / np.sqrt(2))
    assert abs(corner_err - 3.0103) < 1e-3

    fig, (ax, bx) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.8))
    ax.semilogx(w, mag, color=c[0], lw=2.2)
    ax.semilogx(w, mag_asym, color=S.GUIDE[mode], lw=1.6, ls="--")
    ax.plot([1], [-3.0103], "o", color=c[0], ms=6)
    S.note(ax, 0.02, -14, "3 dB low at the corner -\nthe worst error there is", mode)
    ax.set_ylabel("magnitude  (dB)")
    ax.set_ylim(-42, 6)
    S.strip(ax)

    bx.semilogx(w, ph, color=c[1], lw=2.2)
    bx.semilogx(w, ph_asym, color=S.GUIDE[mode], lw=1.6, ls="--")
    bx.plot([1], [-45], "o", color=c[1], ms=6)
    S.note(bx, 1.15, -42, "-45 deg exactly at the corner", mode)
    for v in (0.1, 1.0, 10.0):
        bx.axvline(v, color=S.GRID[mode], lw=0.9, ls=":")
    bx.set_xlabel("frequency  omega / omega_corner")
    bx.set_ylabel("phase  (deg)")
    bx.set_ylim(-100, 8)
    S.strip(bx)
    ax.set_title("One real pole: the sketch and the truth")
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
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
