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
      content: `## 1.1 Ohm's Law

**V = I·R** relates voltage, current, and resistance.

Three equivalent forms for power: **P = V·I = I²R = V²/R**

## 1.2 Kirchhoff's Current Law (KCL)

**The sum of currents entering a node equals the sum leaving:**

**ΣI_in = ΣI_out** or equivalently **ΣI = 0** (with sign convention)

KCL is conservation of charge — charge cannot accumulate at a node.

## 1.3 Kirchhoff's Voltage Law (KVL)

**The sum of voltage rises around any closed loop equals zero:**

**ΣV = 0** (around any closed loop)

KVL is conservation of energy — energy gained equals energy lost around any path.

### Systematic Approach

For any DC circuit:
1. **Label all nodes** and assign current directions (arbitrary — negative result means opposite)
2. **Apply KCL** at each node (n-1 independent equations for n nodes)
3. **Apply KVL** around each independent loop
4. **Apply Ohm's law** (V = IR) to relate voltages and currents
5. **Solve** the system of equations`,
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
| Need current through one element | Thevenin often fastest |`,
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
| Application | Band-pass filter | Band-reject filter |`,
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

For balanced impedances: **Z_Δ = 3 · Z_Y** (or Z_Y = Z_Δ/3)`,
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
- **Inductor current cannot change instantly**: i_L(0⁺) = i_L(0⁻)`,
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

  fee_3phase_power: { topicId: 'fee_3phase_power', title: 'Three-Phase Power Systems', domainWeight: 'Power Systems · 4–6%', overview: 'Covers three-phase AC systems, transformers, per-unit analysis, transmission lines, power factor correction, and rotating machines.', sections: [{ id: 'fee_3phase_power_main', title: 'Three-Phase Systems', content: `Three-phase AC power is standard in industry offering constant power, efficient transmission, and compact motors. Three voltage sources 120 degrees apart. For balanced loads: Va+Vb+Vc = 0. Wye (Y): V_L = sqrt(3)·V_ph; Delta: I_L = sqrt(3)·I_ph. Power: P = sqrt(3)·V_L·I_L·cos(φ). Per-phase analysis simplifies balanced systems. Unbalanced loads analyzed with symmetrical components: zero, positive, negative sequences. Y-to-delta conversion: Z_delta = 3·Z_wye.`, examTip: 'Key formulas:\nV_L = sqrt(3)·V_ph (wye)\nI_L = sqrt(3)·I_ph (delta)\nP = sqrt(3)·V_L·I_L·cos(φ)\nZ_delta = 3·Z_wye' }], keyTakeaways: ['Y: V_L = sqrt(3)·V_ph; Delta: I_L = sqrt(3)·I_ph', 'Balanced: Va+Vb+Vc = 0; P = sqrt(3)·V_L·I_L·cos(φ)', 'Per-phase analysis for balanced; symmetrical components for unbalanced', 'Z_delta = 3·Z_wye for balanced conversion'] },

  fee_transformers: { topicId: 'fee_transformers', title: 'Transformers: Equivalent Circuit & Efficiency', domainWeight: 'Power Systems · 4–6%', overview: 'Covers three-phase AC systems, transformers, per-unit analysis, transmission lines, power factor correction, and rotating machines.', sections: [{ id: 'fee_transformers_main', title: 'Transformers', content: `Transformers transfer power between circuits with different voltage levels. Ideal: Vs/Vp = Ns/Np = n (turns ratio); Ip/Is = n. Real transformers include core loss (hysteresis + eddy current) and copper loss. Voltage regulation VR = (Vnl - Vfl)/Vfl x 100%. Efficiency η = Pout/(Pout+Pcore+Pcopper), typically 95-99%. Open-circuit test measures core losses; short-circuit test measures copper losses.`, examTip: 'Key formulas:\nIdeal: Vs = n·Vp, Is = Ip/n\nVR = (Vnl-Vfl)/Vfl x 100%\nη = Pout/(Pout+Pcore+Pcopper)\nZpu = Zactual/Zbase' }], keyTakeaways: ['Ideal: Vs/Vp = Ns/Np = n; Is/Ip = 1/n', 'Core loss (no-load), copper loss (load dependent)', 'Voltage regulation = (Vnl-Vfl)/Vfl; desirable < 5%', 'Efficiency 95-99% at rated load'] },

  fee_per_unit: { topicId: 'fee_per_unit', title: 'Per-Unit System for Simplified Analysis', domainWeight: 'Power Systems · 4–6%', overview: 'Covers three-phase AC systems, transformers, per-unit analysis, transmission lines, power factor correction, and rotating machines.', sections: [{ id: 'fee_per_unit_main', title: 'Per-Unit System', content: `The per-unit (pu) system normalizes voltages, currents, impedances relative to chosen base values. Choose Sbase (e.g., 100 MVA) and Vbase at one point; all other bases follow. Zbase = Vbase^2/Sbase. Per-unit: Vpu = Vactual/Vbase; Zpu = Zactual/Zbase. Impedance Zpu is independent of voltage level through transformers. Advantages: impedances approximately constant regardless of base voltage; transformers appear as ideal (n=1); numbers cluster near 1.0 making errors obvious.`, examTip: 'Key formulas:\nZbase = Vbase^2/Sbase\nVpu = Vactual/Vbase\nIpu = Iactual/Ibase\nPpu = Pactual/Sbase' }], keyTakeaways: ['Choose Sbase and Vbase at one location; compute Vbase at others via turns ratio', 'Zbase = Vbase^2/Sbase; Zpu = Zactual/Zbase', 'Zpu same across transformer ideal equivalents', 'Sbase constant throughout system'] },

  fee_tx_lines: { topicId: 'fee_tx_lines', title: 'Transmission Lines: Models and Parameters', domainWeight: 'Power Systems · 4–6%', overview: 'Covers three-phase AC systems, transformers, per-unit analysis, transmission lines, power factor correction, and rotating machines.', sections: [{ id: 'fee_tx_lines_main', title: 'Transmission Lines', content: `Transmission lines carry power over long distances; distributed parameters (R, L, C, G per unit length) significantly affect voltage drop and losses. Short line (<80 km): lumped series impedance. Medium line (80-240 km): pi or T equivalent. Long line (>240 km): distributed parameter model. Surge impedance Z₀ = sqrt(Z/Y) approximately sqrt(L/C), typically 200-400 ohm. Natural power Pnl = V^2/Z₀. Voltage regulation depends on load, power factor, and impedance. For short line: ΔV approximately (R·P + X·Q)/V. Ferranti effect: light load causes voltage rise due to charging current.`, examTip: 'Key formulas:\nZ₀ = sqrt(Z/Y)\nPnl = V^2/Z₀\nShort line ΔV approximately (RP+XQ)/V\nMedium line: pi model' }], keyTakeaways: ['Series impedance Z = R+jωL; shunt admittance Y = G+jωC per unit length', 'Short line: lumped; medium: pi/T; long: hyperbolic functions', 'Surge impedance Z₀ = sqrt(Z/Y); natural power Pnl = V^2/Z₀', 'Voltage drop depends on both P and Q'] },

  fee_pf_correction: { topicId: 'fee_pf_correction', title: 'Power Factor Correction', domainWeight: 'Power Systems · 4–6%', overview: 'Covers three-phase AC systems, transformers, per-unit analysis, transmission lines, power factor correction, and rotating machines.', sections: [{ id: 'fee_pf_correction_main', title: 'Power Factor Correction', content: `Power factor PF = cos(θ) = P/S measures the portion of apparent power actually transferred as real power. Inductive loads (motors, transformers) cause lagging current; utilities penalize PF < 0.95. Correction adds shunt capacitors: Qc = P(tan(θ_old) - tan(θ_new)). The required capacitor value C = Qc/(ω·V^2). Capacitor banks are switched to maintain desired PF as load varies. Over-correction (leading PF) can cause voltage rise and resonance problems. Synchronous condensers (synchronous motors at no-load) provide continuous reactive power support. Power factor correction reduces apparent power drawn from utility, decreasing I^2R losses in conductors and freeing transformer capacity for additional real power loads.`, examTip: 'Key formulas:\nPF = cos(θ) = P/S\nQc = P(tan(θ_old)-tan(θ_new))\nSlip s = (Ns-N)/Ns\nNs = 120·f/P (pole pairs)' }], keyTakeaways: ['PF = cos(θ) = P/S; inductive loads lag, capacitive lead', 'Capacitor for correction: Qc = P(tan(θ_old)-tan(θ_new))', 'Over-correction causes voltage rise and potential resonance', 'Synchronous condensers provide continuous reactive power support'] },

  fee_motors: { topicId: 'fee_motors', title: 'Rotating Machines: Motors & Generators', domainWeight: 'Power Systems · 4–6%', overview: 'Covers three-phase AC systems, transformers, per-unit analysis, transmission lines, power factor correction, and rotating machines.', sections: [{ id: 'fee_motors_main', title: 'Rotating Machines', content: `Induction motors are the largest industrial loads: slip s = (Ns - N)/Ns where Ns = 120f/P is synchronous speed (P = number of poles), N is actual speed. At no-load, slip is nearly zero; at full load, typically 2-5%. Starting torque is high but inrush current can be 5-8x rated; soft starters and variable frequency drives (VFDs) limit inrush. Synchronous motors run at synchronous speed always; field current controls power factor — over-excited synchronous motors can provide reactive power (act as capacitors). DC motors offer precise speed control via armature voltage and torque control via field current. Motor efficiency η = P_mech/P_elec; losses include copper (I^2R in windings), core (hysteresis + eddy current in iron), friction and windage. Motor selection considers load torque profile, speed range, efficiency, and starting requirements.`, examTip: 'Key formulas:\nSlip s = (Ns-N)/Ns\nNs = 120·f/P\nMotor efficiency η = P_mech/P_elec\nTorque proportional to I·B·A' }], keyTakeaways: ['Induction motor: slip s = (Ns-N)/Ns; Ns = 120f/P', 'Synchronous motor: speed = Ns always; field current sets power factor', 'Motor losses: copper, core, friction/windage', 'VFDs control speed and limit inrush current'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 11 — ELECTROMAGNETICS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_electrostatics: { topicId: 'fee_electrostatics', title: "Electrostatics: Coulomb's Law & Gauss's Law", domainWeight: 'Electromagnetics · 4–6%', overview: 'Covers electric and magnetic fields, Maxwell\'s equations, wave propagation, and transmission line theory.', sections: [{ id: 'fee_electrostatics_main', title: 'Electrostatics', content: `Coulomb's law: F = kQ₁Q₂/r^2 where k = 8.99x10^9. Electric field E = F/q. Gauss's law: closed surface integral of E·dA = Qenc/ε₀. Powerful for symmetric geometries: infinite sheet E = σ/(2ε₀), infinite line E = λ/(2πε₀r), sphere E = kQ/r^2 outside. Capacitance C = Q/V; parallel plate C = ε₀εrA/d. Energy stored U = (1/2)CV^2. Potential V = kQ/r; path-independent in conservative fields.`, examTip: 'Key formulas:\nF = kQ₁Q₂/r^2\nGauss: closed integral E·dA = Qenc/ε₀\nC = ε₀εrA/d\nU = (1/2)CV^2' }], keyTakeaways: ["Coulomb's law: F = kQ₁Q₂/r^2; electric field E = F/q", "Gauss's law powerful for symmetric charge distributions", 'Potential V = kQ/r; path-independent', 'Capacitance C = ε₀εrA/d; energy U = (1/2)CV^2'] },

  fee_magnetostatics: { topicId: 'fee_magnetostatics', title: "Magnetostatics: Biot-Savart & Ampere's Law", domainWeight: 'Electromagnetics · 4–6%', overview: 'Covers electric and magnetic fields, Maxwell\'s equations, wave propagation, and transmission line theory.', sections: [{ id: 'fee_magnetostatics_main', title: 'Magnetostatics', content: `Ampere's law: closed integral B·dl = μ₀Ienc. Long straight wire: B = μ₀I/(2πr). Solenoid: B = μ₀nI inside. Magnetic flux Φ = integral B·dA (Weber). Inductance L = Φ/I; energy U = (1/2)LI^2. Force on current-carrying wire F = IL x B. Magnetic circuit analogy: Φ = mmf/reluctance = nI/R_m. Right-hand rule: thumb in current direction, fingers curl in field direction.`, examTip: 'Key formulas:\nAmpere: closed integral B·dl = μ₀Ienc\nLong wire: B = μ₀I/(2πr)\nSolenoid: B = μ₀nI\nL = Φ/I, U = (1/2)LI^2' }], keyTakeaways: ["Ampere's law for symmetric current distributions", 'Long wire: B = μ₀I/(2πr); solenoid: B = μ₀nI', 'Magnetic flux Φ = integral B·dA; inductance L = Φ/I', 'Force on wire: F = IL x B; energy U = (1/2)LI^2'] },

  fee_maxwell: { topicId: 'fee_maxwell', title: "Maxwell's Equations", domainWeight: 'Electromagnetics · 4–6%', overview: 'Covers electric and magnetic fields, Maxwell\'s equations, wave propagation, and transmission line theory.', sections: [{ id: 'fee_maxwell_main', title: "Maxwell's Equations", content: `Maxwell's four equations unify electricity and magnetism. Gauss's law: div E = ρ/ε₀. No magnetic monopoles: div B = 0. Faraday's law: curl E = -∂B/∂t (changing B induces E). Ampere-Maxwell: curl B = μ₀(J + ε₀∂E/∂t) includes displacement current enabling wave propagation. In free space, wave equation: del^2 E = μ₀ε₀ ∂^2E/∂t^2. Wave velocity v = 1/sqrt(μ₀ε₀) = c approximately 3x10^8 m/s. In materials v = c/sqrt(μrεr).`, examTip: 'Key formulas:\ndiv E = ρ/ε₀\ndiv B = 0\ncurl E = -∂B/∂t\ncurl B = μ₀J + μ₀ε₀∂E/∂t\nWave speed: v = 1/sqrt(με)' }], keyTakeaways: ["Gauss: div E = ρ/ε₀ relates electric field to charge", 'No monopoles: div B = 0', "Faraday: curl E = -∂B/∂t relates changing B to induced E", 'Ampere-Maxwell includes displacement current enabling wave propagation'] },

  fee_wave_prop: { topicId: 'fee_wave_prop', title: 'Wave Propagation and Plane Waves', domainWeight: 'Electromagnetics · 4–6%', overview: 'Covers electric and magnetic fields, Maxwell\'s equations, wave propagation, and transmission line theory.', sections: [{ id: 'fee_wave_prop_main', title: 'Wave Propagation', content: `Plane waves have E and B perpendicular to propagation and to each other. Wave number k = 2π/λ = ω/v. Wavelength λ = v/f; in vacuum λ₀ = c/f. Skin depth δ = 1/sqrt(πfμσ) describes field penetration into conductors; at depth δ, amplitude decays by e^(-1). Copper at 60 Hz: δ approximately 8.5 mm. Poynting vector S = E x H represents power flow per unit area (W/m^2). Average power Pave = (1/2)|E||H|cos(φ).`, examTip: 'Key formulas:\nk = ω/v = 2π/λ\nλ = c/f in vacuum\nδ = 1/sqrt(πfμσ)\nS = E x H' }], keyTakeaways: ['Plane wave: E and B perpendicular to each other and propagation direction', 'Wave number k = 2π/λ = ω/v; wavelength λ = v/f', 'Skin depth δ = 1/sqrt(πfμσ); field decays as e^(-z/δ)', 'Poynting vector S = E x H; average power = (1/2)|E||H|cos(φ)'] },

  fee_em_tx_lines: { topicId: 'fee_em_tx_lines', title: 'EM Transmission Lines: Impedance & Reflections', domainWeight: 'Electromagnetics · 4–6%', overview: 'Covers electric and magnetic fields, Maxwell\'s equations, wave propagation, and transmission line theory.', sections: [{ id: 'fee_em_tx_lines_main', title: 'Transmission Lines', content: `Transmission lines carry signals; characteristic impedance Z₀ = sqrt(L/C), typically 50 ohm (coax), 75 ohm (TV), 300 ohm (open wire). Reflection coefficient Γ = (ZL - Z₀)/(ZL + Z₀). Matched load ZL = Z₀: Γ = 0 (no reflection). Open circuit: Γ = 1. Short circuit: Γ = -1. VSWR = (1+|Γ|)/(1-|Γ|); VSWR = 1 is perfect match. Propagation velocity vp = c/sqrt(εrμr).`, examTip: 'Key formulas:\nZ₀ = sqrt(L/C)\nΓ = (ZL-Z₀)/(ZL+Z₀)\nVSWR = (1+|Γ|)/(1-|Γ|)\nvp = c/sqrt(εrμr)' }], keyTakeaways: ['Characteristic impedance Z₀ = sqrt(L/C); typical 50 ohm (coax)', 'Reflection: Γ = (ZL-Z₀)/(ZL+Z₀); matched = 0, open = +1, short = -1', 'VSWR = (1+|Γ|)/(1-|Γ|); VSWR=1 is matched', 'Impedance matching prevents reflections and power loss'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 12 — CONTROL SYSTEMS  (6 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_block_diagrams: { topicId: 'fee_block_diagrams', title: 'Block Diagrams & Transfer Function Reduction', domainWeight: 'Control Systems · 4–6%', overview: 'Covers block diagram analysis, stability, root locus, frequency response, PID controllers, and time-domain specifications.', sections: [{ id: 'fee_block_diagrams_main', title: 'Block Diagrams', content: `Series blocks: multiply transfer functions. Parallel: add. Feedback: G = Gfwd/(1 + Gloop) for negative feedback. Mason's gain formula for complex systems. Feedback reduces steady-state error but also reduces bandwidth. Closed-loop poles determine stability.`, examTip: 'Key formulas:\nSeries: Gab = Ga·Gb\nParallel: Gab = Ga+Gb\nFeedback: G = Gfwd/(1+Gfb)' }], keyTakeaways: ['Series: multiply; parallel: add; feedback: G = Gfwd/(1+Gloop)', "Mason's gain for complex multi-loop systems", 'Negative feedback reduces error and nonlinearities', 'Closed-loop poles determine stability'] },

  fee_stability: { topicId: 'fee_stability', title: 'Stability Analysis: Routh-Hurwitz Criterion', domainWeight: 'Control Systems · 4–6%', overview: 'Covers block diagram analysis, stability, root locus, frequency response, PID controllers, and time-domain specifications.', sections: [{ id: 'fee_stability_main', title: 'Routh-Hurwitz Stability', content: `Routh-Hurwitz determines stability without computing poles. Form Routh array from characteristic polynomial coefficients. Number of sign changes in first column equals number of RHP poles. All positive first-column entries means stable. For 2nd order: a, b, c > 0 ensures stability. Special cases: zero in first column (replace with small ε), entire zero row (imaginary axis poles).`, examTip: 'Key formulas:\nD(s) = an·s^n + ... + a0\nRouth array first column signs indicate RHP poles\nAll positive = stable' }], keyTakeaways: ['Routh array first column signs indicate RHP poles; all positive = stable', 'Sign changes = number of unstable poles', 'For 2nd/3rd order, simple coefficient conditions', 'Special cases for zero entries require careful treatment'] },

  fee_root_locus: { topicId: 'fee_root_locus', title: 'Root Locus: Rules and System Design', domainWeight: 'Control Systems · 4–6%', overview: 'Covers block diagram analysis, stability, root locus, frequency response, PID controllers, and time-domain specifications.', sections: [{ id: 'fee_root_locus_main', title: 'Root Locus', content: `Root locus plots closed-loop pole paths as gain K varies from 0 to infinity. Starts at open-loop poles (K=0), ends at zeros or infinity. Real-axis segments include points where number of poles+zeros to right is odd. Asymptote angles: (2k+1)π/(n-m). Breakaway points: dD(s)/dK = 0. Design uses root locus to select K for desired damping ζ and natural frequency ωn. Compensators (lead, lag, PID) reshape root locus.`, examTip: 'Key formulas:\nAsymptote angles: (2k+1)π/(n-m)\nBreakaway: dD(s)/dK = 0\nCentroid σ = (Σpoles-Σzeros)/(n-m)' }], keyTakeaways: ['Root locus: closed-loop pole locations as K varies', 'Starts at open-loop poles, ends at zeros or infinity', 'Asymptotes and real-axis segments narrow down shape quickly', 'Design by selecting K for desired ζ and ωn'] },

  fee_bode_nyquist: { topicId: 'fee_bode_nyquist', title: 'Frequency Response: Bode & Nyquist Plots', domainWeight: 'Control Systems · 4–6%', overview: 'Covers block diagram analysis, stability, root locus, frequency response, PID controllers, and time-domain specifications.', sections: [{ id: 'fee_bode_nyquist_main', title: 'Bode & Nyquist', content: `Bode plot: magnitude (dB) vs log frequency, phase vs log frequency. Pole at origin: -20 dB/decade, -90 degrees. Zero at origin: +20 dB/decade, +90 degrees. Real pole at -a: corner at ω = a, -20 dB/decade for ω > a. Gain margin GM = -|G(jωpc)| dB at phase-crossover (phase = -180 degrees). Phase margin PM = 180 + angle of G(jωgc) at gain-crossover (|G| = 0 dB). Stable: GM > 0 dB and PM > 0 degrees. Nyquist: G(jω) in complex plane; stable if does not encircle (-1,0).`, examTip: 'Key formulas:\nMagnitude: 20log₁₀|G(jω)| dB\nGM = -|G(jωpc)| dB\nPM = 180 + angle G(jωgc)' }], keyTakeaways: ['Bode: magnitude in dB, phase in degrees, vs log frequency', 'Pole: -20 dB/decade, -90 degrees; zero: +20 dB/decade, +90 degrees', 'Stable: GM > 0 dB and PM > 0 degrees', 'Nyquist: plot should not encircle -1'] },

  fee_pid: { topicId: 'fee_pid', title: 'PID Controllers and Tuning', domainWeight: 'Control Systems · 4–6%', overview: 'Covers block diagram analysis, stability, root locus, frequency response, PID controllers, and time-domain specifications.', sections: [{ id: 'fee_pid_main', title: 'PID Controllers', content: `PID: u(t) = Kp·e(t) + Ki·integral(e)dt + Kd·de/dt. Proportional: immediate response, gain increases responsiveness but too high causes oscillation. Integral: eliminates steady-state error for step inputs; increases phase lag. Derivative: predicts error, adds phase lead, reduces overshoot; noise-sensitive. Ziegler-Nichols tuning uses system time constant and delay. Start with P, add I if steady-state error unacceptable, add D if overshooting.`, examTip: 'Key formulas:\nu(t) = Kp·e + Ki integral(e)dt + Kd·de/dt\nZiegler-Nichols: Kp=1.2/(θ·K)' }], keyTakeaways: ['P: instant response, no steady-state elimination', 'I: eliminates steady-state error, adds phase lag', 'D: reduces overshoot, adds phase lead; sensitive to noise', 'Tuning: Ziegler-Nichols, frequency response, or auto-tuning'] },

  fee_time_specs: { topicId: 'fee_time_specs', title: 'Time-Domain Specifications', domainWeight: 'Control Systems · 4–6%', overview: 'Covers block diagram analysis, stability, root locus, frequency response, PID controllers, and time-domain specifications.', sections: [{ id: 'fee_time_specs_main', title: 'Time-Domain Specifications', content: `Overshoot OS = e^(-πζ/sqrt(1-ζ^2)) x 100% for 2nd-order underdamped. Settling time ts approximately 4/(ζ·ωn). Rise time tr approximately (π - arccos(ζ))/ωd where ωd = ωn·sqrt(1-ζ^2). Peak time tp = π/ωd. Steady-state error ess = 1/(1+Kp) for step (Type 0), 1/Kv for ramp (Type 1). System type = number of integrators. ζ approximately 0.7 gives OS approximately 5% with reasonable speed.`, examTip: 'Key formulas:\nOS = e^(-πζ/sqrt(1-ζ^2))\nts approximately 4/(ζ·ωn)\ness = 1/(1+Kp) for step\nωd = ωn·sqrt(1-ζ^2)' }], keyTakeaways: ['Overshoot: OS = e^(-πζ/sqrt(1-ζ^2)); settling time approximately 4/(ζωn)', 'Steady-state error depends on system type (number of integrators)', 'Error constants Kp, Kv, Ka depend on pole/zero structure', 'ζ approximately 0.7 gives OS approximately 5%'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 13 — COMMUNICATIONS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_am_fm: { topicId: 'fee_am_fm', title: 'Analog Modulation: AM & FM', domainWeight: 'Communications · 4–6%', overview: 'Covers analog and digital modulation, noise analysis, channel capacity, and multiplexing.', sections: [{ id: 'fee_am_fm_main', title: 'AM & FM Modulation', content: `AM: s(t) = Ac[1+m(t)]cos(ωct). BW = 2fm. Efficiency η = ma^2/(2+ma^2) approximately 33% at ma=1. FM: s(t) = Ac cos(ωct + β·sin(ωmt)), β = Δf/fm. Carson's rule: BW approximately 2(Δf + fm). AM uses less bandwidth but is noise-sensitive; FM wider bandwidth but noise-resistant.`, examTip: 'Key formulas:\nAM: BW = 2fm, η = ma^2/(2+ma^2)\nFM: BW approximately 2(Δf+fm)\nβ = Δf/fm' }], keyTakeaways: ['AM: BW = 2fm; efficiency approximately 33%', "FM: BW approximately 2(Δf+fm) by Carson's rule", 'AM noise-sensitive; FM noise-resistant (bandwidth tradeoff)', 'Modulation index: AM is ma, FM is β = Δf/fm'] },

  fee_digital_mod: { topicId: 'fee_digital_mod', title: 'Digital Modulation: ASK, FSK, PSK, QAM', domainWeight: 'Communications · 4–6%', overview: 'Covers analog and digital modulation, noise analysis, channel capacity, and multiplexing.', sections: [{ id: 'fee_digital_mod_main', title: 'Digital Modulation', content: `ASK: simplest but noise-sensitive. FSK: more noise-resistant. PSK: BPSK 1 bit/symbol; QPSK 2 bits/symbol with same bandwidth. QAM: varies amplitude and phase; 16-QAM has 4 bits/symbol. Higher-order modulations increase spectral efficiency but require better SNR. BER for BPSK approximately Q(sqrt(2Eb/N0)).`, examTip: 'Key formulas:\nBPSK: 1 bit/symbol\nQPSK: 2 bits/symbol\n16-QAM: 4 bits/symbol\nBER_BPSK approximately Q(sqrt(2Eb/N0))' }], keyTakeaways: ['ASK (noise-sensitive), FSK (moderate), PSK (resistant), QAM (high efficiency)', 'BPSK: 1 bit/symbol; QPSK: 2; 16-QAM: 4', 'Higher modulation orders require higher SNR', 'BER depends on Eb/N0'] },

  fee_noise_snr: { topicId: 'fee_noise_snr', title: 'Noise and Signal-to-Noise Ratio', domainWeight: 'Communications · 4–6%', overview: 'Covers analog and digital modulation, noise analysis, channel capacity, and multiplexing.', sections: [{ id: 'fee_noise_snr_main', title: 'Noise & SNR', content: `Thermal noise: Pn = kT·B where k=1.38x10^-23 J/K. Noise figure F = SNRin/SNRout; in dB: NF = 10log₁₀(F). Cascade: F = F1 + (F2-1)/G1 + (F3-1)/(G1·G2). First stage dominates if G1 is large. SNR in dB: 10log₁₀(Psignal/Pnoise).`, examTip: 'Key formulas:\nPn = kT·B\nF = SNRin/SNRout\nCascade: F = F1+(F2-1)/G1\nSNR_dB = 10log₁₀(Ps/Pn)' }], keyTakeaways: ['Thermal noise: Pn = kT·B; increases with temperature and bandwidth', 'Noise figure F = SNRin/SNRout; smaller is better', 'Cascade: F approximately F1 if G1 large; first stage dominates', 'SNR in dB: 10log₁₀(Psignal/Pnoise)'] },

  fee_channel_cap: { topicId: 'fee_channel_cap', title: 'Channel Capacity & Shannon-Hartley', domainWeight: 'Communications · 4–6%', overview: 'Covers analog and digital modulation, noise analysis, channel capacity, and multiplexing.', sections: [{ id: 'fee_channel_cap_main', title: 'Shannon-Hartley', content: `Shannon capacity: C = B·log₂(1 + S/N) — maximum reliable information rate. Every 10 dB SNR increase adds approximately 3.3 bits/s/Hz. To increase capacity: increase power, bandwidth, or modulation efficiency. Eb/N0 = (S/N)·(B/C) relates energy per bit to SNR. Capacity scales with log(SNR), not linearly.`, examTip: 'Key formulas:\nC = B·log₂(1+S/N)\nEb/N0 = (S/N)·(B/C)' }], keyTakeaways: ['Shannon: C = B·log₂(1+S/N); limits all communication', 'Every 10 dB SNR increase adds approximately 3.3 bits/s/Hz', 'To increase capacity: boost power, bandwidth, or modulation efficiency', 'Eb/N0 threshold determines modulation feasibility'] },

  fee_multiplexing: { topicId: 'fee_multiplexing', title: 'Multiplexing: TDM, FDM, CDM', domainWeight: 'Communications · 4–6%', overview: 'Covers analog and digital modulation, noise analysis, channel capacity, and multiplexing.', sections: [{ id: 'fee_multiplexing_main', title: 'Multiplexing', content: `FDM: each signal occupies distinct frequency band; total BW = sum + guards. TDM: signals take turns in time slots; total BW = signal BW but time-shared. Synchronous TDM: fixed slots (wastes if inactive). Statistical TDM: dynamic assignment (efficient). CDM/CDMA: unique spreading codes, simultaneous transmission, soft capacity limit. WDM: wavelength division in fiber optics.`, examTip: 'Key formulas:\nFDM: B_total = B1+B2+...+guards\nTDM: rate = f1+f2+...\nCDM spreading gain = code_length' }], keyTakeaways: ['FDM: separate frequencies; TDM: time slots', 'CDM/CDMA: unique codes, simultaneous, soft capacity', 'WDM: wavelength division in fiber', 'FDM for analog, TDM for digital; CDM for mobile'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 14 — COMPUTER NETWORKS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_osi_tcpip: { topicId: 'fee_osi_tcpip', title: 'OSI and TCP/IP Models', domainWeight: 'Computer Networks · 3–5%', overview: 'Covers OSI/TCP/IP models, IP addressing, topologies, security, and performance.', sections: [{ id: 'fee_osi_tcpip_main', title: 'OSI & TCP/IP', content: `OSI: 7 layers — Physical(1), Data Link(2), Network(3), Transport(4), Session(5), Presentation(6), Application(7). TCP/IP: 4 layers — Link, Internet, Transport, Application. Protocol layering encapsulates data with headers at each layer. Routers work L3 (IP); switches L2 (MAC); hubs L1. Key ports: HTTP=80, HTTPS=443, SMTP=25, SSH=22, DNS=53, FTP=21.`, examTip: 'Key protocols:\nHTTP=80, HTTPS=443, SMTP=25, SSH=22, DNS=53' }], keyTakeaways: ['OSI: 7 layers; TCP/IP: 4 practical layers', 'Encapsulation: each layer adds headers', 'Routers L3, switches L2, hubs L1', 'Key protocols: IP, TCP, UDP, HTTP, DNS, SMTP'] },

  fee_ip_subnetting: { topicId: 'fee_ip_subnetting', title: 'IP Addressing and Subnetting', domainWeight: 'Computer Networks · 3–5%', overview: 'Covers OSI/TCP/IP models, IP addressing, topologies, security, and performance.', sections: [{ id: 'fee_ip_subnetting_main', title: 'IP Addressing & Subnetting', content: `IPv4: 32 bits, dotted decimal. CIDR notation: /24 means 24 network bits, 8 host bits. Usable hosts = 2^(32-prefix) - 2. Network address: host bits = 0. Broadcast: host bits = 1. IPv6: 128 bits, hex notation. Subnetting divides networks: /24 into /25 gives 2 subnets of 126 usable hosts each.`, examTip: 'Key formulas:\nUsable hosts: 2^(32-prefix)-2\nSubnet size: 2^(32-prefix)\nBroadcast: network | inverse_mask' }], keyTakeaways: ['IPv4: 32 bits; CIDR /n means n network bits', 'Hosts = 2^(32-n)-2; subtract network and broadcast', 'Network address: host bits 0; broadcast: host bits 1', 'IPv6: 128 bits, hex notation'] },

  fee_topologies: { topicId: 'fee_topologies', title: 'Network Topologies', domainWeight: 'Computer Networks · 3–5%', overview: 'Covers OSI/TCP/IP models, IP addressing, topologies, security, and performance.', sections: [{ id: 'fee_topologies_main', title: 'Topologies', content: `Star: central switch, easy management, central failure point. Ring: deterministic access, breaks on failure. Mesh: redundancy, full mesh needs N(N-1)/2 links. Bus: simple broadcast, CSMA/CD. Tree: hierarchical. Modern networks use star with redundant links; mesh for critical systems.`, examTip: 'Key formulas:\nFull mesh: N(N-1)/2 links\nBus: CSMA/CD collision detection' }], keyTakeaways: ['Star: central failure but easy management', 'Mesh: redundancy; full mesh needs N(N-1)/2 links', 'Bus: simple, broadcast; replaced by switches', 'Modern: star topology with redundant links'] },

  fee_net_security: { topicId: 'fee_net_security', title: 'Network Security', domainWeight: 'Computer Networks · 3–5%', overview: 'Covers OSI/TCP/IP models, IP addressing, topologies, security, and performance.', sections: [{ id: 'fee_net_security_main', title: 'Network Security', content: `Firewall: stateful examines state; packet filter simple; proxy intermediary. Symmetric encryption (AES): fast, shared secret. Asymmetric (RSA): public/private key pairs, enables key exchange and signatures. Hash functions (SHA) provide integrity. Digital signatures: authentication + integrity. VPN: encrypted tunnel over public network. Defense in depth: multiple layers beat single strong tool.`, examTip: 'Key concepts:\nSymmetric: fast, shared key (AES)\nAsymmetric: public/private (RSA)\nVPN: encrypted tunnel (IPSec, TLS)' }], keyTakeaways: ['Firewall: stateful, packet filter, or proxy', 'Symmetric fast (AES); asymmetric enables exchange (RSA)', 'Hash for integrity; digital signature for authentication', 'VPN: encrypted tunnel; defense in depth'] },

  fee_net_perf: { topicId: 'fee_net_perf', title: 'Network Performance', domainWeight: 'Computer Networks · 3–5%', overview: 'Covers OSI/TCP/IP models, IP addressing, topologies, security, and performance.', sections: [{ id: 'fee_net_perf_main', title: 'Performance', content: `Bandwidth: channel capacity (bps). Throughput: actual achieved rate (less than or equal to bandwidth). Latency = propagation + transmission + queuing + processing. Transmission delay = bits/bandwidth. Propagation delay = distance/speed. Jitter: latency variation (critical for voice/video). Bottleneck: slowest link determines throughput.`, examTip: 'Key formulas:\nTransmission delay = bits/bandwidth\nPropagation delay = distance/speed\nTotal latency = prop+tx+queuing+processing' }], keyTakeaways: ['Bandwidth: capacity; throughput: actual rate', 'Latency = propagation + transmission + queuing', 'Jitter critical for real-time; high jitter worse than high latency', 'Bottleneck: slowest link determines throughput'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 15 — DIGITAL SYSTEMS  (5 curriculum IDs from 4 sections)
   * ────────────────────────────────────────────────────────────────── */

  fee_number_sys: { topicId: 'fee_number_sys', title: 'Number Systems and Boolean Algebra', domainWeight: 'Digital Systems · 7–11%', overview: 'Covers number systems, combinational logic, sequential logic, state machines, and memory.', sections: [{ id: 'fee_number_sys_main', title: 'Number Systems & Boolean Algebra', content: `Binary (base 2), octal (base 8), hexadecimal (base 16). Binary to decimal: 1010 = 10. Hex simplifies binary (4 bits = 1 hex digit). Boolean: AND (A·B), OR (A+B), NOT (A'). DeMorgan: (A·B)' = A'+B' and (A+B)' = A'·B'. Karnaugh maps simplify Boolean expressions by grouping adjacent 1s.`, examTip: "Key formulas:\nDeMorgan: (A·B)' = A'+B'\n(A+B)' = A'·B'\nK-map: group adjacent 1s in powers of 2" }], keyTakeaways: ['Binary/octal/hex conversion using place values', "DeMorgan: swap operators, complement all", 'K-map: group adjacent 1s for minimization', 'Minimize to fewest terms and literals'] },

  fee_comb_logic: { topicId: 'fee_comb_logic', title: 'Combinational Logic: MUX, Decoders, Adders', domainWeight: 'Digital Systems · 7–11%', overview: 'Covers number systems, combinational logic, sequential logic, state machines, and memory.', sections: [{ id: 'fee_comb_logic_main', title: 'Combinational Logic', content: `Output depends only on current inputs (no memory). MUX: selects one of N inputs; 2^n inputs need n select lines. Decoder: n inputs, 2^n outputs. Full-adder: Sum = A XOR B XOR Cin, Cout = A·B + Cin·(A XOR B). Ripple-carry: simple but slow. Carry-lookahead: faster, more complex. Subtraction via 2's complement: invert bits, add 1.`, examTip: "Key formulas:\nFull adder: Sum = A XOR B XOR Cin\nCout = AB + Cin(A XOR B)" }], keyTakeaways: ['MUX selects input; decoder activates one output', 'Full-adder: Sum = A XOR B XOR Cin; Cout = AB + Cin(A XOR B)', 'Ripple-carry simple but slow; carry-lookahead faster', "2's complement for subtraction"] },

  fee_seq_logic: { topicId: 'fee_seq_logic', title: 'Sequential Logic: Flip-Flops & Counters', domainWeight: 'Digital Systems · 7–11%', overview: 'Covers number systems, combinational logic, sequential logic, state machines, and memory.', sections: [{ id: 'fee_seq_logic_main', title: 'Sequential Logic', content: `Sequential circuits have memory; output depends on past inputs. D flip-flop: captures D on clock edge, Q = D. SR: S=1 sets, R=1 resets, S=R=1 undefined. JK: J=1 sets, K=1 resets, J=K=1 toggles. T: toggles on T=1. Setup and hold times must be satisfied to avoid metastability. Counters cascade flip-flops: binary counts 0 to 2^n-1. Synchronous: all FF clock simultaneously (fast, reliable).`, examTip: 'Key concepts:\nD FF: Q becomes D on clock edge\nSetup/hold time violations cause metastability\nSynchronous > asynchronous for reliability' }], keyTakeaways: ['D FF captures input; Q = D on clock edge', 'JK is universal; T toggles', 'Setup/hold time violations cause metastability', 'Synchronous counter: all FF driven by same clock'] },

  fee_state_machines: { topicId: 'fee_state_machines', title: 'Finite State Machines', domainWeight: 'Digital Systems · 7–11%', overview: 'Covers number systems, combinational logic, sequential logic, state machines, and memory.', sections: [{ id: 'fee_state_machines_main', title: 'Finite State Machines', content: `A Finite State Machine (FSM) consists of states (circles in diagrams) and transitions (arrows between states triggered by inputs). Moore FSM: output depends only on current state — output changes only on state transitions, making it synchronous and glitch-free. Mealy FSM: output depends on both current state and current input — can respond faster to input changes but may produce glitches. Design process: (1) list all states needed, (2) create a state transition table with current state, input, next state, and output, (3) assign binary codes to states, (4) derive next-state logic using flip-flop excitation equations, (5) implement with flip-flops and combinational logic. State minimization reduces the number of states (and flip-flops) by combining equivalent states — two states are equivalent if for all inputs they produce the same output and transition to equivalent next states. On the FE exam, you may need to design a simple FSM from a word description, trace through a state diagram given inputs, or convert between Moore and Mealy representations. Counter design is a special case of FSM design where states follow a fixed sequence.`, examTip: 'Key concepts:\nMoore: output = f(state only)\nMealy: output = f(state, input)\nDesign: state table -> excitation equations -> implementation' }], keyTakeaways: ['Moore output depends on state only; Mealy on state and input', 'Design: list states, create transition table, derive logic', 'State minimization combines equivalent states to reduce hardware', 'Counters are special-case FSMs with fixed sequences'] },

  fee_memory: { topicId: 'fee_memory', title: 'Memory Systems: ROM, RAM, Cache, FPGA', domainWeight: 'Digital Systems · 7–11%', overview: 'Covers number systems, combinational logic, sequential logic, state machines, and memory.', sections: [{ id: 'fee_memory_main', title: 'Memory Systems', content: `ROM: nonvolatile, permanent. PROM: write once. EPROM: UV erasable. EEPROM/Flash: electrically erasable. RAM: volatile. SRAM: fast, expensive, uses latches. DRAM: slower, cheap, uses capacitors, needs refresh. Memory hierarchy: registers (fastest) > L1 cache > L2 > RAM > disk (largest). Cache exploits locality: temporal and spatial. Cache hit rate = hits/(hits+misses). FPGA: configurable logic blocks, reprogrammable without hardware change.`, examTip: 'Key formulas:\nCache hit rate = hits/(hits+misses)\nMemory capacity = 2^address_bits bytes' }], keyTakeaways: ['ROM nonvolatile; RAM volatile; SRAM fast/expensive, DRAM large/cheap', 'Memory hierarchy: registers > cache > RAM > disk', 'Cache exploits temporal and spatial locality', 'FPGA: reprogrammable logic'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 16 — COMPUTER SYSTEMS  (4 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_architecture: { topicId: 'fee_architecture', title: 'Computer Architecture', domainWeight: 'Computer Systems · 3–5%', overview: 'Covers computer architecture, memory hierarchy, I/O interfacing, and performance metrics.', sections: [{ id: 'fee_architecture_main', title: 'Architecture', content: `Von Neumann: single memory for instructions and data (bottleneck). Harvard: separate memories (parallel fetch). Most modern CPUs use modified Harvard with separate L1 caches. RISC: simple instructions, efficient pipelining (ARM, MIPS). CISC: complex instructions, variable cycles (x86). Pipeline: IF-ID-EX-MEM-WB stages; hazards reduce efficiency. Superscalar: multiple instructions simultaneously.`, examTip: 'Key concepts:\nVon Neumann: single memory\nHarvard: separate instruction/data\nRISC: simple, pipelinable\nCISC: complex, variable cycles' }], keyTakeaways: ['Von Neumann: single memory; Harvard: separate instruction/data', 'RISC: simple, fast, pipelinable; CISC: complex, powerful per instruction', 'Pipeline: IF-ID-EX-MEM-WB; hazards reduce efficiency', 'Superscalar: multiple instructions simultaneously'] },

  fee_mem_hierarchy: { topicId: 'fee_mem_hierarchy', title: 'Memory Hierarchy and Virtual Memory', domainWeight: 'Computer Systems · 3–5%', overview: 'Covers computer architecture, memory hierarchy, I/O interfacing, and performance metrics.', sections: [{ id: 'fee_mem_hierarchy_main', title: 'Memory Hierarchy', content: `Registers (<1 KB, ~1 ns), L1 cache (32-64 KB, ~4 ns), L2 (256 KB-1 MB, ~10 ns), RAM (GB, ~100 ns), disk (TB, ~10 ms). Principle of locality: temporal and spatial. Average access time = h·tc + (1-h)·tm. Write-through: write to cache and memory. Write-back: write cache only, mark dirty. Virtual memory: page table translates virtual to physical. TLB caches translations. Page fault: very expensive disk fetch.`, examTip: 'Key formulas:\nAverage access time = h·tc + (1-h)·tm\nHit rate h = hits/(hits+misses)' }], keyTakeaways: ['Cache exploits locality: small, fast copies of frequent data', 'Average access time depends on hit rate', 'Write-through vs write-back cache policies', 'Virtual memory: disk extends RAM; page faults very expensive'] },

  fee_io_interfacing: { topicId: 'fee_io_interfacing', title: 'I/O and Interfacing', domainWeight: 'Computer Systems · 3–5%', overview: 'Covers computer architecture, memory hierarchy, I/O interfacing, and performance metrics.', sections: [{ id: 'fee_io_interfacing_main', title: 'I/O & Interfacing', content: `Programmed I/O: CPU controls all (slow). Interrupt: device signals CPU asynchronously. DMA: device transfers directly to memory without CPU. I2C: two-wire, master-slave, for sensors. SPI: four-wire, faster. USB: serial, hot-plug. PCIe: high-speed point-to-point. Bandwidth: USB 2.0 approximately 480 Mbps, USB 3.0 approximately 5 Gbps.`, examTip: 'Key concepts:\nProgrammed I/O < Interrupt < DMA (increasing efficiency)\nI2C < SPI < USB < PCIe (increasing speed)' }], keyTakeaways: ['Programmed I/O slow; Interrupt better; DMA best for bulk transfer', 'I2C, SPI, USB, PCIe: increasing speed and complexity', 'DMA offloads CPU; essential for high-speed devices', 'Interrupt handler: device-specific code; priority determines order'] },

  fee_performance: { topicId: 'fee_performance', title: 'Performance Metrics: CPI, MIPS, Amdahl\'s Law', domainWeight: 'Computer Systems · 3–5%', overview: 'Covers computer architecture, memory hierarchy, I/O interfacing, and performance metrics.', sections: [{ id: 'fee_performance_main', title: 'Performance Metrics', content: `Execution time = instructions x CPI / frequency. CPI: cycles per instruction (ideal 1). MIPS = freq(MHz)/CPI. Amdahl's Law: speedup = 1/[(1-f) + f/S] where f is fraction affected, S is improvement factor. If 50% parallelizable, max speedup is 2x even with infinite S. Power scales cubically with frequency.`, examTip: "Key formulas:\nCPI = cycles/instructions\nMIPS = freq(MHz)/CPI\nAmdahl: speedup = 1/[(1-f)+f/S]\nTime = instructions x CPI / frequency" }], keyTakeaways: ['CPI: cycles per instruction; MIPS = freq/CPI', 'Execution time = instructions x CPI / frequency', "Amdahl: max speedup = 1/(1-f+f/S); diminishing returns", 'Power-performance: frequency cubes'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 17 — SOFTWARE DEVELOPMENT  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_algorithms: { topicId: 'fee_algorithms', title: 'Algorithms and Complexity', domainWeight: 'Software Development · 3–5%', overview: 'Covers data structures, algorithms, OOP, SDLC, and databases.', sections: [{ id: 'fee_algorithms_main', title: 'Algorithms & Complexity', content: `Big-O notation: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n^2) quadratic, O(2^n) exponential. Sorting: Bubble/Insertion O(n^2); Merge/Quick O(n log n). Binary search: O(log n) on sorted data. Recursion: base case prevents infinite recursion. Divide-and-conquer splits problem. Dynamic programming: memoization avoids redundant computation. Greedy: locally optimal choices.`, examTip: 'Key formulas:\nBinary search: O(log n)\nMerge sort: O(n log n)\nFibonacci naive: O(2^n), DP: O(n)' }], keyTakeaways: ['Big-O: asymptotic upper bound; focus on dominant term', 'O(n log n) sorts: merge, quick; O(n^2): bubble, insertion', 'Binary search O(log n) requires sorted data', 'Dynamic programming eliminates redundant computation'] },

  fee_data_structures: { topicId: 'fee_data_structures', title: 'Data Structures', domainWeight: 'Software Development · 3–5%', overview: 'Covers data structures, algorithms, OOP, SDLC, and databases.', sections: [{ id: 'fee_data_structures_main', title: 'Data Structures', content: `Arrays: O(1) access, O(n) insert. Linked lists: O(1) insert at known position, O(n) search. Stack (LIFO): push/pop from top; applications: function calls, expression evaluation. Queue (FIFO): enqueue rear, dequeue front; applications: scheduling, BFS. BST: O(log n) if balanced; AVL/Red-Black maintain balance. Hash table: O(1) average lookup; collision resolution: chaining or open addressing. Load factor = size/capacity.`, examTip: 'Key complexities:\nArray access: O(1), insert: O(n)\nBST balanced: O(log n)\nHash: O(1) average, O(n) worst' }], keyTakeaways: ['Arrays: O(1) access, O(n) insert; lists: O(1) insert, O(n) search', 'Stack LIFO, Queue FIFO; efficient for specific use cases', 'BST O(log n) if balanced; AVL/RB maintain balance', 'Hash table O(1) average; collision handling critical'] },

  fee_oop: { topicId: 'fee_oop', title: 'Object-Oriented Programming', domainWeight: 'Software Development · 3–5%', overview: 'Covers data structures, algorithms, OOP, SDLC, and databases.', sections: [{ id: 'fee_oop_main', title: 'OOP & Programming Concepts', content: `OOP organizes code as objects (data + methods). Class: blueprint. Instance: specific object. Encapsulation: hide internals, expose interface. Inheritance: child inherits from parent (code reuse). Polymorphism: same method name, different behavior. Abstraction: expose essential, hide complexity. Recursion: function calls itself with smaller input until base case. Functional programming: functions as first-class objects, immutability, higher-order functions (map, filter, reduce).`, examTip: 'Key concepts:\nEncapsulation, Inheritance, Polymorphism, Abstraction\nRecursion: base case essential\nFunctional: immutable, pure functions' }], keyTakeaways: ['OOP: encapsulation, inheritance, polymorphism', 'Recursion: elegant for hierarchical problems; watch stack overflow', 'Dynamic programming: memoization for optimization', 'Functional: immutable, composable, declarative'] },

  fee_sdlc: { topicId: 'fee_sdlc', title: 'Software Development Lifecycle', domainWeight: 'Software Development · 3–5%', overview: 'Covers data structures, algorithms, OOP, SDLC, and databases.', sections: [{ id: 'fee_sdlc_main', title: 'SDLC & Testing', content: `Waterfall: sequential (requirements, design, code, test, deploy). Advantage: clear plan. Disadvantage: inflexible, late error detection. Agile/Scrum: iterative sprints, continuous feedback. Testing: Unit (functions), Integration (components), System (full), Acceptance (user). TDD: write tests before code. Git: commit (snapshot), branch (parallel), merge (combine). CI/CD: automated testing and deployment.`, examTip: 'Key concepts:\nWaterfall: sequential, plan-heavy\nAgile: iterative, feedback-driven\nTesting: unit > integration > system > acceptance' }], keyTakeaways: ['Waterfall: sequential; Agile: iterative', 'Testing: unit, integration, system, acceptance; earlier = cheaper', 'Git: commit, branch, merge', 'CI/CD: automate testing and deployment'] },

  fee_databases: { topicId: 'fee_databases', title: 'Databases: SQL & Normalization', domainWeight: 'Software Development · 3–5%', overview: 'Covers data structures, algorithms, OOP, SDLC, and databases.', sections: [{ id: 'fee_databases_main', title: 'Databases', content: `Relational databases: tables with rows/columns. Primary key: unique identifier. Foreign key: references another table. SQL: SELECT (retrieve), INSERT, UPDATE, DELETE, JOIN. Normalization: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). ACID: Atomicity (all-or-nothing), Consistency (valid state), Isolation (no interference), Durability (survives failures). Indexes accelerate lookups but slow writes.`, examTip: 'Key concepts:\nSQL: SELECT, INSERT, UPDATE, DELETE, JOIN\n1NF: atomic; 2NF: full dependency; 3NF: no transitive\nACID: atomicity, consistency, isolation, durability' }], keyTakeaways: ['Relational: tables with primary/foreign keys', 'SQL: SELECT, INSERT, UPDATE, DELETE, JOIN', 'Normalization: 1NF atomic, 2NF full dependency, 3NF no transitive', 'ACID: atomicity, consistency, isolation, durability'] },


};

export function hasFEEECourseContent(topicId: string): boolean {
  return topicId in FE_EE_COURSE;
}

export function getFEEECourseContent(topicId: string): TopicLesson | null {
  return FE_EE_COURSE[topicId] || null;
}
