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
    fig, ax = plt.subplots(figsize=(8.6, 4.8))
    ax.axvline(0, color=ink, linewidth=2, ymin=0.42, ymax=0.92)
    ax.annotate("INCIDENT", (0, 3.5), ha="center", fontsize=10.5, color=ink)
    ax.plot([-6.5, 7.0], [1.0, 1.0], color=S.GUIDE[mode], linewidth=1)

    def span(x0, x1, y, label, colour):
        ax.annotate("", (x1, y), (x0, y),
                    arrowprops=dict(arrowstyle="|-|,widthA=0.3,widthB=0.3",
                                    color=colour, linewidth=2))
        ax.annotate(label, ((x0 + x1) / 2, y + 0.16), ha="center",
                    fontsize=10, color=colour)

    # Only the acronym sits on the timeline; every gloss goes in the key
    # below, so no two captions can ever collide.
    span(-5.5, 0, 2.6, "RPO", c[0])
    span(0, 3.5, 2.6, "RTO", c[1])
    span(3.5, 6.0, 2.6, "WRT", c[2])
    span(0, 6.0, 1.75, "MTD", ink)

    for x, lbl in ((-5.5, "last good\nbackup"), (3.5, "systems\nup"),
                   (6.0, "business\nnormal")):
        ax.plot([x], [1.0], "o", color=S.GUIDE[mode], markersize=6)
        ax.annotate(lbl, (x, 0.82), ha="center", va="top", fontsize=8.2,
                    color=ink)

    key = [
        ("RPO", c[0], "last good backup to incident - how much DATA you can afford to lose"),
        ("RTO", c[1], "incident to service restored - how LONG until systems are back"),
        ("WRT", c[2], "restored to verified and caught up - the work-recovery tail"),
        ("MTD", ink, "= RTO + WRT - the outer limit the business can survive"),
    ]
    for i, (tag, colour, gloss) in enumerate(key):
        y = -0.35 - i * 0.42
        ax.annotate(tag, (-6.5, y), fontsize=8.6, color=colour, va="center")
        ax.annotate(gloss, (-5.4, y), fontsize=8.0, color=S.INK_2[mode],
                    va="center")

    ax.set_xlim(-6.9, 7.3)
    ax.set_ylim(-2.15, 3.9)
    ax.axis("off")
    fig.tight_layout()
    return fig


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
        ("Symmetric\n(AES, ChaCha20)", [1, 0, 0, 0],
         "one shared key; fast; key distribution is the problem"),
        ("Asymmetric\n(RSA, ECC)", [1, 0, 1, 1],
         "key pair; slow; solves distribution and signs"),
        ("Hashing\n(SHA-2, SHA-3)", [0, 1, 0, 0],
         "one-way digest; no key; detects change"),
        ("MAC / HMAC", [0, 1, 1, 0],
         "hash plus a shared key; origin without non-repudiation"),
        ("Digital signature", [0, 1, 1, 1],
         "hash signed with a private key; the full set"),
    ]
    cols = ["Confidentiality", "Integrity", "Authentication", "Non-repudiation"]
    W = 2.25                      # wide enough for the longest header
    fig, ax = plt.subplots(figsize=(10.6, 4.4))
    for j, cname in enumerate(cols):
        ax.annotate(cname, (j * W + W / 2, len(rows) + 0.15), ha="center",
                    fontsize=8.8, color=ink)
    for i, (name, marks, note) in enumerate(rows):
        y = len(rows) - 1 - i
        ax.annotate(name, (-0.2, y + 0.45), ha="right", va="center",
                    fontsize=9.0, color=ink)
        ax.annotate(note, (4 * W + 0.3, y + 0.45), ha="left", va="center",
                    fontsize=8.0, color=S.INK_2[mode])
        for j, mk in enumerate(marks):
            ax.add_patch(plt.Rectangle((j * W, y), W, 0.9, facecolor="none",
                                       edgecolor=S.GRID[mode], linewidth=1))
            if mk:
                ax.add_patch(plt.Rectangle((j * W + 0.18, y + 0.08),
                                           W - 0.36, 0.74,
                                           facecolor=c[0], alpha=0.75,
                                           edgecolor="none"))
                ax.annotate("yes", (j * W + W / 2, y + 0.45), ha="center",
                            va="center", fontsize=8.6, color=S.INK["light"])
    ax.set_xlim(-3.9, 4 * W + 6.6)
    ax.set_ylim(-0.3, len(rows) + 0.6)
    ax.axis("off")
    fig.tight_layout()
    return fig


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



def _lattice(ax, ink, levels, colour):
    for i, lv in enumerate(levels):
        y = i * 1.25
        ax.add_patch(plt.Rectangle((0.6, y), 3.0, 0.78, facecolor="none",
                                   edgecolor=colour, linewidth=1.7))
        ax.annotate(lv, (2.1, y + 0.39), ha="center", va="center",
                    fontsize=9.2, color=ink)
    return [i * 1.25 + 0.39 for i in range(len(levels))]


# ---------------------------------------------------------------------------
# Bell-LaPadula protects CONFIDENTIALITY: no read up, no write down.
# Biba protects INTEGRITY and inverts both rules.  Definitional.
# ---------------------------------------------------------------------------

@figure("cissp-bell-lapadula")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    levels = ["Unclassified", "Confidential", "Secret", "Top Secret"]
    fig, axes = plt.subplots(1, 2, figsize=(9.2, 5.0))

    panels = (
        (axes[0], "BELL-LaPADULA   confidentiality", c[0],
         [("read", -1, True,  "read DOWN: allowed"),
          ("read", +1, False, "read UP: denied - simple security property"),
          ("write", +1, True,  "write UP: allowed"),
          ("write", -1, False, "write DOWN: denied - star (*) property")]),
        (axes[1], "BIBA   integrity", c[1],
         [("read", +1, True,  "read UP: allowed"),
          ("read", -1, False, "read DOWN: denied - simple integrity axiom"),
          ("write", -1, True,  "write DOWN: allowed"),
          ("write", +1, False, "write UP: denied - star (*) integrity axiom")]),
    )

    for ax, title, colour, rules in panels:
        # the lattice
        for i, lv in enumerate(levels):
            y = i * 1.2
            ax.add_patch(plt.Rectangle((0.3, y), 3.0, 0.8, facecolor="none",
                                       edgecolor=colour, linewidth=1.7))
            ax.annotate(lv, (1.8, y + 0.4), ha="center", va="center",
                        fontsize=9.0, color=ink)
        y_mid = 1 * 1.2 + 0.4          # the subject sits at Confidential

        ax.annotate(title, (0.3, 5.35), fontsize=10, color=ink)

        # the subject marker, placed clear of the box
        ax.plot([3.62], [y_mid], "o", color=c[2], markersize=8)
        ax.annotate("SUBJECT", (3.78, y_mid), va="center", ha="left",
                    fontsize=7.6, color=c[2])

        # two arrow columns, labels kept OUT of the plot area entirely
        cols = {"read": 5.45, "write": 6.35}
        for kind, direction, allowed, _label in rules:
            x = cols[kind]
            y0, y1 = y_mid, y_mid + direction * 1.2
            ax.annotate("", (x, y1), (x, y0),
                        arrowprops=dict(
                            arrowstyle="-|>" if allowed else "-",
                            color=colour if allowed else S.GUIDE[mode],
                            linewidth=1.9,
                            linestyle="solid" if allowed else (0, (3, 3))))
            if not allowed:
                ym = (y0 + y1) / 2
                for dy in (0.14, -0.14):
                    ax.plot([x - 0.22, x + 0.22], [ym - dy, ym + dy],
                            color=S.GUIDE[mode], linewidth=2)
        for kind, x in cols.items():
            ax.annotate(kind.upper(), (x, y_mid - 1.62), ha="center",
                        fontsize=7.6, color=S.INK_2[mode])

        # legend below the panel - one rule per line, no overlap possible
        for j, (_kind, _dir, allowed, label) in enumerate(rules):
            y = -0.78 - j * 0.46
            ax.annotate("+" if allowed else "x", (0.32, y), fontsize=8.4,
                        color=colour if allowed else S.GUIDE[mode],
                        ha="center", va="center")
            ax.annotate(label, (0.62, y), fontsize=7.8, va="center",
                        color=ink if allowed else S.INK_2[mode])

        ax.set_xlim(0, 7.1)
        ax.set_ylim(-2.75, 5.8)
        ax.axis("off")

    fig.text(0.5, 0.015,
             "Biba is Bell-LaPadula inverted: confidentiality stops secrets flowing DOWN, "
             "integrity stops corruption flowing UP",
             ha="center", fontsize=8.2, color=S.INK_2[mode])
    fig.tight_layout(rect=(0, 0.045, 1, 1))
    return fig


@figure("cissp-access-control-models")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    models = [
        ("DAC", "the data OWNER decides", "flexible; vulnerable to owner error and malware acting as the user"),
        ("MAC", "the SYSTEM enforces labels", "rigid; used where classification is mandatory"),
        ("RBAC", "rights attach to a ROLE", "scales with staff turnover; the enterprise default"),
        ("ABAC", "policy evaluates ATTRIBUTES", "most expressive; context-aware; hardest to audit"),
        ("RuleBAC", "global RULES apply to all", "firewall ACLs are the classic case"),
    ]
    fig, ax = plt.subplots(figsize=(8.4, 4.2))
    for i, (name, who, note) in enumerate(models):
        y = len(models) - 1 - i
        ax.add_patch(plt.Rectangle((0.25, y + 0.1), 1.15, 0.72,
                                   facecolor=c[0], alpha=0.28, edgecolor=c[0],
                                   linewidth=1.6))
        ax.annotate(name, (0.82, y + 0.46), ha="center", va="center",
                    fontsize=10, color=ink)
        ax.annotate(who, (1.65, y + 0.46), va="center", fontsize=9.4, color=ink)
        ax.annotate(note, (4.35, y + 0.46), va="center", fontsize=8.0,
                    color=S.INK_2[mode])
    ax.annotate("the exam's question is always WHO SETS THE RULE",
                (4.6, 5.35), ha="center", fontsize=9, color=ink, style="italic")
    ax.set_xlim(0, 10.6)
    ax.set_ylim(-0.3, 5.7)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# IAAA: identification, authentication, authorisation, accountability - the
# order matters and each stage answers a different question.
# ---------------------------------------------------------------------------

@figure("cissp-iaaa")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    stages = [
        ("IDENTIFICATION", "who do you claim to be?", "username, ID badge, account"),
        ("AUTHENTICATION", "prove it", "password, token, biometric"),
        ("AUTHORISATION", "what may you do?", "permissions, labels, policy"),
        ("ACCOUNTABILITY", "what did you do?", "logging, audit trail, non-repudiation"),
    ]
    fig, ax = plt.subplots(figsize=(8.6, 3.4))
    for i, (name, q, eg) in enumerate(stages):
        x = 0.3 + i * 2.45
        ax.add_patch(plt.Rectangle((x, 1.35), 2.05, 0.85, facecolor="none",
                                   edgecolor=c[0], linewidth=1.9))
        ax.annotate(name, (x + 1.02, 1.78), ha="center", va="center",
                    fontsize=9.4, color=ink)
        ax.annotate(q, (x + 1.02, 1.05), ha="center", fontsize=8.6, color=c[1])
        ax.annotate(eg, (x + 1.02, 0.68), ha="center", fontsize=7.6,
                    color=S.INK_2[mode])
        if i < len(stages) - 1:
            ax.annotate("", (x + 2.42, 1.78), (x + 2.08, 1.78),
                        arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                        linewidth=1.5))
    ax.annotate("accountability is impossible without unique identification - which is why shared accounts break the whole chain",
                (5.2, 2.55), ha="center", fontsize=8.4, color=ink, style="italic")
    ax.set_xlim(0, 10.4)
    ax.set_ylim(0.3, 2.9)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Kerberos exchange: AS issues a TGT, TGS issues a service ticket, the client
# presents it to the service.  The KDC never sends the password anywhere.
# ---------------------------------------------------------------------------

@figure("cissp-kerberos")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 4.6))
    actors = [("CLIENT", 0.9), ("KDC\n(AS + TGS)", 5.0), ("SERVICE", 9.1)]
    for name, x in actors:
        ax.add_patch(plt.Rectangle((x - 0.85, 4.45), 1.7, 0.7,
                                   facecolor="none", edgecolor=ink, linewidth=1.8))
        ax.annotate(name, (x, 4.8), ha="center", va="center", fontsize=9,
                    color=ink)
        ax.plot([x, x], [0.35, 4.4], color=S.GRID[mode], linewidth=1)
    steps = [
        (3.95, 0.9, 5.0, "1. request authentication", c[0]),
        (3.35, 5.0, 0.9, "2. TGT, encrypted with the client key", c[0]),
        (2.75, 0.9, 5.0, "3. present TGT, request a service ticket", c[1]),
        (2.15, 5.0, 0.9, "4. SERVICE TICKET issued", c[1]),
        (1.55, 0.9, 9.1, "5. present the service ticket", c[2]),
        (0.95, 9.1, 0.9, "6. access granted", c[2]),
    ]
    for y, x0, x1, label, colour in steps:
        ax.annotate("", (x1, y), (x0, y),
                    arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.7))
        ax.annotate(label, ((x0 + x1) / 2, y + 0.14), ha="center", fontsize=8.4,
                    color=ink)
    S.note(ax, 5.0, 0.15,
           "the password is never transmitted, and tickets are time-stamped - so clock skew breaks Kerberos, and the KDC is a single point of failure",
           mode, ha="center")
    ax.set_xlim(0, 10.4)
    ax.set_ylim(-0.2, 5.4)
    ax.axis("off")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# The reference monitor: the abstract machine that mediates EVERY access.
# Its three properties are the exam's favourite triple.
# ---------------------------------------------------------------------------

@figure("cissp-reference-monitor")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 4.4))
    ax.add_patch(plt.Rectangle((3.05, 1.15), 3.5, 2.35, facecolor=c[0],
                               alpha=0.14, edgecolor=c[0], linewidth=1.6))
    ax.annotate("TRUSTED COMPUTING BASE", (4.8, 3.28), ha="center",
                fontsize=8.0, color=c[0])
    ax.add_patch(plt.Rectangle((3.45, 1.55), 2.7, 1.35, facecolor="none",
                               edgecolor=ink, linewidth=1.9))
    ax.annotate("REFERENCE MONITOR", (4.8, 2.45), ha="center", fontsize=9.2,
                color=ink)
    ax.annotate("(the security kernel\nis its implementation)", (4.8, 1.95),
                ha="center", fontsize=7.6, color=S.INK_2[mode])

    for label, x in (("SUBJECT", 1.1), ("OBJECT", 8.5)):
        ax.add_patch(plt.Rectangle((x - 0.8, 1.85), 1.6, 0.75,
                                   facecolor="none", edgecolor=c[1],
                                   linewidth=1.7))
        ax.annotate(label, (x, 2.22), ha="center", va="center", fontsize=9,
                    color=ink)
    ax.annotate("", (3.4, 2.22), (1.95, 2.22),
                arrowprops=dict(arrowstyle="-|>", color=c[1], linewidth=1.8))
    ax.annotate("", (7.65, 2.22), (6.2, 2.22),
                arrowprops=dict(arrowstyle="-|>", color=c[1], linewidth=1.8))
    ax.annotate("request", (2.68, 2.4), ha="center", fontsize=8, color=ink)
    ax.annotate("mediated access", (6.92, 2.4), ha="center", fontsize=8,
                color=ink)

    ax.annotate("", (4.8, 1.5), (4.8, 0.98),
                arrowprops=dict(arrowstyle="-|>", color=c[2], linewidth=1.5))
    ax.add_patch(plt.Rectangle((3.7, 0.3), 2.2, 0.65, facecolor="none",
                               edgecolor=c[2], linewidth=1.5))
    ax.annotate("AUDIT LOG", (4.8, 0.62), ha="center", va="center",
                fontsize=8.4, color=ink)

    props = [("COMPLETE MEDIATION", "no access bypasses it"),
             ("TAMPERPROOF", "cannot be altered"),
             ("VERIFIABLE", "small enough to test exhaustively")]
    for i, (name, gloss) in enumerate(props):
        y = 3.95 - i * 0.0
        ax.annotate(name, (1.0 + i * 3.35, 4.05), fontsize=8.4, color=c[0])
        ax.annotate(gloss, (1.0 + i * 3.35, 3.75), fontsize=7.4,
                    color=S.INK_2[mode])
    ax.set_xlim(0, 10.4)
    ax.set_ylim(0.05, 4.45)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Clark-Wilson: users never touch data directly; a transformation procedure
# does, and an integrity verification procedure audits the result.
# ---------------------------------------------------------------------------

@figure("cissp-clark-wilson")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.6, 4.3))
    boxes = [("USER\n(subject)", 1.05, c[1]), ("TP\ntransformation\nprocedure", 4.3, c[0]),
             ("CDI\nconstrained\ndata item", 7.6, c[0])]
    for label, x, colour in boxes:
        ax.add_patch(plt.Rectangle((x - 1.05, 2.0), 2.1, 1.25,
                                   facecolor="none", edgecolor=colour,
                                   linewidth=1.8))
        ax.annotate(label, (x, 2.62), ha="center", va="center", fontsize=8.6,
                    color=ink)
    for x0, x1 in ((2.2, 3.15), (5.45, 6.4)):
        ax.annotate("", (x1, 2.62), (x0, 2.62),
                    arrowprops=dict(arrowstyle="-|>", color=ink, linewidth=1.7))
    ax.annotate("the ACCESS TRIPLE:  subject -> TP -> CDI", (4.3, 3.62),
                ha="center", fontsize=9.4, color=c[0])
    ax.annotate("a user may never read or write a CDI directly", (4.3, 3.32),
                ha="center", fontsize=7.8, color=S.INK_2[mode])

    ax.add_patch(plt.Rectangle((6.55, 0.5), 2.1, 0.85, facecolor="none",
                               edgecolor=c[2], linewidth=1.6))
    ax.annotate("IVP\nintegrity verification", (7.6, 0.92), ha="center",
                va="center", fontsize=8.0, color=ink)
    ax.annotate("", (7.6, 1.45), (7.6, 1.95),
                arrowprops=dict(arrowstyle="-|>", color=c[2], linewidth=1.5))
    ax.annotate("confirms the CDI is\nin a valid state", (9.0, 0.92),
                fontsize=7.4, color=S.INK_2[mode], va="center")

    ax.add_patch(plt.Rectangle((0.2, 0.5), 2.1, 0.85, facecolor="none",
                               edgecolor=c[1], linewidth=1.5, linestyle=(0, (4, 3))))
    ax.annotate("UDI\nunconstrained data", (1.25, 0.92), ha="center",
                va="center", fontsize=8.0, color=ink)
    ax.annotate("", (3.6, 1.95), (2.0, 1.35),
                arrowprops=dict(arrowstyle="-|>", color=c[1], linewidth=1.4,
                                linestyle=(0, (4, 3))))
    ax.annotate("a TP is the only thing that may\npromote UDI to CDI", (2.55, 1.62),
                fontsize=7.2, color=S.INK_2[mode])
    ax.set_xlim(0, 11.2)
    ax.set_ylim(0.25, 3.95)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Common Criteria assurance ladder.  EAL measures HOW THOROUGHLY a product was
# evaluated, not how secure it is - the single most-tested nuance.
# ---------------------------------------------------------------------------

@figure("cissp-cc-eal-ladder")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    eals = [
        ("EAL1", "functionally tested"),
        ("EAL2", "structurally tested"),
        ("EAL3", "methodically tested and checked"),
        ("EAL4", "methodically designed, tested, reviewed"),
        ("EAL5", "semi-formally designed and tested"),
        ("EAL6", "semi-formally verified design and tested"),
        ("EAL7", "formally verified design and tested"),
    ]
    fig, ax = plt.subplots(figsize=(8.6, 4.4))
    for i, (name, gloss) in enumerate(eals):
        w = 1.6 + i * 0.42
        ax.add_patch(plt.Rectangle((0.35, i * 0.55), w, 0.42,
                                   facecolor=c[0], alpha=0.18 + i * 0.09,
                                   edgecolor=c[0], linewidth=1.2))
        ax.annotate(name, (0.55, i * 0.55 + 0.21), va="center", fontsize=8.6,
                    color=ink)
        ax.annotate(gloss, (0.4 + w + 0.25, i * 0.55 + 0.21), va="center",
                    fontsize=8.0, color=S.INK_2[mode])
    ax.annotate("EAL4 is the highest level mutually recognised across all CCRA signatories,\nwhich is why commercial products cluster there",
                (0.4, -0.72), fontsize=8.0, color=ink, style="italic")
    ax.annotate("higher EAL = MORE ASSURANCE THAT THE CLAIMS WERE CHECKED,\nnot more security features",
                (0.4, 4.35), fontsize=8.6, color=c[2])
    ax.set_xlim(0, 10.6)
    ax.set_ylim(-1.15, 4.95)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The framework stack: each layer answers a different question, and the exam
# punishes candidates who treat them as interchangeable.
# ---------------------------------------------------------------------------

@figure("cissp-framework-stack")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    layers = [
        ("OPERATIONS", "ITIL, ISO 20000", "how do we run services day to day?", c[2]),
        ("CONTROLS", "ISO 27002, NIST SP 800-53, CIS", "which safeguards do we implement?", c[1]),
        ("MANAGEMENT SYSTEM", "ISO 27001, NIST RMF, NIST CSF", "how do we run a security programme?", c[0]),
        ("ARCHITECTURE", "SABSA, TOGAF, Zachman", "how do we structure the enterprise?", c[1]),
        ("GOVERNANCE", "COSO, COBIT", "who is accountable to the board?", c[0]),
    ]
    fig, ax = plt.subplots(figsize=(8.8, 4.4))
    for i, (name, examples, question, colour) in enumerate(layers):
        y = i * 0.82
        ax.add_patch(plt.Rectangle((0.3, y), 3.2, 0.66, facecolor=colour,
                                   alpha=0.2, edgecolor=colour, linewidth=1.5))
        ax.annotate(name, (1.9, y + 0.33), ha="center", va="center",
                    fontsize=8.8, color=ink)
        ax.annotate(examples, (3.75, y + 0.44), fontsize=8.2, color=ink)
        ax.annotate(question, (3.75, y + 0.16), fontsize=7.4,
                    color=S.INK_2[mode], style="italic")
    ax.annotate("", (0.15, 0.1), (0.15, 4.0),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                linewidth=1.4))
    ax.annotate("board", (-0.05, 0.1), rotation=90, fontsize=7.4,
                color=S.INK_2[mode], va="bottom", ha="center")
    ax.set_xlim(-0.35, 10.6)
    ax.set_ylim(-0.25, 4.35)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Authentication factors.  MFA requires factors from DIFFERENT categories -
# two passwords is still single-factor.
# ---------------------------------------------------------------------------

@figure("cissp-auth-factors")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    cats = [
        ("TYPE 1", "something you KNOW", "password, PIN, passphrase,\ncognitive question", c[0]),
        ("TYPE 2", "something you HAVE", "smart card, hardware token,\nphone with an authenticator", c[1]),
        ("TYPE 3", "something you ARE", "fingerprint, iris, retina,\nvoice, gait", c[2]),
    ]
    fig, ax = plt.subplots(figsize=(8.8, 3.9))
    for i, (t, name, egs, colour) in enumerate(cats):
        x = 0.35 + i * 3.45
        ax.add_patch(plt.Rectangle((x, 1.15), 3.05, 1.75, facecolor=colour,
                                   alpha=0.16, edgecolor=colour, linewidth=1.7))
        ax.annotate(t, (x + 1.52, 2.62), ha="center", fontsize=8.2, color=colour)
        ax.annotate(name, (x + 1.52, 2.24), ha="center", fontsize=9.4, color=ink)
        ax.annotate(egs, (x + 1.52, 1.62), ha="center", fontsize=7.8,
                    color=S.INK_2[mode])
    ax.annotate("MULTI-FACTOR = factors from DIFFERENT boxes", (5.4, 3.35),
                ha="center", fontsize=9.6, color=ink)
    S.note(ax, 5.4, 0.55,
           "a password plus a security question is TWO type-1 factors - still single-factor authentication; "
           "somewhere-you-are and something-you-do are attributes, not accepted factors",
           mode, ha="center")
    ax.set_xlim(0, 10.8)
    ax.set_ylim(0.2, 3.7)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Federated identity: the service provider trusts an assertion instead of
# holding the credential itself.
# ---------------------------------------------------------------------------

@figure("cissp-federation-saml")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(8.8, 4.4))
    actors = [("USER\n(principal)", 1.0), ("SERVICE PROVIDER\n(relying party)", 5.3),
              ("IDENTITY PROVIDER\n(asserting party)", 9.4)]
    for name, x in actors:
        ax.add_patch(plt.Rectangle((x - 1.25, 4.15), 2.5, 0.78,
                                   facecolor="none", edgecolor=ink, linewidth=1.8))
        ax.annotate(name, (x, 4.54), ha="center", va="center", fontsize=8.2,
                    color=ink)
        ax.plot([x, x], [0.55, 4.1], color=S.GRID[mode], linewidth=1)
    steps = [
        (3.65, 1.0, 5.3, "1. request a protected resource", c[0]),
        (3.1, 5.3, 1.0, "2. redirect with an authentication request", c[0]),
        (2.55, 1.0, 9.4, "3. authenticate at the home organisation", c[1]),
        (2.0, 9.4, 1.0, "4. signed ASSERTION (identity + attributes)", c[1]),
        (1.45, 1.0, 5.3, "5. present the assertion", c[2]),
        (0.9, 5.3, 1.0, "6. session established - no password ever crossed", c[2]),
    ]
    for y, x0, x1, label, colour in steps:
        ax.annotate("", (x1, y), (x0, y),
                    arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.7))
        ax.annotate(label, ((x0 + x1) / 2, y + 0.13), ha="center", fontsize=7.8,
                    color=ink)
    S.note(ax, 5.2, 0.3,
           "SAML carries assertions for authentication; OAuth 2.0 delegates AUTHORISATION; OIDC adds identity on top of OAuth",
           mode, ha="center")
    ax.set_xlim(-0.6, 11.2)
    ax.set_ylim(0.0, 5.05)
    ax.axis("off")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# OSI layers with the attack and the control that live at each one.  Layer
# assignment is definitional (ISO/IEC 7498-1); the pairings are the standard
# exam mapping.
# ---------------------------------------------------------------------------

_OSI = [
    ("1 Physical", "bits", "wiretap, cable cut, jamming", "locked conduit, TEMPEST, guards"),
    ("2 Data Link", "frames", "ARP poisoning, MAC flood, VLAN hop", "port security, DAI, 802.1X"),
    ("3 Network", "packets", "IP spoofing, smurf, routing attack", "ACLs, ingress filtering, IPsec"),
    ("4 Transport", "segments", "SYN flood, session hijack", "SYN cookies, TLS, stateful firewall"),
    ("5 Session", "data", "session replay, MITM on setup", "mutual auth, session tokens"),
    ("6 Presentation", "data", "malformed encoding, downgrade", "input validation, cipher policy"),
    ("7 Application", "data", "injection, XSS, phishing, DDoS", "WAF, secure coding, awareness"),
]


@figure("cissp-osi-attacks")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(10.4, 4.6))
    for i, (name, _pdu, attack, control) in enumerate(_OSI):
        y = i * 0.62
        ax.add_patch(plt.Rectangle((0.25, y), 2.35, 0.5, facecolor=c[0],
                                   alpha=0.14 + i * 0.055, edgecolor=c[0],
                                   linewidth=1.2))
        ax.annotate(name, (0.42, y + 0.25), va="center", fontsize=8.6, color=ink)
        ax.annotate(attack, (2.95, y + 0.25), va="center", fontsize=8.0, color=c[2])
        ax.annotate(control, (7.05, y + 0.25), va="center", fontsize=8.0,
                    color=S.INK_2[mode])
    ax.annotate("LAYER", (0.42, 4.55), fontsize=8.4, color=ink)
    ax.annotate("TYPICAL ATTACK", (2.95, 4.55), fontsize=8.4, color=c[2])
    ax.annotate("CONTROL THAT BELONGS THERE", (7.05, 4.55), fontsize=8.4,
                color=S.INK_2[mode])
    ax.set_xlim(0, 12.6)
    ax.set_ylim(-0.25, 4.95)
    ax.axis("off")
    fig.tight_layout()
    return fig


@figure("cissp-osi-encapsulation")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.0, 4.4))
    for i, (name, pdu, _a, _ctl) in enumerate(_OSI):
        y = i * 0.6
        ax.add_patch(plt.Rectangle((0.3, y), 2.5, 0.48, facecolor="none",
                                   edgecolor=c[0], linewidth=1.3))
        ax.annotate(name, (0.45, y + 0.24), va="center", fontsize=8.6, color=ink)
        ax.annotate(pdu.upper(), (3.15, y + 0.24), va="center", fontsize=8.4,
                    color=c[1])
    ax.annotate("PDU AT THIS LAYER", (3.15, 4.42), fontsize=8.4, color=c[1])
    # encapsulation grows the header stack on the way down
    for i in range(4):
        x = 5.1 + i * 0.0
        w = 1.0 + i * 0.75
        y = (3 - i) * 0.6 + 0.06
        ax.add_patch(plt.Rectangle((5.1, y), w, 0.36, facecolor=c[2],
                                   alpha=0.2 + i * 0.14, edgecolor=c[2],
                                   linewidth=1.0))
    ax.annotate("each layer down ADDS its own header;\nthe receiver strips them in reverse",
                (5.1, 2.85), fontsize=8.0, color=S.INK_2[mode])
    ax.annotate("data", (5.35, 1.98), fontsize=7.6, color=ink, va="center")
    ax.annotate("+ segment header", (5.35, 1.38), fontsize=7.6, color=ink, va="center")
    ax.annotate("+ packet header", (5.35, 0.78), fontsize=7.6, color=ink, va="center")
    ax.annotate("+ frame header and trailer", (5.35, 0.18), fontsize=7.6, color=ink,
                va="center")
    ax.set_xlim(0, 10.8)
    ax.set_ylim(-0.3, 4.8)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The TCP three-way handshake and the two attacks that abuse it.
# ---------------------------------------------------------------------------

@figure("cissp-tcp-handshake")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.0, 4.6))
    for name, x in (("CLIENT", 1.2), ("SERVER", 7.8)):
        ax.add_patch(plt.Rectangle((x - 1.0, 3.7), 2.0, 0.68, facecolor="none",
                                   edgecolor=ink, linewidth=1.8))
        ax.annotate(name, (x, 4.04), ha="center", va="center", fontsize=9,
                    color=ink)
        ax.plot([x, x], [1.35, 3.65], color=S.GRID[mode], linewidth=1)
    steps = [(3.25, 1.2, 7.8, "1.  SYN", c[0]),
             (2.65, 7.8, 1.2, "2.  SYN-ACK   (server allocates state)", c[1]),
             (2.05, 1.2, 7.8, "3.  ACK   -   connection ESTABLISHED", c[0])]
    for y, x0, x1, label, colour in steps:
        ax.annotate("", (x1, y), (x0, y),
                    arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.8))
        ax.annotate(label, ((x0 + x1) / 2, y + 0.14), ha="center", fontsize=8.6,
                    color=ink)
    key = [
        ("SYN flood", "send step 1, never send step 3 - the half-open table fills",
         "SYN cookies, rate limiting"),
        ("SYN scan", "send step 1, read the reply, send RST - the port is mapped "
                     "without a full session", "IDS, port-scan detection"),
    ]
    for i, (tag, how, fix) in enumerate(key):
        y = 0.75 - i * 0.55
        ax.annotate(tag, (0.25, y), fontsize=8.6, color=c[2], va="center")
        ax.annotate(how, (1.75, y + 0.11), fontsize=7.8, color=ink, va="center")
        ax.annotate("defence: " + fix, (1.75, y - 0.14), fontsize=7.4,
                    color=S.INK_2[mode], va="center")
    ax.set_xlim(0, 10.4)
    ax.set_ylim(-0.15, 4.6)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# DDoS by mechanism.  What distinguishes the classes is WHAT is exhausted.
# ---------------------------------------------------------------------------

@figure("cissp-ddos-taxonomy")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    kinds = [
        ("VOLUMETRIC", "saturates BANDWIDTH",
         "UDP flood, DNS and NTP amplification", c[0]),
        ("PROTOCOL", "exhausts CONNECTION STATE",
         "SYN flood, ping of death, fragmentation", c[1]),
        ("APPLICATION", "exhausts SERVER WORK",
         "HTTP flood, slowloris, expensive queries", c[2]),
    ]
    fig, ax = plt.subplots(figsize=(9.4, 4.0))
    for i, (name, what, egs, colour) in enumerate(kinds):
        y = (len(kinds) - 1 - i) * 1.05
        ax.add_patch(plt.Rectangle((0.3, y), 2.5, 0.82, facecolor=colour,
                                   alpha=0.2, edgecolor=colour, linewidth=1.6))
        ax.annotate(name, (1.55, y + 0.41), ha="center", va="center",
                    fontsize=9.4, color=ink)
        ax.annotate(what, (3.15, y + 0.55), fontsize=8.8, color=ink)
        ax.annotate(egs, (3.15, y + 0.24), fontsize=8.0, color=S.INK_2[mode])
    S.note(ax, 0.3, -0.75,
           "amplification multiplies a small spoofed request into a large reply aimed at the victim - "
           "the defence is at the reflector (disable open resolvers) as much as at the target",
           mode)
    ax.set_xlim(0, 11.4)
    ax.set_ylim(-1.15, 3.35)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# On-path (man-in-the-middle) interception and the three ways in.
# ---------------------------------------------------------------------------

@figure("cissp-mitm-path")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 4.2))
    nodes = [("CLIENT", 1.2, ink), ("ATTACKER\non path", 5.0, c[2]),
             ("SERVER", 8.8, ink)]
    for name, x, colour in nodes:
        ax.add_patch(plt.Rectangle((x - 1.0, 2.5), 2.0, 0.85, facecolor="none",
                                   edgecolor=colour, linewidth=1.8))
        ax.annotate(name, (x, 2.92), ha="center", va="center", fontsize=8.8,
                    color=ink)
    for x0, x1 in ((2.3, 3.9), (6.1, 7.7)):
        ax.annotate("", (x1, 2.92), (x0, 2.92),
                    arrowprops=dict(arrowstyle="<|-|>", color=c[2], linewidth=1.7))
    ax.annotate("the client believes it is talking to the server, and the server believes it is talking to the client",
                (5.0, 3.65), ha="center", fontsize=8.2, color=ink, style="italic")
    ways = [
        ("ARP poisoning", "forge MAC-to-IP bindings on the local segment",
         "dynamic ARP inspection, static entries"),
        ("Rogue access point / evil twin", "advertise a familiar SSID and win the association",
         "802.1X, WIPS, certificate-pinned VPN"),
        ("DNS spoofing / cache poisoning", "answer the name lookup before the real resolver",
         "DNSSEC, resolver hardening"),
    ]
    for i, (tag, how, fix) in enumerate(ways):
        y = 1.85 - i * 0.62
        ax.annotate(tag, (0.3, y), fontsize=8.4, color=c[2], va="center")
        ax.annotate(how, (3.55, y + 0.12), fontsize=7.8, color=ink, va="center")
        ax.annotate("defence: " + fix, (3.55, y - 0.14), fontsize=7.4,
                    color=S.INK_2[mode], va="center")
    S.note(ax, 0.3, -0.35,
           "end-to-end authenticated encryption defeats all three - the attacker still sees traffic, but cannot read or alter it",
           mode)
    ax.set_xlim(0, 11.0)
    ax.set_ylim(-0.75, 3.95)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Insecure protocols and their secure replacements, with IANA-registered
# default ports.
# ---------------------------------------------------------------------------

@figure("cissp-secure-protocol-pairs")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    pairs = [
        ("Telnet", "23", "SSH", "22", "remote shell"),
        ("FTP", "20/21", "SFTP / FTPS", "22 / 990", "file transfer"),
        ("HTTP", "80", "HTTPS", "443", "web"),
        ("SMTP", "25", "SMTP over TLS", "587 / 465", "mail submission"),
        ("POP3", "110", "POP3S", "995", "mail retrieval"),
        ("IMAP", "143", "IMAPS", "993", "mail retrieval"),
        ("LDAP", "389", "LDAPS", "636", "directory"),
        ("SNMP v1 / v2c", "161/162", "SNMP v3", "161/162", "device management"),
    ]
    fig, ax = plt.subplots(figsize=(9.8, 4.6))
    ax.annotate("INSECURE", (0.3, 8.55), fontsize=8.6, color=c[2])
    ax.annotate("SECURE REPLACEMENT", (4.3, 8.55), fontsize=8.6, color=c[0])
    ax.annotate("PURPOSE", (8.6, 8.55), fontsize=8.6, color=S.INK_2[mode])
    for i, (bad, bport, good, gport, use) in enumerate(pairs):
        y = len(pairs) - 1 - i
        ax.annotate(bad, (0.3, y + 0.3), fontsize=8.6, color=ink)
        ax.annotate(bport, (2.35, y + 0.3), fontsize=8.0, color=S.INK_2[mode])
        ax.annotate("", (4.15, y + 0.42), (3.35, y + 0.42),
                    arrowprops=dict(arrowstyle="-|>", color=c[0], linewidth=1.4))
        ax.annotate(good, (4.3, y + 0.3), fontsize=8.6, color=ink)
        ax.annotate(gport, (6.85, y + 0.3), fontsize=8.0, color=S.INK_2[mode])
        ax.annotate(use, (8.6, y + 0.3), fontsize=8.0, color=S.INK_2[mode])
    ax.set_xlim(0, 11.2)
    ax.set_ylim(-0.3, 9.0)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# IPsec transport vs tunnel mode: what is protected differs, and that is the
# whole exam question.
# ---------------------------------------------------------------------------

@figure("cissp-ipsec-modes")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 4.2))

    def packet(y, blocks, title, gloss):
        x = 0.35
        ax.annotate(title, (0.35, y + 1.02), fontsize=9.2, color=ink)
        for label, w, filled in blocks:
            ax.add_patch(plt.Rectangle((x, y), w, 0.62,
                                       facecolor=c[0] if filled else "none",
                                       alpha=0.28 if filled else 1.0,
                                       edgecolor=c[0] if filled else S.GUIDE[mode],
                                       linewidth=1.4))
            ax.annotate(label, (x + w / 2, y + 0.31), ha="center", va="center",
                        fontsize=7.8, color=ink)
            x += w + 0.08
        ax.annotate(gloss, (0.35, y - 0.3), fontsize=7.8, color=S.INK_2[mode])

    packet(2.35,
           [("original IP header", 2.3, False), ("IPsec header", 1.5, True),
            ("payload", 2.6, True)],
           "TRANSPORT MODE",
           "payload encrypted, ORIGINAL HEADER VISIBLE - host to host, inside a trusted network")
    packet(0.45,
           [("new IP header", 1.9, False), ("IPsec header", 1.5, True),
            ("original IP header", 2.3, True), ("payload", 2.6, True)],
           "TUNNEL MODE",
           "the WHOLE original packet is encapsulated and encrypted - gateway to gateway, the site-to-site VPN case")
    ax.annotate("shaded = protected", (7.4, 3.42), fontsize=8.0, color=c[0])
    ax.set_xlim(0, 10.4)
    ax.set_ylim(-0.1, 3.75)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# TLS handshake: asymmetric crypto is used to agree a SYMMETRIC session key,
# which then does the bulk work.  This is the hybrid model in one picture.
# ---------------------------------------------------------------------------

@figure("cissp-tls-handshake")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 4.6))
    for name, x in (("CLIENT", 1.3), ("SERVER", 8.3)):
        ax.add_patch(plt.Rectangle((x - 1.1, 4.05), 2.2, 0.68,
                                   facecolor="none", edgecolor=ink, linewidth=1.8))
        ax.annotate(name, (x, 4.39), ha="center", va="center", fontsize=9,
                    color=ink)
        ax.plot([x, x], [0.5, 4.0], color=S.GRID[mode], linewidth=1)
    steps = [
        (3.6, 1.3, 8.3, "1.  ClientHello - versions, cipher suites, random", c[0]),
        (3.05, 8.3, 1.3, "2.  ServerHello - chosen suite, certificate, random", c[0]),
        (2.5, 1.3, 8.3, "3.  key agreement (the client verifies the certificate first)", c[1]),
        (1.95, 1.3, 8.3, "4.  Finished, under the new keys", c[1]),
        (1.4, 8.3, 1.3, "5.  Finished - symmetric session established", c[2]),
    ]
    for y, x0, x1, label, colour in steps:
        ax.annotate("", (x1, y), (x0, y),
                    arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.7))
        ax.annotate(label, ((x0 + x1) / 2, y + 0.13), ha="center", fontsize=8.0,
                    color=ink)
    S.note(ax, 4.8, 0.75,
           "ASYMMETRIC crypto authenticates the server and agrees the key; SYMMETRIC crypto carries the data - "
           "ephemeral key agreement is what gives forward secrecy",
           mode, ha="center")
    ax.set_xlim(-0.4, 10.2)
    ax.set_ylim(0.15, 5.0)
    ax.axis("off")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# The CIA triad.  Definitional relationships only: each property, what it
# guarantees, and the failure that violates it (the DAD inverse).
# ---------------------------------------------------------------------------

@figure("cissp-cia-triad")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    import numpy as np
    fig, ax = plt.subplots(figsize=(8.8, 5.0))
    # triangle vertices
    pts = {"C": (5.0, 4.35), "I": (1.6, 0.95), "A": (8.4, 0.95)}
    tri = [pts["C"], pts["I"], pts["A"], pts["C"]]
    ax.plot([p[0] for p in tri], [p[1] for p in tri], color=S.GUIDE[mode],
            linewidth=1.6)
    spec = [
        ("C", "CONFIDENTIALITY", "only authorised entities\ncan read the data",
         "violated by DISCLOSURE", c[0]),
        ("I", "INTEGRITY", "no unauthorised\nmodification of the data",
         "violated by ALTERATION", c[1]),
        ("A", "AVAILABILITY", "authorised entities can access\nthe data when permitted",
         "violated by DESTRUCTION / DENIAL", c[2]),
    ]
    off = {"C": (0, 0.52), "I": (-0.25, -0.5), "A": (0.25, -0.5)}
    for k, name, what, dad, colour in spec:
        x, y = pts[k]
        ax.plot([x], [y], "o", color=colour, markersize=13)
        dx, dy = off[k]
        ha = "center"
        ax.annotate(name, (x + dx, y + dy + 0.28), ha=ha, fontsize=10.5,
                    color=colour)
        ax.annotate(what, (x + dx, y + dy - 0.12), ha=ha, fontsize=8.2,
                    color=ink)
        ax.annotate(dad, (x + dx, y + dy - 0.6), ha=ha, fontsize=7.8,
                    color=S.INK_2[mode], style="italic")
    ax.annotate("ASSETS\n(data, and the systems\nthat process it)", (5.0, 2.05),
                ha="center", fontsize=8.6, color=ink)
    ax.set_xlim(0, 10.0)
    ax.set_ylim(-0.8, 5.6)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# One physical/operational example per property - the three canonical control
# archetypes, drawn as control -> property -> failure prevented.
# ---------------------------------------------------------------------------

@figure("cissp-cia-examples")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    rows = [
        ("a LOCK on the cabinet", "CONFIDENTIALITY",
         "only key-holders can read the contents", c[0]),
        ("a VERSION-CONTROL baseline", "INTEGRITY",
         "copies are compared against a known-good reference", c[1]),
        ("a BACKUP of the data", "AVAILABILITY",
         "a destroyed primary is restored and service continues", c[2]),
    ]
    fig, ax = plt.subplots(figsize=(9.2, 3.6))
    for i, (ctl, prop, gloss, colour) in enumerate(rows):
        y = (len(rows) - 1 - i) * 1.05
        ax.add_patch(plt.Rectangle((0.3, y), 2.9, 0.8, facecolor="none",
                                   edgecolor=colour, linewidth=1.7))
        ax.annotate(ctl, (1.75, y + 0.4), ha="center", va="center",
                    fontsize=8.8, color=ink)
        ax.annotate("", (4.05, y + 0.4), (3.3, y + 0.4),
                    arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.7))
        ax.annotate(prop, (4.2, y + 0.4), va="center", fontsize=9.4, color=colour)
        ax.annotate(gloss, (6.75, y + 0.4), va="center", fontsize=8.0,
                    color=S.INK_2[mode])
    ax.annotate("the property names the GOAL; the control is one way to achieve it",
                (0.3, 3.45), fontsize=8.6, color=ink, style="italic")
    ax.set_xlim(0, 12.4)
    ax.set_ylim(-0.3, 3.8)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Properties BEYOND the triad: authenticity and non-repudiation, and where
# each sits relative to C, I and A.
# ---------------------------------------------------------------------------

@figure("cissp-beyond-cia")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.0, 3.9))
    core = [("CONFIDENTIALITY", c[0]), ("INTEGRITY", c[1]), ("AVAILABILITY", c[2])]
    for i, (name, colour) in enumerate(core):
        x = 0.5 + i * 2.55
        ax.add_patch(plt.Rectangle((x, 2.25), 2.25, 0.8, facecolor=colour,
                                   alpha=0.2, edgecolor=colour, linewidth=1.6))
        ax.annotate(name, (x + 1.12, 2.65), ha="center", va="center",
                    fontsize=8.6, color=ink)
    ax.annotate("THE TRIAD", (4.3, 3.45), ha="center", fontsize=8.6,
                color=S.INK_2[mode])
    extras = [
        ("AUTHENTICITY", "the data or message genuinely comes\nfrom its claimed origin", 2.15),
        ("NON-REPUDIATION", "the originator cannot credibly\ndeny the action afterwards", 6.45),
    ]
    for name, gloss, x in extras:
        ax.add_patch(plt.Rectangle((x - 1.55, 0.35), 3.1, 0.95, facecolor="none",
                                   edgecolor=ink, linewidth=1.6,
                                   linestyle=(0, (4, 2))))
        ax.annotate(name, (x, 1.02), ha="center", fontsize=8.8, color=ink)
        ax.annotate(gloss, (x, 0.62), ha="center", fontsize=7.4,
                    color=S.INK_2[mode])
        ax.annotate("", (x, 2.2), (x, 1.35),
                    arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                    linewidth=1.4))
    ax.annotate("desirable properties the triad does not name - both delivered by\nauthentication and cryptographic mechanisms covered in later domains",
                (4.3, -0.35), ha="center", fontsize=7.8, color=S.INK_2[mode])
    ax.set_xlim(0, 8.6)
    ax.set_ylim(-0.8, 3.8)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The written-governance hierarchy: policy > standards > guidelines >
# procedures, with authorship and force for each level.
# ---------------------------------------------------------------------------

@figure("cissp-governance-hierarchy")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    tiers = [
        ("POLICY", "senior management", "MANDATORY - strategic direction", 2.1, c[0]),
        ("STANDARDS", "internal, or external (law,\nindustry, professional bodies)",
         "MANDATORY - explicit expectations", 3.3, c[1]),
        ("GUIDELINES", "internal or external", "RECOMMENDED - not mandates", 4.5, c[2]),
        ("PROCEDURES", "practitioners and SMEs",
         "MANDATORY IN USE - step-by-step; most detailed", 5.7, c[0]),
    ]
    fig, ax = plt.subplots(figsize=(9.2, 4.8))
    for i, (name, author, force, w, colour) in enumerate(tiers):
        y = (len(tiers) - 1 - i) * 1.12
        x0 = (7.4 - w) / 2 - 1.4
        ax.add_patch(plt.Rectangle((x0, y), w, 0.85, facecolor=colour,
                                   alpha=0.2, edgecolor=colour, linewidth=1.7))
        ax.annotate(name, (x0 + w / 2, y + 0.42), ha="center", va="center",
                    fontsize=9.6, color=ink)
        ax.annotate(author, (6.05, y + 0.58), fontsize=7.8, color=ink)
        ax.annotate(force, (6.05, y + 0.2), fontsize=7.6, color=S.INK_2[mode])
    ax.annotate("WHO AUTHORS IT", (6.05, 4.72), fontsize=8.2, color=ink)
    ax.annotate("", (-1.15, 0.25), (-1.15, 4.2),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                linewidth=1.5))
    ax.annotate("more detail,\nless authority", (-1.15, -0.35), ha="center",
                fontsize=7.4, color=S.INK_2[mode])
    ax.set_xlim(-1.9, 10.8)
    ax.set_ylim(-0.85, 5.0)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Policy lifecycle: drafted by SMEs, reviewed by stakeholders, approved and
# published by senior management, then reviewed on a cycle.
# ---------------------------------------------------------------------------

@figure("cissp-policy-lifecycle")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    steps = [
        ("DRAFT", "subject matter experts write it", c[0]),
        ("REVIEW", "stakeholders comment; revisions", c[1]),
        ("APPROVE", "senior management signs - the act\nthat gives it authority", c[2]),
        ("PUBLISH", "promulgated to everyone it binds", c[0]),
        ("MAINTAIN", "reviewed on a schedule and on\nmajor change", c[1]),
    ]
    fig, ax = plt.subplots(figsize=(9.6, 3.4))
    for i, (name, gloss, colour) in enumerate(steps):
        x = 0.3 + i * 2.1
        ax.add_patch(plt.Rectangle((x, 1.5), 1.75, 0.8, facecolor="none",
                                   edgecolor=colour, linewidth=1.8))
        ax.annotate(name, (x + 0.87, 1.9), ha="center", va="center",
                    fontsize=9.2, color=ink)
        ax.annotate(gloss, (x + 0.87, 1.06), ha="center", fontsize=7.0,
                    color=S.INK_2[mode])
        if i < len(steps) - 1:
            ax.annotate("", (x + 2.06, 1.9), (x + 1.79, 1.9),
                        arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                        linewidth=1.5))
    # maintain loops back to draft
    ax.annotate("", (1.17, 2.62), (9.0, 2.62),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                linewidth=1.3, linestyle=(0, (4, 3)),
                                connectionstyle="arc3,rad=-0.12"))
    ax.annotate("revision triggers a new cycle", (5.1, 3.0), ha="center",
                fontsize=7.6, color=S.INK_2[mode])
    ax.set_xlim(0, 10.8)
    ax.set_ylim(0.55, 3.3)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Where standards come from: internal vs the four external source families.
# ---------------------------------------------------------------------------

@figure("cissp-standards-sources")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.0, 4.1))
    ax.add_patch(plt.Rectangle((3.4, 1.55), 2.4, 0.95, facecolor=c[0],
                               alpha=0.22, edgecolor=c[0], linewidth=1.8))
    ax.annotate("STANDARDS\nthe organisation must meet", (4.6, 2.02),
                ha="center", va="center", fontsize=8.8, color=ink)
    srcs = [
        ("INTERNAL", "the organisation's own mandates", 0.9, 3.6),
        ("STATUTORY / ADMINISTRATIVE LAW", "legislation and regulators", 8.3, 3.6),
        ("CASE LAW", "court decisions that set precedent", 0.9, 0.45),
        ("PROFESSIONAL AND INDUSTRY BODIES", "practice standards, sector baselines", 8.3, 0.45),
    ]
    for name, gloss, x, y in srcs:
        ax.add_patch(plt.Rectangle((x - 0.85, y - 0.32), 1.7, 0.0, facecolor="none"))
        ax.annotate(name, (x, y + 0.22), ha="center", fontsize=7.9, color=c[1])
        ax.annotate(gloss, (x, y - 0.1), ha="center", fontsize=7.2,
                    color=S.INK_2[mode])
        tx = 3.55 if x < 4.6 else 5.65
        ty = 2.4 if y > 2 else 1.65
        ax.annotate("", (tx, ty), (x, y - (0.25 if y > 2 else -0.35)),
                    arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                    linewidth=1.4))
    S.note(ax, 4.6, -0.5,
           "non-conformance is evidence of negligence: it adds fines and lawsuits on top of breach costs, "
           "while documented good-faith adherence attenuates liability",
           mode, ha="center")
    ax.set_xlim(-0.6, 9.8)
    ax.set_ylim(-0.95, 4.35)
    ax.axis("off")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Computer crime classes, each mapped to the traditional crime it modernises.
# Definitional pairings from the module scope.
# ---------------------------------------------------------------------------

@figure("cissp-cybercrime-taxonomy")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    rows = [
        ("Unauthorised access", "trespassing", "entering the system at all is the offence"),
        ("Ransomware", "extortion", "deny the victim their own data, sell it back"),
        ("Data / hardware theft", "theft", "the asset is information or what holds it"),
        ("Illegal use of resources", "conversion", "victim storage or CPU used for the attacker's ends"),
        ("Online fraud", "fraud", "impersonation and appeals to greed or sympathy"),
        ("Malware creation / spread", "(new statute)", "criminalised in many jurisdictions in itself"),
    ]
    fig, ax = plt.subplots(figsize=(9.6, 4.4))
    ax.annotate("MODERN OFFENCE", (0.3, 6.35), fontsize=8.6, color=c[0])
    ax.annotate("TRADITIONAL CRIME", (3.6, 6.35), fontsize=8.6, color=c[1])
    ax.annotate("WHAT CHANGED", (6.15, 6.35), fontsize=8.6, color=S.INK_2[mode])
    for i, (modern, old, gloss) in enumerate(rows):
        y = len(rows) - 1 - i
        ax.annotate(modern, (0.3, y + 0.3), fontsize=8.8, color=ink)
        ax.annotate("", (3.45, y + 0.42), (2.95, y + 0.42),
                    arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.3))
        ax.annotate(old, (3.6, y + 0.3), fontsize=8.6, color=c[1])
        ax.annotate(gloss, (6.15, y + 0.3), fontsize=7.9, color=S.INK_2[mode])
    ax.annotate("reach, speed, and efficiency are what the technology adds - the underlying wrongs are old",
                (0.3, -0.7), fontsize=8.0, color=ink, style="italic")
    ax.set_xlim(0, 11.6)
    ax.set_ylim(-1.05, 6.7)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The five traits a DRM solution should have.
# ---------------------------------------------------------------------------

@figure("cissp-drm-traits")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    traits = [
        ("PERSISTENCY", "protection travels with the material wherever it goes"),
        ("DYNAMIC POLICY CONTROL", "central administration can change permissions after distribution"),
        ("AUTOMATIC EXPIRATION", "rights lapse on schedule - licences end, or material enters the public domain"),
        ("CONTINUOUS AUDIT TRAIL", "each protected object records its own access events"),
        ("INTEROPERABILITY", "works with the environment's existing access control, files, and mail"),
    ]
    fig, ax = plt.subplots(figsize=(9.4, 4.2))
    ax.add_patch(plt.Rectangle((0.3, 4.65), 3.3, 0.75, facecolor=c[0], alpha=0.2,
                               edgecolor=c[0], linewidth=1.7))
    ax.annotate("DRM-PROTECTED OBJECT", (1.95, 5.02), ha="center", va="center",
                fontsize=9.0, color=ink)
    for i, (name, gloss) in enumerate(traits):
        y = (len(traits) - 1 - i) * 0.9
        ax.plot([1.95, 1.15], [4.6, y + 0.62], color=S.GRID[mode], linewidth=0.9)
        ax.annotate(name, (0.55, y + 0.42), fontsize=8.6, color=c[i % 3])
        ax.annotate(gloss, (4.15, y + 0.42), fontsize=8.0, color=S.INK_2[mode])
    ax.set_xlim(0, 11.2)
    ax.set_ylim(-0.25, 5.6)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Lawful paths for personal data of EU data subjects to leave the EU.
# Mechanism structure; the specific vehicles have changed over time.
# ---------------------------------------------------------------------------

@figure("cissp-transborder-paths")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.4, 4.4))
    ax.add_patch(plt.Rectangle((0.3, 1.6), 2.2, 1.3, facecolor=c[0], alpha=0.18,
                               edgecolor=c[0], linewidth=1.8))
    ax.annotate("EU personal\ndata", (1.4, 2.25), ha="center", va="center",
                fontsize=9.2, color=ink)
    paths = [
        ("ADEQUACY", "the destination country's own privacy law\nis recognised as equivalent", 3.6, c[0]),
        ("CERTIFIED FRAMEWORK", "the receiving company enrols in an approved\nprogramme and self-certifies, with a regulator", 2.25, c[1]),
        ("STANDARD CONTRACTUAL CLAUSES", "approved contract language binds this\ntransfer to EU-grade protection", 0.9, c[2]),
    ]
    for name, gloss, y, colour in paths:
        ax.annotate("", (4.05, y), (2.6, 2.25),
                    arrowprops=dict(arrowstyle="-|>", color=colour, linewidth=1.8))
        ax.annotate(name, (4.2, y + 0.22), fontsize=8.8, color=colour)
        ax.annotate(gloss, (4.2, y - 0.26), fontsize=7.6, color=S.INK_2[mode])
    ax.annotate("no lawful path = the transfer may not happen, however easy it is technically",
                (0.35, 0.0), fontsize=8.0, color=ink, style="italic")
    ax.set_xlim(0, 10.6)
    ax.set_ylim(-0.4, 4.35)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Privacy roles and where liability sits.
# ---------------------------------------------------------------------------

@figure("cissp-privacy-roles")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.6, 4.2))
    boxes = [
        ("DATA SUBJECT", "the human being\nthe data is about", 1.2, 3.0, ink),
        ("DATA OWNER /\nCONTROLLER", "collects or creates the data;\nLEGALLY LIABLE for it", 4.7, 3.0, c[0]),
        ("DATA PROCESSOR", "handles data on the\ncontroller's behalf", 8.2, 3.0, c[1]),
        ("DATA CUSTODIAN", "manages it day to day for the\nowner - DBA, sysadmin", 4.7, 0.8, c[2]),
    ]
    for name, gloss, x, y, colour in boxes:
        ax.add_patch(plt.Rectangle((x - 1.35, y - 0.5), 2.7, 1.0,
                                   facecolor="none", edgecolor=colour, linewidth=1.8))
        ax.annotate(name, (x, y + 0.16), ha="center", va="center", fontsize=8.6, color=ink)
        ax.annotate(gloss, (x, y - 0.98), ha="center", fontsize=7.4, color=S.INK_2[mode])
    ax.annotate("", (3.3, 3.0), (2.6, 3.0),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.5))
    ax.annotate("PII about", (2.95, 3.28), ha="center", fontsize=7.4, color=ink)
    ax.annotate("", (6.8, 3.0), (6.1, 3.0),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.5))
    ax.annotate("engages", (6.45, 3.28), ha="center", fontsize=7.4, color=ink)
    ax.annotate("", (4.7, 1.35), (4.7, 2.45),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.5))
    S.note(ax, 4.8, -0.85,
           "liability does not transfer: the controller answers for unauthorised disclosure "
           "even when the processor was the negligent party",
           mode, ha="center")
    ax.set_xlim(-0.4, 10.2)
    ax.set_ylim(-1.25, 3.9)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Education / training / awareness continuum: formality, provider, audience.
# ---------------------------------------------------------------------------

@figure("cissp-learning-continuum")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    cols = [
        ("EDUCATION", "formal", "academic institutions;\ndegrees, certifications",
         "practitioners\nand experts", c[0]),
        ("TRAINING", "semi-formal", "the organisation or vendors;\ndocumented and tracked",
         "staff with\nspecific duties", c[1]),
        ("AWARENESS", "informal", "reminders, drills, posters;\noften unscheduled",
         "everyone", c[2]),
    ]
    fig, ax = plt.subplots(figsize=(9.4, 4.2))
    for i, (name, formality, who, audience, colour) in enumerate(cols):
        x = 0.4 + i * 3.15
        ax.add_patch(plt.Rectangle((x, 1.7), 2.75, 1.5, facecolor=colour,
                                   alpha=0.16, edgecolor=colour, linewidth=1.7))
        ax.annotate(name, (x + 1.37, 2.9), ha="center", fontsize=9.6, color=ink)
        ax.annotate(formality.upper(), (x + 1.37, 2.5), ha="center", fontsize=8.0,
                    color=colour)
        ax.annotate(who, (x + 1.37, 1.28), ha="center", fontsize=7.4,
                    color=S.INK_2[mode])
        ax.annotate(audience, (x + 1.37, 0.55), ha="center", fontsize=7.8, color=ink)
    ax.annotate("AUDIENCE:", (0.4, 0.62), fontsize=7.8, color=ink, ha="right")
    ax.annotate("", (9.4, 3.62), (0.5, 3.62),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.4))
    ax.annotate("decreasing formality, widening audience", (4.95, 3.82),
                ha="center", fontsize=8.0, color=S.INK_2[mode])
    ax.set_xlim(-0.9, 10.2)
    ax.set_ylim(0.15, 4.2)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Delivery methods with the trade each makes.
# ---------------------------------------------------------------------------

@figure("cissp-delivery-methods")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    rows = [
        ("Computer-based training", "self-paced, standardised, auto-tracked, cheap at scale",
         "click-through without retention", c[0]),
        ("Live instruction", "counters click-through; real-time questions; builds rapport",
         "scheduling burden; needs an SME who can also teach", c[1]),
        ("Reward mechanisms", "reinforces correct behaviour; goodwill toward security",
         "must be sustained and seen as fair", c[2]),
        ("Regular communications", "keeps security visible - newsletters, posters, signage",
         "passive; no assessment of uptake", c[0]),
    ]
    fig, ax = plt.subplots(figsize=(9.8, 4.0))
    ax.annotate("METHOD", (0.3, 4.35), fontsize=8.6, color=ink)
    ax.annotate("STRENGTH", (3.35, 4.35), fontsize=8.6, color=c[1])
    ax.annotate("WEAKNESS", (8.15, 4.35), fontsize=8.6, color=S.INK_2[mode])
    for i, (m, s_, w, colour) in enumerate(rows):
        y = (len(rows) - 1 - i) * 1.02
        ax.add_patch(plt.Rectangle((0.3, y), 2.7, 0.75, facecolor=colour, alpha=0.16,
                                   edgecolor=colour, linewidth=1.4))
        ax.annotate(m, (1.65, y + 0.37), ha="center", va="center", fontsize=8.2, color=ink)
        ax.annotate(s_, (3.35, y + 0.37), va="center", fontsize=7.8, color=ink)
        ax.annotate(w, (8.15, y + 0.37), va="center", fontsize=7.6, color=S.INK_2[mode])
    ax.set_xlim(0, 12.4)
    ax.set_ylim(-0.25, 4.7)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The programme loop: deliver -> evaluate -> review content -> redeliver.
# ---------------------------------------------------------------------------

@figure("cissp-awareness-lifecycle")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    steps = [
        ("DEVELOP", "content built to current threats,\nlaws, tools, and policy", 1.4, 2.9, c[0]),
        ("DELIVER", "CBT, live sessions, rewards,\ncommunications", 4.8, 2.9, c[1]),
        ("EVALUATE", "participant testing, social-engineering\ntests, log review", 8.2, 2.9, c[2]),
        ("REVIEW CONTENT", "SMEs and external reviewers check\ncurrency and accuracy", 4.8, 0.75, c[0]),
    ]
    for name, gloss, x, y, colour in steps:
        pass
    fig, ax = plt.subplots(figsize=(9.4, 4.2))
    for name, gloss, x, y, colour in steps:
        ax.add_patch(plt.Rectangle((x - 1.3, y - 0.42), 2.6, 0.84,
                                   facecolor="none", edgecolor=colour, linewidth=1.8))
        ax.annotate(name, (x, y), ha="center", va="center", fontsize=8.8, color=ink)
        ax.annotate(gloss, (x, y - 0.88), ha="center", fontsize=7.2,
                    color=S.INK_2[mode])
    ax.annotate("", (3.45, 2.9), (2.75, 2.9),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.6))
    ax.annotate("", (6.85, 2.9), (6.15, 2.9),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.6))
    ax.annotate("", (6.15, 0.9), (8.2, 2.42),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.6,
                                connectionstyle="arc3,rad=0.25"))
    ax.annotate("", (1.4, 2.42), (3.45, 0.9),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.6,
                                connectionstyle="arc3,rad=0.25"))
    ax.annotate("dated material is not just ineffective - it is a vulnerability",
                (4.8, 4.0), ha="center", fontsize=8.4, color=ink, style="italic")
    ax.set_xlim(-0.4, 10.2)
    ax.set_ylim(-0.75, 4.35)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The four canons, in order of precedence.
# ---------------------------------------------------------------------------

@figure("cissp-ethics-canons")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    canons = [
        ("I", "Protect society, the common good, necessary public\ntrust and confidence, and the infrastructure", c[0]),
        ("II", "Act honorably, honestly, justly, responsibly, and legally", c[1]),
        ("III", "Provide diligent and competent service to principals", c[2]),
        ("IV", "Advance and protect the profession", c[0]),
    ]
    fig, ax = plt.subplots(figsize=(9.2, 4.4))
    for i, (num, text, colour) in enumerate(canons):
        y = (len(canons) - 1 - i) * 1.12
        ax.add_patch(plt.Rectangle((0.85, y), 0.75, 0.9, facecolor=colour,
                                   alpha=0.25, edgecolor=colour, linewidth=1.7))
        ax.annotate(num, (1.22, y + 0.45), ha="center", va="center",
                    fontsize=11, color=ink)
        ax.annotate(text, (1.95, y + 0.45), va="center", fontsize=8.8, color=ink)
    ax.annotate("", (0.45, 0.35), (0.45, 4.2),
                arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode], linewidth=1.5))
    ax.annotate("order IS precedence:\nwhen canons conflict,\nthe earlier one wins",
                (0.4, -0.75), fontsize=7.6, color=S.INK_2[mode])
    ax.annotate("adhere, and BE SEEN to adhere - strict adherence is a condition of certification",
                (0.85, 4.72), fontsize=8.2, color=ink, style="italic")
    ax.set_xlim(0, 10.4)
    ax.set_ylim(-1.05, 5.05)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# The ethics complaint process, in order.
# ---------------------------------------------------------------------------

@figure("cissp-ethics-complaint-process")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    steps = [
        ("COMPLAINT", "filed with the body", c[0]),
        ("FINDING\nOF FACTS", "the matter is investigated", c[1]),
        ("REBUTTAL", "the accused member\nresponds", c[2]),
        ("COMMITTEE\nREVIEW", "member sees findings and\nrecommendations first,\nand may comment", c[0]),
        ("BOARD\nRULING", "final disposition - up to\nrevocation of certification", c[1]),
    ]
    fig, ax = plt.subplots(figsize=(9.8, 3.6))
    for i, (name, gloss, colour) in enumerate(steps):
        x = 0.35 + i * 2.12
        ax.add_patch(plt.Rectangle((x, 1.65), 1.8, 1.0, facecolor="none",
                                   edgecolor=colour, linewidth=1.8))
        ax.annotate(name, (x + 0.9, 2.15), ha="center", va="center",
                    fontsize=8.4, color=ink)
        ax.annotate(gloss, (x + 0.9, 1.05), ha="center", fontsize=6.9,
                    color=S.INK_2[mode])
        if i < len(steps) - 1:
            ax.annotate("", (x + 2.08, 2.15), (x + 1.84, 2.15),
                        arrowprops=dict(arrowstyle="-|>", color=S.GUIDE[mode],
                                        linewidth=1.5))
    ax.annotate("due process throughout: the accused is heard at every stage before any sanction",
                (5.1, 3.15), ha="center", fontsize=8.2, color=ink, style="italic")
    ax.set_xlim(0, 11.0)
    ax.set_ylim(0.45, 3.5)
    ax.axis("off")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
# Legal hold: notice of pending action freezes destruction, overriding every
# retention schedule and policy beneath it.
# ---------------------------------------------------------------------------

@figure("cissp-legal-hold")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(9.2, 4.0))
    ax.plot([0.5, 9.0], [2.4, 2.4], color=S.GRID[mode], linewidth=1.2)
    ax.annotate("normal operation:\nretention schedules run,\nexpired data is destroyed on policy",
                (1.9, 3.0), ha="center", fontsize=7.8, color=S.INK_2[mode])
    ax.axvline(4.6, color=c[2], linewidth=2.2, ymin=0.22, ymax=0.85)
    ax.annotate("NOTICE of pending legal\naction or investigation", (4.6, 3.45),
                ha="center", fontsize=8.6, color=c[2])
    ax.annotate("LEGAL HOLD:\nno deletion or destruction of relevant data,\nphysical or electronic",
                (7.15, 3.0), ha="center", fontsize=7.9, color=ink)
    ax.annotate("", (6.6, 2.4), (4.75, 2.4),
                arrowprops=dict(arrowstyle="-|>", color=c[2], linewidth=1.8))
    rows = [
        ("internal retention policy", "overridden"),
        ("privacy-law destruction duties", "overridden"),
        ("routine sanitisation schedules", "suspended for the held data"),
    ]
    for i, (what, state) in enumerate(rows):
        y = 1.55 - i * 0.45
        ax.annotate(what, (1.0, y), fontsize=7.9, color=ink, va="center")
        ax.annotate(state.upper(), (4.9, y), fontsize=7.6, color=c[2], va="center")
    S.note(ax, 4.75, -0.05,
           "the preservation duty takes precedence over other law and internal policy - "
           "destroying data after notice is obstruction, whatever the policy said",
           mode, ha="center")
    ax.set_xlim(0.2, 9.4)
    ax.set_ylim(-0.45, 3.95)
    ax.axis("off")
    fig.tight_layout()
    return fig



# ---------------------------------------------------------------------------
# Domain 1 module map: the ten content modules and the through-lines that
# connect them.  Structure mirrors the Instructor Edition's module list.
# ---------------------------------------------------------------------------

@figure("cissp-d1-map")
def _(mode):
    ink = S.INK[mode]
    c = S.SERIES[mode]
    mods = [
        ("1", "CIA concepts", 0, 0),
        ("2", "Governance", 1, 0),
        ("3", "Risk mgmt", 2, 0),
        ("4", "Compliance", 3, 0),
        ("5", "Legal, global", 4, 0),
        ("6", "Policy stack", 0, 1),
        ("7", "Personnel", 1, 1),
        ("8", "Awareness", 2, 1),
        ("9", "Business continuity", 3, 1),
        ("10", "Ethics", 4, 1),
    ]
    fig, ax = plt.subplots(figsize=(9.6, 4.4))
    for num, name, col, row in mods:
        x = 0.4 + col * 1.95
        y = 2.75 - row * 1.55
        colour = c[int(num) % 3]
        ax.add_patch(plt.Rectangle((x, y), 1.7, 0.95, facecolor=colour,
                                   alpha=0.15, edgecolor=colour, linewidth=1.5))
        ax.annotate(num, (x + 0.18, y + 0.72), fontsize=8.0, color=colour)
        ax.annotate(name, (x + 0.85, y + 0.4), ha="center", va="center",
                    fontsize=8.2, color=ink)
    lines = [
        ("the triad names WHAT is protected; risk prices it; BC engineers the A", c[0], 4.15),
        ("governance directs; the policy stack writes it down; personnel and awareness carry it to people", c[1], 3.93),
        ("compliance, law, and ethics are the OUTSIDE forces the programme answers to", c[2], 3.71),
    ]
    for text, colour, y in lines:
        ax.plot([0.45, 0.62], [y + 0.03, y + 0.03], color=colour, linewidth=2.5)
        ax.annotate(text, (0.75, y), fontsize=7.6, color=S.INK_2[mode], va="center")
    ax.annotate("DOMAIN 1: ten content modules, one review", (0.4, 0.75),
                fontsize=8.6, color=ink)
    ax.set_xlim(0, 10.4)
    ax.set_ylim(0.45, 4.45)
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
