#!/usr/bin/env python3
"""Depth-wave-18 figures: the Frequency Domain and Z-Transform chapters of the
FE Electrical and Computer course (`fee_freq_domain`, `fee_z_transforms`).

Same contract as the other generators in this directory, and it imports the
same `ed_figstyle` module rather than growing a second look. Every curve here
is COMPUTED, in this file, from an equation the lesson that references it
writes out. Nothing is traced, scanned, redrawn or adapted from the NCEES
Reference Handbook or any textbook: the pipeline consumes formulas, which are
not protected expression, and never anyone's drawing of them.

Two verification habits are load-bearing here and are worth naming, because
they are the ones this pair of chapters can get wrong invisibly:

  * a frequency response is checked by EVALUATING H at s = j*omega, never by
    trusting an asymptote or a remembered corner rule, and
  * a discrete impulse or step response is checked by RUNNING THE DIFFERENCE
    EQUATION FORWARD and comparing sample by sample against the closed form
    the lesson prints.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION. Assertions are written at 1e-9 or tighter wherever the quantity is
exact in closed form, and at the last quoted digit otherwise; a loose
tolerance on a quoted number is decoration, not a check.

Usage:
    python3 scripts/gen_fe_ee_d18.py            # all
    python3 scripts/gen_fe_ee_d18.py lin3-zt    # only names with that prefix
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
    if not name.startswith("lin3-"):
        raise ValueError(f"figure {name!r} is outside this file's namespace")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def unit_circle(ax, mode, label=True):
    """The z-plane's stability boundary, drawn as furniture rather than data."""
    th = np.linspace(0, 2 * np.pi, 721)
    ax.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    if label:
        S.note(ax, np.cos(0.75) * 1.03, np.sin(0.75) * 1.03, "unit circle", mode)


# ===========================================================================
# fee_freq_domain
# ===========================================================================


@figure("lin3-fd-jw-vectors")
def _(mode):
    """Pole vectors of H(s) = 200/((s+2)(s+10)) drawn to the test point j5.

    |H| is 200 divided by the product of the two vector lengths and the angle
    is minus their angle sum. Both are asserted here against a straight
    complex evaluation of H at s = j5, which is the independent route.
    """
    c = S.SERIES[mode]
    p = np.array([-2.0, -10.0])
    w = 5.0
    lengths = np.abs(1j * w - p)
    angles = np.degrees(np.angle(1j * w - p))
    Hd = 200.0 / ((1j * w + 2.0) * (1j * w + 10.0))
    assert abs(lengths[0] - 5.3851648071) < 5e-10, lengths[0]
    assert abs(lengths[1] - 11.1803398875) < 5e-10, lengths[1]
    assert abs(angles[0] - 68.1985905136) < 5e-10, angles[0]
    assert abs(angles[1] - 26.5650511771) < 5e-10, angles[1]
    assert abs(200.0 / lengths.prod() - abs(Hd)) < 1e-12
    assert abs(-(angles.sum()) - np.degrees(np.angle(Hd))) < 1e-12
    assert abs(abs(Hd) - 3.3218191941) < 5e-10, abs(Hd)
    assert abs(np.degrees(np.angle(Hd)) + 94.7636416907) < 5e-10

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    for k, (pp, col) in enumerate(zip(p, (c[0], c[1]))):
        ax.annotate("", xy=(0, w), xytext=(pp, 0),
                    arrowprops=dict(arrowstyle="->", color=col, lw=2.0))
        mid = (pp / 2, w / 2)
        S.label_end(ax, mid[0], mid[1],
                    f"length {lengths[k]:.4f}\nangle {angles[k]:.4f} deg",
                    col, mode, dx=-4 if k else 8, dy=10 if k else -18,
                    ha="right" if k else "left", size=9)
        ax.plot([pp], [0], "x", color=col, ms=11, mew=2.4)
    ax.plot([0], [w], "o", color=S.INK[mode], ms=7)
    S.note(ax, 0.3, w + 0.25, "test point  s = j5", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    S.note(ax, -11.6, 6.3,
           "|H| = 200 / (5.3852 x 11.1803) = 3.3218\n"
           "angle H = -(68.1986 + 26.5651) = -94.7636 deg", mode)
    ax.set_xlabel("real part of s  (1/s)")
    ax.set_ylabel("imaginary part of s  (rad/s)")
    ax.set_title("Magnitude and phase read off the pole vectors")
    ax.set_xlim(-12, 3)
    ax.set_ylim(-1.6, 7.6)
    S.strip(ax)
    return fig


@figure("lin3-fd-magphase-sweep")
def _(mode):
    """Magnitude in dB and phase for H(s) = 200/((s+2)(s+10)).

    Stacked panels share the frequency axis, per the house rule against a
    second y-scale. The lesson's operating point at 5 rad/s is marked on both.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1, 3, 1400)
    H = 200.0 / ((1j * w + 2.0) * (1j * w + 10.0))
    mag_db = 20 * np.log10(np.abs(H))
    ph = np.degrees(np.angle(H))
    i5 = int(np.argmin(np.abs(w - 5.0)))
    H5 = 200.0 / ((5j + 2.0) * (5j + 10.0))
    assert abs(20 * np.log10(abs(H5)) - 10.4275198042) < 5e-10
    assert abs(np.degrees(np.angle(H5)) + 94.7636416907) < 5e-10
    assert abs(mag_db[0] - 20 * np.log10(abs(200.0 / ((0.1j + 2) * (0.1j + 10))))) < 1e-12
    # DC gain 200/20 = 10 -> exactly 20 dB
    assert abs(20 * np.log10(10.0) - 20.0) < 1e-12

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    a1.semilogx(w, mag_db, color=c[0], lw=2.2)
    a1.axhline(20.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(a1, 0.11, 21.0, "DC gain 200/20 = 10, i.e. 20 dB", mode)
    a1.plot([5.0], [20 * np.log10(abs(H5))], "o", color=c[0], ms=7)
    S.label_end(a1, 5.0, 20 * np.log10(abs(H5)), "10.43 dB at 5 rad/s", c[0], mode, dy=10)
    a1.set_ylabel("magnitude  (dB)")
    a1.set_title("Evaluate H on the imaginary axis: two poles, two corners")
    a1.set_ylim(-70, 32)
    S.strip(a1)

    a2.semilogx(w, ph, color=c[1], lw=2.2)
    a2.plot([5.0], [np.degrees(np.angle(H5))], "o", color=c[1], ms=7)
    S.label_end(a2, 5.0, np.degrees(np.angle(H5)), "-94.76 deg", c[1], mode, dy=-14)
    for corner in (2.0, 10.0):
        a2.axvline(corner, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(a2, 2.1, -16, "poles at 2 and 10 rad/s\ncontribute -45 deg each\nat their own corner", mode)
    a2.set_xlabel("frequency  omega  (rad/s)")
    a2.set_ylabel("phase  (degrees)")
    a2.set_ylim(-190, 10)
    S.strip(a2)
    assert abs(ph[i5] - np.degrees(np.angle(H5))) < 0.5
    return fig


@figure("lin3-fd-decibel-map")
def _(mode):
    """Decibels for a power ratio and for an amplitude ratio, on one axis.

    The two curves differ by exactly the factor of two, which is the whole
    content of the trap: 3 dB is a doubling of POWER but only a 1.414x rise
    in amplitude, while doubling an amplitude is 6.02 dB.
    """
    c = S.SERIES[mode]
    r = np.logspace(-1, 2, 1200)
    p_db = 10 * np.log10(r)
    a_db = 20 * np.log10(r)
    assert abs(10 * np.log10(2.0) - 3.0102999566) < 5e-10
    assert abs(20 * np.log10(2.0) - 6.0205999133) < 5e-10
    assert abs(20 * np.log10(1 / np.sqrt(2)) + 3.0102999566) < 5e-10
    assert abs(a_db[-1] - 40.0) < 1e-12 and abs(p_db[-1] - 20.0) < 1e-12

    fig, ax = plt.subplots()
    ax.semilogx(r, p_db, color=c[0], lw=2.2)
    ax.semilogx(r, a_db, color=c[1], lw=2.2)
    S.label_end(ax, 60, 10 * np.log10(60), "10 log10 (P2/P1)", c[0], mode, dx=-6, dy=-15, ha="right")
    S.label_end(ax, 24, 20 * np.log10(24), "20 log10 (V2/V1)", c[1], mode, dx=-6, dy=12, ha="right")
    ax.plot([2.0], [10 * np.log10(2.0)], "o", color=c[0], ms=7)
    ax.plot([2.0], [20 * np.log10(2.0)], "o", color=c[1], ms=7)
    S.note(ax, 2.35, 1.1, "power x2 -> 3.01 dB", mode)
    S.note(ax, 1.05, 8.6, "amplitude x2 -> 6.02 dB", mode)
    ax.plot([1 / np.sqrt(2)], [20 * np.log10(1 / np.sqrt(2))], "o", color=c[1], ms=7)
    S.note(ax, 1.4, -20.5, "the half-power point sits at amplitude 0.7071.\nIt is -3.01 dB on the amplitude rule AND on the\npower rule, because power goes as amplitude\nsquared and the two factors of two cancel.", mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.set_xlabel("ratio (output over input)")
    ax.set_ylabel("decibels")
    ax.set_title("One quantity, two rules: the factor of two is not optional")
    ax.set_ylim(-22, 43)
    S.strip(ax)
    return fig


@figure("lin3-fd-bandpass-edges")
def _(mode):
    """Half-power edges of H(s) = 1000 s/((s+10)(s+1000)), found by evaluation.

    The edges are computed from the standard-form expression and then CHECKED
    by evaluating |H| at them; the assertion is that each really is the peak
    over root two, not that the formula was copied correctly.
    """
    c = S.SERIES[mode]

    def H(wv):
        s = 1j * wv
        return 1000.0 * s / ((s + 10.0) * (s + 1000.0))

    w = np.logspace(-0.2, 4.2, 2400)
    mag = np.abs(H(w))
    peak = abs(H(100.0))
    Q = 100.0 / 1010.0
    half = 1 / (2 * Q)
    w1 = 100.0 * (np.sqrt(1 + half * half) - half)
    w2 = 100.0 * (np.sqrt(1 + half * half) + half)
    assert abs(peak - 1000.0 / 1010.0) < 1e-12, peak
    assert abs(np.angle(H(100.0))) < 1e-15
    assert abs(abs(H(w1)) - peak / np.sqrt(2)) < 1e-12
    assert abs(abs(H(w2)) - peak / np.sqrt(2)) < 1e-12
    assert abs(w1 - 9.8057886232) < 5e-10, w1
    assert abs(w2 - 1019.8057886232) < 5e-10, w2
    assert abs(np.sqrt(w1 * w2) - 100.0) < 1e-9
    assert abs((w2 - w1) - 1010.0) < 1e-9
    mid = 0.5 * (w1 + w2)
    assert abs(mid - 514.8057886232) < 5e-9, mid
    assert abs(abs(H(mid)) - 0.8889319720) < 5e-10, abs(H(mid))

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.semilogx(w, mag, color=c[0], lw=2.3)
    ax.axhline(peak, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(peak / np.sqrt(2), color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.66, peak + 0.022, "peak 0.9901 at the geometric mean, 100 rad/s", mode)
    S.note(ax, 0.66, peak / np.sqrt(2) + 0.022, "half-power level 0.7001", mode)
    for wv, tag in ((w1, "9.806"), (w2, "1019.8")):
        ax.plot([wv], [abs(H(wv))], "o", color=c[0], ms=7)
        S.note(ax, wv, abs(H(wv)) - 0.115, tag, mode, ha="center")
    ax.plot([100.0], [peak], "o", color=c[0], ms=7)
    ax.plot([mid], [abs(H(mid))], "o", color=c[1], ms=7)
    S.label_end(ax, mid, abs(H(mid)),
                "arithmetic midpoint 514.8:\nnot the centre, |H| = 0.8889",
                c[1], mode, dx=-14, dy=-26, ha="right")
    ax.set_xlabel("frequency  omega  (rad/s)")
    ax.set_ylabel("|H(j omega)|")
    ax.set_title("The band sits on its geometric centre, not its arithmetic one")
    ax.set_ylim(0, 1.22)
    S.strip(ax)
    return fig


@figure("lin3-fd-q-peaks")
def _(mode):
    """Second-order low-pass magnitude for three damping ratios.

    Every peak location and height is asserted against a brute-force search
    over the same curve, so the closed forms quoted in the lesson are checked
    by measurement rather than recalled.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.02, 2.4, 4000)

    def mag(xv, z):
        return 1.0 / np.abs(1 - xv ** 2 + 2j * z * xv)

    fig, ax = plt.subplots()
    for k, (z, tag) in enumerate(((0.1, "zeta = 0.1  (Q = 5)"),
                                  (0.3, "zeta = 0.3  (Q = 1.667)"),
                                  (1 / np.sqrt(2), "zeta = 0.707  (Q = 0.707)"))):
        y = mag(x, z)
        ax.plot(x, y, color=c[k], lw=2.1)
        xl = (1.32, 1.72, 2.16)[k]
        S.label_end(ax, xl, mag(xl, z), tag, c[k], mode, dx=6, dy=(14, 10, -12)[k])
        if z < 0.6:          # only these two actually peak above their DC value
            xr = np.sqrt(1 - 2 * z * z)
            peak = 1.0 / (2 * z * np.sqrt(1 - z * z))
            assert abs(mag(xr, z) - peak) < 1e-12
            j = int(np.argmax(y))
            assert abs(x[j] - xr) < 2e-3, (x[j], xr)
            assert abs(y[j] - peak) < 5e-3, (y[j], peak)
        assert abs(mag(1.0, z) - 1 / (2 * z)) < 1e-12
    xr01 = np.sqrt(1 - 2 * 0.01)
    assert abs(xr01 - 0.9899494937) < 5e-10, xr01
    assert abs(1.0 / (2 * 0.1 * np.sqrt(0.99)) - 5.0251890763) < 5e-10
    ax.plot([xr01], [1.0 / (2 * 0.1 * np.sqrt(0.99))], "o", color=c[0], ms=7)
    S.note(ax, 0.04, 5.35, "peak 5.0252 sits at 0.98995 of omega_0, not AT omega_0,\nwhere the value is exactly Q = 5", mode)
    ax.axvline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([1.0], [5.0], "o", color=S.INK[mode], ms=6)
    ax.set_xlabel("frequency ratio  omega / omega_0")
    ax.set_ylabel("magnitude relative to DC")
    ax.set_title("Where a resonance peaks, and where it merely equals Q")
    ax.set_xlim(0, 3.25)
    ax.set_ylim(0, 6.1)
    S.strip(ax)
    return fig


@figure("lin3-fd-cascade")
def _(mode):
    """One RC stage against two identical buffered stages, corner 1000 rad/s.

    The two-stage half-power frequency is computed from the shrink factor and
    then checked by evaluating the cascade there.
    """
    c = S.SERIES[mode]
    w = np.logspace(1.3, 4.3, 1800)

    def H(wv, n):
        return (1.0 / (1 + 1j * wv / 1000.0)) ** n

    x = np.sqrt(np.sqrt(2.0) - 1.0)
    wc2 = 1000.0 * x
    assert abs(x - 0.6435942529) < 5e-10, x
    assert abs(wc2 - 643.5942529056) < 5e-9, wc2
    assert abs(abs(H(wc2, 2)) - 1 / np.sqrt(2)) < 1e-12
    assert abs(abs(H(1000.0, 2)) - 0.5) < 1e-12
    assert abs(np.degrees(np.angle(H(1000.0, 2))) + 90.0) < 1e-12
    assert abs(20 * np.log10(abs(H(1000.0, 2))) + 6.0205999133) < 5e-10

    fig, ax = plt.subplots()
    ax.semilogx(w, 20 * np.log10(np.abs(H(w, 1))), color=c[0], lw=2.2)
    ax.semilogx(w, 20 * np.log10(np.abs(H(w, 2))), color=c[1], lw=2.2)
    S.label_end(ax, 2600, 20 * np.log10(abs(H(2600, 1))), "one stage", c[0], mode, dy=8)
    S.label_end(ax, 2600, 20 * np.log10(abs(H(2600, 2))), "two stages", c[1], mode, dy=-12)
    ax.axhline(-3.0102999566, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 21, -2.6, "-3.01 dB", mode)
    for wv, col in ((1000.0, c[0]), (wc2, c[1])):
        ax.plot([wv], [-3.0102999566], "o", color=col, ms=7)
    S.note(ax, 24, -34,
           "cascading two 1000 rad/s stages does NOT give a\n"
           "1000 rad/s filter: the pair reaches -3 dB at 643.59 rad/s,\n"
           "and at 1000 rad/s it is already down 6.02 dB", mode)
    ax.set_xlabel("frequency  omega  (rad/s)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Magnitudes multiply, so bandwidth shrinks")
    ax.set_ylim(-42, 6)
    S.strip(ax)
    return fig


@figure("lin3-fd-resonance-widths")
def _(mode):
    """Series and parallel resonance built from the SAME L and C.

    Both curves are normalised to their own peak so one axis carries both, and
    each half-power edge is asserted by evaluating the impedance there.
    """
    c = S.SERIES[mode]
    L, C = 50e-3, 0.2e-6
    Rs, Rp = 100.0, 100e3
    w0 = 1.0 / np.sqrt(L * C)
    assert abs(w0 - 10000.0) < 1e-9

    def series_current(wv):
        return 1.0 / np.abs(Rs + 1j * (wv * L - 1.0 / (wv * C)))

    def parallel_z(wv):
        return 1.0 / np.abs(1.0 / Rp + 1j * (wv * C - 1.0 / (wv * L)))

    qs, qp = w0 * L / Rs, Rp / (w0 * L)
    assert abs(qs - 5.0) < 1e-9 and abs(qp - 200.0) < 1e-9
    assert abs(Rs * np.sqrt(2) - 141.4213562373) < 5e-10
    for q, fn, peak in ((qs, series_current, 1.0 / Rs), (qp, parallel_z, Rp)):
        h = w0 / (2 * q)
        e1 = np.sqrt(h * h + w0 * w0) - h
        e2 = np.sqrt(h * h + w0 * w0) + h
        assert abs(fn(e1) / peak - 1 / np.sqrt(2)) < 1e-9, (q, fn(e1) / peak)
        assert abs(fn(e2) / peak - 1 / np.sqrt(2)) < 1e-9
        assert abs((e2 - e1) - w0 / q) < 1e-6
    s_edges = (9049.8756211209, 11049.8756211209)
    assert abs(series_current(s_edges[0]) * Rs - 1 / np.sqrt(2)) < 1e-9
    assert abs(s_edges[1] - s_edges[0] - 2000.0) < 1e-6
    assert abs(np.sqrt(s_edges[0] * s_edges[1]) - 10000.0) < 1e-6

    w = np.linspace(7000, 13500, 4000)
    fig, ax = plt.subplots()
    ax.plot(w, series_current(w) * Rs, color=c[0], lw=2.2)
    ax.plot(w, parallel_z(w) / Rp, color=c[1], lw=2.2)
    S.label_end(ax, 12200, series_current(12200) * Rs,
                "series branch current\nQ = 5, BW = 2000 rad/s", c[0], mode, dy=12)
    S.label_end(ax, 10600, parallel_z(10600) / Rp,
                "parallel tank voltage\nQ = 200, BW = 50 rad/s", c[1], mode, dy=22)
    ax.axhline(1 / np.sqrt(2), color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 7080, 0.72, "half-power level 0.7071", mode)
    for e in s_edges:
        ax.plot([e], [1 / np.sqrt(2)], "o", color=c[0], ms=7)
    ax.axvline(10000.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 10450, 0.07, "same L and C, so the SAME omega_0 = 10,000 rad/s.\n"
                            "Only the resistor's position moves, and that alone\n"
                            "changes the width by a factor of forty.", mode)
    ax.set_xlabel("frequency  omega  (rad/s)")
    ax.set_ylabel("response as a fraction of its own peak")
    ax.set_title("Topology, not component values, sets the sharpness")
    ax.set_ylim(0, 1.13)
    S.strip(ax)
    return fig


# ===========================================================================
# fee_z_transforms
# ===========================================================================


@figure("lin3-zt-roc-map")
def _(mode):
    """The annulus 0.5 < |z| < 3 for a genuinely two-sided sequence.

    The radii are the pole magnitudes of X(z) = z/(z-0.5) + z/(z-3); the shaded
    ring is where the defining sum actually converges, tested numerically here
    by summing |x[n]| r^{-n} on both walls and in the middle.
    """
    c = S.SERIES[mode]

    def total(r, terms=3000):
        acc = 0.0
        for n in range(terms):
            t = (0.5 / r) ** n
            if not np.isfinite(t) or acc > 1e12:
                return np.inf
            acc += t
        for m in range(1, terms):
            t = (r / 3.0) ** m
            if not np.isfinite(t) or acc > 1e12:
                return np.inf
            acc += t
        return acc

    assert not np.isfinite(total(0.45)), "must diverge inside the inner wall"
    assert np.isfinite(total(1.0)), "must converge in the ring"
    assert np.isfinite(total(2.8)), "must converge near the outer wall"
    assert not np.isfinite(total(3.3)), "must diverge outside the outer wall"

    th = np.linspace(0, 2 * np.pi, 721)
    fig, ax = plt.subplots(figsize=(7.0, 5.4))
    ax.fill(np.concatenate([3.0 * np.cos(th), 0.5 * np.cos(th[::-1])]),
            np.concatenate([3.0 * np.sin(th), 0.5 * np.sin(th[::-1])]),
            color=c[2], alpha=0.16, lw=0)
    ax.plot(0.5 * np.cos(th), 0.5 * np.sin(th), color=c[2], lw=1.8)
    ax.plot(3.0 * np.cos(th), 3.0 * np.sin(th), color=c[2], lw=1.8)
    unit_circle(ax, mode, label=False)
    ax.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.plot([0.5, 3.0], [0, 0], "x", color=c[1], ms=12, mew=2.6)
    S.note(ax, 0.56, -0.42, "pole 0.5", mode)
    S.note(ax, 2.55, -0.5, "pole 3", mode)
    S.note(ax, -4.55, 1.55, "the defining sum\nconverges only in\nthis ring:\n0.5 < |z| < 3", mode, size=9)
    S.note(ax, -4.55, -3.15, "the unit circle lies inside the ring, so this\nsequence also has a Fourier transform", mode, size=9)
    S.note(ax, -0.02, 1.06, "unit circle", mode, ha="center", size=9)
    ax.set_xlabel("real part of z")
    ax.set_ylabel("imaginary part of z")
    ax.set_title("The region of convergence is part of the answer")
    ax.set_xlim(-4.6, 3.6)
    ax.set_ylim(-3.4, 3.4)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("lin3-zt-roc-choices")
def _(mode):
    """One algebraic expression, two sequences, chosen by the ROC.

    z/(z - 0.8) is the transform of 0.8^n u[n] when |z| > 0.8 and of
    -0.8^n u[-n-1] when |z| < 0.8. Both sums are verified here.
    """
    c = S.SERIES[mode]
    n_r = np.arange(0, 16)
    right = 0.8 ** n_r
    n_l = np.arange(-16, 0)
    left = -(0.8 ** n_l)
    assert abs(right[0] - 1.0) < 1e-15
    assert abs(left[-1] + 0.8 ** -1) < 1e-15
    assert abs(left[-1] + 1.25) < 1e-12, left[-1]
    # the two sums, on their own sides of 0.8
    s_right = sum((0.8 / 0.9) ** n for n in range(4000))
    s_left = sum((0.7 / 0.8) ** m for m in range(1, 4000))
    assert np.isfinite(s_right) and abs(s_right - 9.0) < 1e-6, s_right
    assert np.isfinite(s_left) and abs(s_left - 7.0) < 1e-6, s_left

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0))
    fig.subplots_adjust(hspace=0.42)
    a1.stem(n_r, right, linefmt="-", markerfmt="o", basefmt=" ")
    for art, col in ((a1.lines[0], c[0]),):
        art.set_color(col)
    for coll in a1.collections:
        coll.set_color(c[0])
    a1.set_title("ROC |z| > 0.8  ->  a right-sided, decaying sequence")
    S.note(a1, 2.2, 0.72, "x[n] = (0.8)^n u[n]", mode)
    a1.set_ylabel("x[n]")
    a1.set_xlim(-17, 17)
    S.strip(a1)

    a2.stem(n_l, left, linefmt="-", markerfmt="o", basefmt=" ")
    for coll in a2.collections:
        coll.set_color(c[1])
    a2.lines[0].set_color(c[1])
    a2.set_title("ROC |z| < 0.8  ->  a left-sided sequence that grows backwards")
    S.note(a2, 0.5, -22, "x[n] = -(0.8)^n u[-n-1]", mode)
    a2.set_xlabel("sample index  n")
    a2.set_ylabel("x[n]")
    a2.set_xlim(-17, 17)
    S.strip(a2)
    return fig


@figure("lin3-zt-recursion-audit")
def _(mode):
    """Closed form against the recursion for y[n] = 1.2y[n-1] - 0.72y[n-2] + x[n].

    The line is sqrt(2) * 0.8485^n * cos((n-1)pi/4); the markers come from
    running the difference equation forward from an impulse. The assertion is
    that they agree at every sample, which is the check the lesson claims.
    """
    c = S.SERIES[mode]
    r = np.sqrt(0.72)
    N = 26
    rec = np.zeros(N)
    for n in range(N):
        acc = (1.0 if n == 0 else 0.0)
        if n >= 1:
            acc += 1.2 * rec[n - 1]
        if n >= 2:
            acc -= 0.72 * rec[n - 2]
        rec[n] = acc
    closed = np.array([np.sqrt(2) * r ** n * np.cos((n - 1) * np.pi / 4) for n in range(N)])
    assert np.max(np.abs(rec - closed)) < 1e-12, np.max(np.abs(rec - closed))
    assert abs(rec[0] - 1.0) < 1e-15 and abs(rec[1] - 1.2) < 1e-15
    assert abs(rec[2] - 0.72) < 1e-15 and abs(rec[3]) < 1e-15
    assert abs(rec[4] + 0.5184) < 1e-15, rec[4]
    assert abs(r - 0.8485281374) < 5e-10

    nn = np.arange(N)
    fine = np.linspace(0, N - 1, 1200)
    env = np.sqrt(2) * r ** fine
    fig, ax = plt.subplots()
    ax.plot(fine, env, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot(fine, -env, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.plot(fine, np.sqrt(2) * r ** fine * np.cos((fine - 1) * np.pi / 4),
            color=c[0], lw=1.9)
    ax.plot(nn, rec, "o", color=c[1], ms=6.5)
    S.label_end(ax, 8.9, np.sqrt(2) * r ** 8.9 * np.cos((8.9 - 1) * np.pi / 4),
                "closed form", c[0], mode, dx=8, dy=10)
    S.label_end(ax, 5, rec[5], "recursion, sample by sample", c[1], mode, dx=8, dy=-14)
    S.note(ax, 13.4, 0.86, "envelope sqrt(2) x 0.8485^n:\nthe pole magnitude sets the decay,\nits angle pi/4 sets the eight-sample period", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("sample index  n")
    ax.set_ylabel("h[n]")
    ax.set_title("Every inverse transform gets run forward before it is believed")
    ax.set_xlim(-0.8, 25.8)
    ax.set_ylim(-1.05, 1.75)
    S.strip(ax)
    return fig


@figure("lin3-zt-splane-zplane")
def _(mode):
    """z = exp(sT) with T = 1 ms, drawn as a pair of planes.

    Every plotted image point is computed by the exponential, and the two
    s-values one sampling frequency apart are asserted to land on one z.
    """
    c = S.SERIES[mode]
    T = 1e-3
    pts = [(-200 + 0j, "s = -200"),
           (-100 + 600j, "s = -100 + j600"),
           (-100 - 600j, ""),
           (0 + 600j, "s = j600"),
           (0 - 600j, ""),
           (50 + 0j, "s = +50")]
    imgs = [np.exp(s * T) for s, _ in pts]
    assert abs(imgs[0] - np.exp(-0.2)) < 1e-15
    assert abs(abs(imgs[1]) - np.exp(-0.1)) < 1e-15
    assert abs(abs(imgs[3]) - 1.0) < 1e-15
    assert abs(imgs[5]) > 1.0
    alias = np.exp((-100 + (600 + 2 * np.pi / T) * 1j) * T)
    assert abs(alias - imgs[1]) < 1e-12, abs(alias - imgs[1])
    assert abs(np.exp(-0.2) - 0.8187307531) < 5e-10
    assert abs(np.exp(-0.1) - 0.9048374180) < 5e-10

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 4.2))
    a1.axvspan(-320, 0, color=c[0], alpha=0.13, lw=0)
    a1.axhline(0, color=S.GRID[mode], lw=0.9)
    a1.axvline(0, color=S.GUIDE[mode], lw=1.3, ls="--")
    for (s, tag), col in zip(pts, (c[0], c[0], c[0], c[1], c[1], c[2])):
        a1.plot([s.real], [s.imag], "o", color=col, ms=7)
        if tag:
            dy = {"s = j600": -120}.get(tag, 34)
            S.note(a1, s.real + 12, s.imag + dy, tag, mode, size=8.5)
    S.note(a1, -305, -900, "left half-plane\n= decaying", mode, size=9)
    a1.set_xlim(-320, 160)
    a1.set_ylim(-1000, 1000)
    a1.set_title("s-plane")
    a1.set_xlabel("sigma  (1/s)")
    a1.set_ylabel("omega  (rad/s)")
    S.strip(a1)

    th = np.linspace(0, 2 * np.pi, 721)
    a2.fill(np.cos(th), np.sin(th), color=c[0], alpha=0.13, lw=0)
    a2.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.3, ls="--")
    a2.axhline(0, color=S.GRID[mode], lw=0.9)
    a2.axvline(0, color=S.GRID[mode], lw=0.9)
    for z, col in zip(imgs, (c[0], c[0], c[0], c[1], c[1], c[2])):
        a2.plot([z.real], [z.imag], "o", color=col, ms=7)
    S.note(a2, -1.18, 0.86, "inside = decaying", mode, size=9)
    S.note(a2, 0.30, -0.86, "|z| = exp(sigma T),\nangle z = omega T", mode, size=8.5)
    a2.set_xlim(-1.25, 1.32)
    a2.set_ylim(-1.25, 1.25)
    a2.set_aspect("equal")
    a2.set_title("z-plane, T = 1 ms")
    a2.set_xlabel("real part of z")
    S.strip(a2)
    return fig


@figure("lin3-zt-design-measure")
def _(mode):
    """Two first-order digital low-passes written to the same specification.

    Pole matching lands the corner 3.47% high; the bilinear transform with a
    prewarped corner lands it exactly. Both claims are asserted by evaluating
    each H on the unit circle at the specified frequency.
    """
    c = S.SERIES[mode]
    fs, fc = 1000.0, 100.0
    T = 1.0 / fs
    Om_c = 2 * np.pi * fc / fs
    a = np.exp(-2 * np.pi * fc * T)
    K = 1 - a
    assert abs(a - 0.5334880911) < 5e-10, a
    assert abs(K - 0.4665119089) < 5e-10, K

    wa = (2 / T) * np.tan(Om_c / 2)
    b0 = wa / (2 / T + wa)
    a1 = (2 / T - wa) / (2 / T + wa)
    assert abs(wa - 649.8393924658) < 5e-9, wa
    assert abs(b0 - 0.2452372753) < 5e-10, b0
    assert abs(a1 - 0.5095254495) < 5e-10, a1

    def Hpm(Om):
        z = np.exp(1j * Om)
        return K / (1 - a / z)

    def Hbl(Om):
        z = np.exp(1j * Om)
        return b0 * (1 + 1 / z) / (1 - a1 / z)

    assert abs(abs(Hpm(0.0)) - 1.0) < 1e-12
    assert abs(abs(Hbl(0.0)) - 1.0) < 1e-12
    assert abs(abs(Hbl(Om_c)) - 1 / np.sqrt(2)) < 1e-12, abs(Hbl(Om_c))
    assert abs(abs(Hbl(np.pi))) < 1e-15
    assert abs(abs(Hpm(Om_c)) - 0.7186402073) < 5e-10, abs(Hpm(Om_c))
    assert abs(20 * np.log10(abs(Hpm(Om_c))) + 2.8697697614) < 5e-9
    cosOm = (1 + a ** 2 - 2 * (1 - a) ** 2) / (2 * a)
    f_true = np.arccos(cosOm) * fs / (2 * np.pi)
    assert abs(abs(Hpm(np.arccos(cosOm))) - 1 / np.sqrt(2)) < 1e-12
    assert abs(f_true - 103.4654097928) < 5e-9, f_true

    f = np.linspace(0.5, 500.0, 3000)
    Om = 2 * np.pi * f / fs
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 6.0))
    fig.subplots_adjust(hspace=0.58)
    ax1.semilogx(f, 20 * np.log10(np.abs(Hpm(Om))), color=c[0], lw=2.2)
    ax1.semilogx(f, 20 * np.log10(np.abs(Hbl(Om))), color=c[1], lw=2.2)
    S.label_end(ax1, 300, 20 * np.log10(abs(Hpm(2 * np.pi * 300 / fs))),
                "matched pole", c[0], mode, dx=-8, dy=12, ha="right")
    S.label_end(ax1, 300, 20 * np.log10(abs(Hbl(2 * np.pi * 300 / fs))),
                "bilinear, prewarped", c[1], mode, dx=-8, dy=-12, ha="right")
    ax1.axhline(-3.0102999566, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax1.axvline(100.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax1, 0.62, -2.2, "the specification: -3.01 dB at 100 Hz", mode)
    S.note(ax1, 0.62, -32, "the bilinear design pays for its accuracy\nwith a zero forced onto Nyquist", mode)
    ax1.set_ylabel("magnitude  (dB)")
    ax1.set_title("Designed to a number, then measured against it")
    ax1.set_ylim(-42, 6)
    ax1.set_xlabel("frequency  (Hz),  fs = 1000 Hz")
    S.strip(ax1)

    fz = np.linspace(80.0, 130.0, 1200)
    Omz = 2 * np.pi * fz / fs
    ax2.plot(fz, 20 * np.log10(np.abs(Hpm(Omz))), color=c[0], lw=2.2)
    ax2.plot(fz, 20 * np.log10(np.abs(Hbl(Omz))), color=c[1], lw=2.2)
    ax2.axhline(-3.0102999566, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax2.axvline(100.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax2.plot([100.0], [20 * np.log10(abs(Hpm(Om_c)))], "o", color=c[0], ms=7)
    ax2.plot([100.0], [20 * np.log10(abs(Hbl(Om_c)))], "o", color=c[1], ms=7)
    ax2.plot([f_true], [-3.0102999566], "o", color=c[0], ms=7)
    S.note(ax2, 105.0, -2.62, "its real corner, 103.47 Hz", mode)
    S.note(ax2, 80.6, -3.44, "-2.870 dB at the spec point: the matched pole is 0.14 dB shy", mode)
    S.note(ax2, 80.6, -3.62, "-3.010 dB exactly, from the prewarped bilinear design", mode)
    ax2.set_xlabel("frequency  (Hz), zoomed on the specification point")
    ax2.set_ylabel("magnitude  (dB)")
    ax2.set_title("The same two curves, 0.5 dB tall")
    ax2.set_ylim(-3.75, -2.25)
    S.strip(ax2)
    return fig


@figure("lin3-zt-notch")
def _(mode):
    """A 60 Hz notch at fs = 600 Hz with pole radius 0.95.

    The null depth, the DC and Nyquist gains and both half-power edges are
    measured from the response itself rather than quoted from a design rule.
    """
    c = S.SERIES[mode]
    fs, f0, r = 600.0, 60.0, 0.95
    Om0 = 2 * np.pi * f0 / fs
    b = np.array([1.0, -2 * np.cos(Om0), 1.0])
    aa = np.array([1.0, -2 * r * np.cos(Om0), r * r])
    assert abs(np.cos(Om0) - 0.8090169944) < 5e-10
    assert abs(b[1] + 1.6180339887) < 5e-10, b[1]
    assert abs(aa[1] + 1.5371322893) < 5e-10, aa[1]

    def H(Om):
        z = np.exp(1j * Om)
        return ((b[0] + b[1] / z + b[2] / z ** 2)
                / (aa[0] + aa[1] / z + aa[2] / z ** 2))

    g = 1.0 / abs(H(0.0))
    assert abs(g - 0.9565450850) < 5e-10, g
    assert abs(g * abs(H(Om0))) < 1e-12
    assert abs(g * abs(H(np.pi)) - 1.0061577338) < 5e-10

    def m(Om):
        return g * abs(H(Om))

    target = 1 / np.sqrt(2)
    lo, hi = Om0, Om0 * 2
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        lo, hi = (mid, hi) if m(mid) < target else (lo, mid)
    upper = 0.5 * (lo + hi)
    lo, hi = Om0, Om0 * 0.01
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        lo, hi = (mid, hi) if m(mid) < target else (lo, mid)
    lower = 0.5 * (lo + hi)
    f_lo, f_hi = lower * fs / (2 * np.pi), upper * fs / (2 * np.pi)
    assert abs(m(lower) - target) < 1e-9 and abs(m(upper) - target) < 1e-9
    assert abs(f_lo - 55.1573923) < 1e-5, f_lo
    assert abs(f_hi - 64.8413340) < 1e-5, f_hi

    f = np.linspace(0.2, 300.0, 6000)
    fig, ax = plt.subplots()
    ax.plot(f, m(2 * np.pi * f / fs), color=c[0], lw=2.2)
    ax.axhline(target, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([f_lo, f_hi], [target, target], "o", color=c[1], ms=7)
    S.note(ax, 3, target + 0.03, "half-power level", mode)
    S.note(ax, 78, 0.30,
           f"measured -3 dB edges {f_lo:.2f} Hz and {f_hi:.2f} Hz,\n"
           f"a width of {f_hi - f_lo:.2f} Hz around the 60 Hz null", mode)
    S.note(ax, 3, 0.06, "exact zero at 60 Hz:\nthe zeros sit ON the unit circle", mode)
    ax.set_xlabel("frequency  (Hz),  fs = 600 Hz")
    ax.set_ylabel("|H|")
    ax.set_title("A notch is a zero on the circle held apart from its pole")
    ax.set_xlim(0, 300)
    ax.set_ylim(0, 1.16)
    S.strip(ax)
    return fig


@figure("lin3-zt-notch-polezero")
def _(mode):
    """Pole-zero map of the same notch: zeros on the circle, poles just inside.

    The radial gap between zero and pole is what sets the notch width, and the
    numbers annotated here are the ones the response figure measures.
    """
    c = S.SERIES[mode]
    Om0 = 2 * np.pi * 60.0 / 600.0
    r = 0.95
    zeros = np.exp(1j * np.array([Om0, -Om0]))
    poles = r * zeros
    assert abs(abs(zeros[0]) - 1.0) < 1e-15
    assert abs(abs(poles[0]) - 0.95) < 1e-15
    assert abs(np.degrees(Om0) - 36.0) < 1e-12
    # the quadratic coefficients the lesson prints
    assert abs(-2 * np.cos(Om0) + 1.6180339887) < 5e-10
    assert abs(-2 * r * np.cos(Om0) + 1.5371322893) < 5e-10
    assert abs(r * r - 0.9025) < 1e-15

    fig, ax = plt.subplots(figsize=(5.8, 5.2))
    unit_circle(ax, mode, label=False)
    th = np.linspace(0, 2 * np.pi, 721)
    ax.plot(np.cos(th), np.sin(th), color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.plot(zeros.real, zeros.imag, "o", color=c[0], ms=9, mfc="none", mew=2.2)
    ax.plot(poles.real, poles.imag, "x", color=c[1], ms=11, mew=2.4)
    S.label_end(ax, zeros[0].real, zeros[0].imag, "zeros at 36 deg on the circle", c[0], mode, dx=-190, dy=16)
    S.label_end(ax, poles[0].real, poles[0].imag, "poles at radius 0.95", c[1], mode, dx=8, dy=-16)
    ax.plot([0, zeros[0].real], [0, zeros[0].imag], color=S.GRID[mode], lw=0.9)
    S.note(ax, -1.16, -0.62, "36 deg of one lap is 60 Hz\nwhen fs = 600 Hz", mode, size=9)
    S.note(ax, -1.16, -0.95, "gap 0.05 between zero and pole\nsets the 9.68 Hz notch width", mode, size=9)
    ax.set_xlabel("real part of z")
    ax.set_ylabel("imaginary part of z")
    ax.set_title("A notch, drawn")
    ax.set_xlim(-1.25, 1.25)
    ax.set_ylim(-1.25, 1.25)
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("lin3-zt-initial-condition")
def _(mode):
    """y[n] = 0.6 y[n-1] + u[n] with y[-1] = 5, split into its two parts.

    The total is run forward from the stated initial condition; the closed
    form 2.5 + 1.5(0.6)^n is asserted against it at every sample, and the
    zero-input and zero-state pieces are asserted to add back to it.
    """
    c = S.SERIES[mode]
    N = 16
    total = np.zeros(N)
    prev = 5.0
    for n in range(N):
        total[n] = 0.6 * prev + 1.0
        prev = total[n]
    closed = np.array([2.5 + 1.5 * 0.6 ** n for n in range(N)])
    zi = np.array([3.0 * 0.6 ** n for n in range(N)])
    zs = np.array([2.5 - 1.5 * 0.6 ** n for n in range(N)])
    assert np.max(np.abs(total - closed)) < 1e-12
    assert np.max(np.abs(zi + zs - closed)) < 1e-12
    assert abs(total[0] - 4.0) < 1e-15 and abs(total[1] - 3.4) < 1e-15
    assert abs(total[2] - 3.04) < 1e-15 and abs(total[3] - 2.824) < 1e-14
    assert abs(closed[-1] - 2.5) < 2e-3

    nn = np.arange(N)
    fig, ax = plt.subplots()
    ax.plot(nn, total, "o-", color=c[0], lw=1.9, ms=6)
    ax.plot(nn, zi, "s--", color=c[1], lw=1.6, ms=5)
    ax.plot(nn, zs, "^--", color=c[2], lw=1.6, ms=5)
    S.label_end(ax, 9, total[9], "total, from the recursion", c[0], mode, dy=12)
    S.label_end(ax, 5, zi[5], "zero-input: 3(0.6)^n", c[1], mode, dy=-14)
    S.label_end(ax, 9, zs[9], "zero-state: 2.5 - 1.5(0.6)^n", c[2], mode, dy=-16)
    ax.axhline(2.5, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 7.4, 2.56, "both roads end at the DC gain 1/(1-0.6) = 2.5", mode)
    S.note(ax, 4.4, 3.72, "y[-1] = 5 makes the total approach the steady\n"
                          "state from ABOVE; the zero-state response\n"
                          "climbs to the same place from below", mode)
    ax.set_xlabel("sample index  n")
    ax.set_ylabel("y[n]")
    ax.set_title("An initial condition is a second, decaying signal")
    ax.set_xlim(-0.6, 15.6)
    ax.set_ylim(0, 4.6)
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
        assert n.startswith("lin3-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
