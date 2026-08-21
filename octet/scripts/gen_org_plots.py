#!/usr/bin/env python3
"""Computed data plots and schematic diagrams for ORG1 chapters 2-5.

Every plot is drawn from the numbers the lessons' own sourced tables state
(CRC boiling points, NIST hydrogenation enthalpies, standard aqueous pKa
values, standard BDEs) - the figure and the prose cannot drift apart
because they share one data source. Schematics (Newman projections, arrow
grammar, radical chain, energy curves) are drawn from the geometry or the
mechanism the lesson states.

Run:  python3 scripts/gen_org_plots.py
Out:  apps/web/public/figures/octet/{stem}-{light,dark}.svg
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Circle, FancyArrowPatch  # noqa: E402

import octet_figstyle as fs  # noqa: E402

OUT = HERE.parent / "apps" / "web" / "public" / "figures" / "octet"


def _bar(ax, labels, values, color, ink, unit, rotate=0):
    x = np.arange(len(labels))
    ax.bar(x, values, width=0.62, color=color, edgecolor=ink, linewidth=0.6)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, rotation=rotate,
                       ha="right" if rotate else "center", fontsize=9)
    for xi, v in zip(x, values):
        ax.annotate(f"{v:g}", (xi, v), textcoords="offset points",
                    xytext=(0, 4 if v >= 0 else -12), ha="center",
                    fontsize=8.5, color=ink)
    ax.set_ylabel(unit)
    ax.spines[["top", "right"]].set_visible(False)


# ---------------------------------------------------------------------------
# ch2: alkane boiling-point trend (CRC values from the lesson table)
# ---------------------------------------------------------------------------

def fig_alkane_bp(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    n = [1, 2, 3, 4, 5, 6, 7, 8]
    bp = [-161.5, -88.6, -42.1, -0.5, 36.1, 68.7, 98.4, 125.7]
    mp = [-182.5, -183.3, -187.7, -138.3, -129.7, -95.3, -90.6, -56.8]
    fig, ax = plt.subplots(figsize=(6.4, 4.0))
    ax.plot(n, bp, marker="o", color=fs.SERIES[mode][0], linewidth=2, label="boiling point")
    ax.plot(n, mp, marker="s", color=fs.SERIES[mode][1], linewidth=2, label="melting point")
    ax.axhline(0, color=fs.GUIDE[mode], linewidth=0.8, linestyle=(0, (3, 3)))
    ax.set_xlabel("carbons in the unbranched alkane")
    ax.set_ylabel("temperature (C)")
    ax.legend(frameon=False, fontsize=9)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", color=fs.GRID[mode], linewidth=0.6)
    fs.save(fig, OUT, "org1-alkane-bp-trend", mode)
    plt.close(fig)


def fig_c5_bpmp(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    labels = ["pentane", "2-methyl-\nbutane", "2,2-dimethyl-\npropane"]
    bp = [36.1, 27.8, 9.5]
    mp = [-129.7, -159.9, -16.6]
    x = np.arange(3)
    fig, ax = plt.subplots(figsize=(6.2, 4.0))
    ax.bar(x - 0.19, bp, 0.36, color=fs.SERIES[mode][0], label="bp (C)")
    ax.bar(x + 0.19, mp, 0.36, color=fs.SERIES[mode][1], label="mp (C)")
    for xi, v in zip(x - 0.19, bp):
        ax.annotate(f"{v:g}", (xi, v), textcoords="offset points",
                    xytext=(0, 4), ha="center", fontsize=8.5, color=ink)
    for xi, v in zip(x + 0.19, mp):
        ax.annotate(f"{v:g}", (xi, v), textcoords="offset points",
                    xytext=(0, -12), ha="center", fontsize=8.5, color=ink)
    ax.axhline(0, color=fs.INK_2[mode], linewidth=0.8)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylabel("temperature (C)")
    ax.legend(frameon=False, fontsize=9)
    ax.spines[["top", "right"]].set_visible(False)
    fs.save(fig, OUT, "org1-c5-bpmp", mode)
    plt.close(fig)


# ---------------------------------------------------------------------------
# ch2: Newman projections (geometric drawing)
# ---------------------------------------------------------------------------

def _newman(ax, cx, cy, offset_deg, r=1.0, ink="k", label=""):
    """One Newman projection: front carbon bonds at 90/210/330, back at
    those angles + offset."""
    back_r = 0.62 * r
    circ = Circle((cx, cy), back_r, fill=False, color=ink, linewidth=1.6)
    ax.add_patch(circ)
    for base in (90, 210, 330):
        # back bonds start at the circle rim
        th = np.radians(base + offset_deg)
        x0, y0 = cx + back_r * np.cos(th), cy + back_r * np.sin(th)
        x1, y1 = cx + r * np.cos(th), cy + r * np.sin(th)
        ax.plot([x0, x1], [y0, y1], color=ink, linewidth=1.6)
        ax.annotate("H", (cx + 1.16 * r * np.cos(th), cy + 1.16 * r * np.sin(th)),
                    ha="center", va="center", fontsize=11, color=ink)
    for base in (90, 210, 330):
        th = np.radians(base)
        ax.plot([cx, cx + r * np.cos(th)], [cy, cy + r * np.sin(th)],
                color=ink, linewidth=2.2)
        ax.annotate("H", (cx + 1.16 * r * np.cos(th), cy + 1.16 * r * np.sin(th)),
                    ha="center", va="center", fontsize=11, color=ink,
                    fontweight="bold")
    ax.annotate(label, (cx, cy - 1.55 * r), ha="center", fontsize=11, color=ink)


def fig_newman(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    fig, ax = plt.subplots(figsize=(6.6, 3.4))
    _newman(ax, 0, 0, 60, ink=ink, label="staggered (minimum)")
    _newman(ax, 4.2, 0, 12, ink=ink, label="eclipsed (transition state)")
    ax.annotate("bold = front carbon bonds, circle = back carbon",
                (2.1, 1.85), ha="center", fontsize=9.5, color=fs.INK_2[mode])
    ax.set_xlim(-1.8, 6.0)
    ax.set_ylim(-2.1, 2.2)
    ax.set_aspect("equal")
    ax.axis("off")
    fs.save(fig, OUT, "org1-newman-projections", mode)
    plt.close(fig)


# ---------------------------------------------------------------------------
# ch3: pKa ladder + polar effect
# ---------------------------------------------------------------------------

def fig_pka_ladder(mode):
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    acids = [
        ("HCl", -7), ("H3O+", -1.7), ("HF", 3.2), ("acetic acid", 4.76),
        ("NH4+", 9.25), ("phenol", 10.0), ("H2O", 15.7), ("ethanol", 15.9),
        ("ethyne", 25), ("NH3", 38), ("ethane", 50),
    ]
    fig, ax = plt.subplots(figsize=(5.4, 5.6))
    for i, (name, pka) in enumerate(acids):
        side = i % 2
        ax.hlines(pka, 0.32, 0.68, color=fs.SERIES[mode][0], linewidth=2.4)
        ax.annotate(f"{name}  ({pka:g})",
                    (0.28 if side == 0 else 0.72, pka),
                    ha="right" if side == 0 else "left", va="center",
                    fontsize=10, color=ink)
    ax.annotate("stronger acid", (0.5, -10), ha="center", fontsize=10,
                color=ink2)
    ax.annotate("weaker acid", (0.5, 55), ha="center", fontsize=10,
                color=ink2)
    ax.set_xlim(0, 1)
    ax.set_ylim(-13, 58)
    ax.invert_yaxis()
    ax.set_ylabel("aqueous pKa")
    ax.set_xticks([])
    ax.spines[["top", "right", "bottom"]].set_visible(False)
    fs.save(fig, OUT, "org1-pka-ladder", mode)
    plt.close(fig)


def fig_polar_effect(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    fig, ax = plt.subplots(figsize=(6.6, 4.0))
    labels = ["acetic", "chloro-\nacetic", "dichloro-\nacetic", "trichloro-\nacetic",
              "butanoic", "2-chloro-\nbutanoic", "4-chloro-\nbutanoic"]
    vals = [4.76, 2.87, 1.35, 0.66, 4.82, 2.86, 4.52]
    colors = [fs.SERIES[mode][0]] * 4 + [fs.SERIES[mode][1]] * 3
    x = np.arange(len(labels))
    ax.bar(x, vals, width=0.62, color=colors)
    for xi, v in zip(x, vals):
        ax.annotate(f"{v:g}", (xi, v), textcoords="offset points",
                    xytext=(0, 4), ha="center", fontsize=8.5, color=ink)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=8.5)
    ax.set_ylabel("aqueous pKa (lower = stronger acid)")
    ax.spines[["top", "right"]].set_visible(False)
    ax.annotate("stacking (count)", (1.5, 5.6), ha="center", fontsize=9.5,
                color=fs.SERIES[mode][0])
    ax.annotate("distance decay", (5.0, 5.6), ha="center", fontsize=9.5,
                color=fs.SERIES[mode][1])
    ax.set_ylim(0, 6.2)
    fs.save(fig, OUT, "org1-polar-effect", mode)
    plt.close(fig)


# ---------------------------------------------------------------------------
# ch3: arrow grammar schematic
# ---------------------------------------------------------------------------

def _curved(ax, x0, y0, x1, y1, color, rad=0.35):
    ax.add_patch(FancyArrowPatch(
        (x0, y0), (x1, y1), connectionstyle=f"arc3,rad={rad}",
        arrowstyle="-|>", mutation_scale=14, color=color, linewidth=1.8))


def fig_arrow_grammar(mode):
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    acc = fs.SERIES[mode][0]
    fig, ax = plt.subplots(figsize=(7.0, 3.2))
    # Association: B: -> A (one arrow)
    ax.annotate("B:", (0.6, 1.55), fontsize=15, color=ink, ha="center")
    ax.annotate("A", (2.0, 1.55), fontsize=15, color=ink, ha="center")
    _curved(ax, 0.78, 1.66, 1.86, 1.66, acc, rad=0.5)
    ax.annotate("association - one arrow\n(empty orbital available)",
                (1.3, 0.95), fontsize=9.5, color=ink2, ha="center")
    # Displacement: Nu: -> C-LG (two arrows)
    ax.annotate("Nu:", (4.1, 1.55), fontsize=15, color=ink, ha="center")
    ax.annotate("C", (5.35, 1.55), fontsize=15, color=ink, ha="center")
    ax.annotate("LG", (6.6, 1.55), fontsize=15, color=ink, ha="center")
    ax.plot([5.55, 6.35], [1.60, 1.60], color=ink, linewidth=1.6)
    _curved(ax, 4.32, 1.66, 5.2, 1.66, acc, rad=0.5)
    _curved(ax, 5.9, 1.72, 6.55, 1.78, acc, rad=0.55)
    ax.annotate("displacement - paired arrows\n(full octet defended by the leaving group)",
                (5.35, 0.95), fontsize=9.5, color=ink2, ha="center")
    ax.set_xlim(0, 7.4)
    ax.set_ylim(0.6, 2.3)
    ax.axis("off")
    fs.save(fig, OUT, "org1-arrow-grammar", mode)
    plt.close(fig)


# ---------------------------------------------------------------------------
# ch4: alkene stability, cation ladder, BDE chart
# ---------------------------------------------------------------------------

def fig_alkene_stability(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    fig, ax = plt.subplots(figsize=(6.6, 4.0))
    labels = ["ethylene", "1-butene", "cis-2-\nbutene", "trans-2-\nbutene",
              "2-methyl-\n2-butene", "2,3-dimethyl-\n2-butene"]
    vals = [137, 127, 120, 116, 113, 111]
    _bar(ax, labels, vals, fs.SERIES[mode][0], ink,
         "-dH of hydrogenation (kJ/mol)")
    ax.annotate("less heat released = more stable alkene",
                (2.5, 141), ha="center", fontsize=9.5, color=fs.INK_2[mode])
    ax.set_ylim(0, 150)
    fs.save(fig, OUT, "org1-alkene-stability", mode)
    plt.close(fig)


def fig_cation_ladder(mode):
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    fig, ax = plt.subplots(figsize=(6.0, 4.0))
    labels = ["methyl", "primary", "secondary", "tertiary"]
    # Relative gas-phase stabilisation steps (~65 kJ/mol per rung, as the
    # lesson states approximate 60-70 kJ/mol spacing); plotted as energy
    # RELATIVE to tertiary = 0, so higher bar = less stable.
    vals = [195, 130, 65, 0]
    _bar(ax, labels, vals, fs.SERIES[mode][0], ink,
         "relative energy vs tertiary (kJ/mol, approx.)")
    ax.annotate("each rung ~60-70 kJ/mol (gas phase)",
                (1.5, 205), ha="center", fontsize=9.5, color=ink2)
    ax.set_ylim(0, 225)
    fs.save(fig, OUT, "org1-cation-ladder", mode)
    plt.close(fig)


def fig_bde_chart(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    fig, ax = plt.subplots(figsize=(6.6, 4.0))
    labels = ["H-H", "CH3-H", "3deg C-H", "H-Br", "Br-Br", "RO-OR"]
    vals = [436, 439, 400, 366, 193, 150]
    _bar(ax, labels, vals, fs.SERIES[mode][0], ink,
         "bond dissociation energy (kJ/mol)")
    ax.annotate("weak bonds are where radical chemistry starts",
                (2.5, 470), ha="center", fontsize=9.5, color=fs.INK_2[mode])
    ax.set_ylim(0, 500)
    fs.save(fig, OUT, "org1-bde-chart", mode)
    plt.close(fig)


# ---------------------------------------------------------------------------
# ch4: catalysed curve + kinetic/thermodynamic wells
# ---------------------------------------------------------------------------

def _smooth(points, n=500):
    xs, ys = [], []
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        t = np.linspace(0, 1, max(2, n // (len(points) - 1)))
        e = (1 - np.cos(np.pi * t)) / 2
        xs.append(x0 + (x1 - x0) * t)
        ys.append(y0 + (y1 - y0) * e)
    return np.concatenate(xs), np.concatenate(ys)


def fig_catalysed(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    fig, ax = plt.subplots(figsize=(6.6, 4.0))
    xu, yu = _smooth([(0, 0), (2, 6.4), (4, -1.6)])
    xc, yc = _smooth([(0, 0), (1.2, 3.2), (2.0, 1.4), (2.9, 3.9), (4, -1.6)])
    ax.plot(xu, yu, color=fs.SERIES[mode][1], linewidth=2.2, label="uncatalysed")
    ax.plot(xc, yc, color=fs.SERIES[mode][0], linewidth=2.2, label="catalysed")
    ax.annotate("same endpoints:\nequilibrium unchanged", (3.96, -0.3),
                fontsize=9, color=fs.INK_2[mode], ha="right")
    ax.set_xlabel("reaction coordinate")
    ax.set_ylabel("free energy")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.legend(frameon=False, fontsize=9.5, loc="upper right")
    ax.spines[["top", "right"]].set_visible(False)
    fs.save(fig, OUT, "org1-catalysed-curve", mode)
    plt.close(fig)


def fig_kinetic_thermo(mode):
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    fig, ax = plt.subplots(figsize=(6.6, 4.0))
    # start in the middle; low pass left to shallow well, high pass right to deep well
    xl, yl = _smooth([(2.0, 0.0), (1.2, 3.0), (0.35, 1.2)])
    xr, yr = _smooth([(2.0, 0.0), (3.0, 4.4), (3.8, -2.2)])
    ax.plot(xl, yl, color=fs.SERIES[mode][0], linewidth=2.2)
    ax.plot(xr, yr, color=fs.SERIES[mode][1], linewidth=2.2)
    ax.plot([2.0], [0.0], "o", color=ink, markersize=6)
    ax.annotate("start", (2.0, 0.25), ha="center", fontsize=10, color=ink)
    ax.annotate("kinetic product\n(lower barrier,\nshallower well)", (0.35, 1.75),
                ha="center", fontsize=9, color=fs.SERIES[mode][0])
    ax.annotate("thermodynamic product\n(higher barrier,\ndeeper well)", (3.8, -1.6),
                ha="center", fontsize=9, color=fs.SERIES[mode][1])
    ax.annotate("cold / irreversible -> left    hot / reversible -> right",
                (2.05, 5.0), ha="center", fontsize=9.5, color=ink2)
    ax.set_xlim(-0.5, 4.6)
    ax.set_ylim(-3.0, 5.6)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_xlabel("reaction coordinate")
    ax.set_ylabel("free energy")
    ax.spines[["top", "right"]].set_visible(False)
    fs.save(fig, OUT, "org1-kinetic-thermo", mode)
    plt.close(fig)


def fig_aromatic_shortfall(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    fig, ax = plt.subplots(figsize=(5.8, 4.0))
    labels = ["cyclohexene\n(x1)", "3 x cyclohexene\n(hypothetical)", "benzene\n(measured)"]
    vals = [120, 360, 208]
    _bar(ax, labels, vals, fs.SERIES[mode][0], ink,
         "-dH of hydrogenation (kJ/mol)")
    ax.annotate("shortfall ~150 kJ/mol =\naromatic stabilisation",
                (2.0, 300), ha="center", fontsize=9.5, color=fs.SERIES[mode][1])
    ax.set_ylim(0, 400)
    fs.save(fig, OUT, "org1-aromatic-shortfall", mode)
    plt.close(fig)


# ---------------------------------------------------------------------------
# ch5: radical chain cycle
# ---------------------------------------------------------------------------

def fig_radical_chain(mode):
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    acc = fs.SERIES[mode][0]
    fig, ax = plt.subplots(figsize=(6.2, 4.6))
    cx, cy, r = 0.0, 0.0, 1.35
    # cycle circle
    th = np.linspace(0.25 * np.pi, 2.05 * np.pi, 200)
    ax.plot(cx + r * np.cos(th), cy + r * np.sin(th), color=acc, linewidth=2)
    ax.add_patch(FancyArrowPatch(
        (cx + r * np.cos(0.30 * np.pi), cy + r * np.sin(0.30 * np.pi)),
        (cx + r * np.cos(0.25 * np.pi), cy + r * np.sin(0.25 * np.pi)),
        arrowstyle="-|>", mutation_scale=16, color=acc))
    ax.annotate("Br.", (cx, cy + r), ha="center", va="bottom", fontsize=13,
                color=ink, fontweight="bold")
    ax.annotate("carbon radical\n(on the more\nsubstituted carbon)",
                (cx, cy - r - 0.12), ha="center", va="top", fontsize=9.5, color=ink)
    ax.annotate("+ alkene\n(Br to the less\nsubstituted carbon)",
                (cx + r + 0.18, cy), ha="left", va="center", fontsize=9.5, color=ink2)
    ax.annotate("+ H-Br\n(product formed,\nBr. regenerated)",
                (cx - r - 0.18, cy), ha="right", va="center", fontsize=9.5, color=ink2)
    ax.annotate("initiation: RO-OR -> 2 RO.   then   RO. + H-Br -> ROH + Br.",
                (0, r + 0.75), ha="center", fontsize=9.5, color=ink2)
    ax.annotate("each turn of the loop consumes one alkene and one HBr",
                (0, -r - 0.95), ha="center", fontsize=9.5, color=ink2)
    ax.set_xlim(-3.4, 3.4)
    ax.set_ylim(-2.6, 2.5)
    ax.set_aspect("equal")
    ax.axis("off")
    fs.save(fig, OUT, "org1-radical-chain", mode)
    plt.close(fig)



# ---------------------------------------------------------------------------
# ch7: ring strain vs ring size (strain energies from heats of combustion,
# standard physical-organic compilations; kJ/mol vs the cyclohexane reference)
# ---------------------------------------------------------------------------

def fig_a_values(mode):
    """A-values (equatorial preferences, kJ/mol) for common substituents -
    standard compiled values (Eliel-style conformational-analysis tables):
    F 1.0, Br 1.6, Cl 1.8, OCH3 2.5, OH ~3.5 (solvent-dependent),
    CH3 7.3, C2H5 7.5, CH(CH3)2 9.0, C6H5 11.7, C(CH3)3 ~20."""
    fs.apply(mode)
    ink = fs.INK[mode]
    groups = ["F", "Br", "Cl", "OMe", "OH", "Me", "Et", "iPr", "Ph", "tBu"]
    vals = [1.0, 1.6, 1.8, 2.5, 3.5, 7.3, 7.5, 9.0, 11.7, 20.0]
    fig, ax = plt.subplots(figsize=(6.8, 4.0))
    _bar(ax, groups, vals, fs.SERIES[mode][0], ink, "A-value (kJ/mol)")
    ax.set_xlabel("substituent")
    ax.axhline(0, color=fs.GUIDE[mode], linewidth=0.8)
    fs.save(fig, OUT, "org1-a-values", mode)
    plt.close(fig)


def fig_axeq_populations(mode):
    """Equatorial population vs A-value at 298 K, computed from
    K = exp(A/RT), percent_eq = 100 K/(1+K) - pure Boltzmann arithmetic
    on the published A-values marked as points."""
    fs.apply(mode)
    ink = fs.INK[mode]
    import numpy as np
    A = np.linspace(0, 22, 400)
    K = np.exp(A * 1000.0 / (8.314 * 298.0))
    pct = 100.0 * K / (1.0 + K)
    fig, ax = plt.subplots(figsize=(6.8, 4.0))
    ax.plot(A, pct, color=fs.SERIES[mode][0], linewidth=2)
    pts = [("Cl", 1.8), ("OH", 3.5), ("Me", 7.3), ("Ph", 11.7), ("tBu", 20.0)]
    for label, a in pts:
        k = np.exp(a * 1000.0 / (8.314 * 298.0))
        p = 100.0 * k / (1.0 + k)
        ax.plot([a], [p], "o", color=fs.SERIES[mode][1], markersize=6)
        ax.annotate(f"{label} ({p:.0f}%)", (a, p),
                    textcoords="offset points", xytext=(6, -11),
                    fontsize=8.5, color=ink)
    ax.set_xlabel("A-value (kJ/mol)")
    ax.set_ylabel("% equatorial at 298 K")
    ax.set_ylim(48, 102)
    fs.save(fig, OUT, "org1-axeq-populations", mode)
    plt.close(fig)


def fig_ring_faces(mode):
    """Cis vs trans on a ring seen edge-on: same face = cis, opposite
    faces = trans - the face relationship no ring flip can change."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c1 = fs.SERIES[mode][0]
    c2 = fs.SERIES[mode][1]
    fig, axes = plt.subplots(1, 2, figsize=(7.2, 3.0))
    for ax, kind in zip(axes, ("cis", "trans")):
        ax.add_patch(plt.Polygon([(-1.6, 0.0), (1.6, 0.0), (1.9, -0.35),
                                  (-1.3, -0.35)], closed=True,
                                 facecolor="none", edgecolor=ink,
                                 linewidth=2))
        x_a, x_b = -0.9, 0.9
        ax.plot([x_a, x_a], [0.0, 0.85], color=c1, linewidth=2.4)
        ax.annotate("X", (x_a, 1.0), ha="center", fontsize=11, color=c1)
        if kind == "cis":
            ax.plot([x_b, x_b], [0.0, 0.85], color=c2, linewidth=2.4)
            ax.annotate("Y", (x_b, 1.0), ha="center", fontsize=11, color=c2)
            ax.set_title("cis - same face", fontsize=10.5)
        else:
            ax.plot([x_b + 0.12, x_b + 0.12], [-0.35, -1.2], color=c2,
                    linewidth=2.4)
            ax.annotate("Y", (x_b + 0.12, -1.45), ha="center", fontsize=11,
                        color=c2)
            ax.set_title("trans - opposite faces", fontsize=10.5)
        ax.annotate("ring, edge-on", (0.0, -0.18), ha="center", fontsize=8,
                    color=fs.INK_2[mode] if hasattr(fs, "INK_2") else ink)
        ax.set_xlim(-2.3, 2.5)
        ax.set_ylim(-1.8, 1.5)
        ax.axis("off")
    fs.save(fig, OUT, "org1-ring-faces", mode)
    plt.close(fig)


def _chair_skeleton(ax, ink, dx=0.0):
    ring = [(0.0 + dx, 0.55), (1.0 + dx, 0.05), (2.15 + dx, 0.35),
            (2.75 + dx, 1.05), (1.75 + dx, 1.55), (0.60 + dx, 1.25)]
    for i in range(6):
        x0, y0 = ring[i]
        x1, y1 = ring[(i + 1) % 6]
        ax.plot([x0, x1], [y0, y1], color=ink, linewidth=2)
    return ring


def fig_cistrans_chairs(mode):
    """trans-1,2-disubstituted cyclohexane reaches the diequatorial chair;
    cis-1,2 is forced to keep one substituent axial in EITHER chair -
    the ~one-axial-methyl (~7 kJ/mol) energy difference."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c_eq = fs.SERIES[mode][0]
    c_ax = fs.SERIES[mode][1]
    fig, axes = plt.subplots(1, 2, figsize=(8.0, 3.4))
    up = [True, False, True, False, True, False]

    def eq_bond(ax, ring, i, colour):
        x0, y0 = ring[i]
        prev, nxt = ring[(i - 1) % 6], ring[(i + 1) % 6]
        ex = x0 - (nxt[0] - prev[0]) * 0.30
        sign = -1.0 if up[i] else 1.0
        ey = y0 - (nxt[1] - prev[1]) * 0.30 + sign * 0.10
        ax.plot([x0, ex], [y0, ey], color=colour, linewidth=2.6)
        ax.annotate("CH3", (ex, ey + (0.16 if ey > y0 else -0.24)),
                    ha="center", fontsize=8.5, color=colour)

    def ax_bond(ax, ring, i, colour):
        x0, y0 = ring[i]
        dy = 0.62 if up[i] else -0.62
        ax.plot([x0, x0], [y0, y0 + dy], color=colour, linewidth=2.6)
        ax.annotate("CH3", (x0, y0 + dy + (0.10 if dy > 0 else -0.24)),
                    ha="center", fontsize=8.5, color=colour)

    ring = _chair_skeleton(axes[0], ink)
    eq_bond(axes[0], ring, 1, c_eq)
    eq_bond(axes[0], ring, 2, c_eq)
    axes[0].set_title("trans-1,2: BOTH equatorial\n(favoured chair - no axial cost)",
                      fontsize=9.5)
    ring = _chair_skeleton(axes[1], ink)
    eq_bond(axes[1], ring, 1, c_eq)
    ax_bond(axes[1], ring, 2, c_ax)
    axes[1].set_title("cis-1,2: one ALWAYS axial\n(either chair - about 7 kJ/mol dearer)",
                      fontsize=9.5)
    for a in axes:
        a.set_xlim(-1.2, 4.1)
        a.set_ylim(-1.2, 2.6)
        a.axis("off")
    fs.save(fig, OUT, "org1-cistrans-chairs", mode)
    plt.close(fig)


def fig_stereoisomer_map(mode):
    """The four-member family map for two stereocentres: horizontal pairs
    are enantiomers, every cross-pair is diastereomeric - and when the two
    centres are equivalent the bottom pair collapses into one meso
    compound."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.4, 4.6))
    pos = {"(R,R)": (1.2, 3.0), "(S,S)": (5.6, 3.0),
           "(R,S)": (1.2, 1.0), "(S,R)": (5.6, 1.0)}
    for label, (x, y) in pos.items():
        ax.add_patch(plt.Rectangle((x, y), 1.7, 0.8, facecolor="none",
                                   edgecolor=c[0], linewidth=1.8))
        ax.annotate(label, (x + 0.85, y + 0.4), ha="center", va="center",
                    fontsize=12, color=ink)
    ax.annotate("", (5.6, 3.4), (2.9, 3.4),
                arrowprops=dict(arrowstyle="<|-|>", color=c[1], linewidth=1.6))
    ax.annotate("ENANTIOMERS", (4.25, 3.55), ha="center", fontsize=9.5,
                color=c[1])
    ax.annotate("", (5.6, 1.4), (2.9, 1.4),
                arrowprops=dict(arrowstyle="<|-|>", color=c[1], linewidth=1.6))
    ax.annotate("ENANTIOMERS", (4.25, 1.55), ha="center", fontsize=9.5,
                color=c[1])
    for x0, y0, x1, y1 in ((2.05, 3.0, 2.05, 1.8), (6.45, 3.0, 6.45, 1.8)):
        ax.annotate("", (x1, y1), (x0, y0),
                    arrowprops=dict(arrowstyle="<|-|>", color=c[2],
                                    linewidth=1.4))
    ax.annotate("", (5.6, 1.8), (2.9, 2.9),
                arrowprops=dict(arrowstyle="<|-|>", color=c[2], linewidth=1.2,
                                linestyle="dashed"))
    ax.annotate("", (5.6, 2.9), (2.9, 1.8),
                arrowprops=dict(arrowstyle="<|-|>", color=c[2], linewidth=1.2,
                                linestyle="dashed"))
    ax.annotate("every cross-pair:\nDIASTEREOMERS", (4.25, 2.35),
                ha="center", va="center", fontsize=9.5, color=c[2])
    ax.annotate("if the two stereocentres are EQUIVALENT, (R,S) and (S,R) are the\nSAME molecule - one achiral MESO compound, and the count falls to three",
                (3.85, 0.35), ha="center", fontsize=9, color=ink,
                style="italic")
    ax.set_xlim(0.3, 7.9)
    ax.set_ylim(0.0, 4.1)
    ax.axis("off")
    fs.save(fig, OUT, "org1-stereoisomer-map", mode)
    plt.close(fig)


def fig_separability(mode):
    """The consequence that matters: on an ordinary achiral column or in a
    distillation, enantiomers behave identically and give ONE signal, while
    diastereomers differ in every property and resolve into TWO.  Schematic
    traces."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    x = np.linspace(0, 10, 600)
    single = 1.0 * np.exp(-((x - 5.0) ** 2) / 0.30)
    twin = (0.85 * np.exp(-((x - 3.6) ** 2) / 0.26)
            + 0.95 * np.exp(-((x - 6.3) ** 2) / 0.26))
    fig, axes = plt.subplots(1, 2, figsize=(8.0, 3.2), sharey=True)
    axes[0].plot(x, single, color=c[0], linewidth=2)
    axes[0].set_title("ENANTIOMERS on an achiral system", fontsize=10)
    axes[0].annotate("one peak - identical boiling point,\nsolubility and retention:\nNOT separable", (5.0, 1.05),
                     ha="center", fontsize=8.8, color=ink)
    axes[1].plot(x, twin, color=c[1], linewidth=2)
    axes[1].set_title("DIASTEREOMERS on the same system", fontsize=10)
    axes[1].annotate("two peaks - different properties:\nseparable by ordinary\ndistillation or chromatography", (5.0, 1.05),
                     ha="center", fontsize=8.8, color=ink)
    for ax in axes:
        ax.set_ylim(0, 1.5)
        ax.set_yticks([])
        ax.set_xticks([])
        ax.set_xlabel("retention / fraction")
        fs.strip(ax) if hasattr(fs, "strip") else None
    fs.save(fig, OUT, "org1-separability", mode)
    plt.close(fig)


def fig_fischer_convention(mode):
    """The Fischer convention: the cross intersection IS the stereocentre,
    horizontal bonds point TOWARD the viewer and vertical bonds point AWAY.
    Breaking that reading silently inverts the configuration."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.4, 4.2))
    ax.plot([2.2, 5.0], [2.4, 2.4], color=c[0], linewidth=3)
    ax.plot([3.6, 3.6], [1.1, 3.7], color=c[1], linewidth=3)
    ax.plot([3.6], [2.4], "o", color=ink, markersize=9)
    labels = ((3.6, 3.95, "most oxidised group\n(top)", ink),
              (3.6, 0.75, "carbon chain continues\n(bottom)", ink),
              (1.85, 2.4, "H", ink), (5.35, 2.4, "OH", ink))
    for x, y, t, col in labels:
        ax.annotate(t, (x, y), ha="center", va="center", fontsize=9.5,
                    color=col)
    ax.annotate("HORIZONTAL = toward you", (3.6, 2.05), ha="center",
                fontsize=9.5, color=c[0])
    ax.annotate("VERTICAL = away from you", (6.6, 2.4), ha="center",
                fontsize=9.5, color=c[1], rotation=90)
    ax.annotate("the intersection is the stereocentre", (3.6, 2.72),
                ha="center", fontsize=8.6, color=fs.GUIDE[mode])
    ax.annotate("ALLOWED: rotate 180 degrees in the plane\nFORBIDDEN: rotate 90 degrees, or lift out of the plane\n(either one silently inverts the configuration)",
                (3.6, 0.15), ha="center", fontsize=9, color=ink)
    ax.set_xlim(0.6, 7.4)
    ax.set_ylim(-0.3, 4.4)
    ax.axis("off")
    fs.save(fig, OUT, "org1-fischer-convention", mode)
    plt.close(fig)


def fig_fischer_dl(mode):
    """D and L are read off the BOTTOM-most stereocentre in a Fischer
    projection: the reference hydroxyl on the RIGHT is D, on the LEFT is L -
    the glyceraldehyde convention the sugar literature still uses."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    fig, axes = plt.subplots(1, 2, figsize=(7.6, 4.0))
    for ax, side, name, colour in ((axes[0], "right", "D-glyceraldehyde", c[0]),
                                   (axes[1], "left", "L-glyceraldehyde", c[1])):
        ax.plot([1.2, 3.4], [2.2, 2.2], color=colour, linewidth=2.6)
        ax.plot([2.3, 2.3], [1.0, 3.4], color=ink, linewidth=2.6)
        ax.plot([2.3], [2.2], "o", color=ink, markersize=8)
        ax.annotate("CHO", (2.3, 3.6), ha="center", fontsize=10, color=ink)
        ax.annotate("CH2OH", (2.3, 0.75), ha="center", fontsize=10, color=ink)
        if side == "right":
            ax.annotate("H", (0.95, 2.2), ha="center", fontsize=10, color=ink)
            ax.annotate("OH", (3.7, 2.2), ha="center", fontsize=11,
                        color=colour)
        else:
            ax.annotate("HO", (0.85, 2.2), ha="center", fontsize=11,
                        color=colour)
            ax.annotate("H", (3.65, 2.2), ha="center", fontsize=10, color=ink)
        ax.set_title(name, fontsize=10.5)
        ax.set_xlim(0.2, 4.4)
        ax.set_ylim(0.3, 4.1)
        ax.axis("off")
    fig.text(0.5, 0.04,
             "reference OH on the RIGHT = D, on the LEFT = L - a positional convention, NOT a rotation direction",
             ha="center", fontsize=9, color=ink)
    fs.save(fig, OUT, "org1-fischer-dl", mode)
    plt.close(fig)


def fig_resolution_scheme(mode):
    """Classical resolution: a racemate plus a single-enantiomer resolving
    agent gives DIASTEREOMERIC salts, which differ in solubility and
    separate by crystallisation - then the agent is removed."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]

    def box(x, y, w, h, text, colour, fs_=9):
        ax.add_patch(plt.Rectangle((x, y), w, h, facecolor="none",
                                   edgecolor=colour, linewidth=1.7))
        ax.annotate(text, (x + w / 2, y + h / 2), ha="center", va="center",
                    fontsize=fs_, color=ink)

    def arr(x0, y0, x1, y1, label=""):
        ax.annotate("", (x1, y1), (x0, y0),
                    arrowprops=dict(arrowstyle="-|>", color=fs.GUIDE[mode],
                                    linewidth=1.4))
        if label:
            ax.annotate(label, ((x0 + x1) / 2 + 0.15, (y0 + y1) / 2),
                        fontsize=8.4, color=fs.GUIDE[mode], ha="left")

    fig, ax = plt.subplots(figsize=(7.8, 5.0))
    box(3.0, 8.3, 3.6, 0.8, "RACEMATE  (R) + (S)\ninseparable by ordinary means", c[0], 8.8)
    box(3.0, 6.7, 3.6, 0.75, "+ single-enantiomer\nRESOLVING AGENT", c[1], 8.8)
    box(0.6, 4.9, 3.3, 0.85, "salt of (R) with agent\nDIASTEREOMER 1", c[2], 8.6)
    box(5.7, 4.9, 3.3, 0.85, "salt of (S) with agent\nDIASTEREOMER 2", c[2], 8.6)
    box(0.6, 3.1, 3.3, 0.8, "crystallises\n(less soluble)", c[0], 8.6)
    box(5.7, 3.1, 3.3, 0.8, "stays in solution\n(more soluble)", c[0], 8.6)
    box(0.6, 1.3, 3.3, 0.8, "remove agent:\npure (R)", c[1], 9.2)
    box(5.7, 1.3, 3.3, 0.8, "remove agent:\npure (S)", c[1], 9.2)
    arr(4.8, 8.3, 4.8, 7.5)
    arr(4.3, 6.7, 2.5, 5.8)
    arr(5.3, 6.7, 7.1, 5.8)
    arr(2.25, 4.9, 2.25, 3.95)
    arr(7.35, 4.9, 7.35, 3.95)
    arr(2.25, 3.1, 2.25, 2.15)
    arr(7.35, 3.1, 7.35, 2.15)
    ax.annotate("DIFFERENT properties - ordinary crystallisation now works",
                (4.8, 4.35), ha="center", fontsize=9, color=ink, style="italic")
    ax.annotate("maximum yield of either enantiomer: 50 percent",
                (4.8, 0.75), ha="center", fontsize=9, color=ink)
    ax.set_xlim(0.2, 9.4)
    ax.set_ylim(0.4, 9.4)
    ax.axis("off")
    fs.save(fig, OUT, "org1-resolution-scheme", mode)
    plt.close(fig)


def fig_resolution_yields(mode):
    """Theoretical maximum yield of a single enantiomer by method: classical
    resolution and simple kinetic resolution cap at 50 percent, while
    dynamic kinetic resolution, desymmetrisation and asymmetric synthesis
    can in principle reach 100."""
    fs.apply(mode)
    ink = fs.INK[mode]
    methods = ["classical\nresolution", "kinetic\nresolution",
               "chiral\nchromatography", "dynamic kinetic\nresolution",
               "desymmetri-\nsation", "asymmetric\nsynthesis"]
    ceilings = [50, 50, 50, 100, 100, 100]
    fig, ax = plt.subplots(figsize=(7.6, 4.0))
    _bar(ax, methods, ceilings, fs.SERIES[mode][0], ink,
         "theoretical maximum yield of one enantiomer (%)")
    ax.axhline(50, color=fs.GUIDE[mode], linewidth=1.2,
               linestyle=(0, (5, 3)))
    ax.annotate("the 50 percent ceiling: half the material is the wrong hand",
                (0.05, 56), fontsize=9, color=ink)
    ax.set_ylim(0, 118)
    fs.save(fig, OUT, "org1-resolution-yields", mode)
    plt.close(fig)


def fig_stereo_relationships(mode):
    """The relationship decision tree: two structures are constitutional
    isomers, enantiomers, diastereomers, or the same compound - decided by
    three yes/no questions asked in a fixed order."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]

    def box(ax, x, y, w, h, text, colour, fontsize=9):
        ax.add_patch(plt.Rectangle((x, y), w, h, facecolor="none",
                                   edgecolor=colour, linewidth=1.7))
        ax.annotate(text, (x + w / 2, y + h / 2), ha="center", va="center",
                    fontsize=fontsize, color=ink)

    def arrow(ax, x0, y0, x1, y1, label=""):
        ax.annotate("", (x1, y1), (x0, y0),
                    arrowprops=dict(arrowstyle="-|>", color=fs.GUIDE[mode],
                                    linewidth=1.3))
        if label:
            ax.annotate(label, ((x0 + x1) / 2, (y0 + y1) / 2),
                        ha="center", va="center", fontsize=8.2,
                        color=fs.GUIDE[mode],
                        bbox=dict(boxstyle="round,pad=0.15", fc="none",
                                  ec="none"))

    fig, ax = plt.subplots(figsize=(7.6, 5.2))
    box(ax, 3.0, 8.4, 4.0, 0.85, "same molecular formula?", c[0])
    box(ax, 0.2, 6.7, 2.6, 0.8, "different compounds\n(not isomers)", c[1], 8.4)
    box(ax, 3.0, 6.6, 4.0, 0.85, "same connectivity?", c[0])
    box(ax, 0.2, 4.9, 2.6, 0.8, "CONSTITUTIONAL\nisomers", c[2], 8.6)
    box(ax, 3.0, 4.8, 4.0, 0.85, "non-superimposable\nmirror images?", c[0], 8.6)
    box(ax, 0.2, 2.9, 2.6, 0.9, "DIASTEREOMERS\n(or identical -\ncheck meso)", c[2], 8.4)
    box(ax, 3.2, 2.9, 3.6, 0.9, "ENANTIOMERS", c[2], 10.5)
    arrow(ax, 5.0, 8.4, 5.0, 7.45)
    arrow(ax, 3.0, 8.8, 2.8, 7.1, "no")
    arrow(ax, 5.0, 6.6, 5.0, 5.65, "yes")
    arrow(ax, 3.0, 7.0, 2.8, 5.3, "no")
    arrow(ax, 5.0, 4.8, 5.0, 3.8, "yes")
    arrow(ax, 3.0, 5.2, 2.8, 3.5, "no")
    ax.annotate("ask in this order - the answers are independent",
                (5.0, 2.35), ha="center", fontsize=8.6, color=ink,
                style="italic")
    ax.set_xlim(0, 7.6)
    ax.set_ylim(2.0, 9.6)
    ax.axis("off")
    fs.save(fig, OUT, "org1-stereo-relationships", mode)
    plt.close(fig)


def fig_cip_wheel(mode):
    """R vs S by the CIP convention: with the LOWEST priority pointing away
    from the viewer, 1->2->3 clockwise is R (rectus), counterclockwise is S
    (sinister).  Schematic - the convention itself, drawn."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    fig, axes = plt.subplots(1, 2, figsize=(7.4, 3.8))
    for ax, kind in zip(axes, ("R", "S")):
        ax.add_patch(Circle((0, 0), 1.0, facecolor="none", edgecolor=ink,
                            linewidth=1.4))
        angles = [90, -30, 210] if kind == "R" else [90, 210, -30]
        for rank, ang in enumerate(angles, start=1):
            th = np.radians(ang)
            ax.plot([0, np.cos(th)], [0, np.sin(th)], color=ink, linewidth=2)
            ax.annotate(str(rank), (1.22 * np.cos(th), 1.22 * np.sin(th)),
                        ha="center", va="center", fontsize=12, color=c[0])
        ax.plot([0], [0], "o", color=ink, markersize=7)
        ax.annotate("4 (lowest) points away", (0.0, -1.45), ha="center",
                    fontsize=8.5, color=fs.GUIDE[mode])
        if kind == "R":
            arc = FancyArrowPatch((0.62, 0.62), (0.62, -0.62),
                                  connectionstyle="arc3,rad=-0.55",
                                  arrowstyle="-|>", mutation_scale=14,
                                  color=c[1], linewidth=1.8)
        else:
            arc = FancyArrowPatch((0.62, -0.62), (0.62, 0.62),
                                  connectionstyle="arc3,rad=-0.55",
                                  arrowstyle="-|>", mutation_scale=14,
                                  color=c[1], linewidth=1.8)
        ax.add_patch(arc)
        label = ("R - clockwise 1 to 2 to 3" if kind == "R"
                 else "S - counterclockwise")
        ax.set_title(label, fontsize=10.5)
        ax.set_xlim(-1.8, 1.8)
        ax.set_ylim(-1.9, 1.7)
        ax.set_aspect("equal")
        ax.axis("off")
    fs.save(fig, OUT, "org1-cip-wheel", mode)
    plt.close(fig)


def fig_cip_priorities(mode):
    """CIP rule 1 is atomic number at the first point of difference.  The
    plotted values are the periodic table's atomic numbers, which is the
    ranking itself: I > Br > Cl > S > P > F > O > N > C > H."""
    fs.apply(mode)
    ink = fs.INK[mode]
    atoms = ["H", "C", "N", "O", "F", "P", "S", "Cl", "Br", "I"]
    z = [1, 6, 7, 8, 9, 15, 16, 17, 35, 53]
    fig, ax = plt.subplots(figsize=(6.8, 3.8))
    _bar(ax, atoms, z, fs.SERIES[mode][0], ink, "atomic number Z")
    ax.set_xlabel("first atom of the substituent (higher Z = higher priority)")
    fs.save(fig, OUT, "org1-cip-priorities", mode)
    plt.close(fig)


def fig_polarimeter(mode):
    """Polarimeter schematic: source, polariser, sample tube of path length
    l holding concentration c, the rotated plane, analyser - with the
    defining specific-rotation relation."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.6, 3.2))
    ax.plot([0.2, 9.6], [1.0, 1.0], color=fs.GUIDE[mode], linewidth=1,
            linestyle=(0, (4, 3)))
    for x, w, label in ((1.0, 0.28, "polariser"), (7.4, 0.28, "analyser")):
        ax.add_patch(plt.Rectangle((x, 0.35), w, 1.3, facecolor="none",
                                   edgecolor=c[0], linewidth=1.8))
        ax.annotate(label, (x + w / 2, 0.12), ha="center", fontsize=9,
                    color=ink)
    ax.add_patch(plt.Rectangle((3.0, 0.55), 3.4, 0.9, facecolor="none",
                               edgecolor=c[1], linewidth=1.8))
    ax.annotate("sample tube: path length l (dm), concentration c (g/mL)",
                (4.7, 0.30), ha="center", fontsize=8.5, color=ink)
    ax.annotate("source", (0.25, 1.15), fontsize=9, color=ink)
    for x0 in (1.6, 2.2, 2.7):
        ax.plot([x0, x0], [0.72, 1.28], color=c[0], linewidth=1.6)
    for x0 in (6.7, 7.0):
        ax.plot([x0 - 0.22, x0 + 0.22], [0.74, 1.26], color=c[2],
                linewidth=1.6)
    ax.annotate("plane rotated by the\nobserved angle alpha", (6.85, 1.78),
                ha="center", fontsize=9, color=c[2])
    ax.annotate("specific rotation:   [alpha] = alpha(observed) / (l x c)",
                (4.9, 2.45), ha="center", fontsize=10.5, color=ink)
    ax.set_xlim(0, 10)
    ax.set_ylim(-0.05, 2.8)
    ax.axis("off")
    fs.save(fig, OUT, "org1-polarimeter", mode)
    plt.close(fig)


def fig_ee_rotation(mode):
    """Observed rotation is LINEAR in enantiomeric excess:
    alpha(obs) = ee x [alpha](pure).  Computed line; the racemate sits at
    the origin and the pure enantiomers at the ends."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c = fs.SERIES[mode]
    ee = np.linspace(-100, 100, 400)
    alpha_pure = 13.5
    obs = ee / 100.0 * alpha_pure
    fig, ax = plt.subplots(figsize=(6.8, 4.0))
    ax.plot(ee, obs, color=c[0], linewidth=2)
    ax.axhline(0, color=fs.GUIDE[mode], linewidth=0.9)
    ax.axvline(0, color=fs.GUIDE[mode], linewidth=0.9)
    pts = ((100, "pure (+) enantiomer", -8, 8, "right"),
           (-100, "pure (-) enantiomer", 8, -18, "left"),
           (0, "racemate: zero rotation", 8, 10, "left"))
    for x, label, dx, dy, ha in pts:
        y = x / 100.0 * alpha_pure
        ax.plot([x], [y], "o", color=c[1], markersize=6)
        ax.annotate(label, (x, y), textcoords="offset points",
                    xytext=(dx, dy), ha=ha, fontsize=8.8, color=ink)
    ax.plot([50], [alpha_pure / 2], "o", color=c[2], markersize=6)
    ax.annotate("50% ee reads half\nthe pure rotation", (50, alpha_pure / 2),
                textcoords="offset points", xytext=(6, -26), fontsize=8.5,
                color=fs.GUIDE[mode])
    ax.set_xlabel("enantiomeric excess (%)")
    ax.set_ylabel("observed rotation (degrees, fixed l and c)")
    fs.save(fig, OUT, "org1-ee-rotation", mode)
    plt.close(fig)


def fig_chair_flip(mode):
    """Ring-flip energy profile: chair -> half-chair TS -> twist-boat ->
    boat TS -> twist-boat -> half-chair TS -> chair.  Levels are the
    standard published relative energies for cyclohexane conformers:
    chair 0, twist-boat ~23 kJ/mol, boat ~30 kJ/mol, half-chair TS
    ~45 kJ/mol (the ring-flip barrier)."""
    fs.apply(mode)
    ink = fs.INK[mode]
    import numpy as np
    x = np.linspace(0, 10, 800)
    knots_x = [0.0, 1.7, 3.1, 5.0, 6.9, 8.3, 10.0]
    knots_y = [0.0, 45.0, 23.0, 30.0, 23.0, 45.0, 0.0]
    y = np.interp(x, knots_x, knots_y)
    from scipy.ndimage import gaussian_filter1d  # type: ignore
    try:
        y = gaussian_filter1d(y, 18)
        y = y * (45.0 / y.max())
    except Exception:
        pass
    fig, ax = plt.subplots(figsize=(6.8, 4.2))
    ax.plot(x, y, color=fs.SERIES[mode][0], linewidth=2)
    labels = [
        (0.0, 0, "chair", -10),
        (1.7, 45, "half-chair TS\n~45 kJ/mol", 5),
        (3.1, 23, "twist-boat\n~23", -13),
        (5.0, 30, "boat TS\n~30", 5),
        (6.9, 23, "twist-boat", -11),
        (10.0, 0, "chair (flipped:\nax and eq exchanged)", 4),
    ]
    for lx, ly, text, dy in labels:
        ax.annotate(text, (lx, ly), textcoords="offset points",
                    xytext=(0, dy), ha="center", fontsize=8.5, color=ink)
    ax.set_ylim(-14, 58)
    ax.set_xticks([])
    ax.set_ylabel("relative energy (kJ/mol)")
    ax.set_xlabel("ring-flip coordinate")
    fs.save(fig, OUT, "org1-chair-flip", mode)
    plt.close(fig)


def fig_chair_axeq(mode):
    """Schematic cyclohexane chair with the six axial bonds drawn
    vertical (alternating up/down) and the six equatorial bonds angled
    outward - the geometry every substituted-cyclohexane argument uses."""
    fs.apply(mode)
    ink = fs.INK[mode]
    c_ax = fs.SERIES[mode][0]
    c_eq = fs.SERIES[mode][1]
    ring = [
        (0.0, 0.55), (1.0, 0.05), (2.15, 0.35),
        (2.75, 1.05), (1.75, 1.55), (0.60, 1.25),
    ]
    fig, ax = plt.subplots(figsize=(6.6, 4.4))
    for i in range(6):
        x0, y0 = ring[i]
        x1, y1 = ring[(i + 1) % 6]
        ax.plot([x0, x1], [y0, y1], color=ink, linewidth=2)
    up = [True, False, True, False, True, False]
    for i, (x0, y0) in enumerate(ring):
        dy = 0.62 if up[i] else -0.62
        ax.plot([x0, x0], [y0, y0 + dy], color=c_ax, linewidth=1.8)
        prev = ring[(i - 1) % 6]
        nxt = ring[(i + 1) % 6]
        ex, ey = (x0 - (nxt[0] - prev[0]) * 0.28,
                  y0 - (nxt[1] - prev[1]) * 0.28)
        sign = -1.0 if up[i] else 1.0
        ax.plot([x0, ex], [y0, ey + sign * 0.10], color=c_eq,
                linewidth=1.8, linestyle=(0, (5, 2)))
    ax.annotate("axial: parallel to the ring axis,\nalternating up / down",
                (2.9, 2.35), fontsize=9, color=c_ax, ha="center")
    ax.annotate("equatorial: angled outward\naround the belt (dashed)",
                (0.15, -0.75), fontsize=9, color=c_eq, ha="left")
    ax.set_xlim(-1.3, 4.2)
    ax.set_ylim(-1.3, 2.75)
    ax.axis("off")
    fs.save(fig, OUT, "org1-chair-axeq", mode)
    plt.close(fig)


def fig_ring_strain(mode):
    fs.apply(mode)
    ink = fs.INK[mode]
    sizes = ["3", "4", "5", "6", "7", "8"]
    strain = [115, 110, 26, 0, 26, 40]
    fig, ax = plt.subplots(figsize=(6.4, 4.0))
    _bar(ax, sizes, strain, fs.SERIES[mode][0], ink, "total ring strain (kJ/mol)")
    ax.set_xlabel("ring size (carbons)")
    ax.axhline(0, color=fs.GUIDE[mode], linewidth=0.8)
    fs.save(fig, OUT, "org1-ring-strain", mode)
    plt.close(fig)


ALL = [
    fig_fischer_convention,
    fig_fischer_dl,
    fig_resolution_scheme,
    fig_resolution_yields,
    fig_stereoisomer_map,
    fig_separability,
    fig_stereo_relationships,
    fig_cip_wheel,
    fig_cip_priorities,
    fig_polarimeter,
    fig_ee_rotation,
    fig_a_values,
    fig_axeq_populations,
    fig_ring_faces,
    fig_cistrans_chairs,
    fig_chair_flip,
    fig_chair_axeq,
    fig_alkane_bp, fig_c5_bpmp, fig_newman,
    fig_pka_ladder, fig_polar_effect, fig_arrow_grammar,
    fig_alkene_stability, fig_cation_ladder, fig_bde_chart,
    fig_catalysed, fig_kinetic_thermo, fig_aromatic_shortfall,
    fig_radical_chain, fig_ring_strain,
]

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for fn in ALL:
        for mode in ("light", "dark"):
            fn(mode)
        print(f"wrote {fn.__name__}")
    print(f"\n{len(ALL)} plots x 2 themes")
