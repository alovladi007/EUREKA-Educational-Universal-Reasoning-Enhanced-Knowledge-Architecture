#!/usr/bin/env python3
"""Mathematics section, second pass: worked problem sets.

The first pass landed 186-597 words short of the 2000-word standard per topic.
Rather than padding the existing sections, this adds a worked problem set to
each - which is what a candidate short of practice actually needs, and what the
brief asked for alongside figures and tables.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from fe_ee_expand import apply  # noqa: E402


def sec(sid, title, body):
    return "\n".join(["{", "  id: '%s'," % sid, "  title: '%s'," % title,
                      "  content: `%s`," % body.strip(), "}"])


EXPANSIONS = {

'fee_algebra_trig': sec('at-set', '5. Problem Set: Angles and Ratios', r"""
## 5.1 Convert 8∠−150° to rectangular

x = 8 cos(−150°) = 8(−0.866) = **−6.93**
y = 8 sin(−150°) = 8(−0.5) = **−4.00**

So 8∠−150° = −6.93 − j4.00. Both components negative puts it in quadrant III,
which agrees with −150° being between −90° and −180°. Recognising 0.866 as
cos 30° avoids the calculator entirely.

## 5.2 A 5 kW load draws 25 A at 240 V. Find the power factor angle

Apparent power S = VI = 240 × 25 = 6000 VA. Then

pf = P/S = 5000/6000 = 0.833, so θ = arccos(0.833) = **33.6°**

Reactive power follows: Q = S sin θ = 6000(0.553) = 3320 VAR, and the check
S² = P² + Q² gives 5000² + 3320² = 25.0×10⁶ + 11.0×10⁶ = 36.0×10⁶ = 6000² ✓.

## 5.3 Express a voltage gain of 250 in decibels

This is a **voltage** ratio, so the factor is 20:

20 log₁₀(250) = 20(2.398) = **47.96 dB**

Sanity-check it against the anchors: 250 is between 100 (40 dB) and 1000
(60 dB), and closer to the bottom, so a number just below 48 dB is right. Using
10 log would have given 24 dB — half the correct answer, and always one of the
choices.

## 5.4 Two identities under time pressure

Simplify (sin 2θ)/(2 sin θ). Using sin 2θ = 2 sin θ cos θ, the expression is
2 sin θ cos θ/(2 sin θ) = **cos θ**.

Simplify 1 − 2sin²θ. Using sin²θ = (1 − cos 2θ)/2, this is
1 − (1 − cos 2θ) = **cos 2θ**, which is the double-angle identity read
backwards. Both appear inside power calculations, which is why they are worth
recognising rather than deriving each time.
"""),

'fee_complex': sec('cx-set', '5. Problem Set: Phasor Arithmetic', r"""
## 5.1 Series impedance at a stated frequency

A 10 Ω resistor, a 50 mH inductor and a 100 µF capacitor are in series at
60 Hz. Find the total impedance.

ω = 2π(60) = **377 rad/s**
X_L = ωL = 377(0.05) = **18.85 Ω**
X_C = 1/(ωC) = 1/(377 × 100×10⁻⁶) = **26.53 Ω**

Series impedances add in rectangular form:

Z = 10 + j18.85 − j26.53 = **10 − j7.68 Ω**

In polar form, |Z| = √(100 + 59.0) = 12.61 Ω and θ = arctan(−7.68/10) =
**−37.5°**. The negative angle means the circuit is net **capacitive**, so
current leads voltage — which follows from X_C exceeding X_L, and is worth
stating as a check rather than discovering later.

## 5.2 Current from that impedance

With 120 V rms applied at 0°:

**I** = 120∠0° / 12.61∠−37.5° = **9.52∠+37.5° A**

Division in polar form: magnitudes divide, angles subtract. The current leads by
37.5°, consistent with a capacitive circuit.

Real power: P = VI cos θ = 120(9.52)(cos 37.5°) = 120(9.52)(0.793) = **906 W**.
Check against I²R = (9.52)²(10) = 906 W ✓. Two routes, same answer — and the
second one is a reminder that only the resistance dissipates.

## 5.3 A parallel pair, using both forms

Z₁ = 6 + j8 and Z₂ = 10∠−30° are in parallel.

Product, in polar: Z₁ = 10∠53.13°, so Z₁Z₂ = 100∠23.13°.
Sum, in rectangular: Z₂ = 8.66 − j5.00, so Z₁ + Z₂ = 14.66 + j3.00 =
14.96∠11.57°.
Quotient, in polar: Z = 100∠23.13° / 14.96∠11.57° = **6.68∠11.56° Ω**

Each operation used the form that suits it, with one conversion at each
junction — which is faster and safer than forcing everything into one form.
"""),

'fee_discrete_math': sec('dm-set', '5. Problem Set: Counting and Logic', r"""
## 5.1 Codes with a constraint

How many 4-digit PINs use digits 0-9 with no repeats?

Order matters and repetition is barred, so this is a permutation:
P(10,4) = 10 × 9 × 8 × 7 = **5040**.

With repeats allowed it would be 10⁴ = 10 000. The constraint removes almost
half the space, which is the practical point of the distinction.

## 5.2 Committee selection

From 12 engineers, choose a team of 4 with no roles assigned.

C(12,4) = (12 × 11 × 10 × 9)/(4 × 3 × 2 × 1) = 11880/24 = **495**

If instead the four roles are distinct — lead, reviewer, tester, scribe — then
order matters and the count is P(12,4) = 11880. The ratio is 4! = 24, exactly as
P = C × k! requires.

## 5.3 Parity and error detection

An 8-bit byte carries one parity bit. How many 8-bit patterns have even parity
(an even number of ones)?

Even counts of ones are 0, 2, 4, 6, 8:
C(8,0) + C(8,2) + C(8,4) + C(8,6) + C(8,8) = 1 + 28 + 70 + 28 + 1 = **128**

That is exactly half of 2⁸ = 256, and it is half for every n ≥ 1 — which is why
a single parity bit detects any odd number of bit errors and misses every even
number of them.

## 5.4 Inclusion-exclusion with three sets

Of 100 components, 45 fail a thermal test, 35 an electrical test, and 20 fail
both. How many pass both?

Failing at least one: 45 + 35 − 20 = 60. Passing both: 100 − 60 = **40**.

Forgetting to subtract the overlap gives 80 failures and 20 passes — a wrong
answer that is always on the list.

## 5.5 A contrapositive in engineering language

"If the supply is regulated, the output ripple is under 50 mV."

The **contrapositive** — and the only equivalent restatement — is: *if the
output ripple is 50 mV or more, the supply is not regulated.*

The converse ("if ripple is under 50 mV then the supply is regulated") does not
follow: a lightly loaded unregulated supply might also show low ripple. Test
questions phrase this as a troubleshooting scenario, and the converse is always
offered.
"""),

'fee_analytic_geom': sec('ag-set', '5. Problem Set: Lines, Circles and Intercepts', r"""
## 5.1 Identify the conic

4x² + 9y² − 16x + 18y − 11 = 0

A = 4 and C = 9 are unequal but the same sign, so this is an **ellipse**.
Completing the square in both variables:

4(x² − 4x) + 9(y² + 2y) = 11
4(x² − 4x + 4) + 9(y² + 2y + 1) = 11 + 16 + 9

Note what was added to the right: 4 × 4 = 16 and 9 × 1 = 9, because the
completed terms sit inside the coefficients. Dropping the multiplier here is the
usual error.

4(x − 2)² + 9(y + 1)² = 36    →    (x−2)²/9 + (y+1)²/4 = 1

Centre **(2, −1)**, semi-axes a = 3 along x and b = 2 along y.

## 5.2 Perpendicular through a point

Find the line perpendicular to 3x + 4y = 12 passing through (6, 1).

Rearranging: y = −(3/4)x + 3, so m = −3/4. The perpendicular slope is the
negative reciprocal, **+4/3**. Point-slope:

y − 1 = (4/3)(x − 6)    →    **y = (4/3)x − 7**

Check perpendicularity: (−3/4)(4/3) = −1 ✓.

## 5.3 Distance from a point to a line

How far is (6, 1) from 3x + 4y − 12 = 0?

d = |3(6) + 4(1) − 12| / √(3² + 4²) = |18 + 4 − 12|/5 = 10/5 = **2.0**

The absolute value matters: distance is never negative, and omitting it on a
point below the line yields −2, which is offered as a choice.

## 5.4 Two intercepts, one load line

A source with V_oc = 20 V and R_th = 500 Ω drives a load. Sketch the load line.

Current intercept (V = 0): I = 20/500 = **40 mA**
Voltage intercept (I = 0): V = **20 V**
Slope: −1/500 A/V = −2 mA/V

Any operating point must lie on the segment between those intercepts. If a
device curve crosses at 12 V, the current there is (20 − 12)/500 = 16 mA, and
the power delivered to the device is 12 × 0.016 = **192 mW**.
"""),

'fee_diff_calc': sec('dc-set', '5. Problem Set: Rates and Optima', r"""
## 5.1 Chain rule inside a circuit expression

Differentiate v(t) = 10 e^(−t/0.02) sin(377t) at t = 0.

This is a product, and the first factor needs the chain rule:

v′ = 10[(−1/0.02)e^(−t/0.02) sin(377t) + e^(−t/0.02)(377)cos(377t)]

At t = 0 the exponential is 1, sin(0) = 0 and cos(0) = 1, so

v′(0) = 10[0 + 377] = **3770 V/s**

The decaying envelope contributes nothing at t = 0 because the sine is zero
there — the whole initial slope comes from the oscillation.

## 5.2 Optimising a rectangular enclosure

An enclosure of fixed volume 8000 cm³ has a square base of side x and height h.
Minimise the surface area.

Volume fixes h: h = 8000/x². Surface area (closed box):

A = 2x² + 4xh = 2x² + 32000/x

dA/dx = 4x − 32000/x² = 0    →    4x³ = 32000    →    x³ = 8000    →    x = **20 cm**

Then h = 8000/400 = **20 cm**, so the optimum is a cube — the answer for any
closed box of fixed volume. Confirm it is a minimum: A″ = 4 + 64000/x³ > 0
for all positive x, so concave up. ✓

## 5.3 Maximum of a power curve

For P(θ) = 1000 sin θ cos θ, find the maximum.

Rewrite with the double-angle identity: P = 500 sin 2θ, whose maximum is
**500 W at 2θ = 90°**, i.e. **θ = 45°**. Differentiating directly gives
P′ = 1000 cos 2θ = 0 at the same place, but the identity makes the peak value
immediate.

## 5.4 An indeterminate limit

Evaluate lim(x→0) (e^(2x) − 1)/x.

Substituting gives 0/0, so L'Hopital applies:

lim(x→0) 2e^(2x)/1 = **2**

This is the small-signal linearisation of an exponential, and it is why a diode
equation is often approximated as linear near the origin.
"""),

'fee_int_calc': sec('ic-set', '5. Problem Set: Areas, Averages and RMS', r"""
## 5.1 RMS of a waveform that is not a sine

A current is a 10 A square pulse present for 3 ms of every 10 ms period, and
zero otherwise. Find the RMS value.

Mean square = (1/T)∫i² dt = (1/0.010)(10² × 0.003) = (100 × 0.003)/0.010 = 30

I_rms = √30 = **5.48 A**

The duty cycle is 0.3, and 10√0.3 = 5.48 confirms the general result
**I_rms = I_peak√D** for a rectangular pulse train. The *average* current is
10 × 0.3 = 3 A, well below the RMS — the gap between them is what makes a
heating calculation different from a charge calculation.

## 5.2 Charge delivered by a ramp

A current rises linearly from 0 to 4 A over 5 s. What charge flows?

Q = ∫i dt = area under the line = ½(5)(4) = **10 C**

No integration technique is needed; a triangle's area is the integral. Half the
exam's integration questions are geometry in disguise.

## 5.3 Energy stored in a capacitor, from the definition

W = ∫p dt = ∫vi dt, and for a capacitor i = C dv/dt, so

W = ∫v · C(dv/dt) dt = C∫v dv = **½CV²**

Substituting C = 100 µF charged to 50 V: W = ½(100×10⁻⁶)(2500) = **0.125 J**.
Deriving it takes three lines and removes any doubt about whether the factor is
½ or 2.

## 5.4 Average of a half-wave rectified sine

Only the positive half survives, and the average is taken over the **full**
period:

V_avg = (1/2π)∫₀^π V_m sin θ dθ = (V_m/2π)(2) = V_m/π = **0.318 V_m**

Dividing by π instead of 2π gives 0.637 V_m, which is the *full*-wave answer.
The distinction is which rectifier is in the circuit, and both numbers always
appear among the choices.

## 5.5 Substitution in practice

Evaluate ∫₀^1 x·e^(x²) dx.

Let u = x², du = 2x dx, so x dx = du/2. Limits become u: 0 → 1.

∫₀^1 (1/2)e^u du = ½(e¹ − e⁰) = ½(2.718 − 1) = **0.859**

Changing the limits with the variable avoids converting back at the end, which
is where sign and bound errors creep in.
"""),

'fee_diffeq': sec('de-set', '5. Problem Set: Transients by Inspection', r"""
## 5.1 First order, with a Thevenin time constant

A 10 µF capacitor sits between node A and ground. Looking back from the
capacitor with sources deactivated, the network reduces to 40 kΩ in parallel
with 60 kΩ. Find the time constant.

R_th = (40 × 60)/(40 + 60) = 2400/100 = **24 kΩ**
τ = R_th·C = 24×10³ × 10×10⁻⁶ = **0.24 s**

Using either resistor alone gives 0.4 s or 0.6 s, both of which are offered.
The time constant uses the resistance the *element* sees, not any single
component.

## 5.2 Classify a second-order circuit

Series RLC with R = 100 Ω, L = 10 mH, C = 1 µF.

ω₀ = 1/√(0.01 × 10⁻⁶) = 1/√(10⁻⁸) = **10 000 rad/s**
α = R/(2L) = 100/(2 × 0.01) = **5000 s⁻¹**

α < ω₀, so **underdamped**, ringing at

ω_d = √(10⁴² − 5000²) = √(10⁸ − 2.5×10⁷) = √(7.5×10⁷) = **8660 rad/s**

The damping ratio ζ = α/ω₀ = 0.5, which is the value control-systems questions
use for a well-damped step response with about 16 % overshoot.

## 5.3 The resistance for critical damping

For that same L and C, critical damping needs α = ω₀:

R/(2L) = ω₀    →    R = 2Lω₀ = 2(0.01)(10 000) = **200 Ω**

Doubling R from 100 Ω to 200 Ω moves the circuit from underdamped to critically
damped. Any larger R is overdamped — slower, but with no overshoot at all.

## 5.4 Solving a forced first-order equation

Solve i′ + 4i = 12 with i(0) = 0.

Natural part: root of s + 4 = 0 is s = −4, giving i_n = Ae^(−4t).
Forced part: a constant input gives a constant output, i_p = 12/4 = 3.
So i = 3 + Ae^(−4t), and i(0) = 0 gives A = −3:

i(t) = **3(1 − e^(−4t))**

which is the universal first-order form with i(0) = 0, i(∞) = 3 and τ = 1/4 s —
confirming that the three-number shortcut and the full solution agree.
"""),

'fee_linear_algebra': sec('la-set', '5. Problem Set: Systems and Spectra', r"""
## 5.1 A 3×3 determinant

Find det of [[2, 0, 1], [3, −1, 2], [1, 4, 0]].

Expanding along the first row, with the alternating sign pattern + − +:

2·det([[−1,2],[4,0]]) − 0·det(...) + 1·det([[3,−1],[1,4]])
= 2(0 − 8) − 0 + 1(12 + 1)
= −16 + 13 = **−3**

Expanding along the second row (which contains a zero) would have been quicker.
**Choose the row or column with the most zeros** — the answer is the same and
the arithmetic is shorter.

## 5.2 Eigenvalues of a non-symmetric matrix

A = [[4, 1], [2, 3]].

Characteristic equation: (4−λ)(3−λ) − 2 = λ² − 7λ + 10 = 0, so λ = **5 and 2**.

Checks: trace = 4 + 3 = 7 = 5 + 2 ✓, and det = 12 − 2 = 10 = 5 × 2 ✓.

Eigenvector for λ = 5: (4−5)v₁ + v₂ = 0 gives v₂ = v₁, so **[1, 1]**.
Eigenvector for λ = 2: (4−2)v₁ + v₂ = 0 gives v₂ = −2v₁, so **[1, −2]**.

## 5.3 A singular system, and what it means

Solve 2x + 4y = 10 and 3x + 6y = 15.

det = (2)(6) − (4)(3) = 12 − 12 = **0**, so Cramer's rule fails. The second
equation is 1.5 times the first, so they carry the same information: there are
infinitely many solutions along the line x + 2y = 5.

In a mesh or nodal context a zero determinant is a modelling error, not an
arithmetic one — typically a dependent loop equation or a network with no
reference node.

## 5.4 Three equations by Cramer

x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2.

det(A) = 1(1−2) − 1(−2−1) + 1(4+1) = −1 + 3 + 5 = **7**

Replacing the first column with the constants gives det(A₁) = 7, so x = 7/7 =
**1**. Similarly y = **2** and z = **3**.

Check all three originals: 1+2+3 = 6 ✓, 2−2+3 = 3 ✓, 1+4−3 = 2 ✓. For a 3×3
system Cramer's rule needs four determinants, which is about the break-even
point against elimination — beyond 3×3, eliminate.
"""),

'fee_vector_analysis': sec('va-set', '5. Problem Set: Products and Transforms', r"""
## 5.1 Dot and cross on the same pair

**A** = 3**i** + 4**j** and **B** = 2**i** − **j**.

Dot: **A**·**B** = (3)(2) + (4)(−1) = 6 − 4 = **2**

Cross (z-component only, since both lie in the xy-plane):
**A**×**B** = (AₓB_y − A_yBₓ)**k** = (3(−1) − 4(2))**k** = **−11k**

The angle between them follows from either: |A| = 5, |B| = √5 = 2.236, so
cos θ = 2/(5 × 2.236) = 0.179, giving θ = **79.7°**. Cross-checking with the
cross product: sin θ = 11/(5 × 2.236) = 0.984, θ = 79.7° ✓. Two independent
routes to the same angle.

## 5.2 Divergence and curl of a stated field

**F** = x²**i** + y z**j** + z**k**.

div **F** = ∂(x²)/∂x + ∂(yz)/∂y + ∂(z)/∂z = 2x + z + 1

At the point (1, 2, 3): div **F** = 2 + 3 + 1 = **6**.

The x-component of the curl is ∂F_z/∂y − ∂F_y/∂z = 0 − y = −y, which at that
point is **−2**. A field can have both a divergence and a curl; they are
independent measurements, not alternatives.

## 5.3 Inverse transform by partial fractions

Find the inverse transform of F(s) = 10/(s(s + 5)).

Split it: 10/(s(s+5)) = A/s + B/(s+5). Multiplying through, 10 = A(s+5) + Bs.
Setting s = 0 gives A = 2; setting s = −5 gives 10 = −5B, so B = −2.

F(s) = 2/s − 2/(s+5)    →    f(t) = **2 − 2e^(−5t)**

Check the endpoints: f(0) = 0 and f(∞) = 2, matching the initial- and
final-value theorems applied to F(s) directly — lim(s→∞) sF(s) = 0 and
lim(s→0) sF(s) = 10/5 = 2 ✓.

## 5.4 Reading a time constant off a pole

A system has poles at s = −4 ± j3.

The envelope decays as e^(−4t), so τ = 1/4 = **0.25 s** and the response settles
in roughly 5τ = 1.25 s. It rings at 3 rad/s, i.e. 3/(2π) = **0.477 Hz**. Both
numbers come straight from the pole coordinates with no inverse transform
required — which is the practical reason control engineers work in the s-plane
at all.
"""),

}

if __name__ == "__main__":
    print("Mathematics section - appending problem sets")
    apply(EXPANSIONS)
