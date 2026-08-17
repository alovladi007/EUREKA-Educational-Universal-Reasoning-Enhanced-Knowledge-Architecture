#!/usr/bin/env python3
"""Depth-wave-13 figures: the Root Locus and Bode/Nyquist chapters of the FE
Electrical and Computer course.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

The route matters as much as the result. Root loci are drawn by handing the
characteristic polynomial to a numerical root finder at several thousand gains
and plotting where the roots land; not one construction rule is used to place a
point. Frequency responses are evaluated as complex numbers on a dense sweep,
never from straight-line asymptotes. Nyquist stability is settled by
accumulating the argument of 1 + L(s) along the traced contour, never by
applying Z = N + P symbolically. So each figure is an independent check on the
prose beside it rather than an illustration of it.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the last quoted
digit or tighter. A tolerance of 0.1 on a quantity quoted to two decimals is
decoration, not a check.

Usage:
    python3 scripts/gen_fe_ee_d13.py            # all
    python3 scripts/gen_fe_ee_d13.py ctl3-ny    # only names with that prefix
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
# shared numerics - root finding and complex evaluation, no construction rules
# ---------------------------------------------------------------------------

P = np.polymul


def char_roots(den, num, K):
    """Roots of den(s) + K num(s), the closed-loop poles at that gain."""
    n = max(len(den), len(num))
    d = np.concatenate([np.zeros(n - len(den)), np.asarray(den, float)])
    m = np.concatenate([np.zeros(n - len(num)), np.asarray(num, float)])
    return np.roots(d + K * m)


def locus_points(den, num, Ks):
    """Every closed-loop root over a gain sweep, as one flat complex array."""
    out = []
    for K in Ks:
        out.append(char_roots(den, num, K))
    return np.concatenate(out)


def gain_grid(kmax, kmin=1e-4, n=6000):
    """Gains dense where the locus turns (small K) and out to kmax."""
    return np.concatenate([np.linspace(0.0, kmin, 40),
                           np.logspace(np.log10(kmin), np.log10(kmax), n)])


def Lval(num, den, s):
    return np.polyval(num, s) / np.polyval(den, s)


def bisect(f, a, b, n=300):
    fa = f(a)
    assert fa * f(b) < 0, (f(a), f(b))
    for _ in range(n):
        m = 0.5 * (a + b)
        if f(m) * fa > 0:
            a = m
        else:
            b = m
    return 0.5 * (a + b)


def gain_crossover(num, den, target=1.0):
    return bisect(lambda w: abs(Lval(num, den, 1j * w)) - target, 1e-6, 1e6)


def phase_deg(num, den, w):
    return np.degrees(np.angle(Lval(num, den, 1j * w)))


def winding(num, den, eps=1e-4, R=1e7):
    """Clockwise encirclements of -1 by the image of the traced Nyquist contour."""
    pts = []
    if any(abs(r) < 1e-12 for r in np.roots(den)):
        pts.append(eps * np.exp(1j * np.linspace(-np.pi / 2, np.pi / 2, 20001)))
    w = np.logspace(np.log10(eps), np.log10(R), 400001)
    pts += [1j * w,
            R * np.exp(1j * np.linspace(np.pi / 2, -np.pi / 2, 4001)),
            -1j * w[::-1]]
    s = np.concatenate(pts)
    ang = np.unwrap(np.angle(Lval(num, den, s) + 1.0))
    return -(ang[-1] - ang[0]) / (2 * np.pi)


def splane(ax, poles, zeros, mode, size=9):
    """Open-loop poles as crosses, zeros as circles, in ink."""
    ink = S.INK[mode]
    if len(poles):
        ax.plot(np.real(poles), np.imag(poles), "x", color=ink, ms=size,
                mew=1.9, ls="none", zorder=6)
    if len(zeros):
        ax.plot(np.real(zeros), np.imag(zeros), "o", color=ink, ms=size,
                mfc="none", mew=1.7, ls="none", zorder=6)


# ---------------------------------------------------------------------------
# Root locus
# ---------------------------------------------------------------------------


@figure("ctl3-angle-condition")
def _(mode):
    """The angle condition tested at the zeta = 0.5 point of K/[s(s+2)(s+4)].

    The three vectors drawn from the open-loop poles to the test point make
    120.0000, 40.8934 and 19.1066 degrees with the positive real axis; they sum
    to exactly 180, which is what puts the point on the locus. The product of
    their lengths is the gain there, 224/27 = 8.2963.
    """
    c = S.SERIES[mode]
    s0 = -2 / 3 + 1j * 2 / np.sqrt(3)
    poles = np.array([0.0, -2.0, -4.0])
    angs = np.degrees(np.angle(s0 - poles))
    mags = np.abs(s0 - poles)
    assert abs(angs[0] - 120.0) < 5e-5, angs
    assert abs(angs[1] - 40.8934) < 5e-5, angs
    assert abs(angs[2] - 19.1066) < 5e-5, angs
    assert abs(angs.sum() - 180.0) < 1e-9, angs.sum()
    assert abs(np.prod(mags) - 224 / 27) < 1e-9, np.prod(mags)
    assert abs(mags[0] - 1.333333) < 5e-6 and abs(mags[1] - 1.763834) < 5e-6
    assert abs(mags[2] - 3.527668) < 5e-6

    den = np.array([1.0, 6.0, 8.0, 0.0])
    pts = locus_points(den, [1.0], gain_grid(60.0))

    fig, ax = plt.subplots()
    ax.plot(pts.real, pts.imag, ".", color=c[0], ms=1.4, alpha=0.5)
    splane(ax, poles, [], mode)
    for pk in poles:
        ax.annotate("", xy=(s0.real, s0.imag), xytext=(pk, 0.0),
                    arrowprops=dict(arrowstyle="->", color=c[1], lw=1.5))
    ax.plot([s0.real], [s0.imag], "o", color=c[1], ms=8, zorder=7)
    S.note(ax, s0.real + 0.22, s0.imag + 0.10,
           "test point -0.6667 + j1.1547", mode)
    rows = "\n".join(
        f"from the pole at {pk:5.1f}:   {a:8.4f} deg    length {m:.4f}"
        for pk, a, m in zip(poles, angs, mags))
    S.note(ax, -7.0, -3.15,
           rows + f"\n{'sum':>19} {angs.sum():8.4f} deg   product {np.prod(mags):.4f}",
           mode, size=8.5)
    S.note(ax, -7.0, 2.55,
           "the angles reach an odd multiple of 180, so the point is on\n"
           "the locus; the lengths multiply to the gain that puts it there", mode)
    S.label_end(ax, -6.6, 0.0, "locus, from the roots of s^3+6s^2+8s+K",
                c[0], mode, dy=-15)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of s")
    ax.set_ylabel("imaginary part of s")
    ax.set_title("Both conditions read off one picture")
    ax.set_xlim(-7.2, 2.6)
    ax.set_ylim(-4.3, 3.6)
    S.strip(ax)
    return fig


@figure("ctl3-asymptote-centroid")
def _(mode):
    """Runaway branches of K(s+4)/[s(s+1)(s+2)(s+10)] against their asymptotes.

    Three branches escape (n - m = 3). The centroid predicted by
    (sum poles - sum zeros)/(n - m) is -3, and the mean real part of the three
    runaway roots at K = 1e8 is asserted against that number, which is an
    independent numerical confirmation of the rule.
    """
    c = S.SERIES[mode]
    poles = np.array([0.0, -1.0, -2.0, -10.0])
    zeros = np.array([-4.0])
    den = P(P(P([1.0, 0.0], [1.0, 1.0]), [1.0, 2.0]), [1.0, 10.0])
    num = np.array([1.0, 4.0])
    sig = (poles.sum() - zeros.sum()) / 3
    assert abs(sig + 3.0) < 1e-12, sig
    far = sorted(char_roots(den, num, 1e8), key=lambda z: -abs(z))[:3]
    assert abs(np.mean([z.real for z in far]) + 3.0) < 5e-3, far

    pts = locus_points(den, num, gain_grid(4e3))
    fig, ax = plt.subplots()
    ax.plot(pts.real, pts.imag, ".", color=c[0], ms=1.4, alpha=0.5)
    splane(ax, poles, zeros, mode)
    for ang in (60.0, 180.0, 300.0):
        t = np.linspace(0, 26, 2)
        ax.plot(sig + t * np.cos(np.radians(ang)), t * np.sin(np.radians(ang)),
                color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot([sig], [0.0], "o", color=c[1], ms=8, zorder=7)
    S.note(ax, sig, -2.9, "centroid at -3", mode, ha="center")
    S.note(ax, -15.5, 9.4,
           "asymptotes at 60, 180 and 300 deg;\n"
           "the mean real part of the three escaping\n"
           "roots at K = 1e8 is -3.000", mode)
    S.label_end(ax, -6.5, 4.6, "locus", c[0], mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of s")
    ax.set_ylabel("imaginary part of s")
    ax.set_title("Where the escaping branches point, and from where")
    ax.set_xlim(-16.5, 6.5)
    ax.set_ylim(-13, 13)
    S.strip(ax)
    return fig


@figure("ctl3-circle-locus")
def _(mode):
    """K(s+3)/[s(s+1)]: the complex branch is exactly the circle |s+3| = sqrt6.

    Every complex closed-loop root over the whole sweep is asserted to lie on
    that circle to 1e-9, and the two real collisions land at -3 +- sqrt6 with
    gains 0.10102 and 9.89899.
    """
    c = S.SERIES[mode]
    den, num = P([1.0, 0.0], [1.0, 1.0]), np.array([1.0, 3.0])
    Ks = gain_grid(400.0, n=9000)
    pts = locus_points(den, num, Ks)
    cplx = pts[np.abs(pts.imag) > 1e-7]
    assert abs(np.abs(cplx + 3).max() - np.sqrt(6)) < 1e-9
    assert abs(np.abs(cplx + 3).min() - np.sqrt(6)) < 1e-9
    sb, si = -3 + np.sqrt(6), -3 - np.sqrt(6)
    assert abs(sb + 0.5505103) < 1e-6 and abs(si + 5.4494897) < 1e-6
    Kb = -(sb * sb + sb) / (sb + 3)
    Ki = -(si * si + si) / (si + 3)
    assert abs(Kb - 0.1010205) < 1e-7, Kb
    assert abs(Ki - 9.8989795) < 1e-6, Ki
    assert abs(Kb * Ki - 1.0) < 1e-9
    # the two collisions really are repeated roots of the characteristic poly
    for s_, K_ in ((sb, Kb), (si, Ki)):
        r = np.sort(char_roots(den, num, K_).real)
        assert abs(r[0] - r[1]) < 1e-6 and abs(r[0] - s_) < 1e-6, (r, s_)

    th = np.linspace(0, 2 * np.pi, 800)
    fig, ax = plt.subplots()
    ax.plot(-3 + np.sqrt(6) * np.cos(th), np.sqrt(6) * np.sin(th),
            color=S.GUIDE[mode], lw=4.0, ls=(0, (5, 5)))
    ax.plot(pts.real, pts.imag, ".", color=c[0], ms=1.6, alpha=0.55)
    splane(ax, [0.0, -1.0], [-3.0], mode)
    ax.plot([sb, si], [0, 0], "o", color=c[1], ms=8, zorder=7)
    S.note(ax, -8.5, 2.75,
           f"breakaway at -0.5505, where K = {Kb:.5f}\n"
           f"break-in at -5.4495, where K = {Ki:.5f}\n"
           "the two gains multiply to exactly 1", mode)
    S.note(ax, -8.5, -3.35,
           "the broad dashed curve is the circle of centre -3 and radius\n"
           "sqrt6 = 2.4495; the swept roots sit on it to one part in 1e9", mode)
    S.label_end(ax, -3.0, 2.45, "locus", c[0], mode, ha="center", dy=6)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of s")
    ax.set_ylabel("imaginary part of s")
    ax.set_title("A single zero bends the branches onto a circle")
    ax.set_xlim(-8.7, 1.9)
    ax.set_ylim(-4.0, 3.9)
    S.strip(ax)
    return fig


@figure("ctl3-departure-angle")
def _(mode):
    """K/[s(s^2+2s+5)]: departure angle from -1+j2, and the jw crossing.

    The angle is asserted twice: once as 180 - (sum of angles from the other
    poles) = -26.5651 deg, and once as the direction the numerically swept root
    actually moves for a vanishingly small gain.
    """
    c = S.SERIES[mode]
    den = np.array([1.0, 2.0, 5.0, 0.0])
    p = -1 + 2j
    a_origin = np.degrees(np.angle(p - 0))
    a_conj = np.degrees(np.angle(p - np.conj(p)))
    assert abs(a_origin - 116.5651) < 5e-5, a_origin
    assert abs(a_conj - 90.0) < 1e-9, a_conj
    theta = 180.0 - (a_origin + a_conj)
    assert abs(theta + 26.5651) < 5e-5, theta
    moved = [z for z in char_roots(den, [1.0], 1e-5) if z.imag > 1][0]
    assert abs(np.degrees(np.angle(moved - p)) - theta) < 5e-3
    rc = char_roots(den, [1.0], 10.0)
    assert abs(max(abs(rc.imag)) - np.sqrt(5)) < 1e-6
    assert abs(min(rc.real) + 2.0) < 1e-6

    pts = locus_points(den, [1.0], gain_grid(30.0))
    fig, ax = plt.subplots()
    ax.plot(pts.real, pts.imag, ".", color=c[0], ms=1.6, alpha=0.55)
    splane(ax, [0.0, -1 + 2j, -1 - 2j], [], mode)
    ln = 1.5
    ax.annotate("", xy=(p.real + ln * np.cos(np.radians(theta)),
                        p.imag + ln * np.sin(np.radians(theta))),
                xytext=(p.real, p.imag),
                arrowprops=dict(arrowstyle="->", color=c[1], lw=2.0))
    S.note(ax, p.real - 0.18, p.imag - 0.55,
           "leaves at -26.5651 deg", mode, ha="right")
    ax.plot([0.0, 0.0], [np.sqrt(5), -np.sqrt(5)], "o", color=c[1], ms=7, zorder=7)
    S.note(ax, 0.15, np.sqrt(5) + 0.42, "crosses at 2.2361 rad/s, K = 10", mode)
    S.note(ax, -4.4, -3.3, "third root sits at -2 when the pair reaches the axis", mode)
    S.label_end(ax, -3.2, 2.0, "locus", c[0], mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.axvline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of s")
    ax.set_ylabel("imaginary part of s")
    ax.set_title("Complex poles set off in a direction you can compute")
    ax.set_xlim(-4.6, 2.4)
    ax.set_ylim(-3.8, 3.8)
    S.strip(ax)
    return fig


@figure("ctl3-add-pole-vs-zero")
def _(mode):
    """What a third singularity does to the locus of K/[s(s+2)].

    Baseline: the vertical line Re(s) = -1, stable for every gain. Adding a
    pole at -5 bends the branches right and creates the ceiling K = 70. Adding
    a zero at -5 instead bends them left onto the circle |s+5| = sqrt15, and no
    gain destabilises the loop. All three loci come from the same root sweep.
    """
    c = S.SERIES[mode]
    d0 = P([1.0, 0.0], [1.0, 2.0])
    dp = P(d0, [1.0, 5.0])
    p0 = locus_points(d0, [1.0], gain_grid(400.0))
    pp = locus_points(dp, [1.0], gain_grid(2e3))
    pz = locus_points(d0, [1.0, 5.0], gain_grid(4e3))
    # baseline: every complex root sits exactly on Re(s) = -1, and no gain
    # ever pushes a root into the right half plane
    c0 = p0[np.abs(p0.imag) > 1e-7]
    assert abs(c0.real + 1.0).max() < 1e-9, c0.real.max()
    assert p0.real.max() < 1e-12, p0.real.max()
    r70 = char_roots(dp, [1.0], 70.0)
    assert abs(max(abs(r70.imag)) - np.sqrt(10)) < 1e-6, r70
    assert abs(min(r70.real) + 7.0) < 1e-6, r70
    assert char_roots(dp, [1.0], 69.9).real.max() < 0
    assert char_roots(dp, [1.0], 70.1).real.max() > 0
    cz = pz[np.abs(pz.imag) > 1e-7]
    assert abs(np.abs(cz + 5).max() - np.sqrt(15)) < 1e-9
    assert pz.real.max() < 1e-12 and char_roots(d0, [1.0, 5.0], 1e7).real.max() < 0

    fig, ax = plt.subplots()
    ax.plot(pp.real, pp.imag, ".", color=c[1], ms=1.5, alpha=0.5)
    ax.plot(pz.real, pz.imag, ".", color=c[2], ms=1.5, alpha=0.5)
    ax.plot(p0.real, p0.imag, ".", color=c[0], ms=1.5, alpha=0.5)
    splane(ax, [0.0, -2.0], [], mode, size=8)
    S.label_end(ax, -1.05, 5.4, "K/[s(s+2)]: straight up,\nstable for every K",
                c[0], mode, dx=-6, ha="right")
    S.label_end(ax, 1.35, 4.4, "with a pole at -5: bends right,\nunstable above K = 70",
                c[1], mode, dx=4)
    S.label_end(ax, -8.87, 0.9, "with a zero at -5: bends left\nonto the circle of radius sqrt15",
                c[2], mode, dx=6)
    ax.plot([0.0, 0.0], [np.sqrt(10), -np.sqrt(10)], "o", color=c[1], ms=7, zorder=7)
    S.note(ax, 0.2, -np.sqrt(10), "3.1623 rad/s", mode, va="center")
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.axvline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of s")
    ax.set_ylabel("imaginary part of s")
    ax.set_title("One extra singularity, two opposite outcomes")
    ax.set_xlim(-10.5, 4.5)
    ax.set_ylim(-6.2, 6.2)
    S.strip(ax)
    return fig


@figure("ctl3-damping-ray")
def _(mode):
    """The zeta = 0.7071 ray meeting the locus of K/[s(s+2)(s+4)].

    The intersection is at -0.7639 +- j0.7639 with K = 56 sqrt5 - 120 = 5.2198,
    found here by bisecting the swept damping ratio rather than by solving the
    intersection algebraically.
    """
    c = S.SERIES[mode]
    den = np.array([1.0, 6.0, 8.0, 0.0])

    def zeta_dom(K):
        r = char_roots(den, [1.0], K)
        q = [z for z in r if z.imag > 1e-9]
        pk = max(q, key=lambda z: z.real)
        return -pk.real / abs(pk), pk

    Kz = bisect(lambda K: zeta_dom(K)[0] - 1 / np.sqrt(2), 3.2, 20.0, 200)
    z, pk = zeta_dom(Kz)
    assert abs(Kz - (56 * np.sqrt(5) - 120)) < 5e-5, Kz
    assert abs(pk.real + (3 - np.sqrt(5))) < 5e-5, pk
    assert abs(pk.imag - (3 - np.sqrt(5))) < 5e-5, pk
    assert abs(min(char_roots(den, [1.0], Kz).real) + 2 * np.sqrt(5)) < 5e-5

    pts = locus_points(den, [1.0], gain_grid(60.0))
    fig, ax = plt.subplots()
    ax.plot(pts.real, pts.imag, ".", color=c[0], ms=1.5, alpha=0.5)
    splane(ax, [0.0, -2.0, -4.0], [], mode)
    t = np.linspace(0, 4.4, 2)
    for sgn in (1, -1):
        ax.plot(-t / np.sqrt(2), sgn * t / np.sqrt(2),
                color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.plot([pk.real, pk.real], [pk.imag, -pk.imag], "o", color=c[1], ms=8, zorder=7)
    S.note(ax, pk.real + 0.2, pk.imag + 0.2,
           "-0.7639 + j0.7639 at K = 5.2198", mode)
    S.note(ax, -3.05, 2.55, "the 45 deg ray is zeta = 0.7071", mode, ha="right")
    S.note(ax, -6.6, -2.7,
           "third closed-loop pole at -4.4721,\n5.85 times farther out than the pair", mode)
    ax.plot([-2 * np.sqrt(5)], [0.0], "o", color=c[1], ms=7, zorder=7)
    S.label_end(ax, -1.2, 3.0, "locus", c[0], mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of s")
    ax.set_ylabel("imaginary part of s")
    ax.set_title("Reading a gain off the locus at a stated damping")
    ax.set_xlim(-7.2, 1.6)
    ax.set_ylim(-3.4, 3.4)
    S.strip(ax)
    return fig


@figure("ctl3-gain-vs-damping")
def _(mode):
    """Damping of the dominant pair against gain for K/[s(s+2)(s+4)].

    The curve exists only above the breakaway gain 3.0792, falls through
    0.7071 at K = 5.2198 and 0.5 at K = 8.2963, and reaches zero at K = 48,
    where the pair sits on the imaginary axis. Every point is a root of the
    swept cubic, so the curve is the answer to "what gain gives what damping"
    without a single construction rule.
    """
    c = S.SERIES[mode]
    den = np.array([1.0, 6.0, 8.0, 0.0])
    Ks = np.linspace(3.0793, 48.0, 40000)
    zs, wn = [], []
    for K in Ks:
        q = [z for z in char_roots(den, [1.0], K) if z.imag > 1e-9]
        pk = max(q, key=lambda z: z.real)
        zs.append(-pk.real / abs(pk))
        wn.append(abs(pk))
    zs, wn = np.array(zs), np.array(wn)
    for want_z, want_K in ((1 / np.sqrt(2), 56 * np.sqrt(5) - 120), (0.5, 224 / 27)):
        i = int(np.argmin(np.abs(zs - want_z)))
        assert abs(Ks[i] - want_K) < 3e-3, (Ks[i], want_K)
    assert zs[-1] < 2e-3, zs[-1]
    assert abs(wn[-1] - np.sqrt(8)) < 1e-3, wn[-1]
    assert zs[0] > 0.99, zs[0]

    fig, ax = plt.subplots()
    ax.plot(Ks, zs, color=c[0], lw=2.3)
    ax.plot(Ks, wn / 4.0, color=c[1], lw=2.0)
    S.label_end(ax, 24.0, np.interp(24.0, Ks, zs), "damping ratio of the pair",
                c[0], mode, dy=-15, dx=-10, ha="right")
    S.label_end(ax, 21.0, np.interp(21.0, Ks, wn) / 4.0,
                "natural frequency, as a fraction of its\nvalue at the crossing (2.8284 rad/s)",
                c[1], mode, dy=22)
    for K, z, lab in ((56 * np.sqrt(5) - 120, 1 / np.sqrt(2), "K = 5.2198"),
                      (224 / 27, 0.5, "K = 8.2963")):
        ax.plot([K], [z], "o", color=S.INK[mode], ms=6, zorder=6)
        S.note(ax, K + 0.8, z + 0.02, f"{lab}, zeta = {z:.4f}", mode)
    ax.axvline(48.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 46.6, 0.20, "K = 48: damping reaches zero,\nthe pair is on the axis",
           mode, ha="right")
    ax.set_xlabel("loop gain  K")
    ax.set_ylabel("damping ratio  /  fraction of final frequency")
    ax.set_title("Gain buys speed and spends damping")
    ax.set_xlim(2.0, 50.0)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Bode and Nyquist
# ---------------------------------------------------------------------------


@figure("ctl3-exact-vs-asymptote")
def _(mode):
    """Straight-line magnitude against the exact curve for one real pole.

    Plotted against w/a so the picture is universal. The asymptote error is
    3.0103 dB at the corner, 0.9691 dB an octave either side and 0.0432 dB a
    decade either side - all asserted from -20 log10 sqrt(1 + r^2).
    """
    c = S.SERIES[mode]
    r = np.logspace(-2, 2, 4000)
    exact = -20 * np.log10(np.sqrt(1 + r ** 2))
    asym = np.where(r < 1, 0.0, -20 * np.log10(r))
    for rr, want in ((0.1, 0.043214), (0.5, 0.969100), (1.0, 3.010300),
                     (2.0, 0.969100), (10.0, 0.043214)):
        e = -20 * np.log10(np.sqrt(1 + rr ** 2))
        a = 0.0 if rr < 1 else -20 * np.log10(rr)
        assert abs(abs(e - a) - want) < 5e-6, (rr, e - a)
    assert abs((-20 * np.log10(np.sqrt(1 + 100.0 ** 2))) + 40.000434) < 5e-6

    fig, ax = plt.subplots()
    ax.semilogx(r, asym, color=c[1], lw=2.0, ls="--")
    ax.semilogx(r, exact, color=c[0], lw=2.3)
    S.label_end(ax, 0.0115, -0.4, "exact  -20 log10 sqrt(1 + (w/a)^2)", c[0], mode, dy=-16)
    S.label_end(ax, 6.0, -20 * np.log10(6.0), "straight-line asymptotes", c[1], mode,
                dx=-6, dy=12, ha="right")
    for rr in (0.1, 0.5, 1.0, 2.0, 10.0):
        e = -20 * np.log10(np.sqrt(1 + rr ** 2))
        a = 0.0 if rr < 1 else -20 * np.log10(rr)
        ax.plot([rr, rr], [a, e], color=S.GUIDE[mode], lw=1.4)
        ax.plot([rr], [e], "o", color=S.INK[mode], ms=5, zorder=6)
    S.note(ax, 1.25, -4.6, "3.0103 dB at the corner", mode)
    S.note(ax, 2.4, -8.6, "0.9691 dB an octave out", mode)
    S.note(ax, 0.105, 1.1, "0.0432 dB a decade below", mode)
    S.note(ax, 0.012, -30.5,
           "the slope is exactly -20 dB per decade because a\n"
           "tenfold frequency is a fixed 20 dB of logarithm", mode)
    ax.set_xlabel("frequency as a multiple of the corner,  w/a")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("How wrong the straight lines are, and where")
    ax.set_ylim(-42, 5)
    S.strip(ax)
    return fig


@figure("ctl3-phase-decade")
def _(mode):
    """Exact phase of a real pole against the decade-to-decade straight line.

    The line runs 0 deg below a/10, -90 deg above 10a and -45 deg per decade
    between; the exact curve is -arctan(w/a). Worst error is 5.7106 deg, at the
    two break points of the approximation.
    """
    c = S.SERIES[mode]
    r = np.logspace(-2.4, 2.4, 4000)
    exact = -np.degrees(np.arctan(r))
    lin = np.clip(-45.0 * (np.log10(r) + 1.0), -90.0, 0.0)
    assert abs(np.degrees(np.arctan(0.1)) - 5.710593) < 5e-6
    assert abs(np.degrees(np.arctan(1.0)) - 45.0) < 1e-12
    assert abs(np.degrees(np.arctan(10.0)) - 84.289407) < 5e-6
    # the straight line breaks at a/10 and 10a, and those two points are where
    # it is worst: the exact curve is 5.710593 deg away from 0 and from -90
    for rr in (0.1, 10.0):
        e = -np.degrees(np.arctan(rr))
        l_ = np.clip(-45.0 * (np.log10(rr) + 1.0), -90.0, 0.0)
        assert abs(abs(e - l_) - 5.710593) < 5e-6, (rr, e - l_)
    assert np.abs(exact - lin).max() < 5.710593 + 1e-9

    fig, ax = plt.subplots()
    ax.semilogx(r, lin, color=c[1], lw=2.0, ls="--")
    ax.semilogx(r, exact, color=c[0], lw=2.3)
    S.label_end(ax, 0.0065, -np.degrees(np.arctan(0.0065)),
                "exact  -arctan(w/a)", c[0], mode, dy=-18)
    S.label_end(ax, 3.0, np.clip(-45.0 * (np.log10(3.0) + 1.0), -90, 0),
                "the -45 deg per decade line", c[1], mode, dx=-8, dy=12, ha="right")
    for rr, lab, dy in ((0.1, "-5.7106 deg", 6.0), (1.0, "-45 deg exactly", 4.0),
                        (10.0, "-84.2894 deg", 4.5)):
        e = -np.degrees(np.arctan(rr))
        ax.plot([rr], [e], "o", color=S.INK[mode], ms=6, zorder=6)
        S.note(ax, rr * 1.3, e + dy, lab, mode)
    S.note(ax, 0.0045, -78,
           "the straight line is worst at its own break points,\nand never off by more than 5.71 deg",
           mode)
    ax.set_xlabel("frequency as a multiple of the corner,  w/a")
    ax.set_ylabel("phase  (degrees)")
    ax.set_title("The phase approximation is cruder than the magnitude one")
    ax.set_ylim(-98, 12)
    S.strip(ax)
    return fig


@figure("ctl3-nmp-phase")
def _(mode):
    """Same magnitude, opposite phase: (1 + s/2) against (1 - s/2) around 1/[s(s+2)].

    Both loops share every magnitude value, so they cross 0 dB at the same
    0.55025 rad/s. The minimum-phase loop has 103.4389 deg of margin there and
    the non-minimum-phase twin only 45.7953 - a gap of exactly 2 arctan(w_gc).
    """
    c = S.SERIES[mode]
    den = P([1.0, 0.0], [1.0, 2.0])
    nmp, mp = np.array([-1.0, 1.0]), np.array([1.0, 1.0])
    w = np.logspace(-1.4, 1.4, 4000)
    ph_n = np.degrees(np.unwrap(np.angle(Lval(nmp, den, 1j * w))))
    ph_m = np.degrees(np.unwrap(np.angle(Lval(mp, den, 1j * w))))
    wg = gain_crossover(nmp, den)
    assert abs(wg - gain_crossover(mp, den)) < 1e-9
    assert abs(wg - 0.550251) < 5e-6, wg
    pm_n = 180 + phase_deg(nmp, den, wg)
    pm_m = 180 + phase_deg(mp, den, wg)
    assert abs(pm_n - 45.7953) < 5e-4, pm_n
    assert abs(pm_m - 103.4389) < 5e-4, pm_m
    assert abs((pm_m - pm_n) - 2 * np.degrees(np.arctan(wg))) < 1e-9
    assert abs(abs(Lval(nmp, den, 1j * w)) - abs(Lval(mp, den, 1j * w))).max() < 1e-12

    fig, ax = plt.subplots()
    ax.semilogx(w, ph_m, color=c[0], lw=2.3)
    ax.semilogx(w, ph_n, color=c[1], lw=2.3)
    ax.axhline(-180.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.axvline(wg, color=S.GUIDE[mode], lw=1.1, ls=":")
    S.label_end(ax, 4.0, np.interp(4.0, w, ph_m), "zero at -2 (minimum phase)",
                c[0], mode, dx=-8, dy=14, ha="right")
    S.label_end(ax, 12.0, np.interp(12.0, w, ph_n), "zero at +2 (non-minimum phase)",
                c[1], mode, dx=-8, dy=16, ha="right")
    for pmv, col in ((pm_m, c[0]), (pm_n, c[1])):
        ax.plot([wg], [pmv - 180.0], "o", color=col, ms=7, zorder=6)
    S.note(ax, wg * 1.12, -60, "both cross 0 dB at 0.5503 rad/s", mode)
    S.note(ax, 0.043, -282,
           "identical magnitude curves, 57.64 deg of margin apart:\n"
           "a right-half-plane zero has the gain of a zero and the phase of a pole",
           mode)
    ax.set_xlabel("frequency  (rad/s)")
    ax.set_ylabel("open-loop phase  (degrees)")
    ax.set_title("The sign of a zero is worth 57 degrees")
    ax.set_ylim(-285, -48)
    S.strip(ax)
    return fig


@figure("ctl3-nyquist-stable")
def _(mode):
    """Nyquist of 6/[(s+1)(s+2)(s+3)], with the -1 point for scale.

    The negative-real-axis crossing is at exactly -0.1, reached at sqrt11
    rad/s, so the gain margin is 10 (20 dB). The encirclement count returned by
    accumulating the argument of 1 + L along the traced contour is asserted to
    be zero, and Z = N + P = 0 is checked against the closed-loop roots.
    """
    c = S.SERIES[mode]
    num, den = np.array([6.0]), P(P([1.0, 1.0], [1.0, 2.0]), [1.0, 3.0])
    w = np.logspace(-2, 3, 60000)
    G = Lval(num, den, 1j * w)
    wc = np.sqrt(11.0)
    assert abs(Lval(num, den, 1j * wc).real + 0.1) < 1e-9
    assert abs(Lval(num, den, 1j * wc).imag) < 1e-9
    N = winding(num, den)
    assert abs(N) < 5e-3, N
    assert all(r.real < 0 for r in np.roots(den + np.array([0, 0, 0, 6.0])))
    assert all(r.real < 0 for r in np.roots(den))

    fig, ax = plt.subplots()
    ax.plot(G.real, G.imag, color=c[0], lw=2.2)
    ax.plot(G.real, -G.imag, color=c[0], lw=2.2, ls=":")
    ax.plot([-1.0], [0.0], "+", color=S.INK[mode], ms=13, mew=2.0, zorder=7)
    S.note(ax, -1.0, -0.06, "critical point -1", mode, ha="center", va="top")
    ax.plot([-0.1], [0.0], "o", color=c[1], ms=8, zorder=7)
    S.note(ax, -1.42, 0.44,
           "crosses the negative real axis at -0.1000,\n"
           "where w = sqrt11 = 3.3166 rad/s, so the\n"
           "gain may rise by a factor of 10 (20 dB)", mode)
    S.label_end(ax, 1.32, 0.0, "starts at the DC gain, 1.0000", c[0], mode, dx=0,
                dy=46, ha="right")
    S.note(ax, -1.42, -1.02,
           "the curve never wraps the critical point:\nN = 0, P = 0, so Z = 0", mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.axvline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of L(jw)")
    ax.set_ylabel("imaginary part of L(jw)")
    ax.set_title("An open-loop-stable plant: keep -1 outside")
    ax.set_xlim(-1.50, 1.35)
    ax.set_ylim(-1.25, 0.95)
    S.strip(ax)
    return fig


@figure("ctl3-nyquist-unstable")
def _(mode):
    """K/[(s-1)(s+3)] at two gains: the criterion demands an encirclement.

    One open-loop pole is in the right half plane, so P = 1 and stability needs
    N = -1. At K = 6 the traced contour supplies it and the closed loop is
    stable; at K = 2 it does not, and Z = 1. Both encirclement counts and both
    closed-loop root counts are asserted.
    """
    c = S.SERIES[mode]
    den = P([1.0, -1.0], [1.0, 3.0])
    assert sum(1 for r in np.roots(den) if r.real > 0) == 1
    w = np.logspace(-3, 3, 60000)
    fig, ax = plt.subplots()
    for K, col, lab in ((6.0, c[0], "K = 6"), (2.0, c[1], "K = 2")):
        num = np.array([K])
        G = Lval(num, den, 1j * w)
        N = winding(num, den)
        Z = sum(1 for r in np.roots(den + np.array([0, 0, K])) if r.real > 0)
        assert abs(N - (-1.0 if K == 6.0 else 0.0)) < 5e-3, (K, N)
        assert Z == (0 if K == 6.0 else 1), (K, Z)
        assert abs(N + 1 - Z) < 5e-3, (K, N, Z)
        assert abs(Lval(num, den, 0.0).real + K / 3) < 1e-12
        ax.plot(G.real, G.imag, color=col, lw=2.2)
        ax.plot(G.real, -G.imag, color=col, lw=2.2, ls=":")
        S.label_end(ax, -K / 3, 0.0, f"{lab}: starts at {-K/3:.4f}", col, mode,
                    dx=4 if K == 6.0 else 4, dy=16 if K == 6.0 else -18)
    ax.plot([-1.0], [0.0], "+", color=S.INK[mode], ms=13, mew=2.0, zorder=7)
    S.note(ax, -1.0, -0.14, "critical point -1", mode, ha="center", va="top")
    S.note(ax, -2.18, -1.30,
           "K = 6 wraps -1 once counter-clockwise: N = -1, P = 1, Z = 0, stable.\n"
           "K = 2 stops short of it: N = 0, so Z = 1 and one closed-loop pole\n"
           "sits at +0.4142 - even though the gain never reaches unity.", mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.axvline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("real part of L(jw)")
    ax.set_ylabel("imaginary part of L(jw)")
    ax.set_title("An unstable plant needs its critical point wrapped")
    ax.set_xlim(-2.25, 1.05)
    ax.set_ylim(-1.75, 1.35)
    S.strip(ax)
    return fig


@figure("ctl3-bandwidth-peak")
def _(mode):
    """Closed-loop magnitude for three dampings, with the -3 dB bandwidth marked.

    T(s) = wn^2/(s^2 + 2 zeta wn s + wn^2) with wn = 1. Bandwidth is found by
    solving |T| = 1/sqrt2 numerically; the peak is read off the same sweep and
    checked against 1/(2 zeta sqrt(1 - zeta^2)).
    """
    c = S.SERIES[mode]
    w = np.logspace(-1, 0.8, 6000)
    fig, ax = plt.subplots()
    for z, col in ((0.3, c[1]), (0.5, c[0]), (0.7071, c[2])):
        den = np.array([1.0, 2 * z, 1.0])
        T = Lval([1.0], den, 1j * w)
        wb = gain_crossover([1.0], den, 1 / np.sqrt(2))
        want = np.sqrt(1 - 2 * z * z + np.sqrt(4 * z ** 4 - 4 * z * z + 2))
        assert abs(wb - want) < 5e-5, (z, wb, want)
        if z < 0.7:
            Mr = 1 / (2 * z * np.sqrt(1 - z * z))
            assert abs(abs(T).max() - Mr) < 2e-4, (z, abs(T).max(), Mr)
            assert abs(w[np.argmax(abs(T))] - np.sqrt(1 - 2 * z * z)) < 3e-3
        ax.semilogx(w, 20 * np.log10(abs(T)), color=col, lw=2.2)
        ax.plot([wb], [-20 * np.log10(np.sqrt(2))], "o", color=col, ms=7, zorder=6)
        S.label_end(ax, 1.9, 20 * np.log10(abs(Lval([1.0], den, 1j * 1.9))),
                    f"zeta = {z},  bandwidth {wb:.4f} wn", col, mode, dx=7)
    ax.axhline(-20 * np.log10(np.sqrt(2)), color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 0.105, -2.6, "-3.0103 dB, where the bandwidth is read", mode)
    S.note(ax, 0.105, -17.5,
           "resonant peak 4.847 dB at zeta = 0.3 and 1.249 dB at 0.5;\n"
           "at 0.7071 the curve has no peak and the bandwidth is exactly wn", mode)
    ax.set_xlabel("frequency as a multiple of  wn")
    ax.set_ylabel("closed-loop magnitude  (dB)")
    ax.set_title("Bandwidth and resonant peak both come from damping")
    ax.set_xlim(0.1, 12.0)
    ax.set_ylim(-20, 8)
    S.strip(ax)
    return fig


@figure("ctl3-margin-vs-zeta")
def _(mode):
    """Exact phase margin against damping, with the PM = 100 zeta rule beside it.

    For L = wn^2/[s(s + 2 zeta wn)] the crossover is at
    wn sqrt(sqrt(1 + 4 zeta^4) - 2 zeta^2) and PM = arctan(2 zeta / that), a
    result independent of wn. The rule of thumb is asserted to stay within
    3.33 degrees below zeta = 0.6 (worst at zeta = 0.335) and to be more than
    23 degrees out by zeta = 1.
    """
    c = S.SERIES[mode]
    z = np.linspace(0.02, 1.0, 3000)
    g = np.sqrt(np.sqrt(4 * z ** 4 + 1) - 2 * z * z)
    pm = np.degrees(np.arctan(2 * z / g))
    rule = 100 * z
    for zz, want in ((0.3, 33.2725), (0.5, 51.8273), (0.6, 59.1873), (0.7071, 65.5298)):
        gg = np.sqrt(np.sqrt(4 * zz ** 4 + 1) - 2 * zz * zz)
        assert abs(np.degrees(np.arctan(2 * zz / gg)) - want) < 5e-4, (zz, want)
    m = z <= 0.6
    worst = np.abs(pm[m] - rule[m])
    assert abs(worst.max() - 3.3289) < 5e-4, worst.max()
    assert abs(z[m][int(np.argmax(worst))] - 0.3353) < 5e-4
    assert abs((pm[-1] - rule[-1]) + 23.6546) < 5e-3, pm[-1] - rule[-1]

    fig, ax = plt.subplots()
    ax.plot(z, pm, color=c[0], lw=2.3)
    ax.plot(z, rule, color=c[1], lw=1.9, ls="--")
    S.label_end(ax, 0.90, np.interp(0.90, z, pm), "exact", c[0], mode, dy=-16)
    S.label_end(ax, 0.72, 72.0, "the PM = 100 zeta rule", c[1], mode, dx=-8,
                dy=6, ha="right")
    for zz, lab in ((0.3, "33.27 deg"), (0.5, "51.83 deg"), (0.7071, "65.53 deg")):
        gg = np.sqrt(np.sqrt(4 * zz ** 4 + 1) - 2 * zz * zz)
        v = np.degrees(np.arctan(2 * zz / gg))
        ax.plot([zz], [v], "o", color=S.INK[mode], ms=6, zorder=6)
        S.note(ax, zz + 0.015, v - 6.5, lab, mode)
    S.note(ax, 0.05, 82,
           "the rule is worth using below zeta = 0.6 and\nnot worth using above it", mode)
    ax.set_xlabel("damping ratio of the closed-loop pair,  zeta")
    ax.set_ylabel("phase margin  (degrees)")
    ax.set_title("Where the phase-margin shortcut earns its keep")
    ax.set_xlim(0, 1.02)
    ax.set_ylim(0, 100)
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
        assert n.startswith("ctl3-"), f"figure stem outside this wave's prefix: {n}"
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
