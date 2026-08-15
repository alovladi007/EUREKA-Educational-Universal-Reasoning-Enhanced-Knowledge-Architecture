#!/usr/bin/env python3
"""Generate the figures for MCAT Biochemistry I, chapters I.1-I.11.

Same contract as gen_fe_ee_figures.py, and it deliberately imports the SAME
style module rather than growing a second look: every quantitative figure here
is COMPUTED from the equation the chapter states, with its parameters printed
on the figure, so a reader can check the curve against the formula. The
schematics (structure hierarchy, energy diagram, glucose anomers, fatty-acid
kinks, base pairing) carry only qualitative labels and no numbers; the
structural ones depict textbook-standard chemistry (which substituent sits on
which carbon) without reproducing anyone's rendering of it. Nothing is traced,
scanned or adapted from any textbook - this pipeline consumes formulas and
structural facts, which are not protected expression, and never anyone's
drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/mcat/biochem/<name>.svg
    apps/web/public/courses/mcat/biochem/<name>.dark.svg

and is referenced from a lesson as an ordinary markdown image whose ALT TEXT
IS THE CAPTION:

    ![Sentence describing what the figure shows.](/courses/mcat/biochem/<name>.svg)

The course reader swaps in the .dark.svg variant under the dark theme and
promotes the alt text to a visible caption.

Chapter map (docs/mcat/BIOCHEM_CHAPTERS.md):
    I.1 water, pH, buffers        -> bc1-titration-curve
    I.2 amino acids, pI           -> bc1-amino-acid-ionization
    I.3 protein architecture      -> bc1-structure-hierarchy
    I.4 binding, cooperativity    -> bc1-oxygen-binding
    I.5 catalysis                 -> bc1-energy-diagram
    I.6 kinetics                  -> bc1-michaelis-menten
    I.7 control (with I.6)        -> bc1-lineweaver-inhibition
    I.8 carbohydrates             -> bc1-glucose-anomers
    I.9 lipids                    -> bc1-fatty-acid-kinks
    I.10 membranes and transport  -> bc1-membrane-transport
    I.11 nucleic acid structure   -> bc1-base-pairing

Second pass (figures for the deepened lessons; same contract):
    I.1  bc1-fraction-deprotonated, bc1-bicarbonate-system
    I.2  bc1-glycine-titration
    I.3  bc1-ramachandran, bc1-helix-geometry
    I.4  bc1-hill-plot, bc1-bpg-family
    I.5  bc1-rate-vs-barrier, bc1-chymotrypsin-ph
    I.6  bc1-inhibition-rates
    I.7  bc1-hill-family, bc1-hexokinase-glucokinase
    I.8  bc1-mutarotation
    I.9  bc1-fatty-acid-melting
    I.10 bc1-transport-dg
    I.11 bc1-dna-melting, bc1-dna-damage

Third pass (Biochemistry II wave A, chapters II.1-II.8; same contract):
    II.1 bc2-deltag-vs-q          (computed)
    II.2 bc2-glycolysis-ledger    (schematic)
    II.3 bc2-glycogen-branching   (schematic)
    II.4 bc2-tca-ledger           (schematic)
    II.5 bc2-proton-motive        (computed)
    II.6 bc2-palmitate-ledger     (computed)
    II.7 bc2-nitrogen-flow        (schematic)
    II.8 bc2-fed-fasting          (schematic)

Fourth pass (Biochemistry II wave B, chapters II.9-II.14; all schematic -
qualitative labels only, each declaring itself schematic on the figure):
    II.9  bc2-dna-packing            (schematic)
    II.10 bc2-replication-fork       (schematic)
    II.11 bc2-repair-pathways        (schematic)
    II.12 bc2-transcript-processing  (schematic)
    II.13 bc2-translation-cycle      (schematic)
    II.14 bc2-lac-operon             (schematic)

Usage:
    python3 scripts/gen_mcat_biochem_figures.py          # all
    python3 scripts/gen_mcat_biochem_figures.py bc1-ox   # only matching names
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Ellipse  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "mcat" / "biochem"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# I.1  Water, pH, and the chemistry of life
# ---------------------------------------------------------------------------


@figure("bc1-titration-curve")
def _(mode):
    """Weak-acid titration computed from Henderson-Hasselbalch.

    With x equivalents of strong base added (0 < x < 1), the base/acid ratio
    is x/(1-x), so pH = pKa + log10(x/(1-x)) exactly. pKa = 4.76 (acetic
    acid). The half-equivalence point, where pH = pKa, and the buffering
    region, where pH sits within one unit of pKa, both fall out of the same
    formula rather than being drawn in.
    """
    c = S.SERIES[mode]
    pKa = 4.76
    x = np.linspace(0.01, 0.99, 600)
    pH = pKa + np.log10(x / (1.0 - x))

    fig, ax = plt.subplots()
    # pH = pKa +/- 1 exactly where x/(1-x) = 10 or 1/10, i.e. x = 10/11, 1/11
    lo, hi = 1.0 / 11.0, 10.0 / 11.0
    ax.axvspan(lo, hi, color=S.GUIDE[mode], alpha=0.12, lw=0)
    ax.plot(x, pH, color=c[0], lw=2.2)
    ax.plot([0.5], [pKa], "o", color=c[0], ms=7)
    ax.plot([0.5, 0.5], [2.4, pKa], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([0.0, 0.5], [pKa, pKa], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 0.52, 4.45, "half-equivalence:\npH = pKa = 4.76", mode, va="top")
    S.note(ax, (lo + hi) / 2.0, 6.95, "buffering region: pH within 1 of pKa",
           mode, ha="center")
    S.note(ax, 0.10, 6.15, "acetic acid, pKa = 4.76", mode)
    S.note(ax, 0.97, 2.55,
           "computed from pH = pKa + log[x/(1-x)],\n"
           "x = equivalents added (buffer span only)", mode, ha="right")
    ax.set_xlabel("equivalents of strong base added")
    ax.set_ylabel("pH")
    ax.set_title("The flat middle of the titration IS the buffer")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(2.4, 7.4)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.2  Amino acids and the peptide bond
# ---------------------------------------------------------------------------


@figure("bc1-amino-acid-ionization")
def _(mode):
    """Fraction protonated against pH for glutamate's three groups.

    Each curve is the Henderson-Hasselbalch fraction 1/(1 + 10^(pH - pKa)),
    nothing else. pKa values 2.19, 4.25 and 9.67 are the standard tabulated
    values for free glutamate (cited in the axis note). The pI is the
    midpoint of the two acid pKas because at that pH the +1 amine exactly
    balances one full negative carboxylate, the other being half-formed on
    each side symmetrically.
    """
    c = S.SERIES[mode]
    pH = np.linspace(0.0, 12.0, 600)
    groups = [
        (2.19, "alpha-carboxyl\npKa 2.19", c[0], -8, "right"),
        (4.25, "side-chain carboxyl\npKa 4.25", c[1], 8, "left"),
        (9.67, "alpha-amino\npKa 9.67", c[2], 8, "left"),
    ]
    fig, ax = plt.subplots()
    for pKa, lab, col, dx, ha in groups:
        f = 1.0 / (1.0 + 10.0 ** (pH - pKa))
        ax.plot(pH, f, color=col, lw=2.2)
        ax.plot([pKa], [0.5], "o", color=col, ms=6)
        S.label_end(ax, pKa, 0.5, lab, col, mode, dx=dx, ha=ha)
    pI = (2.19 + 4.25) / 2.0
    ax.axvline(pI, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, pI + 0.15, 1.06, "pI = (2.19 + 4.25)/2 = 3.22", mode)
    ax.set_xlabel("pH    (pKa values: standard tabulated values for free glutamate)")
    ax.set_ylabel("fraction protonated")
    ax.set_title("Each group lets go of its proton around its own pKa")
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 1.16)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.3  Protein architecture
# ---------------------------------------------------------------------------


@figure("bc1-structure-hierarchy")
def _(mode):
    """The four levels of protein structure as a purely qualitative ladder.

    No measurements, no scales: a bead chain for primary, a helix and a
    strand for secondary, one folded chain for tertiary, and the same fold
    repeated for quaternary. The quaternary sketch reuses the guide colour -
    four categories from a three-hue palette, per the house palette cap.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 3.8))

    def squiggle(cx, cy, scale, col, lw=2.0):
        t = np.linspace(0, 2 * np.pi, 400)
        xs = cx + scale * (0.9 * np.cos(t) + 0.45 * np.cos(3 * t + 1.0))
        ys = cy + scale * (0.55 * np.sin(2 * t) + 0.28 * np.sin(5 * t))
        ax.plot(xs, ys, color=col, lw=lw, solid_capstyle="round")

    # primary: a chain of residues
    xs = np.linspace(0.8, 3.2, 8)
    ys = 2.3 + 0.18 * np.sin(np.linspace(0, 2.4 * np.pi, 8))
    ax.plot(xs, ys, color=c[0], lw=1.8)
    ax.plot(xs, ys, "o", color=c[0], ms=7)
    # direction cue, qualitative only
    ax.text(1.45, 2.95, "N", color=S.INK_2[mode], fontsize=9,
            ha="right", va="center")
    ax.annotate("", xy=(3.2, 2.95), xytext=(1.6, 2.95),
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.0))
    ax.text(3.35, 2.95, "C", color=S.INK_2[mode], fontsize=9, va="center")

    # secondary: helix above, strand below
    s = np.linspace(0, 1, 300)
    ax.plot(4.6 + 2.8 * s, 2.75 + 0.22 * np.sin(2 * np.pi * 4.5 * s),
            color=c[1], lw=2.0)
    zx = np.linspace(4.7, 7.3, 9)
    zy = 1.75 + 0.16 * np.where(np.arange(9) % 2 == 0, 1.0, -1.0)
    ax.plot(zx, zy, color=c[1], lw=2.0)
    ax.text(6.0, 3.25, "alpha-helix", ha="center", fontsize=9,
            color=S.INK_2[mode])
    ax.text(6.0, 1.30, "beta-strand", ha="center", va="top", fontsize=9,
            color=S.INK_2[mode])

    # tertiary: one folded chain
    squiggle(10.0, 2.25, 1.0, c[2])

    # quaternary: the same fold, assembled (guide colour = 4th category)
    for dx, dy in ((-0.62, 0.42), (0.62, 0.42), (-0.62, -0.42), (0.62, -0.42)):
        squiggle(13.9 + dx, 2.25 + dy, 0.42, S.GUIDE[mode], lw=1.6)

    for cx, name, desc in (
            (2.0, "primary", "the sequence, N to C"),
            (6.0, "secondary", "local H-bonded motifs"),
            (10.0, "tertiary", "one chain, fully folded"),
            (13.9, "quaternary", "chains assembled")):
        ax.text(cx, 4.0, name, ha="center", va="center", fontsize=12,
                fontweight="semibold", color=S.INK[mode])
        ax.text(cx, 0.55, desc, ha="center", va="center", fontsize=9.5,
                color=S.INK_2[mode])
    for x0 in (3.55, 7.55, 11.55):
        ax.annotate("", xy=(x0 + 0.9, 2.25), xytext=(x0, 2.25),
                    arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                    lw=1.8))
    ax.set_title("Four levels of protein structure, each built from the one below")
    ax.set_xlim(0.2, 15.8)
    ax.set_ylim(0.1, 4.5)
    ax.set_xticks([])
    ax.set_yticks([])
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# ---------------------------------------------------------------------------
# I.4  Proteins at work: binding
# ---------------------------------------------------------------------------


@figure("bc1-oxygen-binding")
def _(mode):
    """Hyperbolic vs sigmoidal oxygen binding, both computed pointwise.

    Myoglobin: Y = P/(P + K) with K = 2.8 torr. Hemoglobin: the Hill
    equation Y = P^n/(P50^n + P^n) with n = 2.8 and P50 = 26 torr. The
    stated parameters are printed beside each curve; the half-saturation
    guides fall where the equations put them.
    """
    c = S.SERIES[mode]
    P = np.linspace(0.0, 100.0, 600)
    K = 2.8
    n, P50 = 2.8, 26.0
    Y_mb = P / (P + K)
    with np.errstate(divide="ignore", invalid="ignore"):
        Y_hb = P ** n / (P50 ** n + P ** n)
    Y_hb[0] = 0.0

    fig, ax = plt.subplots()
    ax.plot(P, Y_mb, color=c[0], lw=2.2)
    ax.plot(P, Y_hb, color=c[1], lw=2.2)
    S.label_end(ax, 18.0, 1.0, "myoglobin\nY = P/(P + K),  K = 2.8 torr",
                c[0], mode, dx=0, dy=0)
    S.label_end(ax, 52.0, 0.40, "hemoglobin (Hill)\nY = P$^n$/(P50$^n$ + P$^n$)\n"
                "n = 2.8,  P50 = 26 torr", c[1], mode, dx=0, dy=0)
    for x0, col in ((K, c[0]), (P50, c[1])):
        ax.plot([x0], [0.5], "o", color=col, ms=6)
        ax.plot([x0, x0], [0, 0.5], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([0, P50], [0.5, 0.5], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, K + 0.8, 0.02, "2.8", mode)
    S.note(ax, P50 + 0.8, 0.02, "26", mode)
    ax.set_xlabel(r"oxygen partial pressure  pO$_2$  (torr)")
    ax.set_ylabel("fractional saturation  Y")
    ax.set_title("Cooperativity turns a hyperbola into a switch")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.5  Enzymes: how catalysis happens
# ---------------------------------------------------------------------------


@figure("bc1-energy-diagram")
def _(mode):
    """Reaction coordinate schematic: qualitative axes, no numeric energies.

    The wells and barriers are drawn shapes, not data - a logistic step
    between two levels plus a Gaussian bump, which is the least-committal
    smooth curve with the right features. Nothing on either axis carries a
    number, and the one quantitative claim (the enzyme leaves the overall
    free-energy change alone) is shown by the two curves sharing both wells.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.0, 1.0, 600)
    R, Pv = 0.62, 0.30  # arbitrary drawing heights, never printed

    def profile(barrier):
        base = R + (Pv - R) / (1.0 + np.exp(-(x - 0.5) / 0.05))
        return base + barrier * np.exp(-((x - 0.5) ** 2) / (2 * 0.012))

    uncat = profile(0.42)
    cat = profile(0.22)

    fig, ax = plt.subplots()
    ax.plot(x, uncat, color=c[1], lw=2.2)
    ax.plot(x, cat, color=c[0], lw=2.2)
    # the enzyme lowers the barrier...
    top_u, top_c = uncat.max(), cat.max()
    ax.annotate("", xy=(0.5, top_c + 0.01), xytext=(0.5, top_u - 0.005),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=1.4))
    # ...but not the destination: both wells extend to a shared Delta-G arrow
    ax.plot([0.10, 1.24], [R, R], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([0.90, 1.24], [Pv, Pv], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.annotate("", xy=(1.18, Pv), xytext=(1.18, R),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=1.4))
    S.note(ax, 1.21, (R + Pv) / 2.0, "overall free-energy\nchange: unchanged\nby the enzyme",
           mode, va="center")
    S.label_end(ax, 0.5, top_u, "uncatalyzed", c[1], mode, dx=0, dy=8, ha="center")
    # The lower-left quarter is the only guaranteed-empty region, so the
    # catalyzed label lives there and points at its curve with a thin leader.
    ax.annotate("enzyme-catalyzed:\nlower activation barrier,\n"
                "same start, same end",
                xy=(0.44, 0.665), xytext=(0.05, 0.34),
                color=c[0], fontsize=10, fontweight="semibold",
                ha="left", va="top",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.1,
                                shrinkB=4))
    S.note(ax, 0.04, R + 0.02, "reactants", mode)
    S.note(ax, 0.86, Pv - 0.035, "products", mode, va="top")
    ax.set_xlabel("reaction progress")
    ax.set_ylabel("free energy")
    ax.set_title("An enzyme lowers the barrier, never the destination")
    ax.set_xlim(0.0, 1.44)
    ax.set_ylim(0.16, 1.14)
    ax.set_xticks([])
    ax.set_yticks([])
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.6  Enzyme kinetics and inhibition
# ---------------------------------------------------------------------------


@figure("bc1-michaelis-menten")
def _(mode):
    """Michaelis-Menten computed from v = Vmax [S] / (Km + [S]).

    Vmax = 100 in arbitrary rate units (stated on the axis) and Km = 2 in
    the same concentration units as [S]. The two facts every exam question
    leans on are marked where the equation puts them: v = Vmax/2 exactly at
    [S] = Km, and Vmax is an asymptote the curve never reaches.
    """
    c = S.SERIES[mode]
    Vmax, Km = 100.0, 2.0
    Sconc = np.linspace(0.0, 20.0, 600)
    v = Vmax * Sconc / (Km + Sconc)

    fig, ax = plt.subplots()
    ax.plot(Sconc, v, color=c[0], lw=2.2)
    ax.axhline(Vmax, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 19.6, Vmax + 2.5, "Vmax = 100: asymptote, never reached",
           mode, ha="right")
    ax.plot([Km], [Vmax / 2], "o", color=c[0], ms=7)
    ax.plot([Km, Km], [0, Vmax / 2], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([0, Km], [Vmax / 2, Vmax / 2], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, Km + 0.4, Vmax / 2 - 6.0, "at [S] = Km = 2,  v = Vmax/2",
           mode, va="top")
    S.label_end(ax, 12.0, Vmax * 12.0 / (Km + 12.0),
                r"v = V$_{max}$[S] / (K$_m$ + [S])", c[0], mode, dx=0, dy=-16,
                ha="center", va="top")
    ax.set_xlabel("substrate concentration  [S]   (same units as Km = 2)")
    ax.set_ylabel(r"initial rate  v$_0$   (arbitrary units, Vmax = 100)")
    ax.set_title("Km is a concentration; Vmax is a ceiling")
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 115)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.7  Enzyme control (double-reciprocal reading, with I.6)
# ---------------------------------------------------------------------------


@figure("bc1-lineweaver-inhibition")
def _(mode):
    """Double-reciprocal plot: the exact rate law inverted, three ways.

    Every line is 1/v = (Km/Vmax)(1/[S]) + 1/Vmax with illustrative
    parameters: uninhibited Vmax = 100 (arbitrary units), Km = 2;
    competitive inhibition doubles the apparent Km to 4 (same Vmax);
    noncompetitive halves Vmax to 50 (same Km). The diagnostic geometry -
    competitive shares the y-intercept with the control, noncompetitive
    shares the x-intercept - is computed, not staged.
    """
    c = S.SERIES[mode]
    cases = [
        ("no inhibitor", 100.0, 2.0, c[0], -3),
        ("competitive\n(Km,app = 4)", 100.0, 4.0, c[1], -8),
        ("noncompetitive\n(Vmax = 50)", 50.0, 2.0, c[2], 8),
    ]
    fig, ax = plt.subplots()
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)
    for lab, Vmax, Km, col, dy in cases:
        xi = np.linspace(-1.0 / Km, 1.02, 300)  # from the x-intercept up
        yi = (Km / Vmax) * xi + 1.0 / Vmax
        ax.plot(xi, yi, color=col, lw=2.2)
        S.label_end(ax, xi[-1], yi[-1], lab, col, mode, dy=dy)
    # intercepts, exactly where the algebra puts them
    ax.plot([0, 0], [0.01, 0.02], "o", color=S.GUIDE[mode], ms=5, ls="none")
    S.note(ax, 0.025, 0.0045, "1/Vmax", mode)
    S.note(ax, -0.03, 0.0205, "1/Vmax doubled", mode, ha="right")
    ax.plot([-0.5, -0.25], [0, 0], "o", color=S.GUIDE[mode], ms=5, ls="none")
    S.note(ax, -0.5, -0.004, "-1/Km", mode, ha="center", va="top")
    S.note(ax, -0.25, -0.004, "-1/Km,app", mode, ha="center", va="top")
    S.note(ax, -0.62, 0.070,
           "each line is the exact rate law inverted:\n"
           "1/v = (Km/Vmax)(1/[S]) + 1/Vmax\n"
           "illustrative parameters: Vmax = 100 (arb.), Km = 2;\n"
           "competitive doubles Km,app; noncompetitive halves Vmax", mode)
    ax.set_xlabel("1/[S]")
    ax.set_ylabel("1/v")
    ax.set_title("Competitive pivots on the y-axis; noncompetitive on the x-axis")
    ax.set_xlim(-0.66, 1.30)
    ax.set_ylim(-0.012, 0.085)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.8  Carbohydrates
# ---------------------------------------------------------------------------


@figure("bc1-glucose-anomers")
def _(mode):
    """Haworth-style alpha- vs beta-D-glucopyranose: pure schematic.

    Two simplified pyranose hexagons whose substituent pattern is the
    textbook-standard one for D-glucose in a Haworth drawing (C2 OH down,
    C3 OH up, C4 OH down, CH2OH up at C5, ring O at the back right) and is
    IDENTICAL between the rings; the only drawn difference is the anomeric
    C1 hydroxyl, below the ring plane in alpha and above it in beta. No
    coordinate carries a measurement - the alpha/beta distinction and the
    mutarotation note are the entire content.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 3.9))
    cy = 2.6

    def ring(cx, anomeric_up, greek):
        V = {
            "C1": (cx + 1.15, cy),
            "O": (cx + 0.55, cy + 0.62),
            "C5": (cx - 0.55, cy + 0.62),
            "C4": (cx - 1.15, cy),
            "C3": (cx - 0.55, cy - 0.62),
            "C2": (cx + 0.55, cy - 0.62),
        }
        # front edges thicker, Haworth-style depth cue; gap left for the O
        edges = [("C1", "C2", 3.0), ("C2", "C3", 3.0), ("C3", "C4", 3.0),
                 ("C4", "C5", 1.5), ("C5", "O", 1.5), ("O", "C1", 1.5)]
        for a, b, lw in edges:
            (x0, y0), (x1, y1) = V[a], V[b]
            if b == "O":
                x1, y1 = x0 + 0.78 * (x1 - x0), y0 + 0.78 * (y1 - y0)
            if a == "O":
                x0, y0 = x0 + 0.22 * (x1 - x0), y0 + 0.22 * (y1 - y0)
            ax.plot([x0, x1], [y0, y1], color=c[0], lw=lw,
                    solid_capstyle="round")
        ax.text(*V["O"], "O", color=S.INK[mode], fontsize=10,
                ha="center", va="center")

        def sub(key, up, text, col, accent=False):
            x, y = V[key]
            d = 0.42 if up else -0.42
            ax.plot([x, x], [y, y + d], color=col,
                    lw=2.0 if accent else 1.4)
            ax.text(x, y + d + (0.10 if up else -0.10), text, color=col,
                    fontsize=9, ha="center",
                    va="bottom" if up else "top",
                    fontweight="semibold" if accent else "normal")

        ink = S.INK[mode]
        sub("C2", False, "OH", ink)
        sub("C3", True, "OH", ink)
        sub("C4", False, "OH", ink)
        sub("C5", True, r"CH$_2$OH", ink)
        # the one difference: the anomeric hydroxyl
        sub("C1", anomeric_up, "OH", c[1], accent=True)
        ex, ey = V["C1"][0], cy + (0.52 if anomeric_up else -0.52)
        t = np.linspace(0, 2 * np.pi, 120)
        ax.plot(ex + 0.44 * np.cos(t), ey + 0.42 * np.sin(t),
                color=S.GUIDE[mode], lw=1.1, ls=":")
        S.note(ax, V["C1"][0] + 0.12, cy + (-0.12 if anomeric_up else 0.12),
               "C1 (anomeric)", mode, va="top" if anomeric_up else "bottom",
               size=8.5)
        ax.text(cx, 0.98, greek + "-D-glucopyranose", color=S.INK[mode],
                fontsize=11, fontweight="semibold", ha="center", va="top")
        S.note(ax, cx, 0.62,
               "anomeric OH " + ("above" if anomeric_up else "below")
               + " the ring plane", mode, ha="center", va="top")

    ring(2.1, False, r"$\alpha$")
    ring(7.9, True, r"$\beta$")
    ax.annotate("", xy=(5.9, cy), xytext=(4.0, cy),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode],
                                lw=1.6))
    S.note(ax, 5.05, cy - 0.42, "the two interconvert through the\n"
           "open-chain form (mutarotation)", mode, ha="center", va="top")
    ax.set_title("The two anomers of D-glucose differ only at the anomeric carbon")
    ax.set_xlim(0.4, 10.9)
    ax.set_ylim(0.25, 4.1)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# ---------------------------------------------------------------------------
# I.9  Lipids
# ---------------------------------------------------------------------------


@figure("bc1-fatty-acid-kinks")
def _(mode):
    """Saturated vs cis-unsaturated chain geometry: qualitative schematic.

    Two 18-carbon zigzags drawn from the same bond generator; the only
    difference is that the second chain's axis turns by 30 degrees at the
    C9-C10 cis double bond (the textbook-standard kink angle, describing
    the drawing rather than any dataset). Packing and melting are stated
    qualitatively, with no numeric melting points anywhere.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 4.0))
    b = 0.5

    def chain(y0, kink_at=None):
        pts = [np.array([0.9, y0])]
        for k in range(17):
            axis = -30.0 if (kink_at is not None and k >= kink_at) else 0.0
            ang = np.deg2rad(axis + (28.0 if k % 2 == 0 else -28.0))
            pts.append(pts[-1] + b * np.array([np.cos(ang), np.sin(ang)]))
        return np.array(pts)

    sat = chain(3.1)
    uns = chain(1.7, kink_at=8)
    ax.plot(sat[:, 0], sat[:, 1], color=c[0], lw=2.0,
            solid_capstyle="round")
    ax.plot(uns[:, 0], uns[:, 1], color=c[2], lw=2.0,
            solid_capstyle="round")

    # the cis double bond, drawn double and highlighted
    p8, p9 = uns[8], uns[9]
    d, n = p9 - p8, np.array([-(p9 - p8)[1], (p9 - p8)[0]])
    n = 0.10 * n / np.hypot(*n)
    ax.plot([p8[0], p9[0]], [p8[1], p9[1]], color=c[1], lw=2.6,
            solid_capstyle="round")
    q0, q1 = p8 + 0.18 * d + n, p9 - 0.18 * d + n
    ax.plot([q0[0], q1[0]], [q0[1], q1[1]], color=c[1], lw=2.2,
            solid_capstyle="round")
    S.label_end(ax, (p8[0] + p9[0]) / 2, (p8[1] + p9[1]) / 2,
                r"cis C=C at $\Delta$9", c[1], mode, dx=0, dy=16,
                ha="center", va="bottom", size=9)

    # dotted continuation of the pre-kink axis makes the bend visible
    ax.plot([p8[0], p8[0] + 2.5], [p8[1], p8[1]], color=S.GUIDE[mode],
            lw=1.0, ls=":")
    S.note(ax, p8[0] + 2.65, p8[1], "the cis double bond bends\n"
           "the chain by about 30 degrees", mode, va="center", size=9)

    for pts, col, lab, dy in ((sat, c[0], "saturated chain (stearic-type)", 0),
                              (uns, c[2],
                               "cis-unsaturated chain (oleic-type)", -18)):
        S.note(ax, pts[0][0] - 0.12, pts[0][1], "HOOC", mode, ha="right",
               va="center", size=9)
        S.note(ax, pts[-1][0] + 0.12, pts[-1][1], r"CH$_3$", mode,
               va="center", size=9)
        S.label_end(ax, pts[-1][0], pts[-1][1], lab, col, mode, dx=42, dy=dy)

    S.note(ax, 0.9, 3.62, "straight chains lie flat against their "
           "neighbors: tight packing, higher melting", mode)
    S.note(ax, 0.9, 0.42, "the kink props neighboring chains apart:\n"
           "looser packing, lower melting", mode, va="top")
    ax.set_title("One cis double bond bends the chain and loosens its packing")
    ax.set_xlim(0.2, 12.4)
    ax.set_ylim(-0.9, 4.05)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# ---------------------------------------------------------------------------
# I.10  Membranes and transport
# ---------------------------------------------------------------------------


@figure("bc1-membrane-transport")
def _(mode):
    """Simple diffusion vs carrier-mediated transport, both computed.

    Simple diffusion is the straight line J = P * dC with P = 1 in
    arbitrary units (stated on the figure). Carrier-mediated transport is
    J = Jmax * dC / (Km + dC) with Jmax = 100 and Km = 20, stated as
    illustrative. The saturation contrast - the line climbs forever, the
    carrier flattens at Jmax once every transporter is busy - is the whole
    lesson, and both curves are evaluated pointwise from those equations.
    """
    c = S.SERIES[mode]
    P = 1.0
    Jmax, Km = 100.0, 20.0
    dC = np.linspace(0.0, 120.0, 600)
    J_simple = P * dC
    J_carrier = Jmax * dC / (Km + dC)

    fig, ax = plt.subplots()
    ax.plot(dC, J_simple, color=c[0], lw=2.2)
    ax.plot(dC, J_carrier, color=c[1], lw=2.2)
    ax.axhline(Jmax, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 4.0, 101.8,
           r"J$_{max}$ = 100: every carrier occupied - transport saturates",
           mode)
    S.label_end(ax, 97.0, 106.0, "simple diffusion\n"
                r"J = P · $\Delta$C   (P = 1)", c[0], mode, dx=0, dy=4,
                ha="right", va="bottom")
    S.label_end(ax, 118.0, 78.0, "carrier-mediated\n"
                r"J = J$_{max}$ · $\Delta$C / (K$_m$ + $\Delta$C)"
                "\n" r"J$_{max}$ = 100, K$_m$ = 20 (illustrative)",
                c[1], mode, dx=0, dy=-8, ha="right", va="top")
    ax.plot([Km], [Jmax / 2], "o", color=c[1], ms=6)
    ax.plot([Km, Km], [0, Jmax / 2], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([0, Km], [Jmax / 2, Jmax / 2], color=S.GUIDE[mode], lw=0.9,
            ls=":")
    S.note(ax, 2.5, 53.0,
           r"at $\Delta$C = K$_m$ = 20,  J = J$_{max}$/2 = 50", mode)
    ax.set_xlabel(r"concentration gradient  $\Delta$C  (arbitrary units)")
    ax.set_ylabel("flux across the membrane  J  (arbitrary units)")
    ax.set_title("Carrier transport saturates; simple diffusion does not")
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 132)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# I.11  Nucleotides and nucleic acid structure
# ---------------------------------------------------------------------------


@figure("bc1-base-pairing")
def _(mode):
    """Watson-Crick pairing as labeled shapes: qualitative schematic.

    Purines (A, G) are drawn as a larger two-ring shape (hexagon fused to
    a pentagon, the pentagon toward the backbone as in the real bases),
    pyrimidines (T, C) as a smaller single hexagon. A:T carries two dashed
    hydrogen bonds, G:C three - the textbook bond counts, which are facts,
    not measurements. The constant-width point is made by hanging both
    rungs between the same two backbones. Nothing here is to scale.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 5.4))
    xL, xR = 2.4, 9.6
    y_at, y_gc = 4.1, 1.9

    for x in (xL, xR):
        ax.plot([x, x], [0.9, 5.05], color=S.GUIDE[mode], lw=3.0,
                solid_capstyle="round")
        S.note(ax, x, 5.2, "sugar-phosphate\nbackbone", mode, ha="center",
               size=8.5)

    def hexagon(cx, cy, r, col):
        t = np.deg2rad(np.array([30, 90, 150, 210, 270, 330]))
        xs, ys = cx + r * np.cos(t), cy + r * np.sin(t)
        ax.fill(xs, ys, color=col, alpha=0.10, lw=0)
        ax.plot(np.append(xs, xs[0]), np.append(ys, ys[0]), color=col,
                lw=2.0)

    def purine(cy, letter, name):
        cx, r = 5.04, 0.8
        hexagon(cx, cy, r, c[0])
        w = r * np.cos(np.deg2rad(30))
        px = [cx - w, cx - w - 0.75, cx - w - 1.1, cx - w - 0.75, cx - w]
        py = [cy + 0.4, cy + 0.52, cy, cy - 0.52, cy - 0.4]
        ax.fill(px, py, color=c[0], alpha=0.10, lw=0)
        ax.plot(px + [px[0]], py + [py[0]], color=c[0], lw=2.0)
        ax.plot([xL, cx - w - 1.1], [cy, cy], color=S.GUIDE[mode], lw=1.4)
        ax.text(cx, cy + 0.30, letter, color=c[0], fontsize=13,
                fontweight="semibold", ha="center", va="center")
        S.note(ax, cx, cy - 0.14, name, mode, ha="center", va="center",
               size=8)
        S.note(ax, cx, cy - 0.42, "purine", mode, ha="center", va="center",
               size=8)

    def pyrimidine(cy, letter, name):
        cx, r = 8.18, 0.66
        hexagon(cx, cy, r, c[1])
        w = r * np.cos(np.deg2rad(30))
        ax.plot([cx + w, xR], [cy, cy], color=S.GUIDE[mode], lw=1.4)
        ax.text(cx, cy + 0.24, letter, color=c[1], fontsize=13,
                fontweight="semibold", ha="center", va="center")
        S.note(ax, cx, cy - 0.12, name, mode, ha="center", va="center",
               size=7.5)
        S.note(ax, cx, cy - 0.38, "pyrimidine", mode, ha="center",
               va="center", size=7.5)

    purine(y_at, "A", "adenine")
    pyrimidine(y_at, "T", "thymine")
    purine(y_gc, "G", "guanine")
    pyrimidine(y_gc, "C", "cytosine")

    for dy in (-0.22, 0.22):
        ax.plot([5.85, 7.5], [y_at + dy, y_at + dy], color=c[2], lw=1.6,
                ls=(0, (4, 3)))
    for dy in (-0.32, 0.0, 0.32):
        ax.plot([5.85, 7.5], [y_gc + dy, y_gc + dy], color=c[2], lw=1.6,
                ls=(0, (4, 3)))
    S.label_end(ax, 6.67, y_at + 0.34, "2 hydrogen bonds", c[2], mode,
                dx=0, dy=6, ha="center", va="bottom", size=8.5)
    S.label_end(ax, 6.67, y_gc + 0.44, "3 hydrogen bonds", c[2], mode,
                dx=0, dy=6, ha="center", va="bottom", size=8.5)

    ax.annotate("", xy=(xR, 0.52), xytext=(xL, 0.52),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode],
                                lw=1.4))
    S.note(ax, 6.0, 0.30,
           "every rung is one purine plus one pyrimidine, so the double "
           "helix keeps a constant width;\nthe third hydrogen bond makes "
           "G:C pairs harder to separate (GC-rich DNA resists denaturation)",
           mode, ha="center", va="top")
    ax.set_title("A pairs T with two hydrogen bonds; G pairs C with three")
    ax.set_xlim(1.0, 11.0)
    ax.set_ylim(-0.6, 5.95)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# ===========================================================================
# Second figures pass - deep-dive figures for the deepened I.1-I.11 lessons.
# Same contract as above: every quantitative figure is computed from the
# equation stated on it, with parameters printed; schematics carry only
# qualitative content and say so on the figure. Chapter map in the docstring.
# ===========================================================================


# --- I.1  Water, pH, buffers ------------------------------------------------


@figure("bc1-fraction-deprotonated")
def _(mode):
    """Fraction deprotonated vs pH for the three benchmark weak acids.

    Pure Henderson-Hasselbalch, f = 1/(1 + 10^(pKa - pH)), for the tabulated
    pKa values 4.76 (acetic acid), 6.86 (dihydrogen phosphate) and 9.25
    (ammonium). Nothing else is drawn in.
    """
    c = S.SERIES[mode]
    pH = np.linspace(0.0, 14.0, 700)
    acids = [
        (4.76, "acetic acid\npKa 4.76", c[0]),
        (6.86, "phosphate\npKa 6.86", c[1]),
        (9.25, "ammonium\npKa 9.25", c[2]),
    ]
    fig, ax = plt.subplots()
    ax.axhline(0.5, color=S.GUIDE[mode], lw=0.9, ls=":")
    for pKa, lab, col in acids:
        f = 1.0 / (1.0 + 10.0 ** (pKa - pH))
        ax.plot(pH, f, color=col, lw=2.2)
        ax.plot([pKa], [0.5], "o", color=col, ms=6)
        S.label_end(ax, pKa, 0.5, lab, col, mode, dx=-8, ha="right")
    S.note(ax, 0.25, 0.53, "half deprotonated", mode)
    S.note(ax, 13.75, 0.05,
           "computed from f = 1/(1 + 10^(pKa - pH))", mode, ha="right")
    ax.set_xlabel("pH")
    ax.set_ylabel("fraction deprotonated")
    ax.set_title("Every weak acid is half deprotonated exactly at its pKa")
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("bc1-bicarbonate-system")
def _(mode):
    """The bicarbonate buffer as an open system: qualitative schematic.

    The chain CO2(g) <-> CO2(aq) <-> H2CO3 <-> H+ + HCO3- with the lung arm
    (acid side, minutes) and kidney arm (base side, hours to days). The only
    numbers are stated physiological constants (effective pKa 6.1); nothing
    is measured off the drawing.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 3.9))
    yc = 2.7
    species = [
        (1.9, "CO$_2$ (gas)"),
        (5.3, "CO$_2$ (aq)"),
        (8.3, "H$_2$CO$_3$"),
        (12.1, "H$^+$ + HCO$_3^-$"),
    ]
    for x, s in species:
        ax.text(x, yc, s, ha="center", va="center", fontsize=12,
                fontweight="semibold", color=S.INK[mode])
    for x0, x1 in ((2.95, 4.25), (6.3, 7.4), (9.2, 10.35)):
        ax.annotate("", xy=(x1, yc), xytext=(x0, yc),
                    arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode],
                                    lw=1.6))
    S.note(ax, 3.6, 2.35, "dissolution", mode, ha="center", va="top",
           size=8.5)
    S.note(ax, 6.85, 2.35, "carbonic anhydrase\n(fast, in red cells)", mode,
           ha="center", va="top", size=8.5)
    S.note(ax, 9.78, 2.35, "effective pKa 6.1\n(CO$_2$ pool + H$_2$CO$_3$)",
           mode, ha="center", va="top", size=8.5)
    # lung arm: the acid side is vented in minutes
    ax.annotate("", xy=(1.9, 4.35), xytext=(1.9, 3.15),
                arrowprops=dict(arrowstyle="<->", color=c[0], lw=1.8))
    ax.text(1.9, 4.5, "lungs: ventilation adds or\nremoves CO$_2$ (minutes)",
            ha="center", va="bottom", fontsize=10, fontweight="semibold",
            color=c[0])
    # kidney arm: the base side is managed over hours to days
    ax.annotate("", xy=(12.1, 1.05), xytext=(12.1, 2.25),
                arrowprops=dict(arrowstyle="<->", color=c[1], lw=1.8))
    ax.text(12.1, 0.9, "kidneys: excrete or reclaim\nHCO$_3^-$ (hours to days)",
            ha="center", va="top", fontsize=10, fontweight="semibold",
            color=c[1])
    S.note(ax, 0.4, 1.15,
           "open at both ends: neither the acid reservoir\n"
           "nor the base reservoir can be exhausted\n"
           "the way a closed buffer's can", mode, va="top", size=9)
    ax.set_title("The bicarbonate buffer is an open system")
    ax.set_xlim(0, 16)
    ax.set_ylim(-0.9, 5.6)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- I.2  Amino acids -------------------------------------------------------


@figure("bc1-glycine-titration")
def _(mode):
    """Glycine titration curve, computed by inverting Henderson-Hasselbalch.

    At a given pH the equivalents of base consumed equal the summed
    deprotonated fractions of the two backbone groups, x = sum of
    1/(1 + 10^(pKa - pH)) for pKa 2.34 and 9.60 (tabulated). Plotting pH
    against x IS the titration curve; the plateaus, the pI at one
    equivalent, and the buffer bands all fall out of the same formula.
    """
    c = S.SERIES[mode]
    pK1, pK2 = 2.34, 9.60
    pH = np.linspace(0.4, 12.2, 900)
    x = 1.0 / (1.0 + 10.0 ** (pK1 - pH)) + 1.0 / (1.0 + 10.0 ** (pK2 - pH))
    fig, ax = plt.subplots()
    for lo, hi in ((1 / 11, 10 / 11), (1 + 1 / 11, 1 + 10 / 11)):
        ax.axvspan(lo, hi, color=S.GUIDE[mode], alpha=0.12, lw=0)
    ax.plot(x, pH, color=c[0], lw=2.2)
    for xe, ye in ((0.5, pK1), (1.5, pK2)):
        ax.plot([xe], [ye], "o", color=c[0], ms=7)
        ax.plot([xe, xe], [0, ye], color=S.GUIDE[mode], lw=0.9, ls=":")
        ax.plot([0, xe], [ye, ye], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([1.0], [5.97], "o", color=c[1], ms=7)
    S.note(ax, 0.46, 2.75, "pH = pKa$_1$ = 2.34\nat 0.5 equivalents", mode,
           ha="right")
    S.note(ax, 1.44, 10.15, "pH = pKa$_2$ = 9.60\nat 1.5 equivalents", mode,
           ha="right")
    S.label_end(ax, 1.0, 5.97, "pI = 5.97 = (2.34 + 9.60)/2\nthe zwitterion",
                c[1], mode, dx=8)
    S.note(ax, 0.05, 12.1, "shaded: buffering plateaus,\npH within 1 of each pKa",
           mode, va="top")
    S.note(ax, 2.04, 0.3,
           "computed from equivalents = sum of 1/(1 + 10^(pKa - pH));\n"
           "pKa 2.34, 9.60 (tabulated)", mode, ha="right")
    ax.set_xlabel("equivalents of strong base added")
    ax.set_ylabel("pH")
    ax.set_title("Two plateaus, one zwitterion in between")
    ax.set_xlim(0, 2.1)
    ax.set_ylim(0, 12.4)
    S.strip(ax)
    return fig


# --- I.3  Protein architecture ----------------------------------------------


@figure("bc1-ramachandran")
def _(mode):
    """Ramachandran plot: qualitative islands, tabulated conformation points.

    The shaded islands are drawn shapes standing for the sterically allowed
    regions (stated as qualitative on the figure). The four marked points are
    the standard tabulated (phi, psi) pairs: alpha-helix (-57, -47),
    antiparallel beta (-139, +135), parallel beta (-119, +113), collagen
    (-51, +153).
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(6.4, 5.7))
    islands = [
        ((-115, 130), 132, 92, c[1]),   # beta region
        ((-63, -40), 92, 72, c[0]),     # right-handed alpha
        ((60, 45), 52, 52, S.GUIDE[mode]),  # left-handed helix (rare)
    ]
    for (cx, cy), w, h, col in islands:
        ax.add_patch(Ellipse((cx, cy), w, h, facecolor=col, alpha=0.10,
                             edgecolor=col, lw=1.6, fill=True))
        ax.add_patch(Ellipse((cx, cy), w, h, facecolor="none",
                             edgecolor=col, lw=1.6))
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0, color=S.GRID[mode], lw=1.0)
    pts = [
        (-57, -47, "alpha-helix (-57$\\degree$, -47$\\degree$)", c[0], 10, 0,
         "left", "center"),
        (-139, 135, "antiparallel beta\n(-139$\\degree$, +135$\\degree$)",
         c[1], 0, 12, "center", "bottom"),
        (-119, 113, "parallel beta\n(-119$\\degree$, +113$\\degree$)",
         c[1], 0, -14, "center", "top"),
        (-51, 153, "collagen helix (-51$\\degree$, +153$\\degree$)", c[2],
         10, 0, "left", "center"),
    ]
    for px, py, lab, col, dx, dy, ha, va in pts:
        ax.plot([px], [py], "o", color=col, ms=7)
        S.label_end(ax, px, py, lab, col, mode, dx=dx, dy=dy, ha=ha, va=va,
                    size=9)
    S.note(ax, -63, -86, "right-handed alpha island", mode, ha="center",
           va="top", size=8.5)
    S.note(ax, 60, 45, "left-handed\nhelix (rare)", mode, ha="center",
           va="center", size=8.5)
    S.note(ax, 172, -55, "glycine roams outside the islands;\n"
           "proline is nearly pinned", mode, ha="right", va="top", size=8.5)
    S.note(ax, 172, -172, "islands drawn qualitatively (sterically allowed\n"
           "regions); points are tabulated conformations", mode, ha="right",
           va="bottom", size=8.5)
    ax.set_xlabel("$\\phi$, N-C$_\\alpha$ rotation (degrees)")
    ax.set_ylabel("$\\psi$, C$_\\alpha$-C rotation (degrees)")
    ax.set_title("Only a few phi/psi islands survive steric clash")
    ax.set_xlim(-180, 180)
    ax.set_ylim(-180, 180)
    ax.set_xticks([-180, -90, 0, 90, 180])
    ax.set_yticks([-180, -90, 0, 90, 180])
    ax.set_aspect("equal")
    S.strip(ax)
    return fig


@figure("bc1-helix-geometry")
def _(mode):
    """Alpha-helix geometry computed from its tabulated numbers.

    The wave is the helix seen from the side, x = distance along the axis,
    y = sin(2 pi x / 5.4): pitch 5.4 A per turn by construction. Residue
    markers sit every 1.5 A of rise (3.6 per turn, since 3.6 x 1.5 = 5.4),
    and the dashed link joins residues i and i+4 - the hydrogen-bond
    partners. All three numbers are the standard tabulated values.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots()
    amp, pitch, rise = 1.1, 5.4, 1.5
    z = np.linspace(0.0, 11.4, 800)
    y = amp * np.sin(2 * np.pi * z / pitch)
    ax.plot(z, y, color=c[0], lw=2.2)
    res = np.arange(0.0, 10.6, rise)
    ax.plot(res, amp * np.sin(2 * np.pi * res / pitch), "o", color=c[0],
            ms=6.5)
    # i -> i+4 hydrogen bond: residues at z = 1.5 and z = 7.5
    zi, zj = 1.5, 7.5
    yi = amp * np.sin(2 * np.pi * zi / pitch)
    yj = amp * np.sin(2 * np.pi * zj / pitch)
    ax.plot([zi, zj], [yi, yj], color=c[2], lw=1.6, ls=(0, (4, 3)))
    S.label_end(ax, (zi + zj) / 2, 1.12,
                "i $\\rightarrow$ i+4 hydrogen bond", c[2], mode, dx=0,
                dy=8, ha="center", va="bottom", size=9)
    S.note(ax, zi, yi + 0.16, "i", mode, ha="center", size=9)
    S.note(ax, zj, yj + 0.16, "i+4", mode, ha="center", size=9)
    # rise bracket between residues 0 and 1
    for zx, y0 in ((0.0, 0.0), (rise, amp * np.sin(2 * np.pi * rise / pitch))):
        ax.plot([zx, zx], [y0 + 0.08 if zx else 0.08, 1.55],
                color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.annotate("", xy=(rise, 1.62), xytext=(0.0, 1.62),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode],
                                lw=1.4))
    S.note(ax, rise / 2, 1.72, "1.5 $\\AA$ rise\nper residue", mode,
           ha="center", size=9)
    # pitch bracket: one full turn
    for zx in (0.0, pitch):
        ax.plot([zx, zx], [-1.5, amp * np.sin(2 * np.pi * zx / pitch) - 0.08],
                color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.annotate("", xy=(pitch, -1.62), xytext=(0.0, -1.62),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode],
                                lw=1.4))
    S.note(ax, pitch / 2, -1.78,
           "pitch 5.4 $\\AA$ = one turn = 3.6 residues $\\times$ 1.5 $\\AA$",
           mode, ha="center", va="top", size=9)
    S.note(ax, 11.5, -2.45, "computed from the tabulated geometry;\n"
           "the wave is the helix seen from the side", mode, ha="right",
           va="bottom", size=8.5)
    ax.set_xlabel("distance along the helix axis ($\\AA$)")
    ax.set_ylabel("")
    ax.set_title("The alpha-helix by its three numbers")
    ax.set_xlim(-0.4, 11.8)
    ax.set_ylim(-2.55, 2.45)
    ax.set_yticks([])
    S.strip(ax)
    ax.spines["left"].set_visible(False)
    return fig


# --- I.4  Binding and cooperativity -----------------------------------------


@figure("bc1-hill-plot")
def _(mode):
    """Hill plot computed from the concerted (MWC) model.

    Hemoglobin: Y from the MWC binding polynomial with the classic
    parameters n = 4, L = 9054, c = 0.014 (the original MWC fit to Hb),
    with K_R solved numerically so that P50 = 26 torr. The slope-1
    asymptotes are the first-site (K_T) and last-site (K_R) lines the model
    itself implies, and the midpoint slope is computed from the curve, not
    asserted. Myoglobin is the exact slope-1 line through P50 = 2.8 torr.
    """
    c = S.SERIES[mode]
    n_sites, L, cpar = 4, 9054.0, 0.014

    def theta(P, KR):
        a = P / KR
        num = a * (1 + a) ** 3 + L * cpar * a * (1 + cpar * a) ** 3
        den = (1 + a) ** 4 + L * (1 + cpar * a) ** 4
        return num / den

    lo, hi = 0.1, 26.0
    for _ in range(80):
        mid = 0.5 * (lo + hi)
        if theta(26.0, mid) > 0.5:
            lo = mid
        else:
            hi = mid
    KR = 0.5 * (lo + hi)
    KT = KR / cpar

    x = np.linspace(-0.3, 3.05, 700)
    P = 10.0 ** x
    th = theta(P, KR)
    yh = np.log10(th / (1.0 - th))
    # computed midpoint slope
    e = 1e-4
    nH = (np.log10(theta(26 * (1 + e), KR) / (1 - theta(26 * (1 + e), KR)))
          - np.log10(theta(26 * (1 - e), KR) / (1 - theta(26 * (1 - e), KR))
                     )) / (np.log10(1 + e) - np.log10(1 - e))

    fig, ax = plt.subplots()
    # slope-1 asymptotes, where they hug the curve
    xa = np.linspace(1.35, 3.05, 50)
    ax.plot(xa, xa - np.log10(KR), color=S.GUIDE[mode], lw=1.1, ls="--")
    xb = np.linspace(-0.3, 1.9, 50)
    ax.plot(xb, xb - np.log10(KT), color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 2.4, 2.4 - np.log10(KR) + 0.12,
           "slope-1 asymptote: last site,\nK$_R$ = %.1f torr (computed)" % KR,
           mode, ha="right", size=8.5)
    S.note(ax, 1.55, 1.55 - np.log10(KT) - 0.14,
           "slope-1 asymptote: first site,\nK$_T$ = %.0f torr (computed)" % KT,
           mode, va="top", size=8.5)
    ax.plot(x, yh, color=c[1], lw=2.2)
    # myoglobin: slope 1 through P50 = 2.8 torr
    xm = np.linspace(-0.3, 1.2, 50)
    ax.plot(xm, xm - np.log10(2.8), color=c[0], lw=2.2)
    ax.annotate("myoglobin: slope 1\n(P50 = 2.8 torr)",
                xy=(0.5, 0.5 - np.log10(2.8)), xytext=(-0.22, 2.35),
                color=c[0], fontsize=10, fontweight="semibold",
                ha="left", va="bottom",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0,
                                shrinkB=4))
    S.label_end(ax, 2.35, np.interp(2.35, x, yh), "hemoglobin\n(MWC, computed)",
                c[1], mode, dx=6, dy=-16, ha="left", va="top")
    ax.plot([np.log10(26)], [0.0], "o", color=c[1], ms=7)
    ax.plot([np.log10(26)] * 2, [-3.1, 0.0], color=S.GUIDE[mode], lw=0.9,
            ls=":")
    S.note(ax, np.log10(26) + 0.04, -0.5, "P50 = 26 torr", mode)
    ax.annotate("slope at P50 = %.1f (computed)" % nH,
                xy=(np.log10(26) - 0.05, 0.25), xytext=(0.1, 1.55),
                color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0,
                                shrinkB=3))
    S.note(ax, 3.0, -2.95,
           "hemoglobin computed from the concerted (MWC) model:\n"
           "n = 4, L = 9054, c = 0.014 (classic Hb fit),\n"
           "K$_R$ set so P50 = 26 torr", mode, ha="right", size=8.5)
    ax.set_xlabel(r"pO$_2$ (torr, log scale)")
    ax.set_ylabel(r"log[$\theta$/(1$-$$\theta$)]")
    ax.set_title("The Hill plot reads cooperativity as a mid-curve slope of 3")
    ax.set_xlim(-0.3, 3.4)
    ax.set_ylim(-3.1, 3.4)
    ax.set_xticks([0, 1, 2, 3])
    ax.set_xticklabels(["1", "10", "100", "1000"])
    S.strip(ax)
    return fig


@figure("bc1-bpg-family")
def _(mode):
    """BPG / fetal hemoglobin saturation family from the Hill equation.

    Every curve is Y = P^n / (P50^n + P^n) with n = 2.8; only P50 differs,
    using the standard values: ~12 torr for BPG-stripped hemoglobin,
    ~20 torr for fetal HbF, 26 torr for adult HbA. The tissue-to-lung pO2
    window is shaded at the standard 30 and 100 torr marks.
    """
    c = S.SERIES[mode]
    n = 2.8
    P = np.linspace(0.0, 110.0, 800)
    cases = [
        (12.0, "BPG-stripped: P50 = 12", c[2], 12),
        (20.0, "fetal HbF: P50 = 20", c[1], 0),
        (26.0, "adult HbA: P50 = 26", c[0], -12),
    ]
    fig, ax = plt.subplots()
    ax.axvspan(30, 100, color=S.GUIDE[mode], alpha=0.10, lw=0)
    ax.plot([0, 26], [0.5, 0.5], color=S.GUIDE[mode], lw=0.9, ls=":")
    for P50, lab, col, dy in cases:
        with np.errstate(divide="ignore", invalid="ignore"):
            Y = P ** n / (P50 ** n + P ** n)
        Y[0] = 0.0
        ax.plot(P, Y, color=col, lw=2.2)
        ax.plot([P50], [0.5], "o", color=col, ms=6)
        S.label_end(ax, P[-1], Y[-1], lab, col, mode, dx=6, dy=dy, size=9)
    S.note(ax, 31, 0.035, "tissue $\\approx$ 30 torr", mode)
    S.note(ax, 99, 0.035, "lungs $\\approx$ 100 torr", mode, ha="right")
    S.note(ax, 2, 1.16,
           "each curve: Y = P$^n$/(P50$^n$ + P$^n$), n = 2.8;\n"
           "P50 values are the standard ones", mode, va="top", size=9)
    ax.set_xlabel(r"oxygen partial pressure  pO$_2$  (torr)")
    ax.set_ylabel("fractional saturation  Y")
    ax.set_title("BPG sets the set point; HbF reads it differently")
    ax.set_xlim(0, 110)
    ax.set_ylim(0, 1.24)
    S.strip(ax)
    return fig


# --- I.5  Catalysis ---------------------------------------------------------


@figure("bc1-rate-vs-barrier")
def _(mode):
    """Rate enhancement vs barrier reduction, one exponential relation.

    rate factor = 10^(ddG/5.7) at 25 C - the same 5.7 kJ/mol-per-decade
    constant the chapter derives. The five marked enzymes sit at their
    tabulated enhancements (10^5 to 10^17); their x-positions follow from
    the equation, nothing is placed by hand.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.0, 102.0, 500)
    fig, ax = plt.subplots()
    ax.plot(x, 10.0 ** (x / 5.7), color=c[0], lw=2.2)
    ax.set_yscale("log")
    enzymes = [
        (5, "cyclophilin  10$^5$"),
        (7, "carbonic anhydrase  10$^7$"),
        (9, "triose phosphate isomerase  10$^9$"),
        (14, "urease  10$^{14}$"),
        (17, "OMP decarboxylase  10$^{17}$"),
    ]
    for p, lab in enzymes:
        xx = 5.7 * p
        ax.plot([xx], [10.0 ** p], "o", color=c[1], ms=6.5)
        if p == 17:
            S.label_end(ax, xx, 10.0 ** p, lab, c[1], mode, dx=-8, dy=4,
                        ha="right", va="bottom", size=9)
        else:
            S.label_end(ax, xx, 10.0 ** p, lab, c[1], mode, dx=8, dy=-6,
                        ha="left", va="top", size=9)
    S.note(ax, 3, 10.0 ** 15.4,
           "computed from rate factor = 10^($\\Delta\\Delta$G$^\\ddagger$/5.7)"
           " at 25 $\\degree$C;\nmarked points: tabulated enhancements of real"
           " enzymes", mode, size=9)
    ax.set_xlabel("barrier reduction  $\\Delta\\Delta$G$^\\ddagger$  (kJ/mol)")
    ax.set_ylabel("rate enhancement factor")
    ax.set_title("Every 5.7 kJ/mol off the barrier is another factor of ten")
    ax.set_xlim(0, 104)
    ax.set_ylim(1, 10.0 ** 19)
    S.strip(ax)
    return fig


@figure("bc1-chymotrypsin-ph")
def _(mode):
    """Chymotrypsin's pH bell computed from two ionizations.

    Activity requires His57 deprotonated (pKa about 7) AND the Ile16
    alpha-amino group protonated (pKa about 8.8), so the profile is the
    product of two Henderson-Hasselbalch terms, normalized to its peak.
    The optimum lands at the average of the two pKa values, 7.9.
    """
    c = S.SERIES[mode]
    pH = np.linspace(4.5, 11.5, 700)
    f1 = 1.0 / (1.0 + 10.0 ** (7.0 - pH))     # His57 deprotonated
    f2 = 1.0 / (1.0 + 10.0 ** (pH - 8.8))     # Ile16 amino protonated
    a = f1 * f2
    a = a / a.max()
    opt = (7.0 + 8.8) / 2.0
    fig, ax = plt.subplots()
    ax.plot(pH, f1, color=c[1], lw=1.4, ls="--")
    ax.plot(pH, f2, color=c[2], lw=1.4, ls="--")
    ax.plot(pH, a, color=c[0], lw=2.4)
    ax.plot([opt], [1.0], "o", color=c[0], ms=7)
    ax.plot([opt, opt], [0, 1.0], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.label_end(ax, 6.55, 1.0 / (1.0 + 10.0 ** (7.0 - 6.55)),
                "fraction of His57\ndeprotonated (pKa 7)", c[1], mode,
                dx=-8, ha="right", size=9)
    ax.annotate("fraction of Ile16\nprotonated (pKa 8.8)",
                xy=(9.35, 1.0 / (1.0 + 10.0 ** (9.35 - 8.8))),
                xytext=(9.8, 0.44), color=c[2], fontsize=9,
                fontweight="semibold", ha="left", va="bottom",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0,
                                shrinkB=3))
    ax.annotate("activity: the product,\noptimum at pH 7.9",
                xy=(7.55, 0.955), xytext=(4.65, 0.86),
                color=c[0], fontsize=10, fontweight="semibold",
                ha="left", va="bottom",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.0,
                                shrinkB=4))
    S.note(ax, 11.4, 1.25,
           "computed as the product of the two Henderson-Hasselbalch\n"
           "fractions, normalized to its peak; optimum = (7 + 8.8)/2 = 7.9",
           mode, ha="right", va="top", size=8.5)
    ax.set_xlabel("pH")
    ax.set_ylabel("relative activity")
    ax.set_title("Two ionizations, one bell")
    ax.set_xlim(4.5, 11.5)
    ax.set_ylim(0, 1.26)
    S.strip(ax)
    return fig


# --- I.6  Kinetics and inhibition -------------------------------------------


@figure("bc1-inhibition-rates")
def _(mode):
    """v vs [S] for the inhibition classes, from the general rate law.

    Every curve is v = Vmax [S] / (alpha Km + alpha' [S]) with Vmax = 100,
    Km = 2 (illustrative, as in the double-reciprocal figure): control
    (1, 1), competitive (2, 1), uncompetitive (1, 2), mixed (2, 2). The
    fourth series wears the guide colour, per the three-hue palette cap.
    """
    c = S.SERIES[mode]
    Vmax, Km = 100.0, 2.0
    Sconc = np.linspace(0.0, 20.0, 600)
    cases = [
        ("no inhibitor", 1.0, 1.0, c[0], 7),
        ("competitive ($\\alpha$ = 2)", 2.0, 1.0, c[1], -7),
        ("uncompetitive ($\\alpha$' = 2)", 1.0, 2.0, c[2], 9),
        ("mixed ($\\alpha$ = $\\alpha$' = 2)", 2.0, 2.0, S.GUIDE[mode], -9),
    ]
    fig, ax = plt.subplots()
    ax.axhline(Vmax, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.axhline(Vmax / 2, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.3, 101.5, "Vmax = 100", mode)
    S.note(ax, 0.3, 51.5, "Vmax/$\\alpha$' = 50", mode)
    for lab, al, ap, col, dy in cases:
        v = Vmax * Sconc / (al * Km + ap * Sconc)
        ax.plot(Sconc, v, color=col, lw=2.2)
        S.label_end(ax, Sconc[-1], v[-1], lab, col, mode, dy=dy, size=9.5)
    S.note(ax, 19.6, 8,
           "v = Vmax[S] / ($\\alpha$Km + $\\alpha$'[S]);  Vmax = 100, Km = 2"
           " (illustrative)\ncompetitive $\\alpha$ = 2: Km,app 4, Vmax kept\n"
           "uncompetitive $\\alpha$' = 2: Vmax 50, Km,app 1\n"
           "mixed $\\alpha$ = $\\alpha$' = 2: Vmax 50, Km,app 2",
           mode, ha="right", size=8.5)
    ax.set_xlabel("substrate concentration  [S]   (same units as Km)")
    ax.set_ylabel(r"initial rate  v$_0$   (arbitrary units)")
    ax.set_title("Only competitive inhibition is outrun by substrate")
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 112)
    S.strip(ax)
    return fig


# --- I.7  Enzyme control ----------------------------------------------------


@figure("bc1-hill-family")
def _(mode):
    """Hill-equation family: the sigmoid steepens as n rises.

    theta = x^n / (1 + x^n) with x = [S]/K0.5, computed for n = 1, 2, 2.8
    and 4. All curves pass through (1, 0.5) by construction; n = 1 is the
    plain hyperbola. The fourth series wears the guide colour (palette cap).
    """
    c = S.SERIES[mode]
    xs = np.linspace(0.0, 4.0, 700)
    cases = [
        (1.0, "n = 1: plain hyperbola", S.GUIDE[mode], 0),
        (2.0, "n = 2", c[2], -12),
        (2.8, "n = 2.8 (hemoglobin)", c[0], 0),
        (4.0, "n = 4", c[1], 13),
    ]
    fig, ax = plt.subplots()
    for n, lab, col, dy in cases:
        th = xs ** n / (1.0 + xs ** n)
        ax.plot(xs, th, color=col, lw=2.2)
        S.label_end(ax, xs[-1], th[-1], lab, col, mode, dy=dy, size=9.5)
    ax.plot([1.0], [0.5], "o", color=S.INK_2[mode], ms=6)
    ax.plot([1.0, 1.0], [0, 0.5], color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.plot([0.0, 1.0], [0.5, 0.5], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 1.04, 0.44, "every curve half-saturates\nat [S] = K$_{0.5}$",
           mode, va="top")
    S.note(ax, 0.08, 1.06,
           "computed from $\\theta$ = [S]$^n$ / (K$_{0.5}^n$ + [S]$^n$)",
           mode, size=9)
    ax.set_xlabel(r"[S] / K$_{0.5}$")
    ax.set_ylabel(r"fractional saturation  $\theta$")
    ax.set_title("Raising the Hill coefficient sharpens the switch")
    ax.set_xlim(0, 4)
    ax.set_ylim(0, 1.12)
    S.strip(ax)
    return fig


@figure("bc1-hexokinase-glucokinase")
def _(mode):
    """Hexokinase vs glucokinase, computed from one hyperbola each.

    v/Vmax = [glucose] / (Km + [glucose]) with the standard Km values:
    0.05 mM (hexokinase) and 10 mM (glucokinase). The shaded band is the
    normal blood-glucose range, 4.5-5.5 mM; the two marked points are the
    computed fractional rates at 5 mM.
    """
    c = S.SERIES[mode]
    G = np.linspace(0.0, 20.0, 800)
    fig, ax = plt.subplots()
    ax.axvspan(4.5, 5.5, color=S.GUIDE[mode], alpha=0.15, lw=0)
    hexo = G / (0.05 + G)
    gluco = G / (10.0 + G)
    ax.plot(G, hexo, color=c[0], lw=2.2)
    ax.plot(G, gluco, color=c[1], lw=2.2)
    S.label_end(ax, 3.0, 3.0 / 3.05, "hexokinase, Km = 0.05 mM", c[0], mode,
                dx=0, dy=10, ha="center", va="bottom")
    S.label_end(ax, 20.0, 20.0 / 30.0, "glucokinase\n(liver, beta cells)\n"
                "Km = 10 mM", c[1], mode, dx=8)
    ax.plot([5.0], [5.0 / 5.05], "o", color=c[0], ms=7)
    S.note(ax, 6.0, 0.86, "0.99 of Vmax at 5 mM:\nsaturated, blind to the band",
           mode, va="top", size=8.5)
    ax.plot([5.0], [5.0 / 15.0], "o", color=c[1], ms=7)
    S.note(ax, 5.9, 0.56, "0.33 of Vmax at 5 mM:\nmid-slope, tracking glucose",
           mode, size=8.5)
    S.note(ax, 5.0, 1.12, "normal blood glucose\n4.5-5.5 mM", mode,
           ha="center", va="bottom", size=8.5)
    S.note(ax, 19.6, 0.06,
           "computed from v/Vmax = [glucose]/(Km + [glucose]);\n"
           "Km values are the standard ones", mode, ha="right", size=8.5)
    ax.set_xlabel("blood glucose (mM)")
    ax.set_ylabel("v / Vmax")
    ax.set_title("A saturated workhorse and a glucose sensor")
    ax.set_xlim(0, 20)
    ax.set_ylim(0, 1.28)
    S.strip(ax)
    return fig


# --- I.8  Carbohydrates -----------------------------------------------------


@figure("bc1-mutarotation")
def _(mode):
    """Mutarotation time course: exponential relaxation to one equilibrium.

    rotation(t) = 52.7 + (start - 52.7) e^(-kt), with the tabulated specific
    rotations +112 (pure alpha), +18.7 (pure beta) and +52.7 (equilibrium);
    the rate constant is illustrative and the time axis says so. The
    equilibrium value is the ~1/3 alpha : 2/3 beta weighted average.
    """
    c = S.SERIES[mode]
    k = 0.6
    t = np.linspace(0.0, 8.0, 500)
    eq = 52.7
    fig, ax = plt.subplots()
    ax.axhline(eq, color=S.GUIDE[mode], lw=1.2, ls="--")
    for start, col, lab, dy in ((112.0, c[0],
                                 "starting from pure $\\alpha$ (+112$\\degree$)",
                                 6),
                                (18.7, c[2],
                                 "starting from pure $\\beta$ (+18.7$\\degree$)",
                                 -8)):
        rot = eq + (start - eq) * np.exp(-k * t)
        ax.plot(t, rot, color=col, lw=2.2)
        ax.plot([0], [start], "o", color=col, ms=7)
        S.label_end(ax, 0.12, start, lab, col, mode, dx=8, dy=dy)
    S.note(ax, 7.9, 44.0,
           "equilibrium +52.7$\\degree$ $\\approx$ the 1/3 $\\alpha$ : "
           "2/3 $\\beta$ weighted average", mode, ha="right", va="top")
    S.note(ax, 7.9, 12,
           "computed from rotation(t) = 52.7 + (start $-$ 52.7)e$^{-kt}$;\n"
           "rotations tabulated, rate constant illustrative", mode,
           ha="right", size=8.5)
    ax.set_xlabel("time (arbitrary units; real mutarotation takes hours)")
    ax.set_ylabel("specific rotation (degrees)")
    ax.set_title("Mutarotation: both anomers drift to the same mixture")
    ax.set_xlim(0, 8.3)
    ax.set_ylim(5, 122)
    S.strip(ax)
    return fig


# --- I.9  Lipids ------------------------------------------------------------


@figure("bc1-fatty-acid-melting")
def _(mode):
    """Melting points of the 18-carbon fatty acid series: tabulated values.

    A labeled point chart of the stated data - 18:0 69.6, 18:1 13.4,
    18:2 -5, 18:3 -11 degrees C. Same chain length throughout; only the
    cis-double-bond count changes.
    """
    c = S.SERIES[mode]
    data = [
        ("18:0\nstearate", 69.6),
        ("18:1\noleate", 13.4),
        ("18:2\nlinoleate", -5.0),
        ("18:3\n$\\alpha$-linolenate", -11.0),
    ]
    xs = np.arange(len(data))
    fig, ax = plt.subplots()
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.axhline(37, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 3.45, 38.5, "body temperature 37 $\\degree$C", mode,
           ha="right")
    for xi, (lab, mp) in zip(xs, data):
        ax.plot([xi, xi], [0, mp], color=c[0], lw=2.2,
                solid_capstyle="round")
        ax.plot([xi], [mp], "o", color=c[0], ms=8)
        ax.annotate("%.1f $\\degree$C" % mp, xy=(xi, mp),
                    xytext=(0, 10 if mp > 0 else -12),
                    textcoords="offset points", ha="center",
                    va="bottom" if mp > 0 else "top", color=c[0],
                    fontsize=10, fontweight="semibold")
    S.note(ax, 3.45, 58, "same length (18 carbons);\n"
           "only the cis-double-bond count differs", mode, ha="right",
           size=9)
    S.note(ax, -0.42, -22.5, "tabulated melting points", mode, va="top",
           size=8.5)
    ax.set_xticks(xs)
    ax.set_xticklabels([d[0] for d in data], fontsize=9.5)
    ax.set_ylabel("melting point ($\\degree$C)")
    ax.set_title("Each cis kink drops the melting point")
    ax.set_xlim(-0.6, 3.6)
    ax.set_ylim(-27, 82)
    S.strip(ax)
    return fig


# --- I.10  Membranes and transport ------------------------------------------


@figure("bc1-transport-dg")
def _(mode):
    """The cost of a gradient, with the membrane-potential surcharge.

    Central line: dG = RT ln(C2/C1), i.e. 5.7 kJ/mol per tenfold at 25 C.
    Band: the same plus/minus Z F d-psi for a monovalent ion crossing a
    membrane held at -60 mV, worth F x 60 mV = 5.8 kJ/mol per unit charge.
    Both numbers are computed from the constants stated on the figure.
    """
    c = S.SERIES[mode]
    r = np.logspace(0.0, 4.0, 500)
    dg = 5.7 * np.log10(r)
    elec = 96.5 * 0.060  # F x 60 mV, kJ/mol
    fig, ax = plt.subplots()
    ax.set_xscale("log")
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    ax.fill_between(r, dg - elec, dg + elec, color=c[1], alpha=0.12, lw=0)
    ax.plot(r, dg + elec, color=c[1], lw=1.4, ls="--")
    ax.plot(r, dg - elec, color=c[1], lw=1.4, ls="--")
    ax.plot(r, dg, color=c[0], lw=2.2)
    # the tenfold benchmark
    ax.plot([10.0], [5.7], "o", color=c[0], ms=6)
    ax.plot([10.0, 10.0], [-8, 5.7], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 11.2, -7.6, "RT ln 10 = 5.7 kJ/mol per tenfold", mode)
    # where the potential pays for the whole gradient
    r0 = 10.0 ** (elec / 5.7)
    ax.plot([r0], [0.0], "o", color=c[1], ms=6)
    S.note(ax, r0 * 1.15, -1.1, "up to a %.0f-fold gradient, a cation\n"
           "enters a $-$60 mV cell for free" % r0, mode, va="top", size=8.5)
    S.note(ax, 1.15, 26.5,
           "computed from $\\Delta$G = RT ln(C$_2$/C$_1$) $\\pm$ ZF"
           "$\\Delta\\psi$;\nRT ln 10 = 5.7 kJ/mol (25 $\\degree$C), "
           "F $\\times$ 60 mV = 5.8 kJ/mol", mode, size=9)
    ax.set_xlabel(r"concentration ratio  C$_2$/C$_1$")
    ax.set_ylabel(r"$\Delta$G  (kJ per mole moved)")
    ax.set_title("What a gradient costs, and what the potential adds")
    ax.set_xlim(1, 1.3e4)
    ax.set_ylim(-8, 32)
    # direct labels running parallel to the lines they name
    p0 = ax.transData.transform((1.0, 0.0))
    p1 = ax.transData.transform((1.0e4, 5.7 * 4.0))
    ang = np.degrees(np.arctan2(p1[1] - p0[1], p1[0] - p0[0]))
    for x0, y0, txt, col, va in (
            (60.0, 5.7 * np.log10(60.0) + elec + 0.7,
             "+1 ion pushed out of a $-$60 mV cell: +5.8 kJ/mol", c[1],
             "bottom"),
            (60.0, 5.7 * np.log10(60.0) + 0.7,
             "uncharged solute: $\\Delta$G = RT ln(C$_2$/C$_1$)", c[0],
             "bottom"),
            (600.0, 5.7 * np.log10(600.0) - elec - 0.7,
             "+1 ion carried in by the potential: $-$5.8 kJ/mol", c[1],
             "top")):
        ax.text(x0, y0, txt, rotation=ang, rotation_mode="anchor",
                ha="center", va=va, color=col, fontsize=9,
                fontweight="semibold")
    S.strip(ax)
    return fig


# --- I.11  Nucleic acids ----------------------------------------------------


@figure("bc1-dna-melting")
def _(mode):
    """DNA melting curves plus the Tm-vs-%GC trend, illustrative values.

    The two melting curves are logistic transitions (the shape the chapter
    describes) with ILLUSTRATIVE Tm values of 75 and 90 C, labeled as such
    on the figure; the 40% hyperchromic rise is the standard magnitude. The
    inset line is the linear Tm-vs-%GC trend through the same two
    illustrative duplexes.
    """
    c = S.SERIES[mode]
    T = np.linspace(55.0, 105.0, 700)

    def melt(Tm, w=1.6):
        return 1.0 + 0.40 / (1.0 + np.exp(-(T - Tm) / w))

    fig, ax = plt.subplots()
    low, high = melt(75.0), melt(90.0)
    ax.plot(T, low, color=c[0], lw=2.2)
    ax.plot(T, high, color=c[1], lw=2.2)
    for Tm, col in ((75.0, c[0]), (90.0, c[1])):
        ax.plot([Tm], [1.2], "o", color=col, ms=6)
        ax.plot([Tm, Tm], [0.95, 1.2], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.label_end(ax, 76.0, 1.445, "low GC: Tm $\\approx$ 75 $\\degree$C"
                " (illustrative)", c[0], mode, dx=0, dy=0, ha="left",
                va="bottom", size=9)
    S.label_end(ax, 102.0, 0.99, "high GC: Tm $\\approx$ 90 $\\degree$C"
                " (illustrative)", c[1], mode, dx=0, dy=0, ha="right",
                va="top", size=9)
    ax.annotate("", xy=(103.5, 1.40), xytext=(103.5, 1.00),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode],
                                lw=1.4))
    S.note(ax, 102.9, 1.2, "hyperchromic rise $\\approx$ 40%:\nunstacked"
           " bases absorb more", mode, ha="right", va="center", size=8.5)
    # inset: Tm vs %GC, the linear trend through the two duplexes
    axin = ax.inset_axes([0.07, 0.56, 0.30, 0.36])
    gc = np.linspace(15.0, 85.0, 50)
    slope = (90.0 - 75.0) / (67.0 - 33.0)
    axin.plot(gc, 75.0 + slope * (gc - 33.0), color=c[2], lw=1.8)
    axin.plot([33.0], [75.0], "o", color=c[0], ms=5)
    axin.plot([67.0], [90.0], "o", color=c[1], ms=5)
    axin.set_xlabel("%GC", fontsize=8)
    axin.set_ylabel("Tm ($\\degree$C)", fontsize=8)
    axin.tick_params(labelsize=7)
    axin.set_title("Tm rises with %GC (illustrative)", fontsize=8,
                   color=S.INK_2[mode])
    S.strip(axin)
    ax.set_xlabel("temperature ($\\degree$C)")
    ax.set_ylabel("relative absorbance at 260 nm")
    ax.set_title("GC content sets the melting temperature")
    ax.set_xlim(55, 106)
    ax.set_ylim(0.93, 1.52)
    S.strip(ax)
    return fig


@figure("bc1-dna-damage")
def _(mode):
    """The daily DNA damage budget on a log scale: standard estimates.

    Order-of-magnitude bars for a mammalian genome per day - depurination
    ~10^4, cytosine deamination ~10^2, purine deamination ~10^0 - the
    standard textbook estimates, stated as such on the figure.
    """
    c = S.SERIES[mode]
    data = [
        ("depurination\n(purine lost,\nAP site left)", 1e4, "~10$^4$"),
        ("cytosine\ndeamination\n(C $\\rightarrow$ U)", 1e2, "~10$^2$"),
        ("adenine / guanine\ndeamination", 1e0, "~10$^0$"),
    ]
    xs = np.arange(len(data))
    fig, ax = plt.subplots()
    ax.set_yscale("log")
    ax.bar(xs, [d[1] for d in data], width=0.55, facecolor=c[0], alpha=0.25,
           edgecolor=c[0], linewidth=2.0)
    for xi, (lab, v, txt) in zip(xs, data):
        ax.annotate(txt + " / genome / day", xy=(xi, v), xytext=(0, 6),
                    textcoords="offset points", ha="center", va="bottom",
                    color=S.INK[mode], fontsize=10, fontweight="semibold")
    S.note(ax, 2.45, 3.2e3,
           "standard order-of-magnitude estimates,\n"
           "mammalian genome, per day;\n"
           "repair fixes nearly all of it", mode, ha="right", size=9)
    ax.set_xticks(xs)
    ax.set_xticklabels([d[0] for d in data], fontsize=9)
    ax.set_ylabel("events per genome per day (log scale)")
    ax.set_title("Four orders of magnitude between the daily lesions")
    ax.set_xlim(-0.6, 2.6)
    ax.set_ylim(0.3, 3e5)
    S.strip(ax)
    return fig


# ===========================================================================
# Third pass - Biochemistry II wave A (chapters II.1-II.8).
# Same contract as above: every quantitative figure is computed from the
# equation stated on it, with parameters printed; schematics carry only
# qualitative content (textbook-standard pathway facts, not anyone's drawing
# of them) and say so on the figure. Chapter map in the module docstring.
# ===========================================================================


# --- II.1  Bioenergetics and metabolic logic --------------------------------


@figure("bc2-deltag-vs-q")
def _(mode):
    """Actual free-energy change vs Q, computed from dG = dG'0 + RT ln Q.

    T = 310 K, so RT = 2.577 kJ/mol; the three lines carry the stated
    standard values dG'0 = +5, 0 and -15 kJ/mol across Q from 1e-4 to 1e4
    on a log axis. Each line crosses dG = 0 exactly where Q equals that
    reaction's K'eq = exp(-dG'0/RT); the crossing markers are computed from
    that expression, not placed.
    """
    c = S.SERIES[mode]
    R, T = 8.314e-3, 310.0  # kJ/mol/K, K
    RT = R * T
    Q = np.logspace(-4, 4, 700)
    fig, ax = plt.subplots()
    ax.set_xscale("log")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    for dg0, col, dy in ((+5.0, c[0], 8), (0.0, c[1], 0), (-15.0, c[2], -8)):
        dG = dg0 + RT * np.log(Q)
        ax.plot(Q, dG, color=col, lw=2.2)
        sign = "+" if dg0 > 0 else ""
        S.label_end(ax, Q[-1], dG[-1],
                    f"$\\Delta$G$'\\degree$ = {sign}{dg0:g}", col, mode,
                    dx=6, dy=dy, size=9.5)
        Qz = np.exp(-dg0 / RT)  # the zero crossing IS K'eq
        ax.plot([Qz], [0.0], "o", color=col, ms=7)
        ax.plot([Qz, Qz], [-42.0, 0.0], color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 1.6e-3, 2.0,
           "each line crosses $\\Delta$G = 0 where\n"
           "Q = K$'_{eq}$ = exp(-$\\Delta$G$'\\degree$/RT)", mode)
    S.note(ax, 1.35e4, 2.6, "(kJ/mol)", mode, va="bottom", size=8.5)
    S.note(ax, 1.2e-4, 10.0,
           "computed from $\\Delta$G = $\\Delta$G$'\\degree$ + RT ln Q,\n"
           "T = 310 K (RT = 2.58 kJ/mol)", mode)
    S.note(ax, 1.2e-4, 26.0, "$\\Delta$G > 0: runs in reverse", mode, size=9)
    S.note(ax, 6.0e2, -30.0, "$\\Delta$G < 0: runs forward\nas written",
           mode, size=9)
    ax.set_xlabel("mass-action ratio  Q  (log scale)")
    ax.set_ylabel("$\\Delta$G  (kJ/mol)")
    ax.set_title("Concentrations can override the standard sign")
    ax.set_xlim(1e-4, 1e4)
    ax.set_ylim(-44, 34)
    S.strip(ax)
    return fig


# --- II.2  Glycolysis and its mirror ----------------------------------------


@figure("bc2-glycolysis-ledger")
def _(mode):
    """The glycolytic ATP/NADH ledger as a two-phase schematic.

    Boxes and arrows only: the investment phase spends 2 ATP reaching
    fructose 1,6-bisphosphate, aldol cleavage yields two triose phosphates,
    and the payoff phase - run once per triose, twice per glucose - returns
    4 ATP and 2 NADH. The per-glucose quantities are the textbook-exact
    stoichiometry; everything positional is schematic.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 4.2))
    y = 3.3
    from matplotlib.patches import Rectangle
    for x0, x1, col, lab in (
            (0.4, 5.7, c[0], "investment phase - spend"),
            (8.35, 15.5, c[1], "payoff phase - collect, runs twice")):
        ax.add_patch(Rectangle((x0, 1.75), x1 - x0, 3.15, facecolor=col,
                               alpha=0.07, edgecolor="none"))
        ax.text((x0 + x1) / 2, 4.62, lab, ha="center", va="center",
                fontsize=10, fontweight="semibold", color=col)
    nodes = [
        (1.45, "glucose"),
        (4.15, "fructose 1,6-\nbisphosphate"),
        (7.35, "2 $\\times$ triose\nphosphate"),
        (14.3, "2 pyruvate"),
    ]
    for x, s in nodes:
        ax.text(x, y, s, ha="center", va="center", fontsize=11,
                fontweight="semibold", color=S.INK[mode])
    for x0, x1 in ((2.25, 3.0), (5.35, 6.3), (8.5, 13.3)):
        ax.annotate("", xy=(x1, y), xytext=(x0, y),
                    arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                    lw=1.8))
    ax.text(2.7, 2.62, "$-$2 ATP", ha="center", va="top", fontsize=10.5,
            fontweight="semibold", color=c[0])
    S.note(ax, 2.7, 2.2, "hexokinase, PFK-1", mode, ha="center", va="top",
           size=8.5)
    S.note(ax, 5.82, 3.78, "aldol\ncleavage", mode, ha="center", va="bottom",
           size=8.5)
    ax.text(10.6, 2.62, "$+$4 ATP (substrate-level)   $+$2 NADH",
            ha="center", va="top", fontsize=10.5, fontweight="semibold",
            color=c[1])
    S.note(ax, 10.6, 2.14, "each triose runs the payoff once -\n"
           "twice per glucose", mode, ha="center", va="top", size=8.5)
    ax.text(8.0, 0.62,
            "net per glucose:   $-$2 + 4 = $+$2 ATP    and    $+$2 NADH",
            ha="center", va="center", fontsize=11.5, fontweight="semibold",
            color=c[2])
    S.note(ax, 0.5, 5.35, "schematic - the per-glucose quantities are exact",
           mode, size=8.5)
    ax.set_title("Glycolysis spends 2 ATP to collect 4, and banks 2 NADH")
    ax.set_xlim(0, 16)
    ax.set_ylim(0.1, 5.9)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.3  Glycogen and the pentose phosphate shunt -------------------------


@figure("bc2-glycogen-branching")
def _(mode):
    """A glycogen particle segment: branched chains, ends highlighted.

    Pure schematic: beads are glucose residues on (alpha-1,4)-linked runs,
    the accented take-off bonds are (alpha-1,6) branch points, and the open
    circles mark the nonreducing ends exposed at the surface, where
    phosphorylase and synthase both work. Chain lengths and tier counts are
    illustrative, stated as such on the figure.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 4.8))
    step = 0.42
    tips = []

    def seg(p0, ang_deg, n):
        a = np.deg2rad(ang_deg)
        d = step * np.array([np.cos(a), np.sin(a)])
        pts = np.array([np.asarray(p0) + k * d for k in range(n + 1)])
        ax.plot(pts[:, 0], pts[:, 1], color=c[0], lw=1.7,
                solid_capstyle="round")
        ax.plot(pts[1:, 0], pts[1:, 1], "o", color=c[0], ms=4.6)
        return pts

    def branch_bond(p0, ang_deg):
        a = np.deg2rad(ang_deg)
        d = step * np.array([np.cos(a), np.sin(a)])
        p1 = np.asarray(p0) + d
        ax.plot([p0[0], p1[0]], [p0[1], p1[1]], color=c[2], lw=2.8,
                solid_capstyle="round")
        return p1

    root = np.array([1.05, 2.45])
    # glycogenin dimer at the core
    ax.plot([0.88, 1.16], [2.38, 2.52], "o", color=S.GUIDE[mode], ms=11)
    S.note(ax, 1.0, 1.95, "glycogenin dimer\n(core)", mode, ha="center",
           va="top", size=8.5)
    # upper arm
    A = seg(root, 32, 5)
    A2 = seg(A[-1], 12, 5)
    tips.append(A2[-1])
    b = branch_bond(A[3], 78)                      # alpha-1,6 take-off
    A1 = seg(b, 66, 4)
    tips.append(A1[-1])
    b = branch_bond(A2[2], 52)
    A2b = seg(b, 44, 4)
    tips.append(A2b[-1])
    # lower arm
    B = seg(root, -22, 5)
    B2 = seg(B[-1], -4, 5)
    B3 = seg(B2[-1], 10, 4)
    tips.append(B3[-1])
    b = branch_bond(B[3], -68)
    B1 = seg(b, -56, 4)
    tips.append(B1[-1])
    b = branch_bond(B2[2], -44)
    B2b = seg(b, -36, 4)
    tips.append(B2b[-1])
    # nonreducing ends, highlighted
    for tx, ty in tips:
        ax.plot([tx], [ty], "o", ms=9, markerfacecolor="none",
                markeredgecolor=c[1], markeredgewidth=2.2)
    ax.annotate("nonreducing ends: phosphorylase\ntrims and synthase extends here",
                xy=tuple(A2b[-1]), xytext=(3.3, 5.98),
                color=c[1], fontsize=10, fontweight="semibold",
                ha="left", va="center",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.1,
                                shrinkB=10))
    S.label_end(ax, 4.55, 3.93,
                "($\\alpha$1$\\rightarrow$4)-linked chain", c[0], mode,
                dx=2, dy=-20, ha="left", va="top", size=9.5)
    ax.annotate("($\\alpha$1$\\rightarrow$6) branch point",
                xy=((A[3][0] + A1[0][0]) / 2, (A[3][1] + A1[0][1]) / 2),
                xytext=(0.35, 5.5), color=c[2], fontsize=9.5,
                fontweight="semibold", ha="left", va="center",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode], lw=1.1,
                                shrinkB=4))
    S.note(ax, 0.35, -0.5,
           "the one reducing end is buried at glycogenin;\n"
           "every working end is nonreducing", mode, va="bottom", size=8.5)
    S.note(ax, 8.4, 2.6, "schematic - chain lengths and\n"
           "tier counts illustrative, not to scale", mode, ha="right",
           va="center", size=8.5)
    ax.set_title("Branching multiplies the ends the enzymes can work on")
    ax.set_xlim(0.2, 8.5)
    ax.set_ylim(-0.55, 6.45)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.4  Pyruvate to acetyl-CoA and the citric acid cycle -----------------


@figure("bc2-tca-ledger")
def _(mode):
    """One turn of the citric acid cycle as a ring with its exits marked.

    Schematic: the eight intermediates sit on a ring, acetyl-CoA enters at
    citrate synthase, the two CO2 exits and the four energy captures (3
    NADH, 1 FADH2, 1 GTP) are drawn at the steps that produce them, and
    oxaloacetate returns to start the next turn. The layout is drawn; the
    per-turn quantities are the textbook-exact stoichiometry.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.0, 6.6))
    r = 2.0
    names = [
        ("citrate", 68), ("isocitrate", 23),
        ("$\\alpha$-ketoglutarate", -22), ("succinyl-CoA", -67),
        ("succinate", -112), ("fumarate", -157),
        ("malate", 158), ("oxaloacetate", 113),
    ]

    def pos(ang_deg, radius):
        a = np.deg2rad(ang_deg)
        return radius * np.cos(a), radius * np.sin(a)

    # succinyl-CoA sits centered under its node so it clears the CO2/NADH
    # labels of the neighboring step; everything else is placed radially.
    overrides = {"succinyl-CoA": dict(rad=0.42, ha="center", va="top")}
    for name, ang in names:
        x, y = pos(ang, r)
        ax.plot([x], [y], "o", color=c[0], ms=6)
        ov = overrides.get(name, {})
        lx, ly = pos(ang, r + ov.get("rad", 0.30))
        ha = ov.get("ha") or (
            "left" if lx > 0.25 else ("right" if lx < -0.25 else "center"))
        va = ov.get("va") or (
            "bottom" if ly > 0.25 else ("top" if ly < -0.25 else "center"))
        S.note(ax, lx, ly, name, mode, ha=ha, va=va, size=9)
    # ring arrows, clockwise (the direction of the turn)
    angs = [a for _, a in names] + [names[0][1] - 360]
    for a0, a1 in zip(angs[:-1], angs[1:]):
        p0, p1 = pos(a0, r), pos(a1, r)
        ax.annotate("", xy=p1, xytext=p0,
                    arrowprops=dict(arrowstyle="->", color=c[0], lw=1.6,
                                    shrinkA=7, shrinkB=7,
                                    connectionstyle="arc3,rad=-0.22"))
    # entry: acetyl-CoA at citrate synthase (between OAA and citrate)
    ax.annotate("", xy=(0.0, r + 0.12), xytext=(0.0, 3.45),
                arrowprops=dict(arrowstyle="->", color=c[2], lw=2.0))
    ax.text(0.0, 3.6, "acetyl-CoA (2C) enters", ha="center", va="bottom",
            fontsize=10.5, fontweight="semibold", color=c[2])
    S.note(ax, 0.14, 2.72, "citrate synthase", mode, size=8.5)
    # exits and captures, at the mid-angle of the step that makes them
    def exit_arrow(mid_ang, texts, va_over=None):
        x0, y0 = pos(mid_ang, r + 0.12)
        x1, y1 = pos(mid_ang, r + 0.80)
        ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                    arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                    lw=1.5))
        lx, ly = pos(mid_ang, r + 0.95)
        ha = "left" if lx > 0.25 else ("right" if lx < -0.25 else "center")
        va = va_over or (
            "bottom" if ly > 0.25 else ("top" if ly < -0.25 else "center"))
        for i, (txt, col) in enumerate(texts):
            ax.text(lx, ly - 0.34 * i, txt, ha=ha,
                    va=va, fontsize=9.5, fontweight="semibold", color=col)

    exit_arrow(0.5, [("CO$_2$", c[1]), ("NADH", c[2])])       # icdh
    exit_arrow(-44.5, [("CO$_2$", c[1]), ("NADH", c[2])])     # akg-dh
    exit_arrow(-89.5, [("GTP", c[2])])                        # succ-CoA synth
    exit_arrow(-134.5, [("FADH$_2$", c[2])])                  # succinate dh
    # va="top" drops this label below its arrow, clear of "oxaloacetate"
    exit_arrow(135.5, [("NADH", c[2])], va_over="top")        # malate dh
    S.note(ax, 0.35, -0.62, "isocitrate dehydrogenase and\n"
           "$\\alpha$-ketoglutarate dehydrogenase\nrelease the two CO$_2$",
           mode, ha="center", va="center", size=8)
    S.note(ax, -4.55, 3.9,
           "one turn, per acetyl-CoA:\n2 CO$_2$ out\n3 NADH, 1 FADH$_2$\n"
           "1 GTP", mode, va="top", size=9.5)
    S.note(ax, -4.55, -3.35, "oxaloacetate is regenerated -\n"
           "the cycle is catalytic, not consumed", mode, va="bottom",
           size=8.5)
    S.note(ax, 4.55, -3.35, "schematic layout;\nper-turn quantities exact",
           mode, ha="right", va="bottom", size=8.5)
    ax.set_title("One turn: two carbons in, two CO$_2$ out, four captures")
    ax.set_xlim(-4.7, 4.7)
    ax.set_ylim(-3.5, 4.3)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.5  Oxidative phosphorylation ----------------------------------------


@figure("bc2-proton-motive")
def _(mode):
    """The proton-motive force computed term by term.

    dG per proton re-entering = 2.3 RT dpH + F dpsi, evaluated at T = 310 K
    with the stated physiological values dpH = 0.75 and dpsi = 0.15 V:
    the chemical term is 2.3 x 8.314 x 310 x 0.75 = 4.4 kJ/mol, the
    electrical term 96485 x 0.15 = 14.5 kJ/mol, total 18.9 kJ/mol. The bars
    ARE those numbers; nothing is drawn to look right.
    """
    c = S.SERIES[mode]
    R, T, F = 8.314, 310.0, 96485.0
    dpH, dpsi = 0.75, 0.15
    chem = 2.3 * R * T * dpH / 1000.0    # kJ/mol
    elec = F * dpsi / 1000.0             # kJ/mol
    total = chem + elec

    fig, ax = plt.subplots()
    xs = [0, 1, 2]
    ax.bar([0], [chem], width=0.55, facecolor=c[0], alpha=0.25,
           edgecolor=c[0], linewidth=2.0)
    ax.bar([1], [elec], width=0.55, facecolor=c[1], alpha=0.25,
           edgecolor=c[1], linewidth=2.0)
    # the total is the two terms stacked, so the sum is visibly the sum
    ax.bar([2], [elec], width=0.55, facecolor=c[1], alpha=0.25,
           edgecolor=c[1], linewidth=2.0)
    ax.bar([2], [chem], width=0.55, bottom=elec, facecolor=c[0], alpha=0.25,
           edgecolor=c[0], linewidth=2.0)
    for x, v, txt in ((0, chem, f"{chem:.1f}"), (1, elec, f"{elec:.1f}"),
                      (2, total, f"{total:.1f} kJ/mol per H$^+$")):
        ax.annotate(txt, xy=(x, v), xytext=(0, 6),
                    textcoords="offset points", ha="center", va="bottom",
                    color=S.INK[mode], fontsize=10.5, fontweight="semibold")
    S.note(ax, -0.42, 21.6,
           "computed from $\\Delta$G = 2.3RT$\\cdot\\Delta$pH + F$\\Delta\\psi$"
           " at T = 310 K", mode, size=9)
    S.note(ax, -0.42, 19.8,
           "the electrical term carries roughly 3/4 of the force",
           mode, size=9)
    ax.set_xticks(xs)
    ax.set_xticklabels([
        "chemical term\n2.3RT$\\cdot\\Delta$pH\n($\\Delta$pH = 0.75)",
        "electrical term\nF$\\Delta\\psi$\n($\\Delta\\psi$ = 0.15 V)",
        "total\nper proton re-entering",
    ], fontsize=9)
    ax.set_ylabel("free energy per proton  (kJ/mol)")
    ax.set_title("The proton-motive force is mostly electrical")
    ax.set_xlim(-0.6, 2.6)
    ax.set_ylim(0, 24)
    S.strip(ax)
    return fig


# --- II.6  Lipid metabolism -------------------------------------------------


@figure("bc2-palmitate-ledger")
def _(mode):
    """The palmitate ATP ledger, computed from its own arithmetic.

    Seven beta-oxidation passes yield 7 FADH2 (x 1.5) and 7 NADH (x 2.5);
    the eight acetyl-CoA each earn 10 through the citric acid cycle;
    activation to palmitoyl-CoA spends two phosphoanhydride bonds. Every
    bar height is computed from those factors, and the net bar is their
    sum: 10.5 + 17.5 + 80 - 2 = 106 ATP.
    """
    c = S.SERIES[mode]
    fadh2 = 7 * 1.5          # 10.5
    nadh = 7 * 2.5           # 17.5
    tca = 8 * 10.0           # 80
    act = -2.0
    net = fadh2 + nadh + tca + act   # 106
    vals = [fadh2, nadh, tca, act, net]
    cols = [c[0], c[0], c[1], S.GUIDE[mode], c[2]]
    labels = [
        "7 FADH$_2$\n$\\times$ 1.5", "7 NADH\n$\\times$ 2.5",
        "8 acetyl-CoA\n$\\times$ 10 (cycle)",
        "activation\n(2 ~P spent)", "net",
    ]
    fig, ax = plt.subplots()
    xs = np.arange(5)
    for x, v, col in zip(xs, vals, cols):
        ax.bar([x], [v], width=0.55, facecolor=col, alpha=0.25,
               edgecolor=col, linewidth=2.0)
        sign = "+" if v > 0 and x < 4 else ""
        txt = f"{sign}{v:g}"
        ax.annotate(txt, xy=(x, max(v, 0)), xytext=(0, 5),
                    textcoords="offset points", ha="center", va="bottom",
                    color=S.INK[mode], fontsize=10.5, fontweight="semibold")
    ax.axhline(0, color=S.GRID[mode], lw=1.0)
    # the beta-oxidation bracket: the first two bars together are 28 ATP
    ax.plot([-0.28, 1.28], [34.0, 34.0], color=S.GUIDE[mode], lw=1.1)
    for xb in (-0.28, 1.28):
        ax.plot([xb, xb], [31.5, 34.0], color=S.GUIDE[mode], lw=1.1)
    S.note(ax, 0.5, 36.0, "7 $\\beta$-oxidation passes: 28 ATP", mode,
           ha="center", size=9)
    S.note(ax, 3.6, 96.0, "net = 10.5 + 17.5 + 80 $-$ 2\n= 106 ATP",
           mode, ha="right", size=9.5)
    ax.set_xticks(xs)
    ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylabel("ATP equivalents")
    ax.set_title("Palmitate to 106 ATP, term by term")
    ax.set_xlim(-0.6, 4.6)
    ax.set_ylim(-12, 122)
    S.strip(ax)
    return fig


# --- II.7  Nitrogen: amino acid metabolism and the urea cycle ---------------


@figure("bc2-nitrogen-flow")
def _(mode):
    """Nitrogen's route from amino acid to urea: boxes and arrows.

    Schematic of the textbook pathway: transamination funnels amino groups
    to glutamate; glutamate dehydrogenase releases NH4+ in the liver
    mitochondrion; carbamoyl phosphate joins ornithine to make citrulline,
    which exits to the cytosol; aspartate donates the second nitrogen;
    fumarate leaves for the citric acid cycle; arginase splits arginine
    into urea and regenerated ornithine. No quantity on the figure.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 5.4))
    from matplotlib.patches import FancyBboxPatch
    ax.add_patch(FancyBboxPatch((0.5, 0.55), 7.1, 2.95,
                                boxstyle="round,pad=0.12",
                                facecolor=c[0], alpha=0.06,
                                edgecolor=S.GUIDE[mode], lw=1.2))
    S.note(ax, 0.75, 3.22, "liver mitochondrion", mode, size=9)
    S.note(ax, 15.5, 5.28, "cytosol", mode, ha="right", size=9)

    def node(x, y, s, col=None, size=10.5):
        ax.text(x, y, s, ha="center", va="center", fontsize=size,
                fontweight="semibold",
                color=col if col else S.INK[mode])

    def arrow(p0, p1, col=None, lw=1.6, rad=0.0):
        ax.annotate("", xy=p1, xytext=p0,
                    arrowprops=dict(arrowstyle="->",
                                    color=col if col else S.GUIDE[mode],
                                    lw=lw,
                                    connectionstyle=f"arc3,rad={rad}",
                                    shrinkA=4, shrinkB=4))

    # collection: amino acids -> glutamate -> NH4+ (into the mitochondrion)
    node(1.7, 4.75, "amino acids")
    node(5.0, 4.75, "glutamate")
    arrow((2.75, 4.75), (4.05, 4.75))
    S.note(ax, 3.4, 4.95, "transamination\n(PLP)", mode, ha="center",
           va="bottom", size=8.5)
    node(2.2, 2.55, "NH$_4^+$", c[0])
    arrow((4.75, 4.45), (2.6, 2.85), rad=0.25)
    S.note(ax, 1.05, 4.05, "glutamate\ndehydrogenase", mode, ha="left",
           va="center", size=8.5)
    node(2.2, 1.25, "carbamoyl\nphosphate", size=9.5)
    arrow((2.2, 2.25), (2.2, 1.75))
    S.note(ax, 2.42, 2.0, "+ CO$_2$", mode, size=8.5)
    node(6.1, 1.25, "citrulline")
    arrow((3.35, 1.25), (5.15, 1.25))
    node(4.25, 2.15, "ornithine", size=9.5)
    arrow((4.25, 1.9), (4.25, 1.45))
    # citrulline crosses to the cytosol
    node(9.3, 1.25, "argininosuccinate", size=9.5)
    arrow((7.05, 1.25), (7.95, 1.25))
    node(8.0, 2.6, "aspartate", c[1])
    arrow((8.35, 2.35), (8.9, 1.6), c[1])
    S.note(ax, 9.35, 2.6, "donates the\nsecond N", mode, size=8.5)
    node(12.6, 1.25, "arginine")
    arrow((10.65, 1.25), (11.85, 1.25))
    # fumarate leaves upward, out of the way of the ornithine return
    node(11.15, 2.14, "fumarate $\\rightarrow$ citric acid cycle", None,
         size=9)
    arrow((11.2, 1.45), (11.15, 1.92))
    node(14.9, 2.6, "urea", c[2])
    arrow((13.15, 1.55), (14.55, 2.3), c[2], rad=-0.2)
    S.note(ax, 14.2, 1.55, "arginase", mode, size=8.5)
    # arginase's other product: ornithine, sent back for the next turn
    node(14.35, 0.75, "ornithine", size=9.5)
    arrow((13.2, 1.05), (13.85, 0.88))
    ax.annotate("", xy=(7.9, 0.62), xytext=(13.5, 0.5),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.4, ls=(0, (5, 4))))
    S.note(ax, 10.7, 0.3, "regenerated - back into the mitochondrion "
           "for the next turn", mode, ha="center", va="top", size=8.5)
    S.note(ax, 15.5, 4.5,
           "one N enters as NH$_4^+$ (via glutamate),\n"
           "the second as aspartate;\nurea carries both out", mode,
           ha="right", va="top", size=9)
    S.note(ax, 0.5, -0.45, "schematic - not to scale", mode, size=8.5)
    ax.set_title("Two nitrogens in, one urea out")
    ax.set_xlim(0, 16)
    ax.set_ylim(-0.5, 5.6)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.8  Metabolic integration --------------------------------------------


@figure("bc2-fed-fasting")
def _(mode):
    """Fuel sources from fed state to starvation: qualitative timeline.

    The three curves are drawn shapes (logistic and Gaussian forms, the
    least-committal smooth curves with the stated features), not data:
    glycogen covers the first day, gluconeogenesis dominates days 1-4,
    ketones rise steeply and carry the economy from the first week. The
    time axis is deliberately nonlinear and says so.
    """
    c = S.SERIES[mode]
    x = np.linspace(0.0, 10.0, 700)
    gly = 0.86 / (1.0 + np.exp((x - 1.9) / 0.55))
    gng = 0.72 * np.exp(-((x - 4.4) ** 2) / (2 * 1.9 ** 2)) + 0.06
    ket = 0.90 / (1.0 + np.exp(-(x - 4.6) / 0.85))

    fig, ax = plt.subplots(figsize=(8.0, 4.4))
    ax.plot(x, gly, color=c[0], lw=2.2)
    ax.plot(x, gng, color=c[1], lw=2.2)
    ax.plot(x, ket, color=c[2], lw=2.2)
    S.label_end(ax, 0.1, 0.93, "liver glycogen:\ngone in about a day",
                c[0], mode, dx=0, dy=0, ha="left", va="bottom", size=9.5)
    S.label_end(ax, 4.4, 0.78,
                "gluconeogenesis (amino acids,\nglycerol, lactate):"
                " dominates days 1-4", c[1], mode, dx=0, dy=14, ha="center",
                va="bottom", size=9.5)
    S.label_end(ax, 8.6, 0.9, "ketone bodies + fat:\ncarry the economy"
                " from week 1", c[2], mode, dx=0, dy=6, ha="center",
                va="bottom", size=9.5)
    S.note(ax, 9.75, 0.62,
           "the brain runs largely on\n$\\beta$-hydroxybutyrate;\n"
           "protein loss slows", mode, ha="right", va="top", size=8.5)
    ax.set_xticks([0, 1.4, 2.8, 5.0, 6.6, 9.6])
    ax.set_xticklabels(["fed", "12 h", "1 day", "4 days", "1 week",
                        "6 weeks"])
    ax.set_yticks([])
    ax.grid(False)
    ax.set_xlabel(
        "time without food  (schematic - deliberately nonlinear axis, "
        "not to scale)")
    ax.set_ylabel("share of fuel supply  (qualitative)")
    ax.set_title("Fuels hand off in order: glycogen, gluconeogenesis, ketones")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 1.28)
    S.strip(ax)
    return fig


# ===========================================================================
# Fourth pass - Biochemistry II wave B (chapters II.9-II.14, the information
# pathways). Every figure here is a pure schematic: drawn shapes standing for
# textbook-standard molecular biology, qualitative labels only, and each
# figure declares itself schematic. The few numbers that appear (fold-
# compaction factors, hydrogen-bond-free facts like "20-30 nt") are stated
# textbook constants, never measurements off the drawing.
# ===========================================================================


# --- II.9  Genomes and chromosome packaging ---------------------------------


@figure("bc2-dna-packing")
def _(mode):
    """The packing ladder from naked helix to metaphase chromosome.

    Five stages left to right - naked B-DNA, nucleosome beads on a string,
    the H1-condensed fiber, looped domains on a scaffold, and the metaphase
    chromosome - with the textbook-standard approximate fold-compaction
    label under each rung (about 7-fold at the nucleosome, about 10,000-fold
    overall). All shapes are drawn, nothing is to scale, and the figure says
    so.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 4.6))
    y = 2.55

    # stage 1: naked double helix - two crossing sine strands
    cx = 1.5
    xh = np.linspace(cx - 1.05, cx + 1.05, 300)
    ph = 2 * np.pi * (xh - xh[0]) / 0.9
    ax.plot(xh, y + 0.26 * np.sin(ph), color=c[0], lw=1.9)
    ax.plot(xh, y - 0.26 * np.sin(ph), color=c[0], lw=1.9)

    # stage 2: nucleosome beads on a string
    cx = 4.35
    xb = np.linspace(cx - 1.1, cx + 1.1, 200)
    ax.plot(xb, y + 0.10 * np.sin(2 * np.pi * (xb - xb[0]) / 1.5),
            color=c[0], lw=1.5)
    for k, bx in enumerate(np.linspace(cx - 0.9, cx + 0.9, 5)):
        by = y + 0.10 * np.sin(2 * np.pi * (bx - xb[0]) / 1.5)
        ax.plot([bx], [by], "o", color=c[1], ms=11, alpha=0.85)
    S.note(ax, cx, y - 0.62, "histone octamer cores", mode, ha="center",
           va="top", size=8)

    # stage 3: the H1-condensed fiber - beads packed into a thick zigzag
    cx = 7.15
    n = 11
    fx = np.linspace(cx - 0.95, cx + 0.95, n)
    fy = y + 0.20 * np.where(np.arange(n) % 2 == 0, 1.0, -1.0)
    ax.plot(fx, fy, color=c[0], lw=1.3)
    ax.plot(fx, fy, "o", color=c[1], ms=9, alpha=0.85)
    S.note(ax, cx, y - 0.98, "H1 clamps the beads together", mode,
           ha="center", va="top", size=8)

    # stage 4: looped domains anchored on a scaffold - each loop is a
    # circle drawn through its anchor point on the scaffold
    cx = 9.95
    ax.plot([cx, cx], [y - 0.9, y + 0.9], color=S.GUIDE[mode], lw=2.6,
            solid_capstyle="round")
    t = np.linspace(0, 2 * np.pi, 120)
    for ay, ang, r in ((y + 0.62, 35, 0.42), (y + 0.12, 150, 0.46),
                       (y - 0.32, 15, 0.44), (y - 0.72, 200, 0.40)):
        a = np.deg2rad(ang)
        ccx, ccy = cx + r * np.cos(a), ay + r * np.sin(a)
        ax.plot(ccx + r * np.cos(t), ccy + r * np.sin(t), color=c[0],
                lw=1.5)
        ax.plot([cx], [ay], "o", color=c[2], ms=5.5)
    S.note(ax, cx, y - 1.28, "CTCF + cohesin/condensin\nanchor the loops",
           mode, ha="center", va="top", size=8)

    # stage 5: metaphase chromosome - four thick arms from a centromere
    cx = 12.95
    for dx, dy in ((-0.42, 0.95), (0.42, 0.95), (-0.42, -0.95),
                   (0.42, -0.95)):
        ax.plot([cx, cx + dx], [y, y + dy], color=c[0], lw=13,
                solid_capstyle="round", alpha=0.45)
    ax.plot([cx], [y], "o", color=S.GUIDE[mode], ms=8)

    stages = [
        (1.5, "naked B-DNA helix", "1$\\times$"),
        (4.35, "nucleosome\nbeads on a string", "$\\sim$7$\\times$"),
        (7.15, "condensed fiber", "$\\sim$40$\\times$"),
        (9.95, "looped domains\n(TADs)", "$\\sim$1,000$\\times$"),
        (12.95, "metaphase\nchromosome", "$\\sim$10,000$\\times$ overall"),
    ]
    for sx, name, fold in stages:
        ax.text(sx, 4.35, name, ha="center", va="center", fontsize=10,
                fontweight="semibold", color=S.INK[mode])
        ax.text(sx, 0.42, fold, ha="center", va="center", fontsize=10,
                fontweight="semibold", color=c[2])
    for x0 in (2.75, 5.65, 8.35, 11.25):
        ax.annotate("", xy=(x0 + 0.55, y), xytext=(x0, y),
                    arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                    lw=1.8))
    S.note(ax, 0.35, -0.42,
           "schematic - shapes drawn, not to scale; fold-compaction labels "
           "are approximate textbook values", mode, size=8.5)
    ax.set_title("Each rung of packing multiplies the compaction")
    ax.set_xlim(0.2, 14.3)
    ax.set_ylim(-0.5, 4.85)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.10  Copying DNA -----------------------------------------------------


@figure("bc2-replication-fork")
def _(mode):
    """The bacterial replication fork with its full cast labeled.

    Pure schematic: parental duplex on the right, DnaB helicase ring at the
    apex, gyrase working ahead, SSB on the single strands, primase docked on
    the helicase, the two tau-linked Pol III cores on beta clamps (leading
    continuous, lagging looped trombone-style around an Okazaki fragment),
    Pol I nick-translating a finished fragment, and ligase sealing the last
    nick. Strand polarity is marked 5'/3' everywhere a strand ends, and the
    new-strand arrows all run 5' to 3'. Nothing is to scale.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.6, 5.8))
    from matplotlib.patches import Ellipse as E

    tem, new, rna = c[0], c[2], c[1]

    def blob(x, y_, w, h, label=None, dx=0.0, dy_=0.0, ha="center",
             va="center", size=8.5):
        ax.add_patch(E((x, y_), w, h, facecolor=S.GUIDE[mode], alpha=0.22,
                       edgecolor=S.GUIDE[mode], lw=1.4))
        if label:
            ax.text(x + dx, y_ + dy_, label, ha=ha, va=va, fontsize=size,
                    fontweight="semibold", color=S.INK[mode])

    # parental duplex, entering from the right; fork apex at the helicase
    ax.plot([15.3, 10.55], [6.05, 5.75], color=tem, lw=2.0)
    ax.plot([15.3, 10.55], [5.35, 5.65], color=tem, lw=2.0)
    S.note(ax, 15.45, 6.05, "3$'$", mode, va="center", size=8.5)
    S.note(ax, 15.45, 5.35, "5$'$", mode, va="center", size=8.5)
    # gyrase ahead of the fork
    ax.plot([13.6], [5.7], "o", ms=13, markerfacecolor="none",
            markeredgecolor=S.GUIDE[mode], markeredgewidth=2.2)
    ax.annotate("DNA gyrase relieves the (+)\nsupercoils pushed ahead",
                xy=(13.6, 6.0), xytext=(12.9, 7.35), fontsize=8.5,
                color=S.INK_2[mode], ha="center", va="bottom",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=2))
    # fork-movement cue
    ax.annotate("", xy=(14.2, 4.55), xytext=(13.0, 4.55),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.6))
    S.note(ax, 13.6, 4.3, "fork moves", mode, ha="center", va="top",
           size=8.5)

    # DnaB helicase ring at the apex, primase docked underneath
    blob(10.1, 5.7, 1.05, 1.05)
    ax.text(10.1, 6.55, "DnaB helicase", ha="center", va="bottom",
            fontsize=9, fontweight="semibold", color=S.INK[mode])
    blob(9.75, 4.85, 0.75, 0.6)
    ax.text(10.45, 4.85, "DnaG primase\n(docks on the helicase)",
            ha="left", va="center", fontsize=8.5, fontweight="semibold",
            color=S.INK[mode])

    # ---- leading side (top): template up-left, new strand chases the fork
    ax.plot([9.7, 8.6, 1.0], [6.05, 6.95, 6.95], color=tem, lw=2.0)
    S.note(ax, 0.85, 6.95, "3$'$", mode, ha="right", va="center", size=8.5)
    ax.plot([2.0, 8.35], [6.62, 6.62], color=new, lw=2.4)
    ax.annotate("", xy=(8.75, 6.55), xytext=(8.15, 6.6),
                arrowprops=dict(arrowstyle="->", color=new, lw=2.2))
    S.note(ax, 1.85, 6.62, "5$'$", mode, ha="right", va="center", size=8.5)
    S.note(ax, 8.95, 6.32, "3$'$", mode, va="center", size=8.5)
    blob(7.6, 6.62, 1.15, 0.75)
    ax.plot([7.0], [6.62], "o", ms=13, markerfacecolor="none",
            markeredgecolor=S.GUIDE[mode], markeredgewidth=2.0)
    S.label_end(ax, 4.9, 7.0, "leading strand: one primer,\nthen continuous"
                " 5$'\\rightarrow$3$'$", new, mode, dx=0, dy=14,
                ha="center", va="bottom", size=9)
    ax.annotate("Pol III core riding a $\\beta$ sliding clamp",
                xy=(7.05, 6.28), xytext=(3.6, 6.05), fontsize=8.5,
                color=S.INK_2[mode], ha="center", va="top",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=2))

    # ---- the tau connection and clamp loader between the two cores
    ax.plot([8.15, 8.5, 8.5], [6.4, 5.6, 4.4], color=S.GUIDE[mode], lw=1.3,
            ls=(0, (4, 3)))
    S.note(ax, 8.62, 4.55, "$\\tau$ links the cores; the clamp\n"
           "loader hands out $\\beta$ clamps", mode, ha="right",
           va="bottom", size=8)

    # ---- lagging side (bottom): SSB, trombone loop, Okazaki fragments
    # template: from the fork down-left, around the loop, back out leftward
    th = np.linspace(0.35 * np.pi, 1.98 * np.pi, 240)
    lcx, lcy, lr = 7.15, 2.55, 1.15
    loop_x = lcx + lr * np.cos(th)
    loop_y = lcy + lr * np.sin(th)
    ax.plot([9.9, 8.9], [5.35, 4.35], color=tem, lw=2.0)
    ax.plot([8.9, loop_x[0]], [4.35, loop_y[0]], color=tem, lw=2.0)
    ax.plot(loop_x, loop_y, color=tem, lw=2.0)
    ax.plot([loop_x[-1], 4.6, 1.0], [loop_y[-1], 3.45, 3.45], color=tem,
            lw=2.0)
    S.note(ax, 0.85, 3.45, "5$'$", mode, ha="right", va="center", size=8.5)
    # SSB beads on the exposed single strand
    for bx, by in ((9.55, 5.0), (9.15, 4.6), (8.55, 4.22)):
        ax.plot([bx], [by], "o", color=S.GUIDE[mode], ms=7.5, alpha=0.8)
    S.note(ax, 10.3, 3.6, "SSB coats the exposed\nsingle strand", mode,
           va="top", size=8.5)
    # the lagging core sits where the loop folds back to the replisome
    blob(7.7, 3.62, 1.15, 0.75)
    ax.plot([7.15], [3.35], "o", ms=13, markerfacecolor="none",
            markeredgecolor=S.GUIDE[mode], markeredgewidth=2.0)
    S.note(ax, 5.15, 1.05, "the lagging template loops back\n"
           "\"trombone-style\" through its core", mode, ha="center",
           va="top", size=8.5)
    # Okazaki fragment underway inside the loop: RNA primer + new DNA
    thf = np.linspace(1.28 * np.pi, 1.62 * np.pi, 60)
    ax.plot(lcx + 0.87 * np.cos(thf), lcy + 0.87 * np.sin(thf), color=rna,
            lw=2.6)
    thf2 = np.linspace(1.62 * np.pi, 1.95 * np.pi, 60)
    ax.plot(lcx + 0.87 * np.cos(thf2), lcy + 0.87 * np.sin(thf2), color=new,
            lw=2.4)
    ax.annotate("", xy=(lcx + 0.9 * np.cos(1.97 * np.pi),
                        lcy + 0.9 * np.sin(1.97 * np.pi)),
                xytext=(lcx + 0.87 * np.cos(1.9 * np.pi),
                        lcy + 0.87 * np.sin(1.9 * np.pi)),
                arrowprops=dict(arrowstyle="->", color=new, lw=2.0))
    ax.annotate("Okazaki fragment underway,\n5$'\\rightarrow$3$'$ away from"
                " the fork", xy=(lcx + 0.9, lcy - 0.75), xytext=(9.7, 1.35),
                fontsize=8.5, color=S.INK_2[mode], ha="left", va="center",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=2))
    # finished fragments left of the loop: primer, Pol I, ligase
    ax.plot([4.35, 3.6], [3.14, 3.14], color=rna, lw=2.6)   # primer
    ax.plot([3.6, 2.6], [3.14, 3.14], color=new, lw=2.4)
    ax.plot([2.35, 1.35], [3.14, 3.14], color=new, lw=2.4)
    S.label_end(ax, 4.05, 3.14, "RNA primer", rna, mode, dx=4, dy=-11,
                ha="left", va="top", size=8.5)
    blob(4.6, 3.3, 0.85, 0.6)
    ax.annotate("Pol I nick-translates:\nprimer out, DNA in",
                xy=(4.6, 3.0), xytext=(4.0, 1.95), fontsize=8.5,
                color=S.INK_2[mode], ha="center", va="top",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=2))
    ax.plot([2.475], [3.14], marker="v", color=c[2], ms=7)
    ax.annotate("ligase seals\nthe last nick", xy=(2.475, 3.3),
                xytext=(1.7, 2.0), fontsize=8.5, color=S.INK_2[mode],
                ha="center", va="top",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=2))
    S.note(ax, 0.55, 8.35,
           "antiparallel throughout: both new strands grow 5$'\\rightarrow$3$'$,"
           " so one is continuous, the other comes in fragments", mode,
           size=9)
    S.note(ax, 15.45, 0.45, "schematic - not to scale", mode, ha="right",
           size=8.5)
    ax.set_title("The replication fork copies both strands at once")
    ax.set_xlim(0.3, 15.7)
    ax.set_ylim(0.35, 8.85)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.11  Protecting DNA: mutation, repair, recombination -----------------


@figure("bc2-repair-pathways")
def _(mode):
    """Damage class to repair pathway: the exam's routing table.

    Six lesion classes on the left, each arrowed to the pathway that handles
    it, with a one-line mechanism under each pathway name. The double-strand
    break forks to its two answers (homologous recombination vs end
    joining). Purely schematic - the arrows are the pairings, nothing more.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 6.4))

    rows = [
        (10.35, "replication mismatch", "wrong pair that escaped proofreading",
         [("mismatch repair (MMR)", c[0],
           "MutS finds it, MutL directs excision of the NEW strand")]),
        (8.75, "small damaged base",
         "uracil (deaminated C), 8-oxoguanine",
         [("base-excision repair (BER)", c[0],
           "glycosylase $\\rightarrow$ AP site $\\rightarrow$ AP endonuclease"
           " $\\rightarrow$ polymerase fills, ligase seals")]),
        (7.15, "bulky, helix-distorting adduct",
         "UV pyrimidine dimer, benzo[a]pyrene",
         [("nucleotide-excision repair (NER)", c[0],
           "excinuclease cuts both sides: 12-13-mer (bacteria), 27-29-mer"
           " (human);\ndefects $\\rightarrow$ xeroderma pigmentosum")]),
        (5.45, "methyl / photoproduct mark", "one altered group, helix intact",
         [("direct reversal", c[0],
           "photolyase (nonplacental), O$^6$-methylguanine"
           " methyltransferase, AlkB")]),
        (3.95, "lesion at a stalled fork", "replication cannot wait",
         [("translesion synthesis", c[0],
           "low-fidelity polymerases copy past the lesion")]),
        (1.95, "double-strand break", "both strands cut - no intact partner",
         [("homologous recombination (HR)", c[2],
           "RecA/Rad51, BRCA2 - copies a sister template, accurate"),
          ("nonhomologous end joining (NHEJ)", c[1],
           "Ku, DNA-PKcs, ligase IV - no template, error-prone")]),
    ]
    for y, lesion, sub, paths in rows:
        ax.text(0.4, y, lesion, ha="left", va="center", fontsize=10.5,
                fontweight="semibold", color=S.INK[mode])
        S.note(ax, 0.4, y - 0.36, sub, mode, va="center", size=8.5)
        if len(paths) == 1:
            targets = [(y, paths[0])]
        else:
            targets = [(y + 0.75, paths[0]), (y - 0.75, paths[1])]
        for ty, (pname, pcol, detail) in targets:
            ax.annotate("", xy=(6.55, ty), xytext=(5.5, y),
                        arrowprops=dict(arrowstyle="->",
                                        color=S.GUIDE[mode], lw=1.6,
                                        shrinkA=2, shrinkB=2))
            ax.text(6.75, ty + 0.02, pname, ha="left", va="bottom",
                    fontsize=10.5, fontweight="semibold", color=pcol)
            S.note(ax, 6.75, ty - 0.12, detail, mode, va="top", size=8.5)
    S.note(ax, 0.4, 0.35,
           "schematic - each arrow is the damage-to-pathway pairing the "
           "exam expects", mode, size=8.5)
    ax.set_title("Match the lesion to its repair pathway")
    ax.set_xlim(0.2, 15.4)
    ax.set_ylim(0.2, 11.1)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.12  Transcription and RNA maturation --------------------------------


@figure("bc2-transcript-processing")
def _(mode):
    """Pre-mRNA maturation: gene, processing, mature message.

    Three tiers: the gene with exons and introns; the primary transcript
    acquiring its cap while the spliceosome (U1 at the GU site, U2 at the
    branch-point A) excises each intron as a lariat and the 3' end is
    cleaved after AAUAAA and polyadenylated; and the finished capped, tailed
    mRNA leaving for the cytoplasm. The stated lengths (20-30 nt at capping,
    80-250 A) are textbook constants; the drawing is schematic and says so.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.2, 6.2))
    from matplotlib.patches import Rectangle, Ellipse as E

    exon, intron = c[0], S.GUIDE[mode]

    def tier(y, xs, h=0.42, with_introns=True):
        """xs = [(x0, x1, is_exon), ...]; returns nothing, draws the row."""
        for x0, x1, is_exon in xs:
            if is_exon:
                ax.add_patch(Rectangle((x0, y - h / 2), x1 - x0, h,
                                       facecolor=exon, alpha=0.30,
                                       edgecolor=exon, lw=1.6))
            else:
                ax.plot([x0, x1], [y, y], color=intron, lw=1.6)

    # --- tier 1: the gene
    y1 = 9.7
    tier(y1, [(2.0, 3.5, True), (3.5, 5.1, False), (5.1, 6.6, True),
              (6.6, 8.2, False), (8.2, 9.7, True)])
    # promoter: bent arrow at the start
    ax.plot([1.55, 1.55], [y1, y1 + 0.75], color=S.INK_2[mode], lw=1.4)
    ax.annotate("", xy=(2.35, y1 + 0.75), xytext=(1.55, y1 + 0.75),
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode],
                                lw=1.4))
    S.note(ax, 1.4, y1 + 0.85, "Pol II starts here", mode, size=8.5)
    for ex, lab in ((2.75, "exon"), (5.85, "exon"), (8.95, "exon")):
        S.note(ax, ex, y1 - 0.34, lab, mode, ha="center", va="top", size=8)
    for ix in (4.3, 7.4):
        S.note(ax, ix, y1 - 0.34, "intron", mode, ha="center", va="top",
               size=8)
    ax.text(10.1, y1, "the gene", ha="left", va="center", fontsize=10,
            fontweight="semibold", color=S.INK[mode])

    ax.annotate("", xy=(5.85, 8.35), xytext=(5.85, 9.05),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.8))
    S.note(ax, 6.05, 8.7, "transcription (Pol II copies exons AND introns)",
           mode, size=8.5)

    # --- tier 2: the primary transcript being processed
    y2 = 7.0
    tier(y2, [(2.0, 3.5, True), (3.5, 5.1, False), (5.1, 6.6, True),
              (6.6, 8.2, False), (8.2, 9.7, True)])
    # 5' cap
    ax.plot([1.78], [y2], "o", color=c[1], ms=10)
    ax.annotate("m$^7$G cap, 5$'$-5$'$ triphosphate link\n(on by 20-30 nt"
                " of transcript)", xy=(1.78, y2 + 0.2), xytext=(0.6, 8.45),
                fontsize=8.5, color=S.INK_2[mode], ha="left", va="bottom",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=3))
    # spliceosome parts on the first intron
    ax.add_patch(E((3.62, y2 - 0.42), 0.62, 0.5, facecolor=c[2], alpha=0.25,
                   edgecolor=c[2], lw=1.4))
    ax.text(3.62, y2 - 0.42, "U1", ha="center", va="center", fontsize=7.5,
            fontweight="semibold", color=S.INK[mode])
    ax.add_patch(E((4.72, y2 - 0.42), 0.62, 0.5, facecolor=c[2], alpha=0.25,
                   edgecolor=c[2], lw=1.4))
    ax.text(4.72, y2 - 0.42, "U2", ha="center", va="center", fontsize=7.5,
            fontweight="semibold", color=S.INK[mode])
    S.note(ax, 4.17, y2 - 0.78, "U1 at the GU 5$'$ splice site;\n"
           "U2 at the branch-point A", mode, ha="center", va="top",
           size=7.5)
    # the lariat: intron looped out above the second intron
    t = np.linspace(0, 2 * np.pi, 160)
    ax.plot(7.4 + 0.34 * np.sin(t), 7.9 + 0.30 - 0.30 * np.cos(t),
            color=intron, lw=1.6)
    ax.plot([7.4, 7.4], [y2 + 0.21, 7.9], color=intron, lw=1.6)
    ax.annotate("each intron leaves as a lariat\n(two transesterifications)",
                xy=(7.76, 8.25), xytext=(8.75, 8.15), fontsize=8.5,
                color=S.INK_2[mode], ha="left", va="center",
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.0, shrinkB=2))
    # 3' end: cleavage after AAUAAA, then the tail
    ax.text(9.15, y2 + 0.36, "AAUAAA", ha="center", va="bottom",
            fontsize=7.5, color=S.INK_2[mode])
    ax.plot([9.95, 9.95], [y2 - 0.5, y2 + 0.5], color=c[1], lw=1.6,
            ls=(0, (3, 2)))
    ax.plot([9.95, 10.55], [y2, y2], color=intron, lw=1.6)
    S.note(ax, 9.6, y2 - 0.65, "cleaved 10-30 nt past AAUAAA;\npoly(A)"
           " polymerase adds 80-250 A", mode, va="top", size=8.5)
    ax.text(10.65, y2, "primary transcript,\nbeing processed", ha="left",
            va="center", fontsize=10, fontweight="semibold",
            color=S.INK[mode])

    ax.annotate("", xy=(5.85, 4.85), xytext=(5.85, 5.55),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.8))
    S.note(ax, 6.05, 5.2, "splicing + cleavage + tailing complete", mode,
           size=8.5)

    # --- tier 3: the mature message
    y3 = 3.5
    ax.plot([2.48], [y3], "o", color=c[1], ms=10)
    tier(y3, [(2.7, 4.2, True), (4.2, 5.7, True), (5.7, 7.2, True)])
    ax.text(7.45, y3, "AAAA$\\cdots$A", ha="left", va="center", fontsize=10,
            fontweight="semibold", color=c[1])
    S.note(ax, 2.48, y3 - 0.42, "cap", mode, ha="center", va="top", size=8)
    S.note(ax, 4.95, y3 - 0.42, "exons joined", mode, ha="center", va="top",
           size=8)
    S.note(ax, 8.15, y3 - 0.42, "poly(A) tail", mode, ha="center", va="top",
           size=8)
    ax.annotate("", xy=(12.1, y3), xytext=(9.6, y3),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.8))
    ax.text(12.3, y3, "exported to\nthe cytoplasm", ha="left", va="center",
            fontsize=10, fontweight="semibold", color=S.INK[mode])
    S.note(ax, 2.0, 2.3, "mature mRNA: capped, spliced, tailed - the only "
           "version the ribosome ever sees", mode, size=9)
    S.note(ax, 13.9, 1.35, "schematic - not to scale", mode, ha="right",
           size=8.5)
    ax.set_title("Cap, splice, cleave, tail: a transcript becomes a message")
    ax.set_xlim(0.4, 14.1)
    ax.set_ylim(1.2, 10.9)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.13  Translation and the protein's afterlife -------------------------


@figure("bc2-translation-cycle")
def _(mode):
    """One round of ribosomal elongation across the A, P and E sites.

    Schematic ribosome (large subunit above, small below, mRNA threaded
    through) with the three tRNA sites labeled and the four numbered moves
    of the cycle: EF-Tu delivery into A, peptide-bond formation by the 23S
    rRNA peptidyl transferase center, EF-G translocation one codon toward
    3', and departure of the deacylated tRNA from E. Nothing is to scale.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.0, 5.9))
    from matplotlib.patches import Ellipse as E, Rectangle

    # subunits
    ax.add_patch(E((7.0, 6.1), 6.8, 3.6, facecolor=c[0], alpha=0.07,
                   edgecolor=S.GUIDE[mode], lw=1.5))
    ax.add_patch(E((7.0, 3.55), 7.6, 1.5, facecolor=c[0], alpha=0.07,
                   edgecolor=S.GUIDE[mode], lw=1.5))
    S.note(ax, 3.15, 7.35, "large subunit", mode, size=8.5)
    S.note(ax, 2.6, 3.05, "small subunit", mode, size=8.5)
    # mRNA through the middle
    ax.plot([1.1, 12.4], [4.35, 4.35], color=S.INK_2[mode], lw=1.7)
    ax.annotate("", xy=(12.9, 4.35), xytext=(12.3, 4.35),
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode],
                                lw=1.7))
    S.note(ax, 0.95, 4.35, "5$'$", mode, ha="right", va="center", size=9)
    S.note(ax, 13.05, 4.35, "3$'$", mode, va="center", size=9)
    S.note(ax, 12.35, 3.95, "mRNA", mode, size=8.5)
    # the three sites
    for sx, letter in ((5.3, "E"), (7.0, "P"), (8.7, "A")):
        ax.add_patch(Rectangle((sx - 0.62, 4.5), 1.24, 2.2, facecolor="none",
                               edgecolor=S.GUIDE[mode], lw=1.2,
                               ls=(0, (4, 3))))
        ax.text(sx, 7.0, letter, ha="center", va="center", fontsize=13,
                fontweight="semibold", color=S.INK[mode])

    def trna(x, y_, col, alpha=1.0):
        ax.plot([x, x], [y_, y_ + 1.6], color=col, lw=2.6, alpha=alpha,
                solid_capstyle="round")
        ax.plot([x - 0.34, x + 0.34], [y_ + 1.6, y_ + 1.6], color=col,
                lw=2.6, alpha=alpha, solid_capstyle="round")

    # P-site tRNA with the growing chain
    trna(7.0, 4.55, c[0])
    for k in range(4):
        ax.plot([7.0], [6.55 + 0.38 * k], "o", color=c[0], ms=7.5)
    S.note(ax, 6.6, 8.0, "growing\npeptide", mode, ha="right", va="center",
           size=8.5)
    # A-site tRNA with its single amino acid
    trna(8.7, 4.55, c[2])
    ax.plot([8.7], [6.55], "o", color=c[2], ms=7.5)
    # 1: delivery
    trna(11.7, 7.0, c[2])
    ax.plot([11.7], [9.0], "o", color=c[2], ms=7.5)
    ax.add_patch(E((11.7, 6.7), 1.0, 0.62, facecolor=S.GUIDE[mode],
                   alpha=0.25, edgecolor=S.GUIDE[mode], lw=1.3))
    ax.annotate("", xy=(9.15, 6.65), xytext=(10.95, 7.0),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.7, connectionstyle="arc3,rad=0.2"))
    ax.text(10.35, 7.55, "1", ha="center", va="center", fontsize=10,
            fontweight="semibold", color=S.INK[mode])
    ax.text(9.55, 9.55,
            "1  EF-Tu$\\cdot$GTP delivers the aminoacyl-tRNA\n"
            "    to A; EF-Tu leaves after GTP hydrolysis",
            ha="left", va="center", fontsize=9, fontweight="semibold",
            color=S.INK[mode])
    # 2: peptide bond
    ax.annotate("", xy=(8.5, 6.85), xytext=(7.25, 7.9),
                arrowprops=dict(arrowstyle="->", color=c[1], lw=1.8,
                                connectionstyle="arc3,rad=-0.3"))
    ax.text(8.15, 8.15, "2", ha="center", va="center", fontsize=10,
            fontweight="semibold", color=S.INK[mode])
    ax.text(1.0, 9.35,
            "2  peptidyl transferase center (23S rRNA)\n"
            "    bonds the chain onto the A-site tRNA",
            ha="left", va="center", fontsize=9, fontweight="semibold",
            color=S.INK[mode])
    # 3: translocation
    ax.annotate("", xy=(9.4, 2.35), xytext=(6.0, 2.35),
                arrowprops=dict(arrowstyle="->", color=c[1], lw=2.2))
    ax.text(9.65, 2.35, "3", ha="left", va="center", fontsize=10,
            fontweight="semibold", color=S.INK[mode])
    ax.text(0.6, 1.35,
            "3  EF-G$\\cdot$GTP moves the ribosome one codon toward 3$'$:"
            " tRNAs shift A $\\rightarrow$ P $\\rightarrow$ E",
            ha="left", va="bottom", fontsize=9, fontweight="semibold",
            color=S.INK[mode])
    # 4: exit
    trna(2.9, 6.6, S.GUIDE[mode], alpha=0.9)
    ax.annotate("", xy=(3.35, 7.3), xytext=(4.75, 6.4),
                arrowprops=dict(arrowstyle="->", color=S.GUIDE[mode],
                                lw=1.7, connectionstyle="arc3,rad=0.25"))
    ax.text(3.95, 6.05, "4", ha="center", va="center", fontsize=10,
            fontweight="semibold", color=S.INK[mode])
    ax.text(0.6, 2.15,
            "4  the deacylated tRNA departs from E",
            ha="left", va="bottom", fontsize=9, fontweight="semibold",
            color=S.INK[mode])
    S.note(ax, 13.35, 0.75, "schematic - not to scale; cycle repeats\n"
           "once per codon", mode, ha="right", size=8.5)
    ax.set_title("One elongation round: deliver, bond, shift, eject")
    ax.set_xlim(0.4, 13.5)
    ax.set_ylim(0.6, 10.1)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
    return fig


# --- II.14  Gene regulation -------------------------------------------------


@figure("bc2-lac-operon")
def _(mode):
    """The lac operon's four states in one glucose-by-lactose grid.

    Each cell draws the control region (CAP site, promoter, operator, then
    lacZYA) with the Lac repressor and CRP-cAMP shown bound or free as that
    state dictates. Strong transcription appears only in the -glucose /
    +lactose cell; +glucose/+lactose is basal only. Pure schematic.
    """
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 6.4))
    from matplotlib.patches import Rectangle, Ellipse as E

    rep, crp, txn = c[1], c[2], c[0]

    def cell(x0, y0, repressor_on, crp_on, arrow, status, looped=False,
             highlight=False):
        """One operon state. arrow in {'none','basal','strong'}."""
        if highlight:
            ax.add_patch(Rectangle((x0 - 0.15, y0 - 0.25), 7.5, 4.35,
                                   facecolor=txn, alpha=0.06,
                                   edgecolor="none"))
        y = y0 + 1.7
        # DNA and its boxes
        ax.plot([x0 + 0.1, x0 + 7.0], [y, y], color=S.INK_2[mode], lw=1.3)
        boxes = [(0.55, 1.45, "CAP\nsite"), (1.45, 2.45, "P"),
                 (2.45, 3.15, "O$_1$"), (3.15, 6.55, "lacZYA")]
        for b0, b1, lab in boxes:
            ax.add_patch(Rectangle((x0 + b0, y - 0.26), b1 - b0, 0.52,
                                   facecolor="none",
                                   edgecolor=S.GUIDE[mode], lw=1.2))
            ax.text(x0 + (b0 + b1) / 2, y - 0.62, lab, ha="center", va="top",
                    fontsize=7, color=S.INK_2[mode])
        # the repressor
        if repressor_on:
            ax.add_patch(E((x0 + 2.8, y + 0.42), 0.85, 0.6, facecolor=rep,
                           alpha=0.85, edgecolor=rep, lw=1.2))
            if looped:
                # the DNA loop: from a small upstream O3 back to the
                # repressor sitting on O1
                t = np.linspace(0.0, 1.0, 80)
                ax.plot(x0 + 0.3 + 2.5 * t,
                        y + 0.05 + 1.1 * np.sin(np.pi * t), color=rep,
                        lw=1.2, ls=(0, (3, 2)))
                ax.text(x0 + 0.3, y - 0.62, "O$_3$", ha="center", va="top",
                        fontsize=7, color=S.INK_2[mode])
                S.note(ax, x0 + 1.55, y + 1.3, "loops to O$_3$", mode,
                       ha="center", size=7)
        else:
            ax.add_patch(E((x0 + 3.4, y + 1.35), 0.85, 0.6, facecolor=rep,
                           alpha=0.35, edgecolor=rep, lw=1.2))
            ax.plot([x0 + 3.75], [y + 1.62], "o", color=S.INK_2[mode],
                    ms=4.5)
            S.note(ax, x0 + 4.0, y + 1.42, "allolactose holds\nthe repressor"
                   " off", mode, size=7)
        # CRP-cAMP (idle CRP moves right when the loop needs the left side)
        if crp_on:
            ax.add_patch(E((x0 + 1.0, y + 0.42), 0.85, 0.6, facecolor=crp,
                           alpha=0.85, edgecolor=crp, lw=1.2))
            S.note(ax, x0 + 0.15, y + 0.85, "CRP-cAMP", mode, size=7)
        elif looped:
            ax.add_patch(E((x0 + 5.35, y + 1.35), 0.85, 0.6,
                           facecolor="none", edgecolor=crp, lw=1.2,
                           ls=(0, (3, 2))))
            S.note(ax, x0 + 4.8, y + 1.22, "CRP idle\n(cAMP low)", mode,
                   ha="right", size=7)
        else:
            ax.add_patch(E((x0 + 0.7, y + 1.35), 0.85, 0.6,
                           facecolor="none", edgecolor=crp, lw=1.2,
                           ls=(0, (3, 2))))
            S.note(ax, x0 + 1.2, y + 1.25, "CRP idle\n(cAMP low)", mode,
                   size=7)
        # transcription
        if arrow == "strong":
            ax.annotate("", xy=(x0 + 6.4, y + 0.75), xytext=(x0 + 1.95,
                                                             y + 0.75),
                        arrowprops=dict(arrowstyle="->", color=txn, lw=2.6))
        elif arrow == "basal":
            ax.annotate("", xy=(x0 + 4.1, y + 0.75), xytext=(x0 + 1.95,
                                                             y + 0.75),
                        arrowprops=dict(arrowstyle="->", color=txn, lw=1.2,
                                        ls=(0, (3, 3))))
        ax.text(x0 + 3.6, y0 + 0.16, status, ha="center", va="center",
                fontsize=8.8, fontweight="semibold",
                color=txn if arrow == "strong" else S.INK[mode])

    # grid: columns = lactose, rows = glucose
    cell(0.9, 6.0, repressor_on=True, crp_on=False, arrow="none",
         looped=True, status="OFF - repressor clamps the operator")
    cell(8.9, 6.0, repressor_on=False, crp_on=False, arrow="basal",
         status="basal only - no CRP push")
    cell(0.9, 0.7, repressor_on=True, crp_on=True, arrow="none",
         status="OFF - repressor still blocks")
    cell(8.9, 0.7, repressor_on=False, crp_on=True, arrow="strong",
         highlight=True, status="ON - strong transcription of lacZYA")

    ax.text(4.5, 10.75, "lactose absent", ha="center", va="center",
            fontsize=11, fontweight="semibold", color=S.INK[mode])
    ax.text(12.5, 10.75, "lactose present", ha="center", va="center",
            fontsize=11, fontweight="semibold", color=S.INK[mode])
    ax.text(0.25, 8.0, "glucose present", ha="center", va="center",
            fontsize=11, fontweight="semibold", color=S.INK[mode],
            rotation=90)
    ax.text(0.25, 2.7, "glucose absent", ha="center", va="center",
            fontsize=11, fontweight="semibold", color=S.INK[mode],
            rotation=90)
    ax.plot([0.7, 16.3], [5.55, 5.55], color=S.GRID[mode], lw=1.0)
    ax.plot([8.6, 8.6], [0.3, 10.4], color=S.GRID[mode], lw=1.0)
    S.note(ax, 16.3, -0.15, "schematic - not to scale", mode, ha="right",
           size=8.5)
    ax.set_title("lac logic: ON only when lactose is present AND glucose is"
                 " absent")
    ax.set_xlim(-0.2, 16.5)
    ax.set_ylim(-0.3, 11.2)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    S.strip(ax)
    for sp in ax.spines.values():
        sp.set_visible(False)
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
