#!/usr/bin/env python3
"""CISSP course figures - same contract as gen_fe_ee_figures.py / gen_nclex_figures.py.

Writes theme pairs:
    apps/web/public/courses/cissp/figures/<name>.svg        (light)
    apps/web/public/courses/cissp/figures/<name>.dark.svg   (dark)

Data honesty: domain weights are the official (ISC)2 CISSP Exam Outline values
effective 2024-04-15.  Everything else is either a definitional relationship
(the RPO/RTO/MTD timeline, the risk matrix axes, the key-exchange sequence) or a
taxonomy - no measurement is invented, and nothing is traced from any book.

Run:  python3 scripts/gen_cissp_figures.py [prefix]
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = HERE.parent / "apps" / "web" / "public" / "courses" / "cissp" / "figures"

REGISTRY: dict = {}


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Official (ISC)2 CISSP domain weights, outline effective 2024-04-15.
# ---------------------------------------------------------------------------

@figure("cissp-domain-weights")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    domains = ["1 Security &\nRisk Mgmt", "2 Asset\nSecurity",
               "3 Arch &\nEngineering", "4 Comms &\nNetwork",
               "5 Identity &\nAccess", "6 Assessment\n& Testing",
               "7 Security\nOperations", "8 Software\nDev Security"]
    pct = [16, 10, 13, 13, 13, 12, 13, 10]
    x = np.arange(len(domains))
    fig, ax = plt.subplots(figsize=(8.2, 4.0))
    bars = ax.bar(x, pct, color=c[0], width=0.62)
    bars[0].set_color(c[1])
    for i, v in enumerate(pct):
        ax.annotate(f"{v}%", (i, v), ha="center", va="bottom",
                    fontsize=9.5, color=ink)
    ax.set_xticks(x)
    ax.set_xticklabels(domains, fontsize=8.2)
    ax.set_ylabel("share of the exam")
    ax.set_ylim(0, 19)
    S.note(ax, 7.4, 17.6,
           "official outline effective 2024-04-15;\nDomain 1 is the single heaviest",
           mode, ha="right")
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Business-continuity metrics on one timeline.  These are DEFINITIONS, not
# measurements: RPO looks backward from the incident (how much data you can
# lose), RTO forward (how long until service resumes), WRT is the work-recovery
# time to verify and catch up, and MTD = RTO + WRT is the outer limit the
# business can survive.
# ---------------------------------------------------------------------------

@figure("cissp-bc-metrics")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.0, 4.2))
    ax.axvline(0, color=ink, linewidth=2)
    ax.annotate("INCIDENT", (0, 3.35), ha="center", fontsize=10.5, color=ink)
    ax.plot([-6.5, 7.5], [1.0, 1.0], color=S.GUIDE[mode], linewidth=1)

    def span(x0, x1, y, label, colour, sub):
        ax.annotate("", (x1, y), (x0, y),
                    arrowprops=dict(arrowstyle="|-|,widthA=0.3,widthB=0.3",
                                    color=colour, linewidth=2))
        ax.annotate(label, ((x0 + x1) / 2, y + 0.17), ha="center",
                    fontsize=10, color=colour)
        ax.annotate(sub, ((x0 + x1) / 2, y - 0.32), ha="center",
                    fontsize=8.4, color=ink)

    span(-5.5, 0, 2.5, "RPO", c[0], "last good backup -> incident\nHOW MUCH DATA you can afford to lose")
    span(0, 3.5, 2.5, "RTO", c[1], "incident -> service restored\nHOW LONG until systems are back")
    span(3.5, 6.0, 2.5, "WRT", c[2], "restored -> verified and caught up")
    span(0, 6.0, 0.35, "MTD  (= RTO + WRT)", ink,
         "the outer limit the business can survive")
    for x, lbl in ((-5.5, "last\nbackup"), (3.5, "systems\nup"), (6.0, "business\nnormal")):
        ax.plot([x], [1.0], "o", color=S.GUIDE[mode], markersize=6)
        ax.annotate(lbl, (x, 0.78), ha="center", va="top", fontsize=8.2,
                    color=ink)
    ax.set_xlim(-6.8, 7.8)
    ax.set_ylim(-0.4, 3.8)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Qualitative risk matrix: risk = likelihood x impact.  The cell shading is
# computed from the product of the two axis indices, so the ranking is
# arithmetic rather than asserted.
# ---------------------------------------------------------------------------

@figure("cissp-risk-matrix")
def _(mode):
    ink = S.INK[mode]
    levels = ["Very low", "Low", "Moderate", "High", "Very high"]
    n = len(levels)
    grid = np.array([[(i + 1) * (j + 1) for j in range(n)] for i in range(n)],
                    dtype=float)
    fig, ax = plt.subplots(figsize=(6.6, 5.0))
    ax.imshow(grid, origin="lower", cmap="YlOrRd", alpha=0.85)
    for i in range(n):
        for j in range(n):
            ax.annotate(f"{int(grid[i, j])}", (j, i), ha="center", va="center",
                        fontsize=10, color="#222222")
    ax.set_xticks(range(n)); ax.set_xticklabels(levels, fontsize=8.6, rotation=20, ha="right")
    ax.set_yticks(range(n)); ax.set_yticklabels(levels, fontsize=8.6)
    ax.set_xlabel("IMPACT if it happens")
    ax.set_ylabel("LIKELIHOOD it happens")
    ax.set_title("risk = likelihood x impact (cell value is the product)",
                 fontsize=10, color=ink)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Cryptography taxonomy: which family provides which security service.  This is
# a definitional map, drawn so the service columns can be read at a glance.
# ---------------------------------------------------------------------------

@figure("cissp-crypto-taxonomy")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    rows = [
        ("Symmetric\n(AES, ChaCha20)", [1, 0, 0, 0], "one shared key; fast; key distribution is the problem"),
        ("Asymmetric\n(RSA, ECC)", [1, 0, 1, 1], "key pair; slow; solves distribution and enables signatures"),
        ("Hashing\n(SHA-2, SHA-3)", [0, 1, 0, 0], "one-way digest; no key; detects change"),
        ("MAC / HMAC", [0, 1, 1, 0], "hash plus a shared key; origin without non-repudiation"),
        ("Digital signature", [0, 1, 1, 1], "hash signed with a private key; the full set"),
    ]
    cols = ["Confidentiality", "Integrity", "Authentication", "Non-repudiation"]
    fig, ax = plt.subplots(figsize=(8.4, 4.4))
    for j, cname in enumerate(cols):
        ax.annotate(cname, (j + 0.5, len(rows) + 0.15), ha="center",
                    fontsize=9.2, color=ink)
    for i, (name, marks, note) in enumerate(rows):
        y = len(rows) - 1 - i
        ax.annotate(name, (-0.15, y + 0.45), ha="right", va="center",
                    fontsize=9.2, color=ink)
        ax.annotate(note, (4.15, y + 0.45), ha="left", va="center",
                    fontsize=8.0, color=S.INK_2[mode])
        for j, mk in enumerate(marks):
            ax.add_patch(plt.Rectangle((j, y), 1, 0.9, facecolor="none",
                                       edgecolor=S.GRID[mode], linewidth=1))
            if mk:
                ax.add_patch(plt.Rectangle((j + 0.08, y + 0.08), 0.84, 0.74,
                                           facecolor=c[0], alpha=0.75,
                                           edgecolor="none"))
                ax.annotate("yes", (j + 0.5, y + 0.45), ha="center",
                            va="center", fontsize=8.6, color=S.INK["light"])
    ax.set_xlim(-3.1, 8.4)
    ax.set_ylim(-0.3, len(rows) + 0.6)
    ax.axis("off")
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
