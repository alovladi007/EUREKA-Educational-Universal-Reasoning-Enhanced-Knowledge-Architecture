/**
 * FE Mechanical Engineering — Flashcard Deck
 * 600+ flashcards covering all 16 FE ME topics.
 * Hand-crafted cards plus formula-derived cards from fme-formula-data.
 */

import { FME_FORMULA_SHEETS } from './fme-formula-data';

export interface FMEFlashcard {
  id: number;
  front: string;
  back: string;
  domain: string;
  domainName: string;
  category: string;
  topics: string[];
}

export const FME_FLASHCARD_DOMAINS = [
  { id: 'topic0', label: 'T0', name: 'Mathematics', count: 50 },
  { id: 'topic1', label: 'T1', name: 'Probability & Statistics', count: 40 },
  { id: 'topic2', label: 'T2', name: 'Computational Tools', count: 25 },
  { id: 'topic3', label: 'T3', name: 'Ethics', count: 25 },
  { id: 'topic4', label: 'T4', name: 'Engineering Economics', count: 40 },
  { id: 'topic5', label: 'T5', name: 'Statics', count: 45 },
  { id: 'topic6', label: 'T6', name: 'Dynamics & Vibrations', count: 55 },
  { id: 'topic7', label: 'T7', name: 'Mechanics of Materials', count: 55 },
  { id: 'topic8', label: 'T8', name: 'Material Science', count: 40 },
  { id: 'topic9', label: 'T9', name: 'Fluid Mechanics', count: 50 },
  { id: 'topic10', label: 'T10', name: 'Thermodynamics', count: 55 },
  { id: 'topic11', label: 'T11', name: 'Heat Transfer', count: 50 },
  { id: 'topic12', label: 'T12', name: 'Measurements & Controls', count: 35 },
  { id: 'topic13', label: 'T13', name: 'Mechanical Design', count: 50 },
  { id: 'topic14', label: 'T14', name: 'Manufacturing', count: 35 },
  { id: 'topic15', label: 'T15', name: 'Engineering Management', count: 30 },
] as const;

export const FME_FLASHCARD_CATEGORIES = ["concept", "definition", "formula", "comparison", "tip"] as const;

export let FME_FLASHCARD_COUNT = 680;

export const FME_FLASHCARDS: FMEFlashcard[] = [
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 0 — Mathematics (25 hand-crafted + formulas)
  // ═══════════════════════════════════════════════════════════════
  { id: 1, front: "What is the derivative of x^n?", back: "n·x^(n-1) — The power rule is the most commonly used derivative rule on the FE exam.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Calculus"] },
  { id: 2, front: "State the chain rule for derivatives.", back: "dy/dx = (dy/du)·(du/dx) — Differentiate the outer function, then multiply by the derivative of the inner function.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Calculus"] },
  { id: 3, front: "What is integration by parts?", back: "∫u dv = uv - ∫v du — Use LIATE to choose u: Log, Inverse trig, Algebraic, Trig, Exponential.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Calculus"] },
  { id: 4, front: "How do you find the volume of revolution using the disk method?", back: "V = π∫[f(x)]² dx — Rotate a function about an axis; each slice is a disk of radius f(x).", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Calculus"] },
  { id: 5, front: "What does a zero determinant mean for a matrix?", back: "The matrix is singular (not invertible). The system either has no solution or infinitely many solutions.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Linear Algebra"] },
  { id: 6, front: "How do you find eigenvalues?", back: "Solve det(A - λI) = 0 — The characteristic equation. For 2×2: λ² - trace·λ + det = 0.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Linear Algebra"] },
  { id: 7, front: "What is Cramer's Rule?", back: "x_i = det(A_i)/det(A) — Replace column i of A with vector b, take determinant, divide by det(A). Efficient for 2×2 and 3×3.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Linear Algebra"] },
  { id: 8, front: "What is a separable ODE and how do you solve it?", back: "Form: dy/dx = f(x)·g(y). Separate: dy/g(y) = f(x)dx. Integrate both sides independently.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Differential Equations"] },
  { id: 9, front: "For the ODE ay'' + by' + cy = 0, what does the discriminant tell you?", back: "b²-4ac > 0: overdamped (two real roots). = 0: critically damped (repeated root). < 0: underdamped (complex roots, oscillatory).", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Differential Equations"] },
  { id: 10, front: "What is the Final Value Theorem?", back: "lim(t→∞) f(t) = lim(s→0) s·F(s) — Finds steady-state value from the Laplace transform without inverting.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Laplace Transforms"] },
  { id: 11, front: "What is the physical meaning of the gradient ∇f?", back: "Points in the direction of steepest increase of scalar field f. Its magnitude equals the rate of increase.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Vector Calculus"] },
  { id: 12, front: "When is the dot product A·B zero?", back: "When vectors A and B are perpendicular (orthogonal). A·B = |A||B|cosθ, and cos(90°) = 0.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Vector Calculus"] },
  { id: 13, front: "What is Newton-Raphson's formula?", back: "x_{n+1} = x_n - f(x_n)/f'(x_n) — Quadratic convergence near simple roots. Needs derivative and good initial guess.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Numerical Methods"] },
  { id: 14, front: "Compare trapezoidal and Simpson's rule accuracy.", back: "Trapezoidal: O(h²). Simpson's 1/3: O(h⁴). Simpson's is much more accurate but requires an even number of intervals.", domain: "topic0", domainName: "Mathematics", category: "comparison", topics: ["Numerical Methods"] },
  { id: 15, front: "What is Euler's method for solving ODEs?", back: "y_{n+1} = y_n + h·f(x_n, y_n) — First-order accurate. Simple but needs small step size.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Numerical Methods"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 1 — Probability & Statistics (20 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 16, front: "State the addition rule of probability.", back: "P(A∪B) = P(A) + P(B) - P(A∩B) — Subtract overlap to avoid double-counting.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Probability"] },
  { id: 17, front: "What is Bayes' Theorem?", back: "P(A|B) = P(B|A)·P(A)/P(B) — Updates probability of A given new evidence B.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Probability"] },
  { id: 18, front: "What is the mean and variance of a binomial distribution?", back: "Mean = np, Variance = np(1-p). For n trials with success probability p per trial.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Distributions"] },
  { id: 19, front: "What is the 68-95-99.7 rule?", back: "For a normal distribution: 68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ of the mean.", domain: "topic1", domainName: "Probability & Statistics", category: "concept", topics: ["Distributions"] },
  { id: 20, front: "How do you convert to a standard normal distribution?", back: "Z = (X - μ)/σ — Converts any normal to N(0,1). Then use Z-tables for probabilities.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Distributions"] },
  { id: 21, front: "What is the Poisson distribution used for?", back: "Modeling the number of rare events in a fixed interval (time, area, volume). Mean = variance = λ.", domain: "topic1", domainName: "Probability & Statistics", category: "concept", topics: ["Distributions"] },
  { id: 22, front: "What does R² represent in regression?", back: "The fraction of variance in y explained by x. R² = 0.85 means 85% of variation is captured by the model.", domain: "topic1", domainName: "Probability & Statistics", category: "definition", topics: ["Regression"] },
  { id: 23, front: "How do you linearize y = ae^(bx) for regression?", back: "Take ln of both sides: ln(y) = ln(a) + bx. Plot ln(y) vs. x for a straight line.", domain: "topic1", domainName: "Probability & Statistics", category: "tip", topics: ["Regression"] },
  { id: 24, front: "What is the t-test statistic for a single mean?", back: "t = (x̄ - μ₀)/(s/√n) — Degrees of freedom = n-1. Compare to t-table critical value.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Hypothesis Testing"] },
  { id: 25, front: "What is a Type I error vs. Type II error?", back: "Type I (α): Rejecting a true H₀ (false positive). Type II (β): Failing to reject a false H₀ (false negative).", domain: "topic1", domainName: "Probability & Statistics", category: "comparison", topics: ["Hypothesis Testing"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 2 — Computational Tools (10 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 26, front: "What does $A$1 mean in a spreadsheet?", back: "Absolute reference — stays fixed when the formula is copied. $ locks the row and/or column.", domain: "topic2", domainName: "Computational Tools", category: "definition", topics: ["Spreadsheets"] },
  { id: 27, front: "What is Goal Seek in spreadsheets?", back: "A tool that adjusts one input cell to achieve a target output value. Essentially single-variable root-finding.", domain: "topic2", domainName: "Computational Tools", category: "definition", topics: ["Spreadsheets"] },
  { id: 28, front: "What is the difference between verification and validation?", back: "Verification: 'Did we solve the equations right?' (math check). Validation: 'Did we solve the right equations?' (physics check).", domain: "topic2", domainName: "Computational Tools", category: "comparison", topics: ["Modeling"] },
  { id: 29, front: "What does mesh refinement do in FEM?", back: "Finer mesh → more accurate results but higher computational cost. Results should converge as mesh is refined.", domain: "topic2", domainName: "Computational Tools", category: "concept", topics: ["Modeling"] },
  { id: 30, front: "What is the fundamental FEM equation?", back: "[K]{u} = {F} — Stiffness matrix times displacement vector equals force vector.", domain: "topic2", domainName: "Computational Tools", category: "formula", topics: ["Modeling"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 3 — Ethics (10 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 31, front: "What is the #1 priority in the NSPE Code of Ethics?", back: "Canon 1: Hold paramount the safety, health, and welfare of the public. Public safety always comes first.", domain: "topic3", domainName: "Ethics", category: "concept", topics: ["Codes of Ethics"] },
  { id: 32, front: "What are the four elements of negligence?", back: "Duty, Breach, Causation, and Damages. All four must be present to establish negligence.", domain: "topic3", domainName: "Ethics", category: "definition", topics: ["Liability"] },
  { id: 33, front: "What is the PE licensure pathway?", back: "ABET-accredited BS → FE exam → 4 years experience → PE exam. Each step is required.", domain: "topic3", domainName: "Ethics", category: "concept", topics: ["Licensure"] },
  { id: 34, front: "What is the industrial exemption?", back: "Engineers working for a company (not offering services to the public) may not need a PE license in some jurisdictions.", domain: "topic3", domainName: "Ethics", category: "definition", topics: ["Licensure"] },
  { id: 35, front: "When can an engineer reveal confidential information?", back: "Only with client/employer consent, or when necessary to protect public safety.", domain: "topic3", domainName: "Ethics", category: "tip", topics: ["Codes of Ethics"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 4 — Engineering Economics (15 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 36, front: "What is the compound interest formula?", back: "F = P(1+i)^n — Future value of present amount P at interest rate i for n periods.", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Time Value of Money"] },
  { id: 37, front: "What is the effective annual interest rate?", back: "i_eff = (1 + r/m)^m - 1 — Converts nominal rate r compounded m times/year to effective annual.", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Time Value of Money"] },
  { id: 38, front: "When should you use Annual Worth instead of Present Worth analysis?", back: "When alternatives have unequal lives. AW automatically handles different lifespans without finding LCM.", domain: "topic4", domainName: "Engineering Economics", category: "tip", topics: ["Cost Analysis"] },
  { id: 39, front: "What is the Benefit-Cost ratio criterion?", back: "B/C = PW(Benefits)/PW(Costs). Project is justified if B/C ≥ 1.0. Used primarily for public projects.", domain: "topic4", domainName: "Engineering Economics", category: "concept", topics: ["Cost Analysis"] },
  { id: 40, front: "What is straight-line depreciation?", back: "D = (B-S)/n — Equal annual deduction. B = initial cost, S = salvage value, n = life.", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Depreciation"] },
  { id: 41, front: "How does MACRS differ from other depreciation methods?", back: "MACRS always assumes salvage value = 0, uses half-year convention, and specific recovery periods. It is the US tax standard.", domain: "topic4", domainName: "Engineering Economics", category: "comparison", topics: ["Depreciation"] },
  { id: 42, front: "What is a tax shield?", back: "Tax savings = Depreciation × Tax rate. Depreciation reduces taxable income, creating a real cash benefit.", domain: "topic4", domainName: "Engineering Economics", category: "concept", topics: ["Depreciation"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 5 — Statics (15 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 43, front: "What are the 2D equilibrium equations?", back: "ΣFx = 0, ΣFy = 0, ΣM = 0 — Three equations for up to three unknowns.", domain: "topic5", domainName: "Statics", category: "formula", topics: ["Equilibrium"] },
  { id: 44, front: "How many reactions does a pin support provide?", back: "Two reactions: Fx and Fy. A roller provides 1 (perpendicular to surface). A fixed support provides 3 (Fx, Fy, M).", domain: "topic5", domainName: "Statics", category: "concept", topics: ["Equilibrium"] },
  { id: 45, front: "When should you use Method of Sections vs. Method of Joints?", back: "Sections: when you need force in ONE specific member (cut ≤3, use 3 equations). Joints: when finding ALL member forces.", domain: "topic5", domainName: "Statics", category: "comparison", topics: ["Trusses"] },
  { id: 46, front: "How do you identify zero-force members?", back: "At a joint with only two non-collinear members and no external load: both are zero-force. At a joint with three members (two collinear), no load: the non-collinear one is zero-force.", domain: "topic5", domainName: "Statics", category: "tip", topics: ["Trusses"] },
  { id: 47, front: "What is the parallel axis theorem?", back: "I = I_c + Ad² — Transfers moment of inertia from centroidal axis to a parallel axis distance d away.", domain: "topic5", domainName: "Statics", category: "formula", topics: ["Centroids"] },
  { id: 48, front: "What is the belt friction equation?", back: "T₂ = T₁·e^(μβ) — β must be in radians. T₂ = tight side, T₁ = slack side.", domain: "topic5", domainName: "Statics", category: "formula", topics: ["Friction"] },
  { id: 49, front: "What is the moment of inertia of a rectangle bh about its centroid?", back: "I = bh³/12 about the centroidal axis parallel to the base b.", domain: "topic5", domainName: "Statics", category: "formula", topics: ["Centroids"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 6 — Dynamics & Vibrations (20 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 50, front: "List the three constant-acceleration kinematic equations.", back: "v = v₀+at, s = s₀+v₀t+½at², v² = v₀²+2a(s-s₀). Know three of five variables to solve for the other two.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Kinematics"] },
  { id: 51, front: "What is normal (centripetal) acceleration?", back: "a_n = v²/ρ — Changes the direction of velocity. Points toward center of curvature. ρ = radius.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Kinematics"] },
  { id: 52, front: "For rolling without slipping, what are the constraints?", back: "v_center = Rω, a_center = Rα. The contact point has zero velocity (it is the instantaneous center).", domain: "topic6", domainName: "Dynamics & Vibrations", category: "concept", topics: ["Kinematics"] },
  { id: 53, front: "What is the mass moment of inertia of a solid cylinder?", back: "I = mr²/2 about the central axis. Same for a thin disk.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Kinetics"] },
  { id: 54, front: "When should you use work-energy vs. impulse-momentum?", back: "Work-energy: know forces and displacements. Impulse-momentum: know forces and time. Choosing correctly saves time.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "comparison", topics: ["Energy Methods"] },
  { id: 55, front: "What is the coefficient of restitution?", back: "e = (v₂'-v₁')/(v₁-v₂). e=1: perfectly elastic. e=0: perfectly plastic (objects stick). 0<e<1: real collision.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "definition", topics: ["Energy Methods"] },
  { id: 56, front: "What is the natural frequency of a spring-mass system?", back: "ω_n = √(k/m) in rad/s. f_n = ω_n/(2π) in Hz. Period T = 2π/ω_n.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Vibrations"] },
  { id: 57, front: "What is the damping ratio and what does it tell you?", back: "ζ = c/c_cr where c_cr = 2√(km). ζ<1: underdamped (oscillates). ζ=1: critically damped. ζ>1: overdamped.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "definition", topics: ["Vibrations"] },
  { id: 58, front: "When does vibration isolation occur?", back: "When ω/ω_n > √2 ≈ 1.414. The transmissibility TR < 1, meaning less force is transmitted to the foundation.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "concept", topics: ["Vibrations"] },
  { id: 59, front: "How do springs in series combine?", back: "1/k_eq = 1/k₁ + 1/k₂ (like resistors in parallel). Same force, deflections add. k_eq is less than the smallest individual k.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Vibrations"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 7 — Mechanics of Materials (20 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 60, front: "What is Hooke's Law?", back: "σ = Eε — Stress equals Young's modulus times strain, valid in the elastic (linear) region only.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Stress-Strain"] },
  { id: 61, front: "How is yield strength defined for most metals?", back: "By the 0.2% offset method: draw a line parallel to the elastic region at ε = 0.002. Where it intersects the curve = σ_y.", domain: "topic7", domainName: "Mechanics of Materials", category: "definition", topics: ["Stress-Strain"] },
  { id: 62, front: "What is the relationship between E, G, and ν?", back: "G = E/[2(1+ν)] — Shear modulus relates to Young's modulus through Poisson's ratio.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Stress-Strain"] },
  { id: 63, front: "What is the axial deformation formula?", back: "δ = FL/(AE) — For constant cross-section and load. F = force, L = length, A = area, E = modulus.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Axial Loading"] },
  { id: 64, front: "What is the torsion formula?", back: "τ = Tr/J — T = torque, r = radial distance, J = polar moment of inertia. Max stress at outer surface.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Torsion"] },
  { id: 65, front: "What is the polar moment of inertia for a solid shaft?", back: "J = πd⁴/32 — For a solid circular shaft of diameter d.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Torsion"] },
  { id: 66, front: "What is the flexure (bending stress) formula?", back: "σ = Mc/I — M = bending moment, c = distance to extreme fiber, I = area moment of inertia. Max at top/bottom.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Beams"] },
  { id: 67, front: "Where does maximum transverse shear stress occur in a beam?", back: "At the neutral axis. τ = VQ/(Ib). Shear stress is zero at the top and bottom surfaces.", domain: "topic7", domainName: "Mechanics of Materials", category: "concept", topics: ["Beams"] },
  { id: 68, front: "What is the principal stress formula?", back: "σ₁,₂ = (σx+σy)/2 ± √[((σx-σy)/2)² + τxy²] — Maximum and minimum normal stresses.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Combined Loading"] },
  { id: 69, front: "What is von Mises stress used for?", back: "Failure criterion for ductile materials: σ_vm = √(σ₁²-σ₁σ₂+σ₂²). Compare to σ_y for safety factor.", domain: "topic7", domainName: "Mechanics of Materials", category: "concept", topics: ["Combined Loading"] },
  { id: 70, front: "What is Euler's buckling load?", back: "P_cr = π²EI/(KL)² — Use minimum I. K depends on end conditions: 0.5 (fixed-fixed) to 2.0 (fixed-free).", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Columns"] },
  { id: 71, front: "When is Euler's formula NOT valid?", back: "When σ_cr = P_cr/A exceeds σ_y — the column fails by yielding, not buckling. Check slenderness ratio.", domain: "topic7", domainName: "Mechanics of Materials", category: "tip", topics: ["Columns"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 8 — Material Science (15 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 72, front: "How many atoms per unit cell in BCC, FCC, and HCP?", back: "BCC: 2, FCC: 4, HCP: 6. APF: BCC = 0.68, FCC = HCP = 0.74.", domain: "topic8", domainName: "Material Science", category: "definition", topics: ["Crystal Structures"] },
  { id: 73, front: "What is the eutectoid point on the Fe-C diagram?", back: "727°C, 0.76% C. Austenite transforms to pearlite (lamellar ferrite + cementite). Most tested point.", domain: "topic8", domainName: "Material Science", category: "concept", topics: ["Phase Diagrams"] },
  { id: 74, front: "What does quenching produce in steel?", back: "Martensite — a very hard, brittle BCT phase formed by rapid cooling from austenite. Must temper to restore ductility.", domain: "topic8", domainName: "Material Science", category: "concept", topics: ["Phase Diagrams"] },
  { id: 75, front: "What is the Hall-Petch equation?", back: "σ_y = σ₀ + k/√d — Yield strength increases with decreasing grain size d. Grain refinement strengthens.", domain: "topic8", domainName: "Material Science", category: "formula", topics: ["Strengthening"] },
  { id: 76, front: "What is the primary mechanism of plastic deformation in metals?", back: "Dislocation motion along slip planes. All strengthening mechanisms work by impeding dislocation movement.", domain: "topic8", domainName: "Material Science", category: "concept", topics: ["Crystal Structures"] },
  { id: 77, front: "What metals show a ductile-to-brittle transition?", back: "BCC metals (carbon steel) show DBTT. FCC metals (aluminum, copper, stainless steel) remain ductile at low temps.", domain: "topic8", domainName: "Material Science", category: "comparison", topics: ["Mechanical Properties"] },
  { id: 78, front: "What is the Gibbs Phase Rule?", back: "F = C - P + 2 — F = degrees of freedom, C = number of components, P = number of phases.", domain: "topic8", domainName: "Material Science", category: "formula", topics: ["Phase Diagrams"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 9 — Fluid Mechanics (15 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 79, front: "What is the hydrostatic pressure equation?", back: "p = p₀ + ρgh — Pressure increases linearly with depth h. Acts equally in all directions at a point.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Fluid Statics"] },
  { id: 80, front: "State Archimedes' principle.", back: "F_B = ρ_fluid·g·V_displaced — Buoyant force equals weight of displaced fluid.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Fluid Statics"] },
  { id: 81, front: "Write Bernoulli's equation.", back: "p/(ρg) + V²/(2g) + z = constant — Along a streamline for steady, incompressible, inviscid flow.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Fluid Dynamics"] },
  { id: 82, front: "What Reynolds number separates laminar from turbulent pipe flow?", back: "Re < 2300: laminar. Re > 4000: turbulent. 2300-4000: transition.", domain: "topic9", domainName: "Fluid Mechanics", category: "concept", topics: ["Fluid Dynamics"] },
  { id: 83, front: "What is the Darcy-Weisbach equation?", back: "h_f = f(L/D)(V²/2g) — Major head loss due to pipe friction. f from Moody chart or f=64/Re (laminar).", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Pipe Flow"] },
  { id: 84, front: "What are the pump affinity laws for the same pump?", back: "Q ∝ N, H ∝ N², P ∝ N³. Double speed → 2× flow, 4× head, 8× power.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Turbomachinery"] },
  { id: 85, front: "What is NPSH and why does it matter?", back: "Net Positive Suction Head. NPSH_A must exceed NPSH_R to prevent cavitation (vapor bubble formation and collapse).", domain: "topic9", domainName: "Fluid Mechanics", category: "concept", topics: ["Turbomachinery"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 10 — Thermodynamics (20 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 86, front: "What is the First Law for a closed system?", back: "Q - W = ΔU — Heat in minus work out equals change in internal energy.", domain: "topic10", domainName: "Thermodynamics", category: "formula", topics: ["Laws"] },
  { id: 87, front: "What is Carnot efficiency?", back: "η = 1 - T_L/T_H — Maximum possible efficiency. Temperatures MUST be absolute (K or R).", domain: "topic10", domainName: "Thermodynamics", category: "formula", topics: ["Laws"] },
  { id: 88, front: "What is the ideal gas law?", back: "PV = nRT. R_universal = 8.314 kJ/(kmol·K). Specific form: Pv = RT where R = R_u/M.", domain: "topic10", domainName: "Thermodynamics", category: "formula", topics: ["Properties"] },
  { id: 89, front: "What is quality (x) and when is it defined?", back: "x = (v-v_f)/(v_g-v_f) — Mass fraction of vapor. Only defined in the two-phase (wet) region, 0 ≤ x ≤ 1.", domain: "topic10", domainName: "Thermodynamics", category: "definition", topics: ["Properties"] },
  { id: 90, front: "What determines Otto cycle efficiency?", back: "η = 1 - 1/r^(γ-1) — Depends only on compression ratio r. Higher r = higher efficiency.", domain: "topic10", domainName: "Thermodynamics", category: "formula", topics: ["Cycles"] },
  { id: 91, front: "What happens at a throttle valve (expansion valve)?", back: "Isenthalpic: h_in = h_out. Irreversible: entropy increases. NOT isentropic. Common FE exam trap.", domain: "topic10", domainName: "Thermodynamics", category: "concept", topics: ["Cycles"] },
  { id: 92, front: "What is relative humidity?", back: "φ = p_v/p_g — Ratio of actual vapor pressure to saturated vapor pressure at the same temperature.", domain: "topic10", domainName: "Thermodynamics", category: "definition", topics: ["Psychrometrics"] },
  { id: 93, front: "What is the stoichiometric air composition?", back: "For each mole of O₂: 3.76 moles of N₂. Air is approximately 21% O₂ and 79% N₂ by volume.", domain: "topic10", domainName: "Thermodynamics", category: "concept", topics: ["Combustion"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 11 — Heat Transfer (15 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 94, front: "What is Fourier's law of conduction?", back: "q = -kA(dT/dx) — Heat flow proportional to temperature gradient. k = thermal conductivity.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Conduction"] },
  { id: 95, front: "What is the thermal resistance of a plane wall?", back: "R = L/(kA) — Analogous to electrical resistance. For composite walls, add resistances in series.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Conduction"] },
  { id: 96, front: "What is the critical radius of insulation?", back: "r_cr = k/h for a cylinder. Adding insulation when r < r_cr INCREASES heat loss (more surface area).", domain: "topic11", domainName: "Heat Transfer", category: "concept", topics: ["Conduction"] },
  { id: 97, front: "What is Newton's law of cooling?", back: "q = hA(T_s - T_∞) — Convection heat transfer. h = convection coefficient. R_conv = 1/(hA).", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Convection"] },
  { id: 98, front: "What is the Dittus-Boelter correlation?", back: "Nu = 0.023·Re^0.8·Pr^n — For turbulent pipe flow. n=0.4 for heating, 0.3 for cooling.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Convection"] },
  { id: 99, front: "What is the Stefan-Boltzmann law?", back: "E = εσT⁴ — σ = 5.67×10⁻⁸ W/(m²·K⁴). T must be in Kelvin. ε = emissivity (0 to 1).", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Radiation"] },
  { id: 100, front: "What is Kirchhoff's law of radiation?", back: "α = ε at thermal equilibrium — Absorptivity equals emissivity. Frequently tested on the FE exam.", domain: "topic11", domainName: "Heat Transfer", category: "concept", topics: ["Radiation"] },
  { id: 101, front: "When do you use LMTD vs. ε-NTU for heat exchangers?", back: "LMTD: when all four temperatures are known. ε-NTU: when outlet temps are unknown (design problems).", domain: "topic11", domainName: "Heat Transfer", category: "comparison", topics: ["Heat Exchangers"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 12 — Measurements & Controls (10 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 102, front: "What is the difference between accuracy and precision?", back: "Accuracy: closeness to true value. Precision: repeatability. A measurement can be precise but inaccurate.", domain: "topic12", domainName: "Measurements & Controls", category: "comparison", topics: ["Sensors"] },
  { id: 103, front: "What is the closed-loop transfer function?", back: "T(s) = G(s)/[1+G(s)H(s)] — For negative feedback. G = forward path, H = feedback.", domain: "topic12", domainName: "Measurements & Controls", category: "formula", topics: ["Controls"] },
  { id: 104, front: "What does each PID term do?", back: "P: reduces error (leaves offset). I: eliminates steady-state error. D: reduces overshoot and improves stability.", domain: "topic12", domainName: "Measurements & Controls", category: "concept", topics: ["Controls"] },
  { id: 105, front: "What is the Nyquist sampling criterion?", back: "f_s > 2·f_max — Sample at least 2× the highest frequency to avoid aliasing.", domain: "topic12", domainName: "Measurements & Controls", category: "formula", topics: ["Signal Processing"] },
  { id: 106, front: "What is a first-order system time constant?", back: "τ: at t=τ, response reaches 63.2% of final value. At t=5τ, approximately 99% (settled).", domain: "topic12", domainName: "Measurements & Controls", category: "concept", topics: ["Controls"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 13 — Mechanical Design (15 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 107, front: "What is the bolt preload equation with external load?", back: "F_b = F_i + CP, where C = k_b/(k_b+k_m). Typically C ≈ 0.2-0.3, so most load is carried by clamping.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Fasteners"] },
  { id: 108, front: "What is the bearing life equation for ball bearings?", back: "L₁₀ = (C/P)³ — Life in millions of revolutions. Double the load → life drops by factor of 8.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Bearings"] },
  { id: 109, front: "What is the gear speed ratio?", back: "ω₂/ω₁ = N₁/N₂ — Inversely proportional to tooth count. Larger gear rotates slower.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Gears"] },
  { id: 110, front: "What is the helical spring rate formula?", back: "k = Gd⁴/(8D³N_a) — Note d⁴: doubling wire diameter increases rate 16×.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Springs"] },
  { id: 111, front: "What is the approximate endurance limit for steels?", back: "S_e' ≈ 0.5·S_ut for S_ut < 200 ksi. Must modify with k factors (surface, size, loading, temp, reliability).", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Fatigue"] },
  { id: 112, front: "What is the Modified Goodman criterion?", back: "σ_a/S_e + σ_m/S_ut = 1/n — Apply K_f to alternating stress only, not mean stress.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Fatigue"] },
  { id: 113, front: "Do aluminum alloys have an endurance limit?", back: "No. Non-ferrous metals have no true endurance limit — the S-N curve keeps decreasing. Specify fatigue strength at N cycles.", domain: "topic13", domainName: "Mechanical Design", category: "concept", topics: ["Fatigue"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 14 — Manufacturing (10 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 114, front: "What is the Taylor tool life equation?", back: "VT^n = C — Higher cutting speed V → shorter tool life T. n depends on tool material (HSS ≈ 0.1, carbide ≈ 0.3).", domain: "topic14", domainName: "Manufacturing", category: "formula", topics: ["Machining"] },
  { id: 115, front: "What is the difference between hot working and cold working?", back: "Hot: above recrystallization temp, lower forces, no work hardening. Cold: below, higher forces, work hardens, better finish.", domain: "topic14", domainName: "Manufacturing", category: "comparison", topics: ["Forming"] },
  { id: 116, front: "What is the blanking/punching force?", back: "F = S_s × t × L — Shear strength × thickness × cut perimeter.", domain: "topic14", domainName: "Manufacturing", category: "formula", topics: ["Forming"] },
  { id: 117, front: "What is the difference between worst-case and statistical tolerancing?", back: "Worst-case: T = ΣT_i (add directly, guaranteed fit). Statistical: T = √(ΣT_i²) (RSS, tighter, ~99.73% fit).", domain: "topic14", domainName: "Manufacturing", category: "comparison", topics: ["Tolerancing"] },
  { id: 118, front: "What is the heat-affected zone (HAZ) in welding?", back: "The region next to the weld where the base metal's microstructure changed due to heat. May be the weakest zone.", domain: "topic14", domainName: "Manufacturing", category: "definition", topics: ["Forming"] },
  // ═══════════════════════════════════════════════════════════════
  // TOPIC 15 — Engineering Management (10 hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  { id: 119, front: "What is the critical path in project management?", back: "The longest path through the network diagram. Activities with zero slack. Determines minimum project duration.", domain: "topic15", domainName: "Engineering Management", category: "definition", topics: ["Project Management"] },
  { id: 120, front: "How do you calculate slack (float)?", back: "Slack = LS - ES = LF - EF. Activities with zero slack are on the critical path.", domain: "topic15", domainName: "Engineering Management", category: "formula", topics: ["Project Management"] },
  { id: 121, front: "What is the PERT expected time formula?", back: "t_e = (a + 4m + b)/6 — Weighted average of optimistic (a), most likely (m), pessimistic (b).", domain: "topic15", domainName: "Engineering Management", category: "formula", topics: ["Project Management"] },
  { id: 122, front: "What is the difference between Cp and Cpk?", back: "Cp: potential capability (if centered). Cpk: actual capability (accounts for off-center). If Cp high but Cpk low → recenter.", domain: "topic15", domainName: "Engineering Management", category: "comparison", topics: ["Quality"] },
  { id: 123, front: "What is Six Sigma's DPMO target?", back: "3.4 defects per million opportunities. Uses DMAIC: Define, Measure, Analyze, Improve, Control.", domain: "topic15", domainName: "Engineering Management", category: "concept", topics: ["Quality"] },
  { id: 124, front: "What is the Pareto principle?", back: "80/20 rule: roughly 80% of defects come from 20% of causes. Focus on the vital few.", domain: "topic15", domainName: "Engineering Management", category: "concept", topics: ["Quality"] },
  // ═══════════════════════════════════════════════════════════════
  // ADDITIONAL CARDS — Topics 0-15 (fill to 250+ hand-crafted)
  // ═══════════════════════════════════════════════════════════════
  // Mathematics extras
  { id: 125, front: "What is the Laplace transform of e^(-at)?", back: "L{e^(-at)} = 1/(s+a) — Fundamental transform for exponential decay.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Laplace Transforms"] },
  { id: 126, front: "What is L'Hopital's rule?", back: "If lim f(x)/g(x) gives 0/0 or ∞/∞, then the limit equals lim f'(x)/g'(x). Differentiate top and bottom separately.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Calculus"] },
  { id: 127, front: "What is the second derivative test for optimization?", back: "At critical point c: f''(c) > 0 → local minimum. f''(c) < 0 → local maximum. f''(c) = 0 → inconclusive.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Calculus"] },
  { id: 128, front: "How do you compute a 3×3 determinant?", back: "Expand along any row or column using cofactors. Each cofactor = (-1)^(i+j) × minor. Use the 'rule of Sarrus' for speed.", domain: "topic0", domainName: "Mathematics", category: "tip", topics: ["Linear Algebra"] },
  { id: 129, front: "What is the divergence theorem?", back: "∯F·dA = ∭(∇·F)dV — Surface flux equals volume integral of divergence. Used in fluid mechanics conservation equations.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Vector Calculus"] },
  { id: 130, front: "What is Green's Theorem?", back: "∮(Pdx + Qdy) = ∬(∂Q/∂x - ∂P/∂y)dA — Relates 2D line integral to double integral over enclosed region.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Vector Calculus"] },
  { id: 131, front: "What is the bisection method?", back: "Root-finding: if f(a)·f(b) < 0, root between a and b. Check midpoint, halve interval. Always converges, but slow (linear).", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Numerical Methods"] },
  { id: 132, front: "What is the difference between exact and inexact ODEs?", back: "Exact: M dx + N dy = 0 with ∂M/∂y = ∂N/∂x. Find potential function F where dF = Mdx + Ndy. Inexact needs integrating factor.", domain: "topic0", domainName: "Mathematics", category: "comparison", topics: ["Differential Equations"] },
  // Probability extras
  { id: 133, front: "What is the exponential distribution used for?", back: "Models time between events in a Poisson process. f(x) = λe^(-λx). Mean = 1/λ. Memoryless property.", domain: "topic1", domainName: "Probability & Statistics", category: "concept", topics: ["Distributions"] },
  { id: 134, front: "What is the Central Limit Theorem?", back: "The sampling distribution of the mean approaches normal as n increases, regardless of the population distribution.", domain: "topic1", domainName: "Probability & Statistics", category: "concept", topics: ["Distributions"] },
  { id: 135, front: "How do you use a Z-table?", back: "Convert X to Z = (X-μ)/σ. Look up Z in the table to find P(Z < z). For P(Z > z), use 1 - P(Z < z).", domain: "topic1", domainName: "Probability & Statistics", category: "tip", topics: ["Distributions"] },
  { id: 136, front: "What is the formula for sample variance?", back: "s² = Σ(X_i - x̄)²/(n-1) — Divide by n-1 (not n) for an unbiased estimate.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Descriptive Statistics"] },
  { id: 137, front: "When do you reject H₀?", back: "When |t| > t_critical (from t-table at significance level α with n-1 df). Or equivalently, when p-value < α.", domain: "topic1", domainName: "Probability & Statistics", category: "concept", topics: ["Hypothesis Testing"] },
  // Computational Tools extras
  { id: 138, front: "What is linear interpolation?", back: "y = y₁ + (x-x₁)(y₂-y₁)/(x₂-x₁) — Estimates a value between two known data points.", domain: "topic2", domainName: "Computational Tools", category: "formula", topics: ["Spreadsheets"] },
  { id: 139, front: "What are common element types in FEM?", back: "1D: beam/truss. 2D: triangle/quad (plane stress/strain). 3D: tetrahedron/hexahedron. Choose based on geometry.", domain: "topic2", domainName: "Computational Tools", category: "concept", topics: ["Modeling"] },
  // Ethics extras
  { id: 140, front: "What is strict liability?", back: "Liability without proof of fault. Applies to manufacturers of defective products — they are liable regardless of negligence.", domain: "topic3", domainName: "Ethics", category: "definition", topics: ["Liability"] },
  { id: 141, front: "What should an engineer do if a project endangers the public?", back: "Report concerns to employer first. If unresolved, escalate — ultimately public safety overrides loyalty to employer.", domain: "topic3", domainName: "Ethics", category: "tip", topics: ["Codes of Ethics"] },
  // Economics extras
  { id: 142, front: "What is the MARR?", back: "Minimum Attractive Rate of Return — the lowest rate of return an organization will accept. Used as discount rate for PW analysis.", domain: "topic4", domainName: "Engineering Economics", category: "definition", topics: ["Cost Analysis"] },
  { id: 143, front: "What is incremental analysis?", back: "Compare mutually exclusive alternatives by analyzing the DIFFERENCE in cash flows. Accept increment if Δ-ROR ≥ MARR.", domain: "topic4", domainName: "Engineering Economics", category: "concept", topics: ["Cost Analysis"] },
  { id: 144, front: "What is the payback period?", back: "Time to recover initial investment. Simple: n = Cost/Annual cash flow. Ignores time value of money — use for quick screening only.", domain: "topic4", domainName: "Engineering Economics", category: "definition", topics: ["Cost Analysis"] },
  { id: 145, front: "What is the capital recovery factor?", back: "A = P·[i(1+i)^n/((1+i)^n-1)] — Converts present amount to equivalent annual payment. (A/P, i, n).", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Time Value of Money"] },
  // Statics extras
  { id: 146, front: "How do you replace a distributed load with an equivalent force?", back: "Resultant = area under load diagram. Location = centroid of the load shape. Triangle: 1/3 from wider end.", domain: "topic5", domainName: "Statics", category: "concept", topics: ["Equilibrium"] },
  { id: 147, front: "What assumptions apply to ideal trusses?", back: "Frictionless pins at joints, loads only at joints, two-force members (axial only), negligible weight.", domain: "topic5", domainName: "Statics", category: "definition", topics: ["Trusses"] },
  { id: 148, front: "What is the moment of inertia of a circle about its centroid?", back: "I = πr⁴/4 = πd⁴/64 — About any centroidal diameter.", domain: "topic5", domainName: "Statics", category: "formula", topics: ["Centroids"] },
  { id: 149, front: "What is μ_s vs μ_k?", back: "μ_s = static friction coefficient (before sliding). μ_k = kinetic (during sliding). Always μ_s > μ_k.", domain: "topic5", domainName: "Statics", category: "comparison", topics: ["Friction"] },
  // Dynamics extras
  { id: 150, front: "What is the instantaneous center of zero velocity?", back: "The point about which a rigid body appears to rotate at that instant. All velocity vectors are perpendicular to lines from the IC.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "concept", topics: ["Kinematics"] },
  { id: 151, front: "What is the conservation of energy equation for dynamics?", back: "T₁ + V₁ = T₂ + V₂ — Valid when only conservative forces (gravity, springs) do work. T=KE, V=PE.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Energy Methods"] },
  { id: 152, front: "What is the relationship P = Tω?", back: "Power = Torque × Angular velocity. In SI: watts = N·m × rad/s. Essential for rotating machinery analysis.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Energy Methods"] },
  { id: 153, front: "What happens at resonance?", back: "When forcing frequency ω ≈ natural frequency ω_n, amplitude becomes very large. Damping limits but doesn't eliminate the peak.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "concept", topics: ["Vibrations"] },
  { id: 154, front: "What is the damped natural frequency?", back: "ω_d = ω_n√(1-ζ²) — Always less than ω_n. Only applies for underdamped systems (ζ < 1).", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Vibrations"] },
  // MoM extras
  { id: 155, front: "What is the relationship dV/dx = -w, dM/dx = V?", back: "Shear is negative derivative of distributed load. Moment is integral of shear. These build V and M diagrams.", domain: "topic7", domainName: "Mechanics of Materials", category: "concept", topics: ["Beams"] },
  { id: 156, front: "Where does maximum moment occur in a beam?", back: "Where V = 0 or changes sign. This is the critical location for bending stress.", domain: "topic7", domainName: "Mechanics of Materials", category: "tip", topics: ["Beams"] },
  { id: 157, front: "What is the Tresca criterion?", back: "Maximum shear stress theory: τ_max ≤ σ_y/2. Conservative for ductile materials. Simpler than von Mises.", domain: "topic7", domainName: "Mechanics of Materials", category: "concept", topics: ["Combined Loading"] },
  { id: 158, front: "How do angles work on Mohr's circle?", back: "Angles on Mohr's circle are DOUBLE the physical angles. A 45° physical rotation = 90° on Mohr's circle.", domain: "topic7", domainName: "Mechanics of Materials", category: "tip", topics: ["Combined Loading"] },
  { id: 159, front: "What is Poisson's ratio?", back: "ν = -ε_lateral/ε_axial. Typically 0.25-0.35 for metals. Relates how a material contracts laterally when stretched.", domain: "topic7", domainName: "Mechanics of Materials", category: "definition", topics: ["Stress-Strain"] },
  // Material Science extras
  { id: 160, front: "What is the Lever Rule?", back: "In a two-phase region: W_α = (C_β - C₀)/(C_β - C_α). Gives weight fraction of each phase based on composition.", domain: "topic8", domainName: "Material Science", category: "formula", topics: ["Phase Diagrams"] },
  { id: 161, front: "What is precipitation hardening?", back: "Strengthening by fine precipitates that block dislocation motion. Example: Al-Cu alloys (2024-T6). Requires solution treatment + aging.", domain: "topic8", domainName: "Material Science", category: "concept", topics: ["Strengthening"] },
  { id: 162, front: "What is the difference between annealing and normalizing?", back: "Both heat above A₃. Annealing: slow furnace cool (softest). Normalizing: air cool (finer pearlite, moderate strength).", domain: "topic8", domainName: "Material Science", category: "comparison", topics: ["Phase Diagrams"] },
  { id: 163, front: "What is galvanic corrosion?", back: "When two dissimilar metals are in electrical contact with an electrolyte. The more anodic (active) metal corrodes preferentially.", domain: "topic8", domainName: "Material Science", category: "concept", topics: ["Corrosion"] },
  // Fluid Mechanics extras
  { id: 164, front: "What is the continuity equation?", back: "A₁V₁ = A₂V₂ for steady, incompressible flow. Conservation of mass: what goes in must come out.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Fluid Dynamics"] },
  { id: 165, front: "What is the friction factor for laminar pipe flow?", back: "f = 64/Re — No Moody chart needed. For turbulent flow, use the Moody chart with Re and ε/D.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Pipe Flow"] },
  { id: 166, front: "What is the exit loss coefficient?", back: "K = 1.0 for a pipe discharging into a large tank. Sharp entrance K = 0.5. These are standard minor loss values.", domain: "topic9", domainName: "Fluid Mechanics", category: "concept", topics: ["Pipe Flow"] },
  { id: 167, front: "What is specific speed used for?", back: "N_s classifies pump type: low N_s = radial (centrifugal), medium = mixed flow, high = axial. Helps select pump configuration.", domain: "topic9", domainName: "Fluid Mechanics", category: "concept", topics: ["Turbomachinery"] },
  { id: 168, front: "What causes boundary layer transition?", back: "Laminar → turbulent at Re_x ≈ 5×10⁵ on a flat plate. Turbulent BL has higher skin friction but resists separation better.", domain: "topic9", domainName: "Fluid Mechanics", category: "concept", topics: ["External Flow"] },
  // Thermodynamics extras
  { id: 169, front: "What is the difference between c_p and c_v?", back: "c_p: specific heat at constant pressure. c_v: at constant volume. c_p - c_v = R. γ = c_p/c_v.", domain: "topic10", domainName: "Thermodynamics", category: "comparison", topics: ["Properties"] },
  { id: 170, front: "What are the four processes in the Rankine cycle?", back: "1→2: Pump (isentropic). 2→3: Boiler (constant P). 3→4: Turbine (isentropic). 4→1: Condenser (constant P).", domain: "topic10", domainName: "Thermodynamics", category: "concept", topics: ["Cycles"] },
  { id: 171, front: "What is the Brayton cycle used for?", back: "Gas turbines and jet engines. Efficiency: η = 1 - 1/r_p^((γ-1)/γ). Depends only on pressure ratio.", domain: "topic10", domainName: "Thermodynamics", category: "concept", topics: ["Cycles"] },
  { id: 172, front: "What is the COP relationship for heat pumps?", back: "COP_HP = COP_R + 1. Heat pump COP is always at least 1 greater than refrigerator COP.", domain: "topic10", domainName: "Thermodynamics", category: "formula", topics: ["Cycles"] },
  { id: 173, front: "What is the dew point temperature?", back: "Temperature at which air becomes saturated (φ = 100%) if cooled at constant pressure and humidity ratio.", domain: "topic10", domainName: "Thermodynamics", category: "definition", topics: ["Psychrometrics"] },
  { id: 174, front: "What is the equivalence ratio Φ?", back: "Φ = AF_stoich/AF_actual. Φ < 1: lean (excess air). Φ = 1: stoichiometric. Φ > 1: rich (excess fuel).", domain: "topic10", domainName: "Thermodynamics", category: "definition", topics: ["Combustion"] },
  // Heat Transfer extras
  { id: 175, front: "What is the thermal-electrical analogy?", back: "q ↔ I (current), ΔT ↔ V (voltage), R_thermal ↔ R_electrical. Series resistances add. q = ΔT/R.", domain: "topic11", domainName: "Heat Transfer", category: "concept", topics: ["Conduction"] },
  { id: 176, front: "What is the Nusselt number?", back: "Nu = hL/k_fluid. Dimensionless convection coefficient. Links empirical correlations to the heat transfer coefficient h.", domain: "topic11", domainName: "Heat Transfer", category: "definition", topics: ["Convection"] },
  { id: 177, front: "What is the Rayleigh number?", back: "Ra = Gr·Pr = gβΔTL³/(να). Parameter for natural convection correlations. Higher Ra → stronger buoyancy-driven flow.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Convection"] },
  { id: 178, front: "Why must radiation temperatures be absolute?", back: "Stefan-Boltzmann law uses T⁴. The formula E = εσT⁴ requires Kelvin or Rankine. Using °C or °F gives wrong answers.", domain: "topic11", domainName: "Heat Transfer", category: "tip", topics: ["Radiation"] },
  { id: 179, front: "What is the LMTD formula?", back: "ΔT_lm = (ΔT₁-ΔT₂)/ln(ΔT₁/ΔT₂). For counterflow: ΔT₁ = T_h,in-T_c,out; ΔT₂ = T_h,out-T_c,in.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Heat Exchangers"] },
  // Controls extras
  { id: 180, front: "What is the strain gauge factor?", back: "GF (gauge factor) ≈ 2 for metal foil gauges. ΔR/R = GF·ε. Connects resistance change to strain.", domain: "topic12", domainName: "Measurements & Controls", category: "formula", topics: ["Sensors"] },
  { id: 181, front: "How does a thermocouple work?", back: "Seebeck effect: voltage generated at junction of two different metals proportional to temperature difference.", domain: "topic12", domainName: "Measurements & Controls", category: "concept", topics: ["Sensors"] },
  { id: 182, front: "What is the 2% settling time?", back: "t_s ≈ 4/(ζω_n) — Time for a second-order system step response to stay within 2% of the final value.", domain: "topic12", domainName: "Measurements & Controls", category: "formula", topics: ["Controls"] },
  // Mechanical Design extras
  { id: 183, front: "What meshing requirement must gears satisfy?", back: "Two meshing gears must have the SAME diametral pitch (or module) and the same pressure angle.", domain: "topic13", domainName: "Mechanical Design", category: "concept", topics: ["Gears"] },
  { id: 184, front: "What is the radial force in a spur gear mesh?", back: "W_r = W_t·tan(φ). φ = pressure angle (typically 20°). This is the separating force between gears.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Gears"] },
  { id: 185, front: "What is the spring index C?", back: "C = D/d (mean coil diameter / wire diameter). Typical range 4-12. Too small → hard to manufacture. Too large → tangling.", domain: "topic13", domainName: "Mechanical Design", category: "definition", topics: ["Springs"] },
  { id: 186, front: "What is K_f in fatigue analysis?", back: "Fatigue stress concentration factor: K_f = 1 + q(K_t - 1). q = notch sensitivity. Apply to ALTERNATING stress only.", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Fatigue"] },
  { id: 187, front: "What is the critical speed of a shaft?", back: "The speed at which resonance occurs with lateral vibration. Design: operate < 0.7·ω_cr or > 1.3·ω_cr.", domain: "topic13", domainName: "Mechanical Design", category: "concept", topics: ["Shafts"] },
  // Manufacturing extras
  { id: 188, front: "What is MRR in turning?", back: "Material Removal Rate = V·f·d. V = cutting speed (πDN), f = feed, d = depth of cut.", domain: "topic14", domainName: "Manufacturing", category: "formula", topics: ["Machining"] },
  { id: 189, front: "What is the difference between blanking and punching?", back: "Blanking: the punched-out piece IS the product. Punching: the remaining sheet IS the product (the hole matters).", domain: "topic14", domainName: "Manufacturing", category: "comparison", topics: ["Forming"] },
  { id: 190, front: "What is the recrystallization temperature?", back: "≈ 0.3-0.5 × T_melt (in K). Hot working is above this temp (no work hardening). Cold working is below.", domain: "topic14", domainName: "Manufacturing", category: "concept", topics: ["Forming"] },
  // Management extras
  { id: 191, front: "What are the seven basic quality tools?", back: "Cause-effect diagram, check sheet, control chart, histogram, Pareto chart, scatter diagram, flowchart.", domain: "topic15", domainName: "Engineering Management", category: "definition", topics: ["Quality"] },
  { id: 192, front: "What does DMAIC stand for?", back: "Define, Measure, Analyze, Improve, Control — the Six Sigma improvement methodology.", domain: "topic15", domainName: "Engineering Management", category: "definition", topics: ["Quality"] },
  { id: 193, front: "What indicates a process is out of control?", back: "Point beyond control limits, 7+ consecutive points on one side of center, or systematic patterns (trends, cycles).", domain: "topic15", domainName: "Engineering Management", category: "concept", topics: ["Quality"] },
  // ═══════════════════════════════════════════════════════════════
  // BATCH 3 — Additional depth cards to reach 600+ total
  // ═══════════════════════════════════════════════════════════════
  { id: 194, front: "What is the arc length formula?", back: "L = ∫√(1+[f'(x)]²) dx — Length of curve y=f(x) from a to b.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Calculus"] },
  { id: 195, front: "What is a partial derivative?", back: "∂f/∂x: differentiate f(x,y) with respect to x while treating y as a constant. Used for multivariable functions.", domain: "topic0", domainName: "Mathematics", category: "definition", topics: ["Calculus"] },
  { id: 196, front: "What is the trace of a matrix?", back: "Sum of diagonal elements. For 2×2 [[a,b],[c,d]]: trace = a+d. Sum of eigenvalues = trace.", domain: "topic0", domainName: "Mathematics", category: "definition", topics: ["Linear Algebra"] },
  { id: 197, front: "What is the half-life formula?", back: "t₁/₂ = ln(2)/|k| — Time for quantity to halve in exponential decay y = y₀e^(kt), k < 0.", domain: "topic0", domainName: "Mathematics", category: "formula", topics: ["Differential Equations"] },
  { id: 198, front: "What is the cross product used for?", back: "Finds a vector perpendicular to both inputs. |A×B| = |A||B|sinθ = area of parallelogram. Zero for parallel vectors.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Vector Calculus"] },
  { id: 199, front: "What is fixed-point iteration?", back: "Rewrite f(x)=0 as x=g(x), iterate x_{n+1} = g(x_n). Converges if |g'(x)| < 1 near the fixed point.", domain: "topic0", domainName: "Mathematics", category: "concept", topics: ["Numerical Methods"] },
  { id: 200, front: "What is the mean and variance of a Poisson distribution?", back: "Both equal λ. Mean = λ, Variance = λ. This is a unique property of the Poisson distribution.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Distributions"] },
  { id: 201, front: "What is the complement rule?", back: "P(A') = 1 - P(A). Often easier to calculate P(not A) and subtract from 1.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Probability"] },
  { id: 202, front: "What is conditional probability?", back: "P(A|B) = P(A∩B)/P(B). Probability of A given that B has occurred.", domain: "topic1", domainName: "Probability & Statistics", category: "formula", topics: ["Probability"] },
  { id: 203, front: "What does a confidence interval tell you?", back: "A 95% CI means: if we repeated the experiment many times, 95% of intervals would contain the true parameter.", domain: "topic1", domainName: "Probability & Statistics", category: "concept", topics: ["Hypothesis Testing"] },
  { id: 204, front: "What is the power of a test?", back: "Power = 1 - β = probability of correctly rejecting a false H₀. Higher power → better at detecting real effects.", domain: "topic1", domainName: "Probability & Statistics", category: "definition", topics: ["Hypothesis Testing"] },
  { id: 205, front: "What is a mixed cell reference?", back: "$A1: column locked, row adjusts. A$1: row locked, column adjusts. Useful when copying across or down.", domain: "topic2", domainName: "Computational Tools", category: "definition", topics: ["Spreadsheets"] },
  { id: 206, front: "What are boundary conditions in FEM?", back: "Prescribed displacements (Dirichlet) or forces (Neumann) at mesh boundaries. Essential for a unique solution.", domain: "topic2", domainName: "Computational Tools", category: "concept", topics: ["Modeling"] },
  { id: 207, front: "Can an engineer accept gifts from a client?", back: "Only if it does not create a conflict of interest and is disclosed. Substantial gifts that could influence judgment are prohibited.", domain: "topic3", domainName: "Ethics", category: "concept", topics: ["Codes of Ethics"] },
  { id: 208, front: "What is the standard of care?", back: "The level of skill and diligence a reasonably competent engineer would exercise under similar circumstances.", domain: "topic3", domainName: "Ethics", category: "definition", topics: ["Liability"] },
  { id: 209, front: "What is an arithmetic gradient in TVM?", back: "Cash flow that increases by a constant amount G each period. P_G = G·[((1+i)^n-in-1)/(i²(1+i)^n)].", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Time Value of Money"] },
  { id: 210, front: "What is the rate of return method?", back: "Find interest rate i* that makes PW = 0. If i* ≥ MARR, the investment is justified.", domain: "topic4", domainName: "Engineering Economics", category: "concept", topics: ["Cost Analysis"] },
  { id: 211, front: "What is double declining balance depreciation?", back: "D_k = (2/n)·BV_{k-1}. Rate = 2/n. Never depreciate below salvage value. Switch to SL when SL gives more.", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Depreciation"] },
  { id: 212, front: "What is the breakeven formula?", back: "Q_BE = Fixed costs/(Price - Variable cost per unit). Volume at which revenue equals total costs.", domain: "topic4", domainName: "Engineering Economics", category: "formula", topics: ["Cost Analysis"] },
  { id: 213, front: "How do you determine if a structure is statically determinate?", back: "Count unknowns vs. equilibrium equations. 2D: 3 equations. If unknowns = 3 → determinate. More → indeterminate.", domain: "topic5", domainName: "Statics", category: "concept", topics: ["Equilibrium"] },
  { id: 214, front: "What is the centroid of a triangle from its base?", back: "h/3 from the base, where h is the triangle height. Area = bh/2.", domain: "topic5", domainName: "Statics", category: "formula", topics: ["Centroids"] },
  { id: 215, front: "What is a couple?", back: "Two equal, opposite, non-collinear forces. Creates a pure moment M = F·d. Effect is the same regardless of location.", domain: "topic5", domainName: "Statics", category: "definition", topics: ["Equilibrium"] },
  { id: 216, front: "What is the angular equivalent of v = v₀ + at?", back: "ω = ω₀ + αt — Angular velocity under constant angular acceleration.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Kinematics"] },
  { id: 217, front: "What is the parallel axis theorem for mass moment of inertia?", back: "I_O = I_G + md² — Same form as area version, but uses mass instead of area.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Kinetics"] },
  { id: 218, front: "What is the total KE of a rolling body?", back: "T = ½mv_G² + ½I_Gω². For rolling without slip: T = ½(I_G + mR²)ω².", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Rigid Body"] },
  { id: 219, front: "What is angular momentum?", back: "H = Iω. Newton's rotational law: ΣM = dH/dt. Conserved when no external torques.", domain: "topic6", domainName: "Dynamics & Vibrations", category: "formula", topics: ["Kinetics"] },
  { id: 220, front: "What is the section modulus S?", back: "S = I/c — Moment of inertia divided by distance to extreme fiber. σ_max = M/S. Useful for beam design.", domain: "topic7", domainName: "Mechanics of Materials", category: "definition", topics: ["Beams"] },
  { id: 221, front: "What is the angle of twist for a shaft?", back: "φ = TL/(GJ) — In radians. T=torque, L=length, G=shear modulus, J=polar moment.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Torsion"] },
  { id: 222, front: "How do you solve statically indeterminate axial problems?", back: "Write equilibrium + compatibility (deformation) + force-deformation (δ=FL/AE) equations. Solve the system.", domain: "topic7", domainName: "Mechanics of Materials", category: "tip", topics: ["Axial Loading"] },
  { id: 223, front: "What is 1 horsepower in ft-lb/s?", back: "1 hp = 550 ft·lb/s. In SI: 1 hp ≈ 745.7 W. Essential for power-torque conversions.", domain: "topic7", domainName: "Mechanics of Materials", category: "formula", topics: ["Torsion"] },
  { id: 224, front: "What is the difference between toughness and resilience?", back: "Toughness: total area under σ-ε curve (total energy to fracture). Resilience: area under elastic portion only.", domain: "topic8", domainName: "Material Science", category: "comparison", topics: ["Mechanical Properties"] },
  { id: 225, front: "What is true stress and true strain?", back: "σ_true = σ_eng(1+ε_eng). ε_true = ln(1+ε_eng). Account for changing cross-section during tensile test.", domain: "topic8", domainName: "Material Science", category: "formula", topics: ["Mechanical Properties"] },
  { id: 226, front: "What is the modulus of resilience?", back: "U_r = σ_y²/(2E) — Maximum elastic energy per unit volume. Area of triangle under elastic stress-strain curve.", domain: "topic8", domainName: "Material Science", category: "formula", topics: ["Mechanical Properties"] },
  { id: 227, front: "What is the center of pressure?", back: "y_R = y_c + I_xc/(y_c·A). Where the resultant hydrostatic force acts. Always below the centroid.", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["Fluid Statics"] },
  { id: 228, front: "What is the drag force equation?", back: "F_D = C_D·½ρV²·A. C_D from tables/charts; A = reference area (usually frontal for bluff bodies).", domain: "topic9", domainName: "Fluid Mechanics", category: "formula", topics: ["External Flow"] },
  { id: 229, front: "What are the assumptions for Bernoulli's equation?", back: "Steady flow, incompressible, inviscid (no friction), along a streamline. Violating any requires the general energy equation.", domain: "topic9", domainName: "Fluid Mechanics", category: "concept", topics: ["Fluid Dynamics"] },
  { id: 230, front: "What is the Kelvin-Planck statement?", back: "No heat engine can convert ALL heat to work — there must be some heat rejection. Sets theoretical limits.", domain: "topic10", domainName: "Thermodynamics", category: "concept", topics: ["Laws"] },
  { id: 231, front: "What is an isentropic process?", back: "Reversible + adiabatic. Entropy constant (s₁ = s₂). For ideal gas: PV^γ = const and T₂/T₁ = (P₂/P₁)^((γ-1)/γ).", domain: "topic10", domainName: "Thermodynamics", category: "definition", topics: ["Properties"] },
  { id: 232, front: "How do you determine the state of water/steam?", back: "Compare T to T_sat at given P (or P to P_sat at given T). Below = subcooled liquid. Above = superheated vapor. At = two-phase.", domain: "topic10", domainName: "Thermodynamics", category: "tip", topics: ["Properties"] },
  { id: 233, front: "What is the overall heat transfer coefficient U?", back: "1/U = 1/h_i + R_wall + 1/h_o. Combines convection on both sides and wall conduction into one coefficient.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Heat Exchangers"] },
  { id: 234, front: "What is the NTU in heat exchanger analysis?", back: "NTU = UA/C_min. Number of Transfer Units. Higher NTU → higher effectiveness. C = ṁc_p.", domain: "topic11", domainName: "Heat Transfer", category: "definition", topics: ["Heat Exchangers"] },
  { id: 235, front: "What is the view factor summation rule?", back: "ΣF_ij = 1 for all j in an enclosure. All radiation leaving surface i must reach some surface.", domain: "topic11", domainName: "Heat Transfer", category: "formula", topics: ["Radiation"] },
  { id: 236, front: "What is a Wheatstone bridge used for?", back: "Measures small resistance changes (strain gauges). Balanced when R₁R₃ = R₂R₄. Output voltage proportional to strain.", domain: "topic12", domainName: "Measurements & Controls", category: "concept", topics: ["Sensors"] },
  { id: 237, front: "What is the ADC resolution formula?", back: "Resolution = Full Scale Range / 2^n. n = number of bits. More bits = finer resolution.", domain: "topic12", domainName: "Measurements & Controls", category: "formula", topics: ["Signal Processing"] },
  { id: 238, front: "What is aliasing?", back: "When sampling rate < 2·f_max, high-frequency signals appear as low-frequency artifacts. Prevented by the Nyquist criterion.", domain: "topic12", domainName: "Measurements & Controls", category: "definition", topics: ["Signal Processing"] },
  { id: 239, front: "What SAE Grade 8 bolt properties?", back: "Proof strength: 120 ksi. Tensile strength: 150 ksi. Highest common grade. Marked with 6 radial lines on head.", domain: "topic13", domainName: "Mechanical Design", category: "concept", topics: ["Fasteners"] },
  { id: 240, front: "How does doubling load affect ball bearing life?", back: "L₁₀ = (C/P)³. Double P → (C/2P)³ = (1/8)·(C/P)³. Life drops by factor of 8.", domain: "topic13", domainName: "Mechanical Design", category: "concept", topics: ["Bearings"] },
  { id: 241, front: "What does an idler gear do?", back: "Changes rotation direction but does NOT affect the speed ratio. Useful for direction control in gear trains.", domain: "topic13", domainName: "Mechanical Design", category: "concept", topics: ["Gears"] },
  { id: 242, front: "What is the Soderberg criterion?", back: "σ_a/S_e + σ_m/S_y = 1/n. More conservative than Goodman (uses S_y instead of S_ut for mean stress).", domain: "topic13", domainName: "Mechanical Design", category: "formula", topics: ["Fatigue"] },
  { id: 243, front: "What tool materials are ranked from toughest to hardest?", back: "HSS (toughest) → Carbide → Ceramic → CBN → Diamond (hardest). Higher hardness = higher cutting speed capability.", domain: "topic14", domainName: "Manufacturing", category: "comparison", topics: ["Machining"] },
  { id: 244, front: "What is the difference between SMAW, GMAW, and GTAW?", back: "SMAW (stick): manual, versatile. GMAW (MIG): wire-fed, high production. GTAW (TIG): tungsten, high quality for thin sections.", domain: "topic14", domainName: "Manufacturing", category: "comparison", topics: ["Forming"] },
  { id: 245, front: "What is a clearance fit?", back: "Shaft maximum size is always less than hole minimum size. Always a positive gap between parts.", domain: "topic14", domainName: "Manufacturing", category: "definition", topics: ["Tolerancing"] },
  { id: 246, front: "What is the Gantt chart?", back: "Horizontal bar chart showing task schedule. Easy to read timeline but doesn't clearly show dependencies like network diagrams.", domain: "topic15", domainName: "Engineering Management", category: "definition", topics: ["Project Management"] },
  { id: 247, front: "What is the PERT variance formula?", back: "σ² = ((b-a)/6)² for a single activity. Project variance = sum of critical path activity variances.", domain: "topic15", domainName: "Engineering Management", category: "formula", topics: ["Project Management"] },
  { id: 248, front: "What Cpk value indicates a capable process?", back: "Cpk ≥ 1.33 is considered capable. Cpk < 1.0 means excessive defects. Six Sigma targets Cpk ≈ 2.0.", domain: "topic15", domainName: "Engineering Management", category: "concept", topics: ["Quality"] },
  { id: 249, front: "What is the forward pass in CPM?", back: "Calculate ES (earliest start) and EF (earliest finish) left to right. EF = ES + Duration. ES of successor = max(EF of predecessors).", domain: "topic15", domainName: "Engineering Management", category: "concept", topics: ["Project Management"] },
  { id: 250, front: "What is the backward pass in CPM?", back: "Calculate LF (latest finish) and LS (latest start) right to left. LS = LF - Duration. LF of predecessor = min(LS of successors).", domain: "topic15", domainName: "Engineering Management", category: "concept", topics: ["Project Management"] },
];

// ═══════════════════════════════════════════════════════════════
// Runtime: generate formula-based flashcards from formula sheets
// ═══════════════════════════════════════════════════════════════

const DOMAIN_NAMES: Record<number, string> = {
  0: 'Mathematics', 1: 'Probability & Statistics', 2: 'Computational Tools',
  3: 'Ethics', 4: 'Engineering Economics', 5: 'Statics',
  6: 'Dynamics & Vibrations', 7: 'Mechanics of Materials', 8: 'Material Science',
  9: 'Fluid Mechanics', 10: 'Thermodynamics', 11: 'Heat Transfer',
  12: 'Measurements & Controls', 13: 'Mechanical Design', 14: 'Manufacturing',
  15: 'Engineering Management',
};

let nextId = FME_FLASHCARDS.length + 1;

for (const sheet of FME_FORMULA_SHEETS) {
  for (const f of sheet.formulas) {
    FME_FLASHCARDS.push({
      id: nextId++,
      front: `What is the formula for ${f.name}?`,
      back: `${f.formula} — ${f.notes}`,
      domain: `topic${sheet.topicId}`,
      domainName: DOMAIN_NAMES[sheet.topicId],
      category: 'formula',
      topics: [sheet.title],
    });
  }
}

// Update the count after generation
FME_FLASHCARD_COUNT = FME_FLASHCARDS.length;

export function getFMEFlashcards(domain?: string): FMEFlashcard[] {
  if (!domain) return FME_FLASHCARDS;
  return FME_FLASHCARDS.filter(c => c.domain === domain);
}
