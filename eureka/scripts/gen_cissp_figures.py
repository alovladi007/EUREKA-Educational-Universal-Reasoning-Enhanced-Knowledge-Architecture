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



# ---------------------------------------------------------------------------
# Business impact grows with outage duration.  The curve is schematic; what is
# definitional is the RELATIONSHIP: impact accelerates, and MTD is the point
# beyond which the organisation cannot recover - so RTO must be set inside it.
# ---------------------------------------------------------------------------

@figure("cissp-impact-over-time")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    t = np.linspace(0, 10, 400)
    impact = 0.9 * t ** 2.1
    fig, ax = plt.subplots(figsize=(7.4, 4.2))
    ax.plot(t, impact, color=c[0], linewidth=2.2)
    mtd = 7.5
    ax.axvline(mtd, color=c[1], linewidth=2, linestyle=(0, (5, 3)))
    ax.annotate("MTD\nmaximum tolerable downtime", (mtd, 78), ha="center",
                fontsize=9.5, color=c[1])
    ax.axvspan(mtd, 10, color=c[1], alpha=0.13)
    ax.annotate("beyond here the organisation\nmay not recover at all",
                (8.75, 30), ha="center", fontsize=8.8, color=ink)
    rto = 4.2
    ax.axvline(rto, color=c[2], linewidth=1.8)
    ax.annotate("RTO must be set\nINSIDE the MTD", (rto, 52), ha="center",
                fontsize=9.2, color=c[2])
    ax.set_xlabel("duration of the outage")
    ax.set_ylabel("cumulative business impact")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 110)
    ax.set_xticks([]); ax.set_yticks([])
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Recovery-site options: the cost / recovery-time trade-off.  Positions are the
# standard qualitative characterisations (cold = cheap and slow through
# mirrored = costly and immediate); axes are deliberately unlabelled in units
# because real figures are organisation-specific.
# ---------------------------------------------------------------------------

@figure("cissp-recovery-sites")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    sites = [
        ("Cold site", 1.0, 9.0, "space and power only; you bring everything"),
        ("Warm site", 3.2, 5.5, "space plus some hardware and connectivity"),
        ("Hot site", 6.8, 2.0, "fully equipped, data current, staffed-ready"),
        ("Mirrored", 9.3, 0.5, "live duplicate; effectively no recovery gap"),
    ]
    fig, ax = plt.subplots(figsize=(7.6, 4.4))
    xs = [s[1] for s in sites]; ys = [s[2] for s in sites]
    ax.plot(xs, ys, color=S.GRID[mode], linewidth=1.6, linestyle=(0, (4, 3)))
    for name, x, y, note in sites:
        ax.plot([x], [y], "o", color=c[0], markersize=11)
        ax.annotate(name, (x, y), textcoords="offset points", xytext=(0, 13),
                    ha="center", fontsize=10, color=ink)
        ax.annotate(note, (x, y), textcoords="offset points", xytext=(0, -20),
                    ha="center", fontsize=7.9, color=S.INK_2[mode])
    ax.set_xlabel("cost to maintain  ->")
    ax.set_ylabel("time to recover  ->")
    ax.set_xlim(0, 10.5)
    ax.set_ylim(-1.6, 10.8)
    ax.set_xticks([]); ax.set_yticks([])
    S.note(ax, 0.3, 10.4,
           "reciprocal / mutual-aid agreements sit off this curve:\ncheap, but capacity is never guaranteed when both parties are hit",
           mode, ha="left")
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# DR test types, ordered by rigour and by operational disruption.  The ladder
# order is the standard progression taught for exercising a plan.
# ---------------------------------------------------------------------------

@figure("cissp-dr-testing-ladder")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    tests = [
        ("Read-through / checklist", 1, "distribute the plan; each owner reviews their part"),
        ("Structured walkthrough", 2, "team talks through a scenario together"),
        ("Simulation", 3, "role-play a scenario; no live systems moved"),
        ("Parallel test", 4, "recovery site brought up ALONGSIDE production"),
        ("Full interruption", 5, "production is actually stopped - highest risk"),
    ]
    fig, ax = plt.subplots(figsize=(8.0, 4.2))
    for name, lvl, note in tests:
        y = lvl
        ax.barh(y, lvl, height=0.6, color=c[0], alpha=0.35 + 0.12 * lvl,
                edgecolor="none")
        ax.annotate(name, (0.08, y), va="center", fontsize=9.6, color=ink)
        ax.annotate(note, (5.25, y), va="center", fontsize=8.2,
                    color=S.INK_2[mode])
    ax.annotate("rigour and disruption increase  ->", (2.6, 5.75), ha="center",
                fontsize=9, color=ink, style="italic")
    ax.set_xlim(0, 10.6)
    ax.set_ylim(0.3, 6.1)
    ax.set_xticks([]); ax.set_yticks([])
    S.note(ax, 0.08, 0.55,
           "never run a full-interruption test first - work up the ladder, and never test without management sign-off",
           mode, ha="left")
    S.strip(ax)
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The BCP lifecycle as a closed loop: policy and scope, BIA, strategy, plan,
# test, and maintain - feeding back into scope.
# ---------------------------------------------------------------------------

@figure("cissp-bcp-lifecycle")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    steps = [
        ("1. Project scope\nand policy", "management support, scope, team"),
        ("2. Business impact\nanalysis (BIA)", "critical processes, MTD, RTO, RPO"),
        ("3. Identify\nstrategies", "recovery options priced against MTD"),
        ("4. Develop\nthe plan", "documented, role-assigned, distributed"),
        ("5. Test and\nexercise", "work up the testing ladder"),
        ("6. Maintain\nand update", "on change, and on schedule"),
    ]
    n = len(steps)
    fig, ax = plt.subplots(figsize=(7.8, 4.8))
    R = 3.4
    for i, (title, note) in enumerate(steps):
        ang = np.pi / 2 - 2 * np.pi * i / n
        x, y = R * np.cos(ang), R * np.sin(ang)
        ax.add_patch(plt.Circle((x, y), 1.02, facecolor="none",
                                edgecolor=c[0], linewidth=1.8))
        ax.annotate(title, (x, y + 0.12), ha="center", va="center",
                    fontsize=8.4, color=ink)
        ax.annotate(note, (x, y - 1.35), ha="center", va="center",
                    fontsize=7.2, color=S.INK_2[mode])
        ang2 = np.pi / 2 - 2 * np.pi * (i + 1) / n
        x2, y2 = R * np.cos(ang2), R * np.sin(ang2)
        ax.annotate("", (x2 * 0.78, y2 * 0.78), (x * 0.78, y * 0.78),
                    arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                    linewidth=1.3,
                                    connectionstyle="arc3,rad=0.22"))
    ax.annotate("BCP is a LOOP,\nnot a document", (0, 0), ha="center",
                va="center", fontsize=10, color=ink)
    ax.set_xlim(-5.4, 5.4)
    ax.set_ylim(-5.4, 5.0)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# The hybrid model every real protocol uses: asymmetric cryptography (or
# authenticated Diffie-Hellman) agrees a session key, then symmetric
# cryptography carries the bulk traffic.  Sequence, not measurement.
# ---------------------------------------------------------------------------

@figure("cissp-hybrid-model")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.2, 4.4))
    for x, name in ((0.9, "CLIENT"), (8.3, "SERVER")):
        ax.plot([x, x], [0.4, 4.5], color=ink, linewidth=2)
        ax.annotate(name, (x, 4.75), ha="center", fontsize=10.5, color=ink)

    steps = [
        (4.05, "1. server presents its CERTIFICATE", c[0], "right-to-left",
         "client validates the chain to a trusted CA"),
        (3.25, "2. key agreement (ephemeral DH / RSA transport)", c[0], "both",
         "ASYMMETRIC - slow, used once"),
        (2.45, "3. both derive the same SESSION KEY", c[1], "none",
         "never transmitted when DH is used"),
        (1.55, "4. bulk traffic encrypted with the session key", c[2], "both",
         "SYMMETRIC - fast, carries the data"),
        (0.75, "5. session ends - key discarded", c[2], "none",
         "ephemeral keys give forward secrecy"),
    ]
    for y, label, colour, direction, note in steps:
        if direction == "right-to-left":
            ax.annotate("", (1.05, y), (8.15, y),
                        arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.6))
        elif direction == "both":
            ax.annotate("", (8.15, y), (1.05, y),
                        arrowprops=dict(arrowstyle="<|-|>", color=colour, linewidth=1.6))
        ax.annotate(label, (4.6, y + 0.16), ha="center", fontsize=9.2, color=ink)
        ax.annotate(note, (4.6, y - 0.2), ha="center", fontsize=7.8,
                    color=S.INK_2[mode])
    ax.set_xlim(0, 9.4)
    ax.set_ylim(0.2, 5.1)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Digital signature: what the signer does and what the verifier does.  The
# asymmetry - sign with the PRIVATE key, verify with the PUBLIC key, and sign
# the HASH rather than the message - is the whole content.
# ---------------------------------------------------------------------------

@figure("cissp-signature-flow")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, axes = plt.subplots(1, 2, figsize=(8.6, 4.2))

    def box(ax, x, y, w, h, text, colour, fs_=8.6):
        ax.add_patch(plt.Rectangle((x, y), w, h, facecolor="none",
                                   edgecolor=colour, linewidth=1.7))
        ax.annotate(text, (x + w / 2, y + h / 2), ha="center", va="center",
                    fontsize=fs_, color=ink)

    def arr(ax, x0, y0, x1, y1):
        ax.annotate("", (x1, y1), (x0, y0),
                    arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                    linewidth=1.3))

    ax = axes[0]
    ax.set_title("SIGNING", fontsize=10.5)
    box(ax, 0.5, 5.0, 4.0, 0.75, "message", c[0])
    box(ax, 0.5, 3.6, 4.0, 0.75, "hash it -> digest", c[1])
    box(ax, 0.5, 2.2, 4.0, 0.75, "encrypt the DIGEST with\nthe SIGNER'S PRIVATE KEY", c[2], 8.0)
    box(ax, 0.5, 0.8, 4.0, 0.75, "send message + signature", c[0])
    for y0, y1 in ((5.0, 4.4), (3.6, 3.0), (2.2, 1.6)):
        arr(ax, 2.5, y0, 2.5, y1)

    ax = axes[1]
    ax.set_title("VERIFYING", fontsize=10.5)
    box(ax, 0.5, 5.0, 4.0, 0.75, "received message + signature", c[0], 8.0)
    box(ax, 0.5, 3.6, 1.85, 0.75, "hash the\nmessage", c[1], 8.0)
    box(ax, 2.65, 3.6, 1.85, 0.75, "decrypt sig with\nSENDER'S PUBLIC KEY", c[2], 7.2)
    box(ax, 0.5, 2.2, 4.0, 0.75, "compare the two digests", c[1])
    box(ax, 0.5, 0.8, 4.0, 0.75, "match = unaltered AND\nfrom that private key", c[0], 8.0)
    arr(ax, 1.4, 5.0, 1.4, 4.4); arr(ax, 3.6, 5.0, 3.6, 4.4)
    arr(ax, 1.4, 3.6, 1.9, 3.0); arr(ax, 3.6, 3.6, 3.1, 3.0)
    arr(ax, 2.5, 2.2, 2.5, 1.6)

    for ax in axes:
        ax.set_xlim(0, 5.0); ax.set_ylim(0.4, 6.1); ax.axis("off")
    fig.text(0.5, 0.015,
             "the signature covers the DIGEST, not the message - which is why signing is fast, and why a broken hash breaks every signature built on it",
             ha="center", fontsize=8.0, color=S.INK_2[mode])
    fig.tight_layout(rect=(0, 0.04, 1, 1))
    return fig


# ---------------------------------------------------------------------------
# The key lifecycle.  Strong algorithms fail at these stages, not in the maths.
# ---------------------------------------------------------------------------

@figure("cissp-key-lifecycle")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    stages = [
        ("Generation", "strong randomness;\nweak entropy dooms it"),
        ("Distribution", "out of band or\nasymmetrically protected"),
        ("Storage", "HSM or keystore;\nnever hardcoded"),
        ("Use", "one key, one purpose;\nnever sign and encrypt"),
        ("Rotation", "scheduled, and on\nsuspected compromise"),
        ("Destruction", "securely destroy so old\nciphertext stays dead"),
    ]
    fig, ax = plt.subplots(figsize=(8.6, 3.6))
    for i, (name, note) in enumerate(stages):
        x = 0.35 + i * 1.52
        ax.add_patch(plt.Rectangle((x, 1.5), 1.28, 0.75, facecolor="none",
                                   edgecolor=c[0], linewidth=1.8))
        ax.annotate(name, (x + 0.64, 1.87), ha="center", va="center",
                    fontsize=9.2, color=ink)
        ax.annotate(note, (x + 0.64, 1.05), ha="center", va="top",
                    fontsize=7.4, color=S.INK_2[mode])
        if i < len(stages) - 1:
            ax.annotate("", (x + 1.5, 1.87), (x + 1.3, 1.87),
                        arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                        linewidth=1.4))
    ax.annotate("split knowledge and dual control apply across the whole lifecycle - no one person holds a complete critical key",
                (4.8, 2.65), ha="center", fontsize=8.4, color=ink, style="italic")
    ax.set_xlim(0, 9.6)
    ax.set_ylim(0.1, 3.0)
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
