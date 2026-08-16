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
| **BIBO Stability** | ∫\|h(t)\| $dt < \\infty$ | Bounded inputs produce bounded outputs |

## 2.2 BIBO Stability

A system is **Bounded-Input Bounded-Output (BIBO) stable** if every bounded input produces a bounded output. For LTI systems, this is equivalent to:

**$\\int _{-}\\infty ^\\infty |h(t)| dt < \\infty$** (continuous-time)

**$\\Sigma |h[n]| < \\infty$** (discrete-time)

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
| $h(t) = e^(-$ |t\|) | Two-sided | No | Yes (integral = 2) |
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
other, which is exactly why those are the two numbers to read first.`,
        examTip: 'Overshoot depends on the damping ratio alone; speed depends on the natural frequency alone. If an exam question changes wn but not zeta, the response curve stretches in time without changing shape — same overshoot, scaled peak and settling times. Spotting this saves recomputing everything from scratch.',
        importantNote: 'The settling-time formula ts = 4/(zeta*wn) uses the 2% criterion; some references use 3/(zeta*wn) for the 5% band. FE answer choices are spaced widely enough that either convention identifies the correct option, but state which band you are using in your scratch work to avoid second-guessing.',
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

**$x(t) = a_{0} + \\Sigma a_{n}\\cdot \\cos (n\\omega _{0}t) + \\Sigma b_{n}\\cdot \\sin (n\\omega _{0}t)$**

The **complex exponential form** is more compact:

**$x(t) = \\Sigma c_{n} \\cdot e^{j2\\pi nf_{0}t}$**

where **$c_{n} = (1/T_{0}) \\int x(t) \\cdot e^{-j2\\pi nf_{0}t} dt$**

| Signal Type | Representation | Spectrum |
|---|---|---|
| Periodic | Fourier Series | **Discrete** — spikes at harmonics nf₀ |
| Aperiodic | Fourier Transform | **Continuous** — smooth amplitude vs. frequency |

## 1.2 Fourier Transform (Aperiodic Signals)

The **Fourier Transform** extends analysis to non-periodic signals:

**$X(f) = \\int x(t) \\cdot e^{-j2\\pi ft} dt$**

**Inverse: x(t) = ∫ X(f) · e^(j2πft) df**

### Key Properties

- **Linearity**: α·$x_{1}$ + β·$x_{2}$ → α·$X_{1}$ + β·$X_{2}$
- **Time shift**: x(t − $t_{0}$) → X(f) · e^(−j2πft₀)
- **Frequency shift**: x(t) · e^(j2πf₀t) → X(f − $f_{0}$)
- **Convolution theorem**: x(t) * h(t) ↔ X(f) · H(f)
- **Parseval's theorem**: ∫|x(t)|² dt = ∫|X(f)|² df (energy conservation)

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

**$X(s) = \\int _{0}^\\infty x(t) \\cdot e^{-st} dt$** where **$s = \\sigma + j\\omega$**

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
x(t) = x(∞) + [x(0) - x(∞)]e^(-t/tau) with tau = 0.5 s. Both theorems check
it without inverting anything: the Final Value Theorem gives
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

## 4.4 Resonance is a pole pair close to the jω axis

Resonance, met in the circuits chapters as X_L cancelling X_C, reappears
here as geometry: a lightly damped complex pole pair sitting near the
imaginary axis makes |H(jω)| peak as $\\omega$ sweeps past. The band-pass
standard form shows the anatomy:

**$H(s) = (\\omega _{0}/Q)s / (s^{2} + (\\omega _{0}/Q)s + \\omega _{0}^{2})$**

Its magnitude peaks at exactly $\\omega _{0}$ and falls to the half-power
level at two frequencies whose separation is the bandwidth:

**$BW = \\omega _{0}/Q$**

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
    ],
    keyTakeaways: [
      'Fourier Series (discrete spectrum) for periodic signals; Fourier Transform (continuous spectrum) for aperiodic.',
      'Laplace Transform X(s) = ∫x(t)e^(−st)dt converts ODEs to algebraic equations in s.',
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
it costs one glance at the pole list.`,
        examTip: 'For any sinusoidal steady-state question, resist solving anything in the time domain: substitute s = jw, convert one complex number to polar form, and write the answer. The entire method is |H| times the amplitude and angle-of-H added to the phase — two operations, no integrals, no transients.',
        importantNote: 'The feedback formula T = G/(1+GH) assumes the loop sign is NEGATIVE at the summing junction. If the diagram shows positive feedback, the denominator becomes 1 - GH, and a loop that was stable can stop being so. Check the sign at the junction before reducing — it is the single most consequential symbol in the diagram.',
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

**$X(z) = \\Sigma x[n] \\cdot z^{-n}$** (sum over all n)

The **unilateral Z-Transform** (causal sequences, n ≥ 0) is standard for digital control and FE exam problems.

### Essential Z-Transform Pairs

| Time Domain x[n] | Z-Domain X(z) | ROC |
|---|---|---|
| $\\delta [n]$ | 1 | All z |
| u[n] | $z/(z-1)$ | \|z\| $> 1$ |
| $a^{n}\\cdot u[n]$ | $z/(z-a)$ | \|z\| > \|a\| |
| $n\\cdot a^{n}\\cdot u[n]$ | $az/(z-a)^{2}$ | \|z\| > \|a\| |
| $n\\cdot u[n]$ | $z/(z-1)^{2}$ | \|z\| $> 1$ |
| $\\cos (\\omega _{0}n)\\cdot u[n]$ | $z(z-\\cos  \\omega _{0})/(z^{2}-2z \\cos  \\omega _{0}+1)$ | \|z\| $> 1$ |

### Key Properties

- **Linearity**: Z{α·$x_{1}$ + β·$x_{2}$} = α·$X_{1}$(z) + β·$X_{2}$(z)
- **Time shift**: Z{x[n−k]} = z^(−k)·X(z) — delay by k samples multiplies by z^(−k)
- **Convolution**: Z{x[n]*h[n]} = X(z)·H(z)
- **Initial value**: x[0] = lim(z→∞) X(z)
- **Final value**: lim(n→∞) x[n] = lim(z→1) (z−1)·X(z) (if stable)

## 1.2 Region of Convergence (ROC)

The ROC specifies where the Z-Transform sum converges:

- **Causal signals**: ROC is the exterior of a circle \|z\| > r₊
- **Anti-causal signals**: ROC is the interior \|z\| < r₋
- **Two-sided signals**: ROC is an annular ring r₋ < \|z\| < r₊
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
| Left half-plane (LHP) | **Inside** unit circle \|z\| $< 1$ | Decaying (stable) |
| Imaginary axis (jω) | **On** unit circle \|z\| $= 1$ | Sustained oscillation |
| Right half-plane (RHP) | **Outside** unit circle \|z\| $> 1$ | Growing (unstable) |

### Discrete-Time Stability

For discrete systems, **BIBO stability requires all poles inside the unit circle**:

**$\\|p_{i}\\| < 1$** for all poles pᵢ

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

Both poles (\|0.5\| < 1 and \|0.8\| < 1) are inside the unit circle → **stable**.

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
row is the bridge itself: sampling $e^{-at}$ every T seconds produces the
geometric sequence with ratio $a = e^{-aT}$, which is the mapping
z = e^(sT) acting on one concrete signal rather than on an abstract plane.`,
        examTip: 'The three-check habit from the step-response example - first sample against h[0], second against a direct convolution sum, final value against H(1) - costs under a minute and catches nearly every partial-fraction slip. On multiple-choice questions, often the final-value check ALONE eliminates three options.',
        importantNote: 'For a monic quadratic z^2 + bz + c with complex roots, the pole magnitude is sqrt(c) - the constant term is the squared magnitude. Confirm the roots are actually complex (b^2 < 4c) before using this; for real roots each must be checked against the unit circle individually.',
      },
    ],
    keyTakeaways: [
      'Z-Transform: X(z) = Σ x[n]·z^(−n); converts difference equations to algebra.',
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

  |H(jω)|_dB = 20 · $\\log _{10}$ |H(jω)|

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
