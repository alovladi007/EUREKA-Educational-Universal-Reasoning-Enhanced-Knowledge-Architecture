#!/usr/bin/env python3
"""Figure for ORG1 chapter 4: the two-step HX-addition energy diagram.

Drawn from the mechanism the lesson states: a high first barrier
(rate-determining protonation) up to the carbocation valley, a low
second barrier (halide capture), products below reactants. The curve
is a smooth piecewise construction through those stationary points -
computed, not traced.

Run:  python3 scripts/gen_org1_ch4_figures.py
Out:  apps/web/public/figures/octet/org1-hx-energy-diagram-{light,dark}.svg
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import matplotlib.pyplot as plt  # noqa: E402

import octet_figstyle as fs  # noqa: E402

OUT = HERE.parent / "apps" / "web" / "public" / "figures" / "octet"

# Stationary points on arbitrary energy units chosen to display the
# mechanism's ordering: TS1 highest (rate-determining), intermediate in a
# real valley, TS2 low, products below reactants (addition is exothermic).
POINTS = [
    (0.0, 0.0),    # reactants
    (1.0, 6.0),    # TS1 (rate-determining)
    (2.0, 3.2),    # carbocation intermediate
    (3.0, 4.4),    # TS2
    (4.0, -2.0),   # products
]


def smooth_through(points, n=600):
    """Cosine-eased interpolation through alternating minima/maxima.

    Between each adjacent pair the curve follows a half-cosine, which
    guarantees zero slope at every stationary point - the defining
    property of minima and transition states on the diagram.
    """
    xs, ys = [], []
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        t = np.linspace(0.0, 1.0, n // (len(points) - 1))
        ease = (1 - np.cos(np.pi * t)) / 2
        xs.append(x0 + (x1 - x0) * t)
        ys.append(y0 + (y1 - y0) * ease)
    return np.concatenate(xs), np.concatenate(ys)


def draw(mode: str) -> None:
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    line = fs.SERIES[mode][0]

    x, y = smooth_through(POINTS)

    fig, ax = plt.subplots(figsize=(7.0, 4.4))
    ax.plot(x, y, color=line, linewidth=2.4, zorder=3)

    labels = [
        (0.0, 0.0, "alkene + HX", "below"),
        (1.0, 6.0, "TS1\n(rate-determining)", "above"),
        (2.0, 3.2, "carbocation\n+ X$^-$", "below"),
        (3.0, 4.4, "TS2", "above"),
        (4.0, -2.0, "alkyl halide", "below"),
    ]
    for px, py, text, side in labels:
        ax.plot([px], [py], marker="o", markersize=5.5, color=line,
                markeredgecolor=ink, markeredgewidth=0.8, zorder=4)
        ax.annotate(
            text, (px, py), textcoords="offset points",
            xytext=(0, 11 if side == "above" else -13),
            ha="center", va="bottom" if side == "above" else "top",
            fontsize=9.5, color=ink,
        )

    # Activation energy of the first (rate-determining) step.
    ax.annotate(
        "", xy=(0.55, 6.0), xytext=(0.55, 0.0),
        arrowprops=dict(arrowstyle="<->", color=ink2, linewidth=1.1),
    )
    ax.annotate("$E_a$ (step 1)", (0.55, 3.0), textcoords="offset points",
                xytext=(-8, 0), ha="right", va="center",
                fontsize=9, color=ink2)

    # Overall free-energy change.
    ax.hlines(0.0, 3.6, 4.35, color=fs.GUIDE[mode], linewidth=1.0,
              linestyle=(0, (3, 3)))
    ax.annotate(
        "", xy=(4.25, -2.0), xytext=(4.25, 0.0),
        arrowprops=dict(arrowstyle="<->", color=ink2, linewidth=1.1),
    )
    ax.annotate("$\\Delta G$", (4.25, -1.0), textcoords="offset points",
                xytext=(7, 0), ha="left", va="center",
                fontsize=9, color=ink2)

    ax.set_xlim(-0.35, 4.75)
    ax.set_ylim(-4.2, 8.2)
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_xlabel("reaction coordinate")
    ax.set_ylabel("free energy")
    ax.spines[["top", "right"]].set_visible(False)

    fs.save(fig, OUT, "org1-hx-energy-diagram", mode)
    plt.close(fig)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for mode in ("light", "dark"):
        draw(mode)
    print("wrote org1-hx-energy-diagram-{light,dark}.svg")
