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

**$T(s) = \\sum (P_k \\cdot \\Delta _k) / \\Delta$**

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

$$T(s) = (1/\\Delta)\\sum _k P_{k}\\Delta _k$$

$$\\Delta = 1 - \\sum _i L_{i} + \\sum _{i,j} L_{i}L_{j} - \\sum _{i,j,k} L_{i}L_{j}L_{k} + \\cdots$$

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

$$y(t) = \\sum _i r_{i}e^{p_{i}t} + (\\text{terms forced by the input})$$

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

$$\\sigma _a = (\\sum \\mathrm{poles} - \\sum \\mathrm{zeros})/(n-m) = (0 - 2 - 4)/3 = -2$$

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
    {
      id: 'rl-conditions-derived',
      title: '5. Two Conditions, and Every Rule Derived From Them',
      content: `## 5.1 One Complex Equation Splits Into Two Real Ones

Sections 1 through 4 used the eight rules. This section shows where they come
from, because a rule you can rebuild in twenty seconds is a rule you cannot
misremember under exam pressure.

Write the loop transfer function as a gain multiplying a ratio of monic
polynomials:

$$L(s) = K\\,\\frac{N(s)}{D(s)}, \\qquad N(s) = \\prod_{j=1}^{m}(s - z_{j}), \\qquad D(s) = \\prod_{i=1}^{n}(s - p_{i})$$

The closed-loop poles are the roots of $1 + L(s) = 0$, which rearranges to

$$K\\,\\frac{N(s)}{D(s)} = -1$$

A complex number equals $-1$ precisely when its magnitude is one and its
argument is an odd multiple of $180^\\circ$. The single complex statement above
therefore carries two independent real statements inside it:

$$\\left\\lvert K\\,\\frac{N(s)}{D(s)} \\right\\rvert = 1 \\quad \\Longrightarrow \\quad K = \\frac{\\prod_{i=1}^{n}\\lvert s - p_{i}\\rvert}{\\prod_{j=1}^{m}\\lvert s - z_{j}\\rvert}$$

$$\\sum_{j=1}^{m}\\angle (s - z_{j}) \\; - \\; \\sum_{i=1}^{n}\\angle (s - p_{i}) \\; = \\; (2k+1)\\,180^\\circ$$

for any integer $k$. Notice what is missing from the second line: the gain.
**The shape of the locus is fixed by the pole and zero positions alone**, and
$K$ only decides how far along that fixed curve a closed-loop pole has
travelled. Every construction rule in Section 1 is a consequence of the angle
statement. The magnitude statement is used exactly once, at the very end, to
attach a number to a chosen point.

Geometrically the angle statement is a bookkeeping exercise you can do with a
ruler. Draw a vector from every open-loop pole and every open-loop zero to the
candidate point. Measure each vector's angle from the positive real axis. Add
the zero angles, subtract the pole angles, and ask whether the total is
$\\pm 180^\\circ$, $\\pm 540^\\circ$, and so on. The magnitude statement is the
same picture measured with the other end of the ruler: multiply the pole vector
lengths, divide by the zero vector lengths, and that is the gain.

### Worked Example 1 - Testing a Point Against Both Conditions

**Given.** $L(s) = K/[s(s+2)(s+4)]$ and the candidate point
$s_{0} = -0.6667 + j1.1547$, which Section 3 claimed sits on the locus at
$K = 224/27$.

**Find.** Whether the point satisfies the angle condition, and if so, the gain
there.

**Solution.** There are no zeros, so the angle sum is a subtraction only. Take
each pole in turn and form the vector $s_{0} - p_{i}$:

$$s_{0} - 0 = -0.6667 + j1.1547 \\quad \\Rightarrow \\quad \\angle = 180^\\circ - \\arctan\\!\\left(\\frac{1.1547}{0.6667}\\right) = 120.0000^\\circ$$

$$s_{0} + 2 = 1.3333 + j1.1547 \\quad \\Rightarrow \\quad \\angle = \\arctan\\!\\left(\\frac{1.1547}{1.3333}\\right) = 40.8934^\\circ$$

$$s_{0} + 4 = 3.3333 + j1.1547 \\quad \\Rightarrow \\quad \\angle = \\arctan\\!\\left(\\frac{1.1547}{3.3333}\\right) = 19.1066^\\circ$$

Summing and negating,

$$\\angle L(s_{0}) = -(120.0000 + 40.8934 + 19.1066)^\\circ = -180.0000^\\circ$$

which is an odd multiple of $180^\\circ$, so the point is on the locus. Now the
lengths:

$$\\lvert s_{0}\\rvert = 1.333333, \\qquad \\lvert s_{0}+2\\rvert = 1.763834, \\qquad \\lvert s_{0}+4\\rvert = 3.527668$$

$$K = 1.333333 \\times 1.763834 \\times 3.527668 = 8.2963$$

**Check.** Solving $s^{3} + 6s^{2} + 8s + 8.2963 = 0$ numerically returns
$-0.6667 \\pm j1.1547$ and $-4.6667$. The gain found from three ruler
measurements reproduces the root of a cubic exactly, which is the point of the
whole method.

![Root locus of K over s times s plus two times s plus four with the three vectors drawn from the open-loop poles to the design point at minus zero point six six six seven plus j one point one five four seven. Their angles of one hundred twenty, forty point eight nine three four and nineteen point one zero six six degrees add to exactly one hundred eighty, and their lengths of one point three three three three, one point seven six three eight and three point five two seven seven multiply to the gain of eight point two nine six three.](/courses/fe-ee/figures/ctl3-angle-condition.svg)

## 5.2 Why There Are n Branches, and Where They Begin and End

Clear the denominator in $1 + L(s) = 0$:

$$D(s) + K\\,N(s) = 0$$

With $n > m$ the leading term is $s^{n}$ regardless of $K$, so this is a
polynomial of degree exactly $n$ for every finite gain. A degree-$n$ polynomial
has $n$ roots, and those roots move continuously as a coefficient is varied.
**That single sentence is rule 1**: there are $n$ branches, one per root, and
each is an unbroken curve.

Set $K = 0$ and the equation collapses to $D(s) = 0$, whose roots are the
open-loop poles. **That is the first half of rule 2.** For the other half,
divide through by $K$ and let the gain grow without bound:

$$\\frac{D(s)}{K} + N(s) = 0 \\quad \\xrightarrow{\\;K \\to \\infty\\;} \\quad N(s) = 0$$

So $m$ of the branches converge on the open-loop zeros. The remaining $n - m$
have nowhere finite to go. Their escape rate follows from the magnitude
condition: for large $\\lvert s\\rvert$ the ratio behaves as
$\\lvert L\\rvert \\approx K/\\lvert s\\rvert^{\\,n-m}$, and setting that equal to
one gives

$$\\lvert s\\rvert \\approx K^{1/(n-m)}$$

A loop with three excess poles pushes its runaway roots outward only as the
cube root of the gain, which is why the last decade of gain on such a plant
buys so little extra speed.

## 5.3 Why the Real-Axis Rule Counts Only to the Right

Put a test point $\\sigma$ on the real axis and look at what each singularity
contributes to the angle sum.

A **real** pole or zero at $-a$ contributes the angle of the vector
$\\sigma + a$, which is a real number. If $-a$ lies to the left of $\\sigma$ the
vector points right and the angle is $0^\\circ$. If $-a$ lies to the right the
vector points left and the angle is $180^\\circ$. Nothing else is possible.

A **complex conjugate pair** at $-\\alpha \\pm j\\beta$ contributes two angles
that are exact negatives of one another, because the two vectors
$\\sigma + \\alpha \\mp j\\beta$ are complex conjugates:

$$\\angle (\\sigma + \\alpha - j\\beta) + \\angle (\\sigma + \\alpha + j\\beta) = -\\theta + \\theta = 0^\\circ$$

Complex pairs are invisible to the real-axis test. So the total angle at
$\\sigma$ is $180^\\circ$ multiplied by the number of real singularities strictly
to the right of it, and the angle condition is met exactly when that count is
odd. **That is rule 3, proved in five lines**, and the proof explains the part
students most often get wrong: complex poles are counted for the branch count
and the centroid but must be ignored when shading the axis.

### Worked Example 2 - Real-Axis Segments With a Zero in Play

**Given.** $L(s) = K(s+4)/[s(s+1)(s+2)(s+10)]$.

**Find.** Which parts of the real axis belong to the locus.

**Solution.** The real singularities, ordered from the right, are the pole at
$0$, the pole at $-1$, the pole at $-2$, the zero at $-4$, and the pole at
$-10$. Walk leftwards, incrementing the count as each is passed:

| Interval on the real axis | Singularities to the right | Count | On the locus? |
|---|---|---|---|
| $\\sigma > 0$ | none | 0 | no |
| $-1 < \\sigma < 0$ | pole at 0 | 1 | yes |
| $-2 < \\sigma < -1$ | poles at 0, $-1$ | 2 | no |
| $-4 < \\sigma < -2$ | poles at 0, $-1$, $-2$ | 3 | yes |
| $-10 < \\sigma < -4$ | those three plus the zero at $-4$ | 4 | no |
| $\\sigma < -10$ | all five | 5 | yes |

**Answer.** The segments $[-1, 0]$ and $[-4, -2]$, plus the ray
$(-\\infty, -10]$.

**The trap.** Counting to the left instead of to the right produces the exact
complement of this answer, and because the complement is also a plausible-looking
set of alternating segments it does not announce itself as wrong. The
tie-breaker is the pole at the origin: the segment immediately left of a single
pole at $0$ is always on the locus, so if your shading leaves it out, you
counted the wrong way.

## 5.4 Where the Asymptotes Come From

The $n - m$ escaping branches must satisfy the angle condition at large
$\\lvert s\\rvert$, so start by finding what $L(s)$ looks like out there. Expand
both monic polynomials, keeping two terms:

$$D(s) = s^{n} - \\left(\\sum_{i} p_{i}\\right)s^{\\,n-1} + \\cdots, \\qquad N(s) = s^{m} - \\left(\\sum_{j} z_{j}\\right)s^{\\,m-1} + \\cdots$$

$$\\frac{D(s)}{N(s)} = s^{\\,n-m}\\left[1 - \\frac{\\sum_{i} p_{i} - \\sum_{j} z_{j}}{s} + \\cdots\\right]$$

Now compare that with a single pole of multiplicity $n - m$ parked at some
real point $\\sigma_{a}$:

$$(s - \\sigma_{a})^{\\,n-m} = s^{\\,n-m}\\left[1 - \\frac{(n-m)\\,\\sigma_{a}}{s} + \\cdots\\right]$$

The two expansions agree to this order provided

$$(n-m)\\,\\sigma_{a} = \\sum_{i} p_{i} - \\sum_{j} z_{j} \\qquad \\Longrightarrow \\qquad \\sigma_{a} = \\frac{\\sum_{i} p_{i} - \\sum_{j} z_{j}}{n - m}$$

**That is rule 6, and it is not a definition but a matched asymptotic
expansion**: far from the cluster of singularities, the plant is
indistinguishable from $n - m$ coincident poles sitting at the centroid. Feed
that equivalent plant into the angle condition:

$$-(n-m)\\,\\angle (s - \\sigma_{a}) = (2k+1)180^\\circ \\qquad \\Longrightarrow \\qquad \\angle (s - \\sigma_{a}) = \\frac{(2k+1)180^\\circ}{n-m}$$

which is rule 5. Distinct angles appear only for
$k = 0, 1, \\ldots, n-m-1$; beyond that the values repeat.

### Worked Example 3 - Centroid and Asymptote Angles With Four Poles and a Zero

**Given.** The same loop as Worked Example 2,
$L(s) = K(s+4)/[s(s+1)(s+2)(s+10)]$.

**Find.** The number of escaping branches, the centroid and the asymptote
angles.

**Solution.** Here $n = 4$ and $m = 1$, so $n - m = 3$ branches escape and one
terminates on the zero at $-4$.

$$\\sum_{i} p_{i} = 0 + (-1) + (-2) + (-10) = -13, \\qquad \\sum_{j} z_{j} = -4$$

$$\\sigma_{a} = \\frac{-13 - (-4)}{3} = \\frac{-9}{3} = -3$$

$$\\theta_{a} = \\frac{(2k+1)180^\\circ}{3} = 60^\\circ,\\; 180^\\circ,\\; 300^\\circ$$

**Check by an entirely different route.** Solve
$s(s+1)(s+2)(s+10) + K(s+4) = 0$ numerically at $K = 10^{8}$. Three of the four
roots have run far from the origin; their real parts average to $-3.000$, which
is the centroid, and their angles come out at $60^\\circ$, $180^\\circ$ and
$300^\\circ$ to three decimals. No construction rule was used to produce those
numbers, only a root finder.

**The trap.** Dividing by $n$ instead of $n - m$ gives $-9/4 = -2.25$, and
forgetting to subtract the zero gives $-13/3 = -4.333$. Both are wrong, both
look reasonable, and both appear as distractors.

![Root locus of K times s plus four over s times s plus one times s plus two times s plus ten, computed from the roots of the quartic characteristic polynomial at several thousand gains, with the three asymptotes drawn from the centroid at minus three at sixty, one hundred eighty and three hundred degrees. One branch terminates on the zero at minus four and three escape along the asymptotes.](/courses/fe-ee/figures/ctl3-asymptote-centroid.svg)`,
      examTip: 'When a question asks whether a stated point lies on the locus, do not sketch anything. Add the zero angles, subtract the pole angles, and see whether the total is an odd multiple of 180 degrees. It is three arctangents and one addition, and it is exact, whereas a sketch drawn under time pressure is not.',
      importantNote: 'The angle condition contains no gain, and the magnitude condition contains no shape information. Keeping the two separate prevents the most common conceptual error in this topic: believing that raising K can move a closed-loop pole to an arbitrary point. Gain moves poles ALONG the locus only. To move the locus itself you must add or remove a pole or a zero.',
    },
    {
      id: 'rl-breakaway-crossings',
      title: '6. Breakaway Points, Axis Crossings and Departure Angles',
      content: `## 6.1 A Breakaway Point Is a Repeated Root

When two branches travelling along the real axis meet, the characteristic
polynomial momentarily has a **double root** there. Write the polynomial and
its derivative, both of which must vanish:

$$F(s) = D(s) + K\\,N(s) = 0, \\qquad F'(s) = D'(s) + K\\,N'(s) = 0$$

Solve the first for the gain, $K = -D(s)/N(s)$, and substitute into the second:

$$D'(s) - \\frac{D(s)}{N(s)}N'(s) = 0 \\qquad \\Longrightarrow \\qquad D'(s)N(s) - D(s)N'(s) = 0$$

Now differentiate the gain expression directly:

$$\\frac{dK}{ds} = -\\frac{D'(s)N(s) - D(s)N'(s)}{N(s)^{2}}$$

The numerator is the same quantity. **So $dK/ds = 0$ and "the characteristic
polynomial has a repeated root" are the same condition**, which is why rule 7
works and why it produces extra roots: the equation $D'N - DN' = 0$ knows
nothing about whether a solution happens to lie on a piece of the axis that is
actually part of the locus. Discarding the spurious solutions is not a
correction to the rule; it is the rule finishing its job.

The physical reading is worth carrying into the exam. On a real-axis segment
bounded by two poles, $K$ starts at zero at each end and is positive in
between, so it must reach a **maximum** somewhere inside: that is a breakaway.
On a segment bounded by two zeros, $K$ is infinite at each end and reaches a
**minimum** inside: that is a break-in.

### Worked Example 4 - Breakaway and Break-In on the Same Locus

**Given.** $L(s) = K(s+3)/[s(s+1)]$.

**Find.** Both real-axis collision points, the gain at each, and the shape of
the branch that joins them.

**Solution.** Real-axis segments first: to the right of $0$ the count is zero;
on $(-1, 0)$ it is one; on $(-3, -1)$ it is two; to the left of $-3$ it is
three. So $[-1, 0]$ and $(-\\infty, -3]$ belong to the locus. Two branches
start at $0$ and $-1$, collide inside $[-1, 0]$, leave the axis, and must
return to the axis on the far segment because one of them has to reach the zero
at $-3$.

Form the gain as a function of position on the axis:

$$K = -\\frac{D(s)}{N(s)} = -\\frac{s(s+1)}{s+3} = -\\frac{s^{2}+s}{s+3}$$

$$\\frac{dK}{ds} = -\\frac{(2s+1)(s+3) - (s^{2}+s)}{(s+3)^{2}} = -\\frac{s^{2}+6s+3}{(s+3)^{2}}$$

$$s^{2} + 6s + 3 = 0 \\qquad \\Longrightarrow \\qquad s = -3 \\pm \\sqrt{6} = -0.5505 \\;\\text{ and }\\; -5.4495$$

Both roots lie on genuine locus segments, so this time neither is discarded.
Back-substituting gives the gains:

$$K_{\\mathrm{away}} = -\\frac{(-0.5505)^{2} + (-0.5505)}{(-0.5505)+3} = \\frac{0.247449}{2.449490} = 0.101021$$

$$K_{\\mathrm{in}} = -\\frac{(-5.4495)^{2} + (-5.4495)}{(-5.4495)+3} = \\frac{24.247449}{2.449490} = 9.898979$$

**Two checks.** First, the product $0.101021 \\times 9.898979 = 1.0000$, which
is not a coincidence: substituting $u = s + 3$ turns the gain expression into
$K = 5 - u - 6/u$, whose stationary values are $5 \\mp 2\\sqrt{6}$; those two
numbers multiply to $25 - 24 = 1$. Second, and more
usefully, the complex portion of this locus is **exactly a circle centred on
the zero**, with radius

$$r = \\sqrt{(z - p_{1})(z - p_{2})} = \\sqrt{(-3-0)(-3+1)} = \\sqrt{6} = 2.4495$$

Sweeping the gain from $0.101021$ to $9.898979$ and solving the quadratic at
each step puts every complex root on that circle to within one part in
$10^{9}$, and the two collision points are exactly $-3 \\pm \\sqrt{6}$, the ends
of its horizontal diameter.

![Root locus of K times s plus three over s times s plus one, computed by solving the characteristic quadratic at several thousand gains. The complex branch is a circle centred on the zero at minus three with radius the square root of six, the breakaway sits at minus zero point five five zero five where the gain is zero point one zero one zero two, and the break-in sits at minus five point four four nine five where the gain is nine point eight nine eight nine eight.](/courses/fe-ee/figures/ctl3-circle-locus.svg)

## 6.2 The Axis Crossing Is the Routh Condition Wearing a Different Hat

Rule 8 says to find the imaginary-axis crossing with a Routh array, which can
feel like an unrelated technique bolted on. It is not. A branch crosses the
imaginary axis exactly when the characteristic polynomial acquires a purely
imaginary root pair, and that is precisely the situation the Routh array
detects when a whole row vanishes. The auxiliary polynomial built from the row
above the vanishing row is the factor containing that pair, so it hands you
$\\omega$ for free.

### Worked Example 5 - Crossing Gain and Frequency for a Fourth-Order Loop

**Given.** $L(s) = K/[s(s+1)(s+2)(s+3)]$.

**Find.** The gain at which the locus reaches the imaginary axis, the crossing
frequency, and where the other two closed-loop poles sit at that moment.

**Solution.** Multiply out the denominator:

$$s(s+1)(s+2)(s+3) = (s^{2}+s)(s^{2}+5s+6) = s^{4} + 6s^{3} + 11s^{2} + 6s$$

$$F(s) = s^{4} + 6s^{3} + 11s^{2} + 6s + K$$

Build the array:

| Row | Column 1 | Column 2 | Column 3 |
|---|---|---|---|
| $s^{4}$ | 1 | 11 | $K$ |
| $s^{3}$ | 6 | 6 | 0 |
| $s^{2}$ | 10 | $K$ | 0 |
| $s^{1}$ | $6 - 0.6K$ | 0 | 0 |
| $s^{0}$ | $K$ | 0 | 0 |

The $s^{2}$ entry is $(6 \\times 11 - 1 \\times 6)/6 = 10$, and the $s^{1}$ entry
is $(10 \\times 6 - 6K)/10 = 6 - 0.6K$. That last entry vanishes at

$$6 - 0.6K = 0 \\qquad \\Longrightarrow \\qquad K = 10$$

The auxiliary polynomial comes from the $s^{2}$ row:

$$10s^{2} + K = 10s^{2} + 10 = 0 \\qquad \\Longrightarrow \\qquad s = \\pm j1$$

**Check.** Factor the quartic at $K = 10$:

$$s^{4} + 6s^{3} + 11s^{2} + 6s + 10 = (s^{2}+1)(s^{2}+6s+10)$$

so the other two closed-loop poles are $-3 \\pm j1$. Sweeping the gain
numerically and watching the largest real part confirms it crosses zero at
$K = 10.0000$ and at no smaller gain, so $0 < K < 10$ is the stable window.

**The trap.** Reading the auxiliary polynomial off the wrong row. Using the
$s^{3}$ row here would give $6s^{2} + 6 = 0$, which happens to yield the same
frequency; on a plant with different coefficients it would not, and the habit
fails silently. The auxiliary polynomial always comes from the row **above**
the one that vanished.

## 6.3 Angles of Departure and Arrival

At a complex open-loop pole the branch has to leave in some definite
direction, and the angle condition fixes it. Put the test point an
infinitesimal distance $\\varepsilon$ from the pole $p_{1}$ in the direction
$\\theta_{d}$. Every other vector in the diagram is unchanged to first order,
because $\\varepsilon$ is negligible compared with the distance to any other
singularity. Only the vector from $p_{1}$ itself has changed: it now has angle
$\\theta_{d}$. Writing the angle condition for that configuration,

$$\\sum_{j}\\angle (p_{1} - z_{j}) - \\sum_{i \\neq 1}\\angle (p_{1} - p_{i}) - \\theta_{d} = (2k+1)180^\\circ$$

$$\\theta_{d} = 180^\\circ + \\sum_{j}\\angle (p_{1} - z_{j}) - \\sum_{i \\neq 1}\\angle (p_{1} - p_{i})$$

The arrival angle at a complex zero is the same argument run backwards, with
the roles of the two sums exchanged and the overall sign flipped.

### Worked Example 6 - Departure Angle From a Complex Pair

**Given.** $L(s) = K/[s(s^{2}+2s+5)]$, whose poles are at $0$ and
$-1 \\pm j2$.

**Find.** The direction in which the branch leaves $-1+j2$, and the gain at
which the locus reaches the imaginary axis.

**Solution.** There are no zeros. The two contributing vectors are drawn from
the other two poles to the departure pole:

$$\\angle (p_{1} - 0) = \\angle (-1 + j2) = 180^\\circ - \\arctan(2) = 116.5651^\\circ$$

$$\\angle (p_{1} - \\bar{p}_{1}) = \\angle (j4) = 90^\\circ$$

$$\\theta_{d} = 180^\\circ - (116.5651^\\circ + 90^\\circ) = -26.5651^\\circ$$

The branch sets off down and to the right, heading for the right half plane.

**Check by a route that uses no rule at all.** Solve $s^{3}+2s^{2}+5s+K = 0$ at
$K = 10^{-5}$ and measure the direction from $-1+j2$ to the root that moved.
It comes out at $-26.5651^\\circ$, matching to five decimals.

For the crossing, the array on $s^{3}+2s^{2}+5s+K$ gives the $s^{1}$ entry
$(10 - K)/2$, so $K = 10$, and the auxiliary polynomial $2s^{2}+10 = 0$ puts
the crossing at $\\omega = \\sqrt{5} = 2.2361$ rad/s. The third root at that gain
is at $-2$, since the roots must sum to $-2$.

**Why the departure angle is worth computing.** It is the cheapest possible
warning that a design is in trouble. A departure angle pointing into the right
half plane, as here, says the loop goes unstable at modest gain no matter how
carefully the rest of the sketch is drawn.

![Root locus of K over s times the quadratic s squared plus two s plus five, with the departure angle of minus twenty six point five six five one degrees marked by an arrow at the complex pole minus one plus j two, and the imaginary-axis crossing marked at two point two three six one radians per second where the gain reaches ten.](/courses/fe-ee/figures/ctl3-departure-angle.svg)`,
      examTip: 'For a loop of the form K over s times s plus a times s plus b, three landmarks come from one line of algebra each: the breakaway from 3s squared plus 2(a+b)s plus ab equals zero, the crossing gain from ab(a+b), and the crossing frequency from the square root of ab. Recognising the shape is faster than rebuilding the Routh array every time.',
      importantNote: 'A breakaway point found from dK/ds = 0 is only real if the gain there is positive and the point lies on a segment the real-axis rule already admitted. Both filters matter: a root of the derivative sitting on an excluded segment satisfies the algebra and violates the angle condition, so it is not a point of the locus at all.',
    },
    {
      id: 'rl-adding-singularities',
      title: '7. What Adding a Pole or a Zero Does, and Why It Matters',
      content: `## 7.1 The Centroid Is the Lever

The centroid formula derived in Section 5.4,

$$\\sigma_{a} = \\frac{\\sum_{i} p_{i} - \\sum_{j} z_{j}}{n-m}$$

is the quickest predictor of what a design change will do. Adding a pole at
$-a$ makes the numerator more negative but also increases $n - m$ by one;
adding a zero at $-b$ makes the numerator less negative and decreases $n - m$.
The direction of travel is easiest to see on a concrete plant, and the two
outcomes are opposite enough to be worth memorising as a pair.

Take the base loop $L_{0}(s) = K/[s(s+2)]$. Its characteristic equation is
$s^{2}+2s+K = 0$; the real-axis segment is $[-2, 0]$; the two branches meet at
the midpoint $-1$ and travel straight up and down forever. The real part of
every closed-loop pole is fixed at $-1$ once the branches leave the axis, so

$$\\zeta = \\frac{1}{\\sqrt{K}}, \\qquad \\omega_{n} = \\sqrt{K}$$

and no positive gain ever pushes a pole into the right half plane. This is the
best-behaved loop in the topic, and it is the baseline both experiments below
are measured against.

### Worked Example 7 - Adding a Pole

**Given.** A pole is added at $-5$, giving $L_{1}(s) = K/[s(s+2)(s+5)]$.

**Find.** The new centroid, the breakaway point, and the gain at which the loop
first goes unstable.

**Solution.** Now $n - m = 3$, so

$$\\sigma_{a} = \\frac{0 - 2 - 5}{3} = \\frac{-7}{3} = -2.3333, \\qquad \\theta_{a} = 60^\\circ,\\; 180^\\circ,\\; 300^\\circ$$

The two branches that used to run straight up now lean **rightwards** along the
$\\pm 60^\\circ$ asymptotes. Breakaway:

$$K = -(s^{3} + 7s^{2} + 10s), \\qquad \\frac{dK}{ds} = -(3s^{2} + 14s + 10) = 0$$

$$s = \\frac{-14 \\pm \\sqrt{196 - 120}}{6} = \\frac{-14 \\pm 8.717798}{6} = -0.880367 \\;\\text{ or }\\; -3.786301$$

Only $-0.880367$ lies on the segment $[-2, 0]$, so it is the breakaway, and

$$K_{\\mathrm{away}} = -[(-0.880367)^{3} + 7(-0.880367)^{2} + 10(-0.880367)] = 4.0607$$

For the crossing, the array on $s^{3} + 7s^{2} + 10s + K$ gives the $s^{1}$
entry $(70 - K)/7$, so

$$K_{\\max} = 7 \\times 10 = 70, \\qquad \\omega_{\\mathrm{cross}} = \\sqrt{10} = 3.1623\\ \\mathrm{rad/s}$$

with the third pole at $-7$. Sweeping the gain numerically, the largest real
part is negative at $K = 69.9$ and positive at $K = 70.1$, confirming the
threshold.

**The design consequence.** A loop that was unconditionally stable now has a
ceiling. Every extra pole in a loop costs $90^\\circ$ of eventual phase, and on
the locus that phase shows up as branches bending towards, and eventually
across, the imaginary axis.

### Worked Example 8 - Adding a Zero Instead

**Given.** A zero is added at $-5$, giving $L_{2}(s) = K(s+5)/[s(s+2)]$.

**Find.** The collision points, the best damping ratio the loop can reach, and
the gain that achieves it.

**Solution.** Now $n - m = 1$, so a single branch escapes, along the
$180^\\circ$ asymptote. Real-axis segments: $[-2, 0]$ and $(-\\infty, -5]$.

$$K = -\\frac{s(s+2)}{s+5}, \\qquad \\frac{dK}{ds} = -\\frac{(2s+2)(s+5) - (s^{2}+2s)}{(s+5)^{2}} = -\\frac{s^{2}+10s+10}{(s+5)^{2}}$$

$$s^{2} + 10s + 10 = 0 \\qquad \\Longrightarrow \\qquad s = -5 \\pm \\sqrt{15} = -1.1270 \\;\\text{ and }\\; -8.8730$$

Substituting $u = s+5$ into the gain expression gives $K = 8 - u - 15/u$, whose
values at $u = \\pm\\sqrt{15}$ are

$$K_{\\mathrm{away}} = 8 - 2\\sqrt{15} = 0.2540, \\qquad K_{\\mathrm{in}} = 8 + 2\\sqrt{15} = 15.7460$$

Between those gains the branch is a circle centred on the zero, radius
$\\sqrt{15} = 3.8730$. **No gain destabilises this loop**, because the entire
locus lies in the left half plane, and the numerical sweep confirms it: at
$K = 10^{6}$ the closed-loop poles are still at $-5.000$ and far out on the
negative real axis.

Because the complex branch is a circle, the worst damping the loop can reach is
set by the ray from the origin tangent to that circle:

$$\\sin\\theta_{\\max} = \\frac{\\sqrt{15}}{5} = 0.774597 \\qquad \\Longrightarrow \\qquad \\zeta_{\\min} = \\cos\\theta_{\\max} = \\frac{\\sqrt{10}}{5} = 0.6325$$

At the tangent point the distance from the origin is
$\\sqrt{25 - 15} = \\sqrt{10}$, so $\\omega_{n} = 3.1623$ rad/s and the poles are
at $-2 \\pm j\\sqrt{6} = -2 \\pm j2.4495$. The gain there is

$$K = \\frac{\\lvert s\\rvert\\,\\lvert s+2\\rvert}{\\lvert s+5\\rvert} = \\frac{3.162278 \\times 2.449490}{3.872983} = 2.0000$$

**Check.** At $K = 2$ the characteristic equation is
$s(s+2) + 2(s+5) = s^{2}+4s+10 = 0$, whose roots are $-2 \\pm j2.4495$ with
$\\zeta = 2/\\sqrt{10} = 0.6325$. Sweeping every gain between the two collision
points and taking the smallest damping the complex pair ever reaches returns
$0.63246$ at $K = 2.000$, which is the same answer found without any geometry.

![Three root loci of the same base plant K over s times s plus two, all computed from swept characteristic-polynomial roots. The baseline runs straight up and down along the line with real part minus one and is stable for every gain. Adding a pole at minus five bends the branches right so they cross the imaginary axis at three point one six two three radians per second when the gain reaches seventy. Adding a zero at minus five instead bends them left onto a circle of radius the square root of fifteen centred on the zero, and no gain destabilises that loop.](/courses/fe-ee/figures/ctl3-add-pole-vs-zero.svg)

## 7.2 The Two Experiments Side by Side

| Property | Base loop $K/[s(s+2)]$ | Pole added at $-5$ | Zero added at $-5$ |
|---|---|---|---|
| Excess poles $n-m$ | 2 | 3 | 1 |
| Centroid $\\sigma_{a}$ | $-1$ | $-2.3333$ | none finite |
| Asymptote angles | $\\pm 90^\\circ$ | $60^\\circ$, $180^\\circ$, $300^\\circ$ | $180^\\circ$ |
| Breakaway | $-1$ at $K = 1$ | $-0.8804$ at $K = 4.0607$ | $-1.1270$ at $K = 0.2540$ |
| Break-in | none | none | $-8.8730$ at $K = 15.7460$ |
| Gain ceiling | none | $K = 70$ | none |
| Best damping reachable | any, as $K \\to 0$ | any, as $K \\to 0$ | $0.6325$ at $K = 2$ once complex |
| Steady-state benefit | baseline | none | raises $K_{v}$ for the same pole positions |

Read the table as a statement about compensator design rather than as six
unrelated facts. **A zero pulls the locus left and a pole pushes it right**,
and that single sentence explains why a lead network, which contributes a zero
nearer the origin than its pole, improves damping and speed, while a lag
network, whose pole is nearer the origin than its zero, must be placed close to
the origin so its rightward push lands where the dominant poles cannot feel it.

## 7.3 What This Costs

Nothing in the table is free. The lead network's zero is a differentiator over
part of the band, so it amplifies sensor noise; the wider bandwidth it buys is
bandwidth over which noise now reaches the actuator. The lag network's
near-cancelled pole and zero leave a slow, low-amplitude mode in the response,
which shows up as a long tail that a settling-time specification measured to
2 percent may or may not tolerate. And a zero placed to cancel a plant pole
never quite does, because the plant pole is not exactly where the data sheet
says it is. Section 4 made that point with numbers; the locus makes it
visually, since the leftover pole-zero pair sits on the plot as a tiny separate
branch that begins and ends within a hair of itself.`,
      examTip: 'When a question asks what happens to stability if a pole or a zero is added, answer from the centroid before doing any algebra. Adding a pole moves the centroid right and creates or tightens a gain ceiling; adding a zero moves it left and loosens or removes one. That gets the multiple-choice answer in about ten seconds.',
      importantNote: 'The zero-added loop reaches a best damping ratio of 0.6325 and cannot do better once its branches are complex, because the circle is the whole story. A specification asking for zeta = 0.8 on that loop is unreachable by gain alone even though the loop is stable for every gain - stability and performance are separate questions, and a locus answers both only if you look at both.',
    },
    {
      id: 'rl-gain-selection',
      title: '8. Reading a Gain Off the Locus, and Confirming It',
      content: `## 8.1 A Damping Ray Is an Algebraic Constraint

A constant-damping line through the origin at angle
$\\theta = \\arccos\\zeta$ from the negative real axis is not just a drawing aid.
Requiring a closed-loop pole pair to sit on it is the same as requiring the
characteristic polynomial to contain the factor

$$s^{2} + 2\\zeta\\omega_{n}s + \\omega_{n}^{2}$$

for some unknown $\\omega_{n}$. That turns a graphical intersection into
simultaneous equations in the coefficients, and for a third-order loop the
system is small enough to solve by hand in a couple of minutes.

Write the cubic characteristic polynomial as the target pair multiplied by the
leftover real root:

$$(s^{2} + 2\\sigma s + \\omega_{n}^{2})(s + c) = s^{3} + (2\\sigma + c)s^{2} + (\\omega_{n}^{2} + 2\\sigma c)s + \\omega_{n}^{2}c$$

where $\\sigma = \\zeta\\omega_{n}$. Matching the three coefficients against the
plant's gives three equations in $\\sigma$, $c$ and $K$, and the damping
specification supplies the link $\\omega_{n} = \\sigma/\\zeta$.

### Worked Example 9 - Gain for a Damping Ratio of 0.7071

**Given.** $L(s) = K/[s(s+2)(s+4)]$, characteristic equation
$s^{3}+6s^{2}+8s+K = 0$.

**Find.** The gain that places the dominant pair at $\\zeta = 1/\\sqrt{2}$, and
the resulting pole locations.

**Solution.** At $\\zeta = 1/\\sqrt{2}$ the pair sits at $-\\sigma \\pm j\\sigma$,
so $\\omega_{n}^{2} = 2\\sigma^{2}$ and the target factorisation is

$$(s^{2} + 2\\sigma s + 2\\sigma^{2})(s + c) = s^{3} + (2\\sigma + c)s^{2} + (2\\sigma^{2} + 2\\sigma c)s + 2\\sigma^{2}c$$

Match coefficients:

$$2\\sigma + c = 6, \\qquad 2\\sigma^{2} + 2\\sigma c = 8, \\qquad 2\\sigma^{2}c = K$$

Substitute $c = 6 - 2\\sigma$ into the middle equation:

$$2\\sigma^{2} + 2\\sigma(6 - 2\\sigma) = 8 \\quad \\Longrightarrow \\quad -2\\sigma^{2} + 12\\sigma = 8 \\quad \\Longrightarrow \\quad \\sigma^{2} - 6\\sigma + 4 = 0$$

$$\\sigma = 3 \\pm \\sqrt{5} \\qquad \\Longrightarrow \\qquad \\sigma = 3 - \\sqrt{5} = 0.763932$$

taking the root that lies between the breakaway and the crossing. Then

$$c = 6 - 2(3-\\sqrt{5}) = 2\\sqrt{5} = 4.472136, \\qquad \\omega_{n} = \\sigma\\sqrt{2} = 1.080363$$

$$K = 2\\sigma^{2}c = 4\\sqrt{5}\\,(14 - 6\\sqrt{5}) = 56\\sqrt{5} - 120 = 5.2198$$

**Answer.** $K = 5.2198$ places closed-loop poles at
$-0.7639 \\pm j0.7639$ and $-4.4721$.

**Check by a completely different route.** Sweep $K$, solve the cubic at each
step, compute the damping of whichever complex pair exists, and bisect on the
gain until that damping equals $0.707107$. The bisection returns
$K = 5.21981$, with the pair at $-0.763932 \\pm j0.763932$ and the real root at
$-4.472136$. Nothing in that procedure used a construction rule, a ray or a
sketch, and it lands on the closed-form answer to five decimals.

![Root locus of K over s times s plus two times s plus four with the forty-five degree damping ray for zeta equal to zero point seven zero seven one drawn from the origin. It meets the locus at minus zero point seven six three nine plus and minus j zero point seven six three nine, where the gain is five point two one nine eight and the remaining closed-loop pole sits at minus four point four seven two one.](/courses/fe-ee/figures/ctl3-damping-ray.svg)

### Worked Example 10 - Does the Dominant Pair Actually Govern?

**Given.** The design of Worked Example 9.

**Find.** The overshoot the two-pole formula predicts, the overshoot the true
third-order loop produces, and whether the difference is acceptable.

**Solution.** For $\\zeta = 1/\\sqrt{2}$ the standard result is unusually tidy,
because $\\zeta/\\sqrt{1-\\zeta^{2}} = 1$:

$$M_{p} = 100\\,e^{-\\pi\\zeta/\\sqrt{1-\\zeta^{2}}} = 100\\,e^{-\\pi} = 4.3214\\%$$

Simulating the actual closed loop, $T(s) = 5.2198/(s^{3}+6s^{2}+8s+5.2198)$,
gives a peak of $4.1660\\%$.

**Interpretation.** The estimate is high by $0.155$ percentage points, or about
$3.6\\%$ of the value. The reason is visible in the pole ratio:

$$\\frac{4.472136}{0.763932} = 5.8541$$

The neglected pole is nearly six times farther from the imaginary axis than the
pair, comfortably past the factor of five that the dominant-pole approximation
conventionally asks for. Note also the direction of the error: the extra pole
slows the response slightly and therefore **reduces** overshoot below the
two-pole figure, so the simple formula is conservative here rather than
optimistic. That is the usual direction for an extra left-half-plane pole, but
it reverses if the loop also carries a zero near the pair, which is exactly
what made Design B in Section 4 undershoot its predicted overshoot so
dramatically.

## 8.2 The Whole Trade in One Curve

Rather than solve for one gain at a time, it is worth seeing the entire
relationship at once. Sweep $K$ over the stable range of
$s^{3}+6s^{2}+8s+K$, and at each gain record the damping ratio and natural
frequency of the complex pair:

| Loop gain $K$ | Dominant pair | $\\zeta$ | $\\omega_{n}$ (rad/s) | Comment |
|---|---|---|---|---|
| $3.0792$ | $-0.8453$ (repeated) | $1.0000$ | $0.8453$ | breakaway; the response cannot overshoot |
| $5.2198$ | $-0.7639 \\pm j0.7639$ | $0.7071$ | $1.0804$ | the classic compromise |
| $8.2963$ | $-0.6667 \\pm j1.1547$ | $0.5000$ | $1.3333$ | $16.30\\%$ predicted overshoot |
| $24.000$ | $-0.3283 \\pm j2.0937$ | $0.1549$ | $2.1193$ | badly underdamped |
| $48.000$ | $\\pm j2.8284$ | $0.0000$ | $2.8284$ | sustained oscillation |

Two things fall out of the table that a single design point hides. First,
damping and speed move in opposite directions along the locus, so **every gain
choice on this plant is a compromise, not an optimisation**. Second, the
frequency gained is modest: raising the gain from $8.2963$ to $48$, a factor of
$5.79$, lifts $\\omega_{n}$ by only $2.12$ while destroying the damping
completely, which is the $K^{1/(n-m)}$ escape law from Section 5.2 showing up
as a design limitation.

![Damping ratio and natural frequency of the dominant closed-loop pair against loop gain for K over s times s plus two times s plus four, both computed from the swept roots of the characteristic cubic. Damping falls from one at the breakaway gain of three point zero seven nine through zero point seven zero seven one at five point two one nine eight and zero point five at eight point two nine six three, reaching zero at forty-eight where the pair sits on the imaginary axis at two point eight two eight four radians per second.](/courses/fe-ee/figures/ctl3-gain-vs-damping.svg)`,
      examTip: 'The coefficient-matching method is faster than it looks and it is exact. Write the target quadratic times the unknown real root, expand, and match. For a cubic that is three equations in three unknowns and it never requires you to read anything off a sketch.',
      importantNote: 'Overshoot predicted from a dominant pair is an estimate, not a specification check. Confirm the pole ratio is at least five, and confirm no closed-loop zero sits near the pair. Either condition failing can move the true overshoot by more than ten percentage points, in either direction.',
    },
    {
      id: 'rl-problem-sets',
      title: '9. Problem Sets',
      content: `## 9.1 Problem Set A - Construction

Work each one to a number before reading the answer. Every answer names the
distractor that the most common slip produces, and the wrong value it gives.

**A1.** For $L(s) = K(s+2)/[s(s+4)(s+6)]$, find the asymptote centroid and
angles.

**A2.** For the same loop, shade the real-axis segments.

**A3.** For $L(s) = K/[s(s+4)]$, find the breakaway point and the gain there.

**A4.** For $L(s) = K/[s(s+2)(s+6)]$, find the gain and frequency at the
imaginary-axis crossing, and the third closed-loop pole at that gain.

**A5.** For $L(s) = K/[s(s^{2}+4s+13)]$, find the departure angle from
$-2+j3$ and the crossing gain.

**A6.** Does the point $s = -1 + j1$ lie on the locus of
$L(s) = K/[s(s+2)(s+4)]$? If so, at what gain?

### Answers to Problem Set A

**A1.** $n = 3$, $m = 1$, so $n - m = 2$ branches escape.

$$\\sigma_{a} = \\frac{(0 - 4 - 6) - (-2)}{2} = \\frac{-8}{2} = -4, \\qquad \\theta_{a} = \\frac{(2k+1)180^\\circ}{2} = 90^\\circ,\\; 270^\\circ$$

Solving the cubic at $K = 10^{8}$ puts the two escaping roots at real part
$-4.000$ with angles $90.02^\\circ$ and $269.98^\\circ$, confirming both numbers.
**The trap:** dividing by $n = 3$ rather than $n - m = 2$ gives
$-8/3 = -2.6667$, which is offered as a distractor and is the single most
common error on centroid questions.

**A2.** Counting real singularities to the right: on $(-2, 0)$ the count is 1,
on $(-4, -2)$ it is 2, on $(-6, -4)$ it is 3, and left of $-6$ it is 4. So the
locus occupies $[-2, 0]$ and $[-6, -4]$ and nothing else on the axis. **The
trap:** including $(-\\infty, -6]$ by habit, because that ray is on the locus
whenever the total count of singularities is odd, and here it is even.

**A3.** $K = -s(s+4) = -(s^{2}+4s)$, so $dK/ds = -(2s+4) = 0$ gives $s = -2$
and

$$K = -[(-2)^{2} + 4(-2)] = -(4 - 8) = 4$$

At $K = 4$ the characteristic polynomial is $s^{2}+4s+4 = (s+2)^{2}$, a genuine
repeated root. **The trap:** answering $K = 2$ by substituting into $s(s+4)$
without the sign, or answering $s = -4$ by taking the pole rather than the
midpoint.

**A4.** The characteristic polynomial is $s^{3} + 8s^{2} + 12s + K$. The array
gives the $s^{1}$ entry $(96 - K)/8$, so

$$K_{\\max} = 8 \\times 12 = 96, \\qquad 8s^{2} + 96 = 0 \\;\\Rightarrow\\; \\omega = \\sqrt{12} = 3.4641\\ \\mathrm{rad/s}$$

The roots sum to $-8$, so with the pair on the axis the third pole is exactly
$-8$. A numerical sweep puts the first right-half-plane root at $K = 96.0000$.
**The trap:** reading $\\omega$ from the $s^{2}$ coefficient rather than from the
auxiliary polynomial, giving $\\omega = \\sqrt{8} = 2.8284$ rad/s, which is
offered and is wrong.

**A5.** The poles are $0$ and $-2 \\pm j3$.

$$\\angle (p_{1} - 0) = 180^\\circ - \\arctan(1.5) = 123.6901^\\circ, \\qquad \\angle (p_{1} - \\bar{p}_{1}) = 90^\\circ$$

$$\\theta_{d} = 180^\\circ - (123.6901^\\circ + 90^\\circ) = -33.6901^\\circ$$

Measuring the direction the swept root moves at $K = 10^{-5}$ gives
$-33.6901^\\circ$. The crossing follows from $s^{3}+4s^{2}+13s+K$: the $s^{1}$
entry is $(52-K)/4$, so $K = 52$ and $4s^{2}+52 = 0$ puts the crossing at
$\\omega = \\sqrt{13} = 3.6056$ rad/s. **The trap:** dropping the leading
$180^\\circ$ and answering $-213.69^\\circ$, or measuring the angle to the pole
instead of from it and answering $+33.69^\\circ$.

**A6.** Test the angle condition:

$$\\angle (-1+j1) = 135^\\circ, \\qquad \\angle (1+j1) = 45^\\circ, \\qquad \\angle (3+j1) = 18.4349^\\circ$$

$$135 + 45 + 18.4349 = 198.4349^\\circ \\neq 180^\\circ$$

The sum exceeds $180^\\circ$ by $18.4349^\\circ$, so **the point is not on the
locus and no gain places a closed-loop pole there.** **The trap:** applying the
magnitude condition anyway. The product of distances is
$1.414214 \\times 1.414214 \\times 3.162278 = 6.3246$, and $6.3246$ is offered as
an answer. It is a perfectly valid arithmetic result and a completely
meaningless one, because the magnitude condition only assigns gains to points
that already satisfy the angle condition.

## 9.2 Problem Set B - Design

**B1.** For $L(s) = K/[s(s+2)(s+5)]$, find the gain that puts the dominant pair
at $\\zeta = 0.5$, the resulting pole locations, and the true overshoot.

**B2.** A plant $K/[s(s+4)]$ must meet $\\zeta = 0.6$ with
$\\omega_{n} = 5$ rad/s. Find the angle deficiency at the target, design a lead
network by cancelling the plant pole, and find the gain.

**B3.** The loop $K/[s(s+2)]$ has no gain ceiling. A pole is added at $-5$.
What is the ceiling now?

**B4.** The compensated loop of B2 is $25/[s(s+6)]$. Add a lag network with a
zero at $-0.05$ and a pole at $-0.005$. Find the velocity constant before and
after, the phase the lag costs at the design point, and where the closed-loop
poles end up.

**B5.** For the design of B1, is the dominant-pair approximation trustworthy?

### Answers to Problem Set B

**B1.** The characteristic equation is $s^{3}+7s^{2}+10s+K = 0$. With
$\\zeta = 0.5$ the pair is at $-\\sigma \\pm j\\sigma\\sqrt{3}$, so
$\\omega_{n}^{2} = 4\\sigma^{2}$ and

$$(s^{2}+2\\sigma s+4\\sigma^{2})(s+c) = s^{3} + (2\\sigma+c)s^{2} + (4\\sigma^{2}+2\\sigma c)s + 4\\sigma^{2}c$$

$$2\\sigma + c = 7, \\qquad 4\\sigma^{2} + 2\\sigma c = 10$$

Substituting $c = 7 - 2\\sigma$ gives $4\\sigma^{2} + 14\\sigma - 4\\sigma^{2} = 10$,
so $\\sigma = 5/7 = 0.714286$, $c = 39/7 = 5.571429$ and

$$K = 4\\sigma^{2}c = 4\\left(\\frac{25}{49}\\right)\\left(\\frac{39}{7}\\right) = \\frac{3900}{343} = 11.3703$$

The poles are $-0.714286 \\pm j1.237179$ and $-5.571429$, with
$\\omega_{n} = 10/7 = 1.4286$ rad/s. Bisecting on the swept damping ratio
returns $K = 11.37026$, matching the closed form. Simulating the true cubic
gives an overshoot of $15.69\\%$ against the $16.30\\%$ the two-pole formula
predicts.

**The trap:** stopping at $\\sigma$ and reporting $K = 4\\sigma^{2} = 2.04$,
forgetting the third factor $c$.

**B2.** The target poles are $s_{d} = -\\zeta\\omega_{n} \\pm j\\omega_{n}\\sqrt{1-\\zeta^{2}} = -3 \\pm j4$.

$$\\angle s_{d} = 180^\\circ - \\arctan\\!\\left(\\frac{4}{3}\\right) = 126.8699^\\circ, \\qquad \\angle (s_{d}+4) = \\arctan(4) = 75.9638^\\circ$$

$$\\phi_{\\mathrm{def}} = (126.8699 + 75.9638) - 180 = 22.8337^\\circ \\text{ of lead needed}$$

Cancel the plant pole with the compensator zero at $-4$. The zero then supplies
$+75.9638^\\circ$, which exactly offsets the plant pole's contribution, leaving

$$\\angle (s_{d} + p) = 180^\\circ - 126.8699^\\circ = 53.1301^\\circ$$

$$\\tan 53.1301^\\circ = \\frac{4}{p - 3} \\quad \\Longrightarrow \\quad p - 3 = \\frac{4}{1.333333} = 3.0000 \\quad \\Longrightarrow \\quad p = 6$$

$$K = \\lvert s_{d}\\rvert \\cdot \\lvert s_{d}+6\\rvert = 5 \\times 5 = 25$$

The compensated loop $25/[s(s+6)]$ has characteristic equation
$s^{2}+6s+25 = 0$, giving $\\omega_{n} = 5$ and $\\zeta = 6/10 = 0.6$ exactly.
**The trap:** applying the $22.8337^\\circ$ deficiency directly to the
compensator pole geometry without accounting for the cancelled plant pole,
which yields a pole near $12.5$ and a loop that misses the specification.

**B3.** With the pole added the characteristic polynomial is
$s^{3}+7s^{2}+10s+K$, and the Routh condition is $K < 7 \\times 10 = 70$. **The
trap:** answering $10$, the product of the two finite pole magnitudes, instead
of $70$, the product of that with their sum. For $K/[s(s+a)(s+b)]$ the ceiling
is always $ab(a+b)$.

**B4.** Before the lag,

$$K_{v} = \\lim_{s \\to 0} s\\,L(s) = \\frac{25}{6} = 4.1667, \\qquad e_{ss}(\\mathrm{ramp}) = \\frac{6}{25} = 0.24$$

The lag multiplies the low-frequency gain by the zero-to-pole ratio
$0.05/0.005 = 10$, so

$$K_{v} = \\frac{250}{6} = 41.6667, \\qquad e_{ss} = \\frac{6}{250} = 0.024$$

The phase it costs at $s_{d} = -3+j4$ is the difference of two nearly equal
angles:

$$\\angle (s_{d}+0.05) - \\angle (s_{d}+0.005) = 126.4088^\\circ - 126.8240^\\circ = -0.4153^\\circ$$

Solving the compensated cubic $s(s+6)(s+0.005) + 25(s+0.05) = 0$ puts the
dominant pair at $-2.9772 \\pm j3.9831$, with $\\zeta$ slipping only from
$0.6000$ to $0.5987$, plus a slow pole at $-0.0505$ that the lag zero at
$-0.05$ all but cancels. **The trap:** believing the slow pole ruins the
response. Its residue is tiny precisely because the zero sits within one part
in a hundred of it, so the tenfold accuracy improvement is essentially free.

**B5.** The third pole of B1 is at $-5.571429$ and the pair at
$-0.714286$, so

$$\\frac{5.571429}{0.714286} = 7.8000$$

That clears the conventional factor of five comfortably, and there is no
closed-loop zero anywhere, so the dominant-pair reading is trustworthy. The
simulation bears it out: $15.69\\%$ against a predicted $16.30\\%$, an error of
$0.61$ percentage points. **The trap:** assuming the approximation is safe
because the loop "looks second order" without computing the ratio. On the
otherwise similar loop $K/[s(s+2)(s+2.5)]$ the same procedure yields a third
pole far closer to the pair, and the estimate degrades badly.`,
      examTip: 'Under exam conditions the highest-yield root locus skills, in order, are: the real-axis rule, the centroid, the crossing gain for a K over s times s plus a times s plus b loop, and the magnitude condition at a stated point. Those four cover the large majority of what is asked, and each is a single line of arithmetic.',
      importantNote: 'Every answer in these sets was confirmed by solving the characteristic polynomial numerically across a gain sweep, not by reapplying the construction rule that produced it. That is the habit worth copying: when a locus landmark matters, verify it by substituting the gain back into the characteristic equation and checking that the claimed root really is a root.',
    },
  ],
  keyTakeaways: [
    'Root locus starts at open-loop poles (K = 0), ends at zeros or infinity (K → ∞).',
    'Real-axis segments: locus exists where total poles + zeros to the right is odd.',
    'Asymptote angles: (2k+1)·180°/(n−m); centroid: σ = (Σpoles − Σzeros)/(n−m).',
    'Damping ratio ζ = cos(θ) where θ is angle from negative real axis.',
    'Gain at any locus point: K = 1/|G(s₀)H(s₀)| (magnitude condition).',
    'Lead compensator pulls locus left (improves stability); lag increases low-frequency gain.',
    'Both conditions come from 1 + KL(s) = 0: the angle condition fixes the shape, the magnitude condition fixes the gain.',
    'dK/ds = 0 is the repeated-root condition; keep only roots that lie on a real-axis segment of the locus.',
    'Adding a pole moves the centroid right and creates a gain ceiling; adding a zero moves it left and can remove one.',
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
| **1 + s/a (real zero)** | 0 for ω < a; +20 dB/decade for ω > a | $0^\\circ \\to +45^\\circ$ at $\\omega = a$, then $\\to +90^\\circ$ |
| **1/(1 + s/a) (real pole)** | 0 for ω < a; −20 dB/decade for ω > a | $0^\\circ \\to -45^\\circ$ at $\\omega = a$, then $\\to -90^\\circ$ |
| **Quadratic pair** (ζ, ω_n) | 0 for ω < ω_n; −40 dB/decade for ω > ω_n | $0^\\circ \\to -90^\\circ$ at $\\omega = \\omega _n$, then $\\to -180^\\circ$ |

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

At $\\omega = 1$: $|G| = 10/1 = 10$, which is $20\\ \\mathrm{dB}$.
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

The straight-line sketch puts the crossing at ω = 10, where the low-frequency
asymptote 10/ω first reaches unity. The exact curve is already 3 dB below that
asymptote at its own corner — at ω = 10, |G| = 10/(10·√2) = 0.707, which is
−3 dB, not 0 dB — so the true crossover lies **below** 10 rad/s. Squaring the
equation and writing $u = \\omega _{gc}^{2}$ gives

$$100 = u\\left(1 + \\frac{u}{100}\\right) \\Rightarrow u^{2} + 100u - 10000 = 0 \\Rightarrow u = 50(\\sqrt{5}-1) = 61.8034$$

$$\\omega _{gc} = \\sqrt{61.8034} = 7.862\\ \\mathrm{rad/s}$$

**Phase margin**: PM = 180° + ∠G(jω_gc) = 180° − 90° − arctan(0.7862), and
arctan(0.7862) = 38.17°, so

$$PM = 180^\\circ - 90^\\circ - 38.17^\\circ = 51.83^\\circ$$

**Phase crossover frequency ω_pc** (where ∠G = −180°):

Total phase reaches −180° as ω → ∞ (asymptotically). Strictly, ω_pc = **∞**.

**Gain margin**: GM = −20·$\\log _{10}$|G(j∞)| = **$\\infty\\ \\mathrm{dB}$** (magnitude is zero at infinite frequency)

## 3.6 Step 5 — Stability Conclusion

- **$PM = 51.83^\\circ > 0^\\circ$** → Stable
- **$GM = \\infty\\ \\mathrm{dB} > 0\\ \\mathrm{dB}$** → Stable
- The system is **closed-loop stable** with good phase margin (inside the 45–60° design target)
- Expected damping ratio: ζ ≈ PM/100 ≈ 0.52 → predicted overshoot about 14.9%

The closed loop here is $T(s) = 100/(s^{2}+10s+100)$, so its true damping ratio
is exactly 0.5 and its true overshoot is 16.30%. The PM/100 shortcut lands 3.7%
high on ζ and 1.4 percentage points low on overshoot, which is the accuracy to
expect from it; Section 8 quantifies that error across the whole damping
range.`,
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

- $\\alpha = (1 - \\sin 35^\\circ)/(1 + \\sin 35^\\circ) = 0.2710$
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
| α | 0.2710 | 0.1982 |
| New crossover $\\omega _m$ | 2.636 rad/s | 2.855 rad/s |
| Zero at 1/T | 1.372 rad/s | 1.271 rad/s |
| Pole at 1/(αT) | 5.063 rad/s | 6.413 rad/s |
| Achieved PM | 41.0° | **45.4°** |
| Simulated overshoot | 30.0% | 24.6% |

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
    {
      id: 'bn-asymptotes-derived',
      title: '5. Where the Straight Lines Come From, and What They Cost',
      content: `## 5.1 The Logarithm Does the Work

A Bode plot is not a different kind of graph from any other frequency
response. It is the same complex function $L(j\\omega)$ plotted on axes chosen
so that **multiplication becomes addition**. Write a factored loop:

$$L(s) = \\frac{K\\prod_{j}(1 + s/z_{j})}{s^{q}\\prod_{i}(1 + s/p_{i})}$$

Take the magnitude, then twenty times the base-ten logarithm of both sides:

$$20\\log_{10}\\lvert L(j\\omega)\\rvert = 20\\log_{10}K + \\sum_{j}20\\log_{10}\\lvert 1 + j\\omega/z_{j}\\rvert - 20q\\log_{10}\\omega - \\sum_{i}20\\log_{10}\\lvert 1 + j\\omega/p_{i}\\rvert$$

Every factor now contributes an independent term that is simply added or
subtracted. The phase does the same thing without needing a logarithm at all,
because the argument of a product is the sum of the arguments:

$$\\angle L(j\\omega) = \\sum_{j}\\arctan\\!\\left(\\frac{\\omega}{z_{j}}\\right) - q\\,90^\\circ - \\sum_{i}\\arctan\\!\\left(\\frac{\\omega}{p_{i}}\\right)$$

**That decomposition is the entire reason Bode plots are sketchable by hand.**
A ten-factor transfer function is ten small curves stacked, and each small
curve has only two interesting regions with a hinge between them.

## 5.2 Why the Slope Is Exactly 20 dB per Decade

Take one real pole and look at what happens well above its corner. For
$\\omega \\gg a$,

$$\\left\\lvert \\frac{1}{1 + j\\omega/a} \\right\\rvert = \\frac{1}{\\sqrt{1 + (\\omega/a)^{2}}} \\;\\approx\\; \\frac{a}{\\omega}$$

$$20\\log_{10}\\lvert \\cdot \\rvert \\approx 20\\log_{10}a - 20\\log_{10}\\omega$$

That is a straight line when plotted against $\\log_{10}\\omega$, with slope
$-20$ dB per unit of $\\log_{10}\\omega$. Multiply the frequency by ten and the
term changes by

$$-20\\log_{10}(10\\omega) + 20\\log_{10}\\omega = -20\\log_{10}(10) = -20\\ \\mathrm{dB}$$

exactly, with no approximation left in that last step. **The "20" in
"20 dB per decade" is not empirical; it is the definition of the decibel
meeting the definition of a decade.** The same arithmetic on a doubling gives

$$20\\log_{10}(2) = 6.0206\\ \\mathrm{dB\\ per\\ octave}$$

so a slope quoted as 6 dB per octave and one quoted as 20 dB per decade are the
same slope, and the 6 is the rounded number of the pair.

## 5.3 How Wrong the Straight Lines Are

The asymptotic sketch replaces the exact curve with two lines meeting at the
corner. The error is the gap between them, and because it depends only on the
ratio $r = \\omega/a$ it is the same for every real pole ever drawn:

$$\\mathrm{error}(r) = \\left\\lvert -20\\log_{10}\\sqrt{1+r^{2}} - \\mathrm{asymptote}(r) \\right\\rvert$$

| $\\omega/a$ | Asymptote (dB) | Exact (dB) | Error (dB) | Exact phase |
|---|---|---|---|---|
| $0.1$ | $0$ | $-0.0432$ | $0.0432$ | $-5.7106^\\circ$ |
| $0.5$ | $0$ | $-0.9691$ | $0.9691$ | $-26.5651^\\circ$ |
| $1$ | $0$ | $-3.0103$ | $3.0103$ | $-45.0000^\\circ$ |
| $2$ | $-6.0206$ | $-6.9897$ | $0.9691$ | $-63.4349^\\circ$ |
| $10$ | $-20.0000$ | $-20.0432$ | $0.0432$ | $-84.2894^\\circ$ |

Three things in that table are worth carrying into the exam. The corner error
is $3.0103$ dB, which is the same $\\sqrt{2}$ that defines a half-power point.
The error is **symmetric about the corner** on a logarithmic axis: an octave
below and an octave above both cost $0.9691$ dB. And a decade away the error
has collapsed to $0.0432$ dB, which is invisible on any sketch, so the
asymptotes are excellent everywhere except within about one octave of a corner.

![Exact magnitude of a single real pole against its straight-line asymptotes, plotted against frequency as a multiple of the corner. The gap is three point zero one zero three decibels at the corner, zero point nine six nine one decibels an octave either side and zero point zero four three two decibels a decade either side, and the high-frequency slope is exactly twenty decibels per decade.](/courses/fe-ee/figures/ctl3-exact-vs-asymptote.svg)

### Worked Example 1 - Recovering a Transfer Function From an Asymptotic Plot

**Given.** A magnitude sketch that is flat at $20$ dB below
$\\omega = 2$ rad/s, falls at $-20$ dB/decade between $2$ and $20$ rad/s, and
falls at $-40$ dB/decade above $20$ rad/s. The phase starts at $0^\\circ$.

**Find.** $G(s)$.

**Solution.** Read the plot backwards through Section 5.1. A flat
low-frequency asymptote means no integrator, so $q = 0$. Each slope change of
$-20$ dB/decade marks one real pole at that frequency, so there are poles at
$2$ and $20$ rad/s and no zeros. The flat level fixes the DC gain:

$$20\\log_{10}K = 20\\ \\mathrm{dB} \\qquad \\Longrightarrow \\qquad K = 10$$

$$G(s) = \\frac{10}{(1 + s/2)(1 + s/20)} = \\frac{10 \\times 2 \\times 20}{(s+2)(s+20)} = \\frac{400}{(s+2)(s+20)}$$

**Check.** $G(0) = 400/40 = 10$, which is $20$ dB. Above $20$ rad/s the
magnitude falls as $400/\\omega^{2}$, a $-40$ dB/decade slope. Both features
match the sketch.

**The trap.** Writing $G(s) = 10/[(s+2)(s+20)]$ by putting the plotted gain in
front of the unnormalised factors. That transfer function has a DC value of
$10/40 = 0.25$, which is $-12.04$ dB, not $20$ dB. The normalisation
$(1 + s/p)$ rather than $(s + p)$ is the whole content of "standard Bode form",
and skipping it misplaces the entire magnitude curve by a fixed offset.

### Worked Example 2 - The Real Magnitude at a Corner

**Given.** The $G(s)$ just recovered.

**Find.** The exact magnitude at $\\omega = 2$ rad/s, and the error the
asymptotic sketch makes there.

**Solution.** Evaluate the complex expression directly:

$$\\lvert G(j2)\\rvert = \\frac{400}{\\lvert 2 + j2\\rvert \\; \\lvert 20 + j2\\rvert} = \\frac{400}{2.828427 \\times 20.099751} = 7.036418$$

$$20\\log_{10}(7.036418) = 16.9465\\ \\mathrm{dB}$$

The asymptotic sketch reads $20$ dB at that frequency, so the error is
$3.0535$ dB.

**Where the extra 0.0432 came from.** The table in Section 5.3 says a corner
costs $3.0103$ dB. The remaining $0.0432$ dB is contributed by the *other*
pole: at $\\omega = 2$ the pole at $20$ sits at $\\omega/a = 0.1$, one decade
below its own corner, and the table's first row is exactly that case. The
errors of separate factors add, because Section 5.1 showed the decibel
contributions add:

$$3.0103 + 0.0432 = 3.0535\\ \\mathrm{dB}$$

**Why this matters.** A gain margin quoted from a straight-line sketch inherits
this error directly. Three decibels is a factor of $1.41$ in allowable gain,
which is the difference between a design that survives a $40\\%$ component
tolerance and one that does not.

### Worked Example 3 - Magnitude and Phase Away From the Corners

**Given.** The same $G(s)$.

**Find.** The exact magnitude at $\\omega = 20$ and $\\omega = 200$ rad/s, and
the exact phase at $\\omega = 20$ rad/s.

**Solution.** At $\\omega = 20$ the asymptotic value is
$20 - 20\\log_{10}(20/2) = 0$ dB, and the exact value is

$$20\\log_{10}\\!\\left(\\frac{400}{\\lvert 2+j20\\rvert\\;\\lvert 20+j20\\rvert}\\right) = 20\\log_{10}\\!\\left(\\frac{400}{20.099751 \\times 28.284271}\\right) = -3.0535\\ \\mathrm{dB}$$

the same $3.0535$ dB of error as at the first corner, by symmetry of the
arrangement. At $\\omega = 200$,

$$20\\log_{10}\\!\\left(\\frac{400}{200.009999 \\times 200.997512}\\right) = -40.0436\\ \\mathrm{dB}$$

against an asymptotic $-40$ dB, so a decade past the last corner the sketch is
already good to well under a tenth of a decibel.

The phase at $\\omega = 20$ is the sum of two arctangents:

$$\\angle G(j20) = -\\arctan\\!\\left(\\frac{20}{2}\\right) - \\arctan\\!\\left(\\frac{20}{20}\\right) = -84.2894^\\circ - 45.0000^\\circ = -129.2894^\\circ$$

**Answer.** $-3.0535$ dB, $-40.0436$ dB and $-129.2894^\\circ$.`,
      examTip: 'To read a transfer function off a magnitude sketch, work from the slopes: the low-frequency slope gives the system type, every downward break of 20 dB/decade is a real pole at that frequency, every upward break is a zero, and a break of 40 dB/decade is a complex pair. Then set the gain from any one point on the low-frequency asymptote, in standard form with each factor written as 1 + s/a.',
      importantNote: 'Straight-line sketches understate the loss by up to 3.01 dB at a corner, and the errors of nearby corners add. Locate the crossover frequencies from the asymptotes, then evaluate the exact complex magnitude at those frequencies before quoting any margin. A margin quoted from asymptotes alone can be several decibels optimistic.',
    },
    {
      id: 'bn-phase-nmp-delay',
      title: '6. Phase Told Honestly: Right-Half-Plane Zeros and Time Delay',
      content: `## 6.1 The Phase Approximation Is the Cruder One

The straight-line phase rule holds the phase at $0^\\circ$ below one decade
under the corner, at $-90^\\circ$ above one decade over it, and runs a straight
$-45^\\circ$ per decade in between. Compared with the magnitude approximation
it is noticeably worse:

$$\\text{exact: } -\\arctan(\\omega/a) \\qquad \\text{versus} \\qquad \\text{line: } -45^\\circ\\left[\\log_{10}(\\omega/a) + 1\\right]$$

clipped to the range $[-90^\\circ, 0^\\circ]$. At the two break points of the
line the exact curve is $5.7106^\\circ$ away, and that is the worst it gets.
Five degrees does not sound like much until you notice that phase margins are
routinely specified to within five degrees.

![Exact phase of a real pole against the straight-line approximation that holds zero below a tenth of the corner, minus ninety above ten times it, and minus forty-five degrees per decade in between. The exact curve is minus five point seven one zero six degrees at a tenth of the corner, minus forty-five degrees exactly at the corner, and minus eighty-four point two eight nine four degrees at ten times it.](/courses/fe-ee/figures/ctl3-phase-decade.svg)

## 6.2 A Right-Half-Plane Zero Has the Gain of a Zero and the Phase of a Pole

Compare two first-order factors that differ only in a sign:

$$1 + \\frac{j\\omega}{a} \\qquad \\text{and} \\qquad 1 - \\frac{j\\omega}{a}$$

Their magnitudes are identical, both being $\\sqrt{1 + (\\omega/a)^{2}}$, so on a
magnitude plot the two are indistinguishable at every frequency. Their phases
are exact opposites:

$$\\angle\\left(1 + \\frac{j\\omega}{a}\\right) = +\\arctan\\!\\left(\\frac{\\omega}{a}\\right), \\qquad \\angle\\left(1 - \\frac{j\\omega}{a}\\right) = -\\arctan\\!\\left(\\frac{\\omega}{a}\\right)$$

A zero in the right half plane therefore lifts the magnitude the way a zero
should while dragging the phase down the way a pole would. **That combination
is the worst of both worlds for a feedback loop**, because the raised magnitude
pushes the crossover to a higher frequency at the same time as the phase lag
is deepening. It is the reason non-minimum-phase plants, which include
boost converters, flexible arms and steam-drum level, have hard bandwidth
limits that no amount of controller cleverness removes.

### Worked Example 4 - A Right-Half-Plane Zero Creates a Gain Ceiling

**Given.** The plant $1/[s(s+2)]$, which is stable for every positive gain, is
fitted first with a zero at $-1$ and then with one at $+1$:

$$L_{\\mathrm{mp}}(s) = \\frac{K(1+s)}{s(s+2)}, \\qquad L_{\\mathrm{nmp}}(s) = \\frac{K(1-s)}{s(s+2)}$$

**Find.** The stable gain range for each.

**Solution.** Form each characteristic polynomial:

$$s(s+2) + K(1+s) = s^{2} + (2+K)s + K$$

$$s(s+2) + K(1-s) = s^{2} + (2-K)s + K$$

For a quadratic, stability requires every coefficient to share a sign. The
first polynomial satisfies that for **every** $K > 0$. The second loses its
first-order coefficient at $K = 2$:

$$2 - K > 0 \\qquad \\Longrightarrow \\qquad 0 < K < 2$$

At exactly $K = 2$ the polynomial is $s^{2}+2 = 0$, so the closed loop
oscillates at

$$\\omega = \\sqrt{2} = 1.4142\\ \\mathrm{rad/s}$$

**Check.** Sweeping the gain and solving the quadratic numerically puts the
first right-half-plane root at $K = 2.00000$ for the second loop and at no
gain at all for the first, even at $K = 10^{6}$.

**Answer.** Moving a single zero across the imaginary axis converts an
unconditionally stable loop into one with a hard ceiling of $K = 2$.

### Worked Example 5 - The Margin the Sign of a Zero Costs

**Given.** The same two loops at $K = 1$.

**Find.** The gain crossover frequency and phase margin of each.

**Solution.** Since the magnitudes are identical, one calculation serves both:

$$\\lvert L(j\\omega)\\rvert = \\frac{\\sqrt{1+\\omega^{2}}}{\\omega\\sqrt{4+\\omega^{2}}} = 1 \\quad \\Longrightarrow \\quad 1 + \\omega^{2} = \\omega^{2}(4 + \\omega^{2})$$

$$\\omega^{4} + 3\\omega^{2} - 1 = 0 \\quad \\Longrightarrow \\quad \\omega^{2} = \\frac{\\sqrt{13}-3}{2} = 0.302776 \\quad \\Longrightarrow \\quad \\omega_{gc} = 0.5503\\ \\mathrm{rad/s}$$

Now the phases at that one frequency. Both loops carry $-90^\\circ$ from the
integrator and $-\\arctan(\\omega_{gc}/2) = -15.3829^\\circ$ from the pole at
$-2$. They differ only in the zero, which supplies
$\\pm\\arctan(\\omega_{gc}) = \\pm 28.8218^\\circ$:

$$\\angle L_{\\mathrm{mp}} = 28.8218^\\circ - 90^\\circ - 15.3829^\\circ = -76.5611^\\circ \\quad \\Longrightarrow \\quad PM = 103.4389^\\circ$$

$$\\angle L_{\\mathrm{nmp}} = -28.8218^\\circ - 90^\\circ - 15.3829^\\circ = -134.2047^\\circ \\quad \\Longrightarrow \\quad PM = 45.7953^\\circ$$

**Answer.** The same magnitude curve, the same crossover, and
$103.4389 - 45.7953 = 57.6436$ degrees of margin difference, which is exactly
$2\\arctan(\\omega_{gc})$ because the zero's contribution simply changes sign.

![Open-loop phase of two loops that share every magnitude value: one with a zero at minus two and one with a zero at plus two, both around an integrator and a pole at minus two. Both cross zero decibels at zero point five five zero three radians per second, where the minimum-phase loop has one hundred three point four four degrees of phase margin and the non-minimum-phase twin has only forty-five point eight zero.](/courses/fe-ee/figures/ctl3-nmp-phase.svg)

## 6.3 Time Delay Is Pure Phase

A transport lag of $T$ seconds multiplies the loop by $e^{-sT}$, whose
frequency response is

$$\\lvert e^{-j\\omega T}\\rvert = 1, \\qquad \\angle e^{-j\\omega T} = -\\omega T \\ \\mathrm{rad} = -57.2958\\,\\omega T\\ \\mathrm{degrees}$$

The magnitude plot does not move at all, so the gain crossover frequency is
untouched. The phase, however, falls **without bound and in proportion to
frequency**, not to the logarithm of frequency, so on a Bode plot it plunges
ever more steeply. That is why a delay cannot be compensated the way a pole
can: there is no finite network whose phase lead grows linearly with
frequency.

The design consequence is a one-line formula. The loop stays stable as long as
the delay's phase at the existing crossover does not exceed the phase margin:

$$\\omega_{gc}T_{\\max} = PM \\ \\mathrm{(radians)} \\qquad \\Longrightarrow \\qquad T_{\\max} = \\frac{PM \\times \\pi/180}{\\omega_{gc}}$$

This quantity is called the **delay margin**, and it is the most physically
meaningful of the three margins because it is measured in seconds and can be
compared directly against a sampling period, a network latency or a transport
time.

### Worked Example 6 - Delay Margin at Two Gains

**Given.** $L(s) = K/[s(s+1)(s+10)]$, the loop of Section 4, at $K = 40$ and
$K = 10$.

**Find.** The largest transport delay each version tolerates.

**Solution.** Section 4 established the crossovers and margins by exact
evaluation; reuse them.

At $K = 40$: $\\omega_{gc} = 1.8612$ rad/s and $PM = 17.7050^\\circ$, so

$$T_{\\max} = \\frac{0.309011}{1.861216} = 0.16603\\ \\mathrm{s} \\approx 166\\ \\mathrm{ms}$$

At $K = 10$: $\\omega_{gc} = 0.7844$ rad/s and $PM = 47.4039^\\circ$, so

$$T_{\\max} = \\frac{0.827355}{0.784408} = 1.054751\\ \\mathrm{s}$$

**Check.** Evaluate $\\lvert 1 + L(j\\omega_{gc})e^{-j\\omega_{gc}T_{\\max}}\\rvert$
at the first answer: it comes out at $7 \\times 10^{-16}$, so the delayed loop
really does have a closed-loop pole exactly on the imaginary axis at that
delay.

**Interpretation.** Dropping the gain from $40$ to $10$ multiplies the
tolerable delay by more than six, from $166$ ms to $1.05$ s. Both the smaller
crossover frequency and the larger phase margin push in the same direction,
which is why a loop closed over a network is almost always detuned rather than
compensated.

| Loop | $\\omega_{gc}$ (rad/s) | $PM$ | Delay margin | Comment |
|---|---|---|---|---|
| $40/[s(s+1)(s+10)]$ | $1.8612$ | $17.7050^\\circ$ | $166.0\\ \\mathrm{ms}$ | fast, fragile |
| $10/[s(s+1)(s+10)]$ | $0.7844$ | $47.4039^\\circ$ | $1.0548\\ \\mathrm{s}$ | slow, robust |
| $(1+s)/[s(s+2)]$ | $0.5503$ | $103.4389^\\circ$ | $3.2810\\ \\mathrm{s}$ | minimum phase |
| $(1-s)/[s(s+2)]$ | $0.5503$ | $45.7953^\\circ$ | $1.4526\\ \\mathrm{s}$ | the same gain, a worse zero |`,
      examTip: 'A time delay changes the phase curve and nothing else. So the gain crossover frequency of a delayed loop is the same as that of the undelayed one, and the whole question reduces to whether omega times T, converted to degrees, is smaller than the phase margin you already have. Remember the conversion: one radian is 57.2958 degrees.',
      importantNote: 'Magnitude data alone cannot distinguish a zero at plus a from a zero at minus a, and cannot see a time delay at all. Any identification done from a magnitude plot is therefore incomplete, and any margin computed from one is unreliable for exactly those two cases. Whenever a plant might be non-minimum phase or delayed, the phase plot is not optional.',
    },
    {
      id: 'bn-nyquist-counted',
      title: '7. The Nyquist Contour and Z = N + P, Counted Rather Than Recited',
      content: `## 7.1 What the Criterion Actually Counts

The closed-loop poles are the zeros of $1 + L(s)$, and the open-loop poles are
its poles. The argument principle from complex analysis says that if a closed
contour is traversed once clockwise in the $s$ plane, the image of $1 + L(s)$
encircles the origin

$$N = Z - P$$

times clockwise, where $Z$ is the number of zeros and $P$ the number of poles
of $1 + L(s)$ inside the contour. Choose the contour to be the **entire right
half plane**: up the imaginary axis, around a semicircle of unbounded radius,
and back down. Then $Z$ counts unstable closed-loop poles and $P$ counts
unstable open-loop poles, and rearranging gives the form used in practice:

$$Z = N + P$$

Two practical details finish the construction. First, plotting $L(s)$ rather
than $1 + L(s)$ shifts the reference point from the origin to $-1$, which is
why the criterion is stated about the critical point. Second, a pole of $L$ on
the imaginary axis, and an integrator always is one, would sit **on** the
contour, so the contour is indented around it by a small semicircle bulging
into the right half plane. That indentation keeps the pole outside, which is
why an integrator does not count towards $P$.

## 7.2 A Stable Open Loop

### Worked Example 7 - Counting Encirclements With P = 0

**Given.** $L(s) = 6/[(s+1)(s+2)(s+3)]$.

**Find.** $P$, the negative-real-axis crossing, the gain margin, $N$, and $Z$.

**Solution.** The open-loop poles are $-1$, $-2$ and $-3$, all in the left half
plane, so $P = 0$.

To find where the polar plot crosses the negative real axis, force the
denominator to be real. Expanding,

$$(j\\omega+1)(j\\omega+2)(j\\omega+3) = (6 - 6\\omega^{2}) + j(11\\omega - \\omega^{3})$$

$$11\\omega - \\omega^{3} = 0 \\qquad \\Longrightarrow \\qquad \\omega_{pc} = \\sqrt{11} = 3.3166\\ \\mathrm{rad/s}$$

At that frequency the denominator is $6 - 6(11) = -60$, so

$$L(j\\omega_{pc}) = \\frac{6}{-60} = -0.1000 \\qquad \\Longrightarrow \\qquad GM = \\frac{1}{0.1} = 10 = 20\\ \\mathrm{dB}$$

Tracing the contour and accumulating the argument of $1 + L(s)$ around it
returns a winding number of $0.00003$, that is, $N = 0$. Therefore

$$Z = N + P = 0 + 0 = 0$$

and the closed loop is stable, which the roots of
$s^{3}+6s^{2}+11s+12$ confirm directly: all three have negative real parts.

**Cross-check on the gain margin.** With gain $K$ the characteristic polynomial
is $s^{3}+6s^{2}+11s+(6+K)$, and the Routh condition is
$6 \\times 11 - 6 = 60$, so $K < 60$. Since the present gain is $6$, the
allowable multiplier is $60/6 = 10$, matching the reciprocal of the crossing to
the digit.

![Nyquist plot of six over the product of s plus one, s plus two and s plus three, with its conjugate mirror. It begins at the DC gain of one, crosses the negative real axis at minus zero point one when the frequency is the square root of eleven, and never encircles the critical point at minus one, so with no open-loop right-half-plane poles the closed loop is stable.](/courses/fe-ee/figures/ctl3-nyquist-stable.svg)

## 7.3 An Unstable Open Loop, Where Bode Reasoning Fails

When $P > 0$ the criterion demands the opposite of what intuition suggests: the
plot **must** encircle the critical point, $N = -P$ counter-clockwise
encirclements, for the closed loop to be stable. And the familiar Bode summary,
"positive margins mean stable", becomes simply untrue.

### Worked Example 8 - Counting Encirclements With P = 1

**Given.** $L(s) = K/[(s-1)(s+3)]$, at $K = 6$ and at $K = 2$.

**Find.** $P$, $N$ and $Z$ for each gain, and the stable gain range.

**Solution.** One open-loop pole sits at $+1$, so $P = 1$. Stability therefore
requires $N = -1$.

The characteristic polynomial is

$$(s-1)(s+3) + K = s^{2} + 2s + (K - 3)$$

whose coefficients all share a sign only when $K > 3$. That is the algebraic
answer; now the geometric one.

Both plots start on the negative real axis at

$$L(0) = \\frac{K}{(-1)(3)} = -\\frac{K}{3}$$

which is $-2.0000$ at $K = 6$ and $-0.6667$ at $K = 2$, and both end at the
origin. The imaginary part of $L(j\\omega)$ vanishes only at $\\omega = 0$, so
each closed curve crosses the real axis exactly there. Accumulating the
argument of $1 + L(s)$ around the traced contour gives

| Gain | Start of the plot | $N$ counted | $P$ | $Z = N + P$ | Closed-loop roots |
|---|---|---|---|---|---|
| $K = 6$ | $-2.0000$ | $-1$ | $1$ | $0$ | $-1 \\pm j1.7321$, stable |
| $K = 2$ | $-0.6667$ | $0$ | $1$ | $1$ | $+0.4142$ and $-2.4142$ |

**Answer.** $K = 6$ is stable and $K = 2$ is not, and the stable range is
$K > 3$, which is where the starting point $-K/3$ moves to the left of $-1$ so
the curve can enclose it.

**Why this example is worth the effort.** At $K = 2$ the largest value of
$\\lvert L(j\\omega)\\rvert$ anywhere is $2/3 = 0.6667$, which never reaches
unity. There is **no gain crossover frequency at all**, so a Bode reading
reports an infinite phase margin, and the loop is unstable with a closed-loop
pole at $+0.4142$. Margins are a shortcut that assumes $P = 0$; when the plant
is open-loop unstable, only the encirclement count is trustworthy.

![Nyquist plots of K over the product of s minus one and s plus three at two gains, with conjugate mirrors. At a gain of six the curve starts at minus two and wraps the critical point once counter-clockwise, so with one open-loop right-half-plane pole the closed loop is stable. At a gain of two it starts at minus zero point six six six seven, stops short of the critical point, and leaves one closed-loop pole at plus zero point four one four two.](/courses/fe-ee/figures/ctl3-nyquist-unstable.svg)

## 7.4 Reading the Two Margins Off the Polar Plot

Everything Section 2 defined on the Bode axes has a picture on the Nyquist
plane, and the picture makes the relationship between the margins obvious.

| Quantity | On the Bode plot | On the Nyquist plot |
|---|---|---|
| Gain crossover $\\omega_{gc}$ | where the magnitude curve meets $0$ dB | where the curve meets the unit circle |
| Phase crossover $\\omega_{pc}$ | where the phase curve meets $-180^\\circ$ | where the curve meets the negative real axis |
| Gain margin | $-20\\log_{10}\\lvert L(j\\omega_{pc})\\rvert$ | reciprocal of the distance from the origin to that crossing |
| Phase margin | $180^\\circ + \\angle L(j\\omega_{gc})$ | angle from the negative real axis up to the unit-circle crossing |
| Delay margin | $PM$ divided by $\\omega_{gc}$ | arc along the unit circle, divided by $\\omega_{gc}$ |
| Stability | both margins positive, if $P = 0$ | $N = -P$, always |

The last row is the one worth remembering. The Bode criterion is a convenience
that happens to be right for the minimum-phase, open-loop-stable case, which is
most of what the exam asks about. The Nyquist criterion is the actual theorem.`,
      examTip: 'For an open-loop-stable plant, the fast question to ask is whether the Nyquist curve passes to the right of minus one on its way in. If it does, the closed loop is stable and the gain margin is the reciprocal of that crossing. For an open-loop-unstable plant, count encirclements and nothing else.',
      importantNote: 'A pole at the origin does not count towards P. The contour is indented around it into the right half plane, which leaves it outside the enclosed region. Counting an integrator as an unstable open-loop pole is a common error and it flips the stability verdict on almost every type-1 loop.',
    },
    {
      id: 'bn-bandwidth-crossover',
      title: '8. Closed-Loop Bandwidth, Resonant Peak and the Crossover',
      content: `## 8.1 Three Frequencies, One Damping Ratio

Open-loop crossover, closed-loop bandwidth and resonant peak are three
different measurements on the same second-order system, and all three are fixed
by $\\zeta$ once $\\omega_{n}$ sets the scale. Take the standard loop

$$L(s) = \\frac{\\omega_{n}^{2}}{s(s + 2\\zeta\\omega_{n})} \\qquad \\Longrightarrow \\qquad T(s) = \\frac{\\omega_{n}^{2}}{s^{2} + 2\\zeta\\omega_{n}s + \\omega_{n}^{2}}$$

**Gain crossover.** Set $\\lvert L(j\\omega)\\rvert = 1$ and let
$x = (\\omega/\\omega_{n})^{2}$:

$$\\omega_{n}^{4} = \\omega^{2}\\left(\\omega^{2} + 4\\zeta^{2}\\omega_{n}^{2}\\right) \\quad \\Longrightarrow \\quad x^{2} + 4\\zeta^{2}x - 1 = 0$$

$$\\omega_{gc} = \\omega_{n}\\sqrt{\\sqrt{1 + 4\\zeta^{4}} - 2\\zeta^{2}}$$

**Phase margin.** The phase at that frequency is
$-90^\\circ - \\arctan[\\omega_{gc}/(2\\zeta\\omega_{n})]$, so

$$PM = 90^\\circ - \\arctan\\!\\left(\\frac{\\omega_{gc}}{2\\zeta\\omega_{n}}\\right) = \\arctan\\!\\left(\\frac{2\\zeta}{\\sqrt{\\sqrt{1+4\\zeta^{4}} - 2\\zeta^{2}}}\\right)$$

**Bandwidth.** Set $\\lvert T(j\\omega)\\rvert = 1/\\sqrt{2}$ and solve:

$$\\omega_{b} = \\omega_{n}\\sqrt{1 - 2\\zeta^{2} + \\sqrt{4\\zeta^{4} - 4\\zeta^{2} + 2}}$$

**Resonant peak.** Differentiate $\\lvert T\\rvert$ and set the derivative to
zero. For $\\zeta < 1/\\sqrt{2}$ a maximum exists at

$$\\omega_{r} = \\omega_{n}\\sqrt{1 - 2\\zeta^{2}}, \\qquad M_{r} = \\frac{1}{2\\zeta\\sqrt{1 - \\zeta^{2}}}$$

and for $\\zeta \\geq 1/\\sqrt{2}$ the magnitude falls monotonically and there is
no peak at all.

| $\\zeta$ | $\\omega_{gc}/\\omega_{n}$ | $PM$ | $100\\zeta$ rule | $\\omega_{b}/\\omega_{n}$ | $M_{r}$ | $M_{r}$ (dB) | $\\omega_{r}/\\omega_{n}$ |
|---|---|---|---|---|---|---|---|
| $0.3$ | $0.9144$ | $33.2725^\\circ$ | $30^\\circ$ | $1.4537$ | $1.7472$ | $4.8467$ | $0.9055$ |
| $0.5$ | $0.7862$ | $51.8273^\\circ$ | $50^\\circ$ | $1.2720$ | $1.1547$ | $1.2494$ | $0.7071$ |
| $0.6$ | $0.7157$ | $59.1873^\\circ$ | $60^\\circ$ | $1.1482$ | $1.0417$ | $0.3546$ | $0.5292$ |
| $0.7071$ | $0.6436$ | $65.5298^\\circ$ | $70.71^\\circ$ | $1.0000$ | none | none | none |

![Closed-loop magnitude of a standard second-order system at damping ratios of zero point three, zero point five and zero point seven zero seven one, plotted against frequency as a multiple of the natural frequency. The minus three decibel bandwidths are one point four five three seven, one point two seven two zero and one point zero zero zero zero times the natural frequency, and the resonant peaks are four point eight five decibels, one point two five decibels and none at all.](/courses/fe-ee/figures/ctl3-bandwidth-peak.svg)

### Worked Example 9 - Bandwidth of the Section 3 Loop

**Given.** $G(s) = 100/[s(s+10)]$ in unity feedback, so
$T(s) = 100/(s^{2}+10s+100)$.

**Find.** $\\omega_{n}$, $\\zeta$, the open-loop crossover, the closed-loop
bandwidth, the resonant peak and the ratio between bandwidth and crossover.

**Solution.** Matching the closed-loop denominator to the standard form,

$$\\omega_{n}^{2} = 100 \\Rightarrow \\omega_{n} = 10\\ \\mathrm{rad/s}, \\qquad 2\\zeta\\omega_{n} = 10 \\Rightarrow \\zeta = 0.5$$

Reading the $\\zeta = 0.5$ row of the table and multiplying by $\\omega_{n}$:

$$\\omega_{gc} = 0.7862 \\times 10 = 7.862\\ \\mathrm{rad/s}, \\qquad \\omega_{b} = 1.2720 \\times 10 = 12.720\\ \\mathrm{rad/s}$$

$$M_{r} = 1.1547 \\;(1.2494\\ \\mathrm{dB}) \\quad \\text{at} \\quad \\omega_{r} = 0.7071 \\times 10 = 7.071\\ \\mathrm{rad/s}$$

**Check.** Solving $\\lvert T(j\\omega)\\rvert = 1/\\sqrt{2}$ numerically gives
$12.720196$ rad/s, and scanning $\\lvert T\\rvert$ over a dense grid finds a peak
of $1.154701$ at $7.0711$ rad/s. Both match the closed forms.

**The ratio.** Dividing,

$$\\frac{\\omega_{b}}{\\omega_{gc}} = \\frac{12.720196}{7.861514} = 1.6180$$

Bandwidth exceeds crossover by about $60\\%$ at this damping, and by the table
the factor runs from $1.59$ at $\\zeta = 0.3$ to $1.55$ at $\\zeta = 0.7071$. So
the working rule **"closed-loop bandwidth is roughly one and a half times the
open-loop crossover"** is good across the whole useful damping range, which is
what makes $\\omega_{gc}$ a usable proxy for speed of response even though it is
an open-loop measurement.

### Worked Example 10 - How Far the PM Rule of Thumb Can Be Trusted

**Given.** The approximation $\\zeta \\approx PM/100$ used in Section 2.

**Find.** Its error across the damping range, and its effect on a predicted
overshoot.

**Solution.** Compare the exact expression from Section 8.1 against
$100\\zeta$ over $0 < \\zeta \\leq 1$. The two agree at small damping, cross near
$\\zeta = 0.574$, and diverge sharply after that. The largest gap below
$\\zeta = 0.6$ is $3.3289^\\circ$, at $\\zeta = 0.3353$; by $\\zeta = 1$ the rule is
$23.65^\\circ$ high.

Now the practical consequence. The loop of Worked Example 9 has an exact phase
margin of $51.8273^\\circ$, so the rule estimates

$$\\zeta \\approx \\frac{51.8273}{100} = 0.5183$$

against a true value of exactly $0.5$. Feeding both into the overshoot formula:

$$M_{p}(\\text{estimated}) = 100\\,e^{-\\pi(0.5183)/\\sqrt{1-0.5183^{2}}} = 14.90\\%$$

$$M_{p}(\\text{true}) = 100\\,e^{-\\pi(0.5)/\\sqrt{1-0.5^{2}}} = 16.30\\%$$

**Answer.** A $3.7\\%$ error in $\\zeta$ becomes a $1.4$ percentage-point error
in overshoot, and in the optimistic direction. That is acceptable for choosing
between design options and not acceptable as evidence that a specification has
been met.

![Exact phase margin against closed-loop damping ratio for a standard second-order loop, with the phase margin equals one hundred zeta rule drawn beside it. The two agree to within three point three three degrees below a damping ratio of zero point six, cross near zero point five eight, and separate by more than twenty three degrees by a damping ratio of one.](/courses/fe-ee/figures/ctl3-margin-vs-zeta.svg)

## 8.2 Why the Crossover Is the Design Variable

Pulling the three sections together gives the reason frequency-domain design is
organised around $\\omega_{gc}$ rather than around anything measured on a step
response.

- **Speed** is set by the crossover, through $\\omega_{b} \\approx 1.6\\omega_{gc}$
  and the rise-time relation $t_{r} \\approx 2.2/\\omega_{b}$ for a well-damped
  loop.
- **Damping** is set by the phase margin at that crossover, through the exact
  relation of Section 8.1 or the $100\\zeta$ shortcut.
- **Accuracy** is set by the low-frequency gain, well below the crossover,
  where the error constants live.
- **Noise rejection and robustness** are set by the high-frequency roll-off,
  well above the crossover.

Four requirements, four separate regions of one plot, each adjustable with
comparatively little interference from the others. That separation is what the
root locus cannot offer, and it is the reason both methods are taught: the
locus shows where the poles go, and the Bode plot shows which knob to turn.`,
      examTip: 'Memorise the zeta = 0.5 column: crossover 0.786 times omega-n, phase margin 51.8 degrees, bandwidth 1.272 times omega-n, resonant peak 1.155 or 1.25 dB at 0.707 times omega-n. It is the most frequently used damping ratio in the topic and having one column exact lets you sanity-check any approximation on the spot.',
      importantNote: 'Bandwidth is a closed-loop measurement and crossover is an open-loop one. They differ by about a factor of 1.6, so quoting one where the other is wanted is a 60 percent error in speed of response. Read the wording of the question carefully: "the frequency at which the magnitude falls 3 dB" is the bandwidth, and "the frequency at which the magnitude is 0 dB" is the crossover.',
    },
    {
      id: 'bn-problem-sets',
      title: '9. Problem Sets',
      content: `## 9.1 Problem Set A - Plots and Margins

**A1.** A magnitude sketch falls at $-20$ dB/decade from the lowest
frequencies, passes through $0$ dB at $\\omega = 5$ rad/s, and steepens to
$-40$ dB/decade above $\\omega = 20$ rad/s. Identify $G(s)$.

**A2.** For $L(s) = 50/[s(s+1)(s+5)]$, find the phase crossover frequency, the
gain margin in dB, and whether the closed loop is stable.

**A3.** Reduce the gain of that loop to $K = 15$. Find the gain crossover
frequency, both margins, and the delay margin.

**A4.** For $L(s) = 40/[s(s+1)(s+10)]$, find the delay margin.

**A5.** For $G(s) = 400/[(s+2)(s+20)]$, find the asymptotic and exact
magnitudes at $\\omega = 4$ rad/s, and account for the difference.

### Answers to Problem Set A

**A1.** A $-20$ dB/decade slope at the lowest frequencies means one integrator,
so $q = 1$ and there are no finite poles below $20$ rad/s. Below the corner the
magnitude is $K/\\omega$, which is unity at $\\omega = 5$, so $K = 5$ and

$$G(s) = \\frac{5}{s(1 + s/20)} = \\frac{100}{s(s+20)}$$

**Check.** The exact crossover is slightly below the asymptotic one because the
pole at $20$ has already begun to bite:
$\\lvert G(j5)\\rvert = 100/103.077641 = 0.97014$, which is $-0.26$ dB, and
solving $\\lvert G\\rvert = 1$ exactly gives $\\omega_{gc} = 4.8587$ rad/s.
**The trap:** reading the $0$ dB crossing as a corner frequency and answering
$100/[s(s+5)]$. That transfer function does cross $0$ dB near $5$ rad/s, but it
breaks to $-40$ dB/decade there rather than at $20$, so it contradicts the rest
of the sketch.

**A2.** For a loop with an integrator and two real poles at $a$ and $b$ the
phase crossover is at $\\omega_{pc} = \\sqrt{ab}$, so

$$\\omega_{pc} = \\sqrt{1 \\times 5} = 2.2361\\ \\mathrm{rad/s}$$

$$\\lvert L(j\\omega_{pc})\\rvert = \\frac{50}{2.236068 \\times 2.449490 \\times 5.477226} = \\frac{50}{30.0000} = 1.6667$$

$$GM = \\frac{1}{1.6667} = 0.6 \\qquad \\Longrightarrow \\qquad GM_{\\mathrm{dB}} = 20\\log_{10}(0.6) = -4.4370\\ \\mathrm{dB}$$

A **negative** gain margin means the loop is already unstable. Routh on
$s^{3}+6s^{2}+5s+K$ gives the ceiling $K < 30$, and the present gain of $50$
exceeds it; solving the cubic confirms two right-half-plane roots. **The trap:**
reporting $+4.44$ dB by taking the magnitude of the decibel figure. The sign is
the entire answer to the stability part of the question.

**A3.** At $K = 15$ the magnitude curve drops by $20\\log_{10}(50/15) = 10.46$
dB but the phase curve does not move, so $\\omega_{pc}$ is still
$2.2361$ rad/s and

$$GM = \\frac{30}{15} = 2 \\qquad \\Longrightarrow \\qquad GM_{\\mathrm{dB}} = 20\\log_{10}(2) = 6.0206\\ \\mathrm{dB}$$

Solving $\\lvert L(j\\omega)\\rvert = 1$ exactly gives
$\\omega_{gc} = 1.5519$ rad/s, and there

$$PM = 180^\\circ - 90^\\circ - 57.2038^\\circ - 17.2435^\\circ = 15.5527^\\circ$$

$$T_{\\max} = \\frac{0.271446}{1.551922} = 0.174910\\ \\mathrm{s}$$

Simulating the closed-loop step response gives $64.16\\%$ overshoot, which is
what a $15.55^\\circ$ margin buys. **The trap:** assuming that a $6$ dB gain
margin implies a healthy phase margin. The two are independent readings taken
at different frequencies, and this loop has a comfortable one and a dreadful
one at the same time.

**A4.** From Section 6.3, with $\\omega_{gc} = 1.8612$ rad/s and
$PM = 17.7050^\\circ$,

$$T_{\\max} = \\frac{17.7050 \\times \\pi/180}{1.861216} = \\frac{0.309011}{1.861216} = 0.16603\\ \\mathrm{s}$$

**The trap:** dividing the phase margin in **degrees** by the crossover
frequency, which gives $9.51$ and is not a time at all. The formula requires
radians, because $\\omega T$ is a phase in radians by construction.

**A5.** The asymptotic value at $\\omega = 4$ is the $20$ dB plateau reduced by
one octave of $-20$ dB/decade slope past the corner at $2$:

$$20 - 20\\log_{10}(2) = 20 - 6.0206 = 13.9794\\ \\mathrm{dB}$$

The exact value is

$$20\\log_{10}\\!\\left(\\frac{400}{\\lvert 2+j4\\rvert\\;\\lvert 20+j4\\rvert}\\right) = 20\\log_{10}\\!\\left(\\frac{400}{4.472136 \\times 20.396078}\\right) = 12.8400\\ \\mathrm{dB}$$

The gap is $1.1394$ dB, and it decomposes exactly as Section 5.3 predicts: the
pole at $2$ is one octave past its corner and contributes $0.9691$ dB, while
the pole at $20$ sits at $\\omega/a = 0.2$ and contributes
$20\\log_{10}\\sqrt{1.04} = 0.1703$ dB. Adding,

$$0.9691 + 0.1703 = 1.1394\\ \\mathrm{dB}$$

**The trap:** quoting only the $0.9691$ dB from the nearer pole. Corner errors
add across all factors, and on a plant with three or four closely spaced
corners the accumulated error easily exceeds $3$ dB.

## 9.2 Problem Set B - Nyquist and the Closed Loop

**B1.** For $L(s) = K/[(s+1)(s+2)(s+3)]$, find the negative-real-axis crossing
and the gain margin at $K = 6$, $K = 30$ and $K = 90$, and state stability in
each case.

**B2.** For $L(s) = K/[(s-1)(s+3)]$, find $Z$ at $K = 4$ and at $K = 2.5$ using
the criterion, and confirm by factoring.

**B3.** A design achieves $\\zeta = 0.6$ with $\\omega_{n} = 8$ rad/s. Find the
closed-loop bandwidth.

**B4.** For the same design, find the resonant peak in dB, the frequency at
which it occurs, and the exact phase margin. Compare against the $100\\zeta$
rule.

**B5.** A colleague reports that a loop has infinite phase margin because its
magnitude never reaches $0$ dB, and concludes the closed loop is stable. Under
what condition is that reasoning valid, and under what condition does it fail?

### Answers to Problem Set B

**B1.** The crossing frequency is $\\sqrt{11} = 3.3166$ rad/s regardless of
gain, because gain does not move the phase curve. The crossing value scales
directly with $K$, being $-K/60$:

| $K$ | Crossing | $GM$ (ratio) | $GM$ (dB) | Closed-loop verdict |
|---|---|---|---|---|
| $6$ | $-0.1000$ | $10.0$ | $20.00$ | stable, comfortable |
| $30$ | $-0.5000$ | $2.0$ | $6.02$ | stable, marginal |
| $90$ | $-1.5000$ | $0.667$ | $-3.52$ | unstable, two right-half-plane roots |

Factoring $s^{3}+6s^{2}+11s+96$ confirms the last row directly. **The trap:**
believing the crossing frequency shifts with gain. It does not for any loop:
$K$ multiplies the magnitude and leaves the phase untouched, which is why
$\\omega_{pc}$ and the whole shape of the polar plot are gain-independent apart
from a uniform radial scaling.

**B2.** One open-loop pole lies at $+1$, so $P = 1$ and stability needs
$N = -1$.

At $K = 4$ the plot starts at $L(0) = -4/3 = -1.3333$, to the **left** of the
critical point, so the closed curve encloses it once counter-clockwise:
$N = -1$ and $Z = -1 + 1 = 0$. Factoring $s^{2}+2s+1 = (s+1)^{2}$ gives a
repeated root at $-1$: stable.

At $K = 2.5$ the plot starts at $-2.5/3 = -0.8333$, to the **right** of the
critical point, so it fails to enclose it: $N = 0$ and $Z = 1$. Factoring
$s^{2}+2s-0.5$ gives roots at $+0.2247$ and $-2.2247$: one unstable pole, as
predicted. **The trap:** applying the "no encirclement means stable" rule that
holds only for $P = 0$. Here no encirclement means exactly one unstable
closed-loop pole.

**B3.** From Section 8.1 with $\\zeta = 0.6$:

$$\\frac{\\omega_{b}}{\\omega_{n}} = \\sqrt{1 - 2(0.36) + \\sqrt{4(0.1296) - 4(0.36) + 2}} = \\sqrt{0.28 + \\sqrt{1.0784}} = 1.1482$$

$$\\omega_{b} = 1.148242 \\times 8 = 9.1859\\ \\mathrm{rad/s}$$

Solving $\\lvert T(j\\omega)\\rvert = 1/\\sqrt{2}$ numerically for
$T(s) = 64/(s^{2}+9.6s+64)$ returns $9.1859$ rad/s. **The trap:** answering
$\\omega_{n} = 8$ rad/s, on the assumption that bandwidth and natural frequency
are the same thing. They coincide only at $\\zeta = 0.7071$.

**B4.** Since $0.6 < 1/\\sqrt{2}$ a peak exists:

$$M_{r} = \\frac{1}{2(0.6)\\sqrt{1 - 0.36}} = \\frac{1}{2(0.6)(0.8)} = 1.0417 \\qquad \\Longrightarrow \\qquad 20\\log_{10}(1.0417) = 0.3546\\ \\mathrm{dB}$$

$$\\omega_{r} = 8\\sqrt{1 - 2(0.36)} = 8\\sqrt{0.28} = 4.2332\\ \\mathrm{rad/s}$$

The exact phase margin from the Section 8.1 formula is $59.1873^\\circ$ against
the rule's $60^\\circ$, an error of $0.81^\\circ$, which is about as well as the
rule ever does. **The trap:** quoting the peak as a percentage overshoot. A
resonant peak of $1.0417$ is a frequency-domain amplification of $4.17\\%$; the
step-response overshoot at this damping is $9.48\\%$, a completely different
number that happens to be of similar size at moderate damping and diverges
badly at low damping.

**B5.** The reasoning is valid **only when the open loop has no
right-half-plane poles**. With $P = 0$ the criterion reads $Z = N$, a plot that
never reaches unit magnitude cannot enclose a point at distance one from the
origin, so $N = 0$ and the closed loop is stable.

With $P \\geq 1$ the same evidence proves the opposite. Stability then requires
$N = -P$, that is, the plot **must** wrap the critical point, and a plot that
stays inside the unit circle cannot possibly do so. Worked Example 8 is exactly
this case: at $K = 2$ the peak magnitude is $2/3$, the Bode reading is an
infinite phase margin, and the closed loop carries a pole at $+0.4142$. **The
trap** is not the arithmetic but the habit of treating margins as the
definition of stability rather than as a distance measured from a critical
point whose enclosure requirement depends on $P$.`,
      examTip: 'When a question gives an open-loop transfer function with a right-half-plane pole, stop reaching for margins and count encirclements. When it gives a minimum-phase, open-loop-stable plant, which is most of the time, margins are faster and give the same verdict.',
      importantNote: 'Every numerical answer in these sets was produced by evaluating the complex transfer function on a dense frequency sweep and, where stability was at stake, by accumulating the argument of 1 + L along the traced Nyquist contour - not by applying the criterion symbolically. Where a Routh array offers a second route, it was run as well, and the two agreed to the digit in every case.',
    },
  ],
  keyTakeaways: [
    'Bode magnitude in dB = 20·log₁₀|G(jω)|; each pole adds −20 dB/decade, each zero adds +20 dB/decade.',
    'Gain margin: GM = −|G(jω_pc)| dB at phase crossover (∠G = −180°).',
    'Phase margin: PM = 180° + ∠G(jω_gc) at gain crossover (|G| = 0 dB).',
    'Stability requires GM > 0 dB AND PM > 0°; typical design target PM = 45–60°.',
    'Nyquist: Z = N + P; for stable open-loop (P = 0), no encirclement of (−1, 0).',
    'Approximate: PM ≈ 100·ζ degrees (for ζ < 0.7).',
    'Asymptote error is 3.01 dB at a corner, 0.97 dB an octave out, 0.04 dB a decade out; errors of separate factors add.',
    'A right-half-plane zero has the magnitude of a zero and the phase of a pole; a delay adds phase -wT rad and no magnitude.',
    'Delay margin = PM in radians divided by the gain crossover frequency - the one margin measured in seconds.',
    'Closed-loop bandwidth is about 1.6 times the open-loop gain crossover across the useful damping range.',
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
      examTip: 'Ziegler-Nichols tuning is aggressive by design: it targets a quarter-amplitude decay of the DISTURBANCE response, and the setpoint-step overshoot that comes with it is much larger than the quarter that name suggests — 40.6% on the three-lag plant worked in Section 4. The FE exam may ask you to apply the ultimate gain method: find K_u (gain at sustained oscillation), measure P_u (oscillation period), then use the table to compute K_p, T_i, T_d.',
      importantNote: 'The derivative term amplifies noise because it differentiates the error signal. In practice, a low-pass filter is always added to the D term: K_d·s/(1 + s·T_d/N), where N is typically 10–20 and T_d = K_d/K_p. Writing the filter as 1/(1 + s/N) is dimensionally wrong — N is a pure number, so it has to divide the derivative time, not the frequency. The filter caps the derivative path gain at N·K_p. Pure derivative (K_d·s) is never used in real implementations.',
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

Choose **$T_d = 0.15\\ \\mathrm{s}$** and **$T_i = 2\\ \\mathrm{s}$**. The parallel
PID is a **sum** of three terms, not a product, so their phases cannot be added
one at a time — the three contributions must be collected into a single complex
number before any angle is taken:

$$C(j\\omega )/K_p = 1 + j[T_d\\omega - 1/(T_i\\omega )]$$

At ω = 5 rad/s the derivative part of the bracket is $T_d\\omega = 0.75$ and the
integral part is $1/(T_i\\omega ) = 0.10$, so the bracket is $1 + j0.65$ and

$$\\angle C(j5) = \\arctan (0.65) = +33.02^\\circ$$

which clears the +28.2° the specification asks for, with room to spare. Adding
the term phases separately would have given
$+36.9^\\circ - 5.7^\\circ = +31.2^\\circ$, which is close enough to look right
and is nonetheless the wrong calculation; on a PID with a larger derivative
time the two answers diverge badly.

**Step 4 — Set K_p for 0 dB gain crossover at ω = 5:**

|C(j5)| · |G(j5)| = 1

$$\\lvert C(j5)\\rvert /K_p = \\sqrt{1^{2} + 0.65^{2}} = \\sqrt{1.4225} = 1.19269$$

$$K_p = \\frac{1}{1.19269 \\times 0.0371391} = 22.5757$$

## 3.4 Final PID Parameters

| Parameter | Value | Derived Values |
|---|---|---|
| **K_p** | 22.576 | Proportional gain |
| **T_i** | 2.0 s | $K_i = K_p/T_i = 11.288$ |
| **T_d** | 0.15 s | $K_d = K_p\\cdot T_d = 3.386$ |

**Controller**: C(s) = 22.576 + 11.288/s + 3.386s

## 3.5 Verification — Closed-Loop Stability

Open-loop transfer function: L(s) = C(s)·G(s) = (22.576 + 11.288/s + 3.386s) · 1/[s(s+2)]

At ω = 5 rad/s the magnitude is 1 by construction, and the phase is the plant's
−158.20° plus the controller's +33.02°, so

$$\\mathrm{PM} = 180^\\circ - 125.18^\\circ = 54.82^\\circ$$

Now stop trusting the margin and simulate the closed loop. Its step response
overshoots by **23.25%**, peaks at 0.622 s and stays inside ±2% from 1.214 s
onward. That overshoot is nearly double the 12.7% predicted by the
$\\zeta \\approx \\mathrm{PM}/100$ rule, and the pole-zero pattern says why: the
closed-loop poles are −2.409 ± j3.746 and −0.569, a pair whose own damping
ratio is 0.541, but the controller also plants closed-loop **zeros** at −0.544
and −6.122. The first nearly cancels the slow real pole; the second is close
enough to the pair to add derivative-like lift. Phase margin predicts the
damping of the poles, never the overshoot of a loop that also carries zeros.

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
      importantNote: 'Ziegler-Nichols tuning is a starting point, not a final design. The quarter-decay target it is built around applies to the disturbance response; the setpoint overshoot it delivers is far larger, 40.6% on the plant of Section 4. For tighter specifications, reduce K_p by 20-30% from the Z-N value and increase T_i — Section 4.4 measures the payoff. The FE exam usually tests the Z-N table lookup, not iterative refinement.',
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
| PID | $0.6K_u$ = 4.8 | $P_u/2$ = 1.814 s | $P_u/8$ = 0.4535 s | 2.646 | 2.177 |

The PID controller is therefore

$$C(s) = 4.8 + 2.646/s + 2.177s$$

## 4.3 What Each Row Actually Does

Simulating all three closed loops turns the table into performance:

| Controller | Steady-state error to a step | Overshoot | Settling time (2%) |
|---|---|---|---|
| P, $K_p$ = 4 | **0.200** | 54.3% (of its own final value) | — (never reaches 1) |
| PI | 0 | 56.1% | 30.77 s |
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
  output instead removes the kick and leaves the **characteristic equation**
  untouched, so stability and disturbance rejection are unchanged. The
  setpoint response does change, because derivative action no longer acts on
  the setpoint path; Section 7 measures both effects.
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
    {
      id: 'pid-terms-derived',
      title: '5. Each Term Derived From the Defect It Repairs',
      content: `## 5.1 One Plant, Three Repairs

Sections 1 to 4 stated what the three terms do. This section derives each one
from the specific failure it exists to cure, and puts a number on the price it
charges for the cure. Everything below runs on a single second-order process

$$G(s) = \\frac{2}{(s+1)(s+4)}, \\qquad G(0) = \\frac{2}{4} = 0.5$$

with no integrator of its own, so it is Type 0 and its steady-state behaviour
is governed by the position-error constant.

## 5.2 Proportional Action and the Offset It Cannot Remove

Close the loop with pure gain. The characteristic polynomial is the plant
denominator plus the loop numerator:

$$T(s) = \\frac{K_pG(s)}{1 + K_pG(s)} = \\frac{2K_p}{s^{2} + 5s + 4 + 2K_p}$$

The final value follows from the DC gain of that transfer function, and the
error is what is left over:

$$y(\\infty ) = \\frac{2K_p}{4 + 2K_p}, \\qquad
e_{ss} = 1 - y(\\infty ) = \\frac{4}{4 + 2K_p} = \\frac{1}{1 + 0.5K_p}$$

The denominator is $1 + K_{pos}$ with $K_{pos} = K_pG(0)$, which is the
position-error constant of the time-specification chapter arriving by a
different door. **Proportional gain divides the offset; it never deletes it.**

The poles move as the gain rises. Matching $s^{2} + 5s + (4 + 2K_p)$ to the
standard form gives

$$\\omega _n = \\sqrt{4 + 2K_p}, \\qquad 2\\zeta \\omega _n = 5
\\Rightarrow \\zeta = \\frac{2.5}{\\sqrt{4 + 2K_p}}$$

so every unit of gain that shrinks the offset also shrinks the damping ratio.
Simulating the step response at each gain and measuring the peak confirms the
overshoot formula to four decimal places, which is the expected outcome for a
system that really is second order with no zeros:

| $K_p$ | Offset $1/(1 + 0.5K_p)$ | $\\omega _n$ (rad/s) | $\\zeta$ | Overshoot (formula) | Overshoot (measured) |
|---|---|---|---|---|---|
| 2 | 0.5000 | 2.828 | 0.8839 | 0.264% | 0.264% |
| 4 | 0.3333 | 3.464 | 0.7217 | 3.780% | 3.780% |
| 10 | 0.1667 | 4.899 | 0.5103 | 15.502% | 15.502% |
| 20 | 0.0909 | 6.633 | 0.3769 | 27.851% | 27.851% |
| 50 | 0.0385 | 10.198 | 0.2451 | 45.186% | 45.186% |
| 98 | 0.0200 | 14.142 | 0.1768 | 56.879% | 56.879% |

![Three closed-loop step responses of the same second-order plant under proportional control at gains of two, ten and fifty. The offsets below the setpoint are one half, one sixth and one twenty-sixth, exactly one over one plus half the gain in each case, while the overshoot climbs from a quarter of a percent to forty-five percent. Arrows mark each remaining offset against the setpoint line.](/courses/fe-ee/figures/ctl4-pid-p-offset.svg)

Read the arrows and the ringing together and the proportional term's whole
character is on one page. The gap to the setpoint closes like $1/K_p$, which is
slow going: each halving of the offset costs roughly a doubling of gain, and
the damping ratio falls like $1/\\sqrt{K_p}$ the whole way down.

### Worked Example 1 — The Gain That Buys a 2% Offset, and Its Bill

**Given** the plant above under proportional control, find the gain that holds
the steady-state offset to 2% of the setpoint, then find the overshoot that
gain produces.

**Offset requirement.** Set the offset formula equal to 0.02:

$$\\frac{1}{1 + 0.5K_p} = 0.02 \\Rightarrow 1 + 0.5K_p = 50
\\Rightarrow K_p = 98$$

**Resulting poles.** With that gain,

$$\\omega _n = \\sqrt{4 + 2 \\times 98} = \\sqrt{200} = 14.142\\ \\mathrm{rad/s},
\\qquad \\zeta = 2.5/14.142 = 0.17678$$

**Resulting overshoot.**

$$\\frac{\\zeta}{\\sqrt{1 - \\zeta ^{2}}} = \\frac{0.17678}{0.98425} = 0.17961$$

and $e^{-\\pi \\cdot 0.17961} = 0.5688$, so the response overshoots by
**56.88%**. Simulating the loop gives the same 56.88%.

**The lesson.** A 2% steady-state specification and a 10% overshoot
specification cannot both be met by proportional gain on this plant, at any
gain whatever. That impossibility is the entire argument for integral action.

## 5.3 Integral Action Removes the Offset and Charges Phase

Add an integral term, so the controller becomes $C(s) = K_p + K_i/s$. The loop
gain now carries a pole at the origin, so the loop is Type 1 and

$$e_{ss} = \\lim_{s \\to 0} \\frac{s \\cdot (1/s)}{1 + C(s)G(s)}
= \\lim_{s \\to 0} \\frac{s}{s + K_pG(s)s + K_iG(s)} = 0$$

for **any** positive $K_i$, however small. The offset is not reduced, it is
removed, and the size of $K_i$ decides only how quickly.

The bill arrives in phase. Writing the controller in the ideal form
$C = K_p[1 + 1/(T_is)]$, its contribution to the loop phase at frequency
$\\omega$ is

$$\\angle \\left[1 + \\frac{1}{jT_i\\omega }\\right]
= \\angle \\left[1 - \\frac{j}{T_i\\omega }\\right]
= -\\arctan \\frac{1}{T_i\\omega }$$

which is negative everywhere: integral action always subtracts phase, and the
subtraction is worst at low frequency. Put the PI zero a factor $m$ below the
gain crossover, that is $T_i = m/\\omega _c$, and the cost is
$\\arctan (1/m)$, independent of the plant:

$$m = 3 \\Rightarrow 18.43^\\circ , \\quad m = 5 \\Rightarrow 11.31^\\circ ,
\\quad m = 10 \\Rightarrow 5.71^\\circ$$

Measuring this on the plant of Section 5.2 with $K_p = 10$ held fixed: the
proportional-only loop crosses over at 3.586 rad/s with a 63.70° margin. Adding
integral action moves the crossover slightly and eats margin:

| $T_i$ (s) | Crossover (rad/s) | Phase margin | Margin lost | PI lag at the new crossover |
|---|---|---|---|---|
| — (P only) | 3.586 | 63.70° | — | — |
| 2.653 | 3.600 | 57.55° | 6.15° | 5.98° |
| 2.000 | 3.611 | 55.52° | 8.18° | 7.88° |
| 1.000 | 3.680 | 47.39° | 16.32° | 15.20° |
| 0.500 | 3.898 | 32.97° | 30.74° | 27.16° |

The last two columns nearly agree, and the gap between them is the crossover
shifting: adding gain at low frequency pushes the crossover up, and the extra
plant phase there is not recovered. The rule of thumb "the PI costs
$\\arctan (1/(T_i\\omega _c))$" is good to a third of a degree for the two
gentle integral times, to 1.1° at $T_i = 1$ s and to 3.6° at $T_i = 0.5$ s —
the approximation degrades exactly as the crossover moves most.

![A two-panel figure. The upper panel compares the proportional-only step response, which stops one sixth short of the setpoint, with the proportional-integral response, which reaches it. The lower panel plots the phase the integral term subtracts against frequency for three integral times, with the gain crossover of three point five nine radians per second marked; the lag at that frequency is twenty-seven degrees for the shortest integral time and eight degrees for the longest.](/courses/fe-ee/figures/ctl4-pid-integral-cost.svg)

The transient cost is real too. With $K_p = 10$ the proportional loop
overshoots 15.50% and settles at 1.625 s; adding integral action at
$T_i = 1$ s raises the overshoot to 20.79% and pushes settling to 1.868 s,
while removing the offset entirely. Integral action is never free.

### Worked Example 2 — Sizing the Integral Time From a Phase Budget

**Given** the loop above with $K_p = 10$, a gain crossover of 3.586 rad/s and a
63.70° phase margin, choose $T_i$ so that adding integral action costs no more
than 6° of phase margin.

**Step 1 — turn the budget into a frequency ratio.** The PI lag at the
crossover is $\\arctan (1/(T_i\\omega _c))$, so

$$\\arctan \\frac{1}{T_i\\omega _c} \\leq 6^\\circ
\\Rightarrow \\frac{1}{T_i\\omega _c} \\leq \\tan 6^\\circ = 0.105104$$

$$T_i\\omega _c \\geq \\frac{1}{0.105104} = 9.5144$$

**Step 2 — convert to seconds.**

$$T_i \\geq \\frac{9.5144}{3.586} = 2.653\\ \\mathrm{s}$$

**Step 3 — check by computing the margin, not by trusting the rule.**
Evaluating the actual loop with $T_i = 2.653$ s gives a crossover of 3.600
rad/s and a phase margin of 57.56°, a loss of 6.15° — within a sixth of a
degree of the budget, and slightly over it because the crossover moved.
Rounding $T_i$ up to 3 s brings the loss under the budget with room to spare.

**Step 4 — confirm the offset is gone.** The simulated step response reaches
the setpoint, overshoots 6.00% and is inside the ±2% band from 5.23 s onward:
the offset is gone, the margin is intact, and the price is a slower approach.

## 5.4 Derivative Action and the Noise It Multiplies

The derivative term contributes $+\\arctan (T_d\\omega )$ of phase when taken on
its own, and that lead is what lets a loop run more gain at the same margin.
Its magnitude, though, is $K_d\\omega$ — a straight line rising forever on a
log-log plot. Sensor noise lives at high frequency, which is exactly where that
line is largest.

Quantify it on the Ziegler-Nichols PID of Section 4, where $K_p = 4.8$ and
$T_d = 0.4535$ s, so $K_d = 2.1766$. Suppose the measurement carries white
noise of RMS 0.01 — one percent of the setpoint step — and the controller runs
at a sample interval $T_s = 0.01$ s. The unfiltered discrete derivative is
$K_d(e_k - e_{k-1})/T_s$, whose impulse response is the two-sample pair
$\\pm K_d/T_s$, so its RMS gain is exactly

$$\\sqrt{2}\\,\\frac{K_d}{T_s} = \\sqrt{2} \\times 217.66 = 307.81$$

Feeding four million samples of noise through it measures 307.79 — the closed
form and the experiment agree to five significant figures. That turns 0.01
units of sensor noise into **3.08 units** of actuator command, on a loop whose
entire steady-state command is one unit. The actuator would be doing nothing
but chasing noise.

The cure is a first-order filter on the derivative path,

$$C_d(s) = \\frac{K_ds}{1 + sT_d/N}, \\qquad N \\approx 5 \\text{ to } 20$$

whose magnitude flattens above $\\omega = N/T_d$ at the ceiling

$$\\lim_{\\omega \\to \\infty }\\lvert C_d(j\\omega )\\rvert
= \\frac{K_dN}{T_d} = K_pN$$

so the derivative path can never amplify by more than $N$ times the
proportional gain. Implemented as the difference equation
$u_k = au_{k-1} + b(e_k - e_{k-1})$ with $a = \\tau /(\\tau + T_s)$,
$b = K_d/(\\tau + T_s)$ and $\\tau = T_d/N$, its impulse response sums to a
closed-form RMS gain of

$$b\\sqrt{\\frac{2}{1 + a}}$$

which the Monte-Carlo experiment reproduces in every row below.

| Derivative path | $\\tau$ (s) | Ceiling $K_pN$ | RMS gain (closed form) | RMS gain (measured) | Actuator noise for 0.01 sensor noise |
|---|---|---|---|---|---|
| Unfiltered | 0 | none | 307.81 | 307.79 | 3.078 |
| $N = 20$ | 0.02267 | 96 | 72.386 | 72.388 | 0.7239 |
| $N = 10$ | 0.04535 | 48 | 41.234 | 41.236 | 0.4123 |
| $N = 5$ | 0.09069 | 24 | 22.174 | 22.175 | 0.2217 |
| Proportional path only | — | 4.8 | 4.8 | 4.8 | 0.0480 |

![Log-log magnitude of the derivative path against frequency for filter constants of five, ten and twenty, with the unfiltered straight line for comparison. Each filtered curve follows the unfiltered line at low frequency and then flattens at a ceiling equal to the proportional gain times the filter constant, namely twenty-four, forty-eight and ninety-six.](/courses/fe-ee/figures/ctl4-pid-noise-gain.svg)

The filtered curves and the unfiltered line share their low-frequency
behaviour, which is the point: the filter changes nothing where the loop
actually works, near 1.7 rad/s here. It takes hold only at its own pole,
$N/T_d$, which is 11.0, 22.1 and 44.1 rad/s for the three cases drawn — six to
twenty-five times above the crossover, in the band where only noise lives.

### Worked Example 3 — Choosing the Filter Constant From a Noise Budget

**Given** the PID above, a sensor whose noise RMS is 0.01, a sample interval of
0.01 s, and an actuator specification that the noise-driven command must stay
below 0.25 RMS, choose $N$.

**Step 1 — reject the unfiltered option immediately.** Its RMS gain of 307.81
gives 3.078, more than twelve times the budget.

**Step 2 — evaluate the ceiling first, as a screen.** The ceiling $K_pN$ is an
upper bound on the gain at any frequency, so a design with $K_pN$ below
$0.25/0.01 = 25$ is guaranteed to pass. That gives $N \\leq 25/4.8 = 5.2$.

**Step 3 — evaluate the actual RMS gain for the candidates.** From the table,
$N = 5$ gives 0.2217 and $N = 10$ gives 0.4123. So $N = 5$ passes with 11%
of margin and $N = 10$ fails by a factor of 1.65.

**Step 4 — check the filter has not eaten the design.** With $N = 5$ the filter
pole sits at $N/T_d = 5/0.4535 = 11.03$ rad/s, still 6.4 times above the
1.73 rad/s crossover region of the Section 4 loop, so the loop sees essentially
the pure derivative it was designed with.

**Answer:** $N = 5$. Note how the screen and the exact calculation agree in
their verdicts but not in their numbers — the ceiling is a bound, the RMS gain
is the truth, and both are worth having.`,
      examTip: 'Three one-line facts carry most of the marks on this material. Proportional control on a Type 0 plant leaves the offset 1/(1 + K_p·G(0)) — the position-error constant is the loop gain at DC, not just the controller gain. Integral action makes that offset exactly zero for any K_i > 0, and costs arctan(1/(T_i·ω_c)) of phase margin. Filtered derivative action cannot amplify by more than N·K_p, whatever the noise looks like.',
      importantNote: 'The three terms are not independent knobs on the same quantity. Proportional gain sets the offset AND the damping; integral time sets the speed of offset removal AND the phase lost; the derivative filter constant sets the noise ceiling AND how faithfully the loop gets the lead it was designed for. Every FE question that looks like "increase K_d to reduce overshoot" is really asking whether you know what else moved.',
    },
    {
      id: 'pid-three-forms',
      title: '6. Parallel, Ideal and Series Forms Reconciled',
      content: `## 6.1 The Same Controller, Written Three Ways

A tuning table is useless unless you know which algebraic form it was written
for. Three forms are in circulation, and vendors use all three.

**Parallel (independent gains).** The form used everywhere in this chapter's
Laplace algebra:

$$C(s) = K_p + \\frac{K_i}{s} + K_ds$$

**Ideal, also called standard or non-interacting.** One gain multiplies
everything; the other two parameters are times:

$$C(s) = K_c\\left[1 + \\frac{1}{T_is} + T_ds\\right]$$

**Series, also called interacting or classical.** A PI block feeding a PD
block, which is what an analogue pneumatic controller physically was:

$$C(s) = K_c'\\left[1 + \\frac{1}{T_i's}\\right](1 + T_d's)$$

Parallel and ideal are the same object with the parameters renamed:

$$K_p = K_c, \\qquad K_i = \\frac{K_c}{T_i}, \\qquad K_d = K_cT_d$$

$$T_i = \\frac{K_p}{K_i}, \\qquad T_d = \\frac{K_d}{K_p}$$

Series is genuinely different, and that is where errors get made.

## 6.2 Series to Ideal, by Expansion

Multiply the series form out:

$$C(s) = K_c'\\left[1 + T_d's + \\frac{1}{T_i's} + \\frac{T_d'}{T_i'}\\right]$$

Collect the two constant terms and factor $f = 1 + T_d'/T_i'$ out of the whole
bracket:

$$C(s) = K_c'f\\left[1 + \\frac{1}{T_i'fs} + \\frac{T_d'}{f}s\\right]$$

Comparing that with the ideal form term by term gives the conversion, and note
that the middle result simplifies beautifully:

$$K_c = K_c'f, \\qquad T_i = T_i'f = T_i' + T_d', \\qquad
T_d = \\frac{T_d'}{f} = \\frac{T_i'T_d'}{T_i' + T_d'}$$

The ideal integral time is the **sum** of the series times; the ideal
derivative time is their **parallel combination**. Both are worth remembering
as shapes rather than formulas.

### Worked Example 4 — Series Settings Into Ideal and Parallel

**Given** a series controller with $K_c' = 3$, $T_i' = 4$ s, $T_d' = 1$ s,
write the same controller in ideal and parallel form.

$$f = 1 + \\frac{T_d'}{T_i'} = 1 + \\frac{1}{4} = 1.25$$

$$K_c = 3 \\times 1.25 = 3.75, \\qquad T_i = 4 + 1 = 5\\ \\mathrm{s},
\\qquad T_d = \\frac{4 \\times 1}{4 + 1} = 0.8\\ \\mathrm{s}$$

Then the parallel gains follow directly:

$$K_p = 3.75, \\qquad K_i = \\frac{3.75}{5} = 0.75,
\\qquad K_d = 3.75 \\times 0.8 = 3.0$$

**Check by an independent route.** Multiply out the series numerator directly:
$3(1 + 1/(4s))(1 + s) = 3(1 + s + 1/(4s) + 1/4) = 3.75 + 0.75/s + 3s$, which is
the parallel triple just derived. The two routes agree exactly.

## 6.3 Ideal to Series, and When It Is Impossible

Going the other way needs a quadratic. Substituting $T_i' = \\alpha T_i$ into
$T_i' + T_d' = T_i$ and $T_i'T_d'/(T_i' + T_d') = T_d$ gives

$$\\alpha ^{2}T_i - \\alpha T_i + T_d = 0 \\Rightarrow
\\alpha = \\frac{1}{2}\\left[1 + \\sqrt{1 - \\frac{4T_d}{T_i}}\\right]$$

and then

$$K_c' = \\alpha K_c, \\qquad T_i' = \\alpha T_i,
\\qquad T_d' = \\frac{T_d}{\\alpha }$$

The square root is real only when

$$T_i \\geq 4T_d$$

That is not an algebraic curiosity. Write the ideal PID over a common
denominator:

$$C(s) = K_c\\,\\frac{T_iT_ds^{2} + T_is + 1}{T_is}$$

A PID is **two zeros and one pole at the origin**. The discriminant of that
numerator is $T_i^{2} - 4T_iT_d = T_i(T_i - 4T_d)$, so $T_i \\geq 4T_d$ is
exactly the condition for the two zeros to be **real**. The series form is a
product of two real first-order factors, so it can only ever produce real
zeros. An ideal controller with complex zeros has no series equivalent.

### Worked Example 5 — Ideal Settings Into Series Settings

**Given** $K_c = 2$, $T_i = 10$ s, $T_d = 1$ s, find the equivalent series
settings.

$$\\frac{4T_d}{T_i} = \\frac{4}{10} = 0.4, \\qquad
\\sqrt{1 - 0.4} = \\sqrt{0.6} = 0.774597$$

$$\\alpha = \\frac{1 + 0.774597}{2} = 0.887298$$

$$K_c' = 2 \\times 0.887298 = 1.7746, \\qquad
T_i' = 10 \\times 0.887298 = 8.8730\\ \\mathrm{s}, \\qquad
T_d' = \\frac{1}{0.887298} = 1.1270\\ \\mathrm{s}$$

**Check by the forward conversion.** $T_i' + T_d' = 8.8730 + 1.1270 = 10.000$ s
and $T_i'T_d'/(T_i' + T_d') = 1.0000$ s, recovering the ideal times exactly;
$K_c'(1 + T_d'/T_i') = 1.7746 \\times 1.12702 = 2.0000$, recovering the gain.

### Worked Example 6 — Why Ziegler-Nichols PID Sits Exactly on the Boundary

**Given** the ultimate-gain PID rule $T_i = P_u/2$ and $T_d = P_u/8$, examine
its zeros.

$$\\frac{4T_d}{T_i} = \\frac{4(P_u/8)}{P_u/2} = \\frac{P_u/2}{P_u/2} = 1$$

The ratio is 1 for **every plant**, because the ultimate period cancels. So the
discriminant is exactly zero, $\\alpha = 1/2$ exactly, and the Ziegler-Nichols
PID always has a **repeated real zero** at

$$s = -\\frac{T_i}{2T_iT_d} = -\\frac{1}{2T_d} = -\\frac{4}{P_u}$$

For the three-lag plant of Section 4, $T_d = 0.4535$ s puts that double zero at
$s = -1.1027$, and the series equivalent is
$K_c' = 2.4$, $T_i' = T_d' = 0.9069$ s. Ziegler-Nichols is not merely
convertible to series form; it is the one ideal tuning that converts to a
series controller whose two blocks have identical time constants.

### Worked Example 7 — A Tuning With No Series Equivalent

**Given** $K_c = 2$, $T_i = 2$ s, $T_d = 1$ s, find the series settings.

$$\\frac{4T_d}{T_i} = \\frac{4}{2} = 2 > 1$$

so $\\sqrt{1 - 2}$ is imaginary and no series settings exist. The zeros confirm
it: the numerator is $2s^{2} + 2s + 1$, whose roots are

$$s = \\frac{-2 \\pm \\sqrt{4 - 8}}{4} = -0.5 \\pm j0.5$$

a complex pair. A series controller cannot place complex zeros, so this
controller simply cannot be built from a PI block followed by a PD block. On a
plant that needs a resonant notch from its controller, the ideal form is not a
convenience — it is a requirement.

## 6.4 What Happens When the Forms Are Confused

The forms differ by the factor $f = 1 + T_d/T_i$, which is 1.25 for a
Ziegler-Nichols PID and can reach 2 or more for derivative-heavy tunings. Typing
ideal numbers into a series controller therefore multiplies the effective
proportional gain by $f$, stretches the integral time by $f$ and shrinks the
derivative time by $f$.

Take the Section 4 Ziegler-Nichols PID, $K_c = 4.8$, $T_i = 1.8138$ s,
$T_d = 0.4535$ s, and type those three numbers into a controller that
implements the series form. The controller actually running is the ideal one
with

$$K_c = 4.8 \\times 1.25 = 6.0, \\qquad T_i = 2.2672\\ \\mathrm{s},
\\qquad T_d = 0.3628\\ \\mathrm{s}$$

Simulating both on the three-lag plant:

| Controller actually running | Overshoot | Peak time | 2% settling |
|---|---|---|---|
| Ideal form, as intended | 40.57% | 2.206 s | 9.373 s |
| Series box fed ideal numbers | 46.62% | 2.032 s | 12.033 s |

Six extra points of overshoot and 28% more settling time, from a documentation
error rather than a design error. On a derivative-heavy tuning the gap is much
larger.

| Form | Parameters | Zeros | Converts to the others? |
|---|---|---|---|
| Parallel | $K_p$, $K_i$, $K_d$ | Real or complex | Always, by renaming |
| Ideal | $K_c$, $T_i$, $T_d$ | Real or complex | Always, by renaming |
| Series | $K_c'$, $T_i'$, $T_d'$ | Real only | To ideal always; from ideal only if $T_i \\geq 4T_d$ |

## 6.5 Problem Set A — Form Conversions

**A1.** A parallel PID has $K_p = 6$, $K_i = 1.5$, $K_d = 4.5$. Find $T_i$ and
$T_d$, and decide whether a series equivalent exists.
*Answer:* $T_i = 6/1.5 = 4$ s and $T_d = 4.5/6 = 0.75$ s. Then
$4T_d/T_i = 3/4 = 0.75 < 1$, so a series form exists.

**A2.** Continue A1: find the series settings.
*Answer:* $\\sqrt{1 - 0.75} = 0.5$, so $\\alpha = (1 + 0.5)/2 = 0.75$. Then
$K_c' = 6 \\times 0.75 = 4.5$, $T_i' = 4 \\times 0.75 = 3$ s and
$T_d' = 0.75/0.75 = 1$ s. Check: $3 + 1 = 4$ s and
$3 \\times 1/(3 + 1) = 0.75$ s, both recovered.

**A3.** A series controller reads $K_c' = 2.5$, $T_i' = 6$ s, $T_d' = 2$ s.
What parallel gains does it implement?
*Answer:* $f = 1 + 2/6 = 4/3$. So $K_c = 2.5 \\times 4/3 = 3.3333$,
$T_i = 6 + 2 = 8$ s, $T_d = 6 \\times 2/8 = 1.5$ s, and the parallel gains are
$K_p = 3.3333$, $K_i = 10/24 = 0.41667$, $K_d = 3.3333 \\times 1.5 = 5.0$.

**A4.** For which ratio $T_d/T_i$ does the ideal-to-series conversion give
$\\alpha = 1/2$, and what does that mean for the controller's zeros?
*Answer:* $\\alpha = 1/2$ requires the square root to vanish, so
$T_d/T_i = 1/4$. The two zeros coincide at $s = -1/(2T_d)$, and the series
blocks have equal time constants $T_i' = T_d' = T_i/2$.

**A5.** An exam question gives $K_c = 5$, $T_i = 1$ s, $T_d = 0.4$ s and asks
for $K_i$ and $K_d$. Give them, and say whether the controller has real zeros.
*Answer:* $K_i = 5/1 = 5$ and $K_d = 5 \\times 0.4 = 2$. Since
$4T_d/T_i = 1.6 > 1$, the zeros are complex; the roots of
$0.4s^{2} + s + 1$ are $s = -1.25 \\pm j1.0897$.`,
      examTip: 'When a problem hands you PID settings, check the form before you compute. The three giveaways: three gains with different units means parallel; one gain and two times means ideal; one gain and two times WITH the words "interacting", "series" or "classical" means series. Converting series to ideal is one multiplication by f = 1 + T_d\u2032/T_i\u2032; going the other way needs the square root and can fail.',
      importantNote: 'The condition T_i ≥ 4T_d is the same statement as "the PID zeros are real". It is worth carrying because it explains an otherwise arbitrary-looking restriction on hardware: a series controller is two cascaded first-order blocks, and two real first-order blocks can never produce a complex pair of zeros. Ziegler-Nichols PID sits exactly on the boundary for every plant, since T_i = P_u/2 and T_d = P_u/8 make the ratio exactly one.',
    },
    {
      id: 'pid-windup-and-kick',
      title: '7. Windup, Derivative Kick, and the Two Fixes',
      content: `## 7.1 Every Real Actuator Has a Ceiling

The algebra of Sections 1 to 6 assumes the controller output reaches the plant
untouched. It never does. A valve closes fully, a heater draws its rated
current, an amplifier clips at its rail. The moment the commanded signal
exceeds what the hardware can deliver, **the loop is open** — the plant no
longer sees what the controller computed — and the integrator, which knows
nothing about any of this, keeps accumulating error.

Take the Ziegler-Nichols PI of Section 4 on the same three-lag plant:

$$G(s) = \\frac{1}{(s+1)^{3}}, \\qquad K_p = 3.6,
\\qquad T_i = 3.023\\ \\mathrm{s}, \\qquad K_i = 1.1909$$

The plant has unity DC gain, so holding the output at a setpoint of 1 requires
a steady command of exactly 1. Two arithmetic facts bracket the whole problem:

$$u(0^{+}) = K_p \\cdot e(0^{+}) = 3.6 \\times 1 = 3.6, \\qquad u_{ss} = 1$$

The controller asks for 3.6 units at the instant of the step and needs 1 unit
forever after. **Any ceiling between 1 and 3.6 saturates the actuator without
making the setpoint unreachable** — and that interval is exactly where windup
lives. Below 1 the setpoint simply cannot be held; above 3.6 nothing saturates.

## 7.2 Windup Measured, Not Asserted

Fix the ceiling at 1.05, integrate the nonlinear loop with the limit in place,
and measure. Three runs, one 90-second window:

| Run | Overshoot | 2% settling | Time saturated |
|---|---|---|---|
| No limit at all (the algebra of Section 4) | 56.09% | 30.77 s | 0 s |
| Ceiling 1.05, plain PI | 5.00% | 45.42 s | 42.34 s |
| Ceiling 1.05, integrator clamped | 0.33% | 13.45 s | 4.03 s |

The unlimited loop's command peaks at 3.994, so an actuator ceiling of 1.05 is
being asked for nearly four times what it can deliver.

Three things in that table repay attention, and only the first is the one
textbooks usually describe.

**The overshoot is 5.00%, exactly the ceiling.** With the command pinned at
1.05 and a plant of unity DC gain, the output can climb to 1.05 and no
further, so the saturated run's "overshoot" is not a property of the loop at
all — it is the actuator's headroom, read back. Saturation *reduces* peak
overshoot here, which is why looking only at overshoot hides windup completely.

**The damage shows up in settling time.** The wound-up loop needs 45.42 s
against the clamped loop's 13.45 s — a factor of 3.4. The actuator sits pinned
for 42.34 s of the 90-second window against 4.03 s for the clamped version. All
that pinned time is the loop running open while the integral state grows,
and every unit of accumulated integral has to be paid back before the command
can come off the stop.

**The fix beats even the unlimited loop.** Clamping settles in 13.45 s, less
than half the 30.77 s of the ideal, unlimited Ziegler-Nichols loop. That is not
magic: holding the integrator still while the actuator is on its stop is a mild
form of the detuning Section 4.4 recommended, and this aggressive tuning had
plenty of ringing to lose.

![Two stacked panels over ninety seconds. The upper panel shows the plant output for an unlimited controller, a controller whose actuator stops at one point zero five with no anti-windup, and the same limit with the integrator clamped. The wound-up run rides the ceiling value for tens of seconds and takes forty-five seconds to settle; the clamped run settles in thirteen. The lower panel shows the corresponding actuator signals against the ceiling line, with the wound-up run pinned for forty-two of the ninety seconds.](/courses/fe-ee/figures/ctl4-pid-windup.svg)

The lower panel is where the mechanism is visible. Both limited runs deliver
the same signal at first, because both are hard against the stop. They separate
at the moment the plain PI's integral state is so large that it holds the
command on the stop long after the error has changed sign.

## 7.3 The Two Standard Fixes

**Conditional integration, also called clamping.** Freeze the integrator
whenever the command is saturated *and* the error would drive it further into
saturation:

$$\\frac{dI}{dt} = \\begin{cases} 0 & \\text{if } u \\neq u_{sat}
\\text{ and } e \\cdot u > 0 \\\\ e & \\text{otherwise}\\end{cases}$$

The second condition matters: an unconditional freeze would also block the
integrator from unwinding, which is the opposite of what is wanted.

**Back-calculation.** Feed the saturation error back into the integrator
through a tracking time $T_t$:

$$\\frac{dI}{dt} = e + \\frac{1}{K_iT_t}\\left(u_{sat} - u\\right)$$

While unsaturated the second term is zero and the integrator behaves normally.
While saturated it pulls the integral state towards whatever value would have
produced exactly $u_{sat}$, with time constant $T_t$. The usual starting choice
is $T_t = T_i$ for a PI and $T_t = \\sqrt{T_iT_d}$ for a PID.

Both fixes cost one conditional or one extra term. Neither changes the
controller at all while the actuator is inside its range, which is why they are
safe to add unconditionally.

### Worked Example 8 — Which Ceilings Actually Cause Windup

**Given** the loop above, decide for each actuator ceiling whether windup is
possible, then read the measured cost.

**Step 1 — the two brackets.** From Section 7.1, the steady command is 1 and
the initial command is 3.6, so windup requires $1 < u_{max} < 3.6$.

**Step 2 — check three candidates.** Ceilings of 1.05, 1.10 and 1.30 all fall
inside that interval, so all three saturate at $t = 0$ and none makes the
setpoint unreachable.

**Step 3 — measure, do not guess.** Simulating each:

| Ceiling | Plain PI: settling | Plain PI: saturated | Clamped: settling | Clamped: saturated |
|---|---|---|---|---|
| 1.05 | 45.42 s | 42.34 s | 13.45 s | 4.03 s |
| 1.10 | 27.90 s | 20.74 s | 13.27 s | 3.69 s |
| 1.30 | 18.78 s | 6.63 s | 17.35 s | 2.76 s |

**Step 4 — read the pattern.** The tighter the ceiling, the longer the loop
runs open and the worse windup gets: saturated time roughly doubles for each
halving of the headroom above 1, and settling time follows it. At a 1.30
ceiling there is enough headroom that windup costs only 1.4 s of settling, and
anti-windup is nearly a formality. **The cost of leaving windup unhandled
scales with how marginal the actuator is**, which is why it bites hardest on
exactly the plants where authority is expensive.

## 7.4 Derivative Kick and the Filtered-Derivative Cure

A second defect appears the moment anyone moves the setpoint. If the derivative
acts on the error, then

$$u_D(t) = K_d\\frac{de}{dt} = K_d\\frac{dr}{dt} - K_d\\frac{dy}{dt}$$

and a step change in $r$ makes $dr/dt$ an impulse. In an ideal controller the
command is briefly infinite; in a real one with the filtered derivative of
Section 5.4 it is finite but very large, because the filtered derivative's
ceiling is $K_pN$ and a unit setpoint step drives it straight there. The peak
command is therefore

$$u(0^{+}) = K_p + K_pN = K_p(1 + N)$$

For the Ziegler-Nichols PID of Section 4 with $N = 10$:

$$u(0^{+}) = 4.8 \\times 11 = 52.8$$

against a steady-state requirement of 1 unit. Simulating the loop returns
exactly 52.80. Any real actuator would clip that instantly, and the clip would
then feed the windup mechanism of Section 7.2.

**The cure** is to differentiate the measurement instead of the error:

$$u(t) = K_p\\left[r - y\\right] + K_i\\int (r - y)\\,d\\tau
- K_d\\frac{dy}{dt}$$

Since $y$ cannot jump when $r$ does, the kick disappears. The **characteristic
equation is unchanged** — the derivative still acts on the same signal inside
the loop — so stability, gain margin, phase margin and disturbance rejection
are all exactly as designed. What does change is the setpoint response, because
derivative action no longer helps damp the setpoint transient:

| Derivative acts on | Peak command | Overshoot | 0→100% rise | 2% settling |
|---|---|---|---|---|
| The error | 52.80 | 42.73% | 1.282 s | 9.193 s |
| The measurement | 5.23 | 52.19% | 1.608 s | 9.674 s |

![Two stacked panels. The upper panel plots the controller output during the first three seconds after a unit setpoint step, comparing derivative action on the error, which spikes to fifty-two point eight, with derivative action on the measurement, which peaks at five point two three. The lower panel shows the two plant outputs: the error form overshoots forty-three percent, the measurement form fifty-two percent, and both settle in about nine and a half seconds.](/courses/fe-ee/figures/ctl4-pid-kick.svg)

A factor of **10.1** off the peak command, paid for with 9.5 extra points of
setpoint overshoot. On any plant where the actuator would have clipped the
52.8-unit spike, that is not a trade at all — the spike was never going to be
delivered, and pretending otherwise only invites windup.

### Worked Example 9 — Sizing the Kick Before It Is Built

**Given** a PID with $K_p = 2.5$, $T_i = 4$ s, $T_d = 0.8$ s, a derivative
filter constant $N = 15$, and an actuator that saturates at 8 units, decide
whether a unit setpoint step will clip the actuator, and by how much.

**Step 1 — the derivative gain.**

$$K_d = K_pT_d = 2.5 \\times 0.8 = 2.0$$

**Step 2 — the filtered derivative's ceiling.**

$$\\frac{K_dN}{T_d} = \\frac{2.0 \\times 15}{0.8} = 37.5 = K_pN
= 2.5 \\times 15$$

Both routes give the same number, which is the check that the algebra of
Section 5.4 is being applied correctly.

**Step 3 — the peak command.**

$$u(0^{+}) = K_p(1 + N) = 2.5 \\times 16 = 40$$

**Step 4 — compare with the limit.** The actuator saturates at 8, so the
command is clipped by a factor of 5. The actuator will sit on its stop for as
long as the filtered derivative takes to decay, roughly

$$3\\frac{T_d}{N} = 3 \\times \\frac{0.8}{15} = 0.16\\ \\mathrm{s}$$

**Step 5 — the fix and its price.** Moving the derivative onto the measurement
drops the peak command to $K_p = 2.5$, comfortably inside the limit, at the
cost of a slower and more overshooting setpoint response. Alternatively, keep
the derivative on the error and add setpoint weighting: use $\\beta r - y$ in
the proportional term and $\\gamma r - y$ in the derivative term, with
$\\gamma = 0$ recovering derivative-on-measurement exactly and intermediate
values trading kick against setpoint damping.

## 7.5 Problem Set B — Saturation and Kick

**B1.** A PI controller with $K_p = 4$ drives a plant of DC gain 2 to a
setpoint of 3. The actuator saturates at 10 units. Does the loop saturate at
the instant of the step, and can it hold the setpoint?
*Answer:* The initial command is $4 \\times 3 = 12 > 10$, so yes it saturates.
The steady command is $3/2 = 1.5 < 10$, so the setpoint is reachable. Windup
is possible.

**B2.** Same loop, but the actuator saturates at 1.2 units. What happens?
*Answer:* The steady command of 1.5 exceeds the limit, so the setpoint can
never be reached. The error stays positive forever and the integrator grows
without bound — this is not windup, it is an under-sized actuator, and
anti-windup will not fix it.

**B3.** A PID has $K_p = 6$ and a derivative filter constant $N = 12$. What is
the peak controller output immediately after a setpoint step of 0.5 units, with
the derivative taken on the error?
*Answer:* $u(0^{+}) = K_p(1 + N) \\times 0.5 = 6 \\times 13 \\times 0.5 = 39$.

**B4.** Explain why clamping the integrator only when the error would push
further into saturation, rather than whenever the actuator is saturated, is the
correct condition.
*Answer:* An unconditional freeze would also stop the integrator unwinding
while saturated. Since coming off the stop requires the integral term to fall,
an unconditional freeze would leave the loop stuck on the stop.

**B5.** A back-calculation anti-windup uses $T_t = T_i$. During a long
saturation with a constant offset $u - u_{sat} = \\Delta$, what value does the
integral term settle towards?
*Answer:* Setting $dI/dt = 0$ in the back-calculation law gives
$e = \\Delta /(K_iT_t)$, so the integral term settles wherever it makes the
computed command exceed the saturation limit by $K_iT_te$ — that is, it
tracks the saturated value rather than running away. The loop leaves saturation
as soon as the error changes sign.

**B6.** Why does derivative-on-measurement leave the phase margin unchanged?
*Answer:* The phase margin is a property of the loop gain
$L(s) = C(s)G(s)$, which is determined by how the controller responds to the
measurement. Moving the derivative from $r - y$ to $-y$ changes only the path
from setpoint to output, not the loop that closes around the plant, so the
characteristic equation $1 + L(s) = 0$ is untouched.`,
      examTip: 'Two numbers settle almost every saturation question. The steady command u_ss = r/G(0) says whether the setpoint is reachable at all; the initial command K_p·e(0) says whether the actuator saturates immediately. Windup is only possible when the ceiling lies between them. For the kick, the single formula K_p(1 + N) gives the peak command after a unit setpoint step with a filtered derivative on the error.',
      importantNote: 'Saturation frequently REDUCES measured overshoot, because a limited actuator cannot push the output past the ceiling value. Judging anti-windup by overshoot alone will therefore tell you nothing. Judge it by settling time and by how long the actuator stays on its stop — those are the quantities windup actually destroys.',
    },
    {
      id: 'pid-tuning-measured',
      title: '8. Tuning Rules, Their Assumptions, and What Measurement Says',
      content: `## 8.1 Three Experiments, Three Sets of Assumptions

Ziegler and Nichols published two procedures, and a third — relay feedback —
became standard later. All three produce $K_p$, $T_i$ and $T_d$ from an
experiment rather than from a model, and all three rest on assumptions worth
stating out loud.

| Experiment | What is measured | What it assumes | What it costs |
|---|---|---|---|
| Reaction curve (open loop) | Dead time $\\theta$, time constant $\\tau$, gain $K$ | The plant looks like a first-order lag plus dead time | The loop must be opened; the plant must be driven off its operating point |
| Ultimate gain (closed loop) | $K_u$, $P_u$ | The plant can be driven to sustained oscillation safely | The plant is deliberately made marginally stable |
| Relay feedback | Limit-cycle amplitude $a$, period | The plant filters harmonics well enough that only the fundamental matters | A small, bounded oscillation |

Sections 3 and 4 used the ultimate-gain method. This section works the other
two on the same three-lag plant, so all three can be compared against a single
simulated response.

## 8.2 The Reaction Curve, Derived Rather Than Traced

The three-lag plant has an exact open-loop step response:

$$y(t) = 1 - e^{-t}\\left(1 + t + \\frac{t^{2}}{2}\\right)$$

Differentiating twice locates the inflection point, which is where the tangent
construction is drawn:

$$y'(t) = \\frac{t^{2}}{2}e^{-t}, \\qquad
y''(t) = e^{-t}\\left(t - \\frac{t^{2}}{2}\\right)$$

so $y'' = 0$ at $t = 2$ and the steepest slope is

$$y'(2) = 2e^{-2} = 0.27067, \\qquad y(2) = 1 - 5e^{-2} = 0.32332$$

The tangent at that point crosses zero at $t = \\theta$ and crosses the final
value at $t = \\theta + \\tau$. Both intercepts come out in closed form:

$$\\frac{y(2)}{y'(2)} = \\frac{1 - 5e^{-2}}{2e^{-2}} = \\frac{e^{2}}{2} - \\frac{5}{2}
= 1.19453$$

$$\\frac{1 - y(2)}{y'(2)} = \\frac{5e^{-2}}{2e^{-2}} = \\frac{5}{2} = 2.5$$

$$\\theta = 2 - 1.19453 = 0.80547\\ \\mathrm{s}, \\qquad
\\tau = 2 + 2.5 - 0.80547 = 3.69453\\ \\mathrm{s}$$

and $\\tau$ is exactly $e^{2}/2$. The process gain is the DC gain, $K = 1$.

Feeding those into the reaction-curve PID row of Section 2.1:

$$K_p = \\frac{1.2\\tau }{K\\theta } = 1.2 \\times 3.69453/0.80547 = 5.504$$

$$T_i = 2\\theta = 2 \\times 0.80547 = 1.61094\\ \\mathrm{s}, \\qquad
T_d = 0.5\\theta = 0.5 \\times 0.80547 = 0.4027\\ \\mathrm{s}$$

## 8.3 Relay Feedback, and Why It Gets $K_u$ Slightly Wrong

Replace the controller with an on-off relay of amplitude $d$ switching on the
sign of the error. The loop settles into a limit cycle. If the plant is a good
enough low-pass filter, only the fundamental of the relay's square wave
survives to come back round the loop, and the square wave's fundamental has
amplitude

$$\\frac{4d}{\\pi }$$

Dividing by the amplitude $a$ of the oscillation at the relay input gives the
relay's **describing function** — its equivalent gain to that fundamental:

$$N(a) = \\frac{4d}{\\pi a}$$

The limit cycle is a closed-loop oscillation, so $N(a)G(j\\omega ) = -1$, which
forces $G(j\\omega )$ to be real and negative. That happens only at the phase
crossover, and there

$$\\lvert G(j\\omega _u)\\rvert = \\frac{\\pi a}{4d}
\\Rightarrow K_u = \\frac{4d}{\\pi a}$$

So one relay experiment yields $K_u$ from the measured amplitude and $P_u$ from
the measured period — without ever making the loop unstable.

**Now measure the error the assumption costs.** Running the relay experiment on
$1/(s+1)^{3}$ with $d = 1$ and letting the limit cycle settle:

| Quantity | Relay experiment | Exact value from Section 4 | Error |
|---|---|---|---|
| Amplitude $a$ | 0.16306 | — | — |
| $K_u = 4/(\\pi a)$ | 7.808 | 8.000 | −2.40% |
| Period | 3.6797 s | 3.6276 s | +1.44% |

![A relay feedback experiment on the three-lag plant after the limit cycle has settled. The process output is a nearly sinusoidal oscillation of amplitude zero point one six three, and the relay output is a square wave shown scaled down to fit. Arrows mark the measured amplitude and the measured period of three point six eight seconds.](/courses/fe-ee/figures/ctl4-pid-relay.svg)

The output really is nearly sinusoidal, which is the visual form of the
assumption: three cascaded lags attenuate the third harmonic by roughly
$3^{3} = 27$, so the fundamental dominates and the describing function is
close. On a plant with less filtering — one lag instead of three, or a
resonance near the third harmonic — the same experiment can be several times
worse. A 2.4% error in $K_u$ is entirely acceptable given that the tuning
table it feeds is itself only a starting point.

### Worked Example 10 — Two Ziegler-Nichols Methods, One Plant

**Given** the plant $1/(s+1)^{3}$, compare the PID produced by the
reaction-curve method with the PID produced by the ultimate-gain method.

**Step 1 — collect both parameter sets.** From Section 8.2 and Section 4.2:

| Method | $K_p$ | $T_i$ (s) | $T_d$ (s) |
|---|---|---|---|
| Reaction curve | 5.504 | 1.6109 | 0.4027 |
| Ultimate gain | 4.800 | 1.8138 | 0.4535 |

**Step 2 — notice they disagree.** The reaction-curve method asks for 15% more
proportional gain and 11% less integral time, which is a materially more
aggressive controller. The two procedures are not two routes to one answer.

**Step 3 — simulate both closed loops and measure.**

| Method | Overshoot | Peak time | 2% settling |
|---|---|---|---|
| Reaction curve | 51.77% | 2.117 s | 12.98 s |
| Ultimate gain | 40.57% | 2.206 s | 9.373 s |

**Step 4 — explain the gap.** The reaction-curve method models the plant as a
first-order lag plus a pure dead time. The three-lag plant has no dead time at
all; the 0.805 s the construction reports is an artefact of fitting a tangent
to an S-curve. Feeding a fictitious dead time into a rule built for real dead
time produces a gain that is too high for the plant that actually exists.

**The lesson.** When a plant genuinely has transport delay — a conveyor, a long
pipe, a communication link — the reaction-curve method is the appropriate one.
When the lag is distributed rather than transported, the ultimate-gain or relay
route measures the plant as it is.

## 8.4 Tuning by Sweeping and Measuring

Neither table is an optimum, and nothing stops a designer from sweeping the
gains and measuring what comes out. Holding the Ziegler-Nichols integral and
derivative times fixed and sweeping the proportional gain alone:

| $K_p$ | Overshoot | 2% settling |
|---|---|---|
| 1.0 | 8.65% | 8.715 s |
| 2.0 | 22.28% | 8.711 s |
| 3.0 | 30.85% | 9.356 s |
| 4.0 | 36.85% | 8.283 s |
| 4.8 (Z-N) | 40.57% | 9.373 s |
| 6.0 | 44.99% | 8.539 s |

![Two stacked panels sweeping the proportional gain from zero point four to six with the Ziegler-Nichols integral and derivative times held fixed. The upper panel shows measured overshoot climbing smoothly from below ten percent to forty-five percent, with the Ziegler-Nichols point marked at forty point six percent and the ten percent budget drawn as a dashed line. The lower panel shows measured two percent settling time, which does not fall smoothly but jumps as ripple peaks cross the band edge.](/courses/fe-ee/figures/ctl4-pid-tuning-sweep.svg)

Two features of that picture are worth naming. Overshoot rises smoothly and
monotonically with gain, so it is a well-behaved thing to design against.
Settling time does **not**: it jumps up and down, because the 2% settling time
is the moment the *last* ripple peak falls inside the band, and as the gain
changes a peak crosses the band edge discontinuously. Any automatic tuner that
minimises settling time alone will chase those jumps.

Opening the sweep to two dimensions, over the proportional gain and the
integral time together, finds a controller the table never suggests:

| Tuning | $K_p$ | $T_i$ (s) | $T_d$ (s) | Overshoot | 2% settling |
|---|---|---|---|---|---|
| Ziegler-Nichols PID | 4.80 | 1.814 | 0.4535 | 40.57% | 9.373 s |
| Section 4.4 detuning | 3.36 | 3.628 | 0.4535 | 14.25% | 6.515 s |
| Swept, best settling with overshoot under 10% | 1.20 | 2.400 | 0.4535 | 0.97% | 4.282 s |

The swept controller settles **2.2 times faster** than Ziegler-Nichols with
essentially no overshoot, using a quarter of the proportional gain. That is not
a criticism of the table so much as a statement of what the table is for: it
produces a working controller from two measured numbers in under a minute, and
it is a starting point that a short sweep will always beat.

### Worked Example 11 — Reading a Relay Test

**Given** a relay test on an unknown process with relay amplitude
$d = 2.5$ units, a measured limit-cycle amplitude of $a = 0.40$ units and a
measured period of 12 s, produce PI settings.

**Step 1 — ultimate gain from the describing function.**

$$K_u = \\frac{4d}{\\pi a} = \\frac{4 \\times 2.5}{\\pi \\times 0.40}
= \\frac{10}{1.2566} = 7.958$$

**Step 2 — ultimate period.** The limit-cycle period is $P_u$ directly:
$P_u = 12$ s.

**Step 3 — apply the PI row.**

$$K_p = 0.45K_u = 0.45 \\times 7.958 = 3.581, \\qquad
T_i = \\frac{P_u}{1.2} = \\frac{12}{1.2} = 10\\ \\mathrm{s}$$

$$K_i = \\frac{K_p}{T_i} = 3.581/10 = 0.3581$$

**Step 4 — state the uncertainty honestly.** The describing function ignores
harmonics, and Section 8.3 measured that approximation at −2.4% on a
well-filtered plant. If this process filters less well, $K_u$ could be low by
several percent, so the resulting $K_p$ inherits that error. Since the whole
tuning will be detuned by 20% to 30% anyway, a few percent of describing-function
error is not the binding uncertainty.

**Step 5 — sanity check the direction.** A larger relay amplitude with the same
process gives a proportionally larger oscillation, so $K_u$ is unchanged — the
ratio $d/a$ is the invariant. If doubling the relay amplitude does **not**
double the oscillation, the process is nonlinear and none of this applies.`,
      examTip: 'The relay formula K_u = 4d/(πa) is the one piece of describing-function analysis the FE expects. Remember its shape: relay amplitude on top, oscillation amplitude on the bottom, and 4/π from the fundamental Fourier coefficient of a square wave. The period you measure IS P_u, with no conversion.',
      importantNote: 'The reaction-curve and ultimate-gain methods do NOT agree, even on the same plant. On the three-lag process worked here they differ by 15% in proportional gain and produce 51.8% against 40.6% overshoot. Which is right depends on whether the plant has real transport delay (reaction curve) or distributed lag (ultimate gain or relay). An exam question that supplies θ and τ wants the reaction-curve table; one that supplies K_u and P_u wants the ultimate-gain table.',
    },
    {
      id: 'pid-discrete-and-cascade',
      title: '9. Discrete PID and Cascade Control',
      content: `## 9.1 The Same Controller, Now Sampled

Every PID built since about 1980 runs in software. The integral becomes a
running sum, the derivative a difference, and the plant sees a signal held
constant between samples. Writing $e_k = e(kT_s)$ and using a backward
difference for both operations:

$$I_k = I_{k-1} + T_se_k, \\qquad D_k = \\frac{e_k - e_{k-1}}{T_s}$$

$$u_k = K_pe_k + K_iI_k + K_dD_k$$

In practice the derivative is filtered exactly as in Section 5.4, which in
discrete form is one first-order recursion:

$$x_k = x_{k-1} + \\alpha (e_k - x_{k-1}), \\qquad
\\alpha = \\frac{T_s}{\\tau + T_s}, \\qquad \\tau = \\frac{T_d}{N}$$

$$D_k = \\frac{K_d(e_k - x_k)}{\\tau }$$

## 9.2 What Sampling Costs, in Degrees

The zero-order hold holds each command for a full sample interval, which on
average delays the signal by half a sample. A delay of $T_s/2$ contributes
phase

$$\\angle e^{-sT_s/2}\\Big|_{s = j\\omega } = -\\frac{\\omega T_s}{2}
\\ \\mathrm{rad}$$

and no magnitude change at all. **Sampling is a phase-margin tax, payable at
the gain crossover.** Take the detuned PID of Section 4.4 on the three-lag
plant, whose continuous loop crosses over at 1.1395 rad/s with a 49.17° margin.
The tax at each sample interval, and the measured consequence:

| $T_s$ (s) | Samples per rise time | Half-sample lag at crossover | Overshoot | 2% settling |
|---|---|---|---|---|
| — (continuous) | ∞ | 0° | 14.25% | 6.515 s |
| 0.05 | 36.1 | 1.63° | 17.98% | 6.200 s |
| 0.10 | 18.1 | 3.26° | 20.92% | 9.600 s |
| 0.20 | 9.0 | 6.53° | 27.76% | 9.800 s |
| 0.40 | 4.5 | 13.06° | 44.04% | 15.60 s |
| 0.80 | 2.3 | 26.11° | 80.48% | 59.20 s |
| 1.20 | 1.5 | 39.17° | unstable | — |

At $T_s = 0.8$ s the arithmetic is

$$\\frac{\\omega _cT_s}{2} = 1.1395 \\times 0.8/2 = 0.4558\\ \\mathrm{rad}
= 26.11^\\circ$$

which is more than half of the 49.17° the design started with. What is left,
23.06°, is the margin of a badly under-damped loop, and the measured overshoot
is 80.5%. The last row is the same tax pushing
the remaining margin to nothing.

![Step responses of the three-lag plant under the same PID design, first in continuous time and then sampled at zero point zero five, zero point four and zero point eight seconds. The continuous design overshoots fourteen percent; at the coarsest sample interval the overshoot is eighty percent and settling takes almost sixty seconds. Each sampled curve is labelled with the half-sample phase lag it incurs at the crossover.](/courses/fe-ee/figures/ctl4-pid-sampling.svg)

### Worked Example 12 — Choosing the Sample Interval

**Given** a loop whose continuous design crosses over at $\\omega _c = 1.1395$
rad/s with a 49.17° phase margin, choose $T_s$ so that sampling costs no more
than 5° of margin.

**Step 1 — turn degrees into radians.**

$$5^\\circ = 5 \\times \\pi /180 = 0.08727\\ \\mathrm{rad}$$

**Step 2 — invert the half-sample lag.**

$$\\frac{\\omega _cT_s}{2} \\leq 0.08727 \\Rightarrow
T_s \\leq \\frac{2 \\times 0.08727}{1.1395} = 0.1532\\ \\mathrm{s}$$

**Step 3 — cross-check against the two rules of thumb.** The sampling frequency
rule asks for $\\omega _s \\geq 20\\omega _c$, that is

$$T_s \\leq \\frac{2\\pi }{20 \\times 1.1395} = 0.2757\\ \\mathrm{s}$$

and the time-domain rule asks for at least ten samples across the rise time of
1.806 s, that is $T_s \\leq 0.1806$ s. All three land between 0.15 and 0.28 s,
which is the usual outcome — the rules of thumb are the phase budget in
disguise.

**Step 4 — check what the loosest of them actually delivers.** From the table,
$T_s = 0.20$ s gives 27.8% overshoot against the continuous design's 14.3%.
The loop is stable and usable, but the overshoot has doubled. **A rule of thumb
buys stability, not fidelity**; if the specification is the overshoot rather
than the margin, sample faster or re-tune for the sampled loop.

**Answer:** $T_s = 0.1$ s or faster, which the table shows costs 3.3° and
6.7 points of overshoot.

## 9.3 Cascade Control: the Inner Loop Does the Work

A cascade puts a second, faster feedback loop inside the first. The primary
controller no longer commands the actuator; it commands the **setpoint of a
secondary loop** that closes around the fast part of the process.

The configuration below is the standard one. A secondary process
$G_2(s) = 1/(s+1)$ — a valve and flow, say — feeds a slow primary process
$G_1(s) = 1/[(4s+1)(10s+1)]$, and the load disturbance enters at the output of
$G_2$, which is where supply-pressure changes and valve nonlinearities live.

**Single-loop design.** One PI controller sees the whole chain
$G_1G_2$. Put its zero on the 10 s pole, so $T_i = 10$ s, and set the gain for
a 50° phase margin. That gives $K_c = 1.8033$ and a gain crossover of 0.1523
rad/s.

**Cascade design.** Close a proportional inner loop with $K_2 = 9$ around
$G_2$. Two things happen at once:

$$T_2(s) = \\frac{K_2}{s + 1 + K_2} = \\frac{9}{s + 10}
\\Rightarrow \\tau _{inner} = \\frac{1}{1 + K_2} = 0.1\\ \\mathrm{s}$$

$$S_2(s) = \\frac{1}{1 + K_2G_2(s)} = \\frac{s+1}{s+10}
\\Rightarrow S_2(0) = \\frac{1}{1 + K_2} = 0.1$$

The inner loop is **ten times faster** than the process it replaces, and it
rejects steady disturbances by a factor of ten before the outer loop is even
consulted. The outer PI, designed on $G_1T_2$ for the **same** 50° margin, gets
$K_c = 2.8730$ and a crossover of 0.2013 rad/s.

**Measure the result.** A unit step load disturbance at the inner output:

| Design | Outer gain | Crossover | Peak deviation | Integrated absolute error |
|---|---|---|---|---|
| Single loop | 1.8033 | 0.1523 rad/s | 0.34465 | 5.549 |
| Cascade, $K_2 = 9$ | 2.8730 | 0.2013 rad/s | 0.02660 | 0.3866 |

A **13.0-fold** reduction in peak deviation and a **14.4-fold** reduction in
integrated error, at identical phase margin. The setpoint response improves too
— 9.38 s to first reach the setpoint against 12.39 s, and 32.5 s to settle
against 40.8 s — but that is the smaller prize.

![Primary output deviation after a unit load step inside the inner loop, comparing a single PI loop with a cascade whose inner proportional gain is nine. Both controllers are tuned to the same fifty degree phase margin. The single loop deviates by zero point three four five and takes most of a minute to recover; the cascade deviates by zero point zero two seven.](/courses/fe-ee/figures/ctl4-pid-cascade.svg)

## 9.4 The Inner Loop's Speed Is the Whole Point

Sweeping the inner gain and re-designing the outer controller for 50° each
time separates the two effects:

| $K_2$ | Inner time constant | $S_2(0) = 1/(1+K_2)$ | Outer gain | Peak deviation |
|---|---|---|---|---|
| 1 | 0.500 s | 0.500 | 4.290 | 0.15273 |
| 3 | 0.250 s | 0.250 | 3.192 | 0.07045 |
| 9 | 0.100 s | 0.100 | 2.873 | 0.02660 |
| 29 | 0.0333 s | 0.0333 | 2.778 | 0.00862 |
| 99 | 0.0100 s | 0.0100 | 2.750 | 0.00256 |

The peak deviation falls faster than $1/(1 + K_2)$ alone would explain — at
$K_2 = 9$ the DC sensitivity is 0.1 but the measured deviation is 7.7% of the
single-loop value. The extra comes from the inner loop's **speed**: with the
secondary lag reduced from 1 s to 0.1 s, the outer loop's own crossover rises
from 0.1523 to 0.2013 rad/s at the same margin, so the outer loop cleans up the
residue faster as well.

This is the design rule in one line: **the inner loop must be much faster than
the outer one, or the cascade buys nothing.** Here the inner time constant is
0.1 s against an outer response time of about 5 s, a ratio of 50. The usual
minimum quoted is 5, and the table shows why — at $K_2 = 1$ the inner loop is
only twice as fast as before and the peak deviation improves by a factor of 2.3
rather than 13.

### Worked Example 13 — Sizing an Inner Loop From a Disturbance Specification

**Given** the cascade above, a load disturbance step of 1 unit at the inner
output, and a specification that the primary output must not deviate by more
than 0.05, choose the inner proportional gain.

**Step 1 — use the sensitivity as a first screen.** The inner loop attenuates
the disturbance by $S_2(0) = 1/(1 + K_2)$ before the outer loop acts, and the
single-loop deviation is 0.34465. A crude screen assumes the outer loop is
unchanged:

$$\\frac{0.34465}{1 + K_2} \\leq 0.05 \\Rightarrow 1 + K_2 \\geq 6.893
\\Rightarrow K_2 \\geq 5.89$$

**Step 2 — check the screen against measurement.** From the sweep, $K_2 = 3$
gives 0.07045 (fails) and $K_2 = 9$ gives 0.02660 (passes with a factor of
1.9 in hand). The screen said $K_2 \\approx 6$; the true threshold is lower
than that, because the screen ignores the outer loop speeding up.

**Step 3 — check the inner loop is fast enough to count.** With $K_2 = 9$ the
inner time constant is 0.1 s against an outer response time near 5 s, a ratio
of 50, comfortably above the factor of 5 the rule of thumb asks for.

**Step 4 — check what limits $K_2$.** Nothing in this idealised inner process
does: $9/(s+10)$ is stable for any positive gain. In practice the secondary
loop has its own unmodelled lags, sensor noise and actuator limits, and those
set the ceiling. Doubling $K_2$ doubles the inner loop's noise gain as surely
as it doubles its speed.

**Answer:** $K_2 = 9$, with the measured deviation of 0.0266 against the
specified 0.05.

## 9.5 Problem Set C — Sampling and Cascades

**C1.** A continuous design has a gain crossover of 4 rad/s. What sample
interval costs exactly 10° of phase margin?
*Answer:* $10^\\circ = 0.174533$ rad, so
$T_s = 2 \\times 0.174533/4 = 0.08727$ s.

**C2.** Same loop. What does the "twenty times the crossover" sampling rule
give, and how many degrees does that cost?
*Answer:* $\\omega _s \\geq 80$ rad/s so
$T_s \\leq 2\\pi /80 = 0.07854$ s. The lag is
$4 \\times 0.07854/2 = 0.15708$ rad, which is 9°.

**C3.** A loop has a 45° phase margin in continuous time and is sampled at
$T_s = 0.25$ s with a crossover of 2 rad/s. Estimate the sampled phase margin.
*Answer:* Lag $= 2 \\times 0.25/2 = 0.25$ rad = 14.32°, so the margin falls
to about 30.7°.

**C4.** An inner loop closes proportional gain 19 around a first-order process
$1/(2s+1)$. Find the inner closed-loop time constant and the DC disturbance
sensitivity.
*Answer:* $T_2 = 19/(2s + 20)$, so the time constant is $2/20 = 0.1$ s
against the original 2 s, a factor of 20 faster, and the sensitivity is
$1/(1 + 19) = 0.05$.

**C5.** Why must the secondary measurement respond to the disturbance before
the primary measurement does, for a cascade to help?
*Answer:* The cascade's advantage is that the inner loop sees the disturbance
early and corrects it before it propagates. If the disturbance affects both
measurements at the same time, the inner loop offers no head start and the
cascade reduces to a single loop with extra hardware.

**C6.** A cascade's inner loop is tuned to be only 1.5 times faster than the
outer loop. What goes wrong?
*Answer:* The inner loop's dynamics now sit inside the outer loop's bandwidth,
so the outer controller sees them as extra lag rather than as a fast slave. The
outer loop must then be detuned, giving away the bandwidth the cascade was
supposed to buy, and the two loops can interact and oscillate against one
another.`,
      examTip: 'The one formula to carry for discrete control is the half-sample lag, ω_c·T_s/2 radians. It converts a sample interval into degrees of phase margin lost, and it is the reason every sampling rule of thumb — twenty times the crossover, ten samples per rise time — lands in the same place. For cascades, remember two numbers: the inner loop is 1/(1 + K_2) times as sensitive to disturbances and 1/(1 + K_2) times as slow as the process it wraps.',
      importantNote: 'A cascade only pays if the secondary measurement responds to the disturbance sooner than the primary one does, and if the inner loop is much faster than the outer. Both conditions are about TIMING, not about gain. A cascade around a disturbance that hits both measurements simultaneously, or an inner loop no faster than the outer, is extra hardware with no benefit.',
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
| Rise time (0→100%) | $t_r = (\\pi - \\arccos \\zeta)/\\omega _d$ | 0.5536 s |
| Settling time (2%) | $t_s \\approx 4/(\\zeta \\omega _n) = 4/3$ | 1.333 s |
| Settling time (5%) | $t_s \\approx 3/(\\zeta \\omega _n) = 3/3$ | 1.000 s |

Simulating the actual step response reproduces the first four to four decimal
places. The settling time is the interesting one: the simulated response makes
its **last** exit from the ±2% band at 1.189 s, not 1.333 s. The formula is not
wrong, it is deliberately conservative — it tracks the exponential envelope
$e^{-\\zeta \\omega _n t}$ rather than the oscillation inside it, and the
oscillation usually happens to be near a zero crossing when the envelope
reaches 2%. It is tempting to conclude that the rule is always conservative,
and at $\\zeta = 0.6$ it is. **It is not conservative in general.** The rule
drops a term that grows with damping, and above $\\zeta = 0.4017$ that omission
outweighs the rounding of $\\ln 50 = 3.912$ up to 4, so the rule starts
promising a settling time the response does not deliver: at $\\zeta = 0.9$ it
predicts $4.444/\\omega _n$ where the measured value is $4.700/\\omega _n$.
Section 5.4 derives the crossover and tabulates the error at every damping
ratio.

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

$$s = -2 \\pm j2.729$$

Simulating that design gives exactly 10.0% overshoot and a settling estimate
of exactly 2 s: both specifications met, neither exceeded. The measured 2%
settling time is 1.752 s, comfortably inside the 2 s the estimate promises —
the usual direction for that rule to be wrong.

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
    {
      id: 'ts-derived-from-the-response',
      title: '5. Every Specification Derived From the Response Itself',
      content: `## 5.1 The Step Response, Once, in Closed Form

Sections 1 to 4 quoted the specification formulas. Every one of them falls out
of a single expression, and deriving it once makes the rest bookkeeping. Drive
the standard second-order system with a unit step:

$$Y(s) = \\frac{\\omega _n^{2}}{s\\left(s^{2} + 2\\zeta \\omega _ns
+ \\omega _n^{2}\\right)}$$

Split off the DC term and complete the square in the remainder:

$$Y(s) = \\frac{1}{s} - \\frac{s + 2\\zeta \\omega _n}
{(s + \\zeta \\omega _n)^{2} + \\omega _d^{2}}$$

$$= \\frac{1}{s} - \\frac{s + \\zeta \\omega _n}
{(s + \\zeta \\omega _n)^{2} + \\omega _d^{2}}
- \\frac{\\zeta \\omega _n}{\\omega _d}\\cdot
\\frac{\\omega _d}{(s + \\zeta \\omega _n)^{2} + \\omega _d^{2}}$$

Both remaining terms are standard transforms, so

$$y(t) = 1 - e^{-\\zeta \\omega _nt}\\left[\\cos \\omega _dt
+ \\frac{\\zeta }{\\sqrt{1 - \\zeta ^{2}}}\\sin \\omega _dt\\right]$$

Collapsing the bracket into a single sinusoid with
$\\varphi = \\arccos \\zeta$ gives the form everything else comes from:

$$y(t) = 1 - \\frac{e^{-\\zeta \\omega _nt}}{\\sqrt{1 - \\zeta ^{2}}}
\\sin (\\omega _dt + \\varphi )$$

Differentiating, the two exponential-times-sinusoid terms cancel and leave
something remarkably simple:

$$\\frac{dy}{dt} = \\frac{\\omega _n}{\\sqrt{1 - \\zeta ^{2}}}
e^{-\\zeta \\omega _nt}\\sin \\omega _dt$$

The velocity is a pure damped sine with **no phase shift**. That single fact
gives the peak time in one line.

## 5.2 Peak Time and Overshoot Are Exact

The derivative vanishes when $\\sin \\omega _dt = 0$, that is at
$\\omega _dt = 0, \\pi , 2\\pi , \\ldots$ The first interior extremum is the
maximum, so

$$t_p = \\frac{\\pi }{\\omega _d}$$

with no approximation anywhere. Substituting back, and using
$\\sin (\\pi + \\varphi ) = -\\sin \\varphi$ together with
$\\sin \\varphi = \\sqrt{1 - \\zeta ^{2}}$:

$$y(t_p) = 1 + \\frac{e^{-\\zeta \\omega _n\\pi /\\omega _d}}
{\\sqrt{1 - \\zeta ^{2}}}\\sqrt{1 - \\zeta ^{2}}
= 1 + e^{-\\pi \\zeta /\\sqrt{1 - \\zeta ^{2}}}$$

$$OS = 100\\,e^{-\\pi \\zeta /\\sqrt{1 - \\zeta ^{2}}}\\ \\%$$

The $\\sqrt{1 - \\zeta ^{2}}$ cancels exactly, which is why overshoot depends on
$\\zeta$ and on nothing else — not on $\\omega _n$, not on the DC gain, not on
the size of the step.

## 5.3 Rise Time to 100% Is Also Exact

The response first reaches its final value when the sinusoid crosses zero:

$$\\sin (\\omega _dt + \\varphi ) = 0 \\Rightarrow \\omega _dt + \\varphi = \\pi$$

$$t_r = \\frac{\\pi - \\varphi }{\\omega _d}
= \\frac{\\pi - \\arccos \\zeta }{\\omega _d}$$

Three exact results, three lines of algebra. The fourth specification is where
the exactness stops.

## 5.4 Settling Time Is Not Exact, and the Usual Rule Is Not Even Conservative

Settling requires $\\lvert y - 1\\rvert$ to stay below a band, and

$$\\lvert y(t) - 1\\rvert = \\frac{e^{-\\zeta \\omega _nt}}
{\\sqrt{1 - \\zeta ^{2}}}\\lvert \\sin (\\omega _dt + \\varphi )\\rvert$$

is a decaying exponential multiplied by an oscillation. Setting that equal to
0.02 is transcendental — there is no closed form. What can be solved exactly is
the **envelope**, obtained by replacing the sine by 1:

$$\\frac{e^{-\\zeta \\omega _nt}}{\\sqrt{1 - \\zeta ^{2}}} = 0.02
\\Rightarrow t_{env} = \\frac{\\ln 50 - \\tfrac{1}{2}\\ln (1 - \\zeta ^{2})}
{\\zeta \\omega _n}$$

with $\\ln 50 = 3.912023$. The familiar rule drops the logarithm of
$1 - \\zeta ^{2}$ and rounds 3.912 up to 4:

$$t_s \\approx \\frac{4}{\\zeta \\omega _n}$$

Those two moves push in **opposite directions**. Rounding up makes the estimate
longer; dropping $-\\tfrac{1}{2}\\ln (1 - \\zeta ^{2})$, which is positive,
makes it shorter. They cancel exactly when

$$-\\tfrac{1}{2}\\ln (1 - \\zeta ^{2}) = 4 - \\ln 50 = 0.087977$$

$$1 - \\zeta ^{2} = e^{-0.175954} = 0.838657 \\Rightarrow \\zeta = 0.401676$$

**Above $\\zeta = 0.4017$ the four-over rule falls below the true envelope**, so
past that damping it is no longer a guaranteed bound. Whether it also falls below
the settling time a simulation *measures* is intermittent rather than universal —
the measured value is a staircase, so the overrun appears at some damping ratios
and not at others. Measuring both against a dense step response with
$\\omega _n = 1$ rad/s:

| $\\zeta$ | $t_p$ exact | $t_r$ exact | $t_s$ measured | Envelope | $4/(\\zeta \\omega _n)$ | Rule error |
|---|---|---|---|---|---|---|
| 0.2 | 3.2064 | 1.8087 | 19.602 | 19.662 | 20.000 | +2.03% |
| 0.3 | 3.2933 | 1.9661 | 11.230 | 13.197 | 13.333 | +18.73% |
| 0.4 | 3.4278 | 2.1629 | 8.4093 | 9.9980 | 10.000 | +18.92% |
| 0.5 | 3.6276 | 2.4184 | 8.0763 | 8.1117 | 8.0000 | **−0.95%** |
| 0.6 | 3.9270 | 2.7679 | 5.9430 | 6.8919 | 6.6667 | +12.18% |
| 0.7 | 4.3991 | 3.2853 | 5.9788 | 6.0696 | 5.7143 | **−4.42%** |
| 0.8 | 5.2360 | 4.1635 | 3.7558 | 5.5286 | 5.0000 | +33.13% |
| 0.9 | 7.2073 | 6.1726 | 4.6996 | 5.2693 | 4.4444 | **−5.43%** |

The peak and rise columns reproduce the closed forms to every digit shown,
because those formulas are exact. The settling column does not, and the three
bold rows are cases where the rule promises a settling time the loop does not
achieve. The envelope column never under-predicts — it is a genuine bound — so
when a specification must be **guaranteed** rather than estimated, use the
envelope, not the rule.

![Measured two percent settling time against damping ratio at unit natural frequency, drawn beside the envelope estimate and the four-over-zeta-omega-n rule. The measured curve is a descending staircase rather than a smooth line, dropping abruptly each time a ripple peak falls inside the band. The envelope curve stays above the measured one everywhere; the four-over rule crosses below it above a damping ratio of about zero point four.](/courses/fe-ee/figures/ctl4-ts-settling-rules.svg)

The staircase in that figure is the reason the settling column wanders. The
2% settling time is the instant the **last** ripple peak drops inside the band,
so as $\\zeta$ changes continuously, a peak eventually crosses the band edge
and the settling time falls discontinuously by roughly half a damped period.
Settling time is not a smooth function of the design parameters, and no formula
built on the envelope can capture that.

### Worked Example 1 — All Five Specifications From One Transfer Function

**Given** $T(s) = 36/(s^{2} + 4.8s + 36)$, compute every transient
specification and compare each with a simulation.

**Step 1 — read the standard form.**

$$\\omega _n^{2} = 36 \\Rightarrow \\omega _n = 6\\ \\mathrm{rad/s},
\\qquad 2\\zeta \\omega _n = 4.8 \\Rightarrow \\zeta = 4.8/12 = 0.4$$

**Step 2 — damped frequency.**

$$\\omega _d = 6\\sqrt{1 - 0.16} = 6 \\times 0.916515 = 5.49909\\ \\mathrm{rad/s}$$

**Step 3 — overshoot.** The exponent is
$\\pi \\zeta /\\sqrt{1 - \\zeta ^{2}} = 1.37110$, so

$$OS = 100e^{-1.37110} = 25.383\\ \\%$$

**Step 4 — peak and rise times.** With $\\arccos 0.4 = 1.15928$ rad,

$$t_p = \\pi /5.49909 = 0.57129\\ \\mathrm{s}, \\qquad
t_r = (3.14159 - 1.15928)/5.49909 = 0.36048\\ \\mathrm{s}$$

**Step 5 — settling time, three ways.**

$$\\frac{4}{\\zeta \\omega _n} = 4/2.4 = 1.6667\\ \\mathrm{s}, \\qquad
t_{env} = \\frac{3.912023 + 0.087177}{2.4} = 1.6663\\ \\mathrm{s}$$

**Step 6 — simulate and compare.**

| Specification | Formula | Simulation | Agreement |
|---|---|---|---|
| Overshoot | 25.383% | 25.383% | exact |
| Peak time | 0.57129 s | 0.57130 s | exact |
| Rise time (0→100%) | 0.36048 s | 0.36048 s | exact |
| 2% settling | 1.6667 s (rule) | 1.4016 s | rule 18.9% conservative |

At $\\zeta = 0.4$ the rule is just below the crossover of Section 5.4, so it is
still on the safe side — barely.

### Worked Example 2 — Where the Settling Rule Is Optimistic

**Given** $\\zeta = 0.7$ and $\\omega _n = 2$ rad/s, decide whether a
specification of "settles within 3 s" is met.

**Step 1 — apply the rule.**

$$t_s \\approx \\frac{4}{0.7 \\times 2} = 4/1.4 = 2.857\\ \\mathrm{s}$$

which passes with 5% to spare.

**Step 2 — apply the envelope instead.** With
$-\\tfrac{1}{2}\\ln (1 - 0.49) = 0.336633$,

$$t_{env} = \\frac{3.912023 + 0.336633}{1.4} = 3.035\\ \\mathrm{s}$$

which **fails**. The two estimates disagree about the verdict, which is the
whole point of knowing where they diverge.

**Step 3 — settle it by simulation.** The measured last exit from the ±2% band
is at **2.989 s**, so the specification is met, but by 0.4% rather than by 5%.
The rule was optimistic by 4.4%, exactly as the Section 5.4 table predicts for
$\\zeta = 0.7$, and the envelope was conservative by 1.5%.

**The lesson.** At $\\zeta$ above 0.4 the four-over rule is an estimate, not a
bound. When a margin is thin, either simulate or use the envelope.

### Worked Example 3 — Working Backwards From a Measured Trace

**Given** an oscilloscope trace of a step response showing 20% overshoot with
the first peak at 0.4 s, recover $\\zeta$, $\\omega _n$ and the settling time.

**Step 1 — damping ratio from the overshoot.** Inverting the exact overshoot
formula with $\\ln 0.20 = -1.609438$:

$$\\zeta = \\frac{1.609438}{\\sqrt{9.869604 + 2.590290}}
= \\frac{1.609438}{3.529858} = 0.455950$$

**Step 2 — damped frequency from the peak time.** Since $t_p = \\pi /\\omega _d$
is exact,

$$\\omega _d = \\pi /0.4 = 7.85398\\ \\mathrm{rad/s}$$

**Step 3 — natural frequency.**

$$\\omega _n = \\frac{\\omega _d}{\\sqrt{1 - \\zeta ^{2}}}
= 7.85398/0.890007 = 8.8246\\ \\mathrm{rad/s}$$

**Step 4 — settling estimate.** With
$\\zeta \\omega _n = 4.0236$,

$$t_s \\approx 4/4.0236 = 0.9941\\ \\mathrm{s}$$

**Step 5 — check the whole reconstruction.** Building
$T(s) = \\omega _n^{2}/(s^{2} + 2\\zeta \\omega _ns + \\omega _n^{2})$ from
those two recovered numbers and simulating it returns 20.000% overshoot and a
peak at 0.4000 s — the measurements we started from — and a measured settling
time of 0.9436 s against that 0.9941 s estimate. Two measured numbers determine
the entire second-order model, which is why a scope trace is worth as much as a
transfer function.`,
      examTip: 'Three of the five specifications are EXACT for a second-order system and one is not. Peak time π/ω_d, overshoot e^(−πζ/√(1−ζ²)) and 0→100% rise (π − arccos ζ)/ω_d have no approximation in them at all. Settling time is transcendental, and 4/(ζω_n) is a rounded envelope estimate that drops below the envelope above ζ = 0.4017, where it stops being a guaranteed bound. If a question asks you to "verify" a settling time, expect the simulated value to differ.',
      importantNote: 'The four-over rule is NOT conservative for well-damped systems. It drops the +½|ln(1−ζ²)| term, which grows with damping, and only the rounding of ln 50 = 3.912 up to 4 pushes the other way. Above ζ = 0.4017 the second effect wins and the rule sinks below the envelope, so it is no longer a bound you can rely on — and at some damping ratios the real response does overrun it: at ζ = 0.9 it promises 4.444/ω_n where the response actually needs 4.700/ω_n, an optimism of 5.4%. Because measured settling is a staircase, that overrun comes and goes with ζ (it appears at 0.5, 0.7 and 0.9 but not at 0.6 or 0.8), so quote the rule as an estimate and the envelope as the bound.',
    },
    {
      id: 'ts-approximations-and-inversion',
      title: '6. Rise-Time Rules Measured, and the Map Run Backwards',
      content: `## 6.1 Two Different Rise Times

"Rise time" means two different things depending on who is asking. Section 5
derived the **0 to 100%** rise time exactly, because for an underdamped
second-order system the response does reach its final value. Instrument makers
and most design texts instead quote the **10% to 90%** rise time, which is
defined for overdamped systems too and is what an oscilloscope measures.

The 10-90 rise time has no closed form. Its defining condition,

$$\\frac{e^{-\\zeta \\omega _nt}}{\\sqrt{1 - \\zeta ^{2}}}
\\sin (\\omega _dt + \\varphi ) = 0.9 \\quad \\text{and} \\quad 0.1$$

is transcendental at both ends, so every published 10-90 formula is a fit. What
follows is a fit made here, from simulated responses, so its error is known
rather than assumed.

## 6.2 The Flat 1.8 Rule, Measured

The commonest shortcut is

$$t_r \\approx \\frac{1.8}{\\omega _n}$$

which has the virtue of not mentioning damping at all, and the corresponding
defect. Measuring $\\omega _nt_r$ from dense simulated step responses:

| $\\zeta$ | $\\omega _nt_r$ (10-90, measured) | Error of the 1.8 rule |
|---|---|---|
| 0.10 | 1.1042 | +63.0% |
| 0.20 | 1.2034 | +49.6% |
| 0.30 | 1.3213 | +36.2% |
| 0.40 | 1.4635 | +23.0% |
| 0.50 | 1.6376 | +9.9% |
| 0.5770 | 1.8000 | 0.0% |
| 0.60 | 1.8541 | −2.9% |
| 0.70 | 2.1262 | −15.3% |
| 0.80 | 2.4675 | −27.1% |
| 0.90 | 2.8830 | −37.6% |

The rule is exact at exactly one damping ratio, $\\zeta = 0.577$, and is wrong
by more than a quarter at both ends of the useful range. It is a reasonable
mental anchor and a poor design tool.

## 6.3 A Fit With a Known Error

Fitting a cubic in $\\zeta$ to the measured values over the range designers
actually use, $0.3 \\leq \\zeta \\leq 0.9$, gives

$$\\omega _nt_r \\approx 1.981\\zeta ^{3} - 0.798\\zeta ^{2}
+ 1.247\\zeta + 0.966$$

whose largest relative error anywhere in that range is **0.11%** — three
hundred times better than the flat rule at $\\zeta = 0.9$, and better than the
precision of any specification a candidate is likely to be given.

![Measured ten to ninety percent rise time against damping ratio at unit natural frequency, with the cubic fit drawn over it as a dashed line and the flat one point eight rule as a horizontal line. The measured curve rises from about one point one at low damping to about two point nine at damping zero point nine; the flat rule crosses it at a single point near damping zero point five eight.](/courses/fe-ee/figures/ctl4-ts-rise-fit.svg)

The dashed fit is indistinguishable from the measurement at this scale, which
is what a 0.11% error looks like. The horizontal line is the 1.8 rule, and the
single crossing is the whole of its accuracy.

### Worked Example 4 — Three Estimates of One Rise Time

**Given** $\\zeta = 0.6$ and $\\omega _n = 4$ rad/s, estimate the 10-90 rise
time by both rules and check against simulation.

**Step 1 — the flat rule.**

$$t_r \\approx 1.8/4 = 0.45\\ \\mathrm{s}$$

**Step 2 — the cubic.** With $\\zeta ^{2} = 0.36$ and
$\\zeta ^{3} = 0.216$:

$$1.981 \\times 0.216 = 0.427896, \\qquad 0.798 \\times 0.36 = 0.28728,
\\qquad 1.247 \\times 0.6 = 0.7482$$

$$\\omega _nt_r \\approx 0.427896 - 0.28728 + 0.7482 + 0.966 = 1.854816$$

$$t_r \\approx 1.854816/4 = 0.463704\\ \\mathrm{s}$$

**Step 3 — simulate.** The measured 10-90 rise time is **0.463513 s**.

**Step 4 — compare.** The cubic is high by 0.041%; the flat rule is low by
2.9%. For this damping ratio the flat rule is near its crossing point and does
respectably; at $\\zeta = 0.8$ it would be low by 27%.

## 6.4 Running the Overshoot Map Backwards

Design questions almost always start from a specification and work towards a
pole location, which means inverting

$$OS = e^{-\\pi \\zeta /\\sqrt{1 - \\zeta ^{2}}}$$

Take logarithms of both sides, square, and solve for $\\zeta$:

$$\\ln OS = \\frac{-\\pi \\zeta }{\\sqrt{1 - \\zeta ^{2}}}
\\Rightarrow \\ln^{2}OS\\,(1 - \\zeta ^{2}) = \\pi ^{2}\\zeta ^{2}$$

$$\\zeta ^{2}\\left(\\pi ^{2} + \\ln^{2}OS\\right) = \\ln^{2}OS
\\Rightarrow \\zeta = \\frac{-\\ln OS}{\\sqrt{\\pi ^{2} + \\ln^{2}OS}}$$

with $OS$ written as a fraction. Because $\\zeta = \\cos \\varphi$ where
$\\varphi$ is the pole's angle from the negative real axis, every overshoot
figure is also an angle, and the constraint "no more than this much overshoot"
is the wedge of Section 3.2. Worth having on tap:

| Overshoot | $\\zeta$ | Wedge half-angle $\\arccos \\zeta$ | $100\\zeta$ (phase-margin rule) |
|---|---|---|---|
| 1% | 0.8261 | 34.30° | 82.6° |
| 2% | 0.7797 | 38.77° | 78.0° |
| 5% | 0.6901 | 46.36° | 69.0° |
| 10% | 0.5912 | 53.76° | 59.1° |
| 15% | 0.5169 | 58.87° | 51.7° |
| 20% | 0.4560 | 62.87° | 45.6° |
| 25% | 0.4037 | 66.19° | 40.4° |
| 30% | 0.3579 | 69.03° | 35.8° |
| 40% | 0.2800 | 73.74° | 28.0° |
| 50% | 0.2155 | 77.56° | 21.5° |

The last column is the "phase margin in degrees is about a hundred times
$\\zeta$" rule, included here so the two most-used approximations sit side by
side. It is honest between roughly 20% and 60% phase margin and drifts
elsewhere.

![The complex plane with two shaded design regions overlaid. A wedge opening leftwards from the origin at a half-angle of fifty-three point seven six degrees is the set of poles with damping at least zero point five nine one two, which is the ten percent overshoot limit. A half-plane two units left of the imaginary axis is the set that settles inside two seconds. The corner where the two boundaries meet is marked with crosses at minus two plus or minus j two point seven two nine.](/courses/fe-ee/figures/ctl4-ts-design-region.svg)

Drawn on the plane, the inverse map becomes geometry. The overshoot budget is a
**wedge**, because it constrains only the angle; the settling budget is a
**half-plane**, because it constrains only the real part. Their boundaries
cross at one point, and that point is the least aggressive design meeting both
— the corner computed in Section 3.2 at $s = -2 \\pm j2.729$.

## 6.5 The Complete Inverse Recipe

Given any two of the five specifications, the second-order model is determined.
The three routes worth memorising:

| Given | Get $\\zeta$ from | Get $\\omega _n$ from |
|---|---|---|
| Overshoot and settling time | $\\zeta = -\\ln OS/\\sqrt{\\pi ^{2} + \\ln^{2}OS}$ | $\\omega _n = 4/(\\zeta t_s)$ |
| Overshoot and peak time | the same inversion | $\\omega _n = \\pi /(t_p\\sqrt{1 - \\zeta ^{2}})$ |
| Peak time and settling time | $\\zeta \\omega _n = 4/t_s$ and $\\omega _d = \\pi /t_p$, then $\\zeta = \\cos [\\arctan (\\omega _d/\\zeta \\omega _n)]$ | $\\omega _n = \\sqrt{(\\zeta \\omega _n)^{2} + \\omega _d^{2}}$ |

### Worked Example 5 — A Design From Two Specifications, Checked

**Given** a requirement of no more than 5% overshoot and a 2% settling time no
greater than 1.0 s, place the closed-loop poles and then predict everything
else.

**Step 1 — damping ratio from the overshoot.** With
$\\ln 0.05 = -2.995732$ and $\\ln^{2}0.05 = 8.974412$:

$$\\zeta = \\frac{2.995732}{\\sqrt{9.869604 + 8.974412}}
= \\frac{2.995732}{4.340970} = 0.690107$$

**Step 2 — decay rate from the settling time.** The corner of the feasible
region takes both constraints with equality, so
$\\zeta \\omega _n = 4/1.0 = 4$ and

$$\\omega _n = 4/0.690107 = 5.7962\\ \\mathrm{rad/s}$$

**Step 3 — the poles.**

$$\\omega _d = 5.7962\\sqrt{1 - 0.476248} = 5.7962 \\times 0.723707
= 4.1948\\ \\mathrm{rad/s}$$

$$s = -4 \\pm j4.1948$$

**Step 4 — predict the rest before simulating.** Peak time
$\\pi /4.1948 = 0.7490$ s; 0 to 100% rise
$(\\pi - \\arccos 0.690107)/4.1948 = 0.5560$ s; 10-90 rise from the cubic,
$0.361891$ s.

**Step 5 — simulate and compare.**

| Specification | Predicted | Simulated |
|---|---|---|
| Overshoot | 5.000% | 5.000% |
| Peak time | 0.7490 s | 0.7489 s |
| Rise time (0→100%) | 0.5560 s | 0.5560 s |
| Rise time (10-90%) | 0.3619 s | 0.3617 s |
| 2% settling | 1.0000 s (rule) | 1.0343 s |

Four of the five agree to four figures. The settling time does not, and it
misses on the **wrong side**: the measured 1.0343 s violates the 1.0 s
specification by 3.4%. At $\\zeta = 0.690$ the four-over rule is well past the
0.4017 crossover of Section 5.4, so the rule was never a bound here — an
overrun was possible, though the staircase means it is not guaranteed at every
damping ratio past the crossover. Backing $\\omega _n$
up to $4.14/0.690107 = 6.0$ rad/s brings the measured settling inside the
specification with margin.

## 6.6 Problem Set A — Forwards and Backwards

**A1.** A second-order system has $\\zeta = 0.3$ and $\\omega _n = 10$ rad/s.
Find the overshoot, peak time and 0-100% rise time.
*Answer:* $\\omega _d = 10\\sqrt{0.91} = 9.53939$ rad/s. Overshoot
$= 100e^{-\\pi (0.3)/0.953939} = 37.23$%. Peak time
$= \\pi /9.53939 = 0.32933$ s. Rise time
$= (3.14159 - 1.26610)/9.53939 = 0.19660$ s.

**A2.** The same system: which settling estimate should you quote, and is the
rule safe here?
*Answer:* $4/(\\zeta \\omega _n) = 4/3 = 1.3333$ s. Since
$\\zeta = 0.3 < 0.4017$, the rule sits above the envelope and is on the safe
side; the measured value is 1.1230 s.

**A3.** A specification asks for at most 15% overshoot. What is the minimum
damping ratio and the maximum pole angle from the negative real axis?
*Answer:* $\\zeta \\geq 0.5169$ and the angle is at most
$\\arccos 0.5169 = 58.87^\\circ$.

**A4.** A trace shows a 10-90% rise time of 0.25 s and 20% overshoot. Estimate
$\\omega _n$.
*Answer:* 20% overshoot gives $\\zeta = 0.45595$, so
$\\zeta ^{2} = 0.207889$ and $\\zeta ^{3} = 0.094787$. The cubic terms are
0.187773, 0.165895 and 0.568570, so
$\\omega _nt_r = 0.187773 - 0.165895 + 0.568570 + 0.966 = 1.556448$
and $\\omega _n = 1.556448/0.25 = 6.2258$ rad/s.

**A5.** Why does the flat 1.8 rule under-predict rise time for well-damped
systems?
*Answer:* Increasing $\\zeta$ at fixed $\\omega _n$ moves the poles towards the
real axis, slowing the approach to the final value. The measured
$\\omega _nt_r$ therefore grows with $\\zeta$, from 1.10 at $\\zeta = 0.1$ to
2.88 at $\\zeta = 0.9$, while a rule that ignores $\\zeta$ stays at 1.8.

**A6.** A design requires $t_p \\leq 0.5$ s and at most 10% overshoot. Find the
pole location that meets both with nothing to spare.
*Answer:* 10% overshoot gives $\\zeta = 0.591155$, and
$\\sqrt{1 - 0.349464} = 0.806558$. Then
$\\omega _d = \\pi /0.5 = 6.28319$ rad/s, so
$\\omega _n = 6.28319/0.806558 = 7.7901$ rad/s and
$\\zeta \\omega _n = 0.591155 \\times 7.7901 = 4.6052$. The poles are
$s = -4.605 \\pm j6.283$.`,
      examTip: 'Keep the two rise times apart. The 0 to 100% rise time (π − arccos ζ)/ω_d is EXACT and is what the second-order derivation gives you; the 10 to 90% rise time is what instruments measure and has no closed form. If a question quotes a rise time without saying which, the presence of the arccos in the answer options tells you it wants the exact one.',
      importantNote: 'The inverse overshoot formula ζ = −ln(OS)/√(π² + ln²OS) takes OS as a FRACTION, not a percentage. Feeding it 10 instead of 0.10 gives ln 10 = +2.303, a positive numerator, and a nonsense negative damping ratio. The sign of the logarithm is the built-in check: for any real overshoot the fraction is below 1, so its logarithm is negative and the leading minus makes ζ positive.',
    },
    {
      id: 'ts-extra-pole-and-zero',
      title: '7. What an Extra Pole or Zero Does to Every Specification',
      content: `## 7.1 Nothing Real Is Second Order

Every formula so far assumes exactly two poles and no zeros. Real loops have
more. This section measures what a third pole and a zero each do to all four
transient specifications, so the size of the error in a second-order estimate
is known rather than hoped for. Throughout, the reference system is

$$T_2(s) = \\frac{1}{s^{2} + s + 1}, \\qquad \\zeta = 0.5,
\\qquad \\omega _n = 1\\ \\mathrm{rad/s}$$

whose measured specifications are 16.303% overshoot, peak at 3.6276 s, 0-100%
rise at 2.4184 s and 2% settling at 8.0763 s.

## 7.2 A Third Pole Slows Everything and Eats the Overshoot

Add a real pole at $s = -\\alpha \\zeta \\omega _n$, scaled so that $\\alpha$
measures how far out it sits compared with the dominant pair's own distance
from the imaginary axis. Keep the DC gain at 1:

$$T_3(s) = \\frac{\\alpha \\zeta \\omega _n\\,\\omega _n^{2}}
{(s + \\alpha \\zeta \\omega _n)(s^{2} + 2\\zeta \\omega _ns + \\omega _n^{2})}$$

Simulating each and measuring:

| $\\alpha$ | Pole at | Overshoot | Peak time | Rise (0-100%) | 2% settling |
|---|---|---|---|---|---|
| 2 | −1.00 | 8.147% | 4.922 s | 3.779 s | 6.637 s |
| 3 | −1.50 | 12.172% | 4.461 s | 3.262 s | 6.421 s |
| 5 | −2.50 | 14.770% | 4.100 s | 2.891 s | 8.384 s |
| 10 | −5.00 | 15.939% | 3.847 s | 2.638 s | 8.261 s |
| 20 | −10.0 | 16.217% | 3.733 s | 2.523 s | 8.173 s |
| ∞ | — | 16.303% | 3.628 s | 2.418 s | 8.076 s |

Three patterns, all monotone in $\\alpha$ and all in the same direction. The
extra pole **reduces** overshoot, **delays** the peak and **slows** the rise.
The reason is the same in each case: a pole is a lag, and the lag both damps
the response and postpones it.

The commonly quoted factor-of-five rule says a pole five times farther out can
be ignored. Measured, at $\\alpha = 5$ the overshoot estimate is off by 1.53
percentage points (10.4% of the true value) and the rise time by 16.3%. **The
rule is good for overshoot and poor for timing** — which is worth knowing,
because most exam questions about dominance are about overshoot.

![Two stacked panels. The upper panel shows step responses of the same dominant pair with a third pole at minus one, minus two point five and minus ten, against the dashed response of the pair alone; the closer the extra pole, the later and lower the peak. The lower panel plots measured overshoot against the extra pole's distance in multiples of zeta omega n, rising towards the second-order value of sixteen point three percent, with the factor-of-five rule of thumb marked.](/courses/fe-ee/figures/ctl4-ts-third-pole.svg)

## 7.3 A Zero Adds a Scaled Derivative

A zero at $s = -z$ multiplies the transfer function by $(s/z + 1)$, and
multiplying by $s$ in the Laplace domain is differentiating in time. So the
response with a zero is

$$y_z(t) = y(t) + \\frac{1}{z}\\frac{dy}{dt}$$

exactly. That single line explains everything a zero does. The derivative of a
step response is a large positive pulse early on, so adding a fraction of it
**raises the early part of the response** — the output rises sooner and
overshoots more — and the effect scales as $1/z$, so a nearby zero matters and
a distant one does not.

Simulating the closed loop and comparing against
$y + y'/z$ computed independently from the second-order response, the two agree
to better than $3\\times 10^{-5}$ at every zero location tested, which is the
check that the identity is being applied correctly rather than merely quoted.

| Zero at | Overshoot | Peak time | Rise (0-100%) | 2% settling |
|---|---|---|---|---|
| −0.25 | 171.23% | 1.489 s | 0.280 s | 10.151 s |
| −0.50 | 69.94% | 1.814 s | 0.605 s | 7.383 s |
| −1.00 | 29.84% | 2.418 s | 1.209 s | 7.505 s |
| −1.50 | 21.71% | 2.804 s | 1.594 s | 7.606 s |
| −2.50 | 17.99% | 3.156 s | 1.947 s | 7.742 s |
| −5.00 | 16.68% | 3.408 s | 2.199 s | 7.890 s |
| −10.0 | 16.39% | 3.523 s | 2.313 s | 7.979 s |
| none | 16.30% | 3.628 s | 2.418 s | 8.076 s |

A zero at $-0.25$, a quarter as far from the origin as the pole pair, turns a 16%
overshoot into **171%**. Nothing in the second-order formulas anticipates that,
which is why "check for zeros" belongs before "read off $\\zeta$".

## 7.4 Two Exact Results for the Zero

Both the peak time and the rise time with a zero can be solved in closed form.
Setting $y_z' = 0$ and $y_z = 1$ in turn, and using
$\\sigma = \\zeta \\omega _n$:

$$t_p = \\frac{1}{\\omega _d}\\left[\\pi - \\arctan \\frac{\\omega _d}
{z - \\sigma }\\right]$$

$$t_r = \\frac{1}{\\omega _d}\\arctan \\frac{\\omega _d}
{\\omega _n^{2}/z - \\sigma }$$

taking the first positive root in each case. Both reproduce the simulated
values to five decimal places at every zero location in the table above.

Subtracting them gives something unexpected. Writing $A = \\omega _dt_p$ and
$B = \\omega _dt_r$ and using the tangent subtraction formula, the numerator and
denominator share the factor $z^{2} - 2\\zeta z + 1$ (for $\\omega _n = 1$),
which cancels to leave

$$\\tan (A - B) = \\frac{\\omega _d}{\\zeta } \\Rightarrow
\\omega _d\\left(t_p - t_r\\right) = \\arccos \\zeta$$

**independent of the zero.** A zero pulls the peak time and the rise time
forward by exactly the same amount; the interval between them is a property of
the pole pair alone. Numerically, for $\\zeta = 0.5$ the product
$\\omega _d(t_p - t_r)$ comes out as 1.04719755 at every zero location tested,
against $\\arccos 0.5 = 1.04719755$.

## 7.5 A Right-Half-Plane Zero Digs a Hole First

If the zero sits at $s = +z$ instead, the identity becomes
$y_z = y - y'/z$, so the derivative pulse is **subtracted**. Since $y'(0^{+})$
dominates the early response, the output starts in the wrong direction:

| Zero at | Overshoot | Deepest undershoot | 2% settling |
|---|---|---|---|
| +1.00 | 20.87% | −0.280 | 8.993 s |
| +2.50 | 17.31% | −0.062 | 8.487 s |

![Two stacked panels. The upper panel shows step responses with a left-half-plane zero at minus zero point five, minus one point five and minus five against the no-zero reference; the nearest zero nearly quadruples the overshoot. The lower panel shows two right-half-plane zeros, at plus one and plus two point five, whose responses dip below zero before climbing to the final value.](/courses/fe-ee/figures/ctl4-ts-zero-effect.svg)

The dip deepens sharply as the zero approaches the origin — moving it from
$+2.5$ to $+1.0$ takes the undershoot from $-0.062$ to $-0.280$ — and, like the
overshoot lift of a left-half-plane zero, it vanishes as the zero moves away. A right-half-plane zero is the signature of a
system that must go the wrong way to go the right way, and no controller can
remove it.

### Worked Example 6 — Is the Second-Order Estimate Good Enough?

**Given** $T(s) = 30/[(s + 6)(s^{2} + 2s + 5)]$, decide whether the dominant
pair alone predicts the response, and measure the error if it is used.

**Step 1 — identify the pair.** The quadratic gives
$\\omega _n = \\sqrt{5} = 2.2361$ rad/s and
$2\\zeta \\omega _n = 2$, so $\\zeta = 1/\\sqrt{5} = 0.4472$. The poles are
$-1 \\pm j2$ and the extra pole is at $-6$, six times farther from the
imaginary axis.

**Step 2 — test dominance by residue, not by distance.** Expanding the step
response in partial fractions gives modal amplitudes

$$\\lvert R_{far}\\rvert = 0.172414, \\qquad
\\lvert R_{pair}\\rvert = 2 \\times 0.622841 = 1.245682$$

$$\\frac{0.172414}{1.245682} = 0.13841$$

The far mode carries under 14% of the dominant pair's amplitude and decays six
times faster, so the pair should dominate.

**Step 3 — predict from the pair alone.** With $\\zeta = 0.4472$ and
$\\omega _n = 2.2361$: overshoot 20.788%, peak time 1.5708 s, rise time
1.0172 s, measured settling 3.7352 s.

**Step 4 — simulate the real third-order system.**

| Specification | Pair alone | Full system | Error |
|---|---|---|---|
| Overshoot | 20.788% | 19.148% | +1.640 points (+8.6%) |
| Peak time | 1.5708 s | 1.7611 s | −10.8% |
| Rise time (0-100%) | 1.0172 s | 1.2076 s | −15.8% |
| 2% settling | 3.7352 s | 3.8946 s | −4.1% |

**Step 5 — read the verdict.** The overshoot estimate is good to under two
percentage points, which for most purposes is fine. The timing estimates are
optimistic by 11% and 16%, which for most purposes is not. Moving the far pole
to $-10$ shrinks the overshoot error to 0.58 points and the largest response
deviation from 0.199 to 0.125.

**The rule to carry.** Dominant-pole reduction is a good estimator of
**overshoot** and a poor estimator of **speed**, and the direction of the speed
error is always the same: the reduced model is faster than reality, because it
has thrown away a lag.

### Worked Example 7 — Predicting a Zero's Effect Without Simulating

**Given** a second-order system with $\\zeta = 0.5$, $\\omega _n = 1$ rad/s and
a zero added at $s = -1.5$, predict the peak time and the rise time.

**Step 1 — collect the constants.**
$\\sigma = \\zeta \\omega _n = 0.5$, $\\omega _d = \\sqrt{0.75} = 0.866025$,
$z = 1.5$.

**Step 2 — peak time.**

$$\\frac{\\omega _d}{z - \\sigma } = \\frac{0.866025}{1.0} = 0.866025,
\\qquad \\arctan 0.866025 = 0.713724\\ \\mathrm{rad}$$

$$t_p = \\frac{3.141593 - 0.713724}{0.866025} = 2.803467\\ \\mathrm{s}$$

**Step 3 — rise time.** With $\\omega _n^{2}/z = 1/1.5 = 0.6666667$:

$$\\frac{\\omega _d}{0.6666667 - 0.5} = \\frac{0.866025}{0.1666667} = 5.19615,
\\qquad \\arctan 5.19615 = 1.380671\\ \\mathrm{rad}$$

$$t_r = \\frac{1.380671}{0.866025} = 1.594262\\ \\mathrm{s}$$

**Step 4 — check the invariant.**

$$\\omega _d\\left(t_p - t_r\\right) = 0.866025 \\times 1.209205 = 1.047202$$

against $\\arccos 0.5 = 1.047198$, agreeing to six figures — the difference is
the rounding carried through the arctangents.

**Step 5 — check against simulation.** The measured values are 2.80346 s and
1.59426 s. Both predictions land within 0.0001 s.

### Worked Example 8 — Which Effect Dominates?

**Given** a closed loop with poles at $-1 \\pm j2$ and $-8$, and a zero at
$-1.2$, decide whether the second-order estimate of 20.8% overshoot is usable.

**Step 1 — rank the two perturbations by distance.** The extra pole is 8 units
out against the pair's 1 unit of real part, a factor of 8 — comfortably beyond
the factor-of-five rule, so on its own it would cost roughly a point of
overshoot.

**Step 2 — assess the zero.** The zero at $-1.2$ is only 1.2 units out,
comparable to the pair's own distance from the origin of
$\\sqrt{1^{2} + 2^{2}} = 2.236$. Section 7.3 shows a zero this close raising
overshoot substantially.

**Step 3 — decide the direction of each error.** The pole lowers overshoot by
about 1 point; the zero raises it by tens of points. They do not cancel; the
zero wins by an order of magnitude.

**Step 4 — the answer.** The 20.8% estimate is not usable. When a zero lies
inside the radius of the dominant pair, no pole-based reduction is meaningful
and the response must be computed, either from $y + y'/z$ or by simulation.

**The general rule.** Rank perturbations by their distance from the origin
relative to $\\omega _n$, not by whether they are poles or zeros. Anything
inside the dominant pair's radius controls the answer.

## 7.6 Problem Set B — Extra Poles and Zeros

**B1.** A system has poles at $-2 \\pm j3$ and $-30$. Estimate the overshoot.
*Answer:* The pair gives $\\omega _n = \\sqrt{13} = 3.6056$ and
$\\zeta = 2/3.6056 = 0.5547$, so overshoot
$= 100e^{-\\pi (0.5547)/0.832050} = 12.28$%. The extra pole is 15 times farther
out, so the estimate is good to a small fraction of a point.

**B2.** Same poles, but a zero is added at $-2.5$. Is the estimate still good?
*Answer:* No. The zero is at 2.5, well inside the pair's radius of 3.606, so it
will raise the overshoot substantially. Compute $y + y'/2.5$ or simulate.

**B3.** A step response starts by dipping to $-0.15$ before rising to 1.
What does that say about the transfer function?
*Answer:* It has an odd number of right-half-plane zeros. The initial slope has
the wrong sign, which only a zero in the right half-plane produces.

**B4.** Why does an extra pole always delay the peak?
*Answer:* Convolving with an extra decaying exponential smooths and shifts the
response later. In transform terms the extra pole adds phase lag at every
frequency, and lag is delay.

**B5.** A dominant pair sits at $-1 \\pm j2$ and a third pole at $-3$. Compute
$\\alpha$ and say from the Section 7.2 table what overshoot error to expect.
*Answer:* $\\alpha = 3/1 = 3$. The table's $\\alpha = 3$ row shows measured
12.17% against the pair's 16.30%, so a second-order estimate would be about 4
points high — too large to ignore.

**B6.** For a system with $\\zeta = 0.6$, $\\omega _n = 4$ rad/s and a zero at
$-10$, use the exact peak-time formula.
*Answer:* $\\sigma = 2.4$, $\\omega _d = 4\\sqrt{0.64} = 3.2$ rad/s. Then
$\\omega _d/(z - \\sigma ) = 3.2/7.6 = 0.421053$, and
$\\arctan 0.421053 = 0.398457$ rad, so
$t_p = (3.141593 - 0.398457)/3.2 = 0.857230$ s, against $\\pi /3.2 = 0.981748$ s
with no zero. The zero pulls the peak 0.1245 s earlier.`,
      examTip: 'The one identity to carry about zeros is y_z(t) = y(t) + y\u2032(t)/z. It says immediately that a zero raises the early part of the response (more overshoot, earlier peak, faster rise), that the effect scales as 1/z so distant zeros do nothing, and that a right-half-plane zero subtracts the derivative and therefore drives the output backwards first.',
      importantNote: 'Dominant-pole reduction is much better at overshoot than at timing. On the worked third-order system, dropping a pole six times farther out costs 1.6 percentage points of overshoot but 11% of peak time and 16% of rise time, and the timing error is always in the optimistic direction. If a specification is about speed rather than shape, do not reduce the model.',
    },
    {
      id: 'ts-error-constants-and-tradeoffs',
      title: '8. Error Constants Derived, and the Specifications You Cannot Have',
      content: `## 8.1 One Derivation Produces the Whole Type Table

Section 2 listed the error constants. They all come from one expression. For
unity feedback the error is the input minus the output, and

$$E(s) = R(s) - Y(s) = R(s) - \\frac{G(s)}{1 + G(s)}R(s)
= \\frac{R(s)}{1 + G(s)}$$

Provided the closed loop is stable, the Final Value Theorem gives

$$e_{ss} = \\lim_{s \\to 0}sE(s) = \\lim_{s \\to 0}\\frac{sR(s)}{1 + G(s)}$$

Now feed it the three standard inputs in turn.

**Step, $R(s) = 1/s$:**

$$e_{ss} = \\lim_{s \\to 0}\\frac{1}{1 + G(s)} = \\frac{1}{1 + K_{p}},
\\qquad K_{p} = \\lim_{s \\to 0}G(s)$$

**Ramp, $R(s) = 1/s^{2}$:**

$$e_{ss} = \\lim_{s \\to 0}\\frac{1}{s\\left[1 + G(s)\\right]}
= \\lim_{s \\to 0}\\frac{1}{s + sG(s)} = \\frac{1}{K_{v}},
\\qquad K_{v} = \\lim_{s \\to 0}sG(s)$$

because the bare $s$ vanishes and only $sG(s)$ survives.

**Parabola, $R(s) = 1/s^{3}$:**

$$e_{ss} = \\lim_{s \\to 0}\\frac{1}{s^{2}\\left[1 + G(s)\\right]}
= \\frac{1}{K_{a}}, \\qquad K_{a} = \\lim_{s \\to 0}s^{2}G(s)$$

## 8.2 Why the Table Has That Staircase Shape

Write the loop gain in the general form with $N$ free integrators:

$$G(s) = \\frac{K\\prod_i(s + z_i)}{s^{N}\\prod_j(s + p_j)}$$

Each constant is a limit of $s^{m}G(s)$ as $s \\to 0$, so the answer depends
only on how $m$ compares with $N$:

- $m < N$: the limit is $\\infty$ — the constant is infinite, the error zero.
- $m = N$: the $s$ powers cancel and the limit is
  $K\\prod z_i/\\prod p_j$ — finite constant, finite error.
- $m > N$: the limit is 0 — the constant is zero, the error infinite.

That is the whole staircase. **Each integrator moves the finite entry one
column to the right**, and everything to its left becomes zero error while
everything to its right becomes infinite error.

| Loop type | $K_{p}$ | $K_{v}$ | $K_{a}$ | Step error | Ramp error | Parabola error |
|---|---|---|---|---|---|---|
| 0 | finite | 0 | 0 | $1/(1 + K_{p})$ | ∞ | ∞ |
| 1 | ∞ | finite | 0 | 0 | $1/K_{v}$ | ∞ |
| 2 | ∞ | ∞ | finite | 0 | 0 | $1/K_{a}$ |

![Tracking error against time for three loops of the same gain but different integrator counts, each driven by the input it can just barely track: a Type 0 loop against a step settling at zero point two, a Type 1 loop against a ramp settling at zero point two five, and a Type 2 loop against a parabola settling at zero point one two five.](/courses/fe-ee/figures/ctl4-ts-error-types.svg)

All three loops in that figure carry the same gain of 40. Only the integrator
count differs, and only the integrator count decides which input each can
follow with a bounded error.

### Worked Example 9 — Error Constants With the Stability Check First

**Given** the unity-feedback loop $G(s) = 40/[s(s+2)(s+5)]$, find the
steady-state error to a unit ramp.

**Step 1 — check stability, because the Final Value Theorem needs it.** The
closed-loop denominator is

$$s(s+2)(s+5) + 40 = s^{3} + 7s^{2} + 10s + 40$$

All coefficients are positive, and for a cubic the Routh condition is
$bc > ad$:

$$7 \\times 10 = 70 > 40$$

Stable. The closed-loop poles are $-6.4133$ and $-0.2934 \\pm j2.4801$.

**Step 2 — identify the type.** One pole at the origin, so Type 1: zero error
to a step, finite error to a ramp, infinite error to a parabola.

**Step 3 — the velocity constant.**

$$K_{v} = \\lim_{s \\to 0}sG(s) = \\frac{40}{2 \\times 5} = 40/10 = 4$$

**Step 4 — the error.**

$$e_{ss} = 1/K_{v} = 1/4 = 0.25$$

**Step 5 — confirm by simulating the error signal.** Driving the loop with a
unit ramp and watching $e(t) = r(t) - y(t)$, the error settles at exactly
0.250000 and stays there. Simulating the same loop against a unit step gives an
error that decays to zero, and against a parabola an error that grows without
bound — the three predictions of the type table, all confirmed.

### Worked Example 10 — A Compound Input

**Given** the same loop, find the steady-state error to
$r(t) = 4 + 6t$.

**Step 1 — use superposition.** The loop is linear, so the error is the sum of
the errors to each component.

**Step 2 — the step component.** Type 1 gives zero error to a step of any
size, so the constant 4 contributes nothing.

**Step 3 — the ramp component.** A ramp of slope 6 contributes

$$e_{ss} = \\frac{6}{K_{v}} = 6/4 = 1.5$$

**Step 4 — the total.** $e_{ss} = 0 + 1.5 = 1.5$.

**Step 5 — the design consequence.** The **slope** scales the error directly.
A specification worded as "track a 6 unit per second ramp with error under 0.4"
requires

$$K_{v} \\geq \\frac{6}{0.4} = 15$$

not 15/6. Reading the slope into $K_v$ correctly is where most marks on this
topic are lost.

## 8.3 Specifications That Cannot Coexist

For a genuinely second-order design, three of the transient specifications are
not independent. Overshoot fixes $\\zeta$; settling time then fixes
$\\zeta \\omega _n$ and therefore $\\omega _n$; and once both are fixed, the
rise time is **determined**, not chosen:

$$t_r = \\frac{f(\\zeta )}{\\omega _n}
= \\frac{f(\\zeta )\\,\\zeta \\,t_s}{4}$$

where $f(\\zeta ) = \\omega _nt_r$ is the measured 10-90 curve of Section 6.
A designer who writes down all three has already over-specified the problem.

The remaining freedom is bounded by hardware. Every actuator and sensor sets a
ceiling on the achievable $\\omega _n$; take 10 rad/s for the sake of a
concrete table. Then each demanded pair puts a floor under $\\omega _n$, and a
specification set is feasible only if the largest floor stays under the
ceiling:

| Demanded OS | Demanded $t_s$ | Demanded $t_r$ (10-90) | $\\zeta$ | $\\omega _n$ needed by $t_s$ | $\\omega _n$ needed by $t_r$ | Binding | Feasible at 10 rad/s? |
|---|---|---|---|---|---|---|---|
| 2% | 1.00 s | 0.30 s | 0.7797 | 5.130 | 7.981 | rise | yes |
| 5% | 1.00 s | 0.30 s | 0.6901 | 5.796 | 6.992 | rise | yes |
| 10% | 1.00 s | 0.30 s | 0.5912 | 6.766 | 6.113 | settling | yes |
| 2% | 2.00 s | 0.60 s | 0.7797 | 2.565 | 3.991 | rise | yes |
| 16.3% | 0.80 s | 0.25 s | 0.5000 | 9.999 | 6.551 | settling | yes, just |
| 10% | 0.50 s | 0.20 s | 0.5912 | 13.533 | 9.1645 | settling | **no** |
| 20% | 0.50 s | 0.20 s | 0.4560 | 17.546 | 7.784 | settling | **no** |
| 5% | 0.40 s | 0.10 s | 0.6901 | 14.491 | 20.977 | rise | **no** |

![Natural frequency required by a design against its overshoot budget, drawn for settling-time demands of zero point four, one and two seconds, with the ten radian per second hardware ceiling as a dashed line. Each curve dips where the rise-time demand takes over from the settling demand as the binding constraint. The tightest settling demand sits entirely above the ceiling.](/courses/fe-ee/figures/ctl4-ts-feasible-map.svg)

Two structural facts show up in that map. Each curve has a **minimum**, because
tightening the overshoot budget raises $\\zeta$, which relaxes the settling
requirement on $\\omega _n$ but tightens the rise requirement — the two pull in
opposite directions and the cheapest design sits where they cross. And the
tightest settling demand never comes below the ceiling at any overshoot budget,
which is the graphical form of "this specification set is infeasible with this
hardware".

### Worked Example 11 — Diagnosing an Infeasible Specification

**Given** a demand for at most 10% overshoot, 2% settling within 0.5 s and a
10-90 rise time within 0.2 s, on hardware limited to $\\omega _n = 10$ rad/s,
say whether it can be met and what has to give.

**Step 1 — damping ratio from the overshoot.** 10% gives
$\\zeta = 0.5912$, non-negotiable, since overshoot depends on nothing else.

**Step 2 — the settling floor.**

$$\\omega _n \\geq \\frac{4}{\\zeta t_s} = 4/0.29558 = 13.533\\ \\mathrm{rad/s}$$

**Step 3 — the rise floor.** At $\\zeta = 0.5912$ the measured
$f(\\zeta ) = 1.8329$, so

$$\\omega _n \\geq 1.8329/0.2 = 9.1645\\ \\mathrm{rad/s}$$

**Step 4 — compare with the ceiling.** The binding requirement is 13.533
rad/s, 35% above the 10 rad/s the hardware allows. **Infeasible.**

**Step 5 — say what has to give, quantitatively.** Three exits, and only three:

- **Relax the settling time.** At $\\omega _n = 10$ the achievable value is
  $4/(0.5912 \\times 10) = 0.6766$ s, so the specification must move from 0.5 s
  to 0.68 s.
- **Relax the overshoot.** Holding $t_s = 0.5$ s at $\\omega _n = 10$ needs
  $\\zeta \\geq 4/(10 \\times 0.5) = 0.8$, which corresponds to 1.52%
  overshoot — a *tighter* overshoot budget, not a looser one. Allowing more
  overshoot makes this worse, not better.
- **Buy faster hardware.** $\\omega _n = 13.6$ rad/s meets everything with the
  rise time to spare.

**Step 6 — note the counter-intuitive part.** The instinct on failing a speed
specification is to allow more overshoot. Here that is exactly wrong: the
settling time depends on the product $\\zeta \\omega _n$, so with
$\\omega _n$ capped, more overshoot means less damping means **slower**
settling. The trade-off only runs the useful way when the rise time is the
binding constraint.

## 8.4 Problem Set C — Errors and Trade-offs

**C1.** For $G(s) = 100/[(s + 4)(s + 25)]$, find the steady-state error to a
unit step.
*Answer:* Type 0, so $K_p = 100/(4 \\times 25) = 100/100 = 1$ and
$e_{ss} = 1/2 = 0.5$.

**C2.** For $G(s) = 500/[s(s + 10)(s + 50)]$, find $K_v$ and the error to a
ramp of slope 2. Check stability first.
*Answer:* Closed-loop denominator $s^{3} + 60s^{2} + 500s + 500$, and
$60 \\times 500 = 30000 > 500$, so it is stable. Then
$K_v = 500/(10 \\times 50) = 500/500 = 1$, and the error to a slope-2 ramp is
$2/1 = 2$.

**C3.** A Type 2 loop has $K_a = 20$. What is its error to
$r(t) = t^{2}/2$, and to $r(t) = 3t$?
*Answer:* $1/20 = 0.05$ to the unit parabola, and zero to any ramp — a Type 2
loop tracks ramps exactly.

**C4.** Why must stability be checked before quoting any of these errors?
*Answer:* The Final Value Theorem is valid only when $sE(s)$ has all its poles
in the left half-plane. An unstable loop has no steady state, and the limit
still returns a finite number, so the formula gives a confident wrong answer.

**C5.** A design must meet 5% overshoot and a 10-90 rise time of 0.3 s. What
settling time comes with it, whether or not it was asked for?
*Answer:* 5% gives $\\zeta = 0.6901$ and $f(\\zeta ) = 2.0976$, so
$\\omega _n = 2.0976/0.3 = 6.992$ rad/s. Then
$t_s \\approx 4/(0.6901 \\times 6.992) = 4/4.82518 = 0.8290$ s. A settling
specification tighter than about 0.83 s is already violated by the other two.

**C6.** A loop meets its overshoot and settling specifications at
$\\omega _n = 8$ rad/s and $\\zeta = 0.6$. The customer now asks for half the
rise time. What must change?
*Answer:* Rise time scales as $1/\\omega _n$ at fixed $\\zeta$, so
$\\omega _n$ must double to 16 rad/s. That also halves the settling time, which
is free, but doubles the required bandwidth and therefore the actuator effort
and the noise admitted. Overshoot does not change at all, because $\\zeta$ has
not moved.

**C7.** Adding an integrator to fix a ramp-tracking error costs what?
*Answer:* 90° of phase lag at every frequency, so the phase margin falls and
the loop must usually be detuned to recover it. That is why Type 2 loops are
uncommon and Type 3 loops essentially do not exist.`,
      examTip: 'Work the type question in this order every time: check stability, count the integrators in the loop gain, pick the matching error constant, then divide the input SLOPE or curvature by it. Skipping the stability check is the classic trap, because the limit still evaluates to a comfortable-looking number on an unstable loop.',
      importantNote: 'Overshoot, settling time and rise time are not three independent specifications for a second-order design — any two determine the third through t_r = f(ζ)·ζ·t_s/4. If all three are written into a requirement, either one is redundant or the set is infeasible. And when the bandwidth is capped, allowing MORE overshoot makes settling time worse, not better, because settling depends on the product ζω_n.',
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

- **Rise time** (10–90% criterion): t_r ≈ 1.8 / ωₙ — the time to climb from 10% to 90% of the final value. This is NOT the time to first reach 100%, which is a different and larger quantity, (π − arccos ζ)/ω_d; at ζ = 0.5 the two differ by 34%. Section 5.4 measures both.
- **Peak time**: t_p = π / ω_d — time of first peak
- **Settling time** (5% criterion): t_s ≈ 3 / σ = 3 / (ζ·ωₙ) — an estimate, not a bound; Section 8.2 measures the error, which reaches 33% either way
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
- Zero at -10: well outside the pole pair, so a SMALL but measurable effect on the transient
- Response: underdamped sinusoid with ζ = 0.5547:
  - Damped frequency ω_d = ωₙ·√(1-ζ²) = 3 rad/s exactly — it is the imaginary part of the pole
  - Rise time (10–90%) ≈ 1.8/3.6056 = 0.4992 s; simulating the pair gives 0.4853 s
  - Settling time (5%) ≈ 3/2 = 1.5 s; simulating the pair gives 1.4672 s
  - Overshoot = exp(-π·0.5547/√(1-0.5547²)) · 100% = 12.31%

**Correction to an earlier printing of this example.** Two numbers here used to be wrong. The overshoot formula with the exact ζ = 2/√13 = 0.5547 returns 12.31%, not 13%; and the zero at -10 is not negligible. Simulating the full system, G(s) = 1.3(s+10)/(s²+4s+13), the measured overshoot is 13.36% and the measured 5% settling time is 1.3657 s — the zero adds 1.05 points of overshoot and makes the system 6.9% quicker to settle. The old figure of "≈13%" happened to sit near the true system's overshoot while being attributed to a formula that does not produce it. Section 9 quantifies the effect of an added zero properly.

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
    {
      id: 'splane-regions-and-loci',
      title: `5. The s-Plane as a Map of Modes`,
      content: `## 5.1 Why a Point in the Plane Is a Waveform

A pole is not a decoration on a diagram. It is a **mode**: a single elementary
waveform that the system is capable of producing on its own, and the plane is
just a convenient way of writing down which waveforms those are. Write a pole
as $p = \\sigma + j\\omega$. The mode attached to it is $e^{pt}$, and its size
at time t is

$$\\lvert e^{pt} \\rvert = \\lvert e^{\\sigma t} \\rvert \\lvert e^{j\\omega t} \\rvert = e^{\\sigma t}$$

because the rotating factor has unit magnitude at every instant. That single
line contains all of stability. The imaginary part spins; only the real part
grows or shrinks. Move a pole up or down and you change how fast the answer
wiggles; move it left or right and you change whether the wiggle dies.

Since a physical system has real coefficients, complex poles arrive in
conjugate pairs, and the two complex modes combine into one real waveform:

$$K e^{pt} + \\bar{K} e^{\\bar{p}t} = 2\\lvert K \\rvert e^{\\sigma t} \\cos(\\omega t + \\angle K)$$

So a conjugate pair is one decaying sinusoid, not two of anything. The pair is
the atom; you never see half of it.

| Region of the plane | What the mode does | Verdict |
|---|---|---|
| Strictly left, $\\sigma < 0$ | $e^{\\sigma t}$ decays to zero | asymptotically stable |
| On the axis, $\\sigma = 0$, simple | constant, or an undying sinusoid | marginal |
| On the axis, $\\sigma = 0$, repeated | grows like $t$, $t^{2}$, ... | unstable |
| Strictly right, $\\sigma > 0$ | $e^{\\sigma t}$ runs away | unstable |
| At the origin, simple | a constant: the integrator's memory | marginal |

The repeated-axis row is the one candidates forget. Two poles stacked at
$s = \\pm j\\omega$ give a term $t\\sin \\omega t$, whose amplitude climbs without
limit even though the poles never left the axis. Marginal stability requires
the axis poles to be **simple**.

## 5.2 Damping Ratio and Natural Frequency Are Polar Coordinates

For an underdamped pair there are two equally good coordinate systems, and the
whole of second-order design consists of moving between them. In Cartesian
form the pair sits at $-\\sigma \\pm j\\omega_d$. In polar form,

$$\\omega_n = \\lvert p \\rvert = \\sqrt{\\sigma^{2} + \\omega_d^{2}}, \\qquad
\\zeta = \\frac{\\sigma}{\\omega_n} = \\cos\\theta$$

where $\\theta$ is measured at the origin from the **negative** real axis round
to the pole. Going the other way,

$$\\sigma = \\zeta\\omega_n, \\qquad \\omega_d = \\omega_n\\sqrt{1 - \\zeta^{2}}$$

Read as polar coordinates, the three families of design constraint become three
familiar shapes, and this is the single most useful picture in the chapter:

- fixing $\\omega_n$ fixes the **radius**, so a constant-$\\omega_n$ locus is a
  circle centred on the origin;
- fixing $\\zeta$ fixes the **angle**, so a constant-$\\zeta$ locus is a pair of
  rays from the origin, symmetric about the real axis;
- fixing $\\sigma$ fixes the **real part**, so a constant-decay locus is a
  vertical line.

![Upper half of the s-plane showing three constant natural frequency circles at two, five and eight radians per second, three constant damping rays at damping ratios of zero point three, zero point six and zero point nine, and a vertical constant decay line at minus two. The wedge-shaped intersection of all three constraint families is shaded, and the pole at minus three plus j four is marked on it with the angle theta drawn at the origin.](/courses/fe-ee/figures/ctl5-region-map.svg)

A specification that names an overshoot, a speed and a bandwidth therefore
carves out a **wedge**: bounded on the outside by a circle, on the sides by two
rays, and on the right by a vertical line. Placing poles is then a matter of
putting them somewhere in the shaded patch, which is a far easier mental task
than juggling three formulas.

### Worked Example 5.1 — One Pair, Six Numbers, All Checked Against a Simulation

**Given** a unit-DC-gain system whose only poles are $s = -3 \\pm j4$. Report
the polar coordinates and every standard response figure — and confirm each
one on a simulated step rather than trusting the map.

**Polar coordinates.**

$$\\omega_n = \\sqrt{3^{2} + 4^{2}} = 5\\ \\mathrm{rad/s}, \\qquad
\\zeta = 3/5 = 0.6, \\qquad \\theta = \\arccos 0.6 = 0.927295\\ \\mathrm{rad}$$

which is $53.1301^\\circ$ off the negative real axis. The transfer function
that goes with this is $G(s) = 25/(s^{2} + 6s + 25)$.

**Overshoot.** The formula gives

$$M_p = 100\\,e^{-\\pi\\zeta/\\sqrt{1-\\zeta^{2}}} = 100\\,e^{-\\pi(0.6)/0.8}
= 100\\,e^{-2.356194} = 9.4780\\%$$

The simulated response peaks at 1.094780, so the **measured** overshoot is
9.4780%. Formula and simulation agree to four decimals.

**Peak time.** Predicted $t_p = \\pi/\\omega_d = 3.141593/4 = 0.785398$ s;
measured 0.785400 s, the difference being the 30 µs spacing of the time grid.

**Rise time, and a warning.** The familiar estimate $t_r \\approx 1.8/\\omega_n$
gives $1.8/5 = 0.36$ s. The measured **10–90%** rise is 0.370810 s, so the
estimate is 2.92% low. The measured **0–100%** rise is 0.553574 s, which is
53.8% larger than that estimate and which matches its own closed form:

$$t_{r,100} = \\frac{\\pi - \\arccos\\zeta}{\\omega_d}
= \\frac{3.141593 - 0.927295}{4} = 0.553574\\ \\mathrm{s}$$

The two rise times are different quantities. Section 5.4 returns to this,
because the chapter above states the wrong one.

**Bandwidth — solved, not read off.** It is tempting to call $\\omega_n$ the
bandwidth. Setting $\\lvert G(j\\omega) \\rvert = 1/\\sqrt{2}$ and solving with a
bracketed root finder gives $\\omega_B = 5.741212$ rad/s, which is
$5.741212/5 = 1.14824$ times $\\omega_n$ — nearly 15% away. Every frequency you
print should be solved for, never estimated from a corner.

**Resonant peak.** Differentiating the magnitude and solving for the stationary
point gives $\\omega_r = 2.645751$ rad/s, and there

$$\\lvert G(j\\omega_r) \\rvert = \\frac{1}{2\\zeta\\sqrt{1-\\zeta^{2}}}
= \\frac{1}{0.96} = 1.041667$$

so this pair has a mild 0.354 dB hump well below $\\omega_n$.

### Worked Example 5.2 — Does a Candidate Pole Meet the Specification?

**Given** the design region drawn above — $\\zeta \\geq 0.5$,
$\\omega_n \\leq 8$ rad/s and $\\sigma \\geq 2$ — decide which of three candidate
pairs may be used.

$$-3 \\pm j4: \\quad \\omega_n = 5, \\quad \\zeta = 3/5 = 0.6, \\quad \\sigma = 3$$

All three tests pass, so this pair is admissible.

$$-1.5 \\pm j6: \\quad \\omega_n = \\sqrt{38.25} = 6.184658, \\quad
\\zeta = 1.5/6.184658 = 0.242536$$

The radius is fine but the angle is far too open and the decay rate of 1.5 is
below the floor of 2, so this pair fails on two counts at once — which is the
usual pattern, because $\\sigma = \\zeta\\omega_n$ ties the two together.

$$-6 \\pm j5: \\quad \\omega_n = \\sqrt{61} = 7.810250, \\quad
\\zeta = 6/7.810250 = 0.768221, \\quad \\sigma = 6$$

Admissible, and comfortably so: it sits just inside the outer circle.

*The trap.* Testing only $\\sigma$. A pole at $-9 \\pm j1$ has an excellent
decay rate of 9, but $\\omega_n = \\sqrt{82} = 9.055385$ breaks the bandwidth
ceiling, and a system that fast will demand actuator effort the specification
was written to avoid.

## 5.3 Reading Magnitude and Angle Off the Map — and When You May Not

The map also evaluates the transfer function. Write it in **factored** form,

$$H(s) = K\\,\\frac{\\prod_{i}(s - z_i)}{\\prod_{j}(s - p_j)}$$

Each factor $(s_0 - z_i)$ is the vector drawn from the zero $z_i$ to the test
point $s_0$. Since magnitudes of a product multiply and angles of a product
add,

$$\\lvert H(s_0) \\rvert = \\lvert K \\rvert
\\frac{\\prod_i \\lvert s_0 - z_i \\rvert}{\\prod_j \\lvert s_0 - p_j \\rvert},
\\qquad
\\angle H(s_0) = \\angle K + \\sum_i \\angle(s_0 - z_i) - \\sum_j \\angle(s_0 - p_j)$$

That is the graphical rule, and it is exact. **It is also conditional on the
factored form**, and here is where a very common error lives: those rules apply
to factors that are *multiplied*. A transfer function presented as a **sum** of
terms — a parallel path, a two-term compensator, the three branches of a PID —
is one complex number, and you cannot get its angle by adding the angles of the
terms. Adding term angles is not an approximation; it is meaningless.

### Worked Example 5.3 — A Sum Is Not a Product

**Given** $G(s) = \\dfrac{1}{s+1} + \\dfrac{4}{s+5}$, evaluate $G(j2)$.

**Each term separately.**

$$\\frac{1}{1 + j2} = 0.200000 - j0.400000, \\qquad
\\lvert \\cdot \\rvert = 0.447214, \\quad \\angle = -63.4349^\\circ$$

$$\\frac{4}{5 + j2} = 0.689655 - j0.275862, \\qquad
\\lvert \\cdot \\rvert = 0.742781, \\quad \\angle = -21.8014^\\circ$$

**Add them as complex numbers**, which is the only legal move:

$$G(j2) = 0.889655 - j0.675862, \\qquad
\\lvert G(j2) \\rvert = 1.117263, \\quad \\angle G(j2) = -37.2236^\\circ$$

**The wrong routes, with their wrong numbers.** Adding the two angles gives
$-63.4349 - 21.8014 = -85.2363^\\circ$, off by 48 degrees. Adding the two
magnitudes gives $0.447214 + 0.742781 = 1.189995$, off by 6.5%.

**The right route through the map.** Put the sum over a common denominator
*first*, so that the expression really is a product of factors:

$$G(s) = \\frac{(s+5) + 4(s+1)}{(s+1)(s+5)} = \\frac{5s + 9}{(s+1)(s+5)}$$

Now the graphical rule applies. The numerator at $s = j2$ is $9 + j10$, of
magnitude 13.453624 and angle $48.0128^\\circ$; the denominator is
$(1+j2)(5+j2) = 1 + j12$, of magnitude 12.041595 and angle $85.2364^\\circ$.
Then

$$\\lvert G(j2) \\rvert = \\frac{13.453624}{12.041595} = 1.117263, \\qquad
\\angle G(j2) = 48.0128 - 85.2364 = -37.2236^\\circ$$

which reproduces the honest answer exactly.

Notice what the factoring exposed: a **zero at $s = -9/5 = -1.8$** that neither
term possessed on its own. Summed forms hide zeros. Before any pole-zero map is
drawn, before any angle is added, the transfer function has to be a single
ratio of polynomials, and the polynomials have to be factored.

## 5.4 A Correction to Section 1.5

Section 1.5 above lists "$t_r \\approx 1.8/\\omega_n$ — time to first reach 100%
of steady state". The estimate is real but the description is not: **1.8/ωₙ is
the 10–90% rise time**, not the time to first touch the final value. Measured
on simulated second-order steps with $\\omega_n = 1$:

| $\\zeta$ | measured $t_r\\omega_n$, 10–90% | measured $t_r\\omega_n$, 0–100% |
|---|---|---|
| 0.3 | 1.3213 | 1.9660 |
| 0.5 | 1.6376 | 2.4184 |
| 0.6 | 1.8541 | 2.7679 |
| 0.7 | 2.1262 | 3.2853 |

Solving for the damping at which the 10–90% figure is exactly 1.8 gives
$\\zeta = 0.5771$; the rule is a fit near that point and drifts either side of
it. At $\\zeta = 0.5$ the true 0–100% rise time is $2.4184/\\omega_n$, which is
34% longer than the quoted $1.8/\\omega_n$ — a large enough gap to change an
answer. Section 1.5 is otherwise sound; treat its rise-time line as the 10–90%
estimate and the 0–100% closed form of Worked Example 5.1 as the exact figure.`,
      examTip: `Convert between the two coordinate systems on sight: ωₙ is the distance from the origin to the pole, ζ is the cosine of the angle back to the negative real axis, σ = ζωₙ is the real part and ω_d is the imaginary part. Constant ωₙ is a circle, constant ζ is a ray, constant σ is a vertical line — a three-part specification is a wedge.`,
      importantNote: `The graphical magnitude and angle rules require the transfer function in FACTORED form, because they rest on the fact that magnitudes multiply and angles add across a product. A transfer function written as a sum of terms — parallel paths, a PID's three branches — must be combined over a common denominator and refactored first. Adding the angles of summed terms is not an approximation, it is simply wrong, and it also hides zeros that the combined form reveals.`,
    },
    {
      id: 'poles-as-terms',
      title: `6. Poles Are Terms: Partial Fractions, Done Properly`,
      content: `## 6.1 The Expansion That Ties a Pole to a Waveform

Section 5 asserted that a pole is a mode. Partial fractions is the calculation
that proves it and, more usefully, tells you **how loud** each mode is. Drive
$H(s)$ with a unit step. The transform of the output is

$$Y(s) = \\frac{H(s)}{s}$$

and the step's own pole at the origin joins the poles of the plant. If all the
poles of Y are simple, Y splits into one first-order piece per pole:

$$Y(s) = \\sum_{k} \\frac{r_k}{s - p_k}
\\qquad\\Longrightarrow\\qquad
y(t) = \\sum_{k} r_k e^{p_k t}$$

One pole, one term, one residue. Nothing is lost and nothing is shared: the
response is a bookkeeping sum over the poles, and the residue $r_k$ is the
weight the system gives that mode.

The residue at a simple pole is obtained by killing the singularity and
evaluating:

$$r_k = \\lim_{s \\to p_k} (s - p_k) Y(s)
= \\frac{N(p_k)}{\\left.\\dfrac{d}{ds}D(s)\\right|_{s = p_k}}$$

writing $Y = N/D$. The derivative form is the one to use in practice because it
needs no cancelling by hand, and it is what a calculator or a script evaluates.

## 6.2 Two Free Checks Worth Applying Every Time

The expansion carries two arithmetic identities that cost nothing and catch
most slips.

**Final value.** As $t \\to \\infty$ every decaying term dies and only the
residue at $s = 0$ survives, so

$$y(\\infty) = r_0 = \\left.sY(s)\\right|_{s=0} = H(0)$$

The residue at the input's pole **is** the DC gain.

**Initial value.** Setting $t = 0$ in the sum,

$$y(0^{+}) = \\sum_k r_k$$

For any strictly proper H the step response starts at zero, so the residues
must sum to zero. If they do not, an arithmetic error has occurred, and you
know it before you draw anything.

## 6.3 Complex Poles Give One Real Term

Conjugate poles have conjugate residues, and the pair collapses to a single
real waveform. With $p = -\\sigma + j\\omega_d$ and residue $r = \\lvert r \\rvert e^{j\\phi}$,

$$r e^{pt} + \\bar{r} e^{\\bar{p}t}
= 2\\lvert r \\rvert e^{-\\sigma t}\\cos(\\omega_d t + \\phi)$$

So the **magnitude** of the residue sets the ringing amplitude and its
**angle** sets the phase of the ring. A candidate who computes a complex
residue and then panics has simply not yet applied this line.

### Worked Example 6.1 — Three Real Poles, Every Term Named

**Given** $G(s) = \\dfrac{60}{(s+1)(s+3)(s+20)}$, expand the step response and
say what each pole actually contributes.

**DC gain first.** $G(0) = 60/60 = 1$, so the response settles at 1 and the
residue at the origin must be 1.

**Residues.** Using $r_k = N(p_k)/D'(p_k)$ with $D(s) = s(s+1)(s+3)(s+20)$, or
equivalently by covering up one factor at a time:

$$r_{-1} = \\frac{60}{(-1)(-1+3)(-1+20)} = \\frac{60}{-38} = -1.578947$$

$$r_{-3} = \\frac{60}{(-3)(-3+1)(-3+20)} = \\frac{60}{102} = +0.588235$$

$$r_{-20} = \\frac{60}{(-20)(-20+1)(-20+3)} = \\frac{60}{-6460} = -0.009288$$

**Check the sum.** $1 - 1.578947 + 0.588235 - 0.009288 = 0.000000$, so the
response starts at zero as it must. **Check the final value.** The origin
residue is 1, which is $G(0)$. Both identities hold, so

$$y(t) = 1 - 1.578947e^{-t} + 0.588235e^{-3t} - 0.009288e^{-20t}$$

**Confirmation by a second route.** The response was also produced by
integrating a state-space realisation, with no partial fractions anywhere in
the calculation, and the simulated curve was then least-squares fitted onto the
basis $\\{1, e^{-t}, e^{-3t}, e^{-20t}\\}$. The recovered coefficients agree
with the residues above to better than $10^{-6}$, and the analytic sum sits on
the simulated curve to within $10^{-8}$ at every instant.

![Two stacked panels sharing a time axis. The upper panel shows the simulated step response of sixty over the product of s plus one, s plus three and s plus twenty, with the sum of the four residue terms drawn dashed on top of it; the two curves are indistinguishable. The lower panel draws each residue term separately: a constant at plus one, a large negative exponential decaying at one per second, a smaller positive exponential decaying at three per second, and a nearly invisible term for the pole at minus twenty.](/courses/fe-ee/figures/ctl5-mode-decomposition.svg)

**What the numbers say.** The pole at $-1$ carries a weight of 1.578947 and
decays with a time constant of 1 s. The pole at $-20$ carries 0.009288 — that
is $0.009288/1.578947 = 0.0058824$, or **0.59%** of the slow pole's weight — and
it is gone within a quarter of a second. It is present in the algebra and
absent from anything you could measure. Dominance is not an assumption here;
it is a computed ratio.

### Worked Example 6.2 — A Complex Pair Plus a Real Pole, in Polar Form

**Given** $H(s) = \\dfrac{25(s+4)}{(s^{2}+2s+5)(s+10)}$, find the step response
in real form.

**Poles and DC gain.** The quadratic factors as $(s+1)^{2}+4$, so the pair is
at $-1 \\pm j2$; the third pole is at $-10$; the zero is at $-4$. The DC gain
is $25(4)/[(5)(10)] = 100/50 = 2$.

**Residues.** With the geometric form of the residue rule — which is the same
formula written as vectors on the map —

$$r_k = K\\,\\frac{\\prod_i (p_k - z_i)}{\\prod_{j \\neq k}(p_k - p_j)}$$

evaluation at each pole of $sH(s)/s$ gives $r_0 = 2$, $r_{-10} = +0.176471$ and

$$r_{-1+j2} = -1.088235 + j0.102941$$

**Collapse the pair.** Its magnitude and angle are

$$2\\lvert r \\rvert = 2.186187, \\qquad \\phi = 174.5962^\\circ = 3.047279\\ \\mathrm{rad}$$

so the real form of the response is

$$y(t) = 2 + 2.186187e^{-t}\\cos(2t + 3.047279) + 0.176471e^{-10t}$$

**Check.** At $t = 0$ the three terms give
$2 + 2.186187\\cos(3.047279) + 0.176471$, and $\\cos(3.047279) = -0.9955558$, so
the middle term is $-2.176471$ and the sum is
$2 - 2.176471 + 0.176471 = 0.000000$. Evaluating this expression against the simulated step
response over ten seconds, the largest disagreement anywhere is
$1.6 \\times 10^{-12}$.

**What it tells you.** The ringing amplitude at $t = 0$ is 2.186187 against a
final value of 2, and the phase near $\\pi$ radians means the cosine starts
close to $-1$: the pair pulls the output down hard at the origin, which is
exactly how a strictly proper response manages to leave from zero. The measured
overshoot of this system is 24.4463% and its peak arrives at 1.3861 s.

## 6.4 Repeated Poles, Briefly

If a pole is repeated m times, the expansion needs m terms for it:

$$\\frac{r_{k,1}}{s-p_k} + \\frac{r_{k,2}}{(s-p_k)^{2}} + \\dots
+ \\frac{r_{k,m}}{(s-p_k)^{m}}
\\;\\longrightarrow\\;
\\left(r_{k,1} + r_{k,2}t + \\dots + \\frac{r_{k,m}t^{m-1}}{(m-1)!}\\right)e^{p_k t}$$

The polynomial prefactor is why repeated poles **on the imaginary axis** are
unstable: $t$ grows without bound and there is no decaying exponential to hold
it down. In the left half plane the exponential always wins eventually, so
repeated LHP poles remain stable — they merely produce the slightly sluggish
$te^{-at}$ shape that a critically damped system is known for.`,
      examTip: `Two checks cost nothing and catch nearly every slip: the residue at s = 0 must equal H(0), and for a strictly proper H all residues must sum to zero because y(0⁺) = 0. Apply both before using any expansion.`,
      importantNote: `A conjugate pole pair produces ONE real term, 2|r|e^(−σt)cos(ω_d t + ∠r). The residue's magnitude sets the ringing amplitude and its angle sets the ringing phase. Never treat the two complex residues as two separate contributions to be added up as real numbers.`,
    },
    {
      id: 'residues-and-nearby-zeros',
      title: `7. Residues, and Why a Pole Beside a Zero Barely Speaks`,
      content: `## 7.1 The Residue Is Geometry on the Map

Section 6 computed residues from polynomials. Written in factored form, the
same quantity becomes a statement about distances and angles on the pole-zero
map, and that is what makes the map predictive rather than decorative. For

$$H(s) = K\\,\\frac{\\prod_i (s - z_i)}{\\prod_j (s - p_j)}$$

the residue at a simple pole $p_k$ is

$$r_k = K\\,\\frac{\\prod_i (p_k - z_i)}{\\prod_{j \\neq k} (p_k - p_j)}$$

Read the two products as vectors drawn on the map. **Every zero appears in the
numerator**, so a zero sitting near $p_k$ multiplies the residue by a short
vector and shrinks it. **Every other pole appears in the denominator**, so a
neighbouring pole divides by a short vector and inflates it. In one line:

$$\\lvert r_k \\rvert = \\lvert K \\rvert
\\frac{\\text{product of distances from } p_k \\text{ to the zeros}}
{\\text{product of distances from } p_k \\text{ to the other poles}}$$

The limiting case is the one that matters. If a zero lands exactly on $p_k$,
one numerator vector has length zero, so $r_k = 0$ and the mode is **not
present at all in the output**. The pole is still in the denominator of H, the
mode is still a solution of the differential equation, and yet its coefficient
in the response is zero. That is the whole content of pole-zero cancellation,
and it is also the reason the dominant-pole approximation is ever legitimate:
a mode with a small residue is quiet whether or not its pole is far away.

## 7.2 How Fast Does a Residue Die as the Zero Closes In?

Linearly, and the constant is computable. Take a family with a fixed pole pair
and a movable zero, normalised so the DC gain stays at 1 for every member:

$$H_z(s) = \\frac{3}{z}\\cdot\\frac{s + z}{(s+1)(s+3)}, \\qquad H_z(0) = 1$$

The step response residue at the pole $s = -1$ is

$$r_{-1} = \\frac{3}{z}\\cdot\\frac{-1 + z}{(-1)(-1+3)}
= -\\frac{3(z-1)}{2z}$$

Write $\\Delta = z - 1$ for the gap between the zero and that pole. Then
$\\lvert r_{-1} \\rvert = 1.5\\Delta/(1 + \\Delta)$, which for small gaps is
$1.5\\Delta$: **the residue is proportional to the distance from the pole to the
zero**, with no threshold and no cliff.

| gap $\\Delta$ | zero at | $r_{-1}$ | share of the $\\Delta = 2$ value |
|---|---|---|---|
| 0.05 | $-1.05$ | $-0.071429$ | 7.14% |
| 0.20 | $-1.20$ | $-0.250000$ | 25.0% |
| 0.50 | $-1.50$ | $-0.500000$ | 50.0% |
| 1.00 | $-2.00$ | $-0.750000$ | 75.0% |
| 2.00 | $-3.00$ | $-1.000000$ | 100% |

Every entry was produced twice: once from the closed form above, and once by
least-squares fitting a simulated step response onto its mode basis. The two
routes agree to better than $10^{-9}$.

![Two panels. The left panel is a log-log plot of the magnitude of the residue at the pole at minus one against the gap between that pole and a nearby zero, over gaps from one thousandth to two; the measured curve lies on a straight line of slope one at small gaps, marked as one point five times the gap. The right panel shows three simulated step responses for zeros at minus one point zero five, minus one point five and minus three, in which the slow exponential term visibly grows as the zero moves away from the pole.](/courses/fe-ee/figures/ctl5-residue-gap.svg)

### Worked Example 7.1 — How Close Is "Close Enough" to Ignore a Mode?

**Given** the family above, find the zero location for which the residue at
$s = -1$ is under 5% of the DC gain, and confirm the answer on a response.

**Set up the inequality.** We need $\\lvert r_{-1} \\rvert \\leq 0.05$, that is

$$\\frac{1.5\\Delta}{1 + \\Delta} \\leq 0.05
\\quad\\Longrightarrow\\quad
1.5\\Delta \\leq 0.05 + 0.05\\Delta
\\quad\\Longrightarrow\\quad
\\Delta \\leq \\frac{0.05}{1.45} = 0.034483$$

So the zero must lie between $-1$ and $-1.034483$: a window only 3.4% wide in
pole position. **Exact cancellation is not required, but near-exact is.**

**Check at the table entry $\\Delta = 0.05$.** The closed form gives
$1.5(0.05)/1.05 = 0.071429$, and the fitted residue from the simulated response
is $-0.071429$. A 5% placement error in the zero leaves a 7.1% mode behind,
not a negligible one.

**Why this is the honest way to phrase dominance.** Nothing in the calculation
mentions how far the pole at $-1$ is from anything. A mode is quiet when its
**residue** is small, and the residue is small either because a zero is nearby
or because the pole is remote. Section 8 measures the second mechanism.

### Worked Example 7.2 — Which Pole Dominates When a Zero Interferes?

**Given** $H(s) = \\dfrac{40(s + 4.2)}{(s+4)(s+1)(s+21)}$, decide which mode
dominates the step response — without simulating.

**Distances from each pole.** Apply the geometric residue rule to
$Y = H/s$, whose poles are $0, -1, -4, -21$.

$$r_{-1} = \\frac{40(-1+4.2)}{(-1)(-1+4)(-1+21)} = \\frac{128}{-60} = -2.133333$$

$$r_{-4} = \\frac{40(-4+4.2)}{(-4)(-4+1)(-4+21)} = \\frac{8}{204} = +0.039216$$

$$r_{-21} = \\frac{40(-21+4.2)}{(-21)(-21+1)(-21+4)}
= \\frac{-672}{-7140} = +0.094118$$

**Read the answer off the residues.** The mode at $-1$ carries 2.133333. The
mode at $-4$ carries 0.039216, which is 1.84% of it, because the zero at
$-4.2$ sits 0.2 away from that pole and nearly silences it. The mode at $-21$
carries 0.094118 despite being remote, because its distance to the zero is
large. So the slowest pole dominates — but the **second** most important mode
is the one at $-21$, not the one at $-4$, which is the opposite of what a
distance-from-the-axis argument would tell you.

*The trap.* Ranking modes by pole position alone. Ranking by residue is the
only correct order, and it costs three divisions.`,
      examTip: `The residue at a pole is the gain K times the product of distances to all zeros, divided by the product of distances to all other poles. A zero close to a pole makes that pole's residue small in direct proportion to the gap — half the distance, half the residue.`,
      importantNote: `A mode is negligible when its RESIDUE is small, not when its pole is far from the imaginary axis. Those two conditions usually coincide, but a zero parked next to a nearer pole can silence it while a remote pole with no zero nearby stays audible. Always rank modes by residue.`,
    },
    {
      id: 'dominance-measured',
      title: `8. The Dominant-Pole Approximation, With Its Error Measured`,
      content: `## 8.1 The Rule of Thumb, and What It Costs

The usual advice is that a pole five or more times deeper into the left half
plane than the dominant one may be discarded. That is a statement about a time
response, so it should be settled by measuring one. Take the two-pole family
with a fixed dominant pole at $-1$ and a second pole at $-r$, normalised to
unit DC gain,

$$G_r(s) = \\frac{r}{(s+1)(s+r)}$$

and compare its step response against the first-order response of $1/(s+1)$.
Both expansions are elementary:

$$y_r(t) = 1 - \\frac{r}{r-1}e^{-t} + \\frac{1}{r-1}e^{-rt},
\\qquad y_1(t) = 1 - e^{-t}$$

Subtract, and the whole approximation error is one clean expression:

$$e_r(t) = y_r(t) - y_1(t) = \\frac{1}{r-1}\\left(e^{-rt} - e^{-t}\\right)$$

Differentiate and set to zero to find where the error is worst:

$$e_r'(t) = 0 \\;\\Longrightarrow\\; e^{(r-1)t} = r
\\;\\Longrightarrow\\; t^{*} = \\frac{\\ln r}{r - 1}$$

Substituting back and simplifying collapses everything to a single power:

$$\\lvert e_r \\rvert_{\\max} = r^{-r/(r-1)}$$

That is a closed form for the cost of dropping a pole, and it holds for any
dominant pole location by time scaling — only the **ratio** r matters.

## 8.2 The Numbers, Measured

Every row below was obtained by integrating both systems and taking the largest
gap between the two curves; the closed form is printed beside it as a check.

| separation r | measured worst error | $r^{-r/(r-1)}$ | instant $t^{*}$ | closed form $\\ln r/(r-1)$ |
|---|---|---|---|---|
| 2 | 0.250000 | 0.250000 | 0.693150 s | 0.693147 s |
| 3 | 0.192450 | 0.192450 | 0.549300 s | 0.549306 s |
| 5 | 0.133748 | 0.133748 | 0.402350 s | 0.402359 s |
| 10 | 0.077426 | 0.077426 | 0.255850 s | 0.255843 s |
| 20 | 0.042707 | 0.042707 | 0.157650 s | 0.157670 s |
| 50 | 0.018465 | 0.018465 | 0.079850 s | 0.079837 s |

![Two panels. The left panel plots the measured worst-case difference between the full two-pole step response and its one-pole reduction, as a percentage of the final value, against the separation ratio from one point six to thirty, with the closed form drawn dashed on top and the five-times and ten-times cases marked at thirteen point three seven and seven point seven four percent. The right panel plots the error against time for separations of three, five and ten, showing that all the error lives in the first second and that its worst instant moves earlier as the separation grows.](/courses/fe-ee/figures/ctl5-dominance-error.svg)

**So the 5× rule costs 13.37% of the final value at its worst instant.** That
is not small. Ten times out still costs 7.74%. Solving
$r^{-r/(r-1)} = 0.01$ with a bracketed root finder gives $r = 95.28$: a
worst-case error of one percent needs a separation of nearly a hundred, not of
five.

This also corrects the estimate in Section 4.3 above, which said that going
from 10× to 5× separation should "roughly double" the error. The measured
increase is from 0.077426 to 0.133748, a factor of
$0.133748/0.077426 = 1.72743$ — not two. The ratio of the two closed forms is
what it is; there is no need to estimate it.

## 8.3 What the Approximation Gets Right and What It Gets Wrong

Look at the right-hand panel of the figure. The error is **one-signed**: the
reduced model is always ahead of the true response, because dropping a pole
throws away a lag. So the dominant-pole model systematically predicts a system
**faster** than the real one, and never slower. The error is also short-lived —
it is essentially gone after the fast mode decays — so quantities read off the
tail (final value, settling instant, the frequency and decay of the ringing)
survive the reduction well, while quantities read off the leading edge (rise
time, initial slope, peak instant) do not.

### Worked Example 8.1 — A Third Pole Behind a Dominant Pair

**Given** a dominant pair at $-1 \\pm j2$ and a third real pole at $-q$, all
with unit DC gain,

$$G_q(s) = \\frac{5q}{(s^{2} + 2s + 5)(s + q)}$$

report how the measured response changes as the third pole retreats.

**The pair on its own** has $\\omega_n = \\sqrt{5} = 2.236068$ rad/s and
$\\zeta = 1/2.236068 = 0.447214$, predicting an overshoot of

$$100\\,e^{-\\pi(0.447214)/\\sqrt{1 - 0.2}} = 20.788\\%$$

and a peak at $t_p = \\pi/2 = 1.570796$ s. Simulated on its own it gives
exactly 20.788% at 1.5708 s, with 5% settling at 2.3452 s.

**With the third pole present,** measured off simulations:

| $q$ | separation $q/1$ | measured overshoot | measured peak time | measured 5% settling |
|---|---|---|---|---|
| 2 | 2 | 9.332% | 2.1752 s | 2.6798 s |
| 3 | 3 | 14.717% | 1.9704 s | 2.6568 s |
| 5 | 5 | 18.430% | 1.8028 s | 2.5507 s |
| 10 | 10 | 20.212% | 1.6801 s | 2.4486 s |
| 40 | 40 | 20.754% | 1.5964 s | 2.3705 s |
| — | pair alone | 20.788% | 1.5708 s | 2.3452 s |

**Read the table.** At the celebrated 5× separation the overshoot prediction is
already good — 18.430% measured against 20.788% predicted, an error of 2.36
percentage points, or 11.3% relative. But the peak time is out by
$1.8028 - 1.5708 = 0.2320$ s, which is 14.8% of the true value, and settling by
0.2055 s. The pattern of Section 8.3 holds exactly: the reduced model is too
fast, and its timing error is worse than its amplitude error.

**The practical reading.** Use dominant-pole reduction to choose between
answers that differ in overshoot. Distrust it when the question turns on a
time, and never quote a reduced-model settling time as a design guarantee.

### Worked Example 8.2 — Settling Time Is a Staircase, Not a Formula

**Given** the standard second-order system, test the claim that
$t_s \\leq 4/(\\zeta\\omega_n)$ for the 2% band.

**Where the claim comes from.** The response envelope is
$e^{-\\zeta\\omega_n t}/\\sqrt{1-\\zeta^{2}}$, and setting the exponential alone
to 0.02 gives $\\zeta\\omega_n t = \\ln 50 = 3.912$, rounded up to 4. But
settling is decided by the last time the **ripple** leaves the band, not by the
envelope, and the ripple only touches the envelope at isolated peaks.

**What is measured.** Simulating with $\\omega_n = 1$ and reading the last
instant outside the 2% band:

| $\\zeta$ | measured $t_s\\zeta\\omega_n$ (2%) | verdict on the rule |
|---|---|---|
| 0.2 | 3.9204 | conservative by 2.0% |
| 0.4 | 3.3637 | conservative by 18.9% |
| 0.5 | 4.0381 | **optimistic** — the rule fails |
| 0.6 | 3.5657 | conservative by 12.2% |
| 0.7 | 4.1851 | **optimistic** — the rule fails |
| 0.8 | 3.0046 | conservative by 33.1% |
| 0.9 | 4.2296 | **optimistic** — the rule fails |

**The structure behind the numbers.** As $\\zeta$ increases, each ripple peak in
turn drops inside the band and stops counting, so the settling time falls off a
cliff, then climbs again until the next peak surrenders. The measured curve is
a **staircase with sawtooth teeth**, not a smooth function, and $4/(\\zeta\\omega_n)$
cuts across it. Scanning $\\zeta$ finely, the bands where the rule is exceeded
are $0.495$–$0.530$, $0.670$–$0.780$ and above $0.885$; the first failure is at
$\\zeta = 0.4904$.

![Measured two percent settling time, scaled by the product of the damping ratio and the natural frequency, plotted against damping ratio from zero point one five to zero point nine five. The curve is a sawtooth staircase that drops sharply each time a ripple peak falls inside the band and climbs in between. The horizontal line at four marks the textbook rule, and the three regions where the measured curve rises above it are shaded.](/courses/fe-ee/figures/ctl5-settling-staircase.svg)

**How to use this.** Treat $4/(\\zeta\\omega_n)$ as an estimate with an error of
roughly $\\pm 35\\%$ in either direction, which is exactly what the table shows.
It is fine for choosing among exam options that differ by a factor of two. It
is not a bound, and at $\\zeta = 0.8$ it is 33.1% pessimistic, which would size
a machine's cycle time a third too long.`,
      examTip: `Dropping a pole r times deeper than the dominant one costs a worst-case error of r^(−r/(r−1)) of the final value: 25% at r = 2, 13.37% at r = 5, 7.74% at r = 10. The error is one-signed — the reduced model is always faster than reality.`,
      importantNote: `The settling-time rules t_s ≈ 4/(ζωₙ) at 2% and 3/(ζωₙ) at 5% are NOT upper bounds. Measured settling is a staircase in ζ, dropping abruptly whenever a ripple peak falls inside the band, and it exceeds the 2% rule over roughly ζ = 0.495–0.530, 0.670–0.780 and above 0.885, while being up to 33% pessimistic elsewhere.`,
    },
    {
      id: 'adding-a-zero',
      title: `9. Adding a Zero: Overshoot, Undershoot and the Derivative Identity`,
      content: `## 9.1 A Zero Adds a Scaled Derivative — Exactly

There is an identity here that removes all guesswork, and it deserves to be
better known than it is. Suppose $H(s)$ has step response $y(t)$. Attach a zero
at $s = -z$ in the DC-gain-preserving way,

$$H_z(s) = \\left(1 + \\frac{s}{z}\\right)H(s)$$

so that $H_z(0) = H(0)$ and only the shape changes. Multiplication by $s$ in
the Laplace domain is differentiation in time, so the new step response is

$$y_z(t) = y(t) + \\frac{1}{z}\\,y'(t)$$

with no approximation of any kind. Put a zero in the **right** half plane
instead, at $s = +z$, and the factor is $(1 - s/z)$, giving

$$y_z(t) = y(t) - \\frac{1}{z}\\,y'(t)$$

Everything a zero does follows from those two lines. A left-half-plane zero
**adds** a scaled copy of the slope, so the response leans forward: it rises
sooner and overshoots more. A right-half-plane zero **subtracts** the slope,
and since the slope is largest and positive early on, the response is dragged
below zero before it recovers. The closer the zero is to the origin, the
smaller z is, the larger $1/z$ is, and the more violent the effect.

## 9.2 The Effect, Measured

Take the reference pair of Section 5, $H(s) = 25/(s^{2}+6s+25)$, whose
undecorated step response overshoots 9.478%. Its derivative is available in
closed form,

$$y'(t) = \\frac{\\omega_n^{2}}{\\omega_d}e^{-\\sigma t}\\sin(\\omega_d t)
= 6.25\\,e^{-3t}\\sin 4t$$

whose maximum is found by solving $4\\cos 4t = 3\\sin 4t$, giving
$t = 0.231824$ s and $y'_{\\max} = 2.494196$. That number sets the scale: a zero
at $-z$ can push the response up by as much as $2.494196/z$ at that instant.

| zero location | measured overshoot | measured minimum | comment |
|---|---|---|---|
| none | 9.478% | 0 | the bare pair |
| $-20$ | 9.843% | 0 | far away, barely felt |
| $-5$ | 19.448% | 0 | comparable to $\\omega_n$: doubled |
| $-2$ | 76.269% | 0 | inside the pair: transformed |
| $+20$ | 9.723% | $-0.025846$ | a nick before the rise |
| $+5$ | 11.975% | $-0.263442$ | a real dip |
| $+2$ | 18.294% | $-0.930122$ | almost the full swing backwards |

Each row was measured on a simulated response, and each was also checked
against $y \\pm y'/z$ evaluated from the closed forms above; the largest
disagreement across all six systems is $1.6 \\times 10^{-11}$.

![Two panels. The left panel shows, for a zero at minus four on a pair with damping ratio zero point six and natural frequency five, the bare step response, the scaled derivative term, and their sum, demonstrating that the sum of the first two curves is the third. The right panel plots measured overshoot against the zero position from one point two to twenty five, falling steeply from about one hundred and fifty percent towards the no-zero value of nine point four eight percent, with the minus two and minus five cases marked.](/courses/fe-ee/figures/ctl5-zero-derivative.svg)

### Worked Example 9.1 — The Identity Checked at One Instant

**Given** the reference pair with a zero added at $s = -4$, verify
$y_z = y + y'/4$ numerically at the instant when $y'$ peaks.

**The three numbers at $t = 0.231824$ s.** Simulating the bare pair gives
$y = 0.401393$. The closed form for the slope gives

$$y'(0.231824) = 6.25\\,e^{-0.695472}\\sin(0.927296) = 2.494196$$

**Combine.**

$$y_z = 0.401393 + \\frac{2.494196}{4} = 0.401393 + 0.623549 = 1.024942$$

Simulating the system **with** the zero and reading its value at the same
instant returns 1.024942 as well. The output has already passed its final value
of 1 by this point. Measuring both crossings, the zero-augmented response
reaches 1 at $t = 0.222120$ s against $t = 0.553574$ s for the bare pair —
59.88% earlier.

**Overshoot.** The full simulation of the zero-augmented system peaks at
1.264076, so the measured overshoot is 26.4076% against 9.478% without the
zero: a single zero at $-4$ has nearly tripled it.

*The trap.* Assuming a left-half-plane zero is harmless because it does not
threaten stability. Stability is untouched; the transient is not. A zero within
a factor of two of $\\omega_n$ dominates the shape of the response.

### Worked Example 9.2 — Why a Right-Half-Plane Zero Must Undershoot

**Given** a stable system with unit DC gain and a real zero at $s = +z$, prove
that the step response must go negative, then measure how far.

**The initial-slope argument.** For the reference pair with an RHP zero,
$H_z(s) = 25(1 - s/z)/(s^{2}+6s+25)$, the initial slope follows from the
initial value theorem applied to $\\dot{y}$:

$$y_z'(0^{+}) = \\lim_{s \\to \\infty} s\\left[sY_z(s)\\right]
= \\lim_{s \\to \\infty} sH_z(s) = -\\frac{\\omega_n^{2}}{z} = -\\frac{25}{z}$$

Negative for every positive z. The output leaves the origin heading the wrong
way, and it must, because the relative degree is two so $y'(0^{+})$ of the bare
system is zero and the zero's contribution is all there is.

**The exact-area argument, which is stronger.** The step response has Laplace
transform $Y_z(s) = H_z(s)/s$. Evaluate that transform at $s = z$:

$$\\int_0^{\\infty} y_z(t)e^{-zt}\\,dt = Y_z(z) = \\frac{H_z(z)}{z} = 0$$

because $H_z(z) = 0$ — that is what it means for z to be a zero. So a
**strictly positive weighting** of $y_z$ integrates to exactly zero. Since
$y_z(t) \\to 1 > 0$, the response is positive over most of the axis, and the
only way the weighted integral can vanish is for $y_z$ to be negative
somewhere. The undershoot is forced by the location of the zero and no
controller can argue with it. Evaluating that integral numerically for
$z = 2, 5$ and $20$ returns $-2.7\\times 10^{-14}$, $-1.3\\times 10^{-15}$ and
$+5.1\\times 10^{-17}$ — zero to quadrature precision, in all three cases.

**How deep.** For small t the bare response is $y \\approx \\omega_n^{2}t^{2}/2$
and its slope is $\\omega_n^{2}t$, so

$$y_z \\approx \\frac{\\omega_n^{2}t^{2}}{2} - \\frac{\\omega_n^{2}t}{z}$$

which is least at $t = 1/z$ with value $-\\omega_n^{2}/(2z^{2}) = -12.5/z^{2}$.
Against the measured depths:

| z | small-t estimate $12.5/z^{2}$ | measured depth | measured instant |
|---|---|---|---|
| 2 | 3.125 | 0.930122 | 0.1687 s |
| 5 | 0.500 | 0.263442 | 0.1159 s |
| 20 | 0.03125 | 0.025846 | 0.0430 s |

The estimate is only good once z is well beyond $\\omega_n$ — at $z = 20$ it is
21% high, at $z = 2$ it is more than three times too deep, because by $t = 0.5$
s the quadratic approximation to $y$ has long since failed. The **inverse-square
trend** it predicts is nevertheless right, and that is the sentence worth
carrying: halve the distance of an RHP zero from the origin and the undershoot
roughly quadruples.

![Two panels. The left panel shows step responses of a fixed pole pair with a right-half-plane zero at plus two, plus five and plus twenty; each starts by moving downwards, most severely for the nearest zero, before recovering to the same final value. The right panel is a log-log plot of measured undershoot depth as a percentage of the final value against zero position, alongside the twelve point five over z squared small-time estimate.](/courses/fe-ee/figures/ctl5-nmp-undershoot.svg)`,
      examTip: `Adding a zero at s = −z multiplies the transfer function by (1 + s/z) and adds y′/z to the step response; a zero at s = +z multiplies by (1 − s/z) and SUBTRACTS y′/z, which is why right-half-plane zeros undershoot. The effect scales as 1/z, so only zeros within a few times ωₙ matter.`,
      importantNote: `The undershoot of a non-minimum-phase system is forced by an exact identity, not by tuning: the weighted integral of y(t)e^(−zt) over all time is exactly zero whenever z is a right-half-plane zero. A response that ends up positive and integrates to zero under a positive weight must go negative somewhere.`,
    },
    {
      id: 'adding-a-pole-and-cancellation',
      title: `10. Adding a Pole, and Cancelling One Badly`,
      content: `## 10.1 Adding a Pole Is the Mirror Image

Where a zero adds a derivative, an extra pole adds an integration. Attaching a
pole at $s = -p$ in the gain-preserving way gives

$$H_p(s) = \\frac{H(s)}{1 + s/p}
\\qquad\\Longleftrightarrow\\qquad
\\frac{1}{p}\\,\\dot{y}_p + y_p = y$$

so the augmented response is the original passed through a first-order lag of
time constant $1/p$. The consequences are exactly the ones the measured table
of Worked Example 8.1 shows: the response is slower, the overshoot is smaller,
the peak arrives later, and the initial slope is reduced. A pole is a smoother,
a zero is a sharpener, and both act with a strength proportional to how close
they sit to the region of the plane the dominant modes occupy.

| | left-half-plane zero at $-z$ | extra pole at $-p$ |
|---|---|---|
| Operation on $y$ | adds $y'/z$ | first-order lag, constant $1/p$ |
| Overshoot | increases | decreases |
| Rise and peak | earlier | later |
| Initial slope | increases | decreases |
| Effect when far out | vanishes as $1/z$ | vanishes as $1/p$ |
| Stability | untouched | untouched, if in the LHP |

## 10.2 Cancellation, and Why It Is Not a Design Method

If a compensator zero is placed exactly on a plant pole, Section 7 says the
residue of that mode becomes exactly zero and the mode vanishes from the
output. On paper this is irresistible: put a zero on the sluggish plant pole,
replace it with a faster one, and the sluggishness is gone. In practice the
plant pole is never exactly where the data sheet says, and the question is what
a small mismatch leaves behind.

Section 7.2 already answers it: **the surviving residue is proportional to the
gap.** The mode does not decay faster because it was nearly cancelled — its
pole has not moved, so it decays at exactly the rate it always did. What
shrinks is only how loud it is. A nearly cancelled slow pole leaves a **small
but very long** tail, and small-but-long is precisely the shape that ruins a
settling-time specification.

### Worked Example 10.1 — A 2% Mismatch on a Stable Pole

**Given** a plant with a slow pole at $s = -0.4$ and faster poles at $-5$ and
$-8$, compensated by a zero intended to sit on the slow pole,

$$H(s) = \\frac{16}{z_c}\\cdot\\frac{s + z_c}{(s+0.4)(s+5)(s+8)}, \\qquad
z_c = 0.4(1 + \\delta)$$

with unit DC gain for every $\\delta$. Report what a mismatch $\\delta$ leaves.

**The residue at the slow pole.** Applying the geometric rule of Section 7.1
to $Y = H/s$,

$$r_{-0.4} = \\frac{16}{z_c}\\cdot\\frac{-0.4 + z_c}{(-0.4)(4.6)(7.6)}
= -\\,\\frac{16}{13.984}\\cdot\\frac{\\delta}{1+\\delta}$$

because $z_c - 0.4 = 0.4\\delta$ and the $0.4$ cancels. The coefficient is
$16/13.984 = 1.144165$, so a mismatch of $\\delta$ leaves a residue of about
$1.144165\\delta$ for small $\\delta$ — again strictly linear.

**The measured consequences.**

| mismatch $\\delta$ | residue at $-0.4$ | measured 5% settling | measured 2% settling |
|---|---|---|---|
| 0% | 0.000000 | 0.7830 s | 0.9716 s |
| 2% | $-0.022435$ | 0.8578 s | 1.2065 s |
| 5% | $-0.054484$ | 1.0339 s | 2.5065 s |
| 20% | $-0.190694$ | 3.3466 s | 5.6373 s |

**Read the third column against the fourth.** At a 5% mismatch the 5% settling
time has grown by 32%, but the 2% settling time has grown by **158%**, from
0.9716 s to 2.5065 s. The tighter the tolerance band, the more damage a small
leftover residue does, because the leftover mode decays at only $0.4$ per
second and needs $\\ln(0.054484/0.02)/0.4 = 2.505$ s merely to fall inside a 2%
band on its own. At a 20% mismatch the specification is not so much missed as
abandoned.

![Two panels, both with logarithmic vertical axes. The left panel plots the distance of the step response from its final value against time for a stable slow pole cancelled exactly, five percent off and twenty percent off; the exact case plunges out of view while the two mismatched cases leave straight slow tails. The right panel plots the magnitude of the output against time when an unstable pole at plus one is cancelled one, five and twenty percent inexactly; all three cross zero and then grow without bound.](/courses/fe-ee/figures/ctl5-cancellation-risk.svg)

### Worked Example 10.2 — Cancelling an Unstable Pole, Which Is Never Allowed

**Given** a plant with a pole at $s = +1$ and a compensator that places a zero
at $s = +1(1+\\delta)$ to cancel it, forming

$$L(s) = \\frac{5}{z_c}\\cdot\\frac{s - z_c}{(s - 1)(s + 5)}$$

with unit DC gain, show what a 1% error does.

**On paper.** With $\\delta = 0$ the numerator factor $(s-1)$ cancels the
denominator factor and $L(s) = 5/(s+5)$: a placid first-order lag with a time
constant of 0.2 s. Every frequency-domain plot of this system looks perfectly
healthy.

**With a 1% mismatch.** The residue at the surviving pole $s = +1$ is
$-0.008251$, so the response contains the term $-0.008251e^{t}$. Small — for a
while. Measured on the simulation:

$$y(10) = -180.7365, \\qquad y(12) = -1341.8613$$

The output crosses zero on its way past, which on the logarithmic axis of the
figure appears as the sharp notch, and then grows by a factor of e every second
forever, in the direction opposite to the setpoint. A 5% mismatch gives a
residue of $-0.039683$ and $y(10) = -873.0661$, which is
$873.0661/180.7365 = 4.8306$ times larger; solving for when the 5% case reaches
the size the 1% case had at ten seconds gives $t = 8.4239$ s, so the mismatch
buys 1.5761 s and nothing else.

**The rule.** Cancellation can only ever be attempted against **stable,
well-damped** poles, and even then only as a way of tidying a response, never
as a way of removing a mode you are relying on being absent. An unstable pole
must be moved by feedback, which relocates it, rather than by a zero, which
merely hides it from the output. This is the same fact that Section 3.2 states
in state-space language: cancellation destroys observability or
controllability of that mode, and the transfer function stops describing the
whole system.

## 10.3 What This Means for Reading a Map

Two poles and a zero drawn close together on an exam map are a signal, not a
coincidence, and the right response is to ask how close is close. A gap of a
few percent of the pole's distance from the origin leaves a mode of a few
percent — audible in a 2% specification, invisible in a 10% one. A gap
comparable to the pole's own distance from the origin leaves the mode almost
intact. And a pole-zero pair in the right half plane, however tightly matched,
is a system that only appears to work.`,
      examTip: `An added pole lags the response — slower, later, less overshoot; an added zero leads it — faster, earlier, more overshoot. Both effects fade in proportion to 1/(distance), so only poles and zeros within a few times ωₙ change the answer.`,
      importantNote: `Pole-zero cancellation is exact only on paper. A mismatch of δ leaves a residue proportional to δ, and the leftover mode decays at the plant pole's own rate, not faster — a small residue on a slow pole is a small, very long tail. Cancelling an UNSTABLE pole is never acceptable: a 1% mismatch on a pole at +1 leaves 0.008251·e^t, which reaches 180 by ten seconds.`,
    },
    {
      id: 'discrete-map',
      title: `11. The Discrete Map: z = e^(sT) and the Unit Circle`,
      content: `## 11.1 Sampling Turns an Exponential into a Power

A digital controller sees the plant only at the sampling instants $t = kT$.
Sample the continuous mode $e^{pt}$ at those instants:

$$\\left.e^{pt}\\right|_{t = kT} = e^{pkT} = \\left(e^{pT}\\right)^{k} = z^{k},
\\qquad z = e^{pT}$$

A continuous mode becomes a geometric sequence, and the number that governs it
is $z = e^{pT}$. That single substitution is the whole of the mapping between
the two planes. Write $p = \\sigma + j\\omega$ and split it:

$$\\lvert z \\rvert = e^{\\sigma T}, \\qquad \\angle z = \\omega T$$

The **real** part of the continuous pole becomes the **radius** of the discrete
pole; the **imaginary** part becomes its **angle**. Every statement about the
left half plane translates immediately:

| s-plane | becomes | z-plane |
|---|---|---|
| $\\sigma < 0$ (left half) | $e^{\\sigma T} < 1$ | inside the unit circle |
| $\\sigma = 0$ (the axis) | $e^{0} = 1$ | on the unit circle |
| $\\sigma > 0$ (right half) | $e^{\\sigma T} > 1$ | outside the unit circle |
| $s = 0$ (integrator) | $e^{0} = 1$ | $z = 1$ |
| vertical line $\\sigma = $ const | fixed radius | circle centred at the origin |
| horizontal line $\\omega = $ const | fixed angle | ray from the origin |
| $\\omega = \\pi/T$ (Nyquist) | angle $\\pi$ | $z = -1$ |

**Discrete stability is therefore "all poles strictly inside the unit
circle"**, and the unit circle plays exactly the role the imaginary axis plays
in continuous time.

![Two panels. The left panel shows a strip of the s-plane from minus twenty to zero with the Nyquist limits at plus and minus thirty one point four radians per second marked, two vertical constant-decay lines at minus three and minus twelve, four horizontal constant-frequency lines at plus and minus four and plus and minus sixteen, and the pole pair at minus three plus and minus j four. The right panel shows the corresponding z-plane with the unit circle, the two vertical lines mapped to concentric circles of radius zero point seven four one and zero point three zero one, the horizontal lines mapped to rays, and the mapped pole pair marked inside the unit circle.](/courses/fe-ee/figures/ctl5-zplane-map.svg)

## 11.2 The Mapping Is Many-to-One

Because $e^{j\\omega T}$ repeats every $2\\pi$, the continuous frequencies
$\\omega$ and $\\omega + 2\\pi/T$ land on **the same point** in the z-plane. Only
the horizontal strip

$$-\\frac{\\pi}{T} < \\omega \\leq \\frac{\\pi}{T}$$

maps one-to-one, and that boundary is the Nyquist frequency. A continuous mode
ringing faster than the Nyquist rate is indistinguishable, at the sampling
instants, from a slower one — this is aliasing, seen as a geometric fact rather
than as a signal-processing slogan. Going backwards from z to s therefore
returns infinitely many answers, and the convention is to take the one inside
the strip.

### Worked Example 11.1 — Mapping a Pair into the z-Plane

**Given** the reference pair $s = -3 \\pm j4$ sampled at $T = 0.1$ s, find the
discrete poles and everything they imply.

**Radius and angle.**

$$\\lvert z \\rvert = e^{-3(0.1)} = e^{-0.3} = 0.740818, \\qquad
\\angle z = 4(0.1) = 0.4\\ \\mathrm{rad} = 22.9183^\\circ$$

**Rectangular form.** With $\\cos 0.4 = 0.921061$ and $\\sin 0.4 = 0.389418$,

$$z = 0.740818(0.921061 \\pm j0.389418) = 0.682339 \\pm j0.288488$$

Inside the unit circle, so the sampled system is stable.

**Confirmation by a genuinely different route.** Forming the zero-order-hold
discretisation of the state-space realisation and taking the eigenvalues of the
discrete state matrix gives the same two numbers to within
$1.6 \\times 10^{-16}$. The mapping $z = e^{sT}$ is not an approximation to the
discretisation; for the poles it **is** the discretisation.

**Decay in samples.** The envelope shrinks by the factor $\\lvert z \\rvert$ per
sample. Solving $\\lvert z \\rvert^{k} = 0.05$ gives

$$k = \\frac{\\ln 0.05}{\\ln 0.740818} = \\frac{-2.995732}{-0.300000} = 9.9858
\\ \\mathrm{samples}$$

which is $9.9858 \\times 0.1 = 0.99858$ s, against the continuous estimate
$3/\\sigma = 1$ s. The two agree because they are the same calculation.

**Ringing in samples.** The angle advances by 0.4 rad per sample, so one full
cycle takes

$$\\frac{2\\pi}{\\omega_d T} = \\frac{6.283185}{0.4} = 15.70796\\ \\mathrm{samples}$$

Roughly sixteen samples per ring: enough for a controller to see the
oscillation, and a useful sanity check on a chosen sample rate.

**End-to-end check.** Running the discrete state equations forward as a plain
difference equation for forty steps and comparing against the continuous
simulation at the same instants gives a worst disagreement of
$2.3 \\times 10^{-12}$.

### Worked Example 11.2 — Reading a Discrete Pole Backwards

**Given** a discrete pole at $z = 0.9$ with $T = 0.05$ s, and another at
$z = -0.5$ with $T = 0.1$ s, find the continuous poles they correspond to.

**The positive real one.** With $\\angle z = 0$ the continuous pole is purely
real:

$$s = \\frac{\\ln 0.9}{0.05} = \\frac{-0.1053605}{0.05} = -2.107210\\ \\mathrm{s}^{-1}$$

so the time constant is $\\tau = 1/2.107210 = 0.474561$ s, and the mode decays
without any oscillation at all.

**The negative real one.** A negative z has angle $\\pi$, so

$$s = \\frac{\\ln 0.5 + j\\pi}{0.1} = \\frac{-0.6931472 + j3.1415927}{0.1}
= -6.931472 + j31.415927$$

The imaginary part is exactly $\\pi/T = 31.4159$ rad/s, the Nyquist frequency.
The sampled sequence is $(-0.5)^{k}$, which alternates sign at every step: the
fastest oscillation the sample rate can represent. The mode is stable, since
$\\lvert z \\rvert = 0.5 < 1$, and solving $0.5^{k} = 0.05$ gives
$k = 4.3219$ samples to reach 5%. But a controller with poles near $z = -1$
produces a visibly ragged output even while being perfectly stable, which is
why discrete designs aim for poles on the **positive** real side of the circle.

*The trap.* Treating $\\lvert z \\rvert$ alone as the quality measure. Two poles
at $z = 0.9$ and $z = -0.9$ have identical decay per sample and completely
different behaviour, because the second alternates sign. Radius sets the decay;
angle sets the character.

## 11.3 Damping Read Off the z-Plane

Undoing the map gives the continuous parameters directly from a discrete pole:

$$\\sigma = -\\frac{\\ln \\lvert z \\rvert}{T}, \\qquad
\\omega_d = \\frac{\\angle z}{T}, \\qquad
\\zeta = \\frac{\\sigma}{\\sqrt{\\sigma^{2} + \\omega_d^{2}}}$$

Because $\\zeta$ depends on the ratio of $\\ln\\lvert z\\rvert$ to $\\angle z$,
the constant-$\\zeta$ loci — straight rays in the s-plane — become
**logarithmic spirals** in the z-plane, winding inward from $z = 1$. That is
why z-plane design charts look nothing like s-plane ones even though they carry
the same information.`,
      examTip: `z = e^(sT) splits into two facts: |z| = e^(σT) and ∠z = ωT. Left half plane maps inside the unit circle, the imaginary axis maps onto it, the right half plane maps outside. Discrete stability is |z| < 1 for every pole.`,
      importantNote: `The map is many-to-one: ω and ω + 2π/T give the same z, so only |ω| ≤ π/T is represented faithfully. Going from z back to s, take the answer inside that strip. A pole at z = −1 corresponds to exactly the Nyquist frequency and alternates sign every sample.`,
    },
    {
      id: 'reading-the-map',
      title: `12. Reading a Map by Inspection`,
      content: `## 12.1 The Six-Step Read

This is the skill the exam actually tests: a map appears, four responses are
offered, and thirty seconds are available. Work the map in this order.

1. **Count.** Number of poles minus number of finite zeros is the relative
   degree. Relative degree 1 means the step response leaves the origin with a
   non-zero slope; 2 or more means it leaves flat. That alone eliminates
   options.
2. **Scan the right half plane.** Any pole there and the answer grows. Any
   *zero* there and the answer starts by moving the wrong way, without
   affecting stability at all.
3. **Find the dominant group.** The pole or pair nearest the imaginary axis
   sets the pace, unless a zero sits beside it, in which case its residue is
   small and the next group takes over.
4. **Get $\\zeta$ and $\\omega_n$ from geometry.** The distance from the origin
   to the dominant pair is $\\omega_n$; the cosine of the angle back to the
   negative real axis is $\\zeta$.
5. **Look for near-cancellations.** A pole and a zero drawn almost on top of
   each other cancel almost exactly; strike both out and note the residual.
6. **Get the DC gain from distances**, using the magnitude rule at $s = 0$:

$$H(0) = K\\,\\frac{\\prod_i (0 - z_i)}{\\prod_j (0 - p_j)}
= K\\,\\frac{\\prod_i (-z_i)}{\\prod_j (-p_j)}$$

Then convert $\\zeta$ and $\\omega_n$ into an overshoot and a peak time using
the standard formulas, and you have the response.

### Worked Example 12.1 — A Map Straight to a Response

**Given** the map: poles at $-1.5 \\pm j2$ and at $-8$; one zero, at $-8$; DC
gain 1. Predict the step response, then check every prediction on a simulation.

**Step 1, count.** Three poles, one zero, relative degree 2 — the response
leaves the origin flat.

**Step 2, right half plane.** Empty. Stable, no undershoot.

**Step 5 first, because it is decisive.** The pole at $-8$ and the zero at
$-8$ coincide, so that mode's residue is exactly zero. Strike them both out.
What is left is the pair alone:

$$H(s) = \\frac{6.25(s+8)}{(s^{2}+3s+6.25)(s+8)} = \\frac{6.25}{s^{2}+3s+6.25}$$

**Step 4, geometry.**

$$\\omega_n = \\sqrt{1.5^{2} + 2^{2}} = 2.5\\ \\mathrm{rad/s}, \\qquad
\\zeta = 1.5/2.5 = 0.6$$

**Step 6, DC gain.** $6.25/6.25 = 1$, as stated.

**Predictions.** Overshoot $100e^{-\\pi(0.6)/0.8} = 9.478\\%$; peak time
$\\pi/\\omega_d = 3.141593/2 = 1.5707965$ s; 5% settling roughly
$3/\\sigma = 3/1.5 = 2$ s.

**Measured.** Simulating the full third-order system: overshoot 9.4780%, peak
1.5708 s, 5% settling 2.0916 s. Simulating the reduced pair gives the same
three numbers, and the two responses agree to within $10^{-9}$ at every instant
— because the cancellation here is exact, not approximate.

![Two panels. The left panel is the pole-zero map with a conjugate pair at minus one point five plus and minus j two and a pole at minus eight with a zero drawn as a circle around it. The right panel shows the simulated step response of the full third-order system and of the second-order pair alone; the two curves lie exactly on top of one another, and the measured overshoot, peak time and settling time are printed alongside.](/courses/fe-ee/figures/ctl5-map-to-response.svg)

Note that the settling prediction of 2 s is 4.4% low against the measured
2.0916 s, which is exactly the kind of error Worked Example 8.2 leads you to
expect: at $\\zeta = 0.6$ the rules are neither bounds nor equalities.

### Worked Example 12.2 — A Response Straight to a Map

**Given** a measured step response fitted as

$$y(t) = 1 - 1.25e^{-2t} + 0.25e^{-10t}$$

recover the transfer function.

**Read the poles off the exponents.** Decay rates of 2 and 10 mean poles at
$s = -2$ and $s = -10$. The constant term means the input pole at the origin
is present with residue 1, so $H(0) = 1$.

**Check the residues sum to zero.** $1 - 1.25 + 0.25 = 0.000$, so the response
starts at zero and H is strictly proper. Since there are two poles and the
response starts flat, the relative degree is 2, so there are **no finite
zeros**.

**Assemble and fix the gain.**

$$H(s) = \\frac{K}{(s+2)(s+10)}, \\qquad H(0) = \\frac{K}{20} = 1
\\;\\Rightarrow\\; K = 20$$

**Verify by re-expanding.** The residues of $20/[s(s+2)(s+10)]$ are

$$r_0 = \\frac{20}{20} = 1, \\qquad
r_{-2} = \\frac{20}{(-2)(8)} = -1.25, \\qquad
r_{-10} = \\frac{20}{(-10)(-8)} = 0.25$$

reproducing the measured response exactly. Fitting the simulated step response
of $20/[(s+2)(s+10)]$ onto its mode basis returns the same three residues.

*The trap.* Reading a residue as a pole or a pole as a residue. In
$-1.25e^{-2t}$ the number in the **exponent** is the pole and the number in
**front** is the residue; they answer different questions and are never
interchangeable.

## 12.2 A Checklist of Shapes

| What you see on the map | What the step response does |
|---|---|
| One real pole, no zeros | plain exponential, no overshoot |
| Two real poles, well separated | dominated by the slower; error $r^{-r/(r-1)}$ |
| Two real poles, equal | critically damped, the fastest shape with no overshoot |
| Complex pair, $\\zeta$ near 0.7 | about 5% overshoot, quick and tidy |
| Complex pair, $\\zeta$ near 0.2 | around 53% overshoot, many visible rings |
| Pair with an LHP zero inside $\\omega_n$ | overshoot several times larger |
| Pair with an RHP zero | dips below zero first, depth growing as $1/z^{2}$ |
| Pole and zero nearly coincident | that mode is present but quiet, in proportion to the gap |
| Any pole with $\\mathrm{Re}(s) > 0$ | grows without bound; nothing else matters |
| Repeated poles on the axis | grows like $t$; marginal only if simple |`,
      examTip: `Work a map in a fixed order: relative degree, right-half-plane content, dominant group, ζ and ωₙ from geometry, near-cancellations, DC gain from distances. The answer usually falls out at step 2 or 3 without any algebra.`,
      importantNote: `In a term like −1.25e^(−2t), the exponent is the POLE and the coefficient is the RESIDUE. Going from a response back to a map, the decay rates give the pole locations, the residues give the gain and reveal how many zeros there must be, and the number of terms gives the order.`,
    },
    {
      id: 'pzmap-problem-sets',
      title: `13. Problem Sets`,
      content: `## 13.1 How to Use These

Set 13A runs from the map to the response, which is the direction the exam asks
for most often. Set 13B runs the other way, from a response or a specification
back to pole positions, which is the direction design uses. Set 13C is a set of
speed drills. Work each to a number before reading the solution; every solution
names the wrong answer a hurried candidate produces and states the value it
gives, because recognising your own mistake in a list of four options is a
skill worth rehearsing.

Every numeric answer below was checked against a simulated response, not read
off a map.

### Problem Set 13A — From the Map to the Response

**A1.** A unit-DC-gain system has poles at $s = -2 \\pm j2$ and no finite
zeros. Find $\\omega_n$, $\\zeta$, the percent overshoot and the peak time.

*Solution.* The two coordinates come straight off the geometry:

$$\\omega_n = \\sqrt{2^{2} + 2^{2}} = \\sqrt{8} = 2.828427\\ \\mathrm{rad/s},
\\qquad \\zeta = 2/2.828427 = 0.707107$$

This is the classic $\\zeta = 1/\\sqrt{2}$ case, and the overshoot formula
collapses beautifully because $\\zeta/\\sqrt{1-\\zeta^{2}} = 1$:

$$M_p = 100\\,e^{-\\pi} = 4.3214\\%$$

Peak time is $\\pi/\\omega_d = \\pi/2 = 1.570796$ s. Simulating the system
$8/(s^{2}+4s+8)$ confirms both: measured overshoot 4.3214%, measured peak at
1.5708 s, with 5% settling at 1.0358 s.

*The trap.* Reporting $\\omega_n = 2$ by reading the imaginary part. The
imaginary part is $\\omega_d$, the **damped** frequency; $\\omega_n$ is the
distance from the origin, which here is 41.4% larger.

**A2.** For $G(s) = \\dfrac{40}{(s+2)(s+20)}$, decide whether the pole at
$-20$ may be dropped, and quantify the cost.

*Solution.* The DC gain is $40/40 = 1$. The separation ratio is
$20/2 = 10$, so the reduced model is $2/(s+2)$, also of unit DC gain. The
closed form of Section 8.1 gives a worst-case error of

$$r^{-r/(r-1)} = 10^{-10/9} = 0.077426$$

at $t^{*} = \\ln 10/18 = 0.127921$ s. Simulating both and taking the largest
difference returns 0.077426 at $t = 0.127920$ s. So the reduction costs 7.74%
of the final value at its worst instant, and the reduced model settles at
1.4978 s against a true 1.5505 s — 3.4% optimistic, in the direction Section
8.3 predicts.

*The trap.* Concluding that "10× is plenty" and quoting the reduced settling
time as if it were the real one. A 7.74% transient error is fine for choosing
between options that differ by a factor of two, and useless for a specification
written to 5%.

**A3.** A map shows poles at $-1 \\pm j2$ and $-10$, one zero at $-4$, and a
DC gain of 2. Write $H(s)$, then state which mode dominates and what the
response looks like.

*Solution.* Assemble from the map and fix the gain:

$$H(s) = \\frac{K(s+4)}{(s^{2}+2s+5)(s+10)}, \\qquad
H(0) = \\frac{4K}{50} = 2 \\;\\Rightarrow\\; K = 25$$

Residues of $H(s)/s$: $r_0 = 2$ at the origin, $r_{-10} = +0.176471$, and
$r_{-1\\pm j2} = -1.088235 \\pm j0.102941$, whose pair form is
$2\\lvert r \\rvert = 2.186187$ at an angle of $174.5962^\\circ$. The complex
pair therefore carries more than twelve times the weight of the real pole, so
it dominates. With $\\omega_n = \\sqrt{5} = 2.236068$ and
$\\zeta = 1/2.236068 = 0.447214$ the bare pair would overshoot 20.788%, but the
zero at $-4$ pushes it up: the measured overshoot of the full system is
24.4463%, at 1.3861 s, with 5% settling at 3.0395 s.

*The trap.* Ignoring the zero because it is "not near the poles". It sits at a
distance of 4 from the origin against $\\omega_n = 2.236068$ — well inside the
region where Section 9.2 says zeros matter, and it adds 3.66 points of
overshoot.

**A4.** $H(s) = \\dfrac{40(s+4.2)}{(s+4)(s+1)(s+21)}$. Rank the three modes by
importance.

*Solution.* Apply the geometric residue rule to $H(s)/s$:

$$r_{-1} = \\frac{40(3.2)}{(-1)(3)(20)} = \\frac{128}{-60} = -2.133333$$

$$r_{-4} = \\frac{40(0.2)}{(-4)(-3)(17)} = \\frac{8}{204} = 0.039216$$

$$r_{-21} = \\frac{40(-16.8)}{(-21)(-20)(-17)} = \\frac{-672}{-7140} = 0.094118$$

The ranking is $-1$, then **$-21$**, then $-4$. The mode at $-4$ is nearly
silent — $0.039216/2.133333 = 0.0183825$, or 1.84% of the dominant mode —
because the zero at $-4.2$ sits only 0.2 away from it. The remote pole at $-21$
matters more than the near one.

*The trap.* Ranking by distance from the imaginary axis and putting $-4$
second. Distance is a proxy for residue; when a zero is in play, the proxy
fails.

**A5.** A unit-DC-gain plant has poles at $-3 \\pm j4$ and a single zero at
$s = +5$. Does it overshoot, does it undershoot, and by how much?

*Solution.* Stability is decided by the poles alone, both of which are in the
left half plane, so the system is stable. The zero is in the right half plane,
so by the identity of Section 9.1 the step response is $y - y'/5$, and by the
argument of Worked Example 9.2 it must go negative. The initial slope is
$-\\omega_n^{2}/z = -25/5 = -5$. Measured on the simulation: the response dips
to $-0.263442$ at $t = 0.1159$ s, then recovers and overshoots by 11.975%
before settling at 1. The small-t estimate $12.5/z^{2} = 12.5/25 = 0.5$
overstates the dip by 90%.

*The trap.* Marking the system unstable because something is in the right half
plane. Only **poles** decide stability.

### Problem Set 13B — From a Response or a Specification Back to the Map

**B1.** A measured step response fits $y(t) = 1 - 1.25e^{-2t} + 0.25e^{-10t}$.
Find the transfer function.

*Solution.* Exponents give poles at $-2$ and $-10$; the constant gives
$H(0) = 1$. The residues sum to $1 - 1.25 + 0.25 = 0$, confirming a strictly
proper H that starts from zero, and the flat start means relative degree 2, so
there are no finite zeros. Hence

$$H(s) = \\frac{20}{(s+2)(s+10)}, \\qquad H(0) = \\frac{20}{20} = 1$$

Re-expanding gives $r_{-2} = 20/[(-2)(8)] = -1.25$ and
$r_{-10} = 20/[(-10)(-8)] = 0.25$, matching the data.

*The trap.* Writing $H(s) = 1/[(s+2)(s+10)]$ and forgetting the numerator
gain. That system has a DC gain of $1/20 = 0.05$ and the measured response
would settle at 0.05, not 1.

**B2.** Place a pole pair for $\\zeta = 0.5$ and a 2% settling time of about
2 s. Give the poles, then check the settling time against a simulation.

*Solution.* The rule $t_s \\approx 4/(\\zeta\\omega_n)$ gives
$\\zeta\\omega_n = 4/2 = 2$, so $\\sigma = 2$ and

$$\\omega_n = \\sigma/\\zeta = 2/0.5 = 4\\ \\mathrm{rad/s}, \\qquad
\\omega_d = 4\\sqrt{1 - 0.25} = 3.464102\\ \\mathrm{rad/s}$$

so the poles go at $s = -2 \\pm j3.464102$, and the transfer function is
$16/(s^{2}+4s+16)$.

**Now check it.** The measured 2% settling time is 2.0191 s and the measured
overshoot is 16.3034%. The rule was 0.95% optimistic here — and $\\zeta = 0.5$
sits right at the edge of the first band identified in Worked Example 8.2,
where the rule stops being conservative at all. Had the specification been a
hard limit, the design would have missed it.

*The trap.* Treating $4/(\\zeta\\omega_n)$ as a guarantee and reporting 2 s. It
is an estimate that lands on either side depending on $\\zeta$.

**B3.** A continuous pole pair sits at $s = -4 \\pm j3$ and the loop is sampled
at $T = 0.2$ s. Where are the discrete poles, and is the sampled system stable?

*Solution.* Apply $z = e^{sT}$ in polar form:

$$\\lvert z \\rvert = e^{-4(0.2)} = e^{-0.8} = 0.449329, \\qquad
\\angle z = 3(0.2) = 0.6\\ \\mathrm{rad} = 34.3775^\\circ$$

$$z = 0.449329(\\cos 0.6 \\pm j\\sin 0.6) = 0.370847 \\pm j0.253710$$

The magnitude is well under 1, so the sampled system is stable. There are
$2\\pi/0.6 = 10.472$ samples per ring, which is adequate but not generous;
below about eight samples per cycle a digital loop starts to struggle.

*The trap.* Testing the real part of z instead of its magnitude. The real part
here is 0.370847, but a pole at $z = -0.2 + j0.98$ has a smaller real part and
a magnitude of 1.0002 — unstable.

**B4.** A discrete pole sits at $z = -0.5$ with $T = 0.1$ s. Find the
equivalent continuous pole and describe the mode.

*Solution.* A negative real z has angle $\\pi$, so

$$\\sigma = -\\frac{\\ln 0.5}{0.1} = 6.931472\\ \\mathrm{s}^{-1}, \\qquad
\\omega = \\frac{\\pi}{0.1} = 31.415927\\ \\mathrm{rad/s}$$

giving $s = -6.931472 + j31.415927$. The frequency is exactly the Nyquist rate,
so the sampled mode is $(-0.5)^{k}$: it flips sign every sample and its
magnitude falls by half each time. Solving $0.5^{k} = 0.05$ gives $k = 4.3219$
samples, so it is gone in under half a second — stable, fast, and visually
horrible.

*The trap.* Concluding that a negative pole location is unstable by analogy
with the s-plane. In the z-plane the test is the magnitude, and
$\\lvert -0.5 \\rvert = 0.5 < 1$.

**B5.** A compensator zero is to cancel a plant pole at $s = -0.4$ that is
known only to $\\pm 5\\%$. What residue survives, and what does it do to a 2%
settling specification?

*Solution.* From Worked Example 10.1 the surviving residue is
$-1.144165\\,\\delta/(1+\\delta)$, so at $\\delta = 0.05$

$$r_{-0.4} = -1.144165\\left(\\frac{0.05}{1.05}\\right) = -0.054484$$

That mode decays at $0.4$ per second, so on its own it needs
$\\ln(0.054484/0.02)/0.4 = 2.505$ s to fall inside a 2% band. The measured 2%
settling time of the whole system rises from 0.9716 s at perfect cancellation
to 2.5065 s — an increase of 158%.

*The trap.* Assuming a 5% placement error causes a 5% timing error. The
residue error is proportional, but its effect on settling is not, because the
leftover mode is the **slowest** one in the system.

### Practice Problems 13C — Speed Drills

**C1.** Poles at $-5 \\pm j5$. Damping ratio?
*Answer.* $\\zeta = 5/\\sqrt{50} = 0.707107$. Any pole on the $45^\\circ$
diagonal has $\\zeta = 0.707107$, whatever its distance from the origin.

**C2.** A system's poles are $-1$, $-1$ and $-30$. Is the response
oscillatory?
*Answer.* No. All poles are real, so every mode is a decaying exponential; the
repeated pole at $-1$ contributes $(a + bt)e^{-t}$, which is sluggish but never
crosses the final value.

**C3.** $H(s) = 100/(s^{2} + 100)$. Stable?
*Answer.* Marginally. The poles are at $\\pm j10$, simple and on the axis, so
the response is an undying sinusoid at 10 rad/s. Had they been repeated, the
response would grow like t and the answer would be "unstable".

**C4.** A step response starts at $y(0^{+}) = 3$. What does that say about the
transfer function?
*Answer.* It is **proper but not strictly proper** — the numerator and
denominator have the same degree, and $y(0^{+}) = \\lim_{s\\to\\infty}H(s) = 3$
is the direct feedthrough term.

**C5.** Two systems have the same poles; one has a zero at $-30$, the other has
none. Which settles first?
*Answer.* Practically neither: at $-30$ the zero is far outside the region
where it matters, and the measured overshoot changes by well under a percentage
point. Compare the $-20$ row of the table in Section 9.2, where the overshoot
moved only from 9.478% to 9.843%.

**C6.** A discrete pole sits at $z = 1$. Stable?
*Answer.* Marginally, and only if it is simple: $z = 1$ is the image of $s = 0$
and is the discrete integrator, whose mode is the constant sequence $1^{k}$. A
repeated pole at $z = 1$ gives a ramp and is unstable.

**C7.** Which is worse for control: a pole at $+2$ or a zero at $+2$?
*Answer.* The pole, without question — it makes the open-loop system unstable
and must be moved by feedback. The zero leaves stability intact but forces
undershoot and caps the achievable bandwidth, and no controller can remove it,
because feedback moves poles and leaves zeros where they are.

**C8.** A pole pair has $\\omega_n = 10$ rad/s and $\\zeta = 0.6$. Where is it?
*Answer.* At $-\\zeta\\omega_n \\pm j\\omega_n\\sqrt{1-\\zeta^{2}}$, that is
$-6 \\pm j8$. The 3-4-5 triangle is worth memorising: $\\zeta = 0.6$ and
$\\zeta = 0.8$ both give integer poles on a circle of integer radius.`,
      examTip: `Read the direction of the question first. "Given the map, what does it do?" wants ζ, ωₙ, overshoot and peak time. "Given the response, what is the map?" wants the exponents as poles and the coefficients as residues. Mixing the two up costs more marks than any arithmetic slip.`,
      importantNote: `Every answer in these sets was produced by simulating the system and measuring the response, then cross-checked against the closed form. Where the two disagree — settling-time rules, the dominant-pole approximation, the small-time undershoot estimate — the measured number is quoted and the size of the rule's error is stated alongside it.`,
    },
  ],
  keyTakeaways: [
    'LHP poles = stable (decaying response). RHP poles = unstable (growing). Imaginary axis = marginal.',
    'Complex pole pair at -σ ± jω_d: response is e^(-σt)·cos(ω_d·t + φ). σ controls decay; ω_d controls oscillation.',
    'Damping ratio ζ = cos(angle from negative real axis to pole). ζ = 0.7 → ~5% overshoot. ζ = 1 → critically damped.',
    'Settling time t_s ≈ 3/σ = 3/(ζωₙ) at 5%, 4/(ζωₙ) at 2%. Rise time t_r ≈ 1.8/ωₙ is the 10–90% figure, not 0–100%. Peak time t_p = π/ω_d is exact.',
    'Zeros don\'t affect stability but shape transient. RHP zero = non-minimum phase = initial inverse response.',
    'Dominant pole approximation: the pole closest to the imaginary axis dominates, but "5× farther" is not free — the measured worst-case error is r^(−r/(r−1)), which is 13.37% of the final value at r = 5 and 7.74% at r = 10.',
    'Routh-Hurwitz: all first-column entries same sign = stable. Number of sign changes = number of RHP roots. Coefficient missing or negative = automatic instability.',
    'ζ and ωₙ are the polar coordinates of a pole pair: ωₙ is the distance from the origin, ζ is the cosine of the angle back to the negative real axis. Constant ωₙ is a circle, constant ζ is a ray, constant σ is a vertical line.',
    'Residue at a pole = K × (distances to all zeros) ÷ (distances to all other poles). A mode is negligible when its RESIDUE is small — which a nearby zero causes just as effectively as a remote pole.',
    'Adding a zero at −z gives y + y′/z (more overshoot, earlier rise); a zero at +z gives y − y′/z (undershoot). The weighted integral of y(t)e^(−zt) is exactly zero for an RHP zero, which is why undershoot is unavoidable.',
    'Inexact pole-zero cancellation leaves a residue proportional to the mismatch, decaying at the plant pole rate. A 5% miss on a pole at −0.4 stretches 2% settling from 0.9716 s to 2.5065 s. Never cancel an unstable pole.',
    'Discrete time: z = e^(sT), so |z| = e^(σT) and ∠z = ωT. The left half plane maps inside the unit circle and stability is |z| < 1. Only |ω| ≤ π/T maps one-to-one.',
    'The settling-time rules are estimates, not bounds. Measured 2% settling exceeds 4/(ζωₙ) over ζ ≈ 0.495–0.530, 0.670–0.780 and above 0.885, and is up to 33% pessimistic elsewhere.',
  ],
},

};
