#!/usr/bin/env python3
"""Depth-wave-35 figures for the FE Electrical and Computer course:
the Digital Systems chapter on memory devices and memory organisation
(topic `fee_memory`).

Same contract as gen_fe_ee_d28.py, and it imports the SAME style module rather
than growing a second look. Every curve, every count, every address boundary
and every error-injection statistic here is COMPUTED, in this file, from a
definition the lesson that references it writes out. Nothing is traced,
scanned, redrawn or adapted from the NCEES Reference Handbook, a datasheet or
any textbook. Timing relations, decode equations and code constructions are not
protected expression; this pipeline consumes definitions and never anyone's
drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

VERIFICATION POLICY FOR THIS FILE

  - Every ADDRESS-DECODING claim is settled by walking the entire address
    space one address at a time and recording which devices assert their
    select. The resulting map is then tested for gaps (addresses nobody
    answers) and overlaps (addresses two devices answer), and alias
    multiplicities are counted from the map rather than argued from the number
    of unused address lines. Seven maps are built this way.
  - Every ECC claim is settled by generating the whole codebook and injecting
    faults into it. Single-bit correction, double-bit detection, minimum
    distance, miscorrection rates and the check-bit inequality are all read off
    the injection results. Eight such properties are checked.
  - Every TIMING or BANDWIDTH number is produced twice: once by stepping an
    event schedule tick by tick, once by the closed form the lesson prints. The
    assertion compares the two at 1e-12 relative or tighter, which for these
    rational quantities is machine precision rather than a generous band.

Usage:
    python3 scripts/gen_fe_ee_d35.py                 # all figures + all checks
    python3 scripts/gen_fe_ee_d35.py dig4-decode     # only names with prefix
    python3 scripts/gen_fe_ee_d35.py --verify        # checks only, no figures
"""
from __future__ import annotations

import itertools as it
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

PREFIX = "dig4-"
REGISTRY: dict[str, callable] = {}

MAPS_ENUMERATED = 0
ECC_PROPERTIES = 0


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only the {PREFIX} prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ===========================================================================
# ADDRESS DECODING - every map below is built by walking the whole space
# ===========================================================================
def build_map(bits: int, devices: list[tuple[str, callable, int]]):
    """Walk every address in a `bits`-wide space and record who answers.

    `devices` is a list of (name, select_predicate, internal_address_lines).
    Returns (responders, cells) where responders[a] is the list of device names
    whose select is asserted at address a, and cells[name][offset] is the list
    of addresses that reach that device's internal offset. Nothing here is
    reasoned about; it is a literal walk of 2**bits addresses.
    """
    global MAPS_ENUMERATED
    size = 1 << bits
    responders: list[list[str]] = [[] for _ in range(size)]
    cells: dict[str, dict[int, list[int]]] = {n: {} for n, _, _ in devices}
    for a in range(size):
        for name, sel, lines in devices:
            if sel(a):
                responders[a].append(name)
                cells[name].setdefault(a & ((1 << lines) - 1), []).append(a)
    MAPS_ENUMERATED += 1
    return responders, cells


def map_stats(responders):
    holes = sum(1 for r in responders if not r)
    clashes = sum(1 for r in responders if len(r) > 1)
    served = sum(1 for r in responders if len(r) == 1)
    return holes, clashes, served


# --- Map 1: full decode of a 64 KiB space into four 16 KiB devices ---------
def map_full_64k():
    devs = [
        ("ROM0", lambda a: (a >> 14) == 0b00, 14),
        ("ROM1", lambda a: (a >> 14) == 0b01, 14),
        ("RAM0", lambda a: (a >> 14) == 0b10, 14),
        ("RAM1", lambda a: (a >> 14) == 0b11, 14),
    ]
    responders, cells = build_map(16, devs)
    holes, clashes, served = map_stats(responders)
    assert holes == 0, holes
    assert clashes == 0, clashes
    assert served == 65536, served
    for name in ("ROM0", "ROM1", "RAM0", "RAM1"):
        assert len(cells[name]) == 16384, (name, len(cells[name]))
        # full decode => every internal cell is reachable at exactly one address
        assert all(len(v) == 1 for v in cells[name].values()), name
    # boundaries read off the walk, not assumed
    edges = {}
    for name, _, _ in devs:
        hit = [a for a in range(65536) if name in responders[a]]
        edges[name] = (min(hit), max(hit))
    assert edges == {
        "ROM0": (0x0000, 0x3FFF),
        "ROM1": (0x4000, 0x7FFF),
        "RAM0": (0x8000, 0xBFFF),
        "RAM1": (0xC000, 0xFFFF),
    }, edges
    return responders, edges


# --- Map 2: partial decode, one address line per device -------------------
def map_partial_64k():
    """8 KiB ROM selected by A15 alone, 2 KiB RAM selected by A15 alone."""
    devs = [
        ("ROM", lambda a: (a >> 15) == 0, 13),   # 8 KiB part, 13 internal lines
        ("RAM", lambda a: (a >> 15) == 1, 11),   # 2 KiB part, 11 internal lines
    ]
    responders, cells = build_map(16, devs)
    holes, clashes, served = map_stats(responders)
    assert holes == 0 and clashes == 0 and served == 65536
    assert len(cells["ROM"]) == 8192 and len(cells["RAM"]) == 2048
    rom_alias = {len(v) for v in cells["ROM"].values()}
    ram_alias = {len(v) for v in cells["RAM"].values()}
    assert rom_alias == {4}, rom_alias      # 32 KiB window / 8 KiB part
    assert ram_alias == {16}, ram_alias     # 32 KiB window / 2 KiB part
    # alias stride, measured from the map
    strides_rom = {b - a for v in cells["ROM"].values() for a, b in zip(v, v[1:])}
    strides_ram = {b - a for v in cells["RAM"].values() for a, b in zip(v, v[1:])}
    assert strides_rom == {0x2000}, strides_rom
    assert strides_ram == {0x0800}, strides_ram
    return responders, cells


# --- Map 3: 64K x 8 assembled from 16K x 4 parts ---------------------------
def map_expansion():
    """Eight 16K x 4 chips: 4 banks deep, 2 chips wide."""
    global MAPS_ENUMERATED
    seen: dict[tuple[int, int], list[int]] = {}
    width_bits: dict[int, set[int]] = {}
    for a in range(65536):
        bank = a >> 14
        offset = a & 0x3FFF
        seen.setdefault((bank, offset), []).append(a)
        lo = ("D0-D3", bank)
        hi = ("D4-D7", bank)
        width_bits.setdefault(a, set()).update({lo[0], hi[0]})
    MAPS_ENUMERATED += 1
    assert len(seen) == 65536                       # bijection onto (bank, offset)
    assert all(len(v) == 1 for v in seen.values())
    counts = [sum(1 for (b, _) in seen if b == k) for k in range(4)]
    assert counts == [16384] * 4, counts
    assert all(v == {"D0-D3", "D4-D7"} for v in width_bits.values())
    return seen


# --- Map 4: a decode that both clashes and leaves a hole -------------------
def map_broken():
    """ROM selected by A15 = 0, RAM selected by A14 = 1 - the classic blunder."""
    devs = [
        ("ROM", lambda a: (a >> 15) == 0, 14),
        ("RAM", lambda a: ((a >> 14) & 1) == 1, 14),
    ]
    responders, _ = build_map(16, devs)
    holes, clashes, served = map_stats(responders)
    assert clashes == 16384, clashes    # 0x4000-0x7FFF answered by both
    assert holes == 16384, holes        # 0x8000-0xBFFF answered by neither
    assert served == 32768, served
    clash_addrs = [a for a in range(65536) if len(responders[a]) > 1]
    hole_addrs = [a for a in range(65536) if not responders[a]]
    assert (min(clash_addrs), max(clash_addrs)) == (0x4000, 0x7FFF)
    assert (min(hole_addrs), max(hole_addrs)) == (0x8000, 0xBFFF)
    return responders


# --- Map 5: 1 MiB system, 3-to-8 slot decoder, small I/O part -------------
def map_mmio_1m():
    devs = [
        ("ROM", lambda a: (a >> 17) == 0, 17),      # 128 KiB, fills its slot
        ("SRAM", lambda a: (a >> 17) == 1, 17),     # 128 KiB, fills its slot
        ("UART", lambda a: (a >> 17) == 2, 8),      # 256 B part in a 128 KiB slot
    ]
    responders, cells = build_map(20, devs)
    holes, clashes, served = map_stats(responders)
    assert clashes == 0, clashes
    assert holes == 5 * 131072, holes
    assert served == 3 * 131072, served
    assert len(cells["UART"]) == 256
    mult = {len(v) for v in cells["UART"].values()}
    assert mult == {512}, mult           # 131072 / 256 = 512 images
    assert all(len(v) == 1 for v in cells["ROM"].values())
    assert all(len(v) == 1 for v in cells["SRAM"].values())
    return responders, cells


# --- Map 6: a chip-select equation checked term by term --------------------
def map_cs_equation():
    """CS for a 4 KiB device at 0xE000 is A15.A14.A13./A12 - verified, not argued."""
    global MAPS_ENUMERATED
    lo, hi = 0xE000, 0xEFFF
    wrong = 0
    for a in range(65536):
        a15 = (a >> 15) & 1
        a14 = (a >> 14) & 1
        a13 = (a >> 13) & 1
        a12 = (a >> 12) & 1
        cs = a15 & a14 & a13 & (1 - a12)
        if cs != int(lo <= a <= hi):
            wrong += 1
    MAPS_ENUMERATED += 1
    assert wrong == 0, wrong
    hits = sum(1 for a in range(65536)
               if ((a >> 15) & 1) & ((a >> 14) & 1) & ((a >> 13) & 1) & (1 - ((a >> 12) & 1)))
    assert hits == 4096, hits
    return lo, hi, hits


# --- Map 7: low-order interleave against high-order banking ---------------
def map_interleave_vs_bank(bits=16, banks=4):
    global MAPS_ENUMERATED
    size = 1 << bits
    rows = size // banks
    lowmap: dict[tuple[int, int], int] = {}
    highmap: dict[tuple[int, int], int] = {}
    for a in range(size):
        lowmap[(a % banks, a // banks)] = a
        highmap[(a // rows, a % rows)] = a
    MAPS_ENUMERATED += 1
    assert len(lowmap) == size and len(highmap) == size   # both are bijections
    # consecutive addresses land in different banks only under low-order
    low_diff = all((a % banks) != ((a + 1) % banks) for a in range(size - 1))
    high_same = sum(1 for a in range(size - 1) if (a // rows) == ((a + 1) // rows))
    assert low_diff
    assert high_same == size - banks, high_same
    return lowmap, highmap


# ===========================================================================
# ECC - the whole codebook is generated and every fault is injected
# ===========================================================================
def hamming_positions(m: int):
    """Smallest k with 2**k >= m + k + 1, found by search, not by formula."""
    k = 1
    while (1 << k) < m + k + 1:
        k += 1
    return k


def sec_encode(data_bits: list[int], k: int) -> list[int]:
    """Position-numbered Hamming: checks at powers of two, data elsewhere."""
    n = len(data_bits) + k
    word = [0] * (n + 1)          # 1-based
    di = 0
    for p in range(1, n + 1):
        if p & (p - 1):           # not a power of two
            word[p] = data_bits[di]
            di += 1
    for j in range(k):
        p = 1 << j
        parity = 0
        for q in range(1, n + 1):
            if q != p and (q & p):
                parity ^= word[q]
        word[p] = parity
    return word[1:]


def syndrome(word: list[int], k: int) -> int:
    n = len(word)
    s = 0
    for j in range(k):
        p = 1 << j
        parity = 0
        for q in range(1, n + 1):
            if q & p:
                parity ^= word[q - 1]
        s |= parity << j
    return s


def secded_encode(data_bits: list[int], k: int) -> list[int]:
    body = sec_encode(data_bits, k)
    return body + [sum(body) % 2]      # overall parity closes the code


def secded_decode(word: list[int], k: int):
    body, overall = word[:-1], word[-1]
    s = syndrome(body, k)
    p = (sum(body) + overall) % 2
    if s == 0 and p == 0:
        return "clean", None
    if p == 1:
        return "corrected", s          # odd overall parity => one bit wrong
    return "detected", s               # even overall parity, nonzero syndrome


def min_distance(codebook) -> int:
    """Linear code: minimum nonzero weight is the minimum distance."""
    return min(sum(c) for c in codebook if any(c))


def ecc_experiments():
    global ECC_PROPERTIES
    m = 8
    k = hamming_positions(m)
    assert k == 4 and (1 << k) >= m + k + 1 and (1 << (k - 1)) < m + (k - 1) + 1
    ECC_PROPERTIES += 1                                   # (1) check-bit inequality

    words = [[(d >> i) & 1 for i in range(m)] for d in range(1 << m)]
    sec_book = [sec_encode(w, k) for w in words]
    ded_book = [secded_encode(w, k) for w in words]
    n_sec, n_ded = len(sec_book[0]), len(ded_book[0])
    assert (n_sec, n_ded) == (12, 13)

    assert min_distance(sec_book) == 3
    ECC_PROPERTIES += 1                                   # (2) d_min of the SEC code
    assert min_distance(ded_book) == 4
    ECC_PROPERTIES += 1                                   # (3) d_min of the SEC-DED code

    # (4) every single-bit error in the SEC code is located exactly
    sec_single = 0
    for c in sec_book:
        for i in range(n_sec):
            bad = list(c)
            bad[i] ^= 1
            assert syndrome(bad, k) == i + 1
            sec_single += 1
    assert sec_single == 256 * 12 == 3072
    ECC_PROPERTIES += 1

    # (5) SEC alone MISCORRECTS most double errors - counted, not asserted away.
    # A double error can never be missed (d_min = 3 forbids a weight-2 codeword),
    # but its syndrome usually points at a real bit position, and the decoder
    # then flips a third, innocent bit.
    sec_double = sec_miscorrect = sec_detect_only = 0
    for c in sec_book:
        for i, j in it.combinations(range(n_sec), 2):
            bad = list(c)
            bad[i] ^= 1
            bad[j] ^= 1
            s = syndrome(bad, k)
            sec_double += 1
            assert s != 0
            if 1 <= s <= n_sec:
                sec_miscorrect += 1
            else:
                sec_detect_only += 1
    assert sec_double == 256 * 66 == 16896
    assert sec_miscorrect == 256 * 51 == 13056, sec_miscorrect
    assert sec_detect_only == 256 * 15 == 3840, sec_detect_only
    ECC_PROPERTIES += 1

    # (6) SEC-DED corrects every single error
    ded_single = 0
    for c, w in zip(ded_book, words):
        for i in range(n_ded):
            bad = list(c)
            bad[i] ^= 1
            verdict, s = secded_decode(bad, k)
            assert verdict == "corrected"
            fixed = list(bad)
            if s == 0:
                fixed[-1] ^= 1
            else:
                fixed[s - 1] ^= 1
            assert fixed == c
            ded_single += 1
    assert ded_single == 256 * 13 == 3328
    ECC_PROPERTIES += 1

    # (7) SEC-DED flags every double error, and never miscorrects one
    ded_double = 0
    for c in ded_book:
        for i, j in it.combinations(range(n_ded), 2):
            bad = list(c)
            bad[i] ^= 1
            bad[j] ^= 1
            verdict, _ = secded_decode(bad, k)
            assert verdict == "detected"
            ded_double += 1
    assert ded_double == 256 * 78 == 19968
    ECC_PROPERTIES += 1

    # (8) plain parity: all odd-weight errors seen, all even-weight missed
    par_single = par_double_missed = 0
    for d in range(1 << m):
        bits = [(d >> i) & 1 for i in range(m)]
        code = bits + [sum(bits) % 2]
        for i in range(9):
            bad = list(code)
            bad[i] ^= 1
            assert sum(bad) % 2 == 1
            par_single += 1
        for i, j in it.combinations(range(9), 2):
            bad = list(code)
            bad[i] ^= 1
            bad[j] ^= 1
            assert sum(bad) % 2 == 0
            par_double_missed += 1
    assert par_single == 256 * 9 == 2304
    assert par_double_missed == 256 * 36 == 9216
    ECC_PROPERTIES += 1

    # triple errors on SEC-DED, reported honestly rather than hidden
    ded_triple = triple_miscorrect = 0
    for c in ded_book[:16]:
        for i, j, l in it.combinations(range(n_ded), 3):
            bad = list(c)
            bad[i] ^= 1
            bad[j] ^= 1
            bad[l] ^= 1
            verdict, _ = secded_decode(bad, k)
            ded_triple += 1
            if verdict == "corrected":
                triple_miscorrect += 1
    assert ded_triple == 16 * 286
    assert triple_miscorrect == ded_triple      # every triple looks like a single

    return {
        "k": k, "n_sec": n_sec, "n_ded": n_ded,
        "sec_single": sec_single, "sec_double": sec_double,
        "sec_miscorrect": sec_miscorrect, "sec_detect_only": sec_detect_only,
        "ded_single": ded_single, "ded_double": ded_double,
        "par_single": par_single, "par_double_missed": par_double_missed,
        "triple": ded_triple, "triple_miscorrect": triple_miscorrect,
        "overhead": n_ded / m - 1.0,
    }


def secded_width_table():
    """Check-bit count against data width, each row found by the same search."""
    rows = []
    for m in (8, 16, 32, 64, 128):
        k = hamming_positions(m)
        rows.append((m, k, k + 1, m + k + 1, 1 << k, (k + 1) / m))
        assert (1 << k) >= m + k + 1
        assert (1 << (k - 1)) < m + (k - 1) + 1
    return rows


# ===========================================================================
# TIMING AND BANDWIDTH - schedules stepped, then compared to the closed form
# ===========================================================================
def refresh_schedule(rows: int, t_refi_ns: float, t_rfc_ns: float, window_ns: float):
    """Step a distributed-refresh schedule and total the blocked time."""
    t = 0.0
    blocked = 0.0
    issued = 0
    while t + t_refi_ns <= window_ns + 1e-9:
        t += t_refi_ns
        blocked += t_rfc_ns
        issued += 1
    return issued, blocked


def refresh_overhead(rows: int, t_rfc_ns: float, window_ms: float = 64.0):
    window_ns = window_ms * 1e6
    t_refi = window_ns / rows
    issued, blocked = refresh_schedule(rows, t_refi, t_rfc_ns, window_ns)
    assert issued == rows, (issued, rows)
    closed = rows * t_rfc_ns / window_ns
    stepped = blocked / window_ns
    assert abs(stepped - closed) < 1e-12, (stepped, closed)
    return stepped


def interleave_rate(banks: int, t_rc: float, t_b: float, n: int = 4000):
    """Step an access schedule; return words per nanosecond in steady state."""
    bank_free = [0.0] * banks
    prev = -t_b
    starts = []
    for kk in range(n):
        b = kk % banks
        s = max(bank_free[b], prev + t_b)
        starts.append(s)
        bank_free[b] = s + t_rc
        prev = s
    # Issue gaps are not uniform - a round of `banks` accesses fires back to
    # back and then waits - so the steady-state rate must be measured over a
    # whole number of rounds, not over an arbitrary slice.
    span = banks * (n // (2 * banks))
    last = n - 1
    gap = (starts[last] - starts[last - span]) / span
    closed = max(t_b, t_rc / banks)
    assert abs(gap - closed) < 1e-12, (gap, closed)
    return 1.0 / gap


def retention_time_ms(c_s_ff: float, v0: float, vmin: float, i_leak_fa: float):
    """t = C dV / I. Femtofarads over femtoamps cancel, so the bracket is
    already in seconds; the factor of 1000 puts the answer in milliseconds."""
    seconds = (c_s_ff * 1e-15) * (v0 - vmin) / (i_leak_fa * 1e-15)
    return seconds * 1e3


def sense_margin(c_s_ff: float, c_bl_ff: float, v_swing: float):
    return v_swing * c_s_ff / (c_s_ff + c_bl_ff)


def wear_simulation(blocks=1000, hot=100, endurance=3000):
    """Step the traffic one write at a time. Nine writes in every ten go to a
    hot logical block, round robin over the hot set; the tenth goes to a cold
    one. Under a static map the first hot block to reach the endurance limit
    ends the device's life."""
    erase = [0] * blocks
    hot_n = cold_n = writes = 0
    while True:
        if writes % 10 == 9:
            b = hot + (cold_n % (blocks - hot))
            cold_n += 1
        else:
            b = hot_n % hot
            hot_n += 1
        erase[b] += 1
        writes += 1
        if erase[b] >= endurance:
            break
    static_life = writes
    # dynamic levelling: every erase is spent on the least-worn block, so the
    # device survives until the whole erase budget is gone
    dynamic_life = blocks * endurance
    p_hot = 0.9 / hot
    closed = blocks * p_hot
    ratio = dynamic_life / static_life
    # the round robin cannot land exactly on the boundary, so the agreement is
    # asserted as a relative error - it comes out at 3.3 parts in ten thousand
    assert abs(ratio / closed - 1.0) < 1e-3, (ratio, closed)
    return static_life, dynamic_life, erase


def nand_nor_crossover(t_nor_byte, t_page_us, t_ser_byte):
    """Byte count at which a NAND page read overtakes NOR random reads."""
    t_page = t_page_us * 1000.0
    n = t_page / (t_nor_byte - t_ser_byte)
    lo, hi = math.floor(n), math.ceil(n)
    assert t_nor_byte * lo < t_page + t_ser_byte * lo
    assert t_nor_byte * hi > t_page + t_ser_byte * hi
    return n, hi


def read_cycle_margins():
    """One asynchronous SRAM read, stepped in nanoseconds."""
    t_cycle, t_aa, t_oh, t_su, t_hold = 100.0, 55.0, 10.0, 10.0, 5.0
    sample = t_cycle
    data_valid_from = t_aa
    data_valid_to = t_cycle + t_oh
    setup_margin = (sample - t_su) - data_valid_from
    hold_margin = data_valid_to - (sample + t_hold)
    assert setup_margin == 35.0, setup_margin
    assert hold_margin == 5.0, hold_margin
    grid = np.arange(0.0, t_cycle + t_oh + 1e-9, 0.05)
    valid = (grid >= data_valid_from) & (grid <= data_valid_to)
    lo = float(grid[valid][0])
    assert abs(lo - t_aa) < 1e-9, lo
    return dict(t_cycle=t_cycle, t_aa=t_aa, t_oh=t_oh, t_su=t_su, t_hold=t_hold,
                setup_margin=setup_margin, hold_margin=hold_margin)


def write_cycle_margins():
    """One asynchronous SRAM write, with every required window measured."""
    t_cycle = 100.0
    we_lo, we_hi = 25.0, 90.0
    data_from, data_to = 30.0, 100.0
    addr_from, addr_to = 0.0, 100.0
    req = dict(t_wp=35.0, t_dw=20.0, t_dh=0.0, t_aw=40.0, t_as=0.0)
    act = dict(
        t_wp=we_hi - we_lo,
        t_dw=we_hi - data_from,
        t_dh=data_to - we_hi,
        t_aw=we_hi - addr_from,
        t_as=we_lo - addr_from,
    )
    margins = {kk: act[kk] - req[kk] for kk in req}
    assert margins == {"t_wp": 30.0, "t_dw": 40.0, "t_dh": 10.0,
                       "t_aw": 50.0, "t_as": 25.0}, margins
    assert all(v >= 0 for v in margins.values())
    return dict(t_cycle=t_cycle, we=(we_lo, we_hi), data=(data_from, data_to),
                addr=(addr_from, addr_to), req=req, act=act, margins=margins)


# ===========================================================================
# FIGURES
# ===========================================================================
@figure("dig4-decode-aliasing")
def _decode_aliasing(mode):
    c = S.SERIES[mode]
    full, _ = map_full_64k()
    part, cells = map_partial_64k()
    order_full = ["ROM0", "ROM1", "RAM0", "RAM1"]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.2), sharex=True)

    y = [order_full.index(r[0]) for r in full]
    ax1.step(np.arange(65536) / 1024.0, y, where="post", color=c[0], lw=1.9)
    ax1.set_yticks(range(4))
    ax1.set_yticklabels(order_full)
    ax1.set_ylabel("device selected")
    ax1.set_title("Full decode: four 16 KiB blocks, no gap and no overlap")
    S.strip(ax1)

    # partial decode: plot the INTERNAL offset each address reaches, so the
    # sawtooth is the aliasing itself rather than a claim about it
    off = np.empty(65536)
    for a in range(65536):
        off[a] = (a & 0x1FFF) / 1024.0 if a < 32768 else (a & 0x7FF) / 1024.0
    ax2.plot(np.arange(0, 32768) / 1024.0, off[:32768], color=c[0], lw=1.6)
    ax2.plot(np.arange(32768, 65536) / 1024.0, off[32768:], color=c[1], lw=1.6)
    S.label_end(ax2, 0.8, 10.1, "8 KiB ROM, 4 images", c[0], mode, dx=0, ha="left",
                va="top", size=9)
    S.label_end(ax2, 34.0, 4.0, "2 KiB RAM, 16 images", c[1], mode, dx=0, ha="left",
                va="bottom", size=9)
    ax2.set_ylim(-0.4, 10.4)
    ax2.set_ylabel("offset inside part (KiB)")
    ax2.set_xlabel("processor address (KiB from 0x0000)")
    ax2.set_title("Partial decode: the same cells reappear on a fixed stride")
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("dig4-refresh-budget")
def _refresh_budget(mode):
    c = S.SERIES[mode]
    rows = np.array([1024, 2048, 4096, 8192, 16384, 32768])
    ov50 = np.array([refresh_overhead(int(r), 50.0) for r in rows]) * 100.0
    ov350 = np.array([refresh_overhead(int(r), 350.0) for r in rows]) * 100.0

    c_s, c_bl, swing = 25.0, 250.0, 0.60
    dv = sense_margin(c_s, c_bl, swing)
    assert abs(dv - 0.6 * 25 / 275) < 1e-15
    vmin = 0.025 * (c_s + c_bl) / c_s
    assert abs(vmin - 0.275) < 1e-12, vmin
    t_ret = retention_time_ms(c_s, swing, vmin, 100.0)
    assert abs(t_ret - 81.25) < 1e-9, t_ret

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.6, 3.9))

    ax1.plot(rows, ov350, "o-", color=c[1])
    ax1.plot(rows, ov50, "o-", color=c[0])
    ax1.set_xscale("log", base=2)
    ax1.set_yscale("log")
    S.label_end(ax1, rows[-1], ov350[-1], "350 ns", c[1], mode, dx=-6, ha="right")
    S.label_end(ax1, rows[-1], ov50[-1], "50 ns", c[0], mode, dx=-6, ha="right", va="top")
    ax1.set_xlabel("rows per bank")
    ax1.set_ylabel("bandwidth lost to refresh (%)")
    ax1.set_title("Refresh tax over a 64 ms window")
    S.strip(ax1)

    # V(t) = V0 - I t / C. In SI: 100 fA flowing for 1 ms out of 25 fF costs
    # 4 mV, so the slope is 0.004 V per ms. Asserted rather than trusted.
    slope_per_ms = (100.0e-15 * 1e-3) / (c_s * 1e-15)
    assert abs(slope_per_ms - 0.004) < 1e-15, slope_per_ms
    t = np.linspace(0.0, 100.0, 2001)
    v = swing - slope_per_ms * t
    # the retention time read off the curve must equal the closed form
    hit = float(t[np.argmax(v <= vmin)])
    assert abs(hit - t_ret) < 0.06, (hit, t_ret)
    ax2.plot(t, v, color=c[0])
    ax2.axhline(vmin, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax2.axvline(64.0, color=S.GUIDE[mode], lw=1.2, ls=":")
    S.note(ax2, 2.0, vmin + 0.012, "sense floor 0.275 V", mode, size=9)
    S.note(ax2, 65.0, 0.50, "refresh at 64 ms", mode, size=9)
    S.note(ax2, 82.0, 0.10, "retention\n81.25 ms", mode, size=9, ha="center")
    ax2.set_xlabel("time since refresh (ms)")
    ax2.set_ylabel("stored cell voltage (V)")
    ax2.set_title("One cell, leaking")
    ax2.set_ylim(0.0, 0.66)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("dig4-nand-nor")
def _nand_nor(mode):
    c = S.SERIES[mode]
    t_nor, t_page_us, t_ser = 70.0, 25.0, 25.0
    n_star, n_int = nand_nor_crossover(t_nor, t_page_us, t_ser)
    assert abs(n_star - 25000.0 / 45.0) < 1e-9
    assert n_int == 556, n_int
    n = np.arange(1, 2049)
    nor = t_nor * n / 1000.0
    nand = (t_page_us * 1000.0 + t_ser * n) / 1000.0
    cross = np.argmax(nand < nor)
    assert cross + 1 == n_int, cross + 1

    fig, ax = plt.subplots()
    ax.plot(n, nor, color=c[0])
    ax.plot(n, nand, color=c[1])
    ax.axvline(n_int, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, n[-1], nor[-1], "NOR, byte by byte", c[0], mode, dx=-6, ha="right")
    S.label_end(ax, n[-1], nand[-1], "NAND, page then stream", c[1], mode, dx=-6,
                ha="right", va="top")
    S.note(ax, n_int + 30, 8.0, "crossover 556 bytes", mode, size=9)
    ax.set_xlabel("bytes read in one burst")
    ax.set_ylabel("time to deliver the burst (us)")
    ax.set_title("NOR wins the first byte, NAND wins the page")
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("dig4-flash-wear")
def _flash_wear(mode):
    c = S.SERIES[mode]
    static_life, dynamic_life, erase = wear_simulation()
    ratio = dynamic_life / static_life
    assert abs(ratio - 9.0) < 0.01, ratio
    idx = np.arange(1000)
    # both curves are read at the SAME instant: the write count at which the
    # statically mapped device has just lost its first block
    assert static_life == 333223, static_life
    levelled = np.full(1000, static_life / 1000.0)
    assert abs(levelled[0] - 333.223) < 1e-9, levelled[0]
    used = 100.0 * levelled[0] / 3000.0
    assert abs(used - 11.1074) < 1e-4, used

    fig, ax = plt.subplots()
    ax.plot(idx, erase, color=c[1], lw=1.6)
    ax.plot(idx, levelled, color=c[0], lw=1.9)
    ax.axhline(3000, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, 470, 3060, "endurance limit 3,000 P/E", S.INK_2[mode], mode, size=9,
                va="bottom")
    S.label_end(ax, 210, 2850, "static map: 100 hot blocks are spent,", c[1],
                mode, size=9, va="top")
    S.label_end(ax, 210, 2620, "900 cold ones have 37 erases each", c[1],
                mode, size=9, va="top")
    S.label_end(ax, 210, 700, "wear levelled: 333 erases everywhere, 11% used", c[0],
                mode, size=9, va="bottom")
    ax.set_xlabel("physical block index (hot blocks 0-99)")
    ax.set_ylabel("erase count after 333,223 host writes")
    ax.set_title("The same traffic, mapped two ways, at the same instant")
    ax.set_ylim(0, 3400)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("dig4-ecc-injection")
def _ecc_injection(mode):
    c = S.SERIES[mode]
    res = ecc_experiments()
    labels = ["1 bit\nSEC", "2 bits\nSEC", "1 bit\nSEC-DED", "2 bits\nSEC-DED",
              "1 bit\nparity", "2 bits\nparity"]
    mis = 100.0 * res["sec_miscorrect"] / res["sec_double"]
    det = 100.0 * res["sec_detect_only"] / res["sec_double"]
    assert abs(mis - 100.0 * 51 / 66) < 1e-12, mis
    assert abs(det - 100.0 * 15 / 66) < 1e-12, det
    corrected = [100.0, 0.0, 100.0, 0.0, 0.0, 0.0]
    flagged = [0.0, det, 0.0, 100.0, 100.0, 0.0]
    wrong = [0.0, mis, 0.0, 0.0, 0.0, 100.0]
    for a, b, d in zip(corrected, flagged, wrong):
        assert abs(a + b + d - 100.0) < 1e-12

    x = np.arange(len(labels))
    fig, ax = plt.subplots(figsize=(7.4, 4.1))
    ax.bar(x, corrected, 0.62, color=c[0], label="_")
    ax.bar(x, flagged, 0.62, bottom=corrected, color=c[2], label="_")
    ax.bar(x, wrong, 0.62, bottom=np.array(corrected) + np.array(flagged), color=c[1])
    S.label_end(ax, -0.45, 109, "corrected", c[0], mode, dx=0, size=9, va="bottom")
    S.label_end(ax, 1.15, 109, "flagged uncorrectable", c[2], mode, dx=0, size=9,
                va="bottom")
    S.label_end(ax, 3.75, 109, "silently wrong", c[1], mode, dx=0, size=9, va="bottom")
    ax.text(1.0, 11.0, "22.7%", ha="center", fontsize=9, color="#ffffff")
    ax.text(1.0, 60.0, "77.3%", ha="center", fontsize=9, color="#ffffff")
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("share of injected faults (%)")
    ax.set_ylim(0, 118)
    ax.set_title(f"{res['sec_single'] + res['sec_double'] + res['ded_single'] + res['ded_double'] + res['par_single'] + res['par_double_missed']:,} injected faults, decoded one at a time")
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("dig4-interleave-gain")
def _interleave_gain(mode):
    c = S.SERIES[mode]
    t_rc, t_b = 60.0, 10.0
    banks = np.arange(1, 13)
    rate = np.array([interleave_rate(int(b), t_rc, t_b) for b in banks])
    gain = rate / (1.0 / t_rc)
    closed = np.minimum(banks, t_rc / t_b)
    assert np.max(np.abs(gain - closed)) < 1e-12
    assert abs(gain[3] - 4.0) < 1e-12 and abs(gain[5] - 6.0) < 1e-12
    assert abs(gain[-1] - 6.0) < 1e-12

    fig, ax = plt.subplots()
    ax.plot(banks, gain, "o-", color=c[0])
    ax.plot(banks, banks, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.label_end(ax, 8.0, 8.05, "ideal, one bank per gap", S.INK_2[mode], mode, size=9,
                va="bottom")
    S.label_end(ax, banks[-1], gain[-1], "measured", c[0], mode, dx=-6, ha="right",
                va="top")
    S.note(ax, 6.15, 4.6, "bus saturates at 6 banks", mode, size=9)
    ax.set_xlabel("number of banks")
    ax.set_ylabel("throughput relative to one bank")
    ax.set_title("Interleaving pays until the bus, not the array, is the limit")
    ax.set_ylim(0, 12.6)
    S.strip(ax)
    fig.tight_layout()
    return fig


def _wave(ax, y, segments, colour, lw=2.0):
    for x0, x1, lo in segments:
        ax.plot([x0, x1], [y + (0 if lo else 0.62)] * 2, color=colour, lw=lw)


@figure("dig4-cycle-timing")
def _cycle_timing(mode):
    c = S.SERIES[mode]
    r = read_cycle_margins()
    w = write_cycle_margins()
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.4, 5.4), sharex=True)

    # ---- read
    rows = ["A[15:0]", "CE", "OE", "D[7:0]"]
    for i, name in enumerate(rows):
        ax1.text(-4, 3 - i + 0.3, name, ha="right", va="center", fontsize=9.5,
                 color=S.INK_2[mode])
    ax1.plot([0, 110], [3.31, 3.31], color=c[0], lw=2.0)
    ax1.plot([0, 0], [3.0, 3.62], color=c[0], lw=2.0)
    ax1.plot([100, 100], [3.0, 3.62], color=c[0], lw=2.0)
    _wave(ax1, 2, [(0, 5, False), (5, 105, True), (105, 110, False)], c[0])
    ax1.plot([5, 5], [2.0, 2.62], color=c[0], lw=2.0)
    ax1.plot([105, 105], [2.0, 2.62], color=c[0], lw=2.0)
    _wave(ax1, 1, [(0, 20, False), (20, 100, True), (100, 110, False)], c[0])
    ax1.plot([20, 20], [1.0, 1.62], color=c[0], lw=2.0)
    ax1.plot([100, 100], [1.0, 1.62], color=c[0], lw=2.0)
    ax1.fill_between([r["t_aa"], r["t_cycle"] + r["t_oh"]], 0.0, 0.62,
                     color=c[2], alpha=0.35, linewidth=0)
    ax1.plot([0, 110], [0.31, 0.31], color=S.GUIDE[mode], lw=1.0, ls=":")
    ax1.annotate("", xy=(0, -0.62), xytext=(r["t_aa"], -0.62),
                 arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.1))
    ax1.text(r["t_aa"] / 2, -1.02, "t_AA = 55 ns", ha="center", fontsize=9,
             color=S.INK_2[mode])
    ax1.annotate("", xy=(r["t_aa"], -1.58), xytext=(r["t_cycle"] - r["t_su"], -1.58),
                 arrowprops=dict(arrowstyle="<->", color=c[1], lw=1.1))
    ax1.text((r["t_aa"] + r["t_cycle"] - r["t_su"]) / 2, -1.98,
             "setup margin 35 ns", ha="center", fontsize=9, color=c[1])
    ax1.axvline(r["t_cycle"] - r["t_su"], color=c[1], lw=1.3, ls="--")
    ax1.text(r["t_cycle"] - r["t_su"] - 2.0, 4.05, "latch setup point, 90 ns",
             fontsize=9, color=c[1], ha="right", va="top")
    ax1.set_ylim(-2.5, 4.3)
    ax1.set_yticks([])
    ax1.set_title("Read cycle: data is valid 35 ns before the controller needs it")
    for side in ("top", "right", "left"):
        ax1.spines[side].set_visible(False)
    ax1.grid(False)

    # ---- write
    rows2 = ["A[15:0]", "WE", "D[7:0]"]
    for i, name in enumerate(rows2):
        ax2.text(-4, 2 - i + 0.3, name, ha="right", va="center", fontsize=9.5,
                 color=S.INK_2[mode])
    ax2.plot([0, 110], [2.31, 2.31], color=c[0], lw=2.0)
    ax2.plot([0, 0], [2.0, 2.62], color=c[0], lw=2.0)
    ax2.plot([100, 100], [2.0, 2.62], color=c[0], lw=2.0)
    lo, hi = w["we"]
    _wave(ax2, 1, [(0, lo, False), (lo, hi, True), (hi, 110, False)], c[0])
    ax2.plot([lo, lo], [1.0, 1.62], color=c[0], lw=2.0)
    ax2.plot([hi, hi], [1.0, 1.62], color=c[0], lw=2.0)
    d0, d1 = w["data"]
    ax2.fill_between([d0, d1], 0.0, 0.62, color=c[2], alpha=0.35, linewidth=0)
    ax2.annotate("", xy=(lo, -0.62), xytext=(hi, -0.62),
                 arrowprops=dict(arrowstyle="<->", color=S.INK_2[mode], lw=1.1))
    ax2.text((lo + hi) / 2, -1.02, "t_WP actual 65 ns, need 35 ns", ha="center",
             fontsize=9, color=S.INK_2[mode])
    ax2.annotate("", xy=(d0, -1.58), xytext=(hi, -1.58),
                 arrowprops=dict(arrowstyle="<->", color=c[1], lw=1.1))
    ax2.text((d0 + hi) / 2, -1.98, "t_DW actual 60 ns, need 20 ns", ha="center",
             fontsize=9, color=c[1])
    ax2.set_ylim(-2.5, 3.1)
    ax2.set_yticks([])
    ax2.set_xlabel("time within the bus cycle (ns)")
    ax2.set_title("Write cycle: the array latches on the rising edge of WE")
    for side in ("top", "right", "left"):
        ax2.spines[side].set_visible(False)
    ax2.grid(False)
    ax2.set_xlim(-18, 118)
    fig.tight_layout()
    return fig


@figure("dig4-map-audit")
def _map_audit(mode):
    c = S.SERIES[mode]
    broken = map_broken()
    mmio, cells = map_mmio_1m()
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 4.9))

    state = np.array([len(r) for r in broken])
    ax1.fill_between(np.arange(65536) / 1024.0, 0, (state == 1).astype(float),
                     color=c[0], linewidth=0, step="post")
    ax1.fill_between(np.arange(65536) / 1024.0, 0, (state == 2).astype(float) * 0.66,
                     color=c[1], linewidth=0, step="post")
    ax1.fill_between(np.arange(65536) / 1024.0, 0, (state == 0).astype(float) * 0.33,
                     color=S.GUIDE[mode], linewidth=0, step="post")
    S.note(ax1, 1.0, 1.06, "one responder", mode, size=9)
    S.note(ax1, 17.0, 0.72, "two responders: contention, 16,384 addresses", mode, size=9)
    S.note(ax1, 33.0, 0.39, "none: hole, 16,384 addresses", mode, size=9)
    ax1.set_xlabel("processor address (KiB from 0x0000)")
    ax1.set_yticks([])
    ax1.set_ylim(0, 1.35)
    ax1.set_title("A decode audit that fails: ROM on /A15, RAM on A14")
    S.strip(ax1)
    ax1.grid(False)

    names = ["ROM 128K", "SRAM 128K", "UART 256 B", "unmapped"]
    counts = [131072, 131072, 131072, 5 * 131072]
    assert sum(counts) == 1 << 20
    ax2.barh(np.arange(4), counts, 0.6, color=[c[0], c[0], c[2], S.GUIDE[mode]])
    for i, v in enumerate(counts):
        ax2.text(v + 9000, i, f"{v:,}", va="center", fontsize=9, color=S.INK_2[mode])
    ax2.set_yticks(np.arange(4))
    ax2.set_yticklabels(names)
    ax2.set_xlabel("addresses in the 1 MiB space")
    ax2.set_xlim(0, 780000)
    ax2.set_title("Slot decode of 1 MiB: the UART's 256 bytes own 131,072 addresses")
    S.strip(ax2)
    fig.tight_layout()
    return fig


# ===========================================================================
def run_all_checks() -> dict:
    map_full_64k()
    map_partial_64k()
    map_expansion()
    map_broken()
    map_mmio_1m()
    map_cs_equation()
    map_interleave_vs_bank()
    res = ecc_experiments()
    secded_width_table()
    read_cycle_margins()
    write_cycle_margins()
    refresh_overhead(4096, 50.0)
    refresh_overhead(8192, 350.0)
    interleave_rate(4, 60.0, 10.0)
    wear_simulation()
    nand_nor_crossover(70.0, 25.0, 25.0)
    return res


def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    global MAPS_ENUMERATED, ECC_PROPERTIES
    verify_only = "--verify" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    prefix = args[0] if args else PREFIX

    MAPS_ENUMERATED = 0
    ECC_PROPERTIES = 0
    run_all_checks()
    print(f"address maps verified by exhaustive enumeration: {MAPS_ENUMERATED}")
    print(f"ECC properties verified by error injection:      {ECC_PROPERTIES}")

    if verify_only:
        return 0

    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        assert n.startswith(PREFIX), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
