# AXIOM Calculus III: Complete Lessons

Course C3, 16 lessons across 5 units, in the AXIOM teaching arc.

---

## Unit 1. Vectors and Space

### C301. Vectors, dot and cross products

Objective: compute dot and cross products and use them for angles, areas,
and perpendicularity.

Build on: 2D vector arithmetic; this lesson adds the third dimension and the
two products.

Core idea: the dot product u . v = |u||v| cos(theta) is a scalar measuring
alignment: zero means perpendicular. The cross product u x v is a vector
perpendicular to both, with length |u||v| sin(theta), the area of their
parallelogram, and direction by the right-hand rule. Dot for angles and
projections, cross for normals and areas.

Worked example: u = (1, 2, 2), v = (2, 1, -2): u . v = 0, perpendicular. Their
cross product (-6, 6, -3) is perpendicular to both, as a dot-product check
confirms.

Try it: what is (1, 0, 0) x (0, 1, 0)?

Answer: (0, 0, 1), by the right-hand rule.

Pitfall: the cross product is a vector and anticommutes: v x u = -(u x v).
Reporting a scalar, or ignoring the order, is a type error.

### C302. Lines, planes, and surfaces

Objective: write equations of lines and planes and recognize the standard
quadric surfaces.

Build on: C301; normals and direction vectors are the ingredients.

Core idea: a line needs a point and a direction: r(t) = P + t v. A plane
needs a point and a normal: n . (r - P) = 0, expanding to
ax + by + cz = d with n = (a, b, c). Quadric surfaces (spheres, ellipsoids,
paraboloids, cones, hyperboloids) are recognized from their equations by
which variables are squared and with what signs.

Worked example: the plane through (1, 0, 2) with normal (3, -1, 4):
3x - y + 4z = 11.

Try it: what surface is z = x^2 + y^2?

Answer: a circular paraboloid opening upward.

Pitfall: reading the coefficients of a plane as a point on it. They are the
normal direction; the point comes from d.

### C303. Vector functions and curves

Objective: differentiate parametrized curves; compute velocity, speed, and
arc length.

Build on: C110 componentwise; a vector function is three scalar functions in
formation.

Core idea: r(t) = (x(t), y(t), z(t)) traces a curve; r'(t) is the velocity
(tangent) vector, its magnitude the speed, and arc length integrates speed.
All the single-variable rules apply per component, plus product rules for
dot and cross.

Worked example: the helix r = (cos t, sin t, t): velocity (-sin t, cos t, 1),
speed sqrt(2), so length over one turn is 2 pi sqrt(2).

Try it: what is the velocity of r(t) = (t^2, 3t, 1) at t = 1?

Answer: (2, 3, 0).

Pitfall: speed is the magnitude of velocity, not the derivative of distance
formulae mixed per component. Differentiate first, then take the magnitude.

## Unit 2. Partial Derivatives

### C304. Partial derivatives

Objective: compute first and higher partials, holding the other variables
constant.

Build on: C110; each partial is a single-variable derivative in disguise.

Core idea: f_x differentiates in x with y frozen as a constant; f_y reverses
the roles. Higher partials iterate, and for the smooth functions of this
course the mixed partials agree: f_xy = f_yx (Clairaut), a free check on
every computation.

Worked example: f = x^2 y + y^3: f_x = 2xy, f_y = x^2 + 3y^2, and both mixed
partials are 2x.

Try it: f = x^3 y^2: compute f_xy.

Answer: 6 x^2 y, and f_yx agrees.

Pitfall: differentiating every variable at once (C3M01). While computing
f_x, the letter y is as constant as the number 7; the template verifier
checks numerically in each direction separately.

### C305. Tangent planes and linearization

Objective: build tangent planes and use them as multivariable linear
approximations.

Build on: C112, promoted one dimension.

Core idea: at (a, b) the tangent plane to z = f(x, y) is z = f(a, b) +
f_x(a, b)(x - a) + f_y(a, b)(y - b): one slope per direction. As in C112, the
plane doubles as the linear approximation, and the total differential
dz = f_x dx + f_y dy propagates small errors in two inputs at once, the
two-variable version of every lab's uncertainty budget.

Worked example: f = x^2 y at (1, 2): plane z = 2 + 4(x - 1) + 1(y - 2), so
f(1.1, 1.9) is approximately 2.3.

Try it: for f = xy at (2, 3), what is the tangent plane?

Answer: z = 6 + 3(x - 2) + 2(y - 3).

Pitfall: evaluating the partials at a general point instead of at (a, b).
The plane's coefficients are numbers, not functions; freeze them.

### C306. The multivariable chain rule

Objective: differentiate through chains of dependence, including implicit
relations.

Build on: C108 and C304 combined.

Core idea: when z depends on x and y, which depend on t: dz/dt =
f_x dx/dt + f_y dy/dt: one term per path of dependence, summed. Draw the
dependence tree; each route from z to the bottom variable contributes a
product of derivatives. The implicit special case: dy/dx = -F_x/F_y for
F(x, y) = 0, which quietly re-derives C109.

Worked example: z = x^2 y, x = cos t, y = t^2: dz/dt = 2xy(-sin t) +
x^2 (2t).

Try it: how many terms does dw/dt have if w = f(x, y, z) and all three
depend on t?

Answer: three, one per path.

Pitfall: missing a path. Every variable the function touches that also moves
contributes a term; the tree is the bookkeeping that prevents the omission.

### C307. Gradient and directional derivatives

Objective: compute gradients and derivatives in arbitrary directions;
interpret the gradient geometrically.

Build on: C304; the gradient packages the partials.

Core idea: grad f = (f_x, f_y) is a vector field. The derivative of f in the
direction of unit vector u is grad f . u, maximized when u points along the
gradient: the gradient is the direction of steepest ascent, with magnitude
equal to that steepest rate, and it is perpendicular to level curves. This
one object drives optimization, physics (force from potential), and every
gradient-descent algorithm.

Worked example: f = x^2 + xy at (1, 2): grad f = (4, 1). In the direction
(3, 4)/5 the derivative is (12 + 4)/5 = 16/5.

Try it: in which direction does f decrease fastest at that point?

Answer: along -(4, 1), the negative gradient.

Pitfall: the gradient is a vector, not a number (C3M02), and directions must
be unit vectors before dotting (C3M03): both errors silently rescale the
answer.

## Unit 3. Multivariable Optimization

### C308. Critical points and the second derivative test

Objective: find and classify critical points with the Hessian discriminant.

Build on: C114 and C307; critical points are where the gradient vanishes.

Core idea: solve grad f = 0, then compute D = f_xx f_yy - (f_xy)^2 at each
point: D > 0 with f_xx > 0 is a minimum, D > 0 with f_xx < 0 a maximum,
D < 0 a saddle, D = 0 silence. The mixed partial matters: two positive pure
second derivatives cannot certify a minimum alone.

Worked example: f = x^2 + 3xy + y^2 at the origin: D = 2*2 - 9 = -5: a
saddle, despite f_xx = f_yy = 2 > 0. That is diagnostic item C3-D2 in the
flesh.

Try it: classify the origin for f = x^2 + y^2 - 4xy... compute D.

Answer: D = 4 - 16 = -12: saddle.

Pitfall: importing the 1D test (C3M04): checking f_xx and f_yy separately
skips exactly the term that creates saddles.

### C309. Lagrange multipliers

Objective: optimize a function subject to a constraint via gradient
alignment.

Build on: C307's geometry of gradients and level curves.

Core idea: at a constrained optimum, the level curve of f is tangent to the
constraint curve g = c, so their gradients are parallel: grad f =
lambda grad g. Solve that system together with the constraint. The multiplier
lambda is not waste output: it is the sensitivity of the optimum to the
constraint level, the shadow price in economics and the origin of half the
lambdas in physics.

Worked example: maximize xy on x + y = 10: (y, x) = lambda (1, 1) forces
x = y = 5, product 25.

Try it: minimize x^2 + y^2 on x + y = 4.

Answer: x = y = 2, value 8: the closest point of the line to the origin.

Pitfall: solving grad f = lambda grad g and forgetting the constraint
equation itself. It is a system of three equations; the constraint is the
third.

## Unit 4. Multiple Integrals

### C310. Double integrals

Objective: evaluate iterated integrals over rectangles and general regions.

Build on: C118 applied twice; C207's region-reading skills.

Core idea: a double integral is two ordinary integrals nested: integrate in
x holding y constant, then in y (or the reverse: Fubini guarantees the
orders agree, a fact the template verifier exploits as its independent
check). Over general regions the inner bounds become functions of the outer
variable; drawing the region is how those bounds are read.

Worked example: int over [0, 1] x [0, 2] of xy dA: inner int xy dx = y/2,
outer int y/2 dy from 0 to 2 = 1.

Try it: integrating over the triangle with vertices (0,0), (1,0), (1,1) in
dx-then-dy order (x outer): what are the inner y-bounds?

Answer: y from 0 to x.

Pitfall: bounds that do not describe the region (C3M05): the rectangle
habit applied to triangles. Sketch first; the sketch writes the bounds.

### C311. Polar double integrals

Objective: convert double integrals to polar coordinates with the Jacobian
factor.

Build on: C310; circles are rectangles in the right coordinates.

Core idea: over disks, annuli, and sectors, substitute x = r cos(theta),
y = r sin(theta), and, critically, dA = r dr d(theta): the extra r is the
Jacobian, the area of a polar grid cell. Radial symmetry then collapses
integrals that are miserable in Cartesian coordinates.

Worked example: int of e^(-(x^2 + y^2)) over the whole plane: in polar,
int r e^(-r^2) dr d(theta) = pi: the squared Gaussian integral, the most
famous polar conversion in mathematics.

Try it: the area of the unit disk as a polar double integral.

Answer: int from 0 to 2 pi int from 0 to 1 of r dr d(theta) = pi.

Pitfall: dropping the r (C3M06), which is diagnostic item C3-D1 verbatim.
Without the Jacobian the disk has area 2 pi and everything downstream is
quietly wrong.

### C312. Triple integrals

Objective: compute volume and density integrals in Cartesian, cylindrical,
and spherical coordinates.

Build on: C311; the same change-of-coordinates discipline, one dimension up.

Core idea: triple integrals nest three ordinary ones. Cylindrical
coordinates bolt polar onto z (dV = r dz dr d(theta)); spherical coordinates
suit balls and cones (dV = rho^2 sin(phi) d(rho) d(phi) d(theta)). Choose
the system whose grid matches the region's symmetry, and the bounds become
constants.

Worked example: the volume of a ball of radius R in spherical: int rho^2
sin(phi) with rho to R, phi to pi, theta to 2 pi gives (4/3) pi R^3.

Try it: what is dV in cylindrical coordinates?

Answer: r dz dr d(theta).

Pitfall: the spherical Jacobian rho^2 sin(phi) (C3M06 again, upgraded), and
mixing phi conventions. State which angle is which before integrating.

## Unit 5. Vector Calculus

### C313. Vector fields

Objective: interpret vector fields and compute divergence and curl.

Build on: C307; the gradient was the first vector field.

Core idea: a vector field attaches a vector to every point: wind maps, force
fields, fluid velocity. Two derivatives summarize local behavior: divergence
(a scalar: net outflow per volume, sources positive) and curl (a vector:
local rotation, right-hand rule). Gradient fields are the conservative ones,
flagged by curl zero, and they get a special theorem next lesson.

Worked example: F = (x, y) has divergence 2 (everything flows outward) and
curl 0; G = (-y, x) has divergence 0 and curl 2k (pure rotation).

Try it: compute the divergence of F = (x^2, y^2, z^2).

Answer: 2x + 2y + 2z.

Pitfall: divergence is a scalar and curl is a vector; swapping their types
is the C3M02 error at field level. Say which you are computing before
computing.

### C314. Line integrals

Objective: integrate along curves for work, and exploit the fundamental
theorem for gradient fields.

Build on: C303's parametrization and C313's fields.

Core idea: the work of F along a curve is int F . dr = int F(r(t)) . r'(t)
dt: parametrize, dot, integrate. For gradient fields F = grad f the answer
telescopes to f(end) - f(start): path independence, the FTC's vector twin.
Reversing the curve's orientation flips the sign, so orientation is part of
the problem statement.

Worked example: F = (y, x) is grad(xy), so along any path from (0, 0) to
(2, 3) the work is 6, no parametrization needed.

Try it: work of F = (0, x) along the segment from (0,0) to (1,0)?

Answer: 0; F is perpendicular to the motion the whole way.

Pitfall: ignoring orientation (C3M07), and using the shortcut on a
non-conservative field. Check curl zero (on a simply connected region)
before claiming path independence.

### C315. Green's theorem

Objective: trade circulation line integrals for double integrals over the
enclosed region, and back.

Build on: C310 and C314, which the theorem connects.

Core idea: for a positively oriented closed curve enclosing region R:
the circulation int F . dr equals the double integral over R of
(dQ/dx - dP/dy): boundary behavior equals accumulated curl. It converts
painful line integrals into easy area integrals (and occasionally the
reverse), and the special case P = -y/2, Q = x/2 computes plain area from
the boundary: the principle inside a mechanical planimeter.

Worked example: F = (-y, x) around the unit circle: the double integral of 2
over the disk gives circulation 2 pi, matching the direct parametrization at
a fraction of the work.

Try it: what does Green's theorem require of the curve?

Answer: closed, positively oriented, and the field smooth throughout the
enclosed region.

Pitfall: applying it to open curves or across a singularity inside the
region (C3M08): the hypotheses are load-bearing, and (-y, x)/(x^2 + y^2)
around the origin is the standard trap.

### C316. Stokes and divergence theorems

Objective: state the two 3D integral theorems and read them physically.

Build on: C313, C314, C315; both theorems generalize Green's.

Core idea: Stokes: circulation around a closed curve equals the flux of curl
through any surface it bounds (Green's theorem lifted off the plane). The
divergence theorem: the outward flux through a closed surface equals the
triple integral of divergence inside (sources inside account for everything
crossing the boundary). Together they are the grammar of Maxwell's
equations, fluid dynamics, and every conservation law in integral form: the
payoff of the entire course.

Worked example: F = (x, y, z) through the unit sphere: divergence 3, so the
flux is 3 times the ball's volume, 4 pi: no surface parametrization ever
touched.

Try it: for F with curl zero everywhere, what is the circulation around any
closed loop?

Answer: zero, by Stokes: conservative fields do no net work on loops.

Pitfall: orientation compatibility (C3M07 completed): the surface normal
and boundary direction must satisfy the right-hand rule, and the divergence
theorem needs the outward normal on a closed surface. Sign errors here are
physics errors, not typos.
