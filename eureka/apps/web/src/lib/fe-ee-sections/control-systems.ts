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
    {
      id: 'bd-rules-derived',
      title: '5. The Three Rules, Derived Rather Than Remembered',
      content: `## 5.1 Everything Follows From Two Sentences

Section 1 listed series, parallel and feedback as a table to memorise. A table
memorised is a table forgotten under exam pressure, and worse, a table gives no
guidance the moment a diagram does not match one of its rows. All three rules —
and every legal manipulation in Section 6 — are consequences of two statements
about what the symbols mean:

- a **block** multiplies the transform of its input by its transfer function;
- a **summing junction** adds the transforms arriving at it, with the sign
  written beside each arrowhead.

Nothing else is assumed. Both statements hold only because the blocks are
linear and time-invariant, which is exactly why block-diagram algebra fails
the moment a saturating amplifier or a rate limiter appears in the loop.

## 5.2 Cascade

Let a signal U drive a block $G_{1}$ whose output V drives a block $G_{2}$
whose output is Y. Applying the multiplication statement twice,

$$V(s) = G_{1}(s)U(s)$$

$$Y(s) = G_{2}(s)V(s) = G_{2}(s)G_{1}(s)U(s)$$

so the pair behaves as a single block of transfer function

$$G_{\\rm series}(s) = G_{1}(s)G_{2}(s)$$

Two things are worth noticing before moving on. First, the product commutes,
so the order of two cascaded blocks on paper is irrelevant — a fact that is
true of the transfer functions and emphatically not true of the hardware, since
a small signal amplified then filtered has a different noise floor from one
filtered then amplified. Second, the cascade is only valid when the second
block does not load the first. A diagram silently promises infinite input
impedance at every arrowhead.

## 5.3 Parallel

If the same U drives $G_{1}$ and $G_{2}$ and their outputs meet at a summing
junction with both signs positive,

$$Y(s) = G_{1}(s)U(s) + G_{2}(s)U(s) = [G_{1}(s) + G_{2}(s)]U(s)$$

$$G_{\\rm parallel}(s) = G_{1}(s) + G_{2}(s)$$

A parallel branch that is a pure gain is the commonest way a transfer function
acquires a zero without acquiring a pole, and it is how proportional-plus-
derivative action is drawn.

## 5.4 The Feedback Formula

Now close a loop. The reference R enters a summing junction with a plus sign;
the measured output arrives at the same junction through H with a minus sign;
the difference E drives G, whose output is Y. Two equations, exactly as
before:

$$E(s) = R(s) - H(s)Y(s)$$

$$Y(s) = G(s)E(s)$$

Substitute the first into the second and collect the Y terms on one side:

$$Y = G(R - HY) \\Rightarrow Y + GHY = GR \\Rightarrow Y(1 + GH) = GR$$

$$T(s) = Y(s)/R(s) = G(s)/[1 + G(s)H(s)]$$

That is the whole derivation, and it takes fifteen seconds on scrap paper.
Anyone who can reproduce it never has to remember whether the sign in the
denominator is plus or minus: the plus comes from moving $-GHY$ across the
equals sign, and it appears precisely because the feedback arrowhead carried a
minus. Reverse that arrowhead and the same three lines give

$$T_{+}(s) = G(s)/[1 - G(s)H(s)]$$

The same two equations also hand over the error transfer function without any
extra work, which is the quantity Section 9 needs:

$$E(s)/R(s) = 1/[1 + G(s)H(s)]$$

## 5.5 The Characteristic Equation Falls Out for Free

The closed-loop poles are the zeros of the denominator of T, so they satisfy

$$1 + G(s)H(s) = 0$$

Write the loop transfer function as a ratio of polynomials, $GH = N(s)/D(s)$,
clear the fraction, and the poles are the roots of

$$D(s) + N(s) = 0$$

This is the single most-used sentence in the next three chapters. **The
characteristic polynomial is the denominator of the loop transfer function plus
its numerator** — not the denominator on its own, which is the most frequent
wrong turn on the whole topic.

### Worked Example 5.1 — A First-Order Loop, Closed

Take $G(s) = 8/(s+3)$ and a constant sensor gain $H = 0.25$ in negative
feedback. Find the closed-loop transfer function, its pole, its DC gain and its
time constant.

Apply the formula and clear the compound fraction in one step by multiplying
numerator and denominator by $(s+3)$:

$$T(s) = [8/(s+3)]/[1 + 2/(s+3)] = 8/[(s+3) + 2] = 8/(s+5)$$

- **Pole**: the characteristic equation is $s + 3 + 2 = 0$, so $s = -5$. The
  open-loop pole at −3 has been dragged to −5 by the loop.
- **DC gain**: $T(0) = 8/5 = 1.6$. Checking that against the open-loop value,
  $G(0) = 8/3 = 2.6667$ and $G(0)H = 0.66667$, so
  $2.6667/1.6667 = 1.6$, which agrees.
- **Time constant**: $\\tau = 1/5 = 0.2$ s, against 0.3333 s open loop. The
  loop made the plant 1.667 times faster and 1.667 times less sensitive, both
  by the same factor $1 + G(0)H$.

### Worked Example 5.2 — Positive Feedback and Where It Breaks

Take $G(s) = 4/(s+2)$ with the feedback arrowhead carrying a **plus** sign and
$H = 0.5$. What is T, and how large may H become?

$$T(s) = [4/(s+2)]/[1 - 2/(s+2)] = 4/[(s+2) - 2] = 4/s$$

The pole has been pushed onto the origin: the loop is now a pure integrator,
marginally stable, and it will drift on any offset. Raise the feedback to
$H = 0.75$ and the same algebra gives $4/[(s+2) - 3] = 4/(s-1)$, a pole at
**+1** and a response that doubles roughly every 0.693 s.

The threshold is where the DC loop gain reaches unity:

$$G(0)H = (4/2)H = 2H = 1 \\Rightarrow H = 0.5$$

Positive feedback is not automatically fatal — it is what a Schmitt trigger and
an oscillator are built from — but in a regulator it converts the pole-dragging
of Section 5.4 into pole-pushing, in the wrong direction.

### Worked Example 5.3 — Parallel Path Inside a Loop

A forward path is made of $G_{a}(s) = 6/(s+4)$ in parallel with a plain gain
$G_{b} = 2$; the sum is then wrapped in unity negative feedback. Find T, its
DC gain, and its high-frequency gain.

First the parallel combination:

$$G(s) = 6/(s+4) + 2 = [6 + 2(s+4)]/(s+4) = (2s+14)/(s+4)$$

Then the loop:

$$T(s) = G/(1+G) = (2s+14)/[(s+4) + (2s+14)] = (2s+14)/(3s+18)$$

- **DC gain**: $T(0) = 14/18 = 0.7778$. Cross-check from the open-loop value
  $G(0) = 14/4 = 3.5$: $3.5/4.5 = 0.7778$, which agrees.
- **Pole and zero**: pole at −6, zero at −7.
- **High-frequency gain**: $T(\\infty) = 2/3 = 0.66667$, not zero. The parallel
  gain gives the closed loop a direct feedthrough path, so this transfer
  function is proper but not strictly proper. Any question that assumes the
  output of a closed loop must roll off to zero is wrong about this system.

| Configuration | Two-line derivation | Result |
|---|---|---|
| Cascade | $V = G_{1}U$, then $Y = G_{2}V$ | $G_{1}G_{2}$ |
| Parallel | $Y = G_{1}U + G_{2}U$ | $G_{1} + G_{2}$ |
| Negative feedback | $E = R - HY$, $Y = GE$ | $G/(1+GH)$ |
| Positive feedback | $E = R + HY$, $Y = GE$ | $G/(1-GH)$ |
| Error to reference | same two equations | $1/(1+GH)$ |
| Closed-loop poles | denominator set to zero | roots of $D + N = 0$ |`,
      examTip: 'Do not memorise the feedback formula — derive it. Write E = R − HY and Y = GE, substitute, and collect. Fifteen seconds of algebra removes every sign ambiguity, works unchanged for positive feedback, and hands you the error transfer function 1/(1 + GH) at the same time.',
      importantNote: 'The characteristic polynomial of a loop is the NUMERATOR PLUS THE DENOMINATOR of GH, not the denominator alone. If GH = N/D, the closed-loop poles are the roots of D(s) + N(s) = 0. Every stability question in the next chapter starts here, and using D(s) by itself is the most common single error on the topic.',
    },
    {
      id: 'bd-legal-moves',
      title: '6. Moving Junctions and Takeoff Points Without Changing the Answer',
      content: `## 6.1 One Test Governs Every Move

Sooner or later a diagram appears whose loops overlap in a way that blocks the
inside-out method: a feedback branch starts inside one loop and lands inside
another. The cure is to relocate a summing junction or a takeoff point until
the loops nest. A relocation is legal when, and only when, **every wire in the
redrawn diagram carries exactly the signal it carried before**. That single
test generates all four moves, and it makes each one a one-line proof rather
than a row in a table.

![Four panels, each showing a diagram before and after a relocation with an equals sign between them. Moving a summing junction downstream of a block G puts a factor G on the relocated input, because G times the sum equals the sum of the G-scaled terms. Moving it upstream puts a factor of one over G on that input. A takeoff point moved upstream of G needs a factor G in the relocated branch, and moved downstream it needs one over G.](/courses/fe-ee/figures/ctl2-block-moves.svg)

## 6.2 Summing Junctions

Suppose two signals meet at a junction and the sum then passes through G. The
output is

$$Y = G(X_{1} + X_{2}) = GX_{1} + GX_{2}$$

The right-hand form is a picture in its own right: each input passes through
its own copy of G and the results are added afterwards. So **a summing junction
moved downstream of a block leaves a factor G on the relocated input**.

Run the identity the other way. If the junction already sits after the block,

$$Y = GX_{1} + X_{2} = G[X_{1} + (X_{2}/G)]$$

so **a summing junction moved upstream of a block leaves a factor 1/G on the
relocated input**. Two junctions standing side by side may always be swapped,
because addition is commutative and associative; no compensation is needed and
nothing is gained either.

## 6.3 Takeoff Points

A takeoff point is a place where a wire is read without being consumed. If the
takeoff sits after G, the branch carries $GX$; if it is dragged to the input
side of G, the wire there carries only X, so the branch must be given its own
copy of G to arrive at the same value. **A takeoff moved upstream of a block
gains a factor G**; moved downstream, the branch was carrying X and now sits
where the wire carries $GX$, so it **gains a factor 1/G**.

$$\\text{branch value before} = \\text{branch value after} \\quad \\text{is the whole rule}$$

The one move that is *not* free is dragging a takeoff point across a summing
junction. The wire before a junction and the wire after it carry genuinely
different signals, and no single multiplying block can convert one into the
other, because the difference is an additive term, not a scale factor. Attempts
to do it anyway are the source of the classic wrong answer in Section 3.4.

### Worked Example 6.1 — A Takeoff Relocated, and the Answer Checked Twice

A loop has a forward path $G_{1}(s) = 6/(s+2)$ followed by
$G_{2}(s) = 1/(s+3)$. Two feedback branches return to the input summing
junction: unity feedback from the output y, and a branch of gain 4 taken from
v, the point **between** the two blocks. Find T.

**Route one — write the node equations.** With $e$ the junction output,

$$e = r - 4v - y, \\qquad v = G_{1}e, \\qquad y = G_{2}v$$

$$v = G_{1}(r - 4v - G_{2}v) \\Rightarrow v(1 + 4G_{1} + G_{1}G_{2}) = G_{1}r$$

$$T(s) = y/r = G_{1}G_{2}/(1 + 4G_{1} + G_{1}G_{2})$$

Substituting and clearing over $(s+2)(s+3)$:

$$T(s) = 6/[(s+2)(s+3) + 24(s+3) + 6] = 6/(s^{2} + 29s + 84)$$

**Route two — move the takeoff, then reduce normally.** Drag the takeoff from
v to y. It has moved downstream of $G_{2}$, so the branch gains a factor
$1/G_{2}$ and its gain becomes $4/G_{2} = 4(s+3)$. Both branches now leave the
same node, so they add:

$$H_{\\rm total}(s) = 1 + 4(s+3) = 4s + 13$$

$$T(s) = G_{1}G_{2}/(1 + G_{1}G_{2}H_{\\rm total}) = 6/[(s+2)(s+3) + 6(4s+13)]$$

$$T(s) = 6/(s^{2} + 5s + 6 + 24s + 78) = 6/(s^{2} + 29s + 84)$$

Identical, which is the point: a correct relocation is an identity, so the two
routes must agree to the last coefficient. The poles are at −3.2639 and
−25.7361, both real and both well into the left half plane, and the DC gain is
$T(0) = 6/84 = 0.07143$.

### Worked Example 6.2 — The Same Move With the Factor Omitted

Repeat the relocation of Example 6.1 but forget the $1/G_{2}$. The branch keeps
its gain of 4, both branches leave y, and the total feedback becomes
$H = 1 + 4 = 5$:

$$T_{\\rm wrong}(s) = G_{1}G_{2}/(1 + 5G_{1}G_{2}) = 6/[(s+2)(s+3) + 30] = 6/(s^{2} + 5s + 36)$$

Compare the two answers as a reader would experience them:

| Quantity | Correct | With the factor forgotten |
|---|---|---|
| Denominator | $s^{2} + 29s + 84$ | $s^{2} + 5s + 36$ |
| DC gain | $6/84 = 0.07143$ | $6/36 = 0.16667$ |
| Poles | −3.2639, −25.7361 (real) | $-2.5 \\pm j5.4544$ |
| Damping ratio | over-damped | $\\zeta = 5/12 = 0.41667$ |
| Character of the response | no overshoot at all | 24 per cent overshoot |

The uncompensated answer is not merely 2.333 times too large at DC; it is
qualitatively the wrong system, oscillatory where the real one is sluggish.
Nothing about it looks suspicious on its own — that is exactly why the check in
Example 6.1 matters.

![Two step responses. The original loop and its correctly compensated redrawing lie exactly on top of one another and settle at 0.07143 without overshoot. The version drawn with the takeoff moved but the one-over-G factor omitted settles at 0.16667, more than twice as high, and rings at a damping ratio of 0.4167.](/courses/fe-ee/figures/ctl2-takeoff-move-check.svg)

### Worked Example 6.3 — Where a Disturbance Really Enters

A load disturbance d adds to the reference r **before** a block
$G(s) = 5/(s+1)$. An engineer redraws the diagram with the disturbance
entering after G instead, without compensating. How wrong is the steady-state
answer for a 0.4-unit step of d?

Correctly, d passes through G, so the steady-state contribution is

$$y_{d}(\\infty) = G(0)\\cdot 0.4 = 5 \\times 0.4 = 2$$

With the junction moved downstream and no factor added, the drawing claims the
contribution is 0.4 — smaller by exactly $G(0) = 5$. Restoring the rule, the
relocated input must carry a factor G, so the branch becomes $5/(s+1)$ and the
steady-state contribution returns to 2. The lesson generalises: **where a
disturbance is injected relative to the plant dynamics changes its effect by
the whole gain of everything between the two points.** Section 9 turns that
observation into a design tool.

## 6.4 A Working Order of Operations

1. Look for loops that already nest. Collapse the innermost one first; nothing
   outside a loop may be cascaded across it while the loop is still open.
2. If no loop is innermost — that is, two branches cross — relocate the takeoff
   point that creates the crossing, applying the compensating factor.
3. Combine cascades and parallel branches only between loop closures.
4. When the diagram has more than about three loops, stop reducing and use
   Mason's rule instead. Section 7 shows where the crossover point is.
5. Check the result at $s = 0$ against a direct arithmetic solve of the node
   equations with all the blocks replaced by their DC values. This takes under
   a minute and catches sign errors, missed branches and forgotten
   compensating factors alike.`,
      examTip: 'Apply the compensating factor in the direction that keeps the branch value constant. Ask "what does this wire carry now, and what did the branch need before?" — a takeoff dragged upstream past G must be multiplied by G, and one dragged downstream must be multiplied by 1/G. Getting the direction backwards produces an answer that is wrong by a factor of G squared.',
      importantNote: 'A takeoff point can never be moved across a summing junction with any compensating block. Blocks multiply; the difference between the two sides of a summing junction is additive. If the diagram seems to require that move, reduce a loop first instead.',
    },
    {
      id: 'bd-mason-applied',
      title: "7. Signal-Flow Graphs and Mason's Rule on a Four-Loop System",
      content: `## 7.1 The Graph Is the Same Information, Drawn Smaller

A signal-flow graph replaces every block with a labelled arrow and every signal
with a node. There are no summing-junction symbols, because a node is
*defined* as the sum of everything arriving at it, and there are no takeoff
symbols, because a node may have any number of departing arrows. Negative
feedback shows up as a branch whose gain carries a minus sign. The picture is
smaller, and — more usefully — it makes the two things Mason's rule counts,
paths and loops, visible at a glance.

Three definitions do all the work:

- a **forward path** is a route from input node to output node that visits no
  node twice; its gain $P_{k}$ is the product of the branch gains along it;
- a **loop** is a closed route that visits no node twice; its gain $L_{i}$ is
  again the product of its branch gains, minus signs included;
- two loops (or a loop and a path) **touch** if they share at least one node.

Mason's gain formula then reads

$$T(s) = (1/\\Delta)\\Sigma _k P_{k}\\Delta _k$$

$$\\Delta = 1 - \\Sigma _i L_{i} + \\Sigma _{i,j} L_{i}L_{j} - \\Sigma _{i,j,k} L_{i}L_{j}L_{k} + \\cdots$$

where the second sum runs over pairs of **non-touching** loops, the third over
mutually non-touching triples, and so on with alternating signs. The cofactor
$\\Delta _k$ is $\\Delta$ recomputed with every loop that touches path k struck
out.

The alternating signs are not arbitrary. Expanding $1/(1 + x)$ as a geometric
series produces exactly this pattern, which is the honest reason the formula
looks the way it does: it is the determinant of the node-equation matrix,
written in graph language.

## 7.2 The System

![A signal flow graph with six nodes labelled R, a, b, c, d and Y. Two forward paths run from R to Y, one through a and b carrying G1 then G2, and one through a, c and d carrying G3 then G4. Three feedback branches carry minus H2 from b to a, minus H1 from d to c, and minus H3 from Y to a. Loops one and two share no node, and neither do loops two and three, giving two non-touching pairs. With G1 = 4/(s+2), G2 = 1/(s+1), G3 = 3/(s+5), G4 = 2, H1 = 1, H2 = 0.5 and H3 = 1 the closed-loop transfer function is (2s squared + 10s + 24) over (s cubed + 12s squared + 39s + 44), with T(0) = 6/11 = 0.54545.](/courses/fe-ee/figures/ctl2-sfg-mason.svg)

The graph above has two forward paths and four loops, and sequential reduction
on it is genuinely painful: the outer loop from Y touches both branches, so no
loop is innermost. Mason's rule dispatches it in about four minutes, and every
one of those minutes is bookkeeping rather than algebra.

| Item | Route | Gain | Nodes visited |
|---|---|---|---|
| Path $P_{1}$ | R–a–b–Y | $G_{1}G_{2}$ | a, b |
| Path $P_{2}$ | R–a–c–d–Y | $G_{3}G_{4}$ | a, c, d |
| Loop $L_{1}$ | a–b–a | $-G_{1}H_{2}$ | a, b |
| Loop $L_{2}$ | c–d–c | $-G_{4}H_{1}$ | c, d |
| Loop $L_{3}$ | a–b–Y–a | $-G_{1}G_{2}H_{3}$ | a, b, Y |
| Loop $L_{4}$ | a–c–d–Y–a | $-G_{3}G_{4}H_{3}$ | a, c, d, Y |

### Worked Example 7.1 — Enumerating the Determinant

Read the node columns of the table and compare them pairwise. $L_{1}$ occupies
a and b; $L_{2}$ occupies c and d; they share nothing, so they are
**non-touching**. $L_{2}$ and $L_{3}$ occupy c, d against a, b, Y — also
non-touching. Every other pair shares node a or node Y. No three loops are
mutually non-touching, so the expansion stops after the pair terms:

$$\\Delta = 1 - (L_{1} + L_{2} + L_{3} + L_{4}) + (L_{1}L_{2} + L_{2}L_{3})$$

Substituting the gains and factoring what is common,

$$\\Delta = (1 + G_{4}H_{1})(1 + G_{1}H_{2} + G_{1}G_{2}H_{3}) + G_{3}G_{4}H_{3}$$

Now the cofactors. Path $P_{1}$ visits a, b and Y, which touches $L_{1}$,
$L_{3}$ and $L_{4}$; only $L_{2}$ survives, so

$$\\Delta _1 = 1 - L_{2} = 1 + G_{4}H_{1}$$

Path $P_{2}$ visits a, c, d and Y, which touches every loop in the table, so
$\\Delta _2 = 1$. The answer assembles itself:

$$T(s) = [G_{1}G_{2}(1 + G_{4}H_{1}) + G_{3}G_{4}]/\\Delta$$

### Worked Example 7.2 — Putting the Numbers In, Twice

Take $G_{1} = 4/(s+2)$, $G_{2} = 1/(s+1)$, $G_{3} = 3/(s+5)$, $G_{4} = 2$,
$H_{1} = 1$, $H_{2} = 0.5$ and $H_{3} = 1$. Then $1 + G_{4}H_{1} = 3$, and

$$\\Delta = 3 + 6/(s+2) + 12/[(s+1)(s+2)] + 6/(s+5)$$

Clearing over $(s+1)(s+2)(s+5)$ gives $\\Delta = (3s^{3} + 36s^{2} + 117s + 132)$
over that same product, while the numerator becomes
$(6s^{2} + 30s + 72)$ over it. The common denominator cancels:

$$T(s) = (6s^{2} + 30s + 72)/(3s^{3} + 36s^{2} + 117s + 132)$$

$$T(s) = (2s^{2} + 10s + 24)/(s^{3} + 12s^{2} + 39s + 44)$$

**The independent check.** Evaluate the graph at $s = 0$ arithmetically,
without any of the algebra above. The blocks become $G_{1} = 2$, $G_{2} = 1$,
$G_{3} = 0.6$, $G_{4} = 2$, so the loop gains are $L_{1} = -1$, $L_{2} = -2$,
$L_{3} = -2$ and $L_{4} = -1.2$. Then

$$\\Delta (0) = 1 + 6.2 + (2 + 4) = 13.2$$

$$P_{1}\\Delta _1 = 2 \\times 3 = 6, \\qquad P_{2}\\Delta _2 = 1.2$$

$$T(0) = 7.2/13.2 = 0.54545$$

and from the polynomial, $T(0) = 24/44 = 0.54545$. The two agree. Because the
second route never touched the symbolic expansion, an error in the factoring
could not have propagated into it.

Solving the five node equations as a linear system at a spread of complex
frequencies gives the same transfer function to fourteen significant figures,
which is the check the figure generator actually performs.

## 7.3 Reading the Answer

Applying the cubic Routh test to $s^{3} + 12s^{2} + 39s + 44$ gives
$12 \\times 39 = 468$ against $1 \\times 44 = 44$, comfortably stable; the poles
are at −7.6572 and $-2.1714 \\pm j1.0155$. The zeros sit at
$-2.5 \\pm j2.3979$, a complex pair that no single branch of the graph put
there — it emerged from the *sum* of the two forward paths. That is worth
holding on to: **parallel forward paths create zeros**, and those zeros are
usually invisible in the diagram.

## 7.4 When to Use Which Method

| Situation | Faster method | Why |
|---|---|---|
| One loop, or nested loops | Sequential reduction | Two applications of $G/(1+GH)$ |
| Two loops sharing one block | Sequential reduction after one takeoff move | The move costs less than the bookkeeping |
| Three or more loops, or any crossing | Mason's rule | No relocation, no compensating factors |
| Several forward paths | Mason's rule | Reduction cannot express a sum of paths cleanly |
| Only the DC gain is wanted | Arithmetic on the graph | Replace every block by its value at $s = 0$ |

On the exam itself the honest advice is that Mason's rule is rarely the fastest
route, because exam diagrams are drawn to be reducible. Learn it anyway for the
last row of that table: the ability to evaluate a graph numerically at
$s = 0$ turns a five-minute algebra problem into a thirty-second arithmetic
one whenever the question asks only for a steady-state value.`,
      examTip: "Two loops touch if they share even one node, and the input and output nodes count. Most Mason errors are not algebra — they are declaring a pair non-touching when both routes pass through the summing node at the plant input. List each loop's node set explicitly before comparing anything.",
      importantNote: 'The cofactor for a forward path is NOT always 1. It equals 1 only when every loop in the graph touches that path. A path that bypasses part of the system typically misses at least one local loop, and dropping the resulting factor is the standard way a Mason answer comes out wrong while still looking plausible.',
    },
    {
      id: 'bd-unity-and-type',
      title: '8. Unity Feedback, System Type, and Where the Error Constants Live',
      content: `## 8.1 Turning Any Loop Into a Unity-Feedback Loop

Every result about steady-state error — position, velocity and acceleration
constants, system type, the whole error table — is stated for unity feedback.
Real loops rarely have it: a sensor has gain, and often dynamics. The bridge is
one line of algebra. Start from the closed-loop transfer function and multiply
above and below by H:

$$T(s) = G/(1 + GH) = (1/H)\\cdot [GH/(1 + GH)]$$

The bracket is exactly the closed-loop transfer function of a **unity-feedback
loop whose open-loop transfer function is GH**. The factor $1/H$ outside it is
a static rescaling of the output. So:

- **system type** is the number of poles at the origin in $GH$, not in G;
- **error constants** are limits of $GH$, not of G;
- the closed-loop DC gain is $1/H(0)$ whenever $GH$ has an integrator, because
  the bracket goes to 1.

$$K_{p} = \\lim_{s \\to 0} G(s)H(s), \\qquad K_{v} = \\lim_{s \\to 0} sG(s)H(s), \\qquad K_{a} = \\lim_{s \\to 0} s^{2}G(s)H(s)$$

## 8.2 Which Error Does the Loop Actually Regulate?

This is where marks are lost. The signal the loop drives towards zero is the
one at the comparator,

$$E(s) = R(s) - H(s)Y(s)$$

which is **not** $R - Y$ unless $H = 1$. A loop with $H = 2$ will happily
settle with the output at half the reference, because at that point the
comparator sees zero and has nothing left to correct. Asking "what is the
steady-state error?" without saying which difference is meant is ambiguous, and
exam questions resolve the ambiguity by asking for the output value instead.

$$e(\\infty) = 1/(1 + K_{p}) \\ \\text{(step, Type 0)}, \\qquad e(\\infty) = 1/K_{v} \\ \\text{(ramp, Type 1)}$$

### Worked Example 8.1 — A Dynamic Sensor

$G(s) = 10/[s(s+2)]$ with feedback $H(s) = (s+1)/(s+5)$. Find the closed-loop
transfer function, the system type, the velocity constant, and the output
produced by a unit step.

The unity-feedback equivalent open loop is

$$G(s)H(s) = 10(s+1)/[s(s+2)(s+5)]$$

which has exactly one pole at the origin, so the loop is **Type 1** — and it
was Type 1 before the sensor was attached too, but only because this particular
H contributed no pole or zero at the origin. The velocity constant is

$$K_{v} = \\lim_{s \\to 0} s\\cdot 10(s+1)/[s(s+2)(s+5)] = 10/(2 \\times 5) = 1$$

so the unity-feedback equivalent tracks a unit ramp with a steady error of
$1/K_{v} = 1$. Now the transfer function itself:

$$T(s) = G/(1+GH) = 10(s+5)/[s(s+2)(s+5) + 10(s+1)]$$

$$T(s) = 10(s+5)/(s^{3} + 7s^{2} + 20s + 10)$$

Stability first, because a steady-state number from an unstable loop is
meaningless: the cubic test gives $7 \\times 20 = 140$ against
$1 \\times 10 = 10$, so all three poles are in the left half plane (they are at
−0.6242 and $-3.1879 \\pm j2.4202$). Then

$$T(0) = 50/10 = 5$$

A unit step produces an output of 5, not 1. That is not an error in the loop —
it is $1/H(0) = 5/1 = 5$, the rescaling predicted by Section 8.1. The
comparator error really does go to zero; the output simply settles wherever it
must for $H(s)Y(s)$ to equal the reference.

### Worked Example 8.2 — The Trap, With Its Wrong Number

$G(s) = 20/(s+4)$ with a constant sensor gain $H = 2$. A candidate computes the
position constant from G, gets $K_{p} = G(0) = 5$, and reports a steady-state
error of $1/(1+5) = 0.16667$. What is actually true?

The unity-feedback equivalent open loop is $GH = 40/(s+4)$, so

$$K_{p} = GH(0) = 40/4 = 10, \\qquad e(\\infty) = 1/(1 + 10) = 0.09091$$

and the closed-loop transfer function is

$$T(s) = [20/(s+4)]/[1 + 40/(s+4)] = 20/(s + 44)$$

$$y(\\infty) = T(0) = 20/44 = 0.45455$$

Check the comparator: $H y(\\infty) = 2 \\times 0.45455 = 0.9091$, so
$e(\\infty) = 1 - 0.9091 = 0.0909$, matching the error constant exactly. The
candidate's 0.16667 is wrong by a factor of 1.833, and note the second trap
hiding behind it: the difference $r - y = 1 - 0.45455 = 0.54545$ is neither of
those numbers and is not an error the loop is trying to remove.

| Quantity | Read from G alone (wrong) | Read from GH (correct) |
|---|---|---|
| Position constant | 5 | 10 |
| Comparator error to a unit step | 0.16667 | 0.09091 |
| Output at steady state | 0.83333 | 0.45455 |
| Reference minus output | 0.16667 | 0.54545 |

## 8.3 Feedback and Bandwidth, Restated Exactly

Section 4.4 quoted a closed-loop bandwidth of 6.879 rad/s for
$L = 20/(s+1)^{2}$. That number has a closed form worth carrying, because it
follows from the standard second-order form alone:

$$\\omega _B = \\omega _n\\sqrt{1 - 2\\zeta ^{2} + \\sqrt{4\\zeta ^{4} - 4\\zeta ^{2} + 2}}$$

With $\\omega _n = \\sqrt{21} = 4.5826$ and $\\zeta = 1/\\sqrt{21} = 0.21822$
this evaluates to 6.8789 rad/s, which agrees to eight figures with solving
$\\lvert T(j\\omega )\\rvert = T(0)/\\sqrt{2}$ numerically. The companion
results are the resonant peak and the frequency at which it occurs:

$$\\omega _r = \\omega _n\\sqrt{1 - 2\\zeta ^{2}} = \\sqrt{19} = 4.3589\\ \\mathrm{rad/s}$$

$$M_{r} = 1/[2\\zeta \\sqrt{1 - \\zeta ^{2}}] = 2.3479$$

The second of those is a genuinely independent confirmation of the transfer
function: brute-force scanning $\\lvert T(j\\omega )\\rvert$ over four million
frequency points finds its maximum at $\\sqrt{19}$ with the value
$\\sqrt{5} = 2.2361$, and dividing by the DC gain $20/21 = 0.95238$ gives
2.3479 again.`,
      examTip: 'Convert to unity feedback before touching a system-type or error-constant question: the open-loop transfer function you need is the PRODUCT GH, and the closed-loop DC gain of a Type 1 or higher loop is 1/H(0). Reading the type off G alone is the single most reliable way to get a steady-state question wrong.',
      importantNote: 'The steady-state error a loop drives to zero is r − Hy, measured at the comparator, not r − y measured at the output. With H = 2 those two differ by more than a factor of five in Example 8.2. Read the question carefully to see which one it wants; if it asks for the output, compute T(0) and stop.',
    },
    {
      id: 'bd-four-transfer-functions',
      title: '9. Disturbances, Noise, and the Four Transfer Functions of a Loop',
      content: `## 9.1 A Loop Has Four Inputs, Not One

Reference tracking is the input a block diagram is usually drawn to explain and
the least important of the four in practice. Draw a controller C and a plant P
in a unity-feedback loop, and admit three more signals: a disturbance
$d_{i}$ added at the plant input, a disturbance $d_{o}$ added at the plant
output, and sensor noise n added to the measurement. Writing the node equations
exactly as in Section 5,

$$e = r - (y + n), \\qquad u = Ce, \\qquad y = P(u + d_{i}) + d_{o}$$

$$y = PC(r - y - n) + Pd_{i} + d_{o}$$

$$y(1 + L) = Lr - Ln + Pd_{i} + d_{o}, \\qquad L = PC$$

$$y = Tr - Tn + [P/(1+L)]d_{i} + Sd_{o}$$

with $S = 1/(1+L)$ and $T = L/(1+L)$ as in Section 4. Four inputs, four
transfer functions, and only two independent shapes among them, because
$S + T = 1$.

| Input | Transfer function to the output | Made small by |
|---|---|---|
| Reference r | $T = L/(1+L)$ | nothing — you want this near 1 |
| Output disturbance $d_{o}$ | $S = 1/(1+L)$ | large loop gain |
| Input disturbance $d_{i}$ | $PS = P/(1+L)$ | large **controller** gain |
| Sensor noise n | $-T$ | small loop gain |

The last row is the whole difficulty of control design in one line. Noise
enters through T, disturbances leave through S, and $S + T = 1$, so no loop
gain suppresses both at the same frequency. All a designer can choose is where
each one is small.

## 9.2 The Numbers for the Loop of Section 3

Use $C = G_{1} = 10/(s+1)$ and $P = G_{\\rm eq} = 2/(s+1)$, so
$L = 20/(s+1)^{2}$ as before.

$$S(s) = (s+1)^{2}/(s^{2} + 2s + 21), \\qquad T(s) = 20/(s^{2} + 2s + 21)$$

$$P(s)S(s) = 2(s+1)/(s^{2} + 2s + 21)$$

At DC these give $S(0) = 1/21 = 0.04762$, $T(0) = 20/21 = 0.95238$ and
$P(0)S(0) = 2/21 = 0.09524$.

![Two magnitude curves in decibels against frequency for the loop L = 20 over (s+1) squared. The sensitivity starts at minus 26.44 decibels at DC, climbs back through 0 decibels at the square root of 11, which is 3.317 radians per second, and peaks at the square root of 6, or 7.78 decibels, at the square root of 23, which is 4.796 radians per second. The complementary sensitivity is flat near 0 decibels at low frequency, peaks at the square root of 5, or 6.99 decibels, at the square root of 19, which is 4.359 radians per second, and then rolls off.](/courses/fe-ee/figures/ctl2-sensitivity-magnitude.svg)

The figure is the frequency-domain statement of the same trade. Sensitivity is
26.44 dB down at DC, which is the disturbance rejection; it is back to unity at
$\\sqrt{11} = 3.3166$ rad/s, above which the loop rejects nothing; and it
overshoots to $\\sqrt{6} = 2.4495$, so between roughly 3.3 and 8 rad/s the loop
makes disturbances **worse** than no loop at all. That peak has a name,
$M_{s}$, and a rule of thumb: keeping it below about 2 is a design target,
because $1/M_{s}$ is a lower bound on how close the loop comes to instability.

### Worked Example 9.1 — Three Disturbances, Three Answers

For the loop above, compute the steady-state output produced by (a) a unit step
of load torque entering at the actuator input, (b) a unit step offset added at
the plant output, and (c) a 0.02 sensor bias.

(a) The path is $PS$, so $y(\\infty) = 2/21 = 0.09524$. Without the loop it
would be $P(0) = 2$, so the loop divided it by 21.

(b) The path is S, so $y(\\infty) = 1/21 = 0.04762$.

(c) The path is $-T$, so the output shifts by
$-0.02 \\times 0.95238 = -0.01905$. The loop does not attenuate this at all —
it cannot, because a sensor error is indistinguishable from a real error. A
sensor with a 2 per cent bias produces a 1.9 per cent output bias no matter how
much gain is applied.

The ordering is the lesson. An input disturbance is worse than an output
disturbance by exactly the DC gain of the plant, here a factor of 2, and sensor
error is worse than both by a factor of 20.

![Two step responses to a unit disturbance injected at the actuator input. With the loop open the output climbs to 2.000 and stays there. With the loop closed it peaks at 0.3950 after 0.351 seconds and then settles to 0.09524, twenty-one times smaller than the open-loop value.](/courses/fe-ee/figures/ctl2-disturbance-step.svg)

Notice what the closed-loop curve does before it settles: it rises to 0.3950,
four times its final value, and only then comes back. Rejection is a
steady-state property. During the first few hundred milliseconds the loop has
not yet had time to respond, and the plant behaves exactly as it would with no
controller at all.

### Worked Example 9.2 — Sensitivity as a Derivative

Section 4.2 measured what a 10 per cent plant error does to the closed-loop DC
gain and got 0.53 per cent. Derive that number instead of measuring it, and
find where the difference between the two comes from.

Differentiate $T = G/(1+GH)$ with respect to G using the quotient rule:

$$dT/dG = [(1 + GH) - G\\cdot H]/(1 + GH)^{2} = 1/(1 + GH)^{2}$$

The relative sensitivity, which is the quantity a percentage question asks
about, multiplies by $G/T$:

$$S^{T}_{G} = (dT/T)/(dG/G) = [1/(1+GH)^{2}]\\cdot G\\cdot (1+GH)/G = 1/(1 + GH)$$

so the sensitivity function of Section 4 is not merely analogous to a
derivative — it **is** one. At DC, $S(0) = 1/21 = 0.04762$, predicting that a
10 per cent plant error produces a 0.4762 per cent change in closed-loop DC
gain.

The exact calculation gives a slightly different figure. Dropping the amplifier
gain by 10 per cent takes the loop gain from 20 to 18, so the DC gain moves
from $20/21 = 0.95238$ to $18/19 = 0.94737$, a relative change of

$$(0.94737 - 0.95238)/0.95238 = -0.005263$$

or −0.5263 per cent. The derivative estimate is 0.4762 per cent and the exact
answer is 0.5263 per cent, because the derivative is evaluated at the nominal
gain while the true change is an average over the interval. For a 10 per cent
perturbation the two differ by a tenth of their own size, which is exactly the
accuracy a first-order sensitivity is entitled to.

## 9.3 What Rising Loop Gain Buys and Costs

![Two stacked panels against DC loop gain on a logarithmic axis for the loop L0 over (s+1) squared, where the damping ratio is one over the square root of one plus L0. The upper panel shows percent overshoot rising from about 4 per cent at a loop gain of 1 through 49.54 per cent at a loop gain of 20 to 60.85 per cent at 40. The lower panel shows the steady-state step error falling from 50 per cent through 4.762 per cent to 2.439 per cent over the same range.](/courses/fe-ee/figures/ctl2-loopgain-tradeoff.svg)

For this particular loop the trade is unusually clean, because closing unity
feedback around $L_{0}/(s+1)^{2}$ gives a denominator $s^{2} + 2s + (1+L_{0})$
and therefore

$$\\omega _n = \\sqrt{1 + L_{0}}, \\qquad \\zeta = 1/\\sqrt{1 + L_{0}}, \\qquad e(\\infty) = 1/(1 + L_{0})$$

Damping and error fall together, one as a square root and one directly, which
is why the two panels of the figure look like mirror images on a logarithmic
axis. Doubling the loop gain from 20 to 40 halves the error from 4.762 per cent
to 2.439 per cent and pays for it with eleven extra points of overshoot.

A two-pole loop can never actually be destabilised this way — $\\zeta$
approaches zero but never reaches it. Add a third pole anywhere and the story
changes completely, which is the subject of the next chapter.

## 9.4 The Minor Loop, Re-examined

Section 3 wrapped a tachometer of gain 0.5 around an integrating actuator and
noted that it improved damping while destroying the zero steady-state error.
Sweeping that gain shows the whole trade at once. With $G_{2} = 2/s$ and
tachometer gain k, the inner loop collapses to $2/(s + 2k)$, so

$$L(s) = 20/[(s+1)(s+2k)], \\qquad \\omega _n = \\sqrt{2k + 20}, \\qquad \\zeta = (1 + 2k)/(2\\sqrt{2k+20})$$

$$e(\\infty) = 1/(1 + K_{p}) = k/(k + 10) \\quad (k > 0)$$

![Two stacked panels against tachometer feedback gain k. The upper panel shows the damping ratio rising from 0.1118 at k equal to zero, through 0.2182 at the worked case k equal to 0.5, to critical damping at k equal to 4.972. The lower panel shows the steady-state step error rising from exactly zero at k equal to zero, through 4.762 per cent at k equal to 0.5, to 33.21 per cent at k equal to 4.972.](/courses/fe-ee/figures/ctl2-minor-loop-tradeoff.svg)

At $k = 0$ the integrator survives, the loop is Type 1, and the step error is
exactly zero — but the damping ratio is only 0.1118 and the response rings for
a dozen cycles. At $k = 0.5$, the case worked in Section 3, damping has
improved to 0.2182 at a cost of 4.762 per cent error. Critical damping arrives
at $k = 4.972$, by which point a third of the reference is being given away.
There is no value of k that is simply "best"; there is only a curve, and a
specification that picks a point on it.`,
      examTip: 'Identify where the disturbance enters before choosing a formula. Injected at the plant output it is divided by 1 + L; injected at the plant input it is divided by 1 + L but first multiplied by the plant gain; arriving as sensor error it is not attenuated at all. The three answers for the same loop differ by a factor of 20 here.',
      importantNote: 'S + T = 1 means disturbance rejection and noise rejection are in direct competition at every frequency. A sensitivity peak M_s above about 2 is a warning sign: over that band the closed loop amplifies disturbances relative to having no loop at all, even though the system is perfectly stable.',
    },
    {
      id: 'bd-problem-sets',
      title: '10. Problem Sets',
      content: `## 10.1 How to Use These

Work each problem to a number on paper before reading the solution. Every
solution names the distractor a hurried candidate lands on and states the wrong
number it produces, because recognising your own wrong answer in a list of
options is a skill worth practising deliberately.

### Problem Set 10A — Reduction, Relocation and Mason

**A1.** A forward block $G(s) = 12/(s+3)$ carries a minor negative-feedback
loop of gain $H_{2} = 0.25$, and the result is wrapped in unity negative
feedback. Find the closed-loop transfer function, its pole and its DC gain.

*Solution.* Collapse the minor loop first:

$$G_{\\rm eq}(s) = [12/(s+3)]/[1 + 3/(s+3)] = 12/(s+6)$$

Then close the outer loop:

$$T(s) = [12/(s+6)]/[1 + 12/(s+6)] = 12/(s + 18)$$

The pole is at −18 and $T(0) = 12/18 = 0.6667$.

*The trap.* Applying unity feedback to the bare G and never closing the minor
loop gives $12/(s+15)$, a pole at −15 and a DC gain of $12/15 = 0.8$. The
answer looks the right shape, which is what makes it dangerous. Always ask
whether every loop in the drawing has been consumed.

**A2.** The same block $G(s) = 6/(s+3)$ now sits in **positive** feedback with
$H = 0.4$. Find the pole, and find the value of H at which the loop becomes
unstable.

*Solution.* $G(0)H = 2 \\times 0.4 = 0.8$, and

$$T(s) = [6/(s+3)]/[1 - 2.4/(s+3)] = 6/(s + 0.6)$$

The pole is at −0.6: still stable, but the loop has been slowed from a time
constant of 0.3333 s to 1.667 s. Instability arrives when the DC loop gain
reaches 1, that is when $2H = 1$, so $H = 0.5$.

*The trap.* Using the negative-feedback formula out of habit gives
$6/(s + 5.4)$, a pole at −5.4 — a loop that appears to have been made five
times *faster* rather than five times slower. The sign in the denominator is
the entire content of this problem.

**A3.** A signal-flow graph has nodes R, a, b, Y with branches R to a of gain
1, a to b of gain 5, b to Y of gain 2, a to Y of gain 3, and a feedback branch
b to a of gain −0.4. Find $T = Y/R$ by Mason's rule.

*Solution.* Two forward paths: $P_{1} = 5 \\times 2 = 10$ through a and b, and
$P_{2} = 3$ through a only. One loop, $L_{1} = 5 \\times (-0.4) = -2$,
occupying a and b. There are no non-touching pairs, so

$$\\Delta = 1 - (-2) = 3$$

Both paths pass through node a, so both touch $L_{1}$ and both cofactors are 1:

$$T = (10 + 3)/3 = 4.3333$$

*The trap.* Seeing only the obvious forward path and reporting
$10/3 = 3.3333$. Feedforward branches that skip a block are easy to miss on a
crowded graph; count paths before counting loops.

**A4.** In the system of Worked Example 6.1, the takeoff for the gain-4 branch
is relocated from v to y. State the compensating factor, the corrected feedback
transfer function, and the DC gain that results if the compensation is
forgotten.

*Solution.* The takeoff has moved **downstream** of $G_{2}$, so the branch
gains a factor $1/G_{2} = s + 3$ and becomes $4(s+3)$. Combined with the unity
branch, $H_{\\rm total} = 4s + 13$, and the correct closed loop is
$6/(s^{2} + 29s + 84)$ with $T(0) = 6/84 = 0.07143$.

*The trap.* Omitting the factor gives $H = 5$ and $6/(s^{2} + 5s + 36)$, whose
DC gain is $6/36 = 0.16667$ — high by a factor of 2.333, and oscillatory where
the true system is over-damped.

### Problem Set 10B — Sensitivity, Disturbance and System Type

**B1.** A loop has $L(0) = 20$. A 1.0 V offset appears at the plant output.
How much of it reaches the controlled output in steady state?

*Solution.* The path is the sensitivity function, so the answer is
$1/(1 + 20) = 0.04762$ V, or 47.62 mV.

*The trap.* Dividing by the loop gain rather than by one plus the loop gain
gives $1/20 = 0.05$ V, or 50 mV. The 5 per cent discrepancy is invisible at
$L = 20$ and enormous at $L = 1$, where the two answers are 0.5 and 1.0.

**B2.** $G(s) = 20/(s+4)$ with constant feedback $H = 2$. Find the output
produced by a unit step and the steady-state error at the comparator.

*Solution.* The unity-feedback equivalent open loop is $GH = 40/(s+4)$, so
$K_{p} = 40/4 = 10$ and the comparator error is
$1/(1+10) = 0.09091$. The closed loop is $T(s) = 20/(s+44)$, so

$$y(\\infty) = 20/44 = 0.45455$$

*The trap.* Computing $K_{p}$ from G alone gives 5 and an error of
$1/6 = 0.16667$. A second trap is reporting $r - y = 0.54545$ as "the error";
it is a difference the loop is not trying to remove.

**B3.** For the loop $L = 20/(s+1)^{2}$, the amplifier gain falls 10 per cent.
By what percentage does the closed-loop DC gain change, exactly and to first
order?

*Solution.* Exactly: the loop gain becomes 18, so the DC gain moves from
$20/21 = 0.95238$ to $18/19 = 0.94737$, a change of −0.5263 per cent. To first
order the sensitivity is $S(0) = 1/21 = 0.04762$, predicting −0.4762 per cent.

*The trap.* Answering −10 per cent, which is the open-loop result and the
number a diagram invites if the loop is overlooked. The whole point of the
sensitivity function is that the closed-loop figure is nineteen times smaller.

**B4.** In the same loop, with plant $P(0) = 2$, compare the steady-state
effect of a unit disturbance at the plant input with one at the plant output.

*Solution.* At the input the path is $PS$, giving $2/21 = 0.09524$; at the
output it is S, giving $1/21 = 0.04762$. The input disturbance is worse by
exactly $P(0) = 2$.

*The trap.* Treating the two as equivalent and quoting 0.04762 for both. The
ratio between them is the plant gain, so on a high-gain plant an input
disturbance can be orders of magnitude more damaging.

### Practice Problems 10C — Exam-Speed Drills

Each of these should take under sixty seconds.

**C1.** Three blocks in cascade: $4/(s+1)$, then 3, then $1/(s+2)$. What is the
DC gain of the cascade?

*Solution.* Multiply: $12/[(s+1)(s+2)]$, so $T(0) = 12/2 = 6$.
*The trap.* Adding instead of multiplying gives $4 + 3 + 0.5 = 7.5$.

**C2.** Two blocks in parallel: a gain of 5 and $3/(s+2)$. DC gain of the
combination?

*Solution.* Add: $5 + 1.5 = 6.5$.
*The trap.* Multiplying gives $5 \\times 1.5 = 7.5$ — the same wrong number as
C1, which is exactly why the two rules get confused.

**C3.** Unity negative feedback around a pure gain of 50. What is the
closed-loop gain?

*Solution.* $50/51 = 0.98039$.
*The trap.* Answering 50, forgetting that the loop divides by $1 + L$. At high
gain the closed loop approaches 1, never the open-loop value.

**C4.** Unity feedback around $K/[s(s+4)]$ with $K = 8$. Find $\\omega _n$ and
$\\zeta$.

*Solution.* The characteristic polynomial is $s^{2} + 4s + K = s^{2} + 4s + 8$,
so $\\omega _n = \\sqrt{8} = 2.8284$ rad/s and
$\\zeta = 4/(2 \\times 2.8284) = 0.70711$.
*The trap.* Reading $\\omega _n = 8$ from the constant term without taking the
square root, then computing $\\zeta = 4/16 = 0.25$.

**C5.** A closed loop has $T(s) = 20/(s^{2} + 2s + 21)$. What is the
steady-state error to a unit step?

*Solution.* $T(0) = 20/21 = 0.95238$, so the error is
$1 - 0.95238 = 0.04762$, or 4.762 per cent.
*The trap.* Reporting 0.95238 as the error, or reading the numerator 20 as a
gain and concluding the output overshoots the reference twentyfold.

## 10.2 A Two-Minute Self-Check

Before leaving this chapter, confirm you can do each of these without looking
back:

| Task | Target time |
|---|---|
| Derive $T = G/(1+GH)$ from $E = R - HY$ and $Y = GE$ | 20 s |
| Collapse a nested pair of loops to a single transfer function | 60 s |
| State the compensating factor for any of the four relocations | 10 s |
| List the loops and paths of a six-node graph with their node sets | 90 s |
| Convert a non-unity loop to its unity equivalent and read the type | 30 s |
| Give the DC value of S, T and $PS$ from a loop gain | 20 s |`,
      examTip: 'When an answer list contains a value and that value multiplied or divided by 1 + L(0), the question is testing whether you closed the loop. When it contains a value and its reciprocal, the question is testing which transfer function you picked. Naming the trap before choosing is faster than re-deriving.',
      importantNote: 'Every problem here has a steady-state answer that can be checked by replacing each block with its value at s = 0 and solving the resulting arithmetic. That check costs under a minute, uses none of the algebra it verifies, and catches the great majority of reduction errors.',
    },
  ],
  keyTakeaways: [
    'Series blocks: multiply. Parallel blocks: add. Feedback: T = G/(1 + GH).',
    'Unity feedback: T = G/(1 + G); closed-loop poles determine stability.',
    "Mason's gain formula handles complex multi-loop diagrams.",
    'Negative feedback reduces error, sensitivity, and distortion but lowers gain.',
    'Poles of the closed-loop transfer function must have negative real parts for stability.',
    'Derive the feedback formula from E = R − HY and Y = GE rather than memorising the sign.',
    'The characteristic polynomial is the numerator PLUS the denominator of GH, never the denominator alone.',
    'Relocating a takeoff or summing junction is legal only with its compensating factor of G or 1/G.',
    'System type and error constants come from GH, not from G; the closed-loop DC gain of a Type 1 loop is 1/H(0).',
    'A loop has four transfer functions: T for reference and for noise, S for output disturbance, PS for input disturbance.',
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

**$D(s) = a_{n}s^{n} + a_{n-1}s^{n-1} + \\cdots + a_{1}s + a_{0}$**

**Necessary condition** for stability: all coefficients a_i must be **positive** (same sign). If any coefficient is zero or negative, the system is **definitely unstable** (no need to build the array).

## 1.2 Building the Routh Array

| Row | Entries |
|---|---|
| **$s^{n}$** | $a_{n}, a_{n-2}, a_{n-4}, \\ldots$ |
| **$s^{n-1}$** | $a_{n-1}, a_{n-3}, a_{n-5}, \\ldots$ |
| **$s^{n-2}$** | $b_{1}, b_{2}, b_{3}, ...$ |
| **$s^{n-3}$** | $c_{1}, c_{2}, c_{3}, ...$ |
| ... | ... |
| **$s^{0}$** | last entry |

### Computing Entries

**$b_{1} = (a_{n-1}a_{n-2} - a_{n}a_{n-3})/a_{n-1}$**

**$b_{2} = (a_{n-1}a_{n-4} - a_{n}a_{n-5})/a_{n-1}$**

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

## 3.3 Special Case: An Entire Row of Zeros

**Characteristic polynomial**: D(s) = s³ + s² + 2s + 2

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{3}$ | 1 | 2 |
| $s^{2}$ | 1 | 2 |
| $s^{1}$ | $(1\\times 2 - 1\\times 2)/1 = 0$ | 0 |

Both entries of the $s^{1}$ row vanish, so this is the **row-of-zeros** case of
Section 2.2, not the first-column-zero case of Section 2.1. The distinction
matters: ε is only for a lone zero sitting in a row that still has non-zero
entries beside it. Here the correct move is the auxiliary polynomial, taken
from the row **above** the vanished one:

**$P(s) = s^{2} + 2$**, so **$dP/ds = 2s$**

Replace the dead row with the coefficients of that derivative and carry on:

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{1}$ | 2 | 0 |
| $s^{0}$ | $(2\\times 2 - 1\\times 0)/2 = 2$ | 0 |

First column: 1, 1, 2, 2 → **no sign changes**, so there are no right-half-plane
roots. But "no RHP roots" is not the same as "stable". The auxiliary polynomial
itself gives the symmetric roots it detected:

**$P(s) = s^{2} + 2 = 0$** → s = ±j√2

These are **poles on the imaginary axis** → the system is **marginally stable**
(sustained oscillations at ω = √2 rad/s). Factoring confirms it exactly:
$D(s) = (s+1)(s^{2}+2)$, so the third root is at −1 and nothing decays the
oscillation away.

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
    {
      id: 'stab-roots-and-modes',
      title: '5. Where Stability Comes From: the Roots of the Characteristic Equation',
      content: `## 5.1 A Transfer Function Is a Sum of Modes

The Routh array is a shortcut, and a shortcut only makes sense once you know
what it is short for. Start from a closed-loop transfer function written as a
ratio of polynomials with distinct denominator roots:

$$Y(s)/R(s) = N(s)/D(s), \\qquad D(s) = a_{n}(s - p_{1})(s - p_{2})\\cdots (s - p_{n})$$

Expanding in partial fractions and inverting term by term turns the response
into a sum of exponentials, one per root:

$$y(t) = \\Sigma _i r_{i}e^{p_{i}t} + (\\text{terms forced by the input})$$

Each $p_{i}$ is a **mode**. A real root at $p = -\\sigma$ contributes a decaying
exponential with time constant $1/\\sigma$. A complex pair
$p = -\\sigma \\pm j\\omega$ contributes a single real term,

$$Ce^{-\\sigma t}\\cos(\\omega t + \\phi )$$

whose envelope is set entirely by the real part and whose ringing frequency is
set entirely by the imaginary part. Everything about stability follows from one
observation: $e^{p t}$ decays if and only if the real part of p is negative.

$$\\text{asymptotically stable} \\iff \\mathrm{Re}(p_{i}) < 0 \\ \\text{for every } i$$

A repeated root of multiplicity m contributes terms in
$t^{m-1}e^{pt}$, and the polynomial factor loses to the exponential whenever
the real part is negative — so repetition changes nothing about stability, only
about shape. It matters in exactly one place: on the imaginary axis, where the
exponential is not decaying and the polynomial factor wins outright.

## 5.2 Why All the Coefficients Must Be Positive

The necessary condition of Section 1.1 is not a rule handed down; it is a
consequence of multiplying factors out. A stable real polynomial factors
completely into real first-order and second-order pieces of the form

$$(s + a), \\qquad a > 0$$

$$(s + \\sigma )^{2} + \\omega ^{2} = s^{2} + 2\\sigma s + (\\sigma ^{2} + \\omega ^{2}), \\qquad \\sigma > 0$$

Every one of those has strictly positive coefficients, and multiplying
polynomials with positive coefficients can only produce sums of positive
products. Hence a missing term or a negative sign proves at least one root is
not in the open left half plane.

The converse fails, and it is essential to know that it fails. The polynomial

$$D(s) = s^{4} + 2s^{3} + s^{2} + 4s + 2$$

worked in Section 3.2 has five strictly positive coefficients and two roots at
$0.35163 \\pm j1.28433$, squarely in the right half plane. Its unstable mode
grows at 0.35163 per second, so the amplitude doubles roughly every 1.9713
seconds and multiplies by e every 2.8439 seconds. Positive coefficients buy you
the right to build the array — nothing more.

### Worked Example 5.1 — Reading Time Constants Off the Roots

$D(s) = s^{3} + 9s^{2} + 26s + 24$. Is it stable, and how fast does the
slowest mode decay?

The coefficient test passes. The cubic condition compares
$9 \\times 26 = 234$ with $1 \\times 24 = 24$, and 234 exceeds 24, so all three
roots are in the left half plane. Factoring gives
$D(s) = (s+2)(s+3)(s+4)$, so the modes are $e^{-2t}$, $e^{-3t}$ and $e^{-4t}$.

The slowest is the one at −2, with time constant $1/2 = 0.5$ s, and it
dominates everything after the first few tenths of a second. A two per cent
settling estimate is four time constants, $4 \\times 0.5 = 2$ s. Note that the
Routh test alone would never have produced any of these numbers. It answers
"which side", not "how far" — a distinction Section 9 turns into a method.

### Worked Example 5.2 — A Quintic That the Coefficient Test Cannot Judge

$D(s) = s^{5} + 2s^{4} + 3s^{3} + 6s^{2} + 2s + 1$. How many roots lie in the
right half plane?

All six coefficients are positive, so the array is unavoidable. Rows one and
two are the alternating coefficient lists:

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{5}$ | 1 | 3 | 2 |
| $s^{4}$ | 2 | 6 | 1 |
| $s^{3}$ | $(2\\times 3 - 1\\times 6)/2 = 0$ | $(2\\times 2 - 1\\times 1)/2 = 1.5$ | 0 |

The $s^{3}$ row has a zero in its first position but a live entry beside it, so
this is the ε case of Section 7.1, and the result worked out there is **two
right-half-plane roots**. Direct root finding confirms it: the roots are
$0.09589 \\pm j1.61985$ in the right half plane, together with
$-0.15561 \\pm j0.42159$ and $-1.88056$.

Notice how little margin there is: the unstable pair sits only 0.096 to the
right of the axis. A polynomial can be unstable in a way that no amount of
squinting at coefficients will reveal, and this is the reason the array exists.

## 5.3 What the Array Actually Computes

Routh's array is a compact evaluation of the **Hurwitz determinants** built
from the coefficients. For a cubic $a_{3}s^{3} + a_{2}s^{2} + a_{1}s + a_{0}$
those determinants are

$$\\Delta _1 = a_{2}, \\qquad \\Delta _2 = a_{2}a_{1} - a_{3}a_{0}, \\qquad \\Delta _3 = a_{0}\\Delta _2$$

and requiring all three positive reproduces exactly the familiar shortcut: all
coefficients positive together with $a_{2}a_{1} > a_{3}a_{0}$. The array
computes the same quantities by repeated two-by-two elimination, which is why
each entry is a small determinant divided by the pivot above it, and why the
count of sign changes — rather than the entries themselves — carries the
answer.

| Order | Full condition | What it reduces to |
|---|---|---|
| 1 | $a_{1}, a_{0} > 0$ | both coefficients positive |
| 2 | $a_{2}, a_{1}, a_{0} > 0$ | all three coefficients positive |
| 3 | above plus $a_{2}a_{1} > a_{3}a_{0}$ | the one extra product test |
| 4 | above plus one more determinant | build the array; no useful shortcut |
| 5 and up | build the array | the shortcuts are gone |`,
      examTip: 'For orders one to three the array is a waste of time: check the coefficients, and for a cubic also check bc > ad. From order four upward there is no shortcut worth memorising, so build the array — it takes about ninety seconds for a quartic and is far less error-prone than any remembered formula.',
      importantNote: 'All-positive coefficients are NECESSARY but not SUFFICIENT from order three upward. The quartic s⁴ + 2s³ + s² + 4s + 2 has five positive coefficients and two right-half-plane roots. Never report "stable" on the coefficient test alone above second order.',
    },
    {
      id: 'stab-bibo-vs-asymptotic',
      title: '6. BIBO Stability, Asymptotic Stability, and the Modes You Cannot See',
      content: `## 6.1 Three Different Questions

"Stable" is three claims wearing one word, and exam questions exploit the gap
between them.

**Asymptotic stability** asks whether every mode of the system decays to zero
from any initial condition, with no input applied. It is a statement about the
roots of the characteristic polynomial: all of them strictly in the open left
half plane.

**BIBO stability** — bounded input, bounded output — asks whether every bounded
input produces a bounded output. For a linear time-invariant system this holds
exactly when the impulse response is absolutely integrable,

$$\\int_{0}^{\\infty}\\lvert g(t)\\rvert \\, dt < \\infty$$

which in turn holds exactly when every pole of the **transfer function** lies
in the open left half plane.

**Internal stability** asks whether every signal inside the loop stays bounded
for bounded signals injected anywhere. It is the strongest of the three, and
the only one that survives a pole-zero cancellation.

| Pole pattern | Asymptotically stable | BIBO stable | Response to a bounded input |
|---|---|---|---|
| All in the open left half plane | yes | yes | bounded, decays to a steady value |
| Simple pair on the imaginary axis | no | no | bounded unless driven at that frequency |
| Repeated pair on the imaginary axis | no | no | grows without any input at all |
| Any root strictly right of the axis | no | no | grows exponentially |

The second row is the one that catches people. A simple pair on the axis gives
a bounded impulse response — a pure sinusoid that never grows — yet the system
is not BIBO stable, because the sinusoid is not absolutely integrable. The
counterexample that proves it is easy to construct.

### Worked Example 6.1 — A Bounded Input With an Unbounded Output

$G(s) = 1/(s^{2} + 4)$ has poles at $\\pm j2$: simple, on the axis, nothing to
the right. Drive it with $u(t) = \\sin 2t$, an input whose amplitude is one for
all time.

$$U(s) = 2/(s^{2} + 4) \\Rightarrow Y(s) = 2/(s^{2} + 4)^{2}$$

Using the standard transform pair
$\\mathcal{L}^{-1}[1/(s^{2}+\\omega ^{2})^{2}] = (\\sin \\omega t - \\omega t\\cos \\omega t)/(2\\omega ^{3})$
with $\\omega = 2$,

$$y(t) = (\\sin 2t - 2t\\cos 2t)/8$$

The first term is bounded. The second is not: its amplitude is $2t/8 = t/4$ and
it grows without limit. At $t = 10\\pi$ the cosine equals one and the sine
vanishes, so

$$y(10\\pi ) = -2\\cdot 10\\pi /8 = -2.5\\pi = -7.854$$

![One bounded sinusoidal input producing two very different outputs. Through a plant with poles exactly on the imaginary axis at plus and minus j2, the output oscillation grows inside an envelope of t over 4 and reaches minus 7.854 at t equal to ten pi. Through a plant whose poles are moved only slightly left, to minus 0.2 plus and minus j2, the same input produces a bounded oscillation.](/courses/fe-ee/figures/ctl2-bibo-resonance.svg)

Move the poles a fraction to the left — to $-0.2 \\pm j2$ — and the same input
produces a perfectly bounded steady oscillation. Nothing about the shape of the
pole pattern changed; only its side of the axis did. **That is the entire
content of the stability criterion**, and it is why the Routh test refuses to
call an axis root stable even though nothing in the impulse response grows.

Two further consequences are worth stating explicitly:

- a **repeated** pair on the axis, such as the poles of
  $1/(s^{2}+4)^{2}$, produces $t\\sin 2t$ terms with **no input at all**, so it
  is unstable in every sense;
- a root exactly **at** the origin is an integrator: bounded input, ramping
  output. The step response of $1/s$ is unbounded, so a free integrator is not
  BIBO stable either, however useful it is inside a loop.

## 6.2 The Mode the Transfer Function Hides

Cancelling an unstable plant pole against a controller zero is the single most
dangerous manoeuvre in elementary control, and it looks like good engineering
on paper. Take an unstable plant and a controller placed to cancel its pole:

$$P(s) = 4/(s - 1), \\qquad C(s) = (s - 1)/(s + 3)$$

$$L(s) = C(s)P(s) = 4/(s + 3), \\qquad T(s) = L/(1 + L) = 4/(s + 7)$$

The closed-loop transfer function has a single pole at −7. Every test applied
to T says the system is fine: the Routh array on $s + 7$ has one positive
entry, the step response settles cleanly at $4/7 = 0.5714$, and the time
constant is a brisk 0.1429 s.

### Worked Example 6.2 — Finding the Hidden Mode

Compute the transfer function from a disturbance injected at the **plant
input** to the output, for the loop above.

$$Y/D_{i} = P/(1 + L) = [4/(s-1)]\\cdot [(s+3)/(s+7)] = 4(s+3)/[(s-1)(s+7)]$$

The pole at $s = +1$ did not go anywhere. It cancelled out of the
reference-to-output path and stayed in every other path. Expanding the step
response of that transfer function in partial fractions for a disturbance of
size $d_{0}$,

$$y_{d}(t) = d_{0}[2e^{t} - 12/7 - (2/7)e^{-7t}]$$

so with $d_{0} = 0.001$ — one millivolt, the sort of offset a comparator has
for free — the output at eight seconds is

$$0.001 \\times (5961.92 - 1.71) = 5.9602$$

which is ten times the reference the loop is supposedly tracking. The mode
multiplies by e every second and no amount of gain will touch it, because the
controller has no authority over a direction the cancellation removed from its
view.

![Two stacked panels for a loop whose controller zero cancels an unstable plant pole at plus one. The upper panel shows the step response from the reference settling cleanly at 4 over 7, which is 0.5714, with no sign of trouble. The lower panel shows the same loop disturbed by one millivolt at the plant input: the output grows exponentially, multiplying by e every second, and reaches 5.960 after eight seconds.](/courses/fe-ee/figures/ctl2-hidden-mode.svg)

### Worked Example 6.3 — Detecting the Problem With Routh

Nothing above required simulation. Apply the coefficient test to the
denominator of the input-disturbance path, $(s-1)(s+7) = s^{2} + 6s - 7$: the
constant term is negative, so the necessary condition fails immediately and the
system has a right-half-plane root. Building the array confirms one sign change
and therefore exactly one such root.

The practical rule that follows is short. **Never test only the
reference-to-output transfer function.** Form the characteristic polynomial
from $1 + L(s) = 0$ *before* cancelling anything, or equivalently apply the
test to the product of the plant and controller denominators plus their
numerators:

$$D_{P}(s)D_{C}(s) + N_{P}(s)N_{C}(s) = (s-1)(s+3) + 4(s-1) = (s-1)(s+7)$$

The factor $(s-1)$ is visible on the left-hand side and vanished on the right
of the earlier calculation only because it was cancelled first. Cancel after
forming the characteristic polynomial, never before.

## 6.3 What the Necessary Condition Really Says

Section 1.1 states that a missing or negative coefficient means the system is
"definitely unstable". With the vocabulary of this section the claim can be
made precise: it means the system is **not asymptotically stable**. It may be
diverging, or it may be marginally stable with roots on the axis — the
polynomial $s^{2} + 9$ has a missing coefficient and two axis roots, giving a
bounded oscillation at 3 rad/s rather than a runaway. For FE purposes both
answers are "not stable", but a question that asks for the oscillation
frequency is asking about the second case, and there the missing coefficient is
the clue rather than the verdict.`,
      examTip: 'When a question describes a system that "oscillates forever" or "sustains oscillation", it is describing simple poles on the imaginary axis: not asymptotically stable, not BIBO stable, zero Routh sign changes. Compute the frequency from the auxiliary polynomial, and do not report the system as stable just because the first column stayed positive.',
      importantNote: 'A pole-zero cancellation across an unstable pole hides the mode from the reference-to-output transfer function but not from the system. Always form 1 + L(s) = 0 from the uncancelled numerators and denominators. In the worked example a 1 mV disturbance reaches 5.96 units in eight seconds while the step response looks perfect.',
    },
    {
      id: 'stab-special-cases-worked',
      title: '7. The Two Special Cases, Worked to Numbers',
      content: `## 7.1 A Zero in the First Column, and Nowhere Else

The array divides by the first entry of the row above. When that entry is zero
but the rest of its row is not, the division is undefined and the construction
stalls — yet the polynomial is perfectly ordinary and has a definite root
count. The standard repair replaces the zero with a small positive symbol ε and
carries it through, examining the signs in the limit as ε approaches zero from
above.

### Worked Example 7.1 — The ε Method End to End

$D(s) = s^{4} + s^{3} + 2s^{2} + 2s + 3$. Count the right-half-plane roots.

All five coefficients are positive, so the array is required.

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{4}$ | 1 | 2 | 3 |
| $s^{3}$ | 1 | 2 | 0 |
| $s^{2}$ | $(1\\times 2 - 1\\times 2)/1 = 0$ | $(1\\times 3 - 1\\times 0)/1 = 3$ | 0 |

The $s^{2}$ row is $[0, 3]$: its first entry is zero, its second is not. That is
the ε case. Substitute and continue:

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{2}$ | ε | 3 |
| $s^{1}$ | $2 - 3/\\varepsilon$ | 0 |
| $s^{0}$ | 3 | 0 |

The $s^{1}$ entry is what decides everything. For ε = 0.1 it is
$2 - 30 = -28$, since $3/0.1 = 30$; for ε = 0.001 it is
$2 - 3000 = -2998$; and as ε shrinks it runs to minus infinity. The first
column is therefore

$$1, \\quad 1, \\quad \\varepsilon > 0, \\quad -\\infty, \\quad 3$$

Two sign changes — plus to minus, then minus to plus — so **two roots lie in
the right half plane**. Direct root finding gives
$0.40574 \\pm j1.29283$ and $-0.90574 \\pm j0.90199$, confirming the count.

The most common misreading here is to treat ε as a physically small number and
conclude the entry is "nearly zero, so nearly stable". It is not a number at
all; it is a bookkeeping device whose only job is to reveal the sign of the
entry beneath it.

### Worked Example 7.2 — The Same Count Without Any ε

There is a second route to the same answer that needs no limits, and it makes a
genuine cross-check because it shares no algebra with the first. Reverse the
coefficient list of D to form the **reciprocal polynomial**:

$$D^{*}(s) = 3s^{4} + 2s^{3} + 2s^{2} + s + 1$$

Its roots are the reciprocals of the roots of D. Reciprocation maps the right
half plane onto itself — if $\\mathrm{Re}(p) > 0$ then
$\\mathrm{Re}(1/p) > 0$ as well, since $1/p = \\bar{p}/\\lvert p\\rvert ^{2}$ —
so the right-half-plane count is preserved. Build the ordinary array:

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{4}$ | 3 | 2 | 1 |
| $s^{3}$ | 2 | 1 | 0 |
| $s^{2}$ | $(2\\times 2 - 3\\times 1)/2 = 0.5$ | $(2\\times 1 - 3\\times 0)/2 = 1$ | 0 |
| $s^{1}$ | $(0.5\\times 1 - 2\\times 1)/0.5 = -3$ | 0 | 0 |
| $s^{0}$ | 1 | 0 | 0 |

First column: 3, 2, 0.5, −3, 1 → **two sign changes**, the same answer, with no
special case encountered at all. Root finding on $D^{*}$ gives
$0.22099 \\pm j0.70414$ and $-0.55432 \\pm j0.55203$; the two right-half-plane
roots are the reciprocals of the pair found in Example 7.1, as promised.

## 7.2 An Entire Row of Zeros

A whole row of zeros is a different animal. It appears when the polynomial
contains a factor that is **even in s**, whose roots are therefore arranged
symmetrically about the origin: pairs on the imaginary axis, pairs on the real
axis, or quadruplets $\\pm \\sigma \\pm j\\omega$. The repair is to differentiate
the auxiliary polynomial formed from the row above and use its coefficients in
place of the dead row.

### Worked Example 7.3 — Symmetric Roots on the Axis

$D(s) = s^{5} + 2s^{4} + 6s^{3} + 12s^{2} + 8s + 16$. Classify it.

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{5}$ | 1 | 6 | 8 |
| $s^{4}$ | 2 | 12 | 16 |
| $s^{3}$ | $(2\\times 6 - 1\\times 12)/2 = 0$ | $(2\\times 8 - 1\\times 16)/2 = 0$ | 0 |

Both entries vanish. Form the auxiliary polynomial from the $s^{4}$ row, using
its entries as coefficients of descending **even** powers:

$$P(s) = 2s^{4} + 12s^{2} + 16 = 2(s^{2} + 2)(s^{2} + 4)$$

$$dP/ds = 8s^{3} + 24s$$

Put 8 and 24 into the $s^{3}$ row and continue as normal. The next entry is
$8 \\times 12 - 2 \\times 24 = 48$, and $48/8 = 6$; beside it,
$8 \\times 16 - 2 \\times 0 = 128$ and $128/8 = 16$.

| Row | Col 1 | Col 2 |
|---|---|---|
| $s^{3}$ | 8 | 24 |
| $s^{2}$ | 6 | 16 |
| $s^{1}$ | $6 \\times 24 - 8 \\times 16 = 16$, then $16/6 = 2.6667$ | 0 |
| $s^{0}$ | 16 | 0 |

First column: 1, 2, 8, 6, 2.6667, 16 — all positive, **zero sign changes, zero
right-half-plane roots**. But the auxiliary polynomial has already told us
where four of the five roots are:

$$P(s) = 0 \\Rightarrow s = \\pm j\\sqrt{2}, \\quad s = \\pm j2$$

Dividing out $s^{4} + 6s^{2} + 8$ leaves $s + 2$, so the fifth root is at −2.
The system is **marginally stable**: it will oscillate forever at two
frequencies at once, 1.4142 and 2 rad/s.

![A pole map of the fifth-order polynomial whose Routh array produces a full row of zeros. Four roots sit exactly on the imaginary axis at plus and minus j1.414 and plus and minus j2, supplied by the auxiliary polynomial, and the fifth root sits at minus 2 on the real axis. The array reports zero sign changes even though the system is not asymptotically stable.](/courses/fe-ee/figures/ctl2-aux-roots.svg)

### Worked Example 7.4 — A Row of Zeros That Is Not Marginal

It is tempting to read "row of zeros" as "oscillates". That is wrong, and this
example is the counterexample worth carrying.

$D(s) = s^{5} + 3s^{4} + 6s^{3} + 18s^{2} + 25s + 75$, whose six coefficients
are all present and positive.

| Row | Col 1 | Col 2 | Col 3 |
|---|---|---|---|
| $s^{5}$ | 1 | 6 | 25 |
| $s^{4}$ | 3 | 18 | 75 |
| $s^{3}$ | $(3\\times 6 - 1\\times 18)/3 = 0$ | $(3\\times 25 - 1\\times 75)/3 = 0$ | 0 |

Another full row of zeros. The auxiliary polynomial is

$$P(s) = 3s^{4} + 18s^{2} + 75 = 3(s^{2} - 2s + 5)(s^{2} + 2s + 5)$$

$$dP/ds = 12s^{3} + 36s$$

Continuing: the $s^{2}$ row is $(12 \\times 18 - 3 \\times 36)/12 = 9$ beside
$(12 \\times 75)/12 = 75$; the $s^{1}$ entry is
$(9 \\times 36 - 12 \\times 75)/9 = -64$; the $s^{0}$ entry is 75.

First column: 1, 3, 12, 9, −64, 75 → **two sign changes, two right-half-plane
roots**. And indeed the symmetric quadruplet supplied by the auxiliary
polynomial is $\\pm 1 \\pm j2$: two of those four roots sit in the right half
plane, and the fifth root is at −3.

| Case | What the auxiliary polynomial contains | Verdict |
|---|---|---|
| Example 7.3 | two imaginary pairs, $\\pm j1.414$ and $\\pm j2$ | marginally stable |
| Example 7.4 | a quadruplet $\\pm 1 \\pm j2$ | unstable, two RHP roots |
| Section 4.1 at K = 10 | one imaginary pair, $\\pm j1$ | marginally stable, the design boundary |

A row of zeros announces symmetry about the origin, and nothing more. Whether
that symmetry lands on the axis or straddles it has to be settled by solving
the auxiliary polynomial — which is a quadratic in $s^{2}$ and takes about
thirty seconds.

## 7.3 The Decision Procedure, Corrected

1. Any coefficient missing or of the wrong sign → not asymptotically stable.
   Stop, unless the question wants a frequency.
2. Build the array. If a first-column entry is zero **but its row has other
   non-zero entries**, use ε.
3. If an **entire row** is zero, form the auxiliary polynomial from the row
   above, differentiate it, and substitute its coefficients.
4. Count first-column sign changes; that is the right-half-plane root count.
5. If step 3 was needed, solve the auxiliary polynomial as well. Zero sign
   changes plus an auxiliary polynomial with axis roots means **marginal**, not
   stable.`,
      examTip: 'Distinguish the two special cases before repairing either. A lone zero in the first column with live entries beside it takes ε; an entire row of zeros takes the auxiliary polynomial and its derivative. Using ε on a full row of zeros produces division by zero on the next line and hides the symmetric roots that are the actual answer.',
      importantNote: 'Zero sign changes means zero roots in the OPEN right half plane. It does not mean stable. If the array needed an auxiliary polynomial, solve it: roots on the imaginary axis make the system marginally stable, and a symmetric quadruplet can put two roots in the right half plane while the first column stays positive throughout the rows above it.',
    },
    {
      id: 'stab-gain-windows',
      title: '8. Gain Windows Solved as Inequalities',
      content: `## 8.1 The Method in Five Lines

1. Form the characteristic polynomial as the denominator of the loop transfer
   function plus its numerator, keeping K symbolic.
2. Build the array; entries become rational functions of K.
3. Write down every first-column entry, not only the ones that look
   interesting.
4. Require each to be positive and solve the resulting inequalities.
5. Intersect the solution sets. The intersection is the answer; the tightest
   inequality is the one that binds.

Step three is where marks are lost, and Section 8.3 shows exactly how.

### Worked Example 8.1 — A Quartic With a Compensator Zero

A unity-feedback loop has

$$G(s)H(s) = K(s + 1.25)/[s(s+1)(s+2)(s+3)]$$

Find the range of K for stability, and the frequency at which the loop
oscillates at the boundary.

The plant denominator multiplies out to
$s^{4} + 6s^{3} + 11s^{2} + 6s$, so adding the numerator gives

$$D(s) = s^{4} + 6s^{3} + 11s^{2} + (6 + K)s + 1.25K$$

| Row | Column 1 | Column 2 | Column 3 |
|---|---|---|---|
| $s^{4}$ | 1 | 11 | $1.25K$ |
| $s^{3}$ | 6 | $6 + K$ | 0 |
| $s^{2}$ | $10 - K/6$ | $1.25K$ | 0 |
| $s^{1}$ | $(K - 24)(K + 15)/(K - 60)$ | 0 | 0 |
| $s^{0}$ | $1.25K$ | 0 | 0 |

Take the entries in turn. The $s^{4}$ and $s^{3}$ entries are unconditional.
The $s^{2}$ entry requires $K < 60$. The $s^{0}$ entry requires $K > 0$. The
$s^{1}$ entry is the interesting one; multiplying out the algebra that produced
it, positivity requires

$$360 + 9K - K^{2} > 0 \\Rightarrow K^{2} - 9K - 360 < 0$$

$$K < [9 + \\sqrt{81 + 1440}]/2$$

with $81 + 1440 = 1521$ and $\\sqrt{1521} = 39$, so $9 + 39 = 48$ and
$48/2 = 24$. Intersecting, the stable window is **0 < K < 24** — the
$s^{1}$ row binds and the $s^{2}$ row never gets a chance to.

![The two gain-dependent Routh first-column entries plotted against loop gain K. The s-to-the-one entry starts positive, peaks near 7, and crosses zero at K equal to 24. The s-squared entry, 10 minus K over 6, falls linearly and crosses zero only at K equal to 60. The shaded stable window is the interval from 0 to 24, where both are still positive.](/courses/fe-ee/figures/ctl2-routh-first-column.svg)

**At the boundary.** Set K = 24 and the $s^{1}$ row vanishes, which is the
row-of-zeros case again. The auxiliary polynomial comes from the $s^{2}$ row,
whose entries at K = 24 are $10 - 4 = 6$ and $1.25 \\times 24 = 30$:

$$P(s) = 6s^{2} + 30 = 0 \\Rightarrow s = \\pm j\\sqrt{5} = \\pm j2.2361$$

so the loop rings at 2.2361 rad/s, a period of 2.8099 s. Factoring the quartic
at K = 24 confirms it exactly:

$$s^{4} + 6s^{3} + 11s^{2} + 30s + 30 = (s^{2} + 5)(s^{2} + 6s + 6)$$

and the remaining roots are $-3 \\pm \\sqrt{3}$, that is −1.2679 and −4.7321,
both comfortably in the left half plane.

![Three closed-loop step responses either side of the Routh boundary. At K equal to 20 the ringing decays; at K equal to 24 it neither grows nor decays and has a period of 2.810 seconds; at K equal to 28 it grows without limit. All three settle around a DC value of 1.](/courses/fe-ee/figures/ctl2-critical-gain-response.svg)

### Worked Example 8.2 — Why Every Entry Must Be Checked

Continue the same loop past K = 60 and something instructive happens. At
K = 70 the entries are

$$10 - K/6 = 10 - 11.667 = -1.667$$

$$(K - 24)(K + 15)/(K - 60) = 46 \\times 85 = 3910, \\ \\text{then}\\ 3910/10 = 391$$

$$1.25K = 87.5$$

so the first column reads 1, 6, −1.667, 391, 87.5. The $s^{1}$ entry has come
back positive — a candidate who checked only that row would declare the loop
stable again. It is not: the first column changes sign twice, and root finding
puts two poles at $0.57501 \\pm j3.38960$.

The general lesson is that **positivity of one first-column entry is not
positivity of the column**, and the entries do not vary monotonically. Write
them all down and test them all.

![Right-half-plane pole count against gain for the same quartic, computed twice. One curve counts Routh first-column sign changes; the other counts roots found numerically. The two coincide everywhere, both stepping from zero to two at K equal to 24 and staying at two thereafter.](/courses/fe-ee/figures/ctl2-rhp-count.svg)

### Worked Example 8.3 — Two Parameters, a Region Instead of an Interval

Keep the plant but let the compensator zero move: $GH = K(s+z)/[s(s+1)(s+2)(s+3)]$.
For which pairs (K, z) is the loop stable?

The array is unchanged in structure; only the numbers shift. The binding
inequality becomes

$$(6 + K)(60 - K) - 36Kz > 0 \\Rightarrow K^{2} + (36z - 54)K - 360 < 0$$

which is a quadratic in K opening upwards with a negative constant term, so it
has one positive root and one negative root and the window is one-sided:

$$0 < K < K_{\\max}(z), \\qquad K_{\\max} = [(54 - 36z) + \\sqrt{(36z - 54)^{2} + 1440}]/2$$

Three points on that curve, each a clean arithmetic exercise:

| z | $36z - 54$ | Discriminant | $K_{\\max}$ |
|---|---|---|---|
| 0.5 | −36 | $1296 + 1440 = 2736$ | $36 + 52.3068 = 88.3068$, then $88.3068/2 = 44.153$ |
| 1.25 | −9 | $81 + 1440 = 1521$ | $9 + 39 = 48$, then $48/2 = 24$ |
| 2.5 | 36 | $1296 + 1440 = 2736$ | $52.3068 - 36 = 16.3068$, then $16.3068/2 = 8.153$ |

![Critical gain plotted against compensator zero location for a fourth-order loop. The curve falls steeply from about 53 at a zero of 0.2 to roughly 3 at a zero of 5, passing through 44.15 at z equal to 0.5, exactly 24 at z equal to 1.25, and 8.153 at z equal to 2.5. Every point beneath the curve is a stable design.](/courses/fe-ee/figures/ctl2-stability-region.svg)

Pulling the zero in towards the origin buys gain: moving it from 2.5 to 0.5
raises the usable gain by a factor of 5.4. That is the whole idea behind lead
compensation, arrived at here without drawing a single root locus.

### Worked Example 8.4 — A Cubic Window, Confirmed From the Frequency Domain

$G(s)H(s) = K/[s(s+2)(s+5)]$. Find the critical gain and the oscillation
frequency, then confirm both by a completely different method.

$$D(s) = s^{3} + 7s^{2} + 10s + K$$

The cubic condition is $7 \\times 10 > K$, so the window is **0 < K < 70**. At
K = 70 the auxiliary polynomial from the $s^{2}$ row is
$7s^{2} + 70 = 0$, giving $s = \\pm j\\sqrt{10} = \\pm j3.1623$. Factoring
confirms $s^{3} + 7s^{2} + 10s + 70 = (s^{2} + 10)(s + 7)$.

**The independent confirmation.** A loop oscillates when its open-loop phase
reaches −180 degrees with unit magnitude. The phase of this loop is

$$\\angle L(j\\omega ) = -90^{\\circ} - \\arctan(\\omega /2) - \\arctan(\\omega /5)$$

which reaches −180 degrees when the two arctangents sum to 90 degrees, and that
happens exactly when the product of their arguments is one:

$$(\\omega /2)(\\omega /5) = 1 \\Rightarrow \\omega ^{2} = 10 \\Rightarrow \\omega = 3.1623\\ \\mathrm{rad/s}$$

the same frequency the auxiliary polynomial gave. The magnitude there is

$$\\lvert L(j\\omega )\\rvert = K/[\\sqrt{10}\\sqrt{14}\\sqrt{35}] = K/70$$

so the loop reaches unit magnitude at exactly $K = 70$, the same critical gain
the array gave. Two methods that share no algebra agree to the digit, which is
about as strong a check as an exam answer can carry.`,
      examTip: 'Write the characteristic polynomial first and keep K symbolic throughout; substituting numbers early forces you to redo the array for every trial value. Then list EVERY first-column entry before solving anything — the binding constraint is often not the last row, and an entry that is positive at one gain can be positive again at a much larger one while the column has already changed sign twice.',
      importantNote: 'At the critical gain a first-column entry hits zero and the row vanishes. That is not a failure of the method; it is where the answer to "at what frequency does it oscillate?" lives. Form the auxiliary polynomial from the row immediately above and solve it — the result is exactly the frequency at which the open-loop phase passes −180 degrees.',
    },
    {
      id: 'stab-relative-margins',
      title: '9. Relative Stability: Gain Margin, Phase Margin and the Sigma Shift',
      content: `## 9.1 Two Ways to Ask "How Stable?"

The Routh test answers a yes-or-no question. Design needs a quantity, and there
are two standard ones, measured in different domains.

**In the s-plane**, relative stability means distance from the imaginary axis.
The test is the shift of Section 4.3: substitute $s = z - \\sigma$ and run the
ordinary array on the polynomial in z. Everything to the left of $-\\sigma$ in
s maps to the left half of the z-plane.

**In the frequency domain**, relative stability means how much the loop gain or
the loop phase may change before the critical point is reached.

$$\\text{gain margin} = 1/\\lvert L(j\\omega _{pc})\\rvert \\quad \\text{where}\\ \\angle L(j\\omega _{pc}) = -180^{\\circ}$$

$$\\text{phase margin} = 180^{\\circ} + \\angle L(j\\omega _{gc}) \\quad \\text{where}\\ \\lvert L(j\\omega _{gc})\\rvert = 1$$

These are not a separate subject from Routh; they are the same information read
at a different angle. The gain margin of a loop is precisely the factor by
which K may be multiplied before it reaches the critical value the array
computes. The next example makes that identity exact.

### Worked Example 9.1 — The Gain Margin Is the Routh Window

Take $L(s) = 4/[s(s+1)(s+2)(s+3)]$, the loop of Section 4.1 operating at
K = 4, where the Routh window was 0 < K < 10.

The phase crossover comes first:

$$\\angle L(j\\omega ) = -90^{\\circ} - \\arctan \\omega - \\arctan(\\omega /2) - \\arctan(\\omega /3)$$

At $\\omega = 1$ the three arctangents are 45, 26.565 and 18.435 degrees, and
they sum to exactly 90 degrees, so the phase is exactly −180 degrees. The
identity behind that is worth seeing, because it makes the crossover frequency
exact rather than numerical. Writing $A = \\arctan(1/2)$ and
$B = \\arctan(1/3)$, the tangent addition formula gives

$$\\tan(A + B) = (1/2 + 1/3)/(1 - 1/6) = (5/6)/(5/6) = 1$$

so $A + B = 45^{\\circ}$, and adding the 45 degrees from $\\arctan 1$ brings the
total to 90. Hence $\\omega _{pc} = 1$ rad/s exactly.

The magnitude there is

$$\\lvert L(j1)\\rvert = 4/[1 \\cdot \\sqrt{2}\\cdot \\sqrt{5}\\cdot \\sqrt{10}] = 4/10 = 0.4$$

so the gain margin is $1/0.4 = 2.5$, which is 7.9588 dB. Multiply the operating
gain by the margin: $4 \\times 2.5 = 10$, exactly the critical gain the Routh
array produced. The two methods are computing the same number.

### Worked Example 9.2 — Phase Margin and Delay Margin

For the same loop, gain crossover requires

$$4 = \\omega \\sqrt{\\omega ^{2}+1}\\sqrt{\\omega ^{2}+4}\\sqrt{\\omega ^{2}+9}$$

which has no closed-form solution and is solved numerically at
$\\omega _{gc} = 0.55299$ rad/s. The phase there is −144.842 degrees, so

$$\\mathrm{PM} = 180^{\\circ} - 144.842^{\\circ} = 35.158^{\\circ}$$

A phase margin converts directly into a tolerable transport delay, because a
delay of $t_{d}$ seconds subtracts $\\omega t_{d}$ radians of phase at every
frequency. Setting that equal to the margin at crossover,

$$t_{d,\\max} = \\mathrm{PM}\\ [\\mathrm{rad}]/\\omega _{gc} = 0.61362/0.55299 = 1.10964\\ \\mathrm{s}$$

More than 1.11 seconds of dead time anywhere in this loop — a network hop, a
sampling period, a slow sensor — and it goes unstable at unchanged gain. Delay
margin is the single most useful number in the whole topic for anyone building
a digital control loop, and it never appears in the Routh array at all.

![Two stacked panels for the loop 4 over s times (s+1)(s+2)(s+3). The magnitude crosses 0 decibels at 0.5530 radians per second and is at minus 7.96 decibels where the phase reaches minus 180 degrees, which happens at exactly 1 radian per second. The gain margin is therefore 7.96 decibels, a factor of 2.5, and the phase margin measured at gain crossover is 35.16 degrees.](/courses/fe-ee/figures/ctl2-margins-bode.svg)

### Worked Example 9.3 — Where the Damping Rule of Thumb Fails

A widely quoted shortcut estimates closed-loop damping from phase margin as
$\\zeta \\approx \\mathrm{PM}/100$ with PM in degrees. Applied here it predicts
$\\zeta \\approx 0.35158$. What is the true value?

The closed-loop poles at K = 4 are $-2.80115 \\pm j0.66558$ and
$-0.19885 \\pm j0.66558$. The dominant pair is the second, and

$$\\zeta = 0.198846/0.694650 = 0.28625$$

The rule overestimates by 23 per cent. The reason is worth knowing: the
approximation is derived for a second-order loop with one dominant pair, and
this loop has two pairs whose imaginary parts are identical, so the faster pair
is not negligible. Use the rule for a sanity check, never for a specification.

## 9.2 Testing a Decay Rate With the Shift

### Worked Example 9.4 — Do All Poles Decay Faster Than a Given Rate?

$D(s) = s^{3} + 9s^{2} + 26s + 24$. Do all its roots lie to the left of −1?
Of −2?

Substitute $s = z - 1$ and expand:

$$D(z-1) = z^{3} + 6z^{2} + 11z + 6$$

All four coefficients are positive, and the cubic test gives
$6 \\times 11 = 66$ against $1 \\times 6 = 6$, so every root of the shifted
polynomial is in the left half of the z-plane: **yes**, every pole decays at
least as fast as $e^{-t}$.

Push the boundary to −2:

$$D(z-2) = z^{3} + 3z^{2} + 2z$$

The constant term has collapsed to zero, which flags a root exactly on the
shifted axis. That is correct rather than a failure of the method: the
polynomial factors as $(s+2)(s+3)(s+4)$ and the root at −2 sits precisely on
the boundary being tested. The test detects the marginal case cleanly, and the
answer to "strictly left of −2" is no.

| Boundary $\\sigma$ | Shifted polynomial | Verdict |
|---|---|---|
| 1 | $z^{3} + 6z^{2} + 11z + 6$ | all roots left of −1 |
| 1.5 | $z^{3} + 4.5z^{2} + 5.75z + 1.875$ | all roots left of −1.5 |
| 2 | $z^{3} + 3z^{2} + 2z$ | one root exactly at −2 |
| 2.5 | $z^{3} + 1.5z^{2} - 0.25z - 0.375$ | fails at once: negative coefficients |

The last row shows the shift's most useful property. Once σ passes a real root,
the shifted polynomial acquires a negative coefficient and the necessary
condition rejects it in a single glance — no array needed.

## 9.3 What Each Method Can and Cannot Tell You

| Question | Routh array | Shifted array | Gain and phase margins |
|---|---|---|---|
| Is it stable? | yes | yes | yes |
| How many unstable poles? | yes | yes | not directly |
| For what gains is it stable? | yes, as an inequality | yes | yes, as a margin |
| At what frequency does it oscillate? | yes, via the auxiliary polynomial | no | yes, at phase crossover |
| Do all modes decay faster than a rate? | no | yes | no |
| How much delay can it tolerate? | no | no | yes |
| Where exactly are the poles? | no | no | no |

The final row deserves emphasis. None of these methods locates a pole. The
Routh test counts sides of a line; the shifted test counts sides of a
different line; the margins measure distance from a point in the frequency
plane. If a question asks where the poles are, the answer requires factoring
the polynomial or drawing a root locus, and no amount of array arithmetic will
substitute.`,
      examTip: 'Gain margin and the Routh critical gain are the same fact twice. If a loop operating at K has a gain margin of M, its critical gain is K times M — so a question that gives you one is silently giving you the other, and the arithmetic is a single multiplication.',
      importantNote: 'Phase margin converts to delay margin by dividing the margin in RADIANS by the gain-crossover frequency. Converting degrees to radians is the step people skip: 35.158 degrees is 0.61362 radians, and dividing by 0.55299 rad/s gives 1.1096 s. Using degrees directly would give 63.6 s, off by a factor of 57.',
    },
    {
      id: 'stab-problem-sets',
      title: '10. Problem Sets',
      content: `## 10.1 How to Use These

Build every array by hand before reading the solution, and count the sign
changes before checking the answer. Each solution names the distractor and
states the wrong number it produces, because half the value of practice is
learning to recognise your own likely mistake in a list of four options.

### Problem Set 10A — Arrays and Root Counts

**A1.** How many right-half-plane roots does
$D(s) = s^{4} + 2s^{3} + 3s^{2} + 6s + 5$ have?

*Solution.* All five coefficients are positive, so build the array. Row three
is $(2\\times 3 - 1\\times 6)/2 = 0$ beside $(2\\times 5 - 1\\times 0)/2 = 5$: a
lone zero with a live neighbour, so the ε case applies. The next entry is
$6 - 10/\\varepsilon$, which runs to minus infinity, and the last is 5. The
first column reads 1, 2, ε, −∞, 5 — **two sign changes, two right-half-plane
roots**, at $0.30024 \\pm j1.62481$.

*The trap.* Reading five positive coefficients as a verdict and answering zero.
The coefficient test can only ever reject, never confirm, above second order.

**A2.** Is $D(s) = s^{3} + 2s^{2} + 4s + 20$ stable?

*Solution.* Positive coefficients, so apply the cubic condition:
$2 \\times 4 = 8$ against $1 \\times 20 = 20$. Since 8 is less than 20 the test
fails. The array gives an $s^{1}$ entry of
$(2\\times 4 - 1\\times 20)/2 = -6$, so the first column is 1, 2, −6, 20 —
**two sign changes, two right-half-plane roots** at
$0.47316 \\pm j2.56208$.

*The trap.* Checking only that all four coefficients are positive and answering
"stable". For a cubic the product test is not optional.

**A3.** Classify $D(s) = s^{4} + 2s^{3} + 6s^{2} + 8s + 8$.

*Solution.* The $s^{2}$ row is $(2\\times 6 - 1\\times 8)/2 = 2$ beside
$(2\\times 8 - 1\\times 0)/2 = 8$. The $s^{1}$ row is then
$(2\\times 8 - 2\\times 8)/2 = 0$ beside 0 — a **full row of zeros**. The
auxiliary polynomial from the $s^{2}$ row is $P(s) = 2s^{2} + 8$, with
derivative $4s$. Continuing, the $s^{1}$ entry is 4 and the $s^{0}$ entry is
$(4\\times 8 - 2\\times 0)/4 = 8$. First column: 1, 2, 2, 4, 8 — no sign
changes. But $P(s) = 0$ gives $s = \\pm j2$, so the system is **marginally
stable**, oscillating at 2 rad/s with a period of 3.1416 s. Factoring confirms
$D(s) = (s^{2}+4)(s^{2}+2s+2)$, the other roots being $-1 \\pm j1$.

*The trap.* Reporting "stable" from the sign-change count. Zero right-half-plane
roots and asymptotic stability are different claims, and the row of zeros is the
signal that they have parted company.

**A4.** How many right-half-plane roots does
$D(s) = s^{5} + 2s^{4} + 3s^{3} + 6s^{2} + 2s + 1$ have?

*Solution.* The $s^{3}$ row is $(2\\times 3 - 1\\times 6)/2 = 0$ beside
$(2\\times 2 - 1\\times 1)/2 = 1.5$: the ε case. The $s^{2}$ entry becomes
$6 - 3/\\varepsilon$, negative in the limit; the rows below return to positive.
First column: 1, 2, ε, −∞, 1.5, 1 → **two sign changes, two right-half-plane
roots**, at $0.09589 \\pm j1.61985$.

*The trap.* Setting ε to zero rather than taking the limit, which produces
division by zero and tempts a candidate into declaring the array unbuildable
and the answer indeterminate.

### Problem Set 10B — Gain Windows and Critical Frequencies

**B1.** A unity-feedback loop has $G(s)H(s) = K/[s(s+1)(s+4)]$. Find the stable
range of K and the frequency of oscillation at the upper limit.

*Solution.* The characteristic polynomial is
$D(s) = s^{3} + 5s^{2} + 4s + K$. The cubic condition gives
$5 \\times 4 = 20 > K$, so the window is **0 < K < 20**. At K = 20 the
auxiliary polynomial from the $s^{2}$ row is $5s^{2} + 20 = 0$, giving
$s = \\pm j2$: oscillation at **2 rad/s**. Factoring confirms
$s^{3} + 5s^{2} + 4s + 20 = (s + 5)(s^{2} + 4)$.

*The trap.* Using $s(s+1)(s+4)$ as the characteristic polynomial and never
adding K, which produces the open-loop poles 0, −1, −4 and the conclusion that
the loop is unstable for every K.

**B2.** $G(s)H(s) = K(s+2)/[s(s-1)(s+8)]$. Find the stable range of K.

*Solution.* The plant denominator is $s^{3} + 7s^{2} - 8s$, so

$$D(s) = s^{3} + 7s^{2} + (K - 8)s + 2K$$

The coefficient test already requires $K > 8$. The array's $s^{1}$ entry is
$[7(K-8) - 2K]/7 = (5K - 56)/7$, which is positive only for
**K > 11.2** — stricter than the coefficient test, so it binds. At K = 11.2 the
auxiliary polynomial is $7s^{2} + 22.4 = 0$, giving
$s = \\pm j1.78885$, and the factorisation is
$(s+7)(s^{2} + 3.2)$.

*The trap.* Assuming every window has the form 0 < K < K_max and answering
0 < K < 11.2. The open-loop pole at +1 reverses the inequality: this loop needs
**more** gain, not less, and turning the knob down destabilises it.

**B3.** Do all roots of $D(s) = s^{3} + 9s^{2} + 26s + 24$ lie to the left of
−1.5? Of −2.5?

*Solution.* Substituting $s = z - 1.5$ gives
$z^{3} + 4.5z^{2} + 5.75z + 1.875$, all coefficients positive, with
$4.5 \\times 5.75 = 25.875$ against $1 \\times 1.875 = 1.875$ — the test
passes, so **yes** for −1.5. Substituting $s = z - 2.5$ gives
$z^{3} + 1.5z^{2} - 0.25z - 0.375$, which has two negative coefficients, so
**no** for −2.5. The roots are −2, −3 and −4, so the boundary that fails is the
one that has passed the slowest root.

*The trap.* Running the full array on the second shifted polynomial and
misreading the sign changes. A negative coefficient ends the question
immediately.

**B4.** A loop $L(s) = 6/[s(s+1)(s+2)(s+3)]$ has its phase crossover at 1 rad/s.
Find the gain margin in absolute terms and in decibels, and the critical gain.

*Solution.* The magnitude at 1 rad/s is
$6/[1 \\cdot \\sqrt{2}\\cdot \\sqrt{5}\\cdot \\sqrt{10}] = 6/10 = 0.6$, so the
gain margin is $1/0.6 = 1.6667$, which is 4.437 dB. The critical gain is
$6 \\times 1.6667 = 10$, matching the Routh window 0 < K < 10 for this plant.

*The trap.* Subtracting rather than dividing and reporting a margin of
$10 - 6 = 4$. Gain margin is a ratio; only in decibels is it a difference.

### Practice Problems 10C — Stability Speed Drills

Sixty seconds each.

**C1.** Is $s^{3} + 4s^{2} + 5s + 20$ stable?

*Solution.* $4 \\times 5 = 20$ and $1 \\times 20 = 20$, so the products are
**equal**, not greater. That is the boundary: the roots are −4 and
$\\pm j\\sqrt{5} = \\pm j2.2361$, and the system is marginally stable.
*The trap.* Reading "bc is at least ad" as sufficient and answering stable.

**C2.** How many right-half-plane roots does
$s^{4} + 3s^{3} + 2s^{2} + s + 7$ have?

*Solution.* $s^{2}$ row: $(3\\times 2 - 1\\times 1)/3 = 1.6667$ beside
$(3\\times 7 - 1\\times 0)/3 = 7$. $s^{1}$ row:
$(1.6667\\times 1 - 3\\times 7)/1.6667 = -11.6$. First column
1, 3, 1.6667, −11.6, 7 → **two**.
*The trap.* Positive coefficients read as stability again.

**C3.** Describe the behaviour of a system whose characteristic polynomial is
$s^{2} + 9$.

*Solution.* The $s^{1}$ coefficient is missing, so the system is not
asymptotically stable. The roots are $\\pm j3$: a sustained oscillation at
**3 rad/s**, bounded but never decaying.
*The trap.* Reporting exponential growth. A missing coefficient rules out
asymptotic stability but does not imply divergence.

**C4.** How many right-half-plane roots does $s^{3} - 2s^{2} + 3s + 6$ have?

*Solution.* A negative coefficient guarantees at least one, but the question
asks how many, so build the array: the $s^{1}$ entry is
$(-2\\times 3 - 1\\times 6)/(-2) = 6$ and the $s^{0}$ entry is 6. First column
1, −2, 6, 6 → **two sign changes, two roots**, at
$1.5 \\pm j1.93649$.
*The trap.* Stopping at "unstable" and guessing one, which is the most common
wrong choice because a single negative coefficient suggests a single bad root.

**C5.** A loop is critical at K = 10 and is running at K = 2.5. What is its
gain margin?

*Solution.* $10/2.5 = 4$, which is 12.041 dB.
*The trap.* Subtracting to get 7.5, or inverting to get 0.25. A gain margin
greater than one is the amount of headroom; a margin below one means the loop
is already unstable.

## 10.2 A Two-Minute Self-Check

| Task | Target time |
|---|---|
| Reject a polynomial on its coefficients | 10 s |
| Apply the cubic product test $a_{2}a_{1} > a_{3}a_{0}$ | 15 s |
| Build a quartic array to five rows | 90 s |
| Recognise which special case a stalled row is | 10 s |
| Get the oscillation frequency from an auxiliary polynomial | 45 s |
| Solve a one-parameter gain window and intersect the inequalities | 150 s |
| Convert a gain margin into a critical gain, or back | 10 s |`,
      examTip: 'When the answer choices for a "how many unstable poles" question are 0, 1, 2 and 3, remember that complex roots arrive in conjugate pairs. An odd count therefore requires a real right-half-plane root, which a polynomial with all-positive coefficients cannot have. That single observation eliminates two options before any arithmetic.',
      importantNote: 'Three different pieces of information come out of the same array: the sign-change count gives the number of unstable poles, a vanished row gives the oscillation frequency through its auxiliary polynomial, and the symbolic first column gives the gain window. Decide which one the question wants before starting, because building the array for the wrong one wastes two or three minutes.',
    },
  ],
  keyTakeaways: [
    'First column sign changes = number of RHP (unstable) poles; all positive = stable.',
    'Necessary condition: all polynomial coefficients must be positive (same sign).',
    '2nd order: all coefficients positive. 3rd order: all positive AND bc > ad.',
    'Zero in first column with live neighbours: replace with small ε and take the limit.',
    'Entire zero row: use auxiliary polynomial derivative to continue.',
    'Design: express Routh entries in terms of K, set all > 0, solve inequalities.',
    'Zero sign changes means no OPEN right-half-plane roots, which is not the same as stable — check the auxiliary polynomial for axis roots.',
    'A row of zeros means roots symmetric about the origin; they may be on the axis (marginal) or straddle it (unstable).',
    'BIBO stability, asymptotic stability and internal stability differ; a pole-zero cancellation across an unstable pole hides a mode that no test on T(s) can see.',
    'A gain margin M at operating gain K means the Routh critical gain is K·M; the two methods compute the same number.',
    'Substituting s = z − σ turns the ordinary array into a test of whether every mode decays faster than exp(−σt).',
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
| **Constant K** | 20·log₁₀(K) dB (flat line) | $0^\\circ$ (if $K > 0$) or $-180^\\circ$ (if $K < 0$) |
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

With P-only control, setting the denominator of the closed-loop transfer
function to zero gives:

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

For OS = 0.10: $\\ln(0.10) = -2.30259$, so

$$\\zeta = 2.30259/\\sqrt{9.86960 + 5.30190} = 2.30259/3.89506 = 0.59116$$

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

Where

$$b_1 = \\frac{a_{n-1}a_{n-2} - a_{n}a_{n-3}}{a_{n-1}}, \\qquad b_2 = \\frac{a_{n-1}a_{n-4} - a_{n}a_{n-5}}{a_{n-1}}$$
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
