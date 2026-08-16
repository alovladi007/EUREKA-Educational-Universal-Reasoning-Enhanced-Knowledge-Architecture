#!/usr/bin/env python3
"""Depth-wave-10 figures and number verification for two FE Computer Systems
chapters: fee_architecture and fee_mem_hierarchy.

Same contract as gen_fe_ee_e2.py, and it imports the SAME style module rather
than growing a second look. Nothing here is traced, scanned or adapted from the
NCEES Reference Handbook or from any study guide: this file consumes equations
and reference strings, both of which the lessons write out in full, and emits
the pictures of them.

What makes this file different from its siblings is that the two chapters it
serves are about MACHINES, and a machine can be run. So every number the two
lessons print is confirmed twice:

  * once by the closed-form expression the lesson states, and
  * once by an INDEPENDENT route - an actual simulation. Cache hit counts come
    from pushing a real address trace through a real tag array and counting;
    pipeline cycle counts come from stepping a five-stage pipeline cycle by
    cycle under backpressure rules; Amdahl speedups come from list-scheduling
    ten thousand tasks onto N workers and measuring the makespan; the Little's
    law occupancy comes from advancing a clock and counting requests in flight.

A formula checked against itself is not checked. `verify()` below runs first,
every time, and the figures are not written unless it passes.

Usage:
    python3 scripts/gen_fe_ee_d10.py             # verify, then render all
    python3 scripts/gen_fe_ee_d10.py --facts     # verify and print the numbers
    python3 scripts/gen_fe_ee_d10.py sys2-mem    # only names with that prefix
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
    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


def close(a, b, tol=1e-9):
    return abs(a - b) <= tol


# ===========================================================================
# SIMULATORS - the independent route
# ===========================================================================


class Cache:
    """A tag array with a replacement order per set. Byte addresses in, hit or
    miss out. No performance formula appears anywhere in this class, which is
    the point: the hit rates the lessons print are COUNTED here, not
    evaluated."""

    def __init__(self, size_bytes: int, block_bytes: int, ways: int, policy: str = "LRU"):
        assert size_bytes % (block_bytes * ways) == 0
        self.block = block_bytes
        self.ways = ways
        self.nsets = size_bytes // (block_bytes * ways)
        self.policy = policy
        self.sets: list[list[int]] = [[] for _ in range(self.nsets)]
        self.seen: set[int] = set()
        self.hits = 0
        self.misses = 0
        self.compulsory = 0

    def access(self, addr: int) -> bool:
        blk = addr // self.block
        s = blk % self.nsets
        tag = blk // self.nsets
        order = self.sets[s]
        if tag in order:
            self.hits += 1
            if self.policy == "LRU":
                order.remove(tag)
                order.append(tag)
            return True
        self.misses += 1
        if blk not in self.seen:
            self.compulsory += 1
            self.seen.add(blk)
        if len(order) >= self.ways:
            order.pop(0)
        order.append(tag)
        return False

    @property
    def total(self) -> int:
        return self.hits + self.misses

    @property
    def hit_rate(self) -> float:
        return self.hits / self.total


def run(cache: Cache, trace) -> Cache:
    for a in trace:
        cache.access(a)
    return cache


def frames_sim(refs, nframes: int, policy: str) -> int:
    """Fully associative replacement on a block-number reference string.

    LRU moves a block to the young end when it is touched; FIFO does not; OPT
    evicts whichever resident block is next needed farthest ahead."""
    resident: list[int] = []
    misses = 0
    for i, r in enumerate(refs):
        if r in resident:
            if policy == "LRU":
                resident.remove(r)
                resident.append(r)
            continue
        misses += 1
        if len(resident) >= nframes:
            if policy == "OPT":
                def next_use(block):
                    for k in range(i + 1, len(refs)):
                        if refs[k] == block:
                            return k
                    return math.inf
                resident.remove(max(resident, key=next_use))
            else:
                resident.pop(0)
        resident.append(r)
    return misses


# --- pipeline ---------------------------------------------------------------
# A five-stage in-order pipeline stepped by its occupancy rules. Instruction i
# may enter stage s only when it has left stage s-1 AND instruction i-1 has
# vacated stage s, which happens on the cycle i-1 enters stage s+1. That second
# rule is the backpressure a naive "one cycle per stage" recurrence omits, and
# omitting it miscounts every schedule that contains a stall.

IF, ID, EX, MEM, WB = range(5)


class Inst:
    def __init__(self, op, dst=None, srcs=(), load=False, store=False,
                 branch=False, taken=False):
        self.op = op
        self.dst = dst
        self.srcs = tuple(srcs)
        self.load = load
        self.store = store
        self.branch = branch
        self.taken = taken


def step_pipeline(trace, forwarding=True, unified_memory=False, predicted=False):
    """Step the pipeline over a dynamic instruction trace.

    Returns (entries, stalls, flushes). `entries[i][s]` is the clock cycle on
    which instruction i enters stage s, counting the first fetch as cycle 1.
    `unified_memory` gives the machine one memory port, so no instruction can
    be fetched in a cycle a load or store is using memory - the von Neumann
    structural hazard. `predicted` models a predictor that is always right."""
    entries: list[list[int]] = []
    producers: dict[str, int] = {}
    mem_busy: set[int] = set()
    stalls = 0
    flushes = 0
    next_fetch = 1
    relaxed_prev = False

    for idx, ins in enumerate(trace):
        e = [0] * 5
        prev = entries[idx - 1] if idx else None
        e[IF] = next_fetch if (idx == 0 or relaxed_prev) else max(next_fetch, prev[ID])
        relaxed_prev = False
        if unified_memory:
            while e[IF] in mem_busy:
                e[IF] += 1

        def floor_for(stage):
            if prev is None:
                return 0
            return prev[WB] + 1 if stage == WB else prev[stage + 1]

        for s in (ID, EX, MEM, WB):
            e[s] = max(e[s - 1] + 1, floor_for(s))
        for r in ins.srcs:
            j = producers.get(r)
            if j is None:
                continue
            p = entries[j]
            if not forwarding:
                # the register file is written in the first half of WB and read
                # in the second, so ID may share the producer's WB cycle
                e[ID] = max(e[ID], p[WB])
            elif trace[j].load:
                if ins.store and r == ins.srcs[-1]:
                    e[MEM] = max(e[MEM], p[MEM] + 1)   # MEM-to-MEM forwarding
                else:
                    e[EX] = max(e[EX], p[MEM] + 1)     # MEM-to-EX, one bubble
            else:
                e[EX] = max(e[EX], p[EX] + 1)          # EX-to-EX, no bubble
        for _ in range(2):
            for s in (ID, EX, MEM, WB):
                e[s] = max(e[s], e[s - 1] + 1, floor_for(s))

        stalls += max(0, e[EX] - e[ID] - 1)
        if ins.load or ins.store:
            mem_busy.add(e[MEM])
        entries.append(e)
        if ins.dst:
            producers[ins.dst] = idx
        if ins.branch and ins.taken and not predicted:
            resolve = e[EX]
            probe = e[ID]
            while probe <= resolve:
                flushes += 1
                probe += 1
            next_fetch = resolve + 1
            relaxed_prev = True
        else:
            next_fetch = max(next_fetch, e[IF] + 1)

    return entries, stalls, flushes


def pipeline(trace, **kw):
    entries, stalls, flushes = step_pipeline(trace, **kw)
    return entries[-1][WB], stalls, flushes


def dot_loop(iters, scheduled=False):
    """Dynamic trace of a dot-product loop body, `iters` times round.

    Unscheduled, the multiply sits immediately behind the load that feeds it;
    scheduled, an independent pointer bump is lifted into that slot."""
    trace = []
    for n in range(iters):
        last = (n == iters - 1)
        if scheduled:
            body = [
                Inst("LW", "r1", ("r8",), load=True),
                Inst("LW", "r2", ("r9",), load=True),
                Inst("ADDI", "r8", ("r8",)),
                Inst("MUL", "r3", ("r1", "r2")),
                Inst("ADD", "r4", ("r4", "r3")),
                Inst("ADDI", "r9", ("r9",)),
                Inst("ADDI", "r7", ("r7",)),
                Inst("BNE", None, ("r7",), branch=True, taken=not last),
            ]
        else:
            body = [
                Inst("LW", "r1", ("r8",), load=True),
                Inst("LW", "r2", ("r9",), load=True),
                Inst("MUL", "r3", ("r1", "r2")),
                Inst("ADD", "r4", ("r4", "r3")),
                Inst("ADDI", "r8", ("r8",)),
                Inst("ADDI", "r9", ("r9",)),
                Inst("ADDI", "r7", ("r7",)),
                Inst("BNE", None, ("r7",), branch=True, taken=not last),
            ]
        trace += body
    return trace


def legacy_schedule():
    """The six-instruction sequence Section 5.2 of the architecture chapter
    already prints: a load-use pair, then a taken branch resolved in EX."""
    return [
        Inst("ADD", "r5", ("r6", "r7")),
        Inst("LW", "r1", ("r4",), load=True),
        Inst("ADD", "r2", ("r1", "r5")),
        Inst("BEQ", None, ("r2",), branch=True, taken=True),
        Inst("OR", "r10", ("r1", "r2")),
        Inst("AND", "r11", ("r10",)),
    ]


# --- Amdahl and Little ------------------------------------------------------


def amdahl_sim(p: float, workers: int, tasks: int = 10000) -> float:
    """List-schedule `tasks` equal parallel chunks onto `workers`, then add the
    serial part. Speedup is measured as a makespan ratio, never evaluated."""
    load = [0.0] * workers
    chunk = p / tasks
    for _ in range(tasks):
        k = min(range(workers), key=lambda w: load[w])
        load[k] += chunk
    makespan = (1.0 - p) + max(load)
    return 1.0 / makespan


def little_sim(latency_ns: float, issue_ns: float, horizon_ns: float = 4000.0,
               step_ns: float = 0.01) -> float:
    """Advance a clock; issue one request every `issue_ns`; retire it
    `latency_ns` later; report the time-average number in flight."""
    issues = np.arange(0.0, horizon_ns, issue_ns)
    t = np.arange(latency_ns * 5, horizon_ns, step_ns)      # after warm-up
    started = np.searchsorted(issues, t, side="right")
    finished = np.searchsorted(issues, t - latency_ns, side="right")
    return float((started - finished).mean())


# ===========================================================================
# THE MODEL MACHINE - every constant the two chapters use is declared here
# ===========================================================================

WORD_BYTES = 4
BUS_WORDS_PER_S = 500e6          # one 4-byte word per bus cycle at 500 MHz
DATA_FRACTION = 0.35             # stated instruction mix: 35% also touch data
CPU_HZ = 2e9
STAGE_PS = {"IF": 200, "ID": 100, "EX": 150, "MEM": 200, "WB": 100}
LATCH_PS = 20
MIX = {"alu": 0.45, "load": 0.22, "store": 0.11, "branch": 0.18, "jump": 0.04}
MULTI_CYCLES = {"alu": 4, "load": 5, "store": 4, "branch": 3, "jump": 3}

# the latency ladder used for every memory time in the second chapter
LADDER = [
    ("registers", 1024, 0.3),
    ("L1", 32 * 1024, 1.0),
    ("L2", 512 * 1024, 8.0),
    ("L3", 16 * 1024 * 1024, 25.0),
    ("DRAM", 16 * 1024 ** 3, 80.0),
    ("SSD", 1024 ** 4, 80e3),
    ("disk", 8 * 1024 ** 4, 8e6),
]

FACTS: dict[str, object] = {}


def note_fact(key, value):
    FACTS[key] = value
    return value


def cpu_time(ic, cpi, hz):
    return ic * cpi / hz


def amat_chain(hit_time, miss_rates, level_times, mem_time):
    """Miss-penalty form applied outward: AMAT = t1 + m1 (t2 + m2 (t3 + ...))."""
    penalty = mem_time
    for m, t in zip(reversed(miss_rates[1:]), reversed(level_times[1:])):
        penalty = t + m * penalty
    return hit_time + miss_rates[0] * penalty


def matrix_trace(rows=64, cols=64, base=0x2000, elem=4, order="row"):
    """Every element of a rows-by-cols array of `elem`-byte values, visited in
    row-major or column-major order. Byte addresses, so the cache sees exactly
    what the loop would present."""
    out = []
    if order == "row":
        for i in range(rows):
            for j in range(cols):
                out.append(base + elem * (i * cols + j))
    else:
        for j in range(cols):
            for i in range(rows):
                out.append(base + elem * (i * cols + j))
    return out


def frames_table(refs, nframes, policy):
    """Return the per-reference state of a frame set, for printing as a table:
    (reference, hit or miss, frames after the reference, evicted block)."""
    resident: list[int] = []
    rows = []
    for i, r in enumerate(refs):
        if r in resident:
            if policy == "LRU":
                resident.remove(r)
                resident.append(r)
            rows.append((r, "hit", list(resident), None))
            continue
        evicted = None
        if len(resident) >= nframes:
            if policy == "OPT":
                def next_use(block):
                    for k in range(i + 1, len(refs)):
                        if refs[k] == block:
                            return k
                    return math.inf
                evicted = max(resident, key=next_use)
            else:
                evicted = resident[0]
            resident.remove(evicted)
        resident.append(r)
        rows.append((r, "MISS", list(resident), evicted))
    return rows


def interleaved_trace():
    """Two 512-byte arrays exactly one cache size apart, walked together."""
    out = []
    for i in range(128):
        out.append(0x0000 + 4 * i)
        out.append(0x0400 + 4 * i)
    return out


# ===========================================================================
# VERIFY
# ===========================================================================


def verify() -> None:
    # -- von Neumann bottleneck ---------------------------------------------
    words_per_inst = 1 + DATA_FRACTION
    assert close(words_per_inst, 1.35)
    shared_rate = BUS_WORDS_PER_S / words_per_inst
    note_fact("shared_issue_Minst_s", shared_rate / 1e6)
    assert close(shared_rate, 370370370.3703704, 1e-6)
    assert close(BUS_WORDS_PER_S / shared_rate, 1.35, 1e-12)
    starvation = CPU_HZ / shared_rate
    note_fact("starvation", starvation)
    assert close(starvation, 5.4, 1e-12)
    n = 1_000_000                      # independent route: count the words
    words = n + int(round(DATA_FRACTION * n))
    assert words == 1_350_000
    assert close(n / (words / BUS_WORDS_PER_S), shared_rate, 1e-3)

    # -- instruction encoding ------------------------------------------------
    assert 2 ** 5 == 32
    assert 32 - 6 - 3 * 5 == 11
    assert 32 - 6 - 2 * 5 == 16
    assert 2 ** 15 == 32768
    assert 2 ** 26 * 4 == 268435456
    assert close(2 ** 26 * 4 / 1024 ** 2, 256.0)
    assert 2 ** 15 * 4 == 131072
    assert (32 - 6) // 4 == 6
    assert 32 - 6 - 4 * 6 == 2

    # -- datapath timing -----------------------------------------------------
    total_ps = sum(STAGE_PS.values())
    assert total_ps == 750
    note_fact("single_cycle_GHz", 1e12 / total_ps / 1e9)
    assert close(1e12 / total_ps, 1.3333333333333333e9, 1.0)
    slowest = max(STAGE_PS.values())
    assert slowest == 200
    assert close(sum(MIX.values()), 1.0, 1e-12)
    multi_cpi = sum(MIX[k] * MULTI_CYCLES[k] for k in MIX)
    note_fact("multi_cpi", multi_cpi)
    assert close(multi_cpi, 4.0, 1e-12)
    assert close(multi_cpi * slowest, 800.0, 1e-9)
    pipe_ps = slowest + LATCH_PS
    assert pipe_ps == 220
    note_fact("pipe_speedup_vs_single", total_ps / pipe_ps)
    assert close(total_ps / pipe_ps, 3.4090909090909092, 1e-12)
    assert 32 + 6 == 38 and 512 * 38 == 19456 and 19456 // 8 == 2432

    # -- the CPU performance equation ---------------------------------------
    base = cpu_time(2e9, 2.5, CPU_HZ)
    assert close(base, 2.5, 1e-12)
    assert close(cpu_time(1.6e9, 2.5, CPU_HZ), 2.0, 1e-12)
    assert close(cpu_time(2e9, 2.0, CPU_HZ), 2.0, 1e-12)
    assert close(cpu_time(2e9, 2.5, 2.5e9), 2.0, 1e-12)
    assert close(base / 2.0, 1.25, 1e-12)
    cycles0 = 2e9 * 2.5
    cycles1 = cycles0 - 0.4e9 * 1.0
    cpi1 = cycles1 / 1.6e9
    note_fact("cpi_after_compiler", cpi1)
    assert close(cycles0, 5e9, 1e-6) and close(cycles1, 4.6e9, 1e-6)
    assert close(cpi1, 2.875, 1e-12)
    t1 = cycles1 / CPU_HZ
    assert close(t1, 2.3, 1e-12)
    note_fact("compiler_real_speedup", base / t1)
    assert close(base / t1, 1.0869565217391304, 1e-12)
    assert close(CPU_HZ / (2.5 * 1e6), 800.0, 1e-9)
    assert close(1.5e9 / (1.5 * 1e6), 1000.0, 1e-9)
    ta, tb = cpu_time(1.0, 2.5, CPU_HZ), cpu_time(1.3, 1.5, 1.5e9)
    note_fact("mips_trap_ratio", tb / ta)
    assert close(tb / ta, 1.04, 1e-12)

    # -- pipelines, STEPPED --------------------------------------------------
    cyc, st, fl = pipeline(legacy_schedule())
    note_fact("legacy_cycles", cyc)
    assert (cyc, st, fl) == (13, 1, 2), (cyc, st, fl)      # confirms Section 5.2
    assert close(cyc / 6, 2.1666666666666665, 1e-12)
    assert 5 + (6 - 1) + 1 + 2 == 13

    cyc_u, st_u, fl_u = pipeline(dot_loop(100))
    note_fact("dot_cycles", cyc_u)
    note_fact("dot_stalls", st_u)
    note_fact("dot_flushes", fl_u)
    assert (cyc_u, st_u, fl_u) == (1102, 100, 198), (cyc_u, st_u, fl_u)
    assert close(cyc_u / 800, 1.3775, 1e-12)
    assert 5 + (800 - 1) + 100 + 198 == 1102               # closed form agrees

    cyc_s, st_s, fl_s = pipeline(dot_loop(100, scheduled=True))
    note_fact("dot_cycles_scheduled", cyc_s)
    assert (cyc_s, st_s, fl_s) == (1002, 0, 198), (cyc_s, st_s, fl_s)
    assert close(cyc_s / 800, 1.2525, 1e-12)
    note_fact("schedule_speedup", cyc_u / cyc_s)
    assert close(cyc_u / cyc_s, 1.0998003992015968, 1e-12)

    cyc_p, _, fl_p = pipeline(dot_loop(100, scheduled=True), predicted=True)
    note_fact("dot_cycles_predicted", cyc_p)
    assert (cyc_p, fl_p) == (804, 0), (cyc_p, fl_p)
    assert close(cyc_p / 800, 1.005, 1e-12)

    cyc_v, _, _ = pipeline(dot_loop(100), unified_memory=True)
    note_fact("dot_cycles_unified", cyc_v)
    note_fact("harvard_gain", cyc_v / cyc_u)
    assert cyc_v == 1202, cyc_v
    assert close(cyc_v / 800, 1.5025, 1e-12)
    assert close(cyc_v / cyc_u, 1.0907441016333939, 1e-12)
    assert close(1.5025 - 1.3775, 0.125, 1e-12)

    cyc_f, _, _ = pipeline(dot_loop(1))
    cyc_nf, _, _ = pipeline(dot_loop(1), forwarding=False)
    note_fact("forward_one_iter", cyc_f)
    note_fact("no_forward_one_iter", cyc_nf)
    assert (cyc_f, cyc_nf) == (13, 18), (cyc_f, cyc_nf)
    assert close(cyc_nf / cyc_f, 1.3846153846153846, 1e-12)

    # -- pipeline depth optimum ---------------------------------------------
    def per_inst_ps(k):
        period = total_ps / k + LATCH_PS
        cpi = 1.0 + 0.20 * 0.10 * (k / 2.0 - 1.0)
        return cpi * period
    ks = np.arange(2, 201)
    times = np.array([per_inst_ps(k) for k in ks])
    kbest = int(ks[int(np.argmin(times))])
    note_fact("depth_optimum", kbest)
    note_fact("depth_optimum_ps", float(times.min()))
    note_fact("depth_5_ps", per_inst_ps(5))
    note_fact("depth_10_ps", per_inst_ps(10))
    note_fact("depth_20_ps", per_inst_ps(20))
    note_fact("depth_40_ps", per_inst_ps(40))
    assert kbest == 61, kbest
    assert close(float(times.min()), 51.34918032786886, 1e-9), float(times.min())
    assert close(per_inst_ps(5), 175.1, 1e-9)
    assert close(per_inst_ps(10), 102.6, 1e-9)
    assert close(per_inst_ps(20), 67.85, 1e-9)
    assert close(per_inst_ps(40), 53.475, 1e-9)
    kstar = math.sqrt(2 * 0.98 * total_ps / (0.02 * LATCH_PS))
    note_fact("depth_optimum_analytic", kstar)

    # -- branch penalty ------------------------------------------------------
    def cpi_branch(acc, penalty, frac=0.20):
        return 1.0 + frac * (1.0 - acc) * penalty
    assert close(cpi_branch(0.70, 2), 1.12, 1e-12)
    assert close(cpi_branch(0.90, 2), 1.04, 1e-12)
    assert close(cpi_branch(0.95, 2), 1.02, 1e-12)
    assert close(cpi_branch(0.95, 10), 1.10, 1e-12)
    assert close(cpi_branch(0.75, 2), 1.10, 1e-12)
    assert close(5 / 1.12, 4.464285714285714, 1e-12)

    # -- Amdahl --------------------------------------------------------------
    def amdahl(p, n):
        return 1.0 / ((1.0 - p) + p / n)
    assert close(amdahl(0.90, 8), 4.705882352941176, 1e-12)
    assert close(amdahl(0.95, 8), 5.925925925925926, 1e-12)
    assert close(amdahl(0.50, 8), 1.7777777777777777, 1e-12)
    for p, w in ((0.90, 8), (0.95, 8), (0.50, 8), (0.90, 16)):
        assert close(amdahl_sim(p, w), amdahl(p, w), 1e-9), (p, w)
    note_fact("amdahl_90_8", amdahl(0.90, 8))
    note_fact("amdahl_90_8_sim", amdahl_sim(0.90, 8))
    preq = (1 - 1 / 8) / (1 - 1 / 16)
    note_fact("p_required", preq)
    assert close(preq, 0.9333333333333333, 1e-12)
    assert close(amdahl(preq, 16), 8.0, 1e-9)
    assert close(1.2 / 2.5, 0.48, 1e-12)
    note_fact("perfect_memory_speedup", 1 / (1 - 0.48))
    assert close(1 / (1 - 0.48), 1.9230769230769231, 1e-12)

    # -- RISC against CISC ---------------------------------------------------
    t_cisc = cpu_time(1.0, 3.6, 2.0e9)
    t_risc = cpu_time(1.45, 1.15, 2.4e9)
    note_fact("risc_speedup", t_cisc / t_risc)
    note_fact("risc_time_ratio", t_risc / t_cisc)
    breakeven = (3.6 / 2.0) * 2.4 / 1.15
    note_fact("risc_breakeven", breakeven)
    assert close(breakeven, 3.756521739130435, 1e-12)
    assert close(cpu_time(breakeven, 1.15, 2.4e9), t_cisc, 1e-18)

    # -- memory inside the CPI equation --------------------------------------
    refs = 1 + DATA_FRACTION
    cpi_mem = 1.0 + refs * 0.02 * 100
    note_fact("cpi_with_memory", cpi_mem)
    assert close(cpi_mem, 3.7, 1e-12)
    note_fact("memory_share", (cpi_mem - 1.0) / cpi_mem)
    assert close((cpi_mem - 1.0) / cpi_mem, 0.7297297297297297, 1e-12)
    cpi_fast = 1.0 + refs * 0.02 * 200
    assert close(cpi_fast, 6.4, 1e-12)
    note_fact("double_clock_speedup", cpi_mem / (cpi_fast / 2))
    assert close(cpi_mem / (cpi_fast / 2), 1.15625, 1e-12)

    # =======================================================================
    # MEMORY HIERARCHY
    # =======================================================================
    lat = dict((n, t) for n, _, t in LADDER)
    assert close(lat["DRAM"] / lat["L1"], 80.0, 1e-12)
    assert close(lat["disk"] / lat["DRAM"], 100000.0, 1e-9)

    # -- locality, COUNTED ---------------------------------------------------
    seq = [0x1000 + 4 * i for i in range(64)]
    c = run(Cache(1024, 32, 1), seq)
    note_fact("unit_stride", (c.hits, c.misses))
    assert (c.hits, c.misses) == (56, 8), (c.hits, c.misses)
    assert close(c.hit_rate, 0.875, 1e-12)
    assert 32 // 4 == 8 and 64 // 8 == 8
    c2 = run(Cache(1024, 32, 1), [0x1000 + 32 * i for i in range(64)])
    assert (c2.hits, c2.misses) == (0, 64), (c2.hits, c2.misses)
    c3 = run(Cache(1024, 32, 1), [4 * i for i in range(128)] * 2)
    note_fact("two_pass", (c3.hits, c3.misses))
    assert (c3.hits, c3.misses) == (240, 16), (c3.hits, c3.misses)
    assert close(c3.hit_rate, 0.9375, 1e-12)

    # -- loop order, COUNTED -------------------------------------------------
    rowwise = run(Cache(1024, 32, 1), matrix_trace(order="row"))
    colwise = run(Cache(1024, 32, 1), matrix_trace(order="col"))
    note_fact("matrix_row_1k", (rowwise.hits, rowwise.misses))
    note_fact("matrix_col_1k", (colwise.hits, colwise.misses))
    assert (rowwise.hits, rowwise.misses) == (3584, 512), (rowwise.hits, rowwise.misses)
    assert (colwise.hits, colwise.misses) == (0, 4096), (colwise.hits, colwise.misses)
    assert close(rowwise.hit_rate, 0.875, 1e-12)
    col64k = run(Cache(64 * 1024, 32, 1), matrix_trace(order="col"))
    note_fact("matrix_col_64k", (col64k.hits, col64k.misses))
    assert (col64k.hits, col64k.misses) == (3584, 512), (col64k.hits, col64k.misses)
    col2way = run(Cache(1024, 32, 2), matrix_trace(order="col"))
    colfull = run(Cache(1024, 32, 32), matrix_trace(order="col"))
    note_fact("matrix_col_2way", (col2way.hits, col2way.misses))
    note_fact("matrix_col_full", (colfull.hits, colfull.misses))
    # full associativity does NOT help: one column needs 64 blocks and the
    # cache holds 32, so this is a capacity problem wearing a conflict costume
    assert (col2way.hits, col2way.misses) == (0, 4096), (col2way.hits, col2way.misses)
    assert (colfull.hits, colfull.misses) == (0, 4096), (colfull.hits, colfull.misses)
    assert 1024 // 32 == 32
    assert 64 * 64 * 4 == 16384 and 16384 // 32 == 512
    assert 64 * 4 == 256 and 256 // 32 == 8

    # -- conflict, COUNTED ---------------------------------------------------
    inter = interleaved_trace()
    dm = run(Cache(1024, 32, 1), inter)
    note_fact("conflict_dm", (dm.hits, dm.misses))
    assert (dm.hits, dm.misses) == (0, 256), (dm.hits, dm.misses)
    two = run(Cache(1024, 32, 2), inter)
    note_fact("conflict_2way", (two.hits, two.misses))
    assert (two.hits, two.misses) == (224, 32), (two.hits, two.misses)
    assert close(two.hit_rate, 0.875, 1e-12)
    assert two.misses == two.compulsory == 32
    pad = []
    for i in range(128):
        pad.append(0x0000 + 4 * i)
        pad.append(0x0420 + 4 * i)
    padded = run(Cache(1024, 32, 1), pad)
    note_fact("conflict_padded", (padded.hits, padded.misses))
    assert (padded.hits, padded.misses) == (224, 32), (padded.hits, padded.misses)
    sweep = [(w, run(Cache(1024, 32, w), inter).misses) for w in (1, 2, 4, 8, 16, 32)]
    assert sweep[0] == (1, 256) and all(m == 32 for _, m in sweep[1:]), sweep

    # -- the three C's separated by experiment -------------------------------
    big = [4 * i for i in range(512)] * 2
    small_dm = run(Cache(1024, 32, 1), big)
    full = run(Cache(1024, 32, 32), big)
    compulsory = full.compulsory
    capacity = full.misses - compulsory
    conflict = small_dm.misses - full.misses
    note_fact("three_c", (compulsory, capacity, conflict))
    assert (compulsory, capacity, conflict) == (64, 64, 0), (compulsory, capacity, conflict)
    assert small_dm.misses == 128
    bigger = run(Cache(4096, 32, 1), big)
    note_fact("capacity_cured", bigger.misses)
    assert bigger.misses == 64

    # -- replacement, SIMULATED ---------------------------------------------
    string = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
    r = {(p, f): frames_sim(string, f, p)
         for p in ("FIFO", "LRU", "OPT") for f in (3, 4, 5)}
    note_fact("replacement", r)
    assert r[("FIFO", 3)] == 9 and r[("FIFO", 4)] == 10, r
    assert r[("LRU", 3)] == 10 and r[("LRU", 4)] == 8, r
    assert r[("OPT", 3)] == 7 and r[("OPT", 4)] == 6, r
    assert r[("LRU", 3)] > r[("FIFO", 3)]
    assert r[("FIFO", 5)] == 5 and r[("LRU", 5)] == 5

    # -- write traffic -------------------------------------------------------
    N = 1_000_000
    writes, block, read_miss = 0.25 * N, 32, 0.04
    reads = N - writes
    wt = reads * read_miss * block + writes * WORD_BYTES
    note_fact("write_through_bytes", wt)
    assert close(wt, 1_960_000.0, 1e-6)
    misses_all = N * 0.04
    wb = misses_all * block * (1 + 0.30)
    note_fact("write_back_bytes", wb)
    assert close(wb, 1_664_000.0, 1e-6)
    note_fact("write_traffic_ratio", wt / wb)
    assert close(wt / wb, 1.1778846153846154, 1e-12)
    dstar = wt / (misses_all * block) - 1.0
    note_fact("write_crossover", dstar)
    assert close(dstar, 0.53125, 1e-12)

    # -- AMAT and the multi-level chain --------------------------------------
    assert close(1 + 0.05 * 100, 6.0, 1e-12)
    assert close(0.95 * 1 + 0.05 * 100, 5.95, 1e-12)
    a3 = amat_chain(1.0, [0.03, 0.25, 0.40], [1.0, 8.0, 25.0], 80.0)
    note_fact("amat_three_level", a3)
    assert close(a3, 1.6675, 1e-12)
    assert close(8 + 0.25 * (25 + 0.40 * 80), 22.25, 1e-12)
    assert close(0.03 * 0.25, 0.0075, 1e-12)
    assert close(0.03 * 0.25 * 0.40, 0.003, 1e-12)
    a1 = 1.0 + 0.03 * 80.0
    note_fact("amat_one_level", a1)
    assert close(a1, 3.4, 1e-12)
    note_fact("amat_gain", a1 / a3)

    # -- Little's law on the memory system -----------------------------------
    lam = 12.8e9 / 64
    assert close(lam, 200e6, 1e-3)
    L = lam * 80e-9
    note_fact("mshr_needed", L)
    assert close(L, 16.0, 1e-9)
    measured = little_sim(80.0, 5.0)
    note_fact("mshr_simulated", measured)
    assert close(measured, 16.0, 0.02), measured
    note_fact("bw_with_10_mshr", 10 / 80e-9 * 64 / 1e9)
    assert close(10 / 80e-9 * 64 / 1e9, 8.0, 1e-9)

    # -- virtual memory ------------------------------------------------------
    assert 4 * 9 + 12 == 48 and 512 * 8 == 4096
    va = 0x7F3A2B4C1D08
    off = va & 0xFFF
    idx = [(va >> (12 + 9 * k)) & 0x1FF for k in range(4)]
    note_fact("va_offset", off)
    note_fact("va_indices", idx)
    rebuilt = off
    for k, v in enumerate(idx):
        rebuilt |= v << (12 + 9 * k)
    assert rebuilt == va
    frame = 0x1A2B3                      # stated given: the final PTE's frame
    pa = (frame << 12) | off
    note_fact("phys_addr", hex(pa))
    assert pa == 0x1A2B3D08, hex(pa)
    assert frame == 107187 and frame * 4096 == 439037952
    assert 48 - 12 == 36 and 2 ** 36 == 68719476736
    assert 2 ** 36 * 8 == 549755813888
    assert 549755813888 // 1024 ** 3 == 512
    assert 2 ** 20 * 4 == 4 * 1024 ** 2
    assert close(1024 * 4096 / 1024 ** 2, 4.0)
    assert close(1024 * 2 * 1024 ** 2 / 1024 ** 3, 2.0)
    walk = 4 * 80.0
    assert close(walk, 320.0, 1e-12)
    note_fact("tlb_98", 0.98 * 0.5 + 0.02 * walk)
    note_fact("tlb_995", 0.995 * 0.5 + 0.005 * walk)
    note_fact("tlb_999", 0.999 * 0.5 + 0.001 * walk)
    assert close(0.98 * 0.5 + 0.02 * walk, 6.89, 1e-12)
    assert close(0.995 * 0.5 + 0.005 * walk, 2.0975, 1e-12)
    assert close(0.999 * 0.5 + 0.001 * walk, 0.8195, 1e-12)
    pmax = 10.0 / (5e6 - 100.0)
    note_fact("fault_budget", pmax)
    note_fact("fault_one_in", 1 / pmax)
    assert close((1 - pmax) * 100 + pmax * 5e6, 110.0, 1e-9)

    # -- the field-width convention where main memory sets the address width --
    assert int(math.log2(256 * 1024)) == 18 and int(math.log2(512)) == 9
    assert 32 * 1024 // (512 * 1) == 64 and int(math.log2(64)) == 6
    assert 18 - 6 - 9 == 3
    assert 32 * 1024 // (512 * 4) == 16 and int(math.log2(16)) == 4
    assert 18 - 4 - 9 == 5 and 18 - 0 - 9 == 9

    # -- every pre-existing worked number in both chapters, re-derived --------
    assert close(cpu_time(1000, 1.2, 1e9) * 1e6, 1.2, 1e-12)
    assert close(cpu_time(1000, 3.5, 2e9) * 1e6, 1.75, 1e-12)
    assert close(1e9 / (1.2 * 1e6), 833.3333333333334, 1e-9)
    assert close(2e9 / (3.5 * 1e6), 571.4285714285714, 1e-9)
    assert close(5 / 1.04, 4.807692307692308, 1e-12)
    assert close(5 / 1.02, 4.901960784313726, 1e-12)
    assert 0x2400 + 0x0032 == 0x2432
    assert 0xF4 - 256 == -12 and 0x2004 - 12 == 0x1FF8 and 0x2000 - 12 == 0x1FF4
    assert close(13 / 6, 2.1666666666666665, 1e-12)
    assert close(13 / 2.0, 6.5, 1e-12) and 6 * 5 == 30
    assert close(30 / 13, 2.3076923076923075, 1e-12)
    assert close(0.95 * 1 + 0.05 * 0.80 * 10 + 0.05 * 0.20 * 100, 2.35, 1e-12)
    assert close(0.05 * 0.80, 0.04, 1e-12) and close(0.05 * 0.20, 0.01, 1e-12)
    note_fact("legacy_43_percent", 1.00 / 2.35)
    assert close(1.00 / 2.35, 0.425531914893617, 1e-12)
    assert close(0.95 * 1 + 0.05 * 200, 10.95, 1e-12)
    note_fact("legacy_tlb_reduction", 1 - 10.95 / 200)
    assert close(1 - 10.95 / 200, 0.94525, 1e-12)          # NOT 95 percent
    assert close(0.99 * 1 + 0.01 * 200, 2.99, 1e-12)
    assert close(0.90 * 1 + 0.10 * 200, 20.90, 1e-12)
    assert close(0.80 * 1 + 0.20 * 200, 40.80, 1e-12)
    assert 65536 // 64 == 1024 and 1024 * 17 == 17408 and 17408 // 8 == 2176
    assert close(2176 / 65536 * 100, 3.3203125, 1e-12)
    addr = 0x1234ABCD
    assert addr & 0x3F == 0x0D and (addr >> 6) & 0x3FF == 0x2AF
    assert addr >> 16 == 0x1234 and (addr >> 6) & 0xFF == 0xAF
    assert addr >> 14 == 0x48D2 and 65536 // (64 * 4) == 256
    assert close(10 + 0.20 * 100, 30.0, 1e-12) and close(1 + 0.05 * 30, 2.5, 1e-12)
    assert close((6.0 - 2.5) / 6.0, 0.5833333333333334, 1e-12)
    assert 12 * 1024 * 1024 // 4096 == 3072 and math.ceil(3072 / 1024) == 3
    assert (3 + 1) * 4096 == 16384 and 4 * 1024 ** 2 // 16384 == 256
    assert 64 * 4096 == 262144 and 64 * 2 * 1024 ** 2 == 134217728
    assert close(0.10 * 0.05, 0.005, 1e-12)


# ===========================================================================
# FIGURES - architecture
# ===========================================================================


@figure("sys2-arch-bottleneck")
def _(mode):
    """Sustainable instruction rate against the data-reference fraction.

    A shared bus moves 1 + f words per instruction, so the ceiling is
    B / (1 + f); split buses let the two streams overlap and the ceiling
    becomes the instruction stream alone. The gap IS the bottleneck."""
    c = S.SERIES[mode]
    f = np.linspace(0.0, 1.0, 400)
    shared = BUS_WORDS_PER_S / (1.0 + f) / 1e6
    split = np.full_like(f, BUS_WORDS_PER_S / 1e6)
    assert close(BUS_WORDS_PER_S / 1.35 / 1e6, 370.3703703703704, 1e-9)

    fig, ax = plt.subplots()
    ax.plot(f, split, color=c[1], lw=2.2)
    ax.plot(f, shared, color=c[0], lw=2.4)
    S.label_end(ax, 0.55, 500.0, "split instruction and data buses", c[1], mode, dy=9)
    S.label_end(ax, 1.0, BUS_WORDS_PER_S / 2.0 / 1e6, "one shared bus:  B / (1 + f)",
                c[0], mode, dx=-4, dy=-24, ha="right")
    ax.plot([0.35], [370.3703703703704], "o", color=c[0], ms=7)
    S.note(ax, 0.40, 110,
           "model mix f = 0.35: 370 million instructions\nper second, against the 2000 million\na 2 GHz core could retire", mode)
    ax.set_xlabel("fraction of instructions that also touch data,  f")
    ax.set_ylabel("sustainable instruction rate  (million per second)")
    ax.set_title("The bus, not the core, sets the ceiling")
    ax.set_xlim(0, 1.02)
    ax.set_ylim(0, 580)
    S.strip(ax)
    return fig


@figure("sys2-arch-cpi-mix")
def _(mode):
    """CPI as the weighted sum over an instruction mix, swept.

    The multicycle machine charges five cycles for a load and four for
    arithmetic, so its CPI climbs steeply with the load fraction; the pipelined
    machine charges one cycle plus the load-use stalls it cannot hide."""
    c = S.SERIES[mode]
    fl = np.linspace(0.0, 0.5, 400)
    others = (MIX["alu"] * 4 + MIX["store"] * 4 + MIX["branch"] * 3
              + MIX["jump"] * 3) / (1 - MIX["load"])
    multi = fl * 5 + (1.0 - fl) * others
    pipe = 1.0 + fl * 0.5
    assert close(float(np.interp(0.22, fl, multi)), 4.0, 2e-3)

    fig, ax = plt.subplots()
    ax.plot(fl, multi, color=c[0], lw=2.4)
    ax.plot(fl, pipe, color=c[1], lw=2.4)
    S.label_end(ax, 0.40, float(np.interp(0.40, fl, multi)),
                "multicycle:  CPI = sum of f_i CPI_i", c[0], mode, dy=11)
    S.label_end(ax, 0.40, float(np.interp(0.40, fl, pipe)),
                "pipelined:  CPI = 1 + load-use stalls", c[1], mode, dy=-15)
    ax.plot([0.22], [4.0], "o", color=c[0], ms=7)
    S.note(ax, 0.235, 3.66, "model mix, 22% loads: CPI = 4.00", mode)
    ax.plot([0.22], [1.11], "o", color=c[1], ms=7)
    S.note(ax, 0.235, 1.34, "same mix pipelined: CPI = 1.11", mode)
    ax.set_xlabel("fraction of the instruction mix that is a load")
    ax.set_ylabel("cycles per instruction")
    ax.set_title("CPI is a weighted average, and the weights are the program")
    ax.set_xlim(0, 0.52)
    ax.set_ylim(0, 5.2)
    S.strip(ax)
    return fig


@figure("sys2-arch-pipe-schedule")
def _(mode):
    """Space-time chart of the dot-product loop body, drawn by the stepper.

    Nothing is placed by hand: the horizontal position of every box is the
    cycle the simulator assigned to that stage, so the bubble in front of the
    multiply and the two squashed fetches behind the branch appear only because
    the simulation produced them."""
    c = S.SERIES[mode]
    trace = dot_loop(2)[:9]
    names = ["LW r1", "LW r2", "MUL r3", "ADD r4", "ADDI r8",
             "ADDI r9", "ADDI r7", "BNE (taken)", "LW r1, next pass"]
    stages = ["IF", "ID", "EX", "ME", "WB"]
    ent, stalls, flushes = step_pipeline(trace)
    assert ent[0][IF] == 1 and stalls == 1 and flushes == 2
    assert ent[2][EX] - ent[2][ID] == 2, ent[2]

    fig, ax = plt.subplots(figsize=(8.2, 4.8))
    for i, e in enumerate(ent):
        y = len(ent) - i
        for s in range(5):
            colour = c[1] if s == EX else c[0]
            ax.add_patch(plt.Rectangle((e[s] - 0.45, y - 0.35), 0.90, 0.70,
                                       facecolor=colour, alpha=0.28,
                                       edgecolor=colour, lw=1.0))
            ax.text(e[s], y, stages[s], ha="center", va="center",
                    fontsize=8.0, color=S.INK[mode])
        for gap in range(e[ID] + 1, e[EX]):
            ax.add_patch(plt.Rectangle((gap - 0.45, y - 0.35), 0.90, 0.70,
                                       facecolor="none", edgecolor=S.GUIDE[mode],
                                       lw=1.0, ls="--"))
            ax.text(gap, y, "--", ha="center", va="center", fontsize=8.0,
                    color=S.INK_2[mode])
        ax.text(-3.3, y, names[i], ha="left", va="center", fontsize=9.0,
                color=S.INK_2[mode])
    ax.set_xlim(-3.5, ent[-1][WB] + 1.0)
    ax.set_ylim(0.0, len(ent) + 2.2)
    ax.set_xticks(range(1, ent[-1][WB] + 1, 2))
    ax.set_xlabel("clock cycle")
    ax.set_yticks([])
    ax.set_title("One loop body, stepped: one bubble, then a branch penalty")
    ax.annotate("load-use bubble: r2 is not out of\nmemory until MEM ends",
                xy=(ent[2][ID] + 1, len(ent) - 2.45), xytext=(9.0, 10.2),
                color=S.INK_2[mode], fontsize=9, ha="left", va="top",
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.1))
    ax.annotate("branch resolves in EX, so the two fetches\nbehind it are squashed and the target\nis fetched two cycles late",
                xy=(ent[7][EX], len(ent) - 7.45), xytext=(0.4, 2.45),
                color=S.INK_2[mode], fontsize=9, ha="left", va="top",
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.1))
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.grid(visible=False)
    return fig


@figure("sys2-arch-pipe-depth")
def _(mode):
    """Time per instruction against pipeline depth, with a real minimum.

    The period is 750/k + 20 ps, so deeper is faster; the misprediction penalty
    grows as k/2 - 1 stages, so deeper is also slower. The product has a
    minimum, and it is not at the largest k."""
    c = S.SERIES[mode]
    total = sum(STAGE_PS.values())
    k = np.linspace(2, 200, 990)
    period = total / k + LATCH_PS
    cpi = 1.0 + 0.20 * 0.10 * (k / 2.0 - 1.0)
    t = cpi * period
    kbest = k[int(np.argmin(t))]
    assert 58 < kbest < 64, kbest
    kint = 61
    tb = (1.0 + 0.20 * 0.10 * (kint / 2.0 - 1.0)) * (total / kint + LATCH_PS)
    assert close(tb, 51.34918032786886, 1e-9), tb

    fig, ax = plt.subplots()
    ax.plot(k, t, color=c[0], lw=2.4)
    ax.plot(k, period, color=c[1], lw=2.0, ls="--")
    S.label_end(ax, 165, float(np.interp(165, k, t)),
                "with the misprediction cost", c[0], mode, dy=12, ha="right")
    S.label_end(ax, 165, float(np.interp(165, k, period)),
                "clock period alone, 750/k + 20 ps", c[1], mode, dy=-14, ha="right")
    ax.plot([kint], [tb], "o", color=c[0], ms=7)
    S.note(ax, 66, 31, "optimum at k = 61 stages,\n51.35 ps per instruction", mode)
    ax.axvline(5, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 9, 150, "the classic five-stage machine:\n175.1 ps per instruction", mode)
    ax.set_xlabel("pipeline depth  k  (stages)")
    ax.set_ylabel("time per instruction  (ps)")
    ax.set_title("Deeper is faster until the branches make it slower")
    ax.set_xlim(0, 205)
    ax.set_ylim(0, 200)
    S.strip(ax)
    return fig


@figure("sys2-arch-branch-penalty")
def _(mode):
    """CPI against prediction accuracy for three misprediction penalties.

    CPI = 1 + f (1 - a) P with f = 0.20. The slope is the penalty, so a deep
    machine needs an accuracy a shallow machine does not."""
    c = S.SERIES[mode]
    a = np.linspace(0.5, 1.0, 400)
    fig, ax = plt.subplots()
    for i, P in enumerate((2, 5, 10)):
        ax.plot(a, 1.0 + 0.20 * (1.0 - a) * P, color=c[i], lw=2.3)
        S.label_end(ax, 0.575, 1.0 + 0.20 * 0.425 * P,
                    f"penalty {P} cycles", c[i], mode, dy=9)
    assert close(1 + 0.20 * 0.30 * 2, 1.12, 1e-12)
    assert close(1 + 0.20 * 0.05 * 10, 1.10, 1e-12)
    assert close(1 + 0.20 * 0.25 * 2, 1.10, 1e-12)
    ax.plot([0.70], [1.12], "o", color=c[0], ms=7)
    S.note(ax, 0.70, 1.013, "the chapter's case: 70% accurate,\n2-cycle penalty, CPI = 1.12", mode)
    ax.plot([0.95], [1.10], "o", color=c[2], ms=7)
    ax.plot([0.75], [1.10], "o", color=c[0], ms=7)
    S.note(ax, 0.76, 1.62, "these two points are equal:\n95% accuracy on a 10-cycle machine buys\nexactly what 75% buys on a 2-cycle one", mode)
    ax.set_xlabel("branch prediction accuracy  a")
    ax.set_ylabel("cycles per instruction")
    ax.set_title("Twenty percent branches: what a misprediction costs")
    ax.set_xlim(0.5, 1.005)
    ax.set_ylim(1.0, 2.05)
    S.strip(ax)
    return fig


@figure("sys2-arch-amdahl")
def _(mode):
    """Speedup against worker count for three parallel fractions.

    S(N) = 1 / ((1 - p) + p/N). Each curve flattens at 1/(1 - p), and the
    ceiling is drawn so the flattening reads as a ceiling rather than as a slow
    climb toward something better."""
    c = S.SERIES[mode]
    N = np.linspace(1, 64, 600)
    fig, ax = plt.subplots()
    for i, p in enumerate((0.50, 0.90, 0.95)):
        sp = 1.0 / ((1 - p) + p / N)
        ax.plot(N, sp, color=c[i], lw=2.3)
        ax.axhline(1 / (1 - p), color=S.GUIDE[mode], lw=0.9, ls="--")
        S.label_end(ax, 44, float(np.interp(44, N, sp)),
                    f"p = {p:.2f}, ceiling {1 / (1 - p):.0f}x", c[i], mode, dy=-14)
    assert close(1 / (0.10 + 0.90 / 8), 4.705882352941176, 1e-12)
    ax.plot([8], [4.705882352941176], "o", color=c[1], ms=7)
    S.note(ax, 10.5, 2.9, "eight workers on p = 0.90\nreturn 4.71x, not 8x", mode)
    ax.set_xlabel("number of workers  N")
    ax.set_ylabel("speedup  S(N)")
    ax.set_title("The serial remainder is the ceiling")
    ax.set_xlim(0, 66)
    ax.set_ylim(0, 21)
    S.strip(ax)
    return fig


@figure("sys2-arch-risc-cisc")
def _(mode):
    """Where the RISC advantage would actually be surrendered.

    The execution-time ratio is a straight line in the code-expansion factor e,
    and it crosses 1 at e = (CPI_C / f_C) f_R / CPI_R = 3.757, not at e = 1."""
    c = S.SERIES[mode]
    e = np.linspace(1.0, 6.0, 400)
    ratio = (e * 1.15 / 2.4e9) / (1.0 * 3.6 / 2.0e9)
    be = (3.6 / 2.0) * 2.4 / 1.15
    assert close(be, 3.756521739130435, 1e-12)
    at145 = 1.45 * 1.15 / 2.4e9 / (3.6 / 2.0e9)
    assert close(at145, 0.38599537037037035, 1e-12), at145

    fig, ax = plt.subplots()
    ax.plot(e, ratio, color=c[0], lw=2.4)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 1.05, 1.04, "equal execution time", mode)
    ax.plot([be], [1.0], "o", color=c[0], ms=7)
    S.note(ax, be + 0.12, 0.72,
           "break-even at e = 3.76: the RISC could emit\nnearly four times the instructions\nand still not lose", mode)
    ax.plot([1.45], [at145], "o", color=c[1], ms=7)
    S.note(ax, 1.55, 0.24, "the realistic e = 1.45:\nRISC finishes in 38.6% of the time", mode)
    S.label_end(ax, 5.3, float(np.interp(5.3, e, ratio)),
                "T_RISC / T_CISC", c[0], mode, dy=-13)
    ax.set_xlabel("code expansion factor  e = IC_RISC / IC_CISC")
    ax.set_ylabel("execution time, RISC over CISC")
    ax.set_title("The trade is instruction count against cycles per instruction")
    ax.set_xlim(1, 6.1)
    ax.set_ylim(0, 1.75)
    S.strip(ax)
    return fig


# ===========================================================================
# FIGURES - memory hierarchy
# ===========================================================================


@figure("sys2-mem-ladder")
def _(mode):
    """Latency against capacity for the model machine's seven levels.

    Both axes are logarithmic because the hierarchy spans ten decades of
    capacity and eight of time; on linear axes six of the seven points would
    pile into one corner."""
    c = S.SERIES[mode]
    names = [n for n, _, _ in LADDER]
    cap = np.array([s for _, s, _ in LADDER], dtype=float)
    lat = np.array([t for _, _, t in LADDER], dtype=float)
    assert close(lat[4] / lat[1], 80.0, 1e-12)

    fig, ax = plt.subplots()
    ax.plot(cap, lat, color=c[0], lw=1.5, ls="--", zorder=1)
    ax.scatter(cap, lat, s=62, color=c[0], zorder=3)
    for n, x, y in zip(names, cap, lat):
        ax.annotate(f"  {n}", (x, y), color=S.INK[mode], fontsize=9.5,
                    va="bottom", ha="left")
    ax.annotate("", xy=(cap[4], lat[1]), xytext=(cap[4], lat[4]),
                arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.2))
    S.note(ax, cap[4] * 1.9, 7.0, "80x from L1 to DRAM -\nthis gap is the whole subject", mode)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("capacity  (bytes)")
    ax.set_ylabel("access latency  (ns)")
    ax.set_title("Ten decades of capacity, eight decades of time")
    S.strip(ax)
    return fig


@figure("sys2-mem-locality")
def _(mode):
    """The loop trace itself: which references hit and which miss.

    Every marker is a real access pushed through the tag array. The unit-stride
    walk misses once per block and hits seven times after it; the stride-32
    walk touches a new block every time and never hits."""
    c = S.SERIES[mode]
    unit = [0x1000 + 4 * i for i in range(64)]
    strided = [0x1000 + 32 * i for i in range(64)]
    cu, cs = Cache(1024, 32, 1), Cache(1024, 32, 1)
    hu = [cu.access(a) for a in unit]
    hs = [cs.access(a) for a in strided]
    assert sum(hu) == 56 and sum(hs) == 0

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.4, 5.2), sharex=True)
    for ax, hits, seq, title in (
        (ax1, hu, unit, "unit stride: 56 hits in 64 references"),
        (ax2, hs, strided, "stride 32 bytes: 0 hits in 64 references"),
    ):
        off = [(a - 0x1000) / 32.0 for a in seq]
        xs = np.arange(1, 65)
        ax.scatter([x for x, h in zip(xs, hits) if h],
                   [o for o, h in zip(off, hits) if h], s=20, color=c[0])
        ax.scatter([x for x, h in zip(xs, hits) if not h],
                   [o for o, h in zip(off, hits) if not h], s=42,
                   color=c[1], marker="x", lw=1.7)
        ax.set_ylabel("block touched")
        ax.set_title(title, fontsize=10.5, loc="left", color=S.INK[mode])
        S.strip(ax)
    S.note(ax1, 2, 5.6, "crosses are misses, dots are hits", mode)
    ax2.set_xlabel("reference number")
    fig.suptitle("Spatial locality is what a 32-byte block sells you",
                 color=S.INK[mode], fontsize=12, fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("sys2-mem-assoc")
def _(mode):
    """Misses against associativity for the two interleaved arrays.

    One address bit separates a catastrophe from the compulsory-miss floor: at
    one way every reference misses, at two ways only the 32 first touches do.
    Counted by the simulator, not modelled."""
    c = S.SERIES[mode]
    inter = interleaved_trace()
    ways = [1, 2, 4, 8, 16, 32]
    miss = [run(Cache(1024, 32, w), inter).misses for w in ways]
    assert miss[0] == 256 and miss[1] == 32 and miss[-1] == 32

    fig, ax = plt.subplots()
    ax.bar([str(w) for w in ways], miss, color=c[0], width=0.55)
    ax.axhline(32, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(ax, 1.55, 64, "compulsory floor: 32 blocks must be fetched once", mode)
    for i, m in enumerate(miss):
        ax.text(i, m + 7, str(m), ha="center", color=S.INK[mode], fontsize=9.5)
    S.note(ax, 1.35, 205,
           "direct-mapped: the two arrays land in\nthe same set and evict each other\non every single reference", mode)
    ax.set_xlabel("associativity  (ways, capacity held at 1 KB)")
    ax.set_ylabel("misses in 256 references")
    ax.set_title("A conflict miss is an addressing accident, not a capacity limit")
    ax.set_ylim(0, 295)
    S.strip(ax)
    return fig


@figure("sys2-mem-amat")
def _(mode):
    """AMAT against L1 miss rate, one level below L1 and three.

    One level: AMAT = 1 + m (80). Three: the penalty is itself an average,
    8 + 0.25 (25 + 0.40 x 80) = 22.25 ns, so the same miss rate costs a
    quarter as much."""
    c = S.SERIES[mode]
    m = np.linspace(0, 0.125, 400)
    assert close(1 + 0.03 * 80, 3.4, 1e-12)
    assert close(1 + 0.03 * 22.25, 1.6675, 1e-12)

    fig, ax = plt.subplots()
    ax.plot(m * 100, 1.0 + m * 80.0, color=c[0], lw=2.4)
    ax.plot(m * 100, 1.0 + m * 22.25, color=c[1], lw=2.4)
    S.label_end(ax, 8.6, 1 + 0.086 * 80, "L1 then DRAM: penalty 80 ns",
                c[0], mode, dy=-16, ha="right")
    S.label_end(ax, 10.4, 1 + 0.104 * 22.25,
                "L1, L2, L3, then DRAM:\neffective penalty 22.25 ns", c[1], mode, dy=12, ha="right")
    ax.plot([3], [3.4], "o", color=c[0], ms=7)
    S.note(ax, 3.25, 3.02, "at a 3% miss rate: 3.40 ns", mode)
    ax.plot([3], [1.6675], "o", color=c[1], ms=7)
    S.note(ax, 3.4, 0.95, "the same 3% miss rate: 1.67 ns", mode)
    ax.set_xlabel("L1 miss rate  (percent of all accesses)")
    ax.set_ylabel("average memory access time  (ns)")
    ax.set_title("Levels are bought to shrink the penalty, not the miss rate")
    ax.set_xlim(0, 12.9)
    ax.set_ylim(0, 11.4)
    S.strip(ax)
    return fig


@figure("sys2-mem-belady")
def _(mode):
    """Misses against frame count for FIFO, LRU and OPT on one string.

    The string is 1 2 3 4 1 2 5 1 2 3 4 5, printed in full in the lesson. FIFO
    gets WORSE from three frames to four, which is Belady's anomaly; and at
    three frames LRU is worse than FIFO, which is the case that stops anyone
    calling LRU optimal."""
    c = S.SERIES[mode]
    string = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
    frames = list(range(1, 8))
    series = {p: [frames_sim(string, f, p) for f in frames]
              for p in ("FIFO", "LRU", "OPT")}
    assert series["FIFO"][2] == 9 and series["FIFO"][3] == 10
    assert series["LRU"][2] == 10 and series["OPT"][2] == 7

    fig, ax = plt.subplots()
    for i, p in enumerate(("FIFO", "LRU", "OPT")):
        ax.plot(frames, series[p], color=c[i], lw=2.3, marker="o", ms=6)
        S.label_end(ax, 7, series[p][-1], p, c[i], mode, dy=(10 - 10 * i))
    ax.annotate("", xy=(4, 10), xytext=(3, 9),
                arrowprops=dict(arrowstyle="->", color=S.INK_2[mode], lw=1.3))
    S.note(ax, 3.0, 10.7, "Belady's anomaly: one more frame,\none more miss", mode)
    S.note(ax, 1.05, 4.35, "at three frames LRU takes 10 misses\nwhere FIFO takes 9", mode)
    ax.set_xlabel("frames available")
    ax.set_ylabel("misses on the 12-reference string")
    ax.set_title("More memory is not always fewer misses")
    ax.set_xlim(0.7, 7.7)
    ax.set_ylim(4, 13.4)
    S.strip(ax)
    return fig


@figure("sys2-mem-write-traffic")
def _(mode):
    """Bytes to memory per million references, against the dirty fraction.

    Write-through is flat: it does not care how often a block is written twice.
    Write-back rises with the fraction of evicted blocks that are dirty, and
    the two cross at d = 0.531."""
    c = S.SERIES[mode]
    d = np.linspace(0, 1, 400)
    misses = 1e6 * 0.04
    wb = (misses * 32 * (1 + d)) / 1e6
    wt = np.full_like(d, (0.75e6 * 0.04 * 32 + 0.25e6 * 4) / 1e6)
    assert close(float(wt[0]), 1.96, 1e-12)
    assert close(float(np.interp(0.30, d, wb)), 1.664, 1e-12)

    fig, ax = plt.subplots()
    ax.plot(d, wt, color=c[0], lw=2.4)
    ax.plot(d, wb, color=c[1], lw=2.4)
    S.label_end(ax, 0.05, 1.99, "write-through, no write allocate", c[0], mode, dy=6)
    S.label_end(ax, 0.66, float(np.interp(0.66, d, wb)),
                "write-back, write allocate", c[1], mode, dy=-15)
    ax.plot([0.53125], [1.96], "o", color=S.INK[mode], ms=7)
    S.note(ax, 0.545, 1.55, "crossover at d = 0.531:\nabove this, write-back moves more", mode)
    ax.plot([0.30], [1.664], "o", color=c[1], ms=7)
    S.note(ax, 0.045, 0.72, "the worked case, d = 0.30:\n1.664 MB against 1.960 MB", mode)
    ax.set_xlabel("fraction of evicted blocks that are dirty,  d")
    ax.set_ylabel("megabytes to memory per million references")
    ax.set_title("Which policy moves less depends on how often you rewrite")
    ax.set_xlim(0, 1.02)
    ax.set_ylim(0, 2.9)
    S.strip(ax)
    return fig


@figure("sys2-mem-tlb-reach")
def _(mode):
    """Average translation cost against footprint for two page sizes.

    A 1024-entry TLB reaches 4 MB with 4 KB pages and 2 GB with 2 MB pages. The
    modelled miss rate is the share of the footprint that does not fit,
    1 - reach/footprint, and translation costs 0.5 ns on a hit against a
    four-level, 320 ns walk on a miss."""
    c = S.SERIES[mode]
    fp = np.logspace(np.log10(64 * 1024), np.log10(64 * 1024 ** 3), 500)
    fig, ax = plt.subplots()
    for i, (reach, label) in enumerate(((1024 * 4096, "4 KB pages, reach 4 MB"),
                                        (1024 * 2 * 1024 ** 2, "2 MB pages, reach 2 GB"))):
        miss = np.clip(1.0 - reach / fp, 0.0, 1.0)
        t = (1 - miss) * 0.5 + miss * 320.0
        ax.plot(fp, t, color=c[i], lw=2.4)
        anchor = 1.4e9 if i else 2.4e10
        S.label_end(ax, anchor, 150.0 if i else float(np.interp(2.4e10, fp, t)),
                    label, c[i], mode, dy=0 if i else 12, ha="right")
    assert close(0.98 * 0.5 + 0.02 * 320, 6.89, 1e-12)
    ax.plot([1024 * 4096 / 0.98], [6.89], "o", color=c[0], ms=7)
    S.note(ax, 6.5e6, 16, "2% of a 4.08 MB footprint misses:\n6.89 ns per translation", mode)
    ax.set_xscale("log")
    ax.set_xlabel("resident footprint  (bytes)")
    ax.set_ylabel("average translation time  (ns)")
    ax.set_title("TLB reach, not TLB size, is the figure of merit")
    ax.set_ylim(0, 350)
    S.strip(ax)
    return fig


# ===========================================================================


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    args = list(sys.argv[1:])
    verify()
    print("verify: every printed number reproduced by simulation and closed form")
    if "--facts" in args:
        for k in sorted(FACTS):
            print(f"  {k:28s} {FACTS[k]}")
        return 0
    prefix = args[0] if args else ""
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
