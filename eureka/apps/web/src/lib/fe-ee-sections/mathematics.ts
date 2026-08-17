// FE EE course content — Mathematics (9 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_MATHEMATICS: Record<string, TopicLesson> = {
fee_algebra_trig: {
  topicId: 'fee_algebra_trig',
  title: 'Algebra & Trigonometry',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Algebra and trigonometry form the computational bedrock for every FE Electrical exam topic. Quadratic equations, trigonometric identities, and polar-rectangular conversions appear repeatedly in circuit analysis, signal processing, and control systems.',
  sections: [
    {
      id: 'at-quadratic-systems',
      title: '1. Quadratic Equations and Systems of Equations',
      content: `## 1.1 The Quadratic Formula

The **quadratic formula** solves any equation of the form **$ax^{2} + bx + c = 0$**:

**$x = (-b \\pm \\sqrt{b^{2} - 4ac}) / (2a)$**

The **discriminant** D = b² - 4ac determines root type:

| Discriminant | Root Type | Engineering Significance |
|---|---|---|
| $D > 0$ | Two distinct real roots | Two separate operating points |
| $D = 0$ | One repeated real root | Critically damped system |
| $D < 0$ | Two complex conjugate roots | Oscillatory behavior (underdamped) |

### Systems of Linear Equations

Many circuit problems reduce to systems of linear equations. For two equations in two unknowns:
- **Substitution**: solve one equation for one variable, substitute into the other
- **Elimination**: multiply equations to cancel one variable
- **Cramer's rule**: use determinants — x = det(Ax)/det(A), y = det(Ay)/det(A)

For the FE exam, Cramer's rule is fast for 2x2 systems:
- Given a1·x + b1·y = c1 and a2·x + b2·y = c2
- **$x = (c1\\cdot b2 - c2\\cdot b1) / (a1\\cdot b2 - a2\\cdot b1)$**
- **$y = (a1\\cdot c2 - a2\\cdot c1) / (a1\\cdot b2 - a2\\cdot b1)$**`,
      examTip: 'The discriminant b²-4ac tells you everything on the FE exam: positive means two real roots, zero means repeated (critically damped in circuits), negative means complex conjugate pair (oscillatory). Memorize this mapping — it saves time on second-order circuit and control system problems.',
    },
    {
      id: 'at-trig-identities',
      title: '2. Trigonometric Identities and Applications',
      content: `## 2.1 Fundamental Identities

The **Pythagorean identity** is the most important:

**$\\sin ^{2}\\theta + \\cos ^{2}\\theta = 1$**

Derived identities:
- **$\\tan ^{2}\\theta + 1 = \\sec ^{2}\\theta$**
- **$1 + \\cot ^{2}\\theta = \\csc ^{2}\\theta$**

### Angle Addition Formulas

These appear constantly in AC circuit analysis where you combine sinusoidal signals:

- **sin(A ± B) = sinA·cosB ± cosA·sinB**
- **cos(A ± B) = cosA·cosB ∓ sinA·sinB**

### Double-Angle Formulas

- **sin(2A) = 2·sinA·cosA**
- **$\\cos (2A) = \\cos ^{2}A - \\sin ^{2}A = 2\\cos ^{2}A - 1 = 1 - 2\\sin ^{2}A$**

### Power-Reducing Formulas

Used in power calculations for AC circuits:
- **$\\sin ^{2}\\theta = (1 - \\cos 2\\theta) / 2$**
- **$\\cos ^{2}\\theta = (1 + \\cos 2\\theta) / 2$**

## 2.2 Rectangular-Polar Conversion

Every phasor problem on the FE exam requires converting between forms:

| Conversion | Formula |
|---|---|
| Rectangular to Polar | $r = \\sqrt{x^{2} + y^{2}}, \\theta = \\arctan (y/x)$ |
| Polar to Rectangular | $x = r\\cdot \\cos \\theta, y = r\\cdot \\sin \\theta$ |

### Unit Circle Values

| Angle | sin | cos | tan |
|---|---|---|---|
| $0^\\circ$ | 0 | 1 | 0 |
| $30^\\circ$ | $1/2$ | $\\sqrt{3}/2$ | $1/\\sqrt{3}$ |
| $45^\\circ$ | $\\sqrt{2}/2$ | $\\sqrt{2}/2$ | 1 |
| $60^\\circ$ | $\\sqrt{3}/2$ | $1/2$ | $\\sqrt{3}$ |
| $90^\\circ$ | 1 | 0 | undefined |`,
      examTip: 'When converting rectangular to polar, ALWAYS check the quadrant. arctan(y/x) gives the correct angle only in Q1 and Q4. For Q2 and Q3, add 180 degrees. The FE reference handbook has these formulas, but knowing them cold saves critical minutes.',
      importantNote: 'The angle addition formulas are the basis for phasor addition in AC circuits. When you add two sinusoids of the same frequency, you are implicitly using these identities. Converting to phasors first is usually faster than expanding trig identities by hand.',
    },
    {
      id: 'at-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Quadratic with a physical root test

A projectile-style RLC characteristic equation gives s^2 + 5s + 6 = 0. Factoring: (s+2)(s+3) = 0, so s = **-2 and -3**. Both roots have negative real parts, so both natural modes decay - the circuit is stable and overdamped.

When factoring is not obvious, the formula: s = [-b ± sqrt(b^2 - 4ac)]/(2a). The discriminant b^2 - 4ac tells you the character before you compute anything:

| Discriminant | Roots | Circuit behaviour |
|---|---|---|
| $> 0$ | two real distinct | overdamped |
| $= 0$ | one repeated real | critically damped |
| $< 0$ | complex conjugate pair | underdamped, oscillatory |

## 3.2 Solving a two-loop system

Mesh analysis produces 3i1 + 2i2 = 12 and i1 - 4i2 = -2. From the second, i1 = 4i2 - 2. Substitute: 3(4i2 - 2) + 2i2 = 12, so 12i2 - 6 + 2i2 = 12, giving 14i2 = 18 and **$i2 = 1.286\\ \\mathrm{A}$**. Then i1 = 4(1.286) - 2 = **3.14 A**.

Substituting back into the first equation: 3(3.14) + 2(1.286) = 9.43 + 2.57 = 12. Checks.

## 3.3 The identities that actually appear

The three worth having instantly:

- **$\\sin ^2 + \\cos ^2 = 1$** — converts between the two whenever only one is given
- **$\\sin (2x) = 2 \\sin  x \\cos  x$** — appears in instantaneous power, p(t) = VI cos(theta) + VI cos(2 omega t - theta)
- **$\\cos (A - B) = \\cos  A \\cos  B + \\sin  A \\sin  B$** — the phase-difference expansion behind every power-factor derivation

Example: a load has cos(theta) = 0.6. Then sin(theta) = sqrt(1 - 0.36) = **0.8**, so a 5 kVA load carries P = 3 kW and Q = 4 kVAR. The 3-4-5 triangle turns up constantly in power problems and is worth recognising on sight.

## 3.4 Polar and rectangular

Rectangular to polar: magnitude = sqrt(a^2 + b^2), angle = arctan(b/a) **with attention to quadrant**.

Convert -3 + j4: magnitude = sqrt(9+16) = **5**, and arctan(4/-3) = -53.1 degrees from the calculator — but the point is in the second quadrant, so the true angle is 180 - 53.1 = **126.9 degrees**.

That quadrant correction is the most common arithmetic error in the whole Mathematics section, because a calculator's arctan cannot distinguish the second quadrant from the fourth. Sketch the point before trusting the number.

Polar to rectangular: a = r cos(theta), b = r sin(theta). So 10 at 30 degrees = 10(0.866) + j10(0.5) = **8.66 + j5**.`,
      examTip: 'Multiply and divide in polar form (magnitudes multiply, angles add); add and subtract in rectangular form (components add). Choosing the wrong form turns a ten-second operation into a page of algebra.',
      quiz: [
        {
          question: 'What is the polar form of the complex number -4 + j3?',
          options: ['5 at 143.1 degrees', '5 at -36.9 degrees', '5 at 36.9 degrees', '7 at 143.1 degrees'],
          correctIndex: 0,
          explanation: 'Magnitude is sqrt(16+9) = 5. The calculator gives arctan(3/-4) = -36.9 degrees, but the point lies in the second quadrant (negative real, positive imaginary), so add 180: the angle is 143.1 degrees. Skipping the quadrant check is the standard error here.',
        },
        {
          question: 'A load has a power factor of 0.6. What is sin(theta)?',
          options: ['0.8', '0.6', '0.4', '1.67'],
          correctIndex: 0,
          explanation: 'From sin^2 + cos^2 = 1: sin(theta) = sqrt(1 - 0.36) = 0.8. This gives the familiar 3-4-5 power triangle, so a 5 kVA load at pf 0.6 carries 3 kW of real power and 4 kVAR of reactive power.',
        },
        {
          question: 'The characteristic equation s^2 + 4s + 13 = 0 describes a circuit. What is its behaviour?',
          options: [
            'Underdamped - the roots are a complex conjugate pair',
            'Overdamped - two distinct real roots',
            'Critically damped - a repeated real root',
            'Unstable - a root in the right half plane',
          ],
          correctIndex: 0,
          explanation: 'The discriminant is 16 - 52 = -36, negative, so the roots are complex: s = -2 ± j3. A complex pair means oscillation, and the negative real part (-2) means the oscillation decays - underdamped and stable.',
        },
      ],
    },
  {
    id: 'at-depth',
    title: '4. The Unit Circle as a Working Tool',
    content: `## 4.1 Why this one picture carries the section
  
  Trigonometry on the FE exam is almost never asked for its own sake. It arrives
  inside a phasor, a power factor, a three-phase angle or a Fourier coefficient,
  and in every one of those the same small set of values does the work.
  
  ![The unit circle with the exam's five first-quadrant angles, each labelled with its exact cosine and sine. The remaining marked points are reflections of those five into the other three quadrants.](/courses/fe-ee/figures/math-unit-circle.svg)
  
  The circle is worth reading as a definition rather than a mnemonic. A point on
  it at angle theta has coordinates **(cos theta, sin theta)** — that *is* what
  the two functions mean. Everything else follows:
  
  - **$\\sin ^{2} + \\cos ^{2} = 1$** is the Pythagorean theorem applied to that point.
  - **tan theta = sin/cos** is the slope of the ray, which is why it blows up at
    90° where the ray is vertical.
  - The sign of each function in each quadrant is the sign of the corresponding
    coordinate. There is nothing to memorise beyond which coordinate is which.
  
  ## 4.2 The five angles, and the rest by reflection
  
  Only five first-quadrant angles have exact values worth carrying, and every
  other angle the exam uses is one of them reflected:
  
  | theta | cos | sin | tan | Where it shows up |
  |---|---|---|---|---|
  | $0^\\circ$ | 1 | 0 | 0 | purely resistive, unity power factor |
  | $30^\\circ$ | $\\sqrt{3}/2 \\approx 0.866$ | $1/2$ | $1/\\sqrt{3} \\approx 0.577$ | pf = 0.866 lagging |
  | $45^\\circ$ | $\\sqrt{2}/2 \\approx 0.707$ | $\\sqrt{2}/2$ | 1 | equal R and X; half-power point |
  | $60^\\circ$ | $1/2$ | $\\sqrt{3}/2 \\approx 0.866$ | $\\sqrt{3} \\approx 1.732$ | 120° three-phase geometry |
  | $90^\\circ$ | 0 | 1 | undefined | purely reactive, zero real power |
  
  Note that **0.707 and 0.866 are the two decimals to recognise on sight**. A
  power factor of 0.707 means a 45° angle and equal real and reactive power; 0.866
  means 30° and Q = P/√3. Recognising the decimal saves an inverse-cosine keypress
  on a calculator you are already using too much.
  
  ## 4.3 Rectangular to polar, with the quadrant discipline
  
  This conversion appears in every phasor problem, and the single most common
  error is trusting the calculator's arctangent.
  
  **Convert 3 − j4.** The magnitude is √(3² + 4²) = √25 = **5**. The angle is
  arctan(−4/3) = **$-53.13^\\circ$**. Both x and y checks agree: x = 3 > 0 and y = −4 < 0
  put the point in quadrant IV, and −53.13° is in quadrant IV. Accept it.
  
  **Convert −3 + j4.** The magnitude is again 5. But arctan(4/−3) = arctan(−1.333)
  = **$-53.13^\\circ$**, which is wrong. The point has x < 0 and y > 0, so it is in
  quadrant II, and the answer is −53.13° + 180° = **$126.87^\\circ$**.
  
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
  directly. **$5\\angle 126.87^\\circ$** gives x = 5(−0.6) = −3 and y = 5(0.8) = 4, recovering
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
  | Power ratio | $10 \\log _{10}(P_{2}/P_{1})$ | +3.01 dB | +10 dB |
  | Voltage or current ratio | $20 \\log _{10}(V_{2}/V_{1})$ | +6.02 dB | +20 dB |
  
  The factor of 20 for voltage is not a different rule — it is the same rule,
  because power goes as V², and 10 log(V²) = 20 log(V). A common trap gives a
  voltage ratio and asks for dB, offering both 6 dB and 3 dB as choices.
  
  Two anchors make most dB questions mental arithmetic: **3 dB is a factor of 2 in
  power**, and **6 dB is a factor of 2 in voltage**. A 40 dB voltage gain is
  therefore 10², or 100; a −3 dB point is where power has halved and voltage has
  fallen to 0.707 of its peak — the same 0.707 that appeared in the unit circle
  table above, and for the same reason.`,
    examTip: 'Before accepting any arctangent, look at the signs of x and y. The calculator returns an angle in (-90, 90) only, so quadrants II and III always need a 180 degree correction. This single check prevents more lost marks in AC circuit analysis than any other habit.',
    importantNote: '0.707 and 0.866 should be recognised instantly. 0.707 is cos 45 and also 1/sqrt(2): equal resistance and reactance, the half-power point, and the RMS-to-peak ratio of a sinusoid. 0.866 is cos 30 and sqrt(3)/2, which is where the sqrt(3) in three-phase relationships comes from.',
  },
{
  id: 'at-set',
  title: '5. Problem Set: Angles and Ratios',
  content: `## 5.1 Convert 8∠−150° to rectangular

$$x = 8 \\cos (-150^\\circ) = 8(-0.866) = -6.93$$
$$y = 8 \\sin (-150^\\circ) = 8(-0.5) = -4.00$$

So 8∠−150° = −6.93 − j4.00. Both components negative puts it in quadrant III,
which agrees with −150° being between −90° and −180°. Recognising 0.866 as
cos 30° avoids the calculator entirely.

## 5.2 A 5 kW load draws 25 A at 240 V. Find the power factor angle

Apparent power S = VI = 240 × 25 = 6000 VA. Then

$$pf = P/S = 5000/6000 = 0.833, so \\theta = \\arccos (0.833) = 33.6^\\circ$$

Reactive power follows: Q = S sin θ = 6000(0.553) = 3320 VAR, and the check
S² = P² + Q² gives 5000² + 3320² = 25.0×$10^{6}$ + 11.0×$10^{6}$ = 36.0×$10^{6}$ = 6000² ✓.

## 5.3 Express a voltage gain of 250 in decibels

This is a **voltage** ratio, so the factor is 20:

$$20 \\log _{10}(250) = 20(2.398) = 47.96\\ \\mathrm{dB}$$

Sanity-check it against the anchors: 250 is between 100 (40 dB) and 1000
(60 dB), and closer to the bottom, so a number just below 48 dB is right. Using
10 log would have given 24 dB — half the correct answer, and always one of the
choices.

## 5.4 Two identities under time pressure

Simplify (sin 2θ)/(2 sin θ). Using sin 2θ = 2 sin θ cos θ, the expression is
$$2 \\sin  \\theta \\cos  \\theta /(2 \\sin  \\theta) = \\cos  \\theta$$.

Simplify 1 − 2sin²θ. Using sin²θ = (1 − cos 2θ)/2, this is
1 − (1 − cos 2θ) = **$\\cos  2\\theta$**, which is the double-angle identity read
backwards. Both appear inside power calculations, which is why they are worth
recognising rather than deriving each time.`,
},
{
  id: 'at-quadratic-machinery',
  title: '6. Quadratics Derived Rather Than Recited',
  content: `## 6.1 Completing the square, once, in general

The quadratic formula is not something to take on trust. It is one algebraic
manoeuvre — completing the square — carried out on the general equation instead
of on a particular one. Doing it once explains where every part of the formula
comes from, including the discriminant.

Start from the general quadratic with a nonzero leading coefficient and divide
through by that coefficient, because completing the square only works on a
squared term with coefficient one:

$$ax^{2} + bx + c = 0 \\quad \\Longrightarrow \\quad x^{2} + \\frac{b}{a}x + \\frac{c}{a} = 0$$

Move the constant to the right and add the square of half the linear
coefficient to both sides. Half of $b/a$ is $b/(2a)$:

$$x^{2} + \\frac{b}{a}x + \\left(\\frac{b}{2a}\\right)^{2} = \\left(\\frac{b}{2a}\\right)^{2} - \\frac{c}{a}$$

The left side is now a perfect square by construction, and the right side goes
over a common denominator of $4a^{2}$:

$$\\left(x + \\frac{b}{2a}\\right)^{2} = \\frac{b^{2} - 4ac}{4a^{2}}$$

Take the square root of both sides, keeping both signs, and isolate the
variable:

$$x + \\frac{b}{2a} = \\pm \\frac{\\sqrt{b^{2} - 4ac}}{2a} \\quad \\Longrightarrow \\quad x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

Two structural facts fall out of that last line and are worth more than the
formula itself. The term $-b/(2a)$ is the axis of symmetry, so the two roots sit
symmetrically either side of it. And the quantity under the radical,
$b^{2} - 4ac$, decides whether the excursion either side of that axis is real or
imaginary. That quantity is the discriminant, written $D$ here.

![A parabola drawn from y = 2x squared minus 12x plus 10, with its vertex marked at (3, -8) and its two roots marked at x = 1 and x = 5. The completed-square form 2(x-3) squared minus 8 describes the identical curve.](/courses/fe-ee/figures/math2-at-completing-square.svg)

### Worked example 6.1 — Completing the square on a specific quadratic

Take $y = 2x^{2} - 12x + 10$, the curve in the figure. Factor the leading
coefficient out of the two terms that contain the variable:

$$y = 2\\left(x^{2} - 6x\\right) + 10$$

Half of $-6$ is $-3$, and $(-3)^{2} = 9$, so add and subtract 9 inside the
bracket:

$$y = 2\\left(x^{2} - 6x + 9 - 9\\right) + 10 = 2(x - 3)^{2} - 18 + 10 = 2(x - 3)^{2} - 8$$

The vertex is now readable without calculus: the squared term is never negative,
so the smallest value of $y$ is $-8$, reached at $x = 3$. The roots are equally
free. Setting the completed form to zero gives $(x-3)^{2} = 4$, so
$x = 3 \\pm 2$, which is $x = 1$ and $x = 5$.

Two checks cost nothing. Expanding $2(x-3)^{2} - 8$ returns
$2x^{2} - 12x + 18 - 8$, the original. And the roots must satisfy the two
relations between coefficients and roots: their sum is $-b/a = 6$ and their
product is $c/a = 5$. Both hold for the pair 1 and 5.

## 6.2 The discriminant as a forecast of circuit behaviour

Second-order circuits produce characteristic equations, and the discriminant
tells you the shape of the response before you have solved for anything.

![Three parabolas with the three possible discriminant signs: one crossing the horizontal axis twice, one touching it once, and one never reaching it. The number of crossings is the number of real roots.](/courses/fe-ee/figures/math2-at-discriminant.svg)

| Quadratic | $D = b^{2} - 4ac$ | Roots | Response |
|---|---|---|---|
| $s^{2} + 5s + 6$ | $25 - 24 = +1$ | $-2$ and $-3$ | overdamped, two decaying modes |
| $s^{2} + 4s + 4$ | $16 - 16 = 0$ | $-2$ twice | critically damped, fastest without overshoot |
| $s^{2} + 2s + 5$ | $4 - 20 = -16$ | $-1 \\pm j2$ | underdamped, decaying oscillation |

The third row is where the two halves of this section meet. A negative
discriminant does not mean the problem has no answer; it means the answer is a
conjugate pair, the real part sets the decay rate and the imaginary part sets
the ringing frequency. Answer choices offering "no solution" for a negative
discriminant exist for candidates who stop at the radical.

### Worked example 6.2 — Characteristic roots of a series RLC branch

A series branch has $R = 10\\ \\Omega$, $L = 50\\ \\mathrm{mH}$ and
$C = 100\\ \\mu\\mathrm{F}$. Kirchhoff's voltage law on the loop current gives a
characteristic equation whose standard form is

$$s^{2} + \\frac{R}{L}s + \\frac{1}{LC} = 0 \\quad \\Longrightarrow \\quad s^{2} + 200s + 200000 = 0$$

because $R/L = 10/0.05 = 200$ and $1/(LC) = 1/(0.05 \\times 10^{-4}) = 200000$.
Comparing with the damped-oscillator form $s^{2} + 2\\alpha s + \\omega_{0}^{2}$
reads off the two parameters directly:

$$\\alpha = \\frac{R}{2L} = 100\\ \\mathrm{s^{-1}}, \\qquad \\omega_{0} = \\frac{1}{\\sqrt{LC}} = 447.21\\ \\mathrm{rad/s}$$

The discriminant is $200^{2} - 4(200000) = 40000 - 800000 = -760000$, so the
roots are complex:

$$s = -100 \\pm j\\,435.89\\ \\mathrm{s^{-1}}$$

since $\\sqrt{760000}/2 = 435.89$. The circuit rings at
$435.89\\ \\mathrm{rad/s}$ inside an envelope decaying as
$e^{-100t}$. The damping ratio is $\\zeta = \\alpha/\\omega_{0} = 100/447.21 = 0.224$,
comfortably underdamped, and the undamped natural frequency corresponds to
$f_{0} = 447.21/(2\\pi) = 71.18\\ \\mathrm{Hz}$. Every one of those numbers comes
from the same three component values and reappears in the Complex Numbers
chapter, where the same branch is driven rather than left to ring.

### Worked example 6.3 — A quadratic whose two roots are both real answers

A 100 V source with 5 Ω of internal resistance drives a variable load
resistance. Which values of that load absorb exactly 400 W?

$$P = \\frac{V^{2}R_{L}}{(R_{s} + R_{L})^{2}} \\quad \\Longrightarrow \\quad 400 = \\frac{10000\\,R_{L}}{(R_{L} + 5)^{2}}$$

Cross-multiplying and dividing by 400 gives
$25R_{L} = R_{L}^{2} + 10R_{L} + 25$, so

$$R_{L}^{2} - 15R_{L} + 25 = 0 \\quad \\Longrightarrow \\quad R_{L} = \\frac{15 \\pm \\sqrt{225 - 100}}{2} = \\frac{15 \\pm 11.18}{2}$$

giving $R_{L} = 13.09\\ \\Omega$ or $R_{L} = 1.91\\ \\Omega$. Both are physical and
both deliver 400 W: one sits above the matched value of 5 Ω and one below, on
either side of the 500 W peak. The sum of the roots is 15 and the product is 25,
which agrees with $-b/a$ and $c/a$ and takes three seconds to check. Discarding
the smaller root because it "looks too small" is the error the question is
built around.

## 6.3 Two equations, and the fastest route through them

Mesh and nodal analysis on a two-loop circuit produce a pair of linear
equations, and there are three standard routes: substitution, elimination, and
determinants. For a two-by-two system the determinant route is fastest because
it is two subtractions and a division, with no intermediate expression to
mis-copy.

For $a_{1}x + b_{1}y = c_{1}$ and $a_{2}x + b_{2}y = c_{2}$:

$$x = \\frac{c_{1}b_{2} - c_{2}b_{1}}{a_{1}b_{2} - a_{2}b_{1}}, \\qquad y = \\frac{a_{1}c_{2} - a_{2}c_{1}}{a_{1}b_{2} - a_{2}b_{1}}$$

The shared denominator is the determinant of the coefficient matrix. If it is
zero the equations describe the same line or two parallel lines, which in a
circuit means the two mesh equations were not independent — usually because a
current source was written as if it were a mesh unknown.

### Worked example 6.4 — Two mesh currents by determinants

Mesh analysis returns $9i_{1} - 4i_{2} = 6$ and $-4i_{1} + 7i_{2} = 13$, with
currents in amperes. The determinant of the coefficients is

$$\\Delta = (9)(7) - (-4)(-4) = 63 - 16 = 47$$

Replacing the first column with the right-hand side gives the numerator for the
first current, and replacing the second column gives the second:

$$i_{1} = \\frac{(6)(7) - (13)(-4)}{47} = \\frac{42 + 52}{47} = \\frac{94}{47} = 2.00\\ \\mathrm{A}$$

$$i_{2} = \\frac{(9)(13) - (-4)(6)}{47} = \\frac{117 + 24}{47} = \\frac{141}{47} = 3.00\\ \\mathrm{A}$$

Substituting back is the check: $9(2) - 4(3) = 6$ and $-4(2) + 7(3) = 13$. Both
hold. The symmetric off-diagonal terms, both $-4$, are the shared branch between
the meshes, and their sign is negative whenever the two mesh currents traverse
that branch in opposite directions. A positive off-diagonal entry in a
resistive mesh matrix almost always means a sign was dropped when writing the
equations, and the determinant will still produce numbers, just wrong ones.`,
  examTip: 'Read the discriminant before solving. On a second-order circuit question the sign of b squared minus 4ac already answers "overdamped, critically damped or underdamped", and that is often the whole question — solving for the roots is wasted time.',
  importantNote: 'Two positive roots of a power equation are usually both valid load values, one above and one below the matched resistance. Discarding one because it seems small is a manufactured error: check both against the original equation rather than against intuition.',
},
{
  id: 'at-identities-derived',
  title: '7. Trigonometry Rebuilt From Two Pictures',
  content: `## 7.1 The unit circle gives the Pythagorean family

A point on the unit circle at angle theta has coordinates
$(\\cos \\theta, \\sin \\theta)$. That is the definition of the two functions, not
a property of them, and every identity in this section is a consequence.

Because the point is on a circle of radius one, its coordinates satisfy
$x^{2} + y^{2} = 1$, which is

$$\\sin^{2}\\theta + \\cos^{2}\\theta = 1$$

Divide that equation through by $\\cos^{2}\\theta$ and the second member of the
family appears; divide by $\\sin^{2}\\theta$ and the third does:

$$\\tan^{2}\\theta + 1 = \\sec^{2}\\theta, \\qquad 1 + \\cot^{2}\\theta = \\csc^{2}\\theta$$

Neither needs separate memorisation. Both are the first identity divided by
something, and on an exam it is faster to divide than to recall.

### Worked example 7.1 — Power factor to power triangle in one step

A load draws 10 kVA at a power factor of 0.8 lagging. Power factor is
$\\cos \\theta$, so

$$\\sin \\theta = \\sqrt{1 - 0.8^{2}} = \\sqrt{0.36} = 0.6, \\qquad \\theta = \\arccos(0.8) = 36.87^\\circ$$

Real power is $P = S\\cos\\theta = 10(0.8) = 8\\ \\mathrm{kW}$ and reactive power is
$Q = S\\sin\\theta = 10(0.6) = 6\\ \\mathrm{kVAR}$. The check is the Pythagorean
relation the triangle was built from: $8^{2} + 6^{2} = 100 = 10^{2}$. Answer
choices that give $Q = 10 - 8 = 2\\ \\mathrm{kVAR}$ subtract the sides of a right
triangle as if they were collinear, and that distractor appears in some form on
almost every power-factor question.

## 7.2 Euler supplies the addition formulas for free

The angle addition formulas are usually presented as four lines to memorise.
They are one line of algebra. Exponentials add their exponents when multiplied:

$$e^{j(A+B)} = e^{jA}\\,e^{jB}$$

Now expand both sides with Euler's relation. The left side is

$$e^{j(A+B)} = \\cos(A+B) + j\\sin(A+B)$$

and the right side is a product of two binomials, remembering $j^{2} = -1$:

$$(\\cos A + j\\sin A)(\\cos B + j\\sin B) = (\\cos A\\cos B - \\sin A\\sin B) + j(\\sin A\\cos B + \\cos A\\sin B)$$

Two complex numbers are equal only when their real parts match and their
imaginary parts match, so reading off the two components gives both formulas at
once:

$$\\cos(A+B) = \\cos A\\cos B - \\sin A\\sin B$$

$$\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B$$

Replacing $B$ with $-B$ flips the sign of every sine and leaves every cosine
alone, which produces the difference formulas without any further work. Setting
$B = A$ produces the double-angle pair:

$$\\sin 2A = 2\\sin A\\cos A, \\qquad \\cos 2A = \\cos^{2}A - \\sin^{2}A$$

Substituting $\\cos^{2}A = 1 - \\sin^{2}A$ into the second gives the two variants
that matter in power calculations, and rearranging them gives the
power-reduction pair:

$$\\cos 2A = 1 - 2\\sin^{2}A = 2\\cos^{2}A - 1$$

$$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}, \\qquad \\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$

One more identity earns its place, the product of two cosines, because it is the
one that turns a product of sinusoids into a sum and therefore produces average
power:

$$\\cos A\\cos B = \\tfrac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right]$$

| Identity | Rearranged as | Where it is used |
|---|---|---|
| $\\sin^{2} + \\cos^{2} = 1$ | $\\sin\\theta = \\sqrt{1 - \\mathrm{pf}^{2}}$ | power triangle from power factor |
| $\\sin 2A = 2\\sin A\\cos A$ | the $2\\omega$ term in $p(t)$ | ripple in single-phase power |
| $\\sin^{2}\\theta = (1 - \\cos 2\\theta)/2$ | mean of $\\sin^{2}$ is $1/2$ | root-mean-square values |
| $\\cos A\\cos B$ product rule | $P + S\\cos(2\\omega t - \\theta)$ | average power from $v$ times $i$ |
| $c^{2} = a^{2} + b^{2} - 2ab\\cos C$ | phasor triangle | magnitude of a sum of two phasors |

### Worked example 7.2 — Instantaneous power, derived rather than quoted

Let $v(t) = V_{m}\\cos\\omega t$ and $i(t) = I_{m}\\cos(\\omega t - \\theta)$, so the
current lags by theta. Instantaneous power is the product:

$$p(t) = V_{m}I_{m}\\cos\\omega t\\,\\cos(\\omega t - \\theta)$$

Apply the product rule above with $A = \\omega t$ and $B = \\omega t - \\theta$. The
difference $A - B$ is theta and the sum is $2\\omega t - \\theta$:

$$p(t) = \\frac{V_{m}I_{m}}{2}\\left[\\cos\\theta + \\cos(2\\omega t - \\theta)\\right]$$

In terms of rms values, where $V = V_{m}/\\sqrt{2}$ and $I = I_{m}/\\sqrt{2}$, the
leading factor becomes $VI$:

$$p(t) = VI\\cos\\theta + VI\\cos(2\\omega t - \\theta)$$

The first term is constant and is the average power. The second oscillates at
twice the supply frequency and averages to zero over a cycle. Put numbers to it:
120 V rms, 10 A rms, theta of 30 degrees. Then
$S = 1200\\ \\mathrm{VA}$, $P = 1200\\cos 30^\\circ = 1039\\ \\mathrm{W}$ and
$Q = 1200\\sin 30^\\circ = 600\\ \\mathrm{VAR}$. The instantaneous power swings
between $1039 - 1200 = -161\\ \\mathrm{W}$ and
$1039 + 1200 = 2239\\ \\mathrm{W}$, at 120 Hz on a 60 Hz supply. The negative
excursion is real: for part of every cycle the load returns stored energy to the
source. That is what reactive power describes, and it is why a 120 Hz hum, not a
60 Hz one, comes off a single-phase transformer.

### Worked example 7.3 — Where the three-phase root of three comes from

Two line-to-neutral voltages of a balanced three-phase set have equal magnitude
120 V and are 120 degrees apart. The line-to-line voltage is their difference,
and the law of cosines gives its magnitude directly. The angle between the two
phasors being subtracted is 120 degrees, so

$$V_{LL} = \\sqrt{120^{2} + 120^{2} - 2(120)(120)\\cos 120^\\circ}$$

With $\\cos 120^\\circ = -0.5$ the third term adds rather than subtracts:

$$V_{LL} = \\sqrt{14400 + 14400 + 14400} = \\sqrt{43200} = 207.85\\ \\mathrm{V}$$

which is exactly $120\\sqrt{3}$. Carrying the phasor subtraction through instead
of the law of cosines gives the same magnitude and also the angle: the
line-to-line phasor leads its reference line-to-neutral phasor by 30 degrees.
The root of three is geometry, not a convention, and it comes from
$\\cos 120^\\circ = -1/2$.`,
  examTip: 'Deriving the addition formulas from Euler takes about twenty seconds and never produces a sign error, whereas recalling four separate formulas under pressure often does. If you can write e to the jA times e to the jB and expand it, you own all four.',
  importantNote: 'Instantaneous single-phase power is the average plus a term at TWICE the supply frequency: p(t) = VI cos(theta) + VI cos(2 omega t - theta). The two terms add. Three-phase power has no such ripple because the three 2 omega terms are 240 degrees apart and sum to zero.',
},
{
  id: 'at-harmonic-addition',
  title: '8. Harmonic Addition: the Bridge to Phasors',
  content: `## 8.1 Two sinusoids at one frequency are always one sinusoid

This is the single most useful identity in electrical engineering, because it is
the reason phasors exist. A sine and a cosine at the same frequency, in any
proportion, combine into one cosine of that same frequency with a shifted phase:

$$a\\cos x + b\\sin x = R\\cos(x - \\varphi)$$

The proof is one expansion. Apply the difference formula to the right side:

$$R\\cos(x - \\varphi) = R\\cos\\varphi\\,\\cos x + R\\sin\\varphi\\,\\sin x$$

For this to hold at every value of $x$, the coefficients of $\\cos x$ and of
$\\sin x$ must match separately, so $a = R\\cos\\varphi$ and $b = R\\sin\\varphi$.
Squaring and adding those two eliminates the angle, and dividing them
eliminates the magnitude:

$$R = \\sqrt{a^{2} + b^{2}}, \\qquad \\tan\\varphi = \\frac{b}{a}$$

The angle needs the same quadrant discipline as any rectangular-to-polar
conversion, because the ratio $b/a$ cannot distinguish the pair
$(a, b) = (-3, -4)$ from $(3, 4)$.

![Three curves on a common angle axis: 3 cos x, 4 sin x, and their sum, which is a single sinusoid of amplitude 5 peaking at 53.13 degrees. The sum is drawn twice, once as a point-by-point addition and once from the single-sinusoid formula, and the two coincide.](/courses/fe-ee/figures/math2-at-harmonic-addition.svg)

### Worked example 8.1 — Three cosine plus four sine

With $a = 3$ and $b = 4$:

$$R = \\sqrt{9 + 16} = 5, \\qquad \\varphi = \\arctan\\frac{4}{3} = 53.13^\\circ$$

so $3\\cos x + 4\\sin x = 5\\cos(x - 53.13^\\circ)$. Both $a$ and $b$ are positive,
which places the angle in the first quadrant, so the calculator's arctangent can
be taken as it stands.

Check it at one convenient value rather than trusting the algebra. At
$x = 20^\\circ$ the left side is $3(0.9397) + 4(0.3420) = 4.187$, and the right
side is $5\\cos(20^\\circ - 53.13^\\circ) = 5\\cos(-33.13^\\circ) = 5(0.8374) = 4.187$.
They agree to the digits shown, and a single spot check like that catches a sign
error in the phase immediately.

### Worked example 8.2 — When the sine coefficient is negative

Combine $8\\cos\\omega t - 6\\sin\\omega t$. Here $a = 8$ and $b = -6$, so

$$R = \\sqrt{64 + 36} = 10, \\qquad \\varphi = \\arctan\\frac{-6}{8} = -36.87^\\circ$$

The result is $10\\cos(\\omega t + 36.87^\\circ)$, because subtracting a negative phi
inside the cosine adds it. The amplitude 10 is not 14: adding the two
coefficients arithmetically is the standard wrong answer and it is always
offered. It is only correct when one of the two coefficients is zero.

## 8.2 The same statement, written as phasors

Harmonic addition is what makes the phasor transform consistent. Take
$\\cos\\omega t$ as the reference phasor $1\\angle 0^\\circ$. Since
$\\sin\\omega t = \\cos(\\omega t - 90^\\circ)$, the sine maps to
$1\\angle -90^\\circ$, which is $-j$. So the whole combination maps to

$$a\\cos\\omega t + b\\sin\\omega t \\;\\longleftrightarrow\\; a - jb$$

For $a = 3$ and $b = 4$ that phasor is $3 - j4 = 5\\angle -53.13^\\circ$, and
converting back gives $5\\cos(\\omega t - 53.13^\\circ)$ — the same answer as the
trigonometric route, obtained by one rectangular-to-polar conversion. This is
the entire economy of the phasor method: the identity that took an expansion and
a coefficient match becomes a conversion you already know how to do.

## 8.3 Adding two phasors of arbitrary phase

When the two components are not conveniently a sine and a cosine, the law of
cosines gives the magnitude of the sum. For phasors of magnitude $A$ and $B$
separated by phi:

$$\\lvert R \\rvert = \\sqrt{A^{2} + B^{2} + 2AB\\cos\\varphi}$$

The plus sign in front of the cross term is correct for a sum: the triangle
being solved has the interior angle $180^\\circ - \\varphi$, and the sign change
comes with it.

![Magnitude of the sum of a 100 V phasor and a 60 V phasor plotted against the phase angle between them, running from 160 V when they are in phase down to 40 V when they oppose, with the arithmetic sum of 160 V drawn as a horizontal line that the curve leaves immediately.](/courses/fe-ee/figures/math2-at-phasor-resultant.svg)

| Phase difference | Magnitude of the sum of 100 V and 60 V |
|---|---|
| $0^\\circ$ | 160.0 V |
| $30^\\circ$ | 154.9 V |
| $60^\\circ$ | 140.0 V |
| $90^\\circ$ | 116.6 V |
| $120^\\circ$ | 87.2 V |
| $180^\\circ$ | 40.0 V |

The 90 degree row is worth holding: two perpendicular phasors combine as the
square root of the sum of squares, which is why a resistive drop and a reactive
drop of 100 V and 60 V give 116.6 V across the pair and not 160 V. Adding
voltage magnitudes around an AC loop is the most expensive habit carried over
from DC circuits.

### Worked example 8.3 — One hundred volts plus sixty volts at sixty degrees

Convert the second phasor to rectangular and add components:

$$100\\angle 0^\\circ + 60\\angle 60^\\circ = 100 + (30 + j51.96) = 130 + j51.96$$

$$\\lvert R \\rvert = \\sqrt{130^{2} + 51.96^{2}} = \\sqrt{19600} = 140.0\\ \\mathrm{V}, \\qquad \\angle R = \\arctan\\frac{51.96}{130} = 21.79^\\circ$$

The law of cosines confirms it without the rectangular step:
$\\sqrt{10000 + 3600 + 2(100)(60)(0.5)} = \\sqrt{19600} = 140$. The 20 V shortfall
against the arithmetic sum of 160 V is the cost of the 60 degree offset, and it
is the answer the question is testing.

### Worked example 8.4 — Two equal phasors 120 degrees apart

Two 100 V phasors separated by 120 degrees sum to

$$\\sqrt{100^{2} + 100^{2} + 2(100)(100)\\cos 120^\\circ} = \\sqrt{10000 + 10000 - 10000} = 100\\ \\mathrm{V}$$

The sum of two of them has the same magnitude as either one. That is the
arithmetic behind a balanced three-phase set summing to zero: adding the third
phasor, another 100 V at the remaining 120 degree position, cancels the 100 V
resultant exactly. Nothing about this requires three-phase theory — it is the
law of cosines applied twice.`,
  examTip: 'Never add sinusoid amplitudes or phasor magnitudes directly unless the phase difference is zero. The correct combination is the law of cosines, and for the common perpendicular case it collapses to the square root of the sum of squares.',
  importantNote: 'A cos plus b sin equals R cos(x - phi) with R the square root of a squared plus b squared. In phasor form the same statement is simply a - jb, because sine lags cosine by 90 degrees. Recognising these as one fact removes a whole category of trigonometric algebra.',
},
{
  id: 'at-small-angle',
  title: '9. Small Angles, and the Price of the Shortcut',
  content: `## 9.1 Where the approximations come from

The small-angle rules are the first terms of series expansions about zero, and
knowing which term was dropped tells you how much error was accepted. With the
angle in radians:

$$\\sin x = x - \\frac{x^{3}}{3!} + \\frac{x^{5}}{5!} - \\cdots$$

$$\\cos x = 1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!} - \\cdots$$

$$\\tan x = x + \\frac{x^{3}}{3} + \\frac{2x^{5}}{15} + \\cdots$$

Keeping only the leading term gives $\\sin x \\approx x$, $\\tan x \\approx x$ and
$\\cos x \\approx 1$. The relative error of each is the ratio of the first
discarded term to the value itself:

$$\\frac{x - \\sin x}{\\sin x} \\approx \\frac{x^{2}}{6}, \\qquad \\frac{\\tan x - x}{\\tan x} \\approx \\frac{x^{2}}{3}$$

Setting each of those to 0.01 predicts the one-percent angle without any
plotting. For the sine, $x = \\sqrt{0.06} = 0.245\\ \\mathrm{rad} = 14.0^\\circ$; for
the tangent, $x = \\sqrt{0.03} = 0.173\\ \\mathrm{rad} = 9.9^\\circ$. The tangent
fails at a smaller angle than the sine, by a factor of the square root of two,
because its error coefficient is twice as large.

![Percentage error of the two small-angle approximations plotted against angle in degrees, with a horizontal one-percent line crossed by the tangent curve near 9.9 degrees and by the sine curve near 14 degrees.](/courses/fe-ee/figures/math2-at-small-angle.svg)

The figure computes those curves directly and finds the crossings numerically at
9.9 degrees and 14.0 degrees, matching the closed-form estimates above. Below
about ten degrees both approximations are free; above about twenty degrees
neither is.

| Angle | $\\sin x$ | error of $\\sin x \\approx x$ | $\\tan x$ | error of $\\tan x \\approx x$ |
|---|---|---|---|---|
| $5^\\circ$ | 0.08716 | 0.13% | 0.08749 | 0.25% |
| $10^\\circ$ | 0.17365 | 0.51% | 0.17633 | 1.02% |
| $15^\\circ$ | 0.25882 | 1.15% | 0.26795 | 2.30% |
| $20^\\circ$ | 0.34202 | 2.06% | 0.36397 | 4.09% |
| $30^\\circ$ | 0.50000 | 4.72% | 0.57735 | 9.31% |

### Worked example 9.1 — Sine at ten degrees

Convert first, because the approximation is a statement about radians:
$10^\\circ = 10\\pi/180 = 0.17453\\ \\mathrm{rad}$. The true sine is 0.17365, so the
approximation is high by

$$\\frac{0.17453 - 0.17365}{0.17365} = 0.0051 = 0.51\\%$$

which agrees with the predicted $x^{2}/6 = 0.0305/6 = 0.0051$. Half a percent is
below the resolution of most exam answer choices, so at ten degrees the
substitution is safe.

### Worked example 9.2 — Tangent at twenty degrees

At $20^\\circ = 0.34907\\ \\mathrm{rad}$ the true tangent is 0.36397. The error is

$$\\frac{0.36397 - 0.34907}{0.36397} = 0.0409 = 4.09\\%$$

Four percent will usually move an answer into a neighbouring choice. Note the
relationship to the previous example: at the same angle the tangent error is
twice the sine error, exactly as the $x^{2}/3$ against $x^{2}/6$ coefficients
predict.

### Worked example 9.3 — The cosine needs its quadratic term

At $15^\\circ = 0.26180\\ \\mathrm{rad}$, the crude approximation $\\cos x \\approx 1$
gives an error of $(1 - 0.96593)/0.96593 = 3.53\\%$, which is far worse than
either of the other two at the same angle. Keeping the quadratic term repairs
it completely:

$$\\cos x \\approx 1 - \\frac{x^{2}}{2} = 1 - \\frac{0.06854}{2} = 0.96573$$

against a true value of 0.96593, an error of 0.02%. The asymmetry is structural:
sine and tangent lose their first correction at the cubic term, while cosine
loses it at the quadratic term, so cosine must be carried to one more order to
reach comparable accuracy.

## 9.2 Where this is used, and where it is a trap

Small-angle substitution appears in three recognisable places on this exam. In
phase-error problems, a few degrees of phase in radians is the fractional
timing error directly. In linearised mechanics and control, restoring torque
proportional to $\\sin\\theta$ becomes proportional to theta, which is what makes
a pendulum's period independent of amplitude for small swings. And in
transmission-line and antenna approximations, path-length differences use
$\\tan\\theta \\approx \\theta$.

The trap is always the same: the approximations hold for radians only. Writing
$\\sin 12^\\circ \\approx 12$ is not an approximation, it is a unit error of two
orders of magnitude, and it is a supplied answer choice precisely because a
candidate working quickly can produce it.`,
  examTip: 'Convert to radians before applying any small-angle rule, and remember the two thresholds: the tangent approximation passes one percent error at about 9.9 degrees, the sine at about 14 degrees. Beyond twenty degrees, use the calculator.',
  importantNote: 'The cosine is the exception. Approximating cos x as 1 is much cruder than approximating sin x as x at the same angle, because the first neglected term is quadratic rather than cubic. Keep the term in x squared over 2 whenever a cosine appears in a small-angle argument.',
},
{
  id: 'at-logs-db',
  title: '10. Logarithms, Decibels, and Solving for an Exponent',
  content: `## 10.1 The three rules, and the one that gets misused

Logarithms turn multiplication into addition, which is the only reason gain
budgets are written in decibels:

$$\\log(MN) = \\log M + \\log N, \\qquad \\log\\frac{M}{N} = \\log M - \\log N, \\qquad \\log M^{p} = p\\log M$$

The third rule is the one that produces the factor of twenty in the voltage
decibel formula, and it is also the one candidates misapply: there is no rule
for the logarithm of a sum. Writing $\\log(M + N)$ as anything simpler is wrong,
and a question that puts two gains in parallel rather than in cascade is
checking exactly that.

Change of base is occasionally needed when a natural logarithm appears in a
time-constant problem and the answer is wanted in base ten, or the reverse:

$$\\log_{b}x = \\frac{\\ln x}{\\ln b}, \\qquad \\ln x = 2.3026\\log_{10}x$$

## 10.2 Decibels: one definition, two factors

A decibel is defined on a power ratio. Everything else follows from that one
definition:

$$G_{\\mathrm{dB}} = 10\\log_{10}\\frac{P_{2}}{P_{1}}$$

When the quantity given is a voltage or a current rather than a power, and the
two are measured across the same resistance, power goes as the square of the
amplitude. Substituting $P \\propto V^{2}$ and using the third logarithm rule
converts the ten into a twenty:

$$G_{\\mathrm{dB}} = 10\\log_{10}\\frac{V_{2}^{2}}{V_{1}^{2}} = 20\\log_{10}\\frac{V_{2}}{V_{1}}$$

There is no second rule here. The twenty is the ten with the square brought out
in front, and that is the whole answer to "why twenty for voltage".

![Decibels plotted against ratio on a logarithmic axis, showing the amplitude line at twenty times the base-ten logarithm and the power line at ten times, with the doubling, tenfold and hundredfold anchor points marked on both.](/courses/fe-ee/figures/math2-at-db-anchors.svg)

| Ratio | As a power ratio | As an amplitude ratio |
|---|---|---|
| $\\times 2$ | +3.01 dB | +6.02 dB |
| $\\times 10$ | +10 dB | +20 dB |
| $\\times 100$ | +20 dB | +40 dB |
| $\\times 0.5$ | −3.01 dB | −6.02 dB |
| $\\times 0.707$ | −1.51 dB | −3.01 dB |

The last row is the half-power point stated two ways, and it explains a piece of
notation that confuses people the first time they meet it: the −3 dB bandwidth
of a filter is where the power has fallen to half, which is where the voltage has
fallen to 0.707 of its passband value. Both statements describe the same
frequency, and 0.707 is $1/\\sqrt{2}$, the same number that appeared as
$\\cos 45^\\circ$ in the unit circle table.

### Worked example 10.1 — A cascade of stages

An amplifier chain has stages of +20 dB, +15 dB and a −6 dB pad. Decibels add
along a cascade because gains multiply:

$$G_{\\mathrm{total}} = 20 + 15 - 6 = 29\\ \\mathrm{dB}$$

If these are voltage gains, the overall ratio is

$$\\frac{V_{\\mathrm{out}}}{V_{\\mathrm{in}}} = 10^{29/20} = 28.18$$

Verify by multiplying the stage gains individually:
$10 \\times 5.623 \\times 0.5012 = 28.18$. The check is worth doing once to
convince yourself that addition in decibels really is multiplication in ratios,
after which the addition can be trusted.

### Worked example 10.2 — Decibels referred to a milliwatt

The dBm scale is an absolute power measured against a 1 mW reference, so it
follows the power rule with ten in front:

$$P_{\\mathrm{dBm}} = 10\\log_{10}\\frac{P}{1\\ \\mathrm{mW}}$$

A signal at 20 dBm is therefore $10^{2} = 100$ times a milliwatt, or 100 mW. Into
a 50 Ω system the corresponding rms voltage follows from $P = V^{2}/R$:

$$V = \\sqrt{PR} = \\sqrt{(0.1)(50)} = 2.236\\ \\mathrm{V\\,rms}$$

At 30 dBm the power is 1 W and the voltage is $\\sqrt{50} = 7.07\\ \\mathrm{V}$ rms.
Note that dBm is a power level even when the answer wanted is a voltage, so the
factor is ten going in and the square root comes at the end.

### Worked example 10.3 — Solving for time with a natural logarithm

A capacitor discharging through a resistor obeys
$v(t) = V_{0}e^{-t/\\tau}$, and questions usually ask when the voltage reaches
some value. Solving for the exponent means taking a logarithm of both sides:

$$\\frac{v}{V_{0}} = e^{-t/\\tau} \\quad \\Longrightarrow \\quad t = \\tau\\ln\\frac{V_{0}}{v}$$

With $\\tau = 20\\ \\mathrm{ms}$, a fall from 10 V to 2 V takes

$$t = 0.020\\ln(5) = 0.020(1.609) = 32.2\\ \\mathrm{ms}$$

which is a little over one and a half time constants, as expected since one time
constant leaves 36.8% and this ratio is 20%. Using $\\log_{10}$ instead of
$\\ln$ gives 14.0 ms, a factor of 2.303 too small, and that wrong answer is
always among the choices.`,
  examTip: 'Decide first whether the ratio you were handed is power or amplitude, because that single decision picks the factor of 10 or 20. If the question mentions volts, amps or field strength, it is amplitude; if it mentions watts, it is power.',
  importantNote: 'Decibels add along a cascade only because logarithms turn products into sums. There is no corresponding rule for a sum of two signals: log(M + N) does not simplify, so combining two parallel signal paths must be done in ratios and converted back at the end.',
},
{
  id: 'at-set-b',
  title: '11. Problem Set: Quadratics, Systems and Ratios',
  content: `Work each of these on paper first, with the handbook and a calculator,
before reading the answer underneath. Three minutes apiece is the exam's pace.

## Problem Set A

1. A second-order circuit has the characteristic equation
   $2s^{2} + 14s + 20 = 0$. Give both roots and classify the response.
2. Another has $s^{2} + 6s + 25 = 0$. Give the roots, the damping constant, the
   damped radian frequency and the undamped natural frequency.
3. Solve $5x - 2y = 16$ and $3x + 4y = 20$ by determinants.
4. A 10 kVA load runs at a power factor of 0.8 lagging. Find theta, the real
   power and the reactive power.
5. A single-phase 240 V load absorbs 8 kW at a power factor of 0.85. Find the
   line current.
6. Express $-5 - j12$ in polar form.

### Worked answers to Problem Set A

**1.** Divide through by the leading coefficient first, or carry it: either way
the discriminant is $b^{2} - 4ac = 196 - 160 = 36$, so

$$s = \\frac{-14 \\pm 6}{4} = -2\\ \\mathrm{and}\\ -5$$

Two distinct real negative roots, so the response is overdamped and stable. The
trap is computing $b^{2} - 4c = 196 - 80 = 116$ with the leading coefficient
dropped from the product, which yields −0.81 and −6.19: still real, still
negative, still plausible, and wrong. The discriminant needs all three
coefficients.

**2.** Here $D = 36 - 100 = -64$, so

$$s = \\frac{-6 \\pm j8}{2} = -3 \\pm j4$$

The damping constant is $\\alpha = 3\\ \\mathrm{Np/s}$, the damped frequency is
$\\omega_{d} = 4\\ \\mathrm{rad/s}$, and the undamped natural frequency is
$\\omega_{0} = \\sqrt{25} = 5\\ \\mathrm{rad/s}$, which is also the magnitude of
either root. The damping ratio is $3/5 = 0.6$. A choice reading "no real
solution" is offered for candidates who treat a negative discriminant as a dead
end; a choice giving $\\omega_{0} = 4$ confuses the damped frequency with the
natural one, and those differ whenever damping is present.

**3.** The determinant of the coefficient matrix is
$(5)(4) - (3)(-2) = 20 + 6 = 26$. Then

$$x = \\frac{(16)(4) - (20)(-2)}{26} = \\frac{104}{26} = 4, \\qquad y = \\frac{(5)(20) - (3)(16)}{26} = \\frac{52}{26} = 2$$

Substituting back: $5(4) - 2(2) = 16$ and $3(4) + 4(2) = 20$. Both hold. The
common error is a sign slip in the determinant, since one coefficient is
negative; that produces 14 instead of 26 and answers of 7.43 and 3.71, neither
of which survives substitution — which is why substituting back is not optional.

**4.** $\\theta = \\arccos(0.8) = 36.87^\\circ$, and $\\sin\\theta = 0.6$ from the
Pythagorean identity. So

$$P = 10(0.8) = 8\\ \\mathrm{kW}, \\qquad Q = 10(0.6) = 6\\ \\mathrm{kVAR}$$

The 6-8-10 triangle should be recognised on sight. The distractor is
$Q = 10 - 8 = 2\\ \\mathrm{kVAR}$, obtained by subtracting the sides of a right
triangle instead of using the Pythagorean relation.

**5.** Real power equals voltage times current times power factor, so

$$I = \\frac{P}{V\\,\\mathrm{pf}} = \\frac{8000}{(240)(0.85)} = 39.2\\ \\mathrm{A}$$

The angle is $\\arccos(0.85) = 31.79^\\circ$, and the apparent power is
$8000/0.85 = 9412\\ \\mathrm{VA}$, which times-checks against
$(240)(39.2) = 9412$. Dividing by the voltage alone gives 33.3 A, the current
that would flow if the load were purely resistive, and that value is always an
offered choice.

**6.** The magnitude is $\\sqrt{25 + 144} = 13$. The calculator returns
$\\arctan(-12/-5) = \\arctan(2.4) = 67.38^\\circ$, but both components are
negative, which puts the point in the third quadrant:

$$-5 - j12 = 13\\angle(67.38^\\circ - 180^\\circ) = 13\\angle -112.62^\\circ$$

Accepting the calculator's 67.38 degrees places a third-quadrant point in the
first quadrant, an error of exactly 180 degrees, which in an AC problem inverts
the sign of both the real and the reactive power.`,
},
{
  id: 'at-set-c',
  title: '12. Problem Set: Waves, Approximations and Decibels',
  content: `The second set draws on sections 8 through 10. Again, solve before
reading.

## Problem Set B

1. Write $7\\cos\\omega t + 24\\sin\\omega t$ as a single cosine.
2. Two phasors of 120 V and 50 V are 90 degrees apart. Find the magnitude of
   their sum and its angle relative to the larger one.
3. Two 100 V phasors are 120 degrees apart. Find the magnitude of their sum.
4. Estimate $\\sin 12^\\circ$ with the small-angle rule and state the percentage
   error.
5. An amplifier raises 2 W to 80 W. Give the gain in decibels. Then state what
   the answer would be if 2 and 80 were volts instead.
6. An attenuator is specified at −20 dB. Give the voltage ratio and the power
   ratio.
7. A chain has a 12 dB stage, an 18 dB stage, and then a resistive divider that
   halves the voltage twice. Give the overall voltage gain as a ratio.

### Worked answers to Problem Set B

**1.** $R = \\sqrt{49 + 576} = \\sqrt{625} = 25$ and
$\\varphi = \\arctan(24/7) = 73.74^\\circ$, both coefficients being positive, so

$$7\\cos\\omega t + 24\\sin\\omega t = 25\\cos(\\omega t - 73.74^\\circ)$$

The 7-24-25 triple is worth recognising alongside 3-4-5 and 5-12-13. Adding the
coefficients to get 31 is the offered trap, and so is writing the phase with the
wrong sign, which puts the peak on the wrong side of the origin.

**2.** Perpendicular phasors combine as the square root of the sum of squares:

$$\\lvert R \\rvert = \\sqrt{120^{2} + 50^{2}} = \\sqrt{16900} = 130\\ \\mathrm{V}, \\qquad \\angle = \\arctan\\frac{50}{120} = 22.62^\\circ$$

The 5-12-13 triangle again, scaled by ten. The arithmetic sum of 170 V is the
distractor and it is 31% high.

**3.** From the law of cosines with $\\cos 120^\\circ = -0.5$:

$$\\lvert R \\rvert = \\sqrt{10000 + 10000 - 10000} = 100\\ \\mathrm{V}$$

Two equal phasors at 120 degrees sum to one of the same magnitude. Both 200 V
(arithmetic addition) and 0 V (assuming they cancel, which needs 180 degrees,
not 120) are offered, and both are wrong.

**4.** Convert first: $12^\\circ = 0.20944\\ \\mathrm{rad}$, against a true sine of
0.20791. The error is

$$\\frac{0.20944 - 0.20791}{0.20791} = 0.0073 = 0.73\\%$$

so the approximation is high by three quarters of a percent, comfortably inside
the safe region below 14 degrees. Applying the rule to the number 12 without
converting gives 12, which is off by a factor of 58.

**5.** These are watts, so the power form applies:

$$G = 10\\log_{10}\\frac{80}{2} = 10\\log_{10}40 = 16.02\\ \\mathrm{dB}$$

Had they been volts, the amplitude form would double it to
$20\\log_{10}40 = 32.04\\ \\mathrm{dB}$. The pair of answers differing by exactly a
factor of two is the signature of this trap, and the deciding word in the
question is the unit.

**6.** A negative decibel figure is an attenuation, and the two ratios follow
from the two formulas:

$$\\frac{V_{2}}{V_{1}} = 10^{-20/20} = 0.1, \\qquad \\frac{P_{2}}{P_{1}} = 10^{-20/10} = 0.01$$

So a −20 dB pad divides voltage by ten and power by a hundred. Quoting 0.01 for
the voltage ratio is the standard error, and it makes a 40 dB difference to a
link budget.

**7.** Halving the voltage twice is a factor of one quarter, which in decibels is

$$20\\log_{10}(0.25) = -12.04\\ \\mathrm{dB}$$

so the total is $12 + 18 - 12.04 = 17.96\\ \\mathrm{dB}$, and the overall voltage
ratio is $10^{17.96/20} = 7.91$. Check it directly in ratios:
$3.981 \\times 7.943 \\times 0.25 = 7.91$. The two routes agree, which is the
reassurance that decibel addition and ratio multiplication really are the same
operation written two ways.`,
},
],
  keyTakeaways: [
    'Quadratic formula solves ax²+bx+c=0; discriminant b²-4ac determines real vs. complex roots.',
    'sin²θ + cos²θ = 1 is the most frequently used trigonometric identity on the FE exam.',
    'Angle addition formulas are essential for combining sinusoidal signals in AC analysis.',
    'Rectangular to polar: r = sqrt(x²+y²), θ = arctan(y/x) with quadrant correction.',
    'Memorize unit circle values for 0, 30, 45, 60, 90 degrees — they appear repeatedly.',
  ],
},

fee_complex: {
  topicId: 'fee_complex',
  title: 'Complex Numbers',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Complex numbers are indispensable for AC circuit analysis. Phasor representation, impedance calculations, and power factor analysis all rely on fluent manipulation of complex arithmetic, Euler formula, and rectangular-polar conversions.',
  sections: [
    {
      id: 'cx-forms-euler',
      title: '1. Complex Number Forms and Euler Formula',
      content: `## 1.1 Rectangular and Polar Forms

A complex number has two equivalent representations:

- **Rectangular form**: z = a + jb (where j = sqrt(-1) in EE convention)
- **Polar form**: z = r∠θ = r·e^(jθ)

The bridge between them is **Euler's formula**:

**$e^{j\\theta} = \\cos \\theta + j\\cdot \\sin \\theta$**

### Conversion Between Forms

| From → To | Formula |
|---|---|
| Rectangular → Polar | $r = \\sqrt{a^{2} + b^{2}}, \\theta = \\arctan (b/a)$ |
| Polar → Rectangular | $a = r\\cdot \\cos \\theta, b = r\\cdot \\sin \\theta$ |

### The Complex Conjugate

The **complex conjugate** of z = a + jb is z* = a - jb. Key properties:
- **z · z* = a² + b² = |z|²** (always real and positive)
- **Re(z) = (z + z*) / 2**
- **Im(z) = (z - z*) / (2j)**

The conjugate is essential for:
- Division of complex numbers
- Computing power in AC circuits (S = V · I*)
- Rationalizing denominators`,
      examTip: 'Euler formula e^(jθ) = cosθ + j·sinθ connects all three forms. On the FE exam, use rectangular form for addition/subtraction and polar form for multiplication/division. Converting between forms is the most common source of errors — practice until automatic.',
    },
    {
      id: 'cx-arithmetic',
      title: '2. Complex Arithmetic for Circuit Analysis',
      content: `## 2.1 Addition and Subtraction

Add/subtract in **rectangular form** — combine real and imaginary parts separately:

- (a + jb) + (c + jd) = (a+c) + j(b+d)
- (a + jb) - (c + jd) = (a-c) + j(b-d)

## 2.2 Multiplication and Division

Multiply/divide in **polar form** — multiply magnitudes, add/subtract angles:

- ($r_{1}$∠θ₁) · ($r_{2}$∠θ₂) = r₁r₂ ∠(θ₁ + θ₂)
- ($r_{1}$∠θ₁) / ($r_{2}$∠θ₂) = ($r_{1}$/$r_{2}$) ∠(θ₁ - θ₂)

In rectangular form, division uses the **conjugate**:

**$(a + jb) / (c + jd) = [(a + jb)(c - jd)] / [(c + jd)(c - jd)] = [(ac + bd) + j(bc - ad)] / (c^{2} + d^{2})$**

## 2.3 Phasor Representation

A sinusoidal signal v(t) = Vm·cos(ωt + φ) corresponds to **phasor V = Vm∠φ**:

| Time Domain | Phasor Domain |
|---|---|
| $v(t) = Vm\\cdot \\cos (\\omega t + \\phi)$ | $V = Vm\\angle \\phi$ |
| Addition of sinusoids | Vector addition of phasors |
| Differentiation (jω multiplier) | Multiply by jω |
| Integration (1/jω multiplier) | Divide by jω |

### Why Phasors Work

Phasors eliminate the time variable by assuming all signals share the same frequency ω. This converts differential equations into algebraic equations — the entire basis of AC steady-state analysis.`,
      examTip: 'When the FE exam gives you impedances to add in series, keep rectangular form (just add R and X components). When multiplying V = I·Z, convert to polar first. Getting this workflow automatic is the single biggest time-saver for circuit problems.',
      importantNote: 'EE convention uses j (not i) for the imaginary unit because i is reserved for current. On the FE exam, all complex numbers use j notation. Remember j² = -1, j³ = -j, j⁴ = 1.',
    },
    {
      id: 'cx-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Impedance arithmetic in the right form

Two impedances in series: Z1 = 3 + j4 and Z2 = 6 - j2.

Series means ADD, so use rectangular: Z = (3+6) + j(4-2) = **9 + j2 ohm**, magnitude sqrt(81+4) = 9.22 ohm at arctan(2/9) = 12.5 degrees.

Now put them in parallel instead. Product over sum needs both operations, so convert:

Z1 = 5 at 53.1 degrees, Z2 = 6.32 at -18.4 degrees.
Product (polar): 5 x 6.32 = 31.6 at (53.1 - 18.4) = **31.6 at 34.7 degrees**.
Sum (rectangular): 9 + j2 = 9.22 at 12.5 degrees.
Quotient (polar): 31.6/9.22 = 3.43 at (34.7 - 12.5) = **3.43 at 22.2 degrees**.

Multiply and divide in polar, add and subtract in rectangular. Doing it the other way round is possible but wastes minutes you do not have.

## 3.2 Euler and the phasor

e^(j theta) = cos(theta) + j sin(theta). A sinusoid v(t) = V_m cos(omega t + phi) becomes the phasor V = V_m at phi, and the time dependence e^(j omega t) is carried implicitly because every quantity in the circuit shares it.

That is the whole reason phasors work: a linear circuit driven at one frequency has every voltage and current at that same frequency, so the common factor cancels and differential equations become algebra.

Differentiation becomes multiplication by j omega; integration becomes division by j omega. Hence Z_L = j omega L and Z_C = 1/(j omega C) = -j/(omega C).

## 3.3 Rationalising a quotient

Compute (4 + j3)/(2 - j1). Multiply numerator and denominator by the conjugate of the denominator:

Numerator: (4 + j3)(2 + j1) = 8 + j4 + j6 + j^2 3 = 8 + j10 - 3 = 5 + j10
Denominator: (2 - j1)(2 + j1) = 4 + 1 = 5

Result: (5 + j10)/5 = **1 + j2**.

Check in polar: (5 at 36.9)/(2.24 at -26.6) = 2.24 at 63.5 degrees, and 1 + j2 = 2.24 at 63.4 degrees. Agrees.

## 3.4 Powers and roots

De Moivre: (r at theta)^n = r^n at n theta. So (2 at 30 degrees)^3 = 8 at 90 degrees = **j8**.

Roots are the same rule with a fractional exponent, and there are n of them spaced 360/n degrees apart. The square roots of 4 at 60 degrees are 2 at 30 degrees and 2 at 210 degrees.

Useful constants: j^2 = -1, 1/j = -j, and j = 1 at 90 degrees. Multiplying by j is a 90-degree rotation, which is exactly why inductive reactance leads and capacitive lags.`,
      examTip: 'Set your calculator to the angle mode the question uses and check it before you start. Half of all complex-arithmetic errors on this exam are degrees-versus-radians, and the wrong-mode answer is usually still plausible-looking.',
      quiz: [
        {
          question: 'What is (3 at 40 degrees) multiplied by (2 at 20 degrees)?',
          options: ['6 at 60 degrees', '6 at 20 degrees', '5 at 60 degrees', '1.5 at 20 degrees'],
          correctIndex: 0,
          explanation: 'In polar form multiplication multiplies the magnitudes and ADDS the angles: 3 x 2 = 6, and 40 + 20 = 60 degrees. Adding the magnitudes or multiplying the angles produces the distractors.',
        },
        {
          question: 'What is the impedance of a 2 H inductor at omega = 100 rad/s?',
          options: ['j200 ohm', '-j200 ohm', 'j0.02 ohm', '200 ohm resistive'],
          correctIndex: 0,
          explanation: 'Z_L = j omega L = j(100)(2) = j200 ohm. The positive imaginary sign is what makes the voltage lead the current in an inductor. A capacitor gives the opposite sign: Z_C = -j/(omega C).',
        },
        {
          question: 'Simplify (6 + j8)/(3 + j4).',
          options: ['2', '2 + j2', 'j2', '18 + j32'],
          correctIndex: 0,
          explanation: 'Note that 6 + j8 is exactly twice 3 + j4, so the quotient is 2. In polar: (10 at 53.1)/(5 at 53.1) = 2 at 0 degrees. Spotting a common factor is faster than rationalising, and both routes must agree.',
        },
      ],
    },
  {
    id: 'cx-depth',
    title: '4. Choosing a Form, and Paying for the Wrong One',
    content: `## 4.1 The same number, four ways
  
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
  $r_{1}$∠θ₁ × $r_{2}$∠θ₂ = r₁r₂∠(θ₁+θ₂). **Magnitudes multiply, angles add.** In
  rectangular form the same operation needs four products and the j² = −1
  substitution.
  
  ## 4.3 One number pair, both ways, checked against each other
  
  Take $z_{1}$ = 3 + j4 and $z_{2}$ = 5 − j2.
  
  **Sum, in rectangular.** (3+5) + j(4−2) = **8 + j2**. Done in one line.
  
  **Product, in polar.** First convert:
  $z_{1}$ = √(9+16) ∠ arctan(4/3) = 5∠53.13°, and
  $$z_{2} = \\sqrt{25+4} \\angle \\arctan (-2/5) = 5.385\\angle -21.80^\\circ$$.
  Then z₁z₂ = (5)(5.385) ∠ (53.13 − 21.80) = **$26.93\\angle 31.33^\\circ$**.
  
  **The same product, in rectangular, as a check.**
  $$(3+j4)(5-j2) = 15 - j6 + j20 - j^{2}8 = 15 + j14 + 8 = 23 + j14$$.
  Its magnitude is √(529 + 196) = √725 = 26.93, and its angle is
  arctan(14/23) = 31.33°. The two routes agree exactly, which is the point:
  when a phasor answer matters, converting back and comparing costs fifteen
  seconds and catches sign errors that nothing else will.
  
  ## 4.4 Where this lands in circuits
  
  Impedances in **series** add, so keep them rectangular:
  Z = R + j(X_L − X_C), and the real and imaginary parts stay separately
  meaningful — R dissipates, X stores.
  
  Impedances in **parallel** combine through products and quotients, so polar
  pays. For two branches, Z = Z₁Z₂/($Z_{1}$+$Z_{2}$) needs one product (polar), one sum
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
  cancelling it, is a common distractor.`,
    examTip: 'Add in rectangular, multiply in polar. If a problem forces both, convert at the junction rather than committing to one form: converting is cheap, and doing a four-term rectangular multiplication under time pressure is where sign errors come from.',
    importantNote: 'For AC maximum power transfer the load must be the complex CONJUGATE of the source impedance, Z_L = R_s - jX_s. The reactance is cancelled, not copied. An answer choice offering Z_L = Z_s exactly is there for candidates who remember the DC rule and stop thinking.',
  },
{
  id: 'cx-set',
  title: '5. Problem Set: Phasor Arithmetic',
  content: `## 5.1 Series impedance at a stated frequency

A 10 Ω resistor, a 50 mH inductor and a 100 µF capacitor are in series at
60 Hz. Find the total impedance.

$$\\omega = 2\\pi (60) = 377\\ \\mathrm{rad/s}$$
$$X_L = \\omega L = 377(0.05) = 18.85\\ \\Omega$$
$$X_C = 1/(\\omega C) = 1/(377 \\times 100\\times 10^{-6}) = 26.53\\ \\Omega$$

Series impedances add in rectangular form:

$$Z = 10 + j18.85 - j26.53 = 10 - j7.68\\ \\Omega$$

In polar form, |Z| = √(100 + 59.0) = 12.61 Ω and θ = arctan(−7.68/10) =
**$-37.5^\\circ$**. The negative angle means the circuit is net **capacitive**, so
current leads voltage — which follows from X_C exceeding X_L, and is worth
stating as a check rather than discovering later.

## 5.2 Current from that impedance

With 120 V rms applied at 0°:

**I** = 120∠0° / 12.61∠−37.5° = **$9.52\\angle +37.5^\\circ A$**

Division in polar form: magnitudes divide, angles subtract. The current leads by
37.5°, consistent with a capacitive circuit.

Real power: P = VI cos θ = 120(9.52)(cos 37.5°) = 120(9.52)(0.793) = **906 W**.
Check against I²R = (9.52)²(10) = 906 W ✓. Two routes, same answer — and the
second one is a reminder that only the resistance dissipates.

## 5.3 A parallel pair, using both forms

$Z_{1}$ = 6 + j8 and $Z_{2}$ = 10∠−30° are in parallel.

Product, in polar: $Z_{1}$ = 10∠53.13°, so Z₁Z₂ = 100∠23.13°.
Sum, in rectangular: $Z_{2}$ = 8.66 − j5.00, so $Z_{1}$ + $Z_{2}$ = 14.66 + j3.00 =
$$14.96\\angle 11.57^\\circ$$.
Quotient, in polar: Z = 100∠23.13° / 14.96∠11.57° = **$6.68\\angle 11.56^\\circ \\Omega$**

Each operation used the form that suits it, with one conversion at each
junction — which is faster and safer than forcing everything into one form.`,
},
{
  id: 'cx-errors',
  title: '6. Where Marks Are Lost',
  content: `## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Trusting arctan | quadrant II reported as quadrant IV | check the signs of the real and imaginary parts before accepting the angle |
| Adding in polar | magnitudes added directly | convert to rectangular; only multiplication and division work on magnitudes and angles |
| Matching instead of conjugating | Z_L = Z_s for maximum power | the load must be the conjugate, so the reactances cancel |
| Losing j² = −1 | a sign error in the real part | expand carefully, then verify the magnitude against the polar route |

The last one is worth a habit rather than care. After any rectangular
multiplication, compute the magnitude of your answer and compare it against the
product of the two input magnitudes — they must agree exactly, and if they do
not the error is in the expansion.`,
},
{
  id: 'cx-j-operator',
  title: '7. Why j, and What Multiplication Actually Does',
  content: `## 7.1 The imaginary unit as an operator, not a mystery

The imaginary unit is defined by one property, $j^{2} = -1$, and electrical
engineering writes it $j$ rather than $i$ because $i$ is already the symbol for
current. Nothing else about the notation differs.

The useful way to read $j$ is not as a strange number but as an instruction:
multiplying by $j$ rotates a point 90 degrees counter-clockwise in the plane and
leaves its distance from the origin alone. Everything follows from that. Two
rotations of 90 degrees is a rotation of 180 degrees, which is a reversal of
sign, so $j^{2} = -1$ is a statement about geometry. Four rotations return you to
where you started, so the powers cycle with period four:

$$j^{1} = j, \\qquad j^{2} = -1, \\qquad j^{3} = -j, \\qquad j^{4} = 1$$

To evaluate any integer power, divide the exponent by four and keep the
remainder. And because $j\\cdot(-j) = -j^{2} = 1$, the reciprocal of $j$ is its
own negative:

$$\\frac{1}{j} = -j$$

That single identity converts the capacitive impedance $1/(j\\omega C)$ into
$-j/(\\omega C)$ without any algebra, and it is the fastest way to get the sign
of a capacitive reactance right under time pressure.

## 7.2 Multiplication scales and rotates, and does nothing else

For any two complex numbers written in polar form, the product has the product
of the magnitudes and the sum of the angles:

$$(r_{1}\\angle\\theta_{1})(r_{2}\\angle\\theta_{2}) = r_{1}r_{2}\\angle(\\theta_{1} + \\theta_{2})$$

The clearest demonstration is to multiply a number by itself repeatedly and
watch where it goes. Take $1 + j$, whose magnitude is $\\sqrt{2}$ and whose angle
is 45 degrees. Each multiplication should stretch by $\\sqrt{2}$ and turn by 45
degrees, and it does.

![Successive powers of 1 plus j plotted in the complex plane, each one further from the origin by a factor of the square root of two and rotated a further 45 degrees, tracing a spiral through the four quadrants.](/courses/fe-ee/figures/math2-cx-rotation-ladder.svg)

| Power | Rectangular | Magnitude | Angle |
|---|---|---|---|
| $(1+j)^{0}$ | $1$ | 1.000 | $0^\\circ$ |
| $(1+j)^{1}$ | $1 + j$ | 1.414 | $45^\\circ$ |
| $(1+j)^{2}$ | $j2$ | 2.000 | $90^\\circ$ |
| $(1+j)^{3}$ | $-2 + j2$ | 2.828 | $135^\\circ$ |
| $(1+j)^{4}$ | $-4$ | 4.000 | $180^\\circ$ |
| $(1+j)^{5}$ | $-4 - j4$ | 5.657 | $225^\\circ$ |
| $(1+j)^{6}$ | $-j8$ | 8.000 | $270^\\circ$ |

Read the second row against the third: squaring $1 + j$ gives a purely imaginary
result, because two 45 degree turns make 90. Read the fifth row: the fourth power
is a negative real number, because four 45 degree turns make 180. No arithmetic
is needed to know the quadrant of any power once you can count the rotations.

### Worked example 7.1 — The fourth power of one plus j, three ways

**By repeated squaring.** $(1+j)^{2} = 1 + 2j + j^{2} = 1 + 2j - 1 = j2$. Then
$(j2)^{2} = 4j^{2} = -4$.

**By De Moivre.** The magnitude raises to the fourth power and the angle
multiplies by four:

$$(\\sqrt{2}\\angle 45^\\circ)^{4} = (\\sqrt{2})^{4}\\angle 180^\\circ = 4\\angle 180^\\circ = -4$$

**By binomial expansion.** $(1+j)^{4} = 1 + 4j + 6j^{2} + 4j^{3} + j^{4} = 1 + 4j - 6 - 4j + 1 = -4$.

All three give $-4$, and the middle one is the only one that can be done in your
head. That is the argument for polar form in a single line.

### Worked example 7.2 — The j in an inductor's impedance

A current phasor $\\mathbf{I} = 5\\angle 20^\\circ\\ \\mathrm{A}$ flows through an
inductor whose reactance at the working frequency is $\\omega L = 12\\ \\Omega$, so
its impedance is $j12\\ \\Omega$, which in polar form is $12\\angle 90^\\circ$. The
voltage phasor is the product:

$$\\mathbf{V} = (12\\angle 90^\\circ)(5\\angle 20^\\circ) = 60\\angle 110^\\circ\\ \\mathrm{V}$$

The magnitude is scaled by 12 and the angle advanced by exactly 90 degrees. That
90 degree advance is the statement "voltage leads current in an inductor",
expressed as multiplication rather than as a memorised rule. Dividing by $j$
instead, as happens across a capacitor, retards the angle by 90 degrees, and the
current leads.`,
  examTip: 'Reduce any power of j by taking the exponent modulo 4. And commit 1/j = -j to memory: it turns the capacitive impedance 1/(j omega C) into -j/(omega C) instantly, which is where the negative sign of capacitive reactance comes from.',
  importantNote: 'Multiplying two complex numbers multiplies magnitudes and adds angles. Nothing else happens. If a rectangular multiplication produces an answer whose magnitude is not the product of the two input magnitudes, the expansion is wrong, and that check takes ten seconds.',
},
{
  id: 'cx-demoivre',
  title: '8. De Moivre, and Every Root Rather Than One',
  content: `## 8.1 Powers by De Moivre

Applying the multiplication rule to a number times itself $n$ times gives De
Moivre's theorem, which is the only practical way to take a high power of a
complex number:

$$z^{n} = r^{n}\\angle(n\\theta) = r^{n}\\left[\\cos(n\\theta) + j\\sin(n\\theta)\\right]$$

The magnitude is raised to the power and the angle is multiplied by it. A
binomial expansion of $(a + jb)^{6}$ has seven terms and four sign changes; the
polar route has two operations.

## 8.2 Roots: there are exactly n of them

Reversing the theorem gives the roots, and this is where candidates lose marks.
An $n$-th root asks for the numbers that raise to $z$, and there are $n$ of them,
not one. The reason is that the angle of $z$ is only defined up to whole turns:
theta and $\\theta + 360^\\circ$ are the same direction, but divided by $n$ they
are different directions. So

$$z^{1/n} = r^{1/n}\\angle\\frac{\\theta + 360^\\circ k}{n}, \\qquad k = 0, 1, 2, \\ldots, n-1$$

At $k = n$ the angle has advanced by a full turn and the roots repeat, which is
why the list stops at $n - 1$. All $n$ roots share the magnitude $r^{1/n}$, so
they lie on one circle, equally spaced by $360^\\circ/n$.

![Two sets of roots on concentric circles: the six sixth roots of one spaced 60 degrees apart on the unit circle, and the three cube roots of negative eight spaced 120 degrees apart on a circle of radius two.](/courses/fe-ee/figures/math2-cx-roots-unity.svg)

### Worked example 8.1 — The six sixth roots of one

Write the number whose roots are wanted in polar form: $1 = 1\\angle 0^\\circ$. Then
$r^{1/6} = 1$ and the angles are $360^\\circ k/6 = 60^\\circ k$:

$$1\\angle 0^\\circ,\\; 1\\angle 60^\\circ,\\; 1\\angle 120^\\circ,\\; 1\\angle 180^\\circ,\\; 1\\angle 240^\\circ,\\; 1\\angle 300^\\circ$$

In rectangular form the six are $1$, $0.5 + j0.866$, $-0.5 + j0.866$, $-1$,
$-0.5 - j0.866$ and $0.5 - j0.866$. Two are real, at 0 and 180 degrees, and the
other four form two conjugate pairs — which is the general rule for roots of a
real number: the non-real ones always arrive in conjugate pairs. Notice 0.866,
the same $\\sqrt{3}/2$ that appears at 30 and 60 degrees on the unit circle.

### Worked example 8.2 — The three cube roots of negative eight

The obvious root is $-2$, and a question asking for "the" cube root of $-8$ is
usually asking whether you know there are three. Write it in polar form:
$-8 = 8\\angle 180^\\circ$. The magnitude of each root is $8^{1/3} = 2$ and the
angles are $(180^\\circ + 360^\\circ k)/3$ for $k = 0, 1, 2$:

$$2\\angle 60^\\circ = 1 + j1.732, \\qquad 2\\angle 180^\\circ = -2, \\qquad 2\\angle 300^\\circ = 1 - j1.732$$

Verify the first by cubing it: magnitude $2^{3} = 8$, angle $3(60^\\circ) = 180^\\circ$,
which is $8\\angle 180^\\circ = -8$. The three roots sit 120 degrees apart on a
circle of radius 2, exactly as the figure shows. Taking the principal root alone
and stopping there is the designed error, and on a question asking "how many
distinct cube roots" the answer is always three.

### Worked example 8.3 — Fourth roots of a number not on an axis

Find all fourth roots of $16\\angle 80^\\circ$. The magnitude of each root is
$16^{1/4} = 2$, and the angles are $(80^\\circ + 360^\\circ k)/4$:

$$2\\angle 20^\\circ,\\qquad 2\\angle 110^\\circ,\\qquad 2\\angle 200^\\circ,\\qquad 2\\angle 290^\\circ$$

The spacing is $360^\\circ/4 = 90^\\circ$, so once the first root is found the rest
are free — add 90 degrees repeatedly. Check the last one by raising it to the
fourth power: $2^{4} = 16$ and $4(290^\\circ) = 1160^\\circ$, which reduces modulo
360 to $80^\\circ$. Correct.

### Worked example 8.4 — The square root of j

Since $j = 1\\angle 90^\\circ$, its square roots have magnitude 1 and angles
$(90^\\circ + 360^\\circ k)/2$, that is 45 degrees and 225 degrees:

$$\\sqrt{j} = \\pm(0.7071 + j0.7071)$$

Squaring the first: magnitude 1, angle 90 degrees, which is $j$. The appearance
of 0.7071 is not a coincidence — it is $\\cos 45^\\circ$, and it says that the
square root of a 90 degree rotation is a 45 degree rotation, which is exactly
what a rotation operator should do.`,
  examTip: 'When a question says "find the roots" of a complex number, count them before computing: an n-th root has n answers, equally spaced by 360/n degrees on a circle of radius r to the one over n. Reporting only the principal root is the most common single error in this topic.',
  importantNote: 'De Moivre works for powers and roots alike. For a power, multiply the angle by n. For a root, divide (theta + 360k) by n and let k run from 0 to n-1. The magnitudes follow the same exponent, so all n roots lie on one circle.',
},
{
  id: 'cx-impedance',
  title: '9. Impedance Is a Complex Number and Behaves Like One',
  content: `## 9.1 The three element impedances

Impedance is the complex ratio of voltage phasor to current phasor, and each
passive element contributes a different part of the plane:

$$Z_{R} = R, \\qquad Z_{L} = j\\omega L, \\qquad Z_{C} = \\frac{1}{j\\omega C} = -\\frac{j}{\\omega C}$$

Resistance is real and positive; inductive reactance is positive imaginary;
capacitive reactance is negative imaginary. A series combination adds, because
the same current passes through each element and the voltages sum:

$$Z = R + j\\left(\\omega L - \\frac{1}{\\omega C}\\right) = R + jX$$

The real part dissipates energy and the imaginary part stores and returns it.
The sign of $X$ says which store dominates: positive is net inductive with
current lagging, negative is net capacitive with current leading.

## 9.2 The whole frequency response of one branch

Take the branch used throughout this course: $R = 10\\ \\Omega$,
$L = 50\\ \\mathrm{mH}$, $C = 100\\ \\mu\\mathrm{F}$. Its impedance is a complex
function of frequency, and both parts of that complex number are worth seeing at
once.

![Two stacked panels sharing a frequency axis: the magnitude of a series RLC impedance falling to a minimum of ten ohms at resonance and rising either side, and the angle of the same impedance crossing zero at that same frequency, from negative below to positive above.](/courses/fe-ee/figures/math2-cx-rlc-impedance.svg)

| Frequency | $\\omega L$ | $1/(\\omega C)$ | $Z$ | Magnitude | Angle |
|---|---|---|---|---|---|
| 30 Hz | 9.42 Ω | 53.05 Ω | $10 - j43.63$ | 44.76 Ω | $-77.09^\\circ$ |
| 60 Hz | 18.85 Ω | 26.53 Ω | $10 - j7.68$ | 12.61 Ω | $-37.51^\\circ$ |
| 71.18 Hz | 22.36 Ω | 22.36 Ω | $10 + j0$ | 10.00 Ω | $0^\\circ$ |
| 120 Hz | 37.70 Ω | 13.26 Ω | $10 + j24.44$ | 26.40 Ω | $+67.74^\\circ$ |
| 300 Hz | 94.25 Ω | 5.31 Ω | $10 + j88.94$ | 89.50 Ω | $+83.59^\\circ$ |

The third row is resonance. The two reactances are equal in size and opposite in
sign, so they cancel and the branch looks purely resistive. The resonant
frequency comes from setting them equal:

$$\\omega L = \\frac{1}{\\omega C} \\quad \\Longrightarrow \\quad \\omega_{0} = \\frac{1}{\\sqrt{LC}} = 447.21\\ \\mathrm{rad/s}, \\qquad f_{0} = \\frac{\\omega_{0}}{2\\pi} = 71.18\\ \\mathrm{Hz}$$

Two more numbers describe how sharp that minimum is. The quality factor and the
bandwidth of a series branch are

$$Q = \\frac{\\omega_{0}L}{R} = \\frac{(447.21)(0.05)}{10} = 2.24, \\qquad \\mathrm{BW} = \\frac{R}{L} = 200\\ \\mathrm{rad/s} = 31.83\\ \\mathrm{Hz}$$

A $Q$ of 2.24 is a broad resonance, which is what the gentle bowl in the figure
shows. The same components appeared in the Algebra and Trigonometry chapter as a
characteristic equation with roots $-100 \\pm j435.89$; the damped ringing
frequency there and the resonant frequency here describe the same circuit, one
left to ring and one driven.

### Worked example 9.1 — The 60 Hz operating point

At 60 Hz, $\\omega = 2\\pi(60) = 377\\ \\mathrm{rad/s}$, so

$$\\omega L = 377(0.05) = 18.85\\ \\Omega, \\qquad \\frac{1}{\\omega C} = \\frac{1}{377 \\times 10^{-4}} = 26.53\\ \\Omega$$

$$Z = 10 + j(18.85 - 26.53) = 10 - j7.68\\ \\Omega$$

In polar form the magnitude is $\\sqrt{100 + 58.9} = 12.61\\ \\Omega$ and the angle
is $\\arctan(-7.68/10) = -37.51^\\circ$. The negative angle means capacitive, which
makes sense because 60 Hz is below the 71.18 Hz resonance and the capacitive
reactance still dominates. Stating that conclusion before computing is a useful
discipline: it turns the arithmetic into a confirmation rather than a leap.

### Worked example 9.2 — Current and power at that point

Apply 120 V rms at zero phase. Division in polar form divides magnitudes and
subtracts angles:

$$\\mathbf{I} = \\frac{120\\angle 0^\\circ}{12.61\\angle -37.51^\\circ} = 9.52\\angle +37.51^\\circ\\ \\mathrm{A}$$

The current leads the voltage, as a capacitive circuit requires. Real power is
consumed only by the resistance:

$$P = I^{2}R = (9.52)^{2}(10) = 906\\ \\mathrm{W}$$

and the same number comes from $P = VI\\cos\\theta = 120(9.52)(0.793) = 906\\ \\mathrm{W}$.
Two independent routes to one number is the check that matters here, because the
common error — using the impedance magnitude in place of the resistance in
$I^{2}R$ — gives 1143 W and looks entirely reasonable.

### Worked example 9.3 — What resonance is not

At $f_{0}$ the impedance is 10 Ω, not zero. The reactances cancel each other but
the resistance remains, so the current at resonance with 120 V applied would be
12 A, the largest value it takes at any frequency. Individual element voltages
at resonance can exceed the source voltage: the inductor drops
$I\\omega_{0}L = 12(22.36) = 268\\ \\mathrm{V}$ and the capacitor drops the same
268 V in antiphase, so they cancel in the loop while each individually exceeds
120 V. The ratio 268/120 is 2.24, which is $Q$ — that is what the quality factor
measures.`,
  examTip: 'Series resonance makes the impedance minimum and purely resistive, equal to R, not zero. Parallel resonance does the opposite: maximum impedance. Confusing the two is worth several marks across the circuits section, and the discriminating word in the question is series or parallel.',
  importantNote: 'Real power uses the RESISTANCE, not the impedance magnitude. P equals I squared R with the current magnitude, or V I cos(theta) with the phase angle. Substituting the magnitude of Z for R inflates the answer by a factor of the magnitude over R, which here is 1.26.',
},
{
  id: 'cx-conjugate-depth',
  title: '10. The Conjugate: Reflection, Division and Matching',
  content: `## 10.1 What conjugation does geometrically

The conjugate of $z = a + jb$ is $z^{*} = a - jb$: the same point reflected
across the real axis. In polar form that is the same magnitude with the angle
negated, $r\\angle\\theta$ becoming $r\\angle -\\theta$. Four properties do all the
work:

$$zz^{*} = a^{2} + b^{2} = \\lvert z \\rvert^{2}, \\qquad z + z^{*} = 2\\,\\mathrm{Re}(z)$$

$$z - z^{*} = j2\\,\\mathrm{Im}(z), \\qquad (z_{1}z_{2})^{*} = z_{1}^{*}z_{2}^{*}$$

The first is the one used constantly: a complex number times its conjugate is
real, positive, and equal to the square of the magnitude. That is what makes it
useful for clearing a complex denominator.

### Worked example 10.1 — Division by rationalising

Compute $(7 + j1)/(3 - j2)$. Multiply above and below by the conjugate of the
denominator, which is $3 + j2$:

$$\\frac{(7 + j1)(3 + j2)}{(3 - j2)(3 + j2)} = \\frac{21 + j14 + j3 + j^{2}2}{9 + 4} = \\frac{19 + j17}{13}$$

$$= 1.462 + j1.308$$

Check in polar form: $(7.071\\angle 8.13^\\circ)/(3.606\\angle -33.69^\\circ) = 1.961\\angle 41.82^\\circ$,
and the rectangular answer has magnitude $\\sqrt{2.137 + 1.710} = 1.961$ and angle
$\\arctan(1.308/1.462) = 41.82^\\circ$. They agree. The denominator became
$3^{2} + 2^{2} = 13$, purely real, because that is what $zz^{*}$ always gives.

## 10.2 The conjugate in complex power

Complex power is defined with a conjugate, and the reason is worth understanding
rather than memorising. Using rms phasors,

$$\\mathbf{S} = \\mathbf{V}\\mathbf{I}^{*} = P + jQ$$

Conjugating the current negates its angle, so the angle of $\\mathbf{S}$ is the
voltage angle minus the current angle — which is theta, the angle by which the
current lags. Without the conjugate the product would carry the sum of the
angles, a quantity that depends on the arbitrary choice of time origin and means
nothing.

### Worked example 10.2 — Complex power for the branch above

From the previous section, $\\mathbf{V} = 120\\angle 0^\\circ$ V and
$\\mathbf{I} = 9.52\\angle 37.51^\\circ$ A, both rms. Then

$$\\mathbf{S} = (120\\angle 0^\\circ)(9.52\\angle -37.51^\\circ) = 1142\\angle -37.51^\\circ\\ \\mathrm{VA}$$

$$\\mathbf{S} = 906 - j696\\ \\mathrm{VA}$$

So $P = 906\\ \\mathrm{W}$, matching the $I^{2}R$ result exactly, and
$Q = -696\\ \\mathrm{VAR}$. The negative reactive power is the signature of a
capacitive load, and it is the sign that a leading current produces. Omitting
the conjugate would give $1142\\angle +37.51^\\circ$ and report the load as
inductive — the right magnitude with the wrong physics.

## 10.3 Maximum power transfer wants the conjugate, not a copy

For a source of internal impedance $Z_{s} = R_{s} + jX_{s}$ driving a load
$Z_{L}$, the power delivered is maximised when

$$Z_{L} = Z_{s}^{*} = R_{s} - jX_{s}$$

The reactance is cancelled, not copied. With the reactances cancelling, the loop
is purely resistive with $2R_{s}$ in it, and the delivered power reaches

$$P_{\\max} = \\frac{V^{2}}{4R_{s}}$$

![Power delivered to a load plotted against load resistance for three cases: a conjugate reactance, no reactance, and a reactance of the same sign as the source, with the conjugate case peaking highest and earliest.](/courses/fe-ee/figures/math2-cx-conjugate-match.svg)

### Worked example 10.3 — What each wrong choice costs

A 10 V rms source has $Z_{s} = 5 + j5\\ \\Omega$. Three candidate loads:

**The conjugate, $Z_{L} = 5 - j5$.** The reactances cancel and

$$P = \\frac{V^{2}}{4R_{s}} = \\frac{100}{20} = 5.00\\ \\mathrm{W}$$

**A purely resistive load.** With $X_{L} = 0$ the best resistance is no longer
$R_{s}$ but the magnitude of the source impedance,
$\\sqrt{25 + 25} = 7.07\\ \\Omega$, and the power there is 4.14 W — seventeen
percent below the achievable maximum.

**A reactance of the same sign, $X_{L} = +5$.** Now the loop reactance is
$+10\\ \\Omega$ rather than zero. The best resistance becomes
$\\sqrt{R_{s}^{2} + (2X_{s})^{2}} = \\sqrt{25 + 100} = 11.18\\ \\Omega$, and the
power peaks at only 3.09 W, thirty-eight percent down.

| Load reactance | Best load resistance | Power delivered |
|---|---|---|
| $X_{L} = -5\\ \\Omega$ (conjugate) | 5.00 Ω | 5.00 W |
| $X_{L} = 0$ (resistive) | 7.07 Ω | 4.14 W |
| $X_{L} = +5\\ \\Omega$ (same sign) | 11.18 Ω | 3.09 W |

The ordering is the lesson. Getting the reactance sign right is worth more than
choosing the resistance well, and an answer choice offering $Z_{L} = Z_{s}$ is
there for the candidate who remembers the DC rule that the load should equal the
source resistance and does not notice that a reactance has appeared.`,
  examTip: 'For AC maximum power transfer, conjugate the source impedance: same resistance, opposite reactance. Then the maximum power is V squared over 4R with V the source rms voltage and R the source resistance, because the reactances have cancelled and only 2R remains in the loop.',
  importantNote: 'Complex power is V times the CONJUGATE of I. That conjugate is what makes the angle of S equal the angle between voltage and current, and it is what gives Q its sign: positive Q for a lagging (inductive) load, negative for a leading (capacitive) one.',
},
{
  id: 'cx-admittance',
  title: '11. Reciprocals, Admittance, and a Line That Becomes a Circle',
  content: `## 11.1 Admittance is not one over the resistance

Admittance is the reciprocal of impedance, and the trap is in the word
reciprocal. Rationalising it shows that both parts of the impedance appear in
both parts of the admittance:

$$Y = \\frac{1}{Z} = \\frac{1}{R + jX} = \\frac{R - jX}{R^{2} + X^{2}} = G + jB$$

$$G = \\frac{R}{R^{2} + X^{2}}, \\qquad B = \\frac{-X}{R^{2} + X^{2}}$$

So conductance is $1/R$ only when the reactance is zero. In every other case the
reactance reduces the conductance as well. And the susceptance carries the
opposite sign to the reactance, which is why an inductive branch — positive
reactance — has negative susceptance. Adding $1/R$ to $1/(jX)$ separately, as if
the two parts were independent, is the standard error and it does not even
produce the right units of answer for a mixed branch.

Admittance earns its keep in parallel circuits, where admittances add for the
same reason that impedances add in series:

$$Y_{\\mathrm{total}} = Y_{1} + Y_{2} + \\cdots$$

### Worked example 11.1 — Two branches in parallel, the short way

$Z_{1} = 6 + j8\\ \\Omega$ and $Z_{2} = 10\\angle -30^\\circ\\ \\Omega$ are in parallel.
Convert each to an admittance:

$$Y_{1} = \\frac{1}{6 + j8} = \\frac{6 - j8}{100} = 0.06 - j0.08\\ \\mathrm{S}$$

$$Y_{2} = \\frac{1}{10\\angle -30^\\circ} = 0.1\\angle +30^\\circ = 0.0866 + j0.05\\ \\mathrm{S}$$

Adding them is one line: $Y = 0.1466 - j0.03\\ \\mathrm{S}$, whose magnitude is
0.1496 S at $-11.57^\\circ$. Inverting once at the end gives

$$Z = \\frac{1}{0.1496\\angle -11.57^\\circ} = 6.68\\angle +11.57^\\circ\\ \\Omega$$

which agrees with the product-over-sum result computed earlier in this chapter.
For two branches the two methods are about equally quick; for three or more,
admittances win outright, because product-over-sum does not generalise and has
to be applied twice.

### Worked example 11.2 — A resistor and a capacitor in parallel

A 100 Ω resistor sits in parallel with a 20 µF capacitor at 60 Hz. The
capacitive susceptance is positive, being the negative of a negative reactance:

$$B = \\omega C = 377(20 \\times 10^{-6}) = 0.00754\\ \\mathrm{S}$$

$$Y = 0.01 + j0.00754 = 0.01252\\angle 37.02^\\circ\\ \\mathrm{S}$$

$$Z = \\frac{1}{Y} = 79.85\\angle -37.02^\\circ = 63.76 - j48.07\\ \\Omega$$

Note that the real part of the impedance is 63.76 Ω, not 100 Ω, even though the
only resistor in the circuit is 100 Ω. Resistance and conductance are reciprocal
only in the absence of reactance, and this example is the cheapest possible
demonstration of that.

## 11.2 Why the reciprocal turns a line into a circle

Something geometrically striking happens when a whole family of impedances is
inverted. Fix the resistance at 2 Ω and let the reactance run over every value.
In the impedance plane that is a vertical straight line. In the admittance plane
it is a circle: centre at $1/(2R)$ on the real axis, radius $1/(2R)$, passing
through the origin.

![The vertical line of constant two-ohm resistance mapped into the admittance plane, where it becomes a circle of radius one quarter siemens centred at one quarter siemens on the conductance axis, with several individual reactance values marked around it.](/courses/fe-ee/figures/math2-cx-inversion-circle.svg)

| Impedance | Admittance | Conductance | Susceptance |
|---|---|---|---|
| $2 + j0$ | $0.5 + j0$ | 0.500 S | 0.000 S |
| $2 - j2$ | $0.25 + j0.25$ | 0.250 S | +0.250 S |
| $2 + j2$ | $0.25 - j0.25$ | 0.250 S | −0.250 S |
| $2 - j6$ | $0.05 + j0.15$ | 0.050 S | +0.150 S |
| $2 + j6$ | $0.05 - j0.15$ | 0.050 S | −0.150 S |

Every one of those admittances is exactly 0.25 S away from the point 0.25 S on
the real axis, which is the definition of that circle. The largest conductance,
0.5 S, occurs when the reactance is zero; adding reactance of either sign drives
the point around the circle towards the origin, meaning the branch admits less
current. This mapping is why the Smith chart is drawn as a family of circles: it
is the constant-resistance and constant-reactance lines of the impedance plane,
inverted.`,
  examTip: 'Conductance equals one over resistance only when the reactance is zero. For anything else use G = R over (R squared plus X squared). Writing Y as 1/R + 1/(jX) is a genuinely wrong formula, not merely a slow one.',
  importantNote: 'Susceptance carries the opposite sign to reactance. An inductive branch, with positive X, has negative B; a capacitive branch, with negative X, has positive B. Losing that sign flips a lagging load into a leading one.',
},
{
  id: 'cx-phasor-bridge',
  title: '12. Phasors: What Is Discarded and What Comes Back',
  content: `## 12.1 The transform, and the three conditions on it

A phasor is a complex number that carries the amplitude and the phase of a
sinusoid, and discards the time dependence:

$$v(t) = V_{m}\\cos(\\omega t + \\phi) \\;\\longleftrightarrow\\; \\mathbf{V} = V_{m}\\angle\\phi$$

The justification is Euler. Write the sinusoid as the real part of a rotating
exponential, $v(t) = \\mathrm{Re}[V_{m}e^{j\\phi}e^{j\\omega t}]$. Every voltage and
current in a linear circuit driven at one frequency carries the identical factor
$e^{j\\omega t}$, so it can be divided out of every equation and restored at the
end. What remains, $V_{m}e^{j\\phi}$, is the phasor.

Three conditions come with that argument, and each is a question on this exam.
The circuit must be **linear**, because superposition is what allows the common
factor to be cancelled. The excitation must be at a **single frequency**, since
two different values of omega give two different rotating factors and neither
cancels. And the response must be in **steady state**, because the transient
part is not sinusoidal at all.

Within those conditions, calculus becomes arithmetic. Differentiating the
rotating exponential brings down a factor of $j\\omega$, and integrating divides
by it:

$$\\frac{d}{dt} \\;\\longleftrightarrow\\; j\\omega, \\qquad \\int dt \\;\\longleftrightarrow\\; \\frac{1}{j\\omega}$$

That single substitution is the entire reason the impedances of the previous
sections have the form they do: $v = L\\,di/dt$ becomes
$\\mathbf{V} = j\\omega L\\mathbf{I}$, and $i = C\\,dv/dt$ becomes
$\\mathbf{I} = j\\omega C\\mathbf{V}$.

### Worked example 12.1 — Adding two sinusoids without any trigonometry

Add $v_{1}(t) = 100\\cos\\omega t$ and $v_{2}(t) = 60\\cos(\\omega t + 60^\\circ)$.
In the phasor domain the second converts to rectangular form and the two add
component by component:

$$\\mathbf{V} = 100\\angle 0^\\circ + 60\\angle 60^\\circ = 100 + (30 + j51.96) = 130 + j51.96$$

$$\\lvert \\mathbf{V} \\rvert = \\sqrt{16900 + 2700} = \\sqrt{19600} = 140.0\\ \\mathrm{V}, \\qquad \\angle \\mathbf{V} = 21.79^\\circ$$

so $v_{1} + v_{2} = 140\\cos(\\omega t + 21.79^\\circ)$.

![Two sinusoids of the same frequency drawn against wt in degrees together with their point-by-point sum, which is a third sinusoid of amplitude 140 volts peaking 21.79 degrees earlier than the reference.](/courses/fe-ee/figures/math2-cx-phasor-sum-time.svg)

The figure adds the same two waveforms sample by sample and gets a curve
identical to the one the phasor arithmetic predicts. Check it by hand at one
instant: at $\\omega t = 0$ the two waveforms give
$100 + 60\\cos 60^\\circ = 130\\ \\mathrm{V}$, and the phasor result gives
$140\\cos(21.79^\\circ) = 130\\ \\mathrm{V}$. The peak is 140 V, not 160 V, because
the two components never peak at the same instant.

### Worked example 12.2 — The derivative rule in use

A current $i(t) = 2\\cos(377t - 30^\\circ)\\ \\mathrm{A}$ flows through a 20 mH
inductor. In the phasor domain the voltage is the current times $j\\omega L$:

$$\\omega L = 377(0.020) = 7.54\\ \\Omega$$

$$\\mathbf{V} = (7.54\\angle 90^\\circ)(2\\angle -30^\\circ) = 15.08\\angle 60^\\circ\\ \\mathrm{V}$$

so $v(t) = 15.08\\cos(377t + 60^\\circ)\\ \\mathrm{V}$. Doing it in the time domain
means differentiating $2\\cos(377t - 30^\\circ)$, getting
$-754\\sin(377t - 30^\\circ)$, multiplying by 0.020, and then converting a negative
sine into a cosine with a phase shift — three chances to lose a sign where the
phasor route has none.

### Worked example 12.3 — Kirchhoff's voltage law with phasors

Two series elements drop $50\\angle 0^\\circ$ V and $30\\angle 90^\\circ$ V. The
source voltage is their phasor sum, not their arithmetic sum:

$$\\mathbf{V}_{s} = 50 + j30 = 58.31\\angle 30.96^\\circ\\ \\mathrm{V}$$

A voltmeter across the pair reads 58.3 V while voltmeters across the individual
elements read 50 V and 30 V. There is nothing paradoxical in that: the two drops
peak at different instants. Reporting 80 V is the classic carry-over from DC,
and it is why every AC loop equation must be done in complex arithmetic rather
than with magnitudes.

## 12.2 What the phasor threw away, and when you need it back

The phasor discarded the factor $e^{j\\omega t}$, which means it has no
information about the frequency itself and none about any transient. Two
consequences follow on this exam. A circuit driven by a fundamental and a
harmonic must be solved once per frequency and the time-domain results added,
because the two phasor domains are separate. And a switching transient — the
response the previous chapter's characteristic roots describe — is invisible to
phasor analysis entirely; that problem belongs to differential equations or to
the Laplace transform, where the exponential factor is kept rather than
cancelled.`,
  examTip: 'Phasors need three things: linearity, one frequency, and steady state. If a problem has two source frequencies, solve it once at each frequency and add the time-domain answers; the phasors themselves cannot be added because they rotate at different rates.',
  importantNote: 'Voltmeter readings around an AC loop do not add arithmetically. Fifty volts and thirty volts in series can read anything from 20 V to 80 V depending on phase, and equal 58.3 V when the two are 90 degrees apart. Only the phasor sum obeys Kirchhoff.',
},
{
  id: 'cx-set-b',
  title: '13. Problem Set: Forms, Powers and Roots',
  content: `Work each one before reading the answer. Every question here is
answerable in about three minutes with the handbook and a calculator.

## Problem Set C

1. Add $(4 + j7)$ and $(9 - j3)$, and give the result in both forms.
2. Evaluate $(5\\angle 25^\\circ)(4\\angle -70^\\circ)$ in polar and rectangular form.
3. Evaluate $(2 + j2)^{6}$.
4. Find all cube roots of $27\\angle 90^\\circ$.
5. Evaluate $(10 - j5)/(2 + j6)$.
6. Evaluate $j^{27}$ and $j^{100}$.

### Worked answers to Problem Set C

**1.** Addition is component by component:
$(4 + 9) + j(7 - 3) = 13 + j4$. Converting,

$$\\lvert z \\rvert = \\sqrt{169 + 16} = 13.60, \\qquad \\theta = \\arctan\\frac{4}{13} = 17.10^\\circ$$

The trap is adding the magnitudes of the two inputs, 8.06 and 9.49, to get
17.55 — close enough to the correct 13.60 to be uncomfortable, and wrong.
Magnitudes only add when the two numbers have the same angle.

**2.** Magnitudes multiply and angles add:

$$(5)(4)\\angle(25^\\circ - 70^\\circ) = 20\\angle -45^\\circ = 14.14 - j14.14$$

Subtracting the magnitudes or multiplying the angles both produce offered
answers. Note that $20\\angle -45^\\circ$ has equal and opposite real and imaginary
parts, which is a useful sanity check on the rectangular conversion.

**3.** Convert before raising: $2 + j2$ has magnitude $\\sqrt{8} = 2.828$ and
angle 45 degrees. By De Moivre,

$$(2.828\\angle 45^\\circ)^{6} = 2.828^{6}\\angle 270^\\circ = 512\\angle 270^\\circ = -j512$$

The angle $6(45^\\circ) = 270^\\circ$ places the answer on the negative imaginary
axis. Expanding the binomial gives the same thing after seven terms. The trap is
$2^{6} + (j2)^{6} = 64 - 64 = 0$, which treats a power of a sum as a sum of
powers.

**4.** Three roots, magnitude $27^{1/3} = 3$, angles $(90^\\circ + 360^\\circ k)/3$:

$$3\\angle 30^\\circ = 2.598 + j1.5, \\qquad 3\\angle 150^\\circ = -2.598 + j1.5, \\qquad 3\\angle 270^\\circ = -j3$$

They are 120 degrees apart on a circle of radius 3. Reporting only
$3\\angle 30^\\circ$ takes the principal root and misses two of the three cube
roots, which is the single most common error on root questions and is always
one of the choices.

**5.** In polar form, the numerator is $11.18\\angle -26.57^\\circ$ and the
denominator is $6.325\\angle 71.57^\\circ$, so

$$\\frac{11.18\\angle -26.57^\\circ}{6.325\\angle 71.57^\\circ} = 1.768\\angle -98.13^\\circ = -0.25 - j1.75$$

Confirm rectangularly by multiplying top and bottom by $2 - j6$:
$(10 - j5)(2 - j6) = 20 - j60 - j10 - 30 = -10 - j70$, over $4 + 36 = 40$, giving
$-0.25 - j1.75$. Multiplying by the denominator itself rather than its conjugate
leaves the denominator complex and is the standard failure here.

**6.** Reduce the exponent modulo four. Since $27 = 4(6) + 3$ and
$j^{3} = -j$:

$$j^{27} = -j, \\qquad j^{100} = j^{0} = 1$$

because 100 is divisible by four. Answering $j^{27} = j$ takes the remainder of
27 divided by 4 as 1 rather than 3, and that off-by-two error rotates the answer
by 180 degrees.`,
},
{
  id: 'cx-set-c',
  title: '14. Problem Set: Impedance, Admittance and Power',
  content: `The second set is the circuits half of this chapter. Again, solve
before reading.

## Problem Set D

1. A 25 Ω resistor is in series with a 0.1 H inductor at 60 Hz. Find the
   impedance in both forms.
2. That branch is driven by 208 V rms at zero phase. Find the current and the
   real power.
3. Find the admittance of $4 + j3\\ \\Omega$.
4. A 20 V rms source has an internal impedance of $8 - j6\\ \\Omega$. Give the
   load for maximum power and the power delivered, and say what a load equal to
   the source impedance would deliver instead.
5. For $v(t) = 170\\cos(\\omega t - 40^\\circ)$ V and
   $i(t) = 8.5\\cos(\\omega t + 15^\\circ)$ A, find the complex power and classify
   the load.
6. For the series branch with $R = 10\\ \\Omega$, $L = 50\\ \\mathrm{mH}$ and
   $C = 100\\ \\mu\\mathrm{F}$, state the frequency at which the impedance is
   purely real and its magnitude there.

### Worked answers to Problem Set D

**1.** The reactance is $\\omega L = 2\\pi(60)(0.1) = 37.70\\ \\Omega$, so

$$Z = 25 + j37.70 = 45.24\\angle 56.45^\\circ\\ \\Omega$$

The positive angle says inductive, current lagging. A frequent slip is using
$2\\pi f L$ with $f$ in radians per second, which multiplies the reactance by
another $2\\pi$ and gives 236.9 Ω.

**2.** Division in polar form:

$$\\mathbf{I} = \\frac{208\\angle 0^\\circ}{45.24\\angle 56.45^\\circ} = 4.598\\angle -56.45^\\circ\\ \\mathrm{A}$$

$$P = I^{2}R = (4.598)^{2}(25) = 528.6\\ \\mathrm{W}$$

Cross-check with $P = VI\\cos\\theta = (208)(4.598)(0.5527) = 528.6\\ \\mathrm{W}$.
Using the impedance magnitude in place of the resistance gives 956 W, which is
the apparent power in disguise and is always offered.

**3.** Rationalise:

$$Y = \\frac{1}{4 + j3} = \\frac{4 - j3}{16 + 9} = 0.16 - j0.12\\ \\mathrm{S}$$

The magnitude is 0.2 S, which is $1/5$, and 5 Ω is the magnitude of the
impedance — a fast check. The trap answer is $1/4 - j/3$, obtained by inverting
the two parts separately, which is not a valid operation on a complex number.

**4.** Maximum power needs the conjugate, $Z_{L} = 8 + j6\\ \\Omega$. Then

$$P_{\\max} = \\frac{V^{2}}{4R_{s}} = \\frac{400}{32} = 12.5\\ \\mathrm{W}$$

A load equal to the source impedance, $8 - j6$, makes the loop impedance
$16 - j12$ with magnitude squared $256 + 144 = 400$, so

$$P = \\frac{V^{2}R_{L}}{\\lvert Z_{\\mathrm{loop}} \\rvert^{2}} = \\frac{(400)(8)}{400} = 8.0\\ \\mathrm{W}$$

Copying the source impedance instead of conjugating it costs 36% of the
available power, and it is the offered answer for anyone applying the DC
matching rule.

**5.** These are peak values, so the one-half factor is required. The complex
power is half the voltage phasor times the conjugate of the current phasor:

$$\\mathbf{S} = \\tfrac{1}{2}(170\\angle -40^\\circ)(8.5\\angle -15^\\circ) = 722.5\\angle -55^\\circ\\ \\mathrm{VA}$$

$$\\mathbf{S} = 414.4 - j591.8\\ \\mathrm{VA}$$

So $P = 414\\ \\mathrm{W}$ and $Q = -592\\ \\mathrm{VAR}$. The current leads the
voltage by 55 degrees, and the negative reactive power confirms a capacitive
load. Omitting the one-half factor doubles everything to 1445 VA, and forgetting
the conjugate gives an angle of $-25^\\circ$, which reports the load as inductive.

**6.** The impedance is purely real at series resonance, where the two
reactances cancel:

$$f_{0} = \\frac{1}{2\\pi\\sqrt{LC}} = \\frac{1}{2\\pi\\sqrt{(0.05)(10^{-4})}} = 71.18\\ \\mathrm{Hz}$$

At that frequency the reactances are each 22.36 Ω and cancel exactly, leaving
$Z = 10\\ \\Omega$, the resistance alone. Answering zero ohms is the trap: series
resonance minimises the impedance, but the floor is $R$, not zero, and a circuit
with any resistance in it never reaches zero impedance at any frequency.`,
},
],
  keyTakeaways: [
    'Euler formula e^(jθ) = cosθ + j·sinθ connects exponential, rectangular, and polar forms.',
    'Magnitude |z| = sqrt(a² + b²); angle θ = arctan(b/a) with quadrant correction.',
    'Use rectangular for addition/subtraction; polar for multiplication/division.',
    'Conjugate multiplication rationalizes denominators: z·z* = |z|².',
    'Phasor V = Vm∠φ represents v(t) = Vm·cos(ωt+φ); eliminates time variable for AC analysis.',
  ],
},

fee_discrete_math: {
  topicId: 'fee_discrete_math',
  title: 'Discrete Mathematics',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Discrete mathematics covers countable structures — sets, combinatorics, logic, and graph theory. These concepts underpin digital systems design, probability calculations, and algorithm analysis on the FE exam.',
  sections: [
    {
      id: 'dm-sets-combinatorics',
      title: '1. Sets, Combinatorics, and Counting',
      content: `## 1.1 Set Operations

A **set** is a collection of distinct objects. Operations:

| Operation | Symbol | Meaning |
|---|---|---|
| Union | $A \\cup B$ | Elements in A or B (or both) |
| Intersection | $A \\cap B$ | Elements in both A and B |
| Complement | A' | Elements NOT in A |
| Difference | A - B | Elements in A but not B |

**De Morgan's Laws** for sets mirror Boolean algebra:
- **$(A \\cup B)' = A' \\cap B'$**
- **$(A \\cap B)' = A' \\cup B'$**

## 1.2 Counting: Permutations and Combinations

- **Permutations** (order matters): P(n,r) = n! / (n-r)!
- **Combinations** (order does not matter): C(n,r) = n! / [r!(n-r)!]

### The Binomial Theorem

**$(a + b)^n = \\sum_{k=0}^{n} C(n,k) \\cdot a^{n-k} \\cdot b^k$**

This is used in probability (binomial distribution) and series expansion.`,
      examTip: 'Permutations vs. combinations is a common FE question. Ask: "Does order matter?" If selecting a committee (no order), use C(n,r). If arranging items in sequence (order matters), use P(n,r). The binomial coefficient C(n,k) also appears in the binomial probability distribution.',
    },
    {
      id: 'dm-logic-graphs',
      title: '2. Propositional Logic and Graph Theory',
      content: `## 2.1 Propositional Logic

Logic operations map directly to digital circuits:

| Operation | Symbol | Circuit Gate | Truth |
|---|---|---|---|
| AND | $p \\wedge q$ | AND gate | True only if both true |
| OR | $p \\vee q$ | OR gate | True if either true |
| NOT | $\\neg p$ | Inverter | Flips truth value |
| Implication | $p \\to q$ | — | False only if p true and q false |
| Biconditional | $p \\leftrightarrow q$ | XNOR | True if both same |

**De Morgan's Laws** for logic:
- **$\\neg (p \\wedge q) \\equiv \\neg p \\vee \\neg q$**
- **$\\neg (p \\vee q) \\equiv \\neg p \\wedge \\neg q$**

**Contrapositive**: p → q is logically equivalent to ¬q → ¬p (always valid reasoning).

## 2.2 Graph Theory Basics

A **graph** consists of vertices (nodes) connected by edges. Key properties:
- **Degree** of a vertex: number of incident edges
- **Euler's formula** for planar graphs: **$V - E + F = 2$** (vertices - edges + faces)
- **Complete graph** K_n has n(n-1)/2 edges
- A **tree** with n vertices has exactly n-1 edges

Graph theory models networks — useful for analyzing circuit topologies and computer networks.`,
      examTip: 'De Morgan laws appear in both set theory and Boolean algebra on the FE exam. The pattern is identical: swap the operator (AND/OR or union/intersection) and complement everything. Memorize one form and you know both.',
      importantNote: 'The contrapositive (p→q equivalent to ¬q→¬p) is logically valid, but the converse (q→p) and inverse (¬p→¬q) are NOT equivalent to the original. This distinction appears in logic-based FE questions.',
    },
    {
      id: 'dm-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Counting for reliability and logic

**Permutations** (order matters): $P(n,r) = n!/(n-r)!$. Arranging 3 of 8 components in a fixed sequence: $8!/5! = 8 \\times 7 \\times 6 = 336$.

**Combinations** (order does not): $C(n,r) = n!/[r!(n-r)!]$. Choosing 3 of 8 spares regardless of order: $336/6 = 56$.

The test for which to use: swap two of your chosen items. If that counts as a different outcome, it is a permutation.

## 3.2 Boolean algebra and De Morgan

The identities that actually reduce circuits:

- **$\\overline{A \\cdot B} = \\overline{A} + \\overline{B}$**
- **$\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$**
- Absorption: A + AB = A, and A(A + B) = A
- Consensus: AB + A'C + BC = AB + A'C (the BC term is redundant)

Simplify F = AB + AB' + A'B:

AB + AB' = A(B + B') = A. So F = A + A'B. By the **redundancy law**, A + A'B = A + B. So **$F = A + B$**, a two-input OR from what looked like three product terms. (The dual of absorption is A(A + B) = A, which is a different identity.)

## 3.3 Set relations

|A union B| = |A| + |B| - |A intersect B| (inclusion-exclusion).

Of 50 engineers, 30 know VHDL, 25 know Verilog, and 12 know both. How many know at least one? 30 + 25 - 12 = **43**, so 7 know neither.

## 3.4 Graphs, briefly

A graph with V vertices and E edges is a **tree** when it is connected and E = V - 1, which is exactly the condition circuit theory uses: a tree of a network with V nodes has V - 1 branches, and the remaining B - (V - 1) links define the independent loops for mesh analysis.

For a network with 6 nodes and 9 branches: tree branches = 5, links = 4, so there are **4 independent mesh equations** and 5 independent node equations. That is why you choose mesh analysis here - fewer unknowns.`,
      examTip: 'The number of independent KVL equations equals branches minus nodes plus one; the number of independent KCL equations equals nodes minus one. Count both before choosing mesh or nodal analysis - picking the smaller system can halve the work.',
      quiz: [
        {
          question: 'How many distinct 3-component subsets can be chosen from a stock of 7 components?',
          options: ['35', '210', '21', '343'],
          correctIndex: 0,
          explanation: 'A subset is unordered, so use combinations: C(7,3) = 7!/(3!4!) = 35. The 210 figure is P(7,3), the permutation count, which would be right only if the order of selection mattered.',
        },
        {
          question: 'Simplify the Boolean expression AB + AB(prime).',
          options: ['A', 'B', 'A + B', 'AB'],
          correctIndex: 0,
          explanation: 'Factor A: AB + AB′ = A(B + B′) = A(1) = A. The value of B becomes irrelevant, which is the whole point of the simplification - the gate reduces to a wire from A.',
        },
        {
          question: 'A network has 8 nodes and 12 branches. How many independent mesh (KVL) equations are needed?',
          options: ['5', '7', '8', '12'],
          correctIndex: 0,
          explanation: 'Independent loops = B - N + 1 = 12 - 8 + 1 = 5. Nodal analysis would need N - 1 = 7 equations here, so mesh analysis is the smaller system and the faster route.',
        },
      ],
    },
  {
    id: 'dm-depth',
    title: '4. Counting Without Guessing',
    content: `## 4.1 Four questions that pick the formula
  
  Counting problems are easy to get wrong by picking a formula that feels right.
  Two yes/no questions settle it every time: **does order matter**, and **may
  items repeat**.
  
  | Order matters? | Repetition? | Formula | Count for n=5, k=2 |
  |---|---|---|---|
  | yes | yes | $n^k$ | 25 |
  | yes | no | $P(n,k) = n!/(n-k)!$ | 20 |
  | no | no | $C(n,k) = n!/(k!(n-k)!)$ | 10 |
  | no | yes | $C(n+k-1, k)$ | 15 |
  
  Read the four counts for the same n and k: they differ by more than a factor of
  two across the table, so the formula choice matters more than the arithmetic.
  
  The relationship between the middle two is worth holding: **$P(n,k) = C(n,k)\\cdot k!$**
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
  digital-systems flavoured question: an 8-bit word has $2^{8}$ = 256 possible values,
  and the number of those with exactly three bits set is C(8,3) = **56**.
  
  ## 4.3 Worked: the same set of items, four questions
  
  Eight components are on a bench, all distinguishable.
  
  **Choose 3 for a test fixture, order irrelevant.**
  $$C(8,3) = (8\\cdot 7\\cdot 6)/(3\\cdot 2\\cdot 1) = 336/6 = 56$$.
  
  **Arrange 3 of them in a row, order matters.**
  $$P(8,3) = 8\\cdot 7\\cdot 6 = 336$$.
  
  **Assign 3 labelled roles, reuse allowed.**
  $$8^{3} = 512$$.
  
  **How many subsets of any size?**
  $$2^{8} = 256$$.
  
  Notice 512 > 336: allowing repetition adds more possibilities than requiring
  distinct items removes. And note 256 < 336, which is a useful sanity check on
  intuition — "all subsets" sounds larger than "ordered triples" but is not.
  
  ## 4.4 Set identities, and the inclusion-exclusion trap
  
  For two sets, **$|A \\cup B| = |A| + |B| - |A \\cap B|$**. The subtraction is there
  because elements in both were counted twice. In a survey-style question — 60
  students take circuits, 45 take electronics, 20 take both — the number taking at
  least one is 60 + 45 − 20 = **85**, not 105.
  
  De Morgan's laws connect this to digital logic directly, and appear on the exam
  in both notations:
  
  | Set form | Boolean form | Plain statement |
  |---|---|---|
  | $(A \\cup B)' = A' \\cap B'$ | $(A + B)' = A'\\cdot B'$ | NOR is AND of the complements |
  | $(A \\cap B)' = A' \\cup B'$ | $(A\\cdot B)' = A' + B'$ | NAND is OR of the complements |
  
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
  may have blown for another reason. The exam tests exactly that distinction.`,
    examTip: 'Ask two questions before writing any counting formula: does order matter, and can items repeat. The four answers give four different formulas, and for n=5, k=2 they give 25, 20, 15 and 10 - so choosing wrongly is not a small error.',
    importantNote: 'P(n,k) = C(n,k) x k!. If you can only remember one, remember the combination formula and multiply by k! when order matters. Checking that P is larger than C by exactly k! catches an inverted formula instantly.',
  },
{
  id: 'dm-set',
  title: '5. Problem Set: Counting and Logic',
  content: `## 5.1 Codes with a constraint

How many 4-digit PINs use digits 0-9 with no repeats?

Order matters and repetition is barred, so this is a permutation:
$$P(10,4) = 10 \\times 9 \\times 8 \\times 7 = 5040$$.

With repeats allowed it would be $10^{4}$ = 10 000. The constraint removes almost
half the space, which is the practical point of the distinction.

## 5.2 Committee selection

From 12 engineers, choose a team of 4 with no roles assigned.

$$C(12,4) = (12 \\times 11 \\times 10 \\times 9)/(4 \\times 3 \\times 2 \\times 1) = 11880/24 = 495$$

If instead the four roles are distinct — lead, reviewer, tester, scribe — then
order matters and the count is P(12,4) = 11880. The ratio is 4! = 24, exactly as
P = C × k! requires.

## 5.3 Parity and error detection

A byte is transmitted under an even-parity scheme. How many of the 8-bit
patterns have even parity, that is an even number of ones?

Even counts of ones are 0, 2, 4, 6, 8:
$$C(8,0) + C(8,2) + C(8,4) + C(8,6) + C(8,8) = 1 + 28 + 70 + 28 + 1 = 128$$

That is exactly half of $2^{8}$ = 256, and it is half for every n ≥ 1 — which is why
a single parity bit detects any odd number of bit errors and misses every even
number of them.

## 5.4 Inclusion-exclusion with two sets

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
offered.`,
},
{
  id: 'dm-errors',
  title: '6. Where Marks Are Lost',
  content: `## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Using C when order matters | 56 instead of 336 for arranging 3 of 8 | ask "would a different order be a different answer?" |
| Forgetting the overlap | 105 instead of 85 for a union | subtract the intersection once |
| Confusing converse with contrapositive | "the fuse blew, so it was shorted" | only "not Q implies not P" is equivalent |
| Counting repetition wrongly | using n! where nᵏ applies | decide independently whether repetition is allowed |

The permutation and combination check is free: **P(n,k) must exceed C(n,k) by
a factor of exactly k!**. If your two answers do not stand in that ratio, one of
them uses the wrong formula, and you know it before looking at the choices.

When a counting problem resists all four formulas, it is usually two problems
multiplied together: choose the group, then arrange within it. Splitting it in
two and multiplying the counts is legitimate and is often faster than hunting
for a single formula that covers the whole thing at once.`,
},
{
  id: 'dm-set-algebra',
  title: '7. The Algebra of Sets, Proved Rather Than Recited',
  content: `## 7.1 A set is a membership test and nothing else

A set is a rule that answers exactly one question about every object under
discussion: in, or out. That is the whole definition, and it is worth taking
literally, because it turns every claim about sets into a claim about that
yes-or-no answer. Two sets are equal precisely when they return the same answer
for every object, so proving $A = B$ means proving the two membership tests agree
on every candidate — never rearranging symbols because the rearrangement looks
like ordinary algebra.

The vocabulary an exam question can lean on is short:

| Term | Notation | Membership test for $x$ |
|---|---|---|
| element of | $x \\in A$ | the test for $A$ answers yes |
| subset | $A \\subseteq B$ | every yes for $A$ is a yes for $B$ |
| proper subset | $A \\subset B$ | subset, and $B$ has at least one member $A$ lacks |
| empty set | $\\varnothing$ | the test always answers no |
| universe | $U$ | the test always answers yes |
| complement | $A'$ or $\\overline{A}$ | the test for $A$ answers no |

The empty set is a subset of every set, including itself, which sounds like a
technicality until a counting question asks for the number of subsets and you
have to remember to include it. A set with $n$ members has $2^{n}$ subsets, and
the argument is a counting argument: build a subset by walking the members and
deciding in or out for each, which is $n$ independent binary choices.

$$\\lvert \\mathcal{P}(S) \\rvert = 2^{n} \\quad \\text{for} \\quad \\lvert S \\rvert = n$$

Listing every subset of a set of size $n$ and counting them reproduces $2^{n}$
for $n = 0$ through $12$; at $n = 12$ both routes give 4096. The formula was not
assumed anywhere in that check.

## 7.2 The four operations, and the one that is not symmetric

$$A \\cup B = \\{\\, x : x \\in A \\ \\text{or}\\ x \\in B \\,\\}, \\qquad A \\cap B = \\{\\, x : x \\in A \\ \\text{and}\\ x \\in B \\,\\}$$

$$A \\setminus B = \\{\\, x : x \\in A \\ \\text{and}\\ x \\notin B \\,\\}, \\qquad A \\oplus B = (A \\setminus B) \\cup (B \\setminus A)$$

Union and intersection are commutative and associative; set difference is
neither. $A \\setminus B$ and $B \\setminus A$ are different sets, and the
symmetric difference $A \\oplus B$ is exactly what you get by taking both. That
last operation is the set-theory face of the exclusive-OR gate, and the two obey
the same laws for the same reason.

Two identities let you reduce almost any expression:

$$A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$$
$$A \\cup (B \\cap C) = (A \\cup B) \\cap (A \\cup C)$$

Distribution runs both ways here, which is the first place set algebra parts
company with ordinary arithmetic, where addition does not distribute over
multiplication. Boolean algebra shares this two-way distribution, and for the
same structural reason.

## 7.3 De Morgan, proved by chasing an element

The two De Morgan laws are the identities the FE exam reaches for most often,
in set notation in the mathematics questions and in gate notation in the digital
ones. They deserve a proof rather than a mnemonic, and the proof is three lines
of membership testing.

Take any object $x$ and ask whether it belongs to $(A \\cup B)'$:

$$x \\in (A \\cup B)' \\iff \\lnot\\,(x \\in A \\cup B) \\iff \\lnot\\,(x \\in A \\ \\text{or}\\ x \\in B)$$

The negation of a disjunction is the conjunction of the negations — that is a
fact about the two-valued logic underneath, and it is where the whole result
comes from:

$$\\lnot\\,(x \\in A \\ \\text{or}\\ x \\in B) \\iff (x \\notin A) \\ \\text{and}\\ (x \\notin B) \\iff x \\in A' \\cap B'$$

Every step is an equivalence, so the chain runs in both directions, and the two
sets have identical membership tests. Therefore

$$(A \\cup B)' = A' \\cap B' \\qquad \\text{and, by the same argument,} \\qquad (A \\cap B)' = A' \\cup B'$$

That is a proof, not a demonstration on an example, so it holds for every pair
of sets. It can also be confirmed the blunt way: over a four-element universe
there are 16 possible subsets, hence 256 ordered pairs $(A, B)$, and both
identities hold for all 256 of them.

## 7.4 Worked example: a fault survey read as one set expression

Two hundred assembled boards go through three tests. Ninety fail the thermal
test $A$, seventy fail the electrical test $B$, fifty fail the vibration test
$C$. Thirty fail both $A$ and $B$, twenty-five fail both $A$ and $C$, twenty
fail both $B$ and $C$, and ten fail all three. How many boards pass every test?

The question asks for $\\lvert (A \\cup B \\cup C)' \\rvert$, which by De Morgan
is $\\lvert A' \\cap B' \\cap C' \\rvert$ — the boards that fail nothing. Get the
union first:

$$\\lvert A \\cup B \\cup C \\rvert = 90 + 70 + 50 - 30 - 25 - 20 + 10 = 145$$

$$\\lvert (A \\cup B \\cup C)' \\rvert = 200 - 145 = 55$$

Fifty-five boards pass all three tests. The answer is worth checking region by
region rather than trusting the formula, because the seven disjoint pieces must
all come out non-negative or the data was inconsistent:

| Region | Count |
|---|---|
| thermal only | $90 - 30 - 25 + 10 = 45$ |
| electrical only | $70 - 30 - 20 + 10 = 30$ |
| vibration only | $50 - 25 - 20 + 10 = 15$ |
| thermal and electrical, not vibration | $30 - 10 = 20$ |
| thermal and vibration, not electrical | $25 - 10 = 15$ |
| electrical and vibration, not thermal | $20 - 10 = 10$ |
| all three | $10$ |

Those seven add to 145, matching the formula, and building an explicit
population of 200 boards with exactly these overlaps and then counting it by
hand reproduces both 145 and 55.

## 7.5 Products, partitions, and how big the objects get

The Cartesian product $A \\times B$ is the set of ordered pairs with a first
component from $A$ and a second from $B$, so its size is the product of the
sizes:

$$\\lvert A \\times B \\rvert = \\lvert A \\rvert \\cdot \\lvert B \\rvert$$

For $\\lvert A \\rvert = 4$ and $\\lvert B \\rvert = 7$ that is 28 pairs, and
writing all 28 out confirms it. This is the multiplication principle wearing set
notation, and it is the reason a relation on a set can be so numerous: a
relation on $A$ is any subset of $A \\times A$, so a four-element set carries
$2^{16}$ = 65 536 distinct relations. That number was checked by enumerating
every subset of the 16 pairs, not by trusting the exponent.

A **partition** of $S$ is a family of non-empty, pairwise disjoint subsets whose
union is $S$. Partitions are what make counting arguments safe: if you can split
the objects you are counting into disjoint classes, the counts simply add, with
no overlap correction needed. Almost every clean counting argument in the next
section is a partition in disguise.

## 7.6 Worked example: three ways to describe the same set

An engineer specifies "resistors that are either 1 % tolerance or metal film,
but not both." Written down three ways:

$$T \\oplus M = (T \\setminus M) \\cup (M \\setminus T) = (T \\cup M) \\setminus (T \\cap M)$$

If 40 parts are 1 %, 55 are metal film, and 18 are both, then

$$\\lvert T \\cup M \\rvert = 40 + 55 - 18 = 77, \\qquad \\lvert T \\oplus M \\rvert = 77 - 18 = 59$$

The second subtraction is the one people miss. The exclusive form removes the
overlap **twice** in total: once because it was double counted in the sum, and
once because the specification excludes it. Getting 77 instead of 59 is the
standard wrong answer, and it is on every list of choices.`,
  examTip: 'Set identities are proved by membership, not by symbol pushing. If you can say "x is in the left side exactly when ... which is exactly when x is in the right side", you have a proof that covers every case. On the exam this matters most for De Morgan, which appears in set form in mathematics and in gate form in digital systems.',
  importantNote: 'A partition means disjoint AND covering. If the pieces overlap you must use inclusion-exclusion; if they do not cover the whole set you are missing cases. Checking both conditions before adding counts prevents the two most common counting errors at once.',
},
{
  id: 'dm-counting-families',
  title: '8. Counting: Four Families, One Decision',
  content: `## 8.1 Everything starts with the multiplication principle

If a task splits into stages, and stage $k$ can be completed in $n_k$ ways
**regardless of how the earlier stages went**, then the whole task can be
completed in

$$n_1 \\cdot n_2 \\cdots n_m = \\prod_{k=1}^{m} n_k$$

ways. The italicised condition is the one that gets violated. It is safe to say
"three choices of connector, then four choices of cable" only if all four cables
remain available whatever connector you picked. When the second count depends on
the first, the multiplication principle does not apply directly and the problem
has to be split into cases that each satisfy it.

Every formula in this section is a consequence of that one principle plus one
correction for over-counting.

## 8.2 Ordered selections: permutations

Choose $k$ items from $n$ distinct items where the order of selection matters
and no item may be reused. The first slot has $n$ candidates, the second $n-1$,
and so on for $k$ slots:

$$P(n,k) = n(n-1)(n-2)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}$$

With $k = n$ this collapses to $n!$, the number of ways to arrange everything.

$$P(8,3) = 8 \\times 7 \\times 6 = 336$$

Generating all ordered triples of distinct items from a set of eight and
counting the list gives 336, so the formula and the objects agree.

## 8.3 Unordered selections: combinations

Now suppose the order does not matter. Every unordered selection of $k$ items
was counted $k!$ times by the permutation count, once for each way of arranging
it, so divide:

$$C(n,k) = \\binom{n}{k} = \\frac{P(n,k)}{k!} = \\frac{n!}{k!\\,(n-k)!}$$

$$C(8,3) = \\frac{336}{6} = 56$$

That division is the entire difference between the two formulas, and it gives a
free error check: whatever else happens, $P(n,k)$ must be exactly $k!$ times
$C(n,k)$. If your two numbers do not stand in that ratio, one of them was
computed with the wrong formula and you know it before you look at the choices.

$$\\binom{n}{k} = \\binom{n}{n-k}$$

Choosing which $k$ to take is the same as choosing which $n-k$ to leave, so the
coefficients are symmetric, and evaluating $\\binom{20}{18}$ as
$\\binom{20}{2} = 190$ turns a four-digit factorial into a one-line product.

## 8.4 Worked example: four components, counted both ways

Abstraction is where counting goes wrong, so here is a case small enough to
write out in full. Four distinguishable components are labelled P, Q, R and S,
and two of them are to be selected.

**Order matters.** The twelve ordered pairs are

PQ, PR, PS, QP, QR, QS, RP, RQ, RS, SP, SQ, SR

which is $P(4,2) = 4 \\times 3 = 12$, and the list has twelve entries.

**Order does not matter.** Now PQ and QP are the same selection, so the six
distinct pairs are

PQ, PR, PS, QR, QS, RS

which is $C(4,2) = 12/2 = 6$, and the list has six entries. The ratio is
$2! = 2$, exactly as the identity requires. Every entry in the first list
appears in the second exactly twice, which is the division made visible.

The practical test, then, is not "does the problem sound ordered" but: **swap
two of the items you selected. Is that a different outcome?** If yes, use
$P(n,k)$; if no, use $C(n,k)$.

## 8.5 Repetition allowed, order matters

If items may be reused, every slot has all $n$ candidates:

$$n^{k}$$

$$8^{3} = 512$$

Enumerating all ordered triples drawn with replacement from eight items gives
512. Note that $512 > 336$: allowing reuse adds more possibilities than
forbidding it removes, which is a useful sanity anchor when two of the four
answers are close together.

![Two stacked panels sharing a sample-size axis for n equal to eight. The upper panel plots ordered counts, n to the k and P of n comma k, on a logarithmic scale; the lower panel plots unordered counts, C of n plus k minus one comma k and C of n comma k. The four curves separate quickly, so choosing the wrong family changes the answer by orders of magnitude.](/courses/fe-ee/figures/math5-dm-four-families.svg)

## 8.6 Worked example: arrangements when some items are identical

How many distinguishable strings can be made from the letters of RESISTOR?

There are eight letters, but R appears twice and S appears twice. If all eight
were distinct the answer would be $8! = 40\\,320$. Each genuine arrangement was
counted once for each way of permuting the two identical Rs among themselves and
the two identical Ss among themselves, that is $2! \\times 2! = 4$ times:

$$\\frac{8!}{2!\\,2!} = \\frac{40320}{4} = 10080$$

Generating all $8!$ permutations of the letters, discarding duplicates, and
counting what survives gives exactly 10 080. In general, for $n$ items with
repeats of multiplicity $n_1, n_2, \\ldots, n_r$,

$$\\frac{n!}{n_1!\\,n_2!\\cdots n_r!}$$

which is called the multinomial coefficient, and which reduces to $C(n,k)$ when
there are just two groups: $n!/(k!\\,(n-k)!)$ is the number of arrangements of
$k$ ones and $n-k$ zeros, so a binomial coefficient literally counts bit
patterns of a given weight.

## 8.7 Repetition allowed, order does not matter

The fourth family is the one people have not seen and cannot guess. Choosing
$k$ items from $n$ types, with repetition allowed and order irrelevant, is the
same as deciding **how many of each type** to take:

$$x_1 + x_2 + \\cdots + x_n = k, \\qquad x_i \\ge 0$$

Encode a solution as a row of $k$ stars separated into $n$ groups by $n-1$ bars.
Every arrangement of $k$ stars and $n-1$ bars is one solution and every solution
is one arrangement, so the count is the number of ways to place the bars among
$k + n - 1$ symbols:

$$C(n+k-1,\\;k) = \\binom{n+k-1}{k}$$

## 8.8 Worked example: seven capacitors across four boards

Seven identical capacitors are to be distributed among four distinct boards,
with no requirement that every board gets one. How many distributions?

Here $n = 4$ types and $k = 7$ items, so

$$\\binom{4+7-1}{7} = \\binom{10}{7} = \\binom{10}{3} = \\frac{10 \\times 9 \\times 8}{3 \\times 2 \\times 1} = 120$$

Listing every non-negative integer solution of $x_1+x_2+x_3+x_4 = 7$ gives 120
tuples, so the stars-and-bars encoding did not lose or duplicate anything.

Now add the requirement that **every board gets at least one**. Hand one
capacitor to each board first, leaving three to distribute freely:

$$\\binom{4+3-1}{3} = \\binom{6}{3} = 20$$

and the enumeration of positive solutions also returns 20. Converting a
"at least one each" constraint into a smaller free problem is the standard move,
and it works for any floor, not just one.

| Question | Formula | $n = 8$, $k = 3$ |
|---|---|---|
| ordered, no repeats | $P(n,k)$ | 336 |
| ordered, repeats allowed | $n^{k}$ | 512 |
| unordered, no repeats | $C(n,k)$ | 56 |
| unordered, repeats allowed | $C(n+k-1,k)$ | 120 |

All four counts in that column were produced by listing the objects, not by
evaluating the formulas.`,
  examTip: 'Two questions, asked in this order, choose the formula every time: does swapping two chosen items give a different outcome, and may an item be chosen twice? For n = 8 and k = 3 the four answers are 336, 512, 56 and 120 — so the wrong family is not a small error, it is a different order of magnitude.',
  importantNote: 'The multiplication principle needs the later stage counts to be independent of the earlier choices. "Pick a resistor, then pick a different resistor" is fine because the second count is always n - 1; "pick a resistor, then pick a capacitor rated above it" is not, and must be split into cases.',
},
{
  id: 'dm-inclusion-pigeonhole',
  title: '9. Inclusion-Exclusion and the Pigeonhole Principle',
  content: `## 9.1 Two sets: subtract what you counted twice

Adding $\\lvert A \\rvert$ and $\\lvert B \\rvert$ counts everything in the
overlap twice, so one copy has to come back out:

$$\\lvert A \\cup B \\rvert = \\lvert A \\rvert + \\lvert B \\rvert - \\lvert A \\cap B \\rvert$$

The proof is the partition idea from section 7. Split the union into three
disjoint pieces — in $A$ only, in $B$ only, in both — and the sizes add without
correction. Writing $\\lvert A \\rvert$ as (A only) plus (both) and
$\\lvert B \\rvert$ as (B only) plus (both) shows the sum contains (both) twice.

## 9.2 Three sets: subtract the pairs, then put the triple back

Apply the two-set rule to $A \\cup B$ and $C$, then expand:

$$\\lvert A \\cup B \\cup C \\rvert = \\lvert A \\rvert + \\lvert B \\rvert + \\lvert C \\rvert - \\lvert A \\cap B \\rvert - \\lvert A \\cap C \\rvert - \\lvert B \\cap C \\rvert + \\lvert A \\cap B \\cap C \\rvert$$

Track a single object that lies in all three sets to see why the last term is
needed. It is counted three times by the singles, removed three times by the
pairs, and would end at zero — so one copy must be restored. An object in
exactly two sets is counted twice and removed once, ending at one, correctly,
with no further help. The alternating pattern continues for more sets: add the
singles, subtract the pairs, add the triples, subtract the quadruples.

![Three overlapping circles labelled multiples of two, three and five within the integers from one to a thousand. Each of the seven regions carries its own population, and the seven populations sum to the union count of seven hundred and thirty-four, with two hundred and sixty-six integers lying outside all three circles.](/courses/fe-ee/figures/math5-dm-venn-three.svg)

## 9.3 Worked example: how many of the first thousand integers are divisible by 2, 3 or 5

Let $A$, $B$ and $C$ be the multiples of 2, 3 and 5 in $1 \\ldots 1000$. The
sizes come from floor division, since the multiples of $d$ up to $N$ number
$\\lfloor N/d \\rfloor$:

$$\\lvert A \\rvert = 500, \\qquad \\lvert B \\rvert = 333, \\qquad \\lvert C \\rvert = 200$$

An integer divisible by both 2 and 3 is divisible by 6, and similarly for the
other pairs, so the intersections need the least common multiples:

$$\\lvert A \\cap B \\rvert = \\left\\lfloor \\tfrac{1000}{6} \\right\\rfloor = 166, \\qquad \\lvert A \\cap C \\rvert = \\left\\lfloor \\tfrac{1000}{10} \\right\\rfloor = 100, \\qquad \\lvert B \\cap C \\rvert = \\left\\lfloor \\tfrac{1000}{15} \\right\\rfloor = 66$$

$$\\lvert A \\cap B \\cap C \\rvert = \\left\\lfloor \\tfrac{1000}{30} \\right\\rfloor = 33$$

$$\\lvert A \\cup B \\cup C \\rvert = 500 + 333 + 200 - 166 - 100 - 66 + 33 = 734$$

So 734 of the thousand are divisible by at least one of 2, 3 and 5, and
$1000 - 734 = 266$ are divisible by none. Both numbers were also obtained by
walking the integers one at a time and testing them, which is the check that
matters: the formula agrees with the actual list.

The trap in this question is using 6, 10 and 15 without noticing they are least
common multiples rather than products. That happens to be the same thing here
because 2, 3 and 5 are pairwise coprime; for divisors like 4 and 6 the pairwise
intersection is the multiples of 12, not 24, and the product answer is wrong.

## 9.4 Worked example: none of the connectors in the right place

Five connectors are pulled off five cables during rework and reattached at
random. What is the chance that not one of them goes back where it belongs?

An arrangement with no item in its original position is a **derangement**, and
inclusion-exclusion counts them directly. Let $A_i$ be the set of arrangements
that do put item $i$ back correctly. Then $\\lvert A_i \\rvert = 4!$, any pair
intersects in $3!$ arrangements, and so on, giving

$$D_n = n!\\sum_{k=0}^{n} \\frac{(-1)^{k}}{k!}$$

$$D_5 = 120\\left(1 - 1 + \\tfrac{1}{2} - \\tfrac{1}{6} + \\tfrac{1}{24} - \\tfrac{1}{120}\\right) = 44$$

Generating all $5! = 120$ permutations and keeping those with no fixed point
gives 44, confirming the formula on the objects themselves. The probability is
$44/120 = 0.3667$. For four items the same routine gives $D_4 = 9$ out of 24,
and for six items $D_6 = 265$ out of 720; the ratio settles very quickly on
$1/e \\approx 0.3679$, which is why "about 37 %" is a safe estimate for any
$n$ beyond four.

## 9.5 The pigeonhole principle

If $m$ objects go into $n$ containers and $m > n$, some container holds at least
two objects. It sounds too weak to prove anything. It is not, because it turns
"there exists" claims into arithmetic, and existence claims are otherwise hard.

The generalised form is the one to remember:

$$\\text{some container holds at least } \\left\\lceil \\frac{m}{n} \\right\\rceil \\text{ objects}$$

Twenty-five resistors sorted into four tolerance bins must leave some bin with
at least $\\lceil 25/4 \\rceil = 7$. This is a floor on the worst case, and it
is tight: enumerating every way of splitting 25 items among four bins and taking
the smallest achievable maximum returns exactly 7, so no cleverer arrangement
does better.

![A staircase of the ceiling of m over four rising against the straight line m over four, for m from one to thirty-two items. Black markers show the true minimum of the fullest bin found by enumerating every possible split, and they land on the staircase at every value of m, with the case of twenty-five items circled at seven.](/courses/fe-ee/figures/math5-dm-pigeonhole.svg)

## 9.6 Worked example: a pigeonhole argument you would not guess

**Claim.** Choose any nine distinct integers from 1 to 16. Two of them must be
such that one divides the other.

Nothing in the statement suggests containers, and that is what makes it a real
application. Write every integer as an odd number times a power of two:

$$m = 2^{a} \\cdot q, \\qquad q \\text{ odd}$$

That representation is unique. The odd parts available in $1 \\ldots 16$ are
1, 3, 5, 7, 9, 11, 13 and 15 — eight of them, and those eight are the
containers. Nine chosen integers must therefore share an odd part between some
two of them, say $2^{a}q$ and $2^{b}q$ with $a < b$; then the first divides the
second exactly $2^{\\,b-a}$ times.

Every one of the 11 440 possible nine-element subsets of $1 \\ldots 16$ was
tested, and every one contains such a pair. The bound is also tight: the eight
integers $9, 10, 11, \\ldots, 16$ have eight different odd parts, and no one of
them divides another, so nine really is the smallest number that forces the
conclusion.

A second, easier instance for practice: any six distinct integers chosen from
1 to 10 must contain a pair summing to 11. The containers are the five pairs
$\\{1,10\\}$, $\\{2,9\\}$, $\\{3,8\\}$, $\\{4,7\\}$, $\\{5,6\\}$, and six numbers
cannot avoid doubling up in five containers. All 210 six-element subsets were
checked; the five-element set $\\{1,2,3,4,5\\}$ shows five is not enough.

## 9.7 Worked example: remainders as containers

Given any eight integers, two of them leave the same remainder on division by
seven, because there are only seven possible remainders. Their difference is
then a multiple of seven:

$$m_i \\equiv m_j \\pmod 7 \\quad \\Longrightarrow \\quad 7 \\mid (m_i - m_j)$$

This is the shape most pigeonhole exam questions take — sampling, hashing and
aliasing arguments all reduce to it. A counter of $n$ states visited more than
$n$ times must repeat a state, which is why any deterministic finite counter
driven long enough is periodic, and why an $n$-bit linear feedback shift
register has a maximum period of $2^{n} - 1$ rather than something larger.`,
  examTip: 'For inclusion-exclusion, write the signs before the numbers: plus singles, minus pairs, plus triple. For pigeonhole, name the containers out loud before you count anything - the whole difficulty of these problems is deciding what the containers are, never the arithmetic afterwards.',
  importantNote: 'For two divisors the pairwise intersection counts multiples of their LEAST COMMON MULTIPLE, not their product. Multiples of 4 and of 6 overlap on multiples of 12, so using 24 undercounts the overlap and inflates the union.',
},
{
  id: 'dm-binomial-proved',
  title: '10. The Binomial Theorem, Proved by Counting',
  content: `## 10.1 Why the coefficient is a combination

Expanding $(a+b)^{n}$ means multiplying out $n$ identical factors $(a+b)$. To
form a term you walk the $n$ factors and take either $a$ or $b$ from each. A
term with $k$ copies of $b$ arises from exactly those walks that chose $b$ in
$k$ of the $n$ factors — and the number of ways to make that choice is the
number of $k$-subsets of the factors. Hence

$$(a+b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k} a^{\\,n-k} b^{\\,k}$$

The binomial coefficient is not a fitted constant; it is a count of the ways a
term can happen. Expanding $(a+b)^{5}$ by repeated multiplication and collecting
like terms gives the coefficients 1, 5, 10, 10, 5, 1, matching
$\\binom{5}{k}$ for $k = 0 \\ldots 5$; doing the same for $(a+b)^{8}$ gives
1, 8, 28, 56, 70, 56, 28, 8, 1.

## 10.2 Pascal's identity, proved combinatorially

$$\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$$

Fix one particular element of the ground set and split the $k$-subsets into two
disjoint classes: those that contain it, and those that do not. A subset in the
first class needs $k-1$ more members from the remaining $n-1$, and a subset in
the second needs all $k$ from the remaining $n-1$. The classes are disjoint and
they cover everything, so the counts add.

For $n = 7$ and $k = 3$: of the 35 three-element subsets of a seven-element set,
15 contain the designated element and 20 avoid it, and $15 + 20 = 35$. All three
numbers came from listing the subsets.

$$\\binom{7}{3} = \\binom{6}{2} + \\binom{6}{3} = 15 + 20 = 35$$

That identity is what builds Pascal's triangle row by row, and reconstructing a
coefficient from the row above is faster than factorials whenever the numbers
are small.

![Two rows of Pascal's triangle drawn as stem plots on a shared axis: row six with entries one, six, fifteen, twenty, fifteen, six, one summing to sixty-four, and row ten peaking at two hundred and fifty-two and summing to one thousand and twenty-four.](/courses/fe-ee/figures/math5-dm-pascal-rows.svg)

## 10.3 What the row sums mean

Setting $a = b = 1$ in the binomial theorem gives

$$\\sum_{k=0}^{n} \\binom{n}{k} = 2^{n}$$

which says that adding up the subsets of every size counts all subsets, and
there are $2^{n}$ of those. Row 10 sums to 1024, and listing every subset of a
ten-element set confirms it.

Setting $a = 1$, $b = -1$ gives

$$\\sum_{k=0}^{n} (-1)^{k} \\binom{n}{k} = 0 \\qquad (n \\ge 1)$$

so a set has exactly as many even-sized subsets as odd-sized ones. That is a
statement about parity, and it is the reason a single parity bit works at all.

## 10.4 Worked example: parity and weight of a byte

How many eight-bit patterns contain an even number of ones?

$$\\binom{8}{0} + \\binom{8}{2} + \\binom{8}{4} + \\binom{8}{6} + \\binom{8}{8} = 1 + 28 + 70 + 28 + 1 = 128$$

That is half of $2^{8} = 256$, exactly as the alternating-sum identity predicts,
and enumerating all 256 patterns and counting the even-weight ones returns 128.
Because the split is exactly even, a single parity bit can distinguish the two
halves — and because flipping any one bit moves a pattern from one half to the
other, an odd number of bit errors always changes the parity while an even
number never does. That is the whole reach and the whole limitation of parity
checking, and it follows from a row of Pascal's triangle.

The number of patterns with exactly three ones is $\\binom{8}{3} = 56$, again
confirmed by enumeration.

## 10.5 Worked example: a binomial probability

A production line yields good units with probability $p = 0.9$ independently.
In a batch of eight, what is the probability that exactly six are good?

Each specific sequence with six good and two bad units has probability
$p^{6}(1-p)^{2}$, and there are $\\binom{8}{6}$ such sequences:

$$P(X = 6) = \\binom{8}{6}(0.9)^{6}(0.1)^{2} = 28 \\times 0.531441 \\times 0.01 = 0.14880$$

The binomial coefficient here is doing exactly the job it did in the algebra: it
counts the arrangements that produce the same outcome. For a fair coin,
$p = 0.5$, every sequence has the same probability $2^{-8}$ and the count alone
decides, so the chance of exactly three heads in eight tosses is
$56/256 = 0.21875$.

## 10.6 Vandermonde's identity, and a use for it

$$\\binom{m+n}{k} = \\sum_{i=0}^{k} \\binom{m}{i}\\binom{n}{k-i}$$

Split a group of $m+n$ items into $m$ of one kind and $n$ of another. Any
$k$-subset takes $i$ of the first kind and $k-i$ of the second for some $i$, and
summing over $i$ covers every possibility exactly once.

With $m = 4$, $n = 5$, $k = 4$:

$$\\binom{9}{4} = \\binom{4}{0}\\binom{5}{4} + \\binom{4}{1}\\binom{5}{3} + \\binom{4}{2}\\binom{5}{2} + \\binom{4}{3}\\binom{5}{1} + \\binom{4}{4}\\binom{5}{0}$$

$$126 = 5 + 40 + 60 + 20 + 1$$

Enumerating the 126 four-element subsets of a nine-element set and sorting them
by how many members come from the first four gives the counts 5, 40, 60, 20, 1,
matching the identity term by term. Practically, this is how "at least two of
the seven engineers" problems get answered: split by how many come from each
group and add the disjoint cases.

## 10.7 Worked example: a committee with a floor

From seven electrical engineers and five mechanical engineers, how many
four-person teams contain at least two electrical engineers?

Split by the number of electrical engineers, since those cases are disjoint:

$$\\binom{7}{2}\\binom{5}{2} + \\binom{7}{3}\\binom{5}{1} + \\binom{7}{4}\\binom{5}{0} = 210 + 175 + 35 = 420$$

Out of $\\binom{12}{4} = 495$ possible teams, 420 qualify. Listing all 495 teams
and filtering them gives 420, so the case split lost nothing and double counted
nothing.

The alternative route — count everything and subtract the teams with zero or one
electrical engineer — agrees:

$$495 - \\binom{5}{4} - \\binom{7}{1}\\binom{5}{3} = 495 - 5 - 70 = 420$$

When the qualifying cases outnumber the disqualifying ones, complementary
counting is the shorter road.`,
  examTip: 'Read binomial coefficients as counts of arrangements, not as table lookups. C(8,3) = 56 answers "how many 8-bit words have three ones", "how many 3-component subsets from eight parts", and "what multiplies p cubed q to the fifth in a binomial probability" - one number, three questions.',
  importantNote: 'C(n,k) = C(n,n-k). Computing C(20,18) as C(20,2) = 190 avoids factorials entirely. Any time k exceeds n/2, flip it before you start multiplying.',
},
{
  id: 'dm-recurrence',
  title: '11. Recurrence Relations and Characteristic Roots',
  content: `## 11.1 What a linear recurrence is, and where it comes from

A sequence defined by

$$a_n = c_1 a_{n-1} + c_2 a_{n-2} + \\cdots + c_m a_{n-m}$$

with constant coefficients is a **linear homogeneous recurrence with constant
coefficients**, and it is the discrete twin of the constant-coefficient
differential equation studied elsewhere in this chapter. The solution method is
the same method wearing different clothes: assume an exponential, substitute,
and let the algebra pick the exponents.

For a differential equation you try $y = e^{rt}$; here you try
$a_n = r^{\\,n}$. Substituting into the second-order case
$a_n = c_1 a_{n-1} + c_2 a_{n-2}$ and dividing by $r^{\\,n-2}$ gives the
**characteristic equation**

$$r^{2} - c_1 r - c_2 = 0$$

Its roots decide everything about the sequence, exactly as the roots of
$s^{2} + 2\\zeta\\omega_n s + \\omega_n^{2}$ decide everything about a
second-order circuit.

## 11.2 First order, with and without forcing

$$a_n = r\\,a_{n-1} \\quad \\Longrightarrow \\quad a_n = a_0 r^{\\,n}$$

Add a constant drive and the solution splits into a steady part and a decaying
part, which is the discrete version of the transient-plus-steady-state split:

$$b_n = \\alpha b_{n-1} + \\beta \\quad \\Longrightarrow \\quad b_n = \\frac{\\beta}{1-\\alpha} + \\left(b_0 - \\frac{\\beta}{1-\\alpha}\\right)\\alpha^{\\,n} \\qquad (\\alpha \\ne 1)$$

For $\\alpha = 0.5$, $\\beta = 3$, $b_0 = 0$, the steady value is
$3/0.5 = 6$ and the sequence is $b_n = 6 - 6(0.5)^{n}$: it starts at 0 and
climbs toward 6, reaching 5.9985 by $n = 12$. Iterating the recurrence twelve
times gives the same number.

## 11.3 Distinct real roots

If $r_1 \\ne r_2$ are both real, the general solution is

$$a_n = A r_1^{\\,n} + B r_2^{\\,n}$$

with $A$ and $B$ fixed by the two initial values.

## 11.4 Worked example: two roots, two constants

Solve $a_n = 5a_{n-1} - 6a_{n-2}$ with $a_0 = 2$ and $a_1 = 5$.

$$r^{2} - 5r + 6 = 0 \\quad \\Longrightarrow \\quad (r-2)(r-3) = 0 \\quad \\Longrightarrow \\quad r = 2, \\; 3$$

$$a_n = A\\,2^{\\,n} + B\\,3^{\\,n}$$

$$A + B = 2, \\qquad 2A + 3B = 5 \\quad \\Longrightarrow \\quad A = 1, \\; B = 1$$

$$a_n = 2^{\\,n} + 3^{\\,n}$$

Check it against the recurrence rather than against the algebra. Iterating from
$a_0 = 2$ and $a_1 = 5$ gives 2, 5, 13, 35, 97, 275, and the closed form gives
$2^{2}+3^{2} = 13$, $2^{3}+3^{3} = 35$, $2^{4}+3^{4} = 97$,
$2^{5}+3^{5} = 275$. The two sequences agree term for term out to $n = 20$,
where both give 3 487 832 977.

Because $3 > 2$, the $3^{n}$ term eventually dominates, and the ratio
$a_n/a_{n-1}$ creeps up toward 3. That is the discrete analogue of the slowest
pole dominating a transient, and it is worth recognising: the largest root in
magnitude sets the long-run behaviour, and everything else is a correction that
fades.

![Two stacked panels sharing an index axis. The upper panel shows the sequence generated by a n equals two a n minus one minus two a n minus two as stems, oscillating in sign inside a dashed envelope of plus and minus two to the n over two. The lower panel shows the term ratio for the recurrence with roots two and three climbing toward three.](/courses/fe-ee/figures/math5-dm-recurrence.svg)

## 11.5 Worked example: a repeated root needs an extra factor of n

Solve $a_n = 6a_{n-1} - 9a_{n-2}$ with $a_0 = 1$ and $a_1 = 9$.

$$r^{2} - 6r + 9 = (r-3)^{2} = 0 \\quad \\Longrightarrow \\quad r = 3 \\text{ twice}$$

A repeated root supplies only one solution, so the second must be built. As in
the critically damped differential equation, the missing partner is the same
exponential multiplied by the index:

$$a_n = (A + Bn)\\,3^{\\,n}$$

$$A = 1, \\qquad 3(A + B) = 9 \\quad \\Longrightarrow \\quad B = 2$$

$$a_n = (1 + 2n)\\,3^{\\,n}$$

Iterating gives 1, 9, 45, 189, 729, 2673, and the closed form gives
$(1+4)3^{2} = 45$, $(1+6)3^{3} = 189$, $(1+8)3^{4} = 729$. The sequences agree
to $n = 20$. Forgetting the factor of $n$ leaves a solution that fits $a_0$ but
cannot fit $a_1$ as well, which is the symptom to look for.

## 11.6 Worked example: complex roots give an oscillation

Solve $a_n = 2a_{n-1} - 2a_{n-2}$ with $a_0 = a_1 = 1$.

$$r^{2} - 2r + 2 = 0 \\quad \\Longrightarrow \\quad r = 1 \\pm i = \\sqrt{2}\\,e^{\\pm i\\pi/4}$$

Complex roots in polar form make the answer readable. With modulus $\\sqrt{2}$
and argument $\\pi/4$,

$$a_n = 2^{\\,n/2}\\left(A\\cos\\tfrac{n\\pi}{4} + B\\sin\\tfrac{n\\pi}{4}\\right)$$

$$a_0 = A = 1, \\qquad a_1 = \\sqrt{2}\\left(\\tfrac{\\sqrt{2}}{2} + \\tfrac{\\sqrt{2}}{2}B\\right) = 1 + B = 1 \\quad \\Longrightarrow \\quad B = 0$$

$$a_n = 2^{\\,n/2}\\cos\\frac{n\\pi}{4}$$

Iterating the recurrence gives 1, 1, 0, −2, −4, −4, 0, 8, 16 for
$n = 0 \\ldots 8$, and the closed form reproduces every one of them. The modulus
of the root, $\\sqrt{2} > 1$, means the envelope grows; the argument
$\\pi/4$ means the sign pattern repeats every eight steps. Modulus sets growth,
argument sets frequency — the same reading as the real and imaginary parts of a
Laplace pole, transplanted to the unit-circle picture used in digital filtering.

| Roots of $r^{2} - c_1 r - c_2 = 0$ | Form of the solution |
|---|---|
| real and distinct, $r_1 \\ne r_2$ | $A r_1^{\\,n} + B r_2^{\\,n}$ |
| real and repeated, $r$ | $(A + Bn)\\,r^{\\,n}$ |
| complex pair $\\rho e^{\\pm i\\theta}$ | $\\rho^{\\,n}(A\\cos n\\theta + B\\sin n\\theta)$ |

## 11.7 Worked example: a resistor ladder is a difference equation

Take a ladder of equal resistors $R$: a series $R$ between consecutive nodes and
a shunt $R$ from each node to ground. Writing Kirchhoff's current law at an
interior node $k$, with every resistance the same, the resistances cancel:

$$\\frac{V_{k-1} - V_k}{R} = \\frac{V_k}{R} + \\frac{V_k - V_{k+1}}{R} \\quad \\Longrightarrow \\quad V_{k+1} - 3V_k + V_{k-1} = 0$$

That is a second-order linear recurrence in the node index. Its characteristic
equation and roots are

$$r^{2} - 3r + 1 = 0 \\quad \\Longrightarrow \\quad r_{\\pm} = \\frac{3 \\pm \\sqrt{5}}{2} = 2.618034 \\ \\text{and}\\ 0.381966$$

The two roots multiply to 1, so one is the reciprocal of the other: a growing
spatial mode and a decaying one. A physical ladder driven from one end and
terminated at the other contains both, mixed in whatever proportion the
termination demands.

Take a concrete three-node ladder driven at $V_0 = 10$ V, with the last node
carrying only its shunt resistor. Nodal analysis gives the linear system

$$3V_1 - V_2 = 10, \\qquad -V_1 + 3V_2 - V_3 = 0, \\qquad -V_2 + 2V_3 = 0$$

$$V_1 = \\tfrac{50}{13} = 3.8462 \\ \\mathrm{V}, \\qquad V_2 = \\tfrac{20}{13} = 1.5385 \\ \\mathrm{V}, \\qquad V_3 = \\tfrac{10}{13} = 0.7692 \\ \\mathrm{V}$$

Now check the recurrence directly at the interior nodes:
$10 + 1.5385 = 3 \\times 3.8462$ and $3.8462 + 0.7692 = 3 \\times 1.5385$. Both
hold. Fitting $A r_+^{\\,k} + B r_-^{\\,k}$ to $V_0$ and $V_1$ gives
$A = 0.011848$ and $B = 9.988152$, and that two-term expression reproduces all
four node voltages to nine decimal places. The recurrence is not an analogy for
the ladder; it is the ladder.

![A logarithmic plot of ladder node voltage against node index. Black markers are the node voltages from an independent linear solve of the network; the solid curve is the two-mode closed form fitted to the source and the first node, and a dashed curve shows the decaying mode alone, which departs from the true voltages near the terminated end.](/courses/fe-ee/figures/math5-dm-ladder.svg)`,
  examTip: 'Solve the characteristic equation first and read the answer off the roots: distinct real roots give two exponentials, a repeated root needs the extra factor of n, and a complex pair gives a growing or decaying oscillation whose modulus is the growth and whose argument is the frequency. Then fit the constants to the initial values, never before.',
  importantNote: 'Check a closed form by iterating the recurrence three or four steps and comparing, not by re-deriving the algebra. An arithmetic slip in solving for A and B survives a second look at your own working and dies immediately against the actual sequence.',
},
{
  id: 'dm-graphs-trees',
  title: '12. Graphs, Trees, and the Counting They Support',
  content: `## 12.1 The vocabulary an exam question assumes

A **graph** is a set of vertices together with a set of edges joining pairs of
them. The **degree** of a vertex is the number of edge-ends meeting it. A
**walk** that repeats no edge is a **trail**; one that returns to its start is
**closed**. A **path** repeats no vertex; a **cycle** is a closed path. A graph
is **connected** when some path joins every pair of vertices.

| Object | Vertices | Edges | Note |
|---|---|---|---|
| complete graph $K_n$ | $n$ | $n(n-1)/2$ | every pair joined |
| cycle $C_n$ | $n$ | $n$ | one closed ring |
| tree | $n$ | $n-1$ | connected, no cycle |
| $n$-cube $Q_n$ | $2^{n}$ | $n\\,2^{\\,n-1}$ | vertices are bit strings |

$K_6$ has $6 \\times 5/2 = 15$ edges, and listing the pairs gives 15.

## 12.2 The handshake lemma, and what it forbids

Every edge contributes exactly two to the total degree, once at each end, so

$$\\sum_{v} \\deg(v) = 2\\lvert E \\rvert$$

The sum of the degrees is therefore always **even**, and the number of
odd-degree vertices is always even. This is the cheapest impossibility test in
graph theory. A network of five nodes in which every node has exactly three
connections cannot exist, because $5 \\times 3 = 15$ is odd and no integer edge
count doubles to 15. Building all $2^{10} = 1024$ graphs on five labelled
vertices and looking for a three-regular one turns up none, as the lemma
promises.

For a worked instance, take the five-vertex graph whose degrees are 3, 2, 4, 3
and 2. The degrees sum to 14, so the graph has $14/2 = 7$ edges, and counting
the edges directly gives 7.

## 12.3 Euler trails: use every edge once

A connected graph has a **closed Euler trail**, using every edge exactly once
and returning to the start, if and only if every vertex has even degree. It has
an open Euler trail if and only if exactly two vertices have odd degree, and the
trail must begin at one of them and end at the other.

The reasoning is a degree argument. Every time the trail enters an interior
visit to a vertex it must also leave, consuming two edge-ends; a vertex of odd
degree must therefore be a start or an end, and a closed trail has neither.

$K_5$ has every degree equal to 4, so a closed Euler trail exists — and one can
be produced: 0-1-2-0-3-1-4-2-3-4-0 uses all ten edges exactly once and returns
to vertex 0. $K_4$ has every degree equal to 3, so all four vertices are odd,
which is more than two: it has no Euler trail of either kind. The graph in the
previous paragraph has exactly two odd-degree vertices, so it has an open Euler
trail but no closed one.

## 12.4 Hamilton cycles: use every vertex once

A **Hamilton cycle** visits every vertex exactly once and returns to the start.
There is no clean necessary-and-sufficient test, which is the honest thing to
say about it, but there is a useful sufficient one. **Dirac's condition**: if
$n \\ge 3$ and every vertex has degree at least $n/2$, a Hamilton cycle exists.

$$\\deg(v) \\ge \\frac{n}{2} \\ \\text{ for all } v \\quad \\Longrightarrow \\quad \\text{a Hamilton cycle exists}$$

The condition is sufficient, never necessary: $C_6$ has every degree 2, far
below 3, and is itself a Hamilton cycle. $K_5$ has 12 distinct Hamilton cycles
counted up to direction, which is $4!/2$, and enumerating the cyclic orders
confirms 12. The three-dimensional cube graph has 6, and every degree there is
3 against $n/2 = 4$, so Dirac's test says nothing while the cycles exist anyway.

Euler is about edges and has a clean test; Hamilton is about vertices and does
not. That contrast is itself an exam question.

## 12.5 Trees, and why circuit theory cares

A **tree** is a connected graph with no cycle. Three properties are equivalent
for a connected graph on $n$ vertices, and any one may be used as the
definition: it has no cycle, it has exactly $n-1$ edges, or adding any new edge
creates exactly one cycle.

$$\\lvert E \\rvert = \\lvert V \\rvert - 1$$

A **spanning tree** of a connected graph is a subgraph that is a tree and
reaches every vertex. Circuit analysis uses one every time you choose mesh
equations: the tree branches carry the independent node voltages, and the
remaining **links** each close exactly one independent loop. The number of links
is the **circuit rank**:

$$\\lvert E \\rvert - \\lvert V \\rvert + 1$$

For the five-vertex, seven-edge graph above that is $7 - 5 + 1 = 3$ independent
loops, against $5 - 1 = 4$ independent node equations — so mesh analysis is the
smaller system there and the faster route.

## 12.6 Worked example: counting the spanning trees of $K_4$ three ways

**By enumeration.** $K_4$ has 6 edges; a spanning tree needs $4 - 1 = 3$ of
them. There are $\\binom{6}{3} = 20$ three-edge subsets. Four of them are
triangles, which are cyclic and leave the fourth vertex isolated, so they are
not trees. That leaves 16, and testing all 20 subsets for connectivity and
acyclicity confirms 16.

**By Cayley's formula.** The number of labelled trees on $n$ vertices is

$$n^{\\,n-2}$$

$$4^{\\,2} = 16$$

**By the matrix-tree theorem.** Build the Laplacian $L = D - A$, where $D$ is
the diagonal matrix of degrees and $A$ the adjacency matrix; delete any one row
and the matching column; the determinant of what remains is the spanning-tree
count. For $K_4$ every degree is 3, so

$$L_{11} = \\begin{bmatrix} 3 & -1 & -1 \\\\ -1 & 3 & -1 \\\\ -1 & -1 & 3 \\end{bmatrix}, \\qquad \\det L_{11} = 16$$

Three routes, one answer. The same three routes give 3 for $K_3$, 125 for $K_5$
and 1296 for $K_6$, with the enumeration run in full each time. Removing a
single edge from $K_4$ drops the count from 16 to 8 — half the spanning trees
used that edge, which is exactly what you would expect from symmetry, and the
enumeration and the matrix-tree cofactor both return 8.

![A logarithmic plot of spanning-tree counts against the number of vertices. Round markers are exhaustive enumerations of every possible edge subset; the dashed curve through the upper markers is Cayley's formula for complete graphs, and the lower series shows that a cycle on n vertices has exactly n spanning trees.](/courses/fe-ee/figures/math5-dm-spanning-trees.svg)

## 12.7 Worked example: planarity and Euler's polyhedron formula

For a **connected planar** graph drawn without crossings,

$$V - E + F = 2$$

where $F$ counts the faces, including the unbounded outer one. $K_4$ can be
drawn without crossings and has $V = 4$, $E = 6$; the drawing has 3 bounded
faces plus the outer one, so

$$4 - 6 + 4 = 2$$

The formula gives a bound on how many edges a simple planar graph can have.
Every face is bounded by at least 3 edges and every edge borders at most 2
faces, so $2E \\ge 3F$; substituting $F = 2 - V + E$ gives

$$E \\le 3V - 6 \\qquad (V \\ge 3)$$

$K_5$ has $V = 5$ and $E = 10$ against a limit of $3(5) - 6 = 9$, so $K_5$
cannot be drawn in the plane without a crossing. That is the graph-theoretic
statement of why a single-layer board cannot route five mutually connected
nodes, and why the fifth connection needs a jumper or a second layer.`,
  examTip: 'Count degrees before anything else. The degree sum must be even; all-even degrees mean a closed Euler trail exists; exactly two odd degrees mean an open one exists and where it must start. For circuit work, links = E - V + 1 gives the number of mesh equations and V - 1 gives the number of node equations - compute both and solve the smaller system.',
  importantNote: 'Euler is about edges and has a complete test. Hamilton is about vertices and does not: Dirac\'s degree condition is sufficient but never necessary, so a graph failing it may still have a Hamilton cycle. Do not report "no Hamilton cycle" because Dirac\'s test was not met.',
},
{
  id: 'dm-boolean-bridge',
  title: '13. Boolean Algebra: the Bridge to the Digital Chapters',
  content: `## 13.1 The same structure, a third notation

Sets under union, intersection and complement, propositions under OR, AND and
NOT, and switching functions under $+$, $\\cdot$ and overbar are three readings
of one algebra. Every law proved in section 7 transfers, and the FE exam moves
between the three notations freely.

| Law | Set form | Switching form |
|---|---|---|
| identity | $A \\cup \\varnothing = A$ | $A + 0 = A$ |
| null | $A \\cap \\varnothing = \\varnothing$ | $A \\cdot 0 = 0$ |
| complement | $A \\cup A' = U$ | $A + \\overline{A} = 1$ |
| idempotent | $A \\cup A = A$ | $A + A = A$ |
| absorption | $A \\cup (A \\cap B) = A$ | $A + AB = A$ |
| distribution | $A \\cap (B \\cup C) = (A \\cap B) \\cup (A \\cap C)$ | $A(B+C) = AB + AC$ |
| De Morgan | $(A \\cup B)' = A' \\cap B'$ | $\\overline{A + B} = \\overline{A}\\,\\overline{B}$ |

The **duality principle** says that swapping $+$ with $\\cdot$ and 0 with 1
turns any true identity into another true identity. That halves the number of
laws worth memorising: learn $A + AB = A$ and you have $A(A+B) = A$ for free.
Both were confirmed over all four rows of the two-variable truth table.

## 13.2 The three identities that do the work

$$\\overline{A \\cdot B} = \\overline{A} + \\overline{B}, \\qquad \\overline{A + B} = \\overline{A} \\cdot \\overline{B}$$

$$A + \\overline{A}B = A + B$$

$$AB + \\overline{A}C + BC = AB + \\overline{A}C$$

The second is the **redundancy** law — sometimes called the simplification
theorem — and it is not the dual of absorption, which is $A(A+B) = A$. The third
is the **consensus** theorem: the $BC$ term is implied by the other two and can
be deleted. All three were checked exhaustively, over the four rows of a
two-variable table for the first two and all eight rows of a three-variable
table for consensus.

Consensus is the one that catches people out, because the redundant term looks
essential. If $B$ and $C$ are both true then either $A$ is true, making $AB$
true, or $A$ is false, making $\\overline{A}C$ true. Either way the expression
is already true without $BC$, so the term contributes nothing.

## 13.3 Canonical forms, and the minterm index

Any function of $n$ variables can be written as a sum of **minterms**, one for
each row of the truth table where the function is 1. A minterm is a product
containing every variable exactly once, complemented where that row has a 0.
Minterms are numbered by reading the row as a binary integer, which is why a
function is quoted compactly as, say, $\\sum m(1,3,4,5)$.

The canonical form is unique and it is always available, which makes it the
right starting point when a question gives you a truth table and asks for an
expression. It is almost never the shortest form, which is what simplification
is for.

## 13.4 Worked example: from a truth table to two gates

A three-variable function is 1 on rows 1, 3, 4 and 5 and 0 elsewhere. Write it
and simplify.

| $A$ | $B$ | $C$ | row | $F$ |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 2 | 0 |
| 0 | 1 | 1 | 3 | 1 |
| 1 | 0 | 0 | 4 | 1 |
| 1 | 0 | 1 | 5 | 1 |
| 1 | 1 | 0 | 6 | 0 |
| 1 | 1 | 1 | 7 | 0 |

The canonical sum has four product terms:

$$F = \\overline{A}\\,\\overline{B}C + \\overline{A}BC + A\\overline{B}\\,\\overline{C} + A\\overline{B}C$$

Pair the terms that differ in one variable. Rows 1 and 3 differ only in $B$, and
rows 4 and 5 differ only in $C$:

$$\\overline{A}\\,\\overline{B}C + \\overline{A}BC = \\overline{A}C(\\overline{B} + B) = \\overline{A}C$$
$$A\\overline{B}\\,\\overline{C} + A\\overline{B}C = A\\overline{B}(\\overline{C} + C) = A\\overline{B}$$
$$F = \\overline{A}C + A\\overline{B}$$

Four product terms became two, and a twelve-literal expression became four
literals. The simplified form was checked against the original on all eight
rows, which is the only check worth doing: a simplification that agrees on seven
rows is wrong.

## 13.5 Worked example: a simplification that looks like three terms

$$F = AB + A\\overline{B} + \\overline{A}B$$

$$AB + A\\overline{B} = A(B + \\overline{B}) = A$$
$$F = A + \\overline{A}B = A + B$$

The last step is the redundancy law, not absorption. Three product terms and an
apparent need for two inverters collapse to a single two-input OR gate. All four
rows of the truth table confirm it.

## 13.6 Why simplification is a method and not a habit

A function of $n$ variables is a choice of output for each of the $2^{n}$ rows,
so the number of distinct functions is

$$2^{\\,2^{n}}$$

For one variable that is 4, for two it is 16, for three 256, and for four
65 536. Each of those counts was confirmed by generating the truth tables and
counting the distinct ones. The search space explodes far faster than the input
space, which is why an ad hoc "try to spot a factor" approach stops working
around three variables and why systematic methods — Karnaugh maps up to four
variables, Quine-McCluskey beyond — exist at all.

![A logarithmic plot against the number of input variables, comparing the number of truth-table rows, two to the n, with the number of distinct Boolean functions, two to the two to the n. The function count reaches sixty-five thousand five hundred and thirty-six at four variables while the row count is still sixteen.](/courses/fe-ee/figures/math5-dm-boolean-explosion.svg)

The connection back to counting is direct. A function that is 1 on exactly $k$
of the $2^{n}$ rows can be chosen in $\\binom{2^{n}}{k}$ ways, and summing over
$k$ recovers $2^{2^{n}}$ by the row-sum identity of section 10. The discrete
mathematics and the digital systems chapters are answering the same question in
two vocabularies.`,
  examTip: 'When a Boolean question offers four expressions, build the truth table rather than manipulating symbols. Four rows for two variables or eight for three is faster than a chain of identities and it cannot go subtly wrong. Manipulate only when the variable count makes a table impractical.',
  importantNote: 'A + A\'B = A + B is the redundancy law; A(A + B) = A is the dual of absorption. They are different theorems and swapping their names leads to applying one where the other does not hold. Verify any identity you are unsure of on the four or eight rows it covers.',
},
{
  id: 'dm-set-b',
  title: '14. Problem Set: Counting, Sets and Probability',
  content: `## Problem Set A: counting, sets and probability

Work each one before reading on. Every answer here was confirmed by listing the
objects it counts.

### A1. Access codes

A code has five characters drawn from the 26 letters and 10 digits, with no
character repeated. How many codes exist?

Order matters and repetition is barred, so this is a permutation of 36 taken 5
at a time:

$$P(36,5) = 36 \\times 35 \\times 34 \\times 33 \\times 32 = 45\\,239\\,040$$

The same number comes out of $36!/31!$. With repeats allowed it would be
$36^{5} = 60\\,466\\,176$, about a third larger.

### A2. Low-weight patterns

How many four-bit patterns contain at most one 1?

$$\\binom{4}{0} + \\binom{4}{1} = 1 + 4 = 5$$

Listing all 16 patterns and filtering gives 5: 0000, 0001, 0010, 0100, 1000.
These are the patterns a distance-3 code must keep apart if it is to correct a
single error.

### A3. Distinguishable arrangements

How many distinguishable strings can be formed from the letters of RESISTOR?

Eight letters with two Rs and two Ss:

$$\\frac{8!}{2!\\,2!} = \\frac{40320}{4} = 10080$$

Generating all 40 320 permutations and removing duplicates leaves exactly
10 080.

### A4. Distributions with a floor

Seven identical capacitors go onto four distinct boards. How many distributions
if boards may be left empty, and how many if every board must receive at least
one?

$$\\binom{10}{3} = 120 \\qquad \\text{and} \\qquad \\binom{6}{3} = 20$$

Both were confirmed by listing the integer solutions of
$x_1 + x_2 + x_3 + x_4 = 7$ under each constraint.

### A5. A team with a floor

From seven electrical and five mechanical engineers, how many four-person teams
contain at least two electrical engineers?

$$\\binom{7}{2}\\binom{5}{2} + \\binom{7}{3}\\binom{5}{1} + \\binom{7}{4}\\binom{5}{0} = 210 + 175 + 35 = 420$$

out of $\\binom{12}{4} = 495$ possible teams. Filtering the full list of 495
gives 420. Counting the complement instead — teams with zero or one electrical
engineer — gives $495 - 5 - 70 = 420$, which is the faster route here and a
useful independent check either way.

### A6. Three tests, three overlaps

Of 200 boards, 90 fail a thermal test, 70 an electrical test and 50 a vibration
test; 30 fail the first two, 25 the first and third, 20 the last two, and 10
fail all three. How many pass everything?

$$90 + 70 + 50 - 30 - 25 - 20 + 10 = 145 \\quad \\Longrightarrow \\quad 200 - 145 = 55$$

Fifty-five pass. Building an explicit population with exactly these overlaps and
counting it returns 145 and 55.

### A7. Nothing back in the right place

Five connectors are reattached at random to five cables. What is the probability
that none returns to its own cable?

$$\\frac{D_5}{5!} = \\frac{44}{120} = 0.3667$$

Enumerating all 120 permutations and keeping the 44 with no fixed point confirms
the numerator.

### A8. Sharing a month

How many people must be in a room to guarantee that two share a birth month?

Thirteen. With twelve people, one arrangement puts each in a different month;
with thirteen, $\\lceil 13/12 \\rceil = 2$ forces a shared container. Note the
word **guarantee**: this is a worst-case statement, not a likelihood.

### A9. Even parity

How many eight-bit words carry an even number of ones, and what does that number
mean for error detection?

$$1 + 28 + 70 + 28 + 1 = 128 = \\tfrac{1}{2}\\,2^{8}$$

Exactly half, confirmed by enumerating all 256 words. A single parity bit
therefore splits the code space evenly and detects every odd-numbered burst of
bit errors while missing every even-numbered one.`,
},
{
  id: 'dm-set-c',
  title: '15. Problem Set: Recurrences, Graphs and Logic',
  content: `## Problem Set B: recurrences, graphs and logic

### B1. A recurrence with a unit root

Solve $a_n = 4a_{n-1} - 3a_{n-2}$ with $a_0 = 3$ and $a_1 = 5$.

$$r^{2} - 4r + 3 = (r-1)(r-3) = 0 \\quad \\Longrightarrow \\quad r = 1, \\; 3$$

$$a_n = A(1)^{n} + B(3)^{n} = A + B\\,3^{\\,n}$$

$$A + B = 3, \\qquad A + 3B = 5 \\quad \\Longrightarrow \\quad B = 1, \\; A = 2$$

$$a_n = 2 + 3^{\\,n}$$

Iterating gives 3, 5, 11, 29, 83, and the closed form gives the same five terms.
A root of exactly 1 contributes a constant, which is the discrete counterpart of
a pole at the origin: it neither grows nor decays, so the sequence approaches a
non-zero offset rather than zero.

### B2. Reading a sequence backwards

A sequence obeys a second-order recurrence and runs 1, 1, 0, −2, −4. What are
the characteristic roots?

From $a_2 = c_1 a_1 + c_2 a_0$ and $a_3 = c_1 a_2 + c_2 a_1$:

$$0 = c_1 + c_2, \\qquad -2 = 0 \\cdot c_1 + c_2 \\quad \\Longrightarrow \\quad c_2 = -2, \\; c_1 = 2$$

$$r^{2} - 2r + 2 = 0 \\quad \\Longrightarrow \\quad r = 1 \\pm i$$

The modulus is $\\sqrt{2}$, so the envelope grows by a factor of $\\sqrt{2}$ per
step; the argument is $\\pi/4$, so the sign pattern repeats every eight steps.
Continuing the sequence gives −4, 0, 8, 16, which is what the closed form
$2^{\\,n/2}\\cos(n\\pi/4)$ predicts.

### B3. A degree sequence that cannot exist

Can a network have five nodes each carrying exactly three connections?

No. The degree sum would be $5 \\times 3 = 15$, which is odd, and the handshake
lemma requires it to equal $2\\lvert E \\rvert$. Constructing all 1024 graphs on
five labelled vertices and checking each turns up no three-regular one, as the
lemma guarantees.

### B4. Which analysis is smaller

A planar network has 9 nodes and 14 branches. How many mesh equations and how
many node equations?

$$\\text{mesh: } E - V + 1 = 14 - 9 + 1 = 6, \\qquad \\text{node: } V - 1 = 8$$

Mesh analysis wins by two equations. Doing this count before writing anything
routinely saves a third of the work on a multi-node problem.

### B5. Spanning trees of a ring

How many spanning trees does a four-node ring have?

Removing any one of the four edges breaks the single cycle and leaves a path,
which is a tree; removing none leaves a cycle and removing two disconnects the
graph. So the answer is 4, and enumerating all $\\binom{4}{3} = 4$ three-edge
subsets confirms that every one of them is a spanning tree. In general
$C_n$ has $n$ spanning trees, which the matrix-tree theorem also returns.

### B6. Euler and Hamilton on the same graph

$K_4$: does it have an Euler trail, and does it have a Hamilton cycle?

Every degree is 3, so all four vertices are odd. That is more than two, so there
is **no** Euler trail of either kind. But $K_4$ certainly has Hamilton cycles —
3 of them up to direction, since $3!/2 = 3$. The two questions are independent,
and a graph can satisfy either, both or neither.

### B7. A Boolean simplification

Simplify $F = \\overline{A}\\,\\overline{B}C + \\overline{A}BC + A\\overline{B}\\,\\overline{C} + A\\overline{B}C$.

$$\\overline{A}C(\\overline{B} + B) + A\\overline{B}(\\overline{C} + C) = \\overline{A}C + A\\overline{B}$$

Four product terms become two. Checking the simplified form against the original
on all eight rows confirms they agree everywhere, which is the only acceptable
verification.

### B8. Consensus in disguise

Is the term $BC$ needed in $F = AB + \\overline{A}C + BC$?

No. If $B$ and $C$ are both 1 then either $A = 1$, making $AB$ true, or $A = 0$,
making $\\overline{A}C$ true, so $BC$ can never be the only term supplying a 1.
The expression reduces to $AB + \\overline{A}C$, and the eight-row truth table
confirms the two forms agree on every row. This is the consensus theorem, and
recognising it removes a gate from the implementation at no cost.

### B9. Counting functions

How many distinct Boolean functions are there of four variables, and why does
the answer matter?

$$2^{\\,2^{4}} = 2^{16} = 65\\,536$$

It matters because it rules out searching. Even at four inputs the space is far
too large to scan, so simplification has to proceed by structure — adjacency on
a Karnaugh map, or systematic prime-implicant generation — rather than by
inspection.`,
},
],
  keyTakeaways: [
    'Permutations P(n,r) count ordered arrangements; combinations C(n,r) count unordered selections.',
    'De Morgan laws for sets mirror Boolean algebra: (A ∪ B)\' = A\' ∩ B\'.',
    'Contrapositive of p→q is ¬q→¬p and is logically equivalent.',
    'Binomial theorem: (a+b)^n is the sum over k from 0 to n of C(n,k)·a^(n-k)·b^k, used in probability and series.',
    'Complete graph K_n has n(n-1)/2 edges; a tree with n nodes has n-1 edges.',
  ],
},

fee_analytic_geom: {
  topicId: 'fee_analytic_geom',
  title: 'Analytic Geometry',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Analytic geometry combines algebra and geometry to study curves, surfaces, and coordinate transformations. Distance formulas, conic sections, and polar/cylindrical coordinates are essential for electromagnetics and signal analysis.',
  sections: [
    {
      id: 'ag-lines-distance',
      title: '1. Lines, Distance, and Coordinate Systems',
      content: `## 1.1 Distance and Midpoint

- **Distance (2D)**: d = sqrt[($x_{2}$-$x_{1}$)² + ($y_{2}$-$y_{1}$)²]
- **Distance (3D)**: d = sqrt[($x_{2}$-$x_{1}$)² + ($y_{2}$-$y_{1}$)² + ($z_{2}$-$z_{1}$)²]
- **Midpoint**: (($x_{1}$+$x_{2}$)/2, ($y_{1}$+$y_{2}$)/2)

## 1.2 Lines

- **Slope**: m = ($y_{2}$-$y_{1}$)/($x_{2}$-$x_{1}$)
- **Point-slope form**: y - $y_{1}$ = m(x - $x_{1}$)
- **Slope-intercept**: y = mx + b
- **Parallel lines**: $m_{1}$ = $m_{2}$
- **Perpendicular lines**: $m_{1}$ · $m_{2}$ = -1

## 1.3 Coordinate Systems

| System | Coordinates | Use Case |
|---|---|---|
| Cartesian | (x, y, z) | General analysis |
| Polar | $(r, \\theta)$ | Phasor analysis, 2D symmetry |
| Cylindrical | $(r, \\theta, z)$ | Wire/cable fields |
| Spherical | $(r, \\theta, \\phi)$ | Antenna radiation patterns |

### Conversion: Polar ↔ Cartesian
- x = r·cosθ, y = r·sinθ
- r = sqrt(x²+y²), θ = arctan(y/x)`,
      examTip: 'Perpendicular lines satisfy m₁·m₂ = -1. This shows up when analyzing orthogonal signal components or checking if vectors are perpendicular. For the FE exam, know all four coordinate systems and when to use each.',
    },
    {
      id: 'ag-conics',
      title: '2. Conic Sections',
      content: `## 2.1 Standard Forms

Conic sections arise from slicing a cone at different angles:

| Conic | Standard Form | Key Property |
|---|---|---|
| Circle | $x^{2} + y^{2} = r^{2}$ | Constant radius |
| Ellipse | $x^{2}/a^{2} + y^{2}/b^{2} = 1$ | Sum of distances to foci = constant |
| Parabola | $y = ax^{2} + bx + c$ | Single focus and directrix |
| Hyperbola | $x^{2}/a^{2} - y^{2}/b^{2} = 1$ | Difference of distances to foci = constant |

### Circle Properties
- Center (h,k): (x-h)² + (y-k)² = r²
- Area = πr², Circumference = 2πr

### Ellipse Properties
- Semi-major axis a, semi-minor axis b (a > b)
- Eccentricity e = c/a where c = sqrt(a²-b²)
- Area = πab

### Parabola Properties
- Vertex form: y = a(x-h)² + k
- Focus at distance 1/(4a) from vertex
- Used in antenna dish design (parabolic reflector)

### Hyperbola Properties
- Asymptotes: y = ±(b/a)x for centered hyperbola
- Eccentricity e = c/a where c = sqrt(a²+b²), e > 1`,
      examTip: 'On the FE exam, identify the conic section from its equation: both variables squared with same sign and same coefficient = circle; same sign but different coefficients = ellipse; one variable not squared = parabola; opposite signs = hyperbola.',
    },
    {
      id: 'ag-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Lines and slopes

Through (2, 3) and (6, 11): slope m = (11-3)/(6-2) = 8/4 = **2**. Point-slope: y - 3 = 2(x - 2), so **$y = 2x - 1$**.

Perpendicular lines have slopes whose product is -1, so a perpendicular through (2,3) has slope **$-1/2$**: y = -x/2 + 4.

This is not abstract on this exam: a load line on a transistor characteristic is a straight line, and its slope is -1/R_load. Given a 10 V supply and a 2 kilohm load, the load line runs from (10 V, 0 mA) to (0 V, 5 mA) with slope -1/2000 per volt.

## 3.2 Circles and the completing-the-square step

x^2 + y^2 - 6x + 4y - 12 = 0. Group and complete:

$$(x^2 - 6x + 9) + (y^2 + 4y + 4) = 12 + 9 + 4$$

(x - 3)^2 + (y + 2)^2 = 25, so centre **(3, -2)** and radius **5**.

The same algebra turns up in Smith-chart work, where constant-resistance and constant-reactance loci are circles.

## 3.3 Conics you should recognise on sight

| Equation form | Conic | Where it appears |
|---|---|---|
| $(x-h)^2 + (y-k)^2 = r^2$ | circle | impedance loci, phasor magnitude |
| $x^2/a^2 + y^2/b^2 = 1$ | ellipse | Lissajous figures, elliptical polarisation |
| $y = ax^2 + bx + c$ | parabola | reflector antennas, power vs load curves |
| $x^2/a^2 - y^2/b^2 = 1$ | hyperbola | constant-power curves, hyperbolic navigation |

A power-vs-load-resistance curve is a parabola-like shape whose maximum you found by calculus in the differentiation chapter; recognising the shape tells you a maximum exists before you compute it.

## 3.4 Distance, midpoint, and 3D

Distance between (1, 2, 3) and (4, 6, 3): sqrt(9 + 16 + 0) = **5**. Midpoint: (2.5, 4, 3).

In three dimensions the plane ax + by + cz = d has normal vector (a, b, c). The distance from the origin to 2x + 3y + 6z = 14 is |d|/sqrt(a^2+b^2+c^2) = 14/sqrt(4+9+36) = 14/7 = **2**.

That normal-vector idea is the same one used for surface integrals in the electromagnetics chapters, where flux through a surface depends on the angle between the field and the normal.`,
      examTip: 'Recognise the conic from the signs of the squared terms before doing any algebra: both positive and equal gives a circle, both positive and unequal an ellipse, opposite signs a hyperbola, and only one squared term a parabola.',
      quiz: [
        {
          question: 'What is the centre of the circle x^2 + y^2 - 8x + 2y + 8 = 0?',
          options: ['(4, -1)', '(-4, 1)', '(8, -2)', '(-8, 2)'],
          correctIndex: 0,
          explanation: 'Complete the square: (x-4)^2 - 16 + (y+1)^2 - 1 + 8 = 0, giving (x-4)^2 + (y+1)^2 = 9. Centre (4, -1), radius 3. The signs flip when moving from the equation to the centre coordinates, which is the usual error.',
        },
        {
          question: 'A line has slope 3. What is the slope of a line perpendicular to it?',
          options: ['-1/3', '1/3', '-3', '3'],
          correctIndex: 0,
          explanation: 'Perpendicular slopes multiply to -1, so m = -1/3. Both the sign change and the reciprocal are needed - taking only the negative (-3) or only the reciprocal (1/3) gives a line that is not perpendicular.',
        },
        {
          question: 'What is the distance between the points (2, -1, 4) and (5, 3, 4)?',
          options: ['5', '7', '25', '3'],
          correctIndex: 0,
          explanation: 'd = sqrt(3^2 + 4^2 + 0^2) = sqrt(25) = 5. The z coordinates are equal so that term vanishes, reducing this to the familiar 3-4-5 right triangle in the xy plane.',
        },
      ],
    },
  {
    id: 'ag-depth',
    title: '4. Recognising a Conic From Its Equation',
    content: `## 4.1 One family, four curves
  
  The general second-degree equation Ax² + Cy² + Dx + Ey + F = 0 (with no xy
  term) produces every conic the exam uses. Which one you get is decided entirely
  by A and C:
  
  | Condition on A and C | Curve | Standard form |
  |---|---|---|
  | A = C, same sign | circle | $(x-h)^{2} + (y-k)^{2} = r^{2}$ |
  | A ≠ C, same sign | ellipse | $(x-h)^{2}/a^{2} + (y-k)^{2}/b^{2} = 1$ |
  | A or C is zero | parabola | $(x-h)^{2} = 4p(y-k)$ |
  | A and C opposite signs | hyperbola | $(x-h)^{2}/a^{2} - (y-k)^{2}/b^{2} = 1$ |
  
  ![The four conic sections drawn together from their standard forms: a circle of radius 2, an ellipse, a parabola and a hyperbola. Only the signs and the relative coefficients differ between them.](/courses/fe-ee/figures/math-conic-sections.svg)
  
  The one-line test: **look at the signs first, the coefficients second.**
  Opposite signs mean a hyperbola no matter what else is true; a missing squared
  term means a parabola; equal coefficients with the same sign mean a circle.
  
  ## 4.2 Completing the square, done once carefully
  
  Almost every conic question requires converting the general form to the standard
  form, and completing the square is the only tool needed.
  
  **Identify the curve of x² + y² − 6x + 4y − 12 = 0.**
  
  A = C = 1, same sign, so it is a circle. Group and complete:
  
  $$x^{2} - 6x + y^{2} + 4y = 12$$
  
  For x: half of −6 is −3, squared is 9. For y: half of 4 is 2, squared is 4. Add
  both to *each* side:
  
  $$(x^{2} - 6x + 9) + (y^{2} + 4y + 4) = 12 + 9 + 4$$
  
  $$(x - 3)^{2} + (y + 2)^{2} = 25$$
  
  So the centre is **$(3, -2)$** and the radius is **5**. Note the sign flip: the
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
  | Slope through two points | $m = (y_{2} - y_{1})/(x_{2} - x_{1})$ |
  | Point-slope form | $y - y_{1} = m(x - x_{1})$ |
  | Slope-intercept form | $y = mx + b$ |
  | Distance between points | $d = \\sqrt{(x_{2}-x_{1})^{2} + (y_{2}-y_{1})^{2}}$ |
  | Midpoint | $((x_{1}+x_{2})/2, (y_{1}+y_{2})/2)$ |
  | Distance from point to line Ax+By+C=0 | $\\lvert Ax_{0}+By_{0}+C\\rvert /\\sqrt{A^{2}+B^{2}}$ |
  
  Two relationships between lines are asked directly:
  
  - **Parallel** lines have equal slopes: $m_{1}$ = $m_{2}$.
  - **Perpendicular** lines have slopes whose product is −1: m₁m₂ = −1, so
    $$m_{2} = -1/m_{1}$$.
  
  A line of slope 2 is perpendicular to one of slope −1/2, not −2. The negative
  *reciprocal*, not the negative, is the rule, and the distractor is always there.
  
  ## 4.4 Worked: a load line, which is this topic in disguise
  
  A 12 V source with 4 kΩ series resistance drives a nonlinear device. The load
  line is the I-V relation the *circuit* imposes: by KVL, 12 = 4000·I + V, so
  
  $$I = (12 - V)/4000$$
  
  Two points fix the line. At V = 0, I = 12/4000 = **3 mA** (the short-circuit
  current). At I = 0, V = **12 V** (the open-circuit voltage). The slope is
  −1/4000 A/V, i.e. **$-0.25\\ \\mathrm{mA/V}$** — negative, and its magnitude is the reciprocal
  of the resistance.
  
  That is a straight line through (0 V, 3 mA) and (12 V, 0 mA), and the operating
  point is where it crosses the device's own curve. The mathematics is
  point-slope; the physics is Thevenin. Recognising that a "graphical analysis"
  question is really an intercepts question is what makes it quick.
  
  ## 4.5 Three-dimensional distance, and where it appears
  
  Extending the distance formula to three dimensions adds one term:
  d = √((Δx)² + (Δy)² + (Δz)²). This appears in electromagnetics for the
  separation between charges in Coulomb's law, and in vector analysis as the
  magnitude of a vector — $\\lvert \\mathbf{A} \\rvert = \\sqrt{A_{x}^{2} + A_{y}^{2} + A_{z}^{2}}$
  is the distance formula from the origin, not a separate rule to learn.`,
    examTip: 'Completing the square flips the sign: (y + 2)^2 means the centre coordinate is MINUS 2. Write the standard form as (x - h)^2 + (y - k)^2 and read h and k off it directly rather than reading the numbers you see in the equation.',
    importantNote: 'Perpendicular slopes are negative RECIPROCALS, m2 = -1/m1, not negatives. A line of slope 2 is perpendicular to one of slope -0.5. Every FE question on this offers -2 as a distractor.',
  },
{
  id: 'ag-set',
  title: '5. Problem Set: Lines, Circles and Intercepts',
  content: `## 5.1 Identify the conic

$$4x^{2} + 9y^{2} - 16x + 18y - 11 = 0$$

A = 4 and C = 9 are unequal but the same sign, so this is an **ellipse**.
Completing the square in both variables:

$$4(x^{2} - 4x) + 9(y^{2} + 2y) = 11$$
$$4(x^{2} - 4x + 4) + 9(y^{2} + 2y + 1) = 11 + 16 + 9$$

Note what was added to the right: 4 × 4 = 16 and 9 × 1 = 9, because the
completed terms sit inside the coefficients. Dropping the multiplier here is the
usual error.

$$4(x - 2)^{2} + 9(y + 1)^{2} = 36 \\to (x-2)^{2}/9 + (y+1)^{2}/4 = 1$$

Centre **$(2, -1)$**, semi-axes a = 3 along x and b = 2 along y.

## 5.2 Perpendicular through a point

Find the line perpendicular to 3x + 4y = 12 passing through (6, 1).

Rearranging: y = −(3/4)x + 3, so m = −3/4. The perpendicular slope is the
negative reciprocal, **$+4/3$**. Point-slope:

$$y - 1 = (4/3)(x - 6) \\to y = (4/3)x - 7$$

Check perpendicularity: (−3/4)(4/3) = −1 ✓.

## 5.3 Distance from a point to a line

How far is (6, 1) from 3x + 4y − 12 = 0?

$$d = \\lvert 3(6) + 4(1) - 12 \\rvert / \\sqrt{3^{2} + 4^{2}} = \\lvert 18 + 4 - 12 \\rvert/5 = 10/5 = 2.0$$

The absolute value matters: distance is never negative, and omitting it on a
point below the line yields −2, which is offered as a choice.

## 5.4 Two intercepts, one load line

A source with V_oc = 20 V and R_th = 500 Ω drives a load. Sketch the load line.

Current intercept (V = 0): I = 20/500 = **40 mA**
Voltage intercept (I = 0): V = **20 V**
Slope: −1/500 A/V = −2 mA/V

Any operating point must lie on the segment between those intercepts. If a
device curve crosses at 12 V, the current there is (20 − 12)/500 = 16 mA, and
the power delivered to the device is 12 × 0.016 = **192 mW**.`,
},
{
  id: 'ag-errors',
  title: '6. Where Marks Are Lost',
  content: `## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Reading the centre off the raw equation | (y + 2)² reported as k = +2 | the standard form is (y − k)², so the sign flips |
| Forgetting the coefficient when completing the square | adding 4 rather than 4×4 | whatever you add inside the bracket is multiplied by the coefficient outside |
| Negating instead of taking the negative reciprocal | slope 2 paired with −2 | perpendicular slopes multiply to −1 |
| Dropping the absolute value in the distance formula | a negative distance | distance is a magnitude |

Identifying the conic **before** any algebra also prevents wasted effort: the
signs of A and C settle it in one glance, and knowing you are looking at a
hyperbola stops you completing the square toward a circle that was never there.

Finally, sketch before solving. A rough sketch of the curve and the point takes
ten seconds and immediately rules out answers of the wrong sign or magnitude -
particularly for distance questions, where the eye is a perfectly good check on
whether an answer of 2 or 20 is plausible.`,
},
{
  id: 'ag-distance-section',
  title: '7. Distance, Midpoint and the Section Formula, Derived',
  content: `## 7.1 The distance formula is Pythagoras with axes attached

Take two points $P_1 = (x_1, y_1)$ and $P_2 = (x_2, y_2)$. Drop a horizontal
segment from $P_1$ and a vertical segment from $P_2$; they meet at
$(x_2, y_1)$, and the three points form a right triangle whose legs are
$\\lvert x_2 - x_1 \\rvert$ and $\\lvert y_2 - y_1 \\rvert$. Pythagoras finishes
it:

$$d = \\sqrt{(x_2 - x_1)^{2} + (y_2 - y_1)^{2}}$$

Nothing else is going on. The squares make the absolute values unnecessary,
which is why the formula does not care which point you call first. In three
dimensions the same construction runs twice — once in a horizontal plane, once
vertically — and the terms simply accumulate:

$$d = \\sqrt{(x_2 - x_1)^{2} + (y_2 - y_1)^{2} + (z_2 - z_1)^{2}}$$

For $(1, 2, 3)$ and $(4, 6, 3)$ that is $\\sqrt{9 + 16 + 0} = 5$; the $z$ terms
vanish and the familiar 3-4-5 triangle is left lying in a horizontal plane.

## 7.2 The section formula, and the midpoint as its special case

A point $P$ divides the segment from $A$ to $B$ **internally in the ratio
$m : n$** when $AP : PB = m : n$. Drop perpendiculars from $A$, $P$ and $B$ to
the $x$-axis. The two right triangles formed — one on $AP$, one on $PB$ — are
similar, because their corresponding sides are parallel. Similar triangles give
proportional legs, so the horizontal run is split in the same ratio as the
segment itself:

$$\\frac{x_P - x_A}{x_B - x_P} = \\frac{m}{n}$$

Solving for $x_P$, and running the identical argument vertically:

$$P = \\left( \\frac{n x_A + m x_B}{m+n}, \\; \\frac{n y_A + m y_B}{m+n} \\right)$$

Note which weight lands on which endpoint. The **far** endpoint $B$ carries the
weight $m$ of the **near** segment $AP$. Getting that backwards is the standard
error, and it is caught instantly by a sanity check: if $m$ is small the point
should sit close to $A$.

Setting $m = n$ gives the midpoint, where the weights are equal:

$$M = \\left( \\frac{x_A + x_B}{2}, \\; \\frac{y_A + y_B}{2} \\right)$$

## 7.3 Worked example: dividing a segment in a given ratio

Find the point dividing the segment from $A = (1, 2)$ to $B = (9, 14)$ in the
ratio $2 : 3$, and confirm it.

$$x_P = \\frac{3(1) + 2(9)}{5} = \\frac{21}{5} = 4.2, \\qquad y_P = \\frac{3(2) + 2(14)}{5} = \\frac{34}{5} = 6.8$$

Confirm by measuring rather than by re-deriving. The whole segment has length

$$\\lvert AB \\rvert = \\sqrt{8^{2} + 12^{2}} = \\sqrt{208} = 14.4222$$

and the first piece has length

$$\\lvert AP \\rvert = \\sqrt{3.2^{2} + 4.8^{2}} = \\sqrt{10.24 + 23.04} = \\sqrt{33.28} = 5.7689$$

The ratio $5.7689 / 14.4222 = 0.4 = 2/5$, exactly as required. The midpoint of
the same segment is $(5, 8)$, which is the $m = n$ case and sits, correctly,
beyond $P$.

![A line segment from the point one comma two to the point nine comma fourteen, with the dividing point at four point two comma six point eight marked along with the midpoint at five comma eight. Dashed horizontal and vertical guides form two similar right triangles whose legs are three point two by four point eight and four point eight by seven point two.](/courses/fe-ee/figures/math5-ag-section-formula.svg)

## 7.4 Worked example: an external division, and why the sign flips

Where is the point $Q$ on line $AB$ with $AQ : QB = 3 : 1$ measured
**externally**, meaning $Q$ lies beyond $B$?

External division is internal division with $n$ replaced by $-n$:

$$Q = \\left( \\frac{-n x_A + m x_B}{m-n}, \\; \\frac{-n y_A + m y_B}{m-n} \\right)$$

$$Q = \\left( \\frac{-1(1) + 3(9)}{2}, \\; \\frac{-1(2) + 3(14)}{2} \\right) = (13, 20)$$

Check: $\\lvert AQ \\rvert = \\sqrt{12^{2} + 18^{2}} = \\sqrt{468} = 21.6333$ and
$\\lvert QB \\rvert = \\sqrt{4^{2} + 6^{2}} = \\sqrt{52} = 7.2111$, whose ratio is
3.0000. The point is outside the segment, as an external division must be, and
the denominator $m - n$ is what puts it there.

## 7.5 Worked example: a centroid as three section formulas

The centroid of a triangle with vertices $A$, $B$, $C$ is the average of the
three position vectors:

$$G = \\left( \\frac{x_A + x_B + x_C}{3}, \\; \\frac{y_A + y_B + y_C}{3} \\right)$$

For $A = (0,0)$, $B = (6,0)$, $C = (3,9)$ that gives $G = (3, 3)$. The reason
the plain average works is the section formula applied twice: the centroid
divides each median in the ratio $2 : 1$ from the vertex. The midpoint of $BC$
is $(4.5, 4.5)$, and dividing $A \\to (4.5, 4.5)$ in the ratio $2 : 1$ gives

$$\\left( \\frac{1(0) + 2(4.5)}{3}, \\; \\frac{1(0) + 2(4.5)}{3} \\right) = (3, 3)$$

which matches. Centroid questions appear in statics as centres of mass of thin
plates, and in signal work as the mean of a discrete distribution — the same
weighted average with different names on the weights.

| Quantity | Formula |
|---|---|
| distance, 2D | $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2}}$ |
| distance, 3D | $\\sqrt{(\\Delta x)^{2} + (\\Delta y)^{2} + (\\Delta z)^{2}}$ |
| midpoint | $\\left(\\tfrac{x_1+x_2}{2}, \\tfrac{y_1+y_2}{2}\\right)$ |
| internal division $m:n$ | $\\left(\\tfrac{n x_1 + m x_2}{m+n}, \\tfrac{n y_1 + m y_2}{m+n}\\right)$ |
| external division $m:n$ | $\\left(\\tfrac{m x_2 - n x_1}{m-n}, \\tfrac{m y_2 - n y_1}{m-n}\\right)$ |
| centroid of three points | $\\left(\\tfrac{x_1+x_2+x_3}{3}, \\tfrac{y_1+y_2+y_3}{3}\\right)$ |`,
  examTip: 'In the section formula the weight m belongs to the far endpoint. Check the answer against intuition before moving on: a ratio of 1:4 must land close to the first point, and a ratio of 4:1 close to the second. That single glance catches the swapped-weights error, which is the one the distractors are built around.',
  importantNote: 'External division uses m - n in the denominator, so the point falls outside the segment. If a question says "extended beyond B" or "produced to", it wants the external form, and the internal formula will return a point in the wrong place entirely.',
},
{
  id: 'ag-line-forms',
  title: '8. Lines in Every Form, and the Conversions Between Them',
  content: `## 8.1 One line, six ways to write it

Slope is the rate at which the line climbs, defined as the rise over the run
between any two of its points:

$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

That the answer does not depend on which two points you pick is exactly the
similar-triangles argument from the previous section. A vertical line has an
undefined slope, and every form below except the general one breaks on it,
which is why the general form is the safe one to carry.

| Form | Equation | Best when |
|---|---|---|
| point-slope | $y - y_1 = m(x - x_1)$ | a point and a direction are given |
| slope-intercept | $y = mx + b$ | the $y$-intercept matters |
| two-point | $y - y_1 = \\dfrac{y_2-y_1}{x_2-x_1}(x - x_1)$ | two points are given |
| intercept | $\\dfrac{x}{a} + \\dfrac{y}{b} = 1$ | both intercepts matter |
| general | $Ax + By + C = 0$ | always; handles vertical lines |
| normal | $x\\cos\\alpha + y\\sin\\alpha = p$ | the perpendicular from the origin matters |

Converting between them is arithmetic, not insight. From the general form,
$m = -A/B$ and the intercepts are $-C/A$ and $-C/B$. The normal form comes from
dividing the general form by $\\pm\\sqrt{A^{2}+B^{2}}$, choosing the sign that
makes the constant positive; then $p$ is the distance from the origin to the
line and $\\alpha$ is the direction of that perpendicular.

## 8.2 Parallel and perpendicular

Two lines are parallel when their slopes are equal. They are perpendicular when

$$m_1 m_2 = -1, \\qquad \\text{equivalently} \\qquad m_2 = -\\frac{1}{m_1}$$

The reason is a rotation. Turning the direction vector $(1, m_1)$ through a
right angle gives $(-m_1, 1)$, whose slope is $-1/m_1$. In general form the
test is cleaner and survives vertical lines: $A_1x + B_1y + C_1 = 0$ and
$A_2x + B_2y + C_2 = 0$ are perpendicular exactly when

$$A_1A_2 + B_1B_2 = 0$$

which is the dot product of the two normal vectors. A line of slope 2 is
perpendicular to one of slope $-0.5$, not to one of slope $-2$; the negative
**reciprocal** is the rule and the plain negative is the distractor.

## 8.3 The perpendicular distance formula, derived

How far is $P_0 = (x_0, y_0)$ from the line $Ax + By + C = 0$?

The vector $\\mathbf{n} = (A, B)$ is normal to the line: if $P_1$ and $P_2$ both
satisfy the equation then subtracting gives
$A(x_2-x_1) + B(y_2-y_1) = 0$, which says $\\mathbf{n}$ is perpendicular to
every direction along the line. Pick any point $P_1$ on the line. The distance
from $P_0$ to the line is the length of the projection of
$P_0 - P_1$ onto the unit normal:

$$d = \\frac{\\lvert \\mathbf{n} \\cdot (P_0 - P_1) \\rvert}{\\lvert \\mathbf{n} \\rvert} = \\frac{\\lvert A(x_0-x_1) + B(y_0-y_1) \\rvert}{\\sqrt{A^{2}+B^{2}}}$$

Because $P_1$ is on the line, $Ax_1 + By_1 = -C$, and substituting collapses the
numerator:

$$d = \\frac{\\lvert Ax_0 + By_0 + C \\rvert}{\\sqrt{A^{2}+B^{2}}}$$

The absolute value is not decoration. Without it the expression is a **signed**
quantity that tells you which side of the line the point is on, which is
occasionally what you want and never what a distance question wants.

## 8.4 Worked example: distance, foot of the perpendicular, and a check

How far is $(7, 3)$ from $4x - 3y - 5 = 0$, and where does the perpendicular
meet the line?

$$d = \\frac{\\lvert 4(7) - 3(3) - 5 \\rvert}{\\sqrt{16 + 9}} = \\frac{\\lvert 28 - 9 - 5 \\rvert}{5} = \\frac{14}{5} = 2.8$$

The foot is reached by stepping from $P_0$ a distance $d$ along the unit normal,
in the direction that reduces $Ax + By + C$ to zero:

$$F = \\left(7 - 2.8\\cdot\\tfrac{4}{5}, \\; 3 - 2.8\\cdot\\tfrac{-3}{5}\\right) = (4.76, \\; 4.68)$$

Check by substitution: $4(4.76) - 3(4.68) - 5 = 19.04 - 14.04 - 5 = 0$, so $F$
really is on the line. A second, independent check: slide a point along the line
and measure its distance to $(7,3)$ at thousands of positions; the smallest
value found is 2.8, occurring at $x = 4.76$.

![Two stacked panels. The upper panel shows the line four x minus three y minus five equals zero, the point seven comma three, and the perpendicular segment of length two point eight meeting the line at four point seven six comma four point six eight. The lower panel plots the distance from that point to a point sliding along the line, whose minimum touches a dashed line at two point eight.](/courses/fe-ee/figures/math5-ag-point-line.svg)

## 8.5 The angle between two lines

If two lines have slopes $m_1$ and $m_2$, the angle $\\theta$ between them
satisfies

$$\\tan\\theta = \\left\\lvert \\frac{m_2 - m_1}{1 + m_1m_2} \\right\\rvert$$

This is the tangent subtraction identity in disguise: each slope is the tangent
of the line's inclination, and the angle between them is the difference of the
inclinations. The denominator vanishing is exactly the perpendicular case, where
$\\tan\\theta$ is undefined because $\\theta = 90^{\\circ}$.

## 8.6 Worked example: an angle, computed twice

Find the angle between $y = 2x + 1$ and $y = -\\tfrac{1}{3}x + 4$.

$$\\tan\\theta = \\left\\lvert \\frac{-\\tfrac{1}{3} - 2}{1 + 2\\left(-\\tfrac{1}{3}\\right)} \\right\\rvert = \\left\\lvert \\frac{-7/3}{1/3} \\right\\rvert = 7 \\quad \\Longrightarrow \\quad \\theta = 81.8699^{\\circ}$$

Confirm with direction vectors and a dot product, which uses none of the same
algebra. The lines run along $(1, 2)$ and $(3, -1)$:

$$\\cos\\theta = \\frac{\\lvert (1)(3) + (2)(-1) \\rvert}{\\sqrt{5}\\,\\sqrt{10}} = \\frac{1}{\\sqrt{50}} = 0.141421$$

$$\\theta = \\arccos(0.141421) = 81.8699^{\\circ}$$

The two routes agree to four decimal places.

## 8.7 Worked example: a load line is this section, applied

A source of 12 V with 4 kΩ of series resistance drives a nonlinear device. By
Kirchhoff's voltage law the circuit imposes

$$12 = 4000\\,I + V \\quad \\Longrightarrow \\quad I = \\frac{12 - V}{4000}$$

which is a straight line in the $I$–$V$ plane. Two intercepts fix it. At
$V = 0$, $I = 12/4000 = 3\\ \\mathrm{mA}$, the short-circuit current. At
$I = 0$, $V = 12\\ \\mathrm{V}$, the open-circuit voltage. The slope is
$-1/4000\\ \\mathrm{A/V}$, that is $-0.25\\ \\mathrm{mA/V}$ — negative, with
magnitude the reciprocal of the resistance.

The operating point is where this line crosses the device's own curve. If the
device curve is met at $V = 7.2\\ \\mathrm{V}$ then the current is
$I = 4.8/4000 = 1.2\\ \\mathrm{mA}$ and the device dissipates
$7.2 \\times 0.0012 = 8.64\\ \\mathrm{mW}$. A "graphical analysis" question
is an intercepts question, and
recognising that is what makes it quick.`,
  examTip: 'Carry the general form Ax + By + C = 0. It handles vertical lines, it feeds the distance formula directly, and the perpendicular test A1A2 + B1B2 = 0 needs no reciprocals. Convert to slope-intercept only when the question actually asks for a slope or an intercept.',
  importantNote: 'The distance formula needs the line written with zero on the right. For 3x + 4y = 12 the constant is C = -12, not +12. Rearranging first, every time, removes the most common sign error in this topic.',
},
{
  id: 'ag-circle-detail',
  title: '9. The Circle: Definition, General Form, Chords and Tangents',
  content: `## 9.1 From the definition to the equation

A circle is the set of points at a fixed distance $r$ from a fixed centre
$(h,k)$. Writing that definition with the distance formula and squaring both
sides gives the standard form immediately:

$$\\sqrt{(x-h)^{2} + (y-k)^{2}} = r \\quad \\Longrightarrow \\quad (x-h)^{2} + (y-k)^{2} = r^{2}$$

Expanding produces the general second-degree form with equal coefficients on the
squared terms and no cross term:

$$x^{2} + y^{2} + Dx + Ey + F = 0, \\qquad D = -2h, \\quad E = -2k, \\quad F = h^{2}+k^{2}-r^{2}$$

Reading backwards, the centre is $(-D/2, -E/2)$ and

$$r = \\sqrt{\\frac{D^{2}+E^{2}}{4} - F}$$

That radical carries a real condition. If the quantity under it is positive the
equation describes a genuine circle; if it is zero the "circle" is the single
point $(h,k)$; and if it is negative there are no real points at all. An exam
question that hands you $x^{2}+y^{2}-2x+4y+10 = 0$ is testing precisely that:
$1 + 4 - 10 = -5 < 0$, so no real locus exists.

## 9.2 Completing the square, done once carefully

$$x^{2} + y^{2} - 6x + 4y - 12 = 0$$

Group the variables and move the constant across:

$$(x^{2} - 6x) + (y^{2} + 4y) = 12$$

Half of $-6$ is $-3$ and its square is 9; half of $4$ is 2 and its square is 4.
Add both to **each** side:

$$(x^{2} - 6x + 9) + (y^{2} + 4y + 4) = 12 + 9 + 4$$
$$(x-3)^{2} + (y+2)^{2} = 25$$

The centre is $(3, -2)$ and the radius is 5. The sign flip is the trap: the
equation shows $(y+2)^{2}$ and the standard form is $(y-k)^{2}$, so $k = -2$.

Confirm it on the curve rather than in the algebra. Sampling four thousand
points of the form $(3 + 5\\cos t, \\, -2 + 5\\sin t)$ and substituting each into
the original equation gives zero to fourteen decimal places at every one of
them.

## 9.3 Worked example: a circle through three points

Find the circle through $(0,0)$, $(6,0)$ and $(0,8)$.

Substituting $(0,0)$ into the general form gives $F = 0$ at once. Substituting
$(6,0)$ gives $36 + 6D = 0$, so $D = -6$. Substituting $(0,8)$ gives
$64 + 8E = 0$, so $E = -8$. Hence

$$x^{2} + y^{2} - 6x - 8y = 0 \\quad \\Longrightarrow \\quad (x-3)^{2} + (y-4)^{2} = 25$$

Centre $(3, 4)$, radius 5. All three original points satisfy the standard form
exactly, and the geometry agrees: two of the given points lie on the axes, the
angle at the origin is a right angle, and the hypotenuse from $(6,0)$ to $(0,8)$
has length 10 — so it is a diameter, and its midpoint $(3,4)$ must be the
centre. Two independent routes, one answer.

## 9.4 Worked example: where a line meets a circle

Find the intersections of $x^{2}+y^{2} = 25$ with $y = x + 1$, and the length of
the chord they cut.

Substitute and solve:

$$x^{2} + (x+1)^{2} = 25 \\quad \\Longrightarrow \\quad 2x^{2} + 2x - 24 = 0 \\quad \\Longrightarrow \\quad x^{2} + x - 12 = 0$$

$$(x-3)(x+4) = 0 \\quad \\Longrightarrow \\quad x = 3, \\; -4$$

The points are $(3, 4)$ and $(-4, -3)$, and both satisfy $x^{2}+y^{2} = 25$
exactly. The chord length is

$$\\sqrt{7^{2} + 7^{2}} = 7\\sqrt{2} = 9.8995$$

Confirm it a second way, without the endpoints. The perpendicular distance from
the centre to the line $x - y + 1 = 0$ is

$$p = \\frac{\\lvert 0 - 0 + 1 \\rvert}{\\sqrt{2}} = 0.7071$$

and a chord at distance $p$ from the centre of a circle of radius $r$ has length

$$2\\sqrt{r^{2} - p^{2}} = 2\\sqrt{25 - 0.5} = 2\\sqrt{24.5} = 9.8995$$

The two agree. That second formula is the fast route when a question asks only
for the chord length, and its discriminant tells you the intersection type
before you solve anything: $p < r$ gives two points, $p = r$ gives tangency, and
$p > r$ gives none.

## 9.5 Worked example: tangents from an outside point

From $(8, 6)$, how long is the tangent to $x^{2}+y^{2} = 25$?

The tangent, the radius to the point of tangency, and the line from the centre
to the external point form a right triangle, with the radius perpendicular to
the tangent. So

$$L = \\sqrt{d^{2} - r^{2}} = \\sqrt{8^{2}+6^{2}-25} = \\sqrt{75} = 5\\sqrt{3} = 8.6603$$

The tangent points themselves lie on the **chord of contact**
$8x + 6y = 25$ together with the circle. Solving that pair gives
$(-0.5981, \\, 4.9641)$ and $(4.5981, \\, -1.9641)$. Each was checked
three ways: it satisfies the circle equation, it lies exactly $8.6603$ from
$(8,6)$, and the radius to it is perpendicular to the tangent line — the dot
product of the two directions is zero to nine decimals.

![A circle of radius five centred at the origin, cut by the secant y equals x plus one at the points three comma four and minus four comma minus three, with the two tangent lines drawn from the external point eight comma six to their points of tangency and dashed radii showing the right angles.](/courses/fe-ee/figures/math5-ag-circle-chord-tangent.svg)

## 9.6 Where circles turn up in electrical work

Constant-resistance and constant-reactance loci on the Smith chart are circles,
and finding their centres is the completing-the-square step above. The locus of
a phasor of constant magnitude is a circle in the complex plane. The Nyquist
plot of a first-order transfer function is a semicircle. In every case the
useful move is the same: get to $(x-h)^{2} + (y-k)^{2} = r^{2}$, read off the
centre and the radius, and stop.`,
  examTip: 'Completing the square flips the sign. Write the standard form as (x - h)^2 + (y - k)^2 and read h and k from it, rather than lifting the numbers you see in the general equation. And check the radical: if D^2/4 + E^2/4 - F is negative there is no real circle, which is a legitimate exam answer.',
  importantNote: 'For a line and a circle, compare the centre-to-line distance p with the radius r before solving. p < r gives two intersections, p = r gives exactly one, and p > r gives none. That single comparison answers many questions without any substitution at all.',
},
{
  id: 'ag-conic-definitions',
  title: '10. Conics by Focus, Directrix and Eccentricity',
  content: `## 10.1 One definition covers all of them

Fix a point $F$ (the **focus**), a line $\\ell$ not through it (the
**directrix**), and a positive number $e$ (the **eccentricity**). The conic is
the set of points $P$ for which

$$\\frac{\\lvert PF \\rvert}{\\operatorname{dist}(P, \\ell)} = e$$

That is the whole family. The value of $e$ decides which curve you get:

| Eccentricity | Curve | Relation among $a$, $b$, $c$ |
|---|---|---|
| $e = 0$ | circle | $b = a$, $c = 0$ |
| $0 < e < 1$ | ellipse | $b^{2} = a^{2} - c^{2}$, $c = ae$ |
| $e = 1$ | parabola | no centre; $c$ and $a$ undefined separately |
| $e > 1$ | hyperbola | $b^{2} = c^{2} - a^{2}$, $c = ae$ |

The alternative definitions taught first — constant sum of focal distances for
an ellipse, constant difference for a hyperbola — are consequences of this one,
not separate facts.

## 10.2 Deriving the ellipse from focus and directrix

Put the focus at $(c, 0)$ and the directrix at $x = a/e$, with $0 < e < 1$, and
write the defining ratio:

$$\\sqrt{(x-c)^{2} + y^{2}} = e\\left(\\frac{a}{e} - x\\right)$$

Square both sides and expand:

$$x^{2} - 2cx + c^{2} + y^{2} = a^{2} - 2aex + e^{2}x^{2}$$

Now use $c = ae$, so $2cx = 2aex$ and those terms cancel:

$$x^{2}(1 - e^{2}) + y^{2} = a^{2} - c^{2} = a^{2}(1 - e^{2})$$

Dividing through by $a^{2}(1-e^{2})$ and writing $b^{2} = a^{2}(1-e^{2})$:

$$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$$

Every standard form in this chapter comes out of the same three steps: write the
ratio, square, substitute $c = ae$.

## 10.3 The focal-sum property falls out

For a point on that ellipse, the distance to the right focus is

$$r_2 = e\\left(\\frac{a}{e} - x\\right) = a - ex$$

and by the mirror-image argument on the left focus and left directrix,
$r_1 = a + ex$. Adding:

$$r_1 + r_2 = 2a$$

The sum of the focal distances is constant, and the constant is the major axis
length. This was checked on four thousand points of
$x^{2}/25 + y^{2}/16 = 1$, where $a = 5$, $b = 4$ and $c = 3$: the sum came out
as 10 at every sampled point, to within $2 \\times 10^{-15}$. The
focus-directrix ratio came out as 0.6 at every point as well, for both
focus-directrix pairs.

![An ellipse with semi-axes five and four, drawn with both foci marked, the directrix x equals twenty-five thirds shown as a dashed vertical line, and four sampled points each joined to the right focus and to the directrix so the ratio of the two lengths can be compared. A grey bar at the focus marks the latus rectum of length six point four.](/courses/fe-ee/figures/math5-ag-focus-directrix.svg)

## 10.4 The parabola: the case $e = 1$

With $e = 1$ the ratio says the point is equidistant from focus and directrix.
Put the focus at $(p, 0)$ and the directrix at $x = -p$:

$$\\sqrt{(x-p)^{2}+y^{2}} = x + p$$

$$x^{2} - 2px + p^{2} + y^{2} = x^{2} + 2px + p^{2} \\quad \\Longrightarrow \\quad y^{2} = 4px$$

There is no $a$ or $c$ to relate, because a parabola has no centre and no second
focus — the second focus has gone to infinity, which is the geometric content of
$e = 1$.

For $y^{2} = 12x$ we read $4p = 12$, so $p = 3$: the focus is $(3, 0)$ and the
directrix is $x = -3$. Sampling four thousand points along the curve and
comparing the distance to $(3,0)$ with the distance to the line $x = -3$ gives
agreement to $10^{-14}$ everywhere.

## 10.5 The hyperbola: the case $e > 1$

Repeating the derivation with $e > 1$ makes $1 - e^{2}$ negative, and writing
$b^{2} = a^{2}(e^{2}-1) = c^{2}-a^{2}$ turns the plus into a minus:

$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$$

The focal relation becomes a **difference**:

$$\\lvert r_1 - r_2 \\rvert = 2a$$

On $x^{2}/9 - y^{2}/16 = 1$, where $a = 3$, $b = 4$ and $c = 5$, sampling four
thousand points of the right branch gives $r_1 - r_2 = 6$ at every one of them,
and the focus-directrix ratio comes out as $5/3$ at every one of them.

## 10.6 Worked example: reading a conic and its constants

Identify $9x^{2} + 25y^{2} = 225$ and find everything about it.

Divide by 225:

$$\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$$

Both squares are positive with different denominators, so it is an ellipse. The
larger denominator sits under $x^{2}$, so the major axis is horizontal with
$a = 5$ and $b = 3$:

$$c = \\sqrt{a^{2}-b^{2}} = \\sqrt{25-9} = 4, \\qquad e = \\frac{c}{a} = 0.8$$

Foci at $(\\pm 4, 0)$, vertices at $(\\pm 5, 0)$, co-vertices at $(0, \\pm 3)$,
directrices at $x = \\pm a/e = \\pm 6.25$, and latus rectum
$2b^{2}/a = 18/5 = 3.6$. Sampling the curve confirms the focal sum is $2a = 10$
everywhere and the focus-directrix ratio is 0.8 everywhere.

## 10.7 Worked example: which denominator is $a^{2}$

Identify $25x^{2} - 144y^{2} = 3600$.

$$\\frac{x^{2}}{144} - \\frac{y^{2}}{25} = 1$$

Opposite signs, so a hyperbola. For a hyperbola $a^{2}$ is always the
denominator under the **positive** term, whether or not it is the larger one —
this differs from the ellipse rule and is the single most-missed detail in the
topic. So $a = 12$, $b = 5$, and

$$c = \\sqrt{a^{2}+b^{2}} = \\sqrt{144+25} = 13, \\qquad e = \\frac{13}{12} = 1.0833$$

Vertices $(\\pm 12, 0)$, foci $(\\pm 13, 0)$, asymptotes $y = \\pm\\tfrac{5}{12}x$,
latus rectum $2b^{2}/a = 50/12 = 25/6 = 4.1667$. Sampling the right branch
confirms the focal difference is $2a = 24$ at every point.

## 10.8 Worked example: a parabola opening downward

Identify $x^{2} = -8y$.

The squared variable is $x$, so the axis is vertical; the negative sign means it
opens downward. Matching against $x^{2} = -4py$ gives $4p = 8$, so $p = 2$: the
focus is $(0, -2)$, the directrix is $y = 2$, and the latus rectum is
$4p = 8$. Sampling the curve and comparing the distance to $(0,-2)$ with the
distance to the line $y = 2$ gives agreement to $10^{-14}$ at every point, which
is the defining property doing the confirming.`,
  examTip: 'For an ellipse, a-squared is the LARGER denominator and it tells you which axis is major. For a hyperbola, a-squared is the denominator under the POSITIVE term regardless of size. Mixing those two rules produces foci on the wrong axis, and every conic question offers that answer.',
  importantNote: 'c is measured from the CENTRE to a focus, not from a vertex. For the ellipse x^2/25 + y^2/16 = 1 the foci are at (±3, 0), which is 2 units inside the vertices at (±5, 0). Adding a and c instead of comparing them is a common slip.',
},
{
  id: 'ag-conic-properties',
  title: '11. Foci, Vertices, Asymptotes and Latus Rectum, Computed',
  content: `## 11.1 The reference table, with every entry derived

| Property | Ellipse $\\frac{x^{2}}{a^{2}}+\\frac{y^{2}}{b^{2}}=1$ | Hyperbola $\\frac{x^{2}}{a^{2}}-\\frac{y^{2}}{b^{2}}=1$ | Parabola $y^{2}=4px$ |
|---|---|---|---|
| centre | $(0,0)$ | $(0,0)$ | none |
| vertices | $(\\pm a, 0)$ | $(\\pm a, 0)$ | $(0,0)$ |
| foci | $(\\pm c, 0)$, $c^{2}=a^{2}-b^{2}$ | $(\\pm c, 0)$, $c^{2}=a^{2}+b^{2}$ | $(p, 0)$ |
| directrices | $x = \\pm a/e$ | $x = \\pm a/e$ | $x = -p$ |
| eccentricity | $c/a < 1$ | $c/a > 1$ | $1$ |
| asymptotes | none | $y = \\pm\\frac{b}{a}x$ | none |
| latus rectum | $2b^{2}/a$ | $2b^{2}/a$ | $4p$ |

## 11.2 What the latus rectum is, and why $2b^{2}/a$

The **latus rectum** is the chord through a focus perpendicular to the major
axis. Its half-length is the value of $y$ on the curve when $x = c$. For the
ellipse:

$$\\frac{c^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1 \\quad \\Longrightarrow \\quad y^{2} = b^{2}\\left(1 - \\frac{c^{2}}{a^{2}}\\right) = \\frac{b^{2}}{a^{2}}(a^{2}-c^{2}) = \\frac{b^{4}}{a^{2}}$$

so $y = b^{2}/a$ and the full chord is $2b^{2}/a$. The half-length
$\\ell = b^{2}/a$ is called the **semi-latus rectum**, and it is the natural
size parameter for a conic — it is what appears in the polar form and it stays
finite as a conic degenerates toward a parabola, where $a$ and $c$ both run off
to infinity.

For $x^{2}/25 + y^{2}/16 = 1$: $\\ell = 16/5 = 3.2$ and the full chord is 6.4.
The endpoints $(\\pm 3, \\pm 3.2)$ satisfy the ellipse equation exactly, since
$9/25 + 10.24/16 = 0.36 + 0.64 = 1$.

## 11.3 Worked example: an ellipse, every property computed and checked

Take $x^{2}/25 + y^{2}/16 = 1$.

$$a = 5, \\qquad b = 4, \\qquad c = \\sqrt{25-16} = 3, \\qquad e = \\frac{3}{5} = 0.6$$

| Property | Value | How it was confirmed |
|---|---|---|
| vertices | $(\\pm 5, 0)$ | substitution into the equation |
| co-vertices | $(0, \\pm 4)$ | substitution |
| foci | $(\\pm 3, 0)$ | focal sum equals 10 at 4001 sampled points |
| directrices | $x = \\pm 25/3 = \\pm 8.3333$ | ratio equals 0.6 at 4001 sampled points |
| latus rectum | $6.4$ | endpoints satisfy the equation |
| area | $\\pi ab = 20\\pi = 62.8319$ | numerical quadrature to six decimals |

The area formula is worth a sentence. An ellipse is a circle of radius $a$
scaled by the factor $b/a$ in one direction, and a uniform scaling in one
direction multiplies every area by that factor, so
$\\pi a^{2} \\cdot (b/a) = \\pi ab$. Integrating $2b\\sqrt{1-x^{2}/a^{2}}$ from
$-a$ to $a$ numerically returns $62.831853$, matching $20\\pi$.

## 11.4 Worked example: a hyperbola, and what the asymptotes really claim

Take $x^{2}/9 - y^{2}/16 = 1$, so $a = 3$, $b = 4$, $c = 5$ and
$e = 5/3 = 1.6667$.

Solving for $y$ on the right branch,

$$y = \\frac{b}{a}\\sqrt{x^{2}-a^{2}} = \\frac{4}{3}\\sqrt{x^{2}-9}$$

The asymptote claims that this approaches $\\tfrac{4}{3}x$. The gap is

$$\\frac{4}{3}\\left(x - \\sqrt{x^{2}-9}\\right) \\approx \\frac{4}{3}\\cdot\\frac{9}{2x} = \\frac{6}{x}$$

for large $x$, using $\\sqrt{x^{2}-9} \\approx x - 9/(2x)$. At $x = 1000$ the
predicted gap is $0.006$, and evaluating the exact expression gives
$0.006000$ — so the curve is 1333.3273 where the asymptote is 1333.3333. The
asymptote is a limit, never a bound reached, and questions that ask "does the
curve cross its asymptote" are answered by that algebra.

Other properties: directrices at $x = \\pm a/e = \\pm 1.8$, latus rectum
$2b^{2}/a = 32/3 = 10.6667$ with endpoints $(\\pm 5, \\pm 16/3)$, and those
endpoints satisfy the equation exactly:

$$\\frac{25}{9} - \\frac{(16/3)^{2}}{16} = \\frac{25}{9} - \\frac{16}{9} = 1$$

## 11.5 Worked example: a parabola, and the size of its dish

Take $y^{2} = 12x$, so $4p = 12$ and $p = 3$.

Focus $(3,0)$, directrix $x = -3$, vertex at the origin, latus rectum
$4p = 12$ with endpoints $(3, \\pm 6)$. Those endpoints satisfy the equation:
$36 = 12 \\times 3$.

The latus rectum has a practical reading here. It is the width of the parabola
measured **at the focus**, so it tells you how open the curve is. A reflector
whose latus rectum equals its aperture has its focus exactly at the rim plane; a
narrower latus rectum means a deeper dish with the focus inside it.

## 11.6 Worked example: shifting the centre

A conic centred at $(h,k)$ has exactly the same properties, measured from the
new centre. Identify

$$4x^{2} + 9y^{2} - 16x + 18y - 11 = 0$$

Group and factor out the leading coefficients before completing the square,
because whatever is added inside a bracket is multiplied by that coefficient on
the way out:

$$4(x^{2}-4x) + 9(y^{2}+2y) = 11$$
$$4(x^{2}-4x+4) + 9(y^{2}+2y+1) = 11 + 16 + 9 = 36$$
$$4(x-2)^{2} + 9(y+1)^{2} = 36 \\quad \\Longrightarrow \\quad \\frac{(x-2)^{2}}{9} + \\frac{(y+1)^{2}}{4} = 1$$

Centre $(2,-1)$, $a = 3$, $b = 2$, $c = \\sqrt{9-4} = \\sqrt{5} = 2.2361$,
$e = \\sqrt{5}/3 = 0.7454$. Foci at $(2 \\pm \\sqrt{5}, -1)$, vertices at
$(-1,-1)$ and $(5,-1)$, latus rectum $2(4)/3 = 8/3 = 2.6667$.

The numbers added to the right were $4 \\times 4 = 16$ and $9 \\times 1 = 9$, not
4 and 1. Dropping those multipliers is the error this problem exists to catch.

## 11.7 Worked example: degenerate cases

Not every second-degree equation is a curve. Consider

$$\\frac{x^{2}}{9} - \\frac{y^{2}}{4} = 0$$

The right-hand side is zero rather than one, so this factors:

$$\\left(\\frac{x}{3} - \\frac{y}{2}\\right)\\left(\\frac{x}{3} + \\frac{y}{2}\\right) = 0$$

which is the pair of lines $y = \\pm\\tfrac{2}{3}x$ — precisely the asymptotes of
the corresponding hyperbola. Similarly $x^{2}+y^{2} = 0$ is the single point at
the origin, and $x^{2}+y^{2}+4 = 0$ has no real points at all. These degenerate
answers are legitimate exam answers, and the way to spot them is to check the
constant on the right before classifying anything.`,
  examTip: 'Compute a, b, c and e in that order and write them down before answering anything. Almost every conic question is one of those four numbers, or a formula built from them, and having all four on paper turns a multi-step question into a lookup.',
  importantNote: 'When completing the square with leading coefficients, whatever you add inside the bracket is scaled by the coefficient outside. Adding 4 inside a bracket multiplied by 4 means adding 16 to the other side. Forgetting the multiplier gives the right centre and the wrong axes.',
},
{
  id: 'ag-transformations',
  title: '12. Translation, Rotation and the Discriminant Test',
  content: `## 12.1 Translation moves the centre and changes nothing else

Substituting $x = x' + h$ and $y = y' + k$ shifts the origin to $(h,k)$. Under a
translation, lengths, angles, eccentricities and axis directions are all
unchanged; only the coordinates of the centre, foci and vertices move. That is
why completing the square works: it is a translation chosen to put the centre at
the new origin.

## 12.2 Rotation, and the formulas both ways

Rotating the axes by $\\theta$ relates old and new coordinates by

$$x = x'\\cos\\theta - y'\\sin\\theta, \\qquad y = x'\\sin\\theta + y'\\cos\\theta$$

$$x' = x\\cos\\theta + y\\sin\\theta, \\qquad y' = -x\\sin\\theta + y\\cos\\theta$$

Substituting the first pair into the general second-degree equation

$$Ax^{2} + Bxy + Cy^{2} + Dx + Ey + F = 0$$

gives a new equation with

$$A' = A\\cos^{2}\\theta + B\\sin\\theta\\cos\\theta + C\\sin^{2}\\theta$$
$$B' = B\\cos 2\\theta + (C - A)\\sin 2\\theta$$
$$C' = A\\sin^{2}\\theta - B\\sin\\theta\\cos\\theta + C\\cos^{2}\\theta$$

Choosing $\\theta$ to make $B' = 0$ removes the cross term, and that happens when

$$\\cot 2\\theta = \\frac{A - C}{B} \\qquad \\text{equivalently} \\qquad \\tan 2\\theta = \\frac{B}{A-C}$$

When $A = C$ the cotangent is zero, so $2\\theta = 90^{\\circ}$ and
$\\theta = 45^{\\circ}$ — a case that occurs often enough to be worth
remembering outright.

## 12.3 The discriminant is invariant, so it classifies

Direct computation of $B'^{2} - 4A'C'$ from the formulas above gives
$B^{2}-4AC$: the discriminant is unchanged by rotation. Since rotation can
always remove the cross term, the classification can be read off before any
algebra at all:

$$B^{2} - 4AC < 0 \\;\\Rightarrow\\; \\text{ellipse (or circle)}, \\qquad = 0 \\;\\Rightarrow\\; \\text{parabola}, \\qquad > 0 \\;\\Rightarrow\\; \\text{hyperbola}$$

| Equation | $A$, $B$, $C$ | $B^{2}-4AC$ | Type |
|---|---|---|---|
| $4x^{2}+9y^{2}-36=0$ | 4, 0, 9 | $-144$ | ellipse |
| $x^{2}+y^{2}-25=0$ | 1, 0, 1 | $-4$ | circle |
| $y^{2}-12x=0$ | 0, 0, 1 | $0$ | parabola |
| $x^{2}-y^{2}-1=0$ | 1, 0, $-1$ | $4$ | hyperbola |
| $x^{2}+4xy+4y^{2}-x=0$ | 1, 4, 4 | $0$ | parabola |

That last row is the one worth studying. It has a cross term and looks like
nothing familiar, but the discriminant is zero, so it is a parabola with a
tilted axis. No amount of staring at the coefficients would tell you that; one
subtraction does.

## 12.4 Worked example: rotating an ellipse upright

Classify and simplify $5x^{2} + 4xy + 5y^{2} = 9$.

$$B^{2}-4AC = 16 - 100 = -84 < 0$$

so it is an ellipse, decided before any work. Since $A = C$, the required
rotation is $\\theta = 45^{\\circ}$:

$$A' = 5\\left(\\tfrac{1}{2}\\right) + 4\\left(\\tfrac{1}{2}\\right) + 5\\left(\\tfrac{1}{2}\\right) = 7$$
$$C' = 5\\left(\\tfrac{1}{2}\\right) - 4\\left(\\tfrac{1}{2}\\right) + 5\\left(\\tfrac{1}{2}\\right) = 3$$
$$B' = 4\\cos 90^{\\circ} + 0 = 0$$

$$7x'^{2} + 3y'^{2} = 9 \\quad \\Longrightarrow \\quad \\frac{x'^{2}}{9/7} + \\frac{y'^{2}}{3} = 1$$

The semi-axes are $\\sqrt{9/7} = 1.1339$ along $x'$ and $\\sqrt{3} = 1.7321$
along $y'$, so the major axis runs along $y'$ — that is, along the line
$y = -x$ in the original frame. The eccentricity is

$$e = \\sqrt{1 - \\frac{9/7}{3}} = \\sqrt{\\frac{4}{7}} = 0.7559$$

Confirm the whole thing on the curve. Sampling three thousand points of
$x'^{2}/(9/7) + y'^{2}/3 = 1$, rotating each back into the original frame, and
substituting into $5x^{2}+4xy+5y^{2}$ gives 9 at every point, to
$7 \\times 10^{-15}$.

![An ellipse drawn in its original frame satisfying five x squared plus four x y plus five y squared equals nine, shown together with the same ellipse in the rotated frame where it satisfies seven x prime squared plus three y prime squared equals nine. The rotated axes run at forty-five degrees, and the four semi-axis endpoints are marked.](/courses/fe-ee/figures/math5-ag-rotation.svg)

## 12.5 Worked example: the simplest tilted hyperbola

Classify $xy = 4$.

Here $A = C = 0$ and $B = 1$, so $B^{2}-4AC = 1 > 0$: a hyperbola. Again
$A = C$, so rotate by $45^{\\circ}$. Substituting

$$x = \\frac{x' - y'}{\\sqrt{2}}, \\qquad y = \\frac{x' + y'}{\\sqrt{2}}$$

$$xy = \\frac{x'^{2} - y'^{2}}{2} = 4 \\quad \\Longrightarrow \\quad \\frac{x'^{2}}{8} - \\frac{y'^{2}}{8} = 1$$

So $a = b = 2\\sqrt{2} = 2.8284$, $c = \\sqrt{8+8} = 4$, and
$e = c/a = \\sqrt{2} = 1.4142$. Equal $a$ and $b$ make this a **rectangular**
hyperbola, whose asymptotes are perpendicular — here they are the original $x$
and $y$ axes, which is obvious from the equation $xy = 4$ once you know to look
for it. Sampling the curve in the rotated frame and mapping back confirms
$xy = 4$ at every point to $5 \\times 10^{-15}$.

Rectangular hyperbolas are the shape of every constant-product relationship in
engineering: constant power on a voltage-current plane, constant
gain-bandwidth product, constant $RC$ for a fixed time constant.

## 12.6 Worked example: a rotation that is not 45 degrees

Classify $3x^{2} + 4xy = 4$ and find the rotation angle.

$$B^{2}-4AC = 16 - 0 = 16 > 0 \\quad \\Longrightarrow \\quad \\text{hyperbola}$$

$$\\cot 2\\theta = \\frac{A-C}{B} = \\frac{3-0}{4} = 0.75 \\quad \\Longrightarrow \\quad \\tan 2\\theta = \\frac{4}{3}$$

$$2\\theta = 53.1301^{\\circ} \\quad \\Longrightarrow \\quad \\theta = 26.5651^{\\circ}$$

That angle satisfies $\\tan\\theta = 0.5$, which is a clean way to state it. The
lesson is procedural: the discriminant answers "what kind of curve" without any
trigonometry, and only a question that actually asks for the axes needs
$\\theta$ at all. On a timed exam, checking whether the question needs the angle
before computing it saves a genuine minute.`,
  examTip: 'Compute B^2 - 4AC first, always. It classifies the conic in one subtraction and it is unchanged by any rotation, so it is valid however tilted the curve is. Only compute the rotation angle if the question asks for axis lengths or directions.',
  importantNote: 'When A = C the required rotation is exactly 45 degrees, because cot 2θ = 0. That covers xy = k and every equation of the form Ax² + Bxy + Ay² = k, which is most of what appears on an exam.',
},
{
  id: 'ag-parametric-polar',
  title: '13. Parametric and Polar Forms',
  content: `## 13.1 Why a second form is worth having

A curve written as $y = f(x)$ cannot double back, which rules out circles,
ellipses and any closed loop unless you split them into pieces. Parametric and
polar forms have no such restriction, and they make the natural variable — angle
or time — explicit.

| Curve | Parametric form | Recovering the Cartesian form |
|---|---|---|
| circle $x^{2}+y^{2}=r^{2}$ | $x = r\\cos t$, $y = r\\sin t$ | $\\cos^{2}t + \\sin^{2}t = 1$ |
| ellipse | $x = a\\cos t$, $y = b\\sin t$ | same identity after dividing |
| parabola $y^{2}=4px$ | $x = pt^{2}$, $y = 2pt$ | eliminate $t$ |
| hyperbola, one branch | $x = a\\cosh u$, $y = b\\sinh u$ | $\\cosh^{2}u - \\sinh^{2}u = 1$ |
| hyperbola, both branches | $x = a\\sec t$, $y = b\\tan t$ | $\\sec^{2}t - \\tan^{2}t = 1$ |
| line through $P_0$ | $x = x_0 + at$, $y = y_0 + bt$ | eliminate $t$ |

The parameter $t$ on the ellipse is **not** the polar angle of the point. It is
the angle on the auxiliary circle of radius $a$, projected inward, which is why
$(a\\cos t, \\, b\\sin t)$ sweeps the ellipse at a non-uniform angular rate. That
distinction matters when a question asks where a point is at a given angle
rather than at a given parameter value.

## 13.2 Polar coordinates and the conversions

$$x = r\\cos\\theta, \\qquad y = r\\sin\\theta$$
$$r = \\sqrt{x^{2}+y^{2}}, \\qquad \\theta = \\operatorname{atan2}(y, x)$$

The two-argument arctangent is the honest conversion. Plain $\\arctan(y/x)$
loses the quadrant, mapping both $(1,1)$ and $(-1,-1)$ to $45^{\\circ}$, and the
resulting $180^{\\circ}$ error is the classic phasor-angle mistake. If only
$\\arctan$ is available, compute it and then add $180^{\\circ}$ whenever $x$ is
negative.

## 13.3 The polar equation of a conic

Put the focus at the origin. The focus-directrix definition, written in polar
coordinates, gives one equation for the entire family:

$$r = \\frac{\\ell}{1 + e\\cos\\theta}$$

where $\\ell = b^{2}/a$ is the semi-latus rectum. Reading this equation is
almost the whole of conic geometry:

- $e = 0$ makes $r$ constant: a circle of radius $\\ell$.
- $0 < e < 1$ keeps the denominator positive for all $\\theta$: a closed ellipse.
- $e = 1$ makes the denominator vanish at $\\theta = \\pi$: a parabola, open.
- $e > 1$ makes the denominator vanish at two angles: a hyperbola, two branches.

$$r_{\\min} = \\frac{\\ell}{1+e} = a - c, \\qquad r_{\\max} = \\frac{\\ell}{1-e} = a + c \\quad (e<1)$$

![Four curves sharing one focus at the origin and one semi-latus rectum of three, produced by the single polar equation r equals three over one plus e cosine theta with eccentricities zero, zero point six, one and one point six. They are a circle, an ellipse, a parabola and one branch of a hyperbola.](/courses/fe-ee/figures/math5-ag-eccentricity-family.svg)

## 13.4 Worked example: the polar form is the same ellipse

For $x^{2}/25 + y^{2}/16 = 1$ we have $a = 5$, $b = 4$, $c = 3$, $e = 0.6$ and

$$\\ell = \\frac{b^{2}}{a} = \\frac{16}{5} = 3.2 \\quad \\Longrightarrow \\quad r = \\frac{3.2}{1 + 0.6\\cos\\theta}$$

Check the two extremes. At $\\theta = 0$, $r = 3.2/1.6 = 2$, which should equal
$a - c = 5 - 3 = 2$. At $\\theta = \\pi$, $r = 3.2/0.4 = 8 = a + c$. Both agree.

The real check is over the whole curve, not at two points. Taking four thousand
values of $\\theta$, computing $r$, converting to Cartesian coordinates measured
from the **centre** — that is, $x = c + r\\cos\\theta$ — and substituting into
$x^{2}/25 + y^{2}/16$ gives 1 at every point, to $9 \\times 10^{-16}$. The polar
form about the focus and the Cartesian form about the centre describe the same
ellipse.

## 13.5 Worked example: a parabola in polar form

Take $\\ell = 6$ and $e = 1$:

$$r = \\frac{6}{1 + \\cos\\theta}$$

At $\\theta = 0$ this gives $r = 3$: the vertex sits 3 from the focus, which is
$\\ell/2$ as it must be. At $\\theta = \\pi/2$ it gives $r = 6 = \\ell$, the
semi-latus rectum. Converting the whole curve to Cartesian coordinates about
the focus gives

$$y^{2} = -12(x - 3)$$

a parabola with vertex $(3,0)$ opening toward negative $x$, and sampling four
thousand points confirms the identity to $10^{-13}$. As $\\theta$ approaches
$\\pi$ the denominator goes to zero and $r$ runs away, which is the open end of
the curve.

## 13.6 Worked example: converting a polar equation to Cartesian

Identify $r = 4\\cos\\theta$.

Multiply through by $r$, which is the standard first move because it produces
$r^{2}$ and $r\\cos\\theta$, both of which convert directly:

$$r^{2} = 4r\\cos\\theta \\quad \\Longrightarrow \\quad x^{2}+y^{2} = 4x \\quad \\Longrightarrow \\quad (x-2)^{2}+y^{2} = 4$$

It is a circle of radius 2 centred at $(2, 0)$ — a circle through the origin
whose diameter lies along the polar axis. Multiplying by $r$ can in principle
introduce the origin as a spurious solution, but here the origin is genuinely on
the curve, at $\\theta = \\pi/2$.

## 13.7 Worked example: eliminating the parameter

A point moves as $x = 3 + 2\\cos t$, $y = -1 + 5\\sin t$. What path does it
follow?

Isolate the trigonometric functions and use the Pythagorean identity:

$$\\frac{x-3}{2} = \\cos t, \\qquad \\frac{y+1}{5} = \\sin t$$

$$\\frac{(x-3)^{2}}{4} + \\frac{(y+1)^{2}}{25} = 1$$

An ellipse centred at $(3,-1)$ with a vertical major axis, $a = 5$ and $b = 2$,
so $c = \\sqrt{25-4} = \\sqrt{21} = 4.5826$ and the foci are at
$(3, -1 \\pm 4.5826)$. This is exactly the algebra behind an elliptically
polarised wave, where the two field components are sinusoids of different
amplitude in quadrature and the tip of the field vector traces this ellipse.
When the amplitudes are equal the ellipse becomes a circle, giving circular
polarisation; when the phase difference is zero it degenerates to a straight
line, giving linear polarisation.`,
  examTip: 'Use atan2 rather than arctan when converting to polar, or check the quadrant by hand. A phasor at (-3, -4) has angle 233.13 degrees, not 53.13 - and both numbers will be on the list of choices.',
  importantNote: 'The parameter t in (a cos t, b sin t) is not the polar angle of the point on the ellipse. It is the eccentric angle, measured on the auxiliary circle. They agree only at the four axis points.',
},
{
  id: 'ag-three-space',
  title: '14. Three-Dimensional Coordinates, Lines and Planes',
  content: `## 14.1 Direction cosines

A direction in space can be given by the three angles $\\alpha$, $\\beta$,
$\\gamma$ that it makes with the coordinate axes. Their cosines are the
**direction cosines**:

$$l = \\cos\\alpha = \\frac{a}{\\lvert \\mathbf{v} \\rvert}, \\qquad m = \\cos\\beta = \\frac{b}{\\lvert \\mathbf{v} \\rvert}, \\qquad n = \\cos\\gamma = \\frac{c}{\\lvert \\mathbf{v} \\rvert}$$

for a direction vector $\\mathbf{v} = (a,b,c)$. They are exactly the components
of the unit vector along $\\mathbf{v}$, which is why

$$l^{2} + m^{2} + n^{2} = 1$$

That identity is the distance formula in disguise, and it is the fastest check
that a set of direction cosines is legitimate.

## 14.2 Worked example: direction cosines of a vector

For $\\mathbf{v} = (2, 3, 6)$:

$$\\lvert \\mathbf{v} \\rvert = \\sqrt{4+9+36} = \\sqrt{49} = 7$$

$$l = \\tfrac{2}{7} = 0.285714, \\qquad m = \\tfrac{3}{7} = 0.428571, \\qquad n = \\tfrac{6}{7} = 0.857143$$

$$l^{2}+m^{2}+n^{2} = \\frac{4+9+36}{49} = 1$$

The angles themselves are $\\alpha = 73.3985^{\\circ}$,
$\\beta = 64.6231^{\\circ}$ and $\\gamma = 31.0027^{\\circ}$. Notice they do not
sum to anything meaningful — it is the sum of the squared cosines that is fixed,
not the sum of the angles, and that is a distinction the exam tests.

## 14.3 Planes

A plane is fixed by a point on it and a normal direction. If
$\\mathbf{n} = (A,B,C)$ is normal and $P_0 = (x_0,y_0,z_0)$ lies on the plane,
then every point $P$ on the plane satisfies
$\\mathbf{n} \\cdot (P - P_0) = 0$:

$$A(x-x_0) + B(y-y_0) + C(z-z_0) = 0 \\quad \\Longrightarrow \\quad Ax + By + Cz = D$$

with $D = Ax_0 + By_0 + Cz_0$. The coefficients **are** the normal vector, which
is the single most useful fact about the general form.

The distance from a point $P_1$ to that plane follows the same projection
argument used for a line in the plane:

$$d = \\frac{\\lvert Ax_1 + By_1 + Cz_1 - D \\rvert}{\\sqrt{A^{2}+B^{2}+C^{2}}}$$

## 14.4 Worked example: point to plane, and the foot

How far is $(3,4,5)$ from the plane $x + 2y + 2z = 6$?

$$d = \\frac{\\lvert 3 + 8 + 10 - 6 \\rvert}{\\sqrt{1+4+4}} = \\frac{15}{3} = 5$$

The foot of the perpendicular is reached by stepping 5 units back along the unit
normal $\\tfrac{1}{3}(1,2,2)$:

$$F = (3,4,5) - 5\\cdot\\tfrac{1}{3}(1,2,2) = \\left(\\tfrac{4}{3}, \\tfrac{2}{3}, \\tfrac{5}{3}\\right)$$

Check that $F$ lies on the plane:

$$\\frac{4}{3} + 2\\left(\\frac{2}{3}\\right) + 2\\left(\\frac{5}{3}\\right) = \\frac{4+4+10}{3} = 6$$

An independent check: scan a
fine grid of points lying in the plane and measure each one's distance to
$(3,4,5)$; the smallest distance found is 5.000 to three decimals.

![A three-dimensional view of the plane x plus two y plus two z equals six drawn as a translucent sheet, with the point three comma four comma five above it joined by a perpendicular segment of length five to the foot at four thirds comma two thirds comma five thirds.](/courses/fe-ee/figures/math5-ag-space-plane.svg)

## 14.5 Lines in space

A line needs a point and a direction, and it is written three equivalent ways:

$$\\text{vector:} \\quad \\mathbf{r} = \\mathbf{r}_0 + t\\,\\mathbf{v}$$
$$\\text{parametric:} \\quad x = x_0 + at, \\quad y = y_0 + bt, \\quad z = z_0 + ct$$
$$\\text{symmetric:} \\quad \\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c}$$

The symmetric form fails whenever a direction component is zero, because that
would divide by zero; in that case the corresponding coordinate is simply
constant, and the line is written as a pair of equations instead.

The distance from a point $Q$ to that line uses a cross product, because the
cross product's magnitude is the area of the parallelogram spanned by two
vectors, and area divided by base gives height:

$$d = \\frac{\\lvert (Q - \\mathbf{r}_0) \\times \\mathbf{v} \\rvert}{\\lvert \\mathbf{v} \\rvert}$$

## 14.6 Worked example: point to line in space

How far is $(4,4,1)$ from the line through $(1,2,3)$ with direction $(1,2,2)$?

$$Q - \\mathbf{r}_0 = (3, 2, -2)$$

$$(3,2,-2) \\times (1,2,2) = (2\\cdot 2 - (-2)\\cdot 2, \\; (-2)\\cdot 1 - 3\\cdot 2, \\; 3\\cdot 2 - 2\\cdot 1) = (8, -8, 4)$$

$$d = \\frac{\\sqrt{64+64+16}}{\\sqrt{1+4+4}} = \\frac{12}{3} = 4$$

Confirm by minimisation, which shares no algebra with the cross product: slide a
point $\\mathbf{r}_0 + t\\mathbf{v}$ along the line and minimise its distance to
$Q$ numerically. The minimum is 4.000000 to seven decimals.

## 14.7 Worked example: two skew lines

Two lines in space that neither meet nor run parallel are **skew**, and the
shortest distance between them is measured along the common perpendicular. Its
direction is $\\mathbf{v}_1 \\times \\mathbf{v}_2$, so projecting the vector
between any two points, one from each line, onto that direction gives

$$d = \\frac{\\lvert (\\mathbf{r}_2 - \\mathbf{r}_1) \\cdot (\\mathbf{v}_1 \\times \\mathbf{v}_2) \\rvert}{\\lvert \\mathbf{v}_1 \\times \\mathbf{v}_2 \\rvert}$$

For $\\mathbf{r}_1 = (1,0,-1)$ with $\\mathbf{v}_1 = (2,1,3)$, and
$\\mathbf{r}_2 = (0,2,1)$ with $\\mathbf{v}_2 = (1,-1,2)$:

$$\\mathbf{v}_1 \\times \\mathbf{v}_2 = (5, -1, -3), \\qquad \\lvert \\mathbf{v}_1 \\times \\mathbf{v}_2 \\rvert = \\sqrt{35} = 5.9161$$

$$\\mathbf{r}_2 - \\mathbf{r}_1 = (-1, 2, 2), \\qquad (-1,2,2)\\cdot(5,-1,-3) = -5 - 2 - 6 = -13$$

$$d = \\frac{13}{\\sqrt{35}} = 2.1974$$

Sweeping both parameters over a fine grid and taking the smallest separation
found gives 2.1974 as well, so the projection formula and brute force agree.

## 14.8 Angles between planes and lines

| Between | Formula |
|---|---|
| two lines | $\\cos\\phi = \\dfrac{\\lvert \\mathbf{v}_1 \\cdot \\mathbf{v}_2 \\rvert}{\\lvert \\mathbf{v}_1 \\rvert \\lvert \\mathbf{v}_2 \\rvert}$ |
| two planes | $\\cos\\phi = \\dfrac{\\lvert \\mathbf{n}_1 \\cdot \\mathbf{n}_2 \\rvert}{\\lvert \\mathbf{n}_1 \\rvert \\lvert \\mathbf{n}_2 \\rvert}$ |
| line and plane | $\\sin\\phi = \\dfrac{\\lvert \\mathbf{v} \\cdot \\mathbf{n} \\rvert}{\\lvert \\mathbf{v} \\rvert \\lvert \\mathbf{n} \\rvert}$ |

The third row uses **sine**, not cosine, and that is the detail that gets
missed. The angle between a line and a plane is measured to the plane, whereas
the dot product measures the angle to the normal, and those two are
complementary. Every one of these formulas is a dot product divided by two
magnitudes, so if you remember the dot product you can reconstruct all three —
and remember that the odd one out is a sine.`,
  examTip: 'In Ax + By + Cz = D the coefficients ARE the normal vector. That one fact supplies the distance formula, the angle between planes, whether two planes are parallel, and whether a line lies in a plane. Write the normal down first and most three-dimensional questions become one dot product.',
  importantNote: 'The angle between a line and a plane uses sine, because the dot product gives the angle to the NORMAL and the reported angle is measured to the plane itself. The two are complementary, so using cosine returns 90 degrees minus the right answer.',
},
{
  id: 'ag-applications',
  title: '15. Applications: Reflectors, Navigation and Locus Problems',
  content: `## 15.1 Why a dish has to be a parabola

Take the parabola $y = x^{2}/(4f)$, whose focus is at $(0, f)$. A ray travelling
straight down, parallel to the axis, strikes the curve at $(x_0, x_0^{2}/(4f))$.
The tangent there has slope $x_0/(2f)$, and reflecting the incoming direction in
that tangent gives an outgoing direction. Doing that reflection exactly — the
mirror of a vector $\\mathbf{u}$ in a line of unit direction $\\mathbf{t}$ is
$2(\\mathbf{u}\\cdot\\mathbf{t})\\mathbf{t} - \\mathbf{u}$ — and comparing it with
the direction from the strike point to $(0,f)$ shows they are identical for
every $x_0$. The check was run at nine strike points across the aperture, and
the two unit vectors agree to $10^{-12}$ at all of them.

That is the reason a parabola is used and not a circular arc: **every** axial
ray reaches the focus, not merely the ones near the axis. A spherical mirror
focuses only paraxial rays and blurs the rest, which is spherical aberration.

## 15.2 Worked example: sizing a dish from its physical dimensions

A dish is $D = 2.4\\ \\mathrm{m}$ across at the rim and $d = 0.30\\ \\mathrm{m}$
deep at the centre. Where is the focus?

Put the vertex at the origin with the axis vertical, so the surface is
$y = x^{2}/(4f)$. The rim point is $(D/2, \\, d)$:

$$d = \\frac{(D/2)^{2}}{4f} = \\frac{D^{2}}{16f} \\quad \\Longrightarrow \\quad f = \\frac{D^{2}}{16d}$$

$$f = \\frac{2.4^{2}}{16(0.30)} = \\frac{5.76}{4.8} = 1.2\\ \\mathrm{m}$$

Check by substitution: at $x = 1.2$, $y = 1.44/(4 \\times 1.2) = 0.30$, matching
the stated depth. The **focal ratio** is $f/D = 1.2/2.4 = 0.5$, which is a
shallow dish with the focus well outside the rim plane; a deep dish has
$f/D$ nearer 0.25 and its focus at the rim.

A second dish, $D = 3.0\\ \\mathrm{m}$ and $d = 0.25\\ \\mathrm{m}$, gives
$f = 9/4 = 2.25\\ \\mathrm{m}$ and $f/D = 0.75$: shallower still, and its feed
must be mounted further out.

![The cross-section of a parabolic dish two point four metres across and zero point three metres deep, with nine vertical incoming rays striking the surface and the reflected rays converging on a single focus at one point two metres. Every reflected ray was computed by mirroring the incoming ray in the tangent at its strike point.](/courses/fe-ee/figures/math5-ag-parabolic-reflector.svg)

## 15.3 The ellipse reflects between its two foci

For an ellipse the tangent makes equal angles with the two focal radii, so a ray
leaving one focus arrives at the other. Checking this numerically — comparing
the bisector of the two focal directions with the normal at four thousand points
of $x^{2}/25 + y^{2}/16 = 1$ — gives agreement to $2 \\times 10^{-16}$ at every
point.

Whispering galleries work this way, and so do lithotripters, which put the
source at one focus and the target at the other. The engineering reading is that
an elliptical cavity has one exceptionally strong coupling path and the exact
positions of the two foci matter to millimetres.

## 15.4 Hyperbolic navigation

Two transmitters at known positions send synchronised pulses. A receiver
measures the **difference** in arrival times, which fixes the difference in
ranges — and the set of points with a constant range difference is exactly a
hyperbola with the transmitters as foci. That is the defining property of a
hyperbola put to work.

## 15.5 Worked example: a position line from a time difference

Two stations sit at $(\\pm 60, 0)$ kilometres. A receiver measures a range
difference of 72 km. Where can it be?

The hyperbola has $2a = 72$, so $a = 36$, and $c = 60$, so

$$b = \\sqrt{c^{2}-a^{2}} = \\sqrt{3600 - 1296} = \\sqrt{2304} = 48$$

$$\\frac{x^{2}}{1296} - \\frac{y^{2}}{2304} = 1$$

with $e = 60/36 = 1.6667$ and asymptotes
$y = \\pm\\tfrac{48}{36}x = \\pm\\tfrac{4}{3}x$. Sampling four thousand points along the branch and
measuring both ranges gives a difference of exactly 72 km at every one of them.

The receiver lies on the branch nearer the station reached first. A second pair
of stations gives a second hyperbola, and the intersection fixes the position —
which is the whole idea, and the reason the asymptotes matter operationally: far
from the baseline the branches flatten onto their asymptotes, two position lines
cross at a shallow angle, and the fix degrades.

The time scale is worth carrying. At $3 \\times 10^{5}\\ \\mathrm{km/s}$, a 72 km
path difference is

$$\\frac{72}{3\\times10^{5}}\\ \\mathrm{s} = 240\\ \\mu\\mathrm{s}$$

so a timing error of one microsecond changes the measured range difference by
300 m, which moves the semi-transverse axis $a$ by 150 m. How far that shifts
the position line on the ground depends on where the receiver sits relative to
the baseline, and it grows as the branches flatten onto their asymptotes.

## 15.6 Worked example: an Apollonius locus

Find the set of points whose distance to the origin is twice its distance to
$(3, 0)$.

Write the condition and square it to clear the radicals:

$$x^{2}+y^{2} = 4\\left[(x-3)^{2}+y^{2}\\right]$$
$$x^{2}+y^{2} = 4x^{2} - 24x + 36 + 4y^{2}$$
$$3x^{2} + 3y^{2} - 24x + 36 = 0 \\quad \\Longrightarrow \\quad x^{2}+y^{2}-8x+12 = 0$$
$$(x-4)^{2} + y^{2} = 4$$

A circle of radius 2 centred at $(4,0)$. The result is worth noticing: a
constant **ratio** of distances to two points gives a circle, whereas a constant
**sum** gives an ellipse and a constant **difference** gives a hyperbola. The
ratio case is the Apollonius circle and it is the one people do not expect.

Check it on the curve. Sampling four thousand points of the parametrised circle
$(4+2\\cos t, \\; 2\\sin t)$ and computing the ratio of the two distances gives 2 at every one, to
$10^{-15}$. Two easy members: $(6,0)$ is 6 from the origin and 3 from $(3,0)$,
and $(2,0)$ is 2 from the origin and 1 from $(3,0)$. Both give the ratio 2, and
they are the two points where the circle meets the line joining the fixed
points.

## 15.7 Worked example: a locus from a focus and a directrix

Find the set of points equidistant from $(0, 4)$ and the line $y = -4$.

Equidistant means $e = 1$, so the answer is a parabola with focus $(0,4)$ and
directrix $y = -4$. Writing the condition:

$$\\sqrt{x^{2} + (y-4)^{2}} = y + 4$$
$$x^{2} + y^{2} - 8y + 16 = y^{2} + 8y + 16 \\quad \\Longrightarrow \\quad x^{2} = 16y$$

Matching against $x^{2} = 4py$ gives $4p = 16$, so $p = 4$ — and the focus
should be at $(0, p) = (0,4)$ with the directrix at $y = -4$, which is what was
given. The construction is self-consistent. Sampling four thousand points of
$y = x^{2}/16$ and comparing the two distances gives agreement to
$7 \\times 10^{-15}$ everywhere.

## 15.8 A short catalogue of loci worth recognising

| Condition on $P$ | Locus |
|---|---|
| fixed distance from one point | circle |
| fixed sum of distances to two points | ellipse |
| fixed difference of distances to two points | hyperbola |
| equidistant from a point and a line | parabola |
| fixed ratio $k \\ne 1$ of distances to two points | circle (Apollonius) |
| equidistant from two points | perpendicular bisector, a line |
| fixed ratio of distances to a point and a line | conic of eccentricity $e$ |

Reading a locus question is a matter of finding which row it is. Once the row is
identified, the standard form supplies every remaining answer without further
derivation.`,
  examTip: 'For a reflector question, put the vertex at the origin and use y = x^2/(4f); then the rim point (D/2, d) gives f = D^2/(16d) in one line. For a navigation question, the range difference is 2a and the station separation is 2c - never the other way round.',
  importantNote: 'A constant RATIO of distances to two points gives a circle, not a hyperbola. Constant sum gives an ellipse and constant difference gives a hyperbola; the ratio case is the Apollonius circle, and it appears on the exam precisely because it is the one candidates guess wrong.',
},
{
  id: 'ag-set-b',
  title: '16. Problem Set: Lines, Circles and Conics',
  content: `## Problem Set A: lines, circles and conics

Every numerical answer here was confirmed a second way — by substitution back
into the defining equation, or by sampling the curve and testing the defining
distance relation.

### A1. Distance and a foot

How far is $(5, 1)$ from $5x - 12y + 26 = 0$, and where does the perpendicular
meet the line?

$$d = \\frac{\\lvert 25 - 12 + 26 \\rvert}{\\sqrt{25+144}} = \\frac{39}{13} = 3$$

Stepping 3 units along the unit normal $\\tfrac{1}{13}(5,-12)$ gives the foot
$(3.846154, \\, 3.769231)$, and substituting it into the line equation returns
zero exactly.

### A2. The angle between two lines

Find the angle between $2x - y = 3$ and $3x + y = 4$.

Slopes are $m_1 = 2$ and $m_2 = -3$:

$$\\tan\\theta = \\left\\lvert \\frac{-3-2}{1+2(-3)} \\right\\rvert = \\left\\lvert \\frac{-5}{-5} \\right\\rvert = 1 \\quad \\Longrightarrow \\quad \\theta = 45^{\\circ}$$

The dot product of the direction vectors $(1,2)$ and $(1,-3)$ gives
$\\cos\\theta = 5/(\\sqrt{5}\\sqrt{10}) = 0.7071$ and the same $45^{\\circ}$.

### A3. Centre and radius

Find the centre and radius of $x^{2}+y^{2}-10x-4y+13 = 0$.

$$(x^{2}-10x+25) + (y^{2}-4y+4) = -13+25+4 = 16$$
$$(x-5)^{2}+(y-2)^{2} = 16$$

Centre $(5,2)$, radius 4. Sampling the circle and substituting into the original
equation returns zero to fourteen decimal places at every point.

### A4. A chord without its endpoints

A line lies 3 units from the centre of a circle of radius 5. How long is the
chord it cuts?

$$2\\sqrt{r^{2}-p^{2}} = 2\\sqrt{25-9} = 2(4) = 8$$

No intersection points needed. If the distance had been 5 the chord would have
length zero, which is tangency, and beyond 5 there is no chord at all.

### A5. Reading an ellipse

For $9x^{2}+25y^{2} = 225$, give the axes, foci, eccentricity, directrices and
latus rectum.

Dividing by 225 gives $x^{2}/25 + y^{2}/9 = 1$, so $a = 5$, $b = 3$,
$c = \\sqrt{16} = 4$, $e = 0.8$. Foci $(\\pm 4, 0)$, vertices $(\\pm 5, 0)$,
directrices $x = \\pm 6.25$, latus rectum $2(9)/5 = 3.6$. Sampling the curve
confirms the focal sum is 10 everywhere and the focus-directrix ratio is 0.8
everywhere.

### A6. Reading a hyperbola

For $25x^{2}-144y^{2} = 3600$, give the same list.

Dividing by 3600 gives $x^{2}/144 - y^{2}/25 = 1$. The positive term carries
$a^{2}$, so $a = 12$ and $b = 5$; then $c = 13$ and $e = 13/12 = 1.0833$.
Vertices $(\\pm 12,0)$, foci $(\\pm 13,0)$, asymptotes
$y = \\pm\\tfrac{5}{12}x$, directrices $x = \\pm 144/13 = \\pm 11.0769$, latus
rectum $25/6 = 4.1667$. Sampling the right branch confirms the focal difference
is 24 everywhere.

### A7. A parabola opening downward

For $x^{2} = -8y$, give the focus, directrix and latus rectum.

$4p = 8$ so $p = 2$: focus $(0,-2)$, directrix $y = 2$, latus rectum 8, opening
downward because of the minus sign. Sampling the curve confirms the distance to
the focus equals the distance to the directrix at every point.

### A8. Shifting the centre

Identify $4x^{2}+9y^{2}-16x+18y-11 = 0$.

$$4(x^{2}-4x+4) + 9(y^{2}+2y+1) = 11 + 16 + 9 = 36$$
$$\\frac{(x-2)^{2}}{9} + \\frac{(y+1)^{2}}{4} = 1$$

An ellipse centred at $(2,-1)$ with $a = 3$ and $b = 2$. The numbers added to
the right were $4 \\times 4$ and $9 \\times 1$, because the completed squares sit
inside those coefficients.

### A9. Tangent length

How long is the tangent from $(8,6)$ to $x^{2}+y^{2} = 25$?

$$L = \\sqrt{64+36-25} = \\sqrt{75} = 8.6603$$

Both tangent points were located and checked: each lies on the circle, each is
exactly $8.6603$ from $(8,6)$, and each radius meets its tangent at a right
angle.`,
},
{
  id: 'ag-set-c',
  title: '17. Problem Set: Transformations, Space and Loci',
  content: `## Problem Set B: transformations, three dimensions and loci

### B1. Classify without simplifying

Classify each of the following by discriminant alone.

| Equation | $B^{2}-4AC$ | Type |
|---|---|---|
| $2x^{2}+3y^{2}-12 = 0$ | $-24$ | ellipse |
| $x^{2}+y^{2}-6x = 0$ | $-4$ | circle |
| $y^{2}+8x = 0$ | $0$ | parabola |
| $xy = 4$ | $1$ | hyperbola |
| $x^{2}+4xy+4y^{2}-x = 0$ | $0$ | parabola |

The last two both have cross terms, and neither can be classified by looking at
it. One subtraction settles both.

### B2. Rotating away a cross term

Simplify $5x^{2}+4xy+5y^{2} = 9$.

Since $A = C$, rotate by $45^{\\circ}$, giving $7x'^{2}+3y'^{2} = 9$, that is
$x'^{2}/(9/7) + y'^{2}/3 = 1$. Semi-axes $\\sqrt{9/7} = 1.1339$ and
$\\sqrt{3} = 1.7321$, eccentricity $\\sqrt{4/7} = 0.7559$. Sampling the rotated
ellipse and mapping the points back into the original frame reproduces
$5x^{2}+4xy+5y^{2} = 9$ to $7\\times10^{-15}$.

### B3. A rotation that is not 45 degrees

Through what angle must the axes be turned to remove the cross term from
$3x^{2}+4xy = 4$?

$$\\cot 2\\theta = \\frac{A-C}{B} = \\frac{3}{4} \\quad \\Longrightarrow \\quad 2\\theta = 53.1301^{\\circ}, \\quad \\theta = 26.5651^{\\circ}$$

The discriminant $16 - 0 = 16 > 0$ already told you it is a hyperbola, so if the
question asked only for the type, the angle was never needed.

### B4. Parameter elimination

A point moves as $x = 3+2\\cos t$, $y = -1+5\\sin t$. Identify the path and its
foci.

$$\\frac{(x-3)^{2}}{4} + \\frac{(y+1)^{2}}{25} = 1$$

An ellipse centred at $(3,-1)$ with a vertical major axis, $a = 5$, $b = 2$,
$c = \\sqrt{21} = 4.5826$, foci $(3, \\, -1\\pm 4.5826)$, eccentricity
$\\sqrt{21}/5 = 0.9165$ — a distinctly elongated ellipse.

### B5. Polar to Cartesian

Identify $r = 6/(1+\\cos\\theta)$.

Eccentricity 1, so a parabola with the focus at the origin, semi-latus rectum 6
and vertex at $r(0) = 3$. In Cartesian coordinates it is $y^{2} = -12(x-3)$,
opening toward negative $x$. Sampling four thousand values of $\\theta$ confirms
the identity to $10^{-13}$.

### B6. Direction cosines

Give the direction cosines and direction angles of $(2,3,6)$.

Magnitude 7, so $l = 2/7$, $m = 3/7$, $n = 6/7$, and
$l^{2}+m^{2}+n^{2} = 49/49 = 1$. The angles are $73.3985^{\\circ}$,
$64.6231^{\\circ}$ and $31.0027^{\\circ}$.

### B7. Point to plane

How far is $(4,1,6)$ from $x - 2y + 2z = 5$, and where is the foot?

$$d = \\frac{\\lvert 4 - 2 + 12 - 5 \\rvert}{\\sqrt{1+4+4}} = \\frac{9}{3} = 3$$

Stepping 3 units along $\\tfrac{1}{3}(1,-2,2)$ gives the foot $(3, 3, 4)$, and
substituting it returns $3 - 6 + 8 = 5$ exactly.

### B8. Skew lines

Find the shortest distance between the line through $(1,0,-1)$ with direction
$(2,1,3)$ and the line through $(0,2,1)$ with direction $(1,-1,2)$.

$$\\mathbf{v}_1\\times\\mathbf{v}_2 = (5,-1,-3), \\qquad (\\mathbf{r}_2-\\mathbf{r}_1)\\cdot(5,-1,-3) = -13$$

$$d = \\frac{13}{\\sqrt{35}} = 2.1974$$

Sweeping both parameters numerically and taking the smallest separation gives
2.1974 as well.

### B9. Two loci from the same two points

Describe the set of points $P$ for which (a) the distance to the origin is twice
the distance to $(3,0)$, and (b) the distance to the origin equals the distance
to $(3,0)$.

(a) Squaring the ratio condition gives $(x-4)^{2}+y^{2} = 4$: an Apollonius
circle of radius 2 centred at $(4,0)$. Sampling it returns a distance ratio of
exactly 2 at every point.

(b) A ratio of 1 degenerates: the squared condition gives $-6x + 9 = 0$, that is
$x = 1.5$, the perpendicular bisector. The circle has become a line, which is
what the Apollonius family does at $k = 1$.

### B10. A dish and its feed

A dish is 3.0 m across and 0.25 m deep. Where is the focus, and what is the
focal ratio?

$$f = \\frac{D^{2}}{16d} = \\frac{9.0}{4.0} = 2.25\\ \\mathrm{m}, \\qquad \\frac{f}{D} = 0.75$$

Check: at $x = 1.5$ the surface $y = x^{2}/(4f)$ gives
$2.25/9 = 0.25\\ \\mathrm{m}$, matching the stated depth. The focus sits well
outside the rim plane, so the feed needs a long support and the dish
illuminates it over a narrow angle.`,
},
],
  keyTakeaways: [
    'Distance formula d = sqrt[(Δx)² + (Δy)²] extends to 3D with (Δz)² term.',
    'Parallel lines: equal slopes; perpendicular lines: m₁·m₂ = -1.',
    'Four conic sections identified by signs and coefficients in the equation.',
    'Polar/cylindrical/spherical coordinates exploit symmetry in EM problems.',
    'Know conversion formulas between all coordinate systems.',
  ],
},

fee_diff_calc: {
  topicId: 'fee_diff_calc',
  title: 'Differential Calculus',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Differentiation measures rates of change — fundamental to understanding capacitor voltage change (C·dv/dt), inductor current change (L·di/dt), and optimization problems throughout the FE exam.',
  sections: [
    {
      id: 'dc-rules-derivatives',
      title: '1. Derivative Rules and Common Derivatives',
      content: `## 1.1 Definition and Basic Rules

The derivative measures instantaneous rate of change: **$f'(x) = \\lim (h\\to 0) [f(x+h) - f(x)] / h$**

### Differentiation Rules

| Rule | Formula |
|---|---|
| Power rule | $d/dx(x^n) = n\\cdot x^{n-1}$ |
| Constant multiple | $d/dx(c\\cdot f) = c\\cdot f'(x)$ |
| Sum rule | $d/dx(f+g) = f' + g'$ |
| Product rule | $(uv)' = u'v + uv'$ |
| Quotient rule | $(u/v)' = (u'v - uv') / v^{2}$ |
| Chain rule | $dy/dx = (dy/du)\\cdot (du/dx)$ |

### Common Derivatives

| Function | Derivative |
|---|---|
| $e^x$ | $e^x$ |
| $\\ln (x)$ | $1/x$ |
| $\\sin (x)$ | $\\cos (x)$ |
| $\\cos (x)$ | $-\\sin (x)$ |
| $\\tan (x)$ | $\\sec ^{2}(x)$ |
| $e^{ax}$ | $a\\cdot e^{ax}$ |

## 1.2 Applications in Circuit Analysis

In electrical engineering, derivatives describe dynamic behavior:
- **Capacitor current**: i_C = C · dv_C/dt (current proportional to voltage rate of change)
- **Inductor voltage**: v_L = L · di_L/dt (voltage proportional to current rate of change)
- **Power rate of change**: dP/dt = d(vi)/dt`,
      examTip: 'The product rule and chain rule are the two rules you will use most on the FE exam. For circuit problems: i_C = C·dv/dt means capacitor current is proportional to how fast voltage changes. If voltage is constant (DC steady state), capacitor current is zero — it acts as an open circuit.',
    },
    {
      id: 'dc-applications',
      title: '2. Limits, L\'Hopital\'s Rule, and Taylor Series',
      content: `## 2.1 Limits and Continuity

A limit **$\\lim (x\\to a) f(x) = L$** means f(x) approaches L as x approaches a. Limits define derivatives, integrals, and series convergence.

### L'Hopital's Rule

When a limit gives an **indeterminate form** (0/0 or ∞/∞), differentiate top and bottom:

**$\\lim (x\\to a) f(x)/g(x) = \\lim (x\\to a) f'(x)/g'(x)$**

This can be applied repeatedly until the limit is determinate.

## 2.2 Optimization (Max/Min)

To find extrema of f(x):
1. Find critical points: set **$f'(x) = 0$** and solve
2. **Second derivative test**: if f''(x) > 0 → local minimum; if f''(x) < 0 → local maximum

### Applications
- **Maximum power transfer**: differentiate P(R_L) and set to zero → R_L = R_Th
- **Minimum cost**: differentiate total cost function and set to zero

## 2.3 Taylor Series

**$f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)^{2}/2! + f'''(a)(x-a)^{3}/3! + ...$**

**Linearization** (first-order Taylor): f(x) ≈ f(a) + f'(a)(x-a)

Common series:
- **$e^x = 1 + x + x^{2}/2! + x^{3}/3! + ...$**
- **$\\sin (x) = x - x^{3}/3! + x^{5}/5! - ...$**
- **$\\cos (x) = 1 - x^{2}/2! + x^{4}/4! - ...$**

### Partial Derivatives

For multivariable functions, **$\\partial f/\\partial x$** treats all other variables as constants. The **gradient** ∇f = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k gives the direction of steepest increase.`,
      examTip: 'L\'Hopital\'s rule only works for 0/0 or ∞/∞ forms. If the limit is not indeterminate, do NOT apply L\'Hopital. Taylor series linearization f(x) ≈ f(a) + f\'(a)(x-a) is used for small-signal analysis of nonlinear circuits (like diode linearization around the Q-point).',
      importantNote: 'The maximum power transfer theorem (R_L = R_Th) is derived by differentiating P = V²·R_L/(R_Th+R_L)² and setting dP/dR_L = 0. This is a direct application of optimization using calculus.',
    },
    {
      id: 'dc-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Circuit derivatives that appear directly

The two defining relations are derivatives, and the exam asks about them as calculus:

- Capacitor: **$i = C dv/dt$**. A capacitor charged by a voltage ramping at 500 V/s with C = 20 microfarad passes i = (20e-6)(500) = **10 mA**. A constant voltage gives zero current, which is why a capacitor blocks DC.
- Inductor: **$v = L di/dt$**. A 0.5 H inductor whose current changes at 40 A/s develops v = (0.5)(40) = **20 V**. Try to interrupt inductor current instantly and di/dt is enormous - which is what destroys switch contacts and why flyback diodes exist.

## 3.2 Chain and product rules on a real waveform

Differentiate v(t) = 10 e^(-2t) sin(3t).

Product rule with u = 10 e^(-2t) and w = sin(3t):

$$u' = -20 e^{-2t}, w' = 3 \\cos (3t)$$

$$dv/dt = -20 e^{-2t} \\sin (3t) + 30 e^{-2t} \\cos (3t) = 10 e^{-2t}[3 \\cos (3t) - 2 \\sin (3t)]$$

This is the shape of a damped oscillation - exactly the underdamped RLC response - and its derivative is what you set to zero to find the overshoot peak.

## 3.3 Optimisation: maximum power transfer by calculus

A source of V volts with internal resistance R_s drives a load R_L. Load power is

$$P = V^2 R_L/(R_s + R_L)^2$$

Differentiate with the quotient rule and set to zero. The numerator of dP/dR_L is

$$V^2[(R_s + R_L)^2 - R_L \\times 2(R_s + R_L)] = V^2 (R_s + R_L)[(R_s + R_L) - 2R_L]$$

Setting the bracket to zero: R_s + R_L - 2R_L = 0, so **$R_L = R_s$**.

That is the maximum power transfer theorem derived rather than memorised, and the calculus route is what an exam question means when it presents it as an optimisation problem.

## 3.4 Critical points and the second derivative

$$f(x) = x^3 - 6x^2 + 9x + 2$$

f'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x-1)(x-3), so critical points at **x = 1 and x = 3**.

f''(x) = 6x - 12. At x = 1: f'' = -6 < 0, a **local maximum**, f(1) = 1 - 6 + 9 + 2 = 6. At x = 3: f'' = +6 > 0, a **local minimum**, f(3) = 27 - 54 + 27 + 2 = 2.

The second-derivative test in one line: negative means a peak, positive means a trough, zero is inconclusive and needs the first-derivative sign either side.`,
      examTip: 'When a question gives you a rate and asks for a current or voltage, it is testing i = C dv/dt or v = L di/dt, not calculus for its own sake. Identify which element you have and the derivative is already written down for you.',
      quiz: [
        {
          question: 'The voltage across a 50 microfarad capacitor increases at a constant 2000 V/s. What current flows?',
          options: ['0.1 A', '10 A', '0.04 A', '0 A'],
          correctIndex: 0,
          explanation: 'i = C dv/dt = (50e-6)(2000) = 0.1 A. Note that the current depends only on the RATE of change, not on the voltage itself - a capacitor at a high but constant voltage passes no current at all.',
        },
        {
          question: 'What is the derivative of f(t) = e^(-3t) cos(2t)?',
          options: [
            'e^(-3t)[-3cos(2t) - 2sin(2t)]',
            'e^(-3t)[-3cos(2t) + 2sin(2t)]',
            '-3e^(-3t) sin(2t)',
            '-6 e^(-3t) sin(2t) cos(2t)',
          ],
          correctIndex: 0,
          explanation: 'Product rule: (-3e^(-3t))cos(2t) + e^(-3t)(-2 sin(2t)) = e^(-3t)[-3cos(2t) - 2sin(2t)]. Both terms are negative because the exponential decays and the derivative of cosine is negative sine. Dropping either term is the usual slip.',
        },
        {
          question: 'For f(x) = x^3 - 3x, at x = 1 the function has:',
          options: ['a local minimum', 'a local maximum', 'an inflection point', 'no critical point'],
          correctIndex: 0,
          explanation: "f'(x) = 3x^2 - 3 = 0 gives x = ±1, so x = 1 is critical. f''(x) = 6x, and f''(1) = 6 > 0, so the curve is concave up and x = 1 is a local minimum. The local maximum is at x = -1, where f'' = -6.",
        },
      ],
    },
  {
    id: 'dc-depth',
    title: '4. Derivatives as an Engineering Instrument',
    content: `## 4.1 Reading a function through its derivatives
  
  Optimisation questions on the FE exam are mechanical once the structure is
  clear, and the structure is best seen with all three curves stacked:
  
  ![A cubic, its first derivative and its second derivative drawn one above another on a shared x axis. The zeros of the first derivative line up with the turning points of the function, and the sign change of the second derivative locates the inflection.](/courses/fe-ee/figures/math-derivative-extrema.svg)
  
  The procedure the picture encodes:
  
  1. **f′ = 0 locates** candidate extrema. For f = x³ − 3x, f′ = 3x² − 3 = 0 gives $x = \\pm 1$.
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
  | Power | $d/dx x^{n} = n x^{n-1}$ |
  | Product | $(uv)' = u'v + uv'$ |
  | Quotient | $(u/v)' = (u'v - uv')/v^{2}$ |
  | Chain | $d/dx f(g(x)) = f'(g(x))\\cdot g'(x)$ |
  | Exponential | $d/dx e^{kx} = k e^{kx}$ |
  | Logarithm | $d/dx \\ln  x = 1/x$ |
  | Sine, cosine | $d/dx \\sin  x = \\cos  x; d/dx \\cos  x = -\\sin  x$ |
  
  The quotient rule's numerator order matters: **$u'v - uv'$**, and reversing it
  flips the sign of every answer. If it is easier to remember, write u/v as u·v⁻¹
  and use the product and chain rules instead — the result is identical and the
  sign takes care of itself.
  
  ## 4.3 Worked: maximum power transfer, derived rather than recalled
  
  A source of open-circuit voltage V and internal resistance R_s drives a load
  R_L. The current is I = V/(R_s + R_L), so the load power is
  
  $$P = I^{2}R_L = V^{2}R_L / (R_s + R_L)^{2}$$
  
  Differentiate with respect to R_L using the quotient rule, with u = V²R_L and $v = (R_s + R_L)^{2}$:
  
  $$dP/dR_L = [V^{2}(R_s + R_L)^{2} - V^{2}R_L\\cdot 2(R_s + R_L)] / (R_s + R_L)^{4}$$
  
  Cancel one factor of (R_s + R_L) from every term:
  
  $$dP/dR_L = V^{2}[(R_s + R_L) - 2R_L] / (R_s + R_L)^{3} = V^{2}(R_s - R_L)/(R_s + R_L)^{3}$$
  
  Setting the numerator to zero gives **$R_L = R_s$**, and substituting back gives

  $$P_{\\max} = V^{2}R_s/(2R_s)^{2} = V^{2}/(4R_s)$$
  
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
  
  $$dA/dt = 2\\pi r \\cdot dr/dt = 2\\pi (20)(0.5) = 20\\pi \\approx 62.8 m^{2}/s$$
  
  The rate depends on r, so "how fast is the area growing" has no single answer —
  it grows faster as the slick gets bigger. A question that omits the radius is
  testing whether you noticed that.
  
  ## 4.5 L'Hopital, and when it does not apply
  
  For limits of the indeterminate forms **$0/0$** or **∞/∞**, differentiate
  numerator and denominator separately and re-evaluate:
  
  $$\\lim (x\\to 0) \\sin  x / x = \\lim (x\\to 0) \\cos  x / 1 = 1$$
  
  The restriction is strict. The form must be indeterminate before you may apply
  the rule. lim(x→0) (x + 1)/x is 1/0, which is not indeterminate — it diverges,
  and differentiating top and bottom would give the wrong answer of 1. Checking
  that you actually have 0/0 or ∞/∞ before differentiating is the whole discipline
  of this technique.`,
    examTip: 'A positive second derivative holds water: concave up, so a minimum. If the second derivative is zero the test tells you nothing and you must check the sign of f-prime on either side of the point.',
    importantNote: 'L Hopital applies ONLY to 0/0 and infinity/infinity. Substitute first and confirm you have an indeterminate form. Applying it to 1/0 or 0/1 produces a confident wrong answer, which is exactly what the distractors are built from.',
  },
{
  id: 'dc-set',
  title: '5. Problem Set: Rates and Optima',
  content: `## 5.1 Chain rule inside a circuit expression

Differentiate v(t) = 10 e^(−t/0.02) sin(377t) at t = 0.

This is a product, and the first factor needs the chain rule:

$$v' = 10[(-1/0.02)e^{-t/0.02} \\sin (377t) + e^{-t/0.02}(377)\\cos (377t)]$$

At t = 0 the exponential is 1, sin(0) = 0 and cos(0) = 1, so

$$v'(0) = 10[0 + 377] = 3770\\ \\mathrm{V}/s$$

The decaying envelope contributes nothing at t = 0 because the sine is zero
there — the whole initial slope comes from the oscillation.

## 5.2 Optimising a rectangular enclosure

An enclosure of fixed volume 8000 cm³ has a square base of side x and height h.
Minimise the surface area.

Volume fixes h: h = 8000/x². Surface area (closed box):

$$A = 2x^{2} + 4xh = 2x^{2} + 32000/x$$

$$dA/dx = 4x - 32000/x^{2} = 0 \\to 4x^{3} = 32000 \\to x^{3} = 8000 \\to x = 20 cm$$

Then h = 8000/400 = **20 cm**, so the optimum is a cube — the answer for any
closed box of fixed volume. Confirm it is a minimum: A″ = 4 + 64000/x³ > 0
for all positive x, so concave up. ✓

## 5.3 Maximum of a power curve

For P(θ) = 1000 sin θ cos θ, find the maximum.

Rewrite with the double-angle identity: P = 500 sin 2θ, whose maximum is
**500 W**, reached where $2\\theta = 90^\\circ$, i.e. **$\\theta = 45^\\circ$**. Differentiating directly gives
P′ = 1000 cos 2θ = 0 at the same place, but the identity makes the peak value
immediate.

## 5.4 An indeterminate limit

Evaluate lim(x→0) (e^(2x) − 1)/x.

Substituting gives 0/0, so L'Hopital applies:

$$\\lim (x\\to 0) 2e^{2x}/1 = 2$$

This is the small-signal linearisation of an exponential, and it is why a diode
equation is often approximated as linear near the origin.`,
},
{
  id: 'dc-errors',
  title: '6. Where Marks Are Lost',
  content: `## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Reversing the quotient rule | sign flipped on every answer | numerator is u′v − uv′; or write u·v⁻¹ and use product plus chain |
| Skipping the inner derivative | d/dx sin(3x) given as cos(3x) | the chain rule multiplies by 3 |
| Applying L'Hopital to a determinate form | differentiating 1/0 | substitute first and confirm 0/0 or ∞/∞ |
| Stopping at f′ = 0 | reporting a minimum as a maximum | check the sign of f″ before naming it |

Optimisation answers also deserve a physical check. A box of minimum surface
area for a fixed volume should come out roughly cube-shaped; a maximum-power
load resistance should equal the source resistance. If the algebra produces a
dimension ten times the others, the derivative was taken with respect to the
wrong variable.

And check the endpoints. Many optimisation questions on a closed interval have
their extreme value at an endpoint rather than at a critical point, so a
derivative that never vanishes inside the interval is not a contradiction - it
means the answer sits at one end, and you should evaluate both.`,
},
{
  id: 'dc-limit-definition',
  title: '7. The Derivative Built From the Limit',
  content: `## 7.1 What the difference quotient measures

Every rule later in this chapter follows from a single construction, and it
repays building that construction by hand once rather than reciting it. Choose a
point on a curve, then a second point a horizontal distance h further along. The
straight line joining the two is a **secant**, and its slope is rise over run:

$$m_{sec} = \\frac{f(x+h) - f(x)}{h}$$

Now let h shrink. The second point slides back toward the first, the secant
pivots about the fixed point, and if the pivoting settles on one definite
limiting line, that line is the **tangent** and its slope is the derivative:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

![A cubic curve with its tangent at x equals one drawn dashed, and two secants through the same point drawn in colour. The secant for a step of one has slope seven, the secant for a step of a quarter has slope 3.8125, and both lean toward the tangent slope of three as the step shrinks.](/courses/fe-ee/figures/math3-dc-secant-tangent.svg)

Three things in that definition are load bearing and all three are examinable.
The limit is taken **as h approaches zero, not at h equal to zero**, because at
h exactly zero the quotient is the meaningless 0/0. The limit must give the same
answer whether h approaches from above or below, which is what fails for a
corner. And the result is a **function of x**, not a number: it hands back a
different slope at every point of the domain.

## 7.2 Worked example: a cubic from first principles

Take $f(x) = x^{3}$ and evaluate the quotient without any rule at all. Expand
the numerator:

$$(x+h)^{3} - x^{3} = 3x^{2}h + 3xh^{2} + h^{3}$$

Every surviving term carries at least one factor of h, which is exactly why the
division is legal:

$$\\frac{(x+h)^{3} - x^{3}}{h} = 3x^{2} + 3xh + h^{2}$$

The h-free part is the answer and the rest is the error. Sending h to zero:

$$f'(x) = 3x^{2}$$

At x = 1 that says the slope is 3, and the exact expansion says the secant slope
for any step is $3 + 3h + h^{2}$. That prediction can be checked arithmetically
rather than believed:

| step h | second point 1 + h | secant slope from the definition | prediction 3 + 3h + h squared |
|---|---|---|---|
| 1 | 2 | $(8 - 1)/1 = 7$ | $3 + 3 + 1 = 7$ |
| 0.5 | 1.5 | $(3.375 - 1)/0.5 = 4.75$ | $3 + 1.5 + 0.25 = 4.75$ |
| 0.25 | 1.25 | $(1.953125 - 1)/0.25 = 3.8125$ | $3 + 0.75 + 0.0625 = 3.8125$ |
| 0.1 | 1.1 | $(1.331 - 1)/0.1 = 3.31$ | $3 + 0.3 + 0.01 = 3.31$ |
| 0.01 | 1.01 | 3.0301 | $3 + 0.03 + 0.0001 = 3.0301$ |
| 0.001 | 1.001 | 3.003001 | $3 + 0.003 + 0.000001 = 3.003001$ |

The error falls in proportion to h, and that proportionality is not a curiosity:
it is why a first-order finite difference on a microcontroller loses one digit of
accuracy for every factor of ten you fail to shrink the sample interval.

## 7.3 Worked example: the reciprocal and the square root

Two more from the definition, because both appear in circuit work and both look
harder than they are.

**The reciprocal, $f(x) = 1/x$.** Put the numerator over a common denominator:

$$\\frac{1}{h}\\left(\\frac{1}{x+h} - \\frac{1}{x}\\right) = \\frac{1}{h}\\cdot\\frac{x - (x+h)}{x(x+h)} = \\frac{-1}{x(x+h)}$$

Let h go to zero and the denominator closes up:

$$\\frac{d}{dx}\\left(\\frac{1}{x}\\right) = -\\frac{1}{x^{2}}$$

At x = 2 that is -0.25. The negative sign is the whole content of the result:
current through a fixed voltage falls as resistance rises, and it falls fastest
where the resistance is smallest.

**The square root, $f(x) = \\sqrt{x}$.** Here the trick is to multiply above and
below by the conjugate so the difference of roots becomes a difference of
squares:

$$\\frac{\\sqrt{x+h} - \\sqrt{x}}{h}\\cdot\\frac{\\sqrt{x+h} + \\sqrt{x}}{\\sqrt{x+h} + \\sqrt{x}} = \\frac{1}{\\sqrt{x+h} + \\sqrt{x}}$$

$$\\frac{d}{dx}\\sqrt{x} = \\frac{1}{2\\sqrt{x}}$$

At x = 9 the slope is $1/6 = 0.166667$. Both results agree with the power rule
applied to $x^{-1}$ and $x^{1/2}$, which is the point: the power rule is not a
separate fact, it is these limits done once for a general exponent.

## 7.4 Where the derivative fails to exist

A function can be perfectly continuous and still have no derivative at a point,
and the exam tests the distinction directly. The standard case is
$f(x) = \\lvert x \\rvert$ at the origin. Approach from the right and the quotient
is $h/h = 1$; approach from the left and it is $-h/h = -1$. The two one-sided
limits disagree, so no single tangent exists.

| situation | continuous | differentiable | electrical analogue |
|---|---|---|---|
| smooth curve | yes | yes | capacitor voltage on a sine drive |
| corner, as in the absolute value at zero | yes | no | full-wave rectified output at the cusp |
| vertical tangent, as in the cube root at zero | yes | no | idealised saturating characteristic |
| jump discontinuity | no | no | ideal switch closing |

The implication runs one way only. **Differentiable implies continuous; continuous
does not imply differentiable.** A question that offers "the function is
continuous at the point, therefore the derivative exists" as a choice is
offering the converse of a true statement, which is the oldest distractor in
this section.`,
  examTip: 'When a question asks you to differentiate from first principles, expand the numerator until every term carries a factor of h, cancel that h, then set h to zero. If a term without h survives the cancellation, the algebra is wrong - the limit would be infinite.',
  importantNote: 'The absolute-value function is continuous everywhere and differentiable everywhere except at zero, where the left-hand slope is minus one and the right-hand slope is plus one. Continuity is necessary for differentiability but never sufficient.',
},
{
  id: 'dc-rules-derived',
  title: '8. Every Rule, Derived',
  content: `## 8.1 The product rule, from the definition

Tabulated rules are easy to misremember under pressure; derived rules are not.
The product rule comes out of one algebraic trick, adding and subtracting the
same quantity. Write $p(x) = u(x)v(x)$ and form the difference quotient:

$$\\frac{u(x+h)v(x+h) - u(x)v(x)}{h}$$

Insert the term $u(x+h)v(x)$ once with each sign, which changes nothing:

$$= \\frac{u(x+h)[v(x+h) - v(x)]}{h} + \\frac{v(x)[u(x+h) - u(x)]}{h}$$

Each bracket is now a difference quotient of a single function. Sending h to
zero, the first factor $u(x+h)$ becomes $u(x)$ and the result is

$$(uv)' = uv' + u'v$$

Notice what the derivation shows that the formula alone does not: the rule needs
u to be continuous at the point, which it is because it is differentiable there.
The frequent wrong answer $u'v'$ fails the simplest test available - try
$u = v = x$, where the truth is $2x$ and the wrong rule gives 1.

## 8.2 The quotient rule, for free

There is no need for a second derivation. Write the quotient as a product with a
negative power, $u/v = u \\cdot v^{-1}$, and apply the product and chain rules:

$$\\left(\\frac{u}{v}\\right)' = u'v^{-1} + u\\cdot(-1)v^{-2}v' = \\frac{u'}{v} - \\frac{uv'}{v^{2}}$$

Placing both terms over $v^{2}$ gives the familiar form:

$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^{2}}$$

The order in the numerator is the only thing worth memorising, and this
derivation fixes it: the term carrying $u'$ is positive because it came from
differentiating the numerator, and the term carrying $v'$ is negative because it
came from the exponent of minus one.

## 8.3 The chain rule

If $y$ depends on $u$ and $u$ depends on $x$, then over a small interval the
changes multiply:

$$\\frac{\\Delta y}{\\Delta x} = \\frac{\\Delta y}{\\Delta u}\\cdot\\frac{\\Delta u}{\\Delta x}$$

Taking limits, and provided $\\Delta u$ is not zero on the way,

$$\\frac{dy}{dx} = \\frac{dy}{du}\\cdot\\frac{du}{dx}$$

or in function notation, $\\frac{d}{dx}f(g(x)) = f'(g(x))\\,g'(x)$. The factor
$g'(x)$ is the one that gets dropped, and the omission is the single most common
differentiation error on this exam. Every time an argument is anything other than
a bare x, that inner derivative is owed.

## 8.4 Worked example: a damped mains-frequency waveform

Differentiate $v(t) = 12 e^{-50t}\\sin(377t)$, the shape of a switching transient
on a 60 Hz supply, and evaluate the slope at t = 0 and at t = 2 ms.

This is a product whose first factor needs the chain rule and whose second factor
needs it too. With $u = 12e^{-50t}$ and $w = \\sin(377t)$:

$$u' = -600e^{-50t}, \\qquad w' = 377\\cos(377t)$$

$$v'(t) = 12e^{-50t}\\left[377\\cos(377t) - 50\\sin(377t)\\right]$$

**At t = 0** the exponential is 1, the sine is 0 and the cosine is 1, so
$12 \\times 377 = 4524$ volts per second. The envelope contributes nothing at the
instant the sine passes through zero; the entire initial slope is the
oscillation.

**At t = 2 ms** the phase is $377 \\times 0.002 = 0.754$ radians, where
$\\sin = 0.68456$ and $\\cos = 0.72896$, and the envelope has fallen to
$e^{-0.1} = 0.904837$. The bracket is

$$377 \\times 0.72896 - 50 \\times 0.68456 = 240.59$$

$$v'(0.002) = 12 \\times 0.904837 \\times 240.59 = 2612.3\\ \\mathrm{V/s}$$

The slope has fallen to about 58 per cent of its initial value, partly because
the envelope decayed and partly because the sine term now subtracts. Setting this
derivative to zero is how the overshoot peak of an underdamped response is
located, which is the connection to the Differential Equations chapter.

## 8.5 Implicit differentiation

Not every relationship can be rearranged into y as a function of x, and there is
no need to try. Differentiate both sides with respect to x, treating y as an
unknown function of x, and let the chain rule supply a factor of $dy/dx$ every
time a y is differentiated. Then solve algebraically for that factor.

For the circle $x^{2} + y^{2} = 25$:

$$2x + 2y\\frac{dy}{dx} = 0 \\quad\\Longrightarrow\\quad \\frac{dy}{dx} = -\\frac{x}{y}$$

At the point (3, 4) the slope is -0.75, and the geometry confirms it: the radius
to that point has slope 4/3, and the tangent must be perpendicular, so its slope
is the negative reciprocal.

A harder shape shows the method earning its keep. For $x^{3} + y^{3} = 6xy$:

$$3x^{2} + 3y^{2}\\frac{dy}{dx} = 6y + 6x\\frac{dy}{dx}$$

$$\\frac{dy}{dx} = \\frac{6y - 3x^{2}}{3y^{2} - 6x}$$

At the point (3, 3) that is $(18 - 27)/(27 - 18) = -1$. Solving this curve for y
first would mean handling a cubic; differentiating it implicitly takes one line.

## 8.6 Worked example: implicit differentiation on a diode load line

Implicit differentiation is how small-signal resistance is defined, and the
derivation is short enough to reconstruct in an exam.

A source E drives a series resistor R and a diode obeying
$I = I_S\\left(e^{V_D/V_T} - 1\\right)$. Kirchhoff's voltage law with the diode
equation inverted gives a relationship that cannot be solved for I in elementary
functions:

$$E = IR + V_T\\ln\\!\\left(\\frac{I}{I_S} + 1\\right)$$

Differentiate both sides with respect to E, treating I as a function of E:

$$1 = R\\frac{dI}{dE} + \\frac{V_T}{I + I_S}\\cdot\\frac{dI}{dE}$$

$$\\frac{dI}{dE} = \\frac{1}{R + r_d}, \\qquad r_d = \\frac{V_T}{I + I_S} \\approx \\frac{V_T}{I}$$

The diode has behaved, for small changes, exactly like a resistor of value
$r_d = V_T/I$. Put numbers to it with R = 100 ohm, E = 5 V, a saturation
current of $I_S = 10^{-12}$ A, that is one picoampere, and the thermal voltage at
300 K, which from
the defining SI constants for the Boltzmann constant and the elementary charge is
$V_T = kT/q = 0.025852$ V. Solving the implicit equation numerically gives
I = 43.666 mA, so the diode drops

$$5 - 4.3666 = 0.6334\\ \\mathrm{V}$$

and its small-signal resistance is

$$0.025852 / 0.043666 = 0.5920\\ \\mathrm{ohm}$$

The sensitivity of current to supply voltage is therefore
$1000 / 100.592 = 9.941$ mA per volt. The diode contributes barely half an ohm
against the resistor's hundred, which is the quantitative version of the claim
that a forward-biased diode is a stiff voltage clamp.

## 8.7 Logarithmic differentiation

When a function is a tower of products, quotients and powers, take the natural
logarithm of both sides first. Logarithms turn multiplication into addition and
exponents into coefficients, and the derivative of $\\ln y$ is $y'/y$:

$$\\frac{d}{dx}\\ln y = \\frac{1}{y}\\frac{dy}{dx} \\quad\\Longrightarrow\\quad y' = y\\cdot\\frac{d}{dx}\\ln y$$

This is also the only sane route to a variable base raised to a variable power.
For $y = x^{x}$, taking logs gives $\\ln y = x\\ln x$, so

$$\\frac{y'}{y} = \\ln x + 1 \\quad\\Longrightarrow\\quad y' = x^{x}(1 + \\ln x)$$

At x = 2 that is $4 \\times 1.693147 = 6.7726$. Neither the power rule nor the
exponential rule applies here on its own, because both the base and the exponent
are moving.

## 8.8 Worked example: a product-quotient tower

Differentiate $y = \\dfrac{x^{2}(x+1)^{3}}{\\sqrt{x-1}}$ at x = 2.

The product-and-quotient route needs three nested applications. The logarithmic
route needs one line:

$$\\ln y = 2\\ln x + 3\\ln(x+1) - \\tfrac{1}{2}\\ln(x-1)$$

$$\\frac{y'}{y} = \\frac{2}{x} + \\frac{3}{x+1} - \\frac{1}{2(x-1)}$$

At x = 2 the bracket is $1 + 1 - 0.5 = 1.5$, and the function value is
$y(2) = 4 \\times 27 / 1 = 108$. Therefore

$$y'(2) = 108 \\times 1.5 = 162$$

A central-difference check on the original expression reproduces 162, which is
the habit worth forming: the logarithmic route is fast but its sign errors are
silent, and one numerical spot check catches them.`,
  examTip: 'Reach for logarithmic differentiation whenever the expression is a chain of products, quotients and powers, and always when a variable appears in an exponent. Taking logs converts the whole structure into a sum whose derivative is a sum of simple reciprocals.',
  importantNote: 'Implicit differentiation is where small-signal models come from. Differentiating a device law about an operating point and solving for the incremental ratio produces r_d = V_T/I for a diode in three lines, with no memorised formula.',
},
{
  id: 'dc-shape',
  title: '9. Higher Derivatives and the Shape of a Curve',
  content: `## 9.1 Concavity, inflection, and what the second derivative adds

The first derivative reports whether a curve is climbing. The second reports
whether the climb is getting steeper. Positive second derivative means the
tangent lines lie below the curve and the graph holds water; negative means the
opposite. A point where the second derivative changes sign is an **inflection**,
and the change of sign is the requirement - a second derivative that merely
touches zero without crossing is not an inflection.

$$f'' > 0 \\Rightarrow \\text{concave up}, \\qquad f'' < 0 \\Rightarrow \\text{concave down}$$

In circuit language, the first derivative of a capacitor's voltage is
proportional to its current and the second is proportional to the rate of change
of that current. A charging capacitor has climbing voltage and falling current,
so its voltage curve is rising and concave down at the same time - which is
exactly what an exponential approach to a final value looks like.

## 9.2 Worked example: the complete anatomy of a quartic

Analyse $f(x) = 3x^{4} - 16x^{3} + 18x^{2}$ completely.

**Critical points.** Differentiate and factor:

$$f'(x) = 12x^{3} - 48x^{2} + 36x = 12x(x-1)(x-3)$$

so the critical points are x = 0, x = 1 and x = 3.

**Classification.** The second derivative is

$$f''(x) = 36x^{2} - 96x + 36$$

Evaluating: $f''(0) = 36 > 0$, a local minimum; $f''(1) = -24 < 0$, a local
maximum; $f''(3) = 72 > 0$, a local minimum. The values there are f(0) = 0,
f(1) = 5 and f(3) = -27, so the deeper of the two minima is the one on the right,
and the exam's favourite trap - reporting the first minimum you find as the
global one - is defused by comparing values rather than stopping at the first
sign test.

**Inflections.** Set the second derivative to zero:

$$36x^{2} - 96x + 36 = 0 \\quad\\Longrightarrow\\quad x = \\frac{8 \\pm \\sqrt{28}}{6}$$

giving x = 0.45142 and x = 2.21525, where f takes the values 2.3207 and -13.3578.
Both are genuine inflections because a quadratic with distinct roots changes sign
at each of them.

![Three stacked panels sharing an x axis. The top panel is a quartic with turning points at zero, one and three; the middle panel is its first derivative crossing zero at exactly those three places; the bottom panel is the second derivative, a parabola crossing zero at 0.4514 and 2.2153, which are the inflection abscissas.](/courses/fe-ee/figures/math3-dc-concavity.svg)

Reading the three panels downward is the whole procedure: a turning point in the
top panel always sits above a zero crossing in the middle panel, and an
inflection in the top panel always sits above a zero crossing in the bottom one.

## 9.3 When the second-derivative test is silent

If $f''$ is zero at a critical point the test returns nothing, and you must fall
back on the sign of $f'$ on either side.

| behaviour of f' near the critical point | conclusion |
|---|---|
| positive then negative | local maximum |
| negative then positive | local minimum |
| positive then positive | no extremum, a shelf |
| negative then negative | no extremum, a shelf |

For $f = x^{4}$ at the origin, $f'' = 12x^{2}$ vanishes, yet $f' = 4x^{3}$ goes
from negative to positive and the point is a minimum. For $f = x^{3}$ at the
origin, $f''$ also vanishes but $f'= 3x^{2}$ stays positive on both sides and the
point is a shelf, not an extremum. Two functions, the same silent test, opposite
answers - which is why the fallback is not optional.

## 9.4 Worked example: Newton's method, a derivative put to work

Root finding is where the tangent line stops being a picture and starts being an
algorithm. Approximate the curve near a guess by its tangent, then take the
tangent's own root as the next guess:

$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}$$

Solve $x^{3} - 2x - 5 = 0$ starting from x = 2. Here $f'(x) = 3x^{2} - 2$.

**First step.** $f(2) = 8 - 4 - 5 = -1$ and $f'(2) = 12 - 2 = 10$, so
$x_1 = 2 + 0.1 = 2.1$.

**Second step.** $f(2.1) = 9.261 - 4.2 - 5 = 0.061$ and
$f'(2.1) = 3 \\times 4.41 - 2 = 11.23$, so the correction is
$0.061 / 11.23 = 0.005432$ and $x_2 = 2.1 - 0.005432 = 2.094568$.

**Third step** gives 2.0945515, and a bracketing solver agrees to that same digit.

| iteration | estimate | value of f there |
|---|---|---|
| 0 | 2.000000 | -1.0 |
| 1 | 2.100000 | 6.1e-2 |
| 2 | 2.0945681 | 1.9e-4 |
| 3 | 2.09455148 | 1.7e-9 |

The number of correct digits roughly doubles each pass, which is what quadratic
convergence means and why two hand iterations usually suffice. The method fails
where the derivative is near zero, because the tangent is then nearly horizontal
and throws the next guess far away - a failure mode worth naming, because the
exam's version of it is a question whose starting point sits at a turning
point.`,
  examTip: 'Classify a critical point with f-double-prime, then compare the actual function values before naming a global maximum or minimum. On a closed interval the endpoints are candidates too, and they are not found by any derivative test.',
  importantNote: 'A zero second derivative is not an inflection on its own; the second derivative must change SIGN there. For f = x to the fourth at the origin the second derivative is zero and the point is a minimum, not an inflection.',
},
{
  id: 'dc-optimisation',
  title: '10. Optimisation on Engineering Objectives',
  content: `## 10.1 The procedure, including the step everyone skips

Optimisation on this exam is mechanical once written down:

1. Name the quantity to be optimised and write it as a formula.
2. Use the constraint to eliminate every variable but one.
3. Differentiate, set to zero, solve.
4. Classify with the second derivative, **and** evaluate at any endpoints of the
   allowed interval.
5. Sanity check the answer against physical expectation.

Step 4 is the one that gets dropped. On a closed interval the extreme value may
sit at an endpoint where the derivative never vanishes at all, and a derivative
with no interior root is not a contradiction - it is a signal to evaluate the
ends. For $f(x) = x^{3} - 3x$ on the interval from 0 to 3, the only interior
critical point is x = 1 with f = -2, but the maximum over the interval is f(3) =
18, found by evaluation and not by differentiation.

## 10.2 Worked example: maximum power transfer, and what it costs

A source of open-circuit voltage V and internal resistance $R_s$ drives a load
$R_L$. The current is $V/(R_s + R_L)$, so the load power is

$$P(R_L) = \\frac{V^{2}R_L}{(R_s + R_L)^{2}}$$

Differentiate by the quotient rule and cancel one factor of $(R_s + R_L)$ from
every term:

$$\\frac{dP}{dR_L} = \\frac{V^{2}(R_s - R_L)}{(R_s + R_L)^{3}}$$

The numerator vanishes only at $R_L = R_s$, and the sign of that numerator flips
from positive to negative there, so it is a maximum. Substituting back:

$$P_{max} = \\frac{V^{2}R_s}{(2R_s)^{2}} = \\frac{V^{2}}{4R_s}$$

**With numbers.** Take V = 24 V and $R_s$ = 8 ohm. Then $P_{max}$ is
$576 / 32 = 18$ W at a matched load. Now test how sharp that peak is by halving
and doubling the load:

$$576 \\times 4 / 144 = 16\\ \\mathrm{W} \\qquad 576 \\times 16 / 576 = 16\\ \\mathrm{W}$$

Both give 16 W, which is 88.9 per cent of the peak. The peak is symmetric in the
**ratio** of load to source resistance, not in the difference, and it is broad -
a 2:1 mismatch costs only about 11 per cent of the available power.

![Load power and efficiency plotted against the ratio of load to source resistance for a 24 volt source behind 8 ohms. Power peaks at a ratio of one, where efficiency is exactly one half, and the points at ratios of one half and two both sit at 88.9 per cent of the peak power.](/courses/fe-ee/figures/math3-dc-power-transfer.svg)

**The cost.** Efficiency is the fraction of source power that reaches the load:

$$\\eta = \\frac{R_L}{R_s + R_L}$$

At the matched point that is exactly 50 per cent: the source dissipates as much
as the load. Total source power is $576 / 16 = 36$ W of which 18 W is delivered.
This is why matched loading is the right criterion for a signal source, where the
power available is tiny and the point is to capture it, and completely the wrong
criterion for a distribution system, where throwing away half the generated
energy would be indefensible. Push the ratio to 4 and efficiency rises to 80 per
cent while delivered power falls to 11.52 W, which is 64 per cent of the peak.

## 10.3 Worked example: economic conductor size, by calculus

An optimisation with two competing costs is the most examinable form of the
question, and conductor sizing is the classic. A larger cross-section costs more
to buy but wastes less energy; the cheapest size balances the two.

Let A be the cross-sectional area in square millimetres over a run of length L.
Resistance is $\\rho L/A$, so the annual cost of losses is

$$C_{loss} = \\frac{I^{2}\\rho L\\, h\\, c_e}{A} = \\frac{\\beta}{A}$$

with h the equivalent full-load hours per year and $c_e$ the energy price. The
annualised cost of the conductor itself is proportional to its area, $\\alpha A$.
The total is

$$C(A) = \\alpha A + \\frac{\\beta}{A}$$

$$\\frac{dC}{dA} = \\alpha - \\frac{\\beta}{A^{2}} = 0 \\quad\\Longrightarrow\\quad A^{*} = \\sqrt{\\frac{\\beta}{\\alpha}}$$

Substituting that back shows something more useful than the formula: at the
optimum $\\alpha A^{*} = \\beta/A^{*}$, so **the annual capital charge equals the
annual cost of losses**. That equality is Kelvin's law, and it is a check you can
apply to any proposed answer without redoing the algebra.

**With numbers.** Take I = 200 A over L = 250 m of annealed copper, for which the
tabulated resistivity at 20 degrees Celsius is 1.72e-8 ohm-metre, at 3000
equivalent full-load hours per year and an energy price of 0.12 per kilowatt
hour. One square millimetre of that run has resistance 4.3 ohm, so with the current
squared in amperes squared, the hours expressed in thousands so the product is
already in kilowatt hours, and the price per kilowatt hour,

$$\\beta = 40000 \\times 4.3 \\times 3.0 \\times 0.12 = 61920$$

in cost units times square millimetres per year. With an annualised conductor
charge of 0.015 per metre of run per square millimetre, $\\alpha = 0.015 \\times 250 = 3.75$
per square millimetre per year. Then

$$61920 / 3.75 = 16512 \\quad\\Longrightarrow\\quad A^{*} = \\sqrt{16512} = 128.5\\ \\mathrm{mm}^{2}$$

Check Kelvin's law: capital is $3.75 \\times 128.5 = 481.9$ and losses are
$61920 / 128.5 = 481.9$, equal as promised, for a total of
$2 \\times 481.87 = 963.74$ per year.

![Annualised capital cost rising linearly with conductor area, loss cost falling as its reciprocal, and their sum. The total has a flat minimum at 128.5 square millimetres, exactly where the rising and falling curves cross at 481.87 cost units per year each.](/courses/fe-ee/figures/math3-dc-kelvin-law.svg)

The minimum is remarkably flat, and that flatness is the practical result. At
100 square millimetres the total is $3.75 \\times 100 + 619.2 = 994.2$, and at
160 it is $3.75 \\times 160 + 387 = 987.0$ - both within three per cent of the
optimum. Any standard size in that band is defensible, which is why real cable
schedules are not built from square roots.

## 10.4 Worked example: the cheapest cylindrical enclosure

A cylindrical can, open at the top, must hold 1000 cubic centimetres. Minimise
the material used.

Surface area is the base plus the wall, and the volume constraint gives
$h = 1000/(\\pi r^{2})$:

$$A(r) = \\pi r^{2} + 2\\pi r h = \\pi r^{2} + \\frac{2000}{r}$$

$$\\frac{dA}{dr} = 2\\pi r - \\frac{2000}{r^{2}} = 0 \\quad\\Longrightarrow\\quad r^{3} = \\frac{1000}{\\pi}$$

so r = 6.828 cm, and the height is $1000/(\\pi r^{2}) = 6.828$ cm as well. The
optimal open can is exactly as tall as it is wide in radius - not a coincidence
but a consequence of the exponents in the two terms. The area there is
$3\\pi r^{2} = 439.38$ square centimetres. Confirm it is a minimum:
$A'' = 2\\pi + 4000/r^{3} > 0$ for every positive r, so the curve is concave up
everywhere and the single critical point is the global minimum.

| container | constraint | optimal proportion |
|---|---|---|
| closed box, square base | fixed volume | a cube |
| open-top cylinder | fixed volume | height equals radius |
| closed cylinder | fixed volume | height equals diameter |
| resistive load on a source | fixed source resistance | load equals source resistance |

The pattern in that table is worth carrying: optimisation answers are almost
always symmetric or equal-split, and an answer that comes out lopsided by an
order of magnitude usually means the constraint was substituted into the wrong
variable.`,
  examTip: 'On a closed interval, evaluate the endpoints as well as the interior critical points. A derivative that never vanishes inside the interval means the extreme value sits at an end, not that the problem is broken.',
  importantNote: 'Maximum power transfer and maximum efficiency are different targets. Matching the load to the source maximises delivered power and pins efficiency at exactly 50 per cent, which is acceptable for a signal source and unacceptable for a power system.',
},
{
  id: 'dc-rates-limits',
  title: '11. Related Rates and Indeterminate Limits',
  content: `## 11.1 Related rates: write the relationship before you differentiate

A related-rate question gives one rate and asks for another. The step that
decides the outcome comes before any calculus: write the **geometric or physical
relationship between the quantities**, in full, and only then differentiate it
with respect to time. Differentiating first and patching the relationship in
afterwards is where the errors live.

The chain rule does all the work, because every variable is a function of time:

$$\\frac{dQ}{dt} = \\frac{dQ}{dx}\\cdot\\frac{dx}{dt}$$

## 11.2 Worked example: three related-rate setups

**A resistive heater.** A fixed 50 ohm element carries a current rising at
0.2 A/s. How fast is its dissipation rising when the current is 3 A?

Relationship first: $P = I^{2}R$ with R constant. Differentiate:

$$\\frac{dP}{dt} = 2IR\\frac{dI}{dt} = 2 \\times 3 \\times 50 \\times 0.2 = 60\\ \\mathrm{W/s}$$

The answer depends on the present current, so the same current ramp heats a
running element far faster than a cold one - the physical content of the factor
2I.

**A draining tank.** A cone stands apex down, 2 m in radius at a height of 4 m,
and drains at 0.5 cubic metres per minute. How fast is the surface falling when
the depth is 3 m?

Relationship first. Similar triangles give $r = h/2$, so

$$V = \\frac{\\pi}{3}r^{2}h = \\frac{\\pi h^{3}}{12}$$

$$\\frac{dV}{dt} = \\frac{\\pi h^{2}}{4}\\cdot\\frac{dh}{dt}$$

At h = 3 the coefficient is $9\\pi/4 = 7.0686$ square metres, so the surface
descends at $0.5 / 7.0686 = 0.0707$ metres per minute. Substituting r = 2 instead
of r = h/2 is the intended trap; it treats the cone as a cylinder and gives a
level falling at a constant rate, which is qualitatively wrong.

**A sliding ladder.** A 5 m ladder has its base pulled away from a wall at
0.6 m/s. How fast is the top descending when the base is 3 m out?

Relationship first: $x^{2} + y^{2} = 25$, so $y = 4$ at that instant.
Differentiating,

$$2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0 \\quad\\Longrightarrow\\quad \\frac{dy}{dt} = -\\frac{x}{y}\\frac{dx}{dt} = -0.45\\ \\mathrm{m/s}$$

The top falls more slowly than the base moves at this instant, and faster than it
later - as y approaches zero the ratio x/y blows up, which is why the last part
of the fall is the dangerous part.

## 11.3 The seven indeterminate forms

L'Hopital's rule is licensed for exactly two forms and no others. The remaining
five must be **converted** into one of those two first.

| form | how to convert | example |
|---|---|---|
| 0/0 | apply the rule directly | $\\lim_{x \\to 0}\\sin x / x = 1$ |
| infinity over infinity | apply the rule directly | $\\lim_{x \\to \\infty} x^{2}/e^{x} = 0$ |
| zero times infinity | write one factor as a reciprocal | $x\\ln x = \\ln x / (1/x)$ |
| infinity minus infinity | combine over a common denominator | subtract two reciprocals first |
| one raised to infinity | take logarithms, then use zero times infinity | the compound-interest limit |
| zero to the zero | take logarithms | rewrite as an exponential of a product |
| infinity to the zero | take logarithms | rewrite as an exponential of a product |

The rule itself, once the form qualifies:

$$\\lim_{x \\to a}\\frac{f(x)}{g(x)} = \\lim_{x \\to a}\\frac{f'(x)}{g'(x)}$$

Note that this differentiates numerator and denominator **separately**. It is not
the quotient rule, and applying the quotient rule here is a distinct and common
error that produces a plausible wrong number.

## 11.4 Worked example: four limits, one of which is a trap

**Substituting gives 0/0, so the rule applies.**

$$\\lim_{x \\to 0}\\frac{1 - \\cos x}{x^{2}} = \\lim_{x \\to 0}\\frac{\\sin x}{2x} = \\lim_{x \\to 0}\\frac{\\cos x}{2} = \\frac{1}{2}$$

Two applications were needed, because the first pass left another 0/0. Evaluating
the original expression numerically at x = 0.0001 gives 0.5 to eight decimals.
This limit is why the small-angle expansion of the cosine starts at
$1 - x^{2}/2$.

**A zero-times-infinity form.** For $\\lim_{x \\to 0^{+}} x\\ln x$, neither factor
qualifies alone. Write it as $\\ln x/(1/x)$, which is infinity over infinity:

$$\\lim_{x \\to 0^{+}}\\frac{\\ln x}{1/x} = \\lim_{x \\to 0^{+}}\\frac{1/x}{-1/x^{2}} = \\lim_{x \\to 0^{+}}(-x) = 0$$

The logarithm's divergence is beaten by the linear factor, which is the general
result that any positive power of x beats a logarithm.

**A one-to-the-infinity form.** For $\\lim_{n \\to \\infty}(1 + 3/n)^{n}$, take
logarithms: $n\\ln(1 + 3/n)$ is zero times infinity, rewrite as
$\\ln(1+3/n)/(1/n)$, apply the rule once and get 3. Exponentiating,
the limit is $e^{3} = 20.0855$. Continuous compounding, and the transformation of
a discrete-time filter into its continuous equivalent, are both this limit.

**And the trap.** Consider $\\lim_{x \\to 0}(x + 1)/x$. Substituting gives 1/0,
which is **not** indeterminate - it diverges. Differentiating top and bottom
anyway gives 1/1 = 1, a confident and completely wrong answer, and it is
invariably among the offered choices. Substitute first, every time, and confirm
the form qualifies before touching the rule.`,
  examTip: 'Substitute before you differentiate. Only 0/0 and infinity over infinity permit L Hopital directly; the other five indeterminate forms must be rewritten into one of those two, usually by taking a reciprocal or a logarithm.',
  importantNote: 'In a related-rates problem, write the relationship between the variables BEFORE differentiating, and only substitute the instantaneous values AFTER. Substituting a value that is itself changing - the radius of a cone at one particular depth, for instance - freezes a variable that should have been differentiated.',
},
{
  id: 'dc-series',
  title: '12. Taylor Series With a Remainder You Can Trust',
  content: `## 12.1 Where the coefficients come from

Suppose a function can be written as a power series about a point a:

$$f(x) = c_0 + c_1(x-a) + c_2(x-a)^{2} + c_3(x-a)^{3} + \\cdots$$

Setting x = a kills every term but the first, so $c_0 = f(a)$. Differentiate once
and set x = a again: only the linear term survives, so $c_1 = f'(a)$.
Differentiate twice and the quadratic term contributes $2c_2$, so
$c_2 = f''(a)/2$. Continuing, the k-th differentiation brings down a factor of
k factorial:

$$c_k = \\frac{f^{(k)}(a)}{k!} \\quad\\Longrightarrow\\quad f(x) = \\sum_{k=0}^{\\infty}\\frac{f^{(k)}(a)}{k!}(x-a)^{k}$$

A series about a = 0 is called a **Maclaurin** series; the three that must be
known cold are

$$e^{x} = 1 + x + \\frac{x^{2}}{2!} + \\frac{x^{3}}{3!} + \\cdots$$

$$\\sin x = x - \\frac{x^{3}}{3!} + \\frac{x^{5}}{5!} - \\cdots$$

$$\\cos x = 1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!} - \\cdots$$

Sine is odd and its series contains only odd powers; cosine is even and contains
only even powers. That symmetry is a free check on any series you write down
under pressure.

## 12.2 The remainder, and why it matters

Truncating a series leaves an error, and Taylor's theorem bounds it. If the
polynomial is taken through the term in $(x-a)^{n}$, the remainder is

$$R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-a)^{n+1}$$

for some unknown point $\\xi$ between a and x. The point is unknown, but a bound
on the derivative over the interval turns this into a usable number - and for the
sine and cosine every derivative is bounded by 1, which makes the bound trivial
to apply.

## 12.3 Worked example: three terms of sine, with the error bounded and then measured

Estimate $\\sin(0.5)$ and bound the error.

$$\\sin(0.5) \\approx 0.5 - \\frac{0.5^{3}}{6} + \\frac{0.5^{5}}{120}$$

The terms are $0.125 / 6 = 0.0208333$ and $0.03125 / 120 = 0.00026042$, giving
partial sums

| terms kept | value | error against sin 0.5 |
|---|---|---|
| 1 | 0.5000000 | 2.06e-2 |
| 2 | $0.5 - 0.0208333 = 0.4791667$ | -2.59e-4 |
| 3 | $0.4791667 + 0.0002604 = 0.4794271$ | 1.54e-6 |

The true value is 0.4794255, so the three-term error is 1.5447e-6.

**Now bound it in advance.** The polynomial ends in $x^{5}$, and because the
$x^{6}$ coefficient of sine is zero this is the sixth-order Taylor polynomial, so
the remainder carries $x^{7}/7!$. Every derivative of sine is bounded by 1, so

$$\\lvert R \\rvert \\le \\frac{0.5^{7}}{5040} = 0.0078125 / 5040 = 0.00000155$$

The bound is 1.5501e-6 against a true error of 1.5447e-6 - larger, as a bound
must be, and larger by only 0.35 per cent. A bound that tight is worth quoting
rather than guessing at.

![The sine curve with its one-term, two-term and three-term Maclaurin polynomials overlaid. Each extra term tracks the sine over a wider interval before diverging, and at half a radian the three-term sum is 0.4794271 against a true 0.4794255.](/courses/fe-ee/figures/math3-dc-taylor-sine.svg)

![Absolute truncation error of the one, two and three term sine polynomials on a logarithmic vertical axis, together with the Lagrange bound x to the seventh over seven factorial. The bound lies just above the three-term error across the whole range.](/courses/fe-ee/figures/math3-dc-taylor-error.svg)

## 12.4 Worked example: how far the small-angle approximation can be pushed

The approximations $\\sin\\theta \\approx \\theta$ and $\\cos\\theta \\approx 1$
underpin the linearised pendulum, the paraxial ray, and the small-signal analysis
of a phase detector. The series says exactly what they cost:

$$\\frac{\\theta}{\\sin\\theta} - 1 \\approx \\frac{\\theta^{2}}{6}$$

| angle | radians | sine | relative error of using the angle |
|---|---|---|---|
| 5 degrees | 0.087266 | 0.087156 | 0.127 per cent |
| 10 degrees | 0.174533 | 0.173648 | 0.510 per cent |
| 15 degrees | 0.261799 | 0.258819 | 1.152 per cent |
| 20 degrees | 0.349066 | 0.342020 | 2.060 per cent |
| 30 degrees | 0.523599 | 0.500000 | 4.720 per cent |

The error quadruples when the angle doubles, exactly as a leading $\\theta^{2}$
term predicts, and the substitution is worth about one per cent up to roughly 14
degrees. A question that asks for the largest angle meeting a stated error
budget is asking you to invert this table, not to look it up.

## 12.5 The binomial series, and linearisation in general

For any real exponent,

$$(1 + x)^{p} = 1 + px + \\frac{p(p-1)}{2}x^{2} + \\cdots$$

so $\\sqrt{1+x} \\approx 1 + x/2 - x^{2}/8$. At x = 0.1 the two-term form gives
1.05 and the three-term form 1.04875 against a true 1.048809 - the quadratic term
recovers most of the error the linear term leaves.

The general first-order statement is the one the exam uses:

$$f(x) \\approx f(a) + f'(a)(x - a)$$

That is the small-signal model. Replace f by a diode characteristic and the slope
$f'(a)$ is the conductance at the operating point; replace it by an amplifier
transfer curve and the slope is the small-signal gain. Every linear model in this
exam is the first two terms of a Taylor series, and every statement about
distortion is a claim about the terms that were discarded.`,
  examTip: 'For the sine and cosine every derivative is bounded by one, so the Lagrange remainder reduces to the size of the first omitted power divided by its factorial. That makes the error bound a two-second calculation rather than an estimate.',
  importantNote: 'Linearisation f(x) is approximately f(a) plus f-prime(a) times (x minus a) IS the small-signal model used throughout electronics. The terms discarded are exactly the distortion, which is why a larger signal swing degrades linearity.',
},
{
  id: 'dc-partials',
  title: '13. Partial Derivatives, the Gradient and Error Propagation',
  content: `## 13.1 Partial derivatives and the total differential

When a quantity depends on several variables, differentiate with respect to one
and hold the rest fixed. That is all a partial derivative is, and the curly
symbol only signals that other variables exist.

For $P = V^{2}/R$:

$$\\frac{\\partial P}{\\partial V} = \\frac{2V}{R}, \\qquad \\frac{\\partial P}{\\partial R} = -\\frac{V^{2}}{R^{2}}$$

The **total differential** assembles the separate sensitivities into the change
produced by moving every variable at once:

$$dP = \\frac{\\partial P}{\\partial V}dV + \\frac{\\partial P}{\\partial R}dR$$

Divide through by P to get the relative form, which is usually the one wanted:

$$\\frac{dP}{P} = 2\\frac{dV}{V} - \\frac{dR}{R}$$

The coefficients are the exponents in the original formula, and that is a general
rule for any product of powers: **a variable raised to the power n contributes n
times its own relative error.** Voltage enters squared, so a one per cent error
in voltage becomes a two per cent error in power.

## 13.2 The gradient and the directional derivative

Collect the partial derivatives into a vector:

$$\\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{i} + \\frac{\\partial f}{\\partial y}\\mathbf{j} + \\frac{\\partial f}{\\partial z}\\mathbf{k}$$

The rate of change along a unit vector $\\mathbf{u}$ is the projection of the
gradient onto it:

$$D_{\\mathbf{u}}f = \\nabla f \\cdot \\mathbf{u} = \\lvert \\nabla f \\rvert \\cos\\theta$$

Three consequences follow immediately, and all three are examinable. The
steepest ascent is along the gradient itself, where the cosine is 1. The
steepest descent is opposite to it. And along any direction perpendicular to the
gradient the rate of change is zero, which means **the gradient is normal to the
level curves**.

For $f = x^{2} + 3y^{2}$ the gradient is $(2x, 6y)$, which at the point (2, 1) is
(4, 6) with magnitude $\\sqrt{52} = 7.2111$. Along the unit vector (0.6, 0.8) the
directional derivative is $4 \\times 0.6 + 6 \\times 0.8 = 7.2$, just short of the
gradient's own magnitude because that direction is close to, but not exactly,
the steepest one. Along (1, 0) it is only 4.

![Elliptical level curves of x squared plus three y squared, with the gradient vector at the point two comma one drawn crossing the contours at right angles, and a shorter horizontal arrow showing that the eastward direction achieves a slope of only four against the gradient magnitude of 7.2111.](/courses/fe-ee/figures/math3-dc-gradient.svg)

In electrostatics this is the whole relationship between potential and field:
$\\mathbf{E} = -\\nabla V$. The field points down the steepest potential gradient,
and equipotential surfaces are exactly the level surfaces the field crosses at
right angles.

## 13.3 Worked example: tolerance stack-up in a power calculation

A resistor dissipates $P = V^{2}/R$ with V = 120 V known to 1 per cent and
R = 60 ohm known to 5 per cent. Report the power and its uncertainty.

The nominal value is $120 \\times 120 / 60 = 240$ W.

**Worst case** adds the magnitudes of the contributions, on the assumption that
every error conspires:

$$\\left\\lvert\\frac{dP}{P}\\right\\rvert \\le 2 \\times 0.01 + 0.05 = 0.07$$

so plus or minus 7 per cent, which is $0.07 \\times 240 = 16.8$ W.

**Root-sum-square** is appropriate when the errors are independent and random:

$$\\frac{\\sigma_P}{P} = \\sqrt{(2 \\times 0.01)^{2} + (0.05)^{2}}, \\qquad 0.0004 + 0.0025 = 0.0029, \\qquad \\sqrt{0.0029} = 0.05385$$

which is 5.385 per cent, or 12.9 W - noticeably tighter, and the reason
instrument specifications distinguish the two.

**Check the linear estimate against exact evaluation.** At the extreme corner
V = 121.2 and R = 57, the true power is $14689.44 / 57 = 257.7$ W, which is
7.379 per cent high. At the opposite corner, $14113.44 / 63 = 224.0$ W, which is
6.657 per cent low. The differential predicted 7 per cent both ways; the truth is
slightly more on the high side and slightly less on the low side, because the
differential is a first-order estimate of a curved function. For tolerances of a
few per cent that asymmetry is negligible, and knowing it exists is what stops
you trusting the linear figure at 50 per cent tolerance.

| quantity | relative sensitivity | 1 per cent change gives |
|---|---|---|
| $P = V^{2}/R$ with respect to V | 2 | 2 per cent |
| $P = V^{2}/R$ with respect to R | -1 | -1 per cent |
| $P = I^{2}R$ with respect to I | 2 | 2 per cent |
| $f = 1/(2\\pi\\sqrt{LC})$ with respect to L | -0.5 | -0.5 per cent |
| $W = \\tfrac{1}{2}CV^{2}$ with respect to V | 2 | 2 per cent |

## 13.4 Worked example: which resistor to buy tight

Two resistors in parallel give $R_p = R_1R_2/(R_1 + R_2)$. With $R_1$ = 100 ohm
and $R_2$ = 400 ohm the combination is 80 ohm. Which one deserves the tighter
tolerance?

Differentiate with respect to each in turn. The quotient rule gives a result
worth remembering in its own right:

$$\\frac{\\partial R_p}{\\partial R_1} = \\left(\\frac{R_2}{R_1 + R_2}\\right)^{2}, \\qquad \\frac{\\partial R_p}{\\partial R_2} = \\left(\\frac{R_1}{R_1 + R_2}\\right)^{2}$$

Numerically that is $(400/500)^{2} = 0.64$ and $(100/500)^{2} = 0.04$. The
combination is $0.64 / 0.04 = 16$ times as sensitive to the smaller resistor.
Spend the tolerance budget there. A central-difference check confirms the
sensitivity: raising $R_1$ by one ohm actually raises $R_p$ by 0.63872 ohm
against the linear prediction of 0.64.

The general statement is that **the smaller element in a parallel pair dominates
both the value and its uncertainty**, which is the same fact as the parallel
combination always being smaller than the smallest member, seen through a
derivative.`,
  examTip: 'For any product of powers, the relative error of the result is the sum of the relative errors of the inputs weighted by their exponents. Read the exponents straight off the formula rather than differentiating term by term.',
  importantNote: 'The gradient is perpendicular to level curves and points toward steepest increase. E equals minus grad V is that statement applied to potential, which is why field lines meet equipotentials at right angles.',
},
{
  id: 'dc-set-b',
  title: '14. Problem Set: Differentiation Under Exam Conditions',
  content: `## 14.1 Problem Set A: rules, chains and rates

Work each one before reading the solution. Every solution names the distractor
and the wrong number it produces, because recognising your own error is worth
more than the right answer.

**Problem 1.** Differentiate $f(x) = (2x + 1)^{5}$ and evaluate at x = 1.

Chain rule with outer power 5 and inner derivative 2:

$$f'(x) = 5(2x+1)^{4}\\cdot 2 = 10(2x+1)^{4}$$

At x = 1 the bracket is 3, so $f'(1) = 10 \\times 81 = 810$.

*The trap.* Dropping the inner derivative gives $5 \\times 81 = 405$, exactly half the
truth, and 405 always appears among the choices. Any time the argument is not a
bare x, the inner derivative is owed.

**Problem 2.** Differentiate $f(x) = \\ln(3x^{2} + 1)$ at x = 2.

$$f'(x) = \\frac{6x}{3x^{2} + 1}$$

At x = 2 that is $12 / 13 = 0.9231$.

*The trap.* Writing the answer as $1/(3x^{2}+1) = 1/13 = 0.0769$ forgets that the
derivative of a logarithm is the inner derivative over the argument, not one over
the argument.

**Problem 3.** A 50 microfarad capacitor has $v(t) = 100\\sin(377t)$ volts across
it. Find the peak current.

$$i = C\\frac{dv}{dt} = 50 \\times 10^{-6} \\times 100 \\times 377\\cos(377t)$$

The amplitude is $0.00005 \\times 37700 = 1.885$ A.

*The trap.* Omitting the 377 gives 5 mA, three orders of magnitude low. The
angular frequency is part of the derivative, which is the whole reason capacitive
reactance falls with frequency.

**Problem 4.** Differentiate $f(x) = \\tan^{2}x$ at x = 0.4 rad.

Chain rule with outer square and inner tangent:

$$f'(x) = 2\\tan x\\sec^{2}x$$

At x = 0.4, $\\tan = 0.422793$ and $\\sec^{2} = 1.178755$, so
$f'(0.4) = 2 \\times 0.422793 \\times 1.178755 = 0.99674$.

*The trap.* Answering $\\sec^{2}x$ differentiates the tangent but forgets the
outer square, giving 1.1788. Answering $2\\tan x$ does the reverse, giving
0.8456.

## 14.2 Two rates from a single circuit

**Problem 5.** A 0.4 H inductor carries $i(t) = 5(1 - e^{-t/0.02})$ amperes.
Find the voltage across it at t = 0 and at t = 20 ms.

$$v = L\\frac{di}{dt} = 0.4 \\times 5 \\times \\frac{1}{0.02}e^{-t/0.02} = 100e^{-t/0.02}$$

At t = 0 that is 100 V; at t = 20 ms, one time constant, it is
$100 \\times 0.367879 = 36.79$ V.

*The trap.* Differentiating $-e^{-t/0.02}$ to $-e^{-t/0.02}/0.02$ loses a sign
and produces -100 V, a voltage that opposes the physics. The two sign reversals -
one from the minus in front of the exponential, one from the negative exponent -
must both be applied.

**Problem 6.** For a voltage divider $V_o = 100R_2/(R_1 + R_2)$ with
$R_1 = R_2 = 1000$ ohm, how much does the output move per ohm of change in
$R_2$?

$$\\frac{\\partial V_o}{\\partial R_2} = \\frac{100R_1}{(R_1+R_2)^{2}}, \\qquad 100000 / 4000000 = 0.025\\ \\mathrm{V/ohm}$$

So one ohm of drift moves the output by 25 mV, and one per cent of drift on a
1000 ohm resistor moves it by 250 mV out of 50 V - half a per cent, exactly half
the resistor's own error, because at equal resistances the divider is at its most
forgiving.

*The trap.* Differentiating as though the denominator were constant gives
$100/2000 = 0.05$ V per ohm, double the truth, because $R_2$ appears in both
numerator and denominator and the quotient rule is not optional.

## 14.3 Implicit and logarithmic work

**Problem 7.** Find $dy/dx$ for $x^{2}y + y^{3} = 10$ at the point where x = 3
and y = 1.

Differentiate term by term, remembering the product rule on the first:

$$2xy + x^{2}\\frac{dy}{dx} + 3y^{2}\\frac{dy}{dx} = 0$$

$$\\frac{dy}{dx} = -\\frac{2xy}{x^{2} + 3y^{2}} = -\\frac{6}{12} = -0.5$$

*The trap.* Treating $x^{2}y$ as a single power and differentiating it to $2xy$
alone forgets that y also varies, and the resulting -0.25 is offered.

**Problem 8.** Differentiate $y = 2^{x}$.

Take logarithms: $\\ln y = x\\ln 2$, so $y'/y = \\ln 2$ and

$$\\frac{d}{dx}2^{x} = 2^{x}\\ln 2 = 0.693147 \\times 2^{x}$$

*The trap.* Applying the power rule to give $x2^{x-1}$ treats a constant base as
if it were the variable. The test is that the power rule needs the variable in
the base; the exponential rule needs it in the exponent.`,
},
{
  id: 'dc-set-c',
  title: '15. Problem Set: Optima, Limits and Series',
  content: `## 15.1 Problem Set B: optimisation

**Problem 1.** A rectangular field is bounded on one side by a straight river and
needs fencing on the other three. With 400 m of fence available, maximise the
enclosed area.

Let x be the side parallel to the river and y each perpendicular side. The fence
constraint is $x + 2y = 400$, so $x = 400 - 2y$ and

$$A(y) = y(400 - 2y) = 400y - 2y^{2}$$

$$\\frac{dA}{dy} = 400 - 4y = 0 \\quad\\Longrightarrow\\quad y = 100$$

Then x = 200 and the area is 20000 square metres. Confirm with $A'' = -4 < 0$, a
maximum.

*The trap.* Assuming a square, as the closed-perimeter version of this problem
would suggest, gives sides of 400/3 and an area of 17778 square metres - 11 per
cent worse. The missing fourth side changes the optimum, and the answer is always
twice as wide as it is deep.

**Problem 2.** A load resistor is fed from a 30 V source with 5 ohm of internal
resistance. What load absorbs the most power, and how much is it?

By the derivation in section 10.2 the answer is $R_L = 5$ ohm, and

$$P_{max} = \\frac{V^{2}}{4R_s} = \\frac{900}{20} = 45\\ \\mathrm{W}$$

*The trap.* Computing $V^{2}/R_L = 900/5 = 180$ W ignores the voltage lost across
the internal resistance. At the matched point the load sees only half the source
voltage, and the factor of four in the denominator is where that halving, squared,
has gone.

**Problem 3.** A closed rectangular box with a square base must hold 2000 cubic
centimetres. Find the dimensions of least surface area.

With base side x and height h, $h = 2000/x^{2}$ and

$$S(x) = 2x^{2} + 4xh = 2x^{2} + \\frac{8000}{x}$$

$$\\frac{dS}{dx} = 4x - \\frac{8000}{x^{2}} = 0 \\quad\\Longrightarrow\\quad x^{3} = 2000$$

so x = 12.599 cm and h = 2000/158.74 = 12.599 cm: a cube, as it must be for a
closed box.

*The trap.* Using the open-top surface area $x^{2} + 4xh$ by mistake gives
$x^{3} = 4000$ and x = 15.874 cm. Read whether the box has a lid; the two answers
differ by 26 per cent in edge length.

## 15.2 Problem Set C: limits, series and error

**Problem 4.** Evaluate $\\lim_{x \\to 0}\\dfrac{\\tan x - x}{x^{3}}$.

Substitution gives 0/0. Three applications, or one substitution of the series
$\\tan x = x + x^{3}/3 + \\cdots$, both give

$$\\lim_{x \\to 0}\\frac{\\tan x - x}{x^{3}} = \\frac{1}{3}$$

Numerically at x = 0.001 the quotient is 0.333333, confirming it.

*The trap.* Stopping after one application leaves $(\\sec^{2}x - 1)/(3x^{2})$,
still 0/0. Declaring that indeterminate form to be zero because the numerator
vanishes gives an answer of 0.

**Problem 5.** Estimate $\\sqrt{101}$ using a first-order Taylor expansion about
100, and bound the error.

$$f(x) = \\sqrt{x}, \\quad f'(100) = \\frac{1}{2\\sqrt{100}} = 0.05$$

$$\\sqrt{101} \\approx 10 + 0.05 \\times 1 = 10.05$$

The true value is 10.049876, so the error is 1.24e-4. The remainder bound uses
$f'' = -1/(4x^{3/2})$, whose magnitude on the interval is at most
$1/4000 = 0.00025$, giving a bound of $0.00025 \\times 1 / 2 = 0.000125$ - just
above the true error, as required.

*The trap.* Expanding about 0 instead of 100. The square root has an infinite
derivative at the origin and no Maclaurin series at all; the expansion point must
be a nearby value at which the function and its derivatives are easy, which is
the whole art of the technique.

**Problem 6.** A resonant frequency is $f = 1/(2\\pi\\sqrt{LC})$. If L and C are
each known to 2 per cent, what is the uncertainty in f?

Both appear to the power minus one half, so

$$\\frac{df}{f} = -\\tfrac{1}{2}\\frac{dL}{L} - \\tfrac{1}{2}\\frac{dC}{C}$$

Worst case is $0.5 \\times 0.02 + 0.5 \\times 0.02 = 0.02$, that is 2 per cent. Root-sum-square
gives $\\sqrt{0.01^{2} + 0.01^{2}} = 0.01414$, that is 1.414 per cent.

*The trap.* Adding the tolerances to 4 per cent ignores the square root, which
halves each contribution. The exponent is the multiplier, and here it is one half
and negative.`,
},
],
  keyTakeaways: [
    'Derivative df/dx represents instantaneous rate of change; essential for i_C = C·dv/dt and v_L = L·di/dt.',
    'Product rule: (uv)\' = u\'v + uv\'; chain rule: dy/dx = (dy/du)·(du/dx).',
    'L\'Hopital\'s rule resolves 0/0 or ∞/∞ by differentiating top and bottom.',
    'Taylor linearization f(x) ≈ f(a) + f\'(a)(x-a) underpins small-signal analysis.',
    'Optimization: set f\'(x) = 0, check f\'\'(x) sign for max/min.',
  ],
},

fee_int_calc: {
  topicId: 'fee_int_calc',
  title: 'Integral Calculus',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Integration computes accumulated quantities — energy stored in capacitors and inductors, total charge, average power, and RMS values. Mastering integration techniques is essential for the FE Electrical exam.',
  sections: [
    {
      id: 'ic-fundamentals',
      title: '1. Integration Techniques and Common Integrals',
      content: `## 1.1 Fundamental Integrals

| Function | Integral |
|---|---|
| $x^n$ | $x^{n+1}/(n+1) + C (n \\ne -1)$ |
| 1/x | $\\ln \\lvert x\\rvert + C$ |
| $e^x$ | $e^x + C$ |
| $e^{ax}$ | $(1/a)e^{ax} + C$ |
| $\\sin (x)$ | $-\\cos (x) + C$ |
| $\\cos (x)$ | $\\sin (x) + C$ |

## 1.2 Integration Techniques

### Integration by Substitution (u-substitution)
Replace a composite expression with u, transform dx to du:
- Let u = g(x), then du = g'(x)dx
- ∫f(g(x))·g'(x)dx = ∫f(u)du

### Integration by Parts
**$\\int u dv = uv - \\int v du$**

Choose u and dv using **LIATE** priority: Logarithmic, Inverse trig, Algebraic, Trig, Exponential.

### The Fundamental Theorem of Calculus

**$d/dx[\\int _{a}^{x} f(t)dt] = f(x)$**

**$\\int _{a}^{b} f(x)dx = F(b) - F(a)$** where F is any antiderivative of f.`,
      examTip: 'Integration by parts (∫u dv = uv - ∫v du) appears when integrating products like t·e^(-t) which arise in transient circuit analysis. Use LIATE to choose u: pick the function that simplifies when differentiated.',
    },
    {
      id: 'ic-applications',
      title: '2. Engineering Applications of Integration',
      content: `## 2.1 Energy Storage

Integration computes energy stored in reactive elements:

- **Capacitor energy**: W = ∫₀ᵛ Cv dv = **$\\tfrac{1}{2} CV^{2}$**
- **Inductor energy**: W = ∫₀ⁱ Li di = **$\\tfrac{1}{2} LI^{2}$**

## 2.2 Charge and Current

Total charge is the integral of current:
- **$Q = \\int I dt$** (charge = area under current-time curve)

## 2.3 Average and RMS Values

- **Average value**: f_avg = (1/T)∫₀ᵀ f(t)dt
- **RMS value**: f_rms = sqrt[(1/T)∫₀ᵀ f²(t)dt]
- **Average power**: P_avg = (1/T)∫₀ᵀ p(t)dt = (1/T)∫₀ᵀ v(t)·i(t)dt

For a sinusoid v(t) = Vm·cos(ωt):
- **$V_{rms} = Vm / \\sqrt{2} \\approx 0.707\\cdot Vm$**

## 2.4 Improper Integrals

The **Laplace transform** uses an improper integral:
- **$F(s) = \\int _{0}^\\infty f(t)\\cdot e^{-st}dt$**

This integral converges when the exponential decay e^(-st) dominates the growth of f(t), defining the **region of convergence**.`,
      examTip: 'The three most important integration results for the FE exam: W = ½CV² (capacitor energy), W = ½LI² (inductor energy), and V_rms = V_peak/sqrt(2). These appear in power calculations, energy balance, and transient analysis.',
      importantNote: 'RMS (root mean square) is NOT the same as average. For a sinusoid, V_avg = 0 (over full cycle) but V_rms = Vm/sqrt(2). RMS is used because it gives the equivalent DC value that delivers the same power to a resistive load.',
    },
    {
      id: 'ic-worked',
      title: '3. Worked Examples',
      content: `## 3.1 The integral relations in circuits

The mirror images of the derivative relations, and just as directly examinable:

- Capacitor: **v(t) = (1/C) integral i dt + v(0)**. A 100 microfarad capacitor initially at 0 V, fed a constant 5 mA for 2 s, reaches v = (1/100e-6)(5e-3)(2) = **100 V**.
- Inductor: **i(t) = (1/L) integral v dt + i(0)**. A 2 H inductor across a constant 10 V for 0.4 s reaches i = (1/2)(10)(0.4) = **2 A**.

Charge is the integral of current: Q = integral i dt. A battery delivering 3 A for 20 minutes moves Q = 3 x 1200 = **3600 C**.

## 3.2 Average and rms by integration

Both are defined as integrals over one period T:

- Average: **(1/T) integral v dt**
- rms: **sqrt[(1/T) integral v^2 dt]**

For a sinusoid the average over a full cycle is zero and the rms is V_peak/sqrt(2). But the exam likes non-sinusoids, where you must actually integrate.

**Square wave**, ±V_m: v^2 = V_m^2 at all times, so the mean square is V_m^2 and V_rms = **V_m**. A square wave's rms equals its peak.

**Triangular wave**, ±V_m: integrating v^2 over the ramp gives a mean square of V_m^2/3, so V_rms = V_m/sqrt(3) = **0.577 V_m**.

**Half-wave rectified sinusoid**: the sinusoid is present for half the period, so the mean square is half that of a full sinusoid, giving V_rms = V_m/2.

## 3.3 Energy as an integral of power

Energy = integral p dt. A resistor carrying i(t) = 2e^(-t) A, with R = 10 ohm:

$$p(t) = i^2 R = 40 e^{-2t}\\ \\mathrm{W}$$

W = integral from 0 to infinity of 40 e^(-2t) dt = 40 x [(-1/2) e^(-2t)] from 0 to infinity = 40 x (1/2) = **20 J**.

Stored energy has closed forms worth knowing without integrating: **$(1/2) C V^2$** in a capacitor and **$(1/2) L I^2$** in an inductor.

## 3.4 Integration by parts, once

integral t e^(-2t) dt, which appears in first-moment and settling-time calculations.

Let u = t, dv = e^(-2t) dt. Then du = dt and v = (-1/2) e^(-2t).

integral = uv - integral v du = (-t/2) e^(-2t) + (1/2) integral e^(-2t) dt = (-t/2) e^(-2t) - (1/4) e^(-2t) + C

Evaluated from 0 to infinity: at infinity both terms vanish; at zero the value is -1/4. So the definite integral is **$1/4$**.`,
      examTip: 'Learn the rms of the standard waveforms rather than integrating under time pressure: sinusoid V_m/sqrt(2), square V_m, triangle V_m/sqrt(3), half-wave rectified sinusoid V_m/2. One of these appears on almost every sitting.',
      quiz: [
        {
          question: 'A constant 4 mA charges an initially uncharged 200 microfarad capacitor for 5 seconds. What is the final voltage?',
          options: ['100 V', '40 V', '4 V', '0.1 V'],
          correctIndex: 0,
          explanation: 'v = (1/C) integral i dt = (1/200e-6)(4e-3)(5) = (5000)(0.02) = 100 V. Equivalently Q = it = 20 mC and v = Q/C = 0.02/200e-6 = 100 V. Both routes must agree.',
        },
        {
          question: 'A symmetric triangular waveform has a peak value of 12 V. What is its rms value?',
          options: ['6.93 V', '8.49 V', '12 V', '4.00 V'],
          correctIndex: 0,
          explanation: 'For a triangular wave V_rms = V_peak/sqrt(3) = 12/1.732 = 6.93 V. The 8.49 V distractor is V_peak/sqrt(2), which applies to a sinusoid - using the sinusoid factor on a non-sinusoid is the intended trap.',
        },
        {
          question: 'How much energy is stored in a 500 microfarad capacitor charged to 200 V?',
          options: ['10 J', '20 J', '0.1 J', '100 J'],
          correctIndex: 0,
          explanation: 'W = (1/2)CV^2 = 0.5 x 500e-6 x 40000 = 10 J. Forgetting the factor of one half gives 20 J, which is the most common error in energy-storage questions for both capacitors and inductors.',
        },
      ],
    },
  {
    id: 'ic-depth',
    title: '4. Integration Where Electrical Problems Need It',
    content: `## 4.1 Signed area, and the question actually being asked
  
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
  | $\\int x^{n} dx (n \\ne -1)$ | $x^{n+1}/(n+1) + C$ |
  | $\\int (1/x)\\, dx$ | $\\ln \\lvert x\\rvert + C$ |
  | $\\int e^{kx} dx$ | $(1/k)e^{kx} + C$ |
  | $\\int \\sin (kx) dx$ | $-(1/k)\\cos (kx) + C$ |
  | $\\int \\cos (kx) dx$ | $(1/k)\\sin (kx) + C$ |
  | $\\int \\sin ^{2}(kx) dx$ | $x/2 - \\sin (2kx)/(4k) + C$ |
  
  The last one is not a separate fact: apply the power-reduction identity
  sin² = (1 − cos 2θ)/2 first, and it becomes two integrals you already know. Any
  integral of a squared sinusoid is done this way, and that is the route to RMS.
  
  **Substitution** handles composites: for ∫2x·e^(x²) dx, let u = x², so du = 2x dx
  and the integral is ∫e^u du = e^u + C = **$e^{x^{2}} + C$**. The signal that
  substitution will work is seeing a function *and its derivative* both present.
  
  **Integration by parts**, ∫u dv = uv − ∫v du, handles products of unlike things —
  a polynomial times an exponential, or a polynomial times a trigonometric
  function. Choose u to be the factor that gets simpler when differentiated.
  
  ## 4.3 Worked: RMS from first principles
  
  RMS is defined by its name read backwards — root of the mean of the square:
  
  $$V_{rms} = \\sqrt{ (1/T) \\int _{0}^T v(t)^{2} dt}$$
  
  **For a sinusoid v = V_m sin(ωt).** Square it and use power reduction:
  
  $$v^{2} = V_m^{2} \\sin ^{2}(\\omega t) = V_m^{2}(1 - \\cos  2\\omega t)/2$$
  
  Over a whole period the cos 2ωt term integrates to zero, leaving the mean square
  as V_m²/2. Taking the root:
  
  $$V_{rms} = V_m/\\sqrt{2} = 0.707 V_m$$
  
  **For a square wave** of amplitude ±V_m, the square is V_m² at every instant, so
  the mean square is V_m² and V_rms = **V_m**. No factor at all.
  
  **For a symmetric triangle wave** of peak V_m, the same integral gives

  $$V_{rms} = V_m/\\sqrt{3} \\approx 0.577 V_m$$
  
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
  
  $$V_{avg} = (1/\\pi)\\int _{0}^\\pi V_m \\sin  \\theta d\\theta = (V_m/\\pi)[-\\cos  \\theta]_{0}^\\pi = (V_m/\\pi)(1 + 1) = 2V_m/\\pi$$
  
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
  integral too: W = ∫p dt, giving ½CV² and ½LI² for the two storage elements.`,
    examTip: 'The 0.707 RMS factor applies to SINE waves only. Square wave RMS equals the peak; triangle is peak over root three. A question that specifies a non-sinusoidal source and offers 0.707 times peak as a choice is testing whether you read the waveform.',
    importantNote: 'Capacitor voltage and inductor current are integrals of finite quantities, which is exactly why neither can change instantaneously. The two continuity rules used throughout transient analysis are one calculus fact, not two circuit rules.',
  },
{
  id: 'ic-set',
  title: '5. Problem Set: Areas, Averages and RMS',
  content: `## 5.1 RMS of a waveform that is not a sine

A current is a 10 A square pulse present for 3 ms of every 10 ms period, and
zero otherwise. Find the RMS value.

Mean square = (1/T)∫i² dt = (1/0.010)(10² × 0.003) = (100 × 0.003)/0.010 = 30

$$I_{rms} = \\sqrt{30} = 5.48\\ \\mathrm{A}$$

The duty cycle is 0.3, and 10√0.3 = 5.48 confirms the general result
**$I_{rms} = I_{peak}\\sqrt{D}$** for a rectangular pulse train. The *average* current is
10 × 0.3 = 3 A, well below the RMS — the gap between them is what makes a
heating calculation different from a charge calculation.

## 5.2 Charge delivered by a ramp

A current rises linearly from 0 to 4 A over 5 s. What charge flows?

Q = ∫i dt = area under the line = ½(5)(4) = **10 C**

No integration technique is needed; a triangle's area is the integral. Half the
exam's integration questions are geometry in disguise.

## 5.3 Energy stored in a capacitor, from the definition

W = ∫p dt = ∫vi dt, and for a capacitor i = C dv/dt, so

$$W = \\int v \\cdot C(dv/dt) dt = C\\int v dv = \\tfrac{1}{2} CV^{2}$$

Substituting C = 100 µF charged to 50 V: W = ½(100×$10^{-6}$)(2500) = **0.125 J**.
Deriving it takes three lines and removes any doubt about whether the factor is
one half or two.

## 5.4 Average of a half-wave rectified sine

Only the positive half survives, and the average is taken over the **full**
period:

$$V_{avg} = (1/2\\pi)\\int _{0}^\\pi V_m \\sin  \\theta d\\theta = (V_m/2\\pi)(2) = V_m/\\pi = 0.318 V_m$$

Dividing by π instead of 2π gives 0.637 V_m, which is the *full*-wave answer.
The distinction is which rectifier is in the circuit, and both numbers always
appear among the choices.

## 5.5 Substitution in practice

Evaluate ∫₀^1 x·e^(x²) dx.

Let u = x², du = 2x dx, so x dx = du/2. Limits become u: 0 → 1.

$$\\int _{0}^1 (1/2)e^u du = \\tfrac{1}{2} (e^{1} - e^{0}) = \\tfrac{1}{2} (2.718 - 1) = 0.859$$

Changing the limits with the variable avoids converting back at the end, which
is where sign and bound errors creep in.`,
},
{
  id: 'ic-errors',
  title: '6. Where Marks Are Lost',
  content: `## 6.1 Five recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Applying 0.707 to everything | square-wave RMS given as 0.707 V_m | the factor depends on the waveform; square is 1.000, triangle 0.577 |
| Confusing average with RMS | using 0.637 in a heating calculation | RMS for power, average for charge and for DC meters |
| Half-wave against full-wave | 0.637 where 0.318 belongs | check whether the average is over half the period or all of it |
| Forgetting the constant of integration | an indefinite integral with no + C | only definite integrals may drop it |
| Not changing limits after substitution | integrating u over the x limits | either change the limits or convert back before evaluating |

A dimensional check catches several of these at once. An integral of current
over time is a **charge** in coulombs; an integral of power over time is an
**energy** in joules. If the units of your answer do not match what was asked
for, the integrand was wrong, not the arithmetic.

One more habit is worth the seconds it costs: when a question gives a
waveform by description rather than by equation, sketch one period before
integrating. Half the errors above are not calculus at all - they are
integrating the wrong interval, or over half a period when the definition
asks for a whole one.`,
},
{
  id: 'ic-riemann',
  title: '7. The Definite Integral as a Limit of Sums',
  content: `## 7.1 Slicing, summing, shrinking

An integral is not primarily an antiderivative. It is a limit of sums, and every
application in this chapter - charge, energy, area, volume, centroid, RMS -
follows from that and not from the table of antiderivatives.

Divide the interval from a to b into n strips of width $h = (b-a)/n$. Approximate
the area of each strip by a rectangle whose height is the function sampled
somewhere inside it, and add them:

$$S_n = \\sum_{k=1}^{n} f(x_k^{*})\\,h$$

If that sum approaches the same limit however the sample points are chosen inside
each strip, the function is integrable and the limit is written

$$\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty}\\sum_{k=1}^{n} f(x_k^{*})\\,h$$

Read the notation as what it is: the elongated S is a sum, and $f(x)\\,dx$ is one
strip's contribution, a height times a width. That reading is what tells you what
to integrate in an applied problem. Charge is current times time, so
$Q = \\int i\\,dt$. Energy is power times time, so $W = \\int p\\,dt$. Get the strip
right and the integral writes itself.

## 7.2 Worked example: a parabola by summation alone

Evaluate the area under $f(x) = x^{2}$ from 0 to 2 without an antiderivative.

Take n strips of width $h = 2/n$ and sample at the right-hand edge, so
$x_k = 2k/n$:

$$S_n^{R} = \\sum_{k=1}^{n}\\left(\\frac{2k}{n}\\right)^{2}\\frac{2}{n} = \\frac{8}{n^{3}}\\sum_{k=1}^{n}k^{2}$$

The sum of the first n squares is $n(n+1)(2n+1)/6$, so

$$S_n^{R} = \\frac{8}{6}\\cdot\\frac{(n+1)(2n+1)}{n^{2}} = \\frac{8}{3} + \\frac{4}{n} + \\frac{4}{3n^{2}}$$

As n grows the correction terms vanish and the limit is $8/3 = 2.6667$. Sampling
at the left edge instead flips the sign of the leading correction, and sampling at
the midpoint kills it entirely:

| n | left sum | right sum | midpoint sum |
|---|---|---|---|
| 4 | $2.6667 - 1 + 0.0833 = 1.75$ | $2.6667 + 1 + 0.0833 = 3.75$ | $2.6667 - 0.0417 = 2.625$ |
| 10 | 2.28 | 3.08 | 2.66 |
| 100 | 2.62680 | 2.70680 | 2.66660 |
| 1000 | 2.66267 | 2.67067 | 2.666666 |

The n = 4 rows can be checked by hand in seconds. The left sum is
$0.5 \\times 3.5 = 1.75$ from heights 0, 0.25, 1 and 2.25; the right sum is
$0.5 \\times 7.5 = 3.75$ from heights 0.25, 1, 2.25 and 4; the midpoint sum is
$0.5 \\times 5.25 = 2.625$ from heights 0.0625, 0.5625, 1.5625 and 3.0625.

![Two panels showing the same parabola over the interval zero to two, with four rectangles drawn from the left-hand sample points in one panel and from the right-hand sample points in the other. The left rectangles all fall short of the curve and total 1.75; the right rectangles all overshoot and total 3.75; the true area of 2.6667 lies between them.](/courses/fe-ee/figures/math3-ic-riemann.svg)

## 7.3 Worked example: how fast each rule closes in

The three sums above converge at genuinely different rates, and the difference is
worth quantifying because the same argument decides between the trapezoidal and
Simpson rules in section 14.

From the closed forms, the endpoint sums are wrong by $4/n$ to leading order and
the midpoint sum by $2/(3n^{2})$. Doubling n therefore halves an endpoint error
but quarters a midpoint error. Between n = 512 and n = 1024 the measured slopes
on logarithmic axes are -1.00 for the endpoint rules and exactly -2 for the
midpoint rule.

![Absolute error of the left, right and midpoint Riemann sums against the number of subintervals, on logarithmic axes. The two endpoint rules lie on a line of slope minus one; the midpoint rule lies on a line of slope minus two and is already three orders of magnitude better by a thousand subintervals.](/courses/fe-ee/figures/math3-ic-riemann-convergence.svg)

The reason is symmetry, not luck. A midpoint rectangle over-counts on one side of
its sample point by very nearly what it under-counts on the other, so the
first-order errors cancel within each strip and only the curvature survives. That
single observation is the seed of every higher-order quadrature rule.

## 7.4 The Fundamental Theorem, both halves

The theorem that links this limit of sums to antiderivatives comes in two
statements, and the exam uses both.

**First half.** Define an accumulation function $F(x) = \\int_a^{x} f(t)\\,dt$.
Then

$$\\frac{d}{dx}\\int_a^{x} f(t)\\,dt = f(x)$$

Differentiation undoes accumulation. The physical reading is direct: if F is the
charge accumulated on a capacitor then its rate of change is the current.

**Second half.** If F is any antiderivative of f, then

$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$

This is the computational half, and the word **any** is doing real work: the
constant of integration cancels in the subtraction, which is exactly why a
definite integral never needs one and an indefinite integral always does.

## 7.5 The mean value theorem for integrals

There is at least one point c in the interval where the function takes its own
average value:

$$\\int_a^b f(x)\\,dx = f(c)\\,(b - a)$$

so that

$$f_{avg} = \\frac{1}{b-a}\\int_a^b f(x)\\,dx$$

Every average in this chapter is that formula, and every RMS value is that formula
applied to the square of the signal. It is also the geometric statement that the
area under a curve equals the area of some rectangle on the same base - which is
why "find the equivalent DC value" and "find the average" are the same question
whenever the quantity of interest is linear in the signal.`,
  examTip: 'Build the integrand as a product of a height and a width and the applied integral writes itself: current times time is charge, power times time is energy, force times distance is work. Getting the strip right matters more than remembering the antiderivative.',
  importantNote: 'A definite integral needs no constant of integration because the constant cancels in F(b) minus F(a). An indefinite integral always needs one, and an answer written without it is incomplete rather than merely untidy.',
},
{
  id: 'ic-techniques',
  title: '8. The Techniques, Each Derived',
  content: `## 8.1 Substitution is the chain rule read backwards

Differentiating a composite gives $\\frac{d}{dx}F(g(x)) = f(g(x))\\,g'(x)$.
Integrating both sides recovers the rule:

$$\\int f(g(x))\\,g'(x)\\,dx = F(g(x)) + C$$

so with $u = g(x)$ and $du = g'(x)\\,dx$ the integral becomes $\\int f(u)\\,du$. The
signal that substitution will work is therefore very specific: **a function and
its own derivative are both present**, up to a constant factor. If they are not,
substitution is the wrong tool and no amount of trying will make it work.

For a definite integral, change the limits along with the variable. Converting
back to x at the end is legal but is where sign and bound errors breed.

## 8.2 Worked example: three substitutions

**A power of sine against its derivative.** For
$\\int_0^{\\pi/2}\\sin^{3}\\theta\\cos\\theta\\,d\\theta$, take $u = \\sin\\theta$ so
$du = \\cos\\theta\\,d\\theta$, and the limits run from 0 to 1:

$$\\int_0^{1}u^{3}\\,du = \\left[\\frac{u^{4}}{4}\\right]_0^{1} = 0.25$$

**A logarithm hiding in a quotient.** For $\\int_0^{2}\\dfrac{x}{x^{2}+1}\\,dx$, the
numerator is half the derivative of the denominator. With $u = x^{2}+1$ running
from 1 to 5:

$$\\frac{1}{2}\\int_1^{5}\\frac{du}{u} = \\frac{1}{2}\\ln 5 = 0.80472$$

Any integrand of the form derivative-over-function is a logarithm, and spotting
that saves more exam time than any other single pattern.

**A shift in the exponent.** For $\\int_0^{1}x e^{x^{2}}\\,dx$, take $u = x^{2}$ so
$x\\,dx = du/2$ and the limits run 0 to 1:

$$\\frac{1}{2}\\int_0^{1}e^{u}\\,du = \\frac{e - 1}{2} = 0.85914$$

## 8.3 Integration by parts is the product rule read backwards

Integrate the product rule $(uv)' = u'v + uv'$ across the interval and rearrange:

$$\\int u\\,dv = uv - \\int v\\,du$$

The rule trades one integral for another, so it only helps when the new one is
easier. The choice of u is what decides that, and the ordering **LIATE** -
Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, Exponential - names
the priority: pick as u whichever appears earliest in that list, because those are
the functions that get simpler when differentiated.

## 8.4 Worked example: parts, once and twice

**Once.** Evaluate $\\int_0^{1}x e^{2x}\\,dx$. Algebraic beats exponential, so
$u = x$ and $dv = e^{2x}dx$, giving $du = dx$ and $v = e^{2x}/2$:

$$\\int_0^{1}x e^{2x}dx = \\left[\\frac{xe^{2x}}{2}\\right]_0^{1} - \\frac{1}{2}\\int_0^{1}e^{2x}dx = \\frac{e^{2}}{2} - \\frac{e^{2}-1}{4} = \\frac{e^{2}+1}{4}$$

Numerically $7.389056 / 4 + 0.25 = 2.0973$.

**With a logarithm.** Evaluate $\\int_1^{e}4x\\ln x\\,dx$. Logarithmic beats
algebraic, so $u = \\ln x$ and $dv = 4x\\,dx$:

$$\\int 4x\\ln x\\,dx = 2x^{2}\\ln x - \\int 2x\\,dx = 2x^{2}\\ln x - x^{2} + C$$

Between 1 and e that is $(2e^{2} - e^{2}) - (0 - 1) = e^{2} + 1 = 8.3891$.
Differentiating the antiderivative returns $4x\\ln x + 2x - 2x$, which is the
integrand - the ten-second check that should follow every integration by parts.

**Twice, and to infinity.** Evaluate $\\int_0^{\\infty}t^{2}e^{-t}\\,dt$. One pass
lowers the power to $t$, a second lowers it to a constant:

$$\\int_0^{\\infty}t^{2}e^{-t}dt = 2\\int_0^{\\infty}t e^{-t}dt = 2\\int_0^{\\infty}e^{-t}dt = 2$$

Each pass costs one differentiation of the polynomial, which is why a polynomial
of degree n against an exponential needs exactly n passes and produces n
factorial. Adaptive quadrature over the same range returns 2.000000 to six
decimals.

## 8.5 Partial fractions

A proper rational function - numerator degree strictly below denominator degree -
splits into a sum of simpler pieces, one for each factor of the denominator.
Distinct linear factors give constants over each factor:

$$\\frac{1}{(x+1)(x+3)} = \\frac{A}{x+1} + \\frac{B}{x+3}$$

Multiply through and substitute the roots. At x = -1, $1 = 2A$ so A = 0.5; at
x = -3, $1 = -2B$ so B = -0.5. Hence

$$\\int_0^{1}\\frac{dx}{(x+1)(x+3)} = \\frac{1}{2}\\left[\\ln\\frac{x+1}{x+3}\\right]_0^{1} = \\frac{1}{2}\\ln 1.5$$

which is $0.5 \\times 0.405465 = 0.202733$.

If the numerator degree is not lower, divide first. A repeated factor
$(x+a)^{2}$ needs two terms, one over $(x+a)$ and one over $(x+a)^{2}$. An
irreducible quadratic needs a linear numerator over it.

## 8.6 Worked example: a partial-fraction inverse Laplace transform

This is where the technique earns its place on this exam. A first-order system
driven by a step has the transform

$$V(s) = \\frac{10}{s(s+5)}$$

Split it: $10 = A(s+5) + Bs$. At s = 0, $10 = 5A$ so A = 2; at s = -5,
$10 = -5B$ so B = -2. Therefore

$$V(s) = \\frac{2}{s} - \\frac{2}{s+5}$$

and each piece is a transform already in the table, giving

$$v(t) = 2 - 2e^{-5t}$$

Check the endpoints without inverting anything. At t = 0 the expression is zero,
matching the initial-value theorem; as t grows it approaches 2, matching the
final-value theorem. At one time constant, t = 0.2 s, the value is
$2 - 2 \\times 0.367879 = 1.26424$ V, which is 63.2 per cent of the final value -
the number every transient question is built around.

## 8.7 Trigonometric integrals and trigonometric substitution

Squared sinusoids are handled by power reduction rather than by memorising a
result:

$$\\sin^{2}\\theta = \\frac{1 - \\cos 2\\theta}{2}, \\qquad \\cos^{2}\\theta = \\frac{1 + \\cos 2\\theta}{2}$$

so $\\int\\sin^{2}(kx)\\,dx = x/2 - \\sin(2kx)/(4k) + C$ follows from two integrals
you already know. This is the route to every RMS calculation on a sinusoid.

An odd power of sine or cosine is handled by peeling off one factor to serve as
the differential and converting the rest with the Pythagorean identity. Roots of
the form $\\sqrt{a^{2} - x^{2}}$ are handled by $x = a\\sin\\theta$, and
$a^{2} + x^{2}$ by $x = a\\tan\\theta$, which turns the second into
$a^{2}\\sec^{2}\\theta$ and produces the arctangent:

$$\\int\\frac{dx}{x^{2}+a^{2}} = \\frac{1}{a}\\arctan\\frac{x}{a} + C$$

| what the integrand looks like | technique to reach for |
|---|---|
| a function and its own derivative | substitution |
| a polynomial times an exponential or a sinusoid | parts, polynomial as u |
| a logarithm or an inverse trigonometric function alone | parts, that factor as u |
| a proper rational function | partial fractions |
| an even power of sine or cosine | power reduction identity |
| a sum or difference of two squares under a root | trigonometric substitution |

## 8.8 Worked example: orthogonality, and why harmonics do not interact

Two sinusoids of different integer frequencies have zero average product over a
common period:

$$\\int_0^{2\\pi}\\sin(m\\theta)\\sin(n\\theta)\\,d\\theta = 0 \\quad (m \\ne n)$$

Verify it for m = 1 and n = 3 by the product-to-sum identity: the integrand
becomes $\\tfrac{1}{2}[\\cos 2\\theta - \\cos 4\\theta]$, and both cosines integrate
to zero over a whole number of their own periods. Quadrature over the same
interval returns zero to twelve decimal places. When the frequencies match,

$$\\int_0^{2\\pi}\\sin^{2}(n\\theta)\\,d\\theta = \\pi$$

by power reduction. This is the single most consequential integral in electrical
engineering. It says the mean square of a sum of harmonics is the sum of their
individual mean squares, with no cross terms - which is why RMS values of
harmonics add in quadrature, why Fourier coefficients can be extracted one at a
time, and why a filter can remove one harmonic without disturbing the rest.`,
  examTip: 'Before integrating, look for a function and its own derivative in the integrand. If both are present, substitution finishes the problem in one line; if they are not, substitution will not help and parts or partial fractions is the route.',
  importantNote: 'Orthogonality of harmonics is why mean squares add without cross terms. A distorted waveform of 100 V peak fundamental plus 30 V peak third harmonic has an RMS of the square root of the sum of the two individual mean squares, never the sum of the two RMS values.',
},
{
  id: 'ic-improper',
  title: '9. Improper Integrals and Convergence',
  content: `## 9.1 Two ways an integral can be improper

An integral is improper if a limit is infinite, or if the integrand blows up
somewhere on the interval. Either way the definition is the same: replace the
offending endpoint with a variable, integrate normally, then take a limit.

$$\\int_a^{\\infty}f(x)\\,dx = \\lim_{X \\to \\infty}\\int_a^{X}f(x)\\,dx$$

$$\\int_0^{1}\\frac{dx}{\\sqrt{x}} = \\lim_{\\epsilon \\to 0^{+}}\\int_{\\epsilon}^{1}\\frac{dx}{\\sqrt{x}} = \\lim_{\\epsilon \\to 0^{+}}\\left(2 - 2\\sqrt{\\epsilon}\\right) = 2$$

If the limit exists and is finite the integral **converges**; otherwise it
diverges. An integrand that is infinite somewhere does not automatically make the
integral infinite, which is the point of the example above, and an integrand that
tends to zero does not automatically make the integral finite, which is the point
of the next section.

## 9.2 The p-test, and where the line falls

For the tail of a power law the answer depends on one exponent:

$$\\int_1^{\\infty}\\frac{dx}{x^{p}} = \\frac{1}{p-1} \\ \\text{for}\\ p > 1, \\qquad \\text{divergent for}\\ p \\le 1$$

At the other end, near a singularity at the origin, the inequality reverses:

$$\\int_0^{1}\\frac{dx}{x^{p}} = \\frac{1}{1-p} \\ \\text{for}\\ p < 1, \\qquad \\text{divergent for}\\ p \\ge 1$$

The function $1/x$ sits exactly on the boundary in both cases and loses both
times, because its integral is a logarithm and a logarithm has no finite limit.
That single fact decides most convergence questions on this exam by comparison:
an integrand that eventually stays below a convergent one converges, and an
integrand that eventually stays above a divergent one diverges.

![Accumulated area from one out to a variable upper limit, for three power laws, on a logarithmic horizontal axis. The exponent two curve flattens onto the value one, the exponent one curve grows as the logarithm without bound, and the exponent one half curve climbs steeply off the top of the frame.](/courses/fe-ee/figures/math3-ic-ptest.svg)

## 9.3 Worked example: testing three tails

Accumulate each tail out to X = 1000 and read what happens.

| integrand | closed form out to X | value at X = 1000 | verdict |
|---|---|---|---|
| $1/x^{2}$ | $1 - 1/X$ | 0.999 | converges to 1 |
| $1/x^{1.5}$ | $2 - 2/\\sqrt{X}$ | 1.937 | converges to 2 |
| $1/x$ | $\\ln X$ | 6.9078 | diverges |
| $1/\\sqrt{x}$ | $2\\sqrt{X} - 2$ | 61.246 | diverges |

The logarithmic row is the instructive one. At X = 1000 it has reached only 6.9,
and at a million only 13.8 - it looks convergent to anyone watching a partial
sum. Divergence here is a statement about a limit, not about the size of any
particular partial value, and a question that shows a slowly growing table and
asks whether the integral converges is testing precisely that.

## 9.4 Worked example: the Laplace transform and its region of convergence

The Laplace transform is an improper integral with a parameter:

$$F(s) = \\int_0^{\\infty}f(t)e^{-st}\\,dt$$

For $f(t) = e^{-at}$ the integrand is a single exponential:

$$F(s) = \\int_0^{\\infty}e^{-(s+a)t}dt = \\left[\\frac{-e^{-(s+a)t}}{s+a}\\right]_0^{\\infty} = \\frac{1}{s+a}$$

but only if $s + a > 0$, because otherwise the exponential grows and the upper
limit contributes an infinity instead of a zero. That inequality is the **region
of convergence**, and the algebraic result $1/(s+a)$ is meaningless outside it.
Testing at a = 3 and s = 2, quadrature gives 0.2, matching $1/5$.

For $f(t) = t$, one integration by parts gives $F(s) = 1/s^{2}$, valid for
$s > 0$; at s = 4 that is 0.0625 and quadrature agrees.

| f(t) | F(s) | converges when |
|---|---|---|
| 1 | $1/s$ | s greater than 0 |
| t | $1/s^{2}$ | s greater than 0 |
| $e^{-at}$ | $1/(s+a)$ | s greater than minus a |
| $t^{n}$ | $n!/s^{n+1}$ | s greater than 0 |
| $\\sin\\omega t$ | $\\omega/(s^{2}+\\omega^{2})$ | s greater than 0 |

The pattern in the third row is the whole reason the transform is useful for
circuits: a decaying exponential is transformed into a pole, the pole's position
is the decay rate, and stability becomes a question about where poles sit rather
than about whether an integral converges.`,
  examTip: 'For a tail integral, the exponent one is the dividing line and it diverges. Anything falling strictly faster than one over x converges; one over x itself and anything slower does not.',
  importantNote: 'Every Laplace transform carries a region of convergence, and the algebraic expression is only valid inside it. This is the same convergence test as the p-test, applied to an exponential rather than a power.',
},
{
  id: 'ic-geometry',
  title: '10. Area, Volume, Arc Length and Surface',
  content: `## 10.1 Area between two curves

Subtract the lower function from the upper and integrate across the interval
where they overlap:

$$A = \\int_a^b\\left[f_{top}(x) - f_{bot}(x)\\right]dx$$

The limits come from the intersections, which must be found first. For
$y = 2x$ and $y = x^{2}$ the curves meet where $x^{2} = 2x$, that is at x = 0 and
x = 2, and the line is above the parabola between them:

$$A = \\int_0^{2}(2x - x^{2})\\,dx = \\left[x^{2} - \\frac{x^{3}}{3}\\right]_0^{2} = 4 - \\frac{8}{3} = \\frac{4}{3}$$

If the curves cross inside the interval, split the integral at the crossing and
take the correct difference on each piece; otherwise the two contributions
partially cancel and the answer is too small. That is the single most common
error in area questions and it is invisible in the arithmetic.

## 10.2 Volumes of revolution

Rotate a plane region about an axis and slice the solid perpendicular to that
axis. Each slice is a disc or an annulus, and its volume is its area times its
thickness.

$$V_{disc} = \\pi\\int_a^b [R(x)]^{2}dx, \\qquad V_{washer} = \\pi\\int_a^b\\left([R_{out}]^{2} - [R_{in}]^{2}\\right)dx$$

Slice parallel to the axis instead and each shell is a rolled-up rectangle of
circumference $2\\pi x$, height h and thickness dx:

$$V_{shell} = 2\\pi\\int_a^b x\\,h(x)\\,dx$$

The two methods always agree; choose whichever avoids solving the boundary curve
for the other variable.

![Two stacked panels. The upper panel shades the region under the square root curve from zero to four. The lower panel mirrors the curve about the horizontal axis to show the solid of revolution, with one representative disc drawn at x equals 2.25 where the radius is 1.5.](/courses/fe-ee/figures/math3-ic-revolution.svg)

## 10.3 Worked example: one region, three solids

Take the region between $y = 2x$ and $y = x^{2}$ from x = 0 to x = 2, whose area
is 4/3 from section 10.1.

**Rotated about the x-axis** the slices are washers with outer radius 2x and
inner radius $x^{2}$:

$$V = \\pi\\int_0^{2}\\left(4x^{2} - x^{4}\\right)dx = \\pi\\left[\\frac{4x^{3}}{3} - \\frac{x^{5}}{5}\\right]_0^{2} = \\frac{64\\pi}{15}$$

which is $64 \\times 3.141593 / 15 = 13.404$ cubic units.

**Rotated about the y-axis** the shells have radius x and height $2x - x^{2}$:

$$V = 2\\pi\\int_0^{2}x(2x - x^{2})dx = 2\\pi\\left[\\frac{2x^{3}}{3} - \\frac{x^{4}}{4}\\right]_0^{2} = \\frac{8\\pi}{3}$$

which is $8 \\times 3.141593 / 3 = 8.3776$ cubic units.

**A simpler solid for comparison.** Rotating the region under $y = \\sqrt{x}$ from
0 to 4 about the x-axis gives discs of area $\\pi x$:

$$V = \\pi\\int_0^{4}x\\,dx = 8\\pi$$

which is $8 \\times 3.141593 = 25.133$ cubic units. Each of the three was confirmed
by adaptive quadrature of the corresponding slice-area function.

## 10.4 Arc length, from Pythagoras

Take an infinitesimal piece of curve. Its horizontal run is dx, its rise is dy,
and the piece itself is the hypotenuse:

$$ds = \\sqrt{(dx)^{2} + (dy)^{2}} = \\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^{2}}\\,dx$$

$$L = \\int_a^b\\sqrt{1 + [f'(x)]^{2}}\\,dx$$

The formula is not memorised so much as reconstructed, and reconstructing it
takes one triangle. Most arc-length integrands are unpleasant; the examinable
cases are the few contrived so that the square root simplifies. For
$y = \\tfrac{2}{3}x^{3/2}$ the derivative is $\\sqrt{x}$, so the radical becomes
$\\sqrt{1+x}$ and

$$L = \\int_0^{3}\\sqrt{1+x}\\,dx = \\frac{2}{3}\\left[(1+x)^{3/2}\\right]_0^{3} = \\frac{2}{3}(8 - 1) = \\frac{14}{3}$$

that is 4.6667 units, which quadrature confirms.

## 10.5 Worked example: conductor length on a transmission span

A cable hanging under its own weight takes the shape of a catenary,
$y = a\\cosh(x/a)$, where a is the ratio of horizontal tension to weight per unit
length. Its derivative is $\\sinh(x/a)$, and the identity
$1 + \\sinh^{2} = \\cosh^{2}$ collapses the radical exactly:

$$L = \\int_{-d/2}^{d/2}\\cosh\\frac{x}{a}\\,dx = 2a\\sinh\\frac{d}{2a}$$

For a 300 m span with a = 500 m, the argument is 0.3, so the conductor length is
$2 \\times 500 \\times 0.304520 = 304.52$ m and the sag is
$a(\\cosh 0.3 - 1) = 500 \\times 0.045339 = 22.67$ m.

The conductor is $304.52 - 300 = 4.52$ m longer than the span, about 1.5 per cent,
and that difference is exactly what a stringing chart exists to specify. It is
also why thermal expansion shows up as sag rather than as tension: a tiny change
in length buys a large change in sag when the curve is this shallow.

## 10.6 Surface of revolution

Rotate the arc rather than the region and each element sweeps a band of
circumference $2\\pi y$ and slant width ds:

$$S = 2\\pi\\int y\\,ds = 2\\pi\\int_a^b y\\sqrt{1 + [f'(x)]^{2}}\\,dx$$

The sphere falls out beautifully. With $y = \\sqrt{r^{2}-x^{2}}$ the derivative is
$-x/y$, so the radical is $r/y$, and the two y factors cancel:

$$S = 2\\pi\\int_{-r}^{r} y \\cdot \\frac{r}{y}\\,dx = 2\\pi r\\int_{-r}^{r}dx = 4\\pi r^{2}$$

| quantity | integrand | note |
|---|---|---|
| area between curves | top minus bottom | split at every crossing |
| volume by discs | $\\pi R^{2}$ | slice perpendicular to the axis |
| volume by shells | $2\\pi x h$ | slice parallel to the axis |
| arc length | $\\sqrt{1 + (y')^{2}}$ | a hypotenuse, not a memorised form |
| surface of revolution | $2\\pi y\\sqrt{1 + (y')^{2}}$ | arc length weighted by circumference |

The cancellation in the sphere is the reason the surface area of a spherical
band depends only on its height and not on where it sits - the result that makes
a Mercator-style equal-area projection possible.`,
  examTip: 'For a volume of revolution, decide first whether your slices are perpendicular to the axis, giving discs or washers, or parallel to it, giving shells. Picking the one that keeps the boundary curve in its given form saves the algebra of solving for the other variable.',
  importantNote: 'When two curves cross inside the interval of integration, split the integral at the crossing and take the correct difference on each piece. A single integral across the crossing lets the two regions partially cancel and understates the area with no visible sign of error.',
},
{
  id: 'ic-rms',
  title: '11. Average Value and RMS, Derived Not Quoted',
  content: `## 11.1 Two averages, and why one of them squares first

The average of a signal over one period is the mean value theorem applied
directly:

$$F_{avg} = \\frac{1}{T}\\int_0^{T}f(t)\\,dt$$

The RMS value is the same operation applied to the square, with a root at the
end:

$$F_{rms} = \\sqrt{\\frac{1}{T}\\int_0^{T}f^{2}(t)\\,dt}$$

The reason for the squaring is physical, not conventional. Power into a resistor
goes as the square of the signal, so the DC value that would deposit the same
heat is the root of the mean of the square. Average is the right quantity for
charge transferred and for what a moving-coil meter reads; RMS is the right
quantity for heating, for torque in a motor, and for anything a fuse cares about.

## 11.2 Worked example: the sinusoid's root two, derived

For $v(t) = V_m\\sin(\\omega t)$, square and apply power reduction:

$$v^{2} = V_m^{2}\\sin^{2}(\\omega t) = \\frac{V_m^{2}}{2}\\left(1 - \\cos 2\\omega t\\right)$$

Over a whole period the cosine term contributes exactly zero, because it
completes two full cycles. What survives is the constant:

$$\\frac{1}{T}\\int_0^{T}v^{2}dt = \\frac{V_m^{2}}{2} \\quad\\Longrightarrow\\quad V_{rms} = \\frac{V_m}{\\sqrt{2}} = 0.70711\\,V_m$$

The factor is not a property of alternating current. It is a property of the
**shape**, and specifically of the fact that the mean of a squared sinusoid is
exactly one half. Change the shape and the factor changes with it.

The average over a full period is zero by symmetry. Rectify first and the average
becomes

$$V_{avg} = \\frac{1}{\\pi}\\int_0^{\\pi}V_m\\sin\\theta\\,d\\theta = \\frac{2V_m}{\\pi} = 0.63662\\,V_m$$

## 11.3 Worked example: three waveforms that are not sinusoids

**A square wave of amplitude plus or minus $V_m$.** The square of the signal is
$V_m^{2}$ at every instant, so the mean square is $V_m^{2}$ with no integration
required and $V_{rms} = V_m$. A square wave is the only common waveform whose RMS
equals its peak.

**A symmetric triangle of peak $V_m$.** By symmetry, integrate over a quarter
period where $v = 4V_m t/T$:

$$\\frac{4}{T}\\int_0^{T/4}\\frac{16V_m^{2}t^{2}}{T^{2}}dt = \\frac{64V_m^{2}}{T^{3}}\\left[\\frac{t^{3}}{3}\\right]_0^{T/4} = \\frac{V_m^{2}}{3}$$

so $V_{rms} = V_m/\\sqrt{3} = 0.57735\\,V_m$. A sawtooth ramping from
$-V_m$ to $+V_m$ gives the same mean square by the same integral, which is why
the two share a factor despite looking different.

**A rectangular pulse train** of amplitude $I_p$ present for a fraction D of each
period. The square is $I_p^{2}$ for a fraction D and zero otherwise:

$$I_{rms} = I_p\\sqrt{D}, \\qquad I_{avg} = I_p D$$

For a 10 A pulse at 30 per cent duty, $10 \\times 0.547723 = 5.4772$ A RMS against
3 A average. The gap between them is the whole reason a fuse rated on RMS current
and a plating bath rated on average current disagree about the same waveform.

![Four small panels, each showing one period of a unit-peak waveform with its own RMS level drawn as a dashed line. The sine sits at 0.7071, the square at 1.0000, the triangle at 0.5774 and the sawtooth at 0.5774.](/courses/fe-ee/figures/math3-ic-rms-waveforms.svg)

| waveform of peak $V_m$ | RMS | mean of the magnitude | form factor | crest factor |
|---|---|---|---|---|
| sine | 0.7071 | 0.6366 | 1.1107 | 1.4142 |
| full-wave rectified sine | 0.7071 | 0.6366 | 1.1107 | 1.4142 |
| half-wave rectified sine | 0.5000 | 0.3183 | 1.5708 | 2.0000 |
| square | 1.0000 | 1.0000 | 1.0000 | 1.0000 |
| triangle | 0.5774 | 0.5000 | 1.1547 | 1.7321 |
| sawtooth | 0.5774 | 0.5000 | 1.1547 | 1.7321 |
| pulse train, 30 per cent duty | 0.5477 | 0.3000 | 1.8257 | 1.8257 |

Form factor is RMS divided by the mean of the magnitude, and it is why an
averaging meter calibrated on sine waves misreads everything else: it measures
0.6366 and multiplies by 1.1107 regardless of what it is looking at. Point such a
meter at a triangle wave and it reads 11 per cent high, because the true form
factor there is 1.1547.

## 11.4 Worked example: a DC level with ripple, and a harmonic pair

Because the mean square of a sum of orthogonal components is the sum of their
mean squares, RMS values combine in quadrature:

$$V_{rms} = \\sqrt{V_{dc}^{2} + V_{ac,rms}^{2}}$$

**A supply rail.** A 12 V DC output carries 5 V RMS of ripple. The total RMS is
$\\sqrt{144 + 25}$, and $144 + 25 = 169$, so 13.0 V exactly. Into a 10 ohm load
that dissipates $169 / 10 = 16.9$ W, against the 14.4 W the DC term alone would
deliver. The ripple contributes 2.5 W of heating that a DC meter never sees.

**A distorted mains waveform.** Take
$v(t) = 100\\sin\\omega t + 30\\sin 3\\omega t$ volts. The two components are
orthogonal, so their mean squares add:

$$V_{rms}^{2} = \\left(\\frac{100}{\\sqrt{2}}\\right)^{2} + \\left(\\frac{30}{\\sqrt{2}}\\right)^{2}$$

and $5000 + 450 = 5450$, giving $V_{rms} = 73.824$ V. The fundamental alone would
give 70.711 V, so the third harmonic raises the true RMS by a factor of 1.0440 -
which is $\\sqrt{1 + 0.09}$, the standard relationship between total harmonic
distortion and RMS. A 30 per cent third harmonic adds 4.4 per cent to the heating,
and quadrature of the squared waveform over a full period returns a mean square of
5450 exactly, confirming that no cross term survives.`,
  examTip: 'The 0.707 factor belongs to the sine and to nothing else. Read the waveform description first: square is 1.000, triangle and sawtooth are 0.577, half-wave rectified sine is 0.500, and a pulse train is the peak times the square root of the duty cycle.',
  importantNote: 'RMS values of orthogonal components add in quadrature, never directly. A 12 V DC rail with 5 V RMS of ripple has a total RMS of 13 V, not 17 V, and it is the 13 that determines the heating.',
},
{
  id: 'ic-centroid',
  title: '12. Centroids and Moments',
  content: `## 12.1 First moments and the centroid

The centroid of an area is its balance point, and it is defined by a ratio of two
integrals: the first moment of area divided by the area itself.

$$\\bar{x} = \\frac{\\int x\\,dA}{\\int dA}, \\qquad \\bar{y} = \\frac{\\int y\\,dA}{\\int dA}$$

The whole method is choosing a strip dA over which one coordinate is constant, so
that the moment integral becomes one-dimensional. For a vertical strip of height
y and width dx, the strip's own centre sits at height y/2, so

$$\\int y\\,dA = \\int_a^b \\frac{y}{2}\\cdot y\\,dx = \\frac{1}{2}\\int_a^b y^{2}\\,dx$$

That factor of one half, arising because the strip has extent in the direction
being averaged, is the step most often dropped.

## 12.2 Worked example: the semicircle, derived

Find the centroid of a semicircular area of radius r, flat side on the x-axis.

Take horizontal strips, over which y is constant. A strip at height y has width
$2\\sqrt{r^{2}-y^{2}}$, so

$$\\int y\\,dA = \\int_0^{r} y\\cdot 2\\sqrt{r^{2}-y^{2}}\\,dy$$

Substituting $u = r^{2} - y^{2}$, so $y\\,dy = -du/2$, turns this into
$\\int_0^{r^{2}}\\sqrt{u}\\,du = \\tfrac{2}{3}r^{3}$. Dividing by the area
$\\pi r^{2}/2$:

$$\\bar{y} = \\frac{2r^{3}/3}{\\pi r^{2}/2} = \\frac{4r}{3\\pi}$$

Numerically $4 / 9.42478 = 0.42441$, so the centroid sits at 0.4244 r, noticeably
below the r/2 that intuition suggests - because there is more area near the flat
base than near the top.

![A unit semicircle with its area shaded, a horizontal strip drawn at height 0.72, and the centroid marked on the axis of symmetry at 0.4244 of the radius, below the dashed line at half the radius that an untrained guess would place it on.](/courses/fe-ee/figures/math3-ic-centroid.svg)

**A second case for contrast.** For the area under $y = x^{2}$ from 0 to 2, the
area is 8/3 and

$$\\int x\\,dA = \\int_0^{2}x\\cdot x^{2}dx = 4, \\qquad \\int y\\,dA = \\int_0^{2}\\frac{x^{4}}{2}dx = 3.2$$

so $\\bar{x} = 1.5$ and $\\bar{y} = 1.2$. Both lie inside the region, as a centroid
of a convex-ish region must, and both are well past the midpoint of their ranges
because the region is far heavier on the right.

## 12.3 Second moments and the parallel-axis theorem

The second moment of area weights each element by the square of its distance from
an axis:

$$I_x = \\int y^{2}\\,dA$$

It measures how far the area is spread from the axis, which is why it governs
bending stiffness. Moving the reference axis is handled without re-integrating,
by the parallel-axis theorem:

$$I = I_c + A d^{2}$$

where $I_c$ is about the centroidal axis and d is the distance moved. The
theorem only works starting **from** the centroidal axis, and applying it between
two arbitrary axes is a standard trap.

## 12.4 Worked example: a rectangular section about two axes

A rectangle is 50 mm wide and 100 mm deep.

**About its own centroidal axis**, integrate strips from -h/2 to +h/2:

$$I_c = \\int_{-h/2}^{h/2}y^{2}b\\,dy = b\\left[\\frac{y^{3}}{3}\\right]_{-h/2}^{h/2} = \\frac{bh^{3}}{12}$$

which is $50 \\times 1000000 / 12 = 4166667$ mm to the fourth.

**About its base**, integrate from 0 to h instead:

$$I_{base} = \\int_0^{h}y^{2}b\\,dy = \\frac{bh^{3}}{3} = 16666667\\ \\mathrm{mm}^{4}$$

**Check with the parallel-axis theorem.** The area is 5000 square millimetres and
the shift is 50 mm, so $5000 \\times 2500 = 12500000$, and
$4166667 + 12500000 = 16666667$. The two routes agree exactly, which is the
verification worth doing whenever a composite section is built from parts.

| shape | axis | second moment |
|---|---|---|
| rectangle b by h | centroidal, parallel to b | $bh^{3}/12$ |
| rectangle b by h | along the base | $bh^{3}/3$ |
| triangle b by h | centroidal, parallel to b | $bh^{3}/36$ |
| triangle b by h | along the base | $bh^{3}/12$ |
| circle radius r | any centroidal diameter | $\\pi r^{4}/4$ |
| circle radius r | polar, through the centre | $\\pi r^{4}/2$ |

The cube on h in every rectangular entry is the practically important part:
doubling the depth of a beam multiplies its stiffness by eight while only doubling
its weight, which is why structural sections are tall and thin rather than square.`,
  examTip: 'Choose the strip so that one coordinate is constant over it. Horizontal strips for a semicircle, vertical strips for an area under a curve - and remember the factor of one half when the strip has extent in the direction you are averaging.',
  importantNote: 'The parallel-axis theorem transfers a second moment FROM the centroidal axis only. To move between two non-centroidal axes, come back through the centroid first, subtracting A d squared and then adding the new one.',
},
{
  id: 'ic-line-surface',
  title: '13. Line and Surface Integrals',
  content: `## 13.1 Integrating along a path

A line integral accumulates a quantity along a curve rather than along an axis.
For a scalar density it is

$$\\int_C f\\,ds, \\qquad ds = \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$$

Parameterise the curve, substitute, and it becomes an ordinary single-variable
integral. For a quarter circle of radius 2 in the first quadrant with linear
density $\\lambda = x$, take $x = 2\\cos\\theta$ and $ds = 2\\,d\\theta$:

$$\\int_C x\\,ds = \\int_0^{\\pi/2}(2\\cos\\theta)(2)\\,d\\theta = 4\\left[\\sin\\theta\\right]_0^{\\pi/2} = 4$$

## 13.2 Work integrals and conservative fields

For a vector field the natural line integral is the work done moving along the
path:

$$W = \\int_C \\mathbf{F}\\cdot d\\mathbf{r} = \\int_C \\left(F_x\\,dx + F_y\\,dy\\right)$$

Some fields give the same answer for every path between two points. Those are
**conservative**, they can be written as the gradient of a potential, and their
line integral collapses to a difference of potentials at the endpoints:

$$\\int_C \\nabla\\phi\\cdot d\\mathbf{r} = \\phi(\\text{end}) - \\phi(\\text{start})$$

In two dimensions the test is whether the mixed partial derivatives agree,
$\\partial F_x/\\partial y = \\partial F_y/\\partial x$, which is the statement that
the curl vanishes. Electrostatic fields pass this test, which is exactly why
voltage between two nodes is well defined and independent of the route taken -
and induced fields around a changing flux do not, which is why a voltmeter's lead
placement matters in a transformer's stray field.

## 13.3 Worked example: the same endpoints, two different answers

Take $\\mathbf{F} = (y, x)$ from the origin to the point (2, 4).

**Along the straight chord** $y = 2x$, parameterise as $(t, 2t)$ for t from 0 to
2. Then $\\mathbf{F} = (2t, t)$ and $d\\mathbf{r} = (1, 2)dt$, so the integrand is
$2t + 2t = 4t$ and the work is 8.

**Along the parabola** $y = x^{2}$, parameterise as $(t, t^{2})$. Then
$\\mathbf{F} = (t^{2}, t)$ and $d\\mathbf{r} = (1, 2t)dt$, so the integrand is
$t^{2} + 2t^{2} = 3t^{2}$ and the work is again 8.

Both give 8, as they must: the mixed partials are both 1, the field is
conservative, and its potential is $\\phi = xy$, whose endpoint difference is
$2 \\times 4 = 8$.

**Now change one sign.** Take $\\mathbf{F} = (-y, x)$ from the origin to (1, 1).
Along the straight line $(t, t)$ the integrand is $-t + t = 0$, so the work is
zero. Along the parabola $(t, t^{2})$ it is $-t^{2} + 2t^{2} = t^{2}$, so the work
is 1/3. Different paths, different answers - and the test explains it, because
here $\\partial F_x/\\partial y = -1$ while $\\partial F_y/\\partial x = +1$, so the
curl is 2 and no potential exists.

## 13.4 Surface integrals and flux

A surface integral of a vector field is its flux, the net amount crossing the
surface:

$$\\Phi = \\iint_S \\mathbf{F}\\cdot d\\mathbf{A} = \\iint_S \\mathbf{F}\\cdot\\hat{n}\\,dA$$

When the field is uniform in magnitude over the surface and everywhere
perpendicular to it, this collapses to a product - which is the entire reason
symmetry arguments work in electromagnetics.

## 13.5 Worked example: Gauss's law as a surface integral

A point charge Q sits at the centre of a sphere of radius r. Its field is radial
with magnitude

$$E = \\frac{Q}{4\\pi\\epsilon_0 r^{2}}$$

Over the sphere, E is constant in magnitude and everywhere parallel to the
outward normal, so the flux integral reduces to a multiplication:

$$\\Phi = E \\cdot 4\\pi r^{2} = \\frac{Q}{4\\pi\\epsilon_0 r^{2}}\\cdot 4\\pi r^{2} = \\frac{Q}{\\epsilon_0}$$

The radius cancels completely, which is Gauss's law: the flux depends on the
enclosed charge and on nothing else.

**With numbers.** For Q = 1 nC at r = 0.1 m, using the tabulated permittivity of
free space 8.8541878128e-12 farad per metre, the field is 898.76 V/m. The sphere's
area is 0.1256637 square metres, so the flux is
$898.755 \\times 0.1256637 = 112.94$ volt-metres, and dividing the charge by the
permittivity gives the same 112.94. Integrating the flux element over polar angle
by quadrature reproduces it to seven digits.

The magnetic analogue is Ampere's law as a line integral. Around a circle of
radius r about a long straight wire, B is constant in magnitude and everywhere
along the path, so $\\oint\\mathbf{B}\\cdot d\\mathbf{l} = B\\,2\\pi r = \\mu_0 I$.
For 10 A at 50 mm the field is 40 microtesla, and again the geometry cancels
against the integral rather than being computed through it.`,
  examTip: 'Before evaluating any flux or circulation integral, ask whether symmetry makes the field constant in magnitude and constant in angle to the element. If it does, the integral collapses to a product and there is nothing left to integrate.',
  importantNote: 'A conservative field has zero curl and a path-independent line integral. Electrostatic fields are conservative, which is why node voltage is well defined; induced fields around a changing flux are not, which is why loop area matters when probing them.',
},
{
  id: 'ic-numerical',
  title: '14. Numerical Integration',
  content: `## 14.1 The trapezoidal rule and its error order

When the integrand is a table of measurements rather than a formula, join the
samples with straight lines and add the trapezoids. With n equal panels of width
h, the interior points are each counted twice and the endpoints once:

$$T_n = h\\left[\\frac{f_0}{2} + f_1 + f_2 + \\cdots + f_{n-1} + \\frac{f_n}{2}\\right]$$

The error over the whole interval is

$$E_T = -\\frac{(b-a)h^{2}}{12}f''(\\xi)$$

for some point in the interval. The $h^{2}$ is the operative part: **halving the
step should divide the error by four.** The rule is exact for any straight line,
because a straight line has no second derivative to be wrong about.

## 14.2 Simpson's rule and its error order

Fit a parabola through each consecutive triple of points instead of a line
through each pair. Integrating that parabola gives the weighting 1, 4, 1 over each
pair of panels, which assembles into the alternating pattern

$$S_n = \\frac{h}{3}\\left[f_0 + 4f_1 + 2f_2 + 4f_3 + \\cdots + 4f_{n-1} + f_n\\right]$$

and requires n to be **even**. The error is

$$E_S = -\\frac{(b-a)h^{4}}{180}f^{(4)}(\\xi)$$

so halving the step divides the error by sixteen. Simpson's rule is exact for
cubics as well as parabolas, one order better than its construction suggests,
because the cubic error terms cancel between the two halves of each panel pair.

## 14.3 Worked example: both rules against an exact answer

Test both on $\\int_0^{1}e^{x}dx$, whose exact value is $e - 1 = 1.7182818$.

| panels n | trapezoid | trapezoid error | Simpson | Simpson error |
|---|---|---|---|---|
| 2 | 1.7539311 | 3.565e-2 | 1.7188612 | 5.793e-4 |
| 4 | 1.7272219 | 8.940e-3 | 1.7183188 | 3.701e-5 |
| 8 | 1.7205186 | 2.237e-3 | 1.7182842 | 2.326e-6 |
| 16 | 1.7188411 | 5.593e-4 | 1.7182820 | 1.456e-7 |

Take the ratios of consecutive errors. For the trapezoidal rule,
$0.0356493 / 0.0089401 = 3.9876$, approaching 4. For Simpson,
$0.00057932 / 0.00003701 = 15.65$, approaching 16. The predicted error orders are
not an asymptotic hope; they are visible at n = 2.

![Absolute error against panel count on logarithmic axes for the trapezoidal and Simpson rules applied to the integral of the exponential over the unit interval. The trapezoid points lie on a line of slope minus two and the Simpson points on a line of slope minus four, four orders of magnitude lower by 128 panels.](/courses/fe-ee/figures/math3-ic-quadrature-error.svg)

The error formulas also predict the magnitudes, not just the ratios. At n = 4 the
trapezoid bound is $(1/12)(0.25)^{2}e = 0.014158$ against an actual 0.008940, and
the Simpson bound is $(1/180)(0.25)^{4}e = 0.000059$ against an actual 0.0000370.
Both bounds hold and both are within a factor of two, because the fourth
derivative of the exponential barely varies across the interval.

## 14.4 Worked example: charge from sampled current

A current is logged every 0.5 s as 0, 3, 4, 3 and 0 amperes. Find the charge
delivered over the two seconds.

**Trapezoidal.** The interior samples count once each and the ends count half:

$$Q_T = 0.5\\left[0 + 3 + 4 + 3 + 0\\right]$$

giving $0.5 \\times 10 = 5$ coulombs.

**Simpson.** Five samples means four panels, which is even, so the rule applies.
The weights are 1, 4, 2, 4, 1:

$$4 \\times 3 + 2 \\times 4 + 4 \\times 3 = 32$$

and $0.5 \\times 32 / 3 = 5.333$ coulombs.

The two disagree by 6.7 per cent, and Simpson is the one to quote: the underlying
waveform is curved, and straight-line segments systematically cut the corners of
a convex peak. The check that catches a Simpson error is the weight sum - with
n panels the weights must total 3n, here $1 + 4 + 2 + 4 + 1 = 12$ against
$3 \\times 4 = 12$, so a misplaced 4 or 2 shows up immediately.

| rule | samples needed | exact for | error order |
|---|---|---|---|
| left or right rectangle | any n | constants | h to the first |
| midpoint | any n | straight lines | h squared |
| trapezoid | any n | straight lines | h squared |
| Simpson | n even | cubics | h to the fourth |

The midpoint and trapezoid rules share an error order but not an error: the
midpoint error is half the size and has the opposite sign, which is exactly why
their weighted combination, two parts midpoint to one part trapezoid, is
Simpson's rule.`,
  examTip: 'Simpson requires an even number of panels, which means an odd number of samples. If a data table gives an even count of readings, either drop one, or apply Simpson to the even part and a trapezoid to the last panel.',
  importantNote: 'Trapezoid error falls as h squared and Simpson error as h to the fourth. Doubling the number of panels therefore improves a trapezoid answer by four and a Simpson answer by sixteen, which is what makes Simpson the default for hand calculation.',
},
{
  id: 'ic-set-b',
  title: '15. Problem Set: Integration Techniques',
  content: `## 15.1 Problem Set A: definite integrals and technique choice

**Problem 1.** Evaluate $\\int_0^{3}(x^{2} + 2x)\\,dx$.

$$\\left[\\frac{x^{3}}{3} + x^{2}\\right]_0^{3} = 9 + 9 = 18$$

*The trap.* Differentiating instead of integrating gives $2x + 2$ evaluated
somewhere, and 8 appears among the choices. Read whether the question wants an
accumulation or a rate; the presence of dx and of limits settles it.

**Problem 2.** Evaluate $\\int_1^{4}\\dfrac{dx}{\\sqrt{x}}$.

Write the integrand as $x^{-1/2}$ and apply the power rule with n = -1/2:

$$\\left[2\\sqrt{x}\\right]_1^{4} = 4 - 2 = 2$$

*The trap.* Treating $1/\\sqrt{x}$ as the reciprocal case and answering with a
logarithm. The logarithm belongs only to $x^{-1}$ exactly; every other exponent,
including minus one half, uses the power rule.

**Problem 3.** A current $i(t) = 100\\sin(377t)$ amperes flows for the first 10 ms.
How much charge is delivered?

$$Q = \\int_0^{0.01}100\\sin(377t)\\,dt = \\frac{100}{377}\\left[1 - \\cos(3.77)\\right]$$

With $100 / 377 = 0.265252$ and $\\cos(3.77) = -0.80896$, the bracket is 1.808965
and $0.265252 \\times 1.808965 = 0.47983$ coulombs.

*The trap.* Assuming the interval is a whole number of periods and answering
zero. At 60 Hz the period is 16.7 ms, so 10 ms is not a full cycle and the phase
at the upper limit is 3.77 radians, past the negative-going zero crossing but not
back to the start.

**Problem 4.** Evaluate $\\int_0^{1}x^{2}e^{-x}\\,dx$.

Two passes of integration by parts, taking the polynomial as u each time, give
the antiderivative $-(x^{2} + 2x + 2)e^{-x}$. Evaluating,

$$\\left[-(x^{2}+2x+2)e^{-x}\\right]_0^{1} = -5e^{-1} + 2$$

and $2 - 1.8394 = 0.1606$.

*The trap.* Doing only one pass and stopping while an integral remains. The
first pass alone leaves -0.368, a negative number for an integrand that is
positive across the whole interval, and that sign is the tell. The degree of the
polynomial is the number of passes required.

## 15.2 Problem Set B: substitution, partial fractions and improper integrals

**Problem 5.** Evaluate $\\int\\dfrac{2x}{x^{2}+4}\\,dx$.

The numerator is exactly the derivative of the denominator, so this is a
logarithm:

$$\\int\\frac{2x}{x^{2}+4}dx = \\ln(x^{2}+4) + C$$

*The trap.* Reaching for the arctangent form, which belongs to
$\\int dx/(x^{2}+a^{2})$ with a constant numerator. The presence or absence of an
x in the numerator decides between a logarithm and an arctangent, and both forms
are always offered.

**Problem 6.** Find the inverse transform of $\\dfrac{6}{s(s+2)}$.

Partial fractions: $6 = A(s+2) + Bs$ gives A = 3 at s = 0 and B = -3 at s = -2,
so the transform is $3/s - 3/(s+2)$ and

$$f(t) = 3 - 3e^{-2t}$$

*The trap.* Writing $3/s - 3/(s-2)$ and producing a growing exponential. The
sign in the denominator carries straight through to the sign in the exponent; a
pole in the left half plane must give a decay.

**Problem 7.** Does $\\int_1^{\\infty}\\dfrac{dx}{x^{1.5}}$ converge, and to what?

The exponent exceeds 1, so it converges, and the p-test value is $1/(1.5-1) = 2$.
Accumulating out to X = 1000 gives 1.937, already within about 3 per cent of the
limit.

*The trap.* Answering that it diverges because the integrand never reaches zero.
Convergence is about how fast the integrand decays, not about whether it ever
becomes exactly zero, and the boundary sits at an exponent of exactly 1.

**Problem 8.** Evaluate $\\int_0^{\\infty}100e^{-4t}\\,dt$, the energy in joules
delivered by a power that decays with a 250 ms time constant.

$$\\left[\\frac{-100e^{-4t}}{4}\\right]_0^{\\infty} = \\frac{100}{4} = 25\\ \\mathrm{J}$$

*The trap.* Forgetting the factor of 1/4 from the chain rule on the exponent and
answering 100 J. The integral of $e^{-at}$ from zero to infinity is $1/a$, so the
time constant multiplies the answer as surely as the amplitude does.`,
},
{
  id: 'ic-set-c',
  title: '16. Problem Set: RMS, Energy and Quadrature',
  content: `## 16.1 Problem Set C: averages, RMS and stored energy

**Problem 1.** A current rises as $i(t) = 5(1 - e^{-t/2})$ amperes. Find the
charge delivered in the first 4 seconds and the average current.

$$Q = \\int_0^{4}5\\left(1 - e^{-t/2}\\right)dt = 20 - 10\\left(1 - e^{-2}\\right)$$

With $e^{-2} = 0.13534$, the bracket is 0.864665 and
$20 - 10 \\times 0.864665 = 11.35335$ coulombs. The average current is that
divided by 4 seconds, 2.838 A.

*The trap.* Using the final current of 5 A as though it applied throughout,
giving 20 C. The exponential approach means the average over these two time
constants is well below the asymptote.

**Problem 2.** A 100 microfarad capacitor is charged from 0 to 50 V by a linear
ramp lasting 2 s. Find the charging current and the energy stored.

The ramp slope is 25 V/s, so the current is constant:

$$i = C\\frac{dv}{dt}, \\qquad 0.0001 \\times 25 = 0.0025\\ \\mathrm{A}$$

The energy is the integral of power, and because $i = C\\,dv/dt$ the time integral
collapses to an integral over voltage:

$$W = \\int vi\\,dt = C\\int_0^{V}v\\,dv = \\tfrac{1}{2}CV^{2}$$

so $0.5 \\times 0.0001 \\times 2500 = 0.125$ J, which quadrature of the power
against time confirms.

*The trap.* Answering $CV^{2}$ and getting 0.25 J. The source delivered 0.25 J in
total; half of it went into the capacitor and half was dissipated in whatever
controlled the ramp. Both numbers are real, but only one of them is stored.

**Problem 3.** A waveform is 10 A for 3 ms of every 10 ms period and zero
otherwise. Find its RMS and average values, and the power it delivers to 2 ohm.

Duty cycle is 0.3. The mean square is $100 \\times 0.003 / 0.010 = 30$, so the RMS
is $\\sqrt{30} = 5.4772$ A and the average is 3 A. The power is
$30 \\times 2 = 60$ W.

*The trap.* Using the average current in the power calculation, giving
$9 \\times 2 = 18$ W. Power follows the mean of the square, and for this waveform
the mean square is more than three times the square of the mean.

**Problem 4.** A 60 Hz sinusoid of 170 V peak feeds a 100 ohm resistor. Find the
average power.

$$V_{rms} = 170 / 1.414214 = 120.2\\ \\mathrm{V}, \\qquad P = \\frac{120.2^{2}}{100} = 144.5\\ \\mathrm{W}$$

Equivalently, $P = V_m^{2}/(2R) = 28900 / 200 = 144.5$ W, which avoids the square
root entirely.

*The trap.* Using the peak voltage directly and answering
$28900 / 100 = 289$ W, exactly twice the truth. The factor of two is the mean of
the squared sinusoid, and it is the same factor whether you reach it through the
RMS value or through the identity.

## 16.2 Problem Set D: quadrature and applications

**Problem 5.** A voltage is sampled every 1 ms as 0, 4, 6, 4 and 0 volts across a
2 ohm resistor. Estimate the energy delivered over the 4 ms by Simpson's rule.

Power at the samples is $v^{2}/2$, that is 0, 8, 18, 8 and 0 watts. With h = 0.001
and Simpson weights 1, 4, 2, 4, 1:

$$0 + 4 \\times 8 + 2 \\times 18 + 4 \\times 8 + 0 = 100$$

$$W = 0.001 \\times 100 / 3 = 0.0333\\ \\mathrm{J}$$

*The trap.* Applying Simpson to the voltage samples first and squaring the result
at the end. The mean of the squares is not the square of the mean, so that route
answers a question nobody asked. Square each sample before integrating, always.

**Problem 6.** Estimate $\\int_0^{1}e^{x}dx$ with two panels by both rules and say
which to trust.

Trapezoid gives 1.7539311 and Simpson gives 1.7188612 against an exact
1.7182818. Simpson's error is 5.8e-4 while the trapezoid's is 3.6e-2 - about
sixty times smaller for exactly the same three samples.

*The trap.* Assuming more samples always beats a better rule. The trapezoidal
rule needs 16 panels, and therefore 17 samples, to reach the accuracy Simpson
gets from three, which is the practical content of the difference between
$h^{2}$ and $h^{4}$.

**Problem 7.** Find the volume generated by rotating the region under
$y = \\sqrt{x}$ from 0 to 4 about the x-axis.

Discs of radius $\\sqrt{x}$ have area $\\pi x$, so

$$V = \\pi\\int_0^{4}x\\,dx = \\pi\\left[\\frac{x^{2}}{2}\\right]_0^{4} = 8\\pi = 25.133$$

*The trap.* Forgetting to square the radius and integrating $\\pi\\sqrt{x}$
instead, which gives $16\\pi/3 = 16.755$. The disc area carries the square; the
arc length carries the root.

**Problem 8.** A 300 m span carries a conductor with a catenary parameter of
500 m. How much longer is the conductor than the span?

$$L = 2a\\sinh\\frac{d}{2a} = 2 \\times 500 \\times 0.304520 = 304.52\\ \\mathrm{m}$$

so the excess is $304.52 - 300 = 4.52$ m, about 1.5 per cent.

*The trap.* Approximating the catenary by a straight line between supports and
answering zero, or by two straight segments through the low point, which gives
303.41 m and so underestimates the excess by about a quarter. The hyperbolic
sine's cubic term is where the whole answer lives.`,
},
],
  keyTakeaways: [
    'Common integrals: ∫x^n dx = x^(n+1)/(n+1) + C, ∫e^x dx = e^x + C.',
    'Integration by parts: ∫u dv = uv - ∫v du; use LIATE to choose u.',
    'Energy in capacitors ½CV² and inductors ½LI² derived from integration.',
    'Average power P_avg = (1/T)∫p(t)dt; RMS value = sqrt[(1/T)∫f²(t)dt].',
    'Laplace transform F(s) = ∫₀^∞ f(t)e^(-st)dt converts ODEs to algebraic equations.',
  ],
},

fee_diffeq: {
  topicId: 'fee_diffeq',
  title: 'Differential Equations',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Differential equations model dynamic behavior in circuits — RC/RL transients, RLC oscillations, and control system responses. First-order and second-order linear ODEs with constant coefficients are the core of FE exam differential equations.',
  sections: [
    {
      id: 'de-first-order',
      title: '1. First-Order Linear ODEs',
      content: `## 1.1 Standard Form and Solution

A first-order linear ODE with constant coefficients:

**$dy/dt + ay = b$**

With initial condition y(0) = $y_{0}$, the solution is:

**$y(t) = b/a + (y_{0} - b/a)\\cdot e^{-at}$**

This has two parts:
- **Steady-state (forced) response**: y_ss = b/a (the value as t → ∞)
- **Transient (natural) response**: ($y_{0}$ - y_ss)·e^(-at) (decays exponentially)

### Time Constant

The **time constant** τ = 1/a determines how fast the transient decays:

| Time | Value of e^(-t/τ) | % of Steady State |
|---|---|---|
| $t = \\tau$ | 0.368 | 63.2% |
| $t = 2\\tau$ | 0.135 | 86.5% |
| $t = 3\\tau$ | 0.050 | 95.0% |
| $t = 5\\tau$ | 0.007 | 99.3% |

## 1.2 Circuit Applications

- **RC circuit**: τ = RC; v_C(t) = V_final + (V_initial - V_final)·e^(-t/RC)
- **RL circuit**: τ = L/R; i_L(t) = I_final + (I_initial - I_final)·e^(-tR/L)

The general first-order transient formula works for ANY first-order circuit:

**$x(t) = x(\\infty) + [x(0) - x(\\infty)]\\cdot e^{-t/\\tau}$**`,
      examTip: 'The universal first-order formula x(t) = x(∞) + [x(0) - x(∞)]·e^(-t/τ) solves ANY RC or RL transient. Find three things: initial value x(0), final value x(∞), and time constant τ. This single formula covers charging, discharging, and source-switching problems.',
      importantNote: 'At t = 0⁺ (just after switching): capacitor voltage CANNOT change instantly (v_C(0⁺) = v_C(0⁻)), and inductor current CANNOT change instantly (i_L(0⁺) = i_L(0⁻)). These continuity conditions are essential for finding initial values.',
    },
    {
      id: 'de-second-order',
      title: '2. Second-Order Linear ODEs and Damping',
      content: `## 2.1 Standard Form

The general second-order ODE for circuits and control systems:

**$d^{2}y/dt^{2} + 2\\zeta \\omega _{n}\\cdot dy/dt + \\omega _{n}^{2}\\cdot y = \\omega _{n}^{2}\\cdot u(t)$**

Where:
- **ωₙ** = natural frequency (rad/s)
- **ζ** = damping ratio (dimensionless)

### Characteristic Equation

Setting u(t) = 0 gives the **characteristic equation**: s² + 2ζωₙs + ωₙ² = 0

Roots: s = -ζωₙ ± ωₙ·sqrt(ζ² - 1)

## 2.2 Response Types

| Damping Ratio | Response Type | Root Type | Behavior |
|---|---|---|---|
| $\\zeta < 1$ | Underdamped | Complex conjugate | Oscillates with decaying envelope |
| $\\zeta = 1$ | Critically damped | Repeated real | Fastest return without overshoot |
| $\\zeta > 1$ | Overdamped | Distinct real | Slow, monotonic approach |

### Series RLC Circuit Parameters

For a series RLC circuit:
- **$\\omega _{n} = 1/\\sqrt{LC}$** (natural frequency)
- **$\\zeta = R/(2\\sqrt{L/C}) = R/(2)\\cdot \\sqrt{C/L}$** (damping ratio)
- **Damped frequency**: ωd = ωₙ·sqrt(1 - ζ²) (for underdamped case)

### Laplace Transform Approach

Converting to s-domain simplifies solving: the ODE becomes an algebraic equation in s.

**$s^{2}Y(s) + 2\\zeta \\omega _{n}sY(s) + \\omega _{n}^{2}Y(s) = \\omega _{n}^{2}U(s)$** (assuming zero initial conditions)

This gives **$H(s) = Y(s)/U(s) = \\omega _{n}^{2}/(s^{2} + 2\\zeta \\omega _{n}s + \\omega _{n}^{2})$**`,
      examTip: 'The damping ratio ζ is the MOST important parameter for second-order systems on the FE exam. ζ < 1 oscillates (underdamped), ζ = 1 is critically damped (fastest no-overshoot), ζ > 1 is overdamped (sluggish). For series RLC: ζ = R/(2sqrt(L/C)). Increasing R increases damping.',
      importantNote: 'Critically damped (ζ = 1) is NOT the fastest response — underdamped (ζ < 1) reaches the target faster but overshoots. Critically damped is the fastest WITHOUT overshoot. This distinction is tested on the FE exam.',
    },
    {
      id: 'de-worked',
      title: '3. Worked Examples',
      content: `## 3.1 First order: the RC circuit as an ODE

KVL on a series RC driven by V_s gives RC dv/dt + v = V_s, a first-order linear ODE with tau = RC.

Its solution never needs to be re-derived. Any first-order response is

**x(t) = x(infinity) + [x(0+) - x(infinity)] e^(-t/tau)**

For a 100 V step onto an uncharged capacitor with tau = 0.5 s: x(0+) = 0, x(infinity) = 100, so v(t) = 100(1 - e^(-2t)) V. At t = 0.5 s, v = 63.2 V.

## 3.2 Second order: the characteristic equation

A series RLC gives L d2i/dt2 + R di/dt + i/C = 0, whose characteristic equation is

**$s^2 + (R/L) s + 1/(LC) = 0$**

Write it as s^2 + 2 alpha s + omega_0^2 = 0 with alpha = R/2L (the damping factor) and omega_0 = 1/sqrt(LC) (the undamped natural frequency). Then:

| Condition | Roots | Name | Response |
|---|---|---|---|
| alpha > omega_0 | two real negative | overdamped | no overshoot, slow |
| alpha = omega_0 | repeated real | critically damped | fastest with no overshoot |
| alpha < omega_0 | complex pair | underdamped | rings, decaying envelope |

**Worked case:** R = 200 ohm, L = 0.1 H, C = 10 microfarad.
alpha = 200/(2 x 0.1) = 1000, omega_0 = 1/sqrt(0.1 x 10e-6) = 1000.
alpha equals omega_0 exactly, so the circuit is **critically damped** - the boundary case, and the one a designer aims for when settling time matters.

Change R to 100 ohm: alpha = 500 < omega_0 = 1000, so underdamped, with damped frequency omega_d = sqrt(omega_0^2 - alpha^2) = sqrt(1e6 - 250000) = **866 rad/s**.

## 3.3 Solving a separable equation

dy/dt = -ky, the decay law behind radioactive decay, capacitor discharge and thermal cooling.

Separate: dy/y = -k dt. Integrate: ln y = -kt + C, so **$y = y_0 e^{-kt}$**.

A quantity falling to half its value in 5 s gives 0.5 = e^(-5k), so k = ln2/5 = **0.139 per second**, and the time constant 1/k = 7.2 s. Note that the time constant is longer than the half-life by the factor 1/0.693.

## 3.4 Forced response and superposition

The complete solution is **natural response + forced response**. The natural part comes from the characteristic roots and always decays in a stable circuit; the forced part has the same form as the driving function and is what survives at steady state.

For a sinusoidal drive, the forced response is a sinusoid at the driving frequency - which is exactly what phasor analysis computes, and why phasors give you the steady state without ever writing the ODE.`,
      examTip: 'Compute alpha = R/2L and omega_0 = 1/sqrt(LC) and compare them before anything else. That single comparison names the response - over, critical or underdamped - and most second-order questions are asking only for that name.',
      quiz: [
        {
          question: 'A series RLC circuit has R = 20 ohm, L = 0.02 H and C = 50 microfarad. What is its damping character, and the damped natural frequency?',
          options: [
            'Underdamped, omega_d = 866 rad/s',
            'Overdamped, no oscillation',
            'Critically damped, omega_d = 0',
            'Underdamped, omega_d = 1000 rad/s',
          ],
          correctIndex: 0,
          explanation: 'alpha = R/(2L) = 20/0.04 = 500 and omega_0 = 1/sqrt(LC) = 1/sqrt(0.02 x 50e-6) = 1/sqrt(1e-6) = 1000. Since alpha < omega_0 the roots are complex and the response is underdamped. The damped frequency is omega_d = sqrt(omega_0^2 - alpha^2) = sqrt(1e6 - 250000) = 866 rad/s - always BELOW the undamped omega_0, which is why the last option is wrong.',
        },
        {
          question: 'A first-order circuit has an initial value of 20 V, a final value of 5 V and tau = 2 ms. What is v(t)?',
          options: [
            'v(t) = 5 + 15 e^(-t/0.002) V',
            'v(t) = 20 - 15 e^(-t/0.002) V',
            'v(t) = 5 + 20 e^(-t/0.002) V',
            'v(t) = 15 + 5 e^(-t/0.002) V',
          ],
          correctIndex: 0,
          explanation: 'Use x(t) = x(inf) + [x(0+) - x(inf)]e^(-t/tau) = 5 + (20-5)e^(-t/0.002). Check the endpoints: at t = 0 it gives 20 V, and as t grows it settles to 5 V. Any candidate answer failing either endpoint check is wrong by inspection.',
        },
        {
          question: 'A quantity decays exponentially with a half-life of 10 s. What is its time constant?',
          options: ['14.4 s', '10 s', '6.93 s', '20 s'],
          correctIndex: 0,
          explanation: 'Half-life = tau ln2, so tau = 10/0.693 = 14.4 s. The time constant is always LONGER than the half-life, by the factor 1/0.693 = 1.44. Swapping them is a frequent error in both decay and transient questions.',
        },
      ],
    },
  {
    id: 'de-depth',
    title: '4. From Characteristic Roots to Circuit Behaviour',
    content: `## 4.1 The characteristic equation decides everything
  
  A second-order linear ODE with constant coefficients,
  a·y″ + b·y′ + c·y = 0, is solved by assuming y = e^(st). Substituting gives
  (as² + bs + c)e^(st) = 0, and since the exponential is never zero:
  
  **$as^{2} + bs + c = 0$**
  
  The roots of that quadratic are the entire behaviour of the system. The
  discriminant b² − 4ac decides which of three cases you are in:
  
  | Discriminant | Roots | Response | Circuit name |
  |---|---|---|---|
  | $> 0$ | two distinct real | $C_{1}e^{s_{1}t} + C_{2}e^{s_{2}t}$ | overdamped |
  | $= 0$ | one repeated real | $(C_{1} + C_{2}t)e^{st}$ | critically damped |
  | $< 0$ | complex conjugate pair | $e^{\\alpha t}(C_{1}\\cos  \\omega _d t + C_{2}\\sin  \\omega _d t)$ | underdamped |
  
  ![Three second-order responses from the same natural frequency with different damping: overdamped approaches the final value slowly without overshoot, critically damped is the fastest without overshoot, and underdamped overshoots and rings before settling.](/courses/fe-ee/figures/math-damping-regimes.svg)
  
  The repeated-root case needs that extra factor of t, and it is the one people
  forget. Without it you have only one independent solution for a second-order
  equation, which cannot satisfy two initial conditions.
  
  ## 4.2 Series RLC, all the way through
  
  For a series RLC circuit the loop equation is
  L·di/dt + Ri + (1/C)∫i dt = 0. Differentiating once to clear the integral:
  
  $$L\\cdot i'' + R\\cdot i' + i/C = 0 \\to s^{2} + (R/L)s + 1/(LC) = 0$$
  
  Comparing with the standard form s² + 2αs + ω₀² = 0 gives the two parameters
  that name everything:
  
  - **$\\alpha = R/(2L)$**, the neper frequency — how fast the envelope decays
  - **$\\omega _{0} = 1/\\sqrt{LC}$**, the resonant frequency — how fast it would oscillate undamped
  
  | Comparison | Regime | What you see |
  |---|---|---|
  | α > ω₀ | overdamped | slow approach, no overshoot |
  | α = ω₀ | critically damped | fastest approach with no overshoot |
  | α < ω₀ | underdamped | overshoot and ringing at ω_d = √(ω₀² − α²) |
  
  **Worked.** Take L = 20 mH, C = 50 µF, and R = 20 Ω.
  
  $$\\omega _{0} = 1/\\sqrt{0.02 \\times 50\\times 10^{-6}} = 1/\\sqrt{10^{-6}} = 1000\\ \\mathrm{rad/s}$$
  $$\\alpha = R/(2L) = 20/(2 \\times 0.02) = 500\\ \\mathrm{s}^{-1}$$
  
  Since α = 500 < ω₀ = 1000, the circuit is **underdamped**, and it rings at
  
  $$\\omega _d = \\sqrt{1000^{2} - 500^{2}} = \\sqrt{750000} = 866\\ \\mathrm{rad/s}$$
  
  Note that the ringing frequency is *below* ω₀, always — damping slows the
  oscillation as well as shrinking it. To make this same circuit critically
  damped you would need α = ω₀, i.e. R = 2Lω₀ = 2(0.02)(1000) = **$40\\ \\Omega$**.
  
  ## 4.3 First order, and the shortcut that avoids the algebra
  
  First-order equations, τ·y′ + y = K, do not need this machinery. Every one of
  them has the same solution shape, and reading three numbers off the circuit is
  faster than solving anything:
  
  **$y(t) = y(\\infty) + [y(0) - y(\\infty)]\\cdot e^{-t/\\tau}$**
  
  - **y(0)** from continuity: capacitor voltage and inductor current cannot jump.
  - **$y(\\infty)$** from DC steady state: capacitor is an open circuit, inductor a short.
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
  | $e^{kt}$ | $A\\cdot e^{kt}$ |
  | $\\sin \\omega t$ or $\\cos \\omega t$ | A cos ωt + B sin ωt (**both terms**) |
  | polynomial of degree n | general polynomial of degree n |
  
  For a sinusoidal forcing function you must include **both** sine and cosine even
  if only one appears in the input, because the system shifts the phase. This is
  the time-domain version of the fact that impedance is complex, and it is why
  phasor analysis — which handles the magnitude and phase together — replaces this
  procedure entirely for AC steady state.
  
  The natural response decays to nothing whenever the roots have negative real
  parts, which is what leaves the forced response as the steady state. Stability
  in control systems is this same statement about root locations.`,
    examTip: 'Compute alpha = R/2L and omega-zero = 1/sqrt(LC) and compare them. That single comparison names the regime, and the ringing frequency omega-d = sqrt(omega-zero squared minus alpha squared) is always LOWER than omega-zero. An answer where the damped frequency exceeds the undamped one is arithmetically impossible.',
    importantNote: 'For a repeated root the second solution carries a factor of t: (C1 + C2 t) e^(st). Omitting it leaves a second-order equation with only one independent solution, which cannot satisfy two initial conditions.',
  },
{
  id: 'de-set',
  title: '5. Problem Set: Transients by Inspection',
  content: `## 5.1 First order, with a Thevenin time constant

A 10 µF capacitor sits between node A and ground. Looking back from the
capacitor with sources deactivated, the network reduces to 40 kΩ in parallel
with 60 kΩ. Find the time constant.

$$R_{th} = (40 \\times 60)/(40 + 60) = 2400/100 = 24 k\\Omega$$
$$\\tau = R_{th}\\cdot C = 24\\times 10^{3} \\times 10\\times 10^{-6} = 0.24\\ \\mathrm{s}$$

Using either resistor alone gives 0.4 s or 0.6 s, both of which are offered.
The time constant uses the resistance the *element* sees, not any single
component.

## 5.2 Classify a second-order circuit

Series RLC with R = 100 Ω, L = 10 mH, C = 1 µF.

$$\\omega _{0} = 1/\\sqrt{0.01 \\times 10^{-6}} = 1/\\sqrt{10^{-8}} = 10 000\\ \\mathrm{rad/s}$$
$$\\alpha = R/(2L) = 100/(2 \\times 0.01) = 5000\\ \\mathrm{s}^{-1}$$

α < ω₀, so **underdamped**, ringing at

$$\\omega _d = \\sqrt{(10\\,000)^{2} - 5000^{2}} = \\sqrt{10^{8} - 2.5\\times 10^{7}} = \\sqrt{7.5\\times 10^{7}} = 8660\\ \\mathrm{rad/s}$$

The damping ratio ζ = α/ω₀ = 0.5, which is the value control-systems questions
use for a well-damped step response with about 16 % overshoot.

## 5.3 The resistance for critical damping

For that same L and C, critical damping needs α = ω₀:

$$R/(2L) = \\omega _{0} \\to R = 2L\\omega _{0} = 2(0.01)(10 000) = 200\\ \\Omega$$

Doubling R from 100 Ω to 200 Ω moves the circuit from underdamped to critically
damped. Any larger R is overdamped — slower, but with no overshoot at all.

## 5.4 Solving a forced first-order equation

Solve i′ + 4i = 12 with i(0) = 0.

Natural part: root of s + 4 = 0 is s = −4, giving i_n = Ae^(−4t).
Forced part: a constant input gives a constant output, i_p = 12/4 = 3.
So i = 3 + Ae^(−4t), and i(0) = 0 gives A = −3:

$$i(t) = 3(1 - e^{-4t})$$

which is the universal first-order form with i(0) = 0, i(∞) = 3 and τ = 1/4 s —
confirming that the three-number shortcut and the full solution agree.`,
},
{
  id: 'de-errors',
  title: '6. Where Marks Are Lost',
  content: `## 6.1 Four recurring errors

| Error | What it looks like | The fix |
|---|---|---|
| Using a single resistor for τ | 0.4 s instead of 0.24 s | τ uses the Thevenin resistance the element sees |
| Omitting the t factor for a repeated root | one exponential where two solutions are needed | the second solution is t·e^(st) |
| Reporting ω_d above ω₀ | a damped frequency larger than the undamped one | damping always lowers the ringing frequency |
| Using only sine for a sinusoidal forcing term | no phase shift in the particular solution | include both sine and cosine |

The fastest structural check is the comparison **α against ω₀**. It names the
regime in one line, and it also tells you what the answer should look like
before you compute it: no overshoot means the response cannot cross its final
value, so a solution that does is wrong regardless of the algebra behind it.`,
},
{
  id: 'de-classify',
  title: '7. Reading an Equation Before You Solve It',
  content: `## 7.1 Order, linearity, homogeneity

Three questions decide which methods are even available, and answering them
costs about ten seconds. Skipping them is how a candidate ends up hunting for a
characteristic equation in a problem that has none, or grinding an integrating
factor through something that separates in one line.

**Order** is the highest derivative present. It fixes how many arbitrary
constants the general solution carries, and therefore how many extra conditions
are needed to pin one solution down: one for a first-order equation, two for a
second-order one.

**Linearity** asks whether the equation can be arranged into the shape

$$a_{n}(t)\\frac{d^{n}y}{dt^{n}} + a_{n-1}(t)\\frac{d^{n-1}y}{dt^{n-1}} + \\cdots + a_{1}(t)\\frac{dy}{dt} + a_{0}(t)y = g(t)$$

in which the unknown and every derivative of it stands alone, raised to the
first power, multiplied by nothing worse than a coefficient built out of the
independent variable. A product $y\\,y'$, a square $y^{2}$, or the unknown
buried inside a sine destroys linearity, and with it almost every technique on
this syllabus.

**Homogeneity** asks whether $g(t)$ vanishes identically. A homogeneous equation
describes a system left to itself; a non-homogeneous one describes a system
being pushed by something outside it.

| Equation | Order | Linear | Homogeneous | Coefficients |
|---|---|---|---|---|
| $RC\\,v' + v = V_{s}$ | 1 | yes | no | constant |
| $L\\,i'' + R\\,i' + i/C = 0$ | 2 | yes | yes | constant |
| $y' = k\\,y(1 - y/N)$ | 1 | no | not applicable | not applicable |
| $\\theta'' + (g/\\ell)\\sin\\theta = 0$ | 2 | no | not applicable | not applicable |
| $t\\,y'' + y' + t\\,y = 0$ | 2 | yes | yes | variable |

Homogeneity is only defined once linearity is established, which is why the
nonlinear rows carry no entry: there is no clean split into a driven part and a
free part when the unknown multiplies itself.

## 7.2 What linearity buys: superposition, proved

Write the left side as an operator, $L[y] = y'' + p(t)y' + q(t)y$.
Differentiation is itself linear, so for any constants $c_{1}$ and $c_{2}$

$$L[c_{1}y_{1} + c_{2}y_{2}] = c_{1}L[y_{1}] + c_{2}L[y_{2}]$$

If $y_{1}$ and $y_{2}$ each drive the operator to zero, every combination of
them does too. That one property is the entire reason a second-order linear
homogeneous equation can be solved by finding two independent solutions and then
scaling them to meet the initial conditions. Every technique later in this
chapter leans on it.

Nonlinear equations forfeit it, and the loss is easy to see. The function
$y = -1/t$ satisfies $y' = y^{2}$, because $y' = 1/t^{2}$ and $y^{2} = 1/t^{2}$
agree. Now double it: $w = -2/t$ has $w' = 2/t^{2}$ while $w^{2} = 4/t^{2}$, and
those are equal at no value of $t$ at all. Scaling a solution of a nonlinear
equation generally produces something that solves nothing.

## 7.3 The two-part structure of a driven linear equation

For a linear equation the general solution always splits the same way:

$$y(t) = y_{h}(t) + y_{p}(t)$$

where $y_{h}$ is the general solution of the homogeneous version, carrying all
the arbitrary constants, and $y_{p}$ is any one solution of the driven equation.
Subtracting shows why: if $y$ and $y_{p}$ both satisfy $L[y] = g$, then
$L[y - y_{p}] = 0$, so their difference is homogeneous.

The engineering names for the two pieces are **natural response** and **forced
response**. Two consequences are worth carrying into the exam. First, the
arbitrary constants belong to the total, not to $y_{h}$ alone, so initial
conditions are applied only after $y_{p}$ has been added. Fitting the constants
to the homogeneous part first is the single most common way to lose a
second-order problem. Second, if every root of the characteristic equation has a
negative real part, $y_{h}$ decays and $y_{p}$ is what remains at steady state.

### 7.4 Worked example: classify, then name the method

Classify each equation and state the technique it calls for.

$$\\text{(a)}\\quad 3y' + 12y = 24$$
$$\\text{(b)}\\quad y'' - 4y' + 4y = 3e^{2t}$$
$$\\text{(c)}\\quad y' = \\frac{t^{2}}{y}$$
$$\\text{(d)}\\quad t\\,y' + 3y = t^{2}$$
$$\\text{(e)}\\quad y'' + y = \\sec t$$

**(a)** First order, linear, constant coefficients, non-homogeneous. Both
routes work: separate the variables, or use the integrating factor $e^{4t}$. The
fastest route is the three-number shortcut, since $y(\\infty) = 24/12 = 2$ and
$\\tau = 3/12 = 0.25\\ \\mathrm{s}$.

**(b)** Second order, linear, constant coefficients, non-homogeneous. The
characteristic equation $s^{2} - 4s + 4 = 0$ has the repeated root $s = 2$, and
the forcing term $3e^{2t}$ matches it, so undetermined coefficients needs the
trial form multiplied by $t^{2}$.

**(c)** First order, **nonlinear** because the unknown appears in a
denominator. It is separable, however: $y\\,dy = t^{2}\\,dt$ integrates to
$y^{2}/2 = t^{3}/3 + C$. Separability does not require linearity, which is why
it is worth testing for first.

**(d)** First order, linear, **variable** coefficients. Dividing by $t$ gives
$y' + (3/t)y = t$, so the integrating factor is $t^{3}$. No characteristic
equation exists here; the coefficient moves.

**(e)** Second order, linear, constant coefficients, non-homogeneous, but the
forcing term is not a polynomial, an exponential or a sinusoid. Undetermined
coefficients has no trial form for $\\sec t$, so variation of parameters is the
only route.

The point of the drill is that four of the five were decided before any
integration happened. The classification chooses the method; the method then
does the work.`,
  examTip: 'Classify before you compute: order, then linearity, then homogeneity. Nonlinear rules out superposition and every constant-coefficient shortcut, and variable coefficients rule out the characteristic equation. Two of those three checks are pattern recognition, not algebra.',
  importantNote: 'Apply initial conditions to the COMPLETE solution y_h + y_p, never to the homogeneous part alone. Fitting the constants before the particular solution has been added gives an answer that satisfies the differential equation but not the initial conditions, and the error is invisible in the final expression.',
},
{
  id: 'de-first-methods',
  title: '8. First-Order Equations: Three Shapes, Three Methods',
  content: `## 8.1 Separable equations

An equation is separable when it can be written as a function of the
independent variable multiplied by a function of the unknown:

$$\\frac{dy}{dt} = g(t)\\,h(y) \\quad\\Longrightarrow\\quad \\int\\frac{dy}{h(y)} = \\int g(t)\\,dt$$

The manipulation looks like treating $dy/dt$ as a fraction, which it is not, but
the result is legitimate: it is the chain rule read backwards. Both sides are
antiderivatives of the same function of $t$, so they differ by a constant.

The picture below is the other way to see a first-order equation. At every point
of the plane the equation prescribes a slope, and the solution curves are simply
the curves that follow those slopes.

![Direction field of the equation y prime equals six minus two y, with three solution curves starting from zero, one and five. Every curve bends toward the horizontal line at y equals three, which is the only place the prescribed slope is zero.](/courses/fe-ee/figures/math4-de-direction-field.svg)

Nothing was solved to draw the arrows: each one is the value of $6 - 2y$ at that
point. Reading the field alone tells you the equilibrium sits at $y = 3$, that
it attracts from both sides, and that no solution can cross another.

### 8.2 Worked example: exponential decay and a cooling body

**Decay.** Solve $y' = -0.4y$ with $y(0) = 25$.

$$\\int\\frac{dy}{y} = -\\int 0.4\\,dt \\quad\\Longrightarrow\\quad \\ln y = -0.4t + C \\quad\\Longrightarrow\\quad y = 25e^{-0.4t}$$

At $t = 3$ the value is $25e^{-1.2}$. Since $e^{-1.2} = 0.3011942$, that is
$25 \\times 0.3011942 = 7.52986$. Numerical integration of the original equation
reaches 7.529855 at the same instant, which is the check that matters: the
closed form was never re-read, it was re-derived.

**Cooling.** A body at 90 degrees Celsius cools in a 20 degree room with
$T' = -k(T - 20)$ and $k = 0.05\\ \\mathrm{min}^{-1}$. The unknown is the
*excess* temperature, so substitute $u = T - 20$ and the equation becomes
$u' = -0.05u$, already solved:

$$T(t) = 20 + 70e^{-0.05t}$$

At $t = 30$ minutes, $e^{-1.5} = 0.223130$, so
$T = 20 + 70 \\times 0.223130 = 35.619$ degrees. To find when it passes 40
degrees, invert instead of guessing:

$$70e^{-0.05t} = 20 \\quad\\Longrightarrow\\quad t = \\frac{\\ln(70/20)}{0.05} = \\frac{1.252763}{0.05} = 25.06\\ \\mathrm{min}$$

Substituting 25.06 back gives 40.00 degrees, so the inversion is sound.

## 8.3 The integrating factor, derived rather than quoted

For the linear first-order equation

$$\\frac{dy}{dt} + p(t)\\,y = q(t)$$

the trick is to multiply through by some function $\\mu(t)$ chosen so that the
left side collapses into a single derivative. Expanding the product rule,

$$\\frac{d}{dt}\\left[\\mu y\\right] = \\mu\\frac{dy}{dt} + \\frac{d\\mu}{dt}y$$

Comparing that with $\\mu y' + \\mu p y$ shows the two agree precisely when

$$\\frac{d\\mu}{dt} = p(t)\\,\\mu \\quad\\Longrightarrow\\quad \\mu(t) = \\exp\\!\\left(\\int p(t)\\,dt\\right)$$

which is itself a separable equation, solved by the previous method. So the
integrating factor is not a rule handed down; it is the unique multiplier that
makes the product rule run backwards. With it in hand,

$$\\frac{d}{dt}\\left[\\mu y\\right] = \\mu q \\quad\\Longrightarrow\\quad y(t) = \\frac{1}{\\mu(t)}\\left[\\int \\mu(t)q(t)\\,dt + C\\right]$$

The constant of integration in $\\mu$ itself may be dropped, because it appears
as a common factor on both sides and cancels.

### 8.4 Worked example: constant coefficients by integrating factor

Solve $y' + 2y = 6$ with $y(0) = 1$.

Here $p = 2$, so $\\mu = e^{2t}$, and

$$\\frac{d}{dt}\\left[e^{2t}y\\right] = 6e^{2t} \\quad\\Longrightarrow\\quad e^{2t}y = 3e^{2t} + C \\quad\\Longrightarrow\\quad y = 3 + Ce^{-2t}$$

The initial condition gives $1 = 3 + C$, so $C = -2$ and

$$y(t) = 3 - 2e^{-2t}$$

At $t = 0.5$, $e^{-1} = 0.367879$, so $y = 3 - 2 \\times 0.3678794 = 2.26424$.
Notice the answer is exactly the universal first-order form with
$y(0) = 1$, $y(\\infty) = 3$ and $\\tau = 0.5\\ \\mathrm{s}$, which is the check
to run whenever the coefficients are constant.

### 8.5 Worked example: a variable coefficient, where no shortcut exists

Solve $t\\,y' + 3y = t^{2}$ for $t > 0$ with $y(1) = 1$.

Divide by $t$ to reach standard form, $y' + (3/t)y = t$. Then

$$\\mu = \\exp\\!\\left(\\int\\frac{3}{t}\\,dt\\right) = e^{3\\ln t} = t^{3}$$

$$\\frac{d}{dt}\\left[t^{3}y\\right] = t^{3}\\cdot t = t^{4} \\quad\\Longrightarrow\\quad t^{3}y = \\frac{t^{5}}{5} + C$$

$$y(t) = \\frac{t^{2}}{5} + \\frac{C}{t^{3}}$$

The condition $y(1) = 1$ gives $1 = 1/5 + C$, so $C = 4/5$. At $t = 2$,

$$y(2) = \\frac{4}{5} + \\frac{0.8}{8} = 0.8 + 0.1 = 0.9$$

Marching the original equation numerically from $t = 1$ to $t = 2$ lands on
0.900000, confirming it. There is no time constant here and no steady state to
read off, which is exactly what variable coefficients cost you.

### 8.6 Worked example: an RL circuit driven by a sinusoid

A 0.5 H inductor in series with 10 ohms is driven by $20\\sin 20t$ volts from
rest. The loop equation $0.5\\,i' + 10i = 20\\sin 20t$ becomes

$$i' + 20i = 40\\sin 20t, \\qquad i(0) = 0$$

Take the forced part as $i_{p} = A\\sin 20t + B\\cos 20t$; both terms are
required, because a first-order system shifts the phase. Substituting and
matching coefficients,

$$20A\\cos 20t - 20B\\sin 20t + 20A\\sin 20t + 20B\\cos 20t = 40\\sin 20t$$

$$\\sin: \\quad 20A - 20B = 40, \\qquad \\cos: \\quad 20A + 20B = 0$$

so $B = -A$ and $40A = 40$, giving $A = 1$ and $B = -1$. The forced current is
$\\sin 20t - \\cos 20t$, an amplitude of $\\sqrt{2} = 1.4142$ lagging the drive
by 45 degrees. Adding the natural part $Ce^{-20t}$ and imposing $i(0) = 0$ gives
$0 - 1 + C = 0$, so $C = 1$:

$$i(t) = \\sin 20t - \\cos 20t + e^{-20t}$$

![The current in a driven RL circuit split into parts: the forced sinusoid of amplitude root two lagging the drive, the decaying exponential that satisfies the initial condition, and their sum, which is indistinguishable from the forced part after about a quarter of a second.](/courses/fe-ee/figures/math4-de-forced-split.svg)

At $t = 0.05\\ \\mathrm{s}$ the argument $20t$ is one radian, so
$i = 0.841471 - 0.540302 + 0.367879 = 0.669048\\ \\mathrm{A}$, which adaptive
Runge-Kutta reproduces to eight figures. This calculation is also the answer to
why phasors exist: the amplitude and the 45 degree lag are exactly what
$Z = R + j\\omega L$ delivers in one line, without the algebra above.

## 8.7 Exact equations, and the test for exactness

Some first-order equations are neither separable nor linear but are still the
total differential of a hidden function. Write the equation as

$$M(x,y)\\,dx + N(x,y)\\,dy = 0$$

If there is a function $F(x,y)$ with $\\partial F/\\partial x = M$ and
$\\partial F/\\partial y = N$, then the equation says $dF = 0$, so $F = C$ is the
solution in implicit form. Such an $F$ exists exactly when the mixed second
partials of $F$ agree, which gives the test:

$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$

The test is cheap, it is decisive, and failing it is informative: an inexact
equation may still be made exact by an integrating factor, which is the same
device as before, generalised.

### 8.8 Worked example: an exact equation carried to a number

Solve $(2xy + 3)\\,dx + (x^{2} - 4y)\\,dy = 0$ through the point $(1, 2)$.

Test first. With $M = 2xy + 3$ and $N = x^{2} - 4y$,

$$\\frac{\\partial M}{\\partial y} = 2x, \\qquad \\frac{\\partial N}{\\partial x} = 2x$$

They agree, so the equation is exact. Recover $F$ by integrating $M$ in $x$,
carrying an unknown function of $y$ as the constant:

$$F = \\int (2xy + 3)\\,dx = x^{2}y + 3x + g(y)$$

Differentiate that in $y$ and match it against $N$:

$$\\frac{\\partial F}{\\partial y} = x^{2} + g'(y) = x^{2} - 4y \\quad\\Longrightarrow\\quad g'(y) = -4y \\quad\\Longrightarrow\\quad g = -2y^{2}$$

$$F(x,y) = x^{2}y + 3x - 2y^{2} = C$$

At $(1, 2)$ the value is $2 + 3 - 8 = -3$, so the solution curve is
$x^{2}y + 3x - 2y^{2} = -3$. To read a value off it at $x = 2$, substitute and
solve the quadratic $2y^{2} - 4y - 9 = 0$, giving

$$y = \\frac{4 + \\sqrt{88}}{4} = 1 + \\frac{9.380832}{4} = 3.3452$$

Integrating the equivalent explicit equation $dy/dx = -M/N$ numerically from
$(1, 2)$ holds $F$ at $-3.000000$ the whole way and arrives at the same value,
which is the independent confirmation.

## 8.9 Choosing among the three

| Test | Passes when | Method | Cost |
|---|---|---|---|
| separable | the right side factors as $g(t)h(y)$ | two integrals | lowest |
| linear | fits $y' + p(t)y = q(t)$ | integrating factor $e^{\\int p\\,dt}$ | one extra integral |
| exact | $M_{y} = N_{x}$ | recover $F$, set $F = C$ | one integral plus a match |

Test in that order. Separability is checked by eye, linearity by inspection of
where the unknown sits, and exactness by two partial derivatives. An equation
can pass more than one test, and when it does the cheapest route is the right
one; the answers agree because the solution is unique.`,
  examTip: 'Test for separability first, linearity second, exactness third. The order is cheapest-first, and a linear constant-coefficient equation should never be solved by integrating factor under time pressure when the three-number form x(t) = x(inf) + [x(0) - x(inf)]e^(-t/tau) applies.',
  importantNote: 'For a sinusoidal drive the trial particular solution must contain BOTH a sine and a cosine at the driving frequency, even when the input has only one of them. Omitting the second term forces the phase shift to be zero and the coefficients then have no consistent solution.',
},
{
  id: 'de-second-cases',
  title: '9. Second Order: The Characteristic Equation and Its Three Cases',
  content: `## 9.1 Where the characteristic equation comes from

For the constant-coefficient homogeneous equation $a\\,y'' + b\\,y' + c\\,y = 0$,
try $y = e^{st}$. Every derivative reproduces the exponential with a factor of
$s$, so

$$a s^{2}e^{st} + b s e^{st} + c e^{st} = (as^{2} + bs + c)\\,e^{st} = 0$$

An exponential is never zero, so the bracket must be. That is the whole
derivation, and it explains why the method fails for variable coefficients:
there the bracket would still contain $t$ and could not be set to zero once and
for all.

For a series RLC loop the same substitution gives, after dividing by $L$,

$$s^{2} + \\frac{R}{L}s + \\frac{1}{LC} = 0 \\quad\\equiv\\quad s^{2} + 2\\alpha s + \\omega_{0}^{2} = 0$$

$$\\alpha = \\frac{R}{2L}, \\qquad \\omega_{0} = \\frac{1}{\\sqrt{LC}}, \\qquad s = -\\alpha \\pm \\sqrt{\\alpha^{2} - \\omega_{0}^{2}}$$

The damping ratio is the dimensionless version of the same comparison,
$\\zeta = \\alpha/\\omega_{0}$, and the three cases are three signs of the same
discriminant.

| Discriminant | Roots | Natural response | Name | $\\zeta$ |
|---|---|---|---|---|
| $\\alpha^{2} > \\omega_{0}^{2}$ | two real, both negative | $A e^{s_{1}t} + B e^{s_{2}t}$ | overdamped | $> 1$ |
| $\\alpha^{2} = \\omega_{0}^{2}$ | one repeated real | $(A + Bt)e^{-\\alpha t}$ | critically damped | $= 1$ |
| $\\alpha^{2} < \\omega_{0}^{2}$ | complex conjugates | $e^{-\\alpha t}(A\\cos\\omega_{d}t + B\\sin\\omega_{d}t)$ | underdamped | $< 1$ |

The damped ringing frequency is $\\omega_{d} = \\sqrt{\\omega_{0}^{2} - \\alpha^{2}}$,
always strictly below $\\omega_{0}$. Damping slows the oscillation as well as
shrinking it, so any answer with $\\omega_{d} > \\omega_{0}$ can be discarded on
sight.

## 9.2 Why the repeated root needs a factor of t

When the roots coincide, $e^{st}$ supplies only one solution, and a second-order
equation needs two independent ones to satisfy two initial conditions. Test
$y = t e^{-\\alpha t}$ against $y'' + 2\\alpha y' + \\alpha^{2}y = 0$:

$$y' = (1 - \\alpha t)e^{-\\alpha t}, \\qquad y'' = (\\alpha^{2}t - 2\\alpha)e^{-\\alpha t}$$

$$y'' + 2\\alpha y' + \\alpha^{2}y = \\left[(\\alpha^{2}t - 2\\alpha) + 2\\alpha(1 - \\alpha t) + \\alpha^{2}t\\right]e^{-\\alpha t} = 0$$

Every term cancels, so $t e^{-\\alpha t}$ is a genuine second solution. Leaving
it out is not a stylistic omission; it makes the two initial conditions
unsatisfiable in general.

### 9.3 Worked example: one L and C, three resistors

Take $L = 1\\ \\mathrm{mH}$ and $C = 250\\ \\mu\\mathrm{F}$, so

$$\\omega_{0} = \\frac{1}{\\sqrt{10^{-3}\\times 250\\times 10^{-6}}} = \\frac{1}{\\sqrt{2.5\\times 10^{-7}}} = 2000\\ \\mathrm{rad/s}$$

The capacitor starts charged to 10 V with no current flowing, so $i(0) = 0$ and
the initial slope comes from the loop equation at $t = 0^{+}$:
$L\\,i'(0) = v_{C}(0)$, giving $i'(0) = 10/10^{-3} = 10\\,000\\ \\mathrm{A/s}$.

**R = 5 ohm, overdamped.** Here $\\alpha = 5/(2\\times 10^{-3}) = 2500$, and

$$s = -2500 \\pm \\sqrt{2500^{2} - 2000^{2}} = -2500 \\pm 1500 = -1000,\\ -4000$$

With $i = Ae^{-1000t} + Be^{-4000t}$ the conditions give $A + B = 0$ and
$-1000A - 4000B = 10\\,000$, so $3000A = 10\\,000$ and $A = 10/3$:

$$i(t) = \\tfrac{10}{3}\\left(e^{-1000t} - e^{-4000t}\\right)\\ \\mathrm{A}$$

**R = 4 ohm, critically damped.** Now $\\alpha = 2000 = \\omega_{0}$ exactly, the
root is repeated, and $i = (A + Bt)e^{-2000t}$. From $i(0) = 0$, $A = 0$; from
$i'(0) = B = 10\\,000$,

$$i(t) = 10\\,000\\,t\\,e^{-2000t}\\ \\mathrm{A}$$

**R = 2 ohm, underdamped.** Here $\\alpha = 1000 < \\omega_{0}$, so

$$\\omega_{d} = \\sqrt{2000^{2} - 1000^{2}} = \\sqrt{3\\times 10^{6}} = 1732.05\\ \\mathrm{rad/s}$$

and $i = e^{-1000t}(A\\cos\\omega_{d}t + B\\sin\\omega_{d}t)$ with $A = 0$ and
$B\\omega_{d} = 10\\,000$, so $B = 10\\,000/1732.05 = 5.7735$:

$$i(t) = 5.7735\\,e^{-1000t}\\sin(1732.05\\,t)\\ \\mathrm{A}$$

![Three discharge currents from the same charged capacitor through the same inductor, with two, four and five ohms of resistance. The underdamped case peaks highest and later, then swings negative; the critically damped and overdamped cases peak lower and never reverse.](/courses/fe-ee/figures/math4-de-damping-family.svg)

Each of the three closed forms was confirmed by integrating the original
second-order equation numerically and comparing at four separate instants. The
peaks come from setting each derivative to zero: the overdamped case peaks where
$4e^{-4000t} = e^{-1000t}$, that is at $t = (\\ln 4)/3000\\ \\mathrm{s} = 0.4621\\ \\mathrm{ms}$
carrying 1.5749 A; the critical case peaks at $t = 1/2000 = 0.5\\ \\mathrm{ms}$
carrying 1.8394 A; the underdamped case peaks where
$\\tan\\omega_{d}t = \\omega_{d}/\\alpha = 1.7321$, at
$t = 0.6046\\ \\mathrm{ms}$ carrying 2.7315 A.

The comparison is the lesson. Identical stored energy, identical L and C, and a
factor of two and a half in resistance changes the peak current by 73 per cent
and produces a completely different shape. Only the underdamped case sends
current backwards through the source.

### 9.4 Worked example: a check that costs nothing

For the overdamped case the roots were $-1000$ and $-4000$. Their sum should be
$-R/L$ and their product $1/(LC)$, because
$s^{2} + (R/L)s + 1/(LC) = (s - s_{1})(s - s_{2})$:

$$s_{1} + s_{2} = -5000 = -\\frac{5}{10^{-3}}, \\qquad s_{1}s_{2} = 4\\times 10^{6} = \\frac{1}{LC}$$

Both hold. This is the second-order analogue of the trace and determinant checks
in the linear algebra chapter, and it is the same fact wearing different
clothes: the roots of a characteristic polynomial always sum to minus the
coefficient of $s$ and multiply to the constant term.

## 9.5 Reading damping off a measured trace

An underdamped response gives up its parameters to a ruler. Successive peaks of
$e^{-\\alpha t}$ separated by one damped period $T_{d} = 2\\pi/\\omega_{d}$ are in
the fixed ratio

$$\\frac{i_{n}}{i_{n+1}} = e^{\\alpha T_{d}} \\quad\\Longrightarrow\\quad \\delta = \\ln\\frac{i_{n}}{i_{n+1}} = \\alpha T_{d}$$

so measuring the period and any two consecutive peaks yields $\\alpha$ and
$\\omega_{d}$, and therefore $\\omega_{0} = \\sqrt{\\alpha^{2} + \\omega_{d}^{2}}$
and $\\zeta = \\alpha/\\omega_{0}$. For the 2 ohm case above,
$T_{d} = 2\\pi/1732.05 = 3.6276\\ \\mathrm{ms}$ and
$\\delta = 1000 \\times 0.0036276 = 3.6276$, so consecutive peaks fall by the
factor $e^{-3.6276} = 0.02658$. A ringing that heavily damped shows barely one
visible overshoot, which is exactly what the figure shows.`,
  examTip: 'Compute alpha = R/2L and omega-zero = 1/sqrt(LC) first and compare them; that single comparison names the regime. Then check your roots against the coefficients: they must sum to minus R/L and multiply to 1/(LC). Both checks together take under fifteen seconds.',
  importantNote: 'The initial slope of a source-free series RLC current is NOT zero even though the current itself starts at zero. It is set by the charged capacitor through L di/dt = v_C(0), and using zero instead makes the whole natural response collapse to nothing.',
},
{
  id: 'de-undetermined',
  title: '10. Undetermined Coefficients and the Resonance Rule',
  content: `## 10.1 The trial forms, and why they work

For a constant-coefficient equation driven by a polynomial, an exponential, a
sinusoid or a product of those, the particular solution has the same shape as
the drive. The reason is structural: differentiating any of those functions
returns a function of the same family, so a combination of the family can be
made to match.

| Forcing term $g(t)$ | Trial particular solution |
|---|---|
| constant $K$ | $A$ |
| polynomial of degree $n$ | $A_{n}t^{n} + \\cdots + A_{1}t + A_{0}$, all terms |
| $e^{kt}$ | $Ae^{kt}$ |
| $\\sin\\omega t$ or $\\cos\\omega t$ | $A\\cos\\omega t + B\\sin\\omega t$, both terms |
| $t^{n}e^{kt}$ | $(A_{n}t^{n} + \\cdots + A_{0})e^{kt}$ |
| $e^{kt}\\sin\\omega t$ | $e^{kt}(A\\cos\\omega t + B\\sin\\omega t)$ |

Two entries are traps. A polynomial drive needs **every** lower power, not just
the top one, because differentiation cascades downward. A sinusoidal drive needs
**both** the sine and the cosine, because the system shifts phase.

## 10.2 The resonance rule

The method breaks when the trial form already solves the homogeneous equation:
substituting it then gives zero on the left and cannot match a non-zero right.
The repair is to multiply the trial form by $t$, and by $t^{2}$ if the root is
repeated. In general, multiply by $t^{m}$ where $m$ is the multiplicity of the
matching root in the characteristic equation.

$$\\text{root of multiplicity } m \\text{ matches the drive} \\quad\\Longrightarrow\\quad y_{p} = t^{m}\\times(\\text{usual trial form})$$

This is not a patch. It is what the exact solution genuinely looks like, and it
is the mathematics of resonance: a system driven at a frequency it already wants
to move at accumulates amplitude instead of settling.

### 10.3 Worked example: no resonance, sinusoidal drive

Solve for the particular solution of $y'' + 3y' + 2y = 10\\sin t$.

The characteristic roots are $-1$ and $-2$; neither is $\\pm j$, so there is no
clash. Try $y_{p} = A\\cos t + B\\sin t$:

$$y_{p}' = -A\\sin t + B\\cos t, \\qquad y_{p}'' = -A\\cos t - B\\sin t$$

$$(-A + 3B + 2A)\\cos t + (-B - 3A + 2B)\\sin t = 10\\sin t$$

Matching gives $A + 3B = 0$ and $B - 3A = 10$. Substituting $A = -3B$ into the
second, $B + 9B = 10$, so $B = 1$ and $A = -3$:

$$y_{p} = -3\\cos t + \\sin t, \\qquad \\text{amplitude } \\sqrt{9 + 1} = 3.1623$$

Substituting this back into the differential equation at three separate values
of $t$ reproduces $10\\sin t$ exactly, which is the check.

### 10.4 Worked example: first-order resonance

Solve $y' + 2y = 5e^{-2t}$ with $y(0) = 0$.

The homogeneous solution is $Ce^{-2t}$, and the drive is that same exponential.
A trial $Ae^{-2t}$ is annihilated by the left side, so multiply by $t$. With
$y_{p} = Ate^{-2t}$,

$$y_{p}' = Ae^{-2t} - 2Ate^{-2t}$$

$$y_{p}' + 2y_{p} = Ae^{-2t} - 2Ate^{-2t} + 2Ate^{-2t} = Ae^{-2t} = 5e^{-2t}$$

so $A = 5$ and, with $y(0) = 0$ forcing the homogeneous constant to zero,

$$y(t) = 5t\\,e^{-2t}$$

This response rises from zero, peaks where $y' = 0$ at $t = 0.5$ with
$y = 2.5e^{-1} = 0.9197$, and then decays. The rise and fall is what resonance
looks like when there is damping to eventually win: the $t$ factor pushes up,
the exponential pulls down, and the exponential always wins in the end.

### 10.5 Worked example: undamped resonance, where nothing wins

Solve $y'' + 400y = 100\\cos 20t$ from rest.

The homogeneous solutions are $\\cos 20t$ and $\\sin 20t$, and the drive is at
that same 20 rad/s. Multiply the trial form by $t$ and take
$y_{p} = t(A\\cos 20t + B\\sin 20t)$. Differentiating twice,

$$y_{p}'' = -40A\\sin 20t + 40B\\cos 20t - 400\\,t(A\\cos 20t + B\\sin 20t)$$

The bracketed part is exactly $-400y_{p}$, so it cancels against the $400y_{p}$
term and

$$y_{p}'' + 400y_{p} = -40A\\sin 20t + 40B\\cos 20t = 100\\cos 20t$$

giving $A = 0$ and $B = 100/40 = 2.5$. From rest, the homogeneous constants are
zero as well:

$$y(t) = 2.5\\,t\\,\\sin 20t$$

![The response of an undamped oscillator driven exactly at its natural frequency grows inside a straight-line envelope of two point five times t, while the same oscillator driven two radians per second away produces bounded beats with a ceiling of two point three eight.](/courses/fe-ee/figures/math4-de-resonance.svg)

The envelope is the straight line $2.5t$, so the amplitude at $t = 4$ is
$2.5 \\times 4 = 10$ and it keeps climbing. Detune the drive to 22 rad/s and the
character changes completely. Now $400 - 484 = -84$, so the ordinary trial form
works with amplitude $100/(-84) = -1.190476$, and the solution from rest is

$$y(t) = -1.190476\\left(\\cos 22t - \\cos 20t\\right) = 2.380952\\,\\sin(21t)\\sin t$$

using the product identity for a difference of cosines. That is bounded, with a
ceiling of 2.380952 reached whenever $\\sin t$ touches one. The lesson an
examiner is testing is that unbounded growth is not caused by a large drive but
by an exact frequency match with no damping present.

### 10.6 Worked example: a repeated root that matches the drive

Solve for the particular solution of $y'' - 4y' + 4y = 3e^{2t}$.

The characteristic equation $s^{2} - 4s + 4 = 0$ has $s = 2$ twice, so both
$e^{2t}$ and $t e^{2t}$ are homogeneous. The drive matches a root of
multiplicity two, so the trial form carries $t^{2}$. With $y_{p} = At^{2}e^{2t}$,

$$y_{p}' = 2Ate^{2t} + 2At^{2}e^{2t}, \\qquad y_{p}'' = 2Ae^{2t} + 8Ate^{2t} + 4At^{2}e^{2t}$$

$$y_{p}'' - 4y_{p}' + 4y_{p} = 2Ae^{2t} = 3e^{2t} \\quad\\Longrightarrow\\quad A = 1.5$$

$$y_{p} = 1.5\\,t^{2}e^{2t}$$

Every $t e^{2t}$ and $t^{2}e^{2t}$ term cancelled, leaving only the bare
exponential; that cancellation is the signature of a correctly chosen trial
form. Numerical integration from rest tracks $1.5t^{2}e^{2t}$ to six figures.

A candidate who used $Ae^{2t}$ would have found $0 = 3$, and one who used
$Ate^{2t}$ would have found $0 = 3$ again, since both are homogeneous. Getting
an impossible equation is the diagnostic: it means the multiplier is one power
of $t$ short.`,
  examTip: 'Before writing any trial form, compare the drive with the characteristic roots. A constant drive clashes when a root is zero, an exponential e^(kt) clashes when k is a root, and a sinusoid at omega clashes when the roots are plus and minus j omega. Each clash costs one factor of t per repetition of the root.',
  importantNote: 'An impossible equation such as 0 = 3 when matching coefficients does not mean the problem is broken. It means the trial form was annihilated by the left side, so it already solves the homogeneous equation and must be multiplied by another power of t.',
},
{
  id: 'de-variation',
  title: '11. Variation of Parameters, for Everything Else',
  content: `## 11.1 The construction

Undetermined coefficients covers polynomials, exponentials and sinusoids.
Anything else, and constant coefficients are not even required, calls for
variation of parameters. Given two independent homogeneous solutions $y_{1}$ and
$y_{2}$ of

$$y'' + p(t)y' + q(t)y = g(t)$$

replace the constants in $c_{1}y_{1} + c_{2}y_{2}$ by functions and demand one
extra condition to keep the algebra closed. The result is

$$W = y_{1}y_{2}' - y_{2}y_{1}', \\qquad y_{p} = -y_{1}\\int\\frac{y_{2}\\,g}{W}\\,dt + y_{2}\\int\\frac{y_{1}\\,g}{W}\\,dt$$

The quantity $W$ is the **Wronskian**, and it does double duty: it appears in the
formula, and it is non-zero precisely when $y_{1}$ and $y_{2}$ are independent.
If a Wronskian comes out zero, the two chosen solutions were multiples of each
other and the construction cannot proceed.

The price of the generality is that the two integrals are often unpleasant, and
the FE examiner will only set cases where they close in elementary functions.

### 11.2 Worked example: a drive with no trial form

Solve for the particular solution of $y'' + y = \\sec t$.

The homogeneous solutions are $y_{1} = \\cos t$ and $y_{2} = \\sin t$, and

$$W = \\cos t\\cdot\\cos t - \\sin t\\cdot(-\\sin t) = \\cos^{2}t + \\sin^{2}t = 1$$

which is the tidiest Wronskian available. The two integrals are

$$\\int\\frac{y_{2}g}{W}\\,dt = \\int\\sin t\\,\\sec t\\,dt = \\int\\tan t\\,dt = -\\ln\\lvert\\cos t\\rvert$$

$$\\int\\frac{y_{1}g}{W}\\,dt = \\int\\cos t\\,\\sec t\\,dt = \\int dt = t$$

so

$$y_{p} = \\cos t\\,\\ln\\lvert\\cos t\\rvert + t\\sin t$$

Verify by differentiating twice. The first derivative simplifies remarkably,
because two terms cancel:

$$y_{p}' = -\\sin t\\,\\ln\\lvert\\cos t\\rvert - \\sin t + \\sin t + t\\cos t = -\\sin t\\,\\ln\\lvert\\cos t\\rvert + t\\cos t$$

$$y_{p}'' = -\\cos t\\,\\ln\\lvert\\cos t\\rvert + \\frac{\\sin^{2}t}{\\cos t} + \\cos t - t\\sin t$$

Adding $y_{p}$ cancels both logarithm terms and both terms in $t$, leaving

$$y_{p}'' + y_{p} = \\frac{\\sin^{2}t + \\cos^{2}t}{\\cos t} = \\sec t$$

At $t = 0.5$ the particular solution is
$0.8775826 \\times (-0.1305842) + 0.2397128 = 0.125114$, and integrating
the equation numerically from rest reaches the same value.

### 11.3 Worked example: the same answer by two routes

Solve for the particular solution of $y'' - y = e^{t}$, first by variation of
parameters and then by undetermined coefficients, and compare.

The homogeneous solutions are $e^{t}$ and $e^{-t}$, so

$$W = e^{t}\\left(-e^{-t}\\right) - e^{-t}\\left(e^{t}\\right) = -1 - 1 = -2$$

$$y_{p} = -e^{t}\\int\\frac{e^{-t}e^{t}}{-2}dt + e^{-t}\\int\\frac{e^{t}e^{t}}{-2}dt = \\frac{t}{2}e^{t} - \\frac{1}{4}e^{t}$$

The second term is itself a homogeneous solution, so it can be absorbed into the
constants and dropped, leaving $y_{p} = \\tfrac{1}{2}te^{t}$.

Now the other route. The drive $e^{t}$ matches the simple root $s = 1$, so
undetermined coefficients uses $y_{p} = Ate^{t}$:

$$y_{p}' = Ae^{t} + Ate^{t}, \\qquad y_{p}'' = 2Ae^{t} + Ate^{t}$$

$$y_{p}'' - y_{p} = 2Ae^{t} = e^{t} \\quad\\Longrightarrow\\quad A = 0.5$$

The two methods agree, as they must. The value of running both once is that it
shows where the mysterious factor of $t$ in the resonance rule comes from: it is
produced automatically by the integral $\\int dt$ in variation of parameters
whenever the drive matches a homogeneous solution.

## 11.4 Which method, and when

| Situation | Method |
|---|---|
| constant coefficients, drive is a polynomial, exponential or sinusoid | undetermined coefficients |
| constant coefficients, drive matches a characteristic root | undetermined coefficients with the $t^{m}$ factor |
| any drive at all, homogeneous solutions known | variation of parameters |
| variable coefficients, homogeneous solutions known | variation of parameters |
| variable coefficients, homogeneous solutions unknown | outside the FE syllabus |

Variation of parameters subsumes undetermined coefficients, but it is slower and
its integrals are riskier under time pressure. Reach for it only when the trial
form does not exist.`,
  examTip: 'Compute the Wronskian before anything else in variation of parameters. It is the denominator of both integrals, and for the standard homogeneous pairs it is a constant: 1 for cosine and sine, minus two for the exponentials e^t and e^(-t), and the product of the roots for a general exponential pair.',
  importantNote: 'Any homogeneous piece that falls out of the variation-of-parameters integrals may be discarded, because it is already carried by the arbitrary constants. Keeping it is not wrong, but it makes two correct answers look different, and that is what causes candidates to abandon a right answer on the exam.',
},
{
  id: 'de-ivp-bvp',
  title: '12. Initial Values Against Boundary Values',
  content: `## 12.1 Two ways to pin down the constants

A second-order equation has a two-parameter family of solutions. Two extra
conditions select one of them, and it matters enormously **where** those
conditions are imposed.

An **initial value problem** puts both conditions at the same point, typically
$y(t_{0})$ and $y'(t_{0})$. For a linear equation whose coefficients are
continuous on an interval containing $t_{0}$, exactly one solution exists on
that whole interval. Existence and uniqueness are both guaranteed, which is why
circuit transients are never ambiguous: the state of the storage elements at the
instant of switching is a complete initial condition.

A **boundary value problem** puts one condition at each end of an interval, for
instance $y(0)$ and $y(L)$. No such guarantee exists. The same equation with the
same interval can have exactly one solution, none at all, or an infinite family,
depending only on the numbers in the boundary conditions.

| Feature | Initial value problem | Boundary value problem |
|---|---|---|
| Where conditions sit | one point | two points |
| Existence | guaranteed for linear equations | not guaranteed |
| Uniqueness | guaranteed for linear equations | not guaranteed |
| Typical source | a circuit at the instant of switching | a field or a beam between fixed ends |
| Natural solution route | Laplace transform, marching numerically | eigenvalue expansion, shooting |

### 12.2 Worked example: one equation, three fates

Take $y'' + y = 0$, whose general solution is $y = A\\cos x + B\\sin x$, and
impose $y(0) = 0$ in every case, which forces $A = 0$ and leaves
$y = B\\sin x$.

**Unique.** With $y(\\pi/2) = 1$: $B\\sin(\\pi/2) = B = 1$, so $y = \\sin x$ and
nothing else.

**Infinitely many.** With $y(\\pi) = 0$: $B\\sin\\pi = 0$ holds for every $B$, so
every multiple of $\\sin x$ solves the problem.

**None.** With $y(\\pi) = 1$: the condition reads $B\\sin\\pi = 0 = 1$, which no
choice of $B$ can satisfy.

Three outcomes from one differential equation and one change of a boundary
number. An initial value problem cannot behave this way, and that difference is
the whole content of the topic.

## 12.3 Eigenvalues of a boundary value problem

The infinitely-many case is not a curiosity, it is the mechanism behind modes.
Consider

$$y'' + \\lambda y = 0, \\qquad y(0) = 0, \\qquad y(L) = 0$$

For $\\lambda \\le 0$ the solutions are exponentials or straight lines, and the
two boundary conditions force them to vanish identically. For $\\lambda > 0$
write $\\lambda = k^{2}$; then $y = B\\sin kx$ after the first condition, and the
second requires $\\sin kL = 0$, so $kL$ must be a whole multiple of $\\pi$:

$$\\lambda_{n} = \\left(\\frac{n\\pi}{L}\\right)^{2}, \\qquad y_{n}(x) = \\sin\\frac{n\\pi x}{L}, \\qquad n = 1, 2, 3, \\ldots$$

![The first three shapes that fit between two pinned ends on an interval of length two, with one, two and three half waves and eigenvalues of two point four seven, nine point eight seven and twenty two point two one.](/courses/fe-ee/figures/math4-de-bvp-modes.svg)

For $L = 2$ the first three eigenvalues are

$$\\lambda_{1} = \\left(\\frac{\\pi}{2}\\right)^{2} = 2.4674, \\qquad \\lambda_{2} = \\pi^{2} = 9.8696, \\qquad \\lambda_{3} = \\left(\\frac{3\\pi}{2}\\right)^{2} = 22.207$$

Each is verified by substitution: the second derivative of $\\sin(n\\pi x/2)$ is
$-(n\\pi/2)^{2}$ times the function itself, so the differential equation holds
identically at that and only that $\\lambda$. Any other value of $\\lambda$ leaves
only the trivial solution.

This is the same algebra as the eigenvalue problem in the linear algebra
chapter, with a differential operator in place of a matrix. Standing waves on a
line, resonant modes of a cavity and the natural frequencies of a coupled
network are all this calculation.

### 12.4 Worked example: voltage along a leaky line

A distribution line 10 km long leaks current to earth along its length, so the
steady-state voltage satisfies

$$\\frac{d^{2}V}{dx^{2}} = \\gamma^{2}V, \\qquad \\gamma = 0.2\\ \\mathrm{km}^{-1}$$

with $V(0) = 100\\ \\mathrm{V}$ at the substation and $V(10) = 0$ at a grounded
far end. This is a boundary value problem with conditions 10 km apart. The
general solution is a combination of $e^{\\gamma x}$ and $e^{-\\gamma x}$, but the
boundary conditions are met most directly by the hyperbolic form built to vanish
at $x = 10$:

$$V(x) = 100\\,\\frac{\\sinh\\gamma(10 - x)}{\\sinh 10\\gamma} = 100\\,\\frac{\\sinh(2 - 0.2x)}{\\sinh 2}$$

Check both ends: at $x = 0$ the fraction is $\\sinh 2/\\sinh 2 = 1$, giving 100 V;
at $x = 10$ the numerator is $\\sinh 0 = 0$. At the midpoint,

$$V(5) = 100\\,\\frac{\\sinh 1}{\\sinh 2} = 100 \\times 1.175201/3.626860 = 32.403\\ \\mathrm{V}$$

The midpoint sits far below half the source voltage. The reason falls out of the
double-angle identity $\\sinh 2 = 2\\sinh 1\\cosh 1$, which turns the ratio into
$1/(2\\cosh 1) = 1/(2 \\times 1.543081) = 0.324027$. Leakage bends the profile
downward everywhere, so a linear interpolation between the two ends overstates
the voltage at every interior point. Differentiating the expression twice
numerically reproduces $\\gamma^{2}V$ to six figures, which confirms the solution
rather than just the boundary values.

## 12.5 What to do when the boundary problem will not separate

Two routes survive when a boundary value problem has no tidy closed form. The
**shooting method** converts it into an initial value problem by guessing the
missing initial slope, integrating to the far boundary, and adjusting the guess
until the far condition is met; since the map from guess to endpoint value is
linear for a linear equation, two shots and one interpolation are enough.
**Finite differences** replace the derivatives by difference quotients on a grid
and turn the whole problem into a linear system, which is where the linear
algebra chapter takes over.

For a linear equation the shooting method is exact after two trial integrations,
because if $y_{a}$ and $y_{b}$ are the endpoint values produced by initial
slopes $m_{a}$ and $m_{b}$, the slope that hits a target $y^{*}$ is

$$m^{*} = m_{a} + (m_{b} - m_{a})\\,\\frac{y^{*} - y_{a}}{y_{b} - y_{a}}$$

That is straight-line interpolation, and it is exact here only because
superposition holds. For a nonlinear equation the same procedure becomes an
iteration.`,
  examTip: 'When conditions sit at two different points, check for existence before solving. Apply the first boundary condition to the general solution, then substitute the second: if it produces an impossible statement there is no solution, and if it produces an identity there are infinitely many.',
  importantNote: 'A boundary value problem with homogeneous conditions has non-trivial solutions only at its eigenvalues. Reporting a non-zero solution for some other value of the parameter is the standard error, and it is caught instantly by substituting the claimed solution back into the boundary conditions.',
},
{
  id: 'de-laplace-route',
  title: '13. The Laplace Route, Carried End to End',
  content: `## 13.1 Why the transform is worth the trouble

The Laplace transform

$$F(s) = \\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} f(t)\\,e^{-st}\\,dt$$

turns differentiation into multiplication by $s$, and it does so **while
carrying the initial conditions inside the algebra** rather than as a separate
step at the end. That second property is what makes it the natural tool for a
circuit that is already energised when the switch closes.

$$\\mathcal{L}\\{f'\\} = sF(s) - f(0), \\qquad \\mathcal{L}\\{f''\\} = s^{2}F(s) - s f(0) - f'(0)$$

Both come from one integration by parts applied once or twice. The boundary term
at $t = 0$ is where $f(0)$ enters, and it is the term candidates drop.

| $f(t)$ | $F(s)$ |
|---|---|
| unit step | $1/s$ |
| $t$ | $1/s^{2}$ |
| $e^{-at}$ | $1/(s+a)$ |
| $t\\,e^{-at}$ | $1/(s+a)^{2}$ |
| $\\sin\\omega t$ | $\\omega/(s^{2}+\\omega^{2})$ |
| $\\cos\\omega t$ | $s/(s^{2}+\\omega^{2})$ |
| $e^{-at}\\sin\\omega t$ | $\\omega/[(s+a)^{2}+\\omega^{2}]$ |
| $e^{-at}\\cos\\omega t$ | $(s+a)/[(s+a)^{2}+\\omega^{2}]$ |
| $f'(t)$ | $sF(s) - f(0)$ |
| $f''(t)$ | $s^{2}F(s) - sf(0) - f'(0)$ |
| $\\int_{0}^{t} f(\\tau)\\,d\\tau$ | $F(s)/s$ |

The two shifted rows are worth memorising as a pair: multiplying a time function
by $e^{-at}$ replaces $s$ by $s + a$ everywhere in its transform. That single
rule generates half the table.

### 13.2 Worked example: a first-order circuit with a live initial condition

Solve $y' + 4y = 12$ for $t > 0$ with $y(0) = 5$.

$$sY - 5 + 4Y = \\frac{12}{s} \\quad\\Longrightarrow\\quad (s+4)Y = \\frac{12}{s} + 5 \\quad\\Longrightarrow\\quad Y(s) = \\frac{5s + 12}{s(s+4)}$$

Split by residues. At $s = 0$ the numerator over the surviving factor is
$12/4 = 3$; at $s = -4$ it is $(5(-4) + 12)/(-4) = (-8)/(-4) = 2$:

$$Y(s) = \\frac{3}{s} + \\frac{2}{s+4} \\quad\\Longrightarrow\\quad y(t) = 3 + 2e^{-4t}$$

The answer is the universal first-order form with $y(0) = 5$, $y(\\infty) = 3$
and $\\tau = 0.25\\ \\mathrm{s}$, which is the check. Notice that the initial value
5 entered as a term in the numerator, not as a constant fitted afterwards.

### 13.3 Worked example: a series RLC that was already energised

A 1 H inductor, a 5 ohm resistor and a 1/6 F capacitor sit in series. At
$t = 0$ a 10 V step is applied. At that instant 2 A is already circulating and
the capacitor already holds 3 V.

Kirchhoff's voltage law gives $L\\,i' + R\\,i + v_{C} = 10$. Differentiating once
removes the constant source and the integral:

$$i'' + 5i' + 6i = 0$$

The second initial condition comes from the voltage law evaluated at
$t = 0^{+}$, which is the step most often skipped:

$$L\\,i'(0) = 10 - R\\,i(0) - v_{C}(0) = 10 - 10 - 3 = -3 \\quad\\Longrightarrow\\quad i'(0) = -3\\ \\mathrm{A/s}$$

Transform with both conditions carried:

$$\\left[s^{2}I - 2s + 3\\right] + 5\\left[sI - 2\\right] + 6I = 0 \\quad\\Longrightarrow\\quad (s^{2} + 5s + 6)I = 2s + 7$$

$$I(s) = \\frac{2s + 7}{(s+2)(s+3)} = \\frac{3}{s+2} - \\frac{1}{s+3} \\quad\\Longrightarrow\\quad i(t) = 3e^{-2t} - e^{-3t}$$

The residues came out as $(2(-2)+7)/(-2+3) = 3$ and $(2(-3)+7)/(-3+2) = -1$.
Check the starting values directly: $i(0) = 3 - 1 = 2$ and
$i'(0) = -6 + 3 = -3$, both as required.

### 13.4 Worked example: the same circuit solved for the capacitor voltage

Solving for $v_{C}$ instead keeps the source in the equation. Using
$i = C\\,v_{C}'$ in the voltage law and multiplying through,

$$LC\\,v_{C}'' + RC\\,v_{C}' + v_{C} = 10 \\quad\\Longrightarrow\\quad v_{C}'' + 5v_{C}' + 6v_{C} = 60$$

with $v_{C}(0) = 3$ and $v_{C}'(0) = i(0)/C = 2 \\times 6 = 12$. Transforming,

$$\\left[s^{2}V - 3s - 12\\right] + 5\\left[sV - 3\\right] + 6V = \\frac{60}{s}$$

$$(s^{2} + 5s + 6)V = \\frac{60}{s} + 3s + 27 \\quad\\Longrightarrow\\quad V(s) = \\frac{3(s+4)(s+5)}{s(s+2)(s+3)}$$

Three residues: at $s = 0$, $3(4)(5)/[(2)(3)] = 10$; at $s = -2$,
$3(2)(3)/[(-2)(1)] = -9$; at $s = -3$, $3(1)(2)/[(-3)(-1)] = 2$. So

$$v_{C}(t) = 10 - 9e^{-2t} + 2e^{-3t}$$

![The capacitor voltage and the loop current of an energised series RLC circuit after a ten volt step, plotted as fractions of ten volts and two amps, with open circles marking an independent Runge-Kutta solution of the same equations.](/courses/fe-ee/figures/math4-de-laplace-rlc.svg)

Now the cross-check that makes the pair trustworthy. Differentiate and multiply
by $C = 1/6$:

$$i = C\\,v_{C}' = \\tfrac{1}{6}\\left(18e^{-2t} - 6e^{-3t}\\right) = 3e^{-2t} - e^{-3t}$$

which is precisely the current found by the other route. Two independent
transforms of the same circuit, agreeing exactly, is a stronger statement than
either result alone. Adaptive Runge-Kutta on both original equations agrees with
both to nine figures.

At $t = 0.5\\ \\mathrm{s}$, with $e^{-1} = 0.36787944$ and
$e^{-1.5} = 0.22313016$,

$$i(0.5) = 3 \\times 0.36787944 - 0.22313016 = 0.8805\\ \\mathrm{A}$$
$$v_{C}(0.5) = 10 - 9 \\times 0.36787944 + 2 \\times 0.22313016 = 7.1353\\ \\mathrm{V}$$

## 13.5 Reading the endpoints straight off the transform

Two theorems save the trouble of inverting when only the ends matter:

$$f(0^{+}) = \\lim_{s\\to\\infty} sF(s), \\qquad f(\\infty) = \\lim_{s\\to 0} sF(s)$$

The final value theorem is valid only when the response actually settles, which
means every pole of $sF(s)$ must lie strictly in the left half plane. Applied to
the capacitor voltage above,

$$\\lim_{s\\to\\infty} \\frac{3(s+4)(s+5)}{(s+2)(s+3)} = 3, \\qquad \\lim_{s\\to 0} \\frac{3(s+4)(s+5)}{(s+2)(s+3)} = \\frac{60}{6} = 10$$

which recovers the 3 V initial charge and the 10 V final state without inverting
anything. Applying the final value theorem to a transform with a pole on the
imaginary axis, such as an undamped oscillator, returns a finite number for a
response that never settles, and that is the trap the theorem's condition
exists to catch.`,
  examTip: 'The transform of a second derivative carries TWO initial-condition terms, minus s times y(0) and minus y prime of zero. Write them down before touching the algebra. Dropping them turns an energised circuit into one starting from rest, which produces a plausible-looking answer with the wrong starting value.',
  importantNote: 'The second initial condition for a series RLC current is not given directly; it comes from Kirchhoff\'s voltage law at t = 0 plus, as L di/dt = V_source - R i(0) - v_C(0). Assuming di/dt starts at zero is the single most common error in Laplace circuit problems.',
},
{
  id: 'de-numerical',
  title: '14. Numerical Solutions, and What the Order Number Means',
  content: `## 14.1 Euler, and where the method comes from

Truncate the Taylor expansion of the solution after the linear term:

$$y(t + h) = y(t) + h\\,y'(t) + \\frac{h^{2}}{2}y''(\\xi) \\quad\\Longrightarrow\\quad y_{n+1} = y_{n} + h\\,f(t_{n}, y_{n})$$

The discarded piece is the **local truncation error**, of size $O(h^{2})$. But
reaching a fixed time $T$ takes $n = T/h$ steps, and the errors accumulate, so
the **global error** is $n$ times the local one:

$$\\text{global error} \\sim \\frac{T}{h}\\times O(h^{2}) = O(h)$$

That single line is why Euler is called a first-order method even though its
per-step error goes as $h^{2}$. The same argument applies to every method on the
syllabus: global order is always one less than local order.

## 14.2 Fourth-order Runge-Kutta

RK4 evaluates the slope four times per step and combines them with the weights
of Simpson's rule:

$$k_{1} = f(t_{n}, y_{n}), \\qquad k_{2} = f\\!\\left(t_{n} + \\tfrac{h}{2},\\ y_{n} + \\tfrac{h}{2}k_{1}\\right)$$
$$k_{3} = f\\!\\left(t_{n} + \\tfrac{h}{2},\\ y_{n} + \\tfrac{h}{2}k_{2}\\right), \\qquad k_{4} = f(t_{n} + h,\\ y_{n} + h k_{3})$$
$$y_{n+1} = y_{n} + \\frac{h}{6}\\left(k_{1} + 2k_{2} + 2k_{3} + k_{4}\\right)$$

The local error is $O(h^{5})$ and the global error $O(h^{4})$. Four function
evaluations per step buy three extra orders, which is why RK4 rather than Euler
is what every solver actually runs.

### 14.3 Worked example: measuring the order against an exact solution

Take a test problem whose answer is known in closed form:

$$y' = y - t^{2} + 1, \\qquad y(0) = 0.5, \\qquad y(t) = (t+1)^{2} - \\tfrac{1}{2}e^{t}$$

Verify the closed form by substitution: $y' = 2(t+1) - \\tfrac{1}{2}e^{t}$, while
$y - t^{2} + 1 = t^{2} + 2t + 1 - \\tfrac{1}{2}e^{t} - t^{2} + 1$, and the two
agree. At $t = 0$ it gives $1 - 0.5 = 0.5$ as required. The exact value at
$t = 2$ is

$$y(2) = 9 - \\tfrac{1}{2}e^{2} = 9 - 3.694528 = 5.305472$$

Marching both methods from 0 to 2 and comparing at the end gives:

| $h$ | Euler error | ratio | RK4 error | ratio |
|---|---|---|---|---|
| 0.2 | $4.397\\times 10^{-1}$ | — | $1.089\\times 10^{-4}$ | — |
| 0.1 | $2.420\\times 10^{-1}$ | 1.82 | $6.990\\times 10^{-6}$ | 15.59 |
| 0.05 | $1.275\\times 10^{-1}$ | 1.90 | $4.421\\times 10^{-7}$ | 15.81 |
| 0.025 | $6.550\\times 10^{-2}$ | 1.95 | $2.779\\times 10^{-8}$ | 15.91 |
| 0.0125 | $3.321\\times 10^{-2}$ | 1.97 | $1.742\\times 10^{-9}$ | 15.96 |

Each ratio is the previous error divided by the current one, so it says what
halving the step buys. Euler's column climbs toward 2 and RK4's toward 16, which
are $2^{1}$ and $2^{4}$: the order numbers, measured rather than asserted.

![Global error at t equals two plotted against step size on logarithmic axes for Euler and fourth-order Runge-Kutta, with dashed reference lines of slope one and slope four that the two data sets follow.](/courses/fe-ee/figures/math4-de-numerical-order.svg)

On log axes a power law is a straight line whose slope is the exponent. Fitting
the clean part of each sweep returns 0.99 for Euler and 3.99 for RK4. The
fitting stops before the finest RK4 steps, where the error has fallen to
$10^{-12}$ and is dominated by floating-point rounding rather than by
truncation; past that point the slope means nothing, and reporting it would be
reading noise.

### 14.4 Worked example: Euler by hand, and the order confirmed twice

For $y' = -2y$ with $y(0) = 1$, Euler multiplies by the same factor every step:

$$y_{n+1} = y_{n} + h(-2y_{n}) = (1 - 2h)\\,y_{n}$$

With $h = 0.1$ the factor is 0.8, so after five steps $y(0.5) = 0.8^{5} = 0.32768$
against the exact $e^{-1} = 0.3678794$, an error of 0.0401994. Halve the step:
with $h = 0.05$ the factor is 0.9 and ten steps give
$0.9^{10} = 0.3486784$, an error of 0.0192010. The ratio is

$$\\frac{0.0401994}{0.0192010} = 2.0936$$

close to the 2 that first order predicts, and closing on it as $h$ shrinks. Both
Euler results sit **below** the true value, which is not an accident: this
solution is convex, so every tangent-line step undershoots.

## 14.5 Stability, which is not accuracy

Apply Euler to $y' = \\lambda y$ with $\\lambda$ real and negative. The numerical
solution is $(1 + \\lambda h)^{n}$, and it decays only when

$$\\lvert 1 + \\lambda h\\rvert < 1 \\quad\\Longrightarrow\\quad 0 < h < \\frac{2}{\\lvert\\lambda\\rvert}$$

Outside that window the method does not merely lose accuracy, it produces a
growing oscillation for a decaying problem. With $\\lambda = -2$ the limit is
$h = 1$. Take $h = 1.1$: the factor is $1 + (-2)(1.1) = -1.2$, so five steps give
$(-1.2)^{5} = -2.48832$ while the true value is $e^{-5.5} = 0.0040868$. The sign
alternates and the magnitude doubles every couple of steps.

A stiff system, one whose fastest mode decays far quicker than the answer you
care about, forces $h$ down to the fastest time constant purely for stability
even when accuracy would allow a step a thousand times larger. That is the
practical reason implicit methods exist.

| Property | Euler | RK4 |
|---|---|---|
| Slope evaluations per step | 1 | 4 |
| Local truncation error | $O(h^{2})$ | $O(h^{5})$ |
| Global error | $O(h)$ | $O(h^{4})$ |
| Halving $h$ divides the error by | 2 | 16 |
| Stability limit on $y' = \\lambda y$ | $h < 2/\\lvert\\lambda\\rvert$ | $h < 2.785/\\lvert\\lambda\\rvert$ |

The last row is the reason RK4 wins twice: it is more accurate at a given step
and it tolerates a larger step before going unstable.`,
  examTip: 'Global order is one less than local order, because the number of steps grows as one over h. Euler is local h squared and global h; RK4 is local h to the fifth and global h to the fourth. A question that halves the step and asks for the new error is testing exactly this: divide by 2 for Euler, by 16 for RK4.',
  importantNote: 'Stability and accuracy are different failures. A step size inside the stability window can still be far too coarse to be accurate, and a step outside it produces a growing oscillation that no amount of extra precision repairs. Check the stability bound h < 2/|lambda| before judging a numerical result.',
},
{
  id: 'de-set-b',
  title: '15. Problem Set: Classification and First-Order Equations',
  content: `## 15.1 Problem Set A

Work each one before reading the solution. Every answer names the distractor it
is competing against and the number that distractor produces.

**A1.** Solve $4y' + 8y = 0$ with $y(0) = 6$, and give $y(0.5)$.

Convert to standard form first by dividing through by 4: $y' + 2y = 0$. The
solution is $y = 6e^{-2t}$, so

$$y(0.5) = 6e^{-1} = 6 \\times 0.3678794 = 2.2073$$

**Trap.** Reading the coefficient 8 straight off the unconverted equation gives
$y = 6e^{-8t}$ and $y(0.5) = 6 \\times 0.0183156 = 0.1099$, twenty times too
small. Always divide by the coefficient of the highest derivative before
identifying anything.

**A2.** A 0.4 H inductor in series with 20 ohms is switched onto 24 V at
$t = 0$ from zero current. Find the current at 30 ms.

$$\\tau = \\frac{L}{R} = \\frac{0.4}{20} = 0.02\\ \\mathrm{s}, \\qquad i(\\infty) = \\frac{24}{20} = 1.2\\ \\mathrm{A}$$

$$i(t) = 1.2\\left(1 - e^{-t/0.02}\\right), \\qquad i(0.03) = 1.2\\left(1 - 0.2231302\\right) = 1.2 \\times 0.7768698 = 0.93224\\ \\mathrm{A}$$

**Trap.** Inverting the time constant to $R/L = 50\\ \\mathrm{s}$ gives
$i = 1.2(1 - e^{-0.0006}) = 0.00072\\ \\mathrm{A}$, an answer three orders of
magnitude out. The inductor's time constant is $L/R$; only the capacitor's is a
product.

**A3.** Solve $dy/dx = x/y$ with $y(0) = 3$, and give $y(4)$.

Separate and integrate: $y\\,dy = x\\,dx$ gives
$y^{2}/2 = x^{2}/2 + C$, so $y^{2} = x^{2} + 9$ after fitting the initial
condition. Then

$$y(4) = \\sqrt{16 + 9} = \\sqrt{25} = 5$$

**Trap.** Treating the relationship as linear and writing $y = x + 3$ returns 7.
Separation produces a relation between the **squares**, and squares only add in
quadrature.

**A4.** Solve $y' + (2/x)y = x^{2}$ with $y(1) = 0$, and give $y(2)$.

The integrating factor is $\\mu = e^{2\\ln x} = x^{2}$, so
$(x^{2}y)' = x^{4}$ and $x^{2}y = x^{5}/5 + C$:

$$y = \\frac{x^{3}}{5} + \\frac{C}{x^{2}}, \\qquad y(1) = 0 \\Rightarrow C = -\\tfrac{1}{5}$$

$$y(2) = \\frac{8}{5} - \\frac{1}{20} = 1.6 - 0.05 = 1.55$$

**Trap.** Dropping the homogeneous term $C/x^{2}$ because the initial value is
zero gives 1.60. An initial value of zero does not make the constant zero; it
makes it whatever cancels the particular part at that point.

**A5.** Is $(3x^{2}y + 2)\\,dx + (x^{3} + 4y)\\,dy = 0$ exact, and what is the
solution through $(1, 1)$?

$$\\frac{\\partial M}{\\partial y} = 3x^{2} = \\frac{\\partial N}{\\partial x}$$

so it is exact. Integrating $M$ in $x$ gives $F = x^{3}y + 2x + g(y)$, and
matching $\\partial F/\\partial y = x^{3} + g'(y)$ against $N$ gives
$g' = 4y$, hence $g = 2y^{2}$:

$$x^{3}y + 2x + 2y^{2} = C, \\qquad C = 1 + 2 + 2 = 5$$

**Trap.** Carrying $4y^{2}$ instead of $2y^{2}$, by copying $N$ rather than
integrating it, gives $C = 7$. The potential function is the **integral** of the
components, never a copy of them.

## 15.2 Practice Problems: choosing the method without solving

For each equation, name the first method to try, in one word.

$$\\text{(i)}\\quad y' = 3ty^{2} \\qquad \\text{(ii)}\\quad y' + y\\tan t = \\sec t \\qquad \\text{(iii)}\\quad (2y - x)\\,dx + (2x + 3y)\\,dy = 0$$

**(i)** Separable. The right side factors as $3t$ times $y^{2}$, so
$\\int y^{-2}dy = \\int 3t\\,dt$ finishes it. Nonlinearity is no obstacle here,
which is why separability is the first test.

**(ii)** Linear. It already sits in standard form with $p = \\tan t$, so
$\\mu = e^{\\int\\tan t\\,dt} = \\sec t$ and $(\\,y\\sec t)' = \\sec^{2}t$, giving
$y\\sec t = \\tan t + C$ and $y = \\sin t + C\\cos t$.

**(iii)** Exact. Here $\\partial M/\\partial y = 2$ and
$\\partial N/\\partial x = 2$ agree, so $F = 2xy - x^{2}/2 + 3y^{2}/2 = C$.
Checking exactness costs two derivatives and saves the wasted effort of hunting
for a separation that does not exist.`,
},
{
  id: 'de-set-c',
  title: '16. Problem Set: Second Order, Resonance and Laplace',
  content: `## 16.1 Problem Set B

**B1.** A series RLC has $R = 40\\ \\Omega$, $L = 0.5\\ \\mathrm{H}$ and
$C = 20\\ \\mu\\mathrm{F}$. Classify it and give the ringing frequency.

$$\\alpha = \\frac{R}{2L} = \\frac{40}{1} = 40\\ \\mathrm{s}^{-1}, \\qquad \\omega_{0} = \\frac{1}{\\sqrt{0.5 \\times 20\\times 10^{-6}}} = \\frac{1}{\\sqrt{10^{-5}}} = 316.23\\ \\mathrm{rad/s}$$

Since $\\alpha \\ll \\omega_{0}$ the circuit is lightly **underdamped**, with

$$\\omega_{d} = \\sqrt{\\omega_{0}^{2} - \\alpha^{2}} = \\sqrt{100000 - 1600} = \\sqrt{98400} = 313.69\\ \\mathrm{rad/s}$$

and a damping ratio $\\zeta = 40/316.23 = 0.1265$.

**Trap.** Using $\\alpha = R/L = 80$ instead of $R/2L$ still gives
"underdamped" but reports $\\omega_{d} = \\sqrt{93600} = 305.94$, and the damping
ratio doubles to 0.253. The factor of two in $\\alpha = R/2L$ is not optional.

**B2.** Solve $y'' + 4y' + 3y = 0$ with $y(0) = 4$ and $y'(0) = 0$, and give
$y(1)$.

The characteristic equation $s^{2} + 4s + 3 = 0$ factors to $(s+1)(s+3)$, so
$y = Ae^{-t} + Be^{-3t}$. The conditions give $A + B = 4$ and $-A - 3B = 0$,
so $A = -3B$ and $-2B = 4$, hence $B = -2$ and $A = 6$:

$$y(t) = 6e^{-t} - 2e^{-3t}, \\qquad y(1) = 6 \\times 0.3678794 - 2 \\times 0.0497871 = 2.1077$$

**Trap.** Attaching the constants to the wrong roots gives
$6e^{-3t} - 2e^{-t}$, whose value at $t = 1$ is $-0.4370$: negative, whereas the
true response never crosses zero. Check $y(0)$ and $y'(0)$ against the finished
expression every time; here $6 - 2 = 4$ and $-6 + 6 = 0$ both hold.

**B3.** Solve $y'' + 3y' = 6$ from rest, and give $y(1)$.

The characteristic roots are 0 and $-3$. A constant trial solution is
annihilated by the left side, because a constant is exactly the homogeneous
solution belonging to the root at zero. Multiply by $t$: with $y_{p} = At$,
$y_{p}'' + 3y_{p}' = 3A = 6$, so $A = 2$ and $y_{p} = 2t$. Adding the
homogeneous part,

$$y = 2t + C_{1} + C_{2}e^{-3t}, \\qquad y(0) = 0,\\ y'(0) = 0 \\Rightarrow C_{2} = \\tfrac{2}{3},\\ C_{1} = -\\tfrac{2}{3}$$

$$y(1) = 2 - \\tfrac{2}{3} + \\tfrac{2}{3}e^{-3} = 2 - 0.6666667 + 0.0331914 = 1.3665$$

**Trap.** Taking $y_{p} = 6/3 = 2$ by analogy with $y'' + 3y' + ky = 6$ misses
that the constant term is absent, so there is no $k$ to divide by. That route
reports $y(1) \\approx 2.0$ and, worse, gives a response that settles instead of
ramping. A missing $y$ term always means a root at the origin.

**B4.** Solve $y'' + 4y = 8$ with $y(0) = 0$ and $y'(0) = 2$ by Laplace, and
give $y(0.5)$.

$$s^{2}Y - 2 + 4Y = \\frac{8}{s} \\quad\\Longrightarrow\\quad Y(s) = \\frac{8}{s(s^{2}+4)} + \\frac{2}{s^{2}+4}$$

The first term splits as $2/s - 2s/(s^{2}+4)$, which recombines correctly
because $2(s^{2}+4) - 2s^{2} = 8$. Inverting term by term,

$$y(t) = 2 - 2\\cos 2t + \\sin 2t$$

$$y(0.5) = 2 - 2\\cos 1 + \\sin 1 = 2 - 1.0806046 + 0.8414710 = 1.7609$$

**Trap.** Forgetting the $-y'(0)$ term in the transform of $y''$ deletes the
$2/(s^{2}+4)$ piece and gives $y = 2 - 2\\cos 2t$, worth 0.9194 at
$t = 0.5$. The response would then start with zero slope, contradicting the
stated initial condition.

**B5.** Which drive makes $y'' + 9y = 6\\cos\\omega t$ grow without bound,
$\\omega = 3$ or $\\omega = 9$?

The natural frequency is $\\omega_{0} = \\sqrt{9} = 3$, so $\\omega = 3$ resonates.
Its particular solution needs the extra factor of $t$: with
$y_{p} = t(A\\cos 3t + B\\sin 3t)$ the second derivative contributes
$-6A\\sin 3t + 6B\\cos 3t$, so $A = 0$ and $B = 1$, giving $y = t\\sin 3t$ from
rest. At $t = 10$ the envelope has reached 10 and is still climbing.

**Trap.** Choosing $\\omega = 9$ because 9 appears in the equation. At 9 rad/s
the ordinary trial form works, with amplitude $6/(9 - 81) = -0.0833$: not only
bounded, but the smallest response of the two by a wide margin. The 9 in the
equation is $\\omega_{0}^{2}$, not $\\omega_{0}$.`,
},
{
  id: 'de-set-d',
  title: '17. Problem Set: Boundary Values and Numerical Marching',
  content: `## 17.1 Problem Set C

**C1.** For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y(3) = 0$, what is the
smallest $\\lambda$ admitting a solution other than $y = 0$?

With $\\lambda = k^{2} > 0$ the first condition leaves $y = B\\sin kx$ and the
second requires $\\sin 3k = 0$, so $3k = n\\pi$. The smallest positive case is
$n = 1$:

$$\\lambda_{1} = \\left(\\frac{\\pi}{3}\\right)^{2} = 1.0472^{2} = 1.0966$$

**Trap.** Answering $\\lambda = 0$. That value does satisfy the differential
equation, but $y'' = 0$ makes $y$ a straight line, and a straight line pinned to
zero at both ends is identically zero. Zero is not an eigenvalue here because it
admits no non-trivial solution.

**C2.** Does $y'' + 4y = 0$ with $y(0) = 0$ and $y(\\pi/2) = 1$ have a solution?

The general solution is $y = A\\cos 2x + B\\sin 2x$; the first condition kills
$A$. The second then reads

$$B\\sin\\pi = 0 = 1$$

which is impossible, so **no solution exists**. The boundary points are exactly
half a period of $\\sin 2x$ apart, and every candidate solution is forced back to
zero at the far end.

**Trap.** Writing $B = 1/\\sin\\pi$ and calling it undefined but large. Division
by zero here is not a large number, it is a contradiction, and the correct
answer is that the problem has no solution at all.

**C3.** Use Euler with $h = 0.2$ on $y' = t + y$, $y(0) = 1$, to estimate
$y(0.4)$, and compare with the exact value.

$$y_{1} = 1 + 0.2(0 + 1) = 1.2, \\qquad y_{2} = 1.2 + 0.2(0.2 + 1.2) = 1.2 + 0.28 = 1.48$$

The exact solution comes from the integrating factor $e^{-t}$, giving
$y = 2e^{t} - t - 1$, so

$$y(0.4) = 2 \\times 1.4918247 - 1.4 = 1.58365$$

Euler is low by 0.1036, about 6.5 per cent, which is what a step of 0.2 buys
from a first-order method.

**Trap.** Evaluating the slope at the far end of the interval,
$f(t_{n+1}, y_{n})$, instead of the near end. That produces
$y_{1} = 1 + 0.2(0.2 + 1) = 1.24$ and a different sequence entirely. Euler uses
the slope at the point it is standing on.

**C4.** An Euler solution has a global error of 0.08 at $h = 0.05$. Estimate the
error at $h = 0.0125$.

Euler is globally first order, so the error scales in direct proportion to $h$.
The step has been cut by a factor of four:

$$0.08 \\times \\frac{0.0125}{0.05} = 0.08 \\times 0.25 = 0.02$$

**Trap.** Applying the fourth-order rule and dividing by $4^{4} = 256$ gives
0.0003125, more than sixty times too optimistic. Confirm which method produced
the error before scaling it; the order number is a property of the method, not
of the problem.

**C5.** What is the largest step size for which Euler remains stable on
$y' = -50y$?

$$\\lvert 1 + \\lambda h\\rvert < 1 \\quad\\Longrightarrow\\quad h < \\frac{2}{50} = 0.04$$

Any larger step makes the amplification factor exceed one in magnitude and the
computed solution grows while the true one decays.

**Trap.** Answering 0.02, the time constant $1/50$. That step is comfortably
stable and is a sensible engineering choice for accuracy, but it is not the
limit; the limit is twice it. Confusing the time constant with the stability
bound understates the usable step by a factor of two.

## 17.2 Practice Problems: reading a response and naming its equation

A measured step response overshoots to 1.16 times its final value, rings four
more times with each peak 53 per cent of the one before, and the peaks are
7.0 ms apart. Name the damping regime and estimate $\\zeta$, $\\omega_{d}$ and
$\\omega_{0}$.

Overshoot at all means complex roots, so the response is **underdamped**. From
the peak ratio,

$$\\delta = \\ln\\frac{1}{0.53} = 0.6349 = \\alpha T_{d} \\quad\\Longrightarrow\\quad \\alpha = \\frac{0.6349}{0.007} = 90.7\\ \\mathrm{s}^{-1}$$

$$\\omega_{d} = \\frac{2\\pi}{0.007} = 897.6\\ \\mathrm{rad/s}, \\qquad \\omega_{0} = \\sqrt{90.7^{2} + 897.6^{2}} = 902.2\\ \\mathrm{rad/s}$$

$$\\zeta = \\frac{\\alpha}{\\omega_{0}} = \\frac{90.7}{902.2} = 0.1005$$

The overshoot gives an independent estimate:
$\\exp(-\\pi\\zeta/\\sqrt{1-\\zeta^{2}})$ at $\\zeta = 0.1005$ is 0.7275, so the
first peak should reach 1.73 times the final value. The stated 1.16 corresponds
instead to $\\zeta = 0.5$, so the two measurements are inconsistent and one of
them has been misread. Noticing that is the point of the exercise: a lightly
damped system that rings five times cannot also overshoot by only 16 per cent,
and any answer combining the two is describing no real circuit.`,
},
],
  keyTakeaways: [
    'Time constant τ: 63.2% change at t = τ; 99.3% at t = 5τ.',
    'Damping ratio ζ determines response: underdamped (ζ<1), critically damped (ζ=1), overdamped (ζ>1).',
    'Series RLC: ωₙ = 1/sqrt(LC), ζ = R/(2sqrt(L/C)).',
    'Laplace transform converts ODEs to algebraic equations in s-domain.',
  ],
},

fee_linear_algebra: {
  topicId: 'fee_linear_algebra',
  title: 'Linear Algebra & Matrix Operations',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Linear algebra provides tools for solving systems of equations arising from nodal and mesh analysis. Matrix operations, determinants, eigenvalues, and Cramer\'s rule are essential for multi-node circuit problems.',
  sections: [
    {
      id: 'la-matrices',
      title: '1. Matrix Operations and Determinants',
      content: `## 1.1 Matrix Arithmetic

A system **$Ax = b$** represents n equations in n unknowns:

- **Addition**: element-wise (matrices must be same size)
- **Scalar multiplication**: multiply every element
- **Matrix multiplication**: (AB)ᵢⱼ = Σₖ Aᵢₖ·Bₖⱼ (row-by-column)
- **NOT commutative**: AB ≠ BA in general
- **Associative**: (AB)C = A(BC)

### Determinants

For a **2×2 matrix**: det([a b; c d]) = **ad - bc**

For a **3×3 matrix**: expand along any row or column using cofactors.

A matrix is **invertible** if and only if det(A) ≠ 0.

### Matrix Inverse (2×2)

**$[a b; c d]^{-1} = (1/(ad-bc)) \\cdot [d -b; -c a]$**

## 1.2 Solving Linear Systems

### Cramer's Rule
For Ax = b, each unknown xᵢ = det(Aᵢ)/det(A), where Aᵢ replaces column i with b.

### Gaussian Elimination
Reduce to row echelon form using elementary row operations. Faster than Cramer's for large systems.

| Method | Best For | Complexity |
|---|---|---|
| Cramer's rule | 2×2 or 3×3 systems | $O(n! \\cdot n)$ |
| Gaussian elimination | Any size | $O(n^{3})$ |
| Matrix inverse | Multiple right-hand sides | O(n³) setup |`,
      examTip: 'For 2×2 systems, Cramer\'s rule is fastest on the FE exam. For 3×3, Gaussian elimination is usually faster. Always check that det(A) ≠ 0 before applying Cramer\'s — if det = 0, the system has no unique solution.',
    },
    {
      id: 'la-eigenvalues',
      title: '2. Eigenvalues and Stability',
      content: `## 2.1 Eigenvalue Problem

The eigenvalue equation: **$Ax = \\lambda x$**

Where λ is the **eigenvalue** and x is the **eigenvector**.

To find eigenvalues, solve: **$\\det (A - \\lambda I) = 0$** (the characteristic equation)

For a 2×2 matrix [a b; c d]:
- **Characteristic equation**: λ² - (a+d)λ + (ad-bc) = 0
- **Sum of eigenvalues** = trace = a + d
- **Product of eigenvalues** = determinant = ad - bc

## 2.2 Eigenvalues and System Stability

Eigenvalues determine system behavior in control systems and circuit transients:

| Eigenvalue Location | System Behavior |
|---|---|
| All eigenvalues have Re(λ) < 0 | **Stable** — all modes decay |
| Any eigenvalue has Re(λ) > 0 | **Unstable** — at least one mode grows |
| Eigenvalue has Re(λ) = 0 | **Marginally stable** — sustained oscillation |

### Connection to Transfer Functions

The eigenvalues of the system matrix A are the **poles** of the transfer function H(s). Stability requires all poles (eigenvalues) in the left half of the s-plane.`,
      examTip: 'The characteristic equation det(A - λI) = 0 gives eigenvalues. For the FE exam, you mostly need 2×2 eigenvalues: solve the quadratic λ² - trace·λ + det = 0. The key insight: eigenvalues with negative real parts mean stability.',
      importantNote: 'Eigenvalues of the system state matrix are identical to the poles of the transfer function. This connection between linear algebra and control theory is fundamental — know it for the FE exam.',
    },
    {
      id: 'la-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Cramer's rule on a two-mesh circuit

Mesh analysis gives 5i1 - 2i2 = 10 and -2i1 + 6i2 = 4.

Coefficient determinant: det(A) = (5)(6) - (-2)(-2) = 30 - 4 = **26**.

Replace column 1 with the right-hand side: det(A1) = (10)(6) - (4)(-2) = 60 + 8 = 68, so **$i_{1} = 68/26 = 2.6154\\ \\mathrm{A}$**.

Replace column 2: det(A2) = (5)(4) - (-2)(10) = 20 + 20 = 40, so **$i_{2} = 40/26 = 1.5385\\ \\mathrm{A}$**.

Substitute back into the first mesh equation: 5(2.6154) - 2(1.5385) = 13.077 - 3.077 = 10.000. Correct.

For a 2x2 system Cramer's rule is the fastest route on this exam, because it needs no bookkeeping at all. At 3x3 it is already behind elimination on operation count, and beyond 3x3 the factorial growth of the cofactor determinants makes it hopeless.

## 3.2 Matrix inverse, and when det = 0 matters

For [[4, 2],[3, 1]]: det = (4)(1) - (2)(3) = 4 - 6 = **-2**, nonzero, so the inverse exists:

A inverse = (1/-2)[[1, -2],[-3, 4]] = [[-0.5, 1],[1.5, -2]]

If the determinant had been zero the system would be singular - meaning either no solution or infinitely many. In circuit terms a singular coefficient matrix usually signals a modelling error: a floating node with no reference, or two ideal voltage sources fighting in parallel.

## 3.3 Eigenvalues and stability

For A = [[-2, 1],[0, -3]], the characteristic equation is det(A - lambda I) = 0:

(-2 - lambda)(-3 - lambda) - 0 = 0, so lambda = **-2 and -3**.

Both have negative real parts, so both natural modes decay and the system is **stable**.

Two shortcuts that let you check without expanding:
- **Sum of eigenvalues = trace** = -2 + (-3) = -5, and indeed -2 - 3 = -5.
- **Product of eigenvalues = determinant** = 6, and (-2)(-3) = 6.

Use them as a check on every eigenvalue answer; they catch sign errors instantly.

## 3.4 Eigenvalues as transfer-function poles

For a state-space system dx/dt = Ax + Bu, the eigenvalues of A are exactly the **poles of the transfer function H(s)**. Stability therefore requires every eigenvalue in the left half plane, which is the same condition Routh-Hurwitz tests on the characteristic polynomial.

Worked: A = [[0, 1],[-6, -5]]. Characteristic equation: lambda^2 - (trace)lambda + det = lambda^2 + 5 lambda + 6 = 0, giving lambda = **-2, -3**. Same poles as a transfer function with denominator s^2 + 5s + 6 - because they are the same system written two ways.`,
      examTip: 'For a 2x2 matrix write the characteristic equation straight from trace and determinant: lambda^2 - (trace)lambda + det = 0. It is faster than expanding det(A - lambda I) and gives you a built-in check on the answer.',
      quiz: [
        {
          question: 'What is the determinant of [[3, 5],[2, 4]]?',
          options: ['2', '22', '-2', '12'],
          correctIndex: 0,
          explanation: 'det = ad - bc = (3)(4) - (5)(2) = 12 - 10 = 2. Adding the products instead of subtracting gives 22. A nonzero determinant means the matrix is invertible and the system has a unique solution.',
        },
        {
          question: 'A 2x2 system matrix has trace = -7 and determinant = 12. What are its eigenvalues?',
          options: ['-3 and -4', '3 and 4', '-7 and 12', '-1 and -12'],
          correctIndex: 0,
          explanation: 'The characteristic equation is lambda^2 - (trace)lambda + det = lambda^2 + 7 lambda + 12 = 0, factoring to (lambda+3)(lambda+4). Check: the eigenvalues sum to -7 and multiply to 12. Both negative, so the system is stable.',
        },
        {
          question: 'A state matrix A has eigenvalues -1 and +2. What can you conclude about the system?',
          options: [
            'Unstable - one mode grows without bound',
            'Stable - the average of the eigenvalues is positive',
            'Marginally stable - the eigenvalues have opposite signs',
            'Nothing without the input matrix B',
          ],
          correctIndex: 0,
          explanation: 'Stability requires EVERY eigenvalue to have a negative real part. A single eigenvalue at +2 gives a mode growing as e^(2t), which dominates everything else. Averaging eigenvalues is meaningless, and B affects controllability, not stability.',
        },
      ],
    },
  {
    id: 'la-depth',
    title: '4. What a Matrix Does, and What Eigenvalues Report',
    content: `## 4.1 A matrix is an operation, not a table
  
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
  
  **$\\det (A - \\lambda I) = 0$**
  
  For A = [[2, 1], [1, 2]]:
  
  $$\\det ([[2-\\lambda, 1], [1, 2-\\lambda]]) = (2-\\lambda)^{2} - 1 = \\lambda ^{2} - 4\\lambda + 3 = 0$$
  
  giving λ = **3 and 1**, exactly the factors in the figure.
  
  Two checks come free and cost no work:
  
  | Check | Statement | Here |
  |---|---|---|
  | Trace | sum of eigenvalues = sum of diagonal | 3 + 1 = 4 = 2 + 2 ✓ |
  | Determinant | product of eigenvalues = det A | 3 × 1 = 3 = 4 − 1 ✓ |
  
  **Use both, every time.** They take five seconds and catch nearly every sign
  error in the characteristic polynomial. If your eigenvalues do not sum to the
  trace, you do not need to look for the mistake — you already know there is one.
  
  To get an eigenvector, substitute a λ back. For λ = 3: (2−3)$v_{1}$ + $v_{2}$ = 0, so
  $v_{2}$ = $v_{1}$ and the eigenvector is any multiple of **[1, 1]**. For λ = 1:
  (2−1)$v_{1}$ + $v_{2}$ = 0, so $v_{2}$ = −$v_{1}$ and the eigenvector is any multiple of **$[1, -1]$**.
  Eigenvectors are directions, so any non-zero scaling is equally correct — an
  answer choice differing from yours by a factor is not necessarily wrong.
  
  ## 4.3 Determinants, and what they mean
  
  | Size | Method |
  |---|---|
  | $2\\times 2$ | $ad - bc$ |
  | $3\\times 3$ | expansion along any row or column with alternating signs |
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
  
  $$x_{i} = \\det (A_{i})/\\det (A)$$
  
  where Aᵢ is A with column i replaced by **b**.
  
  **Worked, from a mesh problem.** Two mesh equations:
  
  $$3I_{1} - I_{2} = 10$$
  $$-I_{1} + 2I_{2} = 4$$
  
  $$\\det (A) = (3)(2) - (-1)(-1) = 6 - 1 = 5$$
  
  $$\\det (A_{1}) = \\det ([[10, -1], [4, 2]]) = 20 + 4 = 24 \\to I_{1} = 24/5 = 4.8\\ \\mathrm{A}$$
  $$\\det (A_{2}) = \\det ([[3, 10], [-1, 4]]) = 12 + 10 = 22 \\to I_{2} = 22/5 = 4.4\\ \\mathrm{A}$$
  
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
  | Inverse | $A^{-1}A = I$ | exists only if det A ≠ 0 |
  
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
  one technique covers both.`,
    examTip: 'Always check eigenvalues against the trace and the determinant: they must sum to the trace and multiply to the determinant. Five seconds of checking catches almost every sign error in the characteristic polynomial, and you get both checks without extra work.',
    importantNote: 'Matrix multiplication is not commutative, and both the inverse and the transpose of a product reverse the order: (AB) inverse = B inverse times A inverse. The un-reversed version is the standard distractor on this question type.',
  },
{
  id: 'la-set',
  title: '5. Problem Set: Systems and Spectra',
  content: `## 5.1 A 3×3 determinant

Find det of [[2, 0, 1], [3, −1, 2], [1, 4, 0]].

Expanding along the first row, with the alternating sign pattern + − +:

$$2\\cdot \\det ([[-1,2],[4,0]]) - 0\\cdot \\det (...) + 1\\cdot \\det ([[3,-1],[1,4]])$$
$$= 2(0 - 8) - 0 + 1(12 + 1)$$
$$= -16 + 13 = -3$$

Expanding along the second row (which contains a zero) would have been quicker.
**Choose the row or column with the most zeros** — the answer is the same and
the arithmetic is shorter.

## 5.2 Eigenvalues of a non-symmetric matrix

$$A = [[4, 1], [2, 3]]$$.

Characteristic equation: (4−λ)(3−λ) − 2 = λ² − 7λ + 10 = 0, so λ = **5 and 2**.

Checks: trace = 4 + 3 = 7 = 5 + 2 ✓, and det = 12 − 2 = 10 = 5 × 2 ✓.

Eigenvector for λ = 5: (4−5)$v_{1}$ + $v_{2}$ = 0 gives $v_{2}$ = $v_{1}$, so **[1, 1]**.
Eigenvector for λ = 2: (4−2)$v_{1}$ + $v_{2}$ = 0 gives $v_{2}$ = −2v₁, so **$[1, -2]$**.

## 5.3 A singular system, and what it means

Solve 2x + 4y = 10 and 3x + 6y = 15.

det = (2)(6) − (4)(3) = 12 − 12 = **0**, so Cramer's rule fails. The second
equation is 1.5 times the first, so they carry the same information: there are
infinitely many solutions along the line x + 2y = 5.

In a mesh or nodal context a zero determinant is a modelling error, not an
arithmetic one — typically a dependent loop equation or a network with no
reference node.

## 5.4 Three equations by Cramer

$$x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2$$.

$$\\det (A) = 1(1-2) - 1(-2-1) + 1(4+1) = -1 + 3 + 5 = 7$$

Replacing the first column with the constants gives det($A_{1}$) = 7, so x = 7/7 =
**1**. Similarly y = **2** and z = **3**.

Check all three originals: 1+2+3 = 6 ✓, 2−2+3 = 3 ✓, 1+4−3 = 2 ✓. For a 3×3
system Cramer's rule needs four determinants, which is about the break-even
point against elimination — beyond 3×3, eliminate.`,
},
{
  id: 'la-arithmetic',
  title: '6. Matrix Arithmetic, and the Operation That Does Not Commute',
  content: `## 6.1 The four operations and their shape rules

Addition and scalar multiplication are element by element and demand identical
dimensions. Multiplication is the interesting one, and its rule is a
consequence of what a matrix *does*: it sends vectors to vectors, so the product
$AB$ means "apply $B$, then apply $A$", and the shapes must chain.

$$(AB)_{ij} = \\sum_{k=1}^{n} A_{ik}B_{kj}, \\qquad (m\\times n)(n\\times p) = (m\\times p)$$

The inner dimensions must agree and they vanish from the result; the outer ones
survive. If $B$ is $3\\times 2$ and $A$ is $2\\times 3$, then $AB$ is
$2\\times 2$ while $BA$ is $3\\times 3$. The two products are not merely
different numbers, they are different sizes, which is the bluntest possible
demonstration that order matters.

| Operation | Rule | Shape requirement |
|---|---|---|
| $A + B$ | element by element | identical dimensions |
| $kA$ | every element times $k$ | none |
| $AB$ | row of $A$ against column of $B$ | columns of $A$ equal rows of $B$ |
| $A^{T}$ | rows become columns | none |
| $A^{-1}$ | the matrix undoing $A$ | square, with $\\lvert A\\rvert \\ne 0$ |

### 6.2 Worked example: two matrices, two products, two answers

Let $A$ shear and $B$ swap the axes:

$$A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}, \\qquad B = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}$$

$$AB = \\begin{bmatrix} 2 & 1 \\\\ 1 & 0 \\end{bmatrix}, \\qquad BA = \\begin{bmatrix} 0 & 1 \\\\ 1 & 2 \\end{bmatrix}$$

Every entry differs. Both have determinant $-1$, so both preserve area, yet they
send the unit square to different parallelograms:

![The unit square transformed by A times B and by B times A. Both images are parallelograms of area one, but one leans to the right along the horizontal axis and the other rises steeply along the vertical axis, so the two products are visibly different transformations.](/courses/fe-ee/figures/math4-la-noncommute.svg)

"Shear then swap" and "swap then shear" are different physical operations, and
matrix multiplication faithfully reports that. The transpose and the inverse
both reverse the order for the same reason:

$$(AB)^{T} = B^{T}A^{T}, \\qquad (AB)^{-1} = B^{-1}A^{-1}$$

Undoing "put on socks, then shoes" means taking off the shoes first. Exam
questions on this identity always offer the un-reversed form as the distractor.

### 6.3 Worked example: non-square products, where even the size disagrees

$$A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\\\ 5 & 6 \\end{bmatrix}\\ (3\\times 2), \\qquad B = \\begin{bmatrix} 7 & 8 & 9 \\\\ 10 & 11 & 12 \\end{bmatrix}\\ (2\\times 3)$$

$$AB = \\begin{bmatrix} 27 & 30 & 33 \\\\ 61 & 68 & 75 \\\\ 95 & 106 & 117 \\end{bmatrix}, \\qquad BA = \\begin{bmatrix} 76 & 100 \\\\ 103 & 136 \\end{bmatrix}$$

The first entry of $AB$ is the first row of $A$ against the first column of $B$:
$1 \\times 7 + 2 \\times 10 = 27$. The first entry of $BA$ is the first row of $B$
against the first column of $A$: $7 \\times 1 + 8 \\times 3 + 9 \\times 5 = 76$.

One check survives the size change. The traces agree:

$$\\operatorname{tr}(AB) = 27 + 68 + 117 = 212, \\qquad \\operatorname{tr}(BA) = 76 + 136 = 212$$

That is not a coincidence; $\\operatorname{tr}(AB) = \\operatorname{tr}(BA)$
holds whenever both products exist, and it is a useful sanity check on any hand
multiplication.

## 6.4 What multiplication does keep

Associativity survives, even though commutativity does not:

$$(AB)C = A(BC)$$

Take $M_{1} = \\begin{bmatrix} 2 & 1 \\\\ 0 & 3\\end{bmatrix}$,
$M_{2} = \\begin{bmatrix} 1 & 4 \\\\ 2 & 0\\end{bmatrix}$ and
$M_{3} = \\begin{bmatrix} 0 & 1 \\\\ 5 & 2\\end{bmatrix}$. Grouping the first two
gives $M_{1}M_{2} = \\begin{bmatrix} 4 & 8 \\\\ 6 & 0\\end{bmatrix}$ and then

$$(M_{1}M_{2})M_{3} = \\begin{bmatrix} 40 & 20 \\\\ 0 & 6 \\end{bmatrix}$$

Grouping the last two gives
$M_{2}M_{3} = \\begin{bmatrix} 20 & 9 \\\\ 0 & 2\\end{bmatrix}$ and

$$M_{1}(M_{2}M_{3}) = \\begin{bmatrix} 40 & 20 \\\\ 0 & 6 \\end{bmatrix}$$

Identical. Distribution over addition survives as well, in both directions, so
$A(B+C) = AB + AC$ and $(B+C)A = BA + CA$ are both valid; note that they are
different statements, and only commutativity would make them the same one.`,
  examTip: 'Check the shapes before multiplying anything. An m by n times an n by p is the only legal product, and writing the two dimension pairs side by side makes the illegal ones obvious: the inner numbers must match and they disappear from the answer.',
  importantNote: 'Both the transpose and the inverse of a product reverse the order. Writing (AB) inverse as A inverse times B inverse gives a matrix that is generally not even close, and it is the offered wrong answer on nearly every question of this type.',
},
{
  id: 'la-determinants',
  title: '7. Determinants: Two Routes, and the Properties Behind Them',
  content: `## 7.1 Cofactor expansion

For a $2\\times 2$ matrix the determinant is $ad - bc$. For anything larger,
expand along a row or a column, alternating signs:

$$\\lvert A\\rvert = \\sum_{j=1}^{n} (-1)^{i+j} a_{ij} M_{ij}$$

where $M_{ij}$ is the determinant of the matrix with row $i$ and column $j$
deleted. Every row and every column gives the same answer, so choose the one
with the most zeros: each zero entry removes an entire minor from the work.

### 7.2 Worked example: one determinant, computed twice

$$A = \\begin{bmatrix} 2 & 1 & 3 \\\\ 1 & 4 & -2 \\\\ 3 & 0 & 1 \\end{bmatrix}$$

**By cofactors along the first row**, with the sign pattern plus, minus, plus:

$$\\lvert A\\rvert = 2\\begin{vmatrix} 4 & -2 \\\\ 0 & 1\\end{vmatrix} - 1\\begin{vmatrix} 1 & -2 \\\\ 3 & 1\\end{vmatrix} + 3\\begin{vmatrix} 1 & 4 \\\\ 3 & 0\\end{vmatrix}$$

$$\\lvert A\\rvert = 2(4 - 0) - 1(1 + 6) + 3(0 - 12) = 8 - 7 - 36 = -35$$

**By row reduction**, which is the same quantity reached a completely different
way. Subtract half the first row from the second and one and a half times the
first row from the third, then add three sevenths of the new second row to the
third:

$$U = \\begin{bmatrix} 2 & 1 & 3 \\\\ 0 & 3.5 & -3.5 \\\\ 0 & 0 & -5 \\end{bmatrix}$$

None of those operations changes the determinant, and a triangular determinant
is the product of its diagonal:

$$\\lvert A\\rvert = 2 \\times 3.5 \\times (-5) = -35$$

Two routes, one number. For a $3\\times 3$ done by hand the cofactor route is
usually quicker; from $4\\times 4$ upward, reduce.

## 7.3 The properties, and why they hold

The determinant is the unique function of the rows that is linear in each row
separately, changes sign when two rows are swapped, and equals 1 for the
identity. Everything else follows from those three.

| Property | Statement | Consequence |
|---|---|---|
| Transpose | $\\lvert A^{T}\\rvert = \\lvert A\\rvert$ | anything true of rows is true of columns |
| Row swap | one swap negates $\\lvert A\\rvert$ | track swaps during elimination |
| Row scaling | multiplying one row by $k$ multiplies $\\lvert A\\rvert$ by $k$ | $\\lvert kA\\rvert = k^{n}\\lvert A\\rvert$ for $n\\times n$ |
| Row addition | adding a multiple of one row to another leaves $\\lvert A\\rvert$ alone | elimination is free |
| Repeated row | two equal rows force $\\lvert A\\rvert = 0$ | dependence destroys the determinant |
| Product | $\\lvert AB\\rvert = \\lvert A\\rvert\\,\\lvert B\\rvert$ | $\\lvert A^{-1}\\rvert = 1/\\lvert A\\rvert$ |
| Triangular | product of the diagonal | why elimination computes determinants |

The fourth property is the one that makes Gaussian elimination a determinant
algorithm, and it deserves its proof. Replace row $i$ by
$r_{i} + k\\,r_{j}$. Linearity in row $i$ splits the determinant into two: the
original, plus $k$ times a determinant whose rows $i$ and $j$ are both $r_{j}$.
The second has two equal rows, and swapping them changes the sign while leaving
the matrix identical, so it equals its own negative and is therefore zero. What
survives is the original determinant, unchanged.

The repeated-row property in turn explains the singular case: if the rows are
linearly dependent, one of them can be reduced to all zeros by exactly those
free operations, and a zero row expands to a determinant of zero.

### 7.4 Worked example: the product rule on real numbers

$$A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 3\\end{bmatrix},\\quad \\lvert A\\rvert = 6 - 1 = 5; \\qquad B = \\begin{bmatrix} 1 & 4 \\\\ 2 & 3\\end{bmatrix},\\quad \\lvert B\\rvert = 3 - 8 = -5$$

$$AB = \\begin{bmatrix} 4 & 11 \\\\ 7 & 13\\end{bmatrix}, \\qquad \\lvert AB\\rvert = 52 - 77 = -25 = 5 \\times (-5)$$

The rule holds, and it is worth more than a check. It says the determinant is
**multiplicative**, which is exactly what a scaling factor should be: apply two
transformations in a row and the areas multiply.

## 7.5 What the number means

Geometrically, $\\lvert A\\rvert$ is the factor by which the transformation
scales area in two dimensions, or volume in three, and its sign records whether
orientation is preserved.

![The unit square and its images under a matrix of determinant five, which is a parallelogram of five times the area, and under a shear of determinant one, which changes the shape without changing the area. The two columns of the first matrix are drawn as arrows to the corners of its image.](/courses/fe-ee/figures/math4-la-det-area.svg)

The columns of $A$ are where the two unit basis vectors land, so the image of the
unit square is the parallelogram they span, and its area is
$\\lvert A\\rvert$ computed by the cross product of those two columns. For
$A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 3\\end{bmatrix}$ the columns land at
$(2,1)$ and $(1,3)$ and the enclosed area is $2 \\times 3 - 1 \\times 1 = 5$,
which is the determinant formula rediscovered as geometry.

A determinant of zero therefore means the transformation flattens the plane onto
a line or a point. Area is destroyed, information is destroyed, and no inverse
can exist. That is the entire content of the singularity condition, and it is
worth carrying as a picture rather than as a rule.`,
  examTip: 'Expand along whichever row or column carries the most zeros; each zero deletes a full minor. If the matrix has no zeros, create some first with row operations, because adding a multiple of one row to another leaves the determinant untouched.',
  importantNote: 'Multiplying a whole n by n matrix by k multiplies the determinant by k to the power n, not by k. Every one of the n rows is scaled, and the determinant is linear in each row separately, so the factors compound.',
},
{
  id: 'la-inverse',
  title: '8. The Inverse, and What Singularity Costs',
  content: `## 8.1 Definition and the two-by-two formula

The inverse of a square $A$ is the matrix satisfying

$$AA^{-1} = A^{-1}A = I$$

For $2\\times 2$ it is worth memorising outright:

$$\\begin{bmatrix} a & b \\\\ c & d\\end{bmatrix}^{-1} = \\frac{1}{ad - bc}\\begin{bmatrix} d & -b \\\\ -c & a\\end{bmatrix}$$

The pattern is: swap the diagonal, negate the off-diagonal, divide by the
determinant. Three separate errors live in that sentence, and the guard against
all of them is to multiply the answer by the original and confirm the identity.

$$\\begin{bmatrix} 2 & 1 \\\\ 1 & 3\\end{bmatrix}^{-1} = \\frac{1}{5}\\begin{bmatrix} 3 & -1 \\\\ -1 & 2\\end{bmatrix}$$

Checking: the first row of $A$ against the first column of the candidate gives
$(2 \\times 3 + 1 \\times (-1))/5 = 5/5 = 1$, and against the second column
$(2 \\times (-1) + 1 \\times 2)/5 = 0$. Both rows check out, so the inverse is
right.

## 8.2 The general formula, and the cheaper route

$$A^{-1} = \\frac{1}{\\lvert A\\rvert}\\operatorname{adj}(A), \\qquad \\operatorname{adj}(A) = C^{T}$$

where $C$ is the matrix of signed cofactors. The adjugate is the **transpose**
of the cofactor matrix, and forgetting the transpose is the standard error in
$3\\times 3$ inversions. For anything above $3\\times 3$ the cofactor route is
hopeless and Gauss-Jordan elimination on $[\\,A \\mid I\\,]$ is the practical
method.

### 8.3 Worked example: a three-by-three inverse, verified entry by entry

Invert the matrix whose determinant was found to be $-35$:

$$A = \\begin{bmatrix} 2 & 1 & 3 \\\\ 1 & 4 & -2 \\\\ 3 & 0 & 1 \\end{bmatrix}$$

The nine signed cofactors are

$$C = \\begin{bmatrix} 4 & -7 & -12 \\\\ -1 & -7 & 3 \\\\ -14 & 7 & 7 \\end{bmatrix}$$

taking $C_{11} = +(4 \\times 1 - (-2) \\times 0) = 4$,
$C_{12} = -(1 \\times 1 - (-2) \\times 3) = -7$, and so on through the grid.
Transpose it and divide by the determinant:

$$A^{-1} = \\frac{1}{-35}\\begin{bmatrix} 4 & -1 & -14 \\\\ -7 & -7 & 7 \\\\ -12 & 3 & 7 \\end{bmatrix} = \\frac{1}{35}\\begin{bmatrix} -4 & 1 & 14 \\\\ 7 & 7 & -7 \\\\ 12 & -3 & -7 \\end{bmatrix}$$

Now verify, because an inverse is one of the few answers that checks itself
completely. The first row of $A$ against the three columns of $A^{-1}$:

$$\\frac{(2)(-4) + (1)(7) + (3)(12)}{35} = \\frac{-8 + 7 + 36}{35} = 1$$
$$\\frac{(2)(1) + (1)(7) + (3)(-3)}{35} = \\frac{2 + 7 - 9}{35} = 0$$
$$\\frac{(2)(14) + (1)(-7) + (3)(-7)}{35} = \\frac{28 - 7 - 21}{35} = 0$$

The remaining six products give $0, 1, 0$ and $0, 0, 1$ by the same arithmetic,
so $AA^{-1} = I$ exactly, with no rounding anywhere. Every entry of this inverse
was confirmed by that product before it was written down.

## 8.4 Singularity, and the useful near miss

$A^{-1}$ exists precisely when $\\lvert A\\rvert \\ne 0$. The determinant of the
inverse follows from the product rule:

$$\\lvert A\\rvert\\,\\lvert A^{-1}\\rvert = \\lvert I\\rvert = 1 \\quad\\Longrightarrow\\quad \\lvert A^{-1}\\rvert = \\frac{1}{\\lvert A\\rvert}$$

which shows immediately why a zero determinant is fatal: the inverse would have
to have an infinite determinant.

The engineering warning is that $\\lvert A\\rvert$ close to zero is nearly as bad
as zero. The entries of $A^{-1}$ carry $1/\\lvert A\\rvert$, so a small
determinant magnifies every rounding error in the data. In a nodal analysis a
near-singular conductance matrix usually means two nodes are joined by a
conductance vastly larger than everything else, so the model is trying to
resolve a voltage difference that barely exists.

### 8.5 Worked example: solving by inverse against solving by elimination

To solve $A\\mathbf{x} = \\mathbf{b}$ you can form $\\mathbf{x} = A^{-1}\\mathbf{b}$,
but it is the wrong habit for one right-hand side. Inverting a $3\\times 3$ by
cofactors costs nine $2\\times 2$ determinants plus a transpose plus nine
divisions, and then a matrix-vector product on top. Elimination on the same
system costs seventeen multiplications and finishes.

The inverse earns its keep when there are **many** right-hand sides against one
matrix: the same network driven by twenty different source vectors, for
instance. Then one inversion is amortised over twenty solves. Even there, a
stored LU factorisation beats a stored inverse on both speed and accuracy, which
is why professional solvers never form an inverse at all.`,
  examTip: 'After computing any inverse, multiply it by the original. The product must be the identity, and the check costs less than the inversion did. On the FE it also converts a partially remembered formula into a verified answer.',
  importantNote: 'The adjugate is the TRANSPOSE of the cofactor matrix. Skipping the transpose produces a matrix that looks plausible and fails A times A inverse equals I on the off-diagonal entries, which is exactly why that product must be checked.',
},
{
  id: 'la-elimination',
  title: '9. Elimination, Partial Pivoting, and What Cramer Costs',
  content: `## 9.1 Gaussian elimination as an algorithm

Forward elimination clears each column below the pivot using the multiplier
$m_{ik} = a_{ik}/a_{kk}$, producing an upper-triangular system; back
substitution then reads the unknowns off from the bottom up. The determinant
falls out for free as the product of the pivots, times $-1$ for each row swap.

### 9.2 Worked example: a three-node system, eliminated by hand

A nodal analysis produces

$$\\begin{bmatrix} 7 & -2 & -1 \\\\ -2 & 6 & -3 \\\\ -1 & -3 & 9 \\end{bmatrix}\\begin{bmatrix} V_{1} \\\\ V_{2} \\\\ V_{3}\\end{bmatrix} = \\begin{bmatrix} 7 \\\\ 11 \\\\ -2 \\end{bmatrix}$$

The pivot in column one is 7, larger in magnitude than either entry below it, so
no swap is needed. The multipliers are $-2/7 = -0.285714$ and
$-1/7 = -0.142857$, and subtracting those multiples of row one gives

$$\\begin{bmatrix} 7 & -2 & -1 \\\\ 0 & 5.428571 & -3.285714 \\\\ 0 & -3.285714 & 8.857143 \\end{bmatrix}, \\qquad \\begin{bmatrix} 7 \\\\ 13 \\\\ -1 \\end{bmatrix}$$

The second pivot, 5.428571, again dominates the entry below it. The multiplier
is $-3.285714/5.428571 = -0.605263$, and the last row becomes

$$\\begin{bmatrix} 0 & 0 & 6.868421 \\end{bmatrix}, \\qquad 6.868421$$

Back substitution now runs upward:

$$V_{3} = \\frac{6.868421}{6.868421} = 1, \\qquad V_{2} = \\frac{13 + 3.285714}{5.428571} = 3, \\qquad V_{1} = \\frac{7 + 6 + 1}{7} = 2$$

The determinant comes free as the product of the pivots,
$7 \\times 5.428571 \\times 6.868421 = 261$, and cofactor expansion of the original
matrix returns 261 as well. Substituting $(2, 3, 1)$ into all three original
equations reproduces $7$, $11$ and $-2$ exactly, which is the check that costs
nine multiplications and settles the question.

## 9.3 Why partial pivoting exists

Elimination breaks down outright if a pivot is zero, and it degrades badly if a
pivot is merely small, because the multiplier $a_{ik}/a_{kk}$ then becomes huge
and scales the rounding error in the pivot row up with it. **Partial pivoting**
fixes this by swapping the row with the largest magnitude entry in the current
column into the pivot position before eliminating, which forces every multiplier
to have magnitude at most one.

### 9.4 Worked example: the same system, ruined and rescued

Solve, carrying only three significant digits, the system

$$\\begin{bmatrix} \\varepsilon & 1 \\\\ 1 & 1\\end{bmatrix}\\begin{bmatrix} x_{1} \\\\ x_{2}\\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 2\\end{bmatrix}, \\qquad \\varepsilon = 10^{-5}$$

The exact answer is $x_{1} = 1/(1 - \\varepsilon) = 1.00001$ and
$x_{2} = 1 - \\varepsilon x_{1} = 0.99999$.

**Without pivoting**, the multiplier is $1/\\varepsilon = 10^{5}$. The second row
becomes $1 - 10^{5}$, which rounds to $-1.00\\times 10^{5}$ in three digits, and
its right side becomes $2 - 10^{5}$, which rounds to the same
$-1.00\\times 10^{5}$. So $x_{2} = 1.00$, and back substitution gives

$$x_{1} = \\frac{1 - 1.00}{10^{-5}} = \\frac{0}{10^{-5}} = 0$$

The answer is not slightly wrong, it is 0 instead of 1.00001, a relative error
of 1. The information about $x_{1}$ was destroyed the moment
$1 - 10^{5}$ and $2 - 10^{5}$ rounded to the same number.

**With pivoting**, the rows are swapped first because $\\lvert 1\\rvert$ beats
$\\varepsilon$. The multiplier is now $10^{-5}$, the second row becomes
$1 - 10^{-5}$ which rounds to 1.00 with no loss that matters, and both unknowns
come out as 1.00, correct to the three digits carried.

![Relative error in the first unknown against the size of the small pivot, on logarithmic axes, computed in three significant digit arithmetic. Without a row swap the error climbs to one and stays there; with partial pivoting it stays at the rounding limit and falls as the pivot shrinks.](/courses/fe-ee/figures/math4-la-pivot-error.svg)

The figure sweeps $\\varepsilon$ over seven decades with every operation rounded
to three digits. The unpivoted curve saturates at a relative error of 1, meaning
the computed first unknown carries no information at all, while the pivoted
curve never does worse than the rounding unit of three-digit arithmetic, about
$5\\times 10^{-3}$.

## 9.5 Cramer's rule, and where it stops being sensible

Cramer's rule solves $A\\mathbf{x} = \\mathbf{b}$ with $n+1$ determinants:

$$x_{i} = \\frac{\\lvert A_{i}\\rvert}{\\lvert A\\rvert}$$

where $A_{i}$ is $A$ with column $i$ replaced by $\\mathbf{b}$. It is exact, it
needs no bookkeeping, and it is genuinely the fastest hand method at
$2\\times 2$. Its cost, however, grows factorially, because expanding an
$n\\times n$ determinant by cofactors takes $M(n) = n\\,M(n-1) + n$
multiplications with $M(2) = 2$.

| $n$ | Cramer, multiplications | Elimination, multiplications |
|---|---|---|
| 2 | 8 | 6 |
| 3 | 39 | 17 |
| 4 | 204 | 36 |
| 5 | 1,235 | 65 |
| 6 | 8,658 | 106 |
| 8 | 623,528 | 232 |
| 10 | 68,588,310 | 430 |

The elimination column counts the forward sweep plus back substitution,
$(2n^{3} + 3n^{2} - 5n)/6 + n(n+1)/2$; the Cramer column counts $n+1$ cofactor
determinants plus $n$ divisions. At $n = 3$ elimination is already ahead by a
factor of two, at $n = 5$ by nineteen, and at $n = 10$ by a hundred and sixty
thousand. Elimination is cubic and Cramer is factorial, and no amount of
cleverness closes a gap of that shape.

Cramer keeps one genuine advantage: it produces a **single** unknown without
computing the others, which is occasionally exactly what a question asks for.`,
  examTip: 'On a three-by-three system where only one unknown is wanted, Cramer delivers it with two determinants. Where all three are wanted, eliminate. The break-even sits right at three-by-three, which is why both methods appear on this exam and neither is always right.',
  importantNote: 'A small pivot is not a small problem. Three-digit arithmetic on a system with a pivot of ten to the minus five returns zero for an unknown whose true value is one, and no warning is produced. Always move the largest available entry into the pivot position.',
},
{
  id: 'la-rank',
  title: '10. Rank, Null Space, and When a System Has an Answer',
  content: `## 10.1 Rank

The **rank** of a matrix is the number of pivots left after row reduction,
equivalently the number of independent rows, equivalently the number of
independent columns. That those three counts always agree is the central
non-obvious fact of the subject, and it is what makes rank a property of the
matrix rather than of the way it was reduced.

The **null space** of $A$ is the set of vectors it sends to zero,
$N(A) = \\{\\mathbf{x} : A\\mathbf{x} = \\mathbf{0}\\}$, and its dimension is the
**nullity**. The two are tied together:

$$\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n \\quad (n = \\text{number of columns})$$

Read it as a conservation law. Each column is either a direction the matrix
genuinely uses, or a direction it collapses; there are $n$ of them and no
others.

![The unit circle mapped by a matrix of determinant five, which produces an ellipse, and by a singular matrix of rank one, which flattens the whole circle onto a single line segment. The direction that the singular matrix sends to the origin is marked.](/courses/fe-ee/figures/math4-la-rank-collapse.svg)

The picture is what rank means. A full-rank $2\\times 2$ sends the unit circle to
an ellipse and loses nothing. A rank-one matrix squashes the same circle onto a
segment: one whole direction, the null direction, has been sent to the origin,
and no inverse can recover it because every point on the null line arrived at
the same place.

### 10.2 Worked example: rank, nullity and a null vector

$$A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 1 & 1 \\end{bmatrix}$$

Row two is exactly twice row one, so subtracting kills it. Subtracting row one
from row three gives $(0, -1, -2)$:

$$\\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & -1 & -2 \\\\ 0 & 0 & 0 \\end{bmatrix}$$

Two pivots, so $\\operatorname{rank}(A) = 2$ and the nullity is
$3 - 2 = 1$. To find the null direction, set the free variable $z = 1$: the
second row gives $-y - 2 = 0$, so $y = -2$, and the first gives
$x - 4 + 3 = 0$, so $x = 1$.

$$A\\begin{bmatrix} 1 \\\\ -2 \\\\ 1\\end{bmatrix} = \\begin{bmatrix} 1 - 4 + 3 \\\\ 2 - 8 + 6 \\\\ 1 - 2 + 1\\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\\\ 0\\end{bmatrix}$$

Confirmed by direct multiplication, which is how a null vector should always be
checked.

## 10.3 Existence and uniqueness, stated precisely

Form the augmented matrix $[\\,A \\mid \\mathbf{b}\\,]$ by attaching the right-hand
side as an extra column. Then, for $A\\mathbf{x} = \\mathbf{b}$ with $n$ unknowns:

| Condition | Outcome |
|---|---|
| $\\operatorname{rank}(A) < \\operatorname{rank}([\\,A \\mid \\mathbf{b}\\,])$ | no solution |
| $\\operatorname{rank}(A) = \\operatorname{rank}([\\,A \\mid \\mathbf{b}\\,]) = n$ | exactly one solution |
| $\\operatorname{rank}(A) = \\operatorname{rank}([\\,A \\mid \\mathbf{b}\\,]) < n$ | infinitely many solutions |

The first line says $\\mathbf{b}$ lies outside the span of the columns, so no
combination of them can reach it. The third says the columns span enough to
reach $\\mathbf{b}$ but not independently, so any null vector can be added to a
solution and it remains one:

$$\\mathbf{x} = \\mathbf{x}_{p} + \\mathbf{x}_{n}, \\qquad A\\mathbf{x}_{n} = \\mathbf{0}$$

That is the same particular-plus-homogeneous structure as a driven differential
equation, and for the same reason: both are linear operators.

### 10.4 Worked example: the same matrix, two right-hand sides

Keep $A$ from above.

**Consistent.** With $\\mathbf{b} = (6, 12, 3)$ the elimination that killed row
two also sends its right-hand entry to $12 - 12 = 0$, so no contradiction
appears and the augmented rank is 2, matching. Setting $z = 0$ gives
$-y = -3$, so $y = 3$, and then $x + 6 = 6$, so $x = 0$. The whole solution set
is

$$\\mathbf{x} = \\begin{bmatrix} 0 \\\\ 3 \\\\ 0\\end{bmatrix} + t\\begin{bmatrix} 1 \\\\ -2 \\\\ 1\\end{bmatrix}$$

Test it at $t = 2$: the vector $(2, -1, 2)$ gives
$2 - 2 + 6 = 6$, $4 - 4 + 12 = 12$ and $2 - 1 + 2 = 3$. All three hold, so the
whole line really does solve the system.

**Inconsistent.** Change only the middle entry, to
$\\mathbf{b} = (6, 13, 3)$. Now the same elimination sends it to
$13 - 12 = 1$, leaving the row

$$\\begin{bmatrix} 0 & 0 & 0 \\mid 1 \\end{bmatrix}$$

which asserts $0 = 1$. The augmented rank is 3 while the coefficient rank is 2,
so there is **no** solution. One entry changed by one unit moved the problem
from an infinite family of answers to none at all, and nothing about the
coefficient matrix changed.

## 10.5 What this means in a circuit

A singular nodal or mesh matrix is almost never an arithmetic slip; it is a
modelling error, and the null space says which one. A null vector of all ones
means every node voltage can be shifted by the same amount without changing any
branch current, which is precisely the symptom of a network with no reference
node. A null vector supported on one loop means that loop equation was already
implied by the others.

Grounding a node removes one column and one row and restores full rank. That is
why every nodal analysis starts by choosing a reference: not for convenience,
but because without it the system genuinely has no unique answer.`,
  examTip: 'Compute the rank of the coefficient matrix and of the augmented matrix together, in one reduction. Comparing the two numbers, and then comparing against the number of unknowns, decides existence and uniqueness with no further work.',
  importantNote: 'Rank plus nullity equals the number of COLUMNS, not the number of rows. For a non-square matrix the distinction changes the answer, and it is the detail that turns a correct reduction into a wrong nullity.',
},
{
  id: 'la-vector-spaces',
  title: '11. Vector Spaces, Independence and Basis',
  content: `## 11.1 What a vector space is, in the version the exam uses

A vector space is a set closed under addition and under scalar multiplication,
containing a zero element. On this exam the sets that matter are
$\\mathbb{R}^{n}$ and its subspaces, and the useful question is always the same:
is this particular set a subspace?

Two tests settle it. The set must contain the zero vector, and any combination
of two members must stay inside. The null space of a matrix passes both, since
$A\\mathbf{0} = \\mathbf{0}$ and
$A(c_{1}\\mathbf{x}_{1} + c_{2}\\mathbf{x}_{2}) = \\mathbf{0}$ whenever both
pieces are annihilated. The column space passes as well. The solution set of
$A\\mathbf{x} = \\mathbf{b}$ with $\\mathbf{b} \\ne \\mathbf{0}$ fails the very
first test, because $\\mathbf{x} = \\mathbf{0}$ does not satisfy it; that set is
a shifted copy of the null space, not a subspace.

## 11.2 Linear independence

Vectors $\\mathbf{v}_{1}, \\ldots, \\mathbf{v}_{k}$ are independent when the only
combination reaching zero is the trivial one:

$$c_{1}\\mathbf{v}_{1} + c_{2}\\mathbf{v}_{2} + \\cdots + c_{k}\\mathbf{v}_{k} = \\mathbf{0} \\quad\\Longrightarrow\\quad c_{1} = c_{2} = \\cdots = c_{k} = 0$$

The practical test is to stack them as the columns of a matrix. They are
independent exactly when that matrix has rank $k$, and for $k = n$ square that
reduces to a determinant test:

$$\\lvert V\\rvert \\ne 0 \\iff \\text{the columns are independent}$$

A **basis** is an independent set that spans the space. Every basis of an
$n$-dimensional space has exactly $n$ members, so in $\\mathbb{R}^{3}$ any three
independent vectors form a basis and any four vectors are dependent, without
computing anything.

### 11.3 Worked example: a dependent set, with the relation found

Test $\\mathbf{v}_{1} = (1, 2, 3)$, $\\mathbf{v}_{2} = (2, 1, 0)$ and
$\\mathbf{v}_{3} = (4, 5, 6)$.

$$\\lvert V\\rvert = \\begin{vmatrix} 1 & 2 & 4 \\\\ 2 & 1 & 5 \\\\ 3 & 0 & 6\\end{vmatrix} = 1(6 - 0) - 2(12 - 15) + 4(0 - 3) = 6 + 6 - 12 = 0$$

Zero, so the set is dependent, and one member is a combination of the others.
Finding which takes one small system. Write
$\\mathbf{v}_{3} = a\\mathbf{v}_{1} + b\\mathbf{v}_{2}$ and read the third
components: $3a = 6$, so $a = 2$. The first components then give
$2 + 2b = 4$, so $b = 1$. Verify with the untouched second component:
$2(2) + 1(1) = 5$, which matches.

$$\\mathbf{v}_{3} = 2\\mathbf{v}_{1} + \\mathbf{v}_{2}$$

The determinant announced the dependence; solving for the relation named it. On
the exam the first is usually all that is asked, but the second is what a
circuit question wants when it asks which loop equation was redundant.

### 11.4 Worked example: a basis, and coordinates in it

Test $\\mathbf{u}_{1} = (1, 0, 1)$, $\\mathbf{u}_{2} = (0, 1, 1)$ and
$\\mathbf{u}_{3} = (1, 1, 0)$.

$$\\lvert U\\rvert = \\begin{vmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 1 & 1 & 0\\end{vmatrix} = 1(0 - 1) - 0(0 - 1) + 1(0 - 1) = -1 - 1 = -2$$

Non-zero, so these three are independent and therefore a basis of
$\\mathbb{R}^{3}$. Express $(3, 4, 5)$ in it by solving
$c_{1}\\mathbf{u}_{1} + c_{2}\\mathbf{u}_{2} + c_{3}\\mathbf{u}_{3} = (3,4,5)$,
which reads

$$c_{1} + c_{3} = 3, \\qquad c_{2} + c_{3} = 4, \\qquad c_{1} + c_{2} = 5$$

Adding all three gives $2(c_{1} + c_{2} + c_{3}) = 12$, so the total is 6, and
each coefficient is 6 minus the equation that omits it:

$$c_{1} = 6 - 4 = 2, \\qquad c_{2} = 6 - 3 = 3, \\qquad c_{3} = 6 - 5 = 1$$

Check by rebuilding the vector:
$2(1,0,1) + 3(0,1,1) + 1(1,1,0) = (3, 4, 5)$. The coordinates
$(2, 3, 1)$ describe the same point as $(3, 4, 5)$ does in the standard basis;
changing basis changes the numbers, never the vector.

## 11.5 The four subspaces attached to a matrix

| Subspace | Definition | Dimension | Lives in |
|---|---|---|---|
| column space | all $A\\mathbf{x}$ | $r$ | $\\mathbb{R}^{m}$ |
| null space | all $\\mathbf{x}$ with $A\\mathbf{x} = \\mathbf{0}$ | $n - r$ | $\\mathbb{R}^{n}$ |
| row space | all $A^{T}\\mathbf{y}$ | $r$ | $\\mathbb{R}^{n}$ |
| left null space | all $\\mathbf{y}$ with $A^{T}\\mathbf{y} = \\mathbf{0}$ | $m - r$ | $\\mathbb{R}^{m}$ |

Here $r$ is the rank, $m$ the number of rows and $n$ the number of columns. The
two dimensions in each column of $\\mathbb{R}$ add to the size of the space they
sit in, which is the rank-nullity theorem applied to $A$ and to $A^{T}$. The row
space and the null space are orthogonal complements inside
$\\mathbb{R}^{n}$, and that orthogonality is exactly the fact least squares will
exploit.`,
  examTip: 'To test independence of n vectors in n dimensions, stack them as columns and take one determinant. Non-zero means independent, and it means basis, and it means invertible, and it means unique solutions, all at once. Those are five names for one condition.',
  importantNote: 'The set of solutions of Ax = b is not a vector space when b is non-zero, because it does not contain the zero vector. It is the null space shifted by any one particular solution, which is why every such solution set has the same shape and size.',
},
{
  id: 'la-eigen-depth',
  title: '12. Eigenvalues as Invariant Directions',
  content: `## 12.1 The definition, read as geometry

$$A\\mathbf{v} = \\lambda\\mathbf{v}, \\qquad \\mathbf{v} \\ne \\mathbf{0}$$

Almost every vector is both stretched and turned by a matrix. An eigenvector is
a direction the matrix refuses to turn: it comes back pointing the same way, or
exactly reversed, scaled by $\\lambda$. Rearranged, the definition demands that

$$(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$$

have a non-zero solution, which by the previous section means the matrix
$A - \\lambda I$ must be singular. That gives the characteristic equation:

$$\\lvert A - \\lambda I\\rvert = 0$$

For $2\\times 2$ it expands to a quadratic whose coefficients are already in
front of you:

$$\\lambda^{2} - \\operatorname{tr}(A)\\,\\lambda + \\lvert A\\rvert = 0$$

so the eigenvalues sum to the trace and multiply to the determinant. Both checks
are free and both should be used every time.

### 12.2 Worked example: a non-symmetric two-by-two

$$A = \\begin{bmatrix} 4 & -2 \\\\ 1 & 1\\end{bmatrix}, \\qquad \\operatorname{tr}(A) = 5, \\qquad \\lvert A\\rvert = 4 + 2 = 6$$

$$\\lambda^{2} - 5\\lambda + 6 = 0 \\quad\\Longrightarrow\\quad \\lambda = 2, \\ 3$$

For $\\lambda = 2$, the matrix $A - 2I = \\begin{bmatrix} 2 & -2 \\\\ 1 & -1\\end{bmatrix}$
gives the single independent equation $v_{1} = v_{2}$, so
$\\mathbf{v} = (1, 1)$. For $\\lambda = 3$, $A - 3I = \\begin{bmatrix} 1 & -2 \\\\ 1 & -2\\end{bmatrix}$
gives $v_{1} = 2v_{2}$, so $\\mathbf{v} = (2, 1)$.

Verify both by residual, which is the only check that cannot be fooled:

$$A\\begin{bmatrix}1\\\\1\\end{bmatrix} - 2\\begin{bmatrix}1\\\\1\\end{bmatrix} = \\begin{bmatrix}2\\\\2\\end{bmatrix} - \\begin{bmatrix}2\\\\2\\end{bmatrix} = \\begin{bmatrix}0\\\\0\\end{bmatrix}$$
$$A\\begin{bmatrix}2\\\\1\\end{bmatrix} - 3\\begin{bmatrix}2\\\\1\\end{bmatrix} = \\begin{bmatrix}6\\\\3\\end{bmatrix} - \\begin{bmatrix}6\\\\3\\end{bmatrix} = \\begin{bmatrix}0\\\\0\\end{bmatrix}$$

![The unit circle and its image under a matrix with eigenvalues two and three. The image is an ellipse, and two marked directions come back along themselves, stretched by two and by three, while a control vector drawn from a different quadrant is visibly turned.](/courses/fe-ee/figures/math4-la-eigen-directions.svg)

The two invariant directions are not perpendicular, because this matrix is not
symmetric. A control vector makes the contrast: $(0,1)$ is sent to $(-2, 1)$, a
completely different direction. Only two directions in the whole plane survive
unturned, and they are what the characteristic equation finds.

Eigenvectors are directions, so scale is arbitrary: $(2,1)$, $(4,2)$ and
$(-2,-1)$ are all correct answers for $\\lambda = 3$. An option that differs
from your vector by a constant factor is not a wrong option.

### 12.3 Worked example: a three-by-three, where the answer is visible

$$A = \\begin{bmatrix} 2 & 0 & 0 \\\\ 1 & 3 & 0 \\\\ -1 & 2 & 4\\end{bmatrix}$$

The matrix is triangular, so $A - \\lambda I$ is triangular too and its
determinant is the product of the diagonal. The characteristic equation is
therefore

$$(2 - \\lambda)(3 - \\lambda)(4 - \\lambda) = 0 \\quad\\Longrightarrow\\quad \\lambda = 2,\\ 3,\\ 4$$

The eigenvalues of any triangular matrix are simply its diagonal entries, which
is worth recognising instantly. The checks agree: the trace is
$2 + 3 + 4 = 9$ and the determinant is $2 \\times 3 \\times 4 = 24$.

The eigenvectors still need work. For $\\lambda = 4$ the first two rows of
$A - 4I$ force $v_{1} = 0$ and then $v_{2} = 0$, leaving $\\mathbf{v} = (0,0,1)$.
For $\\lambda = 3$ the first row forces $v_{1} = 0$ and the third gives
$2v_{2} + v_{3} = 0$, so $\\mathbf{v} = (0, 1, -2)$. For $\\lambda = 2$ the second
row gives $v_{2} = -v_{1}$ and the third gives $-3v_{1} + 2v_{3} = 0$, so
$\\mathbf{v} = (2, -2, 3)$.

Each was confirmed by residual. Taking the last one:

$$A\\begin{bmatrix}2\\\\-2\\\\3\\end{bmatrix} = \\begin{bmatrix}4\\\\-4\\\\6\\end{bmatrix} = 2\\begin{bmatrix}2\\\\-2\\\\3\\end{bmatrix}$$

## 12.4 Where the exam meets them

Eigenvalues are the same quantity under several names, and recognising the
disguise is most of the work.

| Context | The eigenvalues are | What they decide |
|---|---|---|
| state-space $\\dot{\\mathbf{x}} = A\\mathbf{x}$ | poles of the transfer function | stability |
| coupled oscillators | squared natural frequencies | mode frequencies |
| network with symmetric $A$ | principal stiffnesses | energy directions |
| repeated multiplication $A^{k}$ | growth factors per step | which mode dominates |

Stability in the first row is the statement that every $\\lambda$ has a negative
real part, which is the same condition the differential equations chapter states
about characteristic roots. It is the same equation: the characteristic
polynomial of $A$ and the characteristic polynomial of the corresponding
scalar ODE are one object.`,
  examTip: 'Write the characteristic equation for a two-by-two straight from the trace and the determinant, as lambda squared minus trace lambda plus determinant. It is faster than expanding the determinant of A minus lambda I, and the same two numbers then check the roots you get.',
  importantNote: 'Verify an eigenpair by computing A v minus lambda v and confirming it is the zero vector. Checking that the eigenvalue satisfies the characteristic polynomial confirms only the eigenvalue; a sign slip in the eigenvector survives that check untouched.',
},
{
  id: 'la-diagonalise',
  title: '13. Diagonalisation, Powers, and What Repetition Forgets',
  content: `## 13.1 The factorisation

If an $n\\times n$ matrix has $n$ independent eigenvectors, collect them as the
columns of $P$ and the eigenvalues on the diagonal of $D$. Then
$AP = PD$ column by column, and since $P$ is invertible,

$$A = PDP^{-1}, \\qquad D = P^{-1}AP$$

The payoff is powers. Every internal $P^{-1}P$ collapses:

$$A^{k} = PDP^{-1}\\cdot PDP^{-1}\\cdots PDP^{-1} = PD^{k}P^{-1}$$

and $D^{k}$ is just each eigenvalue raised to $k$. A problem that would need
$k$ matrix multiplications becomes one exponentiation of $n$ numbers.

### 13.2 Worked example: a fifth power without five multiplications

Take the matrix from the previous section, with $\\lambda = 2$ and 3 and
eigenvectors $(1,1)$ and $(2,1)$:

$$P = \\begin{bmatrix} 1 & 2 \\\\ 1 & 1\\end{bmatrix}, \\qquad \\lvert P\\rvert = 1 - 2 = -1, \\qquad P^{-1} = \\begin{bmatrix} -1 & 2 \\\\ 1 & -1\\end{bmatrix}$$

Confirm the factorisation first, because everything downstream depends on it:

$$PDP^{-1} = \\begin{bmatrix} 2 & 6 \\\\ 2 & 3\\end{bmatrix}\\begin{bmatrix} -1 & 2 \\\\ 1 & -1\\end{bmatrix} = \\begin{bmatrix} 4 & -2 \\\\ 1 & 1\\end{bmatrix} = A$$

Now the fifth power, with $2^{5} = 32$ and $3^{5} = 243$:

$$A^{5} = P\\begin{bmatrix} 32 & 0 \\\\ 0 & 243\\end{bmatrix}P^{-1} = \\begin{bmatrix} 32 & 486 \\\\ 32 & 243\\end{bmatrix}\\begin{bmatrix} -1 & 2 \\\\ 1 & -1\\end{bmatrix} = \\begin{bmatrix} 454 & -422 \\\\ 211 & -179\\end{bmatrix}$$

Two independent checks. The trace of $A^{5}$ must be the sum of the fifth powers
of the eigenvalues, and its determinant must be the fifth power of the
determinant:

$$454 - 179 = 275 = 32 + 243, \\qquad \\lvert A^{5}\\rvert = 7776 = 6^{5}$$

Both hold, and repeating the multiplication directly five times reproduces the
same matrix entry for entry.

## 13.3 When diagonalisation is impossible

A repeated eigenvalue is allowed; a shortage of independent eigenvectors is not.

$$A = \\begin{bmatrix} 2 & 1 \\\\ 0 & 2\\end{bmatrix}$$

has $\\lambda = 2$ twice, but $A - 2I = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0\\end{bmatrix}$
forces $v_{2} = 0$, leaving only the single direction $(1, 0)$. One eigenvector
for a two-dimensional space is not enough, so no $P$ exists and the matrix is
**defective**. Its powers still have a closed form, but it carries a factor of
$k$ that no diagonal matrix can produce:

$$A^{k} = \\begin{bmatrix} 2^{k} & k\\,2^{k-1} \\\\ 0 & 2^{k}\\end{bmatrix}, \\qquad A^{3} = \\begin{bmatrix} 8 & 12 \\\\ 0 & 8\\end{bmatrix}$$

Multiplying $A$ by itself three times confirms the entries. That stray factor of
$k$ is the discrete counterpart of the factor of $t$ that a repeated root forces
into the solution of a differential equation, and it appears for the same
reason: a shortage of independent solutions.

### 13.4 Worked example: what survives repeated multiplication

Take $A = \\begin{bmatrix} 4 & -2 \\\\ 1 & 1\\end{bmatrix}$ again and start from
$\\mathbf{v} = (1, 0)$. Decompose the start into eigenvectors, which is one small
system: $(1,0) = a(1,1) + b(2,1)$ gives $a + 2b = 1$ and $a + b = 0$, so
$a = -1$ and $b = 1$. Then

$$A^{k}\\mathbf{v} = -2^{k}\\begin{bmatrix}1\\\\1\\end{bmatrix} + 3^{k}\\begin{bmatrix}2\\\\1\\end{bmatrix}$$

The two modes grow at different rates, so their **ratio** shrinks like
$(2/3)^{k}$. Whatever the starting vector, the direction converges to the
eigenvector of the largest eigenvalue, and the leftover misalignment decays
geometrically at the ratio of the two eigenvalues.

![The angle between the repeatedly multiplied vector and the dominant eigenvector, plotted against the number of multiplications on a logarithmic scale. The points fall on a straight line parallel to a reference decay of two thirds per step.](/courses/fe-ee/figures/math4-la-power-iteration.svg)

Starting at $(1,0)$ the angle to $(2,1)$ is $26.57$ degrees. After eight
multiplications it is $0.4578$ degrees, and each further step multiplies the
angle by a factor approaching $2/3$: the measured ratios are 0.648, 0.655 and
0.659 at steps 6, 7 and 8, converging on 0.667.

This is the **power method**, the simplest eigenvalue algorithm there is, and it
also explains the physics. In a system with several modes, repeated application
of the dynamics leaves only the dominant one, which is why a network settles
into its slowest mode and why the largest eigenvalue is the one that decides
long-term behaviour.

## 13.5 The summary table

| Situation | Diagonalisable | Powers |
|---|---|---|
| $n$ distinct eigenvalues | always | $PD^{k}P^{-1}$ |
| repeated eigenvalue, enough eigenvectors | yes | $PD^{k}P^{-1}$ |
| repeated eigenvalue, too few eigenvectors | no | Jordan form, with $k$ factors |
| real symmetric | always, and orthogonally | $Q\\Lambda^{k}Q^{T}$ |

The last row is the one an FE candidate meets most, because the matrices that
come out of circuits and structures are symmetric by construction.`,
  examTip: 'Distinct eigenvalues guarantee diagonalisability, so you never need to test the eigenvectors in that case. Only a repeated eigenvalue can fail, and then the question is whether it supplies as many independent eigenvectors as its multiplicity.',
  importantNote: 'A matrix power is not the entrywise power. Raising each element of a two by two to the fourth is a different and generally meaningless matrix; the correct route is repeated multiplication, or the eigenvalue factorisation when it exists.',
},
{
  id: 'la-symmetric',
  title: '14. Symmetric Matrices, Orthogonality and Energy',
  content: `## 14.1 Three guarantees

A real symmetric matrix, $A^{T} = A$, comes with promises no general matrix
makes: every eigenvalue is real, eigenvectors belonging to different eigenvalues
are orthogonal, and the matrix is always diagonalisable, by an orthogonal
matrix:

$$A = Q\\Lambda Q^{T}, \\qquad Q^{T}Q = I$$

The orthogonality is worth proving because the proof is three lines and it
explains the result. Let $A\\mathbf{v}_{1} = \\lambda_{1}\\mathbf{v}_{1}$ and
$A\\mathbf{v}_{2} = \\lambda_{2}\\mathbf{v}_{2}$. Then

$$\\lambda_{1}(\\mathbf{v}_{1}\\cdot\\mathbf{v}_{2}) = (A\\mathbf{v}_{1})\\cdot\\mathbf{v}_{2} = \\mathbf{v}_{1}\\cdot(A^{T}\\mathbf{v}_{2}) = \\mathbf{v}_{1}\\cdot(A\\mathbf{v}_{2}) = \\lambda_{2}(\\mathbf{v}_{1}\\cdot\\mathbf{v}_{2})$$

so $(\\lambda_{1} - \\lambda_{2})(\\mathbf{v}_{1}\\cdot\\mathbf{v}_{2}) = 0$. If the
eigenvalues differ, the dot product must vanish. Symmetry entered at exactly one
step, where $A^{T}$ was replaced by $A$, and without it the argument collapses.

### 14.2 Worked example: a symmetric pair, orthogonal by construction

$$A = \\begin{bmatrix} 5 & 2 \\\\ 2 & 2\\end{bmatrix}, \\qquad \\operatorname{tr}(A) = 7, \\qquad \\lvert A\\rvert = 10 - 4 = 6$$

$$\\lambda^{2} - 7\\lambda + 6 = 0 \\quad\\Longrightarrow\\quad \\lambda = 6, \\ 1$$

For $\\lambda = 6$, the row $-v_{1} + 2v_{2} = 0$ gives $\\mathbf{v} = (2, 1)$;
for $\\lambda = 1$, the row $4v_{1} + 2v_{2} = 0$ gives $\\mathbf{v} = (1, -2)$.
Both check by residual, $A(2,1) = (12, 6) = 6(2,1)$ and
$A(1,-2) = (1, -2)$. Their dot product is

$$(2)(1) + (1)(-2) = 0$$

exactly as the theorem promised. Normalising each and stacking them gives the
orthogonal matrix

$$Q = \\frac{1}{\\sqrt{5}}\\begin{bmatrix} 2 & 1 \\\\ 1 & -2\\end{bmatrix}, \\qquad Q\\begin{bmatrix} 6 & 0 \\\\ 0 & 1\\end{bmatrix}Q^{T} = A$$

which was confirmed by multiplying it out. Note that $Q^{-1} = Q^{T}$, so this
factorisation needs no inversion at all: the transpose does the job, and that is
the whole practical advantage of orthogonality.

## 14.3 Quadratic forms and energy

Every symmetric matrix defines a quadratic form:

$$q(\\mathbf{x}) = \\mathbf{x}^{T}A\\mathbf{x} = \\sum_{i}\\sum_{j} a_{ij}x_{i}x_{j}$$

For the matrix above,
$q(x, y) = 5x^{2} + 4xy + 2y^{2}$; the off-diagonal entry appears twice, once as
$a_{12}$ and once as $a_{21}$, which is where the 4 comes from. Quadratic forms
are how stored energy is written: the energy in a set of coupled capacitors or
inductors is a quadratic form in the voltages or currents, and its matrix is
symmetric because the coupling is reciprocal.

### 14.4 Worked example: the same energy, computed two ways

Evaluate $q$ at $\\mathbf{x} = (1, 1)$ directly:

$$q = 5(1)^{2} + 4(1)(1) + 2(1)^{2} = 5 + 4 + 2 = 11$$

Now in the eigenbasis. The components of $(1,1)$ along the two normalised
eigenvectors are

$$c_{1} = \\frac{(1,1)\\cdot(2,1)}{\\sqrt{5}} = \\frac{3}{\\sqrt{5}}, \\qquad c_{2} = \\frac{(1,1)\\cdot(1,-2)}{\\sqrt{5}} = \\frac{-1}{\\sqrt{5}}$$

In that basis the form is diagonal, so it is just a weighted sum of squares with
the eigenvalues as weights:

$$q = \\lambda_{1}c_{1}^{2} + \\lambda_{2}c_{2}^{2} = 6\\left(\\tfrac{9}{5}\\right) + 1\\left(\\tfrac{1}{5}\\right) = \\frac{54 + 1}{5} = 11$$

The two agree. The second route is the more informative one: it says the
quadratic form is nothing but a stretch along the eigenvector directions, with
the eigenvalues as the stretch factors.

## 14.5 Definiteness, and why circuit matrices are well behaved

| Sign of every eigenvalue | Name | Meaning of $\\mathbf{x}^{T}A\\mathbf{x}$ |
|---|---|---|
| all positive | positive definite | strictly positive except at the origin |
| all non-negative | positive semidefinite | never negative, but can vanish |
| mixed signs | indefinite | takes both signs |
| all negative | negative definite | strictly negative except at the origin |

A conductance matrix assembled from positive resistors, with a reference node
chosen, is symmetric and positive definite. That single fact settles several
questions at once: its determinant is positive so it is invertible, its
eigenvalues are real and positive so the nodal system is uniquely solvable, and
the quadratic form $\\mathbf{V}^{T}G\\mathbf{V}$ is the power dissipated, which
must be positive for a passive network. The mathematics and the physics are
saying the same thing.

Losing the reference node makes the matrix positive **semi**definite instead:
the all-ones vector produces zero power, because shifting every node voltage
equally dissipates nothing. That null direction is exactly the singularity found
in the previous chapter, now with a physical reading.`,
  examTip: 'Symmetry is worth checking before doing anything else with a matrix. If it is symmetric, the eigenvalues are real, the eigenvectors are orthogonal, and the inverse of the eigenvector matrix is its transpose, which removes the single most error-prone step in the whole calculation.',
  importantNote: 'The off-diagonal entry of a symmetric matrix appears TWICE in its quadratic form. The matrix with 2 in both off-diagonal slots gives the cross term 4xy, not 2xy, and halving it is the standard error when converting a quadratic form back into a matrix.',
},
{
  id: 'la-applications',
  title: '15. Where the FE Uses It: Mesh, Nodal and Least Squares',
  content: `## 15.1 Mesh analysis in matrix form

For a planar network of resistors and voltage sources, mesh analysis produces a
symmetric system $R\\mathbf{I} = \\mathbf{V}$ built by inspection:

- $R_{kk}$ is the sum of every resistance around mesh $k$
- $R_{jk}$ is minus the resistance shared between meshes $j$ and $k$
- $V_{k}$ is the net source rise driving mesh $k$

The minus signs on the off-diagonal are not a convention to memorise; they come
from the neighbouring mesh current flowing the opposite way through the shared
branch.

### 15.2 Worked example: two meshes, by inspection and by Cramer

Mesh 1 contains a 6 ohm resistor and a 4 ohm resistor shared with mesh 2, driven
by 16 V. Mesh 2 contains that same 4 ohm resistor and an 8 ohm resistor, driven
by 4 V.

$$\\begin{bmatrix} 10 & -4 \\\\ -4 & 12\\end{bmatrix}\\begin{bmatrix} I_{1} \\\\ I_{2}\\end{bmatrix} = \\begin{bmatrix} 16 \\\\ 4\\end{bmatrix}, \\qquad \\lvert R\\rvert = 120 - 16 = 104$$

$$I_{1} = \\frac{1}{104}\\begin{vmatrix} 16 & -4 \\\\ 4 & 12\\end{vmatrix} = \\frac{192 + 16}{104} = \\frac{208}{104} = 2\\ \\mathrm{A}$$
$$I_{2} = \\frac{1}{104}\\begin{vmatrix} 10 & 16 \\\\ -4 & 4\\end{vmatrix} = \\frac{40 + 64}{104} = \\frac{104}{104} = 1\\ \\mathrm{A}$$

Check against the physical circuit rather than against the algebra. Mesh 1:
$6(2) + 4(2 - 1) = 12 + 4 = 16$, matching its source. Mesh 2:
$8(1) + 4(1 - 2) = 8 - 4 = 4$, matching its source. The shared branch carries
$I_{1} - I_{2} = 1\\ \\mathrm{A}$, which is why it contributes 4 V to one loop
and $-4$ V to the other.

### 15.3 Worked example: three nodes, and a matrix that is its own diagram

Nodal analysis builds $G\\mathbf{V} = \\mathbf{I}$ by the mirror-image rule:
$G_{kk}$ sums every conductance touching node $k$, $G_{jk}$ is minus the
conductance directly between nodes $j$ and $k$, and $I_{k}$ is the current
injected into node $k$.

$$\\begin{bmatrix} 7 & -2 & -1 \\\\ -2 & 6 & -3 \\\\ -1 & -3 & 9\\end{bmatrix}\\begin{bmatrix} V_{1} \\\\ V_{2} \\\\ V_{3}\\end{bmatrix} = \\begin{bmatrix} 7 \\\\ 11 \\\\ -2\\end{bmatrix}$$

The matrix is readable as a wiring diagram. The off-diagonals say the three
nodes are joined by 2, 1 and 3 siemens, and each diagonal must then account for
the rest: node 1 has $7 - 2 - 1 = 4$ siemens to ground, node 2 has
$6 - 2 - 3 = 1$, and node 3 has $9 - 1 - 3 = 5$. Every one is positive, so the
network is physically realisable.

Elimination in the previous section gave $\\mathbf{V} = (2, 3, 1)$ volts.
Confirm it at the nodes, which is a stronger check than re-running the algebra:

$$4(2) + 2(2 - 3) + 1(2 - 1) = 8 - 2 + 1 = 7$$
$$1(3) + 2(3 - 2) + 3(3 - 1) = 3 + 2 + 6 = 11$$
$$5(1) + 1(1 - 2) + 3(1 - 3) = 5 - 1 - 6 = -2$$

All three injected currents are reproduced, so Kirchhoff's current law holds at
every node and the solution is right.

## 15.4 Least squares, and what "best fit" means

When a system has more equations than unknowns it usually has no exact solution:
$A\\mathbf{x} = \\mathbf{b}$ with $\\mathbf{b}$ outside the column space. The least
squares answer is the $\\mathbf{x}$ making the residual
$\\mathbf{r} = \\mathbf{b} - A\\mathbf{x}$ as short as possible, and the condition
for that is geometric. The residual is shortest when it is **perpendicular** to
everything reachable, that is to every column of $A$:

$$A^{T}\\mathbf{r} = \\mathbf{0} \\quad\\Longrightarrow\\quad A^{T}A\\mathbf{x} = A^{T}\\mathbf{b}$$

Those are the **normal equations**. The matrix $A^{T}A$ is square, symmetric, and
positive definite whenever the columns of $A$ are independent, so the system has
exactly one solution.

### 15.5 Worked example: a straight line through five points

Fit $y = a + bx$ to $(1, 2.1)$, $(2, 3.9)$, $(3, 6.2)$, $(4, 7.8)$ and
$(5, 10.1)$. With a column of ones and a column of $x$ values,

$$A^{T}A = \\begin{bmatrix} 5 & 15 \\\\ 15 & 55\\end{bmatrix}, \\qquad A^{T}\\mathbf{b} = \\begin{bmatrix} 30.1 \\\\ 110.2\\end{bmatrix}, \\qquad \\lvert A^{T}A\\rvert = 275 - 225 = 50$$

The four sums are $n = 5$, $\\sum x = 15$, $\\sum x^{2} = 55$ and
$\\sum xy = 110.2$, with $\\sum y = 30.1$. Solving by Cramer,

$$a = \\frac{30.1 \\times 55 - 15 \\times 110.2}{50}, \\qquad 30.1 \\times 55 = 1655.5, \\qquad 15 \\times 110.2 = 1653$$
$$a = \\frac{1655.5 - 1653}{50} = \\frac{2.5}{50} = 0.05$$
$$b = \\frac{5 \\times 110.2 - 15 \\times 30.1}{50}, \\qquad 5 \\times 110.2 = 551, \\qquad 15 \\times 30.1 = 451.5$$
$$b = \\frac{551 - 451.5}{50} = \\frac{99.5}{50} = 1.99$$

so the fit is $y = 0.05 + 1.99x$. The same coefficients come out of a QR
factorisation and out of a general least-squares routine, to nine decimal
places, which is the independent confirmation.

![Two stacked panels sharing an x-axis. The upper panel shows five data points with the fitted line y equals zero point zero five plus one point nine nine x. The lower panel shows the five residuals on their own much smaller scale, alternating in sign about zero.](/courses/fe-ee/figures/math4-la-least-squares.svg)

### 15.6 Worked example: checking the fit without refitting it

The residuals are the measured values minus the fitted ones:

$$\\mathbf{r} = (0.06,\\ -0.13,\\ 0.18,\\ -0.21,\\ 0.10)$$

The two normal equations, written out, say exactly that the residuals sum to
zero and that they are uncorrelated with $x$:

$$\\sum r_{i} = 0.06 - 0.13 + 0.18 - 0.21 + 0.10 = 0$$
$$\\sum x_{i}r_{i} = 0.06 - 0.26 + 0.54 - 0.84 + 0.50 = 0$$

Both hold exactly, which certifies the fit without repeating it. The sum of
squared residuals is

$$\\sum r_{i}^{2} = 0.0036 + 0.0169 + 0.0324 + 0.0441 + 0.0100 = 0.1070$$

and no other straight line through this data can make it smaller. That is the
meaning of "least squares", and the orthogonality conditions are how it is
verified: not by trying other lines, but by confirming that the error has no
component left in any direction the model could have used.`,
  examTip: 'Build the mesh or nodal matrix straight from the circuit: diagonal entries sum everything touching that loop or node, off-diagonal entries are minus the shared element, and both matrices come out symmetric. If yours is not symmetric, a shared element has been entered on one side only.',
  importantNote: 'Least squares makes the residuals ORTHOGONAL to the model, not individually small. A fit with a few large residuals can still be optimal, and the correct test is that the residuals sum to zero and have zero dot product with each column of the design matrix.',
},
{
  id: 'la-set-b',
  title: '16. Problem Set: Arithmetic, Determinants and Inverses',
  content: `## 16.1 Problem Set A

**A1.** For $A = \\begin{bmatrix} 2 & 0 \\\\ 1 & 3\\end{bmatrix}$ and
$B = \\begin{bmatrix} 1 & 4 \\\\ 2 & 0\\end{bmatrix}$, find $AB$ and $BA$.

$$AB = \\begin{bmatrix} 2 & 8 \\\\ 7 & 4\\end{bmatrix}, \\qquad BA = \\begin{bmatrix} 6 & 12 \\\\ 4 & 0\\end{bmatrix}$$

Every entry differs, yet the traces agree at $2 + 4 = 6$ and $6 + 0 = 6$, as
they must.

**Trap.** Reporting $AB$ for both. Matrix multiplication is associative and
distributive but not commutative, and the two products here share nothing except
their trace and their determinant.

**A2.** Find the determinant of
$\\begin{bmatrix} 4 & -2 & 1 \\\\ 0 & 3 & 5 \\\\ 2 & 1 & -3\\end{bmatrix}$.

Expanding along the first row with the sign pattern plus, minus, plus:

$$4(3 \\times (-3) - 5 \\times 1) - (-2)(0 \\times (-3) - 5 \\times 2) + 1(0 \\times 1 - 3 \\times 2)$$
$$= 4(-14) + 2(-10) + 1(-6) = -56 - 20 - 6 = -82$$

Row reduction confirms it: clearing the first column leaves pivots
$4$, $3$ and $-6.833333$, whose product is $-82$.

**Trap.** Dropping the alternating sign on the middle cofactor gives
$-56 + 20 - 6 = -42$. The sign belongs to the position, $(-1)^{i+j}$, and it is
applied before the entry's own sign, so a negative entry in a minus position
contributes positively.

**A3.** Invert $\\begin{bmatrix} 3 & 1 \\\\ 5 & 2\\end{bmatrix}$.

$$\\lvert A\\rvert = 6 - 5 = 1, \\qquad A^{-1} = \\begin{bmatrix} 2 & -1 \\\\ -5 & 3\\end{bmatrix}$$

Check: $3(2) + 1(-5) = 1$ and $3(-1) + 1(3) = 0$, so the first row of the
product is $(1, 0)$; the second row gives $(0, 1)$ the same way.

**Trap.** Negating the off-diagonal without swapping the diagonal gives
$\\begin{bmatrix} 3 & -1 \\\\ -5 & 2\\end{bmatrix}$, whose product with $A$ has
first entry $3(3) + 1(-5) = 4$ rather than 1. The swap and the negation are two
separate steps and both are required.

**A4.** Solve $4x + 3y = 18$ and $2x - y = 4$ by Cramer's rule.

$$\\lvert A\\rvert = 4(-1) - 3(2) = -10$$
$$x = \\frac{1}{-10}\\begin{vmatrix} 18 & 3 \\\\ 4 & -1\\end{vmatrix} = \\frac{-18 - 12}{-10} = 3, \\qquad y = \\frac{1}{-10}\\begin{vmatrix} 4 & 18 \\\\ 2 & 4\\end{vmatrix} = \\frac{16 - 36}{-10} = 2$$

Substituting back, $4(3) + 3(2) = 18$ and $2(3) - 2 = 4$.

**Trap.** Replacing a **row** with the right-hand side instead of a column. That
gives $\\begin{vmatrix} 18 & 4 \\\\ 2 & -1\\end{vmatrix} = -26$ and
$x = 2.6$, which fails the substitution check immediately. Cramer replaces the
column belonging to the unknown being solved for.

**A5.** A $3\\times 3$ matrix has $\\lvert A\\rvert = 6$. Give
$\\lvert 2A\\rvert$, $\\lvert A^{T}\\rvert$, $\\lvert A^{-1}\\rvert$ and
$\\lvert A^{2}\\rvert$.

$$\\lvert 2A\\rvert = 2^{3} \\times 6 = 48, \\qquad \\lvert A^{T}\\rvert = 6, \\qquad \\lvert A^{-1}\\rvert = \\tfrac{1}{6}, \\qquad \\lvert A^{2}\\rvert = 36$$

**Trap.** Answering 12 for the first, by treating the scalar as multiplying the
determinant once. Doubling the matrix doubles all three rows, and the
determinant is linear in each row separately, so the factor is $2^{3}$. On a
$4\\times 4$ it would be 16.

## 16.2 Practice Problems: reading a matrix for structure

For each statement, decide whether it is true for **all** square matrices.

**(i)** $\\lvert A + B\\rvert = \\lvert A\\rvert + \\lvert B\\rvert$.

False. Take $A = I$ and $B = I$ in two dimensions: the left side is
$\\lvert 2I\\rvert = 4$ while the right side is $1 + 1 = 2$. The determinant is
multiplicative, never additive.

**(ii)** $\\lvert AB\\rvert = \\lvert BA\\rvert$.

True, and it holds even though $AB \\ne BA$, because both equal
$\\lvert A\\rvert\\,\\lvert B\\rvert$ and scalars do commute.

**(iii)** If $A$ is invertible then $A^{T}$ is invertible.

True. $\\lvert A^{T}\\rvert = \\lvert A\\rvert \\ne 0$, and in fact
$(A^{T})^{-1} = (A^{-1})^{T}$.`,
},
{
  id: 'la-set-c',
  title: '17. Problem Set: Rank, Eigenvalues and Powers',
  content: `## 17.1 Problem Set B

**B1.** Give the rank, the nullity and a null vector of
$\\begin{bmatrix} 1 & 3 & 2 \\\\ 2 & 6 & 4 \\\\ 1 & 0 & 5\\end{bmatrix}$.

Row two is twice row one, so it clears to zero. Row three minus row one is
$(0, -3, 3)$:

$$\\begin{bmatrix} 1 & 3 & 2 \\\\ 0 & -3 & 3 \\\\ 0 & 0 & 0\\end{bmatrix}$$

Two pivots, so the rank is 2 and the nullity is $3 - 2 = 1$. Setting $z = 1$
gives $y = 1$ from the second row and then $x + 3 + 2 = 0$, so $x = -5$. The
null vector is $(-5, 1, 1)$, and multiplying confirms it:
$-5 + 3 + 2 = 0$, $-10 + 6 + 4 = 0$, $-5 + 0 + 5 = 0$.

**Trap.** Counting the rank as 3 because no row of the original matrix is zero.
Rank counts **independent** rows, not non-zero ones, and the dependence here is
only visible after reduction.

**B2.** Find the eigenvalues and eigenvectors of
$\\begin{bmatrix} 6 & -2 \\\\ -2 & 9\\end{bmatrix}$.

$$\\operatorname{tr} = 15, \\qquad \\lvert A\\rvert = 54 - 4 = 50, \\qquad \\lambda^{2} - 15\\lambda + 50 = 0$$

$$\\lambda = \\frac{15 \\pm \\sqrt{225 - 200}}{2} = \\frac{15 \\pm 5}{2} = 10,\\ 5$$

For $\\lambda = 10$: $-4v_{1} - 2v_{2} = 0$, so $\\mathbf{v} = (1, -2)$, and
$A(1,-2) = (10, -20)$ confirms it. For $\\lambda = 5$:
$v_{1} - 2v_{2} = 0$, so $\\mathbf{v} = (2, 1)$, and $A(2,1) = (10, 5)$ confirms
it. The matrix is symmetric, so the two eigenvectors must be orthogonal, and
$(1)(2) + (-2)(1) = 0$.

**Trap.** Writing the characteristic equation as
$\\lambda^{2} + 15\\lambda + 50 = 0$ and reporting $-10$ and $-5$. The trace
enters with a minus sign. Here the error would also declare a positive definite
matrix to be negative definite, reversing every conclusion that follows.

**B3.** Find $A^{4}$ for $A = \\begin{bmatrix} 3 & 0 \\\\ 1 & 2\\end{bmatrix}$.

The matrix is triangular, so the eigenvalues are 3 and 2. For $\\lambda = 3$ the
equation $v_{1} = v_{2}$ gives $(1,1)$; for $\\lambda = 2$ the first row forces
$v_{1} = 0$, giving $(0,1)$. Then

$$P = \\begin{bmatrix} 1 & 0 \\\\ 1 & 1\\end{bmatrix}, \\qquad P^{-1} = \\begin{bmatrix} 1 & 0 \\\\ -1 & 1\\end{bmatrix}, \\qquad A^{4} = P\\begin{bmatrix} 81 & 0 \\\\ 0 & 16\\end{bmatrix}P^{-1} = \\begin{bmatrix} 81 & 0 \\\\ 65 & 16\\end{bmatrix}$$

Squaring twice by hand agrees: $A^{2} = \\begin{bmatrix} 9 & 0 \\\\ 5 & 4\\end{bmatrix}$
and squaring that gives the same result, with lower-left entry
$45 + 20 = 65$.

**Trap.** Raising each entry to the fourth power gives
$\\begin{bmatrix} 81 & 0 \\\\ 1 & 16\\end{bmatrix}$. The diagonal happens to be
right, which is what makes this error survive a quick glance; the off-diagonal
is wrong by a factor of 65.

**B4.** Is $\\begin{bmatrix} 5 & 1 \\\\ 0 & 5\\end{bmatrix}$ diagonalisable? Give
its cube.

The eigenvalue 5 is repeated, and $A - 5I = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0\\end{bmatrix}$
forces $v_{2} = 0$, so the only eigenvector direction is $(1, 0)$. One
independent eigenvector for a multiplicity of two means the matrix is
**defective** and cannot be diagonalised. Its powers follow the pattern for a
repeated eigenvalue:

$$A^{k} = \\begin{bmatrix} 5^{k} & k\\,5^{k-1} \\\\ 0 & 5^{k}\\end{bmatrix}, \\qquad A^{3} = \\begin{bmatrix} 125 & 75 \\\\ 0 & 125\\end{bmatrix}$$

Direct multiplication agrees: $A^{2} = \\begin{bmatrix} 25 & 10 \\\\ 0 & 25\\end{bmatrix}$
and one more multiplication gives $50 + 25 = 75$ in the corner.

**Trap.** Assuming a repeated eigenvalue is enough for diagonalisation and
writing $A^{3} = \\begin{bmatrix} 125 & 0 \\\\ 0 & 125\\end{bmatrix}$. A repeated
eigenvalue is permitted; what matters is whether it supplies as many independent
eigenvectors as its multiplicity, and here it supplies one instead of two.

**B5.** Is the system $\\dot{\\mathbf{x}} = A\\mathbf{x}$ stable for
$A = \\begin{bmatrix} -1 & 4 \\\\ -2 & -3\\end{bmatrix}$?

$$\\operatorname{tr} = -4, \\qquad \\lvert A\\rvert = 3 + 8 = 11, \\qquad \\lambda^{2} + 4\\lambda + 11 = 0$$

$$\\lambda = \\frac{-4 \\pm \\sqrt{16 - 44}}{2} = -2 \\pm j\\,\\frac{\\sqrt{28}}{2} = -2 \\pm j\\,2.6458$$

Both eigenvalues have real part $-2$, which is negative, so the system is
**stable** and its modes decay while oscillating at 2.6458 rad/s.

**Trap.** Calling a complex pair "marginally stable" on sight. Only a purely
imaginary pair, with real part exactly zero, is marginal. Complex simply means
oscillation; the real part alone decides whether the oscillation grows or dies.`,
},
{
  id: 'la-set-d',
  title: '18. Problem Set: Circuits, Fitting and Singular Models',
  content: `## 18.1 Problem Set C

**C1.** A two-mesh network has a 6 ohm resistor in mesh 1 only, an 8 ohm
resistor in mesh 2 only, and a 4 ohm resistor shared. The sources drive 16 V
around mesh 1 and 4 V around mesh 2. Find both mesh currents.

$$\\begin{bmatrix} 10 & -4 \\\\ -4 & 12\\end{bmatrix}\\begin{bmatrix} I_{1} \\\\ I_{2}\\end{bmatrix} = \\begin{bmatrix} 16 \\\\ 4\\end{bmatrix}, \\qquad \\lvert R\\rvert = 120 - 16 = 104$$

$$I_{1} = \\frac{192 + 16}{104} = 2\\ \\mathrm{A}, \\qquad I_{2} = \\frac{40 + 64}{104} = 1\\ \\mathrm{A}$$

**Trap.** Entering the shared resistance as $+4$ on the off-diagonal. The
determinant happens to stay 104, so nothing looks wrong, but the first
determinant becomes $192 - 16 = 176$ and $I_{1} = 176/104 = 1.6923$. Since mesh
currents are defined circulating the same way, the neighbouring current traverses
the shared branch backwards, and the coupling term is always negative.

**C2.** Verify that $\\mathbf{V} = (2, 3, 1)$ solves the nodal system with
conductance matrix $\\begin{bmatrix} 7 & -2 & -1 \\\\ -2 & 6 & -3 \\\\ -1 & -3 & 9\\end{bmatrix}$
and injection vector $(7, 11, -2)$.

Multiply row by row:

$$7(2) - 2(3) - 1(1) = 14 - 6 - 1 = 7$$
$$-2(2) + 6(3) - 3(1) = -4 + 18 - 3 = 11$$
$$-1(2) - 3(3) + 9(1) = -2 - 9 + 9 = -2$$

All three match, so the solution is confirmed without solving anything.

**Trap.** Checking only the first equation. A wrong vector will often satisfy one
row by luck; the verification is only complete when every row reproduces its
right-hand entry.

**C3.** Fit a straight line through $(1, 2.1)$, $(2, 3.9)$, $(3, 6.2)$,
$(4, 7.8)$, $(5, 10.1)$, then fit a line through the origin, and compare.

The two-parameter fit was found in the previous section:
$y = 0.05 + 1.99x$, with $\\sum r^{2} = 0.1070$.

Forcing the intercept to zero leaves one unknown, and the single normal equation
is $b\\sum x^{2} = \\sum xy$:

$$b = \\frac{110.2}{55} = 2.0036$$

Its residuals are $0.0964$, $-0.1073$, $0.1891$, $-0.2145$ and $0.0818$, giving
$\\sum r^{2} = 0.1093$.

The constrained fit is worse, as it must be: it is a special case of the free
fit, so it cannot do better. Its residuals also no longer sum to zero, because
the normal equation that enforced that condition belonged to the intercept and
has been removed.

**Trap.** Reporting the through-origin slope as the "true" slope because it looks
tidier. Removing a parameter can only increase the sum of squares; the question
of which model to use is about physics, not about which number is rounder.

**C4.** A least-squares line has residuals $0.06$, $-0.13$, $0.18$, $-0.21$ and
$0.10$ at $x = 1$ through 5. Confirm the fit is optimal.

$$\\sum r_{i} = 0.06 - 0.13 + 0.18 - 0.21 + 0.10 = 0$$
$$\\sum x_{i}r_{i} = 0.06 - 0.26 + 0.54 - 0.84 + 0.50 = 0$$

Both normal equations hold, so no adjustment of intercept or slope can shorten
the residual vector, and the fit is optimal.

**Trap.** Checking only that the residuals sum to zero. Any line through the
centroid of the data satisfies that, whatever its slope. The second condition,
orthogonality to the $x$ column, is what fixes the slope, and both are needed.

**C5.** A nodal analysis produces the conductance matrix
$\\begin{bmatrix} 3 & -3 \\\\ -3 & 3\\end{bmatrix}$. What is wrong with the model?

$$\\lvert G\\rvert = 9 - 9 = 0$$

The matrix is singular, and its null vector is $(1, 1)$:
$3(1) - 3(1) = 0$ in both rows. A null direction of all ones means every node
voltage can be raised by the same amount with no change to any branch current,
which is the signature of a network with **no reference node**. The two nodes
are joined to each other by 3 siemens and to nothing else, so only their
difference is determined.

**Trap.** Concluding that the circuit has infinite voltages or that the
arithmetic went wrong. Neither is true: the equations are consistent but
under-determined, and the fix is to ground one node, which deletes a row and a
column and restores an invertible matrix.

## 18.2 Practice Problems: one condition, five names

A square matrix $A$ satisfies $\\lvert A\\rvert \\ne 0$. State four other things
that follow, and give the one-line reason for each.

**Invertible.** $A^{-1} = \\operatorname{adj}(A)/\\lvert A\\rvert$ exists because
the division is legal.

**Full rank.** Elimination reaches $n$ non-zero pivots, since their product is
the determinant.

**Independent columns.** A dependent set could be reduced to a zero row, forcing
the determinant to zero.

**Unique solution for every right-hand side.** The nullity is
$n - n = 0$, so no vector can be added to a solution without changing it, and
the column space is all of $\\mathbb{R}^{n}$, so every $\\mathbf{b}$ is
reachable.

A fifth follows for the eigenvalues: their product is $\\lvert A\\rvert$, so a
non-zero determinant means **no eigenvalue is zero**. Every one of these is the
same statement about the same matrix, and recognising that a question is asking
for one of them in disguise is usually faster than any computation.`,
},
],
  keyTakeaways: [
    'Determinant for 2×2: det = ad - bc; non-zero means invertible.',
    'Eigenvalue equation Ax = λx; eigenvalues found from det(A-λI) = 0.',
    'All eigenvalues with negative real parts → stable system.',
    'Matrix multiplication is associative but NOT commutative.',
  ],
},

fee_vector_analysis: {
  topicId: 'fee_vector_analysis',
  title: 'Vector Analysis (with a Laplace Refresher)',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'Vector analysis is the language every field problem on this exam is written in: the two products and what each measures, gradient, divergence and curl built from the limits that define them, line and surface integrals, and the three integral theorems that connect them. A short Laplace refresher stays for continuity — the full treatment lives in the Differential Equations chapter and in Linear Systems.',
  sections: [
    {
      id: 'va-laplace',
      title: '1. Laplace Transform',
      content: `## 1.1 Definition and Key Transform Pairs

The Laplace transform: **$F(s) = \\int _{0}^\\infty f(t)\\cdot e^{-st}dt$** where s = σ + jω

### Essential Transform Pairs

| f(t) | F(s) |
|---|---|
| 1 (unit step) | 1/s |
| t | $1/s^{2}$ |
| $t^n$ | $n!/s^{n+1}$ |
| $e^{-at}$ | 1/(s+a) |
| $\\sin (\\omega t)$ | $\\omega /(s^{2}+\\omega ^{2})$ |
| $\\cos (\\omega t)$ | $s/(s^{2}+\\omega ^{2})$ |
| $e^{-at}\\cdot \\sin (\\omega t)$ | $\\omega /[(s+a)^{2}+\\omega ^{2}]$ |
| $e^{-at}\\cdot \\cos (\\omega t)$ | $(s+a)/[(s+a)^{2}+\\omega ^{2}]$ |

### Key Properties

- **Linearity**: L{af + bg} = aF(s) + bG(s)
- **Frequency shift**: L{e^(-at)f(t)} = F(s+a)
- **Derivative**: L{f'(t)} = sF(s) - f($0^{-}$)
- **Integral**: L{∫f(t)dt} = F(s)/s
- **Convolution**: L{f*g} = F(s)·G(s)

## 1.2 Value Theorems

- **Initial Value Theorem**: lim(t→$0^{+}$) f(t) = lim(s→∞) sF(s)
- **Final Value Theorem**: lim(t→∞) f(t) = lim(s→0) sF(s)

The Final Value Theorem finds steady-state WITHOUT inverse transforming — a major time-saver.`,
      examTip: 'The FE reference handbook has the Laplace transform table, but knowing the common pairs cold saves time. Most important: e^(-at) → 1/(s+a), sin(ωt) → ω/(s²+ω²), and the derivative property sF(s)-f(0). The Final Value Theorem is tested frequently — remember it only works if all poles of sF(s) are in the LHP.',
      importantNote: 'The Final Value Theorem gives WRONG answers if the system is unstable or has poles on the imaginary axis (except at origin). Always verify that sF(s) has all poles in the left half-plane before applying it.',
    },
    {
      id: 'va-vectors',
      title: '2. Vector Calculus for Electromagnetics',
      content: `## 2.1 Vector Operations

- **Dot product**: $\\mathbf{A}\\cdot\\mathbf{B} = \\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert\\cos\\theta = A_{x}B_{x} + A_{y}B_{y} + A_{z}B_{z}$ (scalar result)
- **Cross product**: $\\lvert \\mathbf{A}\\times\\mathbf{B}\\rvert = \\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert\\sin\\theta$ (vector result, direction by right-hand rule)

The dot product tests perpendicularity (A·B = 0 if perpendicular).
The cross product finds the area of the parallelogram and the normal direction.

## 2.2 Vector Calculus Operators

| Operator | Formula | Physical Meaning |
|---|---|---|
| **Gradient** ∇f | $(\\partial f/\\partial x)i + (\\partial f/\\partial y)j + (\\partial f/\\partial z)k$ | Direction of steepest increase |
| **Divergence** ∇·F | $\\partial Fx/\\partial x + \\partial Fy/\\partial y + \\partial Fz/\\partial z$ | Net outflow from a point |
| **Curl** ∇×F | (see determinant formula) | Rotation/circulation of field |

### Applications in Electromagnetics

- **$\\nabla V = -E$** (electric field is negative gradient of potential)
- **$\\nabla \\cdot E = \\rho /\\varepsilon _{0}$** (Gauss's law — charge creates divergence in E)
- **$\\nabla \\cdot B = 0$** (no magnetic monopoles — B has zero divergence)
- **$\\nabla \\times E = -\\partial B/\\partial t$** (Faraday's law — changing B creates curl in E)
- **$\\nabla \\times B = \\mu _{0}J + \\mu _{0}\\varepsilon _{0}\\partial E/\\partial t$** (Ampere-Maxwell law)

## 2.3 Integral Theorems

- **Divergence theorem**: ∮F·dA = ∫∫∫(∇·F)dV (surface flux = volume divergence)
- **Stokes' theorem**: ∮F·dl = ∫∫(∇×F)·dA (line circulation = surface curl)`,
      examTip: 'For the FE exam: gradient points toward increasing potential, divergence measures source strength (charge density in E-fields), curl measures circulation (current density in B-fields). Know that ∇·B = 0 always (no magnetic monopoles) and ∇×E = 0 for electrostatics (conservative field).',
    },
    {
      id: 'va-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Dot and cross, and what each is for

A = 3i + 4j and B = 2i - j.

**Dot** (scalar, measures alignment): A.B = (3)(2) + (4)(-1) = 6 - 4 = **2**. Since A.B = |A||B|cos(theta), and |A| = 5, |B| = 2.24, cos(theta) = 2/11.2 = 0.179, so theta = **79.7 degrees**.

**Cross** (vector, measures perpendicularity, right-hand rule): the k component of $\\mathbf{A}\\times\\mathbf{B}$ is $(3)(-1) - (4)(2) = -11$, so $\\mathbf{A}\\times\\mathbf{B} = -11\\,\\mathbf{k}$. The magnitude 11 equals $\\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert\\sin\\theta = 5(2.236)(0.9839) = 11.0$. Consistent.

Which to use, in physical terms: **work and power are dot products** ($W = \\mathbf{F}\\cdot\\mathbf{d}$, and P = VI cos θ in the phasor sense), while **forces and torques are cross products** ($\\mathbf{F} = q\\,\\mathbf{v}\\times\\mathbf{B}$, $\\boldsymbol{\\tau} = \\mathbf{r}\\times\\mathbf{F}$). If the answer should be a number, use dot; if it should be a direction, use cross.

## 3.2 The three operators

- **grad f** turns a scalar into a vector pointing uphill. For f = x^2 + 3yz: grad f = 2x i + 3z j + 3y k. Electric field is E = -grad V, and the minus sign is why the field points from high to low potential.
- **div F** turns a vector into a scalar measuring net outflow. For F = x i + y^2 j: div F = 1 + 2y. Gauss's law in differential form is div D = rho.
- **curl F** turns a vector into a vector measuring circulation. Faraday is curl E = -dB/dt.

Two identities that answer questions on their own: **curl(grad f) = 0** always, and **div(curl F) = 0** always. The first is why a conservative field has a potential; the second is why div B = 0 follows from B = curl A.

## 3.3 Line integral for work

Move along the straight path from (0,0) to (2,4) in the field F = y i + x j. Parametrise x = 2t, y = 4t for t from 0 to 1. Then dx = 2 dt, dy = 4 dt, and

$$F.dr = y dx + x dy = (4t)(2 dt) + (2t)(4 dt) = 16t dt$$

Integral from 0 to 1: 16(1/2) = **8**.

Note that curl F = (d/dx)(x) - (d/dy)(y) = 1 - 1 = 0, so this field is conservative and the answer must be path-independent. Check with a potential: f = xy gives f(2,4) - f(0,0) = 8. Agrees, which is the point of checking curl first.

## 3.4 Flux through a surface

Flux is the integral of $\\mathbf{F}\\cdot\\mathbf{n}$ over the surface. For a uniform field $\\mathbf{F} = 5\\,\\mathbf{k}$ passing through a flat plate 2 m by 3 m lying in the xy plane, $\\mathbf{n} = \\mathbf{k}$ and $\\mathbf{F}\\cdot\\mathbf{n} = 5$, so the flux is $5 \\times 6 = 30$.

Tilt the plate 60 degrees from the xy plane and the normal tilts with it: $\\mathbf{F}\\cdot\\mathbf{n} = 5\\cos 60^\\circ = 2.5$, so the flux is $2.5 \\times 6 = 15$. The cosine factor is the whole of Gauss's-law geometry, and it is why a Gaussian surface is chosen so the field is either parallel or perpendicular to it everywhere.`,
      examTip: 'Test whether a field is conservative by taking its curl BEFORE computing a line integral. If curl F = 0 the integral depends only on the endpoints, and finding the potential function is far quicker than parametrising the path.',
      quiz: [
        {
          question: 'For A = 2i + 3j and B = 4i - j, what is A.B?',
          options: ['5', '11', '-5', '14'],
          correctIndex: 0,
          explanation: 'A.B = (2)(4) + (3)(-1) = 8 - 3 = 5. The dot product multiplies matching components and sums them; the result is a scalar, never a vector. A positive value means the vectors point generally the same way.',
        },
        {
          question: 'Which identity is always true for any well-behaved scalar field f?',
          options: ['curl(grad f) = 0', 'div(grad f) = 0', 'grad(div f) = 0', 'curl(grad f) = grad f'],
          correctIndex: 0,
          explanation: 'The curl of any gradient vanishes identically. This is exactly why an electrostatic field E = -grad V has zero curl, and hence why electrostatic work is path-independent. div(grad f) is the Laplacian, which is generally nonzero.',
        },
        {
          question: 'A uniform field of magnitude 8 passes through a 4 m^2 flat surface whose normal makes 60 degrees with the field. What is the flux?',
          options: ['16', '32', '27.7', '8'],
          correctIndex: 0,
          explanation: 'Flux equals F A cos(theta), which is (8)(4)(cos 60 degrees) = (8)(4)(0.5) = 16. Using sin instead of cos gives 27.7 - the cosine applies because flux depends on the component of the field ALONG the normal.',
        },
      ],
    },
  {
    id: 'va-depth',
    title: '4. Fields, Operators, and the s-Plane',
    content: `## 4.1 Divergence and curl, seen rather than defined
  
  Two operators describe what a vector field does, and they are independent — a
  field can have either, both, or neither:
  
  ![Two vector fields on the same grid. The first points radially outward everywhere and has divergence two with zero curl. The second circulates and has zero divergence with curl two.](/courses/fe-ee/figures/math-div-curl.svg)
  
  **Divergence** measures whether the field is a source or a sink — whether more
  flows out of a small region than in. For **F** = (x, y), every arrow points away
  from the origin and div **F** = ∂x/∂x + ∂y/∂y = 2 everywhere.
  
  **Curl** measures circulation — whether the field would spin a paddle wheel
  placed in it. For **G** = (−y, x), the arrows circulate, and the z-component of
  the curl is $\\partial G_{y}/\\partial x - \\partial G_{x}/\\partial y = 1 - (-1) = 2$,
  while its divergence is 0.
  
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
  | Dot **A**·**B** | scalar | $\\lvert A\\rvert \\lvert B\\rvert \\cos \\theta$ | perpendicular |
  | Cross **A**×**B** | vector | $\\lvert A\\rvert \\lvert B\\rvert \\sin \\theta$, ⊥ to both | parallel |
  
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
  | t | $1/s^{2}$ |
  | $e^{-at}$ | 1/(s+a) |
  | $\\sin  \\omega t$ | $\\omega /(s^{2} + \\omega ^{2})$ |
  | $\\cos  \\omega t$ | $s/(s^{2} + \\omega ^{2})$ |
  | $e^{-at}\\sin  \\omega t$ | $\\omega /((s+a)^{2} + \\omega ^{2})$ |
  | $f'(t)$ | $sF(s) - f(0)$ |
  | $\\int f dt$ | F(s)/s |
  
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
  
  $$sY(s) - 5 + 3Y(s) = 0 \\to Y(s)(s + 3) = 5 \\to Y(s) = 5/(s + 3)$$
  
  Inverting with the table entry for e^(−at):
  
  $$y(t) = 5e^{-3t}$$
  
  Check it: y(0) = 5 ✓, and y′ = −15e^(−3t) = −3y ✓. The pole at s = −3 sits in
  the left half-plane, so the response decays — and its time constant is
  1/3 ≈ 0.33 s, read straight off the pole location without solving anything.`,
    examTip: 'Real part decides stability, imaginary part decides ringing. Any pole with a positive real part means an unstable system, and no amount of favourable behaviour elsewhere changes that. Read the pole locations before doing any other control-systems work.',
    importantNote: 'Work and real power are dot products, which is why P = VI cos theta. Force on a moving charge and torque are cross products, which is why they vanish when the vectors are parallel. Choosing the wrong product gives an answer with the wrong trigonometric function, and both appear among the choices.',
  },
{
  id: 'va-set',
  title: '5. Problem Set: Products and Transforms',
  content: `## 5.1 Dot and cross on the same pair

**A** = 3**i** + 4**j** and **B** = 2**i** − **j**.

Dot: **A**·**B** = (3)(2) + (4)(−1) = 6 − 4 = **2**

Cross (z-component only, since both lie in the xy-plane):

$$\\mathbf{A}\\times\\mathbf{B} = (A_{x}B_{y} - A_{y}B_{x})\\,\\mathbf{k} = \\bigl(3(-1) - 4(2)\\bigr)\\mathbf{k} = -11\\,\\mathbf{k}$$

The angle between them follows from either: |A| = 5, |B| = √5 = 2.236, so
cos θ = 2/(5 × 2.236) = 0.179, giving θ = **$79.7^\\circ$**. Cross-checking with the
cross product: sin θ = 11/(5 × 2.236) = 0.984, θ = 79.7° ✓. Two independent
routes to the same angle.

## 5.2 Divergence and curl of a stated field

**F** = x²**i** + y z**j** + z**k**.

div **F** = ∂(x²)/∂x + ∂(yz)/∂y + ∂(z)/∂z = 2x + z + 1

At the point (1, 2, 3): div **F** = 2 + 3 + 1 = **6**.

The x-component of the curl is $\\partial F_{z}/\\partial y - \\partial F_{y}/\\partial z = 0 - y = -y$,
which at that point is **$-2$**. A field can have both a divergence and a curl; they are
independent measurements, not alternatives.

## 5.3 Inverse transform by partial fractions

Find the inverse transform of F(s) = 10/(s(s + 5)).

Split it: 10/(s(s+5)) = A/s + B/(s+5). Multiplying through, 10 = A(s+5) + Bs.
Setting s = 0 gives A = 2; setting s = −5 gives 10 = −5B, so B = −2.

$$F(s) = 2/s - 2/(s+5) \\to f(t) = 2 - 2e^{-5t}$$

Check the endpoints: f(0) = 0 and f(∞) = 2, matching the initial- and
final-value theorems applied to F(s) directly — lim(s→∞) sF(s) = 0 and
lim(s→0) sF(s) = 10/5 = 2 ✓.

## 5.4 Reading a time constant off a pole

A system has poles at s = −4 ± j3.

The envelope decays as e^(−4t), so τ = 1/4 = **0.25 s** and the response settles
in roughly 5τ = 1.25 s. It rings at 3 rad/s, i.e. 3/(2π) = **0.477 Hz**. Both
numbers come straight from the pole coordinates with no inverse transform
required — which is the practical reason control engineers work in the s-plane
at all.`,
},
{
  id: 'va-products-depth',
  title: '6. Vectors, and What Each Product Measures',
  content: `## 6.1 A vector is three numbers plus an agreement

Written in components against three fixed perpendicular directions, a vector in
space is

$$\\mathbf{A} = A_{x}\\mathbf{i} + A_{y}\\mathbf{j} + A_{z}\\mathbf{k}$$

and Pythagoras applied twice — once in the base plane, once out of it — gives
its length:

$$\\lvert \\mathbf{A}\\rvert = \\sqrt{A_{x}^{2} + A_{y}^{2} + A_{z}^{2}}$$

Dividing a vector by its own length leaves the direction and discards the size,
which is what a unit vector is for:

$$\\hat{\\mathbf{a}} = \\frac{\\mathbf{A}}{\\lvert \\mathbf{A}\\rvert}, \\qquad \\lvert \\hat{\\mathbf{a}}\\rvert = 1$$

Addition and scaling act one component at a time, so nothing new has to be
learned for them. What is genuinely new is that there are **two** ways to
multiply vectors, they return different kinds of object, and each one measures
something a problem might actually be asking for.

The pair used throughout this section is

$$\\mathbf{A} = 3\\mathbf{i} - 2\\mathbf{j} + 6\\mathbf{k}, \\qquad \\mathbf{B} = 2\\mathbf{i} + 3\\mathbf{j} + 6\\mathbf{k}$$

chosen because both have length exactly 7: $9 + 4 + 36 = 49$ and
$4 + 9 + 36 = 49$. Every number below is a consequence of those six components
and nothing else.

## 6.2 The dot product, and why its two definitions agree

The component definition is a sum of matched products, and the answer is a
plain number:

$$\\mathbf{A}\\cdot\\mathbf{B} = A_{x}B_{x} + A_{y}B_{y} + A_{z}B_{z}$$

The geometric definition looks unrelated:

$$\\mathbf{A}\\cdot\\mathbf{B} = \\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert\\cos\\theta$$

They agree, and the law of cosines is the reason. Put the two vectors tail to
tail; the third side of the triangle is $\\mathbf{A} - \\mathbf{B}$, and the law of
cosines says

$$\\lvert \\mathbf{A} - \\mathbf{B}\\rvert^{2} = \\lvert \\mathbf{A}\\rvert^{2} + \\lvert \\mathbf{B}\\rvert^{2} - 2\\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert\\cos\\theta$$

Expanding the same left-hand side in components instead gives

$$\\lvert \\mathbf{A} - \\mathbf{B}\\rvert^{2} = \\lvert \\mathbf{A}\\rvert^{2} + \\lvert \\mathbf{B}\\rvert^{2} - 2\\bigl(A_{x}B_{x} + A_{y}B_{y} + A_{z}B_{z}\\bigr)$$

Cancel the squared lengths, divide by $-2$, and the component sum and the
cosine expression are the same quantity. That derivation is worth carrying,
because it explains the one thing the dot product is for: **it reports how much
of one vector lies along another.** Formally,

$$\\text{comp}_{\\mathbf{B}}\\mathbf{A} = \\frac{\\mathbf{A}\\cdot\\mathbf{B}}{\\lvert \\mathbf{B}\\rvert}, \\qquad \\text{proj}_{\\mathbf{B}}\\mathbf{A} = \\frac{\\mathbf{A}\\cdot\\mathbf{B}}{\\mathbf{B}\\cdot\\mathbf{B}}\\,\\mathbf{B}$$

the first a signed length, the second a vector pointing along $\\mathbf{B}$.

Two consequences are examined directly. For two non-zero vectors the dot product
vanishes exactly when they are perpendicular, which is the fastest orthogonality
test available. And it is **commutative**: order never matters.

## 6.3 The cross product, and why its magnitude is an area

The cross product is most reliably remembered as a determinant with the unit
vectors in the top row:

$$\\mathbf{A}\\times\\mathbf{B} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ A_{x} & A_{y} & A_{z} \\\\ B_{x} & B_{y} & B_{z}\\end{vmatrix}$$

Expanding along the first row,

$$\\mathbf{A}\\times\\mathbf{B} = (A_{y}B_{z} - A_{z}B_{y})\\mathbf{i} - (A_{x}B_{z} - A_{z}B_{x})\\mathbf{j} + (A_{x}B_{y} - A_{y}B_{x})\\mathbf{k}$$

The middle sign is the one people drop; it belongs to the cofactor position, not
to the numbers.

The magnitude has a geometric reading:

$$\\lvert \\mathbf{A}\\times\\mathbf{B}\\rvert = \\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert\\sin\\theta$$

which is base times perpendicular height — the **area of the parallelogram** the
two vectors span. Half of it is the area of the triangle they span, which is how
areas of triangles in space are found without any trigonometry at all.

Direction comes from the right-hand rule, and reversing the order reverses the
answer:

$$\\mathbf{A}\\times\\mathbf{B} = -(\\mathbf{B}\\times\\mathbf{A}), \\qquad \\mathbf{A}\\times\\mathbf{A} = \\mathbf{0}$$

The two products are tied together by an identity worth knowing because it turns
one into a check on the other:

$$(\\mathbf{A}\\cdot\\mathbf{B})^{2} + \\lvert \\mathbf{A}\\times\\mathbf{B}\\rvert^{2} = \\lvert \\mathbf{A}\\rvert^{2}\\,\\lvert \\mathbf{B}\\rvert^{2}$$

This is Lagrange's identity, and it is just $\\cos^{2}\\theta + \\sin^{2}\\theta = 1$
multiplied through by the squared lengths.

![Left: two vectors of length seven drawn tail to tail, with the projection of the first onto the second marked as a length of 5.143 along the base. Right: the same two vectors spanning a shaded parallelogram of height 4.749 and area 33.24.](/courses/fe-ee/figures/math6-va-products.svg)

## 6.4 Worked: both products on the same pair

Take $\\mathbf{A} = (3, -2, 6)$ and $\\mathbf{B} = (2, 3, 6)$.

**Dot.** $6 - 6 + 36 = 36$. Because both lengths are 7,

$$\\cos\\theta = \\frac{36}{49} = 0.734694, \\qquad \\theta = 42.72^\\circ$$

**Cross.** Expanding the determinant,

$$\\mathbf{A}\\times\\mathbf{B} = \\bigl((-2)(6) - (6)(3)\\bigr)\\mathbf{i} - \\bigl((3)(6) - (6)(2)\\bigr)\\mathbf{j} + \\bigl((3)(3) - (-2)(2)\\bigr)\\mathbf{k}$$

$$\\mathbf{A}\\times\\mathbf{B} = -30\\,\\mathbf{i} - 6\\,\\mathbf{j} + 13\\,\\mathbf{k}, \\qquad \\lvert \\mathbf{A}\\times\\mathbf{B}\\rvert = \\sqrt{900 + 36 + 169} = \\sqrt{1105} = 33.2415$$

**Three independent checks.** First, the cross product must be perpendicular to
both inputs: $(-30)(3) + (-6)(-2) + (13)(6) = -90 + 12 + 78 = 0$, and
$(-30)(2) + (-6)(3) + (13)(6) = -60 - 18 + 78 = 0$. Second, the angle from the
cross product must match the angle from the dot product:
$\\sin\\theta = 33.2415/49 = 0.678398$, and $49 \\times 0.678398 = 33.2415$, giving
$\\theta = 42.72^\\circ$ again. Third, Lagrange's identity:
$1296 + 1105 = 2401 = 49^{2}$.

**Projection.** The component of $\\mathbf{A}$ along $\\mathbf{B}$ is
$36/7 = 5.142857$, and the projection vector is

$$\\text{proj}_{\\mathbf{B}}\\mathbf{A} = \\frac{36}{49}(2, 3, 6) = (1.469388,\\; 2.204082,\\; 4.408163)$$

Its length is $5.142857$, as it must be, and subtracting it from $\\mathbf{A}$
leaves a piece perpendicular to $\\mathbf{B}$ of length
$\\sqrt{49 - 26.448980} = 4.748791$ — which multiplied by $\\lvert \\mathbf{B}\\rvert = 7$
returns the parallelogram area $33.2415$ once more.

| Question the problem is really asking | Product | Result | Vanishes when |
|---|---|---|---|
| How much of one vector lies along another | dot | scalar | perpendicular |
| Work done, or real power | dot | scalar | force perpendicular to motion |
| Angle between two directions | either | scalar | — |
| Area spanned, or a normal direction | cross | vector | parallel |
| Force on a moving charge, or a torque | cross | vector | parallel |

## 6.5 The scalar triple product measures a volume

Feed the cross product into a dot product and the answer is a number:

$$\\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{C}) = \\begin{vmatrix} A_{x} & A_{y} & A_{z} \\\\ B_{x} & B_{y} & B_{z} \\\\ C_{x} & C_{y} & C_{z}\\end{vmatrix}$$

Read geometrically, $\\lvert \\mathbf{B}\\times\\mathbf{C}\\rvert$ is the area of the base
parallelogram and the dot with $\\mathbf{A}$ picks out the height above that base,
so the absolute value of the whole thing is the **volume of the parallelepiped**
the three vectors span. Two facts follow immediately:

- The value is unchanged by a **cyclic** shift, since cycling the rows of a
  determinant twice restores it: $\\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{C}) = \\mathbf{B}\\cdot(\\mathbf{C}\\times\\mathbf{A}) = \\mathbf{C}\\cdot(\\mathbf{A}\\times\\mathbf{B})$.
- It is **zero exactly when the three vectors are coplanar**, because a flat box
  has no volume. That is the standard coplanarity test.

## 6.6 Worked: a volume, and a coplanarity test

With $\\mathbf{A} = (3, -2, 6)$, $\\mathbf{B} = (2, 3, 6)$ and $\\mathbf{C} = (1, 1, 1)$,

$$\\mathbf{B}\\times\\mathbf{C} = (3 - 6)\\mathbf{i} - (2 - 6)\\mathbf{j} + (2 - 3)\\mathbf{k} = (-3, 4, -1)$$

$$\\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{C}) = -9 - 8 - 6 = -23$$

so the parallelepiped has volume 23, and the sign says the three vectors form a
left-handed set in the order given. Expanding the determinant along its first
row instead gives $3(3 - 6) + 2(2 - 6) + 6(2 - 3) = -9 - 8 - 6 = -23$: same
number, different route.

**Coplanarity.** Replace $\\mathbf{C}$ by $\\mathbf{C}' = \\mathbf{A} + \\mathbf{B} = (5, 1, 12)$.
Now the triple product must vanish, because $\\mathbf{C}'$ lies in the plane of the
other two by construction:

$$\\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{C}') = \\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{A}) + \\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{B}) = 0 + 0 = 0$$

The first term dies because $\\mathbf{B}\\times\\mathbf{A}$ is perpendicular to
$\\mathbf{A}$; the second because any vector crossed with itself is zero.

## 6.7 The vector triple product, and the expansion that saves it

Cross a vector into a cross product and the answer is a vector again — one that
lies in the plane of the two innermost vectors. The expansion, usually
remembered by the shape of its right-hand side, is

$$\\mathbf{A}\\times(\\mathbf{B}\\times\\mathbf{C}) = \\mathbf{B}\\,(\\mathbf{A}\\cdot\\mathbf{C}) - \\mathbf{C}\\,(\\mathbf{A}\\cdot\\mathbf{B})$$

Note carefully that the cross product is **not associative**: moving the
brackets changes the answer, which is why the expansion is worth having at all.

## 6.8 Worked: the expansion checked against the direct route

Using the same three vectors, $\\mathbf{A}\\cdot\\mathbf{C} = 3 - 2 + 6 = 7$ and
$\\mathbf{A}\\cdot\\mathbf{B} = 36$, so the expansion predicts

$$7(2, 3, 6) - 36(1, 1, 1) = (14 - 36,\\; 21 - 36,\\; 42 - 36) = (-22, -15, 6)$$

Computing it directly instead, with $\\mathbf{B}\\times\\mathbf{C} = (-3, 4, -1)$ from
above,

$$\\mathbf{A}\\times(-3, 4, -1) = \\bigl((-2)(-1) - (6)(4),\\; (6)(-3) - (3)(-1),\\; (3)(4) - (-2)(-3)\\bigr)$$

$$= (2 - 24,\\; -18 + 3,\\; 12 - 6) = (-22, -15, 6)$$

The two routes agree. As a final consistency check, the result must be
perpendicular to $\\mathbf{A}$, since $\\mathbf{A}\\times(\\text{anything})$ always is:
$(-22)(3) + (-15)(-2) + (6)(6) = -66 + 30 + 36 = 0$.`,
  examTip: 'Decide dot or cross before touching the numbers. If the answer is a magnitude, an amount, or an angle, it is a dot product; if it is a direction, an area, or a moment, it is a cross product. The two answers differ by a cosine against a sine, and both usually appear among the choices.',
  importantNote: 'The middle term of the cross-product determinant carries a minus sign that belongs to the position, not to the entries. Dropping it is the single most common vector-algebra error on this exam, and the result still looks plausible because only one component is wrong.',
},
{
  id: 'va-curves-frame',
  title: '7. Vector Functions, Derivatives and the Moving Frame',
  content: `## 7.1 A curve is a vector that depends on one parameter

Let a point trace out a path, and record where it is at each instant:

$$\\mathbf{r}(t) = x(t)\\,\\mathbf{i} + y(t)\\,\\mathbf{j} + z(t)\\,\\mathbf{k}$$

Differentiation is componentwise, and the two derivatives already have names
from mechanics:

$$\\mathbf{v}(t) = \\frac{d\\mathbf{r}}{dt}, \\qquad \\mathbf{a}(t) = \\frac{d^{2}\\mathbf{r}}{dt^{2}}$$

The velocity is **tangent** to the curve; the speed is its magnitude. Because
distance is the running total of speed, arc length is an ordinary integral:

$$s = \\int_{a}^{b} \\left\\lvert \\frac{d\\mathbf{r}}{dt}\\right\\rvert dt = \\int_{a}^{b}\\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2} + \\left(\\frac{dz}{dt}\\right)^{2}}\\,dt$$

Products of vector functions differentiate exactly like products of scalars,
provided the order is preserved in the cross product because it is not
commutative:

$$\\frac{d}{dt}(\\mathbf{u}\\cdot\\mathbf{v}) = \\frac{d\\mathbf{u}}{dt}\\cdot\\mathbf{v} + \\mathbf{u}\\cdot\\frac{d\\mathbf{v}}{dt}, \\qquad \\frac{d}{dt}(\\mathbf{u}\\times\\mathbf{v}) = \\frac{d\\mathbf{u}}{dt}\\times\\mathbf{v} + \\mathbf{u}\\times\\frac{d\\mathbf{v}}{dt}$$

One corollary is used constantly: if $\\lvert \\mathbf{u}\\rvert$ is constant then
$\\mathbf{u}\\cdot\\mathbf{u}$ is constant, so differentiating gives
$2\\,\\mathbf{u}\\cdot d\\mathbf{u}/dt = 0$. **A vector of fixed length is always
perpendicular to its own derivative.** That single fact generates the whole
moving frame below.

## 7.2 The frame a curve carries with it

Normalising the velocity strips out how fast the point is moving and leaves pure
direction — the unit tangent:

$$\\mathbf{T} = \\frac{\\mathbf{v}}{\\lvert \\mathbf{v}\\rvert}$$

Since $\\mathbf{T}$ has fixed length, $d\\mathbf{T}/dt$ is perpendicular to it, and
normalising that gives the **principal unit normal** $\\mathbf{N}$, which points
toward the inside of the bend. Completing the set with a cross product,

$$\\mathbf{B} = \\mathbf{T}\\times\\mathbf{N}$$

produces three mutually perpendicular unit vectors that travel with the point.
$\\mathbf{T}$ and $\\mathbf{N}$ span the plane the curve is momentarily bending in;
$\\mathbf{B}$ is perpendicular to it.

Two numbers describe the shape. **Curvature** measures how fast the direction
turns per unit distance travelled:

$$\\kappa = \\left\\lvert \\frac{d\\mathbf{T}}{ds}\\right\\rvert = \\frac{\\lvert \\mathbf{r}'\\times\\mathbf{r}''\\rvert}{\\lvert \\mathbf{r}'\\rvert^{3}}, \\qquad \\rho = \\frac{1}{\\kappa}$$

and $\\rho$ is the radius of the circle that best fits the curve there. **Torsion**
measures how fast the bending plane itself twists:

$$\\tau = \\frac{(\\mathbf{r}'\\times\\mathbf{r}'')\\cdot\\mathbf{r}'''}{\\lvert \\mathbf{r}'\\times\\mathbf{r}''\\rvert^{2}}$$

A plane curve has zero torsion, because its bending plane never changes.

Acceleration splits along the frame, and the split is the reason a car on a bend
needs grip even at constant speed:

$$\\mathbf{a} = \\frac{d\\lvert \\mathbf{v}\\rvert}{dt}\\,\\mathbf{T} + \\kappa\\lvert \\mathbf{v}\\rvert^{2}\\,\\mathbf{N}$$

The first term changes the speed; the second changes only the direction, and it
grows with the **square** of the speed.

![A helical arc rising around a vertical axis, with the unit tangent, principal normal and binormal drawn at one point, and a dotted horizontal circle of radius three marking the cross-section the normal points into.](/courses/fe-ee/figures/math6-va-frenet.svg)

## 7.3 Worked: the frame on a helix

Take the helix

$$\\mathbf{r}(t) = 3\\cos t\\,\\mathbf{i} + 3\\sin t\\,\\mathbf{j} + 4t\\,\\mathbf{k}$$

**Velocity and speed.** Differentiating,
$\\mathbf{r}' = (-3\\sin t,\\; 3\\cos t,\\; 4)$, so

$$\\lvert \\mathbf{r}'\\rvert = \\sqrt{9\\sin^{2}t + 9\\cos^{2}t + 16} = \\sqrt{25} = 5$$

The speed is constant, which makes the arc length trivial: one full turn takes
$t$ from 0 to $2\\pi$, so $s = 5(2\\pi) = 10\\pi = 31.4159$.

**Tangent.** $\\mathbf{T} = (-0.6\\sin t,\\; 0.6\\cos t,\\; 0.8)$, a unit vector because
$0.36 + 0.64 = 1$.

**Curvature.** $\\mathbf{r}'' = (-3\\cos t,\\; -3\\sin t,\\; 0)$, so
$\\mathbf{r}'\\times\\mathbf{r}'' = (12\\sin t,\\; -12\\cos t,\\; 9)$ and
$\\lvert \\mathbf{r}'\\times\\mathbf{r}''\\rvert = \\sqrt{144 + 81} = 15$. Therefore

$$\\kappa = \\frac{15}{5^{3}} = \\frac{15}{125} = 0.12, \\qquad \\rho = \\frac{1}{0.12} = 8.3333$$

**Normal and binormal.** Since $d\\mathbf{T}/dt = (-0.6\\cos t,\\; -0.6\\sin t,\\; 0)$
has magnitude 0.6, the normal is $\\mathbf{N} = (-\\cos t,\\; -\\sin t,\\; 0)$ — exactly
the horizontal direction pointing at the axis, which is what the picture shows.
Then $\\mathbf{B} = \\mathbf{T}\\times\\mathbf{N} = (0.8\\sin t,\\; -0.8\\cos t,\\; 0.6)$, and
$0.64 + 0.36 = 1$ confirms it is a unit vector.

**Torsion.** With $\\mathbf{r}''' = (3\\sin t,\\; -3\\cos t,\\; 0)$,

$$\\tau = \\frac{36\\sin^{2}t + 36\\cos^{2}t}{15^{2}} = \\frac{36}{225} = 0.16$$

**Acceleration split.** The speed is constant, so the tangential term is zero and
all the acceleration is normal: $\\kappa\\lvert \\mathbf{v}\\rvert^{2} = 0.12 \\times 25 = 3$.
Independently, $\\lvert \\mathbf{r}''\\rvert = 3$. The two agree, which is the check
worth running whenever the split is used.

**Reading the two numbers.** A radius-$a$ helix of pitch coefficient $c$ has
$\\kappa = a/(a^{2} + c^{2})$ and $\\tau = c/(a^{2} + c^{2})$; here $3/25 = 0.12$ and
$4/25 = 0.16$. Setting $c = 0$ collapses the helix to a circle of radius $a$,
whose curvature is $1/a$ and whose torsion is zero — both formulas degrade to the
right answers, which is the sanity check a memorised formula should always be
put through.`,
  examTip: 'The FE rarely asks for torsion, but it does ask for speed, arc length, curvature and the normal component of acceleration. Compute the speed first; on a constant-speed path the whole acceleration is normal and equals kappa times speed squared, which turns a messy differentiation into one multiplication.',
},
{
  id: 'va-gradient-depth',
  title: '8. Fields, the Gradient, and the Directional Derivative',
  content: `## 8.1 Two kinds of field

A **scalar field** attaches a number to every point: temperature in a heat sink,
electric potential in a dielectric, pressure in a duct. A **vector field**
attaches an arrow: electric field strength, current density, fluid velocity.
Almost every quantity on this exam is one or the other, and the operators in the
next three sections are the four ways of moving between them.

| Operator | Eats | Returns | Answers the question |
|---|---|---|---|
| gradient | scalar field | vector field | which way is uphill, and how steeply |
| divergence | vector field | scalar field | is this point a source or a sink |
| curl | vector field | vector field | does the field circulate here |
| Laplacian | scalar field | scalar field | how far is this value below its neighbours |

A scalar field is pictured by its **level sets** — the curves or surfaces on
which it holds a constant value. Contour lines on a map, equipotentials around a
charged conductor and isotherms in a slab are all level sets, and a great deal of
field intuition is just knowing what the level sets look like.

## 8.2 The directional derivative, and the gradient falling out of it

Ask how fast $f$ changes as a point moves through $P$ in the direction of a unit
vector $\\hat{\\mathbf{u}}$. Write the motion as $\\mathbf{r}(h) = P + h\\hat{\\mathbf{u}}$
and apply the chain rule:

$$D_{\\hat{\\mathbf{u}}}f = \\frac{d}{dh}f\\bigl(\\mathbf{r}(h)\\bigr)\\Big|_{h=0} = \\frac{\\partial f}{\\partial x}u_{x} + \\frac{\\partial f}{\\partial y}u_{y} + \\frac{\\partial f}{\\partial z}u_{z}$$

The right-hand side is a dot product of $\\hat{\\mathbf{u}}$ with a vector built from
the three partial derivatives. **That vector is the gradient**, and it was not
assumed — it appeared:

$$\\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{i} + \\frac{\\partial f}{\\partial y}\\mathbf{j} + \\frac{\\partial f}{\\partial z}\\mathbf{k}, \\qquad D_{\\hat{\\mathbf{u}}}f = \\nabla f \\cdot \\hat{\\mathbf{u}}$$

Everything the gradient is famous for now follows from one line. Since
$\\hat{\\mathbf{u}}$ is a unit vector,

$$D_{\\hat{\\mathbf{u}}}f = \\lvert \\nabla f\\rvert\\cos\\phi$$

where $\\phi$ is the angle between the chosen direction and the gradient. So:

- The largest possible rate of increase occurs at $\\phi = 0$, and its value is
  $\\lvert \\nabla f\\rvert$. **The gradient points along steepest ascent and its
  length is that steepest slope.**
- The rate is zero at $\\phi = 90^\\circ$. Moving perpendicular to the gradient does
  not change $f$ at all, which means **the gradient is perpendicular to the level
  set** through the point.
- The most negative rate is $-\\lvert \\nabla f\\rvert$, straight down the gradient.

Because the gradient is normal to the level surface $f = c$, the tangent plane to
that surface at $P$ is

$$\\nabla f(P)\\cdot(\\mathbf{r} - P) = 0$$

![Left: elliptical level curves of a scalar field with gradient arrows crossing every one of them at right angles, and the tangent direction marked at one point. Right: the directional derivative plotted against the angle from the gradient, peaking at plus ten, crossing zero at ninety degrees and reaching minus ten at one hundred and eighty.](/courses/fe-ee/figures/math6-va-gradient.svg)

## 8.3 Worked: steepest ascent and a directional derivative

Let $f(x, y) = x^{2} + 4y^{2}$, and work at the point $(3, 1)$.

**Gradient.** $\\nabla f = (2x,\\; 8y)$, so at that point $\\nabla f = (6, 8)$ and

$$\\lvert \\nabla f\\rvert = \\sqrt{36 + 64} = 10$$

**Steepest ascent.** The direction is $(6, 8)/10 = (0.6, 0.8)$, and the rate is
10 per unit length. Checking with the dot product,
$(6)(0.6) + (8)(0.8) = 3.6 + 6.4 = 10$.

**Along the level curve.** The perpendicular direction is $(0.8, -0.6)$, and
$(6)(0.8) + (8)(-0.6) = 4.8 - 4.8 = 0$. The level curve through the point is the
ellipse $x^{2} + 4y^{2} = 13$, and the field really is flat along it.

**A direction in between.** At $60^\\circ$ off the gradient the rate is
$10\\cos 60^\\circ = 5$ — exactly half the maximum, even though the direction is only
two thirds of the way to the level curve. That non-uniformity is the cosine, and
it is the reason questions about intermediate directions are worth a moment
rather than a guess.

**Trap.** Using a direction vector that is not a unit vector. Taking
$\\mathbf{u} = (3, 4)$ instead of $(0.6, 0.8)$ gives $18 + 32 = 50$, five times too
big, because $\\lvert (3,4)\\rvert = 5$. Normalise first, every time.

## 8.4 Worked: a level surface and its tangent plane

Let $f(x, y, z) = x^{2}y + yz^{3}$ and take the point $P = (1, 2, 3)$, where
$f = 2 + 54 = 56$.

$$\\nabla f = \\bigl(2xy,\\; x^{2} + z^{3},\\; 3yz^{2}\\bigr) = (4,\\; 28,\\; 54)$$

The level surface through $P$ is $x^{2}y + yz^{3} = 56$, and the tangent plane
there is

$$4(x - 1) + 28(y - 2) + 54(z - 3) = 0, \\qquad 4x + 28y + 54z = 222$$

Substituting $P$ confirms it: $4 + 56 + 162 = 222$. The unit normal to the
surface is $\\nabla f/\\lvert \\nabla f\\rvert$, with
$\\lvert \\nabla f\\rvert = \\sqrt{16 + 784 + 2916} = \\sqrt{3716} = 60.9590$.

**Where this is used.** In electrostatics the potential $V$ is the scalar field
and the electric field is

$$\\mathbf{E} = -\\nabla V$$

The minus sign says the field points from high potential toward low, and the
perpendicularity result says **field lines cross equipotentials at right
angles** — which is why a conductor surface, being an equipotential, always has
the field normal to it. The Electromagnetics chapters use that fact constantly;
it is proved here.

## 8.5 The gradient of a distance, and why it appears everywhere

Let $r = \\sqrt{x^{2} + y^{2} + z^{2}}$ be the distance from the origin. Then

$$\\frac{\\partial r}{\\partial x} = \\frac{x}{r}, \\qquad \\nabla r = \\frac{(x, y, z)}{r} = \\hat{\\mathbf{a}}_{r}$$

The gradient of distance is the unit radial vector, which is obvious once stated:
moving one metre straight out increases the distance by one metre. Applying the
chain rule to any function of distance alone,

$$\\nabla f(r) = f'(r)\\,\\hat{\\mathbf{a}}_{r}$$

so for the Coulomb potential $V = k/r$,

$$\\mathbf{E} = -\\nabla V = \\frac{k}{r^{2}}\\,\\hat{\\mathbf{a}}_{r}$$

The inverse-square field is not an extra postulate; it is the derivative of the
inverse-distance potential.`,
  examTip: 'Three gradient facts answer most of what is asked: it points uphill, its magnitude is the steepest slope, and it is perpendicular to the level set. If a question gives a direction, normalise it before dotting — an unnormalised direction is the most common wrong answer offered.',
  importantNote: 'E = -grad V has a minus sign and grad r is the unit radial vector. Getting either wrong flips a field direction, and a flipped field direction usually still satisfies the magnitude the question asks about, so the error survives every check except this one.',
},
{
  id: 'va-div-curl-depth',
  title: '9. Divergence from a Box, Curl from a Loop',
  content: `## 9.1 Divergence is flux per unit volume

Surround a point $P$ with a small box of edge $h$, aligned with the axes, and add
up the outward flux of a vector field $\\mathbf{F}$ through its six faces. On the
two faces perpendicular to $x$ the outward normals are $\\pm\\mathbf{i}$, so those
two faces contribute

$$\\bigl[F_{x}(x_{0} + \\tfrac{h}{2}) - F_{x}(x_{0} - \\tfrac{h}{2})\\bigr]h^{2} \\approx \\frac{\\partial F_{x}}{\\partial x}h^{3}$$

The other two pairs behave identically. Dividing the total by the volume $h^{3}$
and shrinking the box gives a quantity that depends only on the point:

$$\\nabla\\cdot\\mathbf{F} = \\lim_{h\\to 0}\\frac{1}{h^{3}}\\oint_{S}\\mathbf{F}\\cdot\\mathbf{n}\\,dS = \\frac{\\partial F_{x}}{\\partial x} + \\frac{\\partial F_{y}}{\\partial y} + \\frac{\\partial F_{z}}{\\partial z}$$

That limit **is** the definition; the sum of partial derivatives is what it
evaluates to in Cartesian coordinates. Keeping the limit in mind is what makes
the cylindrical and spherical formulas in Section 14 look inevitable rather than
arbitrary, and it is what makes the divergence theorem obvious.

Physically, positive divergence means more field leaves a neighbourhood than
enters it, so something inside is producing it. In electrostatics that something
is charge:

$$\\nabla\\cdot\\mathbf{D} = \\rho_{v}$$

and the statement $\\nabla\\cdot\\mathbf{B} = 0$ says nothing produces magnetic flux
— it only ever circulates.

## 9.2 Curl is circulation per unit area

Now run round a small square loop of edge $h$ lying in a plane through $P$, and
add up $\\mathbf{F}\\cdot d\\mathbf{r}$ as you go. For a loop in the plane $z$ =
constant, traversed counterclockwise seen from $+z$, the two horizontal edges
contribute the change in $F_{x}$ across the loop and the two vertical edges the
change in $F_{y}$, with signs set by the direction of travel:

$$\\oint \\mathbf{F}\\cdot d\\mathbf{r} \\approx \\left(\\frac{\\partial F_{y}}{\\partial x} - \\frac{\\partial F_{x}}{\\partial y}\\right)h^{2}$$

Dividing by the area and shrinking the loop gives the component of the curl along
the loop's normal:

$$(\\nabla\\times\\mathbf{F})\\cdot\\mathbf{n} = \\lim_{h\\to 0}\\frac{1}{h^{2}}\\oint\\mathbf{F}\\cdot d\\mathbf{r}$$

Doing the same in the other two coordinate planes assembles the whole vector,
which is again most safely written as a determinant:

$$\\nabla\\times\\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\dfrac{\\partial}{\\partial x} & \\dfrac{\\partial}{\\partial y} & \\dfrac{\\partial}{\\partial z} \\\\ F_{x} & F_{y} & F_{z}\\end{vmatrix}$$

$$\\nabla\\times\\mathbf{F} = \\left(\\frac{\\partial F_{z}}{\\partial y} - \\frac{\\partial F_{y}}{\\partial z}\\right)\\mathbf{i} + \\left(\\frac{\\partial F_{x}}{\\partial z} - \\frac{\\partial F_{z}}{\\partial x}\\right)\\mathbf{j} + \\left(\\frac{\\partial F_{y}}{\\partial x} - \\frac{\\partial F_{x}}{\\partial y}\\right)\\mathbf{k}$$

Note the middle component: written this way it reads $\\partial F_{x}/\\partial z$
first, which already absorbs the cofactor sign. Writing the middle bracket in the
same order as the other two and forgetting to negate it is the standard mistake.

## 9.3 Worked: measuring both limits on a real field

Take the field used from here on,

$$\\mathbf{F} = x^{2}y\\,\\mathbf{i} + yz^{2}\\,\\mathbf{j} + xz\\,\\mathbf{k}$$

and the point $P = (1, 2, 3)$.

**By differentiation.**

$$\\nabla\\cdot\\mathbf{F} = 2xy + z^{2} + x, \\qquad \\text{at } P: \\; 4 + 9 + 1 = 14$$

$$\\nabla\\times\\mathbf{F} = (0 - 2yz,\\; 0 - z,\\; 0 - x^{2}) = (-2yz,\\; -z,\\; -x^{2}), \\qquad \\text{at } P: \\; (-12,\\; -3,\\; -1)$$

**By the limits.** Wrapping a cube of edge $h$ around $P$ and integrating the
outward flux over its faces gives, exactly,

$$\\frac{1}{h^{3}}\\oint_{S}\\mathbf{F}\\cdot\\mathbf{n}\\,dS = 14 + \\frac{h^{2}}{12}$$

and running a square loop of edge $h$ in the plane $z = 3$ gives, exactly,

$$\\frac{1}{h^{2}}\\oint\\mathbf{F}\\cdot d\\mathbf{r} = -1 - \\frac{h^{2}}{12}$$

Both converge on the differentiated answers, and both do so as $h^{2}$. The
discrepancy is not numerical noise: averaging $z^{2}$ over an interval of width
$h$ centred on $z_{0}$ gives $z_{0}^{2} + h^{2}/12$, and averaging $-x^{2}$ the
same way gives $-x_{0}^{2} - h^{2}/12$. The measured curves below sit on those
two expressions to ten decimal places.

| Edge $h$ | Flux ÷ volume | Circulation ÷ area |
|---|---|---|
| 0.4 | 14.013333 | −1.013333 |
| 0.2 | 14.003333 | −1.003333 |
| 0.1 | 14.000833 | −1.000833 |
| 0.05 | 14.000208 | −1.000208 |

![Two stacked panels. The upper plots measured flux divided by volume against cube edge, with points sitting on the curve fourteen plus h squared over twelve and approaching a horizontal line at fourteen. The lower plots measured circulation divided by area against square edge, approaching minus one from below.](/courses/fe-ee/figures/math6-va-shrinking-limits.svg)

**What the numbers say.** Halving the edge divides the error by four, which is
the signature of second-order convergence. That is a useful check in its own
right: if a numerical estimate of a derivative does not improve at the rate the
theory predicts, the code is wrong somewhere, not the mathematics.

## 9.4 Worked: divergence and curl are independent

Two plane fields make the point.

**Pure source.** $\\mathbf{F} = x\\,\\mathbf{i} + y\\,\\mathbf{j}$ has
$\\nabla\\cdot\\mathbf{F} = 1 + 1 = 2$ everywhere, while its curl has $z$-component
$\\partial(y)/\\partial x - \\partial(x)/\\partial y = 0 - 0 = 0$. Every arrow points
straight out; nothing swirls.

**Pure swirl.** $\\mathbf{G} = -y\\,\\mathbf{i} + x\\,\\mathbf{j}$ has
$\\nabla\\cdot\\mathbf{G} = 0 + 0 = 0$, while its curl has $z$-component
$\\partial(x)/\\partial x - \\partial(-y)/\\partial y = 1 - (-1) = 2$. Every arrow
circles; nothing escapes.

**Both at once.** Their sum $\\mathbf{F} + \\mathbf{G} = (x - y,\\; y + x)$ has
divergence 2 **and** curl 2. The two measurements are not alternatives, and a
question that establishes one says nothing whatever about the other.

**A trap worth naming.** A field can circulate visibly and still have zero curl.
The field $\\mathbf{H} = (-y,\\; x)/(x^{2} + y^{2})$ has closed circular field lines,
yet its curl vanishes at every point except the origin, where it is undefined.
Curl is a **local** paddle-wheel test, not a global one — this is exactly the
field outside a current-carrying wire, and it is why Ampere's law can give a
non-zero loop integral around a wire even though the curl is zero everywhere the
loop actually passes.`,
  examTip: 'Divergence turns a vector into a scalar; curl turns a vector into a vector. If your answer has the wrong type, you used the wrong operator — check that before checking the arithmetic. Gradient is the only one that eats a scalar.',
  importantNote: 'The j-component of the curl carries the reversed order dFx/dz - dFz/dx. Writing all three components in the same cyclic order without negating the middle one produces a curl whose middle component has the wrong sign, and every magnitude computed from it is still plausible.',
},
{
  id: 'va-laplacian-identities',
  title: '10. The Laplacian, and the Identities That Come Free',
  content: `## 10.1 The Laplacian, and what it actually measures

Apply the gradient to a scalar field and then take the divergence of the result:

$$\\nabla^{2}f = \\nabla\\cdot(\\nabla f) = \\frac{\\partial^{2}f}{\\partial x^{2}} + \\frac{\\partial^{2}f}{\\partial y^{2}} + \\frac{\\partial^{2}f}{\\partial z^{2}}$$

The formula is easy; the meaning is worth more. Average $f$ over a small cube of
edge $h$ centred on a point. Expanding in a Taylor series, the linear terms
cancel by symmetry and the surviving second-order term is

$$\\langle f\\rangle_{\\text{cube}} = f(P) + \\frac{h^{2}}{24}\\nabla^{2}f + O(h^{4})$$

So **the Laplacian measures how far a point sits below the average of its
neighbours**. Positive Laplacian means the surroundings are higher — the point is
in a dip. Zero Laplacian means the value at every point equals the average around
it, which is precisely what **Laplace's equation** $\\nabla^{2}V = 0$ demands, and
why a potential satisfying it can have no interior maximum or minimum. Charge
appears as the departure from that averaging property, in Poisson's equation:

$$\\nabla^{2}V = -\\frac{\\rho_{v}}{\\varepsilon}$$

**Check on the running scalar field.** Take $f = x^{2}y + yz^{3}$ at $P = (1,2,3)$,
where $f = 56$. Then

$$\\nabla^{2}f = 2y + 0 + 6yz = 4 + 36 = 40$$

and the cube average is predicted to be $56 + 40h^{2}/24 = 56 + 5h^{2}/3$.
Integrating $f$ over the cube exactly, the average is $56 + h^{2}/6 + 1.5h^{2}$,
and $1/6 + 3/2 = 5/3$. The prediction is not approximate here — it is exact,
because $f$ has no fourth derivatives.

The Laplacian of a vector field is defined componentwise in Cartesian
coordinates:

$$\\nabla^{2}\\mathbf{F} = \\nabla^{2}F_{x}\\,\\mathbf{i} + \\nabla^{2}F_{y}\\,\\mathbf{j} + \\nabla^{2}F_{z}\\,\\mathbf{k}$$

and that componentwise shortcut is valid **only** in Cartesian coordinates — a
point returned to in Section 14.

## 10.2 Curl of a gradient is always zero

Take any scalar field with continuous second partials and compute the
$z$-component of the curl of its gradient:

$$(\\nabla\\times\\nabla f)_{z} = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial f}{\\partial y}\\right) - \\frac{\\partial}{\\partial y}\\left(\\frac{\\partial f}{\\partial x}\\right) = 0$$

by equality of mixed partials. The other two components vanish for the same
reason, so

$$\\nabla\\times(\\nabla f) = \\mathbf{0}$$

for every well-behaved $f$. This one identity carries an enormous amount of the
exam. It says a field that is a gradient cannot circulate, so an electrostatic
field $\\mathbf{E} = -\\nabla V$ satisfies $\\nabla\\times\\mathbf{E} = 0$, so
electrostatic work is path-independent, so voltage between two points is a
well-defined number. Every one of those statements is the same statement.

## 10.3 Divergence of a curl is always zero

Write out the divergence of the curl and the six terms cancel in pairs:

$$\\nabla\\cdot(\\nabla\\times\\mathbf{F}) = \\frac{\\partial}{\\partial x}\\left(\\frac{\\partial F_{z}}{\\partial y} - \\frac{\\partial F_{y}}{\\partial z}\\right) + \\frac{\\partial}{\\partial y}\\left(\\frac{\\partial F_{x}}{\\partial z} - \\frac{\\partial F_{z}}{\\partial x}\\right) + \\frac{\\partial}{\\partial z}\\left(\\frac{\\partial F_{y}}{\\partial x} - \\frac{\\partial F_{x}}{\\partial y}\\right) = 0$$

Each mixed partial appears twice with opposite signs. Hence

$$\\nabla\\cdot(\\nabla\\times\\mathbf{F}) = 0$$

for every well-behaved $\\mathbf{F}$. The magnetic consequence is immediate: if
$\\mathbf{B} = \\nabla\\times\\mathbf{A}$ for some vector potential $\\mathbf{A}$, then
$\\nabla\\cdot\\mathbf{B} = 0$ automatically. No magnetic monopoles, for free.

## 10.4 The vector Laplacian identity

The third standard identity is the one that turns Maxwell's equations into wave
equations:

$$\\nabla\\times(\\nabla\\times\\mathbf{F}) = \\nabla(\\nabla\\cdot\\mathbf{F}) - \\nabla^{2}\\mathbf{F}$$

Read right to left it is a **definition** of the vector Laplacian in coordinate
systems where componentwise differentiation does not work. Read left to right it
is the manipulation that produces the wave equation: taking the curl of Faraday's
law and substituting Ampere's law leaves a double curl, and this identity turns
it into a Laplacian plus a gradient of a divergence that vanishes in free space.

## 10.5 Two product rules

Both mirror the ordinary product rule, with the type of each factor deciding
which product appears:

$$\\nabla\\cdot(f\\mathbf{F}) = f\\,(\\nabla\\cdot\\mathbf{F}) + \\mathbf{F}\\cdot\\nabla f$$

$$\\nabla\\times(f\\mathbf{F}) = f\\,(\\nabla\\times\\mathbf{F}) + (\\nabla f)\\times\\mathbf{F}$$

Note that the second term of each is forced: a divergence must come out a scalar,
so it is a dot product; a curl must come out a vector, so it is a cross product.
Getting the order of the cross product backwards flips the sign of the answer.

## 10.6 Worked: all five identities on one pair of fields

Use $f = x^{2}y + yz^{3}$ and $\\mathbf{F} = (x^{2}y,\\; yz^{2},\\; xz)$ at
$P = (1, 2, 3)$, where $f = 56$, $\\nabla f = (4, 28, 54)$,
$\\mathbf{F}(P) = (2, 18, 3)$, $\\nabla\\cdot\\mathbf{F} = 14$ and
$\\nabla\\times\\mathbf{F} = (-12, -3, -1)$.

**Curl of a gradient.** $\\nabla f = (2xy,\\; x^{2} + z^{3},\\; 3yz^{2})$, so

$$\\nabla\\times(\\nabla f) = \\bigl(3z^{2} - 3z^{2},\\; 0 - 0,\\; 2x - 2x\\bigr) = \\mathbf{0}$$

identically in $x$, $y$ and $z$, not merely at $P$.

**Divergence of a curl.** $\\nabla\\times\\mathbf{F} = (-2yz,\\; -z,\\; -x^{2})$, and

$$\\nabla\\cdot(-2yz,\\; -z,\\; -x^{2}) = 0 + 0 + 0 = 0$$

because each component happens to be independent of its own coordinate — which is
exactly what the cancellation in Section 10.3 guarantees.

**Vector Laplacian.** The left side: taking the curl again,

$$\\nabla\\times(-2yz,\\; -z,\\; -x^{2}) = \\bigl(0 + 1,\\; -2y + 2x,\\; 0 + 2z\\bigr) = (1,\\; 2x - 2y,\\; 2z)$$

which at $P$ is $(1, -2, 6)$. The right side: $\\nabla(\\nabla\\cdot\\mathbf{F}) = (2y + 1,\\; 2x,\\; 2z)$
and $\\nabla^{2}\\mathbf{F} = (2y,\\; 2y,\\; 0)$, so the difference is
$(1,\\; 2x - 2y,\\; 2z)$. The two sides match term for term.

**Product rule for divergence.** $\\mathbf{F}\\cdot\\nabla f = (2)(4) + (18)(28) + (3)(54) = 8 + 504 + 162 = 674$, and $56 \\times 14 = 784$, so

$$\\nabla\\cdot(f\\mathbf{F}) = 784 + 674 = 1458$$

**Product rule for curl.** $(\\nabla f)\\times\\mathbf{F} = (4, 28, 54)\\times(2, 18, 3)$, which is

$$\\bigl((28)(3) - (54)(18),\\; (54)(2) - (4)(3),\\; (4)(18) - (28)(2)\\bigr) = (-888,\\; 96,\\; 16)$$

and therefore

$$\\nabla\\times(f\\mathbf{F}) = 56(-12,\\; -3,\\; -1) + (-888,\\; 96,\\; 16) = (-1560,\\; -72,\\; -40)$$

Every one of these five results was also recomputed by differentiating
numerically on a grid, with no algebra involved, and every one agreed.

| Identity | Statement | What it buys |
|---|---|---|
| curl grad | $\\nabla\\times(\\nabla f) = \\mathbf{0}$ | conservative fields, voltage well defined |
| div curl | $\\nabla\\cdot(\\nabla\\times\\mathbf{F}) = 0$ | no magnetic monopoles |
| vector Laplacian | $\\nabla\\times(\\nabla\\times\\mathbf{F}) = \\nabla(\\nabla\\cdot\\mathbf{F}) - \\nabla^{2}\\mathbf{F}$ | the wave equation |
| divergence product | $\\nabla\\cdot(f\\mathbf{F}) = f\\nabla\\cdot\\mathbf{F} + \\mathbf{F}\\cdot\\nabla f$ | fields in graded media |
| curl product | $\\nabla\\times(f\\mathbf{F}) = f\\nabla\\times\\mathbf{F} + (\\nabla f)\\times\\mathbf{F}$ | fields in graded media |`,
  examTip: 'Two identities answer questions on sight: the curl of any gradient is zero and the divergence of any curl is zero. If a multiple-choice item offers a non-zero value for either, it is testing recognition, not computation, and no differentiation is needed.',
},
{
  id: 'va-line-integrals',
  title: '11. Line Integrals, Work, and Path Independence',
  content: `## 11.1 Two different integrals along a curve

Integrating along a curve means one of two things, and confusing them is a
reliable way to lose a question.

**Against arc length**, for a scalar field. Chop the curve into pieces of length
$ds$, weight each by the field value there, and add:

$$\\int_{C} f\\,ds = \\int_{a}^{b} f\\bigl(\\mathbf{r}(t)\\bigr)\\,\\left\\lvert \\frac{d\\mathbf{r}}{dt}\\right\\rvert dt$$

This is how the mass of a wire of varying density, or the average temperature
along a path, is found. It does not care which way you travel: reversing the
direction leaves the answer alone, because $ds$ is a length.

**Against displacement**, for a vector field. Keep only the component of the
field along the direction of travel:

$$\\int_{C}\\mathbf{F}\\cdot d\\mathbf{r} = \\int_{a}^{b}\\mathbf{F}\\bigl(\\mathbf{r}(t)\\bigr)\\cdot\\frac{d\\mathbf{r}}{dt}\\,dt = \\int_{C}\\bigl(F_{x}\\,dx + F_{y}\\,dy + F_{z}\\,dz\\bigr)$$

This is **work**, and it does care about direction: reversing the path negates
it. A closed-path version is written with a ring on the integral sign and is
called the **circulation** of the field.

## 11.2 Worked: the mass of a curved wire

A wire follows $y = x^{2}$ from the origin to $(2, 4)$, with linear density
$\\lambda = x$ in consistent units. Parametrise by $x$ itself, so
$\\mathbf{r}(x) = (x,\\; x^{2})$ and

$$ds = \\sqrt{1 + (dy/dx)^{2}}\\;dx = \\sqrt{1 + 4x^{2}}\\;dx$$

Then

$$m = \\int_{0}^{2} x\\sqrt{1 + 4x^{2}}\\;dx = \\left[\\frac{(1 + 4x^{2})^{3/2}}{12}\\right]_{0}^{2} = \\frac{17^{3/2} - 1}{12}$$

Since $17^{3/2} = 17\\sqrt{17} = 70.092796$, the mass is
$69.092796/12 = 5.757733$.

**Check the shape of the answer.** The wire is longer than the straight line from
$(0,0)$ to $(2,4)$, whose length is $\\sqrt{20} = 4.4721$; and the density runs
from 0 to 2, averaging somewhat above 1 because the wire is longer where $x$ is
large. A mass near 5.76 is consistent with both. The substitution
$u = 1 + 4x^{2}$ is the only trick, and forgetting the factor of 8 in $du$ is the
usual slip — it would give an answer eight times too big.

## 11.3 Work, and when the route stops mattering

Take the plane field $\\mathbf{F} = y\\,\\mathbf{i} + 2x\\,\\mathbf{j}$ and go from the
origin to $(1, 1)$ three different ways.

**Straight line**, $\\mathbf{r}(t) = (t, t)$:

$$\\int_{0}^{1}\\bigl(t + 2t\\bigr)dt = \\int_{0}^{1} 3t\\,dt = 1.5$$

**Parabola**, $\\mathbf{r}(t) = (t, t^{2})$, so $dy = 2t\\,dt$:

$$\\int_{0}^{1}\\bigl(t^{2} + 2t(2t)\\bigr)dt = \\int_{0}^{1} 5t^{2}\\,dt = \\frac{5}{3} = 1.6667$$

**Corner**, along the $x$-axis and then straight up. On the first leg $y = 0$ and
$dy = 0$, so nothing accumulates. On the second leg $x = 1$ and $dx = 0$, leaving

$$\\int_{0}^{1} 2\\,dy = 2$$

Three routes, three answers. Now the same three routes in
$\\mathbf{G} = 2xy\\,\\mathbf{i} + x^{2}\\,\\mathbf{j}$ give 1, 1 and 1. The difference
between the two fields is one number:

$$(\\nabla\\times\\mathbf{F})_{z} = 2 - 1 = 1, \\qquad (\\nabla\\times\\mathbf{G})_{z} = 2x - 2x = 0$$

![Two panels, each showing a straight path, a parabolic path and a right-angled corner path from the origin to the point one one. In the left panel the field has curl one and the three paths give 1.5000, 1.6667 and 2.0000; in the right panel the field has zero curl and all three give 1.0000.](/courses/fe-ee/figures/math6-va-path-work.svg)

**Where the difference goes.** The corner route and the straight route enclose a
triangle of area $\\tfrac{1}{2}$, traversed counterclockwise if you go out by the
corner and back by the line. The gap between the two answers is
$2 - 1.5 = 0.5$, which is the enclosed area multiplied by the curl. That is
Green's theorem, arriving before it has been stated.

## 11.4 Conservative fields, and four ways to say the same thing

A vector field on a simply connected region is called **conservative** when any
one of the following holds — and then all four do:

1. $\\nabla\\times\\mathbf{F} = \\mathbf{0}$ throughout the region.
2. $\\oint_{C}\\mathbf{F}\\cdot d\\mathbf{r} = 0$ for every closed path $C$ in it.
3. $\\int_{C}\\mathbf{F}\\cdot d\\mathbf{r}$ depends only on the endpoints of $C$.
4. $\\mathbf{F} = \\nabla\\varphi$ for some scalar potential $\\varphi$.

Given the fourth, the line integral collapses to a subtraction — the **gradient
theorem**, which is the fundamental theorem of calculus with a curve in place of
an interval:

$$\\int_{C}\\nabla\\varphi\\cdot d\\mathbf{r} = \\varphi(\\text{end}) - \\varphi(\\text{start})$$

The word **simply connected** is not decoration. In a region with a hole through
it — the space outside a current-carrying wire, for instance — zero curl no
longer forces zero circulation, which is exactly the loophole Ampere's law
exploits.

The practical rule for the exam: **take the curl before you parametrise
anything.** If it vanishes, find the potential and subtract; the parametrisation
was never needed.

## 11.5 Worked: finding a potential, and using it

Let $\\mathbf{F} = (2xy + z^{2})\\,\\mathbf{i} + x^{2}\\,\\mathbf{j} + 2xz\\,\\mathbf{k}$.

**Test first.**

$$\\nabla\\times\\mathbf{F} = \\bigl(0 - 0,\\; 2z - 2z,\\; 2x - 2x\\bigr) = \\mathbf{0}$$

so a potential exists.

**Build it.** Integrate the first component with respect to $x$, treating the
others as constants:

$$\\varphi = \\int (2xy + z^{2})\\,dx = x^{2}y + xz^{2} + g(y, z)$$

Differentiating this with respect to $y$ gives $x^{2} + \\partial g/\\partial y$,
which must equal $F_{y} = x^{2}$, so $g$ does not depend on $y$. Differentiating
with respect to $z$ gives $2xz + \\partial g/\\partial z$, which must equal
$F_{z} = 2xz$, so $g$ does not depend on $z$ either. Taking the constant as zero,

$$\\varphi = x^{2}y + xz^{2}$$

**Use it.** The work from the origin to $(1, 2, 3)$ is

$$\\varphi(1,2,3) - \\varphi(0,0,0) = 2 + 9 = 11$$

**Confirm it, three ways.** Along the straight line $\\mathbf{r}(t) = t(1,2,3)$ the
integral evaluates to 11. Along the broken path that runs out the $x$-axis, then
parallel to $y$, then parallel to $z$, the three legs contribute 0, 2 and 9 — and
$0 + 2 + 9 = 11$. Along a deliberately awkward wiggling path from the same start
to the same end, numerical quadrature returns 11 to eight decimal places. The
potential did in one subtraction what three integrals had to work for.

## 11.6 Worked: reading path independence as voltage

In an electrostatic field, $\\mathbf{E} = -\\nabla V$ and therefore

$$V_{a} - V_{b} = \\int_{b}^{a}\\mathbf{E}\\cdot d\\mathbf{l}$$

with the value independent of the route taken. That independence is what allows a
voltmeter reading to be a property of two terminals rather than of the wire
between them, and it is why Kirchhoff's voltage law can be written down at all:
a loop returns to its starting potential because the field is a gradient.

Take a uniform field $\\mathbf{E} = 200\\,\\mathbf{i}$ volts per metre and two points
2 cm apart along $x$. Then

$$V_{a} - V_{b} = 200 \\times 0.02 = 4$$

volts, whatever path is taken between them, because a constant field is the
gradient of the linear potential $V = -200x$. Move perpendicular to the field
instead and the integral is zero — the two points sit on the same equipotential,
which is the perpendicularity result of Section 8.2 in its most practical form.

When the field is **not** static, this all breaks: Faraday's law makes
$\\nabla\\times\\mathbf{E} = -\\partial\\mathbf{B}/\\partial t$, the field stops being a
gradient, and the loop integral becomes the induced electromotive force rather
than zero. That single change is the whole difference between circuit theory and
transformer action.`,
  examTip: 'Compute the curl before parametrising a path. Zero curl means find a potential and subtract two numbers; non-zero curl means you must actually integrate, and the answer depends on the route you were given rather than on the endpoints alone.',
  importantNote: 'A scalar line integral against ds is unchanged by reversing the path; a work integral against dr changes sign. If a question reverses the direction of travel and the answer does not move, check which of the two integrals was actually asked for.',
},
{
  id: 'va-surface-flux',
  title: '12. Surface Integrals and Flux',
  content: `## 12.1 Area on a curved surface

A surface needs two parameters, so it is described by $\\mathbf{r}(u, v)$. The two
partial derivatives $\\mathbf{r}_{u}$ and $\\mathbf{r}_{v}$ are tangent to it, and a
small parameter rectangle maps to a small parallelogram whose area is the
magnitude of their cross product:

$$dS = \\lvert \\mathbf{r}_{u}\\times\\mathbf{r}_{v}\\rvert\\;du\\,dv, \\qquad \\hat{\\mathbf{n}} = \\frac{\\mathbf{r}_{u}\\times\\mathbf{r}_{v}}{\\lvert \\mathbf{r}_{u}\\times\\mathbf{r}_{v}\\rvert}$$

That is the whole apparatus, and it is just the cross-product area rule from
Section 6.3 applied one small patch at a time. For a surface given as a graph
$z = g(x, y)$ the parametrisation is $(x,\\; y,\\; g)$ and the formula collapses to

$$dS = \\sqrt{1 + \\left(\\frac{\\partial g}{\\partial x}\\right)^{2} + \\left(\\frac{\\partial g}{\\partial y}\\right)^{2}}\\;dx\\,dy$$

which is the two-dimensional version of the arc-length factor $\\sqrt{1 + (dy/dx)^{2}}$.

Two surfaces come up so often they are worth memorising. On a **sphere** of
radius $a$, $dS = a^{2}\\sin\\theta\\,d\\theta\\,d\\phi$. On the curved side of a
**cylinder** of radius $a$, $dS = a\\,d\\phi\\,dz$.

## 12.2 Worked: the area of a paraboloid cap

Find the area of the part of $z = x^{2} + y^{2}$ lying below $z = 4$.

Here $\\partial g/\\partial x = 2x$ and $\\partial g/\\partial y = 2y$, so
$dS = \\sqrt{1 + 4x^{2} + 4y^{2}}\\,dx\\,dy$. In polar coordinates the region is the
disc of radius 2 and the integrand depends only on $r$:

$$S = \\int_{0}^{2\\pi}\\!\\!\\int_{0}^{2}\\sqrt{1 + 4r^{2}}\\;r\\,dr\\,d\\theta = 2\\pi\\left[\\frac{(1 + 4r^{2})^{3/2}}{12}\\right]_{0}^{2}$$

$$S = \\frac{2\\pi\\,(17^{3/2} - 1)}{12} = \\frac{\\pi(17^{3/2} - 1)}{6} = 36.1769$$

**Check the shape.** The flat disc underneath has area $4\\pi = 12.566$, and the
curved cap is much steeper than flat near its rim, so a figure roughly three
times larger is what one should expect. Numerical quadrature over the same region
returns 36.176903.

## 12.3 Flux: the surface integral of a vector field

Flux keeps only the part of the field that crosses the surface:

$$\\Phi = \\iint_{S}\\mathbf{F}\\cdot\\hat{\\mathbf{n}}\\;dS$$

The dot product with the unit normal is doing all the work, and the whole art of
Gauss's-law problems is choosing a surface on which $\\mathbf{F}\\cdot\\hat{\\mathbf{n}}$
is either constant or zero, so that the integral becomes a multiplication.

Orientation must be declared. For a **closed** surface the convention is
outward-pointing; for an open surface the choice is free but must then be matched
by the direction the boundary is traversed, through the right-hand rule.

## 12.4 Worked: three flux calculations that need no integration

**A flat plate in a uniform field.** With $\\mathbf{F} = 5\\,\\mathbf{k}$ and a plate
2 m by 3 m in the $xy$ plane, $\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = 5$ everywhere, so
$\\Phi = 5 \\times 6 = 30$. Tilt the plate by $60^\\circ$ and the normal tilts with
it, giving $\\Phi = 5\\cos 60^\\circ \\times 6 = 15$. Only the projected area matters.

**A sphere in a radial field.** With $\\mathbf{F} = \\mathbf{r} = (x, y, z)$ and a
sphere of radius 2, the outward normal is $\\mathbf{r}/2$, so
$\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = \\lvert \\mathbf{r}\\rvert = 2$ at every point. The
sphere has area $4\\pi(2)^{2} = 16\\pi$, so

$$\\Phi = 2 \\times 16\\pi = 32\\pi = 100.531$$

**A cylinder in a radial plane field.** With $\\mathbf{F} = x\\,\\mathbf{i} + y\\,\\mathbf{j}$,
a cylinder of radius 2 and height 5 has $\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = 2$ on its
curved side and 0 on its flat ends, because the field has no $z$-component. The
curved area is $2\\pi(2)(5) = 20\\pi$, so

$$\\Phi = 2 \\times 20\\pi = 40\\pi = 125.664$$

Every one of these was also evaluated by numerical quadrature over the actual
surface, and every one agreed to nine decimal places. They are quoted here not
because the integrals are hard but because **choosing the surface is the skill**,
and on all three the integral degenerated into an area times a constant.

## 12.5 A flux that does not depend on the surface at all

Take the inverse-square field $\\mathbf{F} = \\hat{\\mathbf{a}}_{r}/r^{2}$. On a sphere of
radius $a$ centred at the origin, $\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = 1/a^{2}$ and the
area is $4\\pi a^{2}$, so

$$\\Phi = \\frac{1}{a^{2}} \\times 4\\pi a^{2} = 4\\pi$$

The radius cancels completely. Evaluating the same flux numerically at radii 0.5,
2 and 7 returns $4\\pi$ every time. This is Gauss's law in its purest form: the
flux out of any closed surface counts what is inside and is indifferent to the
shape and size of the surface. Section 13.4 explains why, and Section 14.5 shows
that the divergence of this field is zero everywhere the field is defined — which
is the other half of the same story.`,
  examTip: 'Before integrating a flux, ask whether the field is constant on the surface or perpendicular to part of it. On the surfaces the exam supplies — spheres, cylinders, flat plates — the answer is usually yes, and the integral becomes one multiplication.',
},
{
  id: 'va-three-theorems',
  title: '13. Green, Stokes and the Divergence Theorem',
  content: `## 13.1 One idea in three costumes

Each of the three theorems says the same thing: **what a derivative does inside a
region is decided by what the function does on its boundary.** They differ only in
how many dimensions the region has.

| Theorem | Region | Boundary | Statement |
|---|---|---|---|
| Fundamental theorem of calculus | interval | two endpoints | $\\int_{a}^{b}f'\\,dx = f(b) - f(a)$ |
| Gradient theorem | curve | two endpoints | $\\int_{C}\\nabla\\varphi\\cdot d\\mathbf{r} = \\varphi(\\text{end}) - \\varphi(\\text{start})$ |
| Green | plane region | closed curve | circulation equals the integral of the plane curl |
| Stokes | surface in space | rim of the surface | circulation equals the flux of the curl |
| Divergence | solid | closed surface | flux equals the integral of the divergence |

Green's theorem is Stokes' theorem with the surface lying flat in a plane, so
strictly there are two theorems here, not three. Keeping that in mind removes
half the memorisation.

## 13.2 Green's theorem

**Statement.** Let $C$ be a piecewise-smooth, simple, closed curve traversed
counterclockwise, bounding a region $R$ in the plane, and let $P$ and $Q$ have
continuous first partial derivatives on an open set containing $R$. Then

$$\\oint_{C}\\bigl(P\\,dx + Q\\,dy\\bigr) = \\iint_{R}\\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)dA$$

**Hypotheses that matter.** *Simple* means the curve does not cross itself.
*Counterclockwise* fixes the sign — the region must stay on the left as you
travel. *Continuous partials on the region* excludes fields with a singularity
inside, which is the condition the inverse-square swirl of Section 9.4 violates.

**A corollary worth having.** Choosing $P = -y/2$ and $Q = x/2$ makes the
integrand exactly 1, so

$$\\text{Area}(R) = \\frac{1}{2}\\oint_{C}\\bigl(x\\,dy - y\\,dx\\bigr)$$

Area from a boundary walk alone — which is how a planimeter works.

## 13.3 Worked: Green's theorem on a region with two curved edges

Take the region between $y = x^{2}$ and $y = x$ for $x$ from 0 to 1, and the field
$\\mathbf{F} = xy\\,\\mathbf{i} + x^{2}\\,\\mathbf{j}$.

**The double integral.** Here $\\partial Q/\\partial x - \\partial P/\\partial y = 2x - x = x$, and the
region runs from the parabola up to the line:

$$\\iint_{R} x\\,dA = \\int_{0}^{1}\\!\\!\\int_{x^{2}}^{x} x\\;dy\\,dx = \\int_{0}^{1} x(x - x^{2})\\,dx = \\frac{1}{3} - \\frac{1}{4} = \\frac{1}{12}$$

**The line integral.** Counterclockwise means out along the parabola and back
along the line, because that keeps the region on the left. Out, with $x = t$ and
$y = t^{2}$:

$$\\int_{0}^{1}\\bigl(t\\cdot t^{2} + t^{2}\\cdot 2t\\bigr)dt = \\int_{0}^{1} 3t^{3}\\,dt = \\frac{3}{4}$$

Back, with $x = y = u$ running from 1 to 0:

$$\\int_{1}^{0}\\bigl(u^{2} + u^{2}\\bigr)du = -\\frac{2}{3}$$

Adding, $3/4 - 2/3 = 9/12 - 8/12 = 1/12$. Both sides come to 0.083333.

![The region between a parabola and a straight line from the origin to the point one one, shaded, with arrows showing the boundary traversed out along the parabola and back along the line, and both sides of Green's theorem printed as 0.083333.](/courses/fe-ee/figures/math6-va-green.svg)

**The area corollary on the same region.** Walking the same boundary with the
area integrand gives $1/6$, and the double integral of 1 over the region is
$\\int_{0}^{1}(x - x^{2})dx = 1/2 - 1/3 = 1/6$. Two more numbers that agree.

**Trap.** Traversing the boundary clockwise negates the line integral without
touching the double integral, giving $-1/12$ against $+1/12$. If the two sides
of Green's theorem differ only in sign, the orientation is the thing to check.

## 13.4 Stokes' theorem

**Statement.** Let $S$ be a piecewise-smooth oriented surface whose boundary $C$
is a piecewise-smooth simple closed curve, oriented so that the right-hand rule
relates it to the chosen normal. If $\\mathbf{F}$ has continuous first partial
derivatives on an open set containing $S$, then

$$\\oint_{C}\\mathbf{F}\\cdot d\\mathbf{r} = \\iint_{S}(\\nabla\\times\\mathbf{F})\\cdot\\hat{\\mathbf{n}}\\;dS$$

**What it means practically.** The right-hand side depends on the surface only
through its rim, so **any** surface with the same boundary gives the same answer.
A loop of wire can be spanned by a flat disc or by a bag-shaped surface, and the
flux of the curl through both is identical — which is the reason Ampere's law can
be applied to whichever surface makes the algebra easiest.

**The link to Section 9.2.** Stokes' theorem is the shrinking-loop definition of
curl, summed over a surface: cut the surface into tiny loops, note that adjacent
loops cancel along shared edges, and only the outer rim survives.

## 13.5 Worked: Stokes' theorem on a first-octant triangle

Take $\\mathbf{F} = y\\,\\mathbf{i} + z\\,\\mathbf{j} + x\\,\\mathbf{k}$ and the triangle cut
from the plane $x + y + z = 1$ by the coordinate planes, with vertices
$(1,0,0)$, $(0,1,0)$ and $(0,0,1)$.

**The surface side.** The curl is constant:

$$\\nabla\\times\\mathbf{F} = (0 - 1,\\; 0 - 1,\\; 0 - 1) = (-1, -1, -1)$$

The unit normal is $\\hat{\\mathbf{n}} = (1,1,1)/\\sqrt{3}$, so
$(\\nabla\\times\\mathbf{F})\\cdot\\hat{\\mathbf{n}} = -3/\\sqrt{3} = -\\sqrt{3}$. The triangle
has area $\\sqrt{3}/2$, from half the magnitude of the cross product of two of its
edges. Therefore

$$\\iint_{S}(\\nabla\\times\\mathbf{F})\\cdot\\hat{\\mathbf{n}}\\,dS = -\\sqrt{3}\\times\\frac{\\sqrt{3}}{2} = -1.5$$

**The rim side.** Traverse the vertices in the order $(1,0,0)$, $(0,1,0)$,
$(0,0,1)$, which is the direction the right-hand rule pairs with that normal. On
the first leg, $\\mathbf{r}(t) = (1 - t,\\; t,\\; 0)$ and $d\\mathbf{r} = (-1, 1, 0)dt$,
while $\\mathbf{F} = (t,\\; 0,\\; 1 - t)$, so the integrand is $-t$ and the leg
contributes $-\\tfrac{1}{2}$. By the cyclic symmetry of both the field and the
triangle, each of the other two legs contributes $-\\tfrac{1}{2}$ as well:

$$\\oint_{C}\\mathbf{F}\\cdot d\\mathbf{r} = -\\frac{1}{2} - \\frac{1}{2} - \\frac{1}{2} = -1.5$$

Both sides come to $-1.500000$, computed independently.

![The triangle cut from the plane x plus y plus z equals one by the three coordinate planes, shaded, with arrows around its rim and the unit normal drawn from its centroid, and both sides of Stokes theorem printed as minus 1.5.](/courses/fe-ee/figures/math6-va-stokes.svg)

**Why the sign is negative.** The curl points into the octant, opposite the chosen
normal, so the flux is negative and the circulation must be too. Reversing the
traversal would flip both sides together — never one of them.

## 13.6 The divergence theorem

**Statement.** Let $V$ be a solid region bounded by a piecewise-smooth closed
surface $S$, oriented with outward normals, and let $\\mathbf{F}$ have continuous
first partial derivatives on an open set containing $V$. Then

$$\\oint_{S}\\mathbf{F}\\cdot\\hat{\\mathbf{n}}\\;dS = \\iiint_{V}(\\nabla\\cdot\\mathbf{F})\\;dV$$

Again this is the shrinking-box definition of Section 9.1 summed over a region:
fill the solid with tiny boxes, note that the flux out of one face is the flux
into its neighbour, and only the outer skin survives.

**The hypothesis that gets violated.** *Continuous partials throughout* fails for
the inverse-square field at the origin, which is why a Gaussian surface enclosing
a point charge has non-zero flux even though the divergence vanishes everywhere
the field is defined. Nothing is broken; the theorem simply does not apply to a
region containing the singularity.

## 13.7 Worked: the divergence theorem on a cylinder

Take $\\mathbf{F} = x\\,\\mathbf{i} + y\\,\\mathbf{j}$ and the solid cylinder of radius 2
and height 5 standing on the $xy$ plane.

**The volume side.** $\\nabla\\cdot\\mathbf{F} = 1 + 1 = 2$, a constant, so the
integral is twice the volume:

$$\\iiint_{V} 2\\,dV = 2\\pi(2)^{2}(5) = 40\\pi = 125.6637$$

**The surface side.** On the curved wall $\\hat{\\mathbf{n}} = (x, y, 0)/2$, so
$\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = (x^{2} + y^{2})/2 = 2$. On the flat top and bottom
$\\hat{\\mathbf{n}} = \\pm\\mathbf{k}$ and the field has no $z$-component, so both
contribute nothing. The curved area is $2\\pi(2)(5) = 20\\pi$, giving

$$\\oint_{S}\\mathbf{F}\\cdot\\hat{\\mathbf{n}}\\;dS = 2 \\times 20\\pi = 40\\pi = 125.6637$$

Both sides agree to nine decimal places under numerical quadrature.

![A cylinder of radius two and height five drawn in axonometric projection, with radial arrows leaving its curved wall, and both sides of the divergence theorem printed as 125.6637.](/courses/fe-ee/figures/math6-va-divergence.svg)

## 13.8 Worked: the divergence theorem on a sphere, where the integral is real

The cylinder was easy because the divergence was constant. Take instead
$\\mathbf{F} = x^{3}\\,\\mathbf{i} + y^{3}\\,\\mathbf{j} + z^{3}\\,\\mathbf{k}$ over the unit
ball.

**The volume side.** $\\nabla\\cdot\\mathbf{F} = 3(x^{2} + y^{2} + z^{2}) = 3r^{2}$,
which depends only on $r$, so integrate in shells of volume $4\\pi r^{2}dr$:

$$\\iiint_{V} 3r^{2}\\,dV = \\int_{0}^{1} 3r^{2}\\,(4\\pi r^{2})\\,dr = 12\\pi\\int_{0}^{1} r^{4}\\,dr = \\frac{12\\pi}{5} = 7.5398$$

**The surface side.** On the unit sphere $\\hat{\\mathbf{n}} = (x, y, z)$, so
$\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = x^{4} + y^{4} + z^{4}$, which is genuinely
variable over the surface. Integrating it by Gauss-Legendre quadrature in
$\\cos\\theta$ and the midpoint rule in $\\phi$ gives 7.539822 — the same
$12\\pi/5$.

This is the case worth practising, because the surface integral could not be
guessed and the volume integral could. **When one side of the theorem is hard and
the other is easy, the theorem is a shortcut, not a formality.**`,
  examTip: 'Read which side of the theorem the question hands you. A closed surface with an awkward field usually means convert to a volume integral of the divergence; a nasty closed-loop integral usually means convert to a flux of the curl through whatever surface is convenient.',
  importantNote: 'Every one of these theorems has an orientation hypothesis. Counterclockwise for Green, right-hand rule for Stokes, outward normals for the divergence theorem. Getting orientation wrong produces an answer that is correct in magnitude and wrong in sign, and the negated value is almost always among the choices.',
},
{
  id: 'va-curvilinear',
  title: '14. Cylindrical and Spherical Coordinates',
  content: `## 14.1 Why change coordinates at all

A coaxial cable, a solenoid and a point charge have no natural corners, and
Cartesian components of their fields are messy for the same reason square tiles
are a poor way to describe a circle. Choosing coordinates that match the symmetry
usually turns a three-variable problem into a one-variable one.

**Cylindrical** coordinates use the distance $\\rho$ from the $z$-axis, the
azimuth $\\phi$ measured round it, and $z$ itself:

$$x = \\rho\\cos\\phi, \\quad y = \\rho\\sin\\phi, \\quad z = z$$

$$\\rho = \\sqrt{x^{2} + y^{2}}, \\quad \\phi = \\arctan\\frac{y}{x}, \\quad z = z$$

**Spherical** coordinates use the distance $r$ from the origin, the polar angle
$\\theta$ measured down from the $z$-axis, and the same azimuth $\\phi$:

$$x = r\\sin\\theta\\cos\\phi, \\quad y = r\\sin\\theta\\sin\\phi, \\quad z = r\\cos\\theta$$

$$r = \\sqrt{x^{2} + y^{2} + z^{2}}, \\quad \\theta = \\arccos\\frac{z}{r}, \\quad \\phi = \\arctan\\frac{y}{x}$$

The arctangent needs the quadrant restored by inspection; a calculator returning
$-53^\\circ$ for a point in the second quadrant is not wrong, only incomplete.

Volume elements follow from the geometry of a small block in each system:

$$dV = \\rho\\;d\\rho\\,d\\phi\\,dz \\quad\\text{(cylindrical)}, \\qquad dV = r^{2}\\sin\\theta\\;dr\\,d\\theta\\,d\\phi \\quad\\text{(spherical)}$$

## 14.2 The unit vectors move, and that is the whole difficulty

In Cartesian coordinates $\\mathbf{i}$, $\\mathbf{j}$, $\\mathbf{k}$ point the same way
everywhere, so they can be pulled out of any derivative. **The curvilinear unit
vectors cannot**, because they depend on position:

$$\\hat{\\mathbf{a}}_{\\rho} = \\cos\\phi\\,\\mathbf{i} + \\sin\\phi\\,\\mathbf{j}, \\qquad \\hat{\\mathbf{a}}_{\\phi} = -\\sin\\phi\\,\\mathbf{i} + \\cos\\phi\\,\\mathbf{j}$$

$$\\hat{\\mathbf{a}}_{r} = \\sin\\theta\\cos\\phi\\,\\mathbf{i} + \\sin\\theta\\sin\\phi\\,\\mathbf{j} + \\cos\\theta\\,\\mathbf{k}, \\qquad \\hat{\\mathbf{a}}_{\\theta} = \\cos\\theta\\cos\\phi\\,\\mathbf{i} + \\cos\\theta\\sin\\phi\\,\\mathbf{j} - \\sin\\theta\\,\\mathbf{k}$$

Each set is right-handed in the order given:
$\\hat{\\mathbf{a}}_{\\rho}\\times\\hat{\\mathbf{a}}_{\\phi} = \\hat{\\mathbf{a}}_{z}$ and
$\\hat{\\mathbf{a}}_{r}\\times\\hat{\\mathbf{a}}_{\\theta} = \\hat{\\mathbf{a}}_{\\phi}$.

This position dependence is the entire reason the divergence and curl formulas
below carry extra factors of $\\rho$, $r$ and $\\sin\\theta$: differentiating a field
also differentiates the directions it is written in, and those factors are the
bookkeeping. It is also why **the vector Laplacian is not componentwise** outside
Cartesian coordinates, and why the identity of Section 10.4 has to be used as a
definition there.

![Left: the cylindrical unit vectors drawn at the point (3, 4) in the plane, with the radius of five and the azimuth of 53.13 degrees marked. Right: the spherical frame drawn at (3, 4, 5) in axonometric projection, with r equal to the square root of fifty, theta forty-five degrees and phi 53.13 degrees.](/courses/fe-ee/figures/math6-va-coordinates.svg)

## 14.3 The operators, stated

**Cylindrical.**

$$\\nabla f = \\frac{\\partial f}{\\partial\\rho}\\hat{\\mathbf{a}}_{\\rho} + \\frac{1}{\\rho}\\frac{\\partial f}{\\partial\\phi}\\hat{\\mathbf{a}}_{\\phi} + \\frac{\\partial f}{\\partial z}\\hat{\\mathbf{a}}_{z}$$

$$\\nabla\\cdot\\mathbf{A} = \\frac{1}{\\rho}\\frac{\\partial(\\rho A_{\\rho})}{\\partial\\rho} + \\frac{1}{\\rho}\\frac{\\partial A_{\\phi}}{\\partial\\phi} + \\frac{\\partial A_{z}}{\\partial z}$$

$$\\nabla^{2}f = \\frac{1}{\\rho}\\frac{\\partial}{\\partial\\rho}\\left(\\rho\\frac{\\partial f}{\\partial\\rho}\\right) + \\frac{1}{\\rho^{2}}\\frac{\\partial^{2}f}{\\partial\\phi^{2}} + \\frac{\\partial^{2}f}{\\partial z^{2}}$$

**Spherical.**

$$\\nabla f = \\frac{\\partial f}{\\partial r}\\hat{\\mathbf{a}}_{r} + \\frac{1}{r}\\frac{\\partial f}{\\partial\\theta}\\hat{\\mathbf{a}}_{\\theta} + \\frac{1}{r\\sin\\theta}\\frac{\\partial f}{\\partial\\phi}\\hat{\\mathbf{a}}_{\\phi}$$

$$\\nabla\\cdot\\mathbf{A} = \\frac{1}{r^{2}}\\frac{\\partial(r^{2}A_{r})}{\\partial r} + \\frac{1}{r\\sin\\theta}\\frac{\\partial(A_{\\theta}\\sin\\theta)}{\\partial\\theta} + \\frac{1}{r\\sin\\theta}\\frac{\\partial A_{\\phi}}{\\partial\\phi}$$

$$\\nabla^{2}f = \\frac{1}{r^{2}}\\frac{\\partial}{\\partial r}\\left(r^{2}\\frac{\\partial f}{\\partial r}\\right) + \\frac{1}{r^{2}\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial f}{\\partial\\theta}\\right) + \\frac{1}{r^{2}\\sin^{2}\\theta}\\frac{\\partial^{2}f}{\\partial\\phi^{2}}$$

These are in the reference handbook, so they do not need memorising — but knowing
**which** one a problem wants, and that the extra factors are not typographical
noise, does.

| Symmetry in the problem | Coordinates | Field depends on |
|---|---|---|
| Long straight wire, coaxial cable, solenoid | cylindrical | $\\rho$ alone |
| Point charge, isolated sphere, radiating antenna far field | spherical | $r$ alone |
| Parallel plates, rectangular waveguide | Cartesian | one Cartesian variable |

## 14.4 Worked: converting a point and a vector

Take the point $(3, 4, 5)$.

**Cylindrical.** $\\rho = \\sqrt{9 + 16} = 5$, $\\phi = \\arctan(4/3) = 53.13^\\circ$,
$z = 5$.

**Spherical.** $r = \\sqrt{9 + 16 + 25} = \\sqrt{50} = 7.0711$, and

$$\\cos\\theta = \\frac{5}{7.07107} = 0.70711, \\qquad \\theta = 45^\\circ$$

with the same $\\phi = 53.13^\\circ$. The polar angle is $45^\\circ$ because the point
is as far out sideways as it is up, which is a check worth making before trusting
a calculator entry.

**Now a vector at that point.** Let $\\mathbf{A} = 3\\mathbf{i} + 4\\mathbf{j}$. Its
cylindrical components come from dotting with the local unit vectors, using
$\\cos\\phi = 0.6$ and $\\sin\\phi = 0.8$:

$$A_{\\rho} = \\mathbf{A}\\cdot\\hat{\\mathbf{a}}_{\\rho} = 3(0.6) + 4(0.8) = 1.8 + 3.2 = 5$$

$$A_{\\phi} = \\mathbf{A}\\cdot\\hat{\\mathbf{a}}_{\\phi} = -3(0.8) + 4(0.6) = -2.4 + 2.4 = 0$$

So $\\mathbf{A} = 5\\,\\hat{\\mathbf{a}}_{\\rho}$ at that point — which had to happen,
because $\\mathbf{A}$ points from the axis straight at the point. Its magnitude is
unchanged at 5, as any change of orthonormal frame must leave it.

**Trap.** Writing $\\mathbf{A} = 5\\,\\hat{\\mathbf{a}}_{\\rho}$ and treating that as a
statement about the whole field rather than about one point. At $(-3, 4, 0)$ the
same Cartesian field has $\\cos\\phi = -0.6$, giving $A_{\\rho} = -1.8 + 3.2 = 1.4$
and $A_{\\phi} = -2.4 - 2.4 = -4.8$. The components of a fixed field in a moving
frame are position-dependent, and that is not a paradox.

## 14.5 Worked: divergence in cylindrical coordinates, checked against the theorem

Take $\\mathbf{F} = \\rho^{2}\\,\\hat{\\mathbf{a}}_{\\rho}$, a purely radial field growing
with distance from the axis. Using the cylindrical divergence formula,

$$\\nabla\\cdot\\mathbf{F} = \\frac{1}{\\rho}\\frac{\\partial}{\\partial\\rho}\\bigl(\\rho\\cdot\\rho^{2}\\bigr) = \\frac{3\\rho^{2}}{\\rho} = 3\\rho$$

**Check by the divergence theorem** on a cylinder of radius 2 and height 5. On
the curved wall $\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = \\rho^{2} = 4$, and the flat ends
contribute nothing, so

$$\\oint_{S}\\mathbf{F}\\cdot\\hat{\\mathbf{n}}\\;dS = 4 \\times 2\\pi(2)(5) = 80\\pi = 251.327$$

On the other side,

$$\\iiint_{V} 3\\rho\\;dV = \\int_{0}^{5}\\!\\!\\int_{0}^{2\\pi}\\!\\!\\int_{0}^{2} 3\\rho\\cdot\\rho\\;d\\rho\\,d\\phi\\,dz = 3(5)(2\\pi)\\frac{8}{3} = 80\\pi$$

The two agree, and note that the volume element supplied the extra $\\rho$ that
made the powers work out. **Forgetting that factor is the single most common
error in cylindrical integration**, and it produces an answer that is out by a
factor with the wrong units, so it is catchable.

## 14.6 Worked: the Coulomb potential in spherical coordinates

Take $V = k/r$ away from the origin. Since $V$ depends on $r$ alone, only the
first term of the spherical Laplacian survives:

$$\\frac{\\partial V}{\\partial r} = -\\frac{k}{r^{2}}, \\qquad r^{2}\\frac{\\partial V}{\\partial r} = -k$$

which is a constant, so its $r$-derivative is zero and

$$\\nabla^{2}V = 0 \\quad (r > 0)$$

The Coulomb potential satisfies Laplace's equation everywhere except at the
charge itself. Correspondingly the field

$$\\mathbf{E} = -\\nabla V = \\frac{k}{r^{2}}\\,\\hat{\\mathbf{a}}_{r}$$

has divergence

$$\\nabla\\cdot\\mathbf{E} = \\frac{1}{r^{2}}\\frac{\\partial}{\\partial r}\\left(r^{2}\\cdot\\frac{k}{r^{2}}\\right) = \\frac{1}{r^{2}}\\frac{\\partial k}{\\partial r} = 0 \\quad (r > 0)$$

and yet its flux out of any sphere is $4\\pi k$, independent of radius. There is no
contradiction: the divergence theorem requires continuous derivatives throughout
the region, and the origin is excluded. **All of the source sits at the one point
the theorem is not allowed to see** — which is the statement Gauss's law makes
formal, and it is the reason a point charge is described by a delta function
rather than by an ordinary density.

The same structure one dimension lower gives the field of a line charge:
$\\mathbf{F} = \\hat{\\mathbf{a}}_{\\rho}/\\rho$ has zero divergence away from the axis,
and its flux through a cylinder of radius $R$ and height $h$ is
$(1/R)(2\\pi Rh) = 2\\pi h$ — the radius cancels, so the answer depends only on how
much of the line is enclosed. That is why the field of a long wire falls as
$1/\\rho$ while the field of a point falls as $1/r^{2}$.`,
  examTip: 'Match the coordinate system to the symmetry before writing anything down. A field that depends only on distance from an axis wants cylindrical; a field that depends only on distance from a point wants spherical. Picking correctly usually reduces a triple integral to a single one.',
  importantNote: 'The volume element carries rho in cylindrical coordinates and r squared sin(theta) in spherical. Omitting it is the most common integration error in this material, and unlike a sign slip it changes the units of the answer, so a quick dimensional check catches it.',
},
{
  id: 'va-crossrefs',
  title: '15. Where This Material Is Actually Examined',
  content: `## 15.1 Maxwell's equations are this chapter, applied

Every operator built above appears in the four equations that the
Electromagnetics topics are organised around. Nothing new is needed to read them
— only the meanings derived in Sections 8 to 10.

| Equation | Operator | What Sections 8 to 10 said it means |
|---|---|---|
| $\\nabla\\cdot\\mathbf{D} = \\rho_{v}$ | divergence | flux per unit volume; charge is a source of $\\mathbf{D}$ |
| $\\nabla\\cdot\\mathbf{B} = 0$ | divergence | nothing sources $\\mathbf{B}$; it only circulates |
| $\\nabla\\times\\mathbf{E} = -\\dfrac{\\partial\\mathbf{B}}{\\partial t}$ | curl | circulation per unit area; a changing $\\mathbf{B}$ drives a loop of $\\mathbf{E}$ |
| $\\nabla\\times\\mathbf{H} = \\mathbf{J} + \\dfrac{\\partial\\mathbf{D}}{\\partial t}$ | curl | current and changing $\\mathbf{D}$ drive a loop of $\\mathbf{H}$ |

Their integral forms are the three theorems of Section 13 applied to those four
statements — Gauss's law is the divergence theorem applied to the first, and
Faraday's and Ampere's laws are Stokes' theorem applied to the last two. The
Electromagnetics chapters work all of that through with numbers; this chapter
supplies the machinery and the proofs. Two results in particular are used there
without re-derivation, and both are established above: $\\mathbf{E} = -\\nabla V$
with the field perpendicular to equipotentials (Section 8.4), and the
independence of an electrostatic line integral from the path (Section 11.6).

## 15.2 The Laplace transform, and where the full treatment lives

Sections 1, 4 and 5 of this chapter keep a working summary of the Laplace
transform because the pole-location reading in Section 4.4 belongs next to the
field material historically. The complete treatment is elsewhere and should be
studied there rather than here:

- **Differential Equations** develops the transform properly, including the
  derivative rule carrying initial conditions, partial fractions, and solving
  circuit transients end to end.
- **Transfer Functions** in Linear Systems builds the $s$-domain description of
  systems, poles and zeros, and frequency response.
- **Z-Transforms** in Linear Systems does the discrete-time counterpart.
- **Control Systems** uses pole locations for stability, which is the single fact
  Section 4.4 summarises.

The one connection worth making explicitly here is that the transform and the
vector operators solve the same kind of problem from opposite ends. The transform
turns a differential equation in **time** into algebra; the integral theorems turn
a differential statement in **space** into an algebraic relation between a region
and its boundary. Both replace calculus with bookkeeping.

## 15.3 A trap table for the whole chapter

| Trap | What it produces | How to catch it |
|---|---|---|
| Dot used where cross was needed | a cosine where a sine belongs | check whether the answer should be a number or a direction |
| Middle term of a cross product not negated | one component wrong, magnitude plausible | the result must dot to zero with both inputs |
| Direction vector not normalised | directional derivative too large by the vector's length | check that the direction has length 1 |
| Volume element omitted in cylindrical or spherical integration | answer out by a factor with wrong units | dimensional check |
| Boundary traversed the wrong way | correct magnitude, wrong sign | region must stay on the left; right-hand rule for Stokes |
| Theorem applied across a singularity | apparent contradiction between zero divergence and non-zero flux | check the hypothesis of continuous derivatives |
| Curvilinear unit vectors treated as constants | wrong divergence and curl | they depend on position; use the stated formulas |
| Vector Laplacian taken componentwise outside Cartesian | wrong answer with no warning | use the double-curl identity as the definition |

## 15.4 What to do in the first ten seconds of a vector question

1. **Identify the types.** Scalar in, vector out means gradient. Vector in, scalar
   out means divergence or a dot product. Vector in, vector out means curl or a
   cross product. A type mismatch is an error you can see before computing.
2. **Look for a symmetry.** Radial from a point, radial from an axis, or neither.
   That choice decides the coordinate system and often the whole method.
3. **Take the curl if a path integral is asked for.** Zero curl means find a
   potential and subtract two numbers.
4. **Ask whether a theorem converts the hard side into the easy one.** A flux
   through an awkward closed surface, or a circulation round an awkward closed
   loop, is nearly always meant to be converted.
5. **Check the answer against something independent.** Perpendicularity, a sign, a
   limiting case, or an order of magnitude. Every worked example in this chapter
   carries such a check, because that habit is what separates a right answer from
   a plausible one.`,
  examTip: 'This chapter is examined mostly through Electromagnetics. If a field question looks unfamiliar, name the operator it needs and the symmetry it has before anything else; those two decisions usually determine the answer within a factor you can check.',
},
{
  id: 'va-set-b',
  title: '16. Problem Set: Products, Fields and Operators',
  content: `## 16.1 Problem Set A

Work each one before reading on. Every answer below is checked by a second route.

**A1.** For $\\mathbf{A} = (2, -1, 3)$ and $\\mathbf{B} = (1, 4, -2)$, find the dot
product, the cross product, the angle between them, and the area of the triangle
they span.

$$\\mathbf{A}\\cdot\\mathbf{B} = 2 - 4 - 6 = -8$$

$$\\mathbf{A}\\times\\mathbf{B} = \\bigl(2 - 12,\\; -(-4 - 3),\\; 8 + 1\\bigr) = (-10,\\; 7,\\; 9)$$

The lengths are $\\lvert \\mathbf{A}\\rvert = \\sqrt{14} = 3.741657$ and
$\\lvert \\mathbf{B}\\rvert = \\sqrt{21} = 4.582576$, so

$$\\cos\\theta = \\frac{-8}{\\sqrt{294}} = -0.466569, \\qquad \\theta = 117.81^\\circ$$

The triangle area is half the parallelogram area:
$\\sqrt{230} = 15.165751$, and $15.165751/2 = 7.58288$.

**Check.** The angle from the cross product must agree:
$\\sin\\theta = 15.165751/17.146428 = 0.884485$, whose obtuse solution is
$117.81^\\circ$. Lagrange's identity closes it: $64 + 230 = 294$, and
$14 \\times 21 = 294$.

**Trap.** Taking $\\arcsin(0.884485) = 62.19^\\circ$ and stopping. The sine cannot
distinguish an angle from its supplement; the **sign of the dot product** decides,
and here it is negative, so the angle is obtuse.

**A2.** Are $\\mathbf{A} = (2, -1, 3)$, $\\mathbf{B} = (1, 4, -2)$ and
$\\mathbf{C} = (3, 3, 1)$ coplanar? What is the volume of the box they span?

$$\\mathbf{B}\\times\\mathbf{C} = \\bigl(4 + 6,\\; -(1 + 6),\\; 3 - 12\\bigr) = (10,\\; -7,\\; -9)$$

$$\\mathbf{A}\\cdot(\\mathbf{B}\\times\\mathbf{C}) = 20 + 7 - 27 = 0$$

They are coplanar and the volume is zero. The reason is visible without any
arithmetic: $\\mathbf{A} + \\mathbf{B} = (3, 3, 1) = \\mathbf{C}$, so the third vector
is a combination of the other two and cannot leave their plane.

Replace $\\mathbf{C}$ by $(0, 0, 4)$ and the box reappears:
$\\mathbf{B}\\times(0,0,4) = (16,\\; -4,\\; 0)$ and
$\\mathbf{A}\\cdot(16, -4, 0) = 32 + 4 = 36$, so the volume is 36.

**A3.** For $f = x^{2}y + 2yz$, find the gradient at $(2, 1, 3)$, the greatest rate
of increase there, and the rate in the direction $(1, 2, 2)$.

$$\\nabla f = \\bigl(2xy,\\; x^{2} + 2z,\\; 2y\\bigr) = (4,\\; 10,\\; 2)$$

The greatest rate is $\\lvert \\nabla f\\rvert = \\sqrt{16 + 100 + 4} = \\sqrt{120} = 10.954451$.
The given direction has length 3, so the unit vector is $(1, 2, 2)/3$ and

$$D_{\\hat{\\mathbf{u}}}f = \\frac{4 + 20 + 4}{3} = \\frac{28}{3} = 9.3333$$

**Check.** The directional derivative can never exceed the gradient magnitude, and
$9.3333 < 10.954451$ as required. The implied angle between the chosen direction
and the gradient is $\\arccos(0.852013) = 31.57^\\circ$.

**Trap.** Dotting with $(1, 2, 2)$ unnormalised gives 28, which is larger than the
maximum possible rate — an answer the check above rejects instantly.

**A4.** For $\\mathbf{F} = xy\\,\\mathbf{i} + yz\\,\\mathbf{j} + zx\\,\\mathbf{k}$, find the
divergence and curl at $(1, 2, 3)$.

$$\\nabla\\cdot\\mathbf{F} = y + z + x, \\qquad \\text{at } (1,2,3): \\; 2 + 3 + 1 = 6$$

$$\\nabla\\times\\mathbf{F} = (0 - y,\\; 0 - z,\\; 0 - x) = (-y,\\; -z,\\; -x) = (-2,\\; -3,\\; -1)$$

**Check.** The divergence of that curl must vanish:
$\\partial(-y)/\\partial x + \\partial(-z)/\\partial y + \\partial(-x)/\\partial z = 0$.
It does.

**A5.** Which of these could be a magnetic flux density?

$$\\mathbf{P} = (2x,\\; -3y,\\; z), \\qquad \\mathbf{Q} = (x^{2},\\; y^{2},\\; z^{2})$$

Any $\\mathbf{B}$ is a curl, so its divergence must vanish everywhere.
$\\nabla\\cdot\\mathbf{P} = 2 - 3 + 1 = 0$, so $\\mathbf{P}$ is admissible.
$\\nabla\\cdot\\mathbf{Q} = 2x + 2y + 2z$, which is non-zero almost everywhere, so
$\\mathbf{Q}$ is not. No integration is needed for either.

**A6.** Show that $f = x^{2} + y^{2} - 2z^{2}$ satisfies Laplace's equation.

$$\\nabla^{2}f = 2 + 2 - 4 = 0$$

so $f$ is harmonic. By the mean-value property of Section 10.1, its value at every
point equals the average over any small ball around it, which is why such a
function can have no interior maximum or minimum inside a region — a fact worth
carrying into potential problems.

## 16.2 Practice Problems: decide without computing

Each statement is either always true or not. Decide, then read the reason.

**(i)** If $\\nabla\\cdot\\mathbf{F} = 0$ everywhere then $\\mathbf{F}$ is conservative.

**False.** Zero divergence and zero curl are unrelated conditions.
$\\mathbf{G} = (-y, x, 0)$ has zero divergence and curl $(0, 0, 2)$, so it is not
conservative at all.

**(ii)** If $\\mathbf{F} = \\nabla\\varphi$ then $\\oint\\mathbf{F}\\cdot d\\mathbf{r} = 0$
on every closed path.

**True on a simply connected region**, by the gradient theorem: start and end
points coincide, so the difference of potentials is zero. On a region with a hole
it can fail, which is the loophole Ampere's law relies on.

**(iii)** $\\lvert \\mathbf{A}\\times\\mathbf{B}\\rvert \\le \\lvert \\mathbf{A}\\rvert\\,\\lvert \\mathbf{B}\\rvert$.

**True**, with equality exactly when the vectors are perpendicular, since the
factor is $\\sin\\theta$.

**(iv)** $\\mathbf{A}\\times(\\mathbf{B}\\times\\mathbf{C}) = (\\mathbf{A}\\times\\mathbf{B})\\times\\mathbf{C}$.

**False.** The cross product is not associative. The left side lies in the plane
of $\\mathbf{B}$ and $\\mathbf{C}$; the right side lies in the plane of $\\mathbf{A}$
and $\\mathbf{B}$. They agree only in special cases.

**(v)** A field whose field lines are closed circles must have non-zero curl
somewhere on those circles.

**False**, as stated. The field $(-y, x)/(x^{2} + y^{2})$ has closed circular field
lines and zero curl at every point where it is defined; the source sits at the
excluded origin. Curl is a local test.

**(vi)** Changing coordinates from Cartesian to spherical changes the value of
$\\nabla\\cdot\\mathbf{F}$ at a point.

**False.** Divergence is defined by a limit of flux per unit volume, which knows
nothing about coordinates. Only the **formula** changes, never the number.`,
},
{
  id: 'va-set-c',
  title: '17. Problem Set: Integrals and the Three Theorems',
  content: `## 17.1 Problem Set B

**B1.** Find the work done by
$\\mathbf{F} = 3x^{2}\\,\\mathbf{i} + 2yz\\,\\mathbf{j} + y^{2}\\,\\mathbf{k}$ in moving
from the origin to $(1, 2, 3)$.

Take the curl first:

$$\\nabla\\times\\mathbf{F} = \\bigl(2y - 2y,\\; 0 - 0,\\; 0 - 0\\bigr) = \\mathbf{0}$$

so the field is conservative and no path is needed. Integrating $F_{x}$ with
respect to $x$ gives $x^{3}$, and matching the remaining components gives

$$\\varphi = x^{3} + y^{2}z$$

$$W = \\varphi(1,2,3) - \\varphi(0,0,0) = 1 + 12 = 13$$

**Check.** Integrating along the straight line from the origin to the endpoint by
quadrature also returns 13.

**Trap.** Parametrising a path immediately. It gives the same 13 after
considerably more work, and any slip in the parametrisation is invisible.

**B2.** For $\\mathbf{F} = y^{2}\\,\\mathbf{i} + x\\,\\mathbf{j}$, find the work from the
origin to $(1, 1)$ along $y = x$ and along $y = x^{2}$, and reconcile the
difference with Green's theorem.

Along the line, with $x = y = t$:

$$\\int_{0}^{1}\\bigl(t^{2} + t\\bigr)dt = \\tfrac{1}{3} + \\tfrac{1}{2} = \\tfrac{5}{6} = 0.8333$$

Along the parabola, with $x = t$, $y = t^{2}$ and $dy = 2t\\,dt$:

$$\\int_{0}^{1}\\bigl(t^{4} + 2t^{2}\\bigr)dt = \\tfrac{1}{5} + \\tfrac{2}{3} = \\tfrac{13}{15} = 0.8667$$

The gap is $\\tfrac{13}{15} - \\tfrac{5}{6} = \\tfrac{1}{30} = 0.03333$. Going out
along the parabola and back along the line traverses the enclosed region
counterclockwise, and

$$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 1 - 2y$$

$$\\iint_{R}(1 - 2y)\\,dA = \\int_{0}^{1}\\!\\!\\int_{x^{2}}^{x}(1 - 2y)\\,dy\\,dx = \\int_{0}^{1}\\bigl(x - 2x^{2} + x^{4}\\bigr)dx = \\tfrac{1}{2} - \\tfrac{2}{3} + \\tfrac{1}{5} = \\tfrac{1}{30}$$

The gap between the two paths is exactly the enclosed circulation, as it must be.

**B3.** Find the outward flux of
$\\mathbf{F} = 2x\\,\\mathbf{i} + 3y\\,\\mathbf{j} + z\\,\\mathbf{k}$ through the surface of
the box $0 \\le x \\le 1$, $0 \\le y \\le 2$, $0 \\le z \\le 3$.

By the divergence theorem, since $\\nabla\\cdot\\mathbf{F} = 2 + 3 + 1 = 6$ is
constant,

$$\\Phi = 6 \\times (1)(2)(3) = 36$$

**Check face by face.** The face at $x = 1$ contributes
$2 \\times 6 = 12$; at $y = 2$, $6 \\times 3 = 18$; at $z = 3$, $3 \\times 2 = 6$. The
three faces through the origin contribute nothing because the field vanishes on
them. Adding, $12 + 18 + 6 = 36$.

**B4.** Find $\\oint\\mathbf{F}\\cdot d\\mathbf{r}$ for
$\\mathbf{F} = -y\\,\\mathbf{i} + x\\,\\mathbf{j} + z\\,\\mathbf{k}$ around the unit circle
in the plane $z = 0$, counterclockwise seen from above.

By Stokes' theorem, $\\nabla\\times\\mathbf{F} = (0, 0, 2)$ and the normal is
$\\mathbf{k}$, so

$$\\oint\\mathbf{F}\\cdot d\\mathbf{r} = 2 \\times \\pi(1)^{2} = 2\\pi = 6.2832$$

**Check directly.** With $x = \\cos t$ and $y = \\sin t$, the integrand is
$\\sin^{2}t + \\cos^{2}t = 1$, so the integral is the length of the parameter
interval, $2\\pi$.

**B5.** A point charge sits at the origin. Its field is
$\\mathbf{E} = k\\,\\hat{\\mathbf{a}}_{r}/r^{2}$. Find the flux through a cube of side 6
centred on the charge.

The divergence is zero everywhere the field is defined, but the cube encloses the
singularity, so the divergence theorem does not apply to the interior as a whole.
Comparing instead with a sphere inside the cube, the flux through **any** closed
surface enclosing the charge is the same, so

$$\\Phi = \\frac{k}{a^{2}} \\times 4\\pi a^{2} = 4\\pi k$$

for any radius $a$, and therefore for the cube as well. Numerical integration over
spheres of radius 0.5, 2 and 7 returns $4\\pi$ for $k = 1$ each time.

**B6.** A long straight wire lies along the $z$-axis and its field is
$\\mathbf{F} = \\hat{\\mathbf{a}}_{\\rho}/\\rho$. Find the flux through a coaxial cylinder
of radius $R$ and height 5.

On the curved wall $\\mathbf{F}\\cdot\\hat{\\mathbf{n}} = 1/R$, and the flat ends
contribute nothing. The area of the wall is $2\\pi R(5)$, so

$$\\Phi = \\frac{1}{R} \\times 2\\pi R(5) = 10\\pi = 31.4159$$

independent of $R$. The divergence is zero for $\\rho > 0$, exactly as in B5, and
the flux again counts only what is enclosed — here a length 5 of line source
rather than a point.

## 17.2 Practice Problems: choose the shortest route

For each, name the method before computing anything.

**(i)** The circulation of a field with zero curl around a closed loop in a
simply connected region.

**Zero**, by Stokes' theorem, with no integration whatever.

**(ii)** The flux of $\\mathbf{F} = (x, y, z)$ out of any closed surface bounding a
volume $V$.

$$\\nabla\\cdot\\mathbf{F} = 3, \\qquad \\Phi = 3V$$

For a sphere of radius 2 that is $3 \\times \\tfrac{4}{3}\\pi(8) = 32\\pi = 100.531$,
matching Section 12.4.

**(iii)** The work done by a constant force $\\mathbf{F}$ along any path from
$\\mathbf{a}$ to $\\mathbf{b}$.

A constant field is the gradient of $\\mathbf{F}\\cdot\\mathbf{r}$, so the work is
$\\mathbf{F}\\cdot(\\mathbf{b} - \\mathbf{a})$ regardless of the route — the elementary
formula, recovered as a special case of the gradient theorem.

**(iv)** The area enclosed by a closed curve, given only a parametrisation of the
curve.

Green's area formula, $\\tfrac{1}{2}\\oint(x\\,dy - y\\,dx)$. On the region of
Section 13.3 it returned $\\tfrac{1}{6}$, matching the double integral.

**(v)** The flux of the curl of any field through a **closed** surface.

**Zero.** A closed surface has no boundary curve, so Stokes' theorem gives zero;
equivalently, the divergence theorem applied to $\\nabla\\times\\mathbf{F}$ gives the
volume integral of $\\nabla\\cdot(\\nabla\\times\\mathbf{F})$, which vanishes
identically by Section 10.3. Two arguments, one answer.`,
},
],
  keyTakeaways: [
    'Laplace transform converts ODEs to algebraic equations; key pair: e^(-at) → 1/(s+a).',
    'Final Value Theorem: lim(t→∞)f(t) = lim(s→0)sF(s) — finds steady-state without inverse transform.',
    'Gradient ∇f gives direction of steepest increase; divergence ∇·F measures outflow.',
    'Curl ∇×F measures rotation; zero curl means conservative (path-independent) field.',
    'Dot product A·B = |A||B|cosθ (scalar); cross product |A×B| = |A||B|sinθ (vector).',
    'Divergence is the limit of flux per unit volume; curl is the limit of circulation per unit area. The Cartesian formulas are what those limits evaluate to.',
    'Directional derivative = ∇f · û, so the gradient is steepest ascent, its length is that slope, and it is perpendicular to every level set. Normalise the direction first.',
    'curl(grad f) = 0 and div(curl F) = 0 always. The first makes electrostatic work path-independent; the second gives div B = 0 for free.',
    'Green, Stokes and the divergence theorem all say the same thing: a derivative inside a region is fixed by the function on its boundary. Each carries an orientation hypothesis that decides the sign.',
    'Scalar triple product = box volume, and zero means coplanar; vector triple product expands as B(A·C) − C(A·B).',
    'Match coordinates to the symmetry, and never drop the volume element: ρ dρ dφ dz in cylindrical, r² sinθ dr dθ dφ in spherical.',
    'Zero divergence and zero curl are independent conditions; a field can have either, both, or neither.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 1 — PROBABILITY AND STATISTICS  (4 curriculum IDs)  ·  4–6 %
 * ══════════════════════════════════════════════════════════════════ */

};
