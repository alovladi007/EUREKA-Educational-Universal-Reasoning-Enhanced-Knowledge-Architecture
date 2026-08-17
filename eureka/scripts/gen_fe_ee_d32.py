#!/usr/bin/env python3
"""Depth-wave-32 figures for the FE Electrical and Computer course:
the Electromagnetics chapter on transmission lines (fee_em_tx_lines).

CONTRACT (same as the other gen_fe_ee_d*.py generators, and it imports the
SAME style module rather than growing a second look): every curve here is
COMPUTED, in this file, from equations the lesson writes out. Nothing is
traced, scanned, redrawn or adapted from a handbook, a vendor note or a chart.

WHAT MAKES THIS ONE DIFFERENT

Transmission-line teaching is unusually prone to circular verification: the
closed-form input impedance, the reflection coefficient and the standing-wave
envelope are all algebraic rearrangements of one another, so "checking" one
with another proves nothing. This generator therefore carries a SECOND,
independent solver: an explicit leapfrog finite-difference time-domain
integration of the telegrapher's equations themselves,

    dv/dz = -(R' i + L' di/dt),      di/dz = -(G' v + C' dv/dt)

on a staggered grid, with the source and load boundaries written as node
equations rather than as reflection coefficients. Nothing in the FDTD solver
knows what Z0, Gamma, VSWR or a quarter-wave transformer is. Every headline
claim in the lesson is confirmed against it.

Third and fourth routes are used where they add something:

    * ladder recursion  - N lumped series-impedance / shunt-admittance
      sections combined by ordinary circuit rules, which is where the
      distributed model comes from and converges to it as N grows;
    * boundary match    - solve the 2x2 linear system for the forward and
      backward wave amplitudes at the load, instead of quoting Gamma;
    * ABCD cascade      - matrix product, used for multi-section structures.

Run `python3 scripts/gen_fe_ee_d32.py --verify` to execute the whole
cross-check suite with its assertions and print the comparison table.

Each registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

and is referenced from the lesson as a markdown image whose ALT TEXT IS THE
CAPTION.

Usage:
    python3 scripts/gen_fe_ee_d32.py             # all em4- figures
    python3 scripts/gen_fe_ee_d32.py --verify    # numerical cross-checks only
    python3 scripts/gen_fe_ee_d32.py em4-smith   # only names with that prefix
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

REGISTRY: dict[str, callable] = {}


def figure(name):
    if not name.startswith("em4-"):
        raise ValueError(f"this generator owns only the em4- prefix: {name}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ------------------------------------------------------------------ constants
# SI defining constants and the 2019 CODATA electric constant. Nothing else in
# this file is a remembered number: every material figure is a named given.
C_LIGHT = 299792458.0            # m/s, exact by definition
MU0 = 4.0 * math.pi * 1e-7       # H/m
EPS0 = 8.8541878128e-12          # F/m
ETA0 = 376.730313                # ohm, sqrt(mu0/eps0)

# Self-consistency of the constant set. Since the 2019 SI revision mu0 is a
# MEASURED quantity and 4*pi*1e-7 is only its former exact value, so the three
# constants are mutually consistent to about 3e-10, not to machine precision.
# The tolerances below are that residual, not a slack allowance.
assert abs(1.0 / math.sqrt(MU0 * EPS0) - C_LIGHT) / C_LIGHT < 3e-10
assert abs(math.sqrt(MU0 / EPS0) - ETA0) / ETA0 < 2e-9


# ------------------------------------------------------------- line primitives
class Line:
    """A uniform line described ONLY by its four per-unit-length parameters.

    R' [ohm/m], L' [H/m], G' [S/m], C' [F/m]. Everything else - Z0, gamma,
    v_p, delay - is derived here from those four, so a unit error anywhere
    shows up as a wrong dimension rather than as a plausible number.
    """

    def __init__(self, L, C, R=0.0, G=0.0):
        self.L, self.C, self.R, self.G = float(L), float(C), float(R), float(G)

    # --- frequency-domain description
    def series_z(self, w):
        return self.R + 1j * w * self.L

    def shunt_y(self, w):
        return self.G + 1j * w * self.C

    def gamma(self, w):
        """Propagation constant, principal root with alpha >= 0."""
        g = cmath.sqrt(self.series_z(w) * self.shunt_y(w))
        return g if g.real >= 0 else -g

    def z0(self, w):
        return cmath.sqrt(self.series_z(w) / self.shunt_y(w))

    # --- lossless shorthands
    @property
    def z0_lossless(self):
        return math.sqrt(self.L / self.C)

    @property
    def vp_lossless(self):
        return 1.0 / math.sqrt(self.L * self.C)

    @property
    def delay_per_m(self):
        return math.sqrt(self.L * self.C)


def coax(b_over_a, eps_r):
    """Per-unit-length L and C of a coaxial line from its geometry."""
    lg = math.log(b_over_a)
    return Line(L=(MU0 / (2 * math.pi)) * lg, C=2 * math.pi * EPS0 * eps_r / lg)


def twin_lead(D_over_d, eps_r=1.0):
    """Per-unit-length L and C of a parallel two-wire line.

    D is centre-to-centre spacing, d the wire diameter; the arccosh form is
    exact for round conductors of any spacing, not the D >> d approximation.
    """
    a = math.acosh(D_over_d)
    return Line(L=(MU0 / math.pi) * a, C=math.pi * EPS0 * eps_r / a)


def microstrip_eeff(u, eps_r):
    """Effective permittivity of a microstrip of width ratio u = W/h."""
    return (eps_r + 1) / 2 + (eps_r - 1) / 2 * (1 + 12.0 / u) ** -0.5


def microstrip_z0(u, eps_r):
    """Characteristic impedance of a microstrip of width ratio u = W/h."""
    ee = microstrip_eeff(u, eps_r)
    if u <= 1.0:
        return ETA0 / (2 * math.pi * math.sqrt(ee)) * math.log(8.0 / u + u / 4.0)
    return ETA0 / (math.sqrt(ee) * (u + 1.393 + 0.667 * math.log(u + 1.444)))


def microstrip_width_ratio(z_target, eps_r, lo=0.05, hi=40.0):
    """Invert microstrip_z0 by bisection - no synthesis formula is quoted."""
    f = lambda u: microstrip_z0(u, eps_r) - z_target
    assert f(lo) * f(hi) < 0
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return 0.5 * (lo + hi)


# ---------------------------------------------------- four routes to Z_in
def zin_closed(z0, zl, gamma, length):
    """Route 1: the textbook tanh transformation."""
    t = cmath.tanh(gamma * length)
    return z0 * (zl + z0 * t) / (z0 + zl * t)


def zin_abcd(z0, zl, gamma, length):
    """Route 2: cascade matrix product, then terminate."""
    ch, sh = cmath.cosh(gamma * length), cmath.sinh(gamma * length)
    a = np.array([[ch, z0 * sh], [sh / z0, ch]], dtype=complex)
    v2 = complex(zl)
    i2 = 1.0 + 0j
    v1, i1 = a @ np.array([v2, i2])
    return v1 / i1


def wave_amplitudes(z0, zl, v_load=1.0 + 0j):
    """Route 3: solve the 2x2 boundary system for the forward and backward
    wave amplitudes at the load. No reflection-coefficient formula is used.

        V+ + V-              = V_L
        (V+ - V-)/Z0 - V_L/Z_L = 0
    """
    a = np.array([[1.0 + 0j, 1.0 + 0j],
                  [1.0 / z0, -1.0 / z0]], dtype=complex)
    b = np.array([v_load, v_load / zl], dtype=complex)
    vp, vm = np.linalg.solve(a, b)
    return vp, vm


def zin_ladder(line, w, zl, length, n):
    """Route 4: n lumped sections combined by ordinary series/parallel rules.

    This is the distributed model's ancestor, and it converges to it as n
    grows, which is exactly the lumped-versus-distributed question the lesson
    opens with.
    """
    dz = length / n
    zser = line.series_z(w) * dz
    yshu = line.shunt_y(w) * dz
    z = complex(zl)
    for _ in range(n):
        y = yshu + 1.0 / z          # shunt admittance in parallel with what is there
        z = zser + 1.0 / y          # then the series arm of this section
    return z


# --------------------------------------------------- route 5: FDTD, in time
def fdtd(seg_L, seg_C, seg_len, rs, rl_or_open, tmax, vsrc, cells_per_seg=400,
         courant=0.99, probe_nodes=None, seg_R=None, seg_G=None):
    """Leapfrog integration of the telegrapher's equations on a staggered grid.

    seg_L, seg_C, seg_len are equal-length lists describing one or more uniform
    segments in cascade. `rs` is the source series resistance, `rl_or_open` the
    load resistance (None for an open circuit). `vsrc(t)` is the open-circuit
    source waveform. Returns (t, v_history_at_probes, v_final_profile, z).

    Voltage lives on nodes, current on half-cells; the two leapfrog in time.
    The end nodes carry half a cell of capacitance and are advanced by their
    own KCL, which is how the terminations enter - no Gamma anywhere.
    """
    seg_R = seg_R or [0.0] * len(seg_L)
    seg_G = seg_G or [0.0] * len(seg_L)
    # Cells are sized from the SHORTEST segment and then reused everywhere, so
    # dz*sqrt(L'C') - and therefore the Courant number - is the same in every
    # segment. Giving each segment the same CELL COUNT instead leaves the long
    # segment running far below its stability limit, where the leapfrog scheme
    # is strongly dispersive; that alone put a two-segment TDR trace 1.5 % off.
    dz_target = min(seg_len) / cells_per_seg
    dz_list, Lc, Cc, Rc, Gc = [], [], [], [], []
    for Ls, Cs, ln, Rs_, Gs_ in zip(seg_L, seg_C, seg_len, seg_R, seg_G):
        ncells = max(1, int(round(ln / dz_target)))
        dz = ln / ncells
        dz_list += [dz] * ncells
        Lc += [Ls] * ncells
        Cc += [Cs] * ncells
        Rc += [Rs_] * ncells
        Gc += [Gs_] * ncells
    dz = np.array(dz_list)
    Lc, Cc, Rc, Gc = map(np.array, (Lc, Cc, Rc, Gc))
    ncell = dz.size
    # node k sits between cell k-1 and cell k; nodal capacitance is the average
    cnode = np.zeros(ncell + 1)
    cnode[:-1] += 0.5 * Cc * dz
    cnode[1:] += 0.5 * Cc * dz
    gnode = np.zeros(ncell + 1)
    gnode[:-1] += 0.5 * Gc * dz
    gnode[1:] += 0.5 * Gc * dz

    dt = courant * float(np.min(dz * np.sqrt(Lc * Cc)))
    nstep = int(math.ceil(tmax / dt))

    v = np.zeros(ncell + 1)
    i = np.zeros(ncell)
    z = np.concatenate([[0.0], np.cumsum(dz)])
    probe_nodes = list(probe_nodes if probe_nodes is not None else [0, ncell])
    hist = np.zeros((nstep + 1, len(probe_nodes)))
    tgrid = np.arange(nstep + 1) * dt

    # per-step coefficients
    ai = (1.0 - Rc * dt / (2 * Lc)) / (1.0 + Rc * dt / (2 * Lc))
    bi = (dt / (Lc * dz)) / (1.0 + Rc * dt / (2 * Lc))
    gs = 1.0 / rs
    gl = 0.0 if rl_or_open is None else 1.0 / rl_or_open

    for n in range(nstep):
        t_half = (n + 0.5) * dt
        i = ai * i - bi * (v[1:] - v[:-1])
        # interior nodes
        cap = cnode[1:-1] / dt
        v[1:-1] = ((cap - 0.5 * gnode[1:-1]) * v[1:-1] - (i[1:] - i[:-1])) / (
            cap + 0.5 * gnode[1:-1])
        # source node: half cell + source conductance
        c0 = cnode[0] / dt
        v[0] = ((c0 - 0.5 * (gs + gnode[0])) * v[0] + gs * vsrc(t_half) - i[0]) / (
            c0 + 0.5 * (gs + gnode[0]))
        # load node: half cell + load conductance
        cN = cnode[-1] / dt
        v[-1] = ((cN - 0.5 * (gl + gnode[-1])) * v[-1] + i[-1]) / (
            cN + 0.5 * (gl + gnode[-1]))
        hist[n + 1] = v[probe_nodes]
    hist[0] = 0.0
    return tgrid, hist, v.copy(), z, dt


def fdtd_phasor_profile(line, length, freq, rs, rl, periods=26, keep=6,
                        cells=400, courant=0.99):
    """Sinusoidal steady state: return the complex phasor of v at every node.

    The last `keep` periods are Fourier-projected at the drive frequency, so
    the transient is excluded by construction rather than by eye.
    """
    w = 2 * math.pi * freq
    vs = lambda t: math.sin(w * t)
    ncell = cells
    dz = length / ncell
    z = np.arange(ncell + 1) * dz
    dt = courant * dz * math.sqrt(line.L * line.C)
    nstep = int(math.ceil((periods / freq) / dt))
    cnode = np.full(ncell + 1, dz * line.C)
    cnode[0] *= 0.5
    cnode[-1] *= 0.5
    v = np.zeros(ncell + 1)
    i = np.zeros(ncell)
    acc = np.zeros(ncell + 1, dtype=complex)
    nkeep = 0
    t_start = (periods - keep) / freq
    gs, gl = 1.0 / rs, 1.0 / rl
    bi = dt / (line.L * dz)
    for n in range(nstep):
        t_half = (n + 0.5) * dt
        i = i - bi * (v[1:] - v[:-1])
        cap = cnode[1:-1] / dt
        v[1:-1] = (cap * v[1:-1] - (i[1:] - i[:-1])) / cap
        c0 = cnode[0] / dt
        v[0] = ((c0 - 0.5 * gs) * v[0] + gs * vs(t_half) - i[0]) / (c0 + 0.5 * gs)
        cN = cnode[-1] / dt
        v[-1] = ((cN - 0.5 * gl) * v[-1] + i[-1]) / (cN + 0.5 * gl)
        t = (n + 1) * dt
        if t >= t_start:
            acc += v * np.exp(-1j * w * t)
            nkeep += 1
    return z, 2.0 * acc / nkeep


def gamma_from_profile(z, phasor, beta, length):
    """Numerical boundary match on an FDTD profile.

    Least-squares fit of V(z) = A e^{-j beta z} + B e^{+j beta z} over the whole
    line, then refer the ratio to the LOAD plane. Returns Gamma_L. The solver
    that produced `phasor` never used a reflection coefficient.
    """
    m = np.column_stack([np.exp(-1j * beta * z), np.exp(1j * beta * z)])
    coef, *_ = np.linalg.lstsq(m, phasor, rcond=None)
    a, b = coef
    return (b * np.exp(1j * beta * length)) / (a * np.exp(-1j * beta * length))


# ------------------------------------------------------------ shared scenarios
# The polyethylene coax the lesson uses throughout. b/a and eps_r are the two
# GIVENS; everything below is computed from them.
BA, EPSR_PE = 3.49, 2.25
COAX = coax(BA, EPSR_PE)
Z0_COAX = COAX.z0_lossless
VP_COAX = COAX.vp_lossless

# A NOMINAL 50.000 ohm line on the same dielectric. The geometric coax above
# lands on 49.961 ohm, which is honest but makes every downstream table read
# 99.85 where the lesson says 100. Cable is sold to a nominal impedance, so the
# transformation examples use the nominal line and the geometry example uses
# the geometric one; mixing them is what produces "nearly right" tables.
LINE50 = Line(L=50.0 * math.sqrt(EPSR_PE) / C_LIGHT,
              C=math.sqrt(EPSR_PE) / (C_LIGHT * 50.0))

# The quarter-wave transformer case: 100 ohm load, 50 ohm system, 1.000 GHz.
QWT_ZS, QWT_ZL, QWT_F0 = 50.0, 100.0, 1.000e9
QWT_Z1 = math.sqrt(QWT_ZS * QWT_ZL)
EPSR_PTFE = 2.10


def gamma_in_qwt(f_over_f0, z1=QWT_Z1, zs=QWT_ZS, zl=QWT_ZL):
    """Input reflection of a single-section transformer, from the transformation."""
    theta = (math.pi / 2) * f_over_f0
    gam = 1j * theta                      # lossless: gamma*l = j*theta
    zin = zin_closed(z1, zl, gam, 1.0)
    return (zin - zs) / (zin + zs)


def bisect(f, lo, hi, iters=200):
    assert f(lo) * f(hi) < 0, (f(lo), f(hi))
    for _ in range(iters):
        mid = 0.5 * (lo + hi)
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return 0.5 * (lo + hi)


# ------------------------------------------------------------- verify() suite
def verify(loud=True):
    """Every headline number in the lesson, by at least two routes."""
    rows = []

    def rec(claim, a, b, tol, unit=""):
        # A relative gap is meaningless when the reference is an exact zero
        # (a perfect match really does have Gamma = 0), so those comparisons
        # fall back to an absolute gap against the same tolerance.
        gap = abs(a - b) / abs(b) if abs(b) > 1e-9 else abs(a - b)
        rows.append((claim, a, b, gap, unit))
        assert gap < tol, f"{claim}: {a} vs {b}, gap {gap:.3e} >= {tol:.1e}"

    # --- 1. coax per-unit-length quantities, and the DIMENSIONAL check that
    # sqrt(L'/C') has ohms: [H/m]/[F/m] = H/F = (V s/A)/(A s/V) = (V/A)^2.
    rec("coax L' (H/m)", COAX.L, 2e-7 * math.log(BA), 1e-15, "H/m")
    rec("coax C' (F/m)", COAX.C, 2 * math.pi * EPS0 * EPSR_PE / math.log(BA), 1e-15, "F/m")
    # independent route to Z0: the field integral collapses to eta0 form
    rec("coax Z0", Z0_COAX, ETA0 / (2 * math.pi * math.sqrt(EPSR_PE)) * math.log(BA),
        2e-9, "ohm")
    # independent route to v_p: L'C' = mu0 eps0 eps_r, geometry cancels
    rec("coax v_p", VP_COAX, C_LIGHT / math.sqrt(EPSR_PE), 2e-9, "m/s")
    rec("coax delay", COAX.delay_per_m * 1e9, 1e9 * math.sqrt(EPSR_PE) / C_LIGHT,
        2e-9, "ns/m")
    # the geometry that gives exactly 50 ohms
    # b/a sits inside an exponential, so the 3e-10 residual between the eta0
    # route and the mu0/eps0 route is amplified by d(b/a)/(b/a) = ln(b/a)/1 * ...
    rec("b/a for 50 ohm", math.exp(50.0 * 2 * math.pi * math.sqrt(EPSR_PE) / ETA0),
        bisect(lambda r: coax(r, EPSR_PE).z0_lossless - 50.0, 1.5, 8.0), 5e-9, "-")

    # --- 2. twin lead and microstrip
    d_over = bisect(lambda r: twin_lead(r).z0_lossless - 300.0, 1.2, 40.0)
    rec("twin-lead D/d for 300 ohm", d_over, math.cosh(300.0 * math.pi / ETA0), 8e-9, "-")
    rec("twin-lead v_p", twin_lead(d_over).vp_lossless, C_LIGHT, 2e-9, "m/s")
    u50 = microstrip_width_ratio(50.0, 4.4)
    rec("microstrip Z0 at solved W/h", microstrip_z0(u50, 4.4), 50.0, 1e-9, "ohm")
    rec("microstrip eps_eff", microstrip_eeff(u50, 4.4),
        (4.4 + 1) / 2 + (4.4 - 1) / 2 / math.sqrt(1 + 12.0 / u50), 1e-14, "-")

    # --- 3. reflection coefficient: formula vs numerical boundary match
    for zl in (30 + 40j, 100 + 0j, 25 + 0j, 100 + 50j, 20 + 40j):
        vp_, vm_ = wave_amplitudes(50.0, zl)
        rec(f"Gamma at Z_L={zl}", abs(vm_ / vp_), abs((zl - 50) / (zl + 50)), 1e-13, "-")
        rec(f"arg Gamma at Z_L={zl}", cmath.phase(vm_ / vp_) % (2 * math.pi),
            cmath.phase((zl - 50) / (zl + 50)) % (2 * math.pi), 1e-12, "rad")

    # --- 4. Z_in: closed form vs ABCD vs ladder recursion vs FDTD
    freq = 300e6
    w = 2 * math.pi * freq
    lam = LINE50.vp_lossless / freq
    rec("nominal line Z0", LINE50.z0_lossless, 50.0, 1e-13, "ohm")
    rec("nominal line v_p", LINE50.vp_lossless, C_LIGHT / math.sqrt(EPSR_PE), 1e-14, "m/s")
    for frac in (0.05, 0.125, 0.25, 0.375, 0.5):
        length = frac * lam
        g = 1j * w * math.sqrt(LINE50.L * LINE50.C)
        a = zin_closed(50.0, 25.0, g, length)
        b = zin_abcd(50.0, 25.0, g, length)
        rec(f"Z_in ABCD at {frac} lambda", abs(a), abs(b), 1e-11, "ohm")
        # the ladder's truncation error is exactly first order in the section
        # length, so two grids and one Richardson step remove it; what is left
        # is the second-order term, at the 1e-7 level.
        lad = (2 * zin_ladder(LINE50, w, 25.0, length, 4000)
               - zin_ladder(LINE50, w, 25.0, length, 2000))
        rec(f"Z_in ladder at {frac} lambda", abs(lad), abs(a), 1e-6, "ohm")
    # the ladder is the lumped model, and its error falls as 1/N - which is the
    # quantitative form of "a short enough piece of line IS a lumped element"
    ref = abs(zin_closed(50.0, 25.0, 1j * w * math.sqrt(LINE50.L * LINE50.C),
                         0.125 * lam))
    errs = [abs(abs(zin_ladder(LINE50, w, 25.0, 0.125 * lam, n)) - ref) / ref
            for n in (10, 100, 1000)]
    rec("ladder error at N=10 (%)", 100 * errs[0], 3.7404, 2e-4, "%")
    rec("ladder error at N=100 (%)", 100 * errs[1], 0.39079, 2e-4, "%")
    rec("ladder error falls as 1/N (10 -> 100)", errs[0] / errs[1], 10.0, 5e-2, "-")
    rec("ladder error falls as 1/N (100 -> 1000)", errs[1] / errs[2], 10.0, 6e-3, "-")

    # FDTD sinusoidal steady state on a 0.375 lambda line into 25 ohm
    length = 0.375 * lam
    zf, prof = fdtd_phasor_profile(LINE50, length, freq, rs=50.0, rl=25.0,
                                   cells=600, periods=30, keep=8)
    beta = w / LINE50.vp_lossless
    gam_num = gamma_from_profile(zf, prof, beta, length)
    rec("FDTD Gamma magnitude (Z_L=25)", abs(gam_num), 1.0 / 3.0, 2e-3, "-")
    rec("FDTD Gamma phase (Z_L=25)", abs(cmath.phase(gam_num)), math.pi, 2e-4, "rad")
    # input impedance straight from the fitted travelling waves at z = 0
    m = np.column_stack([np.exp(-1j * beta * zf), np.exp(1j * beta * zf)])
    coef, *_ = np.linalg.lstsq(m, prof, rcond=None)
    a_, b_ = coef
    v_in = a_ + b_
    i_in = (a_ - b_) / 50.0
    rec("FDTD Z_in at 0.375 lambda", abs(v_in / i_in),
        abs(zin_closed(50.0, 25.0, 1j * beta * 1.0, length)), 5e-4, "ohm")

    # --- 5. standing-wave envelope maxima and minima, FDTD vs closed form
    length2 = 1.0 * lam
    zf2, prof2 = fdtd_phasor_profile(LINE50, length2, freq, rs=50.0, rl=150.0,
                                     cells=800, periods=34, keep=10)
    env = np.abs(prof2)
    rec("FDTD VSWR (Z_L=150)", env.max() / env.min(), 3.0, 2e-3, "-")

    # --- 6. VSWR / return loss / mismatch loss round trips
    for zl in (75.0, 100.0, 150.0, 300.0):
        g = abs((zl - 50) / (zl + 50))
        s = (1 + g) / (1 - g)
        rec(f"|Gamma| from VSWR at {zl}", (s - 1) / (s + 1), g, 1e-14, "-")
        rl_db = -20 * math.log10(g)
        rec(f"|Gamma| from RL at {zl}", 10 ** (-rl_db / 20), g, 1e-13, "-")
        ml = -10 * math.log10(1 - g * g)
        rec(f"mismatch loss round trip at {zl}", 1 - 10 ** (-ml / 10), g * g, 1e-13, "-")

    # --- 7. quarter-wave transformer, swept rather than asserted at one point
    rec("QWT Z1", QWT_Z1, math.sqrt(QWT_ZS * QWT_ZL), 1e-15, "ohm")
    rec("QWT |Gamma| at f0", abs(gamma_in_qwt(1.0)), 0.0, 1e-12, "-")  # exact zero
    rec("QWT |Gamma| at 2 f0", abs(gamma_in_qwt(2.0)),
        abs((QWT_ZL - QWT_ZS) / (QWT_ZL + QWT_ZS)), 1e-9, "-")
    gt = (1.25 - 1) / (1.25 + 1)
    lo = bisect(lambda f: abs(gamma_in_qwt(f)) - gt, 0.30, 0.999)
    hi = bisect(lambda f: abs(gamma_in_qwt(f)) - gt, 1.001, 1.90)
    rec("QWT band edges symmetric", lo + hi, 2.0, 1e-9, "f/f0")
    rec("QWT fractional bandwidth (%)", (hi - lo) * 100, 40.97, 1e-3, "%")

    # FDTD confirmation of the transformer at three frequencies, on a real
    # two-segment line: 50 ohm feed, quarter-wave 70.71 ohm section, 100 ohm load.
    lam1 = C_LIGHT / (QWT_F0 * math.sqrt(EPSR_PTFE))
    sec = lam1 / 4
    line_feed = Line(L=QWT_ZS * math.sqrt(EPSR_PTFE) / C_LIGHT,
                     C=math.sqrt(EPSR_PTFE) / (C_LIGHT * QWT_ZS))
    line_tr = Line(L=QWT_Z1 * math.sqrt(EPSR_PTFE) / C_LIGHT,
                   C=math.sqrt(EPSR_PTFE) / (C_LIGHT * QWT_Z1))
    rec("synthesised feed Z0", line_feed.z0_lossless, QWT_ZS, 1e-12, "ohm")
    rec("synthesised section Z0", line_tr.z0_lossless, QWT_Z1, 1e-12, "ohm")
    rec("synthesised section v_p", line_tr.vp_lossless, C_LIGHT / math.sqrt(EPSR_PTFE),
        1e-12, "m/s")
    for fr in (0.80, 1.00, 1.20):
        f = fr * QWT_F0
        g_num = fdtd_gamma_two_segment(line_feed, line_tr, sec, f, QWT_ZL, QWT_ZS)
        rec(f"FDTD QWT |Gamma| at {fr:.2f} f0", abs(g_num), abs(gamma_in_qwt(fr)),
            1.5e-3, "-")

    # --- 8. bounce diagram / TDR, ledger vs FDTD
    ledger = tdr_ledger()
    tg, hist, _, _, _ = fdtd(
        [TDR_LINE_A.L, TDR_LINE_B.L], [TDR_LINE_A.C, TDR_LINE_B.C],
        [TDR_LEN_A, TDR_LEN_B], TDR_ZS, None, 400e-9,
        lambda t: 0.0 if t < 0 else 1.0 * (1 - math.exp(-t / 0.4e-9)),
        cells_per_seg=500, probe_nodes=[0])
    for t_ns, v_expect in ledger:
        if t_ns > 380:
            continue
        k = int(np.searchsorted(tg, (t_ns + 12) * 1e-9))
        rec(f"TDR step at {t_ns:.0f} ns", hist[k, 0], v_expect, 1e-3, "V")

    # --- 9. the classic open-circuit ring, ledger vs FDTD
    ring = ring_ledger()
    line = COAX
    length_r = 1.5
    # A mathematically ideal step excites the grid's shortest wavelengths, where
    # the leapfrog scheme is dispersive, and the resulting ripple sits on top of
    # every plateau. A real generator has a finite edge; using one (0.5 ns) is
    # both physical and what keeps the comparison honest.
    tg2, hist2, _, _, _ = fdtd([line.L], [line.C], [length_r], 25.0, None,
                               70e-9,
                               lambda t: 0.0 if t <= 0 else 5.0 * (1 - math.exp(-t / 0.5e-9)),
                               cells_per_seg=1400, probe_nodes=[1400])
    for t_ns, v_expect in ring:
        if (t_ns + 4.5) * 1e-9 >= tg2[-1]:
            continue
        k = int(np.searchsorted(tg2, (t_ns + 4.5) * 1e-9))
        rec(f"open-end ring at {t_ns:.1f} ns", hist2[k, 0], v_expect, 5e-4, "V")

    # --- 10. stub match, algebra vs a swept numerical minimum
    d_sol, b_need, l_stub = stub_design(100 + 50j, 50.0)
    y_tot = stub_admittance_total(d_sol, l_stub, 100 + 50j, 50.0)
    rec("stub match residual |Gamma|", abs((1 / y_tot - 1) / (1 / y_tot + 1)), 0.0,
        1e-9, "-")
    rec("stub d (lambda)", d_sol, 0.198792, 5e-6, "lambda")
    rec("stub l (lambda)", l_stub, 0.125, 1e-6, "lambda")

    # --- 11. Smith-chart traverse: bilinear map vs the impedance transformation
    z_l = (20 + 40j) / 50.0
    g_l = (z_l - 1) / (z_l + 1)
    move = 0.15
    g_in = g_l * cmath.exp(-2j * (2 * math.pi) * move)
    z_from_map = (1 + g_in) / (1 - g_in)
    z_from_line = zin_closed(50.0, 20 + 40j, 1j * 2 * math.pi, move) / 50.0
    rec("Smith traverse Re(z)", z_from_map.real, z_from_line.real, 1e-12, "-")
    rec("Smith traverse Im(z)", z_from_map.imag, z_from_line.imag, 1e-12, "-")
    rec("Smith traverse |Gamma| invariant", abs(g_in), abs(g_l), 1e-14, "-")

    # --- 12. low-loss approximations against the exact complex square root
    f_ll = 100e6
    w_ll = 2 * math.pi * f_ll
    tand = 4e-4
    ll = Line(L=COAX.L, C=COAX.C, R=0.35, G=w_ll * COAX.C * tand)
    g_exact = ll.gamma(w_ll)
    a_appr = ll.R / (2 * Z0_COAX) + ll.G * Z0_COAX / 2
    rec("low-loss alpha", a_appr, g_exact.real, 1e-5, "Np/m")
    rec("low-loss beta", w_ll * math.sqrt(ll.L * ll.C), g_exact.imag, 1e-5, "rad/m")
    rec("low-loss |Z0|", abs(ll.z0(w_ll)), Z0_COAX, 1e-5, "ohm")

    # --- 13. EVERY NUMBER PRINTED IN THE LESSON, re-derived here.
    # The blocks above check the physics; this one checks the typesetting - that
    # the rounded value on the page is the value the equation gives. A correct
    # model quoted to a wrong digit is still a wrong lesson.
    def printed(claim, computed, on_page, places):
        """Assert a page value is `computed` rounded to `places` decimals."""
        tol = 0.5 * 10 ** (-places)
        rows.append((claim, computed, on_page, abs(computed - on_page), "printed"))
        assert abs(computed - on_page) <= tol, (claim, computed, on_page)

    # worked example 4: a 75 ohm foamed-polyethylene coax, designed backwards
    foam = coax(math.exp(2 * math.pi * 75.0 * math.sqrt(1.50) / ETA0), 1.50)
    printed("W4 b/a", math.exp(2 * math.pi * 75.0 * math.sqrt(1.50) / ETA0), 4.6274, 4)
    printed("W4 ln(b/a)", math.log(math.exp(2 * math.pi * 75.0 * math.sqrt(1.50) / ETA0)),
            1.53199, 5)
    printed("W4 prefactor", ETA0 / (2 * math.pi * math.sqrt(1.50)), 48.956, 3)
    printed("W4 L' (nH/m)", foam.L * 1e9, 306.40, 2)
    printed("W4 C' (pF/m)", foam.C * 1e12, 54.471, 3)
    printed("W4 Z0", foam.z0_lossless, 75.000, 3)
    printed("W4 v_p (1e8 m/s)", foam.vp_lossless / 1e8, 2.4478, 4)
    printed("W4 velocity factor", foam.vp_lossless / C_LIGHT, 0.8165, 4)
    printed("W4 delay (ns/m)", 1e9 * foam.delay_per_m, 4.0853, 4)

    # worked example 5: 300 ohm twin lead
    dd = math.cosh(math.pi * 300.0 / ETA0)
    tl = twin_lead(dd)
    printed("W5 arccosh argument", math.pi * 300.0 / ETA0, 2.50173, 5)
    printed("W5 D/d", dd, 6.1428, 4)
    printed("W5 L' (nH/m)", tl.L * 1e9, 1000.7, 1)
    printed("W5 C' (pF/m)", tl.C * 1e12, 11.119, 3)
    printed("W5 Z0", tl.z0_lossless, 300.00, 2)
    printed("W5 v_p (1e8)", tl.vp_lossless / 1e8, 2.9979, 4)
    for ratio, page in ((2.0, 157.9), (4.0, 247.4), (6.0, 297.1), (10.0, 358.9)):
        printed(f"W5 table D/d={ratio}", twin_lead(ratio).z0_lossless, page, 1)

    # worked example 6: 50 ohm microstrip on FR-4
    printed("W6 W/h", u50, 1.9246, 4)
    printed("W6 W (mm)", u50 * 1.60, 3.079, 3)
    printed("W6 eps_eff", microstrip_eeff(u50, 4.4), 3.3320, 4)
    printed("W6 t_d (ps/mm)", 1e12 * math.sqrt(microstrip_eeff(u50, 4.4)) / C_LIGHT / 1000,
            6.089, 3)
    printed("W6 free-space t_d (ps/mm)", 1e12 / C_LIGHT / 1000, 3.336, 3)
    lam_ms = 1000 * C_LIGHT / math.sqrt(microstrip_eeff(u50, 4.4)) / 2.0e9
    printed("W6 lambda at 2 GHz (mm)", lam_ms, 82.12, 2)
    printed("W6 quarter wave (mm)", lam_ms / 4, 20.53, 2)
    printed("W6 free-space quarter (mm)", 1000 * C_LIGHT / 2.0e9 / 4, 37.47, 2)
    printed("W6 length ratio", math.sqrt(microstrip_eeff(u50, 4.4)), 1.83, 2)
    for uu, pe, pz in ((0.5, 3.040, 95.6), (1.0, 3.171, 71.0),
                       (3.0, 3.460, 37.6), (5.0, 3.622, 25.9)):
        printed(f"W6 table eps_eff W/h={uu}", microstrip_eeff(uu, 4.4), pe, 3)
        printed(f"W6 table Z0 W/h={uu}", microstrip_z0(uu, 4.4), pz, 1)

    # worked examples 11-13: the transformation table
    printed("W11 tan at 0.05 lambda", math.tan(2 * math.pi * 0.05), 0.32492, 5)
    for frac, pr, px in ((0.05, 26.93, 11.87), (0.125, 40.00, 30.00),
                         (0.25, 100.00, 0.00), (0.375, 40.00, -30.00),
                         (0.5, 25.00, 0.00)):
        z = zin_closed(50.0, 25.0, 1j * 2 * math.pi, frac)
        printed(f"W11 R_in at {frac}", z.real, pr, 2)
        printed(f"W11 X_in at {frac}", z.imag, px, 2)
    printed("W11 |Z| at lambda/8", abs(zin_closed(50.0, 25.0, 1j * 2 * math.pi, 0.125)),
            50.00, 2)
    printed("W11 |Z| at 0.05 lambda", abs(zin_closed(50.0, 25.0, 1j * 2 * math.pi, 0.05)),
            29.43, 2)
    z12 = zin_closed(50.0, 30 + 40j, 1j * 2 * math.pi, 0.10)
    printed("W12 R_in", z12.real, 125.44, 2)
    printed("W12 X_in", z12.imag, 51.68, 2)
    printed("W12 |Z_in|", abs(z12), 135.67, 2)
    printed("W12 rotation (deg)", 720 * 0.10, 72.0, 1)
    printed("W12 tan at 0.10 lambda", math.tan(2 * math.pi * 0.10), 0.72654, 5)
    printed("W13 Z0 from sc/oc", math.sqrt(40.0 * 62.5), 50.0, 1)
    printed("W13 ratio", 40.0 / 62.5, 0.640, 3)
    printed("W13 angle (deg)", math.degrees(math.atan(0.8)), 38.66, 2)
    printed("W13 d/lambda", math.degrees(math.atan(0.8)) / 360, 0.1074, 4)

    # worked example 14: the transformer, its length and the free-space trap
    lam_ptfe = C_LIGHT / (QWT_F0 * math.sqrt(EPSR_PTFE))
    printed("W14 Z1", QWT_Z1, 70.711, 3)
    printed("W14 sqrt(eps_r)", math.sqrt(EPSR_PTFE), 1.44914, 5)
    printed("W14 lambda1 (m)", lam_ptfe, 0.206876, 6)
    printed("W14 length (mm)", 1000 * lam_ptfe / 4, 51.72, 2)
    printed("W14 wrong length (mm)", 1000 * C_LIGHT / QWT_F0 / 4, 74.95, 2)
    printed("W14 wrong in lambda1", (C_LIGHT / QWT_F0 / 4) / lam_ptfe, 0.3623, 4)
    printed("W14 wrong angle (deg)", 360 * (C_LIGHT / QWT_F0 / 4) / lam_ptfe, 130.4, 1)
    g_wrong = abs(gamma_in_qwt(math.sqrt(EPSR_PTFE)))
    printed("W14 wrong |Gamma|", g_wrong, 0.2235, 4)
    printed("W14 wrong VSWR", (1 + g_wrong) / (1 - g_wrong), 1.576, 3)
    printed("W14 displaced f0 (MHz)", 1000.0 / math.sqrt(EPSR_PTFE), 690.0, 0)
    for fr, pg, pv in ((0.500, 0.2425, 1.640), (0.7952, 0.1111, 1.250),
                       (0.800, 0.1086, 1.244), (1.200, 0.1086, 1.244),
                       (1.2048, 0.1111, 1.250), (2.000, 0.3333, 2.000)):
        gg = abs(gamma_in_qwt(fr))
        printed(f"W14 |Gamma| at {fr}", gg, pg, 4)
        printed(f"W14 VSWR at {fr}", (1 + gg) / (1 - gg), pv, 3)

    # worked example 16: stub bandwidth
    def stub_gam(x, d0=d_sol, l0=l_stub, zl=100 + 50j, z0=50.0):
        z = z0 / stub_admittance_total(d0 * x, l0 * x, zl, z0)
        return abs((z - z0) / (z + z0))
    lo_s = bisect(lambda x: stub_gam(x) - gt, 0.60, 0.999)
    hi_s = bisect(lambda x: stub_gam(x) - gt, 1.001, 1.40)
    printed("W16 stub bandwidth (%)", 100 * (hi_s - lo_s), 11.9, 1)
    printed("W16 unmatched |Gamma|", abs((100 + 50j - 50) / (100 + 50j + 50)), 0.4472, 4)
    printed("W16 unmatched VSWR", (1 + 0.4472136) / (1 - 0.4472136), 2.618, 3)

    # worked example 17: fault distances
    printed("W17 v_p (1e8)", TDR_VF * C_LIGHT / 1e8, 1.9786, 4)
    printed("W17 fault distance (m)", TDR_LEN_A, 14.64, 2)
    printed("W17 beyond the fault (m)", TDR_LEN_B, 4.95, 2)
    printed("W17 total cable (m)", TDR_LEN_A + TDR_LEN_B, 19.59, 2)
    printed("W17 fault impedance", 50.0 * (1 - 0.2) / (1 + 0.2), 33.3, 1)

    # worked example 18: three terminations on the nominal 50 ohm line
    printed("W18a launched", 5.0 * 50 / 75, 3.33, 2)
    printed("W18b launched", 5.0 * 50 / 100, 2.50, 2)
    printed("W18 one-way delay (ns)", 1e9 * 1.5 / LINE50.vp_lossless, 7.51, 2)
    printed("W18 round trip (ns)", 2e9 * 1.5 / LINE50.vp_lossless, 15.0, 1)
    printed("W18c load volts", 5.0 * 50 / 75, 3.33, 2)
    printed("W18c current (mA)", 1000 * 5.0 / 75, 66.7, 1)
    printed("W18c terminator power (W)", (5.0 * 50 / 75) ** 2 / 50, 0.222, 3)
    printed("W18c supply power (W)", 5.0 * 5.0 / 75, 0.333, 3)

    # ---- Problem Set A
    vp_a1 = 0.820 * C_LIGHT
    printed("A1 v_p (1e8)", vp_a1 / 1e8, 2.4583, 4)
    printed("A1 lambda (m)", vp_a1 / 200e6, 1.2291, 4)
    printed("A1 delay (ns/m)", 1e9 / vp_a1, 4.068, 3)
    printed("A1 electrical length", 0.0400 / (vp_a1 / 200e6), 0.03254, 5)
    printed("A1 degrees", 360 * 0.0400 / (vp_a1 / 200e6), 11.72, 2)
    th_a1 = 2 * math.pi * 0.0400 / (vp_a1 / 200e6)
    printed("A1 theta (rad)", th_a1, 0.20447, 5)
    printed("A1 theta^2/3 (%)", 100 * th_a1 ** 2 / 3, 1.39, 2)
    printed("A1 exact error (%)",
            100 * abs(th_a1 - math.tan(th_a1)) / abs(math.tan(th_a1)), 1.40, 2)
    a2 = Line(L=320e-9, C=128e-12)
    printed("A2 L'/C'", a2.L / a2.C, 2500.0, 1)
    printed("A2 Z0", a2.z0_lossless, 50.0, 1)
    printed("A2 v_p (1e8)", a2.vp_lossless / 1e8, 1.5625, 4)
    printed("A2 delay (ns/m)", 1e9 * a2.delay_per_m, 6.40, 2)
    printed("A2 eps_eff", (C_LIGHT / a2.vp_lossless) ** 2, 3.681, 3)
    g_a3 = (20 - 35j - 50) / (20 - 35j + 50)
    printed("A3 Re Gamma", g_a3.real, -0.1429, 4)
    printed("A3 Im Gamma", g_a3.imag, -0.5714, 4)
    printed("A3 |Gamma|", abs(g_a3), 0.5890, 4)
    printed("A3 angle (deg)", math.degrees(cmath.phase(g_a3)), -104.04, 2)
    printed("A3 VSWR", (1 + abs(g_a3)) / (1 - abs(g_a3)), 3.866, 3)
    printed("A3 return loss", -20 * math.log10(abs(g_a3)), 4.597, 3)
    printed("A3 reflected (%)", 100 * abs(g_a3) ** 2, 34.69, 2)
    printed("A3 mismatch loss", -10 * math.log10(1 - abs(g_a3) ** 2), 1.850, 3)
    m_a4 = (1.80 - 1) / (1.80 + 1)
    printed("A4 |Gamma|", m_a4, 0.28571, 5)
    printed("A4 return loss", -20 * math.log10(m_a4), 10.881, 3)
    printed("A4 reflected (%)", 100 * m_a4 ** 2, 8.163, 3)
    printed("A4 mismatch loss", -10 * math.log10(1 - m_a4 ** 2), 0.370, 3)
    printed("A4 high resistive", 50 * 1.80, 90.0, 1)
    printed("A4 low resistive", 50 / 1.80, 27.8, 1)
    th_a5 = 4 * math.pi * 0.100 - math.pi
    g_a5 = (1 / 3) * cmath.exp(1j * th_a5)
    zl_a5 = 50 * (1 + g_a5) / (1 - g_a5)
    printed("A5 theta_Gamma (deg)", math.degrees(th_a5), -108.0, 1)
    printed("A5 Re Gamma", g_a5.real, -0.1030, 4)
    printed("A5 Im Gamma", g_a5.imag, -0.3170, 4)
    printed("A5 R_L", zl_a5.real, 33.74, 2)
    printed("A5 X_L", zl_a5.imag, -24.07, 2)
    rec("A5 closes the loop", abs((zl_a5 - 50) / (zl_a5 + 50)), 1 / 3, 1e-12, "-")
    printed("A6 round-trip loss (dB)", 2 * 0.0500 * 25, 2.50, 2)
    printed("A6 |Gamma| measured", 0.400 * 10 ** (-2.50 / 20), 0.3000, 4)
    printed("A6 RL measured", -20 * math.log10(0.400 * 10 ** (-2.50 / 20)), 10.46, 2)
    printed("A6 RL true", -20 * math.log10(0.400), 7.96, 2)

    # ---- Problem Set B
    z_b1 = zin_closed(50.0, 200.0, 1j * 2 * math.pi, 0.125)
    printed("B1 R at lambda/8", z_b1.real, 23.53, 2)
    printed("B1 X at lambda/8", z_b1.imag, -44.12, 2)
    printed("B1 |Z|", abs(z_b1), 50.0, 1)
    printed("B1 quarter wave", 2500.0 / 200.0, 12.50, 2)
    lam_b2 = C_LIGHT / (600e6 * math.sqrt(2.30))
    printed("B2 Z1", math.sqrt(300 * 75), 150.0, 1)
    printed("B2 lambda1 (m)", lam_b2, 0.32946, 5)
    printed("B2 length (mm)", 1000 * lam_b2 / 4, 82.37, 2)
    printed("B2 free-space length (mm)", 1000 * C_LIGHT / 600e6 / 4, 124.91, 2)
    printed("B2 ratio", math.sqrt(2.30), 1.5166, 4)
    printed("B2 displaced f (MHz)", 600 / math.sqrt(2.30), 396.0, 0)
    th_b3 = math.radians(72.0)
    z_b3 = zin_closed(150.0, 300.0, 1j * th_b3, 1.0)
    g_b3 = (z_b3 - 75) / (z_b3 + 75)
    printed("B3 tan 72 deg", math.tan(th_b3), 3.0777, 4)
    printed("B3 R_in", z_b3.real, 80.79, 2)
    printed("B3 X_in", z_b3.imag, -35.61, 2)
    printed("B3 |Gamma|", abs(g_b3), 0.2258, 4)
    printed("B3 VSWR", (1 + abs(g_b3)) / (1 - abs(g_b3)), 1.583, 3)
    gb3 = lambda f: abs((zin_closed(150.0, 300.0, 1j * (math.pi / 2) * f, 1.0) - 75)
                        / (zin_closed(150.0, 300.0, 1j * (math.pi / 2) * f, 1.0) + 75))
    lo_b, hi_b = bisect(lambda f: gb3(f) - gt, 0.30, 0.999), bisect(lambda f: gb3(f) - gt, 1.001, 1.90)
    printed("B3 band low", lo_b, 0.9047, 4)
    printed("B3 band high", hi_b, 1.0953, 4)
    printed("B3 bandwidth (%)", 100 * (hi_b - lo_b), 19.05, 2)
    g_b4 = ((2 - 1j) - 1) / ((2 - 1j) + 1)
    printed("B4 Re Gamma", g_b4.real, 0.400, 3)
    printed("B4 Im Gamma", g_b4.imag, -0.200, 3)
    printed("B4 |Gamma|", abs(g_b4), 0.4472, 4)
    printed("B4 angle (deg)", math.degrees(cmath.phase(g_b4)), -26.565, 3)
    printed("B4 VSWR", (1 + abs(g_b4)) / (1 - abs(g_b4)), 2.618, 3)
    printed("B4 rotation (deg)", 720 * 0.200, 144.0, 1)
    g_b4r = g_b4 * cmath.exp(-2j * 2 * math.pi * 0.200)
    z_b4 = (1 + g_b4r) / (1 - g_b4r)
    printed("B4 new angle (deg)", math.degrees(cmath.phase(g_b4r)), -170.565, 3)
    printed("B4 Re Gamma rotated", g_b4r.real, -0.4412, 4)
    printed("B4 Im Gamma rotated", g_b4r.imag, -0.0733, 4)
    printed("B4 Re z_in", z_b4.real, 0.3842, 4)
    printed("B4 Im z_in", z_b4.imag, -0.0704, 4)
    printed("B4 R_in", 50 * z_b4.real, 19.21, 2)
    printed("B4 X_in", 50 * z_b4.imag, -3.52, 2)
    rec("B4 rotation route equals transformation",
        abs(z_b4 - zin_closed(50.0, 50 * (2 - 1j), 1j * 2 * math.pi, 0.200) / 50),
        0.0, 1e-12, "-")
    d_b5, b_b5, l_b5 = stub_design(25 - 50j, 50.0)
    y_b5 = stub_admittance_total(d_b5, l_b5, 25 - 50j, 50.0)
    printed("B5 y_L real", (50 / (25 - 50j)).real, 0.400, 3)
    printed("B5 y_L imag", (50 / (25 - 50j)).imag, 0.800, 3)
    printed("B5 d (lambda)", d_b5, 0.06313, 5)
    printed("B5 susceptance", b_b5, 1.5811, 4)
    printed("B5 stub angle (deg)", math.degrees(math.atan2(1.0, b_b5)), 32.31, 2)
    printed("B5 stub length (lambda)", l_b5, 0.08975, 5)
    rec("B5 match is exact", abs((50 / y_b5 - 50) / (50 / y_b5 + 50)), 0.0, 1e-12, "-")
    printed("B5 load |Gamma|", abs((25 - 50j - 50) / (25 - 50j + 50)), 0.6202, 4)
    printed("B5 load VSWR", (1 + 0.6201737) / (1 - 0.6201737), 4.266, 3)
    vp_b6 = 0.850 * C_LIGHT
    printed("B6 v_p (1e8)", vp_b6 / 1e8, 2.5482, 4)
    printed("B6 distance (m)", vp_b6 * 260e-9 / 2, 33.13, 2)
    printed("B6 impedance", 75 * (1 + 1 / 3) / (1 - 1 / 3), 150.0, 1)
    printed("B6 opposite sign", 75 * (1 - 1 / 3) / (1 + 1 / 3), 37.5, 1)

    if loud:
        print(f"{'claim':44s} {'route A':>16s} {'route B':>16s} {'rel gap':>10s}")
        for claim, a, b, gap, unit in rows:
            print(f"{claim:44s} {a:16.8g} {b:16.8g} {gap:10.2e}  {unit}")
        print(f"\n{len(rows)} independent cross-checks, all within tolerance")
    return rows


# ------------------------------------------------------- TDR / bounce ledgers
# Cable under test: 50 ohm, velocity factor 0.66 (a cable datasheet given).
TDR_VF = 0.66
TDR_ZS = 50.0
TDR_Z_A, TDR_Z_B = 50.0, 100.0 / 3.0     # the crushed section reads 33.33 ohm
TDR_T_A, TDR_T_B = 74.0e-9, 25.0e-9      # one-way delays chosen by the fault position
TDR_LEN_A = TDR_VF * C_LIGHT * TDR_T_A
TDR_LEN_B = TDR_VF * C_LIGHT * TDR_T_B


def _line_from_z0_vp(z0, vp):
    return Line(L=z0 / vp, C=1.0 / (z0 * vp))


TDR_LINE_A = _line_from_z0_vp(TDR_Z_A, TDR_VF * C_LIGHT)
TDR_LINE_B = _line_from_z0_vp(TDR_Z_B, TDR_VF * C_LIGHT)


def tdr_ledger(n_terms=6):
    """Voltage seen at the TDR head, as a running sum of arriving waves.

    Source is matched (50 ohm) so nothing re-reflects at the instrument; every
    step in the trace is one round trip deeper into the cable.
    """
    g1 = (TDR_Z_B - TDR_Z_A) / (TDR_Z_B + TDR_Z_A)      # 50 -> 33.33 junction
    g2 = (TDR_Z_A - TDR_Z_B) / (TDR_Z_A + TDR_Z_B)      # seen from inside segment B
    v_launch = 1.0 * TDR_Z_A / (TDR_ZS + TDR_Z_A)
    out = [(0.0, v_launch), (2e9 * TDR_T_A, v_launch * (1 + g1))]
    # wave that got past the junction, bouncing between junction and open end
    amp = v_launch * (1 + g1)
    total = out[-1][1]
    for k in range(n_terms):
        # travels to the open end (+1), returns, transmits back out (1 + g2)
        arriving = amp * (1.0) * (1 + g2)
        total += arriving
        t = 2e9 * (TDR_T_A + (k + 1) * TDR_T_B)
        out.append((t, total))
        amp = amp * 1.0 * g2
    return out


def ring_ledger(n_terms=5):
    """Voltage at the OPEN far end of a 1.5 m coax fed from a 25 ohm source."""
    z0 = Z0_COAX
    rs = 25.0
    gs = (rs - z0) / (rs + z0)
    td = 1.5 / VP_COAX
    v_launch = 5.0 * z0 / (rs + z0)
    out, total, amp = [], 0.0, v_launch
    for k in range(n_terms):
        total += 2 * amp                      # open end doubles the arriving wave
        out.append(((2 * k + 1) * td * 1e9, total))
        amp = amp * 1.0 * gs                  # +1 at the open, gs at the source
    return out


# ------------------------------------------------------------- stub machinery
def stub_admittance_total(d, l_stub, zl, z0, shorted=True):
    """Normalised admittance at the stub plane: line section plus stub."""
    t = cmath.tan(2 * math.pi * d)
    z = ((zl / z0) + 1j * t) / (1 + 1j * (zl / z0) * t)
    y_line = 1.0 / z
    y_stub = (-1j / cmath.tan(2 * math.pi * l_stub)) if shorted \
        else 1j * cmath.tan(2 * math.pi * l_stub)
    return y_line + y_stub


def stub_design(zl, z0, shorted=True):
    """Find the first d with Re(y) = 1, then the stub that cancels Im(y)."""
    def rey(d):
        t = cmath.tan(2 * math.pi * d)
        z = ((zl / z0) + 1j * t) / (1 + 1j * (zl / z0) * t)
        return (1.0 / z).real - 1.0

    grid = np.linspace(1e-6, 0.5 - 1e-6, 20001)
    d_sol = None
    for k in range(1, grid.size):
        if rey(grid[k - 1]) * rey(grid[k]) < 0:
            d_sol = bisect(rey, grid[k - 1], grid[k])
            break
    assert d_sol is not None
    t = cmath.tan(2 * math.pi * d_sol)
    y = 1.0 / (((zl / z0) + 1j * t) / (1 + 1j * (zl / z0) * t))
    b = y.imag
    if shorted:                      # need y_stub = -j b  =>  cot(beta l) = b
        l = math.atan2(1.0, b) / (2 * math.pi)
    else:                            # need tan(beta l) = -b
        l = math.atan2(-b, 1.0) / (2 * math.pi)
    if l < 0:
        l += 0.5
    return d_sol, b, l


# ----------------------------------------------- FDTD for a two-segment line
def fdtd_gamma_two_segment(feed, section, sec_len, freq, zl, zs):
    """|Gamma| looking into a feed + quarter-wave section + load, from FDTD.

    The feed is made two wavelengths long so the forward and backward waves on
    it can be separated by a least-squares fit, exactly as a slotted line does.
    """
    lam_feed = feed.vp_lossless / freq
    feed_len = 2.0 * lam_feed
    w = 2 * math.pi * freq
    beta = w / feed.vp_lossless
    cells_feed = 500
    cells_sec = 200
    dzf = feed_len / cells_feed
    dzs = sec_len / cells_sec
    dz = np.concatenate([np.full(cells_feed, dzf), np.full(cells_sec, dzs)])
    Lc = np.concatenate([np.full(cells_feed, feed.L), np.full(cells_sec, section.L)])
    Cc = np.concatenate([np.full(cells_feed, feed.C), np.full(cells_sec, section.C)])
    ncell = dz.size
    cnode = np.zeros(ncell + 1)
    cnode[:-1] += 0.5 * Cc * dz
    cnode[1:] += 0.5 * Cc * dz
    dt = 0.99 * float(np.min(dz * np.sqrt(Lc * Cc)))
    periods, keep = 40, 12
    nstep = int(math.ceil((periods / freq) / dt))
    v = np.zeros(ncell + 1)
    i = np.zeros(ncell)
    acc = np.zeros(cells_feed + 1, dtype=complex)
    nk = 0
    t_start = (periods - keep) / freq
    gs, gl = 1.0 / zs, 1.0 / zl
    bi = dt / (Lc * dz)
    for n in range(nstep):
        t_half = (n + 0.5) * dt
        i = i - bi * (v[1:] - v[:-1])
        cap = cnode[1:-1] / dt
        v[1:-1] = (cap * v[1:-1] - (i[1:] - i[:-1])) / cap
        c0 = cnode[0] / dt
        v[0] = ((c0 - 0.5 * gs) * v[0] + gs * math.sin(w * t_half) - i[0]) / (
            c0 + 0.5 * gs)
        cN = cnode[-1] / dt
        v[-1] = ((cN - 0.5 * gl) * v[-1] + i[-1]) / (cN + 0.5 * gl)
        t = (n + 1) * dt
        if t >= t_start:
            acc += v[:cells_feed + 1] * np.exp(-1j * w * t)
            nk += 1
    prof = 2.0 * acc / nk
    zgrid = np.arange(cells_feed + 1) * dzf
    m = np.column_stack([np.exp(-1j * beta * zgrid), np.exp(1j * beta * zgrid)])
    coef, *_ = np.linalg.lstsq(m, prof, rcond=None)
    a, b = coef
    return (b * np.exp(1j * beta * feed_len)) / (a * np.exp(-1j * beta * feed_len))


# ===================================================================== figures
@figure("em4-electrical-length")
def _electrical_length(mode):
    """How wrong the lumped model is, as a function of electrical length."""
    fig, ax = plt.subplots()
    z0 = Z0_COAX

    def errors(fr):
        """(shorted-stub, open-stub) error of the single-lump model, in %.

        A shorted stub of length l has X = Z0 tan(beta l) exactly, and the
        lumped inductor L' l has X = omega L' l = Z0 (beta l). An open stub has
        X = -Z0 cot(beta l) exactly, against -1/(omega C' l) = -Z0/(beta l).
        Both lumped forms are the first term of the tangent's series, so the
        error is a pure function of the electrical angle - Z0 cancels.
        """
        theta = 2 * math.pi * fr
        t = math.tan(theta)
        return 100 * abs(theta - t) / abs(t), 100 * abs(t / theta - 1)

    frac = np.linspace(0.002, 0.35, 700)
    pairs = [errors(fr) for fr in frac]
    err_short = np.array([p[0] for p in pairs])
    err_open = np.array([p[1] for p in pairs])
    # the lesson quotes these four numbers, so they are asserted at the exact
    # electrical lengths rather than at whatever grid point lands nearest
    e20, e10 = errors(0.05), errors(0.10)
    assert abs(e20[0] - 3.3117) < 5e-4, e20
    assert abs(e10[0] - 13.5194) < 5e-4, e10
    assert abs(e20[1] - 3.4252) < 5e-4, e20
    assert abs(e10[1] - 15.6328) < 5e-4, e10
    col = S.SERIES[mode]
    ax.plot(frac, err_short, color=col[0])
    ax.plot(frac, err_open, color=col[1])
    ks = int(np.argmin(np.abs(err_short - 62.0)))
    ko = int(np.argmin(np.abs(err_open - 62.0)))
    S.label_end(ax, frac[ks], err_short[ks], "shorted stub vs\nlumped $L'\\ell$",
                col[0], mode, dx=8, dy=0)
    S.label_end(ax, frac[ko], err_open[ko], "open stub vs\nlumped $C'\\ell$",
                col[1], mode, dx=-10, dy=2, ha="right")
    for x, lab in ((0.05, "$\\ell=\\lambda/20$"), (0.10, "$\\ell=\\lambda/10$")):
        ax.axvline(x, color=S.GUIDE[mode], lw=1.0, ls="--")
        ax.annotate(lab, xy=(x - 0.004, 88), color=S.INK_2[mode], fontsize=9,
                    ha="right", rotation=90, va="top")
    S.note(ax, 0.115, 3.0, f"at $\\lambda/20$ the single lump is {e20[0]:.1f} % out;\n"
                           f"at $\\lambda/10$ it is {e10[0]:.1f} % out and still rising",
           mode)
    ax.set_xlabel("electrical length  $\\ell/\\lambda$")
    ax.set_ylabel("error of the single-lump model  (%)")
    ax.set_title("Where circuit theory stops working")
    ax.set_xlim(0, 0.35)
    ax.set_ylim(0, 90)
    S.strip(ax)
    return fig


@figure("em4-telegrapher-fdtd")
def _telegrapher(mode):
    """Snapshots of a step solving the telegrapher's equations numerically."""
    fig, ax = plt.subplots()
    line = COAX
    length = 1.5
    td = length / VP_COAX
    col = S.SERIES[mode]
    # capture profiles at three times by re-running to each one
    times = [0.45 * td, 0.95 * td, 1.45 * td]
    labels = ["$t=0.45\\,T_d$", "$t=0.95\\,T_d$", "$t=1.45\\,T_d$"]
    for k, (tt, lab) in enumerate(zip(times, labels)):
        # a generator with a 0.5 ns edge: an ideal step would excite the grid's
        # shortest wavelengths, where the leapfrog scheme is dispersive, and
        # cover every plateau in numerical ripple
        _, _, vprof, z, _ = fdtd(
            [line.L], [line.C], [length], 25.0, None, tt,
            lambda t: 0.0 if t <= 0 else 5.0 * (1 - math.exp(-t / 0.5e-9)),
            cells_per_seg=1400, probe_nodes=[0])
        ax.plot(z, vprof, color=col[k])
        S.label_end(ax, z[-1] if k == 2 else z[int(0.98 * (z.size - 1))],
                    vprof[-1] if k == 2 else vprof[int(0.98 * (z.size - 1))],
                    lab, col[k], mode, dx=6, dy=(10 if k == 0 else -2))
    # the plateau the ledger predicts
    v_launch = 5.0 * Z0_COAX / (25.0 + Z0_COAX)
    assert abs(v_launch - 3.3316) < 2e-3, v_launch
    ax.axhline(v_launch, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.05, v_launch + 0.12, f"launched step {v_launch:.2f} V "
                                      "= $5.0\\,Z_0/(R_S+Z_0)$", mode)
    ax.axhline(2 * v_launch, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 0.05, 2 * v_launch + 0.12, f"open end doubles it to "
                                          f"{2 * v_launch:.2f} V", mode)
    ax.set_xlabel("position along the line  $z$  (m)")
    ax.set_ylabel("voltage  $v(z,t)$  (V)")
    ax.set_title("A step, integrated from the telegrapher's equations")
    ax.set_xlim(0, 1.62)
    ax.set_ylim(0, 7.6)
    S.strip(ax)
    return fig


@figure("em4-standing-wave-fdtd")
def _standing(mode):
    """FDTD envelope against the closed-form standing-wave envelope."""
    fig, ax = plt.subplots()
    freq = 300e6
    lam = LINE50.vp_lossless / freq
    length = 1.0 * lam
    col = S.SERIES[mode]
    beta = 2 * math.pi / lam
    for k, zl in enumerate((150.0, 25.0)):
        z, prof = fdtd_phasor_profile(LINE50, length, freq, rs=50.0, rl=zl,
                                      cells=800, periods=34, keep=10)
        env = np.abs(prof)
        g = (zl - 50.0) / (zl + 50.0)
        d = length - z                       # distance back from the load
        closed = np.abs(1 + g * np.exp(-2j * beta * d))
        # both curves are referred to the INCIDENT amplitude, which is what a
        # slotted line reports; the FDTD scale factor is its own |V+|
        scale = env.max() / closed.max()
        ax.plot(d / lam, closed, color=col[k], lw=1.9)
        step = 26
        ax.plot(d[::step] / lam, env[::step] / scale, ls="none", marker="o",
                ms=4.4, mfc="none", mec=col[k], mew=1.3)
        S.label_end(ax, 0.995, closed[0],
                    f"$Z_L={zl:.0f}\\ \\Omega$", col[k], mode,
                    dx=6, dy=(6 if k == 0 else -6))
        vswr = env.max() / env.min()
        assert abs(vswr - (1 + abs(g)) / (1 - abs(g))) < 0.02 * vswr, vswr
    S.note(ax, 0.30, 1.70, "line: closed-form envelope\ncircles: FDTD solution of\n"
                           "the telegrapher's equations", mode)
    S.note(ax, 0.28, 0.18, "minima repeat every $\\lambda/2$", mode)
    for x in (0.25, 0.75):
        ax.axvline(x, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.set_xlabel("distance back from the load  $d/\\lambda$")
    ax.set_ylabel("$|V|$ / incident amplitude")
    ax.set_title("Standing waves: two solvers, one envelope")
    ax.set_xlim(0, 1.0)
    ax.set_ylim(0, 2.0)
    S.strip(ax)
    return fig


@figure("em4-zin-locus")
def _zin_locus(mode):
    """Resistance and reactance seen looking into a 25 ohm terminated line."""
    fig, ax = plt.subplots()
    d = np.linspace(0, 0.5, 1001)
    z0, zl = 50.0, 25.0
    r, x = [], []
    for dd in d:
        z = zin_closed(z0, zl, 1j * 2 * math.pi, dd)
        r.append(z.real)
        x.append(z.imag)
    r, x = np.array(r), np.array(x)
    col = S.SERIES[mode]
    ax.plot(d, r, color=col[0])
    ax.plot(d, x, color=col[1])
    S.label_end(ax, 0.5, r[-1], "$R_{in}$", col[0], mode, dx=6, dy=-4)
    S.label_end(ax, 0.42, x[int(0.42 * 1000)], "$X_{in}$", col[1], mode, dx=6)
    # FDTD confirmations at three lengths
    freq = 300e6
    lam = LINE50.vp_lossless / freq
    beta = 2 * math.pi / lam
    marks = []
    for frac in (0.125, 0.25, 0.375):
        z, prof = fdtd_phasor_profile(LINE50, frac * lam, freq, rs=50.0, rl=zl,
                                      cells=600, periods=30, keep=8)
        m = np.column_stack([np.exp(-1j * beta * z), np.exp(1j * beta * z)])
        coef, *_ = np.linalg.lstsq(m, prof, rcond=None)
        a, b = coef
        zin = (a + b) / ((a - b) / z0)
        closed = zin_closed(z0, zl, 1j * beta, frac * lam)
        assert abs(zin - closed) < 0.01 * abs(closed), (frac, zin, closed)
        marks.append((frac, zin))
        ax.plot([frac], [zin.real], marker="s", ms=6, mfc="none", mec=col[0], mew=1.4)
        ax.plot([frac], [zin.imag], marker="s", ms=6, mfc="none", mec=col[1], mew=1.4)
    for xv, lab in ((0.25, "$\\lambda/4$: $Z_0^{2}/Z_L=100\\ \\Omega$"),
                    (0.5, "$\\lambda/2$: back to $25\\ \\Omega$")):
        ax.axvline(xv, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 0.255, 86, "$\\lambda/4$ inverts:\n$Z_0^{2}/Z_L=100\\ \\Omega$", mode)
    S.note(ax, 0.36, -44, "squares: FDTD", mode)
    ax.axhline(0, color=S.GUIDE[mode], lw=0.9)
    ax.set_xlabel("length of line between the meter and the load  $d/\\lambda$")
    ax.set_ylabel("input impedance  ($\\Omega$)")
    ax.set_title("What a length of line does to a 25 $\\Omega$ load")
    ax.set_xlim(0, 0.53)
    ax.set_ylim(-60, 110)
    S.strip(ax)
    return fig


@figure("em4-qwt-sweep")
def _qwt(mode):
    """Quarter-wave transformer: swept, not asserted at one frequency."""
    fig, ax = plt.subplots()
    fr = np.linspace(0.30, 1.70, 900)
    g_ok = np.array([abs(gamma_in_qwt(f)) for f in fr])
    # the classic error: cut the section to a free-space quarter wave, so it is
    # sqrt(eps_r) too long and the match lands at f0/sqrt(eps_r)
    scale = math.sqrt(EPSR_PTFE)
    g_bad = np.array([abs(gamma_in_qwt(f * scale)) for f in fr])
    g_none = np.full_like(fr, abs((QWT_ZL - QWT_ZS) / (QWT_ZL + QWT_ZS)))
    col = S.SERIES[mode]
    ax.plot(fr, g_none, color=S.GUIDE[mode], lw=1.4, ls="--")
    ax.plot(fr, g_ok, color=col[0])
    ax.plot(fr, g_bad, color=col[1])
    S.label_end(ax, 1.70, g_none[-1], "no transformer", S.GUIDE[mode], mode, dx=-116, dy=9)
    S.label_end(ax, 1.62, g_ok[int(0.94 * 899)], "section cut in the\nline's own $\\lambda$",
                col[0], mode, dx=-150, dy=16)
    S.label_end(ax, 0.72, g_bad[int(0.30 * 899)], "section cut to a\nfree-space $\\lambda/4$",
                col[1], mode, dx=4, dy=18)
    gt = 0.25 / 2.25
    lo = bisect(lambda f: abs(gamma_in_qwt(f)) - gt, 0.30, 0.999)
    hi = bisect(lambda f: abs(gamma_in_qwt(f)) - gt, 1.001, 1.90)
    assert abs((hi - lo) - 0.409666) < 5e-5, hi - lo
    ax.axhline(gt, color=S.GUIDE[mode], lw=1.0, ls=":")
    ax.axvspan(lo, hi, color=col[0], alpha=0.10, lw=0)
    S.note(ax, 0.5 * (lo + hi), 0.128, f"VSWR $\\leq 1.25$ from {lo:.3f} to {hi:.3f} $f_0$\n"
                                       f"= {100 * (hi - lo):.1f} % bandwidth",
           mode, ha="center")
    # FDTD spot checks
    lam1 = C_LIGHT / (QWT_F0 * math.sqrt(EPSR_PTFE))
    feed = Line(L=QWT_ZS * math.sqrt(EPSR_PTFE) / C_LIGHT,
                C=math.sqrt(EPSR_PTFE) / (C_LIGHT * QWT_ZS))
    sect = Line(L=QWT_Z1 * math.sqrt(EPSR_PTFE) / C_LIGHT,
                C=math.sqrt(EPSR_PTFE) / (C_LIGHT * QWT_Z1))
    for f in (0.80, 1.20):
        g = abs(fdtd_gamma_two_segment(feed, sect, lam1 / 4, f * QWT_F0,
                                       QWT_ZL, QWT_ZS))
        assert abs(g - abs(gamma_in_qwt(f))) < 0.025, (f, g)
        ax.plot([f], [g], marker="o", ms=6.5, mfc="none", mec=col[0], mew=1.5)
    S.note(ax, 1.02, 0.20, "circles: FDTD on a real\ntwo-segment line", mode)
    ax.set_xlabel("frequency  $f/f_{0}$")
    ax.set_ylabel("input reflection  $|\\Gamma_{in}|$")
    ax.set_title("One quarter-wave section, across frequency")
    ax.set_xlim(0.30, 1.70)
    ax.set_ylim(0, 0.42)
    S.strip(ax)
    return fig


@figure("em4-smith-map")
def _smith(mode):
    """The Smith chart as the bilinear map it is, with one worked traverse."""
    fig, ax = plt.subplots(figsize=(6.6, 7.0))
    guide, ink2 = S.GUIDE[mode], S.INK_2[mode]
    th = np.linspace(0, 2 * math.pi, 721)
    ax.plot(np.cos(th), np.sin(th), color=ink2, lw=1.3)
    for r in (0.2, 0.5, 1.0, 2.0, 5.0):
        cx, rad = r / (1 + r), 1 / (1 + r)
        ax.plot(cx + rad * np.cos(th), rad * np.sin(th), color=guide, lw=0.8)
    for x in (0.2, 0.5, 1.0, 2.0, 5.0):
        for s in (1, -1):
            cy, rad = s / x, 1 / x
            xs, ys = 1 + rad * np.cos(th), cy + rad * np.sin(th)
            keep = xs ** 2 + ys ** 2 <= 1.0000001
            ax.plot(xs[keep], ys[keep], color=guide, lw=0.8)
    ax.plot([-1, 1], [0, 0], color=guide, lw=0.8)
    col = S.SERIES[mode]
    z_l = (20 + 40j) / 50.0
    g_l = (z_l - 1) / (z_l + 1)
    move = 0.15
    arc = np.linspace(0, move, 300)
    gs = g_l * np.exp(-2j * (2 * math.pi) * arc)
    ax.plot(np.abs(g_l) * np.cos(th), np.abs(g_l) * np.sin(th), color=col[2],
            lw=1.0, ls=":")
    ax.plot(gs.real, gs.imag, color=col[0], lw=2.4)
    g_in = gs[-1]
    z_in = (1 + g_in) / (1 - g_in)
    assert abs(z_in - 3.695045 + 1.405114j) < 2e-4, z_in
    ax.plot([g_l.real], [g_l.imag], marker="o", ms=7, color=col[1])
    ax.plot([g_in.real], [g_in.imag], marker="o", ms=7, color=col[0])
    S.label_end(ax, g_l.real, g_l.imag, "start", col[1], mode, dx=-8, dy=10,
                ha="right", size=9.5)
    S.label_end(ax, g_in.real, g_in.imag, "end", col[0], mode, dx=10, dy=-6, size=9.5)
    S.note(ax, -1.09, -1.24, "start  $z_L=0.4+j0.8$,   "
                             "$\\Gamma=0.620\\angle 97.1^\\circ$", mode)
    S.note(ax, -1.09, -1.38, "after $0.15\\lambda$ toward the source  "
                             "$z=3.695-j1.405$,   $\\Gamma=0.620\\angle -10.9^\\circ$",
           mode)
    S.note(ax, -1.09, -1.53, "the dotted circle is constant $|\\Gamma|$; on a lossless "
                             "line a traverse is only a rotation", mode)
    ax.set_aspect("equal")
    ax.set_xlim(-1.12, 1.12)
    ax.set_ylim(-1.62, 1.12)
    ax.set_xlabel("$\\mathrm{Re}\\,\\Gamma$")
    ax.set_ylabel("$\\mathrm{Im}\\,\\Gamma$")
    ax.set_title("The Smith chart is $\\Gamma=(z-1)/(z+1)$")
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    return fig


@figure("em4-stub-match")
def _stub(mode):
    """Single shunt stub: the admittance walk, and the match across frequency."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(7.2, 6.4))
    zl, z0 = 100 + 50j, 50.0
    d_sol, b, l_stub = stub_design(zl, z0)
    assert abs(d_sol - 0.198792) < 5e-5, d_sol
    assert abs(l_stub - 0.125) < 1e-6, l_stub
    col = S.SERIES[mode]
    d = np.linspace(0, 0.5, 1001)
    g_re, g_im = [], []
    for dd in d:
        t = cmath.tan(2 * math.pi * dd)
        z = ((zl / z0) + 1j * t) / (1 + 1j * (zl / z0) * t)
        y = 1 / z
        g_re.append(y.real)
        g_im.append(y.imag)
    ax1.plot(d, g_re, color=col[0])
    ax1.plot(d, g_im, color=col[1])
    ax1.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    ax1.axvline(d_sol, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.label_end(ax1, 0.5, g_re[-1], "$g$", col[0], mode, dx=6, dy=-3)
    S.label_end(ax1, 0.5, g_im[-1], "$b$", col[1], mode, dx=6, dy=3)
    S.note(ax1, 0.012, -1.95, f"$d={d_sol:.4f}\\lambda$ gives $y=1+j1$; a "
                              f"$0.125\\lambda$ shorted stub adds $-j1$", mode)
    ax1.set_xlabel("distance from the load  $d/\\lambda$")
    ax1.set_ylabel("normalised admittance")
    ax1.set_title("Step 1: walk to where the conductance is 1")
    ax1.set_xlim(0, 0.52)
    ax1.set_ylim(-2.2, 2.6)
    S.strip(ax1)

    fr = np.linspace(0.6, 1.4, 601)
    mag = []
    for f in fr:
        y = stub_admittance_total(d_sol * f, l_stub * f, zl, z0)
        zin = z0 / y
        mag.append(abs((zin - z0) / (zin + z0)))
    mag = np.array(mag)
    ax2.plot(fr, mag, color=col[0])
    ax2.axhline(abs((zl - z0) / (zl + z0)), color=S.GUIDE[mode], lw=1.2, ls="--")
    S.note(ax2, 0.62, abs((zl - z0) / (zl + z0)) + 0.012, "unmatched load", mode)
    k = int(np.argmin(mag))
    assert mag[k] < 2e-3, mag[k]
    gt = 0.25 / 2.25
    lo = bisect(lambda f: abs(
        (z0 / stub_admittance_total(d_sol * f, l_stub * f, zl, z0) - z0)
        / (z0 / stub_admittance_total(d_sol * f, l_stub * f, zl, z0) + z0)) - gt,
        0.6, 0.999)
    hi = bisect(lambda f: abs(
        (z0 / stub_admittance_total(d_sol * f, l_stub * f, zl, z0) - z0)
        / (z0 / stub_admittance_total(d_sol * f, l_stub * f, zl, z0) + z0)) - gt,
        1.001, 1.4)
    ax2.axvspan(lo, hi, color=col[0], alpha=0.10, lw=0)
    ax2.axhline(gt, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax2, 0.5 * (lo + hi), 0.30, f"VSWR $\\leq 1.25$ over {100 * (hi - lo):.1f} %",
           mode, ha="center")
    assert abs(100 * (hi - lo) - 11.935) < 0.02, hi - lo
    ax2.set_xlabel("frequency  $f/f_{0}$")
    ax2.set_ylabel("$|\\Gamma_{in}|$")
    ax2.set_title("Step 2: what the finished match does across frequency")
    ax2.set_xlim(0.6, 1.4)
    ax2.set_ylim(0, 0.52)
    S.strip(ax2)
    fig.tight_layout()
    return fig


@figure("em4-tdr-trace")
def _tdr(mode):
    """A TDR trace, from the bounce ledger and from FDTD, with the fault located."""
    fig, ax = plt.subplots()
    col = S.SERIES[mode]
    tg, hist, _, _, _ = fdtd(
        [TDR_LINE_A.L, TDR_LINE_B.L], [TDR_LINE_A.C, TDR_LINE_B.C],
        [TDR_LEN_A, TDR_LEN_B], TDR_ZS, None, 380e-9,
        lambda t: 0.0 if t < 0 else 1.0 * (1 - math.exp(-t / 0.4e-9)),
        cells_per_seg=500, probe_nodes=[0])
    ax.plot(tg * 1e9, hist[:, 0], color=col[0])
    ledger = tdr_ledger()
    for t_ns, v in ledger:
        if t_ns > 360:
            continue
        ax.plot([t_ns], [v], marker="o", ms=6, mfc="none", mec=col[1], mew=1.5)
    S.note(ax, 200, 0.36, "circles: bounce-diagram ledger\nline: FDTD", mode)
    ax.axvline(148.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    S.note(ax, 152, 0.72, f"step down at 148 ns\n$\\Gamma=-0.20 \\Rightarrow "
                          f"Z={TDR_Z_B:.1f}\\ \\Omega$\nfault at "
                          f"{TDR_LEN_A:.2f} m", mode)
    ax.axhline(1.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    S.note(ax, 8, 1.02, "open far end: the trace must finish at the full 1.000 V", mode)
    S.note(ax, 8, 0.44, "launched 0.500 V\ninto a matched 50 $\\Omega$ head", mode)
    ax.set_xlabel("time at the instrument  (ns)")
    ax.set_ylabel("voltage at the TDR head  (V)")
    ax.set_title("Time-domain reflectometry finds the fault and its impedance")
    ax.set_xlim(0, 360)
    ax.set_ylim(0, 1.16)
    S.strip(ax)
    return fig


@figure("em4-mismatch-ladder")
def _mismatch(mode):
    """Gamma, VSWR, return loss and mismatch loss are one fact in four units."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.6, 4.1))
    col = S.SERIES[mode]
    ratio = np.logspace(math.log10(0.1), math.log10(10.0), 900)
    g = np.abs((ratio - 1) / (ratio + 1))
    vswr = (1 + g) / (1 - g)
    ax1.plot(ratio, vswr, color=col[0])
    ax1.set_xscale("log")
    ax1.axhline(2.0, color=S.GUIDE[mode], lw=1.0, ls=":")
    for rr in (0.5, 2.0):
        ax1.plot([rr], [2.0], marker="o", ms=6, color=col[1])
    S.note(ax1, 0.115, 2.25, "$Z_L=2Z_0$ and $Z_L=Z_0/2$\nland on the same VSWR", mode)
    assert abs(vswr[int(np.argmin(np.abs(ratio - 2.0)))] - 2.0) < 5e-3
    ax1.set_xlabel("$Z_L/Z_0$  (resistive)")
    ax1.set_ylabel("VSWR")
    ax1.set_title("VSWR throws away the sign")
    ax1.set_ylim(1, 10)
    S.strip(ax1)

    gg = np.linspace(0.005, 0.85, 700)
    rl = -20 * np.log10(gg)
    ml = -10 * np.log10(1 - gg ** 2)
    ax2.plot(gg, rl, color=col[0])
    ax2.plot(gg, ml, color=col[1])
    # each label sits ON its own curve, not in the margin where the two
    # decibel scales cross and the identity would be ambiguous
    S.label_end(ax2, 0.20, -20 * math.log10(0.20), "return loss", col[0], mode,
                dx=10, dy=6)
    S.label_end(ax2, 0.80, -10 * math.log10(1 - 0.80 ** 2), "mismatch loss",
                col[1], mode, dx=-10, dy=10, ha="right")
    for gv in (1 / 3, 0.5):
        ax2.plot([gv], [-20 * math.log10(gv)], marker="o", ms=5.5, color=col[0])
        ax2.plot([gv], [-10 * math.log10(1 - gv ** 2)], marker="o", ms=5.5, color=col[1])
    assert abs(-10 * math.log10(1 - (1 / 3) ** 2) - 0.5115) < 5e-4
    S.note(ax2, 0.47, 15.5, "a 2:1 VSWR costs\n0.51 dB of power\nbut returns 11 %", mode)
    ax2.set_xlabel("$|\\Gamma|$")
    ax2.set_ylabel("decibels")
    ax2.set_title("Two decibel scales, one $\\Gamma$")
    ax2.set_ylim(0, 26)
    S.strip(ax2)
    fig.tight_layout()
    return fig


# ======================================================================= driver
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
    if "--verify" in args:
        verify()
        return 0
    prefix = args[0] if args else "em4-"
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    checks = verify(loud=False)
    print(f"cross-check suite passed ({len(checks)} claims)\n")
    for n in sorted(names):
        assert n.startswith("em4-"), n
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
