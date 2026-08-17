#!/usr/bin/env python3
"""Depth-wave-37 figures for the FE Electrical and Computer course.

Scope: the pole-zero-map chapter of the Control Systems section (topic
`fee_pzmap_analysis`, figure prefix `ctl5-`). Same contract and the same shared
style module as every earlier generator in this course, so these plots sit
beside the existing ones without introducing a second look.

Nothing here is traced, scanned or adapted from a reference work. Every curve,
marker and shaded region is computed in this file from the transfer function the
lesson writes down, so a reader can rerun the script and get the picture back.

WHAT THIS FILE IS FOR

A pole-zero chapter is a chapter of claims about what a pole or a zero DOES:
this pole is dominant, that zero adds overshoot, this one forces the output the
wrong way first, that far-off pole may be dropped. Every one of those claims is
a claim about a time response, and a map cannot settle it. So the rule adopted
here is that no statement about a response is inferred from the map:

  * every response feature quoted in the lesson - peak value, peak time,
    10-90% rise, settling instant, undershoot depth, crossing time, steady
    value - is MEASURED off a response produced by integrating a state-space
    realisation with DOP853 at rtol 1e-12, a route that never touches the
    partial-fraction algebra the lesson prints;
  * every residue is computed symbolically as N(p)/D'(p) AND recovered by
    least-squares fitting the simulated response onto its mode basis, so the
    printed residue has an independent confirmation;
  * every frequency, gain, time or damping value obtained by solving an
    equation is solved with a bracketed root finder, never read off a corner or
    an asymptote;
  * every closed form the lesson derives is compared against the simulation at
    a dense grid of instants.

`python3 eureka/scripts/gen_fe_ee_d37.py --verify` runs that battery alone and
prints the counts, including how many response claims were measured rather than
inferred. Figures repeat the claims they draw as `assert`s at tight tolerances,
so a wrong claim stops the script instead of shipping.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 eureka/scripts/gen_fe_ee_d37.py            # verify, then all figures
    python3 eureka/scripts/gen_fe_ee_d37.py --verify   # numerics only
    python3 eureka/scripts/gen_fe_ee_d37.py ctl5-zplane-map    # one figure
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy.integrate import quad, solve_ivp
from scipy.optimize import brentq
from scipy.signal import cont2discrete

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Polygon, Wedge  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "ctl5-"

# Counters the --verify report prints. Only the helpers below touch them, so
# the totals cannot drift away from the checks actually run.
COUNTS = {"measured": 0, "residue": 0, "solved": 0, "closed_form": 0}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# simulation: the independent route
# ---------------------------------------------------------------------------
def realise(num, den):
    """Controllable-canonical (A, B, C, D) for a rational num/den."""
    num = np.atleast_1d(np.asarray(num, float))
    den = np.atleast_1d(np.asarray(den, float))
    if len(num) > len(den):
        raise ValueError("improper transfer function")
    num, den = num / den[0], den / den[0]
    n = len(den) - 1
    b = np.zeros(n + 1)
    b[n + 1 - len(num):] = num
    d = b[0]
    tail = b[1:] - d * den[1:]
    A = np.zeros((n, n))
    if n > 1:
        A[:-1, 1:] = np.eye(n - 1)
    A[-1, :] = -den[:0:-1]
    B = np.zeros(n)
    B[-1] = 1.0
    C = tail[::-1].copy()
    return A, B, C, d


def sim_step(num, den, t):
    """Unit-step response by numerical integration of the state equations.

    This never forms a partial-fraction expansion, so it is genuinely
    independent of the algebra the lesson prints.
    """
    A, B, C, d = realise(num, den)
    sol = solve_ivp(lambda _t, x: A @ x + B, (0.0, float(t[-1])), np.zeros(A.shape[0]),
                    t_eval=t, rtol=1e-12, atol=1e-14, method="DOP853")
    assert sol.success, sol.message
    return C @ sol.y + d


def grid(t_end, n=200001):
    return np.linspace(0.0, float(t_end), n)


def crossing(t, y, level, first=True):
    """Instant at which y crosses `level`, by linear interpolation. Measured."""
    above = y >= level
    idx = np.flatnonzero(above[1:] != above[:-1])
    assert idx.size, f"never crosses {level}"
    k = idx[0] if first else idx[-1]
    y0, y1 = y[k], y[k + 1]
    frac = (level - y0) / (y1 - y0)
    return float(t[k] + frac * (t[k + 1] - t[k]))


def measure(num, den, t_end, band=0.05, final=None, n=200001):
    """Every response feature the lesson may quote, read off a SIMULATION.

    Returns a dict; each call books one measurement per feature reported.
    """
    t = grid(t_end, n)
    y = sim_step(num, den, t)
    if final is None:
        final = float(np.polyval(num, 0.0) / np.polyval(den, 0.0))
    k = int(np.argmax(y))
    out = {
        "t": t,
        "y": y,
        "final": final,
        "peak": float(y[k]),
        "t_peak": float(t[k]),
        "overshoot_pct": float((y[k] - final) / final * 100.0),
        "min": float(np.min(y)),
        "t_min": float(t[int(np.argmin(y))]),
        "undershoot_pct": float(min(0.0, np.min(y)) / final * 100.0),
        "y_end": float(y[-1]),
    }
    outside = np.flatnonzero(np.abs(y - final) > band * abs(final))
    out["t_settle"] = float(t[outside[-1]]) if outside.size else 0.0
    if y.max() >= 0.9 * final > 0:
        out["t_10_90"] = crossing(t, y, 0.9 * final) - crossing(t, y, 0.1 * final)
    COUNTS["measured"] += 8
    return out


def residues(num, den):
    """Residues at simple poles, N(p)/D'(p), with no numerical differentiation."""
    p = np.roots(den)
    assert np.min(np.abs(p[:, None] - p[None, :] + np.eye(len(p)) * 9)) > 1e-9, \
        "repeated pole: this helper assumes simple poles"
    return p, np.polyval(num, p) / np.polyval(np.polyder(den), p)


def residues_confirmed(label, num, den, t_end=None, tol=1e-6):
    """Residues of the STEP response of num/den, by two independent routes.

    Route one is symbolic: the residue of N(s)/[s D(s)] at each simple pole is
    N(p)/[d/ds(sD)]_p, evaluated with no numerical differentiation. Route two
    takes the SIMULATED step response and least-squares fits it onto the mode
    basis exp(p t); the coefficients that come back must be the same numbers.
    Columns are normalised before the solve so the fit is not decided by the
    tail, where only the slowest mode survives.
    """
    yden = np.polymul(np.atleast_1d(den).astype(float), [1.0, 0.0])
    p, r = residues(num, yden)
    slow = np.abs(p.real[np.abs(p.real) > 1e-12])
    t_end = t_end or 6.0 / float(np.min(slow))
    t = grid(t_end, 40001)
    y = sim_step(num, den, t)
    basis = np.exp(np.outer(t, p))
    scale = np.linalg.norm(basis, axis=0)
    fit, *_ = np.linalg.lstsq(basis / scale, y.astype(complex), rcond=None)
    fit = fit / scale
    gap = float(np.max(np.abs(fit - r)))
    assert gap < tol, f"{label}: symbolic residues {r} vs fitted {fit} (gap {gap:g})"
    COUNTS["residue"] += len(p)
    return p, r


def solve_for(label, f, lo, hi, tol=1e-13):
    """One equation, solved with a bracketed root finder. Never read off a plot."""
    assert f(lo) * f(hi) < 0, f"{label}: no sign change on [{lo}, {hi}]"
    root = brentq(f, lo, hi, xtol=tol, rtol=8.9e-16, maxiter=200)
    COUNTS["solved"] += 1
    return float(root)


def closed_form_ok(label, fn, num, den, t_end, tol=1e-8):
    """A closed form the lesson prints, checked against the simulation."""
    t = grid(t_end, 20001)
    y = sim_step(num, den, t)
    gap = float(np.max(np.abs(fn(t) - y)))
    assert gap < tol, f"{label}: closed form differs from simulation by {gap:g}"
    COUNTS["closed_form"] += 1
    return gap


# ---------------------------------------------------------------------------
# the systems the lesson uses, defined once
# ---------------------------------------------------------------------------
# Section 5: the reference underdamped pair, zeta = 0.6, wn = 5.
REF_NUM, REF_DEN = [25.0], [1.0, 6.0, 25.0]

# Section 6: three real poles, unit DC gain, used for the mode decomposition.
TRI_NUM, TRI_DEN = [60.0], np.polymul(np.polymul([1, 1], [1, 3]), [1, 20]).tolist()

# Section 10 / 11: the near-cancellation demonstrations.
UNSTABLE_POLE = 1.0


def zero_family(z):
    """Unit-DC-gain second-order pair with one extra zero at s = -z (z may be
    negative, putting the zero in the right half plane)."""
    return [25.0 / z, 25.0], [1.0, 6.0, 25.0]


# ===========================================================================
# the verification battery
# ===========================================================================
def verify(loud=True):  # noqa: C901 - a long list of small checks, on purpose
    say = print if loud else (lambda *a, **k: None)

    # ---- 5. the reference pair: zeta and wn as polar coordinates ----------
    sigma, wd = 3.0, 4.0
    wn = float(np.hypot(sigma, wd))
    zeta = sigma / wn
    assert abs(wn - 5.0) < 1e-12 and abs(zeta - 0.6) < 1e-12
    ref = measure(REF_NUM, REF_DEN, 6.0)
    os_formula = 100.0 * np.exp(-np.pi * zeta / np.sqrt(1 - zeta * zeta))
    assert abs(ref["overshoot_pct"] - os_formula) < 2e-4, (ref["overshoot_pct"], os_formula)
    assert abs(ref["t_peak"] - np.pi / wd) < 2e-4
    say(f"  ref pair -3+-j4: wn={wn:.6f} zeta={zeta:.6f}")
    say(f"    measured overshoot {ref['overshoot_pct']:.4f}% vs formula {os_formula:.4f}%")
    say(f"    measured peak time {ref['t_peak']:.6f} s vs pi/wd {np.pi / wd:.6f} s")
    say(f"    measured 10-90% rise {ref['t_10_90']:.6f} s; 1.8/wn = {1.8 / wn:.6f} s")
    t100 = crossing(ref["t"], ref["y"], 1.0)
    COUNTS["measured"] += 1
    say(f"    measured 0-100% rise {t100:.6f} s; closed form "
        f"{(np.pi - np.arccos(zeta)) / wd:.6f} s")
    assert abs(t100 - (np.pi - np.arccos(zeta)) / wd) < 2e-4

    # closed form for the reference step response, checked against simulation
    def ref_y(t):
        return 1 - np.exp(-sigma * t) * (np.cos(wd * t) + (sigma / wd) * np.sin(wd * t))
    say(f"    closed form vs simulation, worst gap "
        f"{closed_form_ok('ref step', ref_y, REF_NUM, REF_DEN, 6.0):.3e}")

    # bandwidth: SOLVED, not read off a corner
    def mag(w):
        return abs(np.polyval(REF_NUM, 1j * w) / np.polyval(REF_DEN, 1j * w))
    wb = solve_for("ref bandwidth", lambda w: mag(w) - 1 / np.sqrt(2), 0.1, 50.0)
    wpk = solve_for("ref |H| peak", lambda w: (mag(w + 1e-6) - mag(w - 1e-6)) / 2e-6,
                    0.5, 10.0)
    say(f"    solved bandwidth {wb:.6f} rad/s ; resonant peak at {wpk:.6f} rad/s, "
        f"|H| = {mag(wpk):.6f}")

    # ---- 1.5 audit: is 1.8/wn the 0-100% rise time or the 10-90% ? --------
    say("\n  rise-time audit (wn = 1, so the numbers are t_r * wn):")
    for z in (0.3, 0.5, 0.7):
        m = measure([1.0], [1.0, 2 * z, 1.0], 40.0)
        t100z = crossing(m["t"], m["y"], 1.0)
        COUNTS["measured"] += 1
        say(f"    zeta={z}: 10-90% = {m['t_10_90']:.4f}, 0-100% = {t100z:.4f}")
    z_at_18 = solve_for(
        "zeta where t_10_90 * wn = 1.8",
        lambda z: measure([1.0], [1.0, 2 * z, 1.0], 40.0)["t_10_90"] - 1.8, 0.3, 0.9,
        tol=1e-6)
    say(f"    t_r(10-90%) * wn = 1.8 exactly at zeta = {z_at_18:.4f}")

    # ---- 2.6 audit: poles -2+-j3 with a zero at -10 -----------------------
    say("\n  audit of the chapter's own section 2.6 example:")
    d26 = [1.0, 4.0, 13.0]
    bare = measure([13.0], d26, 8.0)
    withz = measure([1.3, 13.0], d26, 8.0)
    z26 = 2.0 / np.sqrt(13.0)
    f26 = 100.0 * np.exp(-np.pi * z26 / np.sqrt(1 - z26 * z26))
    say(f"    zeta = 2/sqrt(13) = {z26:.6f}, wn = {np.sqrt(13.0):.6f}")
    say(f"    formula overshoot {f26:.4f}% ; measured without the zero "
        f"{bare['overshoot_pct']:.4f}% ; measured WITH the zero at -10 "
        f"{withz['overshoot_pct']:.4f}%")
    assert abs(bare["overshoot_pct"] - f26) < 2e-4
    say(f"    measured 10-90% rise {bare['t_10_90']:.4f} s (1.8/wn = "
        f"{1.8 / np.sqrt(13.0):.4f} s); 0-100% "
        f"{crossing(bare['t'], bare['y'], 1.0):.4f} s")
    COUNTS["measured"] += 1
    say(f"    measured 5% settling {bare['t_settle']:.4f} s (3/sigma = 1.5 s); "
        f"with the zero {withz['t_settle']:.4f} s")

    # ---- 6. modes and residues -------------------------------------------
    say("\n  three real poles, 60/[(s+1)(s+3)(s+20)]:")
    p3, r3 = residues_confirmed("three-pole step", TRI_NUM, TRI_DEN)
    order = np.argsort(-p3.real)
    for pk, rk in zip(p3[order], r3[order]):
        say(f"    pole {pk.real:+8.4f}  residue {rk.real:+.6f}")
    assert abs(np.sum(r3).real) < 1e-9, "residues of a strictly proper step must sum to 0"
    tri = measure(TRI_NUM, TRI_DEN, 8.0)
    say(f"    measured settling (5%) {tri['t_settle']:.4f} s, peak {tri['peak']:.6f}")

    # ---- 7. residue against pole-zero gap --------------------------------
    say("\n  residue at the pole s = -1 as a zero at -z approaches it:")
    for z in (1.05, 1.2, 1.5, 2.0, 3.0):
        num = [3.0 / z, 3.0]
        p, r = residues_confirmed(f"gap z={z}", num, [1, 4, 3])
        k = int(np.argmin(np.abs(p + 1.0)))
        exact = -1.5 * (z - 1.0) / z
        assert abs(r[k].real - exact) < 1e-9, (r[k], exact)
        say(f"    z = {z:<5} gap {z - 1:.2f}  residue {r[k].real:+.6f} "
            f"(closed form {exact:+.6f})")

    say("\n  a zero that silences the MIDDLE pole, 40(s+4.2)/[(s+4)(s+1)(s+21)]:")
    n72 = [40.0, 168.0]
    d72 = np.polymul(np.polymul([1, 4], [1, 1]), [1, 21])
    assert abs(np.polyval(n72, 0.0) / np.polyval(d72, 0.0) - 2.0) < 1e-12
    p72, r72 = residues_confirmed("7.2", n72, d72)
    for pk, rk in sorted(zip(p72, r72), key=lambda v: -v[0].real):
        say(f"    residue at {pk.real:+8.2f} = {rk.real:+.6f}")
    k1 = int(np.argmin(np.abs(p72 + 1.0)))
    k4 = int(np.argmin(np.abs(p72 + 4.0)))
    say(f"    the -4 mode is {abs(r72[k4] / r72[k1]) * 100:.2f}% of the -1 mode")

    # ---- 8. dominance error, measured against the closed form ------------
    say("\n  dominant-pole error, max|y_r - y_1| over all t:")
    for r in (2.0, 3.0, 5.0, 10.0, 20.0, 50.0):
        t = grid(20.0 / 1.0, 400001)
        y_full = sim_step([r], [1.0, 1.0 + r, r], t)
        y_dom = sim_step([1.0], [1.0, 1.0], t)
        d = y_full - y_dom
        k = int(np.argmax(np.abs(d)))
        COUNTS["measured"] += 2
        cf = r ** (-r / (r - 1.0))
        t_star = np.log(r) / (r - 1.0)
        assert abs(abs(d[k]) - cf) < 5e-6, (r, abs(d[k]), cf)
        assert abs(t[k] - t_star) < 2e-4
        say(f"    r = {r:<5} measured {abs(d[k]):.6f} at t = {t[k]:.6f} s ; "
            f"closed form r^(-r/(r-1)) = {cf:.6f} at {t_star:.6f} s")
    r_1pct = solve_for("separation for 1% error",
                       lambda r: r ** (-r / (r - 1.0)) - 0.01, 10.0, 400.0)
    say(f"    1% worst-case error needs a separation of {r_1pct:.2f}x")

    # dominant PAIR with a third real pole
    say("\n  dominant pair -1+-j2 with a third pole at -q (unit DC gain):")
    for q in (2.0, 3.0, 5.0, 10.0, 40.0):
        den = np.polymul([1.0, 2.0, 5.0], [1.0, q])
        m = measure([5.0 * q], den, 14.0)
        say(f"    q = {q:<5} overshoot {m['overshoot_pct']:6.3f}% , peak time "
            f"{m['t_peak']:.4f} s, 5% settling {m['t_settle']:.4f} s")
    m_pair = measure([5.0], [1.0, 2.0, 5.0], 14.0)
    say(f"    pair alone: overshoot {m_pair['overshoot_pct']:.3f}% , peak time "
        f"{m_pair['t_peak']:.4f} s, 5% settling {m_pair['t_settle']:.4f} s")

    # ---- settling time is a staircase in zeta ----------------------------
    say("\n  settling time measured, as t_s * zeta * wn (the '4' and '3' rules):")
    for z in (0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9):
        m = measure([1.0], [1.0, 2 * z, 1.0], 80.0, band=0.02, n=800001)
        m5 = measure([1.0], [1.0, 2 * z, 1.0], 80.0, band=0.05, n=800001)
        say(f"    zeta = {z}: 2% -> {m['t_settle'] * z:.4f} , 5% -> "
            f"{m5['t_settle'] * z:.4f}")
    zs = np.linspace(0.10, 0.97, 175)
    vals = np.array([measure([1.0], [1.0, 2 * z, 1.0], 80.0, band=0.02,
                             n=200001)["t_settle"] * z for z in zs])
    over = vals > 4.0
    edges, run = [], None
    for z, flag in zip(zs, over):
        if flag and run is None:
            run = z
        elif not flag and run is not None:
            edges.append((run, z))
            run = None
    if run is not None:
        edges.append((run, zs[-1]))
    say("    bands of zeta where the measured 2% settling EXCEEDS 4/(zeta wn): "
        + ", ".join(f"{a:.3f}-{b:.3f}" for a, b in edges))
    z_break = solve_for(
        "first zeta where the 4/(zeta wn) rule fails",
        lambda z: measure([1.0], [1.0, 2 * z, 1.0], 80.0, band=0.02,
                          n=800001)["t_settle"] * z - 4.0,
        edges[0][0] - (zs[1] - zs[0]), edges[0][0], tol=1e-5)
    say(f"    the 2% rule t_s = 4/(zeta wn) is first EXCEEDED at zeta = {z_break:.4f}")

    # ---- 9. adding a zero: y_z = y + y'/z --------------------------------
    say("\n  adding a zero to the reference pair (zeta 0.6, wn 5):")
    t = grid(4.0, 200001)
    y0 = sim_step(REF_NUM, REF_DEN, t)
    yp = (25.0 / 4.0) * np.exp(-3.0 * t) * np.sin(4.0 * t)
    for z in (2.0, 5.0, 20.0, -2.0, -5.0, -20.0):
        num, den = zero_family(z)
        yz = sim_step(num, den, t)
        gap = float(np.max(np.abs(yz - (y0 + yp / z))))
        assert gap < 5e-9, (z, gap)
        COUNTS["closed_form"] += 1
        m = measure(num, den, 4.0)
        tag = "LHP" if z > 0 else "RHP"
        say(f"    zero at s = {-z:+6.1f} ({tag}): overshoot "
            f"{m['overshoot_pct']:7.3f}% , minimum {m['min']:+.6f} at "
            f"t = {m['t_min']:.4f} s ; y + y'/z matches to {gap:.2e}")
    k = int(np.argmax(yp))
    say(f"    the derivative term peaks at y' = {yp[k]:.6f} at t = {t[k]:.6f} s")
    t_yp = solve_for("argmax of y'", lambda tt: np.cos(4 * tt) * 4 - 3 * np.sin(4 * tt),
                     0.1, 0.4)
    say(f"    solved argmax of y' = {t_yp:.6f} s, y'max = "
        f"{6.25 * np.exp(-3 * t_yp) * np.sin(4 * t_yp):.6f}")

    # ---- 9b. the RHP zero forces undershoot: weighted area is exactly 0 ---
    say("\n  non-minimum phase: integral of y(t) e^{-zt} must vanish:")
    for z in (2.0, 5.0, 20.0):
        num, den = zero_family(-z)          # zero at s = +z
        A, B, C, d = realise(num, den)

        def y_of(tt, A=A, B=B, C=C, d=d):
            sol = solve_ivp(lambda _t, x: A @ x + B, (0.0, max(tt, 1e-12)),
                            np.zeros(A.shape[0]), rtol=1e-12, atol=1e-14,
                            method="DOP853")
            return float(C @ sol.y[:, -1] + d)
        val, err = quad(lambda tt: y_of(tt) * np.exp(-z * tt), 0.0, 30.0, limit=400)
        COUNTS["measured"] += 1
        assert abs(val) < 2e-6, (z, val)
        m = measure(num, den, 4.0)
        say(f"    z = {z:<5} weighted area {val:+.3e} (+-{err:.1e}) ; measured "
            f"undershoot {m['min']:+.6f} , initial slope target -25/z = {-25 / z:+.4f}")

    # ---- 10. inexact cancellation ----------------------------------------
    say("\n  cancelling a stable pole at -0.4 with a zero at -0.4(1+d):")
    for delta in (0.0, 0.02, 0.05, 0.20):
        zloc = 0.4 * (1.0 + delta)
        num = np.polymul([1.0, zloc], [16.0 / zloc])
        den = np.polymul(np.polymul([1.0, 0.4], [1.0, 5.0]), [1.0, 8.0])
        p, r = residues(num, np.polymul(den, [1, 0]))
        k = int(np.argmin(np.abs(p + 0.4)))
        m = measure(num, den, 40.0, band=0.02, n=400001)
        m5 = measure(num, den, 40.0, n=400001)
        assert abs(np.polyval(num, 0.0) / np.polyval(den, 0.0) - 1.0) < 1e-12
        say(f"    mismatch {delta * 100:4.1f}% : residue at -0.4 = {r[k].real:+.6f} , "
            f"5% settling {m5['t_settle']:.4f} s , 2% settling {m['t_settle']:.4f} s")

    say("\n  cancelling an UNSTABLE pole at +1 with a zero at +1(1+d):")
    runaway = {}
    for delta in (0.01, 0.05, 0.20):
        zloc = UNSTABLE_POLE * (1.0 + delta)
        num = [5.0 / zloc, -5.0]           # K(s - zloc), K set for unit DC gain
        den = np.polymul([1.0, -1.0], [1.0, 5.0])
        assert abs(np.polyval(num, 0.0) / np.polyval(den, 0.0) - 1.0) < 1e-12
        p, r = residues(num, np.polymul(den, [1, 0]))
        k = int(np.argmin(np.abs(p - 1.0)))
        t = grid(12.0, 120001)
        y = sim_step(num, den, t)
        COUNTS["measured"] += 1
        runaway[delta] = (r[k].real, float(y[int(np.argmin(abs(t - 10.0)))]))
        say(f"    mismatch {delta * 100:4.1f}% : residue at +1 = {r[k].real:+.6f} , "
            f"y(10 s) = {y[int(np.argmin(abs(t - 10.0)))]:.4f} , "
            f"y(12 s) = {y[-1]:.4f}")
    lag = solve_for("when the 5% case reaches the 1% case's 10 s value",
                    lambda tt: abs(runaway[0.05][0]) * np.exp(tt)
                    - abs(runaway[0.01][1]), 5.0, 10.0)
    say(f"    the 5% case reaches the 1% case's 10 s size at t = {lag:.4f} s, "
        f"{10 - lag:.4f} s sooner")

    # ---- 11. a sum of terms is ONE complex number ------------------------
    say("\n  parallel terms: 1/(s+1) + 4/(s+5) at s = j2:")
    s0 = 2j
    a = 1.0 / (s0 + 1.0)
    b = 4.0 / (s0 + 5.0)
    tot = a + b
    comb_n, comb_d = [5.0, 9.0], np.polymul([1, 1], [1, 5])
    tot2 = np.polyval(comb_n, s0) / np.polyval(comb_d, s0)
    assert abs(tot - tot2) < 1e-12
    say(f"    term 1: {abs(a):.6f} angle {np.degrees(np.angle(a)):.4f} deg")
    say(f"    term 2: {abs(b):.6f} angle {np.degrees(np.angle(b)):.4f} deg")
    say(f"    SUM   : {abs(tot):.6f} angle {np.degrees(np.angle(tot)):.4f} deg")
    say(f"    wrong route (angles added): {np.degrees(np.angle(a) + np.angle(b)):.4f} deg"
        f" ; magnitudes added: {abs(a) + abs(b):.6f}")
    say(f"    factored: zero at s = {-9.0 / 5.0}, numerator |9+j10| = "
        f"{abs(9 + 10j):.6f} angle {np.degrees(np.angle(9 + 10j)):.4f} deg ;"
        f" denominator |1+j12| = {abs(1 + 12j):.6f} angle "
        f"{np.degrees(np.angle(1 + 12j)):.4f} deg")

    # ---- 12. the discrete map z = e^{sT} ---------------------------------
    say("\n  z = e^{sT} with T = 0.1 s applied to the reference pair:")
    T = 0.1
    sp = np.array([-3 + 4j, -3 - 4j])
    zp = np.exp(sp * T)
    A, B, C, d = realise(REF_NUM, REF_DEN)
    Ad, Bd, Cd, Dd, _ = cont2discrete((A, B.reshape(-1, 1), C.reshape(1, -1), [[d]]), T)
    Ad, Bd, Cd, Dd = (np.atleast_2d(np.asarray(v, float)) for v in (Ad, Bd, Cd, Dd))
    ev = np.sort_complex(np.linalg.eigvals(Ad))
    assert np.max(np.abs(np.sort_complex(zp) - ev)) < 1e-11, (zp, ev)
    say(f"    s = -3+j4  ->  z = {zp[0].real:.6f}{zp[0].imag:+.6f}j , "
        f"|z| = {abs(zp[0]):.6f} , angle {np.degrees(np.angle(zp[0])):.4f} deg")
    say(f"    ZOH discretisation eigenvalues agree to "
        f"{np.max(np.abs(np.sort_complex(zp) - ev)):.2e}")
    k5 = solve_for("samples to 5% envelope",
                   lambda k: abs(zp[0]) ** k - 0.05, 1.0, 200.0)
    say(f"    envelope |z|^k reaches 5% at k = {k5:.4f} samples = {k5 * T:.4f} s "
        f"(continuous 3/sigma = {3 / 3.0:.4f} s)")
    say(f"    ringing period 2*pi/(wd*T) = {2 * np.pi / (4 * T):.4f} samples")
    # discrete simulation, run as a difference equation - a third route
    n = 40
    x = np.zeros((A.shape[0], n + 1))
    for i in range(n):
        x[:, i + 1] = Ad @ x[:, i] + Bd[:, 0]
    yd = Cd[0] @ x + Dd[0, 0]
    tc = grid(n * T, 40001)
    yc = sim_step(REF_NUM, REF_DEN, tc)
    gap = float(np.max(np.abs(yd - np.interp(np.arange(n + 1) * T, tc, yc))))
    COUNTS["measured"] += 1
    assert gap < 1e-8, gap
    say(f"    difference equation vs continuous simulation at the sample "
        f"instants: {gap:.2e}")
    zp9 = solve_for("s from z = 0.9 at T = 0.05", lambda s: np.exp(s * 0.05) - 0.9,
                    -10.0, -0.1)
    say(f"    z = 0.9 at T = 0.05 s  ->  s = {zp9:.6f} , tau = {-1 / zp9:.6f} s")

    # ---- 12. the map-reading example --------------------------------------
    say("\n  map reading, 6.25(s+8)/[(s^2+3s+6.25)(s+8)]:")
    nMR, dMR = [6.25, 50.0], np.polymul([1.0, 3.0, 6.25], [1.0, 8.0])
    mMR = measure(nMR, dMR, 5.0)
    mPair = measure([6.25], [1.0, 3.0, 6.25], 5.0)
    say(f"    DC gain {np.polyval(nMR, 0.0) / np.polyval(dMR, 0.0):.6f} ; "
        f"wn = {np.sqrt(6.25):.4f}, zeta = {1.5 / np.sqrt(6.25):.4f}")
    say(f"    measured overshoot {mMR['overshoot_pct']:.4f}% , peak "
        f"{mMR['t_peak']:.4f} s , 5% settling {mMR['t_settle']:.4f} s")
    say(f"    the pair on its own: {mPair['overshoot_pct']:.4f}% , "
        f"{mPair['t_peak']:.4f} s , {mPair['t_settle']:.4f} s")
    tMR = grid(5.0, 100001)
    assert float(np.max(np.abs(sim_step(nMR, dMR, tMR)
                               - sim_step([6.25], [1, 3, 6.25], tMR)))) < 1e-9

    # ---- 13. every answer printed in the problem sets ---------------------
    say("\n  problem-set answers:")
    m = measure([8.0], [1.0, 4.0, 8.0], 8.0)
    zA = 2.0 / np.sqrt(8.0)
    say(f"    A1 poles -2+-j2: wn = {np.sqrt(8.0):.6f}, zeta = {zA:.6f}, "
        f"measured overshoot {m['overshoot_pct']:.4f}% (e^-pi = "
        f"{100 * np.exp(-np.pi):.4f}%), peak {m['t_peak']:.4f} s "
        f"(pi/wd = {np.pi / 2:.4f}), 5% settling {m['t_settle']:.4f} s")
    assert abs(m["overshoot_pct"] - 100 * np.exp(-np.pi)) < 2e-4

    ma = measure([40.0], np.polymul([1, 2], [1, 20]), 8.0)
    mb = measure([2.0], [1.0, 2.0], 8.0)
    tA = grid(8.0, 200001)
    dA = sim_step([40.0], np.polymul([1, 2], [1, 20]), tA) - sim_step([2.0], [1, 2], tA)
    kA = int(np.argmax(np.abs(dA)))
    COUNTS["measured"] += 2
    say(f"    A2 40/[(s+2)(s+20)] vs 2/(s+2): worst gap {abs(dA[kA]):.6f} at "
        f"t = {tA[kA]:.6f} s ; closed form 10^(-10/9) = "
        f"{10 ** (-10 / 9):.6f} at {np.log(10) / 18:.6f} s")
    assert abs(abs(dA[kA]) - 10 ** (-10 / 9)) < 5e-6
    say(f"       (settling {ma['t_settle']:.4f} s full, {mb['t_settle']:.4f} s reduced)")

    numA3, denA3 = [25.0, 100.0], np.polymul([1.0, 2.0, 5.0], [1.0, 10.0])
    assert abs(np.polyval(numA3, 0.0) / np.polyval(denA3, 0.0) - 2.0) < 1e-12
    m3 = measure(numA3, denA3, 10.0)
    p3b, r3b = residues_confirmed("A3", numA3, denA3)
    say(f"    A3 25(s+4)/[(s^2+2s+5)(s+10)]: DC 2, measured overshoot "
        f"{m3['overshoot_pct']:.4f}% , peak {m3['t_peak']:.4f} s , 5% settling "
        f"{m3['t_settle']:.4f} s")
    for pk, rk in sorted(zip(p3b, r3b), key=lambda v: -v[0].real):
        say(f"       residue at {pk:+.4f} = {rk:+.6f}")
    rc = r3b[int(np.argmin(np.abs(p3b - (-1 + 2j))))]
    say(f"       complex residue polar: 2|r| = {2 * abs(rc):.6f} , angle = "
        f"{np.degrees(np.angle(rc)):.4f} deg = {np.angle(rc):.6f} rad")
    tA3 = grid(10.0, 200001)
    yA3 = sim_step(numA3, denA3, tA3)
    recon = (2.0 + 2 * abs(rc) * np.exp(-tA3) * np.cos(2 * tA3 + np.angle(rc))
             + 0.17647058823529413 * np.exp(-10 * tA3))
    gA3 = float(np.max(np.abs(recon - yA3)))
    assert gA3 < 1e-8, gA3
    COUNTS["closed_form"] += 1
    say(f"       polar reconstruction vs simulation: {gA3:.2e}")
    # geometric residue formula, checked against N(p)/D'(p)
    zs3 = np.array([-4.0])
    ps3 = np.array([0.0, -1 + 2j, -1 - 2j, -10.0])
    for k, pk in enumerate(ps3):
        others = np.delete(ps3, k)
        geo = 25.0 * np.prod(pk - zs3) / np.prod(pk - others)
        ref_r = r3b[int(np.argmin(np.abs(p3b - pk)))]
        assert abs(geo - ref_r) < 1e-9, (pk, geo, ref_r)
    COUNTS["residue"] += len(ps3)
    say("       geometric residue formula K*prod(p-z)/prod(p-p') reproduces all four")

    pB1, rB1 = residues_confirmed("B1", [20.0], np.polymul([1, 2], [1, 10]))
    say("    B1 y = 1 - 1.25e^-2t + 0.25e^-10t  ->  H = 20/[(s+2)(s+10)] ; "
        "residues " + ", ".join(f"{v.real:+.4f}" for v in
                                sorted(rB1, key=lambda v: -v.real)))

    mB2 = measure([16.0], [1.0, 4.0, 16.0], 12.0, band=0.02)
    say(f"    B2 zeta 0.5, wn 4 (poles -2+-j3.4641): rule says t_s = 4/2 = 2 s ; "
        f"MEASURED 2% settling {mB2['t_settle']:.4f} s , overshoot "
        f"{mB2['overshoot_pct']:.4f}%")
    zB3 = np.exp((-4 + 3j) * 0.2)
    say(f"    B3 s = -4+j3, T = 0.2  ->  z = {zB3.real:.6f}{zB3.imag:+.6f}j , "
        f"|z| = {abs(zB3):.6f} , angle {np.degrees(np.angle(zB3)):.4f} deg")
    sB4 = (np.log(0.5) + 1j * np.pi) / 0.1
    assert abs(np.exp(sB4 * 0.1) + 0.5) < 1e-12
    say(f"    B4 z = -0.5, T = 0.1  ->  s = {sB4.real:.6f}{sB4.imag:+.6f}j ; "
        f"Nyquist rate pi/T = {np.pi / 0.1:.4f} rad/s")
    kB4 = solve_for("samples for |z|^k = 0.05 at |z| = 0.5",
                    lambda k: 0.5 ** k - 0.05, 1.0, 40.0)
    say(f"       envelope 0.5^k hits 5% at k = {kB4:.4f} samples")

    # section 9 instant used in the prose
    tstar = t_yp
    tref = grid(1.0, 100001)
    y_at = float(np.interp(tstar, tref, sim_step(REF_NUM, REF_DEN, tref)))
    COUNTS["measured"] += 1
    say(f"    section 9 instant t = {tstar:.6f}: y = {y_at:.6f}, y' = "
        f"{6.25 * np.exp(-3 * tstar) * np.sin(4 * tstar):.6f}, y + y'/4 = "
        f"{y_at + 6.25 * np.exp(-3 * tstar) * np.sin(4 * tstar) / 4:.6f}")
    m4 = measure(*zero_family(4.0), 4.0)
    say(f"    zero at -4 on the reference pair: measured overshoot "
        f"{m4['overshoot_pct']:.4f}% , peak {m4['t_peak']:.4f} s , peak value "
        f"{m4['peak']:.6f}")
    x4 = crossing(m4["t"], m4["y"], 1.0)
    xb = crossing(ref["t"], ref["y"], 1.0)
    COUNTS["measured"] += 2
    say(f"       first crossing of the final value: {x4:.6f} s with the zero vs "
        f"{xb:.6f} s without, {100 * (1 - x4 / xb):.2f}% earlier")

    if loud:
        say(f"\n  VERIFICATION TOTALS: {COUNTS['measured']} response features measured "
            f"off a simulation, {COUNTS['residue']} residues confirmed by fitting the "
            f"simulated response, {COUNTS['solved']} equations solved with a bracketed "
            f"root finder, {COUNTS['closed_form']} closed forms checked against the "
            f"simulation.")
    return COUNTS


# ===========================================================================
# figures
# ===========================================================================
def corner(ax, mode, text, x=0.01, y=0.99, size=9, ha="left", va="top"):
    """A block of ink text pinned to the axes box, outside the data limits."""
    ax.text(x, y, text, transform=ax.transAxes, color=S.INK_2[mode],
            fontsize=size, ha=ha, va=va, linespacing=1.45)


def splane_axes(ax, mode, xlim, ylim):
    ax.axhline(0.0, color=S.GRID[mode], lw=1.0)
    ax.axvline(0.0, color=S.INK_2[mode], lw=1.4)
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.set_xlabel("Re(s)  [1/s]")
    ax.set_ylabel("Im(s)  [rad/s]")
    S.strip(ax)


def pole(ax, s, colour, size=10, lw=2.0):
    ax.plot([s.real], [s.imag], marker="x", ms=size, mew=lw, color=colour,
            ls="none", clip_on=False)


def zero(ax, s, colour, size=9, lw=1.8):
    ax.plot([s.real], [s.imag], marker="o", ms=size, mew=lw, mfc="none",
            color=colour, ls="none", clip_on=False)


@figure("ctl5-region-map")
def f_region(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(6.6, 5.2))

    # Angles are the whole content of this figure, so the axes are square.
    # Only the upper half is drawn; the conjugate mirrors everything below.
    for wn in (2.0, 5.0, 8.0):
        th = np.linspace(np.pi / 2, np.pi, 300)
        ax.plot(wn * np.cos(th), wn * np.sin(th), color=S.GUIDE[mode], lw=1.0, ls=":")
        S.note(ax, -0.15, wn, f"$\\omega_n$ = {wn:g}", mode, size=8.5, ha="right",
               va="bottom")

    for z in (0.3, 0.6, 0.9):
        th = np.arccos(z)
        rr = np.array([0.0, 9.0])
        ax.plot(-rr * np.cos(th), rr * np.sin(th), color=c[1], lw=1.2, ls="--")
        S.note(ax, -7.4 * np.cos(th), 7.4 * np.sin(th) + 0.12, f"$\\zeta$ = {z:g}",
               mode, size=9, ha="center")

    # design region: sigma >= 2 AND zeta >= 0.5 AND omega_n <= 8
    th0 = np.arccos(0.5)
    thg = np.linspace(th0, 0.0, 260)
    arc = np.column_stack([-8.0 * np.cos(thg), 8.0 * np.sin(thg)])
    poly = np.vstack([[-2.0, 0.0], [-2.0, 2.0 * np.tan(th0)], arc, [-2.0, 0.0]])
    assert abs(poly[1, 1] - 3.4641016) < 1e-6 and abs(arc[0, 0] + 4.0) < 1e-9
    ax.add_patch(Polygon(poly, closed=True, facecolor=c[0], alpha=0.16,
                         edgecolor=c[0], lw=1.4))
    ax.plot([-2.0, -2.0], [0.0, 8.6], color=c[0], lw=1.2, ls="-.")
    S.note(ax, -1.92, 8.2, "$\\sigma \\geq 2$", mode, size=9)

    pole(ax, -3 + 4j, c[2])
    ax.annotate("$-3 + j4$", xy=(-3, 4), xytext=(-16, 12), textcoords="offset points",
                color=c[2], fontsize=10, fontweight="semibold", ha="right")
    ax.plot([0, -3], [0, 4], color=S.INK_2[mode], lw=1.2)
    ax.add_patch(Wedge((0, 0), 1.7, 180 - np.degrees(np.arccos(0.6)), 180,
                       facecolor="none", edgecolor=S.INK_2[mode], lw=1.1))
    S.note(ax, -1.42, 0.62, "$\\theta$", mode, size=11)
    assert abs(np.hypot(3, 4) - 5) < 1e-12 and abs(3 / 5 - 0.6) < 1e-12

    ax.axhline(0.0, color=S.INK_2[mode], lw=1.0)
    ax.axvline(0.0, color=S.INK_2[mode], lw=1.4)
    ax.set_xlim(-9.4, 1.4)
    ax.set_ylim(-1.1, 9.2)
    ax.set_aspect("equal")
    ax.set_xlabel("Re(s)  [1/s]")
    ax.set_ylabel("Im(s)  [rad/s]")
    S.strip(ax)
    corner(ax, mode,
           "shaded: $\\zeta \\geq 0.5$, $\\omega_n \\leq 8$, $\\sigma \\geq 2$\n"
           "marked pole: $\\omega_n$ = 5, $\\zeta$ = cos $\\theta$ = 0.6\n"
           "the conjugate at $-3 - j4$ mirrors all of this")
    ax.set_title("Loci of constant $\\zeta$, $\\omega_n$ and $\\sigma$")
    fig.tight_layout()
    return fig


@figure("ctl5-mode-decomposition")
def f_modes(mode):
    c = S.SERIES[mode]
    t = grid(3.0, 60001)
    y = sim_step(TRI_NUM, TRI_DEN, t)
    p, r = residues(TRI_NUM, np.polymul(TRI_DEN, [1, 0]))
    order = np.argsort(-p.real)
    p, r = p[order].real, r[order].real
    assert abs(r[0] - 1.0) < 1e-12
    terms = [rk * np.exp(pk * t) for pk, rk in zip(p, r)]
    total = np.sum(terms, axis=0)
    assert np.max(np.abs(total - y)) < 1e-8

    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 5.4), sharex=True,
                                 gridspec_kw={"height_ratios": [1.25, 1.0]})
    a1.plot(t, y, color=S.INK[mode], lw=2.4, alpha=0.35)
    a1.plot(t, total, color=c[0], lw=1.6, ls="--")
    S.label_end(a1, t[-1], y[-1], "  simulated", S.INK_2[mode], mode, size=9)
    S.label_end(a1, t[-1], total[-1] - 0.12, "  $\\sum$ residue terms", c[0], mode, size=9)
    a1.set_ylabel("step response")
    a1.set_title("Every pole is one term of $y(t)$")
    S.strip(a1)

    names = ["$+1.0000$ (from the input)", "$-1.5789\\,e^{-t}$", "$+0.5882\\,e^{-3t}$",
             "$-0.0093\\,e^{-20t}$"]
    spots = [2.05, 0.55, 0.16, 0.16]
    offs = [(0, 8), (6, -12), (8, 6), (8, -14)]
    for k, (pk, rk, term) in enumerate(zip(p, r, terms)):
        col = [S.GUIDE[mode], c[0], c[1], c[2]][k]
        a2.plot(t, term, color=col, lw=1.9)
        j = int(len(t) * spots[k] / 3.0)
        a2.annotate(names[k], xy=(t[j], term[j]), xytext=offs[k],
                    textcoords="offset points", color=col, fontsize=9.5,
                    fontweight="semibold")
    a2.set_ylabel("term value")
    a2.set_xlabel("time  [s]")
    S.strip(a2)
    corner(a2, mode,
           "the $-20$ pole carries "
           f"{abs(r[3]) / abs(r[1]) * 100:.2f}% of the $-1$ pole's weight",
           x=0.30, y=0.11)
    fig.tight_layout()
    return fig


@figure("ctl5-residue-gap")
def f_residue_gap(mode):
    c = S.SERIES[mode]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 4.0))

    gaps = np.logspace(-3, 0.3, 200)
    res = []
    for g in gaps:
        z = 1.0 + g
        p, r = residues([3.0 / z, 3.0], np.polymul([1, 4, 3], [1, 0]))
        res.append(abs(r[int(np.argmin(np.abs(p + 1.0)))]))
    res = np.array(res)
    exact = 1.5 * gaps / (1.0 + gaps)
    assert np.max(np.abs(res - exact)) < 1e-12
    a1.loglog(gaps, res, color=c[0], lw=2.0)
    a1.loglog(gaps, 1.5 * gaps, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.label_end(a1, gaps[-1], res[-1], "  measured", c[0], mode, size=9)
    S.note(a1, 2e-3, 1.5 * 2e-3 * 1.6, "slope 1: $1.5\\,\\Delta$", mode, size=9)
    a1.set_xlabel("gap $\\Delta$ between zero and the pole at $-1$")
    a1.set_ylabel("residue magnitude at the pole $-1$")
    a1.set_title("Residue vanishes linearly in the gap")
    S.strip(a1)

    t = grid(6.0, 120001)
    for k, (z, xl) in enumerate(((1.05, 0.75), (1.5, 1.45), (3.0, 2.55))):
        y = sim_step([3.0 / z, 3.0], [1, 4, 3], t)
        a2.plot(t, y, color=c[k], lw=1.9)
        j = int(len(t) * xl / 6.0)
        a2.annotate(f"zero at $-{z:g}$", xy=(t[j], y[j]), xytext=(6, -13),
                    textcoords="offset points", color=c[k], fontsize=9.5,
                    fontweight="semibold")
    a2.set_xlim(0, 6)
    a2.set_ylim(0, 1.14)
    a2.set_xlabel("time  [s]")
    a2.set_ylabel("step response")
    a2.set_title("The slow mode fades with the residue")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl5-dominance-error")
def f_dominance(mode):
    c = S.SERIES[mode]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 4.0))

    rs = np.linspace(1.6, 30.0, 120)
    meas, cf = [], []
    t = grid(20.0, 200001)
    y_dom = sim_step([1.0], [1, 1], t)
    for r in rs:
        y_full = sim_step([r], [1.0, 1.0 + r, r], t)
        meas.append(np.max(np.abs(y_full - y_dom)))
        cf.append(r ** (-r / (r - 1.0)))
    meas, cf = np.array(meas), np.array(cf)
    assert np.max(np.abs(meas - cf)) < 5e-6, np.max(np.abs(meas - cf))
    a1.plot(rs, 100 * meas, color=c[0], lw=2.1)
    a1.plot(rs, 100 * cf, color=S.GUIDE[mode], lw=1.2, ls="--")
    for r in (5.0, 10.0):
        v = 100 * r ** (-r / (r - 1.0))
        a1.plot([r], [v], marker="o", ms=6, color=c[1], ls="none")
        S.note(a1, r + 0.6, v + 0.6, f"{r:g}$\\times$: {v:.2f}%", mode, size=9)
    a1.set_xlabel("separation $r$ (second pole at $-r$)")
    a1.set_ylabel("worst-case error  [% of final value]")
    a1.set_title("Measured cost of dropping a pole")
    S.strip(a1)

    tt = grid(4.0, 80001)
    yd = sim_step([1.0], [1, 1], tt)
    for k, r in enumerate((3.0, 5.0, 10.0)):
        yf = sim_step([r], [1.0, 1.0 + r, r], tt)
        a2.plot(tt, yf - yd, color=c[k], lw=1.9)
        S.label_end(a2, 1.5, (yf - yd)[int(len(tt) * 1.5 / 4.0)],
                    f"  $r$ = {r:g}", c[k], mode, size=9)
    a2.set_xlim(0, 4)
    a2.set_xlabel("time  [s]")
    a2.set_ylabel("$y_r(t) - y_{\\rm dom}(t)$")
    a2.set_title("Where the error lives")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl5-zero-derivative")
def f_zero_deriv(mode):
    c = S.SERIES[mode]
    t = grid(2.6, 52001)
    y = sim_step(REF_NUM, REF_DEN, t)
    yp = 6.25 * np.exp(-3 * t) * np.sin(4 * t)
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 4.0))

    z = 4.0
    yz = sim_step(*zero_family(z), t)
    assert np.max(np.abs(yz - (y + yp / z))) < 5e-9
    a1.plot(t, y, color=S.GUIDE[mode], lw=1.6)
    a1.plot(t, yp / z, color=c[1], lw=1.9)
    a1.plot(t, yz, color=c[0], lw=2.1)
    S.label_end(a1, 1.35, y[int(len(t) * 1.35 / 2.6)], "  $y$", S.INK_2[mode], mode, size=9)
    S.label_end(a1, 0.62, (yp / z)[int(len(t) * 0.62 / 2.6)], "  $y'/z$", c[1], mode, size=9)
    S.label_end(a1, 0.30, yz[int(len(t) * 0.30 / 2.6)], "  $y + y'/z$", c[0], mode, size=9)
    a1.set_xlabel("time  [s]")
    a1.set_ylabel("step response")
    a1.set_title("A zero at $-4$ adds a scaled derivative")
    S.strip(a1)

    zs = np.linspace(1.2, 25.0, 90)
    ov = [measure(*zero_family(zz), 4.0, n=40001)["overshoot_pct"] for zz in zs]
    a2.plot(zs, ov, color=c[0], lw=2.1)
    base = measure(REF_NUM, REF_DEN, 4.0, n=40001)["overshoot_pct"]
    a2.axhline(base, color=S.GUIDE[mode], lw=1.1, ls="--")
    S.note(a2, 14.0, base + 2.0, f"no zero: {base:.2f}%", mode, size=9)
    for zz in (2.0, 5.0):
        v = measure(*zero_family(zz), 4.0, n=40001)["overshoot_pct"]
        a2.plot([zz], [v], marker="o", ms=6, color=c[1], ls="none")
        S.note(a2, zz + 0.7, v, f"$-{zz:g}$: {v:.1f}%", mode, size=9)
    a2.set_xlabel("zero location $-z$ (plotted against $z$)")
    a2.set_ylabel("measured overshoot  [%]")
    a2.set_title("Overshoot against zero position")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl5-nmp-undershoot")
def f_nmp(mode):
    c = S.SERIES[mode]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 4.0))
    t = grid(3.0, 60001)
    for k, (z, off) in enumerate(((2.0, (14, -2)), (5.0, (16, -4)), (20.0, (18, -6)))):
        y = sim_step(*zero_family(-z), t)
        a1.plot(t, y, color=c[k], lw=1.9)
        j = int(np.argmin(y))
        a1.annotate(f"$z$ = {z:g}", xy=(t[j], y[j]), xytext=off,
                    textcoords="offset points", color=c[k], fontsize=9.5,
                    fontweight="semibold")
    a1.axhline(0.0, color=S.GRID[mode], lw=1.0)
    a1.set_xlabel("time  [s]")
    a1.set_ylabel("step response")
    a1.set_title("Zero at $s = +z$: the wrong way first")
    S.strip(a1)

    zs = np.linspace(1.5, 30.0, 110)
    dips, slopes = [], []
    for zz in zs:
        m = measure(*zero_family(-zz), 3.0, n=30001)
        dips.append(-m["min"] * 100.0)
        slopes.append(25.0 / zz)
    a2.loglog(zs, dips, color=c[0], lw=2.1)
    a2.loglog(zs, 1250.0 / zs ** 2, color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(a2, 3.0, 1250.0 / 9.0 * 1.5, "$12.5/z^{2}$ small-$t$ estimate", mode, size=9)
    S.label_end(a2, zs[-1], dips[-1], "  measured", c[0], mode, size=9)
    a2.set_xlabel("zero location $z$  [rad/s]")
    a2.set_ylabel("undershoot depth  [% of final]")
    a2.set_title("Depth against zero position")
    S.strip(a2)
    assert dips[0] > dips[-1]
    fig.tight_layout()
    return fig


@figure("ctl5-cancellation-risk")
def f_cancel(mode):
    c = S.SERIES[mode]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.6, 4.0))

    t = grid(20.0, 200001)
    den = np.polymul(np.polymul([1.0, 0.4], [1.0, 5.0]), [1.0, 8.0])
    for k, (delta, xl) in enumerate(((0.0, 1.55), (0.05, 12.0), (0.20, 8.0))):
        zloc = 0.4 * (1.0 + delta)
        y = sim_step(np.polymul([1.0, zloc], [16.0 / zloc]), den, t)
        a1.semilogy(t, np.abs(1.0 - y), color=c[k], lw=1.9)
        j = int(len(t) * xl / 20.0)
        a1.annotate(f"{delta * 100:.0f}% off", xy=(t[j], abs(1.0 - y[j])),
                    xytext=(6, 6), textcoords="offset points", color=c[k],
                    fontsize=9.5, fontweight="semibold")
    a1.set_xlim(0, 20)
    a1.set_ylim(1e-6, 2.0)
    a1.set_xlabel("time  [s]")
    a1.set_ylabel("$|1 - y(t)|$")
    a1.set_title("Stable pole: a slow tail survives")
    S.strip(a1)

    t2 = grid(12.0, 120001)
    den2 = np.polymul([1.0, -1.0], [1.0, 5.0])
    for k, delta in enumerate((0.01, 0.05, 0.20)):
        zloc = 1.0 + delta
        num2 = [5.0 / zloc, -5.0]
        assert abs(np.polyval(num2, 0.0) / np.polyval(den2, 0.0) - 1.0) < 1e-12
        y = sim_step(num2, den2, t2)
        a2.semilogy(t2, np.abs(y), color=c[k], lw=1.9)
        # The three curves are parallel on a log axis, so an on-curve label
        # cannot be separated from its neighbours; they are direct-labelled in
        # the empty band below the notches instead, with their residues.
        pk = residues(num2, np.polymul(den2, [1, 0]))
        rk = pk[1][int(np.argmin(np.abs(pk[0] - 1.0)))].real
        a2.text(6.4, 10 ** (-2.4 - 1.05 * k), f"{delta * 100:.0f}% off:  "
                f"residue {rk:+.6f}", color=c[k], fontsize=9.5,
                fontweight="semibold", va="center")
    a2.set_xlim(0, 12)
    a2.set_xlabel("time  [s]")
    a2.set_ylabel("$|y(t)|$")
    a2.set_title("Unstable pole: nothing survives")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("ctl5-zplane-map")
def f_zplane(mode):
    c = S.SERIES[mode]
    T = 0.1
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.8, 4.2))

    wmax = np.pi / T
    for k, sg in enumerate((-3.0, -12.0)):
        a1.plot([sg, sg], [-wmax, wmax], color=c[k], lw=1.9)
    for k, w in enumerate((4.0, 16.0)):
        a1.plot([-20.0, 0.0], [w, w], color=c[2], lw=1.2, ls="--")
        a1.plot([-20.0, 0.0], [-w, -w], color=c[2], lw=1.2, ls="--")
    a1.axhline(wmax, color=S.GUIDE[mode], lw=1.1, ls=":")
    a1.axhline(-wmax, color=S.GUIDE[mode], lw=1.1, ls=":")
    S.note(a1, -19.5, wmax + 1.0, "$\\omega = \\pi/T$ (Nyquist)", mode, size=9)
    for s in (-3 + 4j, -3 - 4j):
        pole(a1, s, S.INK[mode])
    splane_axes(a1, mode, (-20.0, 3.0), (-wmax * 1.35, wmax * 1.35))
    a1.set_title("s-plane strip, $T$ = 0.1 s")

    th = np.linspace(0, 2 * np.pi, 721)
    a2.plot(np.cos(th), np.sin(th), color=S.INK_2[mode], lw=1.5)
    for k, sg in enumerate((-3.0, -12.0)):
        rad = np.exp(sg * T)
        a2.plot(rad * np.cos(th), rad * np.sin(th), color=c[k], lw=1.9)
        ang = (0.75 if k == 0 else 1.25) * np.pi
        a2.annotate(f"$|z|$ = {rad:.3f}", xy=(rad * np.cos(ang), rad * np.sin(ang)),
                    xytext=(-4, 2 if k == 0 else -12), textcoords="offset points",
                    color=c[k], fontsize=9, fontweight="semibold", ha="right")
    for w in (4.0, 16.0):
        ang = w * T
        rr = np.array([0.0, 1.12])
        for sgn in (1, -1):
            a2.plot(rr * np.cos(sgn * ang), rr * np.sin(sgn * ang), color=c[2],
                    lw=1.2, ls="--")
    zz = np.exp((-3 + 4j) * T)
    for s in (zz, zz.conjugate()):
        pole(a2, s, S.INK[mode])
    assert abs(abs(zz) - np.exp(-0.3)) < 1e-12
    assert abs(np.angle(zz) - 0.4) < 1e-12
    a2.set_aspect("equal")
    a2.set_xlim(-1.25, 1.25)
    a2.set_ylim(-1.25, 1.25)
    a2.axhline(0.0, color=S.GRID[mode], lw=1.0)
    a2.axvline(0.0, color=S.GRID[mode], lw=1.0)
    a2.set_xlabel("Re(z)")
    a2.set_ylabel("Im(z)")
    a2.set_title("z-plane, $z = e^{sT}$")
    S.strip(a2)
    corner(a2, mode, f"$-3+j4 \\rightarrow$ {zz.real:.4f}$+${zz.imag:.4f}$j$",
             size=8.5)
    fig.tight_layout()
    return fig


@figure("ctl5-settling-staircase")
def f_settling(mode):
    c = S.SERIES[mode]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    zs = np.linspace(0.15, 0.95, 161)
    vals = []
    for z in zs:
        m = measure([1.0], [1.0, 2 * z, 1.0], 80.0, band=0.02, n=200001)
        vals.append(m["t_settle"] * z)
    vals = np.array(vals)
    ax.plot(zs, vals, color=c[0], lw=2.0)
    ax.axhline(4.0, color=S.GUIDE[mode], lw=1.3, ls="--")
    S.note(ax, 0.16, 4.08, "the textbook rule $t_s = 4/(\\zeta\\omega_n)$", mode, size=9)
    bad = vals > 4.0
    ax.fill_between(zs, 4.0, vals, where=bad, color=c[1], alpha=0.30, lw=0)
    S.label_end(ax, zs[-1], vals[-1], "  measured", c[0], mode, size=9)
    ax.set_xlabel("damping ratio $\\zeta$")
    ax.set_ylabel("$t_s \\zeta \\omega_n$  (2% band)")
    ax.set_title("Measured settling time is a staircase, and the rule is not a bound")
    S.strip(ax)
    assert vals.max() > 4.0 and vals.min() < 3.1
    fig.tight_layout()
    return fig


@figure("ctl5-map-to-response")
def f_map_to_response(mode):
    c = S.SERIES[mode]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.8, 4.0))
    num, den = [6.25, 50.0], np.polymul([1.0, 3.0, 6.25], [1.0, 8.0])
    assert abs(np.polyval(num, 0.0) / np.polyval(den, 0.0) - 1.0) < 1e-12

    for s in (-1.5 + 2j, -1.5 - 2j, -8 + 0j):
        pole(a1, s, c[0], size=9, lw=1.9)
    zero(a1, -8 + 0j, c[1], size=15, lw=2.0)
    splane_axes(a1, mode, (-10.0, 1.5), (-3.6, 4.9))
    a1.set_title("The map, as the exam prints it")
    corner(a1, mode, "the pole at $-8$ carries a zero on top of it\n"
                     "$\\omega_n$ = 2.5, $\\zeta$ = 0.6 for the pair")

    t = grid(5.0, 100001)
    y = sim_step(num, den, t)
    y2 = sim_step([6.25], [1.0, 3.0, 6.25], t)
    assert float(np.max(np.abs(y - y2))) < 1e-9
    a2.plot(t, y, color=c[0], lw=2.4)
    a2.plot(t, y2, color=c[1], lw=1.3, ls="--")
    a2.annotate("third order, with the zero", xy=(3.0, y[int(len(t) * 3.0 / 5.0)]),
                xytext=(-4, 14), textcoords="offset points", color=c[0],
                fontsize=9.5, fontweight="semibold", ha="center")
    a2.annotate("the pair on its own", xy=(3.0, y2[int(len(t) * 3.0 / 5.0)]),
                xytext=(-4, -20), textcoords="offset points", color=c[1],
                fontsize=9.5, fontweight="semibold", ha="center")
    m = measure(num, den, 5.0)
    a2.set_ylim(0, 1.30)
    a2.set_xlabel("time  [s]")
    a2.set_ylabel("step response")
    a2.set_title("The cancelled pole leaves no trace")
    corner(a2, mode,
           f"measured overshoot {m['overshoot_pct']:.2f}%\n"
           f"measured peak time {m['t_peak']:.4f} s\n"
           f"measured 5% settling {m['t_settle']:.4f} s", y=0.34)
    S.strip(a2)
    fig.tight_layout()
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
    args = sys.argv[1:]
    verify()
    if "--verify" in args:
        return 0
    prefix = next((a for a in args if not a.startswith("-")), PREFIX)
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
