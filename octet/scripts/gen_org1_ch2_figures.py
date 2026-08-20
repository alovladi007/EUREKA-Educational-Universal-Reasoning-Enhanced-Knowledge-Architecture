#!/usr/bin/env python3
"""Figure for ORG1 chapter 2, Alkanes: the butane torsional profile.

Drawn from the values the lesson's table states - anti 0, gauche 3.8,
CH3/H eclipsed 16, syn 19 kJ/mol - as a truncated Fourier series in the
dihedral angle, which is the standard functional form for a torsional
potential. Computed, not traced.

Run:  python3 scripts/gen_org1_ch2_figures.py
Out:  apps/web/public/figures/octet/org1-butane-torsion-{light,dark}.svg
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

# The stationary points the prose and table assert (kJ/mol relative to anti).
E_SYN = 19.0       # 0 deg, CH3 eclipsing CH3
E_GAUCHE = 3.8     # 60 deg
E_ECL_MH = 16.0    # 120 deg, CH3 eclipsing H
E_ANTI = 0.0       # 180 deg


def torsional_energy(theta_deg: np.ndarray) -> np.ndarray:
    """Fourier fit V(t) = sum a_n cos(n t) hitting the four stationary points.

    With cosine terms n = 0..3 the four conditions determine the four
    coefficients exactly (angles measured as CH3-C-C-CH3 dihedral, 0 = syn):
      V(0)   = a0 + a1 + a2 + a3          = E_SYN
      V(60)  = a0 + a1/2 - a2/2 - a3      = E_GAUCHE
      V(120) = a0 - a1/2 - a2/2 + a3      = E_ECL_MH
      V(180) = a0 - a1 + a2 - a3          = E_ANTI
    """
    A = np.array([
        [1.0, 1.0, 1.0, 1.0],
        [1.0, 0.5, -0.5, -1.0],
        [1.0, -0.5, -0.5, 1.0],
        [1.0, -1.0, 1.0, -1.0],
    ])
    b = np.array([E_SYN, E_GAUCHE, E_ECL_MH, E_ANTI])
    a = np.linalg.solve(A, b)
    t = np.radians(theta_deg)
    return a[0] + a[1] * np.cos(t) + a[2] * np.cos(2 * t) + a[3] * np.cos(3 * t)


def draw(mode: str) -> None:
    fs.apply(mode)
    ink, ink2 = fs.INK[mode], fs.INK_2[mode]
    line = fs.SERIES[mode][0]

    theta = np.linspace(0.0, 360.0, 721)
    energy = torsional_energy(theta)

    fig, ax = plt.subplots(figsize=(7.0, 4.2))
    ax.plot(theta, energy, color=line, linewidth=2.2, zorder=3)

    # Mark and label the stationary points the lesson names.
    marks = [
        (0, E_SYN, "syn"),
        (60, E_GAUCHE, "gauche"),
        (120, E_ECL_MH, "eclipsed\nCH$_3$/H"),
        (180, E_ANTI, "anti"),
        (240, E_ECL_MH, ""),
        (300, E_GAUCHE, ""),
        (360, E_SYN, ""),
    ]
    for x, y, label in marks:
        ax.plot([x], [y], marker="o", markersize=6, color=line,
                markeredgecolor=ink, markeredgewidth=0.8, zorder=4)
        if label:
            above = y < 10
            ax.annotate(
                label, (x, y),
                textcoords="offset points",
                xytext=(0, 10 if above else -14),
                ha="center",
                va="bottom" if above else "top",
                fontsize=10, color=ink,
            )

    # Energy gaps, annotated once each on the left half.
    ax.annotate(
        "3.8", (60, E_GAUCHE / 2), textcoords="offset points", xytext=(14, 0),
        ha="left", va="center", fontsize=9, color=ink2,
    )
    ax.vlines(60, 0, E_GAUCHE, color=fs.GUIDE[mode], linewidth=1.0,
              linestyle=(0, (3, 3)), zorder=2)

    ax.set_xlim(0, 360)
    ax.set_ylim(-2.5, 23)
    ax.set_xticks([0, 60, 120, 180, 240, 300, 360])
    ax.set_xlabel("CH$_3$-C-C-CH$_3$ dihedral angle (degrees)")
    ax.set_ylabel("relative energy (kJ/mol)")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", color=fs.GRID[mode], linewidth=0.7, zorder=1)

    fs.save(fig, OUT, "org1-butane-torsion", mode)
    plt.close(fig)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for mode in ("light", "dark"):
        draw(mode)
    print("wrote org1-butane-torsion-{light,dark}.svg")
