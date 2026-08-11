#!/usr/bin/env python3
"""Depth expansion for the FE EE Mathematics section (11-17 questions).

One appended section per topic, each carrying a figure, at least one reference
table, and worked arithmetic that has been checked rather than asserted. Run
once; re-running skips topics whose section id is already present.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from fe_ee_expand import apply  # noqa: E402


def sec(sid, title, body, tip=None, note=None):
    parts = ["{", "  id: '%s'," % sid, "  title: '%s'," % title,
             "  content: `%s`," % body.strip()]
    if tip:
        parts.append("  examTip: '%s'," % tip.replace("'", "\\'"))
    if note:
        parts.append("  importantNote: '%s'," % note.replace("'", "\\'"))
    parts.append("}")
    return "\n".join(parts)


EXPANSIONS = {

# ---------------------------------------------------------------- algebra
'fee_algebra_trig': sec('at-depth', '4. The Unit Circle as a Working Tool', r"""
## 4.1 Why this one picture carries the section

Trigonometry on the FE exam is almost never asked for its own sake. It arrives
inside a phasor, a power factor, a three-phase angle or a Fourier coefficient,
and in every one of those the same small set of values does the work.

![The unit circle with the exam's five first-quadrant angles, each labelled with its exact cosine and sine. The remaining marked points are reflections of those five into the other three quadrants.](/courses/fe-ee/figures/math-unit-circle.svg)

The circle is worth reading as a definition rather than a mnemonic. A point on
it at angle theta has coordinates **(cos theta, sin theta)** — that *is* what
the two functions mean. Everything else follows:

- **sin² + cos² = 1** is the Pythagorean theorem applied to that point.
- **tan theta = sin/cos** is the slope of the ray, which is why it blows up at
  90° where the ray is vertical.
- The sign of each function in each quadrant is the sign of the corresponding
  coordinate. There is nothing to memorise beyond which coordinate is which.

## 4.2 The five angles, and the rest by reflection

Only five first-quadrant angles have exact values worth carrying, and every
other angle the exam uses is one of them reflected:

| theta | cos | sin | tan | Where it shows up |
|---|---|---|---|---|
| 0° | 1 | 0 | 0 | purely resistive, unity power factor |
| 30° | √3/2 ≈ 0.866 | 1/2 | 1/√3 ≈ 0.577 | pf = 0.866 lagging |
| 45° | √2/2 ≈ 0.707 | √2/2 | 1 | equal R and X; half-power point |
| 60° | 1/2 | √3/2 ≈ 0.866 | √3 ≈ 1.732 | 120° three-phase geometry |
| 90° | 0 | 1 | undefined | purely reactive, zero real power |

Note that **0.707 and 0.866 are the two decimals to recognise on sight**. A
power factor of 0.707 means a 45° angle and equal real and reactive power; 0.866
means 30° and Q = P/√3. Recognising the decimal saves an inverse-cosine keypress
on a calculator you are already using too much.

## 4.3 Rectangular to polar, with the quadrant discipline

This conversion appears in every phasor problem, and the single most common
error is trusting the calculator's arctangent.

**Convert 3 − j4.** The magnitude is √(3² + 4²) = √25 = **5**. The angle is
arctan(−4/3) = **−53.13°**. Both x and y checks agree: x = 3 > 0 and y = −4 < 0
put the point in quadrant IV, and −53.13° is in quadrant IV. Accept it.

**Convert −3 + j4.** The magnitude is again 5. But arctan(4/−3) = arctan(−1.333)
= **−53.13°**, which is wrong. The point has x < 0 and y > 0, so it is in
quadrant II, and the answer is −53.13° + 180° = **126.87°**.

| Signs of (x, y) | Quadrant | Correction to arctan(y/x) |
|---|---|---|
| (+, +) | I | none |
| (−, +) | II | **add 180°** |
| (−, −) | III | **subtract 180°** (or add 180°) |
| (+, −) | IV | none |

The rule in one line: **arctan only knows the ratio, so it cannot tell (−3, 4)
from (3, −4).** Look at the signs before you accept the angle. Every calculator
has this behaviour and no calculator warns you about it.

## 4.4 Going the other way, and the identities that matter

Polar to rectangular has no such trap: x = r cos theta, y = r sin theta,
directly. **5∠126.87°** gives x = 5(−0.6) = −3 and y = 5(0.8) = 4, recovering
the number we started from — which is the check to run whenever a conversion
matters.

Three identity groups earn their place in an electrical context:

**Angle addition** — sin(A ± B) = sinA cosB ± cosA sinB and
cos(A ± B) = cosA cosB ∓ sinA sinB. These are what makes phasor addition legal:
two sinusoids at the same frequency add to another sinusoid at that frequency,
and nothing else does.

**Power reduction** — sin²theta = (1 − cos 2theta)/2. This is the algebra behind
average power. Instantaneous power in a resistor is i²R, and squaring a sinusoid
produces a DC term plus a term at *twice* the frequency. The DC term is the
average power; the 2ω term averages to zero. That is why real power involves a
factor of 1/2 with peak values, or no factor at all with RMS values.

**Double angle** — sin 2A = 2 sinA cosA, which is why the 2ω ripple in
single-phase instantaneous power exists at all, and why three-phase power is
constant while single-phase power pulsates.

## 4.5 Logarithms, because decibels are everywhere

The exam uses logarithms almost exclusively for gain in decibels, and mixes two
definitions that differ by a factor of two:

| Quantity | Decibel formula | 2× becomes | 10× becomes |
|---|---|---|---|
| Power ratio | 10 log₁₀(P₂/P₁) | +3.01 dB | +10 dB |
| Voltage or current ratio | 20 log₁₀(V₂/V₁) | +6.02 dB | +20 dB |

The factor of 20 for voltage is not a different rule — it is the same rule,
because power goes as V², and 10 log(V²) = 20 log(V). A common trap gives a
voltage ratio and asks for dB, offering both 6 dB and 3 dB as choices.

Two anchors make most dB questions mental arithmetic: **3 dB is a factor of 2 in
power**, and **6 dB is a factor of 2 in voltage**. A 40 dB voltage gain is
therefore 10², or 100; a −3 dB point is where power has halved and voltage has
fallen to 0.707 of its peak — the same 0.707 that appeared in the unit circle
table above, and for the same reason.
""",
tip='Before accepting any arctangent, look at the signs of x and y. The calculator returns an angle in (-90, 90) only, so quadrants II and III always need a 180 degree correction. This single check prevents more lost marks in AC circuit analysis than any other habit.',
note='0.707 and 0.866 should be recognised instantly. 0.707 is cos 45 and also 1/sqrt(2): equal resistance and reactance, the half-power point, and the RMS-to-peak ratio of a sinusoid. 0.866 is cos 30 and sqrt(3)/2, which is where the sqrt(3) in three-phase relationships comes from.'),

# ---------------------------------------------------------------- complex
'fee_complex': sec('cx-depth', '4. Choosing a Form, and Paying for the Wrong One', r"""
## 4.1 The same number, four ways

A complex number has one value and several spellings, and picking the wrong
spelling turns a ten-second operation into a two-minute one.

| Form | Written | Best for |
|---|---|---|
| Rectangular | a + jb | addition, subtraction |
| Polar | r∠theta | multiplication, division |
| Trigonometric | r(cos theta + j sin theta) | seeing the connection |
| Exponential | r·e^(j·theta) | calculus, derivations |

![Four complex numbers of equal magnitude 5, one in each quadrant, with the angle each one carries. The magnitude alone cannot distinguish them.](/courses/fe-ee/figures/math-complex-quadrants.svg)

## 4.2 The rule, and why it is a rule

**Add in rectangular. Multiply in polar.** This is not a stylistic preference —
it follows from what the operations do.

Addition acts on the components independently: (a + jb) + (c + jd) = (a+c) +
j(b+d). In polar form there is no comparable shortcut; you would convert to
rectangular, add, and convert back, which is the long way round with two extra
chances to lose a quadrant.

Multiplication acts on magnitude and angle independently:
r₁∠θ₁ × r₂∠θ₂ = r₁r₂∠(θ₁+θ₂). **Magnitudes multiply, angles add.** In
rectangular form the same operation needs four products and the j² = −1
substitution.

## 4.3 One number pair, both ways, checked against each other

Take z₁ = 3 + j4 and z₂ = 5 − j2.

**Sum, in rectangular.** (3+5) + j(4−2) = **8 + j2**. Done in one line.

**Product, in polar.** First convert:
z₁ = √(9+16) ∠ arctan(4/3) = 5∠53.13°, and
z₂ = √(25+4) ∠ arctan(−2/5) = 5.385∠−21.80°.
Then z₁z₂ = (5)(5.385) ∠ (53.13 − 21.80) = **26.93∠31.33°**.

**The same product, in rectangular, as a check.**
(3+j4)(5−j2) = 15 − j6 + j20 − j²8 = 15 + j14 + 8 = **23 + j14**.
Its magnitude is √(529 + 196) = √725 = 26.93, and its angle is
arctan(14/23) = 31.33°. The two routes agree exactly, which is the point:
when a phasor answer matters, converting back and comparing costs fifteen
seconds and catches sign errors that nothing else will.

## 4.4 Where this lands in circuits

Impedances in **series** add, so keep them rectangular:
Z = R + j(X_L − X_C), and the real and imaginary parts stay separately
meaningful — R dissipates, X stores.

Impedances in **parallel** combine through products and quotients, so polar
pays. For two branches, Z = Z₁Z₂/(Z₁+Z₂) needs one product (polar), one sum
(rectangular), and one quotient (polar) — so a realistic problem uses both
forms, converting once at each junction rather than committing to one.

| Operation on impedances | Form to use | Why |
|---|---|---|
| Series combination | rectangular | components add independently |
| Parallel product Z₁Z₂ | polar | magnitudes multiply, angles add |
| Parallel sum Z₁+Z₂ | rectangular | addition has no polar shortcut |
| Dividing V by Z for current | polar | magnitudes divide, angles subtract |
| Real power from V and I | polar | the angle *between* them is what you need |

## 4.5 Euler, and why j is a rotation

e^(jθ) = cos θ + j sin θ turns the whole subject into one statement:
**multiplying by e^(jθ) rotates by θ without changing magnitude.**

The special case θ = 90° gives e^(j90°) = j. So multiplying by j is a 90°
counter-clockwise rotation, and that is the entire content of the reactance
sign convention:

- An inductor's impedance is jωL — the voltage leads the current by 90°.
- A capacitor's is 1/(jωC) = −j/(ωC) — the voltage lags by 90°.

The j is not bookkeeping; it is the phase relationship written as arithmetic.
Reactances of opposite sign subtract in series for the same reason two rotations
in opposite directions cancel, and when they cancel exactly you have resonance.

## 4.6 Conjugates and the two places they appear

The conjugate of a + jb is a − jb: same magnitude, opposite angle. Two uses
recur.

**Dividing.** Multiply top and bottom by the denominator's conjugate to make the
denominator real: (1)/(3+j4) = (3−j4)/((3+j4)(3−j4)) = (3−j4)/25 =
0.12 − j0.16. The denominator became 3² + 4² = 25, which is |z|², always real.

**Maximum power transfer in AC.** The load that draws the most power from a
source of impedance Z_s = R_s + jX_s is Z_L = **Z_s\\***, the conjugate:
R_L = R_s and X_L = −X_s. The reactance is cancelled, not matched — the load
must be as inductive as the source is capacitive, or vice versa, so that the
combination is purely resistive. Matching the reactance in sign, rather than
cancelling it, is a common distractor.
""",
tip='Add in rectangular, multiply in polar. If a problem forces both, convert at the junction rather than committing to one form: converting is cheap, and doing a four-term rectangular multiplication under time pressure is where sign errors come from.',
note='For AC maximum power transfer the load must be the complex CONJUGATE of the source impedance, Z_L = R_s - jX_s. The reactance is cancelled, not copied. An answer choice offering Z_L = Z_s exactly is there for candidates who remember the DC rule and stop thinking.'),

# ---------------------------------------------------------------- discrete
'fee_discrete_math': sec('dm-depth', '4. Counting Without Guessing', r"""
## 4.1 Four questions that pick the formula

Counting problems are easy to get wrong by picking a formula that feels right.
Two yes/no questions settle it every time: **does order matter**, and **may
items repeat**.

| Order matters? | Repetition? | Formula | Count for n=5, k=2 |
|---|---|---|---|
| yes | yes | n^k | 25 |
| yes | no | P(n,k) = n!/(n−k)! | 20 |
| no | no | C(n,k) = n!/(k!(n−k)!) | 10 |
| no | yes | C(n+k−1, k) | 15 |

Read the four counts for the same n and k: they differ by more than a factor of
two across the table, so the formula choice matters more than the arithmetic.

The relationship between the middle two is worth holding: **P(n,k) = C(n,k)·k!**
Permutations are combinations that have then been arranged. For n=8, k=3:
C(8,3) = 56 and P(8,3) = 336, and 336/56 = 6 = 3!, exactly as the identity
requires.

## 4.2 Binomial coefficients, and the structure behind them

![Pascal's triangle to row seven, with every entry computed as the binomial coefficient C(n,k). Each entry equals the sum of the two entries above it, and row n sums to 2 to the power n.](/courses/fe-ee/figures/math-pascal-triangle.svg)

Two facts in that picture answer a surprising number of exam questions.

**Each entry is the sum of the two above it**: C(n,k) = C(n−1,k−1) + C(n−1,k).
The reason is a case split — either a particular item is in your selection (then
choose k−1 from the remaining n−1) or it is not (choose k from n−1). Being able
to reconstruct C(6,3) = 10 + 10 = 20 from the row above is faster than the
factorials when the numbers are small.

**Row n sums to 2ⁿ.** Summing C(n,k) over all k counts every possible subset of
an n-element set, and each element is independently in or out, giving 2ⁿ. For a
digital-systems flavoured question: an 8-bit word has 2⁸ = 256 possible values,
and the number of those with exactly three bits set is C(8,3) = **56**.

## 4.3 Worked: the same set of items, four questions

Eight components are on a bench, all distinguishable.

**Choose 3 for a test fixture, order irrelevant.**
C(8,3) = (8·7·6)/(3·2·1) = 336/6 = **56**.

**Arrange 3 of them in a row, order matters.**
P(8,3) = 8·7·6 = **336**.

**Assign 3 labelled roles, reuse allowed.**
8³ = **512**.

**How many subsets of any size?**
2⁸ = **256**.

Notice 512 > 336: allowing repetition adds more possibilities than requiring
distinct items removes. And note 256 < 336, which is a useful sanity check on
intuition — "all subsets" sounds larger than "ordered triples" but is not.

## 4.4 Set identities, and the inclusion-exclusion trap

For two sets, **|A ∪ B| = |A| + |B| − |A ∩ B|**. The subtraction is there
because elements in both were counted twice. In a survey-style question — 60
students take circuits, 45 take electronics, 20 take both — the number taking at
least one is 60 + 45 − 20 = **85**, not 105.

De Morgan's laws connect this to digital logic directly, and appear on the exam
in both notations:

| Set form | Boolean form | Plain statement |
|---|---|---|
| (A ∪ B)' = A' ∩ B' | (A + B)' = A'·B' | NOR is AND of the complements |
| (A ∩ B)' = A' ∪ B' | (A·B)' = A' + B' | NAND is OR of the complements |

They are the same theorem. A question in Digital Systems asking you to convert
a NAND network to OR gates and a question in Mathematics asking for the
complement of an intersection are testing one fact.

## 4.5 Logic, briefly but precisely

Three statements built from "if P then Q" are constantly confused:

| Name | Form | Equivalent to the original? |
|---|---|---|
| Converse | if Q then P | **no** |
| Inverse | if not P then not Q | **no** |
| Contrapositive | if not Q then not P | **yes** |

Only the contrapositive is logically equivalent, and this is what proof by
contradiction rests on. "If the circuit is shorted, the fuse blows" is
equivalent to "if the fuse did not blow, the circuit is not shorted" — and is
*not* equivalent to "if the fuse blew, the circuit is shorted," since the fuse
may have blown for another reason. The exam tests exactly that distinction.
""",
tip='Ask two questions before writing any counting formula: does order matter, and can items repeat. The four answers give four different formulas, and for n=5, k=2 they give 25, 20, 15 and 10 - so choosing wrongly is not a small error.',
note='P(n,k) = C(n,k) x k!. If you can only remember one, remember the combination formula and multiply by k! when order matters. Checking that P is larger than C by exactly k! catches an inverted formula instantly.'),

# ------------------------------------------------------------ analytic geom
'fee_analytic_geom': sec('ag-depth', '4. Recognising a Conic From Its Equation', r"""
## 4.1 One family, four curves

The general second-degree equation Ax² + Cy² + Dx + Ey + F = 0 (with no xy
term) produces every conic the exam uses. Which one you get is decided entirely
by A and C:

| Condition on A and C | Curve | Standard form |
|---|---|---|
| A = C, same sign | circle | (x−h)² + (y−k)² = r² |
| A ≠ C, same sign | ellipse | (x−h)²/a² + (y−k)²/b² = 1 |
| A or C is zero | parabola | (x−h)² = 4p(y−k) |
| A and C opposite signs | hyperbola | (x−h)²/a² − (y−k)²/b² = 1 |

![The four conic sections drawn together from their standard forms: a circle of radius 2, an ellipse, a parabola and a hyperbola. Only the signs and the relative coefficients differ between them.](/courses/fe-ee/figures/math-conic-sections.svg)

The one-line test: **look at the signs first, the coefficients second.**
Opposite signs mean a hyperbola no matter what else is true; a missing squared
term means a parabola; equal coefficients with the same sign mean a circle.

## 4.2 Completing the square, done once carefully

Almost every conic question requires converting the general form to the standard
form, and completing the square is the only tool needed.

**Identify the curve of x² + y² − 6x + 4y − 12 = 0.**

A = C = 1, same sign, so it is a circle. Group and complete:

x² − 6x + y² + 4y = 12

For x: half of −6 is −3, squared is 9. For y: half of 4 is 2, squared is 4. Add
both to *each* side:

(x² − 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4

(x − 3)² + (y + 2)² = **25**

So the centre is **(3, −2)** and the radius is **5**. Note the sign flip: the
equation reads (y + 2)², so k = −2, not +2. That flip is the single most common
error in this topic, and it costs the whole question because the centre is
usually what is asked for.

**Check it.** The point (3, 3) should be on the circle, since it is 5 above the
centre. Substituting into the original: 9 + 9 − 18 + 12 − 12 = 0. It is.

## 4.3 The straight-line toolkit

Lines carry more exam weight than conics, mostly inside other topics — load
lines, linear regression, small-signal approximations.

| Quantity | Formula |
|---|---|
| Slope through two points | m = (y₂ − y₁)/(x₂ − x₁) |
| Point-slope form | y − y₁ = m(x − x₁) |
| Slope-intercept form | y = mx + b |
| Distance between points | d = √((x₂−x₁)² + (y₂−y₁)²) |
| Midpoint | ((x₁+x₂)/2, (y₁+y₂)/2) |
| Distance from point to line Ax+By+C=0 | \\|Ax₀+By₀+C\\|/√(A²+B²) |

Two relationships between lines are asked directly:

- **Parallel** lines have equal slopes: m₁ = m₂.
- **Perpendicular** lines have slopes whose product is −1: m₁m₂ = −1, so
  m₂ = −1/m₁.

A line of slope 2 is perpendicular to one of slope −1/2, not −2. The negative
*reciprocal*, not the negative, is the rule, and the distractor is always there.

## 4.4 Worked: a load line, which is this topic in disguise

A 12 V source with 4 kΩ series resistance drives a nonlinear device. The load
line is the I-V relation the *circuit* imposes: by KVL, 12 = 4000·I + V, so

I = (12 − V)/4000

Two points fix the line. At V = 0, I = 12/4000 = **3 mA** (the short-circuit
current). At I = 0, V = **12 V** (the open-circuit voltage). The slope is
−1/4000 A/V, i.e. **−0.25 mA/V** — negative, and its magnitude is the reciprocal
of the resistance.

That is a straight line through (0 V, 3 mA) and (12 V, 0 mA), and the operating
point is where it crosses the device's own curve. The mathematics is
point-slope; the physics is Thevenin. Recognising that a "graphical analysis"
question is really an intercepts question is what makes it quick.

## 4.5 Three-dimensional distance, and where it appears

Extending the distance formula to three dimensions adds one term:
d = √((Δx)² + (Δy)² + (Δz)²). This appears in electromagnetics for the
separation between charges in Coulomb's law, and in vector analysis as the
magnitude of a vector — |**A**| = √(Aₓ² + A_y² + A_z²) is the distance formula
from the origin, not a separate rule to learn.
""",
tip='Completing the square flips the sign: (y + 2)^2 means the centre coordinate is MINUS 2. Write the standard form as (x - h)^2 + (y - k)^2 and read h and k off it directly rather than reading the numbers you see in the equation.',
note='Perpendicular slopes are negative RECIPROCALS, m2 = -1/m1, not negatives. A line of slope 2 is perpendicular to one of slope -0.5. Every FE question on this offers -2 as a distractor.'),

# ------------------------------------------------------------- differential
'fee_diff_calc': sec('dc-depth', '4. Derivatives as an Engineering Instrument', r"""
## 4.1 Reading a function through its derivatives

Optimisation questions on the FE exam are mechanical once the structure is
clear, and the structure is best seen with all three curves stacked:

![A cubic, its first derivative and its second derivative drawn one above another on a shared x axis. The zeros of the first derivative line up with the turning points of the function, and the sign change of the second derivative locates the inflection.](/courses/fe-ee/figures/math-derivative-extrema.svg)

The procedure the picture encodes:

1. **f′ = 0 locates** candidate extrema. For f = x³ − 3x, f′ = 3x² − 3 = 0 gives
   x = ±1.
2. **f″ classifies** them. f″ = 6x, so f″(−1) = −6 < 0 (**maximum**) and
   f″(+1) = +6 > 0 (**minimum**).
3. **f″ = 0 with a sign change** is an inflection: here x = 0.

| f″ at a critical point | Meaning | Shape |
|---|---|---|
| negative | local maximum | concave down |
| positive | local minimum | concave up |
| zero | test is inconclusive | check f′ signs either side |

The mnemonic that survives exam pressure: **a positive second derivative holds
water.** Concave up is a minimum.

## 4.2 The rules, compactly

| Rule | Statement |
|---|---|
| Power | d/dx xⁿ = n xⁿ⁻¹ |
| Product | (uv)′ = u′v + uv′ |
| Quotient | (u/v)′ = (u′v − uv′)/v² |
| Chain | d/dx f(g(x)) = f′(g(x))·g′(x) |
| Exponential | d/dx e^(kx) = k e^(kx) |
| Logarithm | d/dx ln x = 1/x |
| Sine, cosine | d/dx sin x = cos x; d/dx cos x = −sin x |

The quotient rule's numerator order matters: **u′v − uv′**, and reversing it
flips the sign of every answer. If it is easier to remember, write u/v as u·v⁻¹
and use the product and chain rules instead — the result is identical and the
sign takes care of itself.

## 4.3 Worked: maximum power transfer, derived rather than recalled

A source of open-circuit voltage V and internal resistance R_s drives a load
R_L. The current is I = V/(R_s + R_L), so the load power is

P = I²R_L = V²R_L / (R_s + R_L)²

Differentiate with respect to R_L using the quotient rule, with u = V²R_L and
v = (R_s + R_L)²:

dP/dR_L = [V²(R_s + R_L)² − V²R_L·2(R_s + R_L)] / (R_s + R_L)⁴

Cancel one factor of (R_s + R_L) from every term:

dP/dR_L = V²[(R_s + R_L) − 2R_L] / (R_s + R_L)³ = V²(R_s − R_L)/(R_s + R_L)³

Setting the numerator to zero gives **R_L = R_s**, and substituting back gives
P_max = V²R_s/(2R_s)² = **V²/(4R_s)**.

This is the same result the Network Theorems topic states as a rule. Deriving it
takes about ninety seconds and, more usefully, shows *why* the peak is broad:
the numerator is linear in (R_s − R_L) while the denominator is cubic, so P
falls away from the peak gently rather than sharply.

## 4.4 Related rates, and the one setup step that matters

Related-rate questions read as physical but are pure chain rule. The step that
decides the outcome is writing the geometric relationship **before**
differentiating, not after.

A circular oil slick spreads so its radius grows at 0.5 m/s. How fast is the
area growing when r = 20 m?

Relationship first: A = πr². Differentiate with respect to time:

dA/dt = 2πr · dr/dt = 2π(20)(0.5) = 20π ≈ **62.8 m²/s**

The rate depends on r, so "how fast is the area growing" has no single answer —
it grows faster as the slick gets bigger. A question that omits the radius is
testing whether you noticed that.

## 4.5 L'Hopital, and when it does not apply

For limits of the indeterminate forms **0/0** or **∞/∞**, differentiate
numerator and denominator separately and re-evaluate:

lim(x→0) sin x / x = lim(x→0) cos x / 1 = **1**

The restriction is strict. The form must be indeterminate before you may apply
the rule. lim(x→0) (x + 1)/x is 1/0, which is not indeterminate — it diverges,
and differentiating top and bottom would give the wrong answer of 1. Checking
that you actually have 0/0 or ∞/∞ before differentiating is the whole discipline
of this technique.
""",
tip='A positive second derivative holds water: concave up, so a minimum. If the second derivative is zero the test tells you nothing and you must check the sign of f-prime on either side of the point.',
note='L Hopital applies ONLY to 0/0 and infinity/infinity. Substitute first and confirm you have an indeterminate form. Applying it to 1/0 or 0/1 produces a confident wrong answer, which is exactly what the distractors are built from.'),

# ---------------------------------------------------------------- integral
'fee_int_calc': sec('ic-depth', '4. Integration Where Electrical Problems Need It', r"""
## 4.1 Signed area, and the question actually being asked

Integration means signed area, and forgetting the sign produces answers that are
not merely inaccurate but qualitatively wrong:

![One period of a sine wave with the positive and negative lobes shaded separately. The two areas are equal and opposite, so the integral over the period is zero even though the total area is four.](/courses/fe-ee/figures/math-integral-area.svg)

Over a full period, ∫sin x dx = 0 — the lobes cancel. The *area* is 4. These are
different questions and the exam asks both. A DC-blocking capacitor works
precisely because the average of a symmetric AC waveform is zero; a rectifier
exists precisely because the area is not.

## 4.2 The techniques worth carrying

| Integral | Result |
|---|---|
| ∫xⁿ dx (n ≠ −1) | xⁿ⁺¹/(n+1) + C |
| ∫(1/x) dx | ln\\|x\\| + C |
| ∫e^(kx) dx | (1/k)e^(kx) + C |
| ∫sin(kx) dx | −(1/k)cos(kx) + C |
| ∫cos(kx) dx | (1/k)sin(kx) + C |
| ∫sin²(kx) dx | x/2 − sin(2kx)/(4k) + C |

The last one is not a separate fact: apply the power-reduction identity
sin² = (1 − cos 2θ)/2 first, and it becomes two integrals you already know. Any
integral of a squared sinusoid is done this way, and that is the route to RMS.

**Substitution** handles composites: for ∫2x·e^(x²) dx, let u = x², so du = 2x dx
and the integral is ∫e^u du = e^u + C = **e^(x²) + C**. The signal that
substitution will work is seeing a function *and its derivative* both present.

**Integration by parts**, ∫u dv = uv − ∫v du, handles products of unlike things —
a polynomial times an exponential, or a polynomial times a trigonometric
function. Choose u to be the factor that gets simpler when differentiated.

## 4.3 Worked: RMS from first principles

RMS is defined by its name read backwards — root of the mean of the square:

V_rms = √( (1/T) ∫₀^T v(t)² dt )

**For a sinusoid v = V_m sin(ωt).** Square it and use power reduction:

v² = V_m² sin²(ωt) = V_m²(1 − cos 2ωt)/2

Over a whole period the cos 2ωt term integrates to zero, leaving the mean square
as V_m²/2. Taking the root:

V_rms = V_m/√2 = **0.707 V_m**

**For a square wave** of amplitude ±V_m, the square is V_m² at every instant, so
the mean square is V_m² and V_rms = **V_m**. No factor at all.

**For a symmetric triangle wave** of peak V_m, the same integral gives
V_rms = **V_m/√3 ≈ 0.577 V_m**.

| Waveform | V_rms | V_avg (full-wave rectified) | Form factor |
|---|---|---|---|
| Sine | 0.707 V_m | 0.637 V_m | 1.11 |
| Square | 1.000 V_m | 1.000 V_m | 1.00 |
| Triangle | 0.577 V_m | 0.500 V_m | 1.15 |
| Half-wave rectified sine | 0.500 V_m | 0.318 V_m | 1.57 |

**The 0.707 factor is not universal**, and this is the trap. A question that
gives a square-wave source and asks for RMS is checking whether you divided by
√2 out of habit. The number depends on the shape, and the table above is the
whole answer set the exam draws from.

## 4.4 Average value, and why 0.637 appears

The average of a full-wave rectified sine is

V_avg = (1/π)∫₀^π V_m sin θ dθ = (V_m/π)[−cos θ]₀^π = (V_m/π)(1 + 1) = 2V_m/π

which is **0.637 V_m**. This is what a moving-coil DC meter responds to, while a
true-RMS meter responds to 0.707 V_m. The ratio of the two, 0.707/0.637 = 1.11,
is the **form factor**, and it is why an averaging meter calibrated for sine
waves reads incorrectly on any other waveform. A question describing a
"rectifier-type meter" reading a triangle wave is testing exactly this.

## 4.5 Where integrals appear as circuit elements

Integration is not an abstract operation in this exam; two element laws are
integrals:

- **Capacitor**: v(t) = (1/C)∫i dt. Voltage is the accumulated charge, which is
  why capacitor voltage cannot jump — an integral of a finite quantity is
  continuous.
- **Inductor**: i(t) = (1/L)∫v dt. Current is the accumulated flux linkage, for
  the same reason.

Both continuity rules that transient analysis depends on are consequences of
these being integrals, rather than separate facts to memorise. Energy is an
integral too: W = ∫p dt, giving ½CV² and ½LI² for the two storage elements.
""",
tip='The 0.707 RMS factor applies to SINE waves only. Square wave RMS equals the peak; triangle is peak over root three. A question that specifies a non-sinusoidal source and offers 0.707 times peak as a choice is testing whether you read the waveform.',
note='Capacitor voltage and inductor current are integrals of finite quantities, which is exactly why neither can change instantaneously. The two continuity rules used throughout transient analysis are one calculus fact, not two circuit rules.'),

# ----------------------------------------------------------------- diffeq
'fee_diffeq': sec('de-depth', '4. From Characteristic Roots to Circuit Behaviour', r"""
## 4.1 The characteristic equation decides everything

A second-order linear ODE with constant coefficients,
a·y″ + b·y′ + c·y = 0, is solved by assuming y = e^(st). Substituting gives
(as² + bs + c)e^(st) = 0, and since the exponential is never zero:

**as² + bs + c = 0**

The roots of that quadratic are the entire behaviour of the system. The
discriminant b² − 4ac decides which of three cases you are in:

| Discriminant | Roots | Response | Circuit name |
|---|---|---|---|
| > 0 | two distinct real | C₁e^(s₁t) + C₂e^(s₂t) | overdamped |
| = 0 | one repeated real | (C₁ + C₂t)e^(st) | critically damped |
| < 0 | complex conjugate pair | e^(αt)(C₁cos ω_d t + C₂sin ω_d t) | underdamped |

![Three second-order responses from the same natural frequency with different damping: overdamped approaches the final value slowly without overshoot, critically damped is the fastest without overshoot, and underdamped overshoots and rings before settling.](/courses/fe-ee/figures/math-damping-regimes.svg)

The repeated-root case needs that extra factor of t, and it is the one people
forget. Without it you have only one independent solution for a second-order
equation, which cannot satisfy two initial conditions.

## 4.2 Series RLC, all the way through

For a series RLC circuit the loop equation is
L·di/dt + Ri + (1/C)∫i dt = 0. Differentiating once to clear the integral:

L·i″ + R·i′ + i/C = 0    →    s² + (R/L)s + 1/(LC) = 0

Comparing with the standard form s² + 2αs + ω₀² = 0 gives the two parameters
that name everything:

- **α = R/(2L)**, the neper frequency — how fast the envelope decays
- **ω₀ = 1/√(LC)**, the resonant frequency — how fast it would oscillate undamped

| Comparison | Regime | What you see |
|---|---|---|
| α > ω₀ | overdamped | slow approach, no overshoot |
| α = ω₀ | critically damped | fastest approach with no overshoot |
| α < ω₀ | underdamped | overshoot and ringing at ω_d = √(ω₀² − α²) |

**Worked.** Take L = 20 mH, C = 50 µF, and R = 20 Ω.

ω₀ = 1/√(0.02 × 50×10⁻⁶) = 1/√(10⁻⁶) = **1000 rad/s**
α = R/(2L) = 20/(2 × 0.02) = **500 s⁻¹**

Since α = 500 < ω₀ = 1000, the circuit is **underdamped**, and it rings at

ω_d = √(1000² − 500²) = √750000 = **866 rad/s**

Note that the ringing frequency is *below* ω₀, always — damping slows the
oscillation as well as shrinking it. To make this same circuit critically
damped you would need α = ω₀, i.e. R = 2Lω₀ = 2(0.02)(1000) = **40 Ω**.

## 4.3 First order, and the shortcut that avoids the algebra

First-order equations, τ·y′ + y = K, do not need this machinery. Every one of
them has the same solution shape, and reading three numbers off the circuit is
faster than solving anything:

**y(t) = y(∞) + [y(0) − y(∞)]·e^(−t/τ)**

- **y(0)** from continuity: capacitor voltage and inductor current cannot jump.
- **y(∞)** from DC steady state: capacitor is an open circuit, inductor a short.
- **τ** = RC or L/R, with R being the **Thevenin resistance seen by the storage
  element**, not necessarily any single resistor in the diagram.

That last point is where first-order problems are lost. If the capacitor sees a
network, reduce that network to its Thevenin resistance first, with sources
deactivated, and use that R in τ = RC.

## 4.4 Non-homogeneous equations, and superposition again

With a forcing function, y = y_homogeneous + y_particular. The homogeneous part
is the natural response computed above; the particular part is the forced
response, which has the same form as the forcing function:

| Forcing function | Try a particular solution of the form |
|---|---|
| constant K | constant A |
| e^(kt) | A·e^(kt) |
| sin ωt or cos ωt | A cos ωt + B sin ωt (**both terms**) |
| polynomial of degree n | general polynomial of degree n |

For a sinusoidal forcing function you must include **both** sine and cosine even
if only one appears in the input, because the system shifts the phase. This is
the time-domain version of the fact that impedance is complex, and it is why
phasor analysis — which handles the magnitude and phase together — replaces this
procedure entirely for AC steady state.

The natural response decays to nothing whenever the roots have negative real
parts, which is what leaves the forced response as the steady state. Stability
in control systems is this same statement about root locations.
""",
tip='Compute alpha = R/2L and omega-zero = 1/sqrt(LC) and compare them. That single comparison names the regime, and the ringing frequency omega-d = sqrt(omega-zero squared minus alpha squared) is always LOWER than omega-zero. An answer where the damped frequency exceeds the undamped one is arithmetically impossible.',
note='For a repeated root the second solution carries a factor of t: (C1 + C2 t) e^(st). Omitting it leaves a second-order equation with only one independent solution, which cannot satisfy two initial conditions.'),

# ------------------------------------------------------------ linear algebra
'fee_linear_algebra': sec('la-depth', '4. What a Matrix Does, and What Eigenvalues Report', r"""
## 4.1 A matrix is an operation, not a table

Treating a matrix as a grid of numbers makes eigenvalues arbitrary. Treating it
as something that *acts on vectors* makes them inevitable:

![The matrix with rows two-one and one-two acting on several vectors. Most vectors are rotated as well as stretched, but two directions are only stretched, by factors of three and one.](/courses/fe-ee/figures/math-eigen-action.svg)

Multiplying a vector by A generally changes both its length and its direction.
For almost every vector shown, A**v** points somewhere new. But two directions
survive unturned — A only scales them. Those are the **eigenvectors**, and the
scale factors are the **eigenvalues**.

## 4.2 Finding them, and checking them for free

The defining equation A**v** = λ**v** rearranges to (A − λI)**v** = 0. A
non-zero **v** can only satisfy this if the matrix is singular, so:

**det(A − λI) = 0**

For A = [[2, 1], [1, 2]]:

det([[2−λ, 1], [1, 2−λ]]) = (2−λ)² − 1 = λ² − 4λ + 3 = 0

giving λ = **3 and 1**, exactly the factors in the figure.

Two checks come free and cost no work:

| Check | Statement | Here |
|---|---|---|
| Trace | sum of eigenvalues = sum of diagonal | 3 + 1 = 4 = 2 + 2 ✓ |
| Determinant | product of eigenvalues = det A | 3 × 1 = 3 = 4 − 1 ✓ |

**Use both, every time.** They take five seconds and catch nearly every sign
error in the characteristic polynomial. If your eigenvalues do not sum to the
trace, you do not need to look for the mistake — you already know there is one.

To get an eigenvector, substitute a λ back. For λ = 3: (2−3)v₁ + v₂ = 0, so
v₂ = v₁ and the eigenvector is any multiple of **[1, 1]**. For λ = 1:
(2−1)v₁ + v₂ = 0, so v₂ = −v₁ and the eigenvector is any multiple of **[1, −1]**.
Eigenvectors are directions, so any non-zero scaling is equally correct — an
answer choice differing from yours by a factor is not necessarily wrong.

## 4.3 Determinants, and what they mean

| Size | Method |
|---|---|
| 2×2 | ad − bc |
| 3×3 | expansion along any row or column with alternating signs |
| any | product of the eigenvalues |

Geometrically the determinant is the **area (or volume) scaling factor** of the
transformation. That gives an immediate reading of the singular case: a
determinant of zero means the transformation collapses space onto a line or a
point, information is destroyed, and no inverse can exist. In circuit terms, a
zero determinant in a nodal or mesh system means the equations are not
independent — usually because a loop was counted twice or a floating section has
no reference.

## 4.4 Cramer's rule, sized for the exam

For small systems Cramer's rule beats elimination because it needs no
bookkeeping. Solving A**x** = **b**, each unknown is

xᵢ = det(Aᵢ)/det(A)

where Aᵢ is A with column i replaced by **b**.

**Worked, from a mesh problem.** Two mesh equations:

3I₁ − I₂ = 10
−I₁ + 2I₂ = 4

det(A) = (3)(2) − (−1)(−1) = 6 − 1 = **5**

det(A₁) = det([[10, −1], [4, 2]]) = 20 + 4 = 24 → I₁ = 24/5 = **4.8 A**
det(A₂) = det([[3, 10], [−1, 4]]) = 12 + 10 = 22 → I₂ = 22/5 = **4.4 A**

**Check by substitution**, which is the habit worth keeping: 3(4.8) − 4.4 =
14.4 − 4.4 = 10 ✓, and −4.8 + 2(4.4) = −4.8 + 8.8 = 4 ✓. Both original equations
hold, so the answer is right regardless of how the determinants were computed.

## 4.5 Matrix operations, and the one that is not commutative

| Operation | Rule | Note |
|---|---|---|
| Addition | element by element | same dimensions required |
| Scalar multiply | every element | — |
| Matrix product | rows × columns | **AB ≠ BA** in general |
| Transpose | rows become columns | (AB)ᵀ = BᵀAᵀ, order reverses |
| Inverse | A⁻¹A = I | exists only if det A ≠ 0 |

For the product to exist, the inner dimensions must match: an m×n times an n×p
gives an m×p. **Matrix multiplication does not commute**, and both the transpose
and the inverse of a product reverse the order: (AB)⁻¹ = B⁻¹A⁻¹. Questions
testing this offer the un-reversed form as the distractor.

## 4.6 Where eigenvalues become engineering

Eigenvalues are not confined to this topic — they are the same quantity that
appears under other names throughout the exam:

- In **state-space control**, the eigenvalues of the system matrix A *are* the
  poles of the transfer function. Negative real parts mean stability, exactly as
  in the differential-equations topic.
- In **coupled circuits and mechanical systems**, they are the natural
  frequencies, and the eigenvectors are the mode shapes.
- In **power systems**, they carry the small-signal stability of a machine.

The characteristic equation det(A − λI) = 0 and the characteristic equation
as² + bs + c = 0 from the ODE topic are the same object. Recognising that means
one technique covers both.
""",
tip='Always check eigenvalues against the trace and the determinant: they must sum to the trace and multiply to the determinant. Five seconds of checking catches almost every sign error in the characteristic polynomial, and you get both checks without extra work.',
note='Matrix multiplication is not commutative, and both the inverse and the transpose of a product reverse the order: (AB) inverse = B inverse times A inverse. The un-reversed version is the standard distractor on this question type.'),

# ------------------------------------------------------------ vector/laplace
'fee_vector_analysis': sec('va-depth', '4. Fields, Operators, and the s-Plane', r"""
## 4.1 Divergence and curl, seen rather than defined

Two operators describe what a vector field does, and they are independent — a
field can have either, both, or neither:

![Two vector fields on the same grid. The first points radially outward everywhere and has divergence two with zero curl. The second circulates and has zero divergence with curl two.](/courses/fe-ee/figures/math-div-curl.svg)

**Divergence** measures whether the field is a source or a sink — whether more
flows out of a small region than in. For **F** = (x, y), every arrow points away
from the origin and div **F** = ∂x/∂x + ∂y/∂y = 2 everywhere.

**Curl** measures circulation — whether the field would spin a paddle wheel
placed in it. For **G** = (−y, x), the arrows circulate and curl **G** =
∂(x)/∂x − ∂(−y)/∂y... more carefully, the z-component is
∂G_y/∂x − ∂G_x/∂y = 1 − (−1) = 2, while its divergence is 0.

These are exactly the operators Maxwell's equations are written in, which is why
this topic sits under Mathematics but is examined through Electromagnetics:

| Equation | Statement in words |
|---|---|
| div **D** = ρ | electric field diverges from charge |
| div **B** = 0 | no magnetic monopoles; **B** only circulates |
| curl **E** = −∂**B**/∂t | a changing magnetic field curls an electric one |
| curl **H** = **J** + ∂**D**/∂t | current and changing **D** curl a magnetic field |

The gradient is the third operator: **grad f** points in the direction of
steepest increase of a scalar field, and **E** = −grad V is the relationship
between potential and field. The minus sign says the field points *downhill* in
potential.

## 4.2 Dot and cross products, and which one a question needs

| Product | Result | Formula | Zero when |
|---|---|---|---|
| Dot **A**·**B** | scalar | \\|A\\|\\|B\\|cos θ | perpendicular |
| Cross **A**×**B** | vector | \\|A\\|\\|B\\|sin θ, ⊥ to both | parallel |

The distinction is physical. Work and real power are **dot** products — only the
component along the direction of motion (or in phase with the current) counts,
which is why P = VI cos θ has a cosine. Force on a moving charge and torque are
**cross** products — **F** = q**v** × **B** is maximal when velocity is
perpendicular to the field and zero when they are parallel.

The cross product is **anticommutative**: **A** × **B** = −(**B** × **A**).
Order matters, and the right-hand rule fixes the sign.

## 4.3 The Laplace transform, as an algebra machine

The Laplace transform replaces calculus with algebra: differentiation becomes
multiplication by s, integration becomes division by s.

| f(t) | F(s) |
|---|---|
| δ(t) impulse | 1 |
| u(t) unit step | 1/s |
| t | 1/s² |
| e^(−at) | 1/(s+a) |
| sin ωt | ω/(s² + ω²) |
| cos ωt | s/(s² + ω²) |
| e^(−at)sin ωt | ω/((s+a)² + ω²) |
| f′(t) | sF(s) − f(0) |
| ∫f dt | F(s)/s |

The derivative rule is the one that does the work, and note that it **carries the
initial condition**: sF(s) − f(0). Transforming a differential equation with
this rule builds the initial conditions in automatically, which is why Laplace
handles initial-condition problems that phasors cannot.

## 4.4 Reading the s-plane

Where the poles of F(s) sit is where the time-domain behaviour comes from:

![Four pole locations in the complex s-plane keyed to the time responses they produce: a decaying oscillation, a pure decay, a sustained oscillation on the imaginary axis, and a growing oscillation in the right half-plane.](/courses/fe-ee/figures/math-laplace-splane.svg)

| Pole location | Time behaviour | Stability |
|---|---|---|
| left half-plane, real | pure exponential decay | stable |
| left half-plane, complex pair | decaying oscillation | stable |
| on the imaginary axis | sustained oscillation | marginally stable |
| right half-plane | growing exponential | **unstable** |

The reading is direct: the **real part sets the decay rate** and the
**imaginary part sets the oscillation frequency**. A pole at −2 ± j5 gives
e^(−2t)cos(5t) — ringing at 5 rad/s inside an envelope with a 0.5 s time
constant.

That single rule is the whole of stability analysis. Routh-Hurwitz, root locus
and Nyquist in the Control Systems topics are three different ways of answering
one question: **is any pole in the right half-plane?**

## 4.5 Worked: an initial-condition problem, done by transform

Solve y′ + 3y = 0 with y(0) = 5.

Transform both terms, using the derivative rule:

sY(s) − 5 + 3Y(s) = 0    →    Y(s)(s + 3) = 5    →    Y(s) = 5/(s + 3)

Inverting with the table entry for e^(−at):

y(t) = **5e^(−3t)**

Check it: y(0) = 5 ✓, and y′ = −15e^(−3t) = −3y ✓. The pole at s = −3 sits in
the left half-plane, so the response decays — and its time constant is
1/3 ≈ 0.33 s, read straight off the pole location without solving anything.
""",
tip='Real part decides stability, imaginary part decides ringing. Any pole with a positive real part means an unstable system, and no amount of favourable behaviour elsewhere changes that. Read the pole locations before doing any other control-systems work.',
note='Work and real power are dot products, which is why P = VI cos theta. Force on a moving charge and torque are cross products, which is why they vanish when the vectors are parallel. Choosing the wrong product gives an answer with the wrong trigonometric function, and both appear among the choices.'),

}

if __name__ == "__main__":
    print("Mathematics section - appending depth chapters")
    apply(EXPANSIONS)
