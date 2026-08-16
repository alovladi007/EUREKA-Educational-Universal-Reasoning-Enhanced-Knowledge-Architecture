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
    {
      id: 'bd-two-loop-worked',
      title: '3. A Two-Loop Diagram Reduced End to End',
      content: `## 3.1 The Diagram to Be Reduced

Almost every reduction problem on the exam is the same picture with different
letters, so it pays to work one all the way to a number and keep it as a
template. Take this arrangement:

- the reference **r** enters an outer summing junction;
- the error drives **$G_{1}(s) = 10/(s+1)$**, an amplifier with a lag;
- its output enters a second summing junction feeding **$G_{2}(s) = 2/s$**, an integrating actuator;
- a **minor loop** of gain **$H_{2} = 0.5$** (a tachometer, say) feeds the actuator output back to that second junction;
- the plant output **y** returns to the outer junction through unity feedback.

Two nested negative loops, three blocks, one number wanted: the closed-loop
transfer function and what it predicts.

## 3.2 Work From the Inside Out

The only ordering rule that matters is that **a loop must be closed before
anything is cascaded past it**. Nothing outside the minor loop can be combined
with anything inside it until that loop has been collapsed into one block.

**Step 1 — collapse the minor loop.** It is a plain negative-feedback pair, so
apply the same formula from Section 1:

$$G_{eq}(s) = G_{2}/(1 + G_{2}H_{2}) = (2/s)/(1 + (2/s)(0.5)) = (2/s)/((s+1)/s)$$

$$G_{eq}(s) = 2/(s+1)$$

Look at what that did. The actuator alone had a pole at the origin — a pure
integrator, which never stops moving. Wrapping 0.5 of velocity feedback around
it **moved that pole from s = 0 to s = −1**. This is the single most useful
intuition in the whole topic: feedback does not merely scale a block, it
relocates its poles.

**Step 2 — cascade.** Now that the minor loop is one block, the forward path
is a simple product:

$$L(s) = G_{1}(s)\\cdot G_{eq}(s) = [10/(s+1)]\\cdot [2/(s+1)] = 20/(s+1)^{2}$$

**Step 3 — close the outer loop** with H = 1:

$$T(s) = L/(1 + L) = [20/(s+1)^{2}] / [1 + 20/(s+1)^{2}] = 20/[(s+1)^{2} + 20]$$

$$T(s) = 20/(s^{2} + 2s + 21)$$

| Step | Operation | Result |
|---|---|---|
| 1 | Minor loop, $G_{2}/(1 + G_{2}H_{2})$ | $2/(s+1)$ — the integrator's pole moves to −1 |
| 2 | Series product with $G_{1}$ | $L(s) = 20/(s+1)^{2}$ |
| 3 | Outer unity feedback, $L/(1+L)$ | $T(s) = 20/(s^{2}+2s+21)$ |
| 4 | Match to standard second-order form | $\\omega _n = \\sqrt{21}$, $\\zeta = 1/\\sqrt{21}$ |

## 3.3 Reading the Answer

The denominator is already in the standard form $s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2}$,
so every time-domain number falls out without further work:

| Quantity | From the denominator | Value |
|---|---|---|
| Natural frequency | $\\omega _n = \\sqrt{21}$ | 4.583 rad/s |
| Damping ratio | $2\\zeta \\omega _n = 2 \\Rightarrow \\zeta = 1/\\sqrt{21}$ | 0.2182 |
| Damped frequency | $\\omega _d = \\omega _n\\sqrt{1-\\zeta ^{2}} = \\sqrt{20}$ | 4.472 rad/s |
| Percent overshoot | $e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}}$ | 49.54% |
| Peak time | $t_p = \\pi /\\omega _d$ | 0.7025 s |
| Settling time (2%) | $t_s = 4/(\\zeta \\omega _n) = 4/1$ | 4.0 s |
| DC gain | $T(0) = 20/21$ | 0.9524 |
| Step error | $1 - T(0) = 1/21$ | 4.76% |

Two of those entries deserve a second look because they are the ones exam
writers build distractors around.

**The settling time does not depend on the gain.** Since $\\zeta \\omega _n$ is
just half the coefficient of s, and that coefficient is fixed at 2 by the two
first-order lags, $\\zeta \\omega _n = 1$ no matter how large the loop gain
grows. Raising the gain buys a faster oscillation and a worse overshoot, and
buys exactly nothing in settling time. A candidate who reasons "more gain,
faster response" walks straight into the wrong answer.

**The steady-state error matches the error-constant prediction exactly.** The
open-loop gain has no pole at the origin — the minor loop consumed it — so this
is a Type 0 loop with position constant $K_p = L(0) = 20$, and the step error
must be $1/(1+K_p) = 1/21 = 4.76\\%$. It is worth noticing what happened here:
the minor loop improved the transient behaviour and simultaneously **destroyed
the zero steady-state error** the bare integrator would have delivered. Every
loop you add is a trade, not a free improvement.

## 3.4 The Mistake Almost Everyone Makes Once

The tempting shortcut is to multiply the two forward blocks first —
$10/(s+1) \\times 2/s = 20/[s(s+1)]$ — and then apply the feedback formula
twice. That gives $T = 20/(s^{2}+s+20)$, which is wrong, and wrong in a way
that looks plausible: it is still second order, still stable, still has a
sensible-looking DC gain of 1. The error is that $H_{2}$ feeds back from a
point **inside** the cascade, so the product $G_{1}G_{2}$ crosses a signal path
that has not been closed yet.

If you genuinely need to move that pickoff point — say, to redraw it as a loop
around the whole forward path — the move is legal only with compensation: a
pickoff taken **after** a block G, when moved to **before** that block, must
carry a factor of G in the relocated branch. Move the $H_{2}$ pickoff from the
$G_{2}$ output back to the $G_{2}$ input and the feedback branch becomes
$H_{2}G_{2}$, not $H_{2}$. Applied here, that reproduces the same $T(s)$ as the
inside-out method, which is the check that the move was done correctly.

## 3.5 How the Exam Asks This

Three shapes account for nearly every question built on a diagram like this:

1. **"Find the closed-loop transfer function."** Reduce inside out; the answer
   is a ratio of polynomials, and the distractors differ by a sign in the
   denominator or by having cascaded across an open loop.
2. **"What is the damping ratio (or overshoot, or steady-state error)?"**
   Reduce, then match the denominator to $s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2}$
   and read off. Do not attempt to compute poles numerically — the match is
   faster and less error-prone.
3. **"What does the minor loop accomplish?"** The expected answer is that it
   repositions the actuator pole and adds damping, at the cost of raising the
   steady-state error and lowering the overall gain.`,
      examTip: 'Reduce strictly from the innermost loop outward, and never cascade a block across a summing junction whose loop is still open. Once the denominator is in the form s² + 2ζω_n·s + ω_n², every transient number on the exam is a one-line read: ω_n is the square root of the constant term, and ζ is the s-coefficient divided by 2ω_n.',
      importantNote: 'A minor (inner) loop around an integrator moves that pole off the origin. That improves damping but reduces the system type by one, so a loop that previously had zero steady-state error to a step will now have error 1/(1 + K_p). Check the system type AFTER the reduction, never before it.',
    },
    {
      id: 'bd-loop-benefits-quantified',
      title: '4. What the Loop Buys, Measured in Numbers',
      content: `## 4.1 Sensitivity Is a Transfer Function, Not an Adjective

Section 2 listed the benefits of feedback as a table of adjectives. This
section attaches numbers to them, using the same loop that was reduced in
Section 3: $L(s) = 20/(s+1)^{2}$, closed to $T(s) = 20/(s^{2}+2s+21)$.

Define the **sensitivity function**

$$S(s) = 1/(1 + L(s))$$

and the **complementary sensitivity** $T(s) = L(s)/(1 + L(s))$. The two are
tied together by an identity that no design can escape:

$$S(s) + T(s) = 1$$

S is the fraction of a plant error or output disturbance that survives to the
output; T is the fraction of the reference that gets tracked. Because they sum
to one at every frequency, you cannot make both small at the same frequency —
you can only choose where each one is small.

At DC this loop gives $S(0) = 1/(1 + 20) = 1/21 = 0.0476$. Read that number
three ways and you have three of the classic textbook benefits:

## 4.2 Benefit One: Plant Errors Get Divided

Suppose the amplifier gain is 10% low — components drift, temperature moves,
a replacement part is not quite identical. Without feedback the output is 10%
low. With the loop closed, the DC gain moves from 20/21 to 18/19, a change of
only **0.53%**. Push the error to 30% and the closed-loop DC output changes by
**2.0%** while the open-loop output changes by the full 30%.

| Plant gain error | Open-loop output error | Closed-loop output error | Ratio |
|---|---|---|---|
| −10% | −10% | −0.53% | ≈ 19× smaller |
| −30% | −30% | −2.0% | 15× smaller |

The reduction factor is $S(0) = 1/21$ for small changes, and drifts a little
above that for large ones because S itself depends on the gain. That is the
whole content of the "reduces sensitivity" row of the Section 2 table, made
countable.

![Step responses of the same plant under gain errors of zero, ten and thirty percent, drawn twice: once with the loop open and once with it closed, each normalised to its nominal final value. Open loop, the three curves separate by exactly the gain error. Closed loop they land on top of one another, because 1 + L(0) = 21 divides the error down to two percent.](/courses/fe-ee/figures/ctrl-feedback-sensitivity.svg)

The figure is worth a slow look, because the two panels are drawn on the same
normalised axis precisely so the comparison is honest. In the upper panel the
30% curve settles at 0.70 — the error passes through untouched. In the lower
panel all three curves are visually indistinguishable at steady state. What
the loop did **not** do is make the plant better; the plant is exactly as
wrong as before. The loop simply arranged for the error to be divided by
1 + L before it reaches the output.

## 4.3 Benefit Two: Disturbances Get Attenuated

A disturbance d injected at the plant output reaches the output through S(s)
as well: $Y = T\\cdot R + S\\cdot D$. At DC that is a factor of 1/21, or

$$-20\\cdot \\log _{10}(1/21) = 26.4\\ \\mathrm{dB}$$

of attenuation. A 1 V load-induced offset shows up as 48 mV. Note the
frequency dependence hidden in that statement: S is small only where the loop
gain is large. As $\\omega$ rises past the crossover, L falls below 1, S climbs
towards 1, and disturbance rejection quietly disappears. Feedback rejects
**slow** disturbances well and fast ones not at all.

## 4.4 Benefit Three: Bandwidth Extends

The forward lag $G_{1}$ alone has its corner at 1 rad/s. The closed loop's
−3 dB point is at **6.88 rad/s**, close to seven times faster. This is not
magic either: closing the loop moved the poles from a repeated pair at −1 out
to $-1 \\pm j\\sqrt{20}$, and the distance from the origin — which is
$\\omega _n$ — grew from 1 to 4.58.

## 4.5 The Bill

Nothing above came free, and the exam likes the price tags at least as much as
the benefits.

| What you gain | What it costs |
|---|---|
| Errors and disturbances divided by 1 + L | Overall gain divided by 1 + L (20 → 0.952) |
| Wider bandwidth | Larger $\\omega _n$ means larger actuator effort and more noise let through |
| Response shaped by design rather than by the plant | Extra hardware: sensor, comparator, controller |
| Poles relocatable | Poles can be relocated **into the right half plane** if the gain is pushed too far |

That last row is the reason the next three topics exist. For this specific
loop the relationship is unusually clean: closing unity feedback around
$L_{0}/(s+1)^{2}$ gives $\\zeta = 1/\\sqrt{1 + L_{0}}$ exactly. So

- $L_{0} = 20$: ζ = 0.218, overshoot 49.5%
- $L_{0} = 40$: ζ = 0.156, overshoot 60.9%

Every doubling of loop gain buys tighter regulation and pays for it in
oscillation. This particular loop never actually goes unstable — a two-pole
loop cannot — but a third pole anywhere in the path changes that, which is
precisely the situation the Routh-Hurwitz topic takes up next.`,
      examTip: 'When a question asks how much a plant variation, offset, or disturbance is reduced by closing the loop, the answer is almost always the sensitivity factor 1/(1 + L) evaluated at DC — that is, 1/(1 + K_p) for a Type 0 loop. Compute the loop gain at s = 0 first; everything else is one division.',
      importantNote: 'S(s) + T(s) = 1 at every frequency. Good disturbance rejection (small S) and good tracking (T near 1) are the same requirement, and both need large loop gain — which is why every design argument in control eventually becomes an argument about how much loop gain stability will allow.',
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
    {
      id: 'stab-design-windows',
      title: '4. Gain Windows, Conditional Stability, and Relative Stability',
      content: `## 4.1 A Two-Sided Window

Section 2 found a one-sided answer, 0 < K < 6. Fourth-order loops are where
the method earns its keep, because the arithmetic is no worse and the answer
is no longer obvious by inspection. Take the unity-feedback loop

$$G(s)H(s) = K/[s(s+1)(s+2)(s+3)]$$

Multiply out the denominator and add the numerator to form the characteristic
polynomial:

$$D(s) = s^{4} + 6s^{3} + 11s^{2} + 6s + K$$

All five coefficients are positive provided K > 0, so the necessary condition
gives no answer on its own. Build the array.

| Row | Column 1 | Column 2 | Column 3 |
|---|---|---|---|
| $s^{4}$ | 1 | 11 | K |
| $s^{3}$ | 6 | 6 | 0 |
| $s^{2}$ | $(6\\cdot 11 - 1\\cdot 6)/6 = 10$ | $(6\\cdot K - 1\\cdot 0)/6 = K$ | 0 |
| $s^{1}$ | $(10\\cdot 6 - 6\\cdot K)/10 = (60 - 6K)/10$ | 0 | 0 |
| $s^{0}$ | K | 0 | 0 |

Now impose positivity on the first column. The 1, the 6 and the 10 are
unconditional. The remaining two entries give

$$(60 - 6K)/10 > 0 \\Rightarrow K < 10, \\qquad K > 0$$

so the stable window is **0 < K < 10**. At K = 4, for instance, the $s^{1}$
entry is $(60-24)/10 = 3.6 > 0$ and the loop is comfortably stable.

**What happens at the edge.** Set K = 10 and the entire $s^{1}$ row vanishes.
That is the all-zeros case from Section 2, and it is not a nuisance here — it
is the answer to the question "at what frequency does it oscillate?" Form the
auxiliary polynomial from the row above:

$$P(s) = 10s^{2} + 10 = 0 \\Rightarrow s = \\pm j1$$

so at the critical gain the loop sustains an oscillation at **1 rad/s**.
Factoring the quartic at K = 10 confirms it: the roots are $\\pm j1$ together
with a pair whose real parts sum to −6, both safely in the left half plane.

## 4.2 Conditional Stability: When Turning the Gain Down Is Wrong

Every intuition built on the previous example says that low gain is safe. That
intuition fails whenever the plant itself is unstable. Consider

$$G(s)H(s) = K(s+1)/[s(s-1)(s+6)]$$

which has an open-loop pole at **s = +1** — a runaway plant that feedback is
being asked to catch. The characteristic polynomial is

$$D(s) = s(s-1)(s+6) + K(s+1) = s^{3} + 5s^{2} + (K-6)s + K$$

Notice immediately that the necessary condition already bites: the
s-coefficient is K − 6, so **K must exceed 6 before the coefficients are even
all positive**. Build the array to find the real limit.

| Row | Column 1 | Column 2 |
|---|---|---|
| $s^{3}$ | 1 | K − 6 |
| $s^{2}$ | 5 | K |
| $s^{1}$ | $[5(K-6) - K]/5 = (4K - 30)/5$ | 0 |
| $s^{0}$ | K | 0 |

The binding condition is $(4K - 30)/5 > 0$, that is **K > 7.5**, which is
stricter than the coefficient test. At K = 8 the $s^{1}$ entry is
$(32-30)/5 = 0.4$, barely positive, and the loop is stable. At K = 7 it is
negative and the loop is not.

| K | First-column entries | Verdict |
|---|---|---|
| 6 | 1, 5, −1.2, 6 | Two sign changes → two RHP poles |
| 7 | 1, 5, −0.4, 7 | Still unstable |
| 7.5 | 1, 5, **0**, 7.5 | Marginal: oscillates at $\\sqrt{1.5} = 1.225$ rad/s |
| 8 | 1, 5, 0.4, 8 | Stable |
| 40 | 1, 5, 26, 40 | Stable, comfortably |

At the boundary the auxiliary polynomial is $5s^{2} + 7.5 = 0$, giving
$s = \\pm j\\sqrt{1.5} = \\pm j1.225$, and the third root sits at −5.

This is a **conditionally stable** loop, and it is the single most common
conceptual trap in the topic. The operator who sees ringing and reaches for the
gain knob turns it down — and destabilises the system. The Routh window here is
open at the top and closed at the bottom: $7.5 < K < \\infty$.

![The largest real part among the closed-loop poles, swept against loop gain, for two systems. The quartic loop starts stable and crosses into the right half plane at K equal to ten. The conditionally stable loop does the opposite: it begins unstable and only crosses into the left half plane above K equal to seven and a half. A Routh gain window is exactly a sign change in one of these curves.](/courses/fe-ee/figures/ctrl-k-stability-window.svg)

The figure makes visible what the array computes. Everything the Routh test
tells you is contained in where these curves cross zero — and nothing else
about them is Routh's business. The curves' height above or below the axis (how
fast the unstable mode grows, how quickly the stable one decays) requires
actually finding the roots. Routh answers "which side", never "how far".

## 4.3 Relative Stability: Testing a Margin, Not Just a Sign

A design rarely wants poles merely in the left half plane; it wants them
**well inside** it, so that transients decay at some guaranteed rate. The Routh
test can answer that too, with one substitution.

To ask "are all poles to the left of $s = -\\sigma$?", substitute
$s = z - \\sigma$ and run the ordinary test on the polynomial in z. Roots of
the shifted polynomial in the left half of the z-plane correspond to roots left
of $-\\sigma$ in the s-plane.

**Worked example.** Take $D(s) = s^{3} + 7s^{2} + 14s + 8$, and ask whether
every pole decays at least as fast as $e^{-0.5t}$. Substituting $s = z - 0.5$:

$$D(z - 0.5) = z^{3} + 5.5z^{2} + 7.75z + 2.625$$

All coefficients are positive, and for a cubic the extra condition is
$bc > ad$: here $5.5 \\times 7.75 = 42.625$, comfortably greater than
$1 \\times 2.625$. So yes — every pole lies left of −0.5, and the slowest mode
has a time constant no worse than 2 s.

Push the test to $\\sigma = 1$ and it fails in an instructive way. Substituting
$s = z - 1$ gives $z^{3} + 4z^{2} + 3z + 0$: the constant term collapses to
zero, which flags a root exactly on the shifted axis. Indeed the original
polynomial factors as $(s+1)(s+2)(s+4)$, and the pole at −1 sits precisely on
the $\\sigma = 1$ boundary. The vanishing constant term is the test correctly
detecting a marginal case.

## 4.4 How the Exam Asks This

| Question shape | What to do | Time it should take |
|---|---|---|
| "Is this polynomial stable?" | Coefficient check first; build the array only if it survives | Under a minute |
| "For what range of K is the loop stable?" | Array with K symbolic; set every first-column entry > 0; intersect | Two to three minutes |
| "At what frequency will it oscillate?" | Set the critical K, form the auxiliary polynomial from the row above the zero row, solve | One minute |
| "How many poles are unstable?" | Count first-column sign changes | Under a minute |
| "Do all poles lie left of −σ?" | Substitute s = z − σ, then run the ordinary test | Three minutes |

One habit is worth building deliberately: **write the characteristic
polynomial before anything else**. It is $1 + G(s)H(s) = 0$ cleared of
fractions — that is, the denominator of GH plus its numerator. Most lost marks
on this topic are not Routh arithmetic at all; they are the wrong polynomial,
usually the open-loop denominator used on its own.`,
      examTip: 'Two shortcuts carry most of the exam load. For a cubic as³ + bs² + cs + d, the whole array collapses to "all four coefficients positive AND bc > ad". And whenever a first-column entry hits zero at some gain, that gain is the marginal one — form the auxiliary polynomial from the row directly above and solve it for the oscillation frequency.',
      importantNote: 'A stable gain window is not always of the form 0 < K < K_max. If the plant has a right-half-plane pole, the loop may need a MINIMUM gain to be stable, so reducing gain destabilises it. Always solve the inequalities as written rather than assuming the lower bound is zero.',
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
    {
      id: 'rl-worked-sketch',
      title: '3. Sketching a Locus by the Rules: A Complete Worked Case',
      content: `## 3.1 The Plant

The eight rules in Section 1 are easier to trust once they have been driven
through a single problem to numerical answers. Take the unity-feedback loop

$$G(s)H(s) = K/[s(s+2)(s+4)]$$

Three open-loop poles at s = 0, −2 and −4; no finite zeros. The
characteristic equation is

$$1 + K/[s(s+2)(s+4)] = 0 \\Rightarrow s^{3} + 6s^{2} + 8s + K = 0$$

Everything below is a property of that cubic, and every landmark can be
checked by solving it at the relevant gain.

## 3.2 Rules 1 Through 6: The Skeleton

**Branches.** n = 3 poles, m = 0 zeros, so there are **three branches**, all of
which run off to infinity (there are no finite zeros to terminate on).

**Real-axis segments.** Test points by counting poles and zeros strictly to
the right. Between 0 and −2 the count is 1 (odd) → **on the locus**. Between
−2 and −4 the count is 2 (even) → not on the locus. Left of −4 the count is 3
(odd) → **on the locus**. So the real-axis portion is the segment [−2, 0]
together with the ray (−∞, −4].

**Asymptotes.** With n − m = 3, the angles are

$$\\theta _a = (2k+1)180^\\circ /3 = 60^\\circ,\\ 180^\\circ,\\ 300^\\circ$$

and the centroid is

$$\\sigma _a = (\\Sigma \\mathrm{poles} - \\Sigma \\mathrm{zeros})/(n-m) = (0 - 2 - 4)/3 = -2$$

so two branches leave at ±60° from the point −2 on the real axis, and the
third runs left along the axis.

## 3.3 Rule 7: The Breakaway Point, Derived

Two branches start at 0 and −2 and travel towards each other along the real
axis; where they meet they must leave the axis. That meeting point is where
K, viewed as a function of s along the axis, reaches a maximum.

Solve the characteristic equation for K:

$$K = -(s^{3} + 6s^{2} + 8s)$$

Differentiate and set to zero:

$$dK/ds = -(3s^{2} + 12s + 8) = 0 \\Rightarrow 3s^{2} + 12s + 8 = 0$$

$$s = -2 \\pm 2/\\sqrt{3} = -0.8453 \\text{ or } -3.1547$$

Only −0.8453 lies on a real-axis segment of the locus, so it is the physical
breakaway; the other root is an artefact of the algebra. Back-substituting
gives the gain at breakaway:

$$K_{break} = -[(-0.8453)^{3} + 6(-0.8453)^{2} + 8(-0.8453)] = 3.079$$

Below that gain the loop has three real poles and cannot overshoot; above it,
two of them are complex and the step response rings. At exactly K = 3.079 the
cubic has a **repeated root** at −0.8453, with the third at −4.309 — which is
the definition of a breakaway point and the easiest way to check the work.

## 3.4 Rule 8: Where the Locus Crosses Into Instability

For the crossing, hand the cubic to the Routh array with K symbolic:

| Row | Column 1 | Column 2 |
|---|---|---|
| $s^{3}$ | 1 | 8 |
| $s^{2}$ | 6 | K |
| $s^{1}$ | $(48 - K)/6$ | 0 |
| $s^{0}$ | K | 0 |

The $s^{1}$ entry vanishes at **K = 48**, and the auxiliary polynomial from the
row above is $6s^{2} + 48 = 0$, so the crossing is at

$$s = \\pm j\\sqrt{8} = \\pm j2.828$$

Solving the cubic at K = 48 confirms both the imaginary pair and the third
root, which sits at exactly −6. Every gain above 48 puts two poles in the
right half plane.

## 3.5 Putting a Design Point on the Locus

Now the design question the exam actually asks: **what gain gives a damping
ratio of 0.5?** The ζ = 0.5 ray leaves the origin at
$\\theta = \\arccos(0.5) = 60^\\circ$ from the negative real axis. Its
intersection with the locus is the design point.

Working the algebra (or reading the intersection off a careful sketch and
refining) gives

$$K = 224/27 = 8.296$$

$$s_{1,2} = -0.6667 \\pm j1.1547, \\qquad s_{3} = -4.667$$

Check the pair: $\\omega _n = |s_{1}| = \\sqrt{0.6667^{2} + 1.1547^{2}} = 1.333$
and $\\zeta = 0.6667/1.333 = 0.5$ exactly, as required.

| Landmark | Value | How it was found |
|---|---|---|
| Branches | 3, all to infinity | n = 3, m = 0 |
| Real-axis locus | [−2, 0] and (−∞, −4] | Odd count to the right |
| Asymptote angles | 60°, 180°, 300° | $(2k+1)180^\\circ /3$ |
| Centroid | −2 | $(0-2-4)/3$ |
| Breakaway | s = −0.845 at K = 3.079 | Root of $3s^{2}+12s+8$ |
| jω crossing | $s = \\pm j2.828$ at K = 48 | Routh, auxiliary $6s^{2}+48$ |
| ζ = 0.5 design point | $-0.667 \\pm j1.155$ at K = 8.296 | Intersection with the 60° ray |
| Stable range | 0 < K < 48 | Routh window |

![Root locus of the loop K over s times s plus two times s plus four, drawn by solving the characteristic cubic at many gains. Marked on it are the breakaway point at minus zero point eight four five, the imaginary-axis crossing at two point eight three radians per second where the gain reaches forty-eight, the asymptotes at plus and minus sixty and one hundred eighty degrees from the centroid at minus two, and the damping ratio of one half ray with the dominant pair it selects.](/courses/fe-ee/figures/ctrl-root-locus-cubic.svg)

Notice how the picture pays back the algebra. The three branches leave their
poles, two of them collide on the real axis at the breakaway and turn into the
complex plane, and thereafter they track the asymptotes outwards and upwards
until they cross the imaginary axis. Every single hand-computed landmark is a
point you can put a finger on.

## 3.6 Does the Dominant Pair Actually Predict the Response?

At K = 8.296 the design point has ζ = 0.5, so the two-pole formula predicts
**16.30% overshoot**. But the loop is third order — there is a pole at −4.667
that the formula ignores. Simulating the true closed-loop step response gives
**15.54%**.

The approximation is off by only 0.77 percentage points, and the reason is
visible in the numbers: the neglected pole sits **7 times farther** from the
imaginary axis than the dominant pair (4.667 versus 0.667). The usual rule of
thumb asks for a factor of 5, and this design clears it comfortably. Had the
third pole been at, say, −1.5, the dominant-pair estimate would have been
badly optimistic.

That is the honest statement of what root-locus design gives you: a fast,
reliable way to place a dominant pair, plus an obligation to check that the
poles you ignored really are negligible.`,
      examTip: 'Sketch in this order every time: mark the poles and zeros, shade the real-axis segments (odd count to the right), draw the asymptotes from the centroid, then locate the breakaway from dK/ds = 0 and the jω crossing from Routh. The two computed landmarks are what exam questions ask for; the rest is orientation.',
      importantNote: 'The breakaway equation dK/ds = 0 generally has more roots than there are breakaway points. Keep only the roots that lie on a real-axis segment that is actually part of the locus, and discard the rest — they satisfy the algebra but not the angle condition.',
    },
    {
      id: 'rl-compensation-worked',
      title: '4. Reshaping the Locus: Lead and Lag Compensation',
      content: `## 4.1 When Gain Alone Cannot Reach the Target

Consider a simpler plant, $G(s) = K/[s(s+2)]$, and a specification calling for
$\\zeta = 0.5$ with $\\omega _n = 4$ rad/s — that is, closed-loop poles at

$$s_d = -2 \\pm j2\\sqrt{3} = -2 \\pm j3.464$$

The uncompensated locus for this plant is the real segment [−2, 0] plus the
**vertical line Re(s) = −1**, because for two poles the complex branches leave
the axis at the midpoint and travel straight up and down. The target point has
a real part of −2, so no value of K will ever place a pole there. Gain moves
poles **along** the locus; it cannot move the locus.

The fix is to change the locus itself by adding a pole and a zero — a
**lead compensator**, $C(s) = K(s+z)/(s+p)$ with p > z.

## 4.2 The Angle Deficiency Calculation

A point lies on the locus if and only if the open-loop phase there is an odd
multiple of 180°. Evaluate the plant's contribution at $s_d$:

- Angle from the pole at the origin: $\\angle s_d = \\arctan[3.464/(-2)] = 120^\\circ$
- Angle from the pole at −2: $\\angle (s_d + 2) = \\angle (j3.464) = 90^\\circ$

The total plant angle is $-(120^\\circ + 90^\\circ) = -210^\\circ$, and the
requirement is −180°. The compensator must therefore supply

$$\\phi _{deficiency} = 180^\\circ - 210^\\circ = -30^\\circ \\Rightarrow +30^\\circ \\text{ of lead}$$

A lead network supplies positive phase, so the specification is reachable.

## 4.3 Design A: Cancel the Plant Pole

The tidiest choice puts the compensator zero directly on the plant pole,
z = 2. Then the zero contributes +90° at $s_d$, and the angle condition
becomes

$$90^\\circ - \\angle (s_d + p) - 120^\\circ - 90^\\circ = -180^\\circ \\Rightarrow \\angle (s_d + p) = 60^\\circ$$

Geometry gives the pole location directly:

$$\\tan 60^\\circ = 3.464/(p - 2) \\Rightarrow p - 2 = 3.464/1.732 = 2 \\Rightarrow p = 4$$

So $C(s) = K(s+2)/(s+4)$. The gain comes from the magnitude condition,
$K = 1/|G(s_d)H(s_d)|$ with the compensator included:

$$K = |s_d|\\cdot |s_d + 4| = 4 \\times 4 = 16$$

The compensated loop is $16/[s(s+4)]$ and the closed-loop denominator is
$s^{2} + 4s + 16$: poles at exactly $-2 \\pm j3.464$, $\\omega _n = 4$,
$\\zeta = 0.5$. Simulation gives **16.30% overshoot**, matching the two-pole
formula precisely because the loop really is second order now.

## 4.4 Design B: The Same Specification Without Cancellation

Exact cancellation is a fiction — the real plant pole is never exactly at −2 —
so it is worth seeing that the design is not unique. Put the zero at z = 1
instead and solve for the pole.

- Angle from the zero at −1: $\\angle (s_d + 1) = \\arctan[3.464/(-1)] = 106.1^\\circ$
- Required pole angle: $106.1^\\circ - 120^\\circ - 90^\\circ + 180^\\circ = 76.1^\\circ$
- Pole location: $p = 3.464/\\tan(76.1^\\circ) + 2 = 20/7 = 2.857$
- Gain from the magnitude condition: $K = 96/7 = 13.71$

The dominant pair lands at $-2 \\pm j3.464$ again — verified by factoring the
resulting cubic — but now there is a **third closed-loop pole at −6/7 =
−0.857**, closer to the imaginary axis than the pair itself.

That sounds fatal, and it would be were it not for the compensator zero at −1
sitting almost on top of it. A closely spaced pole-zero pair contributes a
mode with a very small residue, so its effect is slight. The simulated
overshoot is **5.80%** — not the 16.3% the dominant pair predicts, and not the
disaster a bare pole at −0.857 would cause either.

| Design | Compensator | Gain | Closed-loop poles | Simulated overshoot |
|---|---|---|---|---|
| A (cancelling) | $(s+2)/(s+4)$ | 16 | $-2 \\pm j3.464$ | 16.30% |
| B (non-cancelling) | $(s+1)/(s+2.857)$ | 13.71 | $-2 \\pm j3.464$, −0.857 | 5.80% |

The lesson is worth more than either number: **placing the dominant pair is
necessary but not sufficient**. Two designs that satisfy the same
pole-placement specification exactly can produce visibly different responses,
because what the specification did not constrain — the leftover pole, the
compensator zero — still shows up in the output.

## 4.5 Lag Compensation: Buying Accuracy, Not Speed

Lead compensation reshapes the transient. **Lag compensation** does something
different: it raises the low-frequency gain, and therefore the error
constants, while deliberately not disturbing the poles that were just placed.

Take the compensated design A loop, $L(s) = 16/[s(s+4)]$. It is Type 1, so its
velocity constant is

$$K_v = \\lim_{s\\to 0} s\\cdot L(s) = 16/4 = 4 \\Rightarrow e_{ss}(\\mathrm{ramp}) = 1/K_v = 0.25$$

To cut that error tenfold, add

$$C_{lag}(s) = (s + 0.1)/(s + 0.01)$$

The zero-to-pole ratio is 10, so $K_v$ becomes 40 and the ramp error drops to
**0.025**. The price is paid in phase: at the design point $s_d$ the lag
network contributes only

$$\\angle (s_d + 0.1) - \\angle (s_d + 0.01) = -1.13^\\circ$$

which is nearly nothing, because both singularities are far from $s_d$ and
almost on top of each other as seen from there. Re-solving the closed loop
confirms the dominant pair barely moves — to $-1.954 \\pm j3.438$, with
$\\zeta$ slipping from 0.500 to 0.494 — and adds a slow pole at −0.102 that the
lag zero at −0.1 all but cancels.

| Property | Lead | Lag |
|---|---|---|
| Placement | Zero near the desired poles, pole further left | Both singularities very close to the origin |
| Phase at the design point | Adds (typically +30° to +60°) | Removes a little (a degree or two) |
| Effect on the locus | Pulls branches left: faster, better damped | Essentially unchanged near the design point |
| Effect on error constants | Modest increase | Multiplies by z/p — the whole point |
| Cost | More bandwidth, more noise amplification | A slow tail in the response from the near-cancelled pair |

## 4.6 How the Exam Asks This

Questions rarely ask for a complete compensator design under exam time
pressure. They ask instead for one of its ingredients: the angle deficiency at
a stated design point, the compensator pole that fixes it, the gain from the
magnitude condition, or — most often — which compensator type to reach for.
The reliable discriminator is what the specification names. **Overshoot,
settling time, rise time, bandwidth → lead. Steady-state error, error constant,
tracking accuracy → lag.**`,
      examTip: 'The angle deficiency is the whole lead design in one number: evaluate the open-loop phase at the desired pole location, and whatever it takes to reach an odd multiple of 180° is what the compensator must supply. If the deficiency comes out positive (the plant already lags too little), lead is the wrong tool.',
      importantNote: 'A compensator zero placed exactly on a plant pole cancels it only on paper. Real parameters drift, so the cancellation is always approximate and leaves a low-residue mode behind. Never use pole-zero cancellation to hide an unstable or very slow plant pole — the mode it leaves behind is uncontrollable and still there.',
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
| **Phase Margin (PM)** | How much additional phase lag before instability | **Gain-crossover frequency** ω_gc, where $\\lvert G\\rvert = 0\\ \\mathrm{dB}$ |

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
    {
      id: 'bode-margins-and-lead-design',
      title: '4. Margins on a Loop That Can Actually Go Unstable',
      content: `## 4.1 A Third Pole Changes Everything

The worked example in Section 3 had infinite gain margin because its phase
only approaches −180°. Add one more pole and the loop becomes finite-margin,
which is the case every real design lives in. Take

$$G(s) = 40/[s(s+1)(s+10)]$$

**Phase crossover.** Set the total phase to −180°:

$$-90^\\circ - \\arctan(\\omega) - \\arctan(\\omega /10) = -180^\\circ$$

so $\\arctan(\\omega) + \\arctan(\\omega /10) = 90^\\circ$, which happens when the
two arguments are reciprocals: $\\omega \\cdot (\\omega /10) = 1$, giving

$$\\omega _{pc} = \\sqrt{10} = 3.162\\ \\mathrm{rad/s}$$

That reciprocal trick is worth memorising — for a loop with an integrator and
two real poles at a and b, the phase crossover is always at
$\\omega _{pc} = \\sqrt{ab}$.

**Gain margin.** Evaluate the magnitude there:

$$|G(j\\omega _{pc})| = 40/[3.162 \\times \\sqrt{10+1} \\times \\sqrt{10+100}] = 0.3636$$

$$GM = 1/0.3636 = 2.75 = 8.79\\ \\mathrm{dB}$$

**Cross-check with Routh.** The characteristic polynomial is
$s^{3} + 11s^{2} + 10s + K$, and the array gives the window K < 110. Since the
present gain is 40, the allowable multiplier is 110/40 = 2.75 — the same
number, to the digit, from a completely different method. Whenever a problem
gives you both routes, use one and check with the other.

**Phase margin.** Solve $|G(j\\omega)| = 1$ for the gain crossover:
$\\omega _{gc} = 1.861$ rad/s, and

$$PM = 180^\\circ + [-90^\\circ - \\arctan(1.861) - \\arctan(0.1861)] = 17.7^\\circ$$

![Bode magnitude and phase of the loop forty over s times s plus one times s plus ten, computed by exact complex evaluation rather than straight-line approximation. The magnitude crosses zero decibels at one point eight six radians per second and the phase reaches minus one hundred eighty degrees at three point one six, leaving a gain margin of eight point seven nine decibels and a phase margin of seventeen point seven degrees.](/courses/fe-ee/figures/ctrl-bode-margins.svg)

The figure is drawn from the exact expression, not the asymptotes, which is
why the magnitude curve rounds off at each corner instead of breaking sharply.
Sketching with straight lines is still the right exam technique — it locates
the crossovers to within a few percent in seconds — but be aware that the
straight-line magnitude sits up to 3 dB above the true curve at a corner
frequency, and that error lands directly on your gain-margin estimate.

## 4.2 Both Margins Are Distances From One Point

The same information looks different on a polar plot. Trace G(jω) in the
complex plane and the two margins become geometry:

![Nyquist plot of the same loop with its conjugate mirror. The curve crosses the negative real axis at minus zero point three six four, whose reciprocal is the gain margin of two point seven five, and it crosses the unit circle seventeen point seven degrees above the negative real axis, which is the phase margin. The critical point at minus one is not encircled and the open loop has no right-half-plane pole, so the closed loop is stable.](/courses/fe-ee/figures/ctrl-nyquist-margins.svg)

- The **gain margin** is how far the negative-real-axis crossing sits from
  −1: the crossing is at −0.364, so the gain can grow by 1/0.364 = 2.75
  before that point lands on −1.
- The **phase margin** is the angle between the negative real axis and the
  point where the curve crosses the unit circle: 17.7°.
- Stability follows from the encirclement count. Here P = 0 (no open-loop
  right-half-plane poles — the pole at the origin is handled by indenting the
  contour around it) and N = 0, so Z = 0 and the closed loop is stable.

Both plots carry the same content. Bode is faster to sketch and reads margins
directly; Nyquist handles open-loop-unstable plants and time delays, where the
Bode reading of "positive margins means stable" quietly stops being reliable.

## 4.3 What a Margin Actually Predicts

A phase margin of 17.7° is technically stable and practically unusable. Apply
the $\\zeta \\approx PM/100$ rule and then check it against simulation:

| Loop gain K | $\\omega _{gc}$ | PM | GM | ζ from PM/100 | Overshoot predicted | Overshoot simulated | $K_v$ |
|---|---|---|---|---|---|---|---|
| 40 | 1.861 rad/s | 17.7° | 8.79 dB | 0.177 | ≈ 57% | 60.8% | 4 |
| 10 | 0.784 rad/s | 47.4° | 20.8 dB | 0.474 | 18.4% | 20.6% | 1 |

The rule of thumb is good to a few percentage points across a wide range,
which is exactly what it is for: converting a frequency-domain measurement
into a time-domain expectation without solving anything.

The table also lays out the trade in its rawest form. Dropping the gain from
40 to 10 turns a 61% overshoot into a well-mannered 21% — and simultaneously
divides the velocity constant by four, so the ramp-tracking error goes from
0.25 to 1.0. **Gain alone cannot fix both ends of this loop.** That is the
argument for compensation, and it is the same argument the root-locus topic
reached from the other direction.

## 4.4 Lead Compensation Designed in the Frequency Domain

Keep K = 40 (so $K_v$ stays at 4) and buy the phase margin back with a lead
network:

$$C(s) = (1 + Ts)/(1 + \\alpha Ts), \\qquad \\alpha < 1$$

Three standard results drive the design:

- Maximum phase lead: $\\sin \\phi _m = (1-\\alpha)/(1+\\alpha)$, equivalently
  $\\alpha = (1 - \\sin \\phi _m)/(1 + \\sin \\phi _m)$
- It occurs at $\\omega _m = 1/(T\\sqrt{\\alpha})$, the geometric mean of the
  corner frequencies
- The magnitude there is $1/\\sqrt{\\alpha}$

**First pass.** The margin needs to rise from 17.7° to about 45°, a deficit of
27.3°. Because adding the network moves the crossover to a higher frequency
where the plant's own phase is worse, standard practice is to ask for extra —
take $\\phi _m = 35^\\circ$:

- $\\alpha = (1 - \\sin 35^\\circ)/(1 + \\sin 35^\\circ) = 0.2709$
- The new crossover sits where $|G| = \\sqrt{\\alpha} = 0.521$ (−5.67 dB), so
  the compensator's $1/\\sqrt{\\alpha}$ boost lands it at 0 dB:
  $\\omega _m = 2.636$ rad/s
- $T = 1/(\\omega _m\\sqrt{\\alpha}) = 0.729$, giving a zero at 1.372 rad/s and a
  pole at 5.063 rad/s

Checking the result: the achieved phase margin is **41.0°**, not 45. The
plant's phase fell further than the lead network gained while the crossover was
moving right. This is normal and expected — which is why the design is
iterated rather than solved.

**Second pass.** Ask for $\\phi _m = 42^\\circ$:

| Quantity | First pass (35°) | Second pass (42°) |
|---|---|---|
| α | 0.2709 | 0.1982 |
| New crossover $\\omega _m$ | 2.636 rad/s | 2.855 rad/s |
| Zero at 1/T | 1.372 rad/s | 1.271 rad/s |
| Pole at 1/(αT) | 5.063 rad/s | 6.413 rad/s |
| Achieved PM | 41.0° | **45.4°** |
| Simulated overshoot | 30.0% | 24.7% |

The second pass meets the specification. Compare the outcome with the
gain-reduction alternative: both land near a 45° margin, but the compensated
loop crosses over at 2.855 rad/s instead of 0.784 — **1.53 times faster than
the original loop and 3.6 times faster than the detuned one** — while keeping
$K_v = 4$. That is the entire case for compensation in one sentence: it buys
margin without paying for it in speed or accuracy.

## 4.5 How the Exam Asks This

The frequency-domain questions cluster into a few reliable shapes. Given a
loop and a gain, find $\\omega _{pc}$ and the gain margin (evaluate the
magnitude where the phase hits −180°). Given a target gain margin, find the
allowable K (scale linearly — margins in dB shift by exactly the gain change
in dB). Given a phase margin, estimate the overshoot (ζ ≈ PM/100). And given a
required phase lead, find α (the sine formula). Each is one or two lines once
the crossover frequency is in hand, so spend the time getting that right.`,
      examTip: 'For a loop of the form K/[s(s+a)(s+b)] the phase crossover is always at ω_pc = √(ab), independent of K. Find it once, evaluate the magnitude there, and the gain margin follows. Because gain scales the magnitude curve without touching the phase curve, doubling K always costs exactly 6 dB of gain margin and leaves ω_pc alone.',
      importantNote: 'Straight-line Bode sketches are up to 3 dB optimistic at each corner frequency, and the error accumulates when corners are close together. Use the asymptotes to locate the crossovers quickly, then evaluate the exact magnitude at those frequencies before quoting a gain margin.',
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
    {
      id: 'pid-zn-on-a-real-plant',
      title: '4. Ziegler-Nichols on a Plant That Really Does Oscillate',
      content: `## 4.1 Finding K_u and P_u Without a Test Rig

Section 3 ran into a plant that cannot be driven to sustained oscillation by
proportional gain alone. Three poles are the minimum for that, so take the
standard three-lag process

$$G(s) = 1/(s+1)^{3}$$

which stands in for any well-mixed thermal or chemical process. Under P-only
control the characteristic equation is

$$(s+1)^{3} + K_p = 0 \\Rightarrow s^{3} + 3s^{2} + 3s + (1 + K_p) = 0$$

The Routh array's $s^{1}$ entry is $[3\\cdot 3 - (1 + K_p)]/3 = (8 - K_p)/3$,
which vanishes at

$$K_u = 8$$

The auxiliary polynomial from the row above is $3s^{2} + 9 = 0$, so the
sustained oscillation is at $\\omega _u = \\sqrt{3} = 1.732$ rad/s and

$$P_u = 2\\pi /\\omega _u = 2\\pi /\\sqrt{3} = 3.628\\ \\mathrm{s}$$

**Cross-check from the frequency response.** Each lag contributes
$-\\arctan \\omega$, so the phase reaches −180° when
$3\\arctan \\omega = 180^\\circ$, that is $\\arctan \\omega = 60^\\circ$ and
$\\omega = \\sqrt{3}$ — the same frequency. The magnitude there is
$1/(1 + 3)^{3/2} = 1/8$, so the gain needed to reach unity is 8. Two
independent methods, identical answers. When an exam problem gives you a
transfer function rather than test data, this is how you produce $K_u$ and
$P_u$ without ever running the experiment.

## 4.2 Applying the Table

| Controller | $K_p$ | $T_i$ | $T_d$ | $K_i = K_p/T_i$ | $K_d = K_p T_d$ |
|---|---|---|---|---|---|
| P | $0.5K_u$ = 4.0 | — | — | — | — |
| PI | $0.45K_u$ = 3.6 | $P_u/1.2$ = 3.023 s | — | 1.191 | — |
| PID | $0.6K_u$ = 4.8 | $P_u/2$ = 1.814 s | $P_u/8$ = 0.4535 s | 2.646 | 2.176 |

The PID controller is therefore

$$C(s) = 4.8 + 2.646/s + 2.176s$$

## 4.3 What Each Row Actually Does

Simulating all three closed loops turns the table into performance:

| Controller | Steady-state error to a step | Overshoot | Settling time (2%) |
|---|---|---|---|
| P, $K_p$ = 4 | **0.200** | 54.3% (of its own final value) | — (never reaches 1) |
| PI | 0 | 56.1% | 30.7 s |
| PID | 0 | 40.6% | 9.37 s |

The P-only offset is not a simulation artefact — it is exactly
$1/(1 + K_p) = 1/(1+4) = 0.2$, the Type 0 position-error formula from the
time-specifications topic. This is the clearest possible demonstration of why
integral action exists: no amount of proportional gain removes that offset,
because the plant has no integrator and P control does not add one.

![Closed-loop step responses of the three-lag plant under proportional, proportional-integral and full PID control, each tuned from the same Ziegler-Nichols table. The proportional response settles one fifth short of the target, which is exactly one over one plus its gain of four. Both integral controllers reach the target exactly, and the derivative term cuts the overshoot from fifty-six percent to forty-one and the settling time from thirty-one seconds to nine.](/courses/fe-ee/figures/ctrl-pid-actions.svg)

Read the three curves against the three terms and the whole topic condenses
into one picture. The proportional curve is fast and permanently wrong. Adding
integral action drags the output onto the target but slowly, and the extra
lag it introduces actually makes the overshoot slightly **worse** — 56.1%
against the P controller's 54.3%. Adding derivative action then pays that back
with interest: the same zero final error, but the overshoot falls to 40.6% and
the settling time drops by more than a factor of three.

## 4.4 Ziegler-Nichols Is a Starting Point, Not an Answer

Forty percent overshoot would be rejected by most specifications. The
conventional first move is to back off the proportional gain and lengthen the
integral time. Take 70% of the Z-N proportional gain and double the integral
time:

$$K_p = 0.7 \\times 4.8 = 3.36, \\qquad T_i = 2 \\times 1.814 = 3.628\\ \\mathrm{s}, \\qquad T_d = 0.4535\\ \\mathrm{s}$$

| Tuning | $K_p$ | $T_i$ | Overshoot | Settling time (2%) |
|---|---|---|---|---|
| Ziegler-Nichols PID | 4.8 | 1.814 s | 40.6% | 9.37 s |
| Detuned PID | 3.36 | 3.628 s | **14.3%** | **6.51 s** |

The detuned controller is better on **both** counts — less overshoot and
faster settling. That is not a paradox: Z-N is optimising a disturbance-rejection
criterion (roughly, quarter-amplitude decay), not step-tracking overshoot, and
a response that rings less also finishes sooner even though it starts more
gently. Treat the table as the opening bid.

## 4.5 The Derivative Term in Practice

Pure derivative action is never implemented. The term $K_d s$ has magnitude
growing without bound with frequency, so it amplifies sensor noise without
limit. Every real controller uses a filtered derivative:

$$K_d s/(1 + s T_d/N), \\qquad N \\approx 10\\text{ to }20$$

For this design, $T_d = 0.4535$ s and N = 10 puts the filter pole at
$N/T_d = 22.1$ rad/s — well above the 1.73 rad/s region where the loop does
its work, so it barely affects the design while capping the derivative gain at
N = 10 times the proportional gain.

Two related practicalities that exam questions like to name:

- **Derivative on measurement.** Differentiating the error means
  differentiating the setpoint too, so a step change in setpoint produces an
  impulse-like kick at the actuator. Taking the derivative of the measured
  output instead removes the kick and leaves the loop dynamics unchanged.
- **Integral windup.** While the actuator is saturated the loop is
  effectively open, but the integrator keeps accumulating error. Anti-windup —
  clamping or back-calculating the integral state while saturated — prevents
  the long overshoot that otherwise follows.

## 4.6 How the Exam Asks This

| Question shape | The move |
|---|---|
| Given $K_u$ and $P_u$, find the PID gains | Straight table lookup; watch whether the answer wants $T_i$ or $K_i = K_p/T_i$ |
| Given a transfer function, find $K_u$ | Routh array on $D(s) + K = 0$; the gain that zeroes a first-column entry |
| Given a transfer function, find $P_u$ | Auxiliary polynomial at that gain gives $\\omega _u$; then $P_u = 2\\pi /\\omega _u$ |
| "Which term removes steady-state error?" | Integral — it raises the system type by one |
| "Which term reduces overshoot?" | Derivative — it adds phase lead |
| "Why is a filter added to the D term?" | Noise amplification at high frequency |`,
      examTip: 'When a problem hands you a transfer function instead of test data, you can still run the ultimate-gain method on paper: Routh gives K_u from the first-column entry that goes to zero, and the auxiliary polynomial at that gain gives ω_u, from which P_u = 2π/ω_u. Both Ziegler-Nichols columns follow from those two numbers.',
      importantNote: 'Ziegler-Nichols settings are aggressive by design and routinely produce 40% or more overshoot on a step. Backing the proportional gain off to about 70% of the table value and lengthening the integral time often improves overshoot AND settling time simultaneously — the table is a starting point, not an optimum.',
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

The **type number** counts the **free integrators** — poles sitting at s = 0 — carried by the loop gain G(s)H(s).

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
    {
      id: 'ts-specs-both-directions',
      title: '3. Working the Specifications in Both Directions',
      content: `## 3.1 Forward: From Poles to Numbers

Take the second-order loop

$$T(s) = 25/(s^{2} + 6s + 25)$$

Matching the standard form gives $\\omega _n^{2} = 25$ so $\\omega _n = 5$ rad/s,
and $2\\zeta \\omega _n = 6$ so $\\zeta = 0.6$. Every specification follows in one
line each:

| Specification | Formula | Value |
|---|---|---|
| Damped frequency | $\\omega _d = \\omega _n\\sqrt{1-\\zeta ^{2}} = 5(0.8)$ | 4.000 rad/s |
| Percent overshoot | $e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}}\\times 100$ | 9.478% |
| Peak time | $t_p = \\pi /\\omega _d$ | 0.7854 s |
| Rise time (0→100%) | $t_r = (\\pi - \\arccos \\zeta)/\\omega _d$ | 0.5540 s |
| Settling time (2%) | $t_s \\approx 4/(\\zeta \\omega _n) = 4/3$ | 1.333 s |
| Settling time (5%) | $t_s \\approx 3/(\\zeta \\omega _n) = 3/3$ | 1.000 s |

Simulating the actual step response reproduces the first four to four decimal
places. The settling time is the interesting one: the simulated response makes
its **last** exit from the ±2% band at 1.189 s, not 1.333 s. The formula is not
wrong, it is deliberately conservative — it tracks the exponential envelope
$e^{-\\zeta \\omega _n t}$ rather than the oscillation inside it, and the
oscillation usually happens to be near a zero crossing when the envelope
reaches 2%. Expect the true settling time to be equal to or a little better
than $4/(\\zeta \\omega _n)$, never worse.

![A single second-order step response with every specification marked on it. The curve peaks at nine point four eight percent above the final value at zero point seven eight five seconds, first reaches one hundred percent at zero point five five four seconds, and enters the plus or minus two percent band by the estimate four over zeta omega n equal to one point three three three seconds. The dashed decay envelope shows where the settling formula comes from.](/courses/fe-ee/figures/ctrl-step-spec-anatomy.svg)

Everything on that figure is a distance. The overshoot is a vertical distance
above the final value, the peak and rise times are horizontal distances from
the origin, and the settling time is where the dashed envelope squeezes into
the shaded band. Once the picture is in your head, the formulas stop being a
list to memorise and become five ways of measuring one curve.

## 3.2 Reverse: From Specifications to a Pole Region

The exam asks the inverse question at least as often. **Design a system with
no more than 10% overshoot and a 2% settling time no greater than 2 seconds.**
Neither requirement fixes a pole location; each carves out a region of the
s-plane, and the design must land in the intersection.

**The overshoot requirement sets a minimum damping ratio.** Invert the
overshoot formula. Writing $OS$ as a fraction and taking logarithms,

$$\\zeta = -\\ln(OS)/\\sqrt{\\pi ^{2} + \\ln^{2}(OS)}$$

For OS = 0.10: $\\ln(0.10) = -2.303$, so

$$\\zeta = 2.303/\\sqrt{9.870 + 5.302} = 2.303/3.895 = 0.5912$$

Because overshoot falls as ζ rises, the requirement is $\\zeta \\geq 0.5912$.
In the s-plane that is a **wedge**: the pole must lie at an angle no greater
than $\\arccos(0.5912) = 53.76^\\circ$ from the negative real axis.

**The settling requirement sets a minimum decay rate.** From
$t_s = 4/(\\zeta \\omega _n) \\leq 2$ we need $\\zeta \\omega _n \\geq 2$. Since
$\\zeta \\omega _n$ is the pole's distance from the imaginary axis, this is a
**half-plane**: the pole must lie at least 2 units to the left of the
imaginary axis.

The two constraints meet at the corner of the region, and that corner is the
most economical design — the slowest, least aggressive pole pair that still
satisfies both:

$$\\zeta = 0.5912, \\qquad \\omega _n = 2/0.5912 = 3.383\\ \\mathrm{rad/s}$$

$$s = -2 \\pm j2.730$$

Simulating that design gives exactly 10.0% overshoot and a settling estimate
of exactly 2 s: both specifications met, neither exceeded.

![Three step responses at the same natural frequency of five radians per second with damping ratios of zero point two, zero point five and zero point eight. The measured peaks are fifty-two point seven, sixteen point three and one point five percent, matching the exponential overshoot formula in each case. All three settle to the same final value.](/courses/fe-ee/figures/ctrl-damping-family.svg)

The family plot makes the wedge argument concrete. All three curves have the
same $\\omega _n$, so all three have poles the same distance from the origin;
only the angle changes. Overshoot is a function of that angle and nothing
else, which is why a constant-ζ line in the s-plane is a constant-overshoot
line.

## 3.3 The Table Worth Memorising

| ζ | Overshoot | Approx. phase margin (100ζ) | Character |
|---|---|---|---|
| 0.1 | 72.9% | 10° | Violently oscillatory; unusable |
| 0.2 | 52.7% | 20° | Very oscillatory |
| 0.3 | 37.2% | 30° | Oscillatory |
| 0.4 | 25.4% | 40° | Lively |
| 0.5 | 16.3% | 50° | Common design point |
| 0.5912 | 10.0% | 59° | The 10%-overshoot boundary |
| 0.6 | 9.48% | 60° | Well damped |
| 0.707 | 4.32% | 71° | Maximally flat frequency response |
| 0.8 | 1.52% | 80° | Sluggish but clean |
| 1.0 | 0% | — | Critically damped |

Three entries repay memorisation because they anchor the rest: ζ = 0.5 gives
about 16%, ζ = 0.707 gives about 4.3%, and ζ = 0.6 gives about 9.5%. Any
overshoot figure quoted on an exam can be placed between two of those and
interpolated well enough to pick the right multiple-choice answer.

## 3.4 Second-Order Behaviour Inside Higher-Order Systems

None of this applies only to genuinely second-order systems. It applies
whenever a **dominant pair** exists — a complex pair much closer to the
imaginary axis than everything else. The standard test is a factor of 5: if
every other pole lies at least five times farther left than the dominant pair,
treating the system as second order typically predicts overshoot to within one
or two percentage points. The root-locus topic works a concrete case where the
third pole is 7 times farther out and the prediction lands within 0.8
percentage points.

Two cautions come with the approximation. A **zero** near the dominant pair
increases the overshoot beyond the formula's prediction, sometimes
dramatically, because it adds a derivative-like term to the response. And a
pole between the dominant pair and the origin does not merely spoil the
estimate — it becomes the dominant behaviour itself, and the pair you were
tracking is no longer the story.`,
      examTip: 'Learn the inverse overshoot formula ζ = −ln(OS)/√(π² + ln²(OS)) as its own fact, not as something to re-derive under time pressure. Design questions almost always run backwards from a stated overshoot, and every subsequent number — the wedge angle, the minimum ω_n, the pole location — depends on getting that ζ first.',
      importantNote: 'Overshoot depends on ζ alone; settling time depends on the product ζω_n alone. They are independent knobs: moving a pole along a constant-ζ ray changes speed without changing overshoot, and moving it along a circle of constant ω_n changes overshoot without changing distance from the origin.',
    },
    {
      id: 'ts-decrement-resonance-error',
      title: '4. Damping From Measurements, Resonance, and Error Constants Applied',
      content: `## 4.1 Logarithmic Decrement: Damping From a Chart Recording

In the laboratory you rarely have a transfer function; you have a decaying
oscillation on a recorder trace. The **logarithmic decrement** extracts ζ from
that trace directly.

Consecutive peaks of a damped oscillation are separated in time by exactly one
damped period $T_d = 2\\pi /\\omega _d$, and the envelope decays by a factor of
$e^{-\\zeta \\omega _n T_d}$ over that interval. Taking the logarithm of the
ratio of consecutive peak amplitudes defines

$$\\delta = \\ln(A_{1}/A_{2}) = \\zeta \\omega _n T_d = 2\\pi \\zeta /\\sqrt{1 - \\zeta ^{2}}$$

which inverts to

$$\\zeta = \\delta /\\sqrt{4\\pi ^{2} + \\delta ^{2}}$$

For light damping the peaks are nearly identical and the ratio is hard to
measure, so use peaks n cycles apart:

$$\\delta = (1/n)\\ln(A_{1}/A_{n+1})$$

**Worked example.** A recorder trace shows successive overshoot peaks of
12.0 mm and 4.6 mm, 0.40 s apart. Find ζ and $\\omega _n$.

$$\\delta = \\ln(12.0/4.6) = \\ln(2.609) = 0.9589$$

$$\\zeta = 0.9589/\\sqrt{4\\pi ^{2} + 0.9194} = 0.9589/6.356 = 0.1509$$

The peak spacing is the damped period, so

$$\\omega _d = 2\\pi /0.40 = 15.71\\ \\mathrm{rad/s}$$

$$\\omega _n = \\omega _d/\\sqrt{1 - \\zeta ^{2}} = 15.71/0.9885 = 15.89\\ \\mathrm{rad/s}$$

The check on this work is a round trip: build the second-order system with
those parameters, simulate its step response, and measure the peaks. The first
two come out with a ratio of 2.609 and a spacing of 0.400 s — the numbers we
started from. A system this lightly damped has 61.9% overshoot, which is what
a decaying trace with a nearly 3-to-1 peak ratio should look like.

## 4.2 Resonant Peak and Resonant Frequency

The same pair of parameters governs the frequency response, and the FE
handbook lists both results. For $0 < \\zeta < 1/\\sqrt{2}$ the closed-loop
magnitude has a peak at the **resonant frequency**

$$\\omega _r = \\omega _n\\sqrt{1 - 2\\zeta ^{2}}$$

of height

$$M_r = 1/[2\\zeta \\sqrt{1 - \\zeta ^{2}}]$$

For the ζ = 0.6, $\\omega _n$ = 5 system of Section 3:

$$\\omega _r = 5\\sqrt{1 - 0.72} = 5(0.5292) = 2.646\\ \\mathrm{rad/s}$$

$$M_r = 1/[2(0.6)(0.8)] = 1.0417 \\quad (0.355\\ \\mathrm{dB})$$

Evaluating the frequency response numerically puts the peak at 2.646 rad/s
with height 1.0417 — agreement to four figures.

Three facts about these formulas are exam-ready:

- **The three frequencies are ordered** $\\omega _r < \\omega _d < \\omega _n$
  for any underdamped system. Here: 2.646 < 4.000 < 5.000. Mixing them up is
  the most common error on this material.
- **Resonance disappears above $\\zeta = 1/\\sqrt{2} = 0.707$.** The square
  root in $\\omega _r$ goes imaginary, and the magnitude response falls
  monotonically from DC. This is the same 0.707 that defines the maximally
  flat Butterworth response.
- **$M_r$ blows up as ζ → 0**, which is the frequency-domain face of the same
  fact that overshoot approaches 100% as damping vanishes.

## 4.3 Error Constants on a Loop That Needs Checking First

Section 2 gave the error-constant definitions. Here they are applied to a loop
where the arithmetic is not trivial and the stability check is not optional:

$$G(s) = 20(s+3)/[s(s+2)(s+10)]$$

**Step 1 — verify stability.** The Final Value Theorem is meaningless
otherwise. The characteristic polynomial is

$$s(s+2)(s+10) + 20(s+3) = s^{3} + 12s^{2} + 40s + 60$$

All coefficients are positive and the cubic condition $bc > ad$ gives
$12 \\times 40 = 480 > 60$. Stable — proceed.

**Step 2 — identify the type and the constant.** One pole at the origin, so
this is Type 1: zero error to a step, finite error to a ramp.

$$K_v = \\lim_{s\\to 0} s\\cdot G(s) = 20(3)/[(2)(10)] = 3$$

$$e_{ss}(\\mathrm{ramp}) = 1/K_v = 0.3333$$

Simulating the error signal against a unit ramp confirms it settles at exactly
1/3.

**Step 3 — combined inputs.** For $r(t) = 2 + 3t$, superposition applies to
the error because the system is linear: the step component contributes zero
(Type 1) and the ramp component contributes $3/K_v$:

$$e_{ss} = 0 + 3/3 = 1.0$$

Simulation again agrees. Note that the ramp **slope** scales the error
directly — a specification quoted as "tracks a 3 unit/s ramp with error under
0.5" requires $K_v \\geq 6$, not 3.

**A Type 2 loop for contrast.** For $G(s) = 50(s+1)/[s^{2}(s+10)]$, both step
and ramp errors vanish and the acceleration constant governs:

$$K_a = \\lim_{s\\to 0} s^{2}G(s) = 50(1)/10 = 5 \\Rightarrow e_{ss}(\\mathrm{parabola}) = 0.2$$

| Loop | Type | $K_p$ | $K_v$ | $K_a$ | Step error | Ramp error | Parabolic error |
|---|---|---|---|---|---|---|---|
| $20(s+3)/[s(s+2)(s+10)]$ | 1 | ∞ | 3 | 0 | 0 | 0.333 | ∞ |
| $50(s+1)/[s^{2}(s+10)]$ | 2 | ∞ | ∞ | 5 | 0 | 0 | 0.200 |

The pattern in the table is the whole system-type story: each added integrator
moves the ∞ one column to the right and the finite entry one column to the
right with it. What it costs is 90° of phase, which is why Type 2 loops are
rare and Type 3 loops essentially do not exist outside textbooks.`,
      examTip: 'Logarithmic decrement questions are usually given as two peak amplitudes and a time interval. Compute δ = ln(A₁/A₂) first, then ζ = δ/√(4π² + δ²), then read ω_d straight from the peak spacing as 2π/T_d. Do not try to get ω_n before ζ — the conversion ω_n = ω_d/√(1 − ζ²) needs ζ.',
      importantNote: 'Keep ω_r, ω_d and ω_n distinct: ω_r = ω_n√(1 − 2ζ²) is where the frequency response peaks, ω_d = ω_n√(1 − ζ²) is the ringing frequency of the step response, and ω_n is the undamped natural frequency and the pole distance from the origin. They satisfy ω_r < ω_d < ω_n, and ω_r does not exist at all for ζ ≥ 0.707.',
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
    {
      id: 'pz-map-worked-numbers',
      title: `4. Reading the Map: Worked Numbers for Poles, Zeros and States`,
      content: `## 4.1 One Frequency, Three Fates

The claim that the real part alone decides stability is easy to state and
easier to believe once it is drawn. Take three pole pairs that share an
imaginary part of ±j6 and differ only in their real part: −1, 0 and +0.5.

![Three pole pairs plotted on the s-plane at minus one, zero and plus zero point five, all with imaginary parts of plus and minus six, together with the time-domain mode each one produces. The decaying, sustaining and growing responses share an oscillation frequency of six radians per second and differ only in their exponential envelope.](/courses/fe-ee/figures/ctrl-splane-to-time.svg)

All three modes cross zero at the same instants, because the imaginary part
sets the oscillation and it is identical. What differs is the envelope
$e^{-\\sigma t}$, and the sign of σ is the whole of stability. For the decaying
pair, $\\sigma = 1$ gives a time constant $\\tau = 1/\\sigma = 1$ s, so the
envelope is down to $e^{-3} = 4.98\\%$ of its start after three time
constants. That pair has

$$\\omega _n = |-1 + j6| = 6.083\\ \\mathrm{rad/s}, \\qquad \\zeta = 1/6.083 = 0.164$$

which is very lightly damped: each cycle keeps only
$e^{-2\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}} = 35\\%$ of the previous amplitude, so the
ringing is visible for several cycles even though the pair is unambiguously
stable.

## 4.2 A Right-Half-Plane Zero, Measured

Section 2 described the wrong-way start a non-minimum-phase zero produces.
Here it is with numbers. Take

$$G(s) = (2 - s)/[(s+1)(s+2)]$$

which has unit DC gain, poles at −1 and −2, and a zero at **s = +2**. The step
response has a closed form worth deriving because every number in it is
exact. Partial fractions on $Y(s) = G(s)/s$ give residues 1, −3 and 2, so

$$y(t) = 1 - 3e^{-t} + 2e^{-2t}$$

Check it at the origin: $y(0) = 1 - 3 + 2 = 0$, as any strictly proper system
must give. Differentiate: $y'(t) = 3e^{-t} - 4e^{-2t}$, so $y'(0) = -1$. The
output leaves in the **wrong direction**, and that initial slope is exactly
what the initial-value theorem predicts from the numerator's leading
coefficient. Setting $y' = 0$ locates the trough:

$$3e^{-t} = 4e^{-2t} \\Rightarrow e^{t} = 4/3 \\Rightarrow t = \\ln(4/3) = 0.2877\\ \\mathrm{s}$$

$$y_{min} = 1 - 3(3/4) + 2(9/16) = -0.125$$

So the undershoot is exactly one eighth of the final value — 12.5% in the
wrong direction — before the response turns around.

![Step responses of two systems with identical poles and identical final values, one with its zero at plus two and one with its zero at minus two. The non-minimum-phase system dips to minus one eighth of the final value at t equal to the natural logarithm of four thirds before recovering; its minimum-phase twin never leaves the first quadrant.](/courses/fe-ee/figures/ctrl-nonminimum-phase.svg)

The comparison curve is the point of the figure. Mirror the zero to −2 and
everything else stays the same: same poles, same DC gain, same eventual value.
The dip belongs entirely to the zero's location. This is why non-minimum-phase
plants are hard to control — any controller that reacts quickly to the early
motion is reacting to a lie.

## 4.3 Dominance, Quantified

How far is far enough for the dominant-pole approximation? Compare
$10/[(s+1)(s+10)]$ against the first-order $1/(s+1)$, both with unit DC gain
and both dominated by the pole at −1 with the second pole 10 times farther out:

- Worst-case difference between the two step responses over all time: **0.077**
- Difference at t = 1 s: **0.041**

Under 8% error at the worst instant, from a pole only 10× out. At a separation
of 5×, expect roughly double that. The approximation is a working tool, not an
identity — good enough to choose an answer from four options, not good enough
to certify a design.

## 4.4 State Space, Worked Once

The state-space material in Section 3 stays at recognition level for the FE
exam, but recognition is much firmer after one complete numerical pass. Take

$$A = [[0, 1], [-6, -5]], \\qquad B = [0, 1]^{T}, \\qquad C = [1, 0], \\qquad D = 0$$

**Eigenvalues.** For a 2×2 matrix the characteristic polynomial is
$s^{2} - \\mathrm{tr}(A)s + \\det(A)$. Here $\\mathrm{tr}(A) = -5$ and
$\\det(A) = (0)(-5) - (1)(-6) = 6$, so

$$s^{2} + 5s + 6 = 0 \\Rightarrow s = -2, -3$$

Both in the left half plane, so the system is stable — and note that this is
the same test as checking poles, because the eigenvalues of A **are** the
poles.

**Controllability.** Form $[B \\quad AB]$. With $AB = [1, -5]^{T}$:

$$\\mathcal{C} = [[0, 1], [1, -5]], \\qquad \\det \\mathcal{C} = -1 \\neq 0$$

Full rank, so the system is controllable: the input can steer both states.

**Observability.** Form $[C; CA]$. With $CA = [0, 1]$:

$$\\mathcal{O} = [[1, 0], [0, 1]], \\qquad \\det \\mathcal{O} = 1 \\neq 0$$

Full rank, so both states can be reconstructed from the output.

**Back to a transfer function.** Evaluating $C(sI - A)^{-1}B + D$ returns

$$G(s) = 1/(s^{2} + 5s + 6)$$

whose poles are the eigenvalues found above. The two representations describe
one system; the state-space form carries the extra internal information that
controllability and observability test, which the transfer function silently
discards whenever a pole and zero cancel.

| Quantity | Test | This system |
|---|---|---|
| Stability | Eigenvalues of A in the LHP | −2, −3 → stable |
| Characteristic polynomial | $s^{2} - \\mathrm{tr}(A)s + \\det(A)$ (2×2 only) | $s^{2} + 5s + 6$ |
| Controllability | rank$[B \\ AB \\ \\dots]$ = n | det = −1, rank 2 → controllable |
| Observability | rank$[C; CA; \\dots]$ = n | det = 1, rank 2 → observable |
| Transfer function | $C(sI-A)^{-1}B + D$ | $1/(s^{2}+5s+6)$ |`,
      examTip: `For a 2x2 state matrix, skip the determinant expansion: the characteristic polynomial is s² − tr(A)s + det(A). Controllability and observability are then two small determinants. A nonzero determinant means full rank, which is all the FE exam asks you to conclude.`,
      importantNote: `A right-half-plane zero does not make a system unstable — stability is decided by poles alone — but it does force an initial response in the wrong direction and it fundamentally limits achievable bandwidth. The undershoot is a property of the plant, not of the controller, so no amount of tuning removes it.`,
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
