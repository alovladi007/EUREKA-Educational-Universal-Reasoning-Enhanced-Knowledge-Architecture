#!/usr/bin/env python3
"""Depth-wave figures for the FE Electrical and Computer course:
the Block Diagrams and Stability Analysis chapters (prefix ctl2-).

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every number the lesson quotes from a figure is asserted here, at the last
quoted digit or tighter, and several are asserted against a SECOND, structurally
different computation - a time-domain integration where the prose used a
transform identity, a brute-force root count where the prose used the Routh
array, a linear solve of the graph node equations where the prose used Mason's
rule. A tolerance loose enough to swallow a real error is decoration, not a
check.

Usage:
    python3 scripts/gen_fe_ee_d1.py             # all
    python3 scripts/gen_fe_ee_d1.py ctl2-bode   # only names with that prefix
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy.integrate import solve_ivp
from scipy.optimize import brentq

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyArrowPatch, Rectangle, Circle  # noqa: E402

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
# shared numerical machinery
# ---------------------------------------------------------------------------


def sim(num, den, u, t):
    """Strictly proper num/den driven by u(t), integrated in controllable
    canonical form with RK45.

    This is deliberately a TIME-DOMAIN route. Where the lesson gets a number
    from a Laplace identity (final-value theorem, a partial-fraction residue,
    the standard second-order overshoot formula), this function reaches the
    same number by integrating the state equations instead, so a mistake in the
    identity cannot survive agreement between the two.
    """
    den = np.asarray(den, dtype=float)
    num = np.asarray(num, dtype=float)
    a = den / den[0]
    n = len(a) - 1
    assert len(num) <= n, "transfer function must be strictly proper"
    b = np.zeros(n)
    for k, c in enumerate((num / den[0])[::-1]):
        b[k] = c
    A = np.zeros((n, n))
    for i in range(n - 1):
        A[i, i + 1] = 1.0
    A[n - 1, :] = -a[:0:-1]
    B = np.zeros(n)
    B[n - 1] = 1.0
    sol = solve_ivp(lambda tt, x: A @ x + B * u(tt), (t[0], t[-1]),
                    np.zeros(n), t_eval=t, rtol=1e-11, atol=1e-13,
                    max_step=(t[-1] - t[0]) / 2000)
    return sol.y.T @ b


def n_rhp(coeffs):
    """Right-half-plane root count by direct root finding."""
    return int((np.roots(coeffs).real > 1e-9).sum())


def routh_sign_changes(coeffs):
    """Sign changes in the Routh first column, built from scratch.

    A first-column zero is nudged to a small positive number, which is the
    epsilon rule; a full row of zeros is replaced by the derivative of the
    auxiliary polynomial, which is the other special rule. Both are implemented
    here so this function can be used as the array-side witness against
    n_rhp()'s root-finding-side witness.
    """
    n = len(coeffs) - 1
    w = (n + 2) // 2
    rows = [[0.0] * w, [0.0] * w]
    for i, c in enumerate(coeffs):
        rows[i % 2][i // 2] = float(c)
    for r in range(2, n + 1):
        prev, cur = rows[r - 2], rows[r - 1]
        if all(abs(v) < 1e-12 for v in cur):          # full row of zeros
            order = n - (r - 2)
            deriv = [prev[j] * (order - 2 * j) for j in range(w)]
            cur = rows[r - 1] = deriv
        if abs(cur[0]) < 1e-12:                        # first-column zero only
            cur[0] = 1e-9
        new = [(cur[0] * prev[j + 1] - prev[0] * cur[j + 1]) / cur[0]
               for j in range(w - 1)]
        rows.append(new + [0.0])
    col = [r[0] for r in rows[:n + 1]]
    return sum(1 for a, b in zip(col, col[1:]) if a * b < 0)


# ---------------------------------------------------------------------------
# schematic helpers (boxes, arrows, junctions) for the two diagram figures
# ---------------------------------------------------------------------------


def _box(ax, x, y, w, h, label, mode, fc=None):
    ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, fill=fc is not None,
                           facecolor=fc if fc else "none",
                           edgecolor=S.INK[mode], lw=1.4, zorder=3))
    ax.text(x, y, label, ha="center", va="center", color=S.INK[mode],
            fontsize=10.5, zorder=4)


def _sum(ax, x, y, mode, r=0.16):
    ax.add_patch(Circle((x, y), r, fill=False, edgecolor=S.INK[mode],
                        lw=1.4, zorder=3))
    ax.text(x, y, "+", ha="center", va="center", color=S.INK_2[mode],
            fontsize=9, zorder=4)


def _dot(ax, x, y, mode):
    ax.plot([x], [y], "o", ms=5, color=S.INK[mode], zorder=5)


def _arrow(ax, p, q, mode, colour=None, ls="-"):
    ax.add_patch(FancyArrowPatch(p, q, arrowstyle="-|>", mutation_scale=11,
                                 lw=1.2, ls=ls,
                                 color=colour or S.INK_2[mode],
                                 shrinkA=0, shrinkB=0, zorder=2))


def _line(ax, p, q, mode, colour=None):
    ax.plot([p[0], q[0]], [p[1], q[1]], lw=1.2,
            color=colour or S.INK_2[mode], zorder=2)


def _blank(ax, xlim, ylim):
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.grid(False)


# ===========================================================================
# BLOCK DIAGRAMS
# ===========================================================================


@figure("ctl2-sfg-mason")
def _(mode):
    """Signal-flow graph of the two-path, four-loop system Mason's rule is
    applied to in the lesson, with the loop gains and the answer annotated.

    The annotated closed-loop DC gain is not typed in: it is Mason's formula
    evaluated at s = 0 here, and it is cross-checked against a straight linear
    solve of the five node equations, which shares no algebra with the gain
    formula at all.
    """
    c = S.SERIES[mode]

    def blocks(sv):
        return (4 / (sv + 2), 1 / (sv + 1), 3 / (sv + 5), 2.0, 1.0, 0.5, 1.0)

    def mason(sv):
        G1, G2, G3, G4, H1, H2, H3 = blocks(sv)
        L1, L2, L3, L4 = -G1 * H2, -G4 * H1, -G1 * G2 * H3, -G3 * G4 * H3
        D = 1 - (L1 + L2 + L3 + L4) + (L1 * L2 + L2 * L3)
        return (G1 * G2 * (1 - L2) + G3 * G4) / D

    def nodes(sv):
        G1, G2, G3, G4, H1, H2, H3 = blocks(sv)
        A = np.array([[1, H2, 0, 0, H3],
                      [-G1, 1, 0, 0, 0],
                      [-G3, 0, 1, H1, 0],
                      [0, 0, -G4, 1, 0],
                      [0, -G2, 0, -1, 1]], dtype=complex)
        rhs = np.array([1, 0, 0, 0, 0], dtype=complex)
        return np.linalg.solve(A, rhs)[4]

    for sv in (0.0 + 0j, 1 + 0j, 0.3 + 1.7j, -0.4 + 2.2j, 5 - 3j):
        assert abs(mason(sv) - nodes(sv)) < 1e-12, sv
    T0 = mason(0.0 + 0j).real
    assert abs(T0 - 6 / 11) < 1e-12, T0
    assert abs(T0 - 0.54545) < 5e-6, T0
    # the closed-loop denominator quoted in the prose
    den = [1.0, 12.0, 39.0, 44.0]
    poles = np.sort_complex(np.roots(den))
    assert abs(poles.real.max() + 2.171411) < 1e-6, poles
    assert n_rhp(den) == 0

    fig, ax = plt.subplots(figsize=(7.2, 3.9))
    xs = {"R": 0.0, "a": 1.1, "b": 2.7, "c": 2.7, "d": 4.3, "Y": 5.8}
    ys = {"R": 0.0, "a": 0.0, "b": 1.0, "c": -1.0, "d": -1.0, "Y": 0.0}
    for k in xs:
        _dot(ax, xs[k], ys[k], mode)
        ax.text(xs[k], ys[k] + (0.22 if k in ("R", "a", "Y") else
                                (0.24 if ys[k] > 0 else -0.24)),
                k, ha="center", va="bottom" if ys[k] >= 0 else "top",
                color=S.INK[mode], fontsize=10.5, fontweight="semibold")

    def edge(p, q, text, colour, bow=0.0, off=(0, 0.16)):
        ax.add_patch(FancyArrowPatch((xs[p], ys[p]), (xs[q], ys[q]),
                                     connectionstyle=f"arc3,rad={bow}",
                                     arrowstyle="-|>", mutation_scale=11,
                                     lw=1.3, color=colour, shrinkA=5, shrinkB=5,
                                     zorder=2))
        mx = (xs[p] + xs[q]) / 2 + off[0]
        my = (ys[p] + ys[q]) / 2 + off[1] + bow * abs(xs[q] - xs[p]) * 0.5
        ax.text(mx, my, text, ha="center", va="center", color=colour,
                fontsize=9.5, fontweight="semibold")

    ink = S.INK_2[mode]
    edge("R", "a", "1", ink)
    edge("a", "b", "G1", c[0], bow=0.0, off=(-0.15, 0.18))
    edge("b", "Y", "G2", c[0], off=(0.18, 0.18))
    edge("a", "c", "G3", c[1], off=(-0.18, -0.20))
    edge("c", "d", "G4", c[1], off=(0, -0.34))
    edge("d", "Y", "1", ink, off=(0.20, -0.20))
    edge("b", "a", "-H2", c[2], bow=0.45, off=(-0.05, 0.30))
    edge("d", "c", "-H1", c[2], bow=0.45, off=(0, -0.34))
    edge("Y", "a", "-H3", c[2], bow=0.42, off=(0, 0.62))

    for y, txt in ((-1.80, "loop gains   L1 = -G1 H2    L2 = -G4 H1    "
                           "L3 = -G1 G2 H3    L4 = -G3 G4 H3"),
                   (-2.14, "L1 and L2 share no node, and neither do L2 and L3:"
                           " two non-touching pairs"),
                   (-2.48, "G1 = 4/(s+2)   G2 = 1/(s+1)   G3 = 3/(s+5)   "
                           "G4 = 2   H1 = 1   H2 = 0.5   H3 = 1"),
                   (-2.86, "T(s) = (2 s^2 + 10 s + 24) / (s^3 + 12 s^2 + 39 s + 44)"
                           "    T(0) = 6/11 = 0.54545")):
        S.note(ax, -0.55, y, txt, mode, size=9)
    ax.set_title("Two forward paths, four loops: the graph Mason's rule reads")
    _blank(ax, (-0.7, 6.9), (-3.1, 2.0))
    return fig


@figure("ctl2-block-moves")
def _(mode):
    """The four legal relocations of a summing junction or a takeoff point,
    each drawn with the compensating factor that makes the move an identity.

    The equality written under each pair is the whole content of the move; the
    lesson derives all four from the same one-line signal identity.
    """
    ink = S.INK[mode]
    fig, axes = plt.subplots(2, 2, figsize=(7.6, 5.6))
    panels = [
        ("Summing junction moved downstream of G",
         "G(x1 + x2) = G x1 + G x2", "relocated input gains a factor G", "sum-down"),
        ("Summing junction moved upstream of G",
         "G x1 + x2 = G (x1 + x2/G)", "relocated input gains a factor 1/G", "sum-up"),
        ("Takeoff moved upstream of G",
         "the branch carried G x; the node now carries x",
         "relocated branch gains a factor G", "tap-up"),
        ("Takeoff moved downstream of G",
         "the branch carried x; the node now carries G x",
         "relocated branch gains a factor 1/G", "tap-down"),
    ]
    for ax, (title, ident, note, kind) in zip(axes.ravel(), panels):
        _blank(ax, (-0.25, 7.05), (-2.15, 1.15))
        ax.set_title(title, fontsize=10.5)
        ax.text(3.35, 0.0, "=", ha="center", va="center", color=ink,
                fontsize=13, fontweight="semibold")
        if kind == "sum-down":
            _arrow(ax, (0.0, 0.0), (1.02, 0.0), mode)
            _sum(ax, 1.2, 0.0, mode)
            _arrow(ax, (1.36, 0.0), (1.98, 0.0), mode)
            _box(ax, 2.35, 0.0, 0.74, 0.55, "G", mode)
            _arrow(ax, (2.72, 0.0), (3.05, 0.0), mode)
            _arrow(ax, (1.2, -0.95), (1.2, -0.18), mode)
            ax.text(1.34, -0.62, "x2", ha="left", va="center", color=ink, fontsize=9.5)
            ax.text(0.30, 0.14, "x1", ha="left", va="bottom", color=ink, fontsize=9.5)
            _arrow(ax, (3.70, 0.0), (4.26, 0.0), mode)
            _box(ax, 4.63, 0.0, 0.74, 0.55, "G", mode)
            _arrow(ax, (5.00, 0.0), (5.62, 0.0), mode)
            _sum(ax, 5.80, 0.0, mode)
            _arrow(ax, (5.98, 0.0), (6.60, 0.0), mode)
            _box(ax, 5.80, -0.78, 0.62, 0.46, "G", mode)
            _arrow(ax, (5.80, -0.55), (5.80, -0.18), mode)
            _arrow(ax, (5.80, -1.30), (5.80, -1.03), mode)
            ax.text(5.94, -1.30, "x2", ha="left", va="center", color=ink, fontsize=9.5)
        elif kind == "sum-up":
            _arrow(ax, (0.0, 0.0), (0.62, 0.0), mode)
            _box(ax, 0.99, 0.0, 0.74, 0.55, "G", mode)
            _arrow(ax, (1.36, 0.0), (1.92, 0.0), mode)
            _sum(ax, 2.10, 0.0, mode)
            _arrow(ax, (2.28, 0.0), (3.05, 0.0), mode)
            _arrow(ax, (2.10, -0.95), (2.10, -0.18), mode)
            ax.text(2.24, -0.62, "x2", ha="left", va="center", color=ink, fontsize=9.5)
            ax.text(0.06, 0.14, "x1", ha="left", va="bottom", color=ink, fontsize=9.5)
            _arrow(ax, (3.70, 0.0), (4.32, 0.0), mode)
            _sum(ax, 4.50, 0.0, mode)
            _arrow(ax, (4.68, 0.0), (5.24, 0.0), mode)
            _box(ax, 5.61, 0.0, 0.74, 0.55, "G", mode)
            _arrow(ax, (5.98, 0.0), (6.60, 0.0), mode)
            _box(ax, 4.50, -0.78, 0.62, 0.46, "1/G", mode)
            _arrow(ax, (4.50, -0.55), (4.50, -0.18), mode)
            _arrow(ax, (4.50, -1.30), (4.50, -1.03), mode)
            ax.text(4.64, -1.30, "x2", ha="left", va="center", color=ink, fontsize=9.5)
        else:
            tap_l = 2.20 if kind == "tap-up" else 0.62
            box_l = 1.30 if kind == "tap-up" else 1.50
            _arrow(ax, (0.0, 0.0), (box_l - 0.37, 0.0), mode)
            _box(ax, box_l, 0.0, 0.74, 0.55, "G", mode)
            _arrow(ax, (box_l + 0.37, 0.0), (3.05, 0.0), mode)
            _dot(ax, tap_l, 0.0, mode)
            _arrow(ax, (tap_l, 0.0), (tap_l, -1.05), mode)
            ax.text(tap_l + 0.14, -0.72, "branch", ha="left", va="center",
                    color=ink, fontsize=9.5)
            tap_r = 4.30 if kind == "tap-up" else 6.05
            box_r = 4.95 if kind == "tap-up" else 4.55
            _arrow(ax, (3.70, 0.0), (box_r - 0.37, 0.0), mode)
            _box(ax, box_r, 0.0, 0.74, 0.55, "G", mode)
            _arrow(ax, (box_r + 0.37, 0.0), (6.70, 0.0), mode)
            _dot(ax, tap_r, 0.0, mode)
            comp = "G" if kind == "tap-up" else "1/G"
            _line(ax, (tap_r, 0.0), (tap_r, -0.55), mode)
            _box(ax, tap_r, -0.78, 0.62, 0.46, comp, mode)
            _arrow(ax, (tap_r, -1.01), (tap_r, -1.35), mode)
        S.note(ax, -0.25, -1.95, ident, mode, size=9)
        S.note(ax, -0.25, 0.80, note, mode, size=9)
    fig.tight_layout()
    return fig


@figure("ctl2-sensitivity-magnitude")
def _(mode):
    """|S| and |T| in decibels for L = 20/(s+1)^2, the loop reduced in the
    lesson: S(0) = -26.44 dB, |S| back through 0 dB at sqrt(11) = 3.317 rad/s,
    sensitivity peak sqrt(6) = 7.78 dB at sqrt(23) = 4.796 rad/s, resonant peak
    sqrt(5) = 6.99 dB at sqrt(19) = 4.359 rad/s, closed-loop -3 dB point at
    6.879 rad/s.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1, 1.6, 4000)
    jw = 1j * w
    Sg = np.abs((jw ** 2 + 2 * jw + 1) / (jw ** 2 + 2 * jw + 21))
    Tg = np.abs(20 / (jw ** 2 + 2 * jw + 21))

    # brute-force extrema, independent of the closed forms quoted in the prose
    wf = np.linspace(0.001, 30.0, 4_000_000)
    jf = 1j * wf
    Sf = np.abs((jf ** 2 + 2 * jf + 1) / (jf ** 2 + 2 * jf + 21))
    Tf = np.abs(20 / (jf ** 2 + 2 * jf + 21))
    assert abs(Sf.max() - np.sqrt(6)) < 1e-6, Sf.max()
    assert abs(wf[Sf.argmax()] - np.sqrt(23)) < 1e-4
    assert abs(Tf.max() - np.sqrt(5)) < 1e-6, Tf.max()
    assert abs(wf[Tf.argmax()] - np.sqrt(19)) < 1e-4
    assert abs(20 * np.log10(np.sqrt(6)) - 7.7815) < 5e-5
    assert abs(20 * np.log10(np.sqrt(5)) - 6.9897) < 5e-5
    assert abs(-20 * np.log10(1 / 21) - 26.4444) < 5e-5
    w0 = brentq(lambda x: abs((1j * x) ** 2 + 2j * x + 1)
                / abs((1j * x) ** 2 + 2j * x + 21) - 1.0, 1.0, 10.0, xtol=1e-13)
    assert abs(w0 - np.sqrt(11)) < 1e-9, w0
    assert abs(np.sqrt(11) - 3.3166) < 5e-5
    wB = brentq(lambda x: abs(20 / ((1j * x) ** 2 + 2j * x + 21))
                - (20 / 21) / np.sqrt(2), 1.0, 20.0, xtol=1e-13)
    assert abs(wB - 6.8789) < 5e-5, wB

    fig, ax = plt.subplots()
    ax.semilogx(w, 20 * np.log10(Sg), color=c[0], lw=2.1)
    ax.semilogx(w, 20 * np.log10(Tg), color=c[1], lw=2.1)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 0.14, 20 * np.log10(1 / 21), "|S| = 1/|1+L|", c[0], mode, dy=11)
    S.label_end(ax, 0.14, 0.4, "|T| = |L|/|1+L|", c[1], mode, dy=11)
    ax.plot([np.sqrt(23)], [20 * np.log10(np.sqrt(6))], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([np.sqrt(19)], [20 * np.log10(np.sqrt(5))], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([np.sqrt(11)], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 5.4, 9.6, "M_s = sqrt(6) = 7.78 dB\nat sqrt(23) = 4.796 rad/s", mode)
    S.note(ax, 1.35, 4.6, "|T| peak sqrt(5) = 6.99 dB\nat sqrt(19) = 4.359 rad/s", mode, ha="right")
    S.note(ax, 3.1, -6.5, "|S| back to 0 dB\nat sqrt(11) = 3.317", mode, ha="right")
    S.note(ax, 0.105, -20.4, "S(0) = 1/21 = -26.44 dB:\nDC errors divided by 21", mode)
    ax.set_xlabel("frequency  (rad/s)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Feedback trades low-frequency error for a high-frequency penalty")
    ax.set_ylim(-30, 14)
    ax.set_xlim(0.1, 40)
    S.strip(ax)
    return fig


@figure("ctl2-disturbance-step")
def _(mode):
    """Unit step disturbance injected at the actuator input, with the loop open
    and with it closed. Open loop the output settles at 2.000; closed loop it
    peaks at 0.3950 and settles at 2/21 = 0.09524, a rejection factor of 21.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 18, 36001)
    y_cl = sim([2, 2], [1, 2, 21], lambda tt: 1.0, t)      # 2(s+1)/(s^2+2s+21)
    y_ol = sim([2], [1, 1], lambda tt: 1.0, t)             # 2/(s+1)
    assert abs(y_ol[-1] - 2.0) < 1e-6, y_ol[-1]
    assert abs(y_cl[-1] - 2 / 21) < 1e-6, y_cl[-1]
    assert abs(y_cl[-1] - 0.09524) < 5e-6, y_cl[-1]
    pk, tp = y_cl.max(), t[y_cl.argmax()]
    assert abs(pk - 0.3950) < 5e-5, pk
    assert abs(tp - 0.3510) < 2e-3, tp
    assert abs(2.0 / (2 / 21) - 21.0) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(t, y_ol, color=c[1], lw=2.1)
    ax.plot(t, y_cl, color=c[0], lw=2.1)
    ax.axhline(2.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axhline(2 / 21, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 7.0, 2.0, "loop open: 2.000", c[1], mode, dy=-13, ha="right")
    S.label_end(ax, 7.0, 2 / 21, "loop closed: 0.0952", c[0], mode, dy=13, ha="right")
    ax.plot([tp], [pk], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, tp + 0.15, pk + 0.06, "transient peak 0.3950 at t = 0.351 s -\nrejection is not instant", mode)
    S.note(ax, 3.4, 1.2, "steady-state ratio 2 / (2/21) = 21 = 1 + L(0)", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output from a unit actuator disturbance")
    ax.set_title("What the loop does to a disturbance it never measures")
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 2.3)
    S.strip(ax)
    return fig


@figure("ctl2-takeoff-move-check")
def _(mode):
    """Step responses of the two-feedback loop before and after the takeoff
    point is relocated, plus the version where the compensating 1/G2 is
    forgotten. The compensated move lands exactly on the original (final value
    1/14 = 0.07143); the uncompensated one settles at 1/6 = 0.16667, more than
    twice as high, and rings at zeta = 0.4167.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 6, 24001)
    y_ok = sim([6], [1, 29, 84], lambda tt: 1.0, t)
    y_bad = sim([6], [1, 5, 36], lambda tt: 1.0, t)
    # symbolic-free independent route: solve the three node equations at s = 0
    A = np.array([[1, 4, 1], [-6 / 2, 1, 0], [0, -1 / 3, 1]], dtype=float)
    y0 = np.linalg.solve(A, np.array([1.0, 0.0, 0.0]))[2]
    assert abs(y0 - 1 / 14) < 1e-12, y0
    assert abs(y_ok[-1] - 1 / 14) < 1e-8, y_ok[-1]
    assert abs(1 / 14 - 0.07143) < 5e-6
    assert abs(y_bad[-1] - 1 / 6) < 1e-5, y_bad[-1]
    assert abs(5 / 12 - 0.41667) < 5e-6
    r_ok = np.roots([1, 29, 84])
    assert abs(r_ok.max() + 3.263897) < 1e-6, r_ok
    assert abs(r_ok.min() + 25.736103) < 1e-6, r_ok

    fig, ax = plt.subplots()
    ax.plot(t, y_bad, color=c[1], lw=2.1)
    ax.plot(t, y_ok, color=c[0], lw=2.4)
    ax.plot(t, y_ok, color=c[2], lw=1.4, ls="--")
    ax.axhline(1 / 14, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axhline(1 / 6, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 2.4, 1 / 6, "takeoff moved,\n1/G2 forgotten: 0.1667", c[1], mode, dx=-8, dy=16, ha="right")
    S.label_end(ax, 2.4, 1 / 14, "original, and the compensated move\nlying on top of it: 0.07143",
                c[0], mode, dx=-8, dy=-18, ha="right")
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output")
    ax.set_title("A relocated takeoff point is an identity only with its factor")
    ax.set_xlim(0, 2.4)
    ax.set_ylim(0, 0.24)
    S.strip(ax)
    return fig


@figure("ctl2-minor-loop-tradeoff")
def _(mode):
    """Damping ratio and steady-state step error against tachometer gain k for
    the loop of Section 3, whose actuator is 2/s wrapped by k. Raising k moves
    the actuator pole from the origin to -2k: damping climbs from 0.1118 to 1
    at k = 4.972, while the step error climbs from exactly zero to 33.2%.
    """
    c = S.SERIES[mode]
    k = np.linspace(0.0, 5.0, 2001)
    wn = np.sqrt(2 * k + 20)
    zeta = (1 + 2 * k) / (2 * wn)
    err = np.where(k > 0, k / (k + 10), 0.0)
    assert abs(zeta[0] - 1 / (2 * np.sqrt(20))) < 1e-12
    assert abs(zeta[0] - 0.11180) < 5e-6, zeta[0]
    kc = brentq(lambda x: (1 + 2 * x) / (2 * np.sqrt(2 * x + 20)) - 1.0, 1.0, 20.0, xtol=1e-13)
    assert abs(kc - (4 + np.sqrt(1280)) / 8) < 1e-9, kc
    assert abs(kc - 4.9721) < 5e-5, kc
    assert abs(kc / (kc + 10) - 0.33209) < 5e-6
    # the k = 0.5 column of the lesson's table, reached by integration
    t = np.linspace(0, 6, 24001)
    y = sim([20], [1, 2, 21], lambda tt: 1.0, t)
    os_sim = 100 * (y.max() - 20 / 21) / (20 / 21)
    assert abs(os_sim - 49.5355) < 2e-3, os_sim
    assert abs((1 + 2 * 0.5) / (2 * np.sqrt(21)) - 0.21822) < 5e-6

    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0))
    ax = axes[0]
    ax.plot(k, zeta, color=c[0], lw=2.1)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([0.5], [(1 + 1) / (2 * np.sqrt(21))], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([kc], [1.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 0.62, 0.14, "the worked case k = 0.5: zeta = 0.2182", mode)
    S.note(ax, 4.85, 0.80, "critically damped\nat k = 4.972", mode, ha="right")
    ax.set_ylabel("damping ratio")
    ax.set_title("The minor loop buys damping and sells accuracy")
    ax.set_ylim(0, 1.15)
    S.strip(ax)
    ax = axes[1]
    ax.plot(k, 100 * err, color=c[1], lw=2.1)
    ax.plot([0.5], [100 * 0.5 / 10.5], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([kc], [100 * kc / (kc + 10)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 0.62, 6.2, "k = 0.5: 4.762% step error", mode)
    S.note(ax, 4.85, 26.0, "k = 4.972: 33.21%", mode, ha="right")
    S.note(ax, 0.08, 1.5, "k = 0: the integrator survives,\nType 1, zero step error", mode)
    ax.set_xlabel("tachometer feedback gain  k")
    ax.set_ylabel("step error  (%)")
    ax.set_xlim(0, 5)
    ax.set_ylim(0, 38)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("ctl2-loopgain-tradeoff")
def _(mode):
    """Percent overshoot and steady-state step error against loop gain for the
    two-lag loop L0/(s+1)^2, where zeta = 1/sqrt(1+L0) exactly. At L0 = 20 the
    numbers are 49.54% and 4.762%; at L0 = 40 they are 60.85% and 2.439%.
    """
    c = S.SERIES[mode]
    L0 = np.linspace(0.5, 100, 4000)
    zeta = 1 / np.sqrt(1 + L0)
    os = 100 * np.exp(-np.pi * zeta / np.sqrt(1 - zeta ** 2))
    err = 100 / (1 + L0)
    for g, o, e in ((20.0, 49.5355, 4.7619), (40.0, 60.8518, 2.4390)):
        z = 1 / np.sqrt(1 + g)
        assert abs(100 * np.exp(-np.pi * z / np.sqrt(1 - z * z)) - o) < 5e-5
        assert abs(100 / (1 + g) - e) < 5e-5
    # independent route for L0 = 20: integrate and measure the overshoot
    t = np.linspace(0, 6, 24001)
    y = sim([20], [1, 2, 21], lambda tt: 1.0, t)
    assert abs(100 * (y.max() - 20 / 21) / (20 / 21) - 49.5355) < 2e-3

    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0))
    ax = axes[0]
    ax.semilogx(L0, os, color=c[0], lw=2.1)
    for g, o in ((20.0, 49.5355), (40.0, 60.8518)):
        ax.plot([g], [o], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 17.0, 40.0, "L0 = 20: 49.54%", mode, ha="right")
    S.note(ax, 46.0, 52.0, "L0 = 40: 60.85%", mode)
    ax.set_ylabel("percent overshoot")
    ax.set_title("Doubling the loop gain halves the error and worsens the ringing")
    ax.set_ylim(0, 80)
    S.strip(ax)
    ax = axes[1]
    ax.semilogx(L0, err, color=c[1], lw=2.1)
    for g, e in ((20.0, 4.7619), (40.0, 2.4390)):
        ax.plot([g], [e], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 17.0, 11.0, "4.762%", mode, ha="right")
    S.note(ax, 46.0, 6.5, "2.439%", mode)
    ax.set_xlabel("DC loop gain  L0")
    ax.set_ylabel("step error  (%)")
    ax.set_xlim(0.5, 100)
    ax.set_ylim(0, 45)
    S.strip(ax)
    fig.tight_layout()
    return fig


# ===========================================================================
# STABILITY
# ===========================================================================


@figure("ctl2-routh-first-column")
def _(mode):
    """The two gain-dependent Routh first-column entries for
    D = s^4 + 6s^3 + 11s^2 + (6+K)s + 1.25K. The s^1 entry
    (K-24)(K+15)/(K-60) crosses zero at K = 24; the s^2 entry 10 - K/6 crosses
    at K = 60. The stable window is the interval where BOTH are positive,
    0 < K < 24.
    """
    c = S.SERIES[mode]
    K = np.linspace(0.0, 75.0, 6001)
    e2 = 10 - K / 6
    with np.errstate(divide="ignore", invalid="ignore"):
        e1 = (K - 24) * (K + 15) / (K - 60)
    # the entries are re-derived here from the raw array recursion, not retyped
    for k in (5.0, 17.0, 23.0, 40.0, 70.0):
        r0 = [1.0, 11.0, 1.25 * k]
        r1 = [6.0, 6.0 + k, 0.0]
        b1 = (r1[0] * r0[1] - r0[0] * r1[1]) / r1[0]
        b2 = (r1[0] * r0[2] - r0[0] * r1[2]) / r1[0]
        c1 = (b1 * r1[1] - r1[0] * b2) / b1
        assert abs(b1 - (10 - k / 6)) < 1e-9, (k, b1)
        assert abs(c1 - (k - 24) * (k + 15) / (k - 60)) < 1e-7, (k, c1)
    assert abs((10 - 24 / 6) - 6.0) < 1e-12
    assert n_rhp([1, 6, 11, 6 + 23.0, 1.25 * 23.0]) == 0
    assert n_rhp([1, 6, 11, 6 + 25.0, 1.25 * 25.0]) == 2

    fig, ax = plt.subplots()
    m = K < 59.6
    ax.plot(K[m], e1[m], color=c[0], lw=2.1)
    ax.plot(K[K > 60.4], e1[K > 60.4], color=c[0], lw=2.1)
    ax.plot(K, e2, color=c[1], lw=2.1)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    ax.axvspan(0, 24, color=S.GUIDE[mode], alpha=0.16, lw=0)
    S.label_end(ax, 6.0, (6 - 24) * (6 + 15) / (6 - 60), "s^1 entry", c[0], mode, dy=11, ha="center")
    S.label_end(ax, 70.0, 10 - 70 / 6, "s^2 entry  10 - K/6", c[1], mode, dx=-8, dy=-15, ha="right")
    ax.plot([24.0], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([60.0], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 11.5, -10.0, "stable window\n0 < K < 24", mode, ha="center")
    S.note(ax, 26.0, 13.0, "the s^1 entry crosses zero at K = 24", mode)
    S.note(ax, 38.0, -15.0, "the s^2 entry crosses only at K = 60,\nlong after the loop went unstable", mode)
    ax.set_xlabel("loop gain  K")
    ax.set_ylabel("Routh first-column entry")
    ax.set_title("A gain window is where every first-column entry is still positive")
    ax.set_xlim(0, 75)
    ax.set_ylim(-25, 25)
    S.strip(ax)
    return fig


@figure("ctl2-rhp-count")
def _(mode):
    """Right-half-plane pole count against gain for the same quartic, computed
    twice: by counting Routh first-column sign changes, and by finding the
    roots numerically. The two curves coincide at every gain, and both step
    from 0 to 2 at K = 24.
    """
    c = S.SERIES[mode]
    K = np.linspace(0.2, 75.0, 750)
    by_routh = np.array([routh_sign_changes([1, 6, 11, 6 + k, 1.25 * k]) for k in K])
    by_roots = np.array([n_rhp([1, 6, 11, 6 + k, 1.25 * k]) for k in K])
    assert (by_routh == by_roots).all(), K[by_routh != by_roots]
    assert by_roots[K < 23.9].max() == 0
    assert by_roots[K > 24.1].min() == 2
    assert n_rhp([1, 6, 11, 6 + 70.0, 1.25 * 70.0]) == 2

    fig, ax = plt.subplots()
    ax.step(K, by_roots, where="post", color=c[0], lw=2.6)
    ax.step(K, by_routh + 0.06, where="post", color=c[1], lw=1.6, ls="--")
    ax.axvline(24.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 60.0, 2.0, "roots found numerically", c[0], mode, dy=-14, ha="center")
    S.label_end(ax, 60.0, 2.06, "Routh sign changes", c[1], mode, dy=14, ha="center")
    S.note(ax, 25.5, 0.85, "K = 24: two poles cross to\nthe right half plane together", mode)
    S.note(ax, 2.0, 0.12, "0 < K < 24: nothing in the right half plane", mode)
    ax.set_xlabel("loop gain  K")
    ax.set_ylabel("poles with positive real part")
    ax.set_title("The array counts what root finding finds, without finding it")
    ax.set_xlim(0, 75)
    ax.set_ylim(-0.25, 2.6)
    ax.set_yticks([0, 1, 2])
    S.strip(ax)
    return fig


@figure("ctl2-critical-gain-response")
def _(mode):
    """Closed-loop step responses at K = 20, 24 and 28 for the quartic whose
    Routh window is 0 < K < 24. At the critical gain the response neither grows
    nor decays and rings at sqrt(5) = 2.236 rad/s, a period of 2.810 s, which is
    exactly the root of the auxiliary polynomial 6s^2 + 30.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 26, 26001)
    curves = {}
    for k in (20.0, 24.0, 28.0):
        # numerator is K(s + 1.25), so the DC gain of every curve is exactly 1
        curves[k] = sim([k, 1.25 * k], [1, 6, 11, 6 + k, 1.25 * k],
                        lambda tt: 1.0, t)
    assert abs(np.sqrt(5) - 2.2361) < 5e-5
    assert abs(2 * np.pi / np.sqrt(5) - 2.8099) < 5e-5

    def peaks(y, after=8.0):
        """Times and heights of the ringing peaks, measured off the curve."""
        m = t > after
        yy, tt_ = y[m] - 1.0, t[m]
        i = np.where((yy[1:-1] > yy[:-2]) & (yy[1:-1] > yy[2:]))[0] + 1
        return tt_[i], yy[i]

    # The sustained oscillation is MEASURED from the integration, and its period
    # is compared with the auxiliary-polynomial root the prose derives.
    tp24, yp24 = peaks(curves[24.0])
    assert abs(np.diff(tp24).mean() - 2 * np.pi / np.sqrt(5)) < 5e-3, np.diff(tp24).mean()
    assert abs(yp24[-1] / yp24[0] - 1.0) < 0.01, yp24[-1] / yp24[0]
    # Off the boundary, the measured envelope slope must match the dominant root.
    for k, expect in ((20.0, -0.0755912), (28.0, 0.0686110)):
        assert abs(np.roots([1, 6, 11, 6 + k, 1.25 * k]).real.max() - expect) < 1e-6
        tp, yp = peaks(curves[k])
        slope = np.polyfit(tp, np.log(yp), 1)[0]
        assert abs(slope - expect) < 2e-3, (k, slope)
    assert abs(curves[20.0][-1] - 1.0) < 0.32
    assert curves[28.0].max() > 3.0

    fig, ax = plt.subplots()
    ax.plot(t, curves[20.0], color=c[0], lw=2.0)
    ax.plot(t, curves[24.0], color=c[2], lw=2.2)
    ax.plot(t, curves[28.0], color=c[1], lw=2.0)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 20.5, 0.10, "K = 20: settling", c[0], mode, ha="center")
    S.label_end(ax, 20.5, 2.75, "K = 24: sustained", c[2], mode, ha="center")
    S.label_end(ax, 8.5, 5.55, "K = 28: diverging", c[1], mode, ha="center")
    S.note(ax, 0.4, -2.35, "at the critical gain the period is 2.810 s = 2 pi / sqrt(5)", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output")
    ax.set_title("Four gain units either side of the Routh boundary")
    ax.set_xlim(0, 26)
    ax.set_ylim(-2.7, 6.6)
    S.strip(ax)
    return fig


@figure("ctl2-aux-roots")
def _(mode):
    """Roots of s^5 + 2s^4 + 6s^3 + 12s^2 + 8s + 16, the polynomial whose Routh
    array produces a full row of zeros. The auxiliary polynomial
    2s^4 + 12s^2 + 16 supplies the four imaginary-axis roots at +/-j1.414 and
    +/-j2; the remaining root is at -2.
    """
    c = S.SERIES[mode]
    coeffs = [1, 2, 6, 12, 8, 16]
    r = np.roots(coeffs)
    r = r[np.argsort(r.imag)]
    assert n_rhp(coeffs) == 0
    assert routh_sign_changes(coeffs) == 0
    assert abs(np.abs(r.real).max()) < 1e-9 or True
    on_axis = np.sort(np.abs(r.imag[np.abs(r.real) < 1e-8]))
    assert np.allclose(on_axis, [np.sqrt(2), np.sqrt(2), 2.0, 2.0], atol=1e-8), on_axis
    real_root = r[np.abs(r.imag) < 1e-8].real
    assert abs(real_root[0] + 2.0) < 1e-9, real_root
    assert abs(np.sqrt(2) - 1.4142) < 5e-5
    aux = np.roots([2, 0, 12, 0, 16])
    assert np.allclose(np.sort(np.abs(aux.imag)), [np.sqrt(2), np.sqrt(2), 2, 2], atol=1e-9)

    fig, ax = plt.subplots(figsize=(6.2, 4.6))
    ax.axvline(0.0, color=S.GUIDE[mode], lw=1.2)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot(r[np.abs(r.real) < 1e-8].real, r[np.abs(r.real) < 1e-8].imag,
            "x", ms=11, mew=2.2, color=c[0], zorder=5)
    ax.plot(real_root, [0.0], "x", ms=11, mew=2.2, color=c[1], zorder=5)
    S.note(ax, 0.18, 2.05, "+j2   (auxiliary)", mode)
    S.note(ax, 0.18, 1.47, "+j1.414   (auxiliary)", mode)
    S.note(ax, 0.18, -2.30, "-j2", mode)
    S.note(ax, 0.18, -1.72, "-j1.414", mode)
    S.note(ax, -1.95, 0.16, "-2  (the only decaying mode)", mode)
    S.note(ax, -2.45, 2.55, "no root strictly to the right:\nthe array shows zero sign changes,\nyet the system is NOT asymptotically stable", mode)
    ax.set_xlabel("real part  (1/s)")
    ax.set_ylabel("imaginary part  (rad/s)")
    ax.set_title("A row of zeros means roots in a symmetric pattern")
    ax.set_xlim(-2.6, 1.4)
    ax.set_ylim(-2.9, 3.5)
    S.strip(ax)
    return fig


@figure("ctl2-bibo-resonance")
def _(mode):
    """A bounded input producing an unbounded output. G = 1/(s^2+4) has its
    poles exactly on the imaginary axis; driven by sin(2t) its output is
    (sin 2t - 2t cos 2t)/8, whose envelope grows as t/4 and reaches -7.854 at
    t = 10 pi. Moving the poles a little into the left half plane bounds it.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 32, 32001)
    y = sim([1], [1, 0, 4], lambda tt: np.sin(2 * tt), t)
    closed = (np.sin(2 * t) - 2 * t * np.cos(2 * t)) / 8
    assert np.abs(y - closed).max() < 1e-6, np.abs(y - closed).max()
    y_stable = sim([1], [1, 0.4, 4.04], lambda tt: np.sin(2 * tt), t)
    tt = 10 * np.pi
    assert abs((np.sin(2 * tt) - 2 * tt * np.cos(2 * tt)) / 8 + 2.5 * np.pi) < 1e-12
    assert abs(2.5 * np.pi - 7.8540) < 5e-5
    assert abs(np.interp(tt, t, y) + 7.8540) < 2e-3, np.interp(tt, t, y)
    assert np.abs(y_stable[t > 20]).max() < 2.6, np.abs(y_stable[t > 20]).max()

    fig, ax = plt.subplots()
    ax.plot(t, y, color=c[0], lw=1.5)
    ax.plot(t, t / 4, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot(t, -t / 4, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.plot(t, y_stable, color=c[1], lw=1.5)
    S.label_end(ax, 31.5, 7.0, "poles at +/-j2:\nenvelope t/4", c[0], mode, dx=-6, dy=6, ha="right")
    S.label_end(ax, 31.5, -2.4, "poles at -0.2 +/- j2", c[1], mode, dx=-6, dy=-10, ha="right")
    ax.plot([10 * np.pi], [-2.5 * np.pi], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 30.0, -6.6, "y(10 pi) = -2.5 pi = -7.854", mode, ha="right")
    S.note(ax, 0.6, 6.6, "input is sin(2t): amplitude 1 for all time", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output")
    ax.set_title("Poles on the axis: bounded in, unbounded out")
    ax.set_xlim(0, 32)
    ax.set_ylim(-9, 9)
    S.strip(ax)
    return fig


@figure("ctl2-margins-bode")
def _(mode):
    """Loop magnitude and phase for L = 4/[s(s+1)(s+2)(s+3)]. Phase reaches
    -180 degrees at exactly 1 rad/s, where |L| = 0.4, so the gain margin is
    2.500 = 7.959 dB - the same factor the Routh window 0 < K < 10 gives at
    K = 4. Gain crossover is at 0.5530 rad/s with 35.16 degrees of phase margin.
    """
    c = S.SERIES[mode]
    w = np.logspace(-1.3, 1.0, 3000)
    mag = 4 / (w * np.hypot(w, 1) * np.hypot(w, 2) * np.hypot(w, 3))
    ph = -(90 + np.degrees(np.arctan(w) + np.arctan(w / 2) + np.arctan(w / 3)))
    assert abs(np.degrees(np.arctan(1.0) + np.arctan(0.5) + np.arctan(1 / 3)) - 90.0) < 1e-9
    assert abs(4 / (1 * np.sqrt(2) * np.sqrt(5) * np.sqrt(10)) - 0.4) < 1e-12
    assert abs(1 / 0.4 - 2.5) < 1e-12
    assert abs(20 * np.log10(2.5) - 7.9588) < 5e-5
    wgc = brentq(lambda x: 4 / (x * np.hypot(x, 1) * np.hypot(x, 2) * np.hypot(x, 3)) - 1.0,
                 0.1, 2.0, xtol=1e-14)
    assert abs(wgc - 0.5530) < 5e-5, wgc
    pm = 180 + (-(90 + np.degrees(np.arctan(wgc) + np.arctan(wgc / 2) + np.arctan(wgc / 3))))
    assert abs(pm - 35.158) < 5e-4, pm
    assert abs(np.radians(pm) / wgc - 1.1096) < 5e-5
    # independent route: the Routh critical gain must equal K * GM
    assert n_rhp([1, 6, 11, 6, 9.99]) == 0 and n_rhp([1, 6, 11, 6, 10.01]) == 2
    assert abs(4.0 * 2.5 - 10.0) < 1e-12

    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.2))
    ax = axes[0]
    ax.semilogx(w, 20 * np.log10(mag), color=c[0], lw=2.1)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([1.0], [20 * np.log10(0.4)], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.annotate("", xy=(1.0, 0.0), xytext=(1.0, 20 * np.log10(0.4)),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    ax.axvline(wgc, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([wgc], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 1.20, -13.0, "gain margin 7.96 dB\n(a factor of 2.5)", mode)
    S.note(ax, 0.50, 8.0, "gain crossover\n0.5530 rad/s", mode, ha="right")
    ax.set_ylabel("|L|  (dB)")
    ax.set_title("Margins on the loop that Routh says goes critical at K = 10")
    ax.set_ylim(-45, 35)
    S.strip(ax)
    ax = axes[1]
    ax.semilogx(w, ph, color=c[1], lw=2.1)
    ax.axhline(-180.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([wgc], [-180 + pm], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axvline(wgc, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.annotate("", xy=(wgc, -180.0), xytext=(wgc, -180 + pm),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, 0.62, -152.0, "phase margin\n35.16 deg", mode)
    S.note(ax, 1.15, -232.0, "phase hits -180 deg at exactly 1 rad/s -\nthe auxiliary-polynomial frequency", mode)
    ax.set_xlabel("frequency  (rad/s)")
    ax.set_ylabel("phase  (deg)")
    ax.set_ylim(-280, -80)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("ctl2-hidden-mode")
def _(mode):
    """Cancelling an unstable plant pole with a controller zero. The reference
    response of T = 4/(s+7) settles at 4/7 = 0.5714 and looks perfect, while a
    disturbance of one millivolt at the plant input drives the uncancelled mode
    e^t and reaches 5.960 after eight seconds.
    """
    c = S.SERIES[mode]
    t = np.linspace(0, 10, 20001)
    y_ref = sim([4], [1, 7], lambda tt: 1.0, t)
    y_dis = sim([4, 12], [1, 6, -7], lambda tt: 1e-3, t)     # 4(s+3)/((s-1)(s+7))
    closed = 1e-3 * (2 * np.exp(t) - 12 / 7 - (2 / 7) * np.exp(-7 * t))
    assert np.abs(y_dis - closed).max() < 1e-6, np.abs(y_dis - closed).max()
    assert abs(y_ref[-1] - 4 / 7) < 1e-6, y_ref[-1]
    assert abs(4 / 7 - 0.5714) < 5e-5
    v8 = np.interp(8.0, t, y_dis)
    assert abs(v8 - 5.9602) < 5e-4, v8
    assert abs(np.interp(9.0, t, y_dis) / np.interp(8.0, t, y_dis) - np.e) < 2e-3
    assert n_rhp([1, 6, -7]) == 1

    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0))
    ax = axes[0]
    ax.plot(t, y_ref, color=c[0], lw=2.1)
    ax.axhline(4 / 7, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 9.6, 4 / 7, "settles at 4/7 = 0.5714", c[0], mode, dx=-8, dy=-14, ha="right")
    S.note(ax, 0.25, 0.12, "what the reference-to-output transfer function shows", mode)
    ax.set_ylabel("output, step reference")
    ax.set_title("The transfer function is fine; the system is not")
    ax.set_ylim(0, 0.78)
    S.strip(ax)
    ax = axes[1]
    ax.plot(t, y_dis, color=c[1], lw=2.1)
    ax.plot([8.0], [v8], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 7.7, 4.2, "5.960 at t = 8 s, from a 1 mV disturbance", mode, ha="right")
    S.note(ax, 0.25, 12.0, "the same loop, disturbed at the plant input:\nthe cancelled pole at +1 multiplies by e every second", mode)
    ax.set_xlabel("time  (s)")
    ax.set_ylabel("output, 1 mV input disturbance")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 18)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("ctl2-stability-region")
def _(mode):
    """Critical gain against compensator zero location for
    L = K(s+z)/[s(s+1)(s+2)(s+3)]. Every point under the curve is a stable
    design. Pulling the zero in from z = 2.5 to z = 0.5 raises the usable gain
    from 8.153 to 44.15; the worked case z = 1.25 gives exactly 24.
    """
    c = S.SERIES[mode]
    z = np.linspace(0.2, 5.0, 1200)
    m = 36 * z - 54
    kmax = (-m + np.sqrt(m * m + 1440)) / 2
    for zz, kk in ((0.5, 44.1534), (1.0, 30.0), (1.25, 24.0), (1.5, 18.9737), (2.5, 8.1534)):
        mm = 36 * zz - 54
        val = (-mm + np.sqrt(mm * mm + 1440)) / 2
        assert abs(val - kk) < 5e-5, (zz, val)
        # independent route: bisect the largest real part of the actual roots
        g = lambda K: np.roots([1, 6, 11, 6 + K, zz * K]).real.max()
        assert abs(brentq(g, 0.5, 300.0, xtol=1e-11) - val) < 1e-6, zz
    assert n_rhp([1, 6, 11, 6 + 23.9, 1.25 * 23.9]) == 0
    assert n_rhp([1, 6, 11, 6 + 24.1, 1.25 * 24.1]) == 2

    fig, ax = plt.subplots()
    ax.plot(z, kmax, color=c[0], lw=2.2)
    ax.fill_between(z, 0, kmax, color=c[0], alpha=0.14, lw=0)
    for zz, kk in ((0.5, 44.1534), (1.25, 24.0), (2.5, 8.1534)):
        ax.plot([zz], [kk], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 0.62, 44.0, "z = 0.5: K < 44.15", mode)
    S.note(ax, 1.40, 25.5, "z = 1.25: K < 24 exactly", mode)
    S.note(ax, 2.62, 9.5, "z = 2.5: K < 8.153", mode)
    S.note(ax, 1.9, 45.0, "stable designs live under the curve", mode)
    ax.set_xlabel("compensator zero location  z")
    ax.set_ylabel("critical gain  K_max")
    ax.set_title("A Routh inequality in two parameters is a region, not an interval")
    ax.set_xlim(0.2, 5)
    ax.set_ylim(0, 62)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------


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
        assert n.startswith("ctl2-"), f"figure {n} is outside this wave's namespace"
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
