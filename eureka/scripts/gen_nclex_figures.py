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



# ---------------------------------------------------------------------------
# Prioritization decision cascade (teaching framework, schematic):
# ABC -> unstable-vs-stable -> acute-vs-chronic -> Maslow. The framework order
# is the standard NCLEX teaching sequence; no clinical data is plotted.
# ---------------------------------------------------------------------------

@figure("nclex-priority-cascade")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.0, 4.6))
    boxes = [
        (3.2, "1  Worst ABC wins", "actual airway compromise > breathing > circulation\n(actual beats potential at every rung)", c[0]),
        (2.4, "2  Unstable beats stable", "new, changing, unexpected findings > chronic, known, expected", c[1]),
        (1.6, "3  Acute beats chronic", "unexpected-for-the-condition > expected-for-the-condition", c[2]),
        (0.8, "4  Maslow, then least restrictive", "physiologic > safety > psychosocial - only once nothing above fires", c[3] if len(c) > 3 else c[0]),
    ]
    for y, head, body, colour in boxes:
        ax.add_patch(plt.Rectangle((0.6, y - 0.06), 8.8, 0.62, facecolor="none",
                                   edgecolor=colour, linewidth=1.8))
        ax.annotate(head, (0.85, y + 0.38), fontsize=11, color=ink,
                    fontweight="bold", va="center")
        ax.annotate(body, (0.85, y + 0.1), fontsize=9, color=S.INK_2[mode],
                    va="center")
        if y > 0.8:
            ax.annotate("", (5.0, y - 0.1), (5.0, y - 0.24),
                        arrowprops=dict(arrowstyle="<-", color=S.GUIDE[mode],
                                        linewidth=1.4))
    ax.annotate("apply in order - stop at the first rung that separates the clients",
                (5.0, 0.35), ha="center", fontsize=9, color=S.INK_2[mode],
                style="italic")
    ax.set_xlim(0, 10)
    ax.set_ylim(0.1, 4.1)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# PPE donning / doffing order (CDC published sequence):
#   Don:  gown -> mask/respirator -> goggles/face shield -> gloves
#   Doff: gloves -> goggles/face shield -> gown -> mask/respirator
# Hand hygiene before donning, after doffing, and any time hands are soiled.
# ---------------------------------------------------------------------------

@figure("nclex-ppe-sequence")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.4, 3.0))
    don = ["gown", "mask /\nrespirator", "goggles /\nface shield", "gloves"]
    doff = ["gloves", "goggles /\nface shield", "gown", "mask /\nrespirator"]
    for row, (label, seq, colour) in enumerate(
            (("DON (before entry)", don, c[0]), ("DOFF (at the door)", doff, c[1]))):
        y = 1.4 - row * 1.15
        ax.annotate(label, (0.0, y + 0.32), fontsize=10, color=ink,
                    fontweight="bold")
        for i, step in enumerate(seq):
            x = 0.4 + i * 2.35
            ax.add_patch(plt.Rectangle((x, y - 0.42), 1.85, 0.8,
                                       facecolor="none", edgecolor=colour,
                                       linewidth=1.8))
            ax.annotate(f"{i+1}", (x + 0.16, y + 0.2), fontsize=11,
                        color=colour, fontweight="bold")
            ax.annotate(step, (x + 0.98, y - 0.05), fontsize=9, color=ink,
                        ha="center", va="center")
            if i < 3:
                ax.annotate("", (x + 2.32, y - 0.02), (x + 1.88, y - 0.02),
                            arrowprops=dict(arrowstyle="<-",
                                            color=S.GUIDE[mode], linewidth=1.3))
    S.note(ax, 5.05, -0.62,
           "hand hygiene before donning, after doffing, and whenever hands are contaminated;\nrespirator seal-check each don - remove it OUTSIDE the room for airborne precautions",
           mode, ha="center")
    ax.set_xlim(-0.1, 10.1)
    ax.set_ylim(-0.9, 2.0)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# ABG interpretation map (standard adult reference values):
#   pH 7.35-7.45 - PaCO2 35-45 mm Hg - HCO3- 22-26 mEq/L
# The 2x2 grid is the standard teaching matrix; example causes are the
# classic ones taught with it.
# ---------------------------------------------------------------------------

@figure("nclex-abg-map")
def _(mode):
    ink = S.INK[mode]
    ink2 = S.INK_2[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    cells = [
        (0, 1, "RESPIRATORY ACIDOSIS", "pH < 7.35 - PaCO2 > 45",
         "hypoventilation: COPD crisis, opioid\noverdose, hypoventilation, airway obstruction", c[0]),
        (1, 1, "RESPIRATORY ALKALOSIS", "pH > 7.45 - PaCO2 < 35",
         "hyperventilation: anxiety, pain,\nearly salicylate toxicity, hypoxia", c[1]),
        (0, 0, "METABOLIC ACIDOSIS", "pH < 7.35 - HCO3- < 22",
         "DKA, renal failure, lactic acidosis,\nsevere diarrhea (base loss)", c[2]),
        (1, 0, "METABOLIC ALKALOSIS", "pH > 7.45 - HCO3- > 26",
         "vomiting, NG suction (acid loss),\nexcess antacids, loop diuretics", c[3] if len(c) > 3 else c[0]),
    ]
    for col, row, head, values, causes, colour in cells:
        x, y = 0.35 + col * 4.85, 0.3 + row * 1.95
        ax.add_patch(plt.Rectangle((x, y), 4.55, 1.7, facecolor="none",
                                   edgecolor=colour, linewidth=1.8))
        ax.annotate(head, (x + 0.18, y + 1.4), fontsize=10.5, color=colour,
                    fontweight="bold")
        ax.annotate(values, (x + 0.18, y + 1.08), fontsize=9.5, color=ink)
        ax.annotate(causes, (x + 0.18, y + 0.52), fontsize=8.8, color=ink2)
    ax.annotate("normal: pH 7.35-7.45  -  PaCO2 35-45 mm Hg  -  HCO3- 22-26 mEq/L",
                (5.15, 0.06), ha="center", fontsize=9.5, color=ink)
    ax.annotate("same direction (pH and HCO3-) = metabolic - opposite (pH vs PaCO2) = respiratory (ROME)",
                (5.15, 4.22), ha="center", fontsize=9, color=ink2, style="italic")
    ax.set_xlim(0, 10.3)
    ax.set_ylim(-0.15, 4.45)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# One ECG cardiac cycle with the tested intervals (standard values):
#   PR 0.12-0.20 s - QRS < 0.12 s - QT (rate-corrected) < ~0.44 s
# Waveform is schematic (gaussian components); the labelled interval numbers
# are the published normals every reference teaches.
# ---------------------------------------------------------------------------

@figure("nclex-ecg-intervals")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    t = np.linspace(0, 0.8, 1200)

    def g(center, width, amp):
        return amp * np.exp(-((t - center) ** 2) / (2 * width ** 2))

    ecg = (g(0.16, 0.022, 0.18)          # P
           - g(0.285, 0.008, 0.12)       # Q
           + g(0.30, 0.010, 1.0)         # R
           - g(0.318, 0.009, 0.22)       # S
           + g(0.52, 0.040, 0.30))       # T
    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    ax.plot(t, ecg, color=c[0], linewidth=2)
    for x, label, dy in ((0.16, "P", 0.24), (0.30, "R", 1.06),
                         (0.52, "T", 0.36)):
        ax.annotate(label, (x, dy), ha="center", fontsize=10.5, color=ink)
    ax.annotate("Q", (0.278, -0.22), ha="center", fontsize=9, color=ink)
    ax.annotate("S", (0.325, -0.32), ha="center", fontsize=9, color=ink)

    def bracket(x0, x1, y, label, colour):
        ax.annotate("", (x0, y), (x1, y),
                    arrowprops=dict(arrowstyle="|-|,widthA=0.25,widthB=0.25",
                                    color=colour, linewidth=1.6))
        ax.annotate(label, ((x0 + x1) / 2, y - 0.17), ha="center",
                    fontsize=9.3, color=colour)

    bracket(0.12, 0.28, -0.52, "PR 0.12-0.20 s", c[1])
    bracket(0.28, 0.335, -0.88, "QRS < 0.12 s", c[2])
    bracket(0.28, 0.60, -1.24, "QT (corrected) < ~0.44 s",
            c[3] if len(c) > 3 else c[0])
    ax.set_xlim(0, 0.8)
    ax.set_ylim(-1.5, 1.25)
    ax.set_yticks([])
    ax.set_xlabel("seconds (1 small ECG box = 0.04 s, 1 large box = 0.20 s)")
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Peak and trough sampling around repeated IV doses (schematic concentration
# curve; the sampling rules - peak 30 min after infusion ends, trough drawn
# just BEFORE the next dose - are the standard taught values).
# ---------------------------------------------------------------------------

@figure("nclex-peak-trough")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 3.4))
    t = np.linspace(0, 32, 1600)
    conc = np.zeros_like(t)
    for dose_t in (0, 8, 16, 24):
        dt = t - dose_t
        m = dt >= 0
        conc[m] += 1.35 * (np.exp(-dt[m] / 6.0) - np.exp(-dt[m] / 0.6))
    ax.plot(t, conc, color=c[0], linewidth=2)
    peaks_t = t[np.argmax(np.where((t > 24) & (t < 28), conc, -1))]
    ax.plot([peaks_t], [conc.max()], "o", color=c[1], markersize=7)
    ax.annotate("PEAK - draw ~30 min\nafter the infusion ends", (peaks_t, conc.max() + 0.06),
                ha="center", fontsize=9.3, color=c[1])
    trough_i = np.argmin(np.abs(t - 23.9))
    ax.plot([t[trough_i]], [conc[trough_i]], "o", color=c[2], markersize=7)
    ax.annotate("TROUGH - draw just\nBEFORE the next dose", (23.6, conc[trough_i] - 0.34),
                ha="center", fontsize=9.3, color=c[2])
    for dose_t in (0, 8, 16, 24):
        ax.axvline(dose_t, color=S.GRID[mode], linewidth=1)
        ax.annotate("dose", (dose_t, -0.12), ha="center", fontsize=8.5,
                    color=S.INK_2[mode])
    ax.set_xlim(-1, 32)
    ax.set_ylim(-0.2, 1.75)
    ax.set_yticks([])
    ax.set_xlabel("hours (q8h IV dosing - schematic serum level)")
    ax.set_ylabel("serum drug level")
    S.strip(ax)
    S.note(ax, 1.2, 1.6, "hold the dose and call if the TROUGH is high -\nthe drug is accumulating (renal clearance falling)", mode, ha="left")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Fundal height by gestational age (McDonald's rule as taught): from about
# 20 to 36 weeks the fundal height in cm approximates the weeks of
# gestation, +/- 2 cm.  Landmarks: ~12 weeks at the symphysis, ~20 weeks at
# the umbilicus, ~36 weeks at the xiphoid, then dropping with lightening.
# ---------------------------------------------------------------------------

@figure("nclex-fundal-height")
def _(mode):
    ink, ink2 = S.INK[mode], S.INK_2[mode]
    c = S.SERIES[mode]
    wk = np.linspace(20, 36, 200)
    fig, ax = plt.subplots(figsize=(7.0, 4.0))
    ax.fill_between(wk, wk - 2, wk + 2, color=S.GRID[mode], alpha=0.5)
    ax.plot(wk, wk, color=c[0], linewidth=2)
    ax.plot([36, 40], [36, 34.5], color=c[0], linewidth=2,
            linestyle=(0, (4, 2)))
    marks = [
        (12, 0.5, "12 wk: at the symphysis"),
        (20, 20, "20 wk: at the umbilicus"),
        (36, 36, "36 wk: at the xiphoid"),
        (40, 34.5, "term: drops with lightening"),
    ]
    for x, y, label in marks:
        ax.plot([x], [y], "o", color=c[1], markersize=6)
        ax.annotate(label, (x, y), textcoords="offset points",
                    xytext=(-8, 10), ha="right", fontsize=8.6, color=ink)
    S.note(ax, 21, 34,
           "fundal height (cm) approximates weeks from 20-36 wk, +/- 2 cm;\nlarger suggests multiples, polyhydramnios or LGA - smaller suggests IUGR",
           mode, ha="left")
    ax.set_xlabel("weeks of gestation")
    ax.set_ylabel("fundal height (cm above symphysis)")
    ax.set_xlim(10, 42)
    ax.set_ylim(-1, 40)
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Labor: cervical dilation against time.  Current definitions - latent phase
# to 6 cm (slow and highly variable), active phase 6-10 cm with progress
# expected at roughly 1 cm/h or more, then the second stage (pushing).
# Curve shape is schematic; the phase boundaries and rates are the published
# teaching values.
# ---------------------------------------------------------------------------

@figure("nclex-labor-curve")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    t_lat = np.linspace(0, 8, 200)
    d_lat = 1 + 5 * (t_lat / 8) ** 1.9
    t_act = np.linspace(8, 12, 120)
    d_act = 6 + (t_act - 8) * 1.0
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    ax.axvspan(0, 8, color=S.GRID[mode], alpha=0.45)
    ax.plot(t_lat, d_lat, color=c[0], linewidth=2)
    ax.plot(t_act, d_act, color=c[1], linewidth=2)
    ax.axhline(6, color=S.GUIDE[mode], linewidth=1, linestyle=(0, (4, 3)))
    ax.annotate("LATENT phase (to 6 cm)\nslow, variable, may last many hours",
                (4.0, 2.2), ha="center", fontsize=9, color=ink)
    ax.annotate("ACTIVE phase (6-10 cm)\nexpect about 1 cm/h or more",
                (10.2, 7.0), ha="center", fontsize=9, color=ink)
    ax.annotate("6 cm: the active-phase threshold", (0.2, 6.25),
                fontsize=8.6, color=S.INK_2[mode])
    ax.plot([12], [10], "o", color=c[2], markersize=7)
    ax.annotate("10 cm - complete;\nsecond stage (pushing) begins", (12, 10),
                textcoords="offset points", xytext=(-10, -6), ha="right",
                fontsize=8.8, color=c[2])
    ax.set_xlabel("hours in labor (schematic)")
    ax.set_ylabel("cervical dilation (cm)")
    ax.set_xlim(0, 13.5)
    ax.set_ylim(0, 11.4)
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Postpartum fundal involution: the fundus is at the umbilicus within hours
# of birth, then descends about one fingerbreadth (about 1 cm) per day, and
# is no longer palpable abdominally by about day 10.
# ---------------------------------------------------------------------------

@figure("nclex-postpartum-fundus")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    days = np.arange(0, 11)
    below = days.astype(float)
    fig, ax = plt.subplots(figsize=(7.0, 3.8))
    ax.axhline(0, color=S.GUIDE[mode], linewidth=1.4)
    ax.annotate("umbilicus", (-0.35, 0.25), fontsize=9, color=ink)
    ax.plot(days, -below, color=c[0], linewidth=2, marker="o", markersize=5)
    ax.annotate("day 0-1: at or just below\nthe umbilicus, FIRM and midline",
                (0.2, -1.6), fontsize=8.8, color=ink)
    ax.annotate("about 1 fingerbreadth (1 cm) lower each day",
                (4.6, -4.2), ha="center", fontsize=9, color=c[1])
    ax.annotate("by ~day 10: no longer\npalpable abdominally", (10, -10),
                textcoords="offset points", xytext=(-8, 12), ha="right",
                fontsize=8.8, color=ink)
    S.note(ax, 0.0, -11.6,
           "BOGGY = massage first - DEVIATED RIGHT = full bladder, void or catheterise, then reassess",
           mode, ha="left")
    ax.set_xlabel("postpartum day")
    ax.set_ylabel("fingerbreadths below the umbilicus")
    ax.set_xlim(-0.6, 10.8)
    ax.set_ylim(-12.4, 1.6)
    ax.set_yticks([0, -2, -4, -6, -8, -10])
    ax.set_yticklabels(["0", "2", "4", "6", "8", "10"])
    S.strip(ax)
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Magnesium sulfate: therapeutic window and the toxicity ladder, as taught
# for obstetric infusions (serum magnesium, mg/dL).  Therapeutic roughly
# 4-7; loss of deep tendon reflexes is the EARLIEST toxicity sign, then
# respiratory depression, then cardiac effects.  Institutional protocols
# govern exact numbers; the ladder's ORDER is the tested content.
# ---------------------------------------------------------------------------

@figure("nclex-mag-toxicity")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    bands = [
        (1.8, 3.0, "normal serum magnesium", S.GRID[mode]),
        (4.0, 7.0, "THERAPEUTIC for seizure prophylaxis", c[0]),
        (8.0, 12.0, "deep tendon reflexes LOST - earliest toxicity sign", c[1]),
        (12.0, 15.0, "respiratory depression - rate under 12", c[2]),
        (15.0, 25.0, "cardiac conduction changes, arrest at the top", c[3] if len(c) > 3 else c[0]),
    ]
    fig, ax = plt.subplots(figsize=(7.4, 3.6))
    for i, (lo, hi, label, colour) in enumerate(bands):
        ax.barh(0, hi - lo, left=lo, height=0.55, color=colour,
                edgecolor="none", alpha=0.9)
        y = 0.45 + (i % 2) * 0.34
        ax.annotate(label, ((lo + hi) / 2, y), ha="center", fontsize=8.6,
                    color=ink)
        ax.plot([(lo + hi) / 2, (lo + hi) / 2], [0.30, y - 0.06],
                color=S.GUIDE[mode], linewidth=0.8)
    ax.set_xlim(0, 26)
    ax.set_ylim(-0.9, 1.35)
    ax.set_yticks([])
    ax.set_xlabel("serum magnesium (mg/dL)")
    S.note(ax, 13, -0.75,
           "surveillance every hour: reflexes, respirations at least 12/min, urine output at least 30 mL/h\nantidote at the bedside: CALCIUM GLUCONATE",
           mode, ha="center")
    S.strip(ax)
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Neonatal jaundice timing.  The tested discrimination is TIMING, not the
# number: visible jaundice in the FIRST 24 HOURS is pathologic and always
# reported; physiologic jaundice appears after day 2, peaks about day 3-5 in
# term infants (later in preterm), and fades over the following week.
# Bilirubin values are plotted as a schematic curve; the DAY boundaries are
# the standard published teaching values.
# ---------------------------------------------------------------------------

@figure("nclex-bilirubin-timeline")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    t = np.linspace(0, 10, 400)
    physiologic = 6.5 * np.exp(-((t - 3.8) ** 2) / 6.0) + 1.0
    physiologic[t < 1.0] = np.nan
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    ax.axvspan(0, 1, color=c[1], alpha=0.28)
    ax.plot(t, physiologic, color=c[0], linewidth=2)
    ax.annotate("FIRST 24 HOURS\nany visible jaundice here\nis PATHOLOGIC - report",
                (0.5, 6.4), ha="center", fontsize=8.8, color=ink)
    ax.annotate("physiologic jaundice:\nappears after day 2,\npeaks about day 3-5",
                (4.6, 6.9), ha="center", fontsize=9, color=ink)
    ax.plot([3.8], [7.5], "o", color=c[2], markersize=6)
    S.note(ax, 9.6, 1.2,
           "causes to consider early: hemolysis (ABO/Rh),\nsepsis, or bruising - not normal breakdown",
           mode, ha="right")
    ax.set_xlabel("day of life")
    ax.set_ylabel("serum bilirubin (schematic)")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 9.5)
    ax.set_yticks([])
    ax.set_xticks([0, 1, 2, 3, 4, 5, 6, 8, 10])
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Rho(D) immune globulin: when it is given to an Rh-NEGATIVE client.
# Routine antepartum dose at about 28 weeks; within 72 HOURS of birth when
# the newborn is Rh-positive; and after any potentially sensitizing event
# (bleeding, trauma, amniocentesis, ectopic, loss, version).
# ---------------------------------------------------------------------------

@figure("nclex-rhogam-timeline")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.4, 3.4))
    ax.plot([0, 44], [1.0, 1.0], color=S.GUIDE[mode], linewidth=1.6)
    marks = [
        (28, "28 weeks\nroutine antepartum dose", c[0], 1.0),
        (40, "birth\n+ within 72 h if newborn\nis Rh-POSITIVE", c[1], 1.0),
    ]
    for x, label, colour, y in marks:
        ax.plot([x], [y], "o", color=colour, markersize=9)
        ax.annotate(label, (x, y), textcoords="offset points",
                    xytext=(0, 16), ha="center", fontsize=9, color=ink)
    for x in (10, 16, 22, 34):
        ax.plot([x], [1.0], "|", color=c[2], markersize=13)
    ax.annotate("ANY sensitizing event, any gestational age:\nbleeding, trauma, amniocentesis, ectopic, loss, version",
                (17, 0.45), ha="center", fontsize=8.8, color=c[2])
    ax.annotate("given to Rh-NEGATIVE clients only - it prevents antibody formation,\nso it protects FUTURE pregnancies, not this one",
                (22, 0.05), ha="center", fontsize=8.6, color=S.INK_2[mode])
    ax.set_xlim(-2, 46)
    ax.set_ylim(-0.15, 1.75)
    ax.set_yticks([])
    ax.set_xticks([0, 10, 20, 28, 40])
    ax.set_xlabel("weeks of gestation")
    S.strip(ax)
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Pediatric vital-sign bands by age (standard published teaching ranges).
# The tested logic is the TREND: heart and respiratory rates fall as a child
# grows while blood pressure rises, so every number is judged against its
# age band rather than the adult range.
# ---------------------------------------------------------------------------

@figure("nclex-peds-vitals")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    ages = ["newborn", "infant", "toddler", "preschool", "school-age",
            "adolescent"]
    hr = [(110, 160), (90, 160), (80, 140), (70, 120), (60, 110), (60, 100)]
    rr = [(30, 60), (25, 50), (20, 30), (20, 25), (18, 22), (12, 20)]
    x = np.arange(len(ages))
    fig, axes = plt.subplots(1, 2, figsize=(8.4, 3.8))
    for ax, data, label, colour in ((axes[0], hr, "heart rate (beats/min)", c[0]),
                                    (axes[1], rr, "respirations (breaths/min)", c[1])):
        lo = [d[0] for d in data]
        hi = [d[1] for d in data]
        ax.fill_between(x, lo, hi, color=colour, alpha=0.35)
        ax.plot(x, hi, color=colour, linewidth=1.8)
        ax.plot(x, lo, color=colour, linewidth=1.8)
        ax.set_xticks(x)
        ax.set_xticklabels(ages, rotation=30, ha="right", fontsize=8.5)
        ax.set_ylabel(label, fontsize=9.5)
        S.strip(ax)
    axes[0].annotate("rates FALL as the child grows", (0.15, 168),
                     fontsize=9, color=ink)
    axes[1].annotate("same direction - judge every\nnumber against its age band",
                     (0.15, 55), fontsize=9, color=ink)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Infant growth milestones as taught: birth weight DOUBLES by about 6 months
# and TRIPLES by 12; length increases about 50 percent in the first year;
# the posterior fontanel closes by 2-3 months and the anterior by 12-18.
# ---------------------------------------------------------------------------

@figure("nclex-peds-growth")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    months = np.array([0, 6, 12])
    multiples = np.array([1.0, 2.0, 3.0])
    fig, ax = plt.subplots(figsize=(7.0, 3.9))
    ax.plot(months, multiples, color=c[0], linewidth=2, marker="o",
            markersize=7)
    for m, v, label in ((0, 1.0, "birth weight"), (6, 2.0, "DOUBLES by ~6 months"),
                        (12, 3.0, "TRIPLES by ~12 months")):
        ax.annotate(label, (m, v), textcoords="offset points",
                    xytext=(8, -14 if m == 0 else 8), fontsize=9.2, color=ink)
    ax.axhline(1.0, color=S.GRID[mode], linewidth=1)
    S.note(ax, 0.3, 3.35,
           "length increases about 50 percent in the first year;\nposterior fontanel closes 2-3 months, anterior 12-18 months",
           mode, ha="left")
    ax.set_xlabel("age (months)")
    ax.set_ylabel("multiple of birth weight")
    ax.set_xlim(-0.8, 14)
    ax.set_ylim(0.5, 3.9)
    ax.set_xticks([0, 6, 12])
    S.strip(ax)
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Pediatric maintenance fluid: the Holliday-Segar method, computed.
# Daily:  100 mL/kg for the first 10 kg, 50 mL/kg for the next 10 kg,
#         20 mL/kg for every kg above 20.
# Hourly ("4-2-1"): 4 mL/kg/h first 10, 2 mL/kg/h next 10, 1 mL/kg/h beyond.
# The curve below is that formula evaluated across weights.
# ---------------------------------------------------------------------------

def _maint_hourly(kg):
    first = np.minimum(kg, 10) * 4.0
    second = np.clip(kg - 10, 0, 10) * 2.0
    third = np.clip(kg - 20, 0, None) * 1.0
    return first + second + third


@figure("nclex-peds-maintenance-fluid")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    kg = np.linspace(1, 60, 400)
    rate = _maint_hourly(kg)
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    ax.plot(kg, rate, color=c[0], linewidth=2)
    for w in (10, 20):
        ax.axvline(w, color=S.GRID[mode], linewidth=1)
    marks = [(10, "10 kg: 40 mL/h\n(4 mL/kg/h)"),
             (20, "20 kg: 60 mL/h\n(+2 mL/kg/h)"),
             (50, "50 kg: 90 mL/h\n(+1 mL/kg/h)")]
    for w, label in marks:
        r = float(_maint_hourly(np.array([float(w)]))[0])
        ax.plot([w], [r], "o", color=c[1], markersize=6)
        ax.annotate(label, (w, r), textcoords="offset points",
                    xytext=(8, -4), fontsize=8.8, color=ink)
    S.note(ax, 1.5, 88,
           "the 4-2-1 rule: 4 mL/kg/h for the first 10 kg,\n2 for the next 10, 1 for every kg beyond",
           mode, ha="left")
    ax.set_xlabel("weight (kg)")
    ax.set_ylabel("maintenance rate (mL/h)")
    ax.set_xlim(0, 62)
    ax.set_ylim(0, 100)
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Burn surface area: the adult rule of nines does not fit children, whose
# heads are proportionally larger and legs smaller.  Values below are the
# standard teaching percentages for total body surface area.
# ---------------------------------------------------------------------------

@figure("nclex-peds-burn-tbsa")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    regions = ["head", "each arm", "front\ntrunk", "back\ntrunk", "each leg"]
    infant = [18, 9, 18, 18, 14]
    adult = [9, 9, 18, 18, 18]
    x = np.arange(len(regions))
    w = 0.38
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    ax.bar(x - w / 2, infant, w, color=c[0], label="infant")
    ax.bar(x + w / 2, adult, w, color=c[1], label="adult")
    for i, (a, b) in enumerate(zip(infant, adult)):
        ax.annotate(f"{a}%", (i - w / 2, a), ha="center", va="bottom",
                    fontsize=8.5, color=ink)
        ax.annotate(f"{b}%", (i + w / 2, b), ha="center", va="bottom",
                    fontsize=8.5, color=ink)
    ax.set_xticks(x)
    ax.set_xticklabels(regions, fontsize=9)
    ax.set_ylabel("percent of total body surface area")
    ax.set_ylim(0, 23)
    ax.legend(frameon=False, fontsize=9)
    S.note(ax, 4.4, 21.5,
           "the head is proportionally LARGER and legs smaller in infants -\nusing the adult rule of nines underestimates a child's burn",
           mode, ha="right")
    S.strip(ax)
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
