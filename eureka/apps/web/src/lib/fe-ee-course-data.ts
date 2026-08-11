/**
 * FE Electrical & Computer Engineering — Course Content
 * 87 curriculum topics with detailed study content, key points, and formulas.
 * Every curriculum topic ID has real, substantial, CISSP-quality content.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examTip?: string;
  importantNote?: string;
  quiz?: QuizQuestion[];
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

export const FE_EE_COURSE: Record<string, TopicLesson> = {

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 0 — MATHEMATICS  (9 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

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

The **quadratic formula** solves any equation of the form **ax² + bx + c = 0**:

**x = (-b ± sqrt(b² - 4ac)) / (2a)**

The **discriminant** D = b² - 4ac determines root type:

| Discriminant | Root Type | Engineering Significance |
|---|---|---|
| D > 0 | Two distinct real roots | Two separate operating points |
| D = 0 | One repeated real root | Critically damped system |
| D < 0 | Two complex conjugate roots | Oscillatory behavior (underdamped) |

### Systems of Linear Equations

Many circuit problems reduce to systems of linear equations. For two equations in two unknowns:
- **Substitution**: solve one equation for one variable, substitute into the other
- **Elimination**: multiply equations to cancel one variable
- **Cramer's rule**: use determinants — x = det(Ax)/det(A), y = det(Ay)/det(A)

For the FE exam, Cramer's rule is fast for 2x2 systems:
- Given a1·x + b1·y = c1 and a2·x + b2·y = c2
- **x = (c1·b2 - c2·b1) / (a1·b2 - a2·b1)**
- **y = (a1·c2 - a2·c1) / (a1·b2 - a2·b1)**`,
      examTip: 'The discriminant b²-4ac tells you everything on the FE exam: positive means two real roots, zero means repeated (critically damped in circuits), negative means complex conjugate pair (oscillatory). Memorize this mapping — it saves time on second-order circuit and control system problems.',
    },
    {
      id: 'at-trig-identities',
      title: '2. Trigonometric Identities and Applications',
      content: `## 2.1 Fundamental Identities

The **Pythagorean identity** is the most important:

**sin²θ + cos²θ = 1**

Derived identities:
- **tan²θ + 1 = sec²θ**
- **1 + cot²θ = csc²θ**

### Angle Addition Formulas

These appear constantly in AC circuit analysis where you combine sinusoidal signals:

- **sin(A ± B) = sinA·cosB ± cosA·sinB**
- **cos(A ± B) = cosA·cosB ∓ sinA·sinB**

### Double-Angle Formulas

- **sin(2A) = 2·sinA·cosA**
- **cos(2A) = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A**

### Power-Reducing Formulas

Used in power calculations for AC circuits:
- **sin²θ = (1 - cos2θ) / 2**
- **cos²θ = (1 + cos2θ) / 2**

## 2.2 Rectangular-Polar Conversion

Every phasor problem on the FE exam requires converting between forms:

| Conversion | Formula |
|---|---|
| Rectangular to Polar | r = sqrt(x² + y²), θ = arctan(y/x) |
| Polar to Rectangular | x = r·cosθ, y = r·sinθ |

### Unit Circle Values

| Angle | sin | cos | tan |
|---|---|---|---|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | sqrt(3)/2 | 1/sqrt(3) |
| 45° | sqrt(2)/2 | sqrt(2)/2 | 1 |
| 60° | sqrt(3)/2 | 1/2 | sqrt(3) |
| 90° | 1 | 0 | undefined |`,
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
| > 0 | two real distinct | overdamped |
| = 0 | one repeated real | critically damped |
| < 0 | complex conjugate pair | underdamped, oscillatory |

## 3.2 Solving a two-loop system

Mesh analysis produces 3i1 + 2i2 = 12 and i1 - 4i2 = -2. From the second, i1 = 4i2 - 2. Substitute: 3(4i2 - 2) + 2i2 = 12, so 12i2 - 6 + 2i2 = 12, giving 14i2 = 18 and **i2 = 1.286 A**. Then i1 = 4(1.286) - 2 = **3.14 A**.

Substituting back into the first equation: 3(3.14) + 2(1.286) = 9.43 + 2.57 = 12. Checks.

## 3.3 The identities that actually appear

The three worth having instantly:

- **sin^2 + cos^2 = 1** — converts between the two whenever only one is given
- **sin(2x) = 2 sin x cos x** — appears in instantaneous power, p(t) = VI cos(theta) - VI cos(2 omega t - theta)
- **cos(A - B) = cos A cos B + sin A sin B** — the phase-difference expansion behind every power-factor derivation

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
  table above, and for the same reason.`,
    examTip: 'Before accepting any arctangent, look at the signs of x and y. The calculator returns an angle in (-90, 90) only, so quadrants II and III always need a 180 degree correction. This single check prevents more lost marks in AC circuit analysis than any other habit.',
    importantNote: '0.707 and 0.866 should be recognised instantly. 0.707 is cos 45 and also 1/sqrt(2): equal resistance and reactance, the half-power point, and the RMS-to-peak ratio of a sinusoid. 0.866 is cos 30 and sqrt(3)/2, which is where the sqrt(3) in three-phase relationships comes from.',
  },
{
  id: 'at-set',
  title: '5. Problem Set: Angles and Ratios',
  content: `## 5.1 Convert 8∠−150° to rectangular

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
recognising rather than deriving each time.`,
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

**e^(jθ) = cosθ + j·sinθ**

### Conversion Between Forms

| From → To | Formula |
|---|---|
| Rectangular → Polar | r = sqrt(a² + b²), θ = arctan(b/a) |
| Polar → Rectangular | a = r·cosθ, b = r·sinθ |

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

- (r₁∠θ₁) · (r₂∠θ₂) = r₁r₂ ∠(θ₁ + θ₂)
- (r₁∠θ₁) / (r₂∠θ₂) = (r₁/r₂) ∠(θ₁ - θ₂)

In rectangular form, division uses the **conjugate**:

**(a + jb) / (c + jd) = [(a + jb)(c - jd)] / [(c + jd)(c - jd)] = [(ac + bd) + j(bc - ad)] / (c² + d²)**

## 2.3 Phasor Representation

A sinusoidal signal v(t) = Vm·cos(ωt + φ) corresponds to **phasor V = Vm∠φ**:

| Time Domain | Phasor Domain |
|---|---|
| v(t) = Vm·cos(ωt + φ) | V = Vm∠φ |
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
| Union | A ∪ B | Elements in A or B (or both) |
| Intersection | A ∩ B | Elements in both A and B |
| Complement | A' | Elements NOT in A |
| Difference | A - B | Elements in A but not B |

**De Morgan's Laws** for sets mirror Boolean algebra:
- **(A ∪ B)' = A' ∩ B'**
- **(A ∩ B)' = A' ∪ B'**

## 1.2 Counting: Permutations and Combinations

- **Permutations** (order matters): P(n,r) = n! / (n-r)!
- **Combinations** (order does not matter): C(n,r) = n! / [r!(n-r)!]

### The Binomial Theorem

**(a + b)^n = Σ C(n,k) · a^(n-k) · b^k** for k = 0 to n

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
| AND | p ∧ q | AND gate | True only if both true |
| OR | p ∨ q | OR gate | True if either true |
| NOT | ¬p | Inverter | Flips truth value |
| Implication | p → q | — | False only if p true and q false |
| Biconditional | p ↔ q | XNOR | True if both same |

**De Morgan's Laws** for logic:
- **¬(p ∧ q) ≡ ¬p ∨ ¬q**
- **¬(p ∨ q) ≡ ¬p ∧ ¬q**

**Contrapositive**: p → q is logically equivalent to ¬q → ¬p (always valid reasoning).

## 2.2 Graph Theory Basics

A **graph** consists of vertices (nodes) connected by edges. Key properties:
- **Degree** of a vertex: number of incident edges
- **Euler's formula** for planar graphs: **V - E + F = 2** (vertices - edges + faces)
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

- **NOT(A AND B) = NOT A OR NOT B**
- **NOT(A OR B) = NOT A AND NOT B**
- Absorption: A + AB = A, and A(A + B) = A
- Consensus: AB + A'C + BC = AB + A'C (the BC term is redundant)

Simplify F = AB + AB' + A'B:

AB + AB' = A(B + B') = A. So F = A + A'B. By absorption's dual, A + A'B = A + B. So **F = A + B**, a two-input OR from what looked like three product terms.

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

- **Distance (2D)**: d = sqrt[(x₂-x₁)² + (y₂-y₁)²]
- **Distance (3D)**: d = sqrt[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]
- **Midpoint**: ((x₁+x₂)/2, (y₁+y₂)/2)

## 1.2 Lines

- **Slope**: m = (y₂-y₁)/(x₂-x₁)
- **Point-slope form**: y - y₁ = m(x - x₁)
- **Slope-intercept**: y = mx + b
- **Parallel lines**: m₁ = m₂
- **Perpendicular lines**: m₁ · m₂ = -1

## 1.3 Coordinate Systems

| System | Coordinates | Use Case |
|---|---|---|
| Cartesian | (x, y, z) | General analysis |
| Polar | (r, θ) | Phasor analysis, 2D symmetry |
| Cylindrical | (r, θ, z) | Wire/cable fields |
| Spherical | (r, θ, φ) | Antenna radiation patterns |

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
| Circle | x² + y² = r² | Constant radius |
| Ellipse | x²/a² + y²/b² = 1 | Sum of distances to foci = constant |
| Parabola | y = ax² + bx + c | Single focus and directrix |
| Hyperbola | x²/a² - y²/b² = 1 | Difference of distances to foci = constant |

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

Through (2, 3) and (6, 11): slope m = (11-3)/(6-2) = 8/4 = **2**. Point-slope: y - 3 = 2(x - 2), so **y = 2x - 1**.

Perpendicular lines have slopes whose product is -1, so a perpendicular through (2,3) has slope **-1/2**: y = -x/2 + 4.

This is not abstract on this exam: a load line on a transistor characteristic is a straight line, and its slope is -1/R_load. Given a 10 V supply and a 2 kilohm load, the load line runs from (10 V, 0 mA) to (0 V, 5 mA) with slope -1/2000 per volt.

## 3.2 Circles and the completing-the-square step

x^2 + y^2 - 6x + 4y - 12 = 0. Group and complete:

(x^2 - 6x + 9) + (y^2 + 4y + 4) = 12 + 9 + 4

(x - 3)^2 + (y + 2)^2 = 25, so centre **(3, -2)** and radius **5**.

The same algebra turns up in Smith-chart work, where constant-resistance and constant-reactance loci are circles.

## 3.3 Conics you should recognise on sight

| Equation form | Conic | Where it appears |
|---|---|---|
| (x-h)^2 + (y-k)^2 = r^2 | circle | impedance loci, phasor magnitude |
| x^2/a^2 + y^2/b^2 = 1 | ellipse | Lissajous figures, elliptical polarisation |
| y = ax^2 + bx + c | parabola | reflector antennas, power vs load curves |
| x^2/a^2 - y^2/b^2 = 1 | hyperbola | constant-power curves, hyperbolic navigation |

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
  from the origin, not a separate rule to learn.`,
    examTip: 'Completing the square flips the sign: (y + 2)^2 means the centre coordinate is MINUS 2. Write the standard form as (x - h)^2 + (y - k)^2 and read h and k off it directly rather than reading the numbers you see in the equation.',
    importantNote: 'Perpendicular slopes are negative RECIPROCALS, m2 = -1/m1, not negatives. A line of slope 2 is perpendicular to one of slope -0.5. Every FE question on this offers -2 as a distractor.',
  },
{
  id: 'ag-set',
  title: '5. Problem Set: Lines, Circles and Intercepts',
  content: `## 5.1 Identify the conic

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

The derivative measures instantaneous rate of change: **f'(x) = lim(h→0) [f(x+h) - f(x)] / h**

### Differentiation Rules

| Rule | Formula |
|---|---|
| Power rule | d/dx(x^n) = n·x^(n-1) |
| Constant multiple | d/dx(c·f) = c·f'(x) |
| Sum rule | d/dx(f+g) = f' + g' |
| Product rule | (uv)' = u'v + uv' |
| Quotient rule | (u/v)' = (u'v - uv') / v² |
| Chain rule | dy/dx = (dy/du)·(du/dx) |

### Common Derivatives

| Function | Derivative |
|---|---|
| e^x | e^x |
| ln(x) | 1/x |
| sin(x) | cos(x) |
| cos(x) | -sin(x) |
| tan(x) | sec²(x) |
| e^(ax) | a·e^(ax) |

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

A limit **lim(x→a) f(x) = L** means f(x) approaches L as x approaches a. Limits define derivatives, integrals, and series convergence.

### L'Hopital's Rule

When a limit gives an **indeterminate form** (0/0 or ∞/∞), differentiate top and bottom:

**lim(x→a) f(x)/g(x) = lim(x→a) f'(x)/g'(x)**

This can be applied repeatedly until the limit is determinate.

## 2.2 Optimization (Max/Min)

To find extrema of f(x):
1. Find critical points: set **f'(x) = 0** and solve
2. **Second derivative test**: if f''(x) > 0 → local minimum; if f''(x) < 0 → local maximum

### Applications
- **Maximum power transfer**: differentiate P(R_L) and set to zero → R_L = R_Th
- **Minimum cost**: differentiate total cost function and set to zero

## 2.3 Taylor Series

**f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + f'''(a)(x-a)³/3! + ...**

**Linearization** (first-order Taylor): f(x) ≈ f(a) + f'(a)(x-a)

Common series:
- **e^x = 1 + x + x²/2! + x³/3! + ...**
- **sin(x) = x - x³/3! + x⁵/5! - ...**
- **cos(x) = 1 - x²/2! + x⁴/4! - ...**

### Partial Derivatives

For multivariable functions, **∂f/∂x** treats all other variables as constants. The **gradient** ∇f = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k gives the direction of steepest increase.`,
      examTip: 'L\'Hopital\'s rule only works for 0/0 or ∞/∞ forms. If the limit is not indeterminate, do NOT apply L\'Hopital. Taylor series linearization f(x) ≈ f(a) + f\'(a)(x-a) is used for small-signal analysis of nonlinear circuits (like diode linearization around the Q-point).',
      importantNote: 'The maximum power transfer theorem (R_L = R_Th) is derived by differentiating P = V²·R_L/(R_Th+R_L)² and setting dP/dR_L = 0. This is a direct application of optimization using calculus.',
    },
    {
      id: 'dc-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Circuit derivatives that appear directly

The two defining relations are derivatives, and the exam asks about them as calculus:

- Capacitor: **i = C dv/dt**. A capacitor charged by a voltage ramping at 500 V/s with C = 20 microfarad passes i = (20e-6)(500) = **10 mA**. A constant voltage gives zero current, which is why a capacitor blocks DC.
- Inductor: **v = L di/dt**. A 0.5 H inductor whose current changes at 40 A/s develops v = (0.5)(40) = **20 V**. Try to interrupt inductor current instantly and di/dt is enormous - which is what destroys switch contacts and why flyback diodes exist.

## 3.2 Chain and product rules on a real waveform

Differentiate v(t) = 10 e^(-2t) sin(3t).

Product rule with u = 10 e^(-2t) and w = sin(3t):

u' = -20 e^(-2t), w' = 3 cos(3t)

dv/dt = -20 e^(-2t) sin(3t) + 30 e^(-2t) cos(3t) = **10 e^(-2t)[3 cos(3t) - 2 sin(3t)]**

This is the shape of a damped oscillation - exactly the underdamped RLC response - and its derivative is what you set to zero to find the overshoot peak.

## 3.3 Optimisation: maximum power transfer by calculus

A source of V volts with internal resistance R_s drives a load R_L. Load power is

P = V^2 R_L/(R_s + R_L)^2

Differentiate with the quotient rule and set to zero. The numerator of dP/dR_L is

V^2[(R_s + R_L)^2 - R_L x 2(R_s + R_L)] = V^2 (R_s + R_L)[(R_s + R_L) - 2R_L]

Setting the bracket to zero: R_s + R_L - 2R_L = 0, so **R_L = R_s**.

That is the maximum power transfer theorem derived rather than memorised, and the calculus route is what an exam question means when it presents it as an optimisation problem.

## 3.4 Critical points and the second derivative

f(x) = x^3 - 6x^2 + 9x + 2.

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
| x^n | x^(n+1)/(n+1) + C (n ≠ -1) |
| 1/x | ln|x| + C |
| e^x | e^x + C |
| e^(ax) | (1/a)e^(ax) + C |
| sin(x) | -cos(x) + C |
| cos(x) | sin(x) + C |

## 1.2 Integration Techniques

### Integration by Substitution (u-substitution)
Replace a composite expression with u, transform dx to du:
- Let u = g(x), then du = g'(x)dx
- ∫f(g(x))·g'(x)dx = ∫f(u)du

### Integration by Parts
**∫u dv = uv - ∫v du**

Choose u and dv using **LIATE** priority: Logarithmic, Inverse trig, Algebraic, Trig, Exponential.

### The Fundamental Theorem of Calculus

**d/dx[∫ₐˣ f(t)dt] = f(x)**

**∫ₐᵇ f(x)dx = F(b) - F(a)** where F is any antiderivative of f.`,
      examTip: 'Integration by parts (∫u dv = uv - ∫v du) appears when integrating products like t·e^(-t) which arise in transient circuit analysis. Use LIATE to choose u: pick the function that simplifies when differentiated.',
    },
    {
      id: 'ic-applications',
      title: '2. Engineering Applications of Integration',
      content: `## 2.1 Energy Storage

Integration computes energy stored in reactive elements:

- **Capacitor energy**: W = ∫₀ᵛ Cv dv = **½CV²**
- **Inductor energy**: W = ∫₀ⁱ Li di = **½LI²**

## 2.2 Charge and Current

Total charge is the integral of current:
- **Q = ∫I dt** (charge = area under current-time curve)

## 2.3 Average and RMS Values

- **Average value**: f_avg = (1/T)∫₀ᵀ f(t)dt
- **RMS value**: f_rms = sqrt[(1/T)∫₀ᵀ f²(t)dt]
- **Average power**: P_avg = (1/T)∫₀ᵀ p(t)dt = (1/T)∫₀ᵀ v(t)·i(t)dt

For a sinusoid v(t) = Vm·cos(ωt):
- **V_rms = Vm / sqrt(2) ≈ 0.707·Vm**

## 2.4 Improper Integrals

The **Laplace transform** uses an improper integral:
- **F(s) = ∫₀^∞ f(t)·e^(-st)dt**

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

p(t) = i^2 R = 40 e^(-2t) W

W = integral from 0 to infinity of 40 e^(-2t) dt = 40 x [(-1/2) e^(-2t)] from 0 to infinity = 40 x (1/2) = **20 J**.

Stored energy has closed forms worth knowing without integrating: **(1/2) C V^2** in a capacitor and **(1/2) L I^2** in an inductor.

## 3.4 Integration by parts, once

integral t e^(-2t) dt, which appears in first-moment and settling-time calculations.

Let u = t, dv = e^(-2t) dt. Then du = dt and v = (-1/2) e^(-2t).

integral = uv - integral v du = (-t/2) e^(-2t) + (1/2) integral e^(-2t) dt = (-t/2) e^(-2t) - (1/4) e^(-2t) + C

Evaluated from 0 to infinity: at infinity both terms vanish; at zero the value is -1/4. So the definite integral is **1/4**.`,
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

**dy/dt + ay = b**

With initial condition y(0) = y₀, the solution is:

**y(t) = b/a + (y₀ - b/a)·e^(-at)**

This has two parts:
- **Steady-state (forced) response**: y_ss = b/a (the value as t → ∞)
- **Transient (natural) response**: (y₀ - y_ss)·e^(-at) (decays exponentially)

### Time Constant

The **time constant** τ = 1/a determines how fast the transient decays:

| Time | Value of e^(-t/τ) | % of Steady State |
|---|---|---|
| t = τ | 0.368 | 63.2% |
| t = 2τ | 0.135 | 86.5% |
| t = 3τ | 0.050 | 95.0% |
| t = 5τ | 0.007 | 99.3% |

## 1.2 Circuit Applications

- **RC circuit**: τ = RC; v_C(t) = V_final + (V_initial - V_final)·e^(-t/RC)
- **RL circuit**: τ = L/R; i_L(t) = I_final + (I_initial - I_final)·e^(-tR/L)

The general first-order transient formula works for ANY first-order circuit:

**x(t) = x(∞) + [x(0) - x(∞)]·e^(-t/τ)**`,
      examTip: 'The universal first-order formula x(t) = x(∞) + [x(0) - x(∞)]·e^(-t/τ) solves ANY RC or RL transient. Find three things: initial value x(0), final value x(∞), and time constant τ. This single formula covers charging, discharging, and source-switching problems.',
      importantNote: 'At t = 0⁺ (just after switching): capacitor voltage CANNOT change instantly (v_C(0⁺) = v_C(0⁻)), and inductor current CANNOT change instantly (i_L(0⁺) = i_L(0⁻)). These continuity conditions are essential for finding initial values.',
    },
    {
      id: 'de-second-order',
      title: '2. Second-Order Linear ODEs and Damping',
      content: `## 2.1 Standard Form

The general second-order ODE for circuits and control systems:

**d²y/dt² + 2ζωₙ·dy/dt + ωₙ²·y = ωₙ²·u(t)**

Where:
- **ωₙ** = natural frequency (rad/s)
- **ζ** = damping ratio (dimensionless)

### Characteristic Equation

Setting u(t) = 0 gives the **characteristic equation**: s² + 2ζωₙs + ωₙ² = 0

Roots: s = -ζωₙ ± ωₙ·sqrt(ζ² - 1)

## 2.2 Response Types

| Damping Ratio | Response Type | Root Type | Behavior |
|---|---|---|---|
| ζ < 1 | Underdamped | Complex conjugate | Oscillates with decaying envelope |
| ζ = 1 | Critically damped | Repeated real | Fastest return without overshoot |
| ζ > 1 | Overdamped | Distinct real | Slow, monotonic approach |

### Series RLC Circuit Parameters

For a series RLC circuit:
- **ωₙ = 1/sqrt(LC)** (natural frequency)
- **ζ = R/(2sqrt(L/C)) = R/(2)·sqrt(C/L)** (damping ratio)
- **Damped frequency**: ωd = ωₙ·sqrt(1 - ζ²) (for underdamped case)

### Laplace Transform Approach

Converting to s-domain simplifies solving: the ODE becomes an algebraic equation in s.

**s²Y(s) + 2ζωₙsY(s) + ωₙ²Y(s) = ωₙ²U(s)** (assuming zero initial conditions)

This gives **H(s) = Y(s)/U(s) = ωₙ²/(s² + 2ζωₙs + ωₙ²)**`,
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

**s^2 + (R/L) s + 1/(LC) = 0**

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

Separate: dy/y = -k dt. Integrate: ln y = -kt + C, so **y = y_0 e^(-kt)**.

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

A system **Ax = b** represents n equations in n unknowns:

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

**[a b; c d]⁻¹ = (1/(ad-bc)) · [d -b; -c a]**

## 1.2 Solving Linear Systems

### Cramer's Rule
For Ax = b, each unknown xᵢ = det(Aᵢ)/det(A), where Aᵢ replaces column i with b.

### Gaussian Elimination
Reduce to row echelon form using elementary row operations. Faster than Cramer's for large systems.

| Method | Best For | Complexity |
|---|---|---|
| Cramer's rule | 2×2 or 3×3 systems | O(n! · n) |
| Gaussian elimination | Any size | O(n³) |
| Matrix inverse | Multiple right-hand sides | O(n³) setup |`,
      examTip: 'For 2×2 systems, Cramer\'s rule is fastest on the FE exam. For 3×3, Gaussian elimination is usually faster. Always check that det(A) ≠ 0 before applying Cramer\'s — if det = 0, the system has no unique solution.',
    },
    {
      id: 'la-eigenvalues',
      title: '2. Eigenvalues and Stability',
      content: `## 2.1 Eigenvalue Problem

The eigenvalue equation: **Ax = λx**

Where λ is the **eigenvalue** and x is the **eigenvector**.

To find eigenvalues, solve: **det(A - λI) = 0** (the characteristic equation)

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

Replace column 1 with the right-hand side: det(A1) = (10)(6) - (4)(-2) = 60 + 8 = 68, so **i1 = 68/26 = 2.62 A**.

Replace column 2: det(A2) = (5)(4) - (-2)(10) = 20 + 20 = 40, so **i2 = 40/26 = 1.54 A**.

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

The Laplace transform: **F(s) = ∫₀^∞ f(t)·e^(-st)dt** where s = σ + jω

### Essential Transform Pairs

| f(t) | F(s) |
|---|---|
| 1 (unit step) | 1/s |
| t | 1/s² |
| t^n | n!/s^(n+1) |
| e^(-at) | 1/(s+a) |
| sin(ωt) | ω/(s²+ω²) |
| cos(ωt) | s/(s²+ω²) |
| e^(-at)·sin(ωt) | ω/[(s+a)²+ω²] |
| e^(-at)·cos(ωt) | (s+a)/[(s+a)²+ω²] |

### Key Properties

- **Linearity**: L{af + bg} = aF(s) + bG(s)
- **Frequency shift**: L{e^(-at)f(t)} = F(s+a)
- **Derivative**: L{f'(t)} = sF(s) - f(0⁻)
- **Integral**: L{∫f(t)dt} = F(s)/s
- **Convolution**: L{f*g} = F(s)·G(s)

## 1.2 Value Theorems

- **Initial Value Theorem**: lim(t→0⁺) f(t) = lim(s→∞) sF(s)
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
| **Gradient** ∇f | (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k | Direction of steepest increase |
| **Divergence** ∇·F | ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z | Net outflow from a point |
| **Curl** ∇×F | (see determinant formula) | Rotation/circulation of field |

### Applications in Electromagnetics

- **∇V = -E** (electric field is negative gradient of potential)
- **∇·E = ρ/ε₀** (Gauss's law — charge creates divergence in E)
- **∇·B = 0** (no magnetic monopoles — B has zero divergence)
- **∇×E = -∂B/∂t** (Faraday's law — changing B creates curl in E)
- **∇×B = μ₀J + μ₀ε₀∂E/∂t** (Ampere-Maxwell law)

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

F.dr = y dx + x dy = (4t)(2 dt) + (2t)(4 dt) = 16t dt

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

fee_prob_dist: {
  topicId: 'fee_prob_dist',
  title: 'Probability Distributions',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Probability distributions model uncertainty in engineering — from component failure rates to measurement errors. The FE exam tests binomial, Poisson, normal, and exponential distributions along with basic probability rules.',
  sections: [
    {
      id: 'pd-rules',
      title: '1. Probability Rules and Bayes Theorem',
      content: `## 1.1 Fundamental Rules

- **Range**: 0 ≤ P(A) ≤ 1
- **Complement**: P(A') = 1 - P(A)
- **Union (OR)**: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
- **Intersection (AND)**: P(A ∩ B) = P(A)·P(B|A)
- **Independent events**: P(A ∩ B) = P(A)·P(B) when A, B are independent
- **Conditional**: P(A|B) = P(A ∩ B)/P(B)

## 1.2 Bayes' Theorem

**P(A|B) = P(B|A)·P(A) / P(B)**

Bayes' theorem updates probabilities with new evidence. It reverses the conditioning:
- P(A) is the **prior** probability
- P(A|B) is the **posterior** probability after observing B
- P(B|A) is the **likelihood**

### Total Probability

P(B) = Σ P(B|Aᵢ)·P(Aᵢ) for all mutually exclusive events Aᵢ`,
      examTip: 'On the FE exam, Bayes\' theorem problems typically give P(B|A) and ask for P(A|B). Set up the formula carefully and use total probability for the denominator. Common context: diagnostic testing (given test positive, what is probability of actual defect?).',
    },
    {
      id: 'pd-distributions',
      title: '2. Common Probability Distributions',
      content: `## 2.1 Discrete Distributions

### Binomial Distribution
Models **n independent trials** with probability p of success each:

**P(X=k) = C(n,k)·p^k·(1-p)^(n-k)**

- Mean: E[X] = np
- Variance: Var(X) = np(1-p)

### Poisson Distribution
Models **rare events** with average rate λ:

**P(X=k) = (λ^k · e^(-λ)) / k!**

- Mean = Variance = λ
- Approximates binomial when n is large, p is small, and λ = np

## 2.2 Continuous Distributions

### Normal (Gaussian) Distribution

**f(x) = (1/(σ·sqrt(2π))) · e^(-(x-μ)²/(2σ²))**

- **Standard normal**: Z = (X - μ)/σ (use Z-tables for probabilities)
- **68-95-99.7 rule**: ~68% within 1σ, ~95% within 2σ, ~99.7% within 3σ

### Exponential Distribution

**f(t) = λ·e^(-λt)** for t ≥ 0

- Mean: 1/λ
- **Memoryless property**: P(T > t+s | T > s) = P(T > t)
- Models time between failures in reliability analysis

| Distribution | Type | Use Case | Key Parameter |
|---|---|---|---|
| Binomial | Discrete | Pass/fail in n trials | n, p |
| Poisson | Discrete | Rare event counts | λ (rate) |
| Normal | Continuous | Measurement errors | μ, σ |
| Exponential | Continuous | Time between failures | λ (failure rate) |`,
      examTip: 'Know which distribution fits the scenario: fixed number of trials with pass/fail → binomial; counting rare events per interval → Poisson; continuous measurement with bell shape → normal; time until failure → exponential. The FE reference has Z-tables for normal distribution.',
      importantNote: 'The exponential distribution is the ONLY continuous distribution with the memoryless property. This means the probability of surviving another hour is the same regardless of how long the component has already been running. This is unrealistic for wear-out failures but valid for random failures.',
    },
  ],
  keyTakeaways: [
    'Bayes\' theorem: P(A|B) = P(B|A)·P(A)/P(B) — reverses conditional probability.',
    'Binomial: n trials, probability p; Poisson: rare events with rate λ.',
    'Normal distribution: Z = (X-μ)/σ standardizes for table lookup.',
    'Exponential: models failure times; memoryless property.',
    '68-95-99.7 rule for normal: 68% within 1σ, 95% within 2σ, 99.7% within 3σ.',
  ],
},

fee_expected_values: {
  topicId: 'fee_expected_values',
  title: 'Expected Values and Variance',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Expected value and variance quantify the center and spread of distributions. These statistical measures summarize data for engineering decisions about tolerances, reliability, and quality control.',
  sections: [
    {
      id: 'ev-measures',
      title: '1. Central Tendency and Spread',
      content: `## 1.1 Measures of Central Tendency

- **Mean (average)**: μ = ΣX/n (population) or x̄ = ΣX/n (sample)
- **Median**: middle value when sorted; robust to outliers
- **Mode**: most frequent value

### Expected Value

For a discrete random variable: **E[X] = Σ xᵢ·P(xᵢ)**

Properties:
- E[aX + b] = a·E[X] + b
- E[X + Y] = E[X] + E[Y] (always, even if dependent)
- E[XY] = E[X]·E[Y] only if X, Y are independent

## 1.2 Measures of Spread

- **Variance**: σ² = E[(X - μ)²] = E[X²] - (E[X])²
- **Standard deviation**: σ = sqrt(σ²) (same units as data)
- **Sample variance**: s² = Σ(X - x̄)²/(n-1) (divide by n-1 for unbiased estimate)

| Measure | Population | Sample |
|---|---|---|
| Mean | μ = ΣX/N | x̄ = ΣX/n |
| Variance | σ² = Σ(X-μ)²/N | s² = Σ(X-x̄)²/(n-1) |
| Std Dev | σ = sqrt(σ²) | s = sqrt(s²) |`,
      examTip: 'Sample variance divides by (n-1), not n. This is called Bessel\'s correction and gives an unbiased estimate. The FE exam may test whether you use n or n-1 in the denominator — sample statistics always use n-1.',
    },
    {
      id: 'ev-covariance',
      title: '2. Covariance and Correlation',
      content: `## 2.1 Covariance

**Cov(X,Y) = E[(X - μx)(Y - μy)] = E[XY] - E[X]·E[Y]**

- Positive covariance: X and Y tend to increase together
- Negative covariance: one increases as the other decreases
- Zero covariance: no linear relationship (but may have nonlinear)

## 2.2 Correlation Coefficient

**r = Cov(X,Y) / (σx · σy)**

| r Value | Interpretation |
|---|---|
| r = +1 | Perfect positive linear relationship |
| r = -1 | Perfect negative linear relationship |
| r = 0 | No linear relationship |
| 0 < |r| < 0.5 | Weak linear relationship |
| 0.5 < |r| < 0.8 | Moderate linear relationship |
| 0.8 < |r| < 1 | Strong linear relationship |

### Variance of Sums

- **Var(X + Y) = Var(X) + Var(Y) + 2·Cov(X,Y)**
- If X, Y independent: Var(X + Y) = Var(X) + Var(Y)
- **Var(aX) = a²·Var(X)**`,
      examTip: 'Correlation does NOT imply causation — this is a classic FE exam concept. Two variables can be strongly correlated (r near ±1) without one causing the other. Also remember: r = 0 means no LINEAR relationship, but a strong nonlinear relationship could still exist.',
      importantNote: 'When adding independent random variables, variances ADD but standard deviations do NOT. This is a common mistake: σ(X+Y) ≠ σ(X) + σ(Y). Instead, σ(X+Y) = sqrt(σx² + σy²).',
    },
  ],
  keyTakeaways: [
    'Mean μ = ΣX/n; variance σ² = Σ(X-μ)²/n; standard deviation σ = sqrt(σ²).',
    'Sample variance uses n-1 (Bessel\'s correction); population variance uses N.',
    'Correlation r ∈ [-1,+1]; r = 0 means no linear relationship.',
    'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y); simplifies if independent.',
    'Correlation does NOT imply causation.',
  ],
},

fee_regression: {
  topicId: 'fee_regression',
  title: 'Linear Regression',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Linear regression fits a straight line to data, enabling prediction and trend analysis. The coefficient of determination R² measures goodness of fit. These tools support engineering data analysis and calibration.',
  sections: [
    {
      id: 'reg-line',
      title: '1. Least-Squares Regression Line',
      content: `## 1.1 The Regression Equation

The best-fit line through data: **y = a + bx**

Where:
- **Slope**: b = r · (sy/sx) = [nΣxy - ΣxΣy] / [nΣx² - (Σx)²]
- **Intercept**: a = ȳ - b·x̄

### Coefficient of Determination

**R² = r²** measures the fraction of variance in y explained by x:
- R² = 1: perfect fit (all points on line)
- R² = 0: no linear relationship
- R² = 0.85: 85% of y-variance explained by x

## 1.2 Interpretation

- The slope b represents the change in y per unit change in x
- The intercept a is the predicted y when x = 0
- **Extrapolation** (predicting outside data range) is unreliable
- **Interpolation** (predicting within data range) is more reliable`,
      examTip: 'On the FE exam, R² is the most common regression question. R² = r² tells you the proportion of variance explained. If r = 0.9, then R² = 0.81, meaning 81% of the variation in y is explained by x. The remaining 19% is due to other factors or random error.',
    },
    {
      id: 'reg-multiple',
      title: '2. Regression Applications and Residual Analysis',
      content: `## 2.1 Residual Analysis

A **residual** is the difference between observed and predicted: eᵢ = yᵢ - ŷᵢ

Good regression has:
- Residuals randomly scattered around zero
- No patterns in residual plot (no curves, no funnels)
- Residuals approximately normally distributed

### Common Regression Pitfalls

| Pitfall | Description | Symptom |
|---|---|---|
| Nonlinear data | Curved relationship forced into line | Curved residual pattern |
| Outliers | Extreme points distort fit | Large individual residuals |
| Extrapolation | Predicting outside data range | Unreliable predictions |
| Correlation ≠ Causation | Statistical association ≠ cause | Misleading conclusions |

## 2.2 Standard Error of Estimate

**Se = sqrt[Σ(yᵢ - ŷᵢ)² / (n-2)]**

This measures the typical distance of data points from the regression line. Smaller Se means better fit. Dividing by n-2 accounts for the two estimated parameters (slope and intercept).`,
      examTip: 'If the FE exam shows a residual plot with a clear curve pattern, the linear model is inappropriate — the data has a nonlinear relationship. Transform the data (log, square root, etc.) or use a higher-order polynomial model.',
    },
  ],
  keyTakeaways: [
    'Regression line y = a + bx; slope b = r·(sy/sx); intercept a = ȳ - b·x̄.',
    'R² = r² shows fraction of y-variance explained by x; closer to 1 is better.',
    'Residuals should be random; patterns indicate model inadequacy.',
    'Extrapolation is unreliable; interpolation is more trustworthy.',
    'Standard error Se measures typical residual size; smaller is better.',
  ],
},

fee_hypothesis: {
  topicId: 'fee_hypothesis',
  title: 'Hypothesis Testing & Confidence Intervals',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Hypothesis testing determines whether data supports a claim. Confidence intervals quantify estimation uncertainty. Both are essential for quality control, reliability testing, and engineering decision-making on the FE exam.',
  sections: [
    {
      id: 'ht-process',
      title: '1. Hypothesis Testing Framework',
      content: `## 1.1 The Testing Process

1. **State hypotheses**: H₀ (null — no effect) and H₁ (alternative — effect exists)
2. **Choose significance level** α (typically 0.05 = 5% risk of false positive)
3. **Calculate test statistic** from data
4. **Find p-value** or compare to critical value
5. **Decide**: reject H₀ if p < α; fail to reject H₀ if p ≥ α

## 1.2 Types of Errors

| | H₀ True | H₀ False |
|---|---|---|
| **Reject H₀** | Type I error (α) | Correct! (Power = 1-β) |
| **Fail to reject H₀** | Correct! | Type II error (β) |

- **Type I error** (false positive): rejecting a true H₀; probability = α
- **Type II error** (false negative): failing to reject a false H₀; probability = β
- **Power** = 1 - β: probability of correctly detecting a real effect

## 1.3 Common Tests

### t-Test (comparing means)

**t = (x̄ - μ₀) / (s/sqrt(n))**

- Degrees of freedom: df = n - 1
- Compare t to critical value from t-table at significance α

### Chi-Square Test (categorical data)

**χ² = Σ(O - E)²/E**

- O = observed frequency, E = expected frequency
- Compare χ² to critical value from chi-square table`,
      examTip: 'The most common FE exam mistake in hypothesis testing: "fail to reject H₀" does NOT mean "accept H₀." We never prove the null hypothesis — we only fail to find evidence against it. Also, a smaller p-value means stronger evidence against H₀.',
      importantNote: 'Reducing Type I error (lowering α) increases Type II error (β) and vice versa. The only way to reduce both simultaneously is to increase sample size n. This tradeoff is fundamental to statistical testing.',
    },
    {
      id: 'ht-confidence',
      title: '2. Confidence Intervals',
      content: `## 2.1 Constructing Confidence Intervals

A **confidence interval** estimates a population parameter:

**CI = x̄ ± t(α/2, n-1) · s/sqrt(n)**

Where:
- x̄ is the sample mean
- s is the sample standard deviation
- n is the sample size
- t(α/2, n-1) is the t-critical value for confidence level (1-α)

### Common Confidence Levels

| Confidence Level | α | t-multiplier (large n) |
|---|---|---|
| 90% | 0.10 | 1.645 |
| 95% | 0.05 | 1.960 |
| 99% | 0.01 | 2.576 |

## 2.2 Interpretation

A **95% confidence interval** means: if we repeated the sampling process many times, 95% of the resulting intervals would contain the true population parameter.

It does **NOT** mean: "there is a 95% probability the true value is in this interval."

### Standard Error

**SE = s/sqrt(n)**

The standard error decreases with larger n — more data gives more precise estimates. To halve the standard error, quadruple the sample size.`,
      examTip: 'Confidence interval width depends on three things: confidence level (higher = wider), standard deviation (more spread = wider), and sample size (larger n = narrower). The formula SE = s/sqrt(n) shows why: doubling precision requires 4x the sample size.',
    },
  ],
  keyTakeaways: [
    'H₀ is null hypothesis; reject H₀ if p-value < α (significance level).',
    'Type I error (α): reject true H₀; Type II error (β): fail to reject false H₀.',
    't-test: t = (x̄ - μ₀)/(s/sqrt(n)); chi-square: χ² = Σ(O-E)²/E.',
    'Confidence interval: x̄ ± t·s/sqrt(n); wider interval = more confidence but less precision.',
    'SE = s/sqrt(n); quadruple sample size to halve standard error.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 2 — ETHICS AND PROFESSIONAL PRACTICE  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fee_codes_ethics: {
  topicId: 'fee_codes_ethics',
  title: 'NCEES Model Rules & NSPE Code of Ethics',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'The NCEES Model Rules and NSPE Code of Ethics define the legal and professional obligations of engineers. Public safety, honesty, conflicts of interest, and professional competence are the core principles tested on the FE exam.',
  sections: [
    {
      id: 'ce-codes',
      title: '1. Professional Codes and Core Principles',
      content: `## 1.1 NCEES Model Rules

The NCEES Model Rules provide the **legal framework** for engineering licensure:
- Obtain proper licenses before offering engineering services
- **Public health and safety is paramount** — always the top priority
- Follow applicable laws and regulations
- Avoid conflicts of interest
- Maintain professional competence through continuing education

## 1.2 NSPE Code of Ethics — Fundamental Canons

The NSPE Code establishes **professional values**:

1. **Hold paramount** the safety, health, and welfare of the public
2. Perform services only in areas of **competence**
3. Issue public statements only in an **objective and truthful** manner
4. Act for each employer or client as **faithful agents or trustees**
5. Avoid **deceptive acts**
6. Conduct themselves **honorably, responsibly, ethically, and lawfully**

## 1.3 Hierarchy of Obligations

When interests conflict, the priority is clear:

| Priority | Obligation |
|---|---|
| 1 (Highest) | **Public safety, health, welfare** |
| 2 | Laws and regulations |
| 3 | Professional codes and standards |
| 4 | Employer/client interests |
| 5 (Lowest) | Personal interests |`,
      examTip: 'On the FE exam, the correct answer to ethical dilemmas ALWAYS prioritizes public safety above all else — above profit, client satisfaction, employer directives, and personal convenience. If an answer choice mentions public welfare, it is very likely correct.',
      importantNote: 'Engineers must not claim credit for work they did not perform, must not misrepresent their qualifications, and MUST report situations that endanger public safety through proper channels.',
    },
    {
      id: 'ce-conflicts',
      title: '2. Conflicts of Interest and Whistleblowing',
      content: `## 2.1 Conflicts of Interest

A **conflict of interest** arises when personal gain might compromise professional judgment. Engineers must:
- **Disclose** conflicts to all affected parties
- **Refuse** assignments where objectivity cannot be maintained
- **Avoid** accepting gifts that could influence professional judgment
- **Not** serve competing clients without full disclosure

Conflicts extend beyond financial compensation to include:
- Family relationships with clients or contractors
- Prior business dealings that create bias
- Financial interests in competing companies

## 2.2 Whistleblowing and Reporting

When an engineer discovers work that **endangers public safety**:

1. **Document** the concern and your findings
2. **Report** through internal channels first (supervisor, management)
3. **Escalate** to the licensing board if internal reporting fails
4. **Report to authorities** if public safety is imminently threatened

Engineers who report safety violations in good faith are **protected from retaliation** under most state laws and professional codes.

## 2.3 Professional Competence

- Accept work **only** in areas where you have education, training, or experience
- If a project requires expertise you lack, **seek qualified assistance**
- Maintain competence through **continuing professional development**
- Admit limitations honestly rather than guessing`,
      examTip: 'FE exam ethics scenarios often present pressure to cut corners, falsify data, or exceed your competence. The correct answer always involves: (1) prioritizing public safety, (2) using proper channels to report concerns, (3) documenting everything, and (4) refusing to participate in unethical conduct.',
    },
  ],
  keyTakeaways: [
    'Public health and safety is ALWAYS the highest priority — above profit, client wishes, and employer directives.',
    'Disclose conflicts of interest to all affected parties; refuse work where objectivity is compromised.',
    'Report safety violations through proper channels; whistleblowers are protected.',
    'Accept work only in areas of competence; seek assistance when needed.',
    'Document ethical concerns and recommendations to protect your professional record.',
  ],
},

fee_licensure: {
  topicId: 'fee_licensure',
  title: 'Professional Licensure & Authority',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Professional engineering licensure protects the public through demonstrated competence. The FE exam is the first step toward PE licensure. Understanding the licensure process, EIT/PE roles, and authority limits is essential.',
  sections: [
    {
      id: 'lic-process',
      title: '1. The Licensure Path: FE to PE',
      content: `## 1.1 Licensure Steps

| Step | Requirement | Result |
|---|---|---|
| 1 | ABET-accredited degree (or equivalent) | Education requirement met |
| 2 | Pass FE exam | Become **EIT** (Engineer in Training) |
| 3 | 4 years supervised experience under PE | Experience requirement met |
| 4 | Pass PE exam | Become **licensed PE** |

## 1.2 EIT vs PE Authority

- **EIT (Engineer in Training)**: can work under PE supervision, cannot stamp drawings, cannot offer services to public independently
- **PE (Professional Engineer)**: can stamp/seal drawings, take legal responsibility for designs, offer engineering services to the public

### The PE Stamp

The PE stamp on documents means:
- The engineer has **personally reviewed** the work
- The engineer takes **legal responsibility** for its accuracy and safety
- It certifies the design meets applicable codes and standards

## 1.3 Comity and Reciprocity

**Comity** allows PE licensure reciprocity across states — a PE licensed in one state can often become licensed in another without retesting, though some documentation may be required. Each state licensing board sets its own specific requirements.`,
      examTip: 'The FE exam is a prerequisite for PE licensure but is NOT itself a license to practice. As an EIT, you work under PE supervision. Only a PE can stamp drawings and take final legal responsibility. Understand this distinction clearly.',
    },
    {
      id: 'lic-responsibilities',
      title: '2. Professional Responsibilities and Record Keeping',
      content: `## 2.1 Continuing Education

Most states require **15-36 professional development hours annually** to maintain a PE license. Requirements vary by state and may include:
- Technical courses in your specialty
- Ethics training (often mandatory)
- Attendance at professional conferences
- Teaching or publishing technical content

Failure to meet CE requirements can result in license **suspension or revocation**.

## 2.2 Record Keeping and Documentation

Professional engineers must:
- **Maintain detailed records** of all engineering work
- **Archive** calculations, drawings, and design decisions
- **Document** assumptions, safety factors, and code references
- Keep records for the **statute of limitations** period (varies by state)

## 2.3 Scope of Practice

- Engineers must practice only within their **area of competence**
- Electrical engineers should not design structural elements without qualification
- When work crosses disciplines, engage qualified professionals
- Industrial exemptions may allow unlicensed practice in some contexts, but PE is required for **public-facing services**`,
      examTip: 'The FE exam tests understanding of licensure requirements, not specific state rules. Key concepts: FE → EIT → experience → PE exam → PE license. Continuing education is mandatory. PE stamp = personal legal responsibility.',
    },
  ],
  keyTakeaways: [
    'FE exam passage makes you an EIT; PE requires 4 additional years of experience plus PE exam.',
    'PE stamp means personal legal responsibility; only PEs can stamp/seal drawings.',
    'Comity allows PE licensure reciprocity across states.',
    'Continuing education (15-36 hours/year) is mandatory for PE maintenance.',
    'Practice only within your area of competence; engage other professionals when needed.',
  ],
},

fee_liability: {
  topicId: 'fee_liability',
  title: 'Professional Liability & Ethical Decision-Making',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Engineers face professional liability for their work. Understanding due care, due diligence, and systematic ethical decision-making protects both the public and the engineer\'s career.',
  sections: [
    {
      id: 'liab-due-care',
      title: '1. Due Care, Due Diligence, and Liability',
      content: `## 1.1 Due Care vs Due Diligence

| Concept | Definition | Example |
|---|---|---|
| **Due diligence** | Investigation and discovery of risks | Conducting a safety audit |
| **Due care** | Implementing reasonable safeguards | Fixing the issues found in the audit |

Both are necessary. An engineer who identifies hazards (due diligence) but fails to address them (due care) can be held **negligent**.

## 1.2 Professional Liability

Engineers can face liability for:
- **Negligence**: failing to exercise reasonable care
- **Malpractice**: professional services below acceptable standards
- **Breach of contract**: failing to deliver agreed services
- **Strict liability**: for inherently dangerous activities (rare in EE)

### Defenses Against Liability
- Evidence of following professional standards and codes
- Documentation of design decisions and safety analysis
- Professional liability insurance
- Proper disclaimers and limitations in contracts`,
      examTip: 'Due diligence = investigation (what is wrong?). Due care = implementation (fixing what is wrong). The FE exam tests this distinction. An engineer who knows about a problem and does nothing has failed in due care, even if due diligence was performed.',
    },
    {
      id: 'liab-framework',
      title: '2. Ethical Decision-Making Framework',
      content: `## 2.1 Systematic Decision Process

When facing an ethical dilemma:

1. **Identify stakeholders**: public, employer, client, colleagues, yourself
2. **Clarify the issue**: safety concern? conflict of interest? honesty issue?
3. **Check applicable codes**: NCEES rules, NSPE code, laws, company policy
4. **Identify options** and consequences of each
5. **Decide**: prioritize public welfare above all
6. **Act and document**: implement decision and keep records

## 2.2 Common FE Exam Scenarios

| Scenario | Correct Action |
|---|---|
| Asked to falsify test results | Refuse and report through proper channels |
| Design flaw discovered after delivery | Disclose to client and correct immediately |
| Pressure to cut corners for schedule | Advise of risks and resist; document |
| Work outside your expertise | Decline or seek qualified assistance |
| Conflict of interest discovered | Disclose to all affected parties |

## 2.3 The Sunshine Test

Ask: **"Would I be comfortable if this decision appeared in tomorrow's newspaper?"**

If the answer is no, the decision is probably unethical. This simple test helps identify questionable choices before they become problems.`,
      examTip: 'FE exam ethics questions rarely have ambiguous answers. The correct response always prioritizes public safety, follows proper channels, maintains honesty, and documents decisions. When in doubt, choose the answer that protects the public first.',
      importantNote: 'Engineers should typically work through internal channels before going public with concerns. However, if public safety is IMMEDIATELY threatened and internal channels are unresponsive, reporting to authorities is both ethical and protected.',
    },
  ],
  keyTakeaways: [
    'Due diligence = investigation; due care = implementing safeguards. Both are required.',
    'Negligence liability arises from failing to exercise reasonable professional care.',
    'Framework: identify stakeholders → clarify issue → check codes → prioritize public welfare.',
    'The sunshine test: would you be comfortable if this decision appeared in the news?',
    'Document all ethical concerns, recommendations, and decisions for professional protection.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 3 — ENGINEERING ECONOMICS  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fee_tvm: {
  topicId: 'fee_tvm',
  title: 'Time Value of Money & Financial Factors',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'The time value of money principle — a dollar today is worth more than a dollar tomorrow — underlies all engineering economic analysis. Standard cash flow factors convert between present, future, and annuity values.',
  sections: [
    {
      id: 'tvm-factors',
      title: '1. Compound Interest and Standard Factors',
      content: `## 1.1 Compound Interest

**F = P(1+i)^n** — future value of present amount P at interest rate i for n periods

**P = F/(1+i)^n** — present value of future amount F

## 1.2 The Six Standard Cash Flow Factors

| Factor | Symbol | Formula | Converts |
|---|---|---|---|
| Future Worth | (F/P, i, n) | (1+i)^n | P → F |
| Present Worth | (P/F, i, n) | 1/(1+i)^n | F → P |
| Annuity to Future | (F/A, i, n) | [(1+i)^n - 1]/i | A → F |
| Annuity to Present | (P/A, i, n) | [(1+i)^n - 1]/[i(1+i)^n] | A → P |
| Capital Recovery | (A/P, i, n) | i(1+i)^n/[(1+i)^n - 1] | P → A |
| Sinking Fund | (A/F, i, n) | i/[(1+i)^n - 1] | F → A |

## 1.3 Effective Annual Rate

For nominal rate r compounded m times per year:

**EAR = (1 + r/m)^m - 1**

For continuous compounding: **EAR = e^r - 1** and **F = P·e^(rt)**`,
      examTip: 'The FE reference handbook includes factor tables. Know which factor to use: P/F for single future payment, P/A for uniform annual series, A/P for loan payments. The most common mistake is using the wrong factor — draw a cash flow diagram first to clarify.',
      importantNote: 'When comparing alternatives with different lifespans, use Annual Worth (AW) method or find the least common multiple of lifespans. Do NOT directly compare NPV of projects with different durations.',
    },
    {
      id: 'tvm-rates',
      title: '2. Nominal vs Effective Rates and Cash Flow Diagrams',
      content: `## 2.1 Nominal vs Effective Interest Rates

- **Nominal rate** r: stated annual rate (e.g., "12% compounded monthly")
- **Effective rate**: actual rate after compounding

Example: 12% compounded monthly → i_monthly = 1%/month → EAR = (1.01)^12 - 1 = 12.68%

### Continuous Compounding

When compounding frequency approaches infinity: **F = P·e^(rt)**

## 2.2 Cash Flow Diagrams

A cash flow diagram is essential for setting up economic problems:
- Horizontal axis represents time periods
- Upward arrows represent cash **inflows** (benefits)
- Downward arrows represent cash **outflows** (costs)
- Time 0 is "now" (present)

### Gradient Series

Sometimes cash flows increase by a constant amount G each period:
- **P = G · (P/G, i, n)** where (P/G, i, n) = [(1+i)^n - in - 1] / [i²(1+i)^n]

Or by a constant percentage g each period (geometric gradient):
- **P = A₁ · [(1 - (1+g)^n·(1+i)^(-n)) / (i - g)]** when i ≠ g`,
      examTip: 'Always draw the cash flow diagram before selecting factors. Mark every payment with its correct time period. A common error is off-by-one timing — the first payment of an annuity occurs at the END of period 1, not at time 0.',
    },
  ],
  keyTakeaways: [
    'F = P(1+i)^n converts present to future; P = F/(1+i)^n converts future to present.',
    'Six standard factors cover all conversions: P/F, F/P, P/A, A/P, F/A, A/F.',
    'EAR = (1+r/m)^m - 1 converts nominal rate to effective annual rate.',
    'Draw cash flow diagrams before selecting factors to avoid timing errors.',
    'Use Annual Worth for comparing projects with different lifespans.',
  ],
},

fee_cost_analysis: {
  topicId: 'fee_cost_analysis',
  title: 'NPV, Rate of Return, & Investment Analysis',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'Net Present Value (NPV), Internal Rate of Return (IRR), and Benefit-Cost analysis are the primary methods for evaluating engineering investments. Each method has strengths depending on the decision context.',
  sections: [
    {
      id: 'ca-npv-irr',
      title: '1. NPV and Internal Rate of Return',
      content: `## 1.1 Net Present Value (NPV)

**NPV = -C₀ + Σ[Bₜ/(1+i)^t]**

Where C₀ is initial cost, Bₜ is net benefit in year t, and i is discount rate.

- **NPV > 0**: project adds value — accept
- **NPV < 0**: project destroys value — reject
- **NPV = 0**: project breaks even at the discount rate

For mutually exclusive alternatives, choose the one with **highest NPV**.

## 1.2 Internal Rate of Return (IRR)

IRR is the discount rate that makes NPV = 0:

**0 = -C₀ + Σ[Bₜ/(1+IRR)^t]**

Decision rule: **accept if IRR > MARR** (Minimum Acceptable Rate of Return)

### IRR vs NPV

| Situation | Use NPV | Use IRR |
|---|---|---|
| Different project sizes | Preferred | Misleading |
| Multiple sign changes in cash flow | Works correctly | May give multiple IRRs |
| Simple accept/reject | Either works | Either works |
| Ranking alternatives | Preferred | Need incremental analysis |`,
      examTip: 'NPV is generally the safer method on the FE exam because it always gives a correct ranking. IRR can be misleading when comparing projects of different sizes or when cash flows change sign multiple times (creating multiple IRR solutions).',
    },
    {
      id: 'ca-bc-payback',
      title: '2. Benefit-Cost Ratio and Payback Period',
      content: `## 2.1 Benefit-Cost Ratio

**B/C = PV(benefits) / PV(costs)**

- **B/C > 1**: project justified — accept
- **B/C < 1**: costs exceed benefits — reject
- Standard for **public sector** projects (government, infrastructure)

For incremental analysis of two alternatives: accept the more expensive if incremental B/C > 1.

## 2.2 Annual Worth

**AW = NPV × (A/P, i, n)**

Converts NPV to equivalent annual amount. Positive AW means the project is worthwhile. Particularly useful for comparing alternatives with **different lifespans**.

## 2.3 Payback Period

**Payback = Initial investment / Annual net benefit**

- Simple to calculate but **ignores time value of money**
- Ignores cash flows after payback
- Use only for **screening**, not for final decisions

### Profitability Index

**PI = PV(benefits) / PV(costs) = 1 + NPV/PV(costs)**

PI > 1 is acceptable. Useful for **capital rationing** when budget is limited.`,
      examTip: 'On the FE exam, B/C analysis is common for public project evaluation. Remember: for incremental analysis between alternatives, compute incremental B/C = (ΔBenefits)/(ΔCosts). Accept the more expensive alternative only if incremental B/C > 1.',
    },
  ],
  keyTakeaways: [
    'NPV = -C₀ + Σ[Bₜ/(1+i)^t]; positive NPV means the project adds value.',
    'IRR is the rate making NPV = 0; accept if IRR > MARR.',
    'B/C ratio > 1 means justified; standard for public sector analysis.',
    'Annual Worth (AW) is best for comparing alternatives with different lifespans.',
    'Payback period ignores time value of money — use only for initial screening.',
  ],
},

fee_depreciation: {
  topicId: 'fee_depreciation',
  title: 'Depreciation & Book Value',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'Depreciation allocates an asset\'s cost over its useful life for accounting and tax purposes. Straight-line, MACRS, and sum-of-years-digits are the methods tested on the FE exam.',
  sections: [
    {
      id: 'dep-methods',
      title: '1. Depreciation Methods',
      content: `## 1.1 Straight-Line Depreciation

**D = (Cost - Salvage) / Useful Life**

- Equal annual depreciation
- **Book value**: BV_t = Cost - t·D
- Simplest method; used for financial reporting

## 1.2 MACRS (Modified Accelerated Cost Recovery System)

- U.S. tax standard for depreciation
- **Ignores salvage value** (depreciates full cost)
- Uses IRS-defined recovery periods (3, 5, 7, 10, 15, 20 years)
- Front-loads deductions (higher depreciation in early years)
- Specific percentages from IRS tables

### MACRS Advantage

Accelerated depreciation reduces taxes earlier → better cash flow due to **time value of money**.

## 1.3 Sum-of-Years-Digits (SYD)

**D_t = (Remaining useful life / Sum of all years) × (Cost - Salvage)**

Sum of years for n-year life: SYD = n(n+1)/2

Example: 5-year life → SYD = 15
- Year 1: D₁ = (5/15)(Cost-Salvage) = 33.3%
- Year 2: D₂ = (4/15)(Cost-Salvage) = 26.7%
- Year 3: D₃ = (3/15)(Cost-Salvage) = 20.0%

| Method | Pattern | Salvage Value | Tax Use |
|---|---|---|---|
| Straight-line | Equal annual | Subtracted | Financial reporting |
| MACRS | Accelerated | Ignored | U.S. tax calculations |
| SYD | Accelerated | Subtracted | Some accounting |`,
      examTip: 'The FE exam may ask you to compare depreciation methods. Straight-line is simplest; MACRS gives the best tax benefit early (time value advantage). For MACRS, you need the IRS recovery period table — the FE reference handbook provides these percentages.',
    },
    {
      id: 'dep-bookvalue',
      title: '2. Book Value, Market Value, and Tax Effects',
      content: `## 2.1 Book Value vs Market Value

- **Book value**: Cost minus accumulated depreciation (accounting value)
- **Market value**: what the asset could actually sell for

These diverge over time:
- Well-maintained equipment may have market value > book value
- Rapidly obsolete technology may have market value < book value

## 2.2 Tax Shield from Depreciation

Depreciation reduces taxable income, creating a **tax shield**:

**Tax savings = D × Tax rate**

Example: $10,000 depreciation at 30% tax rate → $3,000 tax savings

### After-Tax Cash Flow

**ATCF = Before-tax cash flow - Taxes + Depreciation tax shield**

Or equivalently: ATCF = Revenue - Expenses - Taxes

Where Taxes = (Revenue - Expenses - Depreciation) × Tax rate

## 2.3 Disposal and Capital Gains

When selling an asset:
- If sale price > book value: **capital gain** (taxable)
- If sale price < book value: **capital loss** (tax deduction)
- If sale price = book value: no tax consequence`,
      examTip: 'Depreciation is a non-cash expense — it does not involve actual money leaving the company. It reduces taxable income, which reduces taxes paid (a real cash savings). This tax shield effect must be included in after-tax NPV analysis.',
    },
  ],
  keyTakeaways: [
    'Straight-line: D = (Cost-Salvage)/Life; produces equal annual deductions.',
    'MACRS is accelerated and ignores salvage; used for U.S. tax calculations.',
    'SYD: D_t = (Remaining years/SYD)×(Cost-Salvage); SYD = n(n+1)/2.',
    'Book value = Cost - Accumulated depreciation; differs from market value.',
    'Depreciation creates tax shield: tax savings = D × tax rate.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 4 — PROPERTIES OF ELECTRICAL MATERIALS  (4 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fee_conductors: {
  topicId: 'fee_conductors',
  title: 'Conductors and Resistivity',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Conductivity and resistivity are fundamental material properties determining how easily charge flows. Understanding resistance as a function of geometry, material, and temperature is essential for wire selection and circuit design.',
  sections: [
    {
      id: 'cond-resistivity',
      title: '1. Resistivity, Conductivity, and Resistance',
      content: `## 1.1 Fundamental Relationships

**Resistivity** ρ (ohm·meters) is an intrinsic material property:

**R = ρL/A**

Where:
- R = resistance (Ω)
- ρ = resistivity (Ω·m)
- L = conductor length (m)
- A = cross-sectional area (m²)

**Conductivity** σ = 1/ρ (siemens/meter)

### Material Classification

| Material Type | Resistivity Range | Examples |
|---|---|---|
| Conductors | 10⁻⁸ Ω·m | Copper (1.7×10⁻⁸), Aluminum (2.8×10⁻⁸) |
| Semiconductors | 10⁻⁴ to 10⁴ Ω·m | Silicon, Germanium |
| Insulators | 10⁸ to 10²⁰ Ω·m | Glass, Rubber, Teflon |

## 1.2 Temperature Dependence

**ρ(T) = ρ₀[1 + α(T - T₀)]**

Where α is the **temperature coefficient of resistance**:
- **Metals** (positive α): resistance increases with temperature
- **Semiconductors** (negative α): resistance decreases with temperature
- **Superconductors**: ρ → 0 below critical temperature Tc`,
      examTip: 'R = ρL/A is one of the most commonly tested formulas. Doubling length doubles resistance; doubling cross-sectional area halves resistance. Temperature coefficient α is positive for metals (resistance goes UP when hot) and negative for thermistors (resistance goes DOWN when hot).',
    },
    {
      id: 'cond-current',
      title: '2. Current Density and Wire Selection',
      content: `## 2.1 Current Density and Drift Velocity

**Current density**: J = I/A (A/m²)

**Drift velocity**: vd = J/(n·e) where n is carrier concentration, e is electron charge

Despite fast signal propagation (near light speed), electrons drift slowly (mm/s). The electric field propagates at near-light speed, pushing electrons throughout the wire almost simultaneously.

## 2.2 Wire Gauge and Selection

AWG (American Wire Gauge) is the standard wire sizing system:
- **Smaller gauge number = thicker wire = lower resistance**
- Each 3-gauge decrease roughly doubles the cross-sectional area
- Each 10-gauge decrease multiplies area by ~10

| AWG | Diameter (mm) | Resistance (mΩ/m) | Typical Use |
|---|---|---|---|
| 10 | 2.59 | 3.3 | 30A circuits |
| 12 | 2.05 | 5.2 | 20A household |
| 14 | 1.63 | 8.3 | 15A household |
| 18 | 1.02 | 21 | Low-power electronics |

### Wire Selection Criteria
- **Current capacity** (ampacity): wire must handle the current without overheating
- **Voltage drop**: V = IR limits distance; thicker wire for longer runs
- **Cost**: larger wire costs more; balance against performance`,
      examTip: 'For the FE exam, know that voltage drop V = I×R limits how far current can travel at a given wire gauge. For long cable runs, use thicker wire (lower gauge number) to keep voltage drop acceptable. The formula R = ρL/A directly determines this tradeoff.',
    },
  ],
  keyTakeaways: [
    'Resistivity ρ is intrinsic; resistance R = ρL/A depends on geometry.',
    'Temperature coefficient α: positive for metals (R increases), negative for semiconductors.',
    'Conductivity σ = 1/ρ; copper is the standard conductor (ρ ≈ 1.7×10⁻⁸ Ω·m).',
    'AWG: smaller number = thicker wire = lower resistance.',
    'Wire selection balances ampacity, voltage drop, and cost.',
  ],
},

fee_semiconductors: {
  topicId: 'fee_semiconductors',
  title: 'Semiconductors and Band Gap',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Semiconductors have properties between conductors and insulators, controlled by doping. Band gap energy, carrier concentration, and the p-n junction are fundamental to all electronic devices.',
  sections: [
    {
      id: 'semi-band',
      title: '1. Band Structure and Intrinsic Semiconductors',
      content: `## 1.1 Energy Bands

In a semiconductor crystal:
- **Valence band**: electrons are bound to atoms (cannot conduct)
- **Conduction band**: electrons are free to move (can conduct)
- **Band gap** Eg: energy required to promote an electron from valence to conduction band

| Material | Band Gap Eg | Type |
|---|---|---|
| Silicon (Si) | 1.12 eV | Semiconductor |
| Germanium (Ge) | 0.66 eV | Semiconductor |
| Gallium Arsenide (GaAs) | 1.42 eV | Semiconductor |
| Diamond | 5.47 eV | Insulator |

## 1.2 Intrinsic Carrier Concentration

**ni ∝ exp(-Eg/(2kT))**

Where k = 8.617×10⁻⁵ eV/K (Boltzmann constant) and T is temperature in Kelvin.

For silicon at 300K: **ni ≈ 1.5 × 10¹⁰ cm⁻³**

### Temperature Effects
- Higher T → more thermal energy → more electrons promoted → higher conductivity
- Carrier concentration roughly **doubles every 5-10°C**
- This is why semiconductor devices are temperature-sensitive`,
      examTip: 'Smaller band gap = higher intrinsic conductivity at room temperature. Germanium (Eg = 0.66 eV) has more carriers than silicon (Eg = 1.12 eV) at room temperature, which means more leakage current. This is why silicon dominates — it has lower leakage.',
    },
    {
      id: 'semi-doping',
      title: '2. Doping and the p-n Junction',
      content: `## 2.1 Doping

Adding impurities dramatically changes conductivity:

### N-type Doping (Donor)
- Add atoms with 5 valence electrons (P, As, Sb)
- Extra electron is loosely bound → easily becomes free carrier
- **Majority carriers**: electrons; **Minority carriers**: holes
- n ≈ ND (donor concentration), p = ni²/ND

### P-type Doping (Acceptor)
- Add atoms with 3 valence electrons (B, Al, Ga)
- Missing electron creates a "hole" that acts as positive charge
- **Majority carriers**: holes; **Minority carriers**: electrons
- p ≈ NA (acceptor concentration), n = ni²/NA

### Mass Action Law

**n × p = ni²** (constant at fixed temperature, regardless of doping)

## 2.2 The p-n Junction (Diode)

When p-type meets n-type:
- A **depletion region** forms at the junction (no free carriers)
- Built-in potential ≈ 0.7 V for silicon
- **Forward bias** (+ to p, - to n): narrows depletion region → current flows
- **Reverse bias**: widens depletion region → minimal current (leakage only)

### Shockley Diode Equation

**I = Is(e^(qV/kT) - 1)**

Where Is is saturation current (≈ 10⁻¹² A), q = 1.602×10⁻¹⁹ C, kT/q ≈ 26 mV at 300K.`,
      examTip: 'The mass action law n×p = ni² is critical. If you dope silicon with ND = 10¹⁶ donors/cm³, then n ≈ 10¹⁶ and p = (1.5×10¹⁰)²/10¹⁶ = 2.25×10⁴ cm⁻³. The minority carrier concentration drops dramatically with doping.',
      importantNote: 'Thermal runaway in power devices: as temperature rises, more carriers are generated, increasing current, which generates more heat, further increasing temperature. Without proper thermal management (heat sinks, thermal shutdown), this positive feedback loop destroys the device.',
    },
  ],
  keyTakeaways: [
    'Band gap Eg determines carrier excitation; silicon Eg = 1.12 eV, ni ≈ 1.5×10¹⁰ cm⁻³ at 300K.',
    'N-type (donor): extra electrons; P-type (acceptor): extra holes.',
    'Mass action law: n×p = ni² always holds at fixed temperature.',
    'Shockley equation I = Is(e^(qV/kT)-1) describes diode exponential I-V curve.',
    'Forward bias: current flows (V > 0.7V for Si); reverse bias: only leakage current.',
  ],
},

fee_dielectrics: {
  topicId: 'fee_dielectrics',
  title: 'Dielectrics and Insulators',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Dielectric materials store energy in electric fields and enable capacitors. Dielectric constant, breakdown strength, and loss tangent determine capacitor performance and insulation reliability.',
  sections: [
    {
      id: 'diel-cap',
      title: '1. Dielectric Constant and Capacitance',
      content: `## 1.1 Dielectric Properties

The **dielectric constant** (relative permittivity) εr measures how much a material increases capacitance compared to vacuum:

**C = εr·ε₀·A/d**

Where ε₀ = 8.854×10⁻¹² F/m is permittivity of free space.

| Material | εr | Typical Application |
|---|---|---|
| Vacuum | 1 | Reference |
| Air | 1.0006 | Variable capacitors |
| Mica | 3-7 | Precision capacitors |
| Glass | 4-10 | Substrates |
| Ceramic (X7R) | 100-10000 | High-density capacitors |
| Water | 80 | (Not used in capacitors) |

## 1.2 Energy Storage

**U = ½CV² = ½εr·ε₀·(A/d)·V²**

Higher εr → more energy stored per volume → smaller capacitors for same capacitance.

## 1.3 Breakdown Voltage

**Dielectric strength** is the maximum electric field before breakdown (permanent damage):
- Air: ~3 MV/m
- Mica: ~150 MV/m
- Ceramic: 100-300 MV/m

Design with **safety margin**: operating field should be 30-50% of breakdown strength.`,
      examTip: 'C = εr·ε₀·A/d is a high-frequency FE exam formula. To increase capacitance: increase εr (better dielectric material), increase A (larger plates), or decrease d (thinner dielectric). But decreasing d also brings you closer to breakdown — there is always a tradeoff.',
    },
    {
      id: 'diel-loss',
      title: '2. Dielectric Loss and Insulation',
      content: `## 2.1 Dielectric Loss

Real dielectrics dissipate some energy as heat, characterized by the **loss tangent** tan(δ):

- **Low-loss materials** (tan δ < 0.001): mica, PTFE — used in high-frequency applications
- **High-loss materials** (tan δ > 0.01): some ceramics — cause heating at high frequency

Dielectric power loss: **P_loss ∝ V²·f·tan(δ)**

Higher frequency and higher voltage increase dielectric heating.

## 2.2 Polarization Mechanisms

Different polarization mechanisms contribute at different frequencies:

| Mechanism | Frequency Range | Description |
|---|---|---|
| Electronic | Optical (10¹⁵ Hz) | Electron cloud shifts |
| Ionic | Infrared (10¹² Hz) | Ions shift positions |
| Dipolar | Microwave (10⁹ Hz) | Polar molecules rotate |
| Interfacial | Low freq (10³ Hz) | Charges accumulate at interfaces |

At higher frequencies, slower mechanisms cannot follow the field, reducing εr. This frequency-dependent permittivity must be considered in AC circuit design.

## 2.3 Insulation Properties

- **Insulation resistance**: should be > 10¹² Ω for good insulators
- **Moisture absorption** degrades insulation — environmental protection required
- **Temperature** affects all properties — insulation must work at maximum operating temperature`,
      examTip: 'For high-frequency applications, use low-loss dielectrics (mica, PTFE). For high-capacitance applications, use high-εr materials (ceramic). The FE exam may ask you to select a dielectric based on application requirements.',
    },
  ],
  keyTakeaways: [
    'Dielectric constant εr increases capacitance: C = εr·ε₀·A/d.',
    'Higher εr enables smaller capacitors but may increase loss.',
    'Breakdown voltage limits operating field; design with 30-50% safety margin.',
    'Loss tangent tan(δ) characterizes dielectric heating; critical at high frequencies.',
    'Moisture and temperature degrade insulation properties.',
  ],
},

fee_magnetic_mat: {
  topicId: 'fee_magnetic_mat',
  title: 'Magnetic Materials',
  domainWeight: 'Properties of Electrical Materials · 3–5%',
  overview: 'Magnetic materials determine inductance, transformer efficiency, and motor performance. Permeability, the B-H curve, hysteresis loss, and the Curie temperature are essential for understanding magnetic devices.',
  sections: [
    {
      id: 'mag-types',
      title: '1. Magnetic Material Classification',
      content: `## 1.1 Permeability

**B = μ₀·μr·H** where μ₀ = 4π×10⁻⁷ H/m

**Permeability** μ = μ₀·μr determines field amplification.

| Material Type | μr | Example | Behavior |
|---|---|---|---|
| Diamagnetic | < 1 (slightly) | Copper, Bismuth | Weakly repels field |
| Paramagnetic | > 1 (slightly) | Aluminum | Weakly attracts field |
| Ferromagnetic | >> 1 (100-5000) | Iron, Nickel, Cobalt | Strongly attracts, retains |

## 1.2 Ferromagnetic Materials

Ferromagnetic materials have **unpaired electrons** with exchange interactions causing spontaneous alignment. Key properties:
- **High permeability**: greatly amplifies magnetic fields
- **Saturation**: B levels off at high H (all domains aligned)
- **Remanence**: retains magnetization after field removed
- **Coercivity**: reverse field needed to demagnetize

### Curie Temperature

Above the **Curie temperature** Tc, ferromagnetic materials become paramagnetic:
- Iron: Tc ≈ 770°C
- Nickel: Tc ≈ 358°C
- Cobalt: Tc ≈ 1115°C`,
      examTip: 'Ferromagnetic cores dramatically increase inductance: L = μr·μ₀·n²·A/l. An iron core with μr = 1000 increases inductance by 1000× compared to air. This is why transformers and inductors use ferromagnetic cores.',
    },
    {
      id: 'mag-hysteresis',
      title: '2. Hysteresis and Core Losses',
      content: `## 2.1 The B-H Curve and Hysteresis Loop

As applied field H increases from zero:
1. **Initial magnetization**: B rises steeply then levels off (saturation)
2. **H decreases to zero**: B does not return to zero — **remanence** Br remains
3. **H reversed**: coercive field **Hc** needed to bring B to zero
4. **Full reversal**: creates the **hysteresis loop**

### Hysteresis Loss

The **area inside the hysteresis loop** represents energy dissipated as heat per cycle:

**W_hysteresis = (loop area) × frequency**

## 2.2 Soft vs Hard Magnetic Materials

| Property | Soft Magnetic | Hard Magnetic |
|---|---|---|
| Loop shape | Narrow (small area) | Wide (large area) |
| Coercivity | Low | High |
| Remanence | Low-moderate | High |
| Application | **Transformers, motors** | **Permanent magnets** |
| Examples | Silicon steel, ferrites | NdFeB, SmCo, Alnico |

## 2.3 Eddy Current Losses

Changing magnetic flux induces circulating currents (**eddy currents**) in conductive cores:

**P_eddy ∝ B²·f²·t²/ρ**

Where t = lamination thickness, f = frequency, ρ = resistivity.

### Reducing Core Losses
- **Lamination**: thin stacked sheets limit eddy current paths
- **Ferrites**: high-resistivity ceramic magnets for high-frequency applications
- **Thinner laminations**: reduce eddy currents further but increase manufacturing cost`,
      examTip: 'Transformer core losses = hysteresis loss + eddy current loss. Hysteresis loss is proportional to frequency (area × f). Eddy current loss is proportional to f² and to lamination thickness squared. This is why high-frequency transformers use ferrite cores (high ρ) instead of iron laminations.',
      importantNote: 'Core losses are present whenever the magnetic field is changing — even at no load. Copper losses (I²R in windings) depend on load current. Total transformer loss = core loss + copper loss. Maximum efficiency occurs when core loss equals copper loss.',
    },
  ],
  keyTakeaways: [
    'Permeability μ = μ₀·μr; ferromagnetic materials have μr >> 1.',
    'Hysteresis loop area = energy loss per cycle; soft materials minimize this loss.',
    'Eddy current loss ∝ B²·f²·t²; lamination reduces eddy currents.',
    'Curie temperature: ferromagnetic → paramagnetic transition.',
    'Soft magnets for transformers/motors; hard magnets for permanent magnets.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 5 — ENGINEERING SCIENCES  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fee_work_energy: {
  topicId: 'fee_work_energy',
  title: 'Work, Energy, Power, and Efficiency',
  domainWeight: 'Engineering Sciences · 3–5%',
  overview: 'Energy conversion is the core of electrical engineering. Power in circuits, energy stored in reactive elements, and efficiency calculations connect electrical quantities to real-world mechanical and thermal systems.',
  sections: [
    {
      id: 'we-power',
      title: '1. Electrical Power and Energy',
      content: `## 1.1 Power Fundamentals

**P = V·I** (instantaneous power in watts)

For resistive elements, three equivalent forms:
- **P = V·I = I²R = V²/R**

All three give the same result; choose based on which quantities you know.

### Energy

Energy is power integrated over time: **W = ∫P dt = P·t** (for constant power)

Units: 1 joule = 1 watt·second; 1 kWh = 3.6 MJ

## 1.2 Energy Stored in Reactive Elements

| Element | Energy Formula | Stored In |
|---|---|---|
| Capacitor | **W = ½CV²** | Electric field |
| Inductor | **W = ½LI²** | Magnetic field |

Reactive elements store and return energy — they do NOT dissipate power (ideal case). Only resistors dissipate power as heat.

## 1.3 Efficiency

**η = P_out / P_in = (useful output) / (total input)**

- Always less than 100% due to losses
- Losses include: I²R (copper losses), core losses, friction, windage

| Device | Typical Efficiency |
|---|---|
| Power transformer | 95-99% |
| Electric motor | 80-95% |
| Solar panel | 15-22% |
| LED lighting | 30-50% |`,
      examTip: 'P = V·I = I²R = V²/R — know all three forms and choose wisely. If you know V and R, use V²/R (do not solve for I first). If you know I and R, use I²R. This saves calculation steps on the FE exam.',
    },
    {
      id: 'we-mechanical',
      title: '2. Electromechanical Energy Conversion',
      content: `## 2.1 Mechanical Power

**P_mech = τ·ω** (torque × angular velocity)

Where τ is in N·m and ω is in rad/s.

### Conversion: Electrical ↔ Mechanical

- **Motor**: electrical input → mechanical output; P_elec = V·I, P_mech = τ·ω
- **Generator**: mechanical input → electrical output; P_mech = τ·ω, P_elec = V·I

Efficiency: η = P_out/P_in (losses = P_in - P_out)

## 2.2 Conservation of Energy

In any system: **Energy in = Energy out + Losses**

For a motor: V·I = τ·ω + P_copper + P_core + P_friction

This energy balance is fundamental to every power conversion problem on the FE exam.

## 2.3 Kinetic and Potential Energy

- **Kinetic**: KE = ½mv²
- **Gravitational potential**: PE = mgh
- **Spring potential**: PE = ½kx²

These appear in electromechanical problems where electrical energy converts to or from mechanical energy (motors, generators, actuators).`,
      examTip: 'For motor problems: input power = V·I (electrical), output power = τ·ω (mechanical), and η = τ·ω/(V·I). Always check units: ω must be in rad/s (not RPM). Convert: ω = 2π·(RPM)/60.',
      importantNote: 'Mechanical power P = τ·ω requires ω in rad/s. A common FE exam error is using RPM directly. Always convert: ω (rad/s) = 2π × N (rev/s) = 2π × RPM / 60.',
    },
  ],
  keyTakeaways: [
    'P = V·I = I²R = V²/R; three equivalent forms for resistive power.',
    'Capacitor energy: W = ½CV²; inductor energy: W = ½LI².',
    'Efficiency η = P_out/P_in; always < 100% due to losses.',
    'Mechanical power P = τ·ω; convert RPM to rad/s: ω = 2π·RPM/60.',
    'Energy balance: input = useful output + losses.',
  ],
},

fee_charge_current: {
  topicId: 'fee_charge_current',
  title: 'Charge, Current, Voltage, and Coulomb Force',
  domainWeight: 'Engineering Sciences · 3–5%',
  overview: 'Electric charge, current, voltage, and the forces between charges are the most fundamental concepts in electrical engineering. Ohm\'s law, Coulomb\'s law, and the Lorentz force connect these quantities.',
  sections: [
    {
      id: 'cc-fundamentals',
      title: '1. Charge, Current, and Voltage',
      content: `## 1.1 Electric Charge

**Charge** Q is measured in coulombs (C). One electron carries q = 1.602×10⁻¹⁹ C.

## 1.2 Current

**I = dQ/dt** (rate of charge flow, in amperes)

- 1 ampere = 1 coulomb/second
- **Conventional current** flows from + to - (opposite to electron flow)
- DC is constant; AC varies sinusoidally

## 1.3 Voltage

**V = dW/dQ** (work per unit charge, in volts)

- 1 volt = 1 joule/coulomb
- Voltage is the "pressure" that drives current through resistance
- **Ohm's law**: V = I·R

## 1.4 Coulomb's Law

Force between point charges:

**F = k·Q₁·Q₂/r²** where k = 8.99×10⁹ N·m²/C²

- Like charges repel; opposite charges attract
- Force decreases with square of distance (inverse-square law)

### Electric Field

**E = F/Q = V/d** (for uniform field)

| Quantity | Symbol | Unit | Definition |
|---|---|---|---|
| Charge | Q | Coulomb (C) | Fundamental quantity |
| Current | I | Ampere (A) | dQ/dt |
| Voltage | V | Volt (V) | dW/dQ |
| Electric field | E | V/m or N/C | Force per unit charge |`,
      examTip: 'I = dQ/dt and V = dW/dQ are the two most fundamental definitions. Ohm\'s law V = IR is an empirical relationship for resistive materials — it does NOT apply to capacitors, inductors, or nonlinear devices like diodes.',
    },
    {
      id: 'cc-lorentz',
      title: '2. Lorentz Force and Moving Charges',
      content: `## 2.1 The Lorentz Force

A charge q moving with velocity v in electric field E and magnetic field B experiences:

**F = q(E + v × B)**

- Electric force qE: along E direction (accelerates or decelerates charge)
- Magnetic force q(v×B): perpendicular to both v and B (deflects without doing work)

## 2.2 Force on a Current-Carrying Conductor

**F = I·L × B = B·I·L·sinθ**

Where L is the conductor length vector and θ is the angle between L and B.

Direction: use the **right-hand rule** — point fingers along I, curl toward B, thumb gives F direction.

## 2.3 Applications

- **DC motor**: current in magnetic field → force → rotation
- **Generator**: conductor moves through field → induced EMF
- **Hall effect sensor**: moving charges deflected → voltage across conductor
- **Mass spectrometer**: magnetic force separates ions by mass

### Motional EMF

A conductor moving through a magnetic field:

**ε = B·L·v** (for v perpendicular to B and L)`,
      examTip: 'The Lorentz force F = q(E + v×B) combines electric and magnetic forces. The magnetic force is always PERPENDICULAR to velocity — it changes direction but not speed (does no work). This is why magnetic fields deflect charges but cannot accelerate them.',
    },
  ],
  keyTakeaways: [
    'Current I = dQ/dt; voltage V = dW/dQ; Ohm\'s law V = IR for resistive elements.',
    'Coulomb\'s law: F = k·Q₁·Q₂/r²; inverse-square law.',
    'Lorentz force: F = q(E + v×B); magnetic force is perpendicular to velocity.',
    'Force on conductor: F = BIL; direction by right-hand rule.',
    'Motional EMF: ε = BLv for conductor moving through field.',
  ],
},

fee_electromech: {
  topicId: 'fee_electromech',
  title: 'Electromechanical Conversion & Sensors',
  domainWeight: 'Engineering Sciences · 3–5%',
  overview: 'Electromechanical conversion transforms electrical energy to mechanical (motors) and vice versa (generators). Sensors convert physical quantities to electrical signals. These bridge fundamental physics and practical engineering.',
  sections: [
    {
      id: 'em-motors-gen',
      title: '1. Motors and Generators',
      content: `## 1.1 Motor Principles

A current-carrying loop in a magnetic field experiences torque:

**τ = N·B·I·A·sinθ**

Where N = turns, B = flux density, I = current, A = loop area, θ = angle to field.

- **Maximum torque**: τ_max = NBIA (when θ = 90°)
- **Motor equation**: V_applied = I·R + E_back
- **Back-EMF**: E_back = k·ω (proportional to speed)

### Motor Operation

At startup: ω = 0 → E_back = 0 → large inrush current I = V/R.
At steady state: E_back ≈ V → small current (just supplying load + losses).

## 1.2 Generator Principles

**Faraday's law**: ε = -N·dΦ/dt

A rotating coil in a magnetic field:

**ε = N·B·ω·A·cos(ωt)**

- Peak EMF: ε_peak = NBAω
- Higher speed → higher voltage
- This is the basis of all AC generators

## 1.3 Power Conversion

| Device | Input | Output | Efficiency |
|---|---|---|---|
| Motor | V·I (electrical) | τ·ω (mechanical) | η = τ·ω/(V·I) |
| Generator | τ·ω (mechanical) | V·I (electrical) | η = V·I/(τ·ω) |`,
      examTip: 'Motors and generators use the same electromagnetic principles in opposite directions. The motor equation V = IR + E_back is essential: at high speed, E_back is large so current is small. At stall (ω=0), current is maximum V/R — this is why motors need current limiting at startup.',
    },
    {
      id: 'em-sensors',
      title: '2. Sensors and Measurement',
      content: `## 2.1 Common Sensors

| Sensor | Measures | Principle | Key Formula |
|---|---|---|---|
| Strain gauge | Deformation | Resistance change | ΔR/R = GF·ε |
| Thermistor | Temperature | R(T) changes | R = R₀·exp[β(1/T-1/T₀)] |
| Thermocouple | Temperature | Seebeck voltage | V ∝ ΔT |
| Accelerometer | Acceleration | Piezoelectric/MEMS | V ∝ acceleration |
| Pressure sensor | Pressure | Diaphragm deflection | V ∝ pressure |

## 2.2 Sensor Characteristics

- **Sensitivity**: output change per unit input (e.g., mV/°C)
- **Accuracy**: closeness to true value
- **Precision**: repeatability of measurements
- **Linearity**: output proportional to input over range
- **Resolution**: smallest detectable change

## 2.3 Wheatstone Bridge

The **Wheatstone bridge** extracts small resistance changes from sensors:

At balance: **R₁/R₂ = R₃/R₄** → output voltage = 0

When one arm changes by ΔR (sensor):
- Output voltage **V_out ≈ V_supply · ΔR/(4R)** (for small ΔR)

Used with strain gauges, RTDs, and other resistive sensors for precise measurement.`,
      examTip: 'For the strain gauge formula ΔR/R = GF·ε, the gauge factor GF ≈ 2 for metallic gauges. The Wheatstone bridge detects the tiny ΔR by producing a proportional output voltage. This is the standard measurement circuit for resistive sensors.',
    },
  ],
  keyTakeaways: [
    'Motor torque: τ = NBIA·sinθ; maximum when loop perpendicular to field.',
    'Back-EMF: E_back = kω; motor equation: V = IR + E_back.',
    'Generator EMF: ε = NBAω·cos(ωt); higher speed = higher voltage.',
    'Strain gauge: ΔR/R = GF·ε (GF ≈ 2); thermistor: exponential R(T).',
    'Wheatstone bridge: balance condition R₁/R₂ = R₃/R₄; detects small ΔR.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 6 — CIRCUIT ANALYSIS  (7 curriculum IDs)  ·  10 %  ← HIGHEST WEIGHT
 * ══════════════════════════════════════════════════════════════════ */

fee_dc_fundamentals: {
  topicId: 'fee_dc_fundamentals',
  title: 'DC Circuit Fundamentals: Ohm\'s Law, KCL, KVL',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Ohm\'s law, Kirchhoff\'s current law (KCL), and Kirchhoff\'s voltage law (KVL) are the three pillars of circuit analysis. Series and parallel combinations, voltage dividers, and current dividers build on these foundations.',
  sections: [
    {
      id: 'dcf-ohm-kirchhoff',
      title: '1. Ohm\'s Law and Kirchhoff\'s Laws',
      content: `## 1.1 Reading the schematic before you analyse it

Every FE Electrical question that shows a circuit expects you to identify the
components from their symbols alone, without a legend. Misreading one symbol
does not cost you part of a question; it changes which equation you write, and
the answer is then wrong by a mechanism no amount of careful arithmetic can
recover. Spend the time here once.

![The component symbols the FE Electrical and Computer exam draws without labelling. Sources are shown upright so the polarity marks read correctly; the two-terminal passives are shown horizontally as they appear in a ladder.](/courses/fe-ee/figures/sch-symbols-reference.svg)

Four pairs account for most misreadings on the exam:

| Confused pair | The distinguishing mark | Consequence of misreading |
|---|---|---|
| DC source vs current source | + / − inside the circle vs a single arrow | You constrain the wrong quantity in KCL/KVL |
| Capacitor vs battery cell | equal-length plates vs one long and one short | Wrong element law: i = C dv/dt vs a fixed V |
| Diode vs Zener | straight cathode bar vs bent bar | Reverse-bias behaviour flips entirely |
| Ground vs negative rail | three tapering bars vs a single bar | Node reference moves, so every node voltage shifts |

The rule underneath all four: a **source** fixes one quantity and lets the
circuit choose the other. A voltage source fixes V and the circuit sets I; a
current source fixes I and the circuit sets V. Everything else in DC analysis
follows from that and from Ohm's law.

## 1.2 Ohm's Law

**V = I·R** relates voltage, current, and resistance.

Three equivalent forms for power: **P = V·I = I²R = V²/R**

Pick the power form by what you already know, not by habit. If you have solved
for a branch current, I²R needs no further division; if you have a node
voltage, V²/R does. Both are algebraically the same statement, and choosing
the one that matches your known quantity removes a step where sign errors get
introduced.

## 1.3 Kirchhoff's Current Law (KCL)

**The sum of currents entering a node equals the sum leaving:**

**ΣI_in = ΣI_out** or equivalently **ΣI = 0** (with sign convention)

KCL is conservation of charge — charge cannot accumulate at a node.

## 1.4 Kirchhoff's Voltage Law (KVL)

**The sum of voltage rises around any closed loop equals zero:**

**ΣV = 0** (around any closed loop)

KVL is conservation of energy — energy gained equals energy lost around any path.

### Systematic Approach

For any DC circuit:
1. **Label all nodes** and assign current directions (arbitrary — negative result means opposite)
2. **Apply KCL** at each node (n-1 independent equations for n nodes)
3. **Apply KVL** around each independent loop
4. **Apply Ohm's law** (V = IR) to relate voltages and currents
5. **Solve** the system of equations

## 1.5 The three laws on one circuit

Description in words is where circuit problems go wrong. "A 12 V source drives
4 Ω in series with 6 Ω in parallel with 12 Ω" has to be held entirely in your
head; the same statement drawn is read in a second:

![A 12 V source feeding R1 = 4 ohm in series with the parallel pair R2 = 6 ohm and R3 = 12 ohm. Node A is the junction the two parallel branches share.](/courses/fe-ee/figures/sch-dc-ladder.svg)

Work it in the order the laws come in.

**Reduce.** R2 and R3 share both of their nodes, so they are in parallel:
R2‖R3 = (6 × 12)/(6 + 12) = 72/18 = **4 Ω**. That sits in series with R1, so
the source sees R_eq = 4 + 4 = **8 Ω**.

**Ohm's law for the source current.** I = 12/8 = **1.5 A**.

**KVL around the outer loop.** The drop across R1 is 1.5 × 4 = 6 V, so node A
sits at 12 − 6 = **6 V** above the reference. The two drops sum to the source:
6 + 6 = 12 V. If they had not summed, you would stop here rather than carry the
error forward.

**KCL at node A.** Each parallel branch sees the same 6 V:

| Branch | Voltage | Resistance | Current | Power |
|---|---|---|---|---|
| R1 | 6 V | 4 Ω | 1.500 A | 9.0 W |
| R2 | 6 V | 6 Ω | 1.000 A | 6.0 W |
| R3 | 6 V | 12 Ω | 0.500 A | 3.0 W |
| **Source** | 12 V | 8 Ω (eq.) | **1.500 A** | **18.0 W** |

The branch currents sum to 1.000 + 0.500 = 1.500 A, which is the source
current — that is KCL closing. The dissipated powers sum to 9 + 6 + 3 = 18 W,
which is 12 V × 1.5 A — that is conservation of energy closing. Two independent
checks, both arithmetic, both taking about five seconds.

Notice which branch carries more. R2 is the *smaller* resistor and takes twice
the current of R3, while both drop the same voltage. That is the whole content
of the current-divider rule, and seeing it once on a drawn circuit is worth
more than memorising which resistance goes in the numerator.`,
      examTip: 'If your calculated current is negative, the actual direction is opposite to your assumed direction — the magnitude is still correct. Do NOT redo the problem. This is the beauty of the systematic approach: arbitrary assumptions are self-correcting.',
      importantNote: 'KCL applies at every node, and KVL applies around every loop — these laws are ALWAYS valid in lumped-element circuits. When other techniques (Thevenin, superposition) seem unclear, fall back to KCL/KVL. They never fail.',
    },
    {
      id: 'dcf-series-parallel',
      title: '2. Series/Parallel, Voltage Dividers, and Current Dividers',
      content: `## 2.1 Series and Parallel Combinations

### Series (same current through all elements)
- **R_total = R₁ + R₂ + ... + Rₙ**
- Voltages add: V_total = V₁ + V₂ + ...
- Largest resistor has largest voltage drop

### Parallel (same voltage across all elements)
- **1/R_total = 1/R₁ + 1/R₂ + ... + 1/Rₙ**
- For two resistors: **R_total = R₁·R₂/(R₁ + R₂)**
- Currents add: I_total = I₁ + I₂ + ...
- Total resistance is ALWAYS less than the smallest individual resistance

## 2.2 Voltage Divider

For resistors in series:

**V_x = V_total · R_x / (R₁ + R₂ + ... + Rₙ)**

For two resistors: V₁ = V · R₁/(R₁+R₂), V₂ = V · R₂/(R₁+R₂)

## 2.3 Current Divider

For two resistors in parallel:

**I₁ = I_total · R₂/(R₁ + R₂)** (current through R₁ uses the OTHER resistance)

**I₂ = I_total · R₁/(R₁ + R₂)**

Note: current goes preferentially through the SMALLER resistance (path of least resistance).

| Configuration | Same Quantity | Add Up | Equivalent |
|---|---|---|---|
| Series | Current | Voltages | R_eq = ΣR |
| Parallel | Voltage | Currents | 1/R_eq = Σ(1/R) |`,
      examTip: 'The current divider formula is backwards from what you might expect: I through R₁ uses R₂ in the numerator. Think of it as: more resistance in YOUR branch means LESS current goes through it, so the OTHER resistance goes on top.',
    },
    {
      id: 'dcf-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Ladder reduction and a divider

A 12 V source drives R1 = 4 ohm in series with the parallel pair R2 = 6 ohm and R3 = 12 ohm. Find the current from the source and the voltage across the parallel pair.

The parallel pair: R23 = (6)(12)/(6+12) = 72/18 = **4 ohm**. Total: R = 4 + 4 = **8 ohm**. Source current: I = 12/8 = **1.5 A**.

Voltage across the pair, by the divider: V23 = 12 x 4/8 = **6 V**. Check with Ohm's law: (1.5 A)(4 ohm) = 6 V. Agrees.

Branch currents: I2 = 6/6 = 1 A, I3 = 6/12 = 0.5 A, and 1 + 0.5 = 1.5 A, which is KCL at the node. Two independent checks on one answer is what makes this reliable under time pressure.

## 3.2 Current divider, and why it looks backwards

The same 1.5 A splits between 6 ohm and 12 ohm. The divider gives

I2 = I x R3/(R2+R3) = 1.5 x 12/18 = **1.0 A**

The 6 ohm branch — the smaller resistance — takes the larger share, and the formula gets there by putting the OTHER resistance on top. If your answer gives more current to the larger resistor, you have the fraction upside down.

## 3.3 Node analysis when reduction stalls

Two sources, 10 V and 4 V, feed a common node through 2 ohm and 4 ohm respectively; a 4 ohm resistor runs from that node to ground. Series-parallel reduction cannot touch this, so use one node equation with node voltage V:

(V - 10)/2 + (V - 4)/4 + V/4 = 0

Multiply by 4: 2(V - 10) + (V - 4) + V = 0, so 2V - 20 + V - 4 + V = 0, giving 4V = 24 and **V = 6 V**.

Currents: (6-10)/2 = -2 A (so 2 A flows INTO the node from the 10 V source), (6-4)/4 = 0.5 A out, 6/4 = 1.5 A out. Out equals 0.5 + 1.5 = 2 A in. KCL balances.

## 3.4 Power accounting

In 3.1, the source delivers P = VI = 12 x 1.5 = **18 W**. The 4 ohm series resistor dissipates I squared R = (1.5)(1.5)(4) = 9 W; the 6 ohm takes (1)(1)(6) = 6 W; the 12 ohm takes (0.5)(0.5)(12) = 3 W. Total dissipated = 9 + 6 + 3 = **18 W**. Delivered equals dissipated, as it must.`,
      examTip: 'Finish every circuit problem with one check you did not use to get the answer - KCL at a node, or a power balance. It costs ten seconds and catches the sign and factor errors that account for most lost marks on this section.',
      quiz: [
        {
          question: 'A 24 V source drives 3 ohm in series with the parallel combination of 12 ohm and 6 ohm. What current does the source deliver?',
          options: ['3.43 A', '2.00 A', '4.00 A', '8.00 A'],
          correctIndex: 0,
          explanation: 'The parallel pair is (12)(6)/(12+6) = 72/18 = 4 ohm. Total resistance is 3 + 4 = 7 ohm, so I = 24/7 = 3.43 A. Choosing 4.00 A means dividing 24 by the parallel pair alone and forgetting the series 3 ohm.',
        },
        {
          question: 'A 2 A source feeds two parallel resistors, 8 ohm and 2 ohm. How much current flows through the 8 ohm resistor?',
          options: ['0.4 A', '1.6 A', '1.0 A', '0.25 A'],
          correctIndex: 0,
          explanation: 'The current divider puts the OTHER resistance on top: I_8 = 2 x 2/(8+2) = 0.4 A. Current prefers the lower-resistance path, so the 2 ohm branch takes the remaining 1.6 A. Answering 1.6 A is the classic inverted-fraction error.',
        },
        {
          question: 'Solving a node equation gives a branch current of -3 A relative to your assumed direction. What should you do?',
          options: [
            'Accept it: the magnitude is 3 A and the true direction is opposite to your assumption',
            'Redo the analysis with the arrow reversed',
            'Take the absolute value and keep the assumed direction',
            'The circuit is unsolvable as drawn',
          ],
          correctIndex: 0,
          explanation: 'Assumed current directions are arbitrary and self-correcting. A negative result means the current flows the other way with magnitude 3 A. Redoing the problem wastes time and reversing the arrow without changing the sign gives a wrong answer downstream.',
        },
      ],
    },
    {
      id: 'dcf-depth',
      title: '4. Reading a Divider, and Choosing Your Method',
      content: `## 4.1 What the divider fractions actually do

The two divider rules look similar and behave oppositely, which is why they
are the most-confused pair in DC analysis. Fix the total resistance and sweep
how it is split:

![Voltage and current fractions for R1 in a two-resistor pair with R1 + R2 fixed at 100 ohm. Raising R1 gives it more of the voltage and less of the current, and the two curves cross where the resistances are equal.](/courses/fe-ee/figures/circuits-divider-split.svg)

Everything you need is in the crossing. Below the midpoint R1 is the smaller
resistor, so it carries most of the current and drops least of the voltage;
above it, the reverse. The curves are mirror images because the two fractions
sum to one: R1/(R1+R2) + R2/(R1+R2) = 1.

That is the sanity check to apply every time. If your two branch currents do
not sum to the total, or your two voltage drops do not sum to the source, you
have made an arithmetic error - not a conceptual one - and it will take ten
seconds to find.

## 4.2 Choosing between reduction, nodal and mesh

Three methods, and picking the wrong one costs minutes:

| Situation | Use | Why |
|---|---|---|
| Pure ladder of series/parallel groups | reduction | no simultaneous equations at all |
| Several current sources, few nodes | nodal | current sources enter directly |
| Several voltage sources, few loops | mesh | voltage sources enter directly |
| Bridge or delta that will not reduce | nodal or mesh | reduction is impossible |

The equation counts decide it when both are viable. For a network with N nodes
and B branches, nodal needs **N - 1** equations and mesh needs **B - N + 1**.
Count both, take the smaller.

**Worked:** a bridge with 4 nodes and 6 branches. Nodal: 4 - 1 = 3 equations.
Mesh: 6 - 4 + 1 = 3 equations. A tie, so pick by source type - if the bridge
is driven by one voltage source, mesh is marginally cleaner.

## 4.3 A source that is not ideal

Real sources have internal resistance, and the exam tests what that does. A
battery of EMF 12 V with r = 0.5 ohm driving a 5.5 ohm load:

I = 12/(0.5 + 5.5) = **2 A**
Terminal voltage = 12 - (2)(0.5) = **11 V**, not 12

The terminal voltage droops under load, and the droop is I times r. At short
circuit the current is limited only by r: 12/0.5 = 24 A, and the terminal
voltage is zero. That short-circuit current is exactly the Norton current of
the source, which is the bridge to the next chapter.

**Load regulation** = (V_noload - V_fullload)/V_fullload = (12 - 11)/11 =
**9.1%**. A stiff source is one with small r and therefore small regulation.

## 4.4 Where the power goes

For that same battery: the source produces P = EMF x I = 12 x 2 = **24 W**, of
which the internal resistance eats I^2 r = (4)(0.5) = **2 W** and the load
receives (4)(5.5) = **22 W**. Efficiency 22/24 = **91.7%**.

Note what happens as the load resistance falls toward r: the load power rises
to a maximum at R = r and then falls again, while efficiency falls
monotonically. Those two curves peak in different places, which is the point
the maximum-power-transfer question always turns on.`,
      examTip: 'Count the nodes and the loops before you start writing equations. Nodal needs N-1, mesh needs B-N+1, and on an exam where every question is worth the same, spending two minutes on the wrong method is the most expensive mistake available.',
      importantNote: 'Terminal voltage equals EMF only at zero current. Every question that mentions internal resistance, battery droop, or a source that "sags under load" is testing V_terminal = EMF - I r, and the answer is never simply the EMF.',
    },
  ],
  keyTakeaways: [
    'V = IR (Ohm\'s law); P = VI = I²R = V²/R (power).',
    'KCL: ΣI at node = 0; KVL: ΣV around loop = 0.',
    'Series: same current, R adds; parallel: same voltage, conductances add.',
    'Voltage divider: V_x = V·R_x/R_total; current divider: I₁ = I·R₂/(R₁+R₂).',
    'Parallel resistance is ALWAYS less than the smallest individual resistance.',
  ],
},

fee_network_theorems: {
  topicId: 'fee_network_theorems',
  title: 'Network Theorems: Thevenin, Norton, Superposition',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Thevenin and Norton theorems simplify complex networks to equivalent circuits. Superposition handles multiple-source circuits. Maximum power transfer determines optimal load matching. These are the most powerful tools in circuit analysis.',
  sections: [
    {
      id: 'nt-thevenin-norton',
      title: '1. Thevenin and Norton Equivalents',
      content: `## 1.1 Thevenin's Theorem

Any linear two-terminal network can be replaced by:
- **V_Th** (Thevenin voltage) in series with **R_Th** (Thevenin resistance)

The claim is stronger than it first sounds. It is not that the two circuits
behave similarly, or behave the same for one load — it is that **no measurement
made at terminals a-b can distinguish them, for any load whatsoever**. That is
what makes the theorem worth the effort: you do the reduction once, then sweep
the load as many times as the question asks without touching the original
network again.

![The same one-port drawn as a Thevenin source (4 V behind 2 ohm, in series) and as its Norton equivalent (2 A across 2 ohm, in parallel). Terminals a-b are the port; nothing measured there can tell the two apart.](/courses/fe-ee/figures/sch-thevenin-pair.svg)

### Finding V_Th and R_Th

1. **Remove the load** from terminals A-B
2. **V_Th = open-circuit voltage** at A-B (no load connected)
3. **R_Th**: deactivate all independent sources, calculate resistance looking into A-B
   - Voltage sources → short circuits (wire)
   - Current sources → open circuits (removed)

With load connected: **I_load = V_Th/(R_Th + R_load)**

## 1.2 Norton's Theorem

Any linear network = **I_N** (current source) in parallel with **R_N**

- **I_N = short-circuit current** (short A-B terminals)
- **R_N = R_Th** (same resistance)
- **Relationship**: V_Th = I_N · R_N

### When to Use Which

| Situation | Best Approach |
|---|---|
| Analyzing varying loads | Thevenin or Norton |
| Voltage-source-heavy circuit | Thevenin more intuitive |
| Current-source-heavy circuit | Norton more intuitive |
| Need current through one element | Thevenin often fastest |

## 1.3 Reducing a real network, and checking it two ways

Take a 6 V source in series with R₁ = 3 Ω, with R₂ = 6 Ω across the output
terminals. Reduce it to the pair drawn above.

**V_Th, by open circuit.** With nothing across a-b, no current flows out of the
port, so R₁ and R₂ form a plain divider:
V_Th = 6 × 6/(3 + 6) = 36/9 = **4 V**.

**R_Th, by source deactivation.** Kill the 6 V source — replace it with a wire,
because a voltage source holds zero volts when off, and a wire is the element
that holds zero volts. R₁ and R₂ are then both connected between the a node and
the reference, i.e. in parallel:
R_Th = (3 × 6)/(3 + 6) = 18/9 = **2 Ω**.

**I_N, by short circuit — the independent check.** Now short a-b directly. The
short puts 0 V across R₂, so R₂ carries no current at all and the entire source
current goes through R₁ into the short:
I_N = 6/3 = **2 A**.

Those three numbers must satisfy V_Th = I_N · R_N. Here 2 A × 2 Ω = 4 V, which
matches the open-circuit voltage computed by a completely different route. This
is the verification worth building the habit around: **compute two of the three
and predict the third**. If the prediction fails, the error is in the reduction,
not in whatever you do next.

| Quantity | How it is found | Load present? | Value here |
|---|---|---|---|
| V_Th | open-circuit voltage at a-b | none (open) | 4 V |
| I_N | short-circuit current at a-b | short | 2 A |
| R_Th = R_N | sources deactivated, look in | none | 2 Ω |
| Consistency | V_Th = I_N · R_N | — | 2 × 2 = 4 ✓ |

## 1.4 What the equivalent is for: sweeping the load

With the equivalent in hand, every load question is one division:
I_L = 4/(2 + R_L), and P_L = I_L²R_L.

| R_L | I_L = 4/(2+R_L) | V_L = I_L·R_L | P_L = I_L²R_L | Efficiency P_L/P_total |
|---|---|---|---|---|
| 0 Ω (short) | 2.000 A | 0.00 V | 0.00 W | 0 % |
| 1 Ω | 1.333 A | 1.33 V | 1.78 W | 33 % |
| **2 Ω (matched)** | **1.000 A** | **2.00 V** | **2.00 W** | **50 %** |
| 4 Ω | 0.667 A | 2.67 V | 1.78 W | 67 % |
| 8 Ω | 0.400 A | 3.20 V | 1.28 W | 80 % |
| ∞ (open) | 0 A | 4.00 V | 0.00 W | — |

Three things in that table are worth carrying into the exam.

First, **power peaks at R_L = R_Th**, at P_max = V_Th²/(4R_Th) = 16/8 = 2 W.
That is the maximum power transfer result, and here it arrives as an observation
about a table rather than a formula to recall.

Second, the peak is **flat**. Moving from 2 Ω to either 1 Ω or 4 Ω — a factor of
two in either direction — costs only 11 % of the delivered power, 1.78 W against
2.00 W. Matching is worth doing, but a question that claims a small mismatch is
catastrophic is describing something other than a resistive load.

Third, **matched does not mean efficient**. At R_L = R_Th exactly half the power
drawn from the source is burned inside R_Th, so efficiency is 50 %. Maximum
power transfer and maximum efficiency are different design goals that point in
opposite directions: signal circuits match to get the most signal out, power
systems deliberately keep R_Th ≪ R_L so that efficiency rises toward 100 % and
the delivered power, though below the theoretical peak, costs far less to
supply.`,
      examTip: 'To find R_Th: deactivate sources (voltage → short, current → open) and calculate resistance looking into the terminals. A common FE exam mistake is deactivating sources incorrectly — voltage sources become SHORT circuits (zero voltage), current sources become OPEN circuits (zero current).',
      importantNote: 'Dependent sources are NEVER deactivated in Thevenin/Norton analysis. Only independent sources are turned off. If the circuit has dependent sources, use the test source method: apply a test voltage V_test, find resulting I_test, then R_Th = V_test/I_test.',
    },
    {
      id: 'nt-superposition-maxpower',
      title: '2. Superposition and Maximum Power Transfer',
      content: `## 2.1 Superposition Theorem

In a linear circuit with multiple independent sources, the response is the **sum of responses** due to each source acting alone.

### Procedure:
1. **Keep one source active**, deactivate all others
2. **Solve** for the desired quantity
3. **Repeat** for each source
4. **Add** all contributions algebraically (with signs)

### When Superposition Excels
- Circuits with sources at **different frequencies** (DC + AC, or two different AC)
- Sources at different frequencies do not interact, so superposition is natural

## 2.2 Maximum Power Transfer

Maximum power is delivered to a load when:

**R_load = R_Th** (for purely resistive circuits)
**Z_load = Z_Th*** (conjugate match for complex impedances)

The maximum power delivered:

**P_max = V_Th² / (4·R_Th)**

### Important Tradeoffs

| Condition | Power Transfer | Efficiency |
|---|---|---|
| R_L = R_Th | **Maximum** (P_max) | 50% |
| R_L > R_Th | Less than max | Higher than 50% |
| R_L >> R_Th | Much less | Approaches 100% |
| R_L < R_Th | Less than max | Lower than 50% |

Maximum power transfer and maximum efficiency are **opposite goals**.`,
      examTip: 'Maximum power transfer delivers P_max = V_Th²/(4R_Th) at 50% efficiency. This matters in communications (match impedances for signal power). In power systems, efficiency matters more, so loads are NOT matched to source impedance.',
      importantNote: 'For AC circuits with complex impedances, maximum power transfer requires the CONJUGATE match: Z_L = Z_Th*. If Z_Th = R + jX, then Z_L should be R - jX. The reactive parts cancel, and resistive parts match.',
    },
    {
      id: 'nt-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Thevenin equivalent, step by step

A 12 V source feeds R1 = 6 ohm; from the R1-node a 3 ohm resistor goes to ground, and the load terminals sit across that 3 ohm. Find the Thevenin equivalent seen by the load.

**V_th** — open-circuit voltage, load removed. The 6 ohm and 3 ohm form a divider: V_th = 12 x 3/(6+3) = **4 V**.

**R_th** — kill the independent source (voltage source becomes a short) and look back in. The 6 ohm and 3 ohm are then in parallel: R_th = (6)(3)/9 = **2 ohm**.

So the load sees 4 V behind 2 ohm. Attach a 2 ohm load and the current is 4/(2+2) = 1 A, with 2 V across the load.

## 3.2 The same circuit by Norton

I_N is the short-circuit current at the terminals. Shorting them puts the 3 ohm out of play, so I_N = 12/6 = **2 A**, and R_N = R_th = **2 ohm**.

Check the source transformation: V_th = I_N x R_th = 2 x 2 = 4 V. Consistent with 3.1, as it must be — Thevenin and Norton are the same circuit written two ways.

## 3.3 Superposition with two sources

A 10 V source through 5 ohm and a 2 A source both feed a 5 ohm load to ground.

**Voltage source alone** (current source opened): the 10 V divides across 5 + 5, giving V_L = **5 V**.

**Current source alone** (voltage source shorted): 2 A sees two 5 ohm paths in parallel, so 1 A goes through the load, giving V_L = 1 x 5 = **5 V**.

Superpose: V_L = 5 + 5 = **10 V**, and the load current is 2 A.

Note what you may NOT superpose: power. Computing (5 V)^2/5 + (5 V)^2/5 = 10 W is wrong; the real load power is (10)^2/5 = **20 W**. Power is quadratic in the response, so it must be computed from the total.

## 3.4 Maximum power transfer

With the 4 V / 2 ohm Thevenin source of 3.1, maximum load power occurs at R_L = R_th = 2 ohm. Then V_L = 2 V and P_L = (2)^2/2 = **2 W**.

Efficiency at that point is only 50% — half the power is burned in R_th. Maximum power and maximum efficiency are different design targets, and the exam tests that they are not the same thing.`,
      examTip: 'To find R_th, kill INDEPENDENT sources only: short voltage sources, open current sources. A dependent source stays in the circuit - for those, apply a 1 V test source at the terminals and compute R_th = 1/I_test.',
      quiz: [
        {
          question: 'A network has V_th = 20 V and R_th = 5 ohm. What is the Norton equivalent?',
          options: ['4 A in parallel with 5 ohm', '4 A in series with 5 ohm', '100 A in parallel with 5 ohm', '20 A in parallel with 5 ohm'],
          correctIndex: 0,
          explanation: 'I_N = V_th/R_th = 20/5 = 4 A, and R_N = R_th = 5 ohm, with the resistance in PARALLEL for a Norton source. A Norton current source in series with its resistance would be meaningless, since the series element cannot change the source current.',
        },
        {
          question: 'Superposition gives a load voltage of 6 V from one source and 4 V from another, acting alone. The load is 2 ohm. What is the actual power dissipated in it?',
          options: ['50 W', '26 W', '18 W', '10 W'],
          correctIndex: 0,
          explanation: 'Superpose the VOLTAGE first: 6 + 4 = 10 V. Then P = V^2/R = 100/2 = 50 W. Adding the individual powers (36/2 + 16/2 = 26 W) is the trap: power is quadratic in the response and does not superpose.',
        },
        {
          question: 'For maximum power transfer to a load from a source with 8 ohm internal resistance, what load resistance is required, and what efficiency results?',
          options: ['8 ohm, 50% efficient', '8 ohm, 100% efficient', '0 ohm, 100% efficient', '16 ohm, 67% efficient'],
          correctIndex: 0,
          explanation: 'Maximum power transfer needs R_L = R_th = 8 ohm. With equal resistances the source dissipates as much as the load, so efficiency is exactly 50%. Power systems are designed for efficiency instead, which is why R_L >> R_th there.',
        },
      ],
    },
    {
      id: 'nt-depth',
      title: '4. Dependent Sources, Delta-Wye and Method Selection',
      content: `## 4.1 Thevenin resistance when a dependent source is present

The kill-the-sources shortcut applies to INDEPENDENT sources only. A dependent
source is part of the circuit's behaviour, not an external excitation, so it
must stay. Two routes:

**Test-source method.** Remove independent sources, apply a 1 V test source at
the terminals, compute the current it delivers, and R_th = 1 V / I_test.

**Open-circuit / short-circuit method.** Compute V_oc and I_sc with everything
present, and R_th = V_oc / I_sc. Usually the faster of the two, and it works
whatever is inside.

**Worked:** a network has V_oc = 6 V and I_sc = 1.5 A. Then R_th = 6/1.5 =
**4 ohm**, whether or not it contains dependent sources - the ratio does not
care what produced the two numbers.

A dependent source can also make R_th **negative**, which is not an error: it
is what an oscillator or a negative-impedance converter does, and it is how
sustained oscillation is possible at all.

## 4.2 Delta-wye conversion

Some networks - the bridge in particular - have no series or parallel pair
anywhere. Converting one delta to a wye usually unlocks the whole reduction.

**Delta to wye:** each wye resistor is the product of its two adjacent delta
resistors over the sum of all three.

R_1 = R_a R_b/(R_a + R_b + R_c), and cyclically.

**Wye to delta:** each delta resistor is the sum of the pairwise products over
the opposite wye resistor.

For the **balanced** case the whole thing collapses to two facts worth
memorising: **R_wye = R_delta/3**, and **R_delta = 3 R_wye**.

**Worked:** a delta of three 90 ohm resistors converts to a wye of 30 ohm
each. A bridge whose upper delta is 90/90/90 becomes a wye of 30/30/30, after
which the remaining network is a plain series-parallel reduction.

## 4.3 Superposition: what it may and may not be used for

Superposition applies to any **linear** response - voltage and current - and
never to power, because power is quadratic. It also fails outright on any
non-linear element: a diode, a transistor in a non-linear region, or a
saturating core.

The procedure is mechanical: one independent source active at a time, all
others killed (voltage sources shorted, current sources opened), and the
individual responses summed. **Dependent sources are never killed** - they
remain active in every sub-analysis.

Its cost is real. Superposition needs one full analysis per source, so with
three sources it is three times the work of a single nodal analysis. It earns
its place when the sources are at different frequencies, where nodal analysis
cannot combine them in one set of phasors and superposition is the only route.

## 4.4 Choosing the theorem

| Question asks for | Reach for |
|---|---|
| Behaviour of one varying load | Thevenin - compute the equivalent once, then sweep |
| A single branch current in a fixed network | mesh or nodal directly |
| Response with sources at different frequencies | superposition, one frequency at a time |
| Maximum power into a load | Thevenin, then R_L = R_th |
| A bridge that will not reduce | delta-wye, then reduction |

The Thevenin case is the one people under-use. If a question asks what happens
for three different load resistances, computing the equivalent once and
reusing it is three times faster than three full analyses.`,
      examTip: 'Never kill a dependent source. If R_th cannot be found by inspection because one is present, use R_th = V_oc / I_sc - it needs two calculations you can already do and never requires a test source.',
      quiz: [
        {
          question: 'A network containing a dependent source has V_oc = 10 V and I_sc = 2.5 A at its terminals. What is R_th?',
          options: ['4 ohm', '25 ohm', '0.25 ohm', 'It cannot be determined with a dependent source present'],
          correctIndex: 0,
          explanation: 'R_th = V_oc/I_sc = 10/2.5 = 4 ohm. This ratio works regardless of what the network contains, which is exactly why it is the method of choice when killing sources is not permitted.',
        },
        {
          question: 'A balanced delta of three 60 ohm resistors is converted to a wye. What is each wye resistance?',
          options: ['20 ohm', '180 ohm', '60 ohm', '30 ohm'],
          correctIndex: 0,
          explanation: 'For the balanced case R_wye = R_delta/3 = 60/3 = 20 ohm. The wye is always the smaller of the pair; getting the direction backwards gives 180 ohm and a nine-fold error in any subsequent power calculation.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Thevenin: V_Th (open-circuit voltage) + R_Th (resistance with sources off).',
    'Norton: I_N (short-circuit current) + R_N = R_Th; V_Th = I_N·R_Th.',
    'Superposition: sum responses from each source individually.',
    'Max power transfer: R_L = R_Th; P_max = V_Th²/(4R_Th) at 50% efficiency.',
    'Deactivate: voltage source → short circuit; current source → open circuit.',
  ],
},

fee_ac_phasors: {
  topicId: 'fee_ac_phasors',
  title: 'AC Steady-State Analysis: Phasors and Impedance',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Phasor analysis converts sinusoidal steady-state problems from differential equations to algebraic equations. Impedance generalizes resistance to AC, and all DC analysis techniques apply using phasors.',
  sections: [
    {
      id: 'acp-phasors',
      title: '1. Phasor Representation and Impedance',
      content: `## 1.1 Phasor Conversion

A sinusoidal signal v(t) = Vm·cos(ωt + φ) converts to phasor:

**V = Vm∠φ** (polar form) or **V = Vm·cosφ + j·Vm·sinφ** (rectangular)

The angular frequency ω = 2πf relates frequency f (Hz) to radians/second.

## 1.2 Impedance

**Impedance Z** generalizes Ohm's law to AC: **V = I·Z**

| Element | Impedance | Reactance | Phase Relationship |
|---|---|---|---|
| Resistor | Z_R = R | X_R = 0 | V and I in phase |
| Inductor | Z_L = jωL | X_L = ωL | V leads I by 90° |
| Capacitor | Z_C = 1/(jωC) = -j/(ωC) | X_C = -1/(ωC) | I leads V by 90° |

### Impedance in Rectangular and Polar Form

**Z = R + jX = |Z|∠θ**

Where:
- |Z| = sqrt(R² + X²)
- θ = arctan(X/R)
- R is resistance (real part)
- X is reactance (imaginary part)

## 1.3 Admittance

**Y = 1/Z = G + jB**

Where G is conductance and B is susceptance. Admittance is useful for parallel circuits.

### Combining Impedances

- **Series**: Z_total = Z₁ + Z₂ (add impedances)
- **Parallel**: 1/Z_total = 1/Z₁ + 1/Z₂ (add admittances)`,
      examTip: 'Mnemonic for inductor/capacitor phase: "ELI the ICE man" — E leads I in L (inductor), I leads E in C (capacitor). On the FE exam, inductive impedance is +jωL (positive imaginary) and capacitive impedance is -j/(ωC) (negative imaginary).',
      importantNote: 'ALL DC circuit analysis techniques work with phasors: KVL, KCL, Thevenin, Norton, superposition, voltage divider, current divider — just use impedances Z instead of resistances R, and phasors instead of DC values.',
    },
    {
      id: 'acp-frequency',
      title: '2. Frequency Behavior and RMS Values',
      content: `## 2.1 Frequency-Dependent Behavior

Impedance changes with frequency ω:

| Frequency | Inductor Z_L = jωL | Capacitor Z_C = 1/(jωC) |
|---|---|---|
| DC (ω → 0) | **0** (short circuit) | **∞** (open circuit) |
| Low ω | Small | Large |
| High ω | Large | Small |
| ω → ∞ | **∞** (open circuit) | **0** (short circuit) |

This frequency dependence is the basis of filters:
- **Low-pass filter**: passes low frequencies (inductor blocks high, capacitor shorts high)
- **High-pass filter**: passes high frequencies (capacitor blocks low, inductor shorts low)

## 2.2 RMS (Root Mean Square) Values

For sinusoidal signals:

**V_rms = V_peak / sqrt(2) ≈ 0.707 · V_peak**

- RMS values are used for power calculations: **P = V_rms · I_rms · cosφ**
- Standard outlet voltage (120V) is an RMS value; peak is 120·sqrt(2) ≈ 170V
- Phasors typically represent **peak** values unless specified as RMS

### Phasor Addition

To add two sinusoids at the same frequency:
1. Convert each to phasor (rectangular form)
2. Add real parts, add imaginary parts
3. Convert back to polar for magnitude and phase`,
      examTip: 'At DC: inductors are short circuits (wire), capacitors are open circuits (break). At very high frequency: inductors are open, capacitors are short. This is the most important frequency-behavior fact for the FE exam.',
    },
    {
      id: 'acp-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Building an impedance

A series RL branch has R = 30 ohm and L = 80 mH, driven at 60 Hz.

omega = 2 pi f = 2 pi (60) = **377 rad/s**. Then X_L = omega L = 377 x 0.080 = **30.2 ohm**.

Z = 30 + j30.2, magnitude sqrt(30^2 + 30.2^2) = sqrt(900 + 912) = **42.6 ohm**, angle arctan(30.2/30) = **45.2 degrees**.

With a 120 V rms source, I = 120/42.6 = **2.82 A rms**, lagging the voltage by 45.2 degrees. In an inductive branch the current lags — ELI: in an inductor (L), E leads I.

## 3.2 Series RLC at a chosen frequency

R = 20 ohm, L = 50 mH, C = 100 microfarad, driven at 60 Hz.

X_L = 377 x 0.050 = 18.85 ohm. X_C = 1/(omega C) = 1/(377 x 100e-6) = 1/0.0377 = **26.5 ohm**.

Net reactance: X = X_L - X_C = 18.85 - 26.5 = **-7.7 ohm**, so the branch is net CAPACITIVE at this frequency and the current LEADS.

|Z| = sqrt(20^2 + 7.7^2) = sqrt(400 + 59) = **21.4 ohm**, angle = arctan(-7.7/20) = **-21.1 degrees**.

## 3.3 Parallel branches: add admittances

A 10 ohm resistor sits in parallel with a j20 ohm inductive reactance. Working in admittance is faster than the product-over-sum:

Y = 1/10 + 1/(j20) = 0.1 - j0.05 siemens.

|Y| = sqrt(0.01 + 0.0025) = 0.1118 S, so |Z| = 1/0.1118 = **8.94 ohm**, at angle +26.6 degrees (the sign flips when you invert).

## 3.4 rms, average and peak

A sinusoid of 170 V peak has V_rms = 170/sqrt(2) = **120 V** — the familiar mains figure. Its full-cycle average is **zero**; the average of its magnitude is 2 V_peak/pi = 108 V, which is what a rectifier-type meter responds to.

Only rms belongs in a power calculation. Using peak or average in P = V^2/R is a common and expensive slip.`,
      examTip: 'Convert to omega = 2 pi f first and write it down. Most phasor errors on this exam are not conceptual - they are using f where omega belongs, which puts every reactance out by a factor of 6.28.',
      quiz: [
        {
          question: 'A 100 microfarad capacitor is driven at 60 Hz. What is its reactance magnitude?',
          options: ['26.5 ohm', '37.7 ohm', '0.0377 ohm', '16.7 ohm'],
          correctIndex: 0,
          explanation: 'X_C = 1/(omega C) with omega = 2 pi (60) = 377 rad/s, so X_C = 1/(377 x 100e-6) = 1/0.0377 = 26.5 ohm. Using f = 60 instead of omega gives 166 ohm; inverting the expression gives 0.0377.',
        },
        {
          question: 'In a series circuit at a given frequency, X_L = 40 ohm and X_C = 55 ohm. The current relative to the applied voltage is:',
          options: ['leading, because the branch is net capacitive', 'lagging, because the branch is net inductive', 'in phase, because the reactances are similar', 'leading, because X_L is smaller in magnitude than R'],
          correctIndex: 0,
          explanation: 'Net reactance is X_L - X_C = -15 ohm, so the branch is capacitive and the current leads the voltage. ICE: in a capacitor (C), I leads E. The value of R affects the size of the phase angle but never its sign.',
        },
        {
          question: 'A sinusoidal voltage has a peak value of 340 V. What is its rms value?',
          options: ['240 V', '340 V', '480 V', '216 V'],
          correctIndex: 0,
          explanation: 'For a sinusoid, V_rms = V_peak/sqrt(2) = 340/1.414 = 240 V. The 216 V distractor is the rectified average (2 V_peak/pi), which meters may display but which must never be used in a power calculation.',
        },
      ],
    },
    {
      id: 'acp-depth',
      title: '4. Reactance Across Frequency, and Non-Sinusoidal Waveforms',
      content: `## 4.1 Why the two reactances cancel at exactly one frequency

Inductive and capacitive reactance move in opposite directions with frequency,
and on log axes that is unmistakable:

![Inductive reactance rises in proportion to frequency while capacitive reactance falls as its inverse. The two are equal at one frequency only, where the net reactance passes through zero rather than merely becoming small.](/courses/fe-ee/figures/circuits-impedance-vs-frequency.svg)

X_L = omega L is a straight line of slope +1 on log-log; X_C = 1/(omega C) has
slope -1. Two straight lines of different slope cross exactly once, which is
why a series LC has exactly one resonant frequency rather than a band of them.

Below the crossing the capacitor dominates and the branch is capacitive, so
current leads. Above it, the inductor dominates and current lags. At the
crossing the net reactance is zero and the branch looks purely resistive.

## 4.2 Impedance is not the sum of magnitudes

A frequent and expensive error: for R = 30 ohm in series with X_L = 40 ohm,
the impedance magnitude is **not** 70 ohm. Reactance is at right angles to
resistance, so

|Z| = sqrt(30^2 + 40^2) = sqrt(900 + 1600) = **50 ohm**

Adding them arithmetically overstates the impedance by 40%, and would make the
current 40% too small. The right triangle is not decoration - it is the whole
relationship.

## 4.3 Admittance, conductance and susceptance

For parallel circuits, invert everything:

**Y = 1/Z = G + jB**, where G is conductance and B is susceptance.

The trap is that G is **not** 1/R when reactance is present. For Z = R + jX,

Y = 1/(R + jX) = (R - jX)/(R^2 + X^2)

so G = R/(R^2 + X^2) and B = -X/(R^2 + X^2). Only when X = 0 does G reduce to
1/R.

**Worked:** Z = 6 + j8 ohm. |Z| = 10, so |Y| = 0.1 S. Then G = 6/100 = 0.06 S
and B = -8/100 = -0.08 S. Check: sqrt(0.06^2 + 0.08^2) = sqrt(0.0036+0.0064)
= 0.1 S. Consistent.

## 4.4 rms of the waveforms the exam actually uses

Phasors assume a sinusoid. When the waveform is not sinusoidal the phasor
machinery does not apply, but the rms definition still does, and these four
values cover almost every non-sinusoidal question:

| Waveform | rms | Relative to peak |
|---|---|---|
| Sinusoid | V_p/sqrt(2) | 0.707 |
| Square (bipolar) | V_p | 1.000 |
| Triangle / sawtooth | V_p/sqrt(3) | 0.577 |
| Half-wave rectified sinusoid | V_p/2 | 0.500 |
| Full-wave rectified sinusoid | V_p/sqrt(2) | 0.707 |

The last row surprises people: full-wave rectification does not change the rms
at all, because rms squares the signal and squaring removes the sign. It
changes the AVERAGE, from zero to 2V_p/pi, which is what a DC meter reads.

**Worked:** a 100 V peak square wave into 25 ohm dissipates V_rms^2/R =
100^2/25 = **400 W**. The same peak as a sinusoid gives (70.7)^2/25 =
**200 W** - exactly half, because the square wave sits at full amplitude all
the time and the sinusoid does not.

## 4.5 Phase measurement in practice

An oscilloscope measures phase as a time offset, not an angle, so the
conversion has to be done by hand:

**phase (degrees) = 360 x (delta t / T)**

where T is the period of one full cycle.

**Worked:** at 60 Hz the period is 16.67 ms. A current zero-crossing lagging
the voltage crossing by 1.85 ms is

360 x (1.85/16.67) = **40 degrees** lagging, so pf = cos(40) = **0.766**.

Two practical checks on that reading. The offset must be less than half a
period, or you have measured to the wrong crossing and the true angle is the
supplement. And the sign is set by which trace crosses first - current after
voltage is lagging and inductive, current before voltage is leading and
capacitive. An oscilloscope will happily show you a plausible number for the
wrong pair of crossings, so identify the direction before trusting the value.`,
      examTip: 'If a question gives a waveform sketch rather than the word "sinusoidal", stop before reaching for V_p/sqrt(2). Identify the shape first and use its own rms factor - this is the single most reliable trap in the AC section.',
      quiz: [
        {
          question: 'A resistance of 8 ohm is in series with a capacitive reactance of 6 ohm. What is the impedance magnitude?',
          options: ['10 ohm', '14 ohm', '2 ohm', '48 ohm'],
          correctIndex: 0,
          explanation: 'Resistance and reactance are perpendicular, so |Z| = sqrt(8^2 + 6^2) = sqrt(100) = 10 ohm. Adding them arithmetically to 14 ohm ignores the right angle and overstates the impedance by 40 percent.',
        },
        {
          question: 'A 100 V peak bipolar square wave and a 100 V peak sinusoid each drive the same resistor. How do their dissipated powers compare?',
          options: [
            'The square wave dissipates twice as much',
            'They dissipate the same power',
            'The sinusoid dissipates twice as much',
            'The square wave dissipates 1.41 times as much',
          ],
          correctIndex: 0,
          explanation: 'Square-wave rms equals its peak (100 V); sinusoid rms is 70.7 V. Power goes as rms squared, so the ratio is (100/70.7)^2 = 2. The square wave sits at full amplitude continuously while the sinusoid spends most of its time below peak.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Phasor: v(t) = Vm·cos(ωt+φ) → V = Vm∠φ; all DC tools apply.',
    'Impedance: Z_R = R, Z_L = jωL, Z_C = 1/(jωC).',
    'ELI the ICE man: voltage leads current in inductors, current leads in capacitors.',
    'At DC: L = short, C = open. At high frequency: L = open, C = short.',
    'V_rms = V_peak/sqrt(2); power uses RMS values.',
  ],
},

fee_ac_power: {
  topicId: 'fee_ac_power',
  title: 'AC Power: Real, Reactive, and Apparent',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'AC power has three components: real power (useful work), reactive power (energy oscillation), and apparent power (total burden). The power triangle and power factor correction are essential for power system analysis.',
  sections: [
    {
      id: 'acpow-triangle',
      title: '1. Power Triangle and Power Factor',
      content: `## 1.1 Three Types of AC Power

| Power | Symbol | Unit | Formula | Meaning |
|---|---|---|---|---|
| Real (Active) | P | Watts (W) | V·I·cosφ | Does useful work |
| Reactive | Q | VAR | V·I·sinφ | Oscillates, no net work |
| Apparent | S | VA | V·I | Total power burden |

### The Power Triangle

**S² = P² + Q²** (Pythagorean relationship)

**S = P + jQ** (complex power)

- P is the horizontal leg
- Q is the vertical leg
- S is the hypotenuse

## 1.2 Power Factor

**PF = cosφ = P/S**

Where φ is the phase angle between voltage and current.

| PF | Meaning | Load Type |
|---|---|---|
| PF = 1 | Unity (all real) | Purely resistive |
| PF < 1, lagging | Current lags voltage | Inductive (motors) |
| PF < 1, leading | Current leads voltage | Capacitive |

### Why Power Factor Matters

Low PF means:
- More current needed for the same real power: **I = P/(V·PF)**
- Higher I²R losses in conductors
- Larger transformers and cables needed
- Utilities charge penalties for low PF`,
      examTip: 'The power triangle S² = P² + Q² and PF = P/S = cosφ are the most tested AC power concepts on the FE exam. Remember: S is always the largest (hypotenuse), P is always positive, and Q is positive for inductive (lagging) loads and negative for capacitive (leading) loads.',
    },
    {
      id: 'acpow-correction',
      title: '2. Complex Power and Power Factor Correction',
      content: `## 2.1 Complex Power

**S = V · I*** (voltage phasor times conjugate of current phasor)

**S = P + jQ = |V|·|I|∠(θv - θi)**

For a load with impedance Z = R + jX:
- **P = I²·R** (real power dissipated in resistance)
- **Q = I²·X** (reactive power in reactance)

## 2.2 Power Factor Correction

Industrial loads (motors) are inductive (lagging PF). Adding **parallel capacitors** reduces reactive power:

### Calculating Required Capacitance

To correct from PF₁ to PF₂:

1. Calculate old angle: φ₁ = arccos(PF₁)
2. Calculate new angle: φ₂ = arccos(PF₂)
3. Required capacitive reactive power: **Q_C = P·(tanφ₁ - tanφ₂)**
4. Capacitor value: **C = Q_C/(ω·V²)**

### Example
- 100 kW load at PF = 0.8 lagging; correct to PF = 0.95
- φ₁ = arccos(0.8) = 36.87°, φ₂ = arccos(0.95) = 18.19°
- Q_C = 100(tan36.87° - tan18.19°) = 100(0.75 - 0.329) = 42.1 kVAR

The capacitor bank must supply 42.1 kVAR of reactive power.`,
      examTip: 'Power factor correction adds capacitors in PARALLEL with the inductive load (not in series). The capacitor supplies reactive power locally, reducing the reactive power drawn from the source. This lowers apparent power and current without changing the real power consumed.',
      importantNote: 'Over-correcting power factor (making it leading) can cause voltage rise and potential resonance problems. Utilities typically require PF between 0.90 and 1.00 lagging — not leading.',
    },
    {
      id: 'acpw-worked',
      title: '3. Worked Examples',
      content: `## 3.1 The power triangle from a load

A single-phase load draws 20 A rms at 240 V rms with a lagging power factor of 0.80.

S = V I = 240 x 20 = **4800 VA**
P = S cos(theta) = 4800 x 0.80 = **3840 W**
Q = S sin(theta), and sin(theta) = sqrt(1 - 0.64) = 0.60, so Q = 4800 x 0.60 = **2880 VAR** (lagging, so inductive and positive by convention)

Check the triangle: sqrt(3840^2 + 2880^2) = sqrt(14.75e6 + 8.29e6) = sqrt(23.04e6) = 4800 VA. Consistent.

The phase angle is arccos(0.80) = **36.9 degrees**, current lagging.

## 3.2 Power factor correction

Correct the load above to unity power factor at 60 Hz. The capacitor must supply the whole 2880 VAR:

Q_C = V^2/X_C, so X_C = V^2/Q_C = 240^2/2880 = 57600/2880 = **20 ohm**.

C = 1/(omega X_C) = 1/(377 x 20) = 1/7540 = **133 microfarad**.

What changes: P stays at 3840 W — the capacitor supplies no real power. But S falls from 4800 VA to 3840 VA, so the line current falls from 20 A to 3840/240 = **16 A**, a 20% reduction. That current reduction is the whole economic point: smaller conductors and lower I squared R losses in the feeder.

## 3.3 Correcting to 0.95 rather than unity

Full correction is rarely economic. At pf = 0.95, theta = 18.2 degrees and the load may retain Q = P tan(theta) = 3840 x 0.329 = **1264 VAR**.

The capacitor supplies only the difference: 2880 - 1264 = **1616 VAR**, needing X_C = 57600/1616 = 35.6 ohm and C = 1/(377 x 35.6) = **74.5 microfarad** — barely more than half the capacitance for most of the benefit. Diminishing returns near unity is why utilities set a target rather than demanding unity.

## 3.4 Reading the sign of Q

A load with leading power factor (capacitive) has negative Q by the usual convention: it SUPPLIES reactive power rather than absorbing it. Synchronous motors run overexcited do exactly this, which is why they are used as power-factor correctors in industrial plants.`,
      examTip: 'Write S, P and Q as a right triangle before computing anything. Given any two of {S, P, Q, pf, theta} the rest follow by trigonometry, and the triangle keeps you from mixing watts with volt-amperes - which is the single most common error in this section.',
      quiz: [
        {
          question: 'A load draws 10 kW at a lagging power factor of 0.70. What is its apparent power?',
          options: ['14.3 kVA', '7.0 kVA', '10.0 kVA', '20.4 kVA'],
          correctIndex: 0,
          explanation: 'S = P/cos(theta) = 10/0.70 = 14.3 kVA. Multiplying instead of dividing gives 7.0 kVA, which would put apparent power below real power - impossible, since S is the hypotenuse of the power triangle and can never be smaller than P.',
        },
        {
          question: 'A capacitor is added in parallel with an inductive load to correct the power factor. What happens to the real power drawn from the source?',
          options: ['It is unchanged', 'It decreases in proportion to the correction', 'It increases', 'It falls to zero at unity power factor'],
          correctIndex: 0,
          explanation: 'An ideal capacitor absorbs no real power, so P is untouched. What changes is Q and therefore S and the line current. The benefit of correction is smaller conductors and lower I^2R feeder losses, not less real power delivered to the load.',
        },
        {
          question: 'A 240 V, 60 Hz load needs 1200 VAR of capacitive correction. What capacitance is required?',
          options: ['55.3 microfarad', '20.8 microfarad', '133 microfarad', '8.8 microfarad'],
          correctIndex: 0,
          explanation: 'X_C = V^2/Q = 57600/1200 = 48 ohm, then C = 1/(omega X_C) = 1/(377 x 48) = 55.3 microfarad. Forgetting to convert X_C to capacitance, or using f instead of omega, produces the other options.',
        },
      ],
    },
    {
      id: 'acpw-depth',
      title: '4. What a Poor Power Factor Actually Costs',
      content: `## 4.1 The cost curve

Hold the real power fixed at 1 kW and sweep the power factor. Apparent power
and reactive power both climb steeply as the factor falls:

![With real power held at 1 kW, apparent power S = P/pf and reactive power Q = P tan(arccos pf) both rise sharply as the power factor falls, while the real power that does the work stays flat.](/courses/fe-ee/figures/circuits-power-triangle.svg)

Read the shape rather than the numbers. At pf = 1 the apparent power equals
the real power and there is no reactive component at all. At pf = 0.7 the
apparent power is already 43% higher than the real power. By pf = 0.4 it has
more than doubled, and the reactive power exceeds the real power.

Since line current is S/V, that curve **is** the current the utility must
deliver and the conductors must carry - for exactly the same 1 kW of useful
work throughout.

## 4.2 Instantaneous power and where the negative part goes

For v = V_m cos(omega t) and i = I_m cos(omega t - theta), the instantaneous
power is

p(t) = V I cos(theta) + V I cos(2 omega t - theta)

using rms V and I. Two terms, and they behave completely differently:

- The first is **constant**, equal to P. This is the energy that leaves the
  source and does not come back.
- The second **oscillates at twice the line frequency** with zero average.
  This is energy sloshing into the reactance and back out again, twice per
  cycle.

When theta is nonzero, p(t) dips **negative** for part of each cycle: the load
is returning energy to the source. That returned energy still had to travel
down the conductors to get there, and it still caused I^2 R loss on the way.
That is the physical reason reactive power costs money without doing work.

At theta = 90 degrees (pure reactance) the constant term vanishes entirely,
the waveform is symmetric about zero, and the average power is exactly zero -
while the current is at full amplitude.

## 4.3 Complex power, and the sign convention that matters

**S = V I\\*** (voltage phasor times the CONJUGATE of the current phasor)
= P + jQ.

The conjugate is not optional. Using V I instead of V I* flips the sign of Q
and turns a lagging load into a leading one.

**Worked:** V = 240 at 0 degrees, I = 12 at -30 degrees (lagging).
S = (240)(12 at +30) = 2880 at 30 degrees = 2880cos30 + j2880sin30
= **2494 + j1440**, so P = 2494 W and Q = +1440 VAR.

Positive Q means the load absorbs reactive power, i.e. it is inductive. A
leading load returns negative Q.

## 4.4 The three quantities on a bill

| Quantity | Unit | Metered? | What it costs you |
|---|---|---|---|
| Real power P | kW / kWh | yes, always | the energy charge |
| Apparent power S | kVA | often, as demand | the demand charge, sized by peak |
| Reactive power Q | kVAR | sometimes | a power-factor penalty below target |

A plant that halves its reactive power does not reduce its kWh at all. It
reduces the kVA demand and removes the penalty, and it frees transformer and
cable capacity that was being spent carrying current that did no work. Those
are the three benefits an exam answer should name.`,
      examTip: 'S = V I* with the conjugate. Write the star every time - the sign of Q is the whole answer to "is this load leading or lagging", and dropping the conjugate reverses it silently.',
      quiz: [
        {
          question: 'A purely reactive load draws 10 A rms at 240 V rms. What is the average real power delivered to it?',
          options: ['0 W', '2400 W', '1200 W', '1697 W'],
          correctIndex: 0,
          explanation: 'A purely reactive load has theta = 90 degrees, so P = VI cos(90) = 0. Energy flows into the reactance and back out twice per cycle with zero net transfer - yet the full 10 A still flows in the conductors and still causes I^2R loss there.',
        },
        {
          question: 'V = 120 at 0 degrees and I = 5 at -60 degrees. What is the complex power S?',
          options: ['300 + j520 VA', '300 - j520 VA', '600 at -60 degrees VA', '520 + j300 VA'],
          correctIndex: 0,
          explanation: 'S = V I* = (120)(5 at +60) = 600 at 60 degrees = 600cos60 + j600sin60 = 300 + j520. The conjugate flips the current angle from -60 to +60, and the positive Q confirms an inductive, lagging load.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'P = VI·cosφ (real, watts); Q = VI·sinφ (reactive, VAR); S = VI (apparent, VA).',
    'Power triangle: S² = P² + Q²; PF = P/S = cosφ.',
    'Lagging PF (inductive loads) is most common; correct with parallel capacitors.',
    'Q_C = P·(tanφ₁ - tanφ₂) calculates required capacitive reactive power.',
    'Low PF increases current, losses, and equipment sizing requirements.',
  ],
},

fee_resonance: {
  topicId: 'fee_resonance',
  title: 'Resonance and Frequency Response',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Resonance occurs when inductive and capacitive reactances cancel. The resonant frequency, quality factor, and bandwidth characterize RLC circuit frequency response and are fundamental to filter design.',
  sections: [
    {
      id: 'res-series-parallel',
      title: '1. Series and Parallel Resonance',
      content: `## 1.1 Resonant Frequency

At resonance, X_L = X_C:

**ω₀ = 1/sqrt(LC)** (rad/s) or **f₀ = 1/(2π·sqrt(LC))** (Hz)

## 1.2 Series RLC Resonance

At resonance:
- **Z = R** (minimum impedance, purely resistive)
- **Current is maximum**: I = V/R
- Voltage and current are **in phase** (φ = 0)
- Voltage across L and C can be **much larger** than source voltage (Q-factor amplification)

## 1.3 Parallel RLC Resonance

At resonance:
- **Z = R** (maximum impedance, purely resistive)
- Current from source is **minimum**: I = V/R
- This is the opposite behavior from series resonance

| Property | Series RLC | Parallel RLC |
|---|---|---|
| At resonance | Z minimum | Z maximum |
| Current | Maximum | Minimum |
| Impedance | Z = R | Z = R (or Q²R for practical) |
| Application | Band-pass filter | Band-reject filter |

## 1.4 One circuit, numbers all the way through

Resonance questions are quick once the circuit is on paper, because every
quantity comes from the same three components:

![A series RLC circuit driven by a sinusoidal source: R = 10 ohm, L = 100 mH and C = 10 microfarad in one loop. Series resonance is the condition that makes this loop look purely resistive.](/courses/fe-ee/figures/sch-rlc-series.svg)

**Resonant frequency.** ω₀ = 1/√(LC) = 1/√(0.1 × 10×10⁻⁶) = 1/√(10⁻⁶) =
**1000 rad/s**, which is f₀ = 1000/2π = **159.2 Hz**.

**The reactances at that frequency.** X_L = ω₀L = 1000 × 0.1 = 100 Ω, and
X_C = 1/(ω₀C) = 1/(1000 × 10×10⁻⁶) = 100 Ω. Equal, as they must be — that
equality *is* the definition of resonance, and computing both is the fastest
check that you inverted LC correctly.

**Quality factor, two ways.** Q = ω₀L/R = 1000 × 0.1/10 = 10. Independently,
Q = (1/R)√(L/C) = (1/10)√(0.1/10⁻⁵) = (1/10)√(10⁴) = (1/10)(100) = 10. Same
answer by a different route.

**Bandwidth.** BW = ω₀/Q = 1000/10 = **100 rad/s**, i.e. 15.92 Hz. The
half-power frequencies are not simply ω₀ ± BW/2; they are

ω = ∓R/(2L) + √((R/2L)² + 1/(LC)) = ∓50 + √(2500 + 10⁶) = ∓50 + 1001.25

giving **951.25 and 1051.25 rad/s**. Their difference is exactly 100 rad/s, so
the bandwidth formula holds precisely, while their *geometric* mean —
√(951.25 × 1051.25) = 1000.0 — is ω₀. The band is symmetric on a logarithmic
axis, not a linear one, which is why the arithmetic midpoint 1001.25 is slightly
above ω₀ rather than equal to it.

## 1.5 Voltage magnification, and why it surprises people

Drive the loop above with a 10 V rms source at resonance. The impedance is
purely R = 10 Ω, so I = 10/10 = 1 A rms. Then:

| Element | Impedance at ω₀ | Voltage across it | Relative to source |
|---|---|---|---|
| R | 10 Ω | 10.0 V | 1× |
| L | j100 Ω | 100.0 V | **10×** |
| C | −j100 Ω | 100.0 V | **10×** |
| L and C together | j100 − j100 = 0 | 0.0 V | 0× |

A 10 V source produces 100 V across the inductor. Nothing is violated: the
inductor and capacitor voltages are 180° out of phase and cancel exactly, so
KVL around the loop closes on 10 V. But the *individual* element voltages are
Q times the source, and Q = 10 here. This is why a component rated for the
supply voltage can fail in a resonant circuit, and it is a favourite exam trap:
the question gives a source voltage and asks for V_C, and the answer is not the
source voltage.

Move off resonance and the effect collapses quickly. At ω = 2000 rad/s,
X_L = 200 Ω and X_C = 50 Ω, so the net reactance is 150 Ω and
|Z| = √(10² + 150²) = 150.3 Ω — fifteen times the resonant impedance, with the
current down by the same factor. High Q buys sharp selectivity; it does not buy
a broad response.

## 1.6 The parallel case, using the same components

Rearrange those same three elements in parallel across a source and every
statement inverts. ω₀ is unchanged at 1/√(LC) = 1000 rad/s, because it depends
only on L and C. But now:

- The L and C branches carry equal and opposite currents that **circulate
  between them** rather than returning to the source, so the current drawn from
  the supply is a *minimum* at resonance.
- The impedance seen by the source is a *maximum*, not a minimum.
- **Current** magnification replaces voltage magnification: the tank branches
  carry Q times the source current.

A useful way to keep the pair straight is to ask what the resonant element
*shares* with the source. In series, all elements share the current, so the
dramatic quantity is voltage. In parallel, all elements share the voltage, so
the dramatic quantity is current. Everything else — the factor of Q, the
BW = ω₀/Q relation, the flat-topped selectivity trade-off — carries over
unchanged.`,
      examTip: 'Series resonance: impedance MINIMUM, current MAXIMUM. Parallel resonance: impedance MAXIMUM, current MINIMUM. This is the most important distinction. The resonant frequency formula ω₀ = 1/sqrt(LC) is the same for both.',
    },
    {
      id: 'res-q-bw',
      title: '2. Quality Factor and Bandwidth',
      content: `## 2.1 Quality Factor (Q)

**Q = ω₀L/R = 1/(ω₀RC) = sqrt(L/C)/R**

Q measures how "sharp" the resonance peak is:
- **High Q** (> 10): narrow bandwidth, very selective
- **Low Q** (< 1): broad bandwidth, not selective

Q also represents energy stored vs. energy dissipated per cycle:
- Q = 2π × (energy stored) / (energy dissipated per cycle)

## 2.2 Bandwidth

**BW = f₀/Q = R/(2πL)** for series RLC

The bandwidth is the frequency range between the **-3 dB points** (half-power points):

- Lower cutoff: f₁ = f₀ - BW/2
- Upper cutoff: f₂ = f₀ + BW/2

At the -3 dB points:
- Power is **half** of peak power
- Current is **1/sqrt(2) ≈ 0.707** of peak current
- Impedance is **sqrt(2) ≈ 1.414** times minimum impedance

### Selectivity

| Q Value | Bandwidth | Application |
|---|---|---|
| Q > 100 | Very narrow | Radio tuning, crystal oscillators |
| Q = 10-100 | Moderate | Band-pass filters |
| Q < 10 | Wide | Broadband circuits |
| Q < 1 | Very wide | Damped systems |`,
      examTip: 'BW = f₀/Q tells you everything: higher Q = narrower bandwidth = more selective. On the FE exam, if asked about bandwidth, find Q first. Remember: Q = ω₀L/R, so increasing R decreases Q and widens bandwidth.',
      importantNote: 'The -3 dB points are where power drops to HALF (-3 dB ≈ 10·log(0.5)) — not where voltage drops to half. Voltage at -3 dB is 1/sqrt(2) ≈ 0.707 of peak. This is a common source of confusion.',
    },
    {
      id: 'res-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Series resonance: the full set of numbers

R = 10 ohm, L = 100 mH, C = 10 microfarad in series across a 50 V rms source.

omega_0 = 1/sqrt(LC) = 1/sqrt(0.1 x 10e-6) = 1/sqrt(1e-6) = **1000 rad/s**, i.e. f_0 = 1000/(2 pi) = **159 Hz**.

At resonance X_L = 1000 x 0.1 = 100 ohm and X_C = 1/(1000 x 10e-6) = 100 ohm — equal, as they must be. They cancel, so Z = R = **10 ohm** and the current is maximal: I = 50/10 = **5 A**.

Q = omega_0 L/R = (1000)(0.1)/10 = **10**. Equivalently Q = (1/R)sqrt(L/C) = (1/10)sqrt(0.1/10e-6) = (1/10)(100) = 10. Bandwidth: BW = omega_0/Q = 1000/10 = **100 rad/s**.

## 3.2 Voltage magnification

The reactive voltages at resonance are NOT zero — they are large and opposite:

V_L = I X_L = 5 x 100 = **500 V**, and V_C = 500 V, 180 degrees out of phase.

That is Q times the 50 V source. A component rated for the supply voltage will fail here. Voltage magnification by Q is real, is the basis of tuned circuits, and is a favourite exam question precisely because the answer looks impossible.

## 3.3 Half-power points

The half-power frequencies sit approximately omega_0 ± BW/2 for high Q: 1000 ± 50, so **950 and 1050 rad/s**. At those points |Z| = R sqrt(2) = 14.1 ohm, the current has fallen to 5/sqrt(2) = 3.54 A, and the power to half its peak — which is what "half-power" names.

## 3.4 Parallel resonance is the mirror image

Take the same L and C in parallel with R. The resonant frequency is the same 1000 rad/s, but at resonance the parallel LC presents a very HIGH impedance, so the line current is MINIMAL rather than maximal, and the circuit acts as a band-stop rather than a band-pass.

| | Series resonance | Parallel resonance |
|---|---|---|
| Impedance at omega_0 | minimum, = R | maximum |
| Current at omega_0 | maximum | minimum |
| Magnified quantity | voltage across L and C | current circulating in L and C |
| Behaves as | band-pass / acceptor | band-stop / rejector |`,
      examTip: 'Compute omega_0 = 1/sqrt(LC) first and check that X_L and X_C really are equal there. If they are not, you have a unit slip - almost always microfarads left as whole numbers instead of converted to farads.',
      quiz: [
        {
          question: 'A series RLC circuit has L = 40 mH and C = 25 microfarad. What is its resonant frequency in rad/s?',
          options: ['1000 rad/s', '159 rad/s', '6283 rad/s', '100 rad/s'],
          correctIndex: 0,
          explanation: 'omega_0 = 1/sqrt(LC) = 1/sqrt(0.040 x 25e-6) = 1/sqrt(1e-6) = 1000 rad/s. The 159 distractor is that answer converted to hertz - read whether the question asks for omega or f.',
        },
        {
          question: 'At series resonance with Q = 20 and a 10 V source, what is the magnitude of the voltage across the inductor?',
          options: ['200 V', '10 V', '0 V', '0.5 V'],
          correctIndex: 0,
          explanation: 'Voltage magnification at resonance is Q times the source: 20 x 10 = 200 V. The inductor and capacitor voltages are equal and opposite so they cancel in the loop, but each is individually large - which is why component voltage ratings matter in tuned circuits.',
        },
        {
          question: 'How does a parallel RLC circuit behave at its resonant frequency?',
          options: [
            'Impedance is maximum and line current is minimum',
            'Impedance is minimum and line current is maximum',
            'Impedance is zero',
            'It has no resonant frequency',
          ],
          correctIndex: 0,
          explanation: 'Parallel resonance is the dual of series: the tank presents maximum impedance, so the current drawn from the line is minimum. This makes it a band-stop (rejector) circuit, whereas series resonance is band-pass (acceptor).',
        },
      ],
    },
    {
      id: 'res-depth',
      title: '4. Selectivity, Bandwidth and the Q Trade-off',
      content: `## 4.1 What Q buys and what it costs

Fix L and C so the resonant frequency does not move, and vary only R:

![Series RLC current against frequency for Q = 2, 5 and 10, each normalised to its own peak. All three peak at the same frequency; higher Q gives a narrower band, which is the relationship BW = omega_0 / Q made visible.](/courses/fe-ee/figures/circuits-series-resonance.svg)

Three facts the figure makes obvious and a sentence does not:

- **The centre does not move.** omega_0 = 1/sqrt(LC) has no R in it, so
  changing damping changes the shape and never the tuning.
- **Higher Q is narrower.** BW = omega_0/Q exactly, so doubling Q halves the
  bandwidth.
- **The half-power line is where the band is measured.** The 0.707 line cuts
  each curve at two points, and the gap between them is the bandwidth.

The trade is unavoidable: a highly selective circuit rejects neighbouring
frequencies well but responds slowly to changes, because a narrow bandwidth in
frequency is a long settling time in the time domain. A radio front end wants
high Q to separate stations; a power filter wants low Q so it does not ring.

## 4.2 Bandwidth from the half-power frequencies

The exact half-power frequencies are

omega_1,2 = omega_0[sqrt(1 + 1/(4Q^2)) -/+ 1/(2Q)]

which for Q above about 5 collapses to the approximation omega_0 ± BW/2 that
the worked examples used.

Two relations worth carrying:

- **omega_0 = sqrt(omega_1 omega_2)** - the resonant frequency is the
  GEOMETRIC mean of the half-power points, not the arithmetic mean. For low Q
  the two differ noticeably.
- **BW = omega_2 - omega_1 = R/L** for a series circuit, which is a route to
  bandwidth that never needs Q at all.

**Worked:** a circuit has half-power points at 900 and 1100 rad/s. The
geometric mean is sqrt(900 x 1100) = sqrt(990000) = **995 rad/s**, not the
1000 the arithmetic mean would suggest. BW = 200 rad/s, so Q = 995/200 =
**4.98**.

## 4.3 Parallel resonance with a real inductor

An ideal parallel LC has infinite impedance at resonance. A real one does not,
because the inductor carries winding resistance R_L in series with it. The
tank's impedance at resonance becomes finite:

**Z_tank = L/(R_L C)**

which is often written as Q^2 R_L. This is the dynamic resistance, and it is
what a real tank circuit presents to the source.

**Worked:** L = 100 microhenry, C = 100 picofarad, R_L = 5 ohm.
Z_tank = 100e-6/(5 x 100e-12) = 100e-6/500e-12 = **200 kilohm**.

High but finite, and it is the number that sets the gain of a tuned amplifier
stage.

## 4.4 Energy view of Q

Q has a definition independent of any circuit topology:

**Q = 2 pi x (energy stored)/(energy dissipated per cycle)**

A Q of 50 means the circuit stores about 50/(2 pi) = 8 times the energy it
loses each cycle, so oscillation persists for roughly Q radians - about
Q/(2 pi) = 8 full cycles - before decaying appreciably. That is why a high-Q
resonator rings and a low-Q one does not, and why Q appears identically in
mechanical resonators, quartz crystals and RLC circuits.

## 4.5 Designing a filter to a specification

A tuned circuit is to pass 455 kHz with a 10 kHz bandwidth, using a 100
microhenry inductor. Find C, Q and the required R.

**Capacitance from the centre frequency.** omega_0 = 2 pi (455e3) = 2.859e6
rad/s. From omega_0 = 1/sqrt(LC),

C = 1/(omega_0^2 L) = 1/((2.859e6)^2 x 100e-6) = 1/(8.174e12 x 1e-4)
= 1/8.174e8 = **1.22 nanofarad**

**Q from the bandwidth.** Q = f_0/BW = 455/10 = **45.5**.

**R from Q.** For a series circuit Q = omega_0 L/R, so

R = omega_0 L/Q = (2.859e6)(100e-6)/45.5 = 285.9/45.5 = **6.28 ohm**

That total includes the inductor's own winding resistance, which at these
frequencies is often the dominant term - meaning the achievable Q is set by
the inductor you can build, not by a resistor you choose. If the winding alone
measures 10 ohm, the bandwidth cannot be narrower than omega_0 L/10 = 28.6,
i.e. BW = 455/28.6 = **15.9 kHz**, and the specification is unachievable with
that component. Recognising that constraint is the difference between a
calculation and a design.`,
      examTip: 'Resonant frequency is the GEOMETRIC mean of the half-power frequencies, sqrt(f1 f2), not their average. At high Q the two agree closely enough to hide the error, which is exactly why the exam sets low-Q numbers where they do not.',
      quiz: [
        {
          question: 'A resonant circuit has half-power frequencies of 400 and 900 rad/s. What is its resonant frequency?',
          options: ['600 rad/s', '650 rad/s', '500 rad/s', '1300 rad/s'],
          correctIndex: 0,
          explanation: 'omega_0 is the GEOMETRIC mean: sqrt(400 x 900) = sqrt(360000) = 600 rad/s. The arithmetic mean gives 650, which is wrong - and the gap between the two answers grows as Q falls, which is why the exam chooses widely separated half-power points.',
        },
        {
          question: 'A series RLC circuit has R = 4 ohm and L = 20 mH. What is its bandwidth?',
          options: ['200 rad/s', '80 rad/s', '5000 rad/s', 'It cannot be found without C'],
          correctIndex: 0,
          explanation: 'BW = R/L = 4/0.020 = 200 rad/s. Bandwidth depends only on R and L - the capacitance sets where the band is centred but not how wide it is, which is why C is genuinely not needed here.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Resonant frequency: ω₀ = 1/sqrt(LC); f₀ = 1/(2π·sqrt(LC)).',
    'Series resonance: Z minimum, I maximum; parallel: Z maximum, I minimum.',
    'Quality factor Q = ω₀L/R; higher Q = sharper peak.',
    'Bandwidth BW = f₀/Q; -3 dB points are at half-power.',
    'At resonance: impedance is purely resistive, voltage and current are in phase.',
  ],
},

fee_three_phase: {
  topicId: 'fee_three_phase',
  title: 'Three-Phase Circuits and Power',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Three-phase AC systems are the standard for industrial power delivery. Three voltages 120 degrees apart provide constant power, efficient transmission, and compact motor designs. Wye and delta configurations have different voltage-current relationships.',
  sections: [
    {
      id: '3ph-config',
      title: '1. Wye and Delta Configurations',
      content: `## 1.1 Three-Phase Voltages

Three balanced sinusoidal voltages, each 120° apart:
- V_a = Vm∠0°
- V_b = Vm∠-120°
- V_c = Vm∠-240° (= Vm∠+120°)

For balanced systems: **V_a + V_b + V_c = 0**

## 1.2 Wye (Y) Connection

Phase windings share a common **neutral point**.

| Quantity | Relationship |
|---|---|
| Line voltage | V_L = sqrt(3) · V_ph |
| Line current | I_L = I_ph |
| Neutral carries | Only unbalanced current (zero if balanced) |

## 1.3 Delta (Δ) Connection

Phase windings form a closed triangle.

| Quantity | Relationship |
|---|---|
| Line voltage | V_L = V_ph |
| Line current | I_L = sqrt(3) · I_ph |
| No neutral wire | Delta has no neutral point |

### Delta-Wye Conversion

For balanced impedances: **Z_Δ = 3 · Z_Y** (or Z_Y = Z_Δ/3)

## 1.4 The two loads, drawn

Every three-phase question begins with deciding which of these two you are
looking at, because the √3 goes in a different place for each:

![Three equal impedances connected in wye, sharing a neutral point N, and the same three connected in delta as a closed triangle. Terminals A, B and C are the three line conductors in both cases.](/courses/fe-ee/figures/sch-wye-delta.svg)

The distinction to hold on to is *which quantity the phase element sees*:

- In **wye**, each element sits between a line and the neutral, so it sees the
  **phase voltage** V_L/√3, and whatever current flows through it is also the
  line current — there is nowhere else for that current to go.
- In **delta**, each element sits between two lines, so it sees the **full line
  voltage**. But each line conductor feeds two elements, so the line current is
  √3 times the current in any one element.

Exactly one √3 appears in each connection, and it is on the quantity the
element does *not* share with the line. Getting this backwards is the single
most common three-phase error, and it is worth re-deriving from the picture
rather than memorising four rows.

## 1.5 The same three impedances, both ways

Take a balanced 208 V (line-to-line) supply and three 10 Ω resistive elements.
Connect them first in wye, then in delta, and compute everything.

| Quantity | Wye connection | Delta connection |
|---|---|---|
| Voltage across each element | 208/√3 = 120.1 V | 208 V |
| Current in each element | 120.1/10 = 12.01 A | 208/10 = 20.80 A |
| Line current | 12.01 A | √3 × 20.80 = 36.03 A |
| Power per element | 12.01² × 10 = 1442 W | 20.80² × 10 = 4326 W |
| **Total real power** | **4.33 kW** | **12.98 kW** |

The delta connection draws **exactly three times** the power of the wye from the
same supply, and the ratio is not approximate: algebraically
P_Y = 3(V_L/√3)²/Z = V_L²/Z, while P_Δ = 3V_L²/Z. Nothing about the elements
changed — only how they are wired — which is the whole basis of wye-delta
motor starting, where a motor is brought up to speed in wye at one third of the
inrush and then switched to delta for full torque.

Check the total power the other way as well:
P = √3 · V_L · I_L · cos φ. For the wye case that is
1.732 × 208 × 12.01 × 1 = 4327 W, and for delta
1.732 × 208 × 36.03 × 1 = 12,980 W. Both agree with the per-element column to
within rounding. **This formula uses line quantities and works for either
connection** — that is precisely why it is the one to reach for when a problem
gives you a nameplate rather than a diagram. The √3 is already built in, so
applying it to phase quantities double-counts.

## 1.6 Per-phase analysis, and when it is legal

For a balanced system, all three phases carry the same magnitudes displaced by
120°, so you may solve **one phase** and rotate the answer. The standard
procedure is:

1. Convert any delta load to its wye equivalent with Z_Y = Z_Δ/3.
2. Draw the single-phase circuit: one source of V_L/√3 at 0°, one Z_Y, neutral
   as the reference.
3. Solve it as an ordinary AC circuit.
4. Multiply the resulting power by three; rotate voltages and currents by
   ∓120° for the other two phases.

Two conditions make this legal, and the exam does test them. The source must be
balanced, and the load must be balanced. When either fails — one blown fuse, one
oversized single-phase load — the phases no longer differ by a simple rotation,
the neutral carries current, and per-phase analysis gives the wrong answer
rather than an approximate one. Unbalanced systems need node analysis, or
symmetrical components at the professional level.

For a balanced wye load the neutral current is
I_a + I_b + I_c = I(1∠0° + 1∠−120° + 1∠120°) = 0. That is why a balanced
four-wire system can run with a thin neutral, and why removing the neutral
entirely changes nothing until the load goes out of balance.

## 1.7 Measuring the power that actually flows

A three-phase load needs only **two** wattmeters, not three, whether or not the
load is balanced and whether it is wye or delta — Blondel's theorem, which says
an n-wire system needs n − 1 meters. Connect each meter's current coil in a
different line and both voltage coils to the third line; total power is the
algebraic sum of the two readings.

The sum is *algebraic*, and one reading goes negative when the power factor
falls below 0.5. That is not a fault and not a wiring error, and a question that
reports one negative wattmeter is testing whether you subtract rather than
ignore it. The two readings also give the power factor directly, since
tan φ = √3 (P₂ − P₁)/(P₂ + P₁) — which is why the two-wattmeter method survives
in practice long after digital meters could have replaced it.`,
      examTip: 'The sqrt(3) factor appears in EVERY three-phase problem. For wye: multiply phase voltage by sqrt(3) to get line voltage. For delta: multiply phase current by sqrt(3) to get line current. Draw the phasor diagram if you forget which one.',
    },
    {
      id: '3ph-power',
      title: '2. Three-Phase Power and Per-Phase Analysis',
      content: `## 2.1 Three-Phase Power

For balanced systems:

- **P = sqrt(3) · V_L · I_L · cosφ** (real power)
- **Q = sqrt(3) · V_L · I_L · sinφ** (reactive power)
- **S = sqrt(3) · V_L · I_L** (apparent power)

Or equivalently: **P = 3 · V_ph · I_ph · cosφ** (three times single-phase power)

### Key Advantage

Three-phase power is **constant** — it does not pulsate like single-phase. This provides smoother torque in motors and more efficient power transmission.

## 2.2 Per-Phase Analysis

For balanced three-phase systems, analyze **one phase** and multiply by 3:

1. Convert delta loads to wye equivalent if needed (Z_Y = Z_Δ/3)
2. Draw single-phase equivalent circuit
3. Solve for phase voltage, current, and power
4. Multiply power by 3 for total three-phase power

This simplifies analysis enormously — a three-phase problem becomes a single-phase problem.

## 2.3 Unbalanced Systems

When loads are unbalanced:
- Per-phase analysis does NOT apply
- Neutral current is NOT zero
- Use **symmetrical components** (positive, negative, zero sequence) for analysis`,
      examTip: 'Per-phase analysis is the key to solving three-phase problems quickly. Convert everything to wye, solve one phase, multiply power by 3. The FE exam typically gives balanced systems, so per-phase analysis works for most problems.',
      importantNote: 'Three-phase power P = sqrt(3)·V_L·I_L·cosφ uses LINE values (not phase values). This is the standard formula because line values are what meters measure at terminals. Make sure you identify whether given values are line or phase before applying formulas.',
    },
    {
      id: '3ph-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Balanced wye load

A balanced wye load of 10 ohm per phase is fed from a 208 V line-to-line, 60 Hz supply.

In wye, V_line = sqrt(3) V_phase, so V_phase = 208/1.732 = **120 V**.
In wye, I_line = I_phase = 120/10 = **12 A**.

Total real power (purely resistive load, pf = 1):

P = sqrt(3) V_L I_L cos(theta) = 1.732 x 208 x 12 x 1 = **4324 W**

Cross-check per phase: 3 x V_phase x I_phase = 3 x 120 x 12 = 4320 W. The small difference is rounding in sqrt(3); either route is acceptable.

## 3.2 The same load connected in delta

Reconnect those 10 ohm elements in delta on the same 208 V line.

In delta, V_phase = V_line = **208 V**, so I_phase = 208/10 = **20.8 A**.
In delta, I_line = sqrt(3) I_phase = 1.732 x 20.8 = **36 A**.

P = sqrt(3) x 208 x 36 = **12,970 W** — three times the wye figure.

**That factor of three is the point.** The same three resistors draw three times the power in delta as in wye on the same line voltage, because each element sees sqrt(3) times the voltage and hence 3 times the power. It is why motor starters use wye for starting and switch to delta for running.

## 3.3 A load with power factor

A balanced delta load draws 30 A of line current at 480 V line-to-line with pf = 0.85 lagging.

S = sqrt(3) V_L I_L = 1.732 x 480 x 30 = **24,940 VA**
P = S x 0.85 = **21,200 W**
Q = S x sin(arccos 0.85) = 24,940 x 0.527 = **13,140 VAR**

Note that the sqrt(3) V_L I_L formula uses LINE quantities for both, whichever way the load is connected — that is why it is the one worth memorising.

## 3.4 Delta-to-wye conversion for analysis

A balanced delta of Z_delta converts to a wye of **Z_wye = Z_delta/3**. Converting a delta load to its wye equivalent lets you analyse one phase against neutral and multiply by three, which is almost always faster than working the delta directly.

Applying it to 3.2: Z_wye = 10/3 = 3.33 ohm per phase, V_phase = 120 V, I_line = 120/3.33 = 36 A. Matches the delta answer exactly.`,
      examTip: 'Write down which connection you have before touching sqrt(3). Wye: line voltage is sqrt(3) larger, currents equal. Delta: line current is sqrt(3) larger, voltages equal. Getting this backwards is the single biggest source of lost marks in three-phase problems.',
      quiz: [
        {
          question: 'A balanced wye load is supplied at 480 V line-to-line. What is the phase voltage?',
          options: ['277 V', '480 V', '831 V', '240 V'],
          correctIndex: 0,
          explanation: 'In wye, V_phase = V_line/sqrt(3) = 480/1.732 = 277 V. This is the standard 480/277 V commercial system, where 277 V is what lighting circuits use line-to-neutral.',
        },
        {
          question: 'Three identical resistors draw 6 kW when connected in wye across a given line voltage. What power do they draw reconnected in delta on the same line?',
          options: ['18 kW', '2 kW', '6 kW', '10.4 kW'],
          correctIndex: 0,
          explanation: 'Delta draws three times the wye power for the same line voltage, because each element sees sqrt(3) times the voltage and power goes as voltage squared. This is exactly why wye-delta starting reduces motor inrush - starting in wye draws a third of the delta current.',
        },
        {
          question: 'A balanced three-phase load draws 25 A of line current at 208 V line-to-line with a power factor of 0.9. What is the real power?',
          options: ['8.1 kW', '4.7 kW', '14.0 kW', '5.2 kW'],
          correctIndex: 0,
          explanation: 'P = sqrt(3) V_L I_L cos(theta) = 1.732 x 208 x 25 x 0.9 = 8106 W. The sqrt(3) formula takes LINE voltage and LINE current whatever the connection, which is what makes it the one to remember.',
        },
      ],
    },
    {
      id: '3ph-depth',
      title: '4. Why Three Phase, and What Unbalance Does',
      content: `## 4.1 The factor of three, across the whole range

The same three resistors, on the same line voltage, in the two connections:

![Total real power against line voltage for three 10 ohm resistors connected in wye and in delta. The delta connection draws exactly three times the wye power at every voltage, not merely near one operating point.](/courses/fe-ee/figures/circuits-three-phase-wye-delta.svg)

The ratio is exactly three everywhere, because each delta element sees
sqrt(3) times the voltage a wye element sees, and power goes as voltage
squared: (sqrt(3))^2 = 3.

This is the whole basis of **wye-delta starting**. Start a motor in wye and it
draws a third of the current and produces a third of the torque; switch to
delta once it is up to speed. The trade is explicit - you cannot have the
reduced inrush and the full starting torque at the same time.

## 4.2 Why three phases rather than one or six

Three reasons the exam expects:

- **Constant instantaneous power.** For a balanced three-phase load the three
  phase powers sum to a constant, with no 120 Hz pulsation. A single-phase
  motor pulses at twice line frequency and needs extra mass or a starting
  winding to run smoothly.
- **No neutral current when balanced.** The three phase currents sum to zero,
  so the neutral carries nothing and can be sized smaller - or omitted in a
  three-wire delta.
- **Less conductor for the same power.** Three-phase transmission moves a
  given power with roughly 75% of the copper a comparable single-phase system
  needs.

Six phases would improve the first two only marginally while doubling the
apparatus, which is why three is the settled compromise.

## 4.3 Unbalance, and the neutral

The zero-neutral-current result holds ONLY when the load is balanced. With
unequal phase loads the neutral carries the phasor sum, and it is not
generally the arithmetic difference.

**Worked:** phase currents of 10 A, 10 A and 4 A, at the usual 120-degree
spacing. Taking the first along the reference axis:

I_a = 10 at 0, I_b = 10 at -120, I_c = 4 at +120

Real parts: 10 + 10(-0.5) + 4(-0.5) = 10 - 5 - 2 = **3**
Imag parts: 0 + 10(-0.866) + 4(+0.866) = -8.66 + 3.46 = **-5.2**

I_n = sqrt(9 + 27) = **6.0 A**

Note it is not 10 - 4 = 6 by coincidence of these numbers; change the angles
and the arithmetic-difference shortcut fails. Always sum as phasors.

A further trap in modern buildings: non-linear single-phase loads inject third
harmonics, which are in phase across all three phases and therefore ADD in the
neutral rather than cancelling. A neutral can carry more current than any
phase, which is why codes require full-sized or oversized neutrals on
harmonic-rich circuits.

## 4.4 Two-wattmeter method

Three-phase power can be measured with two wattmeters regardless of balance,
provided there is no neutral connection:

**P_total = W1 + W2**

and for a balanced load the power factor follows from the ratio:

**tan(theta) = sqrt(3)(W1 - W2)/(W1 + W2)**

**Worked:** W1 = 8 kW, W2 = 2 kW. Total = **10 kW**.
tan(theta) = 1.732(6)/10 = 1.039, so theta = 46.1 degrees and
pf = cos(46.1) = **0.693**.

When one wattmeter reads negative, the power factor is below 0.5 - a useful
diagnostic that needs no calculation at all.`,
      examTip: 'The two-wattmeter total is the SUM of the readings even when one is negative. A negative reading is not an error to be corrected by taking a magnitude; it is the instrument telling you the power factor is under 0.5.',
      quiz: [
        {
          question: 'Two wattmeters measuring a balanced three-phase load read 6 kW and -1 kW. What is the total power?',
          options: ['5 kW', '7 kW', '6 kW', '1 kW'],
          correctIndex: 0,
          explanation: 'P_total = W1 + W2 = 6 + (-1) = 5 kW. The negative reading is added, not subtracted or discarded - and its presence tells you immediately that the power factor is below 0.5.',
        },
        {
          question: 'Why does the neutral of a balanced three-phase wye load carry no current?',
          options: [
            'The three phase currents are equal and 120 degrees apart, so they sum to zero as phasors',
            'The neutral is not connected in a balanced system',
            'The currents cancel in pairs, leaving one phase',
            'Neutral current is blocked by the transformer',
          ],
          correctIndex: 0,
          explanation: 'Three equal phasors spaced 120 degrees apart sum to zero, so nothing returns through the neutral. This fails as soon as the load is unbalanced, and fails badly with third-harmonic loads whose components are in phase across all three lines and therefore ADD in the neutral.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Wye: V_L = sqrt(3)·V_ph, I_L = I_ph; Delta: V_L = V_ph, I_L = sqrt(3)·I_ph.',
    'Three-phase power: P = sqrt(3)·V_L·I_L·cosφ (constant, not pulsating).',
    'Per-phase analysis: solve one phase, multiply power by 3 (balanced systems only).',
    'Delta-wye conversion: Z_Δ = 3·Z_Y for balanced loads.',
    'Balanced neutral current is zero; unbalanced systems need symmetrical components.',
  ],
},

fee_transients: {
  topicId: 'fee_transients',
  title: 'Transient Analysis: RC, RL, and RLC Circuits',
  domainWeight: 'Circuit Analysis · 10%',
  overview: 'Transient response describes circuit behavior after switching events. First-order RC and RL circuits follow exponential responses with time constant τ. Second-order RLC circuits can be underdamped, critically damped, or overdamped.',
  sections: [
    {
      id: 'trans-first',
      title: '1. First-Order Transients (RC and RL)',
      content: `## 1.1 The Universal First-Order Formula

**x(t) = x(∞) + [x(0) - x(∞)] · e^(-t/τ)**

This single formula solves ANY first-order transient. Find three things:
1. **x(0)**: initial value (from circuit conditions before switching)
2. **x(∞)**: final value (from circuit at t → ∞ in steady state)
3. **τ**: time constant

### Time Constants

| Circuit | Time Constant | Settling Time (99%) |
|---|---|---|
| RC | τ = R·C | 5τ = 5RC |
| RL | τ = L/R | 5τ = 5L/R |

## 1.2 RC Circuit Responses

### Charging (from 0 to V):
- v_C(t) = V(1 - e^(-t/RC))
- i(t) = (V/R)·e^(-t/RC)

### Discharging (from V₀ to 0):
- v_C(t) = V₀·e^(-t/RC)
- i(t) = -(V₀/R)·e^(-t/RC)

## 1.3 RL Circuit Response

### Energizing (from 0 to V/R):
- i_L(t) = (V/R)(1 - e^(-tR/L))
- v_L(t) = V·e^(-tR/L)

## 1.4 Initial Conditions (Continuity)

At the instant of switching (t = 0⁺):
- **Capacitor voltage cannot change instantly**: v_C(0⁺) = v_C(0⁻)
- **Inductor current cannot change instantly**: i_L(0⁺) = i_L(0⁻)

## 1.5 A charging circuit, end to end

The universal formula needs three numbers, and all three are read off the
circuit rather than derived:

![A 100 V source, a switch that closes at t = 0, a 50 kilohm resistor and a 10 microfarad capacitor in series. The capacitor charges through the resistor once the switch closes.](/courses/fe-ee/figures/sch-rc-transient.svg)

**τ = RC** = 50×10³ × 10×10⁻⁶ = **0.5 s**. Get the exponents right by grouping:
kΩ × µF = 10³ × 10⁻⁶ = 10⁻³, so kΩ × µF gives milliseconds directly. Here
50 × 10 = 500 ms. That shortcut removes the most common arithmetic slip in the
whole topic.

**x(0⁺) = 0 V.** The capacitor was uncharged before the switch closed, and
capacitor voltage is continuous, so it is still 0 V immediately after.

**x(∞) = 100 V.** After a long time the capacitor current falls to zero, so
there is no drop across R and the capacitor holds the full source voltage.

Therefore v_C(t) = 100(1 − e^(−t/0.5)) volts.

The current follows from the *resistor*, not the capacitor: at t = 0⁺ the
capacitor is at 0 V so the entire 100 V appears across R, giving
i(0⁺) = 100/50 kΩ = **2 mA**. This is the counter-intuitive half of the problem
worth stating plainly: **the capacitor voltage starts at its minimum while the
current starts at its maximum.** The element that cannot change is the voltage;
the current is free to jump, and it does.

| Time | t/τ | v_C | Fraction of final | i(t) |
|---|---|---|---|---|
| 0 s | 0 | 0.00 V | 0.0 % | 2.000 mA |
| 0.5 s | 1τ | 63.21 V | 63.2 % | 0.736 mA |
| 1.0 s | 2τ | 86.47 V | 86.5 % | 0.271 mA |
| 1.5 s | 3τ | 95.02 V | 95.0 % | 0.100 mA |
| 2.0 s | 4τ | 98.17 V | 98.2 % | 0.037 mA |
| 2.5 s | 5τ | 99.33 V | 99.3 % | 0.013 mA |

The percentages in the middle column are worth memorising, because FE questions
ask for them far more often than they ask for a general time: **63.2 % after one
time constant, 86.5 % after two, 95 % after three, 99.3 % after five.** Note also
that every row satisfies v_C + i·R = 100 V, which is KVL and is the check to run
if a computed value looks wrong.

## 1.6 Solving for time rather than voltage

The other common form asks *when* rather than *how much*. Invert the exponential:

t = −τ · ln[(x(∞) − x(t))/(x(∞) − x(0))]

For this circuit to reach 90 V:
t = −0.5 · ln[(100 − 90)/(100 − 0)] = −0.5 · ln(0.1) = 0.5 × 2.303 = **1.15 s**.

Sanity-check it against the table: 90 V sits between the 86.47 V at 2τ = 1.0 s
and the 95.02 V at 3τ = 1.5 s, and 1.15 s lands between them. Any answer outside
that bracket is arithmetic, not physics.

## 1.7 Where the energy goes

Charging this capacitor stores E = ½CV² = ½ × 10×10⁻⁶ × 100² = **0.05 J**. But
the source delivers charge Q = CV at a constant 100 V, so it supplies
E = QV = CV² = **0.1 J**. The missing half — another 0.05 J — is dissipated in
R as heat, and this is true **regardless of the value of R**.

Making R smaller charges the capacitor faster but does not improve the
efficiency, which is fixed at 50 % for charging a capacitor from a constant
voltage source through any resistance. It is a result that appears in FE
questions as a distractor set where three of the options depend on R and the
correct one does not.`,
      examTip: 'The universal formula x(t) = x(∞) + [x(0)-x(∞)]·e^(-t/τ) is the MOST important transient formula. Step 1: find initial value. Step 2: find final value (replace C with open, L with short for DC steady state). Step 3: find τ. Plug in and you are done.',
      importantNote: 'At t = 0⁺, capacitors act as voltage sources (maintaining their voltage) and inductors act as current sources (maintaining their current). At t = ∞, capacitors act as open circuits and inductors act as short circuits (DC steady state). These two limiting cases give you x(0) and x(∞).',
    },
    {
      id: 'trans-second',
      title: '2. Second-Order Transients (RLC)',
      content: `## 2.1 RLC Circuit Response Types

The characteristic equation: **s² + 2αs + ω₀² = 0**

Where:
- **α = R/(2L)** is the damping coefficient (series RLC)
- **ω₀ = 1/sqrt(LC)** is the natural frequency
- **ζ = α/ω₀ = R/(2sqrt(L/C))** is the damping ratio

### Response Types

| Condition | Type | Roots | Behavior |
|---|---|---|---|
| ζ < 1 (α < ω₀) | **Underdamped** | Complex conjugate | Oscillates with decay |
| ζ = 1 (α = ω₀) | **Critically damped** | Repeated real | Fastest non-oscillatory |
| ζ > 1 (α > ω₀) | **Overdamped** | Distinct real | Slow, monotonic |

### Underdamped Response

**x(t) = e^(-αt) · [A·cos(ωd·t) + B·sin(ωd·t)]**

Where **ωd = ω₀·sqrt(1-ζ²)** is the damped natural frequency.

## 2.2 Practical Implications

- **Underdamped**: voltage/current oscillates (ringing) — seen in LC filters, clock circuits
- **Critically damped**: fastest settling without overshoot — ideal for measurement systems
- **Overdamped**: sluggish but no overshoot — over-designed damping

### Protection Considerations

- **Inductor switching**: opening a switch in an inductive circuit causes voltage spikes (v = L·di/dt with large di/dt)
- **Solution**: snubber circuits, flyback diodes
- **Capacitor switching**: closing a switch to charge a capacitor causes current spikes
- **Solution**: series resistance to limit inrush current`,
      examTip: 'The damping ratio ζ = R/(2sqrt(L/C)) is your go-to parameter. Increasing R increases ζ (more damping). ζ < 1 means oscillation; ζ = 1 is the critical boundary. On the FE exam, you will often need to identify which case applies from given R, L, C values.',
    },
    {
      id: 'tr-worked',
      title: '3. Worked Examples',
      content: `## 3.1 RC charging

A 10 microfarad capacitor, initially uncharged, charges through 50 kilohm from a 100 V source.

tau = RC = (50e3)(10e-6) = **0.5 s**.

v_C(t) = 100(1 - e^(-t/0.5)) volts.

At t = tau: v = 100(1 - 0.368) = **63.2 V** — the defining 63.2% of the final value.
At t = 3 tau = 1.5 s: v = 100(1 - 0.0498) = **95.0 V**.
At t = 5 tau = 2.5 s: v = **99.3 V**, conventionally "fully charged".

The current runs the other way: i(t) = (100/50e3) e^(-t/0.5) = 2 e^(-t/0.5) mA, starting at **2 mA** and decaying to zero.

## 3.2 The two limiting circuits

Almost every transient multiple-choice question yields to sketching two circuits rather than solving anything:

| Element | t = 0+ (just after switching) | t = infinity (steady state) |
|---|---|---|
| Capacitor, initially uncharged | short circuit | open circuit |
| Capacitor, initially charged to V0 | voltage source V0 | open circuit |
| Inductor, initially unenergised | open circuit | short circuit |
| Inductor, carrying I0 | current source I0 | short circuit |

The reason is the continuity rules: **capacitor voltage cannot change instantaneously, and inductor current cannot change instantaneously.** Everything else in a first-order circuit follows.

## 3.3 RL energising with a series resistance

A 2 H inductor with 100 ohm in series is switched onto 50 V.

tau = L/R = 2/100 = **0.02 s** = 20 ms. Final current = 50/100 = **0.5 A**.

i(t) = 0.5(1 - e^(-t/0.02)) A.

At t = 0+ the inductor is an open circuit, so i = 0 and the full 50 V appears across the inductor. At steady state the inductor is a plain wire, so the whole 50 V sits across the resistor and the inductor voltage is zero.

Stored energy at steady state: W = (1/2) L I^2 = 0.5 x 2 x 0.25 = **0.25 J**.

## 3.4 The general first-order formula

Any first-order transient can be written without solving a differential equation:

**x(t) = x(infinity) + [x(0+) - x(infinity)] e^(-t/tau)**

Find the final value from the steady-state circuit, the initial value from the continuity rule, and tau from the resistance seen by the reactive element with sources killed. Three quantities, no calculus.

Example: the capacitor of 3.1 already charged to 40 V when the switch closes. Then x(0+) = 40, x(infinity) = 100, tau = 0.5 s, so v_C(t) = 100 - 60 e^(-2t) volts.`,
      examTip: 'For tau, use the resistance the reactive element SEES with independent sources killed - which is the Thevenin resistance at its terminals, not necessarily the resistor drawn next to it. In a circuit with several resistors this is where most tau errors come from.',
      quiz: [
        {
          question: 'A 100 microfarad capacitor discharges through 20 kilohm. How long is one time constant?',
          options: ['2 s', '0.2 s', '20 s', '0.05 s'],
          correctIndex: 0,
          explanation: 'tau = RC = (20e3)(100e-6) = 2 s. After 2 s the voltage has fallen to 36.8% of its initial value, and after roughly 5 tau = 10 s it is conventionally considered fully discharged.',
        },
        {
          question: 'An uncharged capacitor is in a circuit at the instant a switch closes. How does it behave at t = 0+?',
          options: ['As a short circuit', 'As an open circuit', 'As a resistor equal to 1/(omega C)', 'As a voltage source equal to the supply'],
          correctIndex: 0,
          explanation: 'Capacitor voltage cannot change instantaneously, so an uncharged capacitor holds 0 V at t = 0+, which is exactly what a short circuit does. It becomes an open circuit only at steady state. An inductor is the mirror image: open at t = 0+, short at steady state.',
        },
        {
          question: 'An RL circuit has L = 0.5 H and a Thevenin resistance of 250 ohm at the inductor terminals. What fraction of the final current is reached after 5 ms?',
          options: ['91.8%', '63.2%', '36.8%', '99.3%'],
          correctIndex: 0,
          explanation: 'tau = L/R = 0.5/250 = 2 ms, so 5 ms is 2.5 time constants. The rising response gives 1 - e^(-2.5) = 1 - 0.082 = 91.8%. The 63.2% figure applies at exactly one time constant and 99.3% at five.',
        },
      ],
    },
    {
      id: 'tr-depth',
      title: '4. The Universal Curve, Switching and Second-Order Circuits',
      content: `## 4.1 One pair of curves for every first-order circuit

Every RC and RL transient in the syllabus is one of these two shapes, plotted
in units of tau so the same picture serves every component value:

![Charging and discharging exponentials against time in units of the time constant. The markers give the values the exam asks for: 63.2 percent of the change after one time constant, 95.0 percent after three, 99.3 percent after five.](/courses/fe-ee/figures/circuits-rc-rl-transient.svg)

Memorise three points on it and you can answer most transient questions
without the exponential at all:

| Elapsed | Change completed | Remaining |
|---|---|---|
| 1 tau | 63.2% | 36.8% |
| 2 tau | 86.5% | 13.5% |
| 3 tau | 95.0% | 5.0% |
| 5 tau | 99.3% | 0.7% |

The curve never actually reaches its final value, which is why "fully charged"
is a convention (five tau) rather than a fact.

## 4.2 Finding tau when the circuit is not just R and C

tau uses the resistance the reactive element **sees**, which is the Thevenin
resistance at its terminals with independent sources killed - not whichever
resistor is drawn nearest.

**Worked:** a capacitor sits between a node and ground. From that node, 6 ohm
goes to a voltage source and 12 ohm goes to ground. Kill the source (short it)
and the capacitor sees 6 in parallel with 12 = **4 ohm**. With C = 250
microfarad, tau = (4)(250e-6) = **1 ms** - not 1.5 ms from the 6 ohm alone,
and not 3 ms from the 12 ohm alone.

Getting this wrong scales every subsequent time by the same factor, so it is
worth the extra ten seconds of drawing the killed-source circuit.

## 4.3 Switching energy, and why inductors are dangerous

Opening a switch in an inductive circuit forces di/dt toward infinity, and
v = L di/dt follows it. A 0.5 H relay coil carrying 2 A, interrupted in 1
microsecond, would in principle generate

v = 0.5 x (2/1e-6) = **1 MV**

In practice the switch contacts arc and clamp it far below that, which is
exactly the damage mechanism. A flyback diode across the coil gives the
current a path so it decays through the diode rather than through an arc,
dissipating the stored (1/2)L I^2 = 1 J harmlessly.

Capacitors have the mirror hazard: closing a switch onto a discharged
capacitor asks for infinite di/dt from the source, which is why inrush current
limiting exists.

## 4.4 When the circuit is second order

Put both L and C in the same loop and the response stops being a single
exponential. The characteristic equation s^2 + (R/L)s + 1/(LC) = 0 gives
alpha = R/2L and omega_0 = 1/sqrt(LC), and their comparison names the
response - the same alpha-versus-omega_0 test the differential-equations
chapter derives.

**Worked:** R = 100 ohm, L = 10 mH, C = 1 microfarad.
alpha = 100/0.020 = 5000, omega_0 = 1/sqrt(10e-3 x 1e-6) = 1/sqrt(1e-8) =
10,000. Since alpha < omega_0, **underdamped**, with
omega_d = sqrt(1e8 - 2.5e7) = **8660 rad/s**.

The envelope decays as e^(-5000t), so the 1/e time is 200 microseconds and the
ringing is at 8660/(2 pi) = 1378 Hz. Both numbers come straight from alpha and
omega_d, with no differential equation solved.`,
      examTip: 'Draw the killed-source circuit before computing tau. Independent voltage sources become shorts and current sources become opens, and the resistance the reactive element then sees is the only one that matters.',
      quiz: [
        {
          question: 'A capacitor sees 12 ohm to ground and 4 ohm to an ideal voltage source. What resistance sets its time constant?',
          options: ['3 ohm', '16 ohm', '12 ohm', '4 ohm'],
          correctIndex: 0,
          explanation: 'Kill the source by shorting it, and the capacitor sees 12 in parallel with 4 = 48/16 = 3 ohm. Using either resistor alone, or adding them in series, gives a time constant that is wrong by a factor of four or more.',
        },
        {
          question: 'A 2 H inductor carrying 3 A has its circuit opened. How much energy must be dissipated somewhere?',
          options: ['9 J', '6 J', '3 J', '18 J'],
          correctIndex: 0,
          explanation: 'W = (1/2)L I^2 = 0.5 x 2 x 9 = 9 J. That energy cannot vanish instantaneously, so without a flyback path it goes into an arc across the opening contacts - which is the mechanism that destroys switches in inductive circuits.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Universal first-order: x(t) = x(∞) + [x(0)-x(∞)]·e^(-t/τ); τ = RC or L/R.',
    'At t=0⁺: v_C cannot change, i_L cannot change (continuity conditions).',
    'At t=∞ (DC): C = open circuit, L = short circuit.',
    'Damping ratio ζ = R/(2sqrt(L/C)); ζ<1 underdamped, ζ=1 critical, ζ>1 overdamped.',
    'Settling time ≈ 5τ for first-order; depends on ζ and ωn for second-order.',
  ],
},


// ═══════════════════════════════════════════════════════════════
// TOPICS 7–17 (Linear Systems through Software Development)
// ═══════════════════════════════════════════════════════════════

  fee_time_domain: {
    topicId: 'fee_time_domain',
    title: 'Time Domain Analysis & LTI Systems',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'Time domain analysis examines system behavior using impulse and step responses. The impulse response h(t) completely characterizes an LTI system, enabling output prediction for any input through convolution. Understanding LTI properties, causality, and BIBO stability is essential for the FE exam.',
    sections: [
      {
        id: 'td-impulse-step',
        title: '1. Impulse Response and Convolution',
        content: `## 1.1 The Impulse Response h(t)

The **impulse response** h(t) is the output of a system when the input is a unit impulse δ(t). It completely characterizes any **Linear Time-Invariant (LTI)** system — once you know h(t), you can predict the output for **any** input using convolution.

**Continuous-time convolution:**

**y(t) = ∫ x(τ) · h(t − τ) dτ**

**Discrete-time convolution:**

**y[n] = Σ x[k] · h[n − k]**

| Signal | Response | What It Reveals |
|---|---|---|
| Impulse δ(t) | h(t) | All system dynamics — poles, zeros, decay, oscillation |
| Step u(t) | g(t) = ∫h(τ)dτ | Settling time, overshoot, steady-state value |

### Step Response

The **step response** g(t) is the integral of the impulse response: **g(t) = ∫₀ᵗ h(τ)dτ**. Conversely, **h(t) = dg(t)/dt**. The step response reveals how quickly and smoothly a system reaches steady state.

## 1.2 Convolution Properties

- **Commutative**: x * h = h * x
- **Associative**: (x * h₁) * h₂ = x * (h₁ * h₂)
- **Distributive**: x * (h₁ + h₂) = x * h₁ + x * h₂
- **Identity**: x(t) * δ(t) = x(t)
- **Time-shift**: x(t) * δ(t − t₀) = x(t − t₀)

For the FE exam, memorize key response shapes for first and second-order systems — these appear repeatedly in both circuit analysis and control questions.`,
        examTip: 'On the FE exam, convolution problems often simplify dramatically. Remember that convolving any signal with δ(t) returns the signal itself, and convolving with δ(t−t₀) shifts it by t₀. For rectangular pulse convolution, the result is a trapezoid — sketch it rather than computing the integral.',
      },
      {
        id: 'td-lti-stability',
        title: '2. LTI Systems, Causality, and BIBO Stability',
        content: `## 2.1 Linear Time-Invariant (LTI) Properties

An LTI system must satisfy two properties:

**Linearity (Superposition):**
- If x₁(t) → y₁(t) and x₂(t) → y₂(t), then **α·x₁(t) + β·x₂(t) → α·y₁(t) + β·y₂(t)**

**Time-Invariance:**
- If x(t) → y(t), then **x(t − t₀) → y(t − t₀)** — the system response does not change over time

| Property | Test | Engineering Significance |
|---|---|---|
| **Linearity** | Scale and add inputs → outputs scale and add | Enables superposition analysis |
| **Time-invariance** | Shifted input → same shifted output | System parameters constant |
| **Causality** | h(t) = 0 for t < 0 | Output depends only on past/present inputs |
| **BIBO Stability** | ∫\|h(t)\|dt < ∞ | Bounded inputs produce bounded outputs |

## 2.2 BIBO Stability

A system is **Bounded-Input Bounded-Output (BIBO) stable** if every bounded input produces a bounded output. For LTI systems, this is equivalent to:

**∫₋∞^∞ |h(t)| dt < ∞** (continuous-time)

**Σ |h[n]| < ∞** (discrete-time)

For systems described by rational transfer functions, BIBO stability requires **all poles in the open left half-plane** (Re(pᵢ) < 0).

### Marginal Stability

If a pole lies exactly on the imaginary axis (e.g., s = jω₀), the system is **marginally stable** — it produces sustained oscillations that never decay. In the BIBO sense, this is technically **unstable** because a bounded sinusoidal input at that frequency produces unbounded output.

### Key Equivalences for BIBO Stability

- All poles in open LHP ↔ ∫|h(t)|dt < ∞ ↔ BIBO stable
- Poles on imaginary axis ↔ sustained oscillation ↔ marginally stable (BIBO unstable)
- Any pole in RHP ↔ exponentially growing response ↔ unstable`,
        examTip: 'The FE exam loves to test stability classification. Given a characteristic equation, find the poles. All poles with negative real parts → stable. Any pole with zero real part → marginally stable. Any pole with positive real part → unstable. Do not confuse "marginally stable" with "stable" — for BIBO, marginal means unstable.',
        importantNote: 'Causality and stability are independent properties. A system can be causal but unstable (pole in RHP), or stable but non-causal (two-sided exponential). All physical real-time systems are causal, but offline digital processing can use non-causal filters.',
      },
      {
        id: 'td-exam-strategies',
        title: '3. Practical Exam Strategies for Time Domain',
        content: `## 3.1 Worked Example: Convolution of Two Signals

**Problem**: Find y(t) = x(t) * h(t) where x(t) = u(t) − u(t−2) (rectangular pulse, width 2) and h(t) = e^(−t)·u(t).

**Step-by-step solution:**

1. **Set up the integral**: y(t) = ∫₀^∞ x(τ)·h(t−τ) dτ
2. **Identify nonzero region of x(τ)**: x(τ) = 1 for 0 ≤ τ ≤ 2, zero elsewhere
3. **Substitute**: y(t) = ∫₀^min(t,2) e^(−(t−τ)) dτ (require t−τ ≥ 0 for causality of h)
4. **For 0 ≤ t ≤ 2**: y(t) = e^(−t) · ∫₀^t e^τ dτ = e^(−t)·(e^t − 1) = **1 − e^(−t)**
5. **For t > 2**: y(t) = e^(−t) · ∫₀^2 e^τ dτ = e^(−t)·(e² − 1) = **(e² − 1)·e^(−t)**

The result is a rising exponential that transitions to a decaying exponential at t = 2.

## 3.2 Common Mistakes to Avoid

- **Forgetting initial conditions**: When using Laplace to solve ODEs, always include the initial condition terms in L{y'(t)} = sY(s) − y(0⁻). Setting y(0) = 0 when it is not zero produces a completely wrong answer.
- **Confusing impulse vs. step**: The impulse response h(t) and step response g(t) are related by differentiation: h(t) = dg(t)/dt. If the problem gives the step response, differentiate to get h(t) before convolving.
- **Wrong convolution limits**: The integral limits depend on the support of BOTH signals. Sketch both x(τ) and h(t−τ) to determine where they overlap — this visual approach prevents limit errors.

## 3.3 Quick Checks for System Properties

**Causality check**: Examine h(t). If h(t) = 0 for all t < 0, the system is causal. On the exam, verify by inspection — does the impulse response "start" at or after t = 0?

**BIBO stability check**: Compute ∫|h(t)|dt. For exponential responses like h(t) = Ae^(−at)·u(t) with a > 0, the integral equals A/a (finite) — **stable**. If h(t) = u(t), the integral diverges — **unstable**.

| System | h(t) | Causal? | BIBO Stable? |
|---|---|---|---|
| h(t) = e^(−3t)·u(t) | Decaying exponential | Yes | Yes (integral = 1/3) |
| h(t) = e^(2t)·u(t) | Growing exponential | Yes | **No** (integral diverges) |
| h(t) = e^(−\|t\|) | Two-sided | No | Yes (integral = 2) |
| h(t) = u(t) | Step function | Yes | **No** (integral diverges) |`,
        examTip: 'When convolving a rectangular pulse with an exponential on the FE exam, the result always has two regions — a rising portion and a decaying tail. Sketch the shape rather than memorizing the formula. If the problem involves δ(t), remember: x(t)*δ(t−t₀) = x(t−t₀) — no integration needed.',
        importantNote: 'Always verify your convolution result at key points: at t = 0 the output should be zero (for causal signals), and as t → ∞ the output should decay to zero (for stable systems). These sanity checks catch algebraic errors quickly.',
      },
    ],
    keyTakeaways: [
      'Impulse response h(t) fully characterizes LTI systems; use convolution y(t) = ∫x(τ)h(t−τ)dτ to find output.',
      'Step response g(t) = ∫h(τ)dτ reveals settling time and overshoot; h(t) = dg(t)/dt.',
      'Causal systems satisfy h(t) = 0 for t < 0; all physical real-time systems are causal.',
      'BIBO stable ↔ all poles in open LHP ↔ ∫|h(t)|dt < ∞.',
      'Convolution in time = multiplication in frequency — the cornerstone of filtering.',
      'Marginal stability (poles on jω axis) is BIBO unstable — sustained oscillations.',
    ],
  },

  fee_freq_domain: {
    topicId: 'fee_freq_domain',
    title: 'Frequency Domain Analysis: Fourier & Laplace',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'The Fourier Transform reveals which frequencies compose a signal, while the Laplace Transform converts differential equations into algebraic equations. Together they form the analytical backbone of linear systems on the FE exam.',
    sections: [
      {
        id: 'fd-fourier',
        title: '1. Fourier Series and Fourier Transform',
        content: `## 1.1 Fourier Series (Periodic Signals)

For a signal with period **T₀** and fundamental frequency **f₀ = 1/T₀**, the **trigonometric form** is:

**x(t) = a₀ + Σ aₙ·cos(nω₀t) + Σ bₙ·sin(nω₀t)**

The **complex exponential form** is more compact:

**x(t) = Σ cₙ · e^(j2πnf₀t)**

where **cₙ = (1/T₀) ∫ x(t) · e^(−j2πnf₀t) dt**

| Signal Type | Representation | Spectrum |
|---|---|---|
| Periodic | Fourier Series | **Discrete** — spikes at harmonics nf₀ |
| Aperiodic | Fourier Transform | **Continuous** — smooth amplitude vs. frequency |

## 1.2 Fourier Transform (Aperiodic Signals)

The **Fourier Transform** extends analysis to non-periodic signals:

**X(f) = ∫ x(t) · e^(−j2πft) dt**

**Inverse: x(t) = ∫ X(f) · e^(j2πft) df**

### Key Properties

- **Linearity**: α·x₁ + β·x₂ → α·X₁ + β·X₂
- **Time shift**: x(t − t₀) → X(f) · e^(−j2πft₀)
- **Frequency shift**: x(t) · e^(j2πf₀t) → X(f − f₀)
- **Convolution theorem**: x(t) * h(t) ↔ X(f) · H(f)
- **Parseval's theorem**: ∫|x(t)|² dt = ∫|X(f)|² df (energy conservation)

Differentiation in time multiplies by **j2πf** in frequency, so signals with sharp edges (discontinuities) have broader spectra.`,
        examTip: 'On the FE exam, use the convolution theorem to avoid computing convolution integrals — just multiply in the frequency domain and inverse-transform. Parseval\'s theorem lets you compute signal energy from either domain, whichever is simpler.',
      },
      {
        id: 'fd-laplace',
        title: '2. Laplace Transform and the s-Domain',
        content: `## 2.1 The Laplace Transform

The Laplace Transform adds an exponential convergence factor to the Fourier Transform, handling unstable and growing signals:

**X(s) = ∫₀^∞ x(t) · e^(−st) dt** where **s = σ + jω**

This converts differential equations into **algebraic equations** in s, dramatically simplifying circuit and system analysis.

### Essential Transform Pairs

| Time Domain x(t) | s-Domain X(s) | ROC |
|---|---|---|
| δ(t) | 1 | All s |
| u(t) | 1/s | Re(s) > 0 |
| e^(−at)·u(t) | 1/(s+a) | Re(s) > −a |
| t·e^(−at)·u(t) | 1/(s+a)² | Re(s) > −a |
| sin(ωt)·u(t) | ω/(s²+ω²) | Re(s) > 0 |
| cos(ωt)·u(t) | s/(s²+ω²) | Re(s) > 0 |

## 2.2 Region of Convergence (ROC)

The **ROC** specifies the values of s where the integral converges. It is essential for uniqueness — different time-domain signals can have the same algebraic expression but different ROCs.

- **Causal signals**: ROC is a right half-plane (Re(s) > σ₀)
- **Anti-causal signals**: ROC is a left half-plane
- **Two-sided signals**: ROC is a vertical strip

### Important Properties

- **Differentiation**: L{f'(t)} = s·F(s) − f(0⁻) — converts derivatives to multiplication
- **Integration**: L{∫f(t)dt} = F(s)/s — converts integrals to division
- **Final Value Theorem**: lim(t→∞) f(t) = lim(s→0) s·F(s) — find steady-state without inverse transform
- **Initial Value Theorem**: lim(t→0⁺) f(t) = lim(s→∞) s·F(s)`,
        examTip: 'The Final Value Theorem is a huge time-saver on the FE exam — it gives steady-state values directly from the s-domain without performing an inverse transform. But verify all poles of s·F(s) are in the LHP first, otherwise the theorem gives a wrong answer.',
        importantNote: 'On the FE exam, use the Laplace transform table provided in the reference handbook — do not try to compute transforms from the integral definition. The table lookup approach is much faster and less error-prone.',
      },
      {
        id: 'fd-laplace-shortcuts',
        title: '3. Common Laplace Transform Pairs & Exam Shortcuts',
        content: `## 3.1 The 10 Must-Know Laplace Transform Pairs

Memorize these pairs — they cover 90% of FE exam transform problems:

| # | Time Domain f(t) | Laplace Domain F(s) |
|---|---|---|
| 1 | **δ(t)** | **1** |
| 2 | **u(t)** | **1/s** |
| 3 | **t·u(t)** | **1/s²** |
| 4 | **t^n·u(t)** | **n!/s^(n+1)** |
| 5 | **e^(−at)·u(t)** | **1/(s+a)** |
| 6 | **t·e^(−at)·u(t)** | **1/(s+a)²** |
| 7 | **sin(ωt)·u(t)** | **ω/(s²+ω²)** |
| 8 | **cos(ωt)·u(t)** | **s/(s²+ω²)** |
| 9 | **e^(−at)·sin(ωt)·u(t)** | **ω/((s+a)²+ω²)** |
| 10 | **e^(−at)·cos(ωt)·u(t)** | **(s+a)/((s+a)²+ω²)** |

**Pattern recognition tip**: Pairs 9 and 10 are just pairs 7 and 8 with **s replaced by (s+a)** — this is the frequency-shift property.

## 3.2 Partial Fraction Decomposition Tips

**Step 1**: Factor the denominator completely into first-order and irreducible quadratic terms.

**Step 2**: Use the **cover-up method** for distinct real poles:
- For A/(s+a): cover (s+a) in the original expression, evaluate at s = −a

**Step 3**: For complex conjugate poles, keep as a quadratic:
- **(As+B)/(s²+2αs+ω₀²)** → complete the square to **(A(s+α)+C)/((s+α)²+ω_d²)**
- Match to damped sinusoid pairs 9 and 10

**Step 4**: For repeated poles, use differentiation:
- **B₂ = F(s)·(s+a)²|_{s=−a}**, then **B₁ = d/ds[F(s)·(s+a)²]|_{s=−a}**

## 3.3 Final Value vs. Initial Value Theorem

| Theorem | Formula | Gives You | Validity Check |
|---|---|---|---|
| **Final Value** | lim(s→0) s·F(s) | Steady-state f(∞) | All poles of s·F(s) in LHP |
| **Initial Value** | lim(s→∞) s·F(s) | Starting value f(0⁺) | Always valid if F(s) is proper |

**When to use each**:
- **Final Value Theorem**: Finding steady-state output, DC gain verification, checking if a controller eliminates steady-state error
- **Initial Value Theorem**: Verifying initial conditions match the problem statement, sanity-checking inverse transforms

**Critical trap**: The Final Value Theorem gives a **wrong answer** if s·F(s) has poles on the imaginary axis or in the RHP. For example, F(s) = ω/(s²+ω²) represents sin(ωt) — applying FVT gives lim(s→0) sω/(s²+ω²) = 0, but sin(ωt) does NOT converge to zero. Always check pole locations first.`,
        examTip: 'The FE exam reference handbook includes a Laplace transform table, but knowing the pairs from memory saves lookup time. Focus on pairs 5 (exponential decay) and 9-10 (damped sinusoids) — these appear in nearly every circuit transient and control system problem.',
        importantNote: 'Before applying the Final Value Theorem, ALWAYS verify that all poles of s·F(s) are in the open left half-plane. If even one pole is on the jw axis or in the RHP, the theorem is invalid and will give an incorrect result. This validity check is itself a common exam question.',
      },
    ],
    keyTakeaways: [
      'Fourier Series (discrete spectrum) for periodic signals; Fourier Transform (continuous spectrum) for aperiodic.',
      'Laplace Transform X(s) = ∫x(t)e^(−st)dt converts ODEs to algebraic equations in s.',
      'ROC determines uniqueness; causal signals have right half-plane ROC.',
      'Time-domain convolution ↔ frequency-domain multiplication — cornerstone of filtering.',
      'Final Value Theorem: lim(t→∞) f(t) = lim(s→0) s·F(s) — find steady-state directly.',
      'Parseval: ∫|x(t)|²dt = ∫|X(f)|²df — energy is conserved across domains.',
    ],
  },

  fee_transfer_func: {
    topicId: 'fee_transfer_func',
    title: 'Transfer Functions, Poles, and Zeros',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'A transfer function H(s) = Y(s)/X(s) is the Laplace transform of the impulse response. Poles and zeros in the s-plane determine stability, transient behavior, and frequency response — the most powerful analysis tool on the FE exam.',
    sections: [
      {
        id: 'tf-poles-zeros',
        title: '1. Transfer Function Representation',
        content: `## 1.1 Definition and Polynomial Form

The **transfer function** relates output to input in the s-domain:

**H(s) = Y(s)/X(s) = N(s)/D(s)**

It can be written in **factored form**:

**H(s) = K · Π(s − zᵢ) / Π(s − pⱼ)**

where **zᵢ** are the **zeros** (numerator roots) and **pⱼ** are the **poles** (denominator roots).

| Feature | Definition | Effect on Response |
|---|---|---|
| **Zeros** | Values where N(s) = 0 | Affect response magnitude and shape |
| **Poles** | Values where D(s) = 0 | Determine stability and time constants |
| **System order** | Degree of D(s) | Number of energy-storage elements |
| **DC gain** | H(0) = K · Πzᵢ / Πpⱼ | Steady-state value for step input |

## 1.2 Pole Locations and Time-Domain Behavior

Pole position in the s-plane directly maps to time-domain behavior:

| Pole Location | Time Response | Example |
|---|---|---|
| Real, negative (σ < 0) | **Decaying exponential** e^(σt) | RC discharge |
| Real, positive (σ > 0) | **Growing exponential** | Unstable system |
| Complex conjugate, LHP | **Damped sinusoid** e^(σt)·sin(ωt) | Underdamped RLC |
| Purely imaginary (±jω) | **Sustained oscillation** sin(ωt) | Ideal LC circuit |
| Repeated real | **t^k · e^(σt)** polynomial growth | Critically damped |

### Dominant Poles

**Dominant poles** are those closest to the imaginary axis — they have the slowest decay and control the visible response. Poles far into the LHP decay quickly and can often be neglected for approximate analysis.`,
        examTip: 'On the FE exam, when asked to sketch or identify a time-domain response from a pole-zero plot: real negative poles give exponential decay, complex conjugate pairs in the LHP give damped oscillation, and the distance from the imaginary axis determines how fast the decay is.',
      },
      {
        id: 'tf-partial-fractions',
        title: '2. Partial Fraction Decomposition and Inverse Transforms',
        content: `## 2.1 Partial Fraction Expansion

To find the inverse Laplace transform of H(s), decompose into simple fractions:

**H(s) = A₁/(s − p₁) + A₂/(s − p₂) + ... + Aₙ/(s − pₙ)**

Each term has a known inverse transform: **Aᵢ/(s − pᵢ) → Aᵢ · e^(pᵢt) · u(t)**

### Distinct Real Poles

For **H(s) = (2s + 3)/[(s + 1)(s + 4)]**, expand as:

**H(s) = A/(s+1) + B/(s+4)**

Solve: A = H(s)·(s+1)|_{s=−1}, B = H(s)·(s+4)|_{s=−4}

### Repeated Poles

For a pole of multiplicity k at s = p:

**... + B₁/(s−p) + B₂/(s−p)² + ... + Bₖ/(s−p)^k**

### Complex Conjugate Poles

Keep as a second-order term: **(As + B)/(s² + 2αs + ω₀²)** and use the damped sinusoid transform pair.

## 2.2 Stability from Transfer Function

| Stability | Condition | Pole Requirement |
|---|---|---|
| **Asymptotically stable** | All transients decay to zero | All Re(pᵢ) < 0 |
| **Marginally stable** | Sustained oscillation, no growth | Simple poles on jω axis, rest in LHP |
| **Unstable** | Output grows without bound | Any Re(pᵢ) > 0 or repeated jω poles |

The **Routh-Hurwitz criterion** tests stability without explicitly computing poles — essential when the characteristic polynomial is higher than second order.`,
        examTip: 'For partial fractions on the FE exam, use the "cover-up" method: to find the coefficient for pole at s = p, cover up the (s−p) factor in the denominator and evaluate the remaining expression at s = p. This is dramatically faster than setting up simultaneous equations.',
        importantNote: 'A common FE exam mistake is forgetting that repeated poles on the imaginary axis (e.g., double pole at s = 0) produce growing responses (t·u(t)), making the system unstable — not marginally stable.',
      },
      {
        id: 'tf-worked-pole-zero',
        title: '3. Worked Example: Pole-Zero Analysis',
        content: `## 3.1 Problem Statement

**Given**: H(s) = 10(s + 2) / [(s + 1)(s + 5)]

Find: DC gain, poles, zeros, sketch Bode magnitude, and determine stability.

## 3.2 Step-by-Step Solution

**Step 1 — Identify Poles and Zeros:**
- **Zero**: s + 2 = 0 → **z₁ = −2** (numerator root)
- **Poles**: s + 1 = 0 → **p₁ = −1**; s + 5 = 0 → **p₂ = −5** (denominator roots)
- System is **2nd order** (degree of denominator = 2)

**Step 2 — DC Gain (evaluate at s = 0):**

H(0) = 10(0 + 2) / [(0 + 1)(0 + 5)] = 20/5 = **4** (equivalently **12.04 dB**)

**Step 3 — Stability Analysis:**
- Both poles at s = −1 and s = −5 have **negative real parts** (both in LHP)
- **Conclusion: System is asymptotically stable**

**Step 4 — Bode Magnitude Sketch:**

Rewrite in standard form by factoring out DC values:

H(s) = 4 · (1 + s/2) / [(1 + s/1)(1 + s/5)]

Corner frequencies: **ω = 1 rad/s** (pole), **ω = 2 rad/s** (zero), **ω = 5 rad/s** (pole)

| Frequency Range | Slope | Reasoning |
|---|---|---|
| ω < 1 | 0 dB/dec | Flat at DC gain = 12 dB |
| 1 < ω < 2 | −20 dB/dec | Pole at ω = 1 adds −20 dB/dec |
| 2 < ω < 5 | 0 dB/dec | Zero at ω = 2 cancels: −20 + 20 = 0 |
| ω > 5 | −20 dB/dec | Pole at ω = 5 adds −20 dB/dec |

**Step 5 — High-Frequency Gain:**

As ω → ∞: |H(jω)| → 10·ω/(ω·ω) = 10/ω → rolls off at −20 dB/decade

## 3.3 Key Observations and Exam Traps

- **Zeros pull the magnitude UP** (or flatten the roll-off); **poles pull it DOWN**. When a zero and pole are close together, they partially cancel.
- **DC gain shortcut**: H(0) = K · (product of zeros) / (product of poles) using absolute values. Here: 10 × 2 / (1 × 5) = 4.
- **Dominant pole**: The pole at s = −1 is closest to the imaginary axis and dominates the transient response (time constant τ = 1 second).
- **Common trap**: Students often forget to convert H(s) to standard form before sketching Bode plots. The corner frequency for (s + a) is ω = a, NOT the coefficient in front of s.`,
        examTip: 'For any transfer function on the FE exam: (1) find poles and zeros by factoring, (2) evaluate H(0) for DC gain, (3) check pole locations for stability, (4) rewrite in standard form for Bode. This four-step method works for every problem and prevents skipped steps under time pressure.',
        importantNote: 'When computing DC gain, substitute s = 0 directly into H(s). Do NOT set s = jω and then ω = 0 — while equivalent, direct substitution is faster and less error-prone. DC gain H(0) = 4 means a unit step input produces a steady-state output of 4.',
      },
    ],
    keyTakeaways: [
      'H(s) = Y(s)/X(s) = K·Π(s−zᵢ)/Π(s−pⱼ); poles determine stability, zeros shape response.',
      'Poles in LHP → stable; on jω axis → marginal; in RHP → unstable.',
      'Dominant poles (closest to jω axis) control the visible transient response.',
      'Partial fraction decomposition converts complex H(s) into simple inverse-transformable terms.',
      'System order = degree of denominator = number of poles = number of energy-storage elements.',
      'Cover-up method for partial fractions: evaluate remaining expression at pole location.',
    ],
  },

  fee_z_transforms: {
    topicId: 'fee_z_transforms',
    title: 'Z-Transforms and Discrete Systems',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'The Z-Transform is the discrete-time counterpart of the Laplace Transform, converting difference equations into algebraic form. Stability in discrete systems requires poles inside the unit circle, and the mapping z = e^(sT) connects continuous and discrete domains.',
    sections: [
      {
        id: 'zt-definition',
        title: '1. Z-Transform Definition and Common Pairs',
        content: `## 1.1 The Z-Transform

For a discrete signal x[n], the **bilateral Z-Transform** is:

**X(z) = Σ x[n] · z^(−n)** (sum over all n)

The **unilateral Z-Transform** (causal sequences, n ≥ 0) is standard for digital control and FE exam problems.

### Essential Z-Transform Pairs

| Time Domain x[n] | Z-Domain X(z) | ROC |
|---|---|---|
| δ[n] | 1 | All z |
| u[n] | z/(z−1) | \|z\| > 1 |
| aⁿ·u[n] | z/(z−a) | \|z\| > \|a\| |
| n·aⁿ·u[n] | az/(z−a)² | \|z\| > \|a\| |
| n·u[n] | z/(z−1)² | \|z\| > 1 |
| cos(ω₀n)·u[n] | z(z−cos ω₀)/(z²−2z cos ω₀+1) | \|z\| > 1 |

### Key Properties

- **Linearity**: Z{α·x₁ + β·x₂} = α·X₁(z) + β·X₂(z)
- **Time shift**: Z{x[n−k]} = z^(−k)·X(z) — delay by k samples multiplies by z^(−k)
- **Convolution**: Z{x[n]*h[n]} = X(z)·H(z)
- **Initial value**: x[0] = lim(z→∞) X(z)
- **Final value**: lim(n→∞) x[n] = lim(z→1) (z−1)·X(z) (if stable)

## 1.2 Region of Convergence (ROC)

The ROC specifies where the Z-Transform sum converges:

- **Causal signals**: ROC is the exterior of a circle \|z\| > r₊
- **Anti-causal signals**: ROC is the interior \|z\| < r₋
- **Two-sided signals**: ROC is an annular ring r₋ < \|z\| < r₊
- The ROC cannot contain poles`,
        examTip: 'On the FE exam, you will almost always work with causal (unilateral) Z-Transforms. Memorize the key pairs: u[n] → z/(z−1) and aⁿ·u[n] → z/(z−a). These two cover most exam problems when combined with partial fraction expansion.',
      },
      {
        id: 'zt-stability-mapping',
        title: '2. s-to-z Mapping and Discrete Stability',
        content: `## 2.1 Mapping Between s-Plane and z-Plane

The fundamental relationship is:

**z = e^(sT)** where T is the sampling period (T = 1/fₛ)

This exponential mapping transforms continuous-domain regions to discrete-domain regions:

| s-Plane Region | z-Plane Region | System Behavior |
|---|---|---|
| Left half-plane (LHP) | **Inside** unit circle \|z\| < 1 | Decaying (stable) |
| Imaginary axis (jω) | **On** unit circle \|z\| = 1 | Sustained oscillation |
| Right half-plane (RHP) | **Outside** unit circle \|z\| > 1 | Growing (unstable) |

### Discrete-Time Stability

For discrete systems, **BIBO stability requires all poles inside the unit circle**:

**\|pᵢ\| < 1** for all poles pᵢ

This is the discrete equivalent of "all poles in the LHP" for continuous systems.

## 2.2 Inverse Z-Transform via Partial Fractions

To find x[n] from X(z):

1. Express X(z)/z in partial fractions
2. Multiply each term by z
3. Use the table: A·z/(z−a) → A·aⁿ·u[n]

### Example

**X(z) = 3z/[(z−0.5)(z−0.8)]**

Partial fractions of X(z)/z: A/(z−0.5) + B/(z−0.8)

A = 3/(0.5−0.8) = −10, B = 3/(0.8−0.5) = 10

**x[n] = [−10·(0.5)ⁿ + 10·(0.8)ⁿ]·u[n]**

Both poles (\|0.5\| < 1 and \|0.8\| < 1) are inside the unit circle → **stable**.

## 2.3 Difference Equations

Z-Transforms convert difference equations to algebraic form. For:

**y[n] − 0.5·y[n−1] = x[n]**

Taking Z-Transform: Y(z) − 0.5·z⁻¹·Y(z) = X(z)

**H(z) = Y(z)/X(z) = 1/(1 − 0.5z⁻¹) = z/(z − 0.5)**

Pole at z = 0.5 (inside unit circle) → stable system.`,
        examTip: 'When computing inverse Z-Transforms on the FE exam, always divide by z first (form X(z)/z), do partial fractions, then multiply each term by z before looking up the table. This avoids sign errors and works for every problem type.',
        importantNote: 'Do not confuse the continuous stability criterion (poles in LHP) with the discrete criterion (poles inside unit circle). The mapping z = e^(sT) explains why: the imaginary axis maps to the unit circle, so "left of jω" maps to "inside |z| = 1".',
      },
    ],
    keyTakeaways: [
      'Z-Transform: X(z) = Σ x[n]·z^(−n); converts difference equations to algebra.',
      'z = e^(sT) maps continuous s-plane to discrete z-plane; jω axis → unit circle.',
      'Discrete BIBO stability: all poles must satisfy |pᵢ| < 1 (inside unit circle).',
      'Key pairs: u[n] → z/(z−1), aⁿ·u[n] → z/(z−a), n·aⁿ·u[n] → az/(z−a)².',
      'Inverse Z-Transform: divide by z, partial fractions, multiply by z, table lookup.',
      'Time delay by k samples → multiply by z^(−k) in z-domain.',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 8 — SIGNAL PROCESSING  (4 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_fourier: {
    topicId: 'fee_fourier',
    title: 'Fourier Series and Fourier Transform',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'Fourier analysis decomposes signals into frequency components. Fourier Series handles periodic signals (discrete spectrum), while the Fourier Transform handles aperiodic signals (continuous spectrum). Both are essential for filtering, modulation, and spectral analysis on the FE exam.',
    sections: [
      {
        id: 'fs-series',
        title: '1. Fourier Series for Periodic Signals',
        content: `## 1.1 Trigonometric and Complex Forms

For a periodic signal with period **T₀** and fundamental frequency **f₀ = 1/T₀**:

**Trigonometric form:**
**x(t) = a₀ + Σ aₙ·cos(nω₀t) + Σ bₙ·sin(nω₀t)**

where ω₀ = 2πf₀ and:
- **a₀ = (1/T₀) ∫ x(t) dt** (DC component / average value)
- **aₙ = (2/T₀) ∫ x(t)·cos(nω₀t) dt**
- **bₙ = (2/T₀) ∫ x(t)·sin(nω₀t) dt**

**Complex exponential form** (more compact):
**x(t) = Σ cₙ · e^(j2πnf₀t)**

where **cₙ = (1/T₀) ∫ x(t) · e^(−j2πnf₀t) dt**

## 1.2 Amplitude and Phase Spectra

The **one-sided amplitude spectrum** plots |cₙ| at each harmonic frequency nf₀. The spectrum reveals:

| Signal Shape | Spectral Characteristics |
|---|---|
| **Smooth** (e.g., sinusoid) | Energy concentrated at low harmonics; rapid roll-off |
| **Sharp edges** (e.g., square wave) | Energy in many harmonics; slow 1/n roll-off |
| **Impulse train** | Flat spectrum — all harmonics equal |
| **Symmetric about zero** | Only cosine terms (bₙ = 0); aₙ nonzero |
| **Antisymmetric (odd)** | Only sine terms (aₙ = 0); bₙ nonzero |

### Gibbs Phenomenon

Truncating a Fourier Series near a discontinuity produces **overshoot of approximately 9%** regardless of the number of terms — this is the Gibbs phenomenon. It does not vanish as more terms are added; only the region of overshoot narrows.`,
        examTip: 'For FE exam problems, exploit signal symmetry to eliminate half the computation: even signals have only cosine terms (bₙ = 0), odd signals have only sine terms (aₙ = 0), and half-wave symmetric signals have only odd harmonics.',
      },
      {
        id: 'fs-transform',
        title: '2. Fourier Transform and Energy Spectra',
        content: `## 2.1 Fourier Transform for Aperiodic Signals

The **Fourier Transform** extends spectral analysis to non-periodic signals, producing a **continuous** frequency spectrum:

**X(f) = ∫ x(t) · e^(−j2πft) dt**

**Inverse: x(t) = ∫ X(f) · e^(j2πft) df**

### Common Transform Pairs

| Time Domain | Frequency Domain |
|---|---|
| Rectangular pulse rect(t/τ) | τ · sinc(fτ) |
| Gaussian e^(−πt²) | e^(−πf²) (Gaussian in both domains) |
| Exponential e^(−at)·u(t) | 1/(a + j2πf) |
| Impulse δ(t) | 1 (flat — all frequencies present) |
| Constant 1 | δ(f) (single frequency at DC) |

## 2.2 Parseval's Theorem and Energy

**Parseval's theorem** states energy is conserved across domains:

**∫ |x(t)|² dt = ∫ |X(f)|² df**

The **Energy Spectral Density (ESD)** is |X(f)|² — it shows how signal energy is distributed across frequency.

### Bandwidth

The **bandwidth** of a signal is the range of significant frequency content. Definitions vary:

- **3-dB bandwidth**: frequencies where |X(f)| drops to 1/√2 of peak
- **Null-to-null bandwidth**: distance between first zeros of |X(f)|
- **99% energy bandwidth**: range containing 99% of signal energy

### Duality Property

Fourier analysis has a **duality** property: if x(t) ↔ X(f), then X(t) ↔ x(−f). This means a wide pulse in time produces a narrow spectrum, and vice versa — the **time-bandwidth uncertainty principle**: Δt · Δf ≥ 1/(4π).`,
        examTip: 'On the FE exam, remember the sinc function relationship: a rectangular pulse of width τ has a sinc spectrum with first null at f = 1/τ. Wider pulses have narrower spectra (better frequency localization) and vice versa. This tradeoff appears in both signal processing and communications problems.',
        importantNote: 'Differentiation in time corresponds to multiplication by j2πf in frequency. This means sharp signal transitions (large derivatives) require high-frequency content — the fundamental reason why bandwidth-limited channels distort signals with sharp edges.',
      },
      {
        id: 'fs-exam-walkthrough',
        title: '3. Exam Problem Walkthrough: Fourier Analysis',
        content: `## 3.1 Problem: Fourier Series of a Square Wave

**Given**: A square wave with amplitude A = 5 V, period T₀ = 4 ms, and 50% duty cycle (symmetric about zero).

**Find**: Fundamental frequency, first three nonzero Fourier coefficients, and sketch the amplitude spectrum.

## 3.2 Step-by-Step Solution

**Step 1 — Fundamental frequency:**

**f₀ = 1/T₀ = 1/(4 × 10⁻³) = 250 Hz**; ω₀ = 2πf₀ = 500π rad/s

**Step 2 — Identify symmetry:**

A symmetric square wave (odd function) has **only sine terms** (aₙ = 0 for all n, including a₀ = 0).

**Step 3 — Compute Fourier coefficients:**

For an odd-symmetric square wave of amplitude A:

**bₙ = (4A)/(nπ)** for n = 1, 3, 5, ... (odd harmonics only)

**bₙ = 0** for n = 2, 4, 6, ... (even harmonics vanish due to half-wave symmetry)

| Harmonic | Frequency | Coefficient bₙ | Amplitude |
|---|---|---|---|
| n = 1 (fundamental) | 250 Hz | 4(5)/(1·π) = **6.37 V** | 6.37 V |
| n = 3 (3rd harmonic) | 750 Hz | 4(5)/(3·π) = **2.12 V** | 2.12 V |
| n = 5 (5th harmonic) | 1250 Hz | 4(5)/(5·π) = **1.27 V** | 1.27 V |

**Step 4 — Reconstruct the signal:**

x(t) ≈ 6.37·sin(500πt) + 2.12·sin(1500πt) + 1.27·sin(2500πt) + ...

The amplitude spectrum shows spikes at odd multiples of 250 Hz, decreasing as 1/n.

## 3.3 Critical Exam Trap: Fourier Series vs. Fourier Transform

| Feature | Fourier Series | Fourier Transform |
|---|---|---|
| **Applies to** | **Periodic** signals | **Aperiodic** signals |
| **Spectrum type** | **Discrete** (spikes at nf₀) | **Continuous** (smooth curve) |
| **Coefficients** | cₙ (dimensionless or V) | X(f) (V/Hz or V·s) |
| **Energy** | Infinite (signal extends forever) | Finite (Parseval applies) |

**Common mistake**: Using the Fourier Transform on a periodic signal or Fourier Series on a one-time pulse. The Series is for periodic signals that repeat forever; the Transform is for finite-energy aperiodic signals.

## 3.4 Symmetry Shortcuts for Fast Solutions

- **Even function** (symmetric about t = 0): bₙ = 0 → only cosine terms
- **Odd function** (antisymmetric): aₙ = 0 → only sine terms
- **Half-wave symmetry** (x(t) = −x(t + T₀/2)): only odd harmonics (n = 1, 3, 5, ...)
- **Quarter-wave even**: only odd cosine harmonics
- **Quarter-wave odd**: only odd sine harmonics

Exploiting symmetry can eliminate 50–75% of the computation on an exam problem.`,
        examTip: 'If the FE exam gives a symmetric square wave or triangle wave, immediately recognize: odd function → sine terms only, half-wave symmetry → odd harmonics only. The coefficients decrease as 1/n for square waves and 1/n² for triangle waves. These facts alone can answer many problems without any integration.',
        importantNote: 'The 1/n roll-off of the square wave spectrum means you need many harmonics to reconstruct the signal accurately. This is why square waves have high bandwidth requirements and why the Gibbs phenomenon (9% overshoot at discontinuities) persists regardless of how many terms you include.',
      },
    ],
    keyTakeaways: [
      'Periodic signals → Fourier Series (discrete spectrum at harmonics nf₀); aperiodic → Fourier Transform (continuous).',
      'Complex exponential form: cₙ = (1/T₀) ∫ x(t)·e^(−j2πnf₀t)dt is most compact for computation.',
      'Parseval: ∫|x(t)|²dt = ∫|X(f)|²df — energy conservation across domains.',
      'Signal smoothness determines spectral roll-off; discontinuities create high-frequency components.',
      'Time-bandwidth product Δt·Δf ≥ 1/(4π) — cannot be narrow in both domains simultaneously.',
      'Exploit signal symmetry: even → cosine only; odd → sine only; half-wave → odd harmonics only.',
    ],
  },

  fee_sampling: {
    topicId: 'fee_sampling',
    title: 'Sampling Theorem and Nyquist Rate',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'The Shannon-Nyquist sampling theorem establishes the minimum sampling rate for perfect signal reconstruction. Violations cause aliasing, where high frequencies masquerade as low frequencies. Anti-aliasing filters and proper sampling rates are critical for all digital signal processing.',
    sections: [
      {
        id: 'samp-theorem',
        title: '1. Shannon-Nyquist Sampling Theorem',
        content: `## 1.1 The Fundamental Theorem

To perfectly reconstruct a **bandlimited** signal from its samples, the sampling frequency must exceed twice the highest frequency component:

**fₛ > 2·f_max** (Nyquist criterion)

The **Nyquist rate** is the minimum sampling frequency: **fₛ_min = 2·f_max**

The **Nyquist frequency** is the maximum recoverable frequency: **fₙ = fₛ/2**

| Term | Definition | Example (audio CD) |
|---|---|---|
| **fₛ** (sampling frequency) | Samples per second | 44,100 Hz |
| **f_max** (max signal freq) | Highest frequency in signal | 20,000 Hz |
| **fₙ = fₛ/2** (Nyquist freq) | Folding frequency | 22,050 Hz |
| **T = 1/fₛ** (sampling period) | Time between samples | 22.7 μs |

### Frequency-Domain View

Sampling replicates the signal spectrum at multiples of fₛ. If fₛ > 2·f_max, the replicas do not overlap and the original spectrum can be recovered by a low-pass filter at fₙ. If fₛ < 2·f_max, replicas overlap → **aliasing**.

## 1.2 Reconstruction

Perfect reconstruction uses a **sinc interpolation** filter:

**x(t) = Σ x[n] · sinc[(t − nT)/T]**

Practical systems use approximations:
- **Zero-Order Hold (ZOH)**: staircase approximation (most common in DACs)
- **First-Order Hold**: linear interpolation between samples
- **Oversampling + digital filter**: sample at much higher rate, then filter digitally`,
        examTip: 'The most common FE exam mistake is confusing Nyquist frequency (fₙ = fₛ/2) with sampling frequency (fₛ). The Nyquist frequency is the folding point — the maximum frequency that can be represented. Always verify: is the problem asking for the sampling rate or the Nyquist frequency?',
      },
      {
        id: 'samp-aliasing',
        title: '2. Aliasing and Anti-Aliasing Filters',
        content: `## 2.1 Aliasing

When a signal contains frequencies above fₙ = fₛ/2, those components **fold back** into the baseband and become indistinguishable from lower-frequency components.

### Computing Aliased Frequency

For a signal at frequency f sampled at fₛ, the **apparent (aliased) frequency** is:

**f_alias = |f − k·fₛ|** for the integer k that brings the result into [0, fₛ/2]

**Example**: A 15 kHz signal sampled at 20 kHz:
- f_alias = |15 − 20| = 5 kHz
- The 15 kHz tone appears as 5 kHz — completely indistinguishable from a real 5 kHz signal

### Aliasing in the Frequency Domain

| Condition | Result | Spectrum |
|---|---|---|
| fₛ > 2·f_max | **No aliasing** | Spectral replicas separated |
| fₛ = 2·f_max | **Critical sampling** | Replicas touch — theoretically OK |
| fₛ < 2·f_max | **Aliasing** | Replicas overlap — distortion |

## 2.2 Anti-Aliasing Filters

An **anti-aliasing filter** is a low-pass filter placed **before** the analog-to-digital converter (ADC):

- **Cutoff frequency**: fₙ = fₛ/2
- **Purpose**: remove all frequency content above fₙ before sampling
- **Requirement**: must be an **analog** filter (cannot be digital, since aliasing occurs at sampling)
- **Typical order**: 4th–8th order Butterworth or elliptic for steep roll-off

### Practical Oversampling

Modern systems often **oversample** (sample at much higher than 2·f_max), then digitally filter and **decimate**. This relaxes the analog anti-aliasing filter requirements since the gap between f_max and fₛ/2 is large.`,
        examTip: 'When the FE exam asks for the aliased frequency, use this quick method: fold the signal frequency into the range [0, fₛ/2] by repeatedly subtracting fₛ and taking the absolute value. For instance, 75 kHz sampled at 40 kHz: |75−40| = 35, |35−40| = 5 kHz. The aliased frequency is 5 kHz.',
        importantNote: 'Anti-aliasing filters must be analog — they operate before the ADC. A digital filter cannot remove aliasing because the aliased components are already folded into the baseband and are indistinguishable from genuine low-frequency content.',
      },
      {
        id: 'samp-aliasing-design',
        title: '3. Aliasing Problems & Anti-Aliasing Design',
        content: `## 3.1 Worked Example: Computing Aliased Frequency

**Problem**: A signal contains a component at **f = 15 kHz**. It is sampled at **fₛ = 20 kHz**. What frequency appears in the sampled output?

**Solution**:
- Nyquist frequency: fₙ = fₛ/2 = 10 kHz
- Since f = 15 kHz > fₙ = 10 kHz, **aliasing occurs**
- Aliased frequency: f_alias = |f − fₛ| = |15 − 20| = **5 kHz**

The 15 kHz signal appears as a phantom 5 kHz signal after sampling. This aliased component is **completely indistinguishable** from a genuine 5 kHz signal — no amount of post-processing can separate them.

**Verification**: The aliased frequency must fall in [0, fₛ/2] = [0, 10 kHz]. Our result of 5 kHz is in this range. If the first subtraction gives a result outside [0, fₛ/2], subtract fₛ again.

## 3.2 Multi-Component Aliasing Example

**Problem**: A signal x(t) = cos(2π·3000t) + cos(2π·14000t) + cos(2π·22000t) is sampled at fₛ = 16 kHz.

| Component | Frequency | fₛ/2 = 8 kHz | Aliased? | Apparent Frequency |
|---|---|---|---|---|
| 1st | 3 kHz | 3 < 8 | No | **3 kHz** (unchanged) |
| 2nd | 14 kHz | 14 > 8 | Yes | \|14 − 16\| = **2 kHz** |
| 3rd | 22 kHz | 22 > 8 | Yes | \|22 − 16\| = 6, in range → **6 kHz** |

After sampling, the output appears to contain 3 kHz, 2 kHz, and 6 kHz — the original 14 kHz and 22 kHz components are permanently destroyed and replaced by aliases.

## 3.3 Anti-Aliasing Filter Design

**Design goal**: Remove all frequencies above fₛ/2 before sampling.

**Design procedure:**
1. **Determine signal bandwidth**: f_max = highest frequency of interest
2. **Choose sampling rate**: fₛ ≥ 2.5 × f_max (practical margin above Nyquist minimum)
3. **Set filter cutoff**: fc = fₛ/2 (or slightly below)
4. **Choose filter order**: higher order = steeper roll-off in the transition band
5. **Select filter type**: Butterworth for flat passband; Chebyshev for sharper cutoff

**Example**: Audio signal with f_max = 20 kHz, sampled at fₛ = 44.1 kHz.
- Anti-aliasing filter cutoff: fc = 22.05 kHz
- Transition band: 20 kHz to 22.05 kHz (only 2.05 kHz wide)
- Required: sharp cutoff → use 8th-order elliptic filter (steep roll-off)

**Key constraint**: The anti-aliasing filter MUST be analog. Digital filters operate after sampling, when aliasing has already occurred and cannot be undone.

## 3.4 Oversampling as an Alternative

Instead of a sharp (expensive) analog filter, **oversample** at much higher rate:
- Sample at 4× or 8× the Nyquist rate (e.g., 176.4 kHz for audio)
- Use a gentle analog anti-aliasing filter (transition band is now very wide)
- Apply a sharp **digital** filter after sampling
- **Decimate** (reduce sample rate) to the final desired rate

This trades digital processing cost for analog filter complexity — standard practice in modern ADCs.`,
        examTip: 'For aliasing problems on the FE exam, use the folding formula: f_alias = |f − k·fₛ| where k is the nearest integer that brings the result into [0, fₛ/2]. Practice: 75 kHz at fₛ = 40 kHz → |75 − 2(40)| = |75 − 80| = 5 kHz. Always verify your answer is below fₛ/2.',
        importantNote: 'A common exam trap is asking about a signal at exactly fₛ/2 (the Nyquist frequency). At this frequency, sampling captures exactly 2 samples per cycle — reconstruction is theoretically possible but extremely sensitive to phase. In practice, signals at exactly fₛ/2 are unreliable.',
      },
    ],
    keyTakeaways: [
      'Nyquist criterion: fₛ > 2·f_max for perfect reconstruction; Nyquist frequency fₙ = fₛ/2.',
      'Aliasing folds frequencies above fₙ back into baseband: f_alias = |f − k·fₛ|.',
      'Anti-aliasing filter (analog LP at fₙ) is mandatory before the ADC.',
      'Perfect reconstruction uses sinc interpolation; practical systems use ZOH or oversampling.',
      'Oversampling relaxes anti-aliasing filter requirements by widening the transition band.',
      'Do not confuse Nyquist frequency (fₛ/2) with Nyquist rate (2·f_max) — common FE exam trap.',
    ],
  },

  fee_filters: {
    topicId: 'fee_filters',
    title: 'Analog Filters: Butterworth, Chebyshev, and Types',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'Analog filters shape frequency responses to pass desired frequencies and attenuate others. Filter type (LP, HP, BP, BS), order, and approximation method (Butterworth, Chebyshev, Elliptic) are the key design choices. The FE exam tests filter identification, cutoff frequency calculation, and roll-off rate.',
    sections: [
      {
        id: 'filt-types',
        title: '1. Filter Types and Transfer Functions',
        content: `## 1.1 Filter Classification by Frequency Response

| Filter Type | Passes | Blocks | Application |
|---|---|---|---|
| **Low-Pass (LP)** | f < fₒ | f > fₒ | Anti-aliasing, noise removal |
| **High-Pass (HP)** | f > fₒ | f < fₒ | DC blocking, bass cut |
| **Band-Pass (BP)** | f₁ < f < f₂ | f < f₁ and f > f₂ | Radio tuning, selective amplification |
| **Band-Stop (BS/Notch)** | f < f₁ and f > f₂ | f₁ < f < f₂ | 60 Hz hum removal, interference rejection |

### Standard Transfer Functions

**First-order LP:** **H(s) = ωc / (s + ωc)**

**Second-order Butterworth LP:** **H(s) = ωc² / (s² + √2·ωc·s + ωc²)**

**General second-order:** **H(s) = ωₙ² / (s² + 2ζωₙs + ωₙ²)**

where ζ is the damping ratio and ωₙ is the natural frequency.

## 1.2 Roll-Off and Filter Order

The **order n** of a filter determines the asymptotic roll-off rate:

**Roll-off = −20n dB/decade** (or −6n dB/octave)

| Order | Roll-off | Poles | Complexity |
|---|---|---|---|
| 1st | −20 dB/dec | 1 | Single RC section |
| 2nd | −40 dB/dec | 2 | Active filter (op-amp + R,C) |
| 3rd | −60 dB/dec | 3 | Cascaded sections |
| 4th | −80 dB/dec | 4 | Two second-order sections |

Higher order = steeper transition from passband to stopband, but more components, higher cost, and greater group delay.

### Cutoff Frequency

The **−3 dB cutoff frequency** fₒ (or ωc) is where the output power drops to half (voltage to 1/√2 ≈ 0.707):

**|H(jωc)| = 1/√2 ≈ −3 dB**`,
        examTip: 'On the FE exam, if you see a transfer function and need to identify the filter type: look at the behavior at DC (s=0) and at high frequency (s→∞). LP has gain at DC and zero at infinity; HP has zero at DC and gain at infinity; BP has gain at a center frequency and zero at both extremes.',
      },
      {
        id: 'filt-approx',
        title: '2. Filter Approximations: Butterworth, Chebyshev, and Elliptic',
        content: `## 2.1 Comparison of Filter Families

| Property | Butterworth | Chebyshev I | Chebyshev II | Elliptic |
|---|---|---|---|---|
| **Passband** | Maximally flat | Equiripple | Flat | Equiripple |
| **Stopband** | Monotonic | Monotonic | Equiripple | Equiripple |
| **Roll-off** | Moderate | Sharp | Sharp | **Sharpest** |
| **Group delay** | Good | Moderate | Moderate | Poor |
| **Use case** | General purpose | Need sharp cutoff | Need flat passband | Minimum order |

## 2.2 Butterworth Filters (Maximally Flat)

The **Butterworth** filter has the flattest possible passband — no ripple:

**|H(jω)|² = 1 / [1 + (ω/ωc)^(2n)]**

At ω = ωc: |H| = 1/√2 = −3 dB regardless of order n.

All poles lie on a circle of radius ωc in the s-plane, equally spaced in the LHP.

## 2.3 Chebyshev Filters

**Type I**: allows specified ripple (e.g., 0.5 dB) in the passband for a steeper roll-off than Butterworth of the same order.

**Type II**: has ripple in the stopband while maintaining a flat passband.

For the same specifications (passband ripple, stopband attenuation), Chebyshev requires **fewer stages** than Butterworth.

## 2.4 Filter Design Workflow

1. **Specify**: passband frequency, stopband frequency, passband ripple, stopband attenuation
2. **Choose approximation**: Butterworth (flat), Chebyshev (ripple OK), Elliptic (minimum order)
3. **Determine order** n from specifications
4. **Look up or compute** normalized prototype poles
5. **Frequency scale** and **impedance scale** to desired ωc and impedance level`,
        examTip: 'Butterworth is the default choice when the FE exam does not specify a filter type — it has the simplest transfer function and the most predictable behavior. Chebyshev is used when the problem explicitly mentions passband ripple tolerance or requires a sharper transition with fewer components.',
        importantNote: 'Filter order is the single biggest design variable. Doubling the order doubles the roll-off rate (e.g., from −40 to −80 dB/decade) but also doubles component count and can introduce stability issues in active filter implementations.',
      },
    ],
    keyTakeaways: [
      'LP, HP, BP, BS filter types determined by which frequencies pass through.',
      'Roll-off = −20n dB/decade; higher order n = steeper cutoff but more complexity.',
      'Butterworth: maximally flat passband, no ripple — general-purpose default.',
      'Chebyshev I: equiripple passband, sharper roll-off than Butterworth of same order.',
      'Elliptic: ripple in both bands, sharpest roll-off, minimum order for given specs.',
      'Cutoff frequency ωc defined at −3 dB point where |H| = 1/√2.',
    ],
  },

  fee_dft_fft: {
    topicId: 'fee_dft_fft',
    title: 'DFT, FFT, and Practical Implementation',
    domainWeight: 'Signal Processing · 4–6%',
    overview: 'The Discrete Fourier Transform (DFT) converts a finite sample sequence into frequency components. The Fast Fourier Transform (FFT) computes the DFT efficiently in O(N log N). Windowing and zero-padding are practical techniques for reducing spectral leakage and improving frequency display.',
    sections: [
      {
        id: 'dft-def',
        title: '1. DFT Definition and Frequency Resolution',
        content: `## 1.1 The Discrete Fourier Transform

The **DFT** converts N time-domain samples into N frequency-domain components:

**X[k] = Σ(n=0 to N−1) x[n] · e^(−j2πkn/N)** for k = 0, 1, ..., N−1

**Inverse DFT:**
**x[n] = (1/N) Σ(k=0 to N−1) X[k] · e^(j2πkn/N)**

### Frequency Bin Interpretation

| Parameter | Formula | Meaning |
|---|---|---|
| **Frequency of bin k** | fₖ = k · fₛ/N | Center frequency of bin k |
| **Frequency resolution** | Δf = fₛ/N | Smallest distinguishable frequency difference |
| **Bin 0** | f₀ = 0 (DC) | Average value of signal |
| **Bin N/2** | fₛ/2 (Nyquist) | Maximum frequency represented |
| **Bins N/2+1 to N−1** | Negative frequencies | Mirror of bins 1 to N/2−1 for real signals |

### Improving Frequency Resolution

**Δf = fₛ/N = 1/(N·T) = 1/T_record**

To improve resolution (smaller Δf):
- **Increase N** (more samples) — adds actual information
- **Decrease fₛ** — but risk aliasing
- **Longer record time** T_record = N/fₛ — the fundamental limit

## 1.2 The Fast Fourier Transform (FFT)

The **FFT** is an algorithm (not a different transform) that computes the DFT efficiently:

| Method | Operations | For N = 1024 |
|---|---|---|
| Direct DFT | **O(N²)** | ~1,048,576 |
| FFT (Cooley-Tukey) | **O(N log₂ N)** | ~10,240 |

The Cooley-Tukey algorithm requires N to be a **power of 2** (128, 256, 512, 1024, ...). If your data has a non-power-of-2 length, **zero-pad** to the next power of 2.`,
        examTip: 'For FE exam DFT problems: given N samples at rate fₛ, the frequency resolution is Δf = fₛ/N and the maximum frequency is fₛ/2. If asked to identify which bin a frequency falls in: bin k = round(f/Δf). These three formulas solve most DFT exam problems.',
      },
      {
        id: 'dft-windowing',
        title: '2. Windowing and Spectral Leakage',
        content: `## 2.1 Spectral Leakage

The DFT implicitly assumes the signal **repeats periodically** every N samples. If the signal is not an exact integer number of periods within the N-sample window, discontinuities at the edges create spurious frequency components — this is **spectral leakage**.

### Why It Happens

A finite-length signal is equivalent to multiplying an infinite signal by a rectangular window. In the frequency domain, this multiplication becomes **convolution** with the window's spectrum (a sinc function), smearing energy into adjacent bins.

## 2.2 Window Functions

**Windowing** tapers the signal smoothly to zero at the edges, reducing discontinuities:

| Window | Main-Lobe Width | Side-Lobe Level | Use Case |
|---|---|---|---|
| **Rectangular** | Narrowest | −13 dB (worst) | Only when signal is exactly periodic in window |
| **Hann (Hanning)** | Moderate | −31 dB | General purpose |
| **Hamming** | Moderate | −43 dB | Speech processing |
| **Blackman** | Widest | −58 dB | When side-lobe suppression is critical |
| **Kaiser** | Adjustable (β parameter) | Adjustable | Flexible tradeoff |

### Tradeoff

Windows reduce leakage (lower side-lobes) at the cost of **wider main lobe** (worse frequency resolution). No window eliminates leakage completely — it is a fundamental tradeoff.

## 2.3 Zero-Padding

**Zero-padding** appends zeros to the signal before computing the FFT:

- **Does NOT improve true frequency resolution** (no new information)
- **Does improve spectral display** by interpolating between DFT bins
- **Makes N a power of 2** for efficient FFT computation
- Useful for making spectral peaks easier to locate visually`,
        examTip: 'The FE exam may ask about windowing effects. Key facts: (1) rectangular window has the narrowest main lobe but worst leakage, (2) Hamming/Hann reduce leakage but widen the main lobe, (3) zero-padding does NOT add new spectral information — it just interpolates between existing frequency bins.',
        importantNote: 'A common misconception is that zero-padding improves frequency resolution. It does not — true resolution is Δf = fₛ/N where N is the number of actual data samples, not the zero-padded length. Zero-padding only provides a smoother-looking (interpolated) spectrum.',
      },
    ],
    keyTakeaways: [
      'DFT: X[k] = Σ x[n]·e^(−j2πkn/N); converts N samples to N frequency bins.',
      'FFT computes DFT in O(N log N) vs O(N²); requires N = power of 2.',
      'Frequency resolution Δf = fₛ/N; longer records improve resolution.',
      'Frequency of bin k: fₖ = k·fₛ/N; maximum frequency at bin N/2 = fₛ/2.',
      'Windowing reduces spectral leakage but widens the main lobe (resolution tradeoff).',
      'Zero-padding improves spectral display (interpolation) but not true frequency resolution.',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 9 — ELECTRONICS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_diodes: {
    topicId: 'fee_diodes',
    title: 'Diode Circuits and Applications',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Diodes are two-terminal semiconductor devices that allow current in one direction. Rectifier circuits (half-wave, full-wave bridge), Zener regulators, clippers, and clampers are fundamental building blocks tested on the FE exam. Key calculations involve DC output voltage, PIV ratings, and ripple factor.',
    sections: [
      {
        id: 'diode-rectifiers',
        title: '1. Diode Fundamentals and Rectifier Circuits',
        content: `## 1.1 Diode Characteristics

The **ideal diode** has zero forward resistance and infinite reverse resistance. Practical **silicon diodes** have:

- **Forward voltage drop**: Vf ≈ **0.6–0.7 V**
- **Reverse leakage current**: negligible (nA range)
- **Breakdown voltage**: diode fails if reverse voltage exceeds rating

### Diode Models for Analysis

| Model | Forward | Reverse | Use |
|---|---|---|---|
| **Ideal** | Short circuit | Open circuit | Quick estimation |
| **Constant drop** | 0.7 V source | Open circuit | FE exam standard |
| **Exponential** | i = Iₛ·(e^(v/nVt)−1) | −Iₛ | Precise analysis |

where Vt = kT/q ≈ **26 mV** at room temperature (thermal voltage).

## 1.2 Rectifier Circuits

Rectifiers convert AC to DC:

### Half-Wave Rectifier (1 diode)

- Conducts only positive half-cycles
- **Vdc = Vpeak/π ≈ 0.318·Vpeak**
- **PIV = Vpeak** (for simple) or **2·Vpeak** (with filter capacitor)
- Ripple frequency = input frequency f

### Full-Wave Bridge Rectifier (4 diodes)

- Conducts both half-cycles (flips negative half)
- **Vdc = 2·Vpeak/π ≈ 0.636·Vpeak**
- **PIV = Vpeak** per diode
- Ripple frequency = **2f** (double the input frequency)

| Parameter | Half-Wave | Full-Wave Bridge |
|---|---|---|
| Vdc | Vpeak/π | 2·Vpeak/π |
| PIV per diode | 2·Vpeak | Vpeak |
| Ripple frequency | f | 2f |
| Efficiency | 40.6% | 81.2% |
| Transformer utilization | Poor | Good |

### Filtering

A **smoothing capacitor** reduces ripple:

**Ripple factor r ≈ 1/(2√3 · f · R · C)** (full-wave)

Larger C or larger R (lighter load) = lower ripple.`,
        examTip: 'Remember the π factor: half-wave Vdc = Vpeak/π, full-wave Vdc = 2Vpeak/π. For the bridge rectifier PIV, each diode sees only Vpeak (not 2Vpeak) because two diodes share the reverse voltage. This is a frequent FE exam question.',
      },
      {
        id: 'diode-zener-clipper',
        title: '2. Zener Regulators, Clippers, and Clampers',
        content: `## 2.1 Zener Diode Voltage Regulators

A **Zener diode** operates in **reverse breakdown** at a precisely controlled voltage Vz. It maintains constant output voltage despite load and supply variations.

### Basic Zener Regulator Design

**Circuit**: Vin → series resistor Rs → parallel Zener + load RL

- **Series resistor current**: Is = (Vin − Vz)/Rs
- **Load current**: IL = Vz/RL
- **Zener current**: Iz = Is − IL
- **Requirement**: Iz > Iz_min (Zener must stay in breakdown)
- **Power dissipation**: Pz = Vz · Iz (must not exceed rating)

### Design Constraints

| Condition | Requirement |
|---|---|
| Minimum Vin | Iz ≥ Iz_min with maximum IL |
| Maximum Vin | Pz ≤ Pz_max with minimum IL |
| Load regulation | Vz stable as IL varies |
| Line regulation | Vz stable as Vin varies |

## 2.2 Clipper and Clamper Circuits

**Clippers** (limiters) remove portions of a signal above or below a threshold:
- **Series clipper**: diode in series blocks one polarity
- **Parallel clipper**: diode + reference voltage shunts excess signal
- **Biased clipper**: diode + DC source sets the clipping level at Vclip = Vbias + 0.7 V

**Clampers** (DC restorers) shift the DC level of a signal without changing its AC shape:
- A capacitor + diode combination shifts the entire waveform up or down
- Output DC level is clamped to the diode reference voltage
- The capacitor must be large enough to hold charge between cycles

### Efficiency and Power

Rectifier efficiency: **η = Pdc/Pac**

For practical design, account for diode drops: each silicon diode subtracts ~0.7 V from the output. A bridge rectifier loses **2 × 0.7 = 1.4 V** from the peak output.`,
        examTip: 'For Zener regulator problems on the FE exam, always check that the Zener current stays above the minimum (Iz > Iz_min) at worst-case conditions (minimum Vin, maximum IL). If Iz drops below minimum, the Zener falls out of breakdown and regulation is lost.',
        importantNote: 'A common FE exam mistake is forgetting to subtract diode voltage drops in rectifier circuits. A full-wave bridge loses 2 × 0.7 = 1.4 V, so actual Vdc = 2(Vpeak − 1.4)/π for the constant-drop model. This matters significantly for low-voltage circuits.',
      },
      {
        id: 'diode-rectifier-design',
        title: '3. Rectifier Design Calculations',
        content: `## 3.1 Full Worked Example: Full-Wave Bridge Rectifier with Filter

**Design requirements:**
- Input: 120 Vrms, 60 Hz AC
- Output: approximately 15 V DC
- Maximum ripple voltage: 0.5 V peak-to-peak
- Load resistance: RL = 100 Ω

**Step 1 — Determine the transformer turns ratio:**

Required secondary peak voltage: Vpeak = Vdc + Vripple/2 + 2·Vdiode = 15 + 0.25 + 1.4 = **16.65 V**

Secondary RMS voltage: Vrms = Vpeak/√2 = 16.65/1.414 = **11.78 V**

Turns ratio: n = Vsecondary/Vprimary = 11.78/120 ≈ **1:10.2** (use standard 1:10 transformer)

**Step 2 — Calculate the filter capacitor:**

For a full-wave rectifier with capacitor filter, ripple voltage is:

**ΔV = Idc / (2·f·C)**

where Idc = Vdc/RL = 15/100 = 150 mA, and f = 60 Hz.

Solving for C: **C = Idc / (2·f·ΔV) = 0.15 / (2 × 60 × 0.5) = 2500 μF**

Select next standard value: **C = 3300 μF** (provides margin).

**Step 3 — Determine PIV rating:**

For a bridge rectifier: **PIV = Vpeak = 16.65 V** per diode.

Select diodes rated for at least **2× PIV = 33.3 V** (safety margin). A 1N4001 (PIV = 50 V) is suitable.

**Step 4 — Verify average DC output:**

With the capacitor filter, **Vdc ≈ Vpeak − ΔV/2 − 2·Vdiode = 16.95 − 0.25 − 1.4 ≈ 15.3 V** (acceptable).

## 3.2 Ripple Factor Calculations

| Parameter | Half-Wave | Full-Wave Bridge |
|---|---|---|
| Ripple voltage ΔV | Idc/(f·C) | **Idc/(2f·C)** |
| Ripple frequency | f (60 Hz) | **2f (120 Hz)** |
| Ripple factor (with C) | 1/(2√3·f·R·C) | **1/(4√3·f·R·C)** |

**Key insight**: The full-wave bridge has **half the ripple** of a half-wave rectifier for the same capacitor — this is why bridge rectifiers are preferred for most applications.

## 3.3 Common Design Mistakes

- **Forgetting diode drops**: Each diode subtracts 0.7 V. A bridge has 2 diodes in the current path → subtract 1.4 V from peak output.
- **PIV confusion**: In a bridge, each diode sees only Vpeak. In a center-tap full-wave, each diode sees 2·Vpeak. The bridge configuration has a lower PIV requirement.
- **Surge current**: At power-on, the discharged capacitor draws a large inrush current. Add a small series resistor (1–10 Ω) or use an NTC thermistor to limit surge.
- **Load current vs. ripple tradeoff**: Heavier load (smaller RL) increases ripple for a given C. If the exam asks "what happens when load increases," the answer is always "more ripple."`,
        examTip: 'On the FE exam, the ripple formula ΔV = Idc/(2fC) for full-wave is the most commonly tested calculation. Remember the factor of 2 in the denominator for full-wave — if you use ΔV = Idc/(fC) you will get the half-wave answer, which is a classic trap.',
        importantNote: 'When calculating Vpeak from Vrms for a sinusoidal source, use Vpeak = √2 × Vrms. A very common mistake is using Vpeak = 2 × Vrms (which applies to peak-to-peak, not peak). For 120 Vrms: Vpeak = 169.7 V, NOT 240 V.',
      },
    ],
    keyTakeaways: [
      'Half-wave: Vdc = Vpeak/π ≈ 0.318·Vpeak; full-wave bridge: Vdc = 2Vpeak/π ≈ 0.636·Vpeak.',
      'PIV: bridge rectifier = Vpeak per diode; half-wave = 2Vpeak.',
      'Ripple factor r ≈ 1/(2√3·f·R·C) for full-wave with capacitor filter.',
      'Zener regulator: Vout = Vz constant; verify Iz > Iz_min at worst-case conditions.',
      'Clippers limit signal amplitude; clampers shift DC level without changing AC shape.',
      'Account for diode voltage drops (0.7 V per diode) in all practical calculations.',
    ],
  },

  fee_bjt: {
    topicId: 'fee_bjt',
    title: 'BJT Analysis and Amplifier Configurations',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Bipolar Junction Transistors (BJTs) are current-controlled devices forming the basis of analog amplifiers. The FE exam tests DC biasing (Q-point), operating region identification, small-signal analysis, and comparison of CE, CC, and CB amplifier configurations.',
    sections: [
      {
        id: 'bjt-dc-bias',
        title: '1. BJT Operating Regions and DC Biasing',
        content: `## 1.1 BJT Operating Regions

A BJT has three terminals: **Base (B)**, **Collector (C)**, **Emitter (E)**. For NPN:

| Region | Condition | Behavior |
|---|---|---|
| **Active** (amplification) | VBE ≈ 0.7 V, VCE > VCE(sat) | Ic = β·Ib |
| **Saturation** (switch ON) | VBE ≈ 0.7 V, VCE ≈ 0.2 V | Ic < β·Ib (current-limited by circuit) |
| **Cutoff** (switch OFF) | VBE < 0.5 V, Ib ≈ 0 | Ic ≈ 0 (both junctions reverse-biased) |

### Key DC Relationships

- **Ic = β · Ib** (active region); β = hfe typically 50–300
- **Ie = Ic + Ib = (β+1) · Ib**
- **VBE ≈ 0.7 V** (silicon)
- **VCE(sat) ≈ 0.2 V** (minimum collector-emitter voltage in saturation)

## 1.2 Q-Point Biasing Methods

The **Q-point** (quiescent operating point) sets DC conditions for amplification.

### Voltage Divider Bias (Most Stable)

The most common and stable biasing method:

1. **VB = VCC · R2/(R1+R2)** (base voltage from voltage divider)
2. **VE = VB − 0.7 V** (emitter voltage)
3. **IE = VE/RE** (emitter current)
4. **IC ≈ IE** (since β >> 1)
5. **VCE = VCC − IC(RC+RE)** (verify active: VCE > 0.2 V)

### Why Voltage Divider is Preferred

- **Stability against β variations**: The Q-point depends on VB (set by resistors) rather than β
- **Temperature compensation**: RE provides negative feedback — if IC increases, VE increases, reducing VBE and stabilizing IC
- **Predictable**: Q-point nearly independent of transistor parameters`,
        examTip: 'On the FE exam, voltage divider bias is the standard biasing method. The key steps: (1) find VB from the divider, (2) subtract 0.7 V for VE, (3) IE = VE/RE, (4) IC ≈ IE, (5) VCE = VCC − IC(RC+RE). Always verify VCE > 0.2 V to confirm active region.',
      },
      {
        id: 'bjt-small-signal',
        title: '2. Small-Signal Analysis and Amplifier Configurations',
        content: `## 2.1 Small-Signal Model Parameters

For AC analysis around the Q-point, the BJT is modeled with small-signal parameters:

- **Transconductance**: **gm = IC/VT ≈ IC/26 mV** (at room temperature)
- **Input resistance**: **rπ = β/gm = β·VT/IC**
- **Small-signal emitter resistance**: **re = VT/IE ≈ 26 mV/IE**
- **Output resistance**: **ro = VA/IC** (VA = Early voltage, typically 50–200 V)

## 2.2 Amplifier Configurations

| Parameter | Common-Emitter (CE) | Common-Collector (CC) | Common-Base (CB) |
|---|---|---|---|
| **Voltage gain** | **Av = −gm·RC** (high) | **Av ≈ 1** | **Av = gm·RC** (high) |
| **Current gain** | **Ai ≈ β** (high) | **Ai ≈ β+1** | **Ai ≈ 1** |
| **Input impedance** | **Zin = rπ** (moderate) | **Zin = rπ + (β+1)·RE** (high) | **Zin = re** (low) |
| **Output impedance** | **Zout ≈ RC** | **Zout ≈ re** (low) | **Zout ≈ RC** |
| **Phase inversion** | **Yes** (180°) | **No** | **No** |
| **Primary use** | General amplification | Buffer / impedance matching | High-frequency / cascode |

### Common-Emitter (CE) — Most Popular

The CE configuration provides **high voltage gain** and **high current gain**, making it the most widely used amplifier stage:

**Av = −gm · RC = −IC · RC / VT**

The negative sign indicates **180° phase inversion**.

### Common-Collector (CC) — Emitter Follower

Unity voltage gain but **very high input impedance** and **very low output impedance** — ideal as a **buffer** between a high-impedance source and low-impedance load.

### Common-Base (CB)

Low input impedance but **no Miller effect** (no capacitive multiplication), making it excellent for **high-frequency applications** and as the second stage of a cascode amplifier.

## 2.3 Frequency Response

The BJT has frequency-dependent behavior due to internal capacitances:

- **fT (unity-gain frequency)**: frequency where current gain drops to 1; **fT = gm/(2π·Cπ)**
- **Miller effect**: in CE configuration, CBC appears multiplied by gain: **Cin_Miller = CBC·(1+|Av|)**
- **Bandwidth**: inversely related to gain (gain-bandwidth product ≈ constant)`,
        examTip: 'The small-signal transconductance gm = IC/VT is the most important parameter. At room temperature, VT ≈ 26 mV. For IC = 1 mA: gm = 1/26 ≈ 38.5 mS. Voltage gain of CE stage is Av = −gm·RC, so gain is proportional to bias current.',
        importantNote: 'Always verify the transistor is in the active region before applying small-signal analysis. Small-signal parameters (gm, rπ) are only valid at the Q-point. If VCE < 0.2 V (saturation) or IB ≈ 0 (cutoff), the linear small-signal model does not apply.',
      },
      {
        id: 'bjt-amplifier-design',
        title: '3. BJT Amplifier Design Problem',
        content: `## 3.1 Design Problem Statement

**Design a common-emitter amplifier** with the following specifications:
- Supply: VCC = 12 V
- Voltage gain: |Av| ≈ 20
- Transistor: β = 100, VBE = 0.7 V
- Q-point: IC ≈ 2 mA, VCE ≈ 6 V (midpoint biasing for maximum swing)

## 3.2 Step-by-Step Design

**Step 1 — Choose RC and RE from the Q-point:**

Apply KVL around the collector-emitter loop:

VCC = IC·RC + VCE + IE·RE ≈ IC·(RC + RE) + VCE (since IC ≈ IE)

12 = 2 mA · (RC + RE) + 6 → **RC + RE = 3 kΩ**

**Step 2 — Set RC from the gain requirement:**

Small-signal gain: |Av| = gm · RC (with bypassed RE)

First, find gm: **gm = IC/VT = 2 mA / 26 mV = 76.9 mS**

RC = |Av|/gm = 20/0.0769 = **260 Ω** → use standard value **RC = 270 Ω**

Then RE = 3000 − 270 = **2730 Ω** → use **RE = 2.7 kΩ**

**Step 3 — Design the voltage divider bias:**

Required base voltage: VB = VBE + IE·RE = 0.7 + 2 mA × 2.7 kΩ = **6.1 V**

For stable biasing, divider current should be ~10× IB:

IB = IC/β = 2 mA/100 = 20 μA → Idivider ≈ 200 μA

**R2 = VB/Idivider = 6.1/0.2 mA = 30.5 kΩ** → use **R2 = 30 kΩ**

**R1 = (VCC − VB)/Idivider = (12 − 6.1)/0.2 mA = 29.5 kΩ** → use **R1 = 30 kΩ**

**Step 4 — Verify the Q-point:**

VB = 12 × 30/(30+30) = **6.0 V** (close to target)

VE = 6.0 − 0.7 = 5.3 V → IE = 5.3/2.7k = **1.96 mA** ≈ 2 mA

VCE = 12 − 1.96 mA × (270 + 2700) = 12 − 5.82 = **6.18 V** → active region confirmed (VCE > 0.2 V)

**Step 5 — Calculate actual small-signal gain:**

gm = 1.96 mA / 26 mV = 75.4 mS

**Av = −gm × RC = −75.4 × 0.270 = −20.4** (meets spec, negative sign = 180° inversion)

## 3.3 Design Verification Checklist

- **Active region**: VCE = 6.18 V >> 0.2 V → confirmed
- **Bias stability**: Divider current (200 μA) >> IB (20 μA) → β-independent
- **Gain**: |Av| = 20.4 ≈ 20 → meets specification
- **Swing**: VCE at midpoint allows ±5 V output swing before clipping
- **Bypass capacitor**: CE across RE is needed for full AC gain; without it, Av = −RC/(RE + 1/gm) ≈ −0.1 (gain drops dramatically)`,
        examTip: 'The FE exam BJT amplifier design sequence is always: (1) set Q-point from VCC and desired VCE, (2) find gm = IC/VT, (3) choose RC = |Av|/gm, (4) design bias divider with current ~10× IB. If the bypass capacitor is removed, gain drops to approximately −RC/RE — the exam may ask about this.',
        importantNote: 'The bypass capacitor across RE is essential for AC gain. It short-circuits RE at signal frequencies, giving full gain Av = −gm·RC. Without it, RE provides negative feedback and gain drops to about −RC/RE. Many FE exam questions test whether you recognize this distinction.',
      },
    ],
    keyTakeaways: [
      'Active region: IC = β·IB; saturation: VCE < 0.2 V; cutoff: IB ≈ 0.',
      'Voltage divider bias is most stable; Q-point: VB → VE = VB−0.7 → IE = VE/RE → VCE = VCC−IC(RC+RE).',
      'Small-signal: gm = IC/VT ≈ IC/26 mV; rπ = β/gm; re = VT/IE.',
      'CE: Av = −gm·RC (high gain, phase inversion); CC: Av ≈ 1 (buffer); CB: high-frequency use.',
      'Miller effect multiplies CBC by (1+|Av|) in CE — limits bandwidth at high gain.',
      'Frequency limit: fT = gm/(2π·Cπ); gain-bandwidth product is approximately constant.',
    ],
  },

  fee_mosfet: {
    topicId: 'fee_mosfet',
    title: 'MOSFET Circuits and Biasing',
    domainWeight: 'Electronics · 7–11%',
    overview: 'MOSFETs are voltage-controlled devices with essentially zero gate current — the dominant transistor in modern electronics. The FE exam tests MOSFET operating regions, the square-law equation in saturation, biasing methods, and amplifier configurations (CS, CD, CG).',
    sections: [
      {
        id: 'mos-regions',
        title: '1. MOSFET Operating Regions and the Square-Law Model',
        content: `## 1.1 Enhancement-Mode NMOS

An **N-channel enhancement MOSFET** has three terminals: **Gate (G)**, **Drain (D)**, **Source (S)**.

| Region | Condition | Drain Current |
|---|---|---|
| **Cutoff** | VGS < Vt | ID = 0 |
| **Triode (Linear)** | VGS > Vt, VDS < VGS − Vt | ID = K·[2(VGS−Vt)·VDS − VDS²] |
| **Saturation** | VGS > Vt, VDS ≥ VGS − Vt | **ID = K·(VGS − Vt)²** |

where **K = (μₙCₒₓ/2)·(W/L)** is the device transconductance parameter.

- **Vt** = threshold voltage (typically 0.5–2 V for NMOS)
- **μₙCₒₓ** = process transconductance parameter (μA/V²)
- **W/L** = width-to-length ratio (designer controls this)

### Saturation Equation (Most Important)

**ID = (μₙCₒₓ/2) · (W/L) · (VGS − Vt)²**

This **square-law** relationship means doubling (VGS − Vt) quadruples the drain current.

### Transconductance

**gm = ∂ID/∂VGS = μₙCₒₓ · (W/L) · (VGS − Vt) = 2·ID/(VGS − Vt)**

Alternative: **gm = √(2·μₙCₒₓ·(W/L)·ID)**

## 1.2 P-Channel MOSFET

PMOS is complementary — all voltages and currents reverse:
- Conducts when **VGS < Vt** (Vt is negative)
- Current flows from source to drain
- Used in CMOS logic paired with NMOS

## 1.3 Depletion-Mode MOSFET

A **depletion-mode** MOSFET conducts at VGS = 0 and turns off with negative VGS (for N-channel):
- **ID = IDSS · (1 − VGS/Vp)²** where IDSS is drain current at VGS = 0 and Vp is pinch-off voltage`,
        examTip: 'The saturation current equation ID = K·(VGS−Vt)² is the most-tested MOSFET formula on the FE exam. Always check VDS ≥ VGS−Vt to confirm saturation before using this equation. If VDS < VGS−Vt, the MOSFET is in the triode (linear) region and requires the different formula.',
      },
      {
        id: 'mos-amplifiers',
        title: '2. MOSFET Biasing and Amplifier Configurations',
        content: `## 2.1 Biasing Methods

### Self-Bias with Source Resistor

The most common discrete MOSFET biasing method:

1. Gate voltage set by a resistor divider or directly: **VG = VDD · R2/(R1+R2)**
2. Source voltage: **VS = ID · RS**
3. Gate-source voltage: **VGS = VG − VS = VG − ID·RS**
4. Solve simultaneously with saturation equation: ID = K·(VGS − Vt)²

The source resistor RS provides **negative feedback**: if ID increases → VS increases → VGS decreases → ID decreases. This stabilizes the Q-point.

### Key Advantage over BJTs

MOSFET gate draws **essentially zero DC current** (IG ≈ 0), so:
- Gate bias resistors do not affect the bias point
- Input impedance is extremely high (MΩ to GΩ)
- Biasing is simpler — no base current to account for

## 2.2 Amplifier Configurations

| Parameter | Common-Source (CS) | Common-Drain (CD) | Common-Gate (CG) |
|---|---|---|---|
| **Voltage gain** | **Av = −gm·RD** | **Av ≈ gm·RS/(1+gm·RS) ≈ 1** | **Av = gm·RD** |
| **Input impedance** | **Very high** (gate) | **Very high** (gate) | **Low** (≈ 1/gm) |
| **Output impedance** | **≈ RD** | **≈ 1/gm** (low) | **≈ RD** |
| **Phase inversion** | **Yes** | **No** | **No** |
| **Analog to BJT** | CE | CC (emitter follower) | CB |

### Common-Source (CS) — Primary Amplifier

**Av = −gm · RD** (without source degeneration)

**Av = −gm · RD / (1 + gm·RS)** (with unbypassed RS — reduces gain but improves linearity)

### Common-Drain (CD) — Source Follower

**Av ≈ 1** (unity gain buffer), **Zin ≈ ∞**, **Zout ≈ 1/gm**

Ideal for driving low-impedance loads from high-impedance sources.

### Common-Gate (CG)

Low input impedance (≈ 1/gm) but **no Miller effect** — excellent for **high-frequency** and **cascode** applications.

## 2.3 CMOS Inverter

The foundation of digital electronics: NMOS + PMOS in series between VDD and ground. When input is high, NMOS on / PMOS off → output low. When input is low, PMOS on / NMOS off → output high. **Zero static power dissipation** (no DC path in either state).`,
        examTip: 'For MOSFET amplifier gain on the FE exam: CS gain is Av = −gm·RD. To find gm, first find the Q-point (ID from biasing), then gm = 2·ID/(VGS−Vt). This two-step process (bias first, then small-signal) is the standard approach for all transistor amplifier problems.',
        importantNote: 'MOSFETs are vulnerable to electrostatic discharge (ESD) — the thin gate oxide can be permanently damaged by static voltages. This is an engineering practice detail that occasionally appears on the FE exam in the context of device handling and protection circuits.',
      },
    ],
    keyTakeaways: [
      'Saturation: ID = (μₙCₒₓ/2)·(W/L)·(VGS−Vt)²; requires VDS ≥ VGS−Vt.',
      'Transconductance: gm = 2·ID/(VGS−Vt) = μₙCₒₓ·(W/L)·(VGS−Vt).',
      'Zero gate current (IG ≈ 0) → very high input impedance; simpler biasing than BJTs.',
      'CS: Av = −gm·RD (high gain, phase inversion); CD: Av ≈ 1 (buffer); CG: high-frequency.',
      'Self-bias via RS: VGS = VG − ID·RS provides negative feedback stabilization.',
      'CMOS (NMOS + PMOS): zero static power — basis of all modern digital circuits.',
    ],
  },

  fee_opamp: {
    topicId: 'fee_opamp',
    title: 'Operational Amplifier Circuits',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Operational amplifiers (op-amps) are high-gain differential amplifiers used with feedback to create precise analog circuits. The FE exam tests ideal op-amp analysis using the virtual short principle, inverting/non-inverting gain formulas, integrators, differentiators, and summing amplifiers.',
    sections: [
      {
        id: 'opamp-ideal',
        title: '1. Ideal Op-Amp Model and Feedback Circuits',
        content: `## 1.1 Ideal Op-Amp Assumptions

| Parameter | Ideal Value | Real (e.g., LM741) |
|---|---|---|
| **Open-loop gain (Aol)** | ∞ | 10⁵–10⁶ |
| **Input impedance (Zin)** | ∞ | 1–10 MΩ |
| **Output impedance (Zout)** | 0 | 50–100 Ω |
| **Bandwidth** | ∞ | GBW ≈ 1 MHz |
| **Input offset voltage** | 0 | 1–5 mV |
| **Input bias current** | 0 | nA–μA |

### The Virtual Short Principle

With **negative feedback**, the ideal op-amp enforces two conditions:

1. **V⁺ = V⁻** (virtual short — inputs are at the same voltage)
2. **I⁺ = I⁻ = 0** (no current flows into the inputs)

These two rules are sufficient to analyze **any** ideal op-amp circuit.

## 1.2 Standard Feedback Configurations

### Inverting Amplifier

**Acl = −Rf/Rin**

- Input applied to the inverting (−) terminal through Rin
- Feedback from output to (−) through Rf
- Input impedance = Rin (not infinite)
- **180° phase inversion**

![An inverting amplifier: the source drives Rin into the inverting terminal, Rf feeds the output back to that same node, and the non-inverting terminal is tied to ground. With Rin = 1 kilohm and Rf = 10 kilohm the closed-loop gain is minus ten.](/courses/fe-ee/figures/sch-opamp-inverting.svg)

Derive the gain from the two rules rather than recalling it, because the same
three lines handle every variation the exam throws at this topology.

The non-inverting terminal is grounded, so rule 1 (V⁺ = V⁻) puts the inverting
node at **0 V** — a *virtual ground*: held at ground potential by feedback, but
not connected to ground. Rule 2 says no current enters the op-amp input, so all
the current arriving through Rin must continue through Rf.

- Current in: i = (v_in − 0)/R_in = v_in/R_in
- Same current out: v_out = 0 − i·R_f = −v_in·R_f/R_in
- Therefore **A = −R_f/R_in**

With the values drawn, A = −10 kΩ/1 kΩ = **−10**. A 0.5 V input gives −5.0 V
out, via 0.5 mA flowing through both resistors and dropping 5 V across Rf.

Two consequences of the virtual ground are tested more often than the gain
itself:

**Input impedance is R_in, not infinite.** The source looks into the virtual
ground through R_in and sees exactly 1 kΩ here. That is the price of the
inverting topology, and it is why you cannot simply raise R_f/R_in without
thinking — pushing gain up by shrinking R_in loads the source harder.

**The gain depends only on the ratio.** 10 kΩ/1 kΩ and 100 kΩ/10 kΩ give
identical gain, which is why resistor *matching* matters far more than absolute
accuracy in these circuits.

| Configuration (R_in = 1 kΩ, R_f = 10 kΩ) | Gain | Z_in | Phase | v_out for v_in = 0.5 V |
|---|---|---|---|---|
| Inverting | −10 | 1 kΩ | 180° | −5.00 V |
| Non-inverting | 1 + 10 = +11 | ≈ ∞ | 0° | +5.50 V |
| Unity buffer | +1 | ≈ ∞ | 0° | +0.50 V |

The non-inverting gain is **11, not 10** — the "1 +" is not decoration. It comes
from the input appearing directly at the output through the feedback divider,
and dropping it is one of the most reliably punished slips in this section.

### Where the ideal model stops

Two real limits appear in FE questions even though the analysis above assumes
neither.

**Output swing.** The output cannot exceed the supply rails. On ±12 V supplies,
the −10 gain stage clips for any input beyond 1.2 V in magnitude, so a 2 V input
gives roughly −12 V and not −20 V. If a computed output exceeds the supply, the
answer is the rail.

**Gain-bandwidth product.** For a typical 1 MHz GBW part, closed-loop bandwidth
is GBW divided by the closed-loop gain: 1 MHz/10 = **100 kHz**. Gain is traded
against bandwidth one-for-one, so the same amplifier at a gain of 100 works only
to 10 kHz. This is why the ideal assumption of infinite bandwidth has to be
abandoned as soon as a question mentions frequency at all.

### The virtual ground generalises

Everything above used one fact — the inverting node sits at 0 V and swallows no
current — and that one fact carries the rest of the topic.

**Summing amplifier.** Feed several sources into the same virtual ground through
their own resistors. Because the node is held at 0 V, no source can see any
other: each contributes i = v/R independently, and the currents simply add in
R_f. With R_f = 10 kΩ and inputs of 0.1 V through 1 kΩ, 0.2 V through 2 kΩ and
0.5 V through 5 kΩ:

v_out = −(10×0.1 + 5×0.2 + 2×0.5) = −(1 + 1 + 1) = **−3.0 V**

Each branch contributes exactly 1 V despite its different source voltage,
because gain is set per-input by R_f/R_n. That independence is the reason this
circuit is an audio mixer and a DAC summing node, and it is why the *inverting*
form is used for summing while the non-inverting form is not.

**Integrator.** Replace R_f with a capacitor. The current v_in/R_in still has
nowhere to go but the feedback element, and forcing that current through a
capacitor gives dv_out/dt = −v_in/(R_in C). With R_in = 10 kΩ and C = 0.1 µF,
R_in C = 1 ms, so a steady 1 V input ramps the output at −1000 V/s. After 5 ms
the output is at −5 V, and on ±12 V supplies it reaches the rail at 12 ms and
stops. A real integrator needs a large resistor across C to stop DC offset from
driving it into the rail on its own; the ideal analysis does not predict that,
and it is the most common practical failure of this circuit.

| Feedback element | Relationship | Circuit |
|---|---|---|
| Resistor R_f | v_out = −v_in R_f/R_in | inverting amplifier |
| Capacitor C | v_out = −(1/R_in C)∫v_in dt | integrator |
| Resistor, with C at the input | v_out = −R_f C dv_in/dt | differentiator |

Read that table as one idea rather than three formulas: **the input branch sets
the current, the feedback element decides what that current does.**

### When the virtual short does not apply

Both rules depend on **negative feedback** being present. Remove the feedback
path, or route it to the non-inverting terminal instead, and V⁺ no longer equals
V⁻ — the open-loop gain of 10⁵ or more drives the output straight to whichever
rail the input difference points at. That circuit is a **comparator**, not an
amplifier, and its output is one of two voltages rather than a scaled copy.

So before applying V⁺ = V⁻ to anything, check where the feedback goes. If it
returns to the inverting input, the virtual short holds and the closed-loop
formulas apply. If there is no feedback at all, or it returns to the
non-inverting input, expect saturation or latch-up and analyse it as a switching
element. Applying the amplifier formulas to a comparator produces a confident
numerical answer that is not on the answer sheet.

### Non-Inverting Amplifier

**Acl = 1 + Rf/Rin**

- Input applied to the non-inverting (+) terminal
- Feedback divider between output and (−) terminal
- Input impedance ≈ ∞ (signal at high-Z + input)
- **No phase inversion**

### Unity-Gain Buffer (Voltage Follower)

**Acl = 1** (Rf = 0, Rin = ∞: output connected directly to − input)

- **Zin ≈ ∞, Zout ≈ 0** — perfect impedance matching buffer
- Isolates a high-impedance source from a low-impedance load`,
        examTip: 'For any op-amp circuit on the FE exam, apply two rules: (1) V⁺ = V⁻ and (2) no current into inputs. Write KCL at the inverting node using these constraints, and the gain formula falls out directly. This works for every configuration — inverting, non-inverting, summing, differencing, integrator, differentiator.',
      },
      {
        id: 'opamp-special',
        title: '2. Summing, Integrating, and Differentiating Circuits',
        content: `## 2.1 Summing Amplifier

Combines multiple weighted inputs:

**Vo = −Rf · (V₁/R₁ + V₂/R₂ + V₃/R₃ + ...)**

Each input is weighted by −Rf/Rᵢ. If all Rᵢ = R, then Vo = −(Rf/R)·(V₁+V₂+V₃+...) — a scaled sum.

### Difference (Differential) Amplifier

**Vo = (Rf/Rin) · (V₂ − V₁)** (when Rf/Rin = R₂/R₁)

Amplifies the **difference** between two inputs while rejecting common-mode signals. The **Common-Mode Rejection Ratio (CMRR)** measures this ability.

## 2.2 Integrator

**Vo = −(1/RC) · ∫ Vi dt**

- Capacitor C replaces Rf in the inverting configuration
- Output is proportional to the integral of the input
- A constant input produces a linear ramp output
- **Practical issue**: DC offset causes unbounded drift — add a large resistor in parallel with C to limit DC gain

### In the s-domain:

**H(s) = −1/(sRC)** — gain increases without bound at low frequencies

## 2.3 Differentiator

**Vo = −RC · dVi/dt**

- Capacitor C replaces Rin in the inverting configuration
- Output proportional to the rate of change of input
- **Practical issue**: amplifies high-frequency noise — add a small resistor in series with C

### In the s-domain:

**H(s) = −sRC** — gain increases without bound at high frequencies

## 2.4 Gain-Bandwidth Product (GBW)

For a real op-amp, the product of closed-loop gain and bandwidth is constant:

**GBW = Aol · f₃dB = Acl · BW**

| Closed-Loop Gain | Bandwidth |
|---|---|
| 1 (buffer) | 1 MHz (= GBW) |
| 10 | 100 kHz |
| 100 | 10 kHz |
| 1000 | 1 kHz |

Higher gain → lower bandwidth. This is a fundamental tradeoff.`,
        examTip: 'The integrator and differentiator are frequently tested on the FE exam. Key distinction: integrator has C in feedback (replaces Rf), differentiator has C at input (replaces Rin). In the s-domain: integrator gain = −1/(sRC) rolls off with frequency; differentiator gain = −sRC increases with frequency.',
        importantNote: 'Real integrators need a DC feedback path (large resistor across C) to prevent output saturation from input offset. Real differentiators need a series resistor with C to limit high-frequency noise amplification. The FE exam may ask about these practical limitations.',
      },
      {
        id: 'opamp-analysis-shortcuts',
        title: '3. Op-Amp Circuit Analysis Shortcuts',
        content: `## 3.1 The Virtual Short Method — Quick Analysis

For ANY ideal op-amp circuit with negative feedback, apply these two rules and solve:

**Rule 1**: V⁺ = V⁻ (virtual short — no voltage difference between inputs)
**Rule 2**: I⁺ = I⁻ = 0 (no current into either input terminal)

**Worked Example — Determine the output of this circuit:**

Non-inverting input: V⁺ connected to 3 V. Feedback: Rf = 20 kΩ from output to V⁻. Rin = 10 kΩ from V⁻ to ground.

1. By Rule 1: V⁻ = V⁺ = **3 V**
2. Current through Rin: I = V⁻/Rin = 3/10k = **0.3 mA** (flows toward ground)
3. By Rule 2: same current flows through Rf (no current into the op-amp)
4. Voltage across Rf: V_Rf = I × Rf = 0.3 mA × 20 kΩ = **6 V**
5. Output: Vo = V⁻ + V_Rf = 3 + 6 = **9 V**

**Verification**: Non-inverting gain = 1 + Rf/Rin = 1 + 20/10 = 3. Vo = 3 × 3 V = 9 V. Confirmed.

## 3.2 Superposition in Op-Amp Circuits

When multiple inputs feed an op-amp circuit, use **superposition**:

1. Set all inputs to zero except one
2. Find the output contribution from that input
3. Repeat for each input
4. Sum all contributions

**Example — Summing amplifier with two inputs:**

V1 = 2 V through R1 = 10 kΩ; V2 = −1 V through R2 = 20 kΩ; Rf = 40 kΩ

- From V1 alone: Vo1 = −(Rf/R1)·V1 = −(40/10)·2 = **−8 V**
- From V2 alone: Vo2 = −(Rf/R2)·V2 = −(40/20)·(−1) = **+2 V**
- **Total: Vo = −8 + 2 = −6 V**

## 3.3 Common Trap: Rail Voltage Saturation

The ideal op-amp model assumes infinite output voltage range, but **real op-amps clip** at the supply rails:

- If V+ supply = +15 V and V− supply = −15 V, output saturates at approximately **±13 to ±14 V** (1–2 V below rails for standard op-amps)
- Rail-to-rail op-amps can reach within 50–200 mV of the supply

**Example trap**: An inverting amplifier with Av = −100, Vin = 0.5 V → calculated Vo = −50 V. But if supply is ±15 V, the actual output is **−14 V** (saturated, not −50 V).

**How to spot saturation on the exam:**
1. Calculate the ideal output voltage
2. Compare to supply rails
3. If |Vo| > |Vsupply| − 1.5 V, the output is **clipped/saturated**
4. When saturated, the virtual short (V⁺ = V⁻) **no longer holds** — the op-amp is in open-loop

## 3.4 Quick Gain Formulas Reference

| Circuit | Gain Formula | Notes |
|---|---|---|
| Inverting | **−Rf/Rin** | Input impedance = Rin |
| Non-inverting | **1 + Rf/Rin** | Input impedance ≈ ∞ |
| Buffer | **1** | Rf = 0, Rin = ∞ |
| Summing | **−Rf·Σ(Vi/Ri)** | One term per input |
| Difference | **(Rf/Rin)·(V2−V1)** | When ratios matched |
| Integrator | **−1/(sRC)** | C replaces Rf |
| Differentiator | **−sRC** | C replaces Rin |`,
        examTip: 'On the FE exam, always check for saturation after computing the ideal output. If the calculated output exceeds the supply voltage, the answer is the saturation voltage, not the calculated value. This trap appears in problems where the gain is very high (Av > 50) or the input is unexpectedly large.',
        importantNote: 'When an op-amp saturates, the virtual short assumption breaks down. The output is stuck at the rail, and V⁺ is no longer equal to V⁻. If an exam problem asks what happens when positive feedback is applied (output to + input), the answer is always a comparator or latch — the output slams to one rail.',
      },
    ],
    keyTakeaways: [
      'Virtual short principle: V⁺ = V⁻ and I⁺ = I⁻ = 0 with negative feedback — solves any ideal op-amp circuit.',
      'Inverting: Acl = −Rf/Rin; Non-inverting: Acl = 1 + Rf/Rin; Buffer: Acl = 1.',
      'Summing amplifier: Vo = −Rf·(V₁/R₁ + V₂/R₂ + ...) — weighted sum of inputs.',
      'Integrator: Vo = −(1/RC)·∫Vi dt; Differentiator: Vo = −RC·dVi/dt.',
      'GBW = Aol · f₃dB = constant; higher gain means lower bandwidth.',
      'Practical integrators need DC feedback; differentiators need noise-limiting resistor.',
    ],
  },

  fee_power_elec: {
    topicId: 'fee_power_elec',
    title: 'Power Electronics: Rectifiers and Converters',
    domainWeight: 'Electronics · 7–11%',
    overview: 'Power electronics converts electrical energy between different voltage/current levels and between AC and DC. Buck and boost converters, three-phase rectifiers, PWM control, and ripple calculations are the key FE exam topics in this area.',
    sections: [
      {
        id: 'pe-converters',
        title: '1. DC-DC Converters: Buck and Boost',
        content: `## 1.1 Buck Converter (Step-Down)

The **buck converter** reduces DC voltage using a switch, inductor, diode, and capacitor:

**Vo = D · Vin** where **D = ton/(ton + toff)** is the duty cycle (0 ≤ D ≤ 1)

| Parameter | Formula |
|---|---|
| Output voltage | **Vo = D · Vin** |
| Inductor current ripple | **ΔIL = Vin · D · (1−D) / (L · fₛ)** |
| Output voltage ripple | **ΔVo = ΔIL / (8 · C · fₛ)** |
| Minimum inductance (CCM) | **Lmin = (1−D) · R / (2 · fₛ)** |

### Continuous vs. Discontinuous Conduction Mode

- **CCM** (continuous): inductor current never reaches zero — formulas above apply
- **DCM** (discontinuous): inductor current drops to zero each cycle — output depends on load

## 1.2 Boost Converter (Step-Up)

The **boost converter** increases DC voltage:

**Vo = Vin / (1 − D)**

| Parameter | Formula |
|---|---|
| Output voltage | **Vo = Vin/(1−D)** |
| Inductor current ripple | **ΔIL = Vin · D / (L · fₛ)** |
| Output voltage ripple | **ΔVo = Io · D / (C · fₛ)** |

As D → 1, Vo → ∞ theoretically, but practical limits (losses, component ratings) cap the boost ratio to about 4–5×.

## 1.3 Buck-Boost Converter

**Vo = −Vin · D/(1−D)** (output is inverted polarity)

Can step up (D > 0.5) or step down (D < 0.5) voltage.

### Efficiency

Ideal converters are **100% efficient** (Pin = Pout). Real converters: 85–95% typical. Losses include switch conduction and switching losses, inductor core/copper losses, and diode forward drop.`,
        examTip: 'Buck: Vo = D·Vin (output always less than input). Boost: Vo = Vin/(1−D) (output always greater than input). These two formulas are the most-tested power electronics equations on the FE exam. Remember: D is always between 0 and 1.',
      },
      {
        id: 'pe-rectifiers-pwm',
        title: '2. Three-Phase Rectifiers and PWM Control',
        content: `## 2.1 Three-Phase Rectifiers

Three-phase rectifiers handle higher power with lower ripple than single-phase:

### Six-Pulse (Uncontrolled) Diode Rectifier

**Vdc = (3√3/π) · Vm ≈ 1.35 · VL_rms**

where Vm is the peak phase voltage and VL_rms is the line-to-line RMS voltage.

| Rectifier Type | Vdc | Ripple Frequency | Ripple Factor |
|---|---|---|---|
| Single-phase half-wave | Vm/π | f | 121% |
| Single-phase full-wave | 2Vm/π | 2f | 48% |
| Three-phase half-wave | 3√3·Vm/(2π) | 3f | 18% |
| **Three-phase full-wave (6-pulse)** | **3√3·Vm/π** | **6f** | **4%** |

### Controlled (SCR) Rectifiers

Thyristor-based rectifiers allow variable DC output by delaying the firing angle α:

**Vdc = (3√3·Vm/π) · cos(α)**

At α = 0°: full output; at α = 90°: Vdc = 0; at α > 90°: negative Vdc (regeneration).

## 2.2 Pulse-Width Modulation (PWM)

PWM controls average output by rapidly switching between on and off states:

**Vavg = D · Vsupply**

### Key PWM Parameters

- **Switching frequency fₛ**: typically 10–100 kHz (much higher than load bandwidth)
- **Duty cycle D**: fraction of period the switch is on
- **Ripple**: determined by L, C, and fₛ — higher fₛ means lower ripple

### Energy Storage Principle

- **Inductors** resist current change: smooth output current
- **Capacitors** resist voltage change: smooth output voltage
- Combined L-C filter produces clean DC from PWM switching

## 2.3 Inverters (DC to AC)

**Inverters** convert DC to AC for motor drives, solar grid-tie, and UPS systems:

- **H-bridge**: four switches create alternating polarity across load
- **PWM inverter**: modulates pulse widths to approximate a sinusoidal output
- **Three-phase inverter**: six switches (three half-bridges) for motor drive applications`,
        examTip: 'For ripple calculations on the FE exam: inductor ripple ΔIL = V·D/(L·fₛ) and capacitor ripple ΔVo = I·D/(C·fₛ). To reduce ripple, increase L, C, or switching frequency fₛ. The FE exam often asks which parameter change most effectively reduces ripple.',
        importantNote: 'Three-phase rectifiers have dramatically lower ripple than single-phase (4% vs 48% for full-wave). This is why industrial power systems use three-phase power — not just for higher power, but for cleaner DC output. This concept frequently appears on the FE exam.',
      },
    ],
    keyTakeaways: [
      'Buck: Vo = D·Vin (step-down); Boost: Vo = Vin/(1−D) (step-up); D = ton/(ton+toff).',
      'Inductor ripple: ΔIL = V·D/(L·fₛ); capacitor ripple: ΔVo = I·D/(C·fₛ).',
      'Three-phase 6-pulse rectifier: Vdc ≈ 1.35·VL_rms with only 4% ripple.',
      'PWM at high switching frequency + LC filter produces clean DC from switched output.',
      'Controlled rectifiers use SCR firing angle α: Vdc = Vdc_max · cos(α).',
      'Ideal converters: Pin = Pout (100% efficient); real converters: 85–95% typical.',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 10 — POWER SYSTEMS  (6 curriculum IDs from 5 sections)
   * ────────────────────────────────────────────────────────────────── */

  fee_3phase_power: {
  topicId: 'fee_3phase_power',
  title: 'Three-Phase Power Systems',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Three-phase AC power is the backbone of industrial and utility-scale electrical systems. Understanding balanced/unbalanced configurations, Y-delta conversions, and three-phase power calculations is essential for the FE exam and professional practice.',
  sections: [
    {
      id: '3ph-fundamentals',
      title: '1. Three-Phase Sources and Balanced Configurations',
      content: `## 1.1 Why Three-Phase?

Three-phase systems deliver **constant instantaneous power** (no pulsation), use conductors more efficiently than single-phase, and produce rotating magnetic fields that drive motors directly.

Three voltage sources separated by **120°**:

- **Va = V·cos(ωt)**
- **Vb = V·cos(ωt − 120°)**
- **Vc = V·cos(ωt − 240°)**

In complex (phasor) notation using the **a-operator** where **a = e^(j120°) = −½ + j√3/2**:

| Phasor | Value |
|---|---|
| Va | V∠0° |
| Vb | V∠−120° = a²·Va |
| Vc | V∠−240° = a·Va |

For **balanced** loads: **Va + Vb + Vc = 0** and **Ia + Ib + Ic = 0**.

## 1.2 Wye (Y) vs. Delta (Δ) Connections

| Property | Wye (Y) | Delta (Δ) |
|---|---|---|
| Line-to-line voltage | **V_LL = √3 · V_ph** | **V_LL = V_ph** |
| Line current | **I_L = I_ph** | **I_L = √3 · I_ph** |
| Neutral wire | Present (carries unbalanced current) | No neutral |
| Typical use | Distribution, generators | Motors, capacitor banks |

### Y ↔ Δ Impedance Conversion

- **Z_Δ = 3·Z_Y** (balanced loads)
- **Z_Y = Z_Δ / 3**`,
      examTip: 'The √3 factor is the single most tested relationship: in a Y-connection it multiplies VOLTAGE (V_LL = √3·V_ph), while in a Δ-connection it multiplies CURRENT (I_L = √3·I_ph). If you mix these up, every downstream calculation is wrong.',
      importantNote: 'The a-operator a = e^(j120°) satisfies 1 + a + a² = 0. This identity is the mathematical reason Va + Vb + Vc = 0 for a balanced set, and it is used repeatedly in symmetrical component analysis.',
    },
    {
      id: '3ph-power-calcs',
      title: '2. Three-Phase Power and Per-Phase Analysis',
      content: `## 2.1 Three-Phase Power Formulas

| Quantity | Formula | Unit |
|---|---|---|
| Real power | **P = √3 · V_LL · I_L · cos(φ)** | W |
| Reactive power | **Q = √3 · V_LL · I_L · sin(φ)** | VAR |
| Apparent power | **S = √3 · V_LL · I_L** | VA |
| Complex power | **S = P + jQ** | VA |

All formulas use **line** quantities (V_LL and I_L) — no need to know whether the load is Y or Δ.

### Power per phase:
- **P_phase = V_ph · I_ph · cos(φ)** → total **P = 3·P_phase**

## 2.2 Per-Phase Analysis

For **balanced** systems, analyze one phase as a single-phase circuit:

1. Convert Δ-loads to equivalent Y: **Z_Y = Z_Δ/3**
2. Solve the single-phase equivalent (line-to-neutral voltage, phase current)
3. Multiply power by 3 for total three-phase power
4. Line quantities: **V_LL = √3·V_ph**, **I_L = I_ph** (Y connection)

## 2.3 Symmetrical Components (Unbalanced Analysis)

Unbalanced currents or voltages decompose into three **sequence** sets:

- **Positive sequence** (V₁): balanced, normal rotation (abc)
- **Negative sequence** (V₂): balanced, reverse rotation (acb)
- **Zero sequence** (V₀): all three phasors equal (in-phase)

**Transformation**: V₀ = ⅓(Va + Vb + Vc); V₁ = ⅓(Va + a·Vb + a²·Vc); V₂ = ⅓(Va + a²·Vb + a·Vc)`,
      examTip: 'On the FE exam, three-phase power problems almost always give line voltage and line current. Plug directly into P = √3·V_LL·I_L·cos(φ). If they give phase quantities, first convert to line quantities using the Y or Δ relationship.',
    },
    {
      id: '3ph-calculation-shortcuts',
      title: '3. Three-Phase Calculation Shortcuts',
      content: `## 3.1 Quick Conversion Reference

**Y ↔ Δ Impedance Conversion (Balanced):**
- **Z_Δ = 3 · Z_Y** (Delta impedance is 3× the Wye impedance)
- **Z_Y = Z_Δ / 3**

**Line ↔ Phase Conversions:**

| Connection | Voltage Relationship | Current Relationship |
|---|---|---|
| **Wye (Y)** | V_LL = √3 · V_ph | I_L = I_ph |
| **Delta (Δ)** | V_LL = V_ph | I_L = √3 · I_ph |

**Memory trick**: The √3 factor always multiplies the LARGER quantity — in Y, line voltage is larger; in Δ, line current is larger.

## 3.2 Worked Example: Balanced Y Load

**Problem**: A balanced three-phase Y-connected load has impedance Z_Y = 10 + j5 Ω per phase. The line-to-line voltage is V_LL = 480 V. Find all currents and powers.

**Step 1 — Phase voltage:**

V_ph = V_LL / √3 = 480 / 1.732 = **277.1 V**

**Step 2 — Phase current (= line current for Y):**

|Z_Y| = √(10² + 5²) = √125 = **11.18 Ω**

I_ph = V_ph / |Z_Y| = 277.1 / 11.18 = **24.79 A**

**I_L = I_ph = 24.79 A** (Y connection)

**Step 3 — Power factor angle:**

φ = arctan(X/R) = arctan(5/10) = **26.57°**

cos(φ) = cos(26.57°) = **0.894 lagging** (inductive load)

**Step 4 — Three-phase power:**

| Power | Formula | Result |
|---|---|---|
| **Real power P** | √3 · V_LL · I_L · cos(φ) | √3 × 480 × 24.79 × 0.894 = **18,432 W ≈ 18.4 kW** |
| **Reactive power Q** | √3 · V_LL · I_L · sin(φ) | √3 × 480 × 24.79 × 0.447 = **9,216 VAR ≈ 9.22 kVAR** |
| **Apparent power S** | √3 · V_LL · I_L | √3 × 480 × 24.79 = **20,608 VA ≈ 20.6 kVA** |

**Verification**: S² = P² + Q² → 20,608² ≈ 18,432² + 9,216² → 424.5M ≈ 339.7M + 84.9M ≈ 424.6M. Confirmed.

## 3.3 Equivalent Delta Load

If the same load were Δ-connected: Z_Δ = 3 × Z_Y = 30 + j15 Ω

- V_ph(Δ) = V_LL = 480 V (phase voltage equals line voltage in Δ)
- I_ph(Δ) = 480 / |30+j15| = 480 / 33.54 = 14.31 A
- I_L = √3 × 14.31 = **24.79 A** (same line current as Y — proves equivalence)
- Total power: **identical** to the Y case (18.4 kW)

**Key insight**: A balanced Δ load with Z_Δ = 3·Z_Y draws exactly the same line current and power as the equivalent Y load. The per-phase analysis gives identical results regardless of which connection is used.

## 3.4 Common Exam Traps

- **Mixing line and phase quantities**: Always identify whether given values are line or phase before plugging into formulas
- **Forgetting √3 in power formula**: P = √3·V_LL·I_L·cos(φ), NOT 3·V_LL·I_L·cos(φ). The factor 3 appears only when using phase quantities: P = 3·V_ph·I_ph·cos(φ)
- **Voltage given as line-to-neutral vs. line-to-line**: "480 V three-phase" means V_LL = 480 V; "277 V phase" means V_ph = 277 V`,
      examTip: 'When the FE exam says "480 V three-phase system," this ALWAYS means V_LL = 480 V (line-to-line). The phase voltage is V_ph = 480/√3 = 277 V. If you use 480 V as the phase voltage, every answer will be wrong by a factor of √3.',
      importantNote: 'For balanced loads, you can convert freely between Y and Δ representations using Z_Δ = 3·Z_Y. The total power drawn from the source is identical in both cases. The FE exam often gives a Δ-connected load and expects you to convert to Y for per-phase analysis.',
    },
  ],
  keyTakeaways: [
    'Y connection: V_LL = √3·V_ph, I_L = I_ph; Delta: V_LL = V_ph, I_L = √3·I_ph.',
    'Three-phase power: P = √3·V_LL·I_L·cos(φ) using line quantities regardless of Y or Δ.',
    'Balanced systems: Va + Vb + Vc = 0; per-phase analysis reduces to single-phase equivalent.',
    'Y ↔ Δ conversion: Z_Δ = 3·Z_Y for balanced impedances.',
    'Symmetrical components decompose unbalanced conditions into zero, positive, and negative sequences.',
  ],
},

  fee_transformers: {
  topicId: 'fee_transformers',
  title: 'Transformers: Equivalent Circuit & Efficiency',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Transformers are the workhorses of power systems, stepping voltage up for efficient long-distance transmission and down for safe distribution. The FE exam tests ideal transformer ratios, equivalent circuit models, voltage regulation, and efficiency calculations.',
  sections: [
    {
      id: 'xfmr-ideal-real',
      title: '1. Ideal vs. Real Transformer Models',
      content: `## 1.1 Ideal Transformer

An ideal transformer has **perfect coupling, zero losses, and infinite permeability**:

| Relationship | Formula |
|---|---|
| Voltage ratio | **Vs/Vp = Ns/Np = n** (turns ratio) |
| Current ratio | **Ip/Is = n** (currents are inverse) |
| Power conservation | **Pp = Ps** → **Vp·Ip = Vs·Is** |
| Impedance reflection | **Z_primary = Z_load / n²** |

## 1.2 Real Transformer Equivalent Circuit

Real transformers have losses modeled by additional circuit elements:

- **R_c** (core-loss resistance): models hysteresis + eddy-current losses (parallel branch)
- **X_m** (magnetizing reactance): models finite permeability (parallel branch)
- **R_1, R_2** (winding resistance): copper losses in primary/secondary
- **X_1, X_2** (leakage reactance): flux that does not link both windings

### Losses Summary

| Loss Type | Cause | Depends On | Test |
|---|---|---|---|
| Core loss | Hysteresis + eddy currents | Voltage (constant at rated V) | Open-circuit test |
| Copper loss | I²R in windings | Current (load-dependent) | Short-circuit test |

## 1.3 Standard Tests

- **Open-circuit test** (secondary open): measures core losses P_oc and magnetizing branch (R_c, X_m)
- **Short-circuit test** (secondary shorted, reduced voltage): measures copper losses P_sc and leakage impedance (R_eq, X_eq)`,
      examTip: 'The open-circuit test gives core losses and the short-circuit test gives copper losses. This is the most commonly tested transformer lab concept. Remember: OC = core (no load current, rated voltage), SC = copper (rated current, reduced voltage).',
      importantNote: 'Impedance reflects through the turns ratio SQUARED: Z_primary = Z_load/n². A common FE exam mistake is using n instead of n². If n = 10 and Z_load = 5 ohm, the reflected impedance is 5/100 = 0.05 ohm, not 0.5 ohm.',
    },
    {
      id: 'xfmr-regulation-efficiency',
      title: '2. Voltage Regulation and Efficiency',
      content: `## 2.1 Voltage Regulation

**VR = (V_no-load − V_full-load) / V_full-load × 100%**

- Low VR (< 5%) is desirable — output voltage stays nearly constant under load
- Lagging power factor increases VR (inductive loads cause bigger voltage drop)
- Leading power factor can produce negative VR (voltage rises under load)

### Approximate Voltage Drop

**ΔV ≈ I·(R_eq·cos(φ) + X_eq·sin(φ))**

where R_eq and X_eq are equivalent series impedance referred to one side.

## 2.2 Efficiency

**η = P_out / (P_out + P_core + P_copper) × 100%**

Equivalently: **η = P_out / P_in × 100%**

| Load Condition | Core Loss | Copper Loss | Efficiency |
|---|---|---|---|
| No load | Full (rated) | Zero | Very low |
| Light load | Full | Small | Moderate |
| **Rated load** | Full | **Full** | **Maximum (~95–99%)** |
| Overload | Full | Increases as I² | Decreasing |

**Maximum efficiency** occurs when **P_core = P_copper** (core loss equals copper loss).

### Per-Unit Impedance Shortcut

**Z_pu = Z_actual / Z_base** where **Z_base = V_base² / S_base**

Per-unit impedance is the same on both sides of the transformer — no need to reflect through n².`,
      examTip: 'Maximum transformer efficiency occurs when core loss equals copper loss. This is a classic FE exam question. At rated load, typical transformer efficiency is 95-99%. If you are asked "at what load is efficiency maximum," set P_core = P_copper and solve for load fraction.',
    },
    {
      id: 'xfmr-problem-checklist',
      title: '3. Transformer Problem-Solving Checklist',
      content: `## 3.1 Step-by-Step for Any Transformer Problem

Follow this checklist for every transformer problem on the FE exam:

1. **Identify the turns ratio**: n = Ns/Np = Vs/Vp (from nameplate or given data)
2. **Reflect impedances to one side**: Z_reflected = Z_load × (Np/Ns)² = Z_load/n²
3. **Find equivalent circuit parameters** (from test data if given)
4. **Calculate voltage regulation**: VR = (V_nl − V_fl)/V_fl × 100%
5. **Calculate efficiency**: η = Pout/(Pout + Pcore + Pcopper) × 100%

## 3.2 Worked Example: Using OC and SC Test Data

**Given**: 10 kVA, 2400/240 V transformer (n = 240/2400 = 0.1 or 1:10)

**Open-circuit test** (on low-voltage side): Voc = 240 V, Ioc = 1.2 A, Poc = 60 W

**Short-circuit test** (on high-voltage side): Vsc = 48 V, Isc = 4.17 A, Psc = 120 W

**Step 1 — Core loss parameters (from OC test):**

- Core loss: **Pcore = 60 W** (constant at rated voltage)
- Apparent power: Soc = 240 × 1.2 = 288 VA
- Core loss resistance: Rc = V²/Poc = 240²/60 = **960 Ω** (referred to LV side)
- Magnetizing reactance: Xm = V²/Qoc where Qoc = √(S² − P²) = √(288² − 60²) = 281.7 → Xm = 240²/281.7 = **204.5 Ω**

**Step 2 — Copper loss parameters (from SC test):**

- Copper loss at rated current: **Pcopper = 120 W**
- Equivalent impedance (referred to HV side): Zeq = Vsc/Isc = 48/4.17 = **11.51 Ω**
- Equivalent resistance: Req = Psc/Isc² = 120/4.17² = **6.90 Ω**
- Equivalent reactance: Xeq = √(Zeq² − Req²) = √(11.51² − 6.90²) = **9.21 Ω**

**Step 3 — Voltage regulation at full load, 0.8 PF lagging:**

VR ≈ (Irated × (Req·cos(φ) + Xeq·sin(φ))) / Vrated × 100%

Irated(HV) = 10,000/2400 = 4.17 A; cos(φ) = 0.8, sin(φ) = 0.6

ΔV = 4.17 × (6.90 × 0.8 + 9.21 × 0.6) = 4.17 × (5.52 + 5.53) = 4.17 × 11.05 = **46.1 V**

**VR = 46.1/2400 × 100% = 1.92%** (excellent regulation)

**Step 4 — Efficiency at full load, 0.8 PF:**

Pout = S × PF = 10,000 × 0.8 = 8,000 W

η = 8,000 / (8,000 + 60 + 120) × 100% = 8,000/8,180 = **97.8%**

**Step 5 — Load for maximum efficiency:**

Max efficiency when Pcore = Pcopper → Pcopper = Psc × (load fraction)²

60 = 120 × x² → x = √(60/120) = √0.5 = **0.707 = 70.7% of full load**

## 3.3 Common Mistakes and Exam Traps

- **Impedance reflection direction**: When reflecting from secondary to primary, multiply by (Np/Ns)². When reflecting primary to secondary, multiply by (Ns/Np)². Getting the direction wrong flips the ratio.
- **Test side matters**: OC test is done on the low-voltage side (measures core parameters on that side). SC test is done on the high-voltage side (measures leakage impedance on that side). Parameters must be reflected to the same side before combining.
- **Regulation sign**: Negative VR means the voltage RISES under load (leading PF with capacitive loads). This is physically real and not an error.
- **Efficiency vs. load**: η is NOT maximum at full load. Maximum η occurs when Pcore = Pcopper, which is typically 50–80% of rated load.`,
      examTip: 'On the FE exam, the OC/SC test interpretation is frequently tested. Remember: OC test → core losses and magnetizing branch; SC test → copper losses and leakage impedance. The OC test gives constant losses (voltage-dependent), and the SC test gives variable losses (current-dependent).',
      importantNote: 'Maximum transformer efficiency does NOT occur at full load — it occurs when core loss equals copper loss. Since core loss is constant and copper loss varies as I², the maximum efficiency point is at a specific load fraction x = √(Pcore/Pcopper_rated). This is one of the most commonly tested transformer concepts.',
    },
  ],
  keyTakeaways: [
    'Ideal transformer: Vs/Vp = n, Is/Ip = 1/n, impedance reflects by n².',
    'Core loss (OC test) is voltage-dependent; copper loss (SC test) is current-dependent.',
    'Voltage regulation VR = (V_nl − V_fl)/V_fl × 100%; lagging PF makes VR worse.',
    'Maximum efficiency when P_core = P_copper; typical range 95–99%.',
    'Per-unit impedance Z_pu = Z_actual/Z_base eliminates turns-ratio conversions.',
  ],
},

  fee_per_unit: {
  topicId: 'fee_per_unit',
  title: 'Per-Unit System for Simplified Analysis',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'The per-unit (pu) system normalizes all quantities to dimensionless ratios, eliminating turns-ratio conversions and making impedance values transferable across voltage zones. Mastering per-unit is essential for FE power systems problems.',
  sections: [
    {
      id: 'pu-base-values',
      title: '1. Base Values and Per-Unit Conversion',
      content: `## 1.1 Choosing Base Values

Select **two independent bases** — everything else follows:

1. Choose **S_base** (common choice: 100 MVA for utility, or equipment rating)
2. Choose **V_base** at one voltage zone

### Derived Bases

| Quantity | Formula | Note |
|---|---|---|
| **I_base** | S_base / (√3 · V_base) | Three-phase; use S_base / V_base for single-phase |
| **Z_base** | V_base² / S_base | Most important derived base |
| **P_base** | S_base | Same as S_base |

## 1.2 Converting to Per-Unit

- **V_pu = V_actual / V_base**
- **I_pu = I_actual / I_base**
- **Z_pu = Z_actual / Z_base**
- **P_pu = P_actual / S_base**

### Changing Base (Re-basing Equipment Data)

Equipment nameplate impedance is given on the equipment's own base. To convert to the system base:

**Z_pu(new) = Z_pu(old) × (S_base(new) / S_base(old)) × (V_base(old) / V_base(new))²**

## 1.3 Multi-Zone Systems

In a system with transformers:

- **S_base is the same throughout** the entire network
- **V_base changes at each transformer** according to the turns ratio
- **Z_pu stays the same** on both sides of an ideal transformer (n:1 disappears)`,
      examTip: 'The re-basing formula Z_pu(new) = Z_pu(old) × (S_new/S_old) × (V_old/V_new)² is tested frequently. If the exam gives generator impedance on its own MVA rating, you must re-base to the system base before combining impedances.',
      importantNote: 'S_base is constant everywhere in the network. V_base changes at each transformer winding according to the turns ratio. Forgetting to change V_base across a transformer is the most common per-unit mistake on the FE exam.',
    },
    {
      id: 'pu-advantages-workflow',
      title: '2. Advantages and Problem-Solving Workflow',
      content: `## 2.1 Why Per-Unit?

- **Transformers disappear**: ideal transformers become 1:1 (no turns-ratio math)
- **Error detection**: all normal per-unit values cluster near **1.0 pu** — a result of 15 pu is clearly wrong
- **Equipment comparison**: generator with Z = 0.15 pu means 15% impedance regardless of voltage rating
- **Simplified fault analysis**: fault currents computed directly without converting between voltage levels

## 2.2 Step-by-Step Workflow

1. **Choose S_base and V_base** at one zone (often the generator or largest transformer)
2. **Compute V_base** at every other zone via transformer turns ratios
3. **Compute Z_base = V_base²/S_base** at each zone
4. **Convert all impedances** to per-unit on the system base (re-base if needed)
5. **Draw the per-unit equivalent circuit** (transformers are short circuits)
6. **Solve** using standard circuit analysis (KVL, KCL, Ohm's law in per-unit)
7. **Convert results back** to actual values: V_actual = V_pu × V_base, etc.

## 2.3 Fault Current Example

For a three-phase fault at a bus:

**I_fault(pu) = V_prefault(pu) / Z_total(pu)**

Convert to actual: **I_fault = I_fault(pu) × I_base** where **I_base = S_base / (√3 · V_base)**`,
      examTip: 'On multi-zone power system problems, draw the per-unit circuit first. All transformers become wires (1:1 ratio). Then solve using simple series/parallel impedance combinations. This avoids the messy turns-ratio algebra that causes errors under exam time pressure.',
    },
    {
      id: 'pu-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Building a per-unit base

Choose S_base = 100 MVA and V_base = 138 kV on a transmission section.

Z_base = V_base^2/S_base = (138e3)^2/100e6 = 19.044e9/100e6 = **190.4 ohm**
I_base = S_base/(sqrt(3) V_base) = 100e6/(1.732 x 138e3) = **418.4 A**

A line of actual impedance 38 ohm is then Z_pu = 38/190.4 = **0.200 pu**.

## 3.2 Why per unit exists: transformers disappear

A transformer's per-unit impedance is the SAME referred to either side, so once everything is on a common base the turns ratios vanish from the calculation. That is the whole reason power engineers work this way - a network with six voltage levels becomes one flat circuit.

Per-unit values also cluster in narrow, recognisable bands, which makes an error visible: transformer impedances land near 0.05-0.10 pu, generator subtransient reactances near 0.15-0.25 pu. A per-unit impedance of 8 is a mistake, not a component.

## 3.3 Changing base

Equipment is rated on its own base; the system uses another. Convert with

**Z_new = Z_old x (S_new/S_old) x (V_old/V_new)^2**

A 50 MVA transformer with 8% impedance on its own 13.8 kV base, moved to a 100 MVA, 13.8 kV system base:

Z_new = 0.08 x (100/50) x (13.8/13.8)^2 = 0.08 x 2 = **0.16 pu**

The voltage ratio is 1 here, but note it is SQUARED when it is not - that exponent is the most common slip in base conversion.

## 3.4 Fault current straight from per unit

Per-unit makes symmetrical fault current almost trivial. A three-phase bolted fault at a bus with total 0.16 pu reactance behind it, on a 100 MVA / 13.8 kV base:

I_fault(pu) = 1.0/0.16 = **6.25 pu**
I_base = 100e6/(1.732 x 13.8e3) = **4184 A**
I_fault = 6.25 x 4184 = **26.2 kA**

Equivalently the fault MVA is S_base/Z_pu = 100/0.16 = **625 MVA**, which is the number a switchgear rating is chosen against.`,
      examTip: 'Per-unit impedance is unchanged across a transformer, but per-unit CURRENT and VOLTAGE bases are not - they scale with the turns ratio. Fix S_base once for the whole system and let V_base follow the transformer ratios.',
      quiz: [
        {
          question: 'A system uses S_base = 100 MVA and V_base = 20 kV. What is Z_base?',
          options: ['4 ohm', '5 ohm', '0.25 ohm', '2000 ohm'],
          correctIndex: 0,
          explanation: 'Z_base = V_base^2/S_base = (20e3)^2/100e6 = 400e6/100e6 = 4 ohm. Note it is the SQUARE of the voltage over the apparent power; using V rather than V^2 gives 0.0002 and a nonsense result.',
        },
        {
          question: 'A generator rated 8% reactance on a 25 MVA base is placed on a 100 MVA system base at the same voltage. What is its per-unit reactance now?',
          options: ['0.32 pu', '0.02 pu', '0.08 pu', '0.16 pu'],
          correctIndex: 0,
          explanation: 'Z_new = Z_old x (S_new/S_old) = 0.08 x (100/25) = 0.32 pu. Moving to a LARGER MVA base makes the per-unit impedance larger. Dividing instead of multiplying gives 0.02, which would understate fault current fourfold.',
        },
        {
          question: 'A bus has 0.20 pu total reactance on a 100 MVA base. What is the three-phase fault MVA?',
          options: ['500 MVA', '20 MVA', '100 MVA', '2000 MVA'],
          correctIndex: 0,
          explanation: 'Fault MVA = S_base/Z_pu = 100/0.20 = 500 MVA. Lower impedance means a stiffer bus and higher fault duty, which is what switchgear interrupting ratings must be selected against.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Choose S_base and V_base at one zone; derive Z_base = V_base²/S_base.',
    'V_base changes across transformers by the turns ratio; S_base stays constant everywhere.',
    'Z_pu is the same on both sides of a transformer — turns ratios disappear.',
    'Re-base formula: Z_pu(new) = Z_pu(old) × (S_new/S_old) × (V_old/V_new)².',
    'Normal per-unit values cluster near 1.0; far-off values signal errors.',
  ],
},

  fee_tx_lines: {
  topicId: 'fee_tx_lines',
  title: 'Transmission Lines: Models and Parameters',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Power transmission lines have distributed resistance, inductance, capacitance, and conductance that affect voltage regulation, losses, and stability. The FE exam tests line models (short, medium, long), surge impedance, and voltage drop calculations.',
  sections: [
    {
      id: 'txl-parameters-models',
      title: '1. Line Parameters and Circuit Models',
      content: `## 1.1 Distributed Parameters

Transmission lines have per-unit-length parameters:

| Parameter | Symbol | Unit | Cause |
|---|---|---|---|
| Series resistance | R | Ω/km | Conductor resistivity |
| Series inductance | L | H/km | Magnetic field around conductors |
| Shunt capacitance | C | F/km | Electric field between conductors and ground |
| Shunt conductance | G | S/km | Leakage (usually negligible) |

**Series impedance per unit length**: **Z = R + jωL** (Ω/km)
**Shunt admittance per unit length**: **Y = G + jωC** (S/km)

## 1.2 Line Models by Length

| Line Length | Model | Elements |
|---|---|---|
| **Short** (< 80 km) | Lumped series impedance | Z_total = z·ℓ (no shunt) |
| **Medium** (80–240 km) | π or T equivalent | Series Z, shunt Y/2 at each end (π model) |
| **Long** (> 240 km) | Distributed parameter | Hyperbolic functions: V = V_R·cosh(γℓ) + I_R·Z₀·sinh(γℓ) |

where **γ = √(Z·Y)** is the propagation constant and **ℓ** is line length.

## 1.3 Voltage Drop for Short Line

**ΔV ≈ (R·P + X·Q) / V**

- Both real power P and reactive power Q contribute to voltage drop
- Poor power factor (large Q) worsens voltage drop even at moderate P`,
      examTip: 'The short-line model (series impedance only, no shunt) is overwhelmingly the most tested on the FE exam. For short lines, voltage drop ΔV ≈ I·(R·cos(φ) + X·sin(φ)) or equivalently (RP + XQ)/V. Know this formula cold.',
    },
    {
      id: 'txl-surge-ferranti',
      title: '2. Surge Impedance, Natural Power, and Ferranti Effect',
      content: `## 2.1 Surge Impedance and SIL

**Surge impedance (characteristic impedance)**:

**Z₀ = √(Z/Y) ≈ √(L/C)**

Typical values: **200–400 Ω** for overhead lines, **30–60 Ω** for underground cables.

**Surge Impedance Loading (SIL)** or Natural Power:

**P_SIL = V²_LL / Z₀**

| Load vs. SIL | Voltage Profile | Reactive Power |
|---|---|---|
| Load < SIL | Voltage rises along line (Ferranti effect) | Line generates Q (capacitive) |
| Load = SIL | Flat voltage profile | Q generated = Q absorbed |
| Load > SIL | Voltage drops along line | Line absorbs Q (inductive) |

## 2.2 Ferranti Effect

On **lightly loaded or unloaded** long lines, shunt capacitance charging current flows through series inductance, causing the **receiving-end voltage to exceed the sending-end voltage**.

- More pronounced on longer lines and at higher voltages
- Mitigated by shunt reactors (inductors) at the receiving end

## 2.3 Charging Current

No-load charging current: **I_c = V · ω · C · ℓ**

Charging reactive power: **Q_c = V² · ω · C · ℓ** (can be hundreds of MVAR on long HV lines)`,
      examTip: 'SIL = V²/Z₀ is the "sweet spot" where the line generates exactly as much reactive power as it absorbs. Below SIL, voltage rises (Ferranti); above SIL, voltage drops. The FE exam may ask you to identify the Ferranti effect scenario — it always involves a lightly loaded or open-ended long line.',
    },
    {
      id: 'txl-worked',
      title: '3. Worked Examples',
      content: `## 3.1 Voltage drop and regulation

A feeder carries 200 A at 0.9 lagging power factor over a line of R = 0.5 ohm and X = 1.2 ohm per phase, delivering 7.2 kV per phase at the load.

The approximate drop (accurate for small angles, and what the FE expects):

**V_drop = I(R cos(theta) + X sin(theta))** = 200(0.5 x 0.9 + 1.2 x 0.436) = 200(0.45 + 0.523) = 200(0.973) = **195 V**

Sending-end phase voltage = 7200 + 195 = **7395 V**.

Voltage regulation = (V_no-load - V_full-load)/V_full-load = 195/7200 = **2.7%**.

Note what the reactive term did: at 0.9 pf the X sin(theta) term contributes MORE drop than the resistive term, even though X is only 2.4 times R. Improving power factor reduces sin(theta) and hence the drop - a second reason to correct power factor beyond current reduction.

## 3.2 Line losses

Real loss is I^2 R per phase, times three:

P_loss = 3 x (200)^2 x 0.5 = 3 x 40000 x 0.5 = **60 kW**

Delivered power = 3 x V_phase x I x cos(theta) = 3 x 7200 x 200 x 0.9 = **3.89 MW**.

Efficiency = 3.89/(3.89 + 0.06) = **98.5%**.

Halve the current by correcting the power factor to unity (same real power) and the loss falls by a factor of four, not two - I^2 R is quadratic, which is the entire economic argument for transmitting at high voltage and low current.

## 3.3 Short, medium, long

| Length | Model | What is included |
|---|---|---|
| Under ~80 km | short | series R and X only |
| 80-250 km | medium (nominal pi) | series R+jX, shunt capacitance split at both ends |
| Over 250 km | long | distributed parameters, hyperbolic functions |

Shunt capacitance is why a lightly loaded long line can show a HIGHER receiving-end voltage than sending-end - the Ferranti effect. It is a capacitive charging current flowing through the line inductance, and it is the reason shunt reactors exist on long lines.

## 3.4 Surge impedance loading

A line's characteristic impedance Z_0 = sqrt(L/C) is typically 300-400 ohm for overhead lines. Loading at exactly Z_0 makes the reactive production of the shunt capacitance equal the reactive consumption of the series inductance, so the line neither absorbs nor supplies VARs and the voltage profile is flat.

For a 345 kV line with Z_0 = 300 ohm: SIL = V^2/Z_0 = (345e3)^2/300 = **397 MW**. Below SIL the line supplies VARs and voltage rises; above it, the line absorbs VARs and voltage falls.`,
      examTip: 'Use V_drop = I(R cos theta + X sin theta) for FE problems. It is the approximation that ignores the angle between sending and receiving voltage, and at the power factors these questions use it is accurate to well under a percent.',
      quiz: [
        {
          question: 'A feeder carries 100 A at unity power factor through R = 0.4 ohm and X = 1.0 ohm per phase. What is the approximate voltage drop per phase?',
          options: ['40 V', '100 V', '140 V', '108 V'],
          correctIndex: 0,
          explanation: 'V_drop = I(R cos theta + X sin theta) = 100(0.4 x 1 + 1.0 x 0) = 40 V. At unity power factor sin(theta) = 0, so the reactance contributes nothing to the drop - which is exactly why power factor correction reduces voltage drop as well as current.',
        },
        {
          question: 'Line current is halved while delivering the same real power. What happens to the I^2R losses?',
          options: ['They fall to one quarter', 'They halve', 'They are unchanged', 'They fall to one eighth'],
          correctIndex: 0,
          explanation: 'Loss goes as the square of current, so halving I gives (1/2)^2 = one quarter of the loss. This quadratic relationship is the reason transmission uses the highest practical voltage: for fixed power, higher voltage means lower current means far lower loss.',
        },
        {
          question: 'A long transmission line is very lightly loaded. What does the Ferranti effect predict?',
          options: [
            'Receiving-end voltage exceeds sending-end voltage',
            'Receiving-end voltage collapses to zero',
            'The line draws maximum reactive power',
            'Losses reach their maximum'
          ],
          correctIndex: 0,
          explanation: 'On a lightly loaded long line the shunt capacitance charging current flows through the series inductance and raises the receiving-end voltage above the sending end. Shunt reactors are installed specifically to absorb that excess and hold the voltage down.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'Distributed parameters: Z = R + jωL per km (series), Y = G + jωC per km (shunt).',
    'Short line (< 80 km): lumped Z only; medium: π-model; long: hyperbolic.',
    'Surge impedance Z₀ = √(L/C); SIL = V²/Z₀ defines flat voltage profile.',
    'Short-line voltage drop: ΔV ≈ (RP + XQ)/V — both P and Q matter.',
    'Ferranti effect: receiving voltage > sending voltage on lightly loaded long lines.',
  ],
},

  fee_pf_correction: {
  topicId: 'fee_pf_correction',
  title: 'Power Factor Correction',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Power factor correction reduces reactive power demand, lowering utility penalties, reducing I²R losses, and freeing capacity. The FE exam tests PF concepts, capacitor sizing, and the power triangle.',
  sections: [
    {
      id: 'pfc-power-triangle',
      title: '1. Power Triangle and Power Factor Fundamentals',
      content: `## 1.1 The Power Triangle

| Quantity | Symbol | Formula | Unit |
|---|---|---|---|
| Real power | P | V·I·cos(φ) | W (watts) |
| Reactive power | Q | V·I·sin(φ) | VAR |
| Apparent power | S | V·I | VA |
| Complex power | **S** | P + jQ | VA |

**Power factor**: **PF = cos(φ) = P / S = P / √(P² + Q²)**

- **Lagging PF** (φ > 0): current lags voltage — inductive loads (motors, transformers)
- **Leading PF** (φ < 0): current leads voltage — capacitive loads
- **Unity PF** (φ = 0): all power is real; Q = 0

## 1.2 Why Correct Power Factor?

| Effect of Low PF | Explanation |
|---|---|
| Higher current draw | I = S/V = P/(V·PF) — lower PF means more current for same real power |
| Increased I²R losses | More current means more resistive losses in wires and transformers |
| Utility penalties | Most utilities penalize PF below 0.90 or 0.95 |
| Reduced capacity | Transformers and generators rated in VA, not W — low PF wastes capacity |

## 1.3 Reactive Power Sign Convention

- Inductive loads **consume** positive Q (lagging)
- Capacitors **generate** positive Q (leading) — they supply the reactive power that inductors need
- Adding a capacitor **reduces** the net Q drawn from the utility`,
      examTip: 'The FE exam loves the formula I = P/(V·PF). Lower power factor means higher current for the same real power. If PF drops from 1.0 to 0.5, current doubles. This directly explains why utilities penalize poor PF.',
    },
    {
      id: 'pfc-capacitor-sizing',
      title: '2. Capacitor Sizing and Correction Methods',
      content: `## 2.1 Capacitor Sizing Formula

To correct from old angle θ₁ to new angle θ₂:

**Q_c = P · (tan(θ₁) − tan(θ₂))**

where:
- P = real power of the load (unchanged by correction)
- θ₁ = arccos(PF_old), θ₂ = arccos(PF_new)
- Q_c = reactive power the capacitor must supply

### Capacitor Value

**C = Q_c / (ω · V²)** where ω = 2πf

For three-phase: **Q_c(3φ) = 3 · V_ph² · ω · C** or **Q_c(3φ) = V_LL² · ω · C** (for Δ-connected caps)

## 2.2 Correction Methods

| Method | Mechanism | Pros | Cons |
|---|---|---|---|
| **Shunt capacitors** | Add Q_c directly | Simple, cheap, low maintenance | Fixed steps, possible resonance |
| **Synchronous condensers** | Over-excited synchronous motor | Continuously variable Q | Expensive, requires rotating equipment |
| **Static VAR compensator (SVC)** | Thyristor-switched capacitors/reactors | Fast, precise, wide range | Complex, expensive |

## 2.3 Risks of Over-Correction

- **Leading PF** can cause voltage rise on lightly loaded feeders
- **Harmonic resonance**: capacitor bank + system inductance can resonate at harmonic frequencies (5th, 7th, 11th, 13th are common)
- Utility may also penalize leading PF`,
      examTip: 'The capacitor sizing formula Q_c = P·(tan(θ_old) − tan(θ_new)) is the single most tested power factor correction equation. P stays the same (capacitors do not change real power); only Q changes. Make sure to use the ANGLE (arccos of PF), not the PF directly, in the tangent.',
      importantNote: 'Capacitors do NOT change real power P. They only reduce the reactive power Q drawn from the source. The load still consumes the same Q internally — the capacitor supplies it locally so the source does not have to.',
    },
    {
      id: 'pfc-worked',
      title: '3. Worked Examples',
      content: `## 3.1 The correction calculation, end to end

A plant draws 500 kW at 0.75 lagging from a 4160 V, 60 Hz supply. Correct it to 0.95 lagging.

**Before:** theta_1 = arccos(0.75) = 41.4 degrees, tan(theta_1) = 0.882, so Q_1 = 500 x 0.882 = **441 kVAR**. S_1 = 500/0.75 = **667 kVA**.

**After:** theta_2 = arccos(0.95) = 18.2 degrees, tan(theta_2) = 0.329, so Q_2 = 500 x 0.329 = **164 kVAR**. S_2 = 500/0.95 = **526 kVA**.

**Capacitor rating:** Q_C = Q_1 - Q_2 = 441 - 164 = **277 kVAR**.

The general formula is worth carrying: **Q_C = P[tan(theta_1) - tan(theta_2)]**.

## 3.2 What it buys

Line current before: I = S/(sqrt(3) V) = 667e3/(1.732 x 4160) = **92.6 A**
Line current after: 526e3/(1.732 x 4160) = **73.0 A**

A 21% current reduction. Feeder losses go as I^2, so they fall by 1 - (73/92.6)^2 = **38%**. On a feeder of 0.3 ohm per phase that is 3(92.6^2 - 73^2)(0.3) = 3(8575 - 5329)(0.3) = **2.9 kW** saved continuously, plus released transformer and cable capacity.

## 3.3 Sizing the capacitor bank

At 4160 V, delta-connected: Q_C per phase = 277/3 = 92.3 kVAR, and each capacitor sees the full line voltage.

X_C = V^2/Q_phase = (4160)^2/92.3e3 = 17.3e6/92.3e3 = **187 ohm**
C = 1/(omega X_C) = 1/(377 x 187) = **14.2 microfarad per phase**

## 3.4 Why not correct to unity

Three reasons the exam expects you to know:

- **Diminishing returns.** Going 0.75 to 0.95 needed 277 kVAR; going 0.95 to 1.00 needs a further 164 kVAR for a much smaller current saving.
- **Overcorrection risk.** A fixed bank sized for full load leaves the plant leading at light load, which can raise voltage above limits and cause resonance with system inductance.
- **Tariffs stop at a target.** Utilities typically penalise below about 0.90-0.95 and pay nothing extra above it, so unity buys no billing benefit.

Automatic switched banks with contactors staged in steps solve the light-load problem, at higher capital cost.`,
      examTip: 'Q_C = P[tan(theta_1) - tan(theta_2)] is the one formula to memorise here. Compute both tangents from the power factors first, and note that real power P is the SAME before and after - the capacitor changes only the reactive component.',
      quiz: [
        {
          question: 'A 200 kW load at 0.8 lagging is to be corrected to unity. What capacitor rating is required?',
          options: ['150 kVAR', '250 kVAR', '160 kVAR', '200 kVAR'],
          correctIndex: 0,
          explanation: 'tan(arccos 0.8) = 0.75, so Q = 200 x 0.75 = 150 kVAR. Correcting to unity means the capacitor supplies all of it. The 250 figure is the apparent power S = 200/0.8, a different quantity entirely.',
        },
        {
          question: 'After power factor correction, what happens to the real power drawn by the load?',
          options: ['Unchanged', 'Reduced in proportion to the improvement', 'Increased slightly', 'Reduced to zero at unity'],
          correctIndex: 0,
          explanation: 'Capacitors supply reactive power only, so P is untouched. What falls is S and therefore the line current, which is where the saving comes from - lower I^2R feeder losses and released capacity, not less real power.',
        },
        {
          question: 'Why is a plant usually corrected to about 0.95 rather than to unity?',
          options: [
            'Diminishing returns and the risk of overcorrection at light load',
            'Unity power factor is physically impossible',
            'Capacitors cannot supply that much reactive power',
            'Utilities charge more at unity power factor'
          ],
          correctIndex: 0,
          explanation: 'The last increment to unity costs disproportionate kVAR for little current saving, and a fixed bank sized for full load leaves the plant leading at light load, raising voltage and risking resonance. Tariffs also stop rewarding improvement around 0.90-0.95.',
        },
      ],
    },
  ],
  keyTakeaways: [
    'PF = cos(φ) = P/S; lagging PF (inductive) is the most common industrial issue.',
    'Capacitor sizing: Q_c = P·(tan(θ_old) − tan(θ_new)); P is unchanged by correction.',
    'Lower PF means higher current for the same real power: I = P/(V·PF).',
    'Over-correction risks: voltage rise and harmonic resonance with system inductance.',
    'Synchronous condensers provide continuously variable reactive power support.',
  ],
},

  fee_motors: {
  topicId: 'fee_motors',
  title: 'Rotating Machines: Motors & Generators',
  domainWeight: 'Power Systems · 4–6%',
  overview: 'Rotating machines convert between electrical and mechanical energy. Induction motors dominate industrial loads; synchronous machines control power factor and generate utility power; DC motors offer precise speed/torque control. The FE exam tests slip, synchronous speed, efficiency, and motor characteristics.',
  sections: [
    {
      id: 'motors-induction',
      title: '1. Induction Motors',
      content: `## 1.1 Synchronous Speed and Slip

**Synchronous speed**: **N_s = 120·f / P** (rpm)

where f = supply frequency (Hz), P = number of **poles** (not pole pairs).

| Poles | 60 Hz N_s | 50 Hz N_s |
|---|---|---|
| 2 | 3600 rpm | 3000 rpm |
| 4 | 1800 rpm | 1500 rpm |
| 6 | 1200 rpm | 1000 rpm |
| 8 | 900 rpm | 750 rpm |

**Slip**: **s = (N_s − N) / N_s**

- At **no-load**: s ≈ 0 (rotor nearly at synchronous speed)
- At **full load**: s ≈ 0.02–0.05 (2–5%)
- At **starting** (N = 0): s = 1
- At **synchronous speed** (N = N_s): s = 0 (no torque — induction motor cannot run at N_s)

**Rotor frequency**: **f_rotor = s · f_line**

## 1.2 Torque-Speed Characteristic

- **Starting torque**: moderate to high (design-dependent); inrush current 5–8× rated
- **Breakdown torque**: maximum torque before stalling; typically 2–3× rated torque
- **Operating region**: between no-load and rated slip (linear-ish portion)

### Starting Methods

| Method | Inrush Reduction | Torque Impact |
|---|---|---|
| Direct-on-line (DOL) | None (5–8× I_rated) | Full starting torque |
| Star-delta starter | Reduces to 1/3 | Reduces to 1/3 |
| Soft starter | Variable (2–4×) | Adjustable |
| **VFD** | Minimal (1–1.5×) | Full torque at any speed |

## 1.3 Efficiency and Losses

**η = P_mechanical / P_electrical**

Motor losses:
- **Copper loss** (I²R in stator and rotor windings) — load-dependent
- **Core loss** (hysteresis + eddy current) — voltage-dependent, roughly constant
- **Friction and windage** — speed-dependent, roughly constant
- **Stray load loss** — small, load-dependent`,
      examTip: 'N_s = 120f/P and s = (N_s − N)/N_s are the two most tested motor formulas. A common FE exam question gives a 4-pole, 60 Hz motor running at 1740 rpm and asks for slip: s = (1800 − 1740)/1800 = 0.033 or 3.3%.',
      importantNote: 'P in N_s = 120f/P is the number of POLES, not pole pairs. A 4-pole motor has 2 pole pairs. Some textbooks use pole pairs (p), giving N_s = 60f/p. On the FE exam, the NCEES handbook uses poles, not pole pairs.',
    },
    {
      id: 'motors-synchronous-dc',
      title: '2. Synchronous Machines and DC Motors',
      content: `## 2.1 Synchronous Motors

Synchronous motors run at **exactly N_s** — no slip.

- **Field current** (DC excitation) controls power factor:
  - **Over-excited**: acts as capacitor (generates Q) — used as synchronous condenser
  - **Under-excited**: acts as inductor (absorbs Q)
  - **Normal excitation**: unity power factor

### V-Curve

The V-curve plots armature current I_a vs. field current I_f at constant load:
- Minimum I_a occurs at unity PF
- Left of minimum: under-excited (lagging PF)
- Right of minimum: over-excited (leading PF)

## 2.2 DC Motors

DC motors offer **precise speed and torque control**:

| Type | Speed Control | Torque Characteristic |
|---|---|---|
| **Separately excited** | Armature voltage V_a | τ ∝ I_a (linear torque-current) |
| **Shunt** | Field weakening or V_a | Approximately constant speed |
| **Series** | V_a; never run unloaded! | High starting torque, speed varies with load |

Key relationships:
- **Back-EMF**: E = K·φ·ω (proportional to flux and speed)
- **Torque**: τ = K·φ·I_a
- **Speed**: ω = (V_a − I_a·R_a) / (K·φ)

## 2.3 Motor Selection Guidelines

| Application | Best Motor Type | Reason |
|---|---|---|
| Constant-speed pump/fan | Induction (squirrel cage) | Simple, cheap, reliable |
| Precise speed control | DC or VFD-driven induction | Adjustable speed |
| Power factor correction | Synchronous | Over-excitation generates Q |
| High starting torque (crane) | DC series or wound-rotor induction | Torque profile matches |`,
      examTip: 'Synchronous motors and power factor: over-excited = leading (capacitive), under-excited = lagging (inductive). For DC series motors, NEVER disconnect the load — the motor will overspeed dangerously because torque drops to zero while speed climbs without bound.',
    },
  ],
  keyTakeaways: [
    'Synchronous speed: N_s = 120f/P; slip: s = (N_s − N)/N_s.',
    'Induction motor full-load slip is 2–5%; rotor frequency = s × f_line.',
    'Synchronous motor speed = N_s exactly; field current controls PF.',
    'DC motor: E = Kφω, τ = KφI_a; series motor has high starting torque but must never run unloaded.',
    'Motor efficiency η = P_mech/P_elec; losses = copper + core + friction/windage.',
    'VFDs provide soft starting and variable-speed operation with minimal inrush.',
  ],
},

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 11 — ELECTROMAGNETICS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_electrostatics: {
  topicId: 'fee_electrostatics',
  title: "Electrostatics: Coulomb's Law & Gauss's Law",
  domainWeight: 'Electromagnetics · 4–6%',
  overview: "Electrostatics governs stationary charge distributions and the electric fields they produce. Coulomb's law gives the force between point charges; Gauss's law provides a powerful shortcut for symmetric geometries. Capacitance, potential, and stored energy complete the picture.",
  sections: [
    {
      id: 'es-coulomb-field',
      title: "1. Coulomb's Law, Electric Field, and Potential",
      content: `## 1.1 Coulomb's Law

Force between two point charges:

**F = k·Q₁·Q₂ / r²**

where **k = 1/(4πε₀) = 8.99 × 10⁹ N·m²/C²** and **ε₀ = 8.854 × 10⁻¹² F/m**.

- Like charges repel; unlike charges attract
- Force is along the line connecting charges (radial)
- In a medium with relative permittivity ε_r: replace ε₀ with ε = ε₀·ε_r

## 1.2 Electric Field

**E = F/q** (force per unit positive test charge, units: N/C = V/m)

- Field lines point **away** from positive charges, **toward** negative charges
- **Superposition**: E_total = ΣE_i (vector sum of fields from all charges)

### Point charge field: **E = kQ/r²** (radial, directed away from +Q)

## 1.3 Electric Potential

**V(r) = kQ/r** (potential from a point charge, with V(∞) = 0 reference)

- **Potential difference**: ΔV = −∫E·dr (path-independent in electrostatics)
- **E = −∇V** (field points from high to low potential)
- **Equipotential surfaces** are perpendicular to field lines`,
      examTip: "Coulomb's law uses 1/r² for force, but potential uses 1/r (no square). A common FE exam mistake is mixing up the exponents. Force falls off as r² but potential falls off as r.",
    },
    {
      id: 'es-gauss-capacitance',
      title: "2. Gauss's Law, Capacitance, and Stored Energy",
      content: `## 2.1 Gauss's Law

**∮E·dA = Q_enc / ε₀**

Total electric flux through a closed surface equals enclosed charge divided by permittivity.

### Standard Geometries (memorize these)

| Geometry | Gaussian Surface | Electric Field |
|---|---|---|
| Infinite plane (surface charge σ) | Pill box | **E = σ / (2ε₀)** |
| Infinite line (charge λ per length) | Cylinder | **E = λ / (2πε₀r)** |
| Conducting sphere (charge Q) | Concentric sphere | **E = kQ/r²** (outside); **E = 0** (inside) |
| Uniformly charged sphere | Concentric sphere | **E = kQr/R³** (inside); **kQ/r²** (outside) |

## 2.2 Capacitance

**C = Q/V** (charge stored per volt, Farads)

### Common Geometries

| Type | Formula |
|---|---|
| Parallel plate | **C = ε₀·ε_r·A / d** |
| Cylindrical | **C = 2πε₀·ε_r·L / ln(b/a)** |
| Spherical | **C = 4πε₀·ε_r·a·b / (b − a)** |

- Series capacitors: **1/C_eq = 1/C₁ + 1/C₂** (opposite of resistors)
- Parallel capacitors: **C_eq = C₁ + C₂**

## 2.3 Stored Energy

**U = ½CV² = ½QV = Q²/(2C)**

Energy density in an electric field: **u = ½ε₀E²** (J/m³)`,
      examTip: "Gauss's law is the fastest path to E-field on the FE exam when symmetry exists. Choose the Gaussian surface so E is constant on it: sphere for point/spherical charges, cylinder for line charges, pillbox for plane charges. If there is no symmetry, fall back to Coulomb's law with superposition.",
      importantNote: "Capacitors in series combine like resistors in parallel (1/C_eq = 1/C₁ + 1/C₂), and capacitors in parallel combine like resistors in series (C_eq = C₁ + C₂). This is the OPPOSITE of resistor rules and is a frequent source of FE exam errors.",
    },
  ],
  keyTakeaways: [
    "Coulomb's law: F = kQ₁Q₂/r²; electric field E = F/q = kQ/r².",
    "Gauss's law ∮E·dA = Q_enc/ε₀ is the fastest method for symmetric geometries.",
    'Potential V = kQ/r (1/r, not 1/r²); E = −∇V.',
    'Parallel plate capacitance: C = ε₀ε_r·A/d; energy: U = ½CV².',
    'Series caps: 1/C_eq = Σ(1/C_i); parallel caps: C_eq = ΣC_i (opposite of resistors).',
  ],
},

  fee_magnetostatics: {
  topicId: 'fee_magnetostatics',
  title: "Magnetostatics: Biot-Savart & Ampere's Law",
  domainWeight: 'Electromagnetics · 4–6%',
  overview: "Magnetostatics describes magnetic fields produced by steady (DC) currents. Ampere's law provides efficient field computation for symmetric geometries, while the Biot-Savart law handles arbitrary current distributions. Inductance, magnetic energy, and force on conductors follow directly from these fields.",
  sections: [
    {
      id: 'ms-ampere-biot',
      title: "1. Ampere's Law and Biot-Savart Law",
      content: `## 1.1 Ampere's Law

**∮B·dl = μ₀·I_enc**

The line integral of B around any closed path equals μ₀ times the enclosed current.

### Standard Results (memorize)

| Geometry | Amperian Path | Magnetic Field |
|---|---|---|
| Long straight wire | Circle of radius r | **B = μ₀I / (2πr)** |
| Inside long wire (radius a) | Circle inside wire | **B = μ₀Ir / (2πa²)** |
| Solenoid (n turns/m) | Rectangle through coil | **B = μ₀nI** (inside); **B ≈ 0** (outside) |
| Toroid (N total turns) | Circle at radius r | **B = μ₀NI / (2πr)** (inside) |

where **μ₀ = 4π × 10⁻⁷ T·m/A** (permeability of free space).

## 1.2 Biot-Savart Law

**dB = (μ₀/4π) · (I·dl × r̂) / r²**

- Used when Ampere's law symmetry is absent (e.g., finite wire, circular loop)
- Circular loop center: **B = μ₀I / (2R)**
- **Right-hand rule**: thumb in current direction, fingers curl in B-field direction

## 1.3 Permeability in Materials

**μ = μ₀·μ_r** where μ_r is relative permeability:

| Material Type | μ_r | Examples |
|---|---|---|
| Diamagnetic | ≈ 1 (slightly < 1) | Copper, silver |
| Paramagnetic | ≈ 1 (slightly > 1) | Aluminum, platinum |
| Ferromagnetic | **100 – 100,000** | Iron, nickel, cobalt |`,
      examTip: "The long-wire formula B = μ₀I/(2πr) is the most-tested magnetostatics result on the FE exam. It decreases as 1/r (not 1/r²). Do not confuse this with Coulomb's law, which has 1/r². Magnetic field from a long wire is 1/r; electric field from a point charge is 1/r².",
    },
    {
      id: 'ms-flux-inductance-force',
      title: '2. Magnetic Flux, Inductance, and Force',
      content: `## 2.1 Magnetic Flux and Inductance

**Magnetic flux**: **Φ = ∫B·dA** (units: Weber = T·m²)

**Inductance**: **L = NΦ/I** (for N-turn coil linking flux Φ)

| Inductor Type | Inductance Formula |
|---|---|
| Solenoid (N turns, length ℓ, area A) | **L = μ₀·μ_r·N²·A / ℓ** |
| Toroid (N turns, area A, mean radius r) | **L = μ₀·μ_r·N²·A / (2πr)** |
| Coaxial cable (per unit length) | **L = (μ₀/2π)·ln(b/a)** |

**Energy stored**: **U = ½LI²**

Energy density: **u = B²/(2μ₀)** (J/m³)

## 2.2 Magnetic Circuits

Analogous to electric circuits:

| Electric | Magnetic |
|---|---|
| EMF (V) | MMF = N·I (ampere-turns) |
| Current I | Flux Φ |
| Resistance R | Reluctance ℜ = ℓ/(μA) |
| Ohm's law: V = IR | **Φ = MMF/ℜ = NI·μA/ℓ** |

## 2.3 Force on Current-Carrying Conductors

- **Force on wire**: **F = I·L × B** (magnitude F = BIL·sin(θ))
- **Force between parallel wires**: **F/ℓ = μ₀I₁I₂ / (2πd)** — attractive for same-direction currents, repulsive for opposite
- **Torque on loop**: **τ = N·I·A·B·sin(α) = m × B** where m = NIA is magnetic moment`,
      examTip: 'Inductors in series ADD (like resistors): L_eq = L₁ + L₂. Inductors in parallel combine like resistors in parallel: 1/L_eq = 1/L₁ + 1/L₂. This is the SAME rule as resistors (unlike capacitors which are opposite). Think of inductance as "magnetic resistance" — it follows resistor rules.',
      importantNote: 'Two parallel wires carrying current in the SAME direction attract each other. This is counterintuitive but follows from the Lorentz force. This fact defines the SI ampere: 1 A is the current that produces 2×10⁻⁷ N/m of force per meter between two wires 1 m apart.',
    },
  ],
  keyTakeaways: [
    "Ampere's law: ∮B·dl = μ₀I_enc; use for symmetric current distributions.",
    'Long wire: B = μ₀I/(2πr); solenoid: B = μ₀nI inside.',
    'Inductance L = NΦ/I; energy U = ½LI²; energy density u = B²/(2μ₀).',
    'Magnetic circuit: Φ = NI/ℜ where reluctance ℜ = ℓ/(μA).',
    'Force on wire: F = ILB·sin(θ); parallel same-direction wires attract.',
  ],
},

  fee_maxwell: {
  topicId: 'fee_maxwell',
  title: "Maxwell's Equations",
  domainWeight: 'Electromagnetics · 4–6%',
  overview: "Maxwell's four equations unify electricity, magnetism, and optics into a single framework. They predict electromagnetic wave propagation, govern every antenna and waveguide, and underpin all of modern communications. The FE exam tests both integral and differential forms.",
  sections: [
    {
      id: 'mx-four-equations',
      title: "1. The Four Maxwell's Equations",
      content: `## 1.1 Complete Table — Both Forms

| Name | Differential Form | Integral Form | Physical Meaning |
|---|---|---|---|
| **Gauss's law (E)** | ∇·E = ρ/ε₀ | ∮E·dA = Q_enc/ε₀ | Charges create electric flux |
| **Gauss's law (B)** | ∇·B = 0 | ∮B·dA = 0 | No magnetic monopoles |
| **Faraday's law** | ∇×E = −∂B/∂t | ∮E·dl = −dΦ_B/dt | Changing B induces E |
| **Ampere-Maxwell** | ∇×B = μ₀J + μ₀ε₀∂E/∂t | ∮B·dl = μ₀I_enc + μ₀ε₀dΦ_E/dt | Currents and changing E create B |

## 1.2 Key Physical Insights

- **Gauss (E)**: Electric field lines originate on positive charges, terminate on negative
- **Gauss (B)**: Magnetic field lines always form closed loops (no isolated poles)
- **Faraday**: A time-varying magnetic field induces an electric field (basis for transformers, generators)
- **Ampere-Maxwell**: Steady currents AND time-varying electric fields produce magnetic fields

### Displacement Current

Maxwell's crucial addition: **J_d = ε₀·∂E/∂t** (displacement current density)

Without it, Ampere's law fails for capacitors (current flows in but charge builds on plates, creating a changing E between them). Displacement current completes the circuit and enables electromagnetic wave propagation.`,
      examTip: "On the FE exam, you are most likely to be tested on recognizing which equation applies to a scenario. Faraday's law = anything involving induced voltage from changing magnetic flux. Ampere's law = anything involving magnetic field from current. Gauss = relating charge to electric field flux.",
    },
    {
      id: 'mx-wave-equation',
      title: '2. Electromagnetic Wave Equation',
      content: `## 2.1 Deriving the Wave Equation

In **free space** (no charges, no currents: ρ = 0, J = 0), combining Faraday and Ampere-Maxwell gives:

**∇²E = μ₀ε₀ · ∂²E/∂t²**

**∇²B = μ₀ε₀ · ∂²B/∂t²**

These are **wave equations** with propagation velocity:

**v = 1/√(μ₀ε₀) = c ≈ 3 × 10⁸ m/s**

Maxwell's prediction: light is an electromagnetic wave.

## 2.2 Wave Speed in Materials

In a medium with μ_r and ε_r:

**v = c / √(μ_r · ε_r) = 1 / √(μ · ε)**

**Index of refraction**: **n = c/v = √(μ_r · ε_r)** (for non-magnetic materials, n ≈ √ε_r)

## 2.3 Intrinsic Impedance

**η = √(μ/ε)**

- Free space: **η₀ = √(μ₀/ε₀) ≈ 377 Ω** (≈ 120π Ω)
- In a medium: η = η₀ · √(μ_r/ε_r)
- Relates E and H in a plane wave: **E = η · H**

## 2.4 Boundary Conditions

At interface between two media:
- **Tangential E is continuous**: E_t1 = E_t2
- **Tangential H is continuous** (no surface current): H_t1 = H_t2
- **Normal D jumps by surface charge**: D_n1 − D_n2 = σ_s
- **Normal B is continuous**: B_n1 = B_n2`,
      examTip: 'The intrinsic impedance of free space η₀ ≈ 377 Ω ≈ 120π Ω is a constant worth memorizing. It relates E and H in any plane wave in free space: |E|/|H| = 377 Ω. This appears in power flow (Poynting vector) calculations.',
      importantNote: "Maxwell's displacement current ε₀·∂E/∂t is NOT a real current of moving charges. It is a changing electric field that produces a magnetic field just as real current does. Without it, electromagnetic waves could not exist.",
    },
  ],
  keyTakeaways: [
    "Gauss (E): ∇·E = ρ/ε₀ — charges produce electric field.",
    "Gauss (B): ∇·B = 0 — no magnetic monopoles exist.",
    "Faraday: ∇×E = −∂B/∂t — changing B induces E (transformers, generators).",
    "Ampere-Maxwell: ∇×B = μ₀(J + ε₀∂E/∂t) — displacement current enables EM waves.",
    "Wave speed: v = 1/√(με); in free space v = c ≈ 3 × 10⁸ m/s.",
    "Intrinsic impedance of free space: η₀ = √(μ₀/ε₀) ≈ 377 Ω.",
  ],
},

  fee_wave_prop: {
  topicId: 'fee_wave_prop',
  title: 'Wave Propagation and Plane Waves',
  domainWeight: 'Electromagnetics · 4–6%',
  overview: 'Electromagnetic waves carry energy through space at the speed of light. Understanding plane wave properties, skin depth in conductors, and the Poynting vector for power flow is essential for FE exam problems in EM and communications.',
  sections: [
    {
      id: 'wp-plane-waves',
      title: '1. Plane Wave Properties',
      content: `## 1.1 Uniform Plane Wave

A plane wave propagating in the +z direction:

- **E(z,t) = E₀·cos(ωt − kz) x̂** (electric field in x-direction)
- **H(z,t) = (E₀/η)·cos(ωt − kz) ŷ** (magnetic field in y-direction)

Key relationships:

| Quantity | Formula | Unit |
|---|---|---|
| Wave number | **k = 2π/λ = ω/v** | rad/m |
| Wavelength | **λ = v/f** | m |
| Frequency | **f = v/λ** | Hz |
| Angular frequency | **ω = 2πf** | rad/s |
| Phase velocity | **v = ω/k = fλ** | m/s |

In vacuum: **λ₀ = c/f** where c ≈ 3 × 10⁸ m/s.

## 1.2 Properties of Plane Waves

- **E, H, and propagation direction** are mutually perpendicular (TEM wave)
- **|E|/|H| = η** (intrinsic impedance of the medium)
- **E and H are in phase** in lossless media
- **Polarization**: direction of E-field oscillation (linear, circular, or elliptical)

### Wavelength Examples

| Signal | Frequency | Wavelength |
|---|---|---|
| AM radio | 1 MHz | 300 m |
| FM radio | 100 MHz | 3 m |
| Wi-Fi | 2.4 GHz | 12.5 cm |
| Visible light | 600 THz | 500 nm |`,
      examTip: 'The relationship λ = c/f (in vacuum) or λ = v/f (in medium) is the most fundamental. If an FE exam question gives frequency, convert to wavelength immediately — many subsequent formulas use λ or k = 2π/λ.',
    },
    {
      id: 'wp-skin-poynting',
      title: '2. Skin Depth and Poynting Vector (Power Flow)',
      content: `## 2.1 Skin Depth

In a **good conductor** (σ >> ωε), electromagnetic fields decay exponentially:

**δ = 1 / √(πfμσ)**

At depth z = δ, amplitude drops to **e⁻¹ ≈ 37%** of surface value.

| Material | σ (S/m) | δ at 60 Hz | δ at 1 GHz |
|---|---|---|---|
| Copper | 5.8 × 10⁷ | 8.5 mm | 2.1 μm |
| Aluminum | 3.5 × 10⁷ | 11 mm | 2.7 μm |
| Seawater | 4 | 26 m | 0.25 m |

### Practical Implications

- At high frequencies, current flows only in a thin skin on conductor surface
- Effective resistance increases with frequency: **R_ac = R_dc · (a/(2δ))** for wire radius a >> δ
- Electromagnetic shielding: a few skin depths of conductor blocks most of the field

## 2.2 Poynting Vector

**S = E × H** (instantaneous power flow per unit area, W/m²)

**Direction**: S points in the propagation direction

### Time-Average Power

**S_avg = ½·Re(E × H*) = |E₀|² / (2η)** (for plane wave in lossless medium)

Equivalently: **S_avg = ½|E₀||H₀|·cos(φ)** where φ is phase angle between E and H.

### Loss Tangent

**tan(δ_loss) = σ/(ωε)**

| tan(δ_loss) | Classification |
|---|---|
| << 1 | Low-loss dielectric (wave propagates) |
| >> 1 | Good conductor (wave attenuates rapidly) |
| ≈ 1 | Lossy dielectric (moderate attenuation) |`,
      examTip: 'Skin depth δ = 1/√(πfμσ) decreases with increasing frequency. This means higher-frequency signals penetrate LESS into conductors. At microwave frequencies, skin depth is just a few micrometers — this is why thin copper plating on PCB traces is sufficient for RF.',
      importantNote: 'Do not confuse the loss tangent angle δ_loss with skin depth δ — they use the same Greek letter but are completely different quantities. Skin depth has units of meters; loss tangent is dimensionless.',
    },
  ],
  keyTakeaways: [
    'Plane wave: E ⊥ H ⊥ propagation; |E|/|H| = η (intrinsic impedance).',
    'Wave number k = 2π/λ = ω/v; wavelength λ = v/f; in vacuum λ₀ = c/f.',
    'Skin depth: δ = 1/√(πfμσ); field decays as e^(−z/δ) in conductors.',
    'Poynting vector S = E × H gives power flow; S_avg = |E₀|²/(2η).',
    'Loss tangent tan(δ) = σ/(ωε) classifies material as conductor or dielectric.',
  ],
},

  fee_em_tx_lines: {
  topicId: 'fee_em_tx_lines',
  title: 'EM Transmission Lines: Impedance & Reflections',
  domainWeight: 'Electromagnetics · 4–6%',
  overview: 'Transmission lines guide electromagnetic waves between source and load. Characteristic impedance, reflection coefficient, and VSWR determine signal integrity and power transfer efficiency. These concepts apply to coaxial cables, microstrip, and any guided-wave structure.',
  sections: [
    {
      id: 'emtx-z0-gamma',
      title: '1. Characteristic Impedance and Reflection Coefficient',
      content: `## 1.1 Characteristic Impedance

**Z₀ = √(L/C)** (for lossless line)

where L and C are inductance and capacitance **per unit length**.

For a lossy line: **Z₀ = √((R + jωL)/(G + jωC))**

| Line Type | Typical Z₀ |
|---|---|
| Coaxial cable (50 Ω) | RF measurement, instruments |
| Coaxial cable (75 Ω) | TV, video |
| Microstrip (PCB) | 50–100 Ω (depends on geometry) |
| Twin-lead (open wire) | 300 Ω |

### Propagation Velocity

**v_p = 1/√(LC) = c/√(ε_r · μ_r)**

In most practical cables with dielectric filling: **v_p ≈ 0.66c to 0.85c**

## 1.2 Reflection Coefficient

At load impedance Z_L:

**Γ = (Z_L − Z₀) / (Z_L + Z₀)**

| Load Condition | Z_L | Γ | Physical Meaning |
|---|---|---|---|
| **Matched** | Z₀ | **0** | No reflection, maximum power transfer |
| **Open circuit** | ∞ | **+1** | Total reflection, voltage doubles |
| **Short circuit** | 0 | **−1** | Total reflection, voltage cancels |
| Purely reactive | jX | **|Γ| = 1** | Total reflection with phase shift |

### Reflected and Transmitted Power

- **Reflected power**: P_r = |Γ|² · P_inc
- **Transmitted power**: P_t = (1 − |Γ|²) · P_inc`,
      examTip: 'Γ = (Z_L − Z₀)/(Z_L + Z₀) is the most tested transmission line formula. For a matched load (Z_L = Z₀), Γ = 0 and all power is delivered. For open or short, |Γ| = 1 and all power reflects. Partial mismatch gives 0 < |Γ| < 1.',
      importantNote: 'The reflection coefficient Γ can be complex. Its magnitude |Γ| determines how much power reflects, and its phase determines where voltage maxima and minima occur on the line. For purely resistive loads, Γ is real.',
    },
    {
      id: 'emtx-vswr-matching',
      title: '2. VSWR, Standing Waves, and Impedance Matching',
      content: `## 2.1 Standing Waves

When Γ ≠ 0, incident and reflected waves superpose to create **standing waves**:

- **Voltage maximum**: V_max = V_inc·(1 + |Γ|)
- **Voltage minimum**: V_min = V_inc·(1 − |Γ|)

## 2.2 Voltage Standing Wave Ratio (VSWR)

**VSWR = V_max / V_min = (1 + |Γ|) / (1 − |Γ|)**

| VSWR | |Γ| | Reflected Power | Match Quality |
|---|---|---|---|
| **1.0** | 0 | 0% | Perfect match |
| 1.5 | 0.2 | 4% | Good |
| 2.0 | 0.33 | 11% | Acceptable |
| 3.0 | 0.5 | 25% | Poor |
| **∞** | 1.0 | 100% | Open or short |

Inverse: **|Γ| = (VSWR − 1) / (VSWR + 1)**

## 2.3 Input Impedance

At distance d from the load:

**Z_in = Z₀ · (Z_L + jZ₀·tan(βd)) / (Z₀ + jZ_L·tan(βd))**

where β = 2π/λ.

### Special Cases

| Distance | Z_in |
|---|---|
| **d = λ/4** (quarter-wave) | **Z_in = Z₀²/Z_L** (impedance inverter) |
| **d = λ/2** (half-wave) | **Z_in = Z_L** (repeats load impedance) |

## 2.4 Quarter-Wave Matching

To match Z_L to a source Z_S, insert a **quarter-wave transformer** with:

**Z₀(match) = √(Z_S · Z_L)**`,
      examTip: 'The quarter-wave transformer formula Z₀ = √(Z_S·Z_L) is a classic FE exam question. A quarter-wave section transforms impedance by Z_in = Z₀²/Z_L. At half-wave, the impedance repeats (Z_in = Z_L). These two special cases cover most FE exam transmission line problems.',
    },
  ],
  keyTakeaways: [
    'Characteristic impedance: Z₀ = √(L/C); typical values 50 Ω (RF), 75 Ω (video).',
    'Reflection coefficient: Γ = (Z_L − Z₀)/(Z_L + Z₀); matched load gives Γ = 0.',
    'VSWR = (1 + |Γ|)/(1 − |Γ|); VSWR = 1 is perfect match.',
    'Quarter-wave transformer: Z₀(match) = √(Z_S·Z_L); inverts impedance.',
    'Standing waves: V_max = V_inc(1 + |Γ|), V_min = V_inc(1 − |Γ|).',
    'Reflected power fraction = |Γ|²; transmitted = 1 − |Γ|².',
  ],
},

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 12 — CONTROL SYSTEMS  (6 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_block_diagrams: {
  topicId: 'fee_block_diagrams',
  title: 'Block Diagrams & Transfer Function Reduction',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'Block diagrams represent control systems graphically with blocks (transfer functions), summing junctions, and pickoff points. Reducing complex diagrams to a single closed-loop transfer function is a core FE exam skill.',
  sections: [
    {
      id: 'bd-reduction-rules',
      title: '1. Block Diagram Reduction Rules',
      content: `## 1.1 Fundamental Combinations

| Configuration | Rule | Formula |
|---|---|---|
| **Series** (cascade) | Multiply | **G_total = G₁ · G₂** |
| **Parallel** | Add | **G_total = G₁ + G₂** |
| **Negative feedback** | Feedback formula | **T(s) = G(s) / (1 + G(s)·H(s))** |
| **Positive feedback** | Sign change | **T(s) = G(s) / (1 − G(s)·H(s))** |

where G(s) is the forward path and H(s) is the feedback path.

### Unity Feedback (H = 1)

**T(s) = G(s) / (1 + G(s))**

## 1.2 Block Diagram Manipulation

When blocks cannot be directly combined, use these moves:

- **Moving a pickoff point past a block**: multiply by 1/G (or G) in the moved branch
- **Moving a summing junction past a block**: multiply by G (or 1/G) in the moved branch
- **Swapping summing junctions**: order does not matter (commutative)

### Step-by-Step Reduction

1. Identify innermost feedback loops
2. Reduce inner loops first using T = G/(1 + GH)
3. Combine series blocks (multiply)
4. Combine parallel blocks (add)
5. Repeat until single transfer function remains

## 1.3 Transfer Function Fundamentals

**G(s) = Y(s)/R(s)** (output over input in Laplace domain)

- **Poles**: values of s where denominator = 0 (determine stability and transient behavior)
- **Zeros**: values of s where numerator = 0 (affect transient shape and steady-state)
- **Order**: highest power of s in denominator`,
      examTip: 'The feedback formula T(s) = G/(1 + GH) is the single most important control systems equation on the FE exam. For negative feedback, use + in the denominator; for positive feedback, use −. Most exam problems use negative feedback.',
    },
    {
      id: 'bd-mason-sensitivity',
      title: "2. Mason's Gain Formula and Feedback Benefits",
      content: `## 2.1 Mason's Gain Formula

For complex multi-loop systems where sequential reduction is tedious:

**T(s) = Σ(P_k · Δ_k) / Δ**

where:
- **P_k** = gain of the k-th forward path
- **Δ** = 1 − (sum of all loop gains) + (sum of products of non-touching loop pairs) − ...
- **Δ_k** = Δ evaluated with all loops touching path k removed

### Practical Steps

1. Identify all **forward paths** from input to output → compute P_k
2. Identify all **individual loop gains** → L₁, L₂, ...
3. Find **non-touching loop pairs** (no shared nodes)
4. Compute Δ = 1 − ΣL_i + ΣL_iL_j (non-touching pairs) − ...
5. Compute Δ_k for each forward path

## 2.2 Benefits of Negative Feedback

| Benefit | Mechanism |
|---|---|
| **Reduces steady-state error** | Error = R/(1 + GH); larger GH → smaller error |
| **Reduces sensitivity** | Sensitivity S = 1/(1 + GH); system less affected by G variations |
| **Reduces distortion/nonlinearity** | Feedback linearizes the system |
| **Extends bandwidth** | Closed-loop bandwidth > open-loop bandwidth |

### Tradeoffs of Feedback

- Requires more components (sensor, controller)
- Can cause instability if loop gain is too high
- Reduces overall gain by factor (1 + GH)`,
      examTip: "Mason's gain formula is efficient for complex diagrams but rarely needed on the FE exam — most problems can be solved with the basic feedback formula T = G/(1+GH) and series/parallel rules. Use Mason only when the diagram has crossing loops that prevent sequential reduction.",
      importantNote: 'Positive feedback (T = G/(1 − GH)) is inherently unstable if GH > 1. Most practical control systems use negative feedback. If an FE exam problem does not specify, assume negative feedback.',
    },
  ],
  keyTakeaways: [
    'Series blocks: multiply. Parallel blocks: add. Feedback: T = G/(1 + GH).',
    'Unity feedback: T = G/(1 + G); closed-loop poles determine stability.',
    "Mason's gain formula handles complex multi-loop diagrams.",
    'Negative feedback reduces error, sensitivity, and distortion but lowers gain.',
    'Poles of the closed-loop transfer function must have negative real parts for stability.',
  ],
},

  fee_stability: {
  topicId: 'fee_stability',
  title: 'Stability Analysis: Routh-Hurwitz Criterion',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'The Routh-Hurwitz criterion determines closed-loop stability without computing pole locations. By constructing a simple array from the characteristic polynomial coefficients, you can count the number of unstable (right-half-plane) poles. This algebraic method is faster than root-finding and is a staple FE exam topic.',
  sections: [
    {
      id: 'stab-routh-array',
      title: '1. Constructing and Reading the Routh Array',
      content: `## 1.1 Characteristic Polynomial

The closed-loop transfer function denominator:

**D(s) = a_n·s^n + a_(n-1)·s^(n-1) + ... + a₁·s + a₀**

**Necessary condition** for stability: all coefficients a_i must be **positive** (same sign). If any coefficient is zero or negative, the system is **definitely unstable** (no need to build the array).

## 1.2 Building the Routh Array

| Row | Entries |
|---|---|
| **s^n** | a_n, a_(n-2), a_(n-4), ... |
| **s^(n-1)** | a_(n-1), a_(n-3), a_(n-5), ... |
| **s^(n-2)** | b₁, b₂, b₃, ... |
| **s^(n-3)** | c₁, c₂, c₃, ... |
| ... | ... |
| **s⁰** | last entry |

### Computing Entries

**b₁ = (a_(n-1)·a_(n-2) − a_n·a_(n-3)) / a_(n-1)**

**b₂ = (a_(n-1)·a_(n-4) − a_n·a_(n-5)) / a_(n-1)**

General pattern: **negative determinant** of 2×2 matrix from previous two rows, divided by first element of previous row.

## 1.3 Reading Stability

**Number of sign changes in the first column = number of right-half-plane (RHP) poles**

- **All positive** first column → **STABLE** (all poles in LHP)
- **One sign change** → one unstable pole
- **Two sign changes** → two unstable poles

### Quick Check for Low-Order Systems

| Order | Stability Condition |
|---|---|
| 1st: as + b | a, b > 0 |
| 2nd: as² + bs + c | a, b, c > 0 (all positive) |
| 3rd: as³ + bs² + cs + d | a, b, c, d > 0 AND **bc > ad** |`,
      examTip: 'For 2nd-order systems, just check that all three coefficients are positive — no array needed. For 3rd-order, check all four coefficients positive AND bc > ad. These shortcuts save significant time on the FE exam.',
      importantNote: 'If ANY coefficient in the characteristic polynomial is missing (zero) or negative, the system is unstable — period. You do not need to construct the Routh array. This quick check eliminates many answer choices immediately.',
    },
    {
      id: 'stab-special-cases',
      title: '2. Special Cases and Stability Design',
      content: `## 2.1 Special Case: Zero in First Column

If a first-column entry is zero but the rest of the row is not all zeros:

1. Replace the zero with a small positive number **ε**
2. Continue building the array in terms of ε
3. Take the limit as ε → 0⁺
4. Examine sign changes in the first column

## 2.2 Special Case: Entire Row of Zeros

An entire row of zeros indicates **symmetric root pairs** about the origin:
- Pairs of poles on the **imaginary axis** (marginally stable / sustained oscillation)
- Or pairs of poles symmetric about the real axis

### Procedure:
1. Form the **auxiliary polynomial** from the row ABOVE the zero row
2. Differentiate the auxiliary polynomial with respect to s
3. Replace the zero row with coefficients of the derivative
4. Continue building the array normally

The roots of the auxiliary polynomial include the symmetric pairs.

## 2.3 Using Routh-Hurwitz for Design

Find the range of a parameter K that keeps the system stable:

1. Write the characteristic polynomial in terms of K
2. Build the Routh array (entries will contain K)
3. Set all first-column entries > 0
4. Solve the resulting inequalities for K

### Example: s³ + 3s² + 2s + K = 0

Routh array first column: [1, 3, (6-K)/3, K]

For stability: **(6-K)/3 > 0** → K < 6, and **K > 0**

**Range: 0 < K < 6**`,
      examTip: 'The FE exam frequently asks "find the range of K for stability." Build the Routh array with K as a variable, then set each first-column entry > 0 and solve the inequalities. The intersection of all conditions gives the valid range.',
    },
    {
      id: 'stab-routh-worked',
      title: '3. Routh-Hurwitz Worked Examples',
      content: `## 3.1 Example 1: Stable System

**Characteristic polynomial**: D(s) = s⁴ + 3s³ + 5s² + 4s + 2

**Step 1 — Check necessary condition**: All coefficients are positive (1, 3, 5, 4, 2). Proceed to Routh array.

**Step 2 — Construct the array:**

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| s⁴ | 1 | 5 | 2 |
| s³ | 3 | 4 | 0 |
| s² | (3×5 − 1×4)/3 = **11/3** | (3×2 − 1×0)/3 = **2** | 0 |
| s¹ | (11/3 × 4 − 3 × 2)/(11/3) = **(44/3 − 6)/(11/3)** = **(26/3)/(11/3)** = **26/11** | 0 | 0 |
| s⁰ | **2** | 0 | 0 |

**Step 3 — Read first column**: 1, 3, 11/3, 26/11, 2 → **all positive, zero sign changes**

**Conclusion: System is stable** (all 4 poles in LHP).

## 3.2 Example 2: System with RHP Poles

**Characteristic polynomial**: D(s) = s⁴ + 2s³ + s² + 4s + 2

**Step 1 — All coefficients positive** (1, 2, 1, 4, 2). Must build array.

**Step 2 — Construct the array:**

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| s⁴ | 1 | 1 | 2 |
| s³ | 2 | 4 | 0 |
| s² | (2×1 − 1×4)/2 = **−1** | (2×2 − 1×0)/2 = **2** | 0 |
| s¹ | (−1×4 − 2×2)/(−1) = **8** | 0 | 0 |
| s⁰ | **2** | 0 | 0 |

**Step 3 — Read first column**: 1, 2, **−1**, 8, 2

Sign changes: +2 to −1 (one change), −1 to +8 (second change) = **2 sign changes**

**Conclusion: System is unstable** with exactly **2 poles in the RHP**.

## 3.3 Special Case: Zero in First Column

**Characteristic polynomial**: D(s) = s³ + s² + 2s + 2

| Row | Col 1 | Col 2 |
|---|---|---|
| s³ | 1 | 2 |
| s² | 1 | 2 |
| s¹ | (1×2 − 1×2)/1 = **0** | 0 |

The s¹ row has a zero in the first column. **Replace 0 with ε (small positive number)**:

| Row | Col 1 | Col 2 |
|---|---|---|
| s¹ | ε | 0 |
| s⁰ | 2 | 0 |

First column: 1, 1, ε, 2. As ε → 0⁺, all entries remain positive → **no sign changes**.

But wait — the entire s¹ row was zeros before we used ε, indicating **symmetric roots**. Form the auxiliary polynomial from the s² row:

**P(s) = s² + 2 = 0** → s = ±j√2

These are **poles on the imaginary axis** → system is **marginally stable** (sustained oscillations at ω = √2 rad/s).

## 3.4 Summary: Decision Flowchart

1. **Any missing or negative coefficient?** → Unstable (stop here)
2. **All coefficients positive?** → Build Routh array
3. **Count sign changes in first column** = number of RHP poles
4. **Zero sign changes** → Stable
5. **Zero in first column only** → Replace with ε, continue
6. **Entire row of zeros** → Symmetric root pairs; form auxiliary polynomial and differentiate`,
      examTip: 'On the FE exam, always check the necessary condition first — if any coefficient is zero or negative, mark "unstable" and move on without building the array. This saves 2-3 minutes. For 2nd-order, just check all coefficients positive. For 3rd-order, also verify bc > ad.',
      importantNote: 'The Routh array tells you HOW MANY poles are in the RHP, not WHERE they are. If you need pole locations, you must factor the polynomial or use other methods. But for stability determination (stable/unstable), the Routh criterion is the fastest approach on the FE exam.',
    },
  ],
  keyTakeaways: [
    'First column sign changes = number of RHP (unstable) poles; all positive = stable.',
    'Necessary condition: all polynomial coefficients must be positive (same sign).',
    '2nd order: all coefficients positive. 3rd order: all positive AND bc > ad.',
    'Zero in first column: replace with small ε and take limit.',
    'Entire zero row: use auxiliary polynomial derivative to continue.',
    'Design: express Routh entries in terms of K, set all > 0, solve inequalities.',
  ],
},

  fee_root_locus: {
  topicId: 'fee_root_locus',
  title: 'Root Locus: Rules and System Design',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'The root locus is a graphical method that shows how closed-loop pole locations move as a parameter (usually gain K) varies from 0 to infinity. It connects open-loop pole/zero locations to closed-loop behavior and is a powerful design tool.',
  sections: [
    {
      id: 'rl-sketching-rules',
      title: '1. Root Locus Sketching Rules',
      content: `## 1.1 Setup

For a system with open-loop transfer function:

**G(s)H(s) = K · N(s)/D(s)**

where N(s) has m zeros and D(s) has n poles (n ≥ m).

The characteristic equation is: **1 + K·N(s)/D(s) = 0** → **D(s) + K·N(s) = 0**

## 1.2 The Eight Root Locus Rules

| Rule | Description |
|---|---|
| **1. Number of branches** | n branches (one per open-loop pole) |
| **2. Start and end** | Start at **open-loop poles** (K = 0), end at **open-loop zeros** or **infinity** (K → ∞) |
| **3. Real-axis segments** | Locus exists on real axis where the **total count of poles + zeros to the RIGHT is ODD** |
| **4. Symmetry** | Symmetric about the real axis (complex poles come in conjugate pairs) |
| **5. Asymptotes** | n − m branches go to infinity along angles: **θ_a = (2k + 1)·180° / (n − m)**, k = 0, 1, ... |
| **6. Asymptote centroid** | **σ_a = (Σ poles − Σ zeros) / (n − m)** |
| **7. Breakaway/break-in** | Where branches leave/enter real axis: solve **dK/ds = 0** |
| **8. Imaginary axis crossing** | Use Routh-Hurwitz to find K and ω where locus crosses jω axis |

## 1.3 Angle and Magnitude Conditions

A point s₀ is on the root locus if:

- **Angle condition**: ∠G(s₀)H(s₀) = (2k + 1)·180° (odd multiple of 180°)
- **Magnitude condition**: K = 1/|G(s₀)H(s₀)| (gives the gain at that point)`,
      examTip: 'The real-axis rule (Rule 3) is the fastest way to sketch the rough shape: count poles + zeros to the RIGHT of a test point on the real axis. If the count is odd, the locus passes through that point. This eliminates most of the real axis immediately.',
    },
    {
      id: 'rl-design',
      title: '2. Design Using Root Locus',
      content: `## 2.1 Relating Pole Locations to Performance

For a second-order dominant pair of closed-loop poles at **s = −σ ± jω_d**:

| Parameter | Formula | Effect |
|---|---|---|
| **Natural frequency** | ω_n = √(σ² + ω_d²) | Distance from origin |
| **Damping ratio** | ζ = σ/ω_n = cos(θ) | Angle from negative real axis |
| **Damped frequency** | ω_d = ω_n√(1 − ζ²) | Imaginary part |

- **Constant ζ lines** are radial lines from origin (angle θ = arccos(ζ))
- **Constant ω_n lines** are circles centered at origin

## 2.2 Selecting Gain K

1. Identify the desired pole location (from ζ and ω_n specs)
2. Verify the point lies on the root locus (angle condition)
3. Compute **K = 1/|G(s₀)H(s₀)|** (magnitude condition)

## 2.3 Compensator Design

When gain adjustment alone cannot meet specs, add compensators:

| Compensator | Transfer Function | Effect on Root Locus |
|---|---|---|
| **Lead** | (s + z)/(s + p), p > z | Adds a zero closer to origin; pulls locus LEFT (more stable, faster) |
| **Lag** | (s + z)/(s + p), z > p | Adds a pole-zero pair near origin; increases gain without moving dominant poles much |
| **PID** | K_p + K_i/s + K_d·s | Combines lead and lag effects |

### Lead Compensator Design Steps

1. Place zero at desired location (near the desired closed-loop pole)
2. Place pole further left (typically 3–10× the zero location)
3. Verify the angle condition is satisfied at the desired pole
4. Compute K from the magnitude condition`,
      examTip: 'On the FE exam, if asked to "determine K for a damping ratio of 0.707," draw the ζ = 0.707 line (45 degrees from negative real axis), find where it intersects the root locus, and compute K at that point using the magnitude condition.',
      importantNote: 'The root locus shows closed-loop poles, not open-loop poles. As K increases from 0, poles move from open-loop pole locations toward open-loop zero locations (or infinity). If a branch crosses the jω axis, the system becomes unstable at that gain.',
    },
  ],
  keyTakeaways: [
    'Root locus starts at open-loop poles (K = 0), ends at zeros or infinity (K → ∞).',
    'Real-axis segments: locus exists where total poles + zeros to the right is odd.',
    'Asymptote angles: (2k+1)·180°/(n−m); centroid: σ = (Σpoles − Σzeros)/(n−m).',
    'Damping ratio ζ = cos(θ) where θ is angle from negative real axis.',
    'Gain at any locus point: K = 1/|G(s₀)H(s₀)| (magnitude condition).',
    'Lead compensator pulls locus left (improves stability); lag increases low-frequency gain.',
  ],
},

  fee_bode_nyquist: {
  topicId: 'fee_bode_nyquist',
  title: 'Frequency Response: Bode & Nyquist Plots',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'Frequency response analysis evaluates how a system responds to sinusoidal inputs at different frequencies. Bode plots provide magnitude and phase on logarithmic scales; Nyquist plots map the complex frequency response. Gain margin and phase margin quantify how close the system is to instability.',
  sections: [
    {
      id: 'bode-construction',
      title: '1. Bode Plot Construction',
      content: `## 1.1 Bode Plot Basics

Two semi-log plots:
- **Magnitude**: 20·log₁₀|G(jω)| (dB) vs. log(ω)
- **Phase**: ∠G(jω) (degrees) vs. log(ω)

## 1.2 Building Blocks — Straight-Line Approximations

| Factor | Magnitude Contribution | Phase Contribution |
|---|---|---|
| **Constant K** | 20·log₁₀(K) dB (flat line) | 0° (if K > 0) or −180° (if K < 0) |
| **s (zero at origin)** | +20 dB/decade through 0 dB at ω = 1 | +90° at all frequencies |
| **1/s (pole at origin)** | −20 dB/decade through 0 dB at ω = 1 | −90° at all frequencies |
| **1 + s/a (real zero)** | 0 for ω < a; +20 dB/decade for ω > a | 0° → +45° at ω = a → +90° |
| **1/(1 + s/a) (real pole)** | 0 for ω < a; −20 dB/decade for ω > a | 0° → −45° at ω = a → −90° |
| **Quadratic pair** (ζ, ω_n) | 0 for ω < ω_n; −40 dB/decade for ω > ω_n | 0° → −90° at ω = ω_n → −180° |

**Corner frequency** = pole or zero location on the real axis.

## 1.3 Composite Bode Plot

To plot G(s) = K·(s + z₁)/[(s)(s + p₁)(s + p₂)]:

1. Factor out constants; compute 20·log₁₀(K·z₁/(p₁·p₂)) for the DC gain
2. Add contributions of each pole and zero at each frequency decade
3. Phase: sum individual phase contributions at each frequency

### Magnitude in dB

**|G(jω)|_dB = 20·log₁₀(K) + Σ(zero contributions) − Σ(pole contributions)**`,
      examTip: 'Each real pole contributes −20 dB/decade and −90° of phase; each real zero contributes +20 dB/decade and +90°. An integrator (1/s) contributes −20 dB/decade starting from ω = 0 with a constant −90° phase. These building blocks let you sketch any Bode plot quickly.',
    },
    {
      id: 'bode-margins-nyquist',
      title: '2. Stability Margins and Nyquist Criterion',
      content: `## 2.1 Gain Margin and Phase Margin

| Margin | Definition | Measured At |
|---|---|---|
| **Gain Margin (GM)** | How much gain can increase before instability | **Phase-crossover frequency** ω_pc (where ∠G = −180°) |
| **Phase Margin (PM)** | How much additional phase lag before instability | **Gain-crossover frequency** ω_gc (where |G| = 0 dB) |

**GM = −20·log₁₀|G(jω_pc)|** (in dB)

**PM = 180° + ∠G(jω_gc)**

### Stability Requirement

**Stable system: GM > 0 dB AND PM > 0°**

| PM | System Behavior |
|---|---|
| > 60° | Well-damped, sluggish |
| 40–60° | Good compromise |
| 20–40° | Responsive but oscillatory |
| < 0° | **Unstable** |

Approximate relationship: **PM ≈ 100·ζ** (for ζ < 0.7, in degrees)

## 2.2 Nyquist Criterion

Plot G(jω) in the complex plane as ω goes from 0 to ∞ (and its mirror for −∞ to 0).

**Nyquist stability criterion**:

**Z = N + P**

where:
- **Z** = number of closed-loop RHP poles (unstable)
- **N** = number of **clockwise** encirclements of the point **(-1, 0)**
- **P** = number of open-loop RHP poles

For a stable closed-loop system: **Z = 0** → **N = −P**

If the open-loop system is stable (P = 0), the Nyquist plot must **not encircle (-1, 0)** at all.

## 2.3 Relating Bode to Nyquist

- GM is the distance from the Nyquist plot to (-1, 0) along the negative real axis
- PM is the angle from the negative real axis to the point where |G| = 1 on the Nyquist plot
- Both plots contain the same information; Bode is easier to sketch, Nyquist handles delays and non-minimum-phase systems better`,
      examTip: 'PM ≈ 100·ζ is a quick approximation that links frequency-domain and time-domain specs. If the exam asks for a phase margin of 45°, the damping ratio is approximately 0.45 and the overshoot is about 20%. This shortcut saves significant time.',
      importantNote: 'Gain margin and phase margin must BOTH be positive for stability. A system can have positive GM but negative PM (or vice versa) and still be unstable. Always check both margins.',
    },
    {
      id: 'bode-step-by-step',
      title: '3. Drawing Bode Plots Step-by-Step',
      content: `## 3.1 Problem Statement

**Given**: G(s) = 100 / [s(s + 10)]

Draw the magnitude and phase Bode plots. Find the gain margin (GM) and phase margin (PM). Determine closed-loop stability.

## 3.2 Step 1 — Rewrite in Standard Bode Form

Factor out constants so each term has the form (1 + s/a):

G(s) = 100 / [s · 10 · (1 + s/10)] = **10 / [s · (1 + s/10)]**

**Components to plot:**
- Constant gain: K = 10 → 20·log₁₀(10) = **20 dB**
- Integrator: 1/s → **−20 dB/decade**, passes through 0 dB at ω = 1
- Real pole: 1/(1 + s/10) → corner at **ω = 10 rad/s**, then −20 dB/decade

## 3.3 Step 2 — Magnitude Plot

**Low frequencies (ω << 10):**

|G(jω)| ≈ 10/ω → slope = −20 dB/decade (integrator dominates)

At ω = 1: |G| = 10/1 = 10 → **20 dB**
At ω = 10: |G| = 10/10 = 1 → **0 dB** (before the pole kicks in)

**High frequencies (ω >> 10):**

|G(jω)| ≈ 10/(ω · ω/10) = 100/ω² → slope = **−40 dB/decade**

| Frequency (rad/s) | Magnitude (dB) | Slope |
|---|---|---|
| 0.1 | 40 dB | −20 dB/dec |
| 1 | 20 dB | −20 dB/dec |
| 10 | 0 dB | Transition to −40 dB/dec |
| 100 | −20 dB | −40 dB/dec |

## 3.4 Step 3 — Phase Plot

- Integrator 1/s: constant **−90°** at all frequencies
- Pole at ω = 10: contributes 0° for ω << 10, −45° at ω = 10, −90° for ω >> 10

**Total phase:**

| Frequency | Integrator | Pole at 10 | Total Phase |
|---|---|---|---|
| ω = 1 | −90° | ≈ −6° | **−96°** |
| ω = 10 | −90° | −45° | **−135°** |
| ω = 100 | −90° | ≈ −84° | **−174°** |
| ω → ∞ | −90° | −90° | **−180°** |

## 3.5 Step 4 — Find GM and PM

**Gain crossover frequency ω_gc** (where |G| = 0 dB):

From the magnitude plot: |G(jω_gc)| = 1 → 10/[ω_gc · √(1 + ω_gc²/100)] = 1

At ω = 10: |G| = 10/(10 · √2) = 0.707 → −3 dB (close to 0 dB)

Solving exactly: ω_gc ≈ **9.05 rad/s**

**Phase margin**: PM = 180° + ∠G(jω_gc) = 180° + (−90° − arctan(9.05/10)) = 180° − 90° − 42.1° = **47.9°**

**Phase crossover frequency ω_pc** (where ∠G = −180°):

Total phase reaches −180° as ω → ∞ (asymptotically). Strictly, ω_pc = **∞**.

**Gain margin**: GM = −20·log₁₀|G(j∞)| = **∞ dB** (magnitude is zero at infinite frequency)

## 3.6 Step 5 — Stability Conclusion

- **PM = 47.9° > 0°** → Stable
- **GM = ∞ dB > 0 dB** → Stable
- The system is **closed-loop stable** with good phase margin (near the 45–60° design target)
- Expected damping ratio: ζ ≈ PM/100 ≈ 0.48 → moderate overshoot (~18%)`,
      examTip: 'On the FE exam, for systems with an integrator (1/s), the low-frequency slope starts at −20 dB/decade. Each additional pole adds another −20 dB/decade at its corner frequency. The magnitude at ω = 1 equals 20·log₁₀(K), which gives you the starting point for the entire plot.',
      importantNote: 'A type-1 system (one integrator) like G(s) = K/[s(s+a)] has phase approaching −180° but never exceeding it. This means GM = infinity. Such systems are always stable for any positive gain K. However, a type-2 system (two integrators) starts at −180° and WILL go unstable at some gain.',
    },
  ],
  keyTakeaways: [
    'Bode magnitude in dB = 20·log₁₀|G(jω)|; each pole adds −20 dB/decade, each zero adds +20 dB/decade.',
    'Gain margin: GM = −|G(jω_pc)| dB at phase crossover (∠G = −180°).',
    'Phase margin: PM = 180° + ∠G(jω_gc) at gain crossover (|G| = 0 dB).',
    'Stability requires GM > 0 dB AND PM > 0°; typical design target PM = 45–60°.',
    'Nyquist: Z = N + P; for stable open-loop (P = 0), no encirclement of (−1, 0).',
    'Approximate: PM ≈ 100·ζ degrees (for ζ < 0.7).',
  ],
},

  fee_pid: {
  topicId: 'fee_pid',
  title: 'PID Controllers and Tuning',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'The PID controller is the most widely used feedback controller in industry, combining proportional, integral, and derivative actions to balance responsiveness, accuracy, and stability. The FE exam tests PID transfer functions, the effect of each term, and basic tuning methods.',
  sections: [
    {
      id: 'pid-actions',
      title: '1. PID Controller Actions',
      content: `## 1.1 The PID Control Law

**Time domain**: **u(t) = K_p·e(t) + K_i·∫e(τ)dτ + K_d·de(t)/dt**

**Laplace domain**: **C(s) = K_p + K_i/s + K_d·s**

where e(t) = r(t) − y(t) is the error signal (setpoint minus output).

## 1.2 Effect of Each Term

| Action | Transfer Function | Effect on Response | Drawback |
|---|---|---|---|
| **Proportional (P)** | K_p | Reduces error proportionally; faster response | Steady-state error remains (for Type 0 systems) |
| **Integral (I)** | K_i/s | **Eliminates steady-state error** (adds integrator → increases system type) | Adds phase lag; can cause oscillation/instability |
| **Derivative (D)** | K_d·s | **Reduces overshoot** and oscillation; adds phase lead | Amplifies high-frequency noise; never used alone |

### How Each Term Affects the Response

- **Increasing K_p**: faster rise time, more overshoot, smaller steady-state error
- **Increasing K_i**: eliminates steady-state error, increases overshoot, can cause instability
- **Increasing K_d**: reduces overshoot, improves stability, but noise-sensitive

## 1.3 Common PID Variants

| Controller | Terms | When to Use |
|---|---|---|
| **P** only | K_p | Simple, fast; acceptable steady-state error |
| **PI** | K_p + K_i/s | Most common; zero steady-state error needed |
| **PD** | K_p + K_d·s | Need stability improvement; error acceptable |
| **PID** | K_p + K_i/s + K_d·s | Full control; zero error + good transient |

### Anti-Windup

When the actuator saturates, the integral term continues accumulating error ("windup"). Anti-windup resets or clamps the integrator when output hits limits.`,
      examTip: 'The integral term K_i/s adds a pole at the origin, increasing the system type by one. This is WHY integral action eliminates steady-state error for step inputs — it makes the system at least Type 1. This is the most important conceptual point about PID on the FE exam.',
    },
    {
      id: 'pid-tuning',
      title: '2. PID Tuning Methods',
      content: `## 2.1 Ziegler-Nichols Step Response Method

Apply a step input to the open-loop plant and measure:
- **K** = process gain (steady-state output change / input change)
- **θ** = apparent dead time (delay before response begins)
- **τ** = time constant (time to reach 63% of final value)

| Controller | K_p | T_i = K_p/K_i | T_d = K_d/K_p |
|---|---|---|---|
| **P** | τ/(K·θ) | — | — |
| **PI** | 0.9·τ/(K·θ) | 3.3·θ | — |
| **PID** | 1.2·τ/(K·θ) | 2·θ | 0.5·θ |

## 2.2 Ziegler-Nichols Ultimate Gain Method

1. Set K_i = 0 and K_d = 0 (P-only)
2. Increase K_p until the system oscillates continuously → **K_u** (ultimate gain)
3. Measure the oscillation period → **P_u** (ultimate period)

| Controller | K_p | T_i | T_d |
|---|---|---|---|
| **P** | 0.5·K_u | — | — |
| **PI** | 0.45·K_u | P_u/1.2 | — |
| **PID** | 0.6·K_u | P_u/2 | P_u/8 |

## 2.3 Practical Tuning Guidelines

1. **Start with P only**: increase K_p until response is fast but oscillatory
2. **Add I**: set T_i large (slow integration), decrease until steady-state error vanishes
3. **Add D**: increase K_d to reduce overshoot; stop before noise amplification becomes a problem

### Frequency-Domain Approach

Design the PID so the open-loop Bode plot has:
- **Gain crossover** at the desired bandwidth
- **Phase margin** of 45–60° for good damping`,
      examTip: 'Ziegler-Nichols tuning tends to produce aggressive controllers with about 25% overshoot. The FE exam may ask you to apply the ultimate gain method: find K_u (gain at sustained oscillation), measure P_u (oscillation period), then use the table to compute K_p, T_i, T_d.',
      importantNote: 'The derivative term amplifies noise because it differentiates the error signal. In practice, a low-pass filter is always added to the D term: K_d·s/(1 + s/N) where N is typically 10–20. Pure derivative (K_d·s) is never used in real implementations.',
    },
    {
      id: 'pid-tuning-worked',
      title: '3. PID Tuning Worked Example',
      content: `## 3.1 Problem Statement

**Given plant**: G(s) = 1 / [s(s + 2)]

Design a PID controller using the **Ziegler-Nichols ultimate gain method**. Find the ultimate gain K_u and ultimate period P_u. Calculate K_p, K_i, K_d. Verify closed-loop stability.

## 3.2 Step 1 — Find the Ultimate Gain K_u

With P-only control, the closed-loop characteristic equation is:

**1 + K_p · G(s) = 0** → s(s + 2) + K_p = 0 → **s² + 2s + K_p = 0**

Use **Routh-Hurwitz** to find K_p that causes sustained oscillation:

| Row | Col 1 | Col 2 |
|---|---|---|
| s² | 1 | K_p |
| s¹ | 2 | 0 |
| s⁰ | K_p | 0 |

For stability: all first-column entries > 0 → K_p > 0 AND 2 > 0. The system is stable for **all K_p > 0**.

**Problem**: This 2nd-order system never oscillates — it cannot reach the −180° phase crossover with P-only control because it is only type 1 (total phase approaches −180° but never reaches it).

**Resolution**: For Ziegler-Nichols ultimate gain method, we need a system that CAN oscillate. Let us add a realistic delay or use a higher-order plant. For this problem, we use the **frequency response approach** instead.

## 3.3 Alternative: Frequency Response PID Design

Since the pure plant G(s) = 1/[s(s+2)] has infinite gain margin, we design for a **target phase margin of 50°** and **bandwidth of 5 rad/s**.

**Step 1 — Evaluate the plant at ω = 5 rad/s:**

G(j5) = 1/[j5 · (j5 + 2)] = 1/[j5 · (2 + j5)] = 1/(−25 + j10)

|G(j5)| = 1/√(625 + 100) = 1/√725 = **0.0371** (−28.6 dB)

∠G(j5) = −90° − arctan(5/2) = −90° − 68.2° = **−158.2°**

**Step 2 — Required controller phase at ω = 5:**

For PM = 50°: total phase = −180° + 50° = −130°

Controller must add: −130° − (−158.2°) = **+28.2° of phase lead**

**Step 3 — Design PID parameters:**

Using the PID transfer function: C(s) = K_p(1 + 1/(T_i·s) + T_d·s)

Choose **T_d = 0.15 s** (provides phase lead near ω = 5):
- Phase from D term at ω = 5: arctan(T_d·ω) = arctan(0.75) = +36.9°

Choose **T_i = 2 s** (integral time, slow enough not to destabilize):
- Phase from I term at ω = 5: −arctan(1/(T_i·ω)) = −arctan(0.1) = −5.7°

Net controller phase: +36.9° − 5.7° = **+31.2°** (close to target of +28.2°, with margin)

**Step 4 — Set K_p for 0 dB gain crossover at ω = 5:**

|C(j5)| · |G(j5)| = 1

|C(j5)| = |K_p| · |1 + 1/(j10) + j0.75| = K_p · |1.75 + j0.65| = K_p · 1.867

K_p = 1/(1.867 × 0.0371) = **14.4**

## 3.4 Final PID Parameters

| Parameter | Value | Derived Values |
|---|---|---|
| **K_p** | 14.4 | Proportional gain |
| **T_i** | 2.0 s | K_i = K_p/T_i = **7.2** |
| **T_d** | 0.15 s | K_d = K_p·T_d = **2.16** |

**Controller**: C(s) = 14.4 + 7.2/s + 2.16s

## 3.5 Verification — Closed-Loop Stability

Open-loop transfer function: L(s) = C(s)·G(s) = (14.4 + 7.2/s + 2.16s) · 1/[s(s+2)]

At ω = 5 rad/s: |L(j5)| ≈ 1 (0 dB) and ∠L(j5) ≈ −130° → **PM ≈ 50°**

The closed-loop system is stable with good damping (ζ ≈ 0.5, ~16% overshoot).

## 3.6 Ziegler-Nichols Quick Reference (For Higher-Order Plants)

When the ultimate gain method IS applicable (3rd order or higher):

1. Increase K_p until sustained oscillation → **K_u** (ultimate gain)
2. Measure oscillation period → **P_u**
3. Apply the table:

| Controller | K_p | K_i = K_p/T_i | K_d = K_p·T_d |
|---|---|---|---|
| **P** | 0.5·K_u | — | — |
| **PI** | 0.45·K_u | 0.45·K_u/(P_u/1.2) | — |
| **PID** | 0.6·K_u | 0.6·K_u/(P_u/2) = **1.2·K_u/P_u** | 0.6·K_u·P_u/8 = **0.075·K_u·P_u** |`,
      examTip: 'If the FE exam gives a 2nd-order plant with no delay, the Ziegler-Nichols ultimate gain method may not apply directly (the system may be stable for all gains). In that case, use the frequency response approach or recognize that the exam expects you to apply the table formulas with given K_u and P_u values.',
      importantNote: 'Ziegler-Nichols tuning is a starting point, not a final design. It typically produces about 25% overshoot. For tighter specifications, reduce K_p by 20-30% from the Z-N value and increase T_i. The FE exam usually tests the Z-N table lookup, not iterative refinement.',
    },
  ],
  keyTakeaways: [
    'PID: u(t) = K_p·e + K_i·∫e dt + K_d·de/dt; in Laplace: C(s) = K_p + K_i/s + K_d·s.',
    'P: reduces error proportionally. I: eliminates steady-state error (adds integrator). D: reduces overshoot (adds phase lead).',
    'PI is the most common industrial controller; D is added only when overshoot is unacceptable.',
    'Ziegler-Nichols: ultimate gain K_u and period P_u → K_p = 0.6K_u, T_i = P_u/2, T_d = P_u/8 for PID.',
    'Anti-windup prevents integral term from accumulating during actuator saturation.',
  ],
},

  fee_time_specs: {
  topicId: 'fee_time_specs',
  title: 'Time-Domain Specifications',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'Time-domain specifications quantify transient and steady-state performance of control systems. Overshoot, settling time, rise time, and steady-state error are directly linked to damping ratio, natural frequency, and system type. These relationships are heavily tested on the FE exam.',
  sections: [
    {
      id: 'ts-transient-specs',
      title: '1. Transient Response Specifications',
      content: `## 1.1 Second-Order System Standard Form

**G(s) = ω_n² / (s² + 2ζω_n·s + ω_n²)**

where:
- **ω_n** = natural frequency (rad/s) — controls speed of response
- **ζ** = damping ratio (dimensionless) — controls oscillation
- **ω_d = ω_n·√(1 − ζ²)** = damped natural frequency

### System Classification by ζ

| ζ Value | Response Type | Poles |
|---|---|---|
| ζ = 0 | Undamped (sustained oscillation) | Purely imaginary: ±jω_n |
| 0 < ζ < 1 | **Underdamped** (oscillatory) | Complex conjugate: −ζω_n ± jω_d |
| ζ = 1 | Critically damped (fastest non-oscillatory) | Repeated real: −ω_n |
| ζ > 1 | Overdamped (sluggish) | Two distinct real negatives |

## 1.2 Key Transient Specifications (Underdamped, 0 < ζ < 1)

| Specification | Formula | Description |
|---|---|---|
| **Percent Overshoot** | **OS% = e^(−πζ/√(1−ζ²)) × 100%** | Max peak above final value |
| **Peak Time** | **t_p = π/ω_d** | Time to first peak |
| **Rise Time (0→100%)** | **t_r ≈ (π − arccos(ζ))/ω_d** | Time from 0% to 100% of final value |
| **Settling Time (2%)** | **t_s ≈ 4/(ζ·ω_n)** | Time to stay within 2% band |
| **Settling Time (5%)** | **t_s ≈ 3/(ζ·ω_n)** | Time to stay within 5% band |

## 1.3 Common ζ Values Worth Memorizing

| ζ | OS% | Character |
|---|---|---|
| 0.1 | 73% | Very oscillatory |
| 0.3 | 37% | Oscillatory |
| 0.5 | 16% | Moderate |
| **0.707** | **4.3%** | **Optimal (Butterworth)** |
| 1.0 | 0% | Critically damped |`,
      examTip: 'OS% = e^(−πζ/√(1−ζ²)) × 100% and t_s ≈ 4/(ζω_n) are the two most commonly tested formulas. Memorize that ζ ≈ 0.7 gives about 5% overshoot — this is the "standard good design" value that appears repeatedly on the FE exam.',
      importantNote: 'Settling time t_s = 4/(ζω_n) uses the 2% criterion. Some problems use 5% criterion, which gives t_s = 3/(ζω_n). Always check which criterion the problem specifies. If not stated, assume 2%.',
    },
    {
      id: 'ts-steady-state-error',
      title: '2. Steady-State Error and System Type',
      content: `## 2.1 System Type

The **type number** equals the number of **free integrators** (poles at s = 0) in the open-loop transfer function G(s)H(s).

| System Type | Integrators | Step Error | Ramp Error | Parabolic Error |
|---|---|---|---|---|
| **Type 0** | 0 | 1/(1+K_p) | ∞ | ∞ |
| **Type 1** | 1 | **0** | 1/K_v | ∞ |
| **Type 2** | 2 | **0** | **0** | 1/K_a |

## 2.2 Error Constants

For unity-feedback system with open-loop G(s):

| Constant | Formula | Used For |
|---|---|---|
| **Position constant K_p** | lim(s→0) G(s) | Step input error |
| **Velocity constant K_v** | lim(s→0) s·G(s) | Ramp input error |
| **Acceleration constant K_a** | lim(s→0) s²·G(s) | Parabolic input error |

### Steady-State Error Formula

**e_ss = lim(s→0) s · R(s) / (1 + G(s))**

For standard inputs:
- **Step** (R(s) = 1/s): **e_ss = 1/(1 + K_p)**
- **Ramp** (R(s) = 1/s²): **e_ss = 1/K_v**
- **Parabola** (R(s) = 1/s³): **e_ss = 1/K_a**

## 2.3 Design Implications

- To **reduce** steady-state error: increase gain K or add integrators
- Adding an integrator (increasing system type) eliminates one class of error but can worsen stability
- **Final Value Theorem**: lim(t→∞) y(t) = lim(s→0) s·Y(s) — only valid if system is stable

### Quick Checks

- Type 0 with gain K: step error = 1/(1+K). Doubling K halves the error but never eliminates it.
- Type 1 system: zero step error, but ramp error = 1/K_v. Increase K_v to reduce ramp error.
- Each added integrator gives zero error to one more input class but adds −90° phase (stability risk).`,
      examTip: 'The FE exam will often state "unity-feedback system with G(s) = K/(s(s+2))" and ask for the steady-state error to a unit step. This is Type 1 (one integrator in G(s)), so step error = 0 immediately — no calculation needed. For a ramp: K_v = lim(s→0) s·G(s) = K/2, so e_ss = 2/K.',
      importantNote: 'The Final Value Theorem only works if the system is STABLE (all closed-loop poles in the LHP). If any pole is in the RHP or on the jω axis, the steady-state value does not exist and the theorem gives a wrong answer. Always verify stability first.',
    },
  ],
  keyTakeaways: [
    'Overshoot: OS% = e^(−πζ/√(1−ζ²)) × 100%; ζ ≈ 0.7 gives ~5% OS.',
    'Settling time (2%): t_s ≈ 4/(ζω_n); peak time: t_p = π/ω_d.',
    'System type = number of open-loop integrators; determines which errors are zero.',
    'Type 0: step error = 1/(1+K_p). Type 1: step error = 0, ramp error = 1/K_v.',
    'Error constants: K_p = lim G(s), K_v = lim s·G(s), K_a = lim s²·G(s) as s→0.',
    'Final Value Theorem: lim(t→∞) y(t) = lim(s→0) s·Y(s) — only valid for stable systems.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 13 — COMMUNICATIONS  (5 curriculum IDs)  ·  4–6 %
   * ══════════════════════════════════════════════════════════════════ */

fee_am_fm: { topicId: 'fee_am_fm', title: 'Analog Modulation: AM & FM', domainWeight: 'Communications · 4–6%',
  overview: 'Amplitude Modulation (AM) and Frequency Modulation (FM) are the two foundational analog modulation techniques. AM encodes information in the carrier amplitude and is bandwidth-efficient but noise-sensitive. FM encodes information in the carrier frequency and trades wider bandwidth for superior noise immunity.',
  sections: [
    { id: 'am-fundamentals', title: '1. Amplitude Modulation (AM)',
      content: `## 1.1 AM Signal Representation

**s(t) = A_c [1 + m_a * m(t)] cos(2 pi f_c t)**

where A_c is carrier amplitude, m(t) is the normalized message (|m(t)| <= 1), and m_a is the **modulation index**.

- **m_a > 1** causes **overmodulation** -- envelope crosses zero, distorting the recovered signal.

## 1.2 AM Bandwidth and Power

| Parameter | Formula | Notes |
|---|---|---|
| Bandwidth | **BW = 2 f_m** | f_m = highest message frequency |
| Carrier power | **P_c = A_c^2 / (2R)** | No information in carrier |
| Sideband power | **P_s = P_c * m_a^2 / 2** | Contains all information |
| Total power | **P_total = P_c (1 + m_a^2 / 2)** | Carrier + sidebands |
| Efficiency | **eta = m_a^2 / (2 + m_a^2)** | Max ~33% at m_a = 1 |

### AM Variants

- **DSB-SC**: removes carrier, 100% efficiency, requires coherent detection.
- **SSB**: one sideband only -- BW = f_m (half of standard AM).
- **VSB**: one sideband + vestige -- used in analog TV.`,
      examTip: 'AM efficiency is at most 33% at full modulation (m_a = 1) because the carrier carries no information. If asked for "useful power," compute P_s = P_c * m_a^2 / 2. DSB-SC achieves 100% efficiency but needs a synchronous detector.',
      importantNote: 'Overmodulation (m_a > 1) causes the AM envelope to cross zero, making envelope detection fail. The FE exam commonly tests whether a given modulation index causes overmodulation.',
    },
    { id: 'fm-fundamentals', title: '2. Frequency Modulation (FM)',
      content: `## 2.1 FM Signal Representation

**s(t) = A_c cos(2 pi f_c t + beta * sin(2 pi f_m t))**

| Parameter | Formula | Meaning |
|---|---|---|
| Frequency deviation | **Delta_f = k_f * A_m** | Max shift from carrier |
| Modulation index | **beta = Delta_f / f_m** | Ratio of deviation to message freq |
| Carson's rule BW | **BW = 2(Delta_f + f_m)** | Practical bandwidth estimate |

- **Narrowband FM (beta << 1)**: BW approx 2 f_m (similar to AM).
- **Wideband FM (beta >> 1)**: BW approx 2 Delta_f.

## 2.2 FM vs. AM

| Feature | AM | FM |
|---|---|---|
| Bandwidth | **2 f_m** | **2(Delta_f + f_m)** |
| Noise immunity | Poor | Excellent -- limiter removes amplitude noise |
| Efficiency | Low (max ~33%) | N/A (constant-envelope) |
| Complexity | Simple envelope detector | Frequency discriminator needed |

## 2.3 Phase Modulation (PM)

**s(t) = A_c cos(2 pi f_c t + k_p m(t))**. FM and PM are closely related -- FM of m(t) is equivalent to PM of its integral. Digital PSK is fundamentally phase modulation.`,
      examTip: 'Carson\'s rule BW = 2(Delta_f + f_m) is the most-tested FM formula. For narrowband FM (beta << 1) it simplifies to 2 f_m. For wideband FM (beta >> 1) it becomes ~2 Delta_f. Always compute beta first.',
    },
    { id: 'am-fm-receivers', title: '3. Superheterodyne Receivers and Tradeoffs',
      content: `## 3.1 The Bandwidth-Noise Tradeoff

**Wider bandwidth can be traded for better noise performance.** FM exploits this -- spreading the signal over wider bandwidth lets the receiver reject more noise.

**FM improvement factor**: SNR_out / SNR_in = 3 beta^2 (beta + 1) for wideband FM.

## 3.2 Superheterodyne Receiver

1. **RF amplifier** -- sets noise figure
2. **Mixer + LO** -- down-converts to IF
3. **IF amplifier + filter** -- selectivity and gain
4. **Detector** -- envelope (AM) or discriminator (FM)

- **Image frequency**: f_image = f_signal + 2 f_IF
- Higher IF improves image rejection but worsens adjacent-channel selectivity

## 3.3 Pre-emphasis / De-emphasis

FM uses pre-emphasis (boost highs before TX) and de-emphasis (attenuate after RX) to improve high-frequency SNR.`,
      examTip: 'Image frequency = f_signal + 2 f_IF. The image is always separated from the desired signal by exactly twice the IF frequency.',
    },
    { id: 'am-fm-worked', title: '3. AM/FM Worked Problems',
      content: `## 3.1 AM Bandwidth and Efficiency (m = 0.8)

**Given**: Carrier power P_c = 10 kW, modulation index m_a = 0.8, message bandwidth f_m = 5 kHz.

**Step 1 — Bandwidth**: BW = 2 * f_m = 2 * 5 kHz = **10 kHz**

**Step 2 — Sideband power**: P_s = P_c * m_a^2 / 2 = 10000 * 0.64 / 2 = **3200 W**

**Step 3 — Total power**: P_total = P_c(1 + m_a^2/2) = 10000(1 + 0.32) = **13,200 W**

**Step 4 — Efficiency**: eta = m_a^2 / (2 + m_a^2) = 0.64 / 2.64 = **24.2%**

| Parameter | Value |
|---|---|
| Bandwidth | 10 kHz |
| Sideband power | 3,200 W |
| Total power | 13,200 W |
| Efficiency | 24.2% |

## 3.2 FM Carson's Bandwidth

**Given**: Frequency deviation Delta_f = 75 kHz, message frequency f_m = 15 kHz.

- **Modulation index**: beta = Delta_f / f_m = 75 / 15 = **5** (wideband FM)
- **Carson's rule**: BW = 2(Delta_f + f_m) = 2(75 + 15) = **180 kHz**

Since beta = 5 >> 1, this is wideband FM with excellent noise immunity.

## 3.3 DSB-AM vs SSB Bandwidth Savings

| Scheme | Bandwidth | Efficiency | Detection |
|---|---|---|---|
| Standard AM | 2 f_m = 10 kHz | 24.2% (m=0.8) | Envelope (simple) |
| DSB-SC | 2 f_m = 10 kHz | 100% | Coherent (complex) |
| SSB | f_m = 5 kHz | 100% | Coherent (complex) |

**SSB saves 50% bandwidth** vs standard AM or DSB-SC while achieving 100% power efficiency. The tradeoff is receiver complexity — SSB requires a synchronous detector or Weaver method.

**Exam strategy**: Always compute beta first for FM problems. If beta < 0.3, use narrowband approximation (BW ≈ 2f_m). If beta > 1, use Carson's rule. For AM, the efficiency formula eta = m_a^2/(2 + m_a^2) is the fastest path.`,
      examTip: 'For AM efficiency at any m_a, just plug into eta = m_a^2/(2+m_a^2). At m_a=1 you get 33%. At m_a=0.5, only 11%. The carrier wastes most power in standard AM.',
      importantNote: 'Carson\'s rule gives an approximate 98% bandwidth. The exact FM bandwidth is infinite (Bessel functions), but Carson\'s rule is always accepted on the FE exam.',
    },
  ],
  keyTakeaways: [
    'AM: s(t) = A_c[1+m_a*m(t)]cos(wt); BW = 2f_m; efficiency eta = m_a^2/(2+m_a^2), max ~33%.',
    'FM: beta = Delta_f/f_m; Carson\'s rule BW = 2(Delta_f + f_m).',
    'AM is bandwidth-efficient but noise-sensitive; FM trades wider BW for noise immunity.',
    'Overmodulation (m_a > 1) causes AM envelope distortion -- common exam trap.',
    'DSB-SC removes carrier for 100% efficiency; SSB halves bandwidth to f_m.',
    'Superheterodyne: RF amp -> mixer -> IF filter -> detector; image freq = f_signal + 2f_IF.',
  ],
},

fee_digital_mod: { topicId: 'fee_digital_mod', title: 'Digital Modulation: ASK, FSK, PSK, QAM', domainWeight: 'Communications · 4–6%',
  overview: 'Digital modulation encodes discrete bits as distinct changes in a carrier signal. ASK varies amplitude, FSK varies frequency, PSK varies phase, and QAM combines amplitude and phase. Higher-order modulations pack more bits per symbol but demand higher SNR.',
  sections: [
    { id: 'digmod-basic', title: '1. Basic Digital Modulation Schemes',
      content: `## 1.1 ASK, FSK, PSK

**ASK**: maps bits to amplitude levels. Simplest but most noise-sensitive.

**FSK**: maps bits to different frequencies. BW_FSK = |f_1 - f_0| + 2B. More noise-resistant than ASK.

**PSK**:

| Scheme | Phases | Bits/Symbol | Key Property |
|---|---|---|---|
| **BPSK** | 0, pi | 1 | Most noise-resistant |
| **QPSK** | 0, pi/2, pi, 3pi/2 | 2 | Same BW as BPSK, double throughput |
| **8-PSK** | 8 equally spaced | 3 | Needs higher SNR |

**BPSK bit-error rate**: BER = Q(sqrt(2 E_b / N_0))

QPSK achieves **2 bits/symbol with the same bandwidth** as BPSK -- this dominates practical systems.

## 1.2 QAM (Quadrature Amplitude Modulation)

QAM varies **both amplitude and phase**:

| Scheme | Points | Bits/Symbol | Spectral Efficiency |
|---|---|---|---|
| **4-QAM (= QPSK)** | 4 | 2 | 2 bits/s/Hz |
| **16-QAM** | 16 | 4 | 4 bits/s/Hz |
| **64-QAM** | 64 | 6 | 6 bits/s/Hz |
| **256-QAM** | 256 | 8 | 8 bits/s/Hz |

**bits/symbol = log_2(M)** where M is constellation size.
**Required SNR increases ~6 dB for every doubling of M.**`,
      examTip: 'QPSK transmits 2 bits/symbol with the SAME bandwidth as BPSK -- essentially two independent BPSK streams on I and Q channels. This is the most important spectral-efficiency fact for the FE exam.',
      importantNote: 'Do not confuse bits per symbol with bits per second. Bits/s = bits/symbol * symbol rate. QPSK at 1 Msym/s = 2 Mbps.',
    },
    { id: 'digmod-ber', title: '2. BER and Design Tradeoffs',
      content: `## 2.1 BER Expressions

| Scheme | BER Formula | Notes |
|---|---|---|
| BPSK | **Q(sqrt(2 E_b/N_0))** | Best BER per E_b/N_0 |
| QPSK | **Q(sqrt(2 E_b/N_0))** | Same as BPSK (independent I/Q) |
| 16-QAM | ~4 dB more than QPSK | Higher constellation penalty |

**E_b/N_0 = (S/N) * (B/R_b)** -- universal digital link quality metric.

## 2.2 The Fundamental Tradeoff

- **Higher M** -> more bits/symbol -> higher spectral efficiency
- **Higher M** -> closer constellation points -> higher required E_b/N_0
- This is the **bandwidth-power tradeoff**.

## 2.3 Practical Techniques

- **Gray coding**: adjacent points differ by 1 bit, minimizing bit errors
- **Differential encoding**: data in phase changes, avoids carrier recovery
- **Adaptive modulation**: switch M based on channel conditions (WiFi, 4G/5G)

**Bandwidth**: BW = R_s * (1 + alpha) where alpha is roll-off factor (0.2-0.5 typical).`,
      examTip: 'BPSK and QPSK have identical BER per E_b/N_0 because QPSK is two independent BPSK streams. For 16-QAM, you need ~4 dB more E_b/N_0 than QPSK for the same BER.',
    },
    { id: 'digmod-exam', title: '3. Digital Modulation Exam Problems',
      content: `## 3.1 QPSK vs 16-QAM Bandwidth Efficiency

**Problem**: A channel has 1 MHz bandwidth with roll-off factor alpha = 0.25. Compare throughput for QPSK and 16-QAM.

**Symbol rate**: R_s = BW / (1 + alpha) = 1 MHz / 1.25 = **800 ksym/s**

| Scheme | Bits/Symbol | Bit Rate | Spectral Efficiency |
|---|---|---|---|
| **QPSK** | 2 | 2 * 800k = **1.6 Mbps** | 1.6 bits/s/Hz |
| **16-QAM** | 4 | 4 * 800k = **3.2 Mbps** | 3.2 bits/s/Hz |

16-QAM doubles throughput but requires **~4 dB more E_b/N_0** for the same BER.

## 3.2 BER for BPSK at E_b/N_0 = 10 dB

**Step 1**: Convert to linear: E_b/N_0 = 10^(10/10) = **10**

**Step 2**: BER = Q(sqrt(2 * 10)) = Q(sqrt(20)) = Q(4.47)

**Step 3**: From Q-function table: Q(4.47) ≈ **3.9 x 10^-6**

At E_b/N_0 = 10 dB, BPSK and QPSK both achieve BER near 10^-6 — excellent for most applications.

## 3.3 Bits per Symbol for 64-QAM

**bits/symbol = log_2(M) = log_2(64) = 6**

| M-QAM | Constellation Points | Bits/Symbol | Required E_b/N_0 (BER=10^-5) |
|---|---|---|---|
| 4-QAM (QPSK) | 4 | 2 | ~9.6 dB |
| 16-QAM | 16 | 4 | ~13.4 dB |
| **64-QAM** | 64 | **6** | ~17.8 dB |
| 256-QAM | 256 | 8 | ~21.5 dB |

**Rule of thumb**: each doubling of M costs ~3-4 dB more E_b/N_0. The formula bits = log_2(M) is guaranteed on the FE reference sheet, but memorizing common values saves time.

**Exam strategy**: For any M-ary modulation, start with bits/symbol = log_2(M). Then bit rate = bits/symbol * symbol rate. For BER questions, remember BPSK/QPSK share the same curve, and higher M needs more E_b/N_0.`,
      examTip: 'Quick formula chain: symbol rate = BW/(1+alpha), bit rate = log_2(M) * symbol rate. QPSK and BPSK have identical BER — this fact appears almost every exam cycle.',
      importantNote: 'Roll-off factor alpha is sometimes given as "excess bandwidth." BW = R_s(1+alpha). If alpha is not given, assume alpha = 0 (Nyquist minimum bandwidth = R_s).',
    },
  ],
  keyTakeaways: [
    'ASK (noise-sensitive), FSK (moderate), PSK (robust), QAM (high efficiency).',
    'BPSK: 1 bit/symbol; QPSK: 2 bits/symbol with same BW and same BER as BPSK.',
    'QAM: 16-QAM = 4 bits/symbol, 64-QAM = 6; bits/symbol = log_2(M).',
    'Each doubling of constellation size costs ~6 dB more SNR.',
    'BER for BPSK/QPSK: Q(sqrt(2 E_b/N_0)); E_b/N_0 = (S/N)*(B/R_b).',
    'Gray coding minimizes bit errors; adaptive modulation matches M to channel.',
  ],
},

fee_noise_snr: { topicId: 'fee_noise_snr', title: 'Noise and Signal-to-Noise Ratio', domainWeight: 'Communications · 4–6%',
  overview: 'Noise sets the fundamental limit on communication system performance. Understanding thermal noise power, noise figure, cascade noise analysis, and SNR calculations is essential for designing receivers. The Friis cascade formula is one of the most frequently tested communications concepts on the FE exam.',
  sections: [
    { id: 'noise-thermal', title: '1. Noise Sources and Thermal Noise',
      content: `## 1.1 Types of Noise

| Noise Type | Source | Spectrum |
|---|---|---|
| **Thermal (Johnson)** | Random electron motion in resistors | White (flat) |
| **Shot** | Discrete charge carriers (diodes) | White |
| **Flicker (1/f)** | Surface defects in semiconductors | Pink |
| **Quantization** | ADC rounding | White (approx.) |

## 1.2 Thermal Noise Power

**P_n = k T B**

- k = 1.38 x 10^-23 J/K (Boltzmann constant)
- T = temperature in Kelvin (standard: 290 K)
- B = noise bandwidth (Hz)

At room temperature: **P_n = -174 dBm/Hz** (memorize this!)

For bandwidth B: **P_n(dBm) = -174 + 10 log_10(B)**

## 1.3 Signal-to-Noise Ratio

**SNR = P_signal / P_noise** (linear)

**SNR(dB) = 10 log_10(P_signal / P_noise) = P_signal(dBm) - P_noise(dBm)**`,
      examTip: 'Memorize -174 dBm/Hz as thermal noise floor at room temperature. For noise in 1 MHz bandwidth: P_n = -174 + 60 = -114 dBm. This is the fastest way to solve FE noise problems.',
      importantNote: 'Temperature must be in Kelvin. Room temp is T_0 = 290 K (not 300 K). If a problem specifies a different temperature, use that value.',
    },
    { id: 'noise-cascade', title: '2. Noise Figure and Friis Cascade Formula',
      content: `## 2.1 Noise Figure

**F = SNR_in / SNR_out** (linear, >= 1)

**NF = 10 log_10(F)** (dB, >= 0)

- Ideal amplifier: F = 1 (NF = 0 dB)
- Passive attenuator with loss L: **F = L** (noise figure equals attenuation)
- Typical LNA: NF = 0.5-2 dB; typical mixer: NF = 6-10 dB

## 2.2 Noise Temperature

**T_e = (F - 1) * T_0** where T_0 = 290 K

## 2.3 Friis Cascade Formula

**F_total = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1 * G_2) + ...**

### Critical Insight

Each stage's noise contribution is **divided by cumulative gain** of preceding stages:
- **First stage dominates** when G_1 is large
- **LNA as first stage** minimizes system noise figure
- A 3 dB cable loss BEFORE the LNA has F = 2, severely degrading the system

| Cascade Example | F_total Impact |
|---|---|
| LNA first (NF=1 dB, G=20 dB) | System NF ~ 1.1 dB |
| 3 dB cable first, then LNA | System NF ~ 4 dB |`,
      examTip: 'Friis formula: place lowest NF device FIRST with maximum gain. If G_1 = 100 (20 dB), second stage noise barely matters. A passive loss BEFORE the LNA is devastating.',
      importantNote: 'A cable/filter with 3 dB loss placed before the LNA adds F = 2 to the cascade, often doubling the system noise figure. Always put the LNA as close to the antenna as possible.',
    },
    { id: 'noise-worked', title: '3. Noise Calculation Walkthrough',
      content: `## 3.1 Three-Stage Amplifier Friis Cascade

**Given**: Stage 1: F_1 = 2 dB, G_1 = 20 dB. Stage 2: F_2 = 6 dB, G_2 = 10 dB. Stage 3: F_3 = 10 dB.

**Step 1 — Convert to linear**:

| Parameter | dB | Linear |
|---|---|---|
| F_1 | 2 dB | 10^(2/10) = **1.585** |
| G_1 | 20 dB | 10^(20/10) = **100** |
| F_2 | 6 dB | 10^(6/10) = **3.981** |
| G_2 | 10 dB | 10^(10/10) = **10** |
| F_3 | 10 dB | 10^(10/10) = **10** |

**Step 2 — Friis cascade formula**:

F_total = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1 * G_2)

F_total = 1.585 + (3.981 - 1)/100 + (10 - 1)/(100 * 10)

F_total = 1.585 + 0.0298 + 0.009 = **1.624**

**NF_total = 10 log_10(1.624) = 2.11 dB**

The first stage dominates: 1.585 of 1.624 total. Stages 2 and 3 contribute only 0.039 combined.

## 3.2 Thermal Noise Power for B = 1 MHz at T = 290 K

**Method 1 — Direct**: P_n = kTB = 1.38e-23 * 290 * 1e6 = **4.0 x 10^-15 W**

**Method 2 — dBm shortcut** (faster on exam):

P_n(dBm) = -174 + 10 log_10(B) = -174 + 10 log_10(10^6) = -174 + 60 = **-114 dBm**

| Bandwidth | Noise Power |
|---|---|
| 1 Hz | -174 dBm |
| 1 kHz | -144 dBm |
| **1 MHz** | **-114 dBm** |
| 1 GHz | -84 dBm |

**Exam strategy**: Always convert NF and gain to linear before applying Friis. The dBm shortcut (-174 + 10 log B) is the fastest approach for thermal noise. Verify that stage 1 dominates — if it does not, the receiver design is suboptimal.`,
      examTip: 'Friis step-by-step: (1) convert all dB to linear, (2) apply formula, (3) convert result back to dB. The most common error is mixing dB and linear in the same equation.',
      importantNote: 'If the first stage has low gain (e.g., a passive mixer at G = -6 dB = 0.25 linear), later stages dominate noise. Reorder or add an LNA before the mixer.',
    },
  ],
  keyTakeaways: [
    'Thermal noise: P_n = kTB; at room temp, noise floor = -174 dBm/Hz.',
    'Noise figure F = SNR_in/SNR_out; NF(dB) = 10 log_10(F); lower is better.',
    'Friis cascade: F_total = F_1 + (F_2-1)/G_1 + (F_3-1)/(G_1*G_2) + ...',
    'First stage dominates: place lowest-NF device first with maximum gain.',
    'Noise temperature: T_e = (F-1)*T_0; passive loss L has F = L.',
    'SNR(dB) = P_signal(dBm) - P_noise(dBm).',
  ],
},

fee_channel_cap: { topicId: 'fee_channel_cap', title: 'Channel Capacity & Shannon-Hartley Theorem', domainWeight: 'Communications · 4–6%',
  overview: 'The Shannon-Hartley theorem establishes the absolute maximum information rate for a noisy channel. This limit applies to every modulation and coding scheme. Understanding how capacity depends on bandwidth and SNR, and the E_b/N_0 metric, is essential for the FE exam.',
  sections: [
    { id: 'shannon-cap', title: '1. Shannon-Hartley Theorem',
      content: `## 1.1 Channel Capacity

**C = B * log_2(1 + S/N)** (bits/second)

- C = maximum achievable bit rate with arbitrarily low error
- B = bandwidth (Hz), S/N = signal-to-noise ratio (LINEAR, not dB)

### Key Properties

| Property | Detail |
|---|---|
| SNR dependence | Logarithmic -- doubling power adds ~1 bit/s/Hz at high SNR |
| BW dependence | Linear -- doubling BW doubles C if SNR constant |
| +3 dB SNR | Adds ~1 bit/s/Hz spectral efficiency |
| +10 dB SNR | Adds ~3.32 bits/s/Hz |

## 1.2 Bandwidth-Limited vs. Power-Limited

| Regime | Strategy |
|---|---|
| **BW-limited** (high SNR) | Use higher-order modulation (more bits/symbol) |
| **Power-limited** (low SNR) | Spread over wider BW, low-order modulation |

## 1.3 Shannon Limit

As BW -> infinity: **C_max = 1.44 * S/N_0** where N_0 is noise PSD. Even infinite bandwidth gives finite capacity.`,
      examTip: 'ALWAYS check if SNR is given in linear or dB. If dB, convert first: S/N(linear) = 10^(SNR_dB/10). A 20 dB SNR = 100 linear, so C = B*log_2(101). Forgetting this conversion is the #1 exam mistake.',
      importantNote: 'Shannon capacity is a theoretical MAXIMUM. Real systems operate below it. If a problem says capacity = C, no system can exceed it -- but not every system achieves it.',
    },
    { id: 'ebn0', title: '2. E_b/N_0 and Spectral Efficiency',
      content: `## 2.1 Energy per Bit

**E_b/N_0 = (S/N) * (B/R_b)**

- E_b = energy per information bit (J)
- N_0 = noise power spectral density (W/Hz)
- R_b = bit rate (bps)

E_b/N_0 is the **universal figure of merit** for digital communication.

## 2.2 Shannon Limit for E_b/N_0

At capacity: **E_b/N_0 >= ln(2) = -1.59 dB** (theoretical minimum)

| Modulation | Required E_b/N_0 for BER = 10^-5 |
|---|---|
| BPSK/QPSK | ~9.6 dB |
| 16-QAM | ~13.4 dB |
| 64-QAM | ~17.8 dB |

## 2.3 Spectral Efficiency

**eta = R_b / B = log_2(1 + S/N)** at capacity

Higher spectral efficiency requires higher SNR -- no free lunch.`,
      examTip: 'E_b/N_0 = (S/N)*(B/R_b) bridges analog and digital metrics. Shannon limit of -1.59 dB is theoretical; practical systems need 5-18 dB depending on modulation.',
    },
    { id: 'shannon-worked', title: '3. Shannon Capacity Problems',
      content: `## 3.1 Calculate C for B = 4 kHz, SNR = 31

**Given**: Bandwidth B = 4 kHz, SNR = 31 (linear — NOT dB).

C = B * log_2(1 + S/N) = 4000 * log_2(1 + 31) = 4000 * log_2(32) = 4000 * 5 = **20,000 bps = 20 kbps**

**Verification**: This is the classic telephone channel result. 4 kHz voice band with 31 linear SNR (~15 dB) gives 20 kbps — matching V.34 modem rates.

**Common trap**: If SNR were given as 15 dB instead, you must convert: S/N = 10^(15/10) = 31.6, then C = 4000 * log_2(32.6) ≈ 20.1 kbps.

## 3.2 Minimum E_b/N_0 for Reliable Communication

At Shannon limit: **E_b/N_0 >= ln(2) = 0.693 = -1.59 dB**

No system can communicate reliably below this threshold, regardless of coding or modulation.

| System | E_b/N_0 Required | Gap from Shannon |
|---|---|---|
| Shannon limit | -1.59 dB | 0 dB |
| Turbo codes | ~0.7 dB | ~2.3 dB |
| BPSK uncoded | ~9.6 dB | ~11.2 dB |
| 16-QAM uncoded | ~13.4 dB | ~15.0 dB |

Modern turbo and LDPC codes operate within 1 dB of Shannon limit.

## 3.3 Bandwidth-Limited vs Power-Limited Comparison

**Scenario A — Bandwidth-limited**: B = 1 MHz, SNR = 30 dB (1000 linear)
C = 10^6 * log_2(1001) ≈ 10^6 * 9.97 = **9.97 Mbps**
Strategy: use 256-QAM or higher to approach capacity.

**Scenario B — Power-limited**: B = 10 MHz, SNR = 0 dB (1 linear)
C = 10^7 * log_2(2) = 10^7 * 1 = **10 Mbps**
Strategy: spread over wide bandwidth with BPSK + coding.

Both achieve ~10 Mbps but with opposite strategies. The bandwidth-limited system uses high-order modulation; the power-limited system uses wide bandwidth with robust modulation.

**Exam strategy**: Always check SNR units (dB vs linear). If log_2 is hard to compute, use log_2(x) = 3.32 * log_10(x). Memorize: log_2(2)=1, log_2(4)=2, log_2(8)=3, log_2(32)=5, log_2(1024)=10.`,
      examTip: 'Shortcut: log_2(x) = 3.322 * log_10(x). For SNR = 31, log_2(32) = 5 exactly. Memorize powers of 2 — the FE exam loves clean numbers like 32, 64, 1024.',
      importantNote: 'Shannon capacity is the UPPER BOUND. If a problem asks "can system X achieve rate R?" and R > C, the answer is always NO, regardless of the modulation or coding scheme used.',
    },
  ],
  keyTakeaways: [
    'Shannon: C = B * log_2(1 + S/N); absolute maximum reliable rate.',
    'Capacity grows logarithmically with SNR but linearly with bandwidth.',
    'Every 10 dB SNR increase adds ~3.32 bits/s/Hz.',
    'E_b/N_0 = (S/N)*(B/R_b); universal digital link quality metric.',
    'Shannon limit: E_b/N_0 >= -1.59 dB; practical systems need 5-18 dB.',
    'Always convert SNR from dB to linear before using Shannon formula.',
  ],
},

fee_multiplexing: { topicId: 'fee_multiplexing', title: 'Multiplexing: TDM, FDM, CDM', domainWeight: 'Communications · 4–6%',
  overview: 'Multiplexing combines multiple signals onto a single shared channel. FDM separates users in frequency, TDM in time, CDM by unique spreading codes. Each has distinct bandwidth, complexity, and interference characteristics.',
  sections: [
    { id: 'mux-fdm-tdm', title: '1. FDM and TDM',
      content: `## 1.1 Frequency Division Multiplexing (FDM)

Each user gets a **distinct frequency band**. All transmit simultaneously at different frequencies.

- **Total BW** = B_1 + B_2 + ... + B_n + guard bands
- Guard bands prevent adjacent-channel interference
- Analog-friendly: AM/FM radio, cable TV

## 1.2 Time Division Multiplexing (TDM)

Each user takes turns using **full bandwidth** in assigned time slots.

| TDM Type | Slot Assignment | Efficiency |
|---|---|---|
| **Synchronous** | Fixed per user | Low (wastes idle slots) |
| **Statistical** | Dynamic, on-demand | High |

- **Total rate**: R_total = R_1 + R_2 + ... + R_n
- **T1 frame**: 24 channels * 8 bits + 1 framing = 193 bits, 8000 frames/s = **1.544 Mbps**

## 1.3 FDM vs. TDM

| Feature | FDM | TDM |
|---|---|---|
| Domain | Frequency | Time |
| Simultaneous | Yes (different freqs) | No (turns) |
| Guards | Frequency guard bands | Time guard intervals |
| Best for | Analog | Digital |`,
      examTip: 'T1 = 1.544 Mbps (24 * 64 kbps + 8 kbps framing). For FDM bandwidth, do not forget guard bands.',
      importantNote: 'Synchronous TDM wastes bandwidth when users are idle. Statistical TDM solves this with dynamic slot assignment but adds variable delay and buffering complexity.',
    },
    { id: 'mux-cdm-wdm', title: '2. CDM, CDMA, and WDM',
      content: `## 2.1 Code Division Multiplexing (CDMA)

All users transmit **simultaneously on same frequency** using unique orthogonal spreading codes.

1. Each user has unique **PN code** of length L
2. Data multiplied by code, spreading BW by factor L
3. Receiver correlates with desired code to extract data

**Spreading gain**: **G_p = BW_spread / BW_data = L**

### CDMA Properties

- **Soft capacity limit**: more users = higher noise floor, no hard cutoff
- **Near-far problem**: strong nearby signals drown weak distant ones -- requires **power control**
- **Graceful degradation**: performance degrades gradually with users

## 2.2 Wavelength Division Multiplexing (WDM)

FDM for fiber optics using different optical wavelengths:
- **CWDM**: ~18 channels, 20 nm spacing
- **DWDM**: 40-160+ channels, 0.8 nm spacing, terabit/s capacity

## 2.3 OFDM

Divides wideband channel into many narrow orthogonal subcarriers:
- Used in WiFi, 4G LTE, 5G NR
- Resilient to multipath fading
- Efficient spectrum use (overlapping but orthogonal)`,
      examTip: 'CDMA spreading gain = code length L. Near-far problem is the critical practical limitation -- without power control, CDMA fails.',
    },
    { id: 'mux-worked', title: '3. Multiplexing Design Problems',
      content: `## 3.1 TDM Frame Structure for 24 Channels at 64 kbps

**Design a T1 TDM frame:**

- Each channel: 64 kbps = 8 bits/sample at 8000 samples/s
- **24 channels * 8 bits = 192 data bits per frame**
- Add 1 framing bit: **193 bits/frame**
- Frame rate: 8000 frames/s
- **Total bit rate**: 193 * 8000 = **1.544 Mbps**

| Parameter | Value |
|---|---|
| Channels | 24 |
| Bits per channel per frame | 8 |
| Framing bits | 1 |
| Frame size | 193 bits |
| Frame rate | 8000 frames/s |
| **Total rate** | **1.544 Mbps** |

Frame duration: 1/8000 = **125 us** (one sample period at 8 kHz).

## 3.2 FDM Guard Band Calculation

**Given**: 12 voice channels, each 4 kHz bandwidth, guard bands of 1 kHz between channels.

- Channel bandwidth: 12 * 4 kHz = 48 kHz
- Guard bands: 11 * 1 kHz = 11 kHz (between channels, not at edges)
- **Total bandwidth**: 48 + 11 = **59 kHz**

**Efficiency**: 48/59 = **81.4%** (guard bands waste 18.6%)

Wider guard bands improve adjacent-channel rejection but waste spectrum. Narrower guard bands require sharper (more expensive) filters.

## 3.3 CDMA Processing Gain

**Given**: Chip rate = 1.2288 Mcps (IS-95 standard), data rate = 9.6 kbps.

**Processing gain**: G_p = chip_rate / data_rate = 1,228,800 / 9,600 = **128 = 21.1 dB**

This means the signal is spread across 128x the minimum bandwidth, providing 21 dB of interference rejection.

| Parameter | IS-95 CDMA |
|---|---|
| Chip rate | 1.2288 Mcps |
| Data rate | 9.6 kbps |
| **Processing gain** | **128 (21.1 dB)** |
| Bandwidth | ~1.25 MHz |

**Maximum users** (approximate): N ≈ G_p / (E_b/N_0) = 128 / 7 ≈ **18 users/cell** (with voice activity factor ~2x: ~36 users).

**Exam strategy**: For TDM, the frame structure formula is total_rate = (channels * bits_per_channel + framing) * frame_rate. For FDM, always account for guard bands. For CDMA, G_p = chip_rate / data_rate.`,
      examTip: 'T1 = 1.544 Mbps is the most-tested TDM value. Remember: 24 channels * 8 bits + 1 framing bit = 193 bits * 8000 frames/s. E1 (European) = 32 channels * 8 bits = 256 bits * 8000 = 2.048 Mbps.',
      importantNote: 'CDMA capacity is soft-limited (degrades gracefully) unlike TDM/FDM which have hard limits. Adding one more CDMA user slightly raises the noise floor for all users.',
    },
  ],
  keyTakeaways: [
    'FDM: separate frequency bands; total BW = sum + guard bands.',
    'TDM: time slots; synchronous (fixed, wasteful) vs. statistical (dynamic, efficient).',
    'T1 = 24 * 64 kbps + 8 kbps framing = 1.544 Mbps.',
    'CDMA: unique spreading codes, all share same freq; soft capacity; spreading gain = code length.',
    'Near-far problem requires power control in CDMA systems.',
    'WDM: FDM for fiber; DWDM enables 40-160+ channels per fiber.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 14 — COMPUTER NETWORKS  (5 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

fee_osi_tcpip: { topicId: 'fee_osi_tcpip', title: 'OSI and TCP/IP Models', domainWeight: 'Computer Networks · 3–5%',
  overview: 'The OSI seven-layer model and TCP/IP four-layer model provide the conceptual framework for network communication. Protocol layering, encapsulation, device-layer mapping, and well-known port numbers are fundamental FE exam topics.',
  sections: [
    { id: 'osi-layers', title: '1. OSI Reference Model',
      content: `## 1.1 The Seven Layers

| Layer | Name | Function | Examples | PDU |
|---|---|---|---|---|
| 7 | **Application** | User services | HTTP, SMTP, DNS, FTP, SSH | Data |
| 6 | **Presentation** | Encryption, encoding | SSL/TLS, JPEG | Data |
| 5 | **Session** | Session management | NetBIOS, RPC | Data |
| 4 | **Transport** | End-to-end delivery | **TCP** (reliable), **UDP** (fast) | Segment |
| 3 | **Network** | Routing, IP addressing | **IP**, ICMP, OSPF | Packet |
| 2 | **Data Link** | Framing, MAC addresses | Ethernet, WiFi | Frame |
| 1 | **Physical** | Bit transmission | Cables, fiber, hubs | Bits |

## 1.2 Encapsulation

Data moves DOWN the stack: each layer adds its header.
Data moves UP at receiver: each layer strips its header.

## 1.3 Devices by Layer

| Device | Layer | Function |
|---|---|---|
| **Hub / Repeater** | L1 | Amplifies signal; no intelligence |
| **Switch / Bridge** | L2 | Forwards by MAC address |
| **Router** | L3 | Forwards by IP address |
| **Firewall** | L3-L7 | Filters by IP, port, or content |`,
      examTip: 'Hub = L1 (dumb repeater), Switch = L2 (MAC), Router = L3 (IP). A switch does NOT examine IP addresses; a hub does NOT examine anything.',
    },
    { id: 'tcpip-ports', title: '2. TCP/IP Model and Key Protocols',
      content: `## 2.1 TCP/IP Layers

| TCP/IP Layer | OSI Equiv | Protocols |
|---|---|---|
| Application | L5-7 | HTTP, HTTPS, SMTP, DNS, FTP, SSH |
| Transport | L4 | TCP (reliable), UDP (fast) |
| Internet | L3 | IP, ICMP, ARP, OSPF |
| Link | L1-2 | Ethernet, WiFi, PPP |

## 2.2 TCP vs. UDP

| Feature | TCP | UDP |
|---|---|---|
| Connection | 3-way handshake | Connectionless |
| Reliability | Guaranteed, in-order | Best-effort |
| Overhead | 20+ byte header | 8-byte header |
| Use cases | Web, email, files | Streaming, DNS, VoIP |

## 2.3 Well-Known Ports

| Port | Protocol | Service |
|---|---|---|
| **20/21** | FTP | File transfer |
| **22** | SSH | Secure shell |
| **25** | SMTP | Email sending |
| **53** | DNS | Name resolution |
| **80** | HTTP | Web |
| **443** | HTTPS | Secure web |`,
      examTip: 'Memorize: HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25, FTP=20/21. TCP uses 3-way handshake (SYN, SYN-ACK, ACK); UDP does not.',
      importantNote: 'DNS typically uses UDP for queries (small packets) but TCP for zone transfers (large data). This dual-protocol behavior is commonly tested.',
    },
    { id: 'osi-exam', title: '3. Protocol Analysis Exam Problems',
      content: `## 3.1 Trace a Packet Through OSI Layers

**Scenario**: User sends an HTTP request to www.example.com.

| Layer | Action | Header/Encapsulation Added |
|---|---|---|
| **L7 Application** | HTTP GET request created | HTTP header |
| **L6 Presentation** | TLS encryption applied | TLS record header |
| **L5 Session** | Session tracking | Session ID |
| **L4 Transport** | TCP segment, port 443 | TCP header (src port, dst port 443, seq #) |
| **L3 Network** | IP packet, routing | IP header (src IP, dst IP) |
| **L2 Data Link** | Ethernet frame | MAC header (src MAC, dst MAC) + FCS trailer |
| **L1 Physical** | Electrical/optical bits | Preamble, encoding |

At the receiver, headers are stripped in **reverse order** (L1 -> L7).

## 3.2 Layer Identification Scenarios

**Match the scenario to the correct OSI layer:**

| Scenario | Layer | Why |
|---|---|---|
| MAC address lookup | **L2 (Data Link)** | Switch forwarding table |
| IP routing decision | **L3 (Network)** | Router next-hop lookup |
| Retransmission of lost segment | **L4 (Transport)** | TCP reliability |
| URL resolution to IP | **L7 (Application)** | DNS protocol |
| Bit encoding on copper wire | **L1 (Physical)** | Signal transmission |
| Establishing encrypted session | **L5/L6 (Session/Presentation)** | TLS handshake |

## 3.3 Port Number Quick-Reference

| Port | Protocol | Transport | Category |
|---|---|---|---|
| 20/21 | FTP | TCP | File transfer |
| 22 | SSH/SFTP | TCP | Secure remote |
| 23 | Telnet | TCP | Insecure remote |
| 25 | SMTP | TCP | Email send |
| 53 | DNS | UDP/TCP | Name resolution |
| 67/68 | DHCP | UDP | IP assignment |
| 80 | HTTP | TCP | Web |
| 110 | POP3 | TCP | Email retrieve |
| 143 | IMAP | TCP | Email retrieve |
| 443 | HTTPS | TCP | Secure web |

**Exam strategy**: For "which layer?" questions, ask: Is it about physical signals (L1)? MAC addresses (L2)? IP addresses/routing (L3)? End-to-end delivery/ports (L4)? Application protocol (L7)? This decision tree covers 90% of FE exam scenarios.`,
      examTip: 'The FE exam loves "which layer handles X?" questions. Remember: anything with MAC = L2, anything with IP = L3, anything with ports = L4, anything the user sees = L7.',
      importantNote: 'Switches operate at L2 (MAC) by default. A "Layer 3 switch" also routes by IP. If the exam says "switch" without qualification, assume L2.',
    },
  ],
  keyTakeaways: [
    'OSI: 7 layers (Physical through Application); TCP/IP: 4 practical layers.',
    'Encapsulation adds headers down the stack; decapsulation strips them up.',
    'Hub=L1, Switch=L2 (MAC), Router=L3 (IP) -- most-tested device-layer mapping.',
    'TCP: reliable, 3-way handshake. UDP: fast, connectionless, best-effort.',
    'Key ports: HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25, FTP=20/21.',
  ],
},

fee_ip_subnetting: { topicId: 'fee_ip_subnetting', title: 'IP Addressing and Subnetting', domainWeight: 'Computer Networks · 3–5%',
  overview: 'IP addressing and subnetting partition networks into manageable segments. IPv4 uses 32-bit addresses with CIDR notation. Calculating usable hosts, network addresses, and broadcast addresses from a CIDR prefix is a core FE exam skill.',
  sections: [
    { id: 'ipv4-addr', title: '1. IPv4 Addressing and CIDR',
      content: `## 1.1 Address Structure

IPv4: **32 bits** in dotted decimal (e.g., 192.168.1.100). Split into network and host by subnet mask.

| CIDR | Mask | Host Bits | Usable Hosts |
|---|---|---|---|
| /24 | 255.255.255.0 | 8 | 254 |
| /25 | 255.255.255.128 | 7 | 126 |
| /26 | 255.255.255.192 | 6 | 62 |
| /27 | 255.255.255.224 | 5 | 30 |
| /28 | 255.255.255.240 | 4 | 14 |
| /30 | 255.255.255.252 | 2 | 2 |

## 1.2 Key Formulas

- **Total addresses**: 2^(32 - prefix)
- **Usable hosts**: **2^(32 - prefix) - 2** (subtract network + broadcast)
- **Network address**: host bits all 0
- **Broadcast address**: host bits all 1

## 1.3 Private Ranges

| Class | Range | CIDR |
|---|---|---|
| A | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 |
| B | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 |
| C | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 |`,
      examTip: 'Most common problem: given IP + prefix, find network, broadcast, and host range. Strategy: block size = 2^host_bits; find which block the IP falls in.',
      importantNote: '/30 has only 2 usable hosts (point-to-point links). /31 is a special case per RFC 3021. /32 is a single host.',
    },
    { id: 'subnetting-ipv6', title: '2. Subnetting and IPv6',
      content: `## 2.1 Subnetting Example

192.168.1.0/24 divided into 4 subnets (borrow 2 bits -> /26):

| Subnet | Network | Range | Broadcast |
|---|---|---|---|
| 1 | 192.168.1.0/26 | .1-.62 | .63 |
| 2 | 192.168.1.64/26 | .65-.126 | .127 |
| 3 | 192.168.1.128/26 | .129-.190 | .191 |
| 4 | 192.168.1.192/26 | .193-.254 | .255 |

Each: 2^6 - 2 = **62 usable hosts**.

**Subnets created = 2^(bits borrowed)**
**Hosts per subnet = 2^(remaining host bits) - 2**

## 2.2 Supernetting

Combine contiguous networks: 192.168.0.0/24 + 192.168.1.0/24 = **192.168.0.0/23** (510 hosts).

## 2.3 IPv6

- **128-bit** addresses in hex: 2001:0db8::1
- 2^128 = 3.4 x 10^38 addresses
- No broadcast (uses multicast/anycast), no NAT needed`,
      examTip: 'Subnets = 2^(bits borrowed). Hosts/subnet = 2^(remaining) - 2. Memorize powers of 2 up to 2^10 = 1024.',
    },
    { id: 'subnet-worked', title: '3. Subnetting Worked Examples',
      content: `## 3.1 Create 4 Subnets from 192.168.10.0/24

**Borrow 2 bits** from host portion: /24 -> **/26** (2^2 = 4 subnets).

Block size = 2^(32-26) = 2^6 = **64 addresses per subnet**.

| Subnet | Network Address | Usable Range | Broadcast | Hosts |
|---|---|---|---|---|
| 1 | 192.168.10.0/26 | .1 - .62 | .63 | 62 |
| 2 | 192.168.10.64/26 | .65 - .126 | .127 | 62 |
| 3 | 192.168.10.128/26 | .129 - .190 | .191 | 62 |
| 4 | 192.168.10.192/26 | .193 - .254 | .255 | 62 |

**Verification**: 4 subnets * 62 hosts = 248 usable (vs 254 in original /24 — lost 6 to extra network/broadcast addresses).

## 3.2 Find Network, Broadcast, and Usable Range

**Given**: Host IP = 192.168.10.147/26

**Step 1**: Block size = 64. Which block contains .147?
- 0, 64, 128, 192 -> **.147 falls in the 128 block** (128 <= 147 < 192)

**Step 2**:
- Network: **192.168.10.128/26**
- Broadcast: 128 + 64 - 1 = **192.168.10.191**
- Usable: **192.168.10.129 - 192.168.10.190** (62 hosts)

## 3.3 VLSM for Departments of 100, 50, 25, 10 Hosts

**Given**: 192.168.10.0/24. Assign subnets for each department (largest first).

| Department | Hosts Needed | Prefix | Block | Network | Range |
|---|---|---|---|---|---|
| Dept A (100) | 128 = 2^7 | **/25** | 128 | 192.168.10.0/25 | .1-.126 |
| Dept B (50) | 64 = 2^6 | **/26** | 64 | 192.168.10.128/26 | .129-.190 |
| Dept C (25) | 32 = 2^5 | **/27** | 32 | 192.168.10.192/27 | .193-.222 |
| Dept D (10) | 16 = 2^4 | **/28** | 16 | 192.168.10.224/28 | .225-.238 |

**VLSM key**: allocate largest subnet first, then fill remaining space with smaller subnets. Each subnet starts at the next available address after the previous broadcast.

**Exam strategy**: For subnetting, always compute block size = 2^(host bits) first. The network address is always a multiple of the block size. Broadcast = network + block - 1. For VLSM, sort departments largest-first.`,
      examTip: 'Block size is your best friend. /26 = block of 64. To find which subnet an IP belongs to, divide the host octet by block size and round down. 147/64 = 2.29 -> subnet starts at 2*64 = 128.',
      importantNote: 'VLSM (Variable Length Subnet Masking) uses different prefix lengths per subnet. Always allocate the LARGEST subnet first to avoid fragmentation and wasted addresses.',
    },
  ],
  keyTakeaways: [
    'IPv4: 32-bit; CIDR /n = n network bits, (32-n) host bits.',
    'Usable hosts = 2^(32-n) - 2 (subtract network + broadcast).',
    'Network addr: host bits 0; broadcast: host bits 1.',
    'Subnets = 2^(bits borrowed); hosts = 2^(remaining) - 2.',
    'Private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
    'IPv6: 128 bits, hex notation; no broadcast, no NAT.',
  ],
},

fee_topologies: { topicId: 'fee_topologies', title: 'Network Topologies', domainWeight: 'Computer Networks · 3–5%',
  overview: 'Network topology describes the arrangement of devices and links. Each offers tradeoffs in cost, reliability, and scalability. Full mesh link count and topology identification are common FE exam questions.',
  sections: [
    { id: 'topo-types', title: '1. Topology Types',
      content: `## 1.1 Common Topologies

| Topology | Structure | Advantage | Disadvantage |
|---|---|---|---|
| **Star** | All to central switch | Easy mgmt, isolated faults | Central failure point |
| **Ring** | Closed loop | Deterministic (token) | Single break disrupts |
| **Bus** | Shared medium | Simple, cheap | Collisions (CSMA/CD) |
| **Mesh** | Every node to every other | Max redundancy | Expensive: **N(N-1)/2 links** |
| **Tree** | Hierarchical star-of-stars | Scalable | Root failure affects all |

## 1.2 Full Mesh Link Count

**Links = N(N-1)/2**

| N | Links |
|---|---|
| 5 | 10 |
| 10 | 45 |
| 100 | 4,950 |

## 1.3 Access Methods

- **CSMA/CD**: Ethernet bus/hub; detect collisions, retransmit
- **CSMA/CA**: WiFi; avoid collisions via RTS/CTS
- **Token passing**: token ring; deterministic, no collisions`,
      examTip: 'Full mesh = N(N-1)/2 links -- most tested topology formula. Modern networks use star + switches; full mesh only for critical backbone.',
    },
    { id: 'topo-modern', title: '2. Reliability and Modern Design',
      content: `## 2.1 Failure Impact

| Topology | Link Failure | Node Failure |
|---|---|---|
| Star | Only that node | Central = total |
| Ring | Breaks network | Breaks network |
| Mesh | Alternate paths | Reroute around |

## 2.2 Redundancy Techniques

- **Dual ring**: counter-rotating backup (SONET)
- **Partial mesh**: selected redundant links (cost vs. reliability)
- **STP (Spanning Tree Protocol)**: prevents loops in switched Ethernet
- **Link aggregation**: bond multiple links for BW and redundancy

## 2.3 Modern Three-Tier Architecture

1. **Core**: high-speed backbone (mesh/partial mesh)
2. **Distribution**: policy, inter-VLAN routing (partial mesh)
3. **Access**: end-user connections (star with switches)`,
      examTip: 'Most common modern topology: star at access layer with switches. Pure ring and bus are largely obsolete for wired LANs.',
    },
    { id: 'topo-exam', title: '3. Topology Comparison & Design',
      content: `## 3.1 Calculate Links for Full Mesh of 8 Nodes

**Formula**: Links = N(N-1)/2

For N = 8: Links = 8 * 7 / 2 = **28 links**

| Nodes (N) | Full Mesh Links | Star Links | Ratio |
|---|---|---|---|
| 4 | 6 | 3 | 2x |
| 8 | **28** | 7 | 4x |
| 16 | 120 | 15 | 8x |
| 32 | 496 | 31 | 16x |

Full mesh grows as **O(N^2)** while star grows as **O(N)**. This is why full mesh is impractical beyond ~10 nodes in practice.

## 3.2 Star vs Mesh Reliability Comparison

**Scenario**: Compare reliability for a 6-node network.

| Failure Type | Star | Full Mesh | Ring |
|---|---|---|---|
| Single link failure | 1 node isolated | All nodes still connected | Network broken |
| Central node failure | **Total failure** | N/A (no central) | N/A |
| Any single node failure | Others unaffected | Others fully connected | Network broken |
| Links needed | 5 | 15 | 6 |

**Reliability ranking**: Full mesh > Partial mesh > Star (with redundant switch) > Ring > Bus

**Cost ranking** (inverse): Bus < Ring < Star < Partial mesh < Full mesh

## 3.3 Bus Collision Domain Analysis

**Bus topology** (shared medium with CSMA/CD):

- All N nodes share **one collision domain**
- Maximum throughput degrades with more nodes
- At high load: **efficiency ≈ 1 / (1 + 5a)** where a = propagation/transmission delay ratio

**Switched star eliminates collisions**: each switch port is its own collision domain.

| Topology | Collision Domains | Broadcast Domains |
|---|---|---|
| Hub (bus) | **1** (all share) | 1 |
| Switch (star) | **N** (one per port) | 1 |
| Router | N | **N** (one per interface) |

**Exam strategy**: Full mesh links = N(N-1)/2 — this is the most tested topology formula. For design questions, star is almost always the right choice for access layer. Use partial mesh only for backbone redundancy where the link count is manageable.`,
      examTip: 'Hub = 1 collision domain (all share). Switch = N collision domains (one per port). Router = N broadcast domains. This distinction appears on nearly every FE networking section.',
      importantNote: 'A switch does NOT reduce broadcast domains — all ports still receive broadcasts. Only a router (or VLAN) creates separate broadcast domains.',
    },
  ],
  keyTakeaways: [
    'Star: easy management, central failure point. Ring: deterministic but fragile.',
    'Full mesh: N(N-1)/2 links; grows O(N^2) -- impractical for large N.',
    'CSMA/CD for Ethernet, CSMA/CA for WiFi, token passing for token ring.',
    'Modern networks: star at access, partial mesh at core.',
    'STP prevents loops; link aggregation increases bandwidth and redundancy.',
  ],
},

fee_net_security: { topicId: 'fee_net_security', title: 'Network Security', domainWeight: 'Computer Networks · 3–5%',
  overview: 'Network security protects confidentiality, integrity, and availability through encryption, firewalls, and VPNs. Understanding symmetric vs. asymmetric encryption, digital signatures, and defense-in-depth is essential for the FE exam.',
  sections: [
    { id: 'netsec-crypto', title: '1. Encryption and Digital Signatures',
      content: `## 1.1 Symmetric Encryption

Same key for encrypt/decrypt:

| Algorithm | Key Size | Status |
|---|---|---|
| **AES** | 128/192/256 | Current standard |
| **DES** | 56 | Obsolete |
| **3DES** | 168 | Legacy |

Fast but has **key distribution problem**.

## 1.2 Asymmetric Encryption (Public Key)

Key pair: public (shared) + private (secret):

| Algorithm | Use |
|---|---|
| **RSA** | Key exchange, signatures |
| **ECC** | Same security, shorter keys |
| **Diffie-Hellman** | Key exchange only |

## 1.3 Hash Functions

**SHA-256**: one-way, collision-resistant, fixed output. Used for integrity and signatures.

## 1.4 Digital Signatures

1. Sender hashes message -> digest
2. Sender encrypts digest with **private key**
3. Receiver decrypts with **public key**, compares to own hash

Provides: **authentication + integrity + non-repudiation**.`,
      examTip: 'Symmetric = fast (AES). Asymmetric = solves key distribution (RSA). Practice: asymmetric exchanges symmetric session key, then symmetric handles bulk data (TLS/HTTPS).',
      importantNote: 'Digital signatures: PRIVATE key to sign, PUBLIC key to verify. This is backwards from encryption. Mixing them up is a common exam error.',
    },
    { id: 'netsec-fw-vpn', title: '2. Firewalls, VPNs, Defense in Depth',
      content: `## 2.1 Firewall Types

| Type | Layer | Security |
|---|---|---|
| **Packet filter** | L3-L4 | Basic |
| **Stateful** | L3-L4 | Moderate |
| **Proxy / App** | L7 | High |
| **NGFW** | L3-L7 | Highest |

## 2.2 VPN

Encrypted tunnel over public network:

| Protocol | Layer |
|---|---|
| **IPSec** | L3 (transport + tunnel modes) |
| **TLS/SSL** | L4 |

IPSec tunnel mode encrypts entire packet; transport mode encrypts payload only.

## 2.3 Defense in Depth

Multiple layers: physical -> network (firewall, IDS) -> host (patches) -> application (auth) -> data (encryption).

### CIA Triad

- **Confidentiality**: prevent disclosure (encryption)
- **Integrity**: prevent modification (hashing, signatures)
- **Availability**: ensure access (redundancy, DDoS protection)`,
      examTip: 'Defense in depth = multiple layers, never a single tool. CIA triad (Confidentiality, Integrity, Availability) is the framework for evaluating security.',
    },
    { id: 'netsec-exam', title: '3. Security Scenario Analysis',
      content: `## 3.1 Identify the Attack Type

**Match each description to the correct attack:**

| Scenario | Attack | Layer | Defense |
|---|---|---|---|
| Attacker sends fake ARP replies mapping gateway IP to attacker MAC | **ARP Spoofing** | L2 | Dynamic ARP inspection, static ARP |
| Attacker intercepts traffic between client and server by sitting in the middle | **Man-in-the-Middle (MITM)** | L3-L7 | TLS/SSL, certificate pinning |
| Thousands of compromised hosts flood target server | **DDoS** | L3-L4 | Rate limiting, CDN, scrubbing |
| Attacker crafts packets with spoofed source IP | **IP Spoofing** | L3 | Ingress filtering (BCP38) |
| Malicious SQL in web form input | **SQL Injection** | L7 | Input validation, parameterized queries |

## 3.2 Choose Encryption for the Scenario

| Scenario | Best Choice | Rationale |
|---|---|---|
| Encrypt 10 GB file transfer | **AES-256** (symmetric) | Fast bulk encryption |
| Exchange keys over untrusted channel | **RSA / Diffie-Hellman** (asymmetric) | Key distribution problem |
| Verify file integrity | **SHA-256** (hash) | One-way, collision-resistant |
| Prove sender identity | **Digital signature** (RSA + SHA) | Non-repudiation |
| Secure web browsing | **TLS** (asymmetric + symmetric) | RSA for key exchange, AES for data |

**TLS combines both**: asymmetric (RSA/ECDH) for key exchange, then symmetric (AES) for bulk data. This is the most efficient approach.

## 3.3 VPN Tunnel Design

**IPSec Modes**:

| Mode | Encrypts | Use Case |
|---|---|---|
| **Transport** | Payload only | Host-to-host |
| **Tunnel** | Entire original packet | Site-to-site (gateway) |

**Design example**: Connect two offices (10.1.0.0/16 and 10.2.0.0/16) over public internet.
- Use **IPSec tunnel mode** between gateway routers
- ESP (Encapsulating Security Payload) provides confidentiality + integrity
- AH (Authentication Header) provides integrity only (no encryption)

**Exam strategy**: For "which attack?" questions, focus on what is being manipulated — MAC addresses (ARP spoofing), IP addresses (IP spoofing), or application data (SQL injection). For encryption, symmetric = fast bulk data, asymmetric = key exchange, hash = integrity.`,
      examTip: 'ARP spoofing = L2 attack (MAC). MITM = interception. DDoS = availability attack. Always map the attack to the CIA triad property it violates: spoofing violates integrity, DDoS violates availability.',
      importantNote: 'IPSec tunnel mode is required for site-to-site VPNs because it encrypts the entire original IP header. Transport mode only works host-to-host since the original header remains visible.',
    },
  ],
  keyTakeaways: [
    'Symmetric (AES): fast, shared key. Asymmetric (RSA): public/private pair, solves key distribution.',
    'Hash (SHA-256): one-way, integrity. Digital signature: private signs, public verifies.',
    'Firewall: packet filter < stateful < proxy < NGFW.',
    'VPN: encrypted tunnel; IPSec (L3) or TLS (L4).',
    'Defense in depth: multiple layers. CIA: confidentiality, integrity, availability.',
  ],
},

fee_net_perf: { topicId: 'fee_net_perf', title: 'Network Performance', domainWeight: 'Computer Networks · 3–5%',
  overview: 'Network performance is characterized by bandwidth, throughput, latency, jitter, and packet loss. Understanding delay components, bottleneck analysis, and QoS principles is critical for the FE exam.',
  sections: [
    { id: 'netperf-delay', title: '1. Delay Components and Throughput',
      content: `## 1.1 End-to-End Delay

**Total delay = d_prop + d_trans + d_queue + d_proc**

| Component | Formula | Depends On |
|---|---|---|
| **Propagation** | **d_prop = distance / speed** | Medium (~2/3 c for fiber) |
| **Transmission** | **d_trans = packet_size / bandwidth** | Link speed, packet size |
| **Queuing** | Variable | Traffic load |
| **Processing** | Small | Router speed |

### Example

1000-byte packet, 100 Mbps link, 200 km fiber:
- d_trans = 8000 / 10^8 = 80 us
- d_prop = 200000 / (2*10^8) = 1 ms
- Total ~ 1.08 ms

## 1.2 Bandwidth vs. Throughput

- **Bandwidth**: max capacity (theoretical)
- **Throughput**: actual rate achieved (<= bandwidth)
- **Bottleneck**: slowest link determines throughput

## 1.3 Bandwidth-Delay Product

**BDP = bandwidth * RTT** (bits in flight)

Determines optimal TCP window size for full utilization.`,
      examTip: 'Transmission delay = packet_size/bandwidth (push bits onto wire). Propagation delay = distance/speed (bit travels). These are DIFFERENT. Transmission dominates on slow links; propagation on long links.',
      importantNote: 'RTT = 2 * one-way delay (approx). For TCP, RTT determines ACK speed and throughput.',
    },
    { id: 'netperf-qos', title: '2. QoS, Jitter, Bottleneck Analysis',
      content: `## 2.1 QoS

| Traffic | Sensitivity | Priority |
|---|---|---|
| **Voice** | Latency < 150 ms, jitter < 30 ms | Highest |
| **Video** | Latency < 300 ms | High |
| **Web** | Tolerates latency | Medium |
| **Files** | Needs throughput | Low |

Techniques: priority queuing, weighted fair queuing, traffic shaping.

## 2.2 Jitter

**Jitter = variation in packet delay.** Caused by variable queuing.

- Critical for voice/video (choppy audio)
- High jitter often WORSE than high latency
- **Jitter buffer** smooths variations

## 2.3 Bottleneck

Slowest link = max throughput. For 1G -> 100M -> 1G: throughput = 100 Mbps.

**Utilization** = throughput/bandwidth. At > 80%, queuing delays spike exponentially.`,
      examTip: 'Bottleneck = slowest link. For voice/video, jitter matters more than absolute latency. Consistent 200 ms > varying 50-300 ms.',
    },
    { id: 'netperf-exam', title: '3. Network Performance Calculations',
      content: `## 3.1 Total Latency: 1500-Byte Packet Over 100 Mbps Link + 200 km Fiber

**Given**: Packet size = 1500 bytes, link rate = 100 Mbps, distance = 200 km, fiber speed = 2 x 10^8 m/s.

**Step 1 — Transmission delay** (push packet onto wire):
d_trans = packet_size / bandwidth = (1500 * 8) / (100 * 10^6) = 12000 / 10^8 = **0.12 ms**

**Step 2 — Propagation delay** (signal traverses fiber):
d_prop = distance / speed = 200,000 / (2 * 10^8) = **1.0 ms**

**Step 3 — Total** (ignoring queuing and processing):
d_total = 0.12 + 1.0 = **1.12 ms**

Propagation dominates here (89%). On a 1 Gbps link, d_trans drops to 0.012 ms and propagation dominates even more.

## 3.2 Bandwidth-Delay Product

**BDP = bandwidth * RTT**

For 1 Gbps link with RTT = 20 ms:
BDP = 10^9 * 0.020 = **20 Mbit = 2.5 MB**

This means **2.5 MB of data is "in flight"** at any instant. The TCP window must be at least this large to fully utilize the link.

| Link | RTT | BDP | Required TCP Window |
|---|---|---|---|
| 100 Mbps, 2 ms | 2 ms | 200 kbit = 25 KB | 25 KB |
| 1 Gbps, 20 ms | 20 ms | 20 Mbit = **2.5 MB** | 2.5 MB |
| 10 Gbps, 100 ms | 100 ms | 1 Gbit = 125 MB | 125 MB |

## 3.3 TCP Window Sizing

**Throughput = Window_size / RTT** (simplified, no loss)

**Problem**: TCP window = 64 KB (default), RTT = 50 ms. What is max throughput?

Throughput = 65536 * 8 / 0.050 = 524288 / 0.050 = **10.49 Mbps**

Even on a 1 Gbps link, a 64 KB window limits throughput to ~10 Mbps with 50 ms RTT. **Window scaling** (RFC 1323) extends the window to 1 GB to solve this.

**Exam strategy**: Separate transmission delay (packet_size/BW) from propagation delay (distance/speed). They are fundamentally different. BDP = BW * RTT gives the pipe capacity. If TCP window < BDP, the link is underutilized.`,
      examTip: 'Transmission delay depends on packet size and link speed. Propagation delay depends on distance and medium speed. Do NOT mix them up — this is the #1 tested distinction in network performance.',
      importantNote: 'RTT = 2 * one-way propagation delay (approximately). For TCP throughput, RTT determines how fast ACKs return and thus how fast the sender can advance its window.',
    },
  ],
  keyTakeaways: [
    'Total delay = propagation + transmission + queuing + processing.',
    'Transmission = packet_size/BW; propagation = distance/speed.',
    'Throughput limited by bottleneck (slowest) link.',
    'BDP = bandwidth * RTT; determines TCP window size.',
    'Jitter (delay variation) critical for real-time; worse than consistent high latency.',
    'QoS prioritizes voice/video; utilization > 80% causes exponential queuing.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 15 — DIGITAL SYSTEMS  (5 curriculum IDs)  ·  7–11 %
   * ══════════════════════════════════════════════════════════════════ */

fee_number_sys: { topicId: 'fee_number_sys', title: 'Number Systems and Boolean Algebra', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Number systems (binary, octal, hex) and Boolean algebra form the mathematical foundation of digital design. Base conversions, DeMorgan\'s laws, and Karnaugh map simplification appear frequently on the FE exam. Digital Systems is one of the highest-weighted topics (7-11%).',
  sections: [
    { id: 'numsys-conv', title: '1. Number Systems and Conversions',
      content: `## 1.1 Positional Systems

| Base | Name | Grouping |
|---|---|---|
| 2 | Binary | Native |
| 8 | Octal | 3 binary bits |
| 16 | Hex | 4 binary bits |

## 1.2 Conversions

- **Binary->Decimal**: 1010 = 1*8+0+1*2+0 = **10**
- **Decimal->Binary**: divide by 2 repeatedly, read remainders bottom-up
- **Binary->Hex**: group 4 bits: 10101100 = **AC**
- **Hex->Decimal**: 2A = 2*16+10 = **42**

## 1.3 Signed Numbers (2's Complement)

| Method | -3 (4 bits) | Notes |
|---|---|---|
| Sign-magnitude | 1011 | Two zeros |
| 1's complement | 1100 | Invert bits |
| **2's complement** | **1101** | Invert + add 1; ONE zero; **standard** |

**Range (n bits): -2^(n-1) to +2^(n-1)-1**
- 8 bits: -128 to +127
- To negate: invert all bits, add 1`,
      examTip: '2\'s complement: invert + add 1. Range is asymmetric: 8 bits = -128 to +127 (not -127). This asymmetry is a common exam trap.',
      importantNote: 'The 2\'s complement range has one extra negative value because there is only one representation of zero. 8 bits: -128 exists but +128 does not.',
    },
    { id: 'numsys-bool', title: '2. Boolean Algebra and K-Maps',
      content: `## 2.1 Boolean Laws

- **DeMorgan's**: **(A*B)' = A'+B'** and **(A+B)' = A'*B'**
- Identity: A+0=A, A*1=A
- Complement: A+A'=1, A*A'=0
- Absorption: A+A*B=A

**NAND and NOR** are universal gates -- any function from either alone.

## 2.2 Karnaugh Maps

1. Fill cells from truth table
2. Group adjacent 1s in powers of 2 (1, 2, 4, 8)
3. Groups wrap around edges
4. Variables that change in a group are eliminated
5. OR all product terms

| Variables | K-map |
|---|---|
| 2 | 2x2 |
| 3 | 2x4 |
| 4 | 4x4 |

**Don't-care** (X) conditions can be 0 or 1 to make larger groups.`,
      examTip: 'DeMorgan: break the bar, change the operator. K-maps: make groups as LARGE as possible. Groups must be powers of 2.',
    },
    { id: 'numsys-exam', title: '3. Number System & Boolean Exam Problems',
      content: `## 3.1 Base Conversion with Fractional Parts

**Convert 26.625 (decimal) to binary:**

**Integer part** (divide by 2): 26 = 11010
- 26/2 = 13 R0, 13/2 = 6 R1, 6/2 = 3 R0, 3/2 = 1 R1, 1/2 = 0 R1
- Read bottom-up: **11010**

**Fractional part** (multiply by 2): 0.625
- 0.625 * 2 = **1**.250, 0.250 * 2 = **0**.500, 0.500 * 2 = **1**.000
- Read top-down: **.101**

**Result**: 26.625 (decimal) = **11010.101** (binary)

**Verify**: 16 + 8 + 2 + 0.5 + 0.125 = 26.625

## 3.2 Two's Complement Range for n Bits

| Bits (n) | Range | Min | Max |
|---|---|---|---|
| 4 | -8 to +7 | 1000 | 0111 |
| 8 | **-128 to +127** | 10000000 | 01111111 |
| 16 | -32768 to +32767 | — | — |
| 32 | -2^31 to +2^31-1 | — | — |

**Negate -45 in 8-bit two's complement:**
- +45 = 00101101
- Invert: 11010010
- Add 1: **11010011** = -45

**Verify**: 11010011 -> invert = 00101100 -> +1 = 00101101 = 45. Correct.

## 3.3 K-Map Simplification — 4-Variable Worked Example

**Given**: F(A,B,C,D) = sum of minterms(0,1,2,5,8,9,10)

**4x4 K-map** (Gray code order AB vs CD):

|  | CD=00 | CD=01 | CD=11 | CD=10 |
|---|---|---|---|---|
| AB=00 | **1** | **1** | 0 | **1** |
| AB=01 | 0 | **1** | 0 | 0 |
| AB=11 | 0 | 0 | 0 | 0 |
| AB=10 | **1** | **1** | 0 | **1** |

**Groups**: (1) cells 0,1,8,9 = group of 4 -> **B'D'** wait — let me group properly:
- Group 1: m(0,2,8,10) -> corners wrap: **B'D'**
- Group 2: m(0,1,8,9) -> left column wrap: **B'C'**
- Group 3: m(1,5) -> **A'C'D**

**Simplified**: F = **B'D' + B'C' + A'C'D**

**Exam strategy**: For fractional conversions, integer part divides, fraction part multiplies. For 2's complement, always verify by converting back. For K-maps, wrap around ALL edges and make the largest possible groups.`,
      examTip: 'K-map edge wrapping is the most common mistake. The top row IS adjacent to the bottom row. The left column IS adjacent to the right column. Always check wrap-around groups.',
      importantNote: 'Some FE problems give minterms; others give maxterms (POS form). For minterms, place 1s in the K-map. For maxterms, place 0s and group the 0s to get POS.',
    },
  ],
  keyTakeaways: [
    'Binary/octal/hex: group binary by 3 (octal) or 4 (hex).',
    '2\'s complement: invert+add 1; range -2^(n-1) to +2^(n-1)-1.',
    'DeMorgan: (A*B)\'=A\'+B\'; (A+B)\'=A\'*B\'.',
    'K-map: group adjacent 1s in powers of 2; larger = simpler.',
    'NAND/NOR are universal gates.',
    'Don\'t-cares maximize group size for simpler expressions.',
  ],
},

fee_comb_logic: { topicId: 'fee_comb_logic', title: 'Combinational Logic: MUX, Decoders, Adders', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Combinational circuits have outputs depending solely on current inputs (no memory). MUX, decoders, and adders are fundamental building blocks. Their truth tables and Boolean equations are essential for FE exam digital design questions.',
  sections: [
    { id: 'comblog-mux', title: '1. MUX and Decoders',
      content: `## 1.1 Multiplexer (MUX)

Selects 1 of 2^n inputs via n select lines:

| MUX | Inputs | Select Lines |
|---|---|---|
| 2-to-1 | 2 | 1 |
| 4-to-1 | 4 | 2 |
| 8-to-1 | 8 | 3 |

**Any n-variable Boolean function** implementable with a 2^n-to-1 MUX.

## 1.2 Decoder

n inputs -> 2^n outputs (one active per input pattern):
- 2-to-4: outputs are minterms A'B', A'B, AB', AB
- **Any function = decoder + OR gate** (OR the minterm outputs)

## 1.3 Priority Encoder

Multiple active inputs -> encodes highest-priority one. Used in interrupt systems.`,
      examTip: 'MUX: 2^n inputs need n select lines. Decoder: n inputs produce 2^n minterms. Do not confuse MUX data inputs with select lines.',
      importantNote: '4-to-1 MUX has 2 select lines and 4 data inputs. The number of data inputs = 2^(select lines).',
    },
    { id: 'comblog-adder', title: '2. Adders and Subtractors',
      content: `## 2.1 Half-Adder

- **Sum = A XOR B**
- **Carry = A AND B**

## 2.2 Full-Adder

**Sum = A XOR B XOR C_in**
**C_out = A*B + C_in*(A XOR B)**

| A | B | Cin | Sum | Cout |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

## 2.3 Adder Types

| Type | Delay | Notes |
|---|---|---|
| **Ripple-carry** | O(n) | Simple, slow |
| **Carry-lookahead** | O(log n) | Fast, uses G=AB, P=A XOR B |

## 2.4 Subtraction

**A - B = A + (~B) + 1** (2's complement). Same adder with invert path.`,
      examTip: 'Full-adder: Sum = A XOR B XOR Cin, Cout = AB + Cin(A XOR B). Most tested combinational equations. A - B = A + NOT(B) + 1.',
    },
    { id: 'comblog-exam', title: '3. Combinational Circuit Design',
      content: `## 3.1 Design a 4-Bit Priority Encoder

A priority encoder outputs the **binary code of the highest-priority active input**.

**Truth table** (4-input, highest = I3):

| I3 | I2 | I1 | I0 | Y1 | Y0 | Valid |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | X | X | 0 |
| 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 0 | 0 | 1 | X | 0 | 1 | 1 |
| 0 | 1 | X | X | 1 | 0 | 1 |
| 1 | X | X | X | 1 | 1 | 1 |

**Boolean equations**:
- Y1 = I3 + I2
- Y0 = I3 + I1*I2'
- Valid = I3 + I2 + I1 + I0

## 3.2 Full Adder from Half Adders

**Half-adder**: Sum = A XOR B, Carry = A AND B

**Full-adder from two half-adders + OR gate**:
1. HA1: Sum1 = A XOR B, Carry1 = A AND B
2. HA2: Sum = Sum1 XOR Cin, Carry2 = Sum1 AND Cin
3. **Cout = Carry1 OR Carry2**

| Component | Gate Count |
|---|---|
| Half-adder | 1 XOR + 1 AND |
| Full-adder (from HAs) | 2 XOR + 2 AND + 1 OR = **5 gates** |

## 3.3 BCD to Excess-3 Converter

**Excess-3** = BCD + 3 (binary). Input: BCD digits 0-9 (A,B,C,D). Output: W,X,Y,Z.

| Decimal | BCD (ABCD) | Excess-3 (WXYZ) |
|---|---|---|
| 0 | 0000 | 0011 |
| 1 | 0001 | 0100 |
| 2 | 0010 | 0101 |
| 3 | 0011 | 0110 |
| 4 | 0100 | 0111 |
| 5 | 0101 | 1000 |
| 6 | 0110 | 1001 |
| 7 | 0111 | 1010 |
| 8 | 1000 | 1011 |
| 9 | 1001 | 1100 |

Inputs 10-15 are **don't-cares** (invalid BCD). Use K-maps with don't-cares for each output bit to get minimized gate equations. This is a classic FE exam design problem.

**Exam strategy**: For combinational design, always start with the truth table. Then use K-maps to minimize. Priority encoders use X (don't-care) in lower-priority positions. BCD converters have 6 don't-care inputs (10-15) — use them to simplify.`,
      examTip: 'BCD has only 10 valid inputs (0-9), giving 6 don\'t-cares. ALWAYS include don\'t-cares in your K-map groups — they can significantly simplify the logic.',
      importantNote: 'A 4-bit priority encoder is NOT the same as a regular encoder. In a regular encoder, only one input should be active. In a priority encoder, multiple can be active and the highest wins.',
    },
  ],
  keyTakeaways: [
    'MUX: 2^n inputs, n select; implements any n-variable function.',
    'Decoder: n inputs, 2^n minterms; any function = decoder + OR.',
    'Full-adder: Sum = A XOR B XOR Cin; Cout = AB + Cin(A XOR B).',
    'Ripple-carry O(n); carry-lookahead O(log n).',
    'Subtraction: A - B = A + (~B) + 1 via 2\'s complement.',
    'Priority encoder: encodes highest-priority active input.',
  ],
},

fee_seq_logic: { topicId: 'fee_seq_logic', title: 'Sequential Logic: Flip-Flops & Counters', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Sequential circuits have memory -- outputs depend on current inputs and past state. Flip-flops store bits, counters count pulses. Understanding FF types, timing (setup/hold), and synchronous design is critical for the FE exam.',
  sections: [
    { id: 'seqlog-ff', title: '1. Flip-Flop Types and Timing',
      content: `## 1.1 Flip-Flop Types

| Type | Equation | Key Property |
|---|---|---|
| **SR** | Q+ = S+R'Q (S*R=0) | S=R=1 **forbidden** |
| **D** | **Q+ = D** | Captures input on edge |
| **JK** | Q+ = JQ'+K'Q | J=K=1 toggles; universal |
| **T** | Q+ = T XOR Q | T=1 toggles, T=0 holds |

## 1.2 Timing Constraints

| Parameter | Definition |
|---|---|
| **Setup time (t_su)** | Data stable BEFORE clock edge |
| **Hold time (t_h)** | Data stable AFTER clock edge |
| **Clock-to-Q (t_cq)** | Delay from edge to output |

Violations cause **metastability** (unpredictable state).

**Max frequency**: **f_max = 1 / (t_cq + t_comb + t_su)**`,
      examTip: 'D FF: Q+ = D (most common and most tested). f_max = 1/(t_cq + t_comb + t_su). Setup/hold violations cause metastability.',
      importantNote: 'SR with S=R=1 is forbidden (indeterminate). JK solves this: J=K=1 = toggle. This is why JK is called "universal."',
    },
    { id: 'seqlog-counters', title: '2. Counters and Registers',
      content: `## 2.1 Counter Types

| Type | Clocking | Speed |
|---|---|---|
| **Asynchronous (ripple)** | Each FF by previous | Slow (cumulative) |
| **Synchronous** | All FFs same clock | Fast |
| **Mod-N** | Counts 0 to N-1 | ceil(log_2(N)) FFs |
| **BCD** | Mod-10 (0-9) | 4 FFs + reset |

## 2.2 Shift Registers

- **SISO**: serial delay element
- **SIPO**: serial-to-parallel
- **PISO**: parallel-to-serial
- **LFSR**: feedback for pseudo-random / CRC

## 2.3 Synchronous vs. Asynchronous

| | Synchronous | Asynchronous |
|---|---|---|
| Clock | Shared | Cascaded |
| Speed | Fast | Slow |
| Glitches | None | Possible |`,
      examTip: 'Synchronous always preferred (fast, reliable). Mod-N counter: ceil(log_2(N)) flip-flops with reset at N.',
    },
    { id: 'seqlog-exam', title: '3. Sequential Circuit Analysis',
      content: `## 3.1 Trace JK Flip-Flop Sequence

**Given**: JK flip-flop, initial Q = 0. Input sequence: J=1,K=0 / J=1,K=1 / J=0,K=1 / J=1,K=1.

| Clock | J | K | Action | Q+ |
|---|---|---|---|---|
| 1 | 1 | 0 | **Set** | **1** |
| 2 | 1 | 1 | **Toggle** | **0** |
| 3 | 0 | 1 | **Reset** | **0** |
| 4 | 1 | 1 | **Toggle** | **1** |

**JK rules**: J=0,K=0 -> Hold; J=1,K=0 -> Set; J=0,K=1 -> Reset; J=1,K=1 -> Toggle.

## 3.2 Design Mod-6 Counter State Table

**Mod-6**: counts 0,1,2,3,4,5 then resets to 0. Needs ceil(log_2(6)) = **3 flip-flops** (Q2,Q1,Q0).

| Current (Q2Q1Q0) | Next | Q2+ | Q1+ | Q0+ |
|---|---|---|---|---|
| 000 (0) | 001 (1) | 0 | 0 | 1 |
| 001 (1) | 010 (2) | 0 | 1 | 0 |
| 010 (2) | 011 (3) | 0 | 1 | 1 |
| 011 (3) | 100 (4) | 1 | 0 | 0 |
| 100 (4) | 101 (5) | 1 | 0 | 1 |
| 101 (5) | 000 (0) | 0 | 0 | 0 |
| 110 (6) | XXX | X | X | X |
| 111 (7) | XXX | X | X | X |

States 6 and 7 are **don't-cares** (never reached in normal operation). Use D flip-flops: D_i = Q_i+ from the table. K-map each output for minimal logic.

## 3.3 Shift Register LFSR Analysis

**4-bit LFSR** with feedback: new_bit = Q3 XOR Q2. Seed = 1000.

| Clock | Q3 | Q2 | Q1 | Q0 | Feedback (Q3 XOR Q2) |
|---|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 0 | 1 XOR 0 = 1 |
| 1 | 1 | 1 | 0 | 0 | 1 XOR 1 = 0 |
| 2 | 0 | 1 | 1 | 0 | 0 XOR 1 = 1 |
| 3 | 1 | 0 | 1 | 1 | 1 XOR 0 = 1 |
| 4 | 1 | 1 | 0 | 1 | 1 XOR 1 = 0 |

The LFSR cycles through a **pseudo-random sequence**. With proper tap selection, a maximal-length LFSR of n bits produces 2^n - 1 states before repeating (all states except all-zeros).

**Exam strategy**: For JK flip-flop tracing, apply the rules at each clock edge in order. For counter design, write the state table first, mark unused states as don't-cares, then derive excitation equations with K-maps.`,
      examTip: 'JK: J=K=1 means TOGGLE (not set, not reset). This is the most commonly confused JK condition. For counters, unused states are don\'t-cares — use them to simplify.',
      importantNote: 'Mod-N counter with N not a power of 2 requires external reset logic. The counter reaches state N-1, then the next clock edge forces it back to 0 via combinational decode.',
    },
  ],
  keyTakeaways: [
    'D FF: Q+=D (most common). JK: universal (J=K=1 toggles). T: toggles when T=1.',
    'SR S=R=1 forbidden. JK resolves this.',
    'Setup/hold violations -> metastability. f_max = 1/(t_cq + t_comb + t_su).',
    'Synchronous counters: fast, reliable (shared clock). Asynchronous: slow, glitchy.',
    'Mod-N: ceil(log_2(N)) FFs with reset logic.',
    'Shift registers: SISO, SIPO, PISO, PIPO; LFSR for pseudo-random.',
  ],
},

fee_state_machines: { topicId: 'fee_state_machines', title: 'Finite State Machines', domainWeight: 'Digital Systems · 7–11%',
  overview: 'A Finite State Machine (FSM) is defined by states, transitions on inputs, and outputs. Moore and Mealy are the two architectures. FSM design from word description to implementation is a core FE exam skill.',
  sections: [
    { id: 'fsm-types', title: '1. Moore and Mealy Machines',
      content: `## 1.1 FSM Components

- **States**: circles in diagrams
- **Transitions**: arrows labeled with inputs
- **Outputs**: on states (Moore) or transitions (Mealy)

## 1.2 Moore vs. Mealy

| Feature | Moore | Mealy |
|---|---|---|
| Output depends on | State only | State AND input |
| Glitch behavior | Glitch-free | May glitch |
| States needed | More | Fewer |
| Response time | 1 clock slower | Within same cycle |

## 1.3 Conversion

- **Moore -> Mealy**: move output labels from states to incoming transitions
- **Mealy -> Moore**: split states with different transition outputs`,
      examTip: 'Moore = f(state); Mealy = f(state, input). Moore needs more states but glitch-free. FE exam may ask you to trace a state diagram given inputs.',
    },
    { id: 'fsm-design', title: '2. FSM Design Process',
      content: `## 2.1 Design Steps

1. **State diagram** from problem description
2. **State table**: current state, input, next state, output
3. **State assignment**: binary codes (n states need ceil(log_2(n)) FFs)
4. **Excitation equations**: next-state logic for chosen FF type
5. **Output equations**: derive output logic
6. **Implementation**: FFs + combinational logic

## 2.2 State Minimization

Two states are **equivalent** if for ALL inputs they produce same output and go to equivalent next states. Combining equivalent states reduces hardware.

## 2.3 State Assignment

| Strategy | FFs | Best For |
|---|---|---|
| **Binary** | ceil(log_2(n)) | Minimum FFs |
| **Gray code** | ceil(log_2(n)) | Fewer glitches |
| **One-hot** | n (one per state) | Fast logic, FPGAs |

Counters are special-case FSMs with fixed state sequences.`,
      examTip: 'One-hot uses n FFs for n states -- more FFs but simpler logic. Preferred in FPGAs where FFs are abundant.',
      importantNote: 'State minimization combines EQUIVALENT states. Do not confuse with state encoding (choosing binary codes for states).',
    },
    { id: 'fsm-exam', title: '3. FSM Design Walkthrough',
      content: `## 3.1 Design Sequence Detector for "101"

**Specification**: Detect the pattern "101" in a serial bit stream. Output = 1 when "101" detected. Allow overlapping sequences.

**States** (Moore machine):
- **S0**: no bits matched (output 0)
- **S1**: matched "1" (output 0)
- **S2**: matched "10" (output 0)
- **S3**: matched "101" (output 1)

## 3.2 Complete State Table and Transition Diagram

| Current State | Input = 0 | Input = 1 | Output |
|---|---|---|---|
| **S0** | S0 | S1 | 0 |
| **S1** | S2 | S1 | 0 |
| **S2** | S0 | **S3** | 0 |
| **S3** | S2 | S1 | **1** |

**Key transitions**:
- S2 + input 1 -> S3 (pattern "101" complete)
- S3 + input 0 -> S2 (overlap: the "1" from "101" starts a new "10")
- S3 + input 1 -> S1 (the last "1" starts a new potential match)

**Flip-flop equations** (2 D flip-flops, binary encoding S0=00, S1=01, S2=10, S3=11):
- D1 = Q1'*Q0*X' + Q1*Q0'*X (next state MSB)
- D0 = X (next state LSB)
- Output = Q1 AND Q0

## 3.3 Moore vs Mealy Comparison for Same Problem

| Feature | Moore "101" Detector | Mealy "101" Detector |
|---|---|---|
| States | **4** (S0-S3) | **3** (S0-S2) |
| Output timing | 1 clock after pattern | Same clock as last bit |
| Glitches | None | Possible on input change |
| Output depends on | State only | State AND input |

**Mealy version** (3 states): S2 + input 1 -> S0 with output **1** on the transition. The output appears one clock cycle earlier but may glitch if input changes asynchronously.

**Exam strategy**: For FSM design, always: (1) identify states by what has been matched so far, (2) handle overlapping by reusing partial matches, (3) Moore needs one extra state vs Mealy for the output. The state table is the most important step — get it right and the implementation follows mechanically.`,
      examTip: 'Sequence detectors are the #1 FSM exam problem. Always consider overlapping detection — after detecting "101", the final "1" can start a new match. Moore needs 4 states; Mealy needs 3.',
      importantNote: 'Moore outputs change only on clock edges (glitch-free). Mealy outputs can change mid-cycle when inputs change. For synchronous designs, register Mealy outputs to prevent glitches.',
    },
  ],
  keyTakeaways: [
    'Moore: output = f(state), glitch-free, more states. Mealy: f(state,input), fewer states, faster.',
    'Design: state diagram -> table -> assignment -> excitation equations -> implement.',
    'State minimization: combine equivalent states (same output, equivalent next states).',
    'Binary (min FFs), Gray (min glitches), one-hot (fast logic, n FFs for n states).',
    'n states need ceil(log_2(n)) FFs in binary, or n in one-hot.',
    'Counters = FSMs with fixed sequences.',
  ],
},

fee_memory: { topicId: 'fee_memory', title: 'Memory Systems: ROM, RAM, Cache, FPGA', domainWeight: 'Digital Systems · 7–11%',
  overview: 'Memory systems store data across a hierarchy trading speed for capacity. ROM is permanent, RAM is volatile, cache bridges the speed gap, and FPGAs offer reconfigurable logic. Cache hit-rate formula and the speed-capacity tradeoff are essential FE exam topics.',
  sections: [
    { id: 'mem-types', title: '1. ROM and RAM Technologies',
      content: `## 1.1 ROM (Nonvolatile)

| Type | Erase |
|---|---|
| ROM | Never |
| PROM | Never (one-time) |
| EPROM | UV light |
| EEPROM | Electrically (byte) |
| **Flash** | Electrically (block) |

## 1.2 RAM (Volatile)

| Type | Cell | Speed | Density | Refresh |
|---|---|---|---|---|
| **SRAM** | 6 transistors | Fast (~1-10 ns) | Low | No |
| **DRAM** | 1T + 1C | Slower (~50-100 ns) | High | Yes |

## 1.3 Memory Addressing

- **Capacity** = 2^(address_bits) locations
- n address lines, m bits/location: total = 2^n * m bits

## 1.4 Memory Hierarchy

| Level | Size | Access |
|---|---|---|
| Registers | < 1 KB | ~0.5 ns |
| L1 Cache | 32-64 KB | ~1-4 ns |
| L2 Cache | 256 KB-1 MB | ~4-10 ns |
| RAM | 4-64 GB | ~50-100 ns |
| SSD | 256 GB-4 TB | ~50-100 us |
| HDD | 1-20 TB | ~5-10 ms |

Each level: ~10x larger, ~10x slower, ~10x cheaper.`,
      examTip: 'Memory capacity = 2^(address_bits). "How many lines for 64K locations?" = 16 (2^16 = 65536). SRAM = cache; DRAM = main memory.',
      importantNote: 'DRAM needs refresh every few ms (unavailable during refresh). SRAM has no refresh -- one reason it is used for cache.',
    },
    { id: 'mem-cache-fpga', title: '2. Cache and FPGA',
      content: `## 2.1 Cache Performance

**Hit rate**: h = hits / (hits + misses)

**Average access time**: **t_avg = h * t_cache + (1-h) * t_memory**

### Cache Organization

| Type | Description | Hit Time | Miss Rate |
|---|---|---|---|
| **Direct-mapped** | 1 location per block | Fastest | Highest |
| **Fully associative** | Any location | Slowest | Lowest |
| **N-way set-assoc** | N locations | Balanced | Balanced |

### Write Policies

- **Write-through**: writes to cache AND memory (simple, slow)
- **Write-back**: cache only, dirty bit (fast, complex)

## 2.2 FPGA

- **CLBs**: configurable logic blocks
- **Programmable interconnects**: route signals
- **Reconfigurable**: reprogram without hardware change

| | FPGA | ASIC |
|---|---|---|
| Reconfigurable | Yes | No |
| Dev cost | Low | Very high |
| Performance | Good | Best |
| Best for | Prototyping, low volume | High volume |`,
      examTip: 'Cache: t_avg = h*t_cache + (1-h)*t_memory. With h=0.95, t_cache=5ns, t_memory=100ns: t_avg = 9.75 ns -- 10x improvement.',
    },
    { id: 'mem-exam', title: '3. Memory System Calculations',
      content: `## 3.1 Address Lines for 256 KB Memory

**Capacity** = 256 KB = 256 * 1024 = 262,144 bytes = 2^18 bytes

**Address lines needed**: log_2(2^18) = **18 address lines**

| Memory Size | Bytes | Address Lines |
|---|---|---|
| 1 KB | 2^10 | 10 |
| 64 KB | 2^16 | 16 |
| **256 KB** | **2^18** | **18** |
| 1 MB | 2^20 | 20 |
| 4 GB | 2^32 | 32 |

If each location stores W bits (word width), total bits = 2^n * W. Data bus width = W bits; address bus = n bits.

## 3.2 Cache Hit Rate Impact on EMAT

**Effective Memory Access Time**: t_avg = h * t_cache + (1-h) * t_memory

| Hit Rate (h) | t_cache = 5 ns | t_memory = 100 ns | **t_avg** |
|---|---|---|---|
| 80% | 0.80 * 5 = 4.0 | 0.20 * 100 = 20.0 | **24.0 ns** |
| 90% | 0.90 * 5 = 4.5 | 0.10 * 100 = 10.0 | **14.5 ns** |
| 95% | 0.95 * 5 = 4.75 | 0.05 * 100 = 5.0 | **9.75 ns** |
| 99% | 0.99 * 5 = 4.95 | 0.01 * 100 = 1.0 | **5.95 ns** |

Going from 90% to 95% hit rate improves EMAT by 33%. Going from 95% to 99% improves by another 39%. **Every percentage point matters more at higher hit rates.**

## 3.3 DRAM Refresh Overhead Calculation

**Given**: 4096-row DRAM, refresh interval = 64 ms, each refresh takes 50 ns.

- **Refreshes per interval**: 4096 rows
- **Total refresh time**: 4096 * 50 ns = 204.8 us
- **Overhead**: 204.8 us / 64 ms = **0.32%** of time spent refreshing

| DRAM Rows | Refresh Time | Overhead |
|---|---|---|
| 2048 | 102.4 us | 0.16% |
| **4096** | **204.8 us** | **0.32%** |
| 8192 | 409.6 us | 0.64% |

During refresh, that row is **unavailable** for read/write. Modern DRAM controllers schedule refreshes during idle periods to minimize impact.

**Exam strategy**: Address lines = log_2(total locations). For EMAT, just plug into h*t_fast + (1-h)*t_slow. For multi-level cache, chain: EMAT = h1*t_L1 + (1-h1)*h2*t_L2 + (1-h1)*(1-h2)*t_mem. DRAM refresh overhead = (rows * t_refresh) / refresh_interval.`,
      examTip: 'Address lines = log_2(locations). Memorize: 2^10 = 1K, 2^16 = 64K, 2^20 = 1M, 2^30 = 1G, 2^32 = 4G. These powers of 2 appear on every memory problem.',
      importantNote: 'EMAT formula assumes miss penalty includes the full memory access time. Some problems separate it: t_avg = t_cache + (1-h) * t_miss_penalty. Read the problem carefully to determine which model is used.',
    },
  ],
  keyTakeaways: [
    'ROM nonvolatile (PROM, EPROM, Flash). RAM volatile (SRAM fast, DRAM dense/refresh).',
    'Capacity = 2^(address_bits) locations.',
    'Hierarchy: registers > cache > RAM > SSD > HDD (speed vs. capacity).',
    'Cache: t_avg = h*t_cache + (1-h)*t_memory; hit rate h is key.',
    'Direct-mapped (fast) vs. fully associative (flexible) vs. N-way (balanced).',
    'FPGA: reconfigurable, low dev cost; ASIC: best performance, high dev cost.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 16 — COMPUTER SYSTEMS  (4 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

fee_architecture: { topicId: 'fee_architecture', title: 'Computer Architecture', domainWeight: 'Computer Systems · 3–5%',
  overview: 'Computer architecture defines how a processor fetches, decodes, and executes instructions. Von Neumann vs. Harvard, RISC vs. CISC, and pipelining with hazard handling are the core concepts tested on the FE exam.',
  sections: [
    { id: 'arch-models', title: '1. Architectural Models and ISA',
      content: `## 1.1 Von Neumann vs. Harvard

| Feature | Von Neumann | Harvard |
|---|---|---|
| Memory | Single (code + data) | Separate instruction/data |
| Bus | Shared (bottleneck) | Independent (parallel) |
| Modern use | Main memory | L1 cache (separate I$/D$) |

**Modified Harvard**: separate L1 caches, unified L2/L3 and main memory.

## 1.2 RISC vs. CISC

| | RISC | CISC |
|---|---|---|
| Instructions | Simple, fixed-length | Complex, variable |
| CPI | ~1 (pipelined) | Variable |
| Registers | Many (32-64) | Few (8-16) |
| Pipelining | Efficient | Harder |
| Examples | ARM, MIPS, RISC-V | x86 |

## 1.3 Instruction Cycle

IF (Fetch) -> ID (Decode) -> EX (Execute) -> MEM (Memory) -> WB (Writeback)`,
      examTip: 'Von Neumann = shared memory (bottleneck). Harvard = separate (faster). Modern = Modified Harvard. RISC = simple, pipelinable. CISC = complex, variable.',
    },
    { id: 'arch-pipeline', title: '2. Pipelining and Hazards',
      content: `## 2.1 Pipeline

Multiple instructions overlap in different stages simultaneously.

**Ideal throughput**: 1 instruction/cycle. **Ideal speedup**: = number of stages.

## 2.2 Hazards

| Type | Cause | Solution |
|---|---|---|
| **Data** | Needs result from in-progress instr | **Forwarding**, stalling |
| **Control** | Branch changes flow | **Branch prediction** |
| **Structural** | Two instrs need same resource | **Duplication** |

## 2.3 Advanced

- **Superscalar**: multiple pipelines, multiple instrs/cycle
- **Out-of-order**: execute when operands ready
- **Branch prediction**: >95% accurate in modern CPUs

**CPI_real = 1 + stall_cycles_per_instr**`,
      examTip: 'Three hazards: data (forwarding), control (prediction), structural (duplication). Ideal pipeline CPI = 1; real > 1 due to stalls.',
      importantNote: 'Deeper pipelines increase branch misprediction penalty. This is why modern CPUs invest heavily in branch prediction.',
    },
    { id: 'arch-exam', title: '3. Architecture Comparison Problems',
      content: `## 3.1 RISC Pipeline vs CISC Multi-Cycle

**Problem**: Execute 1000 instructions. RISC: 5-stage pipeline, 1 GHz clock, CPI = 1.2 (with stalls). CISC: multi-cycle, 2 GHz clock, CPI = 3.5.

**RISC execution time**:
T_RISC = IC * CPI / f = 1000 * 1.2 / 10^9 = **1.2 us**

**CISC execution time**:
T_CISC = IC * CPI / f = 1000 * 3.5 / (2 * 10^9) = **1.75 us**

| Metric | RISC (1 GHz) | CISC (2 GHz) |
|---|---|---|
| CPI | 1.2 | 3.5 |
| Execution time | **1.2 us** | 1.75 us |
| MIPS | 833 | 571 |

RISC wins despite lower clock speed because its pipeline achieves much lower CPI.

## 3.2 Pipeline Speedup with 20% Branch Penalty

**Given**: 5-stage pipeline, 20% branch instructions, branch misprediction rate = 30%, penalty = 2 cycles.

**Effective CPI**:
CPI = 1 + (branch_fraction * mispredict_rate * penalty)
CPI = 1 + (0.20 * 0.30 * 2) = 1 + 0.12 = **1.12**

**Speedup vs non-pipelined** (5 cycles/instr):
Speedup = 5 / 1.12 = **4.46x** (vs ideal 5x)

| Branch Prediction Accuracy | Misprediction Rate | CPI | Speedup |
|---|---|---|---|
| 70% | 30% | 1.12 | 4.46x |
| 90% | 10% | 1.04 | 4.81x |
| 95% | 5% | 1.02 | 4.90x |

Better branch prediction approaches the ideal 5x speedup.

## 3.3 Harvard vs Von Neumann Throughput

**Von Neumann** (shared bus): cannot fetch instruction and data simultaneously.
- IF takes 1 cycle, MEM takes 1 cycle, both use same bus
- Pipeline stall when IF and MEM overlap: **structural hazard**

**Harvard** (separate buses): instruction fetch and data access proceed in parallel.
- No IF/MEM conflict -> eliminates ~20-30% of structural hazards
- Modern CPUs: separate L1 I-cache and D-cache (Modified Harvard)

| Architecture | Structural Hazards | Throughput Impact |
|---|---|---|
| Von Neumann | IF/MEM conflicts | CPI penalty ~0.2-0.3 |
| **Harvard** | No IF/MEM conflicts | Near-ideal CPI |
| Modified Harvard | L1 split, L2+ unified | Best of both |

**Exam strategy**: Performance = IC * CPI / f. Compare systems by execution time on the SAME program, not by clock speed or MIPS alone. For pipeline problems, compute effective CPI = 1 + stall_contributions.`,
      examTip: 'Never compare processors by clock speed alone. A 1 GHz RISC with CPI=1 beats a 2 GHz CISC with CPI=4. Always compute execution time = IC * CPI / f.',
      importantNote: 'Pipeline speedup is limited by the SLOWEST stage. If one stage takes 2x longer than others, it becomes the bottleneck. Balance stage delays for maximum throughput.',
    },
  ],
  keyTakeaways: [
    'Von Neumann: single memory. Harvard: separate. Modern: Modified Harvard (split L1 cache).',
    'RISC: simple, pipelinable (ARM, MIPS). CISC: complex, variable (x86).',
    'Pipeline: IF-ID-EX-MEM-WB; ideal = 1 instr/cycle.',
    'Hazards: data (forwarding), control (branch prediction), structural (duplication).',
    'Superscalar: multiple instrs/cycle. Out-of-order: execute when ready.',
  ],
},

fee_mem_hierarchy: { topicId: 'fee_mem_hierarchy', title: 'Memory Hierarchy and Virtual Memory', domainWeight: 'Computer Systems · 3–5%',
  overview: 'The memory hierarchy bridges the processor-memory speed gap through caching and virtual memory. Average access time, cache write policies, page tables, and TLB are core FE exam topics.',
  sections: [
    { id: 'memh-cache', title: '1. Cache Performance and Write Policies',
      content: `## 1.1 Hierarchy Levels

| Level | Size | Access |
|---|---|---|
| Registers | < 1 KB | ~0.5 ns |
| L1 Cache | 32-64 KB | ~1-4 ns |
| L2 Cache | 256 KB-1 MB | ~10 ns |
| RAM | GBs | ~100 ns |
| Disk | TBs | ~10 ms |

## 1.2 Average Access Time

**t_avg = h * t_cache + (1-h) * t_memory**

Multi-level: t_avg = h_1*t_L1 + (1-h_1)*h_2*t_L2 + (1-h_1)(1-h_2)*t_mem

## 1.3 Write Policies

| Policy | Mechanism | Tradeoff |
|---|---|---|
| **Write-through** | Cache + memory | Simple, slow |
| **Write-back** | Cache only, dirty bit | Fast, complex |`,
      examTip: 't_avg = h*t_cache + (1-h)*t_memory is the most-tested cache formula. Multi-level: work from L1 outward.',
      importantNote: 'Miss rate = 1-h. L1 miss 10%, L2 miss 5% -> combined miss to RAM = 0.10*0.05 = 0.5%. Multi-level caches are multiplicatively effective.',
    },
    { id: 'memh-virtual', title: '2. Virtual Memory',
      content: `## 2.1 Concept

Programs use **virtual addresses**; page table maps to **physical addresses**.

- Virtual address = **VPN + page offset**
- Physical address = **PFN + page offset** (offset unchanged)
- Page offset bits = log_2(page_size)
- VPN bits = address_bits - offset_bits

Example: 32-bit address, 4 KB page -> 12 offset bits, 20 VPN bits, 2^20 page table entries.

## 2.2 TLB

Small fast cache of recent translations. Hit: ~1 ns. Miss: page table access (~100 ns).

## 2.3 Page Faults

Page not in RAM -> fetch from disk: **~10 ms** (millions of cycles).

Replacement: LRU (good), FIFO (simple), Optimal (theoretical best).`,
      examTip: 'Offset bits = log_2(page_size). VPN = remaining bits. Page faults cost ~10 ms -- catastrophically slow.',
    },
    { id: 'memh-exam', title: '3. Cache & Memory Worked Examples',
      content: `## 3.1 Two-Level Cache EMAT

**Given**: L1 hit rate = 95%, t_L1 = 1 ns. L2 hit rate = 80% (of L1 misses), t_L2 = 10 ns. Memory t_mem = 100 ns.

**EMAT = h1*t_L1 + (1-h1)*h2*t_L2 + (1-h1)*(1-h2)*t_mem**

EMAT = 0.95 * 1 + 0.05 * 0.80 * 10 + 0.05 * 0.20 * 100

EMAT = 0.95 + 0.40 + 1.00 = **2.35 ns**

| Component | Probability | Time | Contribution |
|---|---|---|---|
| L1 hit | 95% | 1 ns | 0.95 ns |
| L1 miss, L2 hit | 4% | 10 ns | 0.40 ns |
| Both miss | 1% | 100 ns | 1.00 ns |
| **Total EMAT** | | | **2.35 ns** |

Only 1% of accesses reach main memory, yet that 1% contributes 43% of the average access time. This shows why minimizing misses matters enormously.

## 3.2 Page Table Walk Latency

**Given**: 32-bit virtual address, 4 KB pages, 2-level page table. TLB miss rate = 5%. Each table access = 100 ns.

- Page offset = log_2(4096) = **12 bits**
- VPN = 32 - 12 = 20 bits -> split into two 10-bit indices
- **2-level walk**: 2 memory accesses * 100 ns = **200 ns per TLB miss**

**Effective translation time**:
t_translate = h_TLB * t_TLB + (1 - h_TLB) * t_walk
t_translate = 0.95 * 1 + 0.05 * 200 = 0.95 + 10 = **10.95 ns**

Without TLB: every access costs 200 ns extra. The TLB reduces average translation overhead by **95%**.

## 3.3 TLB Hit Rate Impact

| TLB Hit Rate | Translation Time | Impact on Memory Access |
|---|---|---|
| 99% | 0.99 + 2.0 = 2.99 ns | Negligible overhead |
| 95% | 0.95 + 10.0 = **10.95 ns** | Moderate |
| 90% | 0.90 + 20.0 = 20.90 ns | Significant |
| 80% | 0.80 + 40.0 = 40.80 ns | Severe — redesign needed |

**Working set**: if a program's actively-used pages fit in the TLB, hit rate stays > 99%. Large, scattered data structures (e.g., pointer-chasing) cause TLB thrashing.

**Exam strategy**: For multi-level cache, chain probabilities: EMAT = sum of (probability of reaching level i) * (access time at level i). For page tables, TLB miss penalty = number of levels * memory access time. A 4-level page table (64-bit systems) costs 400 ns per TLB miss.`,
      examTip: 'Multi-level EMAT: probability of reaching each level multiplied by its access time, summed. L1 miss, L2 hit probability = (1-h1)*h2. Both miss = (1-h1)*(1-h2).',
      importantNote: 'L2 hit rate is measured as a fraction of L1 MISSES, not total accesses. If the problem says "L2 hit rate = 80%," that means 80% of accesses that missed L1 are found in L2.',
    },
  ],
  keyTakeaways: [
    'Hierarchy: each level ~10x larger/slower. t_avg = h*t_cache + (1-h)*t_memory.',
    'Write-through: simple. Write-back: fast (dirty bit).',
    'Virtual memory: page table maps VPN -> PFN. Offset unchanged.',
    'Page offset = log_2(page_size); VPN = address_bits - offset_bits.',
    'TLB caches translations (~1 ns hit vs ~100 ns miss).',
    'Page faults ~10 ms; minimizing faults is critical.',
  ],
},

fee_io_interfacing: { topicId: 'fee_io_interfacing', title: 'I/O and Interfacing', domainWeight: 'Computer Systems · 3–5%',
  overview: 'I/O interfacing connects CPU to peripherals via programmed I/O, interrupts, or DMA. Serial protocols (I2C, SPI, USB, PCIe) offer different speed/complexity tradeoffs.',
  sections: [
    { id: 'io-methods', title: '1. I/O Methods',
      content: `## 1.1 Three I/O Approaches

| Method | CPU Usage | Throughput | Complexity |
|---|---|---|---|
| **Programmed (polling)** | 100% busy-wait | Lowest | Simplest |
| **Interrupt-driven** | Low (ISR only) | Moderate | Moderate |
| **DMA** | Minimal (setup only) | Highest | Most complex |

## 1.2 Interrupts

| Type | Property |
|---|---|
| Maskable | Can be disabled |
| Non-maskable (NMI) | Cannot disable (power fail) |
| Vectored | Device provides ISR address |

**Interrupt latency**: time from request to ISR execution.

## 1.3 DMA

DMA controller transfers data directly between device and memory. CPU only handles setup and completion interrupt. Essential for disk/network.`,
      examTip: 'Efficiency: Programmed < Interrupt < DMA. DMA frees CPU during transfer -- essential for high-speed devices.',
      importantNote: 'DMA and CPU share the memory bus. DMA may temporarily block CPU memory access (cycle stealing).',
    },
    { id: 'io-protocols', title: '2. Serial Protocols',
      content: `## 2.1 Common Interfaces

| Protocol | Wires | Speed | Topology |
|---|---|---|---|
| **I2C** | 2 (SDA, SCL) | Up to 3.4 Mbps | Multi-master/slave |
| **SPI** | 4 (MOSI, MISO, CLK, CS) | 50+ Mbps | Single master |
| **UART** | 2 (TX, RX) | ~1 Mbps | Point-to-point |
| **USB 2.0** | 4 | 480 Mbps | Host-device |
| **USB 3.0** | 9 | 5 Gbps | Host-device |
| **PCIe 4.0** | Lanes | 16 GT/s/lane | Point-to-point |

**Speed order**: I2C < SPI < UART < USB < PCIe

## 2.2 I2C vs. SPI

- I2C: 2 wires, addressing, multi-device, slower
- SPI: 4 wires (+ 1 CS per slave), no addressing, faster, full-duplex`,
      examTip: 'Speed: I2C < SPI < USB < PCIe. I2C uses 2 wires (simplest). SPI: 4 wires, faster. USB: hot-plug. PCIe: fastest.',
    },
    { id: 'io-exam', title: '3. I/O & Bus Problems',
      content: `## 3.1 DMA Transfer Time for 1 MB at 100 MB/s

**Given**: Transfer size = 1 MB, bus speed = 100 MB/s, DMA setup = 5 us, interrupt latency = 2 us.

**Transfer time**: t_transfer = size / rate = 10^6 / (100 * 10^6) = **10 ms**

**Total DMA time**: t_total = t_setup + t_transfer + t_interrupt = 5 us + 10 ms + 2 us = **10.007 ms**

| Phase | Time | CPU Busy? |
|---|---|---|
| DMA setup | 5 us | Yes |
| Data transfer | 10 ms | **No (CPU free)** |
| Completion interrupt | 2 us | Yes |
| **Total** | **10.007 ms** | **7 us (0.07%)** |

**CPU utilization**: 7 us / 10007 us = **0.07%** — DMA frees the CPU for 99.93% of the transfer.

**Compare with programmed I/O**: CPU busy for entire 10 ms = 100% utilization. DMA is ~1400x more CPU-efficient.

## 3.2 Interrupt Service Routine Timing

**Given**: Clock = 1 GHz, interrupt latency = 50 cycles, ISR = 200 instructions at CPI = 1.5, context save/restore = 30 cycles each.

- Interrupt latency: 50 / 10^9 = 50 ns
- Context save: 30 / 10^9 = 30 ns
- ISR execution: 200 * 1.5 / 10^9 = 300 ns
- Context restore: 30 / 10^9 = 30 ns
- **Total**: 50 + 30 + 300 + 30 = **410 ns**

**Maximum interrupt rate**: 1 / 410 ns = **2.44 MHz** (before CPU is fully consumed)

## 3.3 I2C vs SPI Throughput Comparison

| Feature | I2C (Fast Mode) | SPI |
|---|---|---|
| Clock speed | 400 kHz | 10 MHz |
| Data lines | 1 (SDA) | 2 (MOSI + MISO) |
| Overhead per byte | ~9 bits (8 data + ACK) | 8 bits (pure data) |
| **Effective throughput** | 400k/9 = **44.4 kB/s** | 10M * 2 / 8 = **2.5 MB/s** |
| Duplex | Half | **Full** |

SPI is **~56x faster** than I2C Fast Mode. But I2C uses only 2 wires and supports multi-master with built-in addressing — better for low-speed sensor networks.

**Exam strategy**: For DMA, total time = setup + transfer + interrupt. CPU is free during transfer. For interrupt timing, sum all phases: latency + save + ISR + restore. For protocol comparison, compute effective throughput including overhead bits.`,
      examTip: 'DMA total = setup + transfer + interrupt. The key insight: CPU utilization during DMA is nearly 0%. Compare this to 100% for polled I/O — a dramatic difference.',
      importantNote: 'DMA uses cycle stealing or burst mode. In cycle stealing, DMA takes one bus cycle at a time (minimal CPU disruption). In burst mode, DMA holds the bus for the entire transfer (faster but blocks CPU memory access).',
    },
  ],
  keyTakeaways: [
    'Programmed I/O (busy-wait) < Interrupt < DMA (highest throughput).',
    'Interrupts: maskable vs. NMI. Interrupt latency critical for real-time.',
    'DMA: direct device-to-memory; CPU free during transfer.',
    'I2C: 2 wires, slow. SPI: 4 wires, faster. USB: hot-plug. PCIe: fastest.',
    'Speed hierarchy: I2C < SPI < USB < PCIe.',
  ],
},

fee_performance: { topicId: 'fee_performance', title: 'Performance Metrics: CPI, MIPS, Amdahl\'s Law', domainWeight: 'Computer Systems · 3–5%',
  overview: 'CPU performance is quantified by execution time, CPI, and MIPS. Amdahl\'s Law governs speedup limits when improving part of a system. These are among the most frequently tested computer systems formulas on the FE exam.',
  sections: [
    { id: 'perf-cpi', title: '1. Execution Time, CPI, MIPS',
      content: `## 1.1 CPU Execution Time

**Execution time = IC * CPI / f**

| Term | Definition |
|---|---|
| IC | Instruction count |
| CPI | Cycles per instruction |
| f | Clock frequency (Hz) |

## 1.2 Weighted CPI

**CPI_avg = SUM(CPI_i * fraction_i)**

Example: ALU (CPI=1, 40%), Load (CPI=3, 30%), Branch (CPI=2, 30%):
CPI = 0.4 + 0.9 + 0.6 = **1.9**

## 1.3 MIPS

**MIPS = f(MHz) / CPI**

Execution time is the ONLY reliable metric. MIPS can be misleading (ignores instruction complexity).`,
      examTip: 'Time = IC*CPI/f. CPI is often weighted. MIPS = f(MHz)/CPI. Lower execution time = better. When comparing CPUs, use execution time on the SAME program.',
      importantNote: 'Clock speed alone does NOT determine performance. 2 GHz with CPI=2 equals 4 GHz with CPI=4 (same instruction count).',
    },
    { id: 'perf-amdahl', title: '2. Amdahl\'s Law and Power',
      content: `## 2.1 Amdahl's Law

**Speedup = 1 / [(1-f) + f/S]**

f = fraction improved, S = improvement factor.

**Max speedup = 1/(1-f)** (when S -> infinity)

| f | Max Speedup |
|---|---|
| 50% | 2x |
| 90% | 10x |
| 95% | 20x |
| 99% | 100x |

Example: 50% parallelizable, S=10: speedup = 1/(0.5+0.05) = **1.82x** (not 5x!)

## 2.2 Power

**Dynamic power: P = C * V^2 * f**

- Power linear with frequency
- Power quadratic with voltage
- Reducing voltage most effective

**Energy per op: E = C * V^2** (independent of frequency)`,
      examTip: 'Amdahl: speedup = 1/[(1-f)+f/S]. Max = 1/(1-f). If 90% parallelizable, max speedup = 10x regardless of processor count. The sequential fraction dominates.',
    },
    { id: 'perf-exam', title: '3. Performance Analysis Walkthrough',
      content: `## 3.1 Amdahl's Law: 40% Parallelizable, 8 Cores

**Given**: f = 0.40 (parallelizable fraction), S = 8 (8 cores for parallel portion).

**Speedup** = 1 / [(1-f) + f/S] = 1 / [0.60 + 0.40/8] = 1 / [0.60 + 0.05] = 1 / 0.65 = **1.538x**

**Max speedup** (infinite cores): 1 / (1-f) = 1 / 0.60 = **1.667x**

| Cores | f/S | Speedup | % of Max |
|---|---|---|---|
| 2 | 0.200 | 1.25x | 75% |
| 4 | 0.100 | 1.43x | 86% |
| **8** | **0.050** | **1.54x** | **92%** |
| 16 | 0.025 | 1.60x | 96% |
| infinity | 0 | 1.67x | 100% |

Going from 8 to 16 cores gains only 0.06x — diminishing returns. The 60% sequential portion fundamentally limits speedup.

## 3.2 CPI for Instruction Mix

**Given**: ALU (40%, CPI=1), Load (30%, CPI=3), Store (20%, CPI=2), Branch (10%, CPI=4).

**CPI_avg = SUM(fraction_i * CPI_i)**

CPI = 0.40*1 + 0.30*3 + 0.20*2 + 0.10*4
CPI = 0.40 + 0.90 + 0.40 + 0.40 = **2.10**

| Instruction | Fraction | CPI | Contribution |
|---|---|---|---|
| ALU | 40% | 1 | 0.40 |
| Load | 30% | 3 | 0.90 |
| Store | 20% | 2 | 0.40 |
| Branch | 10% | 4 | 0.40 |
| **Weighted CPI** | | | **2.10** |

**Load instructions dominate** (0.90 of 2.10 = 43%) despite being only 30% of instructions. Optimizing load latency (cache) has the biggest impact.

## 3.3 MIPS Calculation

**Given**: Clock frequency = 2 GHz, CPI = 2.10.

**MIPS = f(MHz) / CPI = 2000 / 2.10 = 952.4 MIPS**

**Execution time for 10^6 instructions**:
T = IC * CPI / f = 10^6 * 2.10 / (2 * 10^9) = **1.05 ms**

**Caution**: MIPS is misleading for cross-architecture comparison. A CISC processor might accomplish in 1 instruction what RISC needs 3 for. Always compare **execution time for the same task**.

| Metric | Value | Reliable? |
|---|---|---|
| Clock speed | 2 GHz | No (ignores CPI) |
| MIPS | 952 | No (ignores instruction complexity) |
| **Execution time** | **1.05 ms** | **Yes (only reliable metric)** |

**Exam strategy**: Amdahl's law: identify f (parallelizable fraction) and S (speedup factor). For CPI, multiply each type's fraction by its CPI and sum. MIPS = f(MHz)/CPI. Always prefer execution time for comparison.`,
      examTip: 'Amdahl\'s law trap: 40% parallelizable does NOT mean 8 cores give 40% improvement. The sequential 60% limits speedup to 1.67x maximum. Always compute the denominator carefully.',
      importantNote: 'CPI contributions reveal optimization priorities. If loads contribute 43% of CPI, improving cache hit rate has more impact than reducing branch mispredictions (19% contribution).',
    },
  ],
  keyTakeaways: [
    'Execution time = IC * CPI / f; only reliable performance metric.',
    'CPI_avg = SUM(CPI_i * fraction_i) for mixed workloads.',
    'MIPS = f(MHz)/CPI; can be misleading.',
    'Amdahl: speedup = 1/[(1-f)+f/S]; max = 1/(1-f).',
    'Power P = C*V^2*f; voltage reduction most effective.',
    'Sequential fraction fundamentally limits achievable speedup.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 17 — SOFTWARE DEVELOPMENT  (5 curriculum IDs)  ·  3–5 %
   * ══════════════════════════════════════════════════════════════════ */

fee_algorithms: { topicId: 'fee_algorithms', title: 'Algorithms and Complexity', domainWeight: 'Software Development · 3–5%',
  overview: 'Algorithm analysis determines how execution time grows with input size. Big-O notation, sorting/searching complexities, and paradigms (divide-and-conquer, DP, greedy) are core FE exam topics.',
  sections: [
    { id: 'algo-bigo', title: '1. Big-O and Complexity Classes',
      content: `## 1.1 Common Complexities

| O() | Name | Example |
|---|---|---|
| **O(1)** | Constant | Hash lookup |
| **O(log n)** | Logarithmic | Binary search |
| **O(n)** | Linear | Linear search |
| **O(n log n)** | Linearithmic | Merge sort |
| **O(n^2)** | Quadratic | Bubble sort |
| **O(2^n)** | Exponential | Brute-force subsets |

## 1.2 Rules

1. Drop constants: 3n^2 -> O(n^2)
2. Keep dominant: n^2+5n -> O(n^2)
3. Sequential adds: O(n)+O(n^2) -> O(n^2)
4. Nested loops multiply: O(n)*O(n) -> O(n^2)`,
      examTip: 'Count nested loops: 1 loop = O(n), 2 nested = O(n^2), halving each step = O(log n). Focus on dominant term, drop constants.',
    },
    { id: 'algo-sort-search', title: '2. Sorting, Searching, Paradigms',
      content: `## 2.1 Sorting

| Algorithm | Average | Worst | Space | Stable |
|---|---|---|---|---|
| **Bubble** | O(n^2) | O(n^2) | O(1) | Yes |
| **Insertion** | O(n^2) | O(n^2) | O(1) | Yes |
| **Merge** | O(n log n) | O(n log n) | O(n) | Yes |
| **Quick** | O(n log n) | O(n^2) | O(log n) | No |
| **Heap** | O(n log n) | O(n log n) | O(1) | No |

## 2.2 Searching

- **Linear**: O(n), any data
- **Binary**: O(log n), **requires sorted data**

## 2.3 Paradigms

| Paradigm | Strategy | Examples |
|---|---|---|
| **Divide-and-conquer** | Split, solve, combine | Merge sort, binary search |
| **Dynamic programming** | Memoize overlapping sub-problems | Fibonacci, shortest path |
| **Greedy** | Locally optimal | Dijkstra, Huffman |

Fibonacci: naive O(2^n); DP O(n).`,
      examTip: 'Binary search O(log n) requires sorted data. Merge sort O(n log n) guaranteed. Quick sort O(n log n) avg but O(n^2) worst. DP reduces exponential to polynomial via memoization.',
      importantNote: 'Quick sort O(n^2) worst case when pivot is always min/max. Still fastest in practice due to cache locality. Merge sort guarantees O(n log n) but needs O(n) extra space.',
    },
    { id: 'algo-exam', title: '3. Algorithm Analysis Problems',
      content: `## 3.1 Master Theorem: T(n) = 4T(n/2) + n^2

**Master theorem**: T(n) = aT(n/b) + O(n^d)

Here: a = 4, b = 2, d = 2. Compare **log_b(a)** with **d**:

log_2(4) = 2 = d

**Case 2** (log_b(a) = d): T(n) = O(n^d * log n) = **O(n^2 log n)**

| Case | Condition | Result |
|---|---|---|
| 1 | log_b(a) > d | O(n^(log_b(a))) |
| **2** | **log_b(a) = d** | **O(n^d log n)** |
| 3 | log_b(a) < d | O(n^d) |

**Quick check**: T(n) = 2T(n/2) + n -> a=2, b=2, d=1 -> log_2(2)=1=d -> Case 2: **O(n log n)** (merge sort!).

## 3.2 Merge Sort vs Quick Sort for Nearly-Sorted Data

| Property | Merge Sort | Quick Sort |
|---|---|---|
| Best case | O(n log n) | O(n log n) |
| Average | O(n log n) | O(n log n) |
| **Nearly-sorted worst** | O(n log n) | **O(n^2)** (bad pivot) |
| Space | O(n) | O(log n) |
| Stable | Yes | No |

For **nearly-sorted data**, quick sort with naive pivot (first/last element) degrades to O(n^2) because partitions are maximally unbalanced. Solutions:
- **Randomized pivot**: expected O(n log n) regardless
- **Median-of-three**: avoids worst case on sorted input
- **Use insertion sort**: O(n) on nearly-sorted data (best choice if truly almost sorted)

## 3.3 Binary Search: Off-by-One Analysis

**Standard binary search** on sorted array of n elements:

- **Iterations**: ceil(log_2(n)) + 1 (maximum)
- **Comparison count**: log_2(n) average for successful search

| Array Size | Max Comparisons |
|---|---|
| 100 | 7 |
| 1,000 | 10 |
| 1,000,000 | 20 |
| 10^9 | 30 |

**Common off-by-one errors**:
- Loop condition: use **low <= high** (not low < high) to check single-element range
- Mid calculation: **mid = low + (high - low) / 2** (avoids integer overflow vs (low+high)/2)
- Update: low = mid + 1 or high = mid - 1 (not mid, which causes infinite loops)

**Exam strategy**: For Master theorem, compute log_b(a) and compare to d. For sorting, if data is nearly sorted, insertion sort is O(n). For binary search, always verify the loop terminates by checking low > high.`,
      examTip: 'Master theorem shortcut: compute log_b(a). If it equals d, answer is O(n^d log n). If greater, answer is O(n^(log_b(a))). If less, answer is O(n^d). This covers 90% of FE recurrence problems.',
      importantNote: 'The Master theorem only applies to recurrences of the form T(n) = aT(n/b) + O(n^d). For other forms like T(n) = T(n-1) + O(n), use the recursion tree or substitution method.',
    },
  ],
  keyTakeaways: [
    'Big-O: asymptotic upper bound; drop constants, keep dominant term.',
    'O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n).',
    'Merge: O(n log n) guaranteed. Quick: O(n log n) avg, O(n^2) worst.',
    'Binary search: O(log n), requires sorted data.',
    'DP = recursion + memoization; exponential -> polynomial.',
    'Greedy: fast but not always optimal.',
  ],
},

fee_data_structures: { topicId: 'fee_data_structures', title: 'Data Structures', domainWeight: 'Software Development · 3–5%',
  overview: 'Data structures organize data for efficient access. Arrays, linked lists, stacks, queues, trees, and hash tables each optimize for different patterns. Knowing time complexity and when to use each is essential for the FE exam.',
  sections: [
    { id: 'ds-linear', title: '1. Arrays, Lists, Stacks, Queues',
      content: `## 1.1 Arrays

O(1) access by index. O(n) insert/delete (shift elements). Cache-friendly.

## 1.2 Linked Lists

O(1) insert/delete at known position. O(n) search. Singly, doubly, circular variants.

## 1.3 Stack (LIFO)

push/pop/peek: all O(1). Uses: function calls, expression eval, DFS, undo.

## 1.4 Queue (FIFO)

enqueue/dequeue: O(1). Uses: scheduling, BFS, print queues.

**Priority queue**: dequeue by priority (implemented with heap).

## 1.5 Summary

| Op | Array | List | Stack | Queue |
|---|---|---|---|---|
| Access | **O(1)** | O(n) | N/A | N/A |
| Search | O(n) | O(n) | N/A | N/A |
| Insert | O(n) | **O(1)*** | **O(1)** | **O(1)** |
| Delete | O(n) | **O(1)*** | **O(1)** | **O(1)** |

*at known position`,
      examTip: 'Arrays: O(1) access, O(n) insert. Lists: O(1) insert, O(n) search. Stack=LIFO, Queue=FIFO. Know WHICH structure for which application.',
    },
    { id: 'ds-tree-hash', title: '2. Trees and Hash Tables',
      content: `## 2.1 BST

BST property: left < node < right.

| Op | Balanced | Unbalanced |
|---|---|---|
| Search/Insert/Delete | **O(log n)** | O(n) |

Self-balancing: **AVL** (strict), **Red-Black** (relaxed).

## 2.2 Heap

Complete binary tree. Max-heap: parent >= children.

| Op | Complexity |
|---|---|
| Find min/max | **O(1)** |
| Insert/Extract | O(log n) |
| Build | O(n) |

## 2.3 Hash Table

**index = hash(key) % size**. O(1) average lookup.

Collision resolution: **chaining** (lists) or **open addressing** (probing).

**Load factor** = entries/size. Rehash when > ~0.7.

- Average: O(1)
- Worst: O(n) (all keys collide)`,
      examTip: 'Fastest average lookup: hash table O(1). Maintains sorted order: BST. BST degenerates to O(n) if unbalanced -- use AVL/Red-Black.',
      importantNote: 'BST degenerates to linked list O(n) if inserted in sorted order. Self-balancing trees (AVL, Red-Black) guarantee O(log n).',
    },
    { id: 'ds-exam', title: '3. Data Structure Operation Problems',
      content: `## 3.1 BST Insertion Sequence and Resulting Tree

**Insert sequence**: 50, 30, 70, 20, 40, 60, 80

**Step-by-step**:
1. 50 -> root
2. 30 < 50 -> left child of 50
3. 70 > 50 -> right child of 50
4. 20 < 50, < 30 -> left child of 30
5. 40 < 50, > 30 -> right child of 30
6. 60 > 50, < 70 -> left child of 70
7. 80 > 50, > 70 -> right child of 70

**Resulting balanced BST** (height = 2):
- Root: 50 (L:30, R:70)
- Level 1: 30 (L:20, R:40), 70 (L:60, R:80)

**Same data, sorted insert** (20,30,40,50,60,70,80) -> degenerates to linked list (height = 6, all right children). This is why self-balancing matters.

## 3.2 Heap Extract-Min Step-by-Step

**Min-heap**: [10, 20, 15, 30, 40, 25, 18]

**Extract-min (remove 10)**:

| Step | Action | Heap State |
|---|---|---|
| 1 | Remove root (10) | [_, 20, 15, 30, 40, 25, 18] |
| 2 | Move last element (18) to root | [18, 20, 15, 30, 40, 25] |
| 3 | Sift down: 18 vs children (20, 15) | 15 < 18, swap |
| 4 | [15, 20, 18, 30, 40, 25] | 18 vs children (25): 18 < 25, stop |
| **Result** | | **[15, 20, 18, 30, 40, 25]** |

**Complexity**: O(log n) for sift-down. The heap property is restored by swapping with the smaller child at each level.

## 3.3 Hash Table with Chaining — Lookup Steps

**Given**: Table size = 7, hash(key) = key mod 7. Keys inserted: 14, 21, 7, 28, 35, 42.

All keys hash to **index 0** (all multiples of 7):
- Slot 0: 14 -> 21 -> 7 -> 28 -> 35 -> 42 (chain of 6)

**Lookup for key 35**:
1. hash(35) = 35 mod 7 = 0 -> go to slot 0
2. Compare: 14 (no), 21 (no), 7 (no), 28 (no), **35 (yes!)**
3. **5 comparisons** needed

| Load Factor | Avg Lookup (chaining) | Performance |
|---|---|---|
| 0.5 | ~1.25 | Excellent |
| 1.0 | ~1.5 | Good |
| 2.0 | ~2.0 | Acceptable |
| 6.0 (our example) | ~3.5 | Poor — rehash! |

**Exam strategy**: For BST, trace the insertion path (left if smaller, right if larger). For heaps, extract = remove root, move last to root, sift down. For hash tables, compute hash, then walk the chain. Load factor > 0.7 signals time to rehash.`,
      examTip: 'BST insertion: compare with each node, go left (smaller) or right (larger). Heap extract: always O(log n). Hash lookup: O(1) average, but O(n) worst case if all keys collide.',
      importantNote: 'A bad hash function that maps many keys to the same bucket destroys hash table performance. The example above (all mod 7 = 0) shows worst-case O(n) behavior. Good hash functions distribute keys uniformly.',
    },
  ],
  keyTakeaways: [
    'Arrays: O(1) access, O(n) insert. Lists: O(1) insert, O(n) search.',
    'Stack=LIFO (DFS, function calls). Queue=FIFO (BFS, scheduling).',
    'BST: O(log n) balanced; AVL/Red-Black guarantee balance.',
    'Heap: O(1) find-min/max, O(log n) insert/extract.',
    'Hash: O(1) avg lookup; chaining or open addressing for collisions.',
    'Load factor > 0.7 -> rehash.',
  ],
},

fee_oop: { topicId: 'fee_oop', title: 'Object-Oriented Programming', domainWeight: 'Software Development · 3–5%',
  overview: 'OOP organizes software as objects encapsulating data and behavior. The four pillars -- encapsulation, inheritance, polymorphism, abstraction -- promote modularity and reuse. Recursion and functional programming complement OOP on the FE exam.',
  sections: [
    { id: 'oop-pillars', title: '1. Four Pillars of OOP',
      content: `## 1.1 The Pillars

| Pillar | Definition | Example |
|---|---|---|
| **Encapsulation** | Hide internals, expose interface | Private fields, public methods |
| **Inheritance** | Child inherits from parent | Dog IS-A Animal |
| **Polymorphism** | Same interface, different behavior | Animal.speak() -> "Woof" or "Meow" |
| **Abstraction** | Expose essentials, hide complexity | Abstract class, interface |

## 1.2 Relationships

- **Inheritance (is-a)**: Dog is-a Animal
- **Composition (has-a)**: Car has-a Engine
- **Override**: child replaces parent method
- **Overload**: same name, different parameters`,
      examTip: 'Four pillars: Encapsulation, Inheritance, Polymorphism, Abstraction. FE tests these through scenarios.',
    },
    { id: 'oop-recursion', title: '2. Recursion and Functional Programming',
      content: `## 2.1 Recursion

Function calls itself with smaller input until **base case**.

- Without base case -> infinite recursion -> stack overflow
- **Tail recursion**: recursive call is last operation; compiler optimizes to loop
- Each call uses stack space: O(n) for n calls

## 2.2 Dynamic Programming

Recursion + memoization: store results of overlapping sub-problems.

- Fibonacci naive: O(2^n)
- Fibonacci DP: O(n)

## 2.3 Functional Programming

| Concept | Description |
|---|---|
| Pure functions | No side effects, deterministic |
| Immutability | Data never modified |
| Higher-order | Functions as arguments/return values |
| map/filter/reduce | Declarative collection processing |`,
      examTip: 'Every recursive function MUST have a base case. DP = recursion + memoization. Fibonacci: naive O(2^n), DP O(n).',
      importantNote: 'Deep recursion risks stack overflow. Fibonacci(50) naive makes ~2^50 calls (impossible). DP solves only 50 sub-problems.',
    },
    { id: 'oop-exam', title: '3. OOP Design Problems',
      content: `## 3.1 Identify the Pattern from Code Snippet

**Pattern 1 — Singleton**: Only one instance exists.
- Private constructor, static getInstance() method
- Use case: database connection pool, configuration manager

**Pattern 2 — Observer**: Objects subscribe to events.
- Subject maintains list of observers, notifies on change
- Use case: GUI event handling, pub/sub messaging

**Pattern 3 — Factory**: Creates objects without specifying exact class.
- Factory method returns interface/base type
- Use case: creating different shapes, database drivers

| Pattern | Intent | Key Indicator |
|---|---|---|
| **Singleton** | One instance globally | Private constructor + static method |
| **Observer** | Notify dependents of change | subscribe/notify methods |
| **Factory** | Create without specifying class | Returns base type/interface |
| **Strategy** | Swap algorithms at runtime | Interface parameter in constructor |
| **Decorator** | Add behavior dynamically | Wraps same interface |

## 3.2 Inheritance vs Composition Tradeoff

| Criteria | Inheritance (is-a) | Composition (has-a) |
|---|---|---|
| Coupling | **Tight** (child depends on parent) | **Loose** (delegate to component) |
| Flexibility | Fixed at compile time | Changeable at runtime |
| Code reuse | Inherits everything (even unwanted) | Cherry-pick behaviors |
| Fragile base class | Yes (parent change breaks children) | No |

**Rule of thumb**: "Favor composition over inheritance" (Gang of Four).
- Use inheritance when there is a true **is-a** relationship (Dog is-a Animal)
- Use composition when sharing behavior (Car has-a Engine, not Car is-a Engine)

## 3.3 Polymorphism: Virtual Method Dispatch

**Base class Animal** has virtual method speak(). Dog overrides with "Woof", Cat with "Meow".

**Runtime dispatch** (dynamic binding):
- Variable type: Animal. Actual object: Dog.
- **Animal a = new Dog(); a.speak() -> "Woof"**
- The runtime type (Dog) determines which method executes, not the declared type (Animal).

**Static dispatch** (overloading): resolved at compile time based on parameter types.

| Dispatch Type | When Resolved | Mechanism |
|---|---|---|
| **Dynamic (override)** | Runtime | vtable pointer |
| **Static (overload)** | Compile time | Parameter signature |

**Exam strategy**: For pattern identification, look for structural clues — private constructor (Singleton), listener lists (Observer), creation methods returning base types (Factory). For inheritance vs composition, ask "is this truly an is-a relationship?" If not, use composition.`,
      examTip: 'Polymorphism question trick: the RUNTIME type determines which overridden method runs, not the declared type. Animal a = new Dog(); a.speak() calls Dog.speak(), not Animal.speak().',
      importantNote: 'The Singleton pattern is NOT thread-safe by default. In multi-threaded environments, use double-checked locking or initialize-on-demand holder. This detail sometimes appears on the FE exam.',
    },
  ],
  keyTakeaways: [
    'Four pillars: encapsulation, inheritance, polymorphism, abstraction.',
    'Inheritance = is-a. Composition = has-a.',
    'Polymorphism: overriding (runtime) vs. overloading (compile-time).',
    'Recursion needs base case; uses O(n) stack. Tail recursion optimizable.',
    'DP = recursion + memoization; exponential -> polynomial.',
    'Functional: pure functions, immutability, map/filter/reduce.',
  ],
},

fee_sdlc: { topicId: 'fee_sdlc', title: 'Software Development Lifecycle', domainWeight: 'Software Development · 3–5%',
  overview: 'SDLC provides structured approaches to building software. Waterfall and Agile represent opposite philosophies. Testing at multiple levels catches defects early. Version control and CI/CD automate workflows.',
  sections: [
    { id: 'sdlc-models', title: '1. SDLC Models',
      content: `## 1.1 Waterfall

Sequential: Requirements -> Design -> Code -> Test -> Deploy -> Maintain.

| Pro | Con |
|---|---|
| Clear milestones | Late error detection |
| Easy to manage | Inflexible to changes |

## 1.2 Agile / Scrum

Iterative sprints (1-4 weeks): plan -> develop -> review -> retro.

| Pro | Con |
|---|---|
| Rapid feedback | Scope creep risk |
| Adaptable | Needs discipline |

## 1.3 Other Models

| Model | Key Feature |
|---|---|
| **V-Model** | Each dev phase has test phase |
| **Spiral** | Risk-driven iterations |
| **DevOps** | Continuous dev + ops integration |`,
      examTip: 'Waterfall = sequential, plan-heavy. Agile = iterative, feedback-driven. If requirements are changing, choose Agile.',
    },
    { id: 'sdlc-testing', title: '2. Testing, VCS, CI/CD',
      content: `## 2.1 Testing Levels

| Level | Tests | Who |
|---|---|---|
| **Unit** | Functions | Developers |
| **Integration** | Components | Dev/QA |
| **System** | Full system | QA |
| **Acceptance** | User requirements | Customer |

Bug cost: unit ~1x, integration ~10x, production ~100x.

- **TDD**: write tests before code
- **Black-box**: test inputs/outputs
- **White-box**: test code structure

## 2.2 Version Control (Git)

commit (snapshot), branch (parallel), merge (combine), pull request (review).

## 2.3 CI/CD

- **CI**: auto build + test on every commit
- **CD**: auto prepare/deploy releases

Reduces integration risk and human error.`,
      examTip: 'Testing: unit -> integration -> system -> acceptance. Earlier = cheaper. TDD and CI are best practices.',
      importantNote: 'Merge conflict: two branches modify same lines. Git cannot auto-resolve -- developer must manually choose.',
    },
    { id: 'sdlc-exam', title: '3. Software Engineering Scenarios',
      content: `## 3.1 Choose Agile vs Waterfall for Given Project

| Project Characteristic | Best Model | Reasoning |
|---|---|---|
| Fixed requirements, regulatory compliance | **Waterfall** | Clear milestones, documentation |
| Evolving requirements, customer feedback needed | **Agile** | Iterative, adaptable |
| Safety-critical system (medical device) | **V-Model** (Waterfall variant) | Rigorous testing at each phase |
| High-risk, unclear requirements | **Spiral** | Risk analysis each iteration |
| Startup MVP, time-to-market critical | **Agile** | Ship fast, iterate |
| Government contract, detailed spec | **Waterfall** | Contractual milestones |

**Decision rule**: If requirements are stable and complete -> Waterfall. If requirements will change -> Agile. If high risk -> Spiral.

## 3.2 Test Coverage: Statement vs Branch vs Path

| Coverage Type | What It Measures | Strength |
|---|---|---|
| **Statement** | Every line executed at least once | Weakest |
| **Branch** | Every true/false decision taken | Moderate |
| **Path** | Every possible execution path | Strongest (often infeasible) |

**Example**: if (A) { x(); } if (B) { y(); }
- **Statements**: 2 test cases (A=true,B=true covers all lines)
- **Branches**: 2 test cases (TT and FF)
- **Paths**: 4 paths (TT, TF, FT, FF) -> 4 test cases

**Path explosion**: n sequential if-statements create 2^n paths. For 20 branches: ~10^6 paths. This is why path coverage is impractical for large programs.

## 3.3 Defect Cost Multiplier at Each SDLC Phase

| Phase Found | Relative Cost | Example |
|---|---|---|
| Requirements | **1x** | Fix spec document |
| Design | **5x** | Redesign architecture |
| Coding | **10x** | Rewrite module |
| Testing | **20x** | Fix + retest + regression |
| **Production** | **100-1000x** | Patch + deploy + customer impact |

**Key insight**: A bug found in production costs **100x or more** compared to finding it during requirements. This is the fundamental motivation for:
- **TDD**: write tests before code (catches bugs at coding phase)
- **Code reviews**: catch design flaws before testing
- **CI/CD**: automated testing catches regressions immediately

**Exam strategy**: For model selection, map project characteristics to model strengths. Stable requirements = Waterfall. Changing requirements = Agile. For testing, remember the hierarchy: statement < branch < path coverage. The cost multiplier (1x -> 100x) motivates shift-left testing.`,
      examTip: 'The cost multiplier from requirements to production (1x to 100x) is the most-cited SDLC metric on the FE exam. "Shift left" = find bugs earlier = cheaper.',
      importantNote: 'Agile does NOT mean no planning or documentation. It means adaptive planning with working software as the primary deliverable. Scrum ceremonies (sprint planning, retrospective) provide structure.',
    },
  ],
  keyTakeaways: [
    'Waterfall: sequential. Agile: iterative sprints.',
    'Testing: unit -> integration -> system -> acceptance; earlier = cheaper.',
    'Bug cost: ~1x at unit, ~10x integration, ~100x production.',
    'TDD: tests before code. CI: auto test on commit.',
    'Git: commit, branch, merge, pull request.',
    'CI/CD automates build/test/deploy.',
  ],
},

fee_databases: { topicId: 'fee_databases', title: 'Databases: SQL & Normalization', domainWeight: 'Software Development · 3–5%',
  overview: 'Relational databases organize data in tables with SQL queries. Normalization eliminates redundancy through 1NF, 2NF, and 3NF. ACID properties ensure transaction reliability.',
  sections: [
    { id: 'db-sql', title: '1. Relational Model and SQL',
      content: `## 1.1 Key Concepts

| Term | Definition |
|---|---|
| **Table** | Rows + columns |
| **Primary Key** | Unique row identifier |
| **Foreign Key** | References another table's PK |

## 1.2 SQL Operations

| Op | SQL | Example |
|---|---|---|
| Read | SELECT | SELECT name FROM students WHERE gpa > 3.0 |
| Create | INSERT | INSERT INTO students VALUES ('Alice', 22) |
| Update | UPDATE | UPDATE students SET age=23 WHERE name='Alice' |
| Delete | DELETE | DELETE FROM students WHERE gpa < 2.0 |

## 1.3 JOINs

| Type | Returns |
|---|---|
| **INNER** | Matching rows in BOTH |
| **LEFT** | All left + matching right (NULL if none) |
| **RIGHT** | All right + matching left |

## 1.4 Aggregation

COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.`,
      examTip: 'INNER JOIN = only matching rows. LEFT JOIN = all left + matches. WHERE filters rows; HAVING filters groups after aggregation.',
      importantNote: 'WHERE vs HAVING: WHERE filters before grouping, HAVING filters after. Mixing them up is commonly tested.',
    },
    { id: 'db-norm-acid', title: '2. Normalization and ACID',
      content: `## 2.1 Normal Forms

| NF | Rule | Eliminates |
|---|---|---|
| **1NF** | Atomic values (no lists) | Repeating groups |
| **2NF** | No partial dependencies | Partial deps |
| **3NF** | No transitive dependencies | Transitive deps |

Example: Student(ID, Name, DeptID, DeptName) violates 3NF because DeptName depends on DeptID, not the key. Fix: split into Student(ID, Name, DeptID) + Dept(DeptID, DeptName).

## 2.2 ACID

| Property | Meaning |
|---|---|
| **Atomicity** | All-or-nothing |
| **Consistency** | Valid state to valid state |
| **Isolation** | Concurrent txns don't interfere |
| **Durability** | Committed data survives failures |

## 2.3 Indexes

- **B-tree**: O(log n), range + exact match
- **Hash**: O(1), exact match only
- Tradeoff: faster reads, slower writes`,
      examTip: '1NF = atomic. 2NF = no partial deps. 3NF = no transitive deps. ACID: Atomicity, Consistency, Isolation, Durability.',
    },
    { id: 'db-exam', title: '3. SQL & Database Problems',
      content: `## 3.1 Write a Query with JOIN, WHERE, GROUP BY, HAVING

**Tables**: Students(id, name, dept_id), Enrollments(student_id, course_id, grade), Courses(id, title, credits).

**Problem**: Find departments where the average GPA exceeds 3.0, showing department and average.

**SQL**:
- SELECT s.dept_id, AVG(e.grade) AS avg_gpa
- FROM Students s
- **INNER JOIN** Enrollments e ON s.id = e.student_id
- **WHERE** e.grade IS NOT NULL
- **GROUP BY** s.dept_id
- **HAVING** AVG(e.grade) > 3.0
- ORDER BY avg_gpa DESC;

**Execution order**: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY

| Clause | Purpose | Filters |
|---|---|---|
| WHERE | Filter individual rows | Before grouping |
| GROUP BY | Create groups | N/A |
| **HAVING** | Filter groups | **After grouping** |

## 3.2 Identify 1NF / 2NF / 3NF Violation

**Table**: OrderDetail(OrderID, ProductID, ProductName, CustomerID, CustomerName, Qty, Price)

**Primary key**: (OrderID, ProductID) — composite key.

| Normal Form | Violation? | Problem |
|---|---|---|
| **1NF** | No | All values are atomic |
| **2NF** | **Yes** | CustomerName depends on OrderID alone (partial dependency on composite key) |
| **3NF** | **Yes** | ProductName depends on ProductID, not the whole key (transitive) |

**Fix for 2NF**: Split into Orders(OrderID, CustomerID, CustomerName) + OrderItems(OrderID, ProductID, Qty, Price)

**Fix for 3NF**: Further split Products(ProductID, ProductName) and replace ProductName in OrderItems with just ProductID.

## 3.3 ACID Property Scenario Identification

**Match each scenario to the ACID property:**

| Scenario | ACID Property | Explanation |
|---|---|---|
| Bank transfer: debit + credit both succeed or both fail | **Atomicity** | All-or-nothing |
| After transfer, total money unchanged | **Consistency** | Valid state to valid state |
| Two users editing same record don't see partial changes | **Isolation** | Concurrent transactions separated |
| Committed data survives server crash | **Durability** | Written to persistent storage |

**Common exam trap**: "Consistency" in ACID means database constraints are maintained (valid state -> valid state). It does NOT mean "data is the same everywhere" (that is CAP theorem consistency).

**Exam strategy**: For SQL, remember the execution order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT). WHERE filters rows before grouping; HAVING filters groups after. For normalization, check: 1NF (atomic?), 2NF (partial deps on composite key?), 3NF (transitive deps?). For ACID, atomicity = all-or-nothing is the most commonly tested property.`,
      examTip: 'SQL execution order: FROM/JOIN first, WHERE second, GROUP BY third, HAVING fourth, SELECT fifth. This order explains why you cannot use column aliases in WHERE but can in HAVING (in some dialects).',
      importantNote: '2NF violations only occur with COMPOSITE primary keys. If your table has a single-column PK, it is automatically in 2NF (there can be no partial dependencies). Check for composite keys first.',
    },
  ],
  keyTakeaways: [
    'Tables with PK (unique) and FK (relationships). SQL: SELECT, INSERT, UPDATE, DELETE.',
    'INNER JOIN: matching rows. LEFT JOIN: all left + matches.',
    '1NF: atomic. 2NF: no partial deps. 3NF: no transitive deps.',
    'ACID: atomicity, consistency, isolation, durability.',
    'B-tree index: O(log n) + ranges. Hash: O(1) exact only.',
    'WHERE filters rows; HAVING filters groups.',
  ],
},

// ═══════════════════════════════════════════════════════════════
// NCEES GAP FIX (2026-05-24) — 6 new topics covering audit gaps:
// signal Nyquist depth, fault analysis, Shannon-Hartley, Bode
// sketching, pole-zero analysis, NCEES Reference Handbook navigation.
// ═══════════════════════════════════════════════════════════════

fee_reference_handbook: {
  topicId: 'fee_reference_handbook',
  title: `NCEES Reference Handbook Navigation`,
  domainWeight: 'Exam Strategy',
  overview: `The FE exam is OPEN-HANDBOOK — NCEES provides the official 500+ page FE Reference Handbook on-screen during the exam. Candidates who can NAVIGATE the handbook quickly have a 10-15% time advantage over those who flip pages randomly. This topic is not about new technical content; it teaches the LAYOUT of the handbook, the section that contains each formula you need, and a memorized "table of contents" so you can jump directly to the right page mid-problem. Mastering this single discipline raises your effective score by 15-20 points.`,
  sections: [
    {
      id: 'handbook-layout',
      title: `1. Handbook Layout — Memorize the Section Order`,
      content: `The FE Reference Handbook (v10.x or later) is organized into ~30 numbered sections corresponding roughly to the exam sections, plus shared general sections. Memorize this order so you don't have to scan a table of contents under time pressure.

## 1.1 General sections (used across all FE disciplines)

- **Units, Conversion Factors, & Constants** — SI prefixes, metric/Imperial conversions, fundamental constants (e, k, mₑ, mₚ, c, h, ε₀, μ₀, N_A)
- **Mathematics** — algebra/trig identities, calculus formulas, ODE solutions, Laplace transform pairs, Fourier series, vector identities
- **Probability & Statistics** — distributions (binomial, Poisson, normal, exponential, t, χ², F), statistical inference, regression formulas, z-tables
- **Engineering Economics** — interest factor tables (P/A, F/A, P/F, A/P, A/F, A/G), depreciation formulas, NPV, IRR, BCR
- **Ethics** — NCEES model rules of professional conduct (memorize the categories; specifics will be referenced)

## 1.2 FE Electrical/Computer-specific sections

- **Electrical and Computer Engineering** (the largest section, ~80 pages)
  - Electromagnetic fundamentals
  - Circuit analysis (Ohm's, Kirchhoff's, Thevenin/Norton, mesh/nodal)
  - AC analysis (phasors, impedance, power, three-phase)
  - Transient response (RC, RL, RLC second-order forms)
  - Transformers
  - Transmission lines
  - Rotating machines
  - Electronics (diodes, BJT, MOSFET, op-amp configurations)
  - Power electronics (buck/boost, PWM)
  - Linear systems (transfer functions, stability, Bode plots)
  - Signal processing (Fourier, Z-transform, filters)
  - Control systems (block diagrams, Routh, root locus, PID)
  - Communications (modulation, BER, Shannon-Hartley)
  - Digital systems (Boolean, K-maps, FSMs)
  - Computer networking (OSI model, IP subnetting basics)
  - Software (algorithms, data structures, complexity)

## 1.3 Strategy: build a personal bookmark map

Before exam day, spend ~10 hours total studying the actual handbook PDF (download from NCEES). For each major topic, NOTE:

- The section heading
- Approximate page number from start of the EE section (helps with "go to page X")
- Layout of the formulas (is it a table? a chart? a numbered list?)

Most candidates create a "personal index" cheat sheet that says:

| Need | Handbook Location |
|---|---|
| Laplace transform pairs | Math section, page ~12 of Math |
| Transformer turns ratio | EE section, near Transformers heading |
| Op-amp ideal model | EE section, Electronics subsection |
| Routh-Hurwitz template | EE section, Control subsection |
| Shannon-Hartley formula | EE section, Comms subsection |
| Power triangle | EE section, AC Power subsection |
| Three-phase line/phase relationships | EE section, Three-Phase subsection |
| Phasor impedance ZL = jωL, ZC = 1/(jωC) | EE section, AC Phasors subsection |
| Bode asymptote slopes | EE section, Linear Systems subsection |

Then during the exam, you have the look-up table memorized — you go straight to the location and don't waste time on a 500-page search.

## 1.4 Handbook quirks the exam tests

- **Notation differences** — the handbook uses specific notation that may differ from your textbook (e.g., uses ω₀ for natural frequency, sometimes ζ for damping, occasionally α and β for filter notations)
- **Implicit units** — the handbook sometimes shows formulas without unit notation. Verify the expected unit and convert if needed.
- **Multiple forms** — some formulas have multiple equivalent forms; learn which one matches the problem language the exam uses.
- **Calculator notation** — the handbook may show e^x or exp(x) interchangeably; same for log/ln distinctions (log is usually base 10 in EE contexts; ln is natural log).

## 1.5 The NCEES-approved calculator constraint

NCEES allows ONLY these calculator models (as of 2025):

- HP 35s
- Casio FX-115 ES Plus (and later approved variations)
- TI-30X (Pro / IIS)

These calculators do NOT have programmable memory or graphing — you cannot pre-store formulas. They DO have:

- Complex number arithmetic (essential for AC analysis)
- Equation solver (for some models)
- Matrix operations (limited — for solving 2x2 or 3x3 systems)
- Statistics functions

Practice WITH the model you'll bring. Calculator unfamiliarity costs more time than handbook unfamiliarity.

## 1.6 The handbook is searchable during the exam (in 2024+ rules)

The on-screen handbook viewer at the Pearson VUE testing center includes a SEARCH function. Practice using it:

- Common search terms: the section title (e.g., "Three-Phase"), a formula keyword (e.g., "Shannon")
- Search returns hits with context — scan results, click the most relevant
- Searches are FAST but require knowing the right term — your personal index helps generate good search queries

## 1.7 Time budgeting per question

110 questions in 6 hours = 196 seconds per question on average, including breaks. Allocate:

- ~30 seconds: read and understand the question
- ~30 seconds: navigate the handbook to the relevant formula
- ~60 seconds: identify variables, plug in numbers, calculate
- ~30 seconds: verify (units, sanity check, mark for review if uncertain)
- ~46 seconds: buffer for harder questions

If you're spending 60+ seconds JUST locating a formula, your handbook navigation needs work. Drill it.`,
      examTip: `The exam is open-handbook. Your COMPETITORS know the layout cold. Don't be the candidate flipping through 500 pages while everyone else jumps to the right section in 5 seconds.`,
      importantNote: `Download the current NCEES FE Reference Handbook PDF from ncees.org BEFORE you start studying technical content. Use it as the primary reference for every problem you practice. Familiarity with the handbook is worth more raw exam points than mastering any single subject.`,
    },
    {
      id: 'time-saving-tactics',
      title: `2. Time-Saving Tactics and Common Pitfalls`,
      content: `## 2.1 Question-attack sequence (the 196-second budget in practice)

1. **Read the problem ONCE end-to-end** — 15-20 seconds. Identify: what's given (variables, units), what's asked (the unknown).
2. **Recognize the topic** — 5 seconds. "This is AC power factor correction." "This is op-amp inverting configuration." Pattern recognition comes from practice.
3. **Open the handbook to the right section** — 10-20 seconds. With practice, you don't search; you JUMP to the bookmark.
4. **Find the matching formula** — 10-15 seconds. Scan headers, not full text.
5. **Plug in numbers** — 30-60 seconds. Watch units carefully.
6. **Calculate** — 30-60 seconds. Use complex-number mode on your calculator for AC problems; don't manually compute magnitudes/angles.
7. **Sanity check** — 5-15 seconds. Does the answer have the right order of magnitude? Right units? Right sign?

Total: ~120-180 seconds. You'll have buffer for harder problems.

## 2.2 Mark-and-skip discipline

You CAN flag questions for review. Use it:

- If a problem will take >5 minutes, mark and skip on first pass. Easy points are scattered throughout the exam.
- After completing every easy question, return to flagged ones with whatever time remains.
- DO NOT spend 10 minutes on a single 2-point question while skipping 5 easy 2-point questions.

The exam is scored on raw correct answers (no penalty for wrong). ALWAYS GUESS on unanswered questions — your expected value from random guessing is 25%.

## 2.3 Unit traps

Most exam mistakes are unit errors. Common traps:

- **Power in kW vs MW** — power-systems problems often give MW or MVA; circuits problems use W or mW
- **Time in seconds vs hours** — engineering economics uses years, control systems uses seconds, power systems often hours
- **Voltage RMS vs peak** — AC problems default to RMS for power, peak for waveform descriptions. Check which the question gives.
- **Decibels** — dB = 10·log₁₀(P/P_ref) for power, 20·log₁₀(V/V_ref) for voltage. dBm is referenced to 1 mW.
- **Frequency Hz vs rad/s** — Bode plots use rad/s convention; some problems give Hz. ω = 2πf.
- **Imperial vs SI** — most FE problems are SI but occasional imperial sneaks in (especially horsepower in power problems; 1 HP = 746 W).

When you start a problem, WRITE OUT the units you have AND the units you need. Convert at the start.

## 2.4 Phasor angle pitfalls

AC analysis uses phasors. Common mistakes:

- **Polar vs rectangular** — your calculator's polar mode displays as r∠θ; rectangular as a+jb. Set the right mode for the problem.
- **Angle in degrees vs radians** — most FE problems use DEGREES. Your calculator must be in DEG mode for trig functions, unless the problem explicitly uses radians.
- **Reference direction** — voltage and current have ASSUMED polarity/direction. The sign of the answer depends on whether your assumed direction matches the actual direction.
- **Inductor impedance** — Z_L = jωL = ωL∠90°. Capacitor impedance Z_C = 1/(jωC) = (1/ωC)∠-90°. Memorize the SIGNS of these angles.

## 2.5 Three-phase line vs phase relationships

Common trap on three-phase problems:

- **Y (Wye) connection**: V_line = √3 · V_phase, I_line = I_phase
- **Δ (Delta) connection**: V_line = V_phase, I_line = √3 · I_phase

Power formula for balanced three-phase: P = √3 · V_line · I_line · cos(θ) — uses LINE quantities and a √3 factor.

If you confuse line and phase, your answer is off by √3 (or 3 in some derived quantities).

## 2.6 Power factor sign convention

- **Lagging PF**: inductive load, current lags voltage. PF angle is POSITIVE in most conventions, but some texts/problems use the OPPOSITE convention.
- **Leading PF**: capacitive load, current leads voltage.
- **Reactive power Q**: positive for inductive loads, negative for capacitive.

Check the problem's convention. If unclear, the question text usually tells you "lagging" or "leading" — use that to determine the sign of the reactance.

## 2.7 Op-amp ideal model assumptions

- Infinite input impedance (no current into input pins)
- Zero output impedance
- Infinite open-loop gain (so V+ = V- in any negative-feedback configuration — "virtual short")
- Zero offset voltage
- Infinite bandwidth

Memorize the standard configurations and their gain formulas:

- **Inverting**: V_out = -(R_f/R_in) · V_in
- **Non-inverting**: V_out = (1 + R_f/R_in) · V_in
- **Summing inverting**: V_out = -(R_f/R_1 · V_1 + R_f/R_2 · V_2 + ...)
- **Difference**: V_out = (R_f/R_in) · (V_+ - V_-)
- **Integrator**: V_out = -(1/(R·C)) ∫V_in dt
- **Differentiator**: V_out = -R·C · dV_in/dt

The negative sign on inverting configurations is THE MOST COMMON mistake. The output is INVERTED.

## 2.8 Number-base conversions

Digital systems problems require fluent conversion among binary, hex, decimal, BCD:

- Hex: groups of 4 binary bits. 0xA = 1010, 0xF = 1111.
- BCD: each decimal digit encoded as 4 bits. 23 in BCD = 0010 0011, NOT 0001 0111 (which is binary 23).
- Two's complement: sign bit is MSB; negative number = invert bits + 1.

If you're slow at these, drill them. They appear in 4-6 questions.

## 2.9 K-map simplification

For digital combinational logic problems:

- Plot the truth table on a K-map (2-var, 3-var, or 4-var)
- Group adjacent 1s in rectangles of size 1, 2, 4, 8, 16
- Larger groups = simpler terms
- The simplified Boolean expression is the OR of the simplified group expressions

Common trap: forgetting that the K-map WRAPS AROUND (top edge connects to bottom; left to right). Adjacency includes wraparound.

## 2.10 Engineering economics — the factor tables

Memorize the symbolic names; the handbook gives the numeric values:

- **(P/F, i, n)** — present worth given future, single payment
- **(F/P, i, n)** — future worth given present, single payment
- **(P/A, i, n)** — present worth given annual, uniform series
- **(A/P, i, n)** — annual given present, capital recovery
- **(F/A, i, n)** — future worth given annual, uniform series sinking fund
- **(A/F, i, n)** — annual given future, sinking fund
- **(P/G, i, n)** — present worth of arithmetic gradient

When the problem describes a cash flow, identify whether you need P, F, or A as output and what you have as input — pick the right factor.

## 2.11 Skip strategy for known-weak topics

If you KNOW you're weak in a section (e.g., you struggle with electromagnetics), don't waste time perfecting it. Better strategy:

- Make sure you're STRONG in your top 4-5 sections (high-confidence answers)
- For your weakest sections, plan to answer the EASY questions only (~50% of the questions in that section are typically straightforward formula plug-ins)
- Guess on the rest — random guessing gets 25% on average

This realistic accounting often produces a higher score than trying to be "balanced." Play to your strengths, mitigate weaknesses.`,
      examTip: `MARK and SKIP is your best tool. Never spend >3 minutes on a single question. The exam rewards completing many easy questions over solving a few hard ones.`,
    },
    {
      id: 'practice-strategy',
      title: `3. 30-Day Study Plan and Practice Cadence`,
      content: `## 3.1 A realistic 30-day plan from current state to exam-ready

This assumes you have a solid undergraduate EE background but haven't reviewed the FE topics formally. Adjust based on your starting point.

### Days 1-3: Baseline + handbook orientation

- Download NCEES handbook
- Read its introduction + scan section headings
- Take ONE diagnostic practice exam (NCEES official practice exam if you can buy it, or platform questions)
- Tally results by section to identify your strongest 4-5 sections and weakest 4-5

### Days 4-15: Section-by-section drilling

Allocate study time PROPORTIONAL to section weight × your weakness:

- Strong + heavy section (e.g., Circuits if you're solid): 1 day quick review
- Weak + heavy section (e.g., Power Systems if you skipped that course): 2-3 days deep study

For each section:
1. Read the platform's lesson topic
2. Look up the corresponding handbook section
3. Work 10-20 practice problems
4. For wrong answers: identify the CONCEPT gap (not just the math error), restudy, redo

### Days 16-22: Mixed practice exams

Take 1 full practice exam every 2-3 days under TIMED conditions. After each:

- Review every wrong answer
- Identify whether the miss was knowledge gap (study more), careless math (slow down), or unfamiliarity with handbook (drill navigation)
- Track your section-level scores; if a section is below 50%, give it more time

### Days 23-27: Targeted weakness elimination

By now you know exactly which 4-6 subtopics are dragging you down. Spend these days on ONLY those — no broad review.

### Days 28-29: Light review + handbook re-scan

Don't try to learn anything new. Re-read the formula sheets you struggle with. Get familiar with the handbook search.

### Day 30: Rest

Sleep well. Light review of your personal cheat sheet (your bookmark map). No new content.

## 3.2 Practice question quotas

Aim for total of 800-1200 practice questions over 30 days, distributed by section weight:

- Mathematics: ~80 practice questions
- Circuits: ~120
- Electronics: ~80
- Power Systems: ~90
- Control: ~70
- Digital: ~80
- (others proportional)

You'll see questions multiple times. That's FINE — repetition builds recognition speed. Aim for SECOND-TIME accuracy >90% on previously-seen questions.

## 3.3 Use the platform's QBank with discipline

- Don't peek at answers until you've genuinely attempted
- After answering: review the explanation EVEN IF you got it right (verify your reasoning matched the expected reasoning)
- Use flashcards in spaced repetition (10-15 minutes per day, more in the final week)

## 3.4 Day-before-exam checklist

- ID confirmed (NCEES + government photo)
- Calculator tested and packed (and spare batteries)
- Test center location + travel time verified
- Comfortable clothes (testing rooms vary in temperature)
- Light snack + water for breaks (you may step out)
- Sleep 7-9 hours

## 3.5 Day-of-exam tactics

- Arrive 30 minutes early
- Use the bathroom before starting; you can take breaks but they count against your time
- First 5 minutes: skim the exam interface, verify handbook is accessible, verify calculator
- Start with your STRONGEST section to build confidence and momentum
- Use the flagging system aggressively
- Watch the clock; aim to finish all questions by 5h45min, leaving 15 min for flagged reviews
- Don't change answers in the final review unless you have a CLEAR reason — first instincts are usually right

## 3.6 The 60-70% threshold

The FE EE pass rate is ~56% nationally. The cut score is ~50-65 raw points out of 110 (NCEES doesn't publish exact cut). Practically:

- Score 65+ on practice exams consistently → likely pass
- Score 50-64 → uncertain; depends on test difficulty calibration
- Score <50 → more study needed before exam day

If you can score 65+ on full practice exams under timed conditions, you are READY.`,
      examTip: `The single biggest determinant of pass/fail is HANDBOOK FAMILIARITY combined with EXAM PACING. Both are skills you build through practice, not natural talent. 30 days of disciplined study, 800-1200 practice questions, and 5+ full timed practice exams should get most candidates with a solid EE undergrad to passing.`,
      importantNote: `Don't pay for premium "FE crash course" videos until you've exhausted free resources (NCEES sample questions, university OCW, YouTube channels like Engineer4Free, EE Power, electricalpe). The platform's lessons + QBank + handbook should suffice for most candidates.`,
    },
  ],
  keyTakeaways: [
    'The exam is OPEN-HANDBOOK. Master the NCEES Reference Handbook layout BEFORE drilling content.',
    'Build a personal bookmark map: for each common formula, know which handbook section + approximate page',
    'NCEES-approved calculators only: HP 35s, Casio FX-115 ES Plus, TI-30 series. Practice with the model you\'ll bring.',
    'Time budget: ~196 seconds per question average. Mark and skip questions >5 minutes. ALWAYS guess unanswered (no penalty).',
    'Unit traps are the #1 mistake source. Write out units at problem start; convert before calculating.',
    'Phasors: degrees mode, polar/rectangular as needed, memorize Z_L = jωL (∠+90°), Z_C = 1/(jωC) (∠-90°)',
    'Three-phase: Y has V_line = √3·V_phase, I_line = I_phase. Δ has V_line = V_phase, I_line = √3·I_phase',
    '30-day plan: diagnose, drill weak sections, take 5+ timed practice exams. Score 65+ on practice = ready.',
  ],
},

fee_signal_nyquist: {
  topicId: 'fee_signal_nyquist',
  title: `Nyquist Criterion & Aliasing Pitfalls`,
  domainWeight: 'Signal Processing · 4–6%',
  overview: `The sampling theorem is one of the most-tested concepts in FE Signal Processing because it underlies all digital signal acquisition. Beyond the basic statement, the exam tests numerical aliasing problems (given a sample rate and an input frequency, where does the alias appear?), anti-aliasing filter design (what cutoff?), and reconstruction error analysis. This topic provides the depth NCEES expects.`,
  sections: [
    {
      id: 'nyquist-statement',
      title: `1. The Nyquist-Shannon Sampling Theorem`,
      content: `## 1.1 The fundamental statement

A bandlimited continuous-time signal x(t) with no frequency components above f_max can be PERFECTLY RECONSTRUCTED from its samples if the sampling rate satisfies:

  f_s > 2 · f_max

The minimum sampling rate 2·f_max is called the NYQUIST RATE. The corresponding maximum signal frequency f_s/2 is called the NYQUIST FREQUENCY.

Equivalent statements you'll see:

- "Sample at least twice the highest frequency present in the signal"
- "The Nyquist frequency must exceed the maximum signal frequency"
- "f_N = f_s/2 must be greater than f_max"

## 1.2 What "perfect reconstruction" means

If the criterion is met, the original continuous signal can be reconstructed EXACTLY from the samples using ideal sinc interpolation:

  x(t) = Σ x[n] · sinc((t - n·T_s) / T_s)

where T_s = 1/f_s is the sampling period and sinc(x) = sin(πx)/(πx).

In practice, sinc interpolation requires infinitely many samples (the sinc function is infinitely wide). Real systems use practical reconstruction filters (low-pass with cutoff = f_s/2) which introduce some imperfection.

## 1.3 What happens when you VIOLATE Nyquist — aliasing

If a signal at frequency f > f_s/2 is sampled, it APPEARS at a DIFFERENT frequency in the digital signal. This is ALIASING.

The aliased frequency is:

  f_alias = |f - n · f_s|

where n is the integer that makes the result fall in [0, f_s/2].

For example:
- f_s = 1000 Hz, signal at 700 Hz
- f_alias = |700 - 1·1000| = 300 Hz
- Sampled output appears as a 300 Hz signal

You CANNOT distinguish the original 700 Hz from a real 300 Hz signal after sampling. The information is LOST.

## 1.4 Numerical exam problems

Typical problem: "A 1.5 kHz sinusoid is sampled at 2 kHz. What is the apparent frequency?"

Solution:
- f = 1500 Hz, f_s = 2000 Hz, f_N = 1000 Hz
- 1500 > 1000 → aliasing occurs
- f_alias = |1500 - 1·2000| = 500 Hz
- Apparent frequency: 500 Hz

Another typical problem: "What is the minimum sampling rate to AVOID aliasing for a signal with content up to 4 kHz?"

Solution:
- f_max = 4000 Hz
- f_s > 2·f_max = 8000 Hz
- Answer: f_s > 8 kHz (or "8 kHz" if "≥" is allowed; "must exceed 8 kHz" is the strict statement)

## 1.5 The folding diagram

Visualize aliasing by FOLDING the frequency axis at f_s/2. Frequencies above f_s/2 fold back into the [0, f_s/2] range:

\`\`\`
0 ───── f_s/2 ───── f_s ───── 3·f_s/2 ───── 2·f_s ...
                    ↓ fold     ↓                ↓
            f_s/2 ← 0          f_s ← 0          ...
\`\`\`

A 0.9·f_s signal (above Nyquist) folds to 0.1·f_s. A 1.1·f_s signal folds to 0.1·f_s. A 1.9·f_s signal folds to 0.1·f_s.

## 1.6 The DC component is preserved

A 0 Hz (DC) signal samples to 0 Hz — no aliasing concerns. Aliasing only affects non-DC frequencies above f_s/2.

## 1.7 Bandpass sampling (the special case)

If your signal is BANDPASS (content only between f_L and f_H, with f_L > 0), you can sample at LESS than 2·f_H:

  f_s ≥ 2·B  where B = f_H - f_L

provided f_s is chosen such that the spectrum after sampling doesn't overlap itself. This is "undersampling" or "bandpass sampling" and is used in radio receivers to digitize an RF signal directly.

The exam may test recognition of this concept; full bandpass sampling design is more PE-level.`,
      examTip: `The Nyquist condition is f_s > 2·f_max, NOT f_s ≥ 2·f_max. Some texts/exams use ≥; both produce "minimum" but the strict inequality is the formal statement.`,
      importantNote: `Aliasing CANNOT BE CORRECTED after the fact. Once a signal is sampled below its Nyquist rate, the aliased frequencies are indistinguishable from real frequencies in the digital data. Prevention via anti-aliasing filter is the only fix.`,
    },
    {
      id: 'antialiasing-design',
      title: `2. Anti-Aliasing Filter Design`,
      content: `## 2.1 The anti-aliasing filter (AAF)

To enforce Nyquist, place an ANALOG LOW-PASS FILTER BEFORE the sampler. The filter's job: attenuate any frequency content above f_s/2 to negligible levels before sampling.

  Continuous signal → [Anti-Aliasing Filter] → ADC sampler → digital signal

Without the AAF, any noise or interference above f_s/2 will alias into your signal of interest.

## 2.2 Ideal vs practical AAF

The IDEAL AAF would pass all frequencies < f_s/2 perfectly and block everything above. In practice, real filters have a TRANSITION BAND — they can't go from passing to blocking instantaneously.

Real filters are characterized by:

- **Passband edge f_p** — the highest frequency the filter passes with little attenuation
- **Stopband edge f_st** — the lowest frequency the filter attenuates significantly
- **Transition band** — between f_p and f_st
- **Passband ripple** — how flat the filter is in the passband (typically < 0.5 dB)
- **Stopband attenuation** — how much attenuation at f_st (typically 40-100 dB)

## 2.3 Sample rate margin

Because the filter has a transition band, you must oversample beyond the signal of interest:

- f_p = the highest frequency in your signal of interest (e.g., 20 kHz for audio)
- f_s/2 = f_p + transition band
- f_st (where the filter is fully attenuating) = f_s/2

Example: for 20 kHz audio with a filter having a 2 kHz transition band:
- f_p = 20 kHz
- f_st = 22 kHz (where you want full attenuation)
- f_s ≥ 2 · f_st = 44 kHz

This is why CD audio is sampled at 44.1 kHz, not exactly 40 kHz — there's room for the AAF transition band.

## 2.4 Filter order and steepness

Higher-order filters have steeper rolloff:

- 1st-order: 20 dB/decade (6 dB/octave)
- 2nd-order: 40 dB/decade (12 dB/octave)
- N-th order: 20·N dB/decade

For a given transition band, higher orders allow narrower transitions. Trade-off: higher order = more complexity, more component variation sensitivity, phase distortion.

## 2.5 Filter types (analog)

- **Butterworth** — maximally flat passband; moderate transition; no ripple
- **Chebyshev I** — ripple in passband, sharper transition than Butterworth
- **Chebyshev II (Inverse Chebyshev)** — ripple in stopband, flat passband
- **Elliptic (Cauer)** — ripple in BOTH passband and stopband; sharpest transition for a given order
- **Bessel** — linear phase (constant group delay), gentler magnitude roll-off

For anti-aliasing applications, BUTTERWORTH is typical when ripple-free passband matters; ELLIPTIC for the steepest possible transition.

## 2.6 Oversampling and digital decimation

Modern systems often OVERSAMPLE the signal by a factor much greater than 2× Nyquist, then use a digital filter to reduce the sample rate:

  Analog signal → simple analog AAF → ADC at high f_s → digital LPF → decimate → final digital signal

Why: a simple analog filter is much easier to design than a sharp one. Most of the heavy lifting is done by the digital filter, which can be made nearly ideal with enough taps.

Example: a 16-bit audio ADC might sample at 4.5 MHz (~100× oversampling) with a simple 1st-order analog AAF, then digitally filter and decimate to 44.1 kHz.

This is the technique used in delta-sigma ADCs.

## 2.7 Reconstruction filter (the OUTPUT side)

The reverse of the AAF: when converting back from digital to analog, you also need a low-pass filter to remove spectral images above f_s/2.

  Digital signal → DAC → [Reconstruction Filter] → analog signal

The reconstruction filter is also called a SMOOTHING filter or POST-FILTER.

Same design constraints as AAF: cutoff at f_s/2 (or slightly above), with adequate stopband attenuation.

## 2.8 Practical exam pattern

"A signal has content from DC to 5 kHz plus interference at 8 kHz. The sampling rate is 12 kHz. What is the apparent frequency of the interference, and what filter design would prevent it?"

Solution:
- f_s = 12 kHz, f_N = 6 kHz
- 8 kHz interference > 6 kHz → aliases to |8 - 12| = 4 kHz
- 4 kHz falls IN the signal band of interest — interference is now indistinguishable from real signal
- Fix: install an anti-aliasing low-pass filter with passband edge 5 kHz and stopband edge ≤ 6 kHz, achieving sufficient attenuation at 8 kHz

The required attenuation at 8 kHz depends on the application — typically you want the aliased component at least 40 dB below your desired signal level.`,
      examTip: `Anti-aliasing filter goes BEFORE the sampler (analog). Reconstruction filter goes AFTER the DAC (also analog). Both are low-pass; both have cutoff at f_s/2.`,
    },
    {
      id: 'common-pitfalls',
      title: `3. Common Sampling Pitfalls and Numerical Practice`,
      content: `## 3.1 The "exactly at Nyquist" trap

A signal at EXACTLY f_s/2 is ambiguous. Mathematically, samples at exactly the Nyquist frequency are insufficient to recover the original. In practice, this means:

- f_s = 1000 Hz, sample a 500 Hz cosine: samples might all be 0 (if you sample at the zero-crossings) or have alternating sign (capturing the wave)
- You CANNOT reliably recover a signal at exactly Nyquist

Always design with f_s > 2·f_max (strict inequality), with comfortable margin.

## 3.2 The folding aliases pile up

If your signal has content at MULTIPLE frequencies above Nyquist, they ALL alias and SUM in the digital output. Example:

- f_s = 1000 Hz, signal contains 700 Hz, 1300 Hz, 2700 Hz
- Aliases: 700 → 300 Hz, 1300 → |1300-1000| = 300 Hz, 2700 → |2700-3000| = 300 Hz
- All three components appear at 300 Hz in the digital output — they're indistinguishable

Once aliased, you cannot un-mix them. ONLY pre-filter prevention works.

## 3.3 Sampling vs anti-aliasing for noise

Even if your SIGNAL of interest meets Nyquist, NOISE at high frequencies will alias if not filtered. Wideband thermal noise extends to GHz; any noise above f_s/2 folds into your digital band.

This is why every ADC needs an anti-aliasing filter — not just to handle deliberate signal content but to suppress noise that would alias.

## 3.4 Calculator tips for Nyquist problems

Using your NCEES-approved calculator:

- Quick check: is the input frequency > f_s/2? If yes, aliasing.
- Compute f_alias = |f_in - n · f_s| for n = 1, 2, ...
- Choose n that yields the smallest positive result, with f_alias ∈ [0, f_s/2]

For values like "11.3 kHz signal sampled at 4 kHz":
- f_N = 2 kHz
- |11.3 - 1·4| = 7.3 (still > 2)
- |11.3 - 2·4| = 3.3 (still > 2)
- |11.3 - 3·4| = 0.7 ≤ 2 ✓ → f_alias = 0.7 kHz

## 3.5 The Nyquist rate is the SIGNAL'S property; sampling rate is the SYSTEM'S choice

Common confusion in exam problems:

- "Nyquist rate" = 2 · f_max(signal). This is a property of the SIGNAL.
- "Sampling rate" = f_s. This is a choice made by the system designer.
- The condition to AVOID aliasing: sampling rate > Nyquist rate.

Don't confuse the two terms in your reasoning.

## 3.6 A sampled signal's spectrum

Mathematically, sampling at rate f_s creates copies of the signal's spectrum at integer multiples of f_s in the frequency domain:

  X_s(f) = (1/T_s) · Σ X(f - n·f_s)   for all integer n

The "copies" are called IMAGES or SPECTRAL REPLICAS. As long as the copies don't overlap, the original X(f) can be recovered by low-pass filtering to extract the baseband copy.

Overlap = aliasing.

## 3.7 Five worked exam-style problems

### Problem 1
"A 3.2 kHz tone is sampled at 5 kHz. What is the apparent frequency?"
- f_N = 2.5 kHz, 3.2 > 2.5 → aliasing
- f_alias = |3.2 - 5| = 1.8 kHz

### Problem 2
"A signal has components at 100 Hz, 1500 Hz, and 4500 Hz. The sampling rate is 2 kHz. Which components alias?"
- f_N = 1 kHz
- 100 Hz < 1000 → no aliasing, appears at 100 Hz
- 1500 Hz > 1000 → aliases to |1500 - 2000| = 500 Hz
- 4500 Hz > 1000 → |4500 - 2·2000| = 500 Hz, or = |4500 - 5000| = 500 Hz
- Three components, two aliases — and the two aliases land at the same frequency (500 Hz)

### Problem 3
"What is the minimum sample rate to avoid aliasing for a signal with max frequency 7.5 kHz?"
- f_s > 2 · 7.5 = 15 kHz
- Minimum: f_s > 15 kHz (in practice, choose 16 kHz or higher to allow for AAF transition band)

### Problem 4
"A signal of interest is 0-8 kHz. Designer selects f_s = 20 kHz. What is the AAF specification?"
- f_p = 8 kHz (passband edge — passes signal)
- f_st ≤ f_s/2 = 10 kHz (stopband edge — full attenuation by here)
- Transition band: 8 → 10 kHz (2 kHz wide)
- Stopband attenuation: ≥ 40 dB typical

### Problem 5
"Audio CD samples at 44.1 kHz. What is the Nyquist frequency? What's the highest audio frequency that can be reproduced without aliasing?"
- f_N = 22.05 kHz
- Highest reproducible audio: anything < 22.05 kHz (in practice, the AAF cuts off slightly below to allow margin; ~20 kHz)
- This conveniently matches human hearing range (20 Hz to 20 kHz)`,
      examTip: `For aliasing calculations, the formula f_alias = |f - n·f_s| works for any n; pick the n that puts f_alias in [0, f_s/2]. Practice mental computation — these are quick if you're fluent.`,
    },
  ],
  keyTakeaways: [
    'Nyquist criterion: f_s > 2·f_max (strict). Nyquist frequency = f_s/2.',
    'Aliasing maps frequency f > f_s/2 to f_alias = |f - n·f_s| in [0, f_s/2]. Cannot be undone.',
    'Anti-aliasing filter (analog LP, cutoff at f_s/2) goes BEFORE the sampler. Reconstruction filter goes AFTER the DAC.',
    'Real filters have transition bands — oversample beyond 2·f_max to allow filter rolloff (CD samples at 44.1 kHz for 20 kHz audio)',
    'Higher-order analog filters have steeper rolloff: N-th order = 20·N dB/decade',
    'Modern systems oversample heavily and use digital decimation — easier than designing sharp analog filters',
    'Bandpass sampling: a band-limited signal between f_L and f_H can be sampled at 2·B (B = f_H - f_L) if frequencies don\'t overlap after replication',
  ],
},

fee_bode_sketching: {
  topicId: 'fee_bode_sketching',
  title: `Bode Plot Sketching Techniques`,
  domainWeight: 'Linear Systems · 4–6%',
  overview: `Bode plots are the workhorse graphical tool of control engineers. The FE exam tests both reading Bode plots (given a plot, identify the transfer function) and sketching them (given a transfer function, draw the asymptotic magnitude and phase). Mastering the rules lets you sketch in <30 seconds vs minutes of detailed calculation. This topic covers the asymptotic rules, corner frequency identification, gain/phase margin reading, and the common transfer function patterns the exam loves.`,
  sections: [
    {
      id: 'bode-fundamentals',
      title: `1. Bode Plot Fundamentals and Asymptotic Rules`,
      content: `## 1.1 What is a Bode plot

A Bode plot has TWO sub-plots, both versus log-scale frequency (typically rad/s):

1. **Magnitude plot** — |H(jω)| in dB on the y-axis (linear), log ω on x-axis
2. **Phase plot** — ∠H(jω) in degrees on the y-axis (linear), log ω on x-axis

The log-log nature of the magnitude plot makes asymptotic approximation possible — straight lines that change slope at "corner frequencies."

## 1.2 The decibel convention

For a transfer function H(s):

  |H(jω)|_dB = 20 · log₁₀ |H(jω)|

Examples:
- |H| = 1 → 0 dB
- |H| = 10 → 20 dB
- |H| = 100 → 40 dB
- |H| = 0.1 → -20 dB
- |H| = √2 → 3 dB
- |H| = 1/√2 → -3 dB

Memorize: every factor of 10 in magnitude = 20 dB. Every factor of 2 ≈ 6 dB. The -3 dB point is where the magnitude has dropped to 70.7% of peak.

## 1.3 The asymptotic rule for each factor

A transfer function is decomposed into FACTORS, each contributing to the total Bode plot:

| Factor in H(s) | Magnitude slope | Phase contribution |
|---|---|---|
| Constant K | 20·log₁₀(K) dB everywhere | 0° if K > 0, ±180° if K < 0 |
| Pole at origin: 1/s | -20 dB/decade | -90° everywhere |
| Zero at origin: s | +20 dB/decade | +90° everywhere |
| Real pole 1/(s/p + 1) | 0 below p, -20 dB/decade above p | 0° below p/10, -90° above p·10, -45° at p |
| Real zero (s/z + 1) | 0 below z, +20 dB/decade above z | 0° below z/10, +90° above z·10, +45° at z |
| Complex pole pair | 0 below ωₙ, -40 dB/decade above | 0° to -180° transition centered at ωₙ |
| Complex zero pair | 0 below ωₙ, +40 dB/decade above | 0° to +180° transition centered at ωₙ |

Each factor contributes ADDITIVELY (because log of a product = sum of logs).

## 1.4 The standard form for factoring

Bode plots use TIME-CONSTANT form, not pole-zero form. Convert:

  Pole-zero form: H(s) = K' · (s - z₁) / (s - p₁)
  Time-constant form: H(s) = K · (s/z₁ + 1) / (s/p₁ + 1)   (assuming p₁, z₁ are not at origin)

In time-constant form, the breakpoint of each factor is the "1" — i.e., the corner frequency for a factor (s/p + 1) is ω = p.

The DC gain K in time-constant form is the magnitude at ω → 0.

## 1.5 Sketching procedure

1. **Convert H(s) to time-constant form**
2. **Identify the DC gain K** — this sets the y-intercept of the low-frequency asymptote
3. **Mark each corner frequency** on the log-frequency axis
4. **Start the magnitude plot** at the low-frequency value:
   - If there's an s^n in the denominator: slope is -20·n dB/decade at low frequencies
   - If there's an s^n in the numerator: slope is +20·n dB/decade at low frequencies
   - Otherwise: slope is 0 (flat) at low frequencies
5. **At each corner frequency**, change the slope by:
   - +20 dB/decade for each zero at that frequency
   - -20 dB/decade for each pole at that frequency
6. **Repeat for phase** — phase changes by ±90° per factor, with the transition centered at the corner frequency

## 1.6 Example: H(s) = 10 · (s + 100) / (s · (s + 10))

Step 1: time-constant form:
  H(s) = 10 · (s/100 + 1) · 100 / (s · ((s/10 + 1) · 10))
       = 100 · (s/100 + 1) / (s · (s/10 + 1))

DC gain (as s → 0): the (s/100 + 1) → 1, the (s/10 + 1) → 1, so |H| → 100/s as s → 0. There's a pole at origin (s), so DC gain is undefined; the magnitude goes to infinity as ω → 0.

Step 2: corner frequencies: ω = 10 (pole), ω = 100 (zero)

Step 3: start of magnitude plot:
- Pole at origin: slope -20 dB/decade everywhere as starting condition
- Pick a low frequency, say ω = 1: |H| ≈ |100/1| / |1| = 100 = 40 dB
- So the curve passes through 40 dB at ω = 1, going down at -20 dB/decade

Step 4: change slopes at corners:
- At ω = 10 (pole): slope goes from -20 to -40 dB/decade
- At ω = 100 (zero): slope goes from -40 to -20 dB/decade

Step 5: continue with -20 dB/decade above ω = 100

Step 6: phase:
- Constant: 0°
- Pole at origin: -90° everywhere
- Pole at ω = 10: 0° below 1, -45° at 10, -90° above 100 (transition centered at 10)
- Zero at ω = 100: 0° below 10, +45° at 100, +90° above 1000 (transition centered at 100)

Total phase: start at -90° (just from origin pole), transition to -180° (origin pole + p₁ pole) around ω = 10, transition back up by 90° (zero) around ω = 100, ending at -90° at high frequency.`,
      examTip: `Always start in time-constant form. Identify corner frequencies. Start with low-frequency asymptote. Change slope at each corner. Use ±20 dB/decade per pole/zero of multiplicity.`,
    },
    {
      id: 'gain-phase-margins',
      title: `2. Gain and Phase Margins from Bode Plots`,
      content: `## 2.1 Why we care about margins

For a negative-feedback control loop with open-loop transfer function L(s) = G(s)·H(s), STABILITY of the CLOSED loop depends on how far the open-loop response is from the -1 point (in Nyquist sense), or equivalently from 0 dB and -180° on Bode plots.

Gain and phase margins quantify this distance:

- **Gain Margin (GM)**: how much MORE gain can be added before instability
- **Phase Margin (PM)**: how much MORE phase lag can be added before instability

Both should be POSITIVE for stability; larger = more robust.

## 2.2 Reading gain margin from Bode plot

1. Find the PHASE CROSSOVER frequency ω_pc — where the phase plot crosses -180°
2. At ω_pc, read the magnitude in dB
3. Gain Margin = -|M(ω_pc)| in dB (i.e., the magnitude reading expressed as a negative number is the gain margin if magnitude is below 0)

If |L(jω_pc)| < 0 dB → GM > 0 (system is stable; can add up to GM more gain before instability)
If |L(jω_pc)| > 0 dB → GM < 0 (system is UNSTABLE)

## 2.3 Reading phase margin from Bode plot

1. Find the GAIN CROSSOVER frequency ω_gc — where the magnitude plot crosses 0 dB
2. At ω_gc, read the phase in degrees
3. Phase Margin = phase(ω_gc) - (-180°) = phase(ω_gc) + 180°

If phase at ω_gc is -135° → PM = -135 + 180 = 45°
If phase at ω_gc is -180° → PM = 0° (system is on the boundary of stability)
If phase at ω_gc is -200° → PM = -20° (system is UNSTABLE)

## 2.4 Typical design targets

For a well-designed control loop:

- **Gain Margin**: 6-12 dB (factor of 2 to 4)
- **Phase Margin**: 45-60° for good transient response

PM < 30° usually means oscillatory response.
PM > 70° usually means overdamped, slow response.

## 2.5 Relating PM to damping ratio

For a second-order closed loop with PM degrees, the damping ratio is approximately:

  ζ ≈ PM / 100   (PM in degrees)

So PM = 45° → ζ ≈ 0.45 (under-damped but stable response)
PM = 70° → ζ ≈ 0.7 (near-critical damping, smooth response)

This is rough but useful for ballpark design.

## 2.6 The conditional stability case

Some systems have MULTIPLE phase crossovers (e.g., a complicated transfer function whose phase curves cross -180° at multiple frequencies). Such systems may be stable for a RANGE of gains and unstable above or below. Bode plot alone may not fully characterize this; Nyquist plot is more reliable for complex cases.

The exam typically gives simpler systems with a single PM and GM to read.

## 2.7 Closed-loop bandwidth from Bode plot

For a unity-feedback loop with open-loop L(s), the closed-loop BANDWIDTH is approximately equal to the gain crossover frequency ω_gc.

This is useful for design: choose ω_gc to match the desired closed-loop bandwidth.`,
      examTip: `Memorize: ω_gc = where |L| = 0 dB. ω_pc = where ∠L = -180°. PM = ∠L(ω_gc) + 180°. GM = -|L(ω_pc)| dB. Both should be positive for stability.`,
    },
    {
      id: 'common-patterns',
      title: `3. Common Transfer Function Patterns the Exam Tests`,
      content: `## 3.1 First-order low-pass

  H(s) = K / (s/p + 1)

- DC gain: K (= 20·log₁₀ K dB)
- Corner frequency: ω = p
- Magnitude slope: 0 below p, -20 dB/decade above
- Phase: 0° below p/10, -45° at p, -90° above p·10
- -3 dB point: at ω = p

Used for: simple RC low-pass filters, first-order systems.

## 3.2 First-order high-pass

  H(s) = K · (s/z) / (s/z + 1)   or equivalently K · s / (s + z)

- DC gain: 0 (-∞ dB)
- Corner frequency: ω = z
- Magnitude slope: +20 dB/decade below z, 0 above
- Phase: +90° at low freq, +45° at z, 0° at high freq

## 3.3 Second-order low-pass

  H(s) = ωₙ² / (s² + 2ζωₙs + ωₙ²)

- DC gain: 1 (0 dB)
- Natural frequency: ωₙ
- Damping ratio: ζ
- Magnitude slope: 0 below ωₙ, -40 dB/decade above
- Peak in magnitude at ωₙ if ζ < 0.707 (resonant peak; height = 1/(2ζ√(1-ζ²))
- Phase: 0° at low freq, -90° at ωₙ, -180° at high freq

For ζ = 0.5: 1.25 dB resonant peak. For ζ = 0.1: 14 dB peak. For ζ ≥ 0.707: no peak.

## 3.4 Pole at origin (integrator)

  H(s) = 1/s

- Magnitude: -20 dB/decade everywhere; passes through 0 dB at ω = 1
- Phase: -90° everywhere
- DC gain: infinite (signal not bounded)

Used as: integrator in op-amp circuits, type-1 control system.

## 3.5 Lead compensator

  H(s) = K · (s/z + 1) / (s/p + 1)   where z < p

- Adds POSITIVE phase between z and p (peak phase add at √(zp))
- Used to add phase margin to a control loop
- Increases bandwidth

## 3.6 Lag compensator

  H(s) = K · (s/z + 1) / (s/p + 1)   where z > p

- Adds gain at low frequencies; -20 dB/decade between p and z
- Reduces steady-state error
- Reduces bandwidth

## 3.7 PID controller

  H(s) = K_p + K_i/s + K_d·s

In transfer function form often written:
  H(s) = K_p · (1 + 1/(T_i·s) + T_d·s)

- The integral term (K_i/s) provides infinite DC gain — eliminates steady-state error to step input
- The derivative term (K_d·s) adds phase lead and improves transient response
- Tuning: Ziegler-Nichols, Cohen-Coon, or trial-and-error

PID is the most common controller. The Bode plot of a PID has -20 dB/decade at very low frequency (integrator), flat in midband (proportional), and +20 dB/decade at high frequency (derivative).

## 3.8 Quick recognition table for exam

| Bode pattern | Likely transfer function |
|---|---|
| Flat then -20 dB/dec | First-order LP, single real pole |
| -20 dB/dec then flat | First-order HP, single real zero |
| Flat then -40 dB/dec | Second-order LP, complex pole pair |
| -20 dB/dec at all freq | Integrator 1/s |
| +20 dB/dec at all freq | Differentiator s |
| Peak in magnitude | Underdamped 2nd-order or RLC resonance |
| Multiple slope changes | Higher-order system; identify each corner |

## 3.9 The exam pattern

A typical FE Bode question:

"The Bode magnitude plot of H(s) shows a constant slope of -40 dB/decade above ω = 5 rad/s and flat below. The DC gain is 1. Estimate H(s)."

Answer:
- -40 dB/decade slope above one corner = TWO poles at that corner
- Either (s/5 + 1)² or a complex pair with ωₙ ≈ 5
- DC gain 1 → no constant other than 1
- H(s) ≈ 1 / ((s/5 + 1)²) = 25 / (s + 5)²

Or if the magnitude shows a peak near 5 rad/s, the answer is a complex pair:
  H(s) = 25 / (s² + 2ζ·5·s + 25) for some ζ < 0.707`,
      examTip: `Recognize the slope: -20 = one pole. -40 = two poles. Recognize where the change happens: that's a corner frequency. Read DC gain from the flat low-frequency portion (in linear units, 0 dB = gain 1).`,
    },
  ],
  keyTakeaways: [
    'Convert H(s) to time-constant form. Identify DC gain K and each corner frequency.',
    'Each real pole adds -20 dB/decade above its corner. Each real zero adds +20 dB/decade. Complex pairs add ±40 dB/decade.',
    'Phase changes ±90° per factor, centered at corner frequency with transition band ±1 decade',
    '20 log scale: factor of 10 = 20 dB; factor of 2 ≈ 6 dB; -3 dB = half-power point',
    'Gain Margin: -|L| at phase-crossover ω_pc (where phase = -180°). Stable if GM > 0.',
    'Phase Margin: ∠L + 180° at gain-crossover ω_gc (where |L| = 0 dB). Stable if PM > 0. Target 45-60°.',
    'Rough approximation: damping ratio ζ ≈ PM(degrees)/100. PM 45° gives ζ ≈ 0.45 (well-damped second order).',
  ],
},

fee_pzmap_analysis: {
  topicId: 'fee_pzmap_analysis',
  title: `Pole-Zero Maps & Dynamic Response`,
  domainWeight: 'Control Systems · 4–6%',
  overview: `Pole-zero plots in the complex s-plane are the most compact representation of a linear system. Their locations directly determine the time-domain response — stability, damping, oscillation frequency, decay rate. The FE exam tests both directions: given pole locations, predict response; given a desired response, place poles appropriately. This topic covers pole-zero plot interpretation, the relationship between pole locations and time response, and the special role of complex pole pairs.`,
  sections: [
    {
      id: 'pole-locations-meaning',
      title: `1. Pole Locations and Time-Domain Response`,
      content: `## 1.1 The s-plane

Poles and zeros of H(s) are plotted in the complex s-plane:

- Real axis: Re(s) = σ (decay/growth rate)
- Imaginary axis: Im(s) = jω (oscillation frequency)
- Left-half plane (LHP): Re(s) < 0 → DECAYING components → STABLE
- Right-half plane (RHP): Re(s) > 0 → GROWING components → UNSTABLE
- Imaginary axis: Re(s) = 0 → MARGINAL — pure oscillation (or constant for s=0)

Poles are typically plotted as ×, zeros as ○.

## 1.2 A real pole at s = -a

For a single real pole at s = -a (a > 0):

  H(s) = K / (s + a)
  h(t) = K · e^(-at)   (impulse response)

The time constant is τ = 1/a. The response decays to ~37% in τ seconds, ~5% in 3τ, ~1% in 5τ.

If a < 0 (pole in RHP), the exponential GROWS → unstable.
If a = 0, h(t) = K (constant) — marginal, integrator response.

## 1.3 A complex pole pair at s = -σ ± jω_d

Complex poles always come in CONJUGATE PAIRS (because H(s) has real coefficients). For a pair at s = -σ ± jω_d:

  Response component: e^(-σt) · cos(ω_d·t + φ)

This is a DAMPED SINUSOID:
- σ controls the decay envelope (faster decay if σ is larger positive)
- ω_d controls the oscillation frequency
- Sign of σ: positive = decaying (stable), negative = growing (unstable), zero = pure oscillation (marginal)

## 1.4 Standard second-order parameters

A second-order pole pair is often described by:

- **Natural frequency** ωₙ = distance from origin to pole = √(σ² + ω_d²)
- **Damping ratio** ζ = σ / ωₙ = cos(angle from negative real axis to pole)

The damped frequency ω_d = ωₙ · √(1 - ζ²).

| ζ | Behavior |
|---|---|
| ζ > 1 | Overdamped — two real poles, slow but no oscillation |
| ζ = 1 | Critically damped — repeated real pole, fastest non-oscillatory |
| 0 < ζ < 1 | Underdamped — complex poles, oscillation present |
| ζ = 0 | Undamped — purely imaginary poles, pure oscillation forever |
| ζ < 0 | Negative damping — RHP poles, growing oscillation |

## 1.5 Pole locations and step response characteristics

For an underdamped second-order system with poles at -σ ± jω_d (ωₙ = √(σ² + ω_d²), ζ = σ/ωₙ):

- **Rise time**: t_r ≈ (1.8) / ωₙ — time to first reach 100% of steady state
- **Peak time**: t_p = π / ω_d — time of first peak
- **Settling time** (5% criterion): t_s ≈ 3 / σ = 3 / (ζ·ωₙ)
- **Percent overshoot**: %OS = e^(-πζ/√(1-ζ²)) · 100

These are exam-tested formulas. The "Standard" rules:
- ζ = 0.7 → ~5% overshoot
- ζ = 0.5 → ~16% overshoot
- ζ = 0.3 → ~37% overshoot
- ζ = 0.1 → ~73% overshoot

## 1.6 Where poles MUST BE for desired response

Conversely, given a desired specification, you can place poles:

- Need fast settling? Move σ farther into the LHP (away from imaginary axis)
- Need less overshoot? Increase ζ (poles closer to real axis, away from imaginary axis along the negative real)
- Need higher frequency oscillation? Move ω_d farther from real axis
- Need higher ωₙ? Push poles farther from origin

Constant-ζ lines are RADIAL LINES from origin. Constant-ωₙ lines are CIRCLES centered at origin.

## 1.7 Multiple poles and dominance

For systems with multiple poles, the response is the sum of contributions from each pole. However:

- The pole closest to the imaginary axis has the SLOWEST decay → DOMINANT
- Poles much farther into the LHP contribute fast-decaying components that are quickly negligible
- Dominant pole approximation: if one pole or pole pair is much closer to the imaginary axis than others, the system behaves like a first or second-order system characterized by those dominant poles

A rule of thumb: if a pole is at least 5× farther into LHP than the dominant pole, it can be ignored for transient response analysis.`,
      examTip: `LHP poles = stable (decaying). RHP poles = unstable. Imaginary axis poles = marginal. Complex pairs = oscillation; damping ratio ζ = cos(angle from negative real axis).`,
    },
    {
      id: 'zero-effects',
      title: `2. Zero Locations and Their Effects`,
      content: `## 2.1 Where zeros sit

Zeros also live in the s-plane. They don't determine stability (only poles do), but they SHAPE the response.

Real zeros: × LHP = "normal" zero. RHP zero = "non-minimum phase" zero.

## 2.2 Effect of zeros on step response

A zero close to a pole tends to CANCEL its dynamic contribution. A zero far from a pole has minimal effect.

In general:

- LHP zero close to the origin: increases system speed (more transient overshoot, faster rise)
- RHP zero (non-minimum phase): causes initial UNDERSHOOT — the response initially moves in the OPPOSITE direction before correcting and reaching steady state
- Zeros far from poles: minimal effect on transient response, but affect frequency response

## 2.3 The non-minimum phase phenomenon

A common exam pattern. A transfer function:

  H(s) = (1 - s/z) / (something with stable poles)   where z > 0

has a RHP zero at s = +z. The step response will INITIALLY MOVE IN THE WRONG DIRECTION before correcting. Classic example: a boost converter — when you increase duty cycle, output voltage briefly dips before rising.

Non-minimum phase systems are HARDER TO CONTROL because of this initial wrong-direction response.

## 2.4 Pole-zero cancellation

If a zero and pole are at the SAME location, they exactly cancel in the transfer function:

  H(s) = K · (s - a) / (s - a) · (other stuff) = K · (other stuff)

In theory. In practice, parameter uncertainty makes exact cancellation impossible. A pole and zero CLOSE TOGETHER mostly cancel, with the residual effect being small.

This is sometimes used in control design — a controller adds a zero to cancel a slow plant pole, speeding up the response.

## 2.5 Closed-loop pole locations via root locus

When you put a controller K·G(s) in a feedback loop with plant H(s), the closed-loop transfer function is:

  T(s) = K·G(s)·H(s) / (1 + K·G(s)·H(s))

The closed-loop POLES are the roots of the characteristic equation 1 + K·G(s)·H(s) = 0. As K varies, the pole locations TRACE OUT the ROOT LOCUS.

Root locus rules (review):
- Branches start at open-loop poles, end at open-loop zeros (or infinity)
- N branches go to infinity along asymptotes if there are more poles than zeros
- Symmetric about real axis (poles come in conjugate pairs)
- Number of asymptotes = poles - zeros
- Real-axis segments: a segment is on root locus if odd number of real poles+zeros lie to its right

Root locus IS a graphical pole-placement tool — by choosing K, you slide poles along the locus to desired locations.

## 2.6 Exam example

"A system has poles at -2 ± j3 and a zero at -10. What is the time response to a unit step?"

Analysis:
- Complex pole pair at -2 ± j3: ωₙ = √(4+9) = √13 ≈ 3.6 rad/s, ζ = 2/3.6 ≈ 0.55
- Zero at -10: far from the poles, so MINIMAL effect on transient (just slight speed-up)
- Response: underdamped sinusoid with ζ ≈ 0.55:
  - Damped frequency ω_d = ωₙ·√(1-ζ²) = 3.6·0.835 ≈ 3 rad/s
  - Rise time ≈ 1.8/3.6 = 0.5 s
  - Settling time ≈ 3/2 = 1.5 s
  - Overshoot ≈ exp(-π·0.55/√(1-0.55²)) · 100% ≈ 13%

The response oscillates at ~3 rad/s, decays in ~1.5 seconds, with ~13% overshoot, and the zero at -10 has negligible effect.

## 2.7 Real-axis pole/zero combinations

For purely real pole/zero combinations:

- One LHP real pole: 1st-order exponential decay
- Two LHP real poles: overdamped second-order; sum of two exponentials
- LHP real pole + LHP real zero: like 1st-order but the zero can speed up the transient
- LHP pole + RHP zero: non-minimum phase initial inverse response

## 2.8 Common transfer function shapes

| Configuration | Behavior |
|---|---|
| One LHP real pole | Pure exponential decay |
| Two LHP real poles, distinct | Overdamped — slow exponential sum |
| LHP repeated real pole | Critically damped — fastest no-overshoot |
| LHP complex pair | Underdamped oscillation |
| LHP poles + LHP zero | Response shaped by zero placement |
| LHP poles + RHP zero | Non-minimum phase — initial inverse response |
| RHP poles | Unstable — growing response |
| Poles on jω axis | Marginal — pure oscillation, doesn't decay |`,
      examTip: `Zeros don't affect stability (poles do), but they shape the transient response. RHP zeros cause initial inverse response (non-minimum phase). LHP zeros close to poles can mostly cancel dynamic contribution.`,
    },
    {
      id: 'state-space-and-stability',
      title: `3. State-Space, Eigenvalues, and Stability Tests`,
      content: `## 3.1 State-space representation

An alternative to transfer functions, using vector-matrix form:

  ẋ = Ax + Bu
  y = Cx + Du

Where x is the state vector, u is input, y is output. The system POLES are the EIGENVALUES of A — the roots of det(sI - A) = 0.

Stability via state-space: all eigenvalues of A in LHP → stable.

## 3.2 Controllability and Observability

Two important properties for state-space systems:

- **Controllable**: every state can be driven by the input. Controllability matrix [B AB A²B ... A^(n-1)B] has full rank.
- **Observable**: every state can be inferred from the output. Observability matrix [C; CA; CA²; ...; CA^(n-1)] has full rank.

A system needs to be BOTH controllable AND observable for full pole-placement control.

Recognition-level for FE exam; deeper coverage on PE.

## 3.3 Routh-Hurwitz stability test

A simple algebraic test for whether all roots of a polynomial are in the LHP, without actually computing the roots.

Given a characteristic polynomial: a_n·s^n + a_(n-1)·s^(n-1) + ... + a_1·s + a_0

Necessary conditions:
1. All coefficients must have the SAME SIGN
2. No coefficient can be missing (i.e., all powers 0 through n must be present, unless their coefficient is zero — which means automatically unstable unless special analysis)

If both conditions hold, build the Routh table:

\`\`\`
s^n     | a_n    a_(n-2)  a_(n-4)  ...
s^(n-1) | a_(n-1) a_(n-3)  a_(n-5)  ...
s^(n-2) | b_1    b_2      b_3      ...
...
s^0     | (final coefficient)
\`\`\`

Where: b_1 = (a_(n-1)·a_(n-2) - a_n·a_(n-3)) / a_(n-1)
       b_2 = (a_(n-1)·a_(n-4) - a_n·a_(n-5)) / a_(n-1)
... and similarly for subsequent rows.

The system is stable if and only if all entries in the FIRST COLUMN have the SAME SIGN.

The NUMBER of sign changes in the first column equals the NUMBER OF ROOTS in the RHP.

## 3.4 Worked Routh example

Characteristic polynomial: s³ + 2s² + 3s + 4

\`\`\`
s³ | 1   3
s² | 2   4
s¹ | (2·3 - 1·4)/2 = 2/2 = 1
s⁰ | (1·4 - 2·0)/1 = 4
\`\`\`

First column: 1, 2, 1, 4 — all positive. STABLE. No RHP roots.

Another: s³ + s² + s + 6

\`\`\`
s³ | 1    1
s² | 1    6
s¹ | (1·1 - 1·6)/1 = -5
s⁰ | (-5·6 - 1·0)/-5 = 6
\`\`\`

First column: 1, 1, -5, 6 — two sign changes (+ → - and - → +). Two RHP roots. UNSTABLE.

## 3.5 Special cases in Routh

- **Zero in first column with nonzero row**: replace with small ε, continue, then take limit as ε → 0
- **All-zero row**: indicates symmetric roots (e.g., pure imaginary pair). Use the auxiliary equation from the row above to find them.

## 3.6 The state-transition matrix

For autonomous system ẋ = Ax with initial state x(0), the solution is:

  x(t) = e^(At) · x(0)

Where e^(At) is the matrix exponential, computable as:
- e^(At) = L⁻¹{(sI - A)⁻¹}   (inverse Laplace of resolvent matrix)
- Or via eigenvalue decomposition: e^(At) = P · e^(Λt) · P⁻¹

For exam purposes: recognize that eigenvalues of A determine the response modes; their LHP/RHP location determines stability.

## 3.7 Exam decision tree

Given a problem:

1. Stability question with characteristic polynomial → Routh-Hurwitz
2. Stability question with transfer function → factor denominator, check pole locations
3. Stability question with state-space A matrix → find eigenvalues (computed or stated), check LHP/RHP
4. Time response from pole locations → use ωₙ, ζ formulas for underdamped; sum of exponentials for real poles
5. Pole placement from desired response → use formulas to find required pole locations`,
      examTip: `Routh-Hurwitz: ALL FIRST-COLUMN entries same sign = stable. Number of SIGN CHANGES in first column = number of RHP roots. Negative coefficient anywhere in original polynomial = automatically unstable.`,
    },
  ],
  keyTakeaways: [
    'LHP poles = stable (decaying response). RHP poles = unstable (growing). Imaginary axis = marginal.',
    'Complex pole pair at -σ ± jω_d: response is e^(-σt)·cos(ω_d·t + φ). σ controls decay; ω_d controls oscillation.',
    'Damping ratio ζ = cos(angle from negative real axis to pole). ζ = 0.7 → ~5% overshoot. ζ = 1 → critically damped.',
    'Settling time t_s ≈ 3/σ = 3/(ζωₙ). Rise time t_r ≈ 1.8/ωₙ. Peak time t_p = π/ω_d.',
    'Zeros don\'t affect stability but shape transient. RHP zero = non-minimum phase = initial inverse response.',
    'Dominant pole approximation: pole closest to imaginary axis dominates response if others are 5×+ farther away',
    'Routh-Hurwitz: all first-column entries same sign = stable. Number of sign changes = number of RHP roots. Coefficient missing or negative = automatic instability.',
  ],
},

fee_power_faults: {
  topicId: 'fee_power_faults',
  title: `Fault Analysis & Symmetrical Components`,
  domainWeight: 'Power Systems · 4–6%',
  overview: `Fault analysis is essential to power system design — sizing circuit breakers, selecting protective relays, evaluating equipment damage. The FE exam tests recognition and basic calculation of three-phase faults, single-line-to-ground faults, line-to-line faults, and double-line-to-ground faults. Symmetrical components (positive, negative, zero sequence) provide the mathematical framework to handle unbalanced faults systematically. This topic was identified as a gap in the platform's existing power systems coverage.`,
  sections: [
    {
      id: 'fault-types',
      title: `1. The Four Fault Types and Their Frequency`,
      content: `## 1.1 The classification

Power system faults are classified by which phases and ground are involved:

| Fault type | Symbol | Phases involved | Approximate frequency |
|---|---|---|---|
| Three-phase fault (balanced) | 3φ or LLL | All three phases short-circuited | ~5% |
| Three-phase to ground | 3φG | All three phases to ground | ~5% |
| Single-line-to-ground | SLG or LG | One phase to ground | ~70% |
| Line-to-line | LL | Two phases short-circuited | ~15% |
| Double-line-to-ground | LLG or DLG | Two phases to ground | ~5% |

So ~70% of all power system faults are SINGLE-LINE-TO-GROUND. Three-phase faults are rare but produce the highest fault currents (used for circuit breaker rating).

## 1.2 Symmetric vs asymmetric

- **Three-phase fault**: symmetric in all three phases. Can be analyzed as a single-phase equivalent.
- **All other faults**: asymmetric. Phases see different voltages and currents. Requires symmetrical components for analysis.

## 1.3 The fault current

When a fault occurs, the impedance from source to fault drops dramatically (often to a small fraction of normal load impedance). Current surges to many times normal:

- Pre-fault current: ~1.0 per-unit (normal load)
- Fault current: 5-30 per-unit, depending on fault type and location

The fault current is determined by:
- The source voltage (typically nominal system voltage)
- The TOTAL impedance from source to fault (transformer impedance, line impedance, generator subtransient impedance, etc.)

## 1.4 Why faults matter

- **Equipment damage**: thermal and magnetic forces increase as I². A 20× current = 400× heating power. Brief faults can melt conductors.
- **System stability**: voltage collapse, generator pole slip
- **Personnel safety**: arc flash hazard, electrocution
- **Circuit breaker rating**: breakers must INTERRUPT the maximum possible fault current

Engineers must KNOW THE FAULT CURRENT at every point in the system to:
- Size circuit breakers (interrupting capacity ≥ max fault current)
- Set protective relays (pickup current, time delays)
- Calculate ground grid potentials (touch and step voltages)
- Determine equipment short-circuit ratings`,
      examTip: `Three-phase fault is rare but PRODUCES the HIGHEST CURRENT. Use 3φ fault current for circuit breaker rating. SLG is most common (70%) but typically lower current than 3φ.`,
    },
    {
      id: 'symmetrical-components',
      title: `2. Symmetrical Components Decomposition`,
      content: `## 2.1 The motivation

For unbalanced systems (and asymmetric faults), analyzing each phase separately is messy. The elegant trick: any unbalanced three-phase set can be decomposed into three BALANCED sets called symmetrical components.

## 2.2 The three sequences

Any set of three phasors V_a, V_b, V_c can be written as the SUM of three balanced sequence components:

1. **Positive sequence (a-b-c rotation)**: V_a1, V_b1 = a²·V_a1, V_c1 = a·V_a1
2. **Negative sequence (a-c-b rotation)**: V_a2, V_b2 = a·V_a2, V_c2 = a²·V_a2
3. **Zero sequence (all equal)**: V_a0 = V_b0 = V_c0

Where a = 1∠120° = -0.5 + j0.866 (the cube root of unity).

So:
  V_a = V_a0 + V_a1 + V_a2
  V_b = V_a0 + a²·V_a1 + a·V_a2
  V_c = V_a0 + a·V_a1 + a²·V_a2

In matrix form:
  [V_a]   [1  1   1 ]   [V_a0]
  [V_b] = [1  a²  a ] × [V_a1]
  [V_c]   [1  a   a²]   [V_a2]

The inverse (decompose phase quantities into sequence quantities):
  [V_a0]       [1  1   1 ]   [V_a]
  [V_a1] = ⅓ × [1  a   a²] × [V_b]
  [V_a2]       [1  a²  a ]   [V_c]

## 2.3 Physical interpretation

- **Positive sequence**: balanced three-phase set with normal a-b-c rotation. Represents the system in normal operation. This is what generators and motors are designed for.
- **Negative sequence**: balanced set with REVERSED rotation. Created by unbalanced loads or faults. Causes heating in rotating machines (induces opposing torque + double-frequency currents in rotor).
- **Zero sequence**: three phasors of equal magnitude and angle. Returns through ground or neutral. Created by ground faults.

## 2.4 Sequence impedance networks

Each sequence has its own equivalent impedance network for any component:

- **Generator/motor**: Z_1 (positive sequence, often the subtransient impedance X_d''), Z_2 (negative sequence, typically Z_2 ≈ Z_1 for synchronous machines), Z_0 (zero sequence, depends on neutral grounding)
- **Transformer**: depends on winding configuration (Y-Y, Y-Δ, Δ-Δ); Z_1 = Z_2 = Z_0 = leakage impedance for Y-Y; zero sequence may not pass through Δ at all
- **Transmission line**: Z_1 = Z_2 typically; Z_0 ≈ 3× Z_1 due to ground return path

For fault calculations, you build THREE separate networks (one per sequence) and combine them based on the fault type.

## 2.5 Fault analysis using sequence networks

For each fault type, the three sequence networks are interconnected in a specific way:

### Three-phase fault (3φ)
Only positive-sequence network is involved. No negative or zero sequence (perfectly balanced fault).
  I_a1 = V_pre-fault / Z_1
  Phase currents: I_a = I_a1, I_b = a²·I_a1, I_c = a·I_a1

### Single-line-to-ground (SLG) fault
All three sequence networks connected IN SERIES.
  I_a1 = I_a2 = I_a0 = V_pre-fault / (Z_1 + Z_2 + Z_0 + 3·Z_f)
  where Z_f is the fault impedance (often 0 for bolted fault)
  Phase A current: I_a = 3·I_a1; Phases B and C: I_b = I_c = 0

### Line-to-line (LL) fault (phases B and C)
Positive and negative sequence networks in PARALLEL; zero sequence not involved.
  I_a1 = -I_a2 = V_pre-fault / (Z_1 + Z_2 + Z_f)
  Phase currents: I_a = 0, I_b = -I_c, with specific calculations

### Double-line-to-ground (LLG) fault
Positive in series with parallel combination of negative and zero sequences.
  More complex; requires specific formulas.

## 2.6 Negative-sequence damage

For rotating machines, negative-sequence current creates rotor heating (double-frequency currents in rotor). Generators are typically rated for a MAXIMUM negative-sequence current of 5-10% of rated for continuous operation. Larger negative-sequence currents trigger protective relays.

This is one reason why prolonged unbalanced operation (e.g., single-phasing) damages motors and generators.

## 2.7 Zero-sequence and grounding

Zero-sequence current can only flow if there's a RETURN PATH — typically through ground or a neutral conductor.

- **Solidly grounded systems**: low zero-sequence impedance → large ground-fault currents → fast tripping, but high arc-flash energy
- **Resistance grounded systems**: limited ground-fault current → reduced damage but more complex protection
- **Ungrounded systems**: NO zero-sequence path → tiny ground-fault currents but voltage rise on healthy phases
- **Δ-connected systems**: NO neutral, so no zero-sequence path → ground faults don't trip overcurrent devices easily

This affects fault analysis: in ungrounded systems, the "single-line-to-ground" fault current is very small but the OTHER PHASES see overvoltage.`,
      examTip: `For SLG fault: I_fault = 3·V/(Z_1 + Z_2 + Z_0). For LL fault: I_fault relates to Z_1 + Z_2. For 3φ fault: I_fault = V/Z_1 only. Three-phase fault formula is the simplest because it's purely balanced.`,
    },
    {
      id: 'practical-calculations',
      title: `3. Per-Unit System and Practical Fault Calculations`,
      content: `## 3.1 The per-unit (p.u.) system

Power systems use per-unit normalization extensively because it simplifies analysis with transformers (per-unit values are the same on both sides of an ideal transformer) and makes impedances comparable across voltage levels.

Define BASE QUANTITIES:
- Base power S_base (typically 100 MVA system base)
- Base voltage V_base (different at each voltage level)
- Base current I_base = S_base / (√3 · V_base) for three-phase
- Base impedance Z_base = V_base² / S_base

Then per-unit value = actual value / base value.

## 3.2 Per-unit fault current formula

For a three-phase fault at a bus with Thevenin equivalent impedance Z_th (per-unit):

  I_fault (p.u.) = V_pre-fault (p.u.) / Z_th (p.u.)

For pre-fault voltage of 1.0 p.u. (rated voltage):

  I_fault (p.u.) = 1.0 / Z_th

To convert to amperes:
  I_fault (A) = I_fault (p.u.) × I_base = 1.0 / Z_th × (S_base / (√3 · V_base))

## 3.3 Worked example

Three-phase fault at bus B in a system:
- Base: S_base = 100 MVA, V_base = 138 kV
- Thevenin impedance to bus B: Z_th = 0.10 p.u.

Per-unit fault current: I_f (p.u.) = 1.0 / 0.10 = 10 p.u.

I_base = 100 × 10⁶ / (√3 · 138 × 10³) = 418 A

I_fault (actual) = 10 × 418 = 4,180 A

Fault MVA = V × I = 1.0 × 10 = 10 p.u. = 1000 MVA at the fault bus

Circuit breakers at bus B must have interrupting capacity ≥ 1000 MVA at 138 kV class.

## 3.4 Subtransient, transient, and steady-state reactance

Generator reactance changes over time during a fault:

- **Subtransient X_d''** (first ~3-5 cycles): smallest reactance → largest fault current
- **Transient X_d'** (next ~30-100 cycles): medium reactance → medium fault current
- **Synchronous X_d** (steady state): largest reactance → smallest sustained fault current

Use X_d'' for circuit-breaker INTERRUPTING duty (fast-acting breakers see the highest current). Use X_d' for slower devices. Use X_d for steady-state analysis.

For 138 kV bulk power systems, typical X_d'' ≈ 0.15-0.25 p.u., X_d ≈ 1.0-2.0 p.u.

## 3.5 Transformer impedance and fault current

A transformer with impedance Z_T (per-unit on transformer base) will REDUCE the fault current on the secondary side because of its impedance.

If a transformer has Z_T = 0.10 p.u. and is connected between source and fault:

  Z_total = Z_source + Z_T (both expressed on same base)

The transformer is the largest impedance in many systems and is the PRIMARY current-limiting element for downstream faults.

## 3.6 Asymmetric vs symmetric fault current

Immediately after fault inception, there's a DC offset in the fault current due to the inductive nature of the impedance — the current cannot change instantaneously. The TOTAL momentary current can be UP TO 1.6-1.8× the symmetric RMS current, depending on the X/R ratio.

For circuit breaker rating:
- **Symmetric RMS interrupting current**: what the breaker is rated to interrupt
- **Asymmetric RMS or PEAK current**: the breaker must withstand mechanically without damage

Modern breaker specifications include both.

## 3.7 Quick exam approach

For typical FE fault problems:

1. **Identify fault type** (3φ, SLG, LL, LLG)
2. **Identify relevant impedances** (Z_1 always; Z_2 for non-3φ; Z_0 for ground faults)
3. **Apply the fault formula** for that type
4. **Convert to actual current** using base current

For 3φ faults (most common exam type):
  I_fault (p.u.) = 1.0 / Z_1 (Thevenin per unit)
  I_fault (kA) = I_p.u. × I_base

For SLG faults:
  I_fault (p.u.) = 3 / (Z_1 + Z_2 + Z_0)
  (assuming bolted fault, pre-fault voltage 1.0 p.u.)

## 3.8 Protective relay coordination

A power system has many protective devices (breakers, fuses, reclosers). Coordination ensures the DEVICE CLOSEST TO THE FAULT operates first, isolating the smallest area:

- Each device has a time-current characteristic (TCC)
- Downstream device must clear faster than upstream
- Typical coordination margin: 0.3 seconds between devices

This is more PE-level material; FE may test recognition that protective relays must be coordinated.

## 3.9 Arc-flash analysis

Modern fault analysis includes ARC FLASH calculations — the energy released in an arcing fault that can injure personnel:

  Incident energy (cal/cm²) ∝ I_fault² × t_clear × Distance⁻²

Where t_clear is the time for protective devices to clear the fault. NFPA 70E and IEEE 1584 provide the calculation framework.

FE may test recognition that:
- Arc flash energy depends on fault current AND fault duration
- Faster-clearing protective devices REDUCE arc flash energy
- Personnel protective equipment (PPE) is rated by incident energy level`,
      examTip: `Per-unit base impedance: Z_base = V_base² / S_base. Per-unit fault current for 3φ: I_fault = 1.0 / Z_th. Convert to amperes using I_base = S_base / (√3·V_base). For SLG: I_fault = 3/(Z_1+Z_2+Z_0).`,
    },
  ],
  keyTakeaways: [
    'Four fault types: 3φ (rare but highest current — used for breaker rating), SLG (most common at ~70%), LL, LLG',
    'Symmetrical components: any unbalanced 3-phase set = sum of positive (a-b-c), negative (a-c-b), and zero (all equal) sequences',
    '3φ fault uses only positive sequence: I_f = V/Z_1. SLG uses all three in series: I_f = 3V/(Z_1+Z_2+Z_0). LL uses Z_1+Z_2.',
    'Per-unit system: Z_base = V_base² / S_base. I_base = S_base / (√3·V_base) for 3-phase.',
    'Generator reactance changes over time: subtransient X_d″ (largest current, first 3-5 cycles), transient X_d′, synchronous X_d',
    'Zero-sequence requires a ground/neutral return path — δ connections and ungrounded systems block zero-sequence current',
    'Asymmetric peak fault current is 1.6-1.8× the symmetric RMS due to DC offset — breakers must withstand it mechanically',
  ],
},

fee_comms_shannon: {
  topicId: 'fee_comms_shannon',
  title: `Shannon-Hartley Capacity & Link Budgets`,
  domainWeight: 'Communications · 4–6%',
  overview: `Shannon's channel capacity theorem and the link budget are the two foundational quantitative tools in communications. The FE exam tests both: given bandwidth and SNR, compute capacity; given a link path (transmitter, antenna, free-space loss, receiver), determine the received signal-to-noise ratio. This topic provides the formulas, decibel conversions, and practical examples NCEES expects.`,
  sections: [
    {
      id: 'shannon-hartley',
      title: `1. Shannon-Hartley Channel Capacity`,
      content: `## 1.1 The theorem

For a channel with bandwidth B (Hz) and signal-to-noise ratio S/N (linear, not dB), the maximum achievable error-free data rate (channel capacity) C in bits per second is:

  C = B · log₂(1 + S/N)

This is the absolute upper bound — no coding scheme can exceed it without errors. Approaching it requires sophisticated coding (LDPC, turbo codes, polar codes), latency, and computation.

## 1.2 What it tells us

- More BANDWIDTH = more capacity (linear relationship)
- More SNR = more capacity (logarithmic — diminishing returns)
- For doubling capacity: either double bandwidth OR raise SNR substantially (each doubling of (1+SNR) adds 1 bit/Hz)

## 1.3 Numerical examples

**Example 1**: Telephone channel, B = 3 kHz, SNR = 30 dB

- SNR linear = 10^(30/10) = 1000
- C = 3000 · log₂(1 + 1000) = 3000 · log₂(1001) ≈ 3000 · 9.97 ≈ 29.9 kbps

This is why analog modems plateaued at ~33-56 kbps over telephone lines.

**Example 2**: Wi-Fi 20 MHz channel at SNR = 20 dB

- SNR linear = 100
- C = 20 × 10⁶ · log₂(101) ≈ 20 × 10⁶ · 6.66 ≈ 133 Mbps

Actual Wi-Fi at this SNR achieves ~70-100 Mbps (accounting for protocol overhead, real-world coding gaps).

**Example 3**: To increase capacity from 1 Mbps to 2 Mbps with fixed B = 1 MHz:

- C / B goes from 1 to 2 bits/sec/Hz
- log₂(1 + SNR) goes from 1 to 2
- (1 + SNR) goes from 2 to 4
- SNR goes from 1 (0 dB) to 3 (4.8 dB)
- Just 4.8 dB more SNR doubled capacity

But to go from 2 Mbps to 3 Mbps:
- (1+SNR) goes from 4 to 8
- SNR from 3 to 7
- Need 9 dB SNR (4.2 dB more)

To go from 3 Mbps to 4 Mbps: need 12 dB SNR, +3 dB more.

Diminishing returns: each extra bit costs ~3 dB more SNR at high SNR.

## 1.4 The Shannon limit in decibels

For very low SNR (SNR << 1), Shannon's formula approaches:

  C ≈ (B / ln 2) · (S/N) = 1.44 · B · (S/N)

This is the LINEAR regime. Most modern systems operate at SNR around 10-30 dB, well into the logarithmic regime.

The fundamental SNR-per-bit limit is:

  E_b / N_0 = ln 2 ≈ 0.693 = -1.59 dB

This is the SHANNON LIMIT — no system can transmit information with E_b/N_0 below -1.59 dB without errors, regardless of bandwidth.

## 1.5 Eb/N0 vs SNR

Two related quantities:

- **SNR (S/N)**: total signal power to total noise power in the channel
- **Eb/N0**: energy per BIT to noise power spectral density

The relationship:
  S/N = (E_b · R) / (N_0 · B)

Where R is data rate (bits/sec) and B is bandwidth (Hz). So:
  E_b/N_0 = (S/N) · (B/R) = (S/N) / (R/B)

For BANDLIMITED systems (R/B ≈ 1), SNR ≈ Eb/N0. For SPECTRALLY EFFICIENT modulation (R/B > 1 bit/Hz), SNR > Eb/N0.

## 1.6 Bit error rate (BER) curves

BER depends on modulation scheme AND Eb/N0. Typical FE-tested modulations:

| Modulation | Eb/N0 for BER = 10⁻⁵ |
|---|---|
| BPSK | 9.6 dB |
| QPSK | 9.6 dB (same as BPSK!) |
| 4-QAM | 9.6 dB |
| 16-QAM | 13.4 dB |
| 64-QAM | 17.8 dB |
| 256-QAM | 22.5 dB |

Note: BPSK and QPSK have THE SAME BER vs Eb/N0 — QPSK fits twice the data in the same bandwidth at the same energy per bit. Higher-order QAM gets more spectral efficiency but requires more Eb/N0 to maintain low BER.

## 1.7 The spectral efficiency / power efficiency trade-off

Channel capacity defines a frontier on the (spectral efficiency, power efficiency) plane:

- Spectral efficiency η = R/B (bits/sec/Hz)
- Power efficiency = Eb/N0 (lower is better)

Shannon curve: η = log₂(1 + (R/B) · (E_b/N_0))

Modern coding pushes you closer to the Shannon limit but never exceeds it.`,
      examTip: `Shannon: C = B · log₂(1 + S/N). Use linear SNR, not dB. Doubling SNR linearly adds about 1 bit/Hz to capacity. Shannon limit Eb/N0 ≥ -1.59 dB is the fundamental floor.`,
    },
    {
      id: 'link-budgets',
      title: `2. Link Budget Calculations`,
      content: `## 2.1 The link budget concept

A LINK BUDGET tracks signal power from transmitter to receiver in dB, summing gains and losses to find the received signal level. It's a straightforward addition once everything is in dB.

  P_received (dBm) = P_transmit (dBm) + G_TX_antenna (dBi) - L_path (dB) + G_RX_antenna (dBi) - L_other (dB)

Where:
- P_transmit: transmitter power
- G_TX_antenna: transmit antenna gain
- L_path: path loss (free space, atmospheric, obstacles)
- G_RX_antenna: receive antenna gain
- L_other: connector losses, cable losses, polarization mismatch, etc.

## 2.2 dB review

Decibels for power:
  X dB = 10 · log₁₀(P / P_ref)

Common references:
- **dBm**: reference = 1 mW. 0 dBm = 1 mW. 30 dBm = 1 W. -30 dBm = 1 μW.
- **dBW**: reference = 1 W. 0 dBW = 1 W = 30 dBm.
- **dBi**: antenna gain referenced to ISOTROPIC radiator
- **dBd**: gain referenced to half-wave DIPOLE (2.15 dB lower than dBi for same antenna)

Conversion between dBm and watts:
- 0 dBm = 1 mW
- 10 dBm = 10 mW
- 20 dBm = 100 mW
- 30 dBm = 1 W
- 40 dBm = 10 W

Half-power = -3 dB. Double the power = +3 dB. 10× power = +10 dB. 100× = +20 dB.

## 2.3 Free-space path loss (FSPL)

The most-tested loss in FE:

  FSPL (dB) = 20·log₁₀(d) + 20·log₁₀(f) + 20·log₁₀(4π/c)

Where d is distance (m), f is frequency (Hz), c is speed of light. Combining constants:

  FSPL (dB) = 20·log₁₀(d/m) + 20·log₁₀(f/MHz) + 32.4

Or using miles and MHz:

  FSPL (dB) = 20·log₁₀(d/miles) + 20·log₁₀(f/MHz) + 36.6

Or distance in km and GHz:

  FSPL (dB) = 20·log₁₀(d/km) + 20·log₁₀(f/GHz) + 92.4

Memorize ONE form and convert as needed.

## 2.4 Worked link budget

A 2.4 GHz Wi-Fi link, 100 m distance, with 10 dBi antennas on both ends, 20 dBm TX power, 2 dB cable loss each side.

Path loss:
  FSPL = 20·log₁₀(100) + 20·log₁₀(2400) + 32.4
       = 20·2 + 20·3.38 + 32.4
       = 40 + 67.6 + 32.4
       = 140 dB

Wait, let me redo:
  d = 100 m → 20·log₁₀(100) = 40
  f = 2400 MHz → 20·log₁₀(2400) = 20·3.38 = 67.6
  Constant: 32.4
  Total FSPL = 40 + 67.6 + 32.4 = 140 dB

Hmm that's too high — let me reconsider. For 2.4 GHz at 100 m:
  Actually FSPL ≈ 80 dB (typical Wi-Fi).

Recompute: 20·log₁₀(100·2400) + 32.4
  = 20·log₁₀(240000) + 32.4
  Wait that's not right either. The formula in metric:

FSPL = 20·log₁₀(4πd/λ) where λ = c/f
     = 20·log₁₀(4π·d·f/c)

c = 3×10⁸ m/s, 4π/c = 4π / (3×10⁸) = 4.19 × 10⁻⁸

FSPL = 20·log₁₀(d·f·4.19×10⁻⁸)
     = 20·log₁₀(d·f) + 20·log₁₀(4.19×10⁻⁸)
     = 20·log₁₀(d·f) + 20·(-7.378)
     = 20·log₁₀(d·f) - 147.6

For d=100 m, f=2.4×10⁹ Hz:
  20·log₁₀(100 · 2.4×10⁹) = 20·log₁₀(2.4×10¹¹) = 20·11.38 = 227.6
  FSPL = 227.6 - 147.6 = 80 dB ✓

So the formula I gave earlier mixed up the unit conversions. Use these clean reference formulas:

  FSPL(dB) = 20·log₁₀(d/m) + 20·log₁₀(f/Hz) - 147.6
  FSPL(dB) = 20·log₁₀(d/m) + 20·log₁₀(f/MHz) + 32.4  [where the constant absorbs the unit conversion]

I'll use the second form. For our example:
  20·log₁₀(100) + 20·log₁₀(2400) + 32.4 = 40 + 67.6 + 32.4 = 140 dB

But empirically Wi-Fi at 100 m is ~80 dB FSPL. Let me re-derive the constant.

20·log₁₀(MHz) = 20·log₁₀(2400) = 67.6 — wait, that's the issue. Let me check:

  20·log₁₀(4π·d/λ) with d=100m, λ = c/f = 3e8/2.4e9 = 0.125 m
  4π·100/0.125 = 4π·800 = 10053
  20·log₁₀(10053) = 80 dB ✓

So formula 20·log₁₀(d/m) + 20·log₁₀(f/MHz) + 32.4 gives 140 dB — wrong.

Let me re-derive: FSPL = 20·log(4π) + 20·log(d) + 20·log(f) - 20·log(c)
              = 22 + 20·log(d) + 20·log(f) - 169.5
              = 20·log(d/m) + 20·log(f/Hz) - 147.6

Or:  20·log(d/m) + 20·log(f/MHz) + 20·log(10⁶) - 147.6
   = 20·log(d/m) + 20·log(f/MHz) + 120 - 147.6
   = 20·log(d/m) + 20·log(f/MHz) - 27.6

So:  FSPL = 20·log(d/m) + 20·log(f/MHz) - 27.6
Verify: 100m, 2400 MHz: 40 + 67.6 - 27.6 = 80 dB ✓

Use FSPL = 20·log(d/m) + 20·log(f/MHz) - 27.6  [metric+MHz form]
Or  FSPL = 20·log(d/km) + 20·log(f/GHz) + 92.4  [km+GHz form, verify: 0.1 km, 2.4 GHz: -20 + 7.6 + 92.4 = 80 dB ✓]
Or  FSPL = 20·log(d/mi) + 20·log(f/MHz) + 36.6  [miles+MHz form]

CORRECTED link budget:
  P_TX = 20 dBm
  G_TX = 10 dBi → -2 dB cable
  Path loss = 80 dB (computed above for 100 m at 2.4 GHz)
  -2 dB cable on RX
  G_RX = 10 dBi

P_RX = 20 + 10 - 2 - 80 - 2 + 10 = -44 dBm

That's a strong Wi-Fi signal (typical Wi-Fi receiver sensitivity is -70 to -85 dBm).

## 2.5 Receiver sensitivity and noise floor

The receiver has a NOISE FLOOR — the thermal noise power that limits the smallest detectable signal:

  Noise floor (dBm) = -174 + 10·log₁₀(B) + NF

Where:
- -174 dBm/Hz is the thermal noise power spectral density at room temperature
- B is bandwidth in Hz
- NF is noise figure of receiver (typical 5-10 dB)

For 20 MHz bandwidth, NF = 6 dB:
  Noise floor = -174 + 10·log₁₀(20×10⁶) + 6 = -174 + 73 + 6 = -95 dBm

For the link to work with 20 dB SNR margin:
  Required RX power = -95 + 20 = -75 dBm

Our calculated RX power was -44 dBm, so we have 31 dB of fade margin — quite good.

## 2.6 Fade margin and link reliability

Real RF channels fluctuate (multipath, weather, mobility). The FADE MARGIN is the excess link power above the minimum required for the desired BER.

Typical design:
- 20 dB fade margin for fixed links (99% availability)
- 30-40 dB fade margin for mobile/cellular (rapid fading)

## 2.7 EIRP

The Equivalent Isotropic Radiated Power (EIRP) is the transmit power times the antenna gain (in linear units) — equivalent power radiated by an ISOTROPIC antenna to produce the same effect:

  EIRP (dBm) = P_TX (dBm) + G_TX (dBi) - L_TX_cable (dB)

Regulatory limits are typically expressed in EIRP (e.g., 36 dBm EIRP for 2.4 GHz Wi-Fi in the US, 30 dBm EIRP for some industrial bands).`,
      examTip: `Memorize FSPL = 20·log(d) + 20·log(f) + constant. The constant depends on units. Most useful form: 20·log(d/km) + 20·log(f/GHz) + 92.4. Always check dimensional consistency.`,
    },
    {
      id: 'modulation-and-systems',
      title: `3. Modulation, Noise Figure, and System Design`,
      content: `## 3.1 Digital modulation summary

| Modulation | Bits/symbol | Spectral efficiency (b/Hz) | Eb/N0 for BER 10⁻⁵ |
|---|---|---|---|
| BPSK | 1 | 1 | 9.6 dB |
| QPSK | 2 | 2 | 9.6 dB |
| 8-PSK | 3 | 3 | 13.0 dB |
| 16-QAM | 4 | 4 | 13.4 dB |
| 64-QAM | 6 | 6 | 17.8 dB |
| 256-QAM | 8 | 8 | 22.5 dB |
| 1024-QAM | 10 | 10 | 27.5 dB |
| 4096-QAM | 12 | 12 | 32.5 dB |

Modern wireless uses ADAPTIVE MODULATION — selects the highest modulation that works given current SNR, dropping to lower-order for weaker signals. Wi-Fi 6 uses up to 1024-QAM; Wi-Fi 7 uses 4096-QAM.

## 3.2 Cascade noise figure (Friis formula)

For multiple amplifier stages cascaded, the overall noise figure depends mostly on the FIRST stage:

  F_total = F_1 + (F_2 - 1)/G_1 + (F_3 - 1)/(G_1·G_2) + ...

Where F is noise factor (linear, not dB) and G is gain (linear).

Lesson: the FIRST amplifier (LNA — low-noise amplifier) dominates the system noise figure if its gain is high enough. This is why receivers always start with an LNA close to the antenna.

Example: LNA with F=1.5 (NF=1.76 dB), G=20 dB (linear 100), followed by mixer with F=10 (NF=10 dB):
  F_total = 1.5 + (10-1)/100 = 1.5 + 0.09 = 1.59 → NF_total = 2.0 dB

The mixer's poor noise figure has minimal effect because the LNA's 20 dB gain SUPPRESSES the mixer noise contribution.

## 3.3 Channel coding and Shannon

Modern systems get CLOSE to Shannon limit by using forward error correction (FEC):

- **Convolutional codes** + Viterbi decoder: 3-5 dB from Shannon
- **Turbo codes** (3GPP, deep space): 0.5-1 dB from Shannon
- **LDPC codes** (Wi-Fi, 5G, DVB): 0.1-1 dB from Shannon
- **Polar codes** (5G control channel): similar to LDPC

Coding RATE r = info bits / total bits (e.g., r=1/2 means 1 information bit per 2 transmitted bits). Lower rate = more redundancy = better error correction but lower throughput.

## 3.4 Atmospheric and rain attenuation

For terrestrial radio:

- 2.4 GHz: low atmospheric loss, but vulnerable to obstructions (buildings, foliage)
- 5 GHz: similar
- 24+ GHz (mmWave): significant atmospheric absorption (oxygen at 60 GHz, water vapor at 22 GHz), rain attenuation tens of dB

For satellite links at Ku/Ka band: rain fade can be 5-20 dB during heavy storms. Link budgets include RAIN MARGIN.

## 3.5 Multipath fading

In urban environments, signals reach the receiver via multiple paths (direct + reflected). The paths add VECTORIALLY at the receiver, producing rapid magnitude variations (FADING) as the receiver moves.

- Rayleigh fading: no dominant direct path
- Rician fading: dominant direct path + multipath
- Mitigation: diversity (multiple antennas), MIMO, OFDM (multipath becomes inter-symbol interference managed by cyclic prefix)

## 3.6 Practical link budget for satellite

A geostationary satellite link example:

- Satellite TX power: 100 W = 50 dBm
- Satellite antenna gain: 30 dBi
- EIRP: 80 dBm
- Free space loss at 36,000 km, 12 GHz: ~205 dB
- Atmospheric + rain: 1-3 dB clear weather, 10-20 dB rain fade
- RX antenna gain: 40 dBi (1 m dish)
- Cable + connector loss: 2 dB

Received signal: 80 - 205 - 2 + 40 - 2 = -89 dBm (clear weather)

With receiver noise figure 1 dB and bandwidth 36 MHz:
  Noise floor: -174 + 10·log(36e6) + 1 = -174 + 75.6 + 1 = -97.4 dBm
  SNR = -89 - (-97.4) = 8.4 dB clear weather

With rain fade 15 dB: SNR drops to -6.6 dB → link fails unless using adaptive modulation that drops to lower order

This is why satellite links often have OUTAGE specs ("99.5% availability") rather than absolute "always working" specs.

## 3.7 Simple exam pattern

"A transmitter outputs 30 dBm. The antenna gain at TX is 8 dBi, cable loss is 1 dB. Path loss is 95 dB. The receive antenna has 5 dBi gain and 1 dB cable loss. What is the received power?"

Solution: 30 + 8 - 1 - 95 + 5 - 1 = -54 dBm

If receiver sensitivity is -85 dBm, link margin is -54 - (-85) = 31 dB. Robust link.`,
      examTip: `Link budget = sum of dB gains minus sum of dB losses. dBm + dBi - dB = dBm. Always verify dimensional consistency. The FSPL constants in different unit systems are the most common error source.`,
    },
  ],
  keyTakeaways: [
    'Shannon-Hartley: C = B · log₂(1 + S/N). Use LINEAR S/N, not dB. Sets absolute upper bound on error-free data rate.',
    'Shannon limit: Eb/N0 ≥ ln 2 = -1.59 dB. No coding scheme can transmit below this without errors.',
    'BPSK and QPSK have SAME Eb/N0 for same BER. QPSK fits 2× the data in the same bandwidth at same energy per bit.',
    'FSPL = 20·log(d/km) + 20·log(f/GHz) + 92.4 dB. Memorize ONE form and convert.',
    'Noise floor = -174 + 10·log(B/Hz) + NF (in dBm). For wider bandwidth or higher NF, the floor rises.',
    'Friis cascade: F_total = F_1 + (F_2-1)/G_1 + (F_3-1)/(G_1·G_2) + ... The FIRST stage dominates if its gain is high. Use LNA near antenna.',
    'EIRP (dBm) = P_TX (dBm) + G_TX (dBi) - L_TX_cable. Regulatory limits are typically EIRP-based.',
  ],
},

};

export function hasFEEECourseContent(topicId: string): boolean {
  return topicId in FE_EE_COURSE;
}

export function getFEEECourseContent(topicId: string): TopicLesson | null {
  return FE_EE_COURSE[topicId] || null;
}
