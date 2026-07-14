# AXIOM Calculus I: Complete Lessons

Course C1, 18 lessons across 5 units, in the teaching arc from the AXIOM
Teaching Model: Objective, Build on, Core idea, Worked example, Try it (the
loader renders the answer click-to-reveal), Pitfall.

---

## Unit 1. Limits and Continuity

### C101. The limit concept

Objective: read and estimate limits from graphs, tables, and one-sided
behavior.

Build on: function evaluation and graphs from precalculus.

Core idea: the limit of f as x approaches a is the value f is heading toward,
which may differ from f(a) or exist when f(a) does not. Both sides must agree:
if the left and right approaches disagree, the limit does not exist.

Worked example: f(x) = (x^2 - 1)/(x - 1) is undefined at 1, yet the table
0.9, 0.99, 1.01, 1.1 gives values 1.9, 1.99, 2.01, 2.1: the limit is 2.

Try it: from a graph where f jumps from 3 to 5 at x = 2, what is the limit as
x approaches 2 from the left?

Answer: 3. The left approach only sees the branch heading to 3.

Pitfall: the limit is about the approach, never about the value at the point.
A hole, a jump, or a redefined point changes f(a), not the limit.

### C102. Limit laws and algebraic evaluation

Objective: evaluate limits algebraically, resolving 0/0 by factoring and
conjugates.

Build on: C101's approach idea; factoring from algebra.

Core idea: limits respect sums, products, and quotients (with nonzero
denominators), so most limits are substitution. When substitution gives 0/0,
the form is indeterminate: it means hidden common structure, not failure.
Factor, cancel, and substitute again.

Worked example: lim as x -> 2 of (x^2 - 4)/(x - 2) = lim of (x + 2) = 4 after
canceling (x - 2).

Try it: lim as x -> 3 of (x^2 - 9)/(x - 3).

Answer: 6, by factoring to (x + 3).

Pitfall: 0/0 does not mean the limit fails to exist (C1M02); it means do more
algebra. And substitution-always is its own error (C1M01): it silently assumes
continuity.

### C103. Continuity and the IVT

Objective: test continuity at a point and apply the intermediate value
theorem.

Build on: C102, since continuity is exactly limit equals value.

Core idea: f is continuous at a when the limit exists and equals f(a). On a
closed interval, a continuous function takes every value between f(a) and
f(b): the intermediate value theorem, the tool that proves equations have
solutions before you can find them.

Worked example: f(x) = x^3 + x - 1 has f(0) = -1 and f(1) = 1; continuity
forces a root between 0 and 1.

Try it: g(x) = x^2 - 3 on [1, 2]. Does the IVT guarantee a root there?

Answer: yes. g(1) = -2 < 0 < 1 = g(2), and g is continuous.

Pitfall: the IVT needs continuity on the whole interval. A function with a
jump can skip values, and quoting the theorem anyway proves nothing.

### C104. Limits at infinity and asymptotes

Objective: determine end behavior and find horizontal and vertical
asymptotes.

Build on: C102's algebraic technique, now with x growing without bound.

Core idea: for rational functions, divide top and bottom by the highest power
of x; every c/x^k term dies, and the surviving ratio of leading terms is the
horizontal asymptote. Vertical asymptotes live where the denominator vanishes
and the numerator does not.

Worked example: (3x^2 + x)/(x^2 - 4) -> 3 as x -> infinity; vertical
asymptotes at x = 2 and x = -2.

Try it: what is the horizontal asymptote of (5x + 1)/(2x - 7)?

Answer: y = 5/2, the ratio of leading coefficients.

Pitfall: a zero of the denominator that also zeros the numerator may be a
hole, not an asymptote. Factor before declaring.

## Unit 2. The Derivative

### C105. The derivative as a limit

Objective: compute derivatives from the difference quotient and interpret
them as slope and rate.

Build on: C102, because the derivative is a limit with a built-in 0/0.

Core idea: f'(a) is the limit of (f(a + h) - f(a))/h as h -> 0: the slope of
the tangent line, the instantaneous rate of change, the velocity when f is
position. Every difference quotient is 0/0 at h = 0 by construction; the
algebra of C102 is what resolves it.

Worked example: f(x) = x^2 at a: ((a + h)^2 - a^2)/h = (2ah + h^2)/h =
2a + h -> 2a.

Try it: use the definition to find f'(1) for f(x) = 3x^2.

Answer: 6. The quotient simplifies to 6 + 3h.

Pitfall: h -> 0 does not mean h = 0. Cancel the h first; substituting zero
into the raw quotient is the C1M02 error wearing new clothes.

### C106. Differentiability and continuity

Objective: identify where a function fails to be differentiable and state the
one-way implication correctly.

Build on: C103 and C105 together.

Core idea: differentiable implies continuous, and the converse is false.
Continuity can fail to produce a derivative three ways: a corner (one-sided
slopes disagree, like |x| at 0), a cusp, and a vertical tangent (slope blows
up). A graph can be unbroken and still have no well-defined slope.

Worked example: f(x) = |x| is continuous everywhere; at 0 the left slope is
-1 and the right slope is +1, so f'(0) does not exist.

Try it: is f(x) = x^(1/3) differentiable at 0?

Answer: no; the tangent is vertical there, though f is continuous.

Pitfall: continuous implies differentiable is misconception C1M05, and it is
the most confidently held false belief in the course. |x| is the permanent
counterexample; keep it loaded.

## Unit 3. Differentiation Rules

### C107. Power, product, and quotient rules

Objective: differentiate polynomials, products, and quotients fluently.

Build on: C105; the rules are the difference quotient computed once, for
everyone, forever.

Core idea: power rule: d/dx of x^n is n x^(n-1). Product rule:
(fg)' = f'g + fg'. Quotient rule: (f/g)' = (f'g - fg')/g^2. The product rule
is the surprise: the derivative of a product is not the product of the
derivatives, and one example kills the wrong version.

Worked example: d/dx of x^2 sin x = 2x sin x + x^2 cos x. The wrong version,
2x cos x, fails at x = pi where the true derivative is pi^2 times -1 plus 0.

Try it: differentiate f(x) = x^3 (x + 1).

Answer: 4x^3 + 3x^2, by product rule or by expanding first.

Pitfall: (fg)' = f'g' is misconception C1M03. When both paths exist (expand
vs product rule), use both once; agreement is your self-check.

### C108. The chain rule

Objective: differentiate compositions with inner-derivative discipline.

Build on: C107; compositions are the one structure those rules do not cover.

Core idea: for f(g(x)), the derivative is f'(g(x)) times g'(x): the outer
derivative evaluated at the inner function, times the inner derivative. Read
every function from the outside in, and multiply derivatives all the way
down.

Worked example: d/dx of sin(x^2) = cos(x^2) times 2x. The inner derivative 2x
is the whole point; without it you differentiated a different function.

Try it: differentiate (3x + 1)^5.

Answer: 15 (3x + 1)^4: five times the fourth power, times the inner 3.

Pitfall: dropping the inner derivative (C1M04) is the most common calculus
error in existence, and diagnostic item C1-D2 checks for it by name.

### C109. Implicit differentiation

Objective: find dy/dx when y is defined by a relation rather than a formula.

Build on: C108, because every y-term hides a chain rule.

Core idea: differentiate both sides of the relation in x, treating y as a
function of x: every derivative of a y-expression picks up a factor dy/dx by
the chain rule. Then solve the resulting linear equation for dy/dx.

Worked example: x^2 + y^2 = 25. Differentiate: 2x + 2y dy/dx = 0, so
dy/dx = -x/y: the circle's tangent slope at any point without solving for y.

Try it: find dy/dx for x y = 6.

Answer: dy/dx = -y/x, from y + x dy/dx = 0.

Pitfall: differentiating y^2 to 2y instead of 2y dy/dx is C1M04 again in
implicit form. Every y is a composition; every y-derivative carries dy/dx.

### C110. Exponential, log, and trig derivatives

Objective: use the derivative vocabulary of e^x, ln x, and the trig
functions.

Build on: C107 and C108; the new facts plug into the old rules.

Core idea: d/dx of e^x is e^x (the function that is its own rate of change),
d/dx of ln x is 1/x, and the trig cycle: sin -> cos, cos -> -sin, with tan ->
sec^2. Combined with the chain rule these cover the functions engineering
actually meets, and they are the prerequisite the ODE course consumes on day
one.

Worked example: d/dx of e^(3x) ln x = 3 e^(3x) ln x + e^(3x)/x.

Try it: differentiate f(x) = ln(x^2 + 1).

Answer: 2x/(x^2 + 1), by chain rule.

Pitfall: the sign in d/dx of cos x = -sin x, and the domain of ln (positive
inputs only) when simplifying. Both are small; both compound.

## Unit 4. Applications of Derivatives

### C111. Related rates

Objective: link two changing quantities through a constraint and solve for
the unknown rate.

Build on: C109; related rates is implicit differentiation in time.

Core idea: write the geometric or physical relation between the quantities,
differentiate the whole relation with respect to t (every variable picks up a
d/dt), substitute the known snapshot values and rates, and solve for the
unknown rate. Draw the picture first; the relation lives in the picture.

Worked example: a 10 ft ladder slides; x^2 + y^2 = 100 gives
2x dx/dt + 2y dy/dt = 0. With x = 6, y = 8, dx/dt = 2: dy/dt = -3/2 ft/s.

Try it: a circle's radius grows at 3 cm/s. How fast is the area growing when
r = 4?

Answer: dA/dt = 2 pi r dr/dt = 24 pi cm^2/s.

Pitfall: substituting the snapshot values before differentiating freezes the
variables and yields zero rates. Differentiate first, substitute second,
always.

### C112. Linear approximation

Objective: approximate function values with the tangent line and estimate
small changes with differentials.

Build on: C105; the tangent line is the derivative's whole geometric point.

Core idea: near a, f(x) is approximately f(a) + f'(a)(x - a): the tangent
line used as a stand-in for the curve. In differential form, a small input
change dx produces output change dy of about f'(a) dx: the language of error
propagation in every lab science.

Worked example: sqrt(49.4) via f(x) = sqrt(x) at 49: f'(49) = 1/14, so
sqrt(49.4) is about 7 + 0.4/14 = 7.029 (true value 7.0285).

Try it: estimate (2.01)^3 using the tangent line at 2.

Answer: about 8 + 12(0.01) = 8.12.

Pitfall: the approximation is local. Ten units from the base point the
tangent line is fiction; report the base point with the estimate.

### C113. Extrema and the mean value theorem

Objective: find critical points, apply the extreme value theorem, and use the
MVT.

Build on: C106; extrema hide where derivatives vanish or fail.

Core idea: candidates for maxima and minima are critical points (f' zero or
undefined) and endpoints; on a closed interval a continuous function must
attain both extremes (EVT). The mean value theorem says somewhere the
instantaneous rate equals the average rate: the reason a 60-mile hour on the
odometer proves a moment at exactly 60 mph.

Worked example: f(x) = x^3 - 3x on [0, 2]: critical point at x = 1 (f' =
3x^2 - 3), values f(0) = 0, f(1) = -2, f(2) = 2: min -2, max 2.

Try it: find the critical points of f(x) = x^3 - 12x.

Answer: x = 2 and x = -2, from 3x^2 - 12 = 0.

Pitfall: a critical point is a candidate, not a conclusion (C1M06): x^3 has a
critical point at 0 and no extremum there. The test comes next lesson.

### C114. Curve analysis

Objective: classify critical points and describe concavity with the first
and second derivative tests.

Build on: C113's candidates; this lesson sorts them.

Core idea: first derivative test: f' changing + to - is a max, - to + is a
min, no change is neither. Second derivative test: f'' > 0 at a critical
point means min, f'' < 0 means max, f'' = 0 is silent (fall back to the first
test). f'' also reads concavity, and inflection points are where concavity
flips.

Worked example: f(x) = x^3 - 3x: f''(x) = 6x, so x = 1 (f'' = 6 > 0) is a
min and x = -1 a max; inflection at 0.

Try it: classify the critical point of f(x) = x^2 - 4x at x = 2.

Answer: minimum; f'' = 2 > 0.

Pitfall: f'' = 0 decides nothing (x^4 and x^3 both have it at 0, one is a
min, one is nothing). Silence is not a verdict.

### C115. Optimization

Objective: translate applied max-min problems into functions of one variable
and solve them completely.

Build on: C113 and C114; the calculus is done, the modeling is new.

Core idea: name the variables, write the objective, use the constraint to
eliminate all but one variable, state the domain the physical problem allows,
then run the critical-point machinery and check endpoints. The answer is a
quantity with units and a sentence, not a bare x.

Worked example: maximize the area of a rectangle with perimeter 40:
A = x(20 - x), A' = 20 - 2x, x = 10: a 10 by 10 square, area 100.

Try it: two positive numbers sum to 12; maximize their product.

Answer: 6 and 6, product 36.

Pitfall: forgetting the domain. A negative side length or a zero endpoint can
be the true optimum of the formula and physically meaningless; check both
ends before answering.

## Unit 5. Introduction to Integration

### C116. Antiderivatives

Objective: reverse differentiation, with the constant of integration intact.

Build on: C107 and C110 run backward.

Core idea: F is an antiderivative of f when F' = f, and any two
antiderivatives differ by a constant, hence the + C. Reverse the power rule
(raise the exponent, divide by it), and reverse the transcendental
vocabulary: e^x stays, 1/x goes to ln|x|, cos goes to sin.

Worked example: int (3x^2 + cos x) dx = x^3 + sin x + C. Differentiate to
check; the check is free and the grader performs exactly it.

Try it: find int (4x^3 - 2) dx.

Answer: x^4 - 2x + C.

Pitfall: dropping + C (C1M07) is not a formality: initial conditions in the
ODE course select C, and a missing constant there is a wrong trajectory, not
a style issue.

### C117. Riemann sums and the definite integral

Objective: define the definite integral as a limit of rectangle sums and
estimate integrals numerically.

Build on: C103; continuity is what guarantees the limit exists.

Core idea: slice [a, b] into n strips, approximate the area of each with a
rectangle, add, and let n grow: the limit is the definite integral, the exact
signed area. Left, right, and midpoint sums differ for finite n and agree in
the limit; signed means area below the axis counts negative.

Worked example: int of x from 0 to 1 by right sums: sum of (i/n)(1/n) =
(n + 1)/(2n) -> 1/2, matching the triangle.

Try it: is the left sum of an increasing function an overestimate or
underestimate?

Answer: underestimate; each rectangle sits below the curve.

Pitfall: forgetting signed area. The integral of sin over a full period is 0,
not the two lobes added as positives.

### C118. The fundamental theorem of calculus

Objective: evaluate definite integrals with antiderivatives and
differentiate accumulation functions.

Build on: C116 and C117, which the theorem welds together.

Core idea: part 1: the accumulation function A(x) = int from a to x of f has
derivative f(x): accumulation and differentiation are inverse processes.
Part 2: int from a to b of f = F(b) - F(a) for any antiderivative F: the
limit of Riemann sums collapses to two evaluations. This is the theorem the
entire integral calculus course (C2) stands on.

Worked example: int from 0 to pi of sin x dx = (-cos pi) - (-cos 0) =
1 + 1 = 2.

Try it: compute d/dx of int from 0 to x of e^(t^2) dt.

Answer: e^(x^2), by part 1, no integration required.

Pitfall: evaluating F(b) alone and forgetting F(a) (C1M08), and, in part 1
with a variable upper limit like x^2, forgetting the chain rule factor. Both
are FTC bookkeeping, and both are graded as named diagnoses.
