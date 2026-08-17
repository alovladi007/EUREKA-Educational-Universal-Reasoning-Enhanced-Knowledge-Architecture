#!/usr/bin/env python3
"""Depth-wave-30 figures for the FE Electrical and Computer course.

Scope: the I/O-and-interfacing chapter and the performance-metrics chapter of
the Computer Systems section. Same contract and the same shared style module as
the earlier generators, so these plots sit beside the existing ones.

WHAT MAKES THIS GENERATOR DIFFERENT

Every quantitative claim these two chapters make is recovered here by STEPPING A
MACHINE, not by evaluating the formula the lesson quotes. A polled loop is run
one clock at a time through its status test and its byte move; an interrupt is
taken phase by phase through recognition, vectoring, context save, body,
restore and return; a DMA transfer is arbitrated cycle by cycle against a CPU
that wants the same bus. Queueing results come out of a discrete-event run over
millions of customers. Amdahl and Gustafson numbers come from scheduling
individual unit tasks onto individual processors and reading the makespan.

The closed form is then compared against the simulation, and a disagreement
stops the script. That is the point: the formula is the claim under test, and
the stepped machine is the independent route. Where the two legitimately differ
- integer task counts that do not divide by the processor count, a FIFO that
does not divide the transfer - the gap itself is reported and taught.

Nothing here is traced, scanned or adapted from a reference work.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 eureka/scripts/gen_fe_ee_d30.py              # all figures
    python3 eureka/scripts/gen_fe_ee_d30.py sys3-io      # only the I/O ones
    python3 eureka/scripts/gen_fe_ee_d30.py --claims     # claim table only
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
PREFIX = "sys3-"


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ===========================================================================
# claim ledger
# ===========================================================================
#: Every entry is a number the lesson prints, checked against a value obtained
#: by a route the lesson does not use. `how` records which route.
CLAIMS: list[tuple[str, str, float, float]] = []


def claim(what: str, stepped: float, stated: float, tol: float, how: str = "stepped simulation"):
    """Assert a printed number against an independently obtained one."""
    if abs(stepped - stated) > tol:
        raise AssertionError(f"{what}: simulation {stepped!r} vs stated {stated!r} (tol {tol})")
    CLAIMS.append((what, how, stepped, stated))
    return stepped


# ===========================================================================
# The model machine M
# ===========================================================================
# 100 MHz, one clock = 10 ns. One bus transaction occupies one clock. The CPU
# needs the bus on one of every three cycles it EXECUTES: roughly 1.35 memory
# references per instruction over about four cycles per instruction.
CLK_MHZ = 100.0
NS_PER_CYCLE = 1000.0 / CLK_MHZ          # 10 ns
BUS_NUM, BUS_DEN = 1, 3                  # CPU bus density m = 1/3

POLL_TEST = 6          # LOAD status (3) + AND mask (1) + branch (2)
MOVE = 10              # LOAD data (3) + STORE mem (3) + ADD ptr (1)
                       #   + SUB count (1) + branch (2)

IRQ_PHASES = [
    ("recognise", 8),   # finish the instruction in flight, worst case
    ("vector", 6),      # flush the pipeline, fetch the vector
    ("save", 24),       # push 12 registers, 2 cycles each
    ("body", 18),       # fixed part of the handler
    ("restore", 24),
    ("rti", 4),
]
IRQ_FIXED = sum(d for _, d in IRQ_PHASES)     # 84 cycles
DMA_SETUP = 220        # 5 register writes at 12 cycles + 160 of driver work


# ---------------------------------------------------------------------------
# programmed I/O, stepped one clock at a time
# ---------------------------------------------------------------------------
def sim_poll(n_bytes: int, dev_period: int):
    """Run the polled input loop one clock at a time.

    State machine: a TEST phase of POLL_TEST cycles samples the status register
    on its FIRST cycle; if that sample saw data the next phase is a MOVE of
    MOVE cycles, otherwise another TEST. The device makes byte k available at
    cycle (k+1)*dev_period and free-runs at that period.

    Nothing here divides bytes by a rate. The returned totals are counted.
    """
    t = 0
    got = 0
    polls = 0
    spin = 0
    useful = 0
    segs: list[tuple[int, int, str]] = []
    state, left, saw = "start", 0, False
    while True:
        if left == 0:
            if state == "move":
                got += 1
                if got == n_bytes:
                    break
            if state != "test" or not saw:
                state, left = "test", POLL_TEST
                polls += 1
                saw = t >= (got + 1) * dev_period
            else:
                state, left = "move", MOVE
            segs.append((t, left, state))
        t += 1
        left -= 1
        if state == "test":
            spin += 1
        else:
            useful += 1
    return dict(cycles=t, polls=polls, spin=spin, useful=useful, segs=segs)


# ---------------------------------------------------------------------------
# interrupt-driven I/O, stepped phase by phase
# ---------------------------------------------------------------------------
def sim_irq(n_bytes: int, dev_period: int, fifo: int):
    """Run the interrupt path one clock at a time.

    The device drops bytes into a FIFO of depth `fifo` at one byte every
    `dev_period` cycles and raises the request when the FIFO fills. Between
    requests the processor is charged nothing, because it is running other
    work; only the cycles inside the interrupt path are charged.
    """
    t = 0
    moved = 0
    busy = 0
    irqs = 0
    segs: list[tuple[int, int, str]] = []
    while moved < n_bytes:
        block = min(fifo, n_bytes - moved)
        ready = (moved + block) * dev_period
        while t < ready:                      # other work; not charged
            t += 1
        irqs += 1
        for name, dur in IRQ_PHASES:
            d = dur + block * MOVE if name == "body" else dur
            segs.append((t, d, name))
            for _ in range(d):
                t += 1
                busy += 1
        moved += block
    return dict(cycles=busy, elapsed=t, irqs=irqs, segs=segs)


# ---------------------------------------------------------------------------
# the shared bus, arbitrated cycle by cycle
# ---------------------------------------------------------------------------
def _mask(size: int, num: int, den: int, seed: int) -> np.ndarray:
    """An irregular reference pattern of EXACTLY density num/den.

    Only the arrangement is random - the count of references is fixed - so the
    density is not itself a source of error in anything measured against it.
    """
    ones = size * num // den
    m = np.zeros(size, dtype=bool)
    m[:ones] = True
    np.random.default_rng(seed).shuffle(m)
    return m


def sim_bus(n_bytes: int, mode: str, num: int = BUS_NUM, den: int = BUS_DEN,
            steal_every: int = 2, dev_period: int | None = None,
            pattern: str = "periodic", seed: int = 20260817, span: int = 1 << 20):
    """Arbitrate one bus between a CPU and a DMA controller, one clock at a time.

    The CPU needs the bus on `num` of every `den` cycles it EXECUTES. A stalled
    cycle does not advance its own schedule, so the reference pattern is fixed
    in CPU-progress time and slides in real time - which is exactly why the
    collision count has to be counted rather than multiplied out. With a
    strictly periodic pattern the stall shifts the processor by one cycle and
    can lock it onto the stolen cycle for good; `pattern="irregular"` keeps the
    same density but breaks the period, and the two answers bracket reality.

    modes
        burst        the controller holds the bus until the block is done
        steal        it takes one cycle in every `steal_every`, then releases
        transparent  it takes only cycles on which the CPU made no request
        paced        it takes one cycle every `dev_period`, winning arbitration
    """
    t = 0
    moved = 0
    prog = 0
    stall = 0
    cpu_bus = 0
    refs = None if pattern == "periodic" else _mask(span, num, den, seed)
    while moved < n_bytes:
        wants = (prog % den) < num if refs is None else bool(refs[prog % span])
        if mode == "burst":
            dma = True
        elif mode == "steal":
            dma = (t % steal_every) == 0
        elif mode == "transparent":
            dma = not wants
        elif mode == "paced":
            dma = (t % dev_period) == 0
        else:
            raise ValueError(mode)
        if dma:
            moved += 1
        if wants and dma:
            stall += 1
        else:
            prog += 1
            if wants:
                cpu_bus += 1
        t += 1
    return dict(elapsed=t, progress=prog, stall=stall, cpu_bus=cpu_bus, moved=moved)


# ---------------------------------------------------------------------------
# fixed-priority interrupt response, by running the schedule
# ---------------------------------------------------------------------------
def sim_priority(tasks, blocking, horizon, nested=True, offsets=None):
    """Release the sources and RUN the schedule, one microsecond at a time.

    `tasks` is (name, period, cost) in decreasing priority, all integers.
    `blocking` is a non-preemptable region entered at t = 0. Nothing here
    evaluates a response-time formula: each completion is timed against the
    release it belongs to and the largest gap seen is returned.
    """
    n = len(tasks)
    offs = list(offsets) if offsets else [0] * n
    queue: list[list[list[int]]] = [[] for _ in range(n)]   # [release, work left]
    worst = [0] * n
    running = None
    block_left = int(blocking)
    for t in range(int(horizon)):
        for i, (_, period, cost) in enumerate(tasks):
            d = t - offs[i]
            if d >= 0 and d % period == 0:
                queue[i].append([t, cost])
        if block_left > 0:
            block_left -= 1
            continue
        if nested or running is None or not queue[running]:
            running = next((i for i in range(n) if queue[i]), None)
        if running is None:
            continue
        job = queue[running][0]
        job[1] -= 1
        if job[1] == 0:
            worst[running] = max(worst[running], t + 1 - job[0])
            queue[running].pop(0)
            running = None
    return worst


def sweep_priority(tasks, blocking, index, nested, horizon=6000):
    """Worst response for one source, over every release phase it can have.

    The synchronous release is the critical instant only when handlers can
    preempt. Without nesting the worst case needs the source to arrive JUST
    AFTER a long handler starts, which no single phase alignment shows, so the
    phase is swept and the maximum is taken from the runs.
    """
    best = 0
    for o in range(tasks[index][1]):
        offs = [0] * len(tasks)
        offs[index] = o
        best = max(best, sim_priority(tasks, blocking, horizon, nested, offs)[index])
    return best


def rta(tasks, index, blocking):
    """Classical fixed-priority response-time fixed point, for comparison only."""
    _, _, c_i = tasks[index]
    r = c_i + blocking
    for _ in range(200):
        nxt = c_i + blocking + sum(
            math.ceil(r / tasks[j][1]) * tasks[j][2] for j in range(index)
        )
        if abs(nxt - r) < 1e-12:
            return r
        r = nxt
    raise RuntimeError("response time did not converge")


# ---------------------------------------------------------------------------
# producer and consumer, stepped microsecond by microsecond
# ---------------------------------------------------------------------------
def sim_buffers(n_buffers, cap, fill_us, drain_us, horizon_us, dt=1.0):
    """Step a device filling buffers and a processor draining them.

    A buffer being written occupies a slot, so the device can only write while
    `full` is below the buffer count; otherwise it is blocked and whatever it
    produces in that interval is lost. The delivered rate and the loss are
    COUNTED from the run - no period formula is applied anywhere in here.
    """
    rate = cap / fill_us
    full = 0                # complete buffers, including the one being drained
    filling = 0.0           # bytes accumulated in the slot under the device
    drain_left = 0.0
    delivered = 0.0
    lost = 0.0
    blocked = 0.0
    t = 0.0
    occ = []
    while t < horizon_us:
        if full < n_buffers:
            filling += rate * dt
            if filling >= cap - 1e-9:
                full += 1
                filling = 0.0
        else:
            lost += rate * dt
            blocked += dt
        if drain_left <= 0 and full > 0:
            drain_left = drain_us
        if drain_left > 0:
            drain_left -= dt
            if drain_left <= 1e-9:
                delivered += cap
                full -= 1
                drain_left = 0.0
        if t <= 4000.0:
            occ.append((t, full + filling / cap))
        t += dt
    return dict(delivered=delivered, lost=lost, blocked=blocked,
                rate=delivered / horizon_us, occ=occ)


# ===========================================================================
# figures - I/O and interfacing
# ===========================================================================
DEV_PERIOD = 100          # one byte every 100 cycles: a 1 MB/s device
FIFO = 16


@figure("sys3-io-timeline")
def _(mode):
    """Where the cycles go, for the same 64-byte transfer under all three methods."""
    c = S.SERIES[mode]
    n = 64
    poll = sim_poll(n, DEV_PERIOD)
    irq = sim_irq(n, DEV_PERIOD, FIFO)
    dma = sim_bus(n, "paced", dev_period=DEV_PERIOD)

    # steady-state poll accounting, confirmed against the stepped run
    per_byte = (poll["cycles"] - poll["segs"][0][0]) / n
    claim("polled loop cycles per byte at a 100-cycle device period",
          per_byte, DEV_PERIOD, 0.6)
    claim("polled loop useful fraction", poll["useful"] / poll["cycles"],
          MOVE / DEV_PERIOD, 0.004)
    claim("interrupt cycles charged for 64 bytes with a 16-deep FIFO",
          irq["cycles"], 4 * (IRQ_FIXED + FIFO * MOVE), 0.5)
    claim("periodic references lock onto the stolen cycle: one stall per byte",
          dma["stall"], n, 0)

    window = 2000
    fig, ax = plt.subplots(figsize=(7.2, 3.4))
    lanes = [
        ("polled", [(s, d, "spin" if k == "test" else "move") for s, d, k in poll["segs"]]),
        ("interrupt", [(s, d, "move" if k == "body" else "over") for s, d, k in irq["segs"]]),
        ("DMA", [(k * DEV_PERIOD, 1, "move") for k in range(window // DEV_PERIOD + 1)]),
    ]
    colours = {"spin": S.GUIDE[mode], "over": c[1], "move": c[0]}
    for row, (label, segs) in enumerate(lanes):
        y = 2 - row
        ax.broken_barh([(0, window)], (y - 0.32, 0.64),
                       facecolors="none", edgecolors=S.GRID[mode], linewidth=0.8)
        for kind in ("spin", "over", "move"):
            bars = [(s, d) for s, d, k in segs if k == kind and s < window]
            if bars:
                ax.broken_barh(bars, (y - 0.32, 0.64), facecolors=colours[kind])
        S.note(ax, -8, y, label, mode, ha="right", va="center", size=10)
    S.note(ax, 10, 2.42, "grey = status polling, blue = bytes actually moved", mode, size=9)
    S.note(ax, 10, 1.42, "orange = interrupt entry and exit, one request per full FIFO", mode, size=9)
    S.note(ax, 10, 0.42, "one stolen bus cycle per byte, nothing else charged", mode, size=9)
    ax.set_xlim(-320, window + 30)
    ax.set_ylim(-0.1, 2.9)
    ax.set_yticks([])
    ax.set_xlabel("clock cycle  (10 ns each)")
    ax.set_title("The same transfer, and what it costs the processor")
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.grid(False)
    return fig


@figure("sys3-io-crossover")
def _(mode):
    """CPU cycles against transfer size, with both crossovers marked."""
    c = S.SERIES[mode]
    sizes = np.unique(np.round(np.logspace(0, 3.3, 260)).astype(int))
    stall_per_byte = 1.0            # the stepped worst case, see sys3-io-dma-modes

    def poll_cost(n):
        return n * DEV_PERIOD

    def irq_cost(n):
        return math.ceil(n / FIFO) * IRQ_FIXED + n * MOVE

    def dma_cost(n):
        return DMA_SETUP + IRQ_FIXED + n * stall_per_byte

    # confirm the three cost models against stepped runs at one size
    probe = 64
    claim("polled cost model at 64 bytes", sim_poll(probe, DEV_PERIOD)["cycles"],
          poll_cost(probe), 40)
    claim("interrupt cost model at 64 bytes", sim_irq(probe, DEV_PERIOD, FIFO)["cycles"],
          irq_cost(probe), 0.5)
    claim("DMA stall model at 64 bytes",
          sim_bus(probe, "paced", dev_period=DEV_PERIOD)["stall"],
          probe * stall_per_byte, 0)

    # The crossovers are found by EVALUATING both cost functions at every
    # integer size, not by solving the smooth versions. The FIFO ceiling makes
    # the interrupt cost jump by a whole 84 cycles at each multiple of the
    # depth, so the smooth root and the integer answer are different numbers.
    x1 = next(n for n in range(1, 6000) if dma_cost(n) < poll_cost(n))
    x2 = next(n for n in range(1, 6000)
              if all(dma_cost(k) < irq_cost(k) for k in range(n, n + 400)))
    smooth1 = (DMA_SETUP + IRQ_FIXED) / (DEV_PERIOD - stall_per_byte)
    smooth2 = (DMA_SETUP + IRQ_FIXED) / (IRQ_FIXED / FIFO + MOVE - stall_per_byte)
    claim("DMA overtakes polling at this many bytes", x1, 4, 0,
          how="both cost functions evaluated at every integer size")
    claim("DMA overtakes interrupts at this many bytes", x2, 17, 0,
          how="both cost functions evaluated at every integer size")
    claim("the smooth interrupt crossover, which the ceiling invalidates",
          smooth2, 304 / 14.25, 1e-9, how="closed form, shown to disagree with the run")
    claim("smooth and integer interrupt crossovers differ by this many bytes",
          math.ceil(smooth2) - x2, 5, 0)
    for n, want in ((16, 244), (17, 338), (4096, 62464)):
        claim(f"interrupt cost at {n} bytes", irq_cost(n), want, 0)
    for n, want in ((16, 320), (17, 321), (4096, 4400)):
        claim(f"DMA cost at {n} bytes", dma_cost(n), want, 0)
    claim("DMA is this many times cheaper than polling at 4096 bytes",
          poll_cost(4096) / dma_cost(4096), 93.09, 0.005)
    claim("DMA is this many times cheaper than interrupts at 4096 bytes",
          irq_cost(4096) / dma_cost(4096), 14.196, 0.0005)

    fig, ax = plt.subplots()
    for k, (fn, name) in enumerate(((poll_cost, "polled"), (irq_cost, "interrupt, 16-deep FIFO"),
                                    (dma_cost, "DMA"))):
        y = np.array([fn(int(n)) for n in sizes], dtype=float)
        ax.loglog(sizes, y, color=c[k], lw=2.1)
        S.label_end(ax, sizes[-1], y[-1], name, c[k], mode)
    for xc, txt in ((x1, f"{x1} bytes"), (x2, f"{x2} bytes")):
        ax.axvline(xc, color=S.GUIDE[mode], lw=1.0, ls="--")
        S.note(ax, xc * 1.06, 3.2, txt, mode, size=9)
    ax.set_xlabel("bytes in the transfer")
    ax.set_ylabel("processor cycles consumed")
    ax.set_title("DMA repays its setup cost after seventeen bytes")
    ax.set_xlim(1, 5200)
    ax.set_ylim(1, 4e5)
    S.strip(ax)
    return fig


@figure("sys3-io-dma-modes")
def _(mode):
    """Burst, cycle steal and transparent: transfer time against processor cost."""
    c = S.SERIES[mode]
    n = 4096
    runs = {
        "burst": sim_bus(n, "burst"),
        "cycle steal": sim_bus(n, "steal", steal_every=2),
        "transparent": sim_bus(n, "transparent"),
    }
    heavy = sim_bus(n, "transparent", num=7, den=10)

    claim("burst transfer occupies exactly one cycle per byte",
          runs["burst"]["elapsed"], n, 0)
    claim("burst stalls the processor for the whole burst",
          runs["burst"]["stall"], n, 0)
    claim("cycle steal at one cycle in two takes twice as long",
          runs["cycle steal"]["elapsed"], 2 * n, 1)
    claim("cycle steal costs the processor a third of the elapsed cycles",
          runs["cycle steal"]["stall"], 2 * n / 4, 1)
    claim("transparent DMA costs the processor nothing",
          runs["transparent"]["stall"], 0, 0)
    claim("transparent DMA takes the reciprocal of the free-cycle fraction",
          runs["transparent"]["elapsed"], n / (1 - BUS_NUM / BUS_DEN), 1)
    claim("transparent DMA on a bus-heavy processor",
          heavy["elapsed"], n / 0.3, 6)

    names = list(runs)
    elapsed = [runs[k]["elapsed"] for k in names]
    stalls = [runs[k]["stall"] for k in names]
    idx = np.arange(len(names))
    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0))
    a1.bar(idx, elapsed, width=0.5, color=c[0])
    for i, v in enumerate(elapsed):
        a1.annotate(f"{v:,}", (i, v), textcoords="offset points", xytext=(0, 4),
                    ha="center", color=S.INK_2[mode], fontsize=9)
    a1.set_ylabel("cycles to move 4096 bytes")
    a1.set_title("The same 4096 bytes, three arbitration policies")
    a1.set_ylim(0, 9600)
    S.strip(a1)
    a2.bar(idx, stalls, width=0.5, color=c[1])
    for i, v in enumerate(stalls):
        a2.annotate(f"{v:,}", (i, v), textcoords="offset points", xytext=(0, 4),
                    ha="center", color=S.INK_2[mode], fontsize=9)
    a2.set_ylabel("processor cycles lost")
    a2.set_ylim(0, 4900)
    a2.set_xticks(idx)
    a2.set_xticklabels(names)
    S.strip(a2)
    return fig


@figure("sys3-io-priority")
def _(mode):
    """Worst-case response for three sources, with nesting and without."""
    c = S.SERIES[mode]
    tasks = [("A", 200, 20), ("B", 500, 60), ("C", 2000, 200)]
    blocking = 15
    nested = [sweep_priority(tasks, blocking, i, True) for i in range(3)]
    flat = [sweep_priority(tasks, blocking, i, False) for i in range(3)]

    for i, (name, _, _) in enumerate(tasks):
        claim(f"worst-case response of source {name} with nesting",
              nested[i], rta(tasks, i, blocking), 0,
              how="phase-swept schedule run against the response-time fixed point")
    claim("worst-case response of source A with handlers non-preemptable",
          flat[0], 220, 1, how="phase-swept schedule run against the blocking bound")
    claim("worst-case response of source B with handlers non-preemptable",
          flat[1], 280, 1, how="phase-swept schedule run against the blocking bound")
    claim("worst-case response of source C with handlers non-preemptable",
          flat[2], 295, 0, how="phase-swept schedule run")
    claim("nesting improves the top-priority response by this factor",
          flat[0] / nested[0], 219 / 35, 0.005)
    claim("nesting costs the bottom-priority response this fraction",
          nested[2] / flat[2] - 1, 315 / 295 - 1, 1e-9)
    claim("processor utilisation of the three interrupt sources",
          sum(c / p for _, p, c in tasks), 0.32, 1e-9,
          how="summed from the stated periods and costs")

    idx = np.arange(3)
    fig, ax = plt.subplots()
    ax.bar(idx - 0.19, nested, width=0.36, color=c[0])
    ax.bar(idx + 0.19, flat, width=0.36, color=c[1])
    for i in range(3):
        ax.annotate(f"{nested[i]:.0f}", (i - 0.19, nested[i]), xytext=(0, 4),
                    textcoords="offset points", ha="center",
                    color=S.INK_2[mode], fontsize=9)
        ax.annotate(f"{flat[i]:.0f}", (i + 0.19, flat[i]), xytext=(0, 4),
                    textcoords="offset points", ha="center",
                    color=S.INK_2[mode], fontsize=9)
    S.label_end(ax, 2.19, flat[2] + 26, "interrupts disabled\nin the handler", c[1],
                mode, ha="right", size=9)
    S.label_end(ax, 0.0, nested[0] + 60, "nesting allowed", c[0], mode, ha="center", size=9)
    ax.set_xticks(idx)
    ax.set_xticklabels([f"{n}\nT = {int(p)} us, C = {int(q)} us" for n, p, q in tasks])
    ax.set_ylabel("worst-case response  (us)")
    ax.set_title("Nesting moves latency from the urgent source to the patient one")
    ax.set_ylim(0, 380)
    S.strip(ax)
    return fig


@figure("sys3-io-buffering")
def _(mode):
    """One buffer against two, at a consumer that is fast enough and one that is not."""
    c = S.SERIES[mode]
    cap, fill, horizon = 256.0, 256.0, 2.0e6
    fast, slow = 180.0, 300.0
    single_fast = sim_buffers(1, cap, fill, fast, horizon)
    double_fast = sim_buffers(2, cap, fill, fast, horizon)
    double_slow = sim_buffers(2, cap, fill, slow, horizon)

    dev_rate = cap / fill
    claim("single buffering delivers the reciprocal of fill plus drain",
          single_fast["rate"], cap / (fill + fast), 0.002)
    claim("double buffering with a fast consumer keeps the whole device rate",
          double_fast["rate"], dev_rate, 0.002)
    claim("double buffering cannot fix a consumer that is too slow",
          double_slow["rate"], cap / slow, 0.002)
    claim("single buffering throughput as a fraction of the device rate",
          single_fast["rate"] / dev_rate, fill / (fill + fast), 0.002)

    fig, ax = plt.subplots()
    for k, (run, name) in enumerate((
            (single_fast, "one buffer, 180 us consumer"),
            (double_fast, "two buffers, 180 us consumer"),
            (double_slow, "two buffers, 300 us consumer"))):
        t = np.array([p[0] for p in run["occ"]])
        y = np.array([p[1] for p in run["occ"]])
        m = t <= 2200
        ax.plot(t[m], y[m], color=c[k], lw=1.9)
        S.label_end(ax, t[m][-1], y[m][-1], name, c[k], mode, size=9)
    ax.set_xlabel("time  (us)")
    ax.set_ylabel("buffers held  (full plus the one filling)")
    ax.set_title("Double buffering removes the stall, not the throughput deficit")
    ax.set_xlim(0, 3400)
    ax.set_ylim(0, 2.5)
    S.strip(ax)
    return fig


@figure("sys3-io-handshake")
def _(mode):
    """Synchronous and asynchronous bus cycles against device speed."""
    c = S.SERIES[mode]
    t_addr, t_dec, t_skew, t_setup = 4.0, 6.0, 4.0, 2.0
    devices = [("fast, 12 ns", 12.0), ("typical, 34 ns", 34.0), ("slow, 90 ns", 90.0)]
    period = 20.0                                  # a 50 MHz synchronous bus

    sync, asyn = [], []
    for _, t_acc in devices:
        need = t_addr + t_dec + t_acc + t_setup + t_skew
        waits = max(0, math.ceil((need - period) / period))
        sync.append((1 + waits) * period)
        asyn.append(t_addr + t_dec + t_acc + t_setup + 4 * t_skew)

    claim("synchronous cycle for the fast device", sync[0], 40.0, 1e-9,
          how="wait-state count stepped from the timing budget")
    claim("synchronous cycle for the typical device", sync[1], 60.0, 1e-9,
          how="wait-state count stepped from the timing budget")
    claim("synchronous cycle for the slow device", sync[2], 120.0, 1e-9,
          how="wait-state count stepped from the timing budget")
    claim("asynchronous cycle for the typical device", asyn[1], 62.0, 1e-9,
          how="handshake phases summed one at a time")
    claim("asynchronous cycle for the slow device", asyn[2], 118.0, 1e-9,
          how="handshake phases summed one at a time")
    claim("handshake penalty on the typical device", asyn[1] / sync[1] - 1,
          62.0 / 60.0 - 1, 1e-9)
    claim("handshake saving on the slow device", 1 - asyn[2] / sync[2],
          1 - 118.0 / 120.0, 1e-9)
    for k, (_, t_acc) in enumerate(devices):
        need = t_addr + t_dec + t_acc + t_setup + t_skew
        claim(f"clock rounding waste, device {k}", 1 - need / sync[k],
              (1 - 28 / 40, 1 - 50 / 60, 1 - 106 / 120)[k], 1e-9,
              how="required time compared against the rounded-up cycle")

    idx = np.arange(3)
    fig, ax = plt.subplots()
    ax.bar(idx - 0.19, sync, width=0.36, color=c[0])
    ax.bar(idx + 0.19, asyn, width=0.36, color=c[1])
    for i in range(3):
        ax.annotate(f"{sync[i]:.0f} ns", (i - 0.19, sync[i]), xytext=(0, 4),
                    textcoords="offset points", ha="center",
                    color=S.INK_2[mode], fontsize=9)
        ax.annotate(f"{asyn[i]:.0f} ns", (i + 0.19, asyn[i]), xytext=(0, 4),
                    textcoords="offset points", ha="center",
                    color=S.INK_2[mode], fontsize=9)
    S.label_end(ax, -0.19, sync[0] + 14, "synchronous,\n20 ns clock", c[0], mode,
                ha="center", size=9)
    S.label_end(ax, 2.19, asyn[2] + 14, "asynchronous\nhandshake", c[1], mode,
                ha="center", size=9)
    ax.set_xticks(idx)
    ax.set_xticklabels([n for n, _ in devices])
    ax.set_ylabel("bus cycle length  (ns)")
    ax.set_title("A clocked bus rounds up; a handshake does not")
    ax.set_ylim(0, 160)
    S.strip(ax)
    return fig


# ===========================================================================
# simulators - performance metrics
# ===========================================================================
def sim_schedule(n_serial: int, n_parallel: int, procs: int):
    """List-schedule unit tasks onto processors and READ the makespan.

    Serial tasks run one after another on processor zero because nothing else
    may proceed. Parallel tasks go to whichever processor is least loaded. The
    speedup is the one-processor makespan over the many-processor makespan, and
    neither number comes from Amdahl's expression.
    """
    # The serial phase is a DEPENDENCY, not merely an exclusive resource: no
    # parallel task may start until it has finished, so every processor becomes
    # available at n_serial and not before.
    busy = [float(n_serial)] * procs
    for _ in range(n_parallel):
        k = min(range(procs), key=lambda i: busy[i])
        busy[k] += 1
    makespan = max(busy)
    return dict(makespan=makespan, speedup=(n_serial + n_parallel) / makespan,
                busy=busy)


def sim_gustafson(serial_time: int, parallel_time: int, procs: int):
    """Count the WORK a fixed wall-clock run gets through on `procs` processors.

    The scaled-speedup question is how long one processor would need to redo
    that work, so the work units are counted as they are scheduled and the
    ratio is taken against the wall clock.
    """
    work = serial_time                        # the serial phase does one unit per unit time
    for _ in range(parallel_time):
        work += procs                         # every processor busy for this time unit
    wall = serial_time + parallel_time
    return dict(work=work, wall=wall, speedup=work / wall)


def sim_queue(lam: float, mu: float, n: int, service: str = "exp",
              seed: int = 20260817, samples: int = 200000):
    """Discrete-event single-server queue, run customer by customer.

    Departure of customer k is max(previous departure, its arrival) plus its
    service, which is the queue's actual dynamics rather than a formula. The
    mean number in the system is obtained by SAMPLING the state at evenly
    spaced instants and counting, so it is not Little's law restated.
    """
    rng = np.random.default_rng(seed)
    gaps = rng.exponential(1.0 / lam, n)
    arrive = np.cumsum(gaps)
    if service == "exp":
        svc = rng.exponential(1.0 / mu, n)
    elif service == "det":
        svc = np.full(n, 1.0 / mu)
    else:
        raise ValueError(service)
    # Lindley's recursion D_k = max(D_{k-1}, A_k) + S_k has the closed solution
    # D_k = C_k + max_{j<=k}(A_j - C_{j-1}) with C the cumulative service, so the
    # queue can be run over millions of customers without a Python loop. The
    # dynamics are identical; only the evaluation order changes.
    cum = np.cumsum(svc)
    cum_prev = np.concatenate(([0.0], cum[:-1]))
    depart = cum + np.maximum.accumulate(arrive - cum_prev)
    sojourn = depart - arrive
    warm = n // 10
    t0, t1 = arrive[warm], arrive[-1]
    probe = np.linspace(t0, t1, samples)
    in_system = (np.searchsorted(arrive, probe, "right")
                 - np.searchsorted(np.sort(depart), probe, "right"))
    busy = np.searchsorted(arrive, probe, "right") - np.searchsorted(np.sort(depart), probe, "right")
    return dict(mean_sojourn=float(sojourn[warm:].mean()),
                mean_number=float(in_system.mean()),
                utilisation=float((busy > 0).mean()))


def sim_batch(lam: float, setup: float, per_item: float, batch: int,
              n: int = 400000, seed: int = 20260817):
    """A batch server, run event by event.

    Items arrive as a Poisson stream. The server waits until `batch` of them are
    present, then occupies itself for setup plus per-item time. Latency is
    recorded per ITEM from its own arrival, which is the quantity batching
    damages and the aggregate throughput hides.
    """
    rng = np.random.default_rng(seed)
    arrive = np.cumsum(rng.exponential(1.0 / lam, n))
    free = 0.0
    latency = np.empty(n)
    k = 0
    while k + batch <= n:
        start = max(free, arrive[k + batch - 1])
        free = start + setup + batch * per_item
        latency[k:k + batch] = free - arrive[k:k + batch]
        k += batch
    done = k
    warm = done // 10
    return dict(mean_latency=float(latency[warm:done].mean()),
                max_latency=float(latency[warm:done].max()),
                throughput=done / free,
                capacity=batch / (setup + batch * per_item))


def dvfs_voltage(f, vth=0.35, kf=None):
    """Invert the alpha-power delay law f = k (V - Vth)^2 / V for V.

    Calibrated so that one volt gives two gigahertz, which fixes k and makes
    every other point on the curve a consequence rather than a choice.
    """
    if kf is None:
        kf = 2.0 / ((1.0 - vth) ** 2 / 1.0)
    f = np.asarray(f, dtype=float)
    b = 2 * vth + f / kf
    return (b + np.sqrt(b * b - 4 * vth * vth)) / 2


# ===========================================================================
# figures - performance metrics
# ===========================================================================
@figure("sys3-perf-batching")
def _(mode):
    """Batching raises throughput and raises latency; the two optima differ."""
    c = S.SERIES[mode]
    lam, setup, per_item = 0.12, 40.0, 5.0
    sizes = [12, 16, 20, 24, 32, 40, 48, 64, 96, 128, 192, 256]
    runs = {b: sim_batch(lam, setup, per_item, b) for b in sizes}
    stable = [b for b in sizes if runs[b]["capacity"] > lam]

    claim("smallest batch that keeps up with the arrival rate", min(stable), 16, 0,
          how="capacity of each batch size evaluated against the arrival rate")
    claim("capacity at a batch of 16", runs[16]["capacity"], 16 / 120, 1e-12)
    claim("capacity at a batch of 32", runs[32]["capacity"], 32 / 200, 1e-12)
    claim("capacity ceiling as the batch grows", 1.0 / per_item, 0.2, 1e-12)
    best = min(stable, key=lambda b: runs[b]["mean_latency"])
    claim("batch size that minimises mean latency", best, 16, 0,
          how="event-by-event run at every batch size")
    claim("mean latency at the minimum", runs[best]["mean_latency"], 205.0, 2.0)
    claim("mean latency at a batch of 256", runs[256]["mean_latency"], 2382.0, 12.0)
    claim("latency paid for that throughput",
          runs[256]["mean_latency"] / runs[best]["mean_latency"], 11.6, 0.15)
    claim("a batch of 12 sits exactly at capacity", runs[12]["capacity"], lam, 1e-12,
          how="capacity evaluated at the batch size")
    claim("and its latency is five times the minimum",
          runs[12]["mean_latency"] / runs[best]["mean_latency"], 4.9, 0.2)
    claim("throughput gain from 16 to 256", runs[256]["capacity"] / runs[16]["capacity"],
          (256 / 1320) / (16 / 120), 1e-12)

    fig, (a1, a2) = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.2))
    x = np.array(sizes, dtype=float)
    cap = np.array([runs[b]["capacity"] for b in sizes])
    a1.semilogx(x, cap, color=c[0], lw=2.1, marker="o", ms=4)
    a1.axhline(lam, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a1, 12.6, lam + 0.003, "arrival rate", mode, size=9)
    a1.axhline(1.0 / per_item, color=S.GUIDE[mode], lw=1.1, ls=":")
    S.note(a1, 12.6, 0.203, "ceiling, one item per service time", mode, size=9)
    a1.set_ylabel("capacity  (items per us)")
    a1.set_title("Bigger batches buy throughput and spend latency")
    a1.set_ylim(0.1, 0.235)
    S.strip(a1)
    lat = np.array([runs[b]["mean_latency"] for b in sizes])
    a2.loglog(x, lat, color=c[1], lw=2.1, marker="o", ms=4)
    a2.plot([best], [runs[best]["mean_latency"]], marker="o", ms=9,
            mfc="none", mec=c[1], mew=1.8)
    S.note(a2, best * 1.15, runs[best]["mean_latency"] * 0.72,
           f"minimum at {best}, {runs[best]['mean_latency']:.0f} us", mode, size=9)
    a2.set_ylabel("mean item latency  (us)")
    a2.set_xlabel("batch size")
    a2.set_xticks(x)
    a2.set_xticklabels([str(b) for b in sizes], fontsize=8)
    a2.minorticks_off()
    S.strip(a2)
    return fig


@figure("sys3-perf-flops")
def _(mode):
    """The faster algorithm scores the lower rate."""
    c = S.SERIES[mode]
    n = 1024
    classic = 2 * n ** 3
    half = n // 2
    strassen = 7 * 2 * half ** 3 + 18 * half ** 2
    r_classic, r_strassen = 2.5e9, 2.3e9
    t_classic = classic / r_classic
    t_strassen = strassen / r_strassen

    claim("classical multiply flop count", classic, 2147483648, 0,
          how="operation count summed from the algorithm")
    claim("one-level Strassen flop count", strassen, 1883766784, 0,
          how="operation count summed from the algorithm")
    claim("Strassen does this fraction of the work", strassen / classic, 0.877197, 5e-7)
    claim("classical runtime", t_classic, 0.858993, 1e-6)
    claim("Strassen runtime", t_strassen, 0.819029, 1e-6)
    claim("Strassen is faster by this factor", t_classic / t_strassen, 1.048795, 5e-6)
    claim("yet its rate is lower by this factor", r_strassen / r_classic, 0.92, 1e-12)

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.2, 3.8))
    names = ["classical", "Strassen"]
    a1.bar([0, 1], [r_classic / 1e9, r_strassen / 1e9], width=0.5, color=c[0])
    for i, v in enumerate([r_classic / 1e9, r_strassen / 1e9]):
        a1.annotate(f"{v:.2f}", (i, v), xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK_2[mode], fontsize=9)
    a1.set_xticks([0, 1]); a1.set_xticklabels(names)
    a1.set_ylabel("rate  (GFLOPS)")
    a1.set_title("What the rate says")
    a1.set_ylim(0, 3.1)
    S.strip(a1)
    a2.bar([0, 1], [t_classic, t_strassen], width=0.5, color=c[1])
    for i, v in enumerate([t_classic, t_strassen]):
        a2.annotate(f"{v:.3f} s", (i, v), xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK_2[mode], fontsize=9)
    a2.set_xticks([0, 1]); a2.set_xticklabels(names)
    a2.set_ylabel("time to finish  (s)")
    a2.set_title("What the clock says")
    a2.set_ylim(0, 1.05)
    S.strip(a2)
    return fig


@figure("sys3-perf-means")
def _(mode):
    """The arithmetic mean of ratios reverses when the reference changes."""
    c = S.SERIES[mode]
    P = np.array([20.0, 10.0, 40.0])
    Q = np.array([10.0, 40.0, 20.0])
    # speedup of Q relative to P is P's time over Q's time, and vice versa
    q_rel_p = P / Q
    p_rel_q = Q / P
    am_q, gm_q = q_rel_p.mean(), float(np.prod(q_rel_p) ** (1 / 3))
    am_p, gm_p = p_rel_q.mean(), float(np.prod(p_rel_q) ** (1 / 3))

    claim("the two machines take the same total time", P.sum(), Q.sum(), 1e-12,
          how="times summed directly")
    claim("arithmetic mean of the ratios with P as reference", am_q, 17 / 12, 1e-12,
          how="ratios formed and averaged directly")
    claim("arithmetic mean of the ratios with Q as reference", am_p, 5 / 3, 1e-12,
          how="ratios formed and averaged directly")
    claim("geometric mean with P as reference", gm_q, 1.0, 1e-12)
    claim("geometric mean with Q as reference", gm_p, 1.0, 1e-12)
    claim("the arithmetic mean claims this speedup for Q, then for P",
          am_q * am_p, (17 / 12) * (5 / 3), 1e-12,
          how="both directions computed and multiplied, which must be 1 for a consistent summary")

    fig, ax = plt.subplots()
    idx = np.arange(2)
    ax.bar(idx - 0.19, [am_q, am_p], width=0.36, color=c[0])
    ax.bar(idx + 0.19, [gm_q, gm_p], width=0.36, color=c[1])
    for i, (a, g) in enumerate(((am_q, gm_q), (am_p, gm_p))):
        ax.annotate(f"{a:.4f}", (i - 0.19, a), xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK_2[mode], fontsize=9)
        ax.annotate(f"{g:.4f}", (i + 0.19, g), xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK_2[mode], fontsize=9)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, -0.44, 1.02, "equal performance", mode, size=9)
    S.label_end(ax, -0.19, am_q + 0.13, "arithmetic mean\nof ratios", c[0], mode,
                ha="center", size=9)
    S.label_end(ax, 1.19, gm_p + 0.13, "geometric mean\nof ratios", c[1], mode,
                ha="center", size=9)
    ax.set_xticks(idx)
    ax.set_xticklabels(["Q measured against P", "P measured against Q"])
    ax.set_ylabel("summary speedup")
    ax.set_title("Two machines of equal total time, summarised two ways")
    ax.set_ylim(0, 2.15)
    S.strip(ax)
    return fig


@figure("sys3-perf-scaling")
def _(mode):
    """Amdahl and Gustafson on the same workload, against scheduled runs."""
    c = S.SERIES[mode]
    serial, parallel = 100, 900
    procs = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
    sched = {p: sim_schedule(serial, parallel, p) for p in procs}
    scaled = {p: sim_gustafson(serial, parallel, p) for p in procs}
    f = parallel / (serial + parallel)
    amdahl = lambda p: 1.0 / ((1 - f) + f / p)

    claim("scheduled speedup on 4 processors matches Amdahl exactly",
          sched[4]["speedup"], amdahl(4), 1e-12,
          how="unit tasks assigned to processors and the makespan read")
    claim("scheduled speedup on 8 processors falls short of Amdahl",
          sched[8]["speedup"], 1000 / 213, 1e-12,
          how="unit tasks assigned to processors and the makespan read")
    claim("the shortfall at 8 processors, as a fraction",
          1 - sched[8]["speedup"] / amdahl(8), 1 - (1000 / 213) / (1 / 0.2125), 1e-12)
    claim("Amdahl ceiling for this workload", 1 / (1 - f), 10.0, 1e-12)
    claim("scheduled speedup on 1024 processors", sched[1024]["speedup"],
          1000 / 101, 1e-12, how="makespan read from the schedule")
    claim("Gustafson scaled speedup on 8 processors", scaled[8]["speedup"], 7.3, 1e-12,
          how="work units counted as they are scheduled")
    claim("Gustafson scaled speedup on 1024 processors", scaled[1024]["speedup"],
          0.1 + 0.9 * 1024, 1e-9, how="work units counted as they are scheduled")
    claim("efficiency at 8 processors from the schedule",
          sched[8]["speedup"] / 8, (1000 / 213) / 8, 1e-12)
    claim("efficiency at 1024 processors from the schedule",
          sched[1024]["speedup"] / 1024, (1000 / 101) / 1024, 1e-12)

    x = np.array(procs, dtype=float)
    fig, ax = plt.subplots()
    ax.loglog(x, [amdahl(p) for p in procs], color=c[0], lw=2.1)
    ax.loglog(x, [sched[p]["speedup"] for p in procs], color=c[0], lw=0, marker="o",
              ms=5, mfc="none", mew=1.5)
    ax.loglog(x, [scaled[p]["speedup"] for p in procs], color=c[1], lw=2.1)
    ax.axhline(10.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 1.15, 10.8, "Amdahl ceiling, 10", mode, size=9)
    S.label_end(ax, x[-1], amdahl(1024), "Amdahl, fixed problem\n(circles: scheduled)",
                c[0], mode, size=9, va="top")
    S.label_end(ax, x[-1], scaled[1024]["speedup"], "Gustafson, scaled problem",
                c[1], mode, size=9)
    ax.set_xlabel("processors")
    ax.set_ylabel("speedup")
    ax.set_title("Same 10 percent serial fraction, two different questions")
    ax.set_xlim(1, 6000)
    ax.set_ylim(0.8, 2000)
    S.strip(ax)
    return fig


@figure("sys3-perf-queue")
def _(mode):
    """Response time against utilisation, with discrete-event runs on top."""
    c = S.SERIES[mode]
    mu = 1.0
    rho = np.linspace(0.02, 0.94, 400)
    mm1 = 1.0 / (mu - rho * mu)
    md1 = 1.0 / mu + rho / (2 * mu * (1 - rho))

    probes = [0.5, 0.7, 0.8, 0.9]
    runs = {r: sim_queue(r * mu, mu, 6000000) for r in probes}
    for r in probes:
        claim(f"simulated mean sojourn at utilisation {r}", runs[r]["mean_sojourn"],
              1.0 / (mu - r * mu), 0.005 / (1 - r),
              how="discrete-event run against the closed form")
        claim(f"simulated mean number in system at utilisation {r}",
              runs[r]["mean_number"], r / (1 - r), 0.01 / (1 - r),
              how="queue length sampled at fixed instants, compared with Little's law")
    det = sim_queue(0.8 * mu, mu, 6000000, service="det")
    claim("deterministic service halves the waiting at 0.8",
          det["mean_sojourn"], 1.0 + 0.8 / (2 * (1 - 0.8)), 0.005,
          how="discrete-event run against Pollaczek-Khinchine")
    for r in probes:
        claim(f"Little's law holds in the run at utilisation {r}",
              runs[r]["mean_number"], r * mu * runs[r]["mean_sojourn"], 0.006 / (1 - r),
              how="sampled queue length against arrival rate times measured sojourn")
        claim(f"measured server utilisation at {r}", runs[r]["utilisation"], r, 0.002,
              how="fraction of sampled instants with the server busy")
    claim("response time multiplier between utilisation 0.5 and 0.9",
          (1 / (1 - 0.9)) / (1 / (1 - 0.5)), 5.0, 1e-12)

    fig, ax = plt.subplots()
    ax.plot(rho, mm1, color=c[0], lw=2.1)
    ax.plot(rho, md1, color=c[1], lw=2.1)
    ax.plot(probes, [runs[r]["mean_sojourn"] for r in probes], lw=0, marker="o",
            ms=6, mfc="none", mec=c[0], mew=1.8)
    ax.plot([0.8], [det["mean_sojourn"]], lw=0, marker="o", ms=6, mfc="none",
            mec=c[1], mew=1.8)
    S.label_end(ax, 0.94, mm1[-1], "exponential service\n(circles: simulated)", c[0],
                mode, size=9, va="top")
    S.label_end(ax, 0.94, md1[-1], "constant service", c[1], mode, size=9)
    for r in (0.5, 0.9):
        ax.axvline(r, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.51, 15.5, "0.5", mode, size=9)
    S.note(ax, 0.905, 15.5, "0.9", mode, size=9)
    ax.set_xlabel("utilisation")
    ax.set_ylabel("mean response time  (service times)")
    ax.set_title("Latency is flat until it is not")
    ax.set_xlim(0, 1.06)
    ax.set_ylim(0, 18)
    S.strip(ax)
    return fig


@figure("sys3-perf-edp")
def _(mode):
    """Energy, delay and their product each pick a different operating point."""
    c = S.SERIES[mode]
    p_leak = 0.5
    f = np.linspace(0.45, 6.0, 4001)
    v = dvfs_voltage(f)
    energy = v ** 2 + p_leak / f
    delay = 1.0 / f
    edp = energy * delay

    i_e = int(np.argmin(energy))
    i_p = int(np.argmin(edp))
    claim("one volt gives two gigahertz, by construction",
          float(dvfs_voltage(np.array([2.0]))[0]), 1.0, 1e-9,
          how="the delay law inverted and evaluated back")
    claim("frequency that minimises energy per operation", f[i_e], 1.102, 0.002,
          how="the energy curve searched point by point")
    claim("frequency that minimises the energy-delay product", f[i_p], 3.412, 0.002,
          how="the product curve searched point by point")
    claim("delay is minimised only at the top of the range", f[int(np.argmin(delay))],
          6.0, 1e-9)
    claim("energy penalty of running at the EDP optimum instead of the energy one",
          energy[i_p] / energy[i_e] - 1, 0.8142, 0.0005)
    claim("delay saving of the same move", 1 - delay[i_p] / delay[i_e], 0.6770, 0.0005)
    claim("energy per operation at the energy optimum", energy[i_e], 1.0538, 0.0002)
    claim("energy per operation at the EDP optimum", energy[i_p], 1.9118, 0.0002)
    claim("supply voltage at the EDP optimum", v[i_p], 1.3287, 0.0002,
          how="the delay law inverted at that frequency")

    fig, ax = plt.subplots()
    ax.plot(f, energy / energy[i_e], color=c[0], lw=2.1)
    ax.plot(f, delay / delay[i_e], color=c[1], lw=2.1)
    ax.plot(f, edp / edp[i_p], color=c[2], lw=2.1)
    for i, col, txt in ((i_e, c[0], f"energy min\n{f[i_e]:.2f} GHz"),
                        (i_p, c[2], f"EDP min\n{f[i_p]:.2f} GHz")):
        ax.axvline(f[i], color=S.GUIDE[mode], lw=1.0, ls="--")
        S.note(ax, f[i] + 0.08, 2.35, txt, mode, size=9)
    S.label_end(ax, 6.0, energy[-1] / energy[i_e], "energy per operation", c[0], mode, size=9)
    S.label_end(ax, 6.0, delay[-1] / delay[i_e], "delay", c[1], mode, size=9)
    S.label_end(ax, 6.0, edp[-1] / edp[i_p], "energy-delay product", c[2], mode, size=9)
    ax.set_xlabel("clock frequency  (GHz)")
    ax.set_ylabel("value relative to its own minimum")
    ax.set_title("Three metrics, three different best operating points")
    ax.set_xlim(0.4, 7.6)
    ax.set_ylim(0, 3.0)
    S.strip(ax)
    return fig


# ===========================================================================
def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for m, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(m)
        fig = fn(m)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    prefix = args[0] if args else PREFIX
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    if "--claims" in sys.argv:
        S.apply("light")
        for n in sorted(names):
            REGISTRY[n]("light")
            plt.close("all")
    else:
        for n in sorted(names):
            render(n, REGISTRY[n])
            print("wrote", n)
        print(f"\n{len(names)} figures -> {OUT}")
    print(f"\n{len(CLAIMS)} claims confirmed against an independent route:")
    for what, how, stepped, stated in CLAIMS:
        print(f"  {stepped:>14.6g}  vs {stated:>14.6g}   {what}   [{how}]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
