#!/usr/bin/env python3
"""Figures for ORG1 chapter 1, Chemical Bonding and Structure.

Six figures, each written in both themes. Every one is drawn from the geometry
or the numbers the lesson states, never traced.

Run:  python3 scripts/gen_org1_ch1_figures.py
Out:  apps/web/public/figures/octet/{stem}-{light,dark}.svg
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle, Ellipse, FancyArrowPatch, Polygon  # noqa: E402

import octet_figstyle as fs  # noqa: E402

OUT = HERE.parent / "apps" / "web" / "public" / "figures" / "octet"


def _clean(ax, xlim, ylim):
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.set_aspect("equal")
    ax.axis("off")


def _lobe(ax, cx, cy, angle, mode, positive=True, length=1.0, width=0.52):
    """One p-orbital lobe as an ellipse pushed out along `angle` degrees.

    Filled for one sign of the wavefunction, hollow for the other. See the note
    in octet_figstyle: the sign is a phase, not a charge, so it does not get a
    categorical hue.
    """
    theta = np.radians(angle)
    ex, ey = cx + 0.5 * length * np.cos(theta), cy + 0.5 * length * np.sin(theta)
    ax.add_patch(Ellipse(
        (ex, ey), width=length, height=width, angle=angle,
        facecolor=fs.PHASE_POS[mode] if positive else fs.PHASE_NEG[mode],
        edgecolor=fs.INK[mode], linewidth=1.4,
        alpha=0.85 if positive else 1.0, zorder=2,
    ))


# --------------------------------------------------------------------------
# 1. org1-orbital-shapes
# --------------------------------------------------------------------------
def orbital_shapes(mode: str):
    fs.apply(mode)
    fig, axes = plt.subplots(1, 4, figsize=(9.2, 2.6))
    ink = fs.INK[mode]

    ax = axes[0]
    ax.add_patch(Circle((0, 0), 0.52, facecolor=fs.PHASE_POS[mode],
                        edgecolor=ink, linewidth=1.4, alpha=0.85))
    ax.plot([0], [0], marker="+", color=ink, markersize=8, markeredgewidth=1.4)
    ax.set_title("2s", color=ink)
    _clean(ax, (-1.15, 1.15), (-1.15, 1.15))

    for ax, (name, angle) in zip(
        axes[1:], [("2p$_x$", 0), ("2p$_y$", 90), ("2p$_z$", 55)]
    ):
        _lobe(ax, 0, 0, angle, mode, positive=True)
        _lobe(ax, 0, 0, angle + 180, mode, positive=False)
        # The nodal plane, perpendicular to the lobe axis and through the
        # nucleus. This is where the wavefunction changes sign and the
        # electron density is exactly zero.
        n = np.radians(angle + 90)
        ax.plot([-0.95 * np.cos(n), 0.95 * np.cos(n)],
                [-0.95 * np.sin(n), 0.95 * np.sin(n)],
                linestyle=(0, (4, 3)), color=fs.GUIDE[mode], linewidth=1.1, zorder=1)
        ax.plot([0], [0], marker="+", color=ink, markersize=8, markeredgewidth=1.4,
                zorder=3)
        ax.set_title(name, color=ink)
        _clean(ax, (-1.15, 1.15), (-1.15, 1.15))

    # Captions at figure level, not on an axes. Put on axes[2] they landed
    # under the 2p_y bottom lobe, which reaches the axes floor.
    fig.tight_layout(rect=(0, 0.10, 1, 1))
    fig.text(0.5, 0.045,
             "filled and hollow are the two signs of the wavefunction, not two "
             "charges  ·  dashed line = nodal plane, where the density is zero",
             ha="center", va="bottom", fontsize=8.5, color=fs.INK_2[mode])
    return fig


# --------------------------------------------------------------------------
# 2. org1-hybrid-geometries
# --------------------------------------------------------------------------
def hybrid_geometries(mode: str):
    fs.apply(mode)
    fig, axes = plt.subplots(1, 3, figsize=(9.4, 3.2))
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]

    def carbon(ax):
        ax.add_patch(Circle((0, 0), 0.13, facecolor=fs.SERIES[mode][0],
                            edgecolor="none", zorder=4))
        ax.text(0, 0, "C", ha="center", va="center", fontsize=9,
                color="#ffffff", zorder=5, fontweight="bold")

    def bond(ax, angle, length=0.95, dashed=False, wedge=False):
        t = np.radians(angle)
        x, y = length * np.cos(t), length * np.sin(t)
        if wedge:
            perp = np.radians(angle + 90)
            w = 0.075
            ax.add_patch(Polygon(
                [(0, 0), (x + w * np.cos(perp), y + w * np.sin(perp)),
                 (x - w * np.cos(perp), y - w * np.sin(perp))],
                facecolor=ink, edgecolor=ink, zorder=3))
        elif dashed:
            ax.plot([0, x], [0, y], linestyle=(0, (2.5, 2.5)), color=ink,
                    linewidth=1.6, zorder=3)
        else:
            ax.plot([0, x], [0, y], color=ink, linewidth=1.7, zorder=3)
        return x, y

    # sp3, drawn as the standard two-in-plane / one-wedge / one-dash projection
    ax = axes[0]
    for a in (145, 35):
        bond(ax, a, length=0.92)
    bond(ax, 290, length=0.88, wedge=True)
    bond(ax, 250, length=0.88, dashed=True)
    carbon(ax)
    ax.annotate("109.5°", xy=(0, 0.46), ha="center", fontsize=9, color=ink2)
    ax.text(0, -1.30, "wedge toward you,\ndash away from you",
            ha="center", va="top", fontsize=8.5, color=ink2)
    ax.set_title("sp$^3$ · tetrahedral · 4 groups", color=ink, fontsize=11)
    _clean(ax, (-1.35, 1.35), (-1.75, 1.35))

    # sp2. The three sigma bonds define a plane and the spare p is
    # perpendicular to it, so the plane is drawn foreshortened - one bond to
    # the right and two back to the left - leaving the vertical axis clear for
    # the p orbital. Drawing a sigma bond straight up would put it inside the
    # p lobe, which is exactly the geometry the figure is meant to deny.
    ax = axes[1]
    for a in (0, 152, 208):
        bond(ax, a, length=0.88)
    _lobe(ax, 0, 0, 90, mode, positive=True, length=0.78, width=0.38)
    _lobe(ax, 0, 0, 270, mode, positive=False, length=0.78, width=0.38)
    carbon(ax)
    ax.annotate("120°", xy=(0.52, -0.50), ha="center", va="top",
                fontsize=9, color=ink2)
    ax.text(0, -1.30, "one p orbital spare,\nperpendicular to the plane",
            ha="center", va="top", fontsize=8.5, color=ink2)
    ax.set_title("sp$^2$ · trigonal planar · 3 groups", color=ink, fontsize=11)
    _clean(ax, (-1.35, 1.35), (-1.75, 1.35))

    # sp. Two sigma bonds on the horizontal, and two mutually perpendicular p
    # orbitals: one in the plane of the page drawn vertically, one coming out
    # of the page drawn foreshortened as a narrow ellipse on the diagonal.
    ax = axes[2]
    for a in (0, 180):
        bond(ax, a, length=0.92)
    _lobe(ax, 0, 0, 90, mode, positive=True, length=0.74, width=0.30)
    _lobe(ax, 0, 0, 270, mode, positive=False, length=0.74, width=0.30)
    # The second p is perpendicular to both the bond axis and the first p, so
    # it points out of the page. Drawn as a narrow ellipse on a shallow
    # diagonal - the standard foreshortening - and set well off the vertical so
    # it does not read as a flap on the first p.
    _lobe(ax, 0, 0, 28, mode, positive=True, length=0.62, width=0.15)
    _lobe(ax, 0, 0, 208, mode, positive=False, length=0.62, width=0.15)
    carbon(ax)
    ax.annotate("180°", xy=(-0.50, -0.52), ha="center", va="top",
                fontsize=9, color=ink2)
    ax.text(0, -1.30, "two p orbitals spare;\nthe narrow one comes out of the page",
            ha="center", va="top", fontsize=8.5, color=ink2)
    ax.set_title("sp · linear · 2 groups", color=ink, fontsize=11)
    _clean(ax, (-1.35, 1.35), (-1.75, 1.35))

    fig.tight_layout()
    return fig


# --------------------------------------------------------------------------
# 3. org1-skeletal-decode
# --------------------------------------------------------------------------
def skeletal_decode(mode: str):
    """2-butanol in three notations, with matching carbons numbered.

    The numbering across all three panels is the teaching device: it lets a
    reader track one specific atom from the fully explicit Lewis structure to
    the skeletal drawing where it has become an unlabelled corner.
    """
    fs.apply(mode)
    fig, axes = plt.subplots(1, 3, figsize=(10.4, 3.4))
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    accent = fs.SERIES[mode][1]

    # All three panels share one coordinate box so the three titles sit on one
    # line. Panels with different data extents put their titles at different
    # heights, which reads as three unrelated figures rather than one
    # comparison.
    BOX = ((-0.9, 3.6), (-1.70, 1.55))

    # --- Lewis. Straight chain rather than zig-zag, because every carbon needs
    # room above and below for its own hydrogens and a zig-zag puts C2's
    # hydrogen exactly where its OH goes.
    ax = axes[0]
    xs = [0.0, 0.9, 1.8, 2.7]
    for i in range(3):
        ax.plot([xs[i] + 0.17, xs[i + 1] - 0.17], [0, 0], color=ink, lw=1.5)
    for i, x in enumerate(xs):
        ax.text(x, 0, "C", ha="center", va="center", fontsize=11, color=ink)
        ax.text(x, -0.92, str(i + 1), ha="center", va="center", fontsize=8.5,
                color=accent, fontweight="bold")

    def stub(x, y, dx, dy, label, size=9.5):
        ax.plot([x + 0.16 * dx, x + 0.40 * dx], [y + 0.20 * dy, y + 0.46 * dy],
                color=ink, lw=1.3)
        ax.text(x + 0.52 * dx, y + 0.62 * dy, label, ha="center", va="center",
                fontsize=size, color=ink)

    # C1: three H (up, down, left). C2: OH up, H down. C3: H up, H down.
    # C4: three H (up, down, right). Counts match CH3-CH(OH)-CH2-CH3.
    stub(xs[0], 0, 0, 1, "H")
    stub(xs[0], 0, 0, -1, "H")
    ax.plot([xs[0] - 0.17, xs[0] - 0.45], [0, 0], color=ink, lw=1.3)
    ax.text(xs[0] - 0.60, 0, "H", ha="center", va="center", fontsize=9.5, color=ink)
    stub(xs[1], 0, 0, 1, "OH", size=10)
    stub(xs[1], 0, 0, -1, "H")
    stub(xs[2], 0, 0, 1, "H")
    stub(xs[2], 0, 0, -1, "H")
    stub(xs[3], 0, 0, 1, "H")
    stub(xs[3], 0, 0, -1, "H")
    ax.plot([xs[3] + 0.17, xs[3] + 0.45], [0, 0], color=ink, lw=1.3)
    ax.text(xs[3] + 0.60, 0, "H", ha="center", va="center", fontsize=9.5, color=ink)
    ax.text(1.35, -1.62, "every atom drawn", ha="center", va="bottom",
            fontsize=8.5, color=ink2)
    ax.set_title("Lewis", color=ink, fontsize=11)
    _clean(ax, *BOX)

    # --- Condensed. Drawn as four separate chunks at known x positions rather
    # than one string, so the carbon numbers can be placed over the carbon they
    # actually name. Positioning numbers under a single mathtext string is
    # guesswork and it was wrong.
    ax = axes[1]
    chunks = [("CH$_3$", 0.0), ("CH(OH)", 0.95), ("CH$_2$", 2.05), ("CH$_3$", 2.85)]
    for i, (text, x) in enumerate(chunks):
        ax.text(x, 0, text, ha="center", va="center", fontsize=12.5, color=ink)
        ax.text(x, -0.92, str(i + 1), ha="center", va="center", fontsize=8.5,
                color=accent, fontweight="bold")
    ax.text(1.35, -1.62, "each carbon grouped with its own hydrogens",
            ha="center", va="bottom", fontsize=8.5, color=ink2)
    ax.set_title("condensed", color=ink, fontsize=11)
    _clean(ax, *BOX)

    # --- Skeletal
    ax = axes[2]
    sx = [0.15, 0.95, 1.75, 2.55]
    sy = [-0.30, 0.18, -0.30, 0.18]
    for i in range(3):
        ax.plot([sx[i], sx[i + 1]], [sy[i], sy[i + 1]], color=ink, lw=1.8)
    for i, (x, y) in enumerate(zip(sx, sy)):
        ax.text(x, -0.92, str(i + 1), ha="center", va="center", fontsize=8.5,
                color=accent, fontweight="bold")
        # A faint tick from the number to its vertex, since a skeletal vertex
        # is not labelled and the reader has to be told which corner is which.
        ax.plot([x, x], [-0.80, y - 0.14], color=fs.GRID[mode], lw=0.9,
                linestyle=(0, (2, 2)))
    ax.plot([sx[1], sx[1]], [sy[1], sy[1] + 0.55], color=ink, lw=1.8)
    ax.text(sx[1], sy[1] + 0.74, "OH", ha="center", va="center", fontsize=11,
            color=ink)
    ax.text(1.35, -1.62, "carbon and its H implied;  the OH always drawn",
            ha="center", va="bottom", fontsize=8.5, color=ink2)
    ax.set_title("skeletal", color=ink, fontsize=11)
    _clean(ax, *BOX)

    fig.tight_layout()
    return fig


# --------------------------------------------------------------------------
# 4. org1-resonance-hybrid
# --------------------------------------------------------------------------
def resonance_hybrid(mode: str):
    fs.apply(mode)
    fig, axes = plt.subplots(1, 3, figsize=(10.2, 3.6),
                             gridspec_kw={"width_ratios": [1, 1, 1.05]})
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    neg = fs.SERIES[mode][1]

    # One geometry for all three panels: methyl lower left, carbonyl carbon at
    # the origin, one oxygen up and one lower right.
    ME = (-0.78, -0.46)
    C = (0.0, 0.0)
    O_UP = (0.0, 0.86)
    O_DN = (0.80, -0.46)

    def skeleton(ax):
        ax.plot([ME[0], C[0]], [ME[1], C[1]], color=ink, lw=1.7)

    def single(ax, a, b, shrink=0.17):
        """A bond drawn short of the atom label at b."""
        dx, dy = b[0] - a[0], b[1] - a[1]
        n = (dx ** 2 + dy ** 2) ** 0.5
        ax.plot([a[0], b[0] - shrink * dx / n], [a[1], b[1] - shrink * dy / n],
                color=ink, lw=1.7)

    def double(ax, a, b, shrink=0.17, off=0.075):
        dx, dy = b[0] - a[0], b[1] - a[1]
        n = (dx ** 2 + dy ** 2) ** 0.5
        px, py = -dy / n * off, dx / n * off
        for s in (1, -1):
            ax.plot([a[0] + s * px, b[0] - shrink * dx / n + s * px],
                    [a[1] + s * py, b[1] - shrink * dy / n + s * py],
                    color=ink, lw=1.7)

    def partial(ax, a, b, shrink=0.17, off=0.075):
        """Solid full bond plus a dashed partner: the standard hybrid mark."""
        single(ax, a, b, shrink)
        dx, dy = b[0] - a[0], b[1] - a[1]
        n = (dx ** 2 + dy ** 2) ** 0.5
        px, py = -dy / n * off, dx / n * off
        ax.plot([a[0] + px, b[0] - shrink * dx / n + px],
                [a[1] + py, b[1] - shrink * dy / n + py],
                color=ink, lw=1.5, linestyle=(0, (2.2, 2.2)))

    BOX = ((-1.25, 1.55), (-1.30, 1.55))

    # Structure A: C=O to the upper oxygen, so the MINUS sits on the lower one.
    # Structure B: C=O to the lower oxygen, so the MINUS moves to the upper.
    # A double bond and a negative charge never sit on the same oxygen here -
    # that oxygen would have three bonds and a negative formal charge at once,
    # which is not a valid Lewis structure for acetate.
    for ax, up_double in ((axes[0], True), (axes[1], False)):
        skeleton(ax)
        if up_double:
            double(ax, C, O_UP)
            single(ax, C, O_DN)
            ax.text(*O_UP, "O", ha="center", va="center", fontsize=12, color=ink)
            ax.text(O_DN[0] + 0.06, O_DN[1] - 0.02, "O$^-$", ha="center",
                    va="center", fontsize=12, color=ink)
        else:
            single(ax, C, O_UP)
            double(ax, C, O_DN)
            ax.text(*O_UP, "O$^-$", ha="center", va="center", fontsize=12,
                    color=ink)
            ax.text(O_DN[0] + 0.06, O_DN[1] - 0.02, "O", ha="center",
                    va="center", fontsize=12, color=ink)
        _clean(ax, *BOX)

    # The hybrid: equal partial bonds and half a charge on each oxygen.
    ax = axes[2]
    skeleton(ax)
    partial(ax, C, O_UP)
    partial(ax, C, O_DN)
    ax.text(*O_UP, "O", ha="center", va="center", fontsize=12, color=ink)
    ax.text(O_UP[0] + 0.46, O_UP[1], "$\\frac{1}{2}-$", ha="center",
            va="center", fontsize=11, color=neg)
    ax.text(O_DN[0] + 0.06, O_DN[1] - 0.02, "O", ha="center", va="center",
            fontsize=12, color=ink)
    ax.text(O_DN[0] + 0.52, O_DN[1] - 0.02, "$\\frac{1}{2}-$", ha="center",
            va="center", fontsize=11, color=neg)
    _clean(ax, *BOX)

    # The double headed arrow between the two contributors. Drawn once, at
    # figure level, so it sits in the gutter rather than inside either panel.
    axa = fig.add_axes([0.315, 0.46, 0.075, 0.10])
    axa.add_patch(FancyArrowPatch((0.05, 0.5), (0.95, 0.5),
                                  arrowstyle="<|-|>", mutation_scale=12,
                                  color=ink, linewidth=1.5))
    axa.set_xlim(0, 1)
    axa.set_ylim(0, 1)
    axa.axis("off")
    fig.text(0.68, 0.50, "is really", ha="center", va="center", fontsize=9.5,
             color=ink2, style="italic")

    fig.text(0.31, 0.055, "two contributing structures", ha="center",
             fontsize=9.5, color=ink2)
    fig.text(0.82, 0.055, "the hybrid — the only thing that exists",
             ha="center", fontsize=9.5, color=ink2)
    fig.tight_layout(rect=(0, 0.09, 1, 1))
    return fig


# --------------------------------------------------------------------------
# 5. org1-inductive-decay
# --------------------------------------------------------------------------
def inductive_decay(mode: str):
    """Drawn from the pKa table in the lesson, not from a fitted curve.

    Butanoic acid 4.82; 2-chloro 2.86; 3-chloro 4.05; 4-chloro 4.52. The bars
    are the differences, so what the figure shows is exactly what the table
    says.
    """
    fs.apply(mode)
    parent = 4.82
    subs = [("2-chloro\n1 bond away", 2.86),
            ("3-chloro\n2 bonds away", 4.05),
            ("4-chloro\n3 bonds away", 4.52)]
    drops = [parent - p for _, p in subs]

    fig, ax = plt.subplots(figsize=(6.6, 3.6))
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    colour = fs.SERIES[mode][0]

    xs = np.arange(len(subs))
    bars = ax.bar(xs, drops, width=0.52, color=colour, edgecolor="none",
                  zorder=3)
    # 4px rounded data-ends are not available on a plain bar; the flat top is
    # anchored to the baseline, which is the rule that actually matters.
    for x, d in zip(xs, drops):
        ax.text(x, d + 0.06, f"{d:.2f}", ha="center", va="bottom",
                fontsize=10, color=ink, fontweight="semibold")
    ax.set_xticks(xs)
    ax.set_xticklabels([s for s, _ in subs], fontsize=9)
    ax.set_ylabel("pK$_a$ lowered, vs butanoic acid", color=ink2)
    ax.set_ylim(0, max(drops) * 1.25)
    ax.grid(axis="y", color=fs.GRID[mode], linewidth=0.7, alpha=0.55, zorder=0)
    ax.set_axisbelow(True)
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.spines["left"].set_color(fs.GRID[mode])
    ax.spines["bottom"].set_color(fs.GRID[mode])
    ax.set_title("Inductive withdrawal dies with distance", color=ink,
                 fontsize=11.5, pad=12)
    del bars
    fig.tight_layout()
    return fig


# --------------------------------------------------------------------------
# 6. org1-functional-groups
# --------------------------------------------------------------------------
def functional_groups(mode: str):
    """Groups arranged in columns by C-heteroatom bond count.

    Drawn as small skeletal fragments rather than text, because recognising the
    drawn shape is the skill; a column of names would teach the names.
    """
    fs.apply(mode)
    fig, ax = plt.subplots(figsize=(9.6, 5.4))
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    accent = fs.SERIES[mode][0]

    cols = {
        0: ("0 bonds", ["alkane", "alkene", "alkyne", "arene"]),
        1: ("1 bond", ["alcohol", "ether", "amine", "alkyl halide"]),
        2: ("2 bonds", ["aldehyde", "ketone"]),
        3: ("3 bonds", ["carboxylic acid", "ester", "amide", "nitrile"]),
    }

    def frag(x, y, kind):
        """A small skeletal fragment for one group."""
        s = 0.30
        if kind == "alkane":
            ax.plot([x - s, x, x + s], [y, y + 0.16, y], color=ink, lw=1.6)
        elif kind == "alkene":
            ax.plot([x - s, x + s], [y, y], color=ink, lw=1.6)
            ax.plot([x - s, x + s], [y + 0.09, y + 0.09], color=ink, lw=1.6)
        elif kind == "alkyne":
            for dy in (0, 0.07, -0.07):
                ax.plot([x - s, x + s], [y + dy, y + dy], color=ink, lw=1.5)
        elif kind == "arene":
            th = np.linspace(0, 2 * np.pi, 7) + np.pi / 6
            ax.plot(x + 0.24 * np.cos(th), y + 0.24 * np.sin(th) + 0.16,
                    color=ink, lw=1.5)
            ax.add_patch(Circle((x, y + 0.16), 0.13, fill=False,
                                edgecolor=ink, linewidth=1.2))
        elif kind in ("alcohol", "ether", "amine", "alkyl halide"):
            label = {"alcohol": "OH", "ether": "O", "amine": "NH$_2$",
                     "alkyl halide": "Br"}[kind]
            ax.plot([x - s, x], [y, y + 0.16], color=ink, lw=1.6)
            ax.plot([x, x + 0.12], [y + 0.16, y + 0.16], color=ink, lw=1.6)
            ax.text(x + 0.28, y + 0.16, label, fontsize=9.5, color=ink,
                    va="center")
            if kind == "ether":
                ax.plot([x + 0.42, x + 0.62], [y + 0.16, y], color=ink, lw=1.6)
        elif kind in ("aldehyde", "ketone"):
            ax.plot([x - s, x], [y, y + 0.16], color=ink, lw=1.6)
            ax.plot([x, x], [y + 0.16, y + 0.46], color=ink, lw=1.6)
            ax.plot([x + 0.055, x + 0.055], [y + 0.16, y + 0.46], color=ink, lw=1.6)
            ax.text(x + 0.03, y + 0.58, "O", fontsize=9.5, color=ink, ha="center")
            if kind == "ketone":
                ax.plot([x, x + 0.30], [y + 0.16, y], color=ink, lw=1.6)
            else:
                ax.text(x + 0.30, y - 0.02, "H", fontsize=9.5, color=ink)
        else:
            tail = {"carboxylic acid": "OH", "ester": "OR", "amide": "NH$_2$"}
            if kind == "nitrile":
                ax.plot([x - s, x], [y, y + 0.16], color=ink, lw=1.6)
                for dy in (0, 0.055, -0.055):
                    ax.plot([x, x + 0.30], [y + 0.16 + dy, y + 0.16 + dy],
                            color=ink, lw=1.4)
                ax.text(x + 0.46, y + 0.16, "N", fontsize=9.5, color=ink,
                        va="center")
            else:
                ax.plot([x - s, x], [y, y + 0.16], color=ink, lw=1.6)
                ax.plot([x, x], [y + 0.16, y + 0.46], color=ink, lw=1.6)
                ax.plot([x + 0.055, x + 0.055], [y + 0.16, y + 0.46],
                        color=ink, lw=1.6)
                ax.text(x + 0.03, y + 0.58, "O", fontsize=9.5, color=ink,
                        ha="center")
                ax.plot([x, x + 0.24], [y + 0.16, y], color=ink, lw=1.6)
                ax.text(x + 0.34, y - 0.03, tail[kind], fontsize=9.5, color=ink)

    # Row pitch has to clear the tallest fragment. The carbonyls reach
    # y + 0.58 for the O label and every row carries a name at y - 0.26, so
    # anything under about 1.0 collides - which is what a 0.78 pitch did.
    ROW = 1.14
    for ci, (n, (header, names)) in enumerate(cols.items()):
        x = 0.6 + ci * 2.35
        ax.text(x, 5.30, header, ha="center", fontsize=11, color=ink,
                fontweight="semibold")
        ax.text(x, 5.06, "C-heteroatom", ha="center", fontsize=8, color=ink2)
        for ri, name in enumerate(names):
            y = 4.05 - ri * ROW
            frag(x, y, name)
            ax.text(x, y - 0.26, name, ha="center", fontsize=8.5, color=ink2)
        del n

    ax.add_patch(FancyArrowPatch((0.35, 5.80), (7.9, 5.80), arrowstyle="-|>",
                                 mutation_scale=13, color=accent, linewidth=1.6))
    ax.text(4.1, 5.94, "oxidation", ha="center", fontsize=9.5, color=accent,
            fontweight="semibold")
    ax.add_patch(FancyArrowPatch((7.9, 0.05), (0.35, 0.05), arrowstyle="-|>",
                                 mutation_scale=13, color=accent, linewidth=1.6))
    ax.text(4.1, -0.22, "reduction", ha="center", fontsize=9.5, color=accent,
            fontweight="semibold")

    ax.set_xlim(-0.3, 8.6)
    ax.set_ylim(-0.5, 6.2)
    ax.axis("off")
    fig.tight_layout()
    return fig


FIGURES = {
    "org1-orbital-shapes": orbital_shapes,
    "org1-hybrid-geometries": hybrid_geometries,
    "org1-skeletal-decode": skeletal_decode,
    "org1-resonance-hybrid": resonance_hybrid,
    "org1-inductive-decay": inductive_decay,
    "org1-functional-groups": functional_groups,
}


def main() -> int:
    # --check DIR also writes a PNG of each figure into DIR, on the mode's own
    # ground colour. Only for eyeballing during authoring: an SVG that parses
    # and has the right filename can still have overlapping labels, a legend
    # over a bar, or a lobe drawn through a bond, and none of that is
    # detectable by reading the file. The PNG is what gets looked at.
    check_dir = None
    if "--check" in sys.argv:
        check_dir = pathlib.Path(sys.argv[sys.argv.index("--check") + 1])
        check_dir.mkdir(parents=True, exist_ok=True)
    grounds = {"light": "#ffffff", "dark": "#14161a"}

    written = 0
    for stem, fn in FIGURES.items():
        for mode in ("light", "dark"):
            fig = fn(mode)
            if check_dir is not None:
                fig.savefig(check_dir / f"{stem}-{mode}.png", dpi=110,
                            bbox_inches="tight", facecolor=grounds[mode])
            path = fs.save(fig, OUT, stem, mode)
            written += 1
            print(f"  {path.relative_to(HERE.parent)}")
    print(f"\n{written} files, {len(FIGURES)} figures in two themes each.")
    if check_dir is not None:
        print(f"check PNGs in {check_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
