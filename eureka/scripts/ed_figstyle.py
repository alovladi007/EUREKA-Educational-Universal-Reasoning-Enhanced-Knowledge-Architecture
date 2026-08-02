#!/usr/bin/env python3
"""Shared plotting style for Electronic and Photonic Devices course figures.

WHY THIS FILE EXISTS

Every figure in this course is COMPUTED, in this repository, from equations
written out in the lesson that references it. Nothing is traced, scanned,
redrawn or adapted from a book. That is both an honesty property (the curve you
see is the equation the lesson states, so a reader can check it) and the
copyright boundary: figures in the reference works are protected expression,
formulas are not, and this pipeline only ever consumes formulas.

DESIGN RULES (from the house data-viz method)

- Categorical hues are assigned in fixed slot order and never cycled. The
  validated slots used here are blue, orange, aqua. THREE is the cap: the
  validator clears those three on the all-pairs list in BOTH light and dark
  (worst CVD dE 9.2 light / 9.4 dark, worst normal-vision dE 24.0 / 20.9).
  A fourth slot fails all-pairs in one mode or the other, and a scientific plot
  whose lines cross is an all-pairs situation, so four-series figures are split
  into small multiples instead of being given a fourth hue.
- Identity is never carried by colour alone: every series is DIRECT LABELLED at
  its end. That doubles as the relief the validator requires for light-mode
  aqua, which sits at 2.74:1 against the light surface. Because each line
  carries its own visible name, no separate legend box is drawn; the label IS
  the legend, and it is closer to the mark it names.
- One axis. Never a second y-scale. Where two quantities of different scale
  belong together they are drawn as stacked panels sharing an x-axis.
- Marks are thin (1.9pt lines, >=6pt markers), grid and spines are recessive,
  text wears ink colours rather than series colours.
- Light and dark are SELECTED, not flipped: each mode has its own hue steps and
  its own ink, both validated against their own surface.

Backgrounds are transparent so a figure sits on the page surface rather than on
a card of its own.
"""
from __future__ import annotations

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

# Validated categorical slots, per mode. Order is fixed; never cycle past 3.
SERIES = {
    "light": ["#2a78d6", "#eb6834", "#1baf7a"],
    "dark": ["#3987e5", "#d95926", "#199e70"],
}
# Ink. Text never wears a series colour.
INK = {"light": "#0b0b0b", "dark": "#ffffff"}
INK_2 = {"light": "#52514e", "dark": "#c3c2b7"}
# Recessive furniture.
GRID = {"light": "#d9d8d4", "dark": "#3a3a37"}
# Neutral emphasis mark (asymptotes, thresholds) - deliberately NOT a series hue.
GUIDE = {"light": "#8a8983", "dark": "#6f6e68"}

FIGSIZE = (7.2, 4.3)


def apply(mode: str) -> None:
    """Install the rc parameters for one mode."""
    ink, ink2, grid = INK[mode], INK_2[mode], GRID[mode]
    plt.rcParams.update(
        {
            "figure.figsize": FIGSIZE,
            "figure.dpi": 100,
            "figure.facecolor": "none",
            "axes.facecolor": "none",
            "savefig.facecolor": "none",
            "savefig.transparent": True,
            # Glyphs are emitted as paths so a figure renders identically
            # wherever it is opened, with no font dependency.
            "svg.fonttype": "path",
            "font.size": 11,
            "axes.titlesize": 12,
            "axes.labelsize": 11,
            "axes.titleweight": "semibold",
            "axes.edgecolor": grid,
            "axes.labelcolor": ink2,
            "axes.titlecolor": ink,
            "axes.linewidth": 1.0,
            "axes.grid": True,
            "axes.axisbelow": True,
            "grid.color": grid,
            "grid.linewidth": 0.7,
            "grid.alpha": 0.55,
            "xtick.color": ink2,
            "ytick.color": ink2,
            "xtick.labelsize": 9.5,
            "ytick.labelsize": 9.5,
            "xtick.direction": "out",
            "ytick.direction": "out",
            "lines.linewidth": 1.9,
            "lines.markersize": 6,
            "legend.frameon": False,
        }
    )


def strip(ax) -> None:
    """Recessive axes: drop the top and right spines."""
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)


def label_end(ax, x, y, text, colour, mode, dx=6, dy=0, ha="left", va="center", size=10):
    """Direct-label a series at its end, in the series colour.

    The label is the identity mechanism, so it is the one place a series hue is
    allowed on text. Everything else on the figure wears ink.
    """
    ax.annotate(
        text,
        xy=(x, y),
        xytext=(dx, dy),
        textcoords="offset points",
        color=colour,
        fontsize=size,
        fontweight="semibold",
        ha=ha,
        va=va,
        clip_on=False,
    )


def note(ax, x, y, text, mode, ha="left", va="bottom", size=9):
    """An annotation in ink, for asymptotes, regimes and constructions."""
    ax.annotate(
        text,
        xy=(x, y),
        color=INK_2[mode],
        fontsize=size,
        ha=ha,
        va=va,
        clip_on=False,
    )
