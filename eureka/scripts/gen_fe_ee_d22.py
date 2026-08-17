#!/usr/bin/env python3
"""Depth-wave-22 figures for the FE Electrical and Computer course:
the two Ethics & Professional Practice chapters on codes of ethics
(fee_codes_ethics) and on licensure and authority (fee_licensure).

Same contract as gen_fe_ee_d20.py, and it imports the SAME style module rather
than growing a second look. Ethics is not a numeric subject, so every figure
here is deliberately drawn from the part of professional practice that genuinely
IS quantitative: risk and expected loss, structural reliability, exposure across
a fleet, materiality ratios, review coverage, and the hour-and-month arithmetic
of licensure. Every curve is COMPUTED, in this file, from a relation the lesson
that references it writes out. Nothing is traced, scanned, redrawn or adapted
from any code of ethics, board rule, handbook or textbook — codes of ethics are
copyrighted text and this pipeline never consumes anyone's words or anyone's
drawing, only arithmetic.

Where a figure uses a threshold (a tolerable-risk level, a carry-over cap, a
required number of professional development hours), the threshold is a PARAMETER
STATED IN THE LESSON, not a claim about what any jurisdiction requires. Those
numbers vary by board and the lesson says so.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at 1e-9 wherever the
quantity is exact in closed form and at the last quoted digit otherwise. The
important assertions are written twice over — once by the closed form and once
by an independent route (a term-by-term product instead of a power, a
period-by-period ledger instead of a recursion in closed form, a numeric
integral of the normal density instead of the error function) — because a
formula that agrees with its own algebra and not with a count is wrong in
exactly the way that matters to a student with a calculator.

Usage:
    python3 scripts/gen_fe_ee_d22.py             # all
    python3 scripts/gen_fe_ee_d22.py eth2-risk   # only names with that prefix
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith("eth2-"):
        raise ValueError(f"this generator owns only the eth2- prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# --------------------------------------------------------------- primitives
def phi(z: float) -> float:
    """Standard normal CDF, from the error function."""
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def phi_quad(z: float, n: int = 400000) -> float:
    """Independent route to the same CDF: Simpson on the density.

    Used only to check phi(); it never feeds a plotted curve.
    """
    lo = -12.0
    if z <= lo:
        return 0.0
    h = (z - lo) / n
    x = lo + h * np.arange(n + 1)
    y = np.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)
    w = np.ones(n + 1)
    w[1:-1:2] = 4.0
    w[2:-1:2] = 2.0
    return float(h / 3.0 * np.dot(w, y))


def p_any(p: float, n: int) -> float:
    """Probability at least one of n independent units fails."""
    return 1.0 - (1.0 - p) ** n


def p_any_product(p: float, n: int) -> float:
    """Same quantity by an explicit n-fold product rather than a power."""
    acc = 1.0
    for _ in range(n):
        acc *= (1.0 - p)
    return 1.0 - acc


def beta_index(mu_c, sd_c, mu_d, sd_d):
    """Reliability index for independent normal capacity and demand."""
    return (mu_c - mu_d) / math.sqrt(sd_c * sd_c + sd_d * sd_d)


def pdh_ledger(earned, required, cap):
    """Carry-over ledger: available, surplus, carried, wasted, per cycle."""
    carry, rows = 0.0, []
    for e in earned:
        avail = e + carry
        surplus = max(avail - required, 0.0)
        carried = min(surplus, cap)
        rows.append(dict(earned=e, carry_in=carry, avail=avail,
                         surplus=surplus, carried=carried,
                         wasted=surplus - carried,
                         deficit=max(required - avail, 0.0)))
        carry = carried
    return rows


# ---------------------------------------------------------------------------
# fee_codes_ethics
# ---------------------------------------------------------------------------

# Severity band s = 1..5 carries a representative consequence, likelihood band
# l = 1..5 a representative annual frequency. Both ladders step by a decade, so
# the true expected loss is C f = 10^(s + l - 4) while the matrix score is s l.
CONSEQ = [1.0e3, 1.0e4, 1.0e5, 1.0e6, 1.0e7]
FREQ = [1.0e-5, 1.0e-4, 1.0e-3, 1.0e-2, 1.0e-1]


@figure("eth2-risk-matrix")
def _(mode):
    """The 5x5 matrix score s*l beside the expected loss the bands imply.

    The bands used to colour the left panel are the ones the lesson states:
    s*l <= 4 broadly acceptable, 5..12 tolerable only if reduced, >= 15 not
    accepted. The iso-risk boundaries are the hyperbolas l = 4/s and l = 12/s.
    The right panel is C f for the same cells; because both ladders are decades,
    iso-expected-loss lines are the ANTI-DIAGONALS s + l = const, which is a
    different family of curves, and that mismatch is the whole point.
    """
    c = S.SERIES[mode]
    s = np.arange(1, 6)
    lv = np.arange(1, 6)
    score = np.outer(lv, s)  # rows = likelihood, cols = severity

    # cell counts per band, and the rank inversion the lesson quotes
    assert score.max() == 25 and score.min() == 1
    assert int((score <= 4).sum()) == 8, int((score <= 4).sum())
    assert int(((score >= 5) & (score <= 12)).sum()) == 11
    assert int((score >= 15).sum()) == 6
    assert 8 + 11 + 6 == 25
    exp_loss = np.array([[CONSEQ[j] * FREQ[i] for j in range(5)] for i in range(5)])
    for i in range(5):
        for j in range(5):
            assert abs(exp_loss[i, j] - 10.0 ** (j + i - 2)) < 1e-9 * max(1.0, exp_loss[i, j])
    # severity 1 at likelihood 5 scores 5 and loses 100 a year;
    # severity 2 at likelihood 3 scores 6 and loses only 10 a year.
    assert score[4, 0] == 5 and abs(exp_loss[4, 0] - 100.0) < 1e-9
    assert score[2, 1] == 6 and abs(exp_loss[2, 1] - 10.0) < 1e-9
    assert exp_loss[2, 1] * 10.0 == exp_loss[4, 0]

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(8.4, 4.1))
    band_colours = [c[2], c[1], c[0]]
    for ax, grid, title, fmt in (
            (a1, score, "matrix score  R = S x L", "{:.0f}"),
            (a2, exp_loss, "expected loss  C f  (per year)", None)):
        for i in range(5):
            for j in range(5):
                v = score[i, j]
                band = 0 if v <= 4 else (1 if v <= 12 else 2)
                ax.add_patch(plt.Rectangle((j + 0.5, i + 0.5), 1, 1,
                                           facecolor=band_colours[band], alpha=0.20,
                                           edgecolor=S.GRID[mode], lw=0.8))
                txt = fmt.format(grid[i, j]) if fmt else f"{grid[i, j]:,.10g}"
                ax.text(j + 1, i + 1, txt, ha="center", va="center",
                        fontsize=9.5 if fmt else 7.4, color=S.INK[mode])
        ax.set_xlim(0.5, 5.5)
        ax.set_ylim(0.5, 6.5)
        ax.set_xticks(s)
        ax.set_yticks(lv)
        ax.set_xlabel("severity band  S")
        ax.set_title(title)
        ax.grid(False)
        S.strip(ax)
    a1.set_ylabel("likelihood band  L")
    xs = np.linspace(0.82, 5.6, 400)
    for k in (4, 12):
        y = k / xs
        m = (y >= 0.5) & (y <= 5.5)
        a1.plot(xs[m], y[m], color=S.GUIDE[mode], lw=1.4, ls="--")
    for tot in (4, 6):
        a2.plot([0.6, 5.4], [tot - 0.6, tot - 5.4], color=S.GUIDE[mode], lw=1.4, ls="--")
    S.note(a1, 0.55, 5.75, "dashed: the band edges R = 4 and R = 12", mode, size=8.4)
    S.note(a2, 0.55, 5.75, "dashed: equal expected loss, S + L constant", mode, size=8.4)
    fig.suptitle("A matrix multiplies ranks; money multiplies quantities",
                 color=S.INK[mode], fontsize=12, fontweight="semibold")
    fig.subplots_adjust(top=0.86)
    return fig


@figure("eth2-fleet-exposure")
def _(mode):
    """P(at least one failure) = 1 - (1 - p)^N against fleet size N.

    Three per-unit probabilities, log x-axis, with the Poisson form
    1 - exp(-N p) overlaid on the middle curve. The lesson quotes N = 12,000.
    """
    c = S.SERIES[mode]
    n = np.unique(np.round(np.logspace(0, 5, 900)).astype(int))
    fig, ax = plt.subplots()
    for k, (p, at) in enumerate(((1e-3, 300), (1e-4, 3000), (1e-5, 30000))):
        y = 1.0 - (1.0 - p) ** n
        ax.semilogx(n, y, color=c[k], lw=2.2)
        S.label_end(ax, at, 1.0 - (1.0 - p) ** at,
                    f"p = {p:.0e}".replace("e-0", "e-"), c[k], mode,
                    dx=-8, dy=12, ha="right")
    poisson = 1.0 - np.exp(-n * 1e-4)
    ax.semilogx(n, poisson, color=S.GUIDE[mode], lw=1.3, ls=(0, (5, 3)))

    exact = p_any(1e-4, 12000)
    assert abs(exact - 0.698823860) < 5e-9, exact
    assert abs(p_any_product(1e-4, 12000) - exact) < 1e-12
    approx = 1.0 - math.exp(-1.2)
    assert abs(approx - 0.698805788) < 5e-9, approx
    assert abs(exact - approx - 1.8072e-5) < 5e-10, exact - approx
    assert abs(p_any(1e-5, 12000) - 0.113080095) < 5e-9, p_any(1e-5, 12000)
    assert abs(p_any(1e-3, 12000) - 0.999993893) < 5e-9, p_any(1e-3, 12000)
    # the expected count is exactly N p whatever the probability of "at least one"
    assert abs(12000 * 1e-4 - 1.2) < 1e-12

    for p, k in ((1e-3, 0), (1e-4, 1), (1e-5, 2)):
        ax.plot([12000], [p_any(p, 12000)], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axvline(12000, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.35, 0.80, "fleet of 12,000 units:\n0.6988 at p = 1e-4,\n"
                           "expected count N p = 1.2", mode)
    S.note(ax, 1.35, 0.52, "dashed: the Poisson form 1 - exp(-N p),\n"
                           "which agrees to five decimal places", mode)
    ax.set_xlabel("units in the field  N")
    ax.set_ylabel("probability at least one unit fails")
    ax.set_title("One unit is safe; a fleet is a different question")
    ax.set_ylim(0, 1.05)
    S.strip(ax)
    return fig


@figure("eth2-expected-loss")
def _(mode):
    """Expected harm cost against per-unit failure probability, with two lines.

    Fleet N = 12,000, consequence per failure 180,000, unit fix cost 42.
    Money route: the fix is worth it above p* = 42/180,000 = 2.3333e-4.
    Safety route: at a fatality fraction q = 0.02 and a disproportion benchmark
    of 12,000,000 per averted fatality, the fix is justified above
    p = 42/(0.02 x 12,000,000) = 1.75e-4.
    """
    c = S.SERIES[mode]
    N, C, unit, q, B = 12000, 180000.0, 42.0, 0.02, 12.0e6
    p = np.logspace(-5, -2, 700)
    harm = N * p * C
    fix = N * unit

    p_money = unit / C
    p_safety = unit / (q * B)
    assert abs(p_money - 2.3333333333e-4) < 5e-14, p_money
    assert abs(p_safety - 1.75e-4) < 1e-16, p_safety
    assert abs(fix - 504000.0) < 1e-9
    # independent route to the money break-even: solve N p C = N c for p
    assert abs(N * p_money * C - fix) < 1e-6
    assert abs(N * 1e-4 * C - 216000.0) < 1e-6
    assert abs(N * 1e-3 * C - 2160000.0) < 1e-6
    # cost per averted fatality at three probabilities
    for pp, want in ((1.0e-4, 21.0e6), (1.75e-4, 12.0e6), (3.0e-4, 7.0e6)):
        cpf = fix / (N * pp * q)
        assert abs(cpf - want) < 1e-3, (pp, cpf)
    assert abs(N * 3.0e-4 * q - 0.072) < 1e-12
    assert abs(N * 1.0e-4 * q - 0.024) < 1e-12

    fig, ax = plt.subplots()
    ax.loglog(p, harm, color=c[0], lw=2.3)
    ax.axhline(fix, color=c[1], lw=2.0, ls=(0, (5, 3)))
    S.label_end(ax, 3.2e-3, N * 3.2e-3 * C, "expected money loss  N p C", c[0], mode,
                dx=-6, dy=10, ha="right")
    S.label_end(ax, 1.05e-5, fix, "cost of fixing the fleet  N c = 504,000", c[1], mode,
                dy=12)
    for pp, tag, dx, dy in ((p_money, "money break-even\np = 2.3333e-4", 10, -40),
                            (p_safety, "safety break-even\np = 1.75e-4", -10, 24)):
        ax.axvline(pp, color=S.GUIDE[mode], lw=1.0, ls=":")
        ax.plot([pp], [N * pp * C], "o", color=S.INK[mode], ms=6, zorder=5)
        ax.annotate(tag, xy=(pp, N * pp * C), xytext=(dx, dy),
                    textcoords="offset points", color=S.INK_2[mode], fontsize=9,
                    ha="left" if dx > 0 else "right")
    S.note(ax, 3.4e-4, 1.35e4, "the safety threshold sits LEFT of the money threshold:\n"
                              "counting harm rather than repair bills makes the\n"
                              "fix compulsory sooner", mode)
    ax.set_xlabel("per-unit probability of the failure  p")
    ax.set_ylabel("expected cost over the fleet")
    ax.set_title("Two break-evens for one defect, and they are not the same number")
    ax.set_ylim(1e4, 2e7)
    S.strip(ax)
    return fig


@figure("eth2-reliability-index")
def _(mode):
    """Capacity and demand densities above; failure probability vs beta below.

    Capacity N(1400, 140), demand N(900, 120): beta = 500/sqrt(140^2 + 120^2)
    = 2.71161 and p_f = Phi(-beta) = 3.3462e-3. Raising the mean capacity to
    1600 and, separately, halving the capacity spread to 70 both improve p_f,
    and the second does far more while leaving the central factor of safety
    at 1400/900 unchanged in the first case and 1.5556 in the second.
    """
    c = S.SERIES[mode]
    mu_c, sd_c, mu_d, sd_d = 1400.0, 140.0, 900.0, 120.0
    b0 = beta_index(mu_c, sd_c, mu_d, sd_d)
    b_mean = beta_index(1600.0, sd_c, mu_d, sd_d)
    b_var = beta_index(mu_c, 70.0, mu_d, sd_d)
    assert abs(math.sqrt(140.0 ** 2 + 120.0 ** 2) - 184.390889) < 5e-7
    assert abs(b0 - 2.7116307) < 5e-8, b0
    assert abs(b_mean - 3.7962830) < 5e-8, b_mean
    assert abs(b_var - 3.5990788) < 5e-8, b_var
    for b, want in ((b0, 3.34766e-3), (b_mean, 7.34409e-5), (b_var, 1.59673e-4)):
        got = phi(-b)
        assert abs(got - want) / want < 2e-4, (b, got)
    # independent route: Simpson on the normal density
    assert abs(phi(-b0) - phi_quad(-b0)) < 1e-9, (phi(-b0), phi_quad(-b0))
    assert abs(phi(-3.0) - 1.349898e-3) < 5e-9
    assert abs(phi(-4.0) - 3.167124e-5) < 5e-11
    # central factor of safety says nothing about the spread
    assert abs(mu_c / mu_d - 1.5555556) < 5e-8
    assert abs(1600.0 / 900.0 - 1.7777778) < 5e-8
    # and the margin M = C - D is normal with these moments
    assert abs((mu_c - mu_d) - 500.0) < 1e-12
    assert abs(math.sqrt(sd_c ** 2 + sd_d ** 2) * b0 - 500.0) < 1e-9

    fig, (top, bot) = plt.subplots(2, 1, figsize=(7.2, 5.6),
                                   gridspec_kw={"height_ratios": [1.0, 1.25],
                                                "hspace": 0.42})
    x = np.linspace(400, 1900, 1200)

    def dens(mu, sd):
        return np.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * math.sqrt(2 * math.pi))

    top.plot(x, dens(mu_d, sd_d), color=c[1], lw=2.1)
    top.plot(x, dens(mu_c, sd_c), color=c[0], lw=2.1)
    top.fill_between(x, 0, np.minimum(dens(mu_d, sd_d), dens(mu_c, sd_c)),
                     color=S.GUIDE[mode], alpha=0.35, lw=0)
    S.label_end(top, 900, dens(mu_d, sd_d).max(), "demand D", c[1], mode, dx=-52, dy=4)
    S.label_end(top, 1400, dens(mu_c, sd_c).max(), "capacity C", c[0], mode, dx=6, dy=4)
    S.note(top, 1180, 0.00088, "the overlap is the failure region", mode, size=8.6)
    top.set_xlabel("load or strength  (same units)")
    top.set_ylabel("density")
    top.set_yticks([])
    top.set_title("A factor of safety of 1.56 with a failure probability of 0.0033")
    S.strip(top)

    bb = np.linspace(0.5, 5.0, 700)
    bot.semilogy(bb, [phi(-v) for v in bb], color=c[0], lw=2.3)
    for b, tag, dx in ((b0, "as built: 2.712 -> 3.35e-3", 8),
                       (b_var, "tighter capacity: 3.599 -> 1.60e-4", 8),
                       (b_mean, "bigger mean: 3.796 -> 7.34e-5", 8)):
        bot.plot([b], [phi(-b)], "o", color=S.INK[mode], ms=6, zorder=5)
        bot.annotate(tag, xy=(b, phi(-b)), xytext=(dx, 6), textcoords="offset points",
                     color=S.INK_2[mode], fontsize=8.8)
    bot.set_xlabel("reliability index  beta")
    bot.set_ylabel("failure probability  Phi(-beta)")
    bot.set_title("Each unit of beta is roughly a decade of probability")
    bot.set_xlim(0.5, 5.4)
    S.strip(bot)
    return fig


@figure("eth2-gift-breakeven")
def _(mode):
    """Detection probability at which accepting a gift stops paying.

    Expected net of accepting: G - p L. Break-even p* = G/L, a straight line
    through the origin in G with slope 1/L, drawn for three loss totals.
    The lesson quotes G = 2,500 against L = 250,000, so p* = 0.01.
    """
    c = S.SERIES[mode]
    g = np.linspace(0, 25000, 600)
    fig, ax = plt.subplots()
    for k, L in enumerate((100000.0, 250000.0, 1000000.0)):
        ax.plot(g / 1000.0, 100.0 * g / L, color=c[k], lw=2.2)
        S.label_end(ax, 25.0, 100.0 * 25000.0 / L, f"L = {L/1000:,.0f}k", c[k], mode,
                    dx=6, dy=0)
    assert abs(2500.0 / 250000.0 - 0.01) < 1e-15
    assert abs(2500.0 / 100000.0 - 0.025) < 1e-15
    assert abs(12000.0 / 250000.0 - 0.048) < 1e-15
    assert abs(2500.0 - 0.15 * 250000.0 + 35000.0) < 1e-9
    # materiality against the fee for the assignment
    assert abs(2500.0 / 48000.0 - 0.0520833) < 5e-8, 2500.0 / 48000.0
    assert abs(250.0 / 48000.0 - 0.00520833) < 5e-9
    # a 250 lunch and a 2,500 trip differ by exactly a decade in materiality
    assert abs((2500.0 / 48000.0) / (250.0 / 48000.0) - 10.0) < 1e-12

    ax.plot([2.5], [1.0], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 0.7, 30.4, "G = 2,500 against a total loss L = 250,000 puts the\n"
                          "break-even at p* = 1%: a one-in-a-hundred chance of\n"
                          "being found out already makes it a losing bet", mode)
    S.note(ax, 0.7, 23.4, "and the duty does not rest on this arithmetic at all -\n"
                          "the line below which acceptance becomes rational is\n"
                          "not the line below which it becomes permitted", mode)
    ax.set_xlabel("value of the gift  G  (thousands)")
    ax.set_ylabel("break-even chance of being caught  (%)")
    ax.set_title("Even the purely selfish calculation loses")
    ax.set_xlim(0, 29)
    ax.set_ylim(0, 34.5)
    S.strip(ax)
    return fig


@figure("eth2-escalation-clock")
def _(mode):
    """Cumulative probability of an incident while a hazard stays live.

    Exposure rate lambda = 3.2e-3 per day, so P(t) = 1 - exp(-lambda t).
    Six days (escalate at once), 21 days (one internal round), 45 days (the
    full internal path) and 90 days (a review cycle) are marked; the risk the
    delay itself creates is the DIFFERENCE between two of those readings.
    """
    c = S.SERIES[mode]
    lam = 3.2e-3
    t = np.linspace(0, 120, 900)
    p = 1.0 - np.exp(-lam * t)

    vals = {d: 1.0 - math.exp(-lam * d) for d in (6, 21, 45, 90)}
    assert abs(vals[6] - 0.019016854) < 5e-9, vals[6]
    assert abs(vals[21] - 0.064991819) < 5e-9, vals[21]
    assert abs(vals[45] - 0.134112252) < 5e-9, vals[45]
    assert abs(vals[90] - 0.250238408) < 5e-9, vals[90]
    assert abs(vals[45] - vals[6] - 0.115095398) < 5e-9, vals[45] - vals[6]
    # independent route: a day-by-day product of survival probabilities, using
    # the per-day probability implied by the same rate
    per_day = 1.0 - math.exp(-lam)
    acc = 1.0
    for _ in range(45):
        acc *= (1.0 - per_day)
    assert abs((1.0 - acc) - vals[45]) < 1e-12
    # small-t linearisation, and the error it makes at 45 days
    assert abs(lam * 45 - 0.144) < 1e-12
    assert abs(0.144 - vals[45] - 0.009887748) < 5e-9, 0.144 - vals[45]

    fig, ax = plt.subplots()
    ax.plot(t, p, color=c[0], lw=2.4)
    ax.plot(t, lam * t, color=c[1], lw=1.6, ls=(0, (5, 3)))
    S.label_end(ax, 112, 1.0 - math.exp(-lam * 112), "1 - exp(-lambda t)", c[0], mode,
                dx=-6, dy=-16, ha="right")
    S.label_end(ax, 92, lam * 92, "lambda t", c[1], mode, dx=6, dy=6)
    for d, lab, dx, dy in ((6, "escalate now: 0.0190", 8, -6),
                           (21, "one round: 0.0650", 8, -6),
                           (45, "full internal path: 0.1341", -8, 8),
                           (90, "next review: 0.2502", -8, 8)):
        ax.plot([d], [vals[d]], "o", color=S.INK[mode], ms=6, zorder=5)
        ax.annotate(lab, xy=(d, vals[d]), xytext=(dx, dy), textcoords="offset points",
                    color=S.INK_2[mode], fontsize=9,
                    ha="left" if dx > 0 else "right")
    ax.annotate("", xy=(45, vals[45]), xytext=(45, vals[6]),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=1.5))
    S.note(ax, 46.5, 0.070, "0.1151 is what the DELAY costs,\nnot what the defect costs",
           mode)
    ax.set_xlabel("days the hazard stays live  t")
    ax.set_ylabel("probability of at least one incident")
    ax.set_title("The escalation question is a clock, and the clock is running")
    ax.set_xlim(0, 125)
    ax.set_ylim(0, 0.33)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# fee_licensure
# ---------------------------------------------------------------------------


@figure("eth2-experience-credit")
def _(mode):
    """Credited months against elapsed months for three employment histories.

    Full time under a licensee credits a month per month and reaches a stated
    48-month target at t = 48. Six-tenths time credits 0.6 a month and reaches
    it at 48/0.6 = 80. A board that allows a 12-month lump for an accredited
    master's degree starts the count at 12 and reaches it at 36. The 48 and the
    12 are the numbers the lesson STATES; both vary by jurisdiction.
    """
    c = S.SERIES[mode]
    target = 48.0
    t = np.linspace(0, 96, 700)
    full = t
    part = 0.6 * t
    grad = 12.0 + t

    assert abs(target / 1.0 - 48.0) < 1e-12
    assert abs(target / 0.6 - 80.0) < 1e-12
    assert abs(target - 12.0 - 36.0) < 1e-12
    # a mixed history: 18 months full, then 30 months at half time
    assert abs(18 * 1.0 + 30 * 0.5 - 33.0) < 1e-12
    assert abs(target - 33.0 - 15.0) < 1e-12          # 15 credited months still owed
    assert abs(15.0 / 0.5 - 30.0) < 1e-12             # 30 more calendar months at half
    assert abs(48 + 30 - 78.0) < 1e-12
    # month-by-month accumulation, the independent route
    acc, k = 0.0, 0
    while acc < target:
        k += 1
        acc += 1.0 if k <= 18 else 0.5
    assert k == 78, k

    fig, ax = plt.subplots()
    ax.plot(t, full, color=c[0], lw=2.2)
    ax.plot(t, part, color=c[1], lw=2.2)
    ax.plot(t, grad, color=c[2], lw=2.2)
    S.label_end(ax, 88, 88.0, "full time, 1.00", c[0], mode, dx=8, dy=-6)
    S.label_end(ax, 88, 0.6 * 88, "0.60 time", c[1], mode, dx=8, dy=-6)
    S.label_end(ax, 88, 100.0, "full time plus a 12-month\ndegree credit", c[2], mode,
                dx=8, dy=6)
    ax.axhline(target, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 1.5, 51.0, "stated target: 48 credited months", mode)
    for x0, lab in ((36.0, "36"), (48.0, "48"), (80.0, "80")):
        ax.plot([x0], [target], "o", color=S.INK[mode], ms=6, zorder=5)
        ax.annotate(lab, xy=(x0, target), xytext=(0, -16), textcoords="offset points",
                    color=S.INK_2[mode], fontsize=9, ha="center")
    ax.set_xlabel("elapsed months since the degree  t")
    ax.set_ylabel("credited months of qualifying experience")
    ax.set_title("Four years is a credited count, not a calendar")
    ax.set_xlim(0, 118)
    ax.set_ylim(0, 118)
    S.strip(ax)
    return fig


@figure("eth2-pdh-ledger")
def _(mode):
    """Six biennial cycles: hours earned, the requirement, and the carry-over.

    Requirement 30 hours a cycle, carry-over capped at 15 and usable only in
    the next cycle. Earned 38, 22, 41, 30, 26, 47. The final cycle earns 47,
    carries the maximum 15 and WASTES 9 hours, which is the point of the figure.
    Both the requirement and the cap are stated parameters, not a claim about
    any board.
    """
    c = S.SERIES[mode]
    earned = [38.0, 22.0, 41.0, 30.0, 26.0, 47.0]
    Q, cap = 30.0, 15.0
    rows = pdh_ledger(earned, Q, cap)

    assert [r["carry_in"] for r in rows] == [0.0, 8.0, 0.0, 11.0, 11.0, 7.0]
    assert [r["avail"] for r in rows] == [38.0, 30.0, 41.0, 41.0, 37.0, 54.0]
    assert [r["carried"] for r in rows] == [8.0, 0.0, 11.0, 11.0, 7.0, 15.0]
    assert [r["wasted"] for r in rows] == [0.0, 0.0, 0.0, 0.0, 0.0, 9.0]
    assert all(r["deficit"] == 0.0 for r in rows)
    assert abs(sum(earned) - 204.0) < 1e-12
    assert abs(6 * Q - 180.0) < 1e-12
    # conservation: everything earned is either spent, still carried, or wasted
    spent = sum(min(r["avail"], Q) for r in rows)
    assert abs(spent - 180.0) < 1e-9, spent
    assert abs(sum(earned) - (spent + rows[-1]["carried"] + sum(r["wasted"] for r in rows))
               ) < 1e-9
    assert abs(204.0 - 180.0 - 15.0 - 9.0) < 1e-12
    assert abs(sum(earned) / 6.0 - 34.0) < 1e-12

    fig, ax = plt.subplots()
    k = np.arange(1, 7)
    ax.bar(k, earned, width=0.55, color=c[0], edgecolor="none", zorder=2)
    ax.bar(k, [r["carry_in"] for r in rows], width=0.55,
           bottom=earned, color=c[2], edgecolor="none", zorder=2)
    ax.axhline(Q, color=S.GUIDE[mode], lw=1.4, ls="--", zorder=3)
    S.note(ax, 6.62, 28.4, "requirement,\n30 hours\na cycle", mode, size=8.6)
    S.label_end(ax, 6.6, 62.0, "hours earned", c[0], mode, dx=0, dy=0)
    S.label_end(ax, 6.6, 56.0, "carried in", c[2], mode, dx=0, dy=0)
    S.note(ax, 1.6, 62.0, "cycle 6: 54 available, 30 spent,\n"
                          "15 carried, 9 hours simply lost", mode)
    for j, r in enumerate(rows):
        ax.annotate(f"{r['avail']:.0f}", xy=(k[j], r["avail"]), xytext=(0, 4),
                    textcoords="offset points", ha="center", fontsize=9,
                    color=S.INK_2[mode])
    ax.set_xlabel("renewal cycle")
    ax.set_ylabel("professional development hours")
    ax.set_title("A cap turns extra effort into waste, on schedule")
    ax.set_xticks(k)
    ax.set_xlim(0.4, 8.9)
    ax.set_ylim(0, 72)
    S.strip(ax)
    return fig


@figure("eth2-carryover-cap")
def _(mode):
    """Carried and wasted hours against hours earned in one cycle.

    carried(E) = min(max(E - Q, 0), C) and wasted(E) = max(E - Q - C, 0), with
    Q = 30 and C = 15. Two straight segments and a corner at E = 45; the
    efficiency (E - wasted)/E falls away above the corner.
    """
    c = S.SERIES[mode]
    Q, cap = 30.0, 15.0
    e = np.linspace(0, 75, 751)
    carried = np.minimum(np.maximum(e - Q, 0.0), cap)
    wasted = np.maximum(e - Q - cap, 0.0)
    deficit = np.maximum(Q - e, 0.0)

    assert abs(np.interp(38.0, e, carried) - 8.0) < 1e-9
    assert abs(np.interp(38.0, e, wasted)) < 1e-12
    assert abs(np.interp(54.0, e, carried) - 15.0) < 1e-9
    assert abs(np.interp(54.0, e, wasted) - 9.0) < 1e-9
    assert abs(np.interp(22.0, e, deficit) - 8.0) < 1e-9
    # the corner is exactly Q + C, and the identity E = spent + carried + wasted
    # holds on both sides of it
    for x in (12.0, 30.0, 38.0, 45.0, 54.0, 70.0):
        spent = min(x, Q)
        car = min(max(x - Q, 0.0), cap)
        was = max(x - Q - cap, 0.0)
        assert abs(spent + car + was - x) < 1e-12, x
    assert abs((54.0 - 9.0) / 54.0 - 0.833333) < 5e-7
    assert abs((70.0 - 25.0) / 70.0 - 0.642857) < 5e-7
    assert abs(Q + cap - 45.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(e, carried, color=c[0], lw=2.4)
    ax.plot(e, wasted, color=c[1], lw=2.4)
    ax.plot(e, deficit, color=c[2], lw=2.0, ls=(0, (5, 3)))
    S.label_end(ax, 62, 15.0, "carried forward", c[0], mode, dx=6, dy=4)
    S.label_end(ax, 68, 68 - 45.0, "wasted", c[1], mode, dx=6, dy=0)
    S.label_end(ax, 6, 24.0, "shortfall", c[2], mode, dx=6, dy=6)
    for x0 in (30.0, 45.0):
        ax.axvline(x0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 30.6, 24.5, "Q = 30", mode)
    S.note(ax, 45.6, 24.5, "Q + C = 45", mode)
    for x0, y0, lab in ((38.0, 8.0, "38 earned:\n8 carried"),
                        (54.0, 9.0, "54 earned:\n9 wasted")):
        ax.plot([x0], [y0], "o", color=S.INK[mode], ms=6, zorder=5)
        ax.annotate(lab, xy=(x0, y0), xytext=(-6, 10), textcoords="offset points",
                    color=S.INK_2[mode], fontsize=9, ha="right")
    ax.set_xlabel("hours earned in the cycle  E")
    ax.set_ylabel("hours")
    ax.set_title("Where the hours go: a shortfall, a carry, or nowhere")
    ax.set_xlim(0, 78)
    ax.set_ylim(0, 32)
    S.strip(ax)
    return fig


@figure("eth2-comity-burden")
def _(mode):
    """Annual development burden as licences in more states are added.

    Four licences with annualised general requirements 15, 12, 15 and 8 hours
    and state-specific components 2, 1, 0 and 1 hours. If general hours count
    everywhere the burden is max(Q_i) + sum(m_i); if none of them do it is
    sum(Q_i + m_i). The truth is between, and which one applies is a question
    about each board's rules, which differ.
    """
    c = S.SERIES[mode]
    Q = [15.0, 12.0, 15.0, 8.0]
    m = [2.0, 1.0, 0.0, 1.0]
    n = np.arange(1, 5)
    overlap = [max(Q[:k]) + sum(m[:k]) for k in n]
    stacked = [sum(Q[:k]) + sum(m[:k]) for k in n]

    assert overlap == [17.0, 18.0, 18.0, 19.0], overlap
    assert stacked == [17.0, 30.0, 45.0, 54.0], stacked
    assert overlap[0] == stacked[0]
    assert abs(stacked[3] - overlap[3] - 35.0) < 1e-12
    assert abs(stacked[3] / overlap[3] - 2.842105) < 5e-7, stacked[3] / overlap[3]
    # the general part of the stacked route is just the sum of the Q values
    assert abs(sum(Q) - 50.0) < 1e-12 and abs(sum(m) - 4.0) < 1e-12
    assert abs(sum(Q) + sum(m) - 54.0) < 1e-12
    assert abs(max(Q) + sum(m) - 19.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(n, stacked, color=c[1], lw=2.4, marker="o")
    ax.plot(n, overlap, color=c[0], lw=2.4, marker="o")
    S.label_end(ax, 4, stacked[-1], "if nothing counts twice:\nsum of Q + m", c[1], mode,
                dx=-8, dy=10, ha="right")
    S.label_end(ax, 4, overlap[-1], "if general hours count\neverywhere: max Q + sum m",
                c[0], mode, dx=-8, dy=12, ha="right")
    for j in range(4):
        ax.annotate(f"{stacked[j]:.0f}", xy=(n[j], stacked[j]), xytext=(0, 7),
                    textcoords="offset points", ha="center", fontsize=9,
                    color=S.INK_2[mode])
        ax.annotate(f"{overlap[j]:.0f}", xy=(n[j], overlap[j]), xytext=(0, -16),
                    textcoords="offset points", ha="center", fontsize=9,
                    color=S.INK_2[mode])
    S.note(ax, 1.08, 3.0, "the gap at four licences is 35 hours a year -\n"
                          "entirely a question of whether each board\n"
                          "accepts hours earned for another", mode)
    ax.set_xlabel("number of licences held")
    ax.set_ylabel("annual development hours required")
    ax.set_title("Comity saves the examination, not necessarily the hours")
    ax.set_xticks(n)
    ax.set_xlim(0.8, 4.9)
    ax.set_ylim(0, 62)
    S.strip(ax)
    return fig


@figure("eth2-review-coverage")
def _(mode):
    """Probability at least one error ships, against the fraction reviewed.

    n items each carry an error with probability p = 0.02; review catches a
    reviewed error with probability d = 0.90, so an item ships bad with
    probability q(f) = p(1 - f d) and the package ships bad with probability
    1 - (1 - q)^n. Drawn for packages of 60, 240 and 600 items.
    """
    c = S.SERIES[mode]
    p, d = 0.02, 0.90
    f = np.linspace(0, 1, 501)
    fig, ax = plt.subplots()
    for k, n in enumerate((60, 240, 600)):
        y = 1.0 - (1.0 - p * (1.0 - f * d)) ** n
        ax.plot(f * 100, y, color=c[k], lw=2.3)
        S.label_end(ax, 100, y[-1], f"n = {n}", c[k], mode, dx=6, dy=0)

    def escape(n, frac):
        return 1.0 - (1.0 - p * (1.0 - frac * d)) ** n

    assert abs(escape(240, 0.0) - 0.992161) < 5e-7, escape(240, 0.0)
    assert abs(escape(240, 0.5) - 0.929675) < 5e-7, escape(240, 0.5)
    assert abs(escape(240, 1.0) - 0.381514) < 5e-7, escape(240, 1.0)
    assert abs(escape(60, 1.0) - 0.113186) < 5e-7, escape(60, 1.0)
    assert abs(escape(600, 1.0) - 0.699167) < 5e-7, escape(600, 1.0)
    # independent route: an explicit product over the n items
    acc = 1.0
    for _ in range(240):
        acc *= (1.0 - 0.02 * (1.0 - 1.0 * 0.90))
    assert abs((1.0 - acc) - escape(240, 1.0)) < 1e-12
    # expected count of escaped errors, which is linear where the probability is not
    assert abs(240 * 0.02 * 0.10 - 0.48) < 1e-12
    assert abs(240 * 0.02 - 4.8) < 1e-12

    for frac, n in ((0.0, 240), (1.0, 240)):
        ax.plot([frac * 100], [escape(n, frac)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 2.0, 0.30, "n = 240 and no review at all: 0.9922", mode)
    S.note(ax, 2.0, 0.13, "n = 240 reviewed in full: 0.3815 - a complete\n"
                          "check is still not the same as responsible charge", mode)
    ax.set_xlabel("percentage of the calculations independently reviewed")
    ax.set_ylabel("probability at least one error is sealed")
    ax.set_title("Checking is a filter, not a guarantee")
    ax.set_xlim(0, 112)
    ax.set_ylim(0, 1.05)
    S.strip(ax)
    return fig


@figure("eth2-exam-pace")
def _(mode):
    """Cumulative questions against elapsed minutes at three paces.

    110 questions in 320 minutes of examination time gives an even pace of
    320/110 = 2.9091 minutes a question. A candidate who spends 4 minutes on
    each of the first 30 has 200 minutes for the remaining 80, or 2.50 minutes
    each. Spending 4 minutes on k questions and 2.75 on the rest exhausts the
    clock at k = 14 exactly. Confirm the current format before you sit; NCEES
    revises it.
    """
    c = S.SERIES[mode]
    N, T = 110, 320.0
    even = T / N
    assert abs(even - 2.9090909091) < 5e-11, even
    assert abs(30 * 4.0 - 120.0) < 1e-12
    assert abs(T - 120.0 - 200.0) < 1e-12
    assert abs(N - 30 - 80) < 1e-12
    assert abs(200.0 / 80.0 - 2.5) < 1e-15
    assert abs(45 * 4.0 - 180.0) < 1e-12
    assert abs((T - 180.0) / (N - 45) - 2.1538462) < 5e-8, (T - 180.0) / (N - 45)
    # 4k + 2.75(110 - k) = 320  =>  1.25k = 17.5  =>  k = 14
    k_star = (T - 2.75 * N) / (4.0 - 2.75)
    assert abs(k_star - 14.0) < 1e-12, k_star
    assert abs(4.0 * 14 + 2.75 * (N - 14) - T) < 1e-12
    # and if the rest are to run at the even pace there is no room at all
    k_none = (T - even * N) / (4.0 - even)
    assert abs(k_none) < 1e-12, k_none

    q = np.arange(0, N + 1)
    fig, ax = plt.subplots()
    ax.plot(even * q, q, color=c[0], lw=2.3)
    slow = np.where(q <= 30, 4.0 * q, 120.0 + 2.5 * (q - 30))
    ax.plot(slow, q, color=c[1], lw=2.3)
    burn = np.where(q <= 14, 4.0 * q, 56.0 + 2.75 * (q - 14))
    ax.plot(burn, q, color=c[2], lw=2.0, ls=(0, (5, 3)))
    S.label_end(ax, even * 70, 70, "even pace, 2.909", c[0], mode, dx=-8, dy=10,
                ha="right")
    S.label_end(ax, 120.0, 30, "4.00 for 30, then 2.50", c[1], mode, dx=8, dy=-8)
    S.label_end(ax, 200.0, 34, "4.00 for 14, then 2.75", c[2], mode, dx=8, dy=0)
    ax.axvline(T, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.axhline(N, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 268, 6, "320 minutes", mode)
    ax.plot([120.0], [30], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 14, 84, "every slow question is borrowed from a later one;\n"
                       "at the even pace the account starts empty", mode)
    ax.set_xlabel("elapsed examination minutes")
    ax.set_ylabel("questions completed")
    ax.set_title("The clock is a budget, and it is fully committed on arrival")
    ax.set_xlim(0, 372)
    ax.set_ylim(0, 122)
    S.strip(ax)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "eth2-"
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith("eth2-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
