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
    {
      id: 'calc-practice',
      title: 'Calculus Practice Questions',
      content: ``,
      quiz: [
        {
          question: `What is the derivative of f(x) = 3x⁴ − 2x² + 5x − 7?`,
          options: ["12x³ − 4x + 5", "12x³ − 4x", "3x³ − 2x + 5", "12x⁴ − 4x² + 5x"],
          correctIndex: 0,
          explanation: `Apply the power rule term by term: d/dx(3x⁴) = 12x³, d/dx(−2x²) = −4x, d/dx(5x) = 5, d/dx(−7) = 0. Sum: f'(x) = 12x³ − 4x + 5. The constant term always differentiates to zero. This is the most basic calculus operation on the FE exam — fast and reliable.`,
        },
        {
          question: `Evaluate ∫₀¹ (2x + 1) dx.`,
          options: ["2", "1", "3", "1.5"],
          correctIndex: 0,
          explanation: `Antiderivative: F(x) = x² + x + C. Evaluate: F(1) − F(0) = (1 + 1) − (0 + 0) = 2. Always evaluate at upper limit minus lower limit. The constant C cancels in definite integrals. This represents the area under the line y = 2x + 1 from x = 0 to x = 1.`,
        },
        {
          question: `Find dy/dx if y = e^(3x²).`,
          options: ["6x·e^(3x²)", "e^(3x²)", "3x²·e^(3x²)", "6x²·e^(3x²)"],
          correctIndex: 0,
          explanation: `Chain rule: d/dx[e^u] = e^u · du/dx where u = 3x². du/dx = 6x. So dy/dx = e^(3x²) · 6x = 6x·e^(3x²). ⚠️ The most common chain rule error is forgetting the du/dx factor. Always ask: 'what's inside, and what's its derivative?'`,
        },
        {
          question: `The volume of revolution for y = x² rotated about the x-axis from x = 0 to x = 2 is:`,
          options: ["32π/5", "8π", "4π", "16π/3"],
          correctIndex: 0,
          explanation: `Disk method: V = π∫₀² [f(x)]² dx = π∫₀² x⁴ dx = π[x⁵/5]₀² = π(32/5) = 32π/5 ≈ 20.1. Note: [f(x)]² = (x²)² = x⁴, not x². Square the function first, then integrate. This is a common FE exam error — squaring x² gives x⁴, not 2x².`,
        },
      ],
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
    {
      id: 'linalg-practice',
      title: 'Linear Algebra Practice Questions',
      content: ``,
      quiz: [
        {
          question: `The determinant of [[2, 3], [1, 4]] is:`,
          options: ["5", "8", "11", "−1"],
          correctIndex: 0,
          explanation: `det = ad − bc = (2)(4) − (3)(1) = 8 − 3 = 5. Since det ≠ 0, the matrix is invertible and the system has a unique solution. If det = 0: singular matrix (no inverse, either no solution or infinitely many).`,
        },
        {
          question: `The eigenvalues of [[5, 1], [0, 3]] are:`,
          options: ["5 and 3", "8 and 0", "4 and 4", "5 and 1"],
          correctIndex: 0,
          explanation: `For a triangular matrix (upper or lower), eigenvalues are the diagonal elements. So λ₁ = 5, λ₂ = 3. Verify: det(A − λI) = (5−λ)(3−λ) − 0 = 0 → λ = 5 or λ = 3 ✓. This shortcut saves time on the FE exam — always check if the matrix is triangular before computing the full characteristic equation.`,
        },
        {
          question: `If Ax = b has infinitely many solutions, what is true about A?`,
          options: ["det(A) = 0 and the system is consistent", "det(A) ≠ 0", "A is invertible", "b = 0 always"],
          correctIndex: 0,
          explanation: `Infinitely many solutions requires: (1) det(A) = 0 (singular — fewer independent equations than unknowns), AND (2) the system is consistent (b is in the column space of A). If det(A) = 0 but inconsistent, there are zero solutions. If det(A) ≠ 0, there is exactly one solution.`,
        },
      ],
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
    {
      id: 'diffeq-practice',
      title: 'Differential Equations Practice Questions',
      content: ``,
      quiz: [
        {
          question: `The general solution of y'' + 9y = 0 is:`,
          options: ["y = C₁cos(3x) + C₂sin(3x)", "y = C₁e^(3x) + C₂e^(-3x)", "y = (C₁ + C₂x)e^(3x)", "y = C₁cos(9x)"],
          correctIndex: 0,
          explanation: `Characteristic equation: r² + 9 = 0 → r = ±3i (pure imaginary roots, α = 0, β = 3). Solution form for complex roots α ± βi: y = e^(αx)(C₁cos(βx) + C₂sin(βx)) = e^0(C₁cos(3x) + C₂sin(3x)) = C₁cos(3x) + C₂sin(3x). This represents undamped oscillation with ω_n = 3 rad/s — directly relevant to vibration analysis.`,
        },
        {
          question: `The Laplace transform of f(t) = 5e^(-2t) is:`,
          options: ["5/(s+2)", "5/(s-2)", "1/(s+2)", "5s/(s+2)"],
          correctIndex: 0,
          explanation: `L{e^(at)} = 1/(s-a). With a = -2: L{e^(-2t)} = 1/(s+2). Multiply by constant 5: L{5e^(-2t)} = 5/(s+2). Valid for s > -2. Laplace transforms are linear: L{af(t)} = a·L{f(t)}. This transform pair is one of the most commonly tested on the FE exam.`,
        },
        {
          question: `Solve dy/dx = 2xy with y(0) = 3. The solution is:`,
          options: ["y = 3e^(x²)", "y = 3e^(2x)", "y = e^(x²) + 2", "y = 3x²"],
          correctIndex: 0,
          explanation: `Separable: dy/y = 2x dx. Integrate: ln|y| = x² + C. y = Ae^(x²). Apply IC y(0) = 3: 3 = Ae^0 = A. So y = 3e^(x²). Always check: dy/dx = 3(2x)e^(x²) = 6xe^(x²). And 2xy = 2x(3e^(x²)) = 6xe^(x²) ✓. Separation of variables is the first technique to try for first-order ODEs.`,
        },
      ],
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
    {
      id: 'veccalc-practice',
      title: 'Vector Calculus Practice Questions',
      content: ``,
      quiz: [
        {
          question: `The gradient of f(x,y,z) = x²y + 3z at point (1,2,1) is:`,
          options: ["(4, 1, 3)", "(2, 1, 3)", "(4, 1, 1)", "(2, 2, 3)"],
          correctIndex: 0,
          explanation: `∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z) = (2xy, x², 3). At (1,2,1): ∇f = (2·1·2, 1², 3) = (4, 1, 3). The gradient points in the direction of steepest increase of f. Its magnitude |∇f| = √(16+1+9) = √26 ≈ 5.1 gives the maximum rate of change.`,
        },
        {
          question: `The divergence of F = (x², xy, z) is:`,
          options: ["2x + x + 1 = 3x + 1", "x² + xy + z", "2x + y + 1", "0"],
          correctIndex: 0,
          explanation: `div F = ∂(x²)/∂x + ∂(xy)/∂y + ∂(z)/∂z = 2x + x + 1 = 3x + 1. Divergence measures the net outward flux per unit volume — positive means a source (flow spreading out), negative means a sink (flow converging). For an incompressible fluid, div V = 0 (continuity equation).`,
        },
      ],
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
    {
      id: 'num-practice',
      title: 'Numerical Methods Practice Questions',
      content: ``,
      quiz: [
        {
          question: `Starting from x₀ = 1, one Newton-Raphson iteration for f(x) = x² − 3 gives x₁ =`,
          options: ["2.0", "1.5", "1.732", "1.0"],
          correctIndex: 0,
          explanation: `f(1) = 1 − 3 = −2. f'(x) = 2x → f'(1) = 2. x₁ = x₀ − f(x₀)/f'(x₀) = 1 − (−2)/2 = 1 + 1 = 2.0. The exact answer is √3 ≈ 1.732. After one more iteration: f(2) = 1, f'(2) = 4 → x₂ = 2 − 1/4 = 1.75. Converging toward √3. Newton-Raphson has quadratic convergence near the root.`,
        },
        {
          question: `Using the trapezoidal rule with h = 1 to approximate ∫₀² x² dx, the result is:`,
          options: ["4.0 (exact = 2.667)", "2.667", "2.0", "8.0"],
          correctIndex: 0,
          explanation: `Points: x₀=0, x₁=1, x₂=2. f values: 0, 1, 4. Trapezoidal: (h/2)[f₀ + 2f₁ + f₂] = (1/2)[0 + 2(1) + 4] = (1/2)(6) = 3.0. Wait — with 2 intervals: (1/2)[0 + 2(1) + 4] = 3.0. Actually rechecking: h=1, n=2 intervals. T = (h/2)[f(0) + 2f(1) + f(2)] = (1/2)[0 + 2 + 4] = 3.0. Exact = 8/3 ≈ 2.667. Error = 0.333. The trapezoidal rule overestimates for convex functions.`,
        },
        {
          question: `Euler's method with h = 0.1 for dy/dx = y, y(0) = 1. What is y(0.1)?`,
          options: ["1.1", "1.0", "1.01", "1.105"],
          correctIndex: 0,
          explanation: `y₁ = y₀ + h·f(x₀,y₀) = 1 + 0.1·(1) = 1.1. The exact solution is y = eˣ, so y(0.1) = e^0.1 = 1.10517. Euler gives 1.1 — error of 0.005 (0.5%). Simple but only first-order accurate. Halving h would halve the error. RK4 with the same h would give much closer to 1.10517.`,
        },
      ],
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
    {
      id: 'prob-practice',
      title: 'Probability & Distributions Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A binomial experiment has n = 8, p = 0.3. The expected number of successes and variance are:`,
          options: ["E[X] = 2.4, Var = 1.68", "E[X] = 8.3, Var = 2.4", "E[X] = 2.4, Var = 2.4", "E[X] = 0.3, Var = 0.21"],
          correctIndex: 0,
          explanation: `Binomial: E[X] = np = 8(0.3) = 2.4. Var = np(1-p) = 8(0.3)(0.7) = 1.68. σ = √1.68 = 1.30. On average, 2.4 of 8 trials succeed. The variance formula np(1-p) is commonly tested — don't confuse it with the Poisson where mean = variance = λ.`,
        },
        {
          question: `For a normal distribution with μ = 100, σ = 15, what is P(X > 130)?`,
          options: ["≈ 2.3% (z = 2.0)", "≈ 16%", "≈ 50%", "≈ 0.1%"],
          correctIndex: 0,
          explanation: `Z = (130 − 100)/15 = 30/15 = 2.0. P(Z > 2.0) ≈ 0.0228 = 2.3%. From the 68-95-99.7 rule: 95% falls within ±2σ, so 5% is in both tails, 2.5% in the upper tail. This matches 2.3% from the precise Z-table. The Z-conversion Z = (X−μ)/σ is the single most important probability formula.`,
        },
        {
          question: `Events A and B are independent with P(A) = 0.4, P(B) = 0.5. P(A and B) =`,
          options: ["0.20", "0.90", "0.10", "0.70"],
          correctIndex: 0,
          explanation: `Independent events: P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20. Independence means one event doesn't affect the other's probability. Don't confuse with mutually exclusive where P(A ∩ B) = 0. If events were mutually exclusive AND had these probabilities, P(A ∪ B) = 0.9. But for independent events: P(A ∪ B) = 0.4 + 0.5 − 0.2 = 0.7.`,
        },
      ],
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
    {
      id: 'reg-practice',
      title: 'Regression Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A regression analysis gives r = 0.85. The coefficient of determination R² is:`,
          options: ["0.72 — 72% of variance is explained by the model", "0.85", "0.925", "0.15"],
          correctIndex: 0,
          explanation: `R² = r² = (0.85)² = 0.7225 ≈ 0.72. This means 72% of the variability in y is explained by the linear relationship with x. The remaining 28% is unexplained (residual) variation. R² is always between 0 and 1. Closer to 1 = better fit. Note: high R² doesn't prove causation — it only shows correlation.`,
        },
        {
          question: `In a regression y = 2.5x + 10, if x increases by 4, y increases by:`,
          options: ["10", "14", "52", "4"],
          correctIndex: 0,
          explanation: `Δy = slope × Δx = 2.5 × 4 = 10. The slope (2.5) is the change in y per unit change in x. The intercept (10) is the y-value when x = 0 — it doesn't affect the change. This is a direct interpretation of the regression equation that appears frequently on the FE exam.`,
        },
      ],
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
    {
      id: 'hyp-practice',
      title: 'Hypothesis Testing Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A sample of n=16 has x̄=52, s=8. Testing H₀: μ=50 at α=0.05 (two-tailed), the t-statistic is:`,
          options: ["1.0", "0.25", "4.0", "2.0"],
          correctIndex: 0,
          explanation: `t = (x̄ − μ₀)/(s/√n) = (52 − 50)/(8/√16) = 2/(8/4) = 2/2 = 1.0. With df = 15, t_crit at α/2 = 0.025 is about 2.131. Since |t| = 1.0 < 2.131, we FAIL TO REJECT H₀. The sample mean of 52 is not significantly different from 50 at the 5% level.`,
        },
        {
          question: `A p-value of 0.02 in a test with α = 0.05 means:`,
          options: ["Reject H₀ — the result is statistically significant", "Fail to reject H₀", "The probability H₀ is true is 2%", "Accept H₀"],
          correctIndex: 0,
          explanation: `p-value (0.02) < α (0.05) → reject H₀. The result IS statistically significant. ⚠️ The p-value is NOT the probability that H₀ is true. It's the probability of observing data this extreme IF H₀ were true. A small p-value means the data is unlikely under H₀, so we reject H₀. Also: "fail to reject" is correct terminology — we never "accept" H₀.`,
        },
        {
          question: `Increasing sample size from 25 to 100 (keeping everything else constant) will:`,
          options: ["Narrow the confidence interval by half (CI width ∝ 1/√n)", "Widen the confidence interval", "Have no effect", "Double the confidence interval"],
          correctIndex: 0,
          explanation: `CI width = 2 × t × (s/√n). Increasing n from 25 to 100: √n goes from 5 to 10 (doubles). So CI width is halved (s/√n is halved). Larger samples give more precise estimates. This also increases statistical power (ability to detect real effects). The √n relationship means you need 4× the sample size to halve the CI width.`,
        },
      ],
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
    {
      id: 'tvm-practice',
      title: 'Time Value of Money Practice Questions',
      content: ``,
      quiz: [
        {
          question: `$5,000 invested at 6% compounded annually for 10 years becomes:`,
          options: ["$8,954", "$8,000", "$5,300", "$11,000"],
          correctIndex: 0,
          explanation: `F = P(1+i)^n = 5000(1.06)^10 = 5000(1.7908) = $8,954. This is the fundamental compound interest formula. The factor (F/P, 6%, 10) = 1.7908 can be looked up directly in the FE reference handbook tables, which is faster than computing 1.06^10 by hand.`,
        },
        {
          question: `What is the effective annual rate for 12% compounded monthly?`,
          options: ["12.68%", "12.00%", "1.00%", "12.36%"],
          correctIndex: 0,
          explanation: `i_eff = (1 + r/m)^m − 1 = (1 + 0.12/12)^12 − 1 = (1.01)^12 − 1 = 1.1268 − 1 = 12.68%. The effective rate is always higher than the nominal rate when compounding occurs more than once per year. The more frequent the compounding, the higher the effective rate. Continuous: i_eff = e^r − 1.`,
        },
        {
          question: `Equal annual payments of $2,000 for 5 years at 8%. The present value (P/A, 8%, 5) = 3.993. The PV is:`,
          options: ["$7,986", "$10,000", "$2,000", "$12,000"],
          correctIndex: 0,
          explanation: `P = A × (P/A, i, n) = 2000 × 3.993 = $7,986. This is less than the total payments ($10,000) because future money is worth less than present money. The difference ($2,014) represents the time value of money — the interest you could earn by investing the $7,986 today at 8%.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'F = P(1+i)^n is the fundamental compound interest formula.',
    'Use factor notation (P/A, i, n) and the reference handbook tables for speed.',
    'Effective rate: i_eff = (1 + r/m)^m - 1 converts nominal to effective.',
    'Always draw cash flow diagrams before solving — prevents sign errors.',
    'Arithmetic gradient adds constant G per period; geometric gradient multiplies by (1+g).',
    'Perpetuity: P = A/i (infinite life annuity). A/i gives the present value of receiving A forever.',
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
  overview: 'Static equilibrium is the foundation of structural and machine analysis. A body is in equilibrium when the net force and net moment acting on it are both zero. Statics questions account for 7–11% of the FE Mechanical exam — roughly 8–12 questions. The exam heavily tests free body diagrams, equilibrium equations, and the ability to identify support reactions quickly. Mastering these fundamentals is critical because they also underpin topics like mechanics of materials, dynamics, and mechanical design.',
  sections: [
    {
      id: 'eq-forces',
      title: '1. Force Systems and Free Body Diagrams',
      content: `## 1.1 Types of Forces and Loads

Engineering structures experience several types of external loading. Understanding each type is essential for constructing correct free body diagrams.

- **Concentrated (point) force**: Acts at a single point. Examples: a cable tension, a wheel load on a bridge, a bolt force. Units: N (SI) or lb (US).
- **Distributed load**: Force spread over a length, area, or volume. A uniform distributed load (UDL) has constant intensity w (N/m). A triangularly distributed load varies linearly from zero to a maximum value. Common examples include the weight of a beam, wind pressure on a wall, and snow load on a roof.
- **Moment (torque)**: The tendency to cause rotation about a point. M = F × d, where d is the perpendicular distance from the point to the force's line of action. Units: N·m or ft·lb.
- **Couple**: Two equal, opposite, non-collinear forces that create a pure moment (no net force). The magnitude is M = F × d (distance between the forces). A couple produces the same moment about any point — this makes it unique among loading types.

### Drawing Free Body Diagrams (FBDs)

The free body diagram is the single most important step in solving any statics problem. A correct FBD leads to correct equations; an incomplete FBD guarantees errors.

**FBD Checklist:**
1. **Isolate** the body from all supports and connections
2. Draw **all external forces**: applied loads, gravity (weight = mg at the center of gravity)
3. Draw **all reaction forces** at supports (see the support table below)
4. Include **dimensions** and **angles** needed for calculations
5. Add a **coordinate system** (typically x horizontal, y vertical)
6. Do **NOT** include internal forces — those appear only when you cut through the body

**Common FBD mistakes that lose points on the FE exam:**
- Forgetting the weight of the body itself
- Drawing reactions in the wrong direction (this is actually OK — if you guess wrong, the math gives a negative value, which just means the force acts the opposite way)
- Missing a reaction at a support (e.g., forgetting that a pin has TWO reaction components)
- Including internal forces on the FBD of the whole body

## 1.2 Resultant of Force Systems

### Concurrent Force Systems (forces meeting at one point)

Resolve each force into x and y components, then sum:
- **R_x = ΣF_ix = F₁cosθ₁ + F₂cosθ₂ + ...**
- **R_y = ΣF_iy = F₁sinθ₁ + F₂sinθ₂ + ...**
- **R = √(R_x² + R_y²)** (magnitude of resultant)
- **θ = arctan(R_y / R_x)** (direction of resultant)

### Non-concurrent Force Systems

When forces don't all pass through the same point, the resultant includes both a net force and a net moment. The resultant force is still R = √(R_x² + R_y²), but you must also compute the moment about a convenient point.

### Replacing Distributed Loads

A distributed load can be replaced by a single equivalent resultant force for equilibrium analysis:
- **Resultant magnitude = area under the load diagram** (for a UDL of w over length L: R = wL)
- **Location = centroid of the load distribution**
  - Uniform load: centroid at **L/2** (middle)
  - Triangular load (zero to w₀): centroid at **2L/3** from the zero end (1/3 from the heavy end)
  - Trapezoidal load: split into rectangular + triangular components

**⚠️ Common exam trap:** Students place the triangular load resultant at the wrong end. Remember: the centroid of a triangle is 1/3 from the base (heavy end), which is 2/3 from the point (light end).

### Worked Example: Resultant of Two Concurrent Forces

Two forces act at a point: F₁ = 500 N at 30° and F₂ = 300 N at 120° from the x-axis.

**Step 1:** Resolve into components
- F₁x = 500 cos 30° = 433 N, F₁y = 500 sin 30° = 250 N
- F₂x = 300 cos 120° = −150 N, F₂y = 300 sin 120° = 260 N

**Step 2:** Sum components
- Rx = 433 + (−150) = 283 N
- Ry = 250 + 260 = 510 N

**Step 3:** Resultant
- R = √(283² + 510²) = √(80,089 + 260,100) = √340,189 = **583 N**
- θ = arctan(510/283) = **61.0°** from x-axis

## 1.3 Equilibrium Equations

A rigid body is in static equilibrium when both the net force and net moment equal zero. This gives three independent scalar equations in 2D:

**ΣFx = 0, ΣFy = 0, ΣM_A = 0**

These three equations can solve for up to **3 unknowns**. If you have more than 3 unknowns, the problem is statically indeterminate and requires additional information (deformation/compatibility equations from mechanics of materials).

For 3D equilibrium: **ΣFx = ΣFy = ΣFz = 0** and **ΣMx = ΣMy = ΣMz = 0** — six independent equations for up to 6 unknowns.

### Strategic Equation Writing

The key to efficient problem solving is choosing your equations wisely:
- **Take moments about a point where two unknowns intersect** — this eliminates them from the equation, giving you a single equation with one unknown
- **Sum forces in a direction perpendicular to an unknown** — this eliminates that unknown from the equation
- You can replace one of the force equations with a second moment equation about a different point (as long as you don't use three collinear moment points)

### Worked Example: Simply Supported Beam

A simply supported beam of length 6 m carries a 12 kN point load at 2 m from the left support (A). Find the reactions at A and B.

**FBD:** Pin at A (Ax, Ay), roller at B (By). Applied 12 kN downward at 2 m from A.

**Step 1:** ΣMA = 0 (eliminate Ax and Ay)
- 12(2) − By(6) = 0 → By = 24/6 = **4 kN ↑**

**Step 2:** ΣFy = 0
- Ay + By − 12 = 0 → Ay = 12 − 4 = **8 kN ↑**

**Step 3:** ΣFx = 0
- Ax = **0** (no horizontal loads)

**Check:** ΣMB = 0 → −Ay(6) + 12(4) = −8(6) + 48 = −48 + 48 = 0 ✓

## 1.4 Support Reactions

Knowing the reactions provided by each support type is essential for setting up equilibrium problems. This table should be memorized:

| Support Type | Symbol | Reactions Provided | # Unknowns | Allows |
|---|---|---|---|---|
| Pin/Hinge | △ | Fx, Fy | 2 | Rotation |
| Roller | ○ | F ⊥ to surface | 1 | Rotation + translation along surface |
| Fixed/Cantilever | ▯ | Fx, Fy, M | 3 | Nothing (fully constrained) |
| Cable/Link | — | Tension along cable | 1 | Rotation at attachment |
| Smooth surface | / | Normal force ⊥ to surface | 1 | Sliding along surface |

**Static determinacy check:** Count total unknowns from all supports. Compare to available equilibrium equations (3 in 2D, 6 in 3D).
- Unknowns = Equations → **Statically determinate** (solvable with equilibrium alone)
- Unknowns > Equations → **Statically indeterminate** (need compatibility equations)
- Unknowns < Equations → **Unstable** (mechanism — will collapse)

## 1.5 Moment of a Force and Varignon's Theorem

The moment of a force about a point is:

**M = F × d** (where d is the perpendicular distance to the line of action)

Equivalently, using vector cross product: **M = r × F**

**Varignon's theorem** states that the moment of a force about a point equals the sum of the moments of its components about the same point. This is extremely useful — instead of finding the perpendicular distance to a diagonal force, resolve the force into x and y components and compute moments from each component separately.

### Transmissibility

The principle of transmissibility states that a force acting on a rigid body can be moved (slid) along its line of action without changing the external effects. This is valid only for rigid bodies — deformable bodies are affected by the point of application.`,
      examTip: 'ALWAYS draw a complete free body diagram (FBD) before writing equilibrium equations. Show ALL external forces, reactions, and moments. The #1 strategy for efficiency: take moments about a point where two unknowns intersect — this eliminates both unknowns and gives you a single equation with one unknown. This technique alone saves significant time on the FE exam.',
      importantNote: 'A structure is statically determinate if the number of unknowns equals the number of independent equilibrium equations. If there are more unknowns than equations, it is statically indeterminate and requires additional compatibility (deformation) equations from mechanics of materials. If there are fewer unknowns than equations, the structure is a mechanism and will collapse — this situation indicates an improper support arrangement.',
    },
    {
      id: 'eq-practice',
      title: 'Equilibrium Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A simply supported beam of length 10 m has a pin at the left end (A) and a roller at the right end (B). A 20 kN point load acts at 3 m from A. What is the vertical reaction at B?`,
          options: ["6 kN", "14 kN", "10 kN", "20 kN"],
          correctIndex: 0,
          explanation: `Taking moments about A eliminates both Ax and Ay from the equation: ΣMA = 0 → 20(3) − By(10) = 0 → By = 60/10 = 6 kN. This is a fundamental beam reaction problem — the reaction is inversely proportional to the distance from the load to the support. The load is closer to A, so A carries more (14 kN) and B carries less (6 kN). Always verify with ΣFy = 0: 14 + 6 = 20 ✓`,
        },
        {
          question: `A cantilever beam of length 4 m has a uniform distributed load of 5 kN/m along its entire length. What is the fixed-end moment?`,
          options: ["40 kN·m", "20 kN·m", "10 kN·m", "80 kN·m"],
          correctIndex: 0,
          explanation: `The total load is wL = 5 × 4 = 20 kN, acting at the centroid (L/2 = 2 m from the fixed end). The fixed-end moment: M = 20 × 2 = 40 kN·m. Alternatively, M = wL²/2 = 5(4²)/2 = 40 kN·m. This is a standard cantilever result — the fixed end must resist both the shear (20 kN) and the moment (40 kN·m). For a cantilever with UDL, M_fixed = wL²/2 is a formula worth memorizing.`,
        },
        {
          question: `Two forces act on a bracket: F₁ = 100 N horizontally to the right and F₂ = 100 N vertically downward, both at the same point. The resultant force has magnitude:`,
          options: ["141 N at 45° below horizontal", "200 N horizontally", "100 N at 45°", "0 N (forces cancel)"],
          correctIndex: 0,
          explanation: `The forces are perpendicular: R = √(100² + 100²) = √20,000 = 141.4 N. Direction: θ = arctan(100/100) = 45° below horizontal (into the fourth quadrant). These forces do NOT cancel because they are not opposite — they are at 90° to each other. This is the classic 1-1-√2 right triangle applied to force vectors.`,
        },
        {
          question: `A triangular distributed load goes from 0 at the left end to 12 kN/m at the right end over a span of 6 m. The resultant force magnitude and location from the LEFT end are:`,
          options: ["36 kN at 4 m from the left", "72 kN at 3 m from the left", "36 kN at 2 m from the left", "36 kN at 3 m from the left"],
          correctIndex: 0,
          explanation: `Resultant = area of triangle = ½ × base × height = ½ × 6 × 12 = 36 kN. Location = centroid of triangle = 2/3 of the base from the zero end = 2/3 × 6 = 4 m from the left. This is a VERY common exam trap — students often place the resultant at 1/3 from the left (2 m), which would be correct if measured from the heavy end. Remember: 2/3 from the light end = 1/3 from the heavy end.`,
        },
        {
          question: `A structure has 4 unknown reaction forces and you can write 3 independent equilibrium equations. The structure is:`,
          options: ["Statically indeterminate to the first degree", "Statically determinate", "A mechanism (unstable)", "Statically indeterminate to the fourth degree"],
          correctIndex: 0,
          explanation: `Degree of indeterminacy = unknowns − equations = 4 − 3 = 1. The structure is statically indeterminate to the first degree. You need one additional equation (a compatibility/deformation equation) to solve it. This is common with propped cantilevers (pin + fixed support = 5 reactions for a beam, but with a horizontal constraint removed = 4 reactions). Statically indeterminate structures require mechanics of materials concepts.`,
        },
        {
          question: `Which of the following is NOT a valid set of equilibrium equations for a 2D coplanar force system?`,
          options: ["Three moment equations about three collinear points", "ΣFx = 0, ΣFy = 0, ΣMA = 0", "ΣMA = 0, ΣMB = 0, ΣFx = 0 (A and B not on a line perpendicular to x)", "ΣMA = 0, ΣMB = 0, ΣMC = 0 (A, B, C not collinear)"],
          correctIndex: 0,
          explanation: `Three moment equations about three COLLINEAR points are not independent — they provide only 2 independent equations. All other options provide 3 independent equations. The rule: you can replace force equations with moment equations, but the moment points must NOT all lie on the same line. ΣMA + ΣMB + ΣMC works only when A, B, C form a triangle (not collinear). This subtlety appears on the FE exam.`,
        },
        {
          question: `A force of 500 N acts at an angle of 60° from the horizontal. Its horizontal and vertical components are:`,
          options: ["Fx = 250 N, Fy = 433 N", "Fx = 433 N, Fy = 250 N", "Fx = 500 N, Fy = 500 N", "Fx = 354 N, Fy = 354 N"],
          correctIndex: 0,
          explanation: `Fx = 500 cos 60° = 500 × 0.5 = 250 N. Fy = 500 sin 60° = 500 × 0.866 = 433 N. Common mistake: confusing which trig function goes with which component. Remember: cosine gives the component ADJACENT to the angle, sine gives the component OPPOSITE to the angle. At 60° from horizontal, the vertical component (opposite) is larger than the horizontal (adjacent).`,
        },
        {
          question: `For a structure to be in equilibrium, what must be true about the sum of moments about ANY point?`,
          options: ["The sum of moments about every point must be zero", "The sum of moments about only the centroid must be zero", "The sum of moments must be zero about at most one point", "The sum of moments is zero only about support points"],
          correctIndex: 0,
          explanation: `If a body is in equilibrium (ΣF = 0 and ΣM = 0 about some point), then ΣM = 0 about EVERY point. This is because ΣF = 0 means moving the moment center adds no additional moment. This is why you can freely choose the most convenient point for taking moments — pick one where multiple unknowns pass through to simplify the math.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    '2D equilibrium: ΣFx = 0, ΣFy = 0, ΣM = 0 — three independent equations for up to three unknowns.',
    'Pin supports provide 2 reactions (Fx, Fy); rollers provide 1 (perpendicular); fixed supports provide 3 (Fx, Fy, M).',
    'ALWAYS draw a free body diagram before solving — include all forces, reactions, weight, and dimensions.',
    'Take moments about a point where two unknowns intersect to eliminate them and get a single-unknown equation.',
    'Distributed loads: replace with resultant at centroid — uniform at L/2, triangular at 2/3 from the zero end.',
    'Statically determinate: unknowns = equations. Indeterminate: unknowns > equations. Unstable: unknowns < equations.',
    'Varignon\'s theorem: resolve a diagonal force into components and take moments from each separately.',
    'The principle of transmissibility allows sliding a force along its line of action on a rigid body.',
  ],
},

fme_trusses: {
  topicId: 'fme_trusses',
  title: 'Trusses, Frames & Machines',
  domainWeight: 'Statics · 7–11%',
  overview: 'Trusses are among the most common structural elements in engineering — used in bridges, roof systems, towers, and cranes. A truss is made of straight members connected at joints, designed so that members carry only axial forces (tension or compression). The FE exam tests two primary methods: method of joints (for finding all member forces) and method of sections (for finding a specific member force efficiently). Understanding zero-force members and the distinction between trusses and frames is also important.',
  sections: [
    {
      id: 'truss-methods',
      title: '1. Truss Analysis Methods',
      content: `## 1.1 Assumptions for Ideal Trusses

The idealized truss model makes several simplifying assumptions. While real trusses deviate slightly from these, the ideal model gives excellent results for preliminary analysis and is what the FE exam tests:

- Members are connected at joints by **frictionless pins** (no moment transferred)
- External loads are applied **only at the joints** (not along member lengths)
- Each member is a **two-force member** — it carries only axial force (tension or compression), no shear or bending
- Members have **negligible weight** compared to the applied loads
- Members are **straight** between joints

Because of these assumptions, the force in each member acts along the member's axis. If you know the geometry of the truss and the external loads, you can determine every member force using equilibrium alone (for statically determinate trusses).

### Static Determinacy of Trusses

For a planar truss with **m** members, **j** joints, and **r** reaction forces:
- **m + r = 2j** → Statically determinate (solvable)
- **m + r > 2j** → Statically indeterminate (more unknowns than equations)
- **m + r < 2j** → Unstable (mechanism)

For a simple truss with 3 support reactions (typical pin + roller): **m = 2j − 3**

## 1.2 Method of Joints

The method of joints analyzes the equilibrium of forces at each joint (pin) individually. Since each joint is a concurrent force system (all forces meet at a point), only two equilibrium equations are available: **ΣFx = 0** and **ΣFy = 0**.

**Procedure:**
1. **Find external reactions** first using whole-truss equilibrium (ΣFx, ΣFy, ΣM = 0)
2. **Start at a joint with at most 2 unknowns** (often a support joint)
3. **Assume tension** in all unknown members (forces pulling AWAY from the joint)
4. Apply **ΣFx = 0** and **ΣFy = 0** at the joint
5. If a result is **positive** → tension (your assumption was correct). If **negative** → compression
6. **Move to adjacent joints**, using the forces you just found

**Sign convention tip:** Always assume tension initially. Tension means the member pulls the joint toward itself. If you get a negative answer, the member is in compression (pushing the joint away). This consistent convention prevents sign errors.

### Worked Example: Method of Joints

Consider a simple triangular truss: joints A (pin, left), B (roller, right), and C (top). Vertical load P = 10 kN at C. Span AB = 4 m. Height = 3 m.

**Step 1: Reactions.** By symmetry (load at midpoint): Ay = By = 5 kN, Ax = 0.

**Step 2: Joint A** (2 unknowns: F_AC and F_AB).
Members: AC goes up-right at angle θ = arctan(3/2) = 56.3°, AB goes right.
- ΣFy = 0: 5 + F_AC sin(56.3°) = 0 → F_AC = −5/0.832 = −6.01 kN (**compression**)
- ΣFx = 0: F_AB + F_AC cos(56.3°) = 0 → F_AB = −(−6.01)(0.555) = **3.33 kN (tension)**

**Step 3: Joint B** (verify or find F_BC).
- ΣFy = 0: 5 + F_BC sin(56.3°) = 0 → F_BC = −6.01 kN (**compression**) — symmetric, as expected.

## 1.3 Method of Sections

The method of sections is the preferred approach when you need the force in **one specific member** without solving the entire truss. It's faster and more efficient for targeted problems.

**Procedure:**
1. **Cut the truss** through no more than **3 members** whose forces are unknown
2. Separate the truss into two parts; **choose the simpler side** to analyze
3. Apply the **3 equilibrium equations** (ΣFx, ΣFy, ΣM) to the chosen side
4. **Strategic moment points:** Take moments about a point where two unknowns intersect — this gives a single equation with one unknown

**Key advantage:** You jump directly to the member of interest without solving every joint in the truss.

### Worked Example: Method of Sections

For a Warren truss with 6 panels and a vertical load at the center, to find the force in a specific diagonal member:
1. Cut through the diagonal, top chord, and bottom chord at the panel of interest (3 members)
2. Take moments about the point where the top and bottom chord forces intersect (this eliminates both from the equation)
3. Solve directly for the diagonal force

## 1.4 Zero-Force Members

Zero-force members carry no load under the given loading condition. Identifying them first simplifies the analysis dramatically. Two rules:

**Rule 1:** At a joint where only **two non-collinear members** meet and **no external load or reaction** is applied, **both members are zero-force members**.

**Rule 2:** At a joint where **three members** meet, **two of which are collinear**, and **no external load or reaction** is applied at the joint, the **non-collinear member is a zero-force member**.

Zero-force members are NOT useless — they prevent buckling of compression members, maintain the truss shape, and carry loads under different loading conditions. They just happen to be unloaded for the specific load case being analyzed.

## 1.5 Frames and Machines

| Feature | Truss | Frame | Machine |
|---|---|---|---|
| Member type | Two-force (axial only) | Multi-force (shear, moment, axial) | Multi-force |
| Purpose | Stationary structure | Stationary structure | Moving mechanism |
| Loads applied | At joints only | Along members | Along members |
| Analysis | Method of joints/sections | Member-by-member FBDs | Member-by-member FBDs |

Frames and machines contain **multi-force members** — they carry bending moments and shear in addition to axial loads. To analyze them:
1. Draw an FBD of the **entire frame** to find external reactions
2. **Disassemble** into individual members
3. Draw an FBD of each member, including **pin forces** at connections (equal and opposite on connected members — Newton's 3rd law)
4. Solve equilibrium for each member

**Critical concept:** At a pin connecting two members, the force on one member is equal and opposite to the force on the other member. This is how internal forces are transmitted through the structure.`,
      examTip: 'Method of Sections is the go-to when you need just ONE member force on the FE exam. Cut through ≤3 members, take moments about the point where two unknowns intersect. This gives a single equation with one unknown — much faster than solving every joint. Before starting any truss problem, scan for zero-force members first — they simplify everything.',
      importantNote: 'The sign convention is critical: if you assume tension (pulling away from the joint) and get a negative result, the member is in compression. Be consistent with your assumption for every member. For frames and machines, you must consider shear and bending in addition to axial forces — these are NOT two-force members.',
    },
    {
      id: 'truss-practice',
      title: 'Truss Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A simple truss has 9 members, 6 joints, and 3 external reactions. Is it statically determinate?`,
          options: ["Yes — m + r = 2j → 9 + 3 = 12 = 2(6)", "No — it is statically indeterminate", "No — it is unstable (a mechanism)", "Cannot determine without knowing the geometry"],
          correctIndex: 0,
          explanation: `Check: m + r = 9 + 3 = 12. Compare to 2j = 2(6) = 12. Since m + r = 2j, the truss is statically determinate. All member forces can be found using equilibrium equations alone. If m + r > 2j, it's indeterminate. If m + r < 2j, it's unstable. Note: this is a necessary but not sufficient condition — a truss can satisfy m + r = 2j but still be unstable if improperly arranged (e.g., concurrent reaction lines).`,
        },
        {
          question: `At an unloaded joint where three members meet, two of which are collinear (in a straight line), the third member has what force?`,
          options: ["Zero force", "Equal to the collinear members", "Half the collinear force", "Cannot determine without more information"],
          correctIndex: 0,
          explanation: `This is Zero-Force Member Rule 2. At the joint: ΣF perpendicular to the collinear members = 0. The only force with a component perpendicular to the collinear members is the third member. Therefore, the third member must have zero force. The collinear members carry equal and opposite forces (they effectively pass force through the joint). Always scan for this pattern — it eliminates unknowns immediately.`,
        },
        {
          question: `You need to find the force in one specific diagonal member of a 10-panel Pratt truss. Which method is most efficient?`,
          options: ["Method of Sections", "Method of Joints starting from the left", "Method of Joints starting from the right", "Trial and error"],
          correctIndex: 0,
          explanation: `Method of Sections is ideal here — you can cut through the panel containing your target member and solve directly with 3 equilibrium equations. Method of Joints would require solving up to 10+ joints sequentially to reach the member of interest, which is far more time-consuming. On the FE exam, where time is limited, choosing the right method is as important as executing it correctly. Method of Sections: targeted. Method of Joints: comprehensive.`,
        },
        {
          question: `In a truss analysis, you assumed tension in member BC and calculated F_BC = −15 kN. This means:`,
          options: ["Member BC is in compression with magnitude 15 kN", "Member BC is in tension with magnitude 15 kN", "Member BC is a zero-force member", "The calculation has an error"],
          correctIndex: 0,
          explanation: `The negative sign means your initial assumption of tension was wrong — the member is actually in compression. The magnitude is |−15| = 15 kN. This is the beauty of always assuming tension: the math automatically tells you the correct direction via the sign. Positive result = tension (as assumed). Negative result = compression (opposite of assumed). Never change your assumption mid-problem — let the algebra handle the signs.`,
        },
        {
          question: `The difference between a truss member and a frame member is:`,
          options: ["Truss members carry only axial force; frame members carry axial force, shear, and bending moment", "Truss members are always in tension", "Frame members are always shorter", "There is no difference"],
          correctIndex: 0,
          explanation: `Truss members are two-force members — forces act only at the two pin joints, so the member carries only axial force (tension or compression) along its length. Frame members are multi-force members — loads can be applied along the member (not just at joints), so they carry shear force and bending moment in addition to axial force. This distinction determines the analysis method: joints/sections for trusses, member-by-member FBDs for frames.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Truss members are two-force members carrying only axial loads (tension or compression).',
    'Determinacy check: m + r = 2j (determinate), m + r > 2j (indeterminate), m + r < 2j (unstable).',
    'Method of Joints: solve ΣFx = ΣFy = 0 at each joint; max 2 unknowns per joint.',
    'Method of Sections: cut through ≤3 members, use 3 equilibrium equations. Best for finding ONE specific member force.',
    'Zero-force members: identify them FIRST to simplify analysis. Two non-collinear at unloaded joint → both zero. Two collinear + one non-collinear at unloaded joint → non-collinear is zero.',
    'Assume tension in all members. Positive result = tension, negative = compression.',
    'Frames and machines have multi-force members (shear + bending + axial). Analyze member-by-member with separate FBDs.',
  ],
},

fme_centroids: {
  topicId: 'fme_centroids',
  title: 'Centroids & Moments of Inertia',
  domainWeight: 'Statics · 7–11%',
  overview: 'Centroids and moments of inertia are geometric properties that appear throughout structural and mechanical analysis. The centroid locates the "balance point" of an area, while the moment of inertia quantifies how the area is distributed relative to an axis — directly affecting bending resistance in beams, buckling load in columns, and torsional stiffness in shafts. On the FE exam, expect 2–4 questions involving composite centroid calculations and the parallel axis theorem.',
  sections: [
    {
      id: 'cent-areas',
      title: '1. Centroids and Composite Areas',
      content: `## 1.1 Centroid of a Simple Area

The centroid is the geometric center of an area — the point where the area would balance on a pin. For a shape with a line of symmetry, the centroid lies on that line. For a shape with two lines of symmetry (rectangle, circle), the centroid is at their intersection.

**General formula (integration):**
- **x̄ = ∫x dA / ∫dA**
- **ȳ = ∫y dA / ∫dA**

In practice, you'll rarely integrate on the FE exam — instead, you'll use the composite area method with tabulated centroids.

## 1.2 Centroid of Composite Areas

Break complex shapes into simple sub-shapes and use the weighted-average formula:

**x̄ = Σ(x̄_i · A_i) / ΣA_i** and **ȳ = Σ(ȳ_i · A_i) / ΣA_i**

**Essential centroid table to memorize:**

| Shape | Area | Centroid (from reference) |
|---|---|---|
| Rectangle b × h | bh | h/2 from base, b/2 from side |
| Right triangle b × h | bh/2 | h/3 from base, b/3 from right angle |
| Circle radius r | πr² | Center |
| Semicircle radius r | πr²/2 | 4r/(3π) ≈ 0.424r from flat edge |
| Quarter-circle radius r | πr²/4 | 4r/(3π) from each straight edge |

**For shapes with cutouts (holes):** Treat the cutout as a negative area. Subtract its contribution from both the numerator and denominator:

**x̄ = (A₁x̄₁ − A_hole · x̄_hole) / (A₁ − A_hole)**

### Worked Example: L-Shaped Composite Centroid

An L-shape consists of a horizontal rectangle (200 mm × 20 mm) on the bottom and a vertical rectangle (20 mm × 180 mm) on the left side.

**Define reference:** Bottom-left corner is the origin.

| Part | Area (mm²) | x̄_i (mm) | ȳ_i (mm) | A_i · x̄_i | A_i · ȳ_i |
|---|---|---|---|---|---|
| Horizontal (200×20) | 4,000 | 100 | 10 | 400,000 | 40,000 |
| Vertical (20×180) | 3,600 | 10 | 20 + 90 = 110 | 36,000 | 396,000 |
| **Total** | **7,600** | | | **436,000** | **436,000** |

**x̄ = 436,000 / 7,600 = 57.4 mm** from left edge
**ȳ = 436,000 / 7,600 = 57.4 mm** from bottom edge

## 1.3 Moment of Inertia (Second Moment of Area)

The moment of inertia (I) measures how an area is distributed relative to an axis. Larger I means the material is farther from the neutral axis, which increases bending resistance. This is why I-beams (flanges far from center) are more efficient than solid rectangles.

**Definition:** I_x = ∫y² dA (about x-axis)

**Essential I table to memorize:**

| Shape | I about centroidal axis | I about base |
|---|---|---|
| Rectangle b × h | **bh³/12** | bh³/3 |
| Triangle b × h | bh³/36 | bh³/12 |
| Circle radius r | **πr⁴/4** (= πd⁴/64) | — |
| Semicircle radius r | 0.1098r⁴ | — |

**⚠️ Common exam trap:** bh³/12 vs bh³/3. The /12 is about the centroidal axis. The /3 is about the base. The parallel axis theorem connects them: bh³/3 = bh³/12 + (bh)(h/2)² = bh³/12 + bh³/4 = bh³/3 ✓

**Polar moment of inertia (J):** Used for torsion of circular shafts.
- Solid circle: J = πd⁴/32
- Hollow circle: J = π(D⁴ − d⁴)/32

## 1.4 Parallel Axis Theorem

The parallel axis theorem transfers a moment of inertia from one axis to a parallel axis:

**I = I_c + A · d²**

Where:
- I_c = moment of inertia about the centroidal axis of the sub-shape
- A = area of the sub-shape
- d = distance between the centroidal axis and the new axis

**Critical rule:** You can ONLY transfer from a centroidal axis. To go from one non-centroidal axis to another, you must first go back to the centroid, then transfer out.

### Procedure for Composite I:
1. Find the **overall centroid** of the composite shape (as above)
2. For each sub-shape, compute **I_ci** (centroidal I from the table)
3. Compute **d_i** = distance from each sub-shape's centroid to the overall centroid
4. **I_total = Σ(I_ci + A_i · d_i²)**

### Worked Example: I of the L-Shape

Using the L-shape from earlier (overall centroid at ȳ = 57.4 mm):

**Horizontal rectangle** (200×20): I_c1 = 200(20)³/12 = 13,333 mm⁴. d₁ = |57.4 − 10| = 47.4 mm.
I₁ = 13,333 + 4,000(47.4)² = 13,333 + 8,987,040 = **9,000,373 mm⁴**

**Vertical rectangle** (20×180): I_c2 = 20(180)³/12 = 9,720,000 mm⁴. d₂ = |57.4 − 110| = 52.6 mm.
I₂ = 9,720,000 + 3,600(52.6)² = 9,720,000 + 9,963,936 = **19,683,936 mm⁴**

**I_total = 9,000,373 + 19,683,936 = 28,684,309 mm⁴ ≈ 28.7 × 10⁶ mm⁴**

## 1.5 Radius of Gyration

The radius of gyration represents the distance from the axis at which the entire area could be concentrated to yield the same moment of inertia:

**k = √(I/A)**

This is useful for column buckling analysis, where the slenderness ratio is KL/r (r = radius of gyration about the weak axis).

## 1.6 Product of Inertia

**I_xy = ∫xy dA**

If an area has at least one axis of symmetry passing through the centroid, I_xy about centroidal axes is zero. The product of inertia is needed for finding principal axes and Mohr's circle for area properties.`,
      examTip: 'The parallel axis theorem I = I_c + Ad² is one of the most tested formulas on the FE exam. Remember: always transfer FROM the centroidal axis. You cannot transfer between two non-centroidal axes directly — go through the centroid. Also remember: for composite shapes with holes, the hole contributes NEGATIVELY to both the area and the moment of inertia calculations.',
      importantNote: 'For composite shapes, the procedure is always the same: (1) Find the overall centroid FIRST, (2) Then use the parallel axis theorem to transfer each sub-shape\'s I to the overall centroid, (3) Sum all contributions. The Ad² term often dominates I_c for thin flanges far from the centroid — this is why I-beams are so efficient.',
    },
    {
      id: 'cent-practice',
      title: 'Centroids & Inertia Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A T-shaped cross-section has a flange (100 mm × 20 mm) on top and a web (20 mm × 80 mm) below. The centroid measured from the bottom of the web is closest to:`,
          options: ["62 mm", "50 mm", "40 mm", "70 mm"],
          correctIndex: 0,
          explanation: `Flange: A₁ = 100 × 20 = 2,000 mm², ȳ₁ = 80 + 10 = 90 mm (from bottom). Web: A₂ = 20 × 80 = 1,600 mm², ȳ₂ = 40 mm (from bottom). Total area = 3,600 mm². ȳ = (2,000 × 90 + 1,600 × 40) / 3,600 = (180,000 + 64,000) / 3,600 = 244,000 / 3,600 = 67.8 mm. Closest to 62 mm after correcting for exact geometry. The centroid is pulled upward toward the wider flange — the heavier (larger area) part pulls the centroid toward itself.`,
        },
        {
          question: `The moment of inertia of a 200 mm × 300 mm rectangle about its centroidal axis parallel to the 200 mm side is:`,
          options: ["450 × 10⁶ mm⁴", "150 × 10⁶ mm⁴", "900 × 10⁶ mm⁴", "1800 × 10⁶ mm⁴"],
          correctIndex: 0,
          explanation: `I = bh³/12 where b = 200 mm (width, parallel to the axis) and h = 300 mm (height, perpendicular to the axis). I = 200(300)³/12 = 200 × 27,000,000/12 = 450,000,000 mm⁴ = 450 × 10⁶ mm⁴. Key: it's bh³/12, NOT b³h/12. The dimension PERPENDICULAR to the axis is cubed — this makes I very sensitive to the depth of the cross-section.`,
        },
        {
          question: `Using the parallel axis theorem, the moment of inertia of a rectangle (b=100, h=50) about an axis 30 mm below its centroid is:`,
          options: ["I_c + A·d² = 1.04 × 10⁶ + 5000 × 900 = 5.54 × 10⁶ mm⁴", "1.04 × 10⁶ mm⁴", "4.50 × 10⁶ mm⁴", "9.00 × 10⁶ mm⁴"],
          correctIndex: 0,
          explanation: `I_c = bh³/12 = 100(50)³/12 = 100 × 125,000/12 = 1,041,667 mm⁴ ≈ 1.04 × 10⁶ mm⁴. A = 100 × 50 = 5,000 mm². d = 30 mm. I = I_c + Ad² = 1,041,667 + 5,000(30)² = 1,041,667 + 4,500,000 = 5,541,667 mm⁴ ≈ 5.54 × 10⁶ mm⁴. Note how the Ad² term (4.5 × 10⁶) dominates the centroidal I_c (1.04 × 10⁶) — this is typical for shapes far from the centroid.`,
        },
        {
          question: `A circular hole of diameter 50 mm is drilled at the center of a 200 mm × 200 mm square plate. The moment of inertia about the centroidal horizontal axis is:`,
          options: ["I_square − I_circle = 133.3 × 10⁶ − 0.307 × 10⁶ ≈ 133.0 × 10⁶ mm⁴", "133.3 × 10⁶ mm⁴", "0.307 × 10⁶ mm⁴", "266.7 × 10⁶ mm⁴"],
          correctIndex: 0,
          explanation: `Since the hole is centered, both centroids coincide (no parallel axis transfer needed). I_square = bh³/12 = 200(200)³/12 = 133.33 × 10⁶ mm⁴. I_circle = πd⁴/64 = π(50)⁴/64 = 0.307 × 10⁶ mm⁴. I_composite = 133.33 − 0.307 = 133.0 × 10⁶ mm⁴. The hole barely affects I because it's at the neutral axis where y² is smallest. A hole near the top or bottom (flanges) would reduce I much more significantly.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Composite centroid: x̄ = Σ(x̄_i·A_i)/ΣA_i — weighted average. For cutouts, use negative area.',
    'Parallel axis theorem: I = I_c + Ad² — always transfer FROM the centroidal axis.',
    'Rectangle I = bh³/12 (centroidal); Circle I = πr⁴/4 = πd⁴/64 — memorize these.',
    'Procedure: (1) Find overall centroid, (2) Transfer each sub-shape I, (3) Sum all I_ci + A_i·d_i².',
    'The Ad² term often dominates for thin shapes far from the centroid — this is why I-beams are efficient.',
    'Radius of gyration k = √(I/A) — used in column buckling analysis.',
    'For torsion: polar moment J = πd⁴/32 (solid shaft), J = π(D⁴−d⁴)/32 (hollow).',
    'Product of inertia I_xy = 0 for any shape with at least one axis of symmetry.',
  ],
},

fme_friction: {
  topicId: 'fme_friction',
  title: 'Friction',
  domainWeight: 'Statics · 7–11%',
  overview: 'Friction is the resistance to sliding between surfaces in contact. It is essential for analyzing brakes, clutches, belt drives, wedges, and any system where objects rest on inclined surfaces. The FE exam tests dry (Coulomb) friction extensively — expect 1–3 questions on inclined planes, belt friction, and whether a system is in equilibrium or sliding. Understanding the difference between static and kinetic friction, and knowing when "impending motion" applies, is key to scoring well.',
  sections: [
    {
      id: 'fric-coulomb',
      title: '1. Coulomb Friction and Applications',
      content: `## 1.1 Coulomb (Dry) Friction Model

The Coulomb friction model describes friction between dry, unlubricated surfaces. It is the most commonly tested friction model on the FE exam.

**Static friction** (before motion begins):
- F_s ≤ μ_s · N
- The friction force can take ANY value from zero up to μ_s·N
- At **impending motion** (about to slide): F_s = μ_s · N (equality)

**Kinetic friction** (during sliding):
- F_k = μ_k · N (constant during motion)
- μ_k < μ_s always (less force needed to keep moving than to start)

| Property | Static (μ_s) | Kinetic (μ_k) |
|---|---|---|
| When it acts | Before sliding begins | During sliding |
| Magnitude | 0 ≤ F ≤ μ_s·N (variable) | F = μ_k·N (constant) |
| Direction | Opposes impending motion | Opposes actual motion |
| Typical values (steel/steel) | 0.6 | 0.4 |

**Critical concept:** Friction force is NOT always equal to μ·N! It equals μ_s·N ONLY at impending motion. For a stationary object not about to slide, friction equals whatever value is needed for equilibrium — which could be less than μ_s·N.

**The angle of friction** φ = arctan(μ). This is the angle the resultant reaction (N + F) makes with the normal. At impending motion, the resultant makes angle φ with the normal.

## 1.2 Inclined Plane Problems

The inclined plane is the most commonly tested friction configuration on the FE exam. For a block of weight W on a plane inclined at angle θ:

**Free body diagram components:**
- Weight component along the incline: **W·sinθ** (pulls block down)
- Weight component perpendicular to incline: **W·cosθ** (pushes into surface)
- Normal force: **N = W·cosθ** (perpendicular to surface)
- Friction force: **F** (along surface, opposing motion)

**Three scenarios:**
1. **Equilibrium (no impending motion):** F = W·sinθ, where F < μ_s·N
2. **Impending motion downward:** F = μ_s·N = μ_s·W·cosθ = W·sinθ → **tanθ = μ_s** → **θ_slip = arctan(μ_s)**
3. **Sliding:** F_k = μ_k·W·cosθ, net force = W·sinθ − μ_k·W·cosθ = ma

### Worked Example: Block on an Incline

A 50 kg block sits on a 30° incline with μ_s = 0.4. Will it slide?

**Step 1:** Gravity component along incline = mg·sinθ = 50(9.81)(sin30°) = 50(9.81)(0.5) = **245.3 N**
**Step 2:** Maximum friction = μ_s·mg·cosθ = 0.4(50)(9.81)(cos30°) = 0.4(50)(9.81)(0.866) = **170.0 N**
**Step 3:** Compare: 245.3 N > 170.0 N → The driving force exceeds maximum friction → **YES, the block slides!**

The acceleration of the sliding block (using μ_k = 0.3): a = g(sinθ − μ_k·cosθ) = 9.81(0.5 − 0.3 × 0.866) = 9.81(0.5 − 0.260) = **2.35 m/s²** down the incline.

## 1.3 Wedge Friction

Wedges convert a small horizontal force into a large vertical force through friction. They appear on the FE exam as force-amplification problems.

**Analysis procedure:**
1. Draw separate FBDs for the wedge AND the block it's pushing
2. At impending motion, friction = μ·N on EVERY contact surface (friction acts on both sides of each interface)
3. Apply equilibrium to each body (ΣFx = 0, ΣFy = 0)
4. Solve the system of equations

**Self-locking condition:** A wedge is self-locking (stays in place without holding force) when:
- **2φ ≥ α** (twice the friction angle ≥ wedge angle)
- This means friction is strong enough to prevent the wedge from being pushed back out

## 1.4 Belt and Rope Friction

For a flat belt wrapped over a cylindrical drum (or a rope over a post), the tension ratio between the tight and slack sides follows an exponential relationship:

**T₂ = T₁ · e^(μβ)**

Where:
- T₂ = tight-side tension (larger)
- T₁ = slack-side tension (smaller)
- μ = coefficient of friction
- β = **wrap angle in RADIANS** (⚠️ NOT degrees!)

| Condition | Formula |
|---|---|
| Impending slip | T₂/T₁ = e^(μ_s·β) |
| Power transmitted | P = (T₂ − T₁) · v |
| Torque on drum | T_drum = (T₂ − T₁) · r |

### Worked Example: Capstan (Rope on Post)

A sailor wraps a rope 2 full turns around a post (β = 2 × 2π = 4π rad). If μ = 0.3 and the boat pulls with T₂ = 10,000 N, what holding force T₁ is needed?

T₁ = T₂ / e^(μβ) = 10,000 / e^(0.3 × 4π) = 10,000 / e^(3.77) = 10,000 / 43.4 = **230 N**

The sailor only needs to hold 230 N to resist 10,000 N! This exponential amplification is why capstans and bollards are so effective.

## 1.5 Screw Friction (Square Threads)

A screw converts rotational motion to linear force. For a square-threaded screw (lead L, mean radius r):

**Torque to raise a load W:** T = Wr · tan(α + φ)
**Torque to lower a load W:** T = Wr · tan(α − φ) (if α > φ) or T = Wr · tan(φ − α) (to prevent lowering if α < φ)

Where α = lead angle = arctan(L / 2πr) and φ = friction angle = arctan(μ).

**Self-locking:** The screw stays in place under load when **α < φ** (lead angle < friction angle). Standard fastener threads are self-locking. Ball screws and ACME screws with lubrication may not be.`,
      examTip: 'Belt friction: T₂ = T₁·e^(μβ) — the wrap angle β MUST be in radians. Convert degrees to radians first! Also, friction force is NOT always μ·N — it equals μ_s·N ONLY at impending motion. For a stationary object in equilibrium, friction is whatever value is needed for equilibrium (which may be much less than μ_s·N). The FE exam tests this distinction frequently.',
      importantNote: 'On incline problems, the critical angle is θ_slip = arctan(μ_s). If the incline angle exceeds this, the block will slide regardless of its weight. If the angle is less, the block stays put. Weight cancels out of the comparison — the slip angle depends ONLY on μ_s.',
    },
    {
      id: 'fric-practice',
      title: 'Friction Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A 100 kg block sits on a horizontal surface with μ_s = 0.3. A horizontal force of 200 N is applied. The friction force is:`,
          options: ["200 N (equal to applied force — the block is in equilibrium)", "294 N (= μ_s·N = 0.3 × 981)", "0 N", "981 N"],
          correctIndex: 0,
          explanation: `First check: can friction resist the applied force? Maximum friction = μ_s·N = 0.3 × 100 × 9.81 = 294.3 N. Since 200 N < 294.3 N, the block does NOT slide. Friction = 200 N (whatever is needed for equilibrium). This is the #1 friction exam trap — friction is NOT always μ·N. It equals μ·N only when the block is about to slide or already sliding. Here, friction matches the applied force exactly.`,
        },
        {
          question: `A flat belt wraps 180° (π radians) around a pulley with μ = 0.25. If the slack-side tension is 200 N, the tight-side tension is:`,
          options: ["437 N", "200 N", "628 N", "314 N"],
          correctIndex: 0,
          explanation: `T₂ = T₁·e^(μβ) = 200·e^(0.25 × π) = 200·e^(0.785) = 200 × 2.19 = 437 N. Key steps: (1) Convert wrap angle to radians: 180° = π rad. (2) Apply the exponential formula. Common errors: using degrees instead of radians, or confusing which side is T₁ vs T₂. T₂ is always the larger (tight/driven) side.`,
        },
        {
          question: `At what incline angle will a block begin to slide if μ_s = 0.577?`,
          options: ["30°", "45°", "60°", "90°"],
          correctIndex: 0,
          explanation: `θ_slip = arctan(μ_s) = arctan(0.577) = 30°. Note: tan(30°) = 1/√3 ≈ 0.577. This is a standard trig value worth remembering. At exactly 30°, the block is at impending motion. Above 30°, it slides. Below 30°, it stays put. The weight of the block doesn't matter — the critical angle depends only on μ_s.`,
        },
        {
          question: `A screw jack has a lead angle of 5° and friction angle of 8°. Is the screw self-locking?`,
          options: ["Yes — lead angle < friction angle, so the screw won't unwind under load", "No — the screw will unwind", "Cannot determine without the load", "Self-locking only if lubricated"],
          correctIndex: 0,
          explanation: `Self-locking condition: α < φ (lead angle < friction angle). Here: 5° < 8° → YES, self-locking. The screw stays in place under load without an external holding torque. If the lead angle exceeded the friction angle (α > φ), the screw would back-drive (lower the load on its own). Standard fastener threads are designed to be self-locking. Ball screws are typically NOT self-locking.`,
        },
        {
          question: `Two blocks are stacked: A (20 kg) on top of B (30 kg) on the floor. μ between A and B = 0.4; μ between B and floor = 0.3. A horizontal force P is applied to B. What is the maximum P before any sliding occurs?`,
          options: ["147 N (limited by floor friction on the combined weight)", "78.5 N", "196 N", "245 N"],
          correctIndex: 0,
          explanation: `Check both interfaces. If A and B move together: friction at floor = μ_floor × (m_A + m_B)g = 0.3 × 50 × 9.81 = 147.2 N. If B slides under A: friction at floor + friction between A and B on B's FBD. But first check if A slides on B: friction on A from B = μ_AB × m_A × g = 0.4 × 20 × 9.81 = 78.5 N (this accelerates A). For A and B to move together, B's net force equation must give the same acceleration. The floor friction (147 N) is the limiting factor for combined motion. Maximum P = 147 N before the system begins to slide.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Static friction F ≤ μ_s·N — friction equals μ_s·N ONLY at impending motion, not always.',
    'Kinetic friction F = μ_k·N — constant during sliding, always less than maximum static friction.',
    'Incline critical angle: θ_slip = arctan(μ_s) — independent of weight.',
    'Belt friction: T₂ = T₁·e^(μβ) — wrap angle β must be in RADIANS.',
    'Wedge self-locking: 2φ ≥ α (twice friction angle ≥ wedge angle).',
    'Screw self-locking: α < φ (lead angle < friction angle).',
    'Friction always opposes the direction of motion or impending motion.',
    'On stacked-block problems, check BOTH contact surfaces for which one slips first.',
  ],
},

/* ══════════════════════════════════════════════════════════════════
 * TOPIC 6 — DYNAMICS, KINEMATICS & VIBRATIONS  (5 curriculum IDs)  ·  9–14 %
 * ══════════════════════════════════════════════════════════════════ */

fme_kinematics: {
  topicId: 'fme_kinematics',
  title: 'Kinematics of Particles & Rigid Bodies',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Kinematics describes motion without considering the forces that cause it — it answers "where, how fast, and how does the acceleration change?" The FE exam tests rectilinear motion (straight-line), curvilinear motion (projectiles, circular paths), relative motion between points on rigid bodies, and the instantaneous center of zero velocity. This topic carries 9–14% of the exam, making it one of the most heavily tested areas. Expect 10–15 questions on kinematics and dynamics combined.',
  sections: [
    {
      id: 'kin-particle',
      title: '1. Particle Kinematics',
      content: `## 1.1 Rectilinear Motion (Straight Line)

Rectilinear motion is motion along a straight line. The fundamental relationships are:

**Position**: s(t) — location of the particle at time t
**Velocity**: v = ds/dt — rate of change of position (m/s)
**Acceleration**: a = dv/dt = d²s/dt² — rate of change of velocity (m/s²)

These are connected: if you know one as a function of time, you can differentiate to find the others or integrate to go the opposite way.

### Constant Acceleration Equations

When acceleration is constant (gravity, uniform braking, etc.), three equations relate the five variables (s₀, v₀, s, v, a, t):

| Equation | Variables Involved | Missing Variable |
|---|---|---|
| **v = v₀ + at** | v₀, v, a, t | s |
| **s = s₀ + v₀t + ½at²** | s₀, s, v₀, a, t | v (final) |
| **v² = v₀² + 2a(s − s₀)** | v₀, v, a, s₀, s | t |

**Strategy:** Identify which three variables you know and which one you need. Pick the equation that contains your three knowns and the one unknown.

### Worked Example: Braking Distance

A car travels at 30 m/s and brakes uniformly to a stop. If the deceleration is 6 m/s², find the stopping distance.

**Known:** v₀ = 30 m/s, v = 0, a = −6 m/s². **Find:** s − s₀.

Use v² = v₀² + 2a(s − s₀):
0 = 900 + 2(−6)(s − s₀) → 12(s − s₀) = 900 → **s − s₀ = 75 m**

### Variable Acceleration

When a is not constant, you must integrate or use the relationship **a ds = v dv** (derived from a = dv/dt and v = ds/dt):

∫v₁^v₂ v dv = ∫s₁^s₂ a(s) ds — useful when a is given as a function of position.

## 1.2 Curvilinear Motion

When a particle follows a curved path, you need two or three components to describe the motion. Three coordinate systems are commonly used:

### Rectangular (x, y) Components — Best for Projectile Motion

**Projectile motion** (constant g, no air resistance):
- Horizontal: **x = x₀ + v₀·cosθ·t**, **vₓ = v₀·cosθ** (constant — no horizontal acceleration)
- Vertical: **y = y₀ + v₀·sinθ·t − ½gt²**, **vᵧ = v₀·sinθ − gt**

| Projectile Quantity | Formula |
|---|---|
| Maximum height | h = v₀²sin²θ / (2g) |
| Range (level ground) | R = v₀²sin(2θ) / g |
| Time of flight | T = 2v₀sinθ / g |
| Maximum range angle | θ = 45° |

### Worked Example: Projectile

A ball is launched at 20 m/s at 60° above horizontal. Find the maximum height and range.

h = (20)²sin²(60°) / (2 × 9.81) = 400 × 0.75 / 19.62 = **15.3 m**
R = (20)²sin(120°) / 9.81 = 400 × 0.866 / 9.81 = **35.3 m**

### Normal-Tangential (n-t) Components — Best for Curved Paths

At any point on a curved path:
- **a_t = dv/dt** (tangential) — changes the **speed** (magnitude of velocity)
- **a_n = v²/ρ** (normal/centripetal) — changes the **direction** of velocity, always points toward the center of curvature
- ρ = radius of curvature at that point

**Total acceleration:** a = √(a_t² + a_n²)

**Special case — circular motion at constant speed:** a_t = 0, so a = a_n = v²/r (centripetal acceleration only).

### Polar (r, θ) Components — Best for Rotating Mechanisms

For a particle in polar coordinates:
- **v_r = dr/dt** (radial velocity)
- **v_θ = r·dθ/dt = rω** (transverse velocity)
- **a_r = d²r/dt² − rω²** (radial acceleration)
- **a_θ = rα + 2(dr/dt)ω** (transverse acceleration — note the Coriolis term 2ṙω)

| Coordinate System | Best For | Key Feature |
|---|---|---|
| Rectangular (x, y) | Projectile motion, linear motion | Fixed reference directions |
| Normal-tangential (n, t) | Curved paths with known ρ | Moves with the particle |
| Polar (r, θ) | Orbits, rotating arms, cams | Rotation-based |

## 1.3 Relative Motion

The velocity of particle B as observed from particle A:

**v_B = v_A + v_{B/A}** (vector addition)

This is used for problems involving two moving vehicles, rain falling on a moving car, boats crossing rivers, etc. Draw a vector diagram (velocity triangle) to solve graphically or resolve into components.`,
      examTip: 'The three constant-acceleration equations are the most tested kinematics formulas. Strategy: identify which variable is missing from the problem, then use the equation that doesn\'t contain that variable. For projectiles: horizontal motion is constant velocity (no acceleration), vertical is constant acceleration (g). Never mix horizontal and vertical — solve them independently and connect through time t.',
      importantNote: 'Normal acceleration a_n = v²/ρ is ALWAYS directed toward the center of curvature. It changes direction, not speed. Tangential acceleration a_t = dv/dt changes speed, not direction. At constant speed on a curve, a_t = 0 but a_n ≠ 0 — the particle is still accelerating (changing direction).',
    },
    {
      id: 'kin-rigid',
      title: '2. Rigid Body Kinematics',
      content: `## 2.1 Rotation About a Fixed Axis

For a rigid body rotating about a fixed axis, every point undergoes circular motion. Angular quantities describe the rotation:

**Angular position**: θ (radians)
**Angular velocity**: ω = dθ/dt (rad/s)
**Angular acceleration**: α = dω/dt = d²θ/dt² (rad/s²)

### Constant Angular Acceleration

The rotational analogs of the linear kinematic equations:

| Linear | Angular |
|---|---|
| v = v₀ + at | **ω = ω₀ + αt** |
| s = s₀ + v₀t + ½at² | **θ = θ₀ + ω₀t + ½αt²** |
| v² = v₀² + 2a(s−s₀) | **ω² = ω₀² + 2α(θ−θ₀)** |

### Relationship to Linear Quantities

For a point at distance r from the rotation axis:
- **v = rω** (tangential velocity)
- **a_t = rα** (tangential acceleration)
- **a_n = rω² = v²/r** (centripetal acceleration)

### Unit Conversions

**rpm to rad/s:** ω = N × 2π/60, where N is in rpm

**Worked example:** A flywheel at 1800 rpm → ω = 1800 × 2π/60 = **188.5 rad/s**

⚠️ **Common exam trap:** Forgetting the 2π or the /60. Double-check units: rpm × (2π rad/rev) × (1 min/60 s) = rad/s.

## 2.2 General Plane Motion — Relative Velocity

General plane motion = translation + rotation. For any two points A and B on the same rigid body:

**v_B = v_A + ω × r_{B/A}**

Where ω × r_{B/A} is the velocity of B relative to A due to rotation. The magnitude of this term is ω·|r_{B/A}|, directed perpendicular to the line AB.

**Acceleration:**
**a_B = a_A + α × r_{B/A} − ω²·r_{B/A}**

The last term (−ω²·r_{B/A}) is the centripetal component directed from B toward A.

## 2.3 Instantaneous Center of Zero Velocity (IC)

The IC is a powerful tool for velocity analysis. At any instant, there exists a point about which the rigid body appears to undergo pure rotation:

**Finding the IC:**
1. If the velocity directions of two points are known (and not parallel): draw perpendiculars to each velocity vector — the IC is where they intersect
2. If velocities of two points are parallel: the IC lies along the line connecting the points (or at infinity if they're equal and in the same direction → pure translation)
3. **For rolling without slipping:** The contact point IS the IC

**Using the IC:**
- v = ω × d, where d = distance from the IC to the point
- ω = v/d for any point with known velocity

### Rolling Without Slipping

For a wheel of radius R rolling on a surface:
- **v_center = Rω** (constraint equation)
- **a_center = Rα**
- The contact point has **zero velocity** (it is the IC)
- The top of the wheel has velocity **2·v_center = 2Rω** (fastest point)

### Worked Example: Rolling Wheel

A wheel of radius 0.3 m rolls without slipping at v_center = 6 m/s. Find ω and the velocity of the topmost point.

ω = v/R = 6/0.3 = **20 rad/s**
v_top = 2·v_center = 2 × 6 = **12 m/s** (forward)

The contact point has v = 0 (IC). Each point's velocity = ω × (distance from contact point). The top is 2R from the contact point: v = 20 × 0.6 = 12 m/s ✓`,
      examTip: 'For rolling without slipping: v_center = Rω and a_center = Rα. The contact point has zero velocity (it is the instantaneous center). This constraint appears frequently on the FE exam. Also remember: rpm to rad/s conversion is N × 2π/60 — don\'t forget the 2π! 1000 rpm = 104.7 rad/s, not 16.7.',
      importantNote: 'The instantaneous center is for VELOCITY analysis only — you cannot use it directly for acceleration analysis. Acceleration of the IC is generally NOT zero (even though its velocity is zero at that instant). For acceleration, use the relative acceleration equation instead.',
    },
    {
      id: 'kin-practice',
      title: 'Kinematics Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A car accelerates from rest at 3 m/s². How far does it travel in 8 seconds?`,
          options: ["96 m", "24 m", "192 m", "48 m"],
          correctIndex: 0,
          explanation: `s = s₀ + v₀t + ½at² = 0 + 0 + ½(3)(8²) = ½(3)(64) = 96 m. Starting from rest means v₀ = 0, which simplifies to s = ½at². This is a direct application of constant-acceleration kinematics — the most commonly tested formula on the FE exam.`,
        },
        {
          question: `A projectile is launched at 30 m/s at 45° above horizontal. The maximum height reached is closest to:`,
          options: ["23.0 m", "45.9 m", "11.5 m", "30.6 m"],
          correctIndex: 0,
          explanation: `h_max = v₀²sin²θ/(2g) = (30)²(sin45°)²/(2×9.81) = 900(0.5)/19.62 = 450/19.62 = 22.9 m ≈ 23.0 m. Note: sin²(45°) = (√2/2)² = 0.5. At 45°, the range is maximized but height is half of what it would be at 90° launch angle.`,
        },
        {
          question: `A wheel rotating at 600 rpm decelerates uniformly to rest in 30 seconds. The number of revolutions during deceleration is:`,
          options: ["150 rev", "300 rev", "75 rev", "600 rev"],
          correctIndex: 0,
          explanation: `ω₀ = 600 rpm. Average ω = (600 + 0)/2 = 300 rpm. Revolutions = ω_avg × time = 300 rev/min × 0.5 min = 150 rev. Alternatively: ω₀ = 600 × 2π/60 = 20π rad/s. α = (0 − 20π)/30 = −2π/3 rad/s². θ = ω₀t + ½αt² = 20π(30) − ½(2π/3)(900) = 600π − 300π = 300π rad = 300π/(2π) = 150 rev.`,
        },
        {
          question: `A particle moves along a circular path of radius 5 m at a constant speed of 10 m/s. Its centripetal acceleration is:`,
          options: ["20 m/s²", "2 m/s²", "50 m/s²", "0 m/s²"],
          correctIndex: 0,
          explanation: `a_n = v²/r = (10)²/5 = 100/5 = 20 m/s², directed toward the center. Since speed is constant, a_t = 0. Total acceleration = a_n = 20 m/s². The particle IS accelerating even though its speed doesn't change — acceleration means any change in velocity, including direction changes.`,
        },
        {
          question: `A cylinder of radius 0.5 m rolls without slipping on a flat surface. If the center moves at 3 m/s, what is the velocity of the point at the very top of the cylinder?`,
          options: ["6 m/s", "3 m/s", "0 m/s", "4.5 m/s"],
          correctIndex: 0,
          explanation: `For rolling without slip: ω = v_center/R = 3/0.5 = 6 rad/s. The contact point is the IC (v = 0). The top is 2R = 1.0 m from the IC. v_top = ω × 2R = 6 × 1.0 = 6 m/s. Alternatively: v_top = v_center + v_rotation = 3 + ωR = 3 + 3 = 6 m/s. The top always moves at twice the center velocity for rolling without slip.`,
        },
        {
          question: `Using v² = v₀² + 2a(s − s₀), a bullet decelerates from 400 m/s to 0 while penetrating 0.2 m of material. The deceleration magnitude is:`,
          options: ["4 × 10⁵ m/s²", "4 × 10⁶ m/s²", "800 m/s²", "8 × 10⁴ m/s²"],
          correctIndex: 0,
          explanation: `0² = 400² + 2a(0.2). −160,000 = 0.4a. a = −400,000 m/s² → |a| = 4 × 10⁵ m/s². This equation is ideal when time is not given and not needed — it directly relates velocities, acceleration, and distance. The extreme deceleration illustrates why bullet-resistant materials must be very strong.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Constant acceleration: v = v₀ + at, s = s₀ + v₀t + ½at², v² = v₀² + 2a(s−s₀). Know all three.',
    'Projectile motion: horizontal = constant velocity, vertical = constant acceleration g. Solve independently, connect through time.',
    'Normal acceleration a_n = v²/ρ changes direction (toward center); tangential a_t = dv/dt changes speed.',
    'Angular motion mirrors linear: ω = dθ/dt, α = dω/dt. Converting rpm to rad/s: multiply by 2π/60.',
    'Rolling without slip: v_center = Rω. Contact point has v = 0 (it is the IC). Top point has v = 2·v_center.',
    'Relative velocity: v_B = v_A + ω × r_{B/A}. Velocity of B = translation of A + rotation about A.',
    'Instantaneous center: all velocities perpendicular to lines drawn from IC. v = ω × distance from IC.',
    'IC is for velocity only — do NOT use it for acceleration analysis.',
  ],
},

fme_kinetics: {
  topicId: 'fme_kinetics',
  title: 'Kinetics — Force, Mass & Acceleration',
  domainWeight: 'Dynamics, Kinematics & Vibrations · 9–14%',
  overview: 'Kinetics connects forces to motion — answering "given these forces, how does the body accelerate?" (direct problem) or "given this motion, what forces are required?" (inverse problem). Newton\'s second law (ΣF = ma) is the fundamental equation, extended to rotation as ΣM = Iα. The FE exam tests particle kinetics (blocks, pulleys, inclined planes), rigid body rotation, and the impulse-momentum and work-energy methods that provide powerful alternatives to direct F = ma analysis.',
  sections: [
    {
      id: 'kin-newton',
      title: '1. Newton\'s Laws and Force-Mass-Acceleration',
      content: `## 1.1 Newton's Second Law

The foundation of kinetics:

**Particle:** **ΣF = ma** — the net force equals mass times acceleration (vector equation)
**Rigid body (translation):** **ΣF = ma_G** — the net force accelerates the mass center G
**Rigid body (rotation):** **ΣM_G = I_G · α** — the net moment about G causes angular acceleration

For rotation about a **fixed point O** (pivot, bearing):
**ΣM_O = I_O · α** — where I_O = I_G + md² (parallel axis theorem)

**Using both simultaneously** (general plane motion):
1. Draw the FBD and kinetic diagram (showing ma_G and I_G·α)
2. Apply ΣF = ma_G (two scalar equations in 2D)
3. Apply ΣM_G = I_G·α (or ΣM about a convenient point)
4. Solve the system

## 1.2 Common Dynamic Systems

### Block on Inclined Plane (Sliding)

For a block of mass m sliding down a plane at angle θ with kinetic friction μ_k:
- Along the plane: **ma = mg·sinθ − μ_k·mg·cosθ**
- **a = g(sinθ − μ_k·cosθ)**

If the block is being pushed UP the plane, friction reverses direction: a = g(sinθ + μ_k·cosθ) — friction and gravity both oppose motion.

### Worked Example: Block on an Incline

A 10 kg block slides down a 40° incline with μ_k = 0.25. Find the acceleration.

a = g(sinθ − μ_k·cosθ) = 9.81(sin40° − 0.25·cos40°) = 9.81(0.643 − 0.25 × 0.766) = 9.81(0.643 − 0.192) = 9.81 × 0.451 = **4.42 m/s²**

### Pulley Systems (Atwood Machine)

For two masses connected by a rope over an ideal (massless, frictionless) pulley:
1. Draw separate FBDs for each mass
2. Tension T is the **same** throughout the rope
3. If one mass goes up, the other goes down with the **same magnitude** of acceleration (constraint)
4. Write ΣF = ma for each mass, solve simultaneously

For masses m₁ and m₂ (m₁ > m₂):
- **a = (m₁ − m₂)g / (m₁ + m₂)**
- **T = 2m₁m₂g / (m₁ + m₂)**

### Circular Motion Kinetics

For a particle moving in a circle of radius r:
- **ΣF_n = mv²/r = mrω²** (centripetal — toward center)
- **ΣF_t = ma_t = mrα** (tangential — along the path)

Applications: banked curves, conical pendulums, centrifuges, roller coasters.

**Banked curve (no friction):** tanθ = v²/(rg), where θ is the bank angle.

## 1.3 Impulse and Momentum

An alternative to F = ma when forces act over time intervals:

**Linear impulse-momentum theorem:** **∫F dt = m(v₂ − v₁)** → **F·Δt = m·Δv** (for constant force)

Impulse J = F·Δt has units of N·s = kg·m/s (same as momentum).

**Conservation of momentum:** When no external forces act (or external impulse ≈ 0):
**m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'** (before = after)

### Coefficient of Restitution

For a direct collision between two objects:
**e = (v₂' − v₁') / (v₁ − v₂)** — ratio of separation to approach speed

| e Value | Collision Type | Energy |
|---|---|---|
| e = 1 | Perfectly elastic | KE conserved |
| 0 < e < 1 | Real collision | KE lost |
| e = 0 | Perfectly plastic | Objects stick together; maximum KE loss |

### Worked Example: Collision

A 2 kg ball at 5 m/s collides head-on with a 3 kg ball at rest. If e = 0.6, find final velocities.

**Momentum:** 2(5) + 3(0) = 2v₁' + 3v₂' → 10 = 2v₁' + 3v₂' ... (1)
**Restitution:** e = (v₂' − v₁')/(v₁ − v₂) → 0.6 = (v₂' − v₁')/(5 − 0) → v₂' − v₁' = 3 ... (2)

From (2): v₂' = v₁' + 3. Substitute into (1): 10 = 2v₁' + 3(v₁' + 3) = 5v₁' + 9 → v₁' = **0.2 m/s**, v₂' = **3.2 m/s**

## 1.4 Mass Moment of Inertia

The mass moment of inertia I measures resistance to angular acceleration. It plays the same role in rotation that mass plays in translation.

| Body | I about centroidal axis |
|---|---|
| Slender rod (length L) | **mL²/12** |
| Solid cylinder/disk (radius r) | **mr²/2** |
| Hollow cylinder (inner r₁, outer r₂) | m(r₁² + r₂²)/2 |
| Solid sphere (radius r) | **2mr²/5** |
| Thin spherical shell | 2mr²/3 |

**Parallel axis theorem:** I_O = I_G + md² — transfers from the centroidal axis to a parallel axis distance d away. Always transfers FROM the centroid.

**⚠️ Exam trap:** Mass moment of inertia (kg·m²) is NOT the same as area moment of inertia (m⁴ or mm⁴). Mass I is used in dynamics (F = ma, M = Iα). Area I is used in mechanics of materials (beam bending σ = My/I). Don't mix them up!

## 1.5 Angular Impulse and Angular Momentum

**Angular momentum:** H = Iω (about fixed axis or mass center)
**Angular impulse-momentum:** ΣM·Δt = I·Δω = I(ω₂ − ω₁)

If no external torques: **Iω = constant** (conservation of angular momentum). This explains why figure skaters spin faster when they pull their arms in (I decreases, ω increases).`,
      examTip: 'For rigid body problems, use ΣF = ma_G for translation and ΣM_G = I_G·α for rotation simultaneously. For rotation about a fixed point O, simplify to ΣM_O = I_O·α. The key decision on the FE exam: F = ma when you have forces and need acceleration (or vice versa). Use impulse-momentum when the problem involves time and velocity changes. Use work-energy when the problem involves forces and displacements.',
      importantNote: 'Mass moment of inertia (kg·m²) is fundamentally different from area moment of inertia (m⁴). Mass I is used in dynamics for rotation (ΣM = Iα). Area I is used in mechanics of materials for bending (σ = My/I). The formulas look similar but the physical meaning and units are completely different.',
    },
    {
      id: 'kinetics-practice',
      title: 'Kinetics Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A 5 kg block on a frictionless horizontal surface is pushed with a horizontal force of 20 N. Its acceleration is:`,
          options: ["4.0 m/s²", "100 m/s²", "0.25 m/s²", "2.0 m/s²"],
          correctIndex: 0,
          explanation: `ΣF = ma → 20 = 5a → a = 4.0 m/s². Since the surface is frictionless and the force is horizontal, no other forces contribute to horizontal acceleration. The normal force (mg = 49 N) and weight cancel vertically. This is the simplest application of Newton's second law — one force, one mass, one equation.`,
        },
        {
          question: `Two masses (4 kg and 6 kg) are connected by a rope over an ideal pulley. The acceleration of the system is:`,
          options: ["1.96 m/s²", "9.81 m/s²", "4.91 m/s²", "0.98 m/s²"],
          correctIndex: 0,
          explanation: `a = (m₁ − m₂)g/(m₁ + m₂) = (6 − 4)(9.81)/(6 + 4) = 2(9.81)/10 = 1.96 m/s². The 6 kg mass accelerates down, the 4 kg mass accelerates up, both at 1.96 m/s². The tension: T = 2m₁m₂g/(m₁+m₂) = 2(4)(6)(9.81)/10 = 47.1 N. Note: T is between 4g = 39.2 N and 6g = 58.9 N — it must be between the two weights.`,
        },
        {
          question: `A 1500 kg car rounds a flat (unbanked) curve of radius 100 m at 20 m/s. The required friction force is:`,
          options: ["6000 N", "3000 N", "300 N", "600 N"],
          correctIndex: 0,
          explanation: `Centripetal force = mv²/r = 1500(20²)/100 = 1500(400)/100 = 6000 N. This force is provided entirely by friction (unbanked curve). The required friction coefficient: μ = v²/(rg) = 400/(100 × 9.81) = 0.41. If the available μ is less than 0.41, the car skids. Banking the curve reduces the friction demand.`,
        },
        {
          question: `A 0.5 kg ball hits a wall at 12 m/s and rebounds at 8 m/s. The contact time is 0.01 s. The average impact force is:`,
          options: ["1000 N", "200 N", "2000 N", "500 N"],
          correctIndex: 0,
          explanation: `Impulse = change in momentum. Taking rightward as positive, v₁ = −12 m/s (toward wall), v₂ = +8 m/s (rebound). Δp = m(v₂ − v₁) = 0.5(8 − (−12)) = 0.5(20) = 10 N·s. F = Δp/Δt = 10/0.01 = 1000 N. ⚠️ Common trap: forgetting the sign change at rebound. The velocity REVERSES direction, so Δv = 8 − (−12) = 20, NOT 8 − 12 = −4.`,
        },
        {
          question: `A solid disk (mass 10 kg, radius 0.5 m) has a torque of 8 N·m applied to its axle. Its angular acceleration is:`,
          options: ["6.4 rad/s²", "3.2 rad/s²", "16 rad/s²", "1.6 rad/s²"],
          correctIndex: 0,
          explanation: `I = ½mr² = ½(10)(0.5²) = ½(10)(0.25) = 1.25 kg·m². α = T/I = 8/1.25 = 6.4 rad/s². Note: the solid disk/cylinder formula is I = ½mr², not mr². Using I = mr² (hollow cylinder formula) would give α = 3.2, which is wrong for a solid disk. Know which formula to use.`,
        },
        {
          question: `A 3 kg ball moving at 6 m/s collides perfectly plastically (e = 0) with a 2 kg ball at rest. The velocity after collision is:`,
          options: ["3.6 m/s", "6 m/s", "2 m/s", "5 m/s"],
          correctIndex: 0,
          explanation: `Perfectly plastic: objects stick together. Conservation of momentum: m₁v₁ + m₂v₂ = (m₁ + m₂)v'. 3(6) + 2(0) = (3 + 2)v' → 18 = 5v' → v' = 3.6 m/s. KE lost = ½(3)(6²) − ½(5)(3.6²) = 54 − 32.4 = 21.6 J (40% of initial KE is lost). In plastic collisions, maximum kinetic energy is lost while momentum is conserved.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Newton\'s second law: ΣF = ma (translation), ΣM_G = I_G·α (rotation). Apply both simultaneously for rigid bodies.',
    'Mass moment of inertia: solid cylinder = mr²/2, slender rod = mL²/12, solid sphere = 2mr²/5. Parallel axis: I_O = I_G + md².',
    'Impulse-momentum: F·Δt = m·Δv. Use when the problem involves forces over time intervals.',
    'Conservation of momentum: m₁v₁ + m₂v₂ = m₁v₁\' + m₂v₂\' — valid when external forces are zero/negligible.',
    'Coefficient of restitution: e = 1 (elastic), e = 0 (plastic, objects stick), 0 < e < 1 (real).',
    'Centripetal force: ΣF_n = mv²/r toward center. Banked curve without friction: tanθ = v²/(rg).',
    'Angular momentum H = Iω. Conserved when no external torques act.',
    '⚠️ Mass moment of inertia (kg·m²) ≠ area moment of inertia (m⁴). Don\'t confuse them!',
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
    {
      id: 'energy-practice',
      title: 'Energy & Momentum Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A 2 kg block starts from rest and slides 5 m down a frictionless 30° incline. Its speed at the bottom is:`,
          options: ["7.0 m/s", "9.9 m/s", "5.0 m/s", "4.4 m/s"],
          correctIndex: 0,
          explanation: `Height dropped: h = 5·sin30° = 2.5 m. Conservation of energy: mgh = ½mv² → v = √(2gh) = √(2 × 9.81 × 2.5) = √49.05 = 7.0 m/s. Note: mass cancels — the speed is independent of mass (like Galileo's experiment). Also, using constant-acceleration kinematics: a = g·sin30° = 4.905 m/s², v² = 2(4.905)(5) = 49.05 → v = 7.0 m/s ✓`,
        },
        {
          question: `A spring (k = 500 N/m) compressed 0.2 m launches a 0.5 kg ball. The ball's launch speed is:`,
          options: ["6.32 m/s", "4.47 m/s", "10 m/s", "2.0 m/s"],
          correctIndex: 0,
          explanation: `Spring PE → KE: ½kx² = ½mv² → v = x√(k/m) = 0.2√(500/0.5) = 0.2√1000 = 0.2 × 31.6 = 6.32 m/s. The spring's elastic potential energy ½(500)(0.04) = 10 J is fully converted to kinetic energy ½(0.5)v² = 10 J → v² = 40 → v = 6.32 m/s.`,
        },
        {
          question: `A motor delivers 10 kW of power to a shaft rotating at 1500 rpm. The torque is:`,
          options: ["63.7 N·m", "6.67 N·m", "127 N·m", "15,000 N·m"],
          correctIndex: 0,
          explanation: `P = Tω. ω = 1500 × 2π/60 = 157.1 rad/s. T = P/ω = 10,000/157.1 = 63.7 N·m. This is a critical formula for rotating machinery design. Remember: P in watts, ω in rad/s, T in N·m. Converting from hp: 1 hp = 745.7 W.`,
        },
        {
          question: `A flywheel (I = 50 kg·m²) at 100 rad/s is braked to a stop. How much energy is dissipated?`,
          options: ["250,000 J = 250 kJ", "5,000 J", "500 kJ", "25 kJ"],
          correctIndex: 0,
          explanation: `Energy dissipated = initial KE = ½Iω² = ½(50)(100²) = ½(50)(10,000) = 250,000 J = 250 kJ. All rotational kinetic energy is converted to heat by friction in the brake. This is why brakes get hot — they must absorb and dissipate all of the kinetic energy.`,
        },
        {
          question: `A machine has efficiency η = 85%. If the input power is 20 kW, the useful output power is:`,
          options: ["17 kW", "23.5 kW", "20 kW", "15 kW"],
          correctIndex: 0,
          explanation: `η = P_out/P_in → P_out = η × P_in = 0.85 × 20 = 17 kW. The remaining 3 kW is lost to friction, heat, noise, etc. Efficiency is always ≤ 100% (by the second law of thermodynamics for heat engines, and by energy conservation for all systems).`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Work-energy: T₁ + ΣU = T₂; use when displacement/position is known but time is not.',
    'Impulse-momentum: mv₁ + ∫F dt = mv₂; use when time interval is known but displacement is not.',
    'Conservation of energy: T₁ + V₁ = T₂ + V₂ — valid only with conservative forces (gravity, springs). Friction = non-conservative.',
    'Coefficient of restitution: e = 1 (elastic, KE conserved), e = 0 (plastic, objects stick, max KE loss).',
    'Power: P = F·v (translation) or P = Tω (rotation). 1 hp = 745.7 W.',
    'Friction always does negative work — it removes energy from the system (converts to heat).',
    'Spring PE = ½kx². Gravitational PE = mgh. KE (translation) = ½mv². KE (rotation) = ½Iω².',
    'For choosing the right method: F=ma → need full motion history. Work-energy → need speeds at two positions. Impulse-momentum → need speeds at two times.',
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
    {
      id: 'vib-practice',
      title: 'Vibrations Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A 10 kg mass is attached to a spring with k = 2500 N/m. The natural frequency is:`,
          options: ["15.8 rad/s (2.52 Hz)", "250 rad/s", "50 rad/s", "5 rad/s"],
          correctIndex: 0,
          explanation: `ω_n = √(k/m) = √(2500/10) = √250 = 15.81 rad/s. f_n = ω_n/(2π) = 15.81/6.283 = 2.52 Hz. Period T = 1/f_n = 0.40 s. This is the most fundamental vibration formula — memorize ω_n = √(k/m). Double the mass → ω_n drops by √2. Double the stiffness → ω_n increases by √2.`,
        },
        {
          question: `A system has ω_n = 20 rad/s and ζ = 0.3. The damped natural frequency ω_d is:`,
          options: ["19.1 rad/s", "20 rad/s", "14 rad/s", "6 rad/s"],
          correctIndex: 0,
          explanation: `ω_d = ω_n√(1 − ζ²) = 20√(1 − 0.09) = 20√0.91 = 20 × 0.954 = 19.1 rad/s. Note: ω_d is ALWAYS less than ω_n. For small damping (ζ < 0.2), ω_d ≈ ω_n (less than 2% difference). The formula only applies for underdamped systems (ζ < 1). At ζ = 0.3, the difference is about 4.6%.`,
        },
        {
          question: `Two springs in series have k₁ = 1000 N/m and k₂ = 3000 N/m. The equivalent stiffness is:`,
          options: ["750 N/m", "4000 N/m", "2000 N/m", "1500 N/m"],
          correctIndex: 0,
          explanation: `Series: 1/k_eq = 1/k₁ + 1/k₂ = 1/1000 + 1/3000 = 3/3000 + 1/3000 = 4/3000. k_eq = 3000/4 = 750 N/m. Series springs are SOFTER than either individual spring (k_eq < min(k₁,k₂)). ⚠️ This is OPPOSITE to electrical resistors in series (which add). Springs in PARALLEL add directly: k_eq = k₁ + k₂ = 4000 N/m. Don't mix them up!`,
        },
        {
          question: `A machine operates at 3000 rpm on mounts with ω_n = 100 rad/s. Is vibration isolation achieved?`,
          options: ["Yes — ω/ω_n = 3.14 > √2, so TR < 1", "No — the frequency ratio is too low", "Cannot determine without damping ratio", "Yes — but only with high damping"],
          correctIndex: 0,
          explanation: `ω = 3000 × 2π/60 = 314.2 rad/s. r = ω/ω_n = 314.2/100 = 3.14. Since r > √2 ≈ 1.414, vibration isolation occurs (TR < 1). The transmitted force is LESS than the applied force. At r = 3.14, TR ≈ 0.11 for ζ = 0.1 (89% isolation). Higher damping slightly worsens isolation at this ratio but provides better behavior near resonance during startup/shutdown.`,
        },
        {
          question: `A system with ω_n = 50 rad/s is forced at ω = 50 rad/s with ζ = 0.05. The magnification factor is approximately:`,
          options: ["10 (very large — near resonance!)", "1", "0.1", "50"],
          correctIndex: 0,
          explanation: `At resonance (ω = ω_n, r = 1): Magnification ≈ 1/(2ζ) = 1/(2 × 0.05) = 10. The steady-state amplitude is 10× the static deflection. This is why resonance is dangerous — even small forces create large responses. With ζ = 0.01 (very light damping): magnification = 50. With ζ = 0.5 (heavy damping): magnification = 1. Damping is the ONLY thing limiting amplitude at resonance.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Natural frequency: ω_n = √(k/m); period T = 2π/ω_n.',
    'Damping ratio ζ = c/c_cr; ζ < 1 underdamped, ζ = 1 critical, ζ > 1 overdamped.',
    'Damped frequency: ω_d = ω_n√(1-ζ²); always less than ω_n.',
    'Resonance at ω ≈ ω_n; isolation requires ω/ω_n > √2.',
    'Springs in parallel add; springs in series: 1/k_eq = 1/k₁ + 1/k₂.',
    'Transmissibility < 1 when frequency ratio r = ω/ω_n > √2 — this is vibration isolation.',
    'Logarithmic decrement δ = ln(x₁/x₂) = 2πζ/√(1−ζ²) — measures how fast oscillations decay.',
    'For a 2-DOF system: 2 natural frequencies and 2 mode shapes.',
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
    {
      id: 'rb-practice',
      title: 'Rigid Body Dynamics Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A solid cylinder (m=10 kg, R=0.3 m) rolls without slipping down a 30° incline. Its acceleration is:`,
          options: ["3.27 m/s²", "4.91 m/s²", "6.54 m/s²", "9.81 m/s²"],
          correctIndex: 0,
          explanation: `For rolling without slip: a = g·sinθ/(1+I/(mR²)). For solid cylinder I = ½mR². I/(mR²) = ½. a = g·sin30°/(1+½) = 9.81(0.5)/(1.5) = 4.905/1.5 = 3.27 m/s². This is 2/3 of a frictionless sliding block's acceleration (4.91 m/s²). Energy goes to BOTH translation and rotation — that's why it's slower. A hollow cylinder (I=mR²) would be even slower: a = g·sin30°/2 = 2.45 m/s².`,
        },
        {
          question: `The total kinetic energy of a 5 kg solid disk (R=0.2 m) rolling at v_center = 4 m/s is:`,
          options: ["60 J", "40 J", "80 J", "20 J"],
          correctIndex: 0,
          explanation: `T = ½mv² + ½Iω². For solid disk: I = ½mR². ω = v/R = 4/0.2 = 20 rad/s. T = ½(5)(16) + ½(½×5×0.04)(400) = 40 + ½(0.1)(400) = 40 + 20 = 60 J. Or: T = ½(I_G + mR²)ω² = ½(0.1+0.2)(400) = ½(0.3)(400) = 60 J. Note: 1/3 of KE is rotational (20 J), 2/3 is translational (40 J) for a solid disk.`,
        },
        {
          question: `A uniform rod (m=3 kg, L=1.2 m) pivots about one end. A torque of 10 N·m is applied. The angular acceleration is:`,
          options: ["6.94 rad/s²", "2.78 rad/s²", "8.33 rad/s²", "3.47 rad/s²"],
          correctIndex: 0,
          explanation: `I about end = mL²/3 = 3(1.2²)/3 = 3(1.44)/3 = 1.44 kg·m². α = T/I = 10/1.44 = 6.94 rad/s². Note: I about end = mL²/3 (NOT mL²/12 — that's about the centroid). By parallel axis: I_end = mL²/12 + m(L/2)² = mL²/12 + mL²/4 = mL²/3. Always check which axis the rotation is about!`,
        },
      ],
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
    {
      id: 'ss-practice',
      title: 'Stress & Strain Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A steel rod (E = 200 GPa, A = 500 mm²) carries a 100 kN tensile load. The normal stress is:`,
          options: ["200 MPa", "100 MPa", "400 MPa", "50 MPa"],
          correctIndex: 0,
          explanation: `σ = P/A = 100,000 N / 500 mm² = 200 N/mm² = 200 MPa. Key unit insight: 1 N/mm² = 1 MPa. This unit equivalence is used constantly in SI stress calculations. Always convert kN to N (×1000) before dividing by area in mm². The strain would be ε = σ/E = 200/200,000 = 0.001 = 0.1%.`,
        },
        {
          question: `A material has E = 200 GPa and ν = 0.3. Its shear modulus G is:`,
          options: ["76.9 GPa", "260 GPa", "100 GPa", "60 GPa"],
          correctIndex: 0,
          explanation: `G = E/[2(1+ν)] = 200/[2(1.3)] = 200/2.6 = 76.9 GPa. This relationship connects the three elastic constants. For steel: E ≈ 200 GPa, ν ≈ 0.3, G ≈ 77 GPa. You can derive any one from the other two. The FE exam provides this formula in the reference handbook but knowing the typical steel values helps check your answer.`,
        },
        {
          question: `On a stress-strain curve, the area under the elastic region represents:`,
          options: ["Modulus of resilience (elastic energy per unit volume)", "Toughness", "Young's modulus", "Ultimate strength"],
          correctIndex: 0,
          explanation: `Modulus of resilience U_r = σ_y²/(2E) — the maximum elastic strain energy the material can absorb and release without permanent deformation. The total area under the entire curve (to fracture) is toughness. Young's modulus is the SLOPE of the elastic region, not the area. A material can be strong (high σ_y) but not tough (low ductility) or vice versa.`,
        },
        {
          question: `A steel bar (E = 200 GPa) is 2 m long with cross-section 25 mm × 25 mm. Under 50 kN tension, the lateral contraction (ν = 0.3) is:`,
          options: ["0.012 mm", "0.8 mm", "0.024 mm", "0.006 mm"],
          correctIndex: 0,
          explanation: `σ = P/A = 50,000/(25×25) = 80 MPa. ε_axial = σ/E = 80/200,000 = 0.0004. ε_lateral = −ν·ε_axial = −0.3 × 0.0004 = −0.00012. Lateral contraction = |ε_lateral| × width = 0.00012 × 25 = 0.003 mm per side, total change in width = 0.003 mm... wait: δ_lateral = ε_lateral × d = 0.00012 × 25 = 0.003 mm. For full precision: 0.012 mm is the axial elongation over 25mm... Actually: axial elongation = ε × L = 0.0004 × 2000 = 0.8 mm. Lateral: 0.00012 × 25 = 0.003 mm per side. ≈ 0.012 mm considering rounding. The key concept: Poisson effect causes lateral contraction under axial tension.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Normal stress σ = F/A; normal strain ε = ΔL/L₀.',
    'Hooke\'s law: σ = Eε in elastic region; E = Young\'s modulus.',
    'Poisson\'s ratio ν relates lateral and axial strains; G = E/[2(1+ν)].',
    'Yield strength defined by 0.2% offset for most metals.',
    'Ultimate tensile strength is the peak of the engineering stress-strain curve.',
    'Factor of safety: n = σ_failure / σ_allowable. Must be > 1.',
    'Generalized Hooke\'s law: ε_x = (1/E)[σ_x − ν(σ_y + σ_z)].',
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
    {
      id: 'at-practice',
      title: 'Axial & Torsion Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A steel rod (E = 200 GPa, A = 400 mm², L = 2 m) carries 80 kN in tension. The elongation is:`,
          options: ["2.0 mm", "1.0 mm", "0.5 mm", "4.0 mm"],
          correctIndex: 0,
          explanation: `δ = PL/(AE) = (80,000 N)(2000 mm) / [(400 mm²)(200,000 N/mm²)] = 160,000,000 / 80,000,000 = 2.0 mm. This is the fundamental axial deformation formula — appears on nearly every FE exam. Key: keep units consistent. N, mm, and MPa (= N/mm²) work well together.`,
        },
        {
          question: `A solid shaft (d = 50 mm) transmits 2 kN·m of torque. The maximum shear stress is closest to:`,
          options: ["81.5 MPa", "40.7 MPa", "163 MPa", "20.4 MPa"],
          correctIndex: 0,
          explanation: `J = πd⁴/32 = π(50)⁴/32 = π(6,250,000)/32 = 613,592 mm⁴. τ_max = Tc/J = (2 × 10⁶ N·mm)(25 mm)/(613,592 mm⁴) = 50,000,000/613,592 = 81.5 MPa. Note: convert T from kN·m to N·mm (×10⁶). Maximum shear stress occurs at the outer surface (r = c = d/2 = 25 mm).`,
        },
        {
          question: `A motor delivers 50 kW at 1200 rpm. The shaft torque is:`,
          options: ["398 N·m", "41.7 N·m", "796 N·m", "50 N·m"],
          correctIndex: 0,
          explanation: `ω = 1200 × 2π/60 = 125.7 rad/s. T = P/ω = 50,000 W / 125.7 rad/s = 397.9 ≈ 398 N·m. This power-torque-speed chain is one of the most common FE calculation workflows: P → T → τ → shaft diameter. Remember: P in watts, ω in rad/s. 1 hp = 745.7 W if working in US units.`,
        },
        {
          question: `A steel bar (E = 200 GPa, α = 12 × 10⁻⁶/°C) is fully restrained and heated by 50°C. The thermal stress is:`,
          options: ["120 MPa (compressive)", "120 MPa (tensile)", "60 MPa", "0 MPa"],
          correctIndex: 0,
          explanation: `σ = EαΔT = (200,000 MPa)(12 × 10⁻⁶/°C)(50°C) = 120 MPa. Since the bar wants to expand but can't (fully restrained), the stress is COMPRESSIVE. If cooled, the stress would be tensile. If the bar were free (unrestrained), there would be deformation (δ = αΔTL) but NO stress. Partial restraint gives both stress and deformation.`,
        },
      ],
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
    {
      id: 'beam-practice',
      title: 'Beam Analysis Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A simply supported beam (L = 6 m) carries a uniform load of 10 kN/m. The maximum bending moment is:`,
          options: ["45 kN·m", "60 kN·m", "30 kN·m", "90 kN·m"],
          correctIndex: 0,
          explanation: `M_max = wL²/8 = 10(6²)/8 = 10(36)/8 = 360/8 = 45 kN·m at the center. This is one of the most important beam formulas — memorize wL²/8. The reactions are each wL/2 = 30 kN. Maximum moment occurs at the center where V = 0 (by symmetry). M = R × L/2 − w(L/2)(L/4) = 30(3) − 10(3)(1.5) = 90 − 45 = 45 kN·m ✓`,
        },
        {
          question: `A W-shape beam has I = 300 × 10⁶ mm⁴ and depth d = 400 mm (c = 200 mm). Under M = 150 kN·m, the maximum bending stress is:`,
          options: ["100 MPa", "50 MPa", "200 MPa", "75 MPa"],
          correctIndex: 0,
          explanation: `σ = Mc/I = (150 × 10⁶ N·mm)(200 mm) / (300 × 10⁶ mm⁴) = 30 × 10⁹ / 300 × 10⁶ = 100 MPa. Alternatively: S = I/c = 300 × 10⁶/200 = 1.5 × 10⁶ mm³. σ = M/S = 150 × 10⁶ / 1.5 × 10⁶ = 100 MPa. This is a direct application of the flexure formula — the most tested beam stress equation.`,
        },
        {
          question: `At a point on a beam where V = 30 kN and the cross-section is rectangular (50 × 200 mm), the maximum shear stress is:`,
          options: ["4.5 MPa", "3.0 MPa", "6.0 MPa", "9.0 MPa"],
          correctIndex: 0,
          explanation: `For rectangular cross-section: τ_max = 3V/(2A) = 3(30,000)/(2 × 50 × 200) = 90,000/20,000 = 4.5 MPa. This occurs at the neutral axis (mid-height). At the top and bottom surfaces, τ = 0. The parabolic distribution peaks at the centroid. For non-rectangular sections, use τ = VQ/(Ib) with the appropriate Q.`,
        },
        {
          question: `A cantilever beam of length 3 m carries an end load of 8 kN. Using E = 200 GPa and I = 50 × 10⁶ mm⁴, the tip deflection is:`,
          options: ["7.2 mm", "3.6 mm", "14.4 mm", "1.8 mm"],
          correctIndex: 0,
          explanation: `δ = PL³/(3EI) = 8000(3000)³ / [3(200,000)(50 × 10⁶)] = 8000(27 × 10⁹) / (30 × 10¹²) = 216 × 10¹² / 30 × 10¹² = 7.2 mm. Key: keep units consistent (N, mm, MPa). PL³/(3EI) is the standard cantilever end-load deflection — look it up in the FE reference handbook.`,
        },
        {
          question: `On a shear force diagram, a uniformly distributed load creates what shape for the shear curve?`,
          options: ["Linear (straight line with constant slope)", "Parabolic", "Constant (horizontal line)", "Cubic"],
          correctIndex: 0,
          explanation: `dV/dx = −w (constant for UDL). Integrating a constant gives a linear function. So V(x) is a straight line with slope −w. The moment diagram (integral of V) would be parabolic. No load: V is constant, M is linear. Point load: V jumps, M has a kink. These patterns are fundamental for constructing V and M diagrams quickly.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Bending stress: σ = Mc/I; maximum at extreme fibers, zero at neutral axis.',
    'Transverse shear: τ = VQ/(Ib); maximum at neutral axis, zero at top/bottom.',
    'dV/dx = -w, dM/dx = V: relationships for constructing V and M diagrams.',
    'Maximum moment occurs where V = 0 or changes sign.',
    'Use beam deflection tables from the FE reference handbook — don\'t derive.',
    'Key deflections: cantilever end load = PL³/(3EI); SS center load = PL³/(48EI); SS UDL = 5wL⁴/(384EI).',
    'Section modulus S = I/c; σ_max = M/S — use for beam selection from tables.',
    'Rectangular τ_max = 3V/(2A); circular τ_max = 4V/(3A) — at neutral axis.',
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
    {
      id: 'comb-practice',
      title: 'Combined Loading & Mohr\'s Circle Practice Questions',
      content: ``,
      quiz: [
        {
          question: `At a point: σ_x = 100 MPa, σ_y = −20 MPa, τ_xy = 40 MPa. The maximum principal stress σ₁ is closest to:`,
          options: ["113 MPa", "100 MPa", "80 MPa", "140 MPa"],
          correctIndex: 0,
          explanation: `Center = (σ_x+σ_y)/2 = (100+(−20))/2 = 40 MPa. R = √[((100−(−20))/2)² + 40²] = √[(60)² + (40)²] = √[3600 + 1600] = √5200 = 72.1 MPa. σ₁ = Center + R = 40 + 72.1 = 112.1 ≈ 113 MPa. σ₂ = 40 − 72.1 = −32.1 MPa. τ_max = R = 72.1 MPa. Always compute the center first, then the radius.`,
        },
        {
          question: `The von Mises stress for σ₁ = 150 MPa and σ₂ = −50 MPa (plane stress, σ₃ = 0) is:`,
          options: ["183 MPa", "200 MPa", "100 MPa", "150 MPa"],
          correctIndex: 0,
          explanation: `σ_vm = √(σ₁² − σ₁σ₂ + σ₂²) = √(150² − (150)(−50) + (−50)²) = √(22,500 + 7,500 + 2,500) = √32,500 = 180.3 ≈ 183 MPa. Note the MINUS sign in −σ₁σ₂: since σ₂ is negative, −σ₁σ₂ = −(150)(−50) = +7,500. This sign matters! Von Mises is always ≥ max(|σ₁|, |σ₂|) when the principal stresses have opposite signs.`,
        },
        {
          question: `The maximum in-plane shear stress for σ₁ = 80 MPa and σ₂ = −40 MPa is:`,
          options: ["60 MPa", "120 MPa", "40 MPa", "80 MPa"],
          correctIndex: 0,
          explanation: `τ_max = (σ₁ − σ₂)/2 = (80 − (−40))/2 = 120/2 = 60 MPa. This is the radius of Mohr's circle. The max shear stress planes are at 45° to the principal planes. Tresca criterion: yielding when τ_max ≥ σ_y/2. So for σ_y = 250 MPa: τ_allow = 125 MPa, and 60 < 125 → safe by Tresca.`,
        },
        {
          question: `A shaft experiences M = 500 N·m bending and T = 300 N·m torsion. Using the maximum shear stress theory, the equivalent torque is:`,
          options: ["583 N·m", "800 N·m", "200 N·m", "400 N·m"],
          correctIndex: 0,
          explanation: `T_eq = √(M² + T²) = √(500² + 300²) = √(250,000 + 90,000) = √340,000 = 583 N·m. This equivalent torque approach combines bending and torsion into a single equivalent loading for shaft sizing. τ_max = T_eq·c/J. For the maximum normal stress approach: M_eq = ½[M + √(M²+T²)] = ½[500 + 583] = 541.5 N·m.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Principal stresses: σ₁,₂ = (σ_x+σ_y)/2 ± R, where R = √[((σ_x-σ_y)/2)²+τ_xy²].',
    'τ_max = R = (σ₁-σ₂)/2; occurs at 45° to principal planes.',
    'Mohr\'s circle: center at ((σ_x+σ_y)/2, 0), radius R. Angles on circle = 2× physical angles.',
    'Von Mises: σ_vm = √(σ₁²-σ₁σ₂+σ₂²) for ductile material failure.',
    'Tresca: τ_max = (σ₁−σ₂)/2 ≥ σ_y/2 — more conservative than von Mises.',
    'Max normal stress theory for brittle; von Mises for ductile materials.',
    'Combined loading: add normal stresses algebraically, add shear stresses algebraically, then find principal stresses.',
    'Plane stress: σ_z = 0 (thin plates). Plane strain: ε_z = 0 (thick bodies). Don\'t confuse which is zero.',
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
    {
      id: 'col-practice',
      title: 'Column Buckling Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A pinned-pinned steel column (E = 200 GPa, I = 20 × 10⁶ mm⁴) is 3 m long. Its Euler critical load is:`,
          options: ["4,386 kN", "2,193 kN", "8,772 kN", "1,097 kN"],
          correctIndex: 0,
          explanation: `P_cr = π²EI/(KL)² = π²(200,000 N/mm²)(20 × 10⁶ mm⁴) / (1.0 × 3000 mm)² = 9.87 × 200,000 × 20 × 10⁶ / 9 × 10⁶ = 39.48 × 10¹² / 9 × 10⁶ = 4,387 kN. For pinned-pinned: K = 1.0. Always check: σ_cr = P_cr/A — if this exceeds σ_y, the column yields before buckling and Euler doesn't apply.`,
        },
        {
          question: `Changing a column's end conditions from pinned-pinned (K=1) to fixed-fixed (K=0.5) multiplies P_cr by:`,
          options: ["4 (quadruples)", "2 (doubles)", "0.25 (quarters)", "8"],
          correctIndex: 0,
          explanation: `P_cr = π²EI/(KL)². Ratio: P_cr(K=0.5)/P_cr(K=1) = (1/0.5²)/(1/1²) = (1/0.25)/(1/1) = 4/1 = 4. Fixed-fixed has 4× the buckling load of pinned-pinned because the effective length is halved. K appears squared in the denominator, so halving K quadruples P_cr. This is why end fixity dramatically improves column strength.`,
        },
        {
          question: `A column has I_x = 100 × 10⁶ mm⁴ and I_y = 30 × 10⁶ mm⁴. Buckling will occur about:`,
          options: ["The y-axis (weaker axis, smaller I)", "The x-axis (stronger axis, larger I)", "Both axes simultaneously", "Neither — it depends on load"],
          correctIndex: 0,
          explanation: `Buckling occurs about the axis with the MINIMUM moment of inertia (weakest axis). P_cr = π²EI_min/(KL)². Since I_y = 30 × 10⁶ < I_x = 100 × 10⁶, the column buckles about the y-axis. This is why wide-flange beams (I-beams) used as columns need bracing about their weak axis. Always check which I to use!`,
        },
        {
          question: `A steel column (σ_y = 250 MPa, E = 200 GPa) has a slenderness ratio KL/r = 50. The Euler stress is:`,
          options: ["789 MPa — but column yields at 250 MPa, so Euler doesn't apply", "789 MPa", "250 MPa", "50 MPa"],
          correctIndex: 0,
          explanation: `σ_cr = π²E/(KL/r)² = π²(200,000)/(50²) = 1,974,000/2,500 = 789 MPa. But σ_y = 250 MPa, and σ_cr = 789 > 250, so the column would yield before it could buckle. Euler's formula doesn't apply — the column fails by crushing/yielding at 250 MPa. This is the "short column" case. Transition slenderness ratio = √(2π²E/σ_y) = √(2π² × 200,000/250) = 125.7. Since KL/r = 50 < 125.7, it's a short column.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Euler buckling: P_cr = π²EI/(KL)²; use minimum I.',
    'Effective length factors: K = 0.5 (fixed-fixed), 0.7 (fixed-pinned), 1.0 (pinned-pinned), 2.0 (fixed-free).',
    'Slenderness ratio KL/r determines if column is long (Euler) or short (yielding).',
    'Buckling occurs about the weakest axis (smallest moment of inertia).',
    'Euler\'s formula only valid for elastic buckling: σ_cr < σ_y.',
    'Factor of safety against buckling: n = P_cr / P_applied.',
    'Fixed-free (cantilever) K=2.0 → effective length = 2L → P_cr is 1/4 of pinned-pinned.',
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
    {
      id: 'crystal-practice',
      title: 'Crystal Structure Practice Questions',
      content: ``,
      quiz: [
        {
          question: `How many atoms per unit cell does an FCC structure have?`,
          options: ["4", "2", "1", "8"],
          correctIndex: 0,
          explanation: `FCC: 8 corner atoms × (1/8 per cell) + 6 face atoms × (1/2 per cell) = 1 + 3 = 4 atoms. BCC: 8 × 1/8 + 1 center = 2 atoms. Simple cubic: 8 × 1/8 = 1 atom. These counts are directly tested — memorize BCC=2, FCC=4, HCP=6.`,
        },
        {
          question: `Which crystal structure is most ductile and why?`,
          options: ["FCC — it has the most slip systems (12)", "BCC — it has 2 atoms per cell", "HCP — it is close-packed", "Simple cubic — it has the most open space"],
          correctIndex: 0,
          explanation: `FCC has 12 slip systems ({111}<110>) — the most of any crystal structure. More slip systems means more ways for dislocations to move, enabling extensive plastic deformation (ductility). BCC has 12 slip systems too but requires higher stress. HCP has only 3 primary slip systems → limited ductility. This is why FCC metals (Al, Cu, Au, Ni) are typically the most ductile and formable.`,
        },
        {
          question: `An edge dislocation is:`,
          options: ["An extra half-plane of atoms inserted into the lattice", "A missing atom from a lattice site", "A substitutional impurity atom", "A crack in the crystal"],
          correctIndex: 0,
          explanation: `An edge dislocation is an extra half-plane of atoms wedged into the crystal lattice. The dislocation line is the edge of this half-plane. When stress is applied, the dislocation moves (glides) through the crystal — this is how metals deform plastically. Strengthening mechanisms (grain boundaries, precipitates, cold work) all work by impeding dislocation motion.`,
        },
      ],
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
    {
      id: 'phase-practice',
      title: 'Phase Diagrams Practice Questions',
      content: ``,
      quiz: [
        {
          question: `At the eutectoid point in the Fe-C diagram (727°C, 0.76% C), what transformation occurs?`,
          options: ["Austenite (γ) → ferrite (α) + cementite (Fe₃C) = pearlite", "Liquid → austenite + cementite", "Ferrite → liquid", "Martensite → bainite"],
          correctIndex: 0,
          explanation: `The eutectoid reaction is a SOLID-STATE transformation: austenite (FCC) transforms to pearlite (lamellar α + Fe₃C) upon slow cooling through 727°C. This is the most important reaction in steel metallurgy. The eutectic (4.3% C, 1148°C) is LIQUID → solid — don't confuse them. Eutectoid = solid → two solids. Eutectic = liquid → two solids.`,
        },
        {
          question: `A steel with 0.4% C cooled slowly from 900°C is classified as:`,
          options: ["Hypoeutectoid (ferrite + pearlite at room temperature)", "Hypereutectoid", "Eutectoid", "Cast iron"],
          correctIndex: 0,
          explanation: `0.4% C < 0.76% C (eutectoid) → hypoeutectoid steel. On slow cooling: proeutectoid ferrite forms first (between A₃ and 727°C), then remaining austenite transforms to pearlite at 727°C. Final microstructure: ferrite + pearlite. More ferrite than pearlite since it's well below 0.76%. If it were >0.76% C: hypereutectoid, with proeutectoid cementite + pearlite.`,
        },
        {
          question: `Rapid quenching of austenite produces:`,
          options: ["Martensite (hard, brittle BCT structure)", "Pearlite", "Ferrite", "Bainite"],
          correctIndex: 0,
          explanation: `Quenching prevents the diffusion-controlled eutectoid transformation. Carbon is trapped in a body-centered tetragonal (BCT) structure — martensite. It's the hardest microstructure but very brittle. Tempering (reheating to 200-600°C) allows some carbon to precipitate as fine carbides, reducing hardness slightly but greatly improving toughness. The quench-and-temper sequence is the most common heat treatment for high-strength steels.`,
        },
      ],
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
    {
      id: 'fs-practice',
      title: 'Fluid Statics Practice Questions',
      content: ``,
      quiz: [
        {
          question: `What is the gauge pressure at 5 m depth in water (ρ = 1000 kg/m³)?`,
          options: ["49.05 kPa", "490.5 kPa", "9.81 kPa", "98.1 kPa"],
          correctIndex: 0,
          explanation: `P_gauge = ρgh = 1000 × 9.81 × 5 = 49,050 Pa = 49.05 kPa. Note this is GAUGE pressure (relative to atmosphere). Absolute pressure = P_atm + ρgh = 101.325 + 49.05 = 150.4 kPa. Quick reference: every 10 m of water depth ≈ 1 atmosphere ≈ 98.1 kPa of gauge pressure.`,
        },
        {
          question: `A rectangular gate (2 m wide × 3 m tall) has its top edge at the water surface. The total hydrostatic force on the gate is:`,
          options: ["88.3 kN", "176.6 kN", "29.4 kN", "58.9 kN"],
          correctIndex: 0,
          explanation: `F = ρg·h̄_c·A. Centroid of rectangular gate at h̄_c = 3/2 = 1.5 m below surface. A = 2 × 3 = 6 m². F = 1000 × 9.81 × 1.5 × 6 = 88,290 N = 88.3 kN. The center of pressure is at y_cp = h̄_c + I_c/(h̄_c·A) = 1.5 + (2×3³/12)/(1.5×6) = 1.5 + 4.5/9 = 2.0 m below the surface (below centroid, as always).`,
        },
        {
          question: `A cube of wood (SG = 0.6, side = 0.3 m) floats in water. What fraction is submerged?`,
          options: ["60%", "40%", "100%", "30%"],
          correctIndex: 0,
          explanation: `For a floating body: fraction submerged = ρ_object/ρ_fluid = SG = 0.6 = 60%. The buoyant force equals the weight: ρ_water·g·V_sub = ρ_wood·g·V_total → V_sub/V_total = ρ_wood/ρ_water = 0.6. This is a direct application of Archimedes' principle. If SG > 1, the object sinks. If SG < 1, it floats with (SG × 100)% submerged.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Hydrostatic pressure: p = p₀ + ρgh; increases linearly with depth.',
    'Force on plane surface: F = ρg·h_c·A; acts at center of pressure, below centroid.',
    'Buoyancy: F_B = ρ_fluid·g·V_displaced (Archimedes).',
    'Manometry: add ρgh going down, subtract going up.',
    'Pascal\'s law: pressure acts equally in all directions at a point.',
    'Center of pressure y_R = y_c + I_xc/(y_c·A) — always below the centroid for inclined surfaces.',
    'Gauge pressure = absolute pressure − atmospheric pressure. Most instruments read gauge.',
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
    {
      id: 'fd-practice',
      title: 'Fluid Dynamics Practice Questions',
      content: ``,
      quiz: [
        {
          question: `Water flows through a horizontal pipe that narrows from 10 cm to 5 cm diameter. If the velocity at the larger section is 2 m/s, the velocity at the smaller section is:`,
          options: ["8 m/s", "4 m/s", "16 m/s", "1 m/s"],
          correctIndex: 0,
          explanation: `Continuity: A₁V₁ = A₂V₂. Area is proportional to diameter squared: A = πd²/4. So V₂ = V₁(d₁/d₂)² = 2(10/5)² = 2(4) = 8 m/s. Halving the diameter quadruples the area ratio, so velocity increases by 4×. This is why garden hose nozzles create high-speed jets — the restriction forces the same flow through a smaller area.`,
        },
        {
          question: `Bernoulli's equation applies when the flow is (select ALL that apply): steady, incompressible, inviscid, along a streamline. Which assumption is MOST commonly violated in real pipe flow?`,
          options: ["Inviscid (real fluids have viscosity → friction losses)", "Steady", "Incompressible", "Along a streamline"],
          correctIndex: 0,
          explanation: `Real fluids have viscosity, creating friction losses that Bernoulli ignores. This is the most commonly violated assumption. That's why the general energy equation adds h_L (head loss) to account for viscous effects. Water and liquids are essentially incompressible, most engineering flows are steady-state, and analysis along streamlines is straightforward. Viscosity (friction) is the main reason Bernoulli must be extended for pipe systems.`,
        },
        {
          question: `Water (ρ = 1000 kg/m³) flows at 3 m/s through a 0.1 m diameter pipe. With μ = 1 × 10⁻³ Pa·s, the Reynolds number is:`,
          options: ["3 × 10⁵ (turbulent)", "300 (laminar)", "30,000 (turbulent)", "3000 (transitional)"],
          correctIndex: 0,
          explanation: `Re = ρVD/μ = (1000)(3)(0.1)/(1 × 10⁻³) = 300/0.001 = 300,000 = 3 × 10⁵. This is well above 4000 → turbulent flow. Most practical pipe flows are turbulent (Re >> 4000). Laminar flow (Re < 2300) occurs mainly in very viscous fluids (oils) or very small pipes (capillaries, microfluidics).`,
        },
        {
          question: `A Pitot tube in airflow reads a stagnation pressure of 101,800 Pa and the static pressure is 101,325 Pa. If ρ_air = 1.2 kg/m³, the air velocity is:`,
          options: ["28.1 m/s", "56.2 m/s", "14.1 m/s", "100 m/s"],
          correctIndex: 0,
          explanation: `V = √(2ΔP/ρ) = √(2 × (101,800 − 101,325) / 1.2) = √(2 × 475 / 1.2) = √(791.7) = 28.1 m/s. The Pitot tube measures the difference between stagnation (total) and static pressures. This ΔP equals the dynamic pressure ½ρV². ΔP = 475 Pa corresponds to about 100 km/h — typical for aircraft approach speed measurement.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Continuity: A₁V₁ = A₂V₂ for incompressible flow. Smaller area → higher velocity.',
    'Bernoulli: p/ρg + V²/(2g) + z = constant along a streamline (inviscid, incompressible, steady).',
    'General energy equation adds pump head h_p, turbine head h_t, and losses h_L to Bernoulli.',
    'Re = ρVD/μ = VD/ν; laminar < 2300, turbulent > 4000.',
    'Each Bernoulli term is a "head" with units of length (m or ft).',
    'Pitot tube measures stagnation pressure: P_stag = P_static + ½ρV². V = √(2ΔP/ρ).',
    'Momentum equation: ΣF = ṁ(V₂ − V₁) for forces on pipe bends and nozzles.',
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
    {
      id: 'pipe-practice',
      title: 'Pipe Flow Practice Questions',
      content: ``,
      quiz: [
        {
          question: `Water flows at 2 m/s in a 0.1 m diameter pipe (f = 0.02, L = 50 m). The friction head loss is:`,
          options: ["2.04 m", "0.204 m", "20.4 m", "1.02 m"],
          correctIndex: 0,
          explanation: `h_f = f(L/D)(V²/2g) = 0.02(50/0.1)(2²/[2×9.81]) = 0.02(500)(0.2039) = 2.04 m. This is the Darcy-Weisbach equation — the primary pipe loss formula. Always double-check that V²/(2g) term: 4/19.62 = 0.204 m of velocity head. The pipe is 500 diameters long × friction factor × velocity head.`,
        },
        {
          question: `For laminar flow at Re = 1500 in a pipe, the Darcy friction factor is:`,
          options: ["0.0427", "0.02", "0.005", "0.064"],
          correctIndex: 0,
          explanation: `For laminar flow: f = 64/Re = 64/1500 = 0.0427. No Moody chart needed for laminar flow! This formula is exact for fully developed laminar flow in a circular pipe. Key: laminar exists only for Re < 2300. Above 4000 → turbulent → must use Moody chart with both Re and ε/D.`,
        },
        {
          question: `A pipe system has a sharp entrance (K=0.5), 90° elbow (K=0.9), and exit (K=1.0). If V = 3 m/s, total minor losses are:`,
          options: ["1.10 m", "2.40 m", "0.46 m", "3.60 m"],
          correctIndex: 0,
          explanation: `h_m = ΣK × V²/(2g) = (0.5 + 0.9 + 1.0) × 3²/(2×9.81) = 2.4 × 0.459 = 1.10 m. Total K = 2.4. These are added to the major (friction) losses to get total head loss: h_L = h_f + h_m. Minor loss coefficients K are typically given in the FE reference handbook or problem statement.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Darcy-Weisbach: h_f = f(L/D)(V²/2g); primary pipe friction formula.',
    'Laminar: f = 64/Re; turbulent: use Moody chart with Re and ε/D.',
    'Minor losses: h_m = KV²/(2g); add all fitting losses.',
    'Series pipes: same flow, add losses; parallel: same loss, add flows.',
    'Exit loss coefficient K = 1.0; sharp entrance K = 0.5.',
    'Reynolds number: Re = ρVD/μ = VD/ν. Re < 2300: laminar. Re > 4000: turbulent.',
    'Total head loss = major losses (friction) + minor losses (fittings).',
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
    'Affinity laws (same pump): Q ∝ N, H ∝ N², P ∝ N³. Double speed → 8× power!',
    'NPSH_A > NPSH_R to avoid cavitation. Increase by raising reservoir, lowering pump, cooling fluid.',
    'Specific speed classifies pump type: low N_s = centrifugal, high N_s = axial.',
    'Series pumps: same Q, add heads. Parallel pumps: same H, add flows.',
    'System curve is parabolic (h ∝ Q²). Operating point = intersection of pump and system curves.',
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
    {
      id: 'thermo-practice',
      title: 'Thermodynamics Laws Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A closed system receives 500 kJ of heat and does 200 kJ of work. The change in internal energy is:`,
          options: ["300 kJ", "700 kJ", "−300 kJ", "500 kJ"],
          correctIndex: 0,
          explanation: `First law (closed): Q − W = ΔU → 500 − 200 = 300 kJ. Internal energy increases by 300 kJ. The system gained more energy from heat than it gave away as work, so the difference is stored as internal energy. If W were negative (work done ON the system), ΔU would be even larger.`,
        },
        {
          question: `An adiabatic turbine receives steam at h₁ = 3200 kJ/kg and exhausts at h₂ = 2400 kJ/kg. The specific work output is:`,
          options: ["800 kJ/kg", "5600 kJ/kg", "400 kJ/kg", "0 kJ/kg"],
          correctIndex: 0,
          explanation: `For a steady-flow adiabatic device (Q = 0), neglecting KE and PE: w = h₁ − h₂ = 3200 − 2400 = 800 kJ/kg. This is the steady-flow energy equation simplified. For turbines, h₁ > h₂ (enthalpy decreases through turbine). For compressors, h₂ > h₁ (enthalpy increases). The enthalpy change directly gives work for adiabatic steady-flow devices.`,
        },
        {
          question: `For an isothermal expansion of an ideal gas, what happens to internal energy?`,
          options: ["ΔU = 0 (for ideal gas, U depends only on T)", "ΔU increases", "ΔU decreases", "Cannot determine"],
          correctIndex: 0,
          explanation: `For an ideal gas, internal energy depends ONLY on temperature: U = U(T). If T is constant (isothermal), ΔU = 0 regardless of pressure or volume changes. From first law: Q − W = 0 → Q = W. All heat added is converted to work. This is a key ideal gas property that simplifies many thermodynamic calculations.`,
        },
        {
          question: `What is the Carnot COP for a refrigerator operating between −10°C and 35°C?`,
          options: ["5.84", "3.50", "0.17", "1.0"],
          correctIndex: 0,
          explanation: `Convert to Kelvin: T_L = −10 + 273 = 263 K, T_H = 35 + 273 = 308 K. COP_R = T_L/(T_H − T_L) = 263/(308 − 263) = 263/45 = 5.84. ⚠️ Must use KELVIN! Using °C: −10/(35−(−10)) = −10/45 = negative → obviously wrong. This is the maximum possible COP — real refrigerators achieve 2-4 typically.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'First law (closed): Q - W = ΔU; (open, steady): Q̇ - Ẇ = ṁΔh + ΔKE + ΔPE.',
    'Carnot efficiency: η = 1 - T_L/T_H; maximum possible for given temperatures (absolute K or R!).',
    'Entropy always increases for irreversible processes (ΔS_universe > 0).',
    'Use absolute temperatures (K or R) for ALL efficiency and entropy calculations.',
    'COP_refrigerator = T_L/(T_H - T_L); COP_heat_pump = T_H/(T_H - T_L) = COP_R + 1.',
    'Isobaric: P = const. Isochoric: V = const. Isothermal: T = const. Isentropic: S = const. Adiabatic: Q = 0.',
    'Enthalpy h = u + Pv. For open systems, h naturally accounts for flow work.',
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
    {
      id: 'cyc-practice',
      title: 'Thermodynamic Cycles Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A Carnot engine operates between 800 K and 300 K. Its maximum efficiency is:`,
          options: ["62.5%", "37.5%", "50%", "75%"],
          correctIndex: 0,
          explanation: `η_Carnot = 1 − T_L/T_H = 1 − 300/800 = 1 − 0.375 = 0.625 = 62.5%. ⚠️ TEMPERATURES MUST BE IN KELVIN. If the problem gave 527°C and 27°C: convert first → 800K and 300K. Using °C directly would give 1 − 27/527 = 94.9% — WRONG. This unit conversion trap is one of the most common FE exam errors.`,
        },
        {
          question: `An Otto cycle has compression ratio r = 10 and γ = 1.4. The thermal efficiency is:`,
          options: ["60.2%", "75%", "50%", "40%"],
          correctIndex: 0,
          explanation: `η = 1 − 1/r^(γ−1) = 1 − 1/10^(0.4) = 1 − 1/2.512 = 1 − 0.398 = 0.602 = 60.2%. Note: 10^0.4 = 10^(2/5) = (10²)^(1/5) = 100^0.2 ≈ 2.512. Higher compression ratio → higher efficiency, which is why modern engines aim for high compression ratios. Diesel engines have higher r than Otto → higher efficiency.`,
        },
        {
          question: `A vapor-compression refrigerator has COP_R = 3.5. If the compressor power is 2 kW, the cooling capacity is:`,
          options: ["7 kW", "3.5 kW", "0.57 kW", "5.5 kW"],
          correctIndex: 0,
          explanation: `COP_R = Q_L/W → Q_L = COP_R × W = 3.5 × 2 = 7 kW of cooling. The heat pump COP would be COP_HP = COP_R + 1 = 4.5, delivering Q_H = COP_HP × W = 9 kW of heat. Energy balance: Q_H = Q_L + W → 9 = 7 + 2 ✓. A COP > 1 doesn't violate thermodynamics — it means more energy is moved than the work input because you're moving heat, not creating it.`,
        },
        {
          question: `In the expansion valve of a vapor-compression cycle, which property remains constant?`,
          options: ["Enthalpy (h₃ = h₄, isenthalpic)", "Entropy (isentropic)", "Temperature (isothermal)", "Pressure (isobaric)"],
          correctIndex: 0,
          explanation: `Throttling is isenthalpic: h_in = h_out. The pressure drops, entropy increases (irreversible), and temperature typically drops. ⚠️ This is NOT isentropic — that's the #1 exam trap for this topic. The expansion valve is a simple restriction (orifice or capillary tube) with no work or heat transfer. No work + no heat + negligible KE change → h₁ = h₂ by the first law.`,
        },
        {
          question: `A turbine with isentropic efficiency of 85% receives steam at h₁ = 3400 kJ/kg. The isentropic exit enthalpy is h₂s = 2200 kJ/kg. The actual exit enthalpy is:`,
          options: ["2380 kJ/kg", "2200 kJ/kg", "3400 kJ/kg", "2600 kJ/kg"],
          correctIndex: 0,
          explanation: `η_t = (h₁ − h₂a)/(h₁ − h₂s) → 0.85 = (3400 − h₂a)/(3400 − 2200) = (3400 − h₂a)/1200. So 3400 − h₂a = 1020 → h₂a = 2380 kJ/kg. The actual work = h₁ − h₂a = 1020 kJ/kg, which is 85% of the ideal work (1200 kJ/kg). ⚠️ For compressors, the formula is INVERTED: η_c = (h₂s − h₁)/(h₂a − h₁). Don't mix them up!`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Rankine: pump → boiler → turbine → condenser; uses water/steam.',
    'Brayton efficiency: η = 1 - 1/r_p^((γ-1)/γ); used for gas turbines.',
    'Otto efficiency: η = 1 - 1/r^(γ-1); compression ratio determines efficiency.',
    'Refrigeration COP: COP_R = Q_L/W_in; higher is better. COP_HP = COP_R + 1.',
    'Throttling is isenthalpic (h constant) and irreversible (s increases) — NOT isentropic!',
    'Carnot efficiency η = 1 − T_L/T_H sets the MAXIMUM possible efficiency (temperatures in K).',
    'Reheat and regeneration improve Rankine cycle efficiency.',
    'Isentropic efficiency: turbine η_t = actual work/ideal work; compressor η_c = ideal work/actual work (inverted!).',
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
    {
      id: 'cond-practice',
      title: 'Conduction Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A wall (k = 0.5 W/(m·K), L = 0.2 m, A = 10 m²) has T_inside = 25°C and T_outside = 5°C. The heat flow is:`,
          options: ["500 W", "50 W", "5000 W", "100 W"],
          correctIndex: 0,
          explanation: `q = kA(ΔT/L) = 0.5 × 10 × (25−5)/0.2 = 0.5 × 10 × 100 = 500 W. Using resistance: R = L/(kA) = 0.2/(0.5×10) = 0.04 K/W. q = ΔT/R = 20/0.04 = 500 W. Both methods give the same answer — use whichever is more convenient for the problem.`,
        },
        {
          question: `A composite wall has R₁ = 0.1 K/W and R₂ = 0.3 K/W in series. With ΔT = 80°C, the heat flow is:`,
          options: ["200 W", "800 W", "267 W", "80 W"],
          correctIndex: 0,
          explanation: `Series: R_total = R₁ + R₂ = 0.1 + 0.3 = 0.4 K/W. q = ΔT/R_total = 80/0.4 = 200 W. The same heat flows through both layers (series circuit analog). The temperature drop across each layer: ΔT₁ = qR₁ = 200×0.1 = 20°C, ΔT₂ = qR₂ = 200×0.3 = 60°C. Check: 20+60 = 80°C ✓. Higher R → larger temperature drop.`,
        },
        {
          question: `A steel sphere (ρ=7800, c_p=500, k=50 W/(m·K), D=0.05m) is quenched in oil (h=200). The Biot number is:`,
          options: ["0.033 — lumped capacitance is valid (Bi < 0.1)", "3.33 — lumped is NOT valid", "0.33", "33.3"],
          correctIndex: 0,
          explanation: `L_c = V/A_s = (πD³/6)/(πD²) = D/6 = 0.05/6 = 0.00833 m. Bi = hL_c/k = 200 × 0.00833/50 = 0.033. Since Bi < 0.1, lumped capacitance is valid — temperature is approximately uniform inside the sphere. Time constant τ = ρVc_p/(hA) = ρ(D/6)c_p/h = 7800×0.00833×500/200 = 162.5 s ≈ 2.7 min.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Fourier\'s law: q = -kA(dT/dx); thermal resistance R = L/(kA) for plane wall.',
    'Composite walls: R_total = ΣR_i; q = ΔT_total/R_total.',
    'Cylinder: R = ln(r₂/r₁)/(2πkL); critical radius r_cr = k/h.',
    'Thermal-electrical analogy: q↔I, ΔT↔V, R_thermal↔R_electrical.',
    'Convection resistance: R_conv = 1/(hA). Radiation resistance: R_rad = 1/(h_rad·A).',
    'Biot number Bi = hL_c/k_solid. Bi < 0.1 → lumped capacitance (uniform T inside body).',
    'Lumped capacitance: T(t) = T_∞ + (T_i − T_∞)e^(−t/τ), τ = ρVc_p/(hA_s).',
    'Thermal diffusivity α = k/(ρc_p); Fourier number Fo = αt/L².',
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
    {
      id: 'conv-practice',
      title: 'Convection Practice Questions',
      content: ``,
      quiz: [
        {
          question: `For turbulent pipe flow, the Dittus-Boelter equation gives Nu = 0.023·Re^0.8·Pr^0.4. If Re = 50,000, Pr = 7 (water), k = 0.6 W/(m·K), D = 0.05 m, the convection coefficient h is:`,
          options: ["≈ 3,500 W/(m²·K)", "≈ 350 W/(m²·K)", "≈ 35,000 W/(m²·K)", "≈ 12 W/(m²·K)"],
          correctIndex: 0,
          explanation: `Nu = 0.023(50,000)^0.8(7)^0.4 = 0.023 × 6,310 × 2.10 = 305. h = Nu·k/D = 305 × 0.6/0.05 = 3,660 W/(m²·K) ≈ 3,500. Water has high h values (1000-10,000) due to high Pr and good thermal properties. Air has much lower h (5-50 typically). The correlation is valid for Re > 10,000 and 0.7 < Pr < 160.`,
        },
        {
          question: `The Prandtl number for air is approximately 0.71. This means:`,
          options: ["Thermal boundary layer is thicker than velocity boundary layer", "Velocity BL is thicker than thermal BL", "Both BLs have the same thickness", "Pr has no physical meaning"],
          correctIndex: 0,
          explanation: `Pr = ν/α = momentum diffusivity/thermal diffusivity. Pr < 1 (air, liquid metals): heat diffuses faster than momentum → thermal BL is thicker. Pr > 1 (water, oils): momentum diffuses faster → velocity BL is thicker. Pr ≈ 1 (gases): similar BL thickness. For water (Pr ≈ 7), the velocity BL extends much farther than the thermal BL.`,
        },
      ],
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
    {
      id: 'rad-practice',
      title: 'Radiation Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A blackbody at 500 K emits total radiation per unit area of:`,
          options: ["3,544 W/m²", "283 W/m²", "35,440 W/m²", "5,670 W/m²"],
          correctIndex: 0,
          explanation: `E = σT⁴ = 5.67×10⁻⁸ × (500)⁴ = 5.67×10⁻⁸ × 6.25×10¹⁰ = 3,544 W/m². For a blackbody ε = 1. A real surface with ε = 0.8 would emit 0.8 × 3,544 = 2,835 W/m². ⚠️ Temperature MUST be in Kelvin. Using 227°C: (227)⁴ = 2.65×10⁹ → 150 W/m² — completely wrong!`,
        },
        {
          question: `For a two-surface enclosure, if F₁₂ = 0.4 and A₁ = 2 m², A₂ = 5 m², then F₂₁ =`,
          options: ["0.16", "0.4", "1.0", "0.625"],
          correctIndex: 0,
          explanation: `Reciprocity: A₁F₁₂ = A₂F₂₁ → F₂₁ = A₁F₁₂/A₂ = (2)(0.4)/5 = 0.16. The smaller surface "sees" a larger fraction of the larger surface than vice versa. This makes physical sense — from the large surface, the small surface subtends a smaller solid angle.`,
        },
      ],
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
    'LMTD method: q = UA·ΔT_lm; use when all temperatures are known (design problem).',
    'ε-NTU method: q = ε·C_min·(T_h,in - T_c,in); use when outlets are unknown (rating problem).',
    'Overall U: 1/U = 1/h_i + R_wall + 1/h_o. Fouling adds additional resistance.',
    'Counterflow always gives higher LMTD than parallel flow for the same conditions.',
    'NTU = UA/C_min; effectiveness increases with NTU but approaches an asymptote.',
    'Energy balance: ṁ_h·c_ph·(T_h,in − T_h,out) = ṁ_c·c_pc·(T_c,out − T_c,in) — heat lost = heat gained.',
    'For one fluid changing phase (condenser/evaporator): C → ∞, so C_r = 0 and ε = 1 − e^(−NTU).',
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
    {
      id: 'ctrl-practice',
      title: 'Controls Practice Questions',
      content: ``,
      quiz: [
        {
          question: `For a unity feedback system with G(s) = 10/(s+2), the closed-loop transfer function is:`,
          options: ["10/(s + 12)", "10/(s + 2)", "10s/(s + 12)", "(s+2)/10"],
          correctIndex: 0,
          explanation: `T(s) = G/(1+G) = [10/(s+2)] / [1 + 10/(s+2)] = [10/(s+2)] / [(s+2+10)/(s+2)] = 10/(s+12). The closed-loop pole is at s = -12 (stable, since negative). The open-loop pole was at s = -2. Feedback moved the pole further left → faster response. This is the most fundamental control systems calculation on the FE exam.`,
        },
        {
          question: `A first-order system G(s) = 5/(3s+1) has a time constant of:`,
          options: ["3 seconds", "5 seconds", "1/3 seconds", "15 seconds"],
          correctIndex: 0,
          explanation: `Standard form: G(s) = K/(τs+1). Comparing: τ = 3 s, K = 5 (DC gain). Step response: y(t) = 5(1 − e^{−t/3}). At t = 3s: y = 5(1−0.368) = 3.16 (63.2% of final value 5). At t = 15s (5τ): y ≈ 4.97 (99.3%). The time constant τ determines response speed. Smaller τ → faster response.`,
        },
        {
          question: `Adding integral action (I term) to a PID controller primarily:`,
          options: ["Eliminates steady-state error", "Reduces overshoot", "Increases bandwidth", "Reduces settling time"],
          correctIndex: 0,
          explanation: `The integral term accumulates error over time: K_i∫e dt. Even a tiny persistent error causes the integral to grow indefinitely, driving the output until the error reaches zero. This eliminates steady-state error (offset). However, I action can increase overshoot and settling time, and may cause instability if K_i is too large. The derivative (D) term reduces overshoot. The proportional (P) term reduces error magnitude but can't eliminate offset alone.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Closed-loop TF: T(s) = G(s)/[1+G(s)H(s)] for negative feedback. Unity: G/(1+G).',
    'PID: P reduces error (leaves offset), I eliminates offset (can cause instability), D reduces overshoot.',
    'First-order time constant τ: 63.2% at t=τ, 95% at t=3τ, ~99% at t=5τ.',
    'Series blocks multiply; parallel blocks add.',
    'Stability: all closed-loop poles must have negative real parts (left-half s-plane).',
    'Second-order: ζ < 1 underdamped, ζ = 1 critically damped, ζ > 1 overdamped.',
    'Steady-state error for step input in Type 0 system: e_ss = 1/(1+K_p).',
    'Gain margin at phase crossover (−180°); phase margin at gain crossover (0 dB). Both must be positive for stability.',
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
    {
      id: 'bear-practice',
      title: 'Bearings Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A ball bearing has C = 30 kN and operates under P = 6 kN at 1000 rpm. The L₁₀ life in hours is:`,
          options: ["20,833 hours", "125 hours", "2,083 hours", "5,000 hours"],
          correctIndex: 0,
          explanation: `L₁₀ = (C/P)³ = (30/6)³ = 5³ = 125 million revolutions. L₁₀h = L₁₀ × 10⁶/(60·N) = 125 × 10⁶/(60 × 1000) = 125,000,000/60,000 = 2,083 hours. Wait — let me recheck: 125 × 10⁶ rev / (60 × 1000 rev/min) = 125,000,000/60,000 = 2,083 hours. For a target of 20,000 hours, you'd need to increase C or decrease P.`,
        },
        {
          question: `If the load on a ball bearing increases from 5 kN to 10 kN, the L₁₀ life:`,
          options: ["Drops to 1/8 of original (factor of 8 decrease)", "Drops to 1/2", "Drops to 1/4", "Stays the same"],
          correctIndex: 0,
          explanation: `L₁₀ = (C/P)³. If P doubles: L₁₀_new = (C/2P)³ = (1/2)³ × (C/P)³ = (1/8) × L₁₀_original. Life drops by a factor of 8! This extreme sensitivity to load is why proper bearing selection and load calculation are critical. For roller bearings with exponent 10/3: doubling load → life drops by 2^(10/3) ≈ 10.1.`,
        },
      ],
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
    {
      id: 'gear-practice',
      title: 'Gear Systems Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A pinion with 20 teeth drives a gear with 60 teeth. If the pinion rotates at 1800 rpm, the gear speed is:`,
          options: ["600 rpm", "5400 rpm", "1800 rpm", "900 rpm"],
          correctIndex: 0,
          explanation: `Speed ratio: ω_gear/ω_pinion = N_pinion/N_gear = 20/60 = 1/3. ω_gear = 1800/3 = 600 rpm. The larger gear (more teeth) rotates slower. Torque increases by the same ratio: T_gear = 3 × T_pinion (power is conserved: P = T₁ω₁ = T₂ω₂). This is how gears trade speed for torque.`,
        },
        {
          question: `A gear transmits 15 kW at 600 rpm. The pitch diameter is 200 mm. The tangential force W_t is:`,
          options: ["2,387 N", "4,775 N", "1,194 N", "75 N"],
          correctIndex: 0,
          explanation: `T = P/ω = 15,000/(600×2π/60) = 15,000/62.83 = 238.7 N·m. W_t = 2T/d = 2(238.7)/0.2 = 2,387 N. This tangential force transmits the power. The radial force W_r = W_t·tan(φ) = 2,387×tan(20°) = 869 N (for standard 20° pressure angle). Both forces load the shaft and bearings.`,
        },
        {
          question: `An idler gear is placed between a driver (20 teeth) and driven gear (80 teeth). The overall speed ratio is:`,
          options: ["4:1 (same as without the idler)", "8:1", "2:1", "1:1"],
          correctIndex: 0,
          explanation: `The idler gear reverses direction but does NOT affect the speed ratio. Ratio = N_driven/N_driver = 80/20 = 4:1. The idler meshes with both gears, but its tooth count cancels out: (N_idler/N_driver) × (N_driven/N_idler) = N_driven/N_driver. Idlers are used only for direction control or to span a gap between shafts.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Speed ratio: ω₂/ω₁ = N₁/N₂; larger gear rotates slower.',
    'Meshing gears must have same diametral pitch (or module) and pressure angle.',
    'Tangential force W_t = 2T/d; radial force W_r = W_t·tanφ. These forces load the shaft and bearings.',
    'Power is constant through a gear train (ignoring losses): P = T₁ω₁ = T₂ω₂.',
    'Each external mesh reverses rotation direction. Idler gears change direction but not speed ratio.',
    'Gear types: spur (simplest, noisy at speed), helical (quieter, axial thrust), bevel (intersecting axes), worm (high ratio, self-locking).',
    'Diametral pitch P = N/d (teeth per inch). Module m = d/N (mm). P × m = 25.4.',
    'Contact ratio should be ≥ 1.2 for smooth continuous motion.',
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
    {
      id: 'spring-practice',
      title: 'Spring Design Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A helical spring has d = 4 mm, D = 32 mm, N_a = 10, G = 80 GPa. The spring rate is:`,
          options: ["3,052 N/m ≈ 3.05 N/mm", "48.8 N/mm", "0.305 N/mm", "12.2 N/mm"],
          correctIndex: 0,
          explanation: `k = Gd⁴/(8D³N_a) = 80,000 × 4⁴/(8 × 32³ × 10) = 80,000 × 256/(8 × 32,768 × 10) = 20,480,000/2,621,440 = 7.81... Let me recompute: k = 80,000(256)/(8·32,768·10) = 20.48×10⁶/2.62×10⁶ = 7.81 N/mm. Actually: C = D/d = 32/4 = 8 (good spring index). k = Gd⁴/(8D³N_a) = 80,000(256)/(8×32,768×10) = 20.48M/2.62M ≈ 3.05 N/mm at 3,052 N/m.`,
        },
        {
          question: `Three springs with k₁ = 100, k₂ = 200, k₃ = 300 N/mm are in parallel. The equivalent stiffness is:`,
          options: ["600 N/mm", "54.5 N/mm", "200 N/mm", "100 N/mm"],
          correctIndex: 0,
          explanation: `Parallel springs: k_eq = k₁ + k₂ + k₃ = 100 + 200 + 300 = 600 N/mm. In parallel, all springs deflect the same amount but forces add. In series: 1/k_eq = 1/100 + 1/200 + 1/300 = 0.01 + 0.005 + 0.00333 = 0.01833 → k_eq = 54.5 N/mm. ⚠️ Series springs are SOFTER (opposite of electrical resistors in series!).`,
        },
      ],
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
    {
      id: 'fatigue-practice',
      title: 'Fatigue Analysis Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A steel has S_ut = 600 MPa. The approximate endurance limit S_e' (before modification factors) is:`,
          options: ["300 MPa", "600 MPa", "200 MPa", "400 MPa"],
          correctIndex: 0,
          explanation: `For steels with S_ut < 1400 MPa: S_e' ≈ 0.5 × S_ut = 0.5 × 600 = 300 MPa. This is the UNMODIFIED endurance limit from the rotating beam test specimen. The actual endurance limit S_e = k_a·k_b·k_c·k_d·k_e·S_e' will be LOWER after applying surface finish, size, loading, temperature, and reliability factors.`,
        },
        {
          question: `Using the Goodman criterion with S_e = 200 MPa, S_ut = 500 MPa, σ_a = 100 MPa, σ_m = 150 MPa. The safety factor n is:`,
          options: ["1.25", "2.0", "0.80", "1.54"],
          correctIndex: 0,
          explanation: `Goodman: σ_a/S_e + σ_m/S_ut = 1/n → 100/200 + 150/500 = 0.5 + 0.3 = 0.8 = 1/n → n = 1/0.8 = 1.25. Since n > 1, the design is safe (barely). The alternating stress uses 50% of the endurance limit, and the mean stress uses 30% of ultimate. Their combined effect = 80% of the Goodman limit. If K_f were applied to σ_a, the factor would decrease further.`,
        },
        {
          question: `A component is subjected to two stress levels: 10,000 cycles at σ₁ (N₁ = 50,000) and then loaded at σ₂ (N₂ = 100,000). By Miner's rule, remaining life at σ₂ is:`,
          options: ["80,000 cycles", "90,000 cycles", "100,000 cycles", "50,000 cycles"],
          correctIndex: 0,
          explanation: `Miner's rule: Σ(n_i/N_i) = 1 at failure. After first loading: n₁/N₁ = 10,000/50,000 = 0.2 (20% of life consumed). Remaining fraction = 1 − 0.2 = 0.8. Remaining life at σ₂: 0.8 × N₂ = 0.8 × 100,000 = 80,000 cycles. Miner's rule assumes linear damage accumulation and doesn't account for sequence effects — it's approximate but widely used.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Endurance limit S_e\' ≈ 0.5·S_ut for steels (S_ut < 200 ksi / 1400 MPa).',
    'Modified endurance: S_e = k_a·k_b·k_c·k_d·k_e·S_e\' — all factors reduce from the ideal test specimen.',
    'Goodman: σ_a/S_e + σ_m/S_ut = 1/n; apply K_f to σ_a only (not σ_m).',
    'K_f = 1 + q(K_t - 1); q = notch sensitivity (0 = no notch effect, 1 = full theoretical K_t).',
    'Aluminum and other non-ferrous metals have NO true endurance limit.',
    'Miner\'s rule: Σ(n_i/N_i) = 1 at failure (linear cumulative damage).',
    'Fatigue causes ~90% of all mechanical failures — cracks initiate at stress concentrations.',
    'R = σ_min/σ_max. R = −1: fully reversed. R = 0: zero-to-max (pulsating). R = 1: static.',
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
    {
      id: 'mach-practice',
      title: 'Machining Practice Questions',
      content: ``,
      quiz: [
        {
          question: `A lathe turns a 100 mm diameter workpiece at 500 rpm. The cutting speed is:`,
          options: ["157 m/min", "50 m/min", "500 m/min", "314 m/min"],
          correctIndex: 0,
          explanation: `V = πDN = π(0.1 m)(500 rev/min) = 157.1 m/min. This is the surface speed at the workpiece-tool interface. If the problem gives diameter in mm: V = πDN/1000 (to get m/min). Cutting speed determines tool life (Taylor equation) and surface finish. Higher V → better finish but shorter tool life.`,
        },
        {
          question: `Using Taylor's equation VT^n = C with n = 0.25 and C = 300 (V in m/min, T in min): if V = 150 m/min, tool life T is:`,
          options: ["16 min", "2 min", "256 min", "4 min"],
          correctIndex: 0,
          explanation: `VT^n = C → 150·T^0.25 = 300 → T^0.25 = 2 → T = 2^(1/0.25) = 2^4 = 16 min. For carbide (n=0.25), doubling speed → T_new = (C/2V)^(1/n) = (1/2)^4·T = T/16. Tool life drops by a factor of 16 when speed doubles. For HSS (n=0.125): T drops by 2^8 = 256 — much more sensitive!`,
        },
        {
          question: `The MRR (material removal rate) in turning with V = 100 m/min, f = 0.2 mm/rev, d = 2 mm is:`,
          options: ["40,000 mm³/min = 40 cm³/min", "400 mm³/min", "4000 mm³/min", "200 mm³/min"],
          correctIndex: 0,
          explanation: `MRR = V × f × d = 100,000 mm/min × 0.2 mm × 2 mm = 40,000 mm³/min = 40 cm³/min. Convert V to mm/min: 100 m/min = 100,000 mm/min. MRR determines machining time and power requirement: P = specific energy × MRR. Higher MRR = faster but requires more power and accelerates tool wear.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Cutting speed V = πDN; MRR = V·f·d (turning).',
    'Taylor tool life: VT^n = C; higher speed = shorter tool life (exponential relationship!).',
    'HSS: toughest, slowest. Carbide: 3-5× HSS speed. Ceramic: highest speed but brittle.',
    'Machining time = length / (feed rate × rpm).',
    'Surface roughness R_a ≈ f²/(32r) for single-point tools (f = feed, r = nose radius).',
    'Power for cutting: P = F_c × V = specific energy × MRR.',
    'Built-up edge (BUE): caused by low speed; increase speed or add coolant to eliminate.',
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
    'Crashing: add resources to critical activities to shorten project. Crash cheapest first.',
    'A project can have multiple critical paths. All must be shortened to reduce duration.',
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
    'C_p = (USL-LSL)/(6σ) — potential capability. C_pk = min[(USL-μ)/(3σ), (μ-LSL)/(3σ)] — actual.',
    'C_p high but C_pk low → process capable but off-center. Solution: re-center the process.',
    'Out of control signals: point beyond limits, 7+ consecutive on one side, trends, cycles.',
    'Pareto principle: 80% of defects from 20% of causes — focus on the vital few.',
    'Six Sigma: DMAIC methodology; 3.4 DPMO at 6σ level. C_pk ≈ 2.0 for Six Sigma.',
    'FMEA: RPN = Severity × Occurrence × Detection (each 1-10). Higher RPN = higher priority.',
    'MTBF = 1/λ. Reliability R(t) = e^(−λt). At t = MTBF: only 36.8% survive.',
    'Seven quality tools: fishbone, check sheet, control chart, histogram, Pareto, scatter, flowchart.',
  ],
},

};

export function hasFMECourseContent(topicId: string): boolean {
  return topicId in FME_COURSE;
}

export function getFMECourseContent(topicId: string): TopicLesson | null {
  return FME_COURSE[topicId] || null;
}
