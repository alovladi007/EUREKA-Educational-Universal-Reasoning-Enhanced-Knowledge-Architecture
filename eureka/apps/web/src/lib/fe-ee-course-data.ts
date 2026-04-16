/**
 * FE Electrical & Computer Engineering — Course Content
 * 18 topics with detailed study content, key points, and formulas.
 * Every curriculum topic ID has real, substantial content from the source material.
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

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 0 — MATHEMATICS  (9 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_algebra_trig: {
    topicId: 'fee_algebra_trig',
    title: 'Algebra & Trigonometry',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_algebra_trig_main',
      title: 'Algebra & Trigonometry',
      content: `Algebra and trigonometry are fundamental to solving engineering equations. Quadratic equations appear frequently in circuit analysis and control systems. The quadratic formula x = (-b ± √(b²-4ac))/(2a) solves any equation of the form ax²+bx+c=0. Trigonometric identities are crucial for AC circuit analysis where sinusoidal steady-state behavior dominates. Key identities include sin²θ + cos²θ = 1, sin(A±B) = sinA·cosB ± cosA·sinB, and cos(A±B) = cosA·cosB ∓ sinA·sinB. The relationship between rectangular and polar forms — x = r·cosθ, y = r·sinθ — allows conversion between Cartesian and polar coordinates, essential for phasor analysis in AC circuits. On the FE exam, expect problems requiring you to manipulate algebraic expressions, solve systems of linear equations, and convert between trigonometric forms. Memorize the unit circle values for common angles (0°, 30°, 45°, 60°, 90°) as these appear repeatedly in problems.`,
      examTip: 'Key formulas:\nx = (-b ± √(b²-4ac))/(2a)\nsin²θ + cos²θ = 1\nx = r·cosθ\ny = r·sinθ\nr = √(x²+y²)',
    }],
    keyTakeaways: [
      'Quadratic formula solves ax²+bx+c=0; discriminant b²-4ac determines real/complex roots',
      'sin²θ + cos²θ = 1 is the most important trigonometric identity',
      'Rectangular to polar: r = √(x²+y²), θ = arctan(y/x); know how to work in both forms',
      'Unit circle values are worth memorizing for speed on the exam',
    ],
  },

  fee_complex: {
    topicId: 'fee_complex',
    title: 'Complex Numbers',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_complex_main',
      title: 'Complex Numbers',
      content: `Complex numbers are indispensable for AC circuit analysis. A complex number has the form a + jb where a is the real part, b is the imaginary part, and j = √(-1). Euler's formula e^(jθ) = cosθ + j·sinθ is the bridge between rectangular and polar forms. The magnitude of a complex number is |z| = √(a²+b²) and the angle is θ = arctan(b/a), keeping track of the correct quadrant. Complex arithmetic follows standard rules: addition is component-wise, multiplication requires using j² = -1, and division uses conjugate multiplication. The complex conjugate z* = a - jb is essential for impedance calculations and power factor analysis. On the FE exam, you'll frequently convert between rectangular form (R + jX) and polar form (|Z|∠θ) for impedance calculations. Practice with phasor representation of sinusoidal signals: v(t) = Vm·cos(ωt+φ) corresponds to phasor V = Vm∠φ.`,
      examTip: 'Key formulas:\ne^(jθ) = cosθ + j·sinθ\nz = a + jb\n|z| = √(a²+b²)\nθ = arctan(b/a)\nz* = a - jb',
    }],
    keyTakeaways: [
      "Euler's formula: e^(jθ) = cosθ + j·sinθ connects exponential, rectangular, and polar forms",
      'Magnitude |z| = √(a²+b²); angle θ = arctan(b/a) with quadrant consideration',
      'Conjugate multiplication for division: (a+jb)/(c+jd) = [(a+jb)(c-jd)]/[(c+jd)(c-jd)]',
      'Phasor representation simplifies AC circuit analysis; always identify magnitude and phase angle',
    ],
  },

  fee_discrete_math: {
    topicId: 'fee_discrete_math',
    title: 'Discrete Mathematics',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_discrete_math_main',
      title: 'Discrete Mathematics',
      content: `Discrete mathematics deals with countable, distinct structures rather than continuous quantities. Sets, combinatorics, and logic form the backbone of digital systems and computer engineering. A set is a collection of distinct objects; operations include union (A ∪ B), intersection (A ∩ B), complement (A'), and difference (A - B). De Morgan's laws for sets state (A ∪ B)' = A' ∩ B' and (A ∩ B)' = A' ∪ B', directly analogous to Boolean algebra in digital circuits. Combinatorics counts arrangements: permutations P(n,r) = n!/(n-r)! count ordered selections, while combinations C(n,r) = n!/[r!(n-r)!] count unordered selections. The binomial theorem expands (a+b)^n = Σ C(n,k)·a^(n-k)·b^k. Propositional logic uses AND (∧), OR (∨), NOT (¬), implication (→), and biconditional (↔). A truth table exhaustively lists all input combinations and their outputs. Logical equivalences like contrapositive, De Morgan's laws, and distribution simplify complex expressions. Graph theory models networks: vertices (nodes) connected by edges; degree of a vertex counts incident edges. Euler's formula for planar graphs V - E + F = 2 relates vertices, edges, and faces. On the FE exam, expect problems on counting (permutations/combinations), set operations, Boolean logic, and basic graph properties. These concepts underpin digital systems, probability, and algorithm analysis.`,
      examTip: 'Key formulas:\nP(n,r) = n!/(n-r)!\nC(n,r) = n!/[r!(n-r)!]\nDe Morgan: (A ∪ B)\' = A\' ∩ B\'\n(A ∩ B)\' = A\' ∪ B\'',
    }],
    keyTakeaways: [
      'Permutations P(n,r) count ordered arrangements; combinations C(n,r) count unordered selections',
      "De Morgan's laws for sets mirror Boolean algebra: (A ∪ B)' = A' ∩ B'",
      'Truth tables verify logical equivalences; contrapositive of p→q is ¬q→¬p (logically equivalent)',
      'Binomial theorem: (a+b)^n = Σ C(n,k)·a^(n-k)·b^k is useful in probability and series expansion',
    ],
  },

  fee_analytic_geom: {
    topicId: 'fee_analytic_geom',
    title: 'Analytic Geometry',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_analytic_geom_main',
      title: 'Analytic Geometry',
      content: `Analytic geometry combines algebra and geometry to study curves, surfaces, and spatial relationships using coordinate systems. The distance between two points (x₁,y₁) and (x₂,y₂) is d = √[(x₂-x₁)² + (y₂-y₁)²]. The midpoint is ((x₁+x₂)/2, (y₁+y₂)/2). A line has slope m = (y₂-y₁)/(x₂-x₁) with point-slope form y - y₁ = m(x - x₁) and slope-intercept form y = mx + b. Two lines are parallel if slopes are equal (m₁ = m₂), perpendicular if m₁·m₂ = -1. Conic sections arise from slicing a cone: circle x² + y² = r², ellipse x²/a² + y²/b² = 1, parabola y = ax² + bx + c, and hyperbola x²/a² - y²/b² = 1. Each has characteristic properties: the circle has constant radius, the ellipse has two foci where the sum of distances to any point on the curve is constant, the parabola has a single focus and directrix, and the hyperbola has two branches with the difference of distances to foci being constant. In three dimensions, the distance formula extends to d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]. Plane equations have the form ax + by + cz = d, where (a,b,c) is the normal vector. Polar coordinates (r,θ) relate to Cartesian via x = r·cosθ, y = r·sinθ. Cylindrical coordinates (r,θ,z) and spherical coordinates (r,θ,φ) are used in electromagnetics for symmetry exploitation. On the FE exam, expect problems on distances, slopes, conic sections, and coordinate transformations — particularly polar-to-rectangular conversions needed for phasor analysis.`,
      examTip: 'Key formulas:\nd = √[(x₂-x₁)² + (y₂-y₁)²]\ny - y₁ = m(x - x₁)\nCircle: x² + y² = r²\nEllipse: x²/a² + y²/b² = 1',
    }],
    keyTakeaways: [
      'Distance formula d = √[(Δx)² + (Δy)²]; extends to 3D with (Δz)² term',
      'Parallel lines have equal slopes; perpendicular lines satisfy m₁·m₂ = -1',
      'Conic sections (circle, ellipse, parabola, hyperbola) each have characteristic geometric properties',
      'Polar/cylindrical/spherical coordinates exploit symmetry in EM problems; know conversion formulas',
    ],
  },

  fee_diff_calc: {
    topicId: 'fee_diff_calc',
    title: 'Differential Calculus',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_diff_calc_main',
      title: 'Differential Calculus',
      content: `Calculus is essential for understanding rates of change in electrical systems. Differentiation measures how quantities change with respect to variables — in circuit analysis, dv/dt represents voltage change rate, which relates to capacitor and inductor behavior. Key derivatives include d/dx(x^n) = n·x^(n-1), d/dx(e^x) = e^x, d/dx(ln(x)) = 1/x, d/dx(sin(x)) = cos(x), and d/dx(cos(x)) = -sin(x). The product rule (uv)' = u'v + uv' and chain rule dy/dx = (dy/du)(du/dx) are frequently needed for complex expressions. Limits are foundational: lim(x→a) f(x) defines continuity and derivatives. L'Hopital's rule resolves indeterminate forms (0/0 or ∞/∞) by differentiating numerator and denominator. Partial derivatives extend differentiation to multivariable functions: ∂f/∂x treats other variables as constants. The gradient ∇f = (∂f/∂x)i + (∂f/∂y)j + (∂f/∂z)k gives the direction of steepest increase. Taylor series f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ... approximates functions near a point; linearization uses just the first two terms. On the FE exam, you'll use derivatives to find maxima/minima (set f'(x) = 0, check f''(x) sign), compute rates of change in circuit quantities like i_C = C·dv_C/dt and v_L = L·di_L/dt, and approximate functions via Taylor series.`,
      examTip: 'Key formulas:\nd/dx(x^n) = n·x^(n-1)\nd/dx(e^x) = e^x\nd/dx(sin(x)) = cos(x)\nProduct rule: (uv)\' = u\'v + uv\'\nChain rule: dy/dx = (dy/du)(du/dx)',
    }],
    keyTakeaways: [
      'Derivative df/dx represents instantaneous rate of change; essential for inductor (L·di/dt) and capacitor (C·dv/dt)',
      "Product rule: (uv)' = u'v + uv'; chain rule: dy/dx = (dy/du)·(du/dx)",
      "L'Hopital's rule resolves 0/0 or ∞/∞ by differentiating top and bottom",
      'Taylor series linearization f(x) ≈ f(a) + f\'(a)(x-a) approximates near a point',
    ],
  },

  fee_int_calc: {
    topicId: 'fee_int_calc',
    title: 'Integral Calculus',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_int_calc_main',
      title: 'Integral Calculus',
      content: `Integration is the reverse process of differentiation and computes accumulated quantities. Fundamental integrals: ∫x^n dx = x^(n+1)/(n+1) + C (n ≠ -1), ∫e^x dx = e^x + C, ∫1/x dx = ln|x| + C, ∫sin(x) dx = -cos(x) + C, ∫cos(x) dx = sin(x) + C. Integration by parts: ∫u dv = uv - ∫v du is useful for products of polynomials and exponentials or trigonometric functions. Integration by substitution (u-substitution) simplifies integrands by changing variables. The Fundamental Theorem of Calculus connects differentiation and integration: d/dx[∫ₐˣ f(t)dt] = f(x), and ∫ₐᵇ f(x)dx = F(b) - F(a) where F is any antiderivative of f. Definite integrals compute areas, volumes, and accumulated quantities. In electrical engineering, integration finds energy stored in capacitors W = ∫₀ᵛ Cv dv = ½CV² and inductors W = ∫₀ⁱ Li di = ½LI², total charge Q = ∫I dt, and average power P_avg = (1/T)∫₀ᵀ p(t)dt over one period. Improper integrals (infinite limits) appear in Laplace and Fourier transforms: F(s) = ∫₀^∞ f(t)e^(-st) dt. Multiple integrals (double, triple) compute volumes and surface integrals in electromagnetics. On the FE exam, you'll evaluate definite and indefinite integrals, apply integration to find energy and charge in circuits, and use integral formulas from reference tables efficiently.`,
      examTip: 'Key formulas:\n∫x^n dx = x^(n+1)/(n+1) + C\n∫e^x dx = e^x + C\n∫u dv = uv - ∫v du\nW = ½CV²\nW = ½LI²',
    }],
    keyTakeaways: [
      'Common integrals: ∫x^n dx = x^(n+1)/(n+1) + C, ∫e^x dx = e^x + C',
      'Integration by parts: ∫u dv = uv - ∫v du is useful for products of polynomials and exponentials',
      'Definite integrals compute energy in capacitors (½CV²) and inductors (½LI²)',
      'Average power P_avg = (1/T)∫p(t)dt; Laplace transform uses improper integral ∫₀^∞ f(t)e^(-st)dt',
    ],
  },

  fee_diffeq: {
    topicId: 'fee_diffeq',
    title: 'Differential Equations',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_diffeq_main',
      title: 'Differential Equations',
      content: `Differential equations model dynamic behavior in electrical systems — circuit transients, control system responses, and signal processing all rely on differential equation solutions. A first-order linear ODE has the form dy/dt + P(t)·y = Q(t). For constant coefficients, dy/dt + ay = b with initial condition y(0) = y₀, the solution is y(t) = b/a + (y₀ - b/a)·e^(-at). This describes RC and RL circuit charging/discharging. A second-order linear ODE is d²y/dt² + 2ζωₙ·dy/dt + ωₙ²·y = ωₙ²·u(t), which describes RLC circuits and control systems. The solution depends on the damping ratio ζ: underdamped (ζ < 1) oscillates, critically damped (ζ = 1) returns fastest without overshoot, and overdamped (ζ > 1) decays slowly. On the FE exam, you'll solve first-order transient equations for RC/RL circuits and identify second-order system characteristics. The Laplace transform converts differential equations to algebraic equations — a major time-saver during the exam.`,
      examTip: 'Key formulas:\ndy/dt + ay = b → y(t) = b/a + (y₀ - b/a)·e^(-at)\nτ = RC (capacitor)\nτ = L/R (inductor)',
    }],
    keyTakeaways: [
      'First-order response: y(t) = steady-state + (initial_value - steady-state)·e^(-t/τ) where τ is time constant',
      'Time constant τ = RC for capacitors, τ = L/R for inductors; represents 63% change from initial to steady-state',
      'Damping ratio ζ = c/(2√(km)) determines underdamped (oscillatory) vs overdamped (smooth) response',
      'Use Laplace transforms to convert ODEs to algebraic equations; solve, then inverse transform back to time domain',
    ],
  },

  fee_linear_algebra: {
    topicId: 'fee_linear_algebra',
    title: 'Linear Algebra & Matrix Operations',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_linear_algebra_main',
      title: 'Linear Algebra & Matrix Operations',
      content: `Linear algebra provides tools for solving systems of equations and analyzing circuits with multiple nodes/loops. A system of linear equations can be written as Ax = b where A is the coefficient matrix, x is the unknown vector, and b is the constant vector. Matrix operations follow specific rules: addition is element-wise, multiplication is row-by-column (AB ≠ BA in general), and the inverse A⁻¹ satisfies A·A⁻¹ = I (identity matrix). Determinants and Cramer's rule provide solutions: for 2×2 matrices, det(A) = ad - bc. Eigenvalues and eigenvectors satisfy Ax = λx, where λ is the eigenvalue and x is the eigenvector; these are crucial for stability analysis in control systems. On the FE exam, you might solve nodal equations (KCL applied at each node) or mesh equations (KVL applied to each loop) using matrix methods. Gaussian elimination is faster than hand-calculating inverses for large systems. Understand that eigenvalues with negative real parts ensure system stability.`,
      examTip: 'Key formulas:\ndet([a b; c d]) = ad - bc\nAx = b → x = A⁻¹b\nAx = λx (eigenvalue equation)',
    }],
    keyTakeaways: [
      'Matrix form Ax = b solves n linear equations with n unknowns; use Gaussian elimination or matrix inversion',
      'Determinant for 2×2: det([a b; c d]) = ad - bc; non-zero determinant means matrix is invertible',
      'Eigenvalue equation Ax = λx; for control systems, all eigenvalues must have negative real parts for stability',
      'Matrix multiplication: (AB)ij = Σk Aik·Bkj; associative but not commutative',
    ],
  },

  fee_vector_analysis: {
    topicId: 'fee_vector_analysis',
    title: 'Vector Analysis & Laplace Transform',
    domainWeight: 'Mathematics · 7–11%',
    overview: 'Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra — the essential tools for solving complex engineering problems.',
    sections: [{
      id: 'fee_vector_analysis_main',
      title: 'Vector Analysis & Laplace Transform',
      content: `The Laplace transform converts time-domain functions into frequency-domain functions, simplifying differential equation solving. The definition is F(s) = ∫₀^∞ f(t)·e^(-st) dt where s = σ + jω. Key transform pairs: L{1} = 1/s, L{t} = 1/s², L{e^(-at)} = 1/(s+a), L{sin(ωt)} = ω/(s²+ω²), L{cos(ωt)} = s/(s²+ω²). The final value theorem states lim(t→∞) f(t) = lim(s→0) s·F(s), allowing you to find steady-state values without inverting the entire transform. Vector analysis involves gradient (∇f = ∂f/∂x i + ∂f/∂y j + ∂f/∂z k), divergence (∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z), curl (∇×F), and the dot/cross product. On the FE exam, Laplace transforms appear in control systems and circuit analysis. Vector operations appear in electromagnetics problems involving electric/magnetic fields.`,
      examTip: 'Key formulas:\nF(s) = ∫₀^∞ f(t)·e^(-st) dt\nL{sin(ωt)} = ω/(s²+ω²)\nL{cos(ωt)} = s/(s²+ω²)\n∇f = ∂f/∂x i + ∂f/∂y j',
    }],
    keyTakeaways: [
      'Laplace transform converts differential equations to algebraic equations in s-domain; final value theorem avoids inverse transform',
      "Key pairs: L{t^n} = n!/s^(n+1), L{e^(-at)·f(t)} = F(s+a), L{f'(t)} = s·F(s) - f(0)",
      'Gradient ∇f gives direction of steepest increase; divergence ∇·F measures outflow; curl ∇×F measures rotation',
      'Dot product A·B = |A||B|cosθ (scalar); cross product |A×B| = |A||B|sinθ (vector perpendicular to both)',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 1 — PROBABILITY AND STATISTICS  (4 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_prob_dist: {
    topicId: 'fee_prob_dist',
    title: 'Probability Distributions',
    domainWeight: 'Probability and Statistics · 4–6%',
    overview: 'Probability and statistics enable engineers to make decisions under uncertainty, analyze measurement data, and design robust systems. This topic covers probability distributions, statistical measures, hypothesis testing, and regression.',
    sections: [{
      id: 'fee_prob_dist_main',
      title: 'Probability Fundamentals & Distributions',
      content: `Probability quantifies the likelihood of events. Basic rules: P(A) ranges from 0 to 1, P(A ∪ B) = P(A) + P(B) - P(A ∩ B) (union), P(A ∩ B) = P(A)·P(B|A) (intersection/conditional). Bayes' theorem P(A|B) = P(B|A)·P(A)/P(B) is fundamental for updating probabilities with new information. Common distributions include the binomial (n trials, each with probability p of success): P(X=k) = C(n,k)·p^k·(1-p)^(n-k), the Poisson (rare events with rate λ): P(X=k) = (λ^k·e^(-λ))/k!, and the normal distribution with PDF f(x) = (1/(σ√(2π)))·e^(-(x-μ)²/(2σ²)). The standard normal uses Z = (X-μ)/σ and is tabulated for quick lookup. On the FE exam, you'll identify which distribution fits a scenario, calculate probabilities, and use the cumulative distribution function (CDF) for ranges. The exponential distribution f(t) = λ·e^(-λt) models failure rates and waiting times in reliability analysis.`,
      examTip: 'Key formulas:\nP(A ∪ B) = P(A) + P(B) - P(A ∩ B)\nBayes: P(A|B) = P(B|A)·P(A)/P(B)\nBinomial: P(X=k) = C(n,k)·p^k·(1-p)^(n-k)\nNormal: Z = (X-μ)/σ',
    }],
    keyTakeaways: [
      "Bayes' theorem: P(A|B) = P(B|A)·P(A)/P(B); use when you want posterior probability given evidence",
      'Binomial: discrete, n trials, fixed p; use for pass/fail scenarios',
      'Poisson: rare events with rate λ; approximates binomial when n is large and p is small',
      'Normal distribution: symmetric, defined by mean μ and std dev σ; use standard normal tables for Z = (X-μ)/σ',
      'Exponential: models time between events; memoryless property P(T > t+s | T > s) = P(T > t)',
    ],
  },

  fee_expected_values: {
    topicId: 'fee_expected_values',
    title: 'Expected Values & Statistical Measures',
    domainWeight: 'Probability and Statistics · 4–6%',
    overview: 'Probability and statistics enable engineers to make decisions under uncertainty, analyze measurement data, and design robust systems.',
    sections: [{
      id: 'fee_expected_values_main',
      title: 'Expected Values & Statistical Measures',
      content: `Statistical measures summarize data: the mean (average) is μ = ΣX/n, the variance measures spread around the mean σ² = Σ(X-μ)²/n, and standard deviation σ = √(σ²). The median divides data in half and is robust to outliers. Expected value E[X] = Σ x·P(x) for discrete variables or ∫x·f(x)dx for continuous. Variance Var(X) = E[X²] - (E[X])². For combinations: E[aX+bY] = aE[X]+bE[Y] always; Var(aX+bY) = a²Var(X)+b²Var(Y) if X,Y independent. Covariance measures how two variables move together: Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)], and correlation coefficient r = Cov(X,Y)/(σₓ·σᵧ) ranges from -1 (perfect negative) to +1 (perfect positive). For specific distributions: binomial has E[X] = np, Var(X) = np(1-p); Poisson has E[X] = Var(X) = λ; normal is fully defined by μ and σ. The law of large numbers states that sample mean converges to population mean as sample size increases. The central limit theorem says the distribution of sample means approaches normal regardless of population distribution as n→∞. On the FE exam, you'll compute expected values, variances, and correlations from datasets, and apply the properties of linearity of expectation.`,
      examTip: 'Key formulas:\nμ = ΣX/n\nσ² = Σ(X-μ)²/n\nE[aX+bY] = aE[X]+bE[Y]\nVar(X) = E[X²] - (E[X])²',
    }],
    keyTakeaways: [
      'Mean μ = ΣX/n; variance σ² = Σ(X-μ)²/n; std dev σ = √(σ²)',
      'Expected value is linear: E[aX+bY] = aE[X]+bE[Y]; variance adds only for independent variables',
      'Binomial: E[X] = np, Var = np(1-p); Poisson: E[X] = Var = λ',
      'Central limit theorem: sample means → normal distribution as n→∞, enabling confidence intervals',
    ],
  },

  fee_regression: {
    topicId: 'fee_regression',
    title: 'Regression & Curve Fitting',
    domainWeight: 'Probability and Statistics · 4–6%',
    overview: 'Probability and statistics enable engineers to make decisions under uncertainty, analyze measurement data, and design robust systems.',
    sections: [{
      id: 'fee_regression_main',
      title: 'Regression & Curve Fitting',
      content: `Linear regression fits a line y = a + bx to data: the slope b = r·(σᵧ/σₓ) and intercept a = μᵧ - b·μₓ. The coefficient of determination R² = r² shows how much variance in y is explained by x (0 ≤ R² ≤ 1). Correlation coefficient r = Cov(X,Y)/(σₓ·σᵧ) ranges from -1 (perfect negative) to +1 (perfect positive). The least squares method minimizes the sum of squared residuals Σ(yi - ŷi)² to find the best-fit parameters. For polynomial regression y = a₀ + a₁x + a₂x² + ..., more parameters capture curvature but risk overfitting. The residual is the difference between observed and predicted values; normally distributed residuals with constant variance indicate a good fit. Multiple regression extends to y = b₀ + b₁x₁ + b₂x₂ + ... for multiple predictors. On the FE exam, you'll calculate regression coefficients from datasets, interpret correlation, and predict values using regression. Understand that correlation does not imply causation. Confidence intervals quantify uncertainty: for a normal distribution, the 95% CI is approximately μ ± 1.96σ.`,
      examTip: 'Key formulas:\nb = r·(σᵧ/σₓ)\na = μᵧ - b·μₓ\nR² = r²\nr = Cov(X,Y)/(σₓ·σᵧ)',
    }],
    keyTakeaways: [
      'Regression line y = a + bx where b = r·σᵧ/σₓ and a = μᵧ - b·μₓ',
      'R² = r²; shows fraction of variance in y explained by x; closer to 1 is better fit',
      'Correlation coefficient r ∈ [-1, +1]; r=0 means no linear relationship; r=±1 means perfect linear fit',
      '95% confidence interval ≈ μ ± 1.96σ for normal distribution',
    ],
  },

  fee_hypothesis: {
    topicId: 'fee_hypothesis',
    title: 'Hypothesis Testing',
    domainWeight: 'Probability and Statistics · 4–6%',
    overview: 'Probability and statistics enable engineers to make decisions under uncertainty, analyze measurement data, and design robust systems.',
    sections: [{
      id: 'fee_hypothesis_main',
      title: 'Hypothesis Testing & Confidence Intervals',
      content: `Hypothesis testing determines whether data supports a claim (null hypothesis H₀) or suggests an alternative (H₁). The process: state H₀ and H₁, choose a significance level α (typically 0.05), calculate a test statistic, find the p-value, and reject H₀ if p < α. A Type I error (false positive) rejects a true H₀ with probability α; a Type II error (false negative) fails to reject false H₀ with probability β. The t-test compares sample mean to a known value or between two samples: t = (x̄ - μ₀)/(s/√n) where s is sample standard deviation. The chi-square test examines categorical data: χ² = Σ(O-E)²/E where O is observed and E is expected frequency. Confidence intervals estimate population parameters: the 100(1-α)% CI for a mean is x̄ ± t(α/2,n-1)·s/√n, where the t-value comes from t-tables. On the FE exam, you'll interpret p-values, construct CIs, and identify appropriate tests. Remember that a 95% CI does NOT mean a 95% probability the parameter is in the interval — rather, 95% of such CIs constructed from repeated sampling would contain the true parameter.`,
      examTip: 'Key formulas:\nt = (x̄ - μ₀)/(s/√n)\nχ² = Σ(O-E)²/E\nCI: x̄ ± t(α/2,n-1)·s/√n\nStandard error: SE = s/√n',
    }],
    keyTakeaways: [
      'H₀ is the null hypothesis (no effect); H₁ is the alternative hypothesis; reject H₀ if p-value < α',
      'Type I error: reject true H₀ (probability α); Type II error: fail to reject false H₀ (probability β)',
      't-test: t = (x̄ - μ₀)/(s/√n) compares sample mean to reference; use t-table for critical value',
      'Chi-square test: χ² = Σ(O-E)²/E tests categorical/goodness-of-fit; compare to chi-square table',
      'Confidence interval: x̄ ± t·s/√n gives range around sample mean with specified confidence level',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 2 — ETHICS AND PROFESSIONAL PRACTICE  (3 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_codes_ethics: {
    topicId: 'fee_codes_ethics',
    title: 'NCEES Model Rules & NSPE Code of Ethics',
    domainWeight: 'Ethics and Professional Practice · 3–5%',
    overview: 'Ethics and professional practice ensure engineers maintain integrity, prioritize public welfare, and act responsibly. The FE exam tests knowledge of the NCEES Model Rules and NSPE Code of Ethics through scenario-based questions.',
    sections: [{
      id: 'fee_codes_ethics_main',
      title: 'NCEES Model Rules & NSPE Code of Ethics',
      content: `The NCEES Model Rules and NSPE Code of Ethics establish the fundamental obligations of professional engineers. These codes prioritize public safety, health, and welfare above all other considerations — a principle that must guide every engineering decision. Engineers must maintain competence in their field, disclose conflicts of interest transparently, and refuse assignments outside their expertise. The codes explicitly address whistle-blowing, protecting engineers who report safety violations or unethical conduct from retaliation. Conflicts of interest arise when personal gain might compromise professional judgment; engineers must disclose these openly to clients and employers. When a project conflicts with public safety, the engineer's primary obligation is to the public, even if this creates professional difficulties. Real exam scenarios often present dilemmas where profit, schedule, or client pressure conflicts with safety — the correct answer always prioritizes public welfare.

Conflicts of interest extend beyond direct financial compensation to include family relationships, prior business dealings, and competing clients. An engineer must not accept work where they cannot maintain objectivity or where a family member might benefit unfairly. Whistle-blowing protection acknowledges that engineers may need to report illegal or dangerous practices to authorities or the public; the codes protect them from dismissal or retaliation for such reports. However, engineers should typically work through proper channels first before going public. The codes also address professional competence: accepting work beyond one's knowledge is unethical, even if financially attractive. Continuing professional development is not just encouraged but ethically required to maintain current knowledge in a rapidly evolving field.`,
    }],
    keyTakeaways: [
      'Public safety and welfare are always the highest priority, superseding profit and client preferences',
      'Engineers must disclose conflicts of interest and refuse assignments outside their expertise',
      'Whistle-blowing is protected; reporting safety violations or illegal conduct is ethical and legally protected',
      'Continuing education and maintaining professional competence are ethical obligations, not optional',
    ],
  },

  fee_licensure: {
    topicId: 'fee_licensure',
    title: 'Professional Licensure & FE Exam Role',
    domainWeight: 'Ethics and Professional Practice · 3–5%',
    overview: 'Ethics and professional practice ensure engineers maintain integrity, prioritize public welfare, and act responsibly.',
    sections: [{
      id: 'fee_licensure_main',
      title: 'Professional Licensure & FE Exam Role',
      content: `The Professional Engineering (PE) license represents a commitment to public protection through demonstrated competence and adherence to ethical standards. The FE (Fundamentals of Engineering) exam is the first step in licensure, typically completed early in an engineer's career. After passing the FE exam and gaining required work experience (typically 4 years under a PE), engineers become eligible to take the PE exam. Different states have slightly different requirements, but all require FE passage as a prerequisite. Comity refers to the reciprocal recognition of PE licenses across state boundaries; an engineer licensed in one state can often become licensed in another without retesting, though some states may require additional forms or documentation. The FE exam itself is not a PE license but rather proof of fundamental competence in engineering principles. Many employers and positions now require FE passage even for positions that don't require PE licensure, making it a critical career credential.

Continuing education (CE) requirements vary by state and jurisdiction but are essential for maintaining a PE license. Most states require 15-36 professional development hours annually, ensuring engineers remain current with evolving codes, technologies, and best practices. Failure to meet CE requirements can result in license suspension or revocation. The FE exam covers breadth across many engineering disciplines, preparing engineers for entry-level practice and future specialization. Understanding the role of the FE exam — as a qualification check, not a license itself — helps explain why exam breadth covers so many topics.`,
    }],
    keyTakeaways: [
      'FE exam passage is prerequisite for PE licensure but is not itself a PE license; a PE license requires additional work experience and examination',
      'Comity allows PE licensure reciprocity across states with generally minimal additional requirements',
      'Continuing education requirements (typically 15-36 hours annually) are mandatory for maintaining PE licensure',
      'State boards of engineering may have specific rules; always verify with your state board',
    ],
  },

  fee_liability: {
    topicId: 'fee_liability',
    title: 'Ethical Decision Making & Public Welfare Priority',
    domainWeight: 'Ethics and Professional Practice · 3–5%',
    overview: 'Ethics and professional practice ensure engineers maintain integrity, prioritize public welfare, and act responsibly.',
    sections: [{
      id: 'fee_liability_main',
      title: 'Ethical Decision Making & Public Welfare Priority',
      content: `Ethical decision-making in engineering requires systematic frameworks that balance competing interests while maintaining public safety as the paramount concern. When facing an ethical dilemma, engineers should first identify stakeholders (public, client, employer, colleagues, environment), then evaluate options against professional codes and legal requirements. The framework typically involves: (1) understanding the facts completely, (2) identifying the ethical issue and relevant principles, (3) considering alternatives without eliminating options prematurely, and (4) deciding based on code provisions and public welfare priority. Many exam questions present scenarios with incomplete information — the ethical approach requires seeking clarification before proceeding, not making assumptions. When public safety directly conflicts with client wishes or profit margins, engineers must prioritize safety even at personal professional cost.

Common ethical dilemmas in engineering practice include: cost-cutting that compromises quality, pressure to deliver unsafe designs, misrepresentation of qualifications, and conflicts between accurate reporting and job security. In each case, the professional codes provide guidance: never compromise safety, maintain honesty in communications, and act in the public interest. Documentation is critical — maintain records of your concerns, recommendations, and actions to protect yourself professionally. Professional liability arises when an engineer's work causes harm; the PE stamp on documents certifies personal responsibility. Liability insurance protects against claims but does not excuse negligent practice. Engineers who discover defects in delivered work must disclose and correct them. Recognize that ethical practice sometimes costs money or career advancement in the short term, but protects your professional reputation and the public long-term.`,
    }],
    keyTakeaways: [
      'Systematic frameworks for ethical decisions: identify stakeholders, understand facts, evaluate against codes, prioritize public welfare',
      'Public safety always supersedes profit, schedule, and client preferences — this is not negotiable',
      'When conflicts arise, use proper escalation channels before external reporting, unless public safety is imminent',
      'Maintain documentation of ethical concerns and your recommendations to establish a clear professional record',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 3 — ENGINEERING ECONOMICS  (3 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_tvm: {
    topicId: 'fee_tvm',
    title: 'Time Value of Money & Financial Factors',
    domainWeight: 'Engineering Economics · 3–5%',
    overview: 'Engineering economics evaluates project costs and benefits, comparing alternatives and justifying investments. The FE exam tests time value of money, present/future value calculations, rate of return analysis, benefit-cost ratios, and depreciation.',
    sections: [{
      id: 'fee_tvm_main',
      title: 'Time Value of Money & Financial Factors',
      content: `The time value of money (TVM) principle states that a dollar today is worth more than a dollar in the future due to earning potential and inflation. This fundamental concept underlies all engineering economic analysis. The six standard cash flow factors enable conversion between different payment patterns and time points. Present Worth (PW) converts all future cash flows to today's value using the discount rate (interest rate). Future Worth (FW) converts cash flows to a single future time point. Annual Worth (AW) calculates equivalent uniform annual payments representing the same economic value. The factors use the interest rate i and number of periods n: F/P (future given present) multiplies present by (1+i)^n; P/F is the reciprocal. P/A (present worth of annuity) and A/P (annuity given present) convert between lump sums and uniform annual payments. A/F (annuity given future sum) and F/A (future worth of annuity) work with future values.

Exam problems require identifying the correct factor and applying it accurately. For example, if you save $1000 annually for 10 years at 5% interest, use F/A to find the future worth: FW = $1000 x [(1.05)^10 - 1]/0.05. Present worth analysis is most common in engineering: compare projects by computing PW of all costs and benefits; the project with highest PW is best. When comparing projects of different lengths, annualized cost or a common study period equalizes comparison. Discount rate selection is critical — typically the company's minimum acceptable rate of return (MARR) or the cost of capital. Nominal interest rate r (compounded m times per year) converts to effective annual rate (EAR) = (1 + r/m)^m - 1. Continuous compounding uses F = P·e^(rt).`,
      examTip: 'Key formulas:\nF = P(1+i)^n\nP = F/(1+i)^n\n(P/A, i, n) = [(1+i)^n - 1]/[i(1+i)^n]\nEAR = (1 + r/m)^m - 1',
    }],
    keyTakeaways: [
      'Six standard factors convert between present, future, and annual values; understand their relationships',
      'Present worth (PW) is the most common analysis method: positive PW means the investment is justified',
      'Annual worth (AW) is useful for comparing projects of different lengths',
      'Discount rate (MARR) selection significantly impacts results; typically use company cost of capital',
    ],
  },

  fee_cost_analysis: {
    topicId: 'fee_cost_analysis',
    title: 'Cost Analysis, NPV, IRR & Decision Making',
    domainWeight: 'Engineering Economics · 3–5%',
    overview: 'Engineering economics evaluates project costs and benefits, comparing alternatives and justifying investments.',
    sections: [{
      id: 'fee_cost_analysis_main',
      title: 'Rate of Return & Investment Decision Making',
      content: `Internal Rate of Return (IRR) is the discount rate that makes present worth equal zero; equivalently, it's the rate at which an investment breaks even. Projects with IRR exceeding the MARR are economically justified. IRR is calculated by solving PW(i) = 0, which typically requires iteration or financial calculators since it's a polynomial equation. Net Present Value (NPV) calculates the absolute value added: NPV = sum of all PW(benefits) - PW(costs). Positive NPV means the project is worth undertaking. Unlike IRR, NPV is directly comparable across different project sizes.

Benefit-Cost Ratio (B/C) divides present worth of benefits by present worth of costs; ratios greater than 1.0 indicate justified investments. This method is popular in public sector projects where benefits and costs are distinct. Incremental analysis compares two projects by evaluating the difference between them; if Project A has higher IRR but Project B has higher NPV, incremental analysis resolves the apparent contradiction. Breakeven analysis finds the value (price, volume, interest rate) where profit equals zero or two alternatives have equal cost. Decision rules: use NPV when comparing projects of different sizes or life spans; use IRR when comparing similar projects; use B/C for public sector analysis.`,
      examTip: 'Key formulas:\nNPV = Σ CF_t / (1+i)^t\nIRR: solve PW(i) = 0\nB/C = PW(Benefits) / PW(Costs)\nAW = NPV x (A/P, i, n)',
    }],
    keyTakeaways: [
      'IRR is the break-even discount rate (where NPV = 0); projects are justified if IRR > MARR',
      'NPV directly measures value added in dollars; positive NPV indicates a justified investment',
      'Benefit-Cost Ratio (B/C > 1) justifies projects and is standard in public sector analysis',
      'Breakeven analysis finds critical values where projects transition from profitable to unprofitable',
    ],
  },

  fee_depreciation: {
    topicId: 'fee_depreciation',
    title: 'Depreciation Methods & Book Value',
    domainWeight: 'Engineering Economics · 3–5%',
    overview: 'Engineering economics evaluates project costs and benefits, comparing alternatives and justifying investments.',
    sections: [{
      id: 'fee_depreciation_main',
      title: 'Depreciation Methods & Book Value',
      content: `Depreciation is the systematic allocation of an asset's cost over its useful life, important for tax calculations and financial reporting. Straight-line depreciation divides the total depreciable base (cost minus salvage value) evenly across the useful life: Annual Depreciation = (Cost - Salvage Value) / Useful Life. Book value (BV) is the asset's value on the balance sheet: BV = Original Cost - Accumulated Depreciation. Book value decreases linearly with straight-line depreciation.

MACRS (Modified Accelerated Cost Recovery System) is the U.S. tax depreciation method, which allows faster write-offs than straight-line, reducing early-year taxes. MACRS ignores salvage value and uses predetermined recovery periods (e.g., 5-year, 7-year, 39-year property) with accelerated schedules. The advantage of accelerated depreciation is time value of money: deducting costs earlier reduces taxes earlier, improving cash flow. Sum-of-years-digits (SYD) is an accelerated method: D = (Remaining useful life)/(Sum of all years) x (Cost - Salvage). Understanding the difference between book value and market value is crucial for asset replacement and sale decisions.`,
      examTip: 'Key formulas:\nD = (Cost - Salvage) / Life\nBV = Cost - Accumulated Depreciation\nSYD: D = (Remaining years)/(Sum of years) x (Cost - Salvage)\nB/C ratio = PV(benefits) / PV(costs)',
    }],
    keyTakeaways: [
      'Straight-line: D = (Cost - Salvage)/Life; book value BV = Cost - t·D',
      'MACRS is U.S. tax depreciation allowing faster write-offs than straight-line',
      'Accelerated depreciation improves cash flow by deferring taxes',
      'Book value differs from market value; use each appropriately in analysis',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 4 — PROPERTIES OF ELECTRICAL MATERIALS  (4 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_conductors: {
    topicId: 'fee_conductors',
    title: 'Conductors & Resistivity',
    domainWeight: 'Properties of Electrical Materials · 3–5%',
    overview: 'Fundamental material properties determining electrical behavior: conductivity, semiconductor band structure, dielectric characteristics, and magnetic responses essential for component selection and device design.',
    sections: [{
      id: 'fee_conductors_main',
      title: 'Conductors & Resistivity',
      content: `Conductors like copper and aluminum have abundant free electrons enabling charge flow; their conductivity depends on material composition, temperature, and geometric dimensions. Resistivity (ρ) is an intrinsic material property measuring resistance per unit length and cross-sectional area: R = ρL/A, where L is length, A is cross-sectional area, and ρ is resistivity in ohm-meters. Copper has low resistivity (~1.7 x 10^-8 ohm·m) making it ideal for wiring; aluminum has slightly higher resistivity (~2.8 x 10^-8 ohm·m) but lower density and cost. Temperature affects resistivity significantly; most conductors increase resistance with temperature following: ρ(T) = ρ₀[1 + α(T - T₀)], where α is the temperature coefficient of resistivity. Copper has α approximately 0.00393 per degrees C, meaning 0.4% resistance increase per degree Celsius.

Wire gauges follow standardized systems (AWG in North America) where smaller gauge numbers indicate larger cross-sectional areas and lower resistance. Selecting proper wire gauge requires balancing cost, voltage drop, and current capacity. Voltage drop V = IR limits how far current can travel at a given gauge before excessive loss. Conductivity σ is the reciprocal of resistivity: σ = 1/ρ, measured in siemens per meter (S/m). High-quality electrical connections require clean surface contact and adequate pressure; oxidation dramatically increases contact resistance.`,
      examTip: 'Key formulas:\nR = ρL/A\nρ(T) = ρ₀[1 + α(T - T₀)]\nσ = 1/ρ\nV = IR (voltage drop)',
    }],
    keyTakeaways: [
      'Resistivity (ρ) is an intrinsic material property; resistance R = ρL/A depends on geometry and material',
      'Temperature coefficient α indicates resistance change with temperature: typical conductors increase 0.3-0.4% per C',
      'Wire gauge (AWG) inversely relates to cross-sectional area; proper gauge selection balances cost, voltage drop, and current capacity',
      'Conductivity σ = 1/ρ; clean conductor surfaces and good contact pressure minimize resistance',
    ],
  },

  fee_semiconductors: {
    topicId: 'fee_semiconductors',
    title: 'Semiconductors: Band Structure & Doping',
    domainWeight: 'Properties of Electrical Materials · 3–5%',
    overview: 'Fundamental material properties determining electrical behavior: conductivity, semiconductor band structure, dielectric characteristics, and magnetic responses.',
    sections: [{
      id: 'fee_semiconductors_main',
      title: 'Semiconductors: Band Structure & Doping',
      content: `Semiconductors like silicon and germanium have conductivity between conductors and insulators, with properties controlled by doping (adding impurities). Silicon in pure form has a band gap of ~1.1 eV at room temperature, meaning thermal energy can excite electrons from the valence band to the conduction band, creating mobile charge carriers. Intrinsic semiconductors have equal concentrations of electrons (negative carriers) and holes (positive carriers); adding dopants shifts this balance. N-type semiconductors are doped with donors (phosphorus, arsenic) which have 5 valence electrons; the fifth electron is loosely bound and contributes to conduction. P-type semiconductors are doped with acceptors (boron, aluminum) which have 3 valence electrons, creating vacancies (holes). Doping levels are typically 10^15 to 10^20 dopants per cm cubed, dramatically changing conductivity.

Carrier concentration n (electrons) and p (holes) determine semiconductor properties. The intrinsic carrier concentration n_i is approximately 1.5 x 10^10 cm^-3 for silicon at 300K. For n-type with N_D donors: n approximately equals N_D and p = n_i squared/N_D. For p-type with N_A acceptors: p approximately equals N_A and n = n_i squared/N_A. The product n x p = n_i squared is constant at a given temperature, even with doping. Drift and diffusion are the two mechanisms of charge transport: drift occurs when an electric field accelerates carriers; diffusion occurs due to concentration gradients.`,
      examTip: 'Key formulas:\nn_i approximately 1.5 x 10^10 cm^-3 for Si at 300K\nN-type: n approximately N_D, p = n_i^2/N_D\nP-type: p approximately N_A, n = n_i^2/N_A\nMass action law: n x p = n_i^2',
    }],
    keyTakeaways: [
      'Band gap energy determines carrier excitation; intrinsic silicon has ~1.1 eV gap',
      'N-type (donor doping) increases electrons; p-type (acceptor doping) increases holes',
      'Carrier concentration n x p = n_i squared is constant at fixed temperature',
      'Drift and diffusion transport charges; junction behavior depends on band alignment and depletion region width',
    ],
  },

  fee_dielectrics: {
    topicId: 'fee_dielectrics',
    title: 'Dielectrics & Insulators',
    domainWeight: 'Properties of Electrical Materials · 3–5%',
    overview: 'Fundamental material properties determining electrical behavior: conductivity, semiconductor band structure, dielectric characteristics, and magnetic responses.',
    sections: [{
      id: 'fee_dielectrics_main',
      title: 'Dielectrics & Insulators',
      content: `Dielectric materials are insulators that can be polarized by electric fields, storing electrical energy and enabling capacitors. Dielectric constant κ (relative permittivity) measures how much a material can be polarized relative to vacuum: ε = κε₀, where ε₀ = 8.854 x 10^-12 F/m is the permittivity of free space. Common dielectrics: vacuum (κ = 1), air (κ approximately 1.0006), mica (κ = 3-7), ceramic (κ = 100-10000), and water (κ = 80). Higher κ allows capacitors to store more energy for the same volume and voltage, which is why ceramic or electrolytic capacitors are much smaller than air-gap capacitors. Capacitance C = κε₀A/d, where A is plate area and d is separation; high-κ materials enable miniaturization.

Breakdown voltage is the electric field strength at which insulation fails and current suddenly increases. Breakdown field strength varies: air breaks down around 3 MV/m, mica 150 MV/m, ceramics 100-300 MV/m. Exceeding breakdown voltage causes permanent damage or arc formation. Polarization mechanisms determine dielectric response: electronic polarization at optical frequencies, ionic polarization at infrared frequencies, and dipolar/orientational polarization at lower frequencies. Each mechanism contributes differently at various frequencies, causing frequency-dependent permittivity. Dielectric loss (tan δ) represents energy dissipated as heat; low-loss materials minimize heating and are preferred for high-frequency applications.`,
      examTip: 'Key formulas:\nC = κε₀A/d, where ε₀ = 8.854 x 10^-12 F/m\nE = V/d; breakdown at E_breakdown\nU = (1/2)CV^2 = (1/2)κε₀(A/d)V^2\nP_loss related to tan(δ)',
    }],
    keyTakeaways: [
      'Dielectric constant κ determines energy storage capacity (C = κε₀A/d); higher κ enables smaller capacitors',
      'Breakdown voltage represents maximum safe field strength; design margins (30-50%) prevent failure',
      'Frequency-dependent permittivity reflects different polarization mechanisms',
      'Dielectric loss (tan δ) and insulation resistance must be considered; moisture and temperature degrade properties',
    ],
  },

  fee_magnetic_mat: {
    topicId: 'fee_magnetic_mat',
    title: 'Magnetic Materials & Magnetization',
    domainWeight: 'Properties of Electrical Materials · 3–5%',
    overview: 'Fundamental material properties determining electrical behavior: conductivity, semiconductor band structure, dielectric characteristics, and magnetic responses.',
    sections: [{
      id: 'fee_magnetic_mat_main',
      title: 'Magnetic Materials & Magnetization',
      content: `Magnetic materials respond to applied magnetic fields; their behavior is characterized by permeability μ, magnetic flux density B, and magnetization M. Permeability μ = μ_r x μ₀, where μ₀ = 4π x 10^-7 H/m is the permeability of free space and μ_r is relative permeability. Materials are classified as diamagnetic (μ_r < 1), paramagnetic (μ_r slightly > 1), or ferromagnetic (μ_r >> 1, typically 100-5000). Ferromagnetic materials (iron, nickel, cobalt) strongly amplify applied fields and retain magnetization after field removal. The B-H curve plots magnetic flux density B versus applied field H; starting from zero, initial permeability is steep, then saturation occurs where B levels off.

Hysteresis is the lag in magnetization when the applied field changes direction. Starting at saturation and decreasing H to zero leaves residual magnetization (remanence) B_r. Reversing H requires a coercive field H_c to reduce B to zero. Area enclosed by the hysteresis loop represents energy dissipated as heat per cycle. Soft magnetic materials (iron-silicon) have narrow loops, low coercivity, high permeability — ideal for transformer cores. Hard magnetic materials (rare-earth magnets) have large loops, high coercivity, high remanence — ideal for permanent magnets. Transformer core losses include hysteresis loss (loop area) and eddy current loss; lamination reduces eddy currents. The Curie temperature T_c is where ferromagnetic materials lose spontaneous magnetization and become paramagnetic.`,
      examTip: 'Key formulas:\nB = μ₀(H + M) = μ₀μ_r H\nM = χ_m H (magnetic susceptibility)\nHysteresis loss: W_h = (loop area) x frequency\nEddy current loss: P_e proportional to B^2 x f^2 x t^2 / ρ',
    }],
    keyTakeaways: [
      'Permeability μ = μ_r x μ₀ determines field amplification; ferromagnetic materials have μ_r >> 1',
      'B-H curves show magnetization behavior; saturation, remanence, and coercivity characterize material response',
      'Hysteresis loop area represents energy loss per cycle; soft materials have narrow loops (low loss)',
      'Curie temperature marks transition to paramagnetism; transformer losses controlled via lamination and material selection',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 5 — ENGINEERING SCIENCES  (3 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_work_energy: {
    topicId: 'fee_work_energy',
    title: 'Work, Energy & Power',
    domainWeight: 'Engineering Sciences · 3–5%',
    overview: 'Fundamental physics principles: work, energy, power conservation, electric charge fundamentals, and electromechanical energy conversion essential for understanding electrical and mechanical systems.',
    sections: [{
      id: 'fee_work_energy_main',
      title: 'Work, Energy & Power',
      content: `Work is the transfer of energy through force applied over distance: W = F x d x cos(θ), where θ is the angle between force and displacement. In electrical systems, work W = P x t (power times time) or W = V x Q (voltage times charge), measured in joules. Energy is the capacity to perform work; mechanical energy exists as kinetic (KE = 1/2 m v squared) and potential (PE = mgh). Electrical energy is E = V x I x t or E = P x t. Power is the rate of energy transfer: P = W/t = F x v (mechanical) or P = V x I (electrical), measured in watts. Conservation of energy states that total energy in an isolated system remains constant. Efficiency η = (useful energy out) / (total energy in).

Exam problems frequently require energy balance equations: energy in = energy out + losses. Electrical power: P = V x I = I squared R = V squared/R (for resistive loads). Power conservation in ideal transformers: V_p x I_p = V_s x I_s. In AC systems, apparent power S = V x I (in volt-amperes), real power P = V x I x cos(φ) (in watts), reactive power Q = V x I x sin(φ) (in VAR). Understanding power factor (cos φ) is critical: at unity power factor, real power equals apparent power; at lower power factors, much current is wasted in reactive power.`,
      examTip: 'Key formulas:\nW = F·d, P = F·v\nP = V·I = I^2R = V^2/R\nAC: S = V·I, P = V·I·cos(φ), Q = V·I·sin(φ)\nη = P_out / P_in',
    }],
    keyTakeaways: [
      'Work W = F·d (mechanical), W = V·Q (electrical); power P = W/t = V·I; energy is conserved',
      'Efficiency η = (useful output) / (total input); real systems always have efficiency < 100%',
      'Power in AC systems: apparent S = V·I (VA), real P = V·I·cos(φ) (W), reactive Q = V·I·sin(φ) (VAR)',
      'Energy balance: total input = useful output + losses; losses often proportional to I^2R',
    ],
  },

  fee_charge_current: {
    topicId: 'fee_charge_current',
    title: 'Charge, Current, Voltage & Power Fundamentals',
    domainWeight: 'Engineering Sciences · 3–5%',
    overview: 'Fundamental physics principles: work, energy, power conservation, electric charge fundamentals, and electromechanical energy conversion.',
    sections: [{
      id: 'fee_charge_current_main',
      title: 'Charge, Current, Voltage & Power Fundamentals',
      content: `Electric charge Q is measured in coulombs (C); one coulomb equals the charge of 6.24 x 10^18 electrons. Current I is the rate of charge flow: I = dQ/dt in amperes. Voltage (potential difference) V is the energy per unit charge: V = W/Q in volts. Coulomb's Law describes the force between charges: F = k·Q₁·Q₂/r squared, where k = 8.99 x 10^9 N·m squared/C squared. Like charges repel; opposite charges attract. Electric field E is the force per unit charge: E = F/Q = k·Q/r squared, directed away from positive charges. Potential difference between two points is the line integral of electric field: V = integral of E·dl. In a uniform field, V = E·d.

Electric power P = V·I measures energy transfer rate. For constant voltage and current, P = V·I watts. In resistive elements, P = I squared R = V squared/R. For sinusoidal AC, P_avg = V_rms·I_rms·cos(φ). RMS values produce equivalent power to DC: V_rms = V_peak/sqrt(2) approximately 0.707·V_peak. Impedance Z = R + jX generalizes Ohm's law for AC circuits. Power factor cos(φ) relates real to apparent power; low power factors increase I squared R losses and heating in conductors.`,
      examTip: 'Key formulas:\nI = dQ/dt\nV = W/Q\nF = k·Q₁·Q₂/r^2\nP = V·I = I^2R = V^2/R\nV_rms = V_peak / sqrt(2)',
    }],
    keyTakeaways: [
      'Current I = dQ/dt (amperes); voltage V = W/Q (volts); power P = V·I (watts)',
      "Coulomb's Law and electric field describe charge interactions; potential difference is line integral of E",
      'AC power analysis: RMS values, phase angles, and power factor determine real power transferred',
      'Power factor correction and impedance (Z = R + jX) are essential for AC circuit analysis',
    ],
  },

  fee_electromech: {
    topicId: 'fee_electromech',
    title: 'Electromechanical Conversion: Motors & Generators',
    domainWeight: 'Engineering Sciences · 3–5%',
    overview: 'Fundamental physics principles: work, energy, power conservation, electric charge fundamentals, and electromechanical energy conversion.',
    sections: [{
      id: 'fee_electromech_main',
      title: 'Electromechanical Conversion: Motors & Generators',
      content: `Electromechanical conversion transforms electrical energy to mechanical (motors) or mechanical to electrical (generators). The Lorentz force on a current-carrying conductor in a magnetic field is F = B·I·L, where B is flux density, I is current, and L is conductor length perpendicular to B. A generator converts mechanical motion into electrical voltage via Faraday's law: EMF = -N·dΦ/dt. Back-EMF in motors opposes applied voltage: V_applied = I·R + E_back, where E_back = k·ω (k is motor constant, ω is angular velocity). At startup, ω = 0 so back-EMF is zero, allowing large inrush current; as speed increases, back-EMF grows, limiting current.

Motor torque τ = k·I, proportional to current. Maximum torque occurs at startup with maximum current. Mechanical power output P_mech = τ·ω = E_back·I. Electrical power input P_elec = V·I. Efficiency η = P_mech / P_elec = E_back / V. AC induction motors operate with slip (rotor speed slightly below synchronous speed), inducing rotor currents that create torque. DC motors offer precise speed control via voltage adjustment and torque control via current adjustment. In generators, mechanical speed determines voltage magnitude; field current determines voltage level.`,
      examTip: 'Key formulas:\nF = B·I·L\nEMF = -N·dΦ/dt\nE_back = k·ω, Motor: V = I·R + k·ω\nτ = k·I\nP_mech = τ·ω = E_back·I',
    }],
    keyTakeaways: [
      "Lorentz force F = B·I·L drives motors; Faraday induction (EMF = -dΦ/dt) produces voltage in generators",
      'Back-EMF opposes supply voltage; higher speed means higher back-EMF, lower current, lower torque',
      'Motor torque τ = k·I is proportional to armature current; P = τ·ω = E_back·I',
      'Generator voltage proportional to mechanical speed; field current controls voltage level',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 6 — CIRCUIT ANALYSIS  (7 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_dc_fundamentals: {
    topicId: 'fee_dc_fundamentals',
    title: 'DC Fundamentals: Ohm\'s Law & Network Analysis',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic (10%). Master Ohm\'s law, Kirchhoff\'s laws, network theorems, AC analysis, and transient response.',
    sections: [{
      id: 'fee_dc_fundamentals_main',
      title: "DC Fundamentals: Ohm's Law & Network Analysis",
      content: `Ohm's Law V = I·R is the foundation of circuit analysis, relating voltage, current, and resistance. Kirchhoff's Current Law (KCL) states that the sum of currents entering a node equals the sum leaving: sum of I_in = sum of I_out. Kirchhoff's Voltage Law (KVL) states that the sum of voltages around any closed loop equals zero. Series circuits have a single current path; total resistance R_total = R1 + R2 + ... Voltage divides proportionally: V_k = V_total x (R_k / R_total). Parallel circuits have multiple paths; voltage across all parallel branches is identical, and currents divide: I_k = I_total x (R_eq / R_k). Equivalent parallel resistance is 1/R_eq = 1/R1 + 1/R2 + ..., always less than the smallest individual resistance.

Source transformations allow conversion between voltage and current sources with series/parallel impedance. Delta-wye transformations convert between three-element configurations, useful for three-phase circuits and bridge networks. For resistances, Z_Y = Z_delta/3 for balanced loads. These tools — KCL, KVL, voltage/current dividers, source transformations, delta-wye — enable systematic reduction of complex networks. Always verify results by checking power balance: total power generated equals total power dissipated.`,
      examTip: 'Key formulas:\nV = I·R\nSeries: R_total = R1 + R2\nParallel: 1/R_eq = 1/R1 + 1/R2\nVoltage divider: V_k = V·R_k/(R1 + R2)\nPower: P = V·I = I^2·R = V^2/R',
    }],
    keyTakeaways: [
      "Ohm's Law V = I·R; series resistance sums; parallel resistance reciprocal sums, always less than smallest R",
      'KCL: sum of I at node = 0; KVL: sum of V around loop = 0; these enable nodal and loop analysis',
      'Voltage divider V_k = V_total(R_k / R_total); current divider for quick solutions',
      'Source transformations and delta-wye transformations simplify circuits; verify by power balance',
    ],
  },

  fee_network_theorems: {
    topicId: 'fee_network_theorems',
    title: 'Network Theorems: Thevenin, Norton & Superposition',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic.',
    sections: [{
      id: 'fee_network_theorems_main',
      title: 'Network Theorems: Thevenin, Norton & Superposition',
      content: `Thevenin's Theorem simplifies complex networks to a single equivalent circuit: V_Th in series with R_Th. Find V_Th = open-circuit voltage at terminals; find R_Th = equivalent resistance with all sources deactivated (voltage sources short-circuited, current sources open-circuited). Norton's Theorem is the dual: I_N in parallel with R_N where I_N = short-circuit current and R_N = R_Th. V_Th = I_N · R_N.

Superposition states that in a linear network with multiple sources, the response is the sum of responses due to each source acting alone. To apply: consider one source, deactivate all others, calculate response, repeat for each source, sum algebraically. Maximum Power Transfer: load R_L = R_Th delivers maximum power P_max = V_Th^2/(4·R_Th). This principle guides impedance matching. Common pitfall: deactivating voltage source as open circuit instead of short circuit.

These theorems enable quick solutions without solving the entire network. For problems asking for current through one element, Thevenin equivalent of the rest of the circuit often provides the fastest path. Superposition reduces complexity for multi-source circuits. At maximum power transfer, efficiency is only 50% — efficiency increases as R_L increases beyond R_Th, but power delivered decreases.`,
      examTip: 'Key formulas:\nV_Th = open-circuit voltage\nR_Th = resistance with sources deactivated\nI_N = V_Th/R_Th\nP_max = V_Th^2/(4·R_Th)',
    }],
    keyTakeaways: [
      'Thevenin: V_Th (open-circuit voltage) in series with R_Th; any load sees this as source',
      'Norton: I_N (short-circuit current) in parallel with R_N = R_Th',
      'Superposition: sum responses due to each source individually (deactivating others)',
      'Maximum power transfer: R_L = R_Th for maximum power; efficiency at max power is 50%',
    ],
  },

  fee_ac_phasors: {
    topicId: 'fee_ac_phasors',
    title: 'AC Steady-State Analysis: Phasors & Impedance',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic.',
    sections: [{
      id: 'fee_ac_phasors_main',
      title: 'AC Steady-State Analysis: Phasors & Impedance',
      content: `AC steady-state analysis uses phasors (complex numbers representing sinusoidal quantities) to convert differential equations into algebraic form. A sinusoidal voltage v(t) = V_m·cos(ωt + φ) is represented as phasor V = V_m∠φ. V_rms = V_m / sqrt(2). Impedance Z generalizes resistance to AC: Z = R + jX. For inductors, X_L = ωL (positive reactance, voltage leads current by 90 degrees). For capacitors, X_C = -1/(ωC) (negative reactance, current leads voltage by 90 degrees). V = I·Z in phasor form.

In series circuits, impedances add; in parallel, admittances (Y = 1/Z) add. Reactance and impedance vary with frequency ω = 2πf. At very low frequencies, inductors approach short circuits and capacitors open circuits. At very high frequencies, inductors open and capacitors short. This frequency dependence is critical for filter design. The resonant frequency f₀ = 1/(2π sqrt(LC)) is where X_L = X_C, making impedance purely resistive. All DC techniques (KVL, KCL, Thevenin, superposition) apply to AC using phasors.`,
      examTip: 'Key formulas:\nV = V_m∠φ\nV_rms = V_m / sqrt(2)\nZ_L = jωL, Z_C = 1/(jωC)\n|Z| = sqrt(R^2 + X^2)\nf₀ = 1/(2π sqrt(LC))',
    }],
    keyTakeaways: [
      'Phasors represent sinusoids as complex numbers: V = V_m∠φ; V_rms = V_m/sqrt(2)',
      'Impedance Z = R + jX; inductive X_L = ωL (positive), capacitive X_C = -1/(ωC) (negative)',
      'Frequency dependence: low freq inductors short/caps open; high freq inductors open/caps short',
      'Resonance at ω₀ = 1/sqrt(LC) where X_L = X_C; impedance is purely resistive, current is maximum',
    ],
  },

  fee_ac_power: {
    topicId: 'fee_ac_power',
    title: 'AC Power Analysis: Real, Reactive & Apparent',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic.',
    sections: [{
      id: 'fee_ac_power_main',
      title: 'AC Power Analysis',
      content: `AC power has three components: real power P (watts) does useful work: P = V_rms·I_rms·cos(φ). Reactive power Q (VAR) oscillates in inductors and capacitors: Q = V_rms·I_rms·sin(φ). Apparent power S (VA) is total: S = V_rms·I_rms = sqrt(P^2 + Q^2). Power factor PF = P/S = cos(φ). Unity PF means all power is real; lower PF wastes transmission capacity. Lagging PF (inductive loads) requires capacitive correction.

Complex power S = P + jQ = V·I* captures all power information. Power factor correction adds capacitors in parallel with inductive loads: Qc = P(tan(θ_old) - tan(θ_new)). Utilities penalize low power factors (typically below 0.90). For a circuit element with impedance Z = R + jX: P = I^2·R and Q = I^2·X. The power triangle relates P (horizontal), Q (vertical), S (hypotenuse).`,
      examTip: 'Key formulas:\nP = V·I·cos(φ) (watts)\nQ = V·I·sin(φ) (VAR)\nS = V·I (VA); S^2 = P^2 + Q^2\nPF = P/S = cos(φ)\nComplex power: S = P + jQ = V·I*',
    }],
    keyTakeaways: [
      'Real power P = V·I·cos(φ); reactive Q = V·I·sin(φ); apparent S = sqrt(P^2 + Q^2)',
      'Power factor PF = cos(φ); lower PF requires more current for same real power',
      'Power factor correction: add parallel capacitors to reduce reactive power',
      'Complex power S = P + jQ captures all power information; power triangle is fundamental',
    ],
  },

  fee_resonance: {
    topicId: 'fee_resonance',
    title: 'Resonance & Frequency Response',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic.',
    sections: [{
      id: 'fee_resonance_main',
      title: 'Resonance & Frequency Response',
      content: `Series RLC resonance occurs when inductive and capacitive reactances cancel: X_L = X_C, or ωL = 1/(ωC). Resonant frequency: ω₀ = 1/sqrt(LC), or f₀ = 1/(2π sqrt(LC)). At resonance, impedance Z = R (purely resistive), current is maximum I_max = V/R, and voltage and current are in phase. Quality factor Q = ω₀L/R = 1/(ω₀RC) measures selectivity: higher Q means narrower bandwidth. Bandwidth BW = f₀/Q is the frequency range where power is at least half maximum. Below resonance, capacitive reactance dominates; above, inductive dominates.

Parallel RLC resonance: impedance is maximum (purely resistive) at resonance. Voltage across the parallel combination is maximum. The concept of resonance is crucial for filter design, power factor correction, and understanding instability in electrical systems. Series minimizes impedance at resonance (good for series filters); parallel maximizes impedance (good for parallel filters, tank circuits).`,
      examTip: 'Key formulas:\nω₀ = 1/sqrt(LC)\nf₀ = 1/(2π sqrt(LC))\nQ = ω₀L/R = 1/(ω₀RC)\nBW = f₀/Q\nX_L = ωL, X_C = 1/(ωC)',
    }],
    keyTakeaways: [
      'Resonant frequency: ω₀ = 1/sqrt(LC); f₀ = 1/(2π sqrt(LC))',
      'At resonance: X_L = X_C, impedance is minimum (series) or maximum (parallel)',
      'Quality factor Q = ω₀L/R; higher Q means sharper resonance peak',
      'Bandwidth BW = f₀/Q; series RLC Z_min = R; parallel RLC Z_max = R',
    ],
  },

  fee_three_phase: {
    topicId: 'fee_three_phase',
    title: 'Three-Phase Circuits and Power',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic.',
    sections: [{
      id: 'fee_three_phase_main',
      title: 'Three-Phase Circuits and Power',
      content: `Three-phase AC power is standard in industry, offering constant power delivery (not pulsating like single-phase). Three voltage sources 120 degrees apart: Va, Vb = Va∠(-120), Vc = Va∠(-240). Balanced three-phase: Va+Vb+Vc = 0. Wye (Y) connection: line voltage = sqrt(3) x phase voltage, V_L = sqrt(3)·V_ph. Delta connection: line voltage equals phase voltage V_L = V_ph, but line current = sqrt(3) x phase current. Power: P = sqrt(3)·V_L·I_L·cos(φ), Q = sqrt(3)·V_L·I_L·sin(φ), S = sqrt(3)·V_L·I_L.

Per-phase analysis simplifies balanced systems to single-phase equivalent. Unbalanced loads require symmetrical components: zero-sequence (sum), positive-sequence (standard 120 degrees apart), negative-sequence (reverse order). Y-to-delta conversion: Z_delta = 3·Z_wye for balanced loads.`,
      examTip: 'Key formulas:\nV_L = sqrt(3)·V_ph (wye)\nI_L = sqrt(3)·I_ph (delta)\nP = sqrt(3)·V_L·I_L·cos(φ)\nZ_delta = 3·Z_wye',
    }],
    keyTakeaways: [
      'Wye: V_L = sqrt(3)·V_ph, I_L = I_ph; Delta: V_L = V_ph, I_L = sqrt(3)·I_ph',
      'Three-phase power (constant): P = sqrt(3)·V_L·I_L·cos(φ)',
      'Per-phase analysis: solve one phase, multiply power by 3',
      'Delta-wye conversion: Z_delta = 3·Z_wye for equivalent impedances',
    ],
  },

  fee_transients: {
    topicId: 'fee_transients',
    title: 'Transient Analysis: RC, RL, and RLC Circuits',
    domainWeight: 'Circuit Analysis · 10%',
    overview: 'Circuit analysis is the core of electrical engineering and the most heavily weighted FE exam topic.',
    sections: [{
      id: 'fee_transients_main',
      title: 'Transient Analysis: Step Response & Time Constants',
      content: `Transient analysis examines circuit behavior after a sudden change. For RC circuits: v_C(t) = V_in(1 - e^(-t/τ)) (charging), v_C(t) = V₀·e^(-t/τ) (discharging), where τ = RC. After 5τ, capacitor reaches ~99.3% of final value. For RL circuits: τ = L/R, i_L(t) = (V_in/R)(1 - e^(-t/τ)). At t = 0+, capacitors maintain their pre-transient voltage and inductors maintain their pre-transient current (continuity constraints).

Second-order RLC circuits have more complex responses determined by damping ratio ζ = R/(2 sqrt(L/C)): underdamped (ζ < 1) oscillates, critically damped (ζ = 1) fastest no-overshoot, overdamped (ζ > 1) slow monotonic. Practical circuits must limit inrush currents (using series resistors, soft starters) and suppress voltage spikes (using snubber circuits). When a switch opens, stored energy in inductors must dissipate; without a discharge path, dangerous voltage spikes appear. Laplace transform (s-domain) simplifies transient calculation: impedances become Z(s) = R + sL + 1/(sC).`,
      examTip: 'Key formulas:\nτ = RC or τ = L/R\nv_C(t) = V(1 - e^(-t/τ))\ni_L(t) = (V/R)(1 - e^(-t/τ))\nζ = R/(2 sqrt(L/C))\nSettling time ≈ 5τ',
    }],
    keyTakeaways: [
      'Time constant τ = RC (capacitor) or τ = L/R (inductor); 5τ is settling time',
      'Natural response decays exponentially; forced response is steady-state; total is sum',
      'Initial conditions: v_C(0+) = v_C(0-), i_L(0+) = i_L(0-) (continuity)',
      'Second-order: underdamped (oscillatory), critically damped (fastest), overdamped (slow)',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 7 — LINEAR SYSTEMS  (4 curriculum IDs from 5 sections)
   * ────────────────────────────────────────────────────────────────── */

  fee_time_domain: {
    topicId: 'fee_time_domain',
    title: 'Time Domain Analysis & LTI Systems',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'Covers fundamental signal processing and system analysis in both time and frequency domains, including impulse response, transforms, transfer functions, stability criteria, and Z-transforms.',
    sections: [{
      id: 'fee_time_domain_main',
      title: 'Time Domain Analysis & LTI Systems',
      content: `Time domain analysis examines system behavior using impulse and step responses. The impulse response h(t) completely characterizes an LTI system and allows prediction of output for any input through convolution: y(t) = integral of x(τ)h(t-τ)dτ. When an impulse δ(t) enters a system, the output h(t) reveals all system dynamics. The step response shows how quickly and smoothly a system reaches steady state. Causality requires h(t)=0 for t<0; all physical systems are causal.

Linear Time-Invariant (LTI) systems obey superposition and are shift-invariant. Linearity means scaling and summing inputs produce scaled and summed outputs. Stability in the BIBO (Bounded Input Bounded Output) sense means bounded inputs always produce bounded outputs. For LTI systems, BIBO stability is equivalent to integral of |h(t)|dt < infinity, which means all poles in the open left half-plane. If a pole is exactly on the imaginary axis (marginal stability), the system is technically unstable in BIBO sense.`,
      examTip: 'Key formulas:\ny(t) = integral of x(τ)h(t-τ)dτ (convolution)\ny[n] = sum of x[k]h[n-k]\nBIBO stability: integral |h(t)|dt < infinity',
    }],
    keyTakeaways: [
      'Impulse response h(t) fully characterizes LTI systems; use convolution to find output',
      'Causal systems satisfy h(t)=0 for t<0; all physical systems are causal',
      'BIBO stable iff all poles in open LHP; convolution in time = multiplication in frequency',
      'LTI: superposition principle applies; shift-invariance property holds',
    ],
  },

  fee_freq_domain: {
    topicId: 'fee_freq_domain',
    title: 'Frequency Domain Analysis: Fourier & Laplace',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'Covers fundamental signal processing and system analysis in both time and frequency domains.',
    sections: [{
      id: 'fee_freq_domain_main',
      title: 'Frequency Domain Analysis',
      content: `The Fourier Transform converts time-domain signals into frequency-domain representations, showing which frequencies are present and their amplitudes. For periodic signals, Fourier Series decomposes them into discrete frequency components: x(t) = a₀ + sum of an·cos(nω₀t) + bn·sin(nω₀t). The Laplace Transform generalizes Fourier analysis by including an exponential convergence factor: X(s) = integral of e^(-st)x(t)dt, converting differential equations into algebraic equations. Region of convergence (ROC) defines where the transform exists and is crucial for uniqueness.

Key advantage: time-domain convolution becomes frequency-domain multiplication, dramatically simplifying analysis. For practical signals, use table lookups rather than computing integrals by hand. Pole-zero plots in the s-plane determine time-domain response characteristics.`,
      examTip: 'Key formulas:\nX(f) = integral of x(t)e^(-j2πft)dt\nX(s) = integral of x(t)e^(-st)dt\nx(t) = (1/2π) integral of X(jω)e^(jωt)dω',
    }],
    keyTakeaways: [
      'Fourier Series for periodic signals; Fourier Transform for non-periodic signals',
      'Laplace Transform with ROC handles wider signal classes including growing exponentials',
      'Time convolution corresponds to frequency multiplication (key for filtering)',
      'Pole-zero plots in s-plane determine time-domain response characteristics',
    ],
  },

  fee_transfer_func: {
    topicId: 'fee_transfer_func',
    title: 'Transfer Functions, Poles, and Zeros',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'Covers fundamental signal processing and system analysis in both time and frequency domains.',
    sections: [{
      id: 'fee_transfer_func_main',
      title: 'Transfer Functions, Poles, and Zeros',
      content: `A transfer function H(s) = Y(s)/X(s) is the Laplace transform of the impulse response, representing the input-output relationship in the frequency domain. It can be expressed as a ratio of polynomials. Zeros are values of s where the numerator equals zero; poles are where the denominator equals zero. Pole locations in the s-plane directly determine time-domain behavior: poles in the left half-plane (LHP) correspond to decaying exponentials, poles on the imaginary axis produce sustained oscillations, and poles in the right half-plane (RHP) cause instability. A system is stable if and only if all poles lie in the open LHP.

The number of poles equals system order, determining the number of energy-storage elements. Partial fraction decomposition separates complex transfer functions into simple terms whose inverse Laplace transforms are known. Dominant poles (closest to imaginary axis) control response speed; fast poles have little effect and can often be neglected.`,
      examTip: 'Key formulas:\nH(s) = N(s)/D(s)\nStability: Re(p_i) < 0 for all poles\nPartial fractions for inverse transforms',
    }],
    keyTakeaways: [
      'Poles in LHP = stable; on imaginary axis = marginal; in RHP = unstable',
      'Pole locations determine response time and oscillation; zeros affect magnitude only',
      'Order of denominator = system order = number of poles',
      'Partial fractions decompose complex H(s) into simple inverse-transformable terms',
    ],
  },

  fee_z_transforms: {
    topicId: 'fee_z_transforms',
    title: 'Z-Transforms and Discrete Systems',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'Covers fundamental signal processing and system analysis in both time and frequency domains.',
    sections: [{
      id: 'fee_z_transforms_main',
      title: 'Z-Transforms and Discrete Systems',
      content: `The Z-Transform is the discrete-time equivalent of the Laplace Transform, converting difference equations into algebraic form. For a discrete signal x[n], X(z) = sum of x[n]z^(-n). The relationship between s-plane and z-plane is z = e^(sT) where T is sampling period. This maps the imaginary axis to the unit circle; the LHP maps inside the unit circle. For discrete systems, stability requires poles inside the unit circle |z| < 1.

Common Z-Transform pairs: u[n] maps to z/(z-1), a^n u[n] maps to z/(z-a), n·a^n u[n] maps to az/(z-a)^2. Unilateral Z-Transforms (causal sequences) are standard for digital control. Partial fractions and tables solve most inverse Z-Transform problems quickly. On the FE exam, expect table lookups, inverse transforms via partial fractions, or determining stability from pole locations in the z-plane.`,
      examTip: 'Key formulas:\nX(z) = sum of x[n]z^(-n)\nz = e^(sT)\nStability: |poles| < 1 in z-plane\nu[n] -> z/(z-1), a^n·u[n] -> z/(z-a)',
    }],
    keyTakeaways: [
      'Z-Transform discretizes continuous systems; z=e^(sT) relates s and z planes',
      'Stability: all poles must satisfy |p_i| < 1 (inside unit circle)',
      'ROC defines uniqueness; unilateral Z-T for causal sequences is standard',
      'Partial fractions and tables solve most inverse Z-Transform problems quickly',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 8 — SIGNAL PROCESSING  (4 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_fourier: { topicId: 'fee_fourier', title: 'Fourier Series and Fourier Transform', domainWeight: 'Signal Processing · 4–6%', overview: 'Covers Fourier analysis for periodic and aperiodic signals, sampling theory, filter design, and DFT/FFT.', sections: [{ id: 'fee_fourier_main', title: 'Fourier Series and Fourier Transform', content: `Fourier Series decomposes periodic signals into a sum of sinusoids at harmonics of the fundamental frequency. For a signal with period T₀ and fundamental frequency f₀ = 1/T₀, the complex exponential form is x(t) = sum of cn·e^(j2πnf₀t) where cn = (1/T₀) integral of x(t)e^(-j2πnf₀t)dt. The Fourier Transform generalizes to aperiodic signals, producing a continuous frequency spectrum. Parseval's theorem: energy in time domain equals energy in frequency domain. The bandwidth of a signal indicates how much of the frequency spectrum is significant. Differentiation in time multiplies Fourier coefficients by j2πf, making sharp signals have broader spectra.`, examTip: 'Key formulas:\ncn = (1/T₀) integral of x(t)e^(-j2πnf₀t)dt\nX(f) = integral of x(t)e^(-j2πft)dt\nParseval: integral |x(t)|^2 dt = integral |X(f)|^2 df' }], keyTakeaways: ['Periodic signals use Fourier Series (discrete spectrum); aperiodic use Transform (continuous)', 'Complex exponential form is easiest for computation', 'Parseval: time-domain energy equals frequency-domain energy', 'Signal smoothness determines spectral roll-off; edges create high-frequency components'] },

  fee_sampling: { topicId: 'fee_sampling', title: 'Sampling Theorem and Nyquist Rate', domainWeight: 'Signal Processing · 4–6%', overview: 'Covers Fourier analysis, sampling theory, filter design, and DFT/FFT.', sections: [{ id: 'fee_sampling_main', title: 'Sampling Theorem and Nyquist Rate', content: `The Sampling Theorem (Shannon-Nyquist) states that to perfectly reconstruct a bandlimited signal from samples, the sampling frequency fs must exceed twice the highest frequency component: fs > 2f_max. The critical frequency is fn = fs/2 called the Nyquist frequency. Violating this causes aliasing — high-frequency components fold back into the baseband and become indistinguishable from lower frequencies. Anti-aliasing filters are placed before sampling to remove frequency components above the Nyquist frequency. Practical reconstruction from samples uses a sinc interpolation filter, though zero-order hold and first-order hold approximate it. Common mistake: confusing Nyquist frequency with sampling frequency — remember fn = fs/2.`, examTip: 'Key formulas:\nfs > 2f_max (Nyquist criterion)\nfn = fs/2 (Nyquist frequency)\nAliased frequency: |f mod fs| or |fs - f|' }], keyTakeaways: ['Nyquist rate fs > 2f_max; Nyquist frequency fn = fs/2 is the folding point', 'Aliasing occurs when fs <= 2f_max; anti-aliasing filter mandatory before sampling', 'Aliased frequency = |f +/- k·fs| for integers k', 'Perfect reconstruction needs sinc filter; practical systems use zero-order hold'] },

  fee_filters: { topicId: 'fee_filters', title: 'Analog Filters: Butterworth, Chebyshev, and Types', domainWeight: 'Signal Processing · 4–6%', overview: 'Covers Fourier analysis, sampling theory, filter design, and DFT/FFT.', sections: [{ id: 'fee_filters_main', title: 'Analog Filters', content: `Analog filters shape frequency responses to pass desired frequencies and attenuate others. Low-pass filters (LP) pass low frequencies, block high; high-pass (HP) do the opposite; band-pass (BP) pass a frequency band; band-stop (BS) reject a band. Filter order n determines roll-off rate: -20n dB/decade asymptotically. Butterworth filters provide maximally flat passband response with smooth roll-off; no ripple. Chebyshev Type I has equiripple passband and sharp roll-off; Type II has ripple in stopband. Elliptic filters achieve steepest roll-off by accepting ripple in both bands. A first-order Butterworth LP has H(s) = ωc/(s + ωc); second-order is ωc^2/(s^2 + sqrt(2)·ωc·s + ωc^2). Filter order is often the biggest design variable affecting cost and complexity.`, examTip: 'Key formulas:\nFirst-order LP: H(s) = ωc/(s+ωc)\nSecond-order Butterworth: H(s) = ωc^2/(s^2+sqrt(2)·ωc·s+ωc^2)\nRolloff = -20n dB/decade' }], keyTakeaways: ['Filter type (LP/HP/BP/BS) determined by application; Butterworth preferred for flat response', 'Roll-off = -20n dB/decade where n is order; higher order = steeper but more complex', 'Chebyshev allows passband ripple for sharper roll-off; Butterworth avoids ripple', 'Cutoff frequency ωc is primary design parameter'] },

  fee_dft_fft: { topicId: 'fee_dft_fft', title: 'DFT, FFT, and Practical Implementation', domainWeight: 'Signal Processing · 4–6%', overview: 'Covers Fourier analysis, sampling theory, filter design, and DFT/FFT.', sections: [{ id: 'fee_dft_fft_main', title: 'DFT, FFT, and Practical Implementation', content: `The Discrete Fourier Transform (DFT) converts a finite sequence of N samples into N frequency components: X[k] = sum(n=0 to N-1) x[n]e^(-j2πkn/N). Frequency resolution Δf = fs/N determines ability to distinguish nearby frequencies. The Fast Fourier Transform (FFT) reduces DFT computation from O(N^2) to O(N log N). Windowing applies a tapered window function (Hamming, Hann, Blackman) to reduce spectral leakage. Leakage occurs because the DFT implicitly assumes the signal repeats periodically; discontinuities at edges create spurious frequency components. Common windows: rectangular (no taper, high side-lobes), Hamming (50 dB suppression), Blackman (60 dB). Zero-padding extends to power of 2 without loss of information.`, examTip: 'Key formulas:\nX[k] = sum x[n]e^(-j2πkn/N)\nΔf = fs/N\nFrequency of bin k: fk = k·fs/N' }], keyTakeaways: ['DFT: X[k] = sum x[n]e^(-j2πkn/N); FFT is O(N log N), DFT is O(N^2)', 'Frequency resolution Δf = fs/N; longer records improve resolution', 'Windowing reduces spectral leakage from signal truncation', 'Zero-padding increases display resolution but adds no new information'] },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 9 — ELECTRONICS  (5 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

  fee_diodes: { topicId: 'fee_diodes', title: 'Diode Circuits and Applications', domainWeight: 'Electronics · 7–11%', overview: 'Covers semiconductor devices including diodes, BJTs, MOSFETs, op-amps, and power conversion circuits.', sections: [{ id: 'fee_diodes_main', title: 'Diode Circuits and Applications', content: `Diodes are two-terminal devices allowing current in forward direction and blocking reverse. Practical silicon diodes have 0.6-0.7 V forward voltage drop. Half-wave rectifier: Vdc = 0.318·Vpeak; full-wave bridge: Vdc = 0.636·Vpeak. Peak Inverse Voltage (PIV) must be less than breakdown voltage; bridge rectifier PIV = Vpeak, half-wave PIV = 2Vpeak. Zener diodes maintain constant voltage in reverse breakdown region; used as voltage regulators. Clipper circuits limit signal peaks; clamper circuits shift DC level. Filtering capacitors reduce ripple: ripple factor r = 1/(2 sqrt(3)·fRC) for full-wave with capacitor.`, examTip: 'Key formulas:\nHalf-wave: Vdc = Vpeak/π\nFull-wave: Vdc = 2Vpeak/π\nRipple: r = 1/(2 sqrt(3)·fRC)\nPIV_bridge = Vpeak' }], keyTakeaways: ['Half-wave rectifier: Vdc = 0.318·Vpeak; full-wave: Vdc = 0.636·Vpeak', 'PIV for bridge = Vpeak, half-wave = 2Vpeak', 'Zener in reverse bias maintains constant voltage for regulation', 'Filtering capacitors reduce ripple; larger capacitance = lower ripple'] },

  fee_bjt: { topicId: 'fee_bjt', title: 'BJT Analysis and Amplifier Configurations', domainWeight: 'Electronics · 7–11%', overview: 'Covers semiconductor devices including diodes, BJTs, MOSFETs, op-amps, and power conversion.', sections: [{ id: 'fee_bjt_main', title: 'BJT Analysis and Amplifier Configurations', content: `Bipolar Junction Transistors (BJTs) are current-controlled devices with three terminals: base (B), collector (C), emitter (E). In active region, Ic = β·Ib where β (hfe) is current gain (typically 50-300). Vbe approximately 0.7 V; Vce must exceed saturation voltage Vce(sat) approximately 0.2 V for active region. For small-signal AC analysis: gm = Ic/Vt approximately Ic/26mV. Common-Emitter (CE): high gain (approximately β), moderate input impedance, phase inversion, Av = -gm·Rc. Common-Collector (CC) or emitter-follower: unity voltage gain, high input impedance, low output impedance — excellent buffer. Common-Base (CB): high input impedance backward, no phase inversion. Q-point biasing: use voltage divider for stability against β variations.`, examTip: 'Key formulas:\nIc = β·Ib\nVbe approximately 0.7 V\ngm = Ic/Vt\nAv = -gm·Rc (CE stage)' }], keyTakeaways: ['Active region: Ic = β·Ib; saturation when Vce < 0.2 V; cutoff when Ib approximately 0', 'CE: high gain, moderate Zin, phase inversion; CC: high Zin, low Zout, unity gain', 'Small-signal model: gm = Ic/Vt approximately Ic/26mV', 'Q-point biasing: use voltage divider for stability against β variations'] },

  fee_mosfet: { topicId: 'fee_mosfet', title: 'MOSFET Circuits and Biasing', domainWeight: 'Electronics · 7–11%', overview: 'Covers semiconductor devices including diodes, BJTs, MOSFETs, op-amps, and power conversion.', sections: [{ id: 'fee_mosfet_main', title: 'MOSFET Circuits and Biasing', content: `MOSFETs are voltage-controlled devices. Enhancement-mode NMOS conducts only with Vgs > Vt (threshold, typically 0.5-2 V). In saturation: Id = (μnCox/2)·(W/L)·(Vgs-Vt)^2. Transconductance gm = μnCox(W/L)(Vgs-Vt). P-channel is complementary. Common-Source (CS) amplifier: Av = -gm·Rd. Common-Drain (CD) or source-follower: unity gain, very high Zin. Common-Gate (CG): high input impedance backward, low forward. Key advantage over BJTs: essentially zero gate current, simplifying biasing and allowing high input impedance. Self-biasing via source resistor: Vgs = Id·Rs.`, examTip: 'Key formulas:\nId = (μnCox/2)·(W/L)·(Vgs-Vt)^2 [saturation]\ngm = μnCox(W/L)(Vgs-Vt)\nAv = -gm·Rd [CS]\nZin_gate approaches infinity' }], keyTakeaways: ['NMOS enhancement: conducts for Vgs > Vt; saturation: Id = (μCox/2)(W/L)(Vgs-Vt)^2', 'CS amplifier: Av = -gm·Rd; CD: Av approximately 1; CG: low Zin forward', 'Zero gate current means very high input impedance', 'Self-biasing via Rs: Vgs = Id·Rs'] },

  fee_opamp: { topicId: 'fee_opamp', title: 'Operational Amplifier Circuits', domainWeight: 'Electronics · 7–11%', overview: 'Covers semiconductor devices including diodes, BJTs, MOSFETs, op-amps, and power conversion.', sections: [{ id: 'fee_opamp_main', title: 'Operational Amplifier Circuits', content: `Ideal op-amps have infinite open-loop gain, infinite input impedance, zero output impedance. With negative feedback: inverting Acl = -Rf/Rin, non-inverting Acl = 1+Rf/Rin. Unity-gain buffer: Acl = 1, Zin approximately infinity, Zout approximately 0. Integrator: Vo = -(1/RC) integral of Vi dt. Differentiator: Vo = -RC dVi/dt (noise-sensitive). Summing amplifier: Vo = -Rf(Vi1/R1 + Vi2/R2 + ...). Virtual short principle: V+ = V- with negative feedback; no current into inputs. Comparator uses open-loop gain to switch output between rail voltages. GBW product: gain x bandwidth = constant.`, examTip: 'Key formulas:\nInverting: Acl = -Rf/Rin\nNon-inverting: Acl = 1+Rf/Rin\nIntegrator: Vo = -(1/RC) integral Vi dt\nGBW = Aol·f_3dB' }], keyTakeaways: ['Virtual short: V+ = V- with negative feedback; no current into inputs', 'Inverting: Acl = -Rf/Rin; Non-inverting: Acl = 1+Rf/Rin; buffer: Acl = 1', 'Integrator: output proportional to integral of input; differentiator: proportional to derivative', 'Summing amplifier weights multiple inputs: Vo = -Rf(Vi1/R1 + Vi2/R2 + ...)'] },

  fee_power_elec: { topicId: 'fee_power_elec', title: 'Power Electronics: Rectifiers and Converters', domainWeight: 'Electronics · 7–11%', overview: 'Covers semiconductor devices including diodes, BJTs, MOSFETs, op-amps, and power conversion.', sections: [{ id: 'fee_power_elec_main', title: 'Power Electronics', content: `Power electronics processes large currents and voltages. Buck converter steps down: Vo = D·Vin where D is duty cycle 0-1. Boost converter steps up: Vo = Vin/(1-D). Three-phase rectifiers (six-pulse): Vdc approximately 1.35·Vrms for uncontrolled. PWM controls average output by varying on/off ratio; frequency much higher than load (typically 10+ kHz). Current ripple: ΔI = Vin·D/(L·fs). Voltage ripple: ΔV = I·D/(C·fs). Transformer-isolated converters provide safety isolation.`, examTip: 'Key formulas:\nBuck: Vo = D·Vin\nBoost: Vo = Vin/(1-D)\nΔI = Vin·D/(L·fs)\nΔV = I·D/(C·fs)' }], keyTakeaways: ['Buck: Vo = D·Vin; Boost: Vo = Vin/(1-D); D = ton/(ton+toff)', 'Ripple in inductors: ΔI = V·D/(L·fs); in capacitors: ΔV = I·D/(C·fs)', 'Three-phase rectifier: higher power, lower ripple than single-phase', 'PWM frequency >> load frequency ensures smooth output'] },

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

/* ──────────────────────────────────────────────────────────────────
 * Helper functions
 * ────────────────────────────────────────────────────────────────── */

export function hasFEEECourseContent(topicId: string): boolean {
  return topicId in FE_EE_COURSE;
}

export function getFEEECourseContent(topicId: string): TopicLesson | null {
  return FE_EE_COURSE[topicId] || null;
}
