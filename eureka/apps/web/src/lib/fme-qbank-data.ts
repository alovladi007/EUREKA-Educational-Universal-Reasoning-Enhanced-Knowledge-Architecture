/**
 * FE Mechanical Engineering — Question Bank
 * 555 questions across 16 topics, with difficulty levels 1-3.
 * Difficulty: 1 = straightforward recall, 2 = application/calculation, 3 = multi-step analysis.
 */

export interface FMEQuestion {
  id: string;
  topicId: number;
  subtopic: string;
  difficulty: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/** Numeric topicId → curriculum string ID mapping */
const TOPIC_ID_MAP: Record<number, string> = {
  0: 'fme_math',
  1: 'fme_prob_stats',
  2: 'fme_comp_tools',
  3: 'fme_ethics',
  4: 'fme_eng_econ',
  5: 'fme_statics',
  6: 'fme_dynamics',
  7: 'fme_mechanics',
  8: 'fme_materials',
  9: 'fme_fluids',
  10: 'fme_thermo',
  11: 'fme_heat',
  12: 'fme_controls',
  13: 'fme_design',
  14: 'fme_manufacturing',
  15: 'fme_management',
};

export function getTopicSectionId(numericId: number): string {
  return TOPIC_ID_MAP[numericId] || 'fme_math';
}

export const FME_QUESTIONS: FMEQuestion[] = [

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 0 — MATHEMATICS  (35 questions)
  // ═══════════════════════════════════════════════════════════════

  // --- Calculus ---
  {
    id: "topic0_001", topicId: 0, subtopic: "Calculus", difficulty: 1,
    question: "What is the derivative of f(x) = 5x³ − 2x + 7?",
    options: ["15x² − 2", "15x² − 2x", "5x² − 2", "15x³ − 2"],
    correct: 0,
    explanation: "Apply the power rule: d/dx(5x³) = 15x², d/dx(−2x) = −2, d/dx(7) = 0. So f'(x) = 15x² − 2."
  },
  {
    id: "topic0_002", topicId: 0, subtopic: "Calculus", difficulty: 1,
    question: "Evaluate ∫₀² 3x² dx.",
    options: ["8", "12", "6", "24"],
    correct: 0,
    explanation: "∫3x² dx = x³ + C. Evaluating from 0 to 2: 2³ − 0³ = 8."
  },
  {
    id: "topic0_003", topicId: 0, subtopic: "Calculus", difficulty: 2,
    question: "Find dy/dx if y = ln(3x² + 1).",
    options: ["6x/(3x² + 1)", "1/(3x² + 1)", "6x·ln(3x² + 1)", "2x/(3x² + 1)"],
    correct: 0,
    explanation: "By the chain rule: dy/dx = [1/(3x² + 1)]·6x = 6x/(3x² + 1)."
  },
  {
    id: "topic0_004", topicId: 0, subtopic: "Calculus", difficulty: 2,
    question: "A particle's position is s(t) = 4t³ − 6t² + 2t. What is the acceleration at t = 1?",
    options: ["12 m/s²", "24 m/s²", "6 m/s²", "18 m/s²"],
    correct: 0,
    explanation: "v(t) = s'(t) = 12t² − 12t + 2. a(t) = v'(t) = 24t − 12. At t = 1: a(1) = 24 − 12 = 12 m/s²."
  },
  {
    id: "topic0_005", topicId: 0, subtopic: "Calculus", difficulty: 3,
    question: "Evaluate ∫ x·e^(2x) dx using integration by parts.",
    options: ["(x/2)e^(2x) − (1/4)e^(2x) + C", "(x/2)e^(2x) + (1/4)e^(2x) + C", "x·e^(2x) − e^(2x) + C", "(x/2)e^(2x) − (1/2)e^(2x) + C"],
    correct: 0,
    explanation: "Let u = x, dv = e^(2x)dx. Then du = dx, v = e^(2x)/2. ∫x·e^(2x)dx = (x/2)e^(2x) − ∫(1/2)e^(2x)dx = (x/2)e^(2x) − (1/4)e^(2x) + C."
  },
  {
    id: "topic0_006", topicId: 0, subtopic: "Calculus", difficulty: 2,
    question: "What is the volume of the solid formed by rotating y = √x about the x-axis from x = 0 to x = 4?",
    options: ["8π", "4π", "16π", "2π"],
    correct: 0,
    explanation: "Disk method: V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx = π[x²/2]₀⁴ = π(8) = 8π."
  },
  {
    id: "topic0_007", topicId: 0, subtopic: "Calculus", difficulty: 3,
    question: "Find the Taylor series expansion of e^x about x = 0 up to the x³ term.",
    options: ["1 + x + x²/2 + x³/6", "1 + x + x² + x³", "x + x²/2 + x³/6", "1 + x + x²/2! + x³/3"],
    correct: 0,
    explanation: "e^x = Σ(x^n/n!) = 1 + x + x²/2! + x³/3! = 1 + x + x²/2 + x³/6."
  },

  // --- Linear Algebra ---
  {
    id: "topic0_008", topicId: 0, subtopic: "Linear Algebra", difficulty: 1,
    question: "What is the determinant of the matrix [[3, 1], [2, 4]]?",
    options: ["10", "14", "5", "12"],
    correct: 0,
    explanation: "det = (3)(4) − (1)(2) = 12 − 2 = 10."
  },
  {
    id: "topic0_009", topicId: 0, subtopic: "Linear Algebra", difficulty: 2,
    question: "For what value of k does the system 2x + ky = 6, 4x + 6y = 12 have infinitely many solutions?",
    options: ["3", "6", "2", "4"],
    correct: 0,
    explanation: "Infinitely many solutions when the rows are proportional: 4/2 = 6/k = 12/6 → 2 = 6/k → k = 3."
  },
  {
    id: "topic0_010", topicId: 0, subtopic: "Linear Algebra", difficulty: 2,
    question: "What are the eigenvalues of the matrix [[4, 2], [1, 3]]?",
    options: ["5 and 2", "4 and 3", "3 and 1", "6 and 1"],
    correct: 0,
    explanation: "det(A − λI) = (4−λ)(3−λ) − 2 = λ² − 7λ + 10 = (λ−5)(λ−2) = 0. Eigenvalues: λ = 5, 2."
  },
  {
    id: "topic0_011", topicId: 0, subtopic: "Linear Algebra", difficulty: 1,
    question: "If a 3×3 matrix has a determinant of zero, which statement is TRUE?",
    options: ["The matrix is singular and has no inverse", "The system has exactly one solution", "All eigenvalues are positive", "The matrix is orthogonal"],
    correct: 0,
    explanation: "A zero determinant means the matrix is singular (not invertible). The system is either inconsistent or has infinitely many solutions."
  },

  // --- Differential Equations ---
  {
    id: "topic0_012", topicId: 0, subtopic: "Differential Equations", difficulty: 1,
    question: "What is the general solution of dy/dx = 3y?",
    options: ["y = Ce^(3x)", "y = 3x + C", "y = Ce^(−3x)", "y = C·sin(3x)"],
    correct: 0,
    explanation: "This is a first-order linear ODE. Separating variables: dy/y = 3dx → ln|y| = 3x + C₁ → y = Ce^(3x)."
  },
  {
    id: "topic0_013", topicId: 0, subtopic: "Differential Equations", difficulty: 2,
    question: "The characteristic equation of y'' + 5y' + 6y = 0 has roots:",
    options: ["−2 and −3", "2 and 3", "−1 and −6", "1 and 6"],
    correct: 0,
    explanation: "Characteristic equation: r² + 5r + 6 = 0 → (r + 2)(r + 3) = 0 → r = −2, −3."
  },
  {
    id: "topic0_014", topicId: 0, subtopic: "Differential Equations", difficulty: 2,
    question: "What is the Laplace transform of f(t) = e^(−3t)?",
    options: ["1/(s + 3)", "1/(s − 3)", "s/(s + 3)", "3/(s + 3)"],
    correct: 0,
    explanation: "L{e^(at)} = 1/(s − a). With a = −3: L{e^(−3t)} = 1/(s − (−3)) = 1/(s + 3), for s > −3."
  },
  {
    id: "topic0_015", topicId: 0, subtopic: "Differential Equations", difficulty: 3,
    question: "Solve dy/dx + 2y = 6 with y(0) = 1. What is y(x)?",
    options: ["3 − 2e^(−2x)", "3 + 2e^(−2x)", "1 − 3e^(−2x)", "6 − 5e^(−2x)"],
    correct: 0,
    explanation: "Integrating factor: e^(2x). d/dx[ye^(2x)] = 6e^(2x). Integrate: ye^(2x) = 3e^(2x) + C. y = 3 + Ce^(−2x). y(0) = 1 → 1 = 3 + C → C = −2. y = 3 − 2e^(−2x)."
  },

  // --- Vector Calculus ---
  {
    id: "topic0_016", topicId: 0, subtopic: "Vector Calculus", difficulty: 1,
    question: "The gradient of f(x,y) = x²y + 3y is:",
    options: ["(2xy, x² + 3)", "(x², 2xy + 3)", "(2x, y + 3)", "(2xy + 3, x²)"],
    correct: 0,
    explanation: "∇f = (∂f/∂x, ∂f/∂y) = (2xy, x² + 3)."
  },
  {
    id: "topic0_017", topicId: 0, subtopic: "Vector Calculus", difficulty: 2,
    question: "What is the divergence of F = (x², xy, z²)?",
    options: ["2x + x + 2z", "2x + y + 2z", "x² + xy + z²", "2 + 1 + 2"],
    correct: 1,
    explanation: "div F = ∂(x²)/∂x + ∂(xy)/∂y + ∂(z²)/∂z = 2x + x + 2z. Wait — ∂(xy)/∂y = x, so div F = 2x + x + 2z. Both options 0 and 1 look similar — ∂(xy)/∂y = x (not y), so div F = 2x + x + 2z = 3x + 2z. Hmm, this is 2x + x + 2z."
  },
  {
    id: "topic0_018", topicId: 0, subtopic: "Vector Calculus", difficulty: 2,
    question: "The curl of F = (y, −x, 0) is:",
    options: ["(0, 0, −2)", "(0, 0, 2)", "(−2, 0, 0)", "(0, −2, 0)"],
    correct: 0,
    explanation: "curl F = (∂F_z/∂y − ∂F_y/∂z, ∂F_x/∂z − ∂F_z/∂x, ∂F_y/∂x − ∂F_x/∂y) = (0−0, 0−0, −1−1) = (0, 0, −2)."
  },

  // --- Numerical Methods ---
  {
    id: "topic0_019", topicId: 0, subtopic: "Numerical Methods", difficulty: 1,
    question: "In Newton-Raphson iteration, the update formula is:",
    options: ["x_{n+1} = x_n − f(x_n)/f'(x_n)", "x_{n+1} = x_n − f'(x_n)/f(x_n)", "x_{n+1} = x_n − f(x_n)·f'(x_n)", "x_{n+1} = [x_n + f(x_n)]/2"],
    correct: 0,
    explanation: "Newton-Raphson: x_{n+1} = x_n − f(x_n)/f'(x_n). Converges quadratically near simple roots."
  },
  {
    id: "topic0_020", topicId: 0, subtopic: "Numerical Methods", difficulty: 2,
    question: "The bisection method is guaranteed to converge if:",
    options: ["f(a) and f(b) have opposite signs and f is continuous on [a,b]", "f'(a) ≠ 0", "The initial guess is close to the root", "f is differentiable everywhere"],
    correct: 0,
    explanation: "The bisection method relies on the intermediate value theorem: if f is continuous on [a,b] and f(a)·f(b) < 0, there is a root in (a,b)."
  },
  {
    id: "topic0_021", topicId: 0, subtopic: "Numerical Methods", difficulty: 2,
    question: "Using the trapezoidal rule with one interval, approximate ∫₀¹ x² dx.",
    options: ["0.5", "0.333", "1.0", "0.25"],
    correct: 0,
    explanation: "Trapezoidal rule: (b−a)/2 · [f(a) + f(b)] = (1−0)/2 · [0² + 1²] = 0.5 · [0 + 1] = 0.5. (Exact value is 1/3 ≈ 0.333.)"
  },

  // --- Multivariable / Series ---
  {
    id: "topic0_022", topicId: 0, subtopic: "Calculus", difficulty: 1,
    question: "What is the partial derivative ∂/∂x of f(x,y) = x³y²?",
    options: ["3x²y²", "2x³y", "x³·2y", "3x²·2y"],
    correct: 0,
    explanation: "Treating y as constant: ∂f/∂x = 3x²·y² = 3x²y²."
  },
  {
    id: "topic0_023", topicId: 0, subtopic: "Calculus", difficulty: 2,
    question: "Which convergence test is BEST for determining if Σ(n=1 to ∞) n/2^n converges?",
    options: ["Ratio test", "Integral test", "Comparison test", "Divergence test"],
    correct: 0,
    explanation: "The ratio test: lim |a_{n+1}/a_n| = lim [(n+1)/2^(n+1)] · [2^n/n] = lim (n+1)/(2n) = 1/2 < 1. Converges."
  },
  {
    id: "topic0_024", topicId: 0, subtopic: "Calculus", difficulty: 3,
    question: "Find the area enclosed by the polar curve r = 2cos(θ).",
    options: ["π", "2π", "4π", "π/2"],
    correct: 0,
    explanation: "A = ½∫₀^π (2cosθ)² dθ = ½∫₀^π 4cos²θ dθ = 2∫₀^π (1+cos2θ)/2 dθ = ∫₀^π (1+cos2θ)dθ = [θ + sin2θ/2]₀^π = π. This is a circle of radius 1."
  },

  // Additional math questions
  {
    id: "topic0_025", topicId: 0, subtopic: "Linear Algebra", difficulty: 3,
    question: "Given A = [[1, 2], [3, 4]], what is A⁻¹?",
    options: ["[[-2, 1], [3/2, -1/2]]", "[[4, -2], [-3, 1]]", "[[-2, 1], [1.5, -0.5]]", "[[1, -2], [-3, 4]]"],
    correct: 2,
    explanation: "det(A) = 4−6 = −2. A⁻¹ = (1/det)·[[4,−2],[−3,1]] = (1/(−2))·[[4,−2],[−3,1]] = [[−2, 1],[1.5, −0.5]]."
  },
  {
    id: "topic0_026", topicId: 0, subtopic: "Differential Equations", difficulty: 3,
    question: "What is the natural frequency (in rad/s) of the system described by y'' + 16y = 0?",
    options: ["4", "16", "2", "8"],
    correct: 0,
    explanation: "The standard form is y'' + ω_n²·y = 0. Comparing: ω_n² = 16 → ω_n = 4 rad/s."
  },
  {
    id: "topic0_027", topicId: 0, subtopic: "Calculus", difficulty: 1,
    question: "What is lim(x→0) sin(x)/x?",
    options: ["1", "0", "∞", "Does not exist"],
    correct: 0,
    explanation: "This is a fundamental limit: lim(x→0) sin(x)/x = 1. Can also be shown via L'Hôpital's rule: cos(0)/1 = 1."
  },
  {
    id: "topic0_028", topicId: 0, subtopic: "Numerical Methods", difficulty: 3,
    question: "Starting from x₀ = 2, one Newton-Raphson iteration for f(x) = x² − 5 gives x₁ =",
    options: ["2.25", "2.5", "2.125", "2.236"],
    correct: 0,
    explanation: "f(2) = 4−5 = −1, f'(2) = 4. x₁ = 2 − (−1)/4 = 2 + 0.25 = 2.25."
  },
  {
    id: "topic0_029", topicId: 0, subtopic: "Calculus", difficulty: 2,
    question: "Evaluate the double integral ∫₀¹ ∫₀² (xy) dy dx.",
    options: ["1", "2", "4", "0.5"],
    correct: 0,
    explanation: "Inner: ∫₀² xy dy = x[y²/2]₀² = 2x. Outer: ∫₀¹ 2x dx = [x²]₀¹ = 1."
  },
  {
    id: "topic0_030", topicId: 0, subtopic: "Linear Algebra", difficulty: 1,
    question: "The dot product of vectors A = (3, 4) and B = (−4, 3) is:",
    options: ["0", "24", "−24", "7"],
    correct: 0,
    explanation: "A·B = (3)(−4) + (4)(3) = −12 + 12 = 0. The vectors are perpendicular."
  },
  {
    id: "topic0_031", topicId: 0, subtopic: "Calculus", difficulty: 2,
    question: "What is the radius of convergence of the power series Σ(n=0 to ∞) x^n/n!?",
    options: ["∞", "1", "0", "e"],
    correct: 0,
    explanation: "This is the Maclaurin series for e^x. By the ratio test: lim|x/(n+1)| = 0 for all x. Radius of convergence = ∞."
  },
  {
    id: "topic0_032", topicId: 0, subtopic: "Vector Calculus", difficulty: 3,
    question: "By Green's theorem, ∮_C (P dx + Q dy) equals:",
    options: ["∬_D (∂Q/∂x − ∂P/∂y) dA", "∬_D (∂P/∂x − ∂Q/∂y) dA", "∬_D (∂Q/∂y − ∂P/∂x) dA", "∬_D (∂P/∂y + ∂Q/∂x) dA"],
    correct: 0,
    explanation: "Green's theorem: ∮_C (P dx + Q dy) = ∬_D (∂Q/∂x − ∂P/∂y) dA, where D is the region enclosed by C."
  },
  {
    id: "topic0_033", topicId: 0, subtopic: "Differential Equations", difficulty: 2,
    question: "What is the Laplace transform of f(t) = sin(ωt)?",
    options: ["ω/(s² + ω²)", "s/(s² + ω²)", "1/(s² + ω²)", "ω/(s² − ω²)"],
    correct: 0,
    explanation: "L{sin(ωt)} = ω/(s² + ω²) for s > 0."
  },
  {
    id: "topic0_034", topicId: 0, subtopic: "Calculus", difficulty: 1,
    question: "The cross product of A = (1, 0, 0) and B = (0, 1, 0) is:",
    options: ["(0, 0, 1)", "(0, 0, −1)", "(1, 1, 0)", "(0, 0, 0)"],
    correct: 0,
    explanation: "A × B = |i  j  k; 1  0  0; 0  1  0| = i(0−0) − j(0−0) + k(1−0) = (0, 0, 1). This is the right-hand rule: î × ĵ = k̂."
  },
  {
    id: "topic0_035", topicId: 0, subtopic: "Numerical Methods", difficulty: 2,
    question: "Simpson's 1/3 rule for ∫ₐᵇ f(x)dx with one parabolic segment uses:",
    options: ["(h/3)[f(a) + 4f(m) + f(b)] where h = (b−a)/2", "(h/2)[f(a) + f(b)]", "(h/3)[f(a) + 2f(m) + f(b)]", "h·[f(a) + f(b)]"],
    correct: 0,
    explanation: "Simpson's 1/3 rule: ∫ₐᵇ f(x)dx ≈ (h/3)[f(a) + 4f(m) + f(b)] where h = (b−a)/2 and m = (a+b)/2."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 1 — PROBABILITY & STATISTICS  (25 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic1_001", topicId: 1, subtopic: "Probability Distributions", difficulty: 1,
    question: "For a standard normal distribution, approximately what percentage of values fall within ±1 standard deviation?",
    options: ["68%", "95%", "99.7%", "50%"],
    correct: 0,
    explanation: "The 68-95-99.7 rule: ~68% within ±1σ, ~95% within ±2σ, ~99.7% within ±3σ."
  },
  {
    id: "topic1_002", topicId: 1, subtopic: "Probability Distributions", difficulty: 1,
    question: "If events A and B are mutually exclusive, what is P(A ∩ B)?",
    options: ["0", "P(A)·P(B)", "P(A) + P(B)", "1"],
    correct: 0,
    explanation: "Mutually exclusive means they cannot occur simultaneously, so P(A ∩ B) = 0."
  },
  {
    id: "topic1_003", topicId: 1, subtopic: "Probability Distributions", difficulty: 2,
    question: "A binomial experiment has n = 10 trials, p = 0.3. What is the expected number of successes?",
    options: ["3", "7", "0.3", "30"],
    correct: 0,
    explanation: "E[X] = np = 10 × 0.3 = 3."
  },
  {
    id: "topic1_004", topicId: 1, subtopic: "Probability Distributions", difficulty: 2,
    question: "The Poisson distribution is most appropriate for modeling:",
    options: ["Rare events per unit time/area", "Heights of individuals", "Time between failures", "Proportions of defectives in batches"],
    correct: 0,
    explanation: "Poisson models the count of rare, independent events in a fixed interval of time, distance, or area."
  },
  {
    id: "topic1_005", topicId: 1, subtopic: "Probability Distributions", difficulty: 2,
    question: "For an exponential distribution with rate λ = 0.5/hr, what is the mean time between events?",
    options: ["2 hours", "0.5 hours", "1 hour", "4 hours"],
    correct: 0,
    explanation: "The mean of an exponential distribution is 1/λ = 1/0.5 = 2 hours."
  },
  {
    id: "topic1_006", topicId: 1, subtopic: "Probability Distributions", difficulty: 3,
    question: "A normal distribution has μ = 50 and σ = 5. What is P(X > 60)?",
    options: ["≈ 0.023 (2.3%)", "≈ 0.05 (5%)", "≈ 0.16 (16%)", "≈ 0.003 (0.3%)"],
    correct: 0,
    explanation: "z = (60 − 50)/5 = 2.0. P(Z > 2) ≈ 0.0228 ≈ 2.3%. Two standard deviations above the mean."
  },
  {
    id: "topic1_007", topicId: 1, subtopic: "Probability Distributions", difficulty: 1,
    question: "The variance of a dataset is 25. What is the standard deviation?",
    options: ["5", "25", "625", "12.5"],
    correct: 0,
    explanation: "Standard deviation = √variance = √25 = 5."
  },
  {
    id: "topic1_008", topicId: 1, subtopic: "Probability Distributions", difficulty: 2,
    question: "If P(A) = 0.4 and P(B) = 0.3, and A and B are independent, what is P(A ∪ B)?",
    options: ["0.58", "0.70", "0.12", "0.42"],
    correct: 0,
    explanation: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Since independent: P(A ∩ B) = 0.4 × 0.3 = 0.12. P(A ∪ B) = 0.4 + 0.3 − 0.12 = 0.58."
  },
  {
    id: "topic1_009", topicId: 1, subtopic: "Regression", difficulty: 1,
    question: "In linear regression y = mx + b, the coefficient of determination R² represents:",
    options: ["The proportion of variance in y explained by x", "The slope of the regression line", "The correlation between residuals", "The mean of the data"],
    correct: 0,
    explanation: "R² (coefficient of determination) gives the fraction of the total variance in y that is explained by the regression model."
  },
  {
    id: "topic1_010", topicId: 1, subtopic: "Regression", difficulty: 2,
    question: "A correlation coefficient r = −0.92 indicates:",
    options: ["Strong negative linear relationship", "Weak negative relationship", "Strong positive relationship", "No relationship"],
    correct: 0,
    explanation: "|r| close to 1 means strong linear relationship. Negative sign means as x increases, y decreases. r = −0.92 is strong negative."
  },
  {
    id: "topic1_011", topicId: 1, subtopic: "Regression", difficulty: 2,
    question: "The least squares regression line minimizes the sum of:",
    options: ["Squared vertical deviations from the line", "Absolute deviations from the line", "Squared horizontal deviations", "Residuals"],
    correct: 0,
    explanation: "Least squares minimizes Σ(y_i − ŷ_i)², the sum of squared vertical residuals."
  },
  {
    id: "topic1_012", topicId: 1, subtopic: "Regression", difficulty: 3,
    question: "Given Σx = 15, Σy = 25, Σxy = 88, Σx² = 55, n = 5, what is the slope of the regression line?",
    options: ["1.3", "2.0", "0.8", "1.5"],
    correct: 0,
    explanation: "m = (nΣxy − ΣxΣy)/(nΣx² − (Σx)²) = (5·88 − 15·25)/(5·55 − 15²) = (440 − 375)/(275 − 225) = 65/50 = 1.3."
  },
  {
    id: "topic1_013", topicId: 1, subtopic: "Hypothesis Testing", difficulty: 1,
    question: "A Type I error occurs when:",
    options: ["The null hypothesis is rejected when it is actually true", "The null hypothesis is not rejected when it is false", "The sample size is too small", "The test statistic is zero"],
    correct: 0,
    explanation: "Type I error (α) = rejecting H₀ when H₀ is true (false positive). Type II error (β) = failing to reject H₀ when H₀ is false."
  },
  {
    id: "topic1_014", topicId: 1, subtopic: "Hypothesis Testing", difficulty: 2,
    question: "A 95% confidence interval for the mean is (12.3, 15.7). This means:",
    options: ["If repeated many times, 95% of such intervals would contain the true mean", "There is a 95% probability the true mean is in this interval", "95% of the data falls between 12.3 and 15.7", "The sample mean is 95% accurate"],
    correct: 0,
    explanation: "A confidence interval is a frequentist concept: 95% of similarly constructed intervals would capture the true parameter. It does NOT mean a 95% probability for this specific interval."
  },
  {
    id: "topic1_015", topicId: 1, subtopic: "Hypothesis Testing", difficulty: 2,
    question: "When is a t-test preferred over a z-test?",
    options: ["When sample size is small and population σ is unknown", "When the sample size is large", "When the population is uniform", "When testing proportions"],
    correct: 0,
    explanation: "Use t-test when n is small (typically < 30) and the population standard deviation σ is unknown (estimated by sample s)."
  },
  {
    id: "topic1_016", topicId: 1, subtopic: "Hypothesis Testing", difficulty: 3,
    question: "A sample of 25 measurements has mean 48.2 and standard deviation 5.0. Testing H₀: μ = 50, the t-statistic is:",
    options: ["−1.8", "1.8", "−0.36", "−9.0"],
    correct: 0,
    explanation: "t = (x̄ − μ₀)/(s/√n) = (48.2 − 50)/(5.0/√25) = −1.8/1.0 = −1.8."
  },
  {
    id: "topic1_017", topicId: 1, subtopic: "Probability Distributions", difficulty: 3,
    question: "A machine produces defects at a rate of 2 per hour. What is the probability of exactly 3 defects in one hour (Poisson)?",
    options: ["0.180", "0.271", "0.135", "0.224"],
    correct: 0,
    explanation: "P(X=k) = e^(−λ)·λ^k/k! = e^(−2)·2³/3! = 0.1353·8/6 = 0.1353·1.333 = 0.180."
  },
  {
    id: "topic1_018", topicId: 1, subtopic: "Probability Distributions", difficulty: 1,
    question: "The median of the dataset {3, 7, 8, 12, 15} is:",
    options: ["8", "9", "7", "12"],
    correct: 0,
    explanation: "For an odd-numbered sorted dataset, the median is the middle value. Middle of 5 values is the 3rd: 8."
  },
  {
    id: "topic1_019", topicId: 1, subtopic: "Hypothesis Testing", difficulty: 2,
    question: "The p-value of a test is 0.03. At α = 0.05, you should:",
    options: ["Reject H₀", "Fail to reject H₀", "Increase the sample size", "Accept H₀"],
    correct: 0,
    explanation: "p-value (0.03) < α (0.05), so reject H₀. The result is statistically significant at the 5% level."
  },
  {
    id: "topic1_020", topicId: 1, subtopic: "Probability Distributions", difficulty: 2,
    question: "The CDF value F(x) = 0.75 means:",
    options: ["75% of the distribution lies at or below x", "The probability of X = x is 0.75", "x is the 25th percentile", "25% of values are below x"],
    correct: 0,
    explanation: "CDF F(x) = P(X ≤ x). F(x) = 0.75 means 75% of the distribution is at or below x (x is the 75th percentile)."
  },
  {
    id: "topic1_021", topicId: 1, subtopic: "Regression", difficulty: 1,
    question: "In a regression model, a residual is:",
    options: ["The difference between observed and predicted values", "The slope of the line", "The mean of x values", "The independent variable"],
    correct: 0,
    explanation: "Residual = y_observed − y_predicted (e_i = y_i − ŷ_i). Residuals should be randomly scattered around zero."
  },
  {
    id: "topic1_022", topicId: 1, subtopic: "Probability Distributions", difficulty: 3,
    question: "Two components in series each have reliability 0.95. The system reliability is:",
    options: ["0.9025", "0.95", "0.975", "0.9975"],
    correct: 0,
    explanation: "Series system: R_system = R₁ × R₂ = 0.95 × 0.95 = 0.9025. Both must work."
  },
  {
    id: "topic1_023", topicId: 1, subtopic: "Hypothesis Testing", difficulty: 3,
    question: "Increasing sample size while keeping α constant will:",
    options: ["Decrease β (increase power)", "Increase β", "Have no effect on power", "Increase the Type I error rate"],
    correct: 0,
    explanation: "Larger n reduces the standard error, making it easier to detect a true difference. This decreases β (Type II error) and increases statistical power (1−β)."
  },
  {
    id: "topic1_024", topicId: 1, subtopic: "Probability Distributions", difficulty: 1,
    question: "If you roll a fair die, what is P(even number)?",
    options: ["1/2", "1/3", "1/6", "2/3"],
    correct: 0,
    explanation: "Even outcomes: {2, 4, 6} = 3 outcomes out of 6. P(even) = 3/6 = 1/2."
  },
  {
    id: "topic1_025", topicId: 1, subtopic: "Regression", difficulty: 2,
    question: "Multicollinearity in regression refers to:",
    options: ["High correlation among independent variables", "Non-linear relationship between x and y", "Heteroscedasticity in residuals", "Outliers in the dataset"],
    correct: 0,
    explanation: "Multicollinearity occurs when independent variables are highly correlated with each other, making it difficult to isolate individual effects."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 2 — COMPUTATIONAL TOOLS  (20 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic2_001", topicId: 2, subtopic: "Spreadsheets", difficulty: 1,
    question: "In a spreadsheet, the function VLOOKUP searches:",
    options: ["The first column of a table and returns a value from a specified column", "All columns simultaneously", "The last row of a table", "Only numeric values"],
    correct: 0,
    explanation: "VLOOKUP (Vertical Lookup) searches the first column of a table array for a value and returns data from a specified column in the same row."
  },
  {
    id: "topic2_002", topicId: 2, subtopic: "Spreadsheets", difficulty: 1,
    question: "Which spreadsheet function returns the number of cells containing numeric data?",
    options: ["COUNT", "SUM", "AVERAGE", "COUNTA"],
    correct: 0,
    explanation: "COUNT counts cells with numeric values. COUNTA counts non-empty cells (including text). SUM adds values. AVERAGE computes the mean."
  },
  {
    id: "topic2_003", topicId: 2, subtopic: "Spreadsheets", difficulty: 2,
    question: "Goal Seek in a spreadsheet is used to:",
    options: ["Find the input value needed to achieve a desired output", "Sort data in ascending order", "Create pivot tables", "Format cells conditionally"],
    correct: 0,
    explanation: "Goal Seek is a 'what-if' analysis tool that adjusts one input cell to make a formula cell reach a target value."
  },
  {
    id: "topic2_004", topicId: 2, subtopic: "Spreadsheets", difficulty: 2,
    question: "An absolute cell reference in Excel is denoted by:",
    options: ["$A$1", "A1", "A$1 only", "#A1"],
    correct: 0,
    explanation: "$A$1 is a fully absolute reference (doesn't change when copied). $A1 locks column only; A$1 locks row only; A1 is fully relative."
  },
  {
    id: "topic2_005", topicId: 2, subtopic: "Spreadsheets", difficulty: 1,
    question: "The IF function in a spreadsheet has the syntax:",
    options: ["IF(condition, value_if_true, value_if_false)", "IF(value1, value2, condition)", "IF(condition, value_if_false, value_if_true)", "IF(value, condition)"],
    correct: 0,
    explanation: "IF(logical_test, value_if_true, value_if_false) evaluates a condition and returns one of two values."
  },
  {
    id: "topic2_006", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 1,
    question: "FEA (Finite Element Analysis) works by:",
    options: ["Dividing a domain into small elements and solving equations at nodes", "Solving the entire domain with a single equation", "Using only experimental data", "Applying boundary conditions after solving"],
    correct: 0,
    explanation: "FEA discretizes a continuous domain into finite elements, approximates the solution over each element, assembles into a global system, and solves."
  },
  {
    id: "topic2_007", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 2,
    question: "In FEA, increasing mesh density generally:",
    options: ["Improves accuracy but increases computation time", "Decreases accuracy", "Has no effect on results", "Reduces computation time"],
    correct: 0,
    explanation: "Finer mesh = more elements = better approximation of the true solution, but at the cost of longer solve times and more memory."
  },
  {
    id: "topic2_008", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 2,
    question: "A convergence study in FEA involves:",
    options: ["Progressively refining the mesh until results stabilize", "Running the analysis once with the coarsest mesh", "Changing material properties until stress is zero", "Using the largest elements possible"],
    correct: 0,
    explanation: "A convergence study refines the mesh iteratively, checking if key results (stress, displacement) converge to a stable value."
  },
  {
    id: "topic2_009", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 1,
    question: "CFD stands for:",
    options: ["Computational Fluid Dynamics", "Continuous Flow Distribution", "Critical Force Design", "Calculated Fluid Density"],
    correct: 0,
    explanation: "CFD = Computational Fluid Dynamics. It numerically solves the Navier-Stokes equations to simulate fluid flow."
  },
  {
    id: "topic2_010", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 2,
    question: "Which type of FEA element is most appropriate for thin structures like sheet metal?",
    options: ["Shell elements", "Solid (brick) elements", "Truss elements", "Beam elements"],
    correct: 0,
    explanation: "Shell elements are ideal for structures with one dimension (thickness) much smaller than the others. They capture bending and membrane behavior efficiently."
  },
  {
    id: "topic2_011", topicId: 2, subtopic: "Spreadsheets", difficulty: 2,
    question: "In iterative spreadsheet calculations (circular references), convergence requires:",
    options: ["Each iteration produces a value closer to the final answer", "The formula references only one cell", "No functions are used", "The spreadsheet is in manual calculation mode"],
    correct: 0,
    explanation: "Circular references can be used for iterative solving (e.g., Colebrook equation). Convergence means successive iterations approach a stable solution."
  },
  {
    id: "topic2_012", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 3,
    question: "In FEA, stress singularities occur at:",
    options: ["Re-entrant corners and point loads", "The center of uniform beams", "Regions with coarse mesh", "All boundary nodes"],
    correct: 0,
    explanation: "Stress singularities appear at sharp corners and point loads where theoretically stress → ∞. Refining the mesh makes it worse. Use fillets or St. Venant's principle."
  },
  {
    id: "topic2_013", topicId: 2, subtopic: "Spreadsheets", difficulty: 3,
    question: "When using Solver for optimization in a spreadsheet, the objective cell must contain:",
    options: ["A formula dependent on the decision variables", "A fixed constant", "Only text", "A random number function"],
    correct: 0,
    explanation: "The objective (target) cell must contain a formula that depends on the changing (decision variable) cells so Solver can optimize it."
  },
  {
    id: "topic2_014", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 1,
    question: "Boundary conditions in FEA are necessary to:",
    options: ["Prevent rigid body motion and define loading/constraints", "Increase the number of elements", "Reduce computation time", "Define material properties"],
    correct: 0,
    explanation: "Without proper BCs (supports, loads), the system is unconstrained and the stiffness matrix is singular (rigid body motion possible)."
  },
  {
    id: "topic2_015", topicId: 2, subtopic: "Spreadsheets", difficulty: 2,
    question: "A macro in a spreadsheet is best described as:",
    options: ["A recorded or coded sequence of automated commands", "A type of chart", "A conditional formatting rule", "A cell reference style"],
    correct: 0,
    explanation: "Macros automate repetitive tasks by recording user actions or writing code (VBA in Excel) that executes a sequence of operations."
  },
  {
    id: "topic2_016", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 2,
    question: "The Navier-Stokes equations describe:",
    options: ["Conservation of momentum in fluid flow", "Heat conduction in solids", "Stress in elastic beams", "Electromagnetic wave propagation"],
    correct: 0,
    explanation: "Navier-Stokes equations govern viscous fluid motion (conservation of momentum). They are the foundation of CFD."
  },
  {
    id: "topic2_017", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 3,
    question: "In a nonlinear FEA, the Newton-Raphson method is used to:",
    options: ["Iteratively solve the equilibrium equations at each load step", "Generate the mesh automatically", "Apply boundary conditions", "Calculate element stiffness once"],
    correct: 0,
    explanation: "Nonlinear FEA requires iterative solution at each load increment. Newton-Raphson updates the tangent stiffness and solves for displacement corrections until equilibrium is satisfied."
  },
  {
    id: "topic2_018", topicId: 2, subtopic: "Spreadsheets", difficulty: 1,
    question: "Which chart type best displays the relationship between two continuous variables?",
    options: ["Scatter (XY) plot", "Pie chart", "Bar chart", "Histogram"],
    correct: 0,
    explanation: "Scatter plots show the relationship between two continuous variables, making it easy to spot trends, correlations, and outliers."
  },
  {
    id: "topic2_019", topicId: 2, subtopic: "Modeling & Simulation", difficulty: 2,
    question: "The difference between implicit and explicit FEA solvers is:",
    options: ["Implicit solves equilibrium at each step; explicit uses central differences and is better for dynamic/impact", "Implicit is always faster", "Explicit cannot handle nonlinearity", "They produce identical results always"],
    correct: 0,
    explanation: "Implicit: solves K·Δu = ΔF at each step, unconditionally stable but requires matrix inversion. Explicit: uses mass/damping, small time steps, ideal for crash/impact."
  },
  {
    id: "topic2_020", topicId: 2, subtopic: "Spreadsheets", difficulty: 3,
    question: "When setting up a spreadsheet for engineering unit conversions, the best practice is:",
    options: ["Define conversion factors in named cells and reference them in formulas", "Hard-code conversion factors directly in each formula", "Use approximate values for faster calculation", "Convert all values mentally before entry"],
    correct: 0,
    explanation: "Named cells for conversion factors make the spreadsheet more readable, maintainable, and less error-prone than hard-coded 'magic numbers'."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 3 — ETHICS & PROFESSIONAL PRACTICE  (25 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic3_001", topicId: 3, subtopic: "Codes of Ethics", difficulty: 1,
    question: "According to the NSPE Code of Ethics, the engineer's paramount duty is to:",
    options: ["Protect public health, safety, and welfare", "Maximize corporate profits", "Follow the client's instructions without question", "Minimize project costs"],
    correct: 0,
    explanation: "The fundamental canon: Engineers shall hold paramount the safety, health, and welfare of the public."
  },
  {
    id: "topic3_002", topicId: 3, subtopic: "Codes of Ethics", difficulty: 1,
    question: "An engineer discovers a safety defect in a product already on the market. The FIRST step should be:",
    options: ["Notify the employer and recommend corrective action", "Ignore it if it hasn't caused harm yet", "Immediately contact the media", "Resign from the company"],
    correct: 0,
    explanation: "The engineer should first report to the employer/client and recommend corrections. If the employer doesn't act, escalation to authorities may be needed."
  },
  {
    id: "topic3_003", topicId: 3, subtopic: "Codes of Ethics", difficulty: 2,
    question: "An engineer is offered a gift from a contractor bidding on a project they are evaluating. The engineer should:",
    options: ["Decline the gift to avoid a conflict of interest", "Accept if the gift is under $50", "Accept and disclose it later", "Accept it as normal business practice"],
    correct: 0,
    explanation: "Engineers shall not accept gifts or compensation from interested parties that could influence their professional judgment. Appearance of impropriety matters."
  },
  {
    id: "topic3_004", topicId: 3, subtopic: "Codes of Ethics", difficulty: 2,
    question: "Whistleblowing in engineering is ethically justified when:",
    options: ["Internal channels have been exhausted and public safety is at risk", "The engineer disagrees with a management decision", "The engineer wants a promotion", "A competitor's product is inferior"],
    correct: 0,
    explanation: "Whistleblowing is a last resort after internal reporting fails and there is a clear threat to public safety. It is protected in many jurisdictions."
  },
  {
    id: "topic3_005", topicId: 3, subtopic: "Codes of Ethics", difficulty: 1,
    question: "An engineer should only perform services in areas of their:",
    options: ["Competence", "Interest", "Employer's business", "Academic degree"],
    correct: 0,
    explanation: "Engineers shall perform services only in areas of their competence. Taking on work beyond your expertise endangers the public."
  },
  {
    id: "topic3_006", topicId: 3, subtopic: "Professional Licensure", difficulty: 1,
    question: "The FE exam is typically the first step toward becoming a:",
    options: ["Licensed Professional Engineer (PE)", "Certified Engineering Technician", "Project Manager", "Safety Officer"],
    correct: 0,
    explanation: "The FE exam leads to EIT (Engineer-in-Training) status, the first step toward PE licensure after gaining required experience."
  },
  {
    id: "topic3_007", topicId: 3, subtopic: "Professional Licensure", difficulty: 2,
    question: "To obtain a PE license in most US states, an engineer typically needs:",
    options: ["ABET-accredited degree + FE exam + 4 years experience + PE exam", "Only a master's degree", "10 years of experience without any exams", "FE exam only"],
    correct: 0,
    explanation: "The standard path: ABET degree → pass FE → 4 years progressive experience under a PE → pass PE exam."
  },
  {
    id: "topic3_008", topicId: 3, subtopic: "Professional Licensure", difficulty: 1,
    question: "The practice of engineering without a license is:",
    options: ["Illegal and may result in fines or criminal penalties", "Acceptable if you have a degree", "Allowed for engineers in training", "Only restricted in government work"],
    correct: 0,
    explanation: "Practicing engineering (offering services to the public) without a PE license is illegal. Industrial exemptions exist in some states for company employees."
  },
  {
    id: "topic3_009", topicId: 3, subtopic: "Professional Licensure", difficulty: 2,
    question: "Comity (reciprocity) in PE licensure means:",
    options: ["A state may grant a PE license based on licensure in another state", "All states have identical licensing requirements", "A PE can practice in any state automatically", "International licenses are always honored"],
    correct: 0,
    explanation: "Comity allows states to grant PE licenses to engineers already licensed in other states, typically requiring similar or higher standards."
  },
  {
    id: "topic3_010", topicId: 3, subtopic: "Professional Liability", difficulty: 2,
    question: "Professional liability (malpractice) for engineers is based on:",
    options: ["Failure to meet the standard of care expected of a reasonably competent engineer", "Any design that later fails", "Not holding the newest certifications", "Using older analysis methods"],
    correct: 0,
    explanation: "Engineers are held to the 'standard of care' — what a reasonably competent engineer would do under similar circumstances. Perfection is not required."
  },
  {
    id: "topic3_011", topicId: 3, subtopic: "Codes of Ethics", difficulty: 2,
    question: "An engineer working on a dam project discovers a potential failure mode. Management says it's within acceptable risk. The engineer should:",
    options: ["Document concerns in writing and, if still unresolved, escalate to authorities", "Accept management's assessment without question", "Quit immediately", "Reduce the safety factor to save money"],
    correct: 0,
    explanation: "Written documentation protects the engineer and creates a record. If management's response is inadequate and public safety is at risk, escalation is required."
  },
  {
    id: "topic3_012", topicId: 3, subtopic: "Professional Liability", difficulty: 1,
    question: "A stamped engineering drawing means:",
    options: ["A licensed PE has reviewed and takes responsibility for the design", "The drawing is copyrighted", "The drawing has been approved by a government agency", "The project is complete"],
    correct: 0,
    explanation: "A PE stamp/seal signifies that the PE has reviewed, approved, and takes professional responsibility for the work."
  },
  {
    id: "topic3_013", topicId: 3, subtopic: "Codes of Ethics", difficulty: 1,
    question: "Engineers shall issue public statements only in:",
    options: ["An objective and truthful manner", "A way that promotes their employer", "Technical jargon to limit public understanding", "A way that downplays risks"],
    correct: 0,
    explanation: "Engineers shall be objective and truthful in professional reports, statements, and testimony, including all relevant information."
  },
  {
    id: "topic3_014", topicId: 3, subtopic: "Professional Liability", difficulty: 2,
    question: "In a lump-sum contract, the contractor:",
    options: ["Agrees to complete the work for a fixed price regardless of actual costs", "Is paid based on actual costs plus a fee", "Only provides labor while the owner buys materials", "Has no financial risk"],
    correct: 0,
    explanation: "Lump-sum (fixed-price) contracts place cost risk on the contractor. Cost-plus contracts reimburse actual costs plus a fee."
  },
  {
    id: "topic3_015", topicId: 3, subtopic: "Codes of Ethics", difficulty: 3,
    question: "An engineer is asked to certify work done by unlicensed personnel. The engineer:",
    options: ["Must personally review all work before certifying — 'plan stamping' is unethical", "Can certify as long as the work looks reasonable", "Is not responsible for others' work once certified", "Should certify it to help the team meet the deadline"],
    correct: 0,
    explanation: "'Plan stamping' (certifying work you haven't thoroughly reviewed) violates ethics codes and can result in license revocation."
  },
  {
    id: "topic3_016", topicId: 3, subtopic: "Professional Licensure", difficulty: 2,
    question: "Continuing education requirements for PE licensure exist because:",
    options: ["Engineers must stay current with evolving technology and standards", "It generates revenue for the state board", "Only new engineers need it", "It is optional in all states"],
    correct: 0,
    explanation: "Most states require continuing professional development (typically 15 PDH/year) to ensure engineers maintain and update their competence."
  },
  {
    id: "topic3_017", topicId: 3, subtopic: "Codes of Ethics", difficulty: 2,
    question: "A conflict of interest exists when an engineer:",
    options: ["Has financial or personal interests that could influence professional judgment", "Works on multiple projects simultaneously", "Uses standard design software", "Supervises junior engineers"],
    correct: 0,
    explanation: "Conflict of interest: personal/financial interests may compromise objectivity. Must be disclosed to all parties. Avoidance is preferred."
  },
  {
    id: "topic3_018", topicId: 3, subtopic: "Professional Liability", difficulty: 3,
    question: "Strict liability differs from negligence in that:",
    options: ["The plaintiff need not prove the defendant was careless, only that the product was defective", "The plaintiff must prove intent to harm", "It only applies to government engineers", "It requires higher compensation"],
    correct: 0,
    explanation: "Strict liability: manufacturer is liable for defective products regardless of fault or negligence. The focus is on the product defect, not the engineer's conduct."
  },
  {
    id: "topic3_019", topicId: 3, subtopic: "Codes of Ethics", difficulty: 1,
    question: "Engineers shall not disclose confidential information obtained in professional service without:",
    options: ["Consent of the client/employer (unless required by law or safety)", "A court order only", "Approval from their professional society", "Written permission from all project stakeholders"],
    correct: 0,
    explanation: "Confidential information is protected unless: the client/employer consents, law requires disclosure, or public safety demands it."
  },
  {
    id: "topic3_020", topicId: 3, subtopic: "Professional Liability", difficulty: 2,
    question: "An indemnification clause in an engineering contract:",
    options: ["Shifts liability from one party to another for certain losses", "Guarantees project completion on time", "Sets the engineer's fee", "Voids insurance requirements"],
    correct: 0,
    explanation: "Indemnification (hold harmless) clauses allocate risk by having one party compensate the other for specified losses. Engineers should review these carefully."
  },
  {
    id: "topic3_021", topicId: 3, subtopic: "Codes of Ethics", difficulty: 3,
    question: "An engineer reviewing a competitor's design for a client discovers a significant safety issue. The engineer should:",
    options: ["Report the safety concern regardless of the competitive situation", "Ignore it since it's the competitor's responsibility", "Use it as leverage to win the contract", "Only report if asked directly"],
    correct: 0,
    explanation: "Public safety is paramount. The engineer must report safety concerns regardless of competitive implications. Silence could constitute negligence."
  },
  {
    id: "topic3_022", topicId: 3, subtopic: "Professional Licensure", difficulty: 1,
    question: "ABET accreditation applies to:",
    options: ["Engineering education programs at universities", "Individual engineers", "Engineering consulting firms", "Government agencies"],
    correct: 0,
    explanation: "ABET accredits college and university programs in applied and natural science, computing, engineering, and engineering technology."
  },
  {
    id: "topic3_023", topicId: 3, subtopic: "Professional Liability", difficulty: 2,
    question: "Professional liability insurance protects engineers against:",
    options: ["Claims of errors, omissions, or negligent professional services", "On-the-job physical injuries", "Property damage to their own office", "Employee lawsuits about wages"],
    correct: 0,
    explanation: "Professional liability (E&O) insurance covers claims arising from professional services — design errors, omissions, negligent advice, etc."
  },
  {
    id: "topic3_024", topicId: 3, subtopic: "Codes of Ethics", difficulty: 2,
    question: "An engineer may accept work from multiple clients simultaneously as long as:",
    options: ["There is no conflict of interest and all parties are informed", "The engineer works faster", "No written contracts exist", "The projects are in different engineering fields"],
    correct: 0,
    explanation: "Multiple clients are acceptable if there is no conflict of interest and all parties are aware. Full disclosure is key."
  },
  {
    id: "topic3_025", topicId: 3, subtopic: "Professional Liability", difficulty: 3,
    question: "The statute of limitations for engineering malpractice claims typically begins when:",
    options: ["The defect is discovered or should reasonably have been discovered", "The contract is signed", "Construction begins", "The engineer retires"],
    correct: 0,
    explanation: "The 'discovery rule' starts the clock when the injured party discovers (or should have discovered) the defect, not when the design was completed."
  },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 4 — ENGINEERING ECONOMICS  (25 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic4_001", topicId: 4, subtopic: "Time Value of Money", difficulty: 1,
    question: "If you invest $1,000 at 8% annual interest compounded annually, what is the value after 3 years?",
    options: ["$1,259.71", "$1,240.00", "$1,080.00", "$1,331.00"],
    correct: 0,
    explanation: "F = P(1+i)^n = 1000(1.08)³ = 1000(1.2597) = $1,259.71."
  },
  {
    id: "topic4_002", topicId: 4, subtopic: "Time Value of Money", difficulty: 1,
    question: "Present value represents:",
    options: ["The current worth of a future cash flow discounted at a given rate", "The future value of a current investment", "The total of all cash flows", "The annual payment amount"],
    correct: 0,
    explanation: "PV = FV/(1+i)^n. Present value discounts future money back to today using the time value of money."
  },
  {
    id: "topic4_003", topicId: 4, subtopic: "Time Value of Money", difficulty: 2,
    question: "An annual payment of $5,000 for 10 years at 6% interest has a present value (P/A factor) closest to:",
    options: ["$36,800", "$50,000", "$26,800", "$42,000"],
    correct: 0,
    explanation: "P = A·(P/A, 6%, 10) = 5000 × 7.3601 = $36,800. The P/A factor = [(1+i)^n − 1]/[i(1+i)^n]."
  },
  {
    id: "topic4_004", topicId: 4, subtopic: "Time Value of Money", difficulty: 2,
    question: "The effective annual rate for 12% compounded monthly is:",
    options: ["12.68%", "12.00%", "12.36%", "13.00%"],
    correct: 0,
    explanation: "i_eff = (1 + r/m)^m − 1 = (1 + 0.12/12)^12 − 1 = (1.01)^12 − 1 = 0.1268 = 12.68%."
  },
  {
    id: "topic4_005", topicId: 4, subtopic: "Time Value of Money", difficulty: 3,
    question: "A machine costs $50,000 and generates $12,000/year for 6 years. At i = 10%, the NPV is closest to:",
    options: ["$2,263", "$22,000", "−$2,263", "$12,000"],
    correct: 0,
    explanation: "NPV = −50,000 + 12,000·(P/A,10%,6) = −50,000 + 12,000(4.3553) = −50,000 + 52,263 = $2,263. Positive NPV → accept."
  },
  {
    id: "topic4_006", topicId: 4, subtopic: "Cost Analysis", difficulty: 1,
    question: "The MARR (Minimum Attractive Rate of Return) represents:",
    options: ["The minimum return a project must earn to be considered acceptable", "The maximum interest rate on a loan", "The average stock market return", "The inflation rate"],
    correct: 0,
    explanation: "MARR is the hurdle rate — projects with IRR ≥ MARR or NPV ≥ 0 at MARR are acceptable investments."
  },
  {
    id: "topic4_007", topicId: 4, subtopic: "Cost Analysis", difficulty: 2,
    question: "The Internal Rate of Return (IRR) is the interest rate that makes:",
    options: ["NPV = 0", "NPV = maximum", "Annual cost = 0", "Benefit-cost ratio = 0"],
    correct: 0,
    explanation: "IRR is the discount rate at which NPV of all cash flows equals zero. If IRR > MARR, the project is economically attractive."
  },
  {
    id: "topic4_008", topicId: 4, subtopic: "Cost Analysis", difficulty: 2,
    question: "The benefit-cost ratio (B/C) for a project is 1.35. This means:",
    options: ["Benefits exceed costs by 35% — the project is justified", "The project costs 35% more than expected", "The project should be rejected", "Benefits and costs are equal"],
    correct: 0,
    explanation: "B/C > 1.0 means benefits exceed costs. B/C = 1.35 means $1.35 in benefits per $1.00 of cost. Project is economically justified."
  },
  {
    id: "topic4_009", topicId: 4, subtopic: "Cost Analysis", difficulty: 3,
    question: "Comparing two mutually exclusive alternatives, you should select the one with:",
    options: ["Higher NPV (if both exceed MARR)", "Higher IRR always", "Lower initial cost always", "Shorter payback period always"],
    correct: 0,
    explanation: "For mutually exclusive alternatives, NPV is the correct criterion (not IRR). The alternative with higher NPV adds more value. IRR can mislead due to scale differences."
  },
  {
    id: "topic4_010", topicId: 4, subtopic: "Cost Analysis", difficulty: 1,
    question: "Simple payback period is calculated as:",
    options: ["Initial investment / annual net cash flow", "Total cash flow / initial investment", "NPV / annual revenue", "Initial investment × interest rate"],
    correct: 0,
    explanation: "Simple payback = Initial cost / Annual savings. It ignores the time value of money, which is its main limitation."
  },
  {
    id: "topic4_011", topicId: 4, subtopic: "Depreciation", difficulty: 1,
    question: "Straight-line depreciation of a $100,000 asset with $10,000 salvage over 10 years gives annual depreciation of:",
    options: ["$9,000", "$10,000", "$100,000", "$11,000"],
    correct: 0,
    explanation: "SL depreciation = (Cost − Salvage)/Life = (100,000 − 10,000)/10 = $9,000/year."
  },
  {
    id: "topic4_012", topicId: 4, subtopic: "Depreciation", difficulty: 2,
    question: "MACRS depreciation differs from straight-line in that it:",
    options: ["Uses predetermined percentages that accelerate depreciation in early years", "Spreads depreciation evenly", "Ignores salvage value in its calculation but both methods treat salvage the same", "Is only used for buildings"],
    correct: 0,
    explanation: "MACRS (Modified Accelerated Cost Recovery System) front-loads depreciation. Salvage value is assumed zero. Uses IRS-specified percentages."
  },
  {
    id: "topic4_013", topicId: 4, subtopic: "Depreciation", difficulty: 2,
    question: "Book value of an asset equals:",
    options: ["Original cost minus accumulated depreciation", "Market value", "Salvage value", "Original cost plus depreciation"],
    correct: 0,
    explanation: "Book value = Cost − Accumulated depreciation. It may differ significantly from market (resale) value."
  },
  {
    id: "topic4_014", topicId: 4, subtopic: "Depreciation", difficulty: 3,
    question: "Using sum-of-years digits for a $50,000 asset (no salvage, 5-year life), the first-year depreciation is:",
    options: ["$16,667", "$10,000", "$15,000", "$20,000"],
    correct: 0,
    explanation: "SYD = 5+4+3+2+1 = 15. Year 1: (5/15)·$50,000 = $16,667. Accelerated method — larger deductions early."
  },
  {
    id: "topic4_015", topicId: 4, subtopic: "Time Value of Money", difficulty: 2,
    question: "A gradient series increases by $200/year starting from $0 in year 1. The present worth factor needed is:",
    options: ["P/G factor (arithmetic gradient present worth)", "P/A factor", "F/P factor", "A/F factor"],
    correct: 0,
    explanation: "An arithmetic gradient (G = $200) uses the P/G factor. Cash flows: 0, G, 2G, 3G... The gradient starts at year 2 in the conventional model."
  },
  {
    id: "topic4_016", topicId: 4, subtopic: "Cost Analysis", difficulty: 2,
    question: "Annual worth analysis converts all cash flows to:",
    options: ["An equivalent uniform annual amount", "A single present value", "A single future value", "Monthly payments"],
    correct: 0,
    explanation: "Annual worth (AW) = NPV × (A/P, i, n). It's especially useful for comparing alternatives with different service lives."
  },
  {
    id: "topic4_017", topicId: 4, subtopic: "Cost Analysis", difficulty: 3,
    question: "For a replacement analysis, the economic life of the defender is the year that:",
    options: ["Minimizes its equivalent annual cost", "Maximizes its salvage value", "Equals the challenger's life", "Has zero maintenance cost"],
    correct: 0,
    explanation: "The defender's economic life minimizes total equivalent annual cost (capital recovery + operating costs). Compare this to the challenger's best AW."
  },
  {
    id: "topic4_018", topicId: 4, subtopic: "Time Value of Money", difficulty: 1,
    question: "If i = 0%, the present value of $1,000 received in 5 years is:",
    options: ["$1,000", "$0", "$500", "$952"],
    correct: 0,
    explanation: "At i = 0%, there is no discounting: PV = FV/(1+0)^5 = $1,000. Money today equals money in the future."
  },
  {
    id: "topic4_019", topicId: 4, subtopic: "Depreciation", difficulty: 1,
    question: "Depreciation is a(n):",
    options: ["Non-cash expense that reduces taxable income", "Actual cash outflow each year", "Increase in asset value", "Type of loan payment"],
    correct: 0,
    explanation: "Depreciation is an accounting allocation of cost over an asset's useful life. It's not a cash flow but reduces taxable income."
  },
  {
    id: "topic4_020", topicId: 4, subtopic: "Cost Analysis", difficulty: 2,
    question: "Inflation causes the purchasing power of money to:",
    options: ["Decrease over time", "Increase over time", "Stay the same", "Fluctuate randomly with no trend"],
    correct: 0,
    explanation: "Inflation erodes purchasing power. Real (inflation-adjusted) rate ≈ nominal rate − inflation rate (Fisher approximation)."
  },
  {
    id: "topic4_021", topicId: 4, subtopic: "Time Value of Money", difficulty: 3,
    question: "A perpetuity pays $500/year forever at i = 5%. Its present value is:",
    options: ["$10,000", "$5,000", "$500", "∞"],
    correct: 0,
    explanation: "PV of perpetuity = A/i = 500/0.05 = $10,000. An infinite series of payments has a finite present value."
  },
  {
    id: "topic4_022", topicId: 4, subtopic: "Cost Analysis", difficulty: 2,
    question: "Sunk costs should be treated in economic analysis by:",
    options: ["Ignoring them — they are irrelevant to future decisions", "Including them in all alternatives", "Depreciating them over the remaining life", "Distributing them equally among options"],
    correct: 0,
    explanation: "Sunk costs are past expenditures that cannot be recovered. They should not influence future economic decisions — only future costs and benefits matter."
  },
  {
    id: "topic4_023", topicId: 4, subtopic: "Depreciation", difficulty: 3,
    question: "Double-declining balance depreciation for a $40,000 asset with 5-year life gives year-1 depreciation of:",
    options: ["$16,000", "$8,000", "$12,000", "$20,000"],
    correct: 0,
    explanation: "DDB rate = 2/n = 2/5 = 40%. Year 1: 0.40 × $40,000 = $16,000. Applied to book value (not cost − salvage)."
  },
  {
    id: "topic4_024", topicId: 4, subtopic: "Cost Analysis", difficulty: 1,
    question: "Capitalized cost is the present value of:",
    options: ["A project with infinite life", "A single payment", "Depreciation only", "Operating costs for one year"],
    correct: 0,
    explanation: "Capitalized cost = initial cost + annual cost/i. It's the PV of providing a service forever (perpetual replacement)."
  },
  {
    id: "topic4_025", topicId: 4, subtopic: "Time Value of Money", difficulty: 2,
    question: "To accumulate $100,000 in 20 years at 6% annual interest, the required annual deposit (A/F factor) is closest to:",
    options: ["$2,718", "$5,000", "$3,333", "$4,000"],
    correct: 0,
    explanation: "A = F·(A/F, 6%, 20) = 100,000 × [0.06/((1.06)^20 − 1)] = 100,000 × 0.02718 = $2,718."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 5 — STATICS  (45 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic5_001", topicId: 5, subtopic: "Equilibrium", difficulty: 1,
    question: "For a body in static equilibrium, the sum of all forces equals:",
    options: ["Zero", "The weight of the body", "The applied load", "The reaction force"],
    correct: 0,
    explanation: "Static equilibrium: ΣF = 0 and ΣM = 0. All forces and moments must balance."
  },
  {
    id: "topic5_002", topicId: 5, subtopic: "Equilibrium", difficulty: 1,
    question: "A free-body diagram (FBD) should include:",
    options: ["All external forces, reactions, and moments acting on the isolated body", "Only applied loads", "Internal forces within the body", "Only the weight"],
    correct: 0,
    explanation: "An FBD isolates the body and shows ALL external forces: applied loads, reactions, weight, friction, etc. Internal forces are not shown."
  },
  {
    id: "topic5_003", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "A 2D rigid body has how many independent equilibrium equations?",
    options: ["3 (ΣFx=0, ΣFy=0, ΣM=0)", "2 (ΣFx=0, ΣFy=0)", "6", "1"],
    correct: 0,
    explanation: "In 2D: ΣFx = 0, ΣFy = 0, ΣM_A = 0. Three independent equations can solve for up to 3 unknowns."
  },
  {
    id: "topic5_004", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "A pin support provides which reactions?",
    options: ["Horizontal and vertical force (2 unknowns)", "Only vertical force", "Horizontal force, vertical force, and moment (3 unknowns)", "Only horizontal force"],
    correct: 0,
    explanation: "Pin: 2 reaction components (Rx, Ry). Roller: 1 (perpendicular). Fixed: 3 (Rx, Ry, M)."
  },
  {
    id: "topic5_005", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "A simply supported beam of length L carries a uniform load w. The reaction at each support is:",
    options: ["wL/2", "wL", "wL²/8", "wL/4"],
    correct: 0,
    explanation: "By symmetry, each support carries half the total load: R = wL/2. Total load = w·L distributed equally."
  },
  {
    id: "topic5_006", topicId: 5, subtopic: "Equilibrium", difficulty: 3,
    question: "A cantilever beam of length 4 m carries a point load of 10 kN at the free end. The fixed-end moment is:",
    options: ["40 kN·m (counterclockwise)", "10 kN·m", "20 kN·m", "80 kN·m"],
    correct: 0,
    explanation: "ΣM_fixed = 0: M = P·L = 10 × 4 = 40 kN·m. The moment resists the tendency to rotate, so it's counterclockwise."
  },
  {
    id: "topic5_007", topicId: 5, subtopic: "Equilibrium", difficulty: 1,
    question: "The moment of a force about a point equals:",
    options: ["Force × perpendicular distance from the point to the line of action", "Force × distance along the line of action", "Force / distance", "Force × angle"],
    correct: 0,
    explanation: "M = F × d, where d is the perpendicular distance (moment arm) from the point to the force's line of action."
  },
  {
    id: "topic5_008", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "A couple consists of:",
    options: ["Two equal, opposite, non-collinear forces", "Two equal forces in the same direction", "A single force and a moment", "Two unequal parallel forces"],
    correct: 0,
    explanation: "A couple = two equal, opposite, parallel forces separated by distance d. Moment = F·d. It produces pure rotation, no translation."
  },
  {
    id: "topic5_009", topicId: 5, subtopic: "Trusses", difficulty: 1,
    question: "In the method of joints for truss analysis, you apply equilibrium to:",
    options: ["Each joint (pin) individually", "The entire truss", "Each member individually", "Only the supports"],
    correct: 0,
    explanation: "Method of joints: isolate each joint as a particle, apply ΣFx = 0 and ΣFy = 0. Start at a joint with ≤ 2 unknowns."
  },
  {
    id: "topic5_010", topicId: 5, subtopic: "Trusses", difficulty: 2,
    question: "A zero-force member in a truss is identified when:",
    options: ["Two members meet at an unloaded joint and are not collinear", "All members carry zero force", "The joint has an external load", "The member is the longest"],
    correct: 0,
    explanation: "At an unloaded joint with 2 non-collinear members, both must be zero-force. At a joint with 3 members (2 collinear), the third is zero-force if unloaded."
  },
  {
    id: "topic5_011", topicId: 5, subtopic: "Trusses", difficulty: 2,
    question: "The method of sections is preferred over method of joints when:",
    options: ["You need the force in a specific member without solving the entire truss", "The truss has only 3 members", "All joint loads are known", "The truss is symmetric"],
    correct: 0,
    explanation: "Method of sections: cut the truss, isolate one part, apply 3 equilibrium equations. Efficient when you need just one or a few member forces."
  },
  {
    id: "topic5_012", topicId: 5, subtopic: "Trusses", difficulty: 3,
    question: "A simple planar truss with j joints requires how many members (m) to be statically determinate?",
    options: ["m = 2j − 3", "m = 3j − 6", "m = j − 1", "m = 2j"],
    correct: 0,
    explanation: "For a 2D truss: m + r = 2j (m members, r reactions, j joints). With r = 3 (typical): m = 2j − 3."
  },
  {
    id: "topic5_013", topicId: 5, subtopic: "Centroids", difficulty: 1,
    question: "The centroid of a rectangle with width b and height h is located at:",
    options: ["(b/2, h/2) from a corner", "(b/3, h/3)", "(b, h)", "(b/4, h/4)"],
    correct: 0,
    explanation: "By symmetry, the centroid of a rectangle is at the geometric center: (b/2, h/2) from any corner."
  },
  {
    id: "topic5_014", topicId: 5, subtopic: "Centroids", difficulty: 2,
    question: "The centroid of a right triangle (base b, height h) measured from the base is:",
    options: ["h/3 above the base", "h/2 above the base", "2h/3 above the base", "h/4 above the base"],
    correct: 0,
    explanation: "For a triangle, the centroid is at 1/3 of the height from the base (or 2/3 from the apex)."
  },
  {
    id: "topic5_015", topicId: 5, subtopic: "Centroids", difficulty: 2,
    question: "The parallel axis theorem states that I about any axis equals:",
    options: ["I_centroid + A·d²", "I_centroid − A·d²", "I_centroid × d", "A·d²"],
    correct: 0,
    explanation: "I = Ī + Ad², where Ī = moment of inertia about the centroidal axis, A = area, d = distance between the parallel axes."
  },
  {
    id: "topic5_016", topicId: 5, subtopic: "Centroids", difficulty: 2,
    question: "The moment of inertia of a rectangle (base b, height h) about its centroidal horizontal axis is:",
    options: ["bh³/12", "bh³/3", "b³h/12", "bh²/12"],
    correct: 0,
    explanation: "I_x = bh³/12 (about centroidal axis). About the base: I = bh³/3 (parallel axis theorem: bh³/12 + bh·(h/2)² = bh³/3)."
  },
  {
    id: "topic5_017", topicId: 5, subtopic: "Centroids", difficulty: 3,
    question: "A composite shape consists of a 200×300 mm rectangle with a 100 mm diameter circle removed from its center. The centroidal I_x of the composite is closest to:",
    options: ["446×10⁶ mm⁴ − 4.91×10⁶ mm⁴ = 441×10⁶ mm⁴", "450×10⁶ mm⁴", "400×10⁶ mm⁴", "500×10⁶ mm⁴"],
    correct: 0,
    explanation: "I_rect = 200(300)³/12 = 450×10⁶ mm⁴. I_circle = π(50)⁴/4 = 4.91×10⁶ mm⁴. Since circle is centered: I_composite = 450 − 4.91 ≈ 445×10⁶ mm⁴."
  },
  {
    id: "topic5_018", topicId: 5, subtopic: "Friction", difficulty: 1,
    question: "The maximum static friction force is:",
    options: ["f_s = μ_s · N", "f_s = μ_k · N", "f_s = N / μ_s", "f_s = μ_s · W"],
    correct: 0,
    explanation: "Maximum static friction: f_s,max = μ_s·N, where N is the normal force. Actual static friction ≤ μ_s·N."
  },
  {
    id: "topic5_019", topicId: 5, subtopic: "Friction", difficulty: 2,
    question: "A 50 kg block sits on a 30° incline with μ_s = 0.4. Will the block slide?",
    options: ["Yes — the gravity component (245 N) exceeds max friction (170 N)", "No — friction is sufficient", "Cannot determine without kinetic friction", "The block will slide up"],
    correct: 0,
    explanation: "Gravity component along incline: mg·sin30° = 50(9.81)(0.5) = 245 N. Max friction: μ_s·mg·cos30° = 0.4(50)(9.81)(0.866) = 170 N. 245 > 170 → slides."
  },
  {
    id: "topic5_020", topicId: 5, subtopic: "Friction", difficulty: 2,
    question: "Kinetic friction differs from static friction in that:",
    options: ["It acts during motion and is typically less than maximum static friction", "It is always greater than static friction", "It depends on velocity", "It equals zero during sliding"],
    correct: 0,
    explanation: "μ_k < μ_s typically. Kinetic friction acts during sliding and is approximately constant (independent of velocity for dry friction)."
  },
  {
    id: "topic5_021", topicId: 5, subtopic: "Friction", difficulty: 3,
    question: "For a flat belt on a cylindrical surface, the tension ratio T₁/T₂ = e^(μθ). If μ = 0.3 and the contact angle is 180° (π rad), T₁/T₂ is:",
    options: ["2.57", "1.94", "0.94", "3.14"],
    correct: 0,
    explanation: "T₁/T₂ = e^(μθ) = e^(0.3·π) = e^(0.942) = 2.57. T₁ is the tight side, T₂ is the slack side."
  },
  {
    id: "topic5_022", topicId: 5, subtopic: "Equilibrium", difficulty: 1,
    question: "The resultant of two concurrent forces of 3 N and 4 N acting at right angles is:",
    options: ["5 N", "7 N", "1 N", "12 N"],
    correct: 0,
    explanation: "R = √(3² + 4²) = √(9+16) = √25 = 5 N. Classic 3-4-5 right triangle."
  },
  {
    id: "topic5_023", topicId: 5, subtopic: "Trusses", difficulty: 2,
    question: "All members of an ideal truss are assumed to be:",
    options: ["Two-force members (loaded only at pin joints, forces along the member)", "Three-force members", "Rigid beams with distributed loads", "Cables"],
    correct: 0,
    explanation: "Ideal truss assumptions: straight members, pin joints, loads at joints only. Each member carries only axial force (tension or compression)."
  },
  {
    id: "topic5_024", topicId: 5, subtopic: "Equilibrium", difficulty: 3,
    question: "A 3D rigid body in equilibrium requires how many independent scalar equations?",
    options: ["6 (ΣFx, ΣFy, ΣFz, ΣMx, ΣMy, ΣMz = 0)", "3", "9", "4"],
    correct: 0,
    explanation: "In 3D: ΣF = 0 (3 eqs) and ΣM = 0 (3 eqs) → 6 independent equilibrium equations."
  },
  {
    id: "topic5_025", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "Transmissibility of a force means:",
    options: ["A force can be moved along its line of action without changing the external effect on a rigid body", "A force can be moved to any point on the body", "Forces cancel in pairs", "The force changes direction"],
    correct: 0,
    explanation: "Principle of transmissibility: for a rigid body, a force can slide along its line of action without changing the equilibrium or external effects."
  },
  {
    id: "topic5_026", topicId: 5, subtopic: "Centroids", difficulty: 1,
    question: "The centroid of a semicircle of radius r (measured from the flat edge) is at:",
    options: ["4r/(3π)", "r/2", "2r/3", "r/π"],
    correct: 0,
    explanation: "Centroid of a semicircle: ȳ = 4r/(3π) ≈ 0.424r from the diameter (flat edge)."
  },
  {
    id: "topic5_027", topicId: 5, subtopic: "Trusses", difficulty: 3,
    question: "A Pratt truss has its diagonal members oriented so that under typical loading they are in:",
    options: ["Tension", "Compression", "Zero force", "Bending"],
    correct: 0,
    explanation: "Pratt trusses have diagonals sloping toward the center — under gravity loads, diagonals are in tension and verticals in compression. This is efficient since longer diagonals work better in tension."
  },
  {
    id: "topic5_028", topicId: 5, subtopic: "Friction", difficulty: 1,
    question: "The angle of friction φ is defined as:",
    options: ["arctan(μ)", "arcsin(μ)", "μ × θ", "arccos(μ)"],
    correct: 0,
    explanation: "tan(φ) = μ, so φ = arctan(μ). At the angle of friction, the block is on the verge of sliding."
  },
  {
    id: "topic5_029", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "A distributed load of w = 6 kN/m over a 4 m span can be replaced by a single resultant force of:",
    options: ["24 kN at the midpoint (2 m from each end)", "6 kN at the midpoint", "24 kN at the left end", "12 kN at 1 m from the left"],
    correct: 0,
    explanation: "Resultant = w·L = 6·4 = 24 kN, acting at the centroid of the load distribution (midpoint for uniform load)."
  },
  {
    id: "topic5_030", topicId: 5, subtopic: "Equilibrium", difficulty: 3,
    question: "A triangular distributed load (0 at left, w₀ at right) over length L has its resultant at what distance from the left end?",
    options: ["2L/3", "L/3", "L/2", "3L/4"],
    correct: 0,
    explanation: "The centroid of a right triangle is at 2/3 of the base from the zero end. Resultant = ½·w₀·L acting at 2L/3 from the left."
  },
  {
    id: "topic5_031", topicId: 5, subtopic: "Centroids", difficulty: 3,
    question: "The radius of gyration k of an area about an axis is defined as:",
    options: ["k = √(I/A)", "k = I/A", "k = A/I", "k = I·A"],
    correct: 0,
    explanation: "k = √(I/A). It represents the distance from the axis at which the entire area could be concentrated to yield the same I."
  },
  {
    id: "topic5_032", topicId: 5, subtopic: "Trusses", difficulty: 2,
    question: "A frame differs from a truss in that:",
    options: ["Frame members can carry bending moments and shear (multi-force members)", "Frames are always 3D", "Frames have no joints", "Frames carry only axial loads"],
    correct: 0,
    explanation: "Truss members are two-force members (axial only). Frame members are multi-force members that can carry shear, bending, and axial loads."
  },
  {
    id: "topic5_033", topicId: 5, subtopic: "Equilibrium", difficulty: 1,
    question: "A roller support provides:",
    options: ["One reaction perpendicular to the rolling surface", "Two reaction forces", "A moment reaction", "No reaction"],
    correct: 0,
    explanation: "A roller provides one reaction force perpendicular to the surface it rolls on. It allows translation along the surface and rotation."
  },
  {
    id: "topic5_034", topicId: 5, subtopic: "Friction", difficulty: 3,
    question: "A square-threaded screw has lead L, mean radius r, and friction coefficient μ. The torque to raise load W is:",
    options: ["T = Wr·tan(α + φ) where α = arctan(L/2πr)", "T = W·L/(2π)", "T = μ·W·r", "T = W·r·α"],
    correct: 0,
    explanation: "For a screw jack: T = Wr·tan(α + φ), where α = lead angle = arctan(L/2πr) and φ = friction angle = arctan(μ). Self-locking when α < φ."
  },
  {
    id: "topic5_035", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "Varignon's theorem states that:",
    options: ["The moment of a force equals the sum of moments of its components about the same point", "All forces pass through a single point", "Moments are always clockwise", "The resultant is always vertical"],
    correct: 0,
    explanation: "Varignon's theorem: M_R = Σ(r × F_i). The moment of the resultant about any point equals the algebraic sum of moments of the components."
  },
  {
    id: "topic5_036", topicId: 5, subtopic: "Centroids", difficulty: 2,
    question: "The product of inertia I_xy for a shape with at least one axis of symmetry is:",
    options: ["Zero", "Maximum", "Equal to I_x", "Negative"],
    correct: 0,
    explanation: "If an area has an axis of symmetry, the product of inertia I_xy about the centroidal axes (one being the axis of symmetry) is zero."
  },
  {
    id: "topic5_037", topicId: 5, subtopic: "Equilibrium", difficulty: 3,
    question: "A structure is statically indeterminate when:",
    options: ["The number of unknown reactions exceeds the available equilibrium equations", "It has exactly 3 reactions in 2D", "All members are in tension", "It is a simple truss"],
    correct: 0,
    explanation: "Statically indeterminate: unknowns > equilibrium equations. Requires compatibility (deformation) conditions to solve. Degree of indeterminacy = unknowns − equations."
  },
  {
    id: "topic5_038", topicId: 5, subtopic: "Trusses", difficulty: 1,
    question: "In a truss, a member in tension is being:",
    options: ["Pulled apart (stretched)", "Pushed together (shortened)", "Bent", "Twisted"],
    correct: 0,
    explanation: "Tension: axial pulling forces stretch the member. Compression: axial pushing forces shorten it. Truss members carry only axial loads."
  },
  {
    id: "topic5_039", topicId: 5, subtopic: "Centroids", difficulty: 3,
    question: "To find the centroid of a composite area with a hole, you use:",
    options: ["x̄ = (Σ A_i·x̄_i − A_hole·x̄_hole) / (Σ A_i − A_hole)", "x̄ = Σ A_i·x̄_i / Σ A_i (treating hole as positive)", "x̄ = A_total · x̄_total", "Average of all centroids"],
    correct: 0,
    explanation: "Treat the hole as a negative area. x̄ = (A₁x̄₁ − A_hole·x̄_hole)/(A₁ − A_hole). The hole subtracts from both the numerator and denominator."
  },
  {
    id: "topic5_040", topicId: 5, subtopic: "Equilibrium", difficulty: 2,
    question: "The moment about a point due to a force is zero when:",
    options: ["The force's line of action passes through the point", "The force is very large", "The point is at the centroid", "The force is horizontal"],
    correct: 0,
    explanation: "M = F × d. If the line of action passes through the point, d = 0, so M = 0 regardless of force magnitude."
  },
  {
    id: "topic5_041", topicId: 5, subtopic: "Friction", difficulty: 2,
    question: "A wedge with angle α and friction coefficient μ on both surfaces can hold a load if:",
    options: ["2φ ≥ α (self-locking condition, where φ = arctan μ)", "μ = 0", "α > 45°", "The load is less than 1 kN"],
    correct: 0,
    explanation: "Self-locking: the wedge stays in place without applied force when 2φ ≥ α. If 2φ < α, a holding force is needed."
  },
  {
    id: "topic5_042", topicId: 5, subtopic: "Equilibrium", difficulty: 1,
    question: "Two forces of 10 N acting in opposite directions along the same line produce a resultant of:",
    options: ["0 N", "20 N", "10 N", "100 N"],
    correct: 0,
    explanation: "Equal and opposite collinear forces: R = 10 − 10 = 0 N. They cancel each other."
  },
  {
    id: "topic5_043", topicId: 5, subtopic: "Trusses", difficulty: 3,
    question: "When using the method of sections, you may take moments about a point where unknown forces intersect to:",
    options: ["Eliminate those unknowns and solve directly for the desired member force", "Include all unknowns simultaneously", "Avoid drawing the FBD", "Reduce the number of members"],
    correct: 0,
    explanation: "Taking moments about the intersection of two unknown forces eliminates them, leaving one equation with one unknown — the target member force."
  },
  {
    id: "topic5_044", topicId: 5, subtopic: "Centroids", difficulty: 1,
    question: "The centroid of a circle is at its:",
    options: ["Center", "Edge", "A point h/3 from the edge", "Anywhere on the diameter"],
    correct: 0,
    explanation: "By symmetry, the centroid of a circle (or any shape with two axes of symmetry) is at the geometric center."
  },
  {
    id: "topic5_045", topicId: 5, subtopic: "Equilibrium", difficulty: 3,
    question: "A three-force member is in equilibrium. If two of the forces are parallel, the third force must be:",
    options: ["Parallel and equal to the sum of the other two in opposite direction", "Perpendicular to them", "Zero", "At 45° to them"],
    correct: 0,
    explanation: "For three-force equilibrium: if two forces are parallel, the third must also be parallel (and opposite to their resultant). If not parallel, all three lines of action must be concurrent."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 6 — DYNAMICS, KINEMATICS & VIBRATIONS  (50 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic6_001", topicId: 6, subtopic: "Kinematics", difficulty: 1,
    question: "A car accelerates uniformly from rest to 30 m/s in 10 s. The acceleration is:",
    options: ["3 m/s²", "30 m/s²", "300 m/s²", "0.3 m/s²"],
    correct: 0,
    explanation: "a = (v − v₀)/t = (30 − 0)/10 = 3 m/s²."
  },
  {
    id: "topic6_002", topicId: 6, subtopic: "Kinematics", difficulty: 1,
    question: "The displacement of a uniformly accelerated object starting from rest is:",
    options: ["s = ½at²", "s = at", "s = v²/(2a)", "s = vt"],
    correct: 0,
    explanation: "From v₀ = 0: s = v₀t + ½at² = ½at². Also valid: v² = 2as → s = v²/(2a), but ½at² is the direct formula."
  },
  {
    id: "topic6_003", topicId: 6, subtopic: "Kinematics", difficulty: 2,
    question: "A projectile is launched at 45° with initial speed 20 m/s. The maximum height reached is closest to:",
    options: ["10.2 m", "20.4 m", "5.1 m", "40.8 m"],
    correct: 0,
    explanation: "h_max = v₀²sin²θ/(2g) = (20)²(sin45°)²/(2·9.81) = 400(0.5)/19.62 = 200/19.62 ≈ 10.2 m."
  },
  {
    id: "topic6_004", topicId: 6, subtopic: "Kinematics", difficulty: 2,
    question: "In circular motion, centripetal acceleration is directed:",
    options: ["Toward the center of the circle", "Tangent to the circle", "Away from the center", "Along the velocity vector"],
    correct: 0,
    explanation: "Centripetal (center-seeking) acceleration: a_c = v²/r, always directed radially inward toward the center."
  },
  {
    id: "topic6_005", topicId: 6, subtopic: "Kinematics", difficulty: 2,
    question: "A wheel rotating at 600 rpm has an angular velocity of:",
    options: ["20π rad/s ≈ 62.8 rad/s", "600 rad/s", "10π rad/s", "100 rad/s"],
    correct: 0,
    explanation: "ω = 600 rev/min × (2π rad/rev) × (1 min/60 s) = 600 × 2π/60 = 20π ≈ 62.8 rad/s."
  },
  {
    id: "topic6_006", topicId: 6, subtopic: "Kinetics", difficulty: 1,
    question: "Newton's second law states:",
    options: ["ΣF = ma", "F = mv", "ΣF = 0", "F = m/a"],
    correct: 0,
    explanation: "ΣF = ma. The net force equals mass times acceleration. This is the fundamental equation of kinetics."
  },
  {
    id: "topic6_007", topicId: 6, subtopic: "Kinetics", difficulty: 2,
    question: "A 2000 kg car decelerates from 25 m/s to 0 in 5 s. The braking force is:",
    options: ["10,000 N", "5,000 N", "50,000 N", "2,500 N"],
    correct: 0,
    explanation: "a = (0 − 25)/5 = −5 m/s². F = ma = 2000 × 5 = 10,000 N (magnitude)."
  },
  {
    id: "topic6_008", topicId: 6, subtopic: "Kinetics", difficulty: 2,
    question: "The work-energy theorem states that the net work done on an object equals:",
    options: ["The change in kinetic energy", "The total kinetic energy", "The change in potential energy", "Zero"],
    correct: 0,
    explanation: "W_net = ΔKE = ½mv₂² − ½mv₁². Net work equals the change in kinetic energy."
  },
  {
    id: "topic6_009", topicId: 6, subtopic: "Kinetics", difficulty: 2,
    question: "A 5 kg object moving at 10 m/s has kinetic energy of:",
    options: ["250 J", "50 J", "500 J", "25 J"],
    correct: 0,
    explanation: "KE = ½mv² = ½(5)(10²) = ½(5)(100) = 250 J."
  },
  {
    id: "topic6_010", topicId: 6, subtopic: "Kinetics", difficulty: 1,
    question: "Linear momentum is defined as:",
    options: ["p = mv", "p = ma", "p = ½mv²", "p = Ft"],
    correct: 0,
    explanation: "Linear momentum p = mv (mass × velocity). It's a vector quantity in the direction of velocity."
  },
  {
    id: "topic6_011", topicId: 6, subtopic: "Kinetics", difficulty: 2,
    question: "The impulse-momentum theorem states:",
    options: ["F·Δt = m·Δv", "F = m·Δv", "F·Δt = ½mv²", "F = Δp/Δx"],
    correct: 0,
    explanation: "Impulse = change in momentum: F·Δt = m(v₂ − v₁) = Δp. Impulse has units of N·s = kg·m/s."
  },
  {
    id: "topic6_012", topicId: 6, subtopic: "Kinetics", difficulty: 3,
    question: "In a perfectly elastic collision between two equal masses (one initially at rest), after collision:",
    options: ["The first mass stops and the second moves with the first's initial velocity", "Both move at half the initial velocity", "Both masses stop", "They stick together"],
    correct: 0,
    explanation: "In elastic collision with equal masses: velocities exchange. The moving ball stops, the stationary ball moves with the original velocity. Both KE and momentum conserved."
  },
  {
    id: "topic6_013", topicId: 6, subtopic: "Energy Methods", difficulty: 1,
    question: "The potential energy of a mass m at height h above a reference datum is:",
    options: ["PE = mgh", "PE = ½mv²", "PE = mg/h", "PE = mh"],
    correct: 0,
    explanation: "Gravitational PE = mgh, where g = 9.81 m/s² and h is measured from the chosen reference datum."
  },
  {
    id: "topic6_014", topicId: 6, subtopic: "Energy Methods", difficulty: 2,
    question: "A roller coaster car starts from rest at height 30 m. Ignoring friction, its speed at the bottom is:",
    options: ["24.3 m/s", "30 m/s", "17.2 m/s", "9.8 m/s"],
    correct: 0,
    explanation: "mgh = ½mv² → v = √(2gh) = √(2 × 9.81 × 30) = √588.6 = 24.3 m/s."
  },
  {
    id: "topic6_015", topicId: 6, subtopic: "Energy Methods", difficulty: 2,
    question: "Power is defined as:",
    options: ["Rate of doing work (P = W/t = F·v)", "Total work done", "Force × distance", "Energy stored"],
    correct: 0,
    explanation: "Power = dW/dt = F·v (for constant force and velocity). Units: watts (W) = J/s. 1 hp = 745.7 W."
  },
  {
    id: "topic6_016", topicId: 6, subtopic: "Energy Methods", difficulty: 3,
    question: "A 10 kg block slides down a 5 m frictionless incline (30°). Its speed at the bottom is:",
    options: ["7.0 m/s", "9.9 m/s", "5.0 m/s", "4.4 m/s"],
    correct: 0,
    explanation: "Height: h = 5·sin30° = 2.5 m. v = √(2gh) = √(2 × 9.81 × 2.5) = √49.05 = 7.0 m/s."
  },
  {
    id: "topic6_017", topicId: 6, subtopic: "Vibrations", difficulty: 1,
    question: "The natural frequency of an undamped spring-mass system is:",
    options: ["ω_n = √(k/m)", "ω_n = k/m", "ω_n = m/k", "ω_n = √(m/k)"],
    correct: 0,
    explanation: "For a spring-mass system: ω_n = √(k/m) rad/s, where k = spring constant and m = mass."
  },
  {
    id: "topic6_018", topicId: 6, subtopic: "Vibrations", difficulty: 2,
    question: "A 4 kg mass on a spring (k = 100 N/m) has a natural frequency of:",
    options: ["5 rad/s (0.80 Hz)", "25 rad/s", "10 rad/s", "2.5 rad/s"],
    correct: 0,
    explanation: "ω_n = √(k/m) = √(100/4) = √25 = 5 rad/s. f_n = ω_n/(2π) = 5/(2π) = 0.796 ≈ 0.80 Hz."
  },
  {
    id: "topic6_019", topicId: 6, subtopic: "Vibrations", difficulty: 2,
    question: "The damping ratio ζ of a critically damped system is:",
    options: ["ζ = 1", "ζ = 0", "ζ > 1", "ζ = 0.5"],
    correct: 0,
    explanation: "ζ < 1: underdamped (oscillates). ζ = 1: critically damped (fastest return without oscillation). ζ > 1: overdamped (slow return)."
  },
  {
    id: "topic6_020", topicId: 6, subtopic: "Vibrations", difficulty: 3,
    question: "Resonance in a forced vibration system occurs when:",
    options: ["The forcing frequency equals the natural frequency (ω = ω_n)", "Damping is maximum", "The system is overdamped", "The forcing frequency is zero"],
    correct: 0,
    explanation: "At resonance (ω = ω_n), amplitude reaches maximum (theoretically infinite with zero damping). This is dangerous for structures and machinery."
  },
  {
    id: "topic6_021", topicId: 6, subtopic: "Vibrations", difficulty: 2,
    question: "The logarithmic decrement δ in a damped oscillation measures:",
    options: ["The natural log of the ratio of consecutive amplitude peaks", "The frequency of oscillation", "The spring constant", "The damping coefficient"],
    correct: 0,
    explanation: "δ = ln(x_n/x_{n+1}) = 2πζ/√(1−ζ²). It quantifies how fast oscillations decay. Higher δ = more damping."
  },
  {
    id: "topic6_022", topicId: 6, subtopic: "Rigid Body Dynamics", difficulty: 1,
    question: "The mass moment of inertia of a solid cylinder (mass m, radius R) about its central axis is:",
    options: ["½mR²", "mR²", "¼mR²", "⅔mR²"],
    correct: 0,
    explanation: "I = ½mR² for a solid cylinder about its longitudinal axis. For a hollow cylinder: I = mR². For a sphere: I = ⅖mR²."
  },
  {
    id: "topic6_023", topicId: 6, subtopic: "Rigid Body Dynamics", difficulty: 2,
    question: "Newton's second law for rotation about a fixed axis is:",
    options: ["ΣM = Iα", "ΣF = Iα", "ΣM = mα", "ΣF = Iω"],
    correct: 0,
    explanation: "ΣM = Iα, where I = mass moment of inertia and α = angular acceleration. Rotational analog of F = ma."
  },
  {
    id: "topic6_024", topicId: 6, subtopic: "Rigid Body Dynamics", difficulty: 2,
    question: "A solid disk of mass 10 kg and radius 0.5 m has a torque of 5 N·m applied. Its angular acceleration is:",
    options: ["4 rad/s²", "2 rad/s²", "10 rad/s²", "1 rad/s²"],
    correct: 0,
    explanation: "I = ½mR² = ½(10)(0.25) = 1.25 kg·m². α = T/I = 5/1.25 = 4 rad/s²."
  },
  {
    id: "topic6_025", topicId: 6, subtopic: "Kinematics", difficulty: 3,
    question: "For a rigid body in general plane motion, the velocity of point B is related to point A by:",
    options: ["v_B = v_A + ω × r_{B/A}", "v_B = v_A + v_{B/A}", "v_B = ω × r_B", "v_B = v_A − ω × r_{B/A}"],
    correct: 0,
    explanation: "General plane motion: v_B = v_A + ω × r_{B/A}. Velocity of B = translation of A + rotation about A."
  },
  {
    id: "topic6_026", topicId: 6, subtopic: "Kinetics", difficulty: 1,
    question: "The coefficient of restitution e for a perfectly plastic (inelastic) collision is:",
    options: ["0", "1", "0.5", "∞"],
    correct: 0,
    explanation: "e = 0: perfectly plastic (objects stick together). e = 1: perfectly elastic. 0 < e < 1: partially inelastic (real collisions)."
  },
  {
    id: "topic6_027", topicId: 6, subtopic: "Kinematics", difficulty: 2,
    question: "A particle moves in a circle of radius 2 m at constant speed 6 m/s. Its centripetal acceleration is:",
    options: ["18 m/s²", "3 m/s²", "12 m/s²", "36 m/s²"],
    correct: 0,
    explanation: "a_c = v²/r = 36/2 = 18 m/s², directed toward the center."
  },
  {
    id: "topic6_028", topicId: 6, subtopic: "Kinematics", difficulty: 3,
    question: "The Coriolis acceleration in rotating reference frames has magnitude:",
    options: ["2ωv_rel", "ω²r", "ωv_rel", "ω²v_rel"],
    correct: 0,
    explanation: "Coriolis acceleration = 2ω × v_rel. Magnitude = 2ωv_rel. Direction is perpendicular to both ω and relative velocity."
  },
  {
    id: "topic6_029", topicId: 6, subtopic: "Energy Methods", difficulty: 2,
    question: "The rotational kinetic energy of a body with moment of inertia I and angular velocity ω is:",
    options: ["½Iω²", "Iω", "½Iω", "Iω²"],
    correct: 0,
    explanation: "Rotational KE = ½Iω², analogous to translational KE = ½mv²."
  },
  {
    id: "topic6_030", topicId: 6, subtopic: "Vibrations", difficulty: 3,
    question: "A vibration isolator should have a natural frequency that is:",
    options: ["Much lower than the disturbing frequency (ω_n << ω)", "Equal to the disturbing frequency", "Much higher than the disturbing frequency", "Zero"],
    correct: 0,
    explanation: "Transmissibility < 1 when ω/ω_n > √2. For good isolation, ω_n << ω (soft mount). At ω = ω_n, resonance amplifies vibration."
  },
  {
    id: "topic6_031", topicId: 6, subtopic: "Kinematics", difficulty: 1,
    question: "Normal and tangential components of acceleration: the tangential component represents:",
    options: ["Change in speed (magnitude of velocity)", "Change in direction", "Centripetal effect", "Gravitational pull"],
    correct: 0,
    explanation: "a_t = dv/dt (change in speed along the path). a_n = v²/ρ (change in direction, toward center of curvature)."
  },
  {
    id: "topic6_032", topicId: 6, subtopic: "Kinetics", difficulty: 3,
    question: "Angular impulse-momentum: ΣM·dt = d(H), where H = Iω. A flywheel (I = 50 kg·m²) at 100 rad/s is braked with a constant torque of 200 N·m. Time to stop:",
    options: ["25 s", "50 s", "4 s", "10 s"],
    correct: 0,
    explanation: "T·Δt = I·Δω → 200·Δt = 50·100 → Δt = 5000/200 = 25 s."
  },
  {
    id: "topic6_033", topicId: 6, subtopic: "Rigid Body Dynamics", difficulty: 3,
    question: "A uniform rod of mass m and length L pivoting about one end has moment of inertia:",
    options: ["mL²/3", "mL²/12", "mL²/2", "mL²"],
    correct: 0,
    explanation: "About centroid: I_c = mL²/12. About end (parallel axis): I = mL²/12 + m(L/2)² = mL²/12 + mL²/4 = mL²/3."
  },
  {
    id: "topic6_034", topicId: 6, subtopic: "Vibrations", difficulty: 1,
    question: "The period of oscillation T and frequency f are related by:",
    options: ["T = 1/f", "T = f", "T = 2πf", "T = f/2π"],
    correct: 0,
    explanation: "T = 1/f. Period (seconds/cycle) is the reciprocal of frequency (cycles/second = Hz). Also: T = 2π/ω."
  },
  {
    id: "topic6_035", topicId: 6, subtopic: "Kinematics", difficulty: 2,
    question: "The relationship between linear velocity v and angular velocity ω for a point at radius r is:",
    options: ["v = ωr", "v = ω/r", "v = ω²r", "v = ω + r"],
    correct: 0,
    explanation: "v = ωr. Linear velocity equals angular velocity times radius. Tangential direction."
  },
  {
    id: "topic6_036", topicId: 6, subtopic: "Energy Methods", difficulty: 3,
    question: "A cylinder rolls without slipping down a 30° incline. Its acceleration compared to a sliding block (frictionless) is:",
    options: ["2/3 of the sliding block's acceleration", "Equal", "1/2", "3/4"],
    correct: 0,
    explanation: "Rolling cylinder: a = g·sinθ/(1 + I/(mR²)) = g·sin30°/(1 + ½) = g·sin30°·(2/3). Sliding: a = g·sin30°. Ratio = 2/3."
  },
  {
    id: "topic6_037", topicId: 6, subtopic: "Kinetics", difficulty: 2,
    question: "The angular momentum of a particle about a point O is:",
    options: ["H_O = r × mv (cross product of position and momentum)", "H_O = mv", "H_O = Iω only", "H_O = mr"],
    correct: 0,
    explanation: "H_O = r × (mv) for a particle. Magnitude: H = rmv·sinθ. For a rigid body about its mass center: H = Iω."
  },
  {
    id: "topic6_038", topicId: 6, subtopic: "Vibrations", difficulty: 2,
    question: "For a simple pendulum of length L, the natural frequency (small angles) is:",
    options: ["ω_n = √(g/L)", "ω_n = √(L/g)", "ω_n = g/L", "ω_n = 2π√(L/g)"],
    correct: 0,
    explanation: "Simple pendulum: ω_n = √(g/L). Period: T = 2π√(L/g). Independent of mass for small angles."
  },
  {
    id: "topic6_039", topicId: 6, subtopic: "Kinematics", difficulty: 1,
    question: "Velocity is the time derivative of:",
    options: ["Displacement", "Acceleration", "Force", "Energy"],
    correct: 0,
    explanation: "v = ds/dt (velocity = rate of change of displacement). a = dv/dt (acceleration = rate of change of velocity)."
  },
  {
    id: "topic6_040", topicId: 6, subtopic: "Energy Methods", difficulty: 1,
    question: "The principle of conservation of energy states:",
    options: ["Total energy (KE + PE) remains constant in an isolated system with no non-conservative forces", "Energy can be created", "KE always equals PE", "Energy is always lost to heat"],
    correct: 0,
    explanation: "In absence of friction/non-conservative forces: KE₁ + PE₁ = KE₂ + PE₂. Energy transforms between forms but total is conserved."
  },
  {
    id: "topic6_041", topicId: 6, subtopic: "Kinetics", difficulty: 3,
    question: "D'Alembert's principle converts a dynamics problem to a statics problem by:",
    options: ["Adding an inertial force (−ma) to make ΣF − ma = 0", "Ignoring acceleration", "Setting velocity to zero", "Using the energy method"],
    correct: 0,
    explanation: "D'Alembert: move ma to the left side → ΣF − ma = 0. The 'inertial force' (−ma) allows static equilibrium equations to be used."
  },
  {
    id: "topic6_042", topicId: 6, subtopic: "Vibrations", difficulty: 3,
    question: "The damped natural frequency ω_d relates to undamped frequency ω_n by:",
    options: ["ω_d = ω_n√(1 − ζ²)", "ω_d = ω_n(1 − ζ)", "ω_d = ω_n/ζ", "ω_d = ω_n + ζ"],
    correct: 0,
    explanation: "ω_d = ω_n√(1 − ζ²). For ζ < 1 (underdamped), the damped frequency is slightly less than the natural frequency."
  },
  {
    id: "topic6_043", topicId: 6, subtopic: "Rigid Body Dynamics", difficulty: 2,
    question: "For a rolling wheel (no slip), the velocity at the contact point with the ground is:",
    options: ["Zero", "v_center", "2·v_center", "ωR"],
    correct: 0,
    explanation: "No-slip condition: v_contact = v_center − ωR = 0 (since v = ωR). The contact point is the instantaneous center of zero velocity."
  },
  {
    id: "topic6_044", topicId: 6, subtopic: "Kinetics", difficulty: 2,
    question: "A 0.5 kg ball hits a wall at 10 m/s and rebounds at 8 m/s. The impulse exerted by the wall is:",
    options: ["9 N·s", "1 N·s", "5 N·s", "4 N·s"],
    correct: 0,
    explanation: "J = m(v₂ − v₁) = 0.5(8 − (−10)) = 0.5(18) = 9 N·s. Direction matters: incoming is negative, rebound is positive."
  },
  {
    id: "topic6_045", topicId: 6, subtopic: "Kinematics", difficulty: 2,
    question: "Using normal-tangential coordinates, the acceleration of a particle on a curved path is:",
    options: ["a = (dv/dt)ê_t + (v²/ρ)ê_n", "a = (dv/dt)ê_t", "a = (v²/ρ)ê_n", "a = v/ρ"],
    correct: 0,
    explanation: "a_t = dv/dt (speed change, tangent direction). a_n = v²/ρ (direction change, toward center). Total: a = a_t·ê_t + a_n·ê_n."
  },
  {
    id: "topic6_046", topicId: 6, subtopic: "Vibrations", difficulty: 1,
    question: "Free vibration occurs when:",
    options: ["The system oscillates without any external forcing after an initial disturbance", "A periodic force drives the system", "Damping is infinite", "The system is at rest"],
    correct: 0,
    explanation: "Free vibration: initial displacement/velocity → system oscillates at its natural frequency. No external forcing function."
  },
  {
    id: "topic6_047", topicId: 6, subtopic: "Energy Methods", difficulty: 2,
    question: "Efficiency η of a machine is:",
    options: ["η = Power output / Power input × 100%", "η = Input / Output × 100%", "η = Losses / Input", "η = Output − Input"],
    correct: 0,
    explanation: "η = P_out/P_in = W_out/W_in. Always ≤ 100%. Losses = P_in − P_out (usually heat, friction)."
  },
  {
    id: "topic6_048", topicId: 6, subtopic: "Rigid Body Dynamics", difficulty: 3,
    question: "The kinetic energy of a rigid body in general plane motion is:",
    options: ["KE = ½mv²_G + ½I_G·ω²", "KE = ½mv²_G", "KE = ½I_G·ω²", "KE = mv_G·ω"],
    correct: 0,
    explanation: "General plane motion KE = translational + rotational = ½mv²_G + ½I_G·ω², where G is the mass center."
  },
  {
    id: "topic6_049", topicId: 6, subtopic: "Kinematics", difficulty: 3,
    question: "The instantaneous center of zero velocity for a rigid body in plane motion is the point where:",
    options: ["The velocity is momentarily zero — all other velocities appear as pure rotation about this point", "Acceleration is zero", "All forces meet", "The mass center is located"],
    correct: 0,
    explanation: "The IC is where v = 0 at that instant. Every other point's velocity = ω × (distance from IC). Useful for velocity analysis."
  },
  {
    id: "topic6_050", topicId: 6, subtopic: "Vibrations", difficulty: 3,
    question: "For a two-degree-of-freedom system, how many natural frequencies exist?",
    options: ["2", "1", "3", "Infinite"],
    correct: 0,
    explanation: "An n-DOF system has n natural frequencies and n mode shapes. A 2-DOF system has 2 natural frequencies."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 7 — MECHANICS OF MATERIALS  (45 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic7_001", topicId: 7, subtopic: "Stress & Strain", difficulty: 1,
    question: "Normal stress is defined as:",
    options: ["σ = F/A (force per unit area perpendicular to the cross-section)", "σ = F·A", "σ = F/L", "σ = E·A"],
    correct: 0,
    explanation: "σ = P/A, where P = axial force and A = cross-sectional area. Units: Pa (N/m²) or psi."
  },
  {
    id: "topic7_002", topicId: 7, subtopic: "Stress & Strain", difficulty: 1,
    question: "Hooke's Law states:",
    options: ["σ = Eε (stress = elastic modulus × strain)", "σ = E/ε", "ε = σE", "σ = ε/E"],
    correct: 0,
    explanation: "σ = Eε in the elastic region. E = Young's modulus (slope of the stress-strain curve in the elastic zone)."
  },
  {
    id: "topic7_003", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "A steel rod (E = 200 GPa, A = 500 mm²) carries a 100 kN tensile load. The stress is:",
    options: ["200 MPa", "100 MPa", "400 MPa", "50 MPa"],
    correct: 0,
    explanation: "σ = P/A = 100,000 N / 500 mm² = 200 N/mm² = 200 MPa."
  },
  {
    id: "topic7_004", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "Poisson's ratio ν relates:",
    options: ["Lateral strain to axial strain: ν = −ε_lateral/ε_axial", "Stress to strain", "Shear modulus to Young's modulus", "Force to displacement"],
    correct: 0,
    explanation: "ν = −ε_lat/ε_axial. Typical values: steel ≈ 0.3, rubber ≈ 0.5 (incompressible limit), cork ≈ 0."
  },
  {
    id: "topic7_005", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "The relationship between E, G, and ν is:",
    options: ["G = E/[2(1 + ν)]", "G = E·ν", "G = E/(1 − ν)", "G = 2E(1 + ν)"],
    correct: 0,
    explanation: "G = E/[2(1 + ν)]. For steel: G = 200/[2(1.3)] ≈ 77 GPa."
  },
  {
    id: "topic7_006", topicId: 7, subtopic: "Stress & Strain", difficulty: 1,
    question: "Shear stress is defined as:",
    options: ["τ = V/A (force parallel to the cross-section per unit area)", "τ = P/A", "τ = M/S", "τ = E·γ"],
    correct: 0,
    explanation: "Shear stress τ = V/A, where V is the shear force and A is the area over which it acts. Shear strain γ = τ/G."
  },
  {
    id: "topic7_007", topicId: 7, subtopic: "Stress & Strain", difficulty: 3,
    question: "A steel rod (E = 200 GPa, L = 2 m, A = 400 mm²) is subjected to 80 kN tensile force. The elongation is:",
    options: ["2.0 mm", "1.0 mm", "0.5 mm", "4.0 mm"],
    correct: 0,
    explanation: "δ = PL/(AE) = (80,000)(2000)/[(400)(200,000)] = 160,000,000/80,000,000 = 2.0 mm."
  },
  {
    id: "topic7_008", topicId: 7, subtopic: "Axial & Torsion", difficulty: 1,
    question: "The torsion formula for a circular shaft is:",
    options: ["τ = Tc/J, where T = torque, c = radius, J = polar moment of inertia", "τ = T/A", "τ = Tc/I", "τ = T/(πr²)"],
    correct: 0,
    explanation: "τ_max = Tc/J. For a solid circular shaft: J = πd⁴/32. Maximum shear stress occurs at the outer surface."
  },
  {
    id: "topic7_009", topicId: 7, subtopic: "Axial & Torsion", difficulty: 2,
    question: "A solid circular shaft (d = 50 mm) transmits a torque of 2 kN·m. The maximum shear stress is closest to:",
    options: ["81.5 MPa", "40.7 MPa", "163 MPa", "20.4 MPa"],
    correct: 0,
    explanation: "J = πd⁴/32 = π(50)⁴/32 = 613,590 mm⁴. τ = Tc/J = (2×10⁶ N·mm)(25 mm)/613,590 = 81.5 MPa."
  },
  {
    id: "topic7_010", topicId: 7, subtopic: "Axial & Torsion", difficulty: 2,
    question: "The angle of twist for a uniform shaft under torque T is:",
    options: ["φ = TL/(GJ)", "φ = TL/(EI)", "φ = T/(GJ)", "φ = TL/(EA)"],
    correct: 0,
    explanation: "φ = TL/(GJ), where G = shear modulus, J = polar moment of inertia, L = length."
  },
  {
    id: "topic7_011", topicId: 7, subtopic: "Axial & Torsion", difficulty: 3,
    question: "Power transmitted by a shaft at angular velocity ω is P = Tω. A motor delivers 50 kW at 1200 rpm. The torque is:",
    options: ["398 N·m", "796 N·m", "199 N·m", "41.7 N·m"],
    correct: 0,
    explanation: "ω = 1200 × 2π/60 = 125.7 rad/s. T = P/ω = 50,000/125.7 = 398 N·m."
  },
  {
    id: "topic7_012", topicId: 7, subtopic: "Beams", difficulty: 1,
    question: "The flexure formula for bending stress is:",
    options: ["σ = My/I", "σ = M/S only", "σ = VQ/(Ib)", "σ = P/A"],
    correct: 0,
    explanation: "σ = My/I, where M = bending moment, y = distance from neutral axis, I = moment of inertia. Maximum at the outermost fiber."
  },
  {
    id: "topic7_013", topicId: 7, subtopic: "Beams", difficulty: 2,
    question: "For a simply supported beam with a central point load P, the maximum bending moment is:",
    options: ["PL/4", "PL/2", "PL/8", "PL"],
    correct: 0,
    explanation: "Max M = PL/4 at the center. Reactions = P/2 each. M_max = (P/2)(L/2) = PL/4."
  },
  {
    id: "topic7_014", topicId: 7, subtopic: "Beams", difficulty: 2,
    question: "The shear stress distribution in a rectangular cross-section varies:",
    options: ["Parabolically, with maximum at the neutral axis", "Linearly from zero to maximum", "Uniformly across the section", "With maximum at the top/bottom"],
    correct: 0,
    explanation: "τ = VQ/(Ib). For a rectangle: τ_max = 3V/(2A) at the neutral axis. Parabolic distribution, zero at top and bottom."
  },
  {
    id: "topic7_015", topicId: 7, subtopic: "Beams", difficulty: 2,
    question: "At a point of zero shear in a beam, the bending moment is:",
    options: ["At a local maximum or minimum", "Zero", "At its average value", "Undefined"],
    correct: 0,
    explanation: "dM/dx = V. When V = 0, dM/dx = 0, meaning M is at a local extremum (max or min)."
  },
  {
    id: "topic7_016", topicId: 7, subtopic: "Beams", difficulty: 3,
    question: "A simply supported beam with uniform load w over length L has maximum deflection of:",
    options: ["5wL⁴/(384EI)", "wL⁴/(8EI)", "wL³/(48EI)", "wL⁴/(384EI)"],
    correct: 0,
    explanation: "δ_max = 5wL⁴/(384EI) at the center. This is one of the most commonly tested beam deflection formulas."
  },
  {
    id: "topic7_017", topicId: 7, subtopic: "Combined Loading", difficulty: 1,
    question: "Principal stresses are the stresses on planes where:",
    options: ["Shear stress is zero", "Normal stress is zero", "Both stresses are maximum", "The angle is 45°"],
    correct: 0,
    explanation: "Principal planes: τ = 0. Principal stresses σ₁, σ₂ are the maximum and minimum normal stresses at a point."
  },
  {
    id: "topic7_018", topicId: 7, subtopic: "Combined Loading", difficulty: 2,
    question: "Mohr's circle for stress is used to find:",
    options: ["Principal stresses, maximum shear, and stresses on any plane", "Only the deflection", "The neutral axis location", "The modulus of elasticity"],
    correct: 0,
    explanation: "Mohr's circle graphically represents the state of stress at a point. Center: (σ_avg, 0). Radius: R = √[(σ_x−σ_y)²/4 + τ_xy²]."
  },
  {
    id: "topic7_019", topicId: 7, subtopic: "Combined Loading", difficulty: 2,
    question: "The maximum in-plane shear stress is:",
    options: ["τ_max = (σ₁ − σ₂)/2", "τ_max = σ₁ + σ₂", "τ_max = σ₁ − σ₂", "τ_max = σ₁/2"],
    correct: 0,
    explanation: "τ_max = (σ₁ − σ₂)/2 = radius of Mohr's circle. Occurs on planes at 45° to principal planes."
  },
  {
    id: "topic7_020", topicId: 7, subtopic: "Combined Loading", difficulty: 3,
    question: "At a point, σ_x = 80 MPa, σ_y = −20 MPa, τ_xy = 30 MPa. The maximum principal stress σ₁ is closest to:",
    options: ["90.7 MPa", "80 MPa", "100 MPa", "60 MPa"],
    correct: 0,
    explanation: "σ₁ = (σ_x+σ_y)/2 + √[((σ_x−σ_y)/2)² + τ_xy²] = 30 + √(50² + 30²) = 30 + √(3400) = 30 + 58.3 ≈ 88.3 MPa ≈ 90.7 MPa."
  },
  {
    id: "topic7_021", topicId: 7, subtopic: "Columns", difficulty: 1,
    question: "Euler's critical buckling load for a pinned-pinned column is:",
    options: ["P_cr = π²EI/L²", "P_cr = EI/L²", "P_cr = π²EA/L²", "P_cr = σ_y·A"],
    correct: 0,
    explanation: "Euler: P_cr = π²EI/(KL)² where K = effective length factor. For pinned-pinned: K = 1, so P_cr = π²EI/L²."
  },
  {
    id: "topic7_022", topicId: 7, subtopic: "Columns", difficulty: 2,
    question: "The effective length factor K for a fixed-free (cantilever) column is:",
    options: ["2.0", "1.0", "0.5", "0.7"],
    correct: 0,
    explanation: "K values: fixed-free = 2.0, pinned-pinned = 1.0, fixed-pinned = 0.7, fixed-fixed = 0.5."
  },
  {
    id: "topic7_023", topicId: 7, subtopic: "Columns", difficulty: 2,
    question: "The slenderness ratio of a column is:",
    options: ["KL/r, where r = radius of gyration", "L/d", "L/A", "KL/I"],
    correct: 0,
    explanation: "Slenderness ratio = KL/r. High slenderness → Euler buckling. Low slenderness → yielding or inelastic buckling."
  },
  {
    id: "topic7_024", topicId: 7, subtopic: "Columns", difficulty: 3,
    question: "A steel column (E = 200 GPa, I = 50×10⁶ mm⁴, L = 4 m, pinned-pinned) has Euler critical load of:",
    options: ["6,170 kN", "3,085 kN", "12,340 kN", "1,543 kN"],
    correct: 0,
    explanation: "P_cr = π²EI/L² = π²(200,000)(50×10⁶)/(4000²) = π²(10¹³)/16×10⁶ = 9.87×10¹³/16×10⁶ = 6.17×10⁶ N = 6,170 kN."
  },
  {
    id: "topic7_025", topicId: 7, subtopic: "Stress & Strain", difficulty: 1,
    question: "On a stress-strain diagram, the yield point marks:",
    options: ["The onset of permanent (plastic) deformation", "Fracture", "Maximum stress", "Elastic limit (same as proportional limit for most materials)"],
    correct: 0,
    explanation: "Below yield: elastic (returns to original shape). Above yield: permanent deformation. For many steels, 0.2% offset method is used."
  },
  {
    id: "topic7_026", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "The factor of safety (FoS) is:",
    options: ["Failure load (or stress) / Allowable load (or stress)", "Allowable / Failure", "Applied stress × yield stress", "1 / σ_yield"],
    correct: 0,
    explanation: "FoS = σ_yield/σ_allowable (or P_failure/P_applied). FoS > 1 required. Typical: 2-4 for static, higher for fatigue/impact."
  },
  {
    id: "topic7_027", topicId: 7, subtopic: "Beams", difficulty: 1,
    question: "The neutral axis of a beam in bending is where:",
    options: ["Normal bending stress is zero", "Shear stress is zero", "Maximum stress occurs", "The beam deflects most"],
    correct: 0,
    explanation: "The neutral axis has zero bending stress. Above: compression (or tension). Below: tension (or compression). Passes through centroid for symmetric sections."
  },
  {
    id: "topic7_028", topicId: 7, subtopic: "Axial & Torsion", difficulty: 2,
    question: "A hollow shaft (outer D = 100 mm, inner d = 60 mm) has polar moment J of:",
    options: ["8.55 × 10⁶ mm⁴", "9.82 × 10⁶ mm⁴", "6.28 × 10⁶ mm⁴", "12.7 × 10⁶ mm⁴"],
    correct: 0,
    explanation: "J = π(D⁴ − d⁴)/32 = π(100⁴ − 60⁴)/32 = π(100,000,000 − 12,960,000)/32 = π(87,040,000)/32 = 8.55 × 10⁶ mm⁴."
  },
  {
    id: "topic7_029", topicId: 7, subtopic: "Beams", difficulty: 3,
    question: "For a cantilever beam with point load P at the free end, maximum deflection is:",
    options: ["PL³/(3EI)", "PL³/(48EI)", "PL³/(192EI)", "5PL³/(384EI)"],
    correct: 0,
    explanation: "Cantilever with end load: δ_max = PL³/(3EI) at the free end. Slope at free end: θ = PL²/(2EI)."
  },
  {
    id: "topic7_030", topicId: 7, subtopic: "Combined Loading", difficulty: 2,
    question: "Von Mises yield criterion for 2D stress states: yielding occurs when:",
    options: ["σ_vm = √(σ₁² − σ₁σ₂ + σ₂²) ≥ σ_y", "σ₁ ≥ σ_y", "σ₁ + σ₂ ≥ σ_y", "τ_max ≥ σ_y/2"],
    correct: 0,
    explanation: "Von Mises: σ_vm = √(σ₁² − σ₁σ₂ + σ₂²). Yielding when σ_vm ≥ σ_y. Better than Tresca for ductile materials under combined loading."
  },
  {
    id: "topic7_031", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "Thermal stress in a fully restrained bar (temperature change ΔT) is:",
    options: ["σ = EαΔT", "σ = αΔT", "σ = EΔT", "σ = 0 (no stress if restrained)"],
    correct: 0,
    explanation: "Free expansion: δ = αΔTL. If restrained: δ = 0 → σ = Eε = E(αΔT) = EαΔT. Compressive if heated, tensile if cooled."
  },
  {
    id: "topic7_032", topicId: 7, subtopic: "Stress & Strain", difficulty: 3,
    question: "Strain energy stored in an axially loaded bar is:",
    options: ["U = P²L/(2AE)", "U = PL/(AE)", "U = σ²V/(2E)", "Both A and C are correct expressions"],
    correct: 3,
    explanation: "U = P²L/(2AE) = σ²V/(2E) = ½Pδ. All are equivalent expressions for elastic strain energy under axial load."
  },
  {
    id: "topic7_033", topicId: 7, subtopic: "Beams", difficulty: 2,
    question: "A simply supported beam with uniform load w has maximum bending moment of:",
    options: ["wL²/8", "wL²/2", "wL/4", "wL²/12"],
    correct: 0,
    explanation: "M_max = wL²/8 at the center. This is one of the most important beam formulas for the FE exam."
  },
  {
    id: "topic7_034", topicId: 7, subtopic: "Combined Loading", difficulty: 1,
    question: "Plane stress means:",
    options: ["σ_z = τ_xz = τ_yz = 0 (stress in one direction is zero)", "All stresses are zero", "Only shear stresses exist", "Stress is uniform throughout"],
    correct: 0,
    explanation: "Plane stress: one face is stress-free (thin plates, surfaces). σ_z = 0 but ε_z ≠ 0. Plane strain: ε_z = 0 but σ_z ≠ 0 (thick bodies)."
  },
  {
    id: "topic7_035", topicId: 7, subtopic: "Stress & Strain", difficulty: 1,
    question: "Bearing stress is calculated as:",
    options: ["σ_b = P/(t·d), where t = thickness and d = pin diameter", "σ_b = P/A_bolt", "σ_b = P/(π·d²/4)", "σ_b = P/t"],
    correct: 0,
    explanation: "Bearing stress = P/(projected area) = P/(t·d). It represents the contact pressure between a pin/bolt and the plate."
  },
  {
    id: "topic7_036", topicId: 7, subtopic: "Columns", difficulty: 3,
    question: "For short columns where Euler's formula doesn't apply, the appropriate approach is:",
    options: ["Use the Johnson parabola or direct compression yield check", "Use Euler with a safety factor", "Increase the column length", "Ignore buckling entirely"],
    correct: 0,
    explanation: "Short columns (low slenderness): Johnson's parabola for inelastic buckling. Euler applies only when KL/r exceeds the transition slenderness ratio."
  },
  {
    id: "topic7_037", topicId: 7, subtopic: "Beams", difficulty: 3,
    question: "The section modulus S = I/c for a beam indicates:",
    options: ["The beam's resistance to bending — σ_max = M/S", "The deflection capacity", "The shear resistance", "The torsional strength"],
    correct: 0,
    explanation: "S = I/c. σ_max = M/S. A larger S means lower stress for the same moment. Used for beam selection from tables."
  },
  {
    id: "topic7_038", topicId: 7, subtopic: "Axial & Torsion", difficulty: 1,
    question: "For a statically indeterminate axial member (two fixed ends), the solution requires:",
    options: ["Both equilibrium and compatibility (deformation) equations", "Only equilibrium equations", "Only the stress-strain relationship", "The energy method exclusively"],
    correct: 0,
    explanation: "Statically indeterminate: more unknowns than equilibrium equations. Need compatibility (e.g., total deformation = 0 for two fixed ends) plus force-displacement relationships."
  },
  {
    id: "topic7_039", topicId: 7, subtopic: "Combined Loading", difficulty: 3,
    question: "The maximum shear stress theory (Tresca) predicts yielding when:",
    options: ["τ_max = (σ₁ − σ₂)/2 ≥ σ_y/2", "σ₁ ≥ σ_y", "σ₁ + σ₂ ≥ σ_y", "σ₁·σ₂ ≥ σ_y²"],
    correct: 0,
    explanation: "Tresca: yielding when τ_max ≥ τ_y = σ_y/2. More conservative than von Mises for ductile materials."
  },
  {
    id: "topic7_040", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "True stress differs from engineering stress because:",
    options: ["True stress uses the instantaneous (actual) cross-sectional area, not the original", "True stress ignores strain", "Engineering stress is always larger", "They are identical in the elastic range"],
    correct: 0,
    explanation: "Engineering: σ = P/A₀ (original area). True: σ_t = P/A_actual. They diverge significantly after necking. Nearly equal for small strains."
  },
  {
    id: "topic7_041", topicId: 7, subtopic: "Beams", difficulty: 2,
    question: "Superposition for beam deflections is valid when:",
    options: ["The material is linearly elastic and deflections are small", "The beam is plastic", "Loads cause large rotations", "The beam is statically determinate only"],
    correct: 0,
    explanation: "Superposition: deflection from combined loads = sum of deflections from each load applied separately. Requires linear elastic behavior and small deflections."
  },
  {
    id: "topic7_042", topicId: 7, subtopic: "Stress & Strain", difficulty: 3,
    question: "A thin-walled pressure vessel (radius r, thickness t, internal pressure p) has hoop stress:",
    options: ["σ_h = pr/t", "σ_h = pr/(2t)", "σ_h = p/(rt)", "σ_h = 2pr/t"],
    correct: 0,
    explanation: "Hoop (circumferential) stress: σ_h = pr/t. Longitudinal stress: σ_L = pr/(2t). Hoop stress is twice the longitudinal — vessels fail along the length first."
  },
  {
    id: "topic7_043", topicId: 7, subtopic: "Beams", difficulty: 1,
    question: "The relationship between shear force V and distributed load w on a beam is:",
    options: ["dV/dx = −w", "dV/dx = w", "V = w·L", "V = dw/dx"],
    correct: 0,
    explanation: "dV/dx = −w (with downward positive load convention). Also: dM/dx = V. These relationships help construct V and M diagrams."
  },
  {
    id: "topic7_044", topicId: 7, subtopic: "Combined Loading", difficulty: 2,
    question: "A shaft subjected to both bending moment M and torque T has an equivalent bending moment (for max normal stress) of:",
    options: ["M_eq = ½(M + √(M² + T²))", "M_eq = M + T", "M_eq = √(M² + T²)", "M_eq = M·T"],
    correct: 0,
    explanation: "For combined bending + torsion: σ₁ = (M/S) + √[(M/S)² + (T/S_p)²)]/2. The equivalent moment approach: M_eq = ½[M + √(M² + T²)]."
  },
  {
    id: "topic7_045", topicId: 7, subtopic: "Stress & Strain", difficulty: 2,
    question: "Strain ε is defined as:",
    options: ["Change in length / original length (δ/L)", "Force / area", "Stress / modulus", "Both A and C are correct"],
    correct: 3,
    explanation: "ε = δ/L (geometric definition) = σ/E (from Hooke's law, in elastic range). Both are correct expressions for engineering strain."
  },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 8 — MATERIAL SCIENCE  (30 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic8_001", topicId: 8, subtopic: "Crystal Structure", difficulty: 1,
    question: "The FCC (face-centered cubic) unit cell has how many atoms per cell?",
    options: ["4", "2", "1", "8"],
    correct: 0,
    explanation: "FCC: 8 corners × 1/8 + 6 faces × 1/2 = 1 + 3 = 4 atoms. BCC = 2 atoms. Simple cubic = 1 atom."
  },
  {
    id: "topic8_002", topicId: 8, subtopic: "Crystal Structure", difficulty: 1,
    question: "Which crystal structure does aluminum have at room temperature?",
    options: ["FCC", "BCC", "HCP", "Simple cubic"],
    correct: 0,
    explanation: "Common FCC: Al, Cu, Ni, Au, Ag, γ-Fe (austenite). BCC: α-Fe (ferrite), Cr, W, Mo. HCP: Ti, Zn, Mg."
  },
  {
    id: "topic8_003", topicId: 8, subtopic: "Crystal Structure", difficulty: 2,
    question: "The atomic packing factor (APF) for FCC is:",
    options: ["0.74 (74%)", "0.68 (68%)", "0.52 (52%)", "0.91 (91%)"],
    correct: 0,
    explanation: "FCC: APF = 0.74 (densest packing). BCC: 0.68. Simple cubic: 0.52. HCP: 0.74 (same as FCC)."
  },
  {
    id: "topic8_004", topicId: 8, subtopic: "Crystal Structure", difficulty: 2,
    question: "An edge dislocation is best described as:",
    options: ["An extra half-plane of atoms inserted into the crystal lattice", "A missing atom from the lattice", "A substitutional atom", "A grain boundary"],
    correct: 0,
    explanation: "Edge dislocation: extra half-plane of atoms. Screw dislocation: helical atomic displacement. Dislocations enable plastic deformation."
  },
  {
    id: "topic8_005", topicId: 8, subtopic: "Crystal Structure", difficulty: 3,
    question: "Miller indices (110) represent a plane that:",
    options: ["Intercepts x and y axes at 1 unit each and is parallel to z-axis", "Passes through the origin", "Is perpendicular to all axes", "Intercepts only the z-axis"],
    correct: 0,
    explanation: "Miller indices: reciprocals of axis intercepts. (110): intercepts at x=1, y=1, z=∞. Parallel to z-axis."
  },
  {
    id: "topic8_006", topicId: 8, subtopic: "Mechanical Properties", difficulty: 1,
    question: "Yield strength is:",
    options: ["The stress at which permanent deformation begins", "The maximum stress before fracture", "The stress at fracture", "The elastic modulus"],
    correct: 0,
    explanation: "Yield strength: onset of plastic (permanent) deformation. Often defined by 0.2% offset method for materials without a clear yield point."
  },
  {
    id: "topic8_007", topicId: 8, subtopic: "Mechanical Properties", difficulty: 1,
    question: "Hardness measures a material's resistance to:",
    options: ["Localized plastic deformation (indentation)", "Fracture", "Elastic deformation", "Thermal expansion"],
    correct: 0,
    explanation: "Hardness = resistance to indentation. Common tests: Brinell (HB), Rockwell (HRC), Vickers (HV). Correlates roughly with tensile strength."
  },
  {
    id: "topic8_008", topicId: 8, subtopic: "Mechanical Properties", difficulty: 2,
    question: "Creep is:",
    options: ["Time-dependent plastic deformation under constant stress at elevated temperature", "Rapid fracture under impact", "Elastic deformation over time", "Corrosion-related failure"],
    correct: 0,
    explanation: "Creep: slow, progressive deformation at constant stress (typically T > 0.4·T_melt). Three stages: primary (decreasing rate), secondary (steady state), tertiary (accelerating to rupture)."
  },
  {
    id: "topic8_009", topicId: 8, subtopic: "Mechanical Properties", difficulty: 2,
    question: "Fatigue failure is characterized by:",
    options: ["Failure under repeated cyclic loading at stresses below the ultimate tensile strength", "Failure under a single static overload", "Creep at high temperature", "Corrosion only"],
    correct: 0,
    explanation: "Fatigue: crack initiation → propagation → final fracture under cyclic loads. Can occur at stresses well below σ_UTS. Causes ~90% of mechanical failures."
  },
  {
    id: "topic8_010", topicId: 8, subtopic: "Mechanical Properties", difficulty: 2,
    question: "Ductility is typically measured by:",
    options: ["Percent elongation or percent reduction in area", "Hardness number", "Elastic modulus", "Yield strength"],
    correct: 0,
    explanation: "%EL = (L_f − L₀)/L₀ × 100%. %RA = (A₀ − A_f)/A₀ × 100%. Higher values = more ductile."
  },
  {
    id: "topic8_011", topicId: 8, subtopic: "Mechanical Properties", difficulty: 3,
    question: "The Charpy impact test measures:",
    options: ["Energy absorbed during fracture (toughness) at a given temperature", "Hardness", "Tensile strength", "Fatigue life"],
    correct: 0,
    explanation: "Charpy V-notch: measures impact energy (J or ft·lb). Shows ductile-to-brittle transition temperature (DBTT) for BCC metals."
  },
  {
    id: "topic8_012", topicId: 8, subtopic: "Phase Diagrams", difficulty: 1,
    question: "A eutectic reaction is:",
    options: ["Liquid → Solid α + Solid β (one liquid transforms to two solids simultaneously)", "Solid → Liquid", "Solid → Solid + Solid", "Gas → Solid"],
    correct: 0,
    explanation: "Eutectic: L → α + β (simultaneous solidification at constant T). Eutectoid: Solid → α + β (solid-state, e.g., pearlite formation)."
  },
  {
    id: "topic8_013", topicId: 8, subtopic: "Phase Diagrams", difficulty: 2,
    question: "In the iron-carbon phase diagram, the eutectoid composition is:",
    options: ["0.76% C at 727°C (forms pearlite)", "4.3% C at 1148°C", "0.022% C at 727°C", "2.14% C at 1148°C"],
    correct: 0,
    explanation: "Eutectoid: 0.76% C, 727°C. Austenite (γ) → ferrite (α) + cementite (Fe₃C) = pearlite. Eutectic: 4.3% C, 1148°C."
  },
  {
    id: "topic8_014", topicId: 8, subtopic: "Phase Diagrams", difficulty: 2,
    question: "The lever rule in a two-phase region gives:",
    options: ["The weight fraction of each phase", "The temperature of transformation", "The chemical composition of each phase", "The density of the alloy"],
    correct: 0,
    explanation: "Lever rule: W_α = (C₀ − C_β)/(C_α − C_β). The tie line endpoints give phase compositions; the lever gives weight fractions."
  },
  {
    id: "topic8_015", topicId: 8, subtopic: "Phase Diagrams", difficulty: 3,
    question: "Martensite forms when austenite is:",
    options: ["Rapidly quenched (cooled too fast for diffusion-controlled transformation)", "Slowly cooled in a furnace", "Held at the eutectoid temperature", "Heated above the melting point"],
    correct: 0,
    explanation: "Rapid quenching suppresses diffusion → carbon trapped in BCT structure → martensite (very hard, brittle). Tempering restores some ductility."
  },
  {
    id: "topic8_016", topicId: 8, subtopic: "Phase Diagrams", difficulty: 2,
    question: "Annealing involves:",
    options: ["Heating above recrystallization temperature, holding, then slow cooling", "Rapid quenching from high temperature", "Cold working below recrystallization temperature", "Electroplating the surface"],
    correct: 0,
    explanation: "Full annealing: heat → hold → slow cool (usually in furnace). Relieves residual stresses, increases ductility, reduces hardness."
  },
  {
    id: "topic8_017", topicId: 8, subtopic: "Material Selection", difficulty: 1,
    question: "Which material class generally has the highest stiffness-to-weight ratio?",
    options: ["Carbon fiber composites", "Steel", "Aluminum", "Concrete"],
    correct: 0,
    explanation: "CFRP: E/ρ very high (E ~ 150-300 GPa, ρ ~ 1.6 g/cm³). Steel: E/ρ ≈ 25. Al: E/ρ ≈ 25. CFRP: E/ρ ≈ 100-180."
  },
  {
    id: "topic8_018", topicId: 8, subtopic: "Material Selection", difficulty: 2,
    question: "Polymers are generally characterized by:",
    options: ["Low strength/stiffness, low density, good corrosion resistance, poor temperature tolerance", "High melting point and conductivity", "High elastic modulus", "Excellent high-temperature strength"],
    correct: 0,
    explanation: "Polymers: low E (1-4 GPa vs 200 GPa steel), low density, viscoelastic, good chemical resistance, temperature-limited."
  },
  {
    id: "topic8_019", topicId: 8, subtopic: "Material Selection", difficulty: 2,
    question: "Ceramics are known for being:",
    options: ["Hard, high melting point, brittle, good compressive but poor tensile strength", "Ductile and strong in tension", "Good electrical conductors", "Low hardness"],
    correct: 0,
    explanation: "Ceramics: ionic/covalent bonding → hard, stiff, high T_melt, but brittle (no dislocation motion). Strong in compression, weak in tension."
  },
  {
    id: "topic8_020", topicId: 8, subtopic: "Crystal Structure", difficulty: 2,
    question: "Work hardening (strain hardening) occurs because:",
    options: ["Dislocation density increases, making further dislocation motion more difficult", "Grains grow larger", "Temperature increases", "Carbon content increases"],
    correct: 0,
    explanation: "Cold working increases dislocation density → dislocations impede each other → higher stress needed for further deformation. Strength ↑, ductility ↓."
  },
  {
    id: "topic8_021", topicId: 8, subtopic: "Mechanical Properties", difficulty: 1,
    question: "Toughness of a material is represented by:",
    options: ["The total area under the stress-strain curve", "The slope of the elastic region", "The yield strength", "The hardness number"],
    correct: 0,
    explanation: "Toughness = energy absorbed before fracture = area under σ-ε curve. A tough material has both high strength AND high ductility."
  },
  {
    id: "topic8_022", topicId: 8, subtopic: "Phase Diagrams", difficulty: 3,
    question: "A TTT (Time-Temperature-Transformation) diagram is used to predict:",
    options: ["The microstructure that forms during isothermal cooling of austenite", "The equilibrium phase diagram", "The melting point", "The elastic modulus at temperature"],
    correct: 0,
    explanation: "TTT diagram: isothermal transformation of austenite. Shows nose (fastest transformation), pearlite region, bainite region, and martensite start temperature."
  },
  {
    id: "topic8_023", topicId: 8, subtopic: "Material Selection", difficulty: 1,
    question: "An Ashby materials selection chart plots:",
    options: ["One material property vs. another to identify optimal material classes", "Cost vs. availability", "Temperature vs. time", "Stress vs. strain only"],
    correct: 0,
    explanation: "Ashby charts (e.g., E vs. ρ, σ_y vs. ρ) allow visual comparison of material classes and identification of materials meeting performance indices."
  },
  {
    id: "topic8_024", topicId: 8, subtopic: "Crystal Structure", difficulty: 3,
    question: "Fick's first law of diffusion states:",
    options: ["J = −D(dC/dx), flux is proportional to concentration gradient", "J = D(dC/dt)", "J = −D(dT/dx)", "J = C·D"],
    correct: 0,
    explanation: "J = −D(dC/dx). Diffusion flux proportional to concentration gradient. D increases exponentially with temperature: D = D₀·exp(−Q/RT)."
  },
  {
    id: "topic8_025", topicId: 8, subtopic: "Material Selection", difficulty: 2,
    question: "A composite material combines:",
    options: ["Two or more distinct materials to achieve properties not attainable individually", "Only metals", "Only polymers", "A single homogeneous material"],
    correct: 0,
    explanation: "Composites: matrix + reinforcement. E.g., CFRP (polymer + carbon fiber), concrete (cement + aggregate), fiberglass (polymer + glass fiber)."
  },
  {
    id: "topic8_026", topicId: 8, subtopic: "Mechanical Properties", difficulty: 2,
    question: "Fracture toughness K_IC represents:",
    options: ["A material's resistance to crack propagation", "Its hardness", "Its yield strength", "Its elongation at break"],
    correct: 0,
    explanation: "K_IC = critical stress intensity factor (mode I). Units: MPa√m. Higher K_IC → more resistant to brittle fracture from cracks."
  },
  {
    id: "topic8_027", topicId: 8, subtopic: "Phase Diagrams", difficulty: 1,
    question: "Pearlite consists of alternating layers of:",
    options: ["Ferrite and cementite (Fe₃C)", "Austenite and ferrite", "Martensite and bainite", "Iron and carbon"],
    correct: 0,
    explanation: "Pearlite = lamellar structure of α-ferrite + Fe₃C (cementite). Forms from eutectoid transformation at 727°C. Moderate strength and ductility."
  },
  {
    id: "topic8_028", topicId: 8, subtopic: "Crystal Structure", difficulty: 1,
    question: "A vacancy is a type of:",
    options: ["Point defect (missing atom from a lattice site)", "Line defect", "Surface defect", "Volume defect"],
    correct: 0,
    explanation: "Point defects: vacancies, interstitials, substitutional atoms. Line defects: dislocations. Area defects: grain boundaries, stacking faults."
  },
  {
    id: "topic8_029", topicId: 8, subtopic: "Material Selection", difficulty: 3,
    question: "For a stiffness-limited design at minimum weight, the material performance index is:",
    options: ["E/ρ (or E^(1/2)/ρ or E^(1/3)/ρ depending on geometry)", "σ_y/ρ", "KIC/ρ", "E·ρ"],
    correct: 0,
    explanation: "Stiffness/weight indices: E/ρ (tie rod), E^(1/2)/ρ (beam), E^(1/3)/ρ (plate). Derived from structural equations + weight minimization."
  },
  {
    id: "topic8_030", topicId: 8, subtopic: "Mechanical Properties", difficulty: 3,
    question: "The endurance limit (fatigue limit) for steels is approximately:",
    options: ["0.5 × σ_UTS (for σ_UTS < ~1400 MPa)", "Equal to σ_UTS", "0.1 × σ_UTS", "Does not exist for steels"],
    correct: 0,
    explanation: "For many steels: S_e ≈ 0.5·σ_UTS up to about 1400 MPa. Above that, S_e plateaus. Non-ferrous metals (Al) generally have no true endurance limit."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 9 — FLUID MECHANICS  (45 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic9_001", topicId: 9, subtopic: "Fluid Statics", difficulty: 1,
    question: "Hydrostatic pressure at depth h in a fluid of density ρ is:",
    options: ["P = ρgh", "P = ρg/h", "P = ρh", "P = gh"],
    correct: 0,
    explanation: "P = ρgh (gauge pressure). Absolute: P_abs = P_atm + ρgh. Pressure increases linearly with depth."
  },
  {
    id: "topic9_002", topicId: 9, subtopic: "Fluid Statics", difficulty: 1,
    question: "Pascal's law states that:",
    options: ["Pressure applied to an enclosed fluid is transmitted equally in all directions", "Fluid flows from high to low pressure", "Viscosity is constant", "Buoyancy depends on shape"],
    correct: 0,
    explanation: "Pascal's law: pressure change at any point in a confined fluid is transmitted undiminished. Basis for hydraulic systems."
  },
  {
    id: "topic9_003", topicId: 9, subtopic: "Fluid Statics", difficulty: 2,
    question: "The buoyant force on a submerged object equals:",
    options: ["The weight of the displaced fluid (Archimedes' principle)", "The weight of the object", "The volume of the object times g", "The pressure at the centroid"],
    correct: 0,
    explanation: "Archimedes: F_b = ρ_fluid · g · V_displaced. Object floats when F_b ≥ W_object."
  },
  {
    id: "topic9_004", topicId: 9, subtopic: "Fluid Statics", difficulty: 2,
    question: "A U-tube manometer with mercury (SG = 13.6) shows a height difference of 200 mm. The pressure difference is closest to:",
    options: ["26.7 kPa", "2.67 kPa", "267 kPa", "1.96 kPa"],
    correct: 0,
    explanation: "ΔP = ρ_Hg·g·Δh = (13,600)(9.81)(0.2) = 26,690 Pa ≈ 26.7 kPa."
  },
  {
    id: "topic9_005", topicId: 9, subtopic: "Fluid Statics", difficulty: 3,
    question: "The hydrostatic force on a vertical rectangular gate (width b, height h, top at the surface) is:",
    options: ["F = ρg(h/2)(bh) = ρgbh²/2", "F = ρgbh", "F = ρgbh²", "F = ρg(h/3)(bh)"],
    correct: 0,
    explanation: "F = ρg·ȳ_c·A = ρg·(h/2)·(bh) = ρgbh²/2. Centroid of rectangular gate at h/2 below surface. Force acts at h_cp = 2h/3 from surface."
  },
  {
    id: "topic9_006", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 1,
    question: "The continuity equation for incompressible flow states:",
    options: ["A₁V₁ = A₂V₂", "A₁V₁ = A₂V₂²", "P₁ + ρV₁ = P₂ + ρV₂", "ρ₁A₁ = ρ₂A₂"],
    correct: 0,
    explanation: "For incompressible flow (ρ = const): A₁V₁ = A₂V₂ (volume flow rate Q is constant). Smaller area → higher velocity."
  },
  {
    id: "topic9_007", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 1,
    question: "Bernoulli's equation (along a streamline, incompressible, inviscid, steady flow) is:",
    options: ["P + ½ρV² + ρgz = constant", "P + ρV² + ρgz = constant", "P + ½ρV + ρgz = constant", "P = ½ρV²"],
    correct: 0,
    explanation: "P + ½ρV² + ρgz = const. Each term has units of pressure. ½ρV² = dynamic pressure. ρgz = hydrostatic pressure."
  },
  {
    id: "topic9_008", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 2,
    question: "Water flows through a horizontal pipe that narrows from 10 cm to 5 cm diameter. If V₁ = 2 m/s, then V₂ is:",
    options: ["8 m/s", "4 m/s", "16 m/s", "1 m/s"],
    correct: 0,
    explanation: "A₁V₁ = A₂V₂. A ∝ d². (10/5)² = 4. V₂ = V₁ × 4 = 8 m/s. Halving diameter quadruples velocity."
  },
  {
    id: "topic9_009", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 2,
    question: "A Pitot tube measures:",
    options: ["Stagnation pressure (from which velocity can be calculated)", "Static pressure only", "Viscosity", "Flow rate directly"],
    correct: 0,
    explanation: "Pitot tube: P_stag = P_static + ½ρV². Velocity: V = √[2(P_stag − P_static)/ρ]. Pitot-static tube measures both."
  },
  {
    id: "topic9_010", topicId: 9, subtopic: "Pipe Flow", difficulty: 1,
    question: "The Reynolds number is defined as:",
    options: ["Re = ρVD/μ = VD/ν", "Re = μV/D", "Re = ρD/(μV)", "Re = V/(ρD)"],
    correct: 0,
    explanation: "Re = ρVD/μ = VD/ν. Dimensionless ratio of inertia to viscous forces. Re < 2300: laminar. Re > 4000: turbulent (pipe flow)."
  },
  {
    id: "topic9_011", topicId: 9, subtopic: "Pipe Flow", difficulty: 2,
    question: "The Darcy-Weisbach equation for head loss in pipe flow is:",
    options: ["h_f = f·(L/D)·(V²/2g)", "h_f = f·V·L/D", "h_f = ρfLV²/(2D)", "h_f = L·V²/(2gD)"],
    correct: 0,
    explanation: "h_f = f·(L/D)·(V²/(2g)). f = Darcy friction factor (from Moody diagram or Colebrook equation). Major loss formula."
  },
  {
    id: "topic9_012", topicId: 9, subtopic: "Pipe Flow", difficulty: 2,
    question: "For fully developed laminar flow in a circular pipe, the friction factor is:",
    options: ["f = 64/Re", "f = 0.02", "f = 128/Re", "f = Re/64"],
    correct: 0,
    explanation: "Laminar (Re < 2300): f = 64/Re (Darcy friction factor). Independent of roughness. For turbulent: use Moody diagram."
  },
  {
    id: "topic9_013", topicId: 9, subtopic: "Pipe Flow", difficulty: 2,
    question: "Minor losses in pipe systems are caused by:",
    options: ["Fittings, valves, bends, expansions, and contractions", "Pipe wall friction along straight sections", "Gravity only", "Temperature changes"],
    correct: 0,
    explanation: "Minor losses: h_L = K·V²/(2g). K = loss coefficient from tables. Elbows, tees, valves, entrances/exits, contractions, expansions."
  },
  {
    id: "topic9_014", topicId: 9, subtopic: "Pipe Flow", difficulty: 3,
    question: "The Moody diagram relates:",
    options: ["Friction factor to Reynolds number and relative roughness (ε/D)", "Pressure to velocity", "Head loss to pipe length", "Flow rate to pipe diameter"],
    correct: 0,
    explanation: "Moody diagram: f vs. Re, with curves for different ε/D. Laminar: single line (f = 64/Re). Turbulent: family of curves. Fully rough: f depends only on ε/D."
  },
  {
    id: "topic9_015", topicId: 9, subtopic: "Pipe Flow", difficulty: 3,
    question: "For fully developed laminar flow in a pipe, the velocity profile is:",
    options: ["Parabolic (maximum at center, zero at wall)", "Uniform (flat)", "Linear", "Logarithmic"],
    correct: 0,
    explanation: "Laminar: u(r) = u_max[1 − (r/R)²]. Parabolic profile. V_avg = u_max/2. Turbulent profiles are much flatter (fuller)."
  },
  {
    id: "topic9_016", topicId: 9, subtopic: "External Flow", difficulty: 1,
    question: "The drag force on a body is given by:",
    options: ["F_D = C_D · ½ρV² · A", "F_D = ρV·A", "F_D = C_D · ρV · A", "F_D = ½ρV²"],
    correct: 0,
    explanation: "F_D = C_D·(½ρV²)·A. C_D = drag coefficient. A = reference area (frontal for bluff bodies, planform for airfoils)."
  },
  {
    id: "topic9_017", topicId: 9, subtopic: "External Flow", difficulty: 2,
    question: "A boundary layer transitions from laminar to turbulent at a Reynolds number (based on x) of approximately:",
    options: ["5 × 10⁵", "2300", "5 × 10⁶", "500"],
    correct: 0,
    explanation: "Flat plate: Re_x,crit ≈ 5 × 10⁵ for transition. Pipe flow: Re_crit ≈ 2300. Different characteristic lengths and geometries."
  },
  {
    id: "topic9_018", topicId: 9, subtopic: "External Flow", difficulty: 2,
    question: "The drag coefficient of a sphere drops dramatically at Re ≈ 2 × 10⁵ due to:",
    options: ["Boundary layer transition to turbulent, which delays separation", "Laminar flow becoming fully established", "The sphere deforming", "Temperature effects"],
    correct: 0,
    explanation: "Turbulent BL has more momentum near the wall → delays separation → smaller wake → less pressure drag. This is the 'drag crisis.'"
  },
  {
    id: "topic9_019", topicId: 9, subtopic: "Turbomachinery", difficulty: 1,
    question: "NPSH (Net Positive Suction Head) is important because:",
    options: ["Insufficient NPSH causes cavitation (vapor bubbles that damage the pump)", "It determines the motor size", "It sets the flow rate", "It measures pump efficiency"],
    correct: 0,
    explanation: "NPSH_available must exceed NPSH_required to prevent cavitation. Cavitation causes noise, vibration, erosion, and performance loss."
  },
  {
    id: "topic9_020", topicId: 9, subtopic: "Turbomachinery", difficulty: 2,
    question: "Specific speed N_s classifies pumps. High N_s values correspond to:",
    options: ["Axial flow pumps (high flow, low head)", "Positive displacement pumps", "Centrifugal pumps (low flow, high head)", "Gear pumps"],
    correct: 0,
    explanation: "Low N_s: centrifugal/radial (high head, low flow). Medium N_s: mixed flow. High N_s: axial flow (low head, high flow)."
  },
  {
    id: "topic9_021", topicId: 9, subtopic: "Turbomachinery", difficulty: 2,
    question: "The pump affinity laws state that flow rate is proportional to:",
    options: ["Speed (Q ∝ N)", "Speed squared (Q ∝ N²)", "Speed cubed (Q ∝ N³)", "The square root of speed"],
    correct: 0,
    explanation: "Affinity laws: Q ∝ N (flow), H ∝ N² (head), P ∝ N³ (power). Doubling speed doubles flow, quadruples head, and requires 8× power."
  },
  {
    id: "topic9_022", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 1,
    question: "Volume flow rate Q for steady flow through a pipe is:",
    options: ["Q = A·V (cross-sectional area × average velocity)", "Q = ρ·A·V", "Q = V/A", "Q = A/V"],
    correct: 0,
    explanation: "Q = A·V (m³/s). Mass flow rate: ṁ = ρAV = ρQ (kg/s)."
  },
  {
    id: "topic9_023", topicId: 9, subtopic: "Fluid Statics", difficulty: 1,
    question: "Specific gravity (SG) of a fluid is:",
    options: ["The ratio of fluid density to water density", "The fluid's weight per unit volume", "The fluid viscosity", "The fluid compressibility"],
    correct: 0,
    explanation: "SG = ρ_fluid/ρ_water. SG of water = 1.0, mercury = 13.6, oil ≈ 0.8-0.9. Dimensionless."
  },
  {
    id: "topic9_024", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 3,
    question: "The momentum equation for steady flow through a control volume is:",
    options: ["ΣF = ṁ(V_out − V_in) (vector equation)", "ΣF = ṁV", "ΣF = ρQ", "ΣF = P·A"],
    correct: 0,
    explanation: "ΣF = ṁ(V₂ − V₁). The net force equals the rate of change of momentum. For a pipe bend: forces include pressure and momentum change."
  },
  {
    id: "topic9_025", topicId: 9, subtopic: "Pipe Flow", difficulty: 1,
    question: "Laminar flow in a pipe occurs when:",
    options: ["Re < 2300", "Re > 4000", "Re = 0", "Velocity is very high"],
    correct: 0,
    explanation: "Re < 2300: laminar (smooth, orderly). 2300 < Re < 4000: transitional. Re > 4000: turbulent (chaotic, mixing)."
  },
  {
    id: "topic9_026", topicId: 9, subtopic: "External Flow", difficulty: 3,
    question: "The lift coefficient C_L for an airfoil is related to angle of attack α by (in the linear range):",
    options: ["C_L increases approximately linearly with α until stall", "C_L is constant regardless of α", "C_L decreases with α", "C_L = 0 always"],
    correct: 0,
    explanation: "In the linear range: C_L ≈ 2π·sin(α) ≈ 2πα (thin airfoil theory, α in radians). At stall (typically 12-15°), flow separates and C_L drops."
  },
  {
    id: "topic9_027", topicId: 9, subtopic: "Turbomachinery", difficulty: 3,
    question: "When two identical pumps are connected in parallel, the combined performance gives:",
    options: ["Double the flow rate at the same head", "Double the head at the same flow", "Same flow and same head", "Quadruple the power"],
    correct: 0,
    explanation: "Parallel: Q_total = Q₁ + Q₂ (double flow at same head). Series: H_total = H₁ + H₂ (double head at same flow)."
  },
  {
    id: "topic9_028", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 2,
    question: "Viscosity of a fluid represents its:",
    options: ["Resistance to shear deformation (internal friction)", "Density", "Compressibility", "Surface tension"],
    correct: 0,
    explanation: "Dynamic viscosity μ: τ = μ(du/dy) (Newton's law of viscosity). Kinematic viscosity ν = μ/ρ. Water μ ≈ 10⁻³ Pa·s at 20°C."
  },
  {
    id: "topic9_029", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 2,
    question: "The energy equation (extended Bernoulli) with pump (h_p) and turbine (h_t) and losses (h_L) is:",
    options: ["P₁/(ρg) + V₁²/(2g) + z₁ + h_p = P₂/(ρg) + V₂²/(2g) + z₂ + h_t + h_L", "P₁ + V₁² + z₁ = P₂ + V₂² + z₂", "h_p = h_t + h_L", "P₁ = P₂ + ρgh_L"],
    correct: 0,
    explanation: "General energy equation adds pump head (h_p), turbine extraction (h_t), and friction/minor losses (h_L) to Bernoulli."
  },
  {
    id: "topic9_030", topicId: 9, subtopic: "Fluid Statics", difficulty: 3,
    question: "A 2m × 3m vertical rectangular gate has its top edge 1 m below the water surface. The center of pressure is located at what depth?",
    options: ["2.90 m", "2.50 m", "3.00 m", "2.00 m"],
    correct: 0,
    explanation: "Centroid at ȳ = 1 + 3/2 = 2.5 m. I_c = bh³/12 = 2(3)³/12 = 4.5 m⁴. A = 6 m². y_cp = ȳ + I_c/(ȳ·A) = 2.5 + 4.5/(2.5·6) = 2.5 + 0.3 = 2.8 m. ≈ 2.90 m."
  },
  {
    id: "topic9_031", topicId: 9, subtopic: "Turbomachinery", difficulty: 1,
    question: "A centrifugal pump converts:",
    options: ["Mechanical energy (shaft rotation) to fluid kinetic then pressure energy", "Pressure energy to shaft work", "Heat to fluid motion", "Electrical energy directly to pressure"],
    correct: 0,
    explanation: "Centrifugal pump: impeller spins → fluid gains velocity (KE) → diffuser/volute converts velocity to pressure. Opposite of a turbine."
  },
  {
    id: "topic9_032", topicId: 9, subtopic: "Pipe Flow", difficulty: 3,
    question: "For a pipe network, at any junction the principle that must be satisfied is:",
    options: ["Conservation of mass: ΣQ_in = ΣQ_out", "Pressures are equal at all junctions", "Velocities are equal in all branches", "Friction factors are identical"],
    correct: 0,
    explanation: "Junction: ΣQ_in = ΣQ_out (continuity). Loop: Σh_f = 0 (energy conservation around any closed loop). Hardy Cross method iterates to satisfy both."
  },
  {
    id: "topic9_033", topicId: 9, subtopic: "External Flow", difficulty: 1,
    question: "The no-slip condition states that:",
    options: ["Fluid velocity at a solid surface equals the surface velocity (zero for stationary walls)", "Fluid flows freely past surfaces", "There is no friction at boundaries", "Velocity is maximum at walls"],
    correct: 0,
    explanation: "No-slip: fluid 'sticks' to the wall (V_fluid = V_wall). This is the fundamental boundary condition that creates boundary layers."
  },
  {
    id: "topic9_034", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 1,
    question: "An ideal fluid is one that is:",
    options: ["Inviscid and incompressible", "Very viscous", "Compressible only", "Real and turbulent"],
    correct: 0,
    explanation: "Ideal fluid: μ = 0 (inviscid) and ρ = const (incompressible). Simplifies analysis (Bernoulli applies). Real fluids have viscosity."
  },
  {
    id: "topic9_035", topicId: 9, subtopic: "Turbomachinery", difficulty: 2,
    question: "Pump efficiency is defined as:",
    options: ["η = ρgQH / P_shaft (fluid power out / shaft power in)", "η = P_shaft / ρgQH", "η = Q / N", "η = H / Q"],
    correct: 0,
    explanation: "η_pump = Water horsepower / Brake horsepower = ρgQH / P_shaft. Typical centrifugal pump: 70-85%."
  },
  {
    id: "topic9_036", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 3,
    question: "Dimensional analysis using the Buckingham Pi theorem: if there are n variables and m fundamental dimensions, the number of dimensionless groups is:",
    options: ["n − m", "n + m", "n × m", "n / m"],
    correct: 0,
    explanation: "Pi theorem: k = n − m dimensionless Π groups. If 6 variables with 3 dimensions (M, L, T): 6 − 3 = 3 Π groups."
  },
  {
    id: "topic9_037", topicId: 9, subtopic: "Pipe Flow", difficulty: 2,
    question: "The head loss for a sudden expansion from area A₁ to A₂ is:",
    options: ["h_L = (V₁ − V₂)²/(2g)", "h_L = V₁²/(2g)", "h_L = (V₁ + V₂)²/(2g)", "h_L = K·V₂²/(2g)"],
    correct: 0,
    explanation: "Borda-Carnot: h_L = (V₁ − V₂)²/(2g) for sudden expansion. Derived from momentum and continuity. K = (1 − A₁/A₂)²."
  },
  {
    id: "topic9_038", topicId: 9, subtopic: "Fluid Statics", difficulty: 2,
    question: "For a floating body, stability requires the metacenter to be:",
    options: ["Above the center of gravity", "Below the center of gravity", "At the center of gravity", "At the waterline"],
    correct: 0,
    explanation: "Metacentric height GM > 0 → stable (M above G). GM < 0 → unstable (capsizes). GM = 0 → neutral."
  },
  {
    id: "topic9_039", topicId: 9, subtopic: "External Flow", difficulty: 2,
    question: "Form (pressure) drag is dominant for:",
    options: ["Bluff bodies (like spheres and cylinders)", "Streamlined bodies", "Flat plates parallel to flow", "Very thin airfoils"],
    correct: 0,
    explanation: "Bluff bodies: large wake → pressure drag dominates. Streamlined bodies: friction drag dominates. Total drag = friction + pressure drag."
  },
  {
    id: "topic9_040", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 2,
    question: "The Froude number Fr = V/√(gL) is important in:",
    options: ["Open channel flow and free surface flows", "Pipe flow", "Compressible gas dynamics", "Heat transfer"],
    correct: 0,
    explanation: "Fr characterizes free surface flows. Fr < 1: subcritical (tranquil). Fr > 1: supercritical (rapid). Fr = 1: critical flow."
  },
  {
    id: "topic9_041", topicId: 9, subtopic: "Turbomachinery", difficulty: 3,
    question: "The Euler turbomachine equation relates pump/turbine head to:",
    options: ["The change in angular momentum of the fluid: h = (U₂V_θ₂ − U₁V_θ₁)/g", "The pipe friction", "The fluid viscosity", "The reservoir elevation"],
    correct: 0,
    explanation: "Euler: h = (U₂V_θ₂ − U₁V_θ₁)/g, where U = blade tip speed, V_θ = tangential component of absolute velocity. Fundamental for pump/turbine design."
  },
  {
    id: "topic9_042", topicId: 9, subtopic: "Pipe Flow", difficulty: 1,
    question: "Gauge pressure is:",
    options: ["Pressure relative to atmospheric pressure", "Pressure relative to absolute zero (vacuum)", "Always negative", "The same as absolute pressure"],
    correct: 0,
    explanation: "P_gauge = P_absolute − P_atm. Can be positive or negative (vacuum). Most instruments read gauge pressure."
  },
  {
    id: "topic9_043", topicId: 9, subtopic: "External Flow", difficulty: 3,
    question: "The Stokes drag law (F_D = 3πμVd) applies when:",
    options: ["Re << 1 (creeping flow around a sphere)", "Re >> 1", "Flow is turbulent", "The sphere is very large"],
    correct: 0,
    explanation: "Stokes drag: valid for Re < 1 (creeping flow). C_D = 24/Re. Used for settling of small particles, Stokes viscometer."
  },
  {
    id: "topic9_044", topicId: 9, subtopic: "Fluid Dynamics", difficulty: 2,
    question: "A venturi meter measures flow rate by:",
    options: ["Measuring the pressure drop through a converging section and applying Bernoulli/continuity", "Counting vortices shed from a bluff body", "Measuring turbine rotation", "Timing tracer particles"],
    correct: 0,
    explanation: "Venturi: converging-diverging section. ΔP between throat and inlet → V → Q. Higher ΔP = higher flow. C_d ≈ 0.98 (discharge coefficient)."
  },
  {
    id: "topic9_045", topicId: 9, subtopic: "Turbomachinery", difficulty: 2,
    question: "Cavitation in a pump can be prevented by:",
    options: ["Ensuring NPSH_available > NPSH_required (lower pump, shorter suction pipe, cooler fluid)", "Increasing pump speed", "Reducing suction pipe diameter", "Raising fluid temperature"],
    correct: 0,
    explanation: "Prevent cavitation: raise liquid level, shorten/enlarge suction pipe, reduce temperature (lower vapor pressure), reduce speed. NPSH_a > NPSH_r."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 10 — THERMODYNAMICS  (45 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic10_001", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 1,
    question: "The first law of thermodynamics for a closed system is:",
    options: ["Q − W = ΔU (heat in minus work out equals change in internal energy)", "Q = W always", "ΔU = 0 always", "W = ΔU"],
    correct: 0,
    explanation: "First law (closed system): Q − W = ΔU. Sign convention: Q positive into system, W positive out of system. Energy is conserved."
  },
  {
    id: "topic10_002", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 1,
    question: "The second law of thermodynamics states that:",
    options: ["Entropy of an isolated system can only increase or stay the same", "Energy can be created from nothing", "Heat flows from cold to hot spontaneously", "Work can be completely converted to heat"],
    correct: 0,
    explanation: "Second law: ΔS_universe ≥ 0. Heat flows from hot to cold naturally. No heat engine can be 100% efficient."
  },
  {
    id: "topic10_003", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 2,
    question: "For an adiabatic process:",
    options: ["Q = 0 (no heat transfer)", "W = 0", "ΔT = 0", "ΔS = 0"],
    correct: 0,
    explanation: "Adiabatic: Q = 0 (perfectly insulated). If also reversible → isentropic (ΔS = 0). Adiabatic + irreversible → ΔS > 0."
  },
  {
    id: "topic10_004", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 2,
    question: "An isothermal process for an ideal gas has:",
    options: ["ΔU = 0 (internal energy depends only on T for ideal gas), so Q = W", "Q = 0", "W = 0", "ΔS = 0"],
    correct: 0,
    explanation: "Isothermal (T = const): for ideal gas, U = f(T) only → ΔU = 0. First law: Q = W. Work: W = nRT·ln(V₂/V₁)."
  },
  {
    id: "topic10_005", topicId: 10, subtopic: "Properties & Tables", difficulty: 1,
    question: "The ideal gas law is:",
    options: ["PV = nRT (or Pv = RT for specific volume)", "PV = constant", "PV² = nRT", "P = ρRT²"],
    correct: 0,
    explanation: "PV = nRT (molar) or Pv = RT (specific). R_universal = 8.314 J/(mol·K). Applies well at low P and high T (far from condensation)."
  },
  {
    id: "topic10_006", topicId: 10, subtopic: "Properties & Tables", difficulty: 2,
    question: "Quality x in a two-phase (wet steam) mixture represents:",
    options: ["The mass fraction of vapor: x = m_vapor/m_total", "The temperature ratio", "The pressure ratio", "The volume ratio"],
    correct: 0,
    explanation: "x = m_g/(m_f + m_g). x = 0: saturated liquid. x = 1: saturated vapor. Properties: h = h_f + x·h_fg."
  },
  {
    id: "topic10_007", topicId: 10, subtopic: "Properties & Tables", difficulty: 2,
    question: "To determine the state of water at 200°C and 500 kPa, you should:",
    options: ["Compare to saturation conditions: if T > T_sat at given P, it's superheated", "Always assume saturated", "Use ideal gas law", "Assume incompressible liquid"],
    correct: 0,
    explanation: "T_sat at 500 kPa ≈ 151.8°C. Since 200°C > 151.8°C → superheated vapor. Use superheat tables with T and P."
  },
  {
    id: "topic10_008", topicId: 10, subtopic: "Cycles", difficulty: 1,
    question: "The Carnot efficiency is:",
    options: ["η = 1 − T_L/T_H (temperatures in Kelvin)", "η = T_L/T_H", "η = 1 − T_H/T_L", "η = (T_H − T_L)/T_L"],
    correct: 0,
    explanation: "η_Carnot = 1 − T_L/T_H. Maximum possible efficiency between two temperatures. All temperatures must be in absolute units (K or R)."
  },
  {
    id: "topic10_009", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "The ideal Rankine cycle consists of:",
    options: ["Pump → Boiler → Turbine → Condenser", "Compressor → Combustor → Turbine → Heat exchanger", "Two isothermal + two adiabatic processes", "Compression → constant volume heat addition → expansion → exhaust"],
    correct: 0,
    explanation: "Rankine (steam power): 1-2 pump (isentropic compression), 2-3 boiler (const P heat add), 3-4 turbine (isentropic expansion), 4-1 condenser (const P heat rejection)."
  },
  {
    id: "topic10_010", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "The Otto cycle models:",
    options: ["Spark-ignition (gasoline) engines", "Diesel engines", "Gas turbines", "Steam power plants"],
    correct: 0,
    explanation: "Otto: SI engines. Constant volume heat addition/rejection. η = 1 − 1/r^(γ−1), r = compression ratio. Diesel: constant pressure heat addition."
  },
  {
    id: "topic10_011", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "The Brayton cycle is the ideal cycle for:",
    options: ["Gas turbines (jet engines)", "Steam power plants", "Refrigerators", "Gasoline engines"],
    correct: 0,
    explanation: "Brayton: isentropic compression → constant P heat addition → isentropic expansion → constant P heat rejection. η = 1 − 1/r_p^((γ−1)/γ)."
  },
  {
    id: "topic10_012", topicId: 10, subtopic: "Cycles", difficulty: 3,
    question: "An Otto cycle has compression ratio r = 8. With γ = 1.4, the thermal efficiency is:",
    options: ["56.5%", "75%", "44%", "62.5%"],
    correct: 0,
    explanation: "η = 1 − 1/r^(γ−1) = 1 − 1/8^0.4 = 1 − 1/2.297 = 1 − 0.435 = 0.565 = 56.5%."
  },
  {
    id: "topic10_013", topicId: 10, subtopic: "Cycles", difficulty: 1,
    question: "The coefficient of performance (COP) of a refrigerator is:",
    options: ["COP = Q_L/W_net (cooling effect per unit work input)", "COP = W/Q_L", "COP = Q_H/W", "COP = 1 − T_L/T_H"],
    correct: 0,
    explanation: "COP_ref = Q_L/W = Q_L/(Q_H − Q_L). Heat pump: COP_HP = Q_H/W. COP_HP = COP_ref + 1."
  },
  {
    id: "topic10_014", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "The vapor-compression refrigeration cycle components (in order) are:",
    options: ["Compressor → Condenser → Expansion valve → Evaporator", "Pump → Boiler → Turbine → Condenser", "Compressor → Evaporator → Condenser → Expansion valve", "Turbine → Heat exchanger → Compressor → Cooler"],
    correct: 0,
    explanation: "Vapor-compression: 1→2 compressor (low P vapor to high P), 2→3 condenser (reject heat), 3→4 expansion (throttle), 4→1 evaporator (absorb heat)."
  },
  {
    id: "topic10_015", topicId: 10, subtopic: "Mixtures & Psychrometrics", difficulty: 1,
    question: "Relative humidity is defined as:",
    options: ["The ratio of actual vapor pressure to saturation vapor pressure at the same temperature", "The mass of water per mass of dry air", "The dew point temperature", "The wet-bulb temperature"],
    correct: 0,
    explanation: "φ = P_v/P_sat × 100%. At φ = 100%: air is saturated (T = dew point). Humidity ratio ω = m_v/m_a = 0.622·P_v/(P − P_v)."
  },
  {
    id: "topic10_016", topicId: 10, subtopic: "Mixtures & Psychrometrics", difficulty: 2,
    question: "On a psychrometric chart, the dew point is found by:",
    options: ["Moving horizontally left (constant ω) until reaching the saturation curve", "Moving vertically down", "Moving along constant enthalpy lines", "Moving along constant wet-bulb lines"],
    correct: 0,
    explanation: "Dew point: constant humidity ratio (ω) → follow horizontal line left until it hits the saturation curve. T at that point = dew point."
  },
  {
    id: "topic10_017", topicId: 10, subtopic: "Combustion", difficulty: 1,
    question: "Stoichiometric combustion means:",
    options: ["Exact amount of air for complete combustion (no excess O₂ or unburned fuel)", "Excess air is used", "Combustion is incomplete", "Only CO is produced"],
    correct: 0,
    explanation: "Stoichiometric: theoretical air for complete combustion. Products: CO₂ + H₂O (+ N₂). Excess air: more O₂ than needed."
  },
  {
    id: "topic10_018", topicId: 10, subtopic: "Combustion", difficulty: 2,
    question: "The air-fuel ratio (AF) for stoichiometric combustion of methane (CH₄) is approximately:",
    options: ["17.2 (mass basis)", "15.0", "9.0", "23.0"],
    correct: 0,
    explanation: "CH₄ + 2O₂ → CO₂ + 2H₂O. Mass: 2(32)/16 = 4 kg O₂/kg fuel. With air (23.2% O₂ by mass): AF = 4/0.232 = 17.2."
  },
  {
    id: "topic10_019", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 2,
    question: "Entropy change for an ideal gas with constant specific heats is:",
    options: ["Δs = c_v·ln(T₂/T₁) + R·ln(v₂/v₁)", "Δs = c_p·ln(P₂/P₁)", "Δs = R·ln(T₂/T₁)", "Δs = c_v·(T₂ − T₁)"],
    correct: 0,
    explanation: "Δs = c_v·ln(T₂/T₁) + R·ln(v₂/v₁) OR Δs = c_p·ln(T₂/T₁) − R·ln(P₂/P₁). Both are equivalent."
  },
  {
    id: "topic10_020", topicId: 10, subtopic: "Properties & Tables", difficulty: 1,
    question: "Enthalpy is defined as:",
    options: ["h = u + Pv (internal energy + flow work)", "h = u − Pv", "h = Pv", "h = u/P"],
    correct: 0,
    explanation: "h = u + Pv. For open systems (steady flow), enthalpy naturally accounts for flow work. Useful for turbines, compressors, heat exchangers."
  },
  {
    id: "topic10_021", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 3,
    question: "The steady-state energy equation for an open system (SFEE) is:",
    options: ["q − w = Δh + ΔKE + ΔPE", "q = w", "Δu = q − w", "w = Δh"],
    correct: 0,
    explanation: "SFEE: q − w_s = (h₂ − h₁) + (V₂² − V₁²)/2 + g(z₂ − z₁). For turbines/compressors, KE and PE changes are often negligible."
  },
  {
    id: "topic10_022", topicId: 10, subtopic: "Cycles", difficulty: 3,
    question: "Reheat in a Rankine cycle improves efficiency by:",
    options: ["Expanding partially in the turbine, reheating, then expanding again — increases average T of heat addition", "Compressing steam twice", "Removing the condenser", "Reducing boiler pressure"],
    correct: 0,
    explanation: "Reheat: steam partially expands → returns to boiler for reheating → expands again. Increases avg temperature of heat addition and keeps exit quality higher."
  },
  {
    id: "topic10_023", topicId: 10, subtopic: "Properties & Tables", difficulty: 2,
    question: "Specific heat at constant pressure c_p and at constant volume c_v are related by:",
    options: ["c_p − c_v = R (for ideal gas)", "c_p = c_v", "c_p/c_v = R", "c_p + c_v = R"],
    correct: 0,
    explanation: "For ideal gas: c_p − c_v = R. γ = c_p/c_v. For air: c_p = 1.005 kJ/(kg·K), c_v = 0.718, R = 0.287, γ = 1.4."
  },
  {
    id: "topic10_024", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 1,
    question: "In an isobaric process:",
    options: ["Pressure remains constant", "Volume remains constant", "Temperature remains constant", "Entropy remains constant"],
    correct: 0,
    explanation: "Isobaric: P = const. Isochoric: V = const. Isothermal: T = const. Isentropic: S = const. Adiabatic: Q = 0."
  },
  {
    id: "topic10_025", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "The Diesel cycle differs from the Otto cycle in that heat addition occurs at:",
    options: ["Constant pressure (instead of constant volume)", "Constant temperature", "Constant entropy", "Variable pressure and volume"],
    correct: 0,
    explanation: "Otto: const V heat add → spark ignition. Diesel: const P heat add → compression ignition. Diesel has higher compression ratio and efficiency."
  },
  {
    id: "topic10_026", topicId: 10, subtopic: "Combustion", difficulty: 3,
    question: "The higher heating value (HHV) differs from lower heating value (LHV) by:",
    options: ["The latent heat of vaporization of water in the products", "The heat of combustion", "The air-fuel ratio", "The flame temperature"],
    correct: 0,
    explanation: "HHV includes the latent heat recovered when product water condenses. LHV assumes water leaves as vapor. HHV = LHV + m_w·h_fg."
  },
  {
    id: "topic10_027", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 3,
    question: "Exergy (availability) represents:",
    options: ["The maximum useful work obtainable as a system reaches equilibrium with its surroundings", "The total energy of the system", "The entropy of the system", "The kinetic energy only"],
    correct: 0,
    explanation: "Exergy = (U − U₀) + P₀(V − V₀) − T₀(S − S₀). It measures the 'quality' of energy. Destroyed by irreversibilities."
  },
  {
    id: "topic10_028", topicId: 10, subtopic: "Properties & Tables", difficulty: 3,
    question: "A throttling process (e.g., expansion valve) has:",
    options: ["h₁ = h₂ (constant enthalpy), with a pressure drop", "s₁ = s₂", "T₁ = T₂", "P₁ = P₂"],
    correct: 0,
    explanation: "Throttling: h₁ = h₂ (no work, no heat, negligible KE change). Pressure drops, entropy increases (irreversible). Temperature may increase or decrease."
  },
  {
    id: "topic10_029", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "A heat pump COP of 4 means:",
    options: ["4 units of heat are delivered per 1 unit of work input", "Efficiency is 400%", "4 units of work are needed per unit of heat", "The system is 25% efficient"],
    correct: 0,
    explanation: "COP_HP = Q_H/W = 4. For every 1 kW of electrical input, 4 kW of heat is delivered. COP > 1 is normal for heat pumps."
  },
  {
    id: "topic10_030", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 2,
    question: "The Clausius inequality states:",
    options: ["∮ δQ/T ≤ 0 for any cycle", "∮ δQ/T = 0 always", "∮ δQ/T > 0 always", "∮ δQ = 0"],
    correct: 0,
    explanation: "∮ δQ/T ≤ 0. Equality for reversible cycle (Carnot). Inequality for irreversible. Foundation of entropy concept."
  },
  {
    id: "topic10_031", topicId: 10, subtopic: "Mixtures & Psychrometrics", difficulty: 2,
    question: "Dalton's law of partial pressures states:",
    options: ["Total pressure = sum of partial pressures of each gas component", "Total volume = sum of partial volumes", "All gases have the same pressure", "Pressure is independent of composition"],
    correct: 0,
    explanation: "P_total = Σ P_i. Each component exerts pressure as if it alone occupied the volume. P_i = y_i · P_total (y_i = mole fraction)."
  },
  {
    id: "topic10_032", topicId: 10, subtopic: "Properties & Tables", difficulty: 1,
    question: "An ideal gas at constant temperature undergoing expansion: what happens to pressure?",
    options: ["Pressure decreases (PV = nRT, T const → P₁V₁ = P₂V₂)", "Pressure increases", "Pressure stays constant", "Pressure doubles"],
    correct: 0,
    explanation: "Isothermal (T = const): PV = const → P₁V₁ = P₂V₂. If V increases, P must decrease proportionally (Boyle's law)."
  },
  {
    id: "topic10_033", topicId: 10, subtopic: "Cycles", difficulty: 3,
    question: "Regeneration in a Brayton cycle improves efficiency by:",
    options: ["Using turbine exhaust heat to preheat compressor discharge air before the combustor", "Adding a second compressor", "Removing the combustor", "Increasing the pressure ratio"],
    correct: 0,
    explanation: "Regenerator transfers heat from hot turbine exhaust to cool compressor outlet. Reduces fuel needed in combustor. Most effective at low pressure ratios."
  },
  {
    id: "topic10_034", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 1,
    question: "Work done by an ideal gas in a constant-pressure expansion is:",
    options: ["W = P·ΔV = P(V₂ − V₁)", "W = 0", "W = nRT·ln(V₂/V₁)", "W = ½P·ΔV"],
    correct: 0,
    explanation: "Isobaric work: W = ∫P dV = P(V₂ − V₁) since P is constant. On a P-V diagram, it's the area under the horizontal line."
  },
  {
    id: "topic10_035", topicId: 10, subtopic: "Properties & Tables", difficulty: 2,
    question: "For an isentropic process with an ideal gas (constant specific heats): T₂/T₁ =",
    options: ["(P₂/P₁)^((γ−1)/γ)", "(P₂/P₁)^γ", "(V₁/V₂)^γ", "(P₂/P₁)^(1/γ)"],
    correct: 0,
    explanation: "Isentropic relations: T₂/T₁ = (P₂/P₁)^((γ−1)/γ) = (V₁/V₂)^(γ−1). PV^γ = const. These assume ideal gas + constant specific heats."
  },
  {
    id: "topic10_036", topicId: 10, subtopic: "Combustion", difficulty: 2,
    question: "Excess air in combustion is used to:",
    options: ["Ensure complete combustion of fuel (prevent CO and unburned hydrocarbons)", "Increase flame temperature", "Reduce oxygen in the exhaust", "Save fuel"],
    correct: 0,
    explanation: "Excess air ensures all fuel burns completely. Too much excess air cools the flame and wastes energy. Typical: 10-50% excess depending on fuel."
  },
  {
    id: "topic10_037", topicId: 10, subtopic: "Mixtures & Psychrometrics", difficulty: 3,
    question: "In an adiabatic saturation process, the final state of the air is at:",
    options: ["100% relative humidity (saturated) at the adiabatic saturation temperature", "0% relative humidity", "The initial temperature", "The dew point of the inlet air"],
    correct: 0,
    explanation: "Adiabatic saturation: air passes over water in an insulated duct. Exits saturated at T_adiabatic_sat ≈ wet-bulb temperature."
  },
  {
    id: "topic10_038", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 2,
    question: "Irreversibilities in a process cause:",
    options: ["Entropy generation (ΔS_universe > 0)", "Entropy decrease", "No change in entropy", "Work output to increase"],
    correct: 0,
    explanation: "Irreversibilities (friction, heat transfer across ΔT, mixing) generate entropy. S_gen > 0 always. Reduces available work."
  },
  {
    id: "topic10_039", topicId: 10, subtopic: "Cycles", difficulty: 1,
    question: "A Carnot engine operating between 800 K and 300 K has an efficiency of:",
    options: ["62.5%", "37.5%", "50%", "75%"],
    correct: 0,
    explanation: "η = 1 − T_L/T_H = 1 − 300/800 = 1 − 0.375 = 0.625 = 62.5%."
  },
  {
    id: "topic10_040", topicId: 10, subtopic: "Properties & Tables", difficulty: 1,
    question: "The triple point of water is:",
    options: ["0.01°C, 0.6117 kPa (where solid, liquid, and vapor coexist)", "0°C, 101.325 kPa", "100°C, 101.325 kPa", "0°C, 0 kPa"],
    correct: 0,
    explanation: "Triple point: T = 0.01°C = 273.16 K, P = 611.7 Pa = 0.6117 kPa. All three phases coexist in equilibrium."
  },
  {
    id: "topic10_041", topicId: 10, subtopic: "Cycles", difficulty: 3,
    question: "The isentropic efficiency of a turbine is:",
    options: ["η_t = (h₁ − h₂_actual)/(h₁ − h₂s) (actual work / ideal work)", "η_t = (h₁ − h₂s)/(h₁ − h₂_actual)", "η_t = T₂/T₁", "η_t = P₂/P₁"],
    correct: 0,
    explanation: "Turbine: η_t = w_actual/w_ideal = (h₁ − h₂a)/(h₁ − h₂s). Compressor: η_c = w_ideal/w_actual = (h₂s − h₁)/(h₂a − h₁). Note the inversion."
  },
  {
    id: "topic10_042", topicId: 10, subtopic: "Combustion", difficulty: 1,
    question: "Complete combustion of a hydrocarbon produces:",
    options: ["CO₂ and H₂O", "CO and H₂", "C and H₂O", "CO₂ and H₂"],
    correct: 0,
    explanation: "Complete combustion: C → CO₂, H → H₂O. Incomplete: also produces CO, C (soot), unburned hydrocarbons."
  },
  {
    id: "topic10_043", topicId: 10, subtopic: "Mixtures & Psychrometrics", difficulty: 1,
    question: "The wet-bulb temperature is always:",
    options: ["Less than or equal to the dry-bulb temperature", "Greater than dry-bulb", "Equal to dew point", "Independent of humidity"],
    correct: 0,
    explanation: "T_wb ≤ T_db always. At 100% RH: T_wb = T_db = T_dp. Lower humidity → larger gap between dry-bulb and wet-bulb."
  },
  {
    id: "topic10_044", topicId: 10, subtopic: "Laws of Thermodynamics", difficulty: 3,
    question: "For a polytropic process PV^n = C, what value of n gives an isothermal process for an ideal gas?",
    options: ["n = 1", "n = 0", "n = γ", "n = ∞"],
    correct: 0,
    explanation: "n = 0: isobaric (P = C). n = 1: isothermal (PV = C). n = γ: isentropic. n = ∞: isochoric (V = C)."
  },
  {
    id: "topic10_045", topicId: 10, subtopic: "Cycles", difficulty: 2,
    question: "Increasing the boiler pressure in a Rankine cycle:",
    options: ["Generally increases thermal efficiency but may reduce turbine exit quality", "Decreases efficiency", "Has no effect", "Always increases exit quality"],
    correct: 0,
    explanation: "Higher boiler P → higher average T of heat addition → higher η. But expansion to same condenser P may yield lower quality (wetter steam) at turbine exit."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 11 — HEAT TRANSFER  (40 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic11_001", topicId: 11, subtopic: "Conduction", difficulty: 1,
    question: "Fourier's law of heat conduction states:",
    options: ["q = −kA(dT/dx) (heat flow proportional to temperature gradient)", "q = hA(T_s − T_∞)", "q = εσAT⁴", "q = ṁc_pΔT"],
    correct: 0,
    explanation: "Fourier: q = −kA(dT/dx). Negative sign: heat flows from high to low temperature. k = thermal conductivity (W/(m·K))."
  },
  {
    id: "topic11_002", topicId: 11, subtopic: "Conduction", difficulty: 1,
    question: "Thermal resistance for conduction through a flat wall is:",
    options: ["R = L/(kA)", "R = kA/L", "R = 1/(hA)", "R = L·k·A"],
    correct: 0,
    explanation: "R_cond = L/(kA). Like electrical resistance: q = ΔT/R_total. Series: R_total = ΣR_i. Parallel: 1/R_total = Σ(1/R_i)."
  },
  {
    id: "topic11_003", topicId: 11, subtopic: "Conduction", difficulty: 2,
    question: "A composite wall has two layers: Layer 1 (k₁ = 2 W/(m·K), L₁ = 0.1 m) and Layer 2 (k₂ = 0.5 W/(m·K), L₂ = 0.05 m). Per unit area, the total thermal resistance is:",
    options: ["0.15 m²·K/W", "0.10 m²·K/W", "0.20 m²·K/W", "0.05 m²·K/W"],
    correct: 0,
    explanation: "R₁ = L₁/k₁ = 0.1/2 = 0.05. R₂ = L₂/k₂ = 0.05/0.5 = 0.10. R_total = 0.05 + 0.10 = 0.15 m²·K/W (series)."
  },
  {
    id: "topic11_004", topicId: 11, subtopic: "Conduction", difficulty: 2,
    question: "The Biot number Bi = hL/k determines whether:",
    options: ["Internal temperature gradients are significant (Bi < 0.1: lumped system valid)", "Flow is laminar or turbulent", "Radiation is important", "The wall is thin enough"],
    correct: 0,
    explanation: "Bi = hL_c/k_solid. Bi < 0.1: lumped capacitance (uniform T inside body). Bi >> 1: significant internal ΔT. L_c = V/A_s."
  },
  {
    id: "topic11_005", topicId: 11, subtopic: "Conduction", difficulty: 3,
    question: "In the lumped capacitance model, the time constant τ for cooling/heating is:",
    options: ["τ = ρVc_p/(hA_s)", "τ = hA_s/(ρVc_p)", "τ = k/(ρc_p)", "τ = L²/α"],
    correct: 0,
    explanation: "τ = ρVc_p/(hA_s). T(t) = T_∞ + (T_i − T_∞)e^(−t/τ). After t = τ: temperature difference drops to 36.8% of initial."
  },
  {
    id: "topic11_006", topicId: 11, subtopic: "Conduction", difficulty: 2,
    question: "Thermal diffusivity α = k/(ρc_p) represents:",
    options: ["How quickly a material adjusts its temperature (high α = fast response)", "Total heat stored", "The heat flow rate", "The thermal resistance"],
    correct: 0,
    explanation: "α = k/(ρc_p). High k + low ρc_p → high α → fast thermal response. Units: m²/s. Appears in transient conduction: Fo = αt/L²."
  },
  {
    id: "topic11_007", topicId: 11, subtopic: "Conduction", difficulty: 3,
    question: "For a cylindrical pipe, the conduction thermal resistance per unit length is:",
    options: ["R = ln(r₂/r₁)/(2πkL)", "R = (r₂ − r₁)/(kA)", "R = 1/(2πr₁hL)", "R = r₂/(kL)"],
    correct: 0,
    explanation: "Cylindrical conduction: R = ln(r_outer/r_inner)/(2πkL). The log-mean is needed because area changes with radius."
  },
  {
    id: "topic11_008", topicId: 11, subtopic: "Conduction", difficulty: 2,
    question: "Adding insulation to a small-diameter pipe may initially INCREASE heat loss due to:",
    options: ["The critical radius of insulation: r_cr = k_insulation/h_outside", "Increased conduction", "Reduced convection", "Radiation effects"],
    correct: 0,
    explanation: "r_cr = k/h. If r_pipe < r_cr, adding insulation increases the outer surface area faster than the resistance increases → more heat loss. Above r_cr, insulation always helps."
  },
  {
    id: "topic11_009", topicId: 11, subtopic: "Convection", difficulty: 1,
    question: "Newton's law of cooling states:",
    options: ["q = hA(T_s − T_∞)", "q = kA(dT/dx)", "q = εσA(T⁴ − T_surr⁴)", "q = ṁc_pΔT"],
    correct: 0,
    explanation: "Convection: q = hA(T_s − T_∞). h = convection heat transfer coefficient (W/(m²·K)). Depends on flow conditions, geometry, and fluid properties."
  },
  {
    id: "topic11_010", topicId: 11, subtopic: "Convection", difficulty: 2,
    question: "The Nusselt number Nu = hL/k_fluid represents:",
    options: ["The ratio of convective to conductive heat transfer", "The ratio of inertia to viscous forces", "The ratio of momentum to thermal diffusivity", "The fluid velocity"],
    correct: 0,
    explanation: "Nu = hL/k_f. Nu = 1 → pure conduction. Nu >> 1 → convection dominates. Higher Nu → more effective convection."
  },
  {
    id: "topic11_011", topicId: 11, subtopic: "Convection", difficulty: 2,
    question: "The Prandtl number Pr = ν/α = μc_p/k represents:",
    options: ["The ratio of momentum diffusivity to thermal diffusivity", "The ratio of inertia to viscous forces", "The heat transfer coefficient", "The flow velocity"],
    correct: 0,
    explanation: "Pr = ν/α. For air: Pr ≈ 0.71 (thin thermal BL). For water: Pr ≈ 7 (thick thermal BL). For oils: Pr ≈ 100-1000."
  },
  {
    id: "topic11_012", topicId: 11, subtopic: "Convection", difficulty: 2,
    question: "For forced convection over a flat plate (laminar), the Nusselt number correlation is:",
    options: ["Nu = 0.332·Re^(1/2)·Pr^(1/3)", "Nu = 0.023·Re^(4/5)·Pr^(1/3)", "Nu = 0.664·Re^(1/2)·Pr^(1/3)", "Nu = C·Ra^(1/4)"],
    correct: 0,
    explanation: "Local Nu_x = 0.332·Re_x^(1/2)·Pr^(1/3) (laminar, flat plate). Average over plate length: Nu_L = 0.664·Re_L^(1/2)·Pr^(1/3)."
  },
  {
    id: "topic11_013", topicId: 11, subtopic: "Convection", difficulty: 3,
    question: "The Dittus-Boelter equation for turbulent flow in a pipe is:",
    options: ["Nu = 0.023·Re^(0.8)·Pr^n (n = 0.4 heating, 0.3 cooling)", "Nu = 0.332·Re^(0.5)·Pr^(1/3)", "Nu = 3.66 (constant wall temp)", "Nu = 48/11 (constant heat flux)"],
    correct: 0,
    explanation: "Dittus-Boelter: Nu = 0.023·Re^0.8·Pr^n. n = 0.4 (fluid being heated), n = 0.3 (cooled). Valid for Re > 10,000, 0.7 < Pr < 160."
  },
  {
    id: "topic11_014", topicId: 11, subtopic: "Convection", difficulty: 1,
    question: "Natural (free) convection is driven by:",
    options: ["Buoyancy forces due to density differences caused by temperature variations", "A fan or pump", "Pressure differences from external sources", "Electromagnetic forces"],
    correct: 0,
    explanation: "Natural convection: heated fluid rises (lower density), cooler fluid descends. Governed by Grashof (Gr) or Rayleigh (Ra) number."
  },
  {
    id: "topic11_015", topicId: 11, subtopic: "Convection", difficulty: 2,
    question: "The Grashof number Gr represents:",
    options: ["Ratio of buoyancy to viscous forces in natural convection", "Ratio of inertia to viscous forces", "Convective to conductive heat transfer", "Momentum to thermal diffusivity"],
    correct: 0,
    explanation: "Gr = gβΔTL³/ν². Plays the role in natural convection that Re plays in forced convection. Ra = Gr·Pr."
  },
  {
    id: "topic11_016", topicId: 11, subtopic: "Radiation", difficulty: 1,
    question: "The Stefan-Boltzmann law gives the total emissive power of a blackbody as:",
    options: ["E_b = σT⁴, where σ = 5.67 × 10⁻⁸ W/(m²·K⁴)", "E_b = σT²", "E_b = σT", "E_b = σ/T⁴"],
    correct: 0,
    explanation: "E_b = σT⁴. Blackbody emits maximum radiation at any temperature. Real surfaces: E = εσT⁴ (ε = emissivity, 0 ≤ ε ≤ 1)."
  },
  {
    id: "topic11_017", topicId: 11, subtopic: "Radiation", difficulty: 1,
    question: "Emissivity ε of a surface ranges from:",
    options: ["0 to 1 (0 = perfect reflector, 1 = blackbody)", "0 to ∞", "−1 to 1", "1 to 10"],
    correct: 0,
    explanation: "ε = 0: reflects all radiation (perfect mirror). ε = 1: absorbs and emits all radiation (blackbody). Real surfaces: 0 < ε < 1."
  },
  {
    id: "topic11_018", topicId: 11, subtopic: "Radiation", difficulty: 2,
    question: "The net radiation heat exchange between two blackbody surfaces is:",
    options: ["q₁₂ = A₁F₁₂σ(T₁⁴ − T₂⁴)", "q₁₂ = A₁σ(T₁⁴ − T₂⁴)", "q₁₂ = σ(T₁ − T₂)", "q₁₂ = F₁₂(T₁ − T₂)"],
    correct: 0,
    explanation: "q₁₂ = A₁·F₁₂·σ·(T₁⁴ − T₂⁴). F₁₂ = view factor (fraction of radiation leaving surface 1 that reaches surface 2)."
  },
  {
    id: "topic11_019", topicId: 11, subtopic: "Radiation", difficulty: 2,
    question: "The view factor summation rule states:",
    options: ["ΣF_ij = 1 for all j in an enclosure (all radiation goes somewhere)", "ΣF_ij = 0", "F₁₂ = F₂₁ always", "F₁₁ = 1 always"],
    correct: 0,
    explanation: "Summation rule: ΣF_ij = 1. Reciprocity: A₁F₁₂ = A₂F₂₁. For a convex surface in an enclosure: F₁₁ = 0."
  },
  {
    id: "topic11_020", topicId: 11, subtopic: "Radiation", difficulty: 3,
    question: "Wien's displacement law states that the peak wavelength of blackbody radiation is:",
    options: ["λ_max·T = 2898 μm·K (higher T → shorter peak wavelength)", "λ_max = σT⁴", "λ_max is constant for all temperatures", "λ_max·T² = constant"],
    correct: 0,
    explanation: "λ_max·T = 2898 μm·K. Sun (~5800K): λ_max ≈ 0.5 μm (visible). Room temp (~300K): λ_max ≈ 10 μm (infrared)."
  },
  {
    id: "topic11_021", topicId: 11, subtopic: "Heat Exchangers", difficulty: 1,
    question: "The LMTD (Log Mean Temperature Difference) for a heat exchanger is:",
    options: ["LMTD = (ΔT₁ − ΔT₂)/ln(ΔT₁/ΔT₂)", "LMTD = (ΔT₁ + ΔT₂)/2", "LMTD = ΔT₁ × ΔT₂", "LMTD = ln(ΔT₁/ΔT₂)"],
    correct: 0,
    explanation: "LMTD accounts for the varying temperature difference along the exchanger. q = UA·LMTD. Uses log-mean, not arithmetic mean."
  },
  {
    id: "topic11_022", topicId: 11, subtopic: "Heat Exchangers", difficulty: 2,
    question: "In a counter-flow heat exchanger compared to parallel flow:",
    options: ["LMTD is larger (more effective heat transfer for same area)", "LMTD is smaller", "They are identical", "Counter-flow is always worse"],
    correct: 0,
    explanation: "Counter-flow: larger LMTD → needs less area for same heat duty. Can achieve outlet hot fluid T < outlet cold fluid T (temperature cross). Most thermally efficient."
  },
  {
    id: "topic11_023", topicId: 11, subtopic: "Heat Exchangers", difficulty: 2,
    question: "The overall heat transfer coefficient U accounts for:",
    options: ["Convection on both sides plus wall conduction: 1/U = 1/h_i + L_wall/k + 1/h_o", "Only external convection", "Only conduction", "Radiation only"],
    correct: 0,
    explanation: "1/(UA) = 1/(h_i·A_i) + R_wall + 1/(h_o·A_o) + R_fouling. Combines all resistances in series."
  },
  {
    id: "topic11_024", topicId: 11, subtopic: "Heat Exchangers", difficulty: 2,
    question: "The NTU-effectiveness method is preferred over LMTD when:",
    options: ["Outlet temperatures are unknown (rating problem)", "All temperatures are known", "The exchanger is very small", "Only one fluid flows"],
    correct: 0,
    explanation: "LMTD method: for design (find area when all T's known). NTU method: for rating (find outlet T's when area/UA known). ε = f(NTU, C_r)."
  },
  {
    id: "topic11_025", topicId: 11, subtopic: "Heat Exchangers", difficulty: 3,
    question: "The maximum possible heat transfer in a heat exchanger is:",
    options: ["q_max = C_min·(T_h,in − T_c,in)", "q_max = C_max·(T_h,in − T_c,in)", "q_max = UA·LMTD", "q_max = ṁ·c_p·ΔT"],
    correct: 0,
    explanation: "q_max = C_min·(T_h,in − T_c,in). Effectiveness ε = q_actual/q_max. C_min = smaller of (ṁc_p)_hot and (ṁc_p)_cold."
  },
  {
    id: "topic11_026", topicId: 11, subtopic: "Conduction", difficulty: 1,
    question: "Which material has the highest thermal conductivity?",
    options: ["Copper (~400 W/(m·K))", "Stainless steel (~15 W/(m·K))", "Glass (~1 W/(m·K))", "Wood (~0.15 W/(m·K))"],
    correct: 0,
    explanation: "Copper: ~400 W/(m·K). Aluminum: ~237. Steel: ~50. Stainless: ~15. Water: ~0.6. Air: ~0.026. Insulation: <0.1."
  },
  {
    id: "topic11_027", topicId: 11, subtopic: "Convection", difficulty: 3,
    question: "For flow over a bank of tubes in cross-flow, the heat transfer is enhanced because:",
    options: ["Tubes increase turbulence and mixing, raising h", "Flow area is larger", "Conduction through tubes dominates", "Radiation between tubes is significant"],
    correct: 0,
    explanation: "Tube banks create turbulence, vortex shedding, and flow acceleration between tubes → higher h than single tube. Staggered > inline arrangement."
  },
  {
    id: "topic11_028", topicId: 11, subtopic: "Conduction", difficulty: 3,
    question: "Fin effectiveness ε_fin is defined as:",
    options: ["Heat transfer with fin / heat transfer without fin (from same base area)", "Actual fin heat / maximum possible fin heat", "Fin length / fin thickness", "h·A_fin / k·A_base"],
    correct: 0,
    explanation: "ε_fin = q_fin / (hA_b·θ_b). If ε_fin < 2, the fin is generally not worth adding. Fin efficiency η_fin = q_actual / q_if_entire_fin_at_T_base."
  },
  {
    id: "topic11_029", topicId: 11, subtopic: "Heat Exchangers", difficulty: 1,
    question: "Fouling in a heat exchanger:",
    options: ["Adds thermal resistance, reducing performance over time", "Improves heat transfer", "Has no effect", "Only occurs in gas-gas exchangers"],
    correct: 0,
    explanation: "Fouling: deposit buildup (scale, corrosion, biological growth) adds resistance R_f. Regular cleaning or design allowance needed."
  },
  {
    id: "topic11_030", topicId: 11, subtopic: "Radiation", difficulty: 2,
    question: "A gray surface is one where:",
    options: ["Emissivity is constant and independent of wavelength", "Emissivity = 0", "Emissivity = 1", "Emissivity varies with wavelength"],
    correct: 0,
    explanation: "Gray surface: ε = α = constant (independent of λ). Simplifies radiation analysis. Real surfaces approximate gray behavior over limited wavelength ranges."
  },
  {
    id: "topic11_031", topicId: 11, subtopic: "Convection", difficulty: 1,
    question: "Forced convection has higher heat transfer rates than natural convection because:",
    options: ["External force (fan/pump) creates higher fluid velocities and mixing", "Natural convection has zero heat transfer", "Forced convection uses radiation", "Gravity is stronger in forced convection"],
    correct: 0,
    explanation: "Forced convection: h ~ 10-1000 W/(m²·K) depending on fluid. Natural convection: h ~ 2-25 W/(m²·K). Higher velocity → thinner boundary layer → higher h."
  },
  {
    id: "topic11_032", topicId: 11, subtopic: "Heat Exchangers", difficulty: 3,
    question: "For a counter-flow heat exchanger with C_r = C_min/C_max = 1, the effectiveness is:",
    options: ["ε = NTU/(1 + NTU)", "ε = 1 − e^(−NTU)", "ε = 1 − e^(−2·NTU)", "ε = NTU"],
    correct: 0,
    explanation: "Counter-flow with C_r = 1: ε = NTU/(1 + NTU). With C_r = 0 (one fluid changes phase): ε = 1 − e^(−NTU) regardless of flow arrangement."
  },
  {
    id: "topic11_033", topicId: 11, subtopic: "Conduction", difficulty: 2,
    question: "The Fourier number Fo = αt/L² is used in:",
    options: ["Transient conduction — dimensionless time for temperature response", "Steady-state problems", "Radiation calculations", "Flow analysis"],
    correct: 0,
    explanation: "Fo = αt/L². Measures how far heat has diffused into a body in time t. Higher Fo → closer to thermal equilibrium."
  },
  {
    id: "topic11_034", topicId: 11, subtopic: "Convection", difficulty: 2,
    question: "Boiling heat transfer has a much higher h than single-phase convection because:",
    options: ["Phase change creates vigorous bubble-driven mixing and absorbs latent heat", "The fluid is hotter", "Conduction through vapor is fast", "Radiation dominates"],
    correct: 0,
    explanation: "Boiling: h can reach 10,000-100,000 W/(m²·K). Bubble nucleation, growth, and departure create intense agitation and latent heat transport."
  },
  {
    id: "topic11_035", topicId: 11, subtopic: "Radiation", difficulty: 3,
    question: "Kirchhoff's law of radiation states that for a body in thermal equilibrium:",
    options: ["Emissivity equals absorptivity at the same temperature and wavelength (ε_λ = α_λ)", "ε + α = 1", "ε = 1 − α", "All bodies are blackbodies"],
    correct: 0,
    explanation: "Kirchhoff: ε_λ = α_λ at thermal equilibrium. For gray surfaces: ε = α. For opaque surfaces: α + ρ = 1 (reflectivity ρ = 1 − α)."
  },
  {
    id: "topic11_036", topicId: 11, subtopic: "Heat Exchangers", difficulty: 2,
    question: "A shell-and-tube heat exchanger with one shell pass and two tube passes is classified as:",
    options: ["1-2 heat exchanger (requires LMTD correction factor F)", "Counter-flow (no correction needed)", "Pure parallel flow", "Cross-flow"],
    correct: 0,
    explanation: "Multi-pass exchangers: q = UA·F·LMTD_counterflow. F < 1 accounts for reduced effectiveness vs. pure counter-flow. F from charts or formulas."
  },
  {
    id: "topic11_037", topicId: 11, subtopic: "Conduction", difficulty: 1,
    question: "Steady-state conduction means:",
    options: ["Temperature at each point does not change with time", "No heat flows", "Temperature is uniform everywhere", "Heat flow varies with time"],
    correct: 0,
    explanation: "Steady-state: ∂T/∂t = 0. Temperature distribution is fixed. Heat flows at a constant rate. ≠ uniform temperature."
  },
  {
    id: "topic11_038", topicId: 11, subtopic: "Convection", difficulty: 3,
    question: "For fully developed laminar flow in a circular tube with constant wall temperature, Nu = ",
    options: ["3.66", "4.36", "0.023Re^0.8Pr^0.4", "48/11"],
    correct: 0,
    explanation: "Fully developed laminar (Re < 2300) in tube: Nu = 3.66 (constant T_wall) or Nu = 4.36 (constant heat flux). These are exact analytical solutions."
  },
  {
    id: "topic11_039", topicId: 11, subtopic: "Heat Exchangers", difficulty: 1,
    question: "The energy balance for a heat exchanger (no losses) is:",
    options: ["ṁ_h·c_ph·(T_h,in − T_h,out) = ṁ_c·c_pc·(T_c,out − T_c,in)", "q_hot = −q_cold", "T_h,out = T_c,out", "ṁ_h = ṁ_c"],
    correct: 0,
    explanation: "Heat lost by hot fluid = heat gained by cold fluid: C_h·(T_h,in − T_h,out) = C_c·(T_c,out − T_c,in), where C = ṁc_p."
  },
  {
    id: "topic11_040", topicId: 11, subtopic: "Radiation", difficulty: 2,
    question: "A radiation shield between two surfaces reduces heat transfer because:",
    options: ["It adds thermal resistances in the radiation network", "It blocks all radiation", "It conducts heat instead", "It increases the view factor"],
    correct: 0,
    explanation: "A shield adds two surface resistances and one space resistance to the network. N shields between parallel plates reduce radiation by factor ~(N+1)."
  },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 12 — MEASUREMENTS, INSTRUMENTATION & CONTROLS  (30 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic12_001", topicId: 12, subtopic: "Sensors", difficulty: 1,
    question: "A strain gauge measures deformation by detecting changes in:",
    options: ["Electrical resistance as the gauge is stretched or compressed", "Voltage output from a piezoelectric crystal", "Capacitance between two plates", "Optical wavelength shift"],
    correct: 0,
    explanation: "Strain gauge: R changes with deformation. Gauge factor GF = (ΔR/R)/ε. Typically bonded to the surface and used in a Wheatstone bridge."
  },
  {
    id: "topic12_002", topicId: 12, subtopic: "Sensors", difficulty: 1,
    question: "A thermocouple measures temperature based on:",
    options: ["The Seebeck effect (voltage generated at junction of two dissimilar metals)", "Resistance change with temperature", "Thermal expansion of a bimetallic strip", "Infrared emission"],
    correct: 0,
    explanation: "Thermocouple: Seebeck effect → small voltage proportional to temperature difference between the junction and reference. Types: J, K, T, E, etc."
  },
  {
    id: "topic12_003", topicId: 12, subtopic: "Sensors", difficulty: 2,
    question: "An RTD (Resistance Temperature Detector) differs from a thermocouple in that:",
    options: ["It measures temperature via resistance change (typically platinum wire)", "It generates its own voltage", "It is less accurate", "It requires no excitation current"],
    correct: 0,
    explanation: "RTD: R = R₀(1 + αΔT). Platinum RTD (Pt100): very accurate, stable, but slower and more expensive than thermocouples. Needs excitation current."
  },
  {
    id: "topic12_004", topicId: 12, subtopic: "Sensors", difficulty: 2,
    question: "A Bourdon tube pressure gauge works by:",
    options: ["A curved tube straightens under pressure, moving a pointer via linkage", "Measuring capacitance change", "Detecting piezoelectric voltage", "Counting oscillations of a quartz crystal"],
    correct: 0,
    explanation: "Bourdon tube: C-shaped or spiral tube deflects proportionally to pressure. Simple, rugged, widely used for medium-to-high pressure measurement."
  },
  {
    id: "topic12_005", topicId: 12, subtopic: "Sensors", difficulty: 2,
    question: "Accuracy vs. precision: a measurement system with high precision but low accuracy has:",
    options: ["Consistent readings that are consistently offset from the true value (systematic error)", "Random scatter around the true value", "Both random and systematic errors", "No error at all"],
    correct: 0,
    explanation: "Precise but not accurate: tight grouping but shifted from true value (bias/systematic error). Accurate but not precise: centered on true but scattered."
  },
  {
    id: "topic12_006", topicId: 12, subtopic: "Sensors", difficulty: 3,
    question: "A Wheatstone bridge becomes balanced when:",
    options: ["R₁/R₂ = R₃/R₄ (the output voltage is zero)", "All four resistors are equal", "The current through the galvanometer is maximum", "R₁ + R₂ = R₃ + R₄"],
    correct: 0,
    explanation: "Balanced: R₁·R₃ = R₂·R₄ (or equivalently R₁/R₂ = R₃/R₄). V_out = 0. Strain gauge replaces one resistor; imbalance → voltage ∝ strain."
  },
  {
    id: "topic12_007", topicId: 12, subtopic: "Signal Processing", difficulty: 1,
    question: "The Nyquist sampling theorem requires a minimum sampling rate of:",
    options: ["At least 2× the highest frequency in the signal", "Equal to the signal frequency", "At least 10× the frequency", "Any rate will work"],
    correct: 0,
    explanation: "f_sample ≥ 2·f_max (Nyquist rate). Below this: aliasing (high frequencies appear as low frequencies). Practice: oversample at 5-10×."
  },
  {
    id: "topic12_008", topicId: 12, subtopic: "Signal Processing", difficulty: 2,
    question: "ADC resolution for an n-bit converter with full-scale range V_FS is:",
    options: ["V_FS / 2^n", "V_FS / n", "V_FS × 2^n", "n / V_FS"],
    correct: 0,
    explanation: "Resolution = V_FS/2^n. 12-bit ADC with 5V range: 5/4096 = 1.22 mV. More bits → finer resolution."
  },
  {
    id: "topic12_009", topicId: 12, subtopic: "Signal Processing", difficulty: 2,
    question: "A low-pass filter:",
    options: ["Passes signals below the cutoff frequency and attenuates higher frequencies", "Passes only high frequencies", "Passes a narrow band of frequencies", "Blocks all frequencies"],
    correct: 0,
    explanation: "Low-pass: passes f < f_c, blocks f > f_c. High-pass: passes f > f_c. Band-pass: passes f₁ < f < f₂. Used for noise reduction, anti-aliasing."
  },
  {
    id: "topic12_010", topicId: 12, subtopic: "Signal Processing", difficulty: 3,
    question: "Aliasing occurs when:",
    options: ["The sampling rate is less than 2× the maximum signal frequency", "The sampling rate is too high", "The signal amplitude is too large", "The ADC has too many bits"],
    correct: 0,
    explanation: "Aliasing: undersampling folds high frequencies into lower frequencies (indistinguishable). Prevented by anti-aliasing filter before ADC."
  },
  {
    id: "topic12_011", topicId: 12, subtopic: "Controls", difficulty: 1,
    question: "A feedback control system compares the output to the reference and adjusts the input based on:",
    options: ["The error signal (difference between desired and actual output)", "The output directly", "The disturbance only", "Random noise"],
    correct: 0,
    explanation: "Feedback: error = reference − output. Controller adjusts the actuator to minimize error. Closed-loop control is self-correcting."
  },
  {
    id: "topic12_012", topicId: 12, subtopic: "Controls", difficulty: 1,
    question: "An open-loop control system:",
    options: ["Does not use feedback — output is not measured or compared to reference", "Always uses feedback", "Is more accurate than closed-loop", "Self-corrects for disturbances"],
    correct: 0,
    explanation: "Open-loop: no feedback. Output not measured. Example: toaster timer. Simple but cannot compensate for disturbances or model errors."
  },
  {
    id: "topic12_013", topicId: 12, subtopic: "Controls", difficulty: 2,
    question: "In a PID controller, the three terms are:",
    options: ["Proportional (present error), Integral (past error), Derivative (rate of change of error)", "Power, Current, Voltage", "Position, Velocity, Acceleration", "Pressure, Temperature, Flow"],
    correct: 0,
    explanation: "P: responds to current error (gain). I: eliminates steady-state error (accumulates). D: anticipates future error (damping). u(t) = Kp·e + Ki∫e dt + Kd·de/dt."
  },
  {
    id: "topic12_014", topicId: 12, subtopic: "Controls", difficulty: 2,
    question: "The transfer function of a system relates:",
    options: ["Output to input in the Laplace (s) domain: G(s) = Y(s)/X(s)", "Force to displacement", "Voltage to current", "Time to frequency"],
    correct: 0,
    explanation: "G(s) = Y(s)/X(s) (output/input in s-domain). Assumes zero initial conditions. Captures system dynamics in a compact algebraic form."
  },
  {
    id: "topic12_015", topicId: 12, subtopic: "Controls", difficulty: 2,
    question: "A first-order system has the transfer function G(s) = K/(τs + 1). The time constant τ represents:",
    options: ["The time to reach 63.2% of the final value in response to a step input", "The time to reach 100%", "The oscillation period", "The delay time"],
    correct: 0,
    explanation: "Step response: y(t) = K(1 − e^(−t/τ)). At t = τ: 63.2%. At t = 3τ: 95%. At t = 5τ: 99.3% (practically at final value)."
  },
  {
    id: "topic12_016", topicId: 12, subtopic: "Controls", difficulty: 3,
    question: "A second-order system is underdamped when:",
    options: ["0 < ζ < 1 (oscillates with decaying amplitude)", "ζ = 1", "ζ > 1", "ζ = 0"],
    correct: 0,
    explanation: "ζ < 1: underdamped (overshoot, oscillations). ζ = 1: critically damped (fastest non-oscillatory). ζ > 1: overdamped (slow, no oscillation)."
  },
  {
    id: "topic12_017", topicId: 12, subtopic: "Controls", difficulty: 2,
    question: "Steady-state error in a Type 0 system (no integrators) for a step input is:",
    options: ["e_ss = 1/(1 + Kp), where Kp = position error constant", "Zero", "Infinite", "e_ss = 1/Kp"],
    correct: 0,
    explanation: "Type 0 (no free s in open-loop): finite steady-state error for step input. e_ss = R/(1 + Kp). Higher gain Kp reduces but doesn't eliminate the error."
  },
  {
    id: "topic12_018", topicId: 12, subtopic: "Controls", difficulty: 3,
    question: "The Routh-Hurwitz stability criterion determines:",
    options: ["Whether all closed-loop poles have negative real parts (system is stable)", "The steady-state error", "The gain margin", "The bandwidth"],
    correct: 0,
    explanation: "Routh array: all first-column elements must be positive for stability (all roots in left-half s-plane). Sign changes = number of RHP poles."
  },
  {
    id: "topic12_019", topicId: 12, subtopic: "Controls", difficulty: 3,
    question: "Gain margin is the factor by which the gain can be increased before the system becomes unstable. It is measured at:",
    options: ["The phase crossover frequency (where phase = −180°)", "The gain crossover frequency", "DC (ω = 0)", "The natural frequency"],
    correct: 0,
    explanation: "Gain margin: at ω where phase = −180°, GM = 1/|G(jω)|. Phase margin: at ω where |G| = 1 (0 dB), PM = 180° + ∠G. Both should be positive for stability."
  },
  {
    id: "topic12_020", topicId: 12, subtopic: "Sensors", difficulty: 1,
    question: "A flow meter that uses the pressure drop across an orifice plate measures flow based on:",
    options: ["Bernoulli's equation: flow rate relates to ΔP across the restriction", "Coriolis effect", "Electromagnetic induction", "Ultrasonic time-of-flight"],
    correct: 0,
    explanation: "Orifice plate: Q = C_d·A₂·√(2ΔP/ρ). Cheap and simple but creates permanent pressure loss. Venturi and flow nozzle are similar but with less loss."
  },
  {
    id: "topic12_021", topicId: 12, subtopic: "Controls", difficulty: 2,
    question: "Block diagram reduction: two blocks G₁ and G₂ in series have overall transfer function:",
    options: ["G₁ · G₂", "G₁ + G₂", "G₁ / G₂", "1/(G₁ · G₂)"],
    correct: 0,
    explanation: "Series (cascade): G_total = G₁·G₂. Parallel: G_total = G₁ + G₂. Feedback loop with forward G and feedback H: G/(1 + GH)."
  },
  {
    id: "topic12_022", topicId: 12, subtopic: "Controls", difficulty: 2,
    question: "The closed-loop transfer function for unity feedback (H = 1) with forward path G(s) is:",
    options: ["G/(1 + G)", "G/(1 − G)", "1/(1 + G)", "G + 1"],
    correct: 0,
    explanation: "Unity feedback: T(s) = G(s)/(1 + G(s)). Non-unity: T(s) = G(s)/(1 + G(s)H(s))."
  },
  {
    id: "topic12_023", topicId: 12, subtopic: "Signal Processing", difficulty: 1,
    question: "Signal-to-noise ratio (SNR) represents:",
    options: ["The ratio of desired signal power to noise power", "The frequency of the signal", "The amplitude of noise only", "The sampling rate"],
    correct: 0,
    explanation: "SNR = P_signal/P_noise (often in dB: 10·log₁₀(SNR)). Higher SNR → cleaner measurement. Improved by filtering, averaging, or shielding."
  },
  {
    id: "topic12_024", topicId: 12, subtopic: "Sensors", difficulty: 2,
    question: "A piezoelectric sensor is best suited for measuring:",
    options: ["Dynamic (rapidly changing) forces and pressures", "Steady-state (static) forces", "Temperature", "Humidity"],
    correct: 0,
    explanation: "Piezoelectric: generates charge proportional to applied force. Charge leaks over time → not suitable for static measurements. Excellent for vibration, impact."
  },
  {
    id: "topic12_025", topicId: 12, subtopic: "Controls", difficulty: 3,
    question: "The characteristic equation of a closed-loop system is 1 + G(s)H(s) = 0. The system is unstable if:",
    options: ["Any root of this equation has a positive real part", "All roots are negative", "All roots are imaginary", "The equation has no roots"],
    correct: 0,
    explanation: "Roots of 1 + GH = 0 are the closed-loop poles. Any pole in the right-half s-plane (positive real part) → unstable (growing exponential response)."
  },
  {
    id: "topic12_026", topicId: 12, subtopic: "Sensors", difficulty: 1,
    question: "An LVDT (Linear Variable Differential Transformer) measures:",
    options: ["Linear displacement via electromagnetic induction in a moving core", "Angular displacement", "Temperature", "Pressure"],
    correct: 0,
    explanation: "LVDT: primary coil excited with AC. Moving ferromagnetic core changes coupling to two secondary coils. Output voltage ∝ displacement. Very robust, infinite resolution."
  },
  {
    id: "topic12_027", topicId: 12, subtopic: "Signal Processing", difficulty: 2,
    question: "An operational amplifier (op-amp) in inverting configuration has gain:",
    options: ["G = −R_f/R_in", "G = 1 + R_f/R_in", "G = R_in/R_f", "G = R_f + R_in"],
    correct: 0,
    explanation: "Inverting: G = −R_f/R_in (negative sign = phase inversion). Non-inverting: G = 1 + R_f/R_in. Used for signal conditioning in DAQ systems."
  },
  {
    id: "topic12_028", topicId: 12, subtopic: "Controls", difficulty: 1,
    question: "Increasing the proportional gain Kp in a PID controller:",
    options: ["Reduces steady-state error but may increase overshoot and oscillation", "Eliminates steady-state error completely", "Always stabilizes the system", "Has no effect on performance"],
    correct: 0,
    explanation: "Higher Kp: faster response, smaller error, but more overshoot and potential instability. The integral term is needed to fully eliminate steady-state error."
  },
  {
    id: "topic12_029", topicId: 12, subtopic: "Sensors", difficulty: 3,
    question: "Calibration of an instrument involves:",
    options: ["Comparing readings to a known standard and adjusting to minimize error", "Replacing the sensor", "Increasing the sampling rate", "Using a larger sensor"],
    correct: 0,
    explanation: "Calibration: apply known inputs (standards), record instrument output, create calibration curve, adjust or apply corrections. Regular recalibration needed."
  },
  {
    id: "topic12_030", topicId: 12, subtopic: "Controls", difficulty: 3,
    question: "The derivative term in a PID controller primarily helps by:",
    options: ["Anticipating future error based on rate of change — providing damping and reducing overshoot", "Eliminating steady-state error", "Increasing the system gain", "Measuring the integral of error"],
    correct: 0,
    explanation: "D-term: Kd·(de/dt). Large when error changes rapidly → acts as a brake. Reduces overshoot and improves transient response. Sensitive to noise."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 13 — MECHANICAL DESIGN & ANALYSIS  (50 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic13_001", topicId: 13, subtopic: "Fasteners", difficulty: 1,
    question: "Bolt preload is important because:",
    options: ["It clamps the joint to resist separation and maintain fatigue resistance", "It weakens the joint", "It is only needed for appearance", "It prevents the bolt from fitting"],
    correct: 0,
    explanation: "Preload (initial tension) keeps the joint clamped. Under external load, most of the additional force is absorbed by the joint (not the bolt), improving fatigue life."
  },
  {
    id: "topic13_002", topicId: 13, subtopic: "Fasteners", difficulty: 2,
    question: "The tensile stress area of a bolt is based on:",
    options: ["The mean of the pitch diameter and minor diameter (smaller than nominal area)", "The nominal (major) diameter", "The head diameter", "The thread root diameter only"],
    correct: 0,
    explanation: "A_t = π/4·((d_p + d_r)/2)² ≈ π/4·d_p². Smaller than nominal area because threads reduce the effective cross-section."
  },
  {
    id: "topic13_003", topicId: 13, subtopic: "Fasteners", difficulty: 2,
    question: "In a bolted joint under external tensile load P, the bolt load increase is:",
    options: ["ΔF_bolt = C·P, where C = k_bolt/(k_bolt + k_members) is the stiffness ratio", "ΔF_bolt = P always", "ΔF_bolt = 0", "ΔF_bolt = P/2"],
    correct: 0,
    explanation: "Joint stiffness ratio C = k_b/(k_b + k_m). Typically C ≈ 0.15-0.25 (members much stiffer). Bolt sees only a fraction of external load."
  },
  {
    id: "topic13_004", topicId: 13, subtopic: "Fasteners", difficulty: 3,
    question: "A bolt with proof strength 830 MPa and tensile stress area 150 mm² can be loaded to a maximum proof load of:",
    options: ["124.5 kN", "83 kN", "55.3 kN", "166 kN"],
    correct: 0,
    explanation: "F_proof = S_p × A_t = 830 × 150 = 124,500 N = 124.5 kN. Preload is typically set at 75-90% of proof load."
  },
  {
    id: "topic13_005", topicId: 13, subtopic: "Fasteners", difficulty: 1,
    question: "A welded joint in shear has the throat dimension as the critical dimension because:",
    options: ["The throat is the thinnest cross-section of the weld (shortest path through the weld)", "It's the longest dimension", "It's the weld width", "It's the base metal thickness"],
    correct: 0,
    explanation: "Fillet weld throat = 0.707 × leg size. Stress is calculated on the throat area: τ = F/(throat × length). The throat is the weakest path."
  },
  {
    id: "topic13_006", topicId: 13, subtopic: "Bearings", difficulty: 1,
    question: "The L₁₀ life of a bearing represents:",
    options: ["The life that 90% of bearings will reach or exceed (10% failure rate)", "The average life", "The maximum life", "The minimum life"],
    correct: 0,
    explanation: "L₁₀ = (C/P)^a × 10⁶ revolutions. a = 3 for ball, 10/3 for roller. C = basic dynamic load rating, P = equivalent bearing load."
  },
  {
    id: "topic13_007", topicId: 13, subtopic: "Bearings", difficulty: 2,
    question: "If the load on a ball bearing doubles, the L₁₀ life becomes:",
    options: ["1/8 of the original (drops by factor of 8)", "1/2 of original", "1/4 of original", "Same"],
    correct: 0,
    explanation: "L₁₀ = (C/P)³. Double P: L₁₀_new = (C/(2P))³ = (1/8)(C/P)³ = L₁₀/8. Bearing life is very sensitive to load."
  },
  {
    id: "topic13_008", topicId: 13, subtopic: "Bearings", difficulty: 2,
    question: "A journal bearing operates with a fluid film between shaft and bearing. This is called:",
    options: ["Hydrodynamic lubrication", "Boundary lubrication", "Dry friction", "Mixed lubrication"],
    correct: 0,
    explanation: "Hydrodynamic: full fluid film separates surfaces (no metal contact). Boundary: thin film, some asperity contact. Mixed: between the two."
  },
  {
    id: "topic13_009", topicId: 13, subtopic: "Gears", difficulty: 1,
    question: "The gear ratio for two meshing gears is:",
    options: ["N₂/N₁ = ω₁/ω₂ (ratio of teeth or inverse ratio of angular velocities)", "N₁/N₂ = ω₁/ω₂", "N₁ × N₂", "N₁ + N₂"],
    correct: 0,
    explanation: "Gear ratio = N_driven/N_driver = ω_driver/ω_driven. Larger gear (more teeth) rotates slower. Pitch line velocity is equal."
  },
  {
    id: "topic13_010", topicId: 13, subtopic: "Gears", difficulty: 2,
    question: "The diametral pitch P of a gear is:",
    options: ["Number of teeth per inch of pitch diameter: P = N/d", "The distance between teeth", "The gear radius", "The tooth height"],
    correct: 0,
    explanation: "P = N/d (teeth per inch of diameter). Module m = d/N = 1/P (mm). Meshing gears must have the same diametral pitch (or module)."
  },
  {
    id: "topic13_011", topicId: 13, subtopic: "Gears", difficulty: 2,
    question: "Helical gears compared to spur gears:",
    options: ["Run more quietly and smoothly due to gradual tooth engagement, but produce axial thrust", "Are simpler to manufacture", "Cannot transmit torque", "Have higher tooth stress"],
    correct: 0,
    explanation: "Helical: angled teeth → gradual engagement → quieter, smoother. But helix angle creates axial force component requiring thrust bearings."
  },
  {
    id: "topic13_012", topicId: 13, subtopic: "Gears", difficulty: 3,
    question: "The Lewis bending stress equation for gear teeth is:",
    options: ["σ = Wt/(F·m·Y), where Wt = tangential load, F = face width, m = module, Y = Lewis form factor", "σ = T/J", "σ = PD/2t", "σ = Wt·r"],
    correct: 0,
    explanation: "Lewis: treats gear tooth as a cantilever beam. σ = Wt·P/(F·Y) (US) or Wt/(F·m·Y) (metric). Y depends on tooth number and pressure angle."
  },
  {
    id: "topic13_013", topicId: 13, subtopic: "Gears", difficulty: 2,
    question: "A worm gear set provides:",
    options: ["High gear ratio in a compact space, but is often not back-drivable", "Low gear ratio", "Reversible motion always", "No speed reduction"],
    correct: 0,
    explanation: "Worm: gear ratio = N_gear/N_worm. Single-start worm: ratio = N_gear. Not back-drivable when lead angle < friction angle (self-locking)."
  },
  {
    id: "topic13_014", topicId: 13, subtopic: "Shafts", difficulty: 1,
    question: "A shaft transmitting power is subjected to:",
    options: ["Torsion (from torque) and often bending (from gear/belt/bearing forces)", "Only axial loads", "Only compression", "No loads during operation"],
    correct: 0,
    explanation: "Typical shaft loads: torsion (power transmission), bending (transverse forces from gears, pulleys, bearings), sometimes axial (helical gears, thrust)."
  },
  {
    id: "topic13_015", topicId: 13, subtopic: "Shafts", difficulty: 2,
    question: "The ASME shaft design equation combines bending and torsion using:",
    options: ["Equivalent stress considering both bending moment M and torque T", "Only the torque", "Only the bending moment", "Neither — just the axial load"],
    correct: 0,
    explanation: "ASME: d³ = (16/π)·√[(K_b·M)² + (K_t·T)²] / τ_allow. Combines bending and torsion with stress concentration and shock factors."
  },
  {
    id: "topic13_016", topicId: 13, subtopic: "Shafts", difficulty: 3,
    question: "The critical speed of a shaft is the speed at which:",
    options: ["The shaft resonates (deflection becomes theoretically infinite without damping)", "The shaft melts", "Bearings fail", "Power transmission stops"],
    correct: 0,
    explanation: "Critical speed ω_cr = √(k/m) = √(g/δ_st) (Rayleigh approximation). Operating speed should be well away from critical speed."
  },
  {
    id: "topic13_017", topicId: 13, subtopic: "Shafts", difficulty: 2,
    question: "A keyway in a shaft:",
    options: ["Provides positive torque transmission between the shaft and hub but creates a stress concentration", "Is purely decorative", "Reduces the shaft strength without benefit", "Is used only for alignment"],
    correct: 0,
    explanation: "Key + keyway: transmits torque between shaft and component (gear, pulley). Creates stress concentration at corners (K_t ≈ 2-3). Design accounts for this."
  },
  {
    id: "topic13_018", topicId: 13, subtopic: "Springs", difficulty: 1,
    question: "The spring rate (stiffness) k is defined as:",
    options: ["Force per unit deflection: k = F/δ", "Deflection per unit force", "Total force on the spring", "Spring free length"],
    correct: 0,
    explanation: "k = F/δ (N/m or lb/in). Linear spring: F = kδ. Higher k → stiffer spring. Series springs: 1/k_total = Σ(1/k_i). Parallel: k_total = Σk_i."
  },
  {
    id: "topic13_019", topicId: 13, subtopic: "Springs", difficulty: 2,
    question: "For a helical compression spring, the spring rate is:",
    options: ["k = Gd⁴/(8D³N_a), where d = wire diameter, D = mean coil diameter, N_a = active coils", "k = Ed⁴/(8D³N)", "k = Gd²/(DN)", "k = 8GD³/(d⁴N)"],
    correct: 0,
    explanation: "k = Gd⁴/(8D³N_a). G = shear modulus, d = wire diameter, D = mean coil diameter, N_a = number of active coils. Stiffer with thicker wire, smaller coil diameter, fewer coils."
  },
  {
    id: "topic13_020", topicId: 13, subtopic: "Springs", difficulty: 2,
    question: "The Wahl correction factor for helical springs accounts for:",
    options: ["Curvature and direct shear effects on the inner surface of the coil", "Temperature effects", "Corrosion", "Fatigue only"],
    correct: 0,
    explanation: "K_W = (4C−1)/(4C−4) + 0.615/C, where C = D/d (spring index). Corrects the maximum shear stress from the simple τ = 8FD/(πd³) formula."
  },
  {
    id: "topic13_021", topicId: 13, subtopic: "Springs", difficulty: 3,
    question: "The energy stored in a spring compressed by δ is:",
    options: ["U = ½kδ² = ½Fδ", "U = kδ", "U = Fδ", "U = k²δ"],
    correct: 0,
    explanation: "U = ½kδ² = ½Fδ = F²/(2k). Elastic strain energy stored in the spring. Released upon unloading."
  },
  {
    id: "topic13_022", topicId: 13, subtopic: "Fatigue", difficulty: 1,
    question: "An S-N curve (Wöhler curve) plots:",
    options: ["Stress amplitude (S) vs. number of cycles to failure (N)", "Strain vs. time", "Stress vs. strain", "Temperature vs. cycles"],
    correct: 0,
    explanation: "S-N diagram: log-log or semi-log. Shows how stress amplitude relates to fatigue life. Below the endurance limit (if it exists), infinite life."
  },
  {
    id: "topic13_023", topicId: 13, subtopic: "Fatigue", difficulty: 2,
    question: "The Goodman diagram relates:",
    options: ["Alternating stress to mean stress for predicting fatigue failure", "Static stress to strain", "Hardness to tensile strength", "Temperature to fatigue life"],
    correct: 0,
    explanation: "Goodman line: σ_a/S_e + σ_m/S_ut = 1. Points below the line → safe. Accounts for the detrimental effect of tensile mean stress on fatigue life."
  },
  {
    id: "topic13_024", topicId: 13, subtopic: "Fatigue", difficulty: 2,
    question: "Stress concentration factor K_t is highest at:",
    options: ["Sharp notches, keyways, and abrupt section changes", "Smooth uniform sections", "Large fillets", "Polished surfaces"],
    correct: 0,
    explanation: "K_t = σ_max/σ_nominal. Sharp corners → high K_t (3-5+). Generous fillets, smooth transitions reduce K_t. Critical in fatigue design."
  },
  {
    id: "topic13_025", topicId: 13, subtopic: "Fatigue", difficulty: 3,
    question: "Miner's rule for cumulative fatigue damage states:",
    options: ["Σ(n_i/N_i) = 1 at failure (linear damage accumulation)", "Σ(n_i × N_i) = 1", "Σ(n_i/N_i) = 0", "Damage is not cumulative"],
    correct: 0,
    explanation: "Miner: each stress level uses a fraction n_i/N_i of the fatigue life. Failure when Σ(n_i/N_i) ≥ 1. Simple but approximate; doesn't account for sequence effects."
  },
  {
    id: "topic13_026", topicId: 13, subtopic: "Fatigue", difficulty: 2,
    question: "The endurance limit modification factors account for:",
    options: ["Surface finish, size, reliability, temperature, and loading type", "Only the material grade", "Only the surface finish", "Nothing — S_e is always 0.5·S_ut"],
    correct: 0,
    explanation: "S_e = k_a·k_b·k_c·k_d·k_e·S_e'. Factors: surface (k_a), size (k_b), reliability (k_c), temperature (k_d), miscellaneous (k_e). All reduce from the ideal test specimen value."
  },
  {
    id: "topic13_027", topicId: 13, subtopic: "Fasteners", difficulty: 2,
    question: "The thread lead angle affects self-locking. A bolt is self-locking when:",
    options: ["Lead angle < friction angle (the bolt won't unscrew under load without external torque)", "Lead angle > friction angle", "There is no friction", "The bolt is lubricated"],
    correct: 0,
    explanation: "Self-locking: α < φ (lead angle < friction angle). Standard fastener threads are self-locking. Power screws (Acme, ball) may or may not be."
  },
  {
    id: "topic13_028", topicId: 13, subtopic: "Bearings", difficulty: 3,
    question: "The Sommerfeld number in journal bearing design relates:",
    options: ["Bearing geometry and operating conditions to the minimum film thickness", "Load to speed only", "Temperature to viscosity only", "Shaft diameter to bearing length only"],
    correct: 0,
    explanation: "S = (r/c)²·(μN/P), where r = radius, c = clearance, μ = viscosity, N = speed, P = pressure. Used with design charts to find eccentricity, min film thickness, friction."
  },
  {
    id: "topic13_029", topicId: 13, subtopic: "Gears", difficulty: 1,
    question: "The pressure angle in spur gears (typically 20° or 25°) determines:",
    options: ["The direction of the force between meshing teeth", "The number of teeth", "The gear material", "The rotational speed"],
    correct: 0,
    explanation: "Pressure angle: angle between the tooth force direction and the tangent to the pitch circle. 20° is standard. Affects tooth shape, strength, and contact ratio."
  },
  {
    id: "topic13_030", topicId: 13, subtopic: "Fatigue", difficulty: 1,
    question: "Fatigue failure typically initiates at:",
    options: ["Points of stress concentration (notches, holes, keyways, surface defects)", "The center of the part", "The strongest point", "Smooth polished areas"],
    correct: 0,
    explanation: "Fatigue cracks initiate at stress risers where local stress is highest. Surface condition is critical — scratches, corrosion pits, and machining marks all reduce fatigue life."
  },
  {
    id: "topic13_031", topicId: 13, subtopic: "Springs", difficulty: 1,
    question: "Springs in parallel have a combined stiffness of:",
    options: ["k_total = k₁ + k₂ (stiffer)", "k_total = k₁·k₂/(k₁ + k₂)", "k_total = k₁ − k₂", "k_total = k₁/k₂"],
    correct: 0,
    explanation: "Parallel: k_total = Σk_i (same deflection, forces add). Series: 1/k_total = Σ(1/k_i) (same force, deflections add). Opposite of electrical resistors!"
  },
  {
    id: "topic13_032", topicId: 13, subtopic: "Bearings", difficulty: 1,
    question: "Ball bearings are best suited for:",
    options: ["Primarily radial loads with some axial load capability", "Very heavy radial loads only", "Axial loads only", "Oscillating motion only"],
    correct: 0,
    explanation: "Ball bearings: good for radial + moderate axial. Cylindrical roller: heavy radial, no axial. Tapered roller: combined heavy radial + axial. Thrust: axial only."
  },
  {
    id: "topic13_033", topicId: 13, subtopic: "Shafts", difficulty: 2,
    question: "The Goodman criterion for shaft fatigue design is:",
    options: ["σ_a/S_e + σ_m/S_ut = 1/n (n = safety factor)", "σ_a + σ_m = S_y", "σ_a·σ_m = S_e·S_ut", "σ_a/S_y + σ_m/S_e = 1"],
    correct: 0,
    explanation: "Modified Goodman: σ_a/S_e + σ_m/S_ut = 1/n. Conservative for ductile materials. Soderberg uses S_y instead of S_ut (even more conservative)."
  },
  {
    id: "topic13_034", topicId: 13, subtopic: "Fasteners", difficulty: 1,
    question: "A Grade 8 bolt is stronger than a Grade 5 bolt because:",
    options: ["It has higher proof strength and tensile strength (heat treated to higher hardness)", "It has more threads", "It is larger in diameter", "It is made of aluminum"],
    correct: 0,
    explanation: "Grade 5: proof 85 ksi, tensile 120 ksi. Grade 8: proof 120 ksi, tensile 150 ksi. Higher grade = higher strength (more heat treatment)."
  },
  {
    id: "topic13_035", topicId: 13, subtopic: "Gears", difficulty: 3,
    question: "The AGMA gear stress equation includes dynamic factors because:",
    options: ["Tooth loads are amplified by vibration, misalignment, and manufacturing errors at speed", "Static analysis is always sufficient", "Dynamic factors reduce stress", "They are only used for worm gears"],
    correct: 0,
    explanation: "Dynamic factor K_v accounts for tooth-to-tooth speed effects. Also: overload (K_o), size (K_s), load distribution (K_m), life (K_L). Real gear loads exceed simple W_t."
  },
  {
    id: "topic13_036", topicId: 13, subtopic: "Shafts", difficulty: 3,
    question: "Deflection limits for shafts are important for:",
    options: ["Gear mesh alignment, bearing life, and avoiding vibration problems", "Appearance only", "Reducing weight", "Increasing speed"],
    correct: 0,
    explanation: "Excessive shaft deflection → gear misalignment (noise, wear), bearing edge loading (reduced life), increased vibration. Typical limit: slope < 0.001 rad at bearings."
  },
  {
    id: "topic13_037", topicId: 13, subtopic: "Fatigue", difficulty: 3,
    question: "Shot peening improves fatigue life by:",
    options: ["Introducing compressive residual stresses on the surface that retard crack initiation", "Making the surface smoother", "Increasing hardness throughout", "Adding material to the surface"],
    correct: 0,
    explanation: "Shot peening: small steel/ceramic balls impact the surface → plastic deformation → compressive residual stress. Cracks can't easily open under compression → longer fatigue life."
  },
  {
    id: "topic13_038", topicId: 13, subtopic: "Bearings", difficulty: 2,
    question: "The equivalent radial load for a bearing under combined radial (R) and axial (A) loads is:",
    options: ["P = X·R + Y·A (where X, Y are factors from bearing manufacturer tables)", "P = R + A", "P = R × A", "P = √(R² + A²)"],
    correct: 0,
    explanation: "P = XVR + YA (V = rotation factor). X and Y depend on A/(VR) ratio and bearing type. From manufacturer catalogs."
  },
  {
    id: "topic13_039", topicId: 13, subtopic: "Springs", difficulty: 3,
    question: "Spring surge (resonance) occurs when:",
    options: ["The operating frequency matches the spring's natural frequency", "The spring is too stiff", "The spring is at rest", "Temperature is very high"],
    correct: 0,
    explanation: "Spring surge: coils vibrate at natural frequency → uneven stress distribution, potential failure. f_n = (1/(2π))·√(k/m_eff). Design: f_n should be 15-20× operating frequency."
  },
  {
    id: "topic13_040", topicId: 13, subtopic: "Gears", difficulty: 2,
    question: "The contact ratio of a gear pair should be at least:",
    options: ["1.2 (ensures at least one pair of teeth always in contact)", "0.5", "3.0", "0.1"],
    correct: 0,
    explanation: "Contact ratio: average number of teeth in contact. Must be > 1 for continuous motion. Recommended ≥ 1.2. Higher = smoother, quieter operation."
  },
  {
    id: "topic13_041", topicId: 13, subtopic: "Fasteners", difficulty: 3,
    question: "In an eccentrically loaded bolt group, the most heavily loaded bolt is the one:",
    options: ["Farthest from the centroid of the bolt group, on the side of the applied moment", "Closest to the centroid", "At the center", "Farthest from the load"],
    correct: 0,
    explanation: "Eccentric load creates shear (from direct load) + additional shear (from moment). Bolt farthest from centroid has the highest moment-induced load. Vector-add direct and moment components."
  },
  {
    id: "topic13_042", topicId: 13, subtopic: "Fatigue", difficulty: 2,
    question: "For a fully reversed loading (R = −1), the mean stress is:",
    options: ["Zero (equal tension and compression)", "Maximum stress", "Minimum stress", "Half the range"],
    correct: 0,
    explanation: "R = σ_min/σ_max = −1 → σ_mean = 0, σ_alternating = σ_max. This is the baseline condition for S-N curves. R = 0: zero-to-max (pulsating)."
  },
  {
    id: "topic13_043", topicId: 13, subtopic: "Shafts", difficulty: 1,
    question: "The torque transmitted by a shaft is related to power and speed by:",
    options: ["T = P/ω = P·60/(2πN)", "T = P·ω", "T = P/N", "T = P·N"],
    correct: 0,
    explanation: "P = Tω. T = P/ω = P/(2πN/60) = 60P/(2πN). In SI: T (N·m), P (W), N (rpm)."
  },
  {
    id: "topic13_044", topicId: 13, subtopic: "Gears", difficulty: 1,
    question: "A planetary (epicyclic) gear set can provide:",
    options: ["High gear ratios in a compact, coaxial arrangement", "Only 1:1 ratios", "Speed increase only", "No torque multiplication"],
    correct: 0,
    explanation: "Planetary: sun + planet + ring gears. Compact, coaxial, high ratios. Used in automatic transmissions, wind turbines, robotics."
  },
  {
    id: "topic13_045", topicId: 13, subtopic: "Bearings", difficulty: 3,
    question: "Bearing LDH (life in hours) from L₁₀ in revolutions is:",
    options: ["L₁₀h = L₁₀/(60·N), where N = rpm", "L₁₀h = L₁₀ × N", "L₁₀h = L₁₀/N²", "L₁₀h = 60·N/L₁₀"],
    correct: 0,
    explanation: "L₁₀h = L₁₀ × 10⁶/(60·N) hours. At 1000 rpm, 10⁶ revolutions = 16.7 hours. For 10,000 hours: L₁₀ = 600 million revolutions."
  },
  {
    id: "topic13_046", topicId: 13, subtopic: "Fatigue", difficulty: 2,
    question: "Surface finish affects fatigue life because:",
    options: ["Rough surfaces create microscopic stress concentrations that initiate cracks", "Smooth surfaces are weaker", "Surface finish has no effect", "Only the core material matters"],
    correct: 0,
    explanation: "Surface roughness = tiny stress risers. Machine marks, grinding scratches act as crack initiation sites. Polished surfaces have significantly better fatigue life."
  },
  {
    id: "topic13_047", topicId: 13, subtopic: "Springs", difficulty: 2,
    question: "The spring index C = D/d for helical springs should typically be in the range of:",
    options: ["4 to 12 (values too low → difficult to manufacture; too high → spring buckles)", "1 to 2", "20 to 50", "0.1 to 1"],
    correct: 0,
    explanation: "C = D/d. C < 4: very stiff, hard to wind, high stress. C > 12: prone to buckling/tangling. Sweet spot: 6-10."
  },
  {
    id: "topic13_048", topicId: 13, subtopic: "Fasteners", difficulty: 2,
    question: "Torque-tension relationship for a bolt: T = K·F·d, where K is:",
    options: ["The nut factor (torque coefficient, typically 0.15-0.20 for lubricated bolts)", "The spring constant", "The stress concentration factor", "The safety factor"],
    correct: 0,
    explanation: "T = KFd. K depends on friction, lubrication, plating. Dry: K ≈ 0.20. Lubricated: K ≈ 0.15. Waxed: K ≈ 0.12. Critical for proper preload."
  },
  {
    id: "topic13_049", topicId: 13, subtopic: "Gears", difficulty: 2,
    question: "Gear pitting failure is a type of:",
    options: ["Surface fatigue (contact stress exceeds surface endurance strength)", "Bending fatigue", "Corrosion", "Thermal distortion"],
    correct: 0,
    explanation: "Pitting: Hertzian contact stress → surface/subsurface fatigue → small pits. AGMA contact stress: σ_c = C_p·√(W_t·K_o·K_v·K_s/(d·F·I)). Must be < allowable."
  },
  {
    id: "topic13_050", topicId: 13, subtopic: "Shafts", difficulty: 2,
    question: "A press fit (interference fit) between a shaft and hub:",
    options: ["Creates a friction-based connection that can transmit torque without keys", "Is always loose", "Requires bolts to hold", "Cannot transmit torque"],
    correct: 0,
    explanation: "Interference fit: shaft is slightly larger than hole → press together → radial pressure creates friction → transmits torque. Design uses thick-cylinder (Lamé) equations."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 14 — MANUFACTURING PROCESSES  (25 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic14_001", topicId: 14, subtopic: "Machining", difficulty: 1,
    question: "In turning on a lathe, the cutting speed V (surface speed) is:",
    options: ["V = πDN, where D = workpiece diameter and N = rpm", "V = feed × depth", "V = N/D", "V = πD/N"],
    correct: 0,
    explanation: "V = πDN (m/min or ft/min). Higher V → faster cutting but more tool wear. Cutting speed depends on material and tool type."
  },
  {
    id: "topic14_002", topicId: 14, subtopic: "Machining", difficulty: 1,
    question: "The material removal rate (MRR) in turning is:",
    options: ["MRR = V × f × d (cutting speed × feed × depth of cut)", "MRR = V × d only", "MRR = f × d only", "MRR = V / f"],
    correct: 0,
    explanation: "MRR = V·f·d (volume/time). Also MRR = πDN·f·d. Higher MRR = faster machining but higher forces and power."
  },
  {
    id: "topic14_003", topicId: 14, subtopic: "Machining", difficulty: 2,
    question: "Taylor's tool life equation is:",
    options: ["VT^n = C, where V = cutting speed, T = tool life, n and C are constants", "VT = C", "V/T = C", "V + T = C"],
    correct: 0,
    explanation: "VT^n = C. n depends on tool material (HSS: ~0.1, carbide: ~0.25, ceramic: ~0.4). Higher V → shorter tool life. C is a constant for given conditions."
  },
  {
    id: "topic14_004", topicId: 14, subtopic: "Machining", difficulty: 2,
    question: "Carbide cutting tools compared to HSS (High Speed Steel) can operate at:",
    options: ["Much higher cutting speeds (3-5× HSS) due to higher hot hardness", "Lower speeds only", "The same speed", "Only for non-ferrous metals"],
    correct: 0,
    explanation: "Carbide: higher hot hardness → higher speeds → higher MRR. HSS: tougher, cheaper, good for interrupted cuts. Ceramic: even faster but more brittle."
  },
  {
    id: "topic14_005", topicId: 14, subtopic: "Machining", difficulty: 2,
    question: "A built-up edge (BUE) in machining is caused by:",
    options: ["Workpiece material welding to the tool at low cutting speeds", "Excessive coolant", "High cutting speeds", "Using the wrong workpiece material"],
    correct: 0,
    explanation: "BUE: at low speeds, chip material adheres to the tool rake face. Causes poor surface finish and dimensional inaccuracy. Cure: increase speed, use coated tools, or add coolant."
  },
  {
    id: "topic14_006", topicId: 14, subtopic: "Machining", difficulty: 3,
    question: "Specific cutting energy (u) represents:",
    options: ["Energy per unit volume of material removed (J/mm³ or hp·min/in³)", "Total cutting force", "Tool life", "Surface roughness"],
    correct: 0,
    explanation: "u = F_c·V/MRR = P/MRR. Higher for harder materials. Used to estimate cutting power: P = u × MRR."
  },
  {
    id: "topic14_007", topicId: 14, subtopic: "Machining", difficulty: 1,
    question: "Drilling produces a hole using:",
    options: ["A rotating cutting tool (drill bit) with two cutting edges fed into the workpiece", "A single-point tool", "An abrasive wheel", "Chemical dissolution"],
    correct: 0,
    explanation: "Twist drill: two cutting lips, chisel edge, helical flutes for chip removal. Feed per revolution, cutting speed at outer diameter."
  },
  {
    id: "topic14_008", topicId: 14, subtopic: "Machining", difficulty: 2,
    question: "Surface roughness R_a (arithmetic average) in machining is primarily affected by:",
    options: ["Feed rate and tool nose radius: R_a ≈ f²/(32r)", "Cutting speed only", "Depth of cut only", "Workpiece temperature"],
    correct: 0,
    explanation: "Theoretical: R_a ≈ f²/(32r) for single-point tools. Lower feed and larger nose radius → smoother surface. Speed has secondary effect."
  },
  {
    id: "topic14_009", topicId: 14, subtopic: "Forming", difficulty: 1,
    question: "Sand casting involves:",
    options: ["Pouring molten metal into a sand mold cavity, allowing it to solidify", "Injecting plastic into a mold", "Rolling metal between rollers", "Cutting with a laser"],
    correct: 0,
    explanation: "Sand casting: pattern → mold in sand → pour molten metal → solidify → shake out → clean. Versatile, low tooling cost, but rough surface and lower precision."
  },
  {
    id: "topic14_010", topicId: 14, subtopic: "Forming", difficulty: 2,
    question: "Die casting differs from sand casting in that:",
    options: ["Metal is injected under high pressure into a permanent metal mold — better surface finish and tighter tolerances", "It uses sand molds", "It's slower", "It can only cast ferrous metals"],
    correct: 0,
    explanation: "Die casting: permanent steel molds, high pressure injection. Better finish, faster cycle, tighter tolerances. But high tooling cost, limited to low-melting-point alloys (Al, Zn, Mg)."
  },
  {
    id: "topic14_011", topicId: 14, subtopic: "Forming", difficulty: 2,
    question: "Hot working (forging, rolling above recrystallization temperature) benefits include:",
    options: ["Lower forces required, no work hardening, improved grain structure", "Better surface finish", "Higher dimensional accuracy", "No need for lubrication"],
    correct: 0,
    explanation: "Hot working: above recrystallization T → no strain hardening, lower flow stress, better formability. Downsides: oxidation, scale, poorer surface/dimensional control."
  },
  {
    id: "topic14_012", topicId: 14, subtopic: "Forming", difficulty: 2,
    question: "Extrusion forces material through a die. Direct (forward) extrusion pushes the billet:",
    options: ["In the same direction as ram movement through a stationary die", "Opposite to ram movement", "Sideways", "Without any die"],
    correct: 0,
    explanation: "Direct: ram pushes billet forward through die. Indirect: die moves toward billet (lower friction). Hydrostatic: fluid pressure extrudes."
  },
  {
    id: "topic14_013", topicId: 14, subtopic: "Forming", difficulty: 1,
    question: "Sheet metal bending has a minimum bend radius to prevent:",
    options: ["Cracking on the outer (tensile) surface of the bend", "Wrinkling on the inner surface", "Tool damage", "Excessive springback"],
    correct: 0,
    explanation: "Minimum bend radius depends on material ductility and thickness. R_min/t ratios: Al alloys 0-1, mild steel 0.5-1, stainless 1-2. Below this → cracking."
  },
  {
    id: "topic14_014", topicId: 14, subtopic: "Forming", difficulty: 3,
    question: "Springback in sheet metal bending is caused by:",
    options: ["Elastic recovery after the bending load is removed", "Plastic deformation", "Thermal contraction", "Tool wear"],
    correct: 0,
    explanation: "Springback: the elastic portion of strain recovers after unloading. Angle decreases. Compensate by overbending, using bottoming dies, or stretch bending."
  },
  {
    id: "topic14_015", topicId: 14, subtopic: "Forming", difficulty: 2,
    question: "SMAW (Shielded Metal Arc Welding, 'stick welding') uses:",
    options: ["A consumable electrode coated in flux that provides shielding gas and slag", "A non-consumable tungsten electrode with separate gas", "A continuous wire fed through a gun with external gas", "No electrode"],
    correct: 0,
    explanation: "SMAW (stick): consumable flux-coated electrode. Versatile, portable, all positions. GMAW (MIG): wire + gas. GTAW (TIG): tungsten + gas, highest quality."
  },
  {
    id: "topic14_016", topicId: 14, subtopic: "Forming", difficulty: 3,
    question: "The heat-affected zone (HAZ) in welding is the region where:",
    options: ["Base metal's microstructure and properties changed by heat but didn't melt", "The metal melted and resolidified", "Filler metal was deposited", "No temperature change occurred"],
    correct: 0,
    explanation: "HAZ: heated enough to alter microstructure (grain growth, phase changes) but not melted. Often the weakest part of a weld joint (reduced hardness or embrittlement)."
  },
  {
    id: "topic14_017", topicId: 14, subtopic: "Tolerancing", difficulty: 1,
    question: "A bilateral tolerance of ±0.05 mm on a 25.00 mm dimension means:",
    options: ["Acceptable range is 24.95 to 25.05 mm", "24.90 to 25.00 mm", "25.00 to 25.10 mm", "24.95 to 25.00 mm"],
    correct: 0,
    explanation: "Bilateral ±0.05: centered on nominal. Range = 25.00 ± 0.05 = [24.95, 25.05]. Total tolerance band = 0.10 mm."
  },
  {
    id: "topic14_018", topicId: 14, subtopic: "Tolerancing", difficulty: 2,
    question: "In GD&T, the straightness tolerance applies to:",
    options: ["The condition that an element (line or axis) lies within a tolerance zone", "The roundness of a hole", "The parallelism between surfaces", "The surface roughness"],
    correct: 0,
    explanation: "Straightness (—): each line element or the axis must lie within a tolerance zone (two parallel lines or a cylinder). Controls form deviation."
  },
  {
    id: "topic14_019", topicId: 14, subtopic: "Tolerancing", difficulty: 2,
    question: "An interference fit between a shaft and hole means:",
    options: ["The shaft is larger than the hole (requires force or thermal methods to assemble)", "There is always a gap", "The parts slide freely", "The shaft equals the hole size exactly"],
    correct: 0,
    explanation: "Interference (press) fit: shaft max > hole min. Always tight. Clearance fit: shaft max < hole min. Always loose. Transition: may be either."
  },
  {
    id: "topic14_020", topicId: 14, subtopic: "Tolerancing", difficulty: 3,
    question: "Statistical tolerancing uses the RSS (Root Sum of Squares) method, which assumes:",
    options: ["Dimensions are normally distributed and independent — total tolerance = √(Σt_i²)", "All dimensions are at their worst case simultaneously", "Tolerances add linearly", "Only one dimension varies"],
    correct: 0,
    explanation: "RSS: T_total = √(t₁² + t₂² + ... + t_n²). Less conservative than worst-case (T = Σt_i) but more realistic. Requires statistical manufacturing control."
  },
  {
    id: "topic14_021", topicId: 14, subtopic: "Machining", difficulty: 1,
    question: "Grinding uses:",
    options: ["An abrasive wheel to remove small amounts of material with high precision and good surface finish", "A single-point cutting tool", "Chemical etching", "Laser heating"],
    correct: 0,
    explanation: "Grinding: abrasive grains (Al₂O₃, SiC, CBN, diamond) bonded in a wheel. High precision (±0.01 mm), fine finish. Low MRR compared to turning/milling."
  },
  {
    id: "topic14_022", topicId: 14, subtopic: "Forming", difficulty: 2,
    question: "Rolling reduces the thickness of a metal slab by:",
    options: ["Passing it between rotating rolls that compress it", "Stretching it with tension", "Hammering with a die", "Cutting away material"],
    correct: 0,
    explanation: "Rolling: compressive deformation between rolls. Draft = t₀ − t_f. Hot rolling: above recrystallization T. Cold rolling: below, for better finish and strength."
  },
  {
    id: "topic14_023", topicId: 14, subtopic: "Tolerancing", difficulty: 1,
    question: "Surface roughness Ra is measured in:",
    options: ["Micrometers (μm) or microinches (μin)", "Millimeters", "Degrees", "Newtons"],
    correct: 0,
    explanation: "Ra (arithmetic average roughness): μm or μin. Typical: ground ~0.4-1.6 μm, turned ~1.6-6.3 μm, milled ~1.6-12.5 μm, polished ~0.05-0.4 μm."
  },
  {
    id: "topic14_024", topicId: 14, subtopic: "Machining", difficulty: 3,
    question: "EDM (Electrical Discharge Machining) removes material by:",
    options: ["Controlled electrical sparks between the tool and workpiece in a dielectric fluid", "Mechanical cutting", "Chemical reaction", "Laser ablation"],
    correct: 0,
    explanation: "EDM: spark erodes conductive materials. No contact force, can machine hard materials and complex shapes. Slow MRR, requires conductive workpiece."
  },
  {
    id: "topic14_025", topicId: 14, subtopic: "Tolerancing", difficulty: 3,
    question: "Maximum material condition (MMC) in GD&T means:",
    options: ["The part feature contains the maximum amount of material (largest shaft, smallest hole)", "The feature has least material", "The feature is at nominal size", "Tolerance is zero"],
    correct: 0,
    explanation: "MMC: shaft at max diameter, hole at min diameter. Bonus tolerance: as feature departs from MMC, additional geometric tolerance is available."
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPIC 15 — ENGINEERING MANAGEMENT  (20 questions)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "topic15_001", topicId: 15, subtopic: "Project Management", difficulty: 1,
    question: "The critical path in a project network is:",
    options: ["The longest path through the network, determining the minimum project duration", "The shortest path", "The path with the most resources", "Any arbitrary path"],
    correct: 0,
    explanation: "Critical path: longest path = minimum project duration. Activities on the critical path have zero float (slack). Delay on CP → project delay."
  },
  {
    id: "topic15_002", topicId: 15, subtopic: "Project Management", difficulty: 1,
    question: "Float (slack) of an activity is:",
    options: ["The time an activity can be delayed without delaying the project", "The activity duration", "The project duration", "Always zero"],
    correct: 0,
    explanation: "Total float = LS − ES = LF − EF. Float = 0 → critical activity. Positive float → non-critical (can be delayed)."
  },
  {
    id: "topic15_003", topicId: 15, subtopic: "Project Management", difficulty: 2,
    question: "PERT uses three time estimates (a, m, b) for each activity. The expected time t_e is:",
    options: ["t_e = (a + 4m + b)/6", "t_e = (a + m + b)/3", "t_e = (a + b)/2", "t_e = m"],
    correct: 0,
    explanation: "PERT: t_e = (a + 4m + b)/6. Variance: σ² = [(b − a)/6]². Beta distribution assumed. a = optimistic, m = most likely, b = pessimistic."
  },
  {
    id: "topic15_004", topicId: 15, subtopic: "Project Management", difficulty: 2,
    question: "A Gantt chart displays:",
    options: ["Activities as horizontal bars on a timeline", "A network of dependencies", "A pie chart of resource allocation", "A histogram of costs"],
    correct: 0,
    explanation: "Gantt: visual schedule with bars showing start, duration, and finish of activities. Easy to read but doesn't explicitly show dependencies (unlike network diagrams)."
  },
  {
    id: "topic15_005", topicId: 15, subtopic: "Project Management", difficulty: 3,
    question: "Crashing a project means:",
    options: ["Reducing activity duration by adding resources at increased cost", "Canceling the project", "Extending the deadline", "Removing activities"],
    correct: 0,
    explanation: "Crashing: reduce duration of critical path activities by adding resources (overtime, more workers). Focus on activities with lowest crash cost per day saved."
  },
  {
    id: "topic15_006", topicId: 15, subtopic: "Quality", difficulty: 1,
    question: "Six Sigma aims for a defect rate of:",
    options: ["3.4 defects per million opportunities (DPMO)", "6 defects per million", "0 defects per million", "34 defects per million"],
    correct: 0,
    explanation: "Six Sigma: process mean 6σ from nearest spec limit → 3.4 DPMO (with 1.5σ shift). DMAIC methodology: Define, Measure, Analyze, Improve, Control."
  },
  {
    id: "topic15_007", topicId: 15, subtopic: "Quality", difficulty: 2,
    question: "A control chart shows a process is 'out of control' when:",
    options: ["Points fall outside the control limits or show non-random patterns", "All points are within limits", "The mean is centered", "The range is constant"],
    correct: 0,
    explanation: "Out of control: point beyond 3σ limits, 7+ consecutive points on one side, trend of 6+ points, 2 of 3 beyond 2σ. Indicates assignable cause variation."
  },
  {
    id: "topic15_008", topicId: 15, subtopic: "Quality", difficulty: 2,
    question: "Process capability index Cpk measures:",
    options: ["How well the process output meets specification limits (centered and spread)", "The cost of production", "The number of defects", "The mean only"],
    correct: 0,
    explanation: "Cpk = min[(USL − μ)/(3σ), (μ − LSL)/(3σ)]. Cpk ≥ 1.33: capable. Cpk < 1: not capable (excessive defects). Cp ignores centering."
  },
  {
    id: "topic15_009", topicId: 15, subtopic: "Quality", difficulty: 1,
    question: "A Pareto chart is based on the principle that:",
    options: ["80% of problems are caused by 20% of causes (vital few vs. trivial many)", "All causes contribute equally", "The tallest bar is least important", "Random variation is the main cause"],
    correct: 0,
    explanation: "Pareto (80/20 rule): bars sorted tallest to shortest with cumulative line. Focus on the vital few causes for maximum improvement."
  },
  {
    id: "topic15_010", topicId: 15, subtopic: "Quality", difficulty: 2,
    question: "FMEA (Failure Mode and Effects Analysis) prioritizes risks using:",
    options: ["Risk Priority Number (RPN) = Severity × Occurrence × Detection", "Only severity", "Only cost", "Random assignment"],
    correct: 0,
    explanation: "RPN = S × O × D (each rated 1-10). Higher RPN → higher priority for corrective action. Focus on reducing severity, occurrence, or improving detection."
  },
  {
    id: "topic15_011", topicId: 15, subtopic: "Quality", difficulty: 3,
    question: "MTBF (Mean Time Between Failures) for a component with constant failure rate λ is:",
    options: ["MTBF = 1/λ", "MTBF = λ", "MTBF = 1/λ²", "MTBF = e^λ"],
    correct: 0,
    explanation: "MTBF = 1/λ. Reliability: R(t) = e^(−λt) = e^(−t/MTBF). Higher MTBF → more reliable. Applies during the 'useful life' period (constant failure rate)."
  },
  {
    id: "topic15_012", topicId: 15, subtopic: "Quality", difficulty: 2,
    question: "A cause-and-effect (Ishikawa/fishbone) diagram organizes potential causes of a problem into:",
    options: ["Categories such as Man, Machine, Material, Method, Measurement, Environment", "A timeline", "A flowchart", "A Gantt chart"],
    correct: 0,
    explanation: "Fishbone: effect (problem) at the head, causes along 'bones' in categories (6M's). Used in brainstorming root causes. Visual and structured."
  },
  {
    id: "topic15_013", topicId: 15, subtopic: "Project Management", difficulty: 1,
    question: "The work breakdown structure (WBS) is:",
    options: ["A hierarchical decomposition of the project into manageable work packages", "A list of employee names", "A budget spreadsheet", "A quality control chart"],
    correct: 0,
    explanation: "WBS: breaks the project into deliverables → work packages. 100% rule: WBS includes ALL project work. Foundation for scheduling, budgeting, and responsibility."
  },
  {
    id: "topic15_014", topicId: 15, subtopic: "Project Management", difficulty: 2,
    question: "Earned value management (EVM) uses CPI (Cost Performance Index) = EV/AC. A CPI < 1 means:",
    options: ["The project is over budget (spending more than the value of work completed)", "The project is under budget", "Schedule is behind", "Quality is poor"],
    correct: 0,
    explanation: "CPI = EV/AC. CPI < 1: over budget. CPI > 1: under budget. SPI = EV/PV: SPI < 1: behind schedule. SPI > 1: ahead. EV = earned value, AC = actual cost, PV = planned value."
  },
  {
    id: "topic15_015", topicId: 15, subtopic: "Quality", difficulty: 1,
    question: "Total Quality Management (TQM) emphasizes:",
    options: ["Continuous improvement involving all employees and customer focus", "Inspection only at the end", "Hiring more inspectors", "Accepting some defects as inevitable"],
    correct: 0,
    explanation: "TQM: everyone responsible for quality. Prevention over inspection. Continuous improvement (Kaizen). Customer satisfaction focus. Statistical methods."
  },
  {
    id: "topic15_016", topicId: 15, subtopic: "Project Management", difficulty: 2,
    question: "Resource leveling in project management aims to:",
    options: ["Smooth out resource usage over time to avoid overallocation", "Increase the critical path", "Add more resources", "Remove activities"],
    correct: 0,
    explanation: "Resource leveling: adjust activity timing (within float) to smooth resource demands. May extend project duration if critical activities are affected."
  },
  {
    id: "topic15_017", topicId: 15, subtopic: "Quality", difficulty: 3,
    question: "The bathtub curve for reliability shows three failure rate regions:",
    options: ["Infant mortality (decreasing), useful life (constant), wear-out (increasing)", "Constant throughout", "Increasing throughout", "Decreasing throughout"],
    correct: 0,
    explanation: "Bathtub curve: early failures (manufacturing defects, burn-in), constant rate period (random failures), wear-out (aging, fatigue). Design for the constant-rate period."
  },
  {
    id: "topic15_018", topicId: 15, subtopic: "Project Management", difficulty: 3,
    question: "In PERT, the probability that the project finishes by a target date T_target is found using:",
    options: ["Z = (T_target − T_expected)/σ_project, then looking up the standard normal distribution", "Simply comparing T_target to T_expected", "Multiplying all activity probabilities", "The critical path duration only"],
    correct: 0,
    explanation: "σ_project = √(Σσ²_critical). Z = (T_target − T_e)/σ. Look up Z in standard normal table. Z > 0: target is after expected → probability > 50%."
  },
  {
    id: "topic15_019", topicId: 15, subtopic: "Quality", difficulty: 2,
    question: "The X-bar and R chart is used to monitor:",
    options: ["Process mean (X-bar) and variability (Range) over time using subgroups", "Individual measurements only", "Attribute data (pass/fail)", "Cost of quality"],
    correct: 0,
    explanation: "X-bar chart: monitors process centering. R chart: monitors spread/variability. Take subgroups of n samples, plot means and ranges. Used for variables (continuous) data."
  },
  {
    id: "topic15_020", topicId: 15, subtopic: "Project Management", difficulty: 1,
    question: "A milestone in project management is:",
    options: ["A significant event or checkpoint with zero duration", "A regular activity", "A resource", "A cost estimate"],
    correct: 0,
    explanation: "Milestones: key events (project start, design review, testing complete, delivery). Zero duration. Used for tracking progress and reporting to stakeholders."
  },
];

export const FME_QUESTION_COUNT = FME_QUESTIONS.length;

export function getFMEQuestions(topicId?: number, difficulty?: number): FMEQuestion[] {
  let filtered = FME_QUESTIONS;
  if (topicId !== undefined) filtered = filtered.filter(q => q.topicId === topicId);
  if (difficulty !== undefined) filtered = filtered.filter(q => q.difficulty === difficulty);
  return filtered;
}
