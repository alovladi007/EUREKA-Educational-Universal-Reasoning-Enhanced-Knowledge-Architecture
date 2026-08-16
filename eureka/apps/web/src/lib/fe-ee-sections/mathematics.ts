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
- **$\\sin (2x) = 2 \\sin  x \\cos  x$** — appears in instantaneous power, p(t) = VI cos(theta) - VI cos(2 omega t - theta)
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
  | Distance from point to line Ax+By+C=0 | \\| $Ax_{0}+By_{0}+C$ | $/\\sqrt{A^{2}+B^{2}}$ |
  
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
| $\\ln (x)$ | 1/x |
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

$$V^2[(R_s + R_L)^2 - R_L x 2(R_s + R_L)] = V^2 (R_s + R_L)[(R_s + R_L) - 2R_L]$$

Setting the bracket to zero: R_s + R_L - 2R_L = 0, so **$R_L = R_s$**.

That is the maximum power transfer theorem derived rather than memorised, and the calculus route is what an exam question means when it presents it as an optimisation problem.

## 3.4 Critical points and the second derivative

$$f(x) = x^3 - 6x^2 + 9x + 2$$.

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
     $$x = \\pm 1$$.
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
  
  Differentiate with respect to R_L using the quotient rule, with u = V²R_L and
  $$v = (R_s + R_L)^{2}$$:
  
  $$dP/dR_L = [V^{2}(R_s + R_L)^{2} - V^{2}R_L\\cdot 2(R_s + R_L)] / (R_s + R_L)^{4}$$
  
  Cancel one factor of (R_s + R_L) from every term:
  
  $$dP/dR_L = V^{2}[(R_s + R_L) - 2R_L] / (R_s + R_L)^{3} = V^{2}(R_s - R_L)/(R_s + R_L)^{3}$$
  
  Setting the numerator to zero gives **$R_L = R_s$**, and substituting back gives
  $$P_{\\max} = V^{2}R_s/(2R_s)^{2} = V^{2}/(4R_s)$$.
  
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
**$500\\ \\mathrm{W} at 2\\theta = 90^\\circ$**, i.e. **$\\theta = 45^\\circ$**. Differentiating directly gives
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
| 1/x | ln|x| + C |
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
  | $\\int (1/x) dx$ | ln\\|x\\| + C |
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
  $$V_{rms} = V_m/\\sqrt{3} \\approx 0.577 V_m$$.
  
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
$$\\tfrac{1}{2} or 2$$.

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
  | $\\sin  \\omega t or \\cos  \\omega t$ | A cos ωt + B sin ωt (**both terms**) |
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
  | Dot **A**·**B** | scalar | \\|A\\|\\|B\\| $\\cos  \\theta$ | perpendicular |
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
