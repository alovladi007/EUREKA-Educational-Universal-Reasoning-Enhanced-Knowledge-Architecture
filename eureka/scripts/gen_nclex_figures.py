#!/usr/bin/env python3
"""NCLEX course figures — same contract as gen_fe_ee_figures.py.

Writes theme pairs:
    apps/web/public/courses/nclex/figures/<name>.svg        (light)
    apps/web/public/courses/nclex/figures/<name>.dark.svg   (dark)

The course reader swaps in the .dark.svg variant under the dark theme.

Data honesty: every curve and band below is drawn from standard published
clinical reference values (insulin onset/peak/duration ranges, laboratory
reference intervals, and withdrawal timelines as taught in standard nursing
references and the openly published NCSBN-aligned curricula). Where a figure
is schematic (shape of an activity curve), the caption in the lesson says so;
the NUMBERS (onsets, peaks, ranges, hours) are the published ones, and no
value is invented.

Run:  python3 scripts/gen_nclex_figures.py [prefix]
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    HERE.parent / "apps" / "web" / "public" / "courses" / "nclex" / "figures"
)

REGISTRY: dict = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Insulin action profiles (typical published onset / peak / duration, hours):
#   lispro/aspart: onset ~0.25, peak 1-2, duration 3-5
#   regular:       onset 0.5-1, peak 2-4, duration 5-8
#   NPH:           onset 1-2,   peak 4-12, duration 12-18
#   glargine:      onset 1-2,   no pronounced peak, ~24 h
# Curve shapes are schematic; the labelled times are the published values.
# ---------------------------------------------------------------------------

def _activity(t, onset, peak, dur):
    """Smooth schematic activity curve: 0 before onset, max at peak, 0 at dur."""
    y = np.zeros_like(t)
    rise = (t >= onset) & (t <= peak)
    fall = (t > peak) & (t <= dur)
    y[rise] = np.sin(np.pi / 2 * (t[rise] - onset) / max(peak - onset, 1e-6))
    y[fall] = np.cos(np.pi / 2 * (t[fall] - peak) / max(dur - peak, 1e-6))
    return np.clip(y, 0, None)


@figure("nclex-insulin-curves")
def _(mode):
    c = S.SERIES[mode]
    t = np.linspace(0, 26, 800)
    fig, ax = plt.subplots(figsize=(7.0, 4.0))
    curves = [
        ("rapid (lispro/aspart)", 0.25, 1.5, 4.5, c[0]),
        ("regular", 0.75, 3.0, 7.0, c[1]),
        ("NPH", 1.5, 8.0, 16.0, c[2]),
    ]
    for label, onset, peak, dur, colour in curves:
        y = _activity(t, onset, peak, dur)
        ax.plot(t, y, color=colour, linewidth=2)
        S.label_end(ax, peak, 1.02, label, colour, mode, ha="center", dy=2)
    # glargine: flat basal plateau, no pronounced peak
    y_gl = np.clip(np.minimum((t - 1.5) / 2.0, 1.0), 0, None) * 0.45
    y_gl[t > 24] *= np.clip(1 - (t[t > 24] - 24) / 2.0, 0, 1)
    gl_colour = c[3] if len(c) > 3 else S.GUIDE[mode]
    ax.plot(t, y_gl, color=gl_colour, linewidth=2)
    S.label_end(ax, 14, 0.49, "glargine (peakless basal)", gl_colour, mode,
                ha="center", dy=2)
    ax.axvspan(4, 12, color=S.GRID[mode], alpha=0.35, zorder=0)
    S.note(ax, 8, 0.02,
           "NPH peak window 4-12 h:\nthe 3 AM hypoglycemia stem",
           mode, ha="center")
    ax.set_xlabel("hours after subcutaneous injection")
    ax.set_ylabel("relative glucose-lowering activity")
    ax.set_xlim(0, 26)
    ax.set_ylim(0, 1.14)
    ax.set_yticks([])
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Serum electrolyte reference intervals (standard adult reference ranges as
# taught in NCLEX-aligned nursing references):
#   Na 135-145 mEq/L · K 3.5-5.0 mEq/L · Cl 98-106 mEq/L
#   Ca 9.0-10.5 mg/dL · Mg 1.8-2.6 mg/dL · Phosphorus 3.0-4.5 mg/dL
# Each row is drawn on its own axis scale (units differ); the bar spans the
# reference interval with the numbers printed at the ends.
# ---------------------------------------------------------------------------

@figure("nclex-electrolyte-ranges")
def _(mode):
    ink, ink2 = S.INK[mode], S.INK_2[mode]
    c = S.SERIES[mode]
    rows = [
        ("Sodium (Na+)", 135, 145, "mEq/L", 125, 155),
        ("Potassium (K+)", 3.5, 5.0, "mEq/L", 2.5, 6.5),
        ("Chloride (Cl-)", 98, 106, "mEq/L", 90, 114),
        ("Calcium (Ca2+)", 9.0, 10.5, "mg/dL", 7.5, 12.0),
        ("Magnesium (Mg2+)", 1.8, 2.6, "mg/dL", 1.0, 3.4),
        ("Phosphorus", 3.0, 4.5, "mg/dL", 2.0, 5.5),
    ]
    fig, ax = plt.subplots(figsize=(7.0, 3.6))
    for i, (name, lo, hi, unit, axlo, axhi) in enumerate(rows):
        y = len(rows) - 1 - i
        frac = lambda v: (v - axlo) / (axhi - axlo)  # noqa: E731
        ax.plot([0, 1], [y, y], color=S.GRID[mode], linewidth=5,
                solid_capstyle="round", zorder=1)
        ax.plot([frac(lo), frac(hi)], [y, y], color=c[i % len(c)],
                linewidth=9, solid_capstyle="round", zorder=2)
        ax.annotate(f"{lo:g}", (frac(lo), y), textcoords="offset points",
                    xytext=(0, 8), ha="center", fontsize=9, color=ink)
        ax.annotate(f"{hi:g}", (frac(hi), y), textcoords="offset points",
                    xytext=(0, 8), ha="center", fontsize=9, color=ink)
        ax.annotate(f"{name}  ({unit})", (-0.02, y), ha="right",
                    va="center", fontsize=10, color=ink)
    ax.set_xlim(-0.42, 1.04)
    ax.set_ylim(-0.7, len(rows) - 0.1)
    ax.axis("off")
    S.note(ax, 0.5, -0.65,
           "bars span the adult reference interval; each row uses its own scale",
           mode, ha="center")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Alcohol withdrawal timeline (standard teaching values):
#   6-24 h  early: tremor, anxiety, diaphoresis, tachycardia, hypertension
#   24-48 h peak seizure risk
#   48-72 h delirium tremens: disorientation, hallucinations, autonomic storm
# ---------------------------------------------------------------------------

@figure("nclex-etoh-withdrawal-timeline")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.0, 2.9))
    bands = [
        (6, 24, "early withdrawal\ntremor, autonomic signs", c[0], 2),
        (24, 48, "peak seizure risk", c[1], 1),
        (48, 72, "delirium tremens\nhighest mortality window", c[2], 0),
    ]
    for lo, hi, label, colour, y in bands:
        ax.barh(y, hi - lo, left=lo, height=0.62, color=colour,
                edgecolor="none", alpha=0.85)
        ax.annotate(label, ((lo + hi) / 2, y), ha="center", va="center",
                    fontsize=9.5, color=S.INK["light"])
    ax.axvline(0, color=S.GUIDE[mode], linewidth=1)
    ax.annotate("last drink", (0, 2.72), ha="center", fontsize=9.5, color=ink)
    ax.set_xlim(-6, 80)
    ax.set_ylim(-0.6, 3.0)
    ax.set_yticks([])
    ax.set_xticks([0, 6, 24, 48, 72])
    ax.set_xlabel("hours after the last drink")
    S.strip(ax)
    S.note(ax, 76, 2.4,
           "management: benzodiazepines by symptom scale,\nthiamine before glucose, seizure precautions",
           mode, ha="right")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Fetal heart rate decelerations vs contractions (VEAL CHOP teaching pattern):
#   early decel  = mirror of contraction (head compression) - benign
#   late decel   = begins after contraction peak (uteroplacental
#                  insufficiency) - intervene
#   variable     = abrupt V-shape, any timing (cord compression) - reposition
# Schematic tracing; timing relationships are the standard definitions.
# ---------------------------------------------------------------------------

@figure("nclex-fhr-decels")
def _(mode):
    ink2 = S.INK_2[mode]
    c = S.SERIES[mode]
    t = np.linspace(0, 10, 600)
    contraction = np.exp(-((t - 5) ** 2) / 2.2)

    def panel(ax, decel, title, colour, note):
        ax.plot(t, 1.6 + 0.5 * decel, color=colour, linewidth=2)
        ax.plot(t, contraction * 0.9, color=ink2, linewidth=1.6,
                linestyle=(0, (4, 2)))
        ax.set_title(title, fontsize=10.5)
        ax.set_ylim(-0.15, 2.35)
        ax.set_xticks([])
        ax.set_yticks([])
        S.note(ax, 5, -0.1, note, mode, ha="center")
        S.strip(ax)

    fig, axes = plt.subplots(1, 3, figsize=(9.6, 3.0))
    early = -np.exp(-((t - 5) ** 2) / 2.2)
    late = -np.exp(-((t - 6.8) ** 2) / 2.2)
    vshape = np.where(np.abs(t - 4.2) < 0.9, -(1 - np.abs(t - 4.2) / 0.9), 0)
    panel(axes[0], early, "EARLY - mirrors contraction",
          c[0], "head compression - benign, monitor")
    panel(axes[1], late, "LATE - begins after peak",
          c[1], "uteroplacental insufficiency -\nreposition, O2, stop oxytocin")
    panel(axes[2], vshape, "VARIABLE - abrupt V, any timing",
          c[2], "cord compression - reposition first")
    axes[0].set_ylabel("FHR (top) / contraction (dashed)", fontsize=9)
    fig.tight_layout()
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
