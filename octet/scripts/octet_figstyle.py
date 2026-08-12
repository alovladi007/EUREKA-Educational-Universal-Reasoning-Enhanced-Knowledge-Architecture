#!/usr/bin/env python3
"""Shared plotting style for OCTET chapter figures.

Same discipline as the EUREKA course figures in eureka/scripts/ed_figstyle.py,
and deliberately the same validated hue slots so a learner moving between the
two platforms sees one visual language rather than two.

Every figure in this pipeline is DRAWN FROM THE STRUCTURE IT CLAIMS TO SHOW.
An orbital diagram is drawn from the orbital's geometry; a bar chart of pKa
shifts is drawn from the pKa values in the lesson's own table. Nothing is
traced or adapted from a book. That is the copyright boundary and it is also
why the figures can be trusted: they are computed from the same numbers the
prose states, so the two cannot drift apart.

Light and dark are SELECTED, not flipped. A chemistry figure is mostly line
work - bonds, lobes, arrows - so the ink colour is doing most of the work, and
inverting a light figure gives grey-on-black line art that is hard to read.
Each mode gets its own ink and its own fills.
"""
from __future__ import annotations

import pathlib
import re

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

# Validated categorical slots, per mode. Fixed order, never cycled past 3.
# These are the same steps ed_figstyle uses and they clear the all-pairs CVD
# and normal-vision checks in both modes.
SERIES = {
    "light": ["#2a78d6", "#eb6834", "#1baf7a"],
    "dark": ["#3987e5", "#d95926", "#199e70"],
}
# Ink. Bonds, atom labels and captions wear ink, never a series hue.
INK = {"light": "#0b0b0b", "dark": "#ffffff"}
INK_2 = {"light": "#52514e", "dark": "#c3c2b7"}
GRID = {"light": "#d9d8d4", "dark": "#3a3a37"}
GUIDE = {"light": "#8a8983", "dark": "#6f6e68"}

# Orbital lobe fills. Two signs of the wavefunction, drawn as filled and
# hollow rather than as two hues, because the sign is not an identity - it is
# a phase, and giving it a categorical colour invites the reading that the two
# lobes carry different charge. Filled and hollow says "same thing, opposite
# phase" more honestly than blue and orange would.
PHASE_POS = {"light": "#2a78d6", "dark": "#3987e5"}
PHASE_NEG = {"light": "#ffffff", "dark": "#14161a"}


def apply(mode: str) -> None:
    ink, ink2 = INK[mode], INK_2[mode]
    plt.rcParams.update(
        {
            "figure.dpi": 100,
            "figure.facecolor": "none",
            "axes.facecolor": "none",
            "savefig.facecolor": "none",
            "savefig.transparent": True,
            # Glyphs as paths, so a figure renders identically anywhere with no
            # font dependency. Chemistry labels are full of subscripts and
            # Greek and a font fallback would silently mangle them.
            "svg.fonttype": "path",
            "font.size": 11,
            "axes.titlesize": 12,
            "axes.titleweight": "semibold",
            "axes.titlecolor": ink,
            "axes.labelcolor": ink2,
            "axes.edgecolor": GRID[mode],
            "text.color": ink,
            "xtick.color": ink2,
            "ytick.color": ink2,
            "lines.linewidth": 1.9,
            "legend.frameon": False,
        }
    )


# matplotlib emits the figure background as `<g id="patch_1">` holding one
# full-canvas path, and writes it as style="fill: #ffffff" rather than as a
# fill= attribute. savefig.transparent normally suppresses it, but not on every
# path through the SVG backend - and when it survives into a dark figure the
# result is a solid white block, because the dark ink is also white.
#
# This is not a guess. It is the exact failure the FE EE circuit schematics hit,
# and the fix there was structural: remove the patch rather than test for a
# white fill, since testing the fill colour is what let the bug through the
# first time.
_PAGE_PATCH = re.compile(r'<g id="patch_1">.*?</g>\s*', re.DOTALL)


def save(fig, out_dir: pathlib.Path, stem: str, mode: str) -> pathlib.Path:
    """Write {stem}-{mode}.svg with the page patch removed."""
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{stem}-{mode}.svg"
    fig.savefig(path, format="svg", bbox_inches="tight", transparent=True)
    plt.close(fig)
    svg = path.read_text()
    svg = _PAGE_PATCH.sub("", svg, count=1)
    path.write_text(svg)
    return path
