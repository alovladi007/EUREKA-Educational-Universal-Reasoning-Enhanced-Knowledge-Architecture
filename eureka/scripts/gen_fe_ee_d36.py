#!/usr/bin/env python3
"""Depth-wave-36 figures for the FE Electrical and Computer course.

Scope: the vector-analysis chapter of the Mathematics section (topic
`fee_vector_analysis`, figure prefix `math6-`). Same contract as the earlier
generators and the same shared style module, so these plots sit beside the
existing ones without introducing a second look.

Nothing here is traced, scanned or adapted from a reference work. Every curve,
patch and arrow is computed in this file from the field the lesson writes down,
so a reader can rerun the script and get the picture back. Formulas are not
protected expression; other people's drawings of them are, and this pipeline
never touches one.

VERIFICATION IS THE POINT OF THIS FILE, not a side-effect. A vector-analysis
chapter makes a long list of numeric claims - this line integral, that flux,
both sides of three integral theorems - and every one of them is recomputed
here by a route independent of the algebra printed in the lesson:

  * every line, surface and volume integral is evaluated by numerical
    quadrature and compared with the closed form the lesson derives;
  * every differential operator (grad, div, curl, Laplacian) is evaluated by
    central differences on a grid and compared with the hand-differentiated
    expression;
  * every identity (curl grad, div curl, the vector Laplacian, the two product
    rules) is checked on a concrete field by numerical differentiation;
  * Green's, Stokes' and the divergence theorem are each checked by computing
    BOTH sides numerically on a real region and comparing them.

`python3 scripts/gen_fe_ee_d36.py --verify` runs that battery alone and prints
the counts. The figure generators repeat the claims they draw as `assert`s at
tight tolerances, so a wrong claim stops the script instead of shipping.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 scripts/gen_fe_ee_d36.py                # verify, then all figures
    python3 scripts/gen_fe_ee_d36.py --verify       # numerics only
    python3 scripts/gen_fe_ee_d36.py math6-va-green # one figure
"""
from __future__ import annotations

import pathlib
import sys

import numpy as np
from scipy import integrate

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Polygon  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "math6-"

# Counters the --verify report prints. Incremented only by the two helpers
# below, so the totals cannot drift away from the checks actually run.
COUNTS = {"quadrature": 0, "derivative": 0, "theorem": 0}


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# verification helpers
# ---------------------------------------------------------------------------
def quad_ok(label, numeric, closed_form, tol=1e-9):
    """One integral, confirmed by quadrature against its closed form."""
    gap = abs(numeric - closed_form)
    assert gap < tol, f"{label}: quadrature {numeric!r} vs closed form {closed_form!r}"
    COUNTS["quadrature"] += 1
    return numeric


def deriv_ok(label, numeric, by_hand, tol=1e-6):
    """One differential claim, confirmed by central differences."""
    numeric = np.atleast_1d(np.asarray(numeric, float))
    by_hand = np.atleast_1d(np.asarray(by_hand, float))
    gap = float(np.max(np.abs(numeric - by_hand)))
    assert gap < tol, f"{label}: numeric {numeric} vs hand {by_hand} (gap {gap:g})"
    COUNTS["derivative"] += 1
    return numeric


def theorem_ok(label, left, right, tol=1e-9):
    """One integral theorem, with BOTH sides computed numerically."""
    gap = abs(left - right)
    assert gap < tol, f"{label}: left {left!r} vs right {right!r} (gap {gap:g})"
    COUNTS["theorem"] += 1
    return left


# ---------------------------------------------------------------------------
# numerical calculus, done once and reused
# ---------------------------------------------------------------------------
def grad_num(f, p, h=1e-5):
    p = np.asarray(p, float)
    g = np.zeros(p.size)
    for i in range(p.size):
        e = np.zeros(p.size)
        e[i] = h
        g[i] = (f(p + e) - f(p - e)) / (2 * h)
    return g


def jac_num(F, p, h=1e-5):
    p = np.asarray(p, float)
    J = np.zeros((3, 3))
    for j in range(3):
        e = np.zeros(3)
        e[j] = h
        J[:, j] = (np.asarray(F(p + e), float) - np.asarray(F(p - e), float)) / (2 * h)
    return J


def div_num(F, p, h=1e-5):
    return float(np.trace(jac_num(F, p, h)))


def curl_num(F, p, h=1e-5):
    J = jac_num(F, p, h)
    return np.array([J[2, 1] - J[1, 2], J[0, 2] - J[2, 0], J[1, 0] - J[0, 1]])


def lap_num(f, p, h=1e-4):
    p = np.asarray(p, float)
    total = 0.0
    for i in range(p.size):
        e = np.zeros(p.size)
        e[i] = h
        total += (f(p + e) - 2 * f(p) + f(p - e)) / h ** 2
    return float(total)


def line_int(F, path, a=0.0, b=1.0, h=1e-6, **kw):
    """Work integral of a vector field along a parametrised path, by quadrature."""
    def tangent(t):
        return (np.asarray(path(t + h), float) - np.asarray(path(t - h), float)) / (2 * h)

    return integrate.quad(lambda t: float(np.asarray(F(path(t)), float) @ tangent(t)),
                          a, b, epsabs=1e-13, limit=400, **kw)[0]


def flux_cube(F, centre, h, n=20):
    """Outward flux through an axis-aligned cube, tensor-product Gauss on each face."""
    x, w = np.polynomial.legendre.leggauss(n)
    u = x * h / 2
    wu = w * h / 2
    total = 0.0
    for axis in range(3):
        a, b = [k for k in range(3) if k != axis]
        for sign in (+1.0, -1.0):
            for i in range(n):
                for j in range(n):
                    q = np.array(centre, float)
                    q[axis] += sign * h / 2
                    q[a] += u[i]
                    q[b] += u[j]
                    total += sign * float(np.asarray(F(q), float)[axis]) * wu[i] * wu[j]
    return total


def circ_square(F, centre, h, n=24):
    """Circulation round an axis-aligned square in the z = const plane, ccw from +z."""
    x, w = np.polynomial.legendre.leggauss(n)
    t = x * h / 2
    wt = w * h / 2
    cx, cy, cz = centre
    total = 0.0
    for k in range(n):
        total += wt[k] * float(np.asarray(F([cx + t[k], cy - h / 2, cz]), float)[0])
        total += wt[k] * float(np.asarray(F([cx + h / 2, cy + t[k], cz]), float)[1])
        total -= wt[k] * float(np.asarray(F([cx + t[k], cy + h / 2, cz]), float)[0])
        total -= wt[k] * float(np.asarray(F([cx - h / 2, cy + t[k], cz]), float)[1])
    return total


def sphere_flux(F, radius, nt=160, npv=320):
    """Outward flux through a sphere: Gauss-Legendre in cos(theta), midpoint in phi."""
    x, w = np.polynomial.legendre.leggauss(nt)
    phi = (np.arange(npv) + 0.5) * 2 * np.pi / npv
    dphi = 2 * np.pi / npv
    total = 0.0
    for i in range(nt):
        ct = x[i]
        st = np.sqrt(max(0.0, 1 - ct * ct))
        for ph in phi:
            n = np.array([st * np.cos(ph), st * np.sin(ph), ct])
            total += float(np.asarray(F(radius * n), float) @ n) * w[i] * dphi
    return total * radius ** 2


# ---------------------------------------------------------------------------
# the concrete objects the chapter uses
# ---------------------------------------------------------------------------
VA = np.array([3.0, -2.0, 6.0])
VB = np.array([2.0, 3.0, 6.0])
VC = np.array([1.0, 1.0, 1.0])
PT = np.array([1.0, 2.0, 3.0])

#: the running vector field of the chapter
FIELD = lambda p: np.array([p[0] ** 2 * p[1], p[1] * p[2] ** 2, p[0] * p[2]])
#: the running scalar field
SCALAR = lambda p: p[0] ** 2 * p[1] + p[1] * p[2] ** 3
#: helix radius and pitch coefficient
HA, HC = 3.0, 4.0
HELIX = lambda t: np.array([HA * np.cos(t), HA * np.sin(t), HC * t])
#: a plane field with circulation, and a plane field without
SWIRL = lambda p: np.array([p[1], 2.0 * p[0]])
GRADFIELD = lambda p: np.array([2.0 * p[0] * p[1], p[0] ** 2])
#: the conservative 3-D field and its potential
CONS = lambda p: np.array([2 * p[0] * p[1] + p[2] ** 2, p[0] ** 2, 2 * p[0] * p[2]])
POT = lambda p: p[0] ** 2 * p[1] + p[0] * p[2] ** 2


#: One axonometric camera for every 3-D drawing in this file, chosen so that the
#: plane x + y + z = 1 is seen well clear of edge-on: an earlier azimuth put the
#: camera's forward vector almost perpendicular to (1, 1, 1), which collapsed the
#: Stokes triangle into a sliver. With this pair the forward vector is
#: (sin az cos el, -cos az cos el, sin el) = (0.545, 0.650, 0.530), which meets
#: (1, 1, 1)/sqrt(3) at about 15 degrees.
CAM_AZ, CAM_EL = 140.0, 32.0


def axo(points, az=CAM_AZ, el=CAM_EL):
    """Fixed axonometric camera: 3-D points to screen (x, y)."""
    a, e = np.radians(az), np.radians(el)
    rz = np.array([[np.cos(a), np.sin(a), 0.0],
                   [-np.sin(a), np.cos(a), 0.0],
                   [0.0, 0.0, 1.0]])
    tilt = np.array([[1.0, 0.0, 0.0],
                     [0.0, np.sin(e), np.cos(e)],
                     [0.0, -np.cos(e), np.sin(e)]])
    q = np.asarray(points, float)
    single = q.ndim == 1
    q = np.atleast_2d(q) @ (tilt @ rz).T
    if single:
        return float(q[0, 0]), float(q[0, 1])
    return q[:, 0], q[:, 1]


def arrow(ax, p0, p1, colour, lw=1.9, ls="-", head=9.0):
    ax.annotate("", xy=(p1[0], p1[1]), xytext=(p0[0], p0[1]),
                arrowprops=dict(arrowstyle="-|>", color=colour, lw=lw,
                                linestyle=ls, mutation_scale=head,
                                shrinkA=0, shrinkB=0))


def blank(ax):
    ax.set_xticks([])
    ax.set_yticks([])
    ax.grid(False)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    ax.set_aspect("equal")


def fit(ax, points, pad=0.10, extra_left=0.0, extra_top=0.0):
    """Set explicit limits from a projected point cloud.

    Annotations do not enter matplotlib's data limits, so a drawing whose
    labels sit outside the plotted geometry silently loses them. Every blank
    axes in this file is sized from its own points instead of autoscaled.
    """
    q = np.atleast_2d(np.asarray(points, float))
    x0, x1 = float(q[:, 0].min()), float(q[:, 0].max())
    y0, y1 = float(q[:, 1].min()), float(q[:, 1].max())
    dx, dy = max(x1 - x0, 1e-6), max(y1 - y0, 1e-6)
    ax.set_xlim(x0 - pad * dx - extra_left * dx, x1 + pad * dx)
    ax.set_ylim(y0 - pad * dy, y1 + pad * dy + extra_top * dy)


def corner(ax, mode, text, x=0.01, y=0.99, size=9, ha="left", va="top"):
    """A block of ink text pinned to the axes box, outside the data limits."""
    ax.text(x, y, text, transform=ax.transAxes, color=S.INK_2[mode],
            fontsize=size, ha=ha, va=va, linespacing=1.45)


# ===========================================================================
# the verification battery
# ===========================================================================
def verify(loud=True):  # noqa: C901 - a long list of small checks, on purpose
    # -- 1. the two products, and Lagrange's identity ------------------------
    dot = float(VA @ VB)
    cross = np.cross(VA, VB)
    assert abs(np.linalg.norm(VA) - 7.0) < 1e-12
    assert abs(np.linalg.norm(VB) - 7.0) < 1e-12
    assert abs(dot - 36.0) < 1e-12
    assert np.allclose(cross, [-30.0, -6.0, 13.0], atol=1e-12)
    assert abs(np.linalg.norm(cross) - np.sqrt(1105.0)) < 1e-12
    assert abs(np.linalg.norm(cross) - 33.241540) < 1e-6
    # the dot product recovered from the angle, and the angle from the cross
    theta = np.arccos(dot / 49.0)
    assert abs(np.degrees(theta) - 42.718645) < 1e-6, np.degrees(theta)
    assert abs(49.0 * np.cos(theta) - dot) < 1e-12
    assert abs(49.0 * np.sin(theta) - np.linalg.norm(cross)) < 1e-12
    assert abs(dot ** 2 + float(cross @ cross) - 2401.0) < 1e-9
    # cross product is perpendicular to both, and anticommutative
    assert abs(float(cross @ VA)) < 1e-12 and abs(float(cross @ VB)) < 1e-12
    assert np.allclose(np.cross(VB, VA), -cross, atol=1e-12)
    # scalar triple product three ways: dot-cross, cyclic shift, determinant
    stp = float(VA @ np.cross(VB, VC))
    assert abs(stp + 23.0) < 1e-12
    assert abs(float(VC @ np.cross(VA, VB)) - stp) < 1e-12
    assert abs(float(np.linalg.det(np.array([VA, VB, VC]))) - stp) < 1e-9
    # vector triple product against the BAC-CAB expansion
    assert np.allclose(np.cross(VA, np.cross(VB, VC)),
                       VB * float(VA @ VC) - VC * dot, atol=1e-12)
    assert np.allclose(np.cross(VA, np.cross(VB, VC)), [-22.0, -15.0, 6.0], atol=1e-12)

    # -- 2. curve geometry: helix -------------------------------------------
    d1 = lambda t: (HELIX(t + 1e-4) - HELIX(t - 1e-4)) / 2e-4
    d2 = lambda t: (HELIX(t + 1e-3) - 2 * HELIX(t) + HELIX(t - 1e-3)) / 1e-6
    d3 = lambda t: (HELIX(t + 2e-2) - 2 * HELIX(t + 1e-2)
                    + 2 * HELIX(t - 1e-2) - HELIX(t - 2e-2)) / 2e-6
    t0 = 0.7
    deriv_ok("helix speed", np.linalg.norm(d1(t0)), 5.0, tol=1e-7)
    deriv_ok("helix |r''|", np.linalg.norm(d2(t0)), 3.0, tol=1e-6)
    cr = np.cross(d1(t0), d2(t0))
    deriv_ok("helix curvature",
             np.linalg.norm(cr) / np.linalg.norm(d1(t0)) ** 3, HA / (HA ** 2 + HC ** 2),
             tol=1e-6)
    deriv_ok("helix torsion", float(cr @ d3(t0)) / float(cr @ cr),
             HC / (HA ** 2 + HC ** 2), tol=1e-4)
    tangent = d1(t0) / np.linalg.norm(d1(t0))
    deriv_ok("helix T", tangent, [-0.6 * np.sin(t0), 0.6 * np.cos(t0), 0.8], tol=1e-7)
    normal = d2(t0) / np.linalg.norm(d2(t0))
    deriv_ok("helix N", normal, [-np.cos(t0), -np.sin(t0), 0.0], tol=1e-6)
    binormal = np.cross(tangent, normal)
    deriv_ok("helix B", binormal,
             [0.8 * np.sin(t0), -0.8 * np.cos(t0), 0.6], tol=1e-6)
    assert abs(np.linalg.norm(binormal) - 1.0) < 1e-9
    quad_ok("helix arc length one turn",
            integrate.quad(lambda t: float(np.linalg.norm(d1(t))), 0, 2 * np.pi,
                           epsabs=1e-13)[0],
            10 * np.pi, tol=1e-6)
    # tangential and normal acceleration on a constant-speed curve
    deriv_ok("helix a_N", 0.12 * 25.0, np.linalg.norm(d2(t0)), tol=1e-6)

    # -- 3. gradient, level sets, directional derivative ---------------------
    f2 = lambda p: p[0] ** 2 + 4 * p[1] ** 2
    g = deriv_ok("grad of x^2+4y^2", grad_num(f2, [3.0, 1.0]), [6.0, 8.0])
    assert abs(np.linalg.norm(g) - 10.0) < 1e-6
    deriv_ok("D_u along the gradient", float(g @ np.array([0.6, 0.8])), 10.0)
    deriv_ok("D_u along the level curve", float(g @ np.array([0.8, -0.6])), 0.0)
    deriv_ok("D_u at 60 degrees", 10.0 * np.cos(np.radians(60.0)), 5.0, tol=1e-12)
    deriv_ok("grad of the 3-D scalar", grad_num(SCALAR, PT), [4.0, 28.0, 54.0], tol=1e-5)
    deriv_ok("Laplacian of the 3-D scalar", lap_num(SCALAR, PT), 40.0, tol=1e-4)

    # -- 4. divergence, curl, and the identities ----------------------------
    deriv_ok("div F", div_num(FIELD, PT), 14.0)
    deriv_ok("curl F", curl_num(FIELD, PT), [-12.0, -3.0, -1.0], tol=1e-5)
    deriv_ok("curl grad = 0",
             curl_num(lambda p: grad_num(SCALAR, p, 1e-4), PT, 1e-3),
             [0.0, 0.0, 0.0], tol=1e-5)
    deriv_ok("div curl = 0",
             div_num(lambda p: curl_num(FIELD, p, 1e-4), PT, 1e-3), 0.0, tol=1e-5)
    curlcurl = curl_num(lambda p: curl_num(FIELD, p, 1e-4), PT, 1e-3)
    graddiv = grad_num(lambda p: div_num(FIELD, p, 1e-4), PT, 1e-3)
    vlap = np.array([lap_num(lambda p: FIELD(p)[i], PT) for i in range(3)])
    deriv_ok("vector Laplacian identity", curlcurl, graddiv - vlap, tol=2e-4)
    deriv_ok("curl curl value", curlcurl, [1.0, -2.0, 6.0], tol=2e-4)
    # the two product rules, on the same pair of fields
    fF = lambda p: SCALAR(p) * FIELD(p)
    deriv_ok("product rule for divergence", div_num(fF, PT, 1e-4),
             SCALAR(PT) * 14.0 + float(np.asarray(FIELD(PT)) @ np.array([4.0, 28.0, 54.0])),
             tol=1e-3)
    deriv_ok("product rule for divergence, value", div_num(fF, PT, 1e-4), 1458.0, tol=1e-3)
    deriv_ok("product rule for curl", curl_num(fF, PT, 1e-4),
             SCALAR(PT) * np.array([-12.0, -3.0, -1.0])
             + np.cross(np.array([4.0, 28.0, 54.0]), FIELD(PT)), tol=1e-3)
    deriv_ok("product rule for curl, value", curl_num(fF, PT, 1e-4),
             [-1560.0, -72.0, -40.0], tol=1e-3)

    # -- 5. divergence as flux per unit volume, curl as circulation per area -
    for h in (0.4, 0.2, 0.1, 0.05):
        flux = flux_cube(FIELD, PT, h)
        quad_ok(f"cube flux h={h}", flux / h ** 3, 14.0 + h * h / 12.0, tol=1e-9)
        circ = circ_square(FIELD, PT, h)
        quad_ok(f"loop circulation h={h}", circ / h ** 2, -1.0 - h * h / 12.0, tol=1e-9)

    # -- 5b. the Laplacian as the mean-value defect over a small cube --------
    # mean of f over a cube of side h = f(centre) + (h^2/24) * lap f + O(h^4)
    def cube_mean(f, centre, h, n=16):
        x, w = np.polynomial.legendre.leggauss(n)
        u, wu = x * h / 2, w / 2
        total = 0.0
        for i in range(n):
            for j in range(n):
                for k in range(n):
                    q = np.array(centre, float) + np.array([u[i], u[j], u[k]])
                    total += f(q) * wu[i] * wu[j] * wu[k]
        return total
    for h in (0.3, 0.15):
        quad_ok(f"cube mean of the scalar field, h={h}",
                cube_mean(SCALAR, PT, h), 56.0 + 40.0 * h * h / 24.0, tol=1e-9)

    # -- 6. line integrals ---------------------------------------------------
    quad_ok("wire mass",
            integrate.quad(lambda x: x * np.sqrt(1 + 4 * x * x), 0, 2, epsabs=1e-13)[0],
            (17 ** 1.5 - 1) / 12.0)
    straight = lambda t: np.array([t, t])
    parab = lambda t: np.array([t, t * t])
    quad_ok("work, straight", line_int(SWIRL, straight), 1.5)
    quad_ok("work, parabola", line_int(SWIRL, parab), 5.0 / 3.0)
    corner_a = quad_ok("work, corner leg 1",
                       line_int(SWIRL, lambda t: np.array([t, 0.0])), 0.0)
    corner_b = quad_ok("work, corner leg 2",
                       line_int(SWIRL, lambda t: np.array([1.0, t])), 2.0)
    corner = corner_a + corner_b
    # Green on the triangle (0,0),(1,0),(1,1): out by the corner, back by the line
    theorem_ok("Green, triangle", corner - 1.5,
               integrate.dblquad(lambda y, x: 1.0, 0, 1, 0, lambda x: x,
                                 epsabs=1e-13)[0])
    # the conservative field: three unrelated paths, one potential difference
    wiggle = lambda t: np.array([t, 2 * t + np.sin(3 * np.pi * t) * t * (1 - t), 3 * t * t])
    broken = (line_int(CONS, lambda t: np.array([t, 0.0, 0.0]))
              + line_int(CONS, lambda t: np.array([1.0, 2 * t, 0.0]))
              + line_int(CONS, lambda t: np.array([1.0, 2.0, 3 * t])))
    drop = POT(PT) - POT(np.zeros(3))
    quad_ok("conservative, straight", line_int(CONS, lambda t: t * PT), drop, tol=1e-8)
    quad_ok("conservative, broken", broken, drop, tol=1e-8)
    quad_ok("conservative, wiggly", line_int(CONS, wiggle), drop, tol=1e-7)
    theorem_ok("gradient theorem", line_int(CONS, wiggle), drop, tol=1e-7)
    assert abs(drop - 11.0) < 1e-12
    deriv_ok("the conservative field really has zero curl",
             curl_num(CONS, PT), [0.0, 0.0, 0.0], tol=1e-5)
    # the plane pair used in the path figure
    for name, path in (("straight", straight), ("parabola", parab)):
        quad_ok(f"conservative plane field, {name}", line_int(GRADFIELD, path), 1.0)
    quad_ok("conservative plane field, corner",
            line_int(GRADFIELD, lambda t: np.array([t, 0.0]))
            + line_int(GRADFIELD, lambda t: np.array([1.0, t])), 1.0)

    # -- 7. Green's theorem, both sides, on the region between y=x^2 and y=x -
    Fg = lambda p: np.array([p[0] * p[1], p[0] ** 2])
    around = (line_int(Fg, parab)
              + line_int(Fg, lambda t: np.array([1 - t, 1 - t])))
    inside = integrate.dblquad(lambda y, x: x, 0, 1, lambda x: x * x, lambda x: x,
                               epsabs=1e-13)[0]
    quad_ok("Green LHS", around, 1.0 / 12.0)
    quad_ok("Green RHS", inside, 1.0 / 12.0)
    theorem_ok("Green's theorem", around, inside)
    # the area form of the same theorem on the same region
    half = lambda p: np.array([-p[1] / 2.0, p[0] / 2.0])
    area_line = (line_int(half, parab)
                 + line_int(half, lambda t: np.array([1 - t, 1 - t])))
    area_double = integrate.dblquad(lambda y, x: 1.0, 0, 1, lambda x: x * x,
                                    lambda x: x, epsabs=1e-13)[0]
    quad_ok("Green area, line form", area_line, 1.0 / 6.0)
    quad_ok("Green area, double integral", area_double, 1.0 / 6.0)
    theorem_ok("Green's theorem, area form", area_line, area_double)

    # -- 8. Stokes' theorem, both sides, on the first-octant triangle --------
    Fs = lambda p: np.array([p[1], p[2], p[0]])
    tri = [np.array([1.0, 0, 0]), np.array([0, 1.0, 0]), np.array([0, 0, 1.0])]
    loop = 0.0
    for k in range(3):
        a, b = tri[k], tri[(k + 1) % 3]
        loop += line_int(Fs, lambda t, a=a, b=b: a + t * (b - a))
    deriv_ok("curl of the Stokes field", curl_num(Fs, np.array([0.3, 0.3, 0.4])),
             [-1.0, -1.0, -1.0], tol=1e-6)
    normal = np.ones(3) / np.sqrt(3.0)
    area = 0.5 * float(np.linalg.norm(np.cross(tri[1] - tri[0], tri[2] - tri[0])))
    cap = float(np.array([-1.0, -1.0, -1.0]) @ normal) * area
    quad_ok("Stokes LHS", loop, -1.5)
    quad_ok("Stokes RHS", cap, -1.5, tol=1e-12)
    theorem_ok("Stokes' theorem", loop, cap)
    assert abs(area - np.sqrt(3.0) / 2.0) < 1e-12

    # -- 9. the divergence theorem, both sides, three times ------------------
    # (a) F = (x^3, y^3, z^3) on the unit ball
    Fb = lambda p: np.array([p[0] ** 3, p[1] ** 3, p[2] ** 3])
    lhs = sphere_flux(Fb, 1.0)
    rhs = integrate.quad(lambda r: 3 * r * r * 4 * np.pi * r * r, 0, 1, epsabs=1e-14)[0]
    quad_ok("ball flux", lhs, 12 * np.pi / 5, tol=1e-9)
    quad_ok("ball volume integral", rhs, 12 * np.pi / 5, tol=1e-12)
    theorem_ok("divergence theorem, ball", lhs, rhs, tol=1e-9)
    deriv_ok("div of the ball field", div_num(Fb, np.array([0.3, -0.4, 0.5])),
             3 * (0.09 + 0.16 + 0.25), tol=1e-6)
    # (b) F = (x, y, 0) on a cylinder of radius 2, height 5
    R, H = 2.0, 5.0
    side = integrate.dblquad(lambda z, t: R * R, 0, 2 * np.pi, 0, H, epsabs=1e-12)[0]
    body = integrate.dblquad(lambda r, z: 2.0 * r * 2 * np.pi, 0, H, 0, R,
                             epsabs=1e-12)[0]
    quad_ok("cylinder flux", side, 40 * np.pi, tol=1e-9)
    quad_ok("cylinder volume integral", body, 40 * np.pi, tol=1e-9)
    theorem_ok("divergence theorem, cylinder", side, body, tol=1e-9)
    # (c) F = (x, y, z) on a sphere of radius 2
    Fr = lambda p: np.asarray(p, float)
    lhs2 = sphere_flux(Fr, 2.0)
    rhs2 = integrate.quad(lambda r: 3.0 * 4 * np.pi * r * r, 0, 2, epsabs=1e-13)[0]
    quad_ok("sphere flux of the position field", lhs2, 32 * np.pi, tol=1e-9)
    quad_ok("sphere volume integral", rhs2, 32 * np.pi, tol=1e-10)
    theorem_ok("divergence theorem, position field", lhs2, rhs2, tol=1e-9)

    # -- 10. surface integrals ----------------------------------------------
    quad_ok("paraboloid cap area",
            integrate.dblquad(lambda r, t: r * np.sqrt(1 + 4 * r * r), 0, 2 * np.pi,
                              0, 2, epsabs=1e-13)[0],
            np.pi / 6 * (17 ** 1.5 - 1), tol=1e-9)
    # the flat-plate flux the older worked example quotes, recomputed
    quad_ok("flat plate, normal to the field",
            integrate.dblquad(lambda y, x: 5.0, 0, 2, 0, 3, epsabs=1e-13)[0], 30.0)
    quad_ok("flat plate, tilted 60 degrees",
            integrate.dblquad(lambda y, x: 5.0 * np.cos(np.radians(60.0)),
                              0, 2, 0, 3, epsabs=1e-13)[0], 15.0)

    # -- 11. curvilinear coordinates ----------------------------------------
    x, y, z = 3.0, 4.0, 5.0
    rho = float(np.hypot(x, y))
    rr = float(np.sqrt(x * x + y * y + z * z))
    assert abs(rho - 5.0) < 1e-12
    assert abs(rr - np.sqrt(50.0)) < 1e-12
    assert abs(np.degrees(np.arctan2(y, x)) - 53.130102) < 1e-6
    assert abs(np.degrees(np.arccos(z / rr)) - 45.0) < 1e-9
    # a plane vector resolved into the cylindrical frame at that point
    cph, sph = x / rho, y / rho
    assert abs((3.0 * cph + 4.0 * sph) - 5.0) < 1e-12
    assert abs(-3.0 * sph + 4.0 * cph) < 1e-12
    # the cylindrical divergence formula, checked against the Cartesian one
    rad = lambda p: np.array([p[0] * np.hypot(p[0], p[1]), p[1] * np.hypot(p[0], p[1]), 0.0])
    probe = np.array([1.2, -0.7, 0.4])
    deriv_ok("cylindrical divergence formula", div_num(rad, probe),
             3 * float(np.hypot(probe[0], probe[1])), tol=1e-6)
    quad_ok("cylindrical example, flux", R ** 2 * 2 * np.pi * R * H, 2 * np.pi * R ** 3 * H,
            tol=1e-9)
    quad_ok("cylindrical example, volume integral",
            integrate.dblquad(lambda r, z: 3 * r * r * 2 * np.pi, 0, H, 0, R,
                              epsabs=1e-12)[0],
            2 * np.pi * R ** 3 * H, tol=1e-9)
    theorem_ok("divergence theorem in cylindrical coordinates",
               R ** 2 * 2 * np.pi * R * H,
               integrate.dblquad(lambda r, z: 3 * r * r * 2 * np.pi, 0, H, 0, R,
                                 epsabs=1e-12)[0], tol=1e-9)
    # the inverse-square field: zero divergence away from the origin, flux 4 pi
    inv = lambda p: np.asarray(p, float) / float(np.linalg.norm(p)) ** 3
    deriv_ok("inverse-square divergence", div_num(inv, np.array([0.4, -0.9, 1.3]), 1e-4),
             0.0, tol=1e-6)
    for radius in (0.5, 2.0, 7.0):
        quad_ok(f"inverse-square flux at r={radius}", sphere_flux(inv, radius), 4 * np.pi,
                tol=1e-9)
    # the Laplacian of 1/r vanishes away from the origin
    deriv_ok("Laplacian of 1/r", lap_num(lambda p: 1.0 / np.linalg.norm(p),
                                         np.array([0.6, -0.8, 1.1]), 1e-3),
             0.0, tol=1e-6)

    # -- 12. the Laplace pairs the older sections quote ----------------------
    for s in (2.0, 7.5):
        quad_ok(f"Laplace of 2-2exp(-5t) at s={s}",
                integrate.quad(lambda t: (2 - 2 * np.exp(-5 * t)) * np.exp(-s * t),
                               0, np.inf, epsabs=1e-13, limit=400)[0],
                2.0 / s - 2.0 / (s + 5.0), tol=1e-9)
    quad_ok("Laplace of 5exp(-3t) at s=4",
            integrate.quad(lambda t: 5 * np.exp(-3 * t) * np.exp(-4 * t), 0, np.inf,
                           epsabs=1e-13)[0], 5.0 / 7.0)
    # the older worked line integral, and its potential
    quad_ok("older worked line integral",
            line_int(lambda p: np.array([p[1], p[0]]), lambda t: np.array([2 * t, 4 * t])),
            8.0)

    # -- 13. everything the two problem sets ask the reader to reproduce -----
    pa, pb, pc = (np.array([2.0, -1.0, 3.0]), np.array([1.0, 4.0, -2.0]),
                  np.array([3.0, 3.0, 1.0]))
    assert abs(float(pa @ pb) + 8.0) < 1e-12
    assert np.allclose(np.cross(pa, pb), [-10.0, 7.0, 9.0], atol=1e-12)
    assert abs(np.linalg.norm(np.cross(pa, pb)) - np.sqrt(230.0)) < 1e-12
    assert abs(np.degrees(np.arccos(-8.0 / np.sqrt(294.0))) - 117.811843) < 1e-6
    assert abs(64.0 + 230.0 - 14.0 * 21.0) < 1e-12
    assert abs(float(pa @ np.cross(pb, pc))) < 1e-12          # coplanar: C = A + B
    assert np.allclose(pa + pb, pc, atol=1e-12)
    assert abs(float(pa @ np.cross(pb, np.array([0.0, 0.0, 4.0]))) - 36.0) < 1e-12
    fA = lambda p: p[0] ** 2 * p[1] + 2 * p[1] * p[2]
    deriv_ok("problem set A gradient", grad_num(fA, [2.0, 1.0, 3.0]), [4.0, 10.0, 2.0])
    assert abs(np.sqrt(120.0) - 10.954451) < 1e-6
    deriv_ok("problem set A directional derivative",
             float(np.array([4.0, 10.0, 2.0]) @ (np.array([1.0, 2.0, 2.0]) / 3.0)),
             28.0 / 3.0, tol=1e-9)
    # the angle the answer implies between that direction and the gradient
    assert abs((28.0 / 3.0) / np.sqrt(120.0) - 0.852013) < 1e-6
    assert abs(np.degrees(np.arccos((28.0 / 3.0) / np.sqrt(120.0))) - 31.5687) < 1e-4
    assert abs(np.degrees(np.arcsin(np.sqrt(230.0 / 294.0))) - 62.188157) < 1e-6
    assert abs(np.sqrt(230.0) / 2.0 - 7.582875) < 1e-6
    assert abs(np.sqrt(3716.0) - 60.959003) < 1e-6
    assert abs(np.sqrt(50.0) - 7.071068) < 1e-6
    FA = lambda p: np.array([p[0] * p[1], p[1] * p[2], p[2] * p[0]])
    deriv_ok("problem set A divergence", div_num(FA, PT), 6.0)
    deriv_ok("problem set A curl", curl_num(FA, PT), [-2.0, -3.0, -1.0], tol=1e-6)
    deriv_ok("problem set A harmonic field",
             lap_num(lambda p: p[0] ** 2 + p[1] ** 2 - 2 * p[2] ** 2, PT), 0.0, tol=1e-6)
    # B1: a conservative field and its potential
    FB = lambda p: np.array([3 * p[0] ** 2, 2 * p[1] * p[2], p[1] ** 2])
    potB = lambda p: p[0] ** 3 + p[1] ** 2 * p[2]
    deriv_ok("problem set B, zero curl", curl_num(FB, PT), [0.0, 0.0, 0.0], tol=1e-5)
    quad_ok("problem set B, work along a straight line", line_int(FB, lambda t: t * PT),
            potB(PT) - potB(np.zeros(3)), tol=1e-8)
    assert abs(potB(PT) - 13.0) < 1e-12
    # B2: a field where the route changes the answer, and Green closing the gap
    FC = lambda p: np.array([p[1] ** 2, p[0]])
    w_line = quad_ok("problem set B, along the line",
                     line_int(FC, lambda t: np.array([t, t])), 5.0 / 6.0)
    w_par = quad_ok("problem set B, along the parabola",
                    line_int(FC, lambda t: np.array([t, t * t])), 13.0 / 15.0)
    inner = integrate.dblquad(lambda y, x: 1.0 - 2.0 * y, 0, 1, lambda x: x * x,
                              lambda x: x, epsabs=1e-13)[0]
    quad_ok("problem set B, Green integrand", inner, 1.0 / 30.0)
    theorem_ok("problem set B, Green closes the gap", w_par - w_line, inner)
    # B3: the divergence theorem on a rectangular box
    box_flux = 2 * 1.0 * (2 * 3) + 3 * 2.0 * (1 * 3) + 1 * 3.0 * (1 * 2)
    box_vol = 6.0 * (1 * 2 * 3)
    quad_ok("problem set B, box flux", box_flux, 36.0, tol=1e-12)
    quad_ok("problem set B, box volume integral", box_vol, 36.0, tol=1e-12)
    theorem_ok("problem set B, divergence theorem on a box", box_flux, box_vol,
               tol=1e-12)
    # B4: Stokes on the unit disc
    swirl3 = lambda p: np.array([-p[1], p[0], p[2]])
    ring = quad_ok("problem set B, circulation round the unit circle",
                   line_int(swirl3,
                            lambda t: np.array([np.cos(2 * np.pi * t),
                                                np.sin(2 * np.pi * t), 0.0])),
                   2 * np.pi, tol=1e-8)
    deriv_ok("problem set B, curl of the swirl", curl_num(swirl3, np.array([0.3, 0.2, 0.0])),
             [0.0, 0.0, 2.0], tol=1e-6)
    theorem_ok("problem set B, Stokes on the unit disc", ring, 2.0 * np.pi, tol=1e-8)
    # B6: the two-dimensional inverse field, flux independent of radius
    line_field = lambda p: np.array([p[0], p[1], 0.0]) / (p[0] ** 2 + p[1] ** 2)
    deriv_ok("line-charge field divergence",
             div_num(line_field, np.array([0.7, -1.1, 0.3]), 1e-4), 0.0, tol=1e-6)
    for radius in (1.0, 2.0, 4.0):
        quad_ok(f"line-charge flux at R={radius}",
                (1.0 / radius) * 2 * np.pi * radius * 5.0, 2 * np.pi * 5.0, tol=1e-9)

    if loud:
        print(f"verification: {COUNTS['quadrature']} integrals confirmed by quadrature, "
              f"{COUNTS['derivative']} differential claims confirmed by numerical "
              f"differentiation, {COUNTS['theorem']} integral-theorem instances "
              f"confirmed by computing BOTH sides numerically")
    return COUNTS


# ===========================================================================
# figures
# ===========================================================================
@figure("math6-va-products")
def _(mode):
    """Projection and parallelogram area for one concrete pair of vectors."""
    c = S.SERIES[mode]
    e1 = VB / np.linalg.norm(VB)
    perp = VA - float(VA @ e1) * e1
    e2 = perp / np.linalg.norm(perp)
    ax_, ay = float(VA @ e1), float(VA @ e2)
    bx = float(np.linalg.norm(VB))
    assert abs(ax_ - 36.0 / 7.0) < 1e-12, ax_
    assert abs(ay - np.sqrt(1105.0) / 7.0) < 1e-12, ay
    # the parallelogram's area by the shoelace rule, against the cross product
    poly = np.array([[0, 0], [bx, 0], [bx + ax_, ay], [ax_, ay]])
    shoelace = 0.5 * abs(sum(poly[i, 0] * poly[(i + 1) % 4, 1]
                             - poly[(i + 1) % 4, 0] * poly[i, 1] for i in range(4)))
    assert abs(shoelace - np.linalg.norm(np.cross(VA, VB))) < 1e-11, shoelace

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.4, 3.9))
    for ax in (a1, a2):
        blank(ax)
        ax.set_xlim(-1.2, 13.4)
        ax.set_ylim(-2.6, 6.6)

    arrow(a1, (0, 0), (bx, 0), c[0])
    arrow(a1, (0, 0), (ax_, ay), c[1])
    a1.plot([ax_, ax_], [0, ay], color=S.GUIDE[mode], lw=1.0, ls="--")
    arrow(a1, (0, -1.5), (ax_, -1.5), S.GUIDE[mode], lw=1.4, head=7.0)
    S.label_end(a1, bx, 0.0, "$\\mathbf{B}$, length 7", c[0], mode, dx=6, dy=-8)
    S.label_end(a1, ax_, ay, "$\\mathbf{A}$, length 7", c[1], mode, dx=4, dy=8)
    S.note(a1, 0.1, -2.4, "projection  36/7 = 5.143", mode)
    S.note(a1, 1.35, 0.22, "42.72°", mode)
    a1.set_title("Dot: how much of A lies along B")

    a2.add_patch(Polygon(poly, closed=True, facecolor=c[2], alpha=0.22,
                         edgecolor="none"))
    arrow(a2, (0, 0), (bx, 0), c[0])
    arrow(a2, (0, 0), (ax_, ay), c[1])
    a2.plot([bx, bx + ax_], [0, ay], color=S.GRID[mode], lw=1.2)
    a2.plot([ax_, bx + ax_], [ay, ay], color=S.GRID[mode], lw=1.2)
    a2.plot([0, ax_], [ay, ay], color=S.GUIDE[mode], lw=1.0, ls="--")
    a2.annotate("", xy=(-0.55, ay), xytext=(-0.55, 0.0),
                arrowprops=dict(arrowstyle="<->", color=S.GUIDE[mode], lw=0.9))
    S.note(a2, 8.4, 2.2, "area 33.24", mode)
    S.note(a2, -1.15, ay / 2, "height\n4.749", mode, ha="right", va="center")
    a2.set_title("Cross: the area A and B sweep out")
    fig.tight_layout()
    return fig


@figure("math6-va-gradient")
def _(mode):
    """Level curves with the gradient across them, and the cosine law for D_u f."""
    c = S.SERIES[mode]
    f = lambda X, Y: X ** 2 + 4 * Y ** 2
    g = grad_num(lambda p: p[0] ** 2 + 4 * p[1] ** 2, [3.0, 1.0])
    assert np.allclose(g, [6.0, 8.0], atol=1e-6), g
    assert abs(np.linalg.norm(g) - 10.0) < 1e-6
    assert abs(f(3.0, 1.0) - 13.0) < 1e-12

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.4, 3.9))
    xs = np.linspace(-4.4, 4.4, 400)
    ys = np.linspace(-2.6, 2.6, 400)
    X, Y = np.meshgrid(xs, ys)
    a1.contour(X, Y, f(X, Y), levels=[1, 4, 8, 13, 20, 28], colors=S.GRID[mode],
               linewidths=1.1)
    step = 1.6
    for gx in np.arange(-3.2, 3.3, step):
        for gy in np.arange(-1.6, 1.7, step):
            if abs(gx) + abs(gy) < 0.2:
                continue
            v = np.array([2 * gx, 8 * gy]) * 0.055
            arrow(a1, (gx, gy), (gx + v[0], gy + v[1]), c[0], lw=1.2, head=6.0)
    arrow(a1, (3.0, 1.0), (3.0 + 0.6, 1.0 + 0.8), c[1], lw=2.4)
    a1.plot([3.0 - 0.9, 3.0 + 0.9], [1.0 + 0.675, 1.0 - 0.675], color=c[2], lw=2.0)
    a1.plot([3.0], [1.0], "o", color=S.INK[mode], ms=5)
    S.note(a1, 2.5, 2.15, "∇f = (6, 8)", mode, ha="center")
    S.note(a1, 4.15, 0.05, "tangent", mode, ha="center", size=8.5)
    a1.set_xlim(-4.8, 5.6)
    a1.set_ylim(-2.9, 3.1)
    a1.set_aspect("equal")
    a1.set_xlabel("x")
    a1.set_ylabel("y")
    a1.set_title("Gradient ⊥ level curve")
    S.strip(a1)

    phi = np.linspace(0, 360, 721)
    a2.plot(phi, 10 * np.cos(np.radians(phi)), color=c[0], lw=2.1)
    a2.axhline(0.0, color=S.GUIDE[mode], lw=1.0, ls="--")
    for ang, txt in ((0, "steepest ascent, +10"), (90, "along the level curve, 0"),
                     (180, "steepest descent, −10")):
        a2.plot([ang], [10 * np.cos(np.radians(ang))], "o", color=c[1], ms=6)
        S.note(a2, ang + 6, 10 * np.cos(np.radians(ang)) + 0.6, txt, mode, size=8.5)
    a2.plot([60], [5.0], "o", color=c[2], ms=6)
    S.note(a2, 66, 5.4, "60° off, exactly half", mode, size=8.5)
    a2.set_xlim(0, 400)
    a2.set_ylim(-12.6, 13.4)
    a2.set_xticks([0, 90, 180, 270, 360])
    a2.set_xlabel("angle between the direction and ∇f  (deg)")
    a2.set_ylabel("directional derivative")
    a2.set_title("Every direction is a cosine")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("math6-va-shrinking-limits")
def _(mode):
    """Flux per unit volume and circulation per unit area, measured as the box shrinks."""
    c = S.SERIES[mode]
    hs = np.array([0.4, 0.3, 0.2, 0.15, 0.1, 0.075, 0.05])
    dens, circ = [], []
    for h in hs:
        fl = flux_cube(FIELD, PT, float(h))
        cz = circ_square(FIELD, PT, float(h))
        assert abs(fl / h ** 3 - (14.0 + h * h / 12.0)) < 1e-9, (h, fl / h ** 3)
        assert abs(cz / h ** 2 - (-1.0 - h * h / 12.0)) < 1e-9, (h, cz / h ** 2)
        dens.append(fl / h ** 3)
        circ.append(cz / h ** 2)

    fine = np.linspace(0.0, 0.44, 300)
    fig, (a1, a2) = plt.subplots(2, 1, figsize=(7.2, 6.0))
    a1.plot(fine, 14.0 + fine ** 2 / 12.0, color=S.GUIDE[mode], lw=1.4, ls="--")
    a1.plot(hs, dens, "o", color=c[0], ms=7)
    a1.axhline(14.0, color=c[1], lw=1.6)
    S.label_end(a1, 0.455, 14.0, "div F = 14", c[1], mode, dy=9)
    S.note(a1, 0.16, 14.0135, "measured flux/volume, and the exact $14 + h^2/12$", mode,
           size=9)
    a1.set_xlim(0, 0.56)
    a1.set_ylim(13.995, 14.018)
    a1.set_xlabel("cube edge  h")
    a1.set_ylabel("flux ÷ volume")
    a1.set_title("Divergence is what flux per unit volume converges to")
    S.strip(a1)

    a2.plot(fine, -1.0 - fine ** 2 / 12.0, color=S.GUIDE[mode], lw=1.4, ls="--")
    a2.plot(hs, circ, "o", color=c[0], ms=7)
    a2.axhline(-1.0, color=c[1], lw=1.6)
    S.label_end(a2, 0.42, -1.0, "curl F · k = −1", c[1], mode, dy=9)
    S.note(a2, 0.16, -1.0155, "measured circulation/area, and the exact $-1 - h^2/12$",
           mode, size=9)
    a2.set_xlim(0, 0.56)
    a2.set_ylim(-1.018, -0.9955)
    a2.set_xlabel("square edge  h")
    a2.set_ylabel("circulation ÷ area")
    a2.set_title("Curl is what circulation per unit area converges to")
    S.strip(a2)
    fig.tight_layout()
    return fig


@figure("math6-va-frenet")
def _(mode):
    """The moving frame on a helix, with curvature and torsion measured from it."""
    c = S.SERIES[mode]
    # The drawing point is chosen so that T, N and B project to three clearly
    # separate screen directions; at t = 0.7 the inward normal runs almost along
    # the camera's forward axis and reads as pointing straight up.
    t0 = 3.6
    d1 = (HELIX(t0 + 1e-4) - HELIX(t0 - 1e-4)) / 2e-4
    d2 = (HELIX(t0 + 1e-3) - 2 * HELIX(t0) + HELIX(t0 - 1e-3)) / 1e-6
    T = d1 / np.linalg.norm(d1)
    N = d2 / np.linalg.norm(d2)
    B = np.cross(T, N)
    kappa = np.linalg.norm(np.cross(d1, d2)) / np.linalg.norm(d1) ** 3
    assert abs(kappa - 0.12) < 1e-6, kappa
    assert abs(float(T @ N)) < 1e-6 and abs(float(T @ B)) < 1e-9
    assert abs(np.linalg.norm(d1) - 5.0) < 1e-7

    ts = np.linspace(t0 - 1.05, t0 + 1.05, 900)
    curve = np.array([HELIX(t) for t in ts])
    base = HELIX(t0)
    ring = np.array([[HA * np.cos(t), HA * np.sin(t), base[2]]
                     for t in np.linspace(0, 2 * np.pi, 400)])
    axis_lo = np.array([0.0, 0.0, float(curve[:, 2].min()) - 1.6])
    axis_hi = np.array([0.0, 0.0, float(curve[:, 2].max()) + 1.6])
    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    blank(ax)
    frame = [(T, c[1], "T"), (N, c[2], "N"), (B, S.INK_2[mode], "B")]
    pts = [axo(curve), axo(ring), axo(np.stack([axis_lo, axis_hi]))]
    pts += [axo(np.atleast_2d(base + 4.4 * v)) for v, _, _ in frame]
    cloud = np.concatenate([np.stack([a, b], 1) for a, b in pts])
    fit(ax, cloud, pad=0.10, extra_top=0.34, extra_left=0.34)

    ax.plot(*axo(np.stack([axis_lo, axis_hi])), color=S.GRID[mode], lw=1.2, ls="--")
    ax.plot(*axo(ring), color=S.GRID[mode], lw=1.1, ls=":")
    ax.plot(*axo(np.stack([np.array([0.0, 0.0, base[2]]), base])),
            color=S.GRID[mode], lw=1.0)
    ax.plot(*axo(curve), color=c[0], lw=2.4)
    for vec, colour, name in frame:
        arrow(ax, axo(base), axo(base + 3.2 * vec), colour, lw=2.2)
        px, py = axo(base + 4.0 * vec)
        S.note(ax, px, py, name, mode, ha="center", va="center", size=11.5)
    bx, by = axo(base)
    ax.plot([bx], [by], "o", color=S.INK[mode], ms=5)
    ax_x, ax_y = axo(axis_lo)
    S.note(ax, ax_x, ax_y - 0.9, "helix axis", mode, ha="center", va="top", size=9)
    rgx, rgy = axo(ring)
    k = int(np.argmin(rgx))
    S.note(ax, rgx[k] - 0.45, rgy[k], "cross-section,\nradius 3", mode, ha="right",
           va="center", size=9)
    corner(ax, mode,
           "r(t) = (3 cos t, 3 sin t, 4t)\n"
           "speed 5,  curvature 0.12,  torsion 0.16\n"
           "radius of curvature 1/0.12 = 8.333\n"
           "frame drawn at t = 3.6; the ring is the\n"
           "cross-section N points into")
    ax.set_title("The frame a curve carries with it")
    return fig


@figure("math6-va-path-work")
def _(mode):
    """Three paths, one pair of fields: when the route matters and when it does not."""
    c = S.SERIES[mode]
    straight = lambda t: np.array([t, t])
    parab = lambda t: np.array([t, t * t])
    w_swirl = [line_int(SWIRL, straight), line_int(SWIRL, parab),
               line_int(SWIRL, lambda t: np.array([t, 0.0]))
               + line_int(SWIRL, lambda t: np.array([1.0, t]))]
    w_grad = [line_int(GRADFIELD, straight), line_int(GRADFIELD, parab),
              line_int(GRADFIELD, lambda t: np.array([t, 0.0]))
              + line_int(GRADFIELD, lambda t: np.array([1.0, t]))]
    assert abs(w_swirl[0] - 1.5) < 1e-10, w_swirl
    assert abs(w_swirl[1] - 5.0 / 3.0) < 1e-10, w_swirl
    assert abs(w_swirl[2] - 2.0) < 1e-10, w_swirl
    for w in w_grad:
        assert abs(w - 1.0) < 1e-10, w_grad

    tt = np.linspace(0, 1, 200)
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.4, 4.0))
    for ax, works, title, sub in (
        (a1, w_swirl, "F = (y, 2x): curl 1, route matters", "three different answers"),
        (a2, w_grad, "F = (2xy, x²): curl 0, route free", "one answer, three times"),
    ):
        blank(ax)
        ax.set_xlim(-0.34, 1.62)
        ax.set_ylim(-0.30, 1.34)
        arrow(ax, (-0.2, 0), (1.35, 0), S.GRID[mode], lw=1.1, head=7.0)
        arrow(ax, (0, -0.2), (0, 1.2), S.GRID[mode], lw=1.1, head=7.0)
        ax.plot(tt, tt, color=c[0], lw=2.2)
        ax.plot(tt, tt ** 2, color=c[1], lw=2.2)
        ax.plot([0, 1, 1], [0, 0, 1], color=c[2], lw=2.2)
        ax.plot([0, 1], [0, 1], "o", color=S.INK[mode], ms=5)
        S.note(ax, -0.05, -0.16, "(0, 0)", mode, size=9)
        S.note(ax, 1.02, 1.04, "(1, 1)", mode, size=9)
        S.label_end(ax, 0.55, 0.60, f"line  {works[0]:.4f}", c[0], mode, size=9)
        S.label_end(ax, 0.74, 0.50, f"parabola  {works[1]:.4f}", c[1], mode, size=9,
                    dy=-12)
        S.label_end(ax, 1.0, 0.20, f"corner  {works[2]:.4f}", c[2], mode, size=9)
        ax.set_title(title)
        S.note(ax, -0.3, 1.24, sub, mode, size=9)
    fig.tight_layout()
    return fig


@figure("math6-va-green")
def _(mode):
    """Green's theorem on the region between y = x² and y = x, both sides computed."""
    c = S.SERIES[mode]
    Fg = lambda p: np.array([p[0] * p[1], p[0] ** 2])
    around = (line_int(Fg, lambda t: np.array([t, t * t]))
              + line_int(Fg, lambda t: np.array([1 - t, 1 - t])))
    inside = integrate.dblquad(lambda y, x: x, 0, 1, lambda x: x * x, lambda x: x,
                               epsabs=1e-13)[0]
    assert abs(around - 1.0 / 12.0) < 1e-10, around
    assert abs(inside - 1.0 / 12.0) < 1e-12, inside
    assert abs(around - inside) < 1e-10

    tt = np.linspace(0, 1, 300)
    fig, ax = plt.subplots(figsize=(7.2, 4.4))
    blank(ax)
    ax.set_xlim(-0.30, 1.72)
    ax.set_ylim(-0.30, 1.42)
    band = np.concatenate([np.stack([tt, tt ** 2], 1),
                           np.stack([tt[::-1], tt[::-1]], 1)])
    ax.add_patch(Polygon(band, closed=True, facecolor=c[2], alpha=0.20,
                         edgecolor="none"))
    arrow(ax, (-0.18, 0), (1.28, 0), S.GRID[mode], lw=1.1, head=7.0)
    arrow(ax, (0, -0.18), (0, 1.20), S.GRID[mode], lw=1.1, head=7.0)
    ax.plot(tt, tt ** 2, color=c[0], lw=2.3)
    ax.plot(tt, tt, color=c[1], lw=2.3)
    for s in (0.34, 0.66, 0.92):
        arrow(ax, (s - 0.11, (s - 0.11) ** 2), (s + 0.02, (s + 0.02) ** 2), c[0],
              lw=2.3, head=11.0)
        arrow(ax, (s + 0.02, s + 0.02), (s - 0.11, s - 0.11), c[1], lw=2.3, head=11.0)
    ax.plot([0, 1], [0, 1], "o", color=S.INK[mode], ms=5)
    S.label_end(ax, 1.0, 1.0, "back along  y = x", c[1], mode, dy=9)
    S.label_end(ax, 1.0, 1.0, "out along  y = x²", c[0], mode, dy=-12)
    S.note(ax, 0.70, 0.20,
           "counterclockwise:\nthe region stays\non the left", mode, size=9)
    corner(ax, mode,
           f"∮ (xy dx + x² dy) = {around:.6f}\n∬ x dA = {inside:.6f}", size=9.5)
    ax.set_title("Green's theorem, with both sides evaluated numerically")
    return fig


@figure("math6-va-stokes")
def _(mode):
    """Stokes' theorem on the first-octant triangle of x + y + z = 1."""
    c = S.SERIES[mode]
    Fs = lambda p: np.array([p[1], p[2], p[0]])
    tri = [np.array([1.0, 0, 0]), np.array([0, 1.0, 0]), np.array([0, 0, 1.0])]
    loop = 0.0
    for k in range(3):
        a, b = tri[k], tri[(k + 1) % 3]
        loop += line_int(Fs, lambda t, a=a, b=b: a + t * (b - a))
    n = np.ones(3) / np.sqrt(3.0)
    area = 0.5 * float(np.linalg.norm(np.cross(tri[1] - tri[0], tri[2] - tri[0])))
    cap = float(np.array([-1.0, -1.0, -1.0]) @ n) * area
    assert abs(loop + 1.5) < 1e-10, loop
    assert abs(cap + 1.5) < 1e-12, cap
    assert abs(loop - cap) < 1e-10

    # A flatter camera than the house one: at the standard elevation the unit
    # normal of x + y + z = 1 points almost straight at the viewer and projects
    # to a dot. Dropping the elevation keeps the triangle open AND the normal
    # visible, which is the one thing this drawing has to show.
    cam = dict(el=15.0)
    proj = lambda p: axo(p, **cam)
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    blank(ax)
    axis_ends = [np.array([1.55, 0, 0]), np.array([0, 1.55, 0]), np.array([0, 0, 1.55])]
    centroid = sum(tri) / 3.0
    cloud = np.array([proj(v) for v in
                      axis_ends + tri + [centroid + 1.05 * n, np.zeros(3)]])
    fit(ax, cloud, pad=0.10, extra_top=0.40, extra_left=0.10)
    for vec, name in zip(axis_ends, "xyz"):
        arrow(ax, proj(np.zeros(3)), proj(vec), S.GRID[mode], lw=1.2, head=7.0)
        px, py = proj(vec * 1.10)
        S.note(ax, px, py, name, mode, size=9, ha="center", va="center")
    px, py = proj(np.array(tri))
    ax.add_patch(Polygon(np.stack([px, py], 1), closed=True, facecolor=c[2],
                         alpha=0.22, edgecolor="none"))
    for k in range(3):
        a, b = tri[k], tri[(k + 1) % 3]
        arrow(ax, proj(a), proj(b), c[0], lw=2.1)
        mid = a + 0.5 * (b - a)
        arrow(ax, proj(mid - 0.07 * (b - a)), proj(mid + 0.07 * (b - a)), c[0], lw=2.1,
              head=12.0)
    arrow(ax, proj(centroid), proj(centroid + 0.80 * n), c[1], lw=2.3)
    nx, ny = proj(centroid + 1.30 * n)
    S.note(ax, nx, ny, "n = (1, 1, 1)/√3", mode, ha="center", va="bottom", size=9)
    corner(ax, mode,
           f"F = (y, z, x),  curl F = (−1, −1, −1)\ntriangle area √3/2 = 0.866025\n"
           f"∮ F · dr = {loop:.6f}\n∬ (curl F) · n dS = {cap:.6f}")
    ax.set_title("Stokes' theorem: the rim and the cap agree")
    return fig


@figure("math6-va-divergence")
def _(mode):
    """The divergence theorem on a cylinder, both sides computed."""
    c = S.SERIES[mode]
    R, H = 2.0, 5.0
    side = integrate.dblquad(lambda z, t: R * R, 0, 2 * np.pi, 0, H, epsabs=1e-12)[0]
    body = integrate.dblquad(lambda r, z: 2.0 * r * 2 * np.pi, 0, H, 0, R,
                             epsabs=1e-12)[0]
    assert abs(side - 40 * np.pi) < 1e-9, side
    assert abs(body - 40 * np.pi) < 1e-9, body

    th = np.linspace(0, 2 * np.pi, 400)
    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    blank(ax)
    top = np.stack([R * np.cos(th), R * np.sin(th), np.full_like(th, H)], 1)
    bot = np.stack([R * np.cos(th), R * np.sin(th), np.zeros_like(th)], 1)
    tips = np.array([[(R + 0.9) * np.cos(a), (R + 0.9) * np.sin(a), z]
                     for a in np.linspace(0, 2 * np.pi, 13) for z in (0.0, H)])
    cloud = np.concatenate([np.stack(axo(top), 1), np.stack(axo(bot), 1),
                            np.stack(axo(tips), 1),
                            np.atleast_2d(axo(np.array([0.0, 0.0, H * 1.34])))])
    fit(ax, cloud, pad=0.09, extra_top=0.26, extra_left=0.42)
    ax.plot(*axo(bot), color=S.GRID[mode], lw=1.4)
    ax.plot(*axo(top), color=S.GRID[mode], lw=1.4)
    # the silhouette generators: screen-x of (R cos t, R sin t) is extremal at
    # t = az and t = az + pi, so the outline is fixed by the camera, not guessed
    for a in (np.radians(CAM_AZ), np.radians(CAM_AZ) + np.pi):
        p0 = np.array([R * np.cos(a), R * np.sin(a), 0.0])
        p1 = np.array([R * np.cos(a), R * np.sin(a), H])
        ax.plot(*axo(np.stack([p0, p1])), color=S.GRID[mode], lw=1.4)
    for a in np.linspace(0, 2 * np.pi, 13)[:-1]:
        for zz in (1.0, 2.5, 4.0):
            base = np.array([R * np.cos(a), R * np.sin(a), zz])
            tip = base + np.array([0.9 * np.cos(a), 0.9 * np.sin(a), 0.0])
            arrow(ax, axo(base), axo(tip), c[0], lw=1.5, head=7.0)
    arrow(ax, axo(np.zeros(3)), axo(np.array([0.0, 0.0, H * 1.26])), S.GRID[mode],
          lw=1.1, head=7.0)
    zx, zy = axo(np.array([0.0, 0.0, H * 1.34]))
    S.note(ax, zx, zy, "z", mode, size=9, ha="center", va="center")
    corner(ax, mode,
           f"F = x i + y j,  div F = 2\nR = 2 m,  h = 5 m\n"
           f"∯ F · n dS = {side:.4f}\n∭ 2 dV = {body:.4f}\n\n"
           "the flat ends contribute\nnothing: F has no\nz-component")
    ax.set_title("The divergence theorem on a cylinder")
    return fig


@figure("math6-va-coordinates")
def _(mode):
    """The cylindrical and spherical frames at one concrete point."""
    c = S.SERIES[mode]
    x, y, z = 3.0, 4.0, 5.0
    rho = np.hypot(x, y)
    r = np.sqrt(x * x + y * y + z * z)
    assert abs(rho - 5.0) < 1e-12
    assert abs(np.degrees(np.arctan2(y, x)) - 53.130102) < 1e-6
    assert abs(np.degrees(np.arccos(z / r)) - 45.0) < 1e-9
    cph, sph = x / rho, y / rho
    assert abs((3.0 * cph + 4.0 * sph) - 5.0) < 1e-12
    assert abs(-3.0 * sph + 4.0 * cph) < 1e-12

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(7.4, 4.1))
    blank(a1)
    a1.set_xlim(-1.2, 7.4)
    a1.set_ylim(-1.6, 6.4)
    arrow(a1, (0, 0), (6.6, 0), S.GRID[mode], lw=1.1, head=7.0)
    arrow(a1, (0, 0), (0, 5.9), S.GRID[mode], lw=1.1, head=7.0)
    S.note(a1, 6.7, -0.1, "x", mode, size=9)
    S.note(a1, 0.1, 6.0, "y", mode, size=9)
    arc = np.linspace(0, np.arctan2(y, x), 120)
    a1.plot(1.6 * np.cos(arc), 1.6 * np.sin(arc), color=S.GUIDE[mode], lw=1.1)
    a1.plot(rho * np.cos(np.linspace(0, np.pi / 2, 200)),
            rho * np.sin(np.linspace(0, np.pi / 2, 200)), color=S.GRID[mode], lw=1.1,
            ls="--")
    arrow(a1, (0, 0), (x, y), S.INK_2[mode], lw=1.8)
    arrow(a1, (x, y), (x + 1.7 * cph, y + 1.7 * sph), c[0], lw=2.2)
    arrow(a1, (x, y), (x - 1.7 * sph, y + 1.7 * cph), c[1], lw=2.2)
    a1.plot([x], [y], "o", color=S.INK[mode], ms=5)
    S.note(a1, x + 1.95 * cph, y + 1.95 * sph, "$\\mathbf{a}_\\rho$", mode, size=11)
    S.note(a1, x - 2.15 * sph - 0.25, y + 1.95 * cph, "$\\mathbf{a}_\\varphi$", mode,
           size=11)
    S.note(a1, 1.75, 0.55, "φ = 53.13°", mode, size=9)
    S.note(a1, 0.35, 2.55, "ρ = 5", mode, size=9, ha="right")
    a1.set_title("Cylindrical frame at (3, 4)")

    blank(a2)
    # Another camera the geometry forces: from the house azimuth the position
    # vector (3, 4, 5) runs within 13 degrees of the line of sight and projects
    # to a stub. Viewing from the +x, -y side opens it out.
    proj = lambda q: axo(q, az=60.0, el=22.0)
    p = np.array([x, y, z])
    axis_ends = [np.array([6.2, 0, 0]), np.array([0, 6.6, 0]), np.array([0, 0, 7.2])]
    for vec, name in zip(axis_ends, "xyz"):
        arrow(a2, proj(np.zeros(3)), proj(vec), S.GRID[mode], lw=1.2, head=7.0)
        px, py = proj(vec * 1.10)
        S.note(a2, px, py, name, mode, size=9, ha="center", va="center")
    arrow(a2, proj(np.zeros(3)), proj(p), S.INK_2[mode], lw=1.8)
    a2.plot(*proj(np.stack([np.array([x, y, 0.0]), p])), color=S.GRID[mode], lw=1.0,
            ls="--")
    a2.plot(*proj(np.stack([np.zeros(3), np.array([x, y, 0.0])])), color=S.GRID[mode],
            lw=1.0, ls="--")
    ar = p / r
    ath = np.array([np.cos(np.arccos(z / r)) * cph, np.cos(np.arccos(z / r)) * sph,
                    -np.sin(np.arccos(z / r))])
    aph = np.array([-sph, cph, 0.0])
    assert abs(float(ar @ ath)) < 1e-12 and abs(float(ar @ aph)) < 1e-12
    assert np.allclose(np.cross(ar, ath), aph, atol=1e-12)
    frame = ((ar, c[0], "$\\mathbf{a}_r$"), (ath, c[1], "$\\mathbf{a}_\\theta$"),
             (aph, c[2], "$\\mathbf{a}_\\varphi$"))
    for vec, colour, name in frame:
        arrow(a2, proj(p), proj(p + 2.4 * vec), colour, lw=2.2)
        px, py = proj(p + 3.1 * vec)
        S.note(a2, px, py, name, mode, ha="center", va="center", size=11)
    cloud = np.array([proj(v) for v in
                      axis_ends + [np.zeros(3), np.array([x, y, 0.0])]
                      + [p + 3.4 * v for v, _, _ in frame]])
    fit(a2, cloud, pad=0.10, extra_top=0.16)
    corner(a2, mode, "r = √50 = 7.071\nθ = 45°,  φ = 53.13°")
    a2.set_title("Spherical frame at (3, 4, 5)")
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
