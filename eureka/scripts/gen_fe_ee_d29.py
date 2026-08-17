#!/usr/bin/env python3
"""Depth-wave-29 figures for the FE Electrical and Computer course:
the two Communications chapters on multiplexing (fee_multiplexing) and on
Shannon-Hartley capacity with link budgets (fee_comms_shannon).

Same contract as the other gen_fe_ee_d*.py generators, and it imports the SAME
style module rather than growing a second look. Every curve, every marker and
every number here is COMPUTED, in this file, from a definition the lesson that
references it writes out; nothing is traced, scanned, redrawn or adapted from
the NCEES Reference Handbook or from any textbook. Frame formats, code sets and
capacity formulas are not protected expression - this pipeline consumes
definitions and never anyone's drawing of them.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from a lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

VERIFICATION POLICY FOR THIS FILE

  - Every MULTIPLEXING EFFICIENCY is obtained twice: once by laying out the
    actual frame or the actual band plan as a list of slots or intervals and
    counting what is in it, once from the closed form the lesson prints. The
    assertion compares the two at 1e-12. A ratio that agrees with the formula
    it came from proves nothing; a ratio that agrees with an enumerated frame
    does.
  - Every ORTHOGONALITY claim is checked on the objects themselves: Walsh codes
    by forming all pairwise correlations of the real code matrix, OFDM
    subcarriers by numerically integrating the product of two real complex
    exponentials over the real symbol window. Both are asserted at 1e-12.
  - Every CAPACITY claim is evaluated numerically across a decade-wide SNR
    sweep and confirmed at its limits: the low-SNR linearisation against the
    exact log, the infinite-bandwidth limit against P/(N0 ln 2), and the
    -1.59 dB floor by minimising (2^eta - 1)/eta numerically rather than by
    quoting ln 2.
  - Every DECIBEL CONVERSION is reconstructed from 20 log10(4 pi / c) with the
    unit factors applied explicitly, so the km-versus-metre constants (+32.45
    and -27.55) are proved to differ by exactly 60 dB rather than assumed to.
    That specific confusion once shipped a path-loss figure in this course
    wrong by exactly that 60 dB.
  - The one Monte Carlo quantity (the OFDM peak-to-average ratio distribution)
    runs from a FIXED SEED and is asserted against its closed-form CCDF, so the
    figure is reproducible and the curve is checked, not merely drawn.

Usage:
    python3 scripts/gen_fe_ee_d29.py                 # all
    python3 scripts/gen_fe_ee_d29.py com4-ofdm       # only names with that prefix
"""
from __future__ import annotations

import math
import pathlib
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

PREFIX = "com4-"
REGISTRY: dict[str, callable] = {}

C_LIGHT = 2.99792458e8       # exact by definition of the metre, m/s
K_BOLTZ = 1.380649e-23       # exact by definition of the kelvin, J/K


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only the {PREFIX} prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# =========================================================================
# PRIMITIVES: things that build the object rather than evaluate its formula
# =========================================================================
def build_tdm_frame(channels: int, bits_per_channel: int, overhead_bits: int):
    """Lay out an actual frame as a list of labelled bit slots.

    Returns the list. Nothing is counted here; the caller counts the list,
    which is the whole point - the efficiency then comes from the frame that
    exists rather than from the formula that is supposed to describe it.
    """
    slots = []
    for _ in range(overhead_bits):
        slots.append("F")
    for ch in range(channels):
        for _ in range(bits_per_channel):
            slots.append(f"ch{ch}")
    return slots


def frame_efficiency_by_counting(slots) -> float:
    payload = sum(1 for s in slots if s != "F")
    return payload / len(slots)


def build_fdm_plan(channels: int, channel_bw: float, guard_bw: float):
    """Return the actual (start, stop) interval of every band and every guard.

    Guards sit BETWEEN neighbours only, so a plan of n channels holds n - 1 of
    them. Laying the intervals down end to end and reading the last stop is an
    independent route to the total occupancy.
    """
    bands, guards = [], []
    edge = 0.0
    for k in range(channels):
        bands.append((edge, edge + channel_bw))
        edge += channel_bw
        if k < channels - 1:
            guards.append((edge, edge + guard_bw))
            edge += guard_bw
    return bands, guards, edge


def walsh(order: int) -> np.ndarray:
    """Hadamard matrix of the given power-of-two order, by recursive doubling."""
    assert order >= 1 and (order & (order - 1)) == 0, order
    H = np.array([[1.0]])
    while H.shape[0] < order:
        H = np.block([[H, H], [H, -H]])
    return H


def cdma_roundtrip(codes: np.ndarray, bits: np.ndarray) -> np.ndarray:
    """Spread every user's bit, add the chip streams on the air, despread.

    This is the separation claim performed rather than asserted: the sum is a
    single chip sequence with no user labels in it, and each user's bit is
    recovered from that one sequence by correlation alone.
    """
    users, length = codes.shape
    air = np.zeros(length)
    for u in range(users):
        air += bits[u] * codes[u]
    return np.array([float(air @ codes[u]) / length for u in range(users)])


def subcarrier_inner_product(k: int, m: int, spacing: float, window: float,
                             samples: int = 400_000) -> complex:
    """Numerically integrate exp(j2 pi k df t) conj(exp(j2 pi m df t)) over the
    window, normalised by the window. Orthogonality is a property of that
    integral, so the integral is what gets computed."""
    t = np.linspace(0.0, window, samples, endpoint=False)
    dt = window / samples
    prod = np.exp(2j * np.pi * k * spacing * t) * np.conj(
        np.exp(2j * np.pi * m * spacing * t))
    return complex(prod.sum() * dt / window)


def capacity(bandwidth: float, snr_linear: float) -> float:
    return bandwidth * math.log2(1.0 + snr_linear)


def db10(x: float) -> float:
    return 10.0 * math.log10(x)


def fspl_constant(distance_per_metre: float, freq_per_hz: float) -> float:
    """The additive constant of FSPL = 20log(d) + 20log(f) + K for one unit pair.

    Built from 20 log10(4 pi / c) plus the two unit conversions, never quoted.
    """
    return 20.0 * math.log10(4.0 * math.pi / C_LIGHT) \
        + 20.0 * math.log10(distance_per_metre) + 20.0 * math.log10(freq_per_hz)


def qfunc(x: float) -> float:
    return 0.5 * math.erfc(x / math.sqrt(2.0))


def invq(p: float) -> float:
    """Invert Q by bisection - a root find on the function itself, so the value
    cannot be a mis-remembered table entry."""
    lo, hi = 0.0, 12.0
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if qfunc(mid) > p:
            lo = mid
        else:
            hi = mid
    return 0.5 * (lo + hi)


# =========================================================================
# fee_multiplexing
# =========================================================================
@figure("com4-fdm-ledger")
def _fdm_ledger(mode):
    """The bandwidth ledger of a 12-channel group, drawn as the plan itself."""
    c = S.SERIES[mode]
    ch_bw, guard = 4.0, 1.0
    bands, guards, total = build_fdm_plan(12, ch_bw, guard)

    # Independent route 1: sum the interval lengths that were laid down.
    occupied = sum(b - a for a, b in bands)
    spent = sum(b - a for a, b in guards)
    assert abs(occupied - 48.0) < 1e-12
    assert abs(spent - 11.0) < 1e-12
    assert abs(total - 59.0) < 1e-12
    assert abs((occupied + spent) - total) < 1e-12
    # Independent route 2: the closed form the lesson prints.
    assert abs(total - (12 * ch_bw + 11 * guard)) < 1e-12
    eff_counted = occupied / total
    eff_formula = (4 * 12) / (5 * 12 - 1)
    assert abs(eff_counted - eff_formula) < 1e-12
    assert abs(eff_counted - 0.8135593220338983) < 1e-15

    fig, (ax, ax2) = plt.subplots(
        2, 1, figsize=(7.2, 5.4), gridspec_kw={"height_ratios": [1.0, 1.25]})

    for k, (a, b) in enumerate(bands):
        ax.add_patch(Rectangle((a, 0.0), b - a, 1.0, facecolor=c[0], alpha=0.72,
                               edgecolor="none"))
        if k in (0, 11):
            ax.text((a + b) / 2, 0.5, f"{k + 1}", ha="center", va="center",
                    color="#ffffff", fontsize=9, fontweight="semibold")
    for a, b in guards:
        ax.add_patch(Rectangle((a, 0.0), b - a, 1.0, facecolor=c[1], alpha=0.62,
                               edgecolor="none"))
    ax.set_xlim(0, total)
    ax.set_ylim(0, 1.9)
    ax.set_yticks([])
    ax.set_xlabel("frequency offset from the bottom of the group (kHz)")
    ax.set_title("A 12-channel FDM group: 48 kHz of talk in 59 kHz of spectrum")
    S.note(ax, 1.0, 1.15, "12 bands of 4 kHz = 48 kHz", mode)
    S.note(ax, 32.0, 1.45, "11 guards of 1 kHz = 11 kHz", mode)
    ax.grid(False)
    S.strip(ax)

    n = np.arange(2, 61)
    eff = (4.0 * n) / (5.0 * n - 1.0)
    for k in (2, 12, 24, 60):
        b_, g_, t_ = build_fdm_plan(int(k), ch_bw, guard)
        counted = sum(y - x for x, y in b_) / t_
        assert abs(counted - (4.0 * k) / (5.0 * k - 1.0)) < 1e-12
    ax2.plot(n, 100 * eff, color=c[0])
    ax2.axhline(80.0, color=S.GUIDE[mode], lw=1.1, ls=(0, (5, 4)))
    ax2.plot([12], [100 * eff_counted], "o", color=c[1], zorder=5)
    S.label_end(ax2, 12, 100 * eff_counted, "12 channels: 81.36%", c[1], mode,
                dx=8, dy=8)
    S.note(ax2, 46, 80.6, "floor at 4/5 = 80%", mode)
    ax2.set_xlabel("channels in the group")
    ax2.set_ylabel("payload share (%)")
    ax2.set_ylim(78, 92)
    ax2.set_title("Guard-band overhead is a per-unit cost, so it never amortises")
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("com4-tdm-frame")
def _tdm_frame(mode):
    """T1 and E1 frames laid out slot by slot, with the counted efficiencies."""
    c = S.SERIES[mode]

    t1 = build_tdm_frame(24, 8, 1)
    assert len(t1) == 193
    assert sum(1 for s in t1 if s == "F") == 1
    eff_t1 = frame_efficiency_by_counting(t1)
    assert abs(eff_t1 - 192 / 193) < 1e-15
    assert abs(eff_t1 - (8 * 24) / (8 * 24 + 1)) < 1e-15
    rate_t1 = len(t1) * 8000
    assert rate_t1 == 1_544_000

    # E1 spends two whole 8-bit slots, not one bit, so it is built that way.
    e1 = build_tdm_frame(32, 8, 0)
    assert len(e1) == 256
    e1_payload = [s for s in e1 if s not in ("ch0", "ch16")]
    eff_e1 = len(e1_payload) / len(e1)
    assert abs(eff_e1 - 30 / 32) < 1e-15
    assert abs(eff_e1 - 0.9375) < 1e-15
    rate_e1 = len(e1) * 8000
    assert rate_e1 == 2_048_000
    # Slot and bit times, from the frame that was built.
    assert abs(125e-6 / 24 - 5.208333333333333e-6) < 1e-18
    assert abs(1.0 / rate_t1 - 647.6683937823834e-9) < 1e-18

    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(7.2, 4.9), sharex=False)

    def draw(axis, slots, special, title, colour):
        for i, s in enumerate(slots):
            fill = colour if s not in special else S.GUIDE[mode]
            axis.add_patch(Rectangle((i, 0), 1, 1, facecolor=fill,
                                     alpha=0.85 if s in special else 0.6,
                                     edgecolor="none"))
        axis.set_xlim(0, len(slots))
        axis.set_ylim(0, 1)
        axis.set_yticks([])
        axis.set_title(title)
        axis.grid(False)
        S.strip(axis)

    draw(ax, t1, {"F"},
         "T1 frame: 193 bit slots, 1 of them framing (99.48% payload)", c[0])
    ax.set_xlabel("bit position in the 125 microsecond frame")
    S.note(ax, 3, 1.08, "bit 0 is the framing bit", mode)

    draw(ax2, e1, {"ch0", "ch16"},
         "E1 frame: 32 slots of 8 bits, 2 of them not voice (93.75% payload)",
         c[1])
    ax2.set_xlabel("bit position in the 125 microsecond frame")
    S.note(ax2, 2, 1.08, "TS0 framing", mode)
    S.note(ax2, 130, 1.08, "TS16 signalling", mode)
    fig.tight_layout()
    return fig


@figure("com4-statmux-gain")
def _statmux_gain(mode):
    """Statistical multiplexing: exact binomial overflow against link size."""
    c = S.SERIES[mode]
    sources, activity = 40, 0.20

    # Independent route: enumerate the binomial distribution of active sources
    # and sum the tail, rather than trusting a normal approximation.
    def binom_pmf(n, k, p):
        return math.comb(n, k) * p ** k * (1 - p) ** (n - k)

    pmf = [binom_pmf(sources, k, activity) for k in range(sources + 1)]
    assert abs(sum(pmf) - 1.0) < 1e-12
    mean = sum(k * pmf[k] for k in range(sources + 1))
    assert abs(mean - sources * activity) < 1e-9          # 8.0 active on average
    var = sum((k - mean) ** 2 * pmf[k] for k in range(sources + 1))
    assert abs(var - sources * activity * (1 - activity)) < 1e-9

    served = np.arange(4, 26)
    overflow = np.array([sum(pmf[k + 1:]) for k in served])
    # Spot-check one tail by an independent complementary sum.
    k0 = 13
    assert abs(sum(pmf[k0 + 1:]) - (1.0 - sum(pmf[: k0 + 1]))) < 1e-12

    fig, ax = plt.subplots(figsize=(7.2, 4.3))
    ax.semilogy(served, overflow, color=c[0], marker="o", ms=4.5)
    ax.axvline(mean, color=S.GUIDE[mode], lw=1.1, ls=(0, (5, 4)))
    S.note(ax, mean + 0.3, 2e-7, "mean demand 8 channels", mode)
    idx = list(served).index(13)
    ax.plot([13], [overflow[idx]], "o", color=c[1], ms=8, zorder=5)
    S.label_end(ax, 13, overflow[idx],
                f"13 channels: overflow {overflow[idx] * 100:.2f}%", c[1], mode,
                dx=8, dy=6)
    ax.set_xlabel("channels the statistical multiplexer actually provides")
    ax.set_ylabel("probability that demand exceeds supply")
    ax.set_title("40 sources, each busy 20% of the time: exact binomial tail")
    ax.set_ylim(1e-8, 1)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-walsh-corr")
def _walsh_corr(mode):
    """Walsh-8 correlations, computed from the code matrix itself."""
    c = S.SERIES[mode]
    H = walsh(8)
    G = H @ H.T / 8.0
    assert np.allclose(G, np.eye(8), atol=1e-12)
    # Every off-diagonal correlation is exactly zero, every diagonal exactly 1.
    for i in range(8):
        for j in range(8):
            expect = 1.0 if i == j else 0.0
            assert abs(G[i, j] - expect) < 1e-12

    # Separation performed: four users share one chip stream and all four bits
    # come back, from correlation alone.
    users = [0, 3, 5, 6]
    bits = np.array([1.0, -1.0, -1.0, 1.0])
    codes = H[users]
    out = cdma_roundtrip(codes, bits)
    assert np.allclose(out, bits, atol=1e-12)
    air = sum(bits[i] * codes[i] for i in range(4))
    # A code NOT in the transmitting set correlates to exactly zero.
    for spare in (1, 2, 4, 7):
        assert abs(float(air @ H[spare]) / 8.0) < 1e-12

    fig, (ax, ax2) = plt.subplots(
        1, 2, figsize=(7.4, 3.9), gridspec_kw={"width_ratios": [1.05, 1.0]})

    ax.imshow(G, cmap="Greys", vmin=-0.2, vmax=1.0)
    for i in range(8):
        for j in range(8):
            ax.text(j, i, "1" if i == j else "0", ha="center", va="center",
                    fontsize=8,
                    color="#ffffff" if i == j else S.INK_2[mode])
    ax.set_xticks(range(8))
    ax.set_yticks(range(8))
    ax.set_xlabel("code index")
    ax.set_ylabel("code index")
    ax.set_title("Walsh-8 correlation matrix")
    ax.grid(False)

    ax2.step(np.arange(8), air, where="mid", color=c[0])
    ax2.plot(np.arange(8), air, "o", color=c[0], ms=5)
    ax2.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax2.set_xlabel("chip index")
    ax2.set_ylabel("amplitude on the air")
    ax2.set_title("Four users summed: one stream, no labels")
    S.note(ax2, 0.0, min(air) - 1.5,
           "correlate with W3 and +8/8 = -1 comes back", mode)
    ax2.set_ylim(min(air) - 2.2, max(air) + 1.2)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("com4-ofdm-orthogonality")
def _ofdm_orthogonality(mode):
    """Subcarrier spectra and the integral that makes them separable."""
    c = S.SERIES[mode]
    spacing = 312_500.0                       # 20 MHz / 64
    window = 1.0 / spacing                    # 3.2 microsecond
    assert abs(window - 3.2e-6) < 1e-18

    # The orthogonality claim, integrated rather than asserted.
    for k, m in ((0, 1), (0, 2), (1, 5), (3, 7)):
        val = subcarrier_inner_product(k, m, spacing, window)
        assert abs(val) < 1e-10, (k, m, val)
    assert abs(subcarrier_inner_product(4, 4, spacing, window) - 1.0) < 1e-10
    # Break the spacing and the integral stops vanishing: 1.5 x spacing gives
    # the sinc value at 1.5, which is 2/(3 pi) in magnitude.
    bad = subcarrier_inner_product(0, 1, 1.5 * spacing, window)
    assert abs(abs(bad) - 2.0 / (3.0 * math.pi)) < 1e-6, bad

    f = np.linspace(-3.5, 3.5, 3000)          # in units of the spacing
    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.3))
    for k, colour in zip((-1, 0, 1), (c[2], c[0], c[1])):
        ax.plot(f, np.sinc(f - k), color=colour, lw=1.7)
    for k in (-1, 0, 1):
        ax.plot([k], [1.0], "o", color=S.INK_2[mode], ms=4)
    for k in (-3, -2, 2, 3):
        ax.plot([k], [0.0], "o", color=S.GUIDE[mode], ms=4)
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    ax.set_xlabel("frequency, in units of the 312.5 kHz subcarrier spacing")
    ax.set_ylabel("amplitude")
    ax.set_title("Each subcarrier peaks where every other one is exactly zero")
    S.note(ax, 1.1, 0.62, "neighbours overlap, but not at the sample points",
           mode)
    S.strip(ax)

    offsets = np.linspace(0.0, 3.0, 601)
    inner = np.abs(np.sinc(offsets))
    ax2.plot(offsets, inner, color=c[0])
    for k in (1, 2, 3):
        ax2.plot([k], [0.0], "o", color=c[1], ms=6, zorder=5)
    ax2.plot([1.5], [2.0 / (3.0 * math.pi)], "o", color=c[2], ms=6, zorder=5)
    S.label_end(ax2, 1.5, 2.0 / (3.0 * math.pi),
                "half-integer spacing leaks 0.212", c[2], mode, dx=8, dy=6)
    ax2.set_xlabel("spacing between the two subcarriers, in units of 1/T_u")
    ax2.set_ylabel("magnitude of the normalised inner product")
    ax2.set_title("The inner product vanishes only at integer multiples of 1/T_u")
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("com4-papr-ccdf")
def _papr_ccdf(mode):
    """Peak-to-average power of a 64-point OFDM symbol.

    Two measurements from the SAME random symbols: the peak seen by an ideal
    Nyquist-rate sampler, and the peak seen by an 8x oversampled one, which is
    what a real power amplifier meets. The Gaussian closed form is drawn as a
    reference and is asserted only where it is honestly a tail approximation.
    """
    c = S.SERIES[mode]
    rng = np.random.default_rng(20260817)
    n_fft, used, trials, over = 64, 48, 20_000, 8
    const = np.array([1 + 1j, 1 - 1j, -1 + 1j, -1 - 1j]) / math.sqrt(2.0)
    idx = np.arange(1, used // 2 + 1)

    def load(bins, sym):
        X = np.zeros(bins, dtype=complex)
        X[idx] = sym[: used // 2]
        X[-idx] = sym[used // 2:]
        return X

    def papr(X):
        p = np.abs(np.fft.ifft(X) * X.size) ** 2
        return p.max() / p.mean()

    crit = np.empty(trials)
    fine = np.empty(trials)
    for t in range(trials):
        sym = const[rng.integers(0, 4, used)]
        crit[t] = papr(load(n_fft, sym))
        fine[t] = papr(load(n_fft * over, sym))

    # The ceiling, PROVED by building the aligning symbol rather than argued:
    # every loaded subcarrier at the same phase gives a PAPR of exactly N.
    worst = papr(load(n_fft * over, np.ones(used, dtype=complex)))
    assert abs(worst - used) < 1e-9
    assert abs(db10(used) - 16.812412373755873) < 1e-12
    # Oversampling can only find peaks the coarse grid missed, never lose one.
    assert bool((fine >= crit - 1e-9).all())
    assert fine.max() <= used + 1e-9

    grid = np.linspace(0.0, 12.0, 241)
    ccdf_c = np.array([(crit > 10 ** (g / 10.0)).mean() for g in grid])
    ccdf_f = np.array([(fine > 10 ** (g / 10.0)).mean() for g in grid])
    theory = 1.0 - (1.0 - np.exp(-(10 ** (grid / 10.0)))) ** used
    # In the deep tail the Gaussian form is the right model, and the seeded
    # measurement lands on it. In the body it is not, and is not asserted.
    for g_db, band in ((9.0, 5e-4), (10.0, 1e-3), (11.0, 5e-5)):
        j = int(np.argmin(np.abs(grid - g_db)))
        assert abs(grid[j] - g_db) < 1e-9
        assert abs(ccdf_c[j] - theory[j]) < band, (g_db, ccdf_c[j], theory[j])
    # Seed-locked regression values, exact to the last counted symbol.
    j9 = int(np.argmin(np.abs(grid - 9.0)))
    assert abs(ccdf_c[j9] - 0.0169) < 1e-12
    assert abs(ccdf_f[j9] - 0.04065) < 1e-12
    med_c, med_f = db10(float(np.median(crit))), db10(float(np.median(fine)))
    assert abs(med_c - 6.591203525010253) < 1e-9
    assert abs(med_f - 7.140984142862522) < 1e-9
    assert 0.5 < med_f - med_c < 0.6

    fig, ax = plt.subplots(figsize=(7.2, 4.5))
    ax.semilogy(grid, ccdf_f, color=c[0])
    ax.semilogy(grid, ccdf_c, color=c[1])
    ax.semilogy(grid, theory, color=S.GUIDE[mode], ls=(0, (5, 4)))
    S.label_end(ax, 8.0, ccdf_f[int(np.argmin(np.abs(grid - 8.0)))],
                "8x oversampled", c[0], mode, dx=10, dy=10)
    S.label_end(ax, 8.0, ccdf_c[int(np.argmin(np.abs(grid - 8.0)))],
                "Nyquist rate", c[1], mode, dx=-16, dy=-16, ha="right")
    S.note(ax, 3.0, 3e-4, "dashed: 1 - (1 - e^-z)^48, the Gaussian tail form",
           mode)
    for db_, lab in ((med_f, "median 7.14 dB"),):
        ax.plot([db_], [0.5], "o", color=c[2], ms=7, zorder=5)
        S.note(ax, db_ + 0.3, 0.55, lab, mode)
    ax.set_xlabel("peak-to-average power ratio (dB)")
    ax.set_ylabel("fraction of symbols exceeding it")
    ax.set_ylim(1e-4, 1.4)
    ax.set_xlim(2, 12)
    ax.set_title("48 loaded subcarriers, 20,000 random QPSK symbols, fixed seed")
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-wdm-grid")
def _wdm_grid(mode):
    """The ITU frequency grid, and the wavelength spacing it maps to."""
    c = S.SERIES[mode]
    # The grid is defined in FREQUENCY; wavelength spacing is derived.
    anchor_f = 193.1e12
    lam = C_LIGHT / anchor_f
    assert abs(lam - 1.5525e-6) < 1e-9        # 1552.5 nm to the nanometre

    def spacing_nm(df, f0=anchor_f):
        return (C_LIGHT / f0 - C_LIGHT / (f0 + df)) * 1e9

    # Independent route: the derivative form (lambda^2/c) df.
    for df in (12.5e9, 25e9, 50e9, 100e9, 200e9):
        exact = spacing_nm(df)
        approx = (lam ** 2 / C_LIGHT) * df * 1e9
        assert abs(exact - approx) / exact < 2e-3, df
    assert abs(spacing_nm(100e9) - 0.8035840482141062) < 1e-12
    assert abs(spacing_nm(50e9) - 0.40189603446780797) < 1e-12

    # Channel counts on the C band, from the band edges themselves.
    f_hi = C_LIGHT / 1530e-9
    f_lo = C_LIGHT / 1565e-9
    span = f_hi - f_lo
    assert abs(f_hi / 1e12 - 195.94278300653593) < 1e-9
    assert abs(f_lo / 1e12 - 191.56067603833867) < 1e-9
    assert abs(span / 1e12 - 4.382106968197281) < 1e-9
    counts = {df: int(span // df) for df in (200e9, 100e9, 50e9, 25e9)}
    assert counts[200e9] == 21 and counts[100e9] == 43
    assert counts[50e9] == 87 and counts[25e9] == 175

    # The grid is even in frequency and therefore uneven in wavelength: the
    # step at the blue end of the band is smaller than the step at the red end.
    step_blue = spacing_nm(100e9, f_hi)
    step_red = spacing_nm(100e9, f_lo)
    assert abs(step_blue - 0.7804418895384859) < 1e-12
    assert abs(step_red - 0.816547260684393) < 1e-12
    assert step_red > step_blue

    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.0))
    freqs = np.arange(191.6e12, 196.0e12, 100e9)
    waves = C_LIGHT / freqs * 1e9
    ax.vlines(waves, 0, 1, color=c[0], lw=1.1, alpha=0.75)
    ax.set_xlim(1528, 1567)
    ax.set_ylim(0, 1.6)
    ax.set_yticks([])
    ax.set_xlabel("wavelength (nm)")
    ax.set_title("The 100 GHz grid across the C band: 43 channels, uneven in nm")
    S.note(ax, 1530.5, 1.15, "0.780 nm apart at 1530 nm", mode)
    S.note(ax, 1548, 1.35, "0.817 nm apart at 1565 nm", mode)
    ax.grid(False)
    S.strip(ax)

    dfs = np.array([12.5, 25, 50, 100, 200])
    nm = np.array([spacing_nm(d * 1e9) for d in dfs])
    ax2.loglog(dfs, nm, color=c[0], marker="o", ms=5)
    ax2.set_xlabel("channel spacing (GHz)")
    ax2.set_ylabel("spacing at 1552.5 nm (nm)")
    ax2.set_title("Frequency spacing to wavelength spacing is a straight line")
    for d, w in zip(dfs, nm):
        S.note(ax2, d, w * 1.12, f"{w:.3f}", mode, ha="center")
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("com4-access-compare")
def _access_compare(mode):
    """FDMA/TDMA/OFDMA against CDMA on one carrier, one power, one yardstick.

    The common basis is deliberately narrow so that it is fair: total
    bandwidth W, total noise density N0, and the SAME received power P per
    user in every scheme. gamma = P/(N0 W) is then the one dimensionless
    quantity in the comparison, and each scheme's per-user rate follows from
    how it divides W and how much of the other users' power lands in the
    correlator.
    """
    c = S.SERIES[mode]
    W, gamma = 1.25e6, 0.5

    def orthogonal(n):
        """FDMA (W/n all of the time), TDMA (all of W, 1/n of the time) and
        OFDMA (a subcarrier subset) all reduce to this one expression."""
        return (W / n) * math.log2(1.0 + n * gamma)

    def cdma(n):
        """Whole band, whole time, n-1 interferers inside the correlator."""
        return W * math.log2(1.0 + gamma / (1.0 + (n - 1) * gamma))

    # FDMA and TDMA written out separately, then shown to coincide - that is
    # the claim, so it is performed rather than asserted by construction.
    for n in (1, 2, 5, 20, 50):
        fdma = (W / n) * math.log2(1.0 + gamma * n)
        tdma = (1.0 / n) * W * math.log2(1.0 + gamma * n)
        assert abs(fdma - tdma) < 1e-9, n
        assert abs(fdma - orthogonal(n)) < 1e-9, n
    # A single user cannot tell the schemes apart, which is the sanity check
    # that the two expressions share one origin.
    assert abs(orthogonal(1) - cdma(1)) < 1e-12
    assert abs(orthogonal(1) / 1e3 - 731.2031259014453) < 1e-9
    assert abs(orthogonal(20) / 1e3 - 216.21447616483107) < 1e-9
    assert abs(cdma(20) / 1e3 - 83.89274482317128) < 1e-9

    users = np.arange(1, 51)
    r_orth = np.array([orthogonal(int(n)) for n in users]) / 1e3
    r_cdma = np.array([cdma(int(n)) for n in users]) / 1e3
    sum_orth = users * r_orth / 1e3
    sum_cdma = users * r_cdma / 1e3
    # Sum rate: orthogonal access keeps growing, CDMA saturates at W/ln2.
    assert sum_orth[-1] > sum_orth[19] > sum_orth[0]
    ceiling = W / math.log(2.0) / 1e6
    assert abs(ceiling - 1.8033688011112043) < 1e-9
    for n in (200, 2000, 20000):
        assert cdma(n) * n / 1e6 < ceiling
    assert abs(cdma(20000) * 20000 / 1e6 - ceiling) / ceiling < 2e-4

    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(7.2, 5.4))
    ax.plot(users, r_orth, color=c[0])
    ax.plot(users, r_cdma, color=c[1])
    S.label_end(ax, 50, r_orth[-1], "FDMA = TDMA = OFDMA", c[0], mode,
                dx=-142, dy=14)
    S.label_end(ax, 50, r_cdma[-1], "CDMA, no joint detection", c[1], mode,
                dx=-160, dy=-14)
    ax.plot([20], [r_orth[19]], "o", color=c[0], ms=6, zorder=5)
    ax.plot([20], [r_cdma[19]], "o", color=c[1], ms=6, zorder=5)
    S.note(ax, 21, r_orth[19] + 22, "20 users: 216.2 kbps", mode)
    S.note(ax, 21, r_cdma[19] + 22, "20 users: 83.9 kbps", mode)
    ax.set_xlabel("users sharing the 1.25 MHz carrier")
    ax.set_ylabel("rate per user (kbps)")
    ax.set_title("Same bandwidth, same power per user, one yardstick")
    S.strip(ax)

    ax2.plot(users, sum_orth, color=c[0])
    ax2.plot(users, sum_cdma, color=c[1])
    ax2.axhline(ceiling, color=S.GUIDE[mode], lw=1.1, ls=(0, (5, 4)))
    S.note(ax2, 2, ceiling + 0.16, "CDMA sum-rate ceiling W/ln2 = 1.803 Mbps",
           mode)
    S.label_end(ax2, 50, sum_orth[-1], "orthogonal", c[0], mode, dx=-74, dy=12)
    S.label_end(ax2, 50, sum_cdma[-1], "CDMA", c[1], mode, dx=-44, dy=-14)
    ax2.set_xlabel("users sharing the 1.25 MHz carrier")
    ax2.set_ylabel("total delivered (Mbps)")
    ax2.set_ylim(0, 6.6)
    ax2.set_title("Orthogonal access keeps climbing; CDMA saturates")
    S.strip(ax2)
    fig.tight_layout()
    return fig


# =========================================================================
# fee_comms_shannon
# =========================================================================
@figure("com4-entropy-code")
def _entropy_code(mode):
    """Source entropy against the measured length of a real prefix code."""
    c = S.SERIES[mode]
    probs = [0.40, 0.25, 0.15, 0.10, 0.06, 0.04]
    assert abs(sum(probs) - 1.0) < 1e-12
    H = -sum(p * math.log2(p) for p in probs)
    assert abs(H - 2.200796755502815) < 1e-12

    # Build a Huffman code, then MEASURE its average length from the codewords
    # that came out - not from the merge costs accumulated on the way.
    nodes = [(p, [(i, "")]) for i, p in enumerate(probs)]
    while len(nodes) > 1:
        nodes.sort(key=lambda t: t[0])
        (p1, a), (p2, b) = nodes[0], nodes[1]
        merged = [(i, "0" + s) for i, s in a] + [(i, "1" + s) for i, s in b]
        nodes = nodes[2:] + [(p1 + p2, merged)]
    code = dict(nodes[0][1])
    words = sorted(code.values(), key=len)
    # A prefix code: no codeword begins another.
    for u in words:
        for v in words:
            assert u == v or not v.startswith(u)
    # Kraft equality holds for a full binary tree.
    assert abs(sum(2.0 ** -len(w) for w in words) - 1.0) < 1e-12
    L = sum(probs[i] * len(code[i]) for i in range(len(probs)))
    assert H <= L < H + 1.0
    assert abs(L - 2.25) < 1e-12
    eff = H / L
    assert abs(eff - 0.9781318913345844) < 1e-12
    fixed = math.ceil(math.log2(len(probs)))
    assert fixed == 3

    fig, (ax, ax2) = plt.subplots(
        1, 2, figsize=(7.4, 4.0), gridspec_kw={"width_ratios": [1.15, 1.0]})

    x = np.arange(len(probs))
    ax.bar(x - 0.19, [-math.log2(p) for p in probs], width=0.36, color=c[0],
           alpha=0.85)
    ax.bar(x + 0.19, [len(code[i]) for i in range(len(probs))], width=0.36,
           color=c[1], alpha=0.85)
    ax.set_xticks(x)
    ax.set_xticklabels([f"{p:.2f}" for p in probs], fontsize=8.5)
    ax.set_xlabel("symbol probability")
    ax.set_ylabel("bits")
    ax.set_title("Ideal length against the codeword actually issued")
    S.note(ax, -0.45, 5.35, "left bar: -log2(p)   right bar: Huffman length",
           mode)
    ax.set_ylim(0, 5.8)
    S.strip(ax)

    ax2.bar(["entropy", "Huffman", "fixed 3-bit"], [H, L, float(fixed)],
            color=[c[0], c[1], S.GUIDE[mode]], width=0.55, alpha=0.85)
    for i, v in enumerate([H, L, float(fixed)]):
        ax2.text(i, v + 0.06, f"{v:.3f}", ha="center", color=S.INK[mode],
                 fontsize=10, fontweight="semibold")
    ax2.set_ylabel("bits per symbol")
    ax2.set_ylim(0, 3.55)
    ax2.set_title("Coding efficiency 97.81%")
    ax2.grid(axis="x")
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("com4-capacity-sweep")
def _capacity_sweep(mode):
    """Capacity against SNR, with the two asymptotes it lives between."""
    c = S.SERIES[mode]
    snr_db = np.linspace(-20.0, 40.0, 1200)
    snr = 10 ** (snr_db / 10.0)
    eta = np.log2(1.0 + snr)
    low = snr / math.log(2.0)                 # SNR << 1
    high = snr_db / db10(2.0)                 # SNR >> 1: one bit per 3.01 dB

    # Both asymptotes checked against the exact expression where they apply.
    j = int(np.argmin(np.abs(snr_db + 20.0)))
    assert abs(eta[j] - low[j]) / eta[j] < 0.006
    j = int(np.argmin(np.abs(snr_db - 40.0)))
    assert abs(eta[j] - high[j]) / eta[j] < 2e-4
    # The 3.01 dB per bit rule, measured on the exact curve at high SNR.
    e1 = math.log2(1 + 10 ** 3.0)
    e2 = math.log2(1 + 10 ** (3.0 + db10(2.0) / 10.0))
    assert abs((e2 - e1) - 1.0) < 2e-3
    # Named points the lesson prints.
    assert abs(math.log2(1 + 1000.0) - 9.967226258835993) < 1e-12
    assert abs(3000 * math.log2(1 + 1000.0) - 29901.67877650798) < 1e-9
    assert abs(20e6 * math.log2(1 + 100.0) - 133_164_229.6550359) < 1e-3

    fig, ax = plt.subplots(figsize=(7.2, 4.3))
    ax.plot(snr_db, eta, color=c[0])
    ax.plot(snr_db, low, color=c[1], ls=(0, (5, 4)))
    ax.plot(snr_db, high, color=c[2], ls=(0, (2, 3)))
    ax.set_ylim(0, 14)
    S.label_end(ax, 40, eta[-1], "exact", c[0], mode, dx=-46, dy=8)
    S.label_end(ax, -6.0, low[int(np.argmin(np.abs(snr_db + 6.0)))],
                "low-SNR line", c[1], mode, dx=6, dy=-12)
    S.label_end(ax, 34.0, high[int(np.argmin(np.abs(snr_db - 34.0)))],
                "3.01 dB per bit", c[2], mode, dx=-96, dy=12)
    for db_, lab in ((20.0, "20 dB: 6.658 b/s/Hz"), (30.0, "30 dB: 9.967 b/s/Hz")):
        k = int(np.argmin(np.abs(snr_db - db_)))
        ax.plot([db_], [eta[k]], "o", color=S.INK_2[mode], ms=5, zorder=5)
        S.note(ax, db_ - 1.0, eta[k] + 0.5, lab, mode, ha="right")
    ax.set_xlabel("signal-to-noise ratio (dB)")
    ax.set_ylabel("capacity per hertz (bits/s/Hz)")
    ax.set_title("Shannon-Hartley: linear in SNR below 0 dB, logarithmic above")
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-iso-capacity")
def _iso_capacity(mode):
    """Bandwidth against SNR at fixed capacity - the trade, drawn."""
    c = S.SERIES[mode]
    targets = [1e6, 10e6, 100e6]              # bits per second
    bw = np.linspace(0.2e6, 40e6, 2000)

    fig, ax = plt.subplots(figsize=(7.2, 4.3))
    for target, colour in zip(targets, [c[2], c[0], c[1]]):
        snr = 2 ** (target / bw) - 1.0
        ok = snr < 1e6
        ax.semilogy(bw[ok] / 1e6, snr[ok], color=colour)
        # Every point on a contour really does deliver the target rate.
        for probe in (1e6, 5e6, 20e6):
            s = 2 ** (target / probe) - 1.0
            assert abs(capacity(probe, s) - target) / target < 1e-12
        k = int(np.argmin(np.abs(bw - 24e6)))
        S.label_end(ax, 24.0, snr[k], f"{target / 1e6:.0f} Mbps", colour, mode,
                    dx=6, dy=0)
    # The exchange rate is not one for one: at 10 Mbps, halving the bandwidth
    # from 10 MHz to 5 MHz costs far more than 3 dB.
    s10 = 2 ** (10e6 / 10e6) - 1.0
    s5 = 2 ** (10e6 / 5e6) - 1.0
    assert abs(s10 - 1.0) < 1e-12 and abs(s5 - 3.0) < 1e-12
    assert abs(db10(s5) - db10(s10) - 4.771212547196624) < 1e-9
    s2 = 2 ** (10e6 / 2.5e6) - 1.0
    assert abs(s2 - 15.0) < 1e-12
    assert abs(db10(s2) - 11.760912590556813) < 1e-9

    ax.set_xlabel("bandwidth (MHz)")
    ax.set_ylabel("signal-to-noise ratio required (linear)")
    ax.set_title("Iso-capacity contours: bandwidth bought with SNR, at a rising price")
    ax.set_ylim(1e-2, 1e5)
    ax.set_xlim(0, 32)
    S.note(ax, 1.0, 2e4, "narrow band, exponential SNR demand", mode)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-ebn0-floor")
def _ebn0_floor(mode):
    """The -1.59 dB floor, found by minimising the exact expression."""
    c = S.SERIES[mode]
    eta = np.logspace(-3.0, 1.0, 4000)
    ebn0 = (2 ** eta - 1.0) / eta
    ebn0_db = 10 * np.log10(ebn0)

    # The floor, located by search on the curve rather than quoted from ln 2.
    j = int(np.argmin(ebn0))
    assert eta[j] < 1e-2                      # the minimum sits at eta -> 0
    assert abs(ebn0[j] - math.log(2.0)) < 5e-3
    assert abs(db10(math.log(2.0)) + 1.591745389548616) < 1e-12
    # The limit, taken properly: (2^eta - 1)/eta = ln2 + 0.2402 eta + O(eta^2),
    # so the residual must shrink in proportion to eta and not merely be small.
    for e in (1e-3, 1e-4, 1e-5, 1e-6):
        assert abs(((2 ** e - 1.0) / e) - math.log(2.0)) < 0.25 * e + 1e-9
    # Infinite-bandwidth capacity: C -> P/(N0 ln2), checked by letting B grow.
    # The residual falls as (P/N0)/(2B), which is the property being claimed.
    P, N0 = 1e-12, 1e-20
    limit = P / (N0 * math.log(2.0))
    assert abs(limit - 1.4426950408889634e8) < 1.0
    for B in (1e10, 1e12, 1e14):
        c_b = B * math.log2(1.0 + P / (N0 * B))
        assert abs(c_b - limit) / limit < 0.6 * (P / N0) / B, B

    fig, ax = plt.subplots(figsize=(7.2, 4.3))
    ax.semilogx(eta, ebn0_db, color=c[0])
    ax.axhline(db10(math.log(2.0)), color=S.GUIDE[mode], lw=1.2, ls=(0, (5, 4)))
    S.note(ax, 1.3e-3, -1.2, "-1.59 dB: no code, ever, below this line", mode)
    for e_, lab in ((1.0, "1 b/s/Hz: 0.00 dB"), (2.0, "2 b/s/Hz: 1.76 dB"),
                    (6.0, "6 b/s/Hz: 10.21 dB")):
        v = db10((2 ** e_ - 1.0) / e_)
        ax.plot([e_], [v], "o", color=c[1], ms=6, zorder=5)
        S.note(ax, e_ * 1.06, v - 1.6, lab, mode)
    assert abs(db10((2 ** 1.0 - 1.0) / 1.0) - 0.0) < 1e-12
    assert abs(db10((2 ** 2.0 - 1.0) / 2.0) - 1.7609125905568124) < 1e-12
    assert abs(db10((2 ** 6.0 - 1.0) / 6.0) - 10.211892990699381) < 1e-12
    ax.set_xlabel("spectral efficiency (bits/s/Hz)")
    ax.set_ylabel("minimum Eb/N0 (dB)")
    ax.set_title("Every rate has a floor; the floor of the floors is -1.59 dB")
    ax.set_ylim(-4, 14)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-shannon-plane")
def _shannon_plane(mode):
    """Real modulations plotted against the capacity bound they cannot cross."""
    c = S.SERIES[mode]
    eta = np.logspace(-2.0, 1.1, 3000)
    bound_db = 10 * np.log10((2 ** eta - 1.0) / eta)

    # Uncoded Eb/N0 for BER 1e-5, computed by inverting Q, not tabulated.
    target = 1e-5
    rows = []
    x = invq(target)
    g_bpsk = x * x / 2.0
    rows.append(("BPSK", 1.0, db10(g_bpsk)))
    rows.append(("QPSK", 2.0, db10(g_bpsk)))
    assert abs(db10(g_bpsk) - 9.587858346847604) < 1e-6
    for M in (16, 64, 256):
        k = int(math.log2(M))
        pref = (4.0 / k) * (1.0 - 1.0 / math.sqrt(M))
        xx = invq(target / pref)
        g = xx * xx * (M - 1) / (3.0 * k)
        rows.append((f"{M}-QAM", float(k), db10(g)))
    # 8-PSK from its own union bound.
    xx = invq(target * 3.0 / 2.0)
    g8 = xx * xx / (6.0 * math.sin(math.pi / 8.0) ** 2)
    rows.append(("8-PSK", 3.0, db10(g8)))
    for name, e, gdb in rows:
        floor = db10((2 ** e - 1.0) / e)
        assert gdb > floor, (name, gdb, floor)
    lookup = {r[0]: r[2] for r in rows}
    assert abs(lookup["16-QAM"] - 13.4) < 0.1
    assert abs(lookup["64-QAM"] - 17.8) < 0.1
    assert abs(lookup["256-QAM"] - 22.6) < 0.2
    assert abs(lookup["8-PSK"] - 13.0) < 0.1

    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    ax.plot(bound_db, eta, color=c[0])
    ax.fill_betweenx(eta, -6, bound_db, color=c[0], alpha=0.10)
    for name, e, gdb in rows:
        ax.plot([gdb], [e], "o", color=c[1], ms=6, zorder=5)
        S.note(ax, gdb + 0.5, e - 0.06, name, mode, size=8.5)
    ax.axvline(db10(math.log(2.0)), color=S.GUIDE[mode], lw=1.1, ls=(0, (5, 4)))
    S.note(ax, -1.2, 8.2, "-1.59 dB", mode, ha="right")
    S.note(ax, 1.2, 6.6, "unreachable", mode)
    ax.set_xlabel("Eb/N0 (dB)")
    ax.set_ylabel("spectral efficiency (bits/s/Hz)")
    ax.set_xlim(-4, 28)
    ax.set_ylim(0, 9)
    ax.set_title("Uncoded modulation at BER 1e-5, against the Shannon bound")
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-nyquist-shannon")
def _nyquist_shannon(mode):
    """Nyquist's symbol-rate ceiling and Shannon's capacity, on one axis."""
    c = S.SERIES[mode]
    B = 1e6
    snr_db = np.linspace(0.0, 45.0, 1400)
    snr = 10 ** (snr_db / 10.0)
    shannon = B * np.log2(1.0 + snr) / 1e6

    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    ax.plot(snr_db, shannon, color=c[0])
    S.label_end(ax, 45, shannon[-1], "Shannon capacity", c[0], mode,
                dx=-118, dy=10)
    for M, colour in ((2, c[1]), (4, c[2]), (16, S.GUIDE[mode])):
        rate = 2 * B * math.log2(M) / 1e6
        ax.axhline(rate, color=colour, lw=1.4, ls=(0, (5, 4)))
        S.note(ax, 0.6, rate + 0.28, f"Nyquist, {M} levels: {rate:.0f} Mbps",
               mode)
        # Nyquist is noise-blind: the same line whatever the SNR.
        assert abs(rate - 2 * math.log2(M)) < 1e-12
        # Where the two cross is where noise, not bandwidth, becomes the limit.
        cross = 2 ** (2 * math.log2(M)) - 1.0
        assert abs(capacity(B, cross) / 1e6 - rate) < 1e-9
        ax.plot([db10(cross)], [rate], "o", color=colour, ms=6, zorder=5)
    assert abs(db10(2 ** 2 - 1.0) - 4.771212547196624) < 1e-9
    assert abs(db10(2 ** 4 - 1.0) - 11.760912590556813) < 1e-9
    assert abs(db10(2 ** 8 - 1.0) - 24.06540180433955) < 1e-9
    ax.set_xlabel("signal-to-noise ratio (dB)")
    ax.set_ylabel("rate over a 1 MHz channel (Mbps)")
    ax.set_ylim(0, 16)
    ax.set_title("Nyquist caps the symbols; Shannon caps the information")
    S.note(ax, 26.0, 1.0, "markers: the SNR at which the two agree", mode)
    S.strip(ax)
    fig.tight_layout()
    return fig


@figure("com4-link-reconcile")
def _link_reconcile(mode):
    """A whole link: budget, noise floor, achievable rate and the chosen mode."""
    c = S.SERIES[mode]
    # Every FSPL constant reconstructed, so the 60 dB trap is closed here.
    k_m_hz = fspl_constant(1.0, 1.0)
    k_m_mhz = fspl_constant(1.0, 1e6)
    k_km_mhz = fspl_constant(1e3, 1e6)
    k_km_ghz = fspl_constant(1e3, 1e9)
    k_mi_mhz = fspl_constant(1609.344, 1e6)
    assert abs(k_m_hz + 147.55221677811664) < 1e-9
    assert abs(k_m_mhz + 27.552216778116644) < 1e-9
    assert abs(k_km_mhz - 32.447783221883356) < 1e-9
    assert abs(k_km_ghz - 92.44778322188336) < 1e-9
    assert abs(k_mi_mhz - 36.580760925910866) < 1e-9
    assert abs((k_km_mhz - k_m_mhz) - 60.0) < 1e-9      # the exact 60 dB
    assert abs((k_km_ghz - k_km_mhz) - 60.0) < 1e-9
    assert abs((k_m_mhz - k_m_hz) - 120.0) < 1e-9
    assert abs((k_mi_mhz - k_km_mhz) - 20 * math.log10(1.609344)) < 1e-9

    d, f = 12_000.0, 5.8e9                     # 12 km, 5.8 GHz backhaul
    lam = C_LIGHT / f
    fspl_def = 20 * math.log10(4 * math.pi * d / lam)
    fspl_km_ghz = 20 * math.log10(d / 1e3) + 20 * math.log10(f / 1e9) + k_km_ghz
    fspl_m_mhz = 20 * math.log10(d) + 20 * math.log10(f / 1e6) + k_m_mhz
    assert abs(fspl_def - fspl_km_ghz) < 1e-9
    assert abs(fspl_def - fspl_m_mhz) < 1e-9
    assert abs(fspl_def - 129.29996801409462) < 1e-9

    p_tx, g_tx, g_rx, l_cable = 24.0, 23.0, 23.0, 3.0
    p_rx = p_tx + g_tx + g_rx - l_cable - fspl_def
    assert abs(p_rx - (-62.29996801409462)) < 1e-9

    bw, nf = 20e6, 5.0
    # -174 dBm/Hz reconstructed from kT rather than quoted.
    ktb_dbm = db10(K_BOLTZ * 290.0 / 1e-3)
    assert abs(ktb_dbm + 173.97518719422808) < 1e-9
    floor = ktb_dbm + db10(bw) + nf
    assert abs(floor - (-95.96488723758827)) < 1e-9
    snr_db = p_rx - floor
    assert abs(snr_db - 33.664919223493655) < 1e-9
    snr = 10 ** (snr_db / 10.0)
    cap = capacity(bw, snr) / 1e6
    assert abs(cap - 223.67728760335888) < 1e-6
    eta_cap = cap * 1e6 / bw
    assert abs(eta_cap - 11.183864380167943) < 1e-9

    # Uncoded modes, each with its OWN required Eb/N0 recovered by inverting Q,
    # then converted to a required SNR by SNR = eta (Eb/N0).
    target = 1e-5
    x = invq(target)
    ebn0_psk = db10(x * x / 2.0)
    modes = [("BPSK", 1.0, ebn0_psk), ("QPSK", 2.0, ebn0_psk)]
    for M in (16, 64, 256):
        k = int(math.log2(M))
        pref = (4.0 / k) * (1.0 - 1.0 / math.sqrt(M))
        xx = invq(target / pref)
        modes.append((f"{M}-QAM", float(k),
                      db10(xx * xx * (M - 1) / (3.0 * k))))
    xs = [m[1] for m in modes]
    need = [m[2] + db10(m[1]) for m in modes]
    assert abs(need[0] - 9.587858346847604) < 1e-6
    assert abs(need[-1] - 31.534055924071318) < 1e-6
    fits = [i for i, v in enumerate(need) if v <= snr_db]
    assert fits == [0, 1, 2, 3, 4]             # every mode clears the budget
    spare = snr_db - need[-1]
    assert abs(spare - 2.1308632994223373) < 1e-6
    gap = eta_cap - xs[-1]
    assert abs(gap - 3.183864380167943) < 1e-9

    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    ax.plot(xs, need, color=c[1], marker="o", ms=6)
    for (name, e, _), v in zip(modes, need):
        S.note(ax, e, v + 1.0, name, mode, ha="center", size=8.5)
    ax.axhline(snr_db, color=c[0], lw=1.6)
    S.note(ax, 0.6, snr_db + 0.7, f"link delivers {snr_db:.2f} dB", mode)
    ax.axvline(eta_cap, color=S.GUIDE[mode], lw=1.2, ls=(0, (5, 4)))
    S.note(ax, eta_cap - 0.2, 8.0,
           f"capacity {eta_cap:.2f} b/s/Hz", mode, ha="right")
    ax.plot([xs[-1]], [need[-1]], "o", color=c[2], ms=10, zorder=6)
    S.note(ax, xs[-1] - 0.25, need[-1] - 4.0,
           f"256-QAM fits, {spare:.2f} dB to spare", mode, ha="right")
    ax.set_xlabel("spectral efficiency of the chosen mode (bits/s/Hz)")
    ax.set_ylabel("SNR required (dB)")
    ax.set_xlim(0, 12.6)
    ax.set_ylim(4, 40)
    ax.set_title("12 km at 5.8 GHz: what the budget delivers, what a mode needs")
    S.strip(ax)
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
    prefix = sys.argv[1] if len(sys.argv) > 1 else PREFIX
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
