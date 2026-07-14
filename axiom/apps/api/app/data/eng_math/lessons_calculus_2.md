# AXIOM Calculus II: Complete Lessons

Course C2, 16 lessons across 5 units, in the AXIOM teaching arc.

---

## Unit 1. Techniques of Integration

### C201. Substitution

Objective: integrate by reversing the chain rule, changing bounds in definite
integrals.

Build on: C118 and the chain rule (C108) run backward.

Core idea: when the integrand contains a function and its derivative, set u
equal to the inner function; du absorbs the derivative factor and the
integral simplifies. In a definite integral, convert the bounds to u-values
and never return to x.

Worked example: int 2x (x^2 + 1)^3 dx with u = x^2 + 1, du = 2x dx: int u^3
du = u^4/4 + C = (x^2 + 1)^4/4 + C.

Try it: int from 0 to 2 of 2x (x^2 + 1)^3 dx: what are the u-bounds?

Answer: u from 1 to 5; the value is (5^4 - 1)/4 = 156.

Pitfall: keeping the old bounds after substituting (C2M02) evaluates a
different integral. Change the bounds when you change the variable, as
diagnostic item C2-D2 drills.

### C202. Integration by parts

Objective: integrate products by reversing the product rule.

Build on: C107's product rule, integrated.

Core idea: int u dv = uv - int v du. Choose u as the factor that improves
when differentiated (powers of x, ln x) and dv as the factor you can
integrate (exponentials, trig). Applied to x^n times an exponential, each
pass lowers the power by one; n passes finish the job.

Worked example: int x e^x dx: u = x, dv = e^x dx gives x e^x - int e^x dx =
(x - 1) e^x + C. Differentiate to confirm; the template bank's verifier does.

Try it: for int x cos x dx, which factor is u?

Answer: u = x; the result is x sin x + cos x + C.

Pitfall: the minus sign and the u-dv assignment (C2M01). If the new integral
is harder than the old one, the assignment is backward; swap and retry.

### C203. Trigonometric integrals

Objective: integrate powers and products of trig functions with identity
strategy.

Build on: C201; identities create the u-substitutions.

Core idea: odd power of sine or cosine: peel one factor off for du and
convert the rest with sin^2 + cos^2 = 1. Even powers of both: half-angle
identities reduce the degree. For secant-tangent integrals the same game runs
on sec^2 = 1 + tan^2.

Worked example: int sin^3 x dx = int (1 - cos^2 x) sin x dx; with u = cos x:
-(u - u^3/3) + C = -cos x + cos^3 x / 3 + C.

Try it: which identity reduces int cos^2 x dx?

Answer: cos^2 x = (1 + cos 2x)/2, giving x/2 + sin 2x / 4 + C.

Pitfall: reaching for parts or brute force when one peeled factor and an
identity settle it. Classify the powers first; the strategy is mechanical
after that.

### C204. Trigonometric substitution

Objective: eliminate radicals of quadratics with sin, tan, and sec
substitutions.

Build on: C203; the substitution turns radicals into the trig integrals just
learned.

Core idea: sqrt(a^2 - x^2) calls for x = a sin(theta), sqrt(a^2 + x^2) for
x = a tan(theta), sqrt(x^2 - a^2) for x = a sec(theta): each choice
collapses the radical by a Pythagorean identity. Convert back with a labeled
right triangle.

Worked example: int dx / sqrt(4 - x^2) with x = 2 sin(theta): the integrand
becomes d(theta), so the answer is arcsin(x/2) + C.

Try it: which substitution handles sqrt(9 + x^2)?

Answer: x = 3 tan(theta), since 9 + 9 tan^2 = 9 sec^2.

Pitfall: forgetting dx also transforms (dx = a cos(theta) d(theta) and so
on). The radical is only half the substitution; the differential is the other
half.

### C205. Partial fractions

Objective: integrate rational functions by decomposing them.

Build on: polynomial factoring; C201 finishes each piece.

Core idea: a proper rational function with factored denominator splits into
simpler terms: A/(x - a) for each linear factor, with extra powers for
repeated factors and linear-over-quadratic terms for irreducible quadratics.
Solve for the constants by clearing denominators and substituting the roots;
each piece integrates to a logarithm or arctangent.

Worked example: 1/((x - 1)(x + 2)) = (1/3)/(x - 1) - (1/3)/(x + 2), so the
integral is (1/3) ln|x - 1| - (1/3) ln|x + 2| + C.

Try it: decompose 1/(x(x - 3)): what is the coefficient on 1/x?

Answer: -1/3, by substituting x = 0 after clearing.

Pitfall: decomposing an improper fraction (degree of top >= bottom) without
dividing first. Long division is step zero, not optional.

## Unit 2. Improper Integrals

### C206. Improper integrals

Objective: define and evaluate integrals over infinite ranges or across
unbounded integrands as limits.

Build on: C118; the FTC still runs, but under a limit.

Core idea: int from 1 to infinity means the limit of int from 1 to b as b ->
infinity; an unbounded integrand at an endpoint means the limit from inside.
The integral converges when the limit exists. The benchmark family: int of
1/x^p from 1 to infinity converges exactly when p > 1, the fact the series
tests of Unit 4 will borrow.

Worked example: int from 1 to infinity of 1/x^2 dx = lim (1 - 1/b) = 1. The
same computation with 1/x gives ln b -> infinity: divergent.

Try it: does int from 0 to 1 of 1/sqrt(x) dx converge?

Answer: yes, to 2; the p = 1/2 < 1 case converges at zero.

Pitfall: evaluating straight through an infinity or a singularity as if the
integral were proper (C2M03). No limit written, no credit earned, because no
meaning was assigned.

## Unit 3. Applications of Integration

### C207. Area between curves

Objective: compute areas bounded by curves, with intersection-driven bounds.

Build on: C118; the integrand is now a difference.

Core idea: the area between top and bottom curves is int (top - bottom) dx
between their intersections. Find intersections first; if the curves cross,
split the integral at the crossing so each piece keeps a consistent top.
Sideways regions integrate in y with right minus left.

Worked example: between y = x and y = x^2: intersections 0 and 1, area
int (x - x^2) dx = 1/2 - 1/3 = 1/6.

Try it: the curves y = 4 and y = x^2 intersect where?

Answer: x = -2 and 2; the enclosed area is int (4 - x^2) = 32/3.

Pitfall: integrating a difference that changes sign across the region gives
cancellation, not area. Intersections are not decoration; they are the
integration bounds.

### C208. Volumes of revolution

Objective: compute volumes by disks, washers, and shells, choosing the method
by geometry.

Build on: C207; the slices are now circles.

Core idea: revolving around an axis, a slice perpendicular to the axis is a
disk (pi r^2 dx) or a washer (pi (R^2 - r^2) dx) when there is a hole; a
slice parallel to the axis is a cylindrical shell (2 pi radius height dx).
Choose whichever makes the radius and height easy functions of the
integration variable.

Worked example: y = sqrt(x), 0 to 4, revolved about the x-axis: disks,
V = int pi x dx = 8 pi.

Try it: same region revolved about the y-axis: which method avoids solving
for x?

Answer: shells: V = int 2 pi x sqrt(x) dx from 0 to 4 = 128 pi / 5.

Pitfall: using the disk radius formula when the region does not touch the
axis (that is a washer), and mixing the axis of revolution with the
integration variable. Draw the slice; the drawing picks the formula.

### C209. Arc length and surface area

Objective: compute curve lengths and surfaces of revolution.

Build on: C201-C204, because these integrands are where techniques earn their
keep.

Core idea: arc length is int sqrt(1 + (y')^2) dx: the Pythagorean theorem
applied to infinitesimal steps. A surface of revolution multiplies each arc
element by its travel circle: int 2 pi y sqrt(1 + (y')^2) dx. The square root
makes most textbook examples deliberately chosen; expect the algebra to be
the work.

Worked example: y = (2/3) x^(3/2) on [0, 3]: 1 + (y')^2 = 1 + x, and the
length is int sqrt(1 + x) dx = (2/3)(8 - 1) = 14/3.

Try it: set up (do not evaluate) the length of y = x^2 on [0, 1].

Answer: int from 0 to 1 of sqrt(1 + 4x^2) dx.

Pitfall: squaring y' and forgetting the 1 under the root, which computes
nothing geometric. The 1 is the dx of the Pythagorean triangle.

## Unit 4. Sequences and Series

### C210. Sequences and convergence

Objective: compute limits of sequences and use monotone-bounded reasoning.

Build on: C104's limits at infinity, now on integer inputs.

Core idea: a sequence converges when its terms approach one number.
Techniques transfer from C104 (leading terms, growth hierarchy: factorials
beat exponentials beat powers beat logs). The monotone convergence fact:
increasing and bounded above forces convergence, existence without a formula.

Worked example: a_n = (2n + 1)/(n + 3) -> 2; and n!/10^n -> infinity because
factorials outgrow exponentials.

Try it: does a_n = (-1)^n converge?

Answer: no; it oscillates between two values forever.

Pitfall: confusing the sequence with the series built from it. The sequence
1/n converges (to 0); the series sum 1/n diverges. Unit 4 lives in that gap.

### C211. Series and geometric series

Objective: define series convergence by partial sums and master the geometric
series.

Build on: C210; a series converges when its partial-sum sequence does.

Core idea: sum a r^n from n = 0 converges exactly when |r| < 1, to
a/(1 - r): the one series family with a clean closed form, and the workhorse
under power series, finance, and signal decay. Telescoping series are the
other exactly summable family: partial sums collapse.

Worked example: 3 - 3/2 + 3/4 - ... has a = 3, r = -1/2: sum = 3/(3/2) = 2.

Try it: sum of 5 (1/4)^n from n = 0.

Answer: 20/3.

Pitfall: treating an infinite series like a long finite sum (C2M07):
rearranging, grouping, and cancelling are only licensed by absolute
convergence, which C213 defines.

### C212. Integral and comparison tests

Objective: settle convergence by comparison to integrals and to known
series.

Build on: C206 supplies the integral benchmarks.

Core idea: for positive decreasing terms, the series and the improper
integral of the matching function converge or diverge together, which is how
p-series inherit the p > 1 rule. Comparison: smaller than convergent
converges, bigger than divergent diverges; limit comparison handles messy
terms by comparing growth rates instead of values.

Worked example: sum 1/(n^2 + 3) converges by comparison with 1/n^2; sum
1/sqrt(n) diverges as a p = 1/2 series.

Try it: does the terms-go-to-zero fact for 1/n prove sum 1/n converges?

Answer: no; the harmonic series diverges. Terms to zero is necessary, never
sufficient.

Pitfall: the nth-term test run backward (C2M04), the single most durable
series misconception, and diagnostic item C2-D1's target.

### C213. Ratio, root, and alternating tests

Objective: choose and apply the remaining tests; distinguish absolute from
conditional convergence.

Build on: C212's toolkit, extended to signs and factorials.

Core idea: ratio test: L = lim |a_(n+1)/a_n| decides (L < 1 converges,
L > 1 diverges, L = 1 silence), and it is the right tool whenever factorials
or n-th powers appear. Alternating series with terms decreasing to zero
converge. Absolute convergence (the absolute-value series converges) is the
strong kind; convergent-but-not-absolutely is conditional, and only absolute
convergence licenses rearrangement.

Worked example: sum n/2^n: ratio -> 1/2 < 1: converges. Sum (-1)^n / n:
converges by the alternating test, but only conditionally (the harmonic
series diverges).

Try it: what does the ratio test say about sum 1/n^2?

Answer: L = 1: nothing. Use the p-series fact instead.

Pitfall: reading L = 1 as a verdict (C2M05). The ratio test's silence is
loud precisely on the p-series family where students most want it to speak.

### C214. Power series and convergence intervals

Objective: find the radius and interval of convergence, endpoints included.

Build on: C213; the ratio test applied to power series is the whole method.

Core idea: a power series sum c_n (x - a)^n converges on an interval
centered at a. Run the ratio test in x: the condition L < 1 solves to
|x - a| < R, the radius. The endpoints x = a - R and a + R are where the
ratio test goes silent; substitute each and test the resulting numeric
series individually.

Worked example: sum x^n / n: ratio gives |x| < 1; at x = 1 the harmonic
series diverges, at x = -1 the alternating harmonic converges: interval
[-1, 1).

Try it: what is the radius of convergence of sum x^n / n!?

Answer: infinite; the ratio |x|/(n + 1) -> 0 for every x.

Pitfall: stating the open interval and skipping the endpoints (C2M06). The
endpoints are two extra minutes and the difference between right and almost.

### C215. Taylor and Maclaurin series

Objective: build series from derivatives and command the standard library.

Build on: C112's tangent line, extended to all orders; C214 says where the
result is valid.

Core idea: the Taylor coefficient of (x - a)^k is f^(k)(a)/k!: the series is
the polynomial that matches every derivative at the center. The standard
library to know cold: e^x = sum x^n/n!, sin and cos as the odd and even
alternating series, 1/(1 - x) as the geometric series, ln(1 + x) as its
integral. New series come from old by substitution, multiplication,
differentiation, and integration: rederiving from scratch is the slow path.

Worked example: e^(-x^2) = sum (-1)^n x^(2n)/n! by substituting into the
exponential series: the integrand of the Gaussian, series-integrated in
practice exactly this way.

Try it: the Maclaurin series of cos x through degree 4.

Answer: 1 - x^2/2 + x^4/24.

Pitfall: centering errors: a Maclaurin series evaluated far from zero, or
Taylor coefficients computed at the wrong point. The center is part of the
answer (C2M08 adjacent).

### C216. Taylor approximation and error

Objective: bound truncation error and decide how many terms a target
accuracy needs.

Build on: C215; an approximation without an error bar is a guess.

Core idea: truncating after degree n leaves a remainder bounded by
M |x - a|^(n+1) / (n + 1)!, with M bounding the next derivative on the
interval. Alternating series are friendlier still: the error is at most the
first omitted term. This is the difference between an approximation and an
answer, and it is the habit numerical work (LA28's conditioning mindset)
depends on.

Worked example: sin x by x - x^3/6 at x = 0.5: alternating, so the error is
below 0.5^5/120, about 0.00026: three digits guaranteed, cheaply.

Try it: approximating e with 1 + 1 + 1/2 + 1/6, the next term bounds nothing
by alternation. Which bound applies?

Answer: the Lagrange remainder with M = e on [0, 1]: error at most e/24.

Pitfall: quoting a Taylor polynomial with no statement of where and how much
it errs (C2M08). "About 7.029" plus a bound is engineering; without one it
is decoration.
