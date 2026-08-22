#!/usr/bin/env python3
"""Figures for ORG1 chapter 8, Noncovalent Intermolecular Interactions.

Twelve figures, two per node, written in the same commit as the prose the
visual-standard directive requires. Every data plot is drawn from the
numbers the chapter's own sourced tables state (CRC boiling and melting
points, CRC dipole moments, standard dielectric constants), so a figure
and its paragraph cannot drift apart. Every schematic is drawn from the
geometry or the power law the prose states - vector sums computed from
real bond angles, decay curves computed from their exponents. Nothing is
traced or adapted.

This module exposes REGISTRY and S so the platform's generator-agnostic
label-collision gate can drive it:

    PYTHONPATH=octet/scripts python3 eureka/scripts/check_figure_overlaps.py \
        gen_org1_ch8_figures

Run:  python3 scripts/gen_org1_ch8_figures.py
Out:  apps/web/public/figures/octet/{stem}-{light,dark}.svg
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle, FancyArrowPatch, Rectangle  # noqa: E402

import octet_figstyle as fs  # noqa: E402

S = fs
OUT = HERE.parent / "apps" / "web" / "public" / "figures" / "octet"


# ---------------------------------------------------------------------------
# 8.1 IMFTYPES - the strength ladder
# ---------------------------------------------------------------------------

def fig_imf_strength_ladder(mode: str):
    """Interaction energies as ranges on one logarithmic axis.

    Ranges are the ones the chapter's table states. Drawn logarithmically
    because the point of the figure is that the covalent bond is not
    'stronger' than dispersion but two orders of magnitude stronger, and a
    linear axis crushes the three noncovalent bars into the baseline.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    # Hue carries the category, not the rank: c[1] is the covalent reference
    # alone, c[2] the two interactions that need a full charge, c[0] the three
    # available to neutral molecules - which are the three this course uses.
    bars = [
        ("covalent C-C bond", 350, 420, c[1]),
        ("ion-ion (contact pair)", 100, 350, c[2]),
        ("ion-dipole", 40, 120, c[2]),
        ("hydrogen bond", 10, 40, c[0]),
        ("dipole-dipole", 5, 25, c[0]),
        ("London dispersion (per contact)", 1, 10, c[0]),
    ]

    fig, ax = plt.subplots(figsize=(7.4, 4.2))
    for i, (label, lo, hi, col) in enumerate(bars):
        y = len(bars) - 1 - i
        ax.barh(y, hi - lo, left=lo, height=0.52, color=col,
                edgecolor=ink, linewidth=0.6)
        ax.annotate(f"{lo}-{hi}", (hi, y), textcoords="offset points",
                    xytext=(7, 0), va="center", ha="left",
                    fontsize=8.5, color=ink)

    ax.set_yticks(range(len(bars)))
    ax.set_yticklabels([b[0] for b in reversed(bars)], fontsize=9.5)
    ax.set_xscale("log")
    ax.set_xlim(0.7, 900)
    ax.set_xticks([1, 10, 100, 1000])
    ax.set_xticklabels(["1", "10", "100", "1000"])
    ax.set_xlabel("interaction energy (kJ/mol, log scale)")
    # The divider between "holds a molecule together" and "holds molecules
    # near each other". Labelled on two lines rather than one, because at
    # figure scale two words either side of a rule read as a single phrase.
    ax.axvline(350, color=fs.GUIDE[mode], linewidth=1.0, linestyle=(0, (4, 3)))
    ax.annotate("intramolecular\n(bonds)", (378, 5.86), fontsize=8.5,
                color=ink2, ha="left", va="center")
    ax.annotate("intermolecular\n(this chapter)", (300, 5.86), fontsize=8.5,
                color=ink2, ha="right", va="center")
    ax.set_ylim(-0.62, 6.55)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="x", color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


def fig_imf_distance_decay(mode: str):
    """How fast each interaction dies with separation.

    Each curve is its own power law, normalised to 1.0 at r = 1 so the
    comparison is of shape rather than of magnitude: ion-ion 1/r,
    ion-dipole 1/r^2, and the thermally averaged dipole-dipole and
    dispersion terms both 1/r^6. Computed from the exponents.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    r = np.linspace(1.0, 4.0, 400)
    fig, ax = plt.subplots(figsize=(6.6, 4.2))
    ax.plot(r, 1 / r, color=c[1], linewidth=2.2, label="ion-ion   $1/r$")
    ax.plot(r, 1 / r ** 2, color=c[2], linewidth=2.2,
            label="ion-dipole   $1/r^{2}$")
    ax.plot(r, 1 / r ** 6, color=c[0], linewidth=2.4,
            label="dipole-dipole and dispersion   $1/r^{6}$")

    ax.axvline(2.0, color=fs.GUIDE[mode], linewidth=1.0, linestyle=(0, (4, 3)))
    ax.annotate("double the separation", (2.06, 0.86), fontsize=9,
                color=ink2, ha="left", va="center")
    for expo, col in ((1, c[1]), (2, c[2]), (6, c[0])):
        ax.plot([2.0], [0.5 ** expo], marker="o", markersize=5.5, color=col,
                markeredgecolor=ink, markeredgewidth=0.7, zorder=5)
    ax.annotate("50%", (2.0, 0.5), textcoords="offset points", xytext=(9, 10),
                fontsize=8.5, color=ink)
    ax.annotate("25%", (2.0, 0.25), textcoords="offset points", xytext=(9, 9),
                fontsize=8.5, color=ink)
    ax.annotate("1.6%", (2.0, 0.0156), textcoords="offset points",
                xytext=(9, 11), fontsize=8.5, color=ink)

    ax.set_xlabel("separation (multiples of contact distance)")
    ax.set_ylabel("interaction energy (fraction of contact value)")
    ax.set_xlim(0.95, 4.05)
    ax.set_ylim(-0.03, 1.06)
    ax.legend(frameon=False, fontsize=9, loc="upper right")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


# ---------------------------------------------------------------------------
# 8.2 DISPERSION
# ---------------------------------------------------------------------------

def fig_halogen_bp(mode: str):
    """Boiling point of the halogens against electron count.

    The cleanest dispersion-only series in chemistry: four nonpolar
    homonuclear diatomics with no dipole and no hydrogen bonding, so the
    372 K spread between fluorine and iodine is dispersion alone.
    Boiling points are the CRC values the chapter's table states.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]

    names = ["F$_2$", "Cl$_2$", "Br$_2$", "I$_2$"]
    electrons = [18, 34, 70, 106]
    bp = [85.0, 239.1, 332.0, 457.4]

    fig, ax = plt.subplots(figsize=(6.4, 4.2))
    ax.plot(electrons, bp, marker="o", markersize=7, color=fs.SERIES[mode][0],
            linewidth=2.2, markeredgecolor=ink, markeredgewidth=0.7)
    for n, e, b in zip(names, electrons, bp):
        ax.annotate(f"{n}\n{b:g} K", (e, b), textcoords="offset points",
                    xytext=(0, 13), ha="center", fontsize=9, color=ink)
    ax.set_xlabel("electrons per molecule")
    ax.set_ylabel("boiling point (K)")
    ax.set_xlim(5, 122)
    ax.set_ylim(20, 545)
    ax.annotate("no dipole, no hydrogen bonding:\nthis spread is dispersion alone",
                (12, 400), fontsize=9, color=ink2, ha="left", va="center")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


def fig_dispersion_contact(mode: str):
    """Why shape beats mass: contact area at equal electron count.

    A schematic drawn from geometry. Two extended chains lie alongside and
    touch at every carbon; two near-spheres of the same formula touch at
    one patch. The boiling points annotated are the CRC values for pentane
    and neopentane, which have identical formulas and identical electron
    counts, so contact area is the only variable left.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    fig, ax = plt.subplots(figsize=(7.2, 3.8))

    # Left: two extended chains, zig-zag, lying alongside.
    def chain(y0, col):
        xs = np.arange(5) * 0.52
        ys = y0 + np.where(np.arange(5) % 2 == 0, 0.0, 0.16)
        ax.plot(xs, ys, color=col, linewidth=2.4, solid_capstyle="round")
        for x, y in zip(xs, ys):
            ax.plot([x], [y], marker="o", markersize=5, color=col,
                    markeredgecolor=ink, markeredgewidth=0.6, zorder=4)
        return xs, ys

    x_up, y_up = chain(1.30, c[0])
    x_dn, y_dn = chain(0.62, c[0])
    for xu, yu, xd, yd in zip(x_up, y_up, x_dn, y_dn):
        ax.plot([xu, xd], [yu - 0.03, yd + 0.03], color=fs.GUIDE[mode],
                linewidth=1.0, linestyle=(0, (2, 2)), zorder=2)
    ax.annotate("pentane: five contacts along the chain",
                (1.04, 0.16), ha="center", fontsize=9.5, color=ink)
    ax.annotate("bp 309.2 K", (1.04, -0.10), ha="center", fontsize=9.5,
                color=ink2)

    # Right: two near-spheres touching at one point.
    for cy, in ((1.42,), (0.58,)):
        ax.add_patch(Circle((3.9, cy), 0.36, facecolor="none",
                            edgecolor=c[1], linewidth=2.4))
    ax.plot([3.9, 3.9], [1.06, 0.94], color=fs.GUIDE[mode], linewidth=1.0,
            linestyle=(0, (2, 2)), zorder=2)
    ax.plot([3.9], [1.00], marker="o", markersize=6, color=c[1],
            markeredgecolor=ink, markeredgewidth=0.6, zorder=4)
    ax.annotate("neopentane: one contact patch",
                (3.9, 0.16), ha="center", fontsize=9.5, color=ink)
    ax.annotate("bp 282.6 K", (3.9, -0.10), ha="center", fontsize=9.5,
                color=ink2)

    ax.annotate("same formula C$_5$H$_{12}$, same electrons - only the contact area differs",
                (2.5, 2.02), ha="center", fontsize=9.5, color=ink)

    ax.set_xlim(-0.75, 5.35)
    ax.set_ylim(-0.42, 2.24)
    ax.axis("off")
    return fig


# ---------------------------------------------------------------------------
# 8.3 DIPOLE
# ---------------------------------------------------------------------------

def _tetrahedral_projection(length: float) -> list[tuple[float, float]]:
    """Four tetrahedral bond vectors, orthographically projected to 2D.

    Built from the exact tetrahedron - the four alternating corners of a
    cube - then rotated about the x axis so the drawing shows one bond up
    and three splayed below, which is how the geometry is normally drawn.
    Orthographic projection is linear, so four 3D vectors that sum to zero
    project to four 2D vectors that sum to zero: the figure's central
    claim is true by construction rather than by the author's hand.
    """
    def align(a: np.ndarray, b: np.ndarray) -> np.ndarray:
        """Rodrigues rotation taking unit vector a onto unit vector b."""
        v = np.cross(a, b)
        s = np.linalg.norm(v)
        if s < 1e-12:
            return np.eye(3) if a @ b > 0 else -np.eye(3)
        k = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
        return np.eye(3) + k + k @ k * ((1 - a @ b) / s ** 2)

    verts = np.array([[1.0, 1.0, 1.0], [1.0, -1.0, -1.0],
                      [-1.0, 1.0, -1.0], [-1.0, -1.0, 1.0]])
    verts = verts / np.linalg.norm(verts[0])
    # Put the first bond straight up the page, then tip the whole frame
    # forward about the page's horizontal axis so the other three splay
    # apart instead of stacking on top of one another.
    verts = verts @ align(verts[0], np.array([0.0, 1.0, 0.0])).T
    # Spin about the now-vertical first bond until one of the remaining
    # three points straight down the page; the other two then splay left
    # and right symmetrically, which is the standard tetrahedral drawing.
    beta = np.arctan2(verts[1][2], verts[1][0]) - np.pi / 2
    rot_y = np.array([[np.cos(beta), 0, np.sin(beta)],
                      [0, 1, 0],
                      [-np.sin(beta), 0, np.cos(beta)]])
    verts = verts @ rot_y.T
    # A few degrees of forward tip, so the bond pointing at the reader
    # still projects to a visible stub rather than to a point. The result
    # is the familiar tripod: one bond up, three splayed below, the middle
    # one foreshortened because it is coming out of the page.
    tip = np.radians(-5.0)
    rot_x = np.array([[1, 0, 0],
                      [0, np.cos(tip), -np.sin(tip)],
                      [0, np.sin(tip), np.cos(tip)]])
    verts = verts @ rot_x.T
    return [(float(v[0]) * length, float(v[1]) * length) for v in verts]


def fig_dipole_vectors(mode: str):
    """Bond dipoles added as vectors on four real geometries.

    Each panel lays the bond dipoles tail to tail at a common origin, in
    the molecule's actual geometry: 180 degrees apart for carbon dioxide,
    104.5 for water's two O-H dipoles, 109.5 for the two C-Cl dipoles of
    dichloromethane, and the full projected tetrahedron for
    tetrachloromethane. The resultant drawn is the computed vector sum, so
    the two cancelling cases come out at zero because the arithmetic makes
    them zero and not because the figure was drawn to agree with the text.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    fig, ax = plt.subplots(figsize=(7.6, 4.0))

    def panel(cx, title, verdict, vectors, cancels):
        """vectors: list of (dx, dy) bond-dipole components."""
        col = c[2] if cancels else c[1]
        vx = sum(dx for dx, _ in vectors)
        vy = sum(dy for _, dy in vectors)
        for dx, dy in vectors:
            ax.add_patch(FancyArrowPatch(
                (cx, 0.62), (cx + dx, 0.62 + dy),
                arrowstyle="-|>", mutation_scale=11, color=fs.GUIDE[mode],
                linewidth=1.5, shrinkA=0, shrinkB=0))
        if abs(vx) + abs(vy) > 1e-9:
            ax.add_patch(FancyArrowPatch(
                (cx, 0.62), (cx + vx, 0.62 + vy),
                arrowstyle="-|>", mutation_scale=15, color=col,
                linewidth=2.6, shrinkA=0, shrinkB=0, zorder=5))
        else:
            ax.plot([cx], [0.62], marker="o", markersize=9, color=col,
                    markeredgecolor=ink, markeredgewidth=0.9, zorder=5)
        ax.annotate(title, (cx, 1.62), ha="center", fontsize=10.5, color=ink)
        ax.annotate(verdict, (cx, -0.52), ha="center", fontsize=9,
                    color=ink2)

    L = 0.42

    def polar(*degrees):
        return [(L * np.cos(np.radians(d)), L * np.sin(np.radians(d)))
                for d in degrees]

    # Water: the two H-to-O dipoles are 104.5 degrees apart, bisected by
    # the molecular axis. Dichloromethane: the two C-to-Cl dipoles are
    # 109.5 apart, likewise bisected.
    panel(0.0, "O=C=O", "linear, 180$^\\circ$\nsum = 0, nonpolar",
          polar(0, 180), True)
    panel(2.2, "H$_2$O", "bent, 104.5$^\\circ$\npolar, 1.85 D",
          polar(90 - 52.25, 90 + 52.25), False)
    panel(4.4, "CH$_2$Cl$_2$", "two C-Cl, 109.5$^\\circ$\npolar, 1.60 D",
          polar(90 - 54.75, 90 + 54.75), False)
    panel(6.6, "CCl$_4$", "four, tetrahedral\nsum = 0, nonpolar",
          _tetrahedral_projection(L), True)

    ax.annotate("grey: bond dipoles, tail to tail      coloured: their vector sum",
                (3.3, -1.02), ha="center", fontsize=9, color=ink2)
    ax.set_xlim(-0.9, 7.5)
    ax.set_ylim(-1.34, 1.96)
    ax.axis("off")
    return fig


def fig_dipole_bp_series(mode: str):
    """Boiling point against dipole moment at nearly fixed size.

    Four molecules of 41-46 g/mol, none of them a hydrogen-bond donor, so
    dispersion is roughly constant across the set and the 124 K spread
    tracks the permanent dipole. Dipole moments and boiling points are the
    CRC values the chapter's table states.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]

    names = ["propane", "dimethyl\nether", "acetaldehyde", "acetonitrile"]
    mu = [0.08, 1.30, 2.75, 3.92]
    bp = [231.0, 248.3, 293.3, 354.8]

    fig, ax = plt.subplots(figsize=(6.6, 4.2))
    ax.plot(mu, bp, marker="o", markersize=7, linewidth=2.2,
            color=fs.SERIES[mode][0], markeredgecolor=ink,
            markeredgewidth=0.7)
    offsets = [(10, -6), (10, -8), (8, -18), (-10, 6)]
    align = ["left", "left", "left", "right"]
    for n, m, b, off, ha in zip(names, mu, bp, offsets, align):
        ax.annotate(f"{n}\n{b:g} K", (m, b), textcoords="offset points",
                    xytext=off, ha=ha, fontsize=9, color=ink)
    ax.set_xlabel("molecular dipole moment (D)")
    ax.set_ylabel("boiling point (K)")
    ax.set_xlim(-0.45, 4.7)
    ax.set_ylim(205, 385)
    ax.annotate("41-46 g/mol throughout;\nno hydrogen-bond donor in the set",
                (2.35, 224), fontsize=9, color=ink2, ha="center", va="center")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


# ---------------------------------------------------------------------------
# 8.4 HBONDING
# ---------------------------------------------------------------------------

def fig_hydride_bp_anomaly(mode: str):
    """The binary-hydride boiling points, period by period.

    The evidence figure for hydrogen bonding: three of the four series
    start with an anomalously high first member, and the one that does not
    is the carbon series - the only one whose hydrogens are not on N, O or
    F. All values CRC, as stated in the chapter's table.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    period = [2, 3, 4, 5]
    series = [
        ("group 14  CH$_4$ ...", [111.7, 161.3, 184.7, 221.0], c[2], "s", "-"),
        ("group 15  NH$_3$ ...", [239.8, 185.4, 210.7, 254.8], c[1], "^", "-"),
        ("group 16  H$_2$O ...", [373.1, 212.9, 231.9, 271.0], c[0], "o", "-"),
        ("group 17  HF ...", [292.7, 188.1, 206.4, 237.8], ink2, "D", "--"),
    ]
    fig, ax = plt.subplots(figsize=(6.8, 4.4))
    for label, vals, col, mk, ls in series:
        ax.plot(period, vals, marker=mk, markersize=6, color=col,
                linewidth=2.0, linestyle=ls, label=label,
                markeredgecolor=ink, markeredgewidth=0.5)

    ax.annotate("H$_2$O", (2, 373.1), textcoords="offset points",
                xytext=(6, 4), fontsize=9.5, color=ink)
    ax.annotate("HF", (2, 292.7), textcoords="offset points",
                xytext=(6, 2), fontsize=9.5, color=ink)
    ax.annotate("NH$_3$", (2, 239.8), textcoords="offset points",
                xytext=(6, -2), fontsize=9.5, color=ink)
    ax.annotate("CH$_4$", (2, 111.7), textcoords="offset points",
                xytext=(6, -3), fontsize=9.5, color=ink)
    ax.annotate("the carbon series alone\nrises monotonically",
                (3.4, 118), fontsize=9, color=ink2, ha="center", va="center")

    ax.set_xticks(period)
    ax.set_xlabel("period of the central element")
    ax.set_ylabel("boiling point (K)")
    ax.set_xlim(1.72, 5.3)
    ax.set_ylim(80, 420)
    ax.legend(frameon=False, fontsize=8.5, loc="upper right")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


def fig_hbond_geometry(mode: str):
    """The geometry of one hydrogen bond, and its angular dependence.

    Left panel drawn to scale from the crystallographic averages the prose
    states: a covalent O-H near 0.97 angstrom, an H...O contact near 1.8,
    an O...O separation near 2.8, and a preferred D-H...A angle at 180
    degrees. Right panel is the cos-squared angular factor computed from
    that preference, showing the bond is half-strength by 45 degrees off
    line - which is why hydrogen bonding is directional and dispersion is
    not.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    fig, (axl, axr) = plt.subplots(1, 2, figsize=(8.0, 3.6),
                                   gridspec_kw={"width_ratios": [1.25, 1.0]})

    # --- left: the geometry, drawn on a 0-3.2 angstrom axis
    axl.plot([0.0], [0.0], marker="o", markersize=17, color=c[1],
             markeredgecolor=ink, markeredgewidth=0.8)
    axl.annotate("O", (0.0, 0.0), ha="center", va="center", fontsize=9.5,
                 color=fs.PHASE_NEG[mode], zorder=6)
    axl.plot([0.97], [0.0], marker="o", markersize=8, color=fs.GUIDE[mode],
             markeredgecolor=ink, markeredgewidth=0.7)
    axl.plot([2.77], [0.0], marker="o", markersize=17, color=c[0],
             markeredgecolor=ink, markeredgewidth=0.8)
    axl.annotate("O", (2.77, 0.0), ha="center", va="center", fontsize=9.5,
                 color=fs.PHASE_NEG[mode], zorder=6)
    axl.plot([0.0, 0.97], [0, 0], color=ink, linewidth=2.6, zorder=2)
    axl.plot([0.97, 2.77], [0, 0], color=c[0], linewidth=1.8,
             linestyle=(0, (3, 2.5)), zorder=2)

    axl.annotate("donor", (0.0, 0.30), ha="center", fontsize=9, color=ink2)
    axl.annotate("H", (0.97, 0.30), ha="center", fontsize=9, color=ink2)
    axl.annotate("acceptor", (2.77, 0.30), ha="center", fontsize=9, color=ink2)
    axl.annotate("0.97 $\\AA$\ncovalent", (0.485, -0.24), ha="center",
                 va="top", fontsize=8.5, color=ink)
    axl.annotate("1.80 $\\AA$\nhydrogen bond", (1.95, -0.24), ha="center",
                 va="top", fontsize=8.5, color=ink)
    axl.annotate("O$\\cdots$O 2.77 $\\AA$", (1.385, -1.12), ha="center",
                 va="center", fontsize=8.5, color=ink2)
    axl.annotate("", xy=(2.77, -0.92), xytext=(0.0, -0.92),
                 arrowprops=dict(arrowstyle="<->", color=ink2, linewidth=1.0))
    axl.set_xlim(-0.75, 3.55)
    axl.set_ylim(-1.42, 0.62)
    axl.axis("off")

    # --- right: angular factor
    theta = np.linspace(0, 90, 300)
    axr.plot(theta, np.cos(np.radians(theta)) ** 2, color=c[0], linewidth=2.4)
    axr.axhline(0.5, color=fs.GUIDE[mode], linewidth=1.0, linestyle=(0, (4, 3)))
    axr.plot([45], [0.5], marker="o", markersize=6, color=c[1],
             markeredgecolor=ink, markeredgewidth=0.7, zorder=5)
    axr.annotate("half strength\nat 45$^\\circ$ off line", (45, 0.5),
                 textcoords="offset points", xytext=(8, 14), fontsize=8.5,
                 color=ink)
    axr.set_xlabel("deviation from linear D-H$\\cdots$A ($^\\circ$)")
    axr.set_ylabel("relative strength")
    axr.set_xlim(0, 90)
    axr.set_ylim(-0.03, 1.12)
    axr.set_xticks([0, 30, 60, 90])
    axr.spines[["top", "right"]].set_visible(False)
    axr.grid(color=fs.GRID[mode], linewidth=0.6)
    axr.set_axisbelow(True)
    return fig


# ---------------------------------------------------------------------------
# 8.5 IMFPROPERTIES
# ---------------------------------------------------------------------------

def fig_bp_decision_ladder(mode: str):
    """The ranking algorithm as a ladder of tie-breaks.

    A schematic of the procedure the section states, drawn so the ORDER is
    the visual claim: each question is asked only when the one above it
    ties, and the last rung carries the warning that the ladder is a
    ranking of typical magnitudes rather than a law.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    rungs = [
        ("1.  Hydrogen bonding available?", "donor AND acceptor present", c[0]),
        ("2.  Permanent dipole?", "bond dipoles that do not cancel", c[0]),
        ("3.  More electrons?", "size - the dispersion reservoir", c[2]),
        ("4.  Less branched?", "contact area - the shape tie-break", c[2]),
    ]
    fig, ax = plt.subplots(figsize=(6.8, 4.6))
    for i, (q, why, col) in enumerate(rungs):
        y = 3.35 - i * 1.02
        ax.add_patch(Rectangle((0.0, y), 4.5, 0.72, facecolor="none",
                               edgecolor=col, linewidth=1.8))
        ax.annotate(q, (0.16, y + 0.50), fontsize=10, color=ink, va="center")
        ax.annotate(why, (0.16, y + 0.19), fontsize=8.5, color=ink2,
                    va="center")
        if i < len(rungs) - 1:
            ax.add_patch(FancyArrowPatch((2.25, y), (2.25, y - 0.30),
                                         arrowstyle="-|>", mutation_scale=12,
                                         color=fs.GUIDE[mode], linewidth=1.5))
            ax.annotate("tie", (2.36, y - 0.15), fontsize=8, color=ink2,
                        va="center")
    ax.annotate("Ranked by typical magnitude, not by law: enough extra\n"
                "dispersion beats a modest dipole, and rung 3 can\n"
                "overturn rung 2 whenever the size gap is large.",
                (0.0, -0.36), fontsize=8.5, color=ink2, va="top")
    ax.set_xlim(-0.25, 4.85)
    ax.set_ylim(-1.30, 4.20)
    ax.axis("off")
    return fig


def fig_xylene_mp_bp(mode: str):
    """Melting point answers to symmetry; boiling point answers to size.

    The three xylenes are constitutional isomers with the same formula,
    mass and electron count, and they boil within 6 K of one another. They
    melt across a 61 K range, ordered by how well each packs. CRC values,
    as tabulated in the section.
    """
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]

    labels = ["benzene", "toluene", "o-xylene", "m-xylene", "p-xylene"]
    mp = [278.7, 178.2, 248.0, 225.3, 286.4]
    bp = [353.2, 383.8, 417.6, 412.3, 411.5]

    x = np.arange(len(labels))
    fig, ax = plt.subplots(figsize=(7.0, 4.2))
    ax.bar(x - 0.19, bp, 0.36, color=c[0], edgecolor=ink, linewidth=0.6,
           label="boiling point")
    ax.bar(x + 0.19, mp, 0.36, color=c[1], edgecolor=ink, linewidth=0.6,
           label="melting point")
    for xi, v in zip(x - 0.19, bp):
        ax.annotate(f"{v:g}", (xi, v), textcoords="offset points",
                    xytext=(0, 4), ha="center", fontsize=8, color=ink)
    for xi, v in zip(x + 0.19, mp):
        ax.annotate(f"{v:g}", (xi, v), textcoords="offset points",
                    xytext=(0, 4), ha="center", fontsize=8, color=ink)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylabel("temperature (K)")
    ax.set_ylim(0, 500)
    ax.legend(frameon=False, fontsize=9, loc="upper left", ncol=2)
    ax.annotate("three isomers: bp within 6 K, mp across 61 K",
                (3.0, 90), ha="center", fontsize=9, color=ink)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


# ---------------------------------------------------------------------------
# 8.6 SOLUBILITY
# ---------------------------------------------------------------------------

def fig_alcohol_solubility(mode: str):
    """Water solubility of the unbranched 1-alkanols, on a log axis.

    One hydroxyl throughout; only the hydrocarbon tail changes. Solubility
    falls by roughly a factor of three per added CH2, which is the
    hydrophobic effect priced per carbon. CRC values as tabulated; the
    first three are miscible in all proportions and are drawn at the top
    of the axis with an open marker rather than given a false number.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    carbons = [4, 5, 6, 7, 8]
    sol = [7.3, 2.2, 0.59, 0.17, 0.054]

    fig, ax = plt.subplots(figsize=(6.6, 4.2))
    ax.plot(carbons, sol, marker="o", markersize=7, linewidth=2.2, color=c[0],
            markeredgecolor=ink, markeredgewidth=0.7, label="measured")
    ax.plot([1, 2, 3], [60, 60, 60], marker="o", markersize=8,
            markerfacecolor="none", markeredgecolor=c[2], markeredgewidth=1.8,
            linestyle="none", label="miscible in all proportions")
    ax.set_yscale("log")
    ax.set_xlabel("carbons in the unbranched 1-alkanol")
    ax.set_ylabel("solubility in water (g per 100 mL)")
    ax.set_xlim(0.4, 8.9)
    ax.set_ylim(0.02, 200)
    ax.set_xticks([1, 2, 3, 4, 5, 6, 7, 8])
    for n, s in zip(carbons, sol):
        ax.annotate(f"{s:g}", (n, s), textcoords="offset points",
                    xytext=(8, 5), fontsize=8.5, color=ink)
    ax.annotate("a straight line on a log axis:\nabout a threefold fall per CH$_2$",
                (6.0, 22), ha="center", fontsize=9, color=ink2)
    ax.legend(frameon=False, fontsize=8.5, loc="lower left")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


def fig_solvent_map(mode: str):
    """Solvents sorted by dielectric constant and grouped by class.

    The three classes are the ones chapter 9 will need: protic solvents
    that donate hydrogen bonds and therefore cage anions, polar aprotic
    solvents that solvate cations while leaving anions bare, and nonpolar
    solvents that do neither. Dielectric constants are the standard
    tabulated values near 293-298 K, as stated in the section's table.
    """
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    c = fs.SERIES[mode]

    rows = [
        ("water", 78.4, "protic"),
        ("methanol", 32.7, "protic"),
        ("ethanol", 24.5, "protic"),
        ("acetic acid", 6.2, "protic"),
        ("DMSO", 46.7, "polar aprotic"),
        ("acetonitrile", 37.5, "polar aprotic"),
        ("DMF", 36.7, "polar aprotic"),
        ("acetone", 20.7, "polar aprotic"),
        ("dichloromethane", 8.9, "nonpolar / weakly polar"),
        ("THF", 7.6, "nonpolar / weakly polar"),
        ("diethyl ether", 4.3, "nonpolar / weakly polar"),
        ("toluene", 2.4, "nonpolar / weakly polar"),
        ("hexane", 1.9, "nonpolar / weakly polar"),
    ]
    colour = {"protic": c[0], "polar aprotic": c[1],
              "nonpolar / weakly polar": c[2]}

    fig, ax = plt.subplots(figsize=(7.0, 4.8))
    ys = np.arange(len(rows))[::-1]
    for y, (name, eps, cls) in zip(ys, rows):
        ax.barh(y, eps, height=0.62, color=colour[cls], edgecolor=ink,
                linewidth=0.6)
        ax.annotate(f"{eps:g}", (eps, y), textcoords="offset points",
                    xytext=(6, 0), va="center", fontsize=8.5, color=ink)
    ax.set_yticks(ys)
    ax.set_yticklabels([r[0] for r in rows], fontsize=9)
    ax.set_xlabel("dielectric constant")
    ax.set_xlim(0, 128)

    handles = [plt.Line2D([], [], marker="s", linestyle="none",
                          markersize=8, markerfacecolor=colour[k],
                          markeredgecolor=ink, label=k)
               for k in ("protic", "polar aprotic",
                         "nonpolar / weakly polar")]
    ax.legend(handles=handles, frameon=False, fontsize=8.5,
              loc="lower right")
    ax.annotate("ionic solutes need a high dielectric constant;\n"
                "the protic / aprotic split decides what happens\n"
                "to the anion once it is dissolved",
                (88, 8.6), fontsize=8.5, color=ink2, va="center")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="x", color=fs.GRID[mode], linewidth=0.6)
    ax.set_axisbelow(True)
    return fig


REGISTRY = {
    "org1-imf-strength-ladder": fig_imf_strength_ladder,
    "org1-imf-distance-decay": fig_imf_distance_decay,
    "org1-halogen-bp": fig_halogen_bp,
    "org1-dispersion-contact": fig_dispersion_contact,
    "org1-dipole-vectors": fig_dipole_vectors,
    "org1-dipole-bp-series": fig_dipole_bp_series,
    "org1-hydride-bp-anomaly": fig_hydride_bp_anomaly,
    "org1-hbond-geometry": fig_hbond_geometry,
    "org1-bp-decision-ladder": fig_bp_decision_ladder,
    "org1-xylene-mp-bp": fig_xylene_mp_bp,
    "org1-alcohol-solubility": fig_alcohol_solubility,
    "org1-solvent-map": fig_solvent_map,
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for stem, fn in REGISTRY.items():
        for mode in ("light", "dark"):
            fs.apply(mode)
            fig = fn(mode)
            fs.save(fig, OUT, stem, mode)
        print(f"wrote {stem}-{{light,dark}}.svg")
    print(f"\n{len(REGISTRY)} figures x 2 themes")


if __name__ == "__main__":
    main()
