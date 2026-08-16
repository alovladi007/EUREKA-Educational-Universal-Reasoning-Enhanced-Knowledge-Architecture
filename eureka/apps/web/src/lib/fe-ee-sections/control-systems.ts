// FE EE course content — Control Systems (7 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_CONTROL_SYSTEMS: Record<string, TopicLesson> = {
  fee_block_diagrams: {
  topicId: 'fee_block_diagrams',
  title: 'Block Diagrams & Transfer Function Reduction',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'Block diagrams represent control systems graphically with blocks (transfer functions), summing junctions, and pickoff points. Reducing complex diagrams to a single closed-loop transfer function is a core FE exam skill.',
  sections: [
    {
      id: 'bd-reduction-rules',
      title: '1. Block Diagram Reduction Rules',
      content: `## 1.1 Fundamental Combinations

| Configuration | Rule | Formula |
|---|---|---|
| **Series** (cascade) | Multiply | **$G_{total} = G_{1} \\cdot G_{2}$** |
| **Parallel** | Add | **$G_{total} = G_{1} + G_{2}$** |
| **Negative feedback** | Feedback formula | **$T(s) = G(s) / (1 + G(s)\\cdot H(s))$** |
| **Positive feedback** | Sign change | **$T(s) = G(s) / (1 - G(s)\\cdot H(s))$** |

where G(s) is the forward path and H(s) is the feedback path.

### Unity Feedback (H = 1)

**$T(s) = G(s) / (1 + G(s))$**

## 1.2 Block Diagram Manipulation

When blocks cannot be directly combined, use these moves:

- **Moving a pickoff point past a block**: multiply by 1/G (or G) in the moved branch
- **Moving a summing junction past a block**: multiply by G (or 1/G) in the moved branch
- **Swapping summing junctions**: order does not matter (commutative)

### Step-by-Step Reduction

1. Identify innermost feedback loops
2. Reduce inner loops first using T = G/(1 + GH)
3. Combine series blocks (multiply)
4. Combine parallel blocks (add)
5. Repeat until single transfer function remains

## 1.3 Transfer Function Fundamentals

**$G(s) = Y(s)/R(s)$** (output over input in Laplace domain)

- **Poles**: values of s where denominator = 0 (determine stability and transient behavior)
- **Zeros**: values of s where numerator = 0 (affect transient shape and steady-state)
- **Order**: highest power of s in denominator`,
      examTip: 'The feedback formula T(s) = G/(1 + GH) is the single most important control systems equation on the FE exam. For negative feedback, use + in the denominator; for positive feedback, use −. Most exam problems use negative feedback.',
    },
    {
      id: 'bd-mason-sensitivity',
      title: "2. Mason's Gain Formula and Feedback Benefits",
      content: `## 2.1 Mason's Gain Formula

For complex multi-loop systems where sequential reduction is tedious:

**$T(s) = \\Sigma (P_k \\cdot \\Delta _k) / \\Delta$**

where:
- **P_k** = gain of the k-th forward path
- **Δ** = 1 − (sum of all loop gains) + (sum of products of non-touching loop pairs) − ...
- **$\\Delta _k$** = Δ evaluated with all loops touching path k removed

### Practical Steps

1. Identify all **forward paths** from input to output → compute P_k
2. Identify all **individual loop gains** → $L_{1}$, $L_{2}$, ...
3. Find **non-touching loop pairs** (no shared nodes)
4. Compute Δ = 1 − ΣL_i + ΣL_iL_j (non-touching pairs) − ...
5. Compute Δ_k for each forward path

## 2.2 Benefits of Negative Feedback

| Benefit | Mechanism |
|---|---|
| **Reduces steady-state error** | Error = R/(1 + GH); larger GH → smaller error |
| **Reduces sensitivity** | Sensitivity S = 1/(1 + GH); system less affected by G variations |
| **Reduces distortion/nonlinearity** | Feedback linearizes the system |
| **Extends bandwidth** | Closed-loop bandwidth > open-loop bandwidth |

### Tradeoffs of Feedback

- Requires more components (sensor, controller)
- Can cause instability if loop gain is too high
- Reduces overall gain by factor (1 + GH)`,
      examTip: "Mason's gain formula is efficient for complex diagrams but rarely needed on the FE exam — most problems can be solved with the basic feedback formula T = G/(1+GH) and series/parallel rules. Use Mason only when the diagram has crossing loops that prevent sequential reduction.",
      importantNote: 'Positive feedback (T = G/(1 − GH)) is inherently unstable if GH > 1. Most practical control systems use negative feedback. If an FE exam problem does not specify, assume negative feedback.',
    },
  ],
  keyTakeaways: [
    'Series blocks: multiply. Parallel blocks: add. Feedback: T = G/(1 + GH).',
    'Unity feedback: T = G/(1 + G); closed-loop poles determine stability.',
    "Mason's gain formula handles complex multi-loop diagrams.",
    'Negative feedback reduces error, sensitivity, and distortion but lowers gain.',
    'Poles of the closed-loop transfer function must have negative real parts for stability.',
  ],
},

  fee_stability: {
  topicId: 'fee_stability',
  title: 'Stability Analysis: Routh-Hurwitz Criterion',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'The Routh-Hurwitz criterion determines closed-loop stability without computing pole locations. By constructing a simple array from the characteristic polynomial coefficients, you can count the number of unstable (right-half-plane) poles. This algebraic method is faster than root-finding and is a staple FE exam topic.',
  sections: [
    {
      id: 'stab-routh-array',
      title: '1. Constructing and Reading the Routh Array',
      content: `## 1.1 Characteristic Polynomial

The closed-loop transfer function denominator:

**$D(s) = a_n\\cdot s^n + a_(n-1)\\cdot s^{n-1} + ... + a_{1}\\cdot s + a_{0}$**

**Necessary condition** for stability: all coefficients a_i must be **positive** (same sign). If any coefficient is zero or negative, the system is **definitely unstable** (no need to build the array).

## 1.2 Building the Routh Array

| Row | Entries |
|---|---|
| **$s^n$** | a_n, a_(n-2), a_(n-4), ... |
| **$s^{n-1}$** | a_(n-1), a_(n-3), a_(n-5), ... |
| **$s^{n-2}$** | $b_{1}, b_{2}, b_{3}, ...$ |
| **$s^{n-3}$** | $c_{1}, c_{2}, c_{3}, ...$ |
| ... | ... |
| **$s^{0}$** | last entry |

### Computing Entries

**$b_{1} = (a_(n-1)\\cdot a_(n-2) - a_n\\cdot a_(n-3)) / a_(n-1)$**

**$b_{2} = (a_(n-1)\\cdot a_(n-4) - a_n\\cdot a_(n-5)) / a_(n-1)$**

General pattern: **negative determinant** of 2×2 matrix from previous two rows, divided by first element of previous row.

## 1.3 Reading Stability

**Number of sign changes in the first column = number of right-half-plane (RHP) poles**

- **All positive** first column → **STABLE** (all poles in LHP)
- **One sign change** → one unstable pole
- **Two sign changes** → two unstable poles

### Quick Check for Low-Order Systems

| Order | Stability Condition |
|---|---|
| 1st: as + b | $a, b > 0$ |
| $2nd: as^{2} + bs + c$ | a, b, c > 0 (all positive) |
| $3rd: as^{3} + bs^{2} + cs + d$ | $a, b, c, d > 0 AND bc > ad$ |`,
      examTip: 'For 2nd-order systems, just check that all three coefficients are positive — no array needed. For 3rd-order, check all four coefficients positive AND bc > ad. These shortcuts save significant time on the FE exam.',
      importantNote: 'If ANY coefficient in the characteristic polynomial is missing (zero) or negative, the system is unstable — period. You do not need to construct the Routh array. This quick check eliminates many answer choices immediately.',
    },
    {
      id: 'stab-special-cases',
      title: '2. Special Cases and Stability Design',
      content: `## 2.1 Special Case: Zero in First Column

If a first-column entry is zero but the rest of the row is not all zeros:

1. Replace the zero with a small positive number **ε**
2. Continue building the array in terms of ε
3. Take the limit as ε → $0^{+}$
4. Examine sign changes in the first column

## 2.2 Special Case: Entire Row of Zeros

An entire row of zeros indicates **symmetric root pairs** about the origin:
- Pairs of poles on the **imaginary axis** (marginally stable / sustained oscillation)
- Or pairs of poles symmetric about the real axis

### Procedure:
1. Form the **auxiliary polynomial** from the row ABOVE the zero row
2. Differentiate the auxiliary polynomial with respect to s
3. Replace the zero row with coefficients of the derivative
4. Continue building the array normally

The roots of the auxiliary polynomial include the symmetric pairs.

## 2.3 Using Routh-Hurwitz for Design

Find the range of a parameter K that keeps the system stable:

1. Write the characteristic polynomial in terms of K
2. Build the Routh array (entries will contain K)
3. Set all first-column entries > 0
4. Solve the resulting inequalities for K

### Example: s³ + 3s² + 2s + K = 0

Routh array first column: [1, 3, (6-K)/3, K]

For stability: **$(6-K)/3 > 0$** → K < 6, and **$K > 0$**

**Range: 0 < K < 6**`,
      examTip: 'The FE exam frequently asks "find the range of K for stability." Build the Routh array with K as a variable, then set each first-column entry > 0 and solve the inequalities. The intersection of all conditions gives the valid range.',
    },
    {
      id: 'stab-routh-worked',
      title: '3. Routh-Hurwitz Worked Examples',
      content: `## 3.1 Example 1: Stable System

**Characteristic polynomial**: D(s) = $s^{4}$ + 3s³ + 5s² + 4s + 2

**Step 1 — Check necessary condition**: All coefficients are positive (1, 3, 5, 4, 2). Proceed to Routh array.

**Step 2 — Construct the array:**

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{4}$ | 1 | 5 | 2 |
| $s^{3}$ | 3 | 4 | 0 |
| $s^{2}$ | $(3\\times 5 - 1\\times 4)/3 = 11/3$ | $(3\\times 2 - 1\\times 0)/3 = 2$ | 0 |
| $s^{1}$ | $(11/3 \\times 4 - 3 \\times 2)/(11/3) = (44/3 - 6)/(11/3) = (26/3)/(11/3) = 26/11$ | 0 | 0 |
| $s^{0}$ | **2** | 0 | 0 |

**Step 3 — Read first column**: 1, 3, 11/3, 26/11, 2 → **all positive, zero sign changes**

**Conclusion: System is stable** (all 4 poles in LHP).

## 3.2 Example 2: System with RHP Poles

**Characteristic polynomial**: D(s) = $s^{4}$ + 2s³ + s² + 4s + 2

**Step 1 — All coefficients positive** (1, 2, 1, 4, 2). Must build array.

**Step 2 — Construct the array:**

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{4}$ | 1 | 1 | 2 |
| $s^{3}$ | 2 | 4 | 0 |
| $s^{2}$ | $(2\\times 1 - 1\\times 4)/2 = -1$ | $(2\\times 2 - 1\\times 0)/2 = 2$ | 0 |
| $s^{1}$ | $(-1\\times 4 - 2\\times 2)/(-1) = 8$ | 0 | 0 |
| $s^{0}$ | **2** | 0 | 0 |

**Step 3 — Read first column**: 1, 2, **$-1$**, 8, 2

Sign changes: +2 to −1 (one change), −1 to +8 (second change) = **2 sign changes**

**Conclusion: System is unstable** with exactly **2 poles in the RHP**.

## 3.3 Special Case: Zero in First Column

**Characteristic polynomial**: D(s) = s³ + s² + 2s + 2

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{3}$ | 1 | 2 |
| $s^{2}$ | 1 | 2 |
| $s^{1}$ | $(1\\times 2 - 1\\times 2)/1 = 0$ | 0 |

The s¹ row has a zero in the first column. **Replace 0 with ε (small positive number)**:

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{1}$ | ε | 0 |
| $s^{0}$ | 2 | 0 |

First column: 1, 1, ε, 2. As ε → $0^{+}$, all entries remain positive → **no sign changes**.

But wait — the entire s¹ row was zeros before we used ε, indicating **symmetric roots**. Form the auxiliary polynomial from the s² row:

**$P(s) = s^{2} + 2 = 0$** → s = ±j√2

These are **poles on the imaginary axis** → system is **marginally stable** (sustained oscillations at ω = √2 rad/s).

## 3.4 Summary: Decision Flowchart

1. **Any missing or negative coefficient?** → Unstable (stop here)
2. **All coefficients positive?** → Build Routh array
3. **Count sign changes in first column** = number of RHP poles
4. **Zero sign changes** → Stable
5. **Zero in first column only** → Replace with ε, continue
6. **Entire row of zeros** → Symmetric root pairs; form auxiliary polynomial and differentiate`,
      examTip: 'On the FE exam, always check the necessary condition first — if any coefficient is zero or negative, mark "unstable" and move on without building the array. This saves 2-3 minutes. For 2nd-order, just check all coefficients positive. For 3rd-order, also verify bc > ad.',
      importantNote: 'The Routh array tells you HOW MANY poles are in the RHP, not WHERE they are. If you need pole locations, you must factor the polynomial or use other methods. But for stability determination (stable/unstable), the Routh criterion is the fastest approach on the FE exam.',
    },
  ],
  keyTakeaways: [
    'First column sign changes = number of RHP (unstable) poles; all positive = stable.',
    'Necessary condition: all polynomial coefficients must be positive (same sign).',
    '2nd order: all coefficients positive. 3rd order: all positive AND bc > ad.',
    'Zero in first column: replace with small ε and take limit.',
    'Entire zero row: use auxiliary polynomial derivative to continue.',
    'Design: express Routh entries in terms of K, set all > 0, solve inequalities.',
  ],
},

  fee_root_locus: {
  topicId: 'fee_root_locus',
  title: 'Root Locus: Rules and System Design',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'The root locus is a graphical method that shows how closed-loop pole locations move as a parameter (usually gain K) varies from 0 to infinity. It connects open-loop pole/zero locations to closed-loop behavior and is a powerful design tool.',
  sections: [
    {
      id: 'rl-sketching-rules',
      title: '1. Root Locus Sketching Rules',
      content: `## 1.1 Setup

For a system with open-loop transfer function:

**$G(s)H(s) = K \\cdot N(s)/D(s)$**

where N(s) has m zeros and D(s) has n poles (n ≥ m).

The characteristic equation is: **$1 + K\\cdot N(s)/D(s) = 0$** → **$D(s) + K\\cdot N(s) = 0$**

## 1.2 The Eight Root Locus Rules

| Rule | Description |
|---|---|
| **1. Number of branches** | n branches (one per open-loop pole) |
| **2. Start and end** | Start at **open-loop poles** (K = 0), end at **open-loop zeros** or **infinity** (K → ∞) |
| **3. Real-axis segments** | Locus exists on real axis where the **total count of poles + zeros to the RIGHT is ODD** |
| **4. Symmetry** | Symmetric about the real axis (complex poles come in conjugate pairs) |
| **5. Asymptotes** | n − m branches go to infinity along angles: **θ_a = (2k + 1)·180° / (n − m)**, k = 0, 1, ... |
| **6. Asymptote centroid** | **σ_a = (Σ poles − Σ zeros) / (n − m)** |
| **7. Breakaway/break-in** | Where branches leave/enter real axis: solve **dK/ds = 0** |
| **8. Imaginary axis crossing** | Use Routh-Hurwitz to find K and ω where locus crosses jω axis |

## 1.3 Angle and Magnitude Conditions

A point $s_{0}$ is on the root locus if:

- **Angle condition**: ∠G($s_{0}$)H($s_{0}$) = (2k + 1)·180° (odd multiple of 180°)
- **Magnitude condition**: K = 1/|G($s_{0}$)H($s_{0}$)| (gives the gain at that point)`,
      examTip: 'The real-axis rule (Rule 3) is the fastest way to sketch the rough shape: count poles + zeros to the RIGHT of a test point on the real axis. If the count is odd, the locus passes through that point. This eliminates most of the real axis immediately.',
    },
    {
      id: 'rl-design',
      title: '2. Design Using Root Locus',
      content: `## 2.1 Relating Pole Locations to Performance

For a second-order dominant pair of closed-loop poles at **$s = -\\sigma \\pm j\\omega _d$**:

| Parameter | Formula | Effect |
|---|---|---|
| **Natural frequency** | $\\omega _n = \\sqrt{\\sigma ^{2} + \\omega _d^{2}}$ | Distance from origin |
| **Damping ratio** | $\\zeta = \\sigma /\\omega _n = \\cos (\\theta)$ | Angle from negative real axis |
| **Damped frequency** | $\\omega _d = \\omega _n\\sqrt{1 - \\zeta ^{2}}$ | Imaginary part |

- **Constant ζ lines** are radial lines from origin (angle θ = arccos(ζ))
- **Constant ω_n lines** are circles centered at origin

## 2.2 Selecting Gain K

1. Identify the desired pole location (from ζ and ω_n specs)
2. Verify the point lies on the root locus (angle condition)
3. Compute **$K = 1/|G(s_{0})H(s_{0})|$** (magnitude condition)

## 2.3 Compensator Design

When gain adjustment alone cannot meet specs, add compensators:

| Compensator | Transfer Function | Effect on Root Locus |
|---|---|---|
| **Lead** | $(s + z)/(s + p), p > z$ | Adds a zero closer to origin; pulls locus LEFT (more stable, faster) |
| **Lag** | $(s + z)/(s + p), z > p$ | Adds a pole-zero pair near origin; increases gain without moving dominant poles much |
| **PID** | $K_p + K_i/s + K_d\\cdot s$ | Combines lead and lag effects |

### Lead Compensator Design Steps

1. Place zero at desired location (near the desired closed-loop pole)
2. Place pole further left (typically 3–10× the zero location)
3. Verify the angle condition is satisfied at the desired pole
4. Compute K from the magnitude condition`,
      examTip: 'On the FE exam, if asked to "determine K for a damping ratio of 0.707," draw the ζ = 0.707 line (45 degrees from negative real axis), find where it intersects the root locus, and compute K at that point using the magnitude condition.',
      importantNote: 'The root locus shows closed-loop poles, not open-loop poles. As K increases from 0, poles move from open-loop pole locations toward open-loop zero locations (or infinity). If a branch crosses the jω axis, the system becomes unstable at that gain.',
    },
  ],
  keyTakeaways: [
    'Root locus starts at open-loop poles (K = 0), ends at zeros or infinity (K → ∞).',
    'Real-axis segments: locus exists where total poles + zeros to the right is odd.',
    'Asymptote angles: (2k+1)·180°/(n−m); centroid: σ = (Σpoles − Σzeros)/(n−m).',
    'Damping ratio ζ = cos(θ) where θ is angle from negative real axis.',
    'Gain at any locus point: K = 1/|G(s₀)H(s₀)| (magnitude condition).',
    'Lead compensator pulls locus left (improves stability); lag increases low-frequency gain.',
  ],
},

  fee_bode_nyquist: {
  topicId: 'fee_bode_nyquist',
  title: 'Frequency Response: Bode & Nyquist Plots',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'Frequency response analysis evaluates how a system responds to sinusoidal inputs at different frequencies. Bode plots provide magnitude and phase on logarithmic scales; Nyquist plots map the complex frequency response. Gain margin and phase margin quantify how close the system is to instability.',
  sections: [
    {
      id: 'bode-construction',
      title: '1. Bode Plot Construction',
      content: `## 1.1 Bode Plot Basics

Two semi-log plots:
- **Magnitude**: 20·$\\log _{10}$|G(jω)| (dB) vs. log(ω)
- **Phase**: ∠G(jω) (degrees) vs. log(ω)

## 1.2 Building Blocks — Straight-Line Approximations

| Factor | Magnitude Contribution | Phase Contribution |
|---|---|---|
| **Constant K** | 20·log₁₀(K) dB (flat line) | $0^\\circ (if K > 0) or -180^\\circ (if K < 0)$ |
| **s (zero at origin)** | +20 dB/decade through 0 dB at ω = 1 | +90° at all frequencies |
| **1/s (pole at origin)** | −20 dB/decade through 0 dB at ω = 1 | −90° at all frequencies |
| **1 + s/a (real zero)** | 0 for ω < a; +20 dB/decade for ω > a | $0^\\circ \\to +45^\\circ at \\omega = a \\to +90^\\circ$ |
| **1/(1 + s/a) (real pole)** | 0 for ω < a; −20 dB/decade for ω > a | $0^\\circ \\to -45^\\circ at \\omega = a \\to -90^\\circ$ |
| **Quadratic pair** (ζ, ω_n) | 0 for ω < ω_n; −40 dB/decade for ω > ω_n | $0^\\circ \\to -90^\\circ at \\omega = \\omega _n \\to -180^\\circ$ |

**Corner frequency** = pole or zero location on the real axis.

## 1.3 Composite Bode Plot

To plot G(s) = K·(s + $z_{1}$)/[(s)(s + $p_{1}$)(s + $p_{2}$)]:

1. Factor out constants; compute 20·$\\log _{10}$(K·$z_{1}$/($p_{1}$·$p_{2}$)) for the DC gain
2. Add contributions of each pole and zero at each frequency decade
3. Phase: sum individual phase contributions at each frequency

### Magnitude in dB

**|G(jω)|_dB = 20·$\\log _{10}$(K) + Σ(zero contributions) − Σ(pole contributions)**`,
      examTip: 'Each real pole contributes −20 dB/decade and −90° of phase; each real zero contributes +20 dB/decade and +90°. An integrator (1/s) contributes −20 dB/decade starting from ω = 0 with a constant −90° phase. These building blocks let you sketch any Bode plot quickly.',
    },
    {
      id: 'bode-margins-nyquist',
      title: '2. Stability Margins and Nyquist Criterion',
      content: `## 2.1 Gain Margin and Phase Margin

| Margin | Definition | Measured At |
|---|---|---|
| **Gain Margin (GM)** | How much gain can increase before instability | **Phase-crossover frequency** ω_pc (where ∠G = −180°) |
| **Phase Margin (PM)** | How much additional phase lag before instability | **Gain-crossover frequency** ω_gc (where |G| $= 0\\ \\mathrm{dB})$ |

**$GM = -20\\cdot \\log _{10}|G(j\\omega _{pc})|$** (in dB)

**$PM = 180^\\circ + \\angle G(j\\omega _{gc})$**

### Stability Requirement

**Stable system: GM > 0 dB AND PM > 0°**

| PM | System Behavior |
|---|---|
| $> 60^\\circ$ | Well-damped, sluggish |
| $40-60^\\circ$ | Good compromise |
| $20-40^\\circ$ | Responsive but oscillatory |
| $< 0^\\circ$ | **Unstable** |

Approximate relationship: **$PM \\approx 100\\cdot \\zeta$** (for ζ < 0.7, in degrees)

## 2.2 Nyquist Criterion

Plot G(jω) in the complex plane as ω goes from 0 to ∞ (and its mirror for −∞ to 0).

**Nyquist stability criterion**:

**$Z = N + P$**

where:
- **Z** = number of closed-loop RHP poles (unstable)
- **N** = number of **clockwise** encirclements of the point **(-1, 0)**
- **P** = number of open-loop RHP poles

For a stable closed-loop system: **$Z = 0$** → **$N = -P$**

If the open-loop system is stable (P = 0), the Nyquist plot must **not encircle (-1, 0)** at all.

## 2.3 Relating Bode to Nyquist

- GM is the distance from the Nyquist plot to (-1, 0) along the negative real axis
- PM is the angle from the negative real axis to the point where |G| = 1 on the Nyquist plot
- Both plots contain the same information; Bode is easier to sketch, Nyquist handles delays and non-minimum-phase systems better`,
      examTip: 'PM ≈ 100·ζ is a quick approximation that links frequency-domain and time-domain specs. If the exam asks for a phase margin of 45°, the damping ratio is approximately 0.45 and the overshoot is about 20%. This shortcut saves significant time.',
      importantNote: 'Gain margin and phase margin must BOTH be positive for stability. A system can have positive GM but negative PM (or vice versa) and still be unstable. Always check both margins.',
    },
    {
      id: 'bode-step-by-step',
      title: '3. Drawing Bode Plots Step-by-Step',
      content: `## 3.1 Problem Statement

**Given**: G(s) = 100 / [s(s + 10)]

Draw the magnitude and phase Bode plots. Find the gain margin (GM) and phase margin (PM). Determine closed-loop stability.

## 3.2 Step 1 — Rewrite in Standard Bode Form

Factor out constants so each term has the form (1 + s/a):

$$G(s) = 100 / [s \\cdot 10 \\cdot (1 + s/10)] = 10 / [s \\cdot (1 + s/10)]$$

**Components to plot:**
- Constant gain: K = 10 → 20·$\\log _{10}$(10) = **20 dB**
- Integrator: 1/s → **−20 dB/decade**, passes through 0 dB at ω = 1
- Real pole: 1/(1 + s/10) → corner at **$\\omega = 10\\ \\mathrm{rad/s}$**, then −20 dB/decade

## 3.3 Step 2 — Magnitude Plot

**Low frequencies (ω << 10):**

|G(jω)| ≈ 10/ω → slope = −20 dB/decade (integrator dominates)

$$At \\omega = 1: |G| = 10/1 = 10 \\to 20\\ \\mathrm{dB}$$
At ω = 10: |G| = 10/10 = 1 → **0 dB** (before the pole kicks in)

**High frequencies (ω >> 10):**

|G(jω)| ≈ 10/(ω · ω/10) = 100/ω² → slope = **−40 dB/decade**

| Frequency (rad/s) | Magnitude (dB) | Slope |
|---|---|---|
| 0.1 | 40 dB | −20 dB/dec |
| 1 | 20 dB | −20 dB/dec |
| 10 | 0 dB | Transition to −40 dB/dec |
| 100 | $-20\\ \\mathrm{dB}$ | −40 dB/dec |

## 3.4 Step 3 — Phase Plot

- Integrator 1/s: constant **$-90^\\circ$** at all frequencies
- Pole at ω = 10: contributes 0° for ω << 10, −45° at ω = 10, −90° for ω >> 10

**Total phase:**

| Frequency | Integrator | Pole at 10 | Total Phase |
|---|---|---|---|
| $\\omega = 1$ | $-90^\\circ$ | $\\approx -6^\\circ$ | **$-96^\\circ$** |
| $\\omega = 10$ | $-90^\\circ$ | $-45^\\circ$ | **$-135^\\circ$** |
| $\\omega = 100$ | $-90^\\circ$ | $\\approx -84^\\circ$ | **$-174^\\circ$** |
| ω → ∞ | $-90^\\circ$ | $-90^\\circ$ | **$-180^\\circ$** |

## 3.5 Step 4 — Find GM and PM

**Gain crossover frequency ω_gc** (where |G| = 0 dB):

From the magnitude plot: |G(jω_gc)| = 1 → 10/[ω_gc · √(1 + ω_gc²/100)] = 1

At ω = 10: |G| = 10/(10 · √2) = 0.707 → −3 dB (close to 0 dB)

Solving exactly: ω_gc ≈ **9.05 rad/s**

**Phase margin**: PM = 180° + ∠G(jω_gc) = 180° + (−90° − arctan(9.05/10)) = 180° − 90° − 42.1° = **$47.9^\\circ$**

**Phase crossover frequency ω_pc** (where ∠G = −180°):

Total phase reaches −180° as ω → ∞ (asymptotically). Strictly, ω_pc = **∞**.

**Gain margin**: GM = −20·$\\log _{10}$|G(j∞)| = **$\\infty dB$** (magnitude is zero at infinite frequency)

## 3.6 Step 5 — Stability Conclusion

- **$PM = 47.9^\\circ > 0^\\circ$** → Stable
- **$GM = \\infty dB > 0\\ \\mathrm{dB}$** → Stable
- The system is **closed-loop stable** with good phase margin (near the 45–60° design target)
- Expected damping ratio: ζ ≈ PM/100 ≈ 0.48 → moderate overshoot (~18%)`,
      examTip: 'On the FE exam, for systems with an integrator (1/s), the low-frequency slope starts at −20 dB/decade. Each additional pole adds another −20 dB/decade at its corner frequency. The magnitude at ω = 1 equals 20·log₁₀(K), which gives you the starting point for the entire plot.',
      importantNote: 'A type-1 system (one integrator) like G(s) = K/[s(s+a)] has phase approaching −180° but never exceeding it. This means GM = infinity. Such systems are always stable for any positive gain K. However, a type-2 system (two integrators) starts at −180° and WILL go unstable at some gain.',
    },
  ],
  keyTakeaways: [
    'Bode magnitude in dB = 20·log₁₀|G(jω)|; each pole adds −20 dB/decade, each zero adds +20 dB/decade.',
    'Gain margin: GM = −|G(jω_pc)| dB at phase crossover (∠G = −180°).',
    'Phase margin: PM = 180° + ∠G(jω_gc) at gain crossover (|G| = 0 dB).',
    'Stability requires GM > 0 dB AND PM > 0°; typical design target PM = 45–60°.',
    'Nyquist: Z = N + P; for stable open-loop (P = 0), no encirclement of (−1, 0).',
    'Approximate: PM ≈ 100·ζ degrees (for ζ < 0.7).',
  ],
},

  fee_pid: {
  topicId: 'fee_pid',
  title: 'PID Controllers and Tuning',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'The PID controller is the most widely used feedback controller in industry, combining proportional, integral, and derivative actions to balance responsiveness, accuracy, and stability. The FE exam tests PID transfer functions, the effect of each term, and basic tuning methods.',
  sections: [
    {
      id: 'pid-actions',
      title: '1. PID Controller Actions',
      content: `## 1.1 The PID Control Law

**Time domain**: **$u(t) = K_p\\cdot e(t) + K_i\\cdot \\int e(\\tau)d\\tau + K_d\\cdot de(t)/dt$**

**Laplace domain**: **$C(s) = K_p + K_i/s + K_d\\cdot s$**

where e(t) = r(t) − y(t) is the error signal (setpoint minus output).

## 1.2 Effect of Each Term

| Action | Transfer Function | Effect on Response | Drawback |
|---|---|---|---|
| **Proportional (P)** | K_p | Reduces error proportionally; faster response | Steady-state error remains (for Type 0 systems) |
| **Integral (I)** | K_i/s | **Eliminates steady-state error** (adds integrator → increases system type) | Adds phase lag; can cause oscillation/instability |
| **Derivative (D)** | $K_d\\cdot s$ | **Reduces overshoot** and oscillation; adds phase lead | Amplifies high-frequency noise; never used alone |

### How Each Term Affects the Response

- **Increasing K_p**: faster rise time, more overshoot, smaller steady-state error
- **Increasing K_i**: eliminates steady-state error, increases overshoot, can cause instability
- **Increasing K_d**: reduces overshoot, improves stability, but noise-sensitive

## 1.3 Common PID Variants

| Controller | Terms | When to Use |
|---|---|---|
| **P** only | K_p | Simple, fast; acceptable steady-state error |
| **PI** | K_p + K_i/s | Most common; zero steady-state error needed |
| **PD** | $K_p + K_d\\cdot s$ | Need stability improvement; error acceptable |
| **PID** | $K_p + K_i/s + K_d\\cdot s$ | Full control; zero error + good transient |

### Anti-Windup

When the actuator saturates, the integral term continues accumulating error ("windup"). Anti-windup resets or clamps the integrator when output hits limits.`,
      examTip: 'The integral term K_i/s adds a pole at the origin, increasing the system type by one. This is WHY integral action eliminates steady-state error for step inputs — it makes the system at least Type 1. This is the most important conceptual point about PID on the FE exam.',
    },
    {
      id: 'pid-tuning',
      title: '2. PID Tuning Methods',
      content: `## 2.1 Ziegler-Nichols Step Response Method

Apply a step input to the open-loop plant and measure:
- **K** = process gain (steady-state output change / input change)
- **θ** = apparent dead time (delay before response begins)
- **τ** = time constant (time to reach 63% of final value)

| Controller | K_p | $T_i = K_p/K_i$ | $T_d = K_d/K_p$ |
|---|---|---|---|
| **P** | $\\tau /(K\\cdot \\theta)$ | — | — |
| **PI** | $0.9\\cdot \\tau /(K\\cdot \\theta)$ | $3.3\\cdot \\theta$ | — |
| **PID** | $1.2\\cdot \\tau /(K\\cdot \\theta)$ | $2\\cdot \\theta$ | $0.5\\cdot \\theta$ |

## 2.2 Ziegler-Nichols Ultimate Gain Method

1. Set K_i = 0 and K_d = 0 (P-only)
2. Increase K_p until the system oscillates continuously → **K_u** (ultimate gain)
3. Measure the oscillation period → **P_u** (ultimate period)

| Controller | K_p | T_i | T_d |
|---|---|---|---|
| **P** | $0.5\\cdot K_u$ | — | — |
| **PI** | $0.45\\cdot K_u$ | P_u/1.2 | — |
| **PID** | $0.6\\cdot K_u$ | P_u/2 | P_u/8 |

## 2.3 Practical Tuning Guidelines

1. **Start with P only**: increase K_p until response is fast but oscillatory
2. **Add I**: set T_i large (slow integration), decrease until steady-state error vanishes
3. **Add D**: increase K_d to reduce overshoot; stop before noise amplification becomes a problem

### Frequency-Domain Approach

Design the PID so the open-loop Bode plot has:
- **Gain crossover** at the desired bandwidth
- **Phase margin** of 45–60° for good damping`,
      examTip: 'Ziegler-Nichols tuning tends to produce aggressive controllers with about 25% overshoot. The FE exam may ask you to apply the ultimate gain method: find K_u (gain at sustained oscillation), measure P_u (oscillation period), then use the table to compute K_p, T_i, T_d.',
      importantNote: 'The derivative term amplifies noise because it differentiates the error signal. In practice, a low-pass filter is always added to the D term: K_d·s/(1 + s/N) where N is typically 10–20. Pure derivative (K_d·s) is never used in real implementations.',
    },
    {
      id: 'pid-tuning-worked',
      title: '3. PID Tuning Worked Example',
      content: `## 3.1 Problem Statement

**Given plant**: G(s) = 1 / [s(s + 2)]

Design a PID controller using the **Ziegler-Nichols ultimate gain method**. Find the ultimate gain K_u and ultimate period P_u. Calculate K_p, K_i, K_d. Verify closed-loop stability.

## 3.2 Step 1 — Find the Ultimate Gain K_u

With P-only control, the closed-loop characteristic equation is:

**$1 + K_p \\cdot G(s) = 0$** → s(s + 2) + K_p = 0 → **$s^{2} + 2s + K_p = 0$**

Use **Routh-Hurwitz** to find K_p that causes sustained oscillation:

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{2}$ | 1 | K_p |
| $s^{1}$ | 2 | 0 |
| $s^{0}$ | K_p | 0 |

For stability: all first-column entries > 0 → K_p > 0 AND 2 > 0. The system is stable for **all K_p > 0**.

**Problem**: This 2nd-order system never oscillates — it cannot reach the −180° phase crossover with P-only control because it is only type 1 (total phase approaches −180° but never reaches it).

**Resolution**: For Ziegler-Nichols ultimate gain method, we need a system that CAN oscillate. Let us add a realistic delay or use a higher-order plant. For this problem, we use the **frequency response approach** instead.

## 3.3 Alternative: Frequency Response PID Design

Since the pure plant G(s) = 1/[s(s+2)] has infinite gain margin, we design for a **target phase margin of 50°** and **bandwidth of 5 rad/s**.

**Step 1 — Evaluate the plant at ω = 5 rad/s:**

$$G(j5) = 1/[j5 \\cdot (j5 + 2)] = 1/[j5 \\cdot (2 + j5)] = 1/(-25 + j10)$$

|G(j5)| = 1/√(625 + 100) = 1/√725 = **0.0371** (−28.6 dB)

$$\\angle G(j5) = -90^\\circ - \\arctan (5/2) = -90^\\circ - 68.2^\\circ = -158.2^\\circ$$

**Step 2 — Required controller phase at ω = 5:**

For PM = 50°: total phase = −180° + 50° = −130°

Controller must add: −130° − (−158.2°) = **+28.2° of phase lead**

**Step 3 — Design PID parameters:**

Using the PID transfer function: C(s) = K_p(1 + 1/(T_i·s) + T_d·s)

Choose **$T_d = 0.15\\ \\mathrm{s}$** (provides phase lead near ω = 5):
- Phase from D term at ω = 5: arctan(T_d·ω) = arctan(0.75) = +36.9°

Choose **$T_i = 2\\ \\mathrm{s}$** (integral time, slow enough not to destabilize):
- Phase from I term at ω = 5: −arctan(1/(T_i·ω)) = −arctan(0.1) = −5.7°

Net controller phase: +36.9° − 5.7° = **$+31.2^\\circ$** (close to target of +28.2°, with margin)

**Step 4 — Set K_p for 0 dB gain crossover at ω = 5:**

|C(j5)| · |G(j5)| = 1

|C(j5)| = |K_p| · |1 + 1/(j10) + j0.75| = K_p · |1.75 + j0.65| = K_p · 1.867

$$K_p = 1/(1.867 \\times 0.0371) = 14.4$$

## 3.4 Final PID Parameters

| Parameter | Value | Derived Values |
|---|---|---|
| **K_p** | 14.4 | Proportional gain |
| **T_i** | 2.0 s | $K_i = K_p/T_i = 7.2$ |
| **T_d** | 0.15 s | $K_d = K_p\\cdot T_d = 2.16$ |

**Controller**: C(s) = 14.4 + 7.2/s + 2.16s

## 3.5 Verification — Closed-Loop Stability

Open-loop transfer function: L(s) = C(s)·G(s) = (14.4 + 7.2/s + 2.16s) · 1/[s(s+2)]

At ω = 5 rad/s: |L(j5)| ≈ 1 (0 dB) and ∠L(j5) ≈ −130° → **$PM \\approx 50^\\circ$**

The closed-loop system is stable with good damping (ζ ≈ 0.5, ~16% overshoot).

## 3.6 Ziegler-Nichols Quick Reference (For Higher-Order Plants)

When the ultimate gain method IS applicable (3rd order or higher):

1. Increase K_p until sustained oscillation → **K_u** (ultimate gain)
2. Measure oscillation period → **P_u**
3. Apply the table:

| Controller | K_p | $K_i = K_p/T_i$ | $K_d = K_p\\cdot T_d$ |
|---|---|---|---|
| **P** | $0.5\\cdot K_u$ | — | — |
| **PI** | $0.45\\cdot K_u$ | $0.45\\cdot K_u/(P_u/1.2)$ | — |
| **PID** | $0.6\\cdot K_u$ | $0.6\\cdot K_u/(P_u/2) = 1.2\\cdot K_u/P_u$ | $0.6\\cdot K_u\\cdot P_u/8 = 0.075\\cdot K_u\\cdot P_u$ |`,
      examTip: 'If the FE exam gives a 2nd-order plant with no delay, the Ziegler-Nichols ultimate gain method may not apply directly (the system may be stable for all gains). In that case, use the frequency response approach or recognize that the exam expects you to apply the table formulas with given K_u and P_u values.',
      importantNote: 'Ziegler-Nichols tuning is a starting point, not a final design. It typically produces about 25% overshoot. For tighter specifications, reduce K_p by 20-30% from the Z-N value and increase T_i. The FE exam usually tests the Z-N table lookup, not iterative refinement.',
    },
  ],
  keyTakeaways: [
    'PID: u(t) = K_p·e + K_i·∫e dt + K_d·de/dt; in Laplace: C(s) = K_p + K_i/s + K_d·s.',
    'P: reduces error proportionally. I: eliminates steady-state error (adds integrator). D: reduces overshoot (adds phase lead).',
    'PI is the most common industrial controller; D is added only when overshoot is unacceptable.',
    'Ziegler-Nichols: ultimate gain K_u and period P_u → K_p = 0.6K_u, T_i = P_u/2, T_d = P_u/8 for PID.',
    'Anti-windup prevents integral term from accumulating during actuator saturation.',
  ],
},

  fee_time_specs: {
  topicId: 'fee_time_specs',
  title: 'Time-Domain Specifications',
  domainWeight: 'Control Systems · 4–6%',
  overview: 'Time-domain specifications quantify transient and steady-state performance of control systems. Overshoot, settling time, rise time, and steady-state error are directly linked to damping ratio, natural frequency, and system type. These relationships are heavily tested on the FE exam.',
  sections: [
    {
      id: 'ts-transient-specs',
      title: '1. Transient Response Specifications',
      content: `## 1.1 Second-Order System Standard Form

**$G(s) = \\omega _n^{2} / (s^{2} + 2\\zeta \\omega _n\\cdot s + \\omega _n^{2})$**

where:
- **$\\omega _n$** = natural frequency (rad/s) — controls speed of response
- **ζ** = damping ratio (dimensionless) — controls oscillation
- **$\\omega _d = \\omega _n\\cdot \\sqrt{1 - \\zeta ^{2}}$** = damped natural frequency

### System Classification by ζ

| ζ Value | Response Type | Poles |
|---|---|---|
| $\\zeta = 0$ | Undamped (sustained oscillation) | Purely imaginary: ±jω_n |
| $0 < \\zeta < 1$ | **Underdamped** (oscillatory) | Complex conjugate: −ζω_n ± jω_d |
| $\\zeta = 1$ | Critically damped (fastest non-oscillatory) | Repeated real: −ω_n |
| $\\zeta > 1$ | Overdamped (sluggish) | Two distinct real negatives |

## 1.2 Key Transient Specifications (Underdamped, 0 < ζ < 1)

| Specification | Formula | Description |
|---|---|---|
| **Percent Overshoot** | **$OS\\% = e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}} \\times 100\\%$** | Max peak above final value |
| **Peak Time** | **$t_p = \\pi /\\omega _d$** | Time to first peak |
| **Rise Time (0→100%)** | **$t_r \\approx (\\pi - \\arccos (\\zeta))/\\omega _d$** | Time from 0% to 100% of final value |
| **Settling Time (2%)** | **$t_s \\approx 4/(\\zeta \\cdot \\omega _n)$** | Time to stay within 2% band |
| **Settling Time (5%)** | **$t_s \\approx 3/(\\zeta \\cdot \\omega _n)$** | Time to stay within 5% band |

## 1.3 Common ζ Values Worth Memorizing

| ζ | OS% | Character |
|---|---|---|
| 0.1 | 73% | Very oscillatory |
| 0.3 | 37% | Oscillatory |
| 0.5 | 16% | Moderate |
| **0.707** | **4.3%** | **Optimal (Butterworth)** |
| 1.0 | 0% | Critically damped |`,
      examTip: 'OS% = e^(−πζ/√(1−ζ²)) × 100% and t_s ≈ 4/(ζω_n) are the two most commonly tested formulas. Memorize that ζ ≈ 0.7 gives about 5% overshoot — this is the "standard good design" value that appears repeatedly on the FE exam.',
      importantNote: 'Settling time t_s = 4/(ζω_n) uses the 2% criterion. Some problems use 5% criterion, which gives t_s = 3/(ζω_n). Always check which criterion the problem specifies. If not stated, assume 2%.',
    },
    {
      id: 'ts-steady-state-error',
      title: '2. Steady-State Error and System Type',
      content: `## 2.1 System Type

The **type number** equals the number of **free integrators** (poles at s = 0) in the open-loop transfer function G(s)H(s).

| System Type | Integrators | Step Error | Ramp Error | Parabolic Error |
|---|---|---|---|---|
| **Type 0** | 0 | 1/(1+K_p) | ∞ | ∞ |
| **Type 1** | 1 | **0** | 1/K_v | ∞ |
| **Type 2** | 2 | **0** | **0** | 1/K_a |

## 2.2 Error Constants

For unity-feedback system with open-loop G(s):

| Constant | Formula | Used For |
|---|---|---|
| **Position constant K_p** | $\\lim (s\\to 0) G(s)$ | Step input error |
| **Velocity constant K_v** | $\\lim (s\\to 0) s\\cdot G(s)$ | Ramp input error |
| **Acceleration constant K_a** | $\\lim (s\\to 0) s^{2}\\cdot G(s)$ | Parabolic input error |

### Steady-State Error Formula

**$e_{ss} = \\lim (s\\to 0) s \\cdot R(s) / (1 + G(s))$**

For standard inputs:
- **Step** (R(s) = 1/s): **$e_{ss} = 1/(1 + K_p)$**
- **Ramp** (R(s) = 1/s²): **$e_{ss} = 1/K_v$**
- **Parabola** (R(s) = 1/s³): **$e_{ss} = 1/K_a$**

## 2.3 Design Implications

- To **reduce** steady-state error: increase gain K or add integrators
- Adding an integrator (increasing system type) eliminates one class of error but can worsen stability
- **Final Value Theorem**: lim(t→∞) y(t) = lim(s→0) s·Y(s) — only valid if system is stable

### Quick Checks

- Type 0 with gain K: step error = 1/(1+K). Doubling K halves the error but never eliminates it.
- Type 1 system: zero step error, but ramp error = 1/K_v. Increase K_v to reduce ramp error.
- Each added integrator gives zero error to one more input class but adds −90° phase (stability risk).`,
      examTip: 'The FE exam will often state "unity-feedback system with G(s) = K/(s(s+2))" and ask for the steady-state error to a unit step. This is Type 1 (one integrator in G(s)), so step error = 0 immediately — no calculation needed. For a ramp: K_v = lim(s→0) s·G(s) = K/2, so e_ss = 2/K.',
      importantNote: 'The Final Value Theorem only works if the system is STABLE (all closed-loop poles in the LHP). If any pole is in the RHP or on the jω axis, the steady-state value does not exist and the theorem gives a wrong answer. Always verify stability first.',
    },
  ],
  keyTakeaways: [
    'Overshoot: OS% = e^(−πζ/√(1−ζ²)) × 100%; ζ ≈ 0.7 gives ~5% OS.',
    'Settling time (2%): t_s ≈ 4/(ζω_n); peak time: t_p = π/ω_d.',
    'System type = number of open-loop integrators; determines which errors are zero.',
    'Type 0: step error = 1/(1+K_p). Type 1: step error = 0, ramp error = 1/K_v.',
    'Error constants: K_p = lim G(s), K_v = lim s·G(s), K_a = lim s²·G(s) as s→0.',
    'Final Value Theorem: lim(t→∞) y(t) = lim(s→0) s·Y(s) — only valid for stable systems.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 13 — COMMUNICATIONS  (5 curriculum IDs)  ·  4–6 %
   * ══════════════════════════════════════════════════════════════════ */

fee_pzmap_analysis: {
  topicId: 'fee_pzmap_analysis',
  title: `Pole-Zero Maps & Dynamic Response`,
  domainWeight: 'Control Systems · 4–6%',
  overview: `Pole-zero plots in the complex s-plane are the most compact representation of a linear system. Their locations directly determine the time-domain response — stability, damping, oscillation frequency, decay rate. The FE exam tests both directions: given pole locations, predict response; given a desired response, place poles appropriately. This topic covers pole-zero plot interpretation, the relationship between pole locations and time response, and the special role of complex pole pairs.`,
  sections: [
    {
      id: 'pole-locations-meaning',
      title: `1. Pole Locations and Time-Domain Response`,
      content: `## 1.1 The s-plane

Poles and zeros of H(s) are plotted in the complex s-plane:

- Real axis: Re(s) = σ (decay/growth rate)
- Imaginary axis: Im(s) = jω (oscillation frequency)
- Left-half plane (LHP): Re(s) < 0 → DECAYING components → STABLE
- Right-half plane (RHP): Re(s) > 0 → GROWING components → UNSTABLE
- Imaginary axis: Re(s) = 0 → MARGINAL — pure oscillation (or constant for s=0)

Poles are typically plotted as ×, zeros as ○.

## 1.2 A real pole at s = -a

For a single real pole at s = -a (a > 0):

  $$H(s) = K / (s + a)$$
  h(t) = K · e^(-at)   (impulse response)

The time constant is τ = 1/a. The response decays to ~37% in τ seconds, ~5% in 3τ, ~1% in 5τ.

If a < 0 (pole in RHP), the exponential GROWS → unstable.
If a = 0, h(t) = K (constant) — marginal, integrator response.

## 1.3 A complex pole pair at s = -σ ± jω_d

Complex poles always come in CONJUGATE PAIRS (because H(s) has real coefficients). For a pair at s = -σ ± jω_d:

  Response component: e^(-σt) · cos(ω_d·t + φ)

This is a DAMPED SINUSOID:
- σ controls the decay envelope (faster decay if σ is larger positive)
- ω_d controls the oscillation frequency
- Sign of σ: positive = decaying (stable), negative = growing (unstable), zero = pure oscillation (marginal)

## 1.4 Standard second-order parameters

A second-order pole pair is often described by:

- **Natural frequency** ωₙ = distance from origin to pole = √(σ² + ω_d²)
- **Damping ratio** ζ = σ / ωₙ = cos(angle from negative real axis to pole)

The damped frequency ω_d = ωₙ · √(1 - ζ²).

| ζ | Behavior |
|---|---|
| $\\zeta > 1$ | Overdamped — two real poles, slow but no oscillation |
| $\\zeta = 1$ | Critically damped — repeated real pole, fastest non-oscillatory |
| $0 < \\zeta < 1$ | Underdamped — complex poles, oscillation present |
| $\\zeta = 0$ | Undamped — purely imaginary poles, pure oscillation forever |
| $\\zeta < 0$ | Negative damping — RHP poles, growing oscillation |

## 1.5 Pole locations and step response characteristics

For an underdamped second-order system with poles at -σ ± jω_d (ωₙ = √(σ² + ω_d²), ζ = σ/ωₙ):

- **Rise time**: t_r ≈ (1.8) / ωₙ — time to first reach 100% of steady state
- **Peak time**: t_p = π / ω_d — time of first peak
- **Settling time** (5% criterion): t_s ≈ 3 / σ = 3 / (ζ·ωₙ)
- **Percent overshoot**: %OS = e^(-πζ/√(1-ζ²)) · 100

These are exam-tested formulas. The "Standard" rules:
- ζ = 0.7 → ~5% overshoot
- ζ = 0.5 → ~16% overshoot
- ζ = 0.3 → ~37% overshoot
- ζ = 0.1 → ~73% overshoot

## 1.6 Where poles MUST BE for desired response

Conversely, given a desired specification, you can place poles:

- Need fast settling? Move σ farther into the LHP (away from imaginary axis)
- Need less overshoot? Increase ζ (poles closer to real axis, away from imaginary axis along the negative real)
- Need higher frequency oscillation? Move ω_d farther from real axis
- Need higher ωₙ? Push poles farther from origin

Constant-ζ lines are RADIAL LINES from origin. Constant-ωₙ lines are CIRCLES centered at origin.

## 1.7 Multiple poles and dominance

For systems with multiple poles, the response is the sum of contributions from each pole. However:

- The pole closest to the imaginary axis has the SLOWEST decay → DOMINANT
- Poles much farther into the LHP contribute fast-decaying components that are quickly negligible
- Dominant pole approximation: if one pole or pole pair is much closer to the imaginary axis than others, the system behaves like a first or second-order system characterized by those dominant poles

A rule of thumb: if a pole is at least 5× farther into LHP than the dominant pole, it can be ignored for transient response analysis.`,
      examTip: `LHP poles = stable (decaying). RHP poles = unstable. Imaginary axis poles = marginal. Complex pairs = oscillation; damping ratio ζ = cos(angle from negative real axis).`,
    },
    {
      id: 'zero-effects',
      title: `2. Zero Locations and Their Effects`,
      content: `## 2.1 Where zeros sit

Zeros also live in the s-plane. They don't determine stability (only poles do), but they SHAPE the response.

Real zeros: × LHP = "normal" zero. RHP zero = "non-minimum phase" zero.

## 2.2 Effect of zeros on step response

A zero close to a pole tends to CANCEL its dynamic contribution. A zero far from a pole has minimal effect.

In general:

- LHP zero close to the origin: increases system speed (more transient overshoot, faster rise)
- RHP zero (non-minimum phase): causes initial UNDERSHOOT — the response initially moves in the OPPOSITE direction before correcting and reaching steady state
- Zeros far from poles: minimal effect on transient response, but affect frequency response

## 2.3 The non-minimum phase phenomenon

A common exam pattern. A transfer function:

  H(s) = (1 - s/z) / (something with stable poles)   where z > 0

has a RHP zero at s = +z. The step response will INITIALLY MOVE IN THE WRONG DIRECTION before correcting. Classic example: a boost converter — when you increase duty cycle, output voltage briefly dips before rising.

Non-minimum phase systems are HARDER TO CONTROL because of this initial wrong-direction response.

## 2.4 Pole-zero cancellation

If a zero and pole are at the SAME location, they exactly cancel in the transfer function:

  H(s) = K · (s - a) / (s - a) · (other stuff) = K · (other stuff)

In theory. In practice, parameter uncertainty makes exact cancellation impossible. A pole and zero CLOSE TOGETHER mostly cancel, with the residual effect being small.

This is sometimes used in control design — a controller adds a zero to cancel a slow plant pole, speeding up the response.

## 2.5 Closed-loop pole locations via root locus

When you put a controller K·G(s) in a feedback loop with plant H(s), the closed-loop transfer function is:

  $$T(s) = K\\cdot G(s)\\cdot H(s) / (1 + K\\cdot G(s)\\cdot H(s))$$

The closed-loop POLES are the roots of the characteristic equation 1 + K·G(s)·H(s) = 0. As K varies, the pole locations TRACE OUT the ROOT LOCUS.

Root locus rules (review):
- Branches start at open-loop poles, end at open-loop zeros (or infinity)
- N branches go to infinity along asymptotes if there are more poles than zeros
- Symmetric about real axis (poles come in conjugate pairs)
- Number of asymptotes = poles - zeros
- Real-axis segments: a segment is on root locus if odd number of real poles+zeros lie to its right

Root locus IS a graphical pole-placement tool — by choosing K, you slide poles along the locus to desired locations.

## 2.6 Exam example

"A system has poles at -2 ± j3 and a zero at -10. What is the time response to a unit step?"

Analysis:
- Complex pole pair at -2 ± j3: ωₙ = √(4+9) = √13 ≈ 3.6 rad/s, ζ = 2/3.6 ≈ 0.55
- Zero at -10: far from the poles, so MINIMAL effect on transient (just slight speed-up)
- Response: underdamped sinusoid with ζ ≈ 0.55:
  - Damped frequency ω_d = ωₙ·√(1-ζ²) = 3.6·0.835 ≈ 3 rad/s
  - Rise time ≈ 1.8/3.6 = 0.5 s
  - Settling time ≈ 3/2 = 1.5 s
  - Overshoot ≈ exp(-π·0.55/√(1-0.55²)) · 100% ≈ 13%

The response oscillates at ~3 rad/s, decays in ~1.5 seconds, with ~13% overshoot, and the zero at -10 has negligible effect.

## 2.7 Real-axis pole/zero combinations

For purely real pole/zero combinations:

- One LHP real pole: 1st-order exponential decay
- Two LHP real poles: overdamped second-order; sum of two exponentials
- LHP real pole + LHP real zero: like 1st-order but the zero can speed up the transient
- LHP pole + RHP zero: non-minimum phase initial inverse response

## 2.8 Common transfer function shapes

| Configuration | Behavior |
|---|---|
| One LHP real pole | Pure exponential decay |
| Two LHP real poles, distinct | Overdamped — slow exponential sum |
| LHP repeated real pole | Critically damped — fastest no-overshoot |
| LHP complex pair | Underdamped oscillation |
| LHP poles + LHP zero | Response shaped by zero placement |
| LHP poles + RHP zero | Non-minimum phase — initial inverse response |
| RHP poles | Unstable — growing response |
| Poles on jω axis | Marginal — pure oscillation, doesn't decay |`,
      examTip: `Zeros don't affect stability (poles do), but they shape the transient response. RHP zeros cause initial inverse response (non-minimum phase). LHP zeros close to poles can mostly cancel dynamic contribution.`,
    },
    {
      id: 'state-space-and-stability',
      title: `3. State-Space, Eigenvalues, and Stability Tests`,
      content: `## 3.1 State-space representation

An alternative to transfer functions, using vector-matrix form:

  $$\\dot{x} = Ax + Bu$$
  $$y = Cx + Du$$

Where x is the state vector, u is input, y is output. The system POLES are the EIGENVALUES of A — the roots of det(sI - A) = 0.

Stability via state-space: all eigenvalues of A in LHP → stable.

## 3.2 Controllability and Observability

Two important properties for state-space systems:

- **Controllable**: every state can be driven by the input. Controllability matrix [B AB A²B ... A^(n-1)B] has full rank.
- **Observable**: every state can be inferred from the output. Observability matrix [C; CA; CA²; ...; CA^(n-1)] has full rank.

A system needs to be BOTH controllable AND observable for full pole-placement control.

Recognition-level for FE exam; deeper coverage on PE.

## 3.3 Routh-Hurwitz stability test

A simple algebraic test for whether all roots of a polynomial are in the LHP, without actually computing the roots.

Given a characteristic polynomial: a_n·s^n + a_(n-1)·s^(n-1) + ... + a_1·s + a_0

Necessary conditions:
1. All coefficients must have the SAME SIGN
2. No coefficient can be missing (i.e., all powers 0 through n must be present, unless their coefficient is zero — which means automatically unstable unless special analysis)

If both conditions hold, build the Routh table:

\`\`\`
s^n     | a_n    a_(n-2)  a_(n-4)  ...
s^(n-1) | a_(n-1) a_(n-3)  a_(n-5)  ...
s^(n-2) | b_1    b_2      b_3      ...
...
s^0     | (final coefficient)
\`\`\`

Where: b_1 = (a_(n-1)·a_(n-2) - a_n·a_(n-3)) / a_(n-1)
       $$b_2 = (a_(n-1)\\cdot a_(n-4) - a_n\\cdot a_(n-5)) / a_(n-1)$$
... and similarly for subsequent rows.

The system is stable if and only if all entries in the FIRST COLUMN have the SAME SIGN.

The NUMBER of sign changes in the first column equals the NUMBER OF ROOTS in the RHP.

## 3.4 Worked Routh example

Characteristic polynomial: s³ + 2s² + 3s + 4

\`\`\`
s³ | 1   3
s² | 2   4
s¹ | (2·3 - 1·4)/2 = 2/2 = 1
s⁰ | (1·4 - 2·0)/1 = 4
\`\`\`

First column: 1, 2, 1, 4 — all positive. STABLE. No RHP roots.

Another: s³ + s² + s + 6

\`\`\`
s³ | 1    1
s² | 1    6
s¹ | (1·1 - 1·6)/1 = -5
s⁰ | (-5·6 - 1·0)/-5 = 6
\`\`\`

First column: 1, 1, -5, 6 — two sign changes (+ → - and - → +). Two RHP roots. UNSTABLE.

## 3.5 Special cases in Routh

- **Zero in first column with nonzero row**: replace with small ε, continue, then take limit as ε → 0
- **All-zero row**: indicates symmetric roots (e.g., pure imaginary pair). Use the auxiliary equation from the row above to find them.

## 3.6 The state-transition matrix

For autonomous system ẋ = Ax with initial state x(0), the solution is:

  $$x(t) = e^{At} \\cdot x(0)$$

Where e^(At) is the matrix exponential, computable as:
- e^(At) = L⁻¹{(sI - A)⁻¹}   (inverse Laplace of resolvent matrix)
- Or via eigenvalue decomposition: e^(At) = P · e^(Λt) · P⁻¹

For exam purposes: recognize that eigenvalues of A determine the response modes; their LHP/RHP location determines stability.

## 3.7 Exam decision tree

Given a problem:

1. Stability question with characteristic polynomial → Routh-Hurwitz
2. Stability question with transfer function → factor denominator, check pole locations
3. Stability question with state-space A matrix → find eigenvalues (computed or stated), check LHP/RHP
4. Time response from pole locations → use ωₙ, ζ formulas for underdamped; sum of exponentials for real poles
5. Pole placement from desired response → use formulas to find required pole locations`,
      examTip: `Routh-Hurwitz: ALL FIRST-COLUMN entries same sign = stable. Number of SIGN CHANGES in first column = number of RHP roots. Negative coefficient anywhere in original polynomial = automatically unstable.`,
    },
  ],
  keyTakeaways: [
    'LHP poles = stable (decaying response). RHP poles = unstable (growing). Imaginary axis = marginal.',
    'Complex pole pair at -σ ± jω_d: response is e^(-σt)·cos(ω_d·t + φ). σ controls decay; ω_d controls oscillation.',
    'Damping ratio ζ = cos(angle from negative real axis to pole). ζ = 0.7 → ~5% overshoot. ζ = 1 → critically damped.',
    'Settling time t_s ≈ 3/σ = 3/(ζωₙ). Rise time t_r ≈ 1.8/ωₙ. Peak time t_p = π/ω_d.',
    'Zeros don\'t affect stability but shape transient. RHP zero = non-minimum phase = initial inverse response.',
    'Dominant pole approximation: pole closest to imaginary axis dominates response if others are 5×+ farther away',
    'Routh-Hurwitz: all first-column entries same sign = stable. Number of sign changes = number of RHP roots. Coefficient missing or negative = automatic instability.',
  ],
},

};
