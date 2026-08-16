#!/usr/bin/env python3
"""Depth-wave-9 figures for the FE Electrical and Computer course:
the OSI/TCP-IP chapter and the IP addressing chapter of Computer Networks.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look: every curve here is COMPUTED, in this file, from an
equation the lesson that references it writes out. Nothing is traced, scanned,
redrawn or adapted from the NCEES Reference Handbook or any textbook - the
pipeline consumes formulas, which are not protected expression, and never
anyone's drawing of them.

The addressing figures go one step further. Their block boundaries, broadcast
addresses and host counts are produced by integer bitmask arithmetic and then
round-tripped through Python's `ipaddress` module inside the assertion block, so
a figure whose partition disagrees with the standard library cannot be written
to disk at all.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Every figure asserts the numbers the lesson quotes from it, at the last quoted
digit or tighter - 1e-9 wherever the quantity is exact in closed form, and exact
equality wherever it is an integer, which most of the addressing quantities are.

Usage:
    python3 scripts/gen_fe_ee_d9.py             # all
    python3 scripts/gen_fe_ee_d9.py net2-delay  # only names with that prefix
"""
from __future__ import annotations

import ipaddress
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
    def deco(fn):
        assert name.startswith("net2-"), name
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# OSI and TCP/IP: delay, windows, congestion control
# ---------------------------------------------------------------------------


@figure("net2-delay-terms")
def _(mode):
    """One-hop delay against packet size on a 100 Mbps, 200 km link.

    Transmission delay L/R is a straight line through the origin; propagation
    delay d/v does not depend on L at all. They cross where L = R d / v, which
    for these numbers is 100 kbit, or 12,500 bytes - far above any Ethernet
    MTU, which is the whole reason a wide-area path is propagation-bound.
    """
    c = S.SERIES[mode]
    Rb, dist, v = 100e6, 200e3, 2.0e8
    Lbytes = np.linspace(0, 20000, 2000)
    trans = Lbytes * 8 / Rb * 1e3          # ms
    prop = dist / v * 1e3                  # ms
    total = trans + prop
    cross_bytes = Rb * dist / v / 8
    assert abs(prop - 1.0) < 1e-12, prop
    assert abs(cross_bytes - 12500.0) < 1e-9, cross_bytes
    assert abs(1500 * 8 / Rb * 1e3 - 0.12) < 1e-12
    assert abs((1500 * 8 / Rb + dist / v) * 1e3 - 1.12) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(Lbytes, trans, color=c[0], lw=2.2)
    ax.axhline(prop, color=c[1], lw=2.2)
    ax.plot(Lbytes, total, color=c[2], lw=1.8, ls="--")
    S.label_end(ax, 20000, trans[-1], "transmission  L/R", c[0], mode, dy=-4)
    S.label_end(ax, 20000, prop, "propagation  d/v", c[1], mode, dy=-12)
    S.label_end(ax, 17200, total[np.searchsorted(Lbytes, 17200)],
                "sum", c[2], mode, dy=9, ha="center")
    ax.plot([cross_bytes], [prop], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 300, 2.30,
           "the two terms are equal only at 12,500 bytes,\n"
           "eight times the Ethernet MTU", mode)
    S.note(ax, cross_bytes, 1.05, "L = R d / v", mode, ha="center")
    ax.axvline(1500, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1900, 0.06, "1500 B frame: 0.12 ms to send, 1.00 ms to arrive", mode)
    ax.set_xlabel("packet size  L  (bytes)")
    ax.set_ylabel("delay  (ms)")
    ax.set_title("A 200 km link at 100 Mbps is propagation-bound")
    ax.set_xlim(0, 23500)
    ax.set_ylim(0, 2.75)
    S.strip(ax)
    return fig


@figure("net2-queue-knee")
def _(mode):
    """M/M/1 delay, in units of the service time, against utilisation.

    Waiting time is rho/(1 - rho) service times and total system time is
    1/(1 - rho). Both are drawn against rho so the knee is unmistakable: the
    penalty for the last ten percent of a link is larger than the penalty for
    the first eighty.
    """
    c = S.SERIES[mode]
    rho = np.linspace(0, 0.965, 2000)
    wait = rho / (1 - rho)
    system = 1 / (1 - rho)
    assert abs(0.6 / (1 - 0.6) - 1.5) < 1e-12
    assert abs(1 / (1 - 0.6) - 2.5) < 1e-12
    assert abs(0.9 / (1 - 0.9) - 9.0) < 1e-9
    assert abs(0.95 / (1 - 0.95) - 19.0) < 1e-9
    # the lesson's 600 microsecond service time
    assert abs(0.9 / (1 - 0.9) * 600 - 5400.0) < 1e-6
    assert abs(0.6 / (1 - 0.6) * 600 - 900.0) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(rho, wait, color=c[0], lw=2.2)
    ax.plot(rho, system, color=c[1], lw=2.0, ls="--")
    ax.annotate("time in system  1/(1 - rho)", xy=(0.42, 1 / (1 - 0.42)),
                xytext=(0.055, 7.6), color=c[1], fontsize=10,
                fontweight="semibold", ha="left", va="center",
                arrowprops=dict(arrowstyle="-", color=c[1], lw=1.0))
    ax.annotate("queueing wait  rho/(1 - rho)", xy=(0.32, 0.32 / (1 - 0.32)),
                xytext=(0.055, 5.0), color=c[0], fontsize=10,
                fontweight="semibold", ha="left", va="center",
                arrowprops=dict(arrowstyle="-", color=c[0], lw=1.0))
    for r in (0.6, 0.9):
        ax.plot([r], [r / (1 - r)], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 0.055, 13.3, "rho = 0.6  ->  1.5 service times of wait = 0.9 ms", mode)
    S.note(ax, 0.055, 11.6, "rho = 0.9  ->  9 service times of wait = 5.4 ms", mode)
    S.note(ax, 0.055, 9.9, "half again the traffic buys six times the queue", mode)
    ax.set_xlabel("utilisation  rho = lambda L / R")
    ax.set_ylabel("delay  (service times  L/R)")
    ax.set_title("Queueing delay is finite until it is not")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 16)
    S.strip(ax)
    return fig


@figure("net2-segment-pipeline")
def _(mode):
    """Delivery time of a 6 Mbit message over three 100 Mbps store-and-forward
    hops, against the number of packets it is cut into.

    t(P) = (N + P - 1)(L/P + h)/R with N = 3, h = 320 bits of header. Too few
    packets and the pipeline never fills; too many and the header tax dominates.
    The minimum sits at P* = sqrt((N-1)L/h) = 193.6.
    """
    c = S.SERIES[mode]
    L, N, Rb, h = 6e6, 3, 100e6, 320.0
    P = np.arange(1, 2001)
    t = (N + P - 1) * (L / P + h) / Rb * 1e3
    t_free = (N + P - 1) * (L / P) / Rb * 1e3
    Pstar = math.sqrt((N - 1) * L / h)
    tmin = (L + (N - 1) * h + 2 * math.sqrt((N - 1) * L * h)) / Rb * 1e3
    assert abs(Pstar - 193.64916731037084) < 1e-9, Pstar
    assert abs(tmin - 61.245754670786375) < 1e-9, tmin
    assert abs(t[0] - 180.0096) < 1e-9, t[0]
    assert abs(t_free[999] - 60.12) < 1e-9, t_free[999]
    assert abs(N * L / Rb * 1e3 - 180.0) < 1e-9
    assert abs(t[193] - 61.2458) < 1e-4, t[193]
    assert t.min() >= tmin - 1e-6 and t.min() <= tmin + 1e-3

    fig, ax = plt.subplots()
    ax.plot(P, t, color=c[0], lw=2.2)
    ax.plot(P, t_free, color=c[1], lw=1.8, ls="--")
    ax.axhline(L / Rb * 1e3, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax, 2000, t[1999], "with a 40-byte header\non every packet",
                c[0], mode, dx=8, size=9.5)
    S.label_end(ax, 2000, t_free[1999], "headers ignored", c[1], mode,
                dx=8, size=9.5)
    ax.plot([Pstar], [tmin], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 4.0, 56.6, "minimum 61.25 ms at P = 194 packets", mode)
    S.note(ax, 25, 85, "P = 1 sends the whole message\nthree times over: 180 ms", mode)
    S.note(ax, 1.05, 61.4, "floor L/R = 60 ms", mode)
    ax.set_xlabel("packets the message is cut into,  P")
    ax.set_ylabel("delivery time  (ms)")
    ax.set_title("Segmenting overlaps the hops - until the headers win")
    ax.set_xscale("log")
    ax.set_xlim(1, 2600)
    ax.set_ylim(55, 95)
    S.strip(ax)
    return fig


@figure("net2-arq-efficiency")
def _(mode):
    """Sliding-window efficiency against window size for three link shapes.

    eta = min(1, W/(1 + 2a)) with a = propagation time over transmission time.
    A window of one - stop-and-wait - is the leftmost point of every curve, and
    the knee of each curve sits exactly at W = 1 + 2a.
    """
    c = S.SERIES[mode]
    W = np.arange(1, 401)
    fig, ax = plt.subplots()
    for k, (a, name) in enumerate(((0.5, "a = 0.5   short LAN hop"),
                                   (12.5, "a = 12.5   30 ms RTT at 10 Mbps"),
                                   (125.0, "a = 125   satellite hop"))):
        eta = np.minimum(1.0, W / (1 + 2 * a))
        ax.plot(W, eta * 100, color=c[k], lw=2.2)
        knee = 1 + 2 * a
        ax.plot([knee], [100], "o", color=c[k], ms=6, zorder=5)
    assert abs(1 / (1 + 2 * 12.5) * 100 - 3.8461538461538463) < 1e-9
    assert 1 + 2 * 12.5 == 26.0
    assert 1 + 2 * 125.0 == 251.0
    assert abs(np.minimum(1.0, 26 / 26.0) - 1.0) < 1e-12
    S.label_end(ax, 2, 75, "a = 0.5", c[0], mode, dx=7)
    S.label_end(ax, 13, 50, "a = 12.5", c[1], mode, dx=8, dy=-5)
    S.label_end(ax, 125, 125 / 251 * 100, "a = 125", c[2], mode, dx=8, dy=-5)
    ax.plot([1], [1 / 26 * 100], "o", color=S.INK[mode], ms=7, zorder=6)
    S.note(ax, 118, 108, "full rate at W = 1 + 2a:  2, 26 and 251 frames", mode)
    S.note(ax, 34, 3.0, "stop-and-wait on the 30 ms path: W = 1 gives 3.85 %", mode)
    ax.set_xlabel("window  W  (frames outstanding)")
    ax.set_ylabel("link efficiency  (%)")
    ax.set_title("The window that fills a pipe is 1 + 2a frames wide")
    ax.set_xlim(0, 400)
    ax.set_ylim(0, 116)
    S.strip(ax)
    return fig


@figure("net2-slowstart-aimd")
def _(mode):
    """Congestion window over time on a 10 Mbps, 40 ms path (34 MSS of pipe).

    Slow start doubles 10, 20, 40; 40 overruns the 34-segment pipe, so the
    window halves and additive increase takes over, sawtoothing between 17 and
    34. The mean of that sawtooth is 25.5 segments, which is three quarters of
    the pipe - the classic AIMD utilisation.
    """
    c = S.SERIES[mode]
    MSS = 1460
    pipe = int(10e6 * 0.040 / 8 // MSS)
    assert pipe == 34, pipe
    cwnd, rounds, phase = 10, [], []
    ss = True
    for _ in range(72):
        rounds.append(cwnd)
        phase.append(ss)
        if cwnd > pipe:                     # loss this round
            cwnd = max(1, cwnd // 2)
            ss = False
        elif ss:
            cwnd *= 2
        else:
            cwnd += 1
    r = np.arange(len(rounds))
    w = np.array(rounds, dtype=float)
    assert rounds[:5] == [10, 20, 40, 20, 21], rounds[:5]
    saw = [x for x in rounds[3:] if True]
    assert min(saw) == 17 and max(saw) == 35, (min(saw), max(saw))
    assert abs((17 + 34) / 2 - 0.75 * 34) < 1e-12
    thr = 25.5 * MSS * 8 / 0.040
    assert abs(thr - 7446000.0) < 1e-6, thr
    assert abs(thr / 10e6 * 100 - 74.46) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(r, w, color=c[0], lw=2.0)
    ax.axhline(pipe, color=c[1], lw=1.8, ls="--")
    ax.axhline(25.5, color=S.GUIDE[mode], lw=1.2, ls=":")
    S.label_end(ax, r[-1] + 1, pipe, "pipe = 34 MSS", c[1], mode, dx=6)
    S.label_end(ax, r[-1] + 1, 25.5, "mean 25.5 MSS\n= 0.75 x pipe", S.INK_2[mode],
                mode, dx=6)
    S.note(ax, 0.4, 42, "slow start:\ncwnd doubles\nevery RTT", mode)
    S.note(ax, 22, 6.5, "additive increase, multiplicative decrease:\n"
                        "+1 MSS per RTT, halve on loss", mode)
    ax.set_xlabel("round trips since the connection opened")
    ax.set_ylabel("congestion window  (segments of 1460 B)")
    ax.set_title("Slow start is exponential; steady state is a sawtooth")
    ax.set_xlim(-1, len(rounds) + 2)
    ax.set_ylim(0, 52)
    S.strip(ax)
    return fig


@figure("net2-loss-throughput")
def _(mode):
    """The AIMD square-root law: throughput against packet loss probability.

    B = sqrt(3/2) * MSS / (RTT sqrt(p)), plotted for two round-trip times with
    MSS = 1460 bytes. Every decade of loss costs a factor of sqrt(10) = 3.16 in
    rate, which is why a one-in-ten-thousand loss rate caps a 40 ms connection
    at 35.8 Mbps however fast the link underneath it is.
    """
    c = S.SERIES[mode]
    MSS_bits = 1460 * 8
    p = np.logspace(-7, -2, 800)
    k = math.sqrt(1.5)
    assert abs(k - 1.224744871391589) < 1e-12

    def rate(rtt):
        return k * MSS_bits / (rtt * np.sqrt(p)) / 1e6

    b40, b20 = rate(0.040), rate(0.020)
    assert abs(k * MSS_bits / (0.040 * math.sqrt(1e-4)) / 1e6 - 35.7626) < 1e-4
    assert abs(k * MSS_bits / (0.020 * math.sqrt(1e-4)) / 1e6 - 71.5251) < 1e-4
    assert abs(k * MSS_bits / (0.040 * math.sqrt(1e-5)) / 1e6 - 113.0911) < 1e-4
    assert abs(math.sqrt(10) - 3.1622776601683795) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(p, b40, color=c[0], lw=2.2)
    ax.plot(p, b20, color=c[1], lw=2.2)
    S.label_end(ax, 1e-2, k * MSS_bits / (0.040 * math.sqrt(1e-2)) / 1e6,
                "RTT = 40 ms", c[0], mode, dx=7)
    S.label_end(ax, 1e-2, k * MSS_bits / (0.020 * math.sqrt(1e-2)) / 1e6,
                "RTT = 20 ms", c[1], mode, dx=7)
    ax.plot([1e-4], [35.7626], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 1.2e-7, 2.4, "one loss in 10,000 packets caps a 40 ms flow at 35.8 Mbps",
           mode)
    ax.axhline(100, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 1.3e-3, 118, "a 100 Mbps link", mode)
    ax.set_xlabel("packet loss probability  p")
    ax.set_ylabel("achievable throughput  (Mbps)")
    ax.set_title("TCP throughput falls as one over the square root of loss")
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlim(1e-7, 1e-2)
    ax.set_ylim(1, 4000)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
# IP addressing and subnetting
# ---------------------------------------------------------------------------


@figure("net2-prefix-capacity")
def _(mode):
    """Addresses per block against prefix length, total and usable.

    2^(32-n) and 2^(32-n) - 2 on a logarithmic axis. The two curves are
    indistinguishable at the left and diverge violently at the right, which is
    the visual statement of why the minus two matters only for small subnets.
    """
    c = S.SERIES[mode]
    n = np.arange(8, 31)
    total = 2.0 ** (32 - n)
    usable = total - 2
    assert usable[n == 24][0] == 254
    assert usable[n == 26][0] == 62
    assert usable[n == 30][0] == 2
    assert total[n == 8][0] == 16777216
    for pl in (8, 16, 22, 24, 26, 30):
        net = ipaddress.ip_network(f"10.0.0.0/{pl}", strict=False)
        assert net.num_addresses == 2 ** (32 - pl)
        assert len(list(net.hosts())) == 2 ** (32 - pl) - 2

    fig, ax = plt.subplots()
    ax.plot(n, total, color=c[0], lw=2.2, marker="o", ms=4)
    ax.plot(n, usable, color=c[1], lw=2.0, ls="--", marker="s", ms=3.5)
    S.label_end(ax, 12, total[n == 12][0], "total  2^(32-n)", c[0], mode, dy=13)
    S.label_end(ax, 27.5, usable[n == 27][0], "usable  2^(32-n) - 2", c[1], mode,
                dx=-8, dy=-16, ha="right")
    for pl in (24, 26, 30):
        ax.plot([pl], [2 ** (32 - pl) - 2], "o", color=S.INK[mode], ms=6, zorder=5)
    S.note(ax, 8.3, 2.6,
           "marked: /24 gives 254 usable,  /26 gives 62,  /30 gives 2", mode)
    ax.set_xlabel("prefix length  n")
    ax.set_ylabel("addresses in the block")
    ax.set_title("Every extra prefix bit halves the block")
    ax.set_yscale("log")
    ax.set_xlim(7, 31.5)
    ax.set_ylim(1, 6e7)
    S.strip(ax)
    return fig


@figure("net2-alloc-efficiency")
def _(mode):
    """Address efficiency against host requirement under power-of-two allocation.

    For a requirement H the prefix chosen is the smallest whose usable count
    covers it, so the allocated block is 2^ceil(log2(H+2)) addresses and the
    efficiency H/2^m sawtooths from just over 50 % to just under 100 %. The
    worst case sits one host above a power of two.
    """
    c = S.SERIES[mode]
    H = np.arange(2, 1200)
    m = np.ceil(np.log2(H + 2)).astype(int)
    alloc = 2.0 ** m
    eff = H / alloc * 100
    assert alloc[H == 500][0] == 512
    assert abs(eff[H == 500][0] - 97.65625) < 1e-9
    assert alloc[H == 254][0] == 256
    assert abs(eff[H == 254][0] - 99.21875) < 1e-9
    assert alloc[H == 255][0] == 512
    assert abs(eff[H == 255][0] - 49.8046875) < 1e-9
    assert alloc[H == 260][0] == 512
    assert abs(eff[H == 260][0] - 50.78125) < 1e-9

    fig, ax = plt.subplots()
    ax.plot(H, eff, color=c[0], lw=1.9)
    ax.axhline(50, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.plot([500], [97.65625], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([255], [49.8046875], "o", color=S.INK[mode], ms=7, zorder=5)
    S.label_end(ax, 1199, eff[-1], "H / 2^m", c[0], mode, dy=6)
    S.note(ax, 540, 91, "500 hosts into a /23:\n500/512 = 97.7 % used", mode)
    S.note(ax, 275, 41, "255 hosts also needs a /23:\n255/512 = 49.8 %", mode)
    S.note(ax, 640, 36.4, "no allocation is ever worse than one half", mode)
    ax.set_xlabel("hosts required on the segment,  H")
    ax.set_ylabel("addresses used  (% of the block allocated)")
    ax.set_title("Rounding up to a power of two: best 100 %, worst 50 %")
    ax.set_xlim(0, 1320)
    ax.set_ylim(35, 108)
    S.strip(ax)
    return fig


@figure("net2-vlsm-campus")
def _(mode):
    """The 1024 addresses of 172.20.8.0/22 after the lesson's VLSM allocation.

    Boundaries are computed, not drawn: each block is the smallest prefix whose
    usable count covers the requirement, laid down largest first at the next
    free address. Every block start is asserted to be a multiple of its own
    size, and every network, broadcast and host count is round-tripped through
    the `ipaddress` module before the figure is allowed to render.
    """
    c = S.SERIES[mode]
    base = ipaddress.ip_network("172.20.8.0/22")
    demand = [("Eng", 300), ("WiFi", 120), ("Sales", 100), ("Ops", 60),
              ("Lab", 25), ("Voice", 12), ("W1", 2), ("W2", 2), ("W3", 2)]
    cursor, blocks = int(base.network_address), []
    for name, need in demand:
        p = 32
        while 2 ** (32 - p) - 2 < need:
            p -= 1
        size = 2 ** (32 - p)
        assert cursor % size == 0, (name, cursor, size)
        net = ipaddress.ip_network((ipaddress.IPv4Address(cursor), p))
        hosts = list(net.hosts())
        assert len(hosts) == size - 2
        assert int(net.network_address) == cursor
        assert int(net.broadcast_address) == cursor + size - 1
        blocks.append((name, need, p, cursor - int(base.network_address), size))
        cursor += size
    off = int(base.network_address)
    assert [b[2] for b in blocks] == [23, 25, 25, 26, 27, 28, 30, 30, 30]
    assert [b[3] for b in blocks] == [0, 512, 640, 768, 832, 864, 880, 884, 888]
    assert cursor - off == 892
    assert sum(2 ** (32 - b[2]) - 2 for b in blocks) == 874
    assert sum(b[1] for b in blocks) == 623
    assert base.num_addresses - 892 == 132

    fig, ax = plt.subplots()
    callouts, ty = [], 1.25
    for name, need, p, start, size in blocks:
        ax.broken_barh([(start, size)], (0.55, 0.9),
                       facecolor=c[0], alpha=0.30, edgecolor=c[0], lw=1.4)
        ax.broken_barh([(start, need)], (0.62, 0.36), facecolor=c[1], lw=0)
        if size >= 128:
            ax.annotate(f"{name}\n/{p}", xy=(start + size / 2, 1.16),
                        color=S.INK[mode], fontsize=9.5, fontweight="semibold",
                        ha="center", va="center")
        elif name.startswith("W"):
            callouts.append((start + size / 2, f"{name} /{p}"))
        else:
            callouts.append((start + size / 2, f"{name} /{p}  ({size} addr)"))
    for x0, text in callouts:
        ax.annotate(text, xy=(x0, 1.47), xytext=(1120, ty),
                    color=S.INK[mode], fontsize=9, fontweight="semibold",
                    ha="left", va="center", annotation_clip=False,
                    arrowprops=dict(arrowstyle="-", color=S.GUIDE[mode], lw=0.9))
        ty += 0.22
    ax.broken_barh([(892, 132)], (0.55, 0.9), facecolor=S.GUIDE[mode],
                   alpha=0.30, edgecolor=S.GUIDE[mode], lw=1.4)
    ax.annotate("free", xy=(958, 1.16), color=S.INK_2[mode], fontsize=9.5,
                ha="center", va="center")
    S.label_end(ax, 6, 0.40, "block the prefix reserves", c[0], mode, dx=0, size=9)
    S.label_end(ax, 6, 0.24, "hosts actually required", c[1], mode, dx=0, size=9)
    S.note(ax, 6, 0.04,
           "892 of 1024 addresses committed, 874 usable supplied for 623 needed; "
           "132 left free", mode)
    ax.set_xlabel("offset into 172.20.8.0/22  (addresses)")
    ax.set_xticks([0, 512, 640, 768, 892, 1024])
    ax.set_xticklabels(["8.0", "10.0", "10.128", "11.0", "11.124", "12.0"])
    ax.set_xlim(-20, 1560)
    ax.set_ylim(0, 2.55)
    ax.set_yticks([])
    ax.grid(False)
    ax.set_title("Largest-first VLSM across a nine-segment campus")
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("net2-lpm-steps")
def _(mode):
    """Which routing-table entry wins, as the destination address is swept.

    Four overlapping entries are evaluated for every address from 10.44.16.0 to
    10.44.23.255 by the same rule a router uses - among all entries that
    contain the address, the one with the most prefix bits. The result is a
    step function whose steps are exactly the nested blocks.
    """
    c = S.SERIES[mode]
    table = [("10.44.16.0/21", "A", 1), ("10.44.20.0/22", "B", 2),
             ("10.44.20.128/25", "C", 3), ("0.0.0.0/0", "D", 0)]
    nets = [(ipaddress.ip_network(s), tag, y) for s, tag, y in table]
    lo = int(ipaddress.ip_address("10.44.16.0"))
    hi = int(ipaddress.ip_address("10.44.24.255"))
    xs = np.arange(lo, hi + 1)
    ys = np.empty(xs.size)
    for i, a in enumerate(xs):
        addr = ipaddress.IPv4Address(int(a))
        best = max((n for n in nets if addr in n[0]), key=lambda t: t[0].prefixlen)
        ys[i] = best[2]
    spot = {s: int(ipaddress.ip_address(s)) - lo for s in
            ("10.44.17.5", "10.44.21.9", "10.44.20.200", "10.44.20.100",
             "10.44.24.1")}
    assert ys[spot["10.44.17.5"]] == 1
    assert ys[spot["10.44.21.9"]] == 2
    assert ys[spot["10.44.20.200"]] == 3
    assert ys[spot["10.44.20.100"]] == 2
    assert ys[spot["10.44.24.1"]] == 0
    assert ipaddress.ip_network("10.44.16.0/21").num_addresses == 2048
    assert str(ipaddress.ip_network("10.44.16.0/21").broadcast_address) == "10.44.23.255"

    x = (xs - lo)
    fig, ax = plt.subplots()
    ax.step(x, ys, where="post", color=c[0], lw=2.2)
    for name, xv in spot.items():
        ax.plot([xv], [ys[xv]], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.set_yticks([0, 1, 2, 3])
    ax.set_yticklabels(["default 0.0.0.0/0", "10.44.16.0/21", "10.44.20.0/22",
                        "10.44.20.128/25"])
    S.note(ax, 60, 1.10, "10.44.17.5 -> the /21", mode)
    S.note(ax, 1420, 2.10, "10.44.21.9 and 10.44.20.100 -> the /22", mode)
    S.note(ax, 1170, 3.10, "10.44.20.200 -> the /25", mode)
    S.note(ax, 2010, 0.14, "outside every entry:\nthe default route", mode, ha="right")
    ax.set_xticks([0, 512, 1024, 1280, 1536, 2048])
    ax.set_xticklabels(["16.0", "18.0", "20.0", "21.0", "22.0", "24.0"])
    ax.set_xlabel("destination address, third and fourth octets of 10.44.x.x")
    ax.set_ylabel("entry that wins")
    ax.set_title("Longest-prefix match, evaluated address by address")
    ax.set_xlim(-30, 2340)
    ax.set_ylim(-0.4, 3.7)
    S.strip(ax)
    return fig


@figure("net2-nat-capacity")
def _(mode):
    """Hosts one public address can hide, against sessions held per host.

    Capacity is floor(pool / sessions), drawn for the 16,384-port IANA dynamic
    range and for the 64,512 ports above 1023 that an aggressive NAT will use.
    Both are hyperbolas; the point is how quickly a chatty client erodes them.
    """
    c = S.SERIES[mode]
    s = np.arange(1, 61)
    small = np.floor(16384 / s)
    large = np.floor(64512 / s)
    assert 65535 - 49152 + 1 == 16384
    assert 65535 - 1024 + 1 == 64512
    assert small[s == 12][0] == 1365
    assert large[s == 12][0] == 5376
    assert small[s == 6][0] == 2730
    assert large[s == 60][0] == 1075

    fig, ax = plt.subplots()
    ax.plot(s, large, color=c[0], lw=2.2)
    ax.plot(s, small, color=c[1], lw=2.2)
    S.label_end(ax, 45, large[s == 45][0], "ports 1024-65535\n(64,512 available)",
                c[0], mode, dx=7, dy=13)
    S.label_end(ax, 45, small[s == 45][0], "IANA dynamic range only\n(16,384 available)",
                c[1], mode, dx=7, dy=13)
    ax.plot([12], [5376], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([12], [1365], "o", color=S.INK[mode], ms=7, zorder=5)
    S.note(ax, 11.2, 5376, "12 sessions each: 5,376 hosts",
           mode, ha="right", va="center")
    S.note(ax, 11.2, 1365, "same load, dynamic range only: 1,365",
           mode, ha="right", va="center")
    ax.set_xlabel("simultaneous sessions held per inside host")
    ax.set_ylabel("inside hosts one public address supports")
    ax.set_title("PAT capacity is the port pool divided by the session load")
    ax.set_yscale("log")
    ax.set_xlim(0, 62)
    ax.set_ylim(200, 1.2e5)
    S.strip(ax)
    return fig


@figure("net2-ipv6-fields")
def _(mode):
    """How the 128 bits of a global unicast IPv6 address are cut up.

    The boundaries at 32, 48 and 64 bits are the ones RFC 4291 and current
    allocation practice put there, and the counts annotated on each field are
    2 raised to that field's width, computed here rather than quoted.
    """
    c = S.SERIES[mode]
    fields = [("ISP allocation", 0, 32, "a /32 from the registry"),
              ("site bits", 32, 16, "65,536 sites"),
              ("subnet ID", 48, 16, "65,536 subnets"),
              ("interface ID", 64, 64, "1.845 x 10^19 addresses")]
    assert sum(f[2] for f in fields) == 128
    assert 2 ** 16 == 65536
    assert abs(float(2 ** 64) - 1.8446744073709552e19) < 1e5
    assert abs(float(2 ** 128) - 3.402823669209385e38) < 1e25
    n6 = ipaddress.ip_network("2001:db8:acad::/48")
    assert n6.num_addresses == 2 ** 80
    assert len(list(n6.subnets(new_prefix=64))[:3]) == 3
    assert ipaddress.IPv6Address("2001:0db8:0000:0f00:0000:0000:0000:0042") \
        .compressed == "2001:db8:0:f00::42"

    fig, ax = plt.subplots()
    for b in (0, 32, 48, 64, 128):
        ax.vlines(b, 0.50, 1.50, color=S.GUIDE[mode], lw=1.0, ls=":")
    for k, (name, start, width, cap) in enumerate(fields):
        ax.broken_barh([(start, width)], (0.6, 0.8),
                       facecolor=c[k % 3], alpha=0.30 if k else 0.18,
                       edgecolor=c[k % 3], lw=1.6)
        ax.annotate(name.replace(" ", "\n"), xy=(start + width / 2, 1.00),
                    color=S.INK[mode], fontsize=9.5, fontweight="semibold",
                    ha="center", va="center")
        ax.annotate(cap, xy=(start + width / 2, 0.42 if k % 2 else 0.24),
                    color=S.INK_2[mode], fontsize=9, ha="center", va="center")
    S.note(ax, 64, 1.60, "the /64 boundary is fixed by convention: "
                         "stateless autoconfiguration needs all 64 host bits",
           mode, ha="center")
    S.note(ax, -4, 0.02, "2^128 = 3.403 x 10^38 addresses in total, "
                         "2^96 times the whole IPv4 space", mode)
    ax.set_xticks([0, 32, 48, 64, 96, 128])
    ax.set_xlabel("bit position")
    ax.set_xlim(-6, 134)
    ax.set_ylim(0, 1.95)
    ax.set_yticks([])
    ax.grid(False)
    ax.set_title("A global unicast IPv6 address, field by field")
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else "net2-"
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
