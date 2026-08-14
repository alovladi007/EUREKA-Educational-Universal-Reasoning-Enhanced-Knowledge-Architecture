#!/usr/bin/env python3
"""Generate the figures for MCAT Biochemistry I, chapters I.1-I.7.

Same contract as gen_fe_ee_figures.py, and it deliberately imports the SAME
style module rather than growing a second look: every quantitative figure here
is COMPUTED from the equation the chapter states, with its parameters printed
on the figure, so a reader can check the curve against the formula. The two
schematics (structure hierarchy, energy diagram) carry only qualitative labels
and no numbers. Nothing is traced, scanned or adapted from any textbook - this
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

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
