/**
 * FE Electrical & Computer Engineering — Formula Sheets
 * Organized by topic with name, formula, and notes for each entry.
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

export const FE_EE_FORMULA_SHEETS: FormulaSheet[] = 
[
{
    topicId: 0,
    title: "Mathematics",
    formulas: [
      { name: "Quadratic Formula", formula: "x = (-b ± √(b²-4ac)) / (2a)", notes: "Solves ax²+bx+c=0; discriminant Δ=b²-4ac determines root type" },
      { name: "Pythagorean Identity", formula: "sin²θ + cos²θ = 1", notes: "Fundamental trigonometric identity; basis for other trig identities" },
      { name: "Angle Addition (Sin)", formula: "sin(A±B) = sinA·cosB ± cosA·sinB", notes: "Essential for phase angle calculations in AC circuits" },
      { name: "Angle Addition (Cos)", formula: "cos(A±B) = cosA·cosB ∓ sinA·sinB", notes: "Used in phasor transformations" },
      { name: "Rectangular to Polar", formula: "r = √(x²+y²); θ = arctan(y/x)", notes: "Converts Cartesian to polar coordinates; track quadrant for correct angle" },
      { name: "Polar to Rectangular", formula: "x = r·cosθ; y = r·sinθ", notes: "Converts polar to Cartesian coordinates" },
      { name: "Euler's Formula", formula: "e^(jθ) = cosθ + j·sinθ", notes: "Connects exponential, rectangular, and polar forms; critical for AC analysis" },
      { name: "Power Rule", formula: "d/dx(x^n) = n·x^(n-1)", notes: "Derivative of power function; basis for many calculus operations" },
      { name: "Exponential Derivative", formula: "d/dx(e^x) = e^x", notes: "Exponential is its own derivative; appears in transient analysis" },
      { name: "Natural Log Derivative", formula: "d/dx(ln x) = 1/x", notes: "Used in logarithmic differentiation" },
      { name: "Sin/Cos Derivatives", formula: "d/dx(sin x) = cos x; d/dx(cos x) = -sin x", notes: "Essential for AC signal analysis" },
      { name: "Product Rule", formula: "(uv)' = u'v + uv'", notes: "Differentiates product of functions" },
      { name: "Chain Rule", formula: "dy/dx = (dy/du)·(du/dx)", notes: "Differentiates composite functions" },
      { name: "Power Integration", formula: "∫x^n dx = x^(n+1)/(n+1) + C", notes: "Integration of power functions; reverse of power rule" },
      { name: "Exponential Integration", formula: "∫e^x dx = e^x + C", notes: "Integration of exponential function" },
      { name: "Natural Log Integration", formula: "∫(1/x) dx = ln|x| + C", notes: "Integration of reciprocal function" },
      { name: "Trigonometric Integration", formula: "∫sin x dx = -cos x + C; ∫cos x dx = sin x + C", notes: "Integration of trig functions" },
      { name: "Integration by Parts", formula: "∫u dv = uv - ∫v du", notes: "Integrates products; useful for polynomial·exponential or polynomial·trig" },
      { name: "Laplace Transform Definition", formula: "F(s) = ∫₀^∞ f(t)·e^(-st) dt", notes: "Converts time-domain to frequency domain; simplifies differential equations" },
      { name: "Laplace Transform: t^n", formula: "L{t^n} = n! / s^(n+1)", notes: "Laplace of polynomial terms" },
      { name: "Laplace Transform: e^(-at)", formula: "L{e^(-at)} = 1 / (s+a)", notes: "Laplace of exponential decay" },
      { name: "Laplace Transform: sin(ωt)", formula: "L{sin(ωt)} = ω / (s²+ω²)", notes: "Laplace of sine function" },
      { name: "Laplace Transform: cos(ωt)", formula: "L{cos(ωt)} = s / (s²+ω²)", notes: "Laplace of cosine function" },
      { name: "Final Value Theorem", formula: "lim(t→∞) f(t) = lim(s→0) s·F(s)", notes: "Finds steady-state value without inverse transform" },
      { name: "Determinant (2×2)", formula: "det([a b; c d]) = ad - bc", notes: "Non-zero determinant means matrix is invertible" },
      { name: "Inverse of 2×2 Matrix", formula: "[a b; c d]⁻¹ = (1/(ad-bc))·[d -b; -c a]", notes: "Matrix inversion for 2×2 using determinant" },
      { name: "Eigenvalue Equation", formula: "Ax = λx", notes: "x is eigenvector, λ is eigenvalue; for stability analysis in control systems" },
      { name: "Gradient", formula: "∇f = (∂f/∂x)î + (∂f/∂y)ĵ + (∂f/∂z)k̂", notes: "Points in direction of steepest increase; magnitude is rate of increase" },
      { name: "Divergence", formula: "∇·F = ∂Fx/∂x + ∂Fy/∂y + ∂Fz/∂z", notes: "Measures outflow from a point; flux density" },
      { name: "Curl", formula: "∇×F = (∂Fz/∂y - ∂Fy/∂z)î + (∂Fx/∂z - ∂Fz/∂x)ĵ + (∂Fy/∂x - ∂Fx/∂y)k̂", notes: "Measures rotation; perpendicular to surface with circulation" },
      { name: "Dot Product", formula: "A·B = |A|·|B|·cosθ = AxBx + AyBy + AzBz", notes: "Scalar result; orthogonal vectors have zero dot product" },
      { name: "Cross Product Magnitude", formula: "|A×B| = |A|·|B|·sinθ", notes: "Direction by right-hand rule; perpendicular to both A and B" }
    ]
  },
  {
    topicId: 1,
    title: "Probability and Statistics",
    formulas: [
      { name: "Probability Addition Rule", formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)", notes: "Union of events; subtract overlap to avoid double-counting" },
      { name: "Conditional Probability", formula: "P(A|B) = P(A ∩ B) / P(B)", notes: "Probability of A given B occurred" },
      { name: "Bayes' Theorem", formula: "P(A|B) = P(B|A)·P(A) / P(B)", notes: "Updates probability based on evidence; fundamental to inference" },
      { name: "Binomial Distribution PMF", formula: "P(X=k) = C(n,k)·p^k·(1-p)^(n-k)", notes: "n trials, k successes, each with probability p; C(n,k) = n!/(k!(n-k)!)" },
      { name: "Binomial Mean", formula: "E[X] = n·p", notes: "Expected number of successes in n trials" },
      { name: "Binomial Variance", formula: "Var(X) = n·p·(1-p)", notes: "Spread of binomial distribution" },
      { name: "Poisson Distribution PMF", formula: "P(X=k) = (λ^k·e^(-λ)) / k!", notes: "Models rare events with rate λ; used for count data" },
      { name: "Normal Distribution PDF", formula: "f(x) = (1/(σ√(2π)))·exp(-(x-μ)²/(2σ²))", notes: "Bell curve; defined by mean μ and standard deviation σ" },
      { name: "Standard Normal", formula: "Z = (X - μ) / σ", notes: "Converts any normal to standard normal with μ=0, σ=1; use Z-tables" },
      { name: "Sample Mean", formula: "x̄ = ΣX / n", notes: "Average of data sample" },
      { name: "Sample Variance", formula: "s² = Σ(X - x̄)² / (n-1)", notes: "Spread around sample mean; divide by (n-1) for unbiased estimate" },
      { name: "Sample Standard Deviation", formula: "s = √(s²)", notes: "Square root of variance; same units as data" },
      { name: "Covariance", formula: "Cov(X,Y) = E[(X-μx)(Y-μy)] = E[XY] - E[X]·E[Y]", notes: "Measures joint variability of two variables" },
      { name: "Correlation Coefficient", formula: "r = Cov(X,Y) / (sx·sy)", notes: "Standardized covariance; ranges from -1 to +1" },
      { name: "Linear Regression Slope", formula: "b = r·(sy / sx)", notes: "Slope of best-fit line; r is correlation, sy/sx is ratio of standard deviations" },
      { name: "Linear Regression Intercept", formula: "a = ȳ - b·x̄", notes: "y-intercept of best-fit line y = a + bx" },
      { name: "Coefficient of Determination", formula: "R² = r²", notes: "Fraction of variance in Y explained by X; 0 ≤ R² ≤ 1" },
      { name: "t-Test Statistic", formula: "t = (x̄ - μ₀) / (s / √n)", notes: "Compares sample mean to reference value; follow t-distribution with n-1 degrees of freedom" },
      { name: "Chi-Square Test", formula: "χ² = Σ(O - E)² / E", notes: "Tests categorical data; O=observed, E=expected frequency" },
      { name: "Standard Error of Mean", formula: "SE = s / √n", notes: "Standard deviation of sample mean; smaller with larger sample size" },
      { name: "Confidence Interval for Mean", formula: "CI = x̄ ± t(α/2,n-1)·(s/√n)", notes: "Range around sample mean with confidence level (1-α)100%; use t-table" },
      { name: "z-Score", formula: "z = (X - μ) / σ", notes: "Number of standard deviations from mean; positive above mean, negative below" }
    ]
  },
  {
    topicId: 2,
    title: "Ethics and Professional Practice",
    formulas: [
      { name: "Professional Ethics Framework", formula: "Identify stakeholders → Clarify issue → Check codes/laws → List options → Prioritize public welfare", notes: "Systematic approach to ethical decisions; public welfare always comes first" }
    ]
  },
  {
    topicId: 3,
    title: "Engineering Economics",
    formulas: [
      { name: "Compound Interest", formula: "F = P(1+i)^n", notes: "Future amount from present amount P at interest rate i for n periods" },
      { name: "Present Value", formula: "P = F / (1+i)^n", notes: "Present value of future amount F; inverse of compound interest" },
      { name: "Future Worth Factor (F/P)", formula: "(F/P, i, n) = (1+i)^n", notes: "Multiplier to find F from P: F = P·(F/P, i, n)" },
      { name: "Present Worth Factor (P/F)", formula: "(P/F, i, n) = 1 / (1+i)^n", notes: "Multiplier to find P from F: P = F·(P/F, i, n)" },
      { name: "Present Worth Annuity Factor (P/A)", formula: "(P/A, i, n) = [(1+i)^n - 1] / [i(1+i)^n]", notes: "Converts uniform annual payment A to present value: P = A·(P/A, i, n)" },
      { name: "Future Worth Annuity Factor (F/A)", formula: "(F/A, i, n) = [(1+i)^n - 1] / i", notes: "Converts uniform annual payment A to future value: F = A·(F/A, i, n)" },
      { name: "Capital Recovery Factor (A/P)", formula: "(A/P, i, n) = i(1+i)^n / [(1+i)^n - 1]", notes: "Converts present value P to uniform annual payment: A = P·(A/P, i, n)" },
      { name: "Effective Annual Rate", formula: "EAR = (1 + r/m)^m - 1", notes: "Converts nominal rate r (compounded m times/year) to annual effective rate" },
      { name: "Continuous Compounding", formula: "F = P·e^(rt)", notes: "Interest compounded continuously; e = 2.71828" },
      { name: "Net Present Value", formula: "NPV = -C₀ + Σ[Bt / (1+i)^t]", notes: "Sum of all cash flows discounted to present; positive NPV adds value" },
      { name: "Internal Rate of Return", formula: "0 = -C₀ + Σ[Bt / (1+i)^t]", notes: "Discount rate making NPV=0; solve for i; project acceptable if IRR > required return" },
      { name: "Annual Worth", formula: "AW = NPV × (A/P, i, n)", notes: "Converts NPV to equivalent annual amount; used to compare different lifespans" },
      { name: "Profitability Index", formula: "Profitability Index = PV(benefits) / PV(costs)", notes: "Accept if index > 1; useful for capital rationing with multiple projects" },
      { name: "Payback Period", formula: "Payback = initial investment / average annual benefit", notes: "Years until cumulative cash flows equal initial cost; simple but ignores time value and later cash flows" },
      { name: "Straight-Line Depreciation", formula: "D = (Cost - Salvage value) / Useful life", notes: "Equal annual depreciation; D is amount per year" },
      { name: "Book Value", formula: "Book value = Cost - t·D", notes: "Remaining value after t years of depreciation D per year" },
      { name: "Sum-of-Years-Digits Depreciation", formula: "D = [(Remaining useful life) / (Sum of years 1 to n)] × (Cost - Salvage)", notes: "Accelerated depreciation; front-loads deductions compared to straight-line" },
      { name: "Benefit-Cost Ratio", formula: "B/C = PV(benefits) / PV(costs)", notes: "Accept project if B/C > 1; used for public projects; handles different benefit/cost definitions" }
    ]
  },
  {
    topicId: 4,
    title: "Properties of Electrical Materials",
    formulas: [
      { name: "Resistance from Resistivity", formula: "R = ρL / A", notes: "ρ is material resistivity (Ω·m), L is length (m), A is cross-sectional area (m²)" },
      { name: "Temperature Coefficient of Resistance", formula: "ρ(T) = ρ₀[1 + α(T - T₀)]", notes: "Resistivity changes with temperature; α is temperature coefficient" },
      { name: "Conductivity", formula: "σ = 1 / ρ", notes: "Inverse of resistivity; higher conductivity means lower resistivity" },
      { name: "Intrinsic Carrier Concentration", formula: "ni ∝ exp(-Eg / (2kT))", notes: "Exponential dependence on band gap Eg and temperature T; doubles every ~5-10°C" },
      { name: "Shockley Diode Equation", formula: "I = Is(e^(qV/kT) - 1)", notes: "Exponential current-voltage relationship in diodes; Is is saturation current" },
      { name: "Capacitance from Dielectric", formula: "C = εr·ε₀·A / d", notes: "εr is relative permittivity, ε₀ = 8.85×10⁻¹² F/m, A is area, d is separation" },
      { name: "Inductance with Permeability", formula: "L = μr·μ₀·n²·A / l", notes: "μr is relative permeability, μ₀ = 4π×10⁻⁷ H/m, n is turns, l is coil length" },
      { name: "Heat Conduction", formula: "Q = κ·A·ΔT / Δx", notes: "κ is thermal conductivity (W/m·K), Q is heat flow rate (W)" },
      { name: "Temperature Rise from Power", formula: "ΔT = (P·t) / (m·c)", notes: "P is power (W), t is time (s), m is mass (kg), c is specific heat (J/kg·K)" }
    ]
  },
  {
    topicId: 5,
    title: "Engineering Sciences",
    formulas: [
      { name: "Mechanical Work", formula: "W = F·d·cosθ", notes: "F is force, d is displacement, θ is angle between them" },
      { name: "Electrical Work", formula: "W = ∫V·I dt", notes: "Voltage times current integrated over time" },
      { name: "Power (Electrical)", formula: "P = V·I", notes: "Voltage times current; instantaneous power" },
      { name: "Power Dissipated in Resistor", formula: "P = I²R = V²/R", notes: "Power always positive in resistors; dissipated as heat" },
      { name: "Energy Stored in Capacitor", formula: "W = ½·C·V²", notes: "Energy stored in electric field; proportional to capacitance and voltage squared" },
      { name: "Energy Stored in Inductor", formula: "W = ½·L·I²", notes: "Energy stored in magnetic field; proportional to inductance and current squared" },
      { name: "Efficiency", formula: "η = Pout / Pin", notes: "Output power divided by input power; always < 1 due to losses" },
      { name: "Coulomb's Law", formula: "F = k·Q₁·Q₂ / r²", notes: "k = 8.99×10⁹ N·m²/C²; force between two point charges" },
      { name: "Electric Field", formula: "E = V / d (uniform field) or E = F / Q", notes: "Field strength in V/m; points from positive to negative" },
      { name: "Lorentz Force on Charge", formula: "F = q(E + v × B)", notes: "Force on moving charge in combined electric and magnetic fields" },
      { name: "Lorentz Force on Conductor", formula: "F = B·I·L", notes: "Force on current-carrying conductor in magnetic field; use right-hand rule for direction" },
      { name: "Torque on Current Loop", formula: "τ = N·B·I·A·sinθ", notes: "N is turns, B is flux density, I is current, A is loop area, θ is angle to field" },
      { name: "Maximum Torque on Loop", formula: "τmax = N·B·I·A", notes: "Maximum when loop is perpendicular to field (θ=90°)" },
      { name: "Motional EMF", formula: "ε = B·L·v", notes: "Induced voltage in conductor moving perpendicular to magnetic field" },
      { name: "Rotating Coil EMF", formula: "ε = N·B·ω·A·cos(ωt)", notes: "AC voltage from rotating coil; peak EMF is N·B·ω·A" },
      { name: "Mechanical Power", formula: "P = τ·ω", notes: "Torque times angular velocity; same units as electrical power (watts)" },
      { name: "Strain Gauge Change", formula: "ΔR / R = GF·ε", notes: "GF ≈ 2 for metallic gauges; ε is strain (dimensionless)" },
      { name: "Thermistor Resistance", formula: "R(T) = R₀·exp[β(1/T - 1/T₀)]", notes: "Nonlinear temperature dependence; β is material constant" }
    ]
  },
  {
    topicId: 6,
    title: "Circuit Analysis",
    formulas: [
      { name: "Ohm's Law", formula: "V = I·R", notes: "Voltage equals current times resistance; fundamental circuit law" },
      { name: "Power in Resistor", formula: "P = V·I = I²R = V²/R", notes: "Power dissipated as heat; three equivalent forms" },
      { name: "Series Resistance", formula: "Rtotal = R₁ + R₂ + ... + Rn", notes: "Resistances add in series; same current through all" },
      { name: "Parallel Conductance", formula: "1/Rtotal = 1/R₁ + 1/R₂ + ... + 1/Rn", notes: "Reciprocals add in parallel; same voltage across all" },
      { name: "Parallel Resistance (2 resistors)", formula: "Rtotal = (R₁·R₂) / (R₁ + R₂)", notes: "Quick formula for two resistors in parallel" },
      { name: "Voltage Divider", formula: "Vx = Vtotal · (Rx / (Rx + Ry))", notes: "Voltage across one resistor in series string" },
      { name: "Current Divider", formula: "Ix = Itotal · (Ry / (Rx + Ry))", notes: "Current through one resistor in parallel pair" },
      { name: "Thevenin Equivalent Voltage", formula: "Vth = Voc (open-circuit voltage)", notes: "Voltage measured across open terminals with load disconnected" },
      { name: "Thevenin Equivalent Resistance", formula: "Rth = Voc / Isc", notes: "Resistance seen looking back into circuit; calculated with sources deactivated" },
      { name: "Norton Equivalent Current", formula: "IN = Isc (short-circuit current)", notes: "Current with terminals shorted" },
      { name: "Norton Equivalent Resistance", formula: "RN = Rth", notes: "Norton resistance equals Thevenin resistance" },
      { name: "Thevenin-Norton Relationship", formula: "Vth = IN·Rth", notes: "Relates equivalent voltage and current sources" },
      { name: "Maximum Power Transfer", formula: "Pmax = Vth² / (4·Rth)", notes: "Maximum power when load resistance equals Thevenin resistance" },
      { name: "AC Sinusoid", formula: "v(t) = Vm·cos(ωt + φ)", notes: "Vm is peak voltage, ω = 2πf is angular frequency (rad/s), φ is phase" },
      { name: "Phasor Magnitude", formula: "|V| = Vm / √2", notes: "RMS voltage from peak voltage; used in phasor calculations" },
      { name: "Phasor Conversion (Rect to Polar)", formula: "|Z| = √(R² + X²); θ = arctan(X/R)", notes: "Converts Z = R + jX to polar form |Z|∠θ" },
      { name: "Inductor Impedance", formula: "ZL = jωL", notes: "Impedance of inductor; reactance XL = ωL ohms" },
      { name: "Capacitor Impedance", formula: "ZC = 1/(jωC) = -j/(ωC)", notes: "Impedance of capacitor; reactance XC = 1/(ωC) ohms" },
      { name: "Series Impedance", formula: "Ztotal = Z₁ + Z₂", notes: "Impedances add in series; same current through all" },
      { name: "Parallel Admittance", formula: "1/Ztotal = 1/Z₁ + 1/Z₂", notes: "Reciprocals (admittances) add in parallel; same voltage across all" },
      { name: "Real Power", formula: "P = |V|·|I|·cosφ", notes: "Average power; cosφ is power factor; only dissipated in resistance" },
      { name: "Reactive Power", formula: "Q = |V|·|I|·sinφ", notes: "Oscillating power in VAR; no net energy transfer" },
      { name: "Apparent Power", formula: "S = |V|·|I| = √(P² + Q²)", notes: "Magnitude of complex power; utility charges for this" },
      { name: "Power Factor", formula: "PF = cosφ = P/S", notes: "Ranges 0 to 1; higher is better; indicates efficiency" },
      { name: "Complex Power", formula: "S = P + jQ", notes: "P is real (watts), Q is reactive (VAR)" },
      { name: "Power in Impedance", formula: "P = |I|²·R; Q = |I|²·X", notes: "Power depends on real/imaginary parts of impedance" },
      { name: "Resonant Frequency (series RLC)", formula: "ω₀ = 1/√(LC)", notes: "Frequency where inductive and capacitive reactances equal" },
      { name: "Resonant Frequency (Hz)", formula: "f₀ = 1/(2π√(LC))", notes: "Same as ω₀ but in Hz instead of rad/s" },
      { name: "Quality Factor", formula: "Q = ω₀L/R = 1/(ω₀RC) = √(L/C)/R", notes: "Higher Q means sharper resonance peak; bandwidth = f₀/Q" },
      { name: "Bandwidth", formula: "BW = f₀/Q", notes: "Frequency range where power ≥ 50% of peak power" },
      { name: "Three-Phase RMS Relationship", formula: "VL = √3·Vph (wye)", notes: "Line voltage = √3 times phase voltage in wye connection" },
      { name: "Three-Phase Current Relationship", formula: "IL = √3·Iph (delta)", notes: "Line current = √3 times phase current in delta connection" },
      { name: "Three-Phase Power", formula: "P = √3·VL·IL·cosφ", notes: "Total power = √3 times line voltage times line current times power factor" },
      { name: "Reactive Power (3-phase)", formula: "Q = √3·VL·IL·sinφ", notes: "Reactive power in three-phase system" },
      { name: "RC Time Constant", formula: "τ = R·C", notes: "Time for capacitor to charge/discharge 63% of final value" },
      { name: "RL Time Constant", formula: "τ = L/R", notes: "Time for inductor current to change 63% of final value" },
      { name: "RC Charging Voltage", formula: "vC(t) = V(1 - e^(-t/τ))", notes: "Capacitor voltage during charging from zero to V" },
      { name: "RC Discharging Voltage", formula: "vC(t) = V₀·e^(-t/τ)", notes: "Capacitor voltage during discharge from initial V₀" },
      { name: "RC Charging Current", formula: "i(t) = (V/R)·e^(-t/τ)", notes: "Current during RC charging; starts at V/R, decays to zero" },
      { name: "Damping Ratio", formula: "ζ = R/(2√(L/C))", notes: "Determines if RLC response oscillates (ζ<1) or decays (ζ≥1)" },
      { name: "Natural Frequency", formula: "ωn = 1/√(LC)", notes: "Undamped frequency of RLC oscillation" }
    ]
  },
{
    topicId: 7,
    title: "Linear Systems",
    formulas: [
      {
        name: "Convolution Integral",
        formula: "y(t) = ∫[0 to t] x(τ)h(t-τ)dτ",
        notes: "Relates input, impulse response, and output in time domain"
      },
      {
        name: "Laplace Transform - Unit Step",
        formula: "L{u(t)} = 1/s, s > 0",
        notes: "Fundamental transform pair for step function"
      },
      {
        name: "Laplace Transform - Exponential",
        formula: "L{e^(-at)u(t)} = 1/(s+a), s > -a",
        notes: "Exponential decay in frequency domain"
      },
      {
        name: "Laplace Transform - Sine",
        formula: "L{sin(ωt)u(t)} = ω/(s² + ω²), s > 0",
        notes: "Sinusoidal signal frequency domain representation"
      },
      {
        name: "Laplace Transform - Cosine",
        formula: "L{cos(ωt)u(t)} = s/(s² + ω²), s > 0",
        notes: "Cosine function frequency domain form"
      },
      {
        name: "Laplace Transform - Ramp",
        formula: "L{t·u(t)} = 1/s², s > 0",
        notes: "Linear ramp function in s-domain"
      },
      {
        name: "Transfer Function",
        formula: "H(s) = Y(s)/X(s)",
        notes: "Relates output to input in Laplace domain; defines system behavior"
      },
      {
        name: "Final Value Theorem",
        formula: "lim[t→∞] f(t) = lim[s→0] s·F(s)",
        notes: "Finds steady-state value without inverse transform; poles must be in LHP"
      },
      {
        name: "Initial Value Theorem",
        formula: "lim[t→0+] f(t) = lim[s→∞] s·F(s)",
        notes: "Finds initial value of time-domain function"
      },
      {
        name: "BIBO Stability Criterion",
        formula: "All poles of H(s) must have negative real parts (left half-plane)",
        notes: "System is stable if bounded input produces bounded output; requires all poles in LHP"
      },
      {
        name: "Pole-Zero Analysis",
        formula: "H(s) = K·∏(s-zi)/∏(s-pj)",
        notes: "Zeros at numerator roots, poles at denominator roots; determines response characteristics"
      },
      {
        name: "DC Gain",
        formula: "H(0) = K·∏(-zi)/∏(-pj)",
        notes: "System response at steady state; evaluate H(s) at s=0"
      },
      {
        name: "Time Constant",
        formula: "τ = 1/a for pole at s = -a",
        notes: "Determines exponential decay rate; used for first-order systems"
      },
      {
        name: "Impulse Response (First Order)",
        formula: "h(t) = a·e^(-at)u(t) for H(s) = a/(s+a)",
        notes: "Response to unit impulse; inverse Laplace transform of H(s)"
      },
      {
        name: "Step Response (First Order)",
        formula: "y(t) = K(1 - e^(-t/τ))u(t)",
        notes: "Output response to unit step input; shows settling behavior"
      }
    ]
  },
  {
    topicId: 8,
    title: "Signal Processing",
    formulas: [
      {
        name: "Fourier Series DC Component",
        formula: "a₀ = (1/T)·∫[0 to T] f(t)dt",
        notes: "Average value over one period; represents DC offset"
      },
      {
        name: "Fourier Series Cosine Coefficients",
        formula: "aₙ = (2/T)·∫[0 to T] f(t)·cos(nω₀t)dt",
        notes: "Even-function components in periodic signal expansion"
      },
      {
        name: "Fourier Series Sine Coefficients",
        formula: "bₙ = (2/T)·∫[0 to T] f(t)·sin(nω₀t)dt",
        notes: "Odd-function components in periodic signal expansion"
      },
      {
        name: "Fourier Series Synthesis",
        formula: "f(t) = a₀/2 + Σ[aₙ·cos(nω₀t) + bₙ·sin(nω₀t)]",
        notes: "Reconstructs periodic signal from DC and harmonic components"
      },
      {
        name: "Fourier Transform",
        formula: "F(ω) = ∫[-∞ to ∞] f(t)·e^(-jωt)dt",
        notes: "Transforms non-periodic signal to frequency domain"
      },
      {
        name: "Inverse Fourier Transform",
        formula: "f(t) = (1/2π)·∫[-∞ to ∞] F(ω)·e^(jωt)dω",
        notes: "Reconstructs time-domain signal from frequency spectrum"
      },
      {
        name: "Nyquist Sampling Rate",
        formula: "fs ≥ 2·fmax",
        notes: "Minimum sampling frequency to avoid aliasing; fmax is highest signal frequency"
      },
      {
        name: "Discrete Fourier Transform (DFT)",
        formula: "X[k] = Σ[n=0 to N-1] x[n]·e^(-j2πkn/N)",
        notes: "Computes discrete frequency components from N time-domain samples"
      },
      {
        name: "Frequency Resolution",
        formula: "Δf = fs/N",
        notes: "Spacing between DFT bins; proportional to sampling rate, inversely to N"
      },
      {
        name: "Low-Pass Filter Transfer Function",
        formula: "H(s) = ωc/(s + ωc), ωc = 2πfc",
        notes: "First-order LP filter; attenuates frequencies above cutoff ωc"
      },
      {
        name: "High-Pass Filter Transfer Function",
        formula: "H(s) = s/(s + ωc)",
        notes: "First-order HP filter; passes high frequencies, attenuates low frequencies"
      },
      {
        name: "Band-Pass Filter Transfer Function",
        formula: "H(s) = ω₀Q·s/(s² + ω₀s/Q + ω₀²)",
        notes: "Second-order BP filter; Q determines bandwidth, ω₀ is center frequency"
      },
      {
        name: "Parseval's Theorem (Energy)",
        formula: "∫[-∞ to ∞] |f(t)|² dt = (1/2π)·∫[-∞ to ∞] |F(ω)|² dω",
        notes: "Total signal energy conserved in time and frequency domains"
      },
      {
        name: "Power Spectral Density",
        formula: "S(f) = |F(f)|²/T or E(f) = |F(f)|²",
        notes: "Power per unit frequency; used for random signals analysis"
      },
      {
        name: "Filter Attenuation (dB)",
        formula: "Attenuation(dB) = 20·log₁₀(|H(f)|)",
        notes: "Logarithmic measure of filter gain; negative for attenuation"
      }
    ]
  },
  {
    topicId: 9,
    title: "Electronics",
    formulas: [
      {
        name: "Diode Ideal Equation",
        formula: "ID = Is·(e^(VD/Vt) - 1)",
        notes: "Exponential I-V relationship; Vt = kT/q ≈ 26mV at 25°C"
      },
      {
        name: "BJT Collector Current",
        formula: "IC = β·IB",
        notes: "Forward-active mode; β is current gain (hFE), typically 50-300"
      },
      {
        name: "BJT Emitter Current",
        formula: "IE = IC + IB = (1+β)·IB",
        notes: "Emitter current is sum of collector and base currents"
      },
      {
        name: "BJT Current Gain",
        formula: "β = IC/IB or α = IC/IE with β = α/(1-α)",
        notes: "β relates collector to base current; α is common-base gain"
      },
      {
        name: "MOSFET Saturation Drain Current",
        formula: "ID = (μₙ·Cox/2)·(W/L)·(VGS - VT)²·(1 + λ·VDS)",
        notes: "Saturation region; VDS > VGS - VT; λ is channel-length modulation"
      },
      {
        name: "MOSFET Triode Drain Current",
        formula: "ID = (μₙ·Cox)·(W/L)·[(VGS - VT)·VDS - VDS²/2]",
        notes: "Linear/triode region; VDS < VGS - VT; acts as voltage-controlled resistor"
      },
      {
        name: "Op-Amp Inverting Gain",
        formula: "Vout = -Vf·(Rf/Rin)",
        notes: "Output inverted; gain magnitude = Rf/Rin; ideal op-amp (infinite CMRR)"
      },
      {
        name: "Op-Amp Non-Inverting Gain",
        formula: "Vout = Vin·(1 + Rf/Rin)",
        notes: "Non-inverting configuration; gain ≥ 1; high input impedance"
      },
      {
        name: "Op-Amp Summing Amplifier",
        formula: "Vout = -Rf·(V₁/R₁ + V₂/R₂ + ... + Vₙ/Rₙ)",
        notes: "Weighted sum of multiple inputs; uses inverting configuration"
      },
      {
        name: "Op-Amp Difference Amplifier",
        formula: "Vout = (Rf/Rin)·(V₂ - V₁) when R₁=R₂ and Rf=Rg",
        notes: "Amplifies difference between two inputs; rejects common-mode"
      },
      {
        name: "Op-Amp Integrator",
        formula: "Vout = -(1/RC)·∫Vin·dt",
        notes: "Output proportional to integral of input; uses capacitor in feedback"
      },
      {
        name: "Op-Amp Differentiator",
        formula: "Vout = -RC·dVin/dt",
        notes: "Output proportional to derivative of input; capacitor at input"
      },
      {
        name: "Half-Wave Rectifier Average Output",
        formula: "Vdc = Vm/π ≈ 0.318·Vm",
        notes: "Peak output Vm appears half the period; used for simple rectification"
      },
      {
        name: "Full-Wave Rectifier Average Output",
        formula: "Vdc = 2Vm/π ≈ 0.636·Vm",
        notes: "Both half-cycles rectified; Vm is peak input voltage"
      },
      {
        name: "Voltage Regulation",
        formula: "Vr = (Vout,no-load - Vout,full-load)/Vout,full-load × 100%",
        notes: "Percentage change in output voltage with load variation"
      }
    ]
  },
  {
    topicId: 10,
    title: "Power Systems",
    formulas: [
      {
        name: "Three-Phase Real Power",
        formula: "P = √3·VL·IL·cos(φ) [Watts]",
        notes: "VL is line voltage, IL is line current, φ is power factor angle"
      },
      {
        name: "Three-Phase Reactive Power",
        formula: "Q = √3·VL·IL·sin(φ) [VAR]",
        notes: "Reactive power component; positive for inductive, negative for capacitive"
      },
      {
        name: "Three-Phase Apparent Power",
        formula: "S = √3·VL·IL [VA] or S = √(P² + Q²)",
        notes: "Total power magnitude; includes real and reactive components"
      },
      {
        name: "Power Factor",
        formula: "pf = cos(φ) = P/S",
        notes: "Ratio of real to apparent power; ranges 0 to 1"
      },
      {
        name: "Transformer Turns Ratio",
        formula: "Vp/Vs = Np/Ns = Is/Ip",
        notes: "Primary to secondary voltage and current ratios; inverse relationship"
      },
      {
        name: "Transformer Impedance Ratio",
        formula: "Zp/Zs = (Np/Ns)²",
        notes: "Primary impedance scales as square of turns ratio"
      },
      {
        name: "Voltage Regulation (Transformer)",
        formula: "VR = (VNL - VFL)/VFL × 100%",
        notes: "VNL is no-load voltage, VFL is full-load voltage"
      },
      {
        name: "Per-Unit Base Calculations",
        formula: "Per-unit value = Actual value / Base value",
        notes: "Normalizes values for easier analysis; choose appropriate base values"
      },
      {
        name: "Power Factor Correction Capacitor",
        formula: "Q_cap = P·(tan(φ₁) - tan(φ₂))",
        notes: "Required reactive power to improve pf from φ₁ to φ₂"
      },
      {
        name: "Synchronous Speed",
        formula: "ns = 120·f/P [rpm]",
        notes: "f is frequency (Hz), P is number of poles; rotating field speed"
      },
      {
        name: "Motor Slip",
        formula: "s = (ns - nr)/ns",
        notes: "nr is rotor speed; slip = 0 at synchronous speed, 1 at standstill"
      },
      {
        name: "Induction Motor Torque",
        formula: "τ = (3·Vs²·R'r)/(ωs·(Rs + Rr)² + (Xs + X'r)²))",
        notes: "Maximum torque at specific slip value; dependent on rotor resistance"
      },
      {
        name: "Power Factor Correction Angle",
        formula: "φ = arccos(target pf)",
        notes: "Phase angle for capacitor bank sizing calculations"
      },
      {
        name: "Three-Phase to Single-Phase Power",
        formula: "Psingle = P·(1 - cos(120° - φ))",
        notes: "Power available on single phase in three-phase system"
      },
      {
        name: "Load Angle (Generator)",
        formula: "Pout = (Ef·Vt/X)·sin(δ)",
        notes: "δ is load angle between EMF and terminal voltage; maximum at δ=90°"
      }
    ]
  },
  {
    topicId: 11,
    title: "Electromagnetics",
    formulas: [
      {
        name: "Coulomb's Law",
        formula: "F = k·q₁·q₂/r² = q₁·q₂/(4πε₀εr·r²)",
        notes: "Force between point charges; k = 8.99×10⁹ N·m²/C²"
      },
      {
        name: "Electric Field",
        formula: "E = F/q or E = k·Q/r²",
        notes: "Force per unit charge; radiates outward from positive charge"
      },
      {
        name: "Gauss's Law",
        formula: "∮E·dA = Q_enclosed/ε₀",
        notes: "Electric flux through closed surface equals enclosed charge divided by ε₀"
      },
      {
        name: "Magnetic Field - Biot-Savart Law",
        formula: "B = (μ₀/4π)·∫(I·dl × r̂)/r²",
        notes: "Infinitesimal magnetic field from current element"
      },
      {
        name: "Ampere's Law",
        formula: "∮B·dl = μ₀·I_enclosed",
        notes: "Line integral of B around closed path equals μ₀ times enclosed current"
      },
      {
        name: "Magnetic Field - Long Straight Wire",
        formula: "B = (μ₀·I)/(2π·r)",
        notes: "Circular field around wire; μ₀ = 4π×10⁻⁷ T·m/A"
      },
      {
        name: "Faraday's Law (Electromagnetic Induction)",
        formula: "ℰ = -dΦ/dt = -d(B·A)/dt",
        notes: "Induced EMF from changing magnetic flux; negative sign indicates Lenz's law"
      },
      {
        name: "Lorentz Force",
        formula: "F = q(E + v × B)",
        notes: "Total force on moving charge in electric and magnetic fields"
      },
      {
        name: "Wave Equation",
        formula: "∂²E/∂t² = (1/c²)·∂²E/∂x² where c = 1/√(μ₀ε₀)",
        notes: "Describes EM wave propagation; c = 3×10⁸ m/s in vacuum"
      },
      {
        name: "Intrinsic Impedance",
        formula: "η = √(μ/ε) = (μ₀/ε₀)√(μᵣ/εᵣ)",
        notes: "Wave impedance of medium; η₀ ≈ 377Ω in free space"
      },
      {
        name: "Reflection Coefficient",
        formula: "Γ = (ZL - Z₀)/(ZL + Z₀)",
        notes: "Amplitude ratio of reflected to incident wave; relates to impedance mismatch"
      },
      {
        name: "Standing Wave Ratio (VSWR)",
        formula: "VSWR = (1 + |Γ|)/(1 - |Γ|) = Vmax/Vmin",
        notes: "Measures impedance mismatch; VSWR = 1 is perfect match"
      },
      {
        name: "Skin Depth",
        formula: "δ = 1/√(πfμσ)",
        notes: "Depth where current density drops to 1/e of surface value; higher frequency = shallower"
      },
      {
        name: "Poynting Vector",
        formula: "S = (1/μ₀)·(E × B) [W/m²]",
        notes: "Electromagnetic power flow density; average power is time-averaged Poynting vector"
      },
      {
        name: "Maxwell's Equations Summary",
        formula: "∮E·dA = Q/ε₀, ∮B·dA = 0, ∮E·dl = -dΦB/dt, ∮B·dl = μ₀(I + ε₀·dΦE/dt)",
        notes: "Foundation of electromagnetism; relates E, B, charges, and currents"
      }
    ]
  },
  {
    topicId: 12,
    title: "Control Systems",
    formulas: [
      {
        name: "Closed-Loop Transfer Function",
        formula: "T(s) = G(s)/(1 + G(s)·H(s))",
        notes: "G is forward path, H is feedback path; 1 + G·H is characteristic equation"
      },
      {
        name: "Error Transfer Function",
        formula: "E(s) = R(s)/(1 + G(s)·H(s))",
        notes: "Relates error to reference input; smaller denominators give lower errors"
      },
      {
        name: "Characteristic Equation",
        formula: "1 + G(s)·H(s) = 0",
        notes: "Poles of closed-loop system; determines stability and response"
      },
      {
        name: "Steady-State Error (Unit Step)",
        formula: "ess = 1/(1 + Kp) where Kp = lim[s→0] G(s)·H(s)",
        notes: "Position error constant Kp; ess = 0 if system type ≥ 1"
      },
      {
        name: "Steady-State Error (Unit Ramp)",
        formula: "ess = 1/Kv where Kv = lim[s→0] s·G(s)·H(s)",
        notes: "Velocity error constant; requires system type ≥ 2 for zero error"
      },
      {
        name: "Steady-State Error (Unit Parabola)",
        formula: "ess = 1/Ka where Ka = lim[s→0] s²·G(s)·H(s)",
        notes: "Acceleration error constant; requires system type ≥ 3 for zero error"
      },
      {
        name: "PID Controller",
        formula: "u(t) = Kp·e(t) + Ki·∫e(t)dt + Kd·de/dt",
        notes: "Proportional, integral, derivative terms; tuning via Ziegler-Nichols or other methods"
      },
      {
        name: "Percent Overshoot",
        formula: "%OS = e^(-πζ/√(1-ζ²))·100%",
        notes: "ζ is damping ratio; %OS = 0 at critical damping (ζ=1)"
      },
      {
        name: "Settling Time (2% criterion)",
        formula: "ts = 4/(ζ·ωn)",
        notes: "Time to reach and stay within 2% of steady-state; ωn is natural frequency"
      },
      {
        name: "Rise Time (First-Order)",
        formula: "tr ≈ 1.1/ω = 1.1·τ",
        notes: "Time from 10% to 90% of final value; τ = 1/a for pole at -a"
      },
      {
        name: "Natural Frequency",
        formula: "ωn = √(a₀) for characteristic equation s² + 2ζωn·s + ωn² = 0",
        notes: "Frequency of undamped oscillation; related to system poles"
      },
      {
        name: "Damping Ratio",
        formula: "ζ = a₁/(2·ωn) = a₁/(2√(a₀))",
        notes: "Determines response shape; ζ < 1 is underdamped, ζ = 1 is critical"
      },
      {
        name: "Peak Time",
        formula: "tp = π/(ωn·√(1-ζ²))",
        notes: "Time to reach maximum overshoot; only for underdamped systems"
      },
      {
        name: "Gain Margin",
        formula: "GM = 1/|G(jωpc)| where ∠G(jωpc) = -180°",
        notes: "Amount of gain increase to instability; ωpc is phase crossover frequency"
      },
      {
        name: "Phase Margin",
        formula: "PM = 180° + ∠G(jωgc) where |G(jωgc)| = 1",
        notes: "Amount of phase decrease to instability; ωgc is gain crossover frequency"
      }
    ]
  },
  {
    topicId: 13,
    title: "Communications",
    formulas: [
      {
        name: "AM Bandwidth",
        formula: "BW = 2·fm",
        notes: "fm is modulating signal frequency; upper and lower sidebands"
      },
      {
        name: "AM Modulation Index",
        formula: "μ = Am/Ac",
        notes: "Am is modulating signal amplitude, Ac is carrier amplitude; μ ≤ 1 prevents overmodulation"
      },
      {
        name: "FM Bandwidth (Carson's Rule)",
        formula: "BW = 2(Δf + fm)",
        notes: "Δf is frequency deviation, fm is modulating frequency; more accurate for FM"
      },
      {
        name: "FM Modulation Index",
        formula: "mf = Δf/fm",
        notes: "Ratio of frequency deviation to modulating frequency"
      },
      {
        name: "Shannon Channel Capacity",
        formula: "C = B·log₂(1 + SNR) [bits/s]",
        notes: "B is bandwidth in Hz, SNR is signal-to-noise ratio (linear); theoretical maximum"
      },
      {
        name: "Signal-to-Noise Ratio (dB)",
        formula: "SNR(dB) = 10·log₁₀(Psignal/Pnoise)",
        notes: "Logarithmic measure; higher SNR indicates better quality"
      },
      {
        name: "Noise Figure (Linear)",
        formula: "F = SNRin/SNRout",
        notes: "Ratio of input to output SNR; F ≥ 1 always"
      },
      {
        name: "Noise Figure (dB)",
        formula: "NF(dB) = 10·log₁₀(F)",
        notes: "Logarithmic noise figure; lower is better"
      },
      {
        name: "Friis Noise Figure Formula",
        formula: "Ftotal = F₁ + (F₂-1)/G₁ + (F₃-1)/(G₁·G₂) + ...",
        notes: "Cascaded system noise figure; first stage dominates; Gi is gain of stage i"
      },
      {
        name: "Bit Error Rate (Theoretical)",
        formula: "BER ≈ Q(√(2·Eb/N₀))",
        notes: "Q-function approximates error probability; Eb is bit energy, N₀ is noise spectral density"
      },
      {
        name: "PCM Quantization Levels",
        formula: "Number of levels = 2^n",
        notes: "n is number of bits; determines quantization error Δ = Vrange/2^n"
      },
      {
        name: "PCM Bit Rate",
        formula: "Rb = n·fs",
        notes: "n is bits per sample, fs is sampling rate (Hz)"
      },
      {
        name: "QPSK Spectral Efficiency",
        formula: "η = 2 bits/symbol",
        notes: "QPSK uses 4 symbols; double that of BPSK"
      },
      {
        name: "Bandwidth for BPSK Modulation",
        formula: "BW = 2·Rb (for raised cosine, roll-off factor = 1)",
        notes: "Rb is bit rate; actual bandwidth depends on pulse shaping filter"
      },
      {
        name: "Link Budget Equation",
        formula: "PRx(dBm) = PTx(dBm) + GTx(dBi) + GRx(dBi) - PathLoss(dB)",
        notes: "Received power calculation; critical for wireless system design"
      }
    ]
  },
  {
    topicId: 14,
    title: "Computer Networks",
    formulas: [
      {
        name: "Subnet Mask (CIDR Notation)",
        formula: "Network/Prefix-length (e.g., 192.168.1.0/24)",
        notes: "/24 means first 24 bits are network; 8 bits for hosts (256 total)"
      },
      {
        name: "Number of Hosts per Subnet",
        formula: "Number of hosts = 2^(32 - prefix-length) - 2",
        notes: "Subtract 2 for network address and broadcast address"
      },
      {
        name: "IP Address Calculation",
        formula: "Usable IPs: 2^(host bits) - 2",
        notes: "Depends on prefix length; /30 = 2 hosts, /25 = 126 hosts, /24 = 254 hosts"
      },
      {
        name: "Network Address",
        formula: "IP address AND subnet mask",
        notes: "First address of subnet; not assignable to hosts"
      },
      {
        name: "Broadcast Address",
        formula: "Network address + (2^(32 - prefix) - 1)",
        notes: "Last address of subnet; not assignable to hosts"
      },
      {
        name: "Throughput",
        formula: "Throughput = Payload size / (Round-trip time)",
        notes: "Practical data rate; affected by overhead and latency"
      },
      {
        name: "Propagation Delay",
        formula: "Tprop = Distance / Propagation speed",
        notes: "Speed ≈ 2/3 speed of light in copper; distance in meters or kilometers"
      },
      {
        name: "Transmission Delay",
        formula: "Ttrans = Packet size / Link bandwidth",
        notes: "Time to transmit entire packet; bit length divided by bits per second"
      },
      {
        name: "Total Latency",
        formula: "Total delay = Tprop + Ttrans + Processing time + Queuing time",
        notes: "Combines all delay sources in network path"
      },
      {
        name: "Bandwidth-Delay Product",
        formula: "BDP = Bandwidth × Round-trip time [bits]",
        notes: "Maximum bits in flight; critical for TCP window sizing"
      },
      {
        name: "Shannon Capacity (Network)",
        formula: "C = B·log₂(1 + SNR) [bits/s]",
        notes: "Maximum theoretical data rate for noisy channel"
      },
      {
        name: "Utilization",
        formula: "Utilization = Actual throughput / Channel capacity",
        notes: "Percentage of link bandwidth being used"
      },
      {
        name: "Packet Loss Rate",
        formula: "PLR = Lost packets / Total packets sent",
        notes: "Expressed as percentage or decimal; impacts quality and retransmissions"
      },
      {
        name: "Jitter (Delay Variation)",
        formula: "Jitter = Standard deviation of packet delays",
        notes: "Measured in milliseconds; critical for real-time applications like VoIP"
      },
      {
        name: "TCP Window Size Adjustment",
        formula: "Cwnd increases by 1 MSS per ACK in congestion avoidance",
        notes: "Cwnd (congestion window) controls transmitted data; additive increase"
      }
    ]
  },
  {
    topicId: 15,
    title: "Digital Systems",
    formulas: [
      {
        name: "Boolean Algebra - DeMorgan's Law 1",
        formula: "~(A·B) = ~A + ~B",
        notes: "Complement of AND equals OR of complements"
      },
      {
        name: "Boolean Algebra - DeMorgan's Law 2",
        formula: "~(A + B) = ~A·~B",
        notes: "Complement of OR equals AND of complements"
      },
      {
        name: "Boolean Algebra - Absorption Law 1",
        formula: "A + A·B = A",
        notes: "Variable absorbed when OR'd with AND containing that variable"
      },
      {
        name: "Boolean Algebra - Absorption Law 2",
        formula: "A·(A + B) = A",
        notes: "Variable absorbs AND with OR containing that variable"
      },
      {
        name: "Boolean Algebra - Consensus Theorem",
        formula: "A·B + ~A·C + B·C = A·B + ~A·C",
        notes: "Redundant term can be eliminated in SOP expressions"
      },
      {
        name: "Karnaugh Map Grouping Rule",
        formula: "Groups must be powers of 2: 1, 2, 4, 8, 16 cells",
        notes: "Largest rectangular groups give simplest expressions"
      },
      {
        name: "D Flip-Flop Characteristic Equation",
        formula: "Q(next) = D",
        notes: "Output follows data input on clock edge; simplest flip-flop"
      },
      {
        name: "JK Flip-Flop Characteristic Equation",
        formula: "Q(next) = J·~Q + ~K·Q",
        notes: "J=1,K=0 sets, J=0,K=1 resets, J=K=1 toggles, J=K=0 holds"
      },
      {
        name: "T Flip-Flop Characteristic Equation",
        formula: "Q(next) = T XOR Q = T⊕Q",
        notes: "T=1 toggles, T=0 holds; used in counters"
      },
      {
        name: "SR Flip-Flop Characteristic Equation",
        formula: "Q(next) = S + ~R·Q",
        notes: "Set-Reset; S=1 sets, R=1 resets, S=R=1 is invalid in NOR latch"
      },
      {
        name: "Counter Modulus",
        formula: "Modulus = 2^n for n-bit counter",
        notes: "Maximum count before reset; n-bit counter counts 0 to 2^n - 1"
      },
      {
        name: "Decade Counter (BCD)",
        formula: "Counts 0-9 (10 states); modulus = 10",
        notes: "Requires feedback logic to reset at count 10"
      },
      {
        name: "Binary Counter Maximum Count",
        formula: "Max count = 2^n - 1 for n-bit counter",
        notes: "4-bit counter: 0-15, 8-bit: 0-255"
      },
      {
        name: "Memory Address Lines",
        formula: "Number of addresses = 2^n for n address lines",
        notes: "8 address lines → 256 addresses, 16 lines → 65536 addresses"
      },
      {
        name: "Memory Word Size and Capacity",
        formula: "Total capacity = 2^n × word size [bits]",
        notes: "n address lines, each location stores word_size bits"
      }
    ]
  },
  {
    topicId: 16,
    title: "Computer Systems",
    formulas: [
      {
        name: "Clock Cycles Per Instruction (CPI)",
        formula: "CPI = Total clock cycles / Number of instructions",
        notes: "Average cycles to execute one instruction; lower is better"
      },
      {
        name: "Execution Time",
        formula: "T = N·CPI / f",
        notes: "N is number of instructions, f is clock frequency (Hz)"
      },
      {
        name: "MIPS (Million Instructions Per Second)",
        formula: "MIPS = N / (T × 10⁶) = f·(10⁻⁶) / CPI",
        notes: "Higher is better; useful for simple performance comparison"
      },
      {
        name: "Amdahl's Law (Speedup)",
        formula: "Speedup = 1 / [f + (1-f)/S]",
        notes: "f is fraction of code parallelizable, S is speedup of parallel part"
      },
      {
        name: "Cache Hit Rate",
        formula: "Hit rate = Cache hits / Total accesses",
        notes: "Expressed as percentage; higher hit rate improves performance"
      },
      {
        name: "Cache Miss Rate",
        formula: "Miss rate = 1 - Hit rate = Cache misses / Total accesses",
        notes: "Fraction of accesses requiring memory; impacts average access time"
      },
      {
        name: "Effective Memory Access Time",
        formula: "EMAT = Hit rate × Tcache + Miss rate × Tmem",
        notes: "Average time per memory access; considers cache and miss penalty"
      },
      {
        name: "Two-Level Cache EMAT",
        formula: "EMAT = h₁·Tc₁ + (1-h₁)·h₂·Tc₂ + (1-h₁)·(1-h₂)·Tmem",
        notes: "L1 and L2 caches in series; includes both hit and miss paths"
      },
      {
        name: "Cache Block/Line Size",
        formula: "Block size = 2^n bytes",
        notes: "Typical: 16B, 32B, 64B; larger blocks reduce miss rate but increase miss penalty"
      },
      {
        name: "Number of Cache Blocks",
        formula: "Number of blocks = Cache size / Block size",
        notes: "Determines index field width; must fit within cache capacity"
      },
      {
        name: "Bus Bandwidth",
        formula: "Bandwidth = Bus width (bits) × Clock frequency (Hz)",
        notes: "Maximum data transfer rate; e.g., 64-bit @ 100 MHz = 6.4 GB/s"
      },
      {
        name: "Memory Bandwidth",
        formula: "Bandwidth = Frequency × Data width / Cycles per transfer",
        notes: "Actual sustained transfer rate; includes overhead and latency"
      },
      {
        name: "Instruction-Level Parallelism (ILP)",
        formula: "ILP = CPI_ideal / CPI_actual",
        notes: "Ratio of ideal to actual CPI; affected by data/control hazards"
      },
      {
        name: "Pipeline Throughput",
        formula: "Throughput = 1 instruction / clock cycle (ideal, no hazards)",
        notes: "One instruction per stage per cycle in fully utilized pipeline"
      },
      {
        name: "Context Switch Overhead",
        formula: "Overhead = Time to save/restore registers + TLB invalidation",
        notes: "Significant performance cost; minimized by optimized kernels"
      }
    ]
  },
  {
    topicId: 17,
    title: "Software Development",
    formulas: [
      {
        name: "Big-O: Binary Search",
        formula: "O(log₂ n)",
        notes: "Halves search space each iteration; requires sorted array"
      },
      {
        name: "Big-O: Linear Search",
        formula: "O(n)",
        notes: "Examines each element; works on unsorted data"
      },
      {
        name: "Big-O: Quicksort",
        formula: "O(n log n) average case, O(n²) worst case",
        notes: "Divide-and-conquer sorting; in-place; poor worst-case with bad pivot"
      },
      {
        name: "Big-O: Merge Sort",
        formula: "O(n log n) all cases",
        notes: "Guaranteed O(n log n); requires O(n) extra space; stable"
      },
      {
        name: "Big-O: Bubble Sort",
        formula: "O(n²) average and worst case",
        notes: "Simple but inefficient; stable; in-place"
      },
      {
        name: "Big-O: Insertion Sort",
        formula: "O(n²) average and worst case, O(n) best case",
        notes: "Efficient for small n; stable; in-place; online"
      },
      {
        name: "Big-O: Hash Table Operations",
        formula: "O(1) average case, O(n) worst case for search/insert/delete",
        notes: "Average O(1) with good hash and load factor; collisions cause degradation"
      },
      {
        name: "Big-O: Breadth-First Search (BFS)",
        formula: "O(V + E)",
        notes: "V vertices, E edges; visits all reachable nodes; uses queue"
      },
      {
        name: "Big-O: Depth-First Search (DFS)",
        formula: "O(V + E)",
        notes: "V vertices, E edges; explores deep before backtracking; uses stack/recursion"
      },
      {
        name: "Big-O: Dijkstra's Algorithm",
        formula: "O((V + E)·log V) with binary heap, O(V²) with simple array",
        notes: "Shortest path in non-negative weight graphs"
      },
      {
        name: "Recursion Tree Depth",
        formula: "Depth = O(log n) for balanced binary trees, O(n) for skewed",
        notes: "Maximum recursion depth limits problem size; stack overflow risk"
      },
      {
        name: "Fibonacci Recursive Calls",
        formula: "T(n) = O(φⁿ) where φ = (1+√5)/2 ≈ 1.618 (golden ratio)",
        notes: "Exponential growth without memoization; dynamic programming improves to O(n)"
      },
      {
        name: "Database Normal Form Levels",
        formula: "1NF < 2NF < 3NF < BCNF < 4NF < 5NF",
        notes: "Progressive stages of normalization; 3NF sufficient for most applications"
      },
      {
        name: "Time Complexity: Nested Loops",
        formula: "T(n) = O(n) for one loop, O(n²) for two nested, O(n³) for three nested",
        notes: "Each nesting level multiplies complexity; avoid deep nesting"
      },
      {
        name: "Space-Time Tradeoff",
        formula: "Spacetime product ≈ Constant (in many algorithms)",
        notes: "Memoization trades space for time; hashing trades space for lookup speed"
      }
    ]
  }
];

export const FE_EE_FORMULA_COUNT = FE_EE_FORMULA_SHEETS.reduce(
  (sum, sheet) => sum + sheet.formulas.length, 0
);

export function getFEEEFormulas(topicId?: number): FormulaSheet[] {
  if (topicId === undefined) return FE_EE_FORMULA_SHEETS;
  return FE_EE_FORMULA_SHEETS.filter(s => s.topicId === topicId);
}
