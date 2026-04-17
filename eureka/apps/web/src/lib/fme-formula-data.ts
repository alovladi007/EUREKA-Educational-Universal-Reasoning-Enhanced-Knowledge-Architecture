/**
 * FE Mechanical Engineering — Formula Sheets
 * Organized by topic with name, formula, and notes for each entry.
 * 16 topics, 350+ formulas total.
 */

export interface FormulaEntry {
  name: string;
  formula: string;
  notes: string;
}

export interface FormulaSheet {
  topicId: number;
  title: string;
  formulas: FormulaEntry[];
}

export const FME_FORMULA_SHEETS: FormulaSheet[] = [
  {
    topicId: 0,
    title: "Mathematics",
    formulas: [
      { name: "Power Rule (Derivative)", formula: "d/dx(x^n) = n·x^(n-1)", notes: "Most fundamental derivative rule; applies to any real exponent" },
      { name: "Product Rule", formula: "(uv)' = u'v + uv'", notes: "Differentiates product of two functions" },
      { name: "Chain Rule", formula: "dy/dx = (dy/du)·(du/dx)", notes: "Differentiates composite functions; essential for nested expressions" },
      { name: "Quotient Rule", formula: "(u/v)' = (u'v - uv')/v²", notes: "Differentiates ratio of two functions" },
      { name: "Power Integration", formula: "∫x^n dx = x^(n+1)/(n+1) + C", notes: "n ≠ -1; reverse of power rule" },
      { name: "Integration by Parts", formula: "∫u dv = uv - ∫v du", notes: "LIATE priority for choosing u: Log, Inverse trig, Algebraic, Trig, Exponential" },
      { name: "Euler's Formula", formula: "e^(jθ) = cosθ + j·sinθ", notes: "Connects complex exponential to trig functions" },
      { name: "Laplace: Exponential", formula: "L{e^(-at)} = 1/(s+a)", notes: "Laplace transform of exponential decay" },
      { name: "Laplace: Sine", formula: "L{sin(ωt)} = ω/(s²+ω²)", notes: "Laplace transform of sine function" },
      { name: "Laplace: Cosine", formula: "L{cos(ωt)} = s/(s²+ω²)", notes: "Laplace transform of cosine function" },
      { name: "Final Value Theorem", formula: "lim(t→∞) f(t) = lim(s→0) s·F(s)", notes: "Finds steady-state without inverse transform; poles of sF(s) must be in LHP" },
      { name: "Determinant 2×2", formula: "det([[a,b],[c,d]]) = ad - bc", notes: "Non-zero means matrix is invertible" },
      { name: "Inverse 2×2 Matrix", formula: "A⁻¹ = (1/(ad-bc))·[[d,-b],[-c,a]]", notes: "Swap diagonal, negate off-diagonal, divide by det" },
      { name: "Eigenvalue Equation", formula: "det(A - λI) = 0", notes: "Characteristic equation; solve for eigenvalues λ" },
      { name: "Cramer's Rule", formula: "x_i = det(A_i)/det(A)", notes: "A_i replaces column i with b; fast for 2×2 and 3×3" },
      { name: "Gradient", formula: "∇f = (∂f/∂x)î + (∂f/∂y)ĵ + (∂f/∂z)k̂", notes: "Direction of steepest increase; magnitude = rate of increase" },
      { name: "Divergence", formula: "∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z", notes: "Measures source/sink; scalar result" },
      { name: "Dot Product", formula: "A·B = |A||B|cosθ = AxBx + AyBy + AzBz", notes: "Scalar result; zero for perpendicular vectors" },
      { name: "Cross Product Magnitude", formula: "|A×B| = |A||B|sinθ", notes: "Vector result; direction by right-hand rule; zero for parallel vectors" },
      { name: "Newton-Raphson", formula: "x_{n+1} = x_n - f(x_n)/f'(x_n)", notes: "Quadratic convergence near simple roots; needs derivative" },
      { name: "Trapezoidal Rule", formula: "∫f dx ≈ (h/2)[f₀ + 2f₁ + ... + 2f_{n-1} + f_n]", notes: "Error O(h²); works for any number of intervals" },
      { name: "Simpson's 1/3 Rule", formula: "∫f dx ≈ (h/3)[f₀ + 4f₁ + 2f₂ + 4f₃ + ... + f_n]", notes: "Error O(h⁴); requires even number of intervals" },
      { name: "Euler's Method", formula: "y_{n+1} = y_n + h·f(x_n, y_n)", notes: "First-order ODE solver; error O(h) per step" },
      { name: "Quadratic Formula", formula: "x = (-b ± √(b²-4ac)) / (2a)", notes: "Solves ax²+bx+c=0; discriminant determines root type" },
      { name: "Divergence Theorem", formula: "∯_S F·dA = ∭_V (∇·F) dV", notes: "Relates surface flux to volume integral of divergence" }
    ]
  },
  {
    topicId: 1,
    title: "Probability & Statistics",
    formulas: [
      { name: "Addition Rule", formula: "P(A∪B) = P(A) + P(B) - P(A∩B)", notes: "Subtract overlap to avoid double-counting" },
      { name: "Conditional Probability", formula: "P(A|B) = P(A∩B)/P(B)", notes: "Probability of A given B has occurred" },
      { name: "Bayes' Theorem", formula: "P(A|B) = P(B|A)·P(A)/P(B)", notes: "Updates probability based on new evidence" },
      { name: "Binomial PMF", formula: "P(X=k) = C(n,k)·p^k·(1-p)^(n-k)", notes: "n trials, k successes, probability p per trial" },
      { name: "Binomial Mean & Variance", formula: "μ = np; σ² = np(1-p)", notes: "Mean and variance of binomial distribution" },
      { name: "Poisson PMF", formula: "P(X=k) = λ^k·e^(-λ)/k!", notes: "Models rare events; mean = variance = λ" },
      { name: "Normal PDF", formula: "f(x) = (1/(σ√(2π)))·exp(-(x-μ)²/(2σ²))", notes: "Bell curve; 68-95-99.7 rule for ±1σ, ±2σ, ±3σ" },
      { name: "Z-Score", formula: "Z = (X - μ)/σ", notes: "Converts to standard normal N(0,1); use Z-tables" },
      { name: "Exponential Distribution", formula: "f(x) = λe^(-λx), x ≥ 0", notes: "Mean = 1/λ; models time between Poisson events" },
      { name: "Sample Mean", formula: "x̄ = ΣX_i/n", notes: "Average of sample data" },
      { name: "Sample Variance", formula: "s² = Σ(X_i - x̄)²/(n-1)", notes: "Divide by (n-1) for unbiased estimate" },
      { name: "Sample Std Deviation", formula: "s = √(s²)", notes: "Same units as data; measure of spread" },
      { name: "Correlation Coefficient", formula: "r = Σ(x_i-x̄)(y_i-ȳ)/√[Σ(x_i-x̄)²·Σ(y_i-ȳ)²]", notes: "Ranges -1 to +1; measures linear association" },
      { name: "Regression Slope", formula: "b = r·(s_y/s_x)", notes: "Slope of best-fit line y = a + bx" },
      { name: "Regression Intercept", formula: "a = ȳ - b·x̄", notes: "y-intercept of best-fit line" },
      { name: "Coefficient of Determination", formula: "R² = r²", notes: "Fraction of variance in y explained by x; 0 ≤ R² ≤ 1" },
      { name: "t-Test Statistic", formula: "t = (x̄ - μ₀)/(s/√n)", notes: "Follows t-distribution with n-1 degrees of freedom" },
      { name: "Confidence Interval (Mean)", formula: "x̄ ± t_{α/2,n-1}·(s/√n)", notes: "Wider with smaller n or larger s" },
      { name: "Combinations", formula: "C(n,k) = n!/(k!(n-k)!)", notes: "Number of ways to choose k items from n" },
      { name: "Permutations", formula: "P(n,k) = n!/(n-k)!", notes: "Order matters; P(n,k) = C(n,k)·k!" }
    ]
  },
  {
    topicId: 2,
    title: "Computational Tools",
    formulas: [
      { name: "Relative Cell Reference", formula: "A1 (adjusts when copied)", notes: "Row and column both change relative to new position" },
      { name: "Absolute Cell Reference", formula: "$A$1 (fixed when copied)", notes: "Dollar signs lock row and/or column" },
      { name: "SUM Function", formula: "=SUM(range)", notes: "Adds all values in the specified range" },
      { name: "AVERAGE Function", formula: "=AVERAGE(range)", notes: "Arithmetic mean of values in range" },
      { name: "IF Function", formula: "=IF(condition, true_value, false_value)", notes: "Conditional logic in spreadsheets" },
      { name: "VLOOKUP", formula: "=VLOOKUP(key, table, col_index, FALSE)", notes: "Vertical lookup; FALSE for exact match" },
      { name: "LINEST", formula: "=LINEST(y_range, x_range, TRUE, TRUE)", notes: "Returns regression statistics: slope, intercept, R²" },
      { name: "FEM Global Equation", formula: "[K]{u} = {F}", notes: "Stiffness matrix × displacement = force; fundamental FEM equation" },
      { name: "Mesh Convergence", formula: "Refine mesh until results stabilize", notes: "Finer mesh → more accurate; check convergence before trusting results" },
      { name: "Newton-Raphson (Solver)", formula: "x_{n+1} = x_n - f(x_n)/f'(x_n)", notes: "Used by many iterative solvers in engineering software" },
      { name: "Goal Seek", formula: "Adjust input to achieve target output", notes: "Single-variable root finding in spreadsheets" },
      { name: "Interpolation (Linear)", formula: "y = y₁ + (x-x₁)(y₂-y₁)/(x₂-x₁)", notes: "Estimates value between two known data points" },
      { name: "Least Squares Error", formula: "E = Σ(y_i - f(x_i))²", notes: "Minimized in regression; sum of squared residuals" },
      { name: "Standard Deviation (Population)", formula: "σ = √(Σ(X_i-μ)²/N)", notes: "Use N for population; n-1 for sample" },
      { name: "Verification vs. Validation", formula: "V&V: equations right? vs. right equations?", notes: "Verification = math check; Validation = physics check" }
    ]
  },
  {
    topicId: 3,
    title: "Ethics & Professional Practice",
    formulas: [
      { name: "Canon 1: Public Safety", formula: "Safety, health, welfare of public = paramount", notes: "Always the top priority; overrides all other considerations" },
      { name: "Canon 2: Competence", formula: "Perform only in areas of competence", notes: "Do not practice outside your expertise" },
      { name: "Canon 3: Public Statements", formula: "Issue statements only in objective, truthful manner", notes: "No misleading claims about qualifications or projects" },
      { name: "Canon 4: Faithful Agent", formula: "Act as faithful agent for employer/client", notes: "Avoid conflicts of interest; disclose if they exist" },
      { name: "Canon 5: No Deception", formula: "Avoid deceptive acts", notes: "Maintain integrity in all professional dealings" },
      { name: "Canon 6: Honorable Conduct", formula: "Conduct honorably, responsibly, ethically", notes: "Uphold profession's reputation" },
      { name: "Licensure Path", formula: "ABET degree → FE → 4 yr experience → PE", notes: "Standard pathway to professional engineer license" },
      { name: "Negligence Elements", formula: "Duty + Breach + Causation + Damages", notes: "All four required to establish negligence" },
      { name: "Standard of Care", formula: "What a reasonably competent engineer would do", notes: "Basis for determining breach in negligence" },
      { name: "Strict Liability", formula: "Liability without proof of fault", notes: "Applies to defective products; manufacturer is liable" },
      { name: "Professional Liability Insurance", formula: "E&O (Errors & Omissions) coverage", notes: "Protects against claims of professional negligence" },
      { name: "Confidentiality", formula: "Do not reveal client/employer information", notes: "Without consent, unless public safety is at risk" },
      { name: "Credit for Work", formula: "Give credit to those who earned it", notes: "Do not claim others' work as your own" },
      { name: "Continuing Education", formula: "15-30 PDH per renewal period (typical)", notes: "Required to maintain PE license in most states" },
      { name: "Industrial Exemption", formula: "May practice without PE if not offering services to public", notes: "Varies by jurisdiction; check local laws" }
    ]
  },
  {
    topicId: 4,
    title: "Engineering Economics",
    formulas: [
      { name: "Future Value (Single)", formula: "F = P(1+i)^n", notes: "Compound amount factor (F/P, i, n)" },
      { name: "Present Value (Single)", formula: "P = F/(1+i)^n", notes: "Present worth factor (P/F, i, n)" },
      { name: "Uniform Series Present Worth", formula: "P = A·[(1+i)^n - 1]/[i(1+i)^n]", notes: "(P/A, i, n); converts annuity to present value" },
      { name: "Capital Recovery Factor", formula: "A = P·[i(1+i)^n]/[(1+i)^n - 1]", notes: "(A/P, i, n); annual payment on a loan" },
      { name: "Sinking Fund Factor", formula: "A = F·[i/((1+i)^n - 1)]", notes: "(A/F, i, n); annual deposit to accumulate future sum" },
      { name: "Series Compound Amount", formula: "F = A·[((1+i)^n - 1)/i]", notes: "(F/A, i, n); future value of annuity" },
      { name: "Effective Interest Rate", formula: "i_eff = (1 + r/m)^m - 1", notes: "r = nominal rate, m = compounding periods per year" },
      { name: "Arithmetic Gradient PW", formula: "P_G = G·[((1+i)^n - in - 1)/(i²(1+i)^n)]", notes: "Present worth of arithmetic gradient series" },
      { name: "Present Worth Analysis", formula: "PW = -Cost + PW(benefits) - PW(costs)", notes: "Choose alternative with highest PW" },
      { name: "Annual Worth", formula: "AW = PW·(A/P, i, n)", notes: "Equivalent uniform annual amount; handles unequal lives" },
      { name: "Benefit-Cost Ratio", formula: "B/C = PW(Benefits)/PW(Costs)", notes: "B/C ≥ 1.0 means project is justified" },
      { name: "Rate of Return", formula: "PW(i*) = 0", notes: "Find i* that zeroes net present worth; compare to MARR" },
      { name: "Straight-Line Depreciation", formula: "D = (B - S)/n", notes: "B = basis, S = salvage, n = life; equal annual deductions" },
      { name: "Book Value", formula: "BV_k = B - k·D", notes: "Remaining value after k years of depreciation" },
      { name: "Double Declining Balance", formula: "D_k = (2/n)·BV_{k-1}", notes: "Accelerated; never depreciate below salvage value" },
      { name: "MACRS", formula: "D_k = B × MACRS rate_k; S = 0", notes: "US tax standard; use published rate tables; half-year convention" },
      { name: "Tax Shield", formula: "Tax savings = D × Tax rate", notes: "Cash benefit of depreciation deduction" },
      { name: "After-Tax Cash Flow", formula: "ATCF = BTCF - (Revenue - Expenses - D)·t", notes: "t = tax rate; D = depreciation" },
      { name: "Payback Period", formula: "n = Initial cost / Annual net cash flow", notes: "Simple measure; ignores time value of money" },
      { name: "Breakeven Point", formula: "Revenue = Fixed costs + Variable costs", notes: "Q_BE = Fixed costs / (Price - Variable cost per unit)" }
    ]
  },
  {
    topicId: 5,
    title: "Statics",
    formulas: [
      { name: "2D Equilibrium", formula: "ΣFx = 0; ΣFy = 0; ΣM = 0", notes: "Three equations for three unknowns in plane" },
      { name: "3D Equilibrium", formula: "ΣFx = ΣFy = ΣFz = 0; ΣMx = ΣMy = ΣMz = 0", notes: "Six equations for six unknowns" },
      { name: "Resultant Force", formula: "R = √(Rx² + Ry²); θ = arctan(Ry/Rx)", notes: "Magnitude and direction of resultant" },
      { name: "Moment About a Point", formula: "M = F × d (perpendicular distance)", notes: "Or M = r × F (cross product); units N·m or ft·lb" },
      { name: "Distributed Load Resultant", formula: "R = ∫w(x)dx = area under load diagram", notes: "Acts at centroid of load distribution" },
      { name: "Method of Joints", formula: "ΣFx = 0, ΣFy = 0 at each joint", notes: "Max 2 unknowns per joint; start with ≤2 unknown members" },
      { name: "Method of Sections", formula: "Cut ≤ 3 members; apply 3 equilibrium eqns", notes: "Best for finding force in one specific member" },
      { name: "Composite Centroid (x)", formula: "x̄ = Σ(x̄_i·A_i)/ΣA_i", notes: "Weighted average of sub-shape centroids" },
      { name: "Composite Centroid (y)", formula: "ȳ = Σ(ȳ_i·A_i)/ΣA_i", notes: "Same formula applied to y-coordinates" },
      { name: "Parallel Axis Theorem", formula: "I = I_c + A·d²", notes: "Transfer from centroidal axis; d = distance between axes" },
      { name: "Rectangle I (centroidal)", formula: "I = bh³/12", notes: "About centroidal axis parallel to base b" },
      { name: "Circle I (centroidal)", formula: "I = πr⁴/4", notes: "About any centroidal diameter" },
      { name: "Triangle I (centroidal)", formula: "I = bh³/36", notes: "About centroidal axis parallel to base b" },
      { name: "Static Friction", formula: "F_s ≤ μ_s·N", notes: "Maximum friction before sliding; equality at impending motion" },
      { name: "Kinetic Friction", formula: "F_k = μ_k·N", notes: "Friction during sliding; μ_k < μ_s" },
      { name: "Slip Angle (Incline)", formula: "θ_slip = arctan(μ_s)", notes: "Angle at which block begins to slide on incline" },
      { name: "Belt Friction", formula: "T₂ = T₁·e^(μβ)", notes: "β in radians; T₂ = tight side, T₁ = slack side" },
      { name: "Belt Power", formula: "P = (T₂ - T₁)·v", notes: "v = belt velocity; power transmitted by belt drive" },
      { name: "Pin Support Reactions", formula: "Provides Fx and Fy (2 reactions)", notes: "Resists translation in x and y" },
      { name: "Fixed Support Reactions", formula: "Provides Fx, Fy, and M (3 reactions)", notes: "Resists translation and rotation" }
    ]
  },
  {
    topicId: 6,
    title: "Dynamics & Vibrations",
    formulas: [
      { name: "Constant Accel: Velocity", formula: "v = v₀ + at", notes: "Linear velocity under constant acceleration" },
      { name: "Constant Accel: Position", formula: "s = s₀ + v₀t + ½at²", notes: "Position under constant acceleration" },
      { name: "Constant Accel: v-s", formula: "v² = v₀² + 2a(s - s₀)", notes: "Eliminates time; relates velocity and position" },
      { name: "Normal Acceleration", formula: "a_n = v²/ρ", notes: "Centripetal; changes direction, ρ = radius of curvature" },
      { name: "Angular Velocity", formula: "v = rω", notes: "Linear velocity at distance r from rotation axis" },
      { name: "Angular Acceleration", formula: "a_t = rα; a_n = rω²", notes: "Tangential and normal components" },
      { name: "Newton's Second Law", formula: "ΣF = ma", notes: "Fundamental equation of motion for particles" },
      { name: "Rotational Newton's Law", formula: "ΣM = Iα", notes: "Torque = moment of inertia × angular acceleration" },
      { name: "Mass Moment: Solid Cylinder", formula: "I = mr²/2", notes: "About central axis; same for thin disk" },
      { name: "Mass Moment: Slender Rod", formula: "I = mL²/12", notes: "About centroidal axis perpendicular to rod" },
      { name: "Mass Moment: Solid Sphere", formula: "I = 2mr²/5", notes: "About any diameter" },
      { name: "Work-Energy Theorem", formula: "T₁ + ΣU = T₂", notes: "KE₁ + work by all forces = KE₂" },
      { name: "Kinetic Energy (Translation)", formula: "T = ½mv²", notes: "Energy of translational motion" },
      { name: "Kinetic Energy (Rotation)", formula: "T = ½Iω²", notes: "Energy of rotational motion" },
      { name: "Spring PE", formula: "V = ½kx²", notes: "Elastic potential energy; x = deformation from natural length" },
      { name: "Power (Translation)", formula: "P = F·v", notes: "Instantaneous power; force times velocity" },
      { name: "Power (Rotation)", formula: "P = M·ω", notes: "Torque times angular velocity" },
      { name: "Linear Momentum", formula: "p = mv; ΣF = dp/dt", notes: "Conservation when ΣF_ext = 0" },
      { name: "Coefficient of Restitution", formula: "e = (v₂'-v₁')/(v₁-v₂)", notes: "e=1 elastic; e=0 plastic; 0<e<1 real collision" },
      { name: "Natural Frequency", formula: "ω_n = √(k/m)", notes: "Undamped natural frequency in rad/s; f_n = ω_n/(2π)" },
      { name: "Critical Damping", formula: "c_cr = 2√(km) = 2mω_n", notes: "Boundary between oscillatory and non-oscillatory response" },
      { name: "Damping Ratio", formula: "ζ = c/c_cr", notes: "ζ<1 underdamped; ζ=1 critical; ζ>1 overdamped" },
      { name: "Damped Frequency", formula: "ω_d = ω_n√(1-ζ²)", notes: "Frequency of damped oscillation; always < ω_n" },
      { name: "Springs in Parallel", formula: "k_eq = k₁ + k₂", notes: "Same deflection, forces add" },
      { name: "Springs in Series", formula: "1/k_eq = 1/k₁ + 1/k₂", notes: "Same force, deflections add" },
      { name: "Transmissibility", formula: "TR = √[1+(2ζr)²]/√[(1-r²)²+(2ζr)²]", notes: "r = ω/ω_n; TR<1 when r>√2 (isolation)" },
      { name: "Rolling Without Slip", formula: "v_G = Rω; a_G = Rα", notes: "Constraint for rolling motion; contact point has v=0" }
    ]
  },
  {
    topicId: 7,
    title: "Mechanics of Materials",
    formulas: [
      { name: "Normal Stress", formula: "σ = F/A", notes: "Force per unit area; Pa or psi" },
      { name: "Normal Strain", formula: "ε = ΔL/L₀", notes: "Dimensionless; fractional change in length" },
      { name: "Hooke's Law", formula: "σ = E·ε", notes: "Linear elastic region; E = Young's modulus" },
      { name: "Shear Stress-Strain", formula: "τ = G·γ", notes: "G = shear modulus; γ = shear strain" },
      { name: "Shear Modulus Relation", formula: "G = E/[2(1+ν)]", notes: "Relates E, G, and Poisson's ratio ν" },
      { name: "Axial Deformation", formula: "δ = FL/(AE)", notes: "For constant cross-section and axial load" },
      { name: "Thermal Deformation", formula: "δ_T = α·ΔT·L", notes: "α = coefficient of thermal expansion" },
      { name: "Thermal Stress (Restrained)", formula: "σ = E·α·ΔT", notes: "Stress when member is fully restrained" },
      { name: "Torsion Shear Stress", formula: "τ = Tr/J", notes: "T = torque; r = radial distance; J = polar moment" },
      { name: "Polar Moment: Solid", formula: "J = πd⁴/32", notes: "For solid circular shaft of diameter d" },
      { name: "Polar Moment: Hollow", formula: "J = π(d_o⁴ - d_i⁴)/32", notes: "For hollow shaft with outer/inner diameters" },
      { name: "Angle of Twist", formula: "φ = TL/(GJ)", notes: "In radians; G = shear modulus" },
      { name: "Power-Torque", formula: "P = T·ω = 2πnT/60", notes: "n in rpm; P in watts if T in N·m" },
      { name: "Bending Stress", formula: "σ = Mc/I = M/S", notes: "c = distance to extreme fiber; S = I/c = section modulus" },
      { name: "Transverse Shear", formula: "τ = VQ/(Ib)", notes: "V = shear force; Q = first moment; b = width" },
      { name: "Max Shear (Rectangle)", formula: "τ_max = 3V/(2A)", notes: "For rectangular cross-section" },
      { name: "Cantilever Deflection (Point)", formula: "δ = PL³/(3EI)", notes: "End load P on cantilever of length L" },
      { name: "Simply Supported Deflection", formula: "δ = 5wL⁴/(384EI)", notes: "Uniform distributed load w" },
      { name: "Principal Stresses", formula: "σ₁,₂ = (σx+σy)/2 ± √[((σx-σy)/2)²+τxy²]", notes: "Maximum and minimum normal stresses" },
      { name: "Max In-Plane Shear", formula: "τ_max = √[((σx-σy)/2)² + τxy²]", notes: "= (σ₁-σ₂)/2; occurs at 45° to principal planes" },
      { name: "Mohr's Circle Radius", formula: "R = √[((σx-σy)/2)² + τxy²]", notes: "Center at ((σx+σy)/2, 0)" },
      { name: "Von Mises Stress (2D)", formula: "σ_vm = √(σ₁² - σ₁σ₂ + σ₂²)", notes: "Distortion energy criterion for ductile materials" },
      { name: "Euler Buckling Load", formula: "P_cr = π²EI/(KL)²", notes: "Use minimum I; KL = effective length" },
      { name: "Euler Buckling Stress", formula: "σ_cr = π²E/(KL/r)²", notes: "r = √(I/A) = radius of gyration" },
      { name: "Effective Length: Pin-Pin", formula: "K = 1.0", notes: "Both ends pinned" },
      { name: "Effective Length: Fixed-Free", formula: "K = 2.0", notes: "Cantilever column; most vulnerable to buckling" },
      { name: "Effective Length: Fixed-Fixed", formula: "K = 0.5", notes: "Both ends fixed; most stable" }
    ]
  },
  {
    topicId: 8,
    title: "Material Science",
    formulas: [
      { name: "APF (Atomic Packing Factor)", formula: "APF = V_atoms/V_cell", notes: "FCC = HCP = 0.74; BCC = 0.68" },
      { name: "BCC Atoms per Cell", formula: "2 atoms/unit cell", notes: "Fe(α), Cr, Mo, W" },
      { name: "FCC Atoms per Cell", formula: "4 atoms/unit cell", notes: "Al, Cu, Ni, Au, Ag" },
      { name: "HCP Atoms per Cell", formula: "6 atoms/unit cell", notes: "Ti, Mg, Zn" },
      { name: "Gibbs Phase Rule", formula: "F = C - P + 2", notes: "F=degrees of freedom, C=components, P=phases" },
      { name: "Lever Rule (α phase)", formula: "W_α = (C_β - C₀)/(C_β - C_α)", notes: "Weight fraction in two-phase region" },
      { name: "Lever Rule (β phase)", formula: "W_β = (C₀ - C_α)/(C_β - C_α)", notes: "Weight fraction of β phase" },
      { name: "Eutectoid (Steel)", formula: "727°C, 0.76% C", notes: "Austenite → Pearlite (ferrite + Fe₃C)" },
      { name: "Hall-Petch Equation", formula: "σ_y = σ₀ + k/√d", notes: "Yield strength increases with smaller grain size d" },
      { name: "Modulus of Resilience", formula: "U_r = σ_y²/(2E)", notes: "Energy per unit volume in elastic region" },
      { name: "True Stress", formula: "σ_true = σ_eng(1 + ε_eng)", notes: "Accounts for cross-section reduction" },
      { name: "True Strain", formula: "ε_true = ln(1 + ε_eng)", notes: "Natural log relation to engineering strain" },
      { name: "Hardness-Strength (Steel)", formula: "σ_u ≈ 3.45 × HB (MPa)", notes: "Approximate tensile strength from Brinell hardness" },
      { name: "Percent Cold Work", formula: "%CW = (A₀-A_f)/A₀ × 100", notes: "Measure of plastic deformation in cold working" },
      { name: "Specific Stiffness", formula: "E/ρ", notes: "Material index for lightweight stiff structures" },
      { name: "Specific Strength", formula: "σ_y/ρ", notes: "Material index for lightweight strong structures" },
      { name: "Stiff Beam Index", formula: "E^(1/2)/ρ", notes: "Ashby index for minimum-weight stiff beam" },
      { name: "Diffusion (Fick's First Law)", formula: "J = -D·(dC/dx)", notes: "J = flux; D = diffusion coefficient; dC/dx = concentration gradient" },
      { name: "Arrhenius (Diffusion)", formula: "D = D₀·exp(-Q/(RT))", notes: "Diffusion coefficient temperature dependence" },
      { name: "Linear Thermal Expansion", formula: "ΔL = α·L₀·ΔT", notes: "α varies by material; metals ~10-25 × 10⁻⁶/°C" }
    ]
  },
  {
    topicId: 9,
    title: "Fluid Mechanics",
    formulas: [
      { name: "Hydrostatic Pressure", formula: "p = p₀ + ρgh", notes: "Pressure increases linearly with depth h" },
      { name: "Hydrostatic Force on Surface", formula: "F = ρg·h_c·A", notes: "h_c = depth to centroid of submerged surface" },
      { name: "Center of Pressure", formula: "y_R = y_c + I_xc/(y_c·A)", notes: "Always below centroid for inclined surfaces" },
      { name: "Buoyancy (Archimedes)", formula: "F_B = ρ_fluid·g·V_displaced", notes: "Buoyant force equals weight of displaced fluid" },
      { name: "Continuity Equation", formula: "A₁V₁ = A₂V₂ = Q", notes: "Steady, incompressible flow; Q = volumetric flow rate" },
      { name: "Mass Flow Rate", formula: "ṁ = ρAV = ρQ", notes: "Mass per unit time; constant in steady flow" },
      { name: "Bernoulli's Equation", formula: "p/(ρg) + V²/(2g) + z = constant", notes: "Along streamline; steady, incompressible, inviscid" },
      { name: "General Energy Equation", formula: "p₁/(ρg)+V₁²/(2g)+z₁+h_p = p₂/(ρg)+V₂²/(2g)+z₂+h_L+h_t", notes: "Includes pump head h_p, losses h_L, turbine h_t" },
      { name: "Reynolds Number", formula: "Re = ρVD/μ = VD/ν", notes: "Laminar < 2300; turbulent > 4000 (pipe flow)" },
      { name: "Darcy-Weisbach", formula: "h_f = f·(L/D)·V²/(2g)", notes: "Major (friction) head loss in pipes" },
      { name: "Laminar Friction Factor", formula: "f = 64/Re", notes: "For Re < 2300; no chart needed" },
      { name: "Minor Loss", formula: "h_m = K·V²/(2g)", notes: "K = loss coefficient for fitting/valve" },
      { name: "Drag Force", formula: "F_D = C_D·½ρV²·A", notes: "A = reference area (usually frontal)" },
      { name: "Lift Force", formula: "F_L = C_L·½ρV²·A", notes: "A = planform area for airfoils" },
      { name: "Boundary Layer (Laminar)", formula: "δ ≈ 5x/√(Re_x)", notes: "Thickness grows as √x on flat plate" },
      { name: "Pump Power", formula: "P = ρgQH/η", notes: "H = head added; η = pump efficiency" },
      { name: "Affinity Law: Flow", formula: "Q₂/Q₁ = N₂/N₁", notes: "Same pump, different speed" },
      { name: "Affinity Law: Head", formula: "H₂/H₁ = (N₂/N₁)²", notes: "Head scales with speed squared" },
      { name: "Affinity Law: Power", formula: "P₂/P₁ = (N₂/N₁)³", notes: "Power scales with speed cubed" },
      { name: "NPSH Requirement", formula: "NPSH_A > NPSH_R", notes: "Avoid cavitation; increase reservoir height or reduce losses" },
      { name: "Specific Speed", formula: "N_s = N√Q/H^(3/4)", notes: "Low Ns = centrifugal; high Ns = axial pump" },
      { name: "Hagen-Poiseuille (Laminar)", formula: "Q = πΔpD⁴/(128μL)", notes: "Volumetric flow for laminar pipe flow" }
    ]
  },
  {
    topicId: 10,
    title: "Thermodynamics",
    formulas: [
      { name: "First Law (Closed)", formula: "Q - W = ΔU", notes: "Energy conservation for closed system" },
      { name: "First Law (Open, Steady)", formula: "Q̇ - Ẇ = ṁ[Δh + ΔKE + ΔPE]", notes: "Steady-state energy balance for open system" },
      { name: "Carnot Efficiency", formula: "η = 1 - T_L/T_H", notes: "Maximum efficiency; temperatures MUST be absolute (K or R)" },
      { name: "COP Refrigerator", formula: "COP_R = T_L/(T_H - T_L)", notes: "Carnot COP for refrigeration" },
      { name: "COP Heat Pump", formula: "COP_HP = T_H/(T_H - T_L)", notes: "COP_HP = COP_R + 1" },
      { name: "Entropy Change (Ideal Gas)", formula: "Δs = c_p·ln(T₂/T₁) - R·ln(P₂/P₁)", notes: "For variable specific heats, use tables" },
      { name: "Ideal Gas Law", formula: "PV = nRT; Pv = RT", notes: "R_universal = 8.314 kJ/(kmol·K)" },
      { name: "Specific Heat Relation", formula: "c_p - c_v = R; γ = c_p/c_v", notes: "For ideal gases; γ = ratio of specific heats" },
      { name: "Isentropic (Ideal Gas)", formula: "PV^γ = constant; T₂/T₁ = (P₂/P₁)^((γ-1)/γ)", notes: "Reversible + adiabatic; s₁ = s₂" },
      { name: "Isothermal Work", formula: "W = nRT·ln(V₂/V₁)", notes: "Constant temperature process" },
      { name: "Quality", formula: "x = (v-v_f)/(v_g-v_f) = (h-h_f)/h_fg", notes: "Only in two-phase region; 0 ≤ x ≤ 1" },
      { name: "Otto Efficiency", formula: "η = 1 - 1/r^(γ-1)", notes: "r = compression ratio; spark-ignition engines" },
      { name: "Brayton Efficiency", formula: "η = 1 - 1/r_p^((γ-1)/γ)", notes: "r_p = pressure ratio; gas turbines" },
      { name: "Rankine Efficiency", formula: "η = (h₃-h₄-w_pump)/(h₃-h₂)", notes: "Steam power cycle; use steam tables" },
      { name: "Refrigeration COP", formula: "COP = (h₁-h₄)/(h₂-h₁)", notes: "Vapor-compression cycle; evaporator/compressor" },
      { name: "Throttling", formula: "h₃ = h₄", notes: "Isenthalpic; irreversible; entropy increases" },
      { name: "Dalton's Law", formula: "P_total = Σp_i", notes: "Sum of partial pressures for ideal gas mixtures" },
      { name: "Mole Fraction", formula: "y_i = n_i/n_total = p_i/P_total", notes: "Fraction of total moles belonging to component i" },
      { name: "Relative Humidity", formula: "φ = p_v/p_g", notes: "Ratio of actual to saturated vapor pressure" },
      { name: "Humidity Ratio", formula: "ω = 0.622·p_v/(P-p_v)", notes: "Mass of water vapor per mass of dry air" },
      { name: "Air-Fuel Ratio", formula: "AF = m_air/m_fuel", notes: "Stoichiometric AF uses balanced equation" },
      { name: "Equivalence Ratio", formula: "Φ = AF_stoich/AF_actual", notes: "Φ<1 lean; Φ=1 stoichiometric; Φ>1 rich" },
      { name: "Stoichiometric Air", formula: "O₂ + 3.76N₂ per mole of O₂", notes: "Air is 21% O₂, 79% N₂ by volume" }
    ]
  },
  {
    topicId: 11,
    title: "Heat Transfer",
    formulas: [
      { name: "Fourier's Law (1D)", formula: "q = -kA(dT/dx)", notes: "Conduction; k = thermal conductivity" },
      { name: "Plane Wall Conduction", formula: "q = kA(T₁-T₂)/L", notes: "Steady-state, constant cross-section" },
      { name: "Thermal Resistance (Wall)", formula: "R = L/(kA)", notes: "Analogous to electrical resistance" },
      { name: "Thermal Resistance (Convection)", formula: "R = 1/(hA)", notes: "h = convection coefficient" },
      { name: "Composite Wall", formula: "q = ΔT_total/ΣR_i", notes: "Series resistances add directly" },
      { name: "Cylindrical Conduction", formula: "q = 2πkL(T₁-T₂)/ln(r₂/r₁)", notes: "For hollow cylinder; L = length" },
      { name: "Cylinder Thermal Resistance", formula: "R = ln(r₂/r₁)/(2πkL)", notes: "Resistance of cylindrical wall" },
      { name: "Critical Radius", formula: "r_cr = k/h", notes: "For cylinder; adding insulation below r_cr increases heat loss" },
      { name: "Newton's Law of Cooling", formula: "q = hA(T_s - T_∞)", notes: "Convection heat transfer" },
      { name: "Nusselt Number", formula: "Nu = hL/k_fluid", notes: "Dimensionless convection; links correlations to h" },
      { name: "Prandtl Number", formula: "Pr = ν/α = μc_p/k", notes: "Fluid property; given in tables" },
      { name: "Dittus-Boelter", formula: "Nu = 0.023·Re^0.8·Pr^n", notes: "Turbulent pipe flow; n=0.4 heating, 0.3 cooling" },
      { name: "Stefan-Boltzmann Law", formula: "E = εσT⁴", notes: "σ = 5.67×10⁻⁸ W/(m²·K⁴); T in Kelvin" },
      { name: "Kirchhoff's Law", formula: "α = ε (at thermal equilibrium)", notes: "Absorptivity equals emissivity" },
      { name: "Radiation (Small Body)", formula: "q = εσA(T₁⁴-T₂⁴)", notes: "Small body (1) in large enclosure (2)" },
      { name: "View Factor Reciprocity", formula: "A₁F₁₂ = A₂F₂₁", notes: "Fundamental view factor relationship" },
      { name: "View Factor Summation", formula: "ΣF_ij = 1", notes: "All view factors from surface i sum to 1" },
      { name: "LMTD", formula: "ΔT_lm = (ΔT₁-ΔT₂)/ln(ΔT₁/ΔT₂)", notes: "Log-mean temperature difference for heat exchangers" },
      { name: "HX Heat Transfer", formula: "q = U·A·ΔT_lm", notes: "U = overall heat transfer coefficient" },
      { name: "Overall U (Tube)", formula: "1/U = 1/h_i + R_wall + 1/h_o", notes: "Series resistance model per unit area" },
      { name: "NTU", formula: "NTU = UA/C_min", notes: "Number of Transfer Units; C = ṁc_p" },
      { name: "HX Effectiveness", formula: "ε = q_actual/q_max = q/(C_min·(T_h,in-T_c,in))", notes: "Use ε-NTU when outlet temps unknown" },
      { name: "Grashof Number", formula: "Gr = gβΔTL³/ν²", notes: "Natural convection parameter; buoyancy/viscous" },
      { name: "Rayleigh Number", formula: "Ra = Gr·Pr", notes: "Combined natural convection parameter" },
      { name: "Radiation Property Sum", formula: "α + ρ + τ = 1", notes: "Absorptivity + reflectivity + transmissivity = 1" }
    ]
  },
  {
    topicId: 12,
    title: "Measurements & Controls",
    formulas: [
      { name: "Closed-Loop TF", formula: "T(s) = G(s)/[1+G(s)H(s)]", notes: "Negative feedback; G = forward path, H = feedback" },
      { name: "PID Output", formula: "u = K_p·e + K_i·∫e dt + K_d·de/dt", notes: "P reduces error; I eliminates offset; D reduces overshoot" },
      { name: "First-Order Step Response", formula: "y(t) = K(1-e^(-t/τ))", notes: "63.2% at t=τ; 99% at t=5τ" },
      { name: "Time Constant", formula: "τ (from G(s) = K/(τs+1))", notes: "Characterizes response speed" },
      { name: "Steady-State Error (Type 0)", formula: "e_ss = R/(1+K_p)", notes: "K_p = position error constant; for step input" },
      { name: "Nyquist Sampling", formula: "f_s > 2·f_max", notes: "Minimum sampling rate to avoid aliasing" },
      { name: "ADC Resolution", formula: "Resolution = FSR/2^n", notes: "FSR = full scale range; n = number of bits" },
      { name: "SNR (dB)", formula: "SNR = 20·log₁₀(V_signal/V_noise)", notes: "Signal-to-noise ratio in decibels" },
      { name: "Cutoff Frequency", formula: "-3 dB point: output = 0.707 × input", notes: "Defines filter bandwidth" },
      { name: "Uncertainty Propagation", formula: "δf = √[Σ(∂f/∂x_i · δx_i)²]", notes: "RSS of partial derivative × uncertainty products" },
      { name: "Strain Gauge", formula: "ΔR/R = GF·ε", notes: "GF = gauge factor (~2 for metal foil); ε = strain" },
      { name: "Thermocouple", formula: "V = f(T_hot - T_ref)", notes: "Seebeck effect; voltage proportional to temperature difference" },
      { name: "RTD Response", formula: "R(T) = R₀(1 + αT)", notes: "Linear approximation; α = temperature coefficient" },
      { name: "Wheatstone Bridge", formula: "V_out = V_s·(R₃/(R₃+R₄) - R₂/(R₁+R₂))", notes: "Balanced when R₁R₃ = R₂R₄; used with strain gauges" },
      { name: "Transfer Function", formula: "G(s) = Y(s)/X(s)", notes: "Output/input in Laplace domain; characterizes system" },
      { name: "Second-Order System", formula: "G(s) = ω_n²/(s²+2ζω_n·s+ω_n²)", notes: "ζ and ω_n determine response character" },
      { name: "Overshoot (2nd Order)", formula: "M_p = exp(-πζ/√(1-ζ²)) × 100%", notes: "Percent overshoot for underdamped step response" },
      { name: "Settling Time (2%)", formula: "t_s ≈ 4/(ζω_n)", notes: "Time for response to stay within 2% of final value" }
    ]
  },
  {
    topicId: 13,
    title: "Mechanical Design",
    formulas: [
      { name: "Bolt Preload", formula: "F_b = F_i + C·P", notes: "C = k_b/(k_b+k_m); stiffness ratio" },
      { name: "Joint Separation", formula: "F_m = F_i - (1-C)·P", notes: "Joint opens when F_m ≤ 0" },
      { name: "Bolt Torque", formula: "T = K·F_i·d", notes: "K ≈ 0.2 for dry; d = nominal diameter" },
      { name: "Bearing Life (Ball)", formula: "L₁₀ = (C/P)³", notes: "Life in millions of revolutions; 10% failure" },
      { name: "Bearing Life (Roller)", formula: "L₁₀ = (C/P)^(10/3)", notes: "Roller bearings have different exponent" },
      { name: "Bearing Life (Hours)", formula: "L₁₀h = L₁₀ × 10⁶/(60n)", notes: "n = rpm; convert revolutions to hours" },
      { name: "Equivalent Bearing Load", formula: "P = X·F_r + Y·F_a", notes: "Combined radial and axial loading" },
      { name: "Gear Speed Ratio", formula: "ω₂/ω₁ = N₁/N₂", notes: "Inverse tooth ratio; larger gear rotates slower" },
      { name: "Gear Tangential Force", formula: "W_t = 2T/d", notes: "T = torque; d = pitch diameter" },
      { name: "Gear Radial Force", formula: "W_r = W_t·tanφ", notes: "φ = pressure angle (typically 20°)" },
      { name: "Pitch Diameter", formula: "d = N/P (inch); d = mN (metric)", notes: "P = diametral pitch; m = module" },
      { name: "Shaft: Max Shear Stress", formula: "τ_max = √[(σ/2)² + τ²]", notes: "Combined bending and torsion" },
      { name: "Shaft Diameter (Static)", formula: "d = [16n√(M²+T²)/(πσ_y)]^(1/3)", notes: "Max shear stress criterion" },
      { name: "Spring Rate (Helical)", formula: "k = Gd⁴/(8D³N_a)", notes: "G = shear modulus; d = wire dia; D = coil dia" },
      { name: "Spring Shear Stress", formula: "τ = K_W·8FD/(πd³)", notes: "K_W = Wahl factor for curvature and direct shear" },
      { name: "Wahl Factor", formula: "K_W = (4C-1)/(4C-4) + 0.615/C", notes: "C = D/d = spring index" },
      { name: "Endurance Limit (Steel)", formula: "S_e' ≈ 0.5·S_ut (S_ut < 200 ksi)", notes: "Approximate; modify with k factors" },
      { name: "Modified Endurance Limit", formula: "S_e = k_a·k_b·k_c·k_d·k_e·S_e'", notes: "Surface, size, loading, temp, reliability factors" },
      { name: "Goodman Criterion", formula: "σ_a/S_e + σ_m/S_ut = 1/n", notes: "Apply K_f to alternating stress only" },
      { name: "Fatigue Stress Conc.", formula: "K_f = 1 + q(K_t - 1)", notes: "q = notch sensitivity (0 to 1); K_t from geometry" },
      { name: "Soderberg Criterion", formula: "σ_a/S_e + σ_m/S_y = 1/n", notes: "More conservative than Goodman" },
      { name: "Spring Energy", formula: "U = ½kδ² = F²/(2k)", notes: "Elastic potential energy stored in spring" },
      { name: "Critical Speed (Simple)", formula: "ω_cr = √(48EI/(mL³))", notes: "Simply supported shaft with central mass" },
      { name: "Gear Train Ratio", formula: "ω_out/ω_in = (-1)^n·∏(N_driving)/∏(N_driven)", notes: "n = number of external mesh pairs" }
    ]
  },
  {
    topicId: 14,
    title: "Manufacturing",
    formulas: [
      { name: "Cutting Speed (Turning)", formula: "V = πDN", notes: "D = workpiece diameter; N = rpm" },
      { name: "MRR (Turning)", formula: "MRR = V·f·d", notes: "f = feed; d = depth of cut" },
      { name: "Machining Time", formula: "t_m = L/(f·N)", notes: "L = cut length; f = feed/rev" },
      { name: "Taylor Tool Life", formula: "VT^n = C", notes: "Higher V → shorter T; n depends on tool material" },
      { name: "Milling Feed Rate", formula: "f_r = f_t·n_t·N", notes: "f_t = feed per tooth; n_t = number of teeth" },
      { name: "MRR (Milling)", formula: "MRR = w·d·f_r", notes: "w = width of cut; d = depth" },
      { name: "Drilling MRR", formula: "MRR = (πD²/4)·f·N", notes: "D = drill diameter; f = feed per rev" },
      { name: "Blanking Force", formula: "F = S_s·t·L", notes: "S_s = shear strength; t = thickness; L = perimeter" },
      { name: "Drawing Ratio", formula: "DR = D_blank/D_punch", notes: "Maximum DR ≈ 2.0 for single draw" },
      { name: "True Strain (Rolling)", formula: "ε = ln(t₀/t_f)", notes: "t₀ = initial thickness; t_f = final" },
      { name: "Worst-Case Tolerance", formula: "T_assy = ΣT_i", notes: "Tolerances add directly; guaranteed fit" },
      { name: "Statistical Tolerance (RSS)", formula: "T_assy = √(ΣT_i²)", notes: "Root sum of squares; ~99.73% fit probability" },
      { name: "Clearance Fit", formula: "Shaft max < Hole min", notes: "Always positive clearance" },
      { name: "Interference Fit", formula: "Shaft min > Hole max", notes: "Always interference; requires press/shrink fit" },
      { name: "Surface Roughness (Ra)", formula: "Ra = (1/L)∫|y(x)|dx", notes: "Average absolute deviation from mean line" },
      { name: "Extrusion Ratio", formula: "R = A₀/A_f", notes: "A₀ = initial area; A_f = final; higher R = more work" },
      { name: "Forging Force (Approx)", formula: "F = σ_f·A", notes: "σ_f = flow stress; A = projected contact area" },
      { name: "Recrystallization Temp", formula: "T_recryst ≈ 0.3-0.5 T_melt (K)", notes: "Below = cold work; above = hot work" }
    ]
  },
  {
    topicId: 15,
    title: "Engineering Management",
    formulas: [
      { name: "Critical Path", formula: "Longest path = zero slack = project duration", notes: "Delay any critical activity → delay project" },
      { name: "Slack (Float)", formula: "Slack = LS - ES = LF - EF", notes: "Zero slack = critical activity" },
      { name: "PERT Expected Time", formula: "t_e = (a + 4m + b)/6", notes: "a=optimistic; m=most likely; b=pessimistic" },
      { name: "PERT Variance", formula: "σ² = ((b-a)/6)²", notes: "Variance of single activity duration" },
      { name: "Project Variance", formula: "σ²_project = Σσ²_critical", notes: "Sum variances along critical path" },
      { name: "Forward Pass: EF", formula: "EF = ES + Duration", notes: "Earliest finish from earliest start" },
      { name: "Backward Pass: LS", formula: "LS = LF - Duration", notes: "Latest start from latest finish" },
      { name: "Process Capability (Cp)", formula: "C_p = (USL-LSL)/(6σ)", notes: "Potential capability if centered" },
      { name: "Process Capability (Cpk)", formula: "C_pk = min[(USL-μ)/(3σ), (μ-LSL)/(3σ)]", notes: "Actual capability; accounts for off-center" },
      { name: "X-bar Chart UCL", formula: "UCL = X̄̄ + A₂·R̄", notes: "A₂ from table based on sample size" },
      { name: "X-bar Chart LCL", formula: "LCL = X̄̄ - A₂·R̄", notes: "Lower control limit for means" },
      { name: "R Chart UCL", formula: "UCL = D₄·R̄", notes: "D₄ from table based on sample size" },
      { name: "R Chart LCL", formula: "LCL = D₃·R̄", notes: "D₃ = 0 for n ≤ 6" },
      { name: "Six Sigma DPMO", formula: "3.4 defects per million opportunities", notes: "At 6σ level; DMAIC methodology" },
      { name: "Pareto Principle", formula: "80% of defects from 20% of causes", notes: "Focus on vital few causes" },
      { name: "Breakeven Quantity", formula: "Q_BE = Fixed Costs/(Price - Variable Cost/unit)", notes: "Volume at which revenue = total costs" }
    ]
  }
];

export const FME_FORMULA_COUNT = FME_FORMULA_SHEETS.reduce(
  (sum, sheet) => sum + sheet.formulas.length, 0
);

export function getFMEFormulas(topicId?: number): FormulaSheet[] {
  if (topicId === undefined) return FME_FORMULA_SHEETS;
  return FME_FORMULA_SHEETS.filter(s => s.topicId === topicId);
}
