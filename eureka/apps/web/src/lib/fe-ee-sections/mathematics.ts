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

**$(a + b)^n = \\Sigma C(n,k) \\cdot a^{n-k} \\cdot b^k$** for k = 0 to n

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

**Permutations** (order matters): P(n,r) = n!/(n-r)!. Arranging 3 of 8 components in a fixed sequence: 8!/5! = 8 x 7 x 6 = **336**.

**Combinations** (order does not): C(n,r) = n!/[r!(n-r)!]. Choosing 3 of 8 spares regardless of order: 336/6 = **56**.

The test for which to use: swap two of your chosen items. If that counts as a different outcome, it is a permutation.

## 3.2 Boolean algebra and De Morgan

The identities that actually reduce circuits:

- **$NOT(A AND B) = NOT A OR NOT B$**
- **$NOT(A OR B) = NOT A AND NOT B$**
- Absorption: A + AB = A, and A(A + B) = A
- Consensus: AB + A'C + BC = AB + A'C (the BC term is redundant)

Simplify F = AB + AB' + A'B:

AB + AB' = A(B + B') = A. So F = A + A'B. By absorption's dual, A + A'B = A + B. So **$F = A + B$**, a two-input OR from what looked like three product terms.

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

An 8-bit byte carries one parity bit. How many 8-bit patterns have even parity
(an even number of ones)?

Even counts of ones are 0, 2, 4, 6, 8:
$$C(8,0) + C(8,2) + C(8,4) + C(8,6) + C(8,8) = 1 + 28 + 70 + 28 + 1 = 128$$

That is exactly half of $2^{8}$ = 256, and it is half for every n ≥ 1 — which is why
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
exactly k!**. If your two answers do not stand in that ratio, one of them uses
the wrong formula, and you know it before looking at the choices.

When a counting problem resists all four formulas, it is usually two problems
multiplied together: choose the group, then arrange within it. Splitting it in
two and multiplying the counts is legitimate and is often faster than hunting
for a single formula that covers the whole thing at once.`,
},
],
  keyTakeaways: [
    'Permutations P(n,r) count ordered arrangements; combinations C(n,r) count unordered selections.',
    'De Morgan laws for sets mirror Boolean algebra: (A ∪ B)\' = A\' ∩ B\'.',
    'Contrapositive of p→q is ¬q→¬p and is logically equivalent.',
    'Binomial theorem (a+b)^n = Σ C(n,k)·a^(n-k)·b^k is used in probability and series.',
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
  −1/4000 A/V, i.e. **$-0.25\\ \\mathrm{mA}/V$** — negative, and its magnitude is the reciprocal
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
  from the origin, not a separate rule to learn.`,
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

$$d = |3(6) + 4(1) - 12| / \\sqrt{3^{2} + 4^{2}} = |18 + 4 - 12|/5 = 10/5 = 2.0$$

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

$$\\omega _d = \\sqrt{10^{42} - 5000^{2}} = \\sqrt{10^{8} - 2.5\\times 10^{7}} = \\sqrt{7.5\\times 10^{7}} = 8660\\ \\mathrm{rad/s}$$

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
],
  keyTakeaways: [
    'First-order: x(t) = x(∞) + [x(0) - x(∞)]·e^(-t/τ); τ = RC or L/R.',
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

Replace column 1 with the right-hand side: det(A1) = (10)(6) - (4)(-2) = 60 + 8 = 68, so **$i1 = 68/26 = 2.62\\ \\mathrm{A}$**.

Replace column 2: det(A2) = (5)(4) - (-2)(10) = 20 + 20 = 40, so **$i2 = 40/26 = 1.54\\ \\mathrm{A}$**.

Substitute back: 5(2.62) - 2(1.54) = 13.1 - 3.08 = 10.0. Correct.

For 2x2 and 3x3 systems Cramer's rule is the fastest route on this exam. Beyond that the factorial growth makes Gaussian elimination faster.

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
],
  keyTakeaways: [
    'Matrix form Ax = b solves n equations with n unknowns; use Gaussian elimination or Cramer\'s rule.',
    'Determinant for 2×2: det = ad - bc; non-zero means invertible.',
    'Eigenvalue equation Ax = λx; eigenvalues found from det(A-λI) = 0.',
    'All eigenvalues with negative real parts → stable system.',
    'Matrix multiplication is associative but NOT commutative.',
  ],
},

fee_vector_analysis: {
  topicId: 'fee_vector_analysis',
  title: 'Laplace Transform & Vector Analysis',
  domainWeight: 'Mathematics · 7–11%',
  overview: 'The Laplace transform converts time-domain differential equations into algebraic equations in the s-domain. Vector analysis — gradient, divergence, and curl — is essential for electromagnetics. Together these tools solve circuit transients and field problems.',
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

- **Dot product**: A·B = |A||B|cosθ = AxBx + AyBy + AzBz (scalar result)
- **Cross product**: |A×B| = |A||B|sinθ (vector result, direction by right-hand rule)

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

**Cross** (vector, measures perpendicularity, right-hand rule): A x B = (3)(-1) - (4)(2) in the k component = **-11k**. The magnitude 11 equals |A||B|sin(theta) = 5(2.24)(0.983) = 11. Consistent.

Which to use, in physical terms: **work and power are dot products** (W = F.d, P = V.I in the phasor sense), while **forces and torques are cross products** (F = qv x B, tau = r x F). If the answer should be a number, use dot; if it should be a direction, use cross.

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

Flux = integral of F.n dA. For a uniform field F = 5k passing through a flat 2 m x 3 m plate lying in the xy plane, n = k and F.n = 5, so flux = 5 x 6 = **30**.

Tilt the plate 60 degrees from the xy plane and the normal tilts with it: F.n = 5 cos(60) = 2.5, so flux = **15**. The cosine factor is the whole of Gauss's-law geometry, and it is why a Gaussian surface is chosen so the field is either parallel or perpendicular to it everywhere.`,
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
          explanation: 'Flux = F A cos(theta) = 8 x 4 x cos(60) = 8 x 4 x 0.5 = 16. Using sin instead of cos gives 27.7 - the cosine applies because flux depends on the component of the field ALONG the normal.',
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
**A**×**B** = (AₓB_y − A_yBₓ)**k** = (3(−1) − 4(2))**k** = **$-11k$**

The angle between them follows from either: |A| = 5, |B| = √5 = 2.236, so
cos θ = 2/(5 × 2.236) = 0.179, giving θ = **$79.7^\\circ$**. Cross-checking with the
cross product: sin θ = 11/(5 × 2.236) = 0.984, θ = 79.7° ✓. Two independent
routes to the same angle.

## 5.2 Divergence and curl of a stated field

**F** = x²**i** + y z**j** + z**k**.

div **F** = ∂(x²)/∂x + ∂(yz)/∂y + ∂(z)/∂z = 2x + z + 1

At the point (1, 2, 3): div **F** = 2 + 3 + 1 = **6**.

The x-component of the curl is ∂F_z/∂y − ∂F_y/∂z = 0 − y = −y, which at that
point is **$-2$**. A field can have both a divergence and a curl; they are
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
],
  keyTakeaways: [
    'Laplace transform converts ODEs to algebraic equations; key pair: e^(-at) → 1/(s+a).',
    'Final Value Theorem: lim(t→∞)f(t) = lim(s→0)sF(s) — finds steady-state without inverse transform.',
    'Gradient ∇f gives direction of steepest increase; divergence ∇·F measures outflow.',
    'Curl ∇×F measures rotation; zero curl means conservative (path-independent) field.',
    'Dot product A·B = |A||B|cosθ (scalar); cross product |A×B| = |A||B|sinθ (vector).',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 1 — PROBABILITY AND STATISTICS  (4 curriculum IDs)  ·  4–6 %
 * ══════════════════════════════════════════════════════════════════ */

};
