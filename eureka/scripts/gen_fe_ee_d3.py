#!/usr/bin/env python3
"""Depth-wave figures for two FE Electrical and Computer chapters:
Number Systems and Boolean Algebra, and Combinational Logic.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Every mark here is COMPUTED, in this file, from an
equation or an enumeration the lesson that references it writes out. Nothing is
traced, scanned, redrawn or adapted from the NCEES Reference Handbook or any
textbook - the pipeline consumes formulas and truth tables, which are not
protected expression, and never anyone's drawing of them.

The rule this file adds on top of that contract is EXHAUSTIVE VERIFICATION.
Digital logic is finite: a four-variable claim has sixteen rows, an eight-bit
overflow claim has 65,536 operand pairs, and there is therefore never an excuse
for asserting a Boolean identity by re-reading one's own algebra. Every
minimised expression drawn or quoted here is checked against the function it
claims to equal on EVERY input combination, and every arithmetic result is
recomputed by a route that does not share machinery with the first one.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/dig2-<name>.svg
    apps/web/public/courses/fe-ee/figures/dig2-<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_d3.py             # all
    python3 scripts/gen_fe_ee_d3.py dig2-kmap   # only names with that prefix
"""
from __future__ import annotations

import pathlib
import struct
import sys
from fractions import Fraction
from itertools import combinations, product

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}

# Every expression this file verifies, counted so the chapter can quote the
# figure honestly rather than claiming "checked" with no number behind it.
CHECKED: list[tuple[str, int]] = []


def figure(name):
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def check(label: str, n_vars: int, want, got) -> None:
    """Assert two Boolean functions of n_vars agree on ALL 2**n_vars rows.

    `want` and `got` are callables taking the variables as separate positional
    bits. Failure names the first differing row so a wrong term is located, not
    merely detected.
    """
    rows = 0
    for bits in product((0, 1), repeat=n_vars):
        rows += 1
        a, b = bool(want(*bits)), bool(got(*bits))
        if a != b:
            raise AssertionError(
                f"{label}: row {bits} -> reference {int(a)}, candidate {int(b)}"
            )
    CHECKED.append((label, rows))


# 2-bit Gray order, the labelling that makes physical adjacency on a Karnaugh
# map mean logical adjacency in the variables.
GRAY2 = [0, 1, 3, 2]


def kmap4(row: int, col: int) -> int:
    """Minterm index of a 4-variable K-map cell, rows AB and columns CD."""
    return (GRAY2[row] << 2) | GRAY2[col]


def kmap3(row: int, col: int) -> int:
    """Minterm index of a 3-variable K-map cell, row A and columns BC."""
    return (row << 2) | GRAY2[col]


def bits4(m: int):
    return (m >> 3) & 1, (m >> 2) & 1, (m >> 1) & 1, m & 1


def bits3(m: int):
    return (m >> 2) & 1, (m >> 1) & 1, m & 1


# ---------------------------------------------------------------------------
# Number systems
# ---------------------------------------------------------------------------


def trunc_bits(x: Fraction, k: int) -> Fraction:
    """The k-bit truncated binary expansion of a fraction in [0, 1)."""
    return Fraction(int(x * 2 ** k), 2 ** k)


def bin_frac_digits(x: Fraction, k: int) -> str:
    """The first k bits produced by the repeated-multiplication algorithm."""
    out, r = [], x
    for _ in range(k):
        r *= 2
        out.append("1" if r >= 1 else "0")
        if r >= 1:
            r -= 1
    return "".join(out)


def order_of_two(q: int) -> int:
    """Multiplicative order of 2 modulo an odd q > 1: the repeat period."""
    assert q % 2 == 1 and q > 1
    k, v = 1, 2 % q
    while v != 1:
        v = (v * 2) % q
        k += 1
    return k


@figure("dig2-frac-binary")
def _(mode):
    """Truncation error of a binary fraction against the number of bits kept.

    Error is e_k = x - floor(x * 2^k)/2^k, computed in exact rational
    arithmetic so the plotted points are the algorithm's own output and not a
    floating-point echo of it. The bound e_k < 2^-k is drawn alongside.
    """
    c = S.SERIES[mode]
    ks = np.arange(1, 25)
    curves = []
    for x, name in ((Fraction(7, 10), "x = 0.7"), (Fraction(1, 10), "x = 0.1")):
        e = [float(x - trunc_bits(x, int(k))) for k in ks]
        curves.append((name, e))

    # Independent route: the repeated-multiplication digit string must rebuild
    # the same truncated value that integer scaling produced.
    for x in (Fraction(7, 10), Fraction(1, 10)):
        for k in (4, 8, 16, 23):
            s = bin_frac_digits(x, k)
            rebuilt = sum(Fraction(int(b), 2 ** (i + 1)) for i, b in enumerate(s))
            assert rebuilt == trunc_bits(x, k), (x, k)

    # the exact figures the prose quotes
    assert Fraction(7, 10) - trunc_bits(Fraction(7, 10), 4) == Fraction(1, 80)
    assert Fraction(7, 10) - trunc_bits(Fraction(7, 10), 8) == Fraction(1, 1280)
    assert Fraction(1, 10) - trunc_bits(Fraction(1, 10), 8) == Fraction(3, 1280)
    assert trunc_bits(Fraction(5, 8), 3) == Fraction(5, 8)  # 0.625 terminates
    assert bin_frac_digits(Fraction(5, 8), 3) == "101"
    assert bin_frac_digits(Fraction(7, 10), 9) == "101100110"
    assert bin_frac_digits(Fraction(1, 10), 9) == "000110011"
    # termination and period from number theory, not from reading the digits
    assert order_of_two(5) == 4  # denominator 10 with the 2s removed
    assert bin_frac_digits(Fraction(7, 10), 21)[1:] == "0110" * 5
    assert bin_frac_digits(Fraction(1, 10), 21)[1:] == "0011" * 5

    fig, ax = plt.subplots()
    for i, (name, e) in enumerate(curves):
        ax.semilogy(ks, e, color=c[i], marker="o", ms=3.4)
        S.label_end(ax, ks[-1], e[-1], name, c[i], mode)
    bound = [2.0 ** -int(k) for k in ks]
    ax.semilogy(ks, bound, color=S.GUIDE[mode], ls="--", lw=1.3)
    S.note(ax, 3.4, 2.0 ** -2.4, "bound 2^-k", mode, va="bottom")
    ax.plot([8], [float(Fraction(1, 1280))], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.annotate("8 bits of 0.7 leaves 1/1280 = 7.8125e-4",
                xy=(8, float(Fraction(1, 1280))), xytext=(11.5, 4e-2),
                color=S.INK_2[mode], fontsize=9,
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.0))
    ax.set_xlabel("fraction bits kept, k")
    ax.set_ylabel("truncation error")
    ax.set_title("A fraction that never terminates: error falls but never reaches zero")
    ax.set_xlim(0.4, 27.5)
    S.strip(ax)
    return fig


@figure("dig2-signed-maps")
def _(mode):
    """Value assigned to each 4-bit pattern by three signed conventions.

    Sign-magnitude and one's complement both map two patterns to zero and cover
    -7..+7; two's complement is a bijection onto -8..+7. All three curves are
    generated from their defining rules, and the range end points are asserted.
    """
    c = S.SERIES[mode]
    n = 4
    pat = np.arange(2 ** n)

    def sign_mag(p):
        mag = p & (2 ** (n - 1) - 1)
        return -mag if (p >> (n - 1)) & 1 else mag

    def ones_comp(p):
        return -((~p) & (2 ** n - 1)) if (p >> (n - 1)) & 1 else p

    def twos_comp(p):
        return p - 2 ** n if (p >> (n - 1)) & 1 else p

    sm = np.array([sign_mag(int(p)) for p in pat])
    oc = np.array([ones_comp(int(p)) for p in pat])
    tc = np.array([twos_comp(int(p)) for p in pat])

    assert sorted(set(sm)) == list(range(-7, 8))
    assert sorted(set(oc)) == list(range(-7, 8))
    assert sorted(tc) == list(range(-8, 8))
    assert len(set(tc)) == 16 and len(set(sm)) == 15 and len(set(oc)) == 15
    assert list(sm).count(0) == 2 and list(oc).count(0) == 2 and list(tc).count(0) == 1
    # two's complement value read a second way: p - 2^n * msb, i.e. the negative
    # weight on the top column. Must match the branch above on all 16 patterns.
    for p in range(16):
        assert twos_comp(p) == p - 2 ** n * ((p >> (n - 1)) & 1)

    fig, ax = plt.subplots()
    for i, (y, name) in enumerate(((sm, "sign-magnitude"), (oc, "one's complement"),
                                   (tc, "two's complement"))):
        ax.plot(pat, y, color=c[i], marker="o", ms=4.4, lw=1.7)
        S.label_end(ax, pat[-1], y[-1], name, c[i], mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([8], [-8], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 7.7, -7.4, "1000 is -8: the extra value\nno other convention has", mode)
    ax.set_xticks(range(0, 16, 2))
    ax.set_xlabel("bit pattern read as an unsigned integer")
    ax.set_ylabel("value assigned")
    ax.set_title("Three readings of the same sixteen 4-bit patterns")
    ax.set_xlim(-0.6, 20.5)
    ax.set_ylim(-9.4, 8.4)
    S.strip(ax)
    return fig


@figure("dig2-overflow-map")
def _(mode):
    """Carry and signed overflow over all 256 pairs of 4-bit operands.

    Both flags are produced by the hardware rule - C is the carry out of the
    top column, V is that carry exclusive-ORed with the carry into it - and
    each is then checked against its meaning: C must equal "the unsigned sum
    exceeded 15", V must equal "the signed sum left -8..+7".
    """
    c = S.SERIES[mode]
    n, mask = 4, 0xF
    both, conly, vonly, neither = [], [], [], []
    for a in range(16):
        for b in range(16):
            s = a + b
            cout = (s >> n) & 1
            cin_top = ((a & 7) + (b & 7)) >> (n - 1)  # carry into the top column
            v = cout ^ cin_top
            # independent meanings
            assert cout == int(a + b > mask)
            sa = a - 16 if a >> 3 else a
            sb = b - 16 if b >> 3 else b
            assert v == int(not (-8 <= sa + sb <= 7)), (a, b)
            # the same-sign precondition, verified rather than asserted in prose
            if (sa < 0) != (sb < 0):
                assert v == 0, (a, b)
            (both if (cout and v) else conly if cout else vonly if v else neither
             ).append((sa, sb))
    assert len(both) + len(conly) + len(vonly) + len(neither) == 256
    n_v, n_c = len(both) + len(vonly), len(both) + len(conly)
    # 28 both-positive pairs sum above +7 and 36 both-negative pairs sum below
    # -8, so V fires on 64; C fires on the 120 pairs whose unsigned sum passes
    # 15; the 36 shared by both are exactly the both-negative cases.
    assert n_v == 64 and n_c == 120 and len(both) == 36, (n_v, n_c, len(both))
    assert sum(1 for a in range(8) for b in range(8) if a + b > 7) == 28
    assert sum(1 for a in range(1, 9) for b in range(1, 9) if a + b > 8) == 36
    CHECKED.append(("4-bit carry/overflow flags over all operand pairs", 256))

    fig, ax = plt.subplots(figsize=(6.4, 5.4))
    ax.plot([p[0] for p in neither], [p[1] for p in neither], "s",
            color=S.GRID[mode], ms=9.5, mew=0)
    for i, (pts, name) in enumerate(((conly, "carry only, 84"),
                                     (vonly, "overflow only, 28"),
                                     (both, "both, 36"))):
        ax.plot([p[0] for p in pts], [p[1] for p in pts], "s",
                color=c[i], ms=9.5, mew=0, label=name)
    assert len(conly) == 84 and len(vonly) == 28
    S.note(ax, -8.6, 8.15, "64 of the 256 pairs set V; 120 set C; 36 set both", mode)
    ax.set_xticks(range(-8, 8, 2))
    ax.set_yticks(range(-8, 8, 2))
    ax.set_xlabel("operand A read as signed")
    ax.set_ylabel("operand B read as signed")
    ax.set_title("The two flags are independent: neither region contains the other")
    ax.legend(loc="lower left", bbox_to_anchor=(0.0, -0.30), ncol=3, fontsize=9.5)
    ax.set_xlim(-8.7, 7.7)
    ax.set_ylim(-8.7, 9.0)
    S.strip(ax)
    return fig


@figure("dig2-bcd-plus6")
def _(mode):
    """Which single-digit BCD sums need the plus-six correction.

    Every one of the 100 digit pairs is added in raw binary and compared with
    the decimal answer; the correction is applied where the raw nibble leaves
    the decimal range, and the corrected digit and carry are checked against
    ordinary base-ten arithmetic.
    """
    c = S.SERIES[mode]
    need, clean, hicarry = [], [], []
    for a in range(10):
        for b in range(10):
            raw = a + b
            if raw > 9:
                digit, carry = (raw + 6) & 0xF, 1
                (hicarry if raw > 15 else need).append((a, b))
            else:
                digit, carry = raw, 0
                clean.append((a, b))
            # independent route: plain decimal arithmetic
            assert digit == (a + b) % 10 and carry == (a + b) // 10, (a, b)
    assert len(clean) == 55 and len(need) == 39 and len(hicarry) == 6
    assert len(clean) + len(need) + len(hicarry) == 100
    CHECKED.append(("BCD plus-six correction over all single-digit sums", 100))

    fig, ax = plt.subplots(figsize=(6.2, 5.2))
    ax.plot([p[0] for p in clean], [p[1] for p in clean], "s",
            color=S.GRID[mode], ms=15, mew=0)
    for i, (pts, name) in enumerate(((need, "sum 10-15: correct, carry out"),
                                     (hicarry, "sum 16-18: nibble already carried"))):
        ax.plot([p[0] for p in pts], [p[1] for p in pts], "s",
                color=c[i], ms=15, mew=0, label=name)
    S.note(ax, -0.55, 9.9, "45 of the 100 digit pairs need +6; 55 need nothing", mode)
    ax.set_xticks(range(10))
    ax.set_yticks(range(10))
    ax.set_xlabel("first BCD digit")
    ax.set_ylabel("second BCD digit")
    ax.set_title("The plus-six rule, decided by the raw binary sum alone")
    ax.legend(loc="lower left", bbox_to_anchor=(0.0, -0.31), fontsize=9.5, ncol=1)
    ax.set_xlim(-0.6, 9.6)
    ax.set_ylim(-0.6, 9.8)
    S.strip(ax)
    return fig


@figure("dig2-gray-changes")
def _(mode):
    """Bits that change per increment, plain binary against Gray code.

    Both sequences are generated from their definitions and every consecutive
    pair is exclusive-ORed and its population count taken. The Gray sequence is
    additionally checked to be a permutation of 0..15, so it really is a code
    and not merely a low-transition signal.
    """
    c = S.SERIES[mode]
    n = 4
    gray = [i ^ (i >> 1) for i in range(2 ** n)]
    assert sorted(gray) == list(range(16))
    # decode back by the running exclusive-OR, an independent inverse
    for i in range(16):
        g, b, acc = gray[i], 0, 0
        for k in range(n - 1, -1, -1):
            acc ^= (g >> k) & 1
            b |= acc << k
        assert b == i, (i, g, b)

    def pc(v):
        return bin(v).count("1")

    idx = np.arange(2 ** n)
    b_ch = [pc(int(i) ^ int((i + 1) % 16)) for i in idx]
    g_ch = [pc(gray[int(i)] ^ gray[int((i + 1) % 16)]) for i in idx]
    assert sum(b_ch) == 30 and max(b_ch) == 4
    assert sum(g_ch) == 16 and max(g_ch) == 1
    # the two four-track transitions are the halfway mark and the wrap
    assert [int(i) for i in idx if b_ch[int(i)] == 4] == [7, 15]
    assert abs(np.mean(b_ch) - 1.875) < 1e-12
    CHECKED.append(("Gray code bijection and single-bit transition property", 16))

    fig, ax = plt.subplots()
    ax.step(idx, b_ch, where="mid", color=c[0], lw=2.0)
    ax.step(idx, g_ch, where="mid", color=c[1], lw=2.0)
    S.label_end(ax, idx[-1], b_ch[-1], "binary", c[0], mode)
    S.label_end(ax, idx[-1], g_ch[-1], "Gray", c[1], mode)
    S.note(ax, 6.6, 3.55, "30 track crossings per revolution in binary,\n16 in Gray", mode)
    ax.set_yticks([0, 1, 2, 3, 4])
    ax.set_xticks(range(0, 16, 2))
    ax.set_xlabel("transition from count i to count i+1 (15 wraps to 0)")
    ax.set_ylabel("bits that change")
    ax.set_title("A 4-bit encoder disc: how many tracks switch at once")
    ax.set_xlim(-0.6, 17.6)
    ax.set_ylim(0, 4.5)
    S.strip(ax)
    return fig


def ieee_encode(x: float) -> int:
    return struct.unpack(">I", struct.pack(">f", x))[0]


@figure("dig2-ieee754-fields")
def _(mode):
    """The 32 bits of IEEE-754 single precision for -13.625, field by field.

    The bit string is built by hand from sign, biased exponent and the
    fractional part of the normalised significand, then checked against the
    machine's own encoding of the same number. Both routes must give
    0xC15A0000 or the figure does not render.
    """
    c = S.SERIES[mode]
    x = -13.625
    sign = 1
    e = 3                       # 13.625 = 1.703125 x 2^3
    biased = e + 127
    frac = 13.625 / 2 ** e - 1.0
    assert abs(frac - 0.703125) < 1e-15
    mant = int(round(frac * 2 ** 23))
    word = (sign << 31) | (biased << 23) | mant
    assert word == ieee_encode(x) == 0xC15A0000, hex(word)
    assert biased == 130 and mant == 0x5A0000
    bitstr = f"{word:032b}"
    assert bitstr[0] == "1" and bitstr[1:9] == "10000010"
    assert bitstr[9:] == "10110100000000000000000"
    # decode by the defining formula, an independent route back
    val = (-1) ** sign * (1 + mant / 2 ** 23) * 2 ** (biased - 127)
    assert val == x, val

    fig, ax = plt.subplots(figsize=(9.4, 3.2))
    spans = [(0, 1, "sign  s = 1", 0, "right", -0.55, 0.5),
             (1, 9, "biased exponent  E = 130", 1, "center", 5.0, 1.22),
             (9, 32, "stored fraction  f = 0x5A0000", 2, "center", 20.5, 1.22)]
    for lo, hi, name, i, ha, tx, ty in spans:
        ax.add_patch(Rectangle((lo, 0), hi - lo, 1, facecolor="none",
                               edgecolor=c[i], lw=2.2))
        ax.text(tx, ty, name, ha=ha, va="center" if ha == "right" else "bottom",
                color=c[i], fontsize=10, fontweight="semibold")
    for k, ch in enumerate(bitstr):
        ax.text(k + 0.5, 0.5, ch, ha="center", va="center", fontsize=9,
                color=S.INK[mode])
    for k in (0, 8, 16, 24, 31):
        ax.text(k + 0.5, -0.18, str(31 - k), ha="center", va="top", fontsize=8,
                color=S.INK_2[mode])
    ax.text(16, -0.85, "value = (-1)^1 x 1.703125 x 2^(130-127) = -13.625"
                       "        word = 0xC15A0000",
            ha="center", va="top", fontsize=10, color=S.INK[mode])
    ax.set_xlim(-6.0, 32.5)
    ax.set_ylim(-1.5, 1.9)
    ax.axis("off")
    ax.set_title("Single precision holds 24 significant bits in 23 stored ones",
                 color=S.INK[mode], fontsize=11.5, pad=12)
    return fig


@figure("dig2-ulp-spacing")
def _(mode):
    """Spacing between neighbouring single-precision floats against magnitude.

    The gap is 2^(e-23) throughout a binade, so on log-log axes it is a
    staircase of unit-slope steps. Each plotted gap is measured by encoding the
    number, adding one to the integer word, and decoding - the machine's own
    successor - not by evaluating the formula that the curve is meant to test.
    """
    c = S.SERIES[mode]

    def nextafter_up(v: float) -> float:
        w = ieee_encode(v)
        return struct.unpack(">f", struct.pack(">I", w + 1))[0]

    xs = [2.0 ** k for k in range(-6, 25)]
    gaps = []
    for v in xs:
        g = nextafter_up(v) - v
        e = int(np.floor(np.log2(v)))
        assert abs(g - 2.0 ** (e - 23)) < 1e-30, (v, g)
        gaps.append(g)
    eps = nextafter_up(1.0) - 1.0
    assert eps == 2.0 ** -23
    assert abs(eps - 1.1920928955078125e-07) < 1e-22
    # 2^24 is the first integer whose successor is not itself plus one
    assert nextafter_up(2.0 ** 24) - 2.0 ** 24 == 2.0
    assert nextafter_up(2.0 ** 23) - 2.0 ** 23 == 1.0
    CHECKED.append(("IEEE-754 single spacing across 31 binades", len(xs)))

    fig, ax = plt.subplots()
    ax.loglog(xs, gaps, color=c[0], marker="o", ms=3.6, base=2)
    S.label_end(ax, xs[-1], gaps[-1], "gap to the next float", c[0], mode)
    ax.plot([1.0], [eps], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 1.3, eps * 0.35, "at 1.0 the gap is 2^-23 = 1.1920929e-7", mode)
    ax.plot([2.0 ** 24], [2.0], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 2.0 ** 14, 2.6, "at 2^24 = 16777216 the gap is 2.0:\nodd integers stop existing",
           mode)
    ax.set_xlabel("magnitude")
    ax.set_ylabel("spacing to the next representable value")
    ax.set_title("Resolution is relative: 24 significant bits everywhere")
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Combinational logic
# ---------------------------------------------------------------------------


@figure("dig2-demorgan-grid")
def _(mode):
    """De Morgan for three variables, verified on all eight rows and drawn.

    Both sides of each law are evaluated independently from the variables and
    compared row by row; the drawn grid is the comparison itself, so a
    disagreement would be visible as well as fatal.
    """
    c = S.SERIES[mode]

    check("NOT(A.B.C) = A' + B' + C'", 3,
          lambda A, B, C: not (A and B and C),
          lambda A, B, C: (not A) or (not B) or (not C))
    check("NOT(A+B+C) = A'.B'.C'", 3,
          lambda A, B, C: not (A or B or C),
          lambda A, B, C: (not A) and (not B) and (not C))
    check("NOT(A.B) = A' + B'", 2,
          lambda A, B: not (A and B), lambda A, B: (not A) or (not B))
    check("NOT(A+B) = A'.B'", 2,
          lambda A, B: not (A or B), lambda A, B: (not A) and (not B))

    rows = list(product((0, 1), repeat=3))
    cols = [
        ("A B C", lambda A, B, C: None),
        ("(ABC)'", lambda A, B, C: int(not (A and B and C))),
        ("A'+B'+C'", lambda A, B, C: int((not A) or (not B) or (not C))),
        ("(A+B+C)'", lambda A, B, C: int(not (A or B or C))),
        ("A'B'C'", lambda A, B, C: int((not A) and (not B) and (not C))),
    ]
    fig, ax = plt.subplots(figsize=(7.6, 4.2))
    for j, (name, _f) in enumerate(cols):
        ax.text(j + 0.5, len(rows) + 0.30, name, ha="center", va="bottom",
                fontsize=10.5, fontweight="semibold",
                color=c[0] if j in (1, 2) else c[1] if j in (3, 4) else S.INK[mode])
    for i, r in enumerate(rows):
        y = len(rows) - 1 - i
        for j, (_name, f) in enumerate(cols):
            ax.add_patch(Rectangle((j, y), 1, 1, facecolor="none",
                                   edgecolor=S.GRID[mode], lw=0.9))
            txt = "".join(str(b) for b in r) if j == 0 else str(f(*r))
            ax.text(j + 0.5, y + 0.5, txt, ha="center", va="center", fontsize=11,
                    color=S.INK[mode])
    ax.add_patch(Rectangle((1, 0), 2, len(rows), facecolor="none",
                           edgecolor=c[0], lw=2.4, zorder=4))
    ax.add_patch(Rectangle((3, 0), 2, len(rows), facecolor="none",
                           edgecolor=c[1], lw=2.4, zorder=4))
    S.note(ax, 2.5, -0.55, "identical on all 8 rows", mode, ha="center", va="top")
    S.note(ax, 0.0, -1.35, "Both laws checked here by enumeration, not by algebra: "
                           "8 rows for three variables, 4 for two.", mode, va="top")
    ax.set_xlim(-0.1, 5.1)
    ax.set_ylim(-2.3, 9.2)
    ax.axis("off")
    ax.set_title("De Morgan's laws are theorems about every row of the table",
                 color=S.INK[mode], fontsize=11.5, pad=14)
    return fig


@figure("dig2-kmap3")
def _(mode):
    """A three-variable map: one wrap-around group of four and one pair.

    F = Sm(0,2,4,5,6). The drawn rectangles are the cell sets of C' and A.B',
    and the minimised expression is compared with the minterm list on all eight
    rows before anything is drawn.
    """
    c = S.SERIES[mode]
    mint = {0, 2, 4, 5, 6}
    check("F = Sm(0,2,4,5,6) equals C' + A.B'", 3,
          lambda A, B, C: ((A << 2) | (B << 1) | C) in mint,
          lambda A, B, C: (not C) or (A and not B))

    groups = [
        ("C'  (columns 00 and 10, a wrap group of four)",
         [(0, 0, 2, 1), (0, 3, 2, 1)], lambda m: not bits3(m)[2]),
        ("A.B'  (a plain pair)", [(1, 0, 1, 2)],
         lambda m: bits3(m)[0] and not bits3(m)[1]),
    ]
    for name, rects, pred in groups:
        drawn = {kmap3(r + dr, cc + dc) for (r, cc, nr, nc) in rects
                 for dr in range(nr) for dc in range(nc)}
        assert drawn == {m for m in range(8) if pred(m)}, name
        assert all(m in mint for m in drawn), name

    fig, ax = plt.subplots(figsize=(6.6, 3.9))
    for r in range(2):
        for col in range(4):
            m = kmap3(r, col)
            ax.add_patch(Rectangle((col, 1 - r), 1, 1, facecolor="none",
                                   edgecolor=S.GRID[mode], lw=1.0))
            on = m in mint
            ax.text(col + 0.5, 1 - r + 0.60, "1" if on else "0", ha="center",
                    va="center", fontsize=14, fontweight="bold" if on else "normal",
                    color=S.INK[mode] if on else S.GRID[mode])
            ax.text(col + 0.5, 1 - r + 0.24, f"m{m}", ha="center", va="center",
                    fontsize=7.5, color=S.INK_2[mode])
    for i, (name, rects, _p) in enumerate(groups):
        pad = 0.05 + 0.07 * i
        for (r, cc, nr, nc) in rects:
            ax.add_patch(Rectangle((cc + pad, 1 - r - nr + 1 + pad),
                                   nc - 2 * pad, nr - 2 * pad, facecolor="none",
                                   edgecolor=c[i], lw=2.4, zorder=4))
        ax.text(0.0, -0.55 - 0.42 * i, name, ha="left", va="top", fontsize=9.5,
                color=c[i], fontweight="semibold")
    for r in range(2):
        ax.text(-0.14, 1 - r + 0.5, str(r), ha="right", va="center", fontsize=10,
                color=S.INK_2[mode])
    for col in range(4):
        ax.text(col + 0.5, 2.12, f"{GRAY2[col]:02b}", ha="center", va="bottom",
                fontsize=10, color=S.INK_2[mode])
    ax.text(-0.14, 2.12, "A\\BC", ha="right", va="bottom", fontsize=9.5,
            color=S.INK_2[mode])
    ax.text(4.15, 1.0, "F = C' + A.B'\n3 literals, 2 terms", ha="left", va="center",
            fontsize=11, color=S.INK[mode])
    ax.set_xlim(-0.9, 6.4)
    ax.set_ylim(-1.6, 2.6)
    ax.axis("off")
    ax.set_title("Column 00 is adjacent to column 10: the map wraps",
                 color=S.INK[mode], fontsize=11.5, pad=12)
    return fig


@figure("dig2-kmap-dontcare")
def _(mode):
    """A BCD comparator with and without its don't-cares, on the same map.

    F is 1 when the BCD digit A B C D is 5 or more; inputs 10 to 15 cannot
    occur. Both minimisations are checked against the specification on the ten
    legal rows, and the strict one is additionally checked on all sixteen.
    """
    c = S.SERIES[mode]
    on = {5, 6, 7, 8, 9}
    dc = set(range(10, 16))

    def spec(A, B, C, D):
        return ((A << 3) | (B << 2) | (C << 1) | D) >= 5

    def strict(A, B, C, D):
        return (A and not B and not C) or (not A and B and D) or (not A and B and C)

    def loose(A, B, C, D):
        return A or (B and D) or (B and C)

    # strict form must be exact everywhere, including the unused rows
    check("BCD >= 5 without don't-cares equals A.B'.C' + A'.B.D + A'.B.C", 4,
          lambda A, B, C, D: ((A << 3) | (B << 2) | (C << 1) | D) in on, strict)
    # loose form need only agree on the legal rows
    for m in range(16):
        A, B, C, D = bits4(m)
        if m not in dc:
            assert bool(loose(A, B, C, D)) == spec(A, B, C, D), m
    CHECKED.append(("BCD >= 5 with don't-cares on the ten legal rows", 10))
    assert sum(1 for m in dc if loose(*bits4(m))) == 6  # all six used as 1s

    groups_strict = [
        ("A.B'.C'  m8,m9", [(3, 0, 1, 2)],
         lambda m: bits4(m)[0] and not bits4(m)[1] and not bits4(m)[2]),
        ("A'.B.D  m5,m7", [(1, 1, 1, 2)],
         lambda m: not bits4(m)[0] and bits4(m)[1] and bits4(m)[3]),
        ("A'.B.C  m6,m7", [(1, 2, 1, 2)],
         lambda m: not bits4(m)[0] and bits4(m)[1] and bits4(m)[2]),
    ]
    groups_loose = [
        ("A  the whole A=1 half", [(3, 0, 1, 4), (2, 0, 1, 4)],
         lambda m: bits4(m)[0]),
        ("B.D", [(1, 1, 2, 2)], lambda m: bits4(m)[1] and bits4(m)[3]),
        ("B.C", [(1, 2, 2, 2)], lambda m: bits4(m)[1] and bits4(m)[2]),
    ]
    for gs in (groups_strict, groups_loose):
        for name, rects, pred in gs:
            drawn = {kmap4(r + dr, cc + dc2) for (r, cc, nr, nc) in rects
                     for dr in range(nr) for dc2 in range(nc)}
            assert drawn == {m for m in range(16) if pred(m)}, name
            assert all(m in on or m in dc for m in drawn), name

    lit_strict, lit_loose = 3 + 3 + 3, 1 + 2 + 2
    assert lit_strict == 9 and lit_loose == 5

    fig, axes = plt.subplots(1, 2, figsize=(9.8, 4.8))
    panels = [("treat 10-15 as 0:  9 literals", groups_strict, False),
              ("use 10-15 as don't-cares:  5 literals", groups_loose, True)]
    for ax, (title, groups, use_dc) in zip(axes, panels):
        for r in range(4):
            for col in range(4):
                m = kmap4(r, col)
                ax.add_patch(Rectangle((col, 3 - r), 1, 1, facecolor="none",
                                       edgecolor=S.GRID[mode], lw=1.0))
                if m in on:
                    sym, hot = "1", True
                elif m in dc:
                    sym, hot = ("X", use_dc)
                else:
                    sym, hot = "0", False
                ax.text(col + 0.5, 3 - r + 0.60, sym, ha="center", va="center",
                        fontsize=13, fontweight="bold" if hot else "normal",
                        color=S.INK[mode] if hot else S.GRID[mode])
                ax.text(col + 0.5, 3 - r + 0.24, f"m{m}", ha="center", va="center",
                        fontsize=7, color=S.INK_2[mode])
        for i, (name, rects, _p) in enumerate(groups):
            pad = 0.05 + 0.06 * i
            for (r, cc, nr, nc) in rects:
                ax.add_patch(Rectangle((cc + pad, 3 - r - nr + 1 + pad),
                                       nc - 2 * pad, nr - 2 * pad, facecolor="none",
                                       edgecolor=c[i], lw=2.3, zorder=4))
        for r in range(4):
            ax.text(-0.16, 3 - r + 0.5, f"{GRAY2[r]:02b}", ha="right", va="center",
                    fontsize=9.5, color=S.INK_2[mode])
        for col in range(4):
            ax.text(col + 0.5, 4.14, f"{GRAY2[col]:02b}", ha="center", va="bottom",
                    fontsize=9.5, color=S.INK_2[mode])
        ax.text(-0.16, 4.14, "AB\\CD", ha="right", va="bottom", fontsize=9,
                color=S.INK_2[mode])
        ax.set_title(title, color=S.INK[mode], fontsize=11.5, pad=8)
        ax.set_xlim(-0.95, 4.05)
        ax.set_ylim(-1.30, 4.62)
        ax.axis("off")
    axes[0].text(2.0, -0.45, "A.B'.C' + A'.B.D + A'.B.C", ha="center", va="top",
                 fontsize=10.5, color=S.INK[mode])
    axes[1].text(2.0, -0.45, "A + B.D + B.C", ha="center", va="top",
                 fontsize=10.5, color=S.INK[mode])
    return fig


def _sim(sig: np.ndarray, delay_steps: int) -> np.ndarray:
    """Delay a sampled logic waveform, holding the initial value at the start."""
    out = np.empty_like(sig)
    out[:delay_steps] = sig[0]
    out[delay_steps:] = sig[:len(sig) - delay_steps]
    return out


def _hazard_waves(consensus: bool):
    """Unit-delay simulation of F = A.B + A'.C with B = C = 1 and A falling.

    Every gate contributes one tau. Time is sampled at 100 points per tau so a
    one-tau glitch is 100 samples wide and cannot be an artefact of the grid.
    """
    per = 100
    t = np.arange(0, 12 * per) / per
    A = (t < 5.0).astype(float)
    B = np.ones_like(t)
    C = np.ones_like(t)
    nA = _sim(1 - A, per)                     # inverter
    n1 = _sim(A * B, per)                     # AND, the A.B path
    n2 = _sim(nA * C, per)                    # AND, the A'.C path
    terms = n1 + n2
    if consensus:
        n3 = _sim(B * C, per)                 # AND, the consensus term B.C
        terms = terms + n3
    F = _sim((terms > 0).astype(float), per)  # OR
    return t, A, n1, n2, F, per


@figure("dig2-hazard-timing")
def _(mode):
    """The static-1 glitch in F = A.B + A'.C, and the same circuit cured.

    The waveform is a unit-delay simulation, not a drawing: the glitch appears
    because the falling edge reaches the OR gate one tau before the rising one
    does. Its width is measured from the samples and asserted to be one tau.
    """
    c = S.SERIES[mode]
    check("A.B + A'.C equals A.B + A'.C + B.C", 3,
          lambda A, B, C: (A and B) or ((not A) and C),
          lambda A, B, C: (A and B) or ((not A) and C) or (B and C))

    fig, axes = plt.subplots(2, 1, figsize=(7.6, 5.2), sharex=True)
    widths = []
    for ax, consensus, title in (
        (axes[0], False, "F = A.B + A'.C   -   one tau of nothing"),
        (axes[1], True, "F = A.B + A'.C + B.C   -   the consensus term holds it up"),
    ):
        t, A, n1, n2, F, per = _hazard_waves(consensus)
        low = int(np.sum(F < 0.5))
        widths.append(low / per)
        for i, (y, name, off) in enumerate(((A, "A", 4.5), (n1, "A.B", 3.0),
                                            (n2, "A'.C", 1.5))):
            ax.plot(t, y * 0.9 + off, color=c[i % 3], lw=1.8)
            S.label_end(ax, t[-1], off + 0.45, name, c[i % 3], mode)
        ax.plot(t, F * 0.9, color=S.INK[mode], lw=2.2)
        S.label_end(ax, t[-1], 0.45, "F", S.INK[mode], mode)
        if not consensus:
            ax.axvspan(7.0, 8.0, color=c[1], alpha=0.16, lw=0)
            S.note(ax, 8.15, 0.05, "glitch: 1 tau wide", mode)
        ax.set_yticks([])
        ax.set_title(title, color=S.INK[mode], fontsize=11, pad=6)
        ax.set_xlim(0, 13.6)
        ax.set_ylim(-0.35, 5.9)
        S.strip(ax)
        ax.spines["left"].set_visible(False)
    assert abs(widths[0] - 1.0) < 1e-9, widths
    assert widths[1] == 0.0, widths
    axes[1].set_xlabel("time in gate delays (tau), A falls at t = 5")
    fig.tight_layout()
    return fig


@figure("dig2-hazard-kmap")
def _(mode):
    """Why the glitch is visible on the map before it is visible on a scope.

    The two prime implicants of F = A.B + A'.C are adjacent but do not overlap;
    the transition that crosses between them is the one that glitches. The
    consensus term B.C covers exactly the two cells the crossing passes
    through, and is verified to add no new minterms.
    """
    c = S.SERIES[mode]
    mint = {m for m in range(8)
            if (bits3(m)[0] and bits3(m)[1]) or (not bits3(m)[0] and bits3(m)[2])}
    assert mint == {1, 3, 6, 7}, mint
    consensus_cells = {m for m in range(8) if bits3(m)[1] and bits3(m)[2]}
    assert consensus_cells == {3, 7} and consensus_cells <= mint

    groups = [
        ("A.B   m6,m7", [(1, 2, 1, 2)],
         lambda m: bits3(m)[0] and bits3(m)[1]),
        ("A'.C   m1,m3", [(0, 1, 1, 2)],
         lambda m: not bits3(m)[0] and bits3(m)[2]),
        ("B.C   the consensus, m3 and m7", [(0, 2, 2, 1)],
         lambda m: bits3(m)[1] and bits3(m)[2]),
    ]
    for name, rects, pred in groups:
        drawn = {kmap3(r + dr, cc + dc) for (r, cc, nr, nc) in rects
                 for dr in range(nr) for dc in range(nc)}
        assert drawn == {m for m in range(8) if pred(m)}, name
        assert all(m in mint for m in drawn), name

    fig, ax = plt.subplots(figsize=(6.8, 4.0))
    for r in range(2):
        for col in range(4):
            m = kmap3(r, col)
            ax.add_patch(Rectangle((col, 1 - r), 1, 1, facecolor="none",
                                   edgecolor=S.GRID[mode], lw=1.0))
            hot = m in mint
            ax.text(col + 0.5, 1 - r + 0.60, "1" if hot else "0", ha="center",
                    va="center", fontsize=14, fontweight="bold" if hot else "normal",
                    color=S.INK[mode] if hot else S.GRID[mode])
            ax.text(col + 0.5, 1 - r + 0.24, f"m{m}", ha="center", va="center",
                    fontsize=7.5, color=S.INK_2[mode])
    for i, (name, rects, _p) in enumerate(groups):
        pad = 0.05 + 0.07 * i
        ls = "-" if i < 2 else "--"
        for (r, cc, nr, nc) in rects:
            ax.add_patch(Rectangle((cc + pad, 1 - r - nr + 1 + pad),
                                   nc - 2 * pad, nr - 2 * pad, facecolor="none",
                                   edgecolor=c[i], lw=2.4, ls=ls, zorder=4))
        ax.text(0.0, -0.45 - 0.40 * i, name, ha="left", va="top", fontsize=9.5,
                color=c[i], fontweight="semibold")
    ax.annotate("", xy=(2.5, 1.12), xytext=(2.5, 1.88),
                arrowprops=dict(arrowstyle="<->", color=S.INK[mode], lw=1.6))
    S.note(ax, 2.62, 1.42, "m7 -> m3: A changes, F must stay 1", mode, va="center")
    for r in range(2):
        ax.text(-0.14, 1 - r + 0.5, str(r), ha="right", va="center", fontsize=10,
                color=S.INK_2[mode])
    for col in range(4):
        ax.text(col + 0.5, 2.12, f"{GRAY2[col]:02b}", ha="center", va="bottom",
                fontsize=10, color=S.INK_2[mode])
    ax.text(-0.14, 2.12, "A\\BC", ha="right", va="bottom", fontsize=9.5,
            color=S.INK_2[mode])
    ax.set_xlim(-0.9, 6.9)
    ax.set_ylim(-1.85, 2.6)
    ax.axis("off")
    ax.set_title("A hazard is a boundary between two prime implicants",
                 color=S.INK[mode], fontsize=11.5, pad=12)
    return fig


@figure("dig2-adder-tradeoff")
def _(mode):
    """Carry delay and required AND fan-in against adder width.

    Delay model, stated in the lesson and used here without exception: one tau
    per gate, P and G ready at 1 tau, each ripple stage 2 tau, each lookahead
    level 2 tau, one final XOR. Ripple is 2n; four-bit-block lookahead is
    4*ceil(log4 n); carry-select is minimised over the block size k.
    """
    c = S.SERIES[mode]
    ns = np.array([2, 4, 8, 16, 24, 32, 48, 64])

    def t_ripple(n):
        return 2 * n

    def t_cla(n):
        levels = int(np.ceil(np.log(n) / np.log(4) - 1e-12))
        return 4 * max(levels, 1)

    def t_select(n):
        best = min(1 + 2 * k + (int(np.ceil(n / k)) - 1) + 1
                   for k in range(1, n + 1))
        return best

    tr = [t_ripple(int(n)) for n in ns]
    tc = [t_cla(int(n)) for n in ns]
    ts = [t_select(int(n)) for n in ns]
    assert t_ripple(16) == 32 and t_cla(16) == 8 and t_select(16) == 13
    assert t_ripple(64) == 128 and t_cla(64) == 12
    assert t_cla(4) == 4 and t_ripple(4) == 8
    # frequencies quoted in the lesson, at tau = 0.5 ns
    tau = 0.5e-9
    assert abs(1 / (t_ripple(16) * tau) - 62.5e6) < 1.0
    assert abs(1 / (t_cla(16) * tau) - 250e6) < 1.0
    assert abs(1 / (t_ripple(64) * tau) - 15.625e6) < 1.0

    fanin_flat = [int(n) + 1 for n in ns]
    fanin_block = [5 for _ in ns]

    fig, axes = plt.subplots(2, 1, figsize=(7.4, 5.6), sharex=True)
    ax = axes[0]
    for i, (y, name) in enumerate(((tr, "ripple  2n"), (ts, "carry-select"),
                                   (tc, "lookahead  4 ceil(log4 n)"))):
        ax.plot(ns, y, color=c[i], marker="o", ms=4.6)
        S.label_end(ax, ns[-1], y[-1], name, c[i], mode)
    ax.plot([16], [32], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([16], [8], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 20, 1.5, "16 bits: 32 tau against 8 tau", mode)
    ax.set_ylabel("worst-case delay (tau)")
    ax.set_title("The carry chain is the whole story")
    ax.set_ylim(0, 142)
    S.strip(ax)

    ax = axes[1]
    ax.plot(ns, fanin_flat, color=c[0], marker="o", ms=4.6)
    ax.plot(ns, fanin_block, color=c[2], marker="o", ms=4.6)
    S.label_end(ax, ns[-1], fanin_flat[-1], "flat lookahead", c[0], mode)
    S.label_end(ax, ns[-1], fanin_block[-1], "4-bit blocks", c[2], mode)
    S.note(ax, 3, 46, "a flat 64-bit lookahead wants a 65-input AND;\n"
                      "hierarchy keeps every gate at 5 inputs", mode)
    ax.set_xlabel("adder width n (bits)")
    ax.set_ylabel("widest AND fan-in")
    ax.set_ylim(0, 76)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("dig2-decoder-share")
def _(mode):
    """Gate count against the number of functions that share the same inputs.

    Stated model: a 3-to-8 decoder costs 8 three-input ANDs plus 3 inverters,
    and each function it feeds costs one OR. A standalone two-level network
    costs 3 shared inverters plus, per function, one AND per product term and
    one OR. The crossover is solved from the two lines, not eyeballed.
    """
    c = S.SERIES[mode]
    ks = np.arange(1, 13)
    terms = 3  # product terms per function, the stated model parameter
    dec = [11 + int(k) for k in ks]
    own = [3 + (terms + 1) * int(k) for k in ks]
    # crossover: 11 + k = 3 + 4k  ->  k = 8/3
    kx = 8 / (terms + 1 - 1)
    assert abs(kx - 8 / 3) < 1e-12
    first = next(int(k) for k in ks if 11 + int(k) <= 3 + (terms + 1) * int(k))
    assert first == 3, first
    assert dec[ks.tolist().index(8)] == 19 and own[ks.tolist().index(8)] == 35

    fig, ax = plt.subplots()
    ax.plot(ks, own, color=c[0], marker="o", ms=4.6)
    ax.plot(ks, dec, color=c[2], marker="o", ms=4.6)
    S.label_end(ax, ks[-1], own[-1], "separate networks", c[0], mode)
    S.label_end(ax, ks[-1], dec[-1], "one shared decoder", c[2], mode)
    ax.axvline(3, color=S.GUIDE[mode], ls="--", lw=1.2)
    S.note(ax, 3.2, 46, "from the third function on,\nsharing the decoder is cheaper", mode)
    ax.set_xticks(range(1, 13, 1))
    ax.set_xlabel("functions built on the same three inputs")
    ax.set_ylabel("gates")
    ax.set_title("Why decoders earn their keep only in bulk")
    ax.set_xlim(0.6, 14.6)
    ax.set_ylim(0, 58)
    S.strip(ax)
    return fig


@figure("dig2-mux-residues")
def _(mode):
    """A four-to-one MUX realising three-input odd parity, residue by residue.

    F = Sm(1,2,4,7) is expanded on A and B; each residue is read off the truth
    table and identified as one of the only four possibilities 0, 1, C, C'. The
    completed connection list is then re-evaluated over all eight inputs and
    compared with the minterm list.
    """
    c = S.SERIES[mode]
    mint = {1, 2, 4, 7}

    def parity(A, B, C):
        return (A ^ B ^ C) == 1

    check("Sm(1,2,4,7) is three-input odd parity", 3,
          lambda A, B, C: ((A << 2) | (B << 1) | C) in mint, parity)

    residues = []
    for A in (0, 1):
        for B in (0, 1):
            v0 = ((A << 2) | (B << 1) | 0) in mint
            v1 = ((A << 2) | (B << 1) | 1) in mint
            name = {(0, 0): "0", (1, 1): "1", (0, 1): "C", (1, 0): "C'"}[(int(v0), int(v1))]
            residues.append(((A, B), name))
    assert [r[1] for r in residues] == ["C", "C'", "C'", "C"], residues

    # re-evaluate the wired MUX, an independent route back to the function
    def wired(A, B, C):
        sel = {"0": 0, "1": 1, "C": C, "C'": 1 - C}
        return sel[dict(residues)[(A, B)]] == 1

    check("the wired 4-to-1 MUX equals the original function", 3,
          lambda A, B, C: ((A << 2) | (B << 1) | C) in mint, wired)

    fig, ax = plt.subplots(figsize=(7.4, 4.4))
    ax.add_patch(Rectangle((3.0, 0.4), 1.5, 3.4, facecolor="none",
                           edgecolor=S.INK[mode], lw=1.8))
    ax.text(3.75, 4.0, "4-to-1 MUX", ha="center", va="bottom", fontsize=11,
            color=S.INK[mode], fontweight="semibold")
    for i, ((A, B), name) in enumerate(residues):
        y = 3.45 - 0.9 * i
        ax.annotate("", xy=(3.0, y), xytext=(1.7, y),
                    arrowprops=dict(arrowstyle="->", color=c[0], lw=1.6))
        ax.text(1.6, y, f"I{i} = {name}", ha="right", va="center", fontsize=11,
                color=c[0], fontweight="semibold")
        ax.text(3.12, y, f"A B = {A}{B}", ha="left", va="center", fontsize=8.5,
                color=S.INK_2[mode])
    ax.annotate("", xy=(3.4, 0.4), xytext=(3.4, -0.5),
                arrowprops=dict(arrowstyle="->", color=c[2], lw=1.6))
    ax.annotate("", xy=(4.1, 0.4), xytext=(4.1, -0.5),
                arrowprops=dict(arrowstyle="->", color=c[2], lw=1.6))
    ax.text(3.75, -0.62, "select  A (msb), B", ha="center", va="top", fontsize=10,
            color=c[2], fontweight="semibold")
    ax.annotate("", xy=(6.0, 2.1), xytext=(4.5, 2.1),
                arrowprops=dict(arrowstyle="->", color=S.INK[mode], lw=1.8))
    ax.text(6.1, 2.1, "F = A xor B xor C", ha="left", va="center", fontsize=11,
            color=S.INK[mode], fontweight="semibold")
    S.note(ax, -0.3, -1.25, "Each residue can only be 0, 1, C or C'. Here they read "
                            "C, C', C', C\ndown the data inputs, so the whole circuit "
                            "is one MUX and one inverter.", mode, va="top")
    ax.set_xlim(-0.4, 9.6)
    ax.set_ylim(-2.6, 4.6)
    ax.axis("off")
    ax.set_title("Shannon expansion, wired", color=S.INK[mode], fontsize=11.5, pad=10)
    return fig


# ---------------------------------------------------------------------------
# Prose verification
#
# The figures above prove the claims they draw. This pass proves the rest: every
# minimised expression, truth table, conversion, flag verdict and delay figure
# that the two lessons PRINT. Boolean claims are settled by enumerating all
# 2**n rows; arithmetic claims are settled by a route that does not reuse the
# working the lesson shows.
# ---------------------------------------------------------------------------


def _qm(nvars: int, ones, dc=()):
    """Quine-McCluskey prime implicants as (value, dont_care_mask) pairs."""
    cur = {(t, 0) for t in set(ones) | set(dc)}
    primes: set = set()
    while cur:
        nxt, used = set(), set()
        for a, b in combinations(sorted(cur), 2):
            if a[1] != b[1]:
                continue
            d = a[0] ^ b[0]
            if d and not (d & (d - 1)):
                nxt.add((a[0] & ~d, a[1] | d))
                used.add(a)
                used.add(b)
        primes |= cur - used
        cur = nxt
    return sorted(primes)


def _cells(nvars: int, imp):
    v, m = imp
    free = [i for i in range(nvars) if m >> i & 1]
    out = []
    for combo in product((0, 1), repeat=len(free)):
        x = v
        for i, bit in zip(free, combo):
            x |= bit << i
        out.append(x)
    return sorted(out)


def verify_prose() -> None:
    """Every printed claim in the two chapters, checked here."""

    # ---------------- fee_number_sys: positional notation and conversions
    assert int("F4240", 16) == 1000000
    assert 15 * 65536 + 4 * 4096 + 2 * 256 + 4 * 16 == 1000000
    assert len("F4240") == int(np.floor(np.log(1e6) / np.log(16))) + 1 == 5
    assert int(np.floor(np.log2(1e6))) + 1 == 20 == 5 * 4
    assert abs(6 / 1.20412 - 4.983) < 5e-4 and abs(6 / 0.30103 - 19.93) < 5e-3

    assert f"{3571:X}" == "DF3" and f"{3571:o}" == "6763"
    assert 13 * 256 + 15 * 16 + 3 == 3571
    assert 6 * 512 + 7 * 64 + 6 * 8 + 3 == 3571
    assert f"{3571:012b}" == "110111110011"
    # the division traces printed as tables
    assert [(3571 // 16, 3571 % 16), (223 // 16, 223 % 16), (13 // 16, 13 % 16)] \
        == [(223, 3), (13, 15), (0, 13)]
    assert [(3571 // 8, 3571 % 8), (446 // 8, 446 % 8), (55 // 8, 55 % 8),
            (6 // 8, 6 % 8)] == [(446, 3), (55, 6), (6, 7), (0, 6)]

    assert bin_frac_digits(Fraction(13, 16), 4) == "1101"
    assert 0.5 + 0.25 + 0.0625 == 0.8125
    assert bin_frac_digits(Fraction(5, 8), 3) == "101" and 0.5 + 0.125 == 0.625
    assert bin_frac_digits(Fraction(7, 10), 8) == "10110011"
    assert trunc_bits(Fraction(7, 10), 8) == Fraction(179, 256)
    assert Fraction(7, 10) - Fraction(179, 256) == Fraction(1, 1280)
    assert 896 - 895 == 1 and Fraction(896 - 895, 1280) == Fraction(1, 1280)
    assert abs(float(Fraction(1, 1280)) - 7.8125e-4) < 1e-12
    assert abs(2.0 ** -8 - 3.90625e-3) < 1e-12
    assert order_of_two(5) == 4
    # the printed 0.7 trace, row by row, including the recurrence at row 5
    r, trace = Fraction(7, 10), []
    for _ in range(5):
        r2 = r * 2
        trace.append((r, r2, int(r2 >= 1), r2 - int(r2)))
        r = r2 - int(r2)
    assert [t[2] for t in trace] == [1, 0, 1, 1, 0]
    assert trace[4][3] == trace[1][0], "row 5 must hand back row 2's remainder"

    # the mixed number 1011011110.0110
    assert int("1011011110", 2) == 734 and f"{734:X}" == "2DE" and f"{734:o}" == "1336"
    assert 2 * 256 + 13 * 16 + 14 == 734
    assert 1 * 512 + 3 * 64 + 3 * 8 + 6 == 734
    assert Fraction(6, 16) == Fraction(3, 8) == Fraction(375, 1000)
    assert float(Fraction(3, 8)) == 0.375
    # the padding trap: fraction bits padded on the wrong side
    assert Fraction(0, 8) + Fraction(6, 64) == Fraction(3, 32)
    assert float(Fraction(3, 32)) == 0.09375 and 0.375 / 0.09375 == 4.0

    # ---------------- fee_number_sys: signed representations
    for n in (4, 8, 16):
        pats = list(range(2 ** n))
        tc = [p - 2 ** n if p >> (n - 1) else p for p in pats]
        assert min(tc) == -2 ** (n - 1) and max(tc) == 2 ** (n - 1) - 1
        assert len(set(tc)) == 2 ** n
        for x in pats:  # invert-and-add-one is subtraction from 2**n
            assert ((~x & (2 ** n - 1)) + 1) % 2 ** n == (2 ** n - x) % 2 ** n
    assert (2 ** 8 - 2 ** 7) == 2 ** 7  # negating the most negative is a fixed point
    assert (-(-128)) % 256 == 128 % 256 == (-128) % 256

    # the overflow identity a + b - s = 2**n (c_in - c_out), over every 8-bit pair
    n, rows = 8, 0
    for A in range(256):
        for B in range(256):
            rows += 1
            a = A - 256 if A >> 7 else A
            b = B - 256 if B >> 7 else B
            c_in = ((A & 0x7F) + (B & 0x7F)) >> 7
            c_out = (A + B) >> 8
            S = (A + B) & 0xFF
            s = S - 256 if S >> 7 else S
            assert a + b - s == 2 ** n * (c_in - c_out), (A, B)
            V = c_in ^ c_out
            assert V == int(not (-128 <= a + b <= 127))
            # the sign form of the same flag
            sign_form = (A >> 7 and B >> 7 and not S >> 7) or \
                        (not A >> 7 and not B >> 7 and S >> 7)
            assert V == int(bool(sign_form)), (A, B)
    CHECKED.append(("overflow identity and both flag forms, all 8-bit pairs", rows))

    assert 0x7F + 0x01 == 128 and ((0x7F & 0x7F) + (0x01 & 0x7F)) >> 7 == 1
    assert (0x7F + 0x01) >> 8 == 0 and (0x7F + 0x01) & 0xFF == 0x80
    assert 127 + 1 == 128
    assert -128 + 64 + 32 + 16 + 2 + 1 == -13 == 0xF3 - 256
    assert 0xFFF3 - 65536 == -13 and 65523 - 65536 == -13
    assert 0xF3 & 0xF == 3
    # one's complement end-around carry
    a1c, b1c = 0b0101, 0b1100
    tot = a1c + b1c
    assert tot == 0b10001 and ((tot & 0xF) + (tot >> 4)) == 0b0010 == 2
    assert 5 - 3 == 2

    # ---------------- fee_number_sys: IEEE-754
    assert ieee_encode(-13.625) == 0xC15A0000
    assert 8 + 4 + 1 + 0.5 + 0.125 == 13.625
    assert 13.625 / 2 ** 3 == 1.703125 and 3 + 127 == 130
    assert 0.703125 * 8388608 == 5898240 == 0x5A0000
    assert 1.703125 * 8 == 13.625
    blunder = (1 << 31) | (130 << 23) | int("1101101".ljust(23, "0"), 2)
    assert blunder == 0xC16D0000
    assert struct.unpack(">f", struct.pack(">I", blunder))[0] == -14.8125
    w = 0x41C80000
    bits = f"{w:032b}"
    assert bits[0] == "0" and int(bits[1:9], 2) == 131 and int(bits[9:], 2) == 4718592
    assert 131 - 127 == 4 and 1 + 0.5 + 0.0625 == 1.5625 and 1.5625 * 16 == 25
    assert struct.unpack(">f", struct.pack(">I", w))[0] == 25.0
    assert 1.5625 * 2 ** (131 - 128) == 12.5  # the bias-128 slip
    assert 2 ** 7 - 1 == 127
    assert abs(2.0 ** -126 - 1.1754944e-38) < 1e-45
    assert abs(2.0 ** -149 - 1.4012985e-45) < 1e-52
    assert abs((2 - 2 ** -23) * 2.0 ** 127 - 3.4028235e38) < 1e31
    assert abs(2.0 ** -23 - 1.1920929e-07) < 1e-14
    assert abs(2.0 ** -24 - 5.9604645e-08) < 1e-15
    assert abs(23 * 0.30103 - 6.924) < 5e-4
    assert 2 ** 24 == 16777216
    assert int(np.floor(np.log2(1000))) == 9 and 9 - 23 == -14
    assert abs(2.0 ** -14 - 6.1035156e-05) < 1e-12
    assert abs(2.0 ** -15 - 3.0517578e-05) < 1e-12
    assert ieee_encode(0.1) == 0x3DCCCCCD
    assert -4 + 127 == 123 and 0.6 * 8388608 == 5033164.8
    assert round(0.6 * 8388608) == 5033165 == 0x4CCCCD
    stored = Fraction(8388608 + 5033165, 8388608) * Fraction(1, 16)
    assert stored == Fraction(13421773, 134217728)
    assert abs(float(stored) - 0.10000000149011612) < 1e-24
    assert abs(float(stored - Fraction(1, 10)) - 1.4901161e-9) < 1e-15
    assert abs(float((stored - Fraction(1, 10)) / Fraction(1, 10)) - 1.4901161e-8) < 1e-14
    assert float(stored) > 0.1, "round-to-nearest went up, not down"

    # ---------------- fee_number_sys: problem sets
    assert 158 + 127 == 285 and 285 - 256 == 29 == 0x1D and 0x9E == 158 and 0x7F == 127
    g = 0b1011                                   # Gray 1011 decodes to 13
    b, acc = 0, 0
    for k in range(3, -1, -1):
        acc ^= g >> k & 1
        b |= acc << k
    assert b == 0b1101 == 13
    assert 7 + 8 == 15 and 15 + 6 == 21 and (21 & 0xF) == 5 and 4 + 3 + 1 == 8
    assert 47 + 38 == 85
    assert int("457", 8) == 303 and f"{303:X}" == "12F"
    assert 4 * 64 + 5 * 8 + 7 == 303 and 1 * 256 + 2 * 16 + 15 == 303
    assert int("100101111", 2) == 303
    assert -128 + 64 == -64 and -128 + 32 == -96 and -64 + -96 == -160
    assert (0xC0 + 0xA0) & 0xFF == 0x60 and (0xC0 + 0xA0) >> 8 == 1
    assert ((0xC0 & 0x7F) + (0xA0 & 0x7F)) >> 7 == 0
    assert 0x60 == 96
    assert struct.unpack(">f", struct.pack(">I", 0xBF000000))[0] == -0.5
    assert 126 - 127 == -1 and 1 * 0.5 == 0.5
    assert 0xF38 - 4096 == -200 and 0xFF38 - 65536 == -200 and 65336 - 65536 == -200
    assert ((~0xF38 & 0xFFF) + 1) == 0xC8 == 200
    assert 4 + 2 + 0.5 + 0.25 == 6.75 and 2 + 127 == 129
    assert ieee_encode(6.75) == 0x40D80000
    assert struct.unpack(">f", struct.pack(">I", 0x41580000))[0] == 13.5
    assert 65535 < 2 ** 24
    assert abs(3.69897 / 0.30103 - 12.288) < 5e-4
    assert 2 ** 12 - 1 == 4095 and 2 ** 13 - 1 == 8191 and 5000 > 4095
    assert struct.unpack(">f", struct.pack(">I", 0x80000000))[0] == 0.0
    assert f"{0x80000000:032b}"[1:] == "0" * 31   # negative zero, not a large value
    assert -(2 ** 5) == -32 and 2 ** 5 - 1 == 31
    assert 100 ^ (100 >> 1) == 0b1010110 and f"{100:07b}" == "1100100"

    # ---------------- fee_comb_logic: the identity table
    ident = [
        ("idempotence AND", 1, lambda A: A and A, lambda A: A),
        ("idempotence OR", 1, lambda A: A or A, lambda A: A),
        ("null AND", 1, lambda A: A and 0, lambda A: 0),
        ("null OR", 1, lambda A: A or 1, lambda A: 1),
        ("involution", 1, lambda A: not (not A), lambda A: A),
        ("absorption AND", 2, lambda A, B: A and (A or B), lambda A, B: A),
        ("absorption OR", 2, lambda A, B: A or (A and B), lambda A, B: A),
        ("simplification AND", 2, lambda A, B: A and ((not A) or B), lambda A, B: A and B),
        ("simplification OR", 2, lambda A, B: A or ((not A) and B), lambda A, B: A or B),
        ("distributive over OR", 3, lambda A, B, C: A and (B or C),
         lambda A, B, C: (A and B) or (A and C)),
        ("distributive over AND", 3, lambda A, B, C: A or (B and C),
         lambda A, B, C: (A or B) and (A or C)),
        ("consensus SOP", 3,
         lambda A, B, C: (A and B) or ((not A) and C) or (B and C),
         lambda A, B, C: (A and B) or ((not A) and C)),
        ("consensus POS", 3,
         lambda A, B, C: (A or B) and ((not A) or C) and (B or C),
         lambda A, B, C: (A or B) and ((not A) or C)),
    ]
    for label, nv, lhs, rhs in ident:
        check(label, nv, lhs, rhs)

    # printed truth tables must match, cell by cell
    tbl62 = [(0, 0, 0, 0, 0, 0, 0, 0), (0, 0, 1, 0, 1, 0, 1, 1),
             (0, 1, 0, 0, 0, 0, 0, 0), (0, 1, 1, 0, 1, 1, 1, 1),
             (1, 0, 0, 0, 0, 0, 0, 0), (1, 0, 1, 0, 0, 0, 0, 0),
             (1, 1, 0, 1, 0, 0, 1, 1), (1, 1, 1, 1, 0, 1, 1, 1)]
    for A, B, C, ab, ac, bc, left, right in tbl62:
        assert ab == int(A and B) and ac == int((not A) and C) and bc == int(B and C)
        assert left == int(ab or ac or bc) and right == int(ab or ac)
    CHECKED.append(("printed consensus truth table, cell by cell", len(tbl62)))

    # worked example 6.3
    check("NOT(A'B + AC') equals AC + A'B'", 3,
          lambda A, B, C: not (((not A) and B) or (A and not C)),
          lambda A, B, C: (A and C) or ((not A) and not B))
    F63 = [int(not (((not A) and B) or (A and not C)))
           for A, B, C in product((0, 1), repeat=3)]
    D63 = [int((A and not B) or ((not A) and C))
           for A, B, C in product((0, 1), repeat=3)]
    assert F63 == [1, 1, 0, 0, 0, 1, 0, 1]
    bad_rows = [i for i, (f, d) in enumerate(zip(F63, D63)) if f != d]
    assert bad_rows == [0, 3, 4, 7], bad_rows       # 000, 011, 100, 111
    assert len(bad_rows) == 4

    # worked example 6.4
    ones64 = {1, 3, 6, 7}
    check("Sm(1,3,6,7) equals A'C + AB", 3,
          lambda A, B, C: ((A << 2) | (B << 1) | C) in ones64,
          lambda A, B, C: ((not A) and C) or (A and B))
    check("Sm(1,3,6,7) equals its canonical product of maxterms", 3,
          lambda A, B, C: ((A << 2) | (B << 1) | C) in ones64,
          lambda A, B, C: (A or B or C) and (A or (not B) or C)
          and ((not A) or B or C) and ((not A) or B or (not C)))
    assert 4 + 4 == 8
    assert [2 ** (2 ** k) for k in (2, 3, 4, 5)] == [16, 256, 65536, 4294967296]

    # ---------------- fee_comb_logic: minimisation
    P71 = _qm(4, [0, 1, 2, 5, 6, 7, 8, 9, 10, 14])
    names71 = {tuple(_cells(4, p)) for p in P71}
    assert len(P71) == 6, len(P71)
    for want in ((0, 1, 8, 9), (0, 2, 8, 10), (2, 6, 10, 14), (1, 5), (5, 7), (6, 7)):
        assert want in names71, want
    cov = {m: [p for p in P71 if m in _cells(4, p)]
           for m in [0, 1, 2, 5, 6, 7, 8, 9, 10, 14]}
    ess = {c[0] for c in cov.values() if len(c) == 1}
    assert {tuple(_cells(4, e)) for e in ess} == {(0, 1, 8, 9), (2, 6, 10, 14)}
    assert [m for m in cov if not any(m in _cells(4, e) for e in ess)] == [5, 7]
    check("Sm(0,1,2,5,6,7,8,9,10,14) equals B'C' + CD' + A'BD", 4,
          lambda A, B, C, D: ((A << 3) | (B << 2) | (C << 1) | D)
          in {0, 1, 2, 5, 6, 7, 8, 9, 10, 14},
          lambda A, B, C, D: ((not B) and not C) or (C and not D)
          or ((not A) and B and D))
    check("the four-term alternative cover is the same function", 4,
          lambda A, B, C, D: ((A << 3) | (B << 2) | (C << 1) | D)
          in {0, 1, 2, 5, 6, 7, 8, 9, 10, 14},
          lambda A, B, C, D: ((not B) and not C) or (C and not D)
          or ((not A) and (not C) and D) or ((not A) and B and C))
    assert 2 + 2 + 3 == 7 and 2 + 2 + 3 + 3 == 10

    # five-variable group spanning both sheets
    span = {m for m in range(32) if not (m >> 3 & 1) and (m >> 2 & 1)}
    assert span == set(range(4, 8)) | set(range(20, 24))
    assert len(span) == 2 ** 3 == 8 and 5 - 3 == 2

    # ---------------- fee_comb_logic: hazards
    check("A.C + A'.D equals A.C + A'.D + C.D", 3 + 1,
          lambda A, C, D, _z: (A and C) or ((not A) and D),
          lambda A, C, D, _z: (A and C) or ((not A) and D) or (C and D))
    check("A'C' + AB + BC equals the same plus BC'", 4,
          lambda A, B, C, D: ((not A) and not C) or (A and B) or (B and C),
          lambda A, B, C, D: ((not A) and not C) or (A and B) or (B and C)
          or (B and not C))
    # the static-1 hazard crossing named in the text: m4 and m12 of that function
    f81 = lambda m: (not (m >> 3 & 1) and not (m >> 1 & 1)) \
        or ((m >> 3 & 1) and (m >> 2 & 1)) or ((m >> 2 & 1) and (m >> 1 & 1))
    assert f81(4) and f81(12)
    terms81 = [lambda m: not (m >> 3 & 1) and not (m >> 1 & 1),
               lambda m: (m >> 3 & 1) and (m >> 2 & 1),
               lambda m: (m >> 2 & 1) and (m >> 1 & 1)]
    assert not any(t(4) and t(12) for t in terms81), "a term spans the crossing"
    assert 4 * 2 ** 3 == 32          # adjacent input pairs of a 4-variable function
    check("BC + BC' equals B", 3,
          lambda A, B, C: (B and C) or (B and not C), lambda A, B, C: B)
    # static-0 dual, and the printed table
    check("(A+B)(A'+C) equals (A+B)(A'+C)(B+C)", 3,
          lambda A, B, C: (A or B) and ((not A) or C),
          lambda A, B, C: (A or B) and ((not A) or C) and (B or C))
    tbl83 = [(0, 0, 0, 0, 1, 0, 0, 0), (0, 0, 1, 0, 1, 1, 0, 0),
             (0, 1, 0, 1, 1, 1, 1, 1), (0, 1, 1, 1, 1, 1, 1, 1),
             (1, 0, 0, 1, 0, 0, 0, 0), (1, 0, 1, 1, 1, 1, 1, 1),
             (1, 1, 0, 1, 0, 1, 0, 0), (1, 1, 1, 1, 1, 1, 1, 1)]
    for A, B, C, ab, ac, bc, two, three in tbl83:
        assert ab == int(A or B) and ac == int((not A) or C) and bc == int(B or C)
        assert two == int(bool(ab and ac)) and three == int(bool(ab and ac and bc))
    CHECKED.append(("printed static-0 consensus table, cell by cell", len(tbl83)))
    # which EDGE glitches. The static-1 hazard of 8.1 fires when A falls; the
    # static-0 dual fires when A rises. Both directions simulated, because the
    # prose claims the asymmetry and an inverted claim reads perfectly well.
    per = 100
    tt = np.arange(0, 12 * per) / per
    for rising in (True, False):
        A = (tt >= 5.0).astype(float) if rising else (tt < 5.0).astype(float)
        zero = np.zeros_like(tt)
        n1 = _sim(np.maximum(A, zero), per)          # (A + B) with B = 0
        nA = _sim(1 - A, per)                        # inverter
        n2 = _sim(np.maximum(nA, zero), per)         # (A' + C) with C = 0
        Gw = _sim((n1 * n2 > 0).astype(float), per)  # AND
        high = float(np.sum(Gw > 0.5)) / per
        assert high == (1.0 if rising else 0.0), (rising, high)
        # and with the consensus sum term (B + C) = 0, the AND can never rise
        n3 = _sim(np.maximum(zero, zero), per)
        Gc = _sim((n1 * n2 * n3 > 0).astype(float), per)
        assert float(np.sum(Gc > 0.5)) == 0.0
    _, _, _, _, F1, per1 = _hazard_waves(False)
    assert float(np.sum(F1 < 0.5)) / per1 == 1.0     # static-1 fires on A falling
    CHECKED.append(("static-1 and static-0 glitch edges, both directions simulated", 4))
    # the glitch timing budget
    assert 1 / 200e6 == 5e-9 and abs(5 / 0.15 - 33.3) < 0.05 and 8 + 3 == 11

    # ---------------- fee_comb_logic: MSI blocks and delay
    assert 3 + 1 + 4 == 8
    assert 11 + 1 == 12 > 3 + 4 * 1 == 7          # one function: decoder loses
    assert 11 + 2 == 13 > 3 + 4 * 2 == 11         # two functions: decoder loses
    assert 11 + 3 == 14 <= 3 + 4 * 3 == 15        # three: decoder wins
    assert abs(8 / 3 - 2.667) < 5e-4
    assert 11 + 8 == 19 and 3 + 4 * 8 == 35 and 35 - 19 == 16

    def t_sel(n, k):
        return 1 + 2 * k + (-(-n // k) - 1) + 1

    assert [t_sel(32, k) for k in (2, 4, 5, 8)] == [21, 17, 18, 21]
    assert min(t_sel(32, k) for k in range(1, 33)) == 17
    assert 2 * 32 == 64 and 4 * 3 == 12 and 4 ** 3 >= 32
    assert abs(1 / 300e6 - 3.333e-9) < 1e-12
    assert abs(3.333 - 1.0 - 2.333) < 1e-12 and abs(2.333 / 0.15 - 15.55) < 5e-3
    assert abs(64 * 0.15 - 9.6) < 1e-9 and abs(12 * 0.15 - 1.8) < 1e-9
    assert abs(17 * 0.15 - 2.55) < 1e-9
    assert abs(1 / 3.55 - 0.2817) < 5e-5
    assert 15 - 12 == 3 and abs(64 / 15.55 - 4.1) < 0.05
    assert abs(1.0 / 3.333 - 0.30) < 5e-3 and abs(3.333 / 0.15 - 22.2) < 5e-2

    # ---------------- fee_comb_logic: problem sets
    check("Sm(0,1,2,3,6) equals A' + BC'", 3,
          lambda A, B, C: ((A << 2) | (B << 1) | C) in {0, 1, 2, 3, 6},
          lambda A, B, C: (not A) or (B and not C))
    check("exactly two of three equals its canonical SOP", 3,
          lambda A, B, C: (A + B + C) == 2,
          lambda A, B, C: ((not A) and B and C) or (A and (not B) and C)
          or (A and B and not C))
    check("at least two of three is a different function", 3,
          lambda A, B, C: (A + B + C) >= 2,
          lambda A, B, C: (A and B) or (B and C) or (A and C))
    assert {m for m in range(8) if bin(m).count("1") == 2} == {3, 5, 6}
    assert {m for m in range(8) if bin(m).count("1") >= 2} == {3, 5, 6, 7}
    for x, y in combinations((3, 5, 6), 2):       # no two are adjacent
        assert bin(x ^ y).count("1") == 2
    check("Sm(0,4,8,12) equals C'D'", 4,
          lambda A, B, C, D: ((A << 3) | (B << 2) | (C << 1) | D) in {0, 4, 8, 12},
          lambda A, B, C, D: (not C) and not D)
    P14 = _qm(4, [1, 3, 5, 7, 9, 11])
    assert len(P14) == 2
    assert {tuple(_cells(4, p)) for p in P14} == {(1, 3, 5, 7), (1, 3, 9, 11)}
    check("Sm(1,3,5,7,9,11) equals A'D + B'D", 4,
          lambda A, B, C, D: ((A << 3) | (B << 2) | (C << 1) | D)
          in {1, 3, 5, 7, 9, 11},
          lambda A, B, C, D: ((not A) and D) or ((not B) and D))
    assert 4 + 2 + 1 == 7 and 2 ** 3 == 8         # MUX tree
    assert 2 ** 5 == 32                           # 32-to-1 selects
    check("NOT(A + B') equals A'B", 2,
          lambda A, B: not (A or not B), lambda A, B: (not A) and B)
    d32 = [int((not A) or B) for A, B in product((0, 1), repeat=2)]
    c32 = [int((not A) and B) for A, B in product((0, 1), repeat=2)]
    assert sum(d32) == 3 and sum(c32) == 1
    assert 16 - 11 == 5
    assert 7 * 2 + 3 == 17                        # 8-bit ripple with split paths
    assert 2 * 4 == 8 and 4 * 1 == 4 and 8 - 4 == 4

    # ---------------- both chapters: the odd-parity MUX and its miswiring
    check("even parity is the complement of odd parity on every row", 3,
          lambda A, B, C: (A ^ B ^ C) == 0, lambda A, B, C: not ((A ^ B ^ C) == 1))
    assert 8 // 2 == 4


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
    verify_prose()
    for n in sorted(names):
        assert n.startswith("dig2-"), f"figure {n} is outside this file's namespace"
        render(n, REGISTRY[n])
        print("wrote", n)
    if CHECKED:
        # each figure renders once per theme, so every claim is proved twice;
        # report the distinct claims rather than the doubled tally.
        uniq = dict(CHECKED)
        total = sum(uniq.values())
        print(f"\nexhaustive checks: {len(uniq)} distinct claims over {total} rows")
        for label, rows in sorted(uniq.items(), key=lambda kv: -kv[1]):
            print(f"  {rows:5d} rows   {label}")
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
