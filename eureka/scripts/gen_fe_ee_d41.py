#!/usr/bin/env python3
"""Depth-wave-41 figures for the FE Electrical and Computer course:
the Engineering Economics chapter on depreciation and book value
(fee_depreciation).

Same contract as gen_fe_ee_d20.py, and it imports the SAME style module rather
than growing a second look. Every curve here is COMPUTED, in this file, from a
rule the lesson that references it writes out in words: a declining-balance
recursion, a switch test, a convention fraction, a discounted shield. Nothing
is traced, scanned, redrawn or adapted from IRS Publication 946, from a
depreciation table, or from any textbook. The MACRS percentages plotted here
are DERIVED by running the published convention (200% or 150% declining
balance, switching to straight line over the remaining recovery period, with a
first-year fraction set by the applicable convention) and are then asserted
against the published column, so a disagreement would stop the build.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it. Depreciation
schedules are asserted twice over: once against the closed form the lesson
prints, and once against a year-by-year ledger that requires accumulated
depreciation plus book value to equal the basis at EVERY year and the column
total to equal the depreciable amount exactly. A schedule that agrees with its
own algebra but does not close as an account is wrong in the way that matters
to a student with a calculator.

Usage:
    python3 scripts/gen_fe_ee_d41.py             # all
    python3 scripts/gen_fe_ee_d41.py econ3-db    # only names with that prefix
"""
from __future__ import annotations

import pathlib
import sys
from fractions import Fraction as F

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
    if not name.startswith("econ3-"):
        raise ValueError(f"this generator owns only the econ3- prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ------------------------------------------------------------- depreciation
def closes(schedule, basis, depreciable) -> bool:
    """The ledger identity, checked at EVERY year, in exact arithmetic.

    accumulated depreciation + book value == basis, for every year, and the
    column total == the depreciable amount exactly. This is the check that a
    printed schedule is an account and not just a list of plausible numbers.
    """
    acc, bv = F(0), F(basis)
    for D in schedule:
        assert D >= 0, D
        acc += F(D)
        bv -= F(D)
        assert acc + bv == F(basis), (float(acc), float(bv))
    assert acc == F(depreciable), (float(acc), float(depreciable))
    assert bv == F(basis) - F(depreciable), float(bv)
    return True


def straight_line(B, S, n):
    return [F(B - S, 1) / n] * n


def declining_balance(B, S, n, alpha):
    """alpha x straight-line rate on the remaining book value, floored at S."""
    d = F(alpha) / n
    bv, out = F(B), []
    for _ in range(n):
        D = d * bv
        if bv - D < F(S):
            D = max(F(0), bv - F(S))
        out.append(D)
        bv -= D
    return out


def db_with_switch(B, S, n, alpha):
    """Declining balance, switching to straight line over the remaining life
    in the first year that straight line offers the larger deduction."""
    d = F(alpha) / n
    bv, out, switched = F(B), [], None
    for t in range(1, n + 1):
        db = d * bv
        sl = (bv - F(S)) / (n - t + 1)
        if switched is None and sl >= db:
            switched = t
        out.append(sl if switched is not None else db)
        bv -= out[-1]
    return out, switched


def syd(B, S, n):
    total = n * (n + 1) // 2
    return [F(n - t + 1, total) * F(B - S) for t in range(1, n + 1)]


def macrs_percentages(n, alpha, q=F(1, 2)):
    """Derive one MACRS column exactly, as Fractions of the basis.

    alpha is 2 for the 3-, 5-, 7- and 10-year classes and 3/2 for the 15- and
    20-year classes. q is the first-year fraction of a year set by the
    convention: 1/2 half-year, or 7/8, 5/8, 3/8, 1/8 for the four quarters
    under the mid-quarter convention.
    """
    d = F(alpha) / n
    bv, out = F(1), []
    D = d * bv * q
    out.append(D)
    bv -= D
    t = 2
    while bv > 0 and t <= n + 1:
        remaining = F(n) - (q + (t - 2))
        if remaining <= 0:
            out.append(bv)
            bv = F(0)
            break
        D = max(d * bv, bv / remaining)
        D = min(D, bv)
        out.append(D)
        bv -= D
        t += 1
    if bv > 0:
        out.append(bv)
    assert sum(out) == 1, sum(out)
    return out


# Published columns, IRS Publication 946 Appendix A (a work of the US
# government). They are quoted here ONLY as the target of an assertion: every
# value plotted or printed is the derived one.
PUBLISHED_HALF_YEAR = {
    3: [33.33, 44.45, 14.81, 7.41],
    5: [20.00, 32.00, 19.20, 11.52, 11.52, 5.76],
    7: [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
    10: [10.00, 18.00, 14.40, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
}
PUBLISHED_MID_QUARTER_5 = {
    F(7, 8): [35.00, 26.00, 15.60, 11.01, 11.01, 1.38],
    F(5, 8): [25.00, 30.00, 18.00, 11.37, 11.37, 4.26],
    F(3, 8): [15.00, 34.00, 20.40, 12.24, 11.30, 7.06],
    F(1, 8): [5.00, 38.00, 22.80, 13.68, 10.94, 9.58],
}


def check_against_published() -> None:
    """Every derived column must match the published one to the last printed
    digit, EXCEPT where the published value differs by exactly one unit in that
    last digit -- the rounding the IRS applies so a column totals 100.000%.
    Any other disagreement is a method error and aborts the build."""
    for n, pub in PUBLISHED_HALF_YEAR.items():
        got = [round(float(x) * 100, 2) for x in macrs_percentages(n, F(2))]
        assert len(got) == len(pub), (n, len(got), len(pub))
        for k, (g, p) in enumerate(zip(got, pub), 1):
            assert abs(g - p) <= 0.01 + 1e-9, (n, k, g, p)
    for q, pub in PUBLISHED_MID_QUARTER_5.items():
        got = [round(float(x) * 100, 2) for x in macrs_percentages(5, F(2), q)]
        for k, (g, p) in enumerate(zip(got, pub), 1):
            assert abs(g - p) < 1e-9, (q, k, g, p)
    # the 5-year half-year column is exact to the last digit, every entry
    assert [round(float(x) * 100, 2) for x in macrs_percentages(5, F(2))] == \
        PUBLISHED_HALF_YEAR[5]
    check_switch_years()


def switch_year(n, alpha, q=F(1, 2)):
    """The first year in which straight line over the remaining recovery period
    beats declining balance -- found by running the schedule, not by formula."""
    d = F(alpha) / n
    bv = F(1) - d * q
    for t in range(2, n + 2):
        r = F(n) - (q + (t - 2))
        if r <= 0:
            return None
        if bv / r >= d * bv:
            return t
        bv -= d * bv
    return None


def check_switch_years() -> None:
    """The lesson claims the MACRS switch year is ceil(n + 1.5 - 1/d), the
    half-year convention shifting the no-convention answer ceil(n + 1 - 1/d) by
    up to a year. Both formulas are checked against the schedule itself."""
    import math
    expected = {3: 3, 5: 4, 7: 5, 10: 7, 15: 7, 20: 9}
    for n, alpha in ((3, F(2)), (5, F(2)), (7, F(2)), (10, F(2)),
                     (15, F(3, 2)), (20, F(3, 2))):
        d = float(alpha) / n
        got = switch_year(n, alpha)
        assert got == expected[n], (n, got)
        assert got == math.ceil(n + 1.5 - 1.0 / d), (n, got)
    # and the no-convention formula differs by one for exactly the long classes
    for n, alpha, same in ((3, 2, True), (5, 2, True), (7, 2, True),
                           (10, 2, False), (15, 1.5, False), (20, 1.5, False)):
        d = alpha / n
        assert (math.ceil(n + 1 - 1.0 / d) == expected[n]) is same, n


check_against_published()

M5 = macrs_percentages(5, F(2))
M7 = macrs_percentages(7, F(2))

# The 5-year column is exact at two decimals, so the derived fractions ARE the
# published ones. The 7-year column is not: the exact post-switch deduction is
# 8.92485% and the IRS prints 8.93, 8.92, 8.93 so the column totals 100.000%.
# Schedules the lesson prints use the published two-decimal column, because
# that is what a candidate is handed; it is defined here and checked both for
# summing to exactly 1 and for agreeing with the derivation to a hundredth.
P7 = [F(x, 10000) for x in (1429, 2449, 1749, 1249, 893, 892, 893, 446)]
assert sum(P7) == 1, sum(P7)
for _d, _p in zip(M7, P7):
    assert abs(_d - _p) <= F(1, 10000), (float(_d), float(_p))
assert [round(float(x) * 100, 2) for x in M5] == [20.00, 32.00, 19.20, 11.52,
                                                  11.52, 5.76]


def pw(flows, i):
    """Present worth of (year, amount) pairs, discounted one year at a time."""
    return sum(float(a) / (1.0 + i) ** k for k, a in flows)


# ---------------------------------------------------------------------------
# 1. the three senses of depreciation
# ---------------------------------------------------------------------------
@figure("econ3-three-senses")
def _(mode):
    """One 165,000 asset carried three different ways.

    Book:     straight line, S = 15,000, n = 10  ->  BV_t = 165000 - 15000 t
    Tax:      7-year MACRS, derived here, runs to zero in eight tax years
    Economic: a resale model the lesson states outright, 165000(0.82)^t

    The point is that the three curves answer three different questions and
    are under no obligation to agree.
    """
    c = S.SERIES[mode]
    B = 165000.0
    yrs = np.arange(0, 11)
    book = B - 15000.0 * yrs

    tax = [B]
    for p in P7:
        tax.append(tax[-1] - B * float(p))
    tax = np.array(tax)                       # 9 points, years 0..8
    econ = B * 0.82 ** yrs

    closes(straight_line(165000, 15000, 10), 165000, 150000)
    closes([F(165000) * p for p in P7], 165000, 165000)
    assert abs(book[4] - 105000.0) < 1e-9
    assert abs(book[10] - 15000.0) < 1e-9
    assert abs(tax[5] - 36811.5) < 1e-6, tax[5]
    assert abs(tax[8] - 0.0) < 1e-6, tax[8]
    assert abs(econ[5] - 165000.0 * 0.82 ** 5) < 1e-9
    assert abs(econ[5] - 61172.074128) < 5e-6, econ[5]
    assert abs(book[5] - 90000.0) < 1e-9
    # the tax curve is BELOW the book curve from year 1 onward: acceleration
    for k in range(1, 9):
        assert tax[k] < book[k], k

    fig, ax = plt.subplots()
    ax.plot(yrs, book / 1000.0, color=c[0], lw=2.2, marker="o", ms=4)
    ax.plot(np.arange(0, 9), tax / 1000.0, color=c[1], lw=2.2, marker="o", ms=4)
    ax.plot(yrs, econ / 1000.0, color=c[2], lw=2.2, ls=(0, (5, 3)))
    S.label_end(ax, 10, book[10] / 1000.0, "book value\n(straight line)", c[0], mode,
                dx=6, dy=6)
    S.label_end(ax, 3, tax[3] / 1000.0, "unrecovered tax basis\n(7-year MACRS)",
                c[1], mode, dx=-8, dy=-22, ha="right")
    S.label_end(ax, 8.4, econ[8] / 1000.0,
                "market value\n(stated resale model)", c[2], mode, dx=4, dy=16)
    for yv in (book[5], tax[5], econ[5]):
        ax.plot([5], [yv / 1000.0], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 3.9, 150.0, "end of year 5, one asset, three answers: 90,000 on\n"
                           "the books, 61,172.07 to a buyer, 36,811.50 to the\n"
                           "tax code", mode)
    ax.set_xlabel("years since placed in service")
    ax.set_ylabel("value carried  (thousands)")
    ax.set_title("Three senses of depreciation on one 165,000 asset")
    ax.set_xlim(0, 11.6)
    ax.set_ylim(0, 185)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# 2. the declining-balance salvage floor
# ---------------------------------------------------------------------------
@figure("econ3-db-floor")
def _(mode):
    """200% declining balance on 60,000 with an 8,000 salvage floor, n = 5.

    Unrestrained: BV_t = 60000(0.6)^t, which passes below 8,000 during year 4.
    Restrained:   the year-4 deduction is cut to 4,960 so book value lands
                  exactly on 8,000, and year 5 gets nothing at all.
    """
    c = S.SERIES[mode]
    B, Sv, n, d = 60000.0, 8000.0, 5, 0.4

    sched = declining_balance(60000, 8000, n, 2)
    closes(sched, 60000, 52000)
    assert [float(x) for x in sched] == [24000.0, 14400.0, 8640.0, 4960.0, 0.0]

    t = np.linspace(0, 5, 501)
    free = B * (1.0 - d) ** t
    held = [B]
    for D in sched:
        held.append(held[-1] - float(D))
    held = np.array(held)

    assert abs(B * (1 - d) ** 3 - 12960.0) < 1e-9
    assert abs(B * (1 - d) ** 4 - 7776.0) < 1e-9
    assert abs(B * (1 - d) ** 5 - 4665.6) < 1e-9
    cross = np.log(Sv / B) / np.log(1.0 - d)
    assert abs(cross - 3.944404757) < 5e-9, cross
    assert 3 < cross < 4
    assert held[-1] == Sv

    fig, ax = plt.subplots()
    ax.plot(t, free / 1000.0, color=c[1], lw=2.0, ls=(0, (5, 3)))
    ax.plot(np.arange(0, 6), held / 1000.0, color=c[0], lw=2.4, marker="o", ms=5)
    ax.axhline(Sv / 1000.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, 5, held[-1] / 1000.0, "schedule actually\nallowed", c[0], mode,
                dx=6, dy=10)
    S.label_end(ax, 5.0, free[-1] / 1000.0, "unrestrained\n0.4 of book value", c[1],
                mode, dx=8, dy=-4)
    S.note(ax, 0.15, 8.6, "salvage floor S = 8,000", mode)
    ax.plot([cross], [Sv / 1000.0], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 2.25, 36.0, "the floor is crossed at t = 3.944, so YEAR 4 is\n"
                           "the first year cut short: 4,960 instead of\n"
                           "5,184, and year 5 gets nothing at all", mode)
    ax.set_xlabel("year")
    ax.set_ylabel("book value  (thousands)")
    ax.set_title("Declining balance meets the salvage floor")
    ax.set_xlim(0, 5.9)
    ax.set_ylim(0, 62)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# 3. how the switch year is found
# ---------------------------------------------------------------------------
@figure("econ3-switch-construction")
def _(mode):
    """The two candidate deductions each year, for 150% DB on 60,000/8,000/5.

    declining balance:   0.30 x BV_(t-1)
    straight line left:  (BV_(t-1) - 8000) / (5 - t + 1)
    taken:               the larger of the two, which is the switch rule

    The candidates cross during year 4, which is where the schedule switches.
    """
    c = S.SERIES[mode]
    B, Sv, n, d = F(60000), F(8000), 5, F(3, 10)

    sched, switch = db_with_switch(60000, 8000, n, F(3, 2))
    closes(sched, 60000, 52000)
    assert switch == 4, switch
    assert [float(x) for x in sched] == [18000.0, 12600.0, 8820.0, 6290.0, 6290.0]

    bv = B
    db_cand, sl_cand, taken = [], [], []
    for t in range(1, n + 1):
        db_cand.append(float(d * bv))
        sl_cand.append(float((bv - Sv) / (n - t + 1)))
        taken.append(float(sched[t - 1]))
        bv -= F(sched[t - 1])
    assert bv == Sv
    assert abs(db_cand[3] - 6174.0) < 1e-9
    assert abs(sl_cand[3] - 6290.0) < 1e-9
    assert sl_cand[3] > db_cand[3] and sl_cand[2] < db_cand[2]
    # the salvage-free closed form predicts an EARLIER switch, year 3
    tstar = n + 1 - 1.0 / float(d)
    assert abs(tstar - 2.6666666667) < 1e-9, tstar

    k = np.arange(1, 6)
    fig, ax = plt.subplots()
    w = 0.3
    ax.bar(k - w / 2, np.array(db_cand) / 1000.0, width=w, color=c[0], edgecolor="none")
    ax.bar(k + w / 2, np.array(sl_cand) / 1000.0, width=w, color=c[1], edgecolor="none")
    ax.plot(k, np.array(taken) / 1000.0, color=c[2], lw=2.2, marker="o", ms=6)
    S.label_end(ax, 1, db_cand[0] / 1000.0, "declining balance\n0.30 of book value",
                c[0], mode, dx=8, dy=16)
    S.label_end(ax, 5, sl_cand[4] / 1000.0, "straight line over\nthe life remaining",
                c[1], mode, dx=6, dy=14)
    S.label_end(ax, 3, taken[2] / 1000.0, "taken", c[2], mode, dx=-6, dy=18, ha="right")
    ax.axvline(3.5, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 3.58, 15.6, "candidates cross here:\nswitch in year 4", mode)
    ax.set_xlabel("year  t")
    ax.set_ylabel("candidate deduction  (thousands)")
    ax.set_title("The switch year is where straight line overtakes declining balance")
    ax.set_xticks(list(range(1, 6)))
    ax.set_xlim(0.4, 6.3)
    ax.set_ylim(0, 21.5)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# 4. what the conventions do to the first year
# ---------------------------------------------------------------------------
@figure("econ3-macrs-conventions")
def _(mode):
    """Cumulative recovery of a 5-year MACRS asset under three conventions.

    All three columns are DERIVED by the same algorithm; only the first-year
    fraction q changes: 1/2 half-year, 7/8 first quarter, 1/8 fourth quarter.
    All three finish at 100% in the sixth tax year.
    """
    c = S.SERIES[mode]
    cols = {
        "half-year": macrs_percentages(5, F(2), F(1, 2)),
        "mid-quarter, Q1": macrs_percentages(5, F(2), F(7, 8)),
        "mid-quarter, Q4": macrs_percentages(5, F(2), F(1, 8)),
    }
    for name, col in cols.items():
        assert sum(col) == 1, name
        closes([F(165000) * p for p in col], 165000, 165000)
    assert [round(float(x) * 100, 2) for x in cols["half-year"]] == \
        [20.00, 32.00, 19.20, 11.52, 11.52, 5.76]
    assert [round(float(x) * 100, 2) for x in cols["mid-quarter, Q1"]] == \
        [35.00, 26.00, 15.60, 11.01, 11.01, 1.38]
    assert [round(float(x) * 100, 2) for x in cols["mid-quarter, Q4"]] == \
        [5.00, 38.00, 22.80, 13.68, 10.94, 9.58]

    yrs = np.arange(0, 7)
    fig, ax = plt.subplots()
    for j, (name, col) in enumerate(cols.items()):
        cum = np.concatenate(([0.0], np.cumsum([float(x) * 100 for x in col])))
        assert abs(cum[-1] - 100.0) < 1e-9, name
        ax.plot(yrs, cum, color=c[j], lw=2.2, marker="o", ms=5)
        S.label_end(ax, 6, cum[-1], name, c[j], mode, dx=6, dy=(4 - 17 * j))
    S.note(ax, 2.55, 17.0, "same asset, same class, same algorithm -\n"
                           "only the FIRST-YEAR fraction differs:\n"
                           "1/2, 7/8 and 1/8 of a year", mode)
    ax.set_xlabel("tax year")
    ax.set_ylabel("cumulative recovery  (% of basis)")
    ax.set_title("Conventions move the first year, not the total")
    ax.set_xlim(0, 8.2)
    ax.set_ylim(0, 108)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# 5. what the shield is worth
# ---------------------------------------------------------------------------
@figure("econ3-shield-pv")
def _(mode):
    """Present worth of the depreciation tax shield against the discount rate.

    Basis 165,000, tax rate 21%, so every schedule shields the same 34,650 in
    nominal dollars when it writes off the whole basis. Only the timing, and
    the length of the recovery period, differ.
    """
    c = S.SERIES[mode]
    B, tax = 165000.0, 0.21
    macrs5 = [float(x) * B for x in M5]
    sl6 = [B / 6.0] * 6
    sl10 = [B / 10.0] * 10
    for name, sch in (("m5", macrs5), ("sl6", sl6), ("sl10", sl10)):
        assert abs(sum(sch) - B) < 1e-6, name
    closes([F(165000) * p for p in M5], 165000, 165000)

    rates = np.linspace(0.0, 0.25, 501)

    def curve(sch):
        return np.array([sum(D * tax / (1 + r) ** k for k, D in enumerate(sch, 1))
                         for r in rates])

    a, b, e = curve(macrs5), curve(sl6), curve(sl10)
    assert abs(a[0] - 34650.0) < 1e-6 and abs(b[0] - 34650.0) < 1e-6
    assert abs(e[0] - 34650.0) < 1e-6
    at10 = sum(D * tax / 1.1 ** k for k, D in enumerate(macrs5, 1))
    bt10 = sum(D * tax / 1.1 ** k for k, D in enumerate(sl6, 1))
    et10 = sum(D * tax / 1.1 ** k for k, D in enumerate(sl10, 1))
    assert abs(at10 - 26793.47) < 5e-3, at10
    assert abs(bt10 - 25151.63) < 5e-3, bt10
    assert abs(et10 - 21290.93) < 5e-3, et10
    # the annuity factor route must agree with year-by-year discounting
    pa6 = (1.1 ** 6 - 1) / (0.1 * 1.1 ** 6)
    assert abs(B / 6.0 * tax * pa6 - bt10) < 1e-6
    assert at10 > bt10 > et10

    fig, ax = plt.subplots()
    ax.plot(rates * 100, a / 1000.0, color=c[0], lw=2.2)
    ax.plot(rates * 100, b / 1000.0, color=c[1], lw=2.2)
    ax.plot(rates * 100, e / 1000.0, color=c[2], lw=2.2)
    S.label_end(ax, 25, a[-1] / 1000.0, "5-year MACRS", c[0], mode, dx=6, dy=12)
    S.label_end(ax, 25, b[-1] / 1000.0, "straight line, 6 years", c[1], mode, dx=6, dy=0)
    S.label_end(ax, 25, e[-1] / 1000.0, "straight line, 10 years", c[2], mode,
                dx=6, dy=-12)
    ax.axvline(10.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 10.5, 30.0, "at 10%: 26,793.47 against 25,151.63 - acceleration is\n"
                           "worth 1,641.84, while the longer period costs 3,860.71", mode)
    ax.set_xlabel("discount rate  (%)")
    ax.set_ylabel("present worth of the shield  (thousands)")
    ax.set_title("What the depreciation tax shield is worth: 165,000 basis at 21%")
    ax.set_xlim(0, 32)
    ax.set_ylim(0, 38)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# 6. one project, two schedules
# ---------------------------------------------------------------------------
@figure("econ3-npv-by-method")
def _(mode):
    """After-tax present worth of ONE project under two depreciation methods.

    165,000 now; 42,000 a year of revenue less cash expenses for six years;
    sold for 30,000 at the end of year 6; 21% tax. Both schedules write off the
    whole 165,000 by year 6, so the disposal tax is identical and the entire
    difference between the curves is timing.
    """
    c = S.SERIES[mode]
    B, RmE, tax, sale = 165000.0, 42000.0, 0.21, 30000.0
    macrs5 = [float(x) * B for x in M5]
    sl6 = [B / 6.0] * 6
    closes([F(165000) * p for p in M5], 165000, 165000)
    closes([F(165000) / 6] * 6, 165000, 165000)

    after_tax_sale = sale - tax * sale
    assert abs(after_tax_sale - 23700.0) < 1e-9

    def flows(sch):
        out = [(0, -B)]
        for k, D in enumerate(sch, 1):
            a = RmE * (1 - tax) + D * tax + (after_tax_sale if k == 6 else 0.0)
            out.append((k, a))
        return out

    fm, fs = flows(macrs5), flows(sl6)
    assert abs(fm[1][1] - 40110.0) < 1e-9, fm[1][1]
    assert abs(fs[1][1] - 38955.0) < 1e-9, fs[1][1]
    assert abs(fm[6][1] - 58875.84) < 1e-9, fm[6][1]

    rates = np.linspace(0.0, 0.25, 501)
    pm = np.array([pw(fm, r) for r in rates])
    ps = np.array([pw(fs, r) for r in rates])
    assert abs(pw(fm, 0.10) - 19679.06) < 5e-3, pw(fm, 0.10)
    assert abs(pw(fs, 0.10) - 18037.21) < 5e-3, pw(fs, 0.10)
    # the whole gap at 10% is the shield gap, computed independently
    gap = sum(D * tax / 1.1 ** k for k, D in enumerate(macrs5, 1)) - \
        sum(D * tax / 1.1 ** k for k, D in enumerate(sl6, 1))
    assert abs((pw(fm, 0.10) - pw(fs, 0.10)) - gap) < 1e-6

    def irr(f):
        lo, hi = 0.0, 1.0
        for _ in range(200):
            mid = 0.5 * (lo + hi)
            if pw(f, mid) > 0:
                lo = mid
            else:
                hi = mid
        return lo

    im, isl = irr(fm), irr(fs)
    assert abs(im - 0.138435) < 5e-6, im
    assert abs(isl - 0.134310) < 5e-6, isl
    assert im > isl

    fig, ax = plt.subplots()
    ax.axvspan(isl * 100, im * 100, color=S.GUIDE[mode], alpha=0.22, lw=0)
    ax.plot(rates * 100, pm / 1000.0, color=c[0], lw=2.3)
    ax.plot(rates * 100, ps / 1000.0, color=c[1], lw=2.3)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.1)
    S.label_end(ax, 6.0, pw(fm, 0.06) / 1000.0, "5-year MACRS", c[0], mode, dx=6, dy=12)
    S.label_end(ax, 6.0, pw(fs, 0.06) / 1000.0, "straight line, 6 years", c[1], mode,
                dx=6, dy=-14)
    for r, lab, col in ((im, f"IRR {im*100:.2f}%", c[0]), (isl, f"IRR {isl*100:.2f}%", c[1])):
        ax.plot([r * 100], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 15.0, 6.0, "between 13.43% and 13.84% the SAME project is\n"
                          "rejected on straight line and accepted on MACRS", mode)
    S.note(ax, 0.4, -32.0, "at 10% the two present worths are 19,679.06 and\n"
                           "18,037.21 - a gap of 1,641.84, all of it timing", mode)
    ax.set_xlabel("after-tax MARR  (%)")
    ax.set_ylabel("after-tax present worth  (thousands)")
    ax.set_title("One project, two schedules: where the decision flips")
    ax.set_xlim(0, 25.5)
    ax.set_ylim(-40, 90)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# 7. disposal
# ---------------------------------------------------------------------------
@figure("econ3-disposal-regions")
def _(mode):
    """Net after-tax proceeds against sale price, for the 165,000 asset sold at
    the end of tax year 5 with a book value of 36,811.50 under 7-year MACRS.

    Below book value the sale books a deductible loss and the seller keeps MORE
    than the sale price. Above book value the excess is recaptured at the
    ordinary rate up to the original basis, and only beyond the basis does the
    lower capital-gain rate apply.
    """
    c = S.SERIES[mode]
    B, tax, cg = 165000.0, 0.21, 0.15
    bv = float(F(165000) * (1 - sum(P7[:5])))
    assert abs(bv - 36811.5) < 1e-6, bv

    sp = np.linspace(0.0, 210000.0, 1051)
    ordinary = np.clip(sp - bv, None, B - bv)
    capital = np.clip(sp - B, 0.0, None)
    net = sp - tax * ordinary - cg * capital

    assert abs(np.interp(60000.0, sp, net) - (60000.0 - 0.21 * (60000.0 - bv))) < 1e-6
    assert abs((60000.0 - 0.21 * (60000.0 - bv)) - 55130.415) < 1e-6
    assert abs((25000.0 - 0.21 * (25000.0 - bv)) - 27480.415) < 1e-6
    at_basis = B - tax * (B - bv)
    assert abs(at_basis - 138080.415) < 1e-6, at_basis
    assert abs((180000.0 - tax * (B - bv) - cg * 15000.0) - 150830.415) < 1e-6

    fig, ax = plt.subplots()
    ax.plot(sp / 1000.0, sp / 1000.0, color=c[1], lw=1.8, ls=(0, (5, 3)))
    ax.plot(sp / 1000.0, net / 1000.0, color=c[0], lw=2.4)
    ax.axvline(bv / 1000.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    ax.axvline(B / 1000.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(ax, 205, net[-1] / 1000.0, "net after tax", c[0], mode, dx=6, dy=-6)
    S.label_end(ax, 118, 118.0, "sale price", c[1], mode, dx=-4, dy=12, ha="right")
    S.note(ax, bv / 1000.0 + 2.0, 4.0, "book value\n36,811.50", mode)
    S.note(ax, B / 1000.0 + 2.0, 4.0, "original basis\n165,000", mode)
    S.note(ax, 3.0, 178.0, "left of book value the seller keeps MORE than the\n"
                           "price, because the loss is deductible. Right of it,\n"
                           "recapture bites.", mode)
    ax.set_xlabel("sale price  (thousands)")
    ax.set_ylabel("proceeds kept after tax  (thousands)")
    ax.set_title("Disposal: book value, not purchase price, sets the tax")
    ax.set_xlim(0, 215)
    ax.set_ylim(0, 215)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "econ3-"
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith("econ3-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
