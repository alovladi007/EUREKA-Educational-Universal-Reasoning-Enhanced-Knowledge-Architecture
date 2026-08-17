#!/usr/bin/env python3
"""Wave-9 figures for the FE Electrical and Computer course:
Computer Networks and Software Development.

Same contract as gen_fe_ee_w3.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from
the formula the lesson states or by MEASURING the algorithm the lesson
describes. Nothing is traced, scanned or adapted from the NCEES Reference
Handbook, an RFC, or any textbook - the pipeline consumes formulas and
measurements, which are not protected expression, and never anyone's drawing
of them.

Every identity a figure claims is asserted in code before the figure is drawn,
so a wrong number fails the build instead of shipping.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_w9.py            # all
    python3 scripts/gen_fe_ee_w9.py net        # only names starting "net"
"""
from __future__ import annotations

import math
import pathlib
import random
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
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Shared measurement helpers. The lessons quote numbers produced by these
# functions, so they live here rather than inside one figure: the assertions
# below pin the exact values the prose states.
# ---------------------------------------------------------------------------

# Header sizes: IEEE 802.3 Ethernet II (14 B header, 4 B FCS, 8 B preamble/SFD,
# 12 B interframe gap), RFC 791 IPv4 (20 B minimum), RFC 9293 TCP (20 B minimum).
FRAME_OH = 20 + 20 + 14 + 4      # IP + TCP + Ethernet header + FCS = 58 B
WIRE_OH = FRAME_OH + 8 + 12      # + preamble/SFD + interframe gap = 78 B


def insertion_comparisons(arr):
    """Key comparisons performed by textbook insertion sort."""
    a = list(arr)
    cnt = 0
    for i in range(1, len(a)):
        k, j = a[i], i - 1
        while j >= 0:
            cnt += 1
            if a[j] > k:
                a[j + 1] = a[j]
                j -= 1
            else:
                break
        a[j + 1] = k
    return cnt


def merge_comparisons(arr):
    """Key comparisons performed by top-down merge sort."""
    cnt = 0

    def ms(a):
        nonlocal cnt
        if len(a) <= 1:
            return a
        m = len(a) // 2
        left, right = ms(a[:m]), ms(a[m:])
        out, i, j = [], 0, 0
        while i < len(left) and j < len(right):
            cnt += 1
            if left[i] <= right[j]:
                out.append(left[i]); i += 1
            else:
                out.append(right[j]); j += 1
        out += left[i:] + right[j:]
        return out

    ms(arr)
    return cnt


SORT_SIZES = [16, 64, 256, 1024, 4096]


def sort_measurements():
    """Measured comparison counts on one fixed random permutation per size.

    The seed is fixed so the lesson can quote the counts and this file can
    assert them.
    """
    rng = random.Random(20260815)
    rows = []
    for n in SORT_SIZES:
        arr = [rng.random() for _ in range(n)]
        rows.append((n, insertion_comparisons(arr), merge_comparisons(arr)))
    return rows


class _Node:
    __slots__ = ("k", "l", "r")

    def __init__(self, k):
        self.k, self.l, self.r = k, None, None


def bst_mean_comparisons(order):
    """Mean number of key comparisons to find a present key, averaged over all
    keys, for a BST built by inserting `order` left to right."""
    root = None
    for k in order:
        if root is None:
            root = _Node(k)
            continue
        cur = root
        while True:
            if k < cur.k:
                if cur.l is None:
                    cur.l = _Node(k); break
                cur = cur.l
            else:
                if cur.r is None:
                    cur.r = _Node(k); break
                cur = cur.r
    total, stack = 0, [(root, 0)]
    while stack:
        nd, d = stack.pop()
        if nd is None:
            continue
        total += d + 1
        stack.append((nd.l, d + 1))
        stack.append((nd.r, d + 1))
    return total / len(order)


def fib_call_count(n, _memo={}):
    """Calls made by the naive two-branch recursion, counted exactly."""
    if n in _memo:
        return _memo[n]
    v = 1 if n < 2 else 1 + fib_call_count(n - 1) + fib_call_count(n - 2)
    _memo[n] = v
    return v


def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


# ---------------------------------------------------------------------------
# Computer Networks - 3-5 questions
# ---------------------------------------------------------------------------


@figure("net-osi-overhead")
def _(mode):
    """Fraction of the wire that carries application data, against payload size.

    Both curves are payload/(payload + overhead) evaluated point by point.
    The frame curve charges the 58 bytes of TCP+IP+Ethernet header and FCS;
    the wire curve also charges the 8-byte preamble and the 12-byte
    interframe gap, which occupy the medium but never reach the driver.
    """
    c = S.SERIES[mode]
    pl = np.logspace(math.log10(6), math.log10(1460), 700)
    frame = 100 * pl / (pl + FRAME_OH)
    wire = 100 * pl / (pl + WIRE_OH)

    # the two numbers the lesson quotes for a full-MSS segment
    assert abs(100 * 1460 / (1460 + FRAME_OH) - 96.1792) < 1e-3
    assert abs(100 * 1460 / (1460 + WIRE_OH) - 94.9285) < 1e-3
    assert 1460 + FRAME_OH == 1518 and 1460 + WIRE_OH == 1538
    # and the small-packet case
    assert abs(100 * 100 / (100 + WIRE_OH) - 56.1798) < 1e-3

    fig, ax = plt.subplots()
    ax.semilogx(pl, frame, color=c[0], lw=2.2)
    ax.semilogx(pl, wire, color=c[1], lw=2.2)
    S.label_end(ax, 1460, 96.18, "at the frame", c[0], mode, dx=8, dy=7)
    S.label_end(ax, 1460, 94.93, "on the wire", c[1], mode, dx=8, dy=-9)
    for x, y in ((1460, 94.93), (100, 56.18)):
        ax.plot([x], [y], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, 6.6, 74,
           "frame charges 58 B:\n20 IP + 20 TCP + 14 Ethernet + 4 FCS\n"
           "wire adds 8 B preamble + 12 B gap", mode)
    S.note(ax, 116, 36, "100-B payload:\n56.2 % of the wire\nis payload", mode)
    S.note(ax, 1350, 12, "full MSS 1460 B:\n94.9 % of the wire\nis payload",
           mode, ha="right")
    ax.axvline(1460, color=S.GUIDE[mode], lw=0.9, ls=":")
    ax.set_xlabel("application payload per segment  (bytes, log scale)")
    ax.set_ylabel("payload as a share of bytes sent  (%)")
    ax.set_title("The header bill is fixed, so small packets pay it twice over")
    ax.set_xlim(6, 2100)
    ax.set_ylim(0, 104)
    S.strip(ax)
    return fig


@figure("net-subnet-partition")
def _(mode):
    """The 192.168.10.0/24 address space after the lesson's VLSM allocation.

    Block boundaries are not drawn by hand: each department's prefix is the
    smallest one whose usable count 2^(32-p) - 2 covers its host requirement,
    and each block starts at the next free address. The bar therefore shows
    the halving structure directly - every block begins at a multiple of its
    own size, which is the property the exam checks.
    """
    c = S.SERIES[mode]
    need = [("A", 100), ("B", 50), ("C", 25), ("D", 10)]
    cursor, blocks = 0, []
    for dept, hosts in need:
        p = 32
        while 2 ** (32 - p) - 2 < hosts:
            p -= 1
        size = 2 ** (32 - p)
        blocks.append((dept, hosts, p, cursor, size))
        cursor += size

    assert [b[2] for b in blocks] == [25, 26, 27, 28]
    assert [b[3] for b in blocks] == [0, 128, 192, 224]
    assert cursor == 240 and 256 - cursor == 16
    # every block starts at a multiple of its own size
    for _, _, _, start, size in blocks:
        assert start % size == 0
    assert sum(2 ** (32 - b[2]) - 2 for b in blocks) == 232

    fig, ax = plt.subplots()
    for i, (dept, hosts, p, start, size) in enumerate(blocks):
        ax.broken_barh([(start, size)], (0.55, 0.9),
                       facecolor=c[0], alpha=0.30, edgecolor=c[0], lw=1.6)
        ax.broken_barh([(start, hosts)], (0.62, 0.36), facecolor=c[1], lw=0)
        # the two narrow blocks are labelled above the bar, on staggered
        # baselines, because 16 addresses is not 40 points of text
        if size >= 32:
            ax.annotate(f"{dept}  /{p}", xy=(start + size / 2, 1.16),
                        color=S.INK[mode], fontsize=10, fontweight="semibold",
                        ha="center", va="bottom")
        else:
            ax.annotate(f"{dept}  /{p}", xy=(start + size / 2, 1.54),
                        color=S.INK[mode], fontsize=10, fontweight="semibold",
                        ha="center", va="bottom")
    ax.broken_barh([(cursor, 256 - cursor)], (0.55, 0.9),
                   facecolor=S.GUIDE[mode], alpha=0.30,
                   edgecolor=S.GUIDE[mode], lw=1.6)
    ax.annotate("free  /28", xy=(cursor + 8, 1.80), color=S.INK_2[mode],
                fontsize=9.5, ha="center", va="bottom")
    S.label_end(ax, 258, 1.15, "block reserved\nby the prefix", c[0], mode,
                dx=6, size=9.5)
    S.label_end(ax, 258, 0.72, "hosts actually\nneeded", c[1], mode,
                dx=6, size=9.5)
    S.note(ax, 0, 0.16,
           "240 of 256 addresses consumed; 232 usable supplied for 185 needed",
           mode)
    ax.set_xlabel("fourth octet of 192.168.10.0/24")
    ax.set_xticks([0, 128, 192, 224, 256])
    ax.set_xticklabels([".0", ".128", ".192", ".224", ".256"])
    ax.set_xlim(-6, 330)
    ax.set_ylim(0, 2.05)
    ax.set_yticks([])
    ax.grid(False)
    ax.set_title("VLSM largest-first: every block lands on a multiple of its size")
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("net-mesh-link-growth")
def _(mode):
    """Link count against node count for the three topologies the lesson costs.

    Each series is the closed form the lesson states - star N-1, ring N,
    full mesh N(N-1)/2 - evaluated on the integers. On the log axis the mesh
    line is visibly steeper: it is the only one whose slope is 2.
    """
    c = S.SERIES[mode]
    n = np.arange(3, 41)
    star, ring, mesh = n - 1, n, n * (n - 1) // 2

    assert mesh[np.where(n == 8)[0][0]] == 28
    assert mesh[np.where(n == 32)[0][0]] == 496
    assert star[np.where(n == 32)[0][0]] == 31
    # the incremental cost the lesson quotes
    assert (32 * 31 // 2) - (31 * 30 // 2) == 31

    fig, ax = plt.subplots()
    ax.loglog(n, mesh, color=c[0], lw=2.2)
    ax.loglog(n, ring, color=c[1], lw=2.2)
    ax.loglog(n, star, color=c[2], lw=2.2)
    S.label_end(ax, 40, mesh[-1], "full mesh  N(N-1)/2", c[0], mode, dy=4)
    S.label_end(ax, 40, ring[-1], "ring  N", c[1], mode, dy=7)
    S.label_end(ax, 40, star[-1], "star  N-1", c[2], mode, dy=-9)
    for nn in (8, 32):
        m = nn * (nn - 1) // 2
        ax.plot([nn], [m], "o", color=c[0], ms=7, zorder=5)
        ax.plot([nn], [nn - 1], "o", color=c[2], ms=7, zorder=5)
        ax.plot([nn, nn], [nn - 1, m], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 7.4, 30, "N = 8:  28 vs 7  (4x)", mode, ha="right")
    S.note(ax, 29.5, 560, "N = 32:  496 vs 31  (16x)", mode, ha="right")
    ax.set_xlabel("nodes  N")
    ax.set_ylabel("links required")
    ax.set_title("Doubling the nodes doubles a star and quadruples a mesh")
    ax.set_xlim(3, 62)
    ax.set_ylim(2, 1300)
    S.strip(ax)
    return fig


@figure("net-keyspace-time")
def _(mode):
    """Expected exhaustive-search time against symmetric key length.

    Both curves are 2^(k-1)/rate seconds - half the keyspace at a stated
    trial rate - for a fast classical attacker (10^12 keys/s) and for an
    implausibly generous one (10^18 keys/s). Six orders of magnitude of
    attacker improvement move the survivable key length by only 20 bits,
    which is the point the lesson makes about why 128 bits is enough.
    """
    c = S.SERIES[mode]
    k = np.arange(40, 161)
    t_fast = 2.0 ** (k - 1) / 1e12
    t_huge = 2.0 ** (k - 1) / 1e18
    YR = 365.25 * 24 * 3600

    assert abs(2.0 ** 55 / 1e12 - 36028.797) < 1e-2          # DES, ~10.0 h
    assert abs(2.0 ** 55 / 1e12 / 3600 - 10.008) < 1e-3
    assert abs(2.0 ** 127 / 1e12 / YR - 5.391e18) < 1e16     # AES-128

    fig, ax = plt.subplots()
    ax.semilogy(k, t_fast / YR, color=c[0], lw=2.2)
    ax.semilogy(k, t_huge / YR, color=c[1], lw=2.2)
    S.label_end(ax, 160, t_fast[-1] / YR, "10^12 keys/s", c[0], mode, dy=4)
    S.label_end(ax, 160, t_huge[-1] / YR, "10^18 keys/s", c[1], mode, dy=-8)
    for y, lab in ((1 / (365.25 * 24), "one hour"), (1.0, "one year"),
                   (1.38e10, "age of the universe")):
        ax.axhline(y, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.note(ax, 177, y * 2.2, lab, mode, ha="right")
    ax.plot([56], [2.0 ** 55 / 1e12 / YR], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 60, 1.5e-10, "DES, 56 bits: 10.0 hours", mode)
    ax.plot([128], [2.0 ** 127 / 1e12 / YR], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 126, 3e19, "AES-128:\n5.4 x 10^18 years", mode, ha="right")
    ax.set_xlabel("symmetric key length  (bits)")
    ax.set_ylabel("expected time to find the key  (years, log scale)")
    ax.set_title("Each added key bit doubles the attacker's bill, forever")
    ax.set_xlim(40, 178)
    ax.set_ylim(1e-13, 1e30)
    S.strip(ax)
    return fig


@figure("net-delay-crossover")
def _(mode):
    """Transmission and propagation delay against link rate, 1500-byte packets
    over 200 km of fiber.

    d_trans = 12000 bits / R falls with the link rate; d_prop = 200 km /
    (2 x 10^8 m/s) does not move at all. They cross where R = 12000/0.001 =
    12 Mbps, which the assertion below computes rather than assumes: below
    that rate the packet's own length dominates, above it the distance does.
    """
    c = S.SERIES[mode]
    R = np.logspace(6, 10, 700)
    L = 1500 * 8
    d_trans = L / R * 1e3                    # ms
    d_prop = 200e3 / 2e8 * 1e3               # ms, constant 1.0
    d_total = d_trans + d_prop

    assert abs(d_prop - 1.0) < 1e-12
    R_cross = L / (d_prop * 1e-3)
    assert abs(R_cross - 12e6) < 1.0
    assert abs(L / 100e6 * 1e3 - 0.12) < 1e-12

    fig, ax = plt.subplots()
    ax.loglog(R / 1e6, d_total, color=c[0], lw=2.4)
    ax.loglog(R / 1e6, d_trans, color=c[1], lw=2.0)
    ax.loglog(R / 1e6, np.full_like(R, d_prop), color=c[2], lw=2.0)
    S.label_end(ax, 10e3, d_total[-1], "total", c[0], mode, dy=22)
    S.label_end(ax, 10e3, d_trans[-1], "transmission  L/R", c[1], mode, dy=-4)
    S.label_end(ax, 10e3, d_prop, "propagation  d/v", c[2], mode, dy=-16)
    ax.plot([12], [1.0], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 15, 2.6, "crossover at 12 Mbps:\nL/R = d/v = 1.00 ms", mode)
    ax.axvline(100, color=S.GUIDE[mode], lw=0.9, ls=":")
    S.note(ax, 118, 0.0016,
           "at 100 Mbps the packet\ncosts 0.12 ms, the\ndistance 1.00 ms", mode)
    ax.set_xlabel("link rate  (Mbps, log scale)")
    ax.set_ylabel("delay  (ms, log scale)")
    ax.set_title("Faster links shrink one delay term and leave the other alone")
    ax.set_xlim(1, 3.4e4)
    ax.set_ylim(8e-4, 30)
    S.strip(ax)
    return fig


@figure("net-window-throughput")
def _(mode):
    """Achievable TCP throughput against send-window size on a 1 Gbps path.

    Each curve is min(R, 8W/RTT) - the window empties once per round trip,
    so throughput rises linearly with the window until the link rate caps it.
    The knee sits exactly at the bandwidth-delay product, which the assertion
    computes from R and RTT rather than reading off the plot.
    """
    c = S.SERIES[mode]
    W = np.logspace(3, 7.4, 700)             # bytes
    R = 1e9

    def tput(rtt):
        return np.minimum(R, 8 * W / rtt) / 1e6

    bdp20 = R * 0.020 / 8
    bdp100 = R * 0.100 / 8
    assert abs(bdp20 - 2.5e6) < 1e-6         # 2.5 MB
    assert abs(bdp100 - 12.5e6) < 1e-6       # 12.5 MB
    assert abs(8 * 65536 / 0.050 / 1e6 - 10.48576) < 1e-9

    fig, ax = plt.subplots()
    ax.loglog(W, tput(0.020), color=c[0], lw=2.2)
    ax.loglog(W, tput(0.100), color=c[1], lw=2.2)
    S.label_end(ax, 2.5e7, 1000, "RTT = 20 ms", c[0], mode, dy=7)
    S.label_end(ax, 2.5e7, 1000, "RTT = 100 ms", c[1], mode, dy=-8)
    ax.axhline(1000, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 1.05e3, 1080, "1 Gbps link rate", mode)
    for bdp, col in ((bdp20, c[0]), (bdp100, c[1])):
        ax.plot([bdp], [1000], "o", color=col, ms=7, zorder=5)
    for rtt in (0.020, 0.100):
        ax.plot([65536], [8 * 65536 / rtt / 1e6], "o", color=S.INK[mode], ms=6,
                zorder=6)
    S.note(ax, 1.05e3, 2700,
           "each knee sits at the BDP: 2.5 MB at 20 ms, 12.5 MB at 100 ms",
           mode)
    # 65,536 bytes is 64 KiB, not 64 kB. The window field counts bytes in
    # powers of two while the link rate on the other axis is decimal, so the
    # two units have to be named apart; the annotation said "64 KB" for a
    # quantity the assertion above computes from 2^16.
    S.note(ax, 1.05e3, 1700,
           "marked points: a 64 KiB window caps this path at 26.2 and 5.2 Mbps",
           mode)
    ax.set_xlabel("send window  (bytes, log scale)")
    ax.set_ylabel("throughput  (Mbps, log scale)")
    ax.set_title("A window smaller than the pipe leaves the link idle")
    ax.set_xlim(1e3, 1.1e8)
    ax.set_ylim(1, 4000)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# Software Development - 3-5 questions
# ---------------------------------------------------------------------------


@figure("swe-bigo-crossover")
def _(mode):
    """Three cost models on one linear axis, with the crossover solved for.

    The lesson's point is that constants decide which algorithm wins on
    small inputs and the exponent decides on large ones. The curves are
    50n, 10 n log2 n and n^2; the marked crossover of 50n and n^2 is the
    root of n^2 = 50n, computed here as n = 50 and asserted.
    """
    c = S.SERIES[mode]
    n = np.linspace(1, 120, 900)
    lin, nlog, quad = 50 * n, 10 * n * np.log2(n), n ** 2

    assert 50 * 50 == 50 ** 2                       # crossover at n = 50
    assert 50 * 40 > 40 ** 2 and 50 * 60 < 60 ** 2  # and it is a real sign change

    fig, ax = plt.subplots()
    ax.plot(n, quad, color=c[0], lw=2.2)
    ax.plot(n, lin, color=c[1], lw=2.2)
    ax.plot(n, nlog, color=c[2], lw=2.2)
    S.label_end(ax, 120, quad[-1], "n^2", c[0], mode, dy=2)
    S.label_end(ax, 120, lin[-1], "50n", c[1], mode, dy=2)
    S.label_end(ax, 120, nlog[-1], "10 n log2 n", c[2], mode, dy=2)
    ax.plot([50], [2500], "o", color=S.INK[mode], ms=7, zorder=6)
    ax.plot([50, 50], [0, 2500], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 4, 9600, "50n = n^2 at n = 50:\nbelow it the constant wins,\n"
                        "above it the exponent does", mode)
    ax.set_xlabel("input size  n")
    ax.set_ylabel("operations")
    ax.set_title("Asymptotics decide the race only after the crossover")
    ax.set_xlim(0, 141)
    ax.set_ylim(0, 14500)
    S.strip(ax)
    return fig


@figure("swe-sort-opcounts")
def _(mode):
    """Measured key comparisons for insertion sort and merge sort.

    Nothing here is an estimate: both sorts are run in this file on the same
    seeded random permutation at each size and the comparisons are counted.
    The dashed lines are the textbook predictions n^2/4 and n log2 n - n + 1,
    drawn to show that the measurement lands on them.
    """
    c = S.SERIES[mode]
    rows = sort_measurements()
    n = np.array([r[0] for r in rows], dtype=float)
    ins = np.array([r[1] for r in rows], dtype=float)
    mer = np.array([r[2] for r in rows], dtype=float)

    # exact measured counts the lesson quotes
    assert [r[1] for r in rows] == [64, 1022, 16706, 259353, 4161097]
    assert [r[2] for r in rows] == [47, 306, 1735, 8941, 43937]
    # and they track the predictions
    assert abs(ins[-1] / (n[-1] ** 2 / 4) - 1) < 0.02
    assert abs(mer[-1] / (n[-1] * np.log2(n[-1]) - n[-1] + 1) - 1) < 0.03

    nn = np.logspace(math.log10(16), math.log10(4096), 400)
    fig, ax = plt.subplots()
    ax.loglog(nn, nn ** 2 / 4, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.loglog(nn, nn * np.log2(nn) - nn + 1, color=S.GUIDE[mode], lw=1.3, ls="--")
    ax.loglog(n, ins, color=c[0], lw=2.2, marker="o", ms=7)
    ax.loglog(n, mer, color=c[1], lw=2.2, marker="o", ms=7)
    S.label_end(ax, 4096, ins[-1], "insertion sort\n(measured)", c[0], mode, dy=6)
    S.label_end(ax, 4096, mer[-1], "merge sort\n(measured)", c[1], mode, dy=-4)
    S.note(ax, 17, 1.4e6,
           "at n = 4096 insertion sort does 4,161,097 comparisons\n"
           "and merge sort 43,937 - a factor of 94.7", mode)
    S.note(ax, 8500, 42,
           "dashed: the closed forms n^2/4 and n log2 n - n + 1,\n"
           "which the measured counts sit on top of", mode, ha="right")
    ax.set_xlabel("array length  n  (log scale)")
    ax.set_ylabel("key comparisons  (log scale)")
    ax.set_title("Counted, not estimated: the gap is a slope, not a constant")
    ax.set_xlim(14, 9000)
    ax.set_ylim(30, 2e7)
    S.strip(ax)
    return fig


@figure("swe-hash-load-factor")
def _(mode):
    """Expected probes per lookup against load factor, three collision regimes.

    Curves are the standard uniform-hashing results: 1 + a/2 for a successful
    search with chaining, and (1 + 1/(1-a))/2 and (1 + 1/(1-a)^2)/2 for
    successful and unsuccessful search with linear probing. The dots are a
    seeded simulation run in this file - 4001 slots, keys placed by linear
    probing - so the reader can see the theory being met, not asserted.
    """
    c = S.SERIES[mode]
    a = np.linspace(0.02, 0.95, 600)
    chain = 1 + a / 2
    lin_s = 0.5 * (1 + 1 / (1 - a))
    lin_u = 0.5 * (1 + 1 / (1 - a) ** 2)

    assert abs((1 + 0.9 / 2) - 1.45) < 1e-12
    assert abs(0.5 * (1 + 1 / (1 - 0.9)) - 5.5) < 1e-12
    assert abs(0.5 * (1 + 1 / (1 - 0.9) ** 2) - 50.5) < 1e-9
    assert abs((1 + 0.7 / 2) - 1.35) < 1e-12

    def sim(m, n_keys, seed):
        r = random.Random(seed)
        tab = [None] * m
        probes = []
        for i in range(n_keys):
            h, p = r.randrange(m), 0
            while tab[(h + p) % m] is not None:
                p += 1
            tab[(h + p) % m] = i
            probes.append(p + 1)
        return sum(probes) / len(probes)

    pts = [(al, sim(4001, int(al * 4001), 99)) for al in (0.25, 0.5, 0.75, 0.9)]
    assert abs(pts[0][1] - 1.167) < 0.02

    fig, ax = plt.subplots()
    ax.plot(a, lin_u, color=c[0], lw=2.2)
    ax.plot(a, lin_s, color=c[1], lw=2.2)
    ax.plot(a, chain, color=c[2], lw=2.2)
    ax.plot([p[0] for p in pts], [p[1] for p in pts], "o", color=c[1], ms=7,
            zorder=5)
    # place the unsuccessful-probe label where its own curve crosses 15 probes,
    # solved from the formula rather than eyeballed
    a_at15 = 1 - math.sqrt(1 / (2 * 15 - 1))
    assert abs(0.5 * (1 + 1 / (1 - a_at15) ** 2) - 15) < 1e-9
    S.label_end(ax, a_at15, 15, "linear probing,\nunsuccessful", c[0], mode,
                ha="right", dx=-8)
    S.label_end(ax, 0.95, 5.5, "linear probing,\nsuccessful", c[1], mode, dy=6)
    S.label_end(ax, 0.95, 1.475, "separate chaining,\nsuccessful", c[2], mode,
                dy=-4)
    ax.axvline(0.7, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.685, 9.0, "usual rehash threshold, a = 0.7", mode, ha="right")
    S.note(ax, 0.045, 12.6,
           "dots: 4001-slot simulation, mean probes to place a key", mode)
    ax.set_xlabel("load factor  a = entries / slots")
    ax.set_ylabel("expected probes per lookup")
    ax.set_title("Chaining degrades gently; open addressing falls off a cliff")
    ax.set_xlim(0, 1.06)
    ax.set_ylim(0, 18)
    S.strip(ax)
    return fig


@figure("swe-bst-degenerate")
def _(mode):
    """Mean search cost in a BST, built from sorted input and from shuffled
    input, against the number of keys.

    Both series are measured: this file builds each tree key by key and
    averages the comparison depth over every key present. The sorted-input
    tree lands exactly on (n+1)/2 - it is a linked list - and the assertion
    checks that identity at every size before drawing.
    """
    c = S.SERIES[mode]
    sizes = [15, 31, 63, 127, 255, 511, 1023]
    rng = random.Random(7)
    sorted_cost, random_cost = [], []
    for n in sizes:
        keys = list(range(n))
        sorted_cost.append(bst_mean_comparisons(keys))
        shuffled = keys[:]
        rng.shuffle(shuffled)
        random_cost.append(bst_mean_comparisons(shuffled))

    for n, sc in zip(sizes, sorted_cost):
        assert abs(sc - (n + 1) / 2) < 1e-9, (n, sc)
    assert abs(sorted_cost[-1] - 512.0) < 1e-9
    # the three numbers the caption and the lesson quote for n = 1023
    assert abs(random_cost[-1] - 12.436) < 0.005, random_cost[-1]
    assert abs(sorted_cost[-1] / random_cost[-1] - 41.2) < 0.05
    assert abs(math.log2(1024) - 10.0) < 1e-12

    ideal = [math.log2(n + 1) for n in sizes]
    fig, ax = plt.subplots()
    ax.loglog(sizes, sorted_cost, color=c[0], lw=2.2, marker="o", ms=7)
    ax.loglog(sizes, random_cost, color=c[1], lw=2.2, marker="o", ms=7)
    ax.loglog(sizes, ideal, color=c[2], lw=2.0, ls="--")
    S.label_end(ax, 1023, sorted_cost[-1], "sorted insertion\n(n+1)/2", c[0],
                mode, dy=4)
    S.label_end(ax, 1023, random_cost[-1], "random insertion", c[1], mode, dy=6)
    S.label_end(ax, 1023, ideal[-1], "perfectly balanced\nlog2(n+1)", c[2],
                mode, dy=-10)
    S.note(ax, 15, 320,
           "n = 1023: 512.0 comparisons after sorted insertion,\n"
           "12.4 after shuffled insertion, 10.0 if perfectly balanced",
           mode)
    ax.set_xlabel("keys in the tree  n  (log scale)")
    ax.set_ylabel("mean comparisons to find a key  (log scale)")
    ax.set_title("The same keys, a different arrival order, 41x the work")
    ax.set_xlim(13, 2600)
    ax.set_ylim(2, 1500)
    S.strip(ax)
    return fig


@figure("swe-recursion-callcount")
def _(mode):
    """Calls made by the naive Fibonacci recursion, counted exactly, against
    the 2^n bound and against memoisation.

    The middle series is the exact identity calls(n) = 2 F(n+1) - 1, which
    this file verifies against a direct count for every n plotted. The
    separation from 2^n is the lesson's correction: the recursion grows like
    the golden ratio to the n, not like 2 to the n, and by n = 30 the two
    differ by a factor of nearly 400.
    """
    c = S.SERIES[mode]
    ns = np.arange(2, 31)
    calls = np.array([fib_call_count(int(n)) for n in ns], dtype=float)
    ident = np.array([2 * fib(int(n) + 1) - 1 for n in ns], dtype=float)
    bound = 2.0 ** ns
    memo = ns + 1

    assert np.array_equal(calls, ident)
    assert fib_call_count(30) == 2692537
    assert fib_call_count(50) == 40730022147
    assert abs(2 ** 30 / fib_call_count(30) - 398.78) < 0.02
    phi = (1 + 5 ** 0.5) / 2
    assert abs(fib_call_count(30) / fib_call_count(29) - phi) < 1e-5

    fig, ax = plt.subplots()
    ax.semilogy(ns, bound, color=c[0], lw=2.0, ls="--")
    ax.semilogy(ns, calls, color=c[1], lw=2.4)
    ax.semilogy(ns, memo, color=c[2], lw=2.2)
    S.label_end(ax, 30, bound[-1], "loose bound 2^n", c[0], mode, dy=4)
    S.label_end(ax, 30, calls[-1], "actual calls\n2 F(n+1) - 1", c[1], mode, dy=-8)
    S.label_end(ax, 30, memo[-1], "memoised  n+1", c[2], mode, dy=2)
    ax.plot([30], [fib_call_count(30)], "o", color=c[1], ms=7, zorder=5)
    S.note(ax, 3, 2.2e8,
           "at n = 30: 2,692,537 calls, not 2^30 = 1,073,741,824\n"
           "the growth base is the golden ratio 1.618, not 2", mode)
    ax.set_xlabel("Fibonacci index  n")
    ax.set_ylabel("function calls  (log scale)")
    ax.set_title("Exponential, yes - but which exponential matters")
    ax.set_xlim(2, 39)
    ax.set_ylim(1, 3e10)
    S.strip(ax)
    return fig


@figure("swe-coverage-paths")
def _(mode):
    """Test cases demanded by three coverage criteria, against the number of
    independent binary decisions in a routine.

    Branch coverage needs 2 tests however long the routine gets; the basis
    set needs V(G) = d + 1; enumerating every combination of outcomes needs
    2^d. The assertion pins the two values the lesson quotes, V(G) = 20 and
    2^20 = 1,048,576, at twenty decisions.
    """
    c = S.SERIES[mode]
    d = np.arange(0, 21)
    branch = np.full_like(d, 2)
    basis = d + 1
    paths = 2.0 ** d

    assert int(paths[20]) == 1048576
    assert int(basis[19]) == 20
    assert int(paths[10]) == 1024

    fig, ax = plt.subplots()
    ax.semilogy(d, paths, color=c[0], lw=2.2)
    ax.semilogy(d, basis, color=c[1], lw=2.2)
    ax.semilogy(d, branch, color=c[2], lw=2.2)
    ax.axhline(1, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.2, 0.52, "statement coverage: one test reaches every line", mode)
    S.label_end(ax, 20, paths[-1], "every path  2^d", c[0], mode, dy=4)
    S.label_end(ax, 20, basis[-1], "basis set  V(G) = d + 1", c[1], mode, dy=4)
    S.label_end(ax, 20, 2, "branch coverage  2", c[2], mode, dy=-4)
    ax.plot([20], [paths[-1]], "o", color=c[0], ms=7, zorder=5)
    S.note(ax, 5.4, 1.9e4,
           "20 decisions: 21 basis paths,\nbut 1,048,576 path combinations", mode)
    ax.set_xlabel("independent binary decisions in the routine  d")
    ax.set_ylabel("test cases required  (log scale)")
    ax.set_title("Path coverage is the one that explodes")
    ax.set_xlim(0, 28)
    ax.set_ylim(0.35, 1e7)
    S.strip(ax)
    return fig


@figure("swe-btree-vs-scan")
def _(mode):
    """Work done to find one row, by full scan and by B-tree index lookup.

    The scan curve is N/81 pages, from an 8 KB page holding 81 rows of 100
    bytes; the index curve is the B-tree height ceil(log_f N) for fanout 100,
    plus one page to fetch the row itself. Both are step functions of N
    computed here, which is why the index curve is a staircase rather than a
    smooth logarithm.
    """
    c = S.SERIES[mode]
    N = np.unique(np.round(np.logspace(2, 9, 400)).astype(np.int64))
    rows_per_page = 8192 // 100
    scan = np.ceil(N / rows_per_page)
    height = np.array([math.ceil(math.log(int(n), 100)) if n > 1 else 1
                       for n in N], dtype=float)
    index = height + 1

    assert rows_per_page == 81
    assert math.ceil(math.log(10 ** 6, 100)) == 3
    assert math.ceil(math.log(10 ** 8, 100)) == 4
    assert int(np.ceil(10 ** 6 / 81)) == 12346

    fig, ax = plt.subplots()
    ax.loglog(N, scan, color=c[0], lw=2.2)
    ax.loglog(N, index, color=c[1], lw=2.2)
    S.label_end(ax, 1e9, scan[-1], "full table scan\nN/81 pages", c[0], mode, dy=4)
    S.label_end(ax, 1e9, index[-1], "B-tree lookup\nheight + 1", c[1], mode, dy=4)
    ax.plot([1e6], [12346], "o", color=c[0], ms=7, zorder=5)
    ax.plot([1e6], [4], "o", color=c[1], ms=7, zorder=5)
    ax.plot([1e6, 1e6], [4, 12346], color=S.GRID[mode], lw=0.9, ls=":")
    S.note(ax, 1.4e6, 260, "10^6 rows:\n12,346 pages scanned\nvs 4 pages read",
           mode)
    ax.set_xlabel("rows in the table  N  (log scale)")
    ax.set_ylabel("pages touched to find one row  (log scale)")
    ax.set_title("The index turns a proportional cost into a flat one")
    ax.set_xlim(1e2, 1e10)
    ax.set_ylim(0.8, 5e7)
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
