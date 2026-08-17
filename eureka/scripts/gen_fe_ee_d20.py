#!/usr/bin/env python3
"""Depth-wave-20 figures for the FE Electrical and Computer course:
the two Engineering Economics chapters on the time value of money
(fee_tvm) and on comparing alternatives (fee_cost_analysis).

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every curve here is COMPUTED, in this file, from a
closed form the lesson that references it writes out; nothing is traced,
scanned, redrawn or adapted from the NCEES Reference Handbook, from a factor
table, or from any textbook. Interest factors are protected by no one - the
pipeline consumes formulas and never anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at 1e-9 wherever
the quantity is exact in closed form and at the last quoted digit otherwise.
Several assertions are written twice over: once against the closed form and
once against a period-by-period ledger or a term-by-term sum, because a factor
that agrees with its own algebra but not with an actual account balance is
wrong in the way that matters to a student with a calculator.

Usage:
    python3 scripts/gen_fe_ee_d20.py             # all
    python3 scripts/gen_fe_ee_d20.py econ2-pw    # only names with that prefix
"""
from __future__ import annotations

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
    if not name.startswith("econ2-"):
        raise ValueError(f"this generator owns only the econ2- prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# --------------------------------------------------------------- primitives
def fp(i, n):
    return (1.0 + i) ** n


def pf(i, n):
    return (1.0 + i) ** -n


def fa(i, n):
    return ((1.0 + i) ** n - 1.0) / i


def pa(i, n):
    return ((1.0 + i) ** n - 1.0) / (i * (1.0 + i) ** n)


def ap(i, n):
    return i * (1.0 + i) ** n / ((1.0 + i) ** n - 1.0)


def af(i, n):
    return i / ((1.0 + i) ** n - 1.0)


def pg(i, n):
    return ((1.0 + i) ** n - i * n - 1.0) / (i * i * (1.0 + i) ** n)


def npv(flows, i):
    return sum(cf / (1.0 + i) ** t for t, cf in flows)


def ledger(P, i, n, draw=0.0):
    """Period-by-period balance: accrue interest, then apply a cash flow."""
    bal = float(P)
    for _ in range(n):
        bal = bal * (1.0 + i) - draw
    return bal


# ---------------------------------------------------------------------------
# fee_tvm
# ---------------------------------------------------------------------------


@figure("econ2-simple-vs-compound")
def _(mode):
    """10,000 at 7% under simple and compound interest, 30 years.

    Simple:   F = P(1 + i n)      - a straight line, interest on P only.
    Compound: F = P(1 + i)^n      - interest on interest, so exponential.
    The lesson quotes the 20-year pair, 24,000 against 38,696.84.
    """
    c = S.SERIES[mode]
    P, i = 10000.0, 0.07
    n = np.linspace(0, 30, 601)
    simple = P * (1.0 + i * n)
    comp = P * (1.0 + i) ** n

    assert abs(P * (1.0 + i * 20) - 24000.0) < 1e-9
    assert abs(P * fp(i, 20) - 38696.844625) < 1e-6, P * fp(i, 20)
    assert abs(ledger(P, i, 20) - P * fp(i, 20)) < 1e-6
    assert abs(P * fp(i, 30) - 76122.550422) < 1e-5, P * fp(i, 30)
    # the two agree at n = 0 and n = 1 and nowhere else
    assert abs(P * (1 + i * 1) - P * fp(i, 1)) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(n, simple / 1000.0, color=c[0], lw=2.2)
    ax.plot(n, comp / 1000.0, color=c[1], lw=2.2)
    S.label_end(ax, 26.0, (P * (1 + i * 26)) / 1000.0, "simple: P(1 + i n)", c[0], mode,
                dy=-16, ha="center")
    S.label_end(ax, 24.5, (P * fp(i, 24.5)) / 1000.0, "compound: P(1 + i)^n", c[1], mode,
                dx=-8, dy=6, ha="right")
    for x, y, tag in ((20.0, 24.0, "24,000"), (20.0, 38.696844625, "38,696.84")):
        ax.plot([x], [y], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.axvline(20.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 20.4, 25.6, "at 20 years the gap is 14,696.84 -\nmore than the whole "
                           "simple-interest\ninterest of 14,000", mode)
    ax.set_xlabel("years  n")
    ax.set_ylabel("balance  (thousands)")
    ax.set_title("Interest on interest: 10,000 at 7%")
    ax.set_xlim(0, 31.5)
    ax.set_ylim(0, 80)
    S.strip(ax)
    return fig


@figure("econ2-doubling-time")
def _(mode):
    """Exact doubling time against the rule of 72.

    n = ln 2 / ln(1 + i) is exact; 72/(100 i) is the shortcut. The shortcut is
    good near 8% and drifts badly at both ends, which is the whole point.
    """
    c = S.SERIES[mode]
    i = np.linspace(0.01, 0.25, 600)
    exact = np.log(2.0) / np.log(1.0 + i)
    rule = 0.72 / i

    assert abs(np.log(2.0) / np.log(1.08) - 9.006468) < 5e-7
    assert abs(np.log(2.0) / np.log(1.12) - 6.116255) < 5e-7
    assert abs(np.log(2.0) / np.log(1.04) - 17.672988) < 5e-7
    # the shortcut agrees with the exact answer near 7.85%
    k = int(np.argmin(np.abs(exact - rule)))
    assert 0.076 < i[k] < 0.080, i[k]
    assert abs(1.08 ** (np.log(2.0) / np.log(1.08)) - 2.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(i * 100, exact, color=c[0], lw=2.2)
    ax.plot(i * 100, rule, color=c[1], lw=2.2, ls=(0, (5, 3)))
    S.label_end(ax, 17.0, np.log(2.0) / np.log(1.17), "exact  n = ln2 / ln(1+i)",
                c[0], mode, dy=-16, ha="center")
    S.label_end(ax, 13.5, 0.72 / 0.135, "rule of 72", c[1], mode, dx=6, dy=10)
    for r, lab in ((0.04, "4%: 17.67 exact vs 18.0"),
                   (0.08, "8%: 9.01 vs 9.0"),
                   (0.12, "12%: 6.12 vs 6.0")):
        ax.plot([r * 100], [np.log(2.0) / np.log(1.0 + r)], "o", color=S.INK[mode], ms=6,
                zorder=5)
        S.note(ax, r * 100 + 0.6, np.log(2.0) / np.log(1.0 + r) + 0.7, lab, mode)
    ax.set_xlabel("interest rate per period  (%)")
    ax.set_ylabel("periods to double")
    ax.set_title("How long money takes to double, and when the shortcut lies")
    ax.set_xlim(1, 25.5)
    ax.set_ylim(0, 40)
    S.strip(ax)
    return fig


@figure("econ2-series-saturation")
def _(mode):
    """(P/A, i, n) against n at three rates, with the perpetuity ceiling 1/i.

    The uniform-series present-worth factor is bounded above by 1/i, which is
    exactly why a perpetuity is worth A/i and why the last years of a long
    series contribute almost nothing.
    """
    c = S.SERIES[mode]
    n = np.arange(1, 61)
    fig, ax = plt.subplots()
    for k, r in enumerate((0.05, 0.10, 0.15)):
        y = pa(r, n)
        ax.plot(n, y, color=c[k], lw=2.1)
        ax.axhline(1.0 / r, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.label_end(ax, 60, y[-1], f"i = {r*100:g}%", c[k], mode, dy=-2)
        S.note(ax, 1.2, 1.0 / r + 0.35, f"ceiling 1/i = {1.0/r:.4g}", mode)
    assert abs(pa(0.10, 5) - 3.7907867694) < 5e-10
    assert abs(pa(0.10, 30) - 9.426914467) < 5e-9, pa(0.10, 30)
    assert abs(pa(0.05, 60) - 18.929289525) < 5e-9, pa(0.05, 60)
    # brute-force definition, term by term
    assert abs(pa(0.10, 30) - sum(1.10 ** -j for j in range(1, 31))) < 1e-12
    # 94.27% of the perpetuity value is bought in the first 30 years at 10%
    assert abs(pa(0.10, 30) / 10.0 - 0.9426914467) < 5e-10
    ax.set_xlabel("number of payments  n")
    ax.set_ylabel("(P/A, i, n)")
    ax.set_title("A uniform series can never be worth more than A/i")
    ax.set_xlim(0, 66)
    ax.set_ylim(0, 21.5)
    S.strip(ax)
    return fig


@figure("econ2-gradient-shapes")
def _(mode):
    """Three eight-year series that all start at 6,000.

    Level:      A_k = 6000
    Arithmetic: A_k = 6000 + 600(k - 1)
    Geometric:  A_k = 6000(1.05)^(k-1)

    Drawn as the actual annual amounts, because the commonest gradient error
    is a timing error and a picture of the amounts fixes it.
    """
    c = S.SERIES[mode]
    k = np.arange(1, 9)
    level = np.full(8, 6000.0)
    arith = 6000.0 + 600.0 * (k - 1)
    geo = 6000.0 * 1.05 ** (k - 1)

    assert arith[0] == 6000.0 and arith[7] == 10200.0
    assert abs(geo[7] - 6000.0 * 1.05 ** 7) < 1e-9
    assert abs(geo[7] - 8442.6025359375) < 1e-9, geo[7]
    # arithmetic overtakes geometric here because 600 a year beats 5% of 6,000
    assert arith[7] > geo[7]
    assert abs(arith.sum() - 64800.0) < 1e-9
    assert abs(geo.sum() - 6000.0 * (1.05 ** 8 - 1) / 0.05) < 1e-9

    fig, ax = plt.subplots()
    w = 0.26
    ax.bar(k - w, level, width=w, color=c[0], edgecolor="none")
    ax.bar(k, arith, width=w, color=c[1], edgecolor="none")
    ax.bar(k + w, geo, width=w, color=c[2], edgecolor="none")
    S.label_end(ax, 1, level[0], "level A", c[0], mode, dy=34, ha="center")
    S.label_end(ax, 7, arith[6], "arithmetic\nG = 600", c[1], mode, dx=-8, dy=14,
                ha="right")
    S.label_end(ax, 8 + w, geo[-1], "geometric\ng = 5%", c[2], mode, dx=8, dy=4,
                ha="left")
    S.note(ax, 0.55, 11400, "the gradient contributes NOTHING in year 1 -\n"
                            "all three series start at the same 6,000", mode)
    ax.set_xlabel("year  k")
    ax.set_ylabel("cash flow in year k")
    ax.set_title("Three series, one starting amount, three different factors")
    ax.set_xticks(k)
    ax.set_xlim(0.5, 9.9)
    ax.set_ylim(0, 13200)
    S.strip(ax)
    return fig


@figure("econ2-equivalence-three-dates")
def _(mode):
    """The worth of one cash-flow set measured at every date, at 6%.

    Flows: -20,000 at t = 0, +7,000 at t = 2, +9,000 at t = 5, +12,000 at t = 8.
    W(t) is the balance of an account that receives those flows and earns 6%;
    it is a single quantity seen from different dates, and W(t) = PW(1.06)^t
    once the last flow has been received.
    """
    c = S.SERIES[mode]
    i = 0.06
    flows = [(0, -20000.0), (2, 7000.0), (5, 9000.0), (8, 12000.0)]
    pw = npv(flows, i)
    assert abs(pw - 484.247092) < 5e-7, pw
    fw5 = sum(cf * (1 + i) ** (5 - t) for t, cf in flows)
    fw8 = sum(cf * (1 + i) ** (8 - t) for t, cf in flows)
    assert abs(fw5 - 648.031844) < 5e-7, fw5
    assert abs(fw8 - 771.816295) < 5e-7, fw8
    assert abs(fw5 * (1 + i) ** -5 - pw) < 1e-9
    assert abs(fw8 * (1 + i) ** -8 - pw) < 1e-9

    # W(t), the whole set carried forward to date t. Because every flow is
    # carried by the same (1 + i), W(t) = PW (1 + i)^t exactly.
    ts = np.linspace(0, 8, 801)
    w = pw * (1 + i) ** ts
    assert abs(w[0] - pw) < 1e-9
    assert abs(pw * (1 + i) ** 5 - fw5) < 1e-9
    assert abs(pw * (1 + i) ** 8 - fw8) < 1e-9

    fig, (top, bot) = plt.subplots(
        2, 1, sharex=True, figsize=(7.2, 5.4),
        gridspec_kw={"height_ratios": [1.0, 1.35], "hspace": 0.16})
    for t, cf in flows:
        col = c[1] if cf < 0 else c[0]
        top.annotate("", xy=(t, cf / 1000.0), xytext=(t, 0),
                     arrowprops=dict(arrowstyle="-|>", color=col, lw=2.0))
        top.annotate(f"{cf/1000.0:+.0f}k", xy=(t, cf / 1000.0),
                     xytext=(0, -13 if cf < 0 else 6), textcoords="offset points",
                     color=col, fontsize=9.5, fontweight="semibold", ha="center")
    top.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    top.set_ylabel("cash flow\n(thousands)")
    top.set_ylim(-24, 16)
    top.set_yticks([-20, -10, 0, 10])
    top.set_title("One cash-flow set, one answer, any vantage point")
    S.strip(top)

    bot.plot(ts, w, color=c[0], lw=2.3)
    for t, v, tag, dx, dy, ha in ((0.0, pw, "PW = 484.25", 6, 17, "left"),
                                  (5.0, fw5, "at t = 5:  648.03", 5, -17, "left"),
                                  (8.0, fw8, "at t = 8:  771.82", -6, 11, "right")):
        bot.plot([t], [v], "o", color=S.INK[mode], ms=6, zorder=5)
        bot.annotate(tag, xy=(t, v), xytext=(dx, dy), textcoords="offset points",
                     color=S.INK_2[mode], fontsize=9, ha=ha)
    S.label_end(ax=bot, x=2.6, y=pw * (1 + i) ** 2.6, text="W(t) = PW (1.06)^t",
                colour=c[0], mode=mode, dy=-19, ha="center")
    bot.set_xlabel("valuation date  t  (years)")
    bot.set_ylabel("worth of the whole set")
    bot.set_xlim(-0.4, 8.7)
    bot.set_ylim(400, 850)
    S.strip(bot)
    return fig


# ---------------------------------------------------------------------------
# fee_cost_analysis
# ---------------------------------------------------------------------------


@figure("econ2-pw-aw-fw")
def _(mode):
    """Equivalent worth of three alternatives measured at every date, 10%.

    W(t) = PW(1 + i)^t. Because every curve is the same positive PW multiplied
    by the same growing number, the three never cross: present worth, annual
    worth and future worth cannot disagree about a ranking.
    """
    c = S.SERIES[mode]
    i, n = 0.10, 12
    alts = (("M", 120000, 26000, 15000), ("N", 165000, 33500, 25000),
            ("O", 210000, 41000, 30000))
    pws = {}
    for name, C, A, Sv in alts:
        p = -C + A * pa(i, n) + Sv * pf(i, n)
        pws[name] = p
    assert abs(pws["M"] - 61935.449661) < 5e-6, pws["M"]
    assert abs(pws["N"] - 71224.446510) < 5e-6, pws["N"]
    assert abs(pws["O"] - 78920.289270) < 5e-6, pws["O"]
    # flow-by-flow, the definition rather than the factor
    for name, C, A, Sv in alts:
        fl = [(0, -C)] + [(t, A) for t in range(1, n + 1)] + [(n, Sv)]
        assert abs(npv(fl, i) - pws[name]) < 1e-7
    assert abs(pws["N"] * ap(i, n) - 10453.135886) < 5e-6
    assert abs(pws["N"] * fp(i, n) - 223532.824043) < 5e-5
    assert pws["M"] < pws["N"] < pws["O"]

    t = np.linspace(0, 12, 601)
    fig, ax = plt.subplots()
    for k, (name, _, _, _) in enumerate(alts):
        y = pws[name] * (1 + i) ** t / 1000.0
        ax.plot(t, y, color=c[k], lw=2.2)
        S.label_end(ax, 12, y[-1], f"{name}", c[k], mode, dx=6)
    ax.plot([0, 0, 0], [pws["M"] / 1000, pws["N"] / 1000, pws["O"] / 1000], "o",
            color=S.INK[mode], ms=5, zorder=5)
    S.note(ax, 0.3, 108, "at t = 0 these are the present worths\n"
                         "61,935 / 71,224 / 78,920", mode)
    S.note(ax, 4.2, 224, "the curves never cross, so PW, AW and FW\n"
                         "always agree on the ranking", mode)
    ax.set_xlabel("date the equivalent worth is measured  (years)")
    ax.set_ylabel("equivalent worth  (thousands)")
    ax.set_title("Present, annual and future worth are one number seen three ways")
    ax.set_xlim(0, 13.4)
    ax.set_ylim(0, 265)
    S.strip(ax)
    return fig


@figure("econ2-multiple-irr")
def _(mode):
    """NPV against the discount rate for -1,000, +5,000, -6,000.

    Two sign changes in the cash flows, and the curve genuinely crosses zero
    twice: at 100% and at 200%. Substituting x = 1/(1+i) turns the equation
    into 6x^2 - 5x + 1 = 0, whose roots are x = 1/2 and x = 1/3.
    """
    c = S.SERIES[mode]
    fl = [(0, -1000.0), (1, 5000.0), (2, -6000.0)]
    r = np.linspace(0.0, 4.0, 1201)
    y = np.array([npv(fl, x) for x in r])

    assert abs(npv(fl, 0.0) + 2000.0) < 1e-9
    assert abs(npv(fl, 1.0)) < 1e-9
    assert abs(npv(fl, 2.0)) < 1e-9
    assert abs(npv(fl, 1.5) - 40.0) < 1e-9
    assert abs(npv(fl, 0.15) + 1189.035917) < 5e-7, npv(fl, 0.15)
    # the roots really are the reciprocals of the quadratic's roots
    assert abs((1.0 / 0.5 - 1.0) - 1.0) < 1e-12
    assert abs((1.0 / (1.0 / 3.0) - 1.0) - 2.0) < 1e-12
    # peak of the arc, from dNPV/dx = 0
    j = int(np.argmax(y))
    assert 1.3 < r[j] < 1.7, r[j]

    fig, ax = plt.subplots()
    ax.plot(r * 100, y, color=c[0], lw=2.3)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    for root in (1.0, 2.0):
        ax.plot([root * 100], [0.0], "o", color=c[1], ms=8, zorder=5)
    S.note(ax, 104, -330, "root at 100%", mode)
    S.note(ax, 196, -330, "root at 200%", mode)
    ax.plot([15.0], [npv(fl, 0.15)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 34, -1500, "at a 15% MARR the net present value is\n"
                          "-1,189.04, so reject - and no IRR was needed", mode)
    S.note(ax, 118, 120, "between the roots the curve rises only to +40", mode)
    S.label_end(ax, 300, npv(fl, 3.0), "NPV(i)", c[0], mode, dx=8, dy=-8)
    ax.set_xlabel("discount rate  (%)")
    ax.set_ylabel("net present value")
    ax.set_title("Two sign changes, two rates of return, no useful answer")
    ax.set_xlim(0, 410)
    ax.set_ylim(-2150, 400)
    S.strip(ax)
    return fig


@figure("econ2-incremental-ladder")
def _(mode):
    """Present-worth profiles of three mutually exclusive alternatives.

    D1 costs 25,000 and returns 5,000 a year; D2 costs 40,000 and returns
    7,900; D3 costs 60,000 and returns 10,300; all over ten years. D1 has the
    highest own IRR and D2 has the highest NPV at a 10% MARR - the increments
    settle it, and the crossings ARE the incremental rates of return.
    """
    c = S.SERIES[mode]
    n = 10
    alts = (("D1", 25000.0, 5000.0), ("D2", 40000.0, 7900.0), ("D3", 60000.0, 10300.0))
    r = np.linspace(0.03, 0.18, 900)

    def prof(C, A):
        return -C + A * pa(r, n)

    assert abs(-25000 + 5000 * pa(0.10, n) - 5722.835529) < 5e-6
    assert abs(-40000 + 7900 * pa(0.10, n) - 8542.080135) < 5e-6
    assert abs(-60000 + 10300 * pa(0.10, n) - 3289.041189) < 5e-6
    # incremental IRRs, by bisection on the incremental NPV
    def irr(C, A):
        lo, hi = 1e-4, 3.0
        assert (-C + A * pa(lo, n)) * (-C + A * pa(hi, n)) < 0
        for _ in range(200):
            mid = 0.5 * (lo + hi)
            if (-C + A * pa(lo, n)) * (-C + A * pa(mid, n)) <= 0:
                hi = mid
            else:
                lo = mid
        return 0.5 * (lo + hi)

    i12 = irr(15000.0, 2900.0)
    i23 = irr(20000.0, 2400.0)
    assert abs(i12 - 0.14216137) < 5e-8, i12
    assert abs(i23 - 0.03460154) < 5e-8, i23
    assert abs(pa(i12, n) - 15000.0 / 2900.0) < 1e-10
    assert abs(irr(25000.0, 5000.0) - 0.15098414) < 5e-8

    fig, ax = plt.subplots()
    for k, (name, C, A) in enumerate(alts):
        y = prof(C, A) / 1000.0
        ax.plot(r * 100, y, color=c[k], lw=2.1)
        S.label_end(ax, 18.0, y[-1], name, c[k], mode, dx=6)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.axvline(10.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax.plot([i12 * 100], [(-25000 + 5000 * pa(i12, n)) / 1000.0], "o",
            color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 14.7, -5.6, "D1 and D2 cross at 14.22% -\nthe D1-to-D2 incremental IRR",
           mode)
    S.note(ax, 10.3, 24.0, "MARR = 10%:\nD2 has the highest NPV,\n8,542", mode)
    S.note(ax, 3.4, -9.6, "D3 dies first, at 11.26%,\nyet costs the most", mode)
    ax.set_xlabel("discount rate  (%)")
    ax.set_ylabel("net present value  (thousands)")
    ax.set_title("Three profiles: the crossings are the incremental returns")
    ax.set_xlim(2.6, 19.6)
    ax.set_ylim(-15, 30)
    S.strip(ax)
    return fig


@figure("econ2-sensitivity-spider")
def _(mode):
    """NPV of alternative N against a proportional change in three drivers.

    Base case: 165,000 first cost, 33,500 a year, 25,000 salvage, twelve years,
    10% MARR, base NPV 71,224.45. Each driver is swept from -30% to +30% of its
    base value with the others held fixed; the steepest line is the assumption
    the decision actually rests on.
    """
    c = S.SERIES[mode]
    C0, A0, S0, n0, i0 = 165000.0, 33500.0, 25000.0, 12, 0.10

    def val(C=C0, A=A0, Sv=S0, i=i0, n=n0):
        return -C + A * pa(i, n) + Sv * pf(i, n)

    base = val()
    assert abs(base - 71224.446510) < 5e-6, base
    d = np.linspace(-0.30, 0.30, 241)
    cost = np.array([val(C=C0 * (1 + x)) for x in d])
    ben = np.array([val(A=A0 * (1 + x)) for x in d])
    marr = np.array([val(i=i0 * (1 + x)) for x in d])

    assert abs(val(C=C0 * 1.2) - 38224.446510) < 5e-6
    assert abs(val(A=A0 * 0.8) - 25572.711296) < 5e-6
    assert abs(val(i=i0 * 1.2) - 48928.413876) < 5e-6
    # the benefit line is the steepest: |dNPV/d(fraction)| comparison
    assert abs(A0 * pa(i0, n0)) > abs(C0)
    # and NPV = 0 needs a 43% cost overrun or a 31% benefit shortfall
    assert abs(236224.446510 / C0 - 1.0 - 0.431663) < 5e-7, 236224.44651 / C0
    assert abs(1.0 - 23046.864128 / A0 - 0.312034) < 5e-7

    fig, ax = plt.subplots()
    ax.plot(d * 100, cost / 1000.0, color=c[0], lw=2.1)
    ax.plot(d * 100, ben / 1000.0, color=c[1], lw=2.1)
    ax.plot(d * 100, marr / 1000.0, color=c[2], lw=2.1)
    S.label_end(ax, 30, cost[-1] / 1000.0, "first cost", c[0], mode, dx=6)
    S.label_end(ax, 30, ben[-1] / 1000.0, "annual benefit", c[1], mode, dx=6)
    S.label_end(ax, 30, marr[-1] / 1000.0, "MARR", c[2], mode, dx=6)
    ax.plot([0.0], [base / 1000.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, -29, 74, "base case 71,224", mode)
    S.note(ax, -29, 20, "annual benefit has the steepest line, so it is\n"
                        "the forecast worth spending effort on", mode)
    ax.set_xlabel("change in the driver  (% of its base value)")
    ax.set_ylabel("net present value  (thousands)")
    ax.set_title("Which assumption is the decision actually resting on?")
    ax.set_xlim(-31, 40)
    ax.set_ylim(0, 145)
    S.strip(ax)
    return fig


@figure("econ2-service-life")
def _(mode):
    """Equivalent uniform annual cost against retention age, and its two parts.

    A 48,000 asset at 10%, salvage S_k = 48,000(0.75)^k, operating cost
    6,000 in year 1 rising 3,500 a year. Capital recovery falls with age,
    operating cost rises, and the sum has a minimum - the economic service
    life, here three years at 22,461.63.
    """
    c = S.SERIES[mode]
    i, P0 = 0.10, 48000.0
    ks = np.arange(1, 9)
    cap, opr, tot = [], [], []
    for k in ks:
        Sv = P0 * 0.75 ** k
        pw_op = sum((6000.0 + 3500.0 * (t - 1)) * (1 + i) ** -t for t in range(1, k + 1))
        cr = P0 * ap(i, k) - Sv * af(i, k)
        eo = pw_op * ap(i, k)
        cap.append(cr)
        opr.append(eo)
        tot.append(cr + eo)
    cap, opr, tot = np.array(cap), np.array(opr), np.array(tot)

    # the two-part split must reconstruct the one-shot present-worth answer
    for j, k in enumerate(ks):
        Sv = P0 * 0.75 ** k
        pwc = P0 + sum((6000.0 + 3500.0 * (t - 1)) * (1 + i) ** -t
                       for t in range(1, k + 1)) - Sv * (1 + i) ** -k
        assert abs(pwc * ap(i, k) - tot[j]) < 1e-7
        # capital recovery, written the other legitimate way
        assert abs(((P0 - Sv) * ap(i, k) + Sv * i) - cap[j]) < 1e-7
    assert abs(tot[0] - 22800.0) < 1e-6, tot[0]
    assert abs(tot[1] - 22466.666667) < 5e-6, tot[1]
    assert abs(tot[2] - 22461.631421) < 5e-6, tot[2]
    assert abs(tot[3] - 22704.223228) < 5e-6, tot[3]
    assert int(ks[np.argmin(tot)]) == 3

    fig, ax = plt.subplots()
    ax.plot(ks, cap / 1000.0, color=c[0], lw=2.1, marker="o")
    ax.plot(ks, opr / 1000.0, color=c[1], lw=2.1, marker="o")
    ax.plot(ks, tot / 1000.0, color=c[2], lw=2.4, marker="o")
    S.label_end(ax, 8, cap[-1] / 1000.0, "capital recovery", c[0], mode, dx=6)
    S.label_end(ax, 8, opr[-1] / 1000.0, "operating", c[1], mode, dx=6)
    S.label_end(ax, 8, tot[-1] / 1000.0, "total EUAC", c[2], mode, dx=6)
    ax.plot([3], [tot[2] / 1000.0], "o", color=S.INK[mode], ms=9, zorder=5,
            markerfacecolor="none", markeredgewidth=1.8)
    S.note(ax, 3.2, 25.0, "minimum at three years:\n22,461.63 a year", mode)
    S.note(ax, 0.75, 1.0, "the total is nearly flat from year 2 to year 4 - the\n"
                          "exact answer matters less than knowing the shape", mode)
    ax.set_xlabel("years the asset is kept,  k")
    ax.set_ylabel("equivalent uniform annual cost  (thousands)")
    ax.set_title("Economic service life: where the two costs trade off")
    ax.set_xlim(0.5, 10.4)
    ax.set_ylim(0, 29)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "econ2-"
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith("econ2-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
