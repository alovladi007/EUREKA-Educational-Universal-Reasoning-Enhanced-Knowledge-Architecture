# AXIOM PDEs and Fourier Analysis: Complete Lessons

Course PF of the Engineering Mathematics track, the flagship. One lesson per
knowledge node, 24 lessons across 9 units. Same format as the earlier courses.
This course leans deliberately on the applied context (signals, heat in
devices, waves and optics) because that context is the track's differentiator.

---

## Unit 1. Fourier Series

### PF01. Fourier coefficients

Objective: compute a0, an, bn on [-L, L] and exploit even and odd symmetry.

Any reasonable periodic function decomposes into a constant plus cosines and
sines: f ~ a0/2 + sum (an cos(n pi x / L) + bn sin(n pi x / L)), with
a0 = (1/L) int f, an = (1/L) int f cos(n pi x / L), bn likewise with sine, all
over [-L, L]. Symmetry does half the work: an odd function has only sine
terms, an even function only cosines and the constant, before any integral is
computed.

Worked example: f(x) = x on [-pi, pi] is odd, so a0 = an = 0 immediately, and
integration by parts gives bn = 2 (-1)^{n+1} / n. The first few terms already
trace the sawtooth.

Pitfall: swapping the an and bn integrals or dropping the 1/L (PFM01), and
grinding out integrals that symmetry already answered (PFM02). Check parity
before integrating, every time.

### PF02. Half-range expansions

Objective: expand a function on [0, L] as a pure sine or pure cosine series to
match boundary conditions.

A function defined only on [0, L] can be extended oddly (giving a sine series)
or evenly (giving a cosine series), and the choice is not aesthetic: sine
series vanish at both ends, matching fixed-temperature or fixed-string
boundaries, while cosine series have zero slope at the ends, matching
insulated boundaries. The PDE units consume half-range expansions constantly;
this node is their supply line.

Worked example: f(x) = 1 on [0, pi] as a sine series: bn = 2(1 - (-1)^n) /
(n pi), so only odd n survive: 4/pi (sin x + sin 3x / 3 + ...). At the ends
the series is 0, as an odd extension must be.

Pitfall: choosing the extension by habit instead of by the boundary condition
of the problem that sent you here. The physics picks the parity.

## Unit 2. Fourier Convergence and Parseval

### PF03. Pointwise convergence and Gibbs

Objective: state where a Fourier series converges and to what, including at
jumps, and describe the Gibbs phenomenon honestly.

Under the Dirichlet conditions (piecewise smooth, finitely many jumps), the
series converges to f(x) at every point of continuity and to the midpoint of
the jump, (f(x-) + f(x+)) / 2, at every discontinuity. Near a jump, partial
sums overshoot by about 9 percent of the jump height, and adding more terms
narrows the overshoot but never shrinks its height: that is the Gibbs
phenomenon, and it is why naive truncation rings near edges in signal and
image processing.

Worked example: the square wave's series evaluated exactly at the jump gives
0, the midpoint, no matter how the function was defined at that single point.

Pitfall: expecting convergence to a one-sided value at a jump (PFM03), or
expecting Gibbs to vanish with more terms (PFM04). The overshoot moves; it
does not die.

### PF04. Parseval and energy

Objective: use Parseval's identity to relate function energy to coefficient
energy.

Parseval says the mean square of f equals the sum of squared coefficients
(with the standard normalization): (1/L) int f^2 = a0^2/2 + sum (an^2 + bn^2).
The engineering reading is exact: the energy of a signal is the sum of the
energies of its harmonics, which is why a spectrum analyzer's bars are a
meaningful decomposition and why truncating a series discards a computable
amount of energy, not a vague one.

Worked example: applying Parseval to f(x) = x on [-pi, pi] with the PF01
coefficients yields sum 1/n^2 = pi^2 / 6, the famous Basel value, as a
one-line corollary.

Pitfall: Parseval is an identity in mean-square, not a pointwise statement.
It coexists peacefully with Gibbs; energy convergence does not promise
pointwise good behavior at edges.

## Unit 3. Fourier Transforms

### PF05. Fourier transform and inverse

Objective: compute transforms of the standard pairs and use linearity,
shifting, and scaling.

On the infinite line the series becomes an integral: F(w) = int f(x)
e^{-i w x} dx with the inverse restoring f. The working pairs: a Gaussian
transforms to a Gaussian, a rectangular pulse to a sinc, a decaying
exponential to a Lorentzian. The rules that do daily work: time shift
multiplies by a phase, scaling trades width in x for width in w (a narrow
pulse has a wide spectrum: the uncertainty tradeoff in its cleanest form).

Worked example: the unit rectangle on [-1, 1] transforms to 2 sin(w)/w. The
first zeros at w = +-pi encode the pulse width, which is exactly how radar and
spectroscopy infer durations from spectra.

Pitfall: convention drift. The 2 pi can live in the exponent, the inverse, or
split between both; pick the course convention and audit any formula imported
from elsewhere against it.

### PF06. Convolution and filtering

Objective: state the convolution theorem and reason about filters in the
frequency domain.

Convolution in x becomes multiplication in w: the transform of f * g is F G.
Every linear time-invariant system (an RC filter, a blur, a room's acoustics)
acts by convolution with its impulse response, so in the frequency domain it
simply multiplies the spectrum by a frequency response. Low-pass, high-pass,
band-pass are then literal descriptions of which part of F survives the
multiplication.

Worked example: smoothing a noisy signal by a moving average is convolution
with a rectangle, hence multiplication by a sinc: high frequencies are
suppressed, with ripple. Choosing a Gaussian window instead multiplies by a
Gaussian: smooth suppression, no ripple. Filter design is the choice of that
multiplier.

Pitfall: convolving spectra when the problem multiplies signals, or vice
versa. The theorem is a dictionary with a direction; state which domain you
are in before applying it.

## Unit 4. PDE Classification and Boundary Conditions

### PF07. Classification of second-order PDEs

Objective: classify a PDE as elliptic, parabolic, or hyperbolic, and predict
the character of its solutions.

For A u_xx + B u_xy + C u_yy + ... = 0, the discriminant B^2 - 4AC sorts the
world: negative is elliptic (Laplace: equilibrium, no time, boundary data
everywhere), zero is parabolic (heat: one time derivative, smoothing,
initial data plus boundaries), positive is hyperbolic (wave: two time
derivatives, propagation at finite speed, initial position and velocity). The
type dictates the method, the data needed, and the behavior; misclassifying is
not a small error.

Worked example: the heat and wave equations differ by one time derivative, and
each spatial mode consequently decays exponentially in the first and
oscillates forever in the second. Diagnostic item PF-D2 tests exactly this
contrast.

Pitfall: importing time-marching intuition into Laplace's equation (PFM09) or
conflating heat and wave behavior (PFM07). The classification exists to stop
both.

### PF08. Boundary and initial conditions

Objective: name and apply Dirichlet, Neumann, and Robin conditions, and match
the data to the equation type.

Dirichlet prescribes the value of u on the boundary (fixed temperature,
clamped string), Neumann prescribes the normal derivative (insulated boundary,
free end), Robin a combination (convective cooling). Well-posedness is the
bookkeeping that each type of equation needs the right amount of data: heat
wants one initial condition plus boundary conditions, waves want two initial
conditions, Laplace wants boundary data only.

Worked example: a rod with one end held at 0 degrees and the other insulated
is Dirichlet at one end, Neumann at the other; the eigenfunctions that Unit 5
finds will be sines shifted to quarter-wavelengths precisely because of that
mix.

Pitfall: over- or under-supplying data. Prescribing both the value and the
slope on the whole boundary of a Laplace problem overdetermines it; the
condition count is part of the physics, not a formality.

## Unit 5. The Heat Equation

### PF09. Heat equation by separation of variables

Objective: solve u_t = alpha u_xx on a finite rod with homogeneous boundary
conditions by separation and eigenfunction expansion.

Assume u = X(x) T(t); the PDE splits into X'' = -lambda X (an eigenvalue
problem the boundary conditions select: for u(0) = u(L) = 0, the
eigenfunctions are sin(n pi x / L)) and T' = -alpha lambda T (exponential
decay, mode by mode). The general solution is a sine series with
time-decaying coefficients, and the initial temperature picks the
coefficients through its half-range sine expansion (PF02, on schedule).

Worked example: mode n on [0, L] is exp(-alpha (n pi / L)^2 t) sin(n pi x / L);
substituting into the PDE gives residual zero, which is exactly the check the
template bank runs on every seeded variant.

Pitfall: choosing the wrong sign for the separation constant and producing
modes that grow on a passive rod (PFM06). If a cooling problem predicts
blow-up, the sign of lambda is the first suspect.

### PF10. Heat kernel intuition and steady state

Objective: read the mode-decay rates physically and identify long-time
behavior.

The decay rate alpha (n pi / L)^2 grows like n^2: fine spatial detail dies
fast, coarse structure lingers, which is why heat flow smooths and why after a
short time only the first mode's shape survives. As t grows, the solution
approaches the steady state, the time-independent solution consistent with the
boundary conditions. In device terms: switch-on transients in a semiconductor
die decay mode by mode, and thermal design is largely about the slowest mode.

Worked example: on a rod with ends held at 0, the steady state is 0 and the
approach is dominated by e^{-alpha (pi/L)^2 t}: doubling the rod length
quadruples the thermal settling time.

Pitfall: expecting the initial condition's sharp features to persist. The
heat equation forgets detail by design; only the boundary-driven steady state
is permanent.

### PF11. Nonhomogeneous boundary conditions

Objective: handle fixed nonzero boundary temperatures by splitting into
steady state plus transient.

Separation of variables requires homogeneous boundary conditions, so a
problem with u(0) = T1, u(L) = T2 is split: find the steady state v(x)
(linear in x for the bare rod), then w = u - v satisfies the homogeneous
problem that PF09 already solved. The full solution is
v(x) plus a decaying sine series in w.

Worked example: T1 = 0, T2 = 100 on [0, L]: v = 100 x / L, and the transient
w starts from (initial data minus v) expanded in sines and decays to zero,
leaving the linear profile.

Pitfall: applying separation directly to the nonhomogeneous problem (PFM05).
The method's requirement is not a suggestion; the split into steady plus
transient is how the requirement is met.

## Unit 6. The Wave Equation

### PF12. Wave equation by separation of variables

Objective: find the normal modes of a fixed string and expand initial data
over them.

For u_tt = c^2 u_xx with fixed ends, separation gives the same spatial
eigenfunctions sin(n pi x / L) as the heat problem, but the time factor now
oscillates: cos and sin of (n pi c / L) t. Each mode is a standing wave at
frequency n c / (2L): the harmonic series of a string, which is why a string
sounds like a pitch plus overtones. Initial displacement sets the cosine
coefficients, initial velocity the sine coefficients.

Worked example: a plucked string released from a triangular shape has only the
displacement series; the mode amplitudes fall off like 1/n^2, which the ear
hears as a mellow tone compared to the 1/n of a struck sawtooth.

Pitfall: giving the wave modes decaying time factors (PFM07 again, in the
other direction). Nothing in the undamped wave equation dissipates; the
oscillation is permanent by construction.

### PF13. d'Alembert's solution

Objective: write the traveling-wave solution and use the domain of dependence.

On the infinite line, u = f(x - ct) + g(x + ct): every solution is a
right-mover plus a left-mover at speed c, and the initial position and
velocity determine f and g explicitly. The value at (x, t) depends only on
initial data in [x - ct, x + ct]: the domain of dependence, which is the
mathematical form of a finite signal speed.

Worked example: u_t + shape sin at t = 0 with zero initial velocity splits
half-and-half: u = (sin(x - ct) + sin(x + ct)) / 2, two half-height copies
sliding apart. The template bank's wave items verify exactly such
combinations against the PDE.

Pitfall: reading f(x + ct) as the right-mover (PFM08). As t grows, keeping the
argument constant forces x to decrease: x + ct moves left. Diagnostic item
PF-D3 drills the direction.

### PF14. Energy and characteristics

Objective: state energy conservation for the string and use characteristic
lines.

The string's energy, kinetic plus potential, int (u_t^2 + c^2 u_x^2) / 2 dx,
is constant in time for the undamped equation: differentiate under the
integral, integrate by parts, and the boundary terms vanish for fixed ends.
The characteristics x +- ct = const are the rails information rides on, and
they explain both d'Alembert's formula and why hyperbolic problems transport
sharp features intact instead of smoothing them.

Worked example: a kink in the initial data of a heat problem is gone in an
instant; the same kink in a wave problem travels forever along a
characteristic. One contrast, whole classification justified.

Pitfall: energy arguments require the boundary terms to actually vanish; a
free or driven end feeds or drains energy, and quoting conservation there
proves false things.

## Unit 7. Laplace's Equation

### PF15. Laplace's equation on a rectangle

Objective: solve the Dirichlet problem on a rectangle by separation, one
boundary side at a time.

For u_xx + u_yy = 0 with data on the four sides, superposition splits the
problem into four, each with data on one side and zeros elsewhere. Each
sub-problem separates: sines along the data side, and in the perpendicular
direction the oscillation becomes exponential growth and decay (sinh and
cosh), because the two second derivatives must cancel rather than cooperate.

Worked example: data f(x) on the bottom of [0, a] x [0, b], zero elsewhere:
u = sum bn sin(n pi x / a) sinh(n pi (b - y) / a) / sinh(n pi b / a), with bn
the sine coefficients of f. Far from the data side the modes have died
exponentially: boundary influence fades with distance.

Pitfall: writing oscillation in both directions. If both factors oscillate,
their second derivatives add instead of canceling, and the sum cannot be zero.
The sinh is forced, not chosen.

### PF16. Harmonic functions and mean value

Objective: use the mean value property and maximum principle as the character
of harmonic functions.

A harmonic function's value at a point equals its average on any circle around
the point, and consequently a nonconstant harmonic function attains its
maximum and minimum only on the boundary. Physically: a steady temperature
field has no interior hot spots without a source. These two properties do more
practical work than any formula: they bound solutions, prove uniqueness of
the Dirichlet problem in two lines, and sanity-check numerics.

Worked example: u = x^2 - y^2 is harmonic (u_xx + u_yy = 2 - 2 = 0); on the
unit disk its extremes +-1 occur on the boundary circle, as the maximum
principle demands. The template bank's harmonic-check items are drawn from
exactly this family.

Pitfall: harmonic is a differential condition, not a smoothness impression.
x^2 + y^2 looks equally tidy and fails the check with Laplacian 4; always
compute.

### PF17. Laplace's equation on a disk

Objective: separate in polar coordinates and state the Poisson kernel in
brief.

On a disk, separation in (r, theta) gives angular sines and cosines and radial
powers r^n (the r^{-n} solutions are discarded for boundedness at the
center). The solution with boundary data f(theta) is a Fourier series in
theta with coefficients scaled by (r/R)^n, and summing it in closed form
yields the Poisson kernel: the boundary data averaged with a specific
positive weight. The mean value property of PF16 is the r = 0 case, now
proved rather than asserted.

Worked example: boundary data cos(2 theta) on the unit disk extends inward as
r^2 cos(2 theta): higher harmonics penetrate less, matching the rectangle's
exponential fading in polar clothing.

Pitfall: keeping the r^{-n} terms on a solid disk. They belong to annulus
problems; on a disk they violate boundedness at the center and their
coefficients are zero by physics, not by preference.

## Unit 8. Sturm-Liouville Theory

### PF18. Sturm-Liouville problems

Objective: put second-order eigenvalue problems in self-adjoint form and state
the structural guarantees.

The problems separation of variables keeps producing, X'' = -lambda X with
various boundary conditions, are instances of the Sturm-Liouville form
(p X')' + q X + lambda w X = 0. In that form, with the standard boundary
conditions, the guarantees arrive as a package: the eigenvalues are real and
form an increasing sequence, and eigenfunctions of distinct eigenvalues are
orthogonal with weight w. This is the spectral theorem of LA20 grown up into
function space, and the cross-course edge LA20 -> PF18 is that sentence as
data.

Worked example: X'' = -lambda X on [0, L] with zero ends is already
self-adjoint with p = w = 1: eigenvalues (n pi / L)^2, eigenfunctions
sin(n pi x / L), orthogonality by direct integration.

Pitfall: assuming any two convenient functions are orthogonal (PFM10). The
orthogonality is earned by the self-adjoint structure and the weight w; quote
it only after exhibiting both.

### PF19. Eigenfunction expansions

Objective: expand functions over a Sturm-Liouville eigenbasis and see why
separation of variables always lands here.

Orthogonality turns expansion into projection: the coefficient of
eigenfunction phi_n is int f phi_n w dx / int phi_n^2 w dx, the same inner
product recipe as Fourier coefficients because Fourier series are the simplest
Sturm-Liouville case. Every separation-of-variables solution in this course
was secretly this: expand the initial or boundary data over the
eigenfunctions the geometry selects, then evolve each coefficient by its own
ODE.

Worked example: the heat solution of PF09 restated: coefficients are the
projection of the initial data on sin(n pi x / L), evolution multiplies each
by its decay exponential. The method is one method, seen three times.

Pitfall: normalization bookkeeping. The denominator int phi_n^2 w dx is not
always L/2; compute it for the actual eigenfunctions and weight rather than
transplanting the sine value.

### PF20. Bessel and Legendre in brief

Objective: know where cylindrical and spherical geometries get their special
functions, at reading depth.

Separate Laplace or heat problems in cylindrical coordinates and the radial
equation is Bessel's equation (the Frobenius customer from OD20); in
spherical coordinates the polar-angle equation is Legendre's. Their solutions,
Bessel functions and Legendre polynomials, are not exotic: they are the
sines-and-cosines of their geometries, complete with their own orthogonality
and their own eigenfunction expansions under the Sturm-Liouville umbrella of
PF18.

Worked example: the drumhead's normal modes are J_k Bessel functions in radius
times sinusoids in angle; the drum sounds inharmonic because Bessel zeros,
unlike string harmonics, are not integer multiples.

Pitfall: treating special functions as formulas to memorize rather than
eigenfunctions to use. Everything you do with them (expand, project, evolve)
is the PF19 recipe with a different basis.

## Unit 9. Transform Methods and Green's Functions

### PF21. Method of characteristics, first order

Objective: solve first-order transport PDEs by riding the characteristics.

For u_t + c u_x = 0, the solution is constant along the lines x - ct = const:
whatever profile exists at t = 0 translates rigidly at speed c, so
u = f(x - ct) for initial data f. Variable-speed and nonlinear versions follow
the same idea (characteristics may bend or cross, and crossing is where shocks
are born), but the constant-speed case carries the concept.

Worked example: u_t + c u_x = 0 with u(x, 0) = sin x gives u = sin(x - ct);
substituting confirms a zero residual and the initial condition, which is
precisely the verification the template bank runs.

Pitfall: solving transport as if it diffused. First-order transport preserves
the profile exactly; any smoothing in a numerical solution of it is an
artifact of the scheme, not the equation, and recognizing that matters in
computational work.

### PF22. Transform methods on infinite domains

Objective: solve the heat equation on the whole line by Fourier transform in
x.

Without boundaries, transform in x: u_t = alpha u_xx becomes
U_t = -alpha w^2 U, an ODE in t for each frequency, solved by
U = U0 e^{-alpha w^2 t}. Inverting the Gaussian multiplier yields convolution
of the initial data with the heat kernel: a spreading Gaussian of width
sqrt(2 alpha t). The Laplace-transform fluency from OD13 (cross edge
OD13 -> PF22) is the same maneuver with a different transform when time
half-lines and initial conditions favor it.

Worked example: a point of heat at the origin spreads as the Gaussian
e^{-x^2 / (4 alpha t)} / sqrt(4 pi alpha t): the fundamental solution, and the
reason diffusion lengths in semiconductor processing scale as sqrt(time).

Pitfall: applying the finite-rod sine machinery to an infinite domain. No
boundaries means no discrete eigenvalues; the spectrum is continuous and the
transform is the right tool, not a harder version of the wrong one.

### PF23. Green's functions

Objective: understand a Green's function as the impulse response of a
boundary-value problem and use superposition of sources.

The Green's function G(x, s) solves the problem with a unit point source at s
and homogeneous conditions; the solution for a general source f is then the
superposition u(x) = int G(x, s) f(s) ds. This is the boundary-value twin of
the impulse-response idea from OD15 and the convolution filter of PF06: know
the response to one point, and linearity assembles the response to anything.

Worked example: for -u'' = f on [0, 1] with zero ends, G is the tent function
G(x, s) = x (1 - s) for x < s and s (1 - x) for x > s; integrating it against
f solves any loading of the clamped bar.

Pitfall: a Green's function belongs to an operator plus its boundary
conditions, not to the operator alone. Changing the boundary conditions
changes G, and reusing one across problems is a silent wrong answer.

### PF24. PDEs in engineering practice

Objective: connect the course's machinery to Fourier optics, semiconductor
diffusion, and waveguides: the applied spine of the track.

Three closing translations. Fourier optics: a lens performs an optical Fourier
transform, and diffraction patterns are the transforms of apertures, so PF05
is readable off an optical bench. Semiconductor processing: dopant diffusion
is the heat equation with concentration in place of temperature, and junction
depths scale as sqrt(D t) by the PF22 kernel. Waveguides and photonics: guided
modes are Sturm-Liouville eigenfunctions of the transverse problem, and cutoff
frequencies are eigenvalues. The methods of this course are not preparation
for engineering; they are its daily working language, which is the claim this
track was built to demonstrate.

Worked example: a metrology instrument resolving fine structure needs high
spatial frequencies to survive the optical transfer function: PF06's filtering
statement, on hardware.

Pitfall: none mathematical. The professional error is forgetting which
idealization each model made (undamped, linear, homogeneous) and trusting it
one regime too far. Knowing the assumptions is part of knowing the equation.
