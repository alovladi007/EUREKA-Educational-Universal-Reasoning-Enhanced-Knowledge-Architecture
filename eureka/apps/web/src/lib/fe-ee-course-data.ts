/**
 * FE Electrical & Computer Engineering — Course Content
 * 18 topics with detailed study content, key points, and formulas.
 * Extracted from standalone FE-Electrical-Computer-Course.jsx.
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

/** Numeric topicId → curriculum string IDs */
const TOPIC_MAPPING: Record<number, string[]> = {
  0: ['fee_algebra_trig','fee_complex','fee_discrete_math','fee_analytic_geom','fee_diff_calc','fee_int_calc','fee_diffeq','fee_linear_algebra','fee_vector_analysis'],
  1: ['fee_prob_dist','fee_expected_values','fee_regression','fee_hypothesis'],
  2: ['fee_codes_ethics','fee_licensure','fee_liability'],
  3: ['fee_tvm','fee_cost_analysis','fee_depreciation'],
  4: ['fee_conductors','fee_semiconductors','fee_dielectrics','fee_magnetic_mat'],
  5: ['fee_work_energy','fee_charge_current','fee_electromech'],
  6: ['fee_dc_fundamentals','fee_network_theorems','fee_ac_phasors','fee_ac_power','fee_resonance','fee_three_phase','fee_transients'],
  7: ['fee_time_domain','fee_freq_domain','fee_transfer_func','fee_z_transforms'],
  8: ['fee_fourier','fee_sampling','fee_filters','fee_dft_fft'],
  9: ['fee_diodes','fee_bjt','fee_mosfet','fee_opamp','fee_power_elec'],
  10: ['fee_3phase_power','fee_transformers','fee_per_unit','fee_tx_lines','fee_pf_correction','fee_motors'],
  11: ['fee_electrostatics','fee_magnetostatics','fee_maxwell','fee_wave_prop','fee_em_tx_lines'],
  12: ['fee_block_diagrams','fee_stability','fee_root_locus','fee_bode_nyquist','fee_pid','fee_time_specs'],
  13: ['fee_am_fm','fee_digital_mod','fee_noise_snr','fee_channel_cap','fee_multiplexing'],
  14: ['fee_osi_tcpip','fee_ip_subnetting','fee_topologies','fee_net_security','fee_net_perf'],
  15: ['fee_number_sys','fee_comb_logic','fee_seq_logic','fee_state_machines','fee_memory'],
  16: ['fee_architecture','fee_mem_hierarchy','fee_io_interfacing','fee_performance'],
  17: ['fee_algorithms','fee_data_structures','fee_oop','fee_sdlc','fee_databases'],
};

const STUDY_CONTENT_RAW = 
[
{
    topicId: 0,
    title: "Mathematics",
    overview: "Mathematics forms the foundation for all engineering calculations on the FE exam. This topic covers algebra, trigonometry, calculus, differential equations, and linear algebra—the essential tools for solving complex engineering problems.",
    sections: [
      {
        title: "Algebra & Trigonometry",
        content: "Algebra and trigonometry are fundamental to solving engineering equations. Quadratic equations appear frequently in circuit analysis and control systems. The quadratic formula x = (-b ± √(b²-4ac))/(2a) solves any equation of the form ax²+bx+c=0. Trigonometric identities are crucial for AC circuit analysis where sinusoidal steady-state behavior dominates. Key identities include sin²θ + cos²θ = 1, sin(A±B) = sinA·cosB ± cosA·sinB, and cos(A±B) = cosA·cosB ∓ sinA·sinB. The relationship between rectangular and polar forms—x = r·cosθ, y = r·sinθ—allows conversion between Cartesian and polar coordinates, essential for phasor analysis in AC circuits. On the FE exam, expect problems requiring you to manipulate algebraic expressions, solve systems of linear equations, and convert between trigonometric forms. Memorize the unit circle values for common angles (0°, 30°, 45°, 60°, 90°) as these appear repeatedly in problems.",
        keyPoints: [
          "Quadratic formula solves ax²+bx+c=0; discriminant b²-4ac determines real/complex roots",
          "sin²θ + cos²θ = 1 is the most important trigonometric identity",
          "Rectangular to polar: r = √(x²+y²), θ = arctan(y/x); know how to work in both forms",
          "Unit circle values are worth memorizing for speed on the exam"
        ],
        formulas: ["x = (-b ± √(b²-4ac))/(2a)", "sin²θ + cos²θ = 1", "x = r·cosθ", "y = r·sinθ", "r = √(x²+y²)"]
      },
      {
        title: "Complex Numbers",
        content: "Complex numbers are indispensable for AC circuit analysis. A complex number has the form a + jb where a is the real part, b is the imaginary part, and j = √(-1). Euler's formula e^(jθ) = cosθ + j·sinθ is the bridge between rectangular and polar forms. The magnitude of a complex number is |z| = √(a²+b²) and the angle is θ = arctan(b/a), keeping track of the correct quadrant. Complex arithmetic follows standard rules: addition is component-wise, multiplication requires using j² = -1, and division uses conjugate multiplication. The complex conjugate z* = a - jb is essential for impedance calculations and power factor analysis. On the FE exam, you'll frequently convert between rectangular form (R + jX) and polar form (|Z|∠θ) for impedance calculations. Practice with phasor representation of sinusoidal signals: v(t) = Vm·cos(ωt+φ) corresponds to phasor V = Vm∠φ.",
        keyPoints: [
          "Euler's formula: e^(jθ) = cosθ + j·sinθ connects exponential, rectangular, and polar forms",
          "Magnitude |z| = √(a²+b²); angle θ = arctan(b/a) with quadrant consideration",
          "Conjugate multiplication for division: (a+jb)/(c+jd) = [(a+jb)(c-jd)]/[(c+jd)(c-jd)]",
          "Phasor representation simplifies AC circuit analysis; always identify magnitude and phase angle"
        ],
        formulas: ["e^(jθ) = cosθ + j·sinθ", "z = a + jb", "|z| = √(a²+b²)", "θ = arctan(b/a)", "z* = a - jb"]
      },
      {
        title: "Calculus Fundamentals",
        content: "Calculus is essential for understanding rates of change in electrical systems. Differentiation measures how quantities change with respect to variables—in circuit analysis, dv/dt represents voltage change rate, which relates to capacitor and inductor behavior. Key derivatives include d/dx(x^n) = n·x^(n-1), d/dx(e^x) = e^x, d/dx(ln(x)) = 1/x, d/dx(sin(x)) = cos(x), and d/dx(cos(x)) = -sin(x). The product rule (uv)' = u'v + uv' and chain rule dy/dx = (dy/du)(du/dx) are frequently needed for complex expressions. Integration is the reverse process: ∫x^n dx = x^(n+1)/(n+1) + C, ∫e^x dx = e^x + C, and ∫1/x dx = ln(x) + C. On the FE exam, you'll use integration to find energy stored in inductors and capacitors, and to calculate areas under curves (power over time equals energy). Understanding L'Hôpital's rule for limits and Taylor series expansions for approximations can help with problem-solving efficiency.",
        keyPoints: [
          "Derivative df/dx represents instantaneous rate of change; essential for inductor (L·di/dt) and capacitor (C·dv/dt)",
          "Product rule: (uv)' = u'v + uv'; chain rule: dy/dx = (dy/du)·(du/dx)",
          "Common integrals: ∫x^n dx = x^(n+1)/(n+1) + C, ∫e^x dx = e^x + C",
          "Integration by parts: ∫u dv = uv - ∫v du is useful for products of polynomials and exponentials"
        ],
        formulas: ["d/dx(x^n) = n·x^(n-1)", "d/dx(e^x) = e^x", "d/dx(sin(x)) = cos(x)", "∫x^n dx = x^(n+1)/(n+1) + C"]
      },
      {
        title: "Differential Equations",
        content: "Differential equations model dynamic behavior in electrical systems—circuit transients, control system responses, and signal processing all rely on differential equation solutions. A first-order linear ODE has the form dy/dt + P(t)·y = Q(t). For constant coefficients, dy/dt + ay = b with initial condition y(0) = y₀, the solution is y(t) = b/a + (y₀ - b/a)·e^(-at). This describes RC and RL circuit charging/discharging. A second-order linear ODE is d²y/dt² + 2ζωₙ·dy/dt + ωₙ²·y = ωₙ²·u(t), which describes RLC circuits and control systems. The solution depends on the damping ratio ζ: underdamped (ζ < 1) oscillates, critically damped (ζ = 1) returns fastest without overshoot, and overdamped (ζ > 1) decays slowly. On the FE exam, you'll solve first-order transient equations for RC/RL circuits and identify second-order system characteristics. The Laplace transform converts differential equations to algebraic equations—a major time-saver during the exam.",
        keyPoints: [
          "First-order response: y(t) = steady-state + (initial_value - steady-state)·e^(-t/τ) where τ is time constant",
          "Time constant τ = RC for capacitors, τ = L/R for inductors; represents 63% change from initial to steady-state",
          "Damping ratio ζ = c/(2√(km)) determines underdamped (oscillatory) vs overdamped (smooth) response",
          "Use Laplace transforms to convert ODEs to algebraic equations; solve, then inverse transform back to time domain"
        ],
        formulas: ["dy/dt + ay = b → y(t) = b/a + (y₀ - b/a)·e^(-at)", "τ = RC (capacitor)", "τ = L/R (inductor)"]
      },
      {
        title: "Linear Algebra & Matrix Operations",
        content: "Linear algebra provides tools for solving systems of equations and analyzing circuits with multiple nodes/loops. A system of linear equations can be written as Ax = b where A is the coefficient matrix, x is the unknown vector, and b is the constant vector. Matrix operations follow specific rules: addition is element-wise, multiplication is row-by-column (AB ≠ BA in general), and the inverse A⁻¹ satisfies A·A⁻¹ = I (identity matrix). Determinants and Cramer's rule provide solutions: for 2×2 matrices, det(A) = ad - bc. Eigenvalues and eigenvectors satisfy Ax = λx, where λ is the eigenvalue and x is the eigenvector; these are crucial for stability analysis in control systems. On the FE exam, you might solve nodal equations (KCL applied at each node) or mesh equations (KVL applied to each loop) using matrix methods. Gaussian elimination is faster than hand-calculating inverses for large systems. Understand that eigenvalues with negative real parts ensure system stability.",
        keyPoints: [
          "Matrix form Ax = b solves n linear equations with n unknowns; use Gaussian elimination or matrix inversion",
          "Determinant for 2×2: det([a b; c d]) = ad - bc; non-zero determinant means matrix is invertible",
          "Eigenvalue equation Ax = λx; for control systems, all eigenvalues must have negative real parts for stability",
          "Matrix multiplication: (AB)ᵢⱼ = Σₖ Aᵢₖ·Bₖⱼ; associative but not commutative"
        ],
        formulas: ["det([a b; c d]) = ad - bc", "Ax = b → x = A⁻¹b", "Ax = λx (eigenvalue equation)"]
      },
      {
        title: "Laplace Transform & Vector Analysis",
        content: "The Laplace transform converts time-domain functions into frequency-domain functions, simplifying differential equation solving. The definition is F(s) = ∫₀^∞ f(t)·e^(-st) dt where s = σ + jω. Key transform pairs: L{1} = 1/s, L{t} = 1/s², L{e^(-at)} = 1/(s+a), L{sin(ωt)} = ω/(s²+ω²), L{cos(ωt)} = s/(s²+ω²). The final value theorem states lim(t→∞) f(t) = lim(s→0) s·F(s), allowing you to find steady-state values without inverting the entire transform. Vector analysis involves gradient (∇f = ∂f/∂x î + ∂f/∂y ĵ + ∂f/∂z k̂), divergence (∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z), curl (∇×F), and the dot/cross product. On the FE exam, Laplace transforms appear in control systems and circuit analysis. Vector operations appear in electromagnetics problems involving electric/magnetic fields.",
        keyPoints: [
          "Laplace transform converts differential equations to algebraic equations in s-domain; final value theorem avoids inverse transform",
          "Key pairs: L{t^n} = n!/s^(n+1), L{e^(-at)·f(t)} = F(s+a), L{f'(t)} = s·F(s) - f(0)",
          "Gradient ∇f gives direction of steepest increase; divergence ∇·F measures outflow; curl ∇×F measures rotation",
          "Dot product A·B = |A||B|cosθ (scalar); cross product |A×B| = |A||B|sinθ (vector perpendicular to both)"
        ],
        formulas: ["F(s) = ∫₀^∞ f(t)·e^(-st) dt", "L{sin(ωt)} = ω/(s²+ω²)", "L{cos(ωt)} = s/(s²+ω²)", "∇f = ∂f/∂x î + ∂f/∂y ĵ"]
      }
    ]
  },
  {
    topicId: 1,
    title: "Probability and Statistics",
    overview: "Probability and statistics enable engineers to make decisions under uncertainty, analyze measurement data, and design robust systems. This topic covers probability distributions, statistical measures, hypothesis testing, and regression—essential for understanding system reliability and data analysis.",
    sections: [
      {
        title: "Probability Fundamentals & Distributions",
        content: "Probability quantifies the likelihood of events. Basic rules: P(A) ranges from 0 to 1, P(A ∪ B) = P(A) + P(B) - P(A ∩ B) (union), P(A ∩ B) = P(A)·P(B|A) (intersection/conditional). Bayes' theorem P(A|B) = P(B|A)·P(A)/P(B) is fundamental for updating probabilities with new information. Common distributions include the binomial (n trials, each with probability p of success): P(X=k) = C(n,k)·p^k·(1-p)^(n-k), the Poisson (rare events with rate λ): P(X=k) = (λ^k·e^(-λ))/k!, and the normal distribution with PDF f(x) = (1/(σ√(2π)))·e^(-(x-μ)²/(2σ²)). The standard normal uses Z = (X-μ)/σ and is tabulated for quick lookup. On the FE exam, you'll identify which distribution fits a scenario, calculate probabilities, and use the cumulative distribution function (CDF) for ranges. The exponential distribution f(t) = λ·e^(-λt) models failure rates and waiting times in reliability analysis.",
        keyPoints: [
          "Bayes' theorem: P(A|B) = P(B|A)·P(A)/P(B); use when you want posterior probability given evidence",
          "Binomial: discrete, n trials, fixed p; use for pass/fail scenarios",
          "Poisson: rare events with rate λ; approximates binomial when n is large and p is small",
          "Normal distribution: symmetric, defined by mean μ and std dev σ; use standard normal tables for Z = (X-μ)/σ",
          "Exponential: models time between events; memoryless property P(T > t+s | T > s) = P(T > t)"
        ],
        formulas: [
          "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
          "P(B|A) = P(A ∩ B)/P(A)",
          "P(A|B) = P(B|A)·P(A)/P(B)",
          "Binomial: P(X=k) = C(n,k)·p^k·(1-p)^(n-k)",
          "Poisson: P(X=k) = (λ^k·e^(-λ))/k!",
          "Normal: f(x) = (1/(σ√(2π)))·e^(-(x-μ)²/(2σ²))",
          "Standard normal: Z = (X-μ)/σ"
        ]
      },
      {
        title: "Statistical Measures & Regression",
        content: "Statistical measures summarize data: the mean (average) is μ = ΣX/n, the variance measures spread around the mean σ² = Σ(X-μ)²/n, and standard deviation σ = √(σ²). The median divides data in half and is robust to outliers. Covariance measures how two variables move together: Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)], and correlation coefficient r = Cov(X,Y)/(σₓ·σᵧ) ranges from -1 (perfect negative) to +1 (perfect positive). Linear regression fits a line y = a + bx to data: the slope b = r·(σᵧ/σₓ) and intercept a = μᵧ - b·μₓ. The coefficient of determination R² = r² shows how much variance in y is explained by x (0 ≤ R² ≤ 1). On the FE exam, you'll calculate these statistics from datasets, interpret correlation, and predict values using regression. Understand that correlation ≠ causation. Confidence intervals quantify uncertainty: for a normal distribution, the 95% CI is approximately μ ± 1.96σ.",
        keyPoints: [
          "Mean μ = ΣX/n; variance σ² = Σ(X-μ)²/n; std dev σ = √(σ²)",
          "Correlation coefficient r ∈ [-1, +1]; r=0 means no linear relationship; r=±1 means perfect linear fit",
          "Regression line y = a + bx where b = r·σᵧ/σₓ and a = μᵧ - b·μₓ",
          "R² = r²; shows fraction of variance in y explained by x; closer to 1 is better fit",
          "95% confidence interval ≈ μ ± 1.96σ for normal distribution"
        ],
        formulas: [
          "μ = ΣX/n",
          "σ² = Σ(X-μ)²/n",
          "σ = √(σ²)",
          "Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)]",
          "r = Cov(X,Y)/(σₓ·σᵧ)",
          "b = r·(σᵧ/σₓ)",
          "a = μᵧ - b·μₓ",
          "R² = r²"
        ]
      },
      {
        title: "Hypothesis Testing & Confidence Intervals",
        content: "Hypothesis testing determines whether data supports a claim (null hypothesis H₀) or suggests an alternative (H₁). The process: state H₀ and H₁, choose a significance level α (typically 0.05), calculate a test statistic, find the p-value, and reject H₀ if p < α. A Type I error (false positive) rejects a true H₀ with probability α; a Type II error (false negative) fails to reject false H₀ with probability β. The t-test compares sample mean to a known value or between two samples: t = (x̄ - μ₀)/(s/√n) where s is sample standard deviation. The chi-square test examines categorical data: χ² = Σ(O-E)²/E where O is observed and E is expected frequency. Confidence intervals estimate population parameters: the 100(1-α)% CI for a mean is x̄ ± t(α/2,n-1)·s/√n, where the t-value comes from t-tables. On the FE exam, you'll interpret p-values, construct CIs, and identify appropriate tests. Remember that a 95% CI does NOT mean a 95% probability the parameter is in the interval (it's in or not)—rather, 95% of such CIs constructed from repeated sampling would contain the true parameter.",
        keyPoints: [
          "H₀ is the null hypothesis (no effect); H₁ is the alternative hypothesis; reject H₀ if p-value < α",
          "Type I error: reject true H₀ (probability α); Type II error: fail to reject false H₀ (probability β)",
          "t-test: t = (x̄ - μ₀)/(s/√n) compares sample mean to reference; use t-table for critical value",
          "Chi-square test: χ² = Σ(O-E)²/E tests categorical/goodness-of-fit; compare to chi-square table",
          "Confidence interval: x̄ ± t·s/√n gives range around sample mean with specified confidence level"
        ],
        formulas: [
          "t = (x̄ - μ₀)/(s/√n)",
          "χ² = Σ(O-E)²/E",
          "CI: x̄ ± t(α/2,n-1)·s/√n",
          "Standard error: SE = s/√n"
        ]
      }
    ]
  },
  {
    topicId: 2,
    title: "Ethics and Professional Practice",
    overview: "Ethics and professional practice ensure engineers maintain integrity, prioritize public welfare, and act responsibly. The FE exam tests knowledge of the NCEES Model Rules and NSPE Code of Ethics through scenario-based questions. Success requires understanding core principles, recognizing ethical dilemmas, and knowing how to resolve conflicts.",
    sections: [
      {
        title: "NCEES Model Rules & NSPE Code of Ethics",
        content: "The NCEES Model Rules provide the legal framework for engineering licensure and professional conduct, adopted by all U.S. states in some form. Key rules include obtaining proper licenses before offering engineering services, maintaining public health and safety as paramount, following applicable laws and regulations, and avoiding conflicts of interest. The NSPE Code of Ethics complements legal rules with professional values: engineers must hold paramount the safety, health, and welfare of the public; perform services with integrity; avoid deception; seek truth and knowledge; be fair and impartial; and refuse to participate in unethical conduct. Specifically, engineers must not claim professional credit they don't deserve, must not misrepresent their qualifications or experience, and must notify appropriate authorities if they discover work endangering public safety. On the FE exam, expect scenarios where an engineer must decide between profit and ethics, or between a client's desires and public safety. The correct answer typically chooses public welfare. Understand that licensure is required to offer engineering services to the public (though there are exceptions for employees); one cannot \"practice engineering\" without a license in most jurisdictions.",
        keyPoints: [
          "Public health and safety is ALWAYS paramount—even above profit, client satisfaction, or employer interests",
          "Only licensed professionals can offer engineering services to the public; understand your jurisdiction's requirements",
          "Avoid conflicts of interest; disclose when you have competing interests to relevant parties",
          "Do not misrepresent qualifications; only claim professional credit for work you actually performed",
          "If you discover work endangering public safety, you have a duty to report it through proper channels"
        ],
        formulas: []
      },
      {
        title: "Professional Licensure, Authority, & Responsibilities",
        content: "Professional Engineers (PEs) are licensed professionals who take responsibility for their work and its impact on public safety. The PE stamp on drawings/documents certifies the engineer's personal review and approval. Licensure requires four years of relevant work experience under a PE (or equivalent), passage of the FE exam (which you're studying for), passage of the PE exam, and moral character verification. Each state has a licensing board that enforces rules through disciplinary procedures: violations can result in fines, license suspension, or license revocation. Engineers have a duty to maintain confidentiality of client information unless disclosure is required by law or necessary to protect public welfare. Engineers must also keep records of their work and maintain professional liability insurance in many fields. On the FE exam, understand that as an EIT (Engineer in Training—what you become after passing the FE), you can work under PE supervision and sign certain documents in that capacity, but you cannot stamp drawings as the responsible engineer. You cannot use the PE title until you pass the PE exam and meet all requirements.",
        keyPoints: [
          "EIT (Engineer in Training) is a credential you earn by passing FE; PE requires 4 years experience plus PE exam",
          "PE stamp means personal legal responsibility; the stamped engineer certifies the design is safe and correct",
          "Keep detailed records of your work; maintain professional liability insurance where required",
          "Understand your authority limits—EITs can assist but cannot take final responsibility",
          "Licensing board enforcement can result in fines, suspension, or revocation for serious violations"
        ],
        formulas: []
      },
      {
        title: "Ethical Decision-Making Framework & Public Welfare",
        content: "When facing an ethical dilemma, engineers use a systematic decision-making framework. First, identify the stakeholders (public, employer, client, yourself) and their interests. Second, clarify the ethical issue—is it a conflict of interest, professional integrity, accuracy/honesty, or public safety concern? Third, consider applicable codes, laws, regulations, and company policies. Fourth, identify options and consequences of each (who benefits/harms). Fifth, make a decision that prioritizes public welfare, then take action and document your choice. The hierarchy of values in engineering ethics places public welfare above all—ahead of employer directives, profit, personal advantage, and even client wishes. If asked to do something unethical, document the request and your refusal, notify supervisors and appropriate boards if necessary. On the FE exam, recognize that the \"right answer\" to an ethical scenario is rarely the most profitable or easiest choice. Common dilemmas include: being asked to falsify test results (refuse and report), discovering a design flaw after delivery (disclose and correct), pressure to cut corners for schedule (advise of risks and resist), and using copyrighted code without permission (use licensed code or get permission). Always ask: \"Would I be comfortable if this decision appeared in a newspaper tomorrow?\" If not, it's probably unethical.",
        keyPoints: [
          "Framework: identify stakeholders → clarify issue → check codes/laws → list options → prioritize public welfare",
          "Public welfare ALWAYS comes first, even if employer/client disagrees or it costs money",
          "Document unethical requests and your refusal; report to appropriate authorities if public safety is at risk",
          "Be honest about limitations in your knowledge; admit when you need expert consultation",
          "\"Sunshine test\": Would you be comfortable if your decision appeared in news? If not, reconsider"
        ],
        formulas: []
      }
    ]
  },
  {
    topicId: 3,
    title: "Engineering Economics",
    overview: "Engineering economics evaluates project costs and benefits, comparing alternatives and justifying investments. The FE exam tests time value of money, present/future value calculations, rate of return analysis, benefit-cost ratios, and depreciation—tools for making financial decisions in engineering projects.",
    sections: [
      {
        title: "Time Value of Money & Factors",
        content: "Money has different value at different times due to interest earning potential. A dollar today is worth more than a dollar in the future. The interest rate i (or discount rate) quantifies this. With compound interest, a present amount P grows to future amount F = P(1+i)^n after n periods. Conversely, a future amount F has present value P = F/(1+i)^n. Engineers use standard factors to simplify calculations: the future worth factor (F/P, i, n) = (1+i)^n converts present to future, and the present worth factor (P/F, i, n) = 1/(1+i)^n converts future to present. For annuities (uniform payments A each period), the present worth factor is (P/A, i, n) = [(1+i)^n - 1]/[i(1+i)^n], converting an annuity to present value. The future worth factor for annuities is (F/A, i, n) = [(1+i)^n - 1]/i. The capital recovery factor (A/P, i, n) = i(1+i)^n/[(1+i)^n - 1] converts present value to annuity payments (used for loans). On the FE exam, you'll use standard factor tables or calculate factors directly. Nominal interest rate r (compounded m times per year) converts to effective annual rate (EAR) = (1 + r/m)^m - 1. Continuous compounding uses e: F = P·e^(rt).",
        keyPoints: [
          "Compound interest: F = P(1+i)^n; conversely P = F/(1+i)^n",
          "Future value factor (F/P): multiply by (1+i)^n to find future amount from present",
          "Present value factor (P/F): multiply by 1/(1+i)^n to find present amount from future",
          "Annuity factors: (P/A) converts uniform payments to present value; (F/A) converts to future value",
          "Effective annual rate (EAR) for nominal rate r compounded m times: EAR = (1 + r/m)^m - 1"
        ],
        formulas: [
          "F = P(1+i)^n",
          "P = F/(1+i)^n",
          "(F/P, i, n) = (1+i)^n",
          "(P/F, i, n) = 1/(1+i)^n",
          "(P/A, i, n) = [(1+i)^n - 1]/[i(1+i)^n]",
          "(F/A, i, n) = [(1+i)^n - 1]/i",
          "(A/P, i, n) = i(1+i)^n/[(1+i)^n - 1]",
          "EAR = (1 + r/m)^m - 1",
          "F = P·e^(rt) (continuous compounding)"
        ]
      },
      {
        title: "Net Present Value, Rate of Return, & Annual Worth",
        content: "Net Present Value (NPV) evaluates projects by converting all costs and benefits to present value: NPV = -C₀ + Σ[Bₜ/(1+i)^t] where C₀ is initial cost, Bₜ is net benefit in year t, and i is discount rate. A positive NPV means the project adds value; choose projects with highest NPV. The Internal Rate of Return (IRR) is the discount rate that makes NPV = 0: solve 0 = -C₀ + Σ[Bₜ/(1+i)^t] for i. Projects with IRR > required rate of return (usually company's cost of capital) are acceptable. IRR allows comparing projects with different scales. Annual Worth (AW) converts all cash flows to equivalent annual amounts: AW = NPV × (A/P, i, n). Projects with positive AW are acceptable; this is convenient for comparing alternatives with different lifespans. Payback period is the time until cumulative cash flows equal initial investment (ignores cash flows after payback and time value of money—use only for screening). Profitability index (Benefit/Cost ratio) = PV of benefits / PV of costs; greater than 1 is acceptable. On the FE exam, be comfortable solving NPV equations (often using iterative methods or financial calculators for IRR), comparing alternatives using consistent metrics, and understanding when to use each method.",
        keyPoints: [
          "NPV = -C₀ + Σ[Bₜ/(1+i)^t]; positive NPV indicates value-adding project",
          "IRR is the discount rate making NPV = 0; project is acceptable if IRR > required return",
          "Annual Worth (AW): convert all cash flows to equivalent annual amounts; useful for different lifespans",
          "Payback period (simple but incomplete); profitability index = PV(benefits)/PV(costs) > 1 is acceptable",
          "For mutually exclusive projects, choose the one with highest NPV or IRR (after adjusting for scale differences)"
        ],
        formulas: [
          "NPV = -C₀ + Σ[Bₜ/(1+i)^t]",
          "IRR: solve 0 = -C₀ + Σ[Bₜ/(1+i)^t] for i",
          "AW = NPV × (A/P, i, n)",
          "Profitability Index = PV(benefits) / PV(costs)"
        ]
      },
      {
        title: "Depreciation & Benefit-Cost Analysis",
        content: "Depreciation allocates an asset's cost over its useful life for accounting and tax purposes. Straight-line depreciation assumes equal annual depreciation: D = (Cost - Salvage)/Life. The book value in year t is BV = Cost - t·D. The Modified Accelerated Cost Recovery System (MACRS) is the U.S. standard for tax depreciation; it assigns assets to recovery periods (e.g., 5-year, 7-year, 15-year) and applies accelerated rates (front-loaded). MACRS is not linear; consult tables for percentages. Sum-of-years-digits (SYD) is an accelerated method: D = (Remaining useful life)/(Sum of all years) × (Cost - Salvage). Benefit-Cost (B/C) analysis compares benefits against costs for public projects: B/C ratio = PV(benefits)/PV(costs); accept if B/C > 1. Unlike NPV, B/C is not affected by including/excluding salvage value in benefits or costs (ratio stays above 1). Incremental B/C analysis compares alternatives: accept the more expensive alternative if its incremental B/C > 1. On the FE exam, you'll calculate depreciation for tax purposes, compute book values, and evaluate public projects using B/C ratios. Understand the difference between straight-line (simple, for reporting) and MACRS (accelerated, for taxes).",
        keyPoints: [
          "Straight-line: D = (Cost - Salvage)/Life; book value BVₜ = Cost - t·D",
          "MACRS is accelerated depreciation used for U.S. tax purposes; consult recovery period tables",
          "Sum-of-years-digits: D = (Remaining years)/(Sum of all years) × (Cost - Salvage)",
          "B/C ratio = PV(benefits)/PV(costs); accept if B/C > 1; compare alternatives using incremental B/C",
          "Depreciation reduces taxable income, creating tax shields that should be included in NPV analysis"
        ],
        formulas: [
          "Straight-line depreciation: D = (Cost - Salvage)/Life",
          "Book value: BVₜ = Cost - t·D",
          "Sum-of-years-digits: D = (Remaining years)/(Sum of years 1 to n) × (Cost - Salvage)",
          "B/C ratio = PV(benefits) / PV(costs)"
        ]
      }
    ]
  },
  {
    topicId: 4,
    title: "Properties of Electrical Materials",
    overview: "Understanding electrical material properties is crucial for selecting appropriate components and predicting device behavior. This topic covers conductivity, semiconductors, dielectrics, magnetic materials, and thermal properties essential for circuit and device design.",
    sections: [
      {
        title: "Conductors and Resistivity",
        content: "Conductivity describes how easily charge flows through a material. Resistivity ρ (ohm·meters) is the fundamental material property; resistance of a wire is R = ρL/A where L is length and A is cross-sectional area. Good conductors (copper, aluminum) have low resistivity (≈1.7×10⁻⁸ Ω·m for copper); poor conductors/insulators have high resistivity (≈10²⁰ Ω·m for glass). Conductivity σ = 1/ρ. Resistivity changes with temperature: ρ(T) = ρ₀[1 + α(T - T₀)] where α is the temperature coefficient of resistance. For most metals, α is positive (resistivity increases with temperature), but some materials like thermistors have large negative α. At superconductivity (below critical temperature Tc), resistivity drops to essentially zero. Current density J = I/A relates current to cross-sectional area; drift velocity vd = J/(n·e) shows electrons move slowly (millimeters per second) despite fast signal propagation (near light speed). On the FE exam, you'll calculate resistance from material properties, adjust resistivity for temperature, and select materials for specific applications. Understand that copper and aluminum are preferred for electrical applications due to low cost and low resistivity.",
        keyPoints: [
          "Resistivity ρ is material property in Ω·m; resistance R = ρL/A depends on geometry",
          "Temperature coefficient α: ρ(T) = ρ₀[1 + α(T - T₀)]; positive for metals, negative for thermistors",
          "Conductivity σ = 1/ρ; good conductors have σ > 10⁵ (Ω·m)⁻¹, insulators have σ < 10⁻¹⁵",
          "Superconductors: ρ = 0 below critical temperature Tc",
          "Current density J = I/A; relate to drift velocity and charge carrier concentration"
        ],
        formulas: [
          "R = ρL/A",
          "ρ(T) = ρ₀[1 + α(T - T₀)]",
          "σ = 1/ρ",
          "J = I/A",
          "vd = J/(n·e)"
        ]
      },
      {
        title: "Semiconductors and Band Gap",
        content: "Semiconductors (silicon, germanium) have resistivity between conductors and insulators, and their conductivity is strongly temperature-dependent. The key property is the band gap energy Eg—the energy required to promote an electron from the valence band (where electrons bond atoms) to the conduction band (where electrons are free to move). At T = 0K, a semiconductor acts like an insulator (no free electrons). As temperature increases, thermal energy promotes electrons across the band gap; the intrinsic carrier concentration ni ∝ exp(-Eg/(2kT)) where k is Boltzmann's constant. Silicon has Eg ≈ 1.12 eV at room temperature; germanium has Eg ≈ 0.66 eV (smaller band gap means higher conductivity at room temp). Doping—adding impurities—dramatically increases conductivity: n-type doping (adding donor atoms like phosphorus) provides extra electrons; p-type doping (adding acceptor atoms like boron) creates holes (missing electrons that act as positive charges). The Shockley diode equation I = Is(e^(qV/kT) - 1) describes current flow across a p-n junction. On the FE exam, expect questions about how temperature affects semiconductor conductivity, doping effects, and p-n junction behavior. Understand that power dissipation in semiconductors generates heat; thermal management is critical.",
        keyPoints: [
          "Band gap Eg is energy to promote electron from valence to conduction band; smaller Eg means higher conductivity",
          "Intrinsic carrier concentration ni ∝ exp(-Eg/(2kT)); doubles roughly every 5-10°C increase",
          "n-type doping: donor impurities provide free electrons; p-type: acceptor impurities create holes",
          "Shockley equation I = Is(e^(qV/kT) - 1) describes diode current; exponential voltage dependence",
          "Semiconductor devices are temperature-sensitive; thermal runaway can occur in power devices if not managed"
        ],
        formulas: [
          "ni ∝ exp(-Eg/(2kT))",
          "I = Is(e^(qV/kT) - 1) (Shockley diode equation)"
        ]
      },
      {
        title: "Dielectrics, Insulators, Magnetic Materials, & Thermal Properties",
        content: "Dielectrics are insulating materials used in capacitors and to isolate conductors. Key properties include dielectric constant (relative permittivity εᵣ = ε/ε₀) which determines capacitance C = εᵣε₀A/d, and dielectric strength (maximum electric field before breakdown). Common dielectrics: vacuum (εᵣ=1), air (εᵣ≈1.0006), glass (εᵣ≈4-10), mica (εᵣ≈3-7). The polarization of dielectric molecules increases capacitance compared to vacuum. Breakdown occurs when electric field exceeds the material's critical field strength. Magnetic materials are classified as diamagnetic (weak repulsion from field), paramagnetic (weak attraction), or ferromagnetic (strong attraction, permanent magnetization). Ferromagnetic materials (iron, cobalt, nickel) have magnetic permeability μ (relative permeability μᵣ = μ/μ₀). Permeability affects inductance and transformer behavior: L = μₙ²A/l. The Curie temperature Tc is the point above which ferromagnetic materials become paramagnetic. Thermal properties are critical for power devices: thermal conductivity κ (W/m·K) relates heat flow to temperature gradient Q = κA·ΔT/Δx; specific heat c (J/kg·K) determines temperature rise from power: ΔT = P·t/(m·c). On the FE exam, calculate capacitance from dielectric properties, select insulators for voltage ratings, understand permeability effects on inductance, and manage thermal issues in power circuits.",
        keyPoints: [
          "Dielectric constant εᵣ increases capacitance: C = εᵣε₀A/d; higher εᵣ allows smaller physical size",
          "Dielectric strength is maximum field; exceeding it causes breakdown (permanent damage)",
          "Relative permeability μᵣ affects inductance: L = μᵣμ₀n²A/l; ferromagnetic cores greatly increase inductance",
          "Curie temperature: ferromagnetic materials lose permanent magnetism above Tc",
          "Thermal conductivity κ: Q = κA·ΔT/Δx; thermal resistance θ = ΔT/Q helps manage power dissipation"
        ],
        formulas: [
          "C = εᵣε₀A/d",
          "L = μᵣμ₀n²A/l",
          "Q = κA·ΔT/Δx",
          "ΔT = P·t/(m·c)"
        ]
      }
    ]
  },
  {
    topicId: 5,
    title: "Engineering Sciences",
    overview: "Engineering sciences apply physics principles to electrical systems: energy conversion, electromechanical forces, and measurement. This topic bridges fundamental physics and practical engineering applications essential for understanding motors, generators, and power systems.",
    sections: [
      {
        title: "Work, Energy, Power, and Efficiency",
        content: "Work W = F·d·cosθ measures force applied over distance; in electrical systems, electrical work W = ∫V·I dt (voltage times current integrated over time). Energy is capacity to do work; power P = W/t = dW/dt is the rate of energy flow. In circuits, P = V·I (watts) for any element. In resistors, power dissipates as heat P = I²R = V²/R. In reactive elements (inductors and capacitors), power oscillates—capacitors store energy in electric field (W = ½CV²), inductors store in magnetic field (W = ½LI²). Efficiency η = (useful output power)/(total input power) quantifies how much power is converted to useful form versus lost (typically as heat). A motor with 90% efficiency means 90% of electrical input becomes mechanical power and 10% becomes waste heat. Mechanical efficiency often includes friction losses. On the FE exam, you'll calculate power dissipation, find energy stored in reactive elements, and evaluate system efficiency. For electromechanical systems, understand the relationship between electrical and mechanical domains: electrical power input converts to mechanical power output (minus losses). Regenerative braking converts mechanical power back to electrical (negative power flow).",
        keyPoints: [
          "Electrical work W = ∫V·I dt; power P = V·I (instantaneous power)",
          "Resistive power dissipation: P = I²R = V²/R; always positive (energy leaves system as heat)",
          "Reactive storage: capacitor W = ½CV²; inductor W = ½LI²; energy oscillates, no net dissipation",
          "Efficiency η = Pout/Pin; includes losses from heat, friction, core losses in magnetic devices",
          "Mechanical power = torque × angular velocity: P = τω (watts); τ in N·m, ω in rad/s"
        ],
        formulas: [
          "W = F·d",
          "P = W/t",
          "P = V·I",
          "P = I²R",
          "P = V²/R",
          "Wcapacitor = ½CV²",
          "Winductor = ½LI²",
          "η = Pout/Pin",
          "P = τω"
        ]
      },
      {
        title: "Charge, Current, Voltage, and Coulomb Force",
        content: "Charge Q is measured in coulombs (C); current I = dQ/dt is the rate of charge flow (amperes = coulombs per second). Current direction is defined as positive charge flow, though electrons (negative charges) actually move opposite. Voltage V is potential difference—work per unit charge: V = dW/dQ. In circuits, voltage drives current through resistance per Ohm's law V = I·R. Coulomb's law describes the electrostatic force between two point charges: F = k·Q₁·Q₂/r² where k ≈ 8.99×10⁹ N·m²/C² and r is separation distance. Like charges repel, opposite charges attract. Electric field E = F/Q = V/d (for uniform field) represents the force per unit charge. The Lorentz force on a moving charge in a magnetic field is F = q(E + v × B), showing how charges experience forces in both electric and magnetic fields. On the FE exam, you'll relate charge and current, understand voltage drops across components, apply Coulomb's law to charge distributions, and use the Lorentz force in motional EMF or magnetic force on current-carrying conductors. Current direction conventions matter in circuit analysis—always be consistent.",
        keyPoints: [
          "Current I = dQ/dt; one ampere = one coulomb per second",
          "Voltage V = dW/dQ; potential difference drives current through resistance",
          "Ohm's law V = I·R relates voltage, current, and resistance",
          "Coulomb's law F = k·Q₁·Q₂/r²; like charges repel, opposite attract",
          "Electric field E = V/d (uniform); Lorentz force F = q(E + v × B) on moving charges"
        ],
        formulas: [
          "I = dQ/dt",
          "V = dW/dQ",
          "V = I·R",
          "F = k·Q₁·Q₂/r²",
          "E = V/d",
          "F = q(E + v × B)"
        ]
      },
      {
        title: "Electromechanical Conversion, Torque, and Lorentz Force",
        content: "Electromechanical conversion transforms electrical energy to mechanical (motors) or vice versa (generators). The key is the Lorentz force on a current-carrying conductor in a magnetic field: F = B·I·L where B is magnetic flux density (tesla), I is current (amperes), and L is conductor length perpendicular to B. For a current loop with area A and N turns in a uniform field B, the torque is τ = N·B·I·A·sinθ where θ is the angle between the loop's normal and B. Maximum torque occurs when θ = 90° (loop perpendicular to field): τ_max = N·B·I·A. This principle drives DC motors and AC machines. In a rotating conductor cutting through magnetic field lines, motional EMF is induced: ε = B·L·v where v is conductor velocity perpendicular to B. For a rotating coil, ε = NBω·A·cos(ωt) where ω is angular velocity (rad/s). Torque in rotating machines relates to current: τ ∝ I·B·A, the fundamental principle of motor operation. Power transfer between electrical and mechanical domains: Pelec = V·I = ε·I + Ploss, where ε·I is converted power and Ploss is resistive loss. On the FE exam, calculate forces on conductors, find torques on loops, and understand energy conversion in motors and generators. Remember that the Lorentz force direction follows the right-hand rule: F = I·L × B.",
        keyPoints: [
          "Lorentz force: F = B·I·L on straight conductor in uniform field; right-hand rule gives direction",
          "Torque on loop: τ = N·B·I·A·sinθ; maximum when θ = 90°",
          "Motional EMF: ε = B·L·v; generators produce voltage by moving conductor through field",
          "Motor torque: τ ∝ I·B·A; higher current, stronger field, or larger loop → more torque",
          "Power conversion P = τω (mechanical) = V·I (electrical); losses reduce conversion efficiency"
        ],
        formulas: [
          "F = B·I·L",
          "τ = N·B·I·A·sinθ",
          "τ_max = N·B·I·A",
          "ε = B·L·v",
          "ε = NBωA·cos(ωt)",
          "P = τω"
        ]
      },
      {
        title: "Sensors and Measurement Systems",
        content: "Sensors convert physical quantities into electrical signals. Common sensors include thermistors (temperature), strain gauges (stress/deformation), pressure transducers, accelerometers, and optical sensors. A transducer's performance is characterized by sensitivity (output change per unit input), accuracy (closeness to true value), precision (repeatability), and linearity (output proportional to input over range). Strain gauge resistance changes with mechanical strain: ΔR/R = GF·ε where GF is the gauge factor (≈2 for most metallic gauges) and ε is strain (dimensionless). Thermistor resistance varies nonlinearly with temperature; a common model is R(T) = R₀·exp[β(1/T - 1/T₀)] where β is the material constant. Measurement bridges extract small signal changes from sensors. The Wheatstone bridge uses four resistances: at balance, R₁/R₂ = R₃/R₄, and output voltage is zero; introducing a sensor with ΔR produces an output proportional to ΔR. Instrumentation amplifiers amplify small differential signals with high rejection of common-mode noise. Load cells combine strain gauges in a bridge to measure force. On the FE exam, understand how sensors work, recognize when to use bridges for precise measurements, and identify noise rejection techniques. Know that sensor nonlinearity and hysteresis can introduce errors that must be characterized and compensated.",
        keyPoints: [
          "Sensor sensitivity: how much output changes per unit input (V/°C, mV/strain, etc.)",
          "Strain gauge: ΔR/R = GF·ε where GF ≈ 2; measures mechanical deformation",
          "Thermistor: R(T) = R₀·exp[β(1/T - 1/T₀)]; nonlinear temperature dependence",
          "Wheatstone bridge: zero output at balance; small sensor changes produce detectable output",
          "Instrumentation amp: high input impedance, high CMRR, amplifies differential signals while rejecting noise"
        ],
        formulas: [
          "ΔR/R = GF·ε",
          "R(T) = R₀·exp[β(1/T - 1/T₀)]"
        ]
      }
    ]
  },
  {
    topicId: 6,
    title: "Circuit Analysis",
    overview: "Circuit analysis is the core of electrical engineering—the most heavily weighted FE exam topic (10%). Master Ohm's law, Kirchhoff's laws, network theorems, AC analysis, and transient response. These tools solve everything from simple resistor networks to complex AC circuits with multiple sources.",
    sections: [
      {
        title: "DC Circuit Fundamentals: Ohm's Law, KCL, KVL",
        content: "Ohm's law V = I·R relates voltage across a resistor to the current through it. Kirchhoff's current law (KCL) states the sum of currents at any node equals zero: ΣI_in = ΣI_out. Think of current as flow: what flows in must flow out. Kirchhoff's voltage law (KVL) states the sum of voltage rises around any closed loop equals zero: ΣV = 0 when traveling around the loop. Assign current directions arbitrarily; if calculated current is negative, the actual direction is opposite. For voltage, indicate polarity: a voltage rise going left-to-right is positive, right-to-left is negative. These three fundamental laws allow solving any DC circuit. Series elements share the same current: V_total = V₁ + V₂ (voltages add), and R_total = R₁ + R₂ (resistances add). Parallel elements share the same voltage: I_total = I₁ + I₂ (currents add), and 1/R_total = 1/R₁ + 1/R₂ (conductances add). The voltage divider formula V_x = V_total·(R_x/R_total) finds voltage across one resistor in a series string. Current divider I_x = I_total·(R_other/R_x) finds current through one resistor in a parallel pair. On the FE exam, use these fundamental principles to set up equations and solve for unknowns. Ohm's law, KCL, and KVL are always correct—use them as your foundation when more advanced techniques seem unclear.",
        keyPoints: [
          "Ohm's law V = I·R relates voltage, current, and resistance; power P = V·I = I²R = V²/R",
          "KCL: currents into a node = currents out of the node; ΣI = 0",
          "KVL: sum of voltage rises around any closed loop = 0; ΣV = 0",
          "Series: same current, voltages add, resistances add: R_total = R₁ + R₂",
          "Parallel: same voltage, currents add, conductances add: 1/R_total = 1/R₁ + 1/R₂",
          "Voltage divider: V_x = V·R_x/(R_x + R_y); current divider: I_x = I·R_y/(R_x + R_y)"
        ],
        formulas: [
          "V = I·R",
          "P = V·I",
          "Series: R_total = R₁ + R₂",
          "Parallel: 1/R_total = 1/R₁ + 1/R₂",
          "Voltage divider: V_x = V·R_x/(R_x + R_y)",
          "Current divider: I_x = I·R_y/(R_x + R_y)"
        ]
      },
      {
        title: "Network Theorems: Thevenin, Norton, Superposition",
        content: "Thevenin's theorem simplifies any linear two-terminal network to an equivalent circuit: a voltage source V_th in series with a resistance R_th. To find V_th, calculate open-circuit voltage (no load connected). To find R_th, deactivate sources (replace voltage sources with short circuits, current sources with open circuits) and calculate resistance seen from the terminals. The equivalent circuit is useful for analyzing load behavior: when load R_L is connected, current I = V_th/(R_th + R_L) and load voltage V_L = V_th·R_L/(R_th + R_L). Norton's theorem is the dual: any linear two-terminal network = current source I_N in parallel with resistance R_N. I_N is the short-circuit current (both terminals shorted), and R_N = R_th (same as Thevenin). The relationship: V_th = I_N·R_N. Superposition states that with multiple independent sources, the response is the sum of responses to each source acting alone. To apply: (1) deactivate all sources except one, (2) solve for the response, (3) repeat for each source, (4) add all responses algebraically. This is powerful when circuits have many sources. Maximum power transfer theorem: a load draws maximum power when R_L = R_th (matched impedance). The maximum power is P_max = V_th²/(4R_th). On the FE exam, use Thevenin/Norton to simplify complex networks, apply superposition to multiple-source circuits, and remember that matching impedance maximizes power transfer.",
        keyPoints: [
          "Thevenin equivalent: V_th (open-circuit voltage), R_th (resistance with sources deactivated)",
          "Norton equivalent: I_N (short-circuit current), R_N = R_th; related by V_th = I_N·R_th",
          "Superposition: response to multiple sources = sum of responses to each source acting alone",
          "Maximum power transfer: load R_L = source R_th (impedance matching); P_max = V_th²/(4·R_th)",
          "To deactivate: replace voltage sources with short circuits, current sources with open circuits"
        ],
        formulas: [
          "V_th = V_oc (open-circuit voltage)",
          "R_th = V_oc/I_sc (from open-circuit voltage and short-circuit current)",
          "I_N = I_sc (short-circuit current)",
          "R_N = R_th",
          "V_th = I_N·R_N",
          "P_max = V_th²/(4·R_th)"
        ]
      },
      {
        title: "AC Steady-State Analysis: Phasors and Impedance",
        content: "AC (alternating current) circuits are driven by sinusoidal sources: v(t) = Vm·cos(ωt + φ). The phasor representation simplifies analysis by converting time-domain sinusoids to frequency-domain complex numbers: V_phasor = Vm∠φ (polar form) or V_phasor = Vm·cos(φ) + j·Vm·sin(φ) (rectangular form). Frequency ω = 2πf where f is in Hz and ω is in rad/s. Impedance Z extends Ohm's law to AC: V = I·Z where both V and I are phasors. For resistors, Z_R = R (purely real). For inductors, Z_L = jωL (purely imaginary, 90° ahead of current). For capacitors, Z_C = 1/(jωC) = -j/(ωC) (purely imaginary, 90° behind current). Admittance Y = 1/Z; for complex impedance Z = R + jX, admittance Y = R/(R²+X²) - jX/(R²+X²) = G - jB where G is conductance and B is susceptance. All DC analysis techniques (KVL, KCL, Thevenin, superposition) apply to AC using phasors: V_total = V₁ + V₂ (phasor addition, considering magnitude and phase), impedances in series add, parallel impedances satisfy 1/Z_total = 1/Z₁ + 1/Z₂. On the FE exam, convert between rectangular and polar phasor forms, add phasors (rectangular is easier), and apply standard circuit theorems using impedance instead of resistance.",
        keyPoints: [
          "Sinusoid v(t) = Vm·cos(ωt + φ) ↔ phasor V = Vm∠φ; ω = 2πf rad/s",
          "Impedance: Z_R = R, Z_L = jωL, Z_C = -j/(ωC) = 1/(jωC)",
          "Rectangular vs. polar: Z = R + jX = |Z|∠θ where |Z| = √(R² + X²) and θ = arctan(X/R)",
          "Series impedances: Z_total = Z₁ + Z₂; parallel: 1/Z_total = 1/Z₁ + 1/Z₂",
          "Admittance Y = 1/Z = G + jB; useful for parallel circuits",
          "All DC circuit laws apply: KVL, KCL, Thevenin, Norton, superposition—use phasors instead of scalars"
        ],
        formulas: [
          "v(t) = Vm·cos(ωt + φ) ↔ V = Vm∠φ",
          "ω = 2πf",
          "Z_L = jωL",
          "Z_C = 1/(jωC) = -j/(ωC)",
          "Z = R + jX = |Z|∠θ",
          "|Z| = √(R² + X²)",
          "θ = arctan(X/R)"
        ]
      },
      {
        title: "AC Power: Real, Reactive, Apparent, and Power Factor",
        content: "AC power has three components. Real power P (watts) is the average power that does useful work: P = |V|·|I|·cosφ where φ is the phase angle between voltage and current, and cosφ is the power factor (PF). Real power dissipates in resistors; reactive power Q (VAR) oscillates in inductors and capacitors without net energy transfer: Q = |V|·|I|·sinφ. Apparent power S (VA) is the product of RMS voltage and current magnitudes: S = |V|·|I| = √(P² + Q²). Power triangle relates these: P = S·cosφ (horizontal leg), Q = S·sinφ (vertical leg), S = √(P² + Q²) (hypotenuse). Power factor cosφ ranges from 0 to 1; cosφ = 1 means purely resistive (Q = 0), cosφ < 1 means reactive (Q ≠ 0). Lagging PF (current lags voltage) indicates inductive load; leading PF (current leads voltage) indicates capacitive load. For a single load with impedance Z = R + jX: P = I²·R and Q = I²·X. Power factor correction adds capacitors in parallel with inductive loads to increase PF and reduce apparent power drawn from the utility. On the FE exam, calculate power from phasor values, understand the power triangle, identify when power factor correction is beneficial, and recognize that utilities charge for apparent power while customers benefit from real power.",
        keyPoints: [
          "Real power P = |V|·|I|·cosφ (watts); dissipated in resistance",
          "Reactive power Q = |V|·|I|·sinφ (VAR); oscillates in L and C, no net energy transfer",
          "Apparent power S = |V|·|I| = √(P² + Q²) (VA); what utility charges for",
          "Power factor cosφ = P/S; ranges from 0 to 1; higher is better (less reactive)",
          "Power factor correction: add capacitor in parallel to increase PF; reduces S without changing P",
          "Power triangle: P (horizontal), Q (vertical), S (hypotenuse); Pythagorean relationship"
        ],
        formulas: [
          "P = |V|·|I|·cosφ",
          "Q = |V|·|I|·sinφ",
          "S = |V|·|I|",
          "S = √(P² + Q²)",
          "cosφ = P/S",
          "P = I²·R",
          "Q = I²·X"
        ]
      },
      {
        title: "Resonance and Frequency Response",
        content: "Resonance occurs in RLC circuits when inductive and capacitive reactances equal in magnitude: ωL = 1/(ωC), giving resonant frequency ω₀ = 1/√(LC) rad/s or f₀ = 1/(2π√(LC)) Hz. At resonance, impedance is minimum (Z = R), current is maximum, and voltage across L and C can exceed source voltage (voltage magnification Q factor times). Quality factor Q = ω₀L/R = 1/(ω₀RC) = √(L/C)/R measures how \"sharp\" the resonance is. High Q means narrow bandwidth (selective), low Q means broad bandwidth. Bandwidth BW = f₀/Q is the frequency range where power is above half-maximum. Series RLC: impedance Z = R + j(ωL - 1/(ωC)); at resonance Z = R and current I = V/R is maximum. Parallel RLC: admittance Y = 1/R + j(ωC - 1/(ωL)); at resonance Y = 1/R and impedance Z = R is maximum. Frequency response plots (Bode diagrams) show magnitude and phase vs. frequency: at resonance, phase angle is zero; below resonance inductive behavior dominates (lagging), above resonance capacitive behavior dominates (leading). On the FE exam, find resonant frequency, calculate bandwidth and Q factor, and identify series vs. parallel resonance behavior (series minimizes impedance, parallel maximizes impedance).",
        keyPoints: [
          "Resonant frequency: ω₀ = 1/√(LC) rad/s; f₀ = 1/(2π√(LC)) Hz",
          "At resonance: X_L = X_C, impedance is minimum (series) or maximum (parallel)",
          "Quality factor Q = ω₀L/R; higher Q means sharper resonance peak",
          "Bandwidth BW = f₀/Q; frequency range where power > 0.5·P_max",
          "Series RLC: Z_min = R at resonance; parallel RLC: Z_max = R at resonance"
        ],
        formulas: [
          "ω₀ = 1/√(LC)",
          "f₀ = 1/(2π√(LC))",
          "Q = ω₀L/R = 1/(ω₀RC)",
          "BW = f₀/Q",
          "X_L = ωL",
          "X_C = 1/(ωC)"
        ]
      },
      {
        title: "Three-Phase Circuits and Power",
        content: "Three-phase AC systems use three sinusoidal voltages 120° apart: V_a = Vm·cos(ωt), V_b = Vm·cos(ωt - 120°), V_c = Vm·cos(ωt - 240°). Balanced three-phase means equal voltages with 120° phase separation. Line voltage (between lines) V_L = √3·V_ph where V_ph is phase voltage. Line current equals phase current in a wye connection, but for a delta connection, V_L = V_ph and I_L = √3·I_ph. Power in three-phase is constant (not pulsating like single-phase): P = √3·V_L·I_L·cosφ = 3·V_ph·I_ph·cosφ. Reactive power Q = √3·V_L·I_L·sinφ. Per-phase analysis is convenient for balanced circuits: treat as three independent single-phase circuits, each delivering P/3 power. The fourth wire (neutral) in a wye connection carries only unbalanced current—in a balanced system, neutral current is zero. Delta connections are preferred for transmission (no neutral needed), wye for distribution (neutral available for single-phase loads). On the FE exam, convert between line and phase voltages/currents, calculate three-phase power, identify delta vs. wye connections, and use per-phase analysis for balanced systems.",
        keyPoints: [
          "Three-phase voltages: 120° apart; balanced means equal magnitudes",
          "Wye (Y): V_L = √3·V_ph, I_L = I_ph; Delta (Δ): V_L = V_ph, I_L = √3·I_ph",
          "Three-phase power (constant): P = √3·V_L·I_L·cosφ; single-phase power pulsates",
          "Per-phase analysis: solve one phase (with impedances), multiply power by 3",
          "Delta-wye conversion: Z_delta = 3·Z_wye (or vice versa) for equivalent impedances",
          "Neutral current in wye is zero for balanced load; delta has no neutral"
        ],
        formulas: [
          "V_L = √3·V_ph (wye)",
          "I_L = √3·I_ph (delta)",
          "P = √3·V_L·I_L·cosφ",
          "Q = √3·V_L·I_L·sinφ"
        ]
      },
      {
        title: "Transient Analysis: RC, RL, and RLC Circuits",
        content: "Transient response describes how circuits respond when switched or when sources change abruptly. For a first-order RC circuit with capacitor initially uncharged, closed at t=0 with DC source V: v_C(t) = V(1 - e^(-t/τ)) where τ = RC is the time constant. After 5τ, the capacitor is 99% charged. For a discharging capacitor initially at voltage V₀: v_C(t) = V₀·e^(-t/τ). Current during charging: i(t) = (V/R)·e^(-t/τ) (starts at V/R, decays to zero). For RL circuits: i_L(t) = (V/R)(1 - e^(-t/τ)) where τ = L/R. The inductor resists current change, so initial current is zero and steady-state current is V/R. RLC transients are described by damping: underdamped (ζ < 1) oscillates; critically damped (ζ = 1) approaches steady-state fastest without overshoot; overdamped (ζ > 1) approaches slowly without oscillation. Damping ratio ζ = R/(2√(L/C)) = R·√(C/L)/2. For series RLC: natural frequency ωₙ = 1/√(LC). Initial conditions matter: capacitors maintain voltage (i_C cannot change instantly), inductors maintain current (v_L cannot change instantly). On the FE exam, apply initial and final value calculations, use time constants to estimate transient duration, and solve first-order ODE for circuit variables.",
        keyPoints: [
          "Time constant τ = RC (capacitor) or τ = L/R (inductor); transient settles in ~5τ",
          "Capacitor: opposes voltage change; i_C = C·dv_C/dt; voltage cannot change instantly",
          "Inductor: opposes current change; v_L = L·di_L/dt; current cannot change instantly",
          "Underdamped (ζ < 1): oscillates; critically damped (ζ = 1): fastest no-overshoot; overdamped (ζ > 1): slow",
          "Damping ratio ζ = R/(2√(L/C)); natural frequency ωₙ = 1/√(LC)"
        ],
        formulas: [
          "τ = RC (capacitor) or τ = L/R (inductor)",
          "v_C(t) = V(1 - e^(-t/τ)) (charging)",
          "v_C(t) = V₀·e^(-t/τ) (discharging)",
          "i(t) = (V/R)·e^(-t/τ) (RC discharge or RL)",
          "ζ = R/(2√(L/C))",
          "ωₙ = 1/√(LC)"
        ]
      }
    ]
  },
{
    topicId: 2,
    title: "Ethics & Professional Practice",
    overview: "Professional ethics and conduct standards essential for licensed engineers, covering NCEES and NSPE guidelines, licensure requirements, and ethical decision-making frameworks.",
    sections: [
      {
        title: "NCEES Model Rules & NSPE Code of Ethics",
        content: "The NCEES Model Rules and NSPE Code of Ethics establish the fundamental obligations of professional engineers. These codes prioritize public safety, health, and welfare above all other considerations—a principle that must guide every engineering decision. Engineers must maintain competence in their field, disclose conflicts of interest transparently, and refuse assignments outside their expertise. The codes explicitly address whistle-blowing, protecting engineers who report safety violations or unethical conduct from retaliation. Conflicts of interest arise when personal gain might compromise professional judgment; engineers must disclose these openly to clients and employers. When a project conflicts with public safety, the engineer's primary obligation is to the public, even if this creates professional difficulties. Real exam scenarios often present dilemmas where profit, schedule, or client pressure conflicts with safety—the correct answer always prioritizes public welfare.\n\nConflicts of interest extend beyond direct financial compensation to include family relationships, prior business dealings, and competing clients. An engineer must not accept work where they cannot maintain objectivity or where a family member might benefit unfairly. Whistle-blowing protection acknowledges that engineers may need to report illegal or dangerous practices to authorities or the public; the codes protect them from dismissal or retaliation for such reports. However, engineers should typically work through proper channels first before going public. The codes also address professional competence: accepting work beyond one's knowledge is unethical, even if financially attractive. Continuing professional development is not just encouraged but ethically required to maintain current knowledge in a rapidly evolving field.",
        keyPoints: [
          "Public safety and welfare are always the highest priority, superseding profit and client preferences",
          "Engineers must disclose conflicts of interest and refuse assignments outside their expertise",
          "Whistle-blowing is protected; reporting safety violations or illegal conduct is ethical and legally protected",
          "Continuing education and maintaining professional competence are ethical obligations, not optional"
        ],
        formulas: []
      },
      {
        title: "Professional Licensure & FE Exam Role",
        content: "The Professional Engineering (PE) license represents a commitment to public protection through demonstrated competence and adherence to ethical standards. The FE (Fundamentals of Engineering) exam is the first step in licensure, typically completed early in an engineer's career. After passing the FE exam and gaining required work experience (typically 4 years under a PE), engineers become eligible to take the PE exam. Different states have slightly different requirements, but all require FE passage as a prerequisite. Comity refers to the reciprocal recognition of PE licenses across state boundaries; an engineer licensed in one state can often become licensed in another without retesting, though some states may require additional forms or documentation. The FE exam itself is not a PE license but rather proof of fundamental competence in engineering principles. Many employers and positions now require FE passage even for positions that don't require PE licensure, making it a critical career credential.\n\nContinuing education (CE) requirements vary by state and jurisdiction but are essential for maintaining a PE license. Most states require 15-36 professional development hours annually, ensuring engineers remain current with evolving codes, technologies, and best practices. Failure to meet CE requirements can result in license suspension or revocation. The FE exam covers breadth across many engineering disciplines, preparing engineers for entry-level practice and future specialization. Understanding the role of the FE exam—as a qualification check, not a license itself—helps explain why exam breadth covers so many topics. Professional development in your chosen field continues throughout your career, with specialization deepening after initial FE qualification.",
        keyPoints: [
          "FE exam passage is prerequisite for PE licensure but is not itself a PE license; a PE license requires additional work experience and examination",
          "Comity allows PE licensure reciprocity across states with generally minimal additional requirements",
          "Continuing education requirements (typically 15-36 hours annually) are mandatory for maintaining PE licensure and keeping knowledge current",
          "State boards of engineering examine may have specific rules; always verify with your state board"
        ],
        formulas: []
      },
      {
        title: "Ethical Decision Making & Public Welfare Priority",
        content: "Ethical decision-making in engineering requires systematic frameworks that balance competing interests while maintaining public safety as the paramount concern. When facing an ethical dilemma, engineers should first identify stakeholders (public, client, employer, colleagues, environment), then evaluate options against professional codes and legal requirements. The framework typically involves: (1) understanding the facts completely, (2) identifying the ethical issue and relevant principles, (3) considering alternatives without eliminating options prematurely, and (4) deciding based on code provisions and public welfare priority. Many exam questions present scenarios with incomplete information—the ethical approach requires seeking clarification before proceeding, not making assumptions. When public safety directly conflicts with client wishes or profit margins, engineers must prioritize safety even at personal professional cost. This may mean refusing a contract, reporting concerns to authorities, or using internal escalation procedures before external reporting.\n\nCommon ethical dilemmas in engineering practice include: cost-cutting that compromises quality, pressure to deliver unsafe designs, misrepresentation of qualifications, and conflicts between accurate reporting and job security. In each case, the professional codes provide guidance: never compromise safety, maintain honesty in communications, and act in the public interest. Some dilemmas appear grey but resolve clearly when public safety enters consideration. For example, an inexpensive material choice that slightly increases failure risk in non-critical applications might be acceptable; the same choice in safety-critical systems is never acceptable. Scenario-based exam questions test this prioritization: you must recognize when public welfare is at stake and act accordingly. Documentation is critical—maintain records of your concerns, recommendations, and actions to protect yourself professionally. Finally, recognize that ethical practice sometimes costs money or career advancement in the short term, but protects your professional reputation and the public long-term.",
        keyPoints: [
          "Systematic frameworks for ethical decisions: identify stakeholders, understand facts completely, evaluate against professional codes, prioritize public welfare",
          "Public safety always supersedes profit, schedule, and client preferences—this is not negotiable",
          "When conflicts arise, use proper escalation channels within your organization before external reporting, unless public safety is imminent",
          "Maintain documentation of ethical concerns and your recommendations to establish a clear professional record"
        ],
        formulas: []
      }
    ]
  },
  {
    topicId: 3,
    title: "Engineering Economics",
    overview: "Time value of money, investment analysis, rate of return calculations, and depreciation methods essential for comparing project alternatives and making financial decisions.",
    sections: [
      {
        title: "Time Value of Money & Financial Factors",
        content: "The time value of money (TVM) principle states that a dollar today is worth more than a dollar in the future due to earning potential and inflation. This fundamental concept underlies all engineering economic analysis. The six standard cash flow factors enable conversion between different payment patterns and time points. Present Worth (PW) converts all future cash flows to today's value using the discount rate (interest rate). Future Worth (FW) converts cash flows to a single future time point. Annual Worth (AW) calculates equivalent uniform annual payments representing the same economic value. These three are related: if PW is positive at a given interest rate, the investment is economically justified; AW spreads this over the analysis period. The factors use the interest rate i and number of periods n: F/P (future given present) multiplies present by (1+i)^n; P/F is the reciprocal. P/A (present worth of annuity) and A/P (annuity given present) convert between lump sums and uniform annual payments. A/F (annuity given future sum) and F/A (future worth of annuity) work with future values. These six factors cover all standard conversions; understanding their relationships is crucial.\n\nExam problems require identifying the correct factor and applying it accurately. For example, if you save $1000 annually for 10 years at 5% interest, use F/A to find the future worth: FW = $1000 × [(1.05)^10 - 1]/0.05 ≈ $12,578. Conversely, if you need $12,578 in 10 years, A/F tells you the annual payment required. Present worth analysis is most common in engineering: compare projects by computing PW of all costs and benefits; the project with highest PW is best. When comparing projects of different lengths, annualized cost or a common study period equalizes comparison. Discount rate selection is critical—typically the company's minimum acceptable rate of return (MARR) or the cost of capital. Problems may assume 6-10% but sometimes specify the rate. When analyzing after-tax cash flows, use the after-tax interest rate. Always identify what the question asks for (PW, FW, AW) and which factor(s) apply—careless factor selection is a common exam mistake.",
        keyPoints: [
          "Six standard factors convert between present value, future value, and uniform annual payments; understand their relationships and when each applies",
          "Present worth (PW) is the most common analysis method: positive PW means the investment exceeds the discount rate and is justified",
          "Annual worth (AW) is useful for comparing projects of different lengths; equivalent annual cost comparisons normalize across time periods",
          "Discount rate (MARR) selection significantly impacts results; typically use company cost of capital or minimum required return"
        ],
        formulas: [
          "F/P factor: F = P(1 + i)^n or F = P[F/P, i%, n]",
          "P/F factor: P = F/(1 + i)^n or P = F[P/F, i%, n]",
          "P/A factor: P = A{[(1 + i)^n - 1]/[i(1 + i)^n]} or P = A[P/A, i%, n]",
          "A/P factor: A = P{i(1 + i)^n/[(1 + i)^n - 1]} or A = P[A/P, i%, n]",
          "F/A factor: F = A{[(1 + i)^n - 1]/i} or F = A[F/A, i%, n]",
          "A/F factor: A = F{i/[(1 + i)^n - 1]} or A = F[A/F, i%, n]"
        ]
      },
      {
        title: "Rate of Return & Investment Decision Making",
        content: "Internal Rate of Return (IRR) is the discount rate that makes present worth equal zero; equivalently, it's the rate at which an investment breaks even. Projects with IRR exceeding the MARR are economically justified. IRR is calculated by solving PW(i) = 0, which typically requires iteration or financial calculators since it's a polynomial equation. The advantage of IRR is that it's a percentage return, intuitive to compare across projects—a 15% IRR is better than a 12% IRR if MARR is 10%. However, IRR has limitations: multiple IRRs can exist for non-conventional cash flows (costs followed by benefits followed by costs), and it doesn't scale with project size (a 20% IRR on $1000 differs from 20% on $1 million in absolute dollars). Net Present Value (NPV) calculates the absolute value added: NPV = sum of all PW(benefits) - PW(costs). Positive NPV means the project is worth undertaking. Unlike IRR, NPV is directly comparable across different project sizes.\n\nBenefit-Cost Ratio (B/C) divides present worth of benefits by present worth of costs; ratios greater than 1.0 indicate justified investments. This method is popular in public sector projects where benefits and costs are distinct (e.g., public infrastructure). Incremental analysis compares two projects by evaluating the difference between them; if Project A has higher IRR but Project B has higher NPV, incremental analysis resolves the apparent contradiction. Breakeven analysis finds the value (price, volume, interest rate) where profit equals zero or two alternatives have equal cost. For example, the breakeven point might be the production volume where fixed costs are recovered, or the interest rate where NPV = 0 (which is the IRR). Decision rules: use NPV when comparing projects of different sizes or life spans; use IRR when comparing similar projects and scaling doesn't matter; use B/C for public sector analysis. Always verify that you're comparing on the same basis—same time horizon, same discount rate, mutually exclusive vs. independent projects. Incremental IRR and incremental analysis are required when ranking multiple alternatives.",
        keyPoints: [
          "IRR is the break-even discount rate (where NPV = 0); projects are justified if IRR > MARR, but use NPV for projects differing in scale or life",
          "NPV directly measures value added in dollars; positive NPV indicates a justified investment and is preferred for comparing projects of different sizes",
          "Benefit-Cost Ratio (B/C > 1) justifies projects and is standard in public sector analysis; easily combines multiple benefits and costs",
          "Breakeven analysis finds critical values (price, volume, rate) where projects transition from profitable to unprofitable or alternatives achieve equality"
        ],
        formulas: [
          "IRR: solve PW(i) = 0 where i is the unknown internal rate of return",
          "NPV = Σ(Benefits in PW) - Σ(Costs in PW) = Σ CF_t / (1+i)^t",
          "Benefit-Cost Ratio: B/C = PW(Benefits) / PW(Costs), justified if B/C ≥ 1.0",
          "Incremental analysis: compare two projects by evaluating differences in cash flows and returns"
        ]
      },
      {
        title: "Depreciation Methods & Book Value",
        content: "Depreciation is the systematic allocation of an asset's cost over its useful life, important for tax calculations and financial reporting. Straight-line depreciation divides the total depreciable base (cost minus salvage value) evenly across the useful life: Annual Depreciation = (Cost - Salvage Value) / Useful Life. This method is simple, commonly used, and produces a constant deduction each year. Book value (BV) is the asset's value on the balance sheet: BV = Original Cost - Accumulated Depreciation. Book value decreases linearly with straight-line depreciation. For example, a $10,000 asset with 10-year life and no salvage depreciates $1,000 annually; after 5 years, BV = $10,000 - $5,000 = $5,000. Market value is what the asset could actually sell for, which diverges from book value as the asset ages. An old but well-maintained building might have low book value but high market value; conversely, rapidly obsolete equipment may have high book value but low market value due to technology changes.\n\nMACRS (Modified Accelerated Cost Recovery System) is the U.S. tax depreciation method, which allows faster write-offs than straight-line, reducing early-year taxes. MACRS ignores salvage value and uses predetermined recovery periods (e.g., 5-year property, 7-year property, 39-year property for real estate) with accelerated schedules. The advantage of accelerated depreciation is time value of money: deducting costs earlier reduces taxes earlier, improving cash flow. However, for financial reporting and economic analysis, straight-line is more commonly used in engineering studies unless the problem specifically requests tax calculations using MACRS. Understanding the difference between book value and market value is crucial: a company's financial statements show book value, but actual asset worth may differ significantly. This distinction affects business valuations, sale decisions, and lease vs. buy analyses. In engineering economic analysis, use book value when analyzing accounting impacts and market value when considering actual asset replacement or sale decisions.",
        keyPoints: [
          "Straight-line depreciation: (Cost - Salvage) / Useful Life; produces constant annual deduction and linear book value decline",
          "Book value = Cost - Accumulated Depreciation (accounting value); differs from market value (actual resale value)",
          "MACRS is U.S. tax depreciation allowing faster write-offs than straight-line; use for after-tax economic analysis and tax planning",
          "Accelerated depreciation (MACRS) improves cash flow by deferring taxes; straight-line is simpler and more commonly used in general economic studies"
        ],
        formulas: [
          "Straight-line annual depreciation: D = (P - S) / n, where P = cost, S = salvage, n = useful life",
          "Book value: BV = P - Accumulated Depreciation = P - D × years elapsed",
          "MACRS uses IRS-provided recovery schedules; consult current tax tables for specific recovery periods and percentages"
        ]
      }
    ]
  },
  {
    topicId: 4,
    title: "Properties of Electrical Materials",
    overview: "Fundamental material properties determining electrical behavior: conductivity, semiconductor band structure, dielectric characteristics, and magnetic responses essential for component selection and device design.",
    sections: [
      {
        title: "Conductors & Resistivity",
        content: "Conductors like copper and aluminum have abundant free electrons enabling charge flow; their conductivity depends on material composition, temperature, and geometric dimensions. Resistivity (ρ) is an intrinsic material property measuring resistance per unit length and cross-sectional area: R = ρL/A, where L is length, A is cross-sectional area, and ρ is resistivity in ohm-meters. Copper has low resistivity (~1.7 × 10^-8 Ω·m) making it ideal for wiring; aluminum has slightly higher resistivity (~2.8 × 10^-8 Ω·m) but lower density and cost. Temperature affects resistivity significantly; most conductors increase resistance with temperature following: ρ(T) = ρ₀[1 + α(T - T₀)], where α is the temperature coefficient of resistivity and T is absolute or relative temperature depending on convention. Copper has α ≈ 0.00393 per °C, meaning 0.4% resistance increase per degree Celsius. This relationship is approximately linear for small temperature changes and is critical in applications experiencing thermal variations: power dissipation in conductors generates heat, increasing resistance, which increases dissipation further in a potentially positive feedback loop.\n\nWire gauges follow standardized systems (AWG in North America) where smaller gauge numbers indicate larger cross-sectional areas and lower resistance. AWG 12 wire (commonly used in household wiring) has ~2.05 mm² cross-section with resistance ~5.2 mΩ per meter. Larger gauge numbers (thinner wire) increase resistivity: AWG 20 is about 0.5 mm² with ~10 mΩ/m. Selecting proper wire gauge requires balancing cost, voltage drop, and current capacity. Voltage drop V = IR limits how far current can travel at a given gauge before excessive loss; power distribution systems use thicker wire for longer distances. Conductivity σ is the reciprocal of resistivity: σ = 1/ρ, measured in siemens per meter (S/m). High-quality electrical connections are achieved by clean surface contact and adequate pressure; oxidation on conductor surfaces dramatically increases contact resistance. Understanding these principles enables proper cable selection, thermal management, and failure analysis in electrical systems.",
        keyPoints: [
          "Resistivity (ρ) is an intrinsic material property; resistance R = ρL/A depends on geometry and material composition",
          "Temperature coefficient α indicates resistance change with temperature: typical conductors increase 0.3-0.4% per °C, critical for thermal environments",
          "Wire gauge (AWG) inversely relates to cross-sectional area; proper gauge selection balances cost, voltage drop, and current capacity",
          "Conductivity σ = 1/ρ; clean conductor surfaces and good contact pressure minimize resistance and prevent overheating"
        ],
        formulas: [
          "Resistance: R = ρL/A",
          "Temperature dependence: ρ(T) = ρ₀[1 + α(T - T₀)]",
          "Conductivity: σ = 1/ρ (units: S/m or siemens per meter)",
          "Voltage drop: V = IR; for wiring, V = I × ρ × L/A"
        ]
      },
      {
        title: "Semiconductors: Band Structure & Doping",
        content: "Semiconductors like silicon and germanium have conductivity between conductors and insulators, with properties controlled by doping (adding impurities). Silicon in pure form has a band gap of ~1.1 eV at room temperature, meaning thermal energy can excite electrons from the valence band to the conduction band, creating mobile charge carriers. Intrinsic semiconductors have equal concentrations of electrons (negative carriers) and holes (positive carriers); adding dopants shifts this balance. N-type semiconductors are doped with donors (phosphorus, arsenic) which have 5 valence electrons in silicon's tetrahedral crystal structure; the fifth electron is loosely bound and contributes to conduction. N-type increases electron concentration and allows current flow primarily through electrons. P-type semiconductors are doped with acceptors (boron, aluminum) which have 3 valence electrons, creating vacancies (holes) that migrate through the crystal as positive charge carriers. Doping levels are typically 10^15 to 10^20 dopants per cm³, dramatically changing conductivity compared to intrinsic silicon (10^10 carriers/cm³).\n\nCarrier concentration n (electrons) and p (holes) determine semiconductor properties. The intrinsic carrier concentration n_i ≈ 1.5 × 10^10 cm^-3 for silicon at 300K. For n-type with N_D donors: n ≈ N_D and p = n_i²/N_D. For p-type with N_A acceptors: p ≈ N_A and n = n_i²/N_A. The product n × p = n_i² is constant at a given temperature, even with doping. Band gap decreases with temperature, affecting semiconductor characteristics; smaller band gap materials (germanium, gallium arsenide) operate at higher temperatures but have higher leakage currents. Drift and diffusion are the two mechanisms of charge transport: drift occurs when an electric field accelerates carriers; diffusion occurs due to concentration gradients. At junction boundaries and under illumination, light-generated carriers are critical. Understanding band structure explains diode forward bias (narrowing the depletion region), reverse bias (blocking current), and temperature effects on device behavior. Semiconductors enable transistors, diodes, and integrated circuits—the foundation of modern electronics.",
        keyPoints: [
          "Band gap energy determines carrier excitation; intrinsic silicon has ~1.1 eV gap, requiring thermal or photon energy to generate carriers",
          "N-type (donor doping) increases electrons; p-type (acceptor doping) increases holes; doping concentration controls conductivity over many orders of magnitude",
          "Carrier concentration n × p = n_i² is constant at fixed temperature; doping shifts the balance between electrons and holes dramatically",
          "Drift and diffusion transport charges; junction behavior (forward/reverse bias) and device performance depend on band alignment and depletion region width"
        ],
        formulas: [
          "Band gap: E_g determines intrinsic carrier concentration n_i (for Si: n_i ≈ 1.5 × 10^10 cm^-3 at 300K)",
          "N-type: n ≈ N_D, p = n_i²/N_D",
          "P-type: p ≈ N_A, n = n_i²/N_A",
          "Mass action law: n × p = n_i² (constant at fixed temperature)",
          "Conductivity: σ = q(n × μ_n + p × μ_p), where μ_n and μ_p are electron and hole mobilities"
        ]
      },
      {
        title: "Dielectrics & Insulators",
        content: "Dielectric materials are insulators that can be polarized by electric fields, storing electrical energy and enabling capacitors. Dielectric constant κ (relative permittivity) measures how much a material can be polarized relative to vacuum: ε = κε₀, where ε₀ = 8.854 × 10^-12 F/m is the permittivity of free space. Common dielectrics: vacuum (κ = 1), air (κ ≈ 1.0006), mica (κ = 3-7), ceramic (κ = 100-10000), and water (κ = 80). Higher κ allows capacitors to store more energy for the same volume and voltage, which is why ceramic or electrolytic capacitors are much smaller than air-gap capacitors. Capacitance C = κε₀A/d, where A is plate area and d is separation; high-κ materials enable miniaturization. Breakdown voltage is the electric field strength at which insulation fails and current suddenly increases (electrical breakdown). Breakdown field strength varies: air breaks down around 3 MV/m, mica 150 MV/m, ceramics 100-300 MV/m. Exceeding breakdown voltage causes permanent damage or arc formation. Peak voltage and transient surges must be controlled to prevent breakdown; system design includes safety margins ensuring operating fields are 30-50% of breakdown limits.\n\nPolarization mechanisms determine dielectric response: electronic polarization (electron cloud shifting relative to nucleus) occurs at optical frequencies; ionic polarization (ions shifting) occurs at infrared frequencies; and dipolar/orientational polarization (polar molecules rotating) occurs at lower frequencies. Each mechanism contributes differently at various frequencies, causing frequency-dependent permittivity—important for ac circuit design. Dielectric loss (tan δ) represents energy dissipated as heat in the dielectric; low-loss materials minimize heating and are preferred for high-frequency applications. Insulation resistance between conductors determines leakage current; good insulators (>10^12 Ω for reasonable areas) prevent significant current flow at operating voltages. Material selection involves tradeoffs: high-κ materials may have high loss or lower breakdown voltages; organic polymers are flexible but may have lower breakdown fields than ceramics; operating temperature affects all properties—materials must maintain insulation at maximum operating temperature plus safety margin. Moisture absorption in some insulators degrades performance, requiring environmental protection in humid applications.",
        keyPoints: [
          "Dielectric constant κ determines energy storage capacity (C = κε₀A/d); higher κ enables smaller capacitors but may increase loss",
          "Breakdown voltage represents maximum safe field strength; design margins (30-50% of breakdown) prevent failure under transients and thermal stress",
          "Frequency-dependent permittivity reflects different polarization mechanisms; high-frequency applications require low-loss materials to prevent overheating",
          "Dielectric loss (tan δ) and insulation resistance must be considered; moisture and temperature degrade insulation properties"
        ],
        formulas: [
          "Capacitance: C = κε₀A/d, where ε₀ = 8.854 × 10^-12 F/m",
          "Electric field: E = V/d; breakdown occurs at field strength E_breakdown (material dependent)",
          "Energy storage: U = (1/2)CV² = (1/2)κε₀(A/d)V²",
          "Dielectric loss: P_loss ≈ VI × tan(δ) or related to loss tangent and frequency"
        ]
      },
      {
        title: "Magnetic Materials & Magnetization",
        content: "Magnetic materials respond to applied magnetic fields; their behavior is characterized by permeability μ, magnetic flux density B, and magnetization M. Permeability μ = μ_r × μ₀, where μ₀ = 4π × 10^-7 H/m is the permeability of free space and μ_r is relative permeability. Materials are classified as diamagnetic (μ_r < 1), paramagnetic (μ_r slightly > 1), or ferromagnetic (μ_r >> 1, typically 100-5000). Diamagnetic materials like copper and bismuth slightly oppose applied fields; paramagnetic materials like aluminum have unpaired electrons creating weak magnetization aligned with the field. Ferromagnetic materials (iron, nickel, cobalt) have unpaired electrons and exchange interactions causing spontaneous alignment—they strongly amplify applied fields and retain magnetization after field removal. The B-H curve (magnetization curve) plots magnetic flux density B versus applied field H; starting from zero, initial permeability is steep; continued increase in H produces saturation where B levels off. Maximum permeability occurs near the origin where the curve is steepest.\n\nHysteresis is the lag in magnetization when the applied field changes direction. Starting at saturation B_s and decreasing H to zero leaves residual magnetization (remanence) B_r. Reversing H requires a coercive field H_c to reduce B to zero. Further reversing produces negative saturation, then returning to positive creates a closed loop—the hysteresis loop. Area enclosed by the loop represents energy dissipated as heat per cycle (hysteresis loss). Soft magnetic materials (iron-silicon, soft iron) have narrow hysteresis loops, low coercivity, and high permeability—ideal for transformer cores where frequent magnetization changes occur. Hard magnetic materials (permanent magnet steels, rare-earth magnets) have large hysteresis loops, high coercivity, and high remanence—ideal for permanent magnets. Transformer core losses include hysteresis loss (loop area) and eddy current loss (circulating currents in conductors); lamination (thin stacked sheets) reduces eddy currents by limiting current paths. Temperature affects magnetization: Curie temperature T_c is where ferromagnetic materials lose spontaneous magnetization and become paramagnetic (for iron, T_c ≈ 770°C). Above T_c, the material becomes paramagnetic only. Understanding magnetic properties is essential for transformer design, motor/generator efficiency, and magnetic circuit analysis.",
        keyPoints: [
          "Permeability μ = μ_r × μ₀ determines field amplification; ferromagnetic materials have μ_r >> 1, enabling efficient magnetic circuits",
          "B-H curves show magnetization behavior; saturation, remanence, and coercivity characterize material response to applied fields",
          "Hysteresis loop area represents energy loss per cycle; soft magnetic materials have narrow loops (low loss), hard materials have wide loops (high remanence)",
          "Curie temperature marks transition to paramagnetism; transformer losses include hysteresis and eddy currents, controlled via lamination and material selection"
        ],
        formulas: [
          "Magnetic flux density: B = μ₀(H + M) = μ₀μ_r H",
          "Magnetization: M = χ_m H, where χ_m is magnetic susceptibility",
          "Hysteresis loss: W_h = (area of loop) × (frequency), units J/m³ per cycle",
          "Eddy current loss: P_e ∝ (B_m)² × (f)² × (t)² / ρ, where t is lamination thickness, f is frequency"
        ]
      }
    ]
  },
  {
    topicId: 5,
    title: "Engineering Sciences",
    overview: "Fundamental physics principles: work, energy, power conservation, electric charge fundamentals, and electromechanical energy conversion essential for understanding electrical and mechanical systems.",
    sections: [
      {
        title: "Work, Energy & Power",
        content: "Work is the transfer of energy through force applied over distance: W = F × d × cos(θ), where θ is the angle between force and displacement. In electrical systems, work W = P × t (power × time) or W = V × Q (voltage × charge), measured in joules. Energy is the capacity to perform work; mechanical energy exists as kinetic (KE = 1/2 m v²) and potential (PE = mgh or stored spring energy = 1/2 k x²). Electrical energy is E = V × I × t or E = P × t. Power is the rate of energy transfer: P = W/t = F × v (mechanical) or P = V × I (electrical), measured in watts. Conservation of energy states that total energy in an isolated system remains constant; energy transforms between forms (kinetic to potential, electrical to mechanical, heat) but is never created or destroyed. In real systems, inefficiencies convert some useful energy into waste heat due to friction, air resistance, electrical resistance, and other dissipative mechanisms. Efficiency η = (useful energy out) / (total energy in) or η = (useful power out) / (total power in). Typical motor efficiencies range 80-95%; transformer efficiencies 95-99%; mechanical systems 50-90% depending on design and condition.\n\nExam problems frequently require energy balance equations: energy in = energy out + losses. For example, electrical power input to a motor P_in = V × I must equal mechanical power output P_out plus losses (copper losses, core losses, friction). Electrical power: P = V × I = I²R = V²/R (for resistive loads). Power conservation in ideal transformers: V_p × I_p = V_s × I_s (ignoring losses). In AC systems, apparent power S = V × I (in volt-amperes), real power P = V × I × cos(φ) (in watts), reactive power Q = V × I × sin(φ) (in volt-amperes reactive). Understanding power factor (cos φ) is critical: at unity power factor (φ = 0°), real power equals apparent power; at lower power factors, much of the current (and transformer capacity) is wasted in reactive power. Efficiency improvements often involve reducing losses: motor efficiency improves with proper loading (motors run most efficiently near full load, not lightly loaded); transformer efficiency improves with higher frequency (fewer losses); transmission efficiency improves with higher voltage (lower current means lower I²R losses).",
        keyPoints: [
          "Work W = F·d (mechanical), W = V·Q (electrical); power P = W/t = V·I; energy is conserved but inefficiencies convert useful output to heat",
          "Efficiency η = (useful output) / (total input); real systems always have efficiency < 100% due to resistance, friction, and other dissipative mechanisms",
          "Power in AC systems: apparent power S = V·I (VA), real power P = V·I·cos(φ) (W), reactive power Q = V·I·sin(φ) (VAR)",
          "Energy balance: total input = useful output + losses; losses are often proportional to current squared (I²R) or frequency-dependent"
        ],
        formulas: [
          "Mechanical work and power: W = F·d, P = F·v",
          "Electrical power: P = V·I = I²R = V²/R",
          "AC power: S = V·I, P = V·I·cos(φ), Q = V·I·sin(φ), S² = P² + Q²",
          "Efficiency: η = P_out / P_in or P_useful / P_total",
          "Kinetic and potential energy: KE = (1/2)m·v², PE = m·g·h, Spring: E = (1/2)k·x²"
        ]
      },
      {
        title: "Charge, Current, Voltage & Power Fundamentals",
        content: "Electric charge Q is measured in coulombs (C); one coulomb equals the charge of 6.24 × 10^18 electrons. Current I is the rate of charge flow: I = dQ/dt in amperes (coulombs per second). Direct current (dc) is constant; alternating current (ac) varies periodically. Voltage (potential difference) V is the energy per unit charge: V = W/Q in volts (joules per coulomb). Voltage represents the potential difference between two points—current flows from higher to lower potential through a resistive path. Coulomb's Law describes the force between charges: F = k·Q₁·Q₂/r², where k = 8.99 × 10^9 N·m²/C² and r is distance. Like charges repel; opposite charges attract. Electric field E is the force per unit charge: E = F/Q = k·Q/r², directed away from positive charges and toward negative charges. Potential difference between two points is the line integral of electric field: V = ∫E·dl. In a uniform field, V = E·d where d is distance along field direction.\n\nElectric power P = V·I measures energy transfer rate. For constant voltage and current, P = V·I watts. In resistive elements, P = I²R = V²/R. Instantaneous power p(t) = v(t)·i(t) fluctuates in AC circuits. Average power P_avg = (1/T)∫p(t)dt over one period is what meters measure. For sinusoidal AC, P_avg = V_rms·I_rms·cos(φ), where φ is the phase angle between voltage and current. RMS (root mean square) values are used for AC because they produce equivalent power to DC at that voltage: V_rms = V_peak/√2 ≈ 0.707·V_peak. The relationship V = I·Z in AC circuits generalizes Ohm's law, where Z is impedance. Impedance Z = R + jX (resistance + reactance) is complex; voltage and current are vectors (phasors). Power factor cos(φ) relates real power to apparent power; low power factors (inductive loads, poor circuits) require more current for the same real power, increasing I²R losses and heating in conductors. Power quality standards typically require power factor correction to >0.9 for industrial loads. Understanding these fundamentals is essential for all subsequent electrical analysis.",
        keyPoints: [
          "Current I = dQ/dt (amperes); voltage V = W/Q (volts); power P = V·I (watts) measures energy transfer rate",
          "Coulomb's Law and electric field describe charge interactions and forces; potential difference is line integral of electric field",
          "AC power analysis: RMS values, phase angles, and power factor (cos φ) determine real power transferred vs. apparent power",
          "Power factor correction and impedance (Z = R + jX) are essential for AC circuit analysis; low power factors increase I²R losses"
        ],
        formulas: [
          "Current: I = dQ/dt, Charge: Q = ∫I dt",
          "Voltage: V = W/Q, Potential difference: V_AB = ∫_A^B E·dl",
          "Coulomb's Law: F = k·Q₁·Q₂/r², k = 8.99 × 10^9 N·m²/C²",
          "Electric field: E = F/Q = k·Q/r²",
          "Power: P = V·I = I²R = V²/R (dc); P_avg = V_rms·I_rms·cos(φ) (ac)",
          "RMS voltage: V_rms = V_peak / √2"
        ]
      },
      {
        title: "Electromechanical Conversion: Motors & Generators",
        content: "Electromechanical conversion transforms electrical energy to mechanical (motors) or mechanical to electrical (generators). The Lorentz force on a current-carrying conductor in a magnetic field is F = B·I·L, where B is flux density, I is current, and L is conductor length perpendicular to B. This force drives motion in motors. A generator converts mechanical motion into electrical voltage via Faraday's law of induction: an induced EMF = -dΦ/dt, where Φ is magnetic flux through a circuit. As a conductor moves through a magnetic field, flux through the circuit changes, inducing voltage that drives current. In generators, mechanical input (water, steam, wind) turns a rotor, changing flux and producing electrical output. Back-EMF in motors opposes applied voltage: V_applied = I·R + E_back, where E_back = k·ω (k is motor constant, ω is angular velocity). At startup, ω = 0 so back-EMF is zero, allowing large inrush current; as speed increases, back-EMF grows, limiting current. At steady state, back-EMF nearly equals applied voltage, and motor current is small (just supplying losses and load torque).\n\nMotor torque τ = k·I (k is torque constant), proportional to current. Maximum torque occurs at startup with maximum current. As motor accelerates and back-EMF rises, current drops and torque decreases. A loaded motor reaches steady state when developed torque equals load torque. Mechanical power output P_mech = τ·ω = E_back·I. Electrical power input P_elec = V·I. Efficiency η = P_mech / P_elec = (E_back·I) / (V·I) = E_back / V. Since E_back < V (due to voltage drop across resistance), efficiency is less than 100%. AC induction motors are most common; they operate with slip (rotor speed slightly below synchronous speed), inducing rotor currents that create torque. DC motors offer precise speed control via voltage adjustment and torque control via current adjustment. In generators, mechanical speed determines voltage magnitude (higher speed → higher induced EMF); field current determines voltage level. Synchronous generators require external field excitation and operate at constant synchronous speed; induction generators require external ac source for magnetization and are less common. Understanding motor/generator duality is key: they use the same electromagnetic principles in opposite directions.",
        keyPoints: [
          "Lorentz force F = B·I·L drives motors; Faraday induction (EMF = -dΦ/dt) produces voltage in generators",
          "Back-EMF in motors opposes supply voltage; higher speed → higher back-EMF → lower current → lower torque, reaching equilibrium at operating point",
          "Motor torque τ = k·I is proportional to armature current; mechanical power output P = τ·ω = E_back·I",
          "Generator voltage is proportional to mechanical speed (ω); field current controls voltage level in generators with external field excitation"
        ],
        formulas: [
          "Lorentz force: F = B·I·L (newtons), Torque: τ = B·I·A (N·m), where A is conductor loop area",
          "Faraday's Law: EMF = -N·dΦ/dt (induced voltage)",
          "Back-EMF: E_back = k·ω, Motor equation: V = I·R + k·ω",
          "Motor torque: τ = k·I (k is motor torque constant)",
          "Power: P_mech = τ·ω = E_back·I, P_elec = V·I, η = E_back / V"
        ]
      }
    ]
  },
  {
    topicId: 6,
    title: "Circuit Analysis - DC and AC Steady State",
    overview: "Fundamental and advanced circuit analysis techniques covering DC networks, AC steady-state analysis, power analysis, resonance, three-phase systems, and transient response. This is the highest-weight topic (10%) requiring thorough mastery.",
    sections: [
      {
        title: "DC Fundamentals: Ohm's Law & Network Analysis",
        content: "Ohm's Law V = I·R is the foundation of circuit analysis, relating voltage, current, and resistance. Kirchhoff's Current Law (KCL) states that the sum of currents entering a node equals the sum leaving: Σ I_in = Σ I_out, or Σ I = 0 around a node. This conservation principle is essential for writing node equations. Kirchhoff's Voltage Law (KVL) states that the sum of voltages around any closed loop equals zero: Σ V = 0. Going around a loop, voltage rises (across voltage sources) equal voltage drops (across resistive elements). KVL enables loop current analysis. Series circuits have a single current path, so the same current flows through all components; total resistance R_total = R₁ + R₂ + ... Voltage divides proportionally: V_k = V_total × (R_k / R_total). Parallel circuits have multiple paths; voltage across all parallel branches is identical, and currents divide inversely to resistance: I_k = I_total × (R_eq / R_k). Equivalent parallel resistance is 1/R_eq = 1/R₁ + 1/R₂ + ..., always less than the smallest individual resistance.\n\nVoltage divider circuits find the voltage across one resistor in a series string: V_out = V_in × (R_out / (R_in + R_out)). Current divider finds current through one branch in parallel: I_k = I_total × (R_parallel / (R_k)) where R_parallel is the equivalent resistance of all branches except the one of interest. Source transformations allow conversion between voltage and current sources with series/parallel impedance: a voltage source V with series impedance Z is equivalent to a current source I = V/Z with parallel impedance Z. This equivalence simplifies circuit manipulation. Delta-wye (Δ-Y) transformations convert between three-element configurations, useful for analyzing three-phase circuits and bridge networks. For resistances, the transformation is: R_Y = (R₁·R₂ + R₂·R₃ + R₃·R₁) / R_opposite (similar for each arm). These tools—KCL, KVL, voltage/current dividers, source transformations, Δ-Y—enable systematic reduction of complex networks to simpler circuits. Always verify results by checking power balance: total power generated by sources equals total power dissipated in resistances.",
        keyPoints: [
          "Ohm's Law V = I·R; series resistance sums R_total = ΣR; parallel resistance reciprocal 1/R_eq = Σ(1/R), always less than smallest R",
          "KCL: Σ I at a node = 0; KVL: Σ V around a loop = 0; these enable writing independent equations for nodal and loop analysis",
          "Voltage divider V_k = V_total(R_k / R_total); current divider I_k = I_total(R_eq / R_k); use for quick solutions without full analysis",
          "Source transformations and Δ-Y transformations simplify circuits; verify solutions by checking power balance (P_generated = P_dissipated)"
        ],
        formulas: [
          "Ohm's Law: V = I·R, or I = V/R, or R = V/I",
          "Series: R_total = R₁ + R₂ + ... R_n",
          "Parallel: 1/R_eq = 1/R₁ + 1/R₂ + ... + 1/R_n; for two resistors: R_eq = (R₁·R₂)/(R₁+R₂)",
          "Voltage divider: V_k = V_total(R_k / (R₁ + R₂ + ...))",
          "Current divider: I_k = I_total(R_parallel / R_k)",
          "Power: P = V·I = I²·R = V²/R"
        ]
      },
      {
        title: "Network Theorems: Thevenin, Norton & Superposition",
        content: "Thevenin's Theorem simplifies complex networks to a single equivalent circuit: V_Th in series with R_Th. To find Thevenin equivalent as seen from terminals A-B: (1) Remove the load, (2) Find V_Th = open-circuit voltage at A-B with load removed, (3) Find R_Th = equivalent resistance looking back into the network with all sources deactivated (voltage sources short-circuited, current sources open-circuited). This equivalent circuit can then drive any load; the load current is I = V_Th / (R_Th + R_load). Thevenin's theorem is powerful because it reduces a network of arbitrary complexity to two parameters. Norton's Theorem is the dual: any network is equivalent to a current source I_N in parallel with resistance R_N. I_N = short-circuit current (shorting terminals A-B), and R_N = R_Th (same as Thevenin resistance). The two theorems are equivalent: V_Th = I_N · R_N. Choosing between them depends on the circuit: for voltage-source-heavy networks, Thevenin is intuitive; for current-source-heavy networks, Norton is simpler.\n\nSuperposition Theorem states that in a linear network with multiple sources, the response (voltage or current) is the sum of responses due to each source acting alone. To apply: (1) Consider one source, deactivate all others (voltage sources become short circuits, current sources become open circuits), (2) Calculate the response due to this source, (3) Repeat for each source, (4) Sum all responses algebraically (accounting for signs). Superposition is useful for networks with multiple sources of different frequencies (dc and ac, for example) because sources at different frequencies don't interact directly. However, superposition is tedious for networks with many sources; matrix methods are often faster. Maximum Power Transfer Theorem states that maximum power is delivered to a load R_L when it equals the Thevenin resistance R_Th of the source: R_L = R_Th. The maximum power is P_max = V_Th² / (4·R_Th). This principle guides impedance matching in power systems and signal transfer. If R_Th is fixed and R_L is variable, choose R_L = R_Th for maximum power (though not maximum efficiency—efficiency increases as R_L increases, reaching 100% only at infinite load resistance).\n\nThese theorems enable quick solutions without solving the entire network. For problems asking \"find the current through one element,\" Thevenin equivalent of the rest of the circuit often provides the fastest path. For circuits with multiple sources, superposition can reduce complexity. When designing for maximum power transfer (like impedance matching in RF circuits), apply the maximum power theorem directly. Real exam problems use these theorems strategically: identify which theorem best matches the problem structure, apply it correctly, and avoid sign errors in superposition. Common pitfall: forgetting to deactivate sources correctly (deactivating voltage source as open circuit instead of short circuit) or making arithmetic errors when summing responses.",
        keyPoints: [
          "Thevenin equivalent: V_Th (open-circuit voltage) in series with R_Th (resistance with sources deactivated); any load sees this as source",
          "Norton equivalent: I_N (short-circuit current) in parallel with R_N = R_Th; use when current source form is natural or preferred",
          "Superposition: sum responses due to each source individually (deactivating others); powerful for multi-source networks, but tedious for many sources",
          "Maximum power transfer: load resistance R_L = R_Th delivers maximum power P_max = V_Th²/(4·R_Th); less efficient at max power than at higher load"
        ],
        formulas: [
          "Thevenin: Find V_Th with load removed (open circuit); find R_Th with sources deactivated; equivalent: V_Th in series with R_Th",
          "Norton: I_N = V_Th / R_Th (short-circuit current); R_N = R_Th; equivalent: I_N in parallel with R_N",
          "Maximum power transfer: R_L = R_Th for maximum power; P_max = V_Th² / (4·R_Th); efficiency at max power is 50%"
        ]
      },
      {
        title: "AC Steady-State Analysis: Phasors & Impedance",
        content: "AC steady-state analysis uses phasors (complex numbers representing sinusoidal quantities) to convert differential equations into algebraic form. A sinusoidal voltage v(t) = V_m·cos(ωt + φ) is represented as phasor V = V_m·e^(jφ) = V_m∠φ (magnitude and phase angle). The relationship between peak amplitude V_m and RMS value is V_rms = V_m / √2. Circuit quantities (voltage, current) are phasors; when combined, phasor algebra applies rather than direct time-domain addition. Impedance Z generalizes resistance to ac: Z = R + jX, where R is resistance and X is reactance. For inductors, X_L = ωL (positive reactance, voltage leads current by 90°). For capacitors, X_C = -1/(ωC) (negative reactance, current leads voltage by 90°). Impedance relates voltage to current: V = I·Z (phasor form). Magnitude |Z| = √(R² + X²) and phase angle φ = arctan(X/R) determine voltage-current relationship. In series circuits, impedances add; in parallel circuits, admittances (Y = 1/Z) add: Y = G + jB, where G = R/|Z|² is conductance and B = -X/|Z|² is susceptance.\n\nFinding voltage/current in ac circuits uses the same techniques as dc: voltage dividers, Ohm's law, KCL, KVL—all apply to phasors. For example, V_k = V_total · (Z_k / (Z₁ + Z₂ + ...)). Current divider in parallel: I_k = I_total · (Y_eq / Y_k) or equivalently I_k = I_total · (Z_parallel / Z_k). Reactance and impedance vary with frequency ω = 2πf. At very low frequencies, inductors approach short circuits (Z_L → 0) and capacitors open circuits (Z_C → ∞). At very high frequencies, inductors open (Z_L → ∞) and capacitors short (Z_C → 0). This frequency dependence is critical: filters exploit this to pass desired frequencies and reject others. Low-pass filters allow low frequencies and attenuate high frequencies; high-pass filters do the opposite. The resonant frequency f₀ = 1/(2π√LC) is where X_L = X_C for series circuits, making impedance purely resistive. Phase angle φ = 0° at resonance. Phasor diagrams graphically represent relationships: voltage and current phasors, impedance triangle (R-X-Z), and admittance triangle. These diagrams help visualize leading/lagging relationships and power flow. When working with phasors, ensure all quantities are at the same frequency; superposition applies to different frequencies independently.",
        keyPoints: [
          "Phasors represent sinusoids as complex numbers: V = V_m∠φ; RMS voltage V_rms = V_m/√2; phasor arithmetic is complex arithmetic",
          "Impedance Z = R + jX; inductive X_L = ωL (positive), capacitive X_C = -1/(ωC) (negative); |Z| and phase angle φ determine voltage-current relationship",
          "Frequency dependence: at low frequency, inductors short and capacitors open; at high frequency, inductors open and capacitors short",
          "Resonance (series): occurs at ω₀ = 1/√LC where X_L = X_C; impedance is purely resistive, current is maximum, phase angle is zero"
        ],
        formulas: [
          "Phasor representation: V = V_m∠φ = V_m·e^(jφ) = V_m(cos φ + j sin φ)",
          "RMS: V_rms = V_m / √2 ≈ 0.707·V_m",
          "Impedance: Z = R + jX, |Z| = √(R² + X²), φ = arctan(X/R)",
          "Reactance: X_L = ωL = 2πfL, X_C = -1/(ωC) = -1/(2πfC)",
          "Admittance: Y = 1/Z = G + jB, G = R/|Z|², B = -X/|Z|²",
          "Resonant frequency: f₀ = 1/(2π√LC)"
        ]
      },
      {
        title: "AC Power Analysis: Real, Reactive & Apparent Power",
        content: "AC power has three components: real power P (active power, measured in watts), reactive power Q (measured in volt-amperes reactive, VAR), and apparent power S (measured in volt-amperes, VA). The relationships form a power triangle: S² = P² + Q². Real power P = V_rms · I_rms · cos(φ) represents energy actually consumed (converted to heat, light, mechanical work). Reactive power Q = V_rms · I_rms · sin(φ) represents energy stored and returned to the source cyclically; it doesn't do useful work but requires transmission infrastructure. Apparent power S = V_rms · I_rms is the total power that sources and transmission lines must handle. Power factor (PF) = P / S = cos(φ) is the ratio of real to apparent power; unity power factor (φ = 0°) means all power is real and useful; lower power factor means less efficient use of transmission capacity. Inductive loads (motors, inductors) have positive φ (current lags voltage), resulting in lagging power factor. Capacitive loads have negative φ (current leads voltage), resulting in leading power factor. Industrial facilities operate at lagging power factors (typically 0.85-0.95) due to induction motors; power factor correction uses capacitors to reduce φ, improving efficiency.\n\nComplex power S = P + jQ = V·I* (voltage times complex conjugate of current) provides all power information. For a circuit element with voltage V = V_m∠φ_V and current I = I_m∠φ_I, complex power is S = (1/2)V_m·I_m·e^(j(φ_V - φ_I)) or S = (1/2)V_m·I_m[cos(φ_V - φ_I) + j sin(φ_V - φ_I)]. Real part is real power, imaginary part is reactive power. Power factor correction involves adding capacitors in parallel with inductive loads to shift current toward in-phase with voltage. The required capacitor size is found by solving for the capacitive reactive power that cancels inductive reactive power. Power quality standards specify minimum power factor (often 0.90) for industrial loads; utilities may penalize low power factors with higher rates. Understanding power factor is essential for design: undersized transformers/conductors can't handle the extra current due to low power factor, even if real power demand is modest. Three-phase power is typically analyzed as three balanced phasors 120° apart; single-phase power analysis applies to each phase independently.",
        keyPoints: [
          "Real power P = V·I·cos(φ) (watts) performs useful work; reactive power Q = V·I·sin(φ) (VAR) is stored/returned; apparent power S = √(P² + Q²) (VA)",
          "Power factor PF = cos(φ) is ratio of real to apparent power; lower PF requires more transmission capacity for same real power, increasing losses",
          "Power factor correction: add parallel capacitors to inductive loads to reduce reactive power and shift current toward in-phase with voltage",
          "Complex power S = P + jQ captures all power information; power triangle relationships are fundamental to power flow analysis"
        ],
        formulas: [
          "Real power: P = V_rms·I_rms·cos(φ) (watts)",
          "Reactive power: Q = V_rms·I_rms·sin(φ) (VAR)",
          "Apparent power: S = V_rms·I_rms (VA); S² = P² + Q²",
          "Power factor: PF = P/S = cos(φ)",
          "Complex power: S = P + jQ = V·I* = V·I·e^(jφ)"
        ]
      },
      {
        title: "Resonance & Three-Phase Systems",
        content: "Series RLC resonance occurs when inductive and capacitive reactances cancel: X_L = X_C, or ωL = 1/(ωC). Solving for resonant frequency: ω₀ = 1/√LC, or f₀ = 1/(2π√LC) in hertz. At resonance, impedance Z = R (purely resistive), current is maximum I_max = V/R, and voltage and current are in phase (φ = 0°). Below resonance, capacitive reactance dominates; above resonance, inductive reactance dominates. The bandwidth is the frequency range where power is at least half maximum (the -3dB points). Quality factor Q = ω₀L/R = 1/(ω₀RC) measures selectivity: higher Q means narrower bandwidth (sharper resonance peak), more energy storage relative to dissipation. High-Q circuits are selective (good for filters), but require lower resistance (higher initial current, higher losses). Parallel RLC resonance is similar but less intuitive: impedance is maximum (purely resistive) at resonance, and impedance varies with frequency differently than series case. The concept of resonance is crucial for understanding filters, power factor correction, and instability in electrical systems.\n\nThree-phase (3-phase) ac power is the standard for industrial and utility power. Three balanced sinusoidal voltages are generated 120° apart: V_A, V_B = V_A∠(-120°), V_C = V_A∠(-240°) (or +120°, depending on convention). In wye (Y) configuration, three phase windings connect at a neutral point; voltages V_A, V_B, V_C are measured from neutral to each phase. In delta (Δ) configuration, three phase windings form a closed loop; voltages V_AB, V_BC, V_CA are line-to-line voltages. The relationship between line-to-neutral and line-to-line voltages in a balanced system: V_line = √3 · V_phase. For example, if phase voltage is 120V, line voltage is 120√3 ≈ 208V. Phase current equals line current in wye configuration; in delta, line current equals √3 times phase current (current also 120° out of phase). Three-phase power is constant (not pulsating like single-phase), providing smooth power delivery. Total real power P_3φ = √3 · V_line · I_line · cos(φ) (for balanced systems), reactive power Q_3φ = √3 · V_line · I_line · sin(φ), and apparent power S_3φ = √3 · V_line · I_line. Analysis of balanced three-phase systems can use single-phase analysis (per-phase equivalent) since all phases are identical. Unbalanced systems (unequal impedances in the three phases) require analysis of all three phases; symmetrical components can decompose unbalanced systems into sequence components (positive, negative, zero) which simplifies analysis.",
        keyPoints: [
          "Series resonance: f₀ = 1/(2π√LC), impedance Z = R (minimum), current maximum, bandwidth Δf = f₀/Q; high Q is selective but requires low R",
          "Parallel resonance: impedance maximum at resonance, impedance is purely resistive, less common but important for filter design",
          "Three-phase balanced system: three 120°-separated voltages; wye (Y) and delta (Δ) configurations; line voltage V_L = √3·V_phase",
          "Three-phase power: P = √3·V_L·I_L·cos(φ), constant power (not pulsating); use per-phase analysis for balanced systems, sequence components for unbalanced"
        ],
        formulas: [
          "Resonant frequency (series RLC): f₀ = 1/(2π√LC), ω₀ = 1/√LC",
          "Quality factor: Q = ω₀L/R = 1/(ω₀RC) = X_L,resonance / R",
          "Bandwidth: BW = f₀ / Q (at -3dB points)",
          "Three-phase voltage relationships: V_L = √3·V_phase (line vs. phase voltage)",
          "Three-phase power: P = √3·V_L·I_L·cos(φ) = 3·V_phase·I_phase·cos(φ)"
        ]
      },
      {
        title: "Transient Analysis: Step Response & Time Constants",
        content: "Transient analysis examines circuit behavior immediately after a sudden change (switching, source discontinuity) until steady state is reached. The complete response is the sum of natural (homogeneous) response and forced (particular/steady-state) response: v(t) = v_natural(t) + v_forced(t). Natural response depends on circuit energy-storage elements (inductors and capacitors) and dissipation (resistance). For a simple RC circuit with a step voltage input, the differential equation is: RC(dv_C/dt) + v_C = V_in. The solution has the form v_C(t) = V_in(1 - e^(-t/τ)) where τ = RC is the time constant. After time τ, the capacitor has charged to 63.2% of final value; after 5τ, it reaches ~99.3% of final value. Design practice uses 5τ as \"settling time\" for reaching steady state. Time constant τ represents how quickly the system responds: larger τ means slower response (more inertia), smaller τ means faster response (less energy storage relative to dissipation).\n\nFor RL circuits, τ = L/R, and the inductor current response follows i_L(t) = (V_in/R)(1 - e^(-t/τ)), increasing toward steady-state value V_in/R. Inductors oppose current changes (large di/dt requires large voltage); at t = 0+, inductors act as open circuits (preventing current change), and voltages appear across them. Capacitors maintain charge; at t = 0+, capacitors maintain their pre-transient voltage (acting as voltage sources). Second-order RLC circuits have more complex responses: underdamped (oscillatory), critically damped (fastest no-overshoot response), or overdamped (slow, monotonic). The damping ratio ζ = R/(2√(L/C)) determines which case applies: ζ < 1 underdamped, ζ = 1 critically damped, ζ > 1 overdamped. Initial conditions v_C(0⁻), i_L(0⁻) are set by pre-transient steady state; immediately after switching, continuity constraints apply: voltage across capacitors and current through inductors cannot change instantaneously (v_C(0⁺) = v_C(0⁻), i_L(0⁺) = i_L(0⁻)). However, voltage across inductors and current through capacitors can change instantaneously.\n\nTransient analysis is essential for understanding circuit protection (inrush currents, voltage spikes), stability (oscillations after switching), and dynamic response. Practical circuits must be designed to limit inrush currents (using series resistors, soft starters) and suppress voltage spikes (using snubber circuits, clamping diodes). When a switch opens, stored energy in inductors must dissipate; without a discharge path, voltage spikes appear (dangerous for components). When a switch closes, capacitors try to charge/discharge suddenly, creating current spikes. Understanding these transients and designing protection ensures reliable operation. Laplace transform (s-domain analysis) simplifies transient calculation: impedances become Z(s) = R + sL + 1/(sC), allowing steady-state solution techniques to directly yield s-domain results which inverse-transform to time-domain responses.",
        keyPoints: [
          "Time constant τ = RC (capacitor) or τ = L/R (inductor); 5τ is settling time; larger τ means slower response to changes",
          "Natural response decays exponentially with time constant τ; forced response is steady-state value; total response is sum of both",
          "Initial conditions from pre-transient state: v_C(0⁺) = v_C(0⁻), i_L(0⁺) = i_L(0⁻) (continuity); voltages across inductors and currents through capacitors can change instantaneously",
          "Second-order (RLC) response: underdamped (oscillatory), critically damped (fast no-overshoot), or overdamped (slow); damping ratio ζ determines type"
        ],
        formulas: [
          "RC time constant: τ = R·C; capacitor voltage: v_C(t) = V_in(1 - e^(-t/τ))",
          "RL time constant: τ = L/R; inductor current: i_L(t) = (V_in/R)(1 - e^(-t/τ))",
          "General RC transient: i(t) = (V_in/R)·e^(-t/τ)",
          "RLC damping ratio: ζ = R/(2√(L/C)); underdamped if ζ < 1, critically damped if ζ = 1, overdamped if ζ > 1",
          "Settling time (to 99.3%): t_settle ≈ 5τ"
        ]
      }
    ]
  },
{
    topicId: 7,
    title: "Linear Systems",
    overview: "Covers fundamental signal processing and system analysis in both time and frequency domains. Topics include impulse response, Fourier and Laplace transforms, transfer functions with poles and zeros, stability criteria, and Z-transforms for discrete systems.",
    sections: [
      {
        title: "Time Domain Analysis",
        content: "Time domain analysis examines system behavior using impulse and step responses. The impulse response h(t) completely characterizes an LTI system and allows prediction of output for any input through convolution. When an impulse δ(t) enters a system, the output h(t) reveals all system dynamics. Similarly, the step response shows how quickly and smoothly a system reaches steady state when subjected to a constant input. Convolution mathematically describes how the input signal is 'smeared' by the system's impulse response: y(t) = ∫x(τ)h(t-τ)dτ. On the FE exam, you'll often need to sketch or identify impulse and step responses from transfer functions, or compute convolution for simple signals. Understanding causality is critical—causal systems have h(t)=0 for t<0, meaning the output cannot precede the input. For discrete systems, convolution becomes a summation: y[n] = Σx[k]h[n-k]. Practical exam tip: memorize key response shapes for first and second-order systems, as these appear repeatedly.",
        keyPoints: [
          "Impulse response h(t) fully characterizes LTI systems; use convolution to find output",
          "Step response reveals settling time, overshoot, and steady-state behavior",
          "Causal systems satisfy h(t)=0 for t<0; all physical systems are causal",
          "Convolution in time domain equals multiplication in frequency domain"
        ],
        formulas: ["y(t) = ∫x(τ)h(t-τ)dτ", "y[n] = Σx[k]h[n-k]", "h(t) = dg(t)/dt where g(t) is step response"]
      },
      {
        title: "Frequency Domain Analysis: Fourier and Laplace",
        content: "The Fourier Transform converts time-domain signals into frequency-domain representations, showing which frequencies are present and their amplitudes. For periodic signals, Fourier Series decomposes them into discrete frequency components: x(t) = a₀ + Σaₙcos(nω₀t) + Σbₙsin(nω₀t). The one-sided amplitude spectrum shows magnitude at each frequency, while the phase spectrum shows the phase shift. The Laplace Transform generalizes Fourier analysis by including an exponential convergence factor, making it applicable to non-periodic and unstable signals. The bilateral Laplace transform X(s) = ∫e^(-st)x(t)dt converts differential equations into algebraic equations, simplifying system analysis. Region of convergence (ROC) defines where the transform exists and is crucial for uniqueness. On the FE exam, expect questions on Fourier Series for periodic waveforms (sawtooth, square waves), or finding frequency spectra. Key advantage: time-domain convolution becomes frequency-domain multiplication, dramatically simplifying analysis. For practical signals, use table lookups rather than computing integrals by hand.",
        keyPoints: [
          "Fourier Series for periodic signals; Fourier Transform for non-periodic signals",
          "Laplace Transform with ROC handles wider signal classes including growing exponentials",
          "Time convolution ↔ frequency multiplication (key property for filtering)",
          "Pole-zero plots in s-plane determine time-domain response characteristics"
        ],
        formulas: ["X(f) = ∫x(t)e^(-j2πft)dt", "X(s) = ∫x(t)e^(-st)dt", "x(t) = (1/2π)∫X(jω)e^(jωt)dω"]
      },
      {
        title: "Transfer Functions, Poles, and Zeros",
        content: "A transfer function H(s) = Y(s)/X(s) is the Laplace transform of the impulse response, representing the input-output relationship in the frequency domain. It can be expressed as a ratio of polynomials: H(s) = (b₀ + b₁s + ... + bₘs^m)/(a₀ + a₁s + ... + aₙs^n). Zeros are values of s where the numerator equals zero; poles are values where the denominator equals zero. Pole locations in the s-plane directly determine time-domain behavior: poles in the left half-plane (LHP) correspond to decaying exponentials, poles on the imaginary axis produce sustained oscillations, and poles in the right half-plane (RHP) cause instability. A system is stable if and only if all poles lie in the open LHP. The number of poles equals system order, determining the number of energy-storage elements. Partial fraction decomposition separates complex transfer functions into simple terms whose inverse Laplace transforms are known. On the FE exam, you'll identify pole-zero plots, sketch Bode magnitude plots from pole-zero locations, or determine stability. Fast analysis tip: dominant poles (closest to imaginary axis) control response speed; fast poles have little effect and can often be neglected.",
        keyPoints: [
          "Poles in LHP → stable; on imaginary axis → marginal; in RHP → unstable",
          "Pole locations determine response time and oscillation; zeros affect magnitude only",
          "Order of denominator = system order = number of poles",
          "Partial fractions decompose complex H(s) into simple inverse-transform-able terms"
        ],
        formulas: ["H(s) = N(s)/D(s) = (Πproduct(s-zᵢ))/(Πproduct(s-pᵢ))", "Stability: Re(pᵢ) < 0 for all poles pᵢ"]
      },
      {
        title: "System Characterization: LTI, Causality, Stability",
        content: "Linear Time-Invariant (LTI) systems obey superposition and are shift-invariant—the impulse response doesn't change over time. Linearity means scaling and summing inputs produce scaled and summed outputs; time-invariance means shifting an input by τ shifts output by the same τ. Every practical continuous-time system can be modeled as LTI over a reasonable operating range. Causality requires that future outputs don't depend on future inputs: h(t)=0 for t<0. This is fundamental—no physical system can respond before being stimulated. All real systems are causal, though theoretical non-causal systems appear in signal processing for offline batch processing. Stability in the BIBO (Bounded Input Bounded Output) sense means bounded inputs always produce bounded outputs. For LTI systems, BIBO stability is equivalent to ∫|h(t)|dt < ∞, which for rational transfer functions means all poles in the open LHP. On the FE exam, you'll verify whether a system is stable, causal, or LTI given impulse responses or transfer functions. Practical tip: if a pole is exactly on the imaginary axis (marginal stability), the system is technically unstable in BIBO sense because it produces sustained oscillations that don't decay.",
        keyPoints: [
          "LTI: superposition principle applies; shift-invariance property holds",
          "Causality: h(t)=0 for t<0; all physical systems are causal",
          "BIBO stable ↔ all poles in open LHP ↔ ∫|h(t)|dt < ∞",
          "Verify LTI, causality, stability properties from given h(t) or H(s)"
        ],
        formulas: ["y(t) = αy₁(t) + βy₂(t) for LTI with inputs αx₁ + βx₂", "BIBO stability: ∫₀^∞|h(t)|dt < ∞"]
      },
      {
        title: "Z-Transforms and Discrete Systems",
        content: "The Z-Transform is the discrete-time equivalent of the Laplace Transform, converting difference equations into algebraic form. For a discrete signal x[n], the bilateral Z-Transform is X(z) = Σx[n]z^(-n) over all n. The region of convergence (ROC) specifies where this sum converges—typically an annulus |r₁| < |z| < |r₂|. Unilateral Z-Transforms (causal sequences only) are more practical and are used extensively in digital control. The relationship between s-plane (continuous) and z-plane (discrete) is z = e^(sT) where T is sampling period. This maps the imaginary axis in the s-plane to the unit circle in the z-plane; the LHP maps inside the unit circle, and the RHP maps outside. For discrete systems, stability requires poles inside the unit circle |z| < 1. Common discrete-time signals have well-tabulated Z-Transforms: u[n]→z/(z-1), a^n u[n]→z/(z-a), n·a^n u[n]→az/(z-a)². On the FE exam, expect Z-Transform table lookups, inverse transforms via partial fractions, or determining stability from pole locations in the z-plane. Practical tip: memorize a small table of common transforms; deriving from definition takes too long under exam pressure.",
        keyPoints: [
          "Z-Transform discretizes continuous systems; z=e^(sT) relates s and z planes",
          "Stability: all poles must satisfy |pᵢ| < 1 (inside unit circle)",
          "ROC defines uniqueness; unilateral Z-T for causal sequences is standard",
          "Partial fractions and tables solve most inverse Z-Transform problems quickly"
        ],
        formulas: ["X(z) = Σx[n]z^(-n)", "z = e^(sT)", "Stability: |poles| < 1 in z-plane", "x[n] = u[n]z/(z-1), x[n]=a^n u[n]z/(z-a)"]
      }
    ]
  },
  {
    topicId: 8,
    title: "Signal Processing",
    overview: "Covers Fourier analysis for both periodic and aperiodic signals, sampling theory with Nyquist criterion, filter design for different frequency responses, and discrete Fourier transform with practical FFT implementation.",
    sections: [
      {
        title: "Fourier Series and Fourier Transform",
        content: "Fourier Series decomposes periodic signals into a sum of sinusoids at harmonics of the fundamental frequency. For a signal with period T₀ and fundamental frequency f₀ = 1/T₀, the complex exponential form is x(t) = Σcₙe^(j2πnf₀t) where coefficients cₙ = (1/T₀)∫x(t)e^(-j2πnf₀t)dt. The one-sided amplitude spectrum |cₙ| shows magnitude at each harmonic, decreasing rapidly for 'smooth' signals and slowly for signals with sharp edges or discontinuities. The Fourier Transform generalizes to aperiodic signals, producing a continuous frequency spectrum. For real signals, amplitude spectrum is even and phase spectrum is odd. Parseval's theorem states that energy in time domain equals energy in frequency domain: ∫|x(t)|²dt = ∫|X(f)|²df. This is crucial for power calculations. The bandwidth of a signal indicates how much of the frequency spectrum is significant; wider signals have more spectral content. On the FE exam, sketch spectra for common waveforms (rectangular pulse, triangle, sawtooth), compute Fourier coefficients by hand, or identify bandwidth. Practical tip: differentiation in time multiplies Fourier coefficients by j2πf, making sharp signals have broader spectra.",
        keyPoints: [
          "Periodic signals → Fourier Series (discrete spectrum); aperiodic → Transform (continuous spectrum)",
          "Complex exponential form cₙ = (1/T₀)∫x(t)e^(-j2πnf₀t)dt is easiest for computation",
          "Parseval: time-domain energy equals frequency-domain energy (conservation)",
          "Signal smoothness determines spectral roll-off; edges create high-frequency components"
        ],
        formulas: ["x(t) = Σcₙe^(j2πnf₀t)", "cₙ = (1/T₀)∫x(t)e^(-j2πnf₀t)dt", "X(f) = ∫x(t)e^(-j2πft)dt", "Energy: ∫|x(t)|²dt = ∫|X(f)|²df"]
      },
      {
        title: "Sampling Theorem and Nyquist Rate",
        content: "The Sampling Theorem (Shannon-Nyquist) states that to perfectly reconstruct a bandlimited signal from samples, the sampling frequency fₛ must exceed twice the highest frequency component: fₛ > 2fₘₐₓ. The critical frequency is fₙ = fₛ/2 called the Nyquist frequency. Violating this causes aliasing—high-frequency components fold back into the baseband and become indistinguishable from lower frequencies. For example, a 15 kHz signal sampled at 20 kHz appears as a 5 kHz signal. Anti-aliasing filters are placed before sampling to remove frequency components above the Nyquist frequency, preventing aliasing. The sampling process in frequency domain replicates the spectrum at multiples of fₛ; choosing fₛ correctly ensures no overlap. Practical reconstruction from samples uses a sinc interpolation filter, though zero-order hold (staircase) and first-order hold approximate it. On the FE exam, expect calculations of minimum sampling rate, identification of aliased frequencies, or design of anti-aliasing filter specifications. Common mistake: confusing Nyquist frequency with sampling frequency—remember fₙ = fₛ/2, not equal to fₛ.",
        keyPoints: [
          "Nyquist rate fₛ > 2fₘₐₓ; Nyquist frequency fₙ = fₛ/2 is the folding point",
          "Aliasing occurs when fₛ ≤ 2fₘₐₓ; anti-aliasing filter mandatory before sampling",
          "Aliased frequency = |f ± kfₛ| for integers k; find minimum aliasing frequency",
          "Perfect reconstruction needs sinc filter; practical systems use zero-order or first-order hold"
        ],
        formulas: ["fₛ > 2fₘₐₓ (Nyquist criterion)", "fₙ = fₛ/2 (Nyquist frequency)", "Aliased frequency: |f mod fₛ| or |fₛ - f|"]
      },
      {
        title: "Analog Filters: Butterworth, Chebyshev, and Filter Types",
        content: "Analog filters shape frequency responses to pass desired frequencies and attenuate others. Low-pass filters (LP) pass low frequencies, block high; high-pass (HP) do the opposite; band-pass (BP) pass a frequency band; band-stop (BS) or notch reject a band. Filter order n determines roll-off rate: -20n dB/decade asymptotically. Butterworth filters provide maximally flat passband response with smooth roll-off; no ripple in passband or stopband. Chebyshev Type I has equiripple passband (specified ripple, e.g., 0.5 dB) and sharp roll-off; Type II has ripple in stopband. Elliptic filters achieve steepest roll-off by accepting ripple in both bands. Transfer function design uses normalized prototypes then frequency and impedance scaling. Butterworth is most common in engineering because flatness matters more than steepness for many applications. A first-order Butterworth LP has H(s) = ωc/(s + ωc) where ωc is cutoff frequency; second-order is ωc²/(s² + √2ωc·s + ωc²). On the FE exam, identify filter type from specifications, compute cutoff frequency, or predict magnitude response. Practical tip: filter order is often the biggest design variable affecting cost and complexity.",
        keyPoints: [
          "Filter type (LP/HP/BP/BS) determined by application; Butterworth preferred for flat response",
          "Roll-off = -20n dB/decade where n is order; higher order = steeper but more complex",
          "Chebyshev allows passband ripple for sharper roll-off; Butterworth avoids ripple",
          "Cutoff frequency ωc or fc is primary design parameter; use tables for standard filter designs"
        ],
        formulas: ["First-order LP: H(s) = ωc/(s+ωc)", "Second-order Butterworth: H(s) = ωc²/(s²+√2·ωc·s+ωc²)", "Rolloff = -20n dB/decade for order n"]
      },
      {
        title: "DFT, FFT, and Practical Implementation",
        content: "The Discrete Fourier Transform (DFT) converts a finite sequence of N samples into N frequency components: X[k] = Σ(n=0 to N-1) x[n]e^(-j2πkn/N). The DFT represents discrete frequency samples at fₖ = kfₛ/N. Frequency resolution Δf = fₛ/N determines ability to distinguish nearby frequencies; better resolution requires more samples or longer acquisition time. The Fast Fourier Transform (FFT) is an algorithm reducing DFT computation from O(N²) to O(N log N) using divide-and-conquer recursion. The Cooley-Tukey FFT requires N to be a power of 2, though zero-padding extends to nearby power of 2 without loss of information. Windowing applies a tapered window function (Hamming, Hann, Blackman) to reduce spectral leakage—the smearing caused by abrupt truncation. Leakage occurs because the DFT implicitly assumes the signal repeats periodically; discontinuities at edges create spurious frequency components. Common windows: rectangular (no leakage but high side-lobes), Hamming (50 dB side-lobe suppression), Blackman (60 dB). On the FE exam, compute DFT for small N by hand, determine frequency resolution, or identify windowing effects. Practical tip: always multiply time-domain signal by a window before FFT to avoid misinterpreting leakage as real signal components.",
        keyPoints: [
          "DFT: X[k] = Σx[n]e^(-j2πkn/N); FFT is O(N log N) algorithm, DFT is O(N²)",
          "Frequency resolution Δf = fₛ/N; longer records improve resolution (fₛ fixed)",
          "Windowing reduces spectral leakage from signal truncation; trades frequency resolution for amplitude accuracy",
          "Zero-padding increases frequency resolution only if samples are longer; otherwise no new information"
        ],
        formulas: ["X[k] = Σ(n=0 to N-1) x[n]e^(-j2πkn/N)", "Frequency resolution: Δf = fₛ/N", "Frequency of bin k: fₖ = kfₛ/N"]
      }
    ]
  },
  {
    topicId: 9,
    title: "Electronics",
    overview: "Covers semiconductor devices including diodes and transistors, both BJT and MOSFET with biasing and amplifier configurations, operational amplifiers with various circuit topologies, and power conversion circuits.",
    sections: [
      {
        title: "Diode Circuits and Applications",
        content: "Diodes are two-terminal devices allowing current in forward direction (anode to cathode) and blocking reverse. The ideal diode has zero forward resistance and infinite reverse resistance; practical diodes have 0.6-0.7 V forward voltage drop (Vf) for silicon. Rectifier circuits convert AC to DC: half-wave uses one diode, conducting half the AC cycle; full-wave bridge uses four diodes, conducting full cycle with lower ripple. Average DC output for full-wave: Vdc = 0.636·Vpeak ≈ (2√2/π)·Vrms. Peak Inverse Voltage (PIV) must be less than diode reverse breakdown voltage; bridge rectifier PIVs are half those of half-wave. Zener diodes maintain constant voltage in reverse breakdown region; used as voltage regulators. Output voltage regulation is the ability to maintain constant output despite load or supply variations. Clipper circuits use diodes to limit signal peaks; clamper circuits shift DC level without changing AC amplitude. On the FE exam, calculate output voltage and ripple of rectifier circuits, determine required diode PIV rating, or analyze Zener regulator for load variations. Practical tip: remember the π factor in rectifier calculations; mistakes here are common. Efficiency η = Pdc/Pac; ripple factor r = Vripple/Vdc.",
        keyPoints: [
          "Half-wave rectifier: Vdc = 0.318·Vpeak; full-wave: Vdc = 0.636·Vpeak",
          "Peak Inverse Voltage (PIV) for diodes; bridge rectifier has PIV = Vpeak, half-wave has PIV = 2Vpeak",
          "Zener in reverse bias maintains constant voltage; used for voltage regulation and overvoltage protection",
          "Filtering capacitors reduce ripple; larger capacitance yields lower ripple but slower response"
        ],
        formulas: ["Half-wave: Vdc = Vpeak/π", "Full-wave: Vdc = 2Vpeak/π ≈ 0.636·Vpeak", "Ripple factor: r = 1/(2√3·fRC) for full-wave with capacitor", "PIV_bridge = Vpeak, PIV_halfwave = 2Vpeak"]
      },
      {
        title: "BJT Analysis and Amplifier Configurations",
        content: "Bipolar Junction Transistors (BJTs) are current-controlled devices with three terminals: base (B), collector (C), emitter (E). In active region, Ic = βIb where β = hfe is current gain (typically 50-300). The base-emitter junction has forward voltage Vbe ≈ 0.7 V; collector-emitter voltage Vce must exceed saturation voltage Vce(sat) ≈ 0.2 V for active region. DC biasing sets the Q-point (quiescent operating point); common methods include fixed base current, emitter feedback, and voltage divider. For small-signal AC analysis around Q-point, the BJT is modeled as a voltage-controlled current source with input impedance rπ = β·Vt/Ib where Vt ≈ 26 mV. Common-Emitter (CE) is most popular: high gain (≈β), moderate input impedance, phase inversion. Common-Collector (CC) or emitter-follower: unity voltage gain, high input impedance, low output impedance—excellent buffer. Common-Base (CB): high input impedance looking backward, low input impedance forward, low output impedance, no phase inversion. On the FE exam, design biasing circuits for specified Q-point, compute small-signal voltage/current gain, or identify amplifier configuration from schematic. Practical tip: always verify active region (Vce > Vce(sat)) after choosing Q-point.",
        keyPoints: [
          "Active region: Ic = βIb; saturation when Vce < 0.2 V; cutoff when Ib ≈ 0",
          "CE amplifier: high gain, moderate Zin, phase inversion; CC: Zin>>CE, Zout<<CE, unity gain",
          "Small-signal model: gm = Ic/Vt ≈ Ic/26mV; re = Vt/Ie ≈ 26mV/Ie",
          "Q-point biasing: use voltage divider for stability against β variations"
        ],
        formulas: ["Ic = β·Ib", "Vbe ≈ 0.7 V", "gm = Ic/Vt", "Av = -gm·Rc (CE stage)", "Zin = rπ + (β+1)re"]
      },
      {
        title: "MOSFET Circuits and Biasing",
        content: "Metal-Oxide-Semiconductor FETs are voltage-controlled devices. Enhancement-mode N-channel (NMOS) conducts only with positive gate-source voltage above threshold Vt (typically 0.5-2 V). Drain current Id = (μnCox/2)·(W/L)·(Vgs-Vt)² in saturation, linear in triode region. Transconductance gm = ∂Id/∂Vgs = μnCox(W/L)(Vgs-Vt) in saturation. Depletion-mode MOSFETs conduct even at Vgs=0 and turn off with negative Vgs. P-channel is complementary, with positive current flowing from source to drain with negative Vgs. DC biasing typically uses resistive load or current mirror. Self-biasing circuits adjust Vgs automatically via source resistor; gate voltage fixed, source voltage adjusts so Id through Rs equals drain current. Common-Source (CS) amplifier similar to CE BJT: high gain, moderate Zin. Common-Drain (CD) or source-follower: unity gain, very high Zin (gate is capacitive coupling). Common-Gate (CG): high input impedance looking backward, low looking forward. Key advantage of MOSFETs over BJTs: essentially zero gate current, simplifying biasing and allowing high input impedance. On the FE exam, design MOSFET amplifier bias, compute gain from gm and load resistance, or verify saturation region operation. Practical tip: MOSFET gate can be damaged by electrostatic discharge (ESD); in practice use protection diodes.",
        keyPoints: [
          "NMOS enhancement: conducts for Vgs > Vt; depletion: conducts for Vgs > Vt (negative Vt)",
          "Saturation: Id = (μCox/2)·(W/L)·(Vgs-Vt)²; gm = μCox(W/L)(Vgs-Vt)",
          "CS amplifier: Av = -gm·Rd; CD: Av ≈ 1; CG: low Zin forward, high backward",
          "Self-biasing via Rs: Vgs = Id·Rs; gate voltage fixed, source voltage adjusts automatically"
        ],
        formulas: ["Id = (μnCox/2)·(W/L)·(Vgs-Vt)² [saturation]", "gm = μnCox(W/L)(Vgs-Vt)", "Av = -gm·Rd [CS]", "Zin_gate → ∞"]
      },
      {
        title: "Operational Amplifier Circuits",
        content: "Ideal op-amps have infinite open-loop gain, infinite input impedance, zero output impedance, infinite bandwidth, and zero input offset. Real op-amps (e.g., 741, TL072) have finite gain 10^5-10^6, high input impedance 1-10 MΩ, low output impedance 50-100 Ω, GBW product typically 1 MHz. Negative feedback reduces effective gain while improving linearity and stability. With feedback, closed-loop gain Acl ≈ -Rf/Rin for inverting, Acl = 1+Rf/Rin for non-inverting. Inverting amplifier: gain = -Rf/Rin, summing amplifier adds multiple weighted inputs. Non-inverting amplifier: high input impedance for buffering. Unity-gain buffer (voltage follower): Acl = 1, Zin ≈ ∞, Zout ≈ 0, perfect for impedance matching. Integrator sums input over time: Vo = -(1/RC)∫Vi dt, useful for control systems. Differentiator: Vo = -RC dVi/dt, amplifies high-frequency noise—add series resistor or capacitor in feedback for stability. Comparator uses open-loop gain to switch output between rail voltages when inputs cross. On the FE exam, analyze feedback circuits using virtual short (V⁺=V⁻), compute transimpedance or transadmittance, or predict frequency response. Practical tip: integrators are prone to drift (DC in feedback capacitor); differentiators are noise-sensitive. Use Miller effect: Zin = Zf/(1+|Ac|) for inverting stage.",
        keyPoints: [
          "Virtual short: V⁺ = V⁻ with negative feedback; no current into inputs (Zin = ∞)",
          "Inverting: Acl = -Rf/Rin; Non-inverting: Acl = 1+Rf/Rin; unity buffer: Acl = 1",
          "Integrator: output proportional to ∫input; differentiator: output proportional to d(input)/dt",
          "Summing amplifier weights multiple inputs: Vo = -Rf(Vi1/R1 + Vi2/R2 + ...)"
        ],
        formulas: ["Inverting: Acl = -Rf/Rin", "Non-inverting: Acl = 1+Rf/Rin", "Integrator: Vo = -(1/RC)∫Vi dt", "Differentiator: Vo = -RC dVi/dt", "GBW = Aol·f_3dB"]
      },
      {
        title: "Power Electronics: Rectifiers and Converters",
        content: "Power electronics processes large currents and voltages, converting energy between AC and DC or changing voltage/current levels. Three-phase rectifiers (six-pulse) achieve higher power with lower ripple than single-phase: output voltage Vdc = (3√3/π)·Vrms ≈ 1.35·Vrms for uncontrolled diode rectifier. Thyristors (SCRs) controlled by gate pulse allow variable DC output; rectifier becomes controlled rectifier. DC-DC converters: buck converter steps down voltage (output Vo = D·Vin where D is duty cycle 0-1), boost converter steps up (Vo = Vin/(1-D)). Inverters convert DC to AC, essential for motor drives and renewable energy. Pulse-Width Modulation (PWM) controls average output by varying on/off ratio; PWM frequency much higher than load (typically 10+ kHz) ensures smooth operation. Transformer-isolated converters (flyback, forward) provide isolation for safety. On the FE exam, compute output voltage or current from converter duty cycle, design L or C values for acceptable ripple, or analyze steady-state operation of switching converters. Practical tip: understand energy storage: inductors resist current change, capacitors resist voltage change. Ripple in buck converter: ΔI = Vin·D/(L·fs), ΔV = I/(C·fs).",
        keyPoints: [
          "Buck: Vo = D·Vin; Boost: Vo = Vin/(1-D); duty cycle D = ton/(ton+toff)",
          "Ripple in inductors: ΔI = V·D/(L·fs); ripple in capacitors: ΔV = I·D/(C·fs)",
          "Three-phase rectifier: higher power, lower ripple than single-phase",
          "PWM frequency >> load frequency ensures smooth output (typically 10+ kHz)"
        ],
        formulas: ["Buck: Vo = D·Vin", "Boost: Vo = Vin/(1-D)", "Current ripple: ΔI = Vin·D/(L·fs)", "Voltage ripple: ΔV = I·D/(C·fs)"]
      }
    ]
  },
  {
    topicId: 10,
    title: "Power Systems",
    overview: "Covers three-phase AC systems with balanced and unbalanced conditions, transformers for voltage/power transformation, per-unit normalization for simplified analysis, transmission line models and parameters, power factor correction, and rotating machines.",
    sections: [
      {
        title: "Three-Phase Systems and Balanced Configurations",
        content: "Three-phase AC power supplies are standard in industry, offering constant power (no pulsation), efficient transmission, and compact motor designs. Three voltage sources 120° apart: Va = V cos(ωt), Vb = V cos(ωt-120°), Vc = V cos(ωt-240°) or in complex form Va = V, Vb = V·a², Vc = V·a where a = e^(j120°) = -1/2 + j√3/2 is the operator. For balanced loads, phase voltages and currents satisfy Va+Vb+Vc = 0 and Ia+Ib+Ic = 0. Wye (Y) connection: neutral point common to all phases; line voltage = √3·phase voltage, Vll = √3·Vph. Delta (Δ) connection: phases form a triangle; line voltage equals phase voltage Vll = Vph, but line current = √3·phase current, Ill = √3·Iph. Power in three-phase: P = √3·Vll·Ill·cos(θ), Q = √3·Vll·Ill·sin(θ), S = √3·Vll·Ill. Per-phase analysis simplifies balanced systems to single-phase equivalent. Unbalanced loads or faults analyzed with symmetrical components: zero-sequence (sum of three phasors), positive-sequence (standard 120° apart), negative-sequence (reverse order). On the FE exam, convert between wye and delta, compute three-phase power, or analyze unbalanced systems. Practical tip: Y→Δ conversion ZΔ = 3·ZY for impedances; Δ→Y conversion ZY = ZΔ/3.",
        keyPoints: [
          "Y connection: Vll = √3·Vph; Δ connection: Ill = √3·Iph",
          "Balanced three-phase: Va+Vb+Vc = 0 and Ia+Ib+Ic = 0",
          "Three-phase power: P = √3·Vll·Ill·cos(θ); constant regardless of load phase",
          "Symmetrical components for unbalanced systems: zero, positive, negative sequences"
        ],
        formulas: ["Vll = √3·Vph (Y connected)", "Ill = √3·Iph (Δ connected)", "P = √3·Vll·Ill·cosφ", "a = e^(j120°) = -1/2+j√3/2", "ZΔ = 3·ZY"]
      },
      {
        title: "Transformers: Equivalent Circuit and Efficiency",
        content: "Transformers transfer power between circuits with different voltage and impedance levels. Ideal transformer: Vs/Vp = Ns/Np = n (turns ratio); Ip/Is = n; power in equals power out. Real transformers include core loss (hysteresis + eddy current) and copper loss (resistance in windings). Equivalent circuit: primary voltage Vp = Np dΦ/dt = primary impedance voltage; magnetizing branch Xm ≈ 1000s of ohms represents core reactance; leakage impedance Zleakage = Rcopper + jXleakage. Voltage regulation VR = (Vnl - Vfl)/Vfl × 100% measures how well output voltage is maintained under load. High regulation (poor) when output drops significantly with load; low regulation is desirable. Efficiency η = Pout/(Pout+Pcores+Pcopper); transformer efficiency typically 95-99%. Open-circuit test measures magnetizing impedance and core losses. Short-circuit test measures leakage impedance and copper losses. On the FE exam, compute voltage regulation, efficiency, or equivalent circuit impedance from tests. Practical tip: at rated load, core and copper losses are comparable, each about 0.5-1% of rated power. Use pu impedance for quick voltage drop estimates: ΔV ≈ Z·I·cosφ.",
        keyPoints: [
          "Ideal: Vs/Vp = Ns/Np = n; Is/Ip = n",
          "Real transformer: core loss (no-load), copper loss (load dependent)",
          "Voltage regulation = (Vnl-Vfl)/Vfl; desirable < 5%",
          "Efficiency ≈ 95-99% at rated load; worst at very light or overload conditions"
        ],
        formulas: ["Ideal: Vs = n·Vp, Is = Ip/n", "VR = (Vnl-Vfl)/Vfl × 100%", "η = Pout/(Pout+Pcore+Pcopper)", "Zpu = Zactual/Zbase"]
      },
      {
        title: "Per-Unit System for Simplified Analysis",
        content: "The per-unit (pu) system normalizes voltages, currents, impedances, and powers relative to chosen base values, simplifying calculations across multiple voltage levels and equipment sizes. Advantages: impedances are approximately constant regardless of base voltage, making designs transfer between systems easily; transformers with nominal tur ratio appear as ideal (n=1); numbers cluster near 1.0 making errors obvious. Base values chosen arbitrarily: choose Sbase (typically system rating, e.g., 100 MVA) and Vbase at one point; all other bases follow. In a given zone, Zbase = Vbase²/Sbase. Per-unit quantities: Vpu = Vactual/Vbase; Ipu = Iactual/Ibase; Zpu = Zactual/Zbase; Ppu = Pactual/Pbase. Critical relationship: Zpu is independent of voltage in a given zone if you scale impedances through transformers correctly. For transformer between voltage levels, impedance transforms: if Zpu on primary is Zpu1, then on secondary (different voltage) the same physical transformer still has the same Zpu. Three single-phase zones at different voltages can be analyzed with single Sbase and voltage bases at each zone. On the FE exam, convert actual values to pu, analyze a network, then convert back to actual. Practical tip: pu system is powerful for multi-voltage systems; master it for complex power system problems.",
        keyPoints: [
          "Choose Sbase and Vbase at one location; compute Vbase at others via transformer turns ratio",
          "Zbase = Vbase²/Sbase; Zpu = Zactual/Zbase",
          "Impedance Zpu remains same even across transformer ideal 1:1 equivalents",
          "Sbase constant throughout system; easy power calculations in pu"
        ],
        formulas: ["Zbase = Vbase²/Sbase", "Vpu = Vactual/Vbase", "Ipu = Iactual/Ibase = Spu/Vpu", "Ppu = Pactual/Sbase"]
      },
      {
        title: "Transmission Lines: Models and Parameters",
        content: "Transmission lines transmit power over long distances; their distributed parameters (resistance, inductance, capacitance, conductance per unit length) significantly affect voltage drop and losses. Series impedance Z = R + jωL; shunt admittance Y = G + jωC per unit length. Short line (< 80 km): lumped model with series impedance; medium line (80-240 km): π or T equivalent circuit with series impedance and shunt capacitances; long line (> 240 km): distributed parameter model with hyperbolic functions. Surge impedance Z₀ = √(Z/Y) ≈ √(L/C) ≈ 200-400 Ω typically, important for transient response and reflection. Natural power Pnl = V²/Z₀ is power transmitted at no-load and matches natural frequency where system oscillates. Voltage regulation on transmission line depends on load, power factor, and circuit impedance. For a short line, voltage drop ΔV ≈ (R·P + X·Q)/V. At no load, charging current Ic = V·ωC·length can be significant. On the FE exam, compute voltage drop on transmission line, determine regulation, or identify line parameters from specifications. Practical tip: real and reactive components both matter; poor power factor (large Q) increases voltage drop even if real power P is moderate. Ferranti effect: light load on long line causes voltage rise due to line charging current.",
        keyPoints: [
          "Series impedance Z = R+jωL; shunt admittance Y = G+jωC per unit length",
          "Short line model: lumped; medium line: π or T equivalent; long line: hyperbolic functions",
          "Surge impedance Z₀ = √(Z/Y); natural power Pnl = V²/Z₀",
          "Voltage drop: ΔV ≈ (R·P+X·Q)/V; depends on both P and Q"
        ],
        formulas: ["Z₀ = √(Z/Y)", "Pnl = V²/Z₀", "Short line ΔV ≈ (RP+XQ)/V", "Medium line: π model with Z in series, Y/2 at each end"]
      },
      {
        title: "Power Factor Correction and Rotating Machines",
        content: "Power factor PF = cos(θ) = P/S measures the portion of apparent power actually transferred as real power; poor PF wastes money on reactive power that does no work. Inductive loads (motors, transformers) cause lagging current; capacitive loads (high-frequency circuits) cause leading current. Utilities penalize customers with PF < 0.95 lagging; correction adds shunt capacitors. Capacitor size: Qc = P(tan(θ₁) - tan(θ₂)) where θ₁ old angle, θ₂ desired angle. Induction motors are largest industrial loads: slip s = (Ns - N)/Ns where Ns is synchronous speed, N is actual. Torque τ = (3/2)·Ps·R₂'/(s·(R₁+R₂'²/(s)/(ω₀)². Synchronous motors run at synchronous speed always; field current controls power factor. On the FE exam, calculate capacitor size for power factor correction, determine motor slip and torque, or compute losses. Practical tip: reactive power causes heating in lines; utilities want PF near 1.0. Synchronous condensers (synchronous motors at no-load) can provide reactive power support.",
        keyPoints: [
          "Power factor PF = cos(θ) = P/S; inductive loads lag, capacitive lead",
          "Capacitor for correction: Qc = P(tan(θold)-tan(θnew))",
          "Induction motor: slip s = (Ns-N)/Ns; torque peak at specific slip (soft-start reduces inrush)",
          "Synchronous motor: speed = synchronous speed always; field current sets power factor"
        ],
        formulas: ["PF = cos(θ) = P/S = P/√(P²+Q²)", "Qc = P(tanθ₁-tanθ₂)", "Slip s = (Ns-N)/Ns", "Ns = 120·f/P where P is pole pairs"]
      }
    ]
  },
  {
    topicId: 11,
    title: "Electromagnetics",
    overview: "Covers fundamental electric and magnetic fields, Maxwell's equations in both forms, electromagnetic wave propagation, and transmission line theory from field perspective.",
    sections: [
      {
        title: "Electrostatics: Coulomb's Law and Gauss's Law",
        content: "Electrostatics describes stationary or slowly varying electric fields. Coulomb's law: force between point charges F = kQ₁Q₂/r² where k = 8.99×10⁹ N·m²/C²; in media k = 1/(4πε). Electric field E = F/q is force per unit positive charge; field lines point away from positive charges. Electric potential V(r) = kQ/r increases as you move away from negative charge; potential difference ΔV = -∫E·dr along a path is path-independent in conservative fields. Gauss's law ∮E·dA = Qenc/ε₀ states flux through closed surface equals enclosed charge divided by permittivity. This is powerful for symmetric geometries: infinite sheet E = σ/(2ε₀), infinite line E = λ/(2πε₀r), sphere E = kQ/r² outside, zero inside. Permittivity ε = ε₀εr where ε₀ = 8.854×10⁻¹² F/m and εr is relative permittivity (≈1 for vacuum, 2-80 for materials). Capacitance C = Q/V stores charge; parallel plate C = ε₀εrA/d. Energy stored U = ½CV² or ½QV. On the FE exam, apply Gauss's law for symmetric fields, compute potential, or find capacitance. Practical tip: Gauss's law is faster than Coulomb's law for symmetric geometry; choose the right tool.",
        keyPoints: [
          "Coulomb's law: F = kQ₁Q₂/r²; electric field E = F/q is force density",
          "Gauss's law: ∮E·dA = Qenc/ε₀; powerful for symmetric charge distributions",
          "Potential V = kQ/r; potential difference path-independent (conservative field)",
          "Capacitance C = ε₀εrA/d for parallel plate; energy U = ½CV²"
        ],
        formulas: ["Coulomb: F = kQ₁Q₂/r²", "Gauss: ∮E·dA = Qenc/ε₀", "E = -dV/dr", "C = ε₀εrA/d", "U = ½CV² = ½QV"]
      },
      {
        title: "Magnetostatics: Biot-Savart and Ampere's Law",
        content: "Magnetostatics describes steady currents and magnetic fields. Magnetic field B is measured in Tesla (T); field lines form closed loops around current-carrying conductors. Biot-Savart law: dB = (μ₀/4π)·(I·dl × r̂)/r² integrates current elements to find total B. Ampere's law ∮B·dl = μ₀Ienc is more practical for symmetric current distributions. Long straight wire: B = μ₀I/(2πr); cylindrical current I distributed uniformly: B = μ₀Ir/(2πa²) inside, outside same as point current. Solenoid: B ≈ μ₀nI inside (n turns per length), zero outside (ideal). Permeability μ = μ₀μr; diamagnetic materials (copper) have μr ≈ 1, paramagnetic (aluminum) μr > 1 slightly, ferromagnetic (iron) μr >> 1. Magnetic flux Φ = ∫B·dA measured in Weber (Wb). Magnetic circuit analogy: flux Φ corresponds to current, mmf (magnetomotive force) to voltage, reluctance ℜ to resistance: Φ = mmf/ℜ = nI/ℜ. Inductance L = Φ/I stores magnetic energy U = ½LI². Force on current-carrying wire F = I(L × B) where L is length vector. On the FE exam, apply Ampere's law, compute inductance of coils, or determine force on conductors. Practical tip: right-hand rule crucial—thumb in current direction, fingers curl in field direction.",
        keyPoints: [
          "Biot-Savart: integrate for asymmetric; Ampere's law ∮B·dl = μ₀Ienc for symmetric",
          "Long wire: B = μ₀I/(2πr); solenoid: B = μ₀nI",
          "Magnetic flux Φ = ∫B·dA; inductance L = Φ/I",
          "Force on wire: F = IL×B; energy U = ½LI²"
        ],
        formulas: ["Ampere: ∮B·dl = μ₀Ienc", "Long wire: B = μ₀I/(2πr)", "Solenoid: B = μ₀nI", "L = Φ/I", "U = ½LI²"]
      },
      {
        title: "Maxwell's Equations in Differential and Integral Forms",
        content: "Maxwell's four equations unify electricity and magnetism, predicting electromagnetic wave propagation. Gauss's law ∇·E = ρ/ε₀ (differential); ∮E·dA = Qenc/ε₀ (integral). No magnetic monopoles ∇·B = 0; ∮B·dA = 0. Faraday's law ∇ × E = -∂B/∂t; ∮E·dl = -dΦB/dt states changing magnetic flux induces electric field (basis for transformers, motors). Ampere-Maxwell law ∇ × B = μ₀(J + ε₀∂E/∂t); ∮B·dl = μ₀(Ienc + ε₀dΦE/dt) includes displacement current ε₀∂E/∂t which enables wave propagation. In free space with no charges or currents, ∇·E = ∇·B = 0 and curl equations become symmetric—wave equation ∇²E = μ₀ε₀∂²E/∂t² and ∇²B = μ₀ε₀∂²B/∂t² have plane wave solutions. Wave propagation velocity v = 1/√(μ₀ε₀) = c ≈ 3×10⁸ m/s. In materials, v = 1/√(με) = c/√(μrεr). On the FE exam, identify which equation applies (Gauss, no monopoles, Faraday, Ampere-Maxwell), or derive wave properties. Practical tip: Faraday's law explains why changing current in one loop induces voltage in another (mutual inductance); Ampere-Maxwell explains how light propagates.",
        keyPoints: [
          "Gauss: ∇·E = ρ/ε₀ relates electric field to charge",
          "No monopoles: ∇·B = 0 (no isolated magnetic charges)",
          "Faraday: ∇×E = -∂B/∂t relates changing B to induced E",
          "Ampere-Maxwell: ∇×B = μ₀(J+ε₀∂E/∂t) includes displacement current"
        ],
        formulas: ["∇·E = ρ/ε₀", "∇·B = 0", "∇×E = -∂B/∂t", "∇×B = μ₀J + μ₀ε₀∂E/∂t", "Wave speed: v = 1/√(με)"]
      },
      {
        title: "Wave Propagation and Plane Waves",
        content: "Electromagnetic waves propagate from Maxwell's equations in source-free regions. Plane wave solutions have electric and magnetic fields perpendicular to propagation direction and to each other: E(z,t) = E₀ cos(kz - ωt) x̂, B(z,t) = (E₀/v) cos(kz - ωt) ŷ. Wave number k = 2π/λ = ω/v relates spatial periodicity λ to temporal frequency ω and velocity v. Wavelength λ = v/f = 2πv/ω; in vacuum λ₀ = c/f. Skin depth δ = 1/√(πfμσ) describes how deep fields penetrate into conductors; at depth δ, field amplitude decays by factor e⁻¹ ≈ 0.37. In a good conductor, skin depth is tiny (e.g., copper at 60 Hz has δ ≈ 8.5 mm), confining current to surface. For conductors, loss tangent tan(δ) = σ/(ωε) determines whether field attenuates (lossy) or propagates (low-loss). Poynting vector S = E × H represents power flow per unit area (W/m²); average power Pave = ½Re(E × H*) for sinusoidal signals. On the FE exam, compute wavelength, skin depth, or power flow. Practical tip: skin depth explains why high-frequency signals are confined to wire surfaces; shielding with thin conductor works because fields attenuate over short distance.",
        keyPoints: [
          "Plane wave: E and B perpendicular to each other and propagation direction",
          "Wave number k = 2π/λ = ω/v; wavelength λ = v/f",
          "Skin depth δ = 1/√(πfμσ); field decays as e^(-z/δ) in conductor",
          "Poynting vector S = E×H; average power Pave = ½|E||H|cos(φ)"
        ],
        formulas: ["E(z,t) = E₀cos(kz-ωt)", "k = ω/v = 2π/λ", "λ = c/f in vacuum", "δ = 1/√(πfμσ)", "S = E×H, Pave = ½|E||H|cosφ"]
      },
      {
        title: "Transmission Lines: Characteristic Impedance and Reflections",
        content: "Transmission lines carry signals over distance; distributed L and C create waves that propagate at velocity v = 1/√(LC). Characteristic impedance Z₀ = √(L/C) is intrinsic property of the line, typically 50 Ω (coax), 75 Ω (TV cable), 300 Ω (open wire). Voltage and current on line: V(z,t) = V⁺e^(j(ωt-kz)) + V⁻e^(j(ωt+kz)) where V⁺ is forward (incident) wave, V⁻ is backward (reflected). At load impedance ZL, reflection coefficient Γ = (ZL - Z₀)/(ZL + Z₀) determines reflected amplitude. For matched load ZL = Z₀, Γ = 0 (no reflection). Open circuit ZL → ∞ gives Γ = 1 (total reflection, phase reversal at load). Short circuit ZL = 0 gives Γ = -1 (total reflection with 180° phase shift). Voltage Standing Wave Ratio VSWR = (1+|Γ|)/(1-|Γ|) measures mismatch; VSWR = 1 is perfect match, high VSWR indicates poor match causing reflections. Propagation velocity vp = c/√(εrμr); in free space vp = c. On the FE exam, compute reflection coefficient, VSWR, or impedance transformation. Practical tip: impedance matching prevents reflections and power loss; mismatched cable radiates energy.",
        keyPoints: [
          "Characteristic impedance Z₀ = √(L/C); typical values 50Ω (coax), 75Ω (video)",
          "Reflection coefficient Γ = (ZL-Z₀)/(ZL+Z₀); Γ=0 matched, Γ=±1 open/short",
          "VSWR = (1+|Γ|)/(1-|Γ|); VSWR=1 is matched, high VSWR is poor",
          "Voltage and current propagate at speed vp = c/√(εrμr)"
        ],
        formulas: ["Z₀ = √(L/C)", "Γ = (ZL-Z₀)/(ZL+Z₀)", "VSWR = (1+|Γ|)/(1-|Γ|)", "vp = c/√(εrμr)"]
      }
    ]
  },
  {
    topicId: 12,
    title: "Control Systems",
    overview: "Covers block diagram analysis and transfer function manipulation, stability analysis using Routh-Hurwitz and other criteria, root locus design, frequency response with Bode and Nyquist plots, and PID controller design with tuning methods.",
    sections: [
      {
        title: "Block Diagrams and Transfer Function Reduction",
        content: "Block diagrams represent systems graphically with blocks for components, arrows for signals, and junctions for combinations. Transfer function manipulations simplify complex diagrams to single input-output relationship. Series blocks: multiply transfer functions Gab = Ga·Gb. Parallel blocks: add transfer functions Gab = Ga + Gb. Feedback loops: negative feedback G(s) = Gforward/(1 + Gloop) where Gloop is product around loop; positive feedback uses minus sign in denominator. Mason's gain formula (for systems with multiple loops): overall gain = Σ(path gain × determinant of remaining graph)/(graph determinant). Path gain is product of transfer functions along a forward path; determinant includes all loop gains and products. Feedback reduces steady-state error (good) but also reduces bandwidth and increases sensitivity to forward-path uncertainty (tradeoffs). Stability determined by pole locations of closed-loop transfer function from block diagram reduction. On the FE exam, reduce block diagrams to single transfer function, or compute closed-loop gain. Practical tip: use feedback reduction formula systematically; verify block diagram topology before reducing (series vs parallel vs feedback).",
        keyPoints: [
          "Series: multiply; parallel: add; feedback: G = Gfwd/(1±Gloop)",
          "Mason's gain: overall = Σ(path gain × determinant)/(determinant)",
          "Negative feedback reduces error and non-linearities but increases sensitivity",
          "Closed-loop poles determine stability; locate from reduced transfer function"
        ],
        formulas: ["Series: Gab = Ga·Gb", "Parallel: Gab = Ga+Gb", "Feedback: G = Gfwd/(1+Gfb)", "Mason: G = ΣPkΔk/Δ"]
      },
      {
        title: "Stability Analysis: Routh-Hurwitz Criterion",
        content: "The Routh-Hurwitz criterion determines stability without computing poles explicitly. For characteristic polynomial D(s) = aₙs^n + aₙ₋₁s^(n-1) + ... + a₀, form Routh array with coefficients arranged in rows/columns. Rows alternate: first row from coefficients of even powers, second row from odd. Subsequent rows computed by determinant formula using previous rows; number of sign changes in first column equals number of RHP poles (system unstable if any). For stable system, all first-column entries must be positive; one sign change indicates one RHP pole. Special cases: if first element in row is zero, replace with small ε > 0 and examine limit; if entire row is zero, system has pairs of poles on imaginary axis (marginal stability). Routh array size depends on polynomial order; higher order polynomials require larger arrays. Advantage over pole calculation: algebraic method avoiding root-finding. On the FE exam, construct Routh array for 2nd-5th order polynomials, identify number of unstable poles. Practical tip: for 2nd order aₛ² + bs + c, stability requires a, b, c > 0 and bc > 0 (almost always true if first three are positive). Special case: 3rd order must check b·c > a·d to avoid imaginary axis poles.",
        keyPoints: [
          "Routh array first column signs indicate RHP poles; all positive = stable",
          "Rows computed from determinant using previous two rows; special cases for zero rows",
          "Sign changes in first column = number of RHP poles",
          "For 2nd/3rd order, simple coefficient conditions; higher orders need full array"
        ],
        formulas: ["D(s) = aₙs^n + aₙ₋₁s^(n-1) + ...", "Routh array: first two rows from coefficients, subsequent rows from determinants"]
      },
      {
        title: "Root Locus: Rules and System Design",
        content: "Root locus plots the path of closed-loop poles as a design parameter (typically gain K) varies from 0 to ∞. This visualizes how pole locations change with design choices. Rules for sketching: (1) locus starts at open-loop poles (K=0) and ends at zeros or ∞ (K→∞); (2) number of branches = order of characteristic equation; (3) locus is symmetric about real axis for real coefficients; (4) real-axis segments: include points where number of poles+zeros to the right is odd; (5) asymptotes approach ∞ at angles (2k+1)π/(n-m) where n=poles, m=zeros, k=0,1,...; (6) breakaway points where multiple branches meet have dD(s)/dK = 0. Angle criterion: point on locus if ∠(contributions from poles - contributions from zeros) = (2k+1)π. Magnitude criterion: gain K = |denominator|/|numerator| at points on locus. Design uses root locus to select K for desired response (damping ζ, natural frequency ωn). Compensators (lead, lag, PID) reshape root locus to achieve specifications. On the FE exam, sketch root locus for system, identify pole locations at specific gain, or determine gain for desired pole location. Practical tip: asymptotes and real axis segments narrow down locus shape quickly.",
        keyPoints: [
          "Root locus: closed-loop pole locations as K varies; starts at open-loop poles",
          "Ends at open-loop zeros or ∞; real axis segments where even number of poles/zeros to right",
          "Asymptotes: angles (2k+1)π/(n-m); centroid σ = Σpoles-Σzeros)/(n-m)",
          "Breakaway: dD(s)/dK = 0; design by selecting K to place poles for desired ζ, ωn"
        ],
        formulas: ["D(s) = 1 + KN(s)/D(s) = 0", "Asymptote angles: (2k+1)π/(n-m)", "Breakaway: dD(s)/dK = 0"]
      },
      {
        title: "Frequency Response: Bode and Nyquist Plots",
        content: "Frequency response shows how system responds to sinusoidal inputs at various frequencies. Bode plot is semi-log plot: magnitude (dB) vs log frequency, and phase vs log frequency. For transfer function G(jω), magnitude |G| = 20log₁₀(|G|) dB; phase ∠G in degrees. Simple terms contribute: constant K adds 20log₁₀K dB; pole at origin (1/s) is -90° phase always, -20 dB/decade slope; zero at origin (s) is +90°, +20 dB/decade; real pole at -a gives ωc = a and -20 dB/decade for ω > a; real zero at -a gives +20 dB/decade. Quadratic pole pair (complex conjugates) at resonance ωn shows peaking if ζ < 0.707; damping ζ controls peaking height. Gain margin (GM) is how much gain can increase before instability; phase margin (PM) is how much phase can lag before instability. GM = -|G(jωpc)| dB where ωpc is phase-crossover frequency (where ∠G = -180°). PM = 180° + ∠G(jωgc) where ωgc is gain-crossover frequency (where |G| = 1 or 0 dB). Stable system requires GM > 0 dB and PM > 0°. Nyquist plot is G(jω) in complex plane; system stable if encircles (-1, 0) zero times for stable open-loop. On the FE exam, sketch Bode magnitude and phase, extract GM and PM, or determine stability from Nyquist. Practical tip: key frequencies are pole/zero locations; between them, plot is straight lines in log-log.",
        keyPoints: [
          "Bode: magnitude in dB, phase in degrees, both vs log frequency",
          "Pole at origin: -20 dB/decade, -90°; zero: +20 dB/decade, +90°",
          "Gain margin (GM): magnitude margin at phase = -180°; phase margin (PM): phase margin at magnitude = 0 dB",
          "Stable: GM > 0 dB and PM > 0°; Nyquist: plot should not encircle -1"
        ],
        formulas: ["Magnitude: 20log₁₀|G(jω)| dB", "Phase: ∠G(jω) degrees", "GM = -|G(jωpc)| dB", "PM = 180° + ∠G(jωgc)"]
      },
      {
        title: "PID Controllers and Tuning Methods",
        content: "PID controllers combine Proportional, Integral, Derivative actions: u(t) = Kp·e(t) + Ki·∫e dt + Kd·de/dt where e is error. Proportional (P): immediate response, gain Kp increases responsiveness; too high causes oscillation. Integral (I): eliminates steady-state error for step inputs; increases phase lag risking instability. Derivative (D): predicts error (proportional to rate), adds phase lead stabilizing oscillations; noise-sensitive because differentiates high frequencies. Tuning methods: Ziegler-Nichols step response uses system time constant τ and delay θ: Kp = 1.2/(θ·Kproc), Ki = 0.6/(θ²·Kproc), Kd = 0.6·θ/Kproc for some process gain. Frequency-response method adjusts gain to crossover frequency and phase margin. Auto-tuning: excite system and measure response, compute PID parameters automatically. Anti-windup: integral term saturates if error very large; reset when output hits limits. On the FE exam, design simple PID controller by analysis or tuning rules, or predict closed-loop response. Practical tip: start with P, add I if steady-state error unacceptable, add D if overshooting. Tune one parameter at a time—interactions are complex.",
        keyPoints: [
          "P: instant response, no steady-state elimination; increases gain risk oscillation",
          "I: eliminates steady-state error, adds phase lag; I alone is integrator",
          "D: reduces overshoot, adds phase lead; sensitive to noise, rarely used alone",
          "Tuning: Ziegler-Nichols, frequency response, or auto-tuning methods"
        ],
        formulas: ["u(t) = Kp·e + Ki∫e dt + Kd·de/dt", "Ziegler-Nichols: Kp=1.2/(θ·K), Ki=0.6/(θ²·K), Kd=0.6θ/K"]
      },
      {
        title: "Time Domain Specifications: Overshoot, Settling Time, Steady-State Error",
        content: "Time-domain specs characterize transient and steady-state response to standard inputs (step, ramp). Overshoot OS is maximum amount output exceeds final value; for 2nd-order underdamped system OS = e^(-π·ζ/√(1-ζ²)) × 100%. Settling time ts is time to reach and stay within 2% (or 5%) of final value; for 2nd-order ts ≈ 4/(ζ·ωn) or 3/(ζ·ωn) depending on criterion. Rise time tr is time from 10% to 90% of final value; for underdamped 2nd order tr ≈ (π - arccos(ζ))/ωd where ωd = ωn√(1-ζ²) is damped frequency. Peak time tp = π/ωd. Steady-state error ess is difference between input and output at t→∞. For unity-feedback system, error = 1/(1+Kp) for step, 1/Kv for ramp, 1/Ka for acceleration where Kp, Kv, Ka are position, velocity, acceleration error constants. Type of system (number of integrators) determines which errors vanish: Type 0 has finite position error; Type 1 has zero position error, finite velocity error; Type 2 has zero velocity error, finite acceleration error. Specifications interrelated: faster rise time requires higher bandwidth, increasing steady-state error sensitivity to disturbances. On the FE exam, relate pole locations to time specs, compute steady-state error, or design for specifications. Practical tip: damping ratio ζ ≈ 0.7 is good compromise for overshoot ≈ 5% with reasonable speed.",
        keyPoints: [
          "Overshoot OS = e^(-πζ/√(1-ζ²)); settling time ≈ 4/(ζωn)",
          "Steady-state error: Type 0 → ess finite; Type 1 → ess = 0 for steps",
          "Error constants Kp, Kv, Ka depend on pole/zero structure",
          "ζ ≈ 0.7 gives overshoot ≈ 5%; faster response requires higher ωn"
        ],
        formulas: ["OS = e^(-πζ/√(1-ζ²))", "ts ≈ 4/(ζωn)", "ess = 1/(1+Kp) for step", "ωd = ωn√(1-ζ²)"]
      }
    ]
  },
  {
    topicId: 13,
    title: "Communications",
    overview: "Covers analog and digital modulation techniques, noise analysis including noise figure and SNR, channel capacity theory, and multiplexing methods for efficient spectrum utilization.",
    sections: [
      {
        title: "Analog Modulation: AM, FM, and Bandwidth",
        content: "Modulation shifts information signal (baseband) to higher frequency for transmission. Amplitude Modulation (AM): s(t) = Ac[1 + m(t)]cos(ωct) where Ac is carrier amplitude, m(t) is message (normalized |m| ≤ 1). Modulation index ma = max|m(t)|; if ma > 1, overmodulation causes distortion. AM bandwidth BW = 2fm where fm is maximum message frequency. Power: carrier power Pc, sideband power Ps = Pc·ma²/2; efficiency η = Ps/(Ps+Pc) = ma²/(2+ma²) ≈ 33% at ma=1. Frequency Modulation (FM): s(t) = Ac cos(ωct + β·sin(ωmt)) where β = Δf/fm is modulation index and Δf is frequency deviation. Carson's rule: BW ≈ 2(Δf + fm); unlike AM, bandwidth doesn't decrease with lower message frequency. FM advantageous: resistant to amplitude noise, wider bandwidth for better fidelity. PM (Phase Modulation) similar to FM with phase directly modulated. On the FE exam, compute AM bandwidth and power efficiency, or determine FM bandwidth. Practical tip: AM uses less bandwidth but is noise-sensitive; FM uses wider bandwidth but is noise-resistant (tradeoff between efficiency and robustness).",
        keyPoints: [
          "AM: s(t) = Ac[1+m(t)]cos(ωct); BW = 2fm; efficiency ≈ 33%",
          "FM: s(t) = Ac cos(ωct + βsin(ωmt)); BW ≈ 2(Δf+fm) by Carson's rule",
          "Modulation index: AM is ma, FM is β = Δf/fm",
          "AM bandwidth depends on message, FM doesn't (unlike AM, FM BW doesn't reduce with lower message freq)"
        ],
        formulas: ["AM: BW = 2fm, η = ma²/(2+ma²)", "FM: BW ≈ 2(Δf+fm)", "Modulation index: β = Δf/fm"]
      },
      {
        title: "Digital Modulation: ASK, FSK, PSK, QAM",
        content: "Digital modulation encodes bits as distinct signals. Amplitude Shift Keying (ASK): binary 0→low amplitude, 1→high amplitude; simplest but noise-sensitive. Frequency Shift Keying (FSK): 0→frequency f0, 1→frequency f1; more noise-resistant than ASK. Bandwidth BFSK ≈ 2(f1-f0) + 2B where B is message bandwidth. Phase Shift Keying (PSK): BPSK is simplest (0→phase 0, 1→phase π); 180° phase shift. QPSK (Quadrature PSK): 4 phases (00, 01, 10, 11) spaced 90° apart, transmits 2 bits per symbol. Efficiency: QPSK has 2 bits/symbol vs BPSK 1 bit/symbol; both have same bandwidth. Quadrature Amplitude Modulation (QAM): varies both amplitude and phase; 16-QAM has 16 constellation points (4 bits per symbol). Bandwidth for M-ary modulation Bdigital = B·2/log₂(M) where B is single-bit rate. Higher-order modulations (larger M) increase spectral efficiency but require better SNR. Bit-error rate (BER) for BPSK BER ≈ Q(√(2Eb/N0)) where Eb is energy per bit, N0 is noise power spectral density. On the FE exam, identify modulation type from constellation, compute bits per symbol, or determine bandwidth. Practical tip: higher-order modulations increase capacity but sensitivity to noise; tradeoff between spectral efficiency and robustness.",
        keyPoints: [
          "ASK (noise-sensitive), FSK (moderate), PSK (resistant), QAM (high spectral efficiency)",
          "BPSK: 1 bit/symbol; QPSK: 2 bits/symbol; 16-QAM: 4 bits/symbol",
          "Bandwidth: Bdigital = B·2/log₂(M); higher M increases efficiency",
          "BER depends on Eb/N0; higher modulation orders require higher SNR"
        ],
        formulas: ["ASK/FSK bandwidth ≈ 2·deviation+2B", "Digital bandwidth: B = B·2/log₂(M)", "BER_BPSK ≈ Q(√(2Eb/N0))"]
      },
      {
        title: "Noise and Signal-to-Noise Ratio (SNR)",
        content: "Noise degrades communication; understanding noise sources and SNR guides design. White noise has uniform power spectral density; colored noise varies with frequency. Thermal (Johnson) noise in resistor: Pn = kT·B where k=1.38×10⁻²³ J/K is Boltzmann constant, T is temperature (K), B is bandwidth. Shot noise in semiconductors from discrete charge carriers; 1/f noise dominates at low frequencies. Noise figure F = (SNRin)/(SNRout) quantifies noise added by amplifier; in dB, NF = 10log₁₀(F). Cascade noise figure: For stages F = F1 + (F2-1)/G1 + (F3-1)/(G1·G2) + ... where Gi are gains. First stage dominates; low-noise first stage critical. Noise temperature Te = (F-1)·T0 converts noise figure to equivalent input temperature. Signal-to-Noise Ratio SNR = Psignal/Pnoise; in dB, SNR = 10log₁₀(Psignal/Pnoise). On the FE exam, calculate thermal noise power, cascade noise figures, or determine SNR degradation. Practical tip: low-noise amplifier (LNA) as first stage minimizes system noise figure; doubling first-stage gain halves contribution of subsequent stages.",
        keyPoints: [
          "Thermal noise: Pn = kT·B; increases with temperature and bandwidth",
          "Noise figure F = SNRin/SNRout; smaller F is better",
          "Cascade: F ≈ F1 if G1 large; first stage dominates",
          "SNR in dB: 10log₁₀(Psignal/Pnoise); higher is better"
        ],
        formulas: ["Thermal noise: Pn = kT·B, k=1.38×10⁻²³ J/K", "Noise figure: F = SNRin/SNRout, NF_dB = 10log₁₀(F)", "Cascade: F = F1+(F2-1)/G1", "Te = (F-1)·T0"]
      },
      {
        title: "Channel Capacity and Shannon-Hartley Theorem",
        content: "Channel capacity C is maximum information rate (bits/sec) reliably transmissible over noisy channel. Shannon-Hartley theorem: C = B·log₂(1 + S/N) where B is bandwidth (Hz), S is signal power, N is noise power. This fundamental limit applies to any modulation scheme operating above it requires higher error rate. SNR dominates capacity; increasing SNR by 10 dB increases capacity by ~3.3 bits/sec per Hz of bandwidth. For bandwidth-limited channels, increasing B increases capacity logarithmically (diminishing returns). For power-limited channels (large B, low SNR), increasing power directly increases capacity. Practical implications: to increase capacity, either increase power (expensive), increase bandwidth (spectrum scarcity), or improve modulation efficiency (technology). Eb/N0 = (S/N)·(B/C) relates energy per bit to SNR and capacity; for reliable communication Eb/N0 must exceed threshold (e.g., ~9.6 dB for BPSK at 10⁻⁵ BER). On the FE exam, compute channel capacity, determine bandwidth needed for given rate, or compare modulation efficiency. Practical tip: log₂(1+SNR) is key; capacity scales with log(SNR), not linear.",
        keyPoints: [
          "Shannon capacity: C = B·log₂(1+S/N); limits all communication",
          "To increase capacity: boost power, increase bandwidth, or improve modulation",
          "log₂(1+SNR) dominates; every 10 dB SNR increase adds ~3.3 bits/s/Hz",
          "Eb/N0 threshold determines modulation feasibility; typically 5-10 dB for practical schemes"
        ],
        formulas: ["C = B·log₂(1+S/N)", "Eb/N0 = (S/N)·(B/C)", "C = B·log₂(1+SNR)"]
      },
      {
        title: "Multiplexing: TDM, FDM, CDM",
        content: "Multiplexing combines multiple signals onto single channel, increasing efficiency. Frequency Division Multiplex (FDM): each signal occupies distinct frequency band; signals separated in frequency. Guard bands prevent interference; total bandwidth = sum of signal bandwidths + guard bands. Example: telephone channels each 4 kHz, multiplexed in groups using FDM. Time Division Multiplex (TDM): signals take turns on channel during time slots; each signal gets full bandwidth for short burst. Total bandwidth = signal bandwidth; data rate = sum of individual rates. Synchronous TDM: fixed time slots (simple, wastes bandwidth if user inactive). Asynchronous TDM (statistical multiplexing): slots assigned dynamically to active users (efficient, more complex). Code Division Multiplex (CDM) or CDMA: each user has unique spreading code (pseudonoise sequence); all users transmit simultaneously on same frequency. Receiver decodes signal by correlating with user's code. CDMA capacity soft-limited by interference; users support depends on code quality and power control. Wavelength Division Multiplex (WDM) in fiber optics: similar to FDM using different optical wavelengths. On the FE exam, compare multiplexing schemes, compute required bandwidth, or analyze capacity. Practical tip: FDM used for analog, TDM for digital; CDM powerful for mobile where users have different codes.",
        keyPoints: [
          "FDM: separate frequencies; total BW = sum of signals + guards",
          "TDM: time slots; total BW = signal BW, but time-shared",
          "CDM/CDMA: unique codes, simultaneous transmission, soft capacity limit",
          "WDM: wavelength division in fiber; many channels on single fiber"
        ],
        formulas: ["FDM bandwidth: B_total = B1+B2+...+Bg (guards)", "TDM: data_rate = f1+f2+...", "CDM spreading gain = code_length"]
      }
    ]
  },
  {
    topicId: 14,
    title: "Computer Networks",
    overview: "Covers OSI and TCP/IP reference models with protocol layers, IP addressing and subnetting, network topologies and their characteristics, security mechanisms, and performance metrics.",
    sections: [
      {
        title: "OSI and TCP/IP Models",
        content: "OSI (Open Systems Interconnection) is seven-layer reference model: Physical (1) defines electrical/mechanical; Data Link (2) manages frames and MAC addresses; Network (3) handles routing and IP; Transport (4) manages TCP/UDP and flow control; Session (5) establishes connections; Presentation (6) handles encryption/compression; Application (7) provides user services (HTTP, SMTP, etc.). TCP/IP model (practical) has fewer layers: Link (physical+data link), Internet (IP routing), Transport (TCP/UDP), Application (protocols). TCP/IP is dominant in modern networks. Protocol layering encapsulates data: application adds headers (L7), passes to transport (L4), which adds transport header, then to IP (L3) adding IP header, then to link layer (L2) adding MAC frame. On transmission, each layer adds header (prepends); on reception, each layer removes its header. Ports (L4) identify applications: HTTP=80, HTTPS=443, SMTP=25, SSH=22, DNS=53, FTP=21. Routers operate L3 (IP); switches operate L2 (MAC); hubs operate L1 (physical). On the FE exam, identify protocol layer, describe encapsulation, or map service to port. Practical tip: remember top three layers (5,6,7) often merged in TCP/IP; lower layers define physical network.",
        keyPoints: [
          "OSI: 7 layers from Physical to Application; TCP/IP: 4 practical layers",
          "Encapsulation: each layer adds headers; decapsulation removes them",
          "Routers work L3, switches L2, hubs L1; ports identify L4 services",
          "Key protocols: IP, TCP, UDP, HTTP, DNS, SMTP, FTP"
        ],
        formulas: ["Encapsulation: Data + L7 header + L4 header + L3 header + L2 frame", "Port numbers: HTTP=80, HTTPS=443, SMTP=25, SSH=22, DNS=53"]
      },
      {
        title: "IP Addressing and Subnetting",
        content: "IPv4 address is 32 bits usually written in dotted decimal: 192.168.1.1. Address splits into network and host portions; network mask determines split. Classful addressing (legacy): Class A /8 (1-126), B /16 (128-191), C /24 (192-223). Classless CIDR (Classless Inter-Domain Routing) uses variable-length masks: /24 means 24 network bits, 8 host bits. Subnet mask in binary: all 1s for network, all 0s for host. 192.168.1.0/24 means network 192.168.1.0, hosts 192.168.1.1-.254, broadcast 192.168.1.255. Subnetting divides large network into smaller subnets: /24 network divided into /25 subnets gives 2 subnets of 128 addresses each. Number of usable hosts in subnet = 2^(32-prefix) - 2 (subtract network and broadcast). IPv6 addresses are 128 bits, written in hex: 2001:db8::1. Key operations: determine network address, broadcast address, usable hosts, summarize CIDR blocks. On the FE exam, convert between decimal, binary, CIDR notation; compute subnets; identify address class or type. Practical tip: memorize powers of 2 (256, 512, 1024, etc.) for quick host count calculations.",
        keyPoints: [
          "IPv4: 32 bits; classful (A/B/C) or CIDR notation; IPv6: 128 bits",
          "Subnet mask: /n means n network bits; hosts = 2^(32-n)-2",
          "Network address: set host bits to 0; broadcast: set host bits to 1",
          "CIDR summarization: aggregate contiguous blocks with common prefix"
        ],
        formulas: ["Usable hosts: 2^(32-prefix_length)-2", "Subnet size: 2^(32-prefix)", "Broadcast address: network | inverse_mask"]
      },
      {
        title: "Network Topologies",
        content: "Network topology describes physical or logical arrangement of devices. Star: central switch/hub; all devices connect to center. Advantage: easy to manage, one bad link affects only that device. Disadvantage: central point of failure. Ring: devices in loop; data passes through each node. Token ring: one token circulates; device with token can transmit. Advantage: deterministic access. Disadvantage: failed node breaks ring (needs bypass). Mesh: every device connects to every other (full mesh) or many others (partial mesh). Advantage: redundancy, multiple paths. Disadvantage: complex, high cost (N(N-1)/2 links for full mesh of N devices). Bus: devices share single medium (Ethernet originally); all receive all transmissions (broadcasting). CSMA/CD detects collisions. Advantage: simple. Disadvantage: half-duplex, collisions limit throughput. Tree (hierarchical): multiple levels with parent-child relationships; combines star and bus. Hybrid topologies combine advantages. On the FE exam, identify topology type, describe resilience/scalability, count links needed. Practical tip: modern networks use star (switches) with redundant links; mesh reserved for critical systems.",
        keyPoints: [
          "Star: central failure point but easy management; Ring: deterministic but breaks on failure",
          "Mesh: redundancy and multiple paths; full mesh needs N(N-1)/2 links",
          "Bus: simple, broadcast, half-duplex; modern replaced by switches",
          "Tree: hierarchical, combines features; hybrid for flexibility"
        ],
        formulas: ["Full mesh links: N(N-1)/2 for N devices", "Bus uses CSMA/CD collision detection"]
      },
      {
        title: "Network Security: Firewalls, Encryption, VPN",
        content: "Network security protects against unauthorized access and data interception. Firewall is gateway enforcing policy: stateful firewall examines packet contents and connection state (allows related return traffic). Packet filter: simple, low-cost, less secure. Proxy firewall: intermediary handling connections on behalf of clients (hides internal structure). Encryption converts plaintext to ciphertext using keys: symmetric (AES, DES) uses same key for encrypt/decrypt (fast, requires secure key exchange); asymmetric (RSA, ECC) uses public/private key pairs (slow, enables key exchange and signatures). Hash functions (MD5, SHA) provide integrity checking; output doesn't reverse to input. Digital signatures combine asymmetric encryption and hashing: sender signs with private key, receiver verifies with public key. VPN (Virtual Private Network) creates encrypted tunnel over public network; remote users appear on corporate network securely. Protocols: IPSec (L3), TLS (L4), secure protocols (HTTPS, SSH). Vulnerabilities: weak passwords, unpatched systems, social engineering, misconfiguration. On the FE exam, identify security mechanisms, explain encryption types, or describe VPN purpose. Practical tip: defense in depth: multiple layers (firewall, encryption, VPN, access control) beat single strong tool.",
        keyPoints: [
          "Firewall: stateful examines state; packet filter simple; proxy intermediary",
          "Symmetric encryption: fast, shared secret; asymmetric: enables exchange, signatures",
          "Hash: integrity check; digital signature: authentication + integrity",
          "VPN: encrypted tunnel; protocols IPSec, TLS, SSH, HTTPS"
        ],
        formulas: ["Symmetric key needed once per pair (slow distribution)", "Asymmetric: public key known, private secret"]
      },
      {
        title: "Network Performance: Throughput, Latency, Bandwidth",
        content: "Network performance metrics quantify quality of service. Bandwidth is channel capacity in bits/sec (bps); limited by medium (Ethernet 10/100/1000 Mbps, fiber Gbps+). Throughput is actual data rate achieved (≤ bandwidth due to overhead, collisions, protocol inefficiency). Latency (delay) is time for packet to traverse network: propagation delay = distance/speed (≈ 200 km/ms in fiber), transmission delay = bits/bandwidth, queuing delay (variable). Total delay = propagation + transmission + queuing + processing. Round-trip time (RTT): measure by ping (ICMP). Jitter is variation in latency; critical for voice/video. Packet loss: percentage of packets dropped (congestion, errors); retransmission increases effective latency. Quality of Service (QoS): prioritizes traffic (voice > video > data); reserves bandwidth for critical flows. Throughput limited by bottleneck: slowest link determines overall throughput (weakest link rule). On the FE exam, compute delays, identify bottlenecks, or describe QoS schemes. Practical tip: latency most critical for interactive (video calls need < 150 ms RTT); bandwidth most for bulk data. High jitter worse than high latency for real-time apps.",
        keyPoints: [
          "Bandwidth: link capacity; throughput: actual achieved rate",
          "Latency: propagation+transmission+queuing; RTT measures with ping",
          "Jitter: latency variation; critical for voice/video; high jitter bad",
          "Bottleneck: slowest link determines overall throughput"
        ],
        formulas: ["Transmission delay: delay = bits/bandwidth", "Propagation delay: distance/speed_of_light", "Total latency: prop+tx+queuing+processing"]
      }
    ]
  },
  {
    topicId: 15,
    title: "Digital Systems",
    overview: "Covers number system conversions and Boolean algebra, combinational logic gates and circuits, sequential logic with flip-flops and state machines, and memory systems including ROM, RAM, and FPGA.",
    sections: [
      {
        title: "Number Systems and Boolean Algebra",
        content: "Digital systems use binary (base 2), octal (base 8), hexadecimal (base 16). Binary to decimal: 1010₂ = 1·2³ + 0·2² + 1·2¹ + 0·2⁰ = 10₁₀. Hex to decimal: 2A₁₆ = 2·16¹ + 10·16⁰ = 42₁₀. Hex simplifies binary (4 bits = 1 hex digit). Boolean algebra uses variables (A, B) with values 0 (false) or 1 (true). Operations: AND (A·B = 1 only if both 1), OR (A+B = 1 if either 1), NOT (Ā = 1 if A=0). Boolean postulates: A+0=A, A·1=A, A+1=1, A·0=0, A+A=A, A·A=A, A+Ā=1, A·Ā=0. DeMorgan's laws: (A·B)' = A' + B' and (A+B)' = A'·B' useful for simplifying expressions. Truth table exhaustively lists all input combinations and outputs; complete specification. Karnaugh maps (K-maps) simplify Boolean expressions graphically: group adjacent 1s in rectangular blocks (powers of 2), fewer terms result. On the FE exam, convert number bases, simplify Boolean expressions with algebra or K-maps, derive logic functions from truth tables. Practical tip: K-maps beat algebra for ≤5 variables; larger uses Quine-McCluskey.",
        keyPoints: [
          "Binary/octal/hex conversion: use place values; group binary by 3 (octal) or 4 (hex)",
          "Boolean: AND (·), OR (+), NOT ('); DeMorgan: swap operators, complement all",
          "Karnaugh map: group adjacent 1s; 2 variables: 2×2, 3 variables: 2×4, etc.",
          "Minimize to fewest terms and fewest literals per term"
        ],
        formulas: ["DeMorgan: (A·B)' = A'+B', (A+B)' = A'·B'", "Conversion: binary ↔ decimal (place values), hex ↔ binary (groups of 4)"]
      },
      {
        title: "Combinational Logic: Multiplexers, Decoders, Adders",
        content: "Combinational circuits: output depends only on current inputs (no memory). Multiplexer (MUX): selects one of N inputs based on select lines; 2ⁿ inputs need n select lines. 4-to-1 MUX: Y = A·S̄₁·S̄₀ + B·S̄₁·S₀ + C·S₁·S̄₀ + D·S₁·S₀. Decoder: asserts one output for each input pattern; n inputs → 2ⁿ outputs. BCD to 7-segment decoder for LED displays common. Encoder: opposite; converts one active input to binary code. Priority encoder: handles multiple active inputs (lowest index has priority). Adder: half-adder sums two bits without carry-in. Full-adder: includes carry-in; sum = A ⊕ B ⊕ Cin, Cout = A·B + Cin·(A ⊕ B). Ripple-carry adder cascades full-adders; simple but slow (carry ripples through). Carry-lookahead accelerates by computing carry signals in parallel. Subtraction using 2's complement: invert all bits, add 1; subtractor uses same adder with inverted B. On the FE exam, design combinational circuits, derive truth tables, or predict outputs. Practical tip: understand MUX/decoder as fundamental blocks; most circuits built from these.",
        keyPoints: [
          "MUX: selects input; 4-to-1 needs 2 select lines; output = sum of active terms",
          "Decoder: n inputs → 2ⁿ outputs; common: 3-to-8, BCD to 7-segment",
          "Full-adder: sum = A⊕B⊕Cin; Cout = A·B+Cin·(A⊕B)",
          "Ripple-carry: simple, slow; carry-lookahead: faster, more complex"
        ],
        formulas: ["MUX: Y = Σ(Iₖ·Sₖ selected)", "Full adder: Sum=A⊕B⊕Cin, Cout=AB+Cin(A⊕B)"]
      },
      {
        title: "Sequential Logic: Flip-Flops, Counters, State Machines",
        content: "Sequential circuits have memory; output depends on past inputs. Flip-flop stores one bit; state changes on clock edge. SR (Set-Reset): S=1 sets to 1, R=1 resets to 0; S=R=1 undefined (race). D (Data): captures input on clock edge; Q = D at next clock. JK: J=1 sets, K=1 resets, J=K=1 toggles. T (Toggle): T=1 toggles, T=0 holds. Setup time tsu: data must be stable tsu before clock. Hold time th: data must be stable th after clock. Violation causes metastability (undefined state). Counter: cascades flip-flops; counts pulses. Binary counter: increments 0→1→2→...→2ⁿ-1→0. Mod-N counter: counts 0 to N-1. BCD counter counts 0-9. Asynchronous counter: ripple-carry (slow). Synchronous counter: all FF clock simultaneously (fast). State machine: FSM (Finite State Machine) with states (circles) and transitions (arrows). Moore output depends on state only; Mealy depends on state and input. Design: list states, create transition table, derive next-state logic. On the FE exam, analyze flip-flop circuits, design counters, or design simple FSMs. Practical tip: clock must satisfy setup and hold; use synchronous design for reliability.",
        keyPoints: [
          "D flip-flop: captures input; Q becomes D on clock edge",
          "SR: asynchronous control; JK: universal (works as D, T, SR)",
          "Counter: mod-N counts 0 to N-1; ripple async, synchronous parallel",
          "State machine: states (circles) + transitions (arrows); Moore or Mealy"
        ],
        formulas: ["Asynchronous delay: cumulative through cascaded FF", "Synchronous: all FF driven by same clock"]
      },
      {
        title: "Memory Systems: ROM, RAM, Cache, FPGA",
        content: "Memory stores data; characterized by access time, capacity, cost. ROM (Read-Only Memory): nonvolatile; data permanently stored. PROM (Programmable ROM): written once. EPROM (Erasable PROM): erased under UV light. EEPROM: electrically erasable. Flash: EEPROM variant, used in USB drives, SSDs. RAM (Random Access Memory): volatile; loses data without power. SRAM (Static): uses latches, fast, expensive, small capacity. DRAM (Dynamic): uses capacitors, slower, cheap, large capacity; requires periodic refresh (read-modify-write). Access time: time from address to data valid (ns). Cycle time: minimum time between accesses. Memory hierarchy: CPU registers (fastest, smallest), L1/L2 cache (fast, small, expensive), main RAM (larger, slower), disk (largest, slowest). Cache exploits locality: temporal (reuse soon) and spatial (nearby access). Cache lines: block of memory transferred together. Cache hit: data in cache (fast). Cache miss: data not in cache (slow). Associative/set-associative caches improve hit rate. FPGA (Field-Programmable Gate Array): configurable logic blocks + interconnect + I/O blocks. User programs logic and routing; reprogram without hardware change. On the FE exam, choose memory type for application, compute cache hit rate, or understand FPGA basics. Practical tip: cost-speed-capacity tradeoff: fast memory expensive; large memory slow. DRAM dominates because capacity/cost ratio excellent.",
        keyPoints: [
          "ROM nonvolatile, permanent; RAM volatile, temporary",
          "SRAM fast, small, expensive; DRAM large, slow, cheap; requires refresh",
          "Memory hierarchy: registers→cache→RAM→disk (faster = smaller/expensive)",
          "FPGA: reprogrammable logic, no physical change needed for new design"
        ],
        formulas: ["Access time: address to data valid", "Cache hit rate = hits/(hits+misses)", "Memory capacity = address_bits -> 2^address bytes"]
      }
    ]
  },
  {
    topicId: 16,
    title: "Computer Systems",
    overview: "Covers computer architecture including Von Neumann and Harvard models, memory hierarchy with caching and virtual memory, I/O and interfacing mechanisms, and performance metrics.",
    sections: [
      {
        title: "Computer Architecture: Von Neumann vs Harvard",
        content: "Von Neumann architecture (most common): single memory for both instructions and data accessed via shared bus. Advantages: simple, flexible (reallocate memory), uses less total memory. Disadvantages: bus bottleneck (von Neumann bottleneck) limiting throughput. Instruction fetch and data access compete for same bus. Harvard architecture: separate instruction and data memories with independent buses. Advantages: simultaneous instruction fetch and data access (parallel). Disadvantages: more complex, potential size mismatch (program > data or vice versa). Most modern CPUs use modified Harvard (cache-based) with separate L1 instruction and data caches. RISC (Reduced Instruction Set Computer): simple instructions, executes in few cycles, efficient pipelining. Load-store architecture: only load/store access memory; arithmetic on registers. Examples: MIPS, ARM, PowerPC. CISC (Complex Instruction Set Computer): complex instructions, variable cycle counts, powerful single instructions. Examples: x86, x86-64. Superscalar CPU: executes multiple instructions simultaneously; pipeline parallelism. Out-of-order execution: instructions execute when ready, not strict program order. Register file: fast temporary storage, 32-64 registers common. Stack: memory for function calls, local variables; grows downward (descending stack). On the FE exam, distinguish architectures, explain pipeline benefits, describe instruction types. Practical tip: RISC simpler, easier to analyze; CISC more powerful per instruction.",
        keyPoints: [
          "Von Neumann: single memory; Harvard: separate instruction/data",
          "RISC: simple, fast instructions, pipelinable; CISC: complex, variable cycles",
          "Superscalar: multiple instructions simultaneously; out-of-order: ready execution",
          "Pipeline: IF-ID-EX-MEM-WB stages; hazards (data, control) reduce efficiency"
        ],
        formulas: ["Speedup from parallelism: limited by critical path", "Pipeline throughput: 1 instruction/cycle (ideal)"]
      },
      {
        title: "Memory Hierarchy and Virtual Memory",
        content: "Memory hierarchy addresses speed-capacity tradeoff: CPU registers (< 1 KB, ~1 ns), L1 cache (32-64 KB, ~4 ns), L2 cache (256 KB-1 MB, ~10 ns), main RAM (GB, ~100 ns), disk (TB, ~10 ms). Access latencies increase dramatically at each level. Principle of locality: temporal (reused soon) and spatial (nearby used soon). Cache exploits locality: copy frequently-used data from slow memory. Cache line (block): unit of transfer, typical 64 bytes. Cache hit: data in cache (serve fast). Cache miss: data not in cache (fetch from lower level, slow). Hit rate affects performance: H hits, M misses, M hits. Average access time = H·tcache + M·tmem. L1-L2-L3 hierarchy: L1 smallest/fastest, L3 larger/slower. Write-through cache: write to cache and memory simultaneously. Write-back cache: write to cache only, mark dirty; write to memory on eviction. Virtual memory: simulates larger memory than physical. Page table translates virtual address to physical address. TLB (Translation Lookaside Buffer) caches recent translations. Page fault: requested page not in memory; fetch from disk (very slow). On the FE exam, compute cache hit rate, predict memory access cost, explain virtual memory purpose. Practical tip: L1 miss costs ~10 cycles, L2 miss ~100, memory ~400, disk ~10 million (massive difference).",
        keyPoints: [
          "Cache exploits locality: small, fast memory with copies of frequent data",
          "Hit rate: faster access; miss rate: stall, fetch lower level",
          "Levels: L1 (fast), L2 (larger), L3 (even larger), RAM",
          "Virtual memory: disk extends RAM; page faults very expensive"
        ],
        formulas: ["Average access time = h·tc + (1-h)·tm", "Hit rate h = hits/(hits+misses)", "Memory stall time = misses·miss_penalty"]
      },
      {
        title: "I/O and Interfacing: DMA, Interrupts, Bus Protocols",
        content: "I/O (Input/Output) connects peripherals (disk, network, keyboard, display) to CPU. Programmed I/O: CPU reads/writes I/O device registers (slow, wastes CPU cycles). Interrupt: device signals CPU asynchronously; CPU pauses current task to service interrupt. Interrupt handler: code executed in response to interrupt. Return from interrupt (RFI): restore state, resume interrupted code. Priority: maskable interrupts can be disabled; non-maskable (NMI) cannot (power fail, reset). DMA (Direct Memory Access): device transfers data directly to memory without CPU intervention. DMA controller manages transfer; CPU given notice on completion. Much faster than programmed I/O. Bus protocols define signal timing and handshaking: PCI, USB, PCIe, I2C. I2C (Inter-Integrated Circuit): two-wire (SDA, SCL), master-slave, common for sensors. SPI (Serial Peripheral Interface): four-wire (MOSI, MISO, CLK, CS), faster than I2C. USB: serial, hot-plug, power delivery. PCIe: high-speed, point-to-point, replaces PCI. Bandwidth: USB 2.0 ≈ 480 Mbps, USB 3.0 ≈ 5 Gbps, PCIe 4.0 ≈ 16 GT/s per lane. On the FE exam, distinguish I/O methods, explain interrupt flow, or describe bus protocol. Practical tip: DMA offloads CPU; essential for high-speed devices.",
        keyPoints: [
          "Programmed I/O: CPU controls all transfers (slow), Interrupt: device signals, DMA: device transfers directly",
          "Interrupt handler: device-specific code; priority determines order",
          "I2C, SPI, USB, PCIe: increasing speed and complexity",
          "DMA: CPU free for other tasks; controller manages transfer"
        ],
        formulas: ["Interrupt latency: time from request to handler execution", "DMA bandwidth: depends on bus protocol (USB, PCIe, etc)"]
      },
      {
        title: "Performance Metrics: CPI, MIPS, Amdahl's Law",
        content: "Performance metrics quantify CPU speed. Execution time = # instructions × CPI / clock frequency. CPI (Cycles Per Instruction): average cycles per instruction; ideal is 1, realistic 2-5 for superscalar. MIPS (Million Instructions Per Second) = freq(MHz) / CPI; higher MIPS → faster. FLOPS (Floating-point Operations Per Second): important for scientific computing. Clock frequency (GHz): higher frequency → more work per second, but power increases (cubic relationship). Amdahl's Law: speedup from improving one component = 1 / [(1-f) + f/S] where f is fraction affected, S is speedup of improved component. If only 50% of code can be parallelized (f=0.5), max speedup from parallelization is 2× (even with S→∞). Implication: diminishing returns; optimize bottlenecks. Throughput: tasks per second (important for servers). Latency: time per task (important for interactive). Power efficiency: performance per watt (critical for batteries, data centers). On the FE exam, compute performance metrics, apply Amdahl's law, identify bottlenecks. Practical tip: Amdahl's law shows why 99% parallelization limited by 1% sequential; focus on biggest gains.",
        keyPoints: [
          "CPI: cycles per instruction; MIPS: million instructions per second",
          "Execution time = #instructions × CPI / frequency; lower is better",
          "Amdahl: max speedup = 1/(1-f+f/S); diminishing returns from partial optimization",
          "Power-performance: frequency cubes, limiting factor in modern CPUs"
        ],
        formulas: ["CPI = cycles / instructions", "MIPS = frequency(MHz) / CPI", "Speedup = 1 / [(1-f) + f/S]", "Time = instructions × CPI / frequency"]
      }
    ]
  },
  {
    topicId: 17,
    title: "Software Development",
    overview: "Covers fundamental data structures, algorithm analysis and complexity, programming paradigms including OOP, software development lifecycle, and database concepts including SQL and normalization.",
    sections: [
      {
        title: "Data Structures: Arrays, Lists, Stacks, Queues, Trees, Hash Tables",
        content: "Arrays: fixed-size, contiguous memory, O(1) access by index, O(n) insertion/deletion. Multidimensional arrays: 2D (matrix), higher dimensions. Linked lists: dynamic size, O(1) insertion/deletion at known position, O(n) search. Singly-linked: each node has next pointer. Doubly-linked: next and previous pointers (bidirectional). Circular-linked: last node points to first. Stack (LIFO Last-In-First-Out): push adds, pop removes from top. Applications: function call stack, expression evaluation, undo/redo. Queue (FIFO First-In-First-Out): enqueue adds rear, dequeue removes front. Applications: task scheduling, BFS traversal. Priority queue: elements have priority; highest priority dequeued first. Trees: hierarchical, parent-child relationships. Binary tree: each node ≤ 2 children. Binary search tree (BST): left < node < right; O(log n) search if balanced. Balanced trees (AVL, Red-Black): maintain balance, O(log n) guaranteed. Heap: complete binary tree with heap property (max/min). Hash table: hash function maps keys to buckets. O(1) average lookup, O(n) worst-case. Collision resolution: chaining (linked list per bucket), open addressing (probe for empty). Load factor = size / capacity; rehash when load factor > threshold. On the FE exam, choose appropriate structure, analyze complexity, trace operations. Practical tip: hash tables fastest for lookups if collision handling good; trees preserve sorted order.",
        keyPoints: [
          "Arrays: O(1) access, O(n) insert; lists: O(1) insert, O(n) search",
          "Stack/Queue: restricted access (LIFO/FIFO); efficient for specific use cases",
          "BST: O(log n) if balanced, O(n) if degenerate; AVL/RB maintain balance",
          "Hash table: O(1) average, collision handling critical"
        ],
        formulas: ["Array access: O(1), insertion: O(n)", "BST balanced: O(log n), unbalanced: O(n)", "Hash lookup: O(1) average, O(n) worst", "Heap: parent at i, children at 2i+1, 2i+2"]
      },
      {
        title: "Algorithms and Complexity: Big-O Analysis, Sorting, Searching",
        content: "Big-O notation describes asymptotic upper bound on runtime. O(1): constant (hashtable lookup). O(log n): logarithmic (binary search). O(n): linear (simple loop). O(n log n): linearithmic (merge sort, quick sort average). O(n²): quadratic (bubble sort, insertion sort). O(2ⁿ): exponential (brute-force subsets). O(n!): factorial (permutations). Sorting algorithms: Bubble (O(n²), simple), Insertion (O(n²), good for small), Selection (O(n²), minimal swaps), Merge (O(n log n), stable, external), Quick (O(n log n) average, O(n²) worst, in-place, cache-friendly). Stable sort preserves relative order of equal elements (important for multi-key sorting). Searching: Linear (O(n), unsorted). Binary (O(log n), sorted). Hash table (O(1) average, O(n) worst). Recursion: function calling itself. Base case prevents infinite recursion. Divide-and-conquer: split problem, solve subproblems, combine (merge sort, quick sort). Dynamic programming: memoization avoids redundant computation (fibonacci, longest common subsequence). Greedy: choose locally optimal (Dijkstra's shortest path, Huffman coding). On the FE exam, analyze complexity of code, choose sorting algorithm, trace recursive functions. Practical tip: O(n log n) is practical limit for large n; O(n²) becomes painful > 10,000 elements.",
        keyPoints: [
          "Big-O: asymptotic upper bound; focus on dominant term",
          "O(n log n) sorts: merge, quick; faster than O(n²): bubble, insertion",
          "Binary search: O(log n) requires sorted data",
          "Recursion: base case essential; divide-and-conquer splits problem"
        ],
        formulas: ["Binary search time: O(log₂ n)", "Merge sort: T(n) = 2T(n/2) + O(n) = O(n log n)", "Fibonacci naive: O(2ⁿ), dynamic programming: O(n)"]
      },
      {
        title: "Programming Concepts: OOP, Recursion, Functional Programming",
        content: "Object-Oriented Programming (OOP): organizes code as objects (data + methods). Class: blueprint for objects (e.g., Car class). Instance: specific object (my red car). Encapsulation: hide internals, expose public interface. Inheritance: child class inherits from parent (code reuse). Polymorphism: same method name, different behavior (method overriding). Abstraction: expose essential, hide complex internals. Interfaces/abstract classes define contracts. Example: Animal (parent) with Speak() method; Dog (child) implements Speak() → \"Woof\". Benefits: modular, reusable, maintainable. Recursion: function calls itself with smaller input until base case. Stack stores function calls; deep recursion causes stack overflow. Tail recursion: last operation is recursive call; compiler optimizes to loop. Dynamic programming optimizes recursion with memoization. Functional programming: functions as first-class objects, immutability, avoid side effects. Higher-order functions: take/return functions (map, filter, reduce). Declarative: describe what, not how. Example: list.map(x → x*2) is more declarative than loop. On the FE exam, design simple OOP classes, trace recursion, analyze code paradigm. Practical tip: OOP dominant in industry; recursion elegant for trees/graphs; functional gaining popularity.",
        keyPoints: [
          "OOP: encapsulation, inheritance, polymorphism organize complex systems",
          "Recursion: elegant for hierarchical problems, watch for stack overflow",
          "Dynamic programming: memoization eliminates redundant computation",
          "Functional: immutable, pure functions, composable; declarative style"
        ],
        formulas: ["Recursion depth: proportional to input size", "Memoization cost: O(n) space for O(n²) problem = better tradeoff"]
      },
      {
        title: "Software Engineering: SDLC, Testing, Version Control",
        content: "Software Development Life Cycle (SDLC): structured process from requirements to deployment. Waterfall: sequential phases (requirements → design → code → test → deploy). Advantage: clear plan. Disadvantage: inflexible, late error detection. Agile/Scrum: iterative sprints (1-4 weeks), continuous feedback, adapt. Advantage: flexible, fast feedback. Disadvantage: requires discipline, scope creep risk. Testing: Unit (test functions), Integration (test components together), System (full system), Acceptance (user acceptance). Test-driven development (TDD): write tests before code. Code review: peer review catches bugs early. Version control (Git): track changes, branching, merging. Commit: save snapshot with message. Branch: parallel development. Merge: combine branches. Conflict: divergent changes must resolve manually. Continuous integration (CI): automated tests on every commit. Continuous deployment (CD): automated release to production. Bug tracking: assign, track, resolve issues. Documentation: comments (why code works), design docs (architecture). Debugging: print statements, step through with debugger, read stack trace. On the FE exam, describe SDLC phases, testing types, or version control workflow. Practical tip: testing early saves money; every hour in testing prevents 10+ hours in production debugging.",
        keyPoints: [
          "Waterfall: sequential, plan-heavy; Agile: iterative, feedback-driven",
          "Testing: unit→integration→system→acceptance; earlier detection cheaper",
          "Git: commit (snapshot), branch (parallel), merge (combine)",
          "CI/CD: automate testing and deployment; reduces human error"
        ],
        formulas: ["Cost of bug: development << testing << production (multiplier effect)"]
      },
      {
        title: "Databases: SQL, Normalization, Transactions",
        content: "Databases organize persistent data. Relational databases (SQL): tables with rows/columns. Primary key: unique identifier per row. Foreign key: references primary key in another table (relationships). SQL (Structured Query Language): query language. SELECT: retrieve; WHERE: filter; JOIN: combine tables. CREATE TABLE, INSERT, UPDATE, DELETE for data manipulation. Normalization: organize data to eliminate redundancy. First Normal Form (1NF): atomic values (no repeating groups). Second Normal Form (2NF): no partial dependencies (all non-key attributes depend on entire key). Third Normal Form (3NF): no transitive dependencies (non-key attributes depend only on key). Boyce-Codd Normal Form (BCNF): stricter. Denormalization: deliberately introduce redundancy for performance (tradeoff: faster queries, harder updates). Transactions: ACID properties. Atomicity: all-or-nothing. Consistency: valid state before/after. Isolation: concurrent transactions don't interfere. Durability: committed data survives failures. Indexes: accelerate lookups; slow writes. B-tree index: balanced tree of keys. Hash index: faster but unordered. Views: virtual tables (simplify queries). Stored procedures: SQL functions in database. On the FE exam, write simple SQL queries, design schema with normalization, describe transaction properties. Practical tip: 3NF usually good balance between normalization and performance; denormalize only when profiling shows bottleneck.",
        keyPoints: [
          "Relational: tables with rows/columns; primary/foreign keys define relationships",
          "SQL: SELECT (retrieve), INSERT, UPDATE, DELETE, JOIN",
          "Normalization: 1NF (atomic), 2NF (full dependency), 3NF (no transitive)",
          "ACID: atomicity, consistency, isolation, durability for reliability"
        ],
        formulas: ["Primary key: unique identifier", "Foreign key: references another table's primary key", "JOIN: combine tables on related columns"]
      }
    ]
  }
];

// Build the course record by mapping each topic's sections to curriculum IDs
export const FE_EE_COURSE: Record<string, TopicLesson> = {};

for (const topicData of STUDY_CONTENT_RAW) {
  const curriculumIds = TOPIC_MAPPING[topicData.topicId] || [];
  const topicSections = topicData.sections || [];

  // Map each section to its corresponding curriculum ID
  topicSections.forEach((section: any, idx: number) => {
    const currId = curriculumIds[idx] || curriculumIds[0] || `fee_topic${topicData.topicId}_${idx}`;

    const keyTakeaways = section.keyPoints || [];
    const formulaContent = (section.formulas || []).join('\n');

    FE_EE_COURSE[currId] = {
      topicId: currId,
      title: section.title,
      domainWeight: `${topicData.title} · FE EE`,
      overview: topicData.overview || '',
      sections: [{
        id: `${currId}_main`,
        title: section.title,
        content: section.content || '',
        examTip: formulaContent ? `Key formulas:\n${formulaContent}` : undefined,
      }],
      keyTakeaways,
    };
  });

  // If fewer sections than curriculum IDs, create stubs for remaining IDs
  for (let i = topicSections.length; i < curriculumIds.length; i++) {
    const currId = curriculumIds[i];
    if (!FE_EE_COURSE[currId]) {
      FE_EE_COURSE[currId] = {
        topicId: currId,
        title: currId.replace('fee_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        domainWeight: `${topicData.title} · FE EE`,
        overview: topicData.overview || '',
        sections: [{
          id: `${currId}_main`,
          title: 'Content',
          content: `Study material for this subtopic is covered in the main ${topicData.title} section. Review the study content and formula sheets for comprehensive coverage.`,
        }],
        keyTakeaways: [],
      };
    }
  }
}

export function hasFEEECourseContent(topicId: string): boolean {
  return topicId in FE_EE_COURSE;
}

export function getFEEECourseContent(topicId: string): TopicLesson | null {
  return FE_EE_COURSE[topicId] || null;
}
