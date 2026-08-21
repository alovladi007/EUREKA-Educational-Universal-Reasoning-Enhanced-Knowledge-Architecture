#!/usr/bin/env python3
"""Detect overlapping text in generated figures.

Gates and typecheckers cannot see a label collision - only a render can.  This
re-runs each figure function, measures every text artist's bounding box in
display coordinates, and reports pairs that overlap by more than a tolerance.

Caught cissp-bell-lapadula shipping with four mutually overlapping rule labels
that the depth gate passed cleanly.

Run:  python3 scripts/check_figure_overlaps.py <generator-module> [prefix]
"""
from __future__ import annotations

import importlib
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import matplotlib          # noqa: E402
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

# Ignore slivers: antialiasing and descenders make sub-pixel touches routine.
MIN_OVERLAP_PX = 6.0
MIN_OVERLAP_FRAC = 0.12


def boxes(fig):
    fig.canvas.draw()
    r = fig.canvas.get_renderer()
    out = []
    for ax in fig.axes:
        for t in ax.texts:
            s = t.get_text().strip()
            if not s:
                continue
            out.append((s, t.get_window_extent(renderer=r)))
    for t in fig.texts:
        s = t.get_text().strip()
        if s:
            out.append((s, t.get_window_extent(renderer=r)))
    return out


def overlap(a, b):
    dx = min(a.x1, b.x1) - max(a.x0, b.x0)
    dy = min(a.y1, b.y1) - max(a.y0, b.y0)
    if dx <= 0 or dy <= 0:
        return 0.0, 0.0
    area = dx * dy
    smaller = min(a.width * a.height, b.width * b.height) or 1.0
    return area, area / smaller


def main() -> int:
    module = sys.argv[1] if len(sys.argv) > 1 else "gen_cissp_figures"
    prefix = sys.argv[2] if len(sys.argv) > 2 else ""
    gen = importlib.import_module(module)

    bad = 0
    for name, fn in sorted(gen.REGISTRY.items()):
        if prefix and not name.startswith(prefix):
            continue
        for mode in ("light", "dark"):
            gen.S.apply(mode)
            fig = fn(mode)
            items = boxes(fig)
            hits = []
            for i in range(len(items)):
                for j in range(i + 1, len(items)):
                    (s1, b1), (s2, b2) = items[i], items[j]
                    area, frac = overlap(b1, b2)
                    if area >= MIN_OVERLAP_PX and frac >= MIN_OVERLAP_FRAC:
                        hits.append((frac, s1, s2))
            plt.close(fig)
            if hits:
                bad += 1
                print(f"OVERLAP  {name} [{mode}]")
                for frac, s1, s2 in sorted(hits, reverse=True)[:6]:
                    a = s1.replace("\n", " / ")[:44]
                    b = s2.replace("\n", " / ")[:44]
                    print(f"           {frac:5.0%}  {a!r}  <->  {b!r}")
    if bad:
        print(f"\nFAIL - {bad} figure/theme render(s) have overlapping text")
        return 1
    print("OK - no overlapping text in any figure, both themes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
