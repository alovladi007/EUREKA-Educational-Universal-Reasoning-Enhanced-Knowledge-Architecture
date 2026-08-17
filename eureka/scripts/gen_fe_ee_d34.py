#!/usr/bin/env python3
"""Depth-wave-34 figures for the FE Electrical and Computer course:
the Linear Systems chapter on CONSTRUCTING and READING a Bode plot
(fee_bode_sketching).

Contract, identical to the other gen_fe_ee_d*.py generators: every curve is
COMPUTED here, from the same equations the lesson writes out. Nothing is
traced, scanned, redrawn or adapted from a handbook or a vendor's slide.

This chapter has one extra obligation on top of that. Its subject is the SIZE
OF THE ERROR the straight-line construction commits, so a figure that drew the
"exact" curve from the asymptotic rule would be circular and worthless. Every
exact magnitude and phase in this file is therefore obtained by evaluating the
complex rational function at that frequency - a complex division, an
arctangent, an atan2 - and never by applying a slope-and-corner rule. The
asymptotes are computed separately, from the rule, and the two are subtracted.
Where a frequency is quoted (a crossover, a resonant peak) it is SOLVED for,
by bisection on the exact magnitude or by a closed form that is then checked
against bisection, never read off a corner.

Every number the lesson prints is asserted here at a tight tolerance.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from the lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 eureka/scripts/gen_fe_ee_d34.py            # all figures
    python3 eureka/scripts/gen_fe_ee_d34.py lin4-log   # names with that prefix
    python3 eureka/scripts/gen_fe_ee_d34.py --numbers  # print the audit dump
"""
from __future__ import annotations

import cmath
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

REGISTRY: dict[str, object] = {}
PREFIX = "lin4-"


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only the {PREFIX} prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ------------------------------------------------------------------ exact
# The ONLY route to an exact magnitude or phase in this file. It evaluates the
# complex number and takes its modulus and argument. No slope rule is involved.
def mag_db(H, w: float) -> float:
    return 20.0 * math.log10(abs(H(w)))


def phase_deg(H, w: float) -> float:
    return math.degrees(cmath.phase(H(w)))


def unwrapped_phase(H, w: float, wmin: float = 1e-6, n: int = 20000) -> float:
    """Continuous phase at w, accumulated from a low reference frequency.

    cmath.phase folds into (-pi, pi], which turns a -237 degree lag into +123.
    Accumulating the increment along a fine log sweep keeps the branch, and the
    result is cross-checked against the analytic sum of per-factor angles
    wherever the lesson quotes it.
    """
    grid = np.geomspace(wmin, w, n)
    ang = np.unwrap([cmath.phase(H(x)) for x in grid])
    return math.degrees(ang[-1])


def solve_mag(H, target_db: float, lo: float, hi: float) -> float:
    """Bisect on the EXACT magnitude for the frequency where it equals a level.

    This is the routine that exists because a sibling chapter published a gain
    crossover read off a corner by eye. A crossing is solved for; it is never
    read.
    """
    f = lambda w: mag_db(H, w) - target_db  # noqa: E731
    assert f(lo) * f(hi) < 0, (lo, hi, f(lo), f(hi))
    for _ in range(300):
        mid = math.sqrt(lo * hi)
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return math.sqrt(lo * hi)


def argmax_mag(H, lo: float, hi: float) -> tuple[float, float]:
    """Golden-section search on the exact magnitude; returns (w, dB)."""
    inv = (math.sqrt(5.0) - 1.0) / 2.0
    a, b = math.log(lo), math.log(hi)
    c, d = b - inv * (b - a), a + inv * (b - a)
    for _ in range(400):
        if mag_db(H, math.exp(c)) < mag_db(H, math.exp(d)):
            a = c
        else:
            b = d
        c, d = b - inv * (b - a), a + inv * (b - a)
    w = math.exp((a + b) / 2)
    return w, mag_db(H, w)


# ------------------------------------------------- the straight-line rules
def pole_asym_db(w: float, p: float) -> float:
    """Straight-line magnitude of 1/(1 + jw/p): flat, then -20 dB/decade."""
    return 0.0 if w <= p else -20.0 * math.log10(w / p)


def zero_asym_db(w: float, z: float) -> float:
    return 0.0 if w <= z else 20.0 * math.log10(w / z)


def pair_asym_db(w: float, wn: float) -> float:
    """Straight-line magnitude of a complex pole pair: flat, then -40."""
    return 0.0 if w <= wn else -40.0 * math.log10(w / wn)


def ramp_deg(w: float, c: float, sign: float, total: float = 90.0) -> float:
    """The one-decade phase ramp: 0 below c/10, `total` above 10c, straight in
    between on a log-frequency axis."""
    if w <= c / 10.0:
        return 0.0
    if w >= 10.0 * c:
        return sign * total
    return sign * total * (math.log10(w / c) + 1.0) / 2.0


# ------------------------------------------------------- systems in play
def real_pole(p: float):
    return lambda w: 1.0 / (1.0 + 1j * w / p)


def two_poles(a: float, b: float):
    return lambda w: 1.0 / ((1.0 + 1j * w / a) * (1.0 + 1j * w / b))


def pair(wn: float, zeta: float):
    return lambda w: 1.0 / (1.0 - (w / wn) ** 2 + 2j * zeta * w / wn)


# The assembly example. All four primitive factors appear exactly once:
# a constant 40, one pole at the origin, a real zero at 2, a real pole at 40,
# and a complex pair at wn = 30 with zeta = 0.25.
G_K, G_Z, G_P, G_WN, G_ZETA = 40.0, 2.0, 40.0, 30.0, 0.25


def G(w: float) -> complex:
    s = 1j * w
    return (G_K * (1.0 + s / G_Z)) / (
        s * (1.0 + s / G_P) * (1.0 + s / 60.0 + s * s / 900.0)
    )


def G_asym_db(w: float) -> float:
    return (
        20.0 * math.log10(G_K / w)
        + zero_asym_db(w, G_Z)
        + pole_asym_db(w, G_P)
        + pair_asym_db(w, G_WN)
    )


def G_asym_deg(w: float) -> float:
    return (
        -90.0
        + ramp_deg(w, G_Z, +1.0)
        + ramp_deg(w, G_P, -1.0)
        + ramp_deg(w, G_WN, -1.0, 180.0)
    )


def G_exact_deg(w: float) -> float:
    """Analytic per-factor angle sum - the independent route to the phase that
    unwrapped_phase() is checked against."""
    u = w / G_WN
    return (
        math.degrees(math.atan(w / G_Z))
        - 90.0
        - math.degrees(math.atan(w / G_P))
        - math.degrees(math.atan2(2.0 * G_ZETA * u, 1.0 - u * u))
    )


def G_factor_db(w: float) -> tuple[float, float, float, float]:
    u = w / G_WN
    return (
        20.0 * math.log10(G_K / w),
        10.0 * math.log10(1.0 + (w / G_Z) ** 2),
        -10.0 * math.log10(1.0 + (w / G_P) ** 2),
        -10.0 * math.log10((1.0 - u * u) ** 2 + (2.0 * G_ZETA * u) ** 2),
    )


# The crossover example: L(s) = K/(s(1 + s/a)) with K = a, so the straight
# lines cross 0 dB exactly at the corner and an eyeballed answer is `a`.
L_A = 20.0


def L(w: float) -> complex:
    s = 1j * w
    return L_A / (s * (1.0 + s / L_A))


# The identification example, read back off its own straight lines.
R_K, R_Z, R_P = 2.0, 5.0, 50.0


def R(w: float) -> complex:
    s = 1j * w
    return R_K * s / ((1.0 + s / R_Z) * (1.0 + s / R_P))


def R_asym_db(w: float) -> float:
    return 20.0 * math.log10(R_K * w) + pole_asym_db(w, R_Z) + pole_asym_db(w, R_P)


# All-pass and delay: two ways to leave a magnitude plot untouched.
AP_A, DELAY_T = 4.0, 0.5


def allpass_deg(w: float) -> float:
    return -2.0 * math.degrees(math.atan(w / AP_A))


def delay_deg(w: float) -> float:
    return -math.degrees(w * DELAY_T)


# ------------------------------------------------------------- shared facts
DB2 = 20.0 * math.log10(2.0)          # 6.0206 dB, an amplitude doubling
DB2_POWER = 10.0 * math.log10(2.0)    # 3.0103 dB, a power doubling
ROOT5 = math.sqrt(5.0)
GOLDEN_W = L_A * math.sqrt((ROOT5 - 1.0) / 2.0)


def pole_mag_error(u: float) -> float:
    """Exact minus straight line, in dB, for 1/(1 + ju)."""
    return mag_db(real_pole(1.0), u) - pole_asym_db(u, 1.0)


def pole_phase_error(u: float) -> float:
    """Straight-line ramp minus exact, in degrees, for 1/(1 + ju)."""
    return ramp_deg(u, 1.0, -1.0) - phase_deg(real_pole(1.0), u)


def peak_db(zeta: float) -> float:
    return 20.0 * math.log10(1.0 / (2.0 * zeta * math.sqrt(1.0 - zeta * zeta)))


def peak_ratio(zeta: float) -> float:
    return math.sqrt(1.0 - 2.0 * zeta * zeta)


def zeta_from_peak(db: float) -> float:
    """Invert the peak height. 4 z^2 (1 - z^2) = 10^(-db/10)."""
    q = 10.0 ** (-db / 10.0)
    return math.sqrt((1.0 - math.sqrt(1.0 - q)) / 2.0)


# =============================================================== assertions
def audit(verbose: bool = False) -> None:
    say = print if verbose else (lambda *a, **k: None)

    # --- decibels, both conventions -------------------------------------
    assert abs(DB2 - 6.0206) < 5e-5, DB2
    assert abs(DB2_POWER - 3.0103) < 5e-5, DB2_POWER
    assert abs(DB2 - 2.0 * DB2_POWER) < 1e-12
    assert abs(20.0 * math.log10(0.35) + 9.1186) < 5e-5
    assert abs(10.0 * math.log10(0.35 ** 2) - 20.0 * math.log10(0.35)) < 1e-12
    assert abs(10.0 * math.log10(0.35) + 4.5593) < 5e-5
    assert abs(math.sqrt(0.35) - 0.591608) < 5e-7
    assert abs(20.0 * math.log10(1.0 / math.sqrt(2.0)) + 3.0103) < 5e-5
    assert abs(20.0 * math.log10(10.0) - 20.0) < 1e-12
    say(f"dB: amplitude x2 = {DB2:.4f}, power x2 = {DB2_POWER:.4f}")

    # --- real pole: magnitude error at corner, octave, decade -----------
    tab = {u: pole_mag_error(u) for u in (0.1, 0.25, 0.5, 1.0, 2.0, 4.0, 10.0)}
    assert abs(tab[1.0] + 3.0103) < 5e-5, tab[1.0]
    assert abs(tab[0.5] + 0.9691) < 5e-5, tab[0.5]
    assert abs(tab[2.0] + 0.9691) < 5e-5, tab[2.0]
    assert abs(tab[0.25] + 0.2633) < 5e-5, tab[0.25]
    assert abs(tab[4.0] + 0.2633) < 5e-5, tab[4.0]
    assert abs(tab[0.1] + 0.0432) < 5e-5, tab[0.1]
    assert abs(tab[10.0] + 0.0432) < 5e-5, tab[10.0]
    # the reciprocal symmetry the lesson proves
    for u in (1.7, 3.3, 8.0, 25.0):
        assert abs(pole_mag_error(u) - pole_mag_error(1.0 / u)) < 1e-12
    # the corner slope is exactly half the ultimate slope
    h = 1e-6
    slope = (mag_db(real_pole(1.0), 10 ** h) - mag_db(real_pole(1.0), 10 ** -h)) / (2 * h)
    assert abs(slope + 10.0) < 1e-6, slope
    say(f"real pole error dB: {[round(tab[u], 4) for u in sorted(tab)]}")

    # --- real pole: phase and the one-decade ramp -----------------------
    assert abs(phase_deg(real_pole(1.0), 0.1) + 5.7106) < 5e-5
    assert abs(phase_deg(real_pole(1.0), 1.0) + 45.0) < 1e-12
    assert abs(phase_deg(real_pole(1.0), 10.0) + 84.2894) < 5e-5
    assert abs(pole_phase_error(0.1) - 5.7106) < 5e-5
    assert abs(pole_phase_error(10.0) + 5.7106) < 5e-5
    assert abs(pole_phase_error(1.0)) < 1e-12
    assert abs(pole_phase_error(0.5) + 4.8886) < 5e-5
    assert abs(pole_phase_error(2.0) - 4.8886) < 5e-5
    # interior stationary point of the ramp error: u^2 - (4 ln10 / pi) u + 1 = 0
    cc = 4.0 * math.log(10.0) / math.pi
    u_star = (cc + math.sqrt(cc * cc - 4.0)) / 2.0
    assert abs(cc - 2.9317424) < 5e-7, cc
    assert abs(u_star - 2.5376820) < 5e-7, u_star
    assert abs(pole_phase_error(u_star) - 5.2929) < 5e-5, pole_phase_error(u_star)
    assert abs(pole_phase_error(1.0 / u_star) + 5.2929) < 5e-5
    # ... and the two stationary points really are the interior extremes,
    # while the largest error of all sits on the ramp's own break points
    inner = max(abs(pole_phase_error(x)) for x in np.geomspace(0.15, 8.0, 60001))
    assert abs(inner - 5.292890) < 1e-4, inner
    everywhere = max(abs(pole_phase_error(x)) for x in np.geomspace(0.01, 100.0, 60001))
    assert abs(everywhere - 5.710593) < 1e-3, everywhere
    say(f"phase ramp: 5.7106 at the breaks, {pole_phase_error(u_star):.4f} interior")

    # --- errors of separate factors add ---------------------------------
    H2 = two_poles(10.0, 20.0)
    for w in (5.0, 10.0, math.sqrt(200.0), 20.0, 40.0, 100.0, 3.7, 63.1):
        tot = mag_db(H2, w) - (pole_asym_db(w, 10.0) + pole_asym_db(w, 20.0))
        add = pole_mag_error(w / 10.0) + pole_mag_error(w / 20.0)
        assert abs(tot - add) < 1e-12, (w, tot, add)
    assert abs(mag_db(H2, 10.0) + 3.9794) < 5e-5, mag_db(H2, 10.0)
    assert abs(mag_db(H2, 20.0) + 10.0) < 1e-9, mag_db(H2, 20.0)
    assert abs(mag_db(H2, math.sqrt(200.0)) + 6.5321) < 5e-5
    assert abs(phase_deg(H2, math.sqrt(200.0)) + 90.0) < 1e-9
    assert abs(pole_mag_error(1.0) + pole_mag_error(0.5) + 3.9794) < 5e-5
    assert abs(pole_mag_error(2.0) + pole_mag_error(1.0) + 3.9794) < 5e-5
    assert abs(pole_mag_error(math.sqrt(2.0)) + 1.7609) < 5e-5
    say(f"two poles at 10 and 20: {mag_db(H2, 10.0):.4f} dB at the first corner")

    # --- the complex pair ------------------------------------------------
    for z in (0.05, 0.1, 0.2, 0.25, 0.3, 0.5):
        w_num, db_num = argmax_mag(pair(1.0, z), 1e-3, 0.9999999)
        assert abs(w_num - peak_ratio(z)) < 1e-6, (z, w_num, peak_ratio(z))
        assert abs(db_num - peak_db(z)) < 1e-9, (z, db_num, peak_db(z))
    assert abs(peak_db(0.25) - 6.3009) < 5e-5, peak_db(0.25)
    assert abs(peak_ratio(0.25) - 0.935414) < 5e-7
    assert abs(mag_db(pair(1.0, 0.25), 1.0) - 6.0206) < 5e-5
    assert abs(phase_deg(pair(1.0, 0.25), 1.0) + 90.0) < 1e-9
    assert abs(peak_db(0.1) - 14.0230) < 5e-5, peak_db(0.1)
    assert abs(peak_db(0.5) - 1.2494) < 5e-5, peak_db(0.5)
    assert abs(peak_ratio(0.5) - 0.707107) < 5e-7
    # at zeta = 1/sqrt(2) the peak frequency has retreated to zero: no peak
    assert abs(1.0 - 2.0 * (1.0 / math.sqrt(2.0)) ** 2) < 1e-15
    assert abs(peak_db(0.7071067)) < 1e-11, peak_db(0.7071067)
    # inverting an 8 dB peak
    z8 = zeta_from_peak(8.0)
    assert abs(z8 - 0.203299) < 5e-7, z8
    assert abs(peak_db(z8) - 8.0) < 1e-12
    assert abs(peak_ratio(z8) - 0.957778) < 5e-7
    wn8 = 10.0 / peak_ratio(z8)
    assert abs(wn8 - 10.440832) < 5e-7, wn8
    w_chk, db_chk = argmax_mag(pair(wn8, z8), 1.0, 10.4408)
    assert abs(w_chk - 10.0) < 1e-6, w_chk
    assert abs(db_chk - 8.0) < 1e-9, db_chk
    say(f"pair zeta=0.25: peak {peak_db(0.25):.4f} dB at {peak_ratio(0.25):.6f} wn")

    # --- the assembled plot ---------------------------------------------
    for w in (0.2, 1.0, 2.0, 10.0, 20.0, 30.0, 40.0, 60.0, 100.0, 300.0):
        assert abs(sum(G_factor_db(w)) - mag_db(G, w)) < 1e-11, w
        assert abs(unwrapped_phase(G, w) - G_exact_deg(w)) < 2e-4, (
            w, unwrapped_phase(G, w), G_exact_deg(w))
    assert abs(mag_db(G, 2.0) - 29.0539) < 5e-5, mag_db(G, 2.0)
    assert abs(G_asym_db(2.0) - 26.0206) < 5e-5
    assert abs(mag_db(G, 2.0) - G_asym_db(2.0) - 3.0333) < 5e-5
    assert abs(mag_db(G, 30.0) - 30.1223) < 5e-5, mag_db(G, 30.0)
    assert abs(G_asym_db(30.0) - 26.0206) < 5e-5
    assert abs(mag_db(G, 30.0) - G_asym_db(30.0) - 4.1017) < 5e-5
    assert abs(mag_db(G, 40.0) - 22.8118) < 5e-5, mag_db(G, 40.0)
    assert abs(G_asym_db(40.0) - 21.0231) < 5e-5, G_asym_db(40.0)
    assert abs(mag_db(G, 40.0) - G_asym_db(40.0) - 1.7888) < 5e-5
    fac30 = G_factor_db(30.0)
    assert abs(fac30[3] - 6.0206) < 5e-5, fac30
    assert abs(fac30[2] + 1.9382) < 5e-5, fac30
    assert abs(fac30[1] - 23.5411) < 5e-5, fac30
    assert abs(fac30[0] - 2.4988) < 5e-5, fac30
    err30 = (fac30[3] - 0.0) + (fac30[2] - 0.0) + (fac30[1] - zero_asym_db(30.0, 2.0))
    assert abs(err30 - 4.1017) < 5e-5, err30
    assert abs(G_exact_deg(30.0) + 130.6840) < 5e-5, G_exact_deg(30.0)
    assert abs(G_asym_deg(30.0) + 129.3778) < 5e-5, G_asym_deg(30.0)
    assert abs(G_exact_deg(10.0) + 35.9658) < 5e-5, G_exact_deg(10.0)
    assert abs(G_asym_deg(10.0) + 78.5127) < 5e-5, G_asym_deg(10.0)
    w_g0 = solve_mag(G, 0.0, 40.0, 300.0)
    assert abs(w_g0 - 89.9468) < 5e-5, w_g0
    assert abs(mag_db(G, w_g0)) < 1e-12
    g_asym_cross = G_P * 10.0 ** (G_asym_db(G_P) / 60.0)
    assert abs(g_asym_cross - 89.6281) < 5e-5, g_asym_cross
    say(f"assembly: worst magnitude error 4.1017 dB at 30, 0 dB at {w_g0:.4f}")

    # worst errors over the whole assembled sweep, located by search rather
    # than assumed to sit on a corner - they do not
    w_mgap, _ = argmax_mag(lambda w: 10 ** ((mag_db(G, w) - G_asym_db(w)) / 20.0),
                           10.0, 40.0)
    mag_gap = mag_db(G, w_mgap) - G_asym_db(w_mgap)
    assert abs(w_mgap - 27.3128) < 5e-5, w_mgap
    assert abs(mag_gap - 4.6228) < 5e-5, mag_gap
    ws = np.geomspace(0.1, 1000.0, 60001)
    assert max(abs(mag_db(G, w) - G_asym_db(w)) for w in ws) <= mag_gap + 1e-6
    gaps = [(abs(G_asym_deg(w) - G_exact_deg(w)), w) for w in ws]
    ph_gap, w_pgap = max(gaps)
    assert abs(ph_gap - 49.9474) < 1e-3, ph_gap
    assert abs(w_pgap - 56.279) < 1e-2, w_pgap
    say(f"assembly worst: {mag_gap:.4f} dB at {w_mgap:.4f}, "
        f"{ph_gap:.4f} degrees at {w_pgap:.4f}")

    # --- the crossover that must be solved, not read --------------------
    assert abs(GOLDEN_W - 15.723028) < 5e-6, GOLDEN_W
    assert abs(abs(L(GOLDEN_W)) - 1.0) < 1e-12
    w_num = solve_mag(L, 0.0, 1.0, 100.0)
    assert abs(w_num - GOLDEN_W) < 1e-9, (w_num, GOLDEN_W)
    assert abs(mag_db(L, L_A) + 3.0103) < 5e-5, mag_db(L, L_A)
    assert abs((L_A - GOLDEN_W) / GOLDEN_W - 0.2720196) < 5e-7, (L_A - GOLDEN_W) / GOLDEN_W
    assert abs((L_A - GOLDEN_W) / L_A - 0.2138487) < 5e-7
    assert abs(phase_deg(L, GOLDEN_W) + 128.1727) < 5e-5, phase_deg(L, GOLDEN_W)
    assert abs((ROOT5 - 1.0) / 2.0 - 0.618034) < 5e-7
    say(f"crossover: solved {GOLDEN_W:.4f}, corner reading {L_A:.1f}")

    # --- reading a transfer function back off its own lines -------------
    assert abs(R_asym_db(1.0) - 6.0206) < 5e-5, R_asym_db(1.0)
    assert abs(R_asym_db(20.0) - 20.0) < 1e-9
    assert abs(20.0 * math.log10(R_K * R_Z) - 20.0) < 1e-9
    w_lf = solve_mag(R, 0.0, 0.05, 3.0)
    assert abs(w_lf - 0.502545) < 5e-7, w_lf
    w_pk, db_pk = argmax_mag(R, 1.0, 200.0)
    assert abs(w_pk - math.sqrt(R_Z * R_P)) < 1e-6, w_pk
    assert abs(w_pk - 15.811388) < 5e-7, w_pk
    assert abs(db_pk - 20.0 * math.log10(R_K * R_Z * R_P / (R_Z + R_P))) < 1e-9
    assert abs(db_pk - 19.1721) < 5e-5, db_pk
    assert abs(mag_db(R, R_Z) - 16.9465) < 5e-5, mag_db(R, R_Z)
    assert abs(mag_db(R, R_P) - 16.9465) < 5e-5, mag_db(R, R_P)
    # the peak sits where the two arctangents sum to 90 degrees, so the phase
    # of the band-pass is exactly zero there
    assert abs(phase_deg(R, math.sqrt(R_Z * R_P))) < 1e-13
    assert abs(phase_deg(R, w_pk)) < 1e-6
    assert abs(math.degrees(math.atan(math.sqrt(R_P / R_Z)))
               + math.degrees(math.atan(math.sqrt(R_Z / R_P))) - 90.0) < 1e-12
    assert abs(math.degrees(math.atan(math.sqrt(R_P / R_Z))) - 72.4516) < 5e-5
    say(f"identification: peak {db_pk:.4f} dB at {w_pk:.4f}, 0 dB at {w_lf:.6f}")

    # --- what magnitude alone cannot see --------------------------------
    for w in (0.3, 1.0, 4.0, 12.5, 40.0):
        ap = (1.0 - 1j * w / AP_A) / (1.0 + 1j * w / AP_A)
        assert abs(abs(ap) - 1.0) < 1e-14, w
        assert abs(abs(cmath.exp(-1j * w * DELAY_T)) - 1.0) < 1e-14, w
        assert abs(math.degrees(cmath.phase(ap)) - allpass_deg(w)) < 1e-9, w
    assert abs(allpass_deg(AP_A) + 90.0) < 1e-9
    assert abs(delay_deg(1.0) + 28.6479) < 5e-5, delay_deg(1.0)
    assert abs(allpass_deg(1.0) + 28.0725) < 5e-5, allpass_deg(1.0)
    assert abs(delay_deg(AP_A) + 114.5916) < 5e-5, delay_deg(AP_A)
    assert abs(allpass_deg(20.0) + 157.3801) < 5e-5, allpass_deg(20.0)
    assert abs(delay_deg(20.0) + 572.9578) < 5e-4, delay_deg(20.0)
    say(f"all-pass at 4 rad/s {allpass_deg(4.0):.4f} deg, delay {delay_deg(4.0):.4f} deg")

    # --- problem-set answers --------------------------------------------
    assert abs(20.0 * math.log10(0.05) + 26.0206) < 5e-5
    assert abs(10.0 ** (-14.0 / 20.0) - 0.199526) < 5e-7
    assert abs(20.0 * math.log10(8.0) - 18.0618) < 5e-5
    assert abs(3.0 * DB2 - 18.0618) < 5e-5
    P1 = lambda w: 100.0 / ((1j * w) * (1.0 + 1j * w / 25.0))  # noqa: E731
    w_p1 = solve_mag(P1, 0.0, 1.0, 200.0)
    assert abs(w_p1 - 46.9782) < 5e-5, w_p1
    assert abs(w_p1 - math.sqrt(625.0 * (math.sqrt(65.0) - 1.0) / 2.0)) < 1e-9
    assert abs(25.0 * 10 ** (20 * math.log10(100.0 / 25.0) / 40.0) - 50.0) < 1e-9
    assert abs(phase_deg(P1, w_p1) + 151.9798) < 5e-5, phase_deg(P1, w_p1)
    P2 = pair(50.0, 0.15)
    w_p2, db_p2 = argmax_mag(P2, 10.0, 49.9)
    assert abs(w_p2 - 50.0 * peak_ratio(0.15)) < 1e-6
    assert abs(w_p2 - 48.8621) < 5e-5, w_p2
    assert abs(db_p2 - 10.5564) < 5e-5, db_p2
    assert abs(mag_db(P2, 50.0) - 10.4576) < 5e-5, mag_db(P2, 50.0)
    P3 = two_poles(4.0, 4.0)
    assert abs(mag_db(P3, 4.0) + 6.0206) < 5e-5, mag_db(P3, 4.0)
    assert abs(phase_deg(P3, 4.0) + 90.0) < 1e-9
    assert abs(zeta_from_peak(3.0) - 0.383232) < 5e-7, zeta_from_peak(3.0)
    assert abs(peak_ratio(zeta_from_peak(3.0)) - 0.840397) < 5e-7
    P4 = lambda w: 1.0 / (1.0 + 1j * w / 6.0) ** 3  # noqa: E731
    assert abs(mag_db(P4, 6.0) + 9.0309) < 5e-5, mag_db(P4, 6.0)
    assert abs(phase_deg(P4, 6.0) + 135.0) < 1e-9
    w_p4 = solve_mag(P4, -20.0, 6.0, 200.0)
    assert abs(w_p4 - 11.4498) < 5e-5, w_p4
    assert abs(6.0 * 10 ** (20.0 / 60.0) - 12.9266) < 5e-5
    say("problem-set answers verified")

    audit_prose(say)
    say("audit: every printed number reproduced")


def audit_prose(say) -> None:
    """Every remaining number the lesson prints, asserted at four decimals.

    Split out only for length. Nothing here is read from the lesson; each value
    is recomputed from the equation the lesson states beside it.
    """
    def close(a, b, tol=5e-5):
        assert abs(a - b) < tol, (a, b)

    # ---- Section 4 -----------------------------------------------------
    close(-9.1186 / -4.5593, 2.0, 1e-4)
    close(math.log10(4.0), 0.602060)
    close(-36.0 / 0.602060, -59.7947)
    close(-59.7947 / 20.0, -2.9897)
    close(-59.7947 * 0.30103, -18.0000, 1e-3)
    close(3 * DB2, 18.0618)
    close(2 * DB2, 12.0412)
    close(20 * math.log10(50.0), 33.9794)

    # ---- Section 5 -----------------------------------------------------
    close(math.sqrt(40.0), 6.3246)
    close(math.degrees(math.atan(15.0)), 86.1859)
    close(math.degrees(math.atan(0.75)), 36.8699)
    close(abs(G(30.0)), 32.0710)
    close(20 * math.log10(abs(G(30.0))), 30.1223)
    close(2.4988 + 23.5411 - 1.9382 + 6.0206, 30.1223, 5e-4)
    close(-90 + 86.1859 - 36.8699 - 90, -130.6840, 5e-4)
    close(2 * G_ZETA / G_WN, 1.0 / 60.0, 1e-12)

    # ---- Section 6 -----------------------------------------------------
    for u, want in ((0.7071067811865476, -1.7609), (1.4142135623730951, -1.7609)):
        close(pole_mag_error(u), want)
    close(-10 * math.log10(1.01), -0.0432)
    close(-10 * math.log10(1.25), -0.9691)
    close(-10 * math.log10(5.0), -6.9897)
    close(-10 * math.log10(101.0), -20.0432)
    close(-20 * math.log10(4.0), -12.0412)
    close(-10 * math.log10(1 + 16.0), -12.3045)
    close(1.0 / (math.sqrt(2.0) * math.sqrt(1.25)), 0.632456)
    close(math.sqrt(2.0) * math.sqrt(1.25), math.sqrt(2.5), 1e-12)
    close(1.0 / math.sqrt(2.5), 0.632456)
    close(1.0 / math.sqrt(10.0), 0.316228)
    close(20 * math.log10(1.0 / math.sqrt(10.0)), -10.0000)
    close(3.0103 + 0.9691, 3.9794, 5e-4)
    close(3.0103 + 0.0432, 3.0535, 5e-4)
    close(10 ** (3.0 / 20.0), 1.4125)
    close(10 ** (3.0 / 40.0), 1.1885)

    # ---- Section 7 -----------------------------------------------------
    close(84.2894 - 5.7106, 78.5788, 5e-4)
    close(78.5788 / 90.0, 0.873098)
    ramp2 = lambda w: ramp_deg(w, 10.0, -1.0) + ramp_deg(w, 20.0, -1.0)  # noqa: E731
    exact2 = lambda w: phase_deg(two_poles(10.0, 20.0), w)               # noqa: E731
    for w, ex, rp in ((10.0, -71.5651, -76.4537), (math.sqrt(200.0), -90.0, -90.0),
                      (20.0, -108.4349, -103.5463), (50.0, -146.8887, -139.3610)):
        close(exact2(w), ex)
        close(ramp2(w), rp)
    close(ramp2(50.0) - exact2(50.0), 7.5277)
    close(pole_phase_error(math.sqrt(2.0)), 2.9624)
    close(pole_phase_error(1.0 / math.sqrt(2.0)), -2.9624)
    close(pole_phase_error(5.0), 2.2364)
    close(pole_phase_error(2.5), 5.2913)
    close(math.degrees(math.atan(math.sqrt(2.0))), 54.7356)
    close(math.degrees(math.atan(1.0 / math.sqrt(2.0))), 35.2644)
    close(math.degrees(math.atan(0.5)), 26.5651)
    close(math.degrees(math.atan(2.0)), 63.4349)

    # ---- Section 8 -----------------------------------------------------
    z, wn = 0.15, 50.0
    close(2 * z / wn, 0.006, 1e-12)
    close(wn * peak_ratio(z), 48.8621)
    close(peak_db(z), 10.5564)
    close(20 * math.log10(1 / (2 * z)), 10.4576)
    close(peak_db(z) - 20 * math.log10(1 / (2 * z)), 0.0988)
    close(abs(pair(wn, z)(wn * peak_ratio(z))), 3.371478)
    close(mag_db(pair(wn, z), 100.0), -9.7128)
    close(mag_db(pair(wn, z), 100.0) + 40 * math.log10(2.0), 2.3284)
    close(-10 * math.log10(4 * 0.0225 * 0.9775), 10.5564)
    z8 = zeta_from_peak(8.0)
    close((10.0 / peak_ratio(z8) - 10.0) / (10.0 / peak_ratio(z8)) * 100, 4.2222)
    close((10.0 / peak_ratio(z8)) ** 2, 109.011, 5e-3)

    # ---- Section 9 -----------------------------------------------------
    rows = {2.0: (26.0206, 3.0103, -0.0108, 0.0338, 29.0539),
            10.0: (26.0206, 0.1703, -0.2633, 0.8730, 26.8006),
            20.0: (26.0206, 0.0432, -0.9691, 3.7701, 28.8648),
            27.3128: (26.0206, 0.0232, -1.6621, 6.2616, 30.6434),
            30.0: (26.0206, 0.0193, -1.9382, 6.0206, 30.1223),
            40.0: (21.0231, 0.0108, -3.0103, 4.7882, 22.8118),
            60.0: (10.4576, 0.0048, -1.5970, 2.0412, 10.9066),
            100.0: (-2.8534, 0.0017, -0.6446, 0.7027, -2.7934)}
    for w, (line, ez, ep, epr, tot) in rows.items():
        u = w / G_WN
        close(G_asym_db(w), line)
        close(10 * math.log10(1 + (w / G_Z) ** 2) - zero_asym_db(w, G_Z), ez)
        close(-10 * math.log10(1 + (w / G_P) ** 2) - pole_asym_db(w, G_P), ep)
        close(-10 * math.log10((1 - u * u) ** 2 + (2 * G_ZETA * u) ** 2)
              - pair_asym_db(w, G_WN), epr)
        close(mag_db(G, w), tot)
        close(line + ez + ep + epr, tot, 5e-4)
    for w, ex, rp in ((2.0, -49.7801, -45.0000), (10.0, -35.9658, -78.5127),
                      (20.0, -63.2394, -105.6054), (30.0, -130.6840, -129.3778),
                      (40.0, -187.2611, -146.2445), (56.2773, -216.2088, -166.2614),
                      (100.0, -239.9842, -199.9664)):
        close(G_exact_deg(w), ex)
        close(G_asym_deg(w), rp)
    close(4.6228 - 4.1017, 0.5211, 5e-4)
    close(20 * math.log10(G_K / G_Z), 26.0206)
    close(40 * 10 ** (21.0231 / 60.0), 89.6281, 1e-3)
    close(10 ** (3.0 / 30.0), 1.2589)
    close(-90.0 - math.degrees(math.atan(15.7230 / 20.0)), -128.1727)

    # ---- Section 10 ----------------------------------------------------
    close(mag_db(R, math.sqrt(250.0)), 19.1721)
    close(math.sqrt(250.0), 15.8114)
    close(R_K * R_Z * R_P / (R_Z + R_P), 9.090909, 5e-7)
    close(20.0 - 19.1721, 0.8279, 5e-4)
    close(mag_db(R, 5.0), 16.9465)
    close(mag_db(R, 50.0), 16.9465)
    close(20.0 - 16.9465, 3.0535, 5e-4)
    close((solve_mag(R, 0.0, 0.05, 3.0) - 0.5) / 0.5 * 100, 0.5089)
    lag = lambda w: 10 * (1 + 1j * w / 50) / (1 + 1j * w / 5)  # noqa: E731
    close(mag_db(lag, 5.0), 17.0329)
    close(mag_db(lag, 50.0), 2.9671)
    close(mag_db(lag, math.sqrt(250.0)), 10.0000)
    close(phase_deg(lag, math.sqrt(250.0)), -54.9032)
    close(math.degrees(math.asin(9.0 / 11.0)), 54.9032)
    close(9.0 / 11.0, 0.818182)
    close(math.degrees(math.atan(0.316228)), 17.5484)
    close(math.degrees(math.atan(3.16228)), 72.4516)

    # ---- Section 11 ----------------------------------------------------
    H1 = lambda w: 10.0 / (1 + 1j * w / 40)  # noqa: E731
    for w, m, p1, p2, p3 in ((1.0, 19.9973, -1.4321, -29.5046, -30.0800),
                             (4.0, 19.9568, -5.7106, -95.7106, -120.3022),
                             (20.0, 19.0309, -26.5651, -183.9452, -599.5228)):
        close(mag_db(H1, w), m)
        close(phase_deg(H1, w), p1)
        close(phase_deg(H1, w) + allpass_deg(w), p2)
        close(phase_deg(H1, w) + delay_deg(w), p3, 5e-4)
    close(delay_deg(1.0) - allpass_deg(1.0), -0.5754)
    close(delay_deg(4.0) - allpass_deg(4.0), -24.5916)
    close(delay_deg(20.0) - allpass_deg(20.0), -415.5777, 5e-4)
    close(-26.5651 - (phase_deg(H1, 20.0) + delay_deg(20.0)), 572.9577, 5e-3)
    close(180.0 / math.pi, 57.2958)

    # ---- Problem Set A -------------------------------------------------
    close(20 * math.log10(0.05), -26.0206)
    close(10 ** (-14.0 / 20.0), 0.199526, 5e-7)
    close(10 * math.log10(8.0), 9.0309)
    close(math.sqrt(8.0), 2.828427, 5e-7)
    close(20 * math.log10(math.sqrt(8.0)), 9.0309)
    close(20 * math.log10(8.0), 18.0618)
    P1 = lambda w: 100.0 / ((1j * w) * (1 + 1j * w / 25))  # noqa: E731
    close(20 * math.log10(4.0), 12.0412)
    close(25 * 10 ** (12.0412 / 40.0), 50.0, 1e-3)
    close(625 * (math.sqrt(65.0) - 1) / 2, 2206.9556, 5e-3)
    w_a2 = solve_mag(P1, 0.0, 1.0, 200.0)
    close(w_a2, 46.9782)
    close(-90.0 - math.degrees(math.atan(46.9782 / 25.0)), -151.9798)
    close((50.0 - 46.9782) / 46.9782 * 100, 6.4323)
    close(80 * peak_ratio(0.35), 69.5126)
    close(math.sqrt(0.755), 0.868907, 5e-7)
    close(-10 * math.log10(4 * 0.1225 * 0.8775), 3.6656)
    close(20 * math.log10(1 / 0.7), 3.0980)
    close(3.6656 - 3.0980, 0.5676, 5e-4)
    close(80.0 - 69.5126, 10.4874, 5e-4)
    P3 = lambda w: 1.0 / (1 + 1j * w / 4) ** 2  # noqa: E731
    close(mag_db(P3, 4.0), -6.0206)
    close(phase_deg(P3, 4.0), -90.0, 1e-9)
    close(solve_mag(P3, -20.0, 4.0, 200.0), 12.0000)
    close(4 * math.sqrt(10.0), 12.6491)
    close(math.sqrt(10.0), 3.162278, 5e-7)
    close((12.6491 - 12.0) / 12.0 * 100, 5.4092)
    P4 = lambda w: 1.0 / (1 + 1j * w / 6) ** 3  # noqa: E731
    close(mag_db(P4, 6.0), -9.0309)
    close(phase_deg(P4, 6.0), -135.0, 1e-9)
    close(solve_mag(P4, -20.0, 6.0, 200.0) / 6.0, 1.908295, 5e-7)
    close(solve_mag(P4, -20.0, 6.0, 200.0), 11.4498)
    close(10 ** (20.0 / 60.0), 2.154435, 5e-7)
    close(6 * 10 ** (20.0 / 60.0), 12.9266)
    close((12.9266 - 11.4498) / 11.4498 * 100, 12.8980, 5e-4)
    close(-25.5 - 15.0, -40.5, 1e-12)
    close(-40.5 / 20.0, -2.025, 1e-12)
    A7 = two_poles(8.0, 32.0)
    for w, line, e1, e2, ex, ph in ((8.0, 0.0, -3.0103, -0.2633, -3.2736, -59.0362),
                                    (16.0, -6.0206, -0.9691, -0.9691, -7.9588, -90.0),
                                    (32.0, -12.0412, -0.2633, -3.0103, -15.3148, -120.9638)):
        close(pole_asym_db(w, 8.0) + pole_asym_db(w, 32.0), line)
        close(pole_mag_error(w / 8.0), e1)
        close(pole_mag_error(w / 32.0), e2)
        close(mag_db(A7, w), ex)
        close(phase_deg(A7, w), ph)
    close(3.0103 + 0.2633, 3.2736, 5e-4)
    close(G_asym_db(50.0), 15.2084)
    u50 = 50.0 / G_WN
    close(10 * math.log10(1 + 625.0) - zero_asym_db(50.0, G_Z), 0.0069)
    close(-10 * math.log10(1 + 1.5625) - pole_asym_db(50.0, G_P), -2.1484)
    close(-10 * math.log10((1 - u50 * u50) ** 2 + (2 * G_ZETA * u50) ** 2)
          - pair_asym_db(50.0, G_WN), 3.0138)
    close(mag_db(G, 50.0), 16.0807)
    close(15.2084 + 0.8723, 16.0807, 5e-4)

    # ---- Problem Set B -------------------------------------------------
    close(10 ** (26.0206 / 20.0), 20.0, 1e-3)
    B1 = two_poles(6.0, 60.0)
    close(mag_db(B1, 6.0) + 20 * math.log10(20.0), 22.9671)
    close(mag_db(B1, 60.0) + 20 * math.log10(20.0), 2.9671)
    close(20 * math.log10(0.25 * 25.0), 15.9176)
    z_b3 = zeta_from_peak(5.0)
    close(10 ** (-0.5), 0.316228, 5e-7)
    close(math.sqrt(1 - 10 ** (-0.5)), 0.826905, 5e-7)
    close(z_b3 ** 2, 0.086547, 5e-7)
    close(z_b3, 0.294189, 5e-7)
    close(peak_ratio(z_b3), 0.909343, 5e-7)
    close(120.0 / peak_ratio(z_b3), 131.9634, 5e-4)
    close((120.0 / peak_ratio(z_b3) - 120.0) / 120.0 * 100, 9.9695, 5e-4)
    z_b4 = 10 ** (-0.1) / 2
    close(10 ** (-0.1), 0.794328, 5e-7)
    close(z_b4, 0.397164, 5e-7)
    close(1 - 2 * z_b4 ** 2, 0.684521, 5e-7)
    close(30 * peak_ratio(z_b4), 24.8207)
    close(peak_db(z_b4), 2.7455)
    close(-10 * math.log10(1 - z_b4 ** 2), 0.7455)
    close(-10 * math.log10(4 * 0.157739 * 0.842261), 2.7455)
    close(math.radians(114.5916), 2.0000, 5e-5)
    close(math.tan(math.radians(57.2958)), 1.557408, 5e-6)
    close(10.0 / 1.557408, 6.4209)
    close(-2 * math.degrees(math.atan(20.0 / 6.4209)), -144.4021, 1e-4)
    close(-math.degrees(20.0 * 0.2), -229.1831)
    close(229.183 - 144.402, 84.781, 5e-4)
    close(7.0 ** 2, 49.0, 1e-12)
    close(49.0 / 0.49, 100.0, 1e-9)
    say("prose audit: sections 4 to 13 reproduced")


# ================================================================= figures
@figure("lin4-log-sum")
def _log_sum(mode):
    """A product of factors becomes a sum of curves once the axis is in dB."""
    c = S.SERIES[mode]
    z, p, k = 4.0, 60.0, 50.0
    H = lambda w: k * (1.0 + 1j * w / z) / (1.0 + 1j * w / p)  # noqa: E731
    w = np.geomspace(0.2, 2000.0, 900)
    dz = np.array([10 * math.log10(1 + (x / z) ** 2) for x in w])
    dp = np.array([-10 * math.log10(1 + (x / p) ** 2) for x in w])
    tot = np.array([mag_db(H, x) for x in w])
    const = 20 * math.log10(k)
    assert abs(const - 33.9794) < 5e-5, const
    assert np.max(np.abs(tot - (const + dz + dp))) < 1e-11
    assert abs(mag_db(H, 4.0) - 36.9704) < 5e-5, mag_db(H, 4.0)

    fig, ax = plt.subplots()
    ax.semilogx(w, tot, color=c[0], lw=2.3)
    ax.semilogx(w, dz, color=c[1], lw=1.8)
    ax.semilogx(w, dp, color=c[2], lw=1.8)
    ax.axhline(const, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.label_end(ax, w[-1], tot[-1], "total", c[0], mode)
    S.label_end(ax, w[-1], dz[-1], "zero at 4", c[1], mode)
    S.label_end(ax, w[-1], dp[-1], "pole at 60", c[2], mode)
    S.note(ax, 0.22, const + 1.4, "constant 50 = 33.9794 dB", mode)
    S.note(ax, 0.22, -26, "the top curve is the arithmetic sum\n"
                          "of the three below it, at every frequency", mode)
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Multiplication becomes addition on a decibel axis")
    ax.set_xlim(0.2, 2000)
    ax.set_ylim(-32, 72)
    S.strip(ax)
    return fig


@figure("lin4-pole-error")
def _pole_error(mode):
    """Exact minus straight line for one real pole, over four decades."""
    c = S.SERIES[mode]
    u = np.geomspace(0.02, 50.0, 1200)
    e = np.array([pole_mag_error(x) for x in u])
    assert abs(pole_mag_error(1.0) + 3.0103) < 5e-5
    assert e.min() >= -3.010300 - 1e-9, e.min()

    fig, ax = plt.subplots()
    ax.semilogx(u, e, color=c[0], lw=2.3)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for x, lab, dy in ((0.1, "-0.0432", -0.16), (0.5, "-0.9691", -0.14),
                       (1.0, "-3.0103", -0.16), (2.0, "-0.9691", -0.14),
                       (10.0, "-0.0432", -0.16)):
        y = pole_mag_error(x)
        ax.plot([x], [y], "o", color=S.INK[mode], ms=6, zorder=5)
        S.note(ax, x, y + dy, lab, mode, ha="center", va="top", size=9)
    S.label_end(ax, u[-1], e[-1], "exact minus\nstraight line", c[0], mode)
    S.note(ax, 2.6, -2.95, "the error at a frequency ratio u\nequals the error at 1/u:\n"
                           "a mirror about the corner", mode)
    ax.set_xlabel("frequency as a multiple of the corner,  u = omega / p")
    ax.set_ylabel("magnitude error  (dB)")
    ax.set_title("What the straight-line magnitude costs, pole by pole")
    ax.set_xlim(0.02, 50)
    ax.set_ylim(-3.65, 0.6)
    S.strip(ax)
    return fig


@figure("lin4-phase-ramp")
def _phase_ramp(mode):
    """The one-decade ramp against the arctangent, and the gap between them."""
    c = S.SERIES[mode]
    u = np.geomspace(0.01, 100.0, 1600)
    ex = np.array([phase_deg(real_pole(1.0), x) for x in u])
    rp = np.array([ramp_deg(x, 1.0, -1.0) for x in u])
    err = rp - ex
    cc = 4.0 * math.log(10.0) / math.pi
    u_star = (cc + math.sqrt(cc * cc - 4.0)) / 2.0
    assert abs(pole_phase_error(0.1) - 5.7106) < 5e-5
    assert err.max() <= 5.710593 + 1e-9, err.max()

    fig, (top, bot) = plt.subplots(2, 1, sharex=True,
                                   figsize=(S.FIGSIZE[0], S.FIGSIZE[1] * 1.42))
    top.semilogx(u, ex, color=c[0], lw=2.3)
    top.semilogx(u, rp, color=c[1], lw=1.8, ls="--")
    S.label_end(top, 100, ex[-1], "exact", c[0], mode, dy=7)
    S.label_end(top, 100, rp[-1], "ramp", c[1], mode, dy=-7)
    for x in (0.1, 1.0, 10.0):
        top.plot([x], [phase_deg(real_pole(1.0), x)], "o",
                 color=S.INK[mode], ms=5.5, zorder=5)
    S.note(top, 0.0105, -78, "-5.7106 at a tenth of the corner,\n"
                             "exactly -45 at the corner,\n"
                             "-84.2894 at ten times it", mode)
    top.set_ylabel("phase  (degrees)")
    top.set_title("The one-decade phase ramp and its true error")
    top.set_ylim(-100, 12)
    S.strip(top)

    bot.semilogx(u, err, color=c[2], lw=2.1)
    bot.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for x, lab in ((0.1, "+5.7106"), (1.0 / u_star, "-5.2929"),
                   (u_star, "+5.2929"), (10.0, "-5.7106")):
        bot.plot([x], [ramp_deg(x, 1.0, -1.0) - phase_deg(real_pole(1.0), x)],
                 "o", color=S.INK[mode], ms=5.5, zorder=5)
        S.note(bot, x, ramp_deg(x, 1.0, -1.0) - phase_deg(real_pole(1.0), x) + 0.6,
               lab, mode, ha="center", size=8.5)
    S.label_end(bot, 100, err[-1], "ramp minus exact", c[2], mode)
    bot.set_xlabel("frequency as a multiple of the corner,  u = omega / p")
    bot.set_ylabel("error  (degrees)")
    bot.set_xlim(0.01, 100)
    bot.set_ylim(-8.4, 8.4)
    S.strip(bot)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("lin4-error-add")
def _error_add(mode):
    """Two corners an octave apart: the two errors add to the pair's error."""
    c = S.SERIES[mode]
    a, b = 10.0, 20.0
    H = two_poles(a, b)
    w = np.geomspace(1.0, 200.0, 1400)
    e1 = np.array([pole_mag_error(x / a) for x in w])
    e2 = np.array([pole_mag_error(x / b) for x in w])
    tot = np.array([mag_db(H, x) - (pole_asym_db(x, a) + pole_asym_db(x, b))
                    for x in w])
    assert np.max(np.abs(tot - (e1 + e2))) < 1e-12
    assert abs(mag_db(H, a) - (pole_asym_db(a, a) + pole_asym_db(a, b)) + 3.9794) < 5e-5
    assert tot.min() >= -3.979400 - 1e-6, tot.min()

    fig, ax = plt.subplots()
    ax.semilogx(w, tot, color=c[0], lw=2.4)
    ax.semilogx(w, e1, color=c[1], lw=1.7, ls="--")
    ax.semilogx(w, e2, color=c[2], lw=1.7, ls="--")
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for x in (a, b):
        ax.plot([x], [mag_db(H, x) - (pole_asym_db(x, a) + pole_asym_db(x, b))],
                "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 200, tot[-1], "both", c[0], mode, dy=-8)
    S.label_end(ax, 200, e1[-1], "pole at 10", c[1], mode, dy=7)
    S.label_end(ax, 200, e2[-1], "pole at 20", c[2], mode, dy=-2)
    S.note(ax, 1.05, -3.6, "-3.9794 dB at BOTH corners:\n"
                           "-3.0103 from the near pole plus\n-0.9691 from the far one", mode)
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("magnitude error  (dB)")
    ax.set_title("Errors from neighbouring corners simply add")
    ax.set_xlim(1, 200)
    ax.set_ylim(-4.4, 0.7)
    S.strip(ax)
    return fig


@figure("lin4-resonance")
def _resonance(mode):
    """Peak height and peak location of a complex pair, against damping."""
    c = S.SERIES[mode]
    z = np.linspace(0.02, 1.0 / math.sqrt(2.0), 800)
    hp = np.array([peak_db(x) for x in z])
    at_wn = np.array([20 * math.log10(1.0 / (2 * x)) for x in z])
    ratio = np.array([peak_ratio(x) for x in z])
    assert abs(peak_db(0.25) - 6.3009) < 5e-5
    assert abs(hp[-1]) < 1e-6, hp[-1]

    fig, (top, bot) = plt.subplots(2, 1, sharex=True,
                                   figsize=(S.FIGSIZE[0], S.FIGSIZE[1] * 1.42))
    top.plot(z, hp, color=c[0], lw=2.3)
    top.plot(z, at_wn, color=c[1], lw=1.8, ls="--")
    top.plot([0.25], [peak_db(0.25)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(top, 0.707, 0.0, "true peak", c[0], mode, dy=9)
    S.label_end(top, 0.707, at_wn[-1], "value at the\nnatural frequency",
                c[1], mode, dy=-9)
    S.note(top, 0.285, 9.4, "zeta = 0.25: 6.3009 dB peak,\n6.0206 dB at the corner", mode)
    top.set_ylabel("peak height  (dB)")
    top.set_title("A complex pair: how high the peak is, and where it sits")
    top.set_ylim(-5, 27)
    S.strip(top)

    bot.plot(z, ratio, color=c[2], lw=2.3)
    bot.plot([0.25], [peak_ratio(0.25)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(bot, 0.707, ratio[-1], "peak frequency\nover natural frequency",
                c[2], mode, dy=10)
    S.note(bot, 0.03, 0.14, "the peak is never AT the natural frequency,\n"
                            "and vanishes entirely at zeta = 0.7071", mode)
    bot.set_xlabel("damping ratio  zeta")
    bot.set_ylabel("peak omega / natural omega")
    bot.set_xlim(0, 0.72)
    bot.set_ylim(0, 1.08)
    S.strip(bot)
    fig.subplots_adjust(hspace=0.12)
    return fig


@figure("lin4-assembly-mag")
def _assembly_mag(mode):
    """The assembled magnitude: straight lines, then the truth."""
    c = S.SERIES[mode]
    w = np.geomspace(0.1, 1000.0, 1800)
    ex = np.array([mag_db(G, x) for x in w])
    asy = np.array([G_asym_db(x) for x in w])
    assert abs(max(ex - asy) - 4.6228) < 1e-3, max(ex - asy)
    assert abs(mag_db(G, 30.0) - G_asym_db(30.0) - 4.1017) < 5e-5
    w0 = solve_mag(G, 0.0, 40.0, 300.0)
    assert abs(w0 - 89.9468) < 5e-5

    fig, ax = plt.subplots()
    ax.semilogx(w, asy, color=c[1], lw=1.8, ls="--")
    ax.semilogx(w, ex, color=c[0], lw=2.4)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    for x in (2.0, 30.0, 40.0):
        ax.plot([x], [mag_db(G, x)], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([w0], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 27.3128, mag_db(G, 27.3128), "exact", c[0], mode,
                dx=0, dy=11, ha="center")
    S.label_end(ax, 7.0, G_asym_db(7.0), "straight lines", c[1], mode,
                dx=0, dy=-15, ha="center")
    S.note(ax, 0.105, -37, "corners at 2 (zero), 30 (pair, zeta = 0.25) and 40 (pole)\n"
                           "worst gap 4.6228 dB, at 27.3128 rad/s - not on a corner\n"
                           "unity gain solved at 89.9468 rad/s, not the 89.6281 the lines give",
           mode)
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Sketch first, then correct: the assembled magnitude")
    ax.set_xlim(0.1, 400)
    ax.set_ylim(-46, 62)
    S.strip(ax)
    return fig


@figure("lin4-assembly-phase")
def _assembly_phase(mode):
    """The same system's phase, where the ramp construction does far worse."""
    c = S.SERIES[mode]
    w = np.geomspace(0.1, 1000.0, 1800)
    ex = np.array([G_exact_deg(x) for x in w])
    asy = np.array([G_asym_deg(x) for x in w])
    gap = np.max(np.abs(asy - ex))
    assert abs(gap - 49.9474) < 1e-2, gap
    assert abs(G_exact_deg(300.0) + 259.8961) < 5e-5
    assert abs(ex[-1] + 266.9638) < 5e-4, ex[-1]

    fig, ax = plt.subplots()
    ax.semilogx(w, asy, color=c[1], lw=1.8, ls="--")
    ax.semilogx(w, ex, color=c[0], lw=2.4)
    ax.axhline(-180.0, color=S.GUIDE[mode], lw=1.0)
    for x in (10.0, 30.0, 60.0):
        ax.plot([x], [G_exact_deg(x)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 1000, ex[-1], "exact", c[0], mode, dy=9)
    S.label_end(ax, 1000, asy[-1], "ramp rule", c[1], mode, dy=-9)
    S.note(ax, 0.105, -238, "the ramp is built for a real pole; a pair at zeta = 0.25\n"
                            "turns far faster than one decade, so the construction\n"
                            "is out by 49.9474 degrees at 56.279 rad/s", mode)
    S.note(ax, 120, -172, "minus 180 degrees", mode)
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("phase  (degrees)")
    ax.set_title("The phase construction is the cruder half of the sketch")
    ax.set_xlim(0.1, 1000)
    ax.set_ylim(-290, 10)
    S.strip(ax)
    return fig


@figure("lin4-crossover-solve")
def _crossover(mode):
    """Unity gain read off a corner versus unity gain solved for."""
    c = S.SERIES[mode]
    w = np.geomspace(2.0, 100.0, 1200)
    ex = np.array([mag_db(L, x) for x in w])
    asy = np.array([20 * math.log10(L_A / x) + pole_asym_db(x, L_A) for x in w])
    assert abs(mag_db(L, L_A) + 3.0103) < 5e-5

    fig, ax = plt.subplots()
    ax.semilogx(w, asy, color=c[1], lw=1.8, ls="--")
    ax.semilogx(w, ex, color=c[0], lw=2.4)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([GOLDEN_W], [0.0], "o", color=S.INK[mode], ms=7, zorder=5)
    ax.plot([L_A], [0.0], "s", color=S.GUIDE[mode], ms=6, zorder=5)
    ax.plot([L_A], [mag_db(L, L_A)], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 100, ex[-1], "exact", c[0], mode, dy=8)
    S.label_end(ax, 100, asy[-1], "straight lines", c[1], mode, dy=-8)
    S.note(ax, 2.1, -24, "solved: 15.7230 rad/s\nread off the corner: 20\n"
                         "the corner reading is 27.2 per cent high", mode)
    S.note(ax, 96, 5.0, "exact value at the corner\nis -3.0103 dB", mode, ha="right")
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Where the gain reaches unity: solve it, never eyeball it")
    ax.set_xlim(2, 100)
    ax.set_ylim(-34, 22)
    S.strip(ax)
    return fig


@figure("lin4-inverse-target")
def _inverse(mode):
    """The measured plot the reader is asked to turn back into a formula."""
    c = S.SERIES[mode]
    w = np.geomspace(0.1, 2000.0, 1500)
    ex = np.array([mag_db(R, x) for x in w])
    asy = np.array([R_asym_db(x) for x in w])
    w_pk, db_pk = argmax_mag(R, 1.0, 200.0)
    assert abs(db_pk - 19.1721) < 5e-5
    w_lf = solve_mag(R, 0.0, 0.05, 3.0)
    assert abs(w_lf - 0.502545) < 5e-7

    fig, ax = plt.subplots()
    ax.semilogx(w, asy, color=c[1], lw=1.9, ls="--")
    ax.semilogx(w, ex, color=c[0], lw=2.4)
    ax.axhline(0.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([w_pk], [db_pk], "o", color=S.INK[mode], ms=6, zorder=5)
    ax.plot([0.5], [0.0], "s", color=S.GUIDE[mode], ms=6, zorder=5)
    ax.plot([w_lf], [0.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 2000, ex[-1], "measured", c[0], mode, dy=9)
    S.label_end(ax, 2000, asy[-1], "the lines you draw on it", c[1], mode, dy=-9)
    S.note(ax, 0.105, -30, "+20 dB/decade, then flat at 20 dB, then -20\n"
                           "the rising line reaches 0 dB at 0.5 rad/s\n"
                           "true peak 19.1721 dB at 15.8114 rad/s", mode)
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("magnitude  (dB)")
    ax.set_title("Reading a formula back off a measured magnitude")
    ax.set_xlim(0.1, 2000)
    ax.set_ylim(-32, 30)
    S.strip(ax)
    return fig


@figure("lin4-allpass-delay")
def _allpass_delay(mode):
    """Two things a magnitude plot cannot see, and how they differ in phase."""
    c = S.SERIES[mode]
    w = np.geomspace(0.1, 60.0, 1200)
    ap = np.array([allpass_deg(x) for x in w])
    dl = np.array([delay_deg(x) for x in w])
    for x in (0.7, 3.0, 15.0):
        z = (1.0 - 1j * x / AP_A) / (1.0 + 1j * x / AP_A)
        assert abs(abs(z) - 1.0) < 1e-14
    assert abs(allpass_deg(AP_A) + 90.0) < 1e-9

    fig, ax = plt.subplots()
    ax.semilogx(w, ap, color=c[0], lw=2.4)
    ax.semilogx(w, dl, color=c[1], lw=2.0, ls="--")
    ax.axhline(-180.0, color=S.GUIDE[mode], lw=1.0)
    ax.plot([AP_A], [-90.0], "o", color=S.INK[mode], ms=6, zorder=5)
    S.label_end(ax, 60, ap[-1], "all-pass, zero at +4", c[0], mode, dy=6)
    S.label_end(ax, 8.0, delay_deg(8.0), "half-second delay", c[1], mode,
                dx=-9, ha="right")
    S.note(ax, 0.105, -300, "both have exactly 0 dB at every frequency;\n"
                            "the all-pass lag stops at 180 degrees,\n"
                            "the delay lag never stops", mode)
    S.note(ax, 4.6, -96, "-90 degrees at 4 rad/s", mode)
    ax.set_xlabel("angular frequency  (rad/s, log scale)")
    ax.set_ylabel("phase  (degrees)")
    ax.set_title("Unity magnitude, two very different phases")
    ax.set_xlim(0.1, 60)
    ax.set_ylim(-360, 12)
    S.strip(ax)
    return fig


# ==================================================================== driver
def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg",
                    transparent=True, bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    args = sys.argv[1:]
    verbose = "--numbers" in args
    args = [a for a in args if not a.startswith("--")]
    audit(verbose)
    if verbose and not args:
        return 0
    prefix = args[0] if args else PREFIX
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
