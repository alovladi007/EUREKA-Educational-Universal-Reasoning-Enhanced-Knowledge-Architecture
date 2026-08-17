#!/usr/bin/env python3
"""Depth-wave-33 figures for the FE Electrical and Computer course.

Scope: ONE chapter, `fee_signal_nyquist` -- the practitioner's chapter on
aliasing pitfalls in the Signal Processing section. Figure names all begin
"sig4-"; this generator refuses to emit anything else.

WHAT MAKES THIS GENERATOR DIFFERENT

The chapter it serves is about aliasing, and the folding formula is the thing
the chapter says people misapply. So nothing here uses it. Every claim of the
form "that component lands at F" is settled by `alias_by_dft`, which builds the
actual sample sequence, takes its real DFT -- whose bins already span 0 to
f_s/2 -- and reports the bin that holds the peak. The record length is chosen
so the tone falls exactly on a bin, so the peak location is exact rather than
interpolated, and an assertion checks that the peak really is a single sharp
line before its position is believed.

Everything else follows the same discipline. Noise folding is measured off
simulated noise, not predicted. Jitter SNR is measured off a jittered sample
set. Scalloping loss is measured off a DFT sweep. Filter orders are confirmed
against `scipy.signal.buttord`/`ellipord`, which is an independent code path
from the magnitude expression the lesson prints.

Nothing is traced, scanned or adapted from a reference work: every curve is
computed here from an equation the lesson writes down.

Usage:
    python3 scripts/gen_fe_ee_d33.py             # verify, then draw all
    python3 scripts/gen_fe_ee_d33.py --verify    # verify only, draw nothing
    python3 scripts/gen_fe_ee_d33.py sig4-jitter # draw a subset
"""
from __future__ import annotations

import pathlib
import sys
from fractions import Fraction

import numpy as np
from scipy import signal

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "sig4-"

#: every alias this run located by sampling and transforming
ALIAS_LOG: list[tuple[float, float, float]] = []


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# the one measurement everything in this chapter rests on
# ---------------------------------------------------------------------------
def alias_by_dft(f: float, fs: float, min_len: int = 4096, phase: float = 0.311) -> float:
    """Where does a tone at `f` land once sampled at `fs`? Measure it.

    The record length is a multiple of the denominator of f/fs, so the tone sits
    exactly on a DFT bin and the peak index IS the answer -- no interpolation and,
    more to the point, no folding arithmetic. `rfft` returns bins 0..fs/2, which
    is precisely the band a real sampler can represent, so the fold happens in
    the physics of the sample sequence rather than in a formula.
    """
    den = Fraction(f / fs).limit_denominator(10 ** 7).denominator
    n_pts = den * int(np.ceil(min_len / den))
    n = np.arange(n_pts)
    mag = np.abs(np.fft.rfft(np.cos(2 * np.pi * f * n / fs + phase)))
    k = int(np.argmax(mag))
    # a single sharp line: the peak carries essentially the whole tone
    assert mag[k] > 0.45 * n_pts, (f, fs, mag[k] / n_pts)
    neighbours = np.delete(mag, [k - 1, k, min(k + 1, len(mag) - 1)])
    assert neighbours.max() < 1e-6 * mag[k], (f, fs, neighbours.max() / mag[k])
    found = k * fs / n_pts
    ALIAS_LOG.append((f, fs, found))
    return found


def butter_db(f, fc, n):
    """Butterworth magnitude attenuation in dB, from the expression the lesson prints."""
    return 10 * np.log10(1 + (np.asarray(f, float) / fc) ** (2 * n))


def close(a, b, tol):
    return abs(float(a) - float(b)) <= tol


# ---------------------------------------------------------------------------
# verification of every number the chapter prints
# ---------------------------------------------------------------------------
def verify() -> None:
    say = print

    # -- 4.2 a tone at exactly half the sampling rate -----------------------
    fs = 2000.0
    n_pts = 4096
    n = np.arange(n_pts)
    amps = {}
    for deg in (0, 30, 45, 60, 90):
        x = np.cos(2 * np.pi * 1000.0 * n / fs + np.deg2rad(deg))
        amps[deg] = float(np.abs(np.fft.rfft(x)[n_pts // 2]) / n_pts)
    assert close(amps[0], 1.0, 1e-9)
    assert close(amps[30], 0.866025, 1e-6)
    assert close(amps[45], 0.707107, 1e-6)
    assert close(amps[60], 0.500000, 1e-9)
    assert close(amps[90], 0.0, 1e-9)
    assert close(20 * np.log10(amps[60]), -6.0206, 1e-3)
    say(f"  4.2 tone at f_s/2, measured amplitude vs phase: "
        f"{[round(amps[d], 4) for d in (0, 30, 45, 60, 90)]}")
    # step off the fold by 1 Hz and one second of record recovers it exactly
    x = np.cos(2 * np.pi * 999.0 * np.arange(2000) / fs + np.pi / 2)
    mag = np.abs(np.fft.rfft(x))
    assert close(int(np.argmax(mag)) * fs / 2000, 999.0, 1e-9)
    assert close(2 * mag.max() / 2000, 1.0, 1e-9)
    say("  4.2 same tone moved to 999 Hz, 1 s of record: peak 999.0 Hz, amplitude 1.000")

    # -- 4.3 the rate/frequency mix-up -------------------------------------
    got = [alias_by_dft(f, 300e3) for f in (40e3, 180e3, 260e3)]
    assert [round(g) for g in got] == [40000, 120000, 40000], got
    ok = [alias_by_dft(f, 600e3) for f in (40e3, 180e3, 260e3)]
    assert [round(g) for g in ok] == [40000, 180000, 260000], ok
    say(f"  4.3 at 300 kSa/s the three tones land at {[g/1e3 for g in got]} kHz; "
        f"at 600 kSa/s at {[g/1e3 for g in ok]} kHz")

    # -- 4.4 a signal nothing band-limits ----------------------------------
    f0, fs4, n4 = 100.0, 1000.0, 10000
    n = np.arange(n4)
    sq = np.sign(np.sin(2 * np.pi * f0 * n / fs4 + np.pi / 4))
    spec = np.abs(np.fft.rfft(sq)) * 2 / n4
    meas = {h: float(spec[int(round(h * 100.0 * n4 / fs4))]) for h in (1, 3, 5)}
    assert close(meas[1], 1.294427, 1e-6)
    assert close(meas[3], 0.494427, 1e-6)
    assert close(meas[5], 0.400000, 1e-6)
    ideal = {h: 4 / (np.pi * h) for h in (1, 3, 5)}
    errs = {h: 20 * np.log10(meas[h] / ideal[h]) for h in (1, 3, 5)}
    assert close(errs[1], 0.1434, 1e-3)
    assert close(errs[3], 1.3263, 1e-3)
    assert close(errs[5], 3.9224, 1e-3)
    assert close(meas[5] / ideal[5], np.pi / 2, 1e-9)
    say(f"  4.4 square-wave harmonics corrupted by {errs[1]:+.4f}, {errs[3]:+.4f}, "
        f"{errs[5]:+.4f} dB at 100/300/500 Hz")

    # -- 5.1 noise folding, measured ---------------------------------------
    rng = np.random.default_rng(3)
    base = rng.standard_normal(64 * 200000)
    fold = {}
    for m in (2, 4, 8, 16, 32, 40, 64):
        fold[m] = float(10 * np.log10(np.var(base[::m]) / np.var(base) * m))
        assert close(fold[m], 10 * np.log10(m), 0.02), (m, fold[m])
    assert close(fold[40], 16.0235, 5e-4)
    assert close(10 * np.log10(40), 16.0206, 1e-3)
    assert close(10 * np.log10(40) / 6.02, 2.6612, 1e-3)
    say(f"  5.1 noise folding at M=40 measured {fold[40]:.4f} dB "
        f"against {10*np.log10(40):.4f} dB predicted")
    grid = np.linspace(0, 4000.0, 4000001)
    for order in (1, 2, 3, 4, 6, 8):
        closed = (np.pi / (2 * order)) / np.sin(np.pi / (2 * order))
        integrated = float(np.trapz(1.0 / (1.0 + grid ** (2 * order)), grid))
        assert close(closed, integrated, 3e-4), (order, closed, integrated)
    assert close(np.pi / 2 * 50e3, 78539.8, 0.2)
    assert close(10 * np.log10(np.pi / 2), 1.9612, 1e-3)
    say("  5.1 Butterworth noise bandwidths agree with numerical integration to 3e-4")

    # -- 5.2 an interferer the signal does not contain ---------------------
    assert close(alias_by_dft(62150.0, 1000.0), 150.0, 1e-9)
    assert close(alias_by_dft(38600.0, 1000.0), 400.0, 1e-9)
    say("  5.2 62.15 kHz -> 150 Hz and 38.6 kHz -> 400 Hz at 1 kSa/s, both by DFT")

    # -- 6 the anti-alias specification ------------------------------------
    assert close(butter_db(1.0, 1.0, 7), 3.0103, 1e-4)
    assert close(butter_db(1.01, 1.0, 7), 3.3233, 1e-4)
    assert close(butter_db(1.01, 1.0, 14), 3.6573, 1e-4)
    assert close(butter_db(80e3, 50e3, 8), 32.6616, 1e-3)
    assert close(butter_db(80e3, 22810.16, 8), 87.194, 0.01)
    assert close(butter_db(20e3, 22810.16, 8), 0.5000, 1e-3)
    orders = {}
    for f_s in (44.1e3, 48e3, 60e3, 100e3, 200e3):
        b_ord, b_wn = signal.buttord(2 * np.pi * 20e3, 2 * np.pi * (f_s - 20e3),
                                     0.5, 80, analog=True)
        e_ord, _ = signal.ellipord(2 * np.pi * 20e3, 2 * np.pi * (f_s - 20e3),
                                   0.5, 80, analog=True)
        orders[f_s] = (int(b_ord), b_wn / (2 * np.pi), int(e_ord))
    assert orders[100e3][0] == 8 and orders[100e3][2] == 5
    assert close(orders[100e3][1], 22810.16, 0.1)
    assert orders[44.1e3][0] == 56 and orders[48e3][0] == 31
    assert orders[60e3][0] == 15 and orders[200e3][0] == 5
    assert orders[44.1e3][2] == 9 and orders[48e3][2] == 8
    assert orders[60e3][2] == 6 and orders[200e3][2] == 4
    say(f"  6   buttord confirms n=8, f_3dB={orders[100e3][1]:.2f} Hz for the worked spec; "
        f"elliptic n={orders[100e3][2]}")
    say(f"  6   defective 'cutoff at f_s/2' 8th-order gives only "
        f"{butter_db(80e3, 50e3, 8):.2f} dB where the same order properly "
        f"specified gives {butter_db(80e3, 22810.16, 8):.2f} dB")

    # -- 7 bandpass sampling ------------------------------------------------
    f_lo, f_hi = 20e6, 24e6
    band = f_hi - f_lo
    assert int(f_hi // band) == 6
    windows = []
    for k in range(1, 7):
        lo = 2 * f_hi / k
        hi = 2 * f_lo / (k - 1) if k > 1 else np.inf
        windows.append((k, lo, hi))
    assert close(windows[5][1], 8e6, 1.0) and close(windows[5][2], 8e6, 1.0)
    assert close(windows[3][1], 12e6, 1.0) and close(windows[3][2], 13.3333e6, 50.0)
    got = [alias_by_dft(f, 12.5e6) for f in (20.5e6, 21.3e6, 22.0e6, 23.4e6)]
    assert [round(g / 1e5) for g in got] == [45, 37, 30, 16], got
    assert len(set(got)) == 4                                   # nothing collides
    assert close(alias_by_dft(20e6, 12.5e6), 5.0e6, 1.0)
    assert close(alias_by_dft(24e6, 12.5e6), 1.0e6, 1.0)
    collide = [alias_by_dft(f, 44e6) for f in (20.5e6, 23.5e6)]
    assert close(collide[0], collide[1], 1.0) and close(collide[0], 20.5e6, 1.0)
    say(f"  7   at 12.5 MSa/s the four tones land at {[g/1e6 for g in got]} MHz, order reversed")
    say(f"  7   at the forbidden 44 MSa/s, 20.5 and 23.5 MHz both land at "
        f"{collide[0]/1e6:.1f} MHz")

    # -- 8 jitter ------------------------------------------------------------
    rng = np.random.default_rng(11)
    n_j = 2_000_000
    f_sig, f_smp, sigma_t = 1e6, 5e6, 10e-12
    t = np.arange(n_j) / f_smp
    ideal_s = np.sin(2 * np.pi * f_sig * t)
    jittered = np.sin(2 * np.pi * f_sig * (t + rng.standard_normal(n_j) * sigma_t))
    snr_meas = 10 * np.log10(np.mean(ideal_s ** 2) / np.mean((jittered - ideal_s) ** 2))
    snr_pred = -20 * np.log10(2 * np.pi * f_sig * sigma_t)
    assert close(snr_meas, snr_pred, 0.02), (snr_meas, snr_pred)
    assert close(snr_pred, 84.0364, 1e-3)
    assert close((snr_pred - 1.76) / 6.02, 13.667, 1e-2)
    for bits, f_in, want in ((16, 1e5, 19.853), (16, 1e6, 1.985),
                             (14, 5e5, 15.880), (14, 1e6, 7.940),
                             (12, 1e6, 31.756)):
        s_max = 1 / (2 * np.pi * f_in * 10 ** ((6.02 * bits + 1.76) / 20)) * 1e12
        assert close(s_max, want, 5e-3), (bits, f_in, s_max)
    say(f"  8   jitter SNR measured {snr_meas:.4f} dB against {snr_pred:.4f} dB derived")

    # -- 9 decimation --------------------------------------------------------
    fs0, dec = 25.6e3, 8
    n = np.arange(25600)
    x = np.cos(2 * np.pi * 11.0e3 * n / fs0 + 0.4)
    before = int(np.argmax(np.abs(np.fft.rfft(x)))) * fs0 / len(n)
    y = x[::dec]
    after = int(np.argmax(np.abs(np.fft.rfft(y)))) * (fs0 / dec) / len(y)
    assert close(before, 11000.0, 1.0) and close(after, 1400.0, 1.0)
    assert close(alias_by_dft(11.0e3, 3.2e3), 1400.0, 1e-9)
    sources = [1000, 5400, 7400, 11800, 13800, 18200, 20200, 24600]
    for src in sources:
        assert close(alias_by_dft(float(src), 6400.0), 1000.0, 1e-9), src
    assert len(sources) == dec
    assert close(48000 * 147 / 160, 44100.0, 1e-9)
    say(f"  9   11 kHz reads {before/1e3:.1f} kHz before decimation and "
        f"{after/1e3:.1f} kHz after; {len(sources)} source tones share the 1 kHz output bin")

    # -- 10 scalloping -------------------------------------------------------
    n_dft = 4096
    n = np.arange(n_dft)

    def worst_scallop(win):
        low = 1e9
        for delta in np.linspace(0.0, 0.5, 501):
            x = np.cos(2 * np.pi * (100 + delta) * n / n_dft)
            peak = np.abs(np.fft.rfft(x * win)).max()
            low = min(low, peak / (n_dft / 2 * win.sum() / n_dft))
        return 20 * np.log10(low)

    rect = np.ones(n_dft)
    hann = np.hanning(n_dft + 1)[:-1]
    hamm = np.hamming(n_dft + 1)[:-1]
    black = np.blackman(n_dft + 1)[:-1]
    flat = signal.windows.flattop(n_dft, sym=False)
    losses = {"rect": worst_scallop(rect), "hann": worst_scallop(hann),
              "hamming": worst_scallop(hamm), "blackman": worst_scallop(black),
              "flattop": worst_scallop(flat)}
    assert close(losses["rect"], -3.92, 0.01)
    assert close(losses["hann"], -1.42, 0.01)
    assert close(losses["hamming"], -1.75, 0.01)
    assert close(losses["blackman"], -1.10, 0.01)
    assert close(losses["flattop"], -0.01, 0.01)
    assert close(20 * np.log10(2 / np.pi), -3.9224, 1e-3)
    assert close(2 / np.pi, 0.63662, 1e-5)
    n_s = 1024
    m = np.arange(n_s)
    half = np.cos(2 * np.pi * 102.5 * m / n_s)
    assert close(2 * np.abs(np.fft.rfft(half)).max() / n_s, 0.63796, 1e-4)
    eighth = np.cos(2 * np.pi * 102.375 * m / n_s)
    assert close(2 * np.abs(np.fft.rfft(eighth, 4 * n_s)).max() / n_s, 0.97440, 1e-4)
    assert close(20 * np.log10(np.sin(np.pi / 8) / (np.pi / 8)), -0.2244, 1e-3)
    assert close(10000 / 1024, 9.7656, 1e-3)
    assert close(10000 / 2048, 4.8828, 1e-3)
    hann_amp = np.abs(np.fft.rfft(half * np.hanning(n_s + 1)[:-1])).max() / (
        n_s / 2 * np.hanning(n_s + 1)[:-1].sum() / n_s)
    assert close(hann_amp, 0.84883, 1e-4)
    say(f"  10  worst-case scalloping measured: "
        f"{ {k: round(v, 2) for k, v in losses.items()} }")

    # -- 11 the oscilloscope -------------------------------------------------
    for depth, per_div, want in ((10e3, 10e-3, 1e5), (10e3, 1e-3, 1e6),
                                 (1e6, 10e-3, 1e7), (10e3, 100e-3, 1e4)):
        assert close(min(1e9, depth / (10 * per_div)), want, 1.0)
    assert close(alias_by_dft(1.203e6, 100e3), 3000.0, 1e-9)
    assert close(alias_by_dft(1.200e6, 100e3), 0.0, 1e-9)
    say("  11  1.203 MHz reads 3 kHz and 1.200 MHz reads dc on a 100 kSa/s capture")

    # -- 12/13/14 the problem sets -------------------------------------------
    assert close(alias_by_dft(47e3, 10e3), 3000.0, 1e-9)
    assert close(alias_by_dft(47e3, 9e3), 2000.0, 1e-9)
    assert close(alias_by_dft(25e3, 48e3), 23000.0, 1e-9)
    assert close(alias_by_dft(23e3, 24e3), 1000.0, 1e-9)
    fm = [(k, 2 * 108e6 / k, (2 * 88e6 / (k - 1)) if k > 1 else np.inf) for k in range(1, 6)]
    assert close(fm[4][1], 43.2e6, 1.0) and close(fm[4][2], 44e6, 1.0)
    assert close(fm[3][1], 54e6, 1.0) and close(fm[3][2], 58.6667e6, 100.0)
    bad = [alias_by_dft(f, 50e6) for f in (95e6, 105e6)]
    assert close(bad[0], bad[1], 1.0) and close(bad[0], 5e6, 1.0)
    good = [alias_by_dft(f, 43.5e6) for f in (88e6, 95e6, 105e6, 108e6)]
    assert [round(g / 1e6) for g in good] == [1, 8, 18, 21], good
    assert close(good[3] - good[0], 20e6, 1.0)
    assert close(alias_by_dft(2.35e6, 400e3), 50000.0, 1e-9)
    assert close(1 / (2 * np.pi * 5e5 * 10 ** ((6.02 * 14 + 1.76) / 20)) * 1e12, 15.880, 5e-3)
    assert close(7.4 / (2 * np.log10(7)), 4.3782, 1e-3)
    assert close(butter_db(35e3, 5e3, 5), 84.5098, 1e-3)
    assert close(butter_db(35e3, 5e3, 4), 67.6078, 1e-3)
    assert signal.buttord(2 * np.pi * 5e3, 2 * np.pi * 35e3, 0.5, 74, analog=True)[0] == 5
    assert close(3.7 / np.log10(1.5), 21.0118, 1e-3)
    assert close(butter_db(7.5e3, 5e3, 22), 77.4802, 1e-3)
    assert close(butter_db(7.5e3, 5e3, 21), 73.9583, 1e-3)
    assert signal.buttord(2 * np.pi * 5e3, 2 * np.pi * 7.5e3, 0.5, 74, analog=True)[0] == 24
    wifi = [(k, 2 * 2500e6 / k, (2 * 2400e6 / (k - 1)) if k > 1 else np.inf)
            for k in (24, 25)]
    assert close(wifi[0][1], 208.3333e6, 100.0) and close(wifi[0][2], 208.6957e6, 100.0)
    assert close((wifi[0][2] - wifi[0][1]) / wifi[0][1] * 100, 0.17391, 1e-4)
    assert close(wifi[1][1], 200e6, 1.0) and close(wifi[1][2], 200e6, 1.0)
    for src in (12e3, 18e3, 22e3):
        assert close(alias_by_dft(src, 10e3), 2000.0, 1e-9)
    assert close(alias_by_dft(11e3, 20e3), 9000.0, 1e-9)      # into the guard band
    assert close(alias_by_dft(13e3, 20e3), 7000.0, 1e-9)      # into the wanted band
    assert close(2 * np.abs(np.fft.rfft(eighth)).max() / n_s, 0.78397, 1e-4)
    raw_hann = np.abs(np.fft.rfft(half * np.hanning(n_s + 1)[:-1])).max() / (n_s / 2)
    assert close(raw_hann, 0.42441, 1e-4)
    assert close(20 * np.log10(raw_hann), -7.4437, 1e-3)
    assert close(6.02 * 10 + 1.76, 61.96, 1e-9)
    assert close(20e3 / 2 - 8e3, 2000.0, 1e-9)                # guard band width
    assert close(6.02 * 12 + 1.76, 74.0, 1e-9)
    assert close(6.02 * 14 + 1.76, 86.04, 1e-9)
    assert close(6.02 * 16 + 1.76, 98.08, 1e-9)
    say("  12-14 every problem-set answer reproduced")

    say(f"\n  {len(ALIAS_LOG)} alias locations settled by sampling + DFT; "
        f"the folding formula appears nowhere in this file")


# ---------------------------------------------------------------------------
# figures
# ---------------------------------------------------------------------------
@figure("sig4-critical-sampling")
def _critical(mode):
    """A tone at exactly f_s/2: what survives depends entirely on phase."""
    c = S.SERIES[mode]
    fs, f0 = 2000.0, 1000.0
    t = np.linspace(0, 3e-3, 3001)
    ts = np.arange(0, 3e-3 + 1e-12, 1 / fs)
    fig, ax = plt.subplots()
    for k, deg in enumerate((0, 60, 90)):
        ph = np.deg2rad(deg)
        ax.plot(t * 1e3, np.cos(2 * np.pi * f0 * t + ph), color=c[k], lw=1.5, alpha=0.85)
        ax.plot(ts * 1e3, np.cos(2 * np.pi * f0 * ts + ph), "o", color=c[k], ms=7)
        n = np.arange(4096)
        amp = np.abs(np.fft.rfft(np.cos(2 * np.pi * f0 * n / fs + ph))[2048]) / 4096
        assert close(amp, abs(np.cos(ph)), 1e-9)
        S.label_end(ax, 3.05, np.cos(2 * np.pi * f0 * 3e-3 + ph),
                    f"$\\varphi$ = {deg}°, reads {amp:.3f}", c[k], mode,
                    dy=[12, 0, -12][k])
    ax.axhline(0, color=S.GUIDE[mode], lw=1.0)
    S.note(ax, 0.05, -1.42, "samples every 0.5 ms; the 90° case returns nothing but zeros",
           mode)
    ax.set_xlabel("time  (ms)")
    ax.set_ylabel("amplitude  (V)")
    ax.set_title("One kilohertz sampled at two kilosamples per second")
    ax.set_xlim(0, 4.35)
    ax.set_ylim(-1.55, 1.35)
    S.strip(ax)
    return fig


@figure("sig4-aa-cutoff-defect")
def _cutoff(mode):
    """Putting the corner at f_s/2 buys nothing where it matters."""
    c = S.SERIES[mode]
    f = np.logspace(np.log10(2e3), np.log10(4e5), 3000)
    good, bad = 22810.16, 50e3
    fig, ax = plt.subplots()
    ax.plot(f / 1e3, -butter_db(f, good, 8), color=c[0], lw=2.0)
    ax.plot(f / 1e3, -butter_db(f, bad, 8), color=c[1], lw=2.0)
    S.label_end(ax, 400, -butter_db(4e5, good, 8), "$f_{3dB}$ = 22.8 kHz", c[0], mode,
                dy=8, ha="right")
    S.label_end(ax, 400, -butter_db(4e5, bad, 8), "$f_{3dB}$ = 50 kHz", c[1], mode,
                dy=-8, ha="right")
    for x, txt in ((20, "$f_p$"), (50, "$f_s/2$"), (80, "$f_s - f_p$")):
        ax.axvline(x, color=S.GUIDE[mode], lw=1.1, ls="--")
        S.note(ax, x * 1.05, -121, txt, mode, size=9)
    a_good, a_bad = butter_db(80e3, good, 8), butter_db(80e3, bad, 8)
    assert close(a_good, 87.1939, 1e-3) and close(a_bad, 32.6616, 1e-3)
    assert close(a_good - a_bad, 54.5323, 1e-3)
    S.note(ax, 2.4, -52, f"{a_good - a_bad:.1f} dB apart at 80 kHz,\nthe frequency that decides\nwhether the band is protected",
           mode, size=9)
    ax.set_xscale("log")
    ax.set_xlabel("frequency  (kHz)")
    ax.set_ylabel("response  (dB)")
    ax.set_title("Two eighth-order filters, one useless specification")
    ax.set_xlim(2, 400)
    ax.set_ylim(-125, 8)
    S.strip(ax)
    return fig


@figure("sig4-noise-folding")
def _noise(mode):
    """Broadband noise folded by an unfiltered sampler, measured."""
    c = S.SERIES[mode]
    rng = np.random.default_rng(3)
    base = rng.standard_normal(64 * 200000)
    ms = np.array([1, 2, 4, 8, 16, 32, 64])
    meas = np.array([10 * np.log10(np.var(base[::m]) / np.var(base) * m) for m in ms])
    theory = 10 * np.log10(ms.astype(float))
    assert np.abs(meas - theory).max() < 0.02, np.abs(meas - theory).max()
    fig, ax = plt.subplots()
    smooth = np.logspace(0, np.log10(80), 200)
    ax.plot(smooth, 10 * np.log10(smooth), color=c[0], lw=1.9)
    ax.plot(ms, meas, "o", color=c[1], ms=8)
    S.label_end(ax, 80, 10 * np.log10(80), "$10\\log_{10}M$, derived", c[0], mode, dy=10)
    S.label_end(ax, 64, meas[-1], "simulated noise, measured", c[1], mode, dy=-14,
                ha="right")
    ax.set_xscale("log")
    ax.set_xlabel("ratio of front-end noise bandwidth to $f_s/2$")
    ax.set_ylabel("rise in in-band noise density  (dB)")
    ax.set_title("Every unfiltered octave of front-end bandwidth costs 3 dB")
    ax.set_xlim(0.9, 110)
    ax.set_ylim(-1, 21)
    S.strip(ax)
    return fig


@figure("sig4-bandpass-zones")
def _zones(mode):
    """Permitted sampling rates for a 20-24 MHz band, and the gaps between them."""
    c = S.SERIES[mode]
    f_lo, f_hi = 20e6, 24e6
    fig, ax = plt.subplots()
    tops = []
    for k in range(1, 7):
        lo = 2 * f_hi / k / 1e6
        hi = (2 * f_lo / (k - 1) / 1e6) if k > 1 else 56.0
        tops.append((k, lo, hi))
        ax.barh(k, max(hi - lo, 0.14), left=lo, height=0.55, color=c[0], alpha=0.9)
    assert close(tops[5][1], 8.0, 1e-9) and close(tops[5][2], 8.0, 1e-9)
    assert close(tops[2][1], 16.0, 1e-9) and close(tops[2][2], 20.0, 1e-9)
    for lo, hi in ((8.0, 9.6), (10.0, 12.0), (13.3333, 16.0), (20.0, 24.0), (40.0, 48.0)):
        ax.axvspan(lo, hi, color=S.GUIDE[mode], alpha=0.16)
    ax.axvline(8.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    ax.axvline(48.0, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 8.25, 6.75, "$2B$ = 8", mode, size=9)
    S.note(ax, 45.0, 6.75, "$2f_H$ = 48", mode, size=9)
    ax.plot([12.5], [4.62], "v", color=c[1], ms=9)
    S.note(ax, 13.4, 4.52, "12.5 works", mode, size=9)
    ax.plot([44.0], [1.62], "v", color=c[2], ms=9)
    S.note(ax, 44.9, 1.52, "44 does not", mode, size=9)
    S.note(ax, 24.0, 6.75, "shaded: no $n$ permits this rate", mode, size=9)
    ax.set_yticks(range(1, 7))
    ax.set_ylabel("replica index $n$")
    ax.set_xlabel("sampling rate  (MSa/s)")
    ax.set_title("Where a 20-24 MHz band may be sampled, and where it may not")
    ax.set_xlim(6, 57)
    ax.set_ylim(0.3, 7.4)
    S.strip(ax)
    return fig


@figure("sig4-jitter-snr")
def _jitter(mode):
    """The jitter ceiling, derived and then measured at three points."""
    c = S.SERIES[mode]
    f = np.logspace(4, 8, 400)
    fig, ax = plt.subplots()
    rng = np.random.default_rng(11)
    for k, sigma in enumerate((1e-12, 10e-12, 100e-12)):
        ax.plot(f / 1e6, -20 * np.log10(2 * np.pi * f * sigma), color=c[k], lw=1.9)
        S.label_end(ax, 100, -20 * np.log10(2 * np.pi * 1e8 * sigma),
                    f"$\\sigma_t$ = {sigma*1e12:g} ps", c[k], mode, dy=[10, 0, -10][k])
        for f_in in (1e5, 1e6, 1e7):
            n = 400000
            t = np.arange(n) / (4 * 1e7)
            ideal = np.sin(2 * np.pi * f_in * t)
            jit = np.sin(2 * np.pi * f_in * (t + rng.standard_normal(n) * sigma))
            got = 10 * np.log10(np.mean(ideal ** 2) / np.mean((jit - ideal) ** 2))
            want = -20 * np.log10(2 * np.pi * f_in * sigma)
            assert abs(got - want) < 0.25, (sigma, f_in, got, want)
            ax.plot([f_in / 1e6], [got], "o", color=c[k], ms=6)
    for bits, txt in ((16, "16 bit"), (12, "12 bit")):
        ax.axhline(6.02 * bits + 1.76, color=S.GUIDE[mode], lw=1.1, ls="--")
        S.note(ax, 0.05, 6.02 * bits + 1.76 + 1.8, f"{txt} ideal SNR", mode, size=9)
    ax.set_xscale("log")
    ax.set_xlabel("input frequency  (MHz)")
    ax.set_ylabel("SNR ceiling set by jitter  (dB)")
    ax.set_title("Jitter is charged against the input frequency, not the clock rate")
    ax.set_xlim(0.01, 160)
    ax.set_ylim(20, 130)
    S.strip(ax)
    return fig


@figure("sig4-decimation-alias")
def _decim(mode):
    """Discarding samples is sampling: the tone moves."""
    c = S.SERIES[mode]
    fs0, dec = 25.6e3, 8
    n = np.arange(25600)
    x = np.cos(2 * np.pi * 11.0e3 * n / fs0 + 0.4)
    spec = np.abs(np.fft.rfft(x)) * 2 / len(n)
    faxis = np.arange(len(spec)) * fs0 / len(n)
    y = x[::dec]
    spec_d = np.abs(np.fft.rfft(y)) * 2 / len(y)
    faxis_d = np.arange(len(spec_d)) * (fs0 / dec) / len(y)
    assert close(faxis[int(np.argmax(spec))], 11000.0, 1.0)
    assert close(faxis_d[int(np.argmax(spec_d))], 1400.0, 1.0)
    fig, axes = plt.subplots(2, 1, sharex=True, figsize=(7.2, 5.0))
    axes[0].plot(faxis / 1e3, spec, color=c[0], lw=1.6)
    S.label_end(axes[0], 11.0, 1.0, "11.0 kHz, where it really is", c[0], mode,
                dy=-2, ha="left")
    axes[0].set_ylabel("before  (V)")
    axes[0].set_title("Decimation by eight, with no filter in front of it")
    axes[1].plot(faxis_d / 1e3, spec_d, color=c[1], lw=1.6)
    S.label_end(axes[1], 1.4, 1.0, "1.4 kHz, where the record says it is", c[1], mode,
                dy=-2, ha="left")
    axes[1].set_ylabel("after  (V)")
    axes[1].set_xlabel("frequency  (kHz)")
    for ax, edge in zip(axes, (12.8, 1.6)):
        ax.axvline(edge, color=S.GUIDE[mode], lw=1.2, ls="--")
        S.note(ax, edge + 0.2, 0.55, f"new limit {edge} kHz" if edge == 1.6
               else f"old limit {edge} kHz", mode, size=9)
        ax.set_xlim(0, 14.5)
        ax.set_ylim(0, 1.28)
        S.strip(ax)
    return fig


@figure("sig4-scalloping")
def _scallop(mode):
    """The DFT samples a continuum; between the pickets the reading sags."""
    c = S.SERIES[mode]
    n_dft = 64
    n = np.arange(n_dft)
    fine = np.arange(n_dft * 64)
    fig, ax = plt.subplots()
    for k, delta in enumerate((0.0, 0.5)):
        x = np.cos(2 * np.pi * (16 + delta) * n / n_dft)
        dense = np.abs(np.fft.rfft(x, n_dft * 64)) * 2 / n_dft
        grid = np.arange(len(dense)) / 64.0
        keep = (grid > 11) & (grid < 21)
        ax.plot(grid[keep], dense[keep], color=c[k], lw=1.5, alpha=0.9)
        coarse = np.abs(np.fft.rfft(x)) * 2 / n_dft
        ax.plot(np.arange(len(coarse)), coarse, "o", color=c[k], ms=7)
        peak = coarse.max()
        if delta == 0.0:
            assert close(peak, 1.0, 1e-9)
        else:
            assert close(peak, 0.63764, 2e-4), peak
        S.label_end(ax, 20.6, peak, f"tone at bin {16 + delta}, read {peak:.3f}",
                    c[k], mode, dy=[6, -6][k], ha="right")
    ax.axhline(2 / np.pi, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 11.2, 2 / np.pi + 0.03, "$2/\\pi$ = 0.637, the worst reading", mode, size=9)
    ax.set_xlabel("DFT bin index")
    ax.set_ylabel("magnitude read from the bin  (V)")
    ax.set_title("Where a tone sits between bins decides what amplitude you read")
    ax.set_xlim(11, 21)
    ax.set_ylim(0, 1.18)
    S.strip(ax)
    return fig


@figure("sig4-scope-rate")
def _scope(mode):
    """A scope's real sampling rate is set by memory divided by screen time."""
    c = S.SERIES[mode]
    per_div = np.logspace(-8, 0, 400)
    fig, ax = plt.subplots()
    for k, (depth, name) in enumerate(((10e3, "10 kpt memory"), (1e6, "1 Mpt memory"))):
        rate = np.minimum(1e9, depth / (10 * per_div))
        ax.plot(per_div, rate, color=c[k], lw=2.0)
        S.label_end(ax, 1.0, depth / 10.0, name, c[k], mode, ha="right", dy=10)
    ax.axhline(2 * 1.203e6, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax, 1.5e-8, 2 * 1.203e6 * 1.35,
           "rate needed to see a 1.203 MHz ripple honestly", mode, size=9)
    ax.fill_between([1e-8, 1.0], 1e2, 2 * 1.203e6, color=S.GUIDE[mode], alpha=0.14)
    S.note(ax, 1.5e-8, 3e3, "anything captured down here is a fiction", mode, size=9)
    for depth in (10e3, 1e6):
        cross = depth / (10 * 2 * 1.203e6)
        assert 1e-8 < cross < 1.0
    assert close(10e3 / (10 * 10e-3), 1e5, 1.0)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("timebase  (s/div)")
    ax.set_ylabel("effective sampling rate  (Sa/s)")
    ax.set_title("The slow sweep is a different sampler from the fast one")
    ax.set_xlim(1e-8, 1.0)
    ax.set_ylim(1e2, 3e9)
    S.strip(ax)
    return fig


# ---------------------------------------------------------------------------
def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    args = [a for a in sys.argv[1:]]
    print("verifying every number the chapter prints")
    verify()
    if "--verify" in args:
        return 0
    prefix = next((a for a in args if not a.startswith("-")), PREFIX)
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    print()
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
