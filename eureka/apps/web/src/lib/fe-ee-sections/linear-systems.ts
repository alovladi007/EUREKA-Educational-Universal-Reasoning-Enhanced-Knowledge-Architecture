// FE EE course content — Linear Systems (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_LINEAR_SYSTEMS: Record<string, TopicLesson> = {
  fee_time_domain: {
    topicId: 'fee_time_domain',
    title: 'Time Domain Analysis & LTI Systems',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'Time domain analysis examines system behavior using impulse and step responses. The impulse response h(t) completely characterizes an LTI system, enabling output prediction for any input through convolution. Understanding LTI properties, causality, and BIBO stability is essential for the FE exam.',
    sections: [
      {
        id: 'td-impulse-step',
        title: '1. Impulse Response and Convolution',
        content: `## 1.1 The Impulse Response h(t)

The **impulse response** h(t) is the output of a system when the input is a unit impulse δ(t). It completely characterizes any **Linear Time-Invariant (LTI)** system — once you know h(t), you can predict the output for **any** input using convolution.

**Continuous-time convolution:**

**$y(t) = \\int x(\\tau) \\cdot h(t - \\tau) d\\tau$**

**Discrete-time convolution:**

**$y[n] = \\Sigma x[k] \\cdot h[n - k]$**

| Signal | Response | What It Reveals |
|---|---|---|
| Impulse δ(t) | h(t) | All system dynamics — poles, zeros, decay, oscillation |
| Step u(t) | $g(t) = \\int h(\\tau)d\\tau$ | Settling time, overshoot, steady-state value |

### Step Response

The **step response** g(t) is the integral of the impulse response: **$g(t) = \\int _{0}^{t} h(\\tau)d\\tau$**. Conversely, **$h(t) = dg(t)/dt$**. The step response reveals how quickly and smoothly a system reaches steady state.

## 1.2 Convolution Properties

- **Commutative**: x * h = h * x
- **Associative**: (x * $h_{1}$) * $h_{2}$ = x * ($h_{1}$ * $h_{2}$)
- **Distributive**: x * ($h_{1}$ + $h_{2}$) = x * $h_{1}$ + x * $h_{2}$
- **Identity**: x(t) * δ(t) = x(t)
- **Time-shift**: x(t) * δ(t − $t_{0}$) = x(t − $t_{0}$)

For the FE exam, memorize key response shapes for first and second-order systems — these appear repeatedly in both circuit analysis and control questions.`,
        examTip: 'On the FE exam, convolution problems often simplify dramatically. Remember that convolving any signal with δ(t) returns the signal itself, and convolving with δ(t−t₀) shifts it by t₀. For rectangular pulse convolution, the result is a trapezoid — sketch it rather than computing the integral.',
      },
      {
        id: 'td-lti-stability',
        title: '2. LTI Systems, Causality, and BIBO Stability',
        content: `## 2.1 Linear Time-Invariant (LTI) Properties

An LTI system must satisfy two properties:

**Linearity (Superposition):**
- If $x_{1}$(t) → $y_{1}$(t) and $x_{2}$(t) → $y_{2}$(t), then **$\\alpha \\cdot x_{1}(t) + \\beta \\cdot x_{2}(t) \\to \\alpha \\cdot y_{1}(t) + \\beta \\cdot y_{2}(t)$**

**Time-Invariance:**
- If x(t) → y(t), then **$x(t - t_{0}) \\to y(t - t_{0})$** — the system response does not change over time

| Property | Test | Engineering Significance |
|---|---|---|
| **Linearity** | Scale and add inputs → outputs scale and add | Enables superposition analysis |
| **Time-invariance** | Shifted input → same shifted output | System parameters constant |
| **Causality** | h(t) = 0 for t < 0 | Output depends only on past/present inputs |
| **BIBO Stability** | $\\int \\lvert h(t)\\rvert\\, dt < \\infty$ | Bounded inputs produce bounded outputs |

## 2.2 BIBO Stability

A system is **Bounded-Input Bounded-Output (BIBO) stable** if every bounded input produces a bounded output. For LTI systems, this is equivalent to:

**$\\int _{-\\infty }^{\\infty } \\lvert h(t) \\rvert \\, dt < \\infty$** (continuous-time)

**$\\sum _{n=-\\infty }^{\\infty } \\lvert h[n] \\rvert < \\infty$** (discrete-time)

For systems described by rational transfer functions, BIBO stability requires **all poles in the open left half-plane** (Re(pᵢ) < 0).

### Marginal Stability

If a pole lies exactly on the imaginary axis (e.g., s = jω₀), the system is **marginally stable** — it produces sustained oscillations that never decay. In the BIBO sense, this is technically **unstable** because a bounded sinusoidal input at that frequency produces unbounded output.

### Key Equivalences for BIBO Stability

- All poles in open LHP ↔ ∫|h(t)|dt < ∞ ↔ BIBO stable
- Poles on imaginary axis ↔ sustained oscillation ↔ marginally stable (BIBO unstable)
- Any pole in RHP ↔ exponentially growing response ↔ unstable`,
        examTip: 'The FE exam loves to test stability classification. Given a characteristic equation, find the poles. All poles with negative real parts → stable. Any pole with zero real part → marginally stable. Any pole with positive real part → unstable. Do not confuse "marginally stable" with "stable" — for BIBO, marginal means unstable.',
        importantNote: 'Causality and stability are independent properties. A system can be causal but unstable (pole in RHP), or stable but non-causal (two-sided exponential). All physical real-time systems are causal, but offline digital processing can use non-causal filters.',
      },
      {
        id: 'td-exam-strategies',
        title: '3. Practical Exam Strategies for Time Domain',
        content: `## 3.1 Worked Example: Convolution of Two Signals

**Problem**: Find y(t) = x(t) * h(t) where x(t) = u(t) − u(t−2) (rectangular pulse, width 2) and h(t) = e^(−t)·u(t).

**Step-by-step solution:**

1. **Set up the integral**: y(t) = ∫₀^∞ x(τ)·h(t−τ) dτ
2. **Identify nonzero region of x(τ)**: x(τ) = 1 for 0 ≤ τ ≤ 2, zero elsewhere
3. **Substitute**: y(t) = ∫₀^min(t,2) e^(−(t−τ)) dτ (require t−τ ≥ 0 for causality of h)
4. **For 0 ≤ t ≤ 2**: y(t) = e^(−t) · ∫₀^t e^τ dτ = e^(−t)·(e^t − 1) = **$1 - e^{-t}$**
5. **For t > 2**: y(t) = e^(−t) · ∫₀^2 e^τ dτ = e^(−t)·(e² − 1) = **$(e^{2} - 1)\\cdot e^{-t}$**

The result is a rising exponential that transitions to a decaying exponential at t = 2.

![A width-2 rectangular pulse and the impulse response e^-t u(t) in the upper panel; their convolution in the lower panel, computed numerically from the convolution sum. The output climbs as 1 - e^-t while the pulse is still arriving, peaks at 0.865 exactly where the pulse ends, and decays as (e^2 - 1)e^-t afterward.](/courses/fe-ee/figures/lsys-conv-pulse-exp.svg)

The picture is worth internalising: the output keeps RISING for as long as
the input keeps arriving, peaks at the instant the pulse switches off, and
then relaxes on the system's own time constant. Convolution smooths — the
output of a first-order system never has the sharp corners its input has,
which is itself a quick sanity check on any convolution answer.

## 3.2 Common Mistakes to Avoid

- **Forgetting initial conditions**: When using Laplace to solve ODEs, always include the initial condition terms in L{y'(t)} = sY(s) − y($0^{-}$). Setting y(0) = 0 when it is not zero produces a completely wrong answer.
- **Confusing impulse vs. step**: The impulse response h(t) and step response g(t) are related by differentiation: h(t) = dg(t)/dt. If the problem gives the step response, differentiate to get h(t) before convolving.
- **Wrong convolution limits**: The integral limits depend on the support of BOTH signals. Sketch both x(τ) and h(t−τ) to determine where they overlap — this visual approach prevents limit errors.

## 3.3 Quick Checks for System Properties

**Causality check**: Examine h(t). If h(t) = 0 for all t < 0, the system is causal. On the exam, verify by inspection — does the impulse response "start" at or after t = 0?

**BIBO stability check**: Compute ∫|h(t)|dt. For exponential responses like h(t) = Ae^(−at)·u(t) with a > 0, the integral equals A/a (finite) — **stable**. If h(t) = u(t), the integral diverges — **unstable**.

| System | h(t) | Causal? | BIBO Stable? |
|---|---|---|---|
| $h(t) = e^{-3t}\\cdot u(t)$ | Decaying exponential | Yes | Yes (integral = 1/3) |
| $h(t) = e^{2t}\\cdot u(t)$ | Growing exponential | Yes | **No** (integral diverges) |
| $h(t) = e^{-\\lvert t\\rvert}$ | Two-sided | No | Yes (integral = 2) |
| $h(t) = u(t)$ | Step function | Yes | **No** (integral diverges) |`,
        examTip: 'When convolving a rectangular pulse with an exponential on the FE exam, the result always has two regions — a rising portion and a decaying tail. Sketch the shape rather than memorizing the formula. If the problem involves δ(t), remember: x(t)*δ(t−t₀) = x(t−t₀) — no integration needed.',
        importantNote: 'Always verify your convolution result at key points: at t = 0 the output should be zero (for causal signals), and as t → ∞ the output should decay to zero (for stable systems). These sanity checks catch algebraic errors quickly.',
      },
      {
        id: 'td-order-responses',
        title: '4. First- and Second-Order System Responses',
        content: `## 4.1 The first-order prototype

Every RC and RL circuit, every thermal lag and every single-time-constant
sensor is, from the systems point of view, one transfer function:

**$H(s) = K/(\\tau s + 1)$**

with a single real pole at **$s = -1/\\tau$**. Its impulse response is
$h(t) = (K/\\tau)e^{-t/\\tau}u(t)$ and its unit step response is

**$y(t) = K(1 - e^{-t/\\tau})$**

The step response has no overshoot, no ringing, and one shape: the fraction
of the change completed depends only on how many time constants have elapsed.

| Elapsed time | Fraction of final value reached | Still to go |
|---|---|---|
| $1\\tau$ | 63.2% | 36.8% |
| $2\\tau$ | 86.5% | 13.5% |
| $3\\tau$ | 95.0% | 5.0% |
| $5\\tau$ | 99.3% | 0.7% |

**Worked:** H(s) = 5/(s + 20). Divide through so the constant term is 1:
H(s) = 0.25/(0.05s + 1), so the DC gain is **0.25** and $\\tau$ = **50 ms**.
A unit step produces y(t) = 0.25(1 - e^{-20t}); after one time constant the
output is 0.25 x 0.632 = **0.158**, and the response is effectively complete
by 5 x 50 = 250 ms. Note where each number came from: the pole set the speed,
the gain set the destination, and nothing else about the system mattered.

## 4.2 The second-order standard form

Two energy-storage elements give the standard form the exam quotes:

**$H(s) = \\omega _n^{2}/(s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2})$**

Two parameters carry everything. The **natural frequency** $\\omega _n$ sets
the time scale, and the **damping ratio** $\\zeta$ sets the shape. The poles
sit at

**$s = -\\zeta \\omega _n \\pm j\\omega _n\\sqrt{1 - \\zeta ^{2}} = -\\zeta \\omega _n \\pm j\\omega _d$**

and their geometry is worth carrying as a picture: every pole of the family
lies at DISTANCE $\\omega _n$ from the origin, and the cosine of the angle
measured from the negative real axis equals $\\zeta$. Damping rotates the
pole pair toward the real axis without changing its radius.

| Damping | Poles | Step response character |
|---|---|---|
| $\\zeta = 0$ | on the $j\\omega$ axis | oscillates forever at $\\omega _n$ |
| $0 < \\zeta < 1$ | complex pair in LHP | overshoots, rings at $\\omega _d$, settles |
| $\\zeta = 1$ | repeated real | fastest approach with no overshoot |
| $\\zeta > 1$ | two distinct real | sluggish, monotonic |

![Unit step responses of the second-order standard form for damping ratios 0.25, 1 and 2, all at the same natural frequency. Each curve is the exact solution; the marked overshoot of 44% on the lightly damped curve is computed from the overshoot formula and lands exactly on the sampled peak.](/courses/fe-ee/figures/lsys-second-order-step.svg)

## 4.3 The numbers a step response is graded on

For the underdamped case, four figures of merit follow directly from
$\\zeta$ and $\\omega _n$, and the FE exam asks for each of them:

- **Percent overshoot**: $M_p = e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}}$ — a
  function of $\\zeta$ ALONE, independent of $\\omega _n$
- **Peak time**: $t_p = \\pi /\\omega _d$ — half a period of the damped
  oscillation
- **Settling time** (2% band): $t_s \\approx 4/(\\zeta \\omega _n)$ — four
  envelope time constants
- **Ring period**: $T = 2\\pi /\\omega _d$

| $\\zeta$ | Overshoot |
|---|---|
| 0.2 | 52.7% |
| 0.4 | 25.4% |
| 0.5 | 16.3% |
| 0.707 | 4.3% |
| 1.0 | 0% |

**Worked:** $\\zeta$ = 0.5 and $\\omega _n$ = 10 rad/s. Then
$\\omega _d$ = 10 x sqrt(1 - 0.25) = **8.66 rad/s**. Overshoot:
exp(-pi x 0.5/0.866) = **16.3%**, so a unit step peaks at 1.163. Peak time:
pi/8.66 = **0.363 s**. Settling: 4/(0.5 x 10) = **0.8 s**. Four exam-ready
numbers from two parameters, with no differential equation solved anywhere.

## 4.4 Natural response, forced response, and the circuit connection

The complete response of any LTI system splits into two parts. The
**natural response** is what the stored energy does with the input removed —
its form is set entirely by the poles. The **forced response** copies the
form of the input. The total is their sum, with the constants chosen to meet
the initial conditions.

This is the same decomposition the circuits chapters perform with different
vocabulary. For a series RLC loop, $\\alpha = R/(2L)$ and
$\\omega _0 = 1/\\sqrt{LC}$, and the dictionary between the two languages is
$\\zeta = \\alpha /\\omega _0$.

**Worked:** R = 100 ohm, L = 10 mH, C = 1 microfarad. Then
alpha = 100/0.02 = 5000 s^-1 and omega_0 = 1/sqrt(1e-8) = 10,000 rad/s, so
$\\zeta$ = 5000/10,000 = **0.5** — underdamped, ringing at
omega_d = 10,000 x 0.866 = **8660 rad/s** inside an envelope that decays as
e^(-5000t). The transient chapter reached these identical numbers from
alpha and omega_0 directly; here they arrive from $\\zeta$ and $\\omega _n$.
Two vocabularies, one system — and the exam freely uses either.

## 4.5 Reading the parameters off a measured response

Exam problems sometimes run the map backwards: given a plotted response,
recover the system.

- **First order**: $\\tau$ is the time to reach 63.2% of the final value.
  Equivalently, the tangent drawn at t = 0 crosses the final value at
  exactly $t = \\tau$.
- **Second order, from the ring**: the damped period T gives
  $\\omega _d = 2\\pi /T$; the measured overshoot inverts to $\\zeta$ (25%
  overshoot means $\\zeta \\approx 0.4$ from the table above); then
  $\\omega _n = \\omega _d/\\sqrt{1-\\zeta ^{2}}$.
- **DC gain**: final value divided by input amplitude, in every case.

The inversion is robust because overshoot depends only on $\\zeta$ and the
period only on $\\omega _d$ — the two measurements do not contaminate each
other, which is exactly why those are the two numbers to read first.

**Worked:** a recorded unit-step response peaks at 1.25 and rings with a
20 ms period. The 25% overshoot gives $\\zeta \\approx 0.4$; the period gives
omega_d = 2 pi/0.020 = **314 rad/s**; and therefore
omega_n = 314/sqrt(1 - 0.16) = **343 rad/s**. Three readings, and the whole
transfer function up to a gain is recovered from a single oscilloscope
trace.`,
        examTip: 'Overshoot depends on the damping ratio alone; speed depends on the natural frequency alone. If an exam question changes wn but not zeta, the response curve stretches in time without changing shape — same overshoot, scaled peak and settling times. Spotting this saves recomputing everything from scratch.',
        importantNote: 'The settling-time formula ts = 4/(zeta*wn) uses the 2% criterion; some references use 3/(zeta*wn) for the 5% band. FE answer choices are spaced widely enough that either convention identifies the correct option, but state which band you are using in your scratch work to avoid second-guessing.',
      },
      {
        id: 'td-first-order',
        title: '5. The First-Order Response, Derived and Measured',
        content: `## 5.1 One pole, one differential equation, two responses

Every single-time-constant system — an RC network, an RL network, a thermal
mass with one heat path, a tank with one drain — obeys the same first-order
equation:

$$\\tau \\frac{dy}{dt} + y(t) = Kx(t)$$

Transform it with zero stored energy and the transfer function appears:

$$(\\tau s + 1)Y(s) = KX(s) \\;\\Longrightarrow\\; H(s) = \\frac{K}{\\tau s + 1} = \\frac{K/\\tau }{s + 1/\\tau }$$

The single pole sits at $s = -1/\\tau$. Two inputs matter, and both responses
are worth deriving rather than remembering.

**Impulse.** With $X(s) = 1$,

$$Y(s) = \\frac{K/\\tau }{s + 1/\\tau } \\;\\Longrightarrow\\; h(t) = \\frac{K}{\\tau }e^{-t/\\tau }u(t)$$

**Step.** With $X(s) = 1/s$, split by partial fractions,

$$Y(s) = \\frac{K}{s(\\tau s + 1)} = \\frac{K}{s} - \\frac{K\\tau }{\\tau s + 1}$$

$$g(t) = K\\left(1 - e^{-t/\\tau }\\right)u(t)$$

Two properties of that pair deserve to be carried into the exam. The impulse
response starts at $K/\\tau$ and has total area

$$\\int_{0}^{\\infty } \\frac{K}{\\tau }e^{-t/\\tau }dt = K = H(0)$$

so the area under the impulse response IS the DC gain. And differentiating the
step response returns the impulse response, which means the two carry exactly
the same information in different clothing.

![The impulse response h(t) = 4 exp(-2t) and the step response g(t) = 2(1 - exp(-2t)) of H(s) = 4/(s+2). The shaded area under h up to t = 0.5 s equals 1.2642, which is precisely the height of g at that instant, and the total area under h is the DC gain of 2.](/courses/fe-ee/figures/lin2-td-impulse-step.svg)

For $H(s) = 4/(s+2)$ the DC gain is $4/2 = 2$ and the time constant is
$\\tau = 0.5$ s. The shaded area in the figure is

$$\\int_{0}^{0.5} 4e^{-2t}dt = 2\\left(1 - e^{-1}\\right) = 1.2642$$

and the step response passes through 1.2642 at the same instant. That equality
is the integral relation made visible.

## 5.2 Worked Example: reading tau off a recorded response

**Given** a temperature probe initially at 20 degrees C, plunged at t = 0 into
a 70 degree C bath. The recorder shows 51.61 degrees C at t = 12 s. Find the
time constant, the 90% time, and the time to settle within 2%.

**Step 1 — normalise.** The total change is $70 - 20 = 50$ degrees. The
fraction completed at 12 s is

$$\\frac{51.61 - 20}{50} = 0.632$$

which is $1 - e^{-1} = 0.632$. So 12 s is exactly one time constant:
$\\tau = 12$ s.

**Step 2 — the 90% time.** Solve $1 - e^{-t/\\tau } = 0.9$:

$$t_{90} = \\tau \\ln 10 = 12 \\times 2.3026 = 27.63\\ \\mathrm{s}$$

**Step 3 — the 2% settling time.** Solve $e^{-t/\\tau } = 0.02$:

$$t_{s} = \\tau \\ln 50 = 12 \\times 3.912 = 46.94\\ \\mathrm{s}$$

**Step 4 — the 10 to 90 percent rise time.** The two crossings are at
$\\tau \\ln (10/9)$ and $\\tau \\ln 10$, so their difference is

$$t_{r} = \\tau \\ln 9 = 12 \\times 2.1972 = 26.37\\ \\mathrm{s}$$

![A first-order thermal record: a probe stepped from 20 to 70 degrees C with a 12 second time constant. The 63.2 percent point at 51.61 degrees is marked at t = 12 s, the tangent drawn at t = 0 meets the final value at exactly one time constant, and the 90 percent crossing falls at 27.63 s.](/courses/fe-ee/figures/lin2-td-tau-construction.svg)

The dashed tangent in the figure is the second classical construction. Its
slope is the initial derivative,

$$\\left. \\frac{dy}{dt} \\right|_{t=0} = \\frac{\\Delta y}{\\tau } = \\frac{50}{12} = 4.167\\ \\mathrm{deg/s}$$

and a straight line of that slope from the starting value reaches the final
value after exactly $\\tau$ seconds. That is why the tangent construction
works on any first-order record regardless of the vertical scale.

## 5.3 Worked Example: where the three-tau and four-tau rules come from

**Given** a first-order step response, find exactly when it enters a 5% band
and a 2% band, and compare with the rules of thumb.

Set the remaining fraction equal to the band edge:

$$e^{-t/\\tau } = 0.05 \\;\\Longrightarrow\\; t = \\tau \\ln 20 = 2.996\\tau$$

$$e^{-t/\\tau } = 0.02 \\;\\Longrightarrow\\; t = \\tau \\ln 50 = 3.912\\tau$$

![A normalised first-order step response with the 5 percent and 2 percent bands shaded. The curve enters the 5 percent band at ln 20 = 2.996 time constants and the 2 percent band at ln 50 = 3.912 time constants, which are the exact values that the 3-tau and 4-tau rules of thumb round up to.](/courses/fe-ee/figures/lin2-td-settling-bands.svg)

So the familiar rules are not conventions at all: they are $\\ln 20$ and
$\\ln 50$, rounded UP to the next whole time constant. Rounding up is why they
are safe — at exactly $3\\tau$ the response has completed 95.02% and at
$4\\tau$ it has completed 98.17%, so both rules deliver slightly better than
they promise.

| Elapsed | Completed | Remaining | Nearest exam rule |
|---|---|---|---|
| $1\\tau$ | 63.21% | 36.79% | the definition of $\\tau$ |
| $2\\tau$ | 86.47% | 13.53% | — |
| $2.996\\tau$ | 95.00% | 5.00% | the "3 tau" 5% rule |
| $3.912\\tau$ | 98.00% | 2.00% | the "4 tau" 2% rule |
| $5\\tau$ | 99.33% | 0.67% | "essentially finished" |

## 5.4 Worked Example: the DC gain hidden in an impulse record

**Given** an impulse response measured as $h(t) = 6e^{-t/0.25}u(t)$. Find the
DC gain, the transfer function and the step response.

The time constant is read straight off the exponent, $\\tau = 0.25$ s, so the
pole is at $-4$. The area is

$$K = \\int_{0}^{\\infty } 6e^{-4t}dt = \\frac{6}{4} = 1.5$$

$$H(s) = \\frac{6}{s + 4} = \\frac{1.5}{0.25s + 1}, \\qquad g(t) = 1.5\\left(1 - e^{-4t}\\right)$$

The numerator 6 is the INITIAL value of the impulse response, and 1.5 is the
final value of the step response. Confusing the two is the standard trap on
this question: the coefficient in front of the exponential is $K/\\tau$, not
K.

## 5.5 Why first-order systems never overshoot

The step response $K(1 - e^{-t/\\tau })$ is monotone because its derivative,

$$\\frac{dg}{dt} = \\frac{K}{\\tau }e^{-t/\\tau }$$

never changes sign. One pole cannot produce oscillation, because oscillation
requires an imaginary part and a single real pole has none. Any measured
first-order-looking record that DOES overshoot therefore has a second energy
store hiding in it, or a zero — and the exam uses that observation as a
qualitative question: "the response overshoots, so the system is at least
second order" is always a valid deduction.`,
        examTip: 'Every first-order question reduces to two numbers: where it ends (the DC gain) and how fast it gets there (the time constant). Extract both before reading the rest of the question. If the record starts from a nonzero value, the 63.2 percent rule applies to the CHANGE, not to the reading — a probe going from 20 to 70 hits one time constant at 51.6 degrees, not at 44.2.',
        importantNote: 'The coefficient of a measured impulse response is K/tau, not the DC gain. For h(t) = 6 exp(-4t) the DC gain is the AREA, 6/4 = 1.5. Reporting 6 as the DC gain is the most common error on impulse-record questions and it is off by exactly the factor tau.',
      },
      {
        id: 'td-second-order-specs',
        title: '6. Second-Order Specifications Derived from Zeta and Omega-n',
        content: `## 6.1 Solving the standard form once, properly

Take the standard second-order system driven by a unit step:

$$Y(s) = \\frac{\\omega _n^{2}}{s\\left(s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2}\\right)}$$

Complete the square in the quadratic, using $\\omega _d = \\omega _n\\sqrt{1-\\zeta ^{2}}$:

$$s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2} = \\left(s + \\zeta \\omega _n\\right)^{2} + \\omega _d^{2}$$

Split into the three standard pairs and invert term by term:

$$Y(s) = \\frac{1}{s} - \\frac{s + \\zeta \\omega _n}{(s+\\zeta \\omega _n)^{2} + \\omega _d^{2}} - \\frac{\\zeta \\omega _n}{(s+\\zeta \\omega _n)^{2} + \\omega _d^{2}}$$

$$y(t) = 1 - e^{-\\zeta \\omega _n t}\\left(\\cos \\omega _d t + \\frac{\\zeta }{\\sqrt{1-\\zeta ^{2}}}\\sin \\omega _d t\\right)$$

Collapsing the bracket into a single sinusoid with a phase gives the compact
form that every specification is derived from:

$$y(t) = 1 - \\frac{e^{-\\zeta \\omega _n t}}{\\sqrt{1-\\zeta ^{2}}}\\sin \\left(\\omega _d t + \\phi \\right), \\qquad \\phi = \\arccos \\zeta$$

Two structures are visible and they never mix. The exponential
$e^{-\\zeta \\omega _n t}$ is the ENVELOPE, and it is governed by the product
$\\zeta \\omega _n$, which is the distance of the poles from the imaginary
axis. The sinusoid is the RINGING, and it is governed by $\\omega _d$, which is
the distance of the poles from the real axis. Every number below comes from one
or the other.

## 6.2 Worked Example: peak time and overshoot, derived

**Given** the response above, derive $t_p$ and $M_p$.

Differentiate. Every term but one cancels, leaving

$$\\frac{dy}{dt} = \\frac{\\omega _n}{\\sqrt{1-\\zeta ^{2}}}e^{-\\zeta \\omega _n t}\\sin \\omega _d t$$

The exponential never vanishes, so the derivative is zero exactly where
$\\sin \\omega _d t = 0$, that is at $\\omega _d t = n\\pi$. The first maximum
is n = 1:

$$t_{p} = \\frac{\\pi }{\\omega _d} = \\frac{\\pi }{\\omega _n\\sqrt{1-\\zeta ^{2}}}$$

Substitute that instant back into y(t). At $\\omega _d t_p = \\pi$ the sine
term becomes $\\sin (\\pi + \\phi ) = -\\sin \\phi = -\\sqrt{1-\\zeta ^{2}}$,
so the square root cancels and

$$y(t_{p}) = 1 + e^{-\\zeta \\omega _n \\pi /\\omega _d} = 1 + e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}}$$

$$M_{p} = e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}}$$

The natural frequency cancelled out completely. That is why overshoot depends
on $\\zeta$ alone, and it is not a coincidence to be memorised but a
consequence of $t_p$ and the envelope scaling the same way.

## 6.3 Worked Example: rise time and settling time, derived

**Rise time, zero to one hundred percent.** Set y(t) = 1. That needs
$\\sin (\\omega _d t + \\phi ) = 0$, so $\\omega _d t + \\phi = \\pi$:

$$t_{r} = \\frac{\\pi - \\arccos \\zeta }{\\omega _d}$$

This is exact, and it is defined only for underdamped systems — an overdamped
response never reaches its final value, which is why the 10-to-90 definition is
used instead when $\\zeta \\ge 1$.

**Settling time.** The response is trapped between the two envelopes
$1 \\pm e^{-\\zeta \\omega _n t}/\\sqrt{1-\\zeta ^{2}}$. Requiring the envelope
itself to fit inside a 2% band gives

$$\\frac{e^{-\\zeta \\omega _n t_{s}}}{\\sqrt{1-\\zeta ^{2}}} = 0.02 \\;\\Longrightarrow\\; t_{s} = \\frac{1}{\\zeta \\omega _n}\\ln \\frac{1}{0.02\\sqrt{1-\\zeta ^{2}}}$$

Now evaluate that logarithm across the damping ratios the exam actually uses:

| $\\zeta$ | $\\ln [1/(0.02\\sqrt{1-\\zeta ^{2}})]$ | Rounded rule |
|---|---|---|
| 0.3 | 3.959 | 4 |
| 0.4 | 3.999 | 4 |
| 0.5 | 4.056 | 4 |
| 0.7 | 4.249 | 4 |

The logarithm sits within 6% of 4 over that whole range, which is where the
famous $t_s \\approx 4/(\\zeta \\omega _n)$ comes from. It is not an axiom; it
is a logarithm that happens to be close to a round number. The same calculation
with 0.05 in place of 0.02 gives values near 3, which is the 5% rule.

## 6.4 Worked Example: every specification for one system

**Given** $\\zeta = 0.3$ and $\\omega _n = 20$ rad/s, find the damped
frequency, ring period, overshoot, peak time, rise time and settling time.

$$\\omega _d = 20\\sqrt{1 - 0.09} = 20 \\times 0.9539 = 19.078\\ \\mathrm{rad/s}$$

$$T = \\frac{2\\pi }{\\omega _d} = 0.3293\\ \\mathrm{s}, \\qquad t_{p} = \\frac{\\pi }{\\omega _d} = 0.1647\\ \\mathrm{s}$$

$$M_{p} = e^{-\\pi (0.3)/0.9539} = 0.3723 = 37.23\\%$$

$$t_{r} = \\frac{\\pi - \\arccos (0.3)}{19.078} = \\frac{3.1416 - 1.2661}{19.078} = 0.0983\\ \\mathrm{s}$$

$$t_{s} = \\frac{\\ln (52.414)}{6} = \\frac{3.959}{6} = 0.6599\\ \\mathrm{s}$$

![An underdamped step response for a damping ratio of 0.3 and a natural frequency of 20 rad/s, with the rise time of 0.0983 s, the 37.23 percent peak at 0.1647 s, the decaying envelope and the 2 percent settling instant at 0.6599 s all marked on the same trace.](/courses/fe-ee/figures/lin2-td-spec-marks.svg)

Two honest footnotes on those numbers. The rounded rule
$4/6 = 0.6667$ s is about 1% longer than the envelope calculation. And the
envelope calculation is itself conservative: the response actually leaves the
2% band for the last time at 0.5615 s, because when the envelope finally
shrinks to 2% the sinusoid inside it is nowhere near its own peak. The exam
accepts the 4-over-zeta-omega-n answer; knowing it is an upper bound stops you
second-guessing a plotted trace that settles sooner.

The 10-to-90 rise time of the same trace, measured rather than derived, is
0.0661 s — shorter than the 0-to-100 figure of 0.0983 s, as it must be, and a
reminder to check which definition a question intends.

## 6.5 Worked Example: the whole damping family at one natural frequency

**Given** $\\omega _n = 20$ rad/s, describe the step response for
$\\zeta = 0.3$, $\\zeta = 1$ and $\\zeta = 2$.

For $\\zeta = 1$ the poles are repeated at $-20$ and the standard-form
inversion gives

$$y(t) = 1 - e^{-\\omega _n t}\\left(1 + \\omega _n t\\right)$$

For $\\zeta = 2$ the poles are real and distinct:

$$p_{1,2} = -\\omega _n\\left(\\zeta \\mp \\sqrt{\\zeta ^{2}-1}\\right) = -20\\left(2 \\mp \\sqrt{3}\\right)$$

$$p_{1} = -5.359, \\qquad p_{2} = -74.641$$

$$y(t) = 1 + \\frac{p_{2}e^{p_{1}t} - p_{1}e^{p_{2}t}}{p_{1} - p_{2}}$$

![Step responses of the second-order standard form at a natural frequency of 20 rad/s for damping ratios 0.3, 1 and 2. The lightly damped curve overshoots to 37.23 percent, the critically damped curve is the fastest monotone arrival, and the overdamped curve is dominated by its slow pole at -5.359 and arrives last.](/courses/fe-ee/figures/lin2-td-damping-family.svg)

The overdamped case carries the lesson worth keeping. Its two poles differ by a
factor of nearly fourteen, so the slow one dominates and the response is
effectively first order with

$$\\tau _{\\text{dom}} = \\frac{1}{5.359} = 0.1866\\ \\mathrm{s}$$

More damping did not mean a more sluggish oscillation; it meant the
oscillation vanished and one slow exponential took over. Raising $\\zeta$ above
1 always pulls one pole toward the origin and pushes the other away, which
makes the system SLOWER, not merely calmer. Critical damping is the fastest
non-overshooting response there is.

## 6.6 Worked Example: running the map backwards from measurements

**Given** a step record that overshoots by 20% and peaks at 0.15 s, recover
$\\zeta$, $\\omega _n$ and the settling time.

Invert the overshoot formula. Taking logarithms of
$M_p = e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}}$ and solving for $\\zeta$,

$$\\zeta = \\frac{\\ln (1/M_{p})}{\\sqrt{\\pi ^{2} + \\ln ^{2}(1/M_{p})}} = \\frac{1.6094}{\\sqrt{9.8696 + 2.5903}} = 0.4559$$

Then the peak time gives the damped frequency, and the two together give the
natural frequency:

$$\\omega _d = \\frac{\\pi }{t_{p}} = \\frac{3.1416}{0.15} = 20.944\\ \\mathrm{rad/s}$$

$$\\omega _n = \\frac{\\omega _d}{\\sqrt{1-\\zeta ^{2}}} = \\frac{20.944}{0.89001} = 23.532\\ \\mathrm{rad/s}$$

$$t_{s} = \\frac{4}{\\zeta \\omega _n} = 4/10.7296 = 0.3728\\ \\mathrm{s}$$

The inversion is well conditioned because the two measurements are independent:
overshoot knows only about $\\zeta$ and peak time knows only about
$\\omega _d$. That independence is exactly why those are the two quantities to
read off a scope first.

## 6.7 Two more numbers the exam asks for by name

**Logarithmic decrement.** The ratio of successive peaks of the ringing is
fixed by the envelope over one damped period:

$$\\delta = \\ln \\frac{y_{k} - 1}{y_{k+1} - 1} = \\zeta \\omega _n T = \\frac{2\\pi \\zeta }{\\sqrt{1-\\zeta ^{2}}}$$

For $\\zeta = 0.3$ this is $\\delta = 1.976$, so each overshoot is
$e^{-1.976} = 0.1386$ times the one before. Note the tidy relation
$M_p = e^{-\\delta /2}$: the overshoot is half a decrement, because the peak
occurs half a period after the crossing.

**Damped resonant frequency.** This is a FREQUENCY-domain quantity and it is
not $\\omega _d$. The magnitude $\\lvert H(j\\omega ) \\rvert$ peaks at

$$\\omega _r = \\omega _n\\sqrt{1 - 2\\zeta ^{2}}, \\qquad M_{r} = \\frac{1}{2\\zeta \\sqrt{1-\\zeta ^{2}}}$$

and the peak exists only for $\\zeta < 1/\\sqrt{2} = 0.707$. For
$\\zeta = 0.3$ and $\\omega _n = 20$, $\\omega _r = 18.111$ rad/s while
$\\omega _d = 19.078$ rad/s and $\\omega _n = 20$ rad/s — three different
frequencies, all legitimate answers to three different questions, and the
exam offers all three as choices.

| Symbol | Name | Value at $\\zeta = 0.3$, $\\omega _n = 20$ |
|---|---|---|
| $\\omega _n$ | natural frequency | 20 rad/s |
| $\\omega _d$ | damped (ringing) frequency | 19.078 rad/s |
| $\\omega _r$ | damped resonant frequency | 18.111 rad/s |
| $M_r$ | resonant peak of $\\lvert H \\rvert$ | 1.747 |`,
        examTip: 'Compute zeta*wn and wd first and write them down. The envelope decay uses zeta*wn, the ringing uses wd, and every specification is one of those two divided into a constant: tp = pi/wd, T = 2pi/wd, ts = 4/(zeta*wn). Building the two products once removes almost all the arithmetic from the rest of the question.',
        importantNote: 'The damped frequency wd, the damped RESONANT frequency wr, and the natural frequency wn are three different numbers, and they appear together as answer choices. Ringing in the time domain happens at wd; the magnitude peak in the frequency domain sits at wr = wn*sqrt(1 - 2*zeta^2) and only exists when zeta is below 0.707.',
      },
      {
        id: 'td-value-theorems',
        title: '7. The Initial- and Final-Value Theorems',
        content: `## 7.1 Two limits that skip the inverse transform

Both theorems answer a question about y(t) by evaluating a limit of Y(s), with
no inversion required.

$$y(0^{+}) = \\lim_{s \\to \\infty } sY(s) \\qquad \\text{(initial value)}$$

$$y(\\infty ) = \\lim_{s \\to 0} sY(s) \\qquad \\text{(final value)}$$

The symmetry is appealing and slightly dangerous, because their validity
conditions are NOT symmetric.

The **initial-value theorem** holds for any Y(s) that is a proper rational
function — the degree of the numerator strictly less than that of the
denominator. Under that condition it always works, and it cannot mislead you.

The **final-value theorem** holds only if $sY(s)$ has all of its poles in the
open left half-plane. A pole on the imaginary axis or in the right half-plane
makes the limit meaningless, and the theorem will still return a finite number
if you apply it blindly. That number will be wrong. Checking the poles BEFORE
taking the limit is the whole discipline of using this theorem.

| Theorem | Formula | Condition | Failure mode |
|---|---|---|---|
| Initial value | $\\lim_{s\\to \\infty } sY(s)$ | Y proper rational | none in practice |
| Final value | $\\lim_{s\\to 0} sY(s)$ | poles of $sY(s)$ in open LHP | returns a plausible wrong number |
| Initial slope | $\\lim_{s\\to \\infty } s[sY(s) - y(0^{+})]$ | as above | none in practice |

## 7.2 Worked Example: a final value that is legitimate

**Given** $Y(s) = 10/[s(s+2)(s+5)]$, find $y(\\infty )$.

First the check: $sY(s) = 10/[(s+2)(s+5)]$ has poles at $-2$ and $-5$, both
in the open left half-plane, so the theorem applies. Then

$$y(\\infty ) = \\lim_{s \\to 0} \\frac{10}{(s+2)(s+5)} = \\frac{10}{10} = 1$$

Confirm it the long way. Partial fractions give
$y(t) = 1 - \\frac{5}{3}e^{-2t} + \\frac{2}{3}e^{-5t}$, whose limit is 1, and
a numerical march of the state equations lands on 1 as well. Three routes, one
answer.

Notice what the theorem gave for free: the same number as $H(0)$ for the
system $H(s) = 10/[(s+2)(s+5)]$ driven by a unit step, because
$Y = H/s$ makes $sY = H$ and the limit is literally H(0). The final-value
theorem applied to a step response IS the DC gain.

## 7.3 Worked Example: an initial value, an initial slope, and a final value

**Given** $Y(s) = (2s+3)/(s^{2}+5s+6)$, find $y(0^{+})$, $y'(0^{+})$ and
$y(\\infty )$.

**Initial value.**

$$y(0^{+}) = \\lim_{s\\to \\infty } \\frac{s(2s+3)}{s^{2}+5s+6} = \\lim_{s\\to \\infty } \\frac{2s^{2}+3s}{s^{2}+5s+6} = 2$$

**Initial slope.** Subtract the value already found and take the limit again:

$$y'(0^{+}) = \\lim_{s\\to \\infty } s\\left[sY(s) - 2\\right] = \\lim_{s\\to \\infty } \\frac{-7s^{2}-12s}{s^{2}+5s+6} = -7$$

**Final value.** The poles of $sY(s)$ are at $-2$ and $-3$, so the theorem
applies:

$$y(\\infty ) = \\lim_{s\\to 0} \\frac{s(2s+3)}{s^{2}+5s+6} = 0$$

**Cross-check by inversion.** The residues are $-1$ at $s = -2$ and $3$ at
$s = -3$, giving

$$y(t) = -e^{-2t} + 3e^{-3t}$$

$$y(0) = -1 + 3 = 2, \\qquad y'(0) = 2 - 9 = -7, \\qquad y(\\infty ) = 0$$

All three agree. The signature here is worth noticing: the response STARTS at
2 and immediately falls, because its initial slope is negative. A transform
whose numerator degree is one less than its denominator degree always has a
nonzero initial value; if the gap is two or more, $y(0^+) = 0$.

## 7.4 Worked Example: two final values that are not

**Case one, a pole on the axis.** $Y(s) = 5/(s^{2}+9)$. Apply the theorem
blindly:

$$\\lim_{s\\to 0} \\frac{5s}{s^{2}+9} = 0$$

But $sY(s)$ has poles at $\\pm j3$, which are ON the imaginary axis, so the
condition fails. The true inverse transform is

$$y(t) = \\frac{5}{3}\\sin 3t$$

which oscillates forever between $\\pm 1.667$ and has no final value at all.
The theorem returned 0, which is the AVERAGE, not the limit.

**Case two, a pole in the right half-plane.** $Y(s) = 1/(s-1)$. The theorem
would give

$$\\lim_{s\\to 0} \\frac{s}{s-1} = 0$$

while the actual signal is $y(t) = e^{t}$, which diverges. Again a
comfortable-looking zero, and again completely wrong.

The pattern in both failures is the same: the limit as $s \\to 0$ is
mathematically well defined but it is not the limit of y(t), because the
theorem's derivation quietly assumed that y(t) HAS a limit. Look at the poles
of $sY(s)$ first, every time. If any of them is on or right of the imaginary
axis, the correct answer is "the final value does not exist".`,
        examTip: 'Before applying the final-value theorem, factor the denominator of sY(s) and glance at the roots. If they are all strictly left of the imaginary axis, take the limit. If any sits on the axis or to the right, the answer choice you want is "no final value" or "the response is unbounded" — and the numerical choice offered alongside it is the trap.',
        importantNote: 'The initial-value theorem never fails for a proper rational Y(s), but the final-value theorem fails silently. A sinusoid returns 0, a growing exponential returns 0, and both look like perfectly reasonable answers. The check costs one factorisation.',
      },
      {
        id: 'td-convolution-deep',
        title: '8. Convolution as the Impulse-Response Integral',
        content: `## 8.1 Where the integral comes from

Any input can be written as a continuum of scaled, shifted impulses, which is
what the sifting property says:

$$x(t) = \\int_{-\\infty }^{\\infty } x(\\lambda )\\delta (t - \\lambda )\\,d\\lambda$$

The system answers each of those impulses with a scaled, shifted copy of h(t),
and linearity lets the answers be added:

$$y(t) = \\int_{-\\infty }^{\\infty } x(\\lambda )h(t-\\lambda )\\,d\\lambda = (x * h)(t)$$

For causal signals and a causal system both limits tighten, because
$x(\\lambda ) = 0$ before 0 and $h(t-\\lambda ) = 0$ for $\\lambda > t$:

$$y(t) = \\int_{0}^{t} x(\\lambda )h(t-\\lambda )\\,d\\lambda$$

Three consequences are worth stating outright. The operation is commutative, so
you may flip whichever signal is simpler. The output duration is the sum of the
two input durations — a 1-second pulse into a 3-second impulse response gives 4
seconds of output. And the total AREA of the output is the product of the two
input areas, which follows from setting s = 0 in $Y(s) = X(s)H(s)$ and is the
fastest sanity check there is.

## 8.2 Worked Example: two rectangles make a trapezoid

**Given** $x(t)$ a rectangle of height 1 and width 1 s, and
$h(t)$ a rectangle of height 2 and width 3 s. Find y(t).

Slide the short pulse across the long one and count the overlap. While the
short pulse is entering, $0 \\le t < 1$, the overlap grows linearly:

$$y(t) = \\int_{0}^{t} (1)(2)\\,d\\lambda = 2t$$

Once fully inside, $1 \\le t < 3$, the overlap is the whole short pulse and the
output is flat:

$$y(t) = \\int_{t-1}^{t} (1)(2)\\,d\\lambda = 2$$

While leaving, $3 \\le t < 4$, it shrinks linearly back to zero:

$$y(t) = \\int_{t-1}^{3} (1)(2)\\,d\\lambda = 2(4 - t)$$

![The convolution of a 1 second wide unit rectangle with a 3 second wide rectangle of height 2, computed as a discrete convolution sum. The result ramps at slope 2 to a plateau of 2 held from 1 to 3 seconds, then ramps back to zero at 4 seconds, enclosing a total area of 6.](/courses/fe-ee/figures/lin2-td-conv-trapezoid.svg)

Check the area: each of the two triangles contributes $0.5 \\times 1 \\times 2 = 1$, and the
plateau contributes $2 \\times 2 = 4$, so the total is 6. The product of
the input areas is $1 \\times 6 = 6$. They agree.

**The special case worth recognising.** When the two rectangles have EQUAL
width the plateau has zero length and the trapezoid degenerates into a
triangle. Convolving a 2-second unit rectangle with itself gives a triangle of
base 4 s peaking at 2 at t = 2 s, and the exam uses this shape constantly.

## 8.3 Worked Example: two exponentials

**Given** $x(t) = e^{-5t}u(t)$ and $h(t) = e^{-2t}u(t)$, find y(t), its peak
value, and the instant of the peak.

Flip and slide, factoring the term that does not depend on the integration
variable out of the integral:

$$y(t) = \\int_{0}^{t} e^{-5\\lambda }e^{-2(t-\\lambda )}\\,d\\lambda = e^{-2t}\\int_{0}^{t} e^{-3\\lambda }\\,d\\lambda$$

$$y(t) = e^{-2t}\\cdot \\frac{1 - e^{-3t}}{3} = \\frac{e^{-2t} - e^{-5t}}{3}$$

The peak is where the derivative vanishes, $2e^{-2t} = 5e^{-5t}$, so
$e^{3t} = 2.5$ and

$$t_{\\text{peak}} = \\frac{\\ln 2.5}{3} = 0.3054\\ \\mathrm{s}$$

Substituting back and simplifying gives a compact closed form:

$$y_{\\text{peak}} = 0.2 \\times 2.5^{-2/3} = 0.10858$$

![Convolution of two decaying exponentials, exp(-5t) with exp(-2t), computed as a discrete convolution sum on a fine grid. The output starts at zero, peaks at 0.10858 at t = 0.3054 s, and then decays on the slower of the two time constants.](/courses/fe-ee/figures/lin2-td-conv-exponentials.svg)

Two structural facts are visible in the figure and both generalise. The output
starts at ZERO even though both inputs start at 1, because at t = 0 there is no
overlap to integrate. And the tail decays on the SLOWER of the two exponents,
$e^{-2t}$, because the faster one has already vanished. The total area is
$(1/5)(1/2) = 0.1$, the product of the input areas, as promised.

## 8.4 Worked Example: convolution with an impulse

**Given** $x(t) = 4e^{-t}u(t)$ and $h(t) = 3\\delta (t-2)$, find y(t).

No integral is needed. The sifting property does the work:

$$y(t) = \\int_{-\\infty }^{\\infty } x(\\lambda )\\,3\\delta (t - 2 - \\lambda )\\,d\\lambda = 3x(t-2)$$

$$y(t) = 12e^{-(t-2)}u(t-2)$$

The impulse scaled the signal by 3 and delayed it by 2 s, and did nothing else.
On the exam, any convolution whose second argument is an impulse or a sum of
impulses should be answered in one line — writing out the integral is a sign
you have missed the shortcut.

## 8.5 The graphical procedure, in the order that works

1. Choose which signal to flip. Flip the SIMPLER one, since commutativity makes
   the choice free.
2. Write the flipped signal as $h(t - \\lambda )$ and note that increasing t
   slides it to the RIGHT along the $\\lambda$ axis.
3. Identify every t at which an edge of one signal crosses an edge of the
   other. Those instants are the boundaries of the regions.
4. Within each region, write the integral with the overlap limits and evaluate.
5. Check continuity at every boundary and check the total area at the end.

Step 5 catches nearly every algebra slip. Convolution of two bounded signals is
always continuous, so a jump in your answer means a limit is wrong.

| Input pair | Output shape | Duration |
|---|---|---|
| Rectangle, rectangle (equal width $T$) | triangle | $2T$ |
| Rectangle (width $a$), rectangle (width $b$) | trapezoid | $a + b$ |
| Rectangle, decaying exponential | rise then decay | infinite |
| Exponential, exponential | rise then decay on the slower rate | infinite |
| Anything, $\\delta (t - t_{0})$ | the signal, shifted | unchanged |`,
        examTip: 'Sketch both signals on the same lambda axis before writing a single integral. The regions are where the edges cross, and there are never more than four of them on this exam. Most convolution questions can be answered from the shape and the area alone, without evaluating anything.',
        importantNote: 'The area of a convolution equals the product of the two input areas. Use it as a final check every time: if your answer encloses the wrong area, a limit of integration is wrong, and you will find the error faster by re-examining the overlap regions than by re-doing the algebra.',
      },
      {
        id: 'td-steady-state-error',
        title: '9. Steady-State Error and System Type',
        content: `## 9.1 The error signal, and the theorem that evaluates it

For a unity negative feedback loop with forward path G(s), the error is the
difference between the reference and the output:

$$E(s) = R(s) - Y(s) = \\frac{R(s)}{1 + G(s)}$$

Its steady-state value follows from the final-value theorem, provided the loop
is stable:

$$e_{ss} = \\lim_{s \\to 0} sE(s) = \\lim_{s \\to 0} \\frac{sR(s)}{1 + G(s)}$$

That single expression generates every steady-state-error result on the exam.
Everything else is bookkeeping about how many factors of s sit in the
denominator of G.

## 9.2 System type, and the three error constants

The **type** of a loop is the number of pure integrators in G(s), that is the
multiplicity of the pole at the origin:

$$G(s) = \\frac{K\\prod (s + z_{i})}{s^{N}\\prod (s + p_{j})} \\;\\Longrightarrow\\; \\text{type } N$$

Three limits summarise the loop's DC behaviour:

$$K_{p} = \\lim_{s\\to 0} G(s), \\qquad K_{v} = \\lim_{s\\to 0} sG(s), \\qquad K_{a} = \\lim_{s\\to 0} s^{2}G(s)$$

and the errors to the three standard inputs follow directly:

$$e_{ss}(\\text{step of size } A) = \\frac{A}{1 + K_{p}}$$

$$e_{ss}(\\text{ramp } At) = \\frac{A}{K_{v}}$$

$$e_{ss}(\\text{parabola } At^{2}) = \\frac{2A}{K_{a}}$$

The factor of 2 in the last line trips up more candidates than any other detail
in this topic. The standard parabolic reference is $t^{2}/2$, whose transform
is $1/s^{3}$. An input written as $At^{2}$ is therefore $2A$ times the
standard one, and its error is $2A/K_a$, not $A/K_a$.

| Type | $K_p$ | $K_v$ | $K_a$ | Step error | Ramp error | Parabola error |
|---|---|---|---|---|---|---|
| 0 | finite | 0 | 0 | $1/(1+K_p)$ | infinite | infinite |
| 1 | infinite | finite | 0 | 0 | $1/K_v$ | infinite |
| 2 | infinite | infinite | finite | 0 | 0 | $1/K_a$ |

Read the table as a staircase. Each added integrator kills one more error
outright and demotes the next one from infinite to finite. The price is paid in
stability margin, which is why type-2 loops are rare and type-3 loops
essentially do not exist in practice.

## 9.3 Worked Example: a type-0 loop under a step

**Given** $G(s) = 10/[(s+1)(s+5)]$ in unity feedback, driven by
$r(t) = 6u(t)$. Find the steady-state error and the steady-state output.

$$K_{p} = G(0) = \\frac{10}{(1)(5)} = 2$$

$$e_{ss} = \\frac{6}{1 + 2} = \\frac{6}{3} = 2$$

The output therefore settles at $6 - 2 = 4$. Confirm it from the closed loop:

$$T(s) = \\frac{10}{s^{2} + 6s + 15}, \\qquad T(0) = \\frac{10}{15} = 0.6667$$

$$y_{ss} = 6 \\times 0.6667 = 4$$

![A type-0 unity feedback loop with Kp = 2 settling one third short of a unit step in the upper panel, and a type-1 loop with Kv = 5 tracking a unit ramp with a permanent lag of 0.2 in the lower panel. Both errors are read off numerical marches of the closed loops.](/courses/fe-ee/figures/lin2-td-system-type.svg)

A type-0 loop can never eliminate step error, no matter how well damped it is.
The only lever is $K_p$, and driving the error to zero would need infinite
gain. That is precisely what an integrator provides, which is the whole
argument for the I term in a PID controller.

## 9.4 Worked Example: a type-1 loop under a ramp

**Given** $G(s) = 20/[s(s+4)]$ in unity feedback, driven by $r(t) = 4t$.

The single pole at the origin makes this type 1, so the step error is zero and
the ramp error is finite:

$$K_{v} = \\lim_{s\\to 0} s \\cdot \\frac{20}{s(s+4)} = \\frac{20}{4} = 5$$

$$e_{ss} = \\frac{4}{5} = 0.8$$

The output tracks the ramp with the same slope but permanently 0.8 behind it,
which is what the lower panel of the figure shows for a unit ramp with its
0.2 lag. The lag is a POSITION error, not a velocity error — the output is
never slower than the reference, it is simply displaced.

## 9.5 Worked Example: a type-2 loop under a parabola

**Given** $G(s) = 50/[s^{2}(s+10)]$ in unity feedback, driven by
$r(t) = 3t^{2}$.

$$K_{a} = \\lim_{s\\to 0} s^{2}\\cdot \\frac{50}{s^{2}(s+10)} = \\frac{50}{10} = 5$$

The input is $3t^{2}$, which is $6$ times the standard $t^{2}/2$, so

$$e_{ss} = \\frac{2(3)}{5} = \\frac{6}{5} = 1.2$$

Step error and ramp error are both zero for this loop. Two integrators buy
perfect tracking of anything that grows no faster than linearly, and leave a
finite error against acceleration.

## 9.6 The three cautions

- **Stability first.** Every result above rests on the final-value theorem, so
  it is valid only if the CLOSED loop is stable. A type-2 loop with too much
  gain is often unstable, and then its "steady-state error" is not merely
  wrong, it does not exist.
- **Unity feedback only.** The formulas assume H = 1. For non-unity feedback,
  either redraw the loop into an equivalent unity-feedback form or go back to
  $E(s) = R(s)/(1 + G(s)H(s))$ and take the limit directly.
- **Count integrators in the LOOP.** Poles at the origin in the reference, or
  in a prefilter outside the loop, do not count. It is the multiplicity of the
  origin pole in the open-loop product GH that sets the type.`,
        examTip: 'Identify the type by counting factors of s in the denominator of the OPEN-loop transfer function, then read the answer straight off the staircase table. Only the finite entry on that row needs arithmetic; the zeros and infinities are structural and require none.',
        importantNote: 'A reference written as A*t^2 is 2A times the standard parabola t^2/2, so its steady-state error is 2A/Ka. Writing A/Ka halves the answer, and half the correct value is almost always one of the offered choices.',
      },
      {
        id: 'td-problem-set-a',
        title: '10. Problem Set A: First- and Second-Order Transients',
        content: `## 10.1 Problem Set A

**A1.** A first-order step response completes 63.2% of its change in 0.4 s.
Find the time constant, the 2% settling time, and the 10-to-90 percent rise
time.

**A2.** A unit-step record overshoots by 20% and peaks at 0.15 s. Find
$\\zeta$, $\\omega _d$, $\\omega _n$ and the 2% settling time.

**A3.** An impulse response is measured as $h(t) = 12e^{-4t}u(t)$. Find the DC
gain, the transfer function, and the final value of the step response.

**A4.** For $\\zeta = 0.3$ and $\\omega _n = 20$ rad/s, find the frequency at
which $\\lvert H(j\\omega ) \\rvert$ peaks, and the height of that peak.

**A5.** A ringing record shows successive overshoot peaks in the ratio
0.1386. Find the damping ratio.

**A6.** A second-order system has $\\zeta = 2$ and $\\omega _n = 20$ rad/s.
Find both pole locations and the dominant time constant.

**A7.** For $H(s) = 32/(s^{2} + 4s + 16)$ driven by a unit step, find the
steady-state value, the percent overshoot and the peak time.

## 10.2 Worked Answers, Problem Set A

**A1 — Worked.** The 63.2% point defines the time constant outright, so
$\\tau = 0.4$ s. Then

$$t_{s} = \\tau \\ln 50 = 0.4 \\times 3.912 = 1.565\\ \\mathrm{s}$$

$$t_{r} = \\tau \\ln 9 = 0.4 \\times 2.1972 = 0.879\\ \\mathrm{s}$$

*Trap:* using the 4-tau rule to get 1.6 s and then treating it as exact. It is
fine as an estimate, but a question that specifies "2% band" and offers both
1.565 and 1.6 wants the logarithm. A second trap reads the 10-to-90 rise time
as $2\\tau$, giving 0.8 s instead of 0.879 s.

**A2 — Worked.** Invert the overshoot relation, then use the peak time:

$$\\zeta = \\frac{\\ln 5}{\\sqrt{\\pi ^{2} + \\ln ^{2}5}} = \\frac{1.6094}{3.5299} = 0.4559$$

$$\\omega _d = \\frac{\\pi }{0.15} = 20.944\\ \\mathrm{rad/s}, \\qquad \\omega _n = \\frac{20.944}{0.89001} = 23.532\\ \\mathrm{rad/s}$$

$$t_{s} = 4/10.7296 = 0.3728\\ \\mathrm{s}$$

*Trap:* treating the peak time as $\\pi /\\omega _n$ rather than
$\\pi /\\omega _d$. That gives $\\omega _n = 20.944$ directly and a settling
time of $4/9.5494 = 0.4189$ s — about 12% too long, and it is always among the
choices.

**A3 — Worked.** The exponent gives the pole: $s = -4$, $\\tau = 0.25$ s. The
DC gain is the AREA under h(t):

$$K = \\int_{0}^{\\infty } 12e^{-4t}dt = \\frac{12}{4} = 3$$

$$H(s) = \\frac{12}{s+4}, \\qquad g(\\infty ) = H(0) = 3$$

*Trap:* answering 12, the coefficient of the exponential. That is $K/\\tau$,
the initial VALUE of the impulse response, and it is four times too large here.

**A4 — Worked.** The magnitude peak sits at the damped RESONANT frequency:

$$\\omega _r = \\omega _n\\sqrt{1 - 2\\zeta ^{2}} = 20\\sqrt{1 - 0.18} = 18.111\\ \\mathrm{rad/s}$$

$$M_{r} = \\frac{1}{2\\zeta \\sqrt{1-\\zeta ^{2}}} = 1.747$$

*Trap:* answering $\\omega _d = 19.078$ rad/s, the frequency the TIME response
rings at. The two differ by about 5% here and by more as damping rises; above
$\\zeta = 0.707$ the resonant peak disappears entirely while $\\omega _d$
still exists.

**A5 — Worked.** The peak ratio is $e^{-\\delta }$ where $\\delta$ is the
logarithmic decrement:

$$\\delta = \\ln \\frac{1}{0.1386} = 1.976 = \\frac{2\\pi \\zeta }{\\sqrt{1-\\zeta ^{2}}}$$

$$\\zeta = \\frac{\\delta }{\\sqrt{4\\pi ^{2} + \\delta ^{2}}} = \\frac{1.976}{6.5866} = 0.300$$

*Trap:* treating the peak ratio as the overshoot and reading $\\zeta$ from the
overshoot formula, which gives $\\zeta = 0.5325$. The overshoot compares the
first peak with the FINAL VALUE; the decrement compares one peak with the NEXT
peak, and the two differ by a factor of two in the exponent.

**A6 — Worked.** For $\\zeta > 1$ the poles are real:

$$p_{1,2} = -\\omega _n\\left(\\zeta \\mp \\sqrt{\\zeta ^{2}-1}\\right) = -20\\left(2 \\mp \\sqrt{3}\\right)$$

$$p_{1} = -5.359, \\qquad p_{2} = -74.641, \\qquad \\tau _{\\text{dom}} = 1/5.359 = 0.1866\\ \\mathrm{s}$$

*Trap:* reporting $\\tau = 1/\\omega _n = 0.05$ s. The natural frequency is a
parameter of the standard form, not a pole location, and for an overdamped
system neither pole is at $-\\omega _n$. A response built on 0.05 s would be
nearly four times too fast.

**A7 — Worked.** Read the standard form off the coefficients:

$$\\omega _n = \\sqrt{16} = 4\\ \\mathrm{rad/s}, \\qquad \\zeta = \\frac{4}{2\\times 4} = 0.5, \\qquad H(0) = \\frac{32}{16} = 2$$

$$M_{p} = e^{-\\pi (0.5)/\\sqrt{0.75}} = 16.30\\%, \\qquad t_{p} = \\frac{\\pi }{4\\sqrt{0.75}} = 0.9069\\ \\mathrm{s}$$

so the response peaks at $2 \\times 1.1630 = 2.326$ and settles back to 2.

*Trap:* reporting the peak VALUE 2.326 when the question asks for percent
overshoot, or vice versa. Percent overshoot is measured against the final value
and is 16.30% regardless of the DC gain; the peak value depends on both.`,
        examTip: 'When a record is given instead of a transfer function, read the overshoot and the ring period first. Those two measurements invert cleanly to zeta and omega-n because neither one contaminates the other, and every remaining specification follows from that pair.',
      },
      {
        id: 'td-problem-set-b',
        title: '11. Practice Problems B: Theorems, Convolution and Tracking',
        content: `## 11.1 Practice Problems B

**B1.** Find $y(\\infty )$ for $Y(s) = 20/[s(s+4)(s+5)]$, after checking that
the theorem applies.

**B2.** Find $y(0^{+})$ and $y(\\infty )$ for
$Y(s) = (3s+6)/(s^{2}+7s+12)$.

**B3.** Apply the final-value theorem to $Y(s) = 8/(s^{2}+16)$ and state
whether the result is meaningful.

**B4.** Convolve a 3-second-wide unit rectangle with $h(t) = 2e^{-t}u(t)$.
Find y(1), the peak value, and y(5).

**B5.** A unity feedback loop has $G(s) = 10/[(s+1)(s+5)]$ and is driven by
$r(t) = 6u(t)$. Find the steady-state error and the steady-state output.

**B6.** A unity feedback loop has $G(s) = 50/[s^{2}(s+10)]$ and is driven by
$r(t) = 3t^{2}$. Find the steady-state error.

**B7.** Find $x(t) * 3\\delta (t-2)$ for $x(t) = 4e^{-t}u(t)$, and state the
total area of the result.

## 11.2 Worked Answers, Problem Set B

**B1 — Worked.** $sY(s) = 20/[(s+4)(s+5)]$ has poles at $-4$ and $-5$, both in
the open left half-plane, so the theorem applies:

$$y(\\infty ) = \\frac{20}{(4)(5)} = \\frac{20}{20} = 1$$

*Trap:* forgetting to multiply by s and evaluating Y(0) itself, which is
infinite because of the pole at the origin. The factor of s is what cancels the
step's own pole.

**B2 — Worked.** The numerator degree is one below the denominator degree, so
the initial value is the ratio of leading coefficients:

$$y(0^{+}) = \\lim_{s\\to \\infty } \\frac{3s^{2}+6s}{s^{2}+7s+12} = 3$$

$$y(\\infty ) = \\lim_{s\\to 0} \\frac{3s^{2}+6s}{s^{2}+7s+12} = 0$$

Inverting confirms it: the residues at $-3$ and $-4$ are $-3$ and $6$, giving
$y(t) = -3e^{-3t} + 6e^{-4t}$, whose value at zero is 3.

*Trap:* evaluating Y(0) = 6/12 = 0.5 and calling it the initial value. That is
neither the initial nor the final value; it is just Y at s = 0, a number with
no time-domain meaning on its own.

**B3 — Worked.** The theorem would give

$$\\lim_{s\\to 0} \\frac{8s}{s^{2}+16} = 0$$

but $sY(s)$ has poles at $\\pm j4$, ON the imaginary axis, so the condition
fails and the result is meaningless. The true signal is
$y(t) = 2\\sin 4t$, which never settles.

*Trap:* reporting 0. It is arithmetically correct as a limit of $sY(s)$ and
completely wrong as a statement about y(t). The correct answer is that no final
value exists.

**B4 — Worked.** While the pulse is still arriving, $0 \\le t < 3$:

$$y(t) = \\int_{0}^{t} 2e^{-(t-\\lambda )}d\\lambda = 2\\left(1 - e^{-t}\\right)$$

$$y(1) = 2\\left(1 - e^{-1}\\right) = 1.2642$$

The maximum is at the instant the pulse ends, t = 3:

$$y_{\\max} = 2\\left(1 - e^{-3}\\right) = 1.9004$$

After that the input is gone and the stored response decays:

$$y(t) = 2\\left(e^{3}-1\\right)e^{-t}, \\qquad y(5) = 0.2572$$

*Trap:* answering 2 for the peak, on the reasoning that the DC gain is 2 and
the pulse height is 1. The pulse ends before the response has finished
climbing; 3 s is only three time constants, so 95% of the way there, and
1.9004 is what actually appears.

**B5 — Worked.** This is a type-0 loop:

$$K_{p} = \\frac{10}{(1)(5)} = 2, \\qquad e_{ss} = \\frac{6}{1+2} = 2$$

$$y_{ss} = 6 - 2 = 4$$

*Trap:* answering $1/(1+K_p) = 0.3333$ and ignoring the input amplitude. The
error formula is written for a UNIT step; a step of size 6 produces six times
the error.

**B6 — Worked.** Two poles at the origin make this type 2:

$$K_{a} = \\lim_{s\\to 0} \\frac{50}{s+10} = \\frac{50}{10} = 5$$

The reference $3t^{2}$ equals $6$ standard parabolas $t^{2}/2$, so

$$e_{ss} = \\frac{6}{5} = 1.2$$

*Trap:* using $3/5 = 0.6$ by taking the coefficient 3 straight to the numerator
and forgetting that the standard parabola carries the factor of one half.
Exactly half the right answer, and always offered.

**B7 — Worked.** The impulse scales and shifts, and nothing else happens:

$$x(t) * 3\\delta (t-2) = 3x(t-2) = 12e^{-(t-2)}u(t-2)$$

The area of the result is the product of the two input areas:

$$\\left(\\int_{0}^{\\infty } 4e^{-t}dt\\right)(3) = 4 \\times 3 = 12$$

*Trap:* shifting in the wrong direction and writing $u(t+2)$, which would make
the system respond two seconds before the impulse arrived. The argument of the
delta is $t - 2$, so the response is delayed BY 2, and every shifted signal
must keep its step function shifted with it.`,
        examTip: 'For steady-state error questions, write down the type, the relevant error constant, and the input amplitude as three separate numbers before combining them. The formulas are short enough that every mistake comes from mixing up which amplitude belongs where, and separating them on paper eliminates that class of error.',
        importantNote: 'A convolution with a shifted impulse produces a shifted signal, and the shifted unit step must travel with it. Writing 12 exp(-(t-2)) u(t) rather than u(t-2) makes the response begin at t = 0 with a value of 12 exp(2) = 88.7, which is both non-causal and enormous.',
      },
    ],
    keyTakeaways: [
      'Impulse response h(t) fully characterizes LTI systems; use convolution y(t) = ∫x(τ)h(t−τ)dτ to find output.',
      'Step response g(t) = ∫h(τ)dτ reveals settling time and overshoot; h(t) = dg(t)/dt.',
      'Causal systems satisfy h(t) = 0 for t < 0; all physical real-time systems are causal.',
      'BIBO stable ↔ all poles in open LHP ↔ ∫|h(t)|dt < ∞.',
      'Convolution in time = multiplication in frequency — the cornerstone of filtering.',
      'Marginal stability (poles on jω axis) is BIBO unstable — sustained oscillations.',
    ],
  },

  fee_freq_domain: {
    topicId: 'fee_freq_domain',
    title: 'Frequency Domain Analysis: Fourier & Laplace',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'The Fourier Transform reveals which frequencies compose a signal, while the Laplace Transform converts differential equations into algebraic equations. Together they form the analytical backbone of linear systems on the FE exam.',
    sections: [
      {
        id: 'fd-fourier',
        title: '1. Fourier Series and Fourier Transform',
        content: `## 1.1 Fourier Series (Periodic Signals)

For a signal with period **$T_{0}$** and fundamental frequency **$f_{0} = 1/T_{0}$**, the **trigonometric form** is:

**$x(t) = a_{0} + \\sum _{n=1}^{\\infty }a_{n}\\cos (n\\omega _{0}t) + \\sum _{n=1}^{\\infty }b_{n}\\sin (n\\omega _{0}t)$**

The **complex exponential form** is more compact:

**$x(t) = \\sum _{n=-\\infty }^{\\infty }c_{n}e^{j2\\pi nf_{0}t}$**

where **$c_{n} = \\dfrac{1}{T_{0}}\\displaystyle\\int _{0}^{T_{0}}x(t)e^{-j2\\pi nf_{0}t}\\,dt$**

| Signal Type | Representation | Spectrum |
|---|---|---|
| Periodic | Fourier Series | **Discrete** — spikes at harmonics nf₀ |
| Aperiodic | Fourier Transform | **Continuous** — smooth amplitude vs. frequency |

## 1.2 Fourier Transform (Aperiodic Signals)

The **Fourier Transform** extends analysis to non-periodic signals:

**$X(f) = \\displaystyle\\int _{-\\infty }^{\\infty }x(t)e^{-j2\\pi ft}\\,dt$**

Inverse: **$x(t) = \\displaystyle\\int _{-\\infty }^{\\infty }X(f)e^{j2\\pi ft}\\,df$**

### Key Properties

- **Linearity**: α·$x_{1}$ + β·$x_{2}$ → α·$X_{1}$ + β·$X_{2}$
- **Time shift**: x(t − $t_{0}$) → X(f) · e^(−j2πft₀)
- **Frequency shift**: x(t) · e^(j2πf₀t) → X(f − $f_{0}$)
- **Convolution theorem**: x(t) * h(t) ↔ X(f) · H(f)
- **Parseval's theorem**: $\\displaystyle\\int _{-\\infty }^{\\infty }\\lvert x(t)\\rvert ^{2}dt = \\int _{-\\infty }^{\\infty }\\lvert X(f)\\rvert ^{2}df$ (energy conservation)

Differentiation in time multiplies by **$j2\\pi f$** in frequency, so signals with sharp edges (discontinuities) have broader spectra.

![A square wave and its Fourier partial sums with one, three and five nonzero harmonics, each sum built term by term from sin(k omega t) weighted by 4/(pi k). Adding harmonics sharpens the edges, and the overshoot beside each edge persists no matter how many terms join.](/courses/fe-ee/figures/lsys-fourier-square.svg)

The square wave makes that claim concrete. Its series contains only odd
harmonics, the k-th carrying amplitude 4/(pi k), so the fundamental alone
already resembles the target while the edges keep demanding ever-higher
frequencies. The stubborn overshoot flanking each edge — the Gibbs
phenomenon, about 9% of the jump — never shrinks as terms are added; it only
narrows. Truncating a Fourier series rounds corners and rings beside
discontinuities, which is worth knowing whenever a filter must pass a
fast-edged signal.`,
        examTip: 'On the FE exam, use the convolution theorem to avoid computing convolution integrals — just multiply in the frequency domain and inverse-transform. Parseval\'s theorem lets you compute signal energy from either domain, whichever is simpler.',
      },
      {
        id: 'fd-laplace',
        title: '2. Laplace Transform and the s-Domain',
        content: `## 2.1 The Laplace Transform

The Laplace Transform adds an exponential convergence factor to the Fourier Transform, handling unstable and growing signals:

**$X(s) = \\displaystyle\\int _{0^{-}}^{\\infty }x(t)e^{-st}\\,dt$** where **$s = \\sigma + j\\omega$**

This converts differential equations into **algebraic equations** in s, dramatically simplifying circuit and system analysis.

### Essential Transform Pairs

| Time Domain x(t) | s-Domain X(s) | ROC |
|---|---|---|
| $\\delta (t)$ | 1 | All s |
| u(t) | 1/s | $Re(s) > 0$ |
| $e^{-at}\\cdot u(t)$ | 1/(s+a) | $Re(s) > -a$ |
| $t\\cdot e^{-at}\\cdot u(t)$ | $1/(s+a)^{2}$ | $Re(s) > -a$ |
| $\\sin (\\omega t)\\cdot u(t)$ | $\\omega /(s^{2}+\\omega ^{2})$ | $Re(s) > 0$ |
| $\\cos (\\omega t)\\cdot u(t)$ | $s/(s^{2}+\\omega ^{2})$ | $Re(s) > 0$ |

## 2.2 Region of Convergence (ROC)

The **ROC** specifies the values of s where the integral converges. It is essential for uniqueness — different time-domain signals can have the same algebraic expression but different ROCs.

- **Causal signals**: ROC is a right half-plane (Re(s) > σ₀)
- **Anti-causal signals**: ROC is a left half-plane
- **Two-sided signals**: ROC is a vertical strip

### Important Properties

- **Differentiation**: L{f'(t)} = s·F(s) − f($0^{-}$) — converts derivatives to multiplication
- **Integration**: L{∫f(t)dt} = F(s)/s — converts integrals to division
- **Final Value Theorem**: lim(t→∞) f(t) = lim(s→0) s·F(s) — find steady-state without inverse transform
- **Initial Value Theorem**: lim(t→$0^{+}$) f(t) = lim(s→∞) s·F(s)`,
        examTip: 'The Final Value Theorem is a huge time-saver on the FE exam — it gives steady-state values directly from the s-domain without performing an inverse transform. But verify all poles of s·F(s) are in the LHP first, otherwise the theorem gives a wrong answer.',
        importantNote: 'On the FE exam, use the Laplace transform table provided in the reference handbook — do not try to compute transforms from the integral definition. The table lookup approach is much faster and less error-prone.',
      },
      {
        id: 'fd-laplace-shortcuts',
        title: '3. Common Laplace Transform Pairs & Exam Shortcuts',
        content: `## 3.1 The 10 Must-Know Laplace Transform Pairs

Memorize these pairs — they cover 90% of FE exam transform problems:

| # | Time Domain f(t) | Laplace Domain F(s) |
|---|---|---|
| 1 | **$\\delta (t)$** | **1** |
| 2 | **u(t)** | **1/s** |
| 3 | **$t\\cdot u(t)$** | **$1/s^{2}$** |
| 4 | **$t^n\\cdot u(t)$** | **$n!/s^{n+1}$** |
| 5 | **$e^{-at}\\cdot u(t)$** | **1/(s+a)** |
| 6 | **$t\\cdot e^{-at}\\cdot u(t)$** | **$1/(s+a)^{2}$** |
| 7 | **$\\sin (\\omega t)\\cdot u(t)$** | **$\\omega /(s^{2}+\\omega ^{2})$** |
| 8 | **$\\cos (\\omega t)\\cdot u(t)$** | **$s/(s^{2}+\\omega ^{2})$** |
| 9 | **$e^{-at}\\cdot \\sin (\\omega t)\\cdot u(t)$** | **$\\omega /((s+a)^{2}+\\omega ^{2})$** |
| 10 | **$e^{-at}\\cdot \\cos (\\omega t)\\cdot u(t)$** | **$(s+a)/((s+a)^{2}+\\omega ^{2})$** |

**Pattern recognition tip**: Pairs 9 and 10 are just pairs 7 and 8 with **s replaced by (s+a)** — this is the frequency-shift property.

## 3.2 Partial Fraction Decomposition Tips

**Step 1**: Factor the denominator completely into first-order and irreducible quadratic terms.

**Step 2**: Use the **cover-up method** for distinct real poles:
- For A/(s+a): cover (s+a) in the original expression, evaluate at s = −a

**Step 3**: For complex conjugate poles, keep as a quadratic:
- **$(As+B)/(s^{2}+2\\alpha s+\\omega _{0}^{2})$** → complete the square to **$(A(s+\\alpha)+C)/((s+\\alpha)^{2}+\\omega _d^{2})$**
- Match to damped sinusoid pairs 9 and 10

**Step 4**: For repeated poles, use differentiation:
- **$B_{2} = F(s)\\cdot (s+a)^{2}|_{s=-a}$**, then **$B_{1} = d/ds[F(s)\\cdot (s+a)^{2}]|_{s=-a}$**

## 3.3 Final Value vs. Initial Value Theorem

| Theorem | Formula | Gives You | Validity Check |
|---|---|---|---|
| **Final Value** | $\\lim (s\\to 0) s\\cdot F(s)$ | Steady-state f(∞) | All poles of s·F(s) in LHP |
| **Initial Value** | $\\lim (s\\to \\infty) s\\cdot F(s)$ | Starting value f(0⁺) | Always valid if F(s) is proper |

**When to use each**:
- **Final Value Theorem**: Finding steady-state output, DC gain verification, checking if a controller eliminates steady-state error
- **Initial Value Theorem**: Verifying initial conditions match the problem statement, sanity-checking inverse transforms

**Critical trap**: The Final Value Theorem gives a **wrong answer** if s·F(s) has poles on the imaginary axis or in the RHP. For example, F(s) = ω/(s²+ω²) represents sin(ωt) — applying FVT gives lim(s→0) sω/(s²+ω²) = 0, but sin(ωt) does NOT converge to zero. Always check pole locations first.`,
        examTip: 'The FE exam reference handbook includes a Laplace transform table, but knowing the pairs from memory saves lookup time. Focus on pairs 5 (exponential decay) and 9-10 (damped sinusoids) — these appear in nearly every circuit transient and control system problem.',
        importantNote: 'Before applying the Final Value Theorem, ALWAYS verify that all poles of s·F(s) are in the open left half-plane. If even one pole is on the jw axis or in the RHP, the theorem is invalid and will give an incorrect result. This validity check is itself a common exam question.',
      },
      {
        id: 'fd-sdomain-resonance',
        title: '4. s-Domain Circuits, Frequency Response, and Resonance',
        content: `## 4.1 Impedance generalises to s

The reason the Laplace transform owns circuit transients is that every
element becomes an impedance in s, and stored energy becomes a source:

| Element | Element law | s-domain impedance | Initial energy enters as |
|---|---|---|---|
| Resistor | v = Ri | R | — |
| Inductor | v = L di/dt | sL | series voltage source $L\\cdot i(0^{-})$ |
| Capacitor | i = C dv/dt | 1/(sC) | series voltage source $v(0^{-})/s$ |

With zero initial conditions the table's middle column is the whole story,
and a switched network becomes ordinary series-parallel algebra with s
riding along as a symbol. With initial energy present, the derivative rule
L{f'} = sF(s) - f($0^{-}$) delivers the extra term, and it lands in the
circuit as a source — the physics of stored energy expressed as bookkeeping.
A 2 H inductor carrying 3 A at the switching instant, for example,
contributes the constant L x i($0^{-}$) = 6 to the transformed loop
equation, and that term alone is what makes the eventual inverse transform
honour the current that was already flowing.

Note the pattern in the impedances themselves: sL grows with s and 1/(sC)
shrinks, which is the transform-domain restatement of "inductors fight fast
change, capacitors welcome it."

## 4.2 A switched circuit solved without a differential equation

**Worked:** a 100 V step is applied through 50 kilohm to an uncharged 10
microfarad capacitor. RC = 0.5 s. In the s-domain the source is 100/s and
the capacitor voltage follows from the impedance divider:

$$V_C(s) = (100/s) \\cdot (1/(sC))/(R + 1/(sC)) = (100/s) \\cdot 1/(RCs + 1) = 200/(s(s + 2))$$

Partial fractions: 200/(s(s+2)) = 100/s - 100/(s+2). Table lookup, term by
term:

**$v_C(t) = 100(1 - e^{-2t})\\ \\mathrm{V}$**

which is exactly the answer the transient chapter builds from
x(t) = x(∞) + [x(0) - x(∞)]e^(-t/tau) with tau = 0.5 s. The two roads must
always meet like this, and when they do not, the transform algebra is the
place to look first. Both theorems check it without inverting anything: the Final Value Theorem gives
s·V_C(s) → 200/2 = 100 V as s → 0 (the capacitor charges fully), and the
Initial Value Theorem gives 0 V as s → ∞ (it starts uncharged). Running both
limits takes ten seconds and catches most partial-fraction slips.

## 4.3 Frequency response: evaluate on the jω axis

For a stable system, substituting **$s = j\\omega$** into H(s) yields the
steady-state response to a sinusoid at $\\omega$: the magnitude |H(jω)|
scales the amplitude and the angle shifts the phase. The first-order
low-pass with corner $\\omega _c = 1/\\tau$ behaves as:

| $\\omega /\\omega _c$ | Magnitude | Phase |
|---|---|---|
| 0.1 | 0.995 | $-5.7^\\circ$ |
| 1 | 0.707 | $-45^\\circ$ |
| 10 | 0.0995 | $-84.3^\\circ$ |

Three landmarks to memorise: at the corner the magnitude is 1/sqrt(2) — the
-3 dB, half-power point — and the phase is exactly -45 degrees; a decade
below the corner the filter is essentially transparent; a decade above it
attenuates tenfold and the phase saturates toward -90 degrees.

**Worked:** an RC low-pass with R = 1.6 kilohm and C = 0.1 microfarad has
omega_c = 1/RC = 1/(1.6e-4) = **6250 rad/s**, i.e. f_c = 6250/(2 pi) =
**995 Hz** — a one-kilohertz filter to component tolerance. Drive it with
100 mV at 10 kHz: the frequency ratio is almost exactly 10, so the output is
about 100 x 0.0995 = **10 mV**, lagging by 84 degrees. No transform was
inverted anywhere; the whole answer came from reading one row of the table
above.

## 4.4 Resonance is a pole pair close to the jω axis

Resonance, met in the circuits chapters as X_L cancelling X_C, reappears
here as geometry: a lightly damped complex pole pair sitting near the
imaginary axis makes |H(jω)| peak as $\\omega$ sweeps past. The band-pass
standard form shows the anatomy:

**$H(s) = (\\omega _{0}/Q)s / (s^{2} + (\\omega _{0}/Q)s + \\omega _{0}^{2})$**

Its magnitude peaks at exactly $\\omega _{0}$ and falls to the half-power
level at two frequencies whose separation is the bandwidth:

**$BW = \\omega _{0}/Q$**

"Half-power" means what it says: at the two band edges the magnitude is
1/sqrt(2) of the peak, so the power delivered — proportional to magnitude
squared — is exactly half its resonant value. The two edges straddle
$\\omega _{0}$ as its GEOMETRIC mean, $\\omega _{0} = \\sqrt{\\omega _{1}\\omega _{2}}$,
so the band sits symmetrically on a logarithmic axis rather than a linear
one — visibly off-centre for low-Q circuits, where the arithmetic midpoint
is a wrong answer the exam likes to offer.

**Worked, series RLC:** L = 1 mH, C = 1 microfarad, R = 10 ohm. The
resonant frequency is omega_0 = 1/sqrt(1e-3 x 1e-6) = **31,600 rad/s**
(f_0 = 5.03 kHz). Quality factor: Q = omega_0 L/R = 31,600 x 0.001/10 =
**3.16**. Bandwidth: BW = omega_0/Q = **10,000 rad/s** — and the cross-check
BW = R/L = 10/0.001 gives the same 10,000 rad/s by a route that never
touches Q.

**Same L and C in parallel with R = 10 kilohm:** the resonant frequency
does not move, but the Q formula inverts:

| Topology | Q | This circuit | BW = $\\omega _{0}/Q$ |
|---|---|---|---|
| Series RLC | $\\omega _{0}L/R$ | 3.16 | 10,000 rad/s |
| Parallel RLC | $R/(\\omega _{0}L)$ | 316 | 100 rad/s |

In series, small R means little damping; in parallel, LARGE R means little
damping, because the resistor now sits across the tank and drains it. Same
components, a hundredfold difference in selectivity — topology, not parts,
decides the Q.

## 4.5 Choosing the tool

| Signal or question | Reach for |
|---|---|
| Periodic steady state, harmonic content | Fourier series |
| Aperiodic signal, spectrum or bandwidth | Fourier transform |
| Switching transient, initial conditions, stability | Laplace transform |
| Single-frequency AC steady state | phasors (Laplace at $s = j\\omega$, one frequency) |

The table is a hierarchy, not a menu: phasors are the Laplace transform
frozen at one frequency, and the Fourier transform is the Laplace transform
evaluated along the entire imaginary axis. One machine, three windows into
it — and the exam rewards knowing which window is fastest for the question
actually asked.`,
        examTip: 'For any switched RC or RL problem you can now pick the faster of two roads: the universal time-constant formula, or impedances in s with a table inversion. Use the s-domain when the source is anything other than a step - a ramp or a sinusoid applied at t = 0 defeats the shortcut formula but costs the transform method nothing extra.',
        importantNote: 'Series and parallel resonance share the same omega_0 = 1/sqrt(LC) but OPPOSITE Q formulas: Q = w0*L/R in series, Q = R/(w0*L) in parallel. Check which topology the problem draws before computing Q — swapping them inverts the bandwidth by the square of Q, the largest single error available in a resonance problem.',
      },
      {
        id: 'fd-jw-substitution',
        title: '5. Frequency Response: H(s) Evaluated on the Imaginary Axis',
        content: `## 5.1 Why the substitution is legitimate, and when it is not

"Put $s = j\\omega$ into H(s)" is repeated so often that its justification
has quietly evaporated. Recover it from the convolution integral, because
the recovery also tells you the one circumstance in which the recipe lies.

Drive a linear time-invariant system whose impulse response is h(t) with a
complex exponential that was switched on in the infinite past:

$$y(t) = \\int _{-\\infty }^{\\infty }h(\\tau )\\,e^{j\\omega (t-\\tau )}\\,d\\tau = e^{j\\omega t}\\int _{-\\infty }^{\\infty }h(\\tau )\\,e^{-j\\omega \\tau }\\,d\\tau$$

The remaining integral carries no t at all. Give it a name:

$$H(j\\omega ) = \\int _{-\\infty }^{\\infty }h(\\tau )\\,e^{-j\\omega \\tau }\\,d\\tau \\qquad \\text{so that} \\qquad y(t) = H(j\\omega )\\,e^{j\\omega t}$$

An exponential goes in and the SAME exponential comes out, multiplied by one
complex number. Nothing about the shape survives the trip except a scale and
a rotation. That is the eigenfunction property of linear time-invariant
systems, and it is the whole reason frequency-domain thinking works: pick a
basis of complex exponentials and every box in the block diagram degenerates
into a multiplication.

The catch hides in the word "integral". It has to converge, which requires

$$\\int _{-\\infty }^{\\infty }\\lvert h(\\tau )\\rvert \\,d\\tau < \\infty$$

and that condition is exactly bounded-input bounded-output stability. Put a
pole in the right half-plane and h(t) grows; the integral diverges; the
strip in which the Laplace transform converges no longer contains the
imaginary axis; and $H(j\\omega )$ is not a number at all. You can still
perform the algebra — substitute, simplify, produce a magnitude — and the
result will describe nothing. The output of an unstable system driven by a
sinusoid does not approach a sinusoid; it runs away. So the phrase "for a
stable system" in front of every frequency-response statement is not a
politeness. It is the licence.

Two real sinusoids superpose to give the working form. Because h(t) is real,
$H(-j\\omega )$ is the conjugate of $H(j\\omega )$, and adding the two
exponentials gives

$$A\\cos (\\omega t) \\;\\longrightarrow \\; A\\,\\lvert H(j\\omega )\\rvert \\,\\cos \\bigl(\\omega t + \\angle H(j\\omega )\\bigr)$$

Two numbers do all the work at each frequency: a gain that scales the
amplitude and an angle that slides the waveform along the time axis.

## 5.2 The angle is a time shift wearing degrees

Phase confuses people because it is quoted in degrees while its physical
meaning is seconds. The identity that dissolves the confusion is one line:

$$\\cos (\\omega t + \\phi ) = \\cos \\!\\left(\\omega \\left[t + \\frac{\\phi }{\\omega }\\right]\\right)$$

A phase of $\\phi$ radians is a time shift of $\\phi /\\omega$ seconds. When
$\\phi$ is negative — a lag, which is what a stable low-pass always
produces — the output is the input delayed by $\\lvert \\phi \\rvert /\\omega$
seconds. Two consequences follow that the exam likes to probe. First, the
same phase angle means a longer delay at a lower frequency, so quoting a
lag in degrees without naming the frequency says nothing about timing.
Second, a network whose phase falls in exact proportion to frequency delays
every component by the same number of seconds and therefore does not distort
the shape of a composite waveform at all; departures from that straight line
are what smear a pulse.

### Worked example 5.1 — the response evaluated, not estimated

**Given:** $H(s) = 200/[(s+2)(s+10)]$, driven in steady state by
$4\\cos (5t)$. Find the output.

Substitute $s = j5$ and multiply the denominator out rather than reaching
for an asymptotic sketch:

$$H(j5) = \\frac{200}{(2+j5)(10+j5)} = \\frac{200}{20 + j10 + j50 + j^{2}25} = \\frac{200}{-5 + j60}$$

$$\\lvert -5 + j60\\rvert = \\sqrt{25 + 3600} = \\sqrt{3625} = 60.2080$$

$$\\lvert H(j5)\\rvert = 200/60.2080 = 3.32182$$

The denominator's angle is $\\operatorname{atan2}(60,\\,-5) = 94.76364^\\circ$,
and because the denominator is downstairs the transfer function's angle is
the negative of it, $-94.76364^\\circ$. So

$$y(t) = 4 \\times 3.32182 = 13.2873 \\quad \\text{amplitude, at} \\quad -94.76^\\circ$$

giving $y(t) = 13.2873\\cos (5t - 94.76^\\circ )$.

Convert the lag to time. In radians the angle is 1.653938, so the delay is

$$1.653938/5 = 0.330788 \\ \\mathrm{s}$$

against a period of $6.283185/5 = 1.256637$ s. The output therefore trails
the input by $0.3307875/1.2566371 = 0.2632323$ of a cycle — a quarter period
and a whisker more, which is the physical content of "just past ninety
degrees".

**The trap.** Reading the answer off asymptotes gives a different number. At
5 rad/s the driving frequency is above the 2 rad/s pole and below the 10
rad/s pole, so the asymptotic magnitude is $200/(5 \\times 10) = 4$ and the
asymptotic phase is $-90^\\circ$. Both are wrong: 4 against 3.32182 is a
20 percent error, and the phase is off by nearly five degrees. Asymptotes
are for sketching the shape; a number that will be compared against four
multiple-choice options has to come from the evaluation.

### Worked example 5.2 — the same number from the pole vectors

Nothing in the previous example required complex division. The magnitude is
200 divided by the product of the two distances from the poles to the test
point, and the angle is minus the sum of the two angles those distances
make with the real axis:

$$\\lvert j5 - (-2)\\rvert = \\lvert 2 + j5\\rvert = \\sqrt{29} = 5.38516, \\qquad \\lvert j5 - (-10)\\rvert = \\sqrt{125} = 11.18034$$

$$5.38516 \\times 11.18034 = 60.2079 \\quad \\Longrightarrow \\quad \\lvert H\\rvert = 200/60.2079 = 3.32182$$

$$\\arctan (5/2) = 68.19859^\\circ , \\qquad \\arctan (5/10) = 26.56505^\\circ , \\qquad 68.19859 + 26.56505 = 94.76364$$

Same magnitude, same angle, no complex arithmetic anywhere. The vector
picture is slower to write and far faster to reason with, because it turns
"what happens if I move this pole" into "what happens to this arrow".

![Two arrows drawn from the poles at s equal to minus two and minus ten up to the test point s equal to j5, each labelled with its own length and angle. The magnitude of H is 200 divided by the product of the lengths and the phase is minus the sum of the angles.](/courses/fe-ee/figures/lin3-fd-jw-vectors.svg)

## 5.3 The whole sweep at once

Repeating that evaluation at every frequency traces the two curves below.
Magnitude is plotted in decibels and frequency on a logarithmic axis,
because in those coordinates a pole is a straight-line break rather than a
curve, which is what makes Bode's construction possible at all.

![Magnitude in decibels and phase in degrees for H equal to 200 over the product of s plus two and s plus ten, plotted against log frequency. The DC gain is twenty decibels, each pole bends the magnitude down by a further twenty decibels per decade, and the operating point at five radians per second is marked on both panels.](/courses/fe-ee/figures/lin3-fd-magphase-sweep.svg)

Three features are worth naming because every first-order factor repeats
them. The flat region on the left is the DC gain, $H(0) = 200/20 = 10$, or
20 dB. Each pole bends the magnitude down by an additional 20 dB per decade
once the frequency passes it, so beyond 10 rad/s the slope is 40 dB per
decade. And each pole contributes $-45^\\circ$ AT its own corner, spread over
roughly a decade either side, which is why the total phase passes through
$-90^\\circ$ somewhere between the two corners and settles at $-180^\\circ$
far above both.

| Position relative to a single pole at $\\omega _{c}$ | Magnitude | Phase from that pole |
|---|---|---|
| a decade below | 0.99504, i.e. $-0.04$ dB | $-5.71^\\circ$ |
| at the corner | 0.70711, i.e. $-3.01$ dB | $-45^\\circ$ |
| a decade above | 0.09950, i.e. $-20.04$ dB | $-84.29^\\circ$ |

Those three rows are worth memorising as a set. They say that a pole does
essentially nothing a decade before it arrives, does exactly half its
eventual phase work at the corner, and has done essentially all of it a
decade later.`,
        examTip: 'Any question that gives you a transfer function and a specific driving frequency wants an evaluation, not a sketch. Substitute, expand the denominator into a single complex number, take its magnitude and its angle, and divide. The asymptotic answer is usually one of the offered distractors precisely because it is close but wrong.',
        importantNote: 'The s = jw substitution is only meaningful when the system is stable, because it needs the Laplace transform to converge ON the imaginary axis. For a system with a right-half-plane pole the algebra still produces a number and the number means nothing; a sinusoidal input produces a growing output, not a steady sinusoid.',
      },
      {
        id: 'fd-decibels',
        title: '6. Decibels, and the Factor of Two That Is Not Optional',
        content: `## 6.1 One definition, two formulas

The decibel is defined on POWER. Everything else is a consequence.

$$\\text{dB} = 10\\log _{10}\\frac{P_{2}}{P_{1}}$$

Amplitudes get a 20 because power goes as amplitude squared. Put the two
voltages across equal resistances and the substitution is forced:

$$10\\log _{10}\\frac{V_{2}^{2}/R}{V_{1}^{2}/R} = 10\\log _{10}\\left(\\frac{V_{2}}{V_{1}}\\right)^{2} = 20\\log _{10}\\frac{V_{2}}{V_{1}}$$

The 20 is not a rival convention that someone chose. It is the 10 with a
square pulled out of the logarithm. Once that is clear the classic error
becomes hard to make: you never have to remember which multiplier goes with
which quantity, only whether the ratio in your hand is a power or an
amplitude.

| Ratio | As power | As amplitude |
|---|---|---|
| 2 | 3.01 dB | 6.02 dB |
| $\\sqrt{2} = 1.41421$ | 1.51 dB | 3.01 dB |
| 0.70711 | $-1.51$ dB | $-3.01$ dB |
| 10 | 10 dB | 20 dB |
| 100 | 20 dB | 40 dB |
| 0.5 | $-3.01$ dB | $-6.02$ dB |

![Two straight lines on a logarithmic ratio axis: ten times log of the ratio for powers and twenty times log of the ratio for amplitudes. A ratio of two is marked on both, giving three decibels on the power line and six on the amplitude line.](/courses/fe-ee/figures/lin3-fd-decibel-map.svg)

### Worked example 6.1 — an amplifier, and the number that is not its gain

**Given:** an amplifier delivers 25 mW into its load when supplied with
0.4 mW. Express the gain in decibels.

The two quantities are powers, so the multiplier is 10:

$$25/0.4 = 62.5 \\qquad \\Longrightarrow \\qquad 10\\log _{10}(62.5) = 17.9588 \\ \\mathrm{dB}$$

**The trap.** Applying the amplitude rule to a power ratio gives

$$20\\log _{10}(62.5) = 35.9176 \\ \\mathrm{dB}$$

which is exactly twice the right answer and is offered as a distractor in
every question of this shape. The tell is the unit on the data: milliwatts
are power, so the multiplier is 10. Had the problem quoted volts, the
multiplier would be 20 and the answer would be a different physical claim.

### Worked example 6.2 — the two rules agree when they are both applicable

**Given:** a stage takes 0.1 V rms and delivers 5 V rms, with the same
50 ohm resistance at input and output. Find the gain in decibels twice.

By amplitude: the ratio is $5/0.1 = 50$, so

$$20\\log _{10}(50) = 33.9794 \\ \\mathrm{dB}$$

By power: the input power is $(0.1)^{2}/50$ and the output power is
$(5)^{2}/50$, so the power ratio is $50 \\times 50 = 2500$, and

$$10\\log _{10}(2500) = 33.9794 \\ \\mathrm{dB}$$

Identical, to every printed digit. The agreement is not luck; it is the
squaring identity of section 6.1 running in reverse. What deserves emphasis
is the CONDITION that made it work: both quantities were measured across the
same resistance. When the impedances differ, a voltage ratio and a power
ratio are genuinely different statements and their decibel values genuinely
differ. Engineering practice still writes 20 log for voltage ratios in that
situation, and the number is then a voltage gain in decibels and nothing
more — it is no longer a claim about power.

### Worked example 6.3 — a signal chain added up in decibels

**Given:** a preamplifier of +26 dB feeds a cable of $-8$ dB. Find the
overall amplitude gain.

Decibels of cascaded stages add, because logarithms turn the product into a
sum:

$$26 - 8 = 18 \\ \\mathrm{dB} \\qquad \\Longrightarrow \\qquad 10^{18/20} = 7.9433$$

Check it in linear terms, which is the independent route: the preamplifier
multiplies by $10^{26/20} = 19.95262$ and the cable multiplies by
$10^{-8/20} = 0.3981072$, and

$$19.95262 \\times 0.3981072 = 7.943282$$

The same 7.9433, reached without ever adding a decibel. The convenience of
the logarithmic scale is precisely this: a chain of multiplications becomes
a column of additions, and a 40 dB dynamic range fits on a page.

## 6.2 Where the half-power point comes from

The most common decibel value in this subject is $-3$, and it is not an
arbitrary threshold. Define the band edge as the frequency where the system
delivers HALF the power it delivers at its best:

$$\\lvert H(j\\omega )\\rvert ^{2} = \\tfrac{1}{2}\\lvert H\\rvert _{\\max }^{2} \\qquad \\Longrightarrow \\qquad \\lvert H(j\\omega )\\rvert = \\frac{\\lvert H\\rvert _{\\max }}{\\sqrt{2}} = 0.70711\\,\\lvert H\\rvert _{\\max }$$

and convert that amplitude ratio to decibels:

$$20\\log _{10}(0.70711) = -3.0103 \\ \\mathrm{dB}$$

So "the $-3$ dB frequency", "the half-power frequency" and "the frequency
where the magnitude has fallen to 0.707 of its peak" are three names for one
place. The rounding to exactly 3 dB is a convenience of speech; the exact
figure is 3.0103, and the difference matters only when a specification is
written to two decimals.

There is a companion definition that is not equivalent and is sometimes
confused with it. The NOISE bandwidth of a filter is the width of the
rectangular response that would pass the same noise power, and for a
first-order low-pass it is $\\pi /2$ times the half-power bandwidth, about
57 percent larger. Any question that says "half-power", "3 dB" or "corner"
wants the definition derived above.`,
        examTip: 'Decide what kind of ratio you are holding before you pick a multiplier: watts, milliwatts and any product of voltage and current take 10 log, while volts, amps and any transfer-function magnitude take 20 log. Doubling that multiplier is the single most common decibel error, and its result is always exactly double the correct answer, which makes it easy to spot in an answer list.',
        importantNote: 'A gain of 3 dB doubles POWER and multiplies amplitude by only 1.41421. A gain of 6.02 dB doubles amplitude and quadruples power. Confusing these turns a factor of two into a factor of four in either direction.',
      },
      {
        id: 'fd-vector-geometry',
        title: '7. Filter Behaviour Read Straight off the Pole–Zero Map',
        content: `## 7.1 The geometric statement

Factor any rational transfer function into its roots:

$$H(s) = K\\,\\frac{\\prod _{m=1}^{M}(s - z_{m})}{\\prod _{k=1}^{N}(s - p_{k})}$$

and evaluate on the imaginary axis. Because the magnitude of a product is
the product of the magnitudes and the angle of a product is the sum of the
angles, the answer splits cleanly into a distance statement and an angle
statement:

$$\\lvert H(j\\omega )\\rvert = \\lvert K\\rvert \\,\\frac{\\prod _{m=1}^{M}\\lvert j\\omega - z_{m}\\rvert }{\\prod _{k=1}^{N}\\lvert j\\omega - p_{k}\\rvert }$$

$$\\angle H(j\\omega ) = \\angle K + \\sum _{m=1}^{M}\\angle (j\\omega - z_{m}) - \\sum _{k=1}^{N}\\angle (j\\omega - p_{k})$$

Every quantity on the right is the length or the direction of an arrow drawn
from a critical point to the test point on the imaginary axis. Sliding the
test point up the axis lengthens some arrows and shortens others, and the
response is just the bookkeeping of that motion. A pole close to the axis
means a short arrow in the denominator, which means a tall response: that is
resonance, geometrically. A zero close to the axis means a short arrow in
the numerator, which means a deep null: that is a notch.

## 7.2 Shape, read from the map alone

Two limits classify a filter before any arithmetic. At zero frequency the
test point sits at the origin, and at infinite frequency the ratio of the
highest powers takes over:

$$\\lvert H(j0)\\rvert = \\lvert H(0)\\rvert , \\qquad \\lvert H(j\\omega )\\rvert \\;\\to\\; \\lvert K\\rvert \\,\\omega ^{\\,M-N} \\quad \\text{as} \\quad \\omega \\to \\infty$$

so the ultimate roll-off is $20(N-M)$ dB per decade, one 20 for each pole
that has no zero to answer it.

| Zero pattern | Behaviour | Typical form |
|---|---|---|
| no finite zeros | low-pass | $\\omega _{c}/(s+\\omega _{c})$ |
| all zeros at the origin, as many as there are poles | high-pass | $s/(s+\\omega _{c})$ |
| one zero at the origin, a pole pair off-axis | band-pass | $(\\omega _{0}/Q)s/(s^{2}+(\\omega _{0}/Q)s+\\omega _{0}^{2})$ |
| a zero pair ON the imaginary axis | band-stop, with an exact null | $(s^{2}+\\omega _{n}^{2})/(s^{2}+(\\omega _{n}/Q)s+\\omega _{n}^{2})$ |
| each zero the mirror image of a pole | all-pass, magnitude flat | $(\\omega _{c}-s)/(\\omega _{c}+s)$ |

### Worked example 7.1 — classify, then check one point

**Given:** $H(s) = 5s^{2}/(s^{2}+40s+10000)$. Name the filter type, its
natural frequency and its Q, then verify the magnitude at the natural
frequency.

Both zeros sit at the origin and there are two poles, so the numerator wins
at high frequency and loses at low: this is a second-order high-pass with
zero DC gain and a high-frequency gain of 5. Matching the denominator to
$s^{2}+2\\zeta \\omega _{0}s+\\omega _{0}^{2}$ gives $\\omega _{0} = 100$ rad/s
and $2\\zeta \\omega _{0} = 40$, hence $\\zeta = 0.2$ and $Q = 1/(2\\zeta ) = 2.5$.

Check at $\\omega = 100$ by evaluating rather than by asserting:

$$H(j100) = \\frac{5(j100)^{2}}{(j100)^{2}+40(j100)+10000} = \\frac{-50000}{-10000 + j4000 + 10000} = \\frac{-50000}{j4000}$$

$$\\lvert H(j100)\\rvert = 50000/4000 = 12.5 = 5 \\times 2.5$$

The magnitude at $\\omega _{0}$ is the high-frequency gain multiplied by Q,
which is the second-order counterpart of the first-order rule that the
corner sits at 0.707. Dividing by $j$ rotates by $-90^\\circ$ and the leading
minus adds $180^\\circ$, so the phase there is $+90^\\circ$: the high-pass
LEADS at its own resonance.

**The trap.** Reading $\\zeta$ off the coefficient 40 directly gives
$\\zeta = 40$ and $Q = 0.0125$, and the magnitude at 100 rad/s comes out as
0.0625 instead of 12.5. The middle coefficient is $2\\zeta \\omega _{0}$, not
$\\zeta$, and forgetting the $\\omega _{0}$ scales the answer by 200 here.

### Worked example 7.2 — why the first-order corner is exactly 45 degrees

**Given:** $H(s) = \\omega _{c}/(s+\\omega _{c})$. Show from the vector picture
that at $\\omega = \\omega _{c}$ the magnitude is 0.70711 and the phase is
exactly $-45^\\circ$, for any $\\omega _{c}$ whatsoever.

There is one arrow, from the pole at $-\\omega _{c}$ to the test point
$j\\omega _{c}$. Its horizontal extent is $\\omega _{c}$ and its vertical
extent is $\\omega _{c}$, so it is the diagonal of a square:

$$\\lvert j\\omega _{c}+\\omega _{c}\\rvert = \\omega _{c}\\sqrt{2}, \\qquad \\angle (j\\omega _{c}+\\omega _{c}) = 45^\\circ$$

$$\\lvert H\\rvert = \\frac{\\omega _{c}}{\\omega _{c}\\sqrt{2}} = \\frac{1}{\\sqrt{2}} = 0.70711, \\qquad \\angle H = -45^\\circ$$

The $\\omega _{c}$ cancels, which is why the landmark is universal and why
every first-order low-pass looks the same once the frequency axis is
normalised. The corner is where the pole's real and imaginary contributions
are equal, and equality of the legs of a right triangle is what
$45^\\circ$ means.

### Worked example 7.3 — an all-pass, where only the angle moves

**Given:** $H(s) = (100-s)/(100+s)$. Find the magnitude and phase at
10 rad/s and at 100 rad/s.

The zero at $s = +100$ is the mirror image of the pole at $s = -100$, so the
two arrows to any point on the imaginary axis have identical lengths:

$$\\lvert 100 - j\\omega \\rvert = \\lvert 100 + j\\omega \\rvert = \\sqrt{10000+\\omega ^{2}} \\qquad \\Longrightarrow \\qquad \\lvert H(j\\omega )\\rvert = 1$$

for every $\\omega$, exactly. The angles do not cancel, though; they add:

$$\\angle H(j\\omega ) = -\\arctan (\\omega /100) - \\arctan (\\omega /100) = -2\\arctan (\\omega /100)$$

At 10 rad/s, $\\arctan (0.1) = 5.710593^\\circ$, so
$2 \\times 5.710593 = 11.421186$ and the phase is $-11.421186^\\circ$. At
100 rad/s it is $-90^\\circ$ exactly, and $H(j100) = -j$.

A network that changes no amplitude at any frequency and yet is not the
identity is a useful thing to have met before an exam asks what it is for:
delay equalisation. It buys phase without touching the magnitude
specification that was so expensive to meet.

**The trap.** A right-half-plane zero looks like an instability to a
half-remembered rule, so all-pass sections are frequently marked unstable.
Stability is about POLES. This one has its single pole at $-100$, firmly in
the left half-plane, and the response to any bounded input stays bounded.`,
        examTip: 'Before computing anything, count the zeros at the origin and the excess of poles over zeros. Zeros at the origin force the response to zero at DC and tell you the filter is high-pass or band-pass; the pole excess sets the ultimate slope at 20 dB per decade each. That classification alone eliminates most of an answer list.',
        importantNote: 'A pole near the imaginary axis produces a PEAK because its arrow is short in the denominator; a zero near the axis produces a NULL because its arrow is short in the numerator. The distance from the axis, not the distance from the origin, controls how sharp either feature is.',
      },
      {
        id: 'fd-bandwidth-q',
        title: '8. Bandwidth, Half-Power Edges and Quality Factor',
        content: `## 8.1 The first-order corner, derived

For $H(s) = 1/(1+s\\tau )$ the magnitude squared is a single fraction, and
the half-power condition solves in one line:

$$\\lvert H(j\\omega )\\rvert ^{2} = \\frac{1}{1+(\\omega \\tau )^{2}} = \\frac{1}{2} \\qquad \\Longrightarrow \\qquad (\\omega \\tau )^{2} = 1 \\qquad \\Longrightarrow \\qquad \\omega _{c} = \\frac{1}{\\tau }$$

The reciprocal relationship between corner frequency and time constant is
therefore not a coincidence or a definition; it falls out of asking where
the power halves. The same algebra explains why the phase there is
$-45^\\circ$: the real and imaginary parts of the denominator are equal
precisely when $\\omega \\tau = 1$.

## 8.2 The second-order band, derived

Write a band-pass in standard form, where K is the gain at the centre:

$$H(s) = \\frac{K(\\omega _{0}/Q)s}{s^{2} + (\\omega _{0}/Q)s + \\omega _{0}^{2}}$$

On the imaginary axis the $s^{2}$ term turns real and negative, so

$$\\lvert H(j\\omega )\\rvert = \\frac{K(\\omega _{0}/Q)\\omega }{\\sqrt{(\\omega _{0}^{2}-\\omega ^{2})^{2} + (\\omega _{0}\\omega /Q)^{2}}}$$

At $\\omega = \\omega _{0}$ the first bracket vanishes and the magnitude is
exactly K, which is the peak. Setting the magnitude to $K/\\sqrt{2}$ requires
the two terms under the root to be equal:

$$(\\omega _{0}^{2}-\\omega ^{2})^{2} = \\left(\\frac{\\omega _{0}\\omega }{Q}\\right)^{2} \\qquad \\Longrightarrow \\qquad \\omega ^{2} \\pm \\frac{\\omega _{0}}{Q}\\omega - \\omega _{0}^{2} = 0$$

Keeping the positive root of each sign gives the two band edges:

$$\\omega _{1,2} = \\omega _{0}\\left(\\sqrt{1 + \\frac{1}{4Q^{2}}} \\mp \\frac{1}{2Q}\\right)$$

and two identities drop straight out of that pair, one by subtraction and
one by multiplication:

$$\\omega _{2} - \\omega _{1} = \\frac{\\omega _{0}}{Q} = BW, \\qquad \\omega _{1}\\omega _{2} = \\omega _{0}^{2}$$

The second identity is the important one and the one most often misused. The
centre frequency is the GEOMETRIC mean of the two edges, so on a logarithmic
axis the band is symmetric and on a linear axis it is not. For a high-Q
circuit the two means are close enough that nobody notices; for a low-Q
circuit they are wildly different, and the arithmetic midpoint is a wrong
answer waiting to be selected.

### Worked example 8.1 — a band two decades wide

**Given:** $H(s) = 1000s/[(s+10)(s+1000)]$. Find the centre frequency, the
gain there, Q, both half-power edges, and check them.

Expand the denominator to $s^{2}+1010s+10000$. Matching the standard form,
$\\omega _{0}^{2} = 10000$ so $\\omega _{0} = 100$ rad/s, and
$\\omega _{0}/Q = 1010$, so

$$Q = 100/1010 = 0.09901, \\qquad K = 1000/1010 = 0.9901$$

Now the edges. With $1/(2Q) = 5.05$,

$$\\sqrt{1 + 5.05^{2}} = \\sqrt{26.5025} = 5.148058$$

$$\\omega _{1} = 100 \\times (5.148058 - 5.05) = 9.8058 \\ \\mathrm{rad/s}, \\qquad \\omega _{2} = 100 \\times (5.148058 + 5.05) = 1019.8058 \\ \\mathrm{rad/s}$$

Three checks, each by a route that does not reuse the formula. Subtracting,
$1019.8058 - 9.8058 = 1010$, which is $\\omega _{0}/Q$ as promised.
Multiplying, $9.8058 \\times 1019.8058 = 10000.0$, whose square root is the
centre frequency 100. And evaluating the transfer function itself at the
lower edge gives $\\lvert H(j9.8058)\\rvert = 0.70011$, against
$0.9901/1.41421 = 0.70011$ — the peak divided by root two, to five decimals.

$$\\lvert H(j100)\\rvert = 100000/101000 = 0.9901, \\qquad \\angle H(j100) = 0^\\circ$$

That the phase is exactly zero at the geometric mean is worth pausing on. The
zero at the origin contributes $+90^\\circ$; the two pole arrows contribute
$84.28941^\\circ$ and $5.71059^\\circ$, and
$84.28941 + 5.71059 = 90.00000$ because the arctangent of a number and the
arctangent of its reciprocal always sum to a right angle. The cancellation is
exact, not approximate, and it holds for any band-pass built from two real
poles evaluated at their geometric mean.

**The trap.** Taking the centre as the arithmetic midpoint,
$(9.8058 + 1019.8058)/2 = 514.8058$ rad/s, is off by more than a factor of
five, and the magnitude there is 0.88893 rather than the peak 0.9901. On the
plot the error is obvious; in a list of four numbers it is not.

![Magnitude of the band-pass on a logarithmic frequency axis, with the peak at one hundred radians per second, the two half-power edges at 9.806 and 1019.8, and the arithmetic midpoint marked well to the right of the true centre.](/courses/fe-ee/figures/lin3-fd-bandpass-edges.svg)

## 8.3 Quality factor, and why it has so many faces

Q is defined once and then wears whatever clothing the circuit hands it. The
defining statement is about selectivity:

$$Q = \\frac{\\omega _{0}}{BW}$$

The energy statement is equivalent and more physical:

$$Q = 2\\pi \\,\\frac{\\text{peak energy stored}}{\\text{energy dissipated per cycle}}$$

Derive the circuit formula from that definition for the series RLC, to see
that nothing new is being asserted. At resonance the current is
$i(t) = I_{m}\\cos (\\omega _{0}t)$; the peak magnetic energy is
$\\tfrac{1}{2}LI_{m}^{2}$; the average dissipation is
$\\tfrac{1}{2}I_{m}^{2}R$, so one period costs
$\\tfrac{1}{2}I_{m}^{2}R(2\\pi /\\omega _{0})$. Hence

$$Q = 2\\pi \\,\\frac{\\tfrac{1}{2}LI_{m}^{2}}{\\tfrac{1}{2}I_{m}^{2}R\\,(2\\pi /\\omega _{0})} = \\frac{\\omega _{0}L}{R}$$

| Expression | Series RLC | Parallel RLC |
|---|---|---|
| in terms of reactance | $\\omega _{0}L/R$ | $R/(\\omega _{0}L)$ |
| in terms of the capacitor | $1/(\\omega _{0}RC)$ | $\\omega _{0}RC$ |
| component form | $(1/R)\\sqrt{L/C}$ | $R\\sqrt{C/L}$ |
| bandwidth form | $\\omega _{0}/BW$ | $\\omega _{0}/BW$ |
| damping form | $1/(2\\zeta )$ | $1/(2\\zeta )$ |

The series and parallel columns are reciprocals of each other, and the reason
is physical rather than algebraic. In series the resistor lies in the single
current path, so making it small removes the loss. In parallel the resistor
lies across the tank and drains it, so making it LARGE removes the loss.
Duality, not a change of definition.

Two further identities are worth keeping. The quantity $\\sqrt{L/C}$ is the
characteristic impedance of the resonant pair and equals the common value of
$\\omega _{0}L$ and $1/(\\omega _{0}C)$ at resonance, which is why it appears in
both component forms. And $Q = 1/(2\\zeta )$ ties every result here to the
step-response language of overshoot and settling: a circuit with $Q = 5$ has
$\\zeta = 0.1$ and rings for many cycles, while $Q = 0.5$ is critical damping
and does not ring at all.

### Worked example 8.2 — one circuit, three routes to Q

**Given:** a series circuit with $L = 50$ mH, $C = 0.2$ microfarad and
$R = 100$ ohm. Find $\\omega _{0}$, Q by three different formulas, and BW by
two.

$$LC = (0.05)(2\\times 10^{-7}) = 10^{-8} \\qquad \\Longrightarrow \\qquad \\omega _{0} = 1/\\sqrt{LC} = 10000 \\ \\mathrm{rad/s}$$

so $f_{0} = 10000/6.283185 = 1591.55$ Hz. Now Q, three ways:

$$Q = \\frac{\\omega _{0}L}{R} = \\frac{10000 \\times 0.05}{100} = \\frac{500}{100} = 5$$

$$Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = \\frac{1}{100}\\sqrt{\\frac{0.05}{2\\times 10^{-7}}} = \\frac{\\sqrt{250000}}{100} = 500/100 = 5$$

$$Q = \\frac{1}{\\omega _{0}RC} = \\frac{1}{10000 \\times 100 \\times 2\\times 10^{-7}} = 1/0.2 = 5$$

and BW two ways, $\\omega _{0}/Q = 10000/5 = 2000$ rad/s and
$R/L = 100/0.05 = 2000$ rad/s. Five separate calculations, one circuit, no
disagreement — which is exactly the audit you want before trusting a
resonance answer.

### Worked example 8.3 — where a resonance actually peaks

**Given:** the same circuit's capacitor voltage, a second-order low-pass with
$\\zeta = 1/(2Q) = 0.1$. Find the frequency of maximum response and the value
there, and compare with the value at $\\omega _{0}$.

The maximum of $1/\\lvert 1-x^{2}+2j\\zeta x\\rvert$ with $x = \\omega /\\omega _{0}$
sits where the radicand is smallest:

$$\\omega _{r} = \\omega _{0}\\sqrt{1-2\\zeta ^{2}}, \\qquad \\lvert H(j\\omega _{r})\\rvert = \\frac{1}{2\\zeta \\sqrt{1-\\zeta ^{2}}}$$

$$\\omega _{r} = 10000 \\times 0.989949 = 9899.49 \\ \\mathrm{rad/s}, \\qquad \\lvert H\\rvert _{\\max } = 5.0252$$

whereas AT $\\omega _{0}$ the magnitude is exactly Q, that is 5.0000. So the
true peak is neither at $\\omega _{0}$ nor equal to Q, though for
$\\zeta = 0.1$ both errors are half a percent and nobody would see them on a
plot. They grow quickly: at $\\zeta = 0.5$ the peak has vanished altogether,
because $1-2\\zeta ^{2}$ shrinks to zero at $\\zeta = 0.70711$. That value is
the maximally flat, or Butterworth, condition: at and beyond it the low-pass
magnitude falls monotonically from DC with no peak anywhere, which is why it
is the default choice when overshoot is unwelcome.

![Second-order low-pass magnitude relative to its DC value for three damping ratios, showing the peak of a lightly damped response sitting slightly below the natural frequency while the value at the natural frequency is exactly Q.](/courses/fe-ee/figures/lin3-fd-q-peaks.svg)`,
        examTip: 'Half-power edges bracket the centre frequency GEOMETRICALLY: their product is w0 squared and their difference is the bandwidth. Given two edges, the centre is the square root of their product, never their average. Given the centre and Q, the bandwidth is w0/Q and the edges are the centre times the bracket in section 8.2.',
        importantNote: 'For a lightly damped second-order LOW-PASS the response peaks slightly BELOW w0, at w0 times the square root of 1 minus 2 zeta squared, and the peak value exceeds Q. The magnitude AT w0 is exactly Q. A BAND-PASS, by contrast, peaks exactly at w0. Which one the problem draws decides which statement applies.',
      },
      {
        id: 'fd-resonance-cascade',
        title: '9. Resonance in Both Topologies, and What Cascading Does',
        content: `## 9.1 The same parts, wired two ways

Nothing sharpens the topology lesson like refusing to change the components.
Take $L = 50$ mH and $C = 0.2$ microfarad throughout, so that

$$\\omega _{0} = 1/\\sqrt{LC} = 10000 \\ \\mathrm{rad/s}$$

in both circuits, and move only the resistor.

### Worked example 9.1 — the series case, edges included

**Given:** the L and C above in series with $R = 100$ ohm, driven by a
voltage source. Find Q, the bandwidth, and the two half-power frequencies,
and verify them from the impedance.

From section 8, $Q = 5$ and $BW = 2000$ rad/s. With $1/(2Q) = 0.1$,

$$\\sqrt{1 + 0.1^{2}} = \\sqrt{1.01} = 1.0049876$$

$$\\omega _{1} = 10000 \\times (1.0049876 - 0.1) = 9049.876 \\ \\mathrm{rad/s}$$

$$\\omega _{2} = 10000 \\times (1.0049876 + 0.1) = 11049.876 \\ \\mathrm{rad/s}$$

The independent check does not touch the edge formula at all. In a series
circuit the current is $V/Z$, and half power means the current has fallen by
root two, which means the impedance magnitude has RISEN by root two:

$$\\lvert Z(j\\omega )\\rvert = \\sqrt{R^{2} + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^{2}} = R\\sqrt{2} = 100 \\times 1.4142136 = 141.42136 \\ \\mathrm{ohm}$$

Evaluating the impedance at 9049.876 rad/s gives exactly that, and so does
evaluating it at 11049.876 rad/s. At resonance itself the reactances cancel,

$$\\omega _{0}L = 10000 \\times 0.05 = 500 \\ \\mathrm{ohm}, \\qquad \\frac{1}{\\omega _{0}C} = 1/0.002 = 500 \\ \\mathrm{ohm}$$

leaving $\\lvert Z\\rvert = R = 100$ ohm, a MINIMUM, so the series circuit
draws its largest current at resonance. Note in passing that the common
reactance 500 ohm is $\\sqrt{L/C}$, which is why $Q = \\sqrt{L/C}/R$ works.

Check the geometry as well: $11049.876 - 9049.876 = 2000$ and the product of
the edges is $10^{8}$, whose square root is 10000. The arithmetic mean,
10049.876 rad/s, misses the true centre by 49.876 rad/s — small here because
Q is high, and the reason a high-Q problem forgives the mistake that a low-Q
problem punishes.

### Worked example 9.2 — the parallel case, same L and C

**Given:** the same L and C, now in parallel with $R = 100$ kilohm and driven
by a current source. Find Q and the bandwidth.

$$Q = \\frac{R}{\\omega _{0}L} = \\frac{100000}{500} = 200$$

$$Q = \\omega _{0}RC = 10000 \\times 100000 \\times 2\\times 10^{-7} = 200, \\qquad Q = R\\sqrt{C/L} = 100000 \\times 0.002 = 200$$

$$BW = \\omega _{0}/Q = 10000/200 = 50 \\ \\mathrm{rad/s}$$

Three routes to 200, and a bandwidth forty times narrower than the series
circuit built from the identical inductor and capacitor. At resonance the
tank's admittance is purely $1/R$, so $\\lvert Z\\rvert = R = 100$ kilohm, a
MAXIMUM, and the parallel circuit develops its largest voltage there. The
series circuit minimised its impedance at the same frequency. Same
$\\omega _{0}$, opposite extremum, opposite Q formula.

| Quantity | Series RLC | Parallel RLC |
|---|---|---|
| $\\omega _{0}$ | 10000 rad/s | 10000 rad/s |
| Q | 5 | 200 |
| BW | 2000 rad/s | 50 rad/s |
| $\\lvert Z\\rvert$ at $\\omega _{0}$ | 100 ohm, a minimum | 100 kilohm, a maximum |
| effect of raising R | lowers Q, widens the band | raises Q, narrows the band |
| resonant quantity | current through the loop | voltage across the tank |

![Series branch current and parallel tank voltage, each as a fraction of its own peak, built from identical inductance and capacitance. Both peak at ten thousand radians per second; the series curve is forty times wider.](/courses/fe-ee/figures/lin3-fd-resonance-widths.svg)

**The trap.** Applying $Q = \\omega _{0}L/R$ to the parallel circuit here gives
$500/100000 = 0.005$ and a bandwidth of two million radians per second
instead of fifty. The error is a factor of $Q^{2}$, forty thousand in this
case, which is the largest single mistake available anywhere in resonance
problems. Identify the topology before writing a Q formula down.

## 9.2 Cascading: magnitudes multiply, angles add

Two stages in series, with the second not loading the first, form a product:

$$H(j\\omega ) = H_{1}(j\\omega )H_{2}(j\\omega ) \\qquad \\Longrightarrow \\qquad \\lvert H\\rvert = \\lvert H_{1}\\rvert \\,\\lvert H_{2}\\rvert , \\qquad \\angle H = \\angle H_{1} + \\angle H_{2}$$

and in decibels the product becomes a sum, which is the whole reason Bode
plots of complicated systems can be built by stacking simple pieces:

$$20\\log _{10}\\lvert H\\rvert = 20\\log _{10}\\lvert H_{1}\\rvert + 20\\log _{10}\\lvert H_{2}\\rvert$$

The condition attached to that innocuous "in series" matters in the
laboratory: the product rule assumes the second stage draws no current from
the first. Two passive RC sections wired directly together do NOT multiply,
because the second capacitor loads the first resistor and shifts both
corners. A voltage follower between them restores the assumption, which is
why buffered cascades are the standard textbook object and unbuffered ones
are a separate, messier calculation.

### Worked example 9.3 — bandwidth shrinks when stages are stacked

**Given:** n identical buffered low-pass stages, each with corner
$\\omega _{c}$. Find the corner of the cascade for $n = 2$, using
$\\omega _{c} = 1000$ rad/s.

Each stage contributes $1/\\sqrt{1+x^{2}}$ with $x = \\omega /\\omega _{c}$, so
the cascade's magnitude is that to the n-th power. Setting it to
$1/\\sqrt{2}$:

$$\\left(\\frac{1}{1+x^{2}}\\right)^{n/2} = \\frac{1}{\\sqrt{2}} \\qquad \\Longrightarrow \\qquad (1+x^{2})^{n} = 2 \\qquad \\Longrightarrow \\qquad x = \\sqrt{2^{1/n}-1}$$

For two stages, $\\sqrt{2} = 1.4142136$ and
$1.4142136 - 1 = 0.4142136$, whose square root is 0.6435943, so

$$\\omega _{c,\\text{cascade}} = 1000 \\times 0.6435943 = 643.5943 \\ \\mathrm{rad/s}$$

Verify at the original corner instead of at the new one: each stage is at
0.70711 there, so the pair is at $0.70711 \\times 0.70711 = 0.5$, which is
$-6.0206$ dB, and each stage lags $45^\\circ$ so the pair lags $90^\\circ$.
Both numbers confirm that 1000 rad/s is well outside the cascade's passband.

**The trap.** Assuming the cascade keeps the 1000 rad/s corner overstates the
bandwidth by 55 percent. The shrink factor for three stages is 0.5098245 and
for four it is 0.4349794, so a four-stage chain of nominally identical
filters passes less than half the band any one of them passes.

![One RC stage and two identical buffered stages plotted in decibels against log frequency, with the single-stage corner at one thousand radians per second and the two-stage corner at 643.6.](/courses/fe-ee/figures/lin3-fd-cascade.svg)

### Worked example 9.4 — a chain specified entirely in decibels

**Given:** a preamplifier of $+26$ dB, a cable of $-8$ dB and a filter whose
passband insertion loss is $-0.5$ dB. Find the overall amplitude gain.

$$26 - 8 - 0.5 = 17.5 \\ \\mathrm{dB} \\qquad \\Longrightarrow \\qquad 10^{17.5/20} = 7.4989$$

Every stage that is specified as a gain in decibels simply joins the column.
The arithmetic is trivial; the discipline is remembering that decibels add
only because magnitudes multiply, so a stage quoted as a linear gain must be
converted before it can be added, never added directly.`,
        examTip: 'When a problem hands you a resonant circuit, write down the topology before any formula: is the resistor in the loop or across the tank? Then w0 = 1/sqrt(LC) regardless, Q from the matching column, and BW = w0/Q. Checking Q by a second formula from the same column costs ten seconds and catches the topology error, which is the expensive one.',
        importantNote: 'The cascade product rule assumes no loading. Two RC sections connected directly do not have the product of their individual responses, because the second stage draws current from the first; the exam will occasionally show exactly that circuit and expect the unbuffered answer, so check for a buffer before multiplying.',
      },
      {
        id: 'fd-problem-set-a',
        title: '10. Problem Set A — Evaluation, Decibels and Geometry',
        content: `Work each problem before reading its solution. Every answer names the
distractor it is designed to attract and the wrong number that distractor
produces.

**A1.** For $H(s) = 50/[(s+5)(s+50)]$, find the steady-state output amplitude
and phase when the input is $2\\cos (10t)$.

**A2.** An attenuator drops a signal from 8 V rms to 0.5 V rms across a
constant impedance. Express the loss in decibels, as a voltage ratio and as a
power ratio.

**A3.** A first-order low-pass has $R = 2$ kilohm and $C = 0.05$ microfarad.
Find its corner frequency in hertz and its magnitude and phase at 3 kHz.

**A4.** $H(s) = 4s/(s+20)$. Classify the filter, state the DC and
high-frequency gains, and find the frequency at which the magnitude is
0.70711 of its high-frequency value.

**A5.** Two half-power edges of a band-pass are measured at 400 rad/s and
6400 rad/s. Find the centre frequency, the bandwidth and Q.

**A6.** A stage has magnitude 1 at every frequency and phase $-120^\\circ$ at
600 rad/s. How long does it delay a 600 rad/s sinusoid?

---

### Worked solutions, Problem Set A

**A1.** Substitute $s = j10$:

$$H(j10) = \\frac{50}{(5+j10)(50+j10)} = \\frac{50}{250 + j50 + j500 + j^{2}100} = \\frac{50}{150 + j550}$$

$$\\lvert 150 + j550\\rvert = \\sqrt{22500 + 302500} = \\sqrt{325000} = 570.088$$

$$\\lvert H\\rvert = 50/570.088 = 0.087706$$

The denominator's angle is $\\arctan (550/150) = 74.7449^\\circ$, so the phase
is $-74.7449^\\circ$ and the output amplitude is
$2 \\times 0.087706 = 0.175412$. Answer:
$0.1754\\cos (10t - 74.74^\\circ )$.

*Trap:* using the DC gain $50/250 = 0.2$ and reporting an amplitude of 0.4.
At 10 rad/s the first pole has already acted, and 0.4 is 2.3 times too big.

**A2.** Voltage ratio $0.5/8 = 0.0625$, so

$$20\\log _{10}(0.0625) = -24.0824 \\ \\mathrm{dB}$$

As a power ratio, $0.0625 \\times 0.0625 = 0.00390625$, and

$$10\\log _{10}(0.00390625) = -24.0824 \\ \\mathrm{dB}$$

Identical, because the impedance is the same at both points.

*Trap:* applying 10 log to the voltage ratio gives $-12.0412$ dB, exactly
half the loss. The quantities are volts, so the multiplier is 20.

**A3.** $RC = 2000 \\times 5\\times 10^{-8} = 10^{-4}$ s, so

$$\\omega _{c} = 1/RC = 10000 \\ \\mathrm{rad/s}, \\qquad f_{c} = 10000/6.283185 = 1591.55 \\ \\mathrm{Hz}$$

At 3 kHz the driving frequency is $2\\pi (3000) = 18849.5559$ rad/s, so the
ratio that matters is $18849.5559/10000 = 1.8849556$. Then

$$\\lvert H\\rvert = \\frac{1}{\\sqrt{1 + 1.8849556^{2}}} = \\frac{1}{\\sqrt{4.5530576}} = 1/2.1337895 = 0.4686498$$

and the phase is $-\\arctan (1.8849556) = -62.0533^\\circ$.

*Trap:* mixing units by putting $\\omega = 3000$ against $\\omega _{c} = 10000$
gives a ratio of 0.3 and a magnitude of 0.9578, which is the answer to a
different question. Either convert both to radians per second, as above, or
work in hertz on both sides: $3000/1591.55 = 1.885$ to the precision that
rounded corner frequency supports.

**A4.** One zero at the origin and one pole, so it is a first-order
high-pass. The DC gain is 0 and the high-frequency gain is 4. The magnitude
reaches $0.70711 \\times 4$ where the pole and zero arrows are equal in
length, which is $\\omega = 20$ rad/s:

$$H(j20) = \\frac{4(j20)}{20+j20} = \\frac{j80}{20+j20}, \\qquad \\lvert H(j20)\\rvert = \\frac{80}{20\\sqrt{2}} = 80/28.28427 = 2.82843$$

and $2.82843/4 = 0.70711$ as required.

*Trap:* calling this a low-pass because the pole is at 20 rad/s and quoting a
DC gain of $4 \\times 0/20 = 0$ but then asserting a high-frequency gain of
zero as well. The zero at the origin kills DC, not infinity.

**A5.** The centre is the geometric mean:

$$\\omega _{0} = \\sqrt{400 \\times 6400} = \\sqrt{2560000} = 1600 \\ \\mathrm{rad/s}$$

$$BW = 6400 - 400 = 6000 \\ \\mathrm{rad/s}, \\qquad Q = 1600/6000 = 0.26667$$

*Trap:* the arithmetic mean, $(400+6400)/2 = 3400$ rad/s, gives
$Q = 3400/6000 = 0.56667$ — more than twice the true Q. With edges a factor
of sixteen apart this is a very low-Q circuit and the two means are nowhere
near each other, which is exactly when the mistake is fatal.

**A6.** Magnitude 1 everywhere means an all-pass; only the phase matters.
Convert to radians and divide by the frequency:

$$120^\\circ = 2.094395 \\ \\mathrm{rad}, \\qquad \\Delta t = 2.094395/600 = 0.003491 \\ \\mathrm{s}$$

so about 3.49 ms. As a fraction of the period
$6.283185/600 = 0.010472$ s, the delay is one third of a cycle, which is
what $-120^\\circ$ says directly.

*Trap:* dividing degrees by frequency without converting, giving
$120/600 = 0.2$ s, which is off by a factor of 57.3.`,
        examTip: 'Every one of these six is solved by writing one complex number and taking its magnitude and angle. Build the habit of expanding the denominator into a single "real plus j imaginary" before doing anything else; from there the magnitude is one square root and the phase is one arctangent, and there is nowhere for a sign error to hide.',
      },
      {
        id: 'fd-problem-set-b',
        title: '11. Problem Set B — Resonance, Bandwidth and Cascades',
        content: `**B1.** A series RLC has $L = 20$ mH, $C = 0.5$ microfarad, $R = 40$ ohm.
Find $\\omega _{0}$, Q, BW and both half-power edges.

**B2.** The same L and C are placed in parallel with a 40 kilohm resistor.
Find Q and BW, and say what happens to the impedance at resonance.

**B3.** Three identical buffered low-pass stages each have a corner at
2000 rad/s. Find the corner of the cascade and the cascade's attenuation in
decibels at 2000 rad/s.

**B4.** A notch is built as $H(s) = (s^{2}+\\omega _{n}^{2})/(s^{2}+(\\omega _{n}/Q)s+\\omega _{n}^{2})$
with $\\omega _{n} = 377$ rad/s and $Q = 10$. Give the DC gain, the
high-frequency gain, the depth at $\\omega _{n}$ and the notch width.

**B5.** A second-order low-pass has $\\omega _{0} = 2000$ rad/s and
$\\zeta = 0.05$. Find the peak frequency, the peak magnitude relative to DC,
and the magnitude exactly at $\\omega _{0}$.

**B6.** A receiver chain has a preamplifier of $+32$ dB, a mixer of $-6$ dB
and an IF amplifier of $+40$ dB. Find the total gain in decibels and as a
linear amplitude ratio, and state what would go wrong if the preamplifier
gain had been quoted as a power gain.

---

### Worked solutions, Problem Set B

**B1.** $LC = (0.02)(5\\times 10^{-7}) = 10^{-8}$, so

$$\\omega _{0} = 1/\\sqrt{10^{-8}} = 10000 \\ \\mathrm{rad/s}$$

$$Q = \\frac{\\omega _{0}L}{R} = \\frac{10000 \\times 0.02}{40} = 200/40 = 5, \\qquad BW = \\frac{R}{L} = 40/0.02 = 2000 \\ \\mathrm{rad/s}$$

Cross-check: $\\omega _{0}/Q = 10000/5 = 2000$ rad/s, agreeing. The edges use
$1/(2Q) = 0.1$:

$$\\omega _{1} = 10000 \\times (1.0049876 - 0.1) = 9049.876, \\qquad \\omega _{2} = 10000 \\times (1.0049876 + 0.1) = 11049.876$$

both in rad/s, differing by exactly 2000 and multiplying to $10^{8}$.

*Trap:* computing BW as $R/C$ or $1/(RC)$ instead of $R/L$. With these values
$1/(RC) = 50000$ rad/s, which is twenty-five times too wide and would put
both "edges" outside any sensible band.

**B2.** $\\omega _{0}$ is unchanged at 10000 rad/s, because it depends only on
L and C.

$$Q = \\frac{R}{\\omega _{0}L} = \\frac{40000}{10000 \\times 0.02} = 40000/200 = 200, \\qquad BW = 10000/200 = 50 \\ \\mathrm{rad/s}$$

At resonance the inductive and capacitive susceptances cancel, leaving the
admittance equal to $1/R$, so the impedance is a MAXIMUM of 40 kilohm and
purely resistive.

*Trap:* carrying the series formula over gives $Q = 200/40000 = 0.005$ and a
bandwidth of two million radians per second. The two results differ by
$Q^{2} = 40000$, so this is not a near miss; it is a different universe.

**B3.** With $n = 3$ the shrink factor is

$$x = \\sqrt{2^{1/3}-1} = \\sqrt{1.259921 - 1} = \\sqrt{0.259921} = 0.509825$$

$$\\omega _{c,\\text{cascade}} = 2000 \\times 0.509825 = 1019.65 \\ \\mathrm{rad/s}$$

At 2000 rad/s each stage is at 0.70711, so the chain is at
$(1/\\sqrt{2})^{3} = 0.3535534$, which is

$$20\\log _{10}(0.3535534) = -9.0309 \\ \\mathrm{dB}$$

exactly three times the single-stage $-3.0103$ dB, as decibel addition
demands.

*Trap:* answering "still 2000 rad/s". The cascade's corner is barely half
the single-stage corner, and at the single-stage corner the chain is already
9 dB down rather than 3.

**B4.** At $s = 0$ the numerator and denominator are both
$\\omega _{n}^{2}$, so the DC gain is 1. As $s \\to \\infty$ both are
$s^{2}$, so the high-frequency gain is 1 as well: the notch passes
everything except its own frequency. At $\\omega = \\omega _{n}$ the numerator
is $-\\omega _{n}^{2}+\\omega _{n}^{2} = 0$ exactly, so the rejection is
infinite in this idealisation. The width follows the same rule as the
band-pass:

$$BW = \\omega _{n}/Q = 377/10 = 37.7 \\ \\mathrm{rad/s}$$

which in hertz is $37.7/6.283185 = 6.0$ Hz around a 60 Hz null.

*Trap:* expecting a notch to attenuate at high frequency because it "removes"
something. It is unity-gain on both sides; only a band of width $BW$ is
affected.

**B5.** With $\\zeta = 0.05$, so $Q = 1/(2\\zeta ) = 10$:

$$\\omega _{r} = \\omega _{0}\\sqrt{1-2\\zeta ^{2}} = 2000\\sqrt{1-0.005} = 2000 \\times 0.997497 = 1994.99 \\ \\mathrm{rad/s}$$

$$\\lvert H\\rvert _{\\max } = \\frac{1}{2\\zeta \\sqrt{1-\\zeta ^{2}}} = 10.0125, \\qquad \\lvert H(j\\omega _{0})\\rvert = \\frac{1}{2\\zeta } = 10.0000$$

*Trap:* reporting the peak as exactly Q at exactly $\\omega _{0}$. Both
statements are wrong in detail, though only by 0.125 percent here; the point
is knowing WHICH is exact — the value at $\\omega _{0}$ is exactly Q, the
maximum is slightly larger and slightly lower in frequency.

**B6.** Decibels add:

$$32 - 6 + 40 = 66 \\ \\mathrm{dB} \\qquad \\Longrightarrow \\qquad 10^{66/20} = 1995.26$$

as an amplitude ratio. Now suppose the $+32$ dB had actually been quoted as
a POWER gain. Then the power ratio is $10^{32/10} = 1584.89$, so the
amplitude ratio is its square root, 39.8107, and that is
$10^{16/20}$ — sixteen decibels on the amplitude scale, not thirty-two.
Substituting 16 for 32 in the column gives

$$16 - 6 + 40 = 50 \\ \\mathrm{dB} \\qquad \\Longrightarrow \\qquad 10^{50/20} = 316.23$$

so the chain's amplitude gain drops from 1995.26 to 316.23, a factor of
$1995.26/316.23 = 6.31$. Mixing the two conventions inside one column is the
error the whole of section 6 exists to prevent.

*Trap:* multiplying the decibel figures rather than adding them, giving
$32 \\times 6 \\times 40$ or similar nonsense. Decibels are logarithms; they
add.`,
        examTip: 'Resonance answers should always be audited by a second formula: Q from a different column, or bandwidth from R/L instead of w0/Q. Cascade answers should be audited at the single-stage corner, where every stage contributes exactly -3.0103 dB and -45 degrees, so the chain total is n times each. Both audits take under a minute and catch the topology and stage-count errors that dominate this material.',
      },
    ],
    keyTakeaways: [
      'Fourier Series (discrete spectrum) for periodic signals; Fourier Transform (continuous spectrum) for aperiodic.',
      'Laplace Transform X(s) = integral from 0 to infinity of x(t)e^(−st)dt converts ODEs to algebraic equations in s.',
      'ROC determines uniqueness; causal signals have right half-plane ROC.',
      'Time-domain convolution ↔ frequency-domain multiplication — cornerstone of filtering.',
      'Final Value Theorem: lim(t→∞) f(t) = lim(s→0) s·F(s) — find steady-state directly.',
      'Parseval: ∫|x(t)|²dt = ∫|X(f)|²df — energy is conserved across domains.',
    ],
  },

  fee_transfer_func: {
    topicId: 'fee_transfer_func',
    title: 'Transfer Functions, Poles, and Zeros',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'A transfer function H(s) = Y(s)/X(s) is the Laplace transform of the impulse response. Poles and zeros in the s-plane determine stability, transient behavior, and frequency response — the most powerful analysis tool on the FE exam.',
    sections: [
      {
        id: 'tf-poles-zeros',
        title: '1. Transfer Function Representation',
        content: `## 1.1 Definition and Polynomial Form

The **transfer function** relates output to input in the s-domain:

**$H(s) = Y(s)/X(s) = N(s)/D(s)$**

It can be written in **factored form**:

**$H(s) = K \\cdot \\Pi (s - z_{i}) / \\Pi (s - p_{j})$**

where **$z_{i}$** are the **zeros** (numerator roots) and **$p_{j}$** are the **poles** (denominator roots).

| Feature | Definition | Effect on Response |
|---|---|---|
| **Zeros** | Values where N(s) = 0 | Affect response magnitude and shape |
| **Poles** | Values where D(s) = 0 | Determine stability and time constants |
| **System order** | Degree of D(s) | Number of energy-storage elements |
| **DC gain** | $H(0) = K \\cdot \\Pi z_{i} / \\Pi p_{j}$ | Steady-state value for step input |

## 1.2 Pole Locations and Time-Domain Behavior

Pole position in the s-plane directly maps to time-domain behavior:

| Pole Location | Time Response | Example |
|---|---|---|
| Real, negative (σ < 0) | **Decaying exponential** e^(σt) | RC discharge |
| Real, positive (σ > 0) | **Growing exponential** | Unstable system |
| Complex conjugate, LHP | **Damped sinusoid** e^(σt)·sin(ωt) | Underdamped RLC |
| Purely imaginary (±jω) | **Sustained oscillation** sin(ωt) | Ideal LC circuit |
| Repeated real | **t^k · e^(σt)** polynomial growth | Critically damped |

### Dominant Poles

**Dominant poles** are those closest to the imaginary axis — they have the slowest decay and control the visible response. Poles far into the LHP decay quickly and can often be neglected for approximate analysis.`,
        examTip: 'On the FE exam, when asked to sketch or identify a time-domain response from a pole-zero plot: real negative poles give exponential decay, complex conjugate pairs in the LHP give damped oscillation, and the distance from the imaginary axis determines how fast the decay is.',
      },
      {
        id: 'tf-partial-fractions',
        title: '2. Partial Fraction Decomposition and Inverse Transforms',
        content: `## 2.1 Partial Fraction Expansion

To find the inverse Laplace transform of H(s), decompose into simple fractions:

**$H(s) = A_{1}/(s - p_{1}) + A_{2}/(s - p_{2}) + ... + A_{n}/(s - p_{n})$**

Each term has a known inverse transform: **$A_{i}/(s - p_{i}) \\to A_{i} \\cdot e^{p_{i}t} \\cdot u(t)$**

### Distinct Real Poles

For **$H(s) = (2s + 3)/[(s + 1)(s + 4)]$**, expand as:

**$H(s) = A/(s+1) + B/(s+4)$**

Solve: A = H(s)·(s+1)|_{s=−1}, B = H(s)·(s+4)|_{s=−4}

### Repeated Poles

For a pole of multiplicity k at s = p:

**$... + B_{1}/(s-p) + B_{2}/(s-p)^{2} + ... + B_{k}/(s-p)^k$**

### Complex Conjugate Poles

Keep as a second-order term: **$(As + B)/(s^{2} + 2\\alpha s + \\omega _{0}^{2})$** and use the damped sinusoid transform pair.

## 2.2 Stability from Transfer Function

| Stability | Condition | Pole Requirement |
|---|---|---|
| **Asymptotically stable** | All transients decay to zero | All Re(pᵢ) < 0 |
| **Marginally stable** | Sustained oscillation, no growth | Simple poles on jω axis, rest in LHP |
| **Unstable** | Output grows without bound | Any Re(pᵢ) > 0 or repeated jω poles |

The **Routh-Hurwitz criterion** tests stability without explicitly computing poles — essential when the characteristic polynomial is higher than second order.`,
        examTip: 'For partial fractions on the FE exam, use the "cover-up" method: to find the coefficient for pole at s = p, cover up the (s−p) factor in the denominator and evaluate the remaining expression at s = p. This is dramatically faster than setting up simultaneous equations.',
        importantNote: 'A common FE exam mistake is forgetting that repeated poles on the imaginary axis (e.g., double pole at s = 0) produce growing responses (t·u(t)), making the system unstable — not marginally stable.',
      },
      {
        id: 'tf-worked-pole-zero',
        title: '3. Worked Example: Pole-Zero Analysis',
        content: `## 3.1 Problem Statement

**Given**: H(s) = 10(s + 2) / [(s + 1)(s + 5)]

Find: DC gain, poles, zeros, sketch Bode magnitude, and determine stability.

## 3.2 Step-by-Step Solution

**Step 1 — Identify Poles and Zeros:**
- **Zero**: s + 2 = 0 → **$z_{1} = -2$** (numerator root)
- **Poles**: s + 1 = 0 → **$p_{1} = -1$**; s + 5 = 0 → **$p_{2} = -5$** (denominator roots)
- System is **2nd order** (degree of denominator = 2)

**Step 2 — DC Gain (evaluate at s = 0):**

H(0) = 10(0 + 2) / [(0 + 1)(0 + 5)] = 20/5 = **4** (equivalently **12.04 dB**)

**Step 3 — Stability Analysis:**
- Both poles at s = −1 and s = −5 have **negative real parts** (both in LHP)
- **Conclusion: System is asymptotically stable**

**Step 4 — Bode Magnitude Sketch:**

Rewrite in standard form by factoring out DC values:

$$H(s) = 4 \\cdot (1 + s/2) / [(1 + s/1)(1 + s/5)]$$

Corner frequencies: **$\\omega = 1\\ \\mathrm{rad/s}$** (pole), **$\\omega = 2\\ \\mathrm{rad/s}$** (zero), **$\\omega = 5\\ \\mathrm{rad/s}$** (pole)

| Frequency Range | Slope | Reasoning |
|---|---|---|
| $\\omega < 1$ | 0 dB/dec | Flat at DC gain = 12 dB |
| $1 < \\omega < 2$ | −20 dB/dec | Pole at ω = 1 adds −20 dB/dec |
| $2 < \\omega < 5$ | 0 dB/dec | Zero at ω = 2 cancels: −20 + 20 = 0 |
| $\\omega > 5$ | −20 dB/dec | Pole at ω = 5 adds −20 dB/dec |

**Step 5 — High-Frequency Gain:**

As ω → ∞: |H(jω)| → 10·ω/(ω·ω) = 10/ω → rolls off at −20 dB/decade

## 3.3 Key Observations and Exam Traps

- **Zeros pull the magnitude UP** (or flatten the roll-off); **poles pull it DOWN**. When a zero and pole are close together, they partially cancel.
- **DC gain shortcut**: H(0) = K · (product of zeros) / (product of poles) using absolute values. Here: 10 × 2 / (1 × 5) = 4.
- **Dominant pole**: The pole at s = −1 is closest to the imaginary axis and dominates the transient response (time constant τ = 1 second).
- **Common trap**: Students often forget to convert H(s) to standard form before sketching Bode plots. The corner frequency for (s + a) is ω = a, NOT the coefficient in front of s.`,
        examTip: 'For any transfer function on the FE exam: (1) find poles and zeros by factoring, (2) evaluate H(0) for DC gain, (3) check pole locations for stability, (4) rewrite in standard form for Bode. This four-step method works for every problem and prevents skipped steps under time pressure.',
        importantNote: 'When computing DC gain, substitute s = 0 directly into H(s). Do NOT set s = jω and then ω = 0 — while equivalent, direct substitution is faster and less error-prone. DC gain H(0) = 4 means a unit step input produces a steady-state output of 4.',
      },
      {
        id: 'tf-blocks-sinusoid',
        title: '4. Block Reduction and Sinusoidal Steady State',
        content: `## 4.1 The sketch of section 3, held against the truth

The asymptotic Bode sketch built in section 3 is an approximation with
known, bounded error, and seeing the two together calibrates how much to
trust it:

![Exact magnitude of H(s) = 10(s+2)/((s+1)(s+5)) computed on the jw axis, overlaid on the straight-line asymptotes from the worked example. The sketch and the truth agree away from the corners; at each corner the exact curve rounds off by a couple of decibels.](/courses/fe-ee/figures/lsys-worked-bode.svg)

For an ISOLATED corner the rule is exact: the true curve passes 3 dB below
the sketch at a pole corner and 3 dB above it at a zero corner, with about
1 dB of error one octave away. Here the corners at 1, 2 and 5 rad/s crowd
inside one decade, so their errors overlap and partially cancel — at
$\\omega$ = 1 the exact value is 9.8 dB against the sketch's 12.0, a gap of
only 2.2 dB because the nearby zero is already pulling the curve up. The
sketch is for structure; the 3 dB corrections are for the one point the
question actually asks about.

## 4.2 Block reduction: three rules cover everything

Control problems arrive as diagrams of connected blocks, and three
identities reduce any of them:

| Connection | Combined transfer function |
|---|---|
| Cascade (series) | $H = H_{1} \\cdot H_{2}$ |
| Parallel (summed outputs) | $H = H_{1} + H_{2}$ |
| Negative feedback, G forward, H in the loop | $T = G/(1 + G\\cdot H)$ |

Cascade blocks MULTIPLY — which is precisely why Bode magnitudes, being
logarithms, add. For the feedback rule, the sign in the denominator is
opposite to the sign at the summing junction: negative feedback gives
1 + GH, positive feedback 1 - GH.

**Worked:** G(s) = 100/(s(s + 10)) wrapped in unity negative feedback.

$$T(s) = G/(1 + G) = 100/(s^{2} + 10s + 100)$$

Match to the second-order standard form: $\\omega _n^{2}$ = 100 so
$\\omega _n$ = **10 rad/s**, and 2$\\zeta \\omega _n$ = 10 so $\\zeta$ =
**0.5**. The closed loop overshoots by 16.3% and settles in about
4/(0.5 x 10) = 0.8 s, with poles at -5 ± j8.66. Read what the loop
accomplished: the open-loop system contained an integrator that would ramp
without bound, and feedback turned it into a stable, quick, mildly ringing
system with unity DC gain. That transformation is the point of feedback,
compressed into one algebra step.

Sweep the loop gain and the trade-off appears. With forward path
K/(s(s + 10)), the closed loop is K/(s^2 + 10s + K), so
$\\omega _n = \\sqrt{K}$ and $\\zeta = 5/\\sqrt{K}$. At K = 25 the loop is
critically damped ($\\zeta$ = 1, no overshoot); at K = 100 it is the case
above; at K = 400, $\\zeta$ falls to 0.25 and the overshoot climbs to 44%.
Raising gain buys speed and pays in damping — the single most-quoted
sentence in control design, here derived in two lines rather than asserted.

## 4.3 Steady-state sinusoids: evaluate H at jω

For a stable system driven by a sinusoid, after the transients die the
output is a sinusoid at the SAME frequency, rescaled and shifted:

**input $A\\cos (\\omega t + \\phi )$ → output $A|H(j\\omega )| \\cos (\\omega t + \\phi + \\angle H(j\\omega ))$**

The recipe is mechanical: substitute $s = j\\omega$, reduce the complex
number to magnitude and angle, multiply and add respectively.

**Worked:** H(s) = 10/(s + 5) driven by x(t) = 4 cos(10t).

H(j10) = 10/(5 + j10). The denominator has magnitude sqrt(25 + 100) = 11.18
and angle arctan(10/5) = 63.4 degrees, so H(j10) = 0.894 at -63.4 degrees.

**$y_{ss}(t) = 3.58\\cos (10t - 63.4^\\circ )$**

**Same system at $\\omega$ = 100:** |H| = 10/sqrt(25 + 10,000) = 0.0999 and
the angle is -87.1 degrees, so the output is 0.40 cos(100t - 87.1 degrees).
Ten times the frequency bought ten times the attenuation and a phase pinned
near -90 degrees: far above its pole, a first-order system behaves as an
integrator, dividing by $\\omega$ and lagging a quarter cycle.

## 4.4 What zeros do — and what they cannot

Poles get most of the attention because they own stability, but zeros repay
a minute of care:

- A zero in the LHP reshapes the response — faster rise, more overshoot when
  it sits near the dominant poles — but can never destabilise the system.
- A zero AT the origin blocks DC entirely: H(0) = 0, the signature of any
  high-pass or AC-coupled path.
- A zero in the RHP produces the non-minimum-phase signature: the step
  response starts in the WRONG direction before recovering. The exam flags
  it as initial undershoot.
- Cancelling an unstable pole with an RHP zero looks legal on paper and
  fails in hardware: component tolerances leave the pole slightly uncancelled,
  and the hidden instability grows regardless of what the transfer function
  claims.

## 4.5 Steady state through the Final Value Theorem

For a unit step input, Y(s) = H(s)/s, and the Final Value Theorem collapses
to a statement already familiar:

**$y(\\infty ) = \\lim _{s \\to 0} s \\cdot H(s)/s = H(0)$**

The steady-state step response IS the DC gain — the theorem and the
substitution s = 0 are the same fact wearing two notations. For the section
3 system, H(0) = 10(2)/((1)(5)) = **4**: a unit step settles at 4, provided
the poles are in the LHP so that settling happens at all. That proviso is
the theorem's validity condition making its usual appearance, and checking
it costs one glance at the pole list.

## 4.6 Magnitude from the pole-zero plot, geometrically

One more way to evaluate |H(jω)|, and the one that builds intuition: at any
point $j\\omega$ on the imaginary axis,

**$|H(j\\omega )| = K \\cdot \\Pi (\\mathrm{distances\\ to\\ zeros}) / \\Pi (\\mathrm{distances\\ to\\ poles})$**

— each factor $(j\\omega - z_i)$ or $(j\\omega - p_j)$ is a vector from that
root to the evaluation point, and its magnitude is a plain distance on the
plot.

**Worked, at $\\omega$ = 1 for the section 3 system:** the zero at -2 lies
at distance sqrt(4 + 1) = 2.236 from j1; the poles at -1 and -5 lie at
sqrt(2) = 1.414 and sqrt(26) = 5.099. So

$$|H(j1)| = 10 \\times 2.236/(1.414 \\times 5.099) = 3.10$$

which is 9.8 dB — precisely the exact-curve value the figure in 4.1 shows at
the first corner. The geometry also explains resonance without algebra: as
$j\\omega$ sweeps past a pole sitting close to the axis, one denominator
distance momentarily collapses, and the magnitude spikes. Peaks in frequency
response ARE nearby poles; notches are nearby zeros. Carry that one sentence
into the exam and half the qualitative frequency-response questions answer
themselves from the plot alone.`,
        examTip: 'For any sinusoidal steady-state question, resist solving anything in the time domain: substitute s = jw, convert one complex number to polar form, and write the answer. The entire method is |H| times the amplitude and angle-of-H added to the phase — two operations, no integrals, no transients.',
        importantNote: 'The feedback formula T = G/(1+GH) assumes the loop sign is NEGATIVE at the summing junction. If the diagram shows positive feedback, the denominator becomes 1 - GH, and a loop that was stable can stop being so. Check the sign at the junction before reducing — it is the single most consequential symbol in the diagram.',
      },
      {
        id: 'tf-from-ode',
        title: '5. Building H(s) from the Differential Equation',
        content: `## 5.1 One transform rule carries the whole derivation

A transfer function is not a definition handed down from above. It is what a
differential equation becomes once the Laplace transform has been applied to
every term and the initial energy has been declared zero. The rule that does
the work converts differentiation into multiplication by $s$:

$$\\mathcal{L}\\{y'(t)\\} = sY(s) - y(0^-)$$

$$\\mathcal{L}\\{y''(t)\\} = s^{2}Y(s) - sy(0^-) - y'(0^-)$$

$$\\mathcal{L}\\{y'''(t)\\} = s^{3}Y(s) - s^{2}y(0^-) - sy'(0^-) - y''(0^-)$$

and integration into division by it:

$$\\int_{0}^{t} y(\\lambda )\\,d\\lambda \\;\\longleftrightarrow\\; \\frac{Y(s)}{s}$$

The transform is evaluated at $0^-$, an instant BEFORE the input is applied, so
that a jump or an impulse landing exactly at the origin is counted inside the
transform rather than inside the initial condition. That choice is what makes
the impulse response come out right.

Apply the rules to a general n-th order model with input x and output y,

$$a_{n}y^{(n)} + \\dots + a_{1}y' + a_{0}y = b_{m}x^{(m)} + \\dots + b_{1}x' + b_{0}x$$

and set every initial condition to zero. Each derivative becomes its own power
of $s$, both sides collect into polynomials, and the ratio falls out:

$$H(s) = \\frac{Y(s)}{X(s)} = \\frac{b_{m}s^{m} + \\dots + b_{1}s + b_{0}}{a_{n}s^{n} + \\dots + a_{1}s + a_{0}}$$

Read that identity carefully, because two exam traps live in it. First, the
coefficients of the transfer function ARE the coefficients of the differential
equation, in the same order — no rearrangement, no sign changes. Second, the
zero-initial-condition assumption is not an approximation. It is the price of
admission: a transfer function describes the system's response to an INPUT, and
stored energy is not an input. Initial conditions come back later as extra
terms added to the transform of the output, never as changes to H(s).

| Time-domain operation | s-domain equivalent | What it costs |
|---|---|---|
| $y'(t)$ | $sY(s) - y(0^-)$ | one initial condition |
| $y''(t)$ | $s^{2}Y(s) - sy(0^-) - y'(0^-)$ | two initial conditions |
| $\\int_{0}^{t}y\\,d\\lambda$ | $Y(s)/s$ | nothing |
| $y(t - T)u(t - T)$ | $e^{-sT}Y(s)$ | H(s) stops being rational |
| $e^{-at}y(t)$ | $Y(s + a)$ | shifts every pole left by a |

## 5.2 Worked Example: a series RLC loop, from KVL to H(s)

**Given** a series loop driven by $v_{in}$, with R = 40 ohm, L = 50 mH and
C = 20 microfarad, output taken across the capacitor. Find H(s), the natural
frequency, the damping ratio, and the shape of the step response.

**Step 1 — write KVL in the time domain.** The same current flows through all
three elements, and the capacitor voltage is the output:

$$L\\frac{di}{dt} + Ri + v_{C} = v_{in}, \\qquad i = C\\frac{dv_{C}}{dt}$$

Substituting the second into the first gives a single second-order equation in
the output alone:

$$LC\\,v_{C}'' + RC\\,v_{C}' + v_{C} = v_{in}$$

**Step 2 — transform with zero stored energy.** No initial capacitor voltage,
no initial inductor current, so every $y(0^-)$ term vanishes:

$$(LCs^{2} + RCs + 1)V_{C}(s) = V_{in}(s)$$

$$H(s) = \\frac{1}{LCs^{2} + RCs + 1} = \\frac{1/(LC)}{s^{2} + (R/L)s + 1/(LC)}$$

**Step 3 — put in the numbers.** With $LC = 0.05 \\times 20\\times 10^{-6} = 10^{-6}$ and $R/L = 800$:

$$H(s) = \\frac{10^{6}}{s^{2} + 800s + 10^{6}}$$

**Step 4 — read the standard form off the coefficients.** Matching against
$s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2}$:

$$\\omega _n = \\frac{1}{\\sqrt{LC}} = 1000\\ \\mathrm{rad/s}, \\qquad \\zeta = \\frac{R}{2}\\sqrt{\\frac{C}{L}} = 20\\times 0.02 = 0.4$$

The second expression is worth keeping: it says damping is a property of the
resistance measured against the loop's characteristic impedance $\\sqrt{L/C}$,
which here is 50 ohm. A 40 ohm resistor against a 50 ohm characteristic
impedance is a lightly damped loop, and it will ring.

**Step 5 — the transient numbers follow.** The damped frequency is
$\\omega _d = 1000\\sqrt{0.84} = 916.5$ rad/s, so

$$M_p = e^{-\\pi \\zeta /\\sqrt{1-\\zeta ^{2}}} = 25.38\\%, \\qquad t_p = \\frac{\\pi }{\\omega _d} = 3.428\\ \\mathrm{ms}$$

![Step response of the series RLC loop H(s) = 1e6/(s^2 + 800s + 1e6), computed by marching the state equations rather than by evaluating the closed form. The capacitor overshoots to 1.2538 times the input at 3.428 ms and is inside a 2 percent band for good by 10.00 ms.](/courses/fe-ee/figures/lin2-tf-rlc-step.svg)

The plotted curve was produced by integrating the state equations numerically,
NOT by evaluating the closed form — and the two agree to nine decimal places,
which is the check worth running whenever a transform result matters.

## 5.3 Worked Example: a mechanical model with the same structure

**Given** the equation of motion $3y'' + 12y' + 75y = 150x$, where x is an
applied force and y a displacement. Find H(s), the DC gain, and the damping.

Transform with zero initial displacement and zero initial velocity:

$$(3s^{2} + 12s + 75)Y(s) = 150X(s) \\;\\Longrightarrow\\; H(s) = \\frac{150}{3s^{2} + 12s + 75}$$

Divide through by the leading coefficient so the standard form is visible:

$$H(s) = \\frac{50}{s^{2} + 4s + 25}$$

$$\\omega _n = \\sqrt{25} = 5\\ \\mathrm{rad/s}, \\qquad 2\\zeta \\omega _n = 4 \\;\\Longrightarrow\\; \\zeta = \\frac{4}{10} = 0.4$$

$$H(0) = \\frac{50}{25} = 2$$

so a unit step of force settles at a displacement of 2, arriving there with the
same 25.38% overshoot as the RLC loop because the damping ratio is the same
number. That is the entire payoff of the standard form: two systems built from
different physics, sharing one $\\zeta$, produce the same SHAPE, and only the
time axis and the vertical scale differ.

## 5.4 Worked Example: an op-amp stage, in one line

**Given** an inverting amplifier with $R_1 = 10$ kilohm at the input and a
100 kilohm resistor in parallel with a 1 nanofarad capacitor in the feedback
path. Find H(s).

At the virtual ground the input current is $V_{in}/R_1$, and it must all flow
into the feedback impedance, so

$$H(s) = -\\frac{Z_f(s)}{R_1}, \\qquad Z_f(s) = \\frac{R_2}{1 + R_2Cs}$$

$$H(s) = -\\frac{R_2/R_1}{1 + R_2Cs} = \\frac{-10}{1 + 10^{-4}s}$$

The DC gain is $-100/10 = -10$, and the single pole sits at
$s = -1/(R_2C)$, which is $-10^{4}$ rad/s, or 1591.5 Hz. Note what the
capacitor did NOT do: it did not change the DC gain, which is still set by the
resistor ratio alone. It only decided where the gain starts falling.

## 5.5 Worked Example: where nonzero initial conditions actually go

**Given** $y' + 5y = 2x$ with $y(0^-) = 3$, driven by a unit step. Find y(t).

Transform WITHOUT discarding the initial condition:

$$sY(s) - 3 + 5Y(s) = \\frac{2}{s}$$

$$Y(s) = \\frac{3}{s + 5} + \\frac{2}{s(s + 5)} = \\frac{0.4}{s} + \\frac{2.6}{s + 5}$$

$$y(t) = 0.4 + 2.6e^{-5t}$$

Three facts fall out and all three are worth carrying. The value at t = 0 is
$0.4 + 2.6 = 3$, the initial condition, recovered. The value as
$t \\to \\infty$ is 0.4, which is exactly $H(0) = 2/5$ — the stored energy
changed where the response STARTED and not where it ended. And the exponent is
$-5$ whichever way the problem is posed, because the pole belongs to the
system, not to the excitation. Marching the original differential equation
numerically from y = 3 reproduces this expression to nine decimal places.

## 5.6 The check that catches transcription errors

Before using any H(s) you derived, run three cheap tests.

- **Order**: the denominator degree must equal the number of independent
  energy-storage elements. Two capacitors that are in parallel count once.
- **DC gain**: set s = 0 and compare against what the circuit does at DC, where
  capacitors are open and inductors are short. For the RLC loop, DC current is
  zero, so the capacitor sees the whole source, and indeed $H(0) = 1$.
- **High-frequency behaviour**: as $s \\to \\infty$ the transfer function must
  fall off as $s^{m-n}$. For the RLC loop that is $s^{-2}$, or 40 dB per
  decade, which agrees with a capacitor whose impedance is collapsing while the
  inductor's grows.

A derivation that passes all three is almost never wrong; one that fails any of
them is always wrong.`,
        examTip: 'Write the differential equation with the OUTPUT terms on the left and the INPUT terms on the right before you transform anything. Every sign error I have seen on this topic comes from transforming a rearranged equation. Once the layout is fixed, the transfer function is a ratio of the two coefficient lists, and the exam question is already half answered.',
        importantNote: 'A transfer function assumes zero initial conditions by construction. If a problem gives you a nonzero y(0), you cannot fold it into H(s) — transform the differential equation with the initial-condition terms kept, then solve for Y(s). The pole locations are unchanged; only the residues move.',
      },
      {
        id: 'tf-pole-zero-roles',
        title: '6. What Poles Do, What Zeros Do',
        content: `## 6.1 The pole sets the exponent, the zero sets the coefficient

Expand any strictly proper transfer function with distinct poles over its
poles, and the time response is a sum of exponentials:

$$H(s) = \\sum_{k} \\frac{A_{k}}{s - p_{k}} \\;\\Longrightarrow\\; h(t) = \\sum_{k} A_{k}e^{p_{k}t}u(t)$$

The pole $p_k$ decides the SHAPE of its own term — how fast it decays, whether
it oscillates, whether it grows. The residue $A_k$ decides only how much of
that term appears. Zeros never appear in the exponents at all. They appear in
the residues, where they decide how heavily each pole is weighted, and they can
weight a pole all the way down to nothing.

$$A_{k} = \\lim_{s \\to p_{k}} (s - p_{k})H(s) = \\frac{K\\prod_{i}(p_{k} - z_{i})}{\\prod_{j \\ne k}(p_{k} - p_{j})}$$

That formula is the cover-up method written out, and it also explains pole-zero
cancellation in one glance: if a zero sits ON a pole, the numerator product
contains a factor of zero and the residue vanishes.

## 6.2 Worked Example: residues, and which pole you can afford to drop

**Given** $H(s) = 20/[(s+2)(s+10)]$, driven by a unit step. Find the response,
identify the dominant pole, and measure the error of dropping the other one.

The transform of the output has three poles, one contributed by the step:

$$Y(s) = \\frac{20}{s(s+2)(s+10)} = \\frac{A_{0}}{s} + \\frac{A_{1}}{s+2} + \\frac{A_{2}}{s+10}$$

Covering up each factor in turn,

$$A_{0} = \\frac{20}{(2)(10)} = 1, \\qquad A_{1} = \\frac{20}{(-2)(8)} = -1.25, \\qquad A_{2} = \\frac{20}{(-10)(-8)} = 0.25$$

$$y(t) = 1 - 1.25e^{-2t} + 0.25e^{-10t}$$

Check it at the origin: $1 - 1.25 + 0.25 = 0$, as a second-order system with
no zero must start. The pole at $-2$ owns a residue five times larger than the
one at $-10$ AND decays five times more slowly, so it is dominant twice over.

**The reduced model.** Drop the fast pole but keep the DC gain, and the
first-order stand-in is $2/(s+2)$, whose step response is $1 - e^{-2t}$. The
difference between the two is

$$\\Delta (t) = 0.25\\left(e^{-10t} - e^{-2t}\\right)$$

Set its derivative to zero: $10e^{-10t} = 2e^{-2t}$, so $e^{8t} = 5$ and the
worst moment is $t = (\\ln 5)/8 = 0.2012$ s. Substituting back,

$$\\lvert \\Delta \\rvert _{\\max} = 5^{-1.25} = 0.1337$$

![Exact step response of 20/((s+2)(s+10)) against the reduced first-order model 2/(s+2). The two agree at the start and the finish, and the gap peaks at 0.1337 of final value at t = 0.201 s, showing that a 5 to 1 pole separation is the marginal case rather than a comfortable one.](/courses/fe-ee/figures/lin2-tf-dominant-pole.svg)

Thirteen percent of full scale is a large error to hide behind the word
"dominant". The usual rule of thumb asks for a separation of five to ten before
truncating; this example shows why the bottom of that range is a warning and
not a licence. At a separation of ten the same calculation gives an error under
seven percent, and the approximation starts to earn its keep.

## 6.3 Worked Example: a right-half-plane zero and the wrong-way step

**Given** three systems that share the poles $-1$ and $-2$ and the DC gain 1:

$$H_{a}(s) = \\frac{2}{(s+1)(s+2)}, \\quad H_{b}(s) = \\frac{s+2}{(s+1)(s+2)}, \\quad H_{c}(s) = \\frac{2-s}{(s+1)(s+2)}$$

Find each step response and explain the difference.

For $H_c$, the residues of $Y(s) = (2-s)/[s(s+1)(s+2)]$ are

$$A_{0} = \\frac{2}{(1)(2)} = 1, \\qquad A_{1} = \\frac{3}{(-1)(1)} = -3, \\qquad A_{2} = \\frac{4}{(-2)(-1)} = 2$$

$$y_{c}(t) = 1 - 3e^{-t} + 2e^{-2t}$$

The same procedure gives $y_a(t) = 1 - 2e^{-t} + e^{-2t}$ and, because the
zero at $-2$ cancels the pole at $-2$ outright, $y_b(t) = 1 - e^{-t}$.

Now differentiate $y_c$ at the origin:

$$y_{c}'(0) = 3 - 4 = -1 < 0$$

The output moves DOWN first. Its minimum is where $3e^{-t} = 4e^{-2t}$, that
is $e^{t} = 4/3$, giving

$$t_{\\min} = \\ln \\frac{4}{3} = 0.2877\\ \\mathrm{s}, \\qquad y_{c}(t_{\\min}) = 1 - 3\\left(\\frac{3}{4}\\right) + 2\\left(\\frac{9}{16}\\right) = -0.125$$

![Step responses of three systems that share poles at -1 and -2 and a DC gain of 1, differing only in their zero. With no zero the response leaves the origin with zero slope; with a zero at -2 the pole cancels and the rise is a clean exponential; with a zero at +2 the output first dips to -0.125 at 0.288 s before recovering.](/courses/fe-ee/figures/lin2-tf-zero-side.svg)

An undershoot of 12.5% of final value, from a system whose poles are perfectly
respectable. This is the **non-minimum-phase** signature, and on the exam the
phrase "initial undershoot" or "the output moves the wrong way first" always
points at a zero in the right half-plane. It never points at a pole: poles in
the right half-plane make responses GROW, not reverse.

The physical reading is that two paths race to the output and the fast one has
the wrong sign. A hydro turbine that must first lower its head to raise its
flow, and a boost converter whose inductor must be charged before it can
deliver, both behave exactly like $H_c$.

## 6.4 Worked Example: the zero at the origin

**Given** an RC high-pass section with R = 10 kilohm and C = 1 microfarad,
output across the resistor. Find H(s) and its DC gain.

Voltage division between the capacitor and the resistor gives

$$H(s) = \\frac{R}{R + 1/(Cs)} = \\frac{RCs}{RCs + 1} = \\frac{0.01s}{0.01s + 1}$$

$$H(0) = 0, \\qquad \\omega _c = \\frac{1}{RC} = 100\\ \\mathrm{rad/s} = 15.92\\ \\mathrm{Hz}$$

A zero at s = 0 is a hard block on DC, and it is the fingerprint of every
AC-coupled path, every differentiator and every high-pass filter in the exam's
vocabulary. Notice that the DC gain is genuinely zero, not merely small — no
amount of gain elsewhere in the chain recovers it.

## 6.5 The rules worth memorising about zeros

| Zero location | Effect on the step response | Effect on stability |
|---|---|---|
| Far into the LHP | almost none; the poles run the show | none |
| Near a dominant pole, LHP | faster rise, more overshoot | none |
| Exactly on a pole | that pole's residue goes to zero | none, but see below |
| At the origin | DC gain is zero; response returns to zero | none |
| In the RHP | initial undershoot, then recovery | none |

Every row of the right-hand column says the same thing, and it is the single
most useful fact about zeros: **a zero cannot destabilise a system.** Stability
is a statement about the denominator, and zeros live in the numerator.

The one dangerous row is the third. Cancelling a pole with a zero is legal
algebra and unreliable engineering. If the cancelled pole is in the right half
plane, the cancellation is exact only if the two match to infinite precision;
component tolerance leaves a sliver of the unstable pole behind, its residue is
tiny, and it grows anyway. The transfer function of the cancelled system looks
stable and the hardware is not. Cancel LHP poles freely; never cancel an RHP
one.`,
        examTip: 'To find a residue fast, cover up the factor belonging to that pole and evaluate everything that is left at the pole. The arithmetic is short enough to do in your head if you keep the signs straight: at s = -2, the factor (s + 10) becomes 8, and the factor s becomes -2. Writing those two numbers down before dividing prevents most sign errors.',
        importantNote: 'A zero shapes the response but cannot destabilise it, and a pole controls stability but is unaffected by any zero. Answer choices that claim a right-half-plane ZERO makes a system unstable are always wrong; the correct symptom is initial undershoot with a bounded, settling response.',
      },
      {
        id: 'tf-char-eq',
        title: '7. The Characteristic Equation and Second-Order Standard Form',
        content: `## 7.1 The characteristic equation is where the dynamics live

Set the denominator of a closed transfer function to zero and you have the
**characteristic equation**:

$$D(s) = a_{n}s^{n} + \\dots + a_{1}s + a_{0} = 0$$

Its roots are the poles, its roots alone decide stability, and it is the object
the exam manipulates when it asks about gain ranges, Routh arrays, or root
locations. For a feedback loop with forward path G and feedback path H, the
characteristic equation is

$$1 + G(s)H(s) = 0$$

which is the same statement — the denominator of $G/(1+GH)$ set to zero — but
in the form the diagram hands you.

## 7.2 Extracting zeta and omega-n from two coefficients

For any second-order denominator, matching against the standard form

$$s^{2} + 2\\zeta \\omega _n s + \\omega _n^{2} = 0$$

gives both parameters immediately:

$$\\omega _n = \\sqrt{a_{0}}, \\qquad \\zeta = \\frac{a_{1}}{2\\sqrt{a_{0}}}$$

provided the leading coefficient has been divided out first. The roots are

$$s = -\\zeta \\omega _n \\pm \\omega _n\\sqrt{\\zeta ^{2} - 1}$$

which is real and distinct for $\\zeta > 1$, real and repeated at
$\\zeta = 1$, and a complex conjugate pair for $\\zeta < 1$.

## 7.3 Worked Example: reading a second-order system off its coefficients

**Given** $H(s) = 18/(s^{2} + 3s + 9)$. Find $\\omega _n$, $\\zeta$, the DC
gain, the pole locations, and the overshoot.

$$\\omega _n = \\sqrt{9} = 3\\ \\mathrm{rad/s}, \\qquad \\zeta = \\frac{3}{2\\times 3} = 0.5$$

$$H(0) = \\frac{18}{9} = 2$$

$$\\omega _d = 3\\sqrt{1 - 0.25} = 2.598\\ \\mathrm{rad/s}, \\qquad s = -1.5 \\pm j2.598$$

$$M_p = e^{-\\pi (0.5)/\\sqrt{0.75}} = 16.30\\%$$

so a unit step climbs to $2 \\times 1.1630 = 2.326$ before settling back to 2.
Two coefficients produced five answers, and no differential equation was
solved.

Note carefully what the numerator did and did not do. It set the DC gain to 2.
It did not touch $\\omega _n$, $\\zeta$, the poles, the overshoot PERCENTAGE,
or the settling time. Answer choices built on "$\\omega _n = \\sqrt{18}$" exist
on every version of this question.

## 7.4 The pole geometry that makes the standard form memorable

Write the complex pole pair in polar terms:

$$p = -\\zeta \\omega _n \\pm j\\omega _n\\sqrt{1 - \\zeta ^{2}}, \\qquad \\lvert p \\rvert = \\omega _n, \\qquad \\cos \\theta = \\zeta$$

where $\\theta$ is measured from the negative real axis. So $\\omega _n$ is a
RADIUS and $\\zeta$ is an ANGLE. Changing the damping ratio at fixed natural
frequency slides the poles around a circle; changing the natural frequency at
fixed damping slides them along a ray.

![The s-plane geometry of a second-order pole pair at a natural frequency of 1000 rad/s. Poles for a damping ratio of 0.4 sit at -400 plus or minus j916.5, which is 66.42 degrees off the negative real axis; poles for 0.8 sit at -800 plus or minus j600, at 36.87 degrees. Both pairs lie on the same circle of radius 1000.](/courses/fe-ee/figures/lin2-tf-pole-geometry.svg)

At $\\zeta = 0.4$ the real part is $0.4 \\times 1000 = 400$ and the imaginary
part is $1000\\sqrt{0.84} = 916.5$, so the angle is
$\\arccos 0.4 = 66.42$ degrees. At $\\zeta = 0.8$ the pole moves to
$-800 \\pm j600$, a 3-4-5 triangle, and the angle closes to 36.87 degrees.
The vertical distance from the real axis is always $\\omega _d$ and the
horizontal distance from the imaginary axis is always $1/\\tau$ of the decay
envelope, so a pole plot is a transient-response plot in disguise.

## 7.5 Worked Example: Routh-Hurwitz without computing the roots

**Given** the characteristic equation $s^{3} + 6s^{2} + 11s + K = 0$. For what
gains K is the loop stable, and what happens at the boundary?

Build the array from the coefficients, alternating rows:

| Row | First column | Second column |
|---|---|---|
| $s^{3}$ | 1 | 11 |
| $s^{2}$ | 6 | K |
| $s^{1}$ | $(66 - K)/6$ | 0 |
| $s^{0}$ | K | — |

The $s^1$ entry is the usual cross-multiplication of the two rows above it,

$$b_{1} = \\frac{(6)(11) - (1)(K)}{6} = \\frac{66 - K}{6}$$

and the first column must not change sign. That requires $K > 0$ from the last row
and $66 - K > 0$ from the third, so

$$0 < K < 66$$

At exactly $K = 66$ the $s^1$ entry vanishes, which is the signature of a pole
pair sitting on the imaginary axis. Factor to see it:

$$s^{3} + 6s^{2} + 11s + 66 = (s + 6)(s^{2} + 11)$$

$$s = -6, \\qquad s = \\pm j\\sqrt{11} = \\pm j3.3166$$

so at the boundary the loop oscillates forever at 3.3166 rad/s, or 0.5279 Hz.
That frequency is not a by-product; it is the answer to the companion question
"at what frequency does the system oscillate at the stability limit", and it is
always read off the auxiliary polynomial formed from the row ABOVE the row of
zeros.

![The largest real part among the roots of s^3 + 6s^2 + 11s + K, swept over K from 0 to 120. It stays negative up to K = 66, touches zero exactly there, and is positive beyond, confirming the Routh boundary by a route that never builds an array.](/courses/fe-ee/figures/lin2-tf-routh-boundary.svg)

The figure was produced by rooting the polynomial numerically at 2400 values of
K, which is a completely different route to the same boundary. The two agree,
which is the point: Routh is a shortcut to a fact that exists independently of
it.

## 7.6 Necessary conditions you can check in three seconds

Before building any array, apply the cheap test. For a polynomial with a
positive leading coefficient to have all its roots in the open left half-plane,

- every coefficient must be present, and
- every coefficient must be positive.

A missing or negative coefficient is an immediate verdict of NOT STABLE, with
no array required. The condition is necessary and not sufficient — a polynomial
can pass it and still be unstable, which is exactly the case
$s^{3} + 6s^{2} + 11s + 100$ where all four coefficients are positive but
$66 - 100 < 0$. Use the quick test to eliminate answer choices, then build the
array only if you must.

| Order | Denominator | Stability condition |
|---|---|---|
| 1 | $s + a_{0}$ | $a_{0} > 0$ |
| 2 | $s^{2} + a_{1}s + a_{0}$ | $a_{1} > 0$ and $a_{0} > 0$ |
| 3 | $s^{3} + a_{2}s^{2} + a_{1}s + a_{0}$ | all positive AND $a_{2}a_{1} > a_{0}$ |
| any | any | all coefficients present and positive, then Routh |

The third row is the one worth memorising outright, because third-order
characteristic equations are the standard vehicle for gain-range questions and
the product condition $a_{2}a_{1} > a_{0}$ answers them in one line.`,
        examTip: 'For a third-order characteristic equation the whole Routh array collapses to one inequality: the product of the two middle coefficients must exceed the product of the outer two. For s^3 + 6s^2 + 11s + K that is 6 times 11 > K times 1, giving K < 66 immediately. Build the full array only when the polynomial is fourth order or higher.',
        importantNote: 'The natural frequency is the square root of the CONSTANT term of the monic denominator, never of the numerator. And the damping ratio needs the factor of two: for s^2 + 3s + 9, zeta = 3/(2 times 3) = 0.5, not 3/3 = 1. Dropping that factor turns an underdamped system into a critically damped one and every downstream answer changes.',
      },
      {
        id: 'tf-combining',
        title: '8. Combining Blocks, and What Feedback Buys',
        content: `## 8.1 The three rules, applied in order

Section 4 listed the cascade, parallel and feedback identities. Applying them
in the right ORDER is what makes a messy diagram collapse:

$$H_{\\text{cascade}} = H_{1}H_{2}, \\qquad H_{\\text{parallel}} = H_{1} + H_{2}, \\qquad T = \\frac{G}{1 + GH}$$

Work from the innermost loop outward. Reduce every series and parallel group
inside a loop before applying the feedback rule to that loop, then treat the
result as a single block in whatever encloses it. Moving a summing junction or
a pick-off point is legal but costs a compensating block, and on a timed exam
it is nearly always faster to find the innermost loop than to rearrange.

A caution about the cascade rule: $H_1H_2$ is correct only when the second
stage does not LOAD the first. Two passive RC sections wired directly together
do load each other, and their combined transfer function is not the product of
the two individual ones. Insert a buffer, or an op-amp stage, and the product
becomes exact. Exam diagrams drawn as blocks are buffered by convention;
exam diagrams drawn as circuits are not.

## 8.2 Worked Example: what unity feedback does to gain and bandwidth

**Given** $G(s) = 20/(s+2)$ inside a negative feedback loop whose feedback path
is the constant $H = 0.5$. Compare the open-loop and closed-loop DC gain and
bandwidth.

$$T(s) = \\frac{G}{1 + GH} = \\frac{20/(s+2)}{1 + 10/(s+2)} = \\frac{20}{s + 12}$$

The denominator picked up the numerator of the loop gain: $s + 2 + 10$. That
is the whole mechanism — negative feedback ADDS the loop-gain numerator to the
open-loop denominator, which for a first-order plant means it pushes the pole
further left.

$$T(0) = \\frac{20}{12} = 1.667, \\qquad \\omega _{c,\\text{closed}} = 12\\ \\mathrm{rad/s}$$

against an open-loop $G(0) = 20/2 = 10$ with a corner at 2 rad/s. Gain fell by
a factor of six and bandwidth rose by the same factor:

$$10 \\times 2 = 20, \\qquad 1.6667 \\times 12 = 20$$

![Magnitude of the open-loop transfer function 20/(s+2) and of the closed loop 20/(s+12), read off a frequency sweep. DC gain drops from 10 to 1.667 while the corner frequency rises from 2 to 12 rad/s, so the product of gain and bandwidth is 20 rad/s on both curves.](/courses/fe-ee/figures/lin2-tf-gain-bandwidth.svg)

The **gain-bandwidth product** is conserved because both quantities are fixed
by the same numerator constant. Feedback does not create gain; it trades gain
you already had for speed, linearity and insensitivity to the forward path. The
half-power point on each curve, marked on the figure, is where the magnitude
has fallen by a factor of $\\sqrt{2}$ from its DC value, and it lands exactly
on the pole frequency in both cases.

## 8.3 Worked Example: closed-loop gain approaches one over the feedback

**Given** $G(s) = 100/(s+5)$ with a feedback path $H = 0.2$. Find the
closed-loop DC gain and compare it with $1/H$.

$$T(s) = \\frac{100/(s+5)}{1 + 20/(s+5)} = \\frac{100}{s + 25}, \\qquad T(0) = \\frac{100}{25} = 4$$

The ideal-feedback answer is $1/H = 5$. The actual answer is smaller, and the
shortfall is entirely explained by the finite loop gain at DC:

$$L(0) = G(0)H = 20 \\times 0.2 = 4, \\qquad T(0) = \\frac{1}{H}\\cdot \\frac{L}{1+L} = 5 \\times \\frac{4}{5} = 4$$

With a loop gain of 4 the closed-loop gain lands 20% below the ideal. Raise the
forward gain tenfold, to $1000/(s+5)$, and the loop gain becomes 40, so
$T(0) = 5 \\times 40/41 = 4.878$ — now within 2.5% of $1/H$. That is the whole
argument for high open-loop gain: it is
not that the gain is useful in itself, it is that a large L makes $L/(1+L)$
indistinguishable from 1 and hands control of the closed-loop gain to the
feedback network, which is usually two resistors and therefore far more stable
than the amplifier.

## 8.4 Worked Example: a buffered cascade, and its repeated pole

**Given** two identical buffered stages, each $1/(s+1)$. Find the combined
transfer function and its step response.

$$H(s) = \\frac{1}{(s+1)^{2}}, \\qquad Y(s) = \\frac{1}{s(s+1)^{2}}$$

The repeated pole needs the two-term expansion:

$$Y(s) = \\frac{1}{s} - \\frac{1}{s+1} - \\frac{1}{(s+1)^{2}}$$

$$y(t) = 1 - e^{-t} - te^{-t} = 1 - (1 + t)e^{-t}$$

At t = 1 s the output is $1 - 2e^{-1} = 0.2642$, whereas a SINGLE stage would
already be at $1 - e^{-1} = 0.6321$. Cascading did not merely halve the speed;
it changed the shape, giving the response a zero initial slope that the single
stage does not have. Every extra buffered stage adds another factor of
$te^{-t}$ and another decade of eventual roll-off, and the s-shaped start
becomes more pronounced.

## 8.5 Worked Example: the sign at the summing junction decides everything

**Given** $G(s) = 4/(s+3)$ in a unity loop. Compare the negative-feedback and
positive-feedback closures.

$$T_{-}(s) = \\frac{4/(s+3)}{1 + 4/(s+3)} = \\frac{4}{s + 7}$$

$$T_{+}(s) = \\frac{4/(s+3)}{1 - 4/(s+3)} = \\frac{4}{s - 1}$$

The negative closure moves the pole from $-3$ to $-7$: faster, still stable,
DC gain $4/7 = 0.571$. The positive closure moves it to $+1$: the output grows
as $e^{t}$ and the system is useless as an amplifier, though this is precisely
how an oscillator or a latch is built on purpose. One symbol at the summing
junction separated a well-behaved first-order lag from an exponential runaway,
and no other part of the algebra changed.

| Configuration | Denominator | Pole | Verdict |
|---|---|---|---|
| Open loop | $s + 3$ | $-3$ | stable, DC gain 1.333 |
| Negative feedback | $s + 7$ | $-7$ | stable and faster, DC gain 0.571 |
| Positive feedback | $s - 1$ | $+1$ | unstable, grows as $e^{t}$ |

## 8.6 Loop gain, and why raising it is never free

Return to the loop of section 4.2 with forward path $K/[s(s+10)]$. Its closed
loop is $K/(s^{2} + 10s + K)$, so

$$\\omega _n = \\sqrt{K}, \\qquad \\zeta = \\frac{5}{\\sqrt{K}}, \\qquad \\zeta \\omega _n = 5$$

The third identity is the interesting one: the product $\\zeta \\omega _n$,
which is the decay rate of the envelope, does not depend on K at all. Raising
the gain speeds up the RINGING without speeding up the DECAY, so the response
gains oscillations it does not lose.

![Closed-loop step responses for a forward path K/(s(s+10)) at K = 25, 100 and 400. Damping falls as five over the square root of K, so the responses run from critically damped with no overshoot, through 16.30 percent overshoot, to 44.43 percent, while the decay envelope is identical in all three.](/courses/fe-ee/figures/lin2-tf-loop-gain.svg)

$$K = 25:\\ \\zeta = 1,\\ M_p = 0 \\qquad K = 100:\\ \\zeta = 0.5,\\ M_p = 16.30\\% \\qquad K = 400:\\ \\zeta = 0.25,\\ M_p = 44.43\\%$$

The settling time is essentially unchanged across all three because it is set
by $4/(\\zeta \\omega _n) = 4/5 = 0.8$ s regardless of K. What the extra gain
bought was a faster rise and a smaller steady-state error; what it cost was
overshoot. Any exam question that raises a loop gain and asks what happens has
this table as its answer key.`,
        examTip: 'Reduce the innermost loop first, and write the reduced block down as a single fraction before touching anything else. Students lose this problem by trying to reduce an outer loop while an inner one is still drawn, which forces the feedback formula to be applied to an expression that is not yet a single transfer function.',
        importantNote: 'Cascade blocks multiply only when the stages do not load one another. Two RC sections connected directly are NOT 1/(RCs+1) squared — the second section draws current from the first and the true denominator picks up a cross term. If the problem shows a buffer or an op-amp between the stages, multiply freely; if it shows bare passive networks in series, analyse the whole thing at once.',
      },
      {
        id: 'tf-problem-set-a',
        title: '9. Problem Set A: Building and Reading Transfer Functions',
        content: `## 9.1 Problem Set A

Work each one on paper before reading the solution. Every solution names the
distractor that the exam will offer and the wrong number it produces.

**A1.** $H(s) = 40/(s^{2} + 6s + 25)$. Find $\\omega _n$, $\\zeta$, the DC
gain, $\\omega _d$, the percent overshoot and the 2% settling time.

**A2.** Find the DC gain of $H(s) = 6(s+5)/[(s+2)(s+15)]$, in absolute terms
and in decibels.

**A3.** A unity negative feedback loop has forward path
$G(s) = 50/[(s+1)(s+10)]$. Find the closed-loop transfer function,
$\\omega _n$, $\\zeta$ and the closed-loop DC gain.

**A4.** For the characteristic equation $s^{3} + 4s^{2} + 8s + K = 0$, find the
range of K for stability and the oscillation frequency at the upper boundary.

**A5.** A second-order system has poles at $-3 \\pm j4$ and a DC gain of 2.
Write its transfer function.

**A6.** Derive H(s) for the model $2y'' + 8y' + 32y = 64x$ and state whether it
is under-, critically or overdamped.

**A7.** An op-amp inverting stage has $R_1 = 20$ kilohm and a feedback
impedance of 200 kilohm in parallel with 500 picofarad. Find the DC gain and
the pole frequency in rad/s and in hertz.

## 9.2 Worked Answers, Problem Set A

**A1 — Worked.** The denominator is already monic:

$$\\omega _n = \\sqrt{25} = 5\\ \\mathrm{rad/s}, \\qquad \\zeta = \\frac{6}{2\\times 5} = 0.6$$

$$H(0) = \\frac{40}{25} = 1.6, \\qquad \\omega _d = 5\\sqrt{1-0.36} = 4\\ \\mathrm{rad/s}$$

$$M_p = e^{-\\pi (0.6)/0.8} = 9.48\\%, \\qquad t_s = \\frac{4}{0.6\\times 5} = 1.333\\ \\mathrm{s}$$

*Trap:* taking $\\omega _n = \\sqrt{40} = 6.325$ from the numerator, which then
gives $\\zeta = 6/12.649 = 0.474$ and an overshoot of 18.4% — every number
downstream is wrong. A second trap drops the factor of two and reports
$\\zeta = 6/5 = 1.2$, which would classify the system as overdamped with no
overshoot at all.

**A2 — Worked.** Substitute s = 0 directly:

$$H(0) = \\frac{6(5)}{(2)(15)} = \\frac{30}{30} = 1 = 0\\ \\mathrm{dB}$$

*Trap:* reporting the leading constant 6, or 15.56 dB. The gain factor K in
front of a factored form is the HIGH-frequency scaling, not the DC gain; the
pole and zero values have to be carried through.

**A3 — Worked.** The closed-loop denominator is the open-loop denominator plus
the open-loop numerator:

$$T(s) = \\frac{50}{(s+1)(s+10) + 50} = \\frac{50}{s^{2} + 11s + 60}$$

$$\\omega _n = \\sqrt{60} = 7.746\\ \\mathrm{rad/s}, \\qquad \\zeta = \\frac{11}{2\\sqrt{60}} = 0.710, \\qquad T(0) = \\frac{50}{60} = 0.8333$$

The loop is underdamped but only just: the overshoot is 4.21% and the damped
frequency is 5.454 rad/s.

*Trap:* forgetting to add 50 to the constant term and expanding only
$(s+1)(s+10) = s^{2} + 11s + 10$. That gives $\\omega _n = 3.162$ and
$\\zeta = 1.739$, a confidently overdamped answer to an underdamped system.

**A4 — Worked.** For a third-order monic polynomial the condition is that the
product of the middle coefficients exceeds the product of the outer ones:

$$4 \\times 8 = 32 > K \\times 1 \\;\\Longrightarrow\\; 0 < K < 32$$

At $K = 32$ the polynomial factors as $(s+4)(s^{2}+8)$, so the sustained
oscillation is at

$$\\omega = \\sqrt{8} = 2.828\\ \\mathrm{rad/s}$$

*Trap:* answering $K < 8$ by comparing the constant term against the
$s^{1}$ coefficient alone, or reporting the oscillation frequency as
$\\sqrt{32} = 5.657$ rad/s by taking the square root of the boundary gain
rather than of the auxiliary polynomial's constant term.

**A5 — Worked.** The poles fix the denominator:

$$\\omega _n = \\sqrt{3^{2} + 4^{2}} = 5, \\qquad \\zeta = \\frac{3}{5} = 0.6$$

$$D(s) = s^{2} + 2(0.6)(5)s + 25 = s^{2} + 6s + 25$$

The numerator must then make $H(0) = 2$, so it is $2 \\times 25 = 50$:

$$H(s) = \\frac{50}{s^{2} + 6s + 25}$$

*Trap:* writing $2/(s^{2}+6s+25)$, putting the DC gain in the numerator
directly. That system has a DC gain of $2/25 = 0.08$, off by the factor
$\\omega _n^{2}$.

**A6 — Worked.** Transform with zero initial conditions and divide by the
leading coefficient:

$$H(s) = \\frac{64}{2s^{2} + 8s + 32} = \\frac{32}{s^{2} + 4s + 16}$$

$$\\omega _n = \\sqrt{16} = 4\\ \\mathrm{rad/s}, \\qquad \\zeta = \\frac{4}{2\\times 4} = 0.5$$

Since $\\zeta < 1$ the system is **underdamped**, with $H(0) = 32/16 = 2$ and
$\\omega _d = 4\\sqrt{0.75} = 3.464$ rad/s.

*Trap:* failing to divide by the leading 2 and matching
$2s^{2} + 8s + 32$ against the standard form, which reports
$\\omega _n = \\sqrt{32} = 5.657$ and $\\zeta = 8/11.314 = 0.707$ — a
different system entirely, and one whose overshoot is 4.3% rather than 16.3%.

**A7 — Worked.** The inverting stage gives $H = -Z_f/R_1$ with
$Z_f = R_2/(1 + R_2Cs)$:

$$H(s) = \\frac{-R_{2}/R_{1}}{1 + R_{2}Cs} = \\frac{-10}{1 + 10^{-4}s}$$

$$\\text{DC gain} = -\\frac{200}{20} = -10, \\qquad \\omega _p = \\frac{1}{R_{2}C} = 10^{4}\\ \\mathrm{rad/s} = 1591.5\\ \\mathrm{Hz}$$

since $R_2C = 200\\times 10^{3} \\times 500 \\times 10^{-12} = 10^{-4}$ s.

*Trap:* computing the corner from $R_1C$ instead of $R_2C$, giving
$10^{5}$ rad/s and a tenfold error in bandwidth. The pole belongs to the
FEEDBACK network, because that is where the capacitor is.`,
        examTip: 'When a question hands you a second-order denominator and asks for several quantities, compute wn and zeta first and write them at the top of your scratch work. Every remaining answer — overshoot, peak time, settling time, pole locations, damped frequency — is a one-line function of those two numbers, and having them written down stops you re-deriving them under time pressure.',
      },
      {
        id: 'tf-problem-set-b',
        title: '10. Problem Set B: Poles, Zeros, Stability and Frequency',
        content: `## 10.1 Practice Problems B

**B1.** For $H(s) = 20/[(s+2)(s+10)]$, identify the dominant pole, state its
time constant, and estimate the 2% settling time from it.

**B2.** A measured unit-step response dips to $-0.125$ before rising to a
final value of 1. What feature of H(s) does this prove exists, and does it
threaten stability?

**B3.** Find $\\lvert H(j3) \\rvert$ for $H(s) = 10(s+2)/[(s+1)(s+5)]$, in
absolute terms and in decibels.

**B4.** A system with $H(s) = 8/(s+4)$ is driven by
$x(t) = 5\\cos (3t)$. Find the steady-state output.

**B5.** Classify each of these as stable, marginally stable or unstable:
(i) poles at $-1, -4$; (ii) poles at $\\pm j4$; (iii) a double pole at the
origin; (iv) poles at $-2, +0.5$.

**B6.** $H(s) = (s-2)/[(s-2)(s+5)]$ is offered as "equivalent to
$1/(s+5)$, therefore stable". Evaluate that claim.

**B7.** A high-pass section has $H(s) = 0.02s/(0.02s + 1)$. Find the DC gain,
the corner frequency, and the gain far above the corner.

## 10.2 Worked Answers, Problem Set B

**B1 — Worked.** The dominant pole is the one nearest the imaginary axis,
$s = -2$, whose time constant is

$$\\tau = \\frac{1}{2} = 0.5\\ \\mathrm{s}, \\qquad t_{s} \\approx 4\\tau = 2\\ \\mathrm{s}$$

The pole at $-10$ has $\\tau = 0.1$ s and is finished before the slow one has
travelled a fifth of its journey.

*Trap:* choosing $-10$ as dominant because it is the larger number, giving
$\\tau = 0.1$ s and a settling estimate of 0.4 s — five times too fast. The
dominant pole is the SLOWEST one, which means the smallest magnitude, which
means the one closest to the $j\\omega$ axis.

**B2 — Worked.** Initial undershoot proves a **zero in the right half-plane**.
It does not threaten stability: the response is bounded and settles at 1, so
every pole is in the left half-plane. A right-half-plane zero costs phase and
limits achievable closed-loop bandwidth, but it cannot make the response grow.

*Trap:* answering "a pole in the RHP". An RHP pole produces a response that
GROWS without bound; it never recovers to a finite final value. Any answer
choice pairing "undershoot" with "unstable" is wrong on both counts.

**B3 — Worked.** Evaluate the vector magnitudes at $s = j3$:

$$\\lvert H(j3) \\rvert = \\frac{10\\sqrt{2^{2}+3^{2}}}{\\sqrt{1^{2}+3^{2}}\\,\\sqrt{5^{2}+3^{2}}} = \\frac{10\\sqrt{13}}{\\sqrt{10}\\sqrt{34}} = 1.955$$

$$20\\log_{10}(1.955) = 5.82\\ \\mathrm{dB}$$

*Trap:* using the DC gain of 4 and answering 12.04 dB. At 3 rad/s both poles
are already past their corners and the magnitude has fallen well below its DC
value; the DC gain answers a different question.

**B4 — Worked.** Substitute $s = j3$:

$$H(j3) = \\frac{8}{4 + j3}, \\qquad \\lvert H(j3) \\rvert = \\frac{8}{5} = 1.6, \\qquad \\angle H(j3) = -36.87^\\circ$$

$$y_{ss}(t) = 5 \\times 1.6\\cos (3t - 36.87^\\circ ) = 8\\cos (3t - 36.87^\\circ )$$

*Trap:* evaluating the magnitude as $8/4 = 2$ by ignoring the imaginary part,
which gives an amplitude of $2 \\times 5 = 10$ and a phase of zero. The
denominator is a COMPLEX number; its magnitude is the hypotenuse, not the real
part.

**B5 — Worked.**

| Poles | Classification | Reason |
|---|---|---|
| $-1, -4$ | stable | both real parts negative |
| $\\pm j4$ | marginally stable | simple poles on the axis, sustained sinusoid |
| double at 0 | unstable | repeated axis poles give a ramp $t\\,u(t)$ |
| $-2, +0.5$ | unstable | one pole in the right half-plane |

*Trap:* calling the double pole at the origin "marginally stable" because it
sits on the axis. Marginal stability requires the axis poles to be SIMPLE. A
repeated pole at the origin integrates twice and the response ramps away, so it
is unstable in every sense including BIBO.

**B6 — Worked.** The claim is false. Algebraically the factors cancel, but the
cancellation describes an ideal that hardware cannot hold: any mismatch leaves
a residual pole at $s \\approx +2$ with a very small residue, and a very small
coefficient on $e^{+2t}$ still reaches any bound you name. The mode is
unobservable in the transfer function and fully present in the state. Never
cancel a right-half-plane pole; stabilise it with feedback that MOVES it into
the left half-plane instead.

*Trap:* accepting the cancellation and reporting a settling time of
$4/5 = 0.8$ s for a system that in fact diverges.

**B7 — Worked.** The zero sits at the origin:

$$H(0) = 0, \\qquad \\omega _c = \\frac{1}{0.02} = 50\\ \\mathrm{rad/s} = 7.96\\ \\mathrm{Hz}$$

Far above the corner the $0.02s$ terms dominate both numerator and denominator
and the ratio approaches 1, or 0 dB — a high-pass section passes everything
above its corner at unity gain.

*Trap:* reading the DC gain as 0.02 from the numerator coefficient. Setting
s = 0 kills the numerator outright; the coefficient 0.02 sets WHERE the
transition happens, not how much passes at DC.`,
        examTip: 'Sinusoidal steady-state questions are pure complex arithmetic and nothing else. Substitute s = jw, compute one magnitude as a hypotenuse and one angle as an arctangent, multiply the input amplitude by the magnitude, add the angle to the input phase, and stop. If you find yourself writing a differential equation, you have taken a wrong turn.',
        importantNote: 'The dominant pole is the one with the SMALLEST magnitude of real part, because it decays most slowly. Answer choices routinely offer the largest pole as "dominant" and the resulting settling time is short by exactly the pole ratio.',
      },
    ],
    keyTakeaways: [
      'H(s) = Y(s)/X(s) = K·Π(s−zᵢ)/Π(s−pⱼ); poles determine stability, zeros shape response.',
      'Poles in LHP → stable; on jω axis → marginal; in RHP → unstable.',
      'Dominant poles (closest to jω axis) control the visible transient response.',
      'Partial fraction decomposition converts complex H(s) into simple inverse-transformable terms.',
      'System order = degree of denominator = number of poles = number of energy-storage elements.',
      'Cover-up method for partial fractions: evaluate remaining expression at pole location.',
    ],
  },

  fee_z_transforms: {
    topicId: 'fee_z_transforms',
    title: 'Z-Transforms and Discrete Systems',
    domainWeight: 'Linear Systems · 4–6%',
    overview: 'The Z-Transform is the discrete-time counterpart of the Laplace Transform, converting difference equations into algebraic form. Stability in discrete systems requires poles inside the unit circle, and the mapping z = e^(sT) connects continuous and discrete domains.',
    sections: [
      {
        id: 'zt-definition',
        title: '1. Z-Transform Definition and Common Pairs',
        content: `## 1.1 The Z-Transform

For a discrete signal x[n], the **bilateral Z-Transform** is:

**$X(z) = \\sum _{n=-\\infty }^{\\infty }x[n]z^{-n}$**

The **unilateral Z-Transform** (causal sequences, n ≥ 0) is standard for digital control and FE exam problems.

### Essential Z-Transform Pairs

| Time Domain x[n] | Z-Domain X(z) | ROC |
|---|---|---|
| $\\delta [n]$ | 1 | All z |
| u[n] | $z/(z-1)$ | $\\lvert z\\rvert > 1$ |
| $a^{n}\\cdot u[n]$ | $z/(z-a)$ | $\\lvert z\\rvert > \\lvert a\\rvert$ |
| $n\\cdot a^{n}\\cdot u[n]$ | $az/(z-a)^{2}$ | $\\lvert z\\rvert > \\lvert a\\rvert$ |
| $n\\cdot u[n]$ | $z/(z-1)^{2}$ | $\\lvert z\\rvert > 1$ |
| $\\cos (\\omega _{0}n)\\cdot u[n]$ | $z(z-\\cos  \\omega _{0})/(z^{2}-2z \\cos  \\omega _{0}+1)$ | $\\lvert z\\rvert > 1$ |

### Key Properties

- **Linearity**: Z{α·$x_{1}$ + β·$x_{2}$} = α·$X_{1}$(z) + β·$X_{2}$(z)
- **Time shift**: Z{x[n−k]} = z^(−k)·X(z) — delay by k samples multiplies by z^(−k)
- **Convolution**: Z{x[n]*h[n]} = X(z)·H(z)
- **Initial value**: x[0] = lim(z→∞) X(z)
- **Final value**: lim(n→∞) x[n] = lim(z→1) (z−1)·X(z) (if stable)

## 1.2 Region of Convergence (ROC)

The ROC specifies where the Z-Transform sum converges:

- **Causal signals**: ROC is the exterior of a circle, $\\lvert z\\rvert > r_{+}$
- **Anti-causal signals**: ROC is the interior, $\\lvert z\\rvert < r_{-}$
- **Two-sided signals**: ROC is an annular ring, $r_{-} < \\lvert z\\rvert < r_{+}$
- The ROC cannot contain poles`,
        examTip: 'On the FE exam, you will almost always work with causal (unilateral) Z-Transforms. Memorize the key pairs: u[n] → z/(z−1) and aⁿ·u[n] → z/(z−a). These two cover most exam problems when combined with partial fraction expansion.',
      },
      {
        id: 'zt-stability-mapping',
        title: '2. s-to-z Mapping and Discrete Stability',
        content: `## 2.1 Mapping Between s-Plane and z-Plane

The fundamental relationship is:

**$z = e^{sT}$** where T is the sampling period (T = 1/fₛ)

This exponential mapping transforms continuous-domain regions to discrete-domain regions:

| s-Plane Region | z-Plane Region | System Behavior |
|---|---|---|
| Left half-plane (LHP) | **Inside** unit circle, $\\lvert z\\rvert < 1$ | Decaying (stable) |
| Imaginary axis (jω) | **On** unit circle, $\\lvert z\\rvert = 1$ | Sustained oscillation |
| Right half-plane (RHP) | **Outside** unit circle, $\\lvert z\\rvert > 1$ | Growing (unstable) |

### Discrete-Time Stability

For discrete systems, **BIBO stability requires all poles inside the unit circle**:

**$\\lvert p_{i}\\rvert < 1$** for all poles pᵢ

This is the discrete equivalent of "all poles in the LHP" for continuous systems.

## 2.2 Inverse Z-Transform via Partial Fractions

To find x[n] from X(z):

1. Express X(z)/z in partial fractions
2. Multiply each term by z
3. Use the table: A·z/(z−a) → A·aⁿ·u[n]

### Example

**$X(z) = 3z/[(z-0.5)(z-0.8)]$**

Partial fractions of X(z)/z: A/(z−0.5) + B/(z−0.8)

$$A = 3/(0.5-0.8) = -10, B = 3/(0.8-0.5) = 10$$

**$x[n] = [-10\\cdot (0.5)^{n} + 10\\cdot (0.8)^{n}]\\cdot u[n]$**

Both poles ($\\lvert 0.5\\rvert < 1$ and $\\lvert 0.8\\rvert < 1$) are inside the unit circle → **stable**.

## 2.3 Difference Equations

Z-Transforms convert difference equations to algebraic form. For:

**$y[n] - 0.5\\cdot y[n-1] = x[n]$**

Taking Z-Transform: Y(z) − 0.5·z⁻¹·Y(z) = X(z)

**$H(z) = Y(z)/X(z) = 1/(1 - 0.5z^{-1}) = z/(z - 0.5)$**

Pole at z = 0.5 (inside unit circle) → stable system.`,
        examTip: 'When computing inverse Z-Transforms on the FE exam, always divide by z first (form X(z)/z), do partial fractions, then multiply each term by z before looking up the table. This avoids sign errors and works for every problem type.',
        importantNote: 'Do not confuse the continuous stability criterion (poles in LHP) with the discrete criterion (poles inside unit circle). The mapping z = e^(sT) explains why: the imaginary axis maps to the unit circle, so "left of jω" maps to "inside |z| = 1".',
      },
      {
        id: 'zt-sampling',
        title: '3. Sampling, Difference Equations, and Digital Filters',
        content: `## 3.1 From x(t) to x[n]

A discrete sequence usually begins life as samples of a continuous signal:
**$x[n] = x(nT)$**, taken every T seconds at the sampling rate
$f_s = 1/T$. The **sampling theorem** sets the one non-negotiable condition:

**$f_s > 2 f_{max}$**

— the rate must exceed twice the highest frequency present, or distinct
continuous frequencies become indistinguishable in the samples. When the
condition fails, a component at f does not disappear; it reappears
disguised, folded down to $|f - k \\cdot f_s|$ for whichever integer k lands
the result between 0 and $f_s/2$.

**Worked:** a 7 kHz tone sampled at 10 kHz. Since 7 exceeds the 5 kHz
Nyquist limit, the samples are identical to those of a tone at
10 - 7 = **3 kHz**, and no later processing can tell the two apart. That
irreversibility is why anti-alias filtering happens in analogue hardware
BEFORE the sampler — the one place in a digital system where the filter
cannot be software.

**A subtler case:** an audio system sampling at 8 kHz picks up both genuine
60 Hz mains hum and a 7.94 kHz whine from a switching supply. The hum sits
safely below Nyquist and is recorded faithfully — but the whine folds to
8000 - 7940 = **60 Hz** as well, and the two land on the same digital
frequency. A notch filter in software removes both together or neither
separately, which is exactly the diagnostic signature that says the
anti-alias filter is missing or inadequate.

## 3.2 A difference equation is a recipe of delays

Where continuous systems integrate, discrete systems remember. The
**exponential smoother** — the workhorse single-pole digital filter — is one
line of memory:

**$y[n] = 0.9\\cdot y[n-1] + 0.1\\cdot x[n]$**

Transform it, using the delay rule Z{y[n-1]} = z^(-1) Y(z):

$$H(z) = 0.1/(1 - 0.9z^{-1}) = 0.1z/(z - 0.9)$$

Everything the filter does is now on display. The DC gain is
H(1) = 0.1/(1 - 0.9) = **1**, so constants pass unchanged. The single pole
at z = 0.9 sits inside the unit circle: stable, with a step response
y[n] = 1 - (0.9)^(n+1) that crosses 63.2% of its final value after roughly
nine samples have arrived. For a pole at a near 1, the effective time
constant is roughly 1/(1 - a) samples — the discrete counterpart of tau,
and the knob a designer turns to trade smoothing depth against response lag.

![The geometric sequence a to the power n for a equal to 0.5, 0.95 and 1.05, computed term by term. The pole inside the unit circle dies quickly, the pole near the circle lingers for tens of samples, and the pole outside grows without bound — discrete stability drawn rather than stated.](/courses/fe-ee/figures/lsys-z-geometric.svg)

The figure is the whole discrete stability story in one frame: $a^n$ IS the
discrete exponential, and its fate — die fast, linger, or diverge — is read
entirely from the pole magnitude against 1. A negative or complex a adds
alternation or spiralling to the same envelope, changing the decoration but
never the verdict.

## 3.3 Frequency response on the unit circle

The frequency response of a discrete system is H(z) evaluated ON the unit
circle: **$z = e^{j\\Omega }$**, where $\\Omega = 2\\pi f/f_s$ is the digital
frequency in radians per sample. The circle replaces the jω axis, and one
lap covers everything: $\\Omega = 0$ (the point z = 1) is DC, and
$\\Omega = \\pi$ (the point z = -1) is the Nyquist frequency $f_s/2$, the
fastest oscillation the sample rate can represent.

**Worked:** the two-point moving average y[n] = (x[n] + x[n-1])/2, so
H(z) = (1 + z^(-1))/2. On the circle its magnitude works out to
cos(Omega/2):

| $\\Omega$ | Continuous frequency | Magnitude |
|---|---|---|
| 0 | DC | 1.000 |
| $\\pi /2$ | $f_s/4$ | 0.707 |
| $\\pi$ | $f_s/2$ (Nyquist) | 0.000 |

A gentle low-pass, with an exact NULL at Nyquist — and the null has a
mechanical explanation worth keeping: the fastest representable sequence
alternates +1, -1, +1, and averaging any two neighbours of it gives exactly
zero. Frequency-domain zeros are time-domain cancellations, in the discrete
world as in the continuous one.`,
        examTip: 'Digital frequency Omega is radians per SAMPLE, not per second: Omega = 2*pi*f/fs. Landmarks worth memorising: z = 1 is DC, z = -1 is Nyquist, and one trip around the unit circle spans exactly fs. Most discrete frequency-response errors on the exam are unit slips between f, omega and Omega.',
        importantNote: 'Aliasing is irreversible: once a 7 kHz tone has been sampled at 10 kHz, its samples ARE the samples of a 3 kHz tone, and no digital filter can separate them afterward. The anti-alias filter must act before sampling, in analogue hardware — the exam tests this ordering directly.',
      },
      {
        id: 'zt-worked',
        title: '4. Worked Problems in the z-Domain',
        content: `## 4.1 A step response, end to end

**Problem:** find the unit-step response of H(z) = z/(z - 0.5).

The input transform is X(z) = z/(z - 1), so

$$Y(z) = z^{2}/((z - 1)(z - 0.5))$$

Follow the divide-by-z discipline from section 2: expand Y(z)/z, not Y(z).

$$Y(z)/z = z/((z - 1)(z - 0.5)) = A/(z - 1) + B/(z - 0.5)$$

Cover-up at each pole: A = 1/(1 - 0.5) = **2**, and B = 0.5/(0.5 - 1) =
**-1**. Multiply back by z and invert term by term:

**$y[n] = 2 - (0.5)^{n}$** for n ≥ 0

Now audit it three independent ways, because each check exercises a
different piece of the machinery:

- **First sample:** y[0] = 2 - 1 = 1, which must equal h[0] since the step
  has only delivered one sample yet. From H(z), h[n] = (0.5)^n u[n], so
  h[0] = 1. Agrees.
- **Second sample:** y[1] = 2 - 0.5 = 1.5, which must equal h[0] + h[1] =
  1 + 0.5. Agrees.
- **Final value:** y[∞] = 2 directly from the expression, and independently
  the DC gain is H(1) = 1/(1 - 0.5) = 2. Agrees.

## 4.2 Stability of a second-order filter

**Problem:** is y[n] = 1.2 y[n-1] - 0.72 y[n-2] + x[n] stable?

The characteristic polynomial is $z^{2} - 1.2z + 0.72 = 0$, with roots

$$z = 0.6 \\pm j0.6$$

Their magnitude is sqrt(0.36 + 0.36) = sqrt(0.72) = **0.849 < 1**: both
poles inside the unit circle, so the filter is stable, ringing with an
envelope that shrinks by the factor 0.849 every sample.

The shortcut worth owning: for a conjugate pole pair, the PRODUCT of the
roots equals the constant coefficient of the monic quadratic, and that
product is $|p|^{2}$. Here the constant is 0.72, so |p| = sqrt(0.72) with no
root-finding at all. A complex pair from $z^{2} + bz + c$ is stable exactly
when c < 1 — one comparison, made after confirming the discriminant is
negative so the pair really is complex.

## 4.3 The initial and final value theorems in z

| Theorem | Formula | Validity condition |
|---|---|---|
| Initial value | $x[0] = \\lim _{z \\to \\infty } X(z)$ | X(z) proper |
| Final value | $x[\\infty ] = \\lim _{z \\to 1} (z-1)X(z)$ | poles of (z-1)X(z) inside unit circle |

**Worked:** X(z) = 0.5z/((z - 1)(z - 0.5)).

Final value: (z - 1)X(z) = 0.5z/(z - 0.5), whose remaining pole at 0.5 is
safely inside the circle, so the limit at z = 1 is 0.5/0.5 = **1**.
Initial value: as z → ∞ the expression behaves as 0.5z/z² → **0**, so the
sequence starts at zero and climbs to one.

The validity clause is the same trap as its s-domain cousin: a pole ON the
unit circle other than the single one at z = 1 — an undamped oscillation —
makes the final-value limit produce a confident, meaningless number. Check
the pole set first, every time.

## 4.4 The s-to-z dictionary

Everything in this topic mirrors a continuous fact through $z = e^{sT}$,
and holding the two columns side by side is the fastest revision available:

| Concept | s-domain | z-domain |
|---|---|---|
| Stability region | open left half-plane | interior of unit circle |
| Marginal boundary | $j\\omega$ axis | unit circle |
| DC | s = 0 | z = 1 |
| Decaying mode | $e^{-at}u(t) \\to 1/(s+a)$ | $a^{n}u[n] \\to z/(z-a)$ |
| Unit step | $1/s$ | $z/(z-1)$ |
| Pure delay | multiply by $e^{-st_{0}}$ | multiply by $z^{-k}$ |
| Convolution | multiply transforms | multiply transforms |
| Final value | $s F(s)$ as $s \\to 0$ | $(z-1)X(z)$ as $z \\to 1$ |

Two rows deserve a second look. The delay row is why discrete systems are
so natural for hardware: z^(-1) is one register, so any rational H(z) is a
wiring diagram of registers, multipliers and adders. And the decaying-mode
row is the bridge itself: sampling $e^{-\\alpha t}$ every T seconds produces
the geometric sequence whose ratio is $a = e^{-\\alpha T}$, which is the
mapping z = e^(sT) acting on one concrete signal rather than on an abstract
plane. The decay rate and the pole radius are DIFFERENT symbols joined by an
exponential, and writing both as "a" is the fastest way to lose the thread.

## 4.5 Long division, when only the first few samples matter

Partial fractions deliver a closed form; sometimes the question only wants
h[0] through h[2], and LONG DIVISION gets there faster. Write H(z) in powers
of $z^{-1}$ and divide numerator by denominator:

**Worked:** the smoother H(z) = 0.1/(1 - 0.9z^{-1}). Dividing out,

$$H(z) = 0.1 + 0.09z^{-1} + 0.081z^{-2} + ...$$

and the coefficients ARE the impulse response, delay by delay: h[0] = 0.1,
h[1] = 0.09, h[2] = 0.081 — visibly the geometric sequence
0.1 x (0.9)^n that the closed form predicts. Division cannot give the
general term, but for "what is the third output sample" it is three lines
of arithmetic against a full expansion, and it doubles as an independent
check on any closed form you derive by the longer route.`,
        examTip: 'The three-check habit from the step-response example - first sample against h[0], second against a direct convolution sum, final value against H(1) - costs under a minute and catches nearly every partial-fraction slip. On multiple-choice questions, often the final-value check ALONE eliminates three options.',
        importantNote: 'For a monic quadratic z^2 + bz + c with complex roots, the pole magnitude is sqrt(c) - the constant term is the squared magnitude. Confirm the roots are actually complex (b^2 < 4c) before using this; for real roots each must be checked against the unit circle individually.',
      },
      {
        id: 'zt-defining-sum',
        title: '5. The Defining Sum, and Why the ROC Is Half the Answer',
        content: `## 5.1 A transform is a sum, and a sum has to converge

The bilateral z-transform is one line, and everything difficult about it is
hidden in the question of when that line means anything:

$$X(z) = \\sum _{n=-\\infty }^{\\infty }x[n]\\,z^{-n}$$

This is a power series in $z^{-1}$, and a power series converges on some set
of z and diverges everywhere else. That set is the **region of
convergence**. It is not a footnote attached to the answer; it is PART of
the answer, in the same way that the domain is part of a function. Two
completely different sequences routinely produce the same algebraic
expression and are told apart only by their regions.

The one test that settles every case is absolute summability, applied to
the transformed series:

$$\\sum _{n=-\\infty }^{\\infty }\\lvert x[n]\\rvert \\,\\lvert z\\rvert ^{-n} < \\infty$$

Notice that only the MAGNITUDE of z appears. The convergence question does
not care about the angle of z at all, which is why every region of
convergence is bounded by circles centred on the origin: a disc, the
outside of a disc, or a ring between two of them.

## 5.2 The two sequences behind one expression

Take the right-sided geometric sequence $x[n] = a^{n}u[n]$ and sum it
directly, using nothing but the ordinary geometric series:

$$X(z) = \\sum _{n=0}^{\\infty }a^{n}z^{-n} = \\sum _{n=0}^{\\infty }\\left(\\frac{a}{z}\\right)^{n} = \\frac{1}{1-az^{-1}} = \\frac{z}{z-a}$$

The geometric series converges exactly when its ratio has magnitude below
one, so the region is $\\lvert z\\rvert > \\lvert a\\rvert$: the OUTSIDE of the
circle through the pole.

Now take the left-sided sequence $x[n] = -a^{n}u[-n-1]$, which lives on
$n = -1, -2, -3, \\dots$ and grows as n runs backwards. Substitute
$m = -n$ so the index counts upward:

$$X(z) = -\\sum _{n=-\\infty }^{-1}a^{n}z^{-n} = -\\sum _{m=1}^{\\infty }\\left(\\frac{z}{a}\\right)^{m} = -\\frac{z/a}{1-z/a} = \\frac{z}{z-a}$$

The SAME expression. This time the ratio is $z/a$, so convergence requires
$\\lvert z\\rvert < \\lvert a\\rvert$: the INSIDE of the circle. Handed
$z/(z-0.8)$ with no region attached, you cannot say whether the sequence is
$(0.8)^{n}u[n]$, which decays forward in time, or
$-(0.8)^{n}u[-n-1]$, which is zero for all $n \\ge 0$ and enormous in the
distant past. Both are correct inverses; only one of them is what the
problem meant.

![Two stem plots of the same algebraic transform: with the region of convergence outside the pole radius the sequence is right-sided and decays forward in time, and with the region inside it the sequence is left-sided and grows backwards.](/courses/fe-ee/figures/lin3-zt-roc-choices.svg)

## 5.3 The shapes a region can take

| Sequence support | Region of convergence | Example, tested by summing |
|---|---|---|
| finite length | every z, except possibly 0 or infinity | $\\delta [n-3]$, converges for all $\\lvert z\\rvert > 0$ |
| right-sided | outside the outermost pole | $(0.8)^{n}u[n]$, diverges at 0.799 and converges at 0.801 |
| left-sided | inside the innermost pole | $-(0.8)^{n}u[-n-1]$, converges at 0.799 and diverges at 0.801 |
| two-sided | a ring between two poles | $(0.5)^{n}u[n]-3^{n}u[-n-1]$, the ring $0.5 < \\lvert z\\rvert < 3$ |
| none of the above | empty; no transform exists | $x[n]=1$ for all n |

Three structural facts follow from the summability test and are worth
holding as rules rather than rediscovering each time. First, the region
never contains a pole, because at a pole the expression is infinite and a
convergent sum cannot be. Second, the region is always bounded by circles
through poles, because the geometric ratios that decide convergence are
built from the pole magnitudes. Third, if the region includes the unit
circle then the sequence has a discrete-time Fourier transform, obtained by
setting $z = e^{j\\Omega }$, and if it does not, it has none.

### Worked example 5.1 — a genuinely two-sided sequence

**Given:** $x[n] = (0.5)^{n}u[n] - 3^{n}u[-n-1]$. Find X(z) and its region.

The two halves transform independently by the two derivations above:

$$\\sum _{n=0}^{\\infty }(0.5)^{n}z^{-n} = \\frac{z}{z-0.5} \\quad \\text{for} \\quad \\lvert z\\rvert > 0.5$$

$$-\\sum _{n=-\\infty }^{-1}3^{n}z^{-n} = \\frac{z}{z-3} \\quad \\text{for} \\quad \\lvert z\\rvert < 3$$

Linearity adds the expressions, and the region is where BOTH sums converge,
which is the intersection:

$$X(z) = \\frac{z}{z-0.5} + \\frac{z}{z-3}, \\qquad 0.5 < \\lvert z\\rvert < 3$$

Testing this numerically rather than quoting it is a five-line exercise and
worth doing once: summing $\\lvert x[n]\\rvert \\,\\lvert z\\rvert ^{-n}$ over
several hundred thousand terms overflows at $\\lvert z\\rvert = 0.49$ and at
$\\lvert z\\rvert = 3.1$, and settles to a finite number at
$\\lvert z\\rvert = 1$ and at $\\lvert z\\rvert = 2.9$. The ring is real, not a
convention.

Because the unit circle lies inside the ring, this sequence has a Fourier
transform even though it is unbounded in the past. Change the outer pole
from 3 to 0.9 and the ring becomes $0.5 < \\lvert z\\rvert < 0.9$, which
excludes the unit circle: the transform still exists, but no Fourier
transform does.

![The z-plane with poles at 0.5 and 3, the shaded ring between them marking the region where the defining sum converges, and the unit circle drawn inside that ring.](/courses/fe-ee/figures/lin3-zt-roc-map.svg)

### Worked example 5.2 — which region makes a system causal and stable

**Given:** $H(z) = z^{2}/[(z-0.5)(z-2)]$. Enumerate the possible impulse
responses and say which one is both causal and stable.

Two poles give three candidate regions, and each names a different system:

| Region | Impulse response | Causal? | Stable? |
|---|---|---|---|
| $\\lvert z\\rvert > 2$ | right-sided, contains $2^{n}u[n]$ | yes | no |
| $0.5 < \\lvert z\\rvert < 2$ | two-sided | no | yes, the ring holds the unit circle |
| $\\lvert z\\rvert < 0.5$ | left-sided | no | no |

A causal system must have a region that is the outside of a circle, and a
stable one must have a region containing the unit circle. Here no region
does both, so no causal stable realisation of this H(z) exists — which is
the discrete restatement of "you cannot stabilise a right-half-plane pole by
choosing a different inverse transform". The pole at 2 has to move.

**The trap.** Declaring the system stable because "the ring contains the
unit circle" without checking causality, or unstable because "there is a
pole outside" without noticing that the middle region is a legitimate answer
for an off-line, non-real-time filter. Both halves of the question have to
be answered from the region, not from the pole list alone.`,
        examTip: 'On the FE exam the region is almost always the causal one, the outside of the largest pole circle, and the exam will say so with the words "causal" or "for n greater than or equal to zero". But when a question deliberately offers two candidate sequences for one expression, the region is the only thing that distinguishes them, and the answer is whichever sequence lives on the side of the pole circle that the stated region names.',
        importantNote: 'The region of convergence never contains a pole, and it is always bounded by circles through poles. A causal sequence therefore always has the exterior of a circle, and a stable one always has a region containing the unit circle. Causal AND stable together force every pole strictly inside the unit circle.',
      },
      {
        id: 'zt-pairs-derived',
        title: '6. The Standard Pairs, Derived Rather Than Memorised',
        content: `## 6.1 Everything from one geometric series

A table of transform pairs is faster to use than to derive, but a table you
have derived once is a table you can repair when memory fails mid-exam.
Every entry below comes from the geometric series of section 5 and two
manipulations of it.

**The impulse.** The sum has one surviving term:

$$Z\\{\\delta [n]\\} = \\sum _{n=-\\infty }^{\\infty }\\delta [n]z^{-n} = z^{0} = 1$$

converging for every z. The delayed impulse is just as quick:
$Z\\{\\delta [n-k]\\} = z^{-k}$, which converges everywhere except $z=0$ when
k is positive. That exception is the first hint that $z^{-1}$ deserves to be
read as "one sample of delay".

**The unit step.** Set $a = 1$ in the geometric result:

$$Z\\{u[n]\\} = \\sum _{n=0}^{\\infty }z^{-n} = \\frac{1}{1-z^{-1}} = \\frac{z}{z-1}, \\qquad \\lvert z\\rvert > 1$$

The pole sits ON the unit circle, which is the transform-domain way of
saying that a step neither decays nor grows.

**The ramp, from a derivative.** Differentiate the geometric result with
respect to a, treating z as a constant:

$$\\frac{d}{da}\\sum _{n=0}^{\\infty }a^{n}z^{-n} = \\sum _{n=0}^{\\infty }na^{n-1}z^{-n} = \\frac{d}{da}\\left(\\frac{1}{1-az^{-1}}\\right) = \\frac{z^{-1}}{(1-az^{-1})^{2}}$$

Multiply both sides by a to restore the exponent:

$$Z\\{na^{n}u[n]\\} = \\frac{az^{-1}}{(1-az^{-1})^{2}} = \\frac{az}{(z-a)^{2}}, \\qquad \\lvert z\\rvert > \\lvert a\\rvert$$

and setting $a=1$ gives the discrete ramp, $Z\\{nu[n]\\} = z/(z-1)^{2}$. The
repeated pole is the signature of a sequence that grows polynomially rather
than merely persisting.

**Sinusoids, from Euler.** A cosine is two complex exponentials, and each
one is a geometric sequence with a complex ratio:

$$\\cos (\\Omega _{0}n)u[n] = \\tfrac{1}{2}\\left(e^{j\\Omega _{0}n} + e^{-j\\Omega _{0}n}\\right)u[n]$$

$$Z\\{\\cos (\\Omega _{0}n)u[n]\\} = \\frac{1}{2}\\left[\\frac{z}{z-e^{j\\Omega _{0}}} + \\frac{z}{z-e^{-j\\Omega _{0}}}\\right] = \\frac{z(z-\\cos \\Omega _{0})}{z^{2}-2z\\cos \\Omega _{0}+1}$$

because the denominators multiply to
$z^{2}-z(e^{j\\Omega _{0}}+e^{-j\\Omega _{0}})+1$ and the numerators add to
$z(2z-2\\cos \\Omega _{0})$. The sine follows from the same two terms with a
minus sign and a division by $2j$:

$$Z\\{\\sin (\\Omega _{0}n)u[n]\\} = \\frac{z\\sin \\Omega _{0}}{z^{2}-2z\\cos \\Omega _{0}+1}, \\qquad \\lvert z\\rvert > 1$$

Both have their pole pair exactly on the unit circle at angle
$\\pm \\Omega _{0}$, which is the picture of an oscillation that neither dies
nor grows. Multiply the sequence by $r^{n}$ and the pair moves to radius r,
which is the discrete counterpart of the s-domain frequency shift.

**A finite pulse.** The sum simply stops:

$$Z\\{u[n]-u[n-N]\\} = \\sum _{n=0}^{N-1}z^{-n} = \\frac{1-z^{-N}}{1-z^{-1}} = \\frac{z^{N}-1}{z^{N-1}(z-1)}$$

with convergence for every $z \\ne 0$, because a finite sum cannot diverge.
The apparent pole at $z=1$ is cancelled by a zero: setting $z=1$ in the
original sum gives N, which is finite.

| $x[n]$ | $X(z)$ | ROC |
|---|---|---|
| $\\delta [n]$ | 1 | all z |
| $\\delta [n-k]$, $k>0$ | $z^{-k}$ | $\\lvert z\\rvert > 0$ |
| $u[n]$ | $z/(z-1)$ | $\\lvert z\\rvert > 1$ |
| $a^{n}u[n]$ | $z/(z-a)$ | $\\lvert z\\rvert > \\lvert a\\rvert$ |
| $-a^{n}u[-n-1]$ | $z/(z-a)$ | $\\lvert z\\rvert < \\lvert a\\rvert$ |
| $na^{n}u[n]$ | $az/(z-a)^{2}$ | $\\lvert z\\rvert > \\lvert a\\rvert$ |
| $nu[n]$ | $z/(z-1)^{2}$ | $\\lvert z\\rvert > 1$ |
| $\\cos (\\Omega _{0}n)u[n]$ | $z(z-\\cos \\Omega _{0})/(z^{2}-2z\\cos \\Omega _{0}+1)$ | $\\lvert z\\rvert > 1$ |
| $\\sin (\\Omega _{0}n)u[n]$ | $z\\sin \\Omega _{0}/(z^{2}-2z\\cos \\Omega _{0}+1)$ | $\\lvert z\\rvert > 1$ |
| $u[n]-u[n-N]$ | $(1-z^{-N})/(1-z^{-1})$ | $\\lvert z\\rvert > 0$ |

### Worked example 6.1 — a pair built from two table rows

**Given:** $x[n] = [4 - 3(0.5)^{n}]u[n]$. Find X(z) and its region.

Linearity splits it into a step and a geometric sequence:

$$X(z) = \\frac{4z}{z-1} - \\frac{3z}{z-0.5} = \\frac{4z(z-0.5) - 3z(z-1)}{(z-1)(z-0.5)} = \\frac{z^{2}+z}{(z-1)(z-0.5)}$$

after expanding the numerator to $4z^{2}-2z-3z^{2}+3z$. The region is the
intersection of $\\lvert z\\rvert > 1$ and $\\lvert z\\rvert > 0.5$, namely
$\\lvert z\\rvert > 1$: the outer pole always wins for a right-sided sum.

Check the first sample against the sum itself. Directly,
$x[0] = 4 - 3 = 1$. From the expression, dividing numerator and denominator
by $z^{2}$ and letting z grow without bound gives 1 as well. Two routes, one
answer.

### Worked example 6.2 — a finite sequence needs no table at all

**Given:** $x[n] = \\{2, 3, 1\\}$ for $n = 0, 1, 2$ and zero elsewhere. Find
X(z), and convolve it with $h[n] = \\{1, -1\\}$.

Reading the sum off the samples is the entire calculation:

$$X(z) = 2 + 3z^{-1} + z^{-2}, \\qquad H(z) = 1 - z^{-1}$$

$$Y(z) = X(z)H(z) = 2 + 3z^{-1} + z^{-2} - 2z^{-1} - 3z^{-2} - z^{-3} = 2 + z^{-1} - 2z^{-2} - z^{-3}$$

so $y[n] = \\{2, 1, -2, -1\\}$. Verify by direct convolution, which is the
independent route: $y[0] = 2$, then
$y[1] = 3 - 2 = 1$, then $y[2] = 1 - 3 = -2$, then $y[3] = -1$. Identical.

A last check costs nothing: $X(1) = 6$ and $H(1) = 0$, so $Y(1)$ must be 0,
and indeed the output samples sum to $2 + 1 - 2 - 1 = 0$. Evaluating a
transform at $z=1$ sums the sequence, which makes that a free consistency
test on any finite-length answer.

**The trap.** Writing the polynomial in powers of z rather than $z^{-1}$ and
losing the time origin. $2z^{2}+3z+1$ is the transform of the same three
numbers placed at $n = -2, -1, 0$, a sequence that is finished before yours
begins. The exponent on $z^{-1}$ IS the sample index; that is the whole
bookkeeping.`,
        examTip: 'Two rows carry most of the exam: the step and the geometric sequence. Everything else is one of them differentiated, shifted, or split by Euler. If a pair you need is missing from the handbook table, rebuild it from the geometric series rather than guessing, because a guessed pair usually differs by a factor of z, which shifts the whole answer by one sample.',
        importantNote: 'Watch the difference between z/(z-a) and 1/(z-a). The first is a^n u[n]; the second is z^(-1) times the first, so it is a^(n-1) u[n-1], one sample later and zero at n = 0. Nearly every "off by one sample" error in this topic is a missing or extra factor of z.',
      },
      {
        id: 'zt-properties',
        title: '7. Properties, and the Condition Each One Carries',
        content: `## 7.1 The properties that survive without conditions

Linearity and convolution are the load-bearing pair, and both are immediate
from the definition:

$$Z\\{\\alpha x_{1}[n] + \\beta x_{2}[n]\\} = \\alpha X_{1}(z) + \\beta X_{2}(z)$$

$$Z\\{x[n]*h[n]\\} = X(z)H(z)$$

Neither is quite condition-free, though. For both, the region of the result
contains AT LEAST the intersection of the two input regions, and can be
larger when a pole cancels against a zero. That footnote is not academic:
it is exactly what happens when a filter is designed to cancel an unwanted
pole, and the resulting system has a wider region — and better stability
properties — than the intersection rule alone would suggest.

Scaling in z is worth naming because it is the mechanism behind every
damped-sinusoid pair:

$$Z\\{a^{n}x[n]\\} = X(z/a)$$

with the region scaled by $\\lvert a\\rvert$. Multiplying a sequence by a
geometric envelope moves every pole radially by the factor a, which is why
$\\cos (\\Omega _{0}n)u[n]$ with poles on the unit circle becomes
$r^{n}\\cos (\\Omega _{0}n)u[n]$ with poles at radius r.

Differentiation in z produces the multiply-by-n property used in section 6:

$$Z\\{n\\,x[n]\\} = -z\\,\\frac{dX(z)}{dz}$$

## 7.2 Shifting, where the unilateral transform differs

For the bilateral transform a delay is a clean multiplication:

$$Z\\{x[n-k]\\} = z^{-k}X(z)$$

For the UNILATERAL transform, which is what difference equations with
initial conditions require, the samples that slide in from before $n=0$
cannot be ignored. Working from the definition,

$$Z_{u}\\{y[n-1]\\} = \\sum _{n=0}^{\\infty }y[n-1]z^{-n} = z^{-1}Y(z) + y[-1]$$

$$Z_{u}\\{y[n-2]\\} = z^{-2}Y(z) + z^{-1}y[-1] + y[-2]$$

Those extra terms are the discrete counterpart of the $f(0^{-})$ that
appears in the Laplace derivative rule, and they are the whole reason a
transform can solve a difference equation with a non-zero starting state
rather than merely a zero-state one. Set every initial condition to zero and
the extra terms vanish, which is why the transfer function $H(z) = Y(z)/X(z)$
is defined only under that assumption.

## 7.3 The value theorems, and when they lie

$$x[0] = \\lim _{z \\to \\infty }X(z) \\qquad \\text{valid when the sequence is causal}$$

$$\\lim _{n \\to \\infty }x[n] = \\lim _{z \\to 1}(z-1)X(z) \\qquad \\text{valid when every pole of } (z-1)X(z) \\text{ lies inside the unit circle}$$

The initial-value theorem is almost unconditional: for a causal sequence
every term but $x[0]$ carries a negative power of z and dies as z grows.
The final-value theorem is the dangerous one, for exactly the reason its
s-domain cousin is dangerous. It computes a limit whether or not one exists.

### Worked example 7.1 — the final-value theorem used correctly

**Given:** $X(z) = 0.4z/[(z-1)(z-0.6)]$. Find the limit of x[n].

Form $(z-1)X(z) = 0.4z/(z-0.6)$. Its only pole is at 0.6, safely inside the
unit circle, so the theorem applies:

$$\\lim _{n \\to \\infty }x[n] = \\frac{0.4(1)}{1-0.6} = 0.4/0.4 = 1$$

Confirm it by inverting. Expanding $X(z)/z$ gives residues
$0.4/(1-0.6) = 1$ at the pole $z=1$ and $0.4/(0.6-1) = -1$ at $z=0.6$, so
$x[n] = 1 - (0.6)^{n}$, which does indeed approach 1. Both routes agree, and
the second one also tells you how fast.

### Worked example 7.2 — the same theorem producing nonsense

**Given:** $X(z) = z/(z+1)$ and $X(z) = z/(z-1.25)$. Apply the theorem to
each and say what it means.

For the first, $(z-1)X(z) = z(z-1)/(z+1)$, which is 0 at $z=1$. The theorem
would report a limit of zero. But the sequence is $(-1)^{n}u[n]$, which
alternates between $+1$ and $-1$ forever and has no limit at all. The
failure is announced by the pole at $z=-1$, ON the unit circle.

For the second, $(z-1)X(z) = z(z-1)/(z-1.25)$, also 0 at $z=1$, and again
the theorem reports zero. The sequence is $(1.25)^{n}u[n]$, which grows
without bound. The failure is announced by the pole at 1.25, OUTSIDE the
unit circle.

Two confident, meaningless zeros. The pole check is not an optional
refinement; it is what separates a theorem from a coincidence.

| Property | Statement | Condition it carries |
|---|---|---|
| Linearity | $\\alpha X_{1}+\\beta X_{2}$ | region at least the intersection |
| Delay, bilateral | $z^{-k}X(z)$ | none beyond the original region |
| Delay, unilateral | $z^{-1}Y(z)+y[-1]$ | initial samples must be supplied |
| Scaling | $X(z/a)$ | region scales by $\\lvert a\\rvert$ |
| Convolution | $X(z)H(z)$ | region at least the intersection |
| Multiply by n | $-z\\,dX/dz$ | same region |
| Initial value | $\\lim _{z\\to \\infty }X(z)$ | sequence causal |
| Final value | $\\lim _{z\\to 1}(z-1)X(z)$ | poles of $(z-1)X(z)$ inside the circle |

### Worked example 7.3 — a delay read as hardware

**Given:** $H(z) = (1 + 0.5z^{-1} + 0.25z^{-2})/3$. Describe the filter and
find its DC gain and its gain at Nyquist.

Each $z^{-1}$ is one sample of delay, so this is a three-tap averager with
weights 1, 0.5 and 0.25 divided by three. It has no feedback and therefore
no poles away from the origin: a finite impulse response, guaranteed stable
whatever the coefficients are.

$$H(1) = (1+0.5+0.25)/3 = 1.75/3 = 0.583333$$

$$H(-1) = (1-0.5+0.25)/3 = 0.75/3 = 0.25$$

so it passes low frequencies about 2.3 times better than it passes the
fastest representable alternation, and its DC gain is not one — a detail
worth fixing by dividing by 1.75 instead of by 3 if unity DC gain was the
intent.

**The trap.** Calling this a three-pole filter because it has $z^{-2}$ in
it. Writing it over a common denominator gives
$(z^{2}+0.5z+0.25)/(3z^{2})$: the poles are both at the origin, which
contributes delay but no dynamics at all. Feed-forward terms make ZEROS.`,
        examTip: 'Before using the final-value theorem, multiply by (z − 1), cancel, and look at what poles remain. If any survivor sits on or outside the unit circle the theorem is void and the limit it prints is meaningless. This check takes five seconds and is itself a favourite exam question, usually phrased as "is the final value theorem applicable".',
        importantNote: 'The unilateral shift rule Z{y[n−1]} = z^(−1)Y(z) + y[−1] is what makes initial conditions solvable. Dropping the y[−1] term silently converts the problem into its zero-state version, which produces a plausible but wrong answer whenever the problem bothered to specify a starting value.',
      },
      {
        id: 'zt-inversion',
        title: '8. Inverting, With Every Answer Run Forward Through the Recursion',
        content: `## 8.1 The divide-by-z discipline, and why it exists

Every standard pair in section 6 has a factor of z in its numerator. Expand
X(z) itself in partial fractions and you get terms like $A/(z-a)$, whose
inverse is $a^{n-1}u[n-1]$ — correct but shifted, and a reliable source of
off-by-one errors. Expand $X(z)/z$ instead, then multiply each term by z,
and every term lands on a table row exactly:

$$\\frac{X(z)}{z} = \\frac{A}{z-a} + \\frac{B}{z-b} \\qquad \\Longrightarrow \\qquad X(z) = \\frac{Az}{z-a} + \\frac{Bz}{z-b} \\qquad \\Longrightarrow \\qquad x[n] = \\bigl(Aa^{n}+Bb^{n}\\bigr)u[n]$$

The residues come from the cover-up rule, $A = [(z-a)X(z)/z]$ evaluated at
$z=a$.

But the discipline that actually protects an answer is different and is the
one this section insists on: **turn the transfer function back into a
difference equation and run it forward**. A rational H(z) written in powers
of $z^{-1}$ IS a recursion, and generating the first few samples from it
costs three lines of arithmetic. If those samples do not match the closed
form you just derived, the closed form is wrong. Every inverse below is
checked that way.

### Worked example 8.1 — distinct real poles, audited sample by sample

**Given:** $H(z) = z^{2}/[(z-0.4)(z-0.9)]$. Find h[n] and verify it.

Divide by z and cover up:

$$\\frac{H(z)}{z} = \\frac{z}{(z-0.4)(z-0.9)}, \\qquad A = \\frac{0.4}{0.4-0.9} = 0.4/0.5 = -0.8, \\qquad B = \\frac{0.9}{0.9-0.4} = 0.9/0.5 = 1.8$$

$$h[n] = \\bigl[1.8(0.9)^{n} - 0.8(0.4)^{n}\\bigr]u[n]$$

Now the audit. Expand the denominator to $z^{2}-1.3z+0.36$ and divide top
and bottom by $z^{2}$:

$$H(z) = \\frac{1}{1-1.3z^{-1}+0.36z^{-2}} \\qquad \\Longleftrightarrow \\qquad h[n] = 1.3h[n-1] - 0.36h[n-2] + \\delta [n]$$

Starting from rest and stepping forward gives the left column below; the
closed form gives the right one.

| n | from the recursion | from $1.8(0.9)^{n}-0.8(0.4)^{n}$ |
|---|---|---|
| 0 | 1 | 1 |
| 1 | 1.3 | 1.3 |
| 2 | 1.33 | 1.33 |
| 3 | 1.261 | 1.261 |
| 4 | 1.1605 | 1.1605 |
| 5 | 1.05409 | 1.05409 |

Identical to every digit, over fourteen samples in the machine check behind
this chapter. Note also that $h[0] = 1.8 - 0.8 = 1$, which it had to be:
the numerator and denominator have equal degree, so the very first sample is
the ratio of their leading coefficients.

**The trap.** Expanding H(z) rather than $H(z)/z$ gives residues
$-2$ and $1.8/0.9$, and an answer that is right in shape but one sample
late, so that $h[0]$ comes out as 0 instead of 1. The recursion catches it
on the first line.

### Worked example 8.2 — a repeated pole

**Given:** $X(z) = z/(z-0.5)^{2}$. Find x[n] and verify it.

This is the $na^{n}$ row with $a = 0.5$, whose transform is
$0.5z/(z-0.5)^{2}$. The given expression is twice that:

$$X(z) = \\frac{1}{0.5}\\cdot \\frac{0.5z}{(z-0.5)^{2}} \\qquad \\Longrightarrow \\qquad x[n] = 2n(0.5)^{n}u[n]$$

For the audit, write the expression in negative powers:

$$X(z) = \\frac{z^{-1}}{1-z^{-1}+0.25z^{-2}} \\qquad \\Longleftrightarrow \\qquad y[n] = y[n-1] - 0.25y[n-2] + \\delta [n-1]$$

| n | from the recursion | from $2n(0.5)^{n}$ |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 1 | 1 |
| 2 | 1 | 1 |
| 3 | 0.75 | 0.75 |
| 4 | 0.5 | 0.5 |
| 5 | 0.3125 | 0.3125 |

The sequence rises, holds, then decays, which is the discrete signature of a
double pole: polynomial growth fighting geometric decay, with the decay
winning eventually because $\\lvert 0.5\\rvert < 1$. Had the double pole been
on the unit circle, the n would win and the sequence would grow without
bound — which is why a repeated pole at $z=1$ is unstable even though
$\\lvert z\\rvert = 1$ looks marginal.

### Worked example 8.3 — a complex conjugate pair

**Given:** $H(z) = z^{2}/(z^{2}-1.2z+0.72)$. Find h[n] and verify it.

The roots are $0.6 \\pm j0.6$, so the pole radius and angle are

$$r = \\sqrt{0.72} = 0.8485281, \\qquad \\theta = \\arctan (0.6/0.6) = 45^\\circ = \\pi /4$$

Rather than carrying complex residues to the end, use the standard result
that a conjugate pair produces $r^{n}$ times a sinusoid at angle $\\theta$
with some amplitude and phase. Computing the residue at $0.6+j0.6$ gives
$0.5 - j0.5$, whose magnitude is $1/\\sqrt{2}$ and whose angle is
$-\\pi /4$, so

$$h[n] = 2\\lvert A\\rvert \\,r^{n}\\cos (n\\theta + \\angle A) = \\sqrt{2}\\,(0.8485281)^{n}\\cos \\!\\left(\\frac{(n-1)\\pi }{4}\\right)$$

| n | from the recursion | from the closed form |
|---|---|---|
| 0 | 1 | 1 |
| 1 | 1.2 | 1.2 |
| 2 | 0.72 | 0.72 |
| 3 | 0 | 0 |
| 4 | −0.5184 | −0.5184 |
| 5 | −0.62208 | −0.62208 |
| 6 | −0.373248 | −0.373248 |
| 7 | 0 | 0 |

The recursion here is $h[n] = 1.2h[n-1] - 0.72h[n-2] + \\delta [n]$, and the
two columns match to machine precision over twenty-six samples. The exact
zeros at $n=3$ and $n=7$ are the cosine passing through its nodes: with
$\\theta = \\pi /4$ the pattern repeats every eight samples, and the envelope
shrinks by the factor 0.8485281 each step.

The shortcut worth keeping: for a monic quadratic $z^{2}+bz+c$ with complex
roots, the product of the roots is c and the product of a conjugate pair is
the squared magnitude, so $r = \\sqrt{c}$ with no root-finding at all. Here
$\\sqrt{0.72} = 0.8485281 < 1$, so the filter is stable. Confirm the roots
really are complex first, by checking $b^{2} < 4c$: here
$1.44 < 2.88$, so they are.

![The impulse response of the second-order recursion, with the closed form drawn as a curve, the sample-by-sample recursion values plotted as markers on top of it, and the geometric envelope shown as a dashed pair.](/courses/fe-ee/figures/lin3-zt-recursion-audit.svg)

### Worked example 8.4 — long division, and a numerator that matters

**Given:** $H(z) = (1+0.5z^{-1})/(1-0.8z^{-1}+0.15z^{-2})$. Find the first
five impulse-response samples by long division, then find the closed form
and check the two against each other.

Long division of the numerator by the denominator, keeping powers of
$z^{-1}$, produces the impulse response directly, because the quotient
coefficients ARE the samples. Equivalently, read the recursion off the
expression:

$$h[n] = 0.8h[n-1] - 0.15h[n-2] + \\delta [n] + 0.5\\delta [n-1]$$

giving $h[0] = 1$, then $0.8 + 0.5 = 1.3$, then
$1.04 - 0.15 = 0.89$, then $0.712 - 0.195 = 0.517$, then
$0.4136 - 0.1335 = 0.2801$.

For the closed form, put the expression over z. The poles solve
$z^{2}-0.8z+0.15 = 0$, giving $z = 0.5$ and $z = 0.3$, so

$$\\frac{H(z)}{z} = \\frac{z+0.5}{(z-0.5)(z-0.3)}, \\qquad A = \\frac{1.0}{0.2} = 1/0.2 = 5, \\qquad B = \\frac{0.8}{-0.2} = -4$$

$$h[n] = \\bigl[5(0.5)^{n} - 4(0.3)^{n}\\bigr]u[n]$$

Evaluate it: $5 - 4 = 1$, then $2.5 - 1.2 = 1.3$, then
$1.25 - 0.36 = 0.89$, then $0.625 - 0.108 = 0.517$, then
$0.3125 - 0.0324 = 0.2801$. Five for five against the division.

Long division cannot give the general term, so it is the wrong tool for
"find h[n]". It is the right tool for "what is the third output sample",
where it beats a full expansion by a wide margin, and it is always available
as an independent audit of a closed form obtained the longer way.

**The trap.** Ignoring the numerator's $0.5z^{-1}$ and treating the filter
as though it had only feedback. That gives $h[1] = 0.8$ instead of 1.3 and
every later sample wrong. Feed-forward terms contribute to the output from
the moment their delay elapses.`,
        examTip: 'Whatever route you take to an inverse transform, spend thirty seconds turning H(z) back into a difference equation and generating h[0], h[1] and h[2]. Those three numbers catch a missing factor of z, a dropped numerator term and a sign error in a residue, which between them account for most lost marks in this topic.',
        importantNote: 'Always expand X(z)/z, not X(z). Every table row has a z in its numerator, so dividing first and multiplying back afterwards is what makes each partial-fraction term match a row exactly. Expanding X(z) directly produces answers that are correct in shape but shifted one sample late.',
      },
      {
        id: 'zt-s-to-z-bridge',
        title: '9. The Bridge z = exp(sT), and What It Distorts',
        content: `## 9.1 Where the mapping comes from

Sample a continuous signal every T seconds. A continuous mode $e^{st}$
becomes, at the sampling instants,

$$e^{s(nT)} = \\left(e^{sT}\\right)^{n} = z^{n} \\qquad \\text{with} \\qquad z = e^{sT}$$

so a continuous exponential mode turns into a discrete geometric mode whose
ratio is $e^{sT}$. That single substitution carries every structural fact
between the two domains, and splitting s into its real and imaginary parts
shows exactly what it does:

$$z = e^{(\\sigma + j\\omega )T} = e^{\\sigma T}\\,e^{j\\omega T} \\qquad \\Longrightarrow \\qquad \\lvert z\\rvert = e^{\\sigma T}, \\qquad \\angle z = \\omega T$$

The real part of s sets the RADIUS and the imaginary part sets the ANGLE.
Everything else follows.

| s-plane feature | maps to | because |
|---|---|---|
| $\\sigma < 0$, the left half-plane | $\\lvert z\\rvert < 1$, inside the circle | $e^{\\sigma T} < 1$ when $\\sigma$ is negative |
| $\\sigma = 0$, the imaginary axis | $\\lvert z\\rvert = 1$, the circle itself | $e^{0} = 1$ |
| $\\sigma > 0$, the right half-plane | $\\lvert z\\rvert > 1$, outside | $e^{\\sigma T} > 1$ |
| the origin, $s = 0$ | $z = 1$ | DC in both domains |
| a line of constant $\\sigma$ | a circle of radius $e^{\\sigma T}$ | radius depends on $\\sigma$ alone |
| a line of constant $\\omega$ | a ray at angle $\\omega T$ | angle depends on $\\omega$ alone |

The first row is the whole stability story: "all poles in the left
half-plane" and "all poles inside the unit circle" are the same sentence
spoken in two coordinate systems.

![The s-plane with its shaded left half and several marked points, beside the z-plane with the corresponding shaded unit disc and the image of each point under the exponential map for a one-millisecond sampling period.](/courses/fe-ee/figures/lin3-zt-splane-zplane.svg)

## 9.2 The map is many-to-one, and that is aliasing

The exponential is periodic in the imaginary direction with period
$2\\pi j/T$. Two s-values separated by that amount have the SAME image:

$$e^{(s + j2\\pi /T)T} = e^{sT}e^{j2\\pi } = e^{sT}$$

and $2\\pi /T$ is exactly $2\\pi f_{s}$, the sampling frequency in radians per
second. So the entire s-plane wraps repeatedly onto the z-plane, and only
the horizontal strip $-\\pi /T < \\omega \\le \\pi /T$ — the band from minus
Nyquist to plus Nyquist — maps one-to-one. This is aliasing, stated as
geometry rather than as a picture of overlapping spectra: distinct
continuous frequencies land on one discrete frequency because the map that
takes them there is periodic.

### Worked example 9.1 — poles carried across, and a collision

**Given:** $T = 1$ ms. Map the continuous poles $s = -200$ and
$s = -100 \\pm j600$ into the z-plane, and find another continuous pole with
the same image as the second.

For the real pole, $\\sigma T = -0.2$ and $\\omega T = 0$:

$$z = e^{-0.2} = 0.8187308$$

a real pole inside the unit circle, as a decaying real mode must be. For the
complex pair, $\\sigma T = -0.1$ and $\\omega T = 0.6$ radians:

$$\\lvert z\\rvert = e^{-0.1} = 0.9048374, \\qquad \\angle z = 0.6 \\ \\mathrm{rad} = 34.377468^\\circ$$

$$z = 0.9048374 \\times 0.8253356 = 0.7467945 \\quad \\text{real part}, \\qquad 0.9048374 \\times 0.5646425 = 0.5109097 \\quad \\text{imaginary part}$$

Now the collision. Adding one sampling frequency to the imaginary part,
$2\\pi /T = 6283.1853$ rad/s, gives
$600 + 6283.1853 = 6883.1853$ rad/s, and the pole
$s = -100 + j6883.1853$ maps to precisely the same z. A 6883 rad/s
oscillation and a 600 rad/s oscillation are indistinguishable once sampled
at 1 kHz, and the z-plane cannot tell you which one you meant because it has
lost the information.

**The trap.** Assuming the map preserves distances or angles. It does not:
it is exponential, so a pole twice as far into the left half-plane has a
radius that is the SQUARE, not the half. Here $\\sigma = -200$ gives 0.8187
while $\\sigma = -100$ gives 0.9048, and $0.9048^{2} = 0.8187$ exactly. Any
intuition transported linearly from the s-plane will misjudge how much
damping a given pole radius represents.

### Worked example 9.2 — a sampled exponential IS a geometric sequence

**Given:** $x(t) = e^{-\\alpha t}u(t)$ with $\\alpha = 200$ per second,
sampled at $T = 1$ ms. Write the sequence and its transform.

$$x[n] = e^{-\\alpha nT} = \\left(e^{-\\alpha T}\\right)^{n} = (0.8187308)^{n}$$

so the samples of a decaying exponential form the geometric sequence with
ratio $a = e^{-\\alpha T}$, and from the table

$$X(z) = \\frac{z}{z-0.8187308}, \\qquad \\lvert z\\rvert > 0.8187308$$

The continuous time constant is $1/\\alpha = 5$ ms, which is five samples,
and the discrete rule of thumb $1/(1-a)$ gives
$1/0.1812692 = 5.5167$ samples — close, and closer still as T shrinks
relative to the time constant. The two are different quantities that
converge, not the same quantity written twice.

**A symbol warning that costs marks.** The continuous decay rate and the
discrete pole radius are DIFFERENT numbers linked by an exponential. Writing
both as "a" invites the nonsense equation $a = e^{-aT}$. Keep
$\\alpha$ for the continuous rate and a for the pole, as above.

## 9.3 What the bridge does not carry

The mapping is exact for poles and for stability, and it is NOT exact for
frequency response. Sampling a continuous filter's poles reproduces its
modes but not its gain at every frequency, because the response of the
discrete system folds all the aliases together. That is the subject of the
next section, where the same specification is met two ways and the
difference is measured rather than asserted.`,
        examTip: 'When a question maps poles between domains, split s into sigma and omega first and handle radius and angle separately: radius is exp(sigma T) and angle is omega T in radians per sample. Doing the complex exponential in one step invites calculator-mode errors, and the split also makes the stability answer immediate.',
        importantNote: 'z = exp(sT) is many-to-one. Every s that differs by an integer multiple of j2pi/T lands on the same z, which is aliasing expressed as geometry. Only the strip from minus Nyquist to plus Nyquist maps one-to-one, and information outside it is not recoverable from the samples.',
      },
      {
        id: 'zt-difference-and-design',
        title: '10. Difference Equations with Initial Conditions, and a Filter Built to Spec',
        content: `## 10.1 Solving with a starting state

A difference equation with a non-zero initial condition needs the unilateral
shift rule from section 7, because the sample sitting in the delay register
at switch-on is part of the problem.

### Worked example 10.1 — a smoother that is not starting from rest

**Given:** $y[n] = 0.6y[n-1] + x[n]$ with $x[n] = u[n]$ and $y[-1] = 5$.
Find y[n] in closed form, split it into its two natural parts, and verify.

Transform both sides, using
$Z_{u}\\{y[n-1]\\} = z^{-1}Y(z) + y[-1]$:

$$Y(z) - 0.6\\bigl[z^{-1}Y(z) + 5\\bigr] = \\frac{z}{z-1}$$

$$Y(z)\\left(1 - 0.6z^{-1}\\right) = \\frac{z}{z-1} + 3 \\qquad \\Longrightarrow \\qquad Y(z) = \\frac{4z^{2}-3z}{(z-1)(z-0.6)}$$

after multiplying through by $z/(z-0.6)$ and combining over a common
denominator. Divide by z and cover up:

$$\\frac{Y(z)}{z} = \\frac{4z-3}{(z-1)(z-0.6)}, \\qquad A = \\frac{4-3}{1-0.6} = 1/0.4 = 2.5, \\qquad B = \\frac{2.4-3}{0.6-1} = 0.6/0.4 = 1.5$$

$$y[n] = \\bigl[2.5 + 1.5(0.6)^{n}\\bigr]u[n]$$

Audit it by running the recursion forward from the stated initial condition:
$y[0] = 0.6(5) + 1 = 4$, and the closed form gives
$2.5 + 1.5 = 4$. Then $y[1] = 0.6(4) + 1 = 3.4$ against
$2.5 + 0.9 = 3.4$. The full comparison:

| n | recursion from $y[-1]=5$ | $2.5+1.5(0.6)^{n}$ |
|---|---|---|
| 0 | 4 | 4 |
| 1 | 3.4 | 3.4 |
| 2 | 3.04 | 3.04 |
| 3 | 2.824 | 2.824 |
| 4 | 2.6944 | 2.6944 |

The decomposition is worth naming because exam questions ask for it by name.
The **zero-input response** is what the initial condition alone produces,
$3(0.6)^{n}$, obtained by setting the input to zero. The **zero-state
response** is what the step alone produces starting from rest,
$2.5 - 1.5(0.6)^{n}$. Their sum is
$2.5 + 1.5(0.6)^{n}$, which is the total — the superposition property of a
linear system applied to its two causes.

Both settle at 2.5, and that number is available without any of this work:
it is the DC gain $H(1) = 1/(1-0.6) = 1/0.4 = 2.5$. The initial condition
changes the journey and not the destination, because the pole at 0.6 is
inside the unit circle and its contribution dies.

![The total response run forward from the stated initial condition, together with the zero-input and zero-state components that add to it, all three approaching the same steady value.](/courses/fe-ee/figures/lin3-zt-initial-condition.svg)

**The trap.** Dropping the $y[-1]$ term from the shift rule. That gives the
zero-state answer $2.5 - 1.5(0.6)^{n}$, which starts at 1 instead of 4 —
plausible, monotone, and wrong by a factor of four on the first sample.

## 10.2 The same specification, met two ways and measured

Design is the point where every idea in this chapter has to produce a
number. Take a concrete brief: a first-order digital low-pass, half-power at
100 Hz, running at $f_{s} = 1000$ Hz. The digital frequency corresponding to
the specification is

$$\\Omega _{c} = \\frac{2\\pi f_{c}}{f_{s}} = 0.6283185 \\ \\mathrm{rad/sample}$$

### Worked example 10.2 — designing by matching the pole

**Given:** the brief above. Place the discrete pole at the image of the
analogue pole under $z = e^{sT}$ and measure what you get.

The analogue filter $\\omega _{c}/(s+\\omega _{c})$ has its pole at
$s = -2\\pi (100)$, so

$$a = e^{-2\\pi (100)(0.001)} = e^{-0.6283185} = 0.5334881, \\qquad H(z) = \\frac{K}{1-az^{-1}}$$

Choose K for unity gain at DC, where $z=1$:
$K = 1 - 0.5334881 = 0.4665119$.

Now MEASURE the result at the specification frequency by evaluating on the
unit circle, which is the only honest test of whether the brief was met.
With $\\cos \\Omega _{c} = 0.8090170$ and
$\\sin \\Omega _{c} = 0.5877853$:

$$0.5334881 \\times 0.8090170 = 0.4316009, \\qquad 1 - 0.4316009 = 0.5683991$$

$$0.3230775 + 0.0983302 = 0.4214077 \\qquad \\Longrightarrow \\qquad \\lvert 1-ae^{-j\\Omega _{c}}\\rvert = \\sqrt{0.4214077} = 0.6491592$$

$$\\lvert H(e^{j\\Omega _{c}})\\rvert = 0.4665119/0.6491592 = 0.7186402 \\qquad \\Longrightarrow \\qquad 20\\log _{10}(0.7186402) = -2.8698 \\ \\mathrm{dB}$$

Not $-3.0103$ dB. The design is 0.14 dB shy of its own specification, and
solving for where the magnitude really reaches 0.7071068 puts the true
corner at 103.4654 Hz, some 3.47 percent high. Pole matching reproduces the
analogue MODE exactly and the analogue frequency response only
approximately, and the discrepancy grows as the corner approaches Nyquist.

### Worked example 10.3 — designing by the bilinear transform

**Given:** the same brief. Use $s = (2/T)(1-z^{-1})/(1+z^{-1})$ with the
corner prewarped, and measure again.

The bilinear substitution compresses the whole infinite $j\\omega$ axis onto
the unit circle, which is why it can never produce aliasing and why it bends
the frequency scale. Undo the bend at the one frequency that matters by
prewarping:

$$\\omega _{a} = \\frac{2}{T}\\tan \\frac{\\Omega _{c}}{2} = 2000 \\times 0.3249197 = 649.8394 \\ \\mathrm{rad/s}$$

against the unwarped 628.3185 rad/s. Substituting into
$\\omega _{a}/(s+\\omega _{a})$ and collecting powers of $z^{-1}$:

$$b_{0} = \\frac{\\omega _{a}}{2/T + \\omega _{a}} = 649.8394/2649.8394 = 0.2452373, \\qquad a_{1} = \\frac{2/T - \\omega _{a}}{2/T + \\omega _{a}} = 1350.1606/2649.8394 = 0.5095254$$

$$H(z) = \\frac{0.2452373\\left(1+z^{-1}\\right)}{1 - 0.5095254z^{-1}}$$

Measure it. At DC the numerator is $2b_{0} = 0.4904746$ and the denominator
is $1-a_{1} = 0.4904746$, so the gain is exactly 1. At the specification
frequency the magnitude comes out as 0.7071068 to ten decimal places, that
is $-3.0103$ dB exactly: the brief is met, not approached. The price is a
zero forced onto $z = -1$, so the response is exactly zero at Nyquist rather
than merely small — usually a bonus for an anti-alias role and a nuisance if
the response near Nyquist mattered.

![Magnitude responses of the two designs against frequency, with a second panel zoomed to half a decibel around the specification point showing the pole-matched design falling short and the prewarped bilinear design landing exactly on it.](/courses/fe-ee/figures/lin3-zt-design-measure.svg)

### Worked example 10.4 — a notch placed on the circle

**Given:** reject 60 Hz at $f_{s} = 600$ Hz. Place zeros ON the unit circle
at the offending angle and poles just inside at the same angle, with radius
0.95, then measure the null and the width.

The digital frequency is
$\\Omega _{0} = 2\\pi (60)/600 = 0.6283185$ rad/sample, which is
$36^\\circ$ of one lap, and $\\cos \\Omega _{0} = 0.8090170$. Zeros at
$e^{\\pm j\\Omega _{0}}$ and poles at $0.95e^{\\pm j\\Omega _{0}}$ give

$$H(z) = G\\,\\frac{z^{2} - 1.6180340z + 1}{z^{2} - 1.5371323z + 0.9025}$$

using $2\\cos \\Omega _{0} = 1.6180340$ and
$2(0.95)(0.8090170) = 1.5371323$ and $0.95^{2} = 0.9025$. Setting the DC
gain to one fixes G. At $z=1$ the numerator is
$1 - 1.6180340 + 1 = 0.3819660$ and the denominator is
$1 - 1.5371323 + 0.9025 = 0.3653677$, whose ratio is
$0.381966/0.3653677 = 1.045429$, so
$G = 1/1.045429 = 0.956545$.

Measured on the unit circle, the magnitude at 60 Hz is zero to machine
precision, because the zero sits exactly there. The half-power edges come
out at 55.157 Hz and 64.841 Hz, a width of
$64.841 - 55.157 = 9.684$ Hz, and the gain at Nyquist is 1.0062 — so the
filter is essentially transparent everywhere except in a ten-hertz
neighbourhood of the interference it was built to remove.

![Magnitude of the notch filter against frequency, showing unity gain across most of the band, an exact null at sixty hertz, and the two measured half-power edges either side of it.](/courses/fe-ee/figures/lin3-zt-notch.svg)

![Pole-zero map of the notch: a conjugate zero pair on the unit circle at thirty-six degrees with a conjugate pole pair at the same angle just inside, at radius 0.95.](/courses/fe-ee/figures/lin3-zt-notch-polezero.svg)

**The trap.** Pushing the pole radius to 0.999 to make the notch narrower
without noticing what it does to the transient. The pole radius sets the
decay per sample, so $r = 0.999$ rings for thousands of samples after any
disturbance. Notch width and settling time are the same knob viewed from two
ends, and a specification that demands both a very narrow notch and a fast
recovery is asking for a contradiction.`,
        examTip: 'A digital-filter question that gives a sampling rate and a corner frequency is asking you to work in radians per SAMPLE: convert with Omega = 2 pi f / fs before anything else. Then DC is z = 1, Nyquist is z = -1, and every magnitude is found by evaluating H at exp(jOmega), which is a two-line complex calculation rather than a plotting exercise.',
        importantNote: 'Matching poles through z = exp(sT) reproduces the continuous MODE exactly but misses the frequency specification, here by 3.47 percent. The bilinear transform with a prewarped corner hits the frequency exactly but distorts the rest of the scale and forces a zero onto Nyquist. Neither is simply better; the exam expects you to know which property each one preserves.',
      },
      {
        id: 'zt-problem-set-a',
        title: '11. Problem Set A — Transforms, Regions and Inversion',
        content: `Attempt each before reading on. Every solution ends by naming the wrong
route a careless reader takes and the specific number it lands on.

**A1.** Find X(z) and its region for $x[n] = 3(0.4)^{n}u[n] + 2u[n]$.

**A2.** Invert $X(z) = z/[(z-0.2)(z-0.6)]$ for a causal sequence, and check
the first two samples.

**A3.** A system obeys $y[n] = 0.5y[n-1] + 2x[n] - x[n-1]$. Find H(z), its
pole and zero, its DC gain and its gain at Nyquist.

**A4.** Is $y[n] = 1.6y[n-1] - 0.68y[n-2] + x[n]$ stable? Give the pole
magnitude without solving a quadratic if you can.

**A5.** For $X(z) = 2z/(z-0.9)$, state whether the final-value theorem
applies and, if so, the limit.

**A6.** A sequence has $X(z) = 1 + 2z^{-1} + 3z^{-2} + 2z^{-3}$. Find x[n],
the sum of all its samples, and its region.

---

### Worked solutions, Problem Set A

**A1.** Two table rows added:

$$X(z) = \\frac{3z}{z-0.4} + \\frac{2z}{z-1} = \\frac{3z(z-1) + 2z(z-0.4)}{(z-0.4)(z-1)} = \\frac{5z^{2}-3.8z}{(z-0.4)(z-1)}$$

since the numerator expands to $3z^{2}-3z+2z^{2}-0.8z$. The region is the
intersection of $\\lvert z\\rvert > 0.4$ and $\\lvert z\\rvert > 1$, which is
$\\lvert z\\rvert > 1$.

*Trap:* quoting the region as $\\lvert z\\rvert > 0.4$ because 0.4 appears
first. For a right-sided sum the region is outside the LARGEST pole radius;
the smaller pole imposes no constraint that the larger one has not already
imposed.

**A2.** Divide by z first:

$$\\frac{X(z)}{z} = \\frac{1}{(z-0.2)(z-0.6)}, \\qquad A = \\frac{1}{0.2-0.6} = -2.5, \\qquad B = \\frac{1}{0.6-0.2} = 2.5$$

$$x[n] = \\bigl[2.5(0.6)^{n} - 2.5(0.2)^{n}\\bigr]u[n]$$

Check: $x[0] = 2.5 - 2.5 = 0$, which is right because the numerator degree
is one below the denominator degree, so the sequence starts at zero. Then
$x[1] = 1.5 - 0.5 = 1$. From the recursion
$x[n] = 0.8x[n-1] - 0.12x[n-2] + \\delta [n-1]$ the same two values appear.

*Trap:* expanding X(z) instead of $X(z)/z$, which produces
$x[n] = 2.5(0.6)^{n-1} - 2.5(0.2)^{n-1}$ starting at $n=1$ — the same
numbers one sample late, so $x[1]$ becomes 0 and $x[2]$ becomes 1.

**A3.** Transform with zero initial conditions:

$$H(z) = \\frac{2 - z^{-1}}{1 - 0.5z^{-1}} = \\frac{2z-1}{z-0.5}$$

The pole is at 0.5. The zero solves $2z-1=0$, so it sits at 0.5 as well.
Writing the numerator as $2(z-0.5)$ makes the cancellation explicit and
leaves $H(z) = 2$: a pure gain of two, with impulse response
$2\\delta [n]$. The DC gain is 2 and the Nyquist gain is 2, because a
constant has no frequency dependence at all.

*Trap:* reporting a first-order low-pass with a corner set by the pole at
0.5. The cancellation is exact here, and missing it produces a frequency
response that varies with frequency when the true one does not. Always
factor the numerator before describing a filter.

**A4.** The characteristic polynomial is $z^{2}-1.6z+0.68$. The
discriminant is $1.6^{2}-4(0.68) = 2.56 - 2.72 = -0.16$, which is negative,
so the roots are a conjugate pair. For a monic quadratic with complex roots
the constant term is the squared magnitude:

$$\\lvert p\\rvert = \\sqrt{0.68} = 0.824621 < 1$$

so the system is stable, ringing with an envelope that shrinks by 0.824621
per sample.

*Trap:* comparing the coefficients 1.6 and 0.68 to one and declaring
instability because 1.6 exceeds it. The coefficients are not the poles. Here
$1.6 = 2r\\cos \\theta$ with $r = 0.824621$, which requires
$\\cos \\theta = 0.970143$, an angle of about $14^\\circ$ — a slow, lightly
damped ring, but a stable one.

**A5.** Form $(z-1)X(z) = 2z(z-1)/(z-0.9)$. The surviving pole is at 0.9,
inside the unit circle, so the theorem applies and gives

$$\\lim _{z \\to 1}\\frac{2z(z-1)}{z-0.9} = \\frac{2(1)(0)}{0.1} = 0$$

Confirm by inspection: $x[n] = 2(0.9)^{n}u[n]$, which does decay to zero.

*Trap:* evaluating $X(1) = 2/0.1 = 20$ and calling that the final value.
$X(1)$ is the SUM of the sequence, not its limit; here the sum really is 20
while the limit really is 0, and the two are different questions.

**A6.** The exponents are the sample indices, so
$x[n] = \\{1, 2, 3, 2\\}$ at $n = 0,1,2,3$ and zero elsewhere. The sum of the
samples is $X(1) = 1 + 2 + 3 + 2 = 8$. A finite-length causal sequence
converges for every z except the origin, so the region is
$\\lvert z\\rvert > 0$.

*Trap:* claiming three poles at the origin makes the system unstable. Poles
at the origin are pure delay; a finite impulse response is stable for any
coefficients whatsoever, which is the main reason it is chosen when
stability must be guaranteed by construction.`,
        examTip: 'Two habits solve most of this set: divide by z before expanding, and factor the numerator before describing a filter. The first prevents the one-sample shift, the second catches pole-zero cancellations that turn an apparently dynamic system into a constant.',
      },
      {
        id: 'zt-problem-set-b',
        title: '12. Practice Problems B — Mapping, Design and Stability',
        content: `**B1.** A continuous pole sits at $s = -50$ per second and the sampler runs
at 200 Hz. Find the discrete pole and the number of samples per continuous
time constant.

**B2.** A discrete system has poles at $0.8e^{\\pm j\\pi /3}$. Find the
difference equation, state the stability verdict, and find the oscillation
period in samples.

**B3.** Design a first-order low-pass by pole matching for a corner of
50 Hz at $f_{s} = 500$ Hz, with unity DC gain. Give a and K.

**B4.** For the two-point moving average $y[n] = (x[n]+x[n-1])/2$, find the
magnitude at $\\Omega = \\pi /3$ and explain the null at Nyquist.

**B5.** A filter is specified as $H(z) = (z-1)/(z-0.5)$. Classify it and
give its gains at DC and at Nyquist.

**B6.** Solve $y[n] = 0.5y[n-1] + \\delta [n]$ with $y[-1] = 8$, and say
which part of the answer the transfer function does not describe.

---

### Worked solutions, Problem Set B

**B1.** $T = 1/200 = 0.005$ s, so $\\sigma T = -50 \\times 0.005 = -0.25$ and

$$z = e^{-0.25} = 0.778801$$

The continuous time constant is $1/50 = 0.02$ s, which is
$0.02/0.005 = 4$ samples. Sanity check on the pole: after four samples the
discrete mode has fallen to $0.778801^{4} = 0.367879$, which is
$1/e$ — exactly what one time constant means.

*Trap:* computing the pole as $1 - \\sigma T = 1.25$, the first term of the
exponential series with a sign slip, and concluding the system is unstable.
The map is exponential, not linear.

**B2.** Poles at radius 0.8 and angle $\\pi /3$ give the monic quadratic

$$z^{2} - 2(0.8)\\cos (\\pi /3)z + 0.8^{2} = z^{2} - 0.8z + 0.64$$

since $2(0.8)(0.5) = 0.8$. The difference equation is therefore
$y[n] = 0.8y[n-1] - 0.64y[n-2] + x[n]$. The pole magnitude 0.8 is below one,
so the system is stable. The angle $\\pi /3$ radians per sample means one
full cycle takes $2\\pi /(\\pi /3) = 6$ samples.

*Trap:* reading the period as $\\pi /3$ samples, or as three. The angle is
radians PER SAMPLE, so the period is $2\\pi$ divided by it.

**B3.** $T = 1/500 = 0.002$ s and $\\omega _{c} = 2\\pi (50)$, so

$$a = e^{-2\\pi (50)(0.002)} = e^{-0.6283185} = 0.5334881, \\qquad K = 1 - 0.5334881 = 0.4665119$$

Identical to the worked design in section 10, and for a reason worth
noticing: the ratio $f_{c}/f_{s}$ is 0.1 in both cases, and the discrete
design depends on nothing else. Halving both the corner and the sampling
rate leaves the filter unchanged.

*Trap:* using $f_{c}$ in hertz directly in the exponent, giving
$e^{-50 \\times 0.002} = e^{-0.1} = 0.904837$, a pole so close to the circle
that its effective time constant, $1/(1-a)$, is 10.5 samples instead of the
intended 2.14 — nearly five times too slow. The exponent needs radians per second.

**B4.** With $H(z) = (1+z^{-1})/2$, evaluate on the circle:

$$\\lvert H(e^{j\\Omega })\\rvert = \\left\\lvert \\frac{1+e^{-j\\Omega }}{2}\\right\\rvert = \\cos \\frac{\\Omega }{2}$$

At $\\Omega = \\pi /3$ that is $\\cos (\\pi /6) = 0.866025$. At
$\\Omega = \\pi$, the Nyquist frequency, it is $\\cos (\\pi /2) = 0$ exactly.
The mechanical reason is the more memorable one: the fastest sequence a
sampler can represent alternates $+1, -1, +1, \\dots$, and the average of any
two neighbouring samples of it is zero. A frequency-domain zero is a
time-domain cancellation.

*Trap:* reporting 0.5 at $\\Omega = \\pi /3$ by averaging the magnitudes of
the two taps rather than adding them as phasors. The taps are separated by
one sample of delay, so they add with a phase difference, and only at DC do
they add in step.

**B5.** One zero at $z=1$ and one pole at 0.5, so this is a high-pass: it
kills DC exactly and passes fast changes.

$$H(1) = 0/0.5 = 0, \\qquad H(-1) = \\frac{-2}{-1.5} = 2/1.5 = 1.333333$$

*Trap:* calling it a low-pass because the pole is inside the circle near the
origin-side of the axis. Pole position sets the decay; the ZERO at $z=1$ is
what sets the DC behaviour, and a zero at $z=1$ always means zero DC gain.

**B6.** Transform with the unilateral shift rule:

$$Y(z) - 0.5\\bigl[z^{-1}Y(z) + 8\\bigr] = 1 \\qquad \\Longrightarrow \\qquad Y(z)\\left(1-0.5z^{-1}\\right) = 5$$

since $1 + 0.5(8) = 5$. Hence

$$Y(z) = \\frac{5}{1-0.5z^{-1}} = \\frac{5z}{z-0.5} \\qquad \\Longrightarrow \\qquad y[n] = 5(0.5)^{n}u[n]$$

Verify from the recursion: $y[0] = 0.5(8) + 1 = 5$, then
$y[1] = 0.5(5) = 2.5$, then 1.25, then 0.625 — exactly
$5(0.5)^{n}$.

The transfer function $H(z) = 1/(1-0.5z^{-1})$ describes only the zero-state
part of this, whose impulse response is $(0.5)^{n}u[n]$ and whose first
sample is 1, not 5. The other four units of that first sample come from the
initial condition, which no transfer function can express, because H(z) is
defined by assuming the initial state is zero.

*Trap:* answering $(0.5)^{n}u[n]$ from the transfer function alone and
ignoring $y[-1]$. That is off by a factor of five at every sample.`,
        examTip: 'Stability questions are answered from pole MAGNITUDES, never from coefficients. For a monic quadratic with complex roots the constant term is the squared pole magnitude, so a single square root settles it; confirm the roots are complex first by checking that b squared is less than 4c, and otherwise solve for the two real roots and check each against the unit circle separately.',
      },
    ],
    keyTakeaways: [
      'Z-Transform: X(z) = sum over all n from −infinity to +infinity of x[n]·z^(−n); converts difference equations to algebra.',
      'z = e^(sT) maps continuous s-plane to discrete z-plane; jω axis → unit circle.',
      'Discrete BIBO stability: all poles must satisfy |pᵢ| < 1 (inside unit circle).',
      'Key pairs: u[n] → z/(z−1), aⁿ·u[n] → z/(z−a), n·aⁿ·u[n] → az/(z−a)².',
      'Inverse Z-Transform: divide by z, partial fractions, multiply by z, table lookup.',
      'Time delay by k samples → multiply by z^(−k) in z-domain.',
    ],
  },

  /* ──────────────────────────────────────────────────────────────────
   * TOPIC 8 — SIGNAL PROCESSING  (4 curriculum IDs)
   * ────────────────────────────────────────────────────────────────── */

fee_bode_sketching: {
  topicId: 'fee_bode_sketching',
  title: `Bode Plot Sketching Techniques`,
  domainWeight: 'Linear Systems · 4–6%',
  overview: `Bode plots are the workhorse graphical tool of control engineers. The FE exam tests both reading Bode plots (given a plot, identify the transfer function) and sketching them (given a transfer function, draw the asymptotic magnitude and phase). Mastering the rules lets you sketch in <30 seconds vs minutes of detailed calculation. This topic covers the asymptotic rules, corner frequency identification, gain/phase margin reading, and the common transfer function patterns the exam loves.`,
  sections: [
    {
      id: 'bode-fundamentals',
      title: `1. Bode Plot Fundamentals and Asymptotic Rules`,
      content: `## 1.1 What is a Bode plot

A Bode plot has TWO sub-plots, both versus log-scale frequency (typically rad/s):

1. **Magnitude plot** — |H(jω)| in dB on the y-axis (linear), log ω on x-axis
2. **Phase plot** — ∠H(jω) in degrees on the y-axis (linear), log ω on x-axis

The log-log nature of the magnitude plot makes asymptotic approximation possible — straight lines that change slope at "corner frequencies."

## 1.2 The decibel convention

For a transfer function H(s):

  $\\lvert H(j\\omega)\\rvert _{\\mathrm{dB}} = 20\\log _{10}\\lvert H(j\\omega)\\rvert$

Examples:
- |H| = 1 → 0 dB
- |H| = 10 → 20 dB
- |H| = 100 → 40 dB
- |H| = 0.1 → -20 dB
- |H| = √2 → 3 dB
- |H| = 1/√2 → -3 dB

Memorize: every factor of 10 in magnitude = 20 dB. Every factor of 2 ≈ 6 dB. The -3 dB point is where the magnitude has dropped to 70.7% of peak.

## 1.3 The asymptotic rule for each factor

A transfer function is decomposed into FACTORS, each contributing to the total Bode plot:

| Factor in H(s) | Magnitude slope | Phase contribution |
|---|---|---|
| Constant K | 20·log₁₀(K) dB everywhere | $0^\\circ if K > 0, \\pm 180^\\circ if K < 0$ |
| Pole at origin: 1/s | -20 dB/decade | -90° everywhere |
| Zero at origin: s | +20 dB/decade | +90° everywhere |
| Real pole 1/(s/p + 1) | 0 below p, -20 dB/decade above p | 0° below p/10, -90° above p·10, -45° at p |
| Real zero (s/z + 1) | 0 below z, +20 dB/decade above z | 0° below z/10, +90° above z·10, +45° at z |
| Complex pole pair | 0 below ωₙ, -40 dB/decade above | 0° to -180° transition centered at ωₙ |
| Complex zero pair | 0 below ωₙ, +40 dB/decade above | 0° to +180° transition centered at ωₙ |

Each factor contributes ADDITIVELY (because log of a product = sum of logs).

![Exact magnitude and phase of a single real pole overlaid on the straight-line rules. The magnitude sketch is essentially exact a decade from the corner and 3.01 dB high exactly at it; the phase ramp runs from a tenth of the corner frequency to ten times it, passing through minus 45 degrees at the corner itself.](/courses/fe-ee/figures/lsys-bode-first-order.svg)

The asymptotic rules carry a KNOWN, bounded error, which is what makes them
trustworthy. For a real pole, the magnitude sketch is 3 dB high at the
corner, about 1 dB off one octave to either side, and essentially exact
beyond a decade. The phase sketch is worst near p/10 and 10p, where the true
curve sits about 5.7 degrees away from the corner of the ramp. Knowing the
size of the error is what lets you draw the straight lines with confidence
everywhere else — and add the 3 dB correction only at the one frequency a
question actually interrogates.

## 1.4 The standard form for factoring

Bode plots use TIME-CONSTANT form, not pole-zero form. Convert:

  Pole-zero form: H(s) = K' · (s - $z_{1}$) / (s - $p_{1}$)
  Time-constant form: H(s) = K · (s/$z_{1}$ + 1) / (s/$p_{1}$ + 1)   (assuming $p_{1}$, $z_{1}$ are not at origin)

In time-constant form, the breakpoint of each factor is the "1" — i.e., the corner frequency for a factor (s/p + 1) is ω = p.

The DC gain K in time-constant form is the magnitude at ω → 0.

## 1.5 Sketching procedure

1. **Convert H(s) to time-constant form**
2. **Identify the DC gain K** — this sets the y-intercept of the low-frequency asymptote
3. **Mark each corner frequency** on the log-frequency axis
4. **Start the magnitude plot** at the low-frequency value:
   - If there's an s^n in the denominator: slope is -20·n dB/decade at low frequencies
   - If there's an s^n in the numerator: slope is +20·n dB/decade at low frequencies
   - Otherwise: slope is 0 (flat) at low frequencies
5. **At each corner frequency**, change the slope by:
   - +20 dB/decade for each zero at that frequency
   - -20 dB/decade for each pole at that frequency
6. **Repeat for phase** — phase changes by ±90° per factor, with the transition centered at the corner frequency

## 1.6 Example: H(s) = 10 · (s + 100) / (s · (s + 10))

Step 1: time-constant form:
  $$H(s) = 10 \\cdot (s/100 + 1) \\cdot 100 / (s \\cdot ((s/10 + 1) \\cdot 10))$$
       $$= 100 \\cdot (s/100 + 1) / (s \\cdot (s/10 + 1))$$

DC gain (as s → 0): the (s/100 + 1) → 1, the (s/10 + 1) → 1, so |H| → 100/s as s → 0. There's a pole at origin (s), so DC gain is undefined; the magnitude goes to infinity as ω → 0.

Step 2: corner frequencies: ω = 10 (pole), ω = 100 (zero)

Step 3: start of magnitude plot:
- Pole at origin: slope -20 dB/decade everywhere as starting condition
- Pick a low frequency, say ω = 1: |H| ≈ |100/1| / |1| = 100 = 40 dB
- So the curve passes through 40 dB at ω = 1, going down at -20 dB/decade

Step 4: change slopes at corners:
- At ω = 10 (pole): slope goes from -20 to -40 dB/decade
- At ω = 100 (zero): slope goes from -40 to -20 dB/decade

Step 5: continue with -20 dB/decade above ω = 100

Step 6: phase:
- Constant: 0°
- Pole at origin: -90° everywhere
- Pole at ω = 10: 0° below 1, -45° at 10, -90° above 100 (transition centered at 10)
- Zero at ω = 100: 0° below 10, +45° at 100, +90° above 1000 (transition centered at 100)

Total phase: start at -90° (just from origin pole), transition to -180° (origin pole + $p_{1}$ pole) around ω = 10, transition back up by 90° (zero) around ω = 100, ending at -90° at high frequency.`,
      examTip: `Always start in time-constant form. Identify corner frequencies. Start with low-frequency asymptote. Change slope at each corner. Use ±20 dB/decade per pole/zero of multiplicity.`,
    },
    {
      id: 'gain-phase-margins',
      title: `2. Gain and Phase Margins from Bode Plots`,
      content: `## 2.1 Why we care about margins

For a negative-feedback control loop with open-loop transfer function L(s) = G(s)·H(s), STABILITY of the CLOSED loop depends on how far the open-loop response is from the -1 point (in Nyquist sense), or equivalently from 0 dB and -180° on Bode plots.

Gain and phase margins quantify this distance:

- **Gain Margin (GM)**: how much MORE gain can be added before instability
- **Phase Margin (PM)**: how much MORE phase lag can be added before instability

Both should be POSITIVE for stability; larger = more robust.

## 2.2 Reading gain margin from Bode plot

1. Find the PHASE CROSSOVER frequency ω_pc — where the phase plot crosses -180°
2. At ω_pc, read the magnitude in dB
3. Gain Margin = -|M(ω_pc)| in dB (i.e., the magnitude reading expressed as a negative number is the gain margin if magnitude is below 0)

If |L(jω_pc)| < 0 dB → GM > 0 (system is stable; can add up to GM more gain before instability)
If |L(jω_pc)| > 0 dB → GM < 0 (system is UNSTABLE)

## 2.3 Reading phase margin from Bode plot

1. Find the GAIN CROSSOVER frequency ω_gc — where the magnitude plot crosses 0 dB
2. At ω_gc, read the phase in degrees
3. Phase Margin = phase(ω_gc) - (-180°) = phase(ω_gc) + 180°

If phase at ω_gc is -135° → PM = -135 + 180 = 45°
If phase at ω_gc is -180° → PM = 0° (system is on the boundary of stability)
If phase at ω_gc is -200° → PM = -20° (system is UNSTABLE)

## 2.4 Typical design targets

For a well-designed control loop:

- **Gain Margin**: 6-12 dB (factor of 2 to 4)
- **Phase Margin**: 45-60° for good transient response

PM < 30° usually means oscillatory response.
PM > 70° usually means overdamped, slow response.

## 2.5 Relating PM to damping ratio

For a second-order closed loop with PM degrees, the damping ratio is approximately:

  ζ ≈ PM / 100   (PM in degrees)

So PM = 45° → ζ ≈ 0.45 (under-damped but stable response)
PM = 70° → ζ ≈ 0.7 (near-critical damping, smooth response)

This is rough but useful for ballpark design.

## 2.6 The conditional stability case

Some systems have MULTIPLE phase crossovers (e.g., a complicated transfer function whose phase curves cross -180° at multiple frequencies). Such systems may be stable for a RANGE of gains and unstable above or below. Bode plot alone may not fully characterize this; Nyquist plot is more reliable for complex cases.

The exam typically gives simpler systems with a single PM and GM to read.

## 2.7 Closed-loop bandwidth from Bode plot

For a unity-feedback loop with open-loop L(s), the closed-loop BANDWIDTH is approximately equal to the gain crossover frequency ω_gc.

This is useful for design: choose ω_gc to match the desired closed-loop bandwidth.`,
      examTip: `Memorize: ω_gc = where |L| = 0 dB. ω_pc = where ∠L = -180°. PM = ∠L(ω_gc) + 180°. GM = -|L(ω_pc)| dB. Both should be positive for stability.`,
    },
    {
      id: 'common-patterns',
      title: `3. Common Transfer Function Patterns the Exam Tests`,
      content: `## 3.1 First-order low-pass

  $$H(s) = K / (s/p + 1)$$

- DC gain: K (= 20·$\\log _{10}$ K dB)
- Corner frequency: ω = p
- Magnitude slope: 0 below p, -20 dB/decade above
- Phase: 0° below p/10, -45° at p, -90° above p·10
- -3 dB point: at ω = p

Used for: simple RC low-pass filters, first-order systems.

## 3.2 First-order high-pass

  H(s) = K · (s/z) / (s/z + 1)   or equivalently K · s / (s + z)

- DC gain: 0 (-∞ dB)
- Corner frequency: ω = z
- Magnitude slope: +20 dB/decade below z, 0 above
- Phase: +90° at low freq, +45° at z, 0° at high freq

## 3.3 Second-order low-pass

  $$H(s) = \\omega _{n}^{2} / (s^{2} + 2\\zeta \\omega _{n}s + \\omega _{n}^{2})$$

- DC gain: 1 (0 dB)
- Natural frequency: ωₙ
- Damping ratio: ζ
- Magnitude slope: 0 below ωₙ, -40 dB/decade above
- Peak in magnitude at ωₙ if ζ < 0.707 (resonant peak; height = 1/(2ζ√(1-ζ²))
- Phase: 0° at low freq, -90° at ωₙ, -180° at high freq

For ζ = 0.5: 1.25 dB resonant peak. For ζ = 0.1: 14 dB peak. For ζ ≥ 0.707: no peak.

## 3.4 Pole at origin (integrator)

  $$H(s) = 1/s$$

- Magnitude: -20 dB/decade everywhere; passes through 0 dB at ω = 1
- Phase: -90° everywhere
- DC gain: infinite (signal not bounded)

Used as: integrator in op-amp circuits, type-1 control system.

## 3.5 Lead compensator

  H(s) = K · (s/z + 1) / (s/p + 1)   where z < p

- Adds POSITIVE phase between z and p (peak phase add at √(zp))
- Used to add phase margin to a control loop
- Increases bandwidth

## 3.6 Lag compensator

  H(s) = K · (s/z + 1) / (s/p + 1)   where z > p

- Adds gain at low frequencies; -20 dB/decade between p and z
- Reduces steady-state error
- Reduces bandwidth

## 3.7 PID controller

  $$H(s) = K_p + K_i/s + K_d\\cdot s$$

In transfer function form often written:
  $$H(s) = K_p \\cdot (1 + 1/(T_i\\cdot s) + T_d\\cdot s)$$

- The integral term (K_i/s) provides infinite DC gain — eliminates steady-state error to step input
- The derivative term (K_d·s) adds phase lead and improves transient response
- Tuning: Ziegler-Nichols, Cohen-Coon, or trial-and-error

PID is the most common controller. The Bode plot of a PID has -20 dB/decade at very low frequency (integrator), flat in midband (proportional), and +20 dB/decade at high frequency (derivative).

## 3.8 Quick recognition table for exam

| Bode pattern | Likely transfer function |
|---|---|
| Flat then -20 dB/dec | First-order LP, single real pole |
| -20 dB/dec then flat | First-order HP, single real zero |
| Flat then -40 dB/dec | Second-order LP, complex pole pair |
| -20 dB/dec at all freq | Integrator 1/s |
| +20 dB/dec at all freq | Differentiator s |
| Peak in magnitude | Underdamped 2nd-order or RLC resonance |
| Multiple slope changes | Higher-order system; identify each corner |

## 3.9 The exam pattern

A typical FE Bode question:

"The Bode magnitude plot of H(s) shows a constant slope of -40 dB/decade above ω = 5 rad/s and flat below. The DC gain is 1. Estimate H(s)."

Answer:
- -40 dB/decade slope above one corner = TWO poles at that corner
- Either (s/5 + 1)² or a complex pair with ωₙ ≈ 5
- DC gain 1 → no constant other than 1
- H(s) ≈ 1 / ((s/5 + 1)²) = 25 / (s + 5)²

Or if the magnitude shows a peak near 5 rad/s, the answer is a complex pair:
  H(s) = 25 / (s² + 2ζ·5·s + 25) for some ζ < 0.707`,
      examTip: `Recognize the slope: -20 = one pole. -40 = two poles. Recognize where the change happens: that's a corner frequency. Read DC gain from the flat low-frequency portion (in linear units, 0 dB = gain 1).`,
    },
  ],
  keyTakeaways: [
    'Convert H(s) to time-constant form. Identify DC gain K and each corner frequency.',
    'Each real pole adds -20 dB/decade above its corner. Each real zero adds +20 dB/decade. Complex pairs add ±40 dB/decade.',
    'Phase changes ±90° per factor, centered at corner frequency with transition band ±1 decade',
    '20 log scale: factor of 10 = 20 dB; factor of 2 ≈ 6 dB; -3 dB = half-power point',
    'Gain Margin: -|L| at phase-crossover ω_pc (where phase = -180°). Stable if GM > 0.',
    'Phase Margin: ∠L + 180° at gain-crossover ω_gc (where |L| = 0 dB). Stable if PM > 0. Target 45-60°.',
    'Rough approximation: damping ratio ζ ≈ PM(degrees)/100. PM 45° gives ζ ≈ 0.45 (well-damped second order).',
  ],
},

};
