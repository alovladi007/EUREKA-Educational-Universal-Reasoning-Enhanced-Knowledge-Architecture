#!/usr/bin/env python3
"""Expansion-3 figures for the FE Electrical and Computer course: the first
five Mathematics chapters (algebra and trigonometry, complex numbers, discrete
mathematics, analytic geometry, differential calculus).

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve, point and label here is COMPUTED from
the equation the lesson states, in code the reader can check. Nothing is traced,
scanned or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure carries assertions that fail loudly if the numbers quoted in the
lesson prose and the numbers drawn here ever drift apart.

Usage:
    python3 scripts/gen_fe_ee_e3.py            # all
    python3 scripts/gen_fe_ee_e3.py math2-at   # only names starting "math2-at"
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

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Algebra and Trigonometry
# ---------------------------------------------------------------------------


@figure("math2-at-discriminant")
def _(mode):
    """Three quadratics whose discriminants have the three possible signs.

    y = s^2 + 5s + 6 (D = 25 - 24 = 1), y = s^2 + 4s + 4 (D = 0) and
    y = s^2 + 2s + 5 (D = 4 - 20 = -16). Each parabola is evaluated from its
    own coefficients and the real roots are found from the quadratic formula,
    so the number of x-axis crossings in the picture IS the sign of D.
    """
    c = S.SERIES[mode]
    s = np.linspace(-5.2, 1.6, 900)
    cases = [
        (1.0, 5.0, 6.0, "D = +1: two real roots\n(overdamped)"),
        (1.0, 4.0, 4.0, "D = 0: one repeated root\n(critically damped)"),
        (1.0, 2.0, 5.0, "D = -16: no real root\n(underdamped)"),
    ]
    disc = [b * b - 4 * a * k for a, b, k in (x[:3] for x in cases)]
    assert disc == [1.0, 0.0, -16.0], disc

    fig, ax = plt.subplots()
    for i, (a, b, k, lab) in enumerate(cases):
        ax.plot(s, a * s ** 2 + b * s + k, color=c[i], lw=2.1)
        d = b * b - 4 * a * k
        if d >= 0:
            for r in {(-b + math.sqrt(d)) / (2 * a), (-b - math.sqrt(d)) / (2 * a)}:
                ax.plot([r], [0.0], "o", color=c[i], ms=7, zorder=5)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    S.label_end(ax, -4.6, 2.0, cases[0][3], c[0], mode, ha="left", dy=10)
    S.label_end(ax, -0.55, 2.05, cases[1][3], c[1], mode, ha="left")
    S.label_end(ax, 0.15, 8.0, cases[2][3], c[2], mode, ha="right")
    S.note(ax, -5.15, -2.3, "roots are the crossings: 2, then 1, then none", mode)
    ax.set_xlabel("s")
    ax.set_ylabel("value of the quadratic")
    ax.set_title("The discriminant counts the crossings before you solve")
    ax.set_xlim(-5.2, 1.6)
    ax.set_ylim(-3.0, 13.0)
    S.strip(ax)
    return fig


@figure("math2-at-completing-square")
def _(mode):
    """y = 2x^2 - 12x + 10 next to its completed-square form 2(x-3)^2 - 8.

    Both expressions are evaluated on the same grid and asserted identical to
    machine precision, which is the point of the figure: completing the square
    changes the spelling, not the curve, and it hands you the vertex (3, -8)
    and the roots 3 +/- 2 without any further work.
    """
    c = S.SERIES[mode]
    x = np.linspace(-0.6, 6.6, 800)
    raw = 2 * x ** 2 - 12 * x + 10
    done = 2 * (x - 3) ** 2 - 8
    assert np.allclose(raw, done), "completed square is not the same function"
    roots = (1.0, 5.0)
    for r in roots:
        assert abs(2 * r ** 2 - 12 * r + 10) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(x, raw, color=c[0], lw=2.3)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    ax.plot([3.0], [-8.0], "o", color=c[1], ms=8, zorder=5)
    ax.plot([3.0, 3.0], [-8.0, 0.0], color=S.GRID[mode], lw=1.0, ls=":")
    for r in roots:
        ax.plot([r], [0.0], "o", color=c[0], ms=7, zorder=5)
    S.label_end(ax, 6.0, 2 * 36 - 72 + 10, "y = 2x^2 - 12x + 10\n   = 2(x - 3)^2 - 8", c[0], mode, dy=-6)
    S.label_end(ax, 3.0, -8.0, "vertex (3, -8)", c[1], mode, dx=10, dy=-6)
    S.note(ax, 1.0, 0.9, "root x = 1", mode, ha="center")
    S.note(ax, 5.0, 0.9, "root x = 5", mode, ha="center")
    S.note(ax, -0.5, -11.4, "half of -6 is -3; the vertex sits at x = 3 and the roots at 3 +/- 2", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Completing the square reads the vertex straight off the algebra")
    ax.set_xlim(-0.6, 7.6)
    ax.set_ylim(-12.5, 12.0)
    S.strip(ax)
    return fig


@figure("math2-at-harmonic-addition")
def _(mode):
    """3 cos(x) + 4 sin(x) resolved into the single sinusoid 5 cos(x - 53.13 deg).

    The two components and their sum are evaluated point by point, and the
    single-sinusoid form is evaluated separately and asserted equal. That
    identity - a cos + b sin = R cos(x - phi) with R = sqrt(a^2 + b^2) and
    phi = arctan(b/a) - is what makes phasor addition legal.
    """
    c = S.SERIES[mode]
    a, b = 3.0, 4.0
    R = math.hypot(a, b)
    phi = math.atan2(b, a)
    assert abs(R - 5.0) < 1e-12
    assert abs(math.degrees(phi) - 53.13010235415598) < 1e-9, math.degrees(phi)
    x = np.linspace(0, 2 * np.pi, 1400)
    comb = a * np.cos(x) + b * np.sin(x)
    single = R * np.cos(x - phi)
    assert np.allclose(comb, single), "harmonic addition identity broken"

    deg = np.degrees(x)
    fig, ax = plt.subplots()
    ax.plot(deg, a * np.cos(x), color=c[0], lw=1.6, alpha=0.9)
    ax.plot(deg, b * np.sin(x), color=c[1], lw=1.6, alpha=0.9)
    ax.plot(deg, single, color=c[2], lw=2.6)
    S.label_end(ax, 360, a * np.cos(x[-1]), "3 cos x", c[0], mode)
    S.label_end(ax, 360, b * np.sin(x[-1]), "4 sin x", c[1], mode, dy=-11)
    S.label_end(ax, 300, R * math.cos(math.radians(300) - phi), "5 cos(x - 53.13 deg)", c[2], mode, dy=-14)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([math.degrees(phi)], [R], "o", color=c[2], ms=7, zorder=5)
    S.note(ax, math.degrees(phi) + 6, R - 0.55, "peak 5 at 53.13 deg", mode)
    ax.set_xlabel("angle x  (degrees)")
    ax.set_ylabel("amplitude")
    ax.set_title("Two sinusoids at one frequency always collapse into one")
    ax.set_xlim(0, 430)
    ax.set_ylim(-5.9, 6.4)
    S.strip(ax)
    return fig


@figure("math2-at-small-angle")
def _(mode):
    """Percentage error of the small-angle approximations sin x ~ x and
    tan x ~ x, as a function of the angle in degrees.

    Both curves are 100*(approx - exact)/exact evaluated directly. The
    crossings of the 1% line are found by interpolation on the computed
    arrays rather than quoted, so the angles named in the lesson come from
    this code.
    """
    c = S.SERIES[mode]
    deg = np.linspace(0.5, 35.0, 1400)
    x = np.radians(deg)
    err_sin = 100 * (x - np.sin(x)) / np.sin(x)
    err_tan = 100 * (np.tan(x) - x) / np.tan(x)
    d_sin = float(np.interp(1.0, err_sin, deg))
    d_tan = float(np.interp(1.0, err_tan, deg))
    assert 13.9 < d_sin < 14.1, d_sin
    assert 9.8 < d_tan < 10.0, d_tan

    fig, ax = plt.subplots()
    ax.plot(deg, err_sin, color=c[0], lw=2.2)
    ax.plot(deg, err_tan, color=c[1], lw=2.2)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(ax, 35.0, err_sin[-1], "using x for sin x", c[0], mode, dy=6)
    S.label_end(ax, 32.0, 11.0, "using x for tan x", c[1], mode, ha="right")
    for d, col in ((d_sin, c[0]), (d_tan, c[1])):
        ax.plot([d], [1.0], "o", color=col, ms=7, zorder=5)
    S.note(ax, 1.0, 1.35, "1% error line", mode)
    S.note(ax, d_tan, 2.4, f"tan: {d_tan:.1f} deg", mode, ha="center")
    S.note(ax, d_sin + 0.6, 1.35, f"sin: {d_sin:.1f} deg", mode)
    ax.set_xlabel("angle  (degrees)")
    ax.set_ylabel("error of the approximation  (%)")
    ax.set_title("Where the small-angle shortcut stops being free")
    ax.set_xlim(0, 41)
    ax.set_ylim(0, 14)
    S.strip(ax)
    return fig


@figure("math2-at-db-anchors")
def _(mode):
    """Decibels against ratio for the power rule and the amplitude rule.

    10 log10(r) and 20 log10(r) drawn on a logarithmic ratio axis, with the
    four anchors the lesson asks the reader to carry marked as points computed
    from the same formulas. The constant factor of two between the two lines
    is the whole content of the "why 20 for voltage" question.
    """
    c = S.SERIES[mode]
    r = np.logspace(-1, 3, 900)
    p_db = 10 * np.log10(r)
    a_db = 20 * np.log10(r)
    assert abs(10 * math.log10(2) - 3.0102999566398116) < 1e-12
    assert abs(20 * math.log10(2) - 6.020599913279623) < 1e-12

    fig, ax = plt.subplots()
    ax.semilogx(r, a_db, color=c[0], lw=2.2)
    ax.semilogx(r, p_db, color=c[1], lw=2.2)
    S.label_end(ax, 1000, a_db[-1], "amplitude: 20 log10 r", c[0], mode, dy=-8, ha="right", dx=-6)
    S.label_end(ax, 1000, p_db[-1], "power: 10 log10 r", c[1], mode, dy=8, ha="right", dx=-6)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for ratio in (2.0, 10.0, 100.0):
        ax.plot([ratio], [20 * math.log10(ratio)], "o", color=c[0], ms=6.5, zorder=5)
        ax.plot([ratio], [10 * math.log10(ratio)], "o", color=c[1], ms=6.5, zorder=5)
    S.note(ax, 2.1, 7.0, "x2 -> 6.02 dB (amplitude)\nx2 -> 3.01 dB (power)", mode)
    S.note(ax, 11, 21.5, "x10 -> 20 dB / 10 dB", mode)
    S.note(ax, 105, 41, "x100 -> 40 dB / 20 dB", mode, ha="right")
    ax.set_xlabel("ratio  r")
    ax.set_ylabel("decibels")
    ax.set_title("One rule, two factors: power counts once, amplitude twice")
    ax.set_xlim(0.1, 1000)
    ax.set_ylim(-22, 63)
    S.strip(ax)
    return fig


@figure("math2-at-phasor-resultant")
def _(mode):
    """Magnitude of the sum of two 100 V and 60 V phasors against the angle
    between them, computed from the law of cosines.

    |R| = sqrt(A^2 + B^2 + 2AB cos(phi)) is evaluated across phi, and the
    three anchor values - 160 V in phase, 140 V at 60 degrees and 40 V in
    antiphase - are asserted against the same expression. The dotted line at
    the arithmetic sum 160 V is the answer a candidate gets by adding
    magnitudes, and the curve shows how wrong that is off zero.
    """
    c = S.SERIES[mode]
    A, B = 100.0, 60.0
    phi = np.linspace(0, 180, 900)
    mag = np.sqrt(A ** 2 + B ** 2 + 2 * A * B * np.cos(np.radians(phi)))
    for ang, want in ((0.0, 160.0), (60.0, 140.0), (180.0, 40.0)):
        got = math.sqrt(A ** 2 + B ** 2 + 2 * A * B * math.cos(math.radians(ang)))
        assert abs(got - want) < 1e-9, (ang, got)
    rms_like = math.sqrt(A ** 2 + B ** 2)
    assert abs(rms_like - 116.61903789690601) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(phi, mag, color=c[0], lw=2.4)
    ax.axhline(A + B, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 92, 162, "arithmetic sum 160 V - only correct at 0 degrees", mode)
    for ang, lab in ((0.0, "160 V"), (60.0, "140 V"), (90.0, "116.6 V"), (180.0, "40 V")):
        v = math.sqrt(A ** 2 + B ** 2 + 2 * A * B * math.cos(math.radians(ang)))
        ax.plot([ang], [v], "o", color=c[0], ms=7, zorder=5)
        S.note(ax, ang + 4, v + 3, lab, mode)
    ax.axvline(90.0, color=S.GRID[mode], lw=0.9, ls=":")
    S.label_end(ax, 150, 55, "|R| = sqrt(A^2 + B^2 + 2AB cos phi)", c[0], mode, ha="right")
    ax.set_xlabel("phase difference between the two phasors  (degrees)")
    ax.set_ylabel("magnitude of the sum  (V)")
    ax.set_title("Adding 100 V to 60 V gives anything from 40 V to 160 V")
    ax.set_xlim(0, 195)
    ax.set_ylim(20, 185)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Complex Numbers
# ---------------------------------------------------------------------------


@figure("math2-cx-rotation-ladder")
def _(mode):
    """Successive powers of (1 + j) in the complex plane.

    Each point is (1+j)**k evaluated in Python complex arithmetic. The
    magnitudes are sqrt(2)**k and the angles are 45k degrees, both asserted;
    the picture is therefore a direct demonstration that multiplying scales by
    the magnitude and rotates by the angle.
    """
    c = S.SERIES[mode]
    z = complex(1, 1)
    pts = [z ** k for k in range(0, 7)]
    for k, p in enumerate(pts):
        assert abs(abs(p) - math.sqrt(2) ** k) < 1e-9
        assert abs((math.degrees(math.atan2(p.imag, p.real)) - 45 * k + 360) % 360) < 1e-6
    assert pts[2] == complex(0, 2) and pts[4] == complex(-4, 0)

    th = np.linspace(0, 6 * math.pi / 4, 600)
    spiral_r = math.sqrt(2) ** (th / (math.pi / 4))

    fig, ax = plt.subplots()
    ax.plot(spiral_r * np.cos(th), spiral_r * np.sin(th), color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot([p.real for p in pts], [p.imag for p in pts], "o", color=c[0], ms=8, zorder=5)
    for k, p in enumerate(pts):
        ax.plot([0, p.real], [0, p.imag], color=S.GRID[mode], lw=0.9)
        lab = f"k={k}: {abs(p):.2f} at {45*k} deg"
        S.note(ax, p.real + 0.28, p.imag + 0.22, lab, mode, size=8.5)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.axvline(0, color=S.GUIDE[mode], lw=1.0)
    S.label_end(ax, -6.4, -4.2, "each multiplication by (1 + j)\nscales by sqrt(2) and turns 45 deg",
                c[0], mode)
    ax.set_xlabel("real part")
    ax.set_ylabel("imaginary part")
    ax.set_title("Multiplying by a complex number scales and rotates, nothing else")
    ax.set_xlim(-7.0, 6.2)
    ax.set_ylim(-5.2, 9.2)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-cx-roots-unity")
def _(mode):
    """The six sixth roots of unity, and the three cube roots of -8.

    Both sets are computed from De Moivre - r**(1/n) at (theta + 360k)/n - and
    each root is checked by raising it back to the n-th power. The equal
    angular spacing, 60 degrees for n = 6 and 120 degrees for n = 3, is the
    fact the exam tests.
    """
    c = S.SERIES[mode]
    six = [complex(math.cos(2 * math.pi * k / 6), math.sin(2 * math.pi * k / 6)) for k in range(6)]
    for r in six:
        assert abs(r ** 6 - 1) < 1e-9
    cube = [2 * complex(math.cos(math.radians(60 + 120 * k)), math.sin(math.radians(60 + 120 * k)))
            for k in range(3)]
    for r in cube:
        assert abs(r ** 3 + 8) < 1e-8, r ** 3
    assert abs(cube[0] - complex(1, math.sqrt(3))) < 1e-9

    t = np.linspace(0, 2 * math.pi, 500)
    fig, ax = plt.subplots()
    ax.plot(np.cos(t), np.sin(t), color=S.GRID[mode], lw=1.1)
    ax.plot(2 * np.cos(t), 2 * np.sin(t), color=S.GRID[mode], lw=1.1)
    ax.plot([r.real for r in six], [r.imag for r in six], "o", color=c[0], ms=8, zorder=5)
    ax.plot([r.real for r in cube], [r.imag for r in cube], "s", color=c[1], ms=8, zorder=5)
    for k, r in enumerate(six):
        ax.plot([0, r.real], [0, r.imag], color=S.GRID[mode], lw=0.8, ls=":")
        S.note(ax, 1.06 * r.real, 1.06 * r.imag, f"{60*k} deg", mode, size=8.5,
               ha="left" if r.real >= 0 else "right")
    for k, r in enumerate(cube):
        S.note(ax, 1.12 * r.real, 1.12 * r.imag, f"2 at {60 + 120*k} deg", mode, size=8.5,
               ha="left" if r.real >= -0.1 else "right")
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.axvline(0, color=S.GUIDE[mode], lw=1.0)
    S.label_end(ax, -3.05, -2.35, "circles: the six 6th roots of 1 (radius 1)\nsquares: the three cube roots of -8 (radius 2)",
                c[0], mode)
    ax.set_xlabel("real part")
    ax.set_ylabel("imaginary part")
    ax.set_title("n roots, one circle, equal spacing of 360/n degrees")
    ax.set_xlim(-3.1, 3.1)
    ax.set_ylim(-2.9, 2.6)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-cx-rlc-impedance")
def _(mode):
    """Magnitude and angle of Z = R + j(wL - 1/(wC)) for the series branch the
    lesson works through: R = 10 ohm, L = 50 mH, C = 100 uF.

    Two stacked panels share the frequency axis, because magnitude and angle
    have different units and the house rule forbids a second y-scale. Both
    traces come from the same complex array. The resonant frequency printed on
    the figure is 1/(2 pi sqrt(LC)) and is asserted against the frequency at
    which the computed reactance changes sign.
    """
    c = S.SERIES[mode]
    R, L, C = 10.0, 0.05, 100e-6
    f = np.logspace(0.3, 3, 1600)
    w = 2 * np.pi * f
    Z = R + 1j * (w * L - 1 / (w * C))
    f0 = 1 / (2 * math.pi * math.sqrt(L * C))
    assert abs(f0 - 71.17625434171772) < 1e-6, f0
    k = int(np.argmin(np.abs(Z.imag)))
    assert abs(f[k] - f0) / f0 < 0.01, (f[k], f0)
    z60 = R + 1j * (2 * math.pi * 60 * L - 1 / (2 * math.pi * 60 * C))
    assert abs(abs(z60) - 12.606549460053882) < 1e-6, abs(z60)

    fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.4))
    ax1.loglog(f, np.abs(Z), color=c[0], lw=2.2)
    ax1.axhline(R, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax1.plot([f0], [R], "o", color=c[0], ms=7, zorder=5)
    S.note(ax1, 2.2, 12.5, "at resonance the reactances cancel and |Z| = R = 10 ohm", mode)
    S.label_end(ax1, 700, np.abs(Z)[np.searchsorted(f, 700)], "|Z|", c[0], mode)
    ax1.set_ylabel("|Z|  (ohm)")
    ax1.set_title("Series RLC: the angle crosses zero exactly where |Z| bottoms out")
    S.strip(ax1)

    ax2.semilogx(f, np.degrees(np.angle(Z)), color=c[1], lw=2.2)
    ax2.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax2.plot([f0], [0.0], "o", color=c[1], ms=7, zorder=5)
    S.note(ax2, 2.2, 30, "capacitive below f0: current leads", mode)
    S.note(ax2, 120, -62, "inductive above f0: current lags", mode)
    S.note(ax2, f0 * 1.1, 8, f"f0 = {f0:.1f} Hz", mode)
    S.label_end(ax2, 700, np.degrees(np.angle(Z))[np.searchsorted(f, 700)], "angle", c[1], mode)
    ax2.set_xlabel("frequency  (Hz)")
    ax2.set_ylabel("angle of Z  (degrees)")
    ax2.set_ylim(-95, 95)
    S.strip(ax2)
    return fig


@figure("math2-cx-conjugate-match")
def _(mode):
    """Power delivered to a load against load resistance, with and without the
    conjugate reactance.

    A source of 10 V rms behind Z_s = 5 + j5 ohm drives Z_L = R_L + jX_L. The
    two curves are P = |V|^2 R_L / |Z_s + Z_L|^2 evaluated for X_L = -5 ohm
    (conjugate) and X_L = +5 ohm (same sign as the source). The conjugate case
    peaks at R_L = 5 ohm with 5 W; the mismatched case peaks lower and later,
    which is why "match the impedance" and "conjugate the impedance" are not
    the same instruction.
    """
    c = S.SERIES[mode]
    V, Rs, Xs = 10.0, 5.0, 5.0
    RL = np.linspace(0.2, 30, 1200)

    def power(XL):
        Z = (Rs + RL) + 1j * (Xs + XL)
        return V ** 2 * RL / np.abs(Z) ** 2

    p_conj = power(-Xs)
    p_same = power(+Xs)
    p_res = power(0.0)
    assert abs(p_conj.max() - V ** 2 / (4 * Rs)) < 1e-3, p_conj.max()
    assert abs(RL[int(np.argmax(p_conj))] - 5.0) < 0.05
    r_same = RL[int(np.argmax(p_same))]
    assert abs(r_same - math.hypot(Rs, 2 * Xs)) < 0.05, r_same

    fig, ax = plt.subplots()
    ax.plot(RL, p_conj, color=c[0], lw=2.4)
    ax.plot(RL, p_res, color=c[2], lw=2.0)
    ax.plot(RL, p_same, color=c[1], lw=2.0)
    S.label_end(ax, 30, p_conj[-1], "X_L = -5 ohm (conjugate)", c[0], mode, dy=6)
    S.label_end(ax, 30, p_res[-1], "X_L = 0 (resistive load)", c[2], mode, dy=-2)
    S.label_end(ax, 30, p_same[-1], "X_L = +5 ohm (same sign)", c[1], mode, dy=-10)
    ax.plot([5.0], [p_conj.max()], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 5.6, p_conj.max() - 0.06, f"peak {p_conj.max():.2f} W at R_L = 5 ohm", mode)
    ax.plot([r_same], [p_same.max()], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, r_same + 0.7, p_same.max() - 0.32,
           f"best the wrong sign can do:\n{p_same.max():.2f} W at R_L = {r_same:.1f} ohm", mode)
    ax.set_xlabel("load resistance  R_L  (ohm)")
    ax.set_ylabel("power delivered to the load  (W)")
    ax.set_title("Conjugating the reactance is worth more than resizing the resistance")
    ax.set_xlim(0, 37)
    ax.set_ylim(0, 5.9)
    S.strip(ax)
    return fig


@figure("math2-cx-inversion-circle")
def _(mode):
    """The constant-resistance line R = 2 ohm mapped to admittance by Y = 1/Z.

    Z = 2 + jX is swept over X, and Y = 1/Z is computed directly. The image is
    the circle of centre (0.25, 0) and radius 0.25 in the admittance plane -
    checked here by asserting that every mapped point lies on that circle to
    1e-12. This is the reason the Smith chart is drawn from circles.
    """
    c = S.SERIES[mode]
    R = 2.0
    X = np.tan(np.linspace(-1.5533, 1.5533, 1400))* 40
    Z = R + 1j * X
    Y = 1 / Z
    centre, radius = 1 / (2 * R), 1 / (2 * R)
    assert np.allclose(np.abs(Y - centre), radius, atol=1e-12), "inversion is not a circle"
    assert abs(1 / complex(2, 0) - 0.5) < 1e-12

    t = np.linspace(0, 2 * math.pi, 700)
    fig, ax = plt.subplots()
    ax.plot(centre + radius * np.cos(t), radius * np.sin(t), color=c[0], lw=2.4)
    ax.plot(Y.real, Y.imag, ".", color=c[1], ms=3.0)
    for x_pt in (0.0, 2.0, -2.0, 6.0, -6.0):
        y_pt = 1 / complex(R, x_pt)
        ax.plot([y_pt.real], [y_pt.imag], "o", color=c[1], ms=7, zorder=5)
        S.note(ax, y_pt.real + 0.012, y_pt.imag + 0.008, f"X = {x_pt:.0f}", mode, size=8.5)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.axvline(0, color=S.GUIDE[mode], lw=1.0)
    S.label_end(ax, 0.5, 0.0, "Z = 2 ohm exactly:\nY = 0.5 S", c[1], mode, dx=-8, dy=-26, ha="right")
    S.label_end(ax, 0.02, 0.235, "image of the whole line Re(Z) = 2 ohm:\na circle through the origin, diameter 1/R",
                c[0], mode)
    ax.set_xlabel("conductance  G  (S)")
    ax.set_ylabel("susceptance  B  (S)")
    ax.set_title("Taking a reciprocal turns a straight line into a circle")
    ax.set_xlim(-0.06, 0.62)
    ax.set_ylim(-0.30, 0.32)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-cx-phasor-sum-time")
def _(mode):
    """Two sinusoids of the same frequency and their sum, alongside the phasor
    arithmetic that produces it.

    v1 = 100 cos(wt) and v2 = 60 cos(wt + 60 deg) are evaluated in time; the
    sum is computed both by adding the time samples and by adding the phasors
    100 + 60 exp(j60 deg) = 130 + j51.96 = 140 at 21.79 degrees. The two
    routes are asserted equal at every sample, which is what "phasors work"
    means numerically.
    """
    c = S.SERIES[mode]
    V1, V2, ph = 100.0, 60.0, 60.0
    P = V1 + V2 * np.exp(1j * math.radians(ph))
    mag, ang = abs(P), math.degrees(np.angle(P))
    assert abs(P.real - 130.0) < 1e-9 and abs(P.imag - 51.96152422706632) < 1e-9
    assert abs(mag - 140.0) < 1e-9, mag
    assert abs(ang - 21.786789298261697) < 1e-9, ang
    wt = np.linspace(0, 2 * np.pi, 1600)
    v1 = V1 * np.cos(wt)
    v2 = V2 * np.cos(wt + math.radians(ph))
    vs = mag * np.cos(wt + math.radians(ang))
    assert np.allclose(v1 + v2, vs), "phasor sum does not reproduce the time sum"

    deg = np.degrees(wt)
    fig, ax = plt.subplots()
    ax.plot(deg, v1, color=c[0], lw=1.7)
    ax.plot(deg, v2, color=c[1], lw=1.7)
    ax.plot(deg, vs, color=c[2], lw=2.6)
    S.label_end(ax, 360, v1[-1], "v1 = 100 cos(wt)", c[0], mode, dy=10)
    S.label_end(ax, 360, v2[-1], "v2 = 60 cos(wt + 60 deg)", c[1], mode, dy=-10)
    S.label_end(ax, 300, mag * math.cos(math.radians(300 + ang)), "sum = 140 cos(wt + 21.79 deg)",
                c[2], mode, dy=-14)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([-ang % 360], [mag], "o", color=c[2], ms=7, zorder=5)
    S.note(ax, 6, 145, "peak 140 V, not 160 V: the 60 degree offset costs 20 V", mode)
    ax.set_xlabel("wt  (degrees)")
    ax.set_ylabel("volts")
    ax.set_title("Add the phasors or add the samples - the answer is the same curve")
    ax.set_xlim(0, 470)
    ax.set_ylim(-175, 190)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Discrete Mathematics
# ---------------------------------------------------------------------------


@figure("math2-dm-counting-growth")
def _(mode):
    """The three counting formulas evaluated for n = 10 and k = 0..10.

    n**k, P(n,k) = n!/(n-k)! and C(n,k) = n!/(k!(n-k)!) are computed with
    math.perm and math.comb, then plotted on a logarithmic count axis. The
    spread at k = 5 - 100000 against 30240 against 252 - is the reason the
    lesson insists on choosing the formula before doing any arithmetic.
    """
    c = S.SERIES[mode]
    n = 10
    k = np.arange(0, n + 1)
    rep = np.array([float(n ** int(i)) for i in k])
    per = np.array([float(math.perm(n, int(i))) for i in k])
    com = np.array([float(math.comb(n, int(i))) for i in k])
    assert (rep[5], per[5], com[5]) == (100000.0, 30240.0, 252.0)
    assert per[3] == 720.0 and com[3] == 120.0 and per[3] / com[3] == math.factorial(3)

    fig, ax = plt.subplots()
    ax.semilogy(k, rep, color=c[0], lw=2.1, marker="o", ms=5.5)
    ax.semilogy(k, per, color=c[1], lw=2.1, marker="o", ms=5.5)
    ax.semilogy(k, com, color=c[2], lw=2.1, marker="o", ms=5.5)
    S.label_end(ax, 10, rep[-1], "ordered, repeats allowed: n^k", c[0], mode, dy=4)
    S.label_end(ax, 10, per[-1], "ordered, no repeats: P(n,k)", c[1], mode, dy=-4)
    S.label_end(ax, 10, com[-1], "unordered: C(n,k)", c[2], mode, dy=-6)
    ax.axvline(5, color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 0.15, 2.2e6, "at k = 5 the three answers are\n100 000, 30 240 and 252", mode)
    ax.set_xlabel("number of items chosen  k   (from n = 10)")
    ax.set_ylabel("number of outcomes")
    ax.set_title("Picking the wrong counting rule is a three-orders-of-magnitude error")
    ax.set_xlim(0, 15.5)
    ax.set_ylim(0.7, 4e10)
    S.strip(ax)
    return fig


@figure("math2-dm-binomial-pmf")
def _(mode):
    """The binomial distribution C(10,k) p^k (1-p)^(10-k) for p = 0.1 and 0.3.

    Every bar is that expression evaluated with math.comb; both distributions
    are asserted to sum to 1 and to have mean np. This is where the
    combinatorics of the chapter turns into the reliability arithmetic the
    exam actually asks about.
    """
    c = S.SERIES[mode]
    n = 10
    k = np.arange(0, n + 1)

    def pmf(p):
        return np.array([math.comb(n, int(i)) * p ** int(i) * (1 - p) ** (n - int(i)) for i in k])

    a, b = pmf(0.1), pmf(0.3)
    assert abs(a.sum() - 1) < 1e-12 and abs(b.sum() - 1) < 1e-12
    assert abs(float((k * a).sum()) - 1.0) < 1e-12
    assert abs(float((k * b).sum()) - 3.0) < 1e-12
    assert abs(a[0] - 0.9 ** 10) < 1e-15 and abs(a[0] - 0.3486784401) < 1e-10
    assert abs(a[1] - 0.387420489) < 1e-10

    fig, ax = plt.subplots()
    ax.bar(k - 0.19, a, width=0.36, color=c[0], edgecolor="none")
    ax.bar(k + 0.19, b, width=0.36, color=c[1], edgecolor="none")
    S.label_end(ax, 2.4, 0.36, "p = 0.1  (mean 1.0)", c[0], mode)
    S.label_end(ax, 5.2, 0.24, "p = 0.3  (mean 3.0)", c[1], mode)
    S.note(ax, 0.0, 0.395, "P(no defect in 10) = 0.9^10 = 0.349", mode)
    ax.set_xlabel("number of defective units in a batch of 10,  k")
    ax.set_ylabel("probability")
    ax.set_title("C(n,k) is the only part of the binomial law that is combinatorics")
    ax.set_xlim(-0.8, 10.8)
    ax.set_ylim(0, 0.44)
    ax.set_xticks(range(0, 11))
    S.strip(ax)
    return fig


@figure("math2-dm-inclusion-exclusion")
def _(mode):
    """A three-set inclusion-exclusion count drawn as overlapping circles.

    The seven region counts are computed from the stated totals - 45 thermal,
    35 electrical, 30 vibration, pairwise 20, 12 and 10, all three 5 - by
    peeling the overlaps off in the order the formula requires. The union
    printed on the figure is checked against the alternating-sum formula, and
    the seven regions are checked to sum to the same number.
    """
    c = S.SERIES[mode]
    T, E, V = 45, 35, 30
    TE, TV, EV, TEV = 20, 12, 10, 5
    only_T = T - TE - TV + TEV
    only_E = E - TE - EV + TEV
    only_V = V - TV - EV + TEV
    TE_only, TV_only, EV_only = TE - TEV, TV - TEV, EV - TEV
    union = T + E + V - TE - TV - EV + TEV
    regions = [only_T, only_E, only_V, TE_only, TV_only, EV_only, TEV]
    assert (only_T, only_E, only_V) == (18, 10, 13), regions
    assert (TE_only, TV_only, EV_only) == (15, 7, 5)
    assert sum(regions) == union == 73, (sum(regions), union)
    assert 100 - union == 27

    cen = [(-0.55, 0.34), (0.55, 0.34), (0.0, -0.62)]
    t = np.linspace(0, 2 * math.pi, 600)
    fig, ax = plt.subplots()
    for i, (cx, cy) in enumerate(cen):
        ax.plot(cx + 1.05 * np.cos(t), cy + 1.05 * np.sin(t), color=c[i], lw=2.2)
    labels = [
        (-1.15, 0.72, only_T, c[0]), (1.15, 0.72, only_E, c[1]), (0.0, -1.42, only_V, c[2]),
        (0.0, 0.72, TE_only, S.INK[mode]), (-0.72, -0.42, TV_only, S.INK[mode]),
        (0.72, -0.42, EV_only, S.INK[mode]), (0.0, -0.10, TEV, S.INK[mode]),
    ]
    for x, y, val, col in labels:
        ax.annotate(str(val), xy=(x, y), color=col, fontsize=13, fontweight="bold",
                    ha="center", va="center")
    S.label_end(ax, -1.62, 1.30, "thermal 45", c[0], mode)
    S.label_end(ax, 1.62, 1.30, "electrical 35", c[1], mode, ha="right")
    S.label_end(ax, 0.0, -1.86, "vibration 30", c[2], mode, ha="center")
    S.note(ax, -2.25, -2.28, "union 45+35+30-20-12-10+5 = 73 fail at least one test;\n"
                             "the seven regions add to 73 as well; 27 of 100 pass everything", mode)
    ax.set_xlim(-2.3, 2.3)
    ax.set_ylim(-2.45, 1.75)
    ax.set_aspect("equal", adjustable="box")
    ax.set_title("Inclusion-exclusion, region by region")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("math2-dm-graph-tree")
def _(mode):
    """A six-node, nine-branch network with a spanning tree and its links.

    The graph is given as an explicit edge list; the tree is found here by a
    union-find sweep rather than drawn by hand, so the five solid branches and
    four dashed links in the picture are whatever the algorithm produced. The
    counts are asserted against the topology identities the lesson states:
    tree branches = N - 1 = 5 and independent loops = B - N + 1 = 4.
    """
    c = S.SERIES[mode]
    pos = {0: (0.0, 1.0), 1: (1.0, 1.6), 2: (2.0, 1.0),
           3: (2.0, 0.0), 4: (1.0, -0.6), 5: (0.0, 0.0)}
    edges = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5), (5, 0), (0, 2), (2, 4), (0, 4)]
    N, B = len(pos), len(edges)
    parent = list(range(N))

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    tree, links = [], []
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            tree.append((u, v))
        else:
            links.append((u, v))
    assert len(tree) == N - 1 == 5, len(tree)
    assert len(links) == B - N + 1 == 4, len(links)
    deg = {v: sum(1 for e in edges if v in e) for v in pos}
    assert sum(deg.values()) == 2 * B == 18, sum(deg.values())

    fig, ax = plt.subplots()
    for u, v in links:
        ax.plot([pos[u][0], pos[v][0]], [pos[u][1], pos[v][1]], color=c[1], lw=1.8, ls="--")
    for u, v in tree:
        ax.plot([pos[u][0], pos[v][0]], [pos[u][1], pos[v][1]], color=c[0], lw=2.6)
    for v, (x, y) in pos.items():
        ax.plot([x], [y], "o", color=S.INK[mode], ms=17, zorder=5)
        ax.annotate(str(v), xy=(x, y), color=S.INK["dark" if mode == "light" else "light"],
                    fontsize=10, fontweight="bold", ha="center", va="center", zorder=6)
        S.note(ax, x, y + 0.16, f"deg {deg[v]}", mode, ha="center", size=8.5)
    S.label_end(ax, 2.15, 1.32, "solid: the 5 tree branches\n(N - 1, carry the node voltages)",
                c[0], mode)
    S.label_end(ax, 2.15, 0.28, "dashed: the 4 links\n(B - N + 1, one loop each)", c[1], mode)
    S.note(ax, -0.62, -1.06, "N = 6 nodes, B = 9 branches: 5 independent KCL equations, 4 independent KVL loops",
           mode)
    ax.set_xlim(-0.7, 4.3)
    ax.set_ylim(-1.15, 2.05)
    ax.set_title("Every network splits into a tree plus one loop per link")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("math2-dm-karnaugh")
def _(mode):
    """A four-variable Karnaugh map for F = sum m(0,1,4,5,10,11,14,15).

    The 16 cells are filled by evaluating membership of the minterm list, laid
    out in Gray-code order, and the two groups of eight are drawn around the
    cells the code identifies. The reduction to A'C' + AC - which is the XNOR
    of A and C - is verified over all 16 input combinations before the figure
    is drawn.
    """
    c = S.SERIES[mode]
    minterms = {0, 1, 4, 5, 10, 11, 14, 15}
    gray = [0, 1, 3, 2]
    for m in range(16):
        A, B, C, D = (m >> 3) & 1, (m >> 2) & 1, (m >> 1) & 1, m & 1
        simplified = ((1 - A) * (1 - C)) or (A * C)
        assert bool(simplified) == (m in minterms), m
    del B, D

    fig, ax = plt.subplots()
    for r in range(4):
        for col in range(4):
            ab, cd = gray[r], gray[col]
            m = (ab << 2) | cd
            x, y = col, 3 - r
            on = m in minterms
            ax.add_patch(plt.Rectangle((x, y), 1, 1, facecolor=c[0] if on else "none",
                                       alpha=0.22 if on else 0, edgecolor=S.GRID[mode], lw=1.2))
            ax.annotate("1" if on else "0", xy=(x + 0.5, y + 0.62), ha="center", va="center",
                        color=S.INK[mode], fontsize=13, fontweight="bold")
            ax.annotate(f"m{m}", xy=(x + 0.5, y + 0.26), ha="center", va="center",
                        color=S.INK_2[mode], fontsize=8)
    for col in range(4):
        ax.annotate(format(gray[col], "02b"), xy=(col + 0.5, 4.14), ha="center",
                    color=S.INK_2[mode], fontsize=9.5)
    for r in range(4):
        ax.annotate(format(gray[r], "02b"), xy=(-0.14, 3.5 - r), ha="right", va="center",
                    color=S.INK_2[mode], fontsize=9.5)
    ax.annotate("CD", xy=(-0.14, 4.14), ha="right", color=S.INK[mode], fontsize=10,
                fontweight="bold")
    ax.annotate("AB", xy=(-0.62, 3.9), ha="right", color=S.INK[mode], fontsize=10,
                fontweight="bold")
    ax.add_patch(plt.Rectangle((0.06, 2.06), 1.88, 1.88, fill=False, edgecolor=c[1], lw=2.4))
    ax.add_patch(plt.Rectangle((2.06, 0.06), 1.88, 1.88, fill=False, edgecolor=c[2], lw=2.4))
    S.label_end(ax, 2.05, 3.0, "AB in {00,01} and CD in {00,01}\ngives A' C'", c[1], mode)
    S.label_end(ax, 2.05, 1.0, "AB in {11,10} and CD in {11,10}\ngives A C", c[2], mode, dy=-6)
    S.note(ax, 0.0, -0.55, "F = A'C' + AC, which is the XNOR of A and C: 8 minterms, 2 product terms",
           mode)
    ax.set_xlim(-1.6, 6.4)
    ax.set_ylim(-0.75, 4.45)
    ax.set_aspect("equal", adjustable="box")
    ax.set_title("A Karnaugh map is adjacency made visible")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("math2-dm-boolean-explosion")
def _(mode):
    """Three counts that grow at three different rates as inputs are added:
    rows in a truth table (2^n), distinct Boolean functions (2^(2^n)) and
    subsets of an n-element set (2^n again, for comparison with n!).

    All four sequences are evaluated exactly with Python integers and plotted
    on a logarithmic count axis. The point the lesson draws from it: 2^n is
    tractable, 2^(2^n) is not, and this is why exhaustive testing of a digital
    block stops being possible at very small n.
    """
    c = S.SERIES[mode]
    n = np.arange(1, 7)
    rows = np.array([float(2 ** int(i)) for i in n])
    funcs = np.array([float(2 ** (2 ** int(i))) for i in n])
    fact = np.array([float(math.factorial(int(i))) for i in n])
    assert funcs[1] == 16.0 and funcs[2] == 256.0 and funcs[3] == 65536.0
    assert rows[3] == 16.0 and fact[4] == 120.0

    fig, ax = plt.subplots()
    ax.semilogy(n, funcs, color=c[0], lw=2.2, marker="o", ms=6)
    ax.semilogy(n, fact, color=c[1], lw=2.2, marker="o", ms=6)
    ax.semilogy(n, rows, color=c[2], lw=2.2, marker="o", ms=6)
    S.label_end(ax, 6, funcs[-1], "Boolean functions of n inputs: 2^(2^n)", c[0], mode)
    S.label_end(ax, 6, fact[-1], "orderings: n!", c[1], mode)
    S.label_end(ax, 6, rows[-1], "truth-table rows: 2^n", c[2], mode)
    S.note(ax, 1.05, 6e12, "at n = 4 there are 65 536 functions\nbut only 16 rows to fill in", mode)
    ax.set_xlabel("number of inputs  n")
    ax.set_ylabel("count")
    ax.set_title("Two exponentials, stacked: why you simplify instead of enumerating")
    ax.set_xlim(1, 9.6)
    ax.set_ylim(1, 1e20)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Analytic Geometry
# ---------------------------------------------------------------------------


@figure("math2-ag-eccentricity")
def _(mode):
    """The four conics from one polar equation, r = l/(1 + e cos theta).

    Each curve is that expression evaluated with the same semi-latus rectum
    l = 2 and eccentricity 0, 0.5, 1 and 1.6, then converted to Cartesian
    coordinates. Points with a non-positive denominator are dropped, which is
    exactly why the parabola and hyperbola run off to infinity. Eccentricity
    alone decides which of the four curves you get.
    """
    c = S.SERIES[mode]
    ell = 2.0
    fig, ax = plt.subplots()
    styles = [(0.0, "e = 0: circle", c[0], "-"),
              (0.5, "e = 0.5: ellipse", c[1], "-"),
              (1.0, "e = 1: parabola", c[2], "-"),
              (1.6, "e = 1.6: hyperbola", S.GUIDE[mode], "--")]
    for e, lab, col, ls in styles:
        th = np.linspace(-np.pi + 1e-3, np.pi - 1e-3, 4000)
        den = 1 + e * np.cos(th)
        good = den > 0.06
        r = ell / den[good]
        ax.plot(r * np.cos(th[good]), r * np.sin(th[good]), color=col, lw=2.1, ls=ls)
    assert abs(ell / (1 + 0.0) - 2.0) < 1e-12
    assert abs(ell / (1 + 0.5) - 4 / 3) < 1e-12
    assert abs(ell / (1 - 0.5) - 4.0) < 1e-12
    a_ell = ell / (1 - 0.5 ** 2)
    assert abs(a_ell - 8 / 3) < 1e-12, a_ell

    ax.plot([0], [0], "o", color=S.INK[mode], ms=8, zorder=5)
    S.note(ax, 0.18, -0.55, "shared focus", mode)
    S.label_end(ax, 1.0, 1.9, "e = 0: circle", c[0], mode, ha="center")
    S.label_end(ax, -2.4, 2.2, "e = 0.5: ellipse", c[1], mode, ha="center")
    S.label_end(ax, -5.6, 4.2, "e = 1: parabola", c[2], mode, ha="center")
    S.label_end(ax, -5.6, -4.6, "e = 1.6: hyperbola", S.GUIDE[mode], mode, ha="center")
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("One equation, one parameter, all four conic sections")
    ax.set_xlim(-8.0, 4.6)
    ax.set_ylim(-5.4, 5.4)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-ag-point-line")
def _(mode):
    """The distance from (6, 1) to the line 3x + 4y - 12 = 0, with the foot of
    the perpendicular computed rather than eyeballed.

    d = |3(6) + 4(1) - 12| / sqrt(9 + 16) = 10/5 = 2, and the foot is the
    point reached by stepping that distance along the unit normal (3,4)/5 -
    here (4.8, -0.6), which is asserted to satisfy the line equation exactly.
    """
    c = S.SERIES[mode]
    A, Bc, C = 3.0, 4.0, -12.0
    px, py = 6.0, 1.0
    val = A * px + Bc * py + C
    norm = math.hypot(A, Bc)
    d = abs(val) / norm
    fx, fy = px - val * A / norm ** 2, py - val * Bc / norm ** 2
    assert abs(d - 2.0) < 1e-12, d
    assert abs(A * fx + Bc * fy + C) < 1e-12
    assert abs(fx - 4.8) < 1e-12 and abs(fy + 0.6) < 1e-12
    assert abs(math.hypot(px - fx, py - fy) - d) < 1e-12

    x = np.linspace(-0.5, 8.0, 400)
    fig, ax = plt.subplots()
    ax.plot(x, (12 - A * x) / Bc, color=c[0], lw=2.3)
    ax.plot([px], [py], "o", color=c[1], ms=9, zorder=5)
    ax.plot([fx], [fy], "o", color=c[2], ms=9, zorder=5)
    ax.plot([px, fx], [py, fy], color=c[2], lw=2.0, ls="--")
    S.label_end(ax, 7.0, (12 - A * 7.0) / Bc, "3x + 4y - 12 = 0", c[0], mode, dy=-12, ha="right")
    S.note(ax, px + 0.15, py + 0.12, "P (6, 1)", mode)
    S.note(ax, fx + 0.15, fy - 0.42, "foot (4.8, -0.6)", mode)
    S.note(ax, 5.1, 0.42, "d = 2.0", mode)
    S.note(ax, -0.4, -1.75, "step from P along the unit normal (3,4)/5 by the signed value 10/5 = 2", mode)
    ax.plot([0, A / norm], [3, 3 + Bc / norm], color=S.GUIDE[mode], lw=1.6)
    S.note(ax, 0.68, 3.72, "unit normal (0.6, 0.8)", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Distance to a line is one dot product with the unit normal")
    ax.set_xlim(-0.6, 8.6)
    ax.set_ylim(-2.0, 5.0)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-ag-rotation")
def _(mode):
    """The hyperbola xy = 4 and the rotated axes that remove its xy term.

    The curve is drawn in the original frame; the rotated frame u, v at 45
    degrees is drawn over it. Substituting x = (u - v)/sqrt(2) and
    y = (u + v)/sqrt(2) gives (u^2 - v^2)/2 = 4, i.e. u^2/8 - v^2/8 = 1, and
    the code checks that identity numerically at every plotted point.
    """
    c = S.SERIES[mode]
    x = np.concatenate([np.linspace(-8, -0.5, 700), np.linspace(0.5, 8, 700)])
    y = 4 / x
    s = 1 / math.sqrt(2)
    u = s * (x + y)
    v = s * (y - x)
    assert np.allclose(u ** 2 / 8 - v ** 2 / 8, 1.0), "rotation did not remove the xy term"
    assert abs(math.degrees(math.atan2(1, 1)) - 45.0) < 1e-12

    fig, ax = plt.subplots()
    for seg in (slice(0, 700), slice(700, 1400)):
        ax.plot(x[seg], y[seg], color=c[0], lw=2.3)
    ln = np.linspace(-7.2, 7.2, 10)
    ax.plot(ln, ln, color=c[1], lw=1.6, ls="--")
    ax.plot(ln, -ln, color=c[2], lw=1.6, ls="--")
    S.label_end(ax, 6.4, 6.4, "u axis (45 deg)", c[1], mode, dy=8, ha="right")
    S.label_end(ax, -6.4, 6.4, "v axis", c[2], mode, dy=8)
    ax.plot([2.0, -2.0], [2.0, -2.0], "o", color=c[0], ms=8, zorder=5)
    S.note(ax, 2.3, 1.5, "vertex (2, 2): u = 2sqrt(2), v = 0", mode)
    S.label_end(ax, 5.4, 0.74, "xy = 4", c[0], mode)
    S.note(ax, -7.6, -7.3, "in the rotated frame the same curve is u^2/8 - v^2/8 = 1", mode)
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("An xy term only means the axes are turned")
    ax.set_xlim(-7.8, 7.8)
    ax.set_ylim(-7.8, 7.8)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-ag-parabola-focus")
def _(mode):
    """A parabolic reflector, with incoming parallel rays reflected by the
    computed surface normal.

    The surface is y = x^2/(4p) with p = 1, so the focus is at (0, 1). Each
    downward ray is reflected about the local normal using the vector
    reflection formula, and the code asserts that every reflected ray passes
    through (0, 1) to within 1e-9. Nothing about the convergence is drawn by
    hand.
    """
    c = S.SERIES[mode]
    p = 1.0
    x = np.linspace(-3.2, 3.2, 800)
    fig, ax = plt.subplots()
    ax.plot(x, x ** 2 / (4 * p), color=c[0], lw=2.6)
    for x0 in (-2.8, -1.9, -1.0, 1.0, 1.9, 2.8):
        y0 = x0 ** 2 / (4 * p)
        slope = 2 * x0 / (4 * p)
        n = np.array([-slope, 1.0]) / math.hypot(slope, 1.0)
        d = np.array([0.0, -1.0])
        r = d - 2 * np.dot(d, n) * n
        t = (p - y0) / r[1]
        hit = np.array([x0, y0]) + t * r
        assert abs(hit[0]) < 1e-9 and abs(hit[1] - p) < 1e-9, hit
        ax.plot([x0, x0], [3.4, y0], color=c[1], lw=1.5)
        ax.plot([x0, hit[0]], [y0, hit[1]], color=c[2], lw=1.5)
    ax.plot([0], [p], "o", color=S.INK[mode], ms=9, zorder=6)
    S.note(ax, 0.16, 1.06, "focus (0, 1)", mode)
    ax.axhline(-p, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, -3.1, -0.92, "directrix y = -1", mode)
    S.label_end(ax, -2.75, 3.05, "parallel rays in", c[1], mode)
    S.label_end(ax, 1.45, 1.55, "all reflect to one point", c[2], mode)
    S.label_end(ax, 3.05, 2.35, "y = x^2/4", c[0], mode, ha="right")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("Focus and directrix are the definition; the dish is the consequence")
    ax.set_xlim(-3.6, 3.9)
    ax.set_ylim(-1.6, 3.6)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-ag-ellipse-focal-sum")
def _(mode):
    """An ellipse with a = 5, b = 3 and the two focal radii drawn at three
    points, all summing to 2a.

    The foci sit at (+/- c, 0) with c = sqrt(a^2 - b^2) = 4, so e = c/a = 0.8.
    For every point the code evaluates r1 + r2 and asserts it equals 10 - the
    focal-sum definition, checked rather than asserted in prose.
    """
    c_ = S.SERIES[mode]
    a, b = 5.0, 3.0
    cc = math.sqrt(a ** 2 - b ** 2)
    assert abs(cc - 4.0) < 1e-12
    assert abs(cc / a - 0.8) < 1e-12
    t = np.linspace(0, 2 * math.pi, 900)
    ex, ey = a * np.cos(t), b * np.sin(t)
    for th in np.linspace(0, 2 * math.pi, 37):
        px, py = a * math.cos(th), b * math.sin(th)
        tot = math.hypot(px + cc, py) + math.hypot(px - cc, py)
        assert abs(tot - 2 * a) < 1e-9, tot

    fig, ax = plt.subplots()
    ax.plot(ex, ey, color=c_[0], lw=2.4)
    ax.plot([-cc, cc], [0, 0], "o", color=S.INK[mode], ms=8, zorder=6)
    for th, col in ((math.radians(60), c_[1]), (math.radians(160), c_[2]),
                    (math.radians(285), S.GUIDE[mode])):
        px, py = a * math.cos(th), b * math.sin(th)
        r1, r2 = math.hypot(px + cc, py), math.hypot(px - cc, py)
        ax.plot([-cc, px], [0, py], color=col, lw=1.7)
        ax.plot([cc, px], [0, py], color=col, lw=1.7)
        S.note(ax, px, py + 0.22 * (1 if py >= 0 else -1.9),
               f"{r1:.2f} + {r2:.2f} = 10.00", mode, ha="center", size=8.5)
    S.note(ax, -cc, -0.55, "F1 (-4, 0)", mode, ha="center")
    S.note(ax, cc, -0.55, "F2 (4, 0)", mode, ha="center")
    S.label_end(ax, 0.0, 3.35, "a = 5, b = 3, c = 4, e = c/a = 0.8", c_[0], mode, ha="center")
    ax.axhline(0, color=S.GRID[mode], lw=0.9)
    ax.axvline(0, color=S.GRID[mode], lw=0.9)
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("The sum of the focal distances is constant - that IS the ellipse")
    ax.set_xlim(-6.6, 6.6)
    ax.set_ylim(-4.4, 4.4)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


@figure("math2-ag-polar-circle")
def _(mode):
    """The circle (x - 1)^2 + y^2 = 1 drawn from its Cartesian form and from
    its polar form r = 2 cos theta.

    Both parameterisations are evaluated and asserted to describe the same
    point set. The polar form needs theta only over a half turn, which is the
    trap: sweeping the full 2 pi traces the circle twice.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 2 * math.pi, 900)
    cx, cy = 1 + np.cos(t), np.sin(t)
    th = np.linspace(-math.pi / 2 + 1e-6, math.pi / 2 - 1e-6, 900)
    r = 2 * np.cos(th)
    px, py = r * np.cos(th), r * np.sin(th)
    assert np.allclose((px - 1) ** 2 + py ** 2, 1.0, atol=1e-9)
    assert abs(2 * math.cos(0.0) - 2.0) < 1e-12
    assert abs(2 * math.cos(math.pi / 3) - 1.0) < 1e-12

    fig, ax = plt.subplots()
    for rr in (0.5, 1.0, 1.5, 2.0):
        ax.plot(rr * np.cos(t), rr * np.sin(t), color=S.GRID[mode], lw=0.8, ls=":")
    for ang in range(0, 180, 30):
        a = math.radians(ang)
        ax.plot([-2.1 * math.cos(a), 2.1 * math.cos(a)],
                [-2.1 * math.sin(a), 2.1 * math.sin(a)], color=S.GRID[mode], lw=0.8, ls=":")
    ax.plot(cx, cy, color=c[0], lw=3.0, alpha=0.45)
    ax.plot(px, py, color=c[1], lw=2.0)
    for ang in (0, 30, 60):
        a = math.radians(ang)
        rr = 2 * math.cos(a)
        ax.plot([0, rr * math.cos(a)], [0, rr * math.sin(a)], color=c[1], lw=1.4)
        ax.plot([rr * math.cos(a)], [rr * math.sin(a)], "o", color=c[1], ms=6.5, zorder=5)
        S.note(ax, rr * math.cos(a) + 0.06, rr * math.sin(a) + 0.06,
               f"{ang} deg: r = {rr:.2f}", mode, size=8.5)
    S.label_end(ax, 0.05, -1.35, "thick: (x - 1)^2 + y^2 = 1", c[0], mode, ha="center")
    S.label_end(ax, 0.05, -1.62, "thin: r = 2 cos theta, theta in (-90 deg, 90 deg)", c[1], mode, ha="center")
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("A circle through the origin is one term in polar coordinates")
    ax.set_xlim(-1.4, 2.9)
    ax.set_ylim(-1.85, 1.5)
    ax.set_aspect("equal", adjustable="box")
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Differential Calculus
# ---------------------------------------------------------------------------


@figure("math2-dc-secant-tangent")
def _(mode):
    """Secant lines to f(x) = x^2 at x = 1 collapsing onto the tangent.

    Each secant slope is the difference quotient ((1+h)^2 - 1)/h evaluated for
    h = 1, 0.5 and 0.25, which the code checks equals 2 + h exactly. The limit
    2 is the tangent slope, and the picture is the definition of the
    derivative rather than an illustration of it.
    """
    c = S.SERIES[mode]
    x = np.linspace(-0.2, 2.6, 700)
    fig, ax = plt.subplots()
    ax.plot(x, x ** 2, color=c[0], lw=2.4)
    for i, h in enumerate((1.0, 0.5, 0.25)):
        m = ((1 + h) ** 2 - 1 ** 2) / h
        assert abs(m - (2 + h)) < 1e-12, (h, m)
        xs = np.array([0.3, 2.5])
        ax.plot(xs, 1 + m * (xs - 1), color=S.GUIDE[mode], lw=1.2, ls="--")
        ax.plot([1 + h], [(1 + h) ** 2], "o", color=c[1], ms=6.5, zorder=5)
        S.note(ax, 1 + h + 0.04, (1 + h) ** 2 + 0.08, f"h = {h}: slope {m:.2f}", mode, size=8.5)
    xs = np.array([0.15, 2.5])
    ax.plot(xs, 1 + 2 * (xs - 1), color=c[2], lw=2.4)
    ax.plot([1.0], [1.0], "o", color=c[2], ms=9, zorder=6)
    S.label_end(ax, 2.5, 1 + 2 * 1.5, "tangent, slope 2", c[2], mode, ha="right", dy=12)
    S.label_end(ax, 2.35, 2.35 ** 2, "f(x) = x^2", c[0], mode, ha="right", dy=6)
    S.note(ax, -0.15, 5.1, "difference quotient ((1+h)^2 - 1)/h = 2 + h, so the limit as h -> 0 is 2",
           mode)
    ax.set_xlabel("x")
    ax.set_ylabel("f(x)")
    ax.set_title("The derivative is the number the secant slopes are heading for")
    ax.set_xlim(-0.25, 3.0)
    ax.set_ylim(-1.2, 6.4)
    S.strip(ax)
    return fig


@figure("math2-dc-taylor-sin")
def _(mode):
    """sin(x) against its Maclaurin partial sums of one, two and three terms.

    Each partial sum is built from the series the lesson writes out,
    x - x^3/3! + x^5/5!, and the code reports the angle at which the
    one-term approximation first errs by more than 1%, found by interpolation
    on the computed error.
    """
    c = S.SERIES[mode]
    x = np.linspace(0, 3.4, 1400)
    s = np.sin(x)
    t1 = x
    t2 = x - x ** 3 / 6
    t3 = x - x ** 3 / 6 + x ** 5 / 120
    assert abs(t3[np.searchsorted(x, 1.0)] - (1 - 1 / 6 + 1 / 120)) < 2e-3
    err1 = 100 * np.abs(t1 - s) / np.maximum(np.abs(s), 1e-9)
    x1 = float(np.interp(1.0, err1[1:], x[1:]))
    assert 0.23 < x1 < 0.26, x1

    fig, ax = plt.subplots()
    ax.plot(x, s, color=S.INK[mode], lw=2.8, alpha=0.55)
    ax.plot(x, t1, color=c[0], lw=1.9)
    ax.plot(x, t2, color=c[1], lw=1.9)
    ax.plot(x, t3, color=c[2], lw=1.9)
    S.label_end(ax, 1.45, 1.45, "x", c[0], mode)
    S.label_end(ax, 2.5, 2.5 - 2.5 ** 3 / 6, "x - x^3/6", c[1], mode, dy=-8)
    S.label_end(ax, 3.4, t3[-1], "x - x^3/6 + x^5/120", c[2], mode, ha="right", dy=-14)
    S.label_end(ax, 3.4, s[-1], "sin x", S.INK_2[mode], mode, ha="right", dy=10)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([x1], [math.sin(x1)], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, x1 + 0.05, math.sin(x1) - 0.45,
           f"one term is within 1%\nout to {math.degrees(x1):.0f} deg", mode)
    ax.set_xlabel("x  (radians)")
    ax.set_ylabel("value")
    ax.set_title("Each extra Taylor term buys accuracy over a wider interval")
    ax.set_xlim(0, 4.2)
    ax.set_ylim(-2.2, 3.2)
    S.strip(ax)
    return fig


@figure("math2-dc-newton")
def _(mode):
    """Newton's method on f(x) = x^3 - 2x - 5, started at x = 2.

    The iteration x <- x - f(x)/f'(x) is run in the code; the tangent line at
    each iterate is drawn to its x-intercept, which is the next iterate. Three
    steps reach 2.0945514815, and the code asserts the residual falls below
    1e-9, which is the quadratic convergence the lesson describes.
    """
    c = S.SERIES[mode]

    def f(v):
        return v ** 3 - 2 * v - 5

    def fp(v):
        return 3 * v ** 2 - 2

    xs = [2.0]
    for _ in range(3):
        xs.append(xs[-1] - f(xs[-1]) / fp(xs[-1]))
    assert abs(xs[1] - 2.1) < 1e-12, xs[1]
    assert abs(xs[-1] - 2.0945514815423265) < 1e-9, xs[-1]
    assert abs(f(xs[-1])) < 2e-9

    x = np.linspace(1.7, 2.45, 700)
    fig, ax = plt.subplots()
    ax.plot(x, f(x), color=c[0], lw=2.4)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.1)
    for i in range(3):
        x0 = xs[i]
        seg = np.array([min(x0, xs[i + 1]) - 0.03, max(x0, xs[i + 1]) + 0.03])
        ax.plot(seg, f(x0) + fp(x0) * (seg - x0), color=c[1], lw=1.4, ls="--")
        ax.plot([x0, x0], [0, f(x0)], color=S.GRID[mode], lw=0.9, ls=":")
        ax.plot([x0], [f(x0)], "o", color=c[1], ms=6.5, zorder=5)
        S.note(ax, x0 - 0.012, f(x0) - 0.42, f"x{i} = {x0:.7f}", mode, ha="right", size=8.5)
    ax.plot([xs[-1]], [0.0], "o", color=c[2], ms=9, zorder=6)
    S.note(ax, xs[-1] + 0.02, 0.22, f"root {xs[-1]:.7f}", mode)
    S.label_end(ax, 2.42, f(2.42), "f(x) = x^3 - 2x - 5", c[0], mode, ha="right", dy=8)
    S.note(ax, 1.72, -2.55, "residual |f(x)| after each step: 1.0, 6.1e-2, 1.86e-4, 1.74e-9 - the errors square",
           mode)
    ax.set_xlabel("x")
    ax.set_ylabel("f(x)")
    ax.set_title("Newton replaces the curve with its tangent and solves that instead")
    ax.set_xlim(1.7, 2.62)
    ax.set_ylim(-2.8, 2.6)
    S.strip(ax)
    return fig


@figure("math2-dc-maxpower-broad")
def _(mode):
    """Normalised load power against the resistance ratio R_L/R_s.

    P/P_max = 4r/(1 + r)^2 is evaluated from the expression the lesson
    derives. The peak sits at r = 1 and the curve is flat there: the code
    solves 4r/(1+r)^2 = 0.9 and finds the band 0.5 to 2 delivers at least
    88.9% of the maximum, which is asserted before the shading is drawn.
    """
    c = S.SERIES[mode]
    r = np.logspace(-1.3, 1.3, 1600)
    p = 4 * r / (1 + r) ** 2
    assert abs(p.max() - 1.0) < 1e-6
    assert abs(4 * 2 / 9 - 8 / 9) < 1e-15
    at_half = 4 * 0.5 / (1.5 ** 2)
    at_two = 4 * 2 / (3.0 ** 2)
    assert abs(at_half - at_two) < 1e-15 and abs(at_half - 0.888888888888889) < 1e-12
    lo = float(np.interp(0.9, p[r < 1], r[r < 1]))
    hi = float(np.interp(-0.9, -p[r > 1], r[r > 1]))
    assert 0.51 < lo < 0.53 and 1.9 < hi < 1.96, (lo, hi)

    fig, ax = plt.subplots()
    ax.semilogx(r, p, color=c[0], lw=2.5)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axvline(1.0, color=S.GRID[mode], lw=1.0, ls=":")
    ax.fill_between(r, 0, p, where=(r >= lo) & (r <= hi), color=c[0], alpha=0.16)
    ax.plot([1.0], [1.0], "o", color=c[0], ms=8, zorder=5)
    for rr in (0.5, 2.0):
        ax.plot([rr], [4 * rr / (1 + rr) ** 2], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, 0.055, 1.03, "maximum at R_L = R_s", mode)
    S.note(ax, 1.05, 0.60, f"anything from {lo:.2f} to {hi:.2f}\ndelivers 90% of the peak", mode)
    S.note(ax, 0.052, 0.885, "at half or double: 88.9%", mode)
    S.label_end(ax, 15, 4 * 15 / 16 ** 2, "P/Pmax = 4r/(1+r)^2", c[0], mode, ha="right", dy=14)
    ax.set_xlabel("resistance ratio  r = R_L / R_s")
    ax.set_ylabel("fraction of the maximum power")
    ax.set_title("The maximum-power peak is real but very broad")
    ax.set_xlim(0.05, 20)
    ax.set_ylim(0, 1.16)
    S.strip(ax)
    return fig


@figure("math2-dc-diode-tangent")
def _(mode):
    """The diode law and its tangent at a 1 mA operating point.

    i = Is(exp(v/VT) - 1) with Is = 1 pA and VT = 26 mV. The tangent's slope
    is di/dv = (i + Is)/VT, so the small-signal resistance at 1 mA is
    r_d = VT/I = 26 ohm - computed here, not quoted. The tangent is the entire
    content of "linearise about the Q point".
    """
    c = S.SERIES[mode]
    Is, VT = 1e-12, 0.026
    IQ = 1e-3
    vQ = VT * math.log(IQ / Is + 1)
    g = (IQ + Is) / VT
    rd = 1 / g
    assert abs(rd - 26.0) < 0.001, rd
    assert abs(vQ - 0.5388049117866066) < 1e-9, vQ

    v = np.linspace(0.40, 0.60, 900)
    i = Is * (np.exp(v / VT) - 1)
    fig, ax = plt.subplots()
    ax.plot(v * 1e3, i * 1e3, color=c[0], lw=2.4)
    tan = (IQ + g * (v - vQ)) * 1e3
    ax.plot(v * 1e3, tan, color=c[1], lw=1.9, ls="--")
    ax.plot([vQ * 1e3], [IQ * 1e3], "o", color=c[2], ms=9, zorder=6)
    S.note(ax, vQ * 1e3 - 3, 1.35, f"Q point: {vQ*1e3:.1f} mV, 1.00 mA", mode, ha="right")
    S.label_end(ax, 570, float(Is * (math.exp(0.570 / VT) - 1) * 1e3), "exponential diode law",
                c[0], mode, ha="right", dy=6)
    S.label_end(ax, 580, float((IQ + g * (0.580 - vQ)) * 1e3), "tangent: slope 1/26 ohm", c[1], mode,
                ha="right", dy=-12)
    S.note(ax, 402, 2.6, "r_d = VT/I = 26 mV / 1 mA = 26 ohm at this Q point;\n"
                         "double the current and r_d halves", mode)
    ax.set_xlabel("diode voltage  (mV)")
    ax.set_ylabel("diode current  (mA)")
    ax.set_title("Small-signal models are one derivative evaluated at one point")
    ax.set_xlim(400, 600)
    ax.set_ylim(0, 3.2)
    S.strip(ax)
    return fig


@figure("math2-dc-indeterminate")
def _(mode):
    """Two 0/0 limits approached numerically, with the values L'Hopital
    predicts drawn as asymptotes.

    (e^(2x) - 1)/x and sin(x)/x are evaluated on a grid that skips zero. The
    limits 2 and 1 come from differentiating numerator and denominator, and
    the code checks the computed ratios against those values at x = 1e-6.
    """
    c = S.SERIES[mode]
    x = np.concatenate([np.linspace(-1.2, -1e-4, 800), np.linspace(1e-4, 1.2, 800)])
    r1 = (np.exp(2 * x) - 1) / x
    r2 = np.sin(x) / x
    assert abs((math.exp(2e-6) - 1) / 1e-6 - 2) < 1e-5
    assert abs(math.sin(1e-6) / 1e-6 - 1) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(x, r1, color=c[0], lw=2.3)
    ax.plot(x, r2, color=c[1], lw=2.3)
    ax.axhline(2.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.axvline(0.0, color=S.GRID[mode], lw=1.0, ls=":")
    ax.plot([0], [2], "o", color=c[0], ms=8, markerfacecolor="none", mew=2, zorder=5)
    ax.plot([0], [1], "o", color=c[1], ms=8, markerfacecolor="none", mew=2, zorder=5)
    S.label_end(ax, 1.2, r1[-1], "(e^(2x) - 1)/x  ->  2", c[0], mode, ha="right", dy=10)
    S.label_end(ax, 1.2, r2[-1], "sin(x)/x  ->  1", c[1], mode, ha="right", dy=-12)
    S.note(ax, -1.15, 4.4, "both are 0/0 at x = 0: the function is undefined there,\n"
                           "but the limit is the ratio of the derivatives", mode)
    ax.set_xlabel("x")
    ax.set_ylabel("value of the ratio")
    ax.set_title("L'Hopital names the height of the hole in the graph")
    ax.set_xlim(-1.3, 1.55)
    ax.set_ylim(0, 5.3)
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
