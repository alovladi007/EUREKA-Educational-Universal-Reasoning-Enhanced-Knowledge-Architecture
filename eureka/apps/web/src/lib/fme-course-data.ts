/**
 * FE Mechanical Engineering — Course Content
 * 67 curriculum topics with detailed study content, key points, and formulas.
 * Every curriculum topic ID has real, substantial content.
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

export const FME_COURSE: Record<string, TopicLesson> = {

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 0 — MATHEMATICS  (5 curriculum IDs)  ·  6–9 %
 * ══════════════════════════════════════════════════════════════════ */

fme_calculus: {
  topicId: 'fme_calculus',
  title: 'Differential & Integral Calculus',
  domainWeight: 'Mathematics · 6–9%',
  overview: 'Calculus is the mathematical foundation for virtually every engineering discipline tested on the FE Mechanical exam. Differentiation finds rates of change (velocity, heat flux, stress gradients), while integration computes accumulated quantities (work, area, volume). Mastering derivative rules, integration techniques, and applications is essential.',
  sections: [
    {
      id: 'calc-derivatives',
      title: '1. Differentiation Rules and Applications',
      content: `## 1.1 Fundamental Derivative Rules

The **power rule** is the workhorse of differentiation:

**d/dx (x^n) = n · x^(n-1)**

Other essential rules:

| Rule | Formula | Application |
|---|---|---|
| Product Rule | (uv)' = u'v + uv' | Differentiating products of functions |
| Quotient Rule | (u/v)' = (u'v - uv') / v² | Ratios of functions |
| Chain Rule | dy/dx = (dy/du)(du/dx) | Composite functions |
| Exponential | d/dx(e^x) = e^x | Transient decay/growth |
| Logarithmic | d/dx(ln x) = 1/x | Logarithmic relationships |
| Trigonometric | d/dx(sin x) = cos x | Oscillatory motion |

### Critical Points and Optimization

A function f(x) has a **critical point** where f'(x) = 0 or f'(x) is undefined.

- **Second derivative test**: If f''(c) > 0, local minimum; if f''(c) < 0, local maximum
- **Inflection point**: Where f''(x) changes sign — concavity switches

## 1.2 Partial Derivatives

For multivariable functions f(x, y):
- **∂f/∂x**: differentiate with respect to x, treating y as constant
- **∂f/∂y**: differentiate with respect to y, treating x as constant
- **Mixed partials**: ∂²f/∂x∂y = ∂²f/∂y∂x (for continuous second derivatives)`,
      examTip: 'The chain rule appears in almost every FE problem involving composite functions. When differentiating e^(-2t), remember: d/dt[e^(-2t)] = -2e^(-2t). The negative sign is a common source of errors.',
    },
    {
      id: 'calc-integration',
      title: '2. Integration Techniques',
      content: `## 2.1 Fundamental Integration Rules

Integration reverses differentiation. Key formulas:

| Integral | Result | Notes |
|---|---|---|
| ∫x^n dx | x^(n+1)/(n+1) + C | n ≠ -1 |
| ∫(1/x) dx | ln|x| + C | Reciprocal function |
| ∫e^x dx | e^x + C | Exponential function |
| ∫sin x dx | -cos x + C | Trig integration |
| ∫cos x dx | sin x + C | Trig integration |

## 2.2 Integration Techniques

- **Substitution (u-sub)**: Replace a composite expression with u; change dx to du
- **Integration by parts**: ∫u dv = uv - ∫v du (LIATE priority: Log, Inverse trig, Algebraic, Trig, Exponential)
- **Partial fractions**: Decompose rational functions before integrating

## 2.3 Applications of Integration

- **Area under a curve**: A = ∫_a^b f(x) dx
- **Volume of revolution (disk)**: V = π∫_a^b [f(x)]² dx
- **Volume of revolution (shell)**: V = 2π∫_a^b x·f(x) dx
- **Work**: W = ∫F·dx (variable force along a path)
- **Arc length**: L = ∫_a^b √(1 + [f'(x)]²) dx`,
      examTip: 'For definite integrals, always evaluate the antiderivative at the upper limit minus the lower limit: F(b) - F(a). Many FE problems test whether you handle the limits correctly.',
      importantNote: 'Integration by parts is especially useful for ∫x·e^x dx or ∫x·sin(x) dx type problems. Use the LIATE rule to pick u: choose the function type that appears earliest in the LIATE list.',
    },
  ],
  keyTakeaways: [
    'Power rule d/dx(x^n) = n·x^(n-1) is the most frequently used derivative rule.',
    'Chain rule is essential for composite functions — never forget the inner derivative.',
    'Integration by parts: ∫u dv = uv - ∫v du; use LIATE to select u.',
    'Definite integrals compute area, volume, work, and arc length.',
    'Second derivative test: f\'\'(c) > 0 means local min, f\'\'(c) < 0 means local max.',
  ],
},

fme_linear_algebra: {
  topicId: 'fme_linear_algebra',
  title: 'Linear Algebra & Matrix Operations',
  domainWeight: 'Mathematics · 6–9%',
  overview: 'Linear algebra provides the tools for solving systems of equations that arise in structural analysis, vibrations, and controls. Matrix operations, determinants, eigenvalues, and solution methods are all tested on the FE Mechanical exam.',
  sections: [
    {
      id: 'la-matrices',
      title: '1. Matrix Operations and Determinants',
      content: `## 1.1 Matrix Arithmetic

**Addition/Subtraction**: Element-by-element for same-dimension matrices.

**Multiplication**: For A (m×n) and B (n×p), product AB is (m×p):
- (AB)_ij = Σ_k A_ik · B_kj

**Properties**:
- AB ≠ BA in general (not commutative)
- A(BC) = (AB)C (associative)
- A(B + C) = AB + AC (distributive)

## 1.2 Determinants

For a **2×2 matrix**: det([[a,b],[c,d]]) = ad - bc

For a **3×3 matrix**: expand along any row or column using cofactors.

| Property | Description |
|---|---|
| det(AB) = det(A)·det(B) | Product rule for determinants |
| det(A^T) = det(A) | Transpose preserves determinant |
| det(kA) = k^n · det(A) | Scalar multiplication (n = matrix size) |
| det(A) = 0 | Matrix is singular (not invertible) |

## 1.3 Matrix Inverse

For a 2×2 matrix: **A⁻¹ = (1/det(A)) · [[d, -b], [-c, a]]**

A matrix is invertible if and only if det(A) ≠ 0.`,
      examTip: 'On the FE exam, 2×2 and 3×3 matrices are most common. For 2×2 inverse, swap diagonal elements, negate off-diagonal, divide by determinant. This is faster than any general method.',
    },
    {
      id: 'la-eigen',
      title: '2. Eigenvalues and Systems of Equations',
      content: `## 2.1 Eigenvalue Problems

The eigenvalue equation is **Ax = λx**, where:
- λ = eigenvalue (scalar)
- x = eigenvector (non-zero vector)

To find eigenvalues, solve **det(A - λI) = 0** (characteristic equation).

For a 2×2 matrix [[a,b],[c,d]]:
- **λ² - (a+d)λ + (ad-bc) = 0**
- Sum of eigenvalues = trace = a + d
- Product of eigenvalues = determinant = ad - bc

## 2.2 Cramer's Rule

For systems Ax = b where det(A) ≠ 0:
- **x_i = det(A_i) / det(A)**
- A_i is formed by replacing column i of A with b

## 2.3 Gaussian Elimination

Row operations to reduce to upper triangular form, then back-substitute:
1. Swap rows
2. Multiply a row by a non-zero scalar
3. Add a multiple of one row to another`,
      examTip: 'Eigenvalue problems appear in vibration analysis. The characteristic equation det(A - λI) = 0 for a 2×2 gives a quadratic — use the quadratic formula. The eigenvalues of a symmetric matrix are always real.',
      importantNote: 'Cramer\'s rule is efficient for 2×2 and 3×3 systems on the FE exam. For larger systems, Gaussian elimination is more practical.',
    },
  ],
  keyTakeaways: [
    'Matrix multiplication is not commutative: AB ≠ BA in general.',
    '2×2 determinant: ad - bc; 3×3 uses cofactor expansion.',
    'Eigenvalues solve det(A - λI) = 0; eigenvectors solve (A - λI)x = 0.',
    'Cramer\'s rule: x_i = det(A_i)/det(A) for small systems.',
    'A matrix is invertible if and only if its determinant is non-zero.',
  ],
},

fme_diffeq: {
  topicId: 'fme_diffeq',
  title: 'Ordinary Differential Equations',
  domainWeight: 'Mathematics · 6–9%',
  overview: 'Differential equations model dynamic mechanical systems: vibrations, heat conduction, fluid flow, and control systems. The FE exam tests first-order separable/linear ODEs, second-order constant-coefficient ODEs, and Laplace transforms.',
  sections: [
    {
      id: 'ode-first',
      title: '1. First-Order ODEs',
      content: `## 1.1 Separable Equations

Form: **dy/dx = f(x)·g(y)**

Method: Separate variables and integrate both sides:
- ∫dy/g(y) = ∫f(x) dx + C

**Example**: dy/dx = -2xy → ∫dy/y = ∫-2x dx → ln|y| = -x² + C → y = Ae^(-x²)

## 1.2 First-Order Linear ODEs

Form: **dy/dx + P(x)y = Q(x)**

Solution using **integrating factor** μ = e^(∫P(x)dx):
- **y = (1/μ)∫μ·Q(x) dx**

| ODE Type | Recognition | Method |
|---|---|---|
| Separable | dy/dx = f(x)g(y) | Separate and integrate |
| Linear | dy/dx + Py = Q | Integrating factor |
| Exact | M dx + N dy = 0, ∂M/∂y = ∂N/∂x | Find potential function |

## 1.3 Exponential Growth/Decay

**dy/dt = ky** → **y = y₀·e^(kt)**

- k > 0: exponential growth
- k < 0: exponential decay (half-life t₁/₂ = ln(2)/|k|)`,
      examTip: 'Always check if an ODE is separable first — it is the simplest method. If not separable, check for the linear form dy/dx + Py = Q and use an integrating factor.',
    },
    {
      id: 'ode-second',
      title: '2. Second-Order ODEs and Laplace Transforms',
      content: `## 2.1 Constant-Coefficient Second-Order ODEs

Form: **ay'' + by' + cy = 0**

Characteristic equation: **ar² + br + c = 0**

| Discriminant | Roots | General Solution |
|---|---|---|
| b²-4ac > 0 | Two real roots r₁, r₂ | y = C₁e^(r₁x) + C₂e^(r₂x) |
| b²-4ac = 0 | Repeated root r | y = (C₁ + C₂x)e^(rx) |
| b²-4ac < 0 | Complex roots α ± βi | y = e^(αx)(C₁cos(βx) + C₂sin(βx)) |

This directly maps to mechanical vibrations:
- **Overdamped**: two distinct real roots
- **Critically damped**: repeated real root
- **Underdamped**: complex conjugate roots (oscillatory)

## 2.2 Laplace Transform Method

The Laplace transform converts ODEs to algebraic equations:

**L{f(t)} = F(s) = ∫₀^∞ f(t)e^(-st) dt**

| f(t) | F(s) |
|---|---|
| 1 | 1/s |
| t^n | n!/s^(n+1) |
| e^(-at) | 1/(s+a) |
| sin(ωt) | ω/(s²+ω²) |
| cos(ωt) | s/(s²+ω²) |

Key properties:
- **L{f'(t)} = sF(s) - f(0)**
- **L{f''(t)} = s²F(s) - sf(0) - f'(0)**
- **Final Value Theorem**: lim(t→∞) f(t) = lim(s→0) sF(s)`,
      examTip: 'For second-order ODEs, the discriminant of the characteristic equation tells you the system behavior immediately. On the FE exam, map b²-4ac directly to overdamped/critically damped/underdamped.',
      importantNote: 'The Laplace transform method is particularly powerful for ODEs with initial conditions. Transform the entire ODE, solve algebraically for F(s), then inverse-transform to get f(t).',
    },
  ],
  keyTakeaways: [
    'Separable ODEs: separate variables, integrate both sides.',
    'Linear first-order: use integrating factor μ = e^(∫P dx).',
    'Second-order characteristic equation: ar² + br + c = 0 determines solution form.',
    'Complex roots mean oscillatory (underdamped) behavior.',
    'Laplace transforms convert differential equations to algebraic equations.',
    'Final Value Theorem: steady-state = lim(s→0) sF(s).',
  ],
},

fme_vector_calc: {
  topicId: 'fme_vector_calc',
  title: 'Vector Calculus',
  domainWeight: 'Mathematics · 6–9%',
  overview: 'Vector calculus extends single-variable calculus to fields and surfaces. Gradient, divergence, curl, and integral theorems are essential for understanding fluid flow, heat transfer, and stress fields in mechanical engineering.',
  sections: [
    {
      id: 'vc-operations',
      title: '1. Vector Operations and Fields',
      content: `## 1.1 Vector Algebra

**Dot product**: A·B = |A||B|cosθ = AxBx + AyBy + AzBz (scalar result)
**Cross product**: A×B = |A||B|sinθ n̂ (vector result, direction by right-hand rule)

| Operation | Result Type | Geometric Meaning |
|---|---|---|
| A·B | Scalar | Projection of A onto B |
| A×B | Vector | Area of parallelogram, perpendicular direction |
| A·(B×C) | Scalar | Volume of parallelepiped |

## 1.2 Gradient, Divergence, and Curl

**Gradient** of a scalar field f:
- **∇f = (∂f/∂x)î + (∂f/∂y)ĵ + (∂f/∂z)k̂**
- Points in direction of steepest increase; magnitude = rate of increase

**Divergence** of a vector field F:
- **∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z**
- Measures net outflow from a point (source/sink)

**Curl** of a vector field F:
- **∇×F** (determinant of 3×3 matrix with î, ĵ, k̂, partials, and F components)
- Measures local rotation of the field`,
      examTip: 'The dot product gives zero for perpendicular vectors; the cross product gives zero for parallel vectors. This is a quick check on the FE exam.',
    },
    {
      id: 'vc-theorems',
      title: '2. Integral Theorems',
      content: `## 2.1 Line and Surface Integrals

**Line integral of a vector field**: ∫_C F·dr = ∫_a^b F(r(t))·r'(t) dt

**Surface integral**: ∬_S F·dA = ∬_S F·n̂ dA (flux through surface)

## 2.2 Fundamental Theorems

**Green's Theorem** (2D): ∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA

**Stokes' Theorem**: ∮_C F·dr = ∬_S (∇×F)·dA
- Relates circulation around a curve to curl flux through the surface

**Divergence Theorem**: ∯_S F·dA = ∭_V (∇·F) dV
- Relates flux through a closed surface to divergence within the volume

| Theorem | Relates | Dimension |
|---|---|---|
| Green's | Line integral ↔ double integral | 2D |
| Stokes' | Line integral ↔ surface integral | 3D |
| Divergence | Surface integral ↔ volume integral | 3D |`,
      importantNote: 'The Divergence Theorem is used extensively in fluid mechanics and heat transfer to convert surface integrals (flux) to volume integrals (source terms). Understanding this connection helps with conservation equations.',
    },
  ],
  keyTakeaways: [
    'Dot product: scalar result, measures projection; zero for perpendicular vectors.',
    'Cross product: vector result, gives area and perpendicular direction; zero for parallel vectors.',
    'Gradient points toward steepest ascent; divergence measures source/sink; curl measures rotation.',
    'Divergence Theorem converts closed surface integrals to volume integrals.',
    'Stokes\' Theorem converts line integrals to surface integrals of curl.',
  ],
},

fme_numerical: {
  topicId: 'fme_numerical',
  title: 'Numerical Methods',
  domainWeight: 'Mathematics · 6–9%',
  overview: 'Numerical methods approximate solutions when analytical methods fail. The FE exam tests root-finding (Newton-Raphson, bisection), numerical integration (trapezoidal, Simpson\'s), and numerical ODE solvers (Euler\'s method).',
  sections: [
    {
      id: 'num-roots',
      title: '1. Root-Finding Methods',
      content: `## 1.1 Newton-Raphson Method

Iterative formula: **x_{n+1} = x_n - f(x_n)/f'(x_n)**

- Converges quadratically near simple roots
- Requires f'(x) ≠ 0 at iterates
- May diverge with poor initial guess

## 1.2 Bisection Method

For continuous f(x) with f(a)·f(b) < 0:
1. Compute midpoint c = (a+b)/2
2. If f(c) = 0, done; if f(a)·f(c) < 0, set b = c; else set a = c
3. Repeat until |b-a| < tolerance

| Method | Convergence | Pros | Cons |
|---|---|---|---|
| Newton-Raphson | Quadratic | Fast near root | Needs derivative, may diverge |
| Bisection | Linear | Always converges | Slow, needs bracket |
| Secant | Superlinear | No derivative needed | May diverge |

## 1.3 Fixed-Point Iteration

Rewrite f(x) = 0 as x = g(x), then iterate x_{n+1} = g(x_n).
Converges if |g'(x)| < 1 near the fixed point.`,
      examTip: 'Newton-Raphson is the most commonly tested numerical method on the FE exam. Be ready to perform 1-2 iterations by hand. The key formula is x_{n+1} = x_n - f(x_n)/f\'(x_n).',
    },
    {
      id: 'num-integration',
      title: '2. Numerical Integration and ODE Solvers',
      content: `## 2.1 Numerical Integration

**Trapezoidal Rule**: ∫_a^b f(x)dx ≈ (h/2)[f(a) + 2f(x₁) + 2f(x₂) + ... + f(b)]
- Error: O(h²) — second-order accurate

**Simpson's 1/3 Rule**: ∫_a^b f(x)dx ≈ (h/3)[f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + f(x_n)]
- Requires even number of intervals
- Error: O(h⁴) — fourth-order accurate

## 2.2 Euler's Method for ODEs

Given dy/dx = f(x, y), y(x₀) = y₀:

**y_{n+1} = y_n + h·f(x_n, y_n)**

- First-order accurate: error O(h)
- Simple but requires small step size for accuracy

**Improved Euler (Heun's)**: Average the slopes at start and predicted end:
- k₁ = f(x_n, y_n)
- k₂ = f(x_n + h, y_n + h·k₁)
- y_{n+1} = y_n + (h/2)(k₁ + k₂)

## 2.3 Runge-Kutta (RK4)

Fourth-order method with four slope evaluations per step:
- Error: O(h⁴) per step — much more accurate than Euler
- Most common general-purpose ODE solver`,
      examTip: 'Simpson\'s rule is more accurate than trapezoidal (O(h⁴) vs O(h²)), but requires an even number of intervals. If the problem gives an odd number of intervals, use the trapezoidal rule.',
    },
  ],
  keyTakeaways: [
    'Newton-Raphson: x_{n+1} = x_n - f(x_n)/f\'(x_n); quadratic convergence.',
    'Bisection always converges but is slow; needs f(a)·f(b) < 0.',
    'Trapezoidal rule: O(h²); Simpson\'s 1/3 rule: O(h⁴) with even intervals.',
    'Euler\'s method: y_{n+1} = y_n + h·f(x_n, y_n); simple but first-order only.',
    'RK4 is fourth-order accurate and the standard ODE solver for engineering.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 1 — PROBABILITY & STATISTICS  (3 curriculum IDs)  ·  4–6 %
 * ══════════════════════════════════════════════════════════════════ */

fme_prob_dist: {
  topicId: 'fme_prob_dist',
  title: 'Probability Distributions',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Probability and statistics provide the tools for dealing with uncertainty in engineering: quality control, reliability analysis, and experimental data interpretation. The FE exam tests basic probability rules, common distributions, and descriptive statistics.',
  sections: [
    {
      id: 'prob-basics',
      title: '1. Probability Rules and Common Distributions',
      content: `## 1.1 Fundamental Probability Rules

- **Addition Rule**: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
- **Multiplication Rule**: P(A ∩ B) = P(A) · P(B|A)
- **Independent Events**: P(A ∩ B) = P(A) · P(B)
- **Complement**: P(A') = 1 - P(A)
- **Bayes' Theorem**: P(A|B) = P(B|A)·P(A) / P(B)

## 1.2 Discrete Distributions

**Binomial**: X ~ Bin(n, p)
- P(X=k) = C(n,k)·p^k·(1-p)^(n-k)
- Mean: μ = np, Variance: σ² = np(1-p)

**Poisson**: X ~ Poi(λ)
- P(X=k) = λ^k·e^(-λ)/k!
- Mean = Variance = λ
- Models rare events per unit time/area

## 1.3 Continuous Distributions

**Normal (Gaussian)**: X ~ N(μ, σ²)
- f(x) = (1/(σ√(2π)))·exp(-(x-μ)²/(2σ²))
- **68-95-99.7 Rule**: 68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ
- **Z-score**: Z = (X - μ)/σ

**Exponential**: X ~ Exp(λ)
- f(x) = λe^(-λx) for x ≥ 0
- Mean = 1/λ, models time between events

| Distribution | Type | Mean | Variance | Use Case |
|---|---|---|---|---|
| Binomial | Discrete | np | np(1-p) | Pass/fail trials |
| Poisson | Discrete | λ | λ | Rare event counts |
| Normal | Continuous | μ | σ² | General measurements |
| Exponential | Continuous | 1/λ | 1/λ² | Time between events |`,
      examTip: 'The Z-score conversion Z = (X-μ)/σ is tested frequently. Once you convert to standard normal, use the Z-table in the FE reference handbook to find probabilities.',
      importantNote: 'The 68-95-99.7 rule for normal distributions is a quick mental check: roughly 95% of data falls within 2 standard deviations of the mean. Use this to estimate probabilities without looking up tables.',
    },
  ],
  keyTakeaways: [
    'Addition rule: P(A∪B) = P(A) + P(B) - P(A∩B); subtract overlap.',
    'Binomial: n independent trials with probability p; mean = np.',
    'Normal distribution: Z = (X-μ)/σ converts to standard normal.',
    '68-95-99.7 rule gives quick probability estimates for normal data.',
    'Exponential distribution models time between events with constant rate.',
  ],
},

fme_regression: {
  topicId: 'fme_regression',
  title: 'Regression & Curve Fitting',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Regression analysis fits mathematical models to experimental data. Linear regression is the most common technique tested on the FE exam, but understanding goodness of fit (R²) and basic curve fitting is also important.',
  sections: [
    {
      id: 'reg-linear',
      title: '1. Linear Regression and Correlation',
      content: `## 1.1 Simple Linear Regression

The best-fit line **y = a + bx** minimizes the sum of squared residuals.

**Slope**: b = [n·Σxy - (Σx)(Σy)] / [n·Σx² - (Σx)²]

Alternatively: **b = r · (s_y / s_x)** where r is correlation coefficient.

**Intercept**: a = ȳ - b·x̄

## 1.2 Correlation Coefficient

**r = Σ[(x_i - x̄)(y_i - ȳ)] / √[Σ(x_i - x̄)² · Σ(y_i - ȳ)²]**

| r Value | Interpretation |
|---|---|
| r = +1 | Perfect positive linear correlation |
| r = -1 | Perfect negative linear correlation |
| r = 0 | No linear correlation |
| |r| > 0.8 | Strong linear relationship |

**Coefficient of Determination**: R² = r²
- Represents the fraction of variance in y explained by x
- R² = 0.85 means 85% of y-variation is explained by the model

## 1.3 Linearization of Nonlinear Models

Some nonlinear relationships can be linearized for regression:

| Model | Transformation | Linear Form |
|---|---|---|
| y = ae^(bx) | Take ln | ln(y) = ln(a) + bx |
| y = ax^b | Take ln | ln(y) = ln(a) + b·ln(x) |
| y = a + b/x | Let X = 1/x | y = a + bX |`,
      examTip: 'R² tells you goodness of fit. On the FE exam, if asked "what fraction of variance is explained," the answer is R². If given r, just square it.',
    },
  ],
  keyTakeaways: [
    'Linear regression minimizes sum of squared residuals.',
    'Slope b = r·(s_y/s_x); intercept a = ȳ - b·x̄.',
    'Correlation coefficient r ranges from -1 to +1; r² = R² is fraction of variance explained.',
    'Nonlinear models (exponential, power) can be linearized by taking logarithms.',
  ],
},

fme_hypothesis: {
  topicId: 'fme_hypothesis',
  title: 'Hypothesis Testing & Estimation',
  domainWeight: 'Probability & Statistics · 4–6%',
  overview: 'Hypothesis testing determines whether observed data supports a claim about a population parameter. The FE exam tests t-tests, confidence intervals, and the basic framework of null vs. alternative hypotheses.',
  sections: [
    {
      id: 'hyp-framework',
      title: '1. Hypothesis Testing Framework',
      content: `## 1.1 Null and Alternative Hypotheses

- **H₀ (null hypothesis)**: The default claim (e.g., μ = μ₀)
- **H₁ (alternative hypothesis)**: The claim being tested (e.g., μ ≠ μ₀)

## 1.2 t-Test for a Single Mean

**Test statistic**: t = (x̄ - μ₀) / (s / √n)

- Degrees of freedom: df = n - 1
- Compare |t| to critical value t_α from t-table

| Decision | Condition |
|---|---|
| Reject H₀ | |t| > t_critical |
| Fail to reject H₀ | |t| ≤ t_critical |

## 1.3 Type I and Type II Errors

| | H₀ True | H₀ False |
|---|---|---|
| Reject H₀ | Type I error (α) | Correct (power) |
| Fail to reject | Correct | Type II error (β) |

- **α (significance level)**: Probability of Type I error (typically 0.05)
- **β**: Probability of Type II error
- **Power = 1 - β**: Probability of correctly rejecting a false H₀

## 1.4 Confidence Intervals

A **95% confidence interval** for the mean:

**x̄ ± t_(α/2, n-1) · (s / √n)**

The interval gets narrower with larger n (more data) or smaller s (less variability).`,
      examTip: 'The t-test formula t = (x̄ - μ₀)/(s/√n) appears repeatedly on the FE exam. Remember: x̄ is sample mean, μ₀ is hypothesized value, s is sample standard deviation, n is sample size.',
      importantNote: 'Failing to reject H₀ does NOT prove H₀ is true. It only means there is insufficient evidence to reject it at the given significance level.',
    },
  ],
  keyTakeaways: [
    't-test statistic: t = (x̄ - μ₀)/(s/√n) with df = n-1.',
    'Type I error (α): rejecting a true H₀; Type II error (β): failing to reject a false H₀.',
    'Confidence interval: x̄ ± t·(s/√n); wider for smaller n or larger s.',
    'Significance level α = 0.05 is the standard threshold for FE exam problems.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 2 — COMPUTATIONAL TOOLS  (2 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fme_spreadsheets: {
  topicId: 'fme_spreadsheets',
  title: 'Spreadsheet & Data Analysis',
  domainWeight: 'Computational Tools · 3–5%',
  overview: 'Spreadsheets are used extensively in mechanical engineering for data analysis, iterative calculations, and quick modeling. The FE exam tests understanding of cell references, common functions, and structured data analysis.',
  sections: [
    {
      id: 'ss-basics',
      title: '1. Spreadsheet Fundamentals',
      content: `## 1.1 Cell References

- **Relative reference** (A1): Adjusts when formula is copied
- **Absolute reference** ($A$1): Stays fixed when copied
- **Mixed reference** ($A1 or A$1): One dimension fixed, other adjusts

## 1.2 Common Functions

| Function | Purpose | Example |
|---|---|---|
| SUM | Adds range | =SUM(A1:A10) |
| AVERAGE | Arithmetic mean | =AVERAGE(B1:B20) |
| STDEV | Standard deviation | =STDEV(C1:C50) |
| IF | Conditional logic | =IF(A1>10,"High","Low") |
| VLOOKUP | Table lookup | =VLOOKUP(key, range, col, FALSE) |
| LINEST | Regression | Returns slope, intercept, R² |
| GOAL SEEK | Solve for input | Finds x given target y |

## 1.3 Iterative Calculations

Spreadsheets can perform iterative solving:
- **Goal Seek**: Adjusts one input cell to achieve a target output
- **Solver**: Optimizes an objective function subject to constraints
- **Circular references with iteration**: Enable for convergent iterative formulas`,
      examTip: 'The FE exam may show a spreadsheet screenshot and ask what a formula produces. Trace through cell references carefully — absolute references ($) are the key to getting the right answer.',
    },
  ],
  keyTakeaways: [
    'Absolute references ($A$1) stay fixed when copying formulas.',
    'SUM, AVERAGE, STDEV, IF, and VLOOKUP are the most common functions.',
    'Goal Seek finds an input value that produces a desired output.',
    'LINEST returns regression parameters (slope, intercept, R²) from data.',
  ],
},

fme_modeling: {
  topicId: 'fme_modeling',
  title: 'Engineering Modeling & Simulation',
  domainWeight: 'Computational Tools · 3–5%',
  overview: 'Engineering modeling involves translating physical problems into mathematical representations solvable by computational tools. The FE exam tests understanding of modeling approaches, assumptions, verification, and validation.',
  sections: [
    {
      id: 'mod-approach',
      title: '1. Modeling Approaches',
      content: `## 1.1 Types of Models

| Model Type | Description | Example |
|---|---|---|
| Analytical | Closed-form mathematical solution | Beam deflection formula |
| Numerical (FEA) | Discretize domain, solve approximately | Stress in complex geometry |
| Empirical | Based on experimental data | Friction correlations |
| Statistical | Probabilistic, data-driven | Reliability models |

## 1.2 Finite Element Method (FEM) Basics

FEM discretizes a continuous domain into **elements** connected at **nodes**:
1. **Discretize** geometry into a mesh
2. **Formulate** element equations (stiffness matrices)
3. **Assemble** global system: [K]{u} = {F}
4. **Apply** boundary conditions
5. **Solve** for nodal displacements
6. **Post-process** for stresses, strains

Key concepts:
- **Mesh refinement**: Finer mesh → more accurate but slower
- **Convergence**: Results should stabilize as mesh is refined
- **Element types**: 1D (beams), 2D (plane stress/strain), 3D (solid)

## 1.3 Verification vs. Validation

- **Verification**: "Did we solve the equations right?" — checking math/code correctness
- **Validation**: "Did we solve the right equations?" — comparing model to physical reality`,
      examTip: 'Verification checks computational correctness (mesh convergence studies); validation checks physical correctness (comparison to experimental data). The FE exam distinguishes between these.',
      importantNote: 'On the FE exam, FEM questions typically focus on conceptual understanding rather than computation: when to use FEM, what boundary conditions mean, and how mesh refinement affects accuracy.',
    },
  ],
  keyTakeaways: [
    'Analytical models give exact solutions; numerical models approximate complex geometries.',
    'FEM: discretize → formulate → assemble → solve → post-process.',
    'Mesh refinement improves accuracy but increases computational cost.',
    'Verification = solving equations right; Validation = solving the right equations.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 3 — ETHICS & PROFESSIONAL PRACTICE  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fme_codes_ethics: {
  topicId: 'fme_codes_ethics',
  title: 'Codes of Ethics',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Professional ethics govern the conduct of licensed engineers. The FE exam tests the NCEES Model Rules, the NSPE Code of Ethics, and ethical decision-making in engineering practice.',
  sections: [
    {
      id: 'eth-codes',
      title: '1. NSPE Code of Ethics — Fundamental Canons',
      content: `## 1.1 The Six Fundamental Canons

Engineers, in the fulfillment of their professional duties, shall:

1. **Hold paramount** the safety, health, and welfare of the public
2. **Perform services** only in areas of their competence
3. **Issue public statements** only in an objective and truthful manner
4. **Act for each employer/client** as faithful agents or trustees
5. **Avoid deceptive acts**
6. **Conduct themselves** honorably, responsibly, ethically, and lawfully

## 1.2 Rules of Practice

Key rules under the canons:
- Engineers shall **approve only work they are competent** to review
- Engineers shall **not reveal confidential information** without consent
- Engineers shall **not be influenced** by conflicting interests
- Engineers shall **not accept compensation** from more than one party for the same work without disclosure

## 1.3 Professional Obligations

- Engineers shall **acknowledge errors** and not distort facts
- Engineers shall **advise clients** when a project will not be successful
- Engineers shall **give credit** for engineering work to those to whom it is due
- Engineers shall **not compete unfairly** with other engineers`,
      examTip: 'Canon #1 — public safety is ALWAYS the top priority. On the FE exam, when in doubt, choose the answer that prioritizes public safety over client wishes, employer demands, or cost savings.',
      importantNote: 'The NSPE Code applies to ALL engineers, not just PEs. FE exam ethics questions often present scenarios where an engineer must choose between employer loyalty and public safety — public safety always wins.',
    },
  ],
  keyTakeaways: [
    'Canon #1: Public safety, health, and welfare are paramount — always the top priority.',
    'Engineers must only practice in areas of their competence.',
    'Confidential information must not be disclosed without consent.',
    'Engineers must acknowledge errors and advise clients of project risks.',
    'When ethics conflict, public safety overrides employer or client demands.',
  ],
},

fme_licensure: {
  topicId: 'fme_licensure',
  title: 'Professional Licensure',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Professional engineering licensure protects the public by ensuring only qualified individuals practice engineering. The FE exam tests the licensure pathway, requirements, and the significance of the PE license.',
  sections: [
    {
      id: 'lic-pathway',
      title: '1. Licensure Requirements and Process',
      content: `## 1.1 The Licensure Pathway

| Step | Requirement | Details |
|---|---|---|
| 1 | Education | ABET-accredited BS in engineering |
| 2 | FE Exam | Fundamentals of Engineering exam |
| 3 | Experience | 4 years progressive engineering experience |
| 4 | PE Exam | Principles and Practice of Engineering exam |

## 1.2 Who Needs a PE License?

A PE license is required to:
- **Offer engineering services** to the public
- **Sign and seal** engineering documents
- **Take responsibility** as the engineer of record

**Industrial exemption**: Engineers working under the industrial exemption (for a company, not offering services to the public) may not need a PE in some jurisdictions.

## 1.3 Continuing Education

Most states require **continuing professional development (CPD)** to maintain licensure:
- Typically **15-30 PDH (Professional Development Hours)** per renewal period
- May include courses, seminars, publications, patents, teaching`,
      examTip: 'The FE exam pathway: ABET degree → FE exam → 4 years experience → PE exam. Remember that ABET accreditation of the degree program is a key requirement.',
    },
  ],
  keyTakeaways: [
    'Licensure pathway: ABET degree → FE exam → experience → PE exam.',
    'PE license required to offer engineering services to the public.',
    'Industrial exemption may allow practice without PE in some jurisdictions.',
    'Continuing education (PDH) is required to maintain licensure.',
  ],
},

fme_liability: {
  topicId: 'fme_liability',
  title: 'Professional & Legal Liability',
  domainWeight: 'Ethics & Professional Practice · 3–5%',
  overview: 'Engineers face legal and professional liability for their work. Understanding negligence, standard of care, and contractual obligations helps engineers manage risk and practice responsibly.',
  sections: [
    {
      id: 'liab-types',
      title: '1. Types of Liability',
      content: `## 1.1 Negligence

An engineer is negligent when they fail to exercise the **standard of care** — the level of skill and diligence that a reasonably competent engineer would exercise under similar circumstances.

Four elements of negligence:
1. **Duty**: The engineer owed a duty of care
2. **Breach**: The engineer failed to meet the standard of care
3. **Causation**: The breach caused the harm
4. **Damages**: Actual harm or loss occurred

## 1.2 Types of Legal Liability

| Type | Basis | Example |
|---|---|---|
| Negligence | Failure of standard of care | Design error causing injury |
| Breach of contract | Violating contract terms | Missing deadline, scope |
| Strict liability | Liability without fault | Defective product (manufacturer) |
| Professional malpractice | Below professional standard | Incorrect calculations |

## 1.3 Risk Management

Engineers manage liability through:
- **Professional liability insurance** (errors & omissions, E&O)
- **Clear contracts** specifying scope, limitations, and responsibilities
- **Thorough documentation** of decisions, calculations, and assumptions
- **Peer review** of critical designs and calculations
- **Adherence to codes and standards**`,
      examTip: 'On the FE exam, negligence requires ALL four elements: duty, breach, causation, and damages. If any one is missing, negligence is not established.',
    },
  ],
  keyTakeaways: [
    'Negligence requires duty, breach, causation, and damages — all four elements.',
    'Standard of care = what a reasonably competent engineer would do.',
    'Strict liability applies to defective products regardless of fault.',
    'Professional liability insurance (E&O) is essential for practicing engineers.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 4 — ENGINEERING ECONOMICS  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fme_tvm: {
  topicId: 'fme_tvm',
  title: 'Time Value of Money',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'The time value of money (TVM) is the principle that a dollar today is worth more than a dollar in the future due to its earning potential. TVM calculations underpin all economic analysis on the FE exam.',
  sections: [
    {
      id: 'tvm-factors',
      title: '1. TVM Factors and Formulas',
      content: `## 1.1 Single Payment Factors

**Future Value** of a present amount:
- **F = P(1 + i)^n** — Compound Amount Factor (F/P, i, n)

**Present Value** of a future amount:
- **P = F/(1 + i)^n** — Present Worth Factor (P/F, i, n)

## 1.2 Uniform Series Factors

| Factor | Formula | Notation |
|---|---|---|
| Sinking Fund | A = F·[i/((1+i)^n - 1)] | (A/F, i, n) |
| Capital Recovery | A = P·[i(1+i)^n/((1+i)^n - 1)] | (A/P, i, n) |
| Series Present Worth | P = A·[((1+i)^n - 1)/(i(1+i)^n)] | (P/A, i, n) |
| Series Compound Amount | F = A·[((1+i)^n - 1)/i] | (F/A, i, n) |

## 1.3 Gradient Series

**Arithmetic gradient**: Cash flow increases by G each period.
- P_G = G·[((1+i)^n - in - 1) / (i²(1+i)^n)]

**Geometric gradient**: Cash flow increases by g% each period.
- P = A₁·[(1 - (1+g)^n·(1+i)^(-n)) / (i - g)] when i ≠ g

## 1.4 Effective Interest Rate

**Effective annual rate**: i_eff = (1 + r/m)^m - 1

where r = nominal annual rate, m = compounding periods per year.`,
      examTip: 'The FE reference handbook has factor tables — learn to read them. Look up (P/A, i%, n) directly instead of computing the formula. This saves significant time on exam day.',
      importantNote: 'Cash flow diagrams are essential. Draw them FIRST: upward arrows for receipts, downward arrows for disbursements. This prevents sign errors that are the #1 mistake in economics problems.',
    },
  ],
  keyTakeaways: [
    'F = P(1+i)^n is the fundamental compound interest formula.',
    'Use factor notation (P/A, i, n) and the reference handbook tables for speed.',
    'Effective rate: i_eff = (1 + r/m)^m - 1 converts nominal to effective.',
    'Always draw cash flow diagrams before solving — prevents sign errors.',
    'Arithmetic gradient adds constant G per period; geometric gradient multiplies by (1+g).',
  ],
},

fme_cost_analysis: {
  topicId: 'fme_cost_analysis',
  title: 'Cost Analysis & Decision Making',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'Engineering cost analysis compares alternatives using equivalent economic measures. The FE exam tests present worth, annual worth, rate of return, and benefit-cost analysis methods.',
  sections: [
    {
      id: 'cost-methods',
      title: '1. Comparison Methods',
      content: `## 1.1 Present Worth (PW) Analysis

Convert all cash flows to **present value** at the MARR (Minimum Attractive Rate of Return):

**PW = -Initial Cost + PW(benefits) - PW(costs)**

- For mutually exclusive alternatives: Choose the one with the **highest PW**
- For equal-life alternatives: Direct comparison
- For unequal lives: Use **least common multiple** or **study period**

## 1.2 Annual Worth (AW) Analysis

Convert all cash flows to an **equivalent annual amount**:

**AW = PW · (A/P, i, n)**

- Advantage: Automatically accounts for unequal lives
- Choose alternative with **highest AW**

## 1.3 Rate of Return (ROR) Analysis

Find the interest rate that makes PW = 0:

**0 = -Initial Cost + Σ [Cash Flow_t / (1+i*)^t]**

- If i* ≥ MARR, the project is economically justified
- For mutually exclusive alternatives: Use **incremental ROR** on the difference

## 1.4 Benefit-Cost Ratio

**B/C = PW(Benefits) / PW(Costs)**

- B/C ≥ 1.0: Project is justified
- Used primarily for public projects`,
      examTip: 'For mutually exclusive alternatives with unequal lives, Annual Worth analysis is the easiest method because it inherently handles different lifespans. Avoid present worth unless lives are equal or you use LCM.',
    },
  ],
  keyTakeaways: [
    'Present Worth: convert all cash flows to time zero; choose highest PW.',
    'Annual Worth: equivalent uniform annual amount; handles unequal lives automatically.',
    'Rate of Return: interest rate making PW = 0; compare to MARR.',
    'Benefit-Cost ratio ≥ 1.0 justifies a project (common for public works).',
    'Incremental analysis is required for mutually exclusive alternatives using ROR.',
  ],
},

fme_depreciation: {
  topicId: 'fme_depreciation',
  title: 'Depreciation & Taxes',
  domainWeight: 'Engineering Economics · 3–5%',
  overview: 'Depreciation allocates the cost of a tangible asset over its useful life for tax purposes. The FE exam tests straight-line, declining balance, and MACRS depreciation methods.',
  sections: [
    {
      id: 'dep-methods',
      title: '1. Depreciation Methods',
      content: `## 1.1 Straight-Line Depreciation

**D = (B - S) / n**

Where: B = initial cost (basis), S = salvage value, n = useful life in years.

**Book value** at year k: BV_k = B - k·D

## 1.2 Declining Balance Depreciation

**D_k = d · BV_{k-1}**

Where d = depreciation rate (for double-declining: d = 2/n).

- Never depreciate below salvage value
- Switch to straight-line when SL gives larger deduction

## 1.3 MACRS (Modified Accelerated Cost Recovery System)

The **US tax code standard**:
- Uses specific recovery periods (3, 5, 7, 10, 15, 20 years)
- Salvage value = 0 (always)
- Uses 200% declining balance switching to straight-line
- Half-year convention in first and last year

| MACRS Property Class | Examples |
|---|---|
| 3-year | Special tools, R&D equipment |
| 5-year | Vehicles, computers, office equipment |
| 7-year | Office furniture, most manufacturing equipment |
| 10-year | Water transportation equipment |

## 1.4 After-Tax Analysis

**After-tax cash flow = Before-tax cash flow - Taxes**
**Taxes = (Taxable income) × Tax rate**
**Taxable income = Revenue - Expenses - Depreciation**

Depreciation creates a **tax shield**: Tax savings = D × Tax rate`,
      examTip: 'MACRS always assumes salvage value = 0 and uses half-year convention. The FE reference handbook provides MACRS tables — use them directly instead of computing rates.',
      importantNote: 'Depreciation is a non-cash expense — it reduces taxable income but does not represent actual cash outflow. The real benefit is the tax shield: the reduction in taxes due to the depreciation deduction.',
    },
  ],
  keyTakeaways: [
    'Straight-line: D = (B-S)/n; simplest method, equal annual deductions.',
    'Declining balance: D_k = d·BV_{k-1}; accelerated, larger early deductions.',
    'MACRS: S=0, half-year convention, standard for US tax calculations.',
    'Tax shield = Depreciation × Tax rate; represents actual cash savings.',
    'Book value = Initial cost minus accumulated depreciation.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 5 — STATICS  (4 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

fme_equilibrium: {
  topicId: 'fme_equilibrium',
  title: 'Force Systems & Equilibrium',
  domainWeight: 'Statics · 7–11%',
  overview: 'Static equilibrium is the foundation of structural and machine analysis. A body is in equilibrium when the net force and net moment acting on it are both zero. The FE exam heavily tests free body diagrams and equilibrium equations.',
  sections: [
    {
      id: 'eq-forces',
      title: '1. Force Systems and Free Body Diagrams',
      content: `## 1.1 Types of Forces

- **Concentrated force**: Acts at a single point (N or lb)
- **Distributed load**: Force per unit length (N/m or lb/ft)
- **Moment/Couple**: Tendency to rotate (N·m or ft·lb)

## 1.2 Resultant of Force Systems

For concurrent forces:
- **R_x = ΣF_x**, **R_y = ΣF_y**
- **R = √(R_x² + R_y²)**, **θ = arctan(R_y/R_x)**

For a distributed load w(x):
- **Resultant = ∫w(x)dx** (area under load diagram)
- **Location**: at centroid of load distribution

## 1.3 Equilibrium Equations

For a rigid body in 2D equilibrium:

**ΣFx = 0, ΣFy = 0, ΣM_A = 0**

These three equations can solve for up to **3 unknowns**.

For 3D equilibrium: **ΣFx = ΣFy = ΣFz = 0** and **ΣMx = ΣMy = ΣMz = 0** (6 equations, 6 unknowns)

## 1.4 Support Reactions

| Support Type | Reactions Provided |
|---|---|
| Pin/Hinge | Fx, Fy (2 reactions) |
| Roller | F perpendicular to surface (1 reaction) |
| Fixed/Cantilever | Fx, Fy, M (3 reactions) |
| Cable/Link | Tension along the cable (1 reaction) |`,
      examTip: 'ALWAYS draw a complete free body diagram (FBD) before writing equilibrium equations. Show ALL external forces, reactions, and moments. Taking moments about a point where two unknowns intersect eliminates them from the equation.',
      importantNote: 'A structure is statically determinate if the number of unknowns equals the number of independent equilibrium equations. If there are more unknowns than equations, it is statically indeterminate and requires additional compatibility equations.',
    },
  ],
  keyTakeaways: [
    '2D equilibrium: ΣFx = 0, ΣFy = 0, ΣM = 0 — three equations for three unknowns.',
    'Pin supports provide 2 reactions; rollers provide 1; fixed supports provide 3.',
    'Always draw a free body diagram before solving.',
    'Take moments about a point with multiple unknowns to simplify calculations.',
    'Distributed loads can be replaced by resultant force at the centroid.',
  ],
},

fme_trusses: {
  topicId: 'fme_trusses',
  title: 'Trusses, Frames & Machines',
  domainWeight: 'Statics · 7–11%',
  overview: 'Trusses are structures made of two-force members connected at joints. The FE exam tests the method of joints and method of sections for finding member forces, as well as analysis of frames and machines.',
  sections: [
    {
      id: 'truss-methods',
      title: '1. Truss Analysis Methods',
      content: `## 1.1 Assumptions for Ideal Trusses

- Members connected at joints by **frictionless pins**
- Loads applied **only at joints**
- Members are **two-force members** (axial force only: tension or compression)
- Members have **negligible weight**

## 1.2 Method of Joints

Analyze equilibrium at each joint:
1. Start at a joint with at most 2 unknowns
2. Apply ΣFx = 0, ΣFy = 0
3. Move to adjacent joints, using known forces

**Convention**: Assume tension (pulling away from joint). If result is negative, the member is in compression.

## 1.3 Method of Sections

Cut through the truss to expose internal forces:
1. Cut through no more than **3 members** with unknown forces
2. Apply 3 equilibrium equations (ΣFx, ΣFy, ΣM) to either section
3. Take moments about points where unknowns intersect

| Method | Best For |
|---|---|
| Method of Joints | Finding forces in ALL members |
| Method of Sections | Finding force in a SPECIFIC member |
| Zero-Force Members | Quick identification of unloaded members |

## 1.4 Zero-Force Members

Quick rules:
- At a joint where only **two non-collinear members** meet and no external load is applied, both are zero-force members
- At a joint where **three members** meet, two collinear, and no external load, the third is a zero-force member`,
      examTip: 'Method of Sections is the go-to when you need just ONE member force. Cut through the truss, take moments about a point that eliminates the other unknowns. This is faster than solving every joint.',
    },
  ],
  keyTakeaways: [
    'Truss members carry only axial loads (tension or compression).',
    'Method of Joints: solve equilibrium at each pin; max 2 unknowns per joint.',
    'Method of Sections: cut through ≤3 members, use 3 equilibrium equations.',
    'Zero-force members carry no load — identify them first to simplify analysis.',
    'Positive result = tension; negative result = compression (if tension assumed).',
  ],
},

fme_centroids: {
  topicId: 'fme_centroids',
  title: 'Centroids & Moments of Inertia',
  domainWeight: 'Statics · 7–11%',
  overview: 'Centroids locate the geometric center of an area, while moments of inertia quantify resistance to bending and rotation. Both are essential for beam analysis and mechanical design on the FE exam.',
  sections: [
    {
      id: 'cent-areas',
      title: '1. Centroids and Composite Areas',
      content: `## 1.1 Centroid of a Simple Area

**x̄ = ∫x dA / ∫dA**, **ȳ = ∫y dA / ∫dA**

## 1.2 Centroid of Composite Areas

Break complex shapes into simple shapes:

**x̄ = Σ(x̄_i · A_i) / ΣA_i**

| Shape | Area | Centroid from base |
|---|---|---|
| Rectangle b×h | bh | h/2 |
| Triangle b×h | bh/2 | h/3 from base |
| Circle radius r | πr² | r (center) |
| Semicircle | πr²/2 | 4r/(3π) from diameter |

For shapes with **cutouts**: subtract the cutout area and its moment.

## 1.3 Moment of Inertia (Second Moment of Area)

**I_x = ∫y² dA** (about x-axis)

| Shape | I about centroidal axis |
|---|---|
| Rectangle b×h | bh³/12 (about centroid) |
| Triangle b×h | bh³/36 (about centroid) |
| Circle radius r | πr⁴/4 |
| Semicircle | 0.1098r⁴ (about centroid) |

## 1.4 Parallel Axis Theorem

**I = I_c + A·d²**

Where I_c = moment of inertia about centroidal axis, A = area, d = distance between axes.

This is **essential** for composite cross-sections.`,
      examTip: 'The parallel axis theorem I = I_c + Ad² is one of the most tested formulas on the FE exam. Remember: always transfer FROM the centroidal axis. You cannot transfer between two non-centroidal axes directly.',
      importantNote: 'For composite shapes: find the overall centroid FIRST, then use the parallel axis theorem to transfer each sub-shape\'s moment of inertia to the composite centroid.',
    },
  ],
  keyTakeaways: [
    'Composite centroid: x̄ = Σ(x̄_i·A_i)/ΣA_i — weighted average of sub-shape centroids.',
    'Parallel axis theorem: I = I_c + Ad² — always transfers from centroidal axis.',
    'Rectangle I = bh³/12; Circle I = πr⁴/4 — memorize these.',
    'For cutouts, subtract area and moment contributions.',
    'Find composite centroid FIRST, then transfer moments of inertia.',
  ],
},

fme_friction: {
  topicId: 'fme_friction',
  title: 'Friction',
  domainWeight: 'Statics · 7–11%',
  overview: 'Friction is the resistance to sliding motion between surfaces. The FE exam tests dry (Coulomb) friction, wedge and belt friction, and the concepts of impending motion and static vs. kinetic friction.',
  sections: [
    {
      id: 'fric-coulomb',
      title: '1. Coulomb Friction and Applications',
      content: `## 1.1 Coulomb Friction Model

**Static friction**: F_s ≤ μ_s · N (maximum before sliding begins)
**Kinetic friction**: F_k = μ_k · N (during sliding)

Where N = normal force, μ = coefficient of friction.

**Key relationships**:
- μ_s > μ_k (static coefficient exceeds kinetic)
- Friction force acts **tangent to the contact surface**, opposing motion or impending motion
- At impending motion: F = μ_s · N (equality holds)

## 1.2 Inclined Plane

For a block on an incline at angle θ:
- **N = W·cosθ**
- **Friction force** = W·sinθ (for equilibrium)
- **Impending motion** when tanθ = μ_s → **θ_slip = arctan(μ_s)**

## 1.3 Wedge Friction

Wedges amplify force through friction:
- Draw FBD for each body separately
- Apply equilibrium to each body
- At impending motion, friction = μ·N on each surface

## 1.4 Belt Friction

For a flat belt over a drum:

**T₂ = T₁ · e^(μβ)**

Where T₂ = tight side tension, T₁ = slack side tension, β = wrap angle in **radians**.

| Condition | Formula |
|---|---|
| Impending slip | T₂/T₁ = e^(μ_s·β) |
| Belt power | P = (T₂ - T₁)·v |`,
      examTip: 'Belt friction: T₂ = T₁·e^(μβ) — the wrap angle β MUST be in radians. This is a very common FE exam question. Also remember that T₂ is always the tight (larger tension) side.',
    },
  ],
  keyTakeaways: [
    'Static friction: F ≤ μ_s·N; kinetic friction: F = μ_k·N.',
    'At impending motion on an incline: θ_slip = arctan(μ_s).',
    'Belt friction: T₂ = T₁·e^(μβ) with β in radians.',
    'μ_s > μ_k: it takes more force to start motion than to maintain it.',
    'Friction always opposes the direction of motion or impending motion.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 6 — DYNAMICS, KINEMATICS & VIBRATIONS  (5 curriculum IDs)  ·  9–14 %
 * ══════════════════════════════════════════════════════════════════ */

fme_kinematics: {
  topicId: 'fme_kinematics',
  title: 'Kinematics of Particles & Rigid Bodies',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Kinematics describes motion without considering forces. The FE exam tests rectilinear and curvilinear motion, relative motion, and rigid body kinematics including rotation and mechanisms.',
  sections: [
    {
      id: 'kin-particle',
      title: '1. Particle Kinematics',
      content: `## 1.1 Rectilinear Motion (Straight Line)

**Position**: s(t)
**Velocity**: v = ds/dt
**Acceleration**: a = dv/dt = d²s/dt²

For **constant acceleration**:
- v = v₀ + at
- s = s₀ + v₀t + ½at²
- v² = v₀² + 2a(s - s₀)

## 1.2 Curvilinear Motion

**Normal-Tangential (n-t) components**:
- a_t = dv/dt (tangential — changes speed)
- a_n = v²/ρ (normal — changes direction, ρ = radius of curvature)

**Projectile motion** (constant g, no drag):
- x = v₀·cosθ·t
- y = v₀·sinθ·t - ½gt²
- v_x = v₀·cosθ (constant)
- v_y = v₀·sinθ - gt

| Coordinate System | Best For |
|---|---|
| Rectangular (x, y) | Projectile motion |
| Normal-tangential (n, t) | Curved paths with known ρ |
| Polar (r, θ) | Orbits, rotating mechanisms |`,
      examTip: 'The three constant-acceleration equations are the most tested kinematics formulas. When you know three of the five variables (s₀, v₀, v, a, t), pick the equation containing the three knowns and the one unknown.',
    },
    {
      id: 'kin-rigid',
      title: '2. Rigid Body Kinematics',
      content: `## 2.1 Rotation About a Fixed Axis

**Angular position**: θ
**Angular velocity**: ω = dθ/dt
**Angular acceleration**: α = dω/dt

For **constant angular acceleration**:
- ω = ω₀ + αt
- θ = θ₀ + ω₀t + ½αt²
- ω² = ω₀² + 2α(θ - θ₀)

**Relationship to linear quantities** (point at distance r):
- v = rω, a_t = rα, a_n = rω² = v²/r

## 2.2 Relative Motion

For point B on a rigid body relative to point A:

**v_B = v_A + ω × r_{B/A}**

**a_B = a_A + α × r_{B/A} + ω × (ω × r_{B/A})**

## 2.3 Instantaneous Center of Zero Velocity (IC)

The IC is the point about which a rigid body appears to rotate at a given instant:
- All velocities are perpendicular to the line from the IC
- v = ω·d (where d = distance from IC)`,
      examTip: 'For rolling without slipping: v_center = Rω and a_center = Rα. The contact point has zero velocity (it is the instantaneous center). This constraint appears frequently on the FE exam.',
    },
  ],
  keyTakeaways: [
    'Constant acceleration: v = v₀ + at, s = s₀ + v₀t + ½at², v² = v₀² + 2a(s-s₀).',
    'Normal acceleration a_n = v²/ρ changes direction; tangential a_t = dv/dt changes speed.',
    'Angular motion mirrors linear: ω = dθ/dt, α = dω/dt, v = rω.',
    'Rolling without slip: v = Rω at the center; contact point has v = 0.',
    'Instantaneous center: all velocities perpendicular to line from IC.',
  ],
},

fme_kinetics: {
  topicId: 'fme_kinetics',
  title: 'Kinetics — Force, Mass & Acceleration',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Kinetics relates forces to motion using Newton\'s laws. The FE exam tests particle and rigid body kinetics, including Newton\'s second law, friction dynamics, and rotational equations of motion.',
  sections: [
    {
      id: 'kin-newton',
      title: '1. Newton\'s Laws and Applications',
      content: `## 1.1 Newton's Second Law

**ΣF = ma** (particle)
**ΣF = ma_G** (rigid body, G = center of mass)
**ΣM_G = I_G·α** (rigid body rotation)

For rotation about a fixed point O:
**ΣM_O = I_O·α**

## 1.2 Common Dynamic Systems

**Block on inclined plane** (sliding):
- Along plane: ma = mg·sinθ - μ_k·mg·cosθ
- a = g(sinθ - μ_k·cosθ)

**Pulley systems**:
- Draw FBD for each mass
- Tension is the same throughout an ideal (massless, frictionless) rope
- Use constraint equations to relate accelerations

**Circular motion**:
- ΣF_n = mv²/r = mrω² (centripetal direction)
- ΣF_t = m·a_t = m·r·α (tangential direction)

## 1.3 Mass Moment of Inertia

| Body | I about centroidal axis |
|---|---|
| Slender rod (length L) | mL²/12 |
| Solid cylinder (radius r) | mr²/2 |
| Hollow cylinder (r₁, r₂) | m(r₁² + r₂²)/2 |
| Solid sphere | 2mr²/5 |
| Thin disk | mr²/2 |

**Parallel axis theorem**: I_O = I_G + md²`,
      examTip: 'For rigid body problems, use ΣF = ma_G for translation and ΣM_G = I_G·α for rotation simultaneously. For rotation about a fixed point O, you can simplify to ΣM_O = I_O·α (using parallel axis theorem for I_O).',
      importantNote: 'Mass moment of inertia (kg·m²) is different from area moment of inertia (m⁴). Mass moment is used in dynamics (rotation); area moment is used in mechanics of materials (bending).',
    },
  ],
  keyTakeaways: [
    'Newton\'s second law: ΣF = ma for translation, ΣM = Iα for rotation.',
    'Mass moment of inertia: solid cylinder = mr²/2, slender rod = mL²/12.',
    'Parallel axis theorem: I_O = I_G + md².',
    'Centripetal acceleration: a_n = v²/r = rω² directed toward center.',
    'For pulleys, draw separate FBDs and use constraint equations for accelerations.',
  ],
},

fme_energy_methods: {
  topicId: 'fme_energy_methods',
  title: 'Work, Energy & Impulse-Momentum',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Energy and momentum methods provide powerful alternatives to Newton\'s laws for solving dynamics problems. Work-energy is ideal when forces vary with position; impulse-momentum is ideal for impacts and variable forces over time.',
  sections: [
    {
      id: 'energy-work',
      title: '1. Work-Energy Methods',
      content: `## 1.1 Work-Energy Theorem

**T₁ + ΣU₁₋₂ = T₂**

Where T = kinetic energy, U = work done by all forces.

**Kinetic energy**:
- Translation: T = ½mv²
- Rotation: T = ½Iω²
- General: T = ½mv_G² + ½I_G·ω²

**Work done by common forces**:

| Force | Work |
|---|---|
| Constant force F | U = F·d·cosθ |
| Spring (from x₁ to x₂) | U = ½k(x₁² - x₂²) |
| Gravity | U = -mg·Δh (positive downward) |
| Friction | U = -μ_k·N·d (always negative) |

## 1.2 Conservation of Energy

If only conservative forces (gravity, springs) do work:

**T₁ + V₁ = T₂ + V₂**

Where V = potential energy:
- Gravitational: V_g = mgh
- Elastic: V_e = ½kx²

## 1.3 Power and Efficiency

**Power**: P = dU/dt = F·v (for translation), P = M·ω (for rotation)

**Efficiency**: η = P_out / P_in = useful output / total input`,
      examTip: 'Use work-energy when you know forces and displacements but NOT time. Use impulse-momentum when you know forces and time but NOT displacement. Choosing the right method saves significant time on the FE exam.',
    },
    {
      id: 'energy-impulse',
      title: '2. Impulse-Momentum and Impact',
      content: `## 2.1 Linear Impulse-Momentum

**m·v₁ + Σ∫F dt = m·v₂**

The impulse ∫F dt equals the change in momentum.

## 2.2 Conservation of Linear Momentum

For a system with no external impulses:

**m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'** (before = after)

## 2.3 Impact (Collisions)

**Coefficient of restitution**: e = (v₂' - v₁') / (v₁ - v₂)

| Impact Type | e | Energy |
|---|---|---|
| Perfectly elastic | e = 1 | KE conserved |
| Partially inelastic | 0 < e < 1 | KE lost |
| Perfectly plastic | e = 0 | Maximum KE loss; objects stick |

## 2.4 Angular Impulse-Momentum

**I·ω₁ + Σ∫M dt = I·ω₂**

Conservation of angular momentum (no external torques):
**I₁ω₁ = I₂ω₂** (e.g., spinning figure skater pulling arms in)`,
      examTip: 'For collisions, you always need conservation of momentum. If e = 1 (elastic), also use conservation of kinetic energy. If e = 0 (plastic), objects have the same final velocity. For 0 < e < 1, use the coefficient of restitution equation.',
    },
  ],
  keyTakeaways: [
    'Work-energy: T₁ + ΣU = T₂; use when displacement is known.',
    'Impulse-momentum: mv₁ + ∫F dt = mv₂; use when time is known.',
    'Conservation of energy: T₁ + V₁ = T₂ + V₂ for conservative forces only.',
    'Coefficient of restitution: e = 1 (elastic), e = 0 (plastic).',
    'Power: P = F·v (translation) or P = M·ω (rotation).',
    'Friction always does negative work (removes energy from the system).',
  ],
},

fme_vibrations: {
  topicId: 'fme_vibrations',
  title: 'Mechanical Vibrations',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Vibration analysis is critical for machine design and structural integrity. The FE exam tests free and forced vibrations of single-degree-of-freedom systems, natural frequency, damping, and resonance.',
  sections: [
    {
      id: 'vib-free',
      title: '1. Free Vibration — Undamped and Damped',
      content: `## 1.1 Undamped Free Vibration

Equation of motion: **m·x'' + k·x = 0**

**Natural frequency**: ω_n = √(k/m) [rad/s]

**Natural frequency**: f_n = ω_n/(2π) [Hz]

**Period**: T = 1/f_n = 2π/ω_n

Solution: **x(t) = A·sin(ω_n·t + φ)**

## 1.2 Damped Free Vibration

Equation of motion: **m·x'' + c·x' + k·x = 0**

**Critical damping**: c_cr = 2√(km) = 2mω_n

**Damping ratio**: ζ = c/c_cr

| Damping Ratio | Behavior | Solution Form |
|---|---|---|
| ζ = 0 | Undamped | Harmonic oscillation |
| 0 < ζ < 1 | Underdamped | Decaying oscillation |
| ζ = 1 | Critically damped | Fastest non-oscillatory return |
| ζ > 1 | Overdamped | Slow non-oscillatory return |

**Underdamped response**: x(t) = A·e^(-ζω_n·t)·sin(ω_d·t + φ)

**Damped frequency**: ω_d = ω_n·√(1 - ζ²)

## 1.3 Equivalent Spring Constants

- **Springs in parallel**: k_eq = k₁ + k₂
- **Springs in series**: 1/k_eq = 1/k₁ + 1/k₂`,
      examTip: 'Natural frequency ω_n = √(k/m) is the single most important vibration formula on the FE exam. For springs in series, they act like resistors in parallel: 1/k_eq = 1/k₁ + 1/k₂.',
    },
    {
      id: 'vib-forced',
      title: '2. Forced Vibration and Resonance',
      content: `## 2.1 Harmonic Forcing

Equation: **m·x'' + c·x' + k·x = F₀·sin(ωt)**

Steady-state amplitude:

**X = F₀/k / √[(1-(ω/ω_n)²)² + (2ζ·ω/ω_n)²]**

**Phase angle**: φ = arctan[2ζ(ω/ω_n) / (1-(ω/ω_n)²)]

## 2.2 Resonance

**Resonance** occurs when ω ≈ ω_n:
- Undamped: amplitude → ∞ (theoretical)
- Damped: amplitude peaks near ω = ω_n·√(1-2ζ²)
- At resonance with light damping: X ≈ F₀/(2ζk) = F₀/(cω_n)

## 2.3 Transmissibility

**Force transmissibility** (ratio of transmitted to applied force):

**TR = √[1 + (2ζr)²] / √[(1-r²)² + (2ζr)²]**

Where r = ω/ω_n (frequency ratio).

- TR < 1 (vibration isolation) when r > √2, regardless of damping
- For effective isolation: operate at ω > √2·ω_n`,
      examTip: 'Resonance: ω ≈ ω_n causes maximum amplitude. Vibration isolation requires ω/ω_n > √2 ≈ 1.414. These are key numbers for the FE exam.',
      importantNote: 'In machine design, resonance must be avoided. Either design the system so that operating frequency is far from natural frequency, or add damping to limit amplitude at resonance.',
    },
  ],
  keyTakeaways: [
    'Natural frequency: ω_n = √(k/m); period T = 2π/ω_n.',
    'Damping ratio ζ = c/c_cr; ζ < 1 underdamped, ζ = 1 critical, ζ > 1 overdamped.',
    'Damped frequency: ω_d = ω_n√(1-ζ²); always less than ω_n.',
    'Resonance at ω ≈ ω_n; isolation requires ω/ω_n > √2.',
    'Springs in parallel add; springs in series: 1/k_eq = 1/k₁ + 1/k₂.',
  ],
},

fme_rigid_body: {
  topicId: 'fme_rigid_body',
  title: 'Rigid Body Dynamics',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Rigid body dynamics combines translational and rotational motion analysis. The FE exam tests rolling motion, planar kinetics, and the relationship between linear and angular quantities for rigid bodies.',
  sections: [
    {
      id: 'rb-planar',
      title: '1. Planar Rigid Body Kinetics',
      content: `## 1.1 General Planar Motion

For a rigid body in general planar motion, three equations govern:
1. **ΣFx = m·a_Gx** (translation in x)
2. **ΣFy = m·a_Gy** (translation in y)
3. **ΣM_G = I_G·α** (rotation about center of mass)

Alternatively, about a fixed point O: **ΣM_O = I_O·α**

## 1.2 Rolling Without Slipping

For a body rolling on a surface:
- **v_G = R·ω** (velocity constraint)
- **a_G = R·α** (acceleration constraint)
- Friction force ≤ μ_s·N (not necessarily at maximum)
- Contact point has **zero velocity**

## 1.3 Energy Methods for Rigid Bodies

**T = ½m·v_G² + ½I_G·ω²** (total kinetic energy)

For rolling without slip: T = ½(I_G + mR²)·ω² = ½I_O·ω²

## 1.4 Angular Momentum

**H_G = I_G·ω** (about center of mass)
**H_O = I_O·ω** (about fixed point O)

**ΣM_G = dH_G/dt** (Newton's second law for rotation)`,
      examTip: 'For rolling without slip problems, use the constraint v = Rω to reduce unknowns. The kinetic energy becomes T = ½(I_G + mR²)ω², which combines translation and rotation into a single expression.',
    },
  ],
  keyTakeaways: [
    'General planar motion: ΣF = ma_G and ΣM_G = I_G·α simultaneously.',
    'Rolling without slip: v_G = Rω, a_G = Rα; friction not necessarily at max.',
    'Total KE: T = ½mv_G² + ½I_Gω²; for rolling: T = ½I_O·ω².',
    'Angular momentum: H = Iω; ΣM = dH/dt.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 7 — MECHANICS OF MATERIALS  (5 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

fme_stress_strain: {
  topicId: 'fme_stress_strain',
  title: 'Stress, Strain & Material Behavior',
  domainWeight: 'Mechanics of Materials · 7–11%',
  overview: 'Stress and strain are the fundamental quantities in mechanics of materials. Understanding the stress-strain relationship, Hooke\'s law, and material properties from tensile tests is essential for the FE exam.',
  sections: [
    {
      id: 'ss-basics',
      title: '1. Stress and Strain Fundamentals',
      content: `## 1.1 Normal Stress and Strain

**Normal stress**: σ = F/A (force per unit area, Pa or psi)
**Normal strain**: ε = ΔL/L₀ (dimensionless)

## 1.2 Hooke's Law

**σ = E·ε** (in the elastic region)

Where E = Young's modulus (modulus of elasticity).

**Poisson's ratio**: ν = -ε_lateral / ε_axial (typically 0.25–0.35 for metals)

**Shear stress and strain**:
- **τ = G·γ** (shear Hooke's law)
- **G = E / [2(1 + ν)]** (shear modulus relation)

## 1.3 Stress-Strain Diagram

| Region/Point | Description |
|---|---|
| Proportional limit | End of linear stress-strain relationship |
| Elastic limit | Maximum stress for full recovery |
| Yield point (σ_y) | Onset of permanent deformation |
| Ultimate tensile strength (σ_u) | Maximum engineering stress |
| Fracture point | Material breaks |

**0.2% offset method**: Draw a line parallel to the elastic region starting at ε = 0.002. Its intersection with the curve defines σ_y.

## 1.4 Generalized Hooke's Law (3D)

- ε_x = (1/E)[σ_x - ν(σ_y + σ_z)]
- ε_y = (1/E)[σ_y - ν(σ_x + σ_z)]
- ε_z = (1/E)[σ_z - ν(σ_x + σ_y)]`,
      examTip: 'σ = F/A and ε = ΔL/L are the most basic formulas, but pay attention to units. Stress in SI is Pascals (N/m²); in US customary, it is psi (lb/in²). The FE exam uses both systems.',
      importantNote: 'The 0.2% offset method is the standard way to define yield strength for materials without a clear yield point (most metals). This is frequently tested on the FE exam.',
    },
  ],
  keyTakeaways: [
    'Normal stress σ = F/A; normal strain ε = ΔL/L₀.',
    'Hooke\'s law: σ = Eε in elastic region; E = Young\'s modulus.',
    'Poisson\'s ratio ν relates lateral and axial strains; G = E/[2(1+ν)].',
    'Yield strength defined by 0.2% offset for most metals.',
    'Ultimate tensile strength is the peak of the engineering stress-strain curve.',
  ],
},

fme_axial_torsion: {
  topicId: 'fme_axial_torsion',
  title: 'Axial Loading & Torsion',
  domainWeight: 'Mechanics of Materials · 7–11%',
  overview: 'Axial loading produces normal stress and deformation in bars and rods, while torsion produces shear stress and angular twist in shafts. Both are core topics tested heavily on the FE exam.',
  sections: [
    {
      id: 'at-axial',
      title: '1. Axial Loading',
      content: `## 1.1 Axial Deformation

**δ = FL/(AE)** (for constant cross-section and load)

For varying loads or sections: **δ = Σ F_i·L_i / (A_i·E_i)**

## 1.2 Thermal Deformation

**δ_T = α·ΔT·L**

Where α = coefficient of thermal expansion, ΔT = temperature change.

**Thermal stress** (restrained member): σ = E·α·ΔT

## 1.3 Statically Indeterminate Axial Members

When equilibrium alone cannot solve:
1. Write **equilibrium equations**
2. Write **compatibility equation** (deformations must be compatible)
3. Write **force-deformation relations** (δ = FL/AE)
4. Solve the system`,
      examTip: 'For thermal stress problems, remember that an unrestrained bar has deformation but NO stress. A fully restrained bar has stress but NO deformation. Partial restraint gives both.',
    },
    {
      id: 'at-torsion',
      title: '2. Torsion of Circular Shafts',
      content: `## 2.1 Torsion Formula

**τ = Tr/J**

Where T = torque, r = radial distance, J = polar moment of inertia.

- **Solid shaft**: J = πd⁴/32
- **Hollow shaft**: J = π(d_o⁴ - d_i⁴)/32

**Maximum shear stress** occurs at the outer surface: **τ_max = Tc/J** (c = outer radius)

## 2.2 Angle of Twist

**φ = TL/(GJ)**

Where G = shear modulus, L = shaft length.

For segments: **φ = Σ T_i·L_i / (G_i·J_i)**

## 2.3 Power Transmission

**P = T·ω = 2π·n·T/60** (n in rpm)

| Quantity | SI Units | US Units |
|---|---|---|
| Power | Watts | hp (1 hp = 550 ft·lb/s) |
| Torque | N·m | ft·lb or in·lb |
| Angular velocity | rad/s | rpm |`,
      examTip: 'The torsion formula τ = Tr/J and the power equation P = Tω are combined in many FE problems: given power and speed, find torque, then find shear stress. Practice this workflow.',
      importantNote: 'Torsion formulas apply only to circular cross-sections (solid or hollow). Non-circular sections require different approaches and are rarely tested on the FE exam.',
    },
  ],
  keyTakeaways: [
    'Axial deformation: δ = FL/(AE); thermal: δ_T = αΔTL.',
    'Torsion: τ = Tr/J; maximum at outer surface.',
    'Polar moment: J = πd⁴/32 (solid), J = π(d_o⁴-d_i⁴)/32 (hollow).',
    'Angle of twist: φ = TL/(GJ).',
    'Power-torque: P = Tω; use to find T from given power and speed.',
  ],
},

fme_beams: {
  topicId: 'fme_beams',
  title: 'Beam Bending & Shear',
  domainWeight: 'Mechanics of Materials · 7–11%',
  overview: 'Beam analysis determines internal shear forces, bending moments, stresses, and deflections. The FE exam tests shear/moment diagrams, bending stress, shear stress in beams, and deflection methods.',
  sections: [
    {
      id: 'beam-diagrams',
      title: '1. Shear and Moment Diagrams',
      content: `## 1.1 Sign Conventions

- **Positive shear (V)**: Clockwise rotation tendency on element
- **Positive moment (M)**: Sagging (concave up, "smile")

## 1.2 Relationships

**dV/dx = -w(x)** (shear = negative integral of distributed load)
**dM/dx = V** (moment = integral of shear)

These relationships allow construction of V and M diagrams:
- Point load causes a **jump** in V
- Uniform load causes a **linear** V and **parabolic** M
- Point moment causes a **jump** in M

## 1.3 Key Diagram Features

| Load Type | V Diagram | M Diagram |
|---|---|---|
| No load | Constant | Linear |
| Uniform load w | Linear | Parabolic |
| Triangular load | Parabolic | Cubic |
| Point load P | Jump = P | Slope change |
| Point moment M₀ | No change | Jump = M₀ |

**Maximum moment** occurs where V = 0 or changes sign.`,
      examTip: 'Find the maximum moment location by setting V = 0. This is where bending stress is maximum. On the FE exam, draw V and M diagrams systematically using the load-shear-moment relationships.',
    },
    {
      id: 'beam-stress',
      title: '2. Beam Stresses and Deflection',
      content: `## 2.1 Flexure (Bending) Stress

**σ = -My/I** or **σ_max = Mc/I = M/S**

Where: M = bending moment, y = distance from neutral axis, I = area moment of inertia, c = distance to extreme fiber, S = I/c = section modulus.

- **Tension on one side, compression on the other**
- **Neutral axis**: σ = 0 (passes through centroid for symmetric sections)

## 2.2 Transverse Shear Stress

**τ = VQ/(Ib)**

Where: V = shear force, Q = first moment of area above/below the point, I = moment of inertia, b = width at the point.

- Maximum shear stress at the **neutral axis**
- Zero shear stress at the top and bottom surfaces

For rectangular cross-section: **τ_max = 3V/(2A)**
For circular cross-section: **τ_max = 4V/(3A)**

## 2.3 Beam Deflection

**EI·y'' = M(x)** (Euler-Bernoulli beam equation)

Common deflections (use FE reference handbook):

| Beam & Load | Max Deflection |
|---|---|
| Cantilever, end load P | δ = PL³/(3EI) |
| Cantilever, uniform w | δ = wL⁴/(8EI) |
| Simply supported, center P | δ = PL³/(48EI) |
| Simply supported, uniform w | δ = 5wL⁴/(384EI) |`,
      examTip: 'Bending stress σ = Mc/I and shear stress τ = VQ/(Ib) are the two most important beam formulas. Remember: bending stress is maximum at the extreme fibers; shear stress is maximum at the neutral axis.',
      importantNote: 'The FE reference handbook has beam deflection tables — use them! Do not derive deflections by integration during the exam. Look up the standard case or use superposition.',
    },
  ],
  keyTakeaways: [
    'Bending stress: σ = Mc/I; maximum at extreme fibers, zero at neutral axis.',
    'Transverse shear: τ = VQ/(Ib); maximum at neutral axis, zero at top/bottom.',
    'dV/dx = -w, dM/dx = V: relationships for constructing V and M diagrams.',
    'Maximum moment occurs where V = 0 or changes sign.',
    'Use beam deflection tables from the FE reference handbook — don\'t derive.',
  ],
},

fme_combined: {
  topicId: 'fme_combined',
  title: 'Combined Loading & Stress Transformation',
  domainWeight: 'Mechanics of Materials · 7–11%',
  overview: 'Real components experience combinations of axial, bending, torsion, and shear loads simultaneously. Stress transformation and Mohr\'s circle determine principal stresses and maximum shear stress for failure analysis.',
  sections: [
    {
      id: 'comb-loading',
      title: '1. Combined Loading',
      content: `## 1.1 Superposition of Stresses

For combined loading, add stresses from each loading type:

**σ_total = σ_axial + σ_bending = F/A ± Mc/I**

**τ_total = τ_torsion + τ_shear = Tc/J + VQ/(Ib)**

## 1.2 Stress Transformation (2D)

Given σ_x, σ_y, τ_xy, the stress on a plane at angle θ:

**σ_θ = (σ_x + σ_y)/2 + (σ_x - σ_y)/2 · cos(2θ) + τ_xy · sin(2θ)**

**τ_θ = -(σ_x - σ_y)/2 · sin(2θ) + τ_xy · cos(2θ)**

## 1.3 Principal Stresses

**σ₁,₂ = (σ_x + σ_y)/2 ± √[((σ_x - σ_y)/2)² + τ_xy²]**

**τ_max = √[((σ_x - σ_y)/2)² + τ_xy²] = (σ₁ - σ₂)/2**

Principal planes have **zero shear stress**.
Maximum shear planes are at **45° to principal planes**.`,
      examTip: 'Principal stresses and maximum shear stress formulas are critical for the FE exam. The formula σ₁,₂ = (σ_x+σ_y)/2 ± √[((σ_x-σ_y)/2)² + τ_xy²] appears in many problems.',
    },
    {
      id: 'comb-mohr',
      title: '2. Mohr\'s Circle',
      content: `## 2.1 Constructing Mohr's Circle

1. Plot point X: (σ_x, τ_xy) and point Y: (σ_y, -τ_xy)
2. Center C = ((σ_x + σ_y)/2, 0)
3. Radius R = √[((σ_x - σ_y)/2)² + τ_xy²]
4. σ₁ = C + R, σ₂ = C - R, τ_max = R

## 2.2 Reading Mohr's Circle

| Quantity | On Mohr's Circle |
|---|---|
| σ₁ (max principal) | Rightmost point |
| σ₂ (min principal) | Leftmost point |
| τ_max | Top of circle = R |
| Principal angle | Half the angle on circle |

## 2.3 Failure Theories

| Theory | Criterion | Best For |
|---|---|---|
| Max Normal Stress | σ₁ ≤ σ_allow | Brittle materials |
| Max Shear Stress (Tresca) | τ_max ≤ σ_y/2 | Ductile, conservative |
| Distortion Energy (von Mises) | σ_vm ≤ σ_y | Ductile, most accurate |

**Von Mises stress**: σ_vm = √(σ₁² - σ₁σ₂ + σ₂²)

For 3D: σ_vm = √[(σ₁-σ₂)² + (σ₂-σ₃)² + (σ₃-σ₁)²] / √2`,
      examTip: 'On the FE exam, angles on Mohr\'s circle are DOUBLE the physical angles. A 45° physical rotation is a 90° rotation on Mohr\'s circle. Principal stress planes and max shear planes are always 45° apart physically.',
      importantNote: 'Use von Mises (distortion energy) for ductile materials and maximum normal stress for brittle materials. The FE exam will often specify the failure theory to use, but if not, use von Mises for steel and other ductile metals.',
    },
  ],
  keyTakeaways: [
    'Principal stresses: σ₁,₂ = (σ_x+σ_y)/2 ± R, where R = √[((σ_x-σ_y)/2)²+τ_xy²].',
    'τ_max = R = (σ₁-σ₂)/2; occurs at 45° to principal planes.',
    'Mohr\'s circle: center at ((σ_x+σ_y)/2, 0), radius R.',
    'Von Mises: σ_vm = √(σ₁²-σ₁σ₂+σ₂²) for ductile material failure.',
    'Max normal stress theory for brittle; von Mises for ductile materials.',
  ],
},

fme_columns: {
  topicId: 'fme_columns',
  title: 'Column Buckling',
  domainWeight: 'Mechanics of Materials · 7–11%',
  overview: 'Columns are slender structural members loaded in compression that may fail by buckling before yielding. The FE exam tests Euler\'s buckling formula, effective length, and the concept of slenderness ratio.',
  sections: [
    {
      id: 'col-euler',
      title: '1. Euler Buckling and Column Design',
      content: `## 1.1 Euler's Critical Load

**P_cr = π²EI / (KL)²**

Or in terms of stress: **σ_cr = π²E / (KL/r)²**

Where:
- E = modulus of elasticity
- I = minimum area moment of inertia
- KL = effective length
- r = radius of gyration = √(I/A)
- KL/r = slenderness ratio

## 1.2 Effective Length Factor K

| End Conditions | K | Description |
|---|---|---|
| Fixed-Fixed | 0.5 | Both ends clamped |
| Fixed-Pinned | 0.7 | One fixed, one pinned |
| Pinned-Pinned | 1.0 | Both ends pinned |
| Fixed-Free | 2.0 | Cantilever (one end free) |

## 1.3 Short vs. Long Columns

- **Long columns** (high KL/r): Fail by Euler buckling
- **Short columns** (low KL/r): Fail by material yielding (σ = P/A ≥ σ_y)
- **Intermediate columns**: Use Johnson's parabolic formula or similar

**Transition slenderness ratio**: (KL/r)_transition = √(2π²E/σ_y)

Above this value → Euler; below → yielding or intermediate formula.

## 1.4 Design Considerations

- Buckling occurs about the axis with the **smallest I** (weakest axis)
- **Factor of safety**: n = P_cr / P_applied
- Eccentric loading and initial imperfections reduce buckling load`,
      examTip: 'Always use the MINIMUM moment of inertia for column buckling — the column buckles about its weakest axis. Also remember K = 2 for a cantilever (fixed-free), which quadruples the effective length and reduces P_cr by a factor of 16 compared to pinned-pinned.',
      importantNote: 'Euler\'s formula is only valid when σ_cr < σ_y (elastic buckling). If P_cr/A exceeds yield strength, the column fails by yielding, not buckling, and Euler\'s formula does not apply.',
    },
  ],
  keyTakeaways: [
    'Euler buckling: P_cr = π²EI/(KL)²; use minimum I.',
    'Effective length factors: K = 0.5 (fixed-fixed), 1.0 (pinned-pinned), 2.0 (fixed-free).',
    'Slenderness ratio KL/r determines if column is long (Euler) or short (yielding).',
    'Buckling occurs about the weakest axis (smallest moment of inertia).',
    'Euler\'s formula only valid for elastic buckling: σ_cr < σ_y.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 8 — MATERIAL SCIENCE  (4 curriculum IDs)  ·  6–9 %
 * ══════════════════════════════════════════════════════════════════ */

fme_crystal: {
  topicId: 'fme_crystal',
  title: 'Crystal Structures & Defects',
  domainWeight: 'Material Science · 6–9%',
  overview: 'The atomic arrangement in materials determines their mechanical properties. The FE exam tests crystal structures (BCC, FCC, HCP), Miller indices, and how defects influence material behavior.',
  sections: [
    {
      id: 'crys-structures',
      title: '1. Crystal Structures and Defects',
      content: `## 1.1 Common Crystal Structures

| Structure | Atoms/Cell | APF | Coordination # | Examples |
|---|---|---|---|---|
| BCC (Body-Centered Cubic) | 2 | 0.68 | 8 | Fe (α), Cr, Mo, W |
| FCC (Face-Centered Cubic) | 4 | 0.74 | 12 | Al, Cu, Ni, Au, Ag |
| HCP (Hexagonal Close-Packed) | 6 | 0.74 | 12 | Ti, Mg, Zn |

**Atomic Packing Factor (APF)** = Volume of atoms / Volume of unit cell

FCC and HCP are **close-packed** (APF = 0.74, highest possible for spheres).

## 1.2 Miller Indices

Directions: [uvw] — integers from vector components
Planes: (hkl) — reciprocals of intercepts, cleared of fractions

Family of directions: <uvw>; Family of planes: {hkl}

## 1.3 Crystal Defects

| Defect Type | Examples | Effect |
|---|---|---|
| Point | Vacancy, interstitial, substitutional | Diffusion, solid solution strengthening |
| Line (dislocation) | Edge, screw | Plastic deformation mechanism |
| Surface | Grain boundaries, twin boundaries | Strengthen (Hall-Petch), nucleation sites |
| Volume | Voids, inclusions, precipitates | Stress concentrators, precipitation hardening |

**Dislocations** are the primary mechanism of plastic deformation in metals. Movement of dislocations along slip planes allows permanent shape change.`,
      examTip: 'BCC has 2 atoms/cell, FCC has 4, HCP has 6. APF for FCC = HCP = 0.74 (close-packed), BCC = 0.68. These numbers appear directly on the FE exam.',
    },
  ],
  keyTakeaways: [
    'BCC: 2 atoms/cell, APF 0.68 (Fe, Cr, W); FCC: 4 atoms/cell, APF 0.74 (Al, Cu, Ni).',
    'Dislocations are the primary mechanism for plastic deformation in metals.',
    'Point defects enable diffusion and solid solution strengthening.',
    'Grain boundaries strengthen materials per the Hall-Petch relationship.',
  ],
},

fme_mech_props: {
  topicId: 'fme_mech_props',
  title: 'Mechanical Properties & Testing',
  domainWeight: 'Material Science · 6–9%',
  overview: 'Mechanical testing quantifies material behavior under loading. The FE exam tests tensile testing, hardness testing, impact testing, and the relationships between mechanical properties.',
  sections: [
    {
      id: 'props-testing',
      title: '1. Mechanical Testing Methods',
      content: `## 1.1 Tensile Test Properties

From the engineering stress-strain curve:

| Property | Definition | Significance |
|---|---|---|
| Young's modulus (E) | Slope of elastic region | Stiffness |
| Yield strength (σ_y) | Onset of plastic deformation | Design limit |
| Ultimate tensile strength (σ_u) | Maximum stress | Failure strength |
| Fracture strain (ε_f) | Strain at failure | Ductility |
| Toughness | Area under σ-ε curve | Energy absorption |
| Resilience | Area under elastic region | Elastic energy storage |

**Modulus of resilience**: U_r = σ_y²/(2E)

**True stress**: σ_true = σ_eng(1 + ε_eng)
**True strain**: ε_true = ln(1 + ε_eng)

## 1.2 Hardness Testing

| Test | Indenter | Measure |
|---|---|---|
| Brinell (HB) | 10mm steel/carbide ball | Diameter of indent |
| Rockwell (HRC, HRB) | Diamond cone or ball | Depth of indent |
| Vickers (HV) | Diamond pyramid | Diagonal of indent |

**Approximate relationship**: σ_u ≈ 3.45 × HB (for steels, in MPa)

## 1.3 Impact Testing

**Charpy V-notch** test measures toughness (energy absorbed) vs. temperature:
- **Ductile-to-brittle transition temperature (DBTT)**: Temperature below which material becomes brittle
- BCC metals (steel) show a clear DBTT
- FCC metals (aluminum, copper) remain ductile at low temperatures`,
      examTip: 'Toughness = total area under the stress-strain curve; resilience = area under the elastic portion only. A material can be strong but not tough if it lacks ductility.',
      importantNote: 'BCC metals (carbon steel) exhibit a ductile-to-brittle transition with decreasing temperature. FCC metals (aluminum, stainless steel) do not. This is critical for low-temperature applications.',
    },
  ],
  keyTakeaways: [
    'Young\'s modulus = slope of elastic stress-strain region; measures stiffness.',
    'Toughness = area under entire σ-ε curve; resilience = area under elastic part.',
    'Hardness approximately correlates with tensile strength: σ_u ≈ 3.45 × HB.',
    'Charpy test measures impact toughness; DBTT is critical for BCC metals.',
    'True stress = σ_eng(1+ε_eng); true strain = ln(1+ε_eng).',
  ],
},

fme_phase: {
  topicId: 'fme_phase',
  title: 'Phase Diagrams & Transformations',
  domainWeight: 'Material Science · 6–9%',
  overview: 'Phase diagrams map the equilibrium phases of materials as a function of composition and temperature. The Fe-C diagram is the most important for mechanical engineers, governing the heat treatment of steels.',
  sections: [
    {
      id: 'phase-diagrams',
      title: '1. Phase Diagrams and the Iron-Carbon System',
      content: `## 1.1 Phase Diagram Fundamentals

**Gibbs Phase Rule**: F = C - P + 2
- F = degrees of freedom, C = number of components, P = number of phases

**Lever Rule** (for two-phase regions):
- Weight fraction of phase α: W_α = (C_β - C₀) / (C_β - C_α)
- Weight fraction of phase β: W_β = (C₀ - C_α) / (C_β - C_α)

## 1.2 Iron-Carbon Phase Diagram

Key temperatures and compositions:

| Point/Line | Temperature | Composition | Significance |
|---|---|---|---|
| Eutectoid | 727°C | 0.76% C | Austenite → Pearlite (ferrite + cementite) |
| Eutectic | 1147°C | 4.3% C | Liquid → Ledeburite |
| A₃ line | 912°C (pure Fe) | Varies | Ferrite ↔ Austenite boundary |

**Phases**:
- **Ferrite (α)**: BCC, soft, ductile, low C solubility (0.022% max)
- **Austenite (γ)**: FCC, higher C solubility (2.14% max)
- **Cementite (Fe₃C)**: Hard, brittle iron carbide
- **Pearlite**: Lamellar ferrite + cementite (eutectoid)

## 1.3 Heat Treatment

| Treatment | Process | Result |
|---|---|---|
| Annealing | Heat above A₃, slow cool | Soft, ductile, stress-free |
| Normalizing | Heat above A₃, air cool | Finer pearlite, moderate strength |
| Quenching | Heat above A₃, rapid cool | Martensite (hard, brittle) |
| Tempering | Reheat quenched part | Reduces brittleness, retains hardness |
| Case hardening | Harden surface only | Hard surface, tough core |`,
      examTip: 'The eutectoid point (727°C, 0.76% C) is the most tested point on the Fe-C diagram. Steel with <0.76% C is hypoeutectoid (ferrite + pearlite); >0.76% C is hypereutectoid (cementite + pearlite).',
      importantNote: 'Martensite forms by rapid quenching — it is a metastable BCT (body-centered tetragonal) phase that is very hard but brittle. Tempering after quenching is essential to restore some ductility.',
    },
  ],
  keyTakeaways: [
    'Gibbs Phase Rule: F = C - P + 2 gives degrees of freedom.',
    'Lever Rule determines phase fractions in two-phase regions.',
    'Eutectoid: 727°C, 0.76% C — austenite transforms to pearlite.',
    'Quenching produces martensite (hard, brittle); tempering restores ductility.',
    'Hypoeutectoid (<0.76% C): ferrite + pearlite; hypereutectoid: cementite + pearlite.',
  ],
},

fme_materials_select: {
  topicId: 'fme_materials_select',
  title: 'Material Selection & Strengthening',
  domainWeight: 'Material Science · 6–9%',
  overview: 'Selecting the right material requires balancing strength, stiffness, weight, cost, and environmental resistance. The FE exam tests strengthening mechanisms, material classes, and selection criteria.',
  sections: [
    {
      id: 'mat-strengthen',
      title: '1. Strengthening Mechanisms and Material Classes',
      content: `## 1.1 Strengthening Mechanisms

All strengthening mechanisms work by **impeding dislocation motion**:

| Mechanism | How It Works | Example |
|---|---|---|
| Strain hardening (cold work) | Increase dislocation density | Cold rolling, wire drawing |
| Solid solution strengthening | Solute atoms distort lattice | Carbon in iron, Zn in Cu |
| Precipitation hardening | Fine precipitates block dislocations | Al-Cu alloys (2024-T6) |
| Grain refinement | More grain boundaries | Hall-Petch: σ_y = σ₀ + k/√d |
| Dispersion strengthening | Stable particles in matrix | Oxide-dispersion strengthened alloys |

## 1.2 Material Classes

| Class | Strengths | Weaknesses | Examples |
|---|---|---|---|
| Steels | High strength, cheap | Heavy, corrosion | 1018, 4140, 304 SS |
| Aluminum alloys | Lightweight, corrosion-resistant | Lower strength than steel | 2024, 6061, 7075 |
| Polymers | Lightweight, insulating | Low strength, creep | PE, PP, nylon, epoxy |
| Ceramics | Hard, heat-resistant | Brittle, no ductility | Al₂O₃, SiC, Si₃N₄ |
| Composites | High specific strength | Anisotropic, expensive | CFRP, GFRP |

## 1.3 Material Selection Criteria

**Performance indices** (Ashby approach):
- Minimum weight, stiff tie rod: maximize E/ρ
- Minimum weight, stiff beam: maximize E^(1/2)/ρ
- Minimum weight, stiff plate: maximize E^(1/3)/ρ
- Minimum weight, strong tie rod: maximize σ_y/ρ

## 1.4 Corrosion

- **Galvanic corrosion**: Dissimilar metals in contact with electrolyte
- **Uniform corrosion**: Even material removal
- **Pitting**: Localized, deep attack
- **Stress corrosion cracking**: Combined stress + corrosive environment`,
      examTip: 'Strengthening mechanisms all impede dislocation motion. Strain hardening increases strength but decreases ductility. Annealing reverses cold work, restoring ductility by recrystallization.',
      importantNote: 'Galvanic corrosion: the more ANODIC (active) metal corrodes preferentially. Check the galvanic series — metals farther apart on the series corrode faster when coupled.',
    },
  ],
  keyTakeaways: [
    'All strengthening mechanisms impede dislocation motion.',
    'Hall-Petch: σ_y = σ₀ + k/√d — smaller grains mean higher yield strength.',
    'Ashby indices: E/ρ for stiff tie rods, E^(1/2)/ρ for stiff beams.',
    'Strain hardening increases strength but reduces ductility.',
    'Galvanic corrosion occurs when dissimilar metals are coupled in an electrolyte.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 9 — FLUID MECHANICS  (5 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

fme_fluid_statics: {
  topicId: 'fme_fluid_statics',
  title: 'Fluid Statics',
  domainWeight: 'Fluid Mechanics · 7–11%',
  overview: 'Fluid statics deals with fluids at rest. Key concepts include hydrostatic pressure, forces on submerged surfaces, buoyancy, and manometry — all heavily tested on the FE exam.',
  sections: [
    {
      id: 'fs-pressure',
      title: '1. Hydrostatic Pressure and Forces',
      content: `## 1.1 Hydrostatic Pressure

**p = p₀ + ρgh**

Where p₀ = surface pressure, ρ = fluid density, g = gravitational acceleration, h = depth below surface.

**Key properties**:
- Pressure increases linearly with depth
- Pressure acts equally in all directions at a point (Pascal's law)
- Pressure is the same at all points on a horizontal plane in a static fluid

## 1.2 Manometry

For a U-tube manometer: Sum pressures from one side to the other:
- Add ρgh going down
- Subtract ρgh going up

## 1.3 Hydrostatic Force on Plane Surfaces

**Resultant force**: F_R = ρg·h̄_c·A = p_c·A

Where h̄_c = depth to centroid of the surface, A = area.

**Location (center of pressure)**:
- y_R = y_c + I_xc/(y_c·A)

The center of pressure is always **below** the centroid (for non-horizontal surfaces).

## 1.4 Buoyancy

**Archimedes' Principle**: F_B = ρ_fluid · g · V_displaced

- Object floats when F_B ≥ W (buoyant force ≥ weight)
- For a floating object: ρ_object/ρ_fluid = V_submerged/V_total`,
      examTip: 'For hydrostatic force on a submerged surface, the resultant force equals pressure at the centroid times the area: F = ρg·h_c·A. The center of pressure formula y_R = y_c + I/(y_c·A) tells you where the force acts — always below the centroid.',
    },
  ],
  keyTakeaways: [
    'Hydrostatic pressure: p = p₀ + ρgh; increases linearly with depth.',
    'Force on plane surface: F = ρg·h_c·A; acts at center of pressure, below centroid.',
    'Buoyancy: F_B = ρ_fluid·g·V_displaced (Archimedes).',
    'Manometry: add ρgh going down, subtract going up.',
    'Pascal\'s law: pressure acts equally in all directions at a point.',
  ],
},

fme_fluid_dynamics: {
  topicId: 'fme_fluid_dynamics',
  title: 'Fluid Dynamics & Bernoulli',
  domainWeight: 'Fluid Mechanics · 7–11%',
  overview: 'Fluid dynamics analyzes fluids in motion. The continuity equation, Bernoulli\'s equation, and the general energy equation (with losses) are the primary tools tested on the FE exam.',
  sections: [
    {
      id: 'fd-conservation',
      title: '1. Conservation Equations',
      content: `## 1.1 Continuity Equation (Mass Conservation)

For steady, incompressible flow:

**A₁V₁ = A₂V₂** (volumetric flow rate Q is constant)

**ṁ = ρAV = ρQ** (mass flow rate)

## 1.2 Bernoulli's Equation

For steady, incompressible, inviscid flow along a streamline:

**p₁/ρg + V₁²/(2g) + z₁ = p₂/ρg + V₂²/(2g) + z₂**

Each term has units of **head** (length):
- p/ρg = pressure head
- V²/(2g) = velocity head
- z = elevation head

## 1.3 General Energy Equation (with losses)

**p₁/ρg + V₁²/(2g) + z₁ + h_p = p₂/ρg + V₂²/(2g) + z₂ + h_L + h_t**

Where:
- h_p = pump head added
- h_t = turbine head extracted
- h_L = total head loss (friction + minor losses)

## 1.4 Reynolds Number

**Re = ρVD/μ = VD/ν**

| Re Range | Flow Regime |
|---|---|
| Re < 2300 | Laminar |
| 2300 < Re < 4000 | Transition |
| Re > 4000 | Turbulent |`,
      examTip: 'Bernoulli\'s equation assumes inviscid, incompressible, steady flow along a streamline. When there are losses (friction, valves, fittings), use the general energy equation with h_L. The FE exam often tests both.',
      importantNote: 'Reynolds number Re = ρVD/μ determines the flow regime. For pipe flow: Re < 2300 is laminar, Re > 4000 is turbulent. This affects which friction factor formula to use.',
    },
  ],
  keyTakeaways: [
    'Continuity: A₁V₁ = A₂V₂ for incompressible flow.',
    'Bernoulli: p/ρg + V²/(2g) + z = constant along a streamline.',
    'General energy equation adds pump head, turbine head, and losses.',
    'Re = ρVD/μ; laminar < 2300, turbulent > 4000.',
    'Each Bernoulli term is a "head" with units of length.',
  ],
},

fme_pipe_flow: {
  topicId: 'fme_pipe_flow',
  title: 'Internal Flow & Pipe Systems',
  domainWeight: 'Fluid Mechanics · 7–11%',
  overview: 'Pipe flow analysis determines pressure drops, flow rates, and pump requirements for piping systems. The FE exam tests the Darcy-Weisbach equation, Moody chart, and minor losses.',
  sections: [
    {
      id: 'pipe-losses',
      title: '1. Pipe Losses and the Moody Chart',
      content: `## 1.1 Darcy-Weisbach Equation

**h_f = f · (L/D) · V²/(2g)**

Where: f = Darcy friction factor, L = pipe length, D = diameter, V = velocity.

## 1.2 Friction Factor

**Laminar flow** (Re < 2300): **f = 64/Re**

**Turbulent flow**: Use the **Moody chart** or **Colebrook equation**:
- 1/√f = -2.0·log₁₀(ε/(3.7D) + 2.51/(Re·√f))
- ε = pipe roughness

## 1.3 Minor Losses

**h_m = K · V²/(2g)** (loss coefficient method)

Or: **h_m = f · (L_e/D) · V²/(2g)** (equivalent length method)

| Fitting | K (typical) |
|---|---|
| 90° elbow | 0.3–0.9 |
| Tee (branch) | 1.0–2.0 |
| Gate valve (full open) | 0.15 |
| Globe valve (full open) | 6–10 |
| Entrance (sharp) | 0.5 |
| Exit | 1.0 |

**Total head loss**: h_L = h_f + Σh_m

## 1.4 Pipe System Analysis

- **Series**: Same Q, add h_L values
- **Parallel**: Same h_L, add Q values
- **Pump selection**: h_p = h_L + Δz + Δ(V²/2g) + Δp/(ρg)`,
      examTip: 'For laminar flow, f = 64/Re — no chart needed. For turbulent flow, use the Moody chart in the FE reference handbook. You need Re and relative roughness ε/D to read the chart.',
    },
  ],
  keyTakeaways: [
    'Darcy-Weisbach: h_f = f(L/D)(V²/2g); primary pipe friction formula.',
    'Laminar: f = 64/Re; turbulent: use Moody chart with Re and ε/D.',
    'Minor losses: h_m = KV²/(2g); add all fitting losses.',
    'Series pipes: same flow, add losses; parallel: same loss, add flows.',
    'Exit loss coefficient K = 1.0; sharp entrance K = 0.5.',
  ],
},

fme_external_flow: {
  topicId: 'fme_external_flow',
  title: 'External Flow & Drag/Lift',
  domainWeight: 'Fluid Mechanics · 7–11%',
  overview: 'External flow over bodies produces drag and lift forces. The FE exam tests drag coefficients, boundary layer concepts, and the fundamental lift and drag equations.',
  sections: [
    {
      id: 'ext-drag',
      title: '1. Drag, Lift, and Boundary Layers',
      content: `## 1.1 Drag Force

**F_D = C_D · ½ρV² · A**

Where C_D = drag coefficient, A = reference area (usually frontal area).

**Types of drag**:
- **Friction drag**: Due to shear stress on surface (dominant for streamlined bodies)
- **Pressure drag (form drag)**: Due to pressure difference (dominant for bluff bodies)

## 1.2 Lift Force

**F_L = C_L · ½ρV² · A**

Where C_L = lift coefficient, A = planform area (for airfoils).

## 1.3 Boundary Layer

| Property | Laminar BL | Turbulent BL |
|---|---|---|
| Thickness | Thinner | Thicker |
| Friction | Lower | Higher |
| Separation | Earlier | Later (fuller profile) |
| Re transition | ~5×10⁵ on flat plate | — |

**Boundary layer thickness** (flat plate, laminar): δ ≈ 5x/√(Re_x)

**Skin friction coefficient** (flat plate):
- Laminar: C_f = 1.328/√(Re_L)
- Turbulent: C_f = 0.074/Re_L^(1/5)

## 1.4 Common Drag Coefficients

| Shape | C_D (approximate) |
|---|---|
| Sphere | 0.4–0.5 (subcritical) |
| Cylinder (infinite) | 1.2 |
| Flat plate (perpendicular) | 2.0 |
| Streamlined body | 0.04–0.1 |`,
      examTip: 'The dynamic pressure ½ρV² appears in both drag and lift equations. On the FE exam, given velocity, density, area, and C_D or C_L, the calculation is straightforward multiplication. Watch units carefully.',
    },
  ],
  keyTakeaways: [
    'Drag: F_D = C_D·½ρV²·A; Lift: F_L = C_L·½ρV²·A.',
    'Friction drag dominates streamlined bodies; pressure drag dominates bluff bodies.',
    'Boundary layer transitions from laminar to turbulent at Re_x ≈ 5×10⁵.',
    'Streamlining reduces total drag by reducing pressure drag (delayed separation).',
  ],
},

fme_turbomachinery: {
  topicId: 'fme_turbomachinery',
  title: 'Turbomachinery & Pumps',
  domainWeight: 'Fluid Mechanics · 7–11%',
  overview: 'Pumps and turbines are essential fluid machinery. The FE exam tests pump selection, performance curves, specific speed, cavitation, and affinity laws for scaling.',
  sections: [
    {
      id: 'turbo-pumps',
      title: '1. Pump Performance and Scaling',
      content: `## 1.1 Pump Performance

Key parameters:
- **Head (H)**: Energy added per unit weight (m or ft)
- **Flow rate (Q)**: Volume per time (m³/s or gpm)
- **Power**: P_fluid = ρgQH, P_shaft = P_fluid/η
- **Efficiency**: η = P_fluid/P_shaft

**System curve**: h_required = Δz + h_L(Q) (parabolic, increases with Q²)

**Operating point**: Intersection of pump curve and system curve.

## 1.2 Affinity Laws (Fan/Pump Laws)

For a geometrically similar pump at different speeds:

| Relation | Formula |
|---|---|
| Flow | Q₂/Q₁ = (N₂/N₁)(D₂/D₁)³ |
| Head | H₂/H₁ = (N₂/N₁)²(D₂/D₁)² |
| Power | P₂/P₁ = (N₂/N₁)³(D₂/D₁)⁵ |

For same pump (D₁ = D₂): Q ∝ N, H ∝ N², P ∝ N³

## 1.3 Cavitation and NPSH

**Cavitation**: Local pressure drops below vapor pressure → vapor bubbles form and collapse → damage.

**NPSH Available**: NPSH_A = (p_s - p_v)/(ρg) + V_s²/(2g) + z_s

**Requirement**: NPSH_A > NPSH_R (required, from pump manufacturer)

## 1.4 Specific Speed

**N_s = N·√Q / H^(3/4)** (dimensional — units matter)

| N_s Range | Pump Type |
|---|---|
| Low | Radial (centrifugal) |
| Medium | Mixed flow |
| High | Axial flow |`,
      examTip: 'Affinity laws for same pump: Q ∝ N, H ∝ N², P ∝ N³. If speed doubles, flow doubles, head quadruples, and power octuples. These ratios are directly tested on the FE exam.',
      importantNote: 'Cavitation is avoided by ensuring NPSH Available exceeds NPSH Required. To increase NPSH_A: raise the reservoir, lower the pump, increase suction pressure, or reduce suction pipe losses.',
    },
  ],
  keyTakeaways: [
    'Pump power: P = ρgQH/η; operating point where pump curve meets system curve.',
    'Affinity laws (same pump): Q ∝ N, H ∝ N², P ∝ N³.',
    'NPSH_A > NPSH_R to avoid cavitation.',
    'Specific speed classifies pump type: low N_s = centrifugal, high N_s = axial.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 10 — THERMODYNAMICS  (5 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

fme_thermo_laws: {
  topicId: 'fme_thermo_laws',
  title: 'Laws of Thermodynamics',
  domainWeight: 'Thermodynamics · 7–11%',
  overview: 'The laws of thermodynamics govern energy conversion and transfer. The FE exam tests the first law (energy conservation), second law (entropy), and their applications to closed and open systems.',
  sections: [
    {
      id: 'thermo-first',
      title: '1. First and Second Laws',
      content: `## 1.1 First Law of Thermodynamics

**Closed system (no mass flow)**: Q - W = ΔU

**Open system (steady-state, steady-flow)**:
**Q̇ - Ẇ = ṁ[(h₂ - h₁) + (V₂² - V₁²)/2 + g(z₂ - z₁)]**

Sign conventions:
- Q > 0: Heat INTO system
- W > 0: Work BY system (physics convention) or Work ON system (engineering convention)

**Key**: Always clarify sign convention on the FE exam.

## 1.2 Second Law of Thermodynamics

**Clausius Statement**: Heat cannot spontaneously flow from cold to hot.
**Kelvin-Planck Statement**: No heat engine can convert ALL heat to work.

**Entropy inequality**: ΔS ≥ ∫(δQ/T)

For an **irreversible process**: ΔS > Q/T (entropy generated)
For a **reversible process**: ΔS = Q/T

## 1.3 Carnot Efficiency

Maximum possible efficiency for a heat engine operating between T_H and T_L:

**η_Carnot = 1 - T_L/T_H** (temperatures in Kelvin or Rankine)

**COP (heat pump)**: COP_HP = T_H/(T_H - T_L) = 1/η_Carnot
**COP (refrigerator)**: COP_R = T_L/(T_H - T_L)`,
      examTip: 'Carnot efficiency η = 1 - T_L/T_H uses ABSOLUTE temperatures (Kelvin or Rankine). Converting to absolute is the #1 source of errors. Always check: T(K) = T(°C) + 273.15.',
      importantNote: 'The Carnot cycle sets the MAXIMUM efficiency for any heat engine between two temperatures. Real engines always have lower efficiency due to irreversibilities.',
    },
  ],
  keyTakeaways: [
    'First law (closed): Q - W = ΔU; (open, steady): Q̇ - Ẇ = ṁΔh + ...',
    'Carnot efficiency: η = 1 - T_L/T_H; maximum possible for given temperatures.',
    'Entropy always increases for irreversible processes (ΔS_universe > 0).',
    'Use absolute temperatures (K or R) for all efficiency and entropy calculations.',
    'COP_refrigerator = T_L/(T_H - T_L); COP_heat_pump = T_H/(T_H - T_L).',
  ],
},

fme_properties: {
  topicId: 'fme_properties',
  title: 'Thermodynamic Properties',
  domainWeight: 'Thermodynamics · 7–11%',
  overview: 'Understanding thermodynamic properties and how to look them up in steam tables and ideal gas relations is essential for solving FE exam thermodynamics problems.',
  sections: [
    {
      id: 'props-state',
      title: '1. Properties and State Relations',
      content: `## 1.1 Key Thermodynamic Properties

| Property | Symbol | Units | Notes |
|---|---|---|---|
| Temperature | T | K, °C, R, °F | Measure of molecular KE |
| Pressure | P | Pa, kPa, atm, psi | Force per unit area |
| Specific volume | v | m³/kg | Inverse of density |
| Internal energy | u | kJ/kg | Energy stored in substance |
| Enthalpy | h = u + Pv | kJ/kg | Useful for flow processes |
| Entropy | s | kJ/(kg·K) | Disorder measure |
| Quality | x | Dimensionless | Fraction of vapor in two-phase |

## 1.2 Ideal Gas Law

**PV = nRT** or **Pv = RT** (specific)

R_universal = 8.314 kJ/(kmol·K); R_specific = R_universal/M

For ideal gas processes:

| Process | Relation | Work (closed) |
|---|---|---|
| Isothermal (T=const) | P₁V₁ = P₂V₂ | W = nRT·ln(V₂/V₁) |
| Isobaric (P=const) | V₁/T₁ = V₂/T₂ | W = P(V₂-V₁) |
| Isochoric (V=const) | P₁/T₁ = P₂/T₂ | W = 0 |
| Isentropic | PV^γ = const | W = (P₂V₂-P₁V₁)/(1-γ) |

**Specific heats**: c_p - c_v = R, γ = c_p/c_v

## 1.3 Steam Tables

For water/steam:
- **Saturated tables**: Use when in two-phase region (given T or P)
- **Superheated tables**: Use when T > T_sat at given P
- **Compressed liquid**: Approximate as saturated liquid at same T

**Quality**: x = (v - v_f)/(v_g - v_f) = (h - h_f)/(h_fg) = (s - s_f)/(s_fg)`,
      examTip: 'Quality x is only defined in the two-phase (wet) region. If x < 0 → subcooled liquid. If x > 1 → superheated vapor. On the FE exam, always check the state (phase) first before using property tables.',
    },
  ],
  keyTakeaways: [
    'Ideal gas: PV = nRT; c_p - c_v = R; γ = c_p/c_v.',
    'Isentropic process: PV^γ = constant; s₁ = s₂.',
    'Quality x = (v-v_f)/(v_g-v_f); only defined in two-phase region.',
    'Steam tables: saturated for two-phase, superheated when T > T_sat.',
    'Enthalpy h = u + Pv; used for open-system (flow) problems.',
  ],
},

fme_cycles: {
  topicId: 'fme_cycles',
  title: 'Power & Refrigeration Cycles',
  domainWeight: 'Thermodynamics · 7–11%',
  overview: 'Thermodynamic cycles convert heat to work (power cycles) or use work to move heat (refrigeration cycles). The FE exam tests Rankine, Brayton, Otto, Diesel, and vapor-compression refrigeration cycles.',
  sections: [
    {
      id: 'cyc-power',
      title: '1. Power Cycles',
      content: `## 1.1 Rankine Cycle (Steam Power)

Components: Boiler → Turbine → Condenser → Pump

| Process | Component | Idealized |
|---|---|---|
| 1→2 | Pump | Isentropic compression |
| 2→3 | Boiler | Constant pressure heat addition |
| 3→4 | Turbine | Isentropic expansion |
| 4→1 | Condenser | Constant pressure heat rejection |

**Efficiency**: η = (W_turbine - W_pump) / Q_in = 1 - Q_out/Q_in

Improvements: **Reheat** (increases avg. T of heat addition), **Regeneration** (feedwater heating)

## 1.2 Brayton Cycle (Gas Turbine)

Components: Compressor → Combustion Chamber → Turbine

**Efficiency**: η = 1 - 1/r_p^((γ-1)/γ)

Where r_p = P₂/P₁ = pressure ratio.

## 1.3 Otto & Diesel Cycles (Reciprocating Engines)

**Otto** (spark ignition): η = 1 - 1/r^(γ-1)
Where r = V₁/V₂ = compression ratio.

**Diesel** (compression ignition): η = 1 - [1/(γ·r^(γ-1))]·[(r_c^γ - 1)/(r_c - 1)]
Where r_c = V₃/V₂ = cutoff ratio.

| Cycle | Working Fluid | Key Parameter | Application |
|---|---|---|---|
| Rankine | Water/steam | Boiler pressure | Steam power plants |
| Brayton | Air/gas | Pressure ratio | Jet engines, gas turbines |
| Otto | Air (model) | Compression ratio | Gasoline engines |
| Diesel | Air (model) | Compression & cutoff ratios | Diesel engines |`,
      examTip: 'Otto efficiency depends only on compression ratio r: η = 1 - 1/r^(γ-1). Brayton efficiency depends only on pressure ratio r_p. Higher ratios = higher efficiency. These are directly tested.',
    },
    {
      id: 'cyc-refrig',
      title: '2. Refrigeration Cycles',
      content: `## 2.1 Vapor-Compression Refrigeration

Components: Compressor → Condenser → Expansion Valve → Evaporator

| Process | Component | Description |
|---|---|---|
| 1→2 | Compressor | Isentropic compression (vapor) |
| 2→3 | Condenser | Constant pressure heat rejection |
| 3→4 | Expansion valve | Throttling (h₃ = h₄, isenthalpic) |
| 4→1 | Evaporator | Constant pressure heat absorption |

**COP_cooling = Q_L/W_net = (h₁-h₄)/(h₂-h₁)**

**COP_heating = Q_H/W_net = (h₂-h₃)/(h₂-h₁)**

## 2.2 Key Relationships

- COP_HP = COP_R + 1
- Throttling: h₃ = h₄ (enthalpy stays same, entropy increases)
- Refrigerant exits evaporator as saturated or slightly superheated vapor`,
      examTip: 'In vapor-compression refrigeration, the expansion valve is isenthalpic (h₃ = h₄), NOT isentropic. This is a common FE exam trap. The throttling process is irreversible — entropy increases.',
    },
  ],
  keyTakeaways: [
    'Rankine: pump → boiler → turbine → condenser; uses water/steam.',
    'Brayton efficiency: η = 1 - 1/r_p^((γ-1)/γ); used for gas turbines.',
    'Otto efficiency: η = 1 - 1/r^(γ-1); compression ratio determines efficiency.',
    'Refrigeration COP: COP_R = Q_L/W_in; higher is better.',
    'Throttling is isenthalpic (h constant) and irreversible (s increases).',
  ],
},

fme_mixtures: {
  topicId: 'fme_mixtures',
  title: 'Gas Mixtures & Psychrometrics',
  domainWeight: 'Thermodynamics · 7–11%',
  overview: 'Gas mixtures and psychrometrics (moist air) are important for HVAC, combustion, and process engineering. The FE exam tests Dalton\'s law, mixture properties, and psychrometric chart reading.',
  sections: [
    {
      id: 'mix-gas',
      title: '1. Gas Mixtures and Psychrometrics',
      content: `## 1.1 Ideal Gas Mixtures

**Dalton's Law**: P_total = Σp_i (sum of partial pressures)
**Amagat's Law**: V_total = ΣV_i (sum of partial volumes)

**Mole fraction**: y_i = n_i/n_total = p_i/P_total

**Mixture properties**:
- M_mix = Σ(y_i · M_i)
- c_p,mix = Σ(y_i · c_p,i) (mass basis: use mass fractions)

## 1.2 Psychrometrics (Moist Air)

Key properties:
- **Dry-bulb temperature (T_db)**: Standard air temperature
- **Wet-bulb temperature (T_wb)**: Measured with wet wick
- **Dew point (T_dp)**: Temperature at which moisture condenses
- **Relative humidity (φ)**: φ = p_v / p_g (actual vs. saturated vapor pressure)
- **Humidity ratio (ω)**: ω = m_v/m_a = 0.622 · p_v/(P - p_v)

## 1.3 Psychrometric Processes

| Process | On Chart | ω | T_db | φ |
|---|---|---|---|---|
| Sensible heating | Horizontal right | Constant | Increases | Decreases |
| Sensible cooling | Horizontal left | Constant | Decreases | Increases |
| Humidification | Up-right | Increases | May change | Increases |
| Dehumidification | Down-left | Decreases | Decreases | 100% at coil |
| Adiabatic saturation | Along T_wb line | Increases | Decreases | Increases |`,
      examTip: 'On the psychrometric chart: horizontal movement = sensible heating/cooling (ω constant). Vertical movement changes humidity ratio. The dew point is found by moving left at constant ω to the saturation curve.',
    },
  ],
  keyTakeaways: [
    'Dalton\'s law: P_total = Σp_i; mole fraction y_i = p_i/P_total.',
    'Relative humidity φ = p_v/p_g; humidity ratio ω = 0.622·p_v/(P-p_v).',
    'Dew point: temperature at which air becomes saturated (φ = 100%).',
    'Sensible heating/cooling: constant humidity ratio, horizontal on psychrometric chart.',
  ],
},

fme_combustion: {
  topicId: 'fme_combustion',
  title: 'Combustion & Energy Balances',
  domainWeight: 'Thermodynamics · 7–11%',
  overview: 'Combustion converts chemical energy in fuels to thermal energy. The FE exam tests stoichiometry, air-fuel ratios, and energy balances for combustion processes.',
  sections: [
    {
      id: 'comb-stoich',
      title: '1. Combustion Stoichiometry and Analysis',
      content: `## 1.1 Stoichiometric (Theoretical) Combustion

General hydrocarbon combustion:

**C_aH_b + (a + b/4)(O₂ + 3.76N₂) → aCO₂ + (b/2)H₂O + 3.76(a+b/4)N₂**

For methane: CH₄ + 2(O₂ + 3.76N₂) → CO₂ + 2H₂O + 7.52N₂

## 1.2 Air-Fuel Ratio

**AF_stoich = m_air/m_fuel** (mass basis) or **AF = n_air/n_fuel** (mole basis)

**Equivalence ratio**: Φ = AF_stoich/AF_actual
- Φ < 1: Lean (excess air)
- Φ = 1: Stoichiometric
- Φ > 1: Rich (excess fuel)

**Percent excess air** = (AF_actual - AF_stoich)/AF_stoich × 100%

## 1.3 Heating Values

- **Higher Heating Value (HHV)**: Water in products is liquid (more energy recovered)
- **Lower Heating Value (LHV)**: Water in products is vapor

HHV = LHV + m_water · h_fg

## 1.4 Adiabatic Flame Temperature

Maximum temperature achieved when all chemical energy heats the products (no heat loss):

Σ n_R · h_R = Σ n_P · h_P(T_af)

Solve iteratively or by interpolation from enthalpy tables.`,
      examTip: 'For combustion problems on the FE exam, always balance C first, then H, then O, then N. The stoichiometric air includes 3.76 moles of N₂ for every mole of O₂.',
    },
  ],
  keyTakeaways: [
    'Stoichiometric combustion: balance C, H, O, N in that order.',
    'Air contains 3.76 mol N₂ per mol O₂ (or 21% O₂ by volume).',
    'Equivalence ratio Φ < 1: lean; Φ > 1: rich; Φ = 1: stoichiometric.',
    'HHV > LHV by the latent heat of water in the products.',
    'Adiabatic flame temperature: maximum temperature with no heat loss.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 11 — HEAT TRANSFER  (4 curriculum IDs)  ·  7–11 %
 * ══════════════════════════════════════════════════════════════════ */

fme_conduction: {
  topicId: 'fme_conduction',
  title: 'Conduction Heat Transfer',
  domainWeight: 'Heat Transfer · 7–11%',
  overview: 'Conduction transfers heat through solid materials and stationary fluids by molecular interaction. The FE exam tests Fourier\'s law, thermal resistance, and composite wall analysis.',
  sections: [
    {
      id: 'cond-fourier',
      title: '1. Fourier\'s Law and Thermal Resistance',
      content: `## 1.1 Fourier's Law of Conduction

**q = -kA(dT/dx)** (1D, steady state)

For a **plane wall** of thickness L:

**q = kA(T₁ - T₂)/L**

**Thermal resistance** (plane wall): R = L/(kA)

## 1.2 Composite Walls (Series)

Total resistance: **R_total = R₁ + R₂ + R₃ + ...**

**q = ΔT_overall / R_total = (T_hot - T_cold) / ΣR_i**

Including convection at surfaces:
**R_total = 1/(h₁A) + L₁/(k₁A) + L₂/(k₂A) + ... + 1/(h₂A)**

## 1.3 Cylindrical Coordinates

For a hollow cylinder (radii r₁ to r₂):

**q = 2πkL(T₁ - T₂) / ln(r₂/r₁)**

**Thermal resistance**: R_cyl = ln(r₂/r₁) / (2πkL)

## 1.4 Critical Radius of Insulation

For a cylinder: **r_cr = k_insulation / h_outside**

- Adding insulation when r < r_cr INCREASES heat loss
- Adding insulation when r > r_cr DECREASES heat loss`,
      examTip: 'Thermal resistance is analogous to electrical resistance: q = ΔT/R, like I = V/R. Series resistances add directly. This analogy makes composite wall problems straightforward on the FE exam.',
      importantNote: 'Critical radius of insulation: for small-diameter pipes, adding insulation may initially INCREASE heat loss because the increased surface area dominates over the increased resistance. This is a common FE exam concept.',
    },
  ],
  keyTakeaways: [
    'Fourier\'s law: q = -kA(dT/dx); thermal resistance R = L/(kA) for plane wall.',
    'Composite walls: R_total = ΣR_i; q = ΔT/R_total.',
    'Cylinder: R = ln(r₂/r₁)/(2πkL); critical radius r_cr = k/h.',
    'Thermal-electrical analogy: q↔I, ΔT↔V, R_thermal↔R_electrical.',
  ],
},

fme_convection: {
  topicId: 'fme_convection',
  title: 'Convection Heat Transfer',
  domainWeight: 'Heat Transfer · 7–11%',
  overview: 'Convection transfers heat between a surface and a moving fluid. The FE exam tests Newton\'s law of cooling, dimensionless numbers, and convection correlations for common geometries.',
  sections: [
    {
      id: 'conv-newton',
      title: '1. Convection Fundamentals and Correlations',
      content: `## 1.1 Newton's Law of Cooling

**q = hA(T_s - T_∞)**

Where h = convection coefficient (W/m²·K), T_s = surface temperature, T_∞ = fluid temperature.

**Thermal resistance**: R_conv = 1/(hA)

## 1.2 Dimensionless Numbers

| Number | Formula | Physical Meaning |
|---|---|---|
| Reynolds (Re) | ρVL/μ | Inertia/viscous forces |
| Nusselt (Nu) | hL/k_fluid | Convection/conduction |
| Prandtl (Pr) | ν/α = μc_p/k | Momentum/thermal diffusivity |
| Grashof (Gr) | gβΔTL³/ν² | Buoyancy/viscous forces |
| Rayleigh (Ra) | Gr·Pr | Natural convection parameter |

## 1.3 Common Correlations

**Internal flow (fully developed, turbulent)**:
- **Dittus-Boelter**: Nu = 0.023·Re^(0.8)·Pr^n (n=0.4 heating, 0.3 cooling)

**External flow over flat plate (laminar)**:
- Nu_x = 0.332·Re_x^(1/2)·Pr^(1/3)

**Natural convection (vertical plate)**:
- Nu = C·Ra^n (C and n from tables based on Ra range)

## 1.4 Forced vs. Natural Convection

- **Forced**: Fluid motion driven by external means (fan, pump)
- **Natural (free)**: Fluid motion driven by buoyancy (density differences due to temperature)
- **Mixed**: Both mechanisms significant when Gr/Re² ≈ 1`,
      examTip: 'The Nusselt number Nu = hL/k is the key link between dimensionless correlations and the convection coefficient h. Once you find Nu from a correlation, compute h = Nu·k/L.',
    },
  ],
  keyTakeaways: [
    'Newton\'s law: q = hA(T_s - T_∞); R_conv = 1/(hA).',
    'Nusselt number Nu = hL/k links correlations to h.',
    'Dittus-Boelter: Nu = 0.023·Re^0.8·Pr^n for turbulent pipe flow.',
    'Natural convection driven by buoyancy; use Ra = Gr·Pr.',
    'Prandtl number Pr = ν/α characterizes the fluid (given in tables).',
  ],
},

fme_radiation: {
  topicId: 'fme_radiation',
  title: 'Radiation Heat Transfer',
  domainWeight: 'Heat Transfer · 7–11%',
  overview: 'Thermal radiation transfers heat via electromagnetic waves without requiring a medium. The FE exam tests Stefan-Boltzmann law, emissivity, view factors, and radiation exchange between surfaces.',
  sections: [
    {
      id: 'rad-laws',
      title: '1. Radiation Laws and Exchange',
      content: `## 1.1 Stefan-Boltzmann Law

**Emissive power**: E = εσT⁴

Where: ε = emissivity (0 to 1), σ = 5.67 × 10⁻⁸ W/(m²·K⁴), T in Kelvin.

**Blackbody** (ε = 1): Maximum emitter/absorber at any temperature.

## 1.2 Radiation Properties

- **Absorptivity (α)**: Fraction of incident radiation absorbed
- **Reflectivity (ρ)**: Fraction reflected
- **Transmissivity (τ)**: Fraction transmitted
- **α + ρ + τ = 1** (energy conservation)
- **Kirchhoff's law**: For a body in thermal equilibrium, α = ε

## 1.3 View (Shape) Factors

**F_ij** = fraction of radiation leaving surface i that reaches surface j.

Properties:
- **Reciprocity**: A_i·F_ij = A_j·F_ji
- **Summation**: ΣF_ij = 1 (over all surfaces j in an enclosure)
- **F_ii = 0** for convex or flat surfaces

## 1.4 Radiation Exchange Between Two Surfaces

**Two gray surfaces in an enclosure**:

q₁₂ = σ(T₁⁴ - T₂⁴) / [(1-ε₁)/(ε₁A₁) + 1/(A₁F₁₂) + (1-ε₂)/(ε₂A₂)]

**Special case — small body (1) in large enclosure (2)**:

**q = ε₁σA₁(T₁⁴ - T₂⁴)**`,
      examTip: 'Radiation uses T⁴ — all temperatures must be in ABSOLUTE units (Kelvin or Rankine). This is the most common radiation error on the FE exam. Also, ε = α (Kirchhoff\'s law) is a frequent test point.',
      importantNote: 'The "small body in large enclosure" formula q = εσA(T₁⁴ - T₂⁴) is the most commonly tested radiation equation on the FE exam. It applies when the surroundings are much larger than the object.',
    },
  ],
  keyTakeaways: [
    'Stefan-Boltzmann: E = εσT⁴; σ = 5.67×10⁻⁸ W/(m²·K⁴).',
    'Kirchhoff\'s law: α = ε at thermal equilibrium.',
    'View factor reciprocity: A₁F₁₂ = A₂F₂₁; summation: ΣF_ij = 1.',
    'Small body in large enclosure: q = εσA(T₁⁴ - T₂⁴).',
    'All radiation temperatures must be in absolute units (K or R).',
  ],
},

fme_exchangers: {
  topicId: 'fme_exchangers',
  title: 'Heat Exchangers',
  domainWeight: 'Heat Transfer · 7–11%',
  overview: 'Heat exchangers transfer thermal energy between two fluid streams. The FE exam tests the LMTD method, effectiveness-NTU method, and overall heat transfer coefficient.',
  sections: [
    {
      id: 'hx-methods',
      title: '1. Heat Exchanger Analysis',
      content: `## 1.1 Overall Heat Transfer Coefficient

**1/UA = 1/(h₁A₁) + R_wall + 1/(h₂A₂)**

For a thin-walled tube: **1/U = 1/h_i + 1/h_o** (per unit area)

## 1.2 LMTD Method

**q = U·A·ΔT_lm**

**Log-Mean Temperature Difference**:

**ΔT_lm = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)**

For **counterflow**: ΔT₁ = T_h,in - T_c,out; ΔT₂ = T_h,out - T_c,in
For **parallel flow**: ΔT₁ = T_h,in - T_c,in; ΔT₂ = T_h,out - T_c,out

For multi-pass or crossflow: **q = U·A·F·ΔT_lm,cf** (F = correction factor)

## 1.3 Effectiveness-NTU Method

**NTU = UA/C_min** where C = ṁc_p

**Effectiveness**: ε = q_actual / q_max

**q_max = C_min(T_h,in - T_c,in)**

For **counterflow** HX:
ε = [1 - exp(-NTU(1 - C_r))] / [1 - C_r·exp(-NTU(1 - C_r))]

Where C_r = C_min/C_max.

## 1.4 Heat Exchanger Types

| Type | Typical Use | ΔT_lm |
|---|---|---|
| Parallel flow | Simple, low effectiveness | Lower |
| Counterflow | Higher effectiveness | Higher |
| Shell-and-tube | Industrial standard | Use correction factor F |
| Crossflow | Compact (radiators, HVAC) | Use correction factor F |`,
      examTip: 'Use LMTD method when all four temperatures are known. Use ε-NTU when you know inlet temperatures but NOT outlet temperatures. The FE reference handbook has ε-NTU charts for common configurations.',
      importantNote: 'Counterflow heat exchangers are always more effective than parallel flow for the same UA and flow rates. The counterflow LMTD is always greater than or equal to the parallel flow LMTD.',
    },
  ],
  keyTakeaways: [
    'LMTD method: q = UA·ΔT_lm; use when all temperatures are known.',
    'ε-NTU method: q = ε·C_min·(T_h,in - T_c,in); use when outlets are unknown.',
    'Overall U: 1/U = 1/h_i + R_wall + 1/h_o.',
    'Counterflow always gives higher LMTD than parallel flow.',
    'NTU = UA/C_min; effectiveness increases with NTU.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 12 — MEASUREMENTS, INSTRUMENTATION & CONTROLS  (3 IDs) · 5–8 %
 * ══════════════════════════════════════════════════════════════════ */

fme_sensors: {
  topicId: 'fme_sensors',
  title: 'Sensors & Instrumentation',
  domainWeight: 'Measurements, Instrumentation & Controls · 5–8%',
  overview: 'Sensors convert physical quantities into measurable signals. The FE exam tests common sensor types, measurement characteristics (accuracy, precision, resolution), and signal conditioning.',
  sections: [
    {
      id: 'sens-types',
      title: '1. Sensor Types and Measurement Characteristics',
      content: `## 1.1 Common Sensor Types

| Measurand | Sensor | Principle |
|---|---|---|
| Temperature | Thermocouple | Seebeck effect (voltage from junctions) |
| Temperature | RTD | Resistance changes with temperature |
| Temperature | Thermistor | Large resistance change (nonlinear) |
| Strain | Strain gauge | Resistance changes with deformation |
| Pressure | Bourdon tube | Mechanical deflection |
| Pressure | Piezoelectric | Charge from deformation |
| Flow | Orifice plate | Pressure drop (Bernoulli) |
| Flow | Turbine meter | Rotation proportional to flow |
| Displacement | LVDT | AC voltage proportional to position |
| Acceleration | Accelerometer | Piezoelectric or MEMS |

## 1.2 Measurement Characteristics

| Term | Definition |
|---|---|
| **Accuracy** | Closeness to true value |
| **Precision** | Repeatability of measurements |
| **Resolution** | Smallest detectable change |
| **Sensitivity** | Output change per unit input change |
| **Range/Span** | Min to max measurable value |
| **Linearity** | Deviation from straight-line response |
| **Hysteresis** | Output depends on direction of approach |

## 1.3 Measurement Error

**Systematic (bias) error**: Consistent offset — can be calibrated out
**Random error**: Statistical variation — reduced by averaging

**Uncertainty propagation** (for independent measurements):
If f = f(x₁, x₂, ...), then:
**δf = √[Σ(∂f/∂x_i · δx_i)²]**`,
      examTip: 'Accuracy vs. precision: a measurement can be precise (repeatable) but inaccurate (biased). Think of darts — precision = tight cluster; accuracy = cluster at bullseye. The FE exam tests this distinction.',
    },
  ],
  keyTakeaways: [
    'Thermocouple: Seebeck effect; RTD: resistance vs. temperature; strain gauge: resistance vs. deformation.',
    'Accuracy = closeness to true value; precision = repeatability.',
    'Systematic errors can be calibrated out; random errors reduced by averaging.',
    'Uncertainty propagation: δf = √[Σ(∂f/∂x_i·δx_i)²].',
  ],
},

fme_controls_basic: {
  topicId: 'fme_controls_basic',
  title: 'Control Systems Fundamentals',
  domainWeight: 'Measurements, Instrumentation & Controls · 5–8%',
  overview: 'Control systems maintain desired output by adjusting inputs. The FE exam tests block diagrams, transfer functions, PID control, and basic stability analysis.',
  sections: [
    {
      id: 'ctrl-basics',
      title: '1. Control System Concepts',
      content: `## 1.1 Open-Loop vs. Closed-Loop

- **Open-loop**: No feedback; output not measured or compared
- **Closed-loop (feedback)**: Output measured and compared to setpoint; error drives controller

## 1.2 Block Diagram Algebra

**Closed-loop transfer function**:

**T(s) = G(s) / [1 + G(s)H(s)]** (negative feedback)

Where G(s) = forward path, H(s) = feedback path.

**Series**: G_total = G₁ · G₂
**Parallel**: G_total = G₁ + G₂
**Moving blocks**: Use rules to move summing junctions and pick-off points

## 1.3 PID Controller

**Output = K_p·e + K_i·∫e dt + K_d·de/dt**

| Term | Action | Effect |
|---|---|---|
| Proportional (P) | K_p · e | Reduces error but leaves offset |
| Integral (I) | K_i · ∫e dt | Eliminates steady-state error |
| Derivative (D) | K_d · de/dt | Reduces overshoot, improves stability |

## 1.4 First-Order System Response

**Transfer function**: G(s) = K/(τs + 1)

**Step response**: y(t) = K·(1 - e^(-t/τ))
- τ = time constant
- At t = τ: reaches 63.2% of final value
- At t = 5τ: reaches ~99% (approximately settled)`,
      examTip: 'The closed-loop transfer function T(s) = G/(1+GH) is the most important control system formula for the FE exam. For unity feedback (H=1): T(s) = G/(1+G).',
      importantNote: 'PID tuning: P reduces error, I eliminates steady-state error, D reduces overshoot. Adding I can cause instability if gain is too high. The FE exam tests the qualitative effects of each term.',
    },
  ],
  keyTakeaways: [
    'Closed-loop TF: T(s) = G(s)/[1+G(s)H(s)] for negative feedback.',
    'PID: P reduces error, I eliminates offset, D reduces overshoot.',
    'First-order time constant τ: 63.2% at t=τ, ~99% at t=5τ.',
    'Series blocks multiply; parallel blocks add.',
  ],
},

fme_signal: {
  topicId: 'fme_signal',
  title: 'Signal Processing & Data Acquisition',
  domainWeight: 'Measurements, Instrumentation & Controls · 5–8%',
  overview: 'Signal processing converts raw sensor data into useful information. The FE exam tests filtering, sampling, A/D conversion, and basic frequency analysis.',
  sections: [
    {
      id: 'sig-process',
      title: '1. Signal Processing Fundamentals',
      content: `## 1.1 Analog-to-Digital Conversion

**Resolution** = Full Scale Range / 2^n (n = number of bits)

Example: 10V range, 8-bit ADC: resolution = 10/256 = 0.039 V

**Sampling rate** must satisfy **Nyquist criterion**: f_s > 2·f_max

- f_s = sampling frequency
- f_max = highest frequency component in signal
- **Aliasing** occurs if f_s < 2·f_max (high frequencies appear as low frequencies)

## 1.2 Filters

| Filter Type | Passes | Blocks | Application |
|---|---|---|---|
| Low-pass | f < f_c | f > f_c | Remove noise |
| High-pass | f > f_c | f < f_c | Remove DC offset |
| Band-pass | f_L < f < f_H | Outside band | Isolate frequency |
| Notch (band-stop) | Outside band | f_L < f < f_H | Remove specific frequency |

**Cutoff frequency** (f_c): -3 dB point (output = 70.7% of input amplitude)

## 1.3 Signal Characteristics

- **Static signal**: Does not change with time
- **Dynamic signal**: Changes with time
- **Periodic signal**: Repeats at regular intervals (frequency = 1/period)
- **Noise**: Unwanted random signal superimposed on desired signal
- **Signal-to-noise ratio (SNR)**: Higher = better; SNR(dB) = 20·log₁₀(V_signal/V_noise)`,
      examTip: 'Nyquist: sample at least 2× the highest frequency in the signal, or aliasing occurs. This is one of the most commonly tested signal processing concepts on the FE exam.',
    },
  ],
  keyTakeaways: [
    'ADC resolution = range/2^n; more bits = finer resolution.',
    'Nyquist: f_s > 2f_max to avoid aliasing.',
    'Low-pass filter removes high-frequency noise.',
    'Cutoff frequency at -3 dB (70.7% amplitude).',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 13 — MECHANICAL DESIGN & ANALYSIS  (6 curriculum IDs) · 7–11 %
 * ══════════════════════════════════════════════════════════════════ */

fme_fasteners: {
  topicId: 'fme_fasteners',
  title: 'Threaded Fasteners & Bolted Joints',
  domainWeight: 'Mechanical Design & Analysis · 7–11%',
  overview: 'Threaded fasteners are the most common machine elements. The FE exam tests bolt stress analysis, preload, joint stiffness, and fatigue in bolted connections.',
  sections: [
    {
      id: 'fast-bolts',
      title: '1. Bolt Analysis',
      content: `## 1.1 Bolt Stress Areas

**Tensile stress area** (A_t): Effective area for axial stress calculations.
- A_t = π/4 · ((d_p + d_r)/2)² (approximate)
- Use tabulated values from the FE reference handbook

**Proof load**: F_p = S_p · A_t (where S_p = proof strength)

## 1.2 Bolt Preload and External Loading

**Preload** F_i: Initial clamping force from tightening.

When external load P is applied:
- **Bolt load**: F_b = F_i + C·P
- **Joint (clamped member) load**: F_m = F_i - (1-C)·P

Where **C = k_b/(k_b + k_m)** = stiffness ratio (fraction of external load carried by bolt).

Typically C ≈ 0.2–0.3 (bolt carries only 20–30% of external load when preloaded).

## 1.3 Bolt Stresses

**Tensile stress**: σ = F_b/A_t
**Shear stress** (in shear joints): τ = V/(n·A_b) (n = number of bolts, A_b = bolt body area)

**Bolt torque**: T = K·F_i·d (K ≈ 0.2 for typical dry bolts, d = nominal diameter)

## 1.4 Bolt Grades and Materials

| SAE Grade | Proof Strength (ksi) | Tensile Strength (ksi) |
|---|---|---|
| Grade 2 | 55 | 74 |
| Grade 5 | 85 | 120 |
| Grade 8 | 120 | 150 |`,
      examTip: 'The stiffness ratio C determines how much of the external load reaches the bolt. A good preload means C is small, so most of the external load is carried by clamping. This is why preload is critical for bolt fatigue life.',
    },
  ],
  keyTakeaways: [
    'Tensile stress area A_t (from tables) for bolt stress: σ = F/A_t.',
    'Preloaded bolt: F_b = F_i + CP; joint carries most of external load.',
    'Stiffness ratio C = k_b/(k_b + k_m); typically 0.2–0.3.',
    'Bolt torque: T = K·F_i·d with K ≈ 0.2 for dry bolts.',
    'Higher preload improves fatigue life by reducing load fluctuation on bolt.',
  ],
},

fme_bearings: {
  topicId: 'fme_bearings',
  title: 'Bearings',
  domainWeight: 'Mechanical Design & Analysis · 7–11%',
  overview: 'Bearings support rotating shafts and reduce friction. The FE exam tests rolling element bearing life calculations and basic journal bearing concepts.',
  sections: [
    {
      id: 'bear-rolling',
      title: '1. Rolling Element Bearings',
      content: `## 1.1 Bearing Life Equation

**L₁₀ = (C/P)^p**

Where:
- L₁₀ = rated life in millions of revolutions (10% failure probability)
- C = basic dynamic load rating (from catalog)
- P = equivalent dynamic bearing load
- p = 3 for ball bearings, 10/3 for roller bearings

**Life in hours**: L₁₀h = L₁₀ × 10⁶ / (60·n) (n = rpm)

## 1.2 Equivalent Bearing Load

**P = X·F_r + Y·F_a**

Where: F_r = radial load, F_a = axial (thrust) load, X and Y from bearing tables.

For purely radial loading: P = F_r

## 1.3 Adjusted Rating Life

**L_na = a₁·a₂·a₃·L₁₀**

- a₁: reliability factor (1.0 for 90%, 0.62 for 95%, 0.44 for 97%)
- a₂: material factor
- a₃: operating condition factor

## 1.4 Journal (Sliding) Bearings

Key parameters:
- **Sommerfeld number**: S = (r/c)²·(μN/P) — dimensionless parameter governing bearing behavior
- **Minimum film thickness** (h₀): Must exceed surface roughness
- **Petroff's equation** (lightly loaded): f = 2π²(μNr)/(Pc)`,
      examTip: 'L₁₀ life equation: (C/P)^3 for ball bearings, (C/P)^(10/3) for rollers. If bearing load doubles, life drops by a factor of 8 (for ball bearings). This inverse-cube relationship is a key FE exam concept.',
    },
  ],
  keyTakeaways: [
    'Bearing life: L₁₀ = (C/P)^3 for ball bearings; life in hours = L₁₀×10⁶/(60n).',
    'Equivalent load: P = XF_r + YF_a; X and Y from tables.',
    'Double the load → life reduces by factor of 8 (ball) or ~6.5 (roller).',
    'Adjusted life: L_na = a₁·a₂·a₃·L₁₀ for different reliability levels.',
  ],
},

fme_gears: {
  topicId: 'fme_gears',
  title: 'Gear Systems',
  domainWeight: 'Mechanical Design & Analysis · 7–11%',
  overview: 'Gears transmit power and motion between shafts. The FE exam tests gear ratios, gear train analysis, and fundamental gear terminology.',
  sections: [
    {
      id: 'gear-basics',
      title: '1. Gear Fundamentals and Trains',
      content: `## 1.1 Spur Gear Terminology

| Term | Symbol | Definition |
|---|---|---|
| Number of teeth | N | Count of teeth on gear |
| Diametral pitch | P | N/d (teeth per inch of diameter) |
| Module | m | d/N (mm per tooth) — metric |
| Pitch diameter | d | N/P (inches) or m·N (mm) |
| Pressure angle | φ | Typically 20° or 25° |
| Circular pitch | p | πd/N = π/P |

**Meshing requirement**: Two gears must have the SAME diametral pitch (or module) and pressure angle.

## 1.2 Gear Ratios

**Speed ratio**: ω₂/ω₁ = N₁/N₂ = d₁/d₂

**Torque ratio**: T₂/T₁ = N₂/N₁ (assuming 100% efficiency)

**Power**: P = Tω (same on both shafts if no losses)

## 1.3 Gear Train Analysis

**Simple gear train**: ω_out/ω_in = (-1)^n · (product of driving teeth)/(product of driven teeth)

Where n = number of external mesh pairs (negative = direction reversal).

**Planetary (epicyclic) gear train**: Use the tabular or formula method:
- ω_ring/ω_arm = -(N_sun/N_ring) with carrier fixed

## 1.4 Gear Forces

For spur gears:
- **Tangential force**: W_t = T/(d/2) = 2T/d (transmits power)
- **Radial force**: W_r = W_t · tan(φ) (separating force)
- **Transmitted power**: P = W_t · v (v = pitch line velocity)`,
      examTip: 'Gear ratio is inversely proportional to tooth count: the smaller gear (pinion) spins faster. Each external mesh pair reverses direction. Idler gears change direction but not speed ratio.',
    },
  ],
  keyTakeaways: [
    'Speed ratio: ω₂/ω₁ = N₁/N₂; larger gear rotates slower.',
    'Meshing gears must have same diametral pitch and pressure angle.',
    'Tangential force W_t = 2T/d; radial force W_r = W_t·tanφ.',
    'Power is constant through a gear train (ignoring losses): P = Tω.',
    'Each external mesh reverses rotation direction.',
  ],
},

fme_shafts: {
  topicId: 'fme_shafts',
  title: 'Shaft Design',
  domainWeight: 'Mechanical Design & Analysis · 7–11%',
  overview: 'Shafts transmit torque and support rotating elements. The FE exam tests shaft stress analysis under combined loading, critical speed, and key/coupling design.',
  sections: [
    {
      id: 'shaft-design',
      title: '1. Shaft Analysis',
      content: `## 1.1 Combined Loading on Shafts

Shafts typically experience:
- **Torsion** (from transmitted torque): τ = Tc/J
- **Bending** (from gear/pulley/bearing forces): σ = Mc/I
- Combined using **von Mises or maximum shear stress theory**

## 1.2 Static Design

**Maximum shear stress theory** (for ductile materials):

**τ_max = √[(σ_b/2)² + τ_t²]** ≤ σ_y/(2·n)

Or equivalently for a solid shaft:

**d = [16n/π · √(M² + T²) / σ_y]^(1/3)** (for max shear stress criterion)

## 1.3 Fatigue Design (DE-Goodman)

For fluctuating loads:

**1/n = (σ_a'/S_e) + (σ_m'/S_y)** (Goodman line)

Where σ_a', σ_m' are von Mises alternating and mean stresses:
- σ_a' = √[(32K_f·M_a/(πd³))² + 3(16K_fs·T_a/(πd³))²]
- σ_m' = √[(32M_m/(πd³))² + 3(16T_m/(πd³))²]

## 1.4 Critical Speed

**First critical speed** (Rayleigh approximation):

**ω_cr = √(g·Σw_i·y_i / Σw_i·y_i²)**

Or for a simply supported shaft with central mass:

**ω_cr = √(48EI/(mL³))**

Design rule: Operating speed should be < 0.7·ω_cr or > 1.3·ω_cr.`,
      examTip: 'For shaft design, bending creates alternating stress (reverses each revolution) while torque is typically steady. Apply fatigue stress concentration factors K_f to bending, K_fs to torsion.',
    },
  ],
  keyTakeaways: [
    'Shafts see combined bending (alternating) and torsion (steady).',
    'Max shear stress: τ_max = √[(σ/2)² + τ²]; use for static design.',
    'Fatigue design: Goodman line with K_f applied to alternating stress.',
    'Critical speed must be well separated from operating speed.',
  ],
},

fme_springs: {
  topicId: 'fme_springs',
  title: 'Spring Design',
  domainWeight: 'Mechanical Design & Analysis · 7–11%',
  overview: 'Springs store and release energy. The FE exam tests helical compression spring analysis, spring rate, and stress calculations.',
  sections: [
    {
      id: 'spring-helical',
      title: '1. Helical Springs',
      content: `## 1.1 Helical Compression Spring

**Spring rate**: k = F/δ = Gd⁴/(8D³N_a)

Where:
- G = shear modulus
- d = wire diameter
- D = mean coil diameter
- N_a = number of active coils
- C = D/d = spring index (typically 4–12)

## 1.2 Spring Stress

**Shear stress** (with Wahl correction):

**τ = K_W · 8FD/(πd³)**

Where K_W = (4C-1)/(4C-4) + 0.615/C (Wahl factor, accounts for curvature and direct shear)

For static analysis, some use K_s = 1 + 0.5/C (shear factor without curvature).

## 1.3 Spring Combinations

- **Parallel**: k_eq = k₁ + k₂ (same deflection, forces add)
- **Series**: 1/k_eq = 1/k₁ + 1/k₂ (same force, deflections add)

## 1.4 Spring Energy

**Stored energy**: U = ½kδ² = ½Fδ = F²/(2k)

## 1.5 Common Spring Types

| Type | Function | Load Type |
|---|---|---|
| Compression | Resist compressive force | Axial |
| Extension | Resist tensile force | Axial |
| Torsion | Resist torque | Angular |
| Belleville (disc) | High force, small deflection | Axial |
| Leaf | Vehicle suspension | Bending |`,
      examTip: 'Spring rate k = Gd⁴/(8D³N_a) — note d to the 4th power. Doubling wire diameter increases spring rate by 16×. This strong dependence on wire diameter is a key design consideration.',
    },
  ],
  keyTakeaways: [
    'Spring rate: k = Gd⁴/(8D³N_a); strongly dependent on wire diameter.',
    'Shear stress: τ = K_W·8FD/(πd³) with Wahl correction factor.',
    'Parallel springs add rates; series springs add compliances.',
    'Spring energy: U = ½kδ² = F²/(2k).',
    'Spring index C = D/d; typical range 4–12.',
  ],
},

fme_fatigue: {
  topicId: 'fme_fatigue',
  title: 'Fatigue Failure & Life Prediction',
  domainWeight: 'Mechanical Design & Analysis · 7–11%',
  overview: 'Fatigue causes failure under cyclic loading at stresses below the static yield strength. The FE exam tests S-N curves, endurance limit, Goodman diagrams, and stress concentration effects.',
  sections: [
    {
      id: 'fatigue-basics',
      title: '1. Fatigue Analysis',
      content: `## 1.1 S-N Curve

The S-N (Wöhler) curve plots stress amplitude vs. cycles to failure:

- **Low-cycle fatigue**: N < 10³ (significant plastic deformation)
- **High-cycle fatigue**: N > 10³ (primarily elastic)
- **Endurance limit (S_e)**: Stress below which infinite life (for steels, ~10⁶-10⁷ cycles)

**Approximate endurance limit** (steels):
- S_e' ≈ 0.5·S_ut for S_ut < 200 ksi (1400 MPa)
- S_e' = 100 ksi (700 MPa) for S_ut ≥ 200 ksi

## 1.2 Modified Endurance Limit

**S_e = k_a · k_b · k_c · k_d · k_e · S_e'**

| Factor | Accounts For |
|---|---|
| k_a (surface) | Surface finish |
| k_b (size) | Part size |
| k_c (loading) | Type of loading (bending, axial, torsion) |
| k_d (temperature) | Operating temperature |
| k_e (reliability) | Required reliability level |

## 1.3 Goodman Diagram

For combined mean and alternating stress:

**σ_a/S_e + σ_m/S_ut = 1/n** (Goodman line)

Other criteria:
- **Soderberg**: σ_a/S_e + σ_m/S_y = 1/n (conservative)
- **Gerber**: σ_a/S_e + (σ_m/S_ut)² = 1/n (less conservative)

## 1.4 Stress Concentration in Fatigue

**Fatigue stress concentration factor**: K_f = 1 + q(K_t - 1)

Where K_t = theoretical stress concentration factor, q = notch sensitivity (0 to 1).

Apply K_f to the **alternating** stress component: σ_a,effective = K_f · σ_a`,
      examTip: 'Modified Goodman: σ_a/S_e + σ_m/S_ut = 1/n. Apply K_f to alternating stress only (not mean stress for the Goodman criterion). The endurance limit S_e must include all modification factors.',
      importantNote: 'Non-ferrous metals (aluminum, copper) do NOT have a true endurance limit — the S-N curve keeps decreasing. For aluminum, specify "fatigue strength at N cycles" rather than an endurance limit.',
    },
  ],
  keyTakeaways: [
    'Endurance limit S_e\' ≈ 0.5·S_ut for steels (S_ut < 200 ksi).',
    'Modified endurance: S_e = k_a·k_b·k_c·k_d·k_e·S_e\'.',
    'Goodman: σ_a/S_e + σ_m/S_ut = 1/n; apply K_f to σ_a only.',
    'K_f = 1 + q(K_t - 1); q = notch sensitivity (0 to 1).',
    'Aluminum has no endurance limit — S-N curve always decreases.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 14 — MANUFACTURING  (3 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fme_machining: {
  topicId: 'fme_machining',
  title: 'Machining & Material Removal',
  domainWeight: 'Manufacturing · 3–5%',
  overview: 'Machining removes material to create precise parts. The FE exam tests cutting speed, feed, depth of cut, material removal rate, and tool life for common machining operations.',
  sections: [
    {
      id: 'mach-turning',
      title: '1. Machining Operations and Parameters',
      content: `## 1.1 Turning (Lathe)

**Cutting speed**: V = πDN (D = workpiece diameter, N = rpm)

**Material removal rate**: MRR = V·f·d (f = feed, d = depth of cut)

**Machining time**: t_m = L/(f·N) (L = cut length)

## 1.2 Milling

**Cutting speed**: V = πDN (D = cutter diameter)
**Feed rate**: f_r = f_t·n_t·N (f_t = feed per tooth, n_t = number of teeth)
**MRR** = w·d·f_r (w = width of cut)

## 1.3 Drilling

**Cutting speed**: V = πDN (D = drill diameter)
**MRR** = (πD²/4)·f·N (f = feed per revolution)

## 1.4 Tool Life — Taylor Equation

**V·T^n = C**

Where: V = cutting speed, T = tool life (minutes), n = Taylor exponent, C = constant.

| Material | n (typical) |
|---|---|
| HSS tools | 0.08–0.2 |
| Carbide tools | 0.2–0.5 |
| Ceramic tools | 0.5–0.7 |

Higher n → tool life less sensitive to speed changes.

## 1.5 Cutting Tool Materials

| Material | Hardness | Toughness | Speed Capability |
|---|---|---|---|
| High-Speed Steel (HSS) | Moderate | High | Low-medium |
| Carbide (WC-Co) | High | Moderate | Medium-high |
| Ceramic (Al₂O₃) | Very high | Low | High |
| CBN | Very high | Low | Very high (hardened steel) |
| Diamond (PCD) | Highest | Very low | Highest (non-ferrous) |`,
      examTip: 'Taylor tool life equation VT^n = C: if you double the cutting speed, tool life decreases dramatically. For HSS (n≈0.125), doubling speed reduces life by a factor of ~256. Choose cutting speed carefully.',
    },
  ],
  keyTakeaways: [
    'Cutting speed V = πDN; MRR = V·f·d (turning).',
    'Taylor tool life: VT^n = C; higher speed = shorter tool life.',
    'HSS: tough but slow; carbide: faster; ceramic: fastest but brittle.',
    'Machining time = length / (feed × rpm).',
  ],
},

fme_forming: {
  topicId: 'fme_forming',
  title: 'Forming & Joining Processes',
  domainWeight: 'Manufacturing · 3–5%',
  overview: 'Forming reshapes material without removal, and joining bonds components together. The FE exam tests forging, rolling, extrusion, welding, and casting fundamentals.',
  sections: [
    {
      id: 'form-processes',
      title: '1. Forming and Joining Processes',
      content: `## 1.1 Bulk Deformation Processes

| Process | Description | Products |
|---|---|---|
| Forging | Compressive force shapes heated/cold metal | Crankshafts, gears, connecting rods |
| Rolling | Thickness reduction through rollers | Sheet, plate, structural shapes |
| Extrusion | Forced through die opening | Tubes, rods, complex profiles |
| Drawing | Pulled through die (reduction in area) | Wire, tubing |

**Hot working** (T > recrystallization): Lower forces, no work hardening, poorer surface finish.
**Cold working** (T < recrystallization): Higher forces, work hardening, better finish and tolerances.

## 1.2 Sheet Metal Processes

- **Blanking**: Punching out a shape (the blank is the product)
- **Punching**: Creating a hole (the remaining sheet is the product)
- **Bending**: Permanent deformation along a line
- **Deep drawing**: Forming a cup from a flat blank

**Blanking/punching force**: F = S_s · t · L (S_s = shear strength, t = thickness, L = perimeter)

## 1.3 Casting

Types: Sand casting, die casting, investment (lost-wax) casting

**Design rules**:
- Uniform wall thickness (avoid hot spots)
- Draft angles for pattern removal
- Fillets at corners (reduce stress concentration)
- Risers to feed shrinkage

## 1.4 Welding

| Process | Heat Source | Characteristics |
|---|---|---|
| SMAW (stick) | Arc + electrode | Versatile, all positions |
| GMAW (MIG) | Arc + wire + gas | High production, easy automation |
| GTAW (TIG) | Tungsten arc + gas | High quality, thin sections |
| Resistance | Electrical resistance | Spot, seam welding |

**Heat-affected zone (HAZ)**: Region adjacent to weld where microstructure changes.`,
      examTip: 'Hot working vs. cold working: hot working occurs above the recrystallization temperature. Cold working increases strength (work hardening) but reduces ductility. The FE exam tests this trade-off.',
    },
  ],
  keyTakeaways: [
    'Hot working: above recrystallization temp, lower forces, no work hardening.',
    'Cold working: higher forces, work hardening increases strength.',
    'Blanking force: F = S_s × perimeter × thickness.',
    'Welding HAZ: microstructure changed by heat, may be weakest zone.',
    'Casting: uniform walls, draft angles, risers for shrinkage.',
  ],
},

fme_tolerancing: {
  topicId: 'fme_tolerancing',
  title: 'Dimensioning, Tolerancing & GD&T',
  domainWeight: 'Manufacturing · 3–5%',
  overview: 'Tolerancing specifies allowable dimensional variation. The FE exam tests basic tolerancing, fits, and an introduction to Geometric Dimensioning and Tolerancing (GD&T).',
  sections: [
    {
      id: 'tol-basics',
      title: '1. Tolerancing Fundamentals',
      content: `## 1.1 Basic Tolerance Concepts

- **Nominal size**: The target dimension
- **Tolerance**: Total allowable variation = Upper limit - Lower limit
- **Bilateral tolerance**: ± variation (e.g., 25.00 ± 0.05 mm)
- **Unilateral tolerance**: Variation in one direction (e.g., 25.00 +0.10/-0.00 mm)

## 1.2 Fits

| Fit Type | Description | Clearance |
|---|---|---|
| Clearance fit | Shaft always smaller than hole | Always positive gap |
| Interference (press) fit | Shaft always larger than hole | Always negative gap |
| Transition fit | Could be clearance or interference | Depends on actual sizes |

**Hole-basis system**: Hole is standard, shaft is adjusted.
**Shaft-basis system**: Shaft is standard, hole is adjusted.

## 1.3 GD&T Basics

| Symbol | Control | Description |
|---|---|---|
| ⊙ | Position | Location relative to datums |
| ○ | Concentricity | Axis alignment |
| ⊕ | Symmetry | Feature symmetry about datum |
| — | Flatness | Surface variation from plane |
| ∥ | Parallelism | Parallel to datum |
| ⊥ | Perpendicularity | 90° to datum |
| ◎ | Circular runout | Variation during rotation |

## 1.4 Statistical Tolerancing

**Worst-case**: T_assembly = ΣT_i (tolerances add directly)
**Statistical (RSS)**: T_assembly = √(ΣT_i²) (root sum of squares)

RSS gives tighter assembly tolerance with high probability of fit (~99.73% for 3σ).`,
      examTip: 'Worst-case tolerance stacking adds all tolerances directly — guaranteed to fit but expensive. Statistical (RSS) tolerancing gives tighter assemblies with very high probability of fit and is more economical.',
    },
  ],
  keyTakeaways: [
    'Clearance fit: shaft always smaller; interference fit: shaft always larger.',
    'Worst-case tolerance: T_total = ΣT_i; RSS: T_total = √(ΣT_i²).',
    'GD&T provides geometric controls (position, flatness, perpendicularity).',
    'Hole-basis system: standard hole, adjust shaft.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 15 — ENGINEERING MANAGEMENT  (2 curriculum IDs)  ·  3–5 %
 * ══════════════════════════════════════════════════════════════════ */

fme_project: {
  topicId: 'fme_project',
  title: 'Project Management',
  domainWeight: 'Engineering Management · 3–5%',
  overview: 'Project management ensures engineering projects are completed on time, within budget, and to specification. The FE exam tests scheduling methods (CPM/PERT), Gantt charts, and project planning fundamentals.',
  sections: [
    {
      id: 'proj-schedule',
      title: '1. Project Scheduling and Planning',
      content: `## 1.1 Critical Path Method (CPM)

**Network diagram**: Shows task dependencies (precedence relationships).

Steps:
1. List all activities with durations and dependencies
2. **Forward pass**: Calculate earliest start (ES) and earliest finish (EF)
   - EF = ES + Duration
   - ES of successor = max(EF of all predecessors)
3. **Backward pass**: Calculate latest start (LS) and latest finish (LF)
   - LS = LF - Duration
   - LF of predecessor = min(LS of all successors)
4. **Slack/Float** = LS - ES = LF - EF

**Critical path**: The longest path through the network — activities with **zero slack**.

- Project duration = length of critical path
- Delaying any critical activity delays the entire project

## 1.2 PERT (Program Evaluation and Review Technique)

Uses three time estimates:
- **Optimistic (a)**, **Most likely (m)**, **Pessimistic (b)**
- **Expected time**: t_e = (a + 4m + b) / 6
- **Variance**: σ² = ((b - a)/6)²
- **Project variance** = Σ(variances of critical path activities)

## 1.3 Gantt Charts

- Horizontal bar chart showing task timeline
- Shows duration, start/end, and overlaps
- Easy to read but doesn't show dependencies as clearly as network diagrams`,
      examTip: 'The critical path has ZERO slack. To find it: forward pass (earliest times), backward pass (latest times), then slack = LS - ES. Activities with zero slack form the critical path.',
      importantNote: 'A project can have multiple critical paths. If any activity on ANY critical path is delayed, the project is delayed. Always check all paths when identifying the critical path(s).',
    },
  ],
  keyTakeaways: [
    'Critical path = longest path = zero slack; determines project duration.',
    'Forward pass: ES → EF; backward pass: LF → LS; slack = LS - ES.',
    'PERT: t_e = (a + 4m + b)/6; σ² = ((b-a)/6)².',
    'Delaying a critical activity delays the entire project.',
  ],
},

fme_quality: {
  topicId: 'fme_quality',
  title: 'Quality Control & Improvement',
  domainWeight: 'Engineering Management · 3–5%',
  overview: 'Quality control ensures products meet specifications through statistical process control and continuous improvement. The FE exam tests control charts, process capability, and quality management tools.',
  sections: [
    {
      id: 'qual-spc',
      title: '1. Statistical Process Control and Quality Tools',
      content: `## 1.1 Control Charts

**X̄ chart** (mean chart): Monitors process central tendency
- UCL = X̄̄ + A₂·R̄
- LCL = X̄̄ - A₂·R̄

**R chart** (range chart): Monitors process variability
- UCL = D₄·R̄
- LCL = D₃·R̄

(A₂, D₃, D₄ are constants based on sample size, given in tables)

**Out of control signals**:
- Point outside control limits
- 7 or more consecutive points on one side of center line
- Systematic patterns (trends, cycles)

## 1.2 Process Capability

**C_p = (USL - LSL) / (6σ)** — Measures potential capability

**C_pk = min[(USL - μ)/(3σ), (μ - LSL)/(3σ)]** — Measures actual capability

| C_pk Value | Interpretation |
|---|---|
| < 1.0 | Not capable (excessive defects) |
| 1.0–1.33 | Marginally capable |
| 1.33–1.67 | Capable |
| > 1.67 | Highly capable (Six Sigma ≈ 2.0) |

## 1.3 Quality Management Tools

**Seven Basic Quality Tools**:
1. Cause-and-effect (fishbone/Ishikawa) diagram
2. Check sheet
3. Control chart
4. Histogram
5. Pareto chart (80/20 rule)
6. Scatter diagram
7. Flowchart

## 1.4 Six Sigma

**DMAIC**: Define → Measure → Analyze → Improve → Control

**Six Sigma** targets 3.4 defects per million opportunities (DPMO).

| Sigma Level | DPMO | Yield |
|---|---|---|
| 3σ | 66,807 | 93.32% |
| 4σ | 6,210 | 99.38% |
| 5σ | 233 | 99.977% |
| 6σ | 3.4 | 99.99966% |`,
      examTip: 'C_p measures what the process COULD do if centered; C_pk measures what it actually does. If C_p is high but C_pk is low, the process is capable but not centered — shift the mean. This distinction is commonly tested.',
      importantNote: 'The Pareto principle (80/20 rule): roughly 80% of defects come from 20% of causes. Focus improvement efforts on the vital few causes identified by Pareto analysis.',
    },
  ],
  keyTakeaways: [
    'Control charts: X̄ chart monitors mean; R chart monitors variability.',
    'C_p = (USL-LSL)/(6σ); C_pk accounts for off-center process.',
    'Out of control: point beyond limits, 7+ consecutive on one side, patterns.',
    'Pareto principle: 80% of defects from 20% of causes.',
    'Six Sigma: DMAIC methodology; 3.4 DPMO at 6σ level.',
  ],
},

};

export function hasFMECourseContent(topicId: string): boolean {
  return topicId in FME_COURSE;
}

export function getFMECourseContent(topicId: string): TopicLesson | null {
  return FME_COURSE[topicId] || null;
}
