# AXIOM Ordinary Differential Equations: Complete Lessons

Course OD of the Engineering Mathematics track. One lesson per knowledge node,
22 lessons across 8 units. Same format as the Linear Algebra lessons:
objective, core idea, worked example, pitfall keyed to the misconception
library.

---

## Unit 1. First-Order Equations

### OD01. Separable equations

Objective: solve dy/dx = f(x) g(y) by separation, keeping the constant and the
lost solutions.

If the right side factors into a function of x times a function of y, move all
y-dependence left and x-dependence right, then integrate both sides:
dy/g(y) = f(x) dx. The arbitrary constant appears once, at integration, and
survives into the general solution. Watch the division: any y with g(y) = 0 is
a constant solution that division silently discards, and it must be reported
separately.

Worked example: y' = k x y. Divide by y: dy/y = k x dx, integrate:
ln|y| = k x^2 / 2 + C, so y = C1 e^{k x^2 / 2}. The discarded y = 0 is
recovered by allowing C1 = 0 here, but that is a coincidence of this equation,
not a general rule.

Pitfall: dropping the constant (ODM01) or dividing by a vanishing factor
without noting the lost solution (ODM03). Both are graded as named diagnoses
in this course.

### OD02. Linear first-order and integrating factors

Objective: solve y' + p(x) y = q(x) with the integrating factor mu = e^{int p}.

Multiply the whole equation by mu(x) = e^{integral of p}. The point of that
choice, and the thing to verify every time, is that the left side collapses to
an exact derivative: (mu y)' = mu q. Integrate once and divide by mu:
y = (1/mu) (integral of mu q + C).

Worked example: y' + a y = b with constants. mu = e^{a x}, so
(e^{a x} y)' = b e^{a x}, giving e^{a x} y = (b/a) e^{a x} + C and
y = b/a + C e^{-a x}. Substitute back to confirm the residual is zero; the
grader does exactly this.

Pitfall: multiplying by mu and then integrating the left side term by term as
if it were not a product-rule collapse (ODM04). If the left side is not
literally (mu y)', the mu was computed wrong.

### OD03. Existence, uniqueness, and interval of validity

Objective: apply the Picard conditions and read off where a solution is
guaranteed to exist and be unique.

If f(x, y) and its partial derivative in y are continuous near the initial
point, the IVP y' = f(x, y), y(x0) = y0 has exactly one solution on some
interval around x0. The guarantee is local: solutions can blow up in finite
time or run into a singularity of the equation, and the interval of validity
ends there, whatever the formula seems to say beyond it.

Worked example: y' = y^2, y(0) = 1 gives y = 1/(1 - x), which explodes at
x = 1. The solution's interval of validity is (-infinity, 1), even though the
formula happily evaluates at x = 2.

Pitfall: extending a solution formula across a singularity (ODM11). The
formula is not the solution; the solution is the formula restricted to its
interval.

### OD04. Exact equations

Objective: recognize M dx + N dy = 0 as exact when M_y = N_x and recover the
potential function.

An exact equation is the total differential of some F(x, y): F_x = M and
F_y = N, and solutions are the level curves F = C. The test is M_y = N_x.
To find F: integrate M in x (constant of integration is a function of y),
then differentiate in y and match against N.

Worked example: (2xy + 3) dx + (x^2 + 4y) dy = 0. M_y = 2x = N_x: exact.
F = x^2 y + 3x + g(y); F_y = x^2 + g'(y) = x^2 + 4y gives g = 2y^2. Solutions:
x^2 y + 3x + 2y^2 = C.

Pitfall: the constant of integration after the first step is a function g(y),
not a number. Writing a bare constant there loses half the potential.

## Unit 2. Modeling and Qualitative Behavior

### OD05. Modeling with first-order ODEs

Objective: translate growth, decay, mixing, and cooling scenarios into
first-order equations and interpret parameters.

The modeling move is always the same sentence: rate of change equals rate in
minus rate out. Exponential growth and decay: y' = k y. Newton cooling:
T' = -k (T - T_env). Mixing tank: amount' = (concentration in)(flow in) -
(amount/volume)(flow out). The mathematics is Unit 1; the skill here is
reading the scenario into the equation and the units into the parameters.

Worked example: a 100 L tank with 5 g/L inflow at 2 L/min and outflow 2 L/min:
A' = 10 - A/50. Steady state A = 500 g, approached exponentially with time
constant 50 minutes.

Pitfall: unit mismatches, especially concentration versus amount. If the two
sides of the equation do not carry the same units, the model is wrong before
any calculus happens.

### OD06. Autonomous equations and equilibria

Objective: draw the phase line of y' = f(y), classify equilibria, and sketch
solutions without solving.

For autonomous equations the right side depends only on y, so the entire
behavior is encoded on a line: zeros of f are equilibria, and the sign of f
between zeros gives the direction of motion. An equilibrium is stable when the
flow points toward it from both sides (f' < 0 there) and unstable when it
points away (f' > 0).

Worked example: y' = y (1 - y), the logistic equation. Equilibria at 0 and 1;
f > 0 between them. The phase line shows 0 unstable, 1 stable, and every
positive solution ends at 1, no formula required.

Pitfall: judging stability from the sign or size of the equilibrium value
itself (ODM10). Stability is a property of the flow around the point, read
from f' or the phase line, not of the point's location.

## Unit 3. Second-Order Linear Equations

### OD07. Homogeneous constant-coefficient equations

Objective: solve a y'' + b y' + c y = 0 through the characteristic equation in
all three root cases.

Try y = e^{r x}; the ODE becomes the characteristic polynomial
a r^2 + b r + c = 0. Distinct real roots r1, r2: y = C1 e^{r1 x} + C2 e^{r2 x}.
Repeated root r: y = (C1 + C2 x) e^{r x}. Complex roots p +- i q:
y = e^{p x} (C1 cos qx + C2 sin qx). Complex roots are not a failure; they are
oscillation, and most of engineering lives in that case.

Worked example: y'' + 4y = 0 has roots +-2i, so y = C1 cos 2x + C2 sin 2x.
A general solution of a second-order equation carries exactly two constants;
one particular solution is not the general solution.

Pitfall: sign slips building the characteristic polynomial (ODM05), discarding
complex roots as unsolvable (ODM06), and presenting a particular solution as
general (ODM02). All three are graded as named diagnoses.

### OD08. Linear independence and the Wronskian

Objective: verify a fundamental set of solutions and state the structure of
the general solution.

Two solutions y1, y2 form a fundamental set when they are independent, tested
by the Wronskian W = y1 y2' - y1' y2. For solutions of the same linear ODE,
Abel's theorem makes W either identically zero or never zero on the interval,
so one evaluation decides. The general solution of the homogeneous equation is
then exactly C1 y1 + C2 y2, and every solution has that form.

Worked example: y1 = cos 2x, y2 = sin 2x for y'' + 4y = 0. W = 2 (cos^2 +
sin^2) = 2: never zero, fundamental set confirmed.

Pitfall: for arbitrary functions (not co-solutions of one ODE), a Wronskian
that vanishes at a point proves nothing about dependence (ODM12). The clean
zero-or-never dichotomy is a privilege of solution pairs.

### OD09. Initial value problems, second order

Objective: fit the two constants of a general solution to y(0) and y'(0).

The general solution has two constants because the equation is second order;
the initial position and initial velocity pin them down. Differentiate the
general solution once, substitute x = 0 into both, and solve the resulting
2x2 linear system for C1, C2. The final answer to an IVP carries no arbitrary
constants at all.

Worked example: y'' + 4y = 0, y(0) = 3, y'(0) = 2. General solution
C1 cos 2x + C2 sin 2x; y(0) = C1 = 3 and y'(0) = 2 C2 = 2, so
y = 3 cos 2x + sin 2x.

Pitfall: an IVP answer still containing C1 is wrong by inspection, and the
grader rejects it with exactly that message. The reverse error, dropping
constants from a general-solution problem, is ODM02 again.

## Unit 4. Nonhomogeneous Equations and Resonance

### OD10. Undetermined coefficients

Objective: guess particular solutions for polynomial, exponential, and
sinusoidal forcing, including the resonant modification.

For a y'' + b y' + c y = g(x) with g a polynomial, exponential, sine or
cosine, or products of these, guess y_p in the same family with undetermined
coefficients and solve for them by substitution. The one trap: if the guess
solves the homogeneous equation, multiply it by x (and by x^2 for a repeated
resonance) before matching.

Worked example: y'' - y = e^x. The naive guess A e^x is a homogeneous
solution; use y_p = A x e^x, substitute, and A = 1/2. The general solution is
C1 e^x + C2 e^{-x} + (x/2) e^x.

Pitfall: the resonant guess collision (ODM07) is the single most common error
in this unit, and diagnostic item OD-D3 exists to catch it early.

### OD11. Variation of parameters

Objective: apply the general particular-solution formula when undetermined
coefficients does not apply.

Given a fundamental set y1, y2 of the homogeneous equation, a particular
solution of y'' + p y' + q y = g is y_p = -y1 int(y2 g / W) + y2 int(y1 g / W),
with W the Wronskian. It always works, at the price of two integrals, and it
is the method of record when g is something like tan x or 1/x that no
undetermined-coefficients family covers.

Worked example: y'' + y = sec x. With y1 = cos x, y2 = sin x, W = 1:
y_p = -cos x int(sin x sec x) + sin x int(cos x sec x)
    = cos x ln|cos x| + x sin x.

Pitfall: the formula requires the equation normalized so the y'' coefficient
is 1. Feeding it a y'' + ... without dividing through first corrupts g and W
together.

### OD12. Oscillators and resonance

Objective: read m y'' + c y' + k y = F(t) as an oscillator and reason about
damping, natural frequency, and resonance.

The homogeneous behavior is set by the damping: underdamped rings and decays,
critically damped returns fastest without ringing, overdamped creeps back.
Under periodic forcing at frequency omega, the steady-state amplitude peaks
when omega approaches the natural frequency; with zero damping at exact
resonance, the response grows linearly in time (the x-multiplied particular
solution from OD10 is that growth). Every mechanical and electrical resonance
story is this one equation.

Worked example: y'' + 4y = cos 2t forces exactly at the natural frequency 2.
The particular solution is (t/4) sin 2t: growth without bound, which in a real
structure means damping or failure decides the ending.

Pitfall: resonance is a frequency-matching phenomenon, not a large-force
phenomenon. A small periodic push at the right frequency outgrows a large push
at the wrong one.

## Unit 5. Laplace Transform Methods

### OD13. Laplace transforms and inverses

Objective: compute transforms from the definition and the table, and invert by
table plus partial fractions.

L{f} = integral from 0 to infinity of e^{-st} f(t) dt turns functions of t
into functions of s. The working vocabulary: L{t^n} = n!/s^{n+1},
L{e^{at}} = 1/(s - a), L{cos bt} = s/(s^2 + b^2), L{sin bt} = b/(s^2 + b^2),
and the s-shift L{e^{at} f} = F(s - a). Inversion is table lookup after
partial fractions.

Worked example: L{t e^{2t}} = 1/(s - 2)^2 by the s-shift applied to
L{t} = 1/s^2. The template bank drills this family with n up to 3.

Pitfall: the transforms live in different variables. Mixing t and s in one
expression is a category error the grader will call incorrect even when the
pieces look right.

### OD14. Solving IVPs by Laplace transform

Objective: convert an IVP to algebra with the derivative rule and invert back.

The rule that makes the method work: L{y'} = s Y(s) - y(0) and
L{y''} = s^2 Y(s) - s y(0) - y'(0). Initial conditions enter the algebra
immediately, not at the end. Transform the whole equation, solve for Y(s),
partial-fraction, invert.

Worked example: y' + 2y = 0, y(0) = 3. Transform: s Y - 3 + 2 Y = 0, so
Y = 3/(s + 2), and y = 3 e^{-2t}. No constant-fitting step exists in this
method; that is its selling point.

Pitfall: writing L{y'} = s Y and dropping the initial condition (ODM08) is the
signature error of the unit, and diagnostic item OD-D2 targets it directly.

### OD15. Step functions and impulses

Objective: model switched and impulsive forcing with Heaviside and Dirac
inputs and transform them.

The Heaviside step u(t - a) switches forcing on at time a, with
L{u(t - a) f(t - a)} = e^{-as} F(s) (the t-shift). The Dirac impulse
delta(t - a) models a hammer blow or a spark: L{delta(t - a)} = e^{-as}. These
two inputs are how real engineering signals (relays, collisions, switching
supplies) enter the ODE world, and the Laplace transform is the only method in
this course that handles them gracefully.

Worked example: y' + y = delta(t - 1), y(0) = 0. Transform: (s + 1) Y =
e^{-s}, so y = u(t - 1) e^{-(t - 1)}: nothing happens until the impulse, then
a decaying response starts from it.

Pitfall: forgetting that the t-shift theorem requires the function shifted the
same way as the step. u(t - a) f(t) is not covered by the formula; rewrite f
in terms of t - a first.

## Unit 6. Systems of ODEs

### OD16. Linear systems x' = A x

Objective: solve constant-coefficient systems by the eigenvalue method.

Try x = e^{lambda t} v; the system becomes A v = lambda v. Each eigenpair
gives a straight-line solution e^{lambda t} v, and with a full set of
eigenvectors the general solution is their combination. This is the payoff of
LA Unit 6: diagonalization is literally the solution method, and the
cross-course prerequisite edge LA19 -> OD16 encodes exactly that.

Worked example: A with eigenvalues 3 and -1 and eigenvectors v1, v2 gives
x = C1 e^{3t} v1 + C2 e^{-t} v2: growth along v1, decay along v2, a saddle.

Pitfall: solving the components independently as if they were uncoupled scalar
equations (ODM09). The coupling is the entire content of the problem; the
eigenbasis is what uncouples it legally.

### OD17. Complex and repeated eigenvalues in systems

Objective: extract real solutions from complex pairs and handle defective
matrices.

A complex pair p +- i q with eigenvector v gives real solutions by taking real
and imaginary parts of e^{(p + iq) t} v: spirals (p not 0) or closed orbits
(p = 0). A repeated eigenvalue with a short eigenspace needs a generalized
eigenvector w solving (A - lambda I) w = v, contributing the solution
e^{lambda t} (t v + w).

Worked example: eigenvalues +-2i with eigenvector (1, i) yield the real pair
(cos 2t, -sin 2t) and (sin 2t, cos 2t): circular orbits, a center.

Pitfall: complex eigenvalues are rotation, not error (the system-level echo of
ODM06). If a physical system visibly oscillates, expect a complex pair and do
not fight it.

### OD18. Matrix exponential

Objective: define e^{At} and compute it via diagonalization; read it as the
flow of the system.

The solution of x' = A x with x(0) = x0 is x = e^{At} x0, where e^{At} is the
matrix power series or, when A = P D P^{-1}, simply P e^{Dt} P^{-1} with
e^{Dt} diagonal. The matrix exponential packages every solution of the system
into one object, and it is the notation control theory and state-space methods
run on.

Worked example: A = diag(3, -1) gives e^{At} = diag(e^{3t}, e^{-t});
conjugating by P transports this to any diagonalizable A.

Pitfall: e^{A + B} equals e^A e^B only when A and B commute. The scalar
exponent law does not survive into matrices, and assuming it does breaks
control computations silently.

## Unit 7. Series Solutions

### OD19. Power series solutions

Objective: solve equations with variable coefficients by series about an
ordinary point.

Assume y = sum a_n x^n, substitute, and collect powers of x; each power gives
an equation, and together they form a recurrence for the coefficients. Two
free coefficients (a0, a1) survive, matching the two constants a second-order
equation owes. Airy's equation and the small-angle pendulum with varying
gravity are the classic customers.

Worked example: y'' - x y = 0 (Airy). The recurrence a_{n+2} =
a_{n-1} / ((n + 2)(n + 1)) builds the two independent series from a0 and a1,
and truncations of them are how Airy functions are actually evaluated.

Pitfall: reindexing errors when shifting the summation index are nearly
universal on first contact. Align every sum to the same power of x before
matching coefficients, and write the index shift explicitly.

### OD20. Regular singular points and Frobenius

Objective: recognize regular singular points and apply the Frobenius ansatz.

Where the leading coefficient vanishes, ordinary series can fail. At a regular
singular point, the Frobenius ansatz y = x^r sum a_n x^n works: the lowest
power gives the indicial equation for r, and the recurrence proceeds from
there. Bessel's equation, which cylindrical PDE problems produce on schedule in
the next course, is the reason this node exists.

Worked example: x^2 y'' + x y' + (x^2 - k^2) y = 0 (Bessel). The indicial
equation r^2 - k^2 = 0 gives r = +-k, and the r = k series is the Bessel
function J_k.

Pitfall: applying a plain power series at a singular point produces a
recurrence that quietly forces everything to zero. The x^r prefactor is not
decorative; it is what the singularity demands.

## Unit 8. Phase Plane and Stability

### OD21. Phase portraits and classification

Objective: classify the origin of x' = A x from the eigenvalues and sketch the
portrait.

The dictionary: real eigenvalues of the same sign give a node (stable if
negative), opposite signs give a saddle, complex with negative real part a
stable spiral, positive real part an unstable spiral, purely imaginary a
center. Trace and determinant of A read the case without computing
eigenvalues: det < 0 is a saddle, and for det > 0 the trace's sign decides
stability.

Worked example: A with trace -3 and det 2 has eigenvalues -1 and -2: a stable
node; every trajectory slides into the origin, tangent to the slow
eigenvector.

Pitfall: sketching trajectories without the eigenvector directions. The
eigenlines are the skeleton of the portrait; draw them first and the rest
follows.

### OD22. Linearization and stability of equilibria

Objective: linearize a nonlinear system at an equilibrium with the Jacobian
and know when the linear verdict is trustworthy.

At an equilibrium of a nonlinear system, the Jacobian matrix of partial
derivatives gives the best linear approximation, and the linear classification
(node, saddle, spiral) transfers to the nonlinear system whenever the
eigenvalues have nonzero real part (hyperbolic equilibria). Centers are the
honest exception: purely imaginary eigenvalues leave the nonlinear verdict
undecided, and nonlinear terms can tip a center into a slow spiral either way.

Worked example: the pendulum x' = y, y' = -sin x. At (0, 0) the Jacobian has
eigenvalues +-i: a linear center, and the nonlinear system is genuinely
periodic there. At (pi, 0) the eigenvalues are +-1: a saddle, and the linear
verdict is final.

Pitfall: trusting the linearization at a center. Hyperbolic is the license;
purely imaginary eigenvalues revoke it, and claiming stability there requires
a different tool (energy or Lyapunov arguments).
